// World lookups: the dense per-level caches in world.js (cells and materials as arrays) must give
// exactly what the level's string-keyed cell map and the material noise give, whatever order
// tiles are asked in: paths and fights read them, and replays must not move.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createSim } from '../src/sim/core.js';
import { heightAt, materialAt, isWalkable, MAT } from '../src/sim/world.js';

for (const seed of [20260807, 7, 99991]) test(`dense lookups match the level map, seed ${seed}`, () => {
  const a = createSim(seed, undefined, { scene: 'dungeon' }).world, b = createSim(seed, undefined, { scene: 'dungeon' }).world;
  const tiles = [...a.level.cells.keys()].map((k) => k.split(',').map(Number));
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (const [x, y] of tiles) { x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y); }
  const fwd = [], rev = [];
  for (let y = y0 - 2; y <= y1 + 2; y++) for (let x = x0 - 2; x <= x1 + 2; x++) {
    const c = a.level.cells.get(x + ',' + y);
    assert.equal(heightAt(a, x, y), c ? heightAt(a, x + 0.5, y + 0.5) : 0);
    if (!c) assert.equal(materialAt(a, x, y), MAT.ABYSS);
    fwd.push(materialAt(a, x, y) + (isWalkable(a, x + 0.5, y + 0.5) ? '+' : '-'));
  }
  for (let y = y1 + 2; y >= y0 - 2; y--) for (let x = x1 + 2; x >= x0 - 2; x--) rev.push(materialAt(b, x, y) + (isWalkable(b, x + 0.5, y + 0.5) ? '+' : '-'));
  assert.deepEqual(fwd, rev.reverse());
  assert.ok(!JSON.stringify(a.level).includes('_dense'), 'the cache never reaches a snapshot or a hash');
});
