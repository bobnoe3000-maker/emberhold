// level.js — dungeon-crawler level generation. A level is a THEMED graph of
// rooms carved out of the abyss and joined by corridors. Rooms are floor
// platforms ringed by HIGH WALLS; beyond the wall there is nothing — just the
// void. Everything is a pure function of (seed, theme): generation is
// deterministic, so the level rebuilds identically from a save.
//
// Cell kinds: 'floor' (walkable platform), 'wall' (tall, blocks), absent = abyss.
// A floor cell also carries `corridor` (kept clear of hazards/props so every
// room stays reachable) and its owning `room` id.

import { mulberry32, fbm } from './rng.js';

// Terrain themes. `floors` is a weighted bag sampled by noise for the base
// ground; `hazard` is a material that pools across the floor (impassable);
// `wall` is the ring material. See palette.ELIT for the ramps.
export const THEMES = {
  dread:  { name: 'Dreadforge',   wall: 'obsid',  floors: ['soil', 'soil', 'bone', 'flesh'], hazard: 'poison', hazardScale: 0.19, hazardCut: 0.70 },
  desert: { name: 'Barren Waste', wall: 'basalt', floors: ['sand', 'sand', 'sand', 'soil'],  hazard: 'chasm',  hazardScale: 0.16, hazardCut: 0.74 },
  poison: { name: 'Sickpools',    wall: 'bone',   floors: ['soil', 'soil', 'flesh'],         hazard: 'poison', hazardScale: 0.22, hazardCut: 0.55 },
  ember:  { name: 'Cinderworks',  wall: 'obsid',  floors: ['basalt', 'basalt', 'soil'],      hazard: 'ember',  hazardScale: 0.24, hazardCut: 0.66 },
  lava:   { name: 'Magma Vault',  wall: 'obsid',  floors: ['basalt', 'basalt'],              hazard: 'lava',   hazardScale: 0.17, hazardCut: 0.58 },
  chasm:  { name: 'Soulcracks',   wall: 'basalt', floors: ['chasm', 'chasm', 'basalt'],      hazard: 'abyss',  hazardScale: 0.20, hazardCut: 0.72 },
};
export const THEME_KEYS = Object.keys(THEMES);

export const FLOOR_Z = 2;          // platform elevation
export const WALL_Z = 7;           // wall crown — well above the +1 climb rule
const W = 200, H = 200;            // level bounds (tiles); rooms live inside a border
const CORRIDOR_W = 4;              // corridor width (tiles)

const key = (x, y) => x + ',' + y;

// A room's footprint as a shape predicate over local offsets (dx, dy) inside its
// half-extents (rw, rh). Shape variety keeps rooms from reading as a grid of boxes.
function inRoom(shape, dx, dy, rw, rh) {
  const ax = Math.abs(dx), ay = Math.abs(dy);
  switch (shape) {
    case 'oval':    return (dx / (rw + 0.5)) ** 2 + (dy / (rh + 0.5)) ** 2 <= 1;
    case 'diamond': return ax / (rw + 0.5) + ay / (rh + 0.5) <= 1;
    case 'plus':    return ax <= Math.max(1, rw * 0.42) || ay <= Math.max(1, rh * 0.42);
    case 'ell':     return !(dx > rw * 0.1 && dy < -rh * 0.1);   // rect minus one quadrant
    default:        return ax <= rw && ay <= rh;                 // rect
  }
}

export function generateLevel(seed, theme) {
  const th = THEMES[theme] || THEMES.dread;
  const rng = mulberry32(((seed >>> 0) ^ 0x9e3779b9) >>> 0);
  const shapes = ['rect', 'rect', 'oval', 'diamond', 'plus', 'ell'];
  const rooms = [];
  const want = 6 + Math.floor(rng() * 4);         // 6–9 rooms
  let tries = 0;
  while (rooms.length < want && tries < 1200) {
    tries++;
    // half-extents 12–21 (≈24–43 tiles across) — 3×+ the old minimum
    const rw = 12 + Math.floor(rng() * 10), rh = 12 + Math.floor(rng() * 10);
    const cx = rw + 4 + Math.floor(rng() * (W - 2 * rw - 8));
    const cy = rh + 4 + Math.floor(rng() * (H - 2 * rh - 8));
    const shape = shapes[Math.floor(rng() * shapes.length)];
    // reject if the padded bbox overlaps an existing room (keeps abyss between them)
    if (rooms.some((r) => Math.abs(r.cx - cx) < r.rw + rw + 8 && Math.abs(r.cy - cy) < r.rh + rh + 8)) continue;
    rooms.push({ id: rooms.length, cx, cy, rw, rh, shape });
  }

  const cells = new Map();
  const setFloor = (x, y, room, corridor) => {
    if (x < 1 || y < 1 || x >= W - 1 || y >= H - 1) return;
    const k = key(x, y), c = cells.get(k);
    if (c) { if (corridor) c.corridor = true; return; }
    cells.set(k, { kind: 'floor', room, corridor: !!corridor });
  };
  // carve room interiors
  for (const r of rooms)
    for (let dy = -r.rh; dy <= r.rh; dy++) for (let dx = -r.rw; dx <= r.rw; dx++)
      if (inRoom(r.shape, dx, dy, r.rw, r.rh)) setFloor(r.cx + dx, r.cy + dy, r.id, false);

  // connect rooms: a spanning chain by proximity + a couple of extra loops
  const carveH = (x0, x1, y) => { for (let x = Math.min(x0, x1); x <= Math.max(x0, x1); x++) for (let w = 0; w < CORRIDOR_W; w++) setFloor(x, y + w - 1, -1, true); };
  const carveV = (y0, y1, x) => { for (let y = Math.min(y0, y1); y <= Math.max(y0, y1); y++) for (let w = 0; w < CORRIDOR_W; w++) setFloor(x + w - 1, y, -1, true); };
  const edges = [];   // room-id pairs joined by a corridor (drives the minimap)
  const connect = (a, b) => { edges.push([a.id, b.id]); if (rng() < 0.5) { carveH(a.cx, b.cx, a.cy); carveV(a.cy, b.cy, b.cx); } else { carveV(a.cy, b.cy, a.cx); carveH(a.cx, b.cx, b.cy); } };
  const order = [...rooms].sort((p, q) => (p.cx + p.cy) - (q.cx + q.cy));
  for (let i = 1; i < order.length; i++) {
    // link to the nearest already-placed room (a cheap connected spanning tree)
    let best = order[0], bd = 1e9;
    for (let j = 0; j < i; j++) { const d = Math.hypot(order[j].cx - order[i].cx, order[j].cy - order[i].cy); if (d < bd) { bd = d; best = order[j]; } }
    connect(best, order[i]);
  }
  for (let e = 0; e < 2 && rooms.length > 2; e++) connect(rooms[(rng() * rooms.length) | 0], rooms[(rng() * rooms.length) | 0]);

  // wall pass: ring the floor, but WEATHER it. Walls vary in height and whole
  // stretches have crumbled short or fallen away entirely, opening onto the
  // abyss. Coherent noise makes ruined SECTIONS, not per-tile speckle. (The abyss
  // still bounds the room wherever a wall is missing, so nothing escapes.)
  const wallKeys = new Set();
  for (const k of cells.keys()) {
    const [x, y] = k.split(',').map(Number);
    for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
      if (!dx && !dy) continue;
      const nk = key(x + dx, y + dy);
      if (!cells.has(nk)) wallKeys.add(nk);
    }
  }
  for (const nk of wallKeys) {
    if (cells.has(nk)) continue;
    const [x, y] = nk.split(',').map(Number);
    if (fbm(x * 0.16, y * 0.16, seed + 4001) < 0.30) continue;          // fallen away → open edge
    // height: often full, weathered down in patches (>= FLOOR_Z+2 so it still reads as a wall)
    const wz = fbm(x * 0.24, y * 0.24, seed + 811) > 0.52
      ? WALL_Z : FLOOR_Z + 2 + Math.floor(fbm(x * 0.5, y * 0.5, seed + 909) * (WALL_Z - FLOOR_Z - 2) + 0.5);
    cells.set(nk, { kind: 'wall', room: -1, corridor: false, wz });
  }

  const spawn = order[0] ? { x: order[0].cx + 0.5, y: order[0].cy + 0.5 } : { x: W / 2, y: H / 2 };
  return { cells, rooms, edges, theme, th, spawn, W, H };
}
