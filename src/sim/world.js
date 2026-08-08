// world.js — infinite chunked world. Terrain is a pure function of (x, y, seed);
// only player modifications (mods) are stored. Saves later = seed + mods. Headless.

import { hash2, fbm, streamSeed, STREAM } from './rng.js';

export const CHUNK = 32;           // tiles per chunk side
export const TILE = 16;            // px per tile at native scale

export const T = { WATER: 0, DIRT: 1, GRASS: 2 };

export function createWorld(seed) {
  return {
    seed,
    ws: streamSeed(seed, STREAM.WORLD),
    mods: new Map(),               // "x,y" -> { cleared: true }  (harvested resources)
    hp: new Map(),                 // "x,y" -> remaining hits on a resource
  };
}

export function tileType(world, x, y) {
  const h = fbm(x / 9, y / 9, world.ws);
  return h < 0.40 ? T.WATER : h < 0.53 ? T.DIRT : T.GRASS;
}

// Resource placement is also pure — mods overlay removals.
export function resourceAt(world, x, y) {
  if (world.mods.has(x + ',' + y)) return null;
  const t = tileType(world, x, y);
  if (t === T.WATER) return null;
  const r = hash2(x, y, world.ws + 888);
  if (t === T.GRASS && r < 0.050) return 'tree';
  if (r > 0.988) return 'rock';
  return null;
}

export function isWalkable(world, x, y) {
  const tx = Math.floor(x), ty = Math.floor(y);
  if (tileType(world, tx, ty) === T.WATER) return false;
  if (resourceAt(world, tx, ty)) return false;
  return true;
}

// 8-neighbor same-terrain mask for the autotiler. pred receives a tile type.
export function neighborMask(world, x, y, pred) {
  const at = (dx, dy) => pred(tileType(world, x + dx, y + dy));
  let m = 0;
  if (at(0, -1)) m |= 1;   if (at(1, -1)) m |= 2;
  if (at(1, 0))  m |= 4;   if (at(1, 1))  m |= 8;
  if (at(0, 1))  m |= 16;  if (at(-1, 1)) m |= 32;
  if (at(-1, 0)) m |= 64;  if (at(-1, -1)) m |= 128;
  return m;
}

export const chunkOf = (t) => Math.floor(t / CHUNK);

// Hit a resource. Returns { destroyed, kind } or null if nothing there.
export function hitResource(world, tx, ty) {
  const kind = resourceAt(world, tx, ty);
  if (!kind) return null;
  const key = tx + ',' + ty;
  const left = (world.hp.get(key) ?? 3) - 1;
  if (left <= 0) {
    world.hp.delete(key);
    world.mods.set(key, { cleared: true });
    return { destroyed: true, kind };
  }
  world.hp.set(key, left);
  return { destroyed: false, kind };
}
