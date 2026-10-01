// Every floor keeps its ways open: from the way in you can walk to the stairs down (anywhere on the
// stairwell's rim) or a last hall's vault chest, back to the stair up, and to where you arrive coming
// back up. A sweep of 200 floors as the game builds them found 26 whose stair up stood behind a room's
// pool (world.js keepTheWaysOpen now drains a strip) and 29 with no stair up at all: every
// diamond-shaped entrance (level.js now builds it as a rectangle). Either way, once you were down
// there was no walking out of the floor.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createSim } from '../src/sim/core.js';
import { createWorld, isWalkable, heightAt, propAt } from '../src/sim/world.js';
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

test('the floors whose stair up a pool cut off: a strip is drained, and they open', () => {
  for (const [site, seed, depth] of [['barrows', 23757, 1], ['barrows', 31676, 0], ['sunken_chapel', 23757, 1], ['sunken_chapel', 63352, 0], ['wickham_keep', 197975, 1]]) {
    const { w, shut } = ways(site, seed, depth);
    assert.deepEqual(shut, [], `${site} ${seed} floor ${depth + 1}`);
    assert.ok(w.dry && w.dry.size > 0, `${site} ${seed} floor ${depth + 1}: a strip of pool drained`);
  }
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
