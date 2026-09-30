// gear: seeded rolls, class kits reproduce the GDD level-1 numbers, XP table matches the curve
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { makeMember, statsFor, xpToNext } from '../src/sim/party.js';
import { rollItem, makeItem } from '../src/sim/items.js';
import { createSim } from '../src/sim/core.js';
import { mulberry32 } from '../src/sim/rng.js';

test('a fresh character in their class kit has exactly the GDD level-1 stats (a fighter: 14 DEF +10 % for the shield)', () => {
  const gdd = { fighter: [140, 12, 15.4, 5, 5], rogue: [100, 13, 8, 15, 15], mage: [80, 14, 6, 8, 5], cleric: [125, 11, 12, 5, 5] };
  for (const [cls, [hp, atk, def, crit, dodge]] of Object.entries(gdd)) {
    const s = statsFor(makeMember('t', 'T', cls, 1));
    assert.deepEqual([s.maxHp, s.atk, s.def, s.crit, s.dodge], [hp, atk, def, crit, dodge], cls);
  }
});
test('item rolls are a pure function of the stream', () => {
  const a = rollItem(mulberry32(42), { ilv: 5, rarity: 'rare', classes: ['fighter'], uid: 'u' });
  const b = rollItem(mulberry32(42), { ilv: 5, rarity: 'rare', classes: ['fighter'], uid: 'u' });
  assert.deepEqual(a, b);
  assert.equal(a.aff.length, 2); assert.ok(a.mod);
});
test('XP table matches round(100 × L^1.6)', () => {
  for (let L = 1; L <= 60; L++) assert.equal(xpToNext(L), Math.round(100 * Math.pow(L, 1.6)));
});

// Difficulty (GDD §7.1, 2026-09-30): gear grows twice as fast with item level, so old gear falls
// behind; an item's stats are re-derived from (base, ilv, rarity) on load, so old loot follows suit.
test('gear grows with item level; a load re-derives an item\'s stats, keeping what was rolled', () => {
  const a = makeItem('sword', 1), b = makeItem('sword', 6), c = makeItem('sword', 11);
  assert.ok(b.st.atk - a.st.atk >= 3, 'five levels of sword: 3+ ATK');
  assert.ok(Math.abs((c.st.atk - b.st.atk) - (b.st.atk - a.st.atk)) <= 1, 'linear in item level');
  const sim = createSim(7), m = sim.state.party[0];
  m.gear.weapon = { ...makeItem('sword', 6, 'fine', { uid: 'old', aff: [['crit', 2]], name: 'Keen Sword' }), st: { atk: 2, crit: 1 } };   // stats from an older formula
  const b2 = createSim(7); b2.restore(JSON.parse(JSON.stringify(sim.snapshot())));
  const w = b2.state.party[0].gear.weapon;
  assert.deepEqual(w.st, makeItem('sword', 6, 'fine').st); assert.deepEqual(w.aff, [['crit', 2]]); assert.equal(w.name, 'Keen Sword'); assert.equal(w.uid, 'old');
});
