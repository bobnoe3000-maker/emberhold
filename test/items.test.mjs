// gear: seeded rolls, class kits reproduce the GDD level-1 numbers, XP table matches the curve
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { makeMember, statsFor, xpToNext, xpRate } from '../src/sim/party.js';
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
// (GDD §7 v1.38, the owner, 2026-10-05: "Much slower level progression") each level 15 % longer to fight through,
// from 20 minutes for 1 → 2, at what the right party earns a minute in rooms of its own level (xpRate)
test('the XP table: 20 minutes of fighting for level 2, each level after 15 % longer; level 30 in ~126 h', () => {
  let h = 0;
  for (let L = 1; L <= 60; L++) {
    const mins = xpToNext(L) / xpRate(L);
    assert.ok(Math.abs(mins / (20 * Math.pow(1.15, L - 1)) - 1) < 0.006, `L${L}: ${mins.toFixed(1)} min`);
    assert.ok(Number.isInteger(xpToNext(L)) && (L === 1 || xpToNext(L) > xpToNext(L - 1)));
    if (L < 30) h += mins / 60;
  }
  assert.ok(h > 120 && h < 132, `1 → 30 in ${h.toFixed(1)} h of fighting`);
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
