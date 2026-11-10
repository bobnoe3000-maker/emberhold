// @ts-check
// camps.js — spawn points on the overland (GDD §10.3, v1.63; the owner, 2026-11-10: "a MVP of some overlap NPC spawn
// points that each map should have"). A land's map has small fights of its own between its town and its dungeons:
//   · a CAMP: a band at a fire, seen before it sees you (idle at its posts while it's full);
//   · a NEST: a burrow, nothing to see until the party comes near and its foes come out of it.
// Each holds one fight, its band, in an ARENA round it (battle.js fights it the way it fights a dungeon room: walk out
// and it's off, the band back whole). Cleared, it stands empty for its RESPAWN (sim seconds), then fills again; one fill
// in ELITE_EVERY has an elite in it. When each is next full is durable: state.camps[id] = { at, n } (save v37), at the
// sim time it fills, n how many times it has been cleared (the elite's draw and the quests count from it).
// Pure data and pure functions: positions in the overland's tiles (outdoor.js), the band's kinds battle.js ENEMIES'.
// Deterministic: a fill's elite and a nest's count are drawn from (seed, camp, n), nothing else.

import { mulberry32, streamSeed } from './rng.js';
import { hypot } from './detmath.js';

/**
 * @typedef {{ id: string, region: string, kind: 'camp' | 'nest', name: string, x: number, y: number, reach: number,
 *   arena: number, level: number, family: string, band: string[], min?: number, elite: number, respawn: number,
 *   posts?: [number, number][], face?: [number, number], hole?: [number, number], dress?: [string, number, number][] }} Camp
 */
/** every land's spawn points (each region's overland, outdoor.js; the Vale's two: GDD §10.3, world doc §3.1 v1.39)
 * @type {Camp[]} */
export const CAMPS = [
  // the Spit: three of Old Skarn's stragglers round a fire on the river's east bank above the Thornwick bridge, Col's
  // cow dead by it. Posts round the fire (offsets from x, y), each facing it.
  { id: 'vale_spit', region: 'vale', kind: 'camp', name: 'The Spit', x: 126, y: 120, reach: 7, arena: 11, level: 2,
    family: 'gobs', band: ['gob', 'gob', 'gob'], elite: 0.25, respawn: 600, posts: [[-2.2, 0.9], [2.1, 1.1], [0.3, -2.3]], face: [0, 0],
    // (its dressing, outdoor.js dressCamps: the fire in the middle, Col's cow dead beside it, a tent of somebody's sacking, what
    // fell off the carts, the bones of the last one; the owner: "it can be a dead cow, next to the fire")
    dress: [['cookfire', 0, 0], ['carcass', 3.2, -2.6], ['tent', -4.2, -3.6], ['sacks', 4.6, 2.4], ['crates', 5.2, 0.2], ['bones', -1.4, 3.6]] },
  // the ditch burrow: grave rats in Thornwick's palisade bank under the south wall's west corner tower, where the midden
  // goes over the wheat; one or two come out of the hole at whoever passes. (Here: the camera looks from the south-east,
  // and by the north and west walls the town stood in front of the fight, by the south wall's middle a grove; the east
  // wall is the compass's way in from the barrows, and the rats stopped every walk to town: level-design-rules.md §1.1)
  { id: 'vale_ditch', region: 'vale', kind: 'nest', name: 'The ditch burrow', x: 23, y: 177, reach: 5, arena: 9, level: 1,
    family: 'vermin', band: ['rat', 'rat'], min: 1, elite: 0.25, respawn: 300, hole: [0, 1.2], dress: [['burrow', 0, 0], ['bones', 2.2, 1.6]] },
];
export const CAMP_BY = Object.fromEntries(CAMPS.map((c) => [c.id, c]));
/** a land's spawn points @param {string} region */
export const campsOf = (region) => CAMPS.filter((c) => c.region === region);
/** battle.js's room id for a spawn point (a dungeon's rooms count up from 0: these never meet them) @param {number} i */
export const CAMP_ROOM = (i) => 9000 + i;

/** a spawn point's saved state (absent: full) @param {any} state @param {string} id */
export const campState = (state, id) => (state.camps && state.camps[id]) || { at: 0, n: 0 };
/** is it full (its band there to fight) at the sim's time? @param {any} state @param {Camp} c */
export const campUp = (state, c) => state.t >= campState(state, c.id).at;
/** this fill's band: its kinds, the elite (one in four fills, by the clear count) and a nest's one or two
 * @param {number} seed @param {Camp} c @param {number} n the times it has been cleared */
export function bandOf(seed, c, n) {
  const r = mulberry32(streamSeed(seed ^ (n * 2654435761 >>> 0), 0xca3b + c.id.length * 131 + c.x * 7 + c.y));
  const count = c.min ? c.min + Math.floor(r() * (c.band.length - c.min + 1)) : c.band.length;
  const elite = r() < c.elite;
  return { kinds: c.band.slice(0, count), elite };
}
/** where a band's foe i stands (a camp: its post round the fire; a nest: at the hole, a little apart) @param {Camp} c @param {number} i */
export function postOf(c, i) {
  if (c.posts) { const [dx, dy] = c.posts[i % c.posts.length]; return [c.x + dx, c.y + dy]; }
  const [hx, hy] = c.hole || [0, 0]; return [c.x + hx + (i ? 0.8 * (i % 2 ? 1 : -1) : 0), c.y + hy + 0.4 * i];
}
/** the spawn point whose arena holds (x, y) on this land, or null @param {Camp[]} list @param {number} x @param {number} y @param {'reach' | 'arena'} [by] */
export function campNear(list, x, y, by = 'arena') {
  for (let i = 0; i < list.length; i++) { const c = list[i]; if (hypot(x - c.x, y - c.y) <= c[by]) return { c, i }; }
  return null;
}
/** cleared now: empty until its respawn @param {any} state @param {Camp} c */
export function clearCamp(state, c) {
  const s = campState(state, c.id);
  (state.camps ||= {})[c.id] = { at: state.t + c.respawn, n: s.n + 1 };
}
/** the saved map, cleaned: only spawn points that exist, finite times @param {any} data */
export function campsFrom(data) {
  const out = {};
  for (const [k, v] of Object.entries(data || {})) if (CAMP_BY[k] && v && Number.isFinite(v.at) && Number.isInteger(v.n) && v.n >= 0) out[k] = { at: v.at, n: v.n };
  return out;
}
