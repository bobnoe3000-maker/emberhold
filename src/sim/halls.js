// @ts-check
// halls.js — the "halls" dungeon layout (docs/dungeon-halls-proposal.md, decided 2026-10-10): a floor as ONE BUILDING
// of rectangular rooms joined by short straight halls, the traditional isometric dungeon. level.js generateLevel
// calls it for a site whose layout is 'halls' (sites.js), and it returns the same shape as the caverns (cells, rooms,
// edges, spawn, entrance, descentRoom), so world.js dresses, stairs, ranks and fights it unchanged.
//
// The rules:
//   • rooms come in three sizes (level.js ROOM_SIZES: small, medium, large; large is the GDD's arena) from the floor's
//     bag, the descent room (the boss's hall) always large;
//   • the rooms stand in rows, the building's wings, west to east; a row's rooms share its north wall (one straight
//     line of back wall) and each is as deep as its size, so the south side steps;
//   • rooms side by side in a row join by a straight hall across the gap, 8 or 12 tiles long and 6 wide (HALLS):
//     the safe ground a party steps back into out of a fight (GDD §3.1), never a bare doorway;
//   • a row joins the row below by the shortest straight hall between two rooms that face each other (10+ tiles of
//     wall in common), and now and then a second one, a loop; rows start where they like within a few tiles, so the
//     building comes out stepped, an L, a T;
//   • a one-tile wall rings every floor. The camera looks from +x+y, so a wall with floor up-screen of it within
//     WALL_REACH of x + y would hide that floor: it's cut to a knee-high stub (FLOOR_Z + 2, still above the climb
//     rule). The rest stand full height: the building's back walls and every room's north and west walls.
//   • the entrance is the first room of the first row (its north and west walls stand, for the stair up), the descent
//     room the last of the last row.
//
// Deterministic: its own mulberry32 stream from the seed, integers, sim/detmath. No draw here moves a cavern floor.

import { mulberry32 } from './rng.js';

export const HALL_W = 6;            // a hall's width: three abreast, as the caverns' corridors
export const HALLS = [8, 12];       // a hall's length between two rooms
export const WALL_REACH = 8;        // x + y units a full-height wall hides behind it: 5 levels × 6 px ÷ 4 px a unit ≈ 7.5
const W = 320, H = 320, MIN_FACE = HALL_W + 4;   // two rooms join only across 10+ tiles of facing wall
const MAX_HALL = 14;                             // the longest a join is let be when a shorter one is there to dig
const key = (x, y) => x + ',' + y;

/**
 * @param {number} seed
 * @param {{ want: number, sizes: string[], dims: (size: string, rng: () => number) => [number, number], floorZ: number, wallZ: number }} o
 *   want: rooms; sizes: each room's size, in order (the last is the descent room's); dims: a size's width and depth
 */
export function generateHalls(seed, o) {
  const rng = mulberry32(((seed >>> 0) ^ 0x6a11e7) >>> 0), n = o.want;
  const gap = () => HALLS[Math.floor(rng() * HALLS.length)];
  // rows: one for two rooms, two for three to five, three for six or more; the rooms dealt out in order, a row
  // shorter or longer by one now and then
  const R = n <= 2 ? 1 : n <= 5 ? 2 : 3, per = [];
  for (let j = 0, left = n; j < R; j++) { const fair = Math.round(left / (R - j)), k = j < R - 1 && left - fair > R - j - 1 && rng() < 0.35 ? fair + (rng() < 0.5 ? -1 : 1) : fair; per.push(Math.max(1, Math.min(left - (R - j - 1), k))); left -= per[j]; }
  /** @type {any[]} */
  const rooms = [], rowsOf = [];
  // skyline packing: a room settles just below whatever already stands over it (within a hall's length either side),
  // a hall's length clear of it, so every join down is a short hall, never a long one past a shallow room
  const near = (q, x0, x1) => q.x0 <= x1 + HALLS[0] && q.x1 >= x0 - HALLS[0];
  for (let j = 0, idx = 0; j < R; j++) {
    const dims = Array.from({ length: per[j] }, (_, i) => o.dims(o.sizes[idx + i], rng)), row = [];
    // a row starts up to 12 tiles in or out of the one above, never so far that its first room and the one above
    // stop facing each other across 10+ tiles
    const up = rowsOf[j - 1], reach = up ? Math.min(12, Math.min(up[0].x1 - up[0].x0 + 1, dims[0][0]) - MIN_FACE) : 0;
    let x = up ? up[0].x0 + Math.max(-reach, Math.min(reach, Math.round((rng() - 0.5) * 24))) : 0;
    const top = up ? Math.min(...up.map((q) => q.y1)) + 1 + HALLS[0] : 0;
    for (let i = 0; i < per[j]; i++, idx++) {
      const [w, d] = dims[i], x1 = x + w - 1, g = gap();
      const y0 = Math.max(top, ...rooms.filter((q) => near(q, x, x1)).map((q) => q.y1 + 1 + g));
      const r = { id: idx, size: o.sizes[idx], shape: 'rect', x0: x, y0, x1, y1: y0 + d - 1, row: j };
      row.push(r); rooms.push(r);
      x += w + gap();
    }
    rowsOf.push(row);
  }
  // centre the building in the level
  const bx0 = Math.min(...rooms.map((r) => r.x0)), bx1 = Math.max(...rooms.map((r) => r.x1)), by1 = Math.max(...rooms.map((r) => r.y1));
  const dx = Math.floor((W - (bx1 - bx0 + 1)) / 2) - bx0, dy = Math.floor((H - (by1 + 1)) / 2);
  for (const r of rooms) { r.x0 += dx; r.x1 += dx; r.y0 += dy; r.y1 += dy; r.cx = Math.floor((r.x0 + r.x1) / 2); r.cy = Math.floor((r.y0 + r.y1) / 2); r.rw = Math.floor((r.x1 - r.x0) / 2); r.rh = Math.floor((r.y1 - r.y0) / 2); }

  /** @type {Map<string, any>} */
  const cells = new Map();
  const setFloor = (x, y, room, corridor) => { const k = key(x, y), c = cells.get(k); if (c) { if (corridor) c.corridor = true; return; } cells.set(k, { kind: 'floor', room, corridor: !!corridor }); };
  for (const r of rooms) for (let yy = r.y0; yy <= r.y1; yy++) for (let xx = r.x0; xx <= r.x1; xx++) setFloor(xx, yy, r.id, false);

  // the joins that can be: two rooms facing each other across 10+ tiles of wall, a gap no longer than MAX_HALL between
  // them, and nothing else in the hall's way (a tile of wall either side kept clear). Each is a straight hall, near
  // the middle of the span they share (within its middle 60 %).
  const across = (lo, hi) => { const room = hi - lo + 1 - HALL_W; return lo + Math.floor(room / 2) + Math.round((rng() - 0.5) * room * 0.6); };
  const clear = (x0, y0, x1, y1, a, b) => rooms.every((q) => q === a || q === b || q.x1 < x0 - 1 || q.x0 > x1 + 1 || q.y1 < y0 - 1 || q.y0 > y1 + 1);
  const ways = (maxLen, minFace = MIN_FACE) => {
    const out = [];
    for (const a of rooms) for (const b of rooms) {
      if (a.id >= b.id) continue;
      const fx = Math.min(a.x1, b.x1) - Math.max(a.x0, b.x0) + 1, fy = Math.min(a.y1, b.y1) - Math.max(a.y0, b.y0) + 1;
      if (fx >= minFace) { const [T, B] = a.y1 < b.y0 ? [a, b] : [b, a], len = B.y0 - T.y1 - 1; if (len >= HALLS[0] && len <= maxLen) out.push({ a, b, along: 'y', lo: Math.max(a.x0, b.x0), hi: Math.min(a.x1, b.x1), from: T.y1 + 1, to: B.y0 - 1, len }); }
      else if (fy >= minFace) { const [Lr, Rr] = a.x1 < b.x0 ? [a, b] : [b, a], len = Rr.x0 - Lr.x1 - 1; if (len >= HALLS[0] && len <= maxLen) out.push({ a, b, along: 'x', lo: Math.max(a.y0, b.y0), hi: Math.min(a.y1, b.y1), from: Lr.x1 + 1, to: Rr.x0 - 1, len }); }
    }
    return out;
  };
  /** @type {[number, number][]} */
  const edges = [];
  const dig = (wy) => {
    const at = across(wy.lo, wy.hi);
    const [x0, y0, x1, y1] = wy.along === 'y' ? [at, wy.from, at + HALL_W - 1, wy.to] : [wy.from, at, wy.to, at + HALL_W - 1];
    if (!clear(x0, y0, x1, y1, wy.a, wy.b)) return false;
    for (let yy = y0; yy <= y1; yy++) for (let xx = x0; xx <= x1; xx++) setFloor(xx, yy, -1, true);
    edges.push([wy.a.id, wy.b.id]); return true;
  };
  // a spanning tree from the entrance over the short ways, a seeded pick at each step, then a loop or two; a floor the
  // short ways can't join takes the shortest longer one (rare: the test holds it to every room joined)
  const inTree = new Set([rooms[0]]), linked = new Set();
  for (const [maxLen, minFace] of [[MAX_HALL, MIN_FACE], [24, MIN_FACE], [64, MIN_FACE], [64, HALL_W + 2], [96, HALL_W]]) {
    const cand = ways(maxLen, minFace);
    for (let grew = true; grew && inTree.size < rooms.length;) {
      grew = false;
      const edge = cand.filter((wy) => inTree.has(wy.a) !== inTree.has(wy.b));
      if (!edge.length) break;
      const short = edge.filter((wy) => wy.len === Math.min(...edge.map((e) => e.len)));
      const pool = maxLen === MAX_HALL ? edge : short;
      for (let t = 0; t < 6 && !grew; t++) { const wy = pool[Math.floor(rng() * pool.length)]; if (dig(wy)) { inTree.add(wy.a); inTree.add(wy.b); linked.add(wy.a.id + '-' + wy.b.id); grew = true; } }
    }
  }
  const spare = ways(MAX_HALL).filter((wy) => !linked.has(wy.a.id + '-' + wy.b.id));
  for (let e = 0, k = Math.min(spare.length, 1 + (rng() < 0.5 ? 1 : 0)); e < k; e++) { const i = Math.floor(rng() * spare.length); dig(spare[i]); spare.splice(i, 1); }

  // walls: a one-tile ring round every floor; cut to a stub where floor lies up-screen within WALL_REACH
  const floorAt = (x, y) => { const c = cells.get(key(x, y)); return !!c && c.kind === 'floor'; };
  const ring = new Set();
  for (const k of cells.keys()) { const [x, y] = k.split(',').map(Number); for (let ddy = -1; ddy <= 1; ddy++) for (let ddx = -1; ddx <= 1; ddx++) if ((ddx || ddy) && !cells.has(key(x + ddx, y + ddy))) ring.add(key(x + ddx, y + ddy)); }
  for (const k of ring) {
    const [x, y] = k.split(',').map(Number);
    let hides = false;
    for (let s = 1; s <= WALL_REACH && !hides; s++) for (let i = 0; i <= s && !hides; i++) { const fx = x - i, fy = y - (s - i); if (Math.abs((x - y) - (fx - fy)) <= 2 && floorAt(fx, fy)) hides = true; }
    cells.set(k, { kind: 'wall', room: -1, corridor: false, wz: hides ? o.floorZ + 2 : o.wallZ });
  }
  const entrance = rooms[0], descentRoom = rooms[rooms.length - 1];
  return { cells, rooms, edges, spawn: { x: entrance.cx + 0.5, y: entrance.cy + 0.5 }, entrance, descentRoom, W, H };
}
