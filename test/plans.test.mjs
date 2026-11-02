// plans.test.mjs — the Hollow Vale's authored dungeon plans (src/sim/plans.js, docs/vale-dungeons-plan.md) keep the
// owner's rules: two floors at most, five spaces a floor at most, halls 10 wide, a progression with an offshoot,
// the band's levels over the two floors, and each plan's site and bosses the sim's own.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { PLANS, PLAN_RULES, checkPlan, sizeOf } from '../src/sim/plans.js';
import { SITES } from '../src/sim/sites.js';

test('plans: every Vale plan keeps the owner\'s rules (≤ 2 floors, ≤ 5 spaces, halls 10 wide, joined, no overlaps)', () => {
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
  assert.equal(PLAN_RULES.hallMinW, 10);                                 // (the owner, 2026-11-02: "halls 10")
});

// (2026-11-02, built: the owner, "Same layout every visit") the sim builds each floor from its plan: its rooms where drawn,
// the same whatever the seed (only a dug room's ragged edge and the furniture move), each at its plan's level, the halls
// 10 wide and safe, every room reached, the stair up in the entrance and the stairs down in the descent room
test('plans, built: each floor where its plan draws it, the same every visit, its halls 10 wide, its ways open', async () => {
  const { createWorld } = await import('../src/sim/world.js');
  for (const p of Object.values(PLANS)) p.floors.forEach((f, d) => {
    const a = createWorld(20260807, undefined, d, p.site), b = createWorld(777, undefined, d, p.site), L = a.level;
    assert.ok(L.plan, `${p.site} ${d + 1}: built from its plan`);
    assert.deepEqual(L.rooms.map((r) => r.part), f.spaces.map((s) => s.id));
    assert.deepEqual(L.rooms.map((r) => [r.x0, r.y0, r.x1, r.y1]), b.level.rooms.map((r) => [r.x0, r.y0, r.x1, r.y1]), `${p.site} ${d + 1}: the same rooms, any seed`);
    const key = (w) => [...w.level.cells].filter(([, c]) => c.kind === 'floor' && (c.room < 0 || w.level.rooms[c.room].shape !== 'cave')).map(([k]) => k).sort().join(';');
    assert.equal(key(a), key(b), `${p.site} ${d + 1}: the built floor the same every visit (bar a cave's edge)`);
    for (const r of L.rooms) {
      const s = f.spaces.find((q) => q.id === r.part), c = L.cells.get(r.cx + ',' + r.cy);
      assert.ok(c && c.kind === 'floor' && c.room === r.id, `${p.site} ${r.part}: its middle is its floor`);
      assert.equal(r.x1 - r.x0 + 1, s.w); assert.equal(r.y1 - r.y0 + 1, s.h);
      if (r !== L.entrance) assert.equal(a.roomLevels.get(r.id), SITES[p.site].flat ? p.base : p.base + s.lv, `${p.site} ${r.part}: its level`);
    }
    const across = (h) => { const alongX = f.spaces.some((s) => h.x === s.x + s.w || h.x + h.w === s.x); return alongX ? h.h : h.w; };
    for (const h of f.halls) assert.equal(across(h), 10, `${p.site} ${h.from} → ${h.to}: 10 wide`);
    const corridor = [...L.cells.values()].filter((c) => c.corridor && c.room < 0).length;
    assert.ok(corridor >= f.halls.reduce((n, h) => n + h.w * h.h, 0), `${p.site} ${d + 1}: the halls are safe ground`);
    // every room reached from the way in
    const K = (x, y) => x + ',' + y, start = K(Math.floor(L.spawn.x), Math.floor(L.spawn.y)), seen = new Set([start]), q = [start];
    for (let i = 0; i < q.length; i++) { const [x, y] = q[i].split(',').map(Number); for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const n = K(x + dx, y + dy), c = L.cells.get(n); if (c && c.kind === 'floor' && !seen.has(n)) { seen.add(n); q.push(n); } } }
    for (const r of L.rooms) assert.ok(seen.has(K(r.cx, r.cy)), `${p.site} ${r.part}: reached from the way in`);
    assert.ok(a.exitAt, `${p.site} ${d + 1}: a stair up`);
    assert.equal(!!a.stairsAt, d < p.floors.length - 1, `${p.site} ${d + 1}: stairs down only above the last floor`);
  });
});
