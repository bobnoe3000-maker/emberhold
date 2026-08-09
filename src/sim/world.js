// world.js — infinite chunked world, Dreadforge classification. Terrain is a pure
// function of (x, y, seed): elevation z∈[0,7], a corruption field, and a material
// per tile. Only player modifications (mods) are stored — saves = seed + diffs.
// Headless: zero DOM. All generation is deterministic and seed-partitioned.

import { hash2, fbm, streamSeed, STREAM } from './rng.js';

export const CHUNK = 32;           // tiles per chunk side
export const TILE = 16;            // px per tile at native scale

// Materials (classification, not composition). Renderer maps each to a palette ramp.
export const MAT = { WATER: 'water', SOIL: 'soil', FLESH: 'flesh', BONE: 'bone', POISON: 'poison' };

const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);

export function createWorld(seed) {
  return {
    seed,
    ws: streamSeed(seed, STREAM.WORLD),   // resources
    hs: streamSeed(seed, 7919),           // height field
    cs: streamSeed(seed, 577),            // corruption field
    ss: streamSeed(seed, 131),            // material selector
    // corruption epicenter — a seeded heart the corruption spreads from
    corrX: 12 + Math.floor(hash2(1, 2, seed) * 22),
    corrY: 8 + Math.floor(hash2(3, 4, seed) * 22),
    mods: new Map(),                      // "x,y" -> { cleared: true }
    hp: new Map(),                        // "x,y" -> remaining hits
  };
}

// Elevation z ∈ [0,7]. Relief eases in with distance from origin so the spawn
// sits on a broad flat (no cliff ring trapping the player). z ≤ 1 is void water.
export function heightAt(world, x, y) {
  let e = fbm(x * 0.09, y * 0.09, world.hs, 4);
  e = (e - 0.5) * 1.5 + 0.5;
  const ridge = Math.abs(fbm(x * 0.05, y * 0.05, world.hs + 101, 2) - 0.5) * 2;
  e += 0.25 * ridge;
  const z = clamp(Math.round(e * 7), 0, 7);
  const base = 3, k = Math.min(1, Math.hypot(x, y) / 22);
  return clamp(Math.round(base + (z - base) * k), 0, 7);
}

// Corruption field: independent fbm + radial falloff from the seeded heart.
// > threshold classifies as corrupted (poison). Spread grows from one heart.
export function corruptionAt(world, x, y) {
  const c = fbm(x * 0.13, y * 0.13, world.cs, 3);
  const d = Math.hypot(x - world.corrX, y - world.corrY);
  const fall = Math.max(0, 1 - d / 44);
  return c * 0.55 + fall * 0.7;
}
const CORRUPT_THRESHOLD = 0.72;

// Material classification: water at z≤1; corruption overrides; bone shale up high;
// else ashen soil with flesh-growth patches where selector noise is high.
export function materialAt(world, x, y) {
  const z = heightAt(world, x, y);
  if (z <= 1) return MAT.WATER;
  if (corruptionAt(world, x, y) > CORRUPT_THRESHOLD) return MAT.POISON;
  if (z >= 5) return MAT.BONE;
  return fbm(x * 0.11, y * 0.11, world.ss, 2) > 0.70 ? MAT.FLESH : MAT.SOIL;   // flesh = patches, soil is the base
}

// Harvestable growths (kept from Phase 0 so the tap-loop survives the pivot):
// 'tree' = bonegrowth, 'rock' = obsidian shard. On dry land only; mods overlay removals.
export function resourceAt(world, x, y) {
  if (world.mods.has(x + ',' + y)) return null;
  const m = materialAt(world, x, y);
  if (m === MAT.WATER || m === MAT.POISON) return null;
  const r = hash2(x, y, world.ws + 888);
  if (r < 0.020) return 'tree';        // bonegrowth (sparser than the meadow's trees)
  if (r > 0.992) return 'rock';        // obsidian shard
  return null;
}

// Walkable if: not water, not a resource, and (when a from-height is given) the
// target is not a higher WALL — you can step up at most one level and descend
// any amount, so the character moves over all terrain but tall cliffs. core.js
// threads the mover's current tile height in.
export const MAX_CLIMB = 1;
export function isWalkable(world, x, y, fromZ) {
  const tx = Math.floor(x), ty = Math.floor(y);
  if (materialAt(world, tx, ty) === MAT.WATER) return false;
  if (fromZ !== undefined && heightAt(world, tx, ty) - fromZ > MAX_CLIMB) return false;
  if (resourceAt(world, tx, ty)) return false;
  return true;
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
