// halls.mjs — PROTOTYPE of the "halls" dungeon layout (docs/dungeon-halls-proposal.md): rectangular rooms laid out as
// one building, on a grid of bays, joined by doorways through shared walls and by short straight halls. Not used by
// the game yet. It returns the same shape as sim/level.js generateLevel (cells, rooms, edges, spawn, entrance,
// descentRoom), so world.js could dress it, rank it and stair it unchanged; tools/dungeon/capture.mjs swaps it in for
// a look in the game, and tools/dungeon/plans.mjs draws it beside the caverns.
//
// The rules (each one argued in the proposal):
//   • the building is a grid of bays, a bay or three more than its rooms (2 × 2 to 3 × 2 for four, 3 × 2 to 3 × 3
//     for six, up to 4 × 3 for eight); the bays left empty are dark, so the building comes out an L, a T, a U or a
//     block. Every column has one width and every row one depth (40–62 tiles, the GDD's arenas), so the walls run
//     straight through the whole building;
//   • between two bays the gap is a short straight hall, 8 or 12 tiles long and 6 wide. Not a bare doorway: a hall is
//     the safe ground a party steps back into out of a fight (GDD §3.1), so it must hold the party clear of both rooms;
//   • rooms join by a spanning tree over the grid from the entrance (the top-left bay, where the stair up goes) and
//     one or two loops; two neighbours not joined keep a blank wall;
//   • walls are one tile thick round every floor. The camera looks from +x+y, so a wall with floor up-screen of it
//     (within WALL_REACH of x + y) would hide that floor: it is cut to a stub (FLOOR_Z + 2, still above the climb
//     rule). The rest stand full height: the building's back walls, and the far wall of every room.
//
// Deterministic: one mulberry32 stream from the seed, integer arithmetic, sim/detmath for distances.

import { mulberry32 } from '../../src/sim/rng.js';
import { hypot } from '../../src/sim/detmath.js';
import { THEMES, FLOOR_Z, WALL_Z } from '../../src/sim/level.js';

const W = 320, H = 320;
export const HALL_W = 6;            // a hall's and a doorway's width: three abreast, as the caverns' corridors
export const HALLS = [8, 12];       // a short hall between two bays: long enough for a party to stand in, out of both fights
export const WALL_REACH = 8;        // x + y units a full-height wall hides behind it: 5 levels × 6 px ÷ 4 px a unit ≈ 7.5

const key = (x, y) => x + ',' + y;

/** @param {number} seed @param {string} theme @param {{ rooms?: [number, number] }} [opts] */
export function generateHalls(seed, theme, opts = {}) {
  const th = THEMES[theme] || THEMES.dread;
  const rng = mulberry32(((seed >>> 0) ^ 0x6a11e7) >>> 0);
  const want = opts.rooms ? opts.rooms[0] + Math.floor(rng() * (opts.rooms[1] - opts.rooms[0] + 1)) : 6 + Math.floor(rng() * 3);
  // the grid: a bay or three more than the rooms, so the empty ones make the building an L, a T or a U, not a block
  const GRIDS = want <= 2 ? [[2, 1]] : want <= 4 ? [[2, 2], [3, 2], [2, 3]] : want <= 6 ? [[3, 2], [2, 3], [3, 3], [3, 3]] : [[3, 3], [4, 3], [3, 4]];
  const [cols, rows] = GRIDS[Math.floor(rng() * GRIDS.length)];
  const cw = Array.from({ length: cols }, () => 40 + Math.floor(rng() * 23));   // 40–62 across: the GDD's arenas (§3.1)
  const rh = Array.from({ length: rows }, () => 40 + Math.floor(rng() * 23));
  const gx = Array.from({ length: cols - 1 }, () => HALLS[Math.floor(rng() * HALLS.length)]);   // the gap after each column: its halls' length
  const gy = Array.from({ length: rows - 1 }, () => HALLS[Math.floor(rng() * HALLS.length)]);
  // which bays hold a room: all of them, less a few left as dark courtyards (never the entrance's, and the rest stay joined)
  const bays = [];
  for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) bays.push({ i, j, on: true });
  const at = (i, j) => bays.find((b) => b.i === i && b.j === j);
  const nbrs = (b) => [[1, 0], [-1, 0], [0, 1], [0, -1]].map(([di, dj]) => at(b.i + di, b.j + dj)).filter((n) => n && n.on);
  const joined = () => { const on = bays.filter((b) => b.on), seen = new Set([on[0]]), q = [on[0]]; while (q.length) for (const n of nbrs(q.pop())) if (!seen.has(n)) { seen.add(n); q.push(n); } return seen.size === on.length; };
  for (let drop = bays.length - want, t = 0; drop > 0 && t < 60; t++) {
    const b = bays[1 + Math.floor(rng() * (bays.length - 1))]; if (!b.on) continue;
    b.on = false; if (joined()) drop--; else b.on = true;
  }
  // the building's origin: centred in the level
  const bw = cw.reduce((a, v) => a + v, 0) + gx.reduce((a, v) => a + v, 0), bh = rh.reduce((a, v) => a + v, 0) + gy.reduce((a, v) => a + v, 0);
  const X0 = Math.floor((W - bw) / 2), Y0 = Math.floor((H - bh) / 2);
  const colX = [X0]; for (let i = 1; i < cols; i++) colX.push(colX[i - 1] + cw[i - 1] + gx[i - 1]);
  const rowY = [Y0]; for (let j = 1; j < rows; j++) rowY.push(rowY[j - 1] + rh[j - 1] + gy[j - 1]);

  const rooms = [];
  for (const b of bays.filter((q) => q.on)) {
    const x0 = colX[b.i], y0 = rowY[b.j], w = cw[b.i], h = rh[b.j];
    const r = { id: rooms.length, cx: x0 + Math.floor(w / 2), cy: y0 + Math.floor(h / 2), rw: Math.floor(w / 2), rh: Math.floor(h / 2), shape: 'rect', x0, y0, x1: x0 + w - 1, y1: y0 + h - 1, bay: [b.i, b.j] };
    b.room = r; rooms.push(r);
  }
  const cells = new Map();
  const setFloor = (x, y, room, corridor) => { const k = key(x, y), c = cells.get(k); if (c) { if (corridor) c.corridor = true; return; } cells.set(k, { kind: 'floor', room, corridor: !!corridor }); };
  for (const r of rooms) for (let y = r.y0; y <= r.y1; y++) for (let x = r.x0; x <= r.x1; x++) setFloor(x, y, r.id, false);

  // joins: a spanning tree from the entrance's bay by a seeded walk, then one or two loops between neighbours
  const edges = [], linked = new Set(), lk = (a, b) => Math.min(a.id, b.id) + '-' + Math.max(a.id, b.id);
  const join = (A, B) => {
    const a = A.room, b = B.room; if (linked.has(lk(a, b))) return; linked.add(lk(a, b)); edges.push([a.id, b.id]);
    if (A.j === B.j) {                                    // side by side: a way across the gap between their columns
      const [L, R] = A.i < B.i ? [a, b] : [b, a], y = L.cy - HALL_W / 2 + Math.round((rng() - 0.5) * (L.rh - HALL_W) * 0.6);
      for (let x = L.x1 + 1; x < R.x0; x++) for (let w = 0; w < HALL_W; w++) setFloor(x, y + w, -1, true);
    } else {                                              // one over the other
      const [T, B2] = A.j < B.j ? [a, b] : [b, a], x = T.cx - HALL_W / 2 + Math.round((rng() - 0.5) * (T.rw - HALL_W) * 0.6);
      for (let y = T.y1 + 1; y < B2.y0; y++) for (let w = 0; w < HALL_W; w++) setFloor(x + w, y, -1, true);
    }
  };
  const on = bays.filter((b) => b.on), inTree = new Set([on[0]]);
  while (inTree.size < on.length) {
    const edge = [];
    for (const b of inTree) for (const n of nbrs(b)) if (!inTree.has(n)) edge.push([b, n]);
    const [b, n] = edge[Math.floor(rng() * edge.length)]; join(b, n); inTree.add(n);
  }
  const spare = []; for (const b of on) for (const n of nbrs(b)) if (b.room.id < n.room.id && !linked.has(lk(b.room, n.room))) spare.push([b, n]);
  for (let e = 0, n = Math.min(spare.length, 1 + (rng() < 0.5 ? 1 : 0)); e < n; e++) { const k = Math.floor(rng() * spare.length); join(...spare[k]); spare.splice(k, 1); }

  // walls: a one-tile ring round every floor; cut to a stub where floor lies up-screen within WALL_REACH
  const floorAt = (x, y) => { const c = cells.get(key(x, y)); return !!c && c.kind === 'floor'; };
  const ring = new Set();
  for (const k of cells.keys()) { const [x, y] = k.split(',').map(Number); for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) if ((dx || dy) && !cells.has(key(x + dx, y + dy))) ring.add(key(x + dx, y + dy)); }
  for (const k of ring) {
    const [x, y] = k.split(',').map(Number);
    let hides = false;
    for (let s = 1; s <= WALL_REACH && !hides; s++) for (let i = 0; i <= s && !hides; i++) { const fx = x - i, fy = y - (s - i); if (Math.abs((x - y) - (fx - fy)) <= 2 && floorAt(fx, fy)) hides = true; }
    cells.set(k, { kind: 'wall', room: -1, corridor: false, wz: hides ? FLOOR_Z + 2 : WALL_Z });   // (the stub: knee-high, still a wall to walk into)
  }

  const entrance = rooms[0];
  const spawn = { x: entrance.cx + 0.5, y: entrance.cy + 0.5 };
  let descentRoom = entrance, bd = -1;
  for (const r of rooms) { const d = hypot(r.cx - entrance.cx, r.cy - entrance.cy); if (d > bd) { bd = d; descentRoom = r; } }
  return { cells, rooms, edges, theme, th, spawn, entrance, descentRoom, W, H, layout: 'halls', grid: { cols, rows, cw, rh, gx, gy } };
}
