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

export function createWorld(seed, theme, depth = 0) {
  const th = theme || THEME_KEYS[(seed >>> 0) % THEME_KEYS.length];
  const level = generateLevel(seed, th);
  const world = {
    seed, theme: th, depth, level,
    ss: streamSeed(seed, 131),            // floor-material selector
    hs: streamSeed(seed, 7919),           // cliff-face strata / detail
    cs: streamSeed(seed, 577),            // hazard field
    spawn: level.spawn,
    props: new Map(),                     // "x,y" -> kind
    mods: new Map(),                      // "x,y" -> { cleared } | { opened }
    hp: new Map(),                        // "x,y" -> remaining hits
    discovered: new Set(),                // room ids seen (minimap fog)
  };
  // Populate rooms: decor, doorway braziers, and loot (chest / shrine). The
  // descent gate goes in the farthest room. All snap onto solid, open floor.
  const prng = mulberry32(streamSeed(seed, 321));
  const decor = ['spire', 'monolith', 'totem'];
  const place = (px, py, kind) => {
    const k = K(px, py), c = level.cells.get(k);
    if (c && c.kind === 'floor' && !c.corridor && !world.props.has(k)) { world.props.set(k, kind); return true; }
    return false;
  };
  const off = (r, f) => Math.round((prng() - 0.5) * r.rw * 2 * f);
  for (const r of level.rooms) {
    const bo = Math.max(2, Math.floor(Math.min(r.rw, r.rh) * 0.55));
    place(r.cx - bo, r.cy, 'brazier'); place(r.cx + bo, r.cy, 'brazier');   // doorway lights
    if (prng() < 0.7) place(r.cx + off(r, 0.4), r.cy + off(r, 0.4), decor[(prng() * decor.length) | 0]);
    if (prng() < 0.55) place(r.cx + off(r, 0.35), r.cy + off(r, 0.35), 'chest');
    if (prng() < 0.30) place(r.cx + off(r, 0.35), r.cy + off(r, 0.35), 'shrine');
  }
  if (level.descentRoom) world.props.set(K(level.descentRoom.cx, level.descentRoom.cy), 'stairs');
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
// Pools spread as you descend (lower threshold = more hazard, deeper = deadlier).
function hazardAt(world, x, y) {
  const th = world.level.th;
  const cut = Math.max(0.34, th.hazardCut - world.depth * 0.045);
  return fbm(x * th.hazardScale, y * th.hazardScale, world.cs + 909) > cut;
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
  const k = K(x, y);
  if (world.mods.has(k) || world.props.has(k)) return null;
  const c = cellAt(world, x, y);
  if (!c || c.kind !== 'floor' || c.corridor) return null;
  const m = materialAt(world, x, y);
  if (NONWALK.has(m)) return null;
  const r = hash2(x, y, streamSeed(world.seed, STREAM.WORLD) + 888);
  if (r < 0.028) return 'tree';
  if (r > 0.990) return 'rock';
  return null;
}

// Props: room decor + functional gates/loot. A looted chest / spent shrine is
// consumed via the mods overlay (opened) and stops rendering + blocking.
export function propAt(world, x, y) {
  const k = K(x, y);
  if (world.mods.get(k)?.opened) return null;
  return world.props.get(k) || null;
}
export const CONSUMABLE_PROP = new Set(['chest', 'shrine']);

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
