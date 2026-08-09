// world.js — the world is now a single generated DUNGEON LEVEL (see level.js):
// a themed graph of rooms + corridors, ringed by high walls, floating in the
// abyss. Terrain is a lookup into that level rather than an infinite field, but
// the renderer- and sim-facing API is unchanged: heightAt / materialAt /
// isWalkable / resourceAt / propAt are still pure functions of (world, x, y),
// and the whole level is a pure function of (seed, theme) so saves reproduce it.

import { hash2, fbm, streamSeed, mulberry32, STREAM } from './rng.js';
import { generateLevel, THEME_KEYS, FLOOR_Z, WALL_Z } from './level.js';

export const CHUNK = 32;
export const TILE = 16;

// Material classification. Renderer maps each to a palette ramp + emissive rule.
export const MAT = {
  ABYSS: 'abyss', WATER: 'water', SOIL: 'soil', FLESH: 'flesh', BONE: 'bone',
  POISON: 'poison', SAND: 'sand', BASALT: 'basalt', LAVA: 'lava', EMBER: 'ember', CHASM: 'chasm', OBSID: 'obsid',
};
// Materials you cannot stand on (hazard pools, void, and open water).
export const NONWALK = new Set([MAT.ABYSS, MAT.WATER, MAT.POISON, MAT.LAVA, MAT.EMBER]);

const clampi = (v, a, b) => (v < a ? a : v > b ? b : v);
const K = (x, y) => x + ',' + y;

export function createWorld(seed, theme) {
  const th = theme || THEME_KEYS[(seed >>> 0) % THEME_KEYS.length];
  const level = generateLevel(seed, th);
  const world = {
    seed, theme: th, level,
    ss: streamSeed(seed, 131),            // floor-material selector
    hs: streamSeed(seed, 7919),           // cliff-face strata / detail
    cs: streamSeed(seed, 577),            // hazard field
    spawn: level.spawn,
    props: new Map(),                     // "x,y" -> kind (baked once, below)
    mods: new Map(),                      // "x,y" -> { cleared: true }
    hp: new Map(),                        // "x,y" -> remaining hits
  };
  // one decorative prop per room, offset from its center onto solid floor
  const prng = mulberry32(streamSeed(seed, 321));
  const kinds = ['spire', 'monolith', 'totem'];
  for (const r of level.rooms) {
    if (prng() < 0.25) continue;
    const ox = Math.round((prng() - 0.5) * r.rw), oy = Math.round((prng() - 0.5) * r.rh);
    const px = r.cx + ox, py = r.cy + oy, c = level.cells.get(K(px, py));
    if (c && c.kind === 'floor' && !c.corridor) world.props.set(K(px, py), kinds[(prng() * kinds.length) | 0]);
  }
  return world;
}

const cellAt = (world, x, y) => world.level.cells.get(K(x, y));

// Elevation: floor platforms sit at FLOOR_Z, walls tower at WALL_Z, the abyss is 0.
export function heightAt(world, x, y) {
  const c = cellAt(world, Math.floor(x), Math.floor(y));
  if (!c) return 0;
  return c.kind === 'wall' ? (c.wz ?? WALL_Z) : FLOOR_Z;
}

// Hazard field: blobby pools of the theme's hazard material across open floor.
function hazardAt(world, x, y) {
  const th = world.level.th;
  return fbm(x * th.hazardScale, y * th.hazardScale, world.cs + 909) > th.hazardCut;
}

// Material: abyss off-platform, the theme's wall on the ring, else a noise-picked
// floor material with hazard pools cut into open (non-corridor) ground.
export function materialAt(world, x, y) {
  const tx = Math.floor(x), ty = Math.floor(y), c = cellAt(world, tx, ty);
  if (!c) return MAT.ABYSS;
  const th = world.level.th;
  if (c.kind === 'wall') return th.wall;
  if (!c.corridor && hazardAt(world, tx, ty)) return th.hazard;
  const bag = th.floors;
  const i = clampi(Math.floor(fbm(tx * 0.11, ty * 0.11, world.ss) * bag.length), 0, bag.length - 1);
  return bag[i];
}

// Harvestable growths — scattered on open, safe floor only (never corridors,
// walls, hazards, or void). Mods overlay removals.
export function resourceAt(world, x, y) {
  if (world.mods.has(K(x, y))) return null;
  const c = cellAt(world, x, y);
  if (!c || c.kind !== 'floor' || c.corridor) return null;
  const m = materialAt(world, x, y);
  if (NONWALK.has(m)) return null;
  const r = hash2(x, y, streamSeed(world.seed, STREAM.WORLD) + 888);
  if (r < 0.028) return 'tree';
  if (r > 0.990) return 'rock';
  return null;
}

// Static props: the per-room decor baked in createWorld.
export function propAt(world, x, y) {
  return world.props.get(K(x, y)) || null;
}

// Walkable if on a floor cell whose material isn't a hazard, the step up is at
// most one level (walls are far taller), and nothing occupies the tile.
export const MAX_CLIMB = 1;
export function isWalkable(world, x, y, fromZ) {
  const tx = Math.floor(x), ty = Math.floor(y), c = cellAt(world, tx, ty);
  if (!c || c.kind !== 'floor') return false;
  if (NONWALK.has(materialAt(world, tx, ty))) return false;
  if (fromZ !== undefined && heightAt(world, tx, ty) - fromZ > MAX_CLIMB) return false;
  if (resourceAt(world, tx, ty)) return false;
  if (propAt(world, tx, ty)) return false;
  return true;
}

export const chunkOf = (t) => Math.floor(t / CHUNK);

export function hitResource(world, tx, ty) {
  const kind = resourceAt(world, tx, ty);
  if (!kind) return null;
  const key = K(tx, ty);
  const left = (world.hp.get(key) ?? 3) - 1;
  if (left <= 0) { world.hp.delete(key); world.mods.set(key, { cleared: true }); return { destroyed: true, kind }; }
  world.hp.set(key, left);
  return { destroyed: false, kind };
}
