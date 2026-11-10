// @ts-check
// keepclear.js — where a dungeon floor's dressing may not go (docs/level-design-rules.md §4.4; the owner, 2026-11-10:
// "dungeon dressing, need rules to prevent things like barrels blocking the stairway, or a torch in the middle of a
// hallway or entrance to another room"). Three rules, kept by world.js as it dresses a floor and read back by the audit
// (tools/dungeon/dress-audit.mjs --clear) and test/keepclear.test.mjs:
//   · THE STAIRS: nothing stands on a stair or within STAIR_CLEAR tiles of it (the way up's flight and the tiles you walk
//     up to it on; the way down's well and its rim), and its approach is open: the way up's run out to where you arrive,
//     the row in front of the well. The stairwell's own two lights and its set piece (guardians, the altar) are its own.
//   · THE DOORWAYS: nothing stands within MOUTH tiles of a doorway (a room's floor where a corridor comes in), so a way
//     between rooms is never stood in or narrowed.
//   · THE LIGHTS: a free-standing light (a brazier, a torch, a lantern, a candelabra, candles) stands by a wall, at its
//     foot or a step out from it (a wall within WALL_NEAR tiles, the 5 × 5 round it): never out in a room's open middle,
//     down a hallway's middle or in a doorway.
// Pure functions of the built level and the stairs (world.js), nothing drawn.

import { LIGHT } from './dresscaps.js';
import { hypot } from './detmath.js';

const K = (/** @type {number} */ x, /** @type {number} */ y) => x + ',' + y;
export const STAIR_CLEAR = 2, MOUTH = 1.5, WALL_NEAR = 2;
/** the pieces that are the stairs' own (never cleared from round them) */
export const STAIR_OWN = new Set(['stairs', 'stairwell', 'guardian', 'altar']);

/** is the cell floor? @param {any} level */
const floorAt = (level, x, y) => { const c = level.cells.get(K(x, y)); return !!c && c.kind === 'floor'; };
/** a wall, or anything not floor, within WALL_NEAR of (x, y) @param {any} level @param {number} x @param {number} y */
export function againstWall(level, x, y) {
  for (let dy = -WALL_NEAR; dy <= WALL_NEAR; dy++) for (let dx = -WALL_NEAR; dx <= WALL_NEAR; dx++) if ((dx || dy) && !floorAt(level, x + dx, y + dy)) return true;
  return false;
}
/** every doorway cell: a room's floor with a corridor's floor (outside any room) beside it @param {any} level @returns {[number, number][]} */
export function doorways(level) {
  const out = [];
  for (const [k, c] of level.cells) {
    if (c.kind !== 'floor' || c.room < 0) continue;
    const [x, y] = k.split(',').map(Number);
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const n = level.cells.get(K(x + dx, y + dy)); if (n && n.kind === 'floor' && n.room < 0) { out.push([x, y]); break; } }
  }
  return out;
}
/** the doorways' mouths: every cell within MOUTH of a doorway @param {any} level @returns {Set<string>} */
export function mouths(level) {
  const out = new Set(), R = Math.ceil(MOUTH);
  for (const [x, y] of doorways(level)) for (let dy = -R; dy <= R; dy++) for (let dx = -R; dx <= R; dx++) if (hypot(dx, dy) <= MOUTH) out.add(K(x + dx, y + dy));
  return out;
}
/** the stairs' keep-clear tiles, once they're placed (world.js): the way up's flight, its foot and the run out to where
 * you arrive, STAIR_CLEAR round; the way down's well and rim, STAIR_CLEAR round, and three rows in front
 * @param {any} world @returns {Set<string>} */
export function stairZone(world) {
  const out = new Set(), add = (x0, y0, x1, y1) => { for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) out.add(K(x, y)); }, C = STAIR_CLEAR;
  const up = (world.structs || []).find((s) => s.id === 'stairsup_0' || s.id === 'stairsup_90');
  if (up && world.exitAt && world.stairArrive) {
    const ax = Math.floor(up.x), ay = Math.floor(up.y), ex = Math.floor(world.stairArrive.x), ey = Math.floor(world.stairArrive.y);
    if (up.id === 'stairsup_0') add(ax - 1 - C, ay - 3, ax + 1 + C, ey + 1);   // (north wall: the flight runs down +y to the foot, then the run out)
    else add(ax - 3, ay - 1 - C, ex + 1, ay + 1 + C);
  }
  const S = world.stairwell;
  if (S) add(S.x0 - 1 - C, S.y0 - C, S.x1 + C, S.y1 + 2);
  else if (world.stairsAt) { const x = Math.floor(world.stairsAt.x), y = Math.floor(world.stairsAt.y); add(x - C, y - C, x + C, y + C); }
  return out;
}
/** the stairs' own pieces (world.js: the stairwell's two lights, its set piece), kept @param {any} world */
export function stairLights(world) { return world.stairOwn || new Set(); }
/** every piece standing where the rules say it mayn't: [{ key, kind, why }] (the audit's and the test's)
 * @param {any} world */
export function dressingFaults(world) {
  const L = world.level, stairs = stairZone(world), mouth = mouths(L), own = stairLights(world), out = [];
  for (const [k, kind] of world.props) {
    if (STAIR_OWN.has(kind) || own.has(k) || kind === 'chest') continue;   // (a chest is placed last, on open floor, and is opened where it stands)
    const [x, y] = k.split(',').map(Number), c = L.cells.get(k);
    if (!c || c.kind !== 'floor') continue;
    if (stairs.has(k)) out.push({ key: k, kind, why: 'stairs' });
    else if (mouth.has(k)) out.push({ key: k, kind, why: 'doorway' });
    else if (LIGHT.has(kind) && !againstWall(L, x, y)) out.push({ key: k, kind, why: 'light in the open' });
  }
  return out;
}
