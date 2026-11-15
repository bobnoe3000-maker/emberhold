// Salvage costs gold (GDD §8 v1.107; the owner, 2026-11-15: "Salvaging for embers should cost 50 gold for common and up
// to 500 for heirloom"): 50 / 100 / 250 / 500 a piece by rarity, on the bag's Salvage, the smith's every-plain-Common and
// a drop that finds the bag full (salvaged at once when the purse covers it, else left behind: a full bag is no way round
// the fee). Refused without the gold, with nothing changed.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createSim } from '../src/sim/core.js';
import { createLoot, BAG_SIZE } from '../src/sim/loot.js';
import { makeItem, SALVAGE, SALVAGE_GOLD, RARITIES } from '../src/sim/items.js';
import { salvageOf } from '../src/sim/smith.js';

const town = (gold) => { const s = createSim(20260807, undefined, { scene: 'town' }); Object.assign(s.state.counters, { gold, embers: 0 }); s.tick(); return s; };
const run = (s, cmd) => { s.commands.push(cmd); s.tick(); };

test('the fees: 50 a Common up to 500 an heirloom', () => {
  assert.deepEqual(RARITIES.map((r) => SALVAGE_GOLD[r]), [50, 100, 250, 500]);
});

test('salvaging a piece pays its fee; without the gold it is refused and nothing changes', () => {
  for (const r of ['common', 'fine', 'rare']) {
    const s = town(SALVAGE_GOLD[r] - 1), C = s.state.counters, refused = [];
    s.bus.on('gearRefused', (e) => refused.push(e.reason));
    s.state.bag.push(makeItem('dagger', 4, r, { uid: 'x', aff: r === 'common' ? undefined : [['hp', 5]] }));
    run(s, { type: 'salvage', uid: 'x' });
    assert.equal(refused.length, 1, `${r}: refused`); assert.ok(s.state.bag.some((it) => it.uid === 'x'), `${r}: still in the bag`);
    assert.equal(C.gold, SALVAGE_GOLD[r] - 1); assert.equal(C.embers, 0);
    C.gold = SALVAGE_GOLD[r] + 7; run(s, { type: 'salvage', uid: 'x' });
    assert.ok(!s.state.bag.some((it) => it.uid === 'x'), `${r}: salvaged`);
    assert.equal(C.gold, 7, `${r}: ${SALVAGE_GOLD[r]} gold taken`); assert.equal(C.embers, SALVAGE[r]);
  }
});

test('every plain Common at the smith: 50 gold each, refused if the purse is short', () => {
  const s = town(99), C = s.state.counters;
  s.state.bag.push(makeItem('dagger', 4, 'common', { uid: 'c1' }), makeItem('hood', 4, 'common', { uid: 'c2' }));
  run(s, { type: 'salvageCommons' });
  assert.equal(s.state.bag.filter((it) => it.uid === 'c1' || it.uid === 'c2').length, 2, 'refused at 99 gold'); assert.equal(C.gold, 99);
  C.gold = 100; run(s, { type: 'salvageCommons' });
  assert.equal(s.state.bag.filter((it) => it.uid === 'c1' || it.uid === 'c2').length, 0); assert.equal(C.gold, 0); assert.equal(C.embers, 2);
  const up = { ...makeItem('dagger', 4, 'common', { uid: 'u1' }), up: 3 };
  assert.equal(salvageOf(up), 1 + 8, 'half the upgrades\' cinders back, as before');
});

test('a full bag: a find is salvaged for its fee, or left behind when the purse is short (no free salvage)', () => {
  const bag = []; for (let i = 0; i < BAG_SIZE; i++) bag.push(makeItem('dagger', 1 + i, 'fine', { uid: 'b' + i, aff: [['hp', i + 1]] }));   // (each its own slot)
  const ev = [], state = { bag, party: [], counters: { gold: 300, embers: 0 } }, bus = { emit: (k, e) => { if (k === 'loot') ev.push(e); } };
  const loot = createLoot({ state, bus, seed: 1 });
  const a = loot.give(makeItem('ring', 5, 'rare', { uid: 'r1', aff: [['hp', 3]] }), 'expedition');
  assert.deepEqual(a, { salvaged: SALVAGE.rare, fee: 250, left: false }); assert.equal(state.counters.gold, 50); assert.equal(state.counters.embers, SALVAGE.rare);
  const b = loot.give(makeItem('ring', 5, 'fine', { uid: 'f1', aff: [['hp', 3]] }), 'expedition');
  assert.deepEqual(b, { salvaged: 0, fee: 0, left: true }); assert.equal(state.counters.gold, 50, 'nothing taken'); assert.equal(state.counters.embers, SALVAGE.rare, 'no cinders');
  assert.equal(state.bag.length, BAG_SIZE); assert.ok(ev[1].left && !ev[1].salvaged);
});
