// plans.test.mjs — the authored dungeon plans (the Hollow Vale's, and the Greywater Fens' from v1.102) (src/sim/plans.js, docs/vale-dungeons-plan.md) keep the
// owner's rules: two floors at most, five spaces a floor at most, halls 10 wide, a progression with an offshoot,
// the band's levels over the two floors, and each plan's site and bosses the sim's own.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { PLANS, PLAN_RULES, checkPlan, sizeOf } from '../src/sim/plans.js';
import { SITES } from '../src/sim/sites.js';

test('plans: every plan keeps the owner\'s rules (≤ 2 floors, ≤ 5 spaces, halls 10 wide, joined, no overlaps)', () => {
  for (const p of Object.values(PLANS)) assert.deepEqual(checkPlan(p), [], p.site);
});

test('plans: each floor runs entrance → rooms → its last hall, with one offshoot, and levels climb the band', () => {
  for (const p of Object.values(PLANS)) {
    if (SITES[p.site] && SITES[p.site].arena) continue;          // (the Bowl's sand: a way in and the sand, test/bowl.test.mjs)
    assert.ok(SITES[p.site] && (['vale', 'fens', 'reach', 'tidemark', 'heights'].includes(SITES[p.site].region) || (SITES[p.site].parked && SITES[p.site].region === 'greenwood')), `${p.site} is a site of a land`);   // (the Reach since v1.124, the Tidemark since v1.150; a parked prototype may wait on a land not built: the Heights' (docs/pass-dungeon.md), the greenwood's)
    assert.equal(p.base, SITES[p.site].base, `${p.site}: the band's base as sites.js has it`);
    p.floors.forEach((f, fi) => {
      assert.equal(f.spaces.filter((s) => s.role === 'offshoot').length, 1, `${p.site} floor ${fi + 1}: one offshoot`);
      const last = f.spaces.find((s) => s.role === 'descent' || s.role === 'end');
      const fights = f.spaces.filter((s) => s.role === 'room');
      assert.ok(fights.length >= 2, `${p.site} floor ${fi + 1}: two rooms or more before its hall`);
      if (!p.flat) {
        assert.ok(fights.every((s) => s.lv <= /** @type {any} */ (last).lv), `${p.site} floor ${fi + 1}: no room above its hall`);
        const up = fi === p.floors.length - 1 ? 1 : Math.max(1, (p.step || 1) - 1);   // (v1.150: a band of five's first floor spans three levels, its hall two up)
        assert.equal(/** @type {any} */ (last).lv, fi * (p.step || 1) + up, `${p.site} floor ${fi + 1}: the hall a level up`);   // (v1.144: `step` levels a floor, the Reach's two)
      }
    });
    if (!p.flat) assert.equal(Math.max(...p.floors.flatMap((f) => f.spaces.map((s) => s.lv))), (p.floors.length - 1) * (p.step || 1) + 1, `${p.site}: the band's top`);
    if (!p.flat && SITES[p.site].span) assert.equal(SITES[p.site].base + Math.max(...p.floors.flatMap((f) => f.spaces.map((s) => s.lv))), SITES[p.site].base + SITES[p.site].span - 1, `${p.site}: its top the band's`);
  }
});

test('plans: the bosses stand where the band wants them, and are the sim\'s own', () => {
  const bosses = Object.fromEntries(Object.values(PLANS).map((p) => [p.site, p.floors.flatMap((f) => f.spaces.filter((s) => s.boss).map((s) => [s.boss, p.base + s.lv]))]));
  assert.deepEqual(bosses.barrows, [['quartermaster', 3]]);
  assert.deepEqual(bosses.wickham_keep, [['goblin_chief', 5], ['redhand_captain', 6]]);
  assert.deepEqual(bosses.sunken_chapel, [['robed_stranger', 8], ['standard', 9]]);
  // (v1.102) the Fens: the Toadking and the Vatwarden at their bands' tops; the Abbey's three, Teague in his cell off the
  // cloister (a side room's own boss: battle.js sideBoss), the Choir in the first floor's hall, the Abbess in the second's
  assert.deepEqual(bosses.toadking_mound, [['toadking', 12]]);
  assert.deepEqual(bosses.canal_locks, [['vatwarden', 15]]);
  assert.deepEqual(bosses.drowned_abbey, [['teague', 17], ['drowned_choir', 17], ['abbess_below', 18]]);
  // (v1.144) the Reach in bands of four: the Foreman and the Weighmaster at their tops; the Cinderworks' three, Oruth in the
  // Forgehall's hall (its first floor), Morrow Vane in the furnace hall (a room's own), the Stoker at Furnace Nine
  assert.deepEqual(bosses.cold_seam, [['foreman', 22]]); assert.deepEqual(bosses.assay_yards, [['weighmaster', 26]]);
  assert.deepEqual(bosses.cinderworks, [['oruth', 28], ['morrow_vane', 29], ['stoker', 30]]);
  for (const p of Object.values(PLANS)) p.floors.forEach((f, d) => { for (const s of f.spaces) if (s.boss) {
    if (s.role === 'offshoot' || s.role === 'room') assert.ok(!Object.values(SITES[p.site].bosses || {}).includes(s.boss), `${p.site}: ${s.boss} a side room's own, no hall's`);   // (a room's too, v1.144: Morrow Vane's furnace hall)
    else assert.equal((SITES[p.site].bosses || {})[d + 1], s.boss, `${p.site} floor ${d + 1}: ${s.boss} its hall's`);
  } });
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
