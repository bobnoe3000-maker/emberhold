// A full bag never costs an heirloom (GDD v1.127; the owner, 2026-11-16: "yes guard heirlooms when the bag is full").
// There's one of each and most are found once (a boss's first fall, a chain, a vault), so one that won't fit isn't
// salvaged or left where it fell, as other gear is (salvagefee.test.mjs): it's held for the company (state.held) and goes
// in the bag the first tick it has room. Held heirlooms are saved (v53) and count as owned (the Ring's and the raid
// coffer's once-only checks).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createSim } from '../src/sim/core.js';
import { createLoot, BAG_SIZE } from '../src/sim/loot.js';
import { makeItem, HEIRLOOMS } from '../src/sim/items.js';

const fill = (bag) => { for (let i = 0; i < BAG_SIZE; i++) bag.push(makeItem('dagger', 1 + i, 'fine', { uid: 'b' + i, aff: [['hp', i + 1]] })); };   // (each its own slot)
const ID = Object.keys(HEIRLOOMS)[0];

test('an heirloom found with the bag full and the purse empty is held, not lost or salvaged; other gear is still left', () => {
  const bag = []; fill(bag);
  const ev = [], state = { bag, party: [], counters: { gold: 0, embers: 0 } }, bus = { emit: (k, e) => { if (k === 'loot') ev.push(e); } };
  const loot = createLoot({ state, bus, seed: 1 });
  const it = loot.grant(ID, { ilv: 10, x: 0, y: 0, src: 'boss', cls: 'fighter' });
  assert.equal(it.r, 'heirloom');
  assert.deepEqual(state.held.map((q) => q.uid), [it.uid], 'held'); assert.ok(!state.bag.includes(it), 'not in the full bag');
  assert.equal(state.counters.embers, 0, 'not salvaged'); assert.equal(state.counters.gold, 0);
  assert.ok(ev[0].held && !ev[0].left && !ev[0].salvaged && ev[0].best === null);
  state.counters.gold = 1e6; loot.grant(ID, { ilv: 10, x: 0, y: 0, src: 'boss', cls: 'fighter' });
  assert.equal(state.held.length, 2, 'held even when the purse would cover the fee: never salvaged');
  const g = loot.give(makeItem('ring', 5, 'fine', { uid: 'f1', aff: [['hp', 3]] }), 'expedition');
  assert.ok(g.salvaged > 0, 'other gear: as before');
  loot.release(); assert.equal(state.held.length, 2, 'no room: still held');
  state.bag.pop(); loot.release();
  assert.equal(state.held.length, 1); assert.ok(state.bag.includes(it), 'the first one in, once there was room');
  assert.ok(ev.at(-1).released && ev.at(-1).item === it);
});

test('in play: held through a save, into the bag the tick a slot frees, and counted as owned', () => {
  const s = createSim(20260807, undefined, { scene: 'town' }); s.tick();
  s.state.bag.length = 0; fill(s.state.bag); s.state.counters.gold = 0;
  const h = makeItem('dagger', 5, 'fine', { uid: 'x' }); h.r = 'heirloom'; h.name = HEIRLOOMS[ID].name; s.state.held = [h];
  const snap = JSON.parse(JSON.stringify(s.snapshot()));
  assert.equal(snap.held.length, 1, 'saved');
  const t = createSim(20260807, undefined, { scene: 'town' }); t.restore(snap); t.tick();
  assert.equal(t.state.held.length, 1, 'restored, still held: the bag is full'); assert.ok(!t.state.bag.some((q) => q.uid === 'x'));
  t.state.counters.gold = 1000; t.commands.push({ type: 'salvage', uid: 'b0' }); t.tick(); t.tick();
  assert.equal(t.state.held.length, 0); assert.ok(t.state.bag.some((q) => q.uid === 'x'), 'in the bag once a slot was freed');
  const none = JSON.parse(JSON.stringify(createSim(20260807, undefined, { scene: 'town' }).snapshot()));
  assert.ok(!('held' in none), 'nothing held: the save as it was');
});
