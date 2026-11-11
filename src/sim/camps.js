// @ts-check
// camps.js — spawn points on the overland (GDD §10.3, v1.63; the owner, 2026-11-10: "a MVP of some overlap NPC spawn
// points that each map should have"). A land's map has small fights of its own between its town and its dungeons:
//   · a CAMP: a band at a fire, seen before it sees you (idle at its posts while it's full);
//   · a NEST: a burrow, its foes out at the hole while it's full (v1.67: the owner, "the rat nest should have already
//     pre-spawned rats out, like the goblin camp - so its obvious where it is"), on the party when it comes near;
// Each fights its band in an ARENA round it (battle.js fights it the way it fights a dungeon room: walk out and it's
// off, the band back whole). Cleared, it stands empty for its RESPAWN (sim seconds), then fills again, the next band
// coming on as a room's next wave does if the party is still in the arena; one fill
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
// (the owner, 2026-11-10: "increase the chase radius, I have to get right on top, and respawn should be half as fast as
// in the dungeons. Same radius and respawn rate change for the rat nest": reach 7 → 12 and 5 → 10, the arenas with them;
// a band back RESPAWN after it falls, twice a dungeon room's 4 s lull between waves (battle.js LULL), whether the party
// waits in the arena, as in a room, or walks off and comes back)
export const RESPAWN = 8;
/** the reach of each land's spawn points but the Spit's own 36 (v1.68: "similar wider aggro/chase radius") */
export const REACH_WIDE = 26;
/** every land's spawn points (each region's overland, outdoor.js; the Vale's two: GDD §10.3, world doc §3.1 v1.39)
 * @type {Camp[]} */
export const CAMPS = [
  // the Spit: three of Old Skarn's stragglers round a fire at the Vale's far east, just off the east road, Col's cow
  // dead by it (the owner, 2026-11-11: "move the goblin camp too the far east side of the map just off the road",
  // "triple the agro radius of the goblin camp": 194 tiles from Thornwick's gate, 6 north of the road, so the camera,
  // from the south-east, sees it across the road; they see you from 36 tiles, 12 before. First on the river above the
  // bridge (75 out), then past the crossroads (112)). Posts round the fire (offsets from x, y), each facing it.
  { id: 'vale_spit', region: 'vale', kind: 'camp', name: 'The Spit', x: 246, y: 142, reach: 36, arena: 40, level: 2,
    family: 'gobs', band: ['gob', 'gob', 'gob'], elite: 0.25, respawn: RESPAWN, posts: [[-2.2, 0.9], [2.1, 1.1], [0.3, -2.3]], face: [0, 0],
    // (its dressing, outdoor.js dressCamps: the fire in the middle, Col's cow dead beside it, a tent of somebody's sacking, what
    // fell off the carts, the bones of the last one; the owner: "it can be a dead cow, next to the fire")
    dress: [['cookfire', 0, 0], ['carcass', 3.2, -2.6], ['tent', -4.2, -3.6], ['sacks', 4.6, 2.4], ['crates', 5.2, 0.2], ['bones', -1.4, 3.6]] },
  // the ditch burrow: grave rats in Thornwick's palisade bank under the south wall's west corner tower, where the midden
  // goes over the wheat; one or two come out of the hole at whoever passes. (Here: the camera looks from the south-east,
  // and by the north and west walls the town stood in front of the fight, by the south wall's middle a grove; the east
  // wall is the compass's way in from the barrows, and the rats stopped every walk to town: level-design-rules.md §1.1)
  { id: 'vale_ditch', region: 'vale', kind: 'nest', name: 'The ditch burrow', x: 23, y: 177, reach: 18, arena: 22, level: 1,
    family: 'vermin', band: ['rat', 'rat'], min: 1, elite: 0.25, respawn: RESPAWN, hole: [0, 1.2], dress: [['burrow', 0, 0], ['bones', 2.2, 1.6]] },
  // ── the rest of each land's (GDD §10.3 v1.68; the owner, 2026-11-11: "each region or overworld map should also have 3
  // or 4 NPC spawn locations … with appropriate site dressing and appropriate NPC difficulty just like the 3 or so
  // dungeons per map … also ensure similar wider aggro/chase radius"). One at each of the land's bands, by the dungeon of
  // that band, well off every road (more than REACH_WIDE from any: a higher band's mustn't ambush a lower band's walk to its
// dungeon, as the first tries did), so each is a fight you choose, as a dungeon is; each sees you from REACH_WIDE, its
// arena 4 past it; none reaches a way in or out, or where anyone arrives.
  // the Redhand picket: three of Garrow's men camped on the hill east of the keep under a red banner, watching the old
  // road (the Keep's band, 4–6: level 5)
  { id: 'vale_picket', region: 'vale', kind: 'camp', name: "Garrow's picket", x: 202, y: 54, reach: REACH_WIDE, arena: REACH_WIDE + 4, level: 5,
    family: 'redhand', band: ['cutthroat', 'crossbow', 'brute'], elite: 0.25, respawn: RESPAWN, posts: [[-2.4, 0.6], [2.2, 1.2], [0.2, -2.4]], face: [0, 0],
    dress: [['cookfire', 0, 0], ['tent', -4.4, -3.4], ['banner', 3.4, -3.8], ['rack', 4.6, 1.8], ['barrels', -4.2, 2.8], ['crates', 5.2, -1.2], ['bedroll', -1.6, 3.8]] },
  // the old picket: Ashbound of the Third Legion still standing a picket at the river's southern bend, where the legion's
  // last picket fell, their standard in the ground ("Standing order 14: the Third Legion holds the Wickham road until
  // relieved"; the Chapel's band, 7–9: level 8)
  { id: 'vale_oldpicket', region: 'vale', kind: 'camp', name: 'The old picket', x: 118, y: 234, reach: REACH_WIDE, arena: REACH_WIDE + 4, level: 8,
    family: 'ashbound', band: ['warrior', 'minion', 'rogue'], elite: 0.25, respawn: RESPAWN, posts: [[-2.4, 0.4], [2.4, 0.6], [0, -2.6]], face: [0, 0],
    dress: [['standard', 0, -0.4], ['bones', -3.6, 2.4], ['bones', 3.2, 3.4], ['spoil', -4.4, -2.2], ['brokenpillar', 4.6, -2.6], ['rack', -1.4, -4.4], ['boulder', 5.4, 1.6]] },
  // the Fens' (10–18): the spinner beds, giant spiders in the reeds south-west of the Canal Locks (the Mound's band,
  // 10–12: level 11); the old stones, stone golems among standing stones north-east of Saltmere (the Locks' band, 13–15:
  // level 14); the drowned graves, graveyard wraiths over the binding clergy's sunk graves east of the Abbey, toward
  // Reedholm (the Abbey's band, 16–18: level 17)
  { id: 'fens_spinners', region: 'fens', kind: 'nest', name: 'The spinner beds', x: 60, y: 166, reach: REACH_WIDE, arena: REACH_WIDE + 4, level: 11,
    family: 'cellar', band: ['spider', 'spinner', 'spider'], min: 2, elite: 0.25, respawn: RESPAWN, hole: [0, 1.2],
    dress: [['reeds', -3.2, -2.4], ['reeds', 3.6, -1.6], ['reeds', -4.2, 2.6], ['boat', 4.4, 3.2], ['bound', -1.8, -4.2], ['bones', 2.4, 4.2], ['bones', -3.6, 0.4]] },
  { id: 'fens_stones', region: 'fens', kind: 'camp', name: 'The old stones', x: 126, y: 80, reach: REACH_WIDE, arena: REACH_WIDE + 4, level: 14,
    family: 'golems', band: ['golem', 'golem'], elite: 0.25, respawn: RESPAWN, posts: [[-2.4, 0.4], [2.4, 0.4]], face: [0, 0],
    dress: [['pillar', -4.4, -3.2], ['pillar', 4.2, -3.6], ['brokenpillar', -5.2, 2.2], ['pillar', 4.8, 2.8], ['brokenpillar', 0.4, -5.2], ['boulder', -1.6, 4.6], ['boulder', 2.2, 5.0]] },
  { id: 'fens_graves', region: 'fens', kind: 'camp', name: 'The drowned graves', x: 204, y: 168, reach: REACH_WIDE, arena: REACH_WIDE + 4, level: 17,
    family: 'wraiths', band: ['wraith', 'wraith', 'wraith'], elite: 0.25, respawn: RESPAWN, posts: [[-2.6, 0.4], [2.6, 0.6], [0, -2.8]], face: [0, 0],
    dress: [['saint', 0, -4.6], ['urns', -4.4, -2.4], ['candles', -3.0, 3.2], ['brokenpillar', 4.6, -2.0], ['urns', 4.2, 3.0], ['bones', -1.2, 4.4], ['candles', 2.0, -4.4]] },
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
