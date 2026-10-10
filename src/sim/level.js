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
import { hypot } from './detmath.js';
import { generateHalls } from './halls.js';

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
  // a site's own look, never drawn for the Old Barrows (THEME_KEYS is what their seed picks from)
  warren: { name: 'Goblin Warren', wall: 'basalt', floors: ['soil', 'soil', 'soil', 'sand'],  hazard: 'chasm',  hazardScale: 0.18, hazardCut: 0.76 },
  // the Fens' (M8): the Toadking's mud-floored island halls, the drowned Abbey, the lock-keepers' halls
  mire:   { name: 'Mire Halls',    wall: 'basalt', floors: ['soil', 'soil', 'sand', 'soil'],  hazard: 'water',  hazardScale: 0.2,  hazardCut: 0.68 },
  water:  { name: 'Drowned Works', wall: 'basalt', floors: ['soil', 'bone', 'soil'],          hazard: 'water',  hazardScale: 0.21, hazardCut: 0.64 },
  sluice: { name: 'Lock Halls',    wall: 'basalt', floors: ['soil', 'bone', 'soil'],          hazard: 'water',  hazardScale: 0.18, hazardCut: 0.6 },
};
export const THEME_KEYS = ['dread', 'desert', 'poison', 'ember', 'lava', 'chasm'];

export const FLOOR_Z = 2;          // platform elevation
export const WALL_Z = 7;           // wall crown — well above the +1 climb rule
const W = 320, H = 320;            // level bounds (tiles); rooms live inside a border
const CORRIDOR_W = 6;              // corridor width (tiles) — a party of three walks abreast

const key = (x, y) => x + ',' + y;

// A room's footprint as a shape predicate over local offsets (dx, dy) inside its
// half-extents (rw, rh). Shape variety keeps rooms from reading as a grid of boxes.
function inRoom(shape, dx, dy, rw, rh) {
  const ax = Math.abs(dx), ay = Math.abs(dy);
  switch (shape) {
    case 'oval':    return (dx / (rw + 0.5)) * (dx / (rw + 0.5)) + (dy / (rh + 0.5)) * (dy / (rh + 0.5)) <= 1;
    case 'diamond': return ax / (rw + 0.5) + ay / (rh + 0.5) <= 1;
    case 'plus':    return ax <= Math.max(1, rw * 0.42) || ay <= Math.max(1, rh * 0.42);
    case 'ell':     return !(dx > rw * 0.1 && dy < -rh * 0.1);   // rect minus one quadrant
    default:        return ax <= rw && ay <= rh;                 // rect
  }
}

// Rooms come in three sizes (2026-10-10, the owner: "both halls and the cavern style rooms should generally come in 3
// sizes, small, medium and large with large being what you currently have"): tiles across, each way. Large is the
// GDD's arena (§3.1), as every room was. A floor's descent room, its boss's hall, is always large; the others come
// from a bag of the three, shuffled, so a floor has some of each (sizesFor).
export const ROOM_SIZES = { small: [18, 26], medium: [28, 38], large: [40, 62] };
/** a size's width and depth, drawn @param {string} size @param {() => number} rng @returns {[number, number]} */
export const roomDims = (size, rng) => { const [a, b] = ROOM_SIZES[size] || ROOM_SIZES.large; return [a + Math.floor(rng() * (b - a + 1)), a + Math.floor(rng() * (b - a + 1))]; };
/** the sizes of a floor's rooms but its descent room's: bags of small, medium and large, each shuffled @param {number} n @param {() => number} rng */
export function sizesFor(n, rng) {
  const out = [];
  while (out.length < n) { const bag = ['small', 'medium', 'large']; for (let i = bag.length - 1; i > 0; i--) { const k = Math.floor(rng() * (i + 1)); [bag[i], bag[k]] = [bag[k], bag[i]]; } out.push(...bag); }
  return out.slice(0, n);
}

// opts.rooms: [min, max] rooms for a floor (a site's own, sites.js); the Old Barrows keep 6–8. Either
// way it's one draw, so a Barrows floor's rooms stand where they always have.
// opts.layout: 'caverns' (here: rooms of any shape scattered in the abyss, corridors between) or 'halls' (halls.js:
// one building of rectangular rooms and short straight halls; docs/dungeon-halls-proposal.md). A site's (sites.js).
export function generateLevel(seed, theme, opts = {}) {
  if (opts.layout === 'halls') return hallsLevel(seed, theme, opts);
  return cavernsLevel(seed, theme, opts);
}

// The halls: the room count drawn as the caverns draw it, then the building (halls.js)
function hallsLevel(seed, theme, opts) {
  const th = THEMES[theme] || THEMES.dread, rng = mulberry32(((seed >>> 0) ^ 0x9e3779b9) >>> 0);
  const want = opts.rooms ? opts.rooms[0] + Math.floor(rng() * (opts.rooms[1] - opts.rooms[0] + 1)) : 6 + Math.floor(rng() * 3);
  const sizes = [...sizesFor(want - 1, mulberry32(((seed >>> 0) ^ 0x5123e5) >>> 0)), 'large'];
  const L = generateHalls(seed, { want, sizes, dims: roomDims, floorZ: FLOOR_Z, wallZ: WALL_Z });
  return { ...L, theme, th, layout: 'halls' };
}

function cavernsLevel(seed, theme, opts = {}) {
  const th = THEMES[theme] || THEMES.dread;
  const rng = mulberry32(((seed >>> 0) ^ 0x9e3779b9) >>> 0);
  const shapes = ['rect', 'rect', 'oval', 'oval', 'diamond', 'ell'];   // open arenas (no pinched 'plus')
  const rooms = [];
  const want = opts.rooms ? opts.rooms[0] + Math.floor(rng() * (opts.rooms[1] - opts.rooms[0] + 1)) : 6 + Math.floor(rng() * 3);   // 6–8 rooms
  let tries = 0;
  while (rooms.length < want && tries < 1600) {
    tries++;
    // half-extents 20–31 (≈40–62 tiles across): arenas for room battles — a party of
    // three against respawning waves needs space to spread, kite and retreat (GDD §3)
    const rw = 20 + Math.floor(rng() * 12), rh = 20 + Math.floor(rng() * 12);
    const cx = rw + 4 + Math.floor(rng() * (W - 2 * rw - 8));
    const cy = rh + 4 + Math.floor(rng() * (H - 2 * rh - 8));
    const shape = rooms.length === 0 ? 'rect' : shapes[Math.floor(rng() * shapes.length)];   // entrance: a plain hall
    // reject if the padded bbox overlaps an existing room (keeps abyss between them)
    if (rooms.some((r) => Math.abs(r.cx - cx) < r.rw + rw + 8 && Math.abs(r.cy - cy) < r.rh + rh + 8)) continue;
    rooms.push({ id: rooms.length, cx, cy, rw, rh, shape });
  }

  // the entrance is the room nearest the top-left (below), not the first one placed, so the 'rect' above
  // doesn't always land on it. A diamond has no straight north or west wall for the stair up
  // (world.js placeStairsUp), and the floor had no way out: built as a rectangle instead. It holds the
  // diamond, so only floor is added; the draws are the same, and every other room as it was.
  const order = [...rooms].sort((p, q) => (p.cx + p.cy) - (q.cx + q.cy));
  if (order[0] && order[0].shape === 'diamond') order[0].shape = 'rect';

  // the sizes (ROOM_SIZES): the descent room (farthest from the entrance, as below) stays large, as placed; the rest
  // take the bag's, on their own stream, each shrinking about its own middle. So every room and every corridor stands
  // where it did, and a large room is the room it always was. A small diamond would be a pinch: it's an oval.
  {
    const ent = order[0], far = ent && rooms.reduce((best, r) => (hypot(r.cx - ent.cx, r.cy - ent.cy) > hypot(best.cx - ent.cx, best.cy - ent.cy) ? r : best), ent);
    const srng = mulberry32(((seed >>> 0) ^ 0x5123e5) >>> 0), rest = rooms.filter((r) => r !== far), sizes = sizesFor(rest.length, srng);
    // the entrance is never small: corridors cross it, and a small oval had no stretch of back wall left for the stair up
    // (it swaps with the next room that isn't, so the floor keeps its mix)
    const ei = rest.indexOf(ent), si = sizes.findIndex((z, i) => i !== ei && z !== 'small');
    if (ei >= 0 && sizes[ei] === 'small') { if (si >= 0) [sizes[ei], sizes[si]] = [sizes[si], sizes[ei]]; else sizes[ei] = 'medium'; }   // (no other to trade with: medium)
    rest.forEach((r, i) => {
      r.size = sizes[i]; if (r.size === 'large') return;
      const [w, d] = roomDims(r.size, srng); r.rw = Math.min(r.rw, Math.floor(w / 2)); r.rh = Math.min(r.rh, Math.floor(d / 2));
      if (r.size === 'small' && r.shape === 'diamond') r.shape = 'oval';
    });
    if (far) far.size = 'large';
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
  for (let i = 1; i < order.length; i++) {
    // link to the nearest already-placed room (a cheap connected spanning tree)
    let best = order[0], bd = 1e9;
    for (let j = 0; j < i; j++) { const d = hypot(order[j].cx - order[i].cx, order[j].cy - order[i].cy); if (d < bd) { bd = d; best = order[j]; } }
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
  const ent = order[0];
  const entranceBack = (x, y) => { const s = cells.get(key(x, y + 1)), e = cells.get(key(x + 1, y)); return !!ent && ((s && s.room === ent.id) || (e && e.room === ent.id)); };
  for (const nk of wallKeys) {
    if (cells.has(nk)) continue;
    const [x, y] = nk.split(',').map(Number);
    // the entrance's north and west walls always stand, whole: the stair up is built against them (a small entrance
    // had too little standing wall for it once rooms came in sizes)
    if (entranceBack(x, y)) { cells.set(nk, { kind: 'wall', room: -1, corridor: false, wz: WALL_Z }); continue; }
    if (fbm(x * 0.16, y * 0.16, seed + 4001) < 0.30) continue;          // fallen away → open edge
    // height: often full, weathered down in patches (>= FLOOR_Z+2 so it still reads as a wall)
    const wz = fbm(x * 0.24, y * 0.24, seed + 811) > 0.52
      ? WALL_Z : FLOOR_Z + 2 + Math.floor(fbm(x * 0.5, y * 0.5, seed + 909) * (WALL_Z - FLOOR_Z - 2) + 0.5);
    cells.set(nk, { kind: 'wall', room: -1, corridor: false, wz });
  }

  const entrance = order[0] || rooms[0];
  const spawn = entrance ? { x: entrance.cx + 0.5, y: entrance.cy + 0.5 } : { x: W / 2, y: H / 2 };
  // the descent gate sits in the room FARTHEST from the entrance — you must cross
  // the level to find the way down.
  let descentRoom = entrance;
  if (entrance) { let bd = -1; for (const r of rooms) { const d = hypot(r.cx - entrance.cx, r.cy - entrance.cy); if (d > bd) { bd = d; descentRoom = r; } } }
  return { cells, rooms, edges, theme, th, spawn, entrance, descentRoom, W, H, layout: 'caverns' };
}
