// plans.test.mjs — the Hollow Vale's authored dungeon plans (src/sim/plans.js, docs/vale-dungeons-plan.md) keep the
// owner's rules: two floors at most, five spaces a floor at most, halls 8 wide or more, a progression with an offshoot,
// the band's levels over the two floors, and each plan's site and bosses the sim's own.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { PLANS, PLAN_RULES, checkPlan, sizeOf } from '../src/sim/plans.js';
import { SITES } from '../src/sim/sites.js';

test('plans: every Vale plan keeps the owner\'s rules (≤ 2 floors, ≤ 5 spaces, halls ≥ 8 wide, joined, no overlaps)', () => {
  for (const p of Object.values(PLANS)) assert.deepEqual(checkPlan(p), [], p.site);
});

test('plans: each floor runs entrance → rooms → its last hall, with one offshoot, and levels climb the band', () => {
  for (const p of Object.values(PLANS)) {
    assert.ok(SITES[p.site] && SITES[p.site].region === 'vale', `${p.site} is a Vale site`);
    assert.equal(p.base, SITES[p.site].base, `${p.site}: the band's base as sites.js has it`);
    p.floors.forEach((f, fi) => {
      assert.equal(f.spaces.filter((s) => s.role === 'offshoot').length, 1, `${p.site} floor ${fi + 1}: one offshoot`);
      const last = f.spaces.find((s) => s.role === 'descent' || s.role === 'end');
      const fights = f.spaces.filter((s) => s.role === 'room');
      assert.ok(fights.length >= 2, `${p.site} floor ${fi + 1}: two rooms or more before its hall`);
      if (!p.flat) {
        assert.ok(fights.every((s) => s.lv <= /** @type {any} */ (last).lv), `${p.site} floor ${fi + 1}: no room above its hall`);
        assert.equal(/** @type {any} */ (last).lv, fi + 1, `${p.site} floor ${fi + 1}: the hall a level up`);
      }
    });
    if (!p.flat) assert.equal(Math.max(...p.floors.flatMap((f) => f.spaces.map((s) => s.lv))), 2, `${p.site}: the band's top is +2`);
  }
});

test('plans: the bosses stand where the band wants them, and are the sim\'s own', () => {
  const bosses = Object.fromEntries(Object.values(PLANS).map((p) => [p.site, p.floors.flatMap((f) => f.spaces.filter((s) => s.boss).map((s) => [s.boss, p.base + s.lv]))]));
  assert.deepEqual(bosses.barrows, [['quartermaster', 3]]);
  assert.deepEqual(bosses.wickham_keep, [['goblin_chief', 5], ['redhand_captain', 6]]);
  assert.deepEqual(bosses.sunken_chapel, [['robed_stranger', 8], ['standard', 9]]);
  for (const [site, list] of Object.entries(bosses)) for (const [b] of list) assert.ok(Object.values(SITES[site].bosses || {}).includes(b), `${site}: ${b} is one of its bosses today`);
});

test('plans: the rules catch a plan that breaks them', () => {
  const p = structuredClone(PLANS.barrows);
  p.floors[0].halls[0].h = 6;                                           // a hall 6 wide
  p.floors[0].spaces.push({ ...p.floors[0].spaces[1], id: 'sixth', x: 200 });   // a sixth space, unjoined
  p.floors.push(p.floors[1]);                                           // a third floor
  const bad = checkPlan(p).join('\n');
  for (const want of ['3 floors', '6 spaces', '6 wide', 'sixth can\'t be reached']) assert.ok(bad.includes(want), `${want} in:\n${bad}`);
  assert.equal(sizeOf({ w: 78, h: 20 }), 'gallery'); assert.equal(sizeOf({ w: 24, h: 22 }), 'small'); assert.equal(sizeOf({ w: 58, h: 46 }), 'large');
  assert.equal(PLAN_RULES.hallMinW, 8);
});
