// Every floor keeps its ways open: from the way in you can walk to the stairs down (anywhere on the
// stairwell's rim) or a last hall's vault chest, back to the stair up, and to where you arrive coming
// back up. A sweep of 200 floors as the game builds them found 26 whose stair up stood behind a room's
// pool (world.js keepTheWaysOpen now drains a strip) and 29 with no stair up at all: every
// diamond-shaped entrance (level.js now builds it as a rectangle). Either way, once you were down
// there was no walking out of the floor.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createSim } from '../src/sim/core.js';
import { createWorld, isWalkable, heightAt, propAt, materialAt, NONWALK, DRESS } from '../src/sim/world.js';
import { hasFloorBelow } from '../src/sim/sites.js';

const K = (x, y) => x + ',' + y;
function reach(w) {
  const s = w.level.spawn, q = [[Math.floor(s.x), Math.floor(s.y)]], seen = new Set([K(...q[0])]);
  for (let h = 0; h < q.length; h++) { const [x, y] = q[h], z = heightAt(w, x, y); for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const k = K(x + dx, y + dy); if (!seen.has(k) && isWalkable(w, x + dx + 0.5, y + dy + 0.5, z)) { seen.add(k); q.push([x + dx, y + dy]); } } }
  return seen;
}
// a tile you can stand on within `r` of a spot
const near = (seen, a, r) => { for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) { const x = Math.floor(a.x) + dx, y = Math.floor(a.y) + dy; if (seen.has(K(x, y)) && Math.hypot(x + 0.5 - a.x, y + 0.5 - a.y) < r) return true; } return false; };
// the floor the game builds (core.js seeds each site's floors from the game's seed)
function floor(site, seed, depth) {
  const s = createSim(seed, undefined, { scene: 'dungeon', site }); if (depth) s.restore({ ...JSON.parse(JSON.stringify(s.snapshot())), depth, floors: [] });
  return s.world;
}
// the stairs are used from any tile beside the stairwell (core.js REACH)
const rim = (w, seen) => { const S = w.stairwell; if (!S) return near(seen, { x: w.stairsAt.x + 0.5, y: w.stairsAt.y + 0.5 }, 1.6); for (let y = S.y0 - 1; y <= S.y1; y++) for (let x = S.x0 - 1; x <= S.x1; x++) if ((x < S.x0 || x >= S.x1 || y < S.y0 || y >= S.y1) && seen.has(K(x, y))) return true; return false; };
function ways(site, seed, depth) {
  const w = floor(site, seed, depth), seen = reach(w), shut = [];
  if (hasFloorBelow(site, depth) && (!w.stairsAt || propAt(w, w.stairsAt.x, w.stairsAt.y) !== 'stairs' || !rim(w, seen))) shut.push('stairs down');
  if (w.vault) { const [x, y] = w.vault.key.split(',').map(Number); if (!near(seen, { x: x + 0.5, y: y + 0.5 }, 1.6)) shut.push('vault'); }
  if (!w.exitAt || !near(seen, w.exitAt, 1.6)) shut.push('stair up');
  if (w.stairsDownArrive && !near(seen, w.stairsDownArrive, 1.6)) shut.push('back-up arrival');
  return { w, shut };
}

test('the floors whose stair up a pool cut off: open, and with the pools gone (2026-10-04) nothing is drained', () => {
  for (const [site, seed, depth] of [['barrows', 23757, 1], ['barrows', 31676, 0], ['sunken_chapel', 23757, 1], ['sunken_chapel', 63352, 0], ['wickham_keep', 197975, 1]]) {
    const { w, shut } = ways(site, seed, depth);
    assert.deepEqual(shut, [], `${site} ${seed} floor ${depth + 1}`);
    assert.ok(!w.dry || w.dry.size === 0, `${site} ${seed} floor ${depth + 1}: nothing to drain`);
  }
});

// The owner, 2026-10-04: "In stone floor dungeons lets eliminate black non traversable tiles … In a room like the
// green floor, just make all the tiles traversable … we will place some pillars or other obstacles … Its too hard
// now to navigate a room." Every room's floor walks; one or two standing obstacles (a pillar, a monolith, a
// gibbet) out on its open floor, with open floor all round.
test('no hazard pools: every floor tile of every room is open ground, on every site and theme', () => {
  for (const site of ['barrows', 'tithe_mill', 'wickham_keep', 'sunken_chapel', 'scrag_warren', 'toadking_mound', 'canal_locks', 'sickpools', 'drowned_abbey']) for (const seed of [104729, 209458]) {
    let w; try { w = floor(site, seed, 0); } catch (e) { continue; }   // (a site this checkout doesn't have)
    for (const [k, c] of w.level.cells) {
      if (c.kind !== 'floor') continue;
      const [x, y] = k.split(',').map(Number);
      assert.ok(!NONWALK.has(materialAt(w, x, y)), `${site} ${seed}: ${materialAt(w, x, y)} at ${k}`);
    }
  }
});

test('one or two standing obstacles in each fighting room, out on the floor with room to walk round', () => {
  const OB = new Set(['pillar', 'monolith', 'gibbet', ...Object.values(DRESS).flatMap((k) => k.obstacles)]);   // (v1.48: each kit its own)
  let rooms = 0, total = 0;
  for (const site of ['barrows', 'wickham_keep', 'sunken_chapel']) for (const seed of [104729, 209458, 314187]) {
    const w = floor(site, seed, 0), L = w.level, seen = reach(w);
    for (const r of L.rooms) {
      if (r === L.entrance || r === L.descentRoom) continue;
      const mine = [...w.props].filter(([k, kind]) => { if (!OB.has(kind)) return false; const [x, y] = k.split(',').map(Number), c = L.cells.get(k); return c && c.room === r.id && Math.abs(x - r.cx) <= r.rw * 0.45 && Math.abs(y - r.cy) <= r.rh * 0.45 && Math.hypot(x - r.cx, y - r.cy) > 4; });
      rooms++; total += mine.length;
      assert.ok(mine.length <= 2, `${site} ${seed} room ${r.id}: ${mine.length}`);
      for (const [k] of mine) { const [x, y] = k.split(',').map(Number); for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) assert.ok(seen.has(K(x + dx, y + dy)), `${site} ${seed}: boxed in beside ${k}`); }
    }
  }
  assert.ok(total >= rooms, `about one or two a room: ${total} in ${rooms}`);
});

test('the floors with no stair up (a diamond-shaped entrance): a rectangular hall with its stair', () => {
  for (const [site, seed, depth] of [['sunken_chapel', 15838, 0], ['wickham_keep', 55433, 1], ['tithe_mill', 110866, 0], ['barrows', 87109, 0]]) {
    const { w, shut } = ways(site, seed, depth);
    assert.equal(w.level.entrance.shape, 'rect'); assert.ok(w.exitAt, `${site} ${seed}: a stair up`);
    assert.deepEqual(shut, [], `${site} ${seed} floor ${depth + 1}`);
  }
});

test('every site, a spread of seeds and floors: all the ways open', () => {
  for (const site of ['barrows', 'tithe_mill', 'wickham_keep', 'sunken_chapel']) for (let i = 1; i <= 4; i++) for (const depth of [0, 1, 2]) {
    if (depth && !hasFloorBelow(site, depth - 1)) continue;
    const { shut } = ways(site, i * 104729, depth);
    assert.deepEqual(shut, [], `${site} ${i * 104729} floor ${depth + 1}`);
  }
});

test('a floor that was already open is built as before (nothing drained)', () => {
  const w = createWorld(20260807, undefined, 0, 'barrows');
  assert.equal(w.dry, undefined); assert.notEqual(w.level.entrance.shape, 'diamond');
});
