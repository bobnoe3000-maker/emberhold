// The Homeward Scroll (items.js `homeward`, smith.js buyScroll, loot.js scroll, core.js useItem; GDD §8.3, 2026-10-03):
// 300 gold at the shop or rare loot; reading one takes the party to the town square, once. Never worn, upgraded or
// salvaged with the commons; a drop's scroll rides its own stream, so the gear rolls are as they were.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createSim } from '../src/sim/core.js';
import { BASES, SCROLL_PRICE } from '../src/sim/items.js';
import { createLoot } from '../src/sim/loot.js';
import { createBus } from '../src/sim/bus.js';

const run = (sim, cmd) => { sim.commands.push(cmd); sim.tick(); };
const scrolls = (sim) => sim.state.bag.filter((it) => it.base === 'homeward');

test('bought at the shop for 300 gold, in town only, with bag room; a scroll is never worn, forged or swept up', () => {
  const sim = createSim(20260807, undefined, { scene: 'town' }); sim.tick();
  const ev = []; sim.bus.on('refused', (e) => ev.push(e.reason));
  run(sim, { type: 'buyScroll' }); assert.equal(scrolls(sim).length, 0); assert.match(ev.pop(), /Not enough gold/);
  sim.state.counters.gold = 700;
  run(sim, { type: 'buyScroll' }); run(sim, { type: 'buyScroll' });
  assert.equal(scrolls(sim).length, 2); assert.equal(sim.state.counters.gold, 700 - 2 * SCROLL_PRICE);
  const s = scrolls(sim)[0], hero = sim.state.party[0];
  run(sim, { type: 'equip', member: hero.id, uid: s.uid }); assert.ok(sim.state.bag.includes(s), 'not worn');
  run(sim, { type: 'upgrade', uid: s.uid }); assert.ok(!s.up, 'not upgraded');
  run(sim, { type: 'salvageCommons' }); assert.equal(scrolls(sim).length, 2, '"salvage all commons" leaves scrolls');
  assert.equal(BASES.homeward.slot, 'use');
});

test('reading one in a dungeon takes the party to the town square and spends it; refused in town', () => {
  const sim = createSim(20260807, undefined, { scene: 'town' }); sim.tick();
  sim.state.counters.gold = 300; run(sim, { type: 'buyScroll' });
  const s = scrolls(sim)[0], ev = []; sim.bus.on('refused', (e) => ev.push(e.reason));
  run(sim, { type: 'useItem', uid: s.uid }); assert.match(ev.pop(), /already in town/); assert.equal(scrolls(sim).length, 1);
  const d = createSim(20260807, undefined, { scene: 'dungeon' }); d.tick();
  d.state.bag.push({ ...s }); const used = []; d.bus.on('itemUsed', (e) => used.push(e));
  run(d, { type: 'useItem', uid: 'nope' }); assert.equal(d.world.kind, 'dungeon', 'an item you do not have does nothing');
  run(d, { type: 'useItem', uid: s.uid });
  assert.equal(d.world.kind, 'town'); assert.equal(used.length, 1); assert.equal(scrolls(d).length, 0, 'spent');
  const sq = d.world.arrivals.default, p = d.state.player; assert.ok(Math.hypot(p.x - sq.x, p.y - sq.y) < 1, 'on the square');
});

test('a scroll turns up beside the drops now and then, on its own stream; it survives a save', () => {
  const state = { counters: { gold: 0, embers: 0, lootN: 0, uidN: 0 }, bag: [], party: [{ id: 'you', cls: 'fighter', level: 3, gear: {} }] };
  const loot = createLoot({ state, bus: createBus(), seed: 7 });
  for (let i = 0; i < 400; i++) { loot.drop('elite', { ilv: 3, x: 0, y: 0 }); state.bag = state.bag.filter((it) => it.base === 'homeward'); }
  const n = state.bag.length; assert.ok(n >= 6 && n <= 30, `${n} scrolls in 400 elites (4 % odds)`);
  const sim = createSim(20260807, undefined, { scene: 'town' }); sim.tick(); sim.state.counters.gold = 300; run(sim, { type: 'buyScroll' });
  const snap = JSON.parse(JSON.stringify(sim.snapshot())), back = createSim(20260807, undefined, { scene: 'town' }); back.restore(snap);
  assert.equal(scrolls(back).length, 1);
});
