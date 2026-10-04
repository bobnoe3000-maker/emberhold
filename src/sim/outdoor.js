// outdoor.js — the surface scenes of the Hollow Vale: the town of Thornwick and
// the overland around it. Same world API as a dungeon level (heightAt /
// materialAt / isWalkable / propAt via world.js), but the ground is a set of
// continuous features — river and road polylines, cobbled plazas, wheat fields —
// that the renderer samples PER PIXEL (smooth banks and verges instead of tile
// staircases), plus placed structures: baked KayKit buildings, trees, rocks and
// mountains whose footprints (envfoot.js) drive collision.
//
// Everything is a pure function of (seed, kind): layouts are hand-directed, the
// scatter (trees, rocks, forests) is seeded.

import { mulberry32, streamSeed, fbm, hash2 } from './rng.js';
import { FLOOR_Z } from './level.js';
import { ENV_FOOT } from './envfoot.js';
import { hypot, sin, cos } from './detmath.js';

// ground codes (pixel + tile)
// (M8: the Fens' swamp ground, docs/region-towns-proposal.md: MARSH is wet peat and reeds you can walk; POOL still bog
// water you can't; DECK the boardwalks and Saltmere's square on piles, laid over either)
export const G = { GRASS: 0, DIRT: 1, COBBLE: 2, WATER: 3, BANK: 4, FIELD: 5, MARSH: 6, POOL: 7, DECK: 8 };
const G_MAT = ['grass', 'dirt', 'cobble', 'water', 'bank', 'field', 'marsh', 'pool', 'deck'];
const CELL = 8;                         // spatial-index cell, tiles

// ── geometry helpers ─────────────────────────────────────────────────────────
function segDist(px, py, s) {
  const dx = s.x2 - s.x1, dy = s.y2 - s.y1, L2 = dx * dx + dy * dy || 1e-6;
  let t = ((px - s.x1) * dx + (py - s.y1) * dy) / L2; t = t < 0 ? 0 : t > 1 ? 1 : t;
  const qx = s.x1 + dx * t, qy = s.y1 + dy * t, ex = px - qx, ey = py - qy;
  return { d: hypot(ex, ey), t, side: dx * ey - dy * ex };
}

function buildIndex(o) {
  // flatten polylines into segments with cumulative length (for flow / rut direction)
  o.segs = [];
  for (const f of [...o.rivers.map((r) => ({ ...r, type: 'river' })), ...o.roads.map((r) => ({ ...r, type: 'road' }))]) {
    let acc = 0;
    for (let i = 0; i + 1 < f.pts.length; i++) {
      const [x1, y1, wa] = f.pts[i], [x2, y2, wb] = f.pts[i + 1], len = hypot(x2 - x1, y2 - y1);   // (a point's own width: the river's, critic pass 10)
      const w1 = wa || f.w, w2 = wb || f.w;
      o.segs.push({ x1, y1, x2, y2, len, s0: acc, w: Math.max(w1, w2), w1, w2, type: f.type, surface: f.surface || 'dirt' });
      acc += len;
    }
  }
  o.grid = new Map();
  const add = (cx, cy, item) => { const k = cx + ',' + cy; let a = o.grid.get(k); if (!a) o.grid.set(k, (a = [])); a.push(item); };
  o.segs.forEach((s, i) => {
    const r = s.w / 2 + 3;
    for (let cy = Math.floor((Math.min(s.y1, s.y2) - r) / CELL); cy <= Math.floor((Math.max(s.y1, s.y2) + r) / CELL); cy++)
      for (let cx = Math.floor((Math.min(s.x1, s.x2) - r) / CELL); cx <= Math.floor((Math.max(s.x1, s.x2) + r) / CELL); cx++) add(cx, cy, i);
  });
}

// Ground at a continuous world point. Returns a shared scratch object:
// { g: code, t: 0 centre → 1 edge (roads/rivers/plazas), lat: signed lateral
//   offset in tiles, along: distance along the feature, hw: half width }.
const OUT = { g: 0, t: 0, lat: 0, along: 0, hw: 0, fx: 0, cap: false, track: false };
export function groundAt(o, gx, gy) {
  const out = OUT; out.g = G.GRASS; out.t = 1; out.lat = 0; out.along = 0; out.hw = 0; out.fx = 0; out.cap = false; out.track = false;
  const cell = o.grid.get(Math.floor(gx / CELL) + ',' + Math.floor(gy / CELL));
  let best = 0, bestRank = 0, roadD = Infinity, riverD = Infinity;      // rank: water 4 > bank 3 > cobble 2 > dirt 1
  let deckD = Infinity, deckQ = null, deckS = null;                      // a boardwalk lies over everything (M8)
  if (cell) {
    for (const i of cell) {
      const s = o.segs[i], q = segDist(gx, gy, s);
      if (s.surface === 'deck') { if (q.d < s.w / 2 && q.d < deckD) { deckD = q.d; deckQ = q; deckS = s; } continue; }
      if (s.type === 'river') {
        // its width eased along the segment; a small wobble (the meander is in the points); a bank 0.5–2.5 wide
        // (critic pass 10: ±1.1 of wobble at a short wavelength, a 1.1-tile bank the whole way)
        const w = s.w1 + (s.w2 - s.w1) * q.t, wob = (fbm(gx * 0.12, gy * 0.12, o.seed + 11) - 0.5) * w * 0.12, hw = w / 2 + wob, d = q.d;
        const bw = Math.min(w * 0.3, 0.5 + 2 * fbm(gx * 0.05, gy * 0.05, o.seed + 13));
        // the NEAREST segment paints it, as for the roads (pass 10: the river's 3-tile segments drew arcs round their ends)
        if (d < hw && (bestRank < 4 || d - hw < riverD)) { bestRank = 4; riverD = d - hw; out.g = G.WATER; out.t = d / hw; out.lat = Math.sign(q.side) * d; out.along = s.s0 + q.t * s.len; out.hw = hw; }
        else if (d < hw + bw && bestRank < 4 && (bestRank < 3 || d - hw < riverD)) { bestRank = 3; riverD = d - hw; out.g = G.BANK; out.t = (d - hw) / bw; out.hw = hw; }
      } else {
        const rank = s.surface === 'cobble' ? 2 : 1;
        const wob = (fbm(gx * 0.3, gy * 0.3, o.seed + 23) - 0.5) * (rank === 2 ? 0.4 : Math.min(1.4, s.w * 0.17)), hw = s.w / 2 + wob;   // (the wobble by the width: a narrow road's edge chewed, pass 10)
        // the NEAREST road segment paints the pixel (not the first found); where that nearest point is a
        // segment end (bends, joins, road ends) the lateral offset is radial, so the painter drops the
        // wheel ruts there (cap) — they used to curl into rings at every bend
        if (q.d < hw && (bestRank < rank || (bestRank === rank && q.d < roadD))) {
          bestRank = rank; roadD = q.d; out.g = rank === 2 ? G.COBBLE : G.DIRT; out.t = q.d / hw; out.lat = Math.sign(q.side) * q.d; out.along = s.s0 + q.t * s.len; out.hw = hw;
          out.cap = (q.t <= 0.001 || q.t >= 0.999) && q.d > 0.6; out.track = s.surface === 'track';
        }
      }
    }
  }
  if (deckS) { out.g = G.DECK; out.t = deckD / (deckS.w / 2); out.lat = Math.sign(deckQ.side) * deckD; out.along = deckS.s0 + deckQ.t * deckS.len; out.hw = deckS.w / 2; return out; }
  if (bestRank >= 3) return out;
  // a junction's apron: packed earth where roads meet, no ruts (critic pass 10: each road's ruts ran on into the join)
  for (const a of o.aprons) {
    const d = hypot(gx - a.x, gy - a.y);
    if (d < a.r && bestRank <= 1) { if (!bestRank) { out.g = G.DIRT; out.t = d / a.r * 0.85; out.lat = 0; out.hw = a.r; } out.cap = true; bestRank = 1; }
  }
  for (const p of o.plazas) {                        // cobbled squares: soft superellipse
    const u = (gx - p.cx) / p.rx, v = (gy - p.cy) / p.ry, au = Math.abs(u), av = Math.abs(v), e = au * au * au + av * av * av;
    const wob = (fbm(gx * 0.3, gy * 0.3, o.seed + 29) - 0.5) * 0.25;
    if (e < 1 + wob && bestRank < 2) { bestRank = 2; out.g = p.surface === 'deck' ? G.DECK : G.COBBLE; out.t = e; out.lat = p.surface === 'deck' ? (gx - gy) / 2 : 0; out.hw = 0; out.along = gx + gy; }
  }
  if (bestRank) return out;
  for (const p of o.pools || []) {                   // still water (M8): a soft superellipse, a reedy fringe round it
    const u = (gx - p.cx) / p.rx, v = (gy - p.cy) / p.ry, au = Math.abs(u), av = Math.abs(v), e = au * au * au + av * av * av;
    const wob = (fbm(gx * 0.11, gy * 0.11, o.seed + 37) - 0.5) * 0.55;
    if (e < 1 + wob) { out.g = G.POOL; out.t = e; return out; }
    if (e < 1.45 + wob) { out.g = G.MARSH; out.t = (e - 1) / 0.45; return out; }
  }
  for (const f of o.fields) {
    if (gx >= f.x0 && gx < f.x1 && gy >= f.y0 && gy < f.y1) {
      out.g = G.FIELD; out.fx = f.axis === 'x' ? gy - f.y0 : gx - f.x0;
      out.t = Math.min(gx - f.x0, f.x1 - gx, gy - f.y0, f.y1 - gy); return out;
    }
  }
  if (o.marsh && fbm(gx * 0.045, gy * 0.045, o.seed + 31) > 0.55) { out.g = G.MARSH; out.t = 1; }   // the fen's open ground: patches of wet peat and reed
  return out;
}

// ── world construction ───────────────────────────────────────────────────────
function makeWorld(seed, kind, W, H, PAD) {
  const GW = W + 2 * PAD, GH = H + 2 * PAD;
  return {
    kind, theme: kind, seed, depth: 0, W, H, PAD, GW, GH,
    rivers: [], roads: [], pools: [], plazas: [], fields: [], aprons: [], structs: [], exits: [], arrivals: {}, labels: [], services: [], hub: null, region: 'vale',
    blocked: new Uint8Array(GW * GH), occ: new Uint8Array(GW * GH), tmat: new Uint8Array(GW * GH),
    props: new Map(), mods: new Map(), hp: new Map(), discovered: new Set(), enemies: [], projectiles: [],
    level: { rooms: [], edges: [], cells: new Map(), th: { name: kind, wall: 'basalt', floors: ['soil'], hazard: 'water' } },
    ss: streamSeed(seed, 131), hs: streamSeed(seed, 7919), cs: streamSeed(seed, 577),
  };
}
const gi = (o, x, y) => { const X = Math.floor(x) + o.PAD, Y = Math.floor(y) + o.PAD; return X < 0 || Y < 0 || X >= o.GW || Y >= o.GH ? -1 : Y * o.GW + X; };

function finalizeGround(o) {
  buildIndex(o);
  for (let Y = 0; Y < o.GH; Y++) for (let X = 0; X < o.GW; X++) {
    const g = groundAt(o, X - o.PAD + 0.5, Y - o.PAD + 0.5).g;
    o.tmat[Y * o.GW + X] = g;
    if (g === G.WATER || g === G.POOL) o.blocked[Y * o.GW + X] = 1;
    if (g !== G.GRASS && g !== G.FIELD && g !== G.MARSH) o.occ[Y * o.GW + X] = 2;      // keep roads, plazas and water clear of scatter
  }
}

// Footprint of a baked sprite placed with its origin at (x, y).
function footRect(id, x, y) { const f = ENV_FOOT[id]; return f ? [x + f[0], y + f[1], x + f[2], y + f[3]] : [x - 0.5, y - 0.5, x + 0.5, y + 0.5]; }

// no road or plaza under a crown (the ellipse in its footprint): the owner, 2026-10-03, no tree on a road. (A crown
// may still lean over the river, as trees do.)
function offRoad(o, id, x, y) {
  const [x0, y0, x1, y1] = footRect(id, x, y), cx = (x0 + x1) / 2, cy = (y0 + y1) / 2, rx = (x1 - x0) / 2, ry = (y1 - y0) / 2;
  for (let ty = Math.floor(y0); ty <= Math.floor(y1); ty++) for (let tx = Math.floor(x0); tx <= Math.floor(x1); tx++) {
    const u = (tx + 0.5 - cx) / rx, v = (ty + 0.5 - cy) / ry; if (u * u + v * v > 1) continue;
    const i = gi(o, tx, ty); if (i >= 0 && (o.tmat[i] === G.DIRT || o.tmat[i] === G.COBBLE)) return false;
  }
  return true;
}
function fits(o, id, x, y, margin = 1, allowRoad = false) {
  const [x0, y0, x1, y1] = footRect(id, x, y);
  for (let ty = Math.floor(y0 - margin); ty <= Math.floor(y1 + margin); ty++)
    for (let tx = Math.floor(x0 - margin); tx <= Math.floor(x1 + margin); tx++) {
      const i = gi(o, tx, ty); if (i < 0) return false;
      if (o.occ[i] === 1 || (!allowRoad && o.occ[i] === 2)) return false;
    }
  return true;
}

// shape: 'rect' (buildings), 'round' (trees, mountains), 'none', 'deck' (bridges clear water)
function put(o, id, x, y, shape = 'rect', shrink = 0.12) {
  if (!ENV_FOOT[id]) return;
  o.structs.push({ id, x, y });
  const [x0, y0, x1, y1] = footRect(id, x, y), w = x1 - x0, h = y1 - y0;
  for (let ty = Math.floor(y0); ty <= Math.floor(y1); ty++) for (let tx = Math.floor(x0); tx <= Math.floor(x1); tx++) {
    const i = gi(o, tx, ty); if (i < 0) continue;
    if (shape !== 'deck' && o.occ[i] !== 2) o.occ[i] = 1;
    const cx = tx + 0.5, cy = ty + 0.5;
    if (shape === 'rect') { if (cx > x0 + w * shrink && cx < x1 - w * shrink && cy > y0 + h * shrink && cy < y1 - h * shrink) o.blocked[i] = 1; }
    else if (shape === 'round') { const u = (cx - (x0 + x1) / 2) / (w / 2 * (1 - shrink)), v = (cy - (y0 + y1) / 2) / (h / 2 * (1 - shrink)); if (u * u + v * v < 1) o.blocked[i] = 1; }
    else if (shape === 'deck' && (w > h ? Math.abs(cy - y) < 3.2 : Math.abs(cx - x) < 3.2)) o.blocked[i] = 0;   // the walkable deck only
  }
}
// a thin run (fence / wall) that must block at least one tile across
function putRun(o, id, x, y) {
  put(o, id, x, y, 'none');
  const [x0, y0, x1, y1] = footRect(id, x, y), cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
  if (x1 - x0 > y1 - y0) { for (let tx = Math.floor(x0 + 0.5); tx < x1 - 0.5; tx++) { const i = gi(o, tx, cy); if (i >= 0) o.blocked[i] = 1; } }
  else for (let ty = Math.floor(y0 + 0.5); ty < y1 - 0.5; ty++) { const i = gi(o, cx, ty); if (i >= 0) o.blocked[i] = 1; }
}
// a gate across a road: block the wall, leave the gatehouse's way through (±3 tiles) clear
function putGate(o, id, x, y) {
  put(o, id, x, y, 'none');
  const [x0, y0, x1, y1] = footRect(id, x, y), alongX = x1 - x0 > y1 - y0;
  for (let t = Math.floor(alongX ? x0 : y0); t <= (alongX ? x1 : y1); t++) {
    if (Math.abs(t + 0.5 - (alongX ? x : y)) < 3) continue;
    for (let d = -1; d <= 1; d++) { const i = alongX ? gi(o, t, y + d) : gi(o, x + d, t); if (i >= 0) o.blocked[i] = 1; }
  }
}
// a straight wall from a to b (x along y = at, or y along x = at): 20-tile runs end to end, the last pulled back to
// end at b, so a wall closes on its towers and gate with no gap
function putWall(o, id, alongX, at, a, b) {
  for (let c = a + 10; ; c += 20) { const m = Math.min(c, b - 10); putRun(o, id, alongX ? m : at, alongX ? at : m); if (m >= b - 10) break; }
}
function putProp(o, kind, x, y) { o.props.set(Math.floor(x) + ',' + Math.floor(y), kind); const i = gi(o, x, y); if (i >= 0) o.occ[i] = 1; }

const TREE_SINGLE = ['pine_1', 'pine_2', 'pine_3', 'pine_4', 'pine_5', 'pine_6', 'oak_1', 'oak_2', 'oak_3', 'oak_4', 'autumn_1', 'autumn_2', 'autumn_3', 'birch_1', 'birch_2', 'birch_3', 'dead_1', 'dead_2'];   // (birches: critic pass 11d)
const TREE_CLUSTER = ['grove_1', 'grove_2', 'grove_3', 'grove_4', 'grove_5', 'grove_6'];
// the Fens' (M8, fens critic pass 2): alder carr and willows, low and dark, and the drowned dead
const FENS_CLUSTER = ['carr_1', 'carr_2'], FENS_SINGLE = ['alder_1', 'alder_2', 'alder_3', 'willow_1', 'willow_2', 'dead_1', 'dead_2'];
const ROCKS = ['rock_F', 'rock_G', 'rock_H'];        // the nature pack's (docs/nature-pack-proposal.md); rock_A..E stay at the barrows
// The undergrowth (Quaternius' Stylized Nature MegaKit, CC0): LOW is walked through (flowers, grass, ferns, clover,
// a plant), SOLID isn't (a flowering bush, the rocks); FOOT grows at a tree's foot (and the shelf fungus only there).
const LOW = ['ug_flowers_1', 'ug_flowers_2', 'ug_grass_1', 'ug_grass_2', 'ug_grass_1', 'ug_fern', 'ug_clover', 'ug_plant'];
const FOOT = [...LOW, 'ug_mushroom', 'ug_mushroom'];
const SOLID = ['ug_bush', 'ug_bush', 'rock_F', 'rock_G', 'rock_H'];
const pick = (rng, a) => a[(rng() * a.length) | 0];

// scatter trees / rocks in a region with a density mask; never on roads, water or buildings,
// and never overlapping one another (trees keep a tile of verge from roads; mountains may crowd)
function scatter(o, rng, x0, y0, x1, y1, step, fn) {
  for (let y = y0; y < y1; y += step) for (let x = x0; x < x1; x += step) {
    const jx = x + (rng() - 0.5) * step * 0.9, jy = y + (rng() - 0.5) * step * 0.9, id = fn(jx, jy);
    if (!id) continue;
    const mount = /mountain/.test(id), round = mount || /pine|oak|autumn|dead|grove|alder|willow|carr/.test(id);
    if (fits(o, id, jx, jy, mount ? -1 : round ? 0.6 : 0.5)) put(o, id, jx, jy, round ? 'round' : 'rect', round ? 0.35 : 0.1);
  }
}
// Dress the grass with undergrowth: density(x, y) → 0..1, where it may grow; then a few low plants at the front of
// some trees' feet (the side the camera sees). Placed LAST, on its own stream: nothing it adds can move a tree,
// rock or house (test/town.test.mjs checks the order).
function undergrowth(o, x0, y0, x1, y1, step, density) {
  const rng = mulberry32(streamSeed(o.seed, 4409));
  for (let y = y0; y < y1; y += step) for (let x = x0; x < x1; x += step) {
    const jx = x + (rng() - 0.5) * step * 0.9, jy = y + (rng() - 0.5) * step * 0.9, d = density(jx, jy), r = rng();
    if (!(d > 0) || r > d) continue;
    const solid = rng() < 0.3, id = pick(rng, solid ? SOLID : LOW);
    if (fits(o, id, jx, jy, solid ? 0.4 : 0.1)) put(o, id, jx, jy, solid ? 'round' : 'none', 0.35);
  }
  for (const t of o.structs.slice()) {
    if (!/pine|oak|autumn|grove|alder|willow|carr/.test(t.id) || rng() < 0.35) continue;
    const f = ENV_FOOT[t.id], rad = f ? Math.max(f[2] - f[0], f[3] - f[1]) / 2 : 4;
    for (let k = 0, n = 1 + Math.floor(rng() * 3); k < n; k++) {
      const a = (rng() - 0.5) * 2.2 + Math.PI / 4, dist = rad * (0.7 + rng() * 0.5), x = t.x + cos(a) * dist, y = t.y + sin(a) * dist, id = pick(rng, FOOT);
      if (density(x, y) >= 0 && fits(o, id, x, y, 0.1)) put(o, id, x, y, 'none', 0.35);
    }
  }
}

// Wheat on the fields (critic pass 11d: the reference's fields stand up, ours were painted stripes): tufts in rows
// along the field's furrows, walked through. Its own stream; placed before the undergrowth, which then grows round it.
const WHEAT = ['wheat_1', 'wheat_2', 'wheat_3'];
function wheat(o) {
  const rng = mulberry32(streamSeed(o.seed, 4416));
  for (const f of o.fields) {
    const X = f.axis === 'x', rows = X ? f.y1 - f.y0 : f.x1 - f.x0, cols = X ? f.x1 - f.x0 : f.y1 - f.y0;
    for (let r0 = 0.75; r0 < rows - 0.5; r0 += 1.5) for (let c0 = 0.8; c0 < cols - 0.5; c0 += 1.25) {   // a row on each furrow's crest (outdoorpaint: 1.5 apart)
      const x = X ? f.x0 + c0 : f.x0 + r0, y = X ? f.y0 + r0 : f.y0 + c0;
      const jx = x + (rng() - 0.5) * 0.4, jy = y + (rng() - 0.5) * 0.25, id = pick(rng, WHEAT);
      if (fits(o, id, jx, jy, 0)) put(o, id, jx, jy, 'none');
    }
  }
}

// Farmyard life and dressed doorsteps (critic pass 11e: the reference's village is busy with cows, hay, pumpkins,
// barrels and flowers; ours stood bare). `herd`: n of a kind round a spot, apart and clear of everything. `dress`:
// A field's back edges (north, west: the camera sees them past the crop) get a dry-stone wall or a rail fence, in
// 12-tile runs (the last may run on past the corner), a run left out wherever it would cross a road or something placed (critic pass 11g: the reference's
// fields are walled; ours lay open on the grass). The front edges stay open, so a field never walls a road off.
// No draws: placed before the herds and the wheat (which keep round it) and the undergrowth.
function bound(o, kindOf) {
  o.fields.forEach((f, k) => {
    const kind = kindOf(k), len = ENV_FOOT[kind + '_90'][2] - ENV_FOOT[kind + '_90'][0];
    for (let x = f.x0 + len / 2; x - len / 2 < f.x1 - 3; x += len) { const id = kind + '_90', y = f.y0 - 0.9; if (fits(o, id, x, y, -0.2)) putRun(o, id, x, y); }
    for (let y = f.y0 + len / 2; y - len / 2 < f.y1 - 3; y += len) { const id = kind + '_0', x = f.x0 - 0.9; if (fits(o, id, x, y, -0.2)) putRun(o, id, x, y); }
  });
}
// a house's camera-facing walls (+x, +y) get a thing or two at their foot. Their own stream, placed before the
// wheat and the undergrowth, so nothing placed earlier moves.
function herd(o, rng, ids, cx, cy, n, spread) {
  for (let k = 0, t = 0; k < n && t < n * 12; t++) {
    const id = pick(rng, ids), x = cx + (rng() - 0.5) * spread * 2, y = cy + (rng() - 0.5) * spread * 2;
    if (fits(o, id, x, y, 0.4)) { put(o, id, x, y, 'round', 0.3); k++; }
  }
}
const DOORSTEP = ['barrel', 'crate_A_small', 'sack', 'planter_1', 'planter_1', 'pumpkins_1', 'hay_2', 'bucket_water'];
function dress(o, rng, keepOut) {
  for (const st of o.structs.slice()) {
    if (!/_(house|housex)_\d$/.test(st.id)) continue;
    const f = ENV_FOOT[st.id]; if (!f) continue;
    for (let k = 0, n = 1 + Math.floor(rng() * 2), t = 0; k < n && t < 10; t++) {
      const onX = rng() < 0.5, id = pick(rng, DOORSTEP);
      const x = onX ? st.x + f[2] + 0.9 : st.x + f[0] + 0.8 + rng() * (f[2] - f[0] - 1.6), y = onX ? st.y + f[1] + 0.8 + rng() * (f[3] - f[1] - 1.6) : st.y + f[3] + 0.9;
      if (keepOut(x, y) || !fits(o, id, x, y, 0.15)) continue;
      put(o, id, x, y, 'rect', 0.1); k++;
    }
  }
}

// Keep the view of a landmark clear: the camera looks from +x+y, so anything tall in the wedge
// in front of (and a little around) a site hides it. True if (x, y) is in that wedge.
function inFrontOf(sites, x, y, depth = 30, half = 18) {
  for (const [cx, cy] of sites) { const a = (x - cx) + (y - cy), b = (x - cx) - (y - cy); if (a > -8 && a < depth && Math.abs(b) < half) return true; }
  return false;
}

// forest ring around the playable area (hides the world's edge, bounds the camera)
function forestRing(o, rng, inset, cluster = TREE_CLUSTER, single = TREE_SINGLE) {
  const lo = -o.PAD + 4, hiX = o.W + o.PAD - 4, hiY = o.H + o.PAD - 4;
  scatter(o, rng, lo, lo, hiX, hiY, 11, (x, y) => {
    const out = Math.max(-x - inset, x - (o.W + inset), -y - inset, y - (o.H + inset));
    if (out < 0) return null;
    return out > 8 || rng() < 0.75 ? pick(rng, cluster) : pick(rng, single);
  });
  // hard edge: nothing walks past the ring
  for (let Y = 0; Y < o.GH; Y++) for (let X = 0; X < o.GW; X++) {
    const x = X - o.PAD, y = Y - o.PAD;
    if (x < -inset - 6 || y < -inset - 6 || x > o.W + inset + 6 || y > o.H + inset + 6) o.blocked[Y * o.GW + X] = 1;
  }
}

// ── TOWNS — one hub per region ───────────────────────────────────────────────
// Every region's town is the same hub (docs/town-layout-proposal.md): a walled circuit, the road
// straight into the east gate, a cobbled high street, then the TOWN SQUARE, framed like a home screen, with the
// five services in the same places and the same shapes everywhere. Only the names, the region's tones and the
// circuit's material change (tools/actor-lab town.json → assets/env/town-<region>: Thornwick's is timber).
export const REGIONS = {
  vale:    { name: 'Thornwick', tavern: 'The Tired Mule',     inn: 'The Crossed Keys',  shop: "Wendel's Provisions",  smith: 'Hale & Daughter, Smiths', temple: 'Shrine of the Ember' },
  fens:    { name: 'Saltmere',  tavern: 'The Drowned Eel',    inn: 'The Stilt House',   shop: 'Saltmere Chandlery',   smith: 'The Tidewater Forge',     temple: 'Chapel of the Grey Sisters' },
  reach:   { name: 'Ashgate',   tavern: 'The Slag & Bellows', inn: "Deepdelver's Rest", shop: 'The Ashgate Exchange', smith: 'The Ashgate Forge',       temple: 'Shrine of the Last Flame' },
  heights: { name: 'Frosthold', tavern: 'The Frozen Flagon',  inn: "Pilgrims' Hall",    shop: 'Frosthold Outfitters', smith: 'Ironpeak Smithy',         temple: 'The Monastery Chapel' },
};
function buildTown(seed, region) {
  const R = REGIONS[region] ? region : 'vale', info = REGIONS[R];
  const o = makeWorld(seed, 'town', 140, 120, 90), rng = mulberry32(streamSeed(seed, 4401)), B = (t, n = 1) => `${R}_${t}_${n}`;
  o.name = info.name; o.region = R;
  // The circuit is a box. The camera looks from +x+y, so the back walls (north, west) show their inner faces behind
  // the town, and the front ones (east, south) stand low in front of gardens, under the menu bar at the square.
  // EVERY ENTRANCE FACES THE WELL. The camera sees only a building's +x and +y faces, so every service stands
  // up-screen of the well (north or west of it) with its door on the face toward it: the tavern and the smithy +x
  // (faceX in town.json), the temple, the shop and the inn +y. The places came from a search: no door behind another
  // service, every door in the hub frame, 8+ tiles between services (test/town.test.mjs holds them to it).
  const WX0 = 10, WX1 = 112, WY0 = 8, WY1 = 108, GY = 80;
  const M = [66, 71];                                    // the square's centre: the well
  // (no stream outside the gate any more: the owner, 2026-10-04, took it and its bridge off the approach)
  o.roads.push({ w: 6, surface: 'dirt', pts: [[230, GY], [112, GY]] });
  o.roads.push({ w: 6, surface: 'cobble', pts: [[114, GY], [84, GY], [76, 76]] });
  o.plazas.push({ cx: 60, cy: 62, rx: 24, ry: 22 }, { cx: 36, cy: 40, rx: 8, ry: 7 });      // the square, and the temple's forecourt open to it
  o.fields.push({ x0: 128, y0: 18, x1: 150, y1: 50, axis: 'x' }, { x0: 132, y0: 92, x1: 152, y1: 114, axis: 'y' }, { x0: 20, y0: 110, x1: 60, y1: 122, axis: 'x' });
  finalizeGround(o);

  // the square: the temple at its head (the top of the frame), the tavern and the shop, then the smithy and the inn
  const svc = [
    ['temple', B('temple'), [34, 24]], ['tavern', B('tavern'), [29, 48]], ['shop', B('shop'), [50, 41]],
    ['smith', B('smith'), [51, 67]], ['inn', B('inn'), [73, 55]],
  ];
  const PLAQUE = { shop: [8, 5] };                         // the shop's plaque down on its own roof: off the temple's door behind it and the HUD's buttons
  for (const [kind, id, [x, y]] of svc) { const [px, py] = PLAQUE[kind] || [0, 0]; put(o, id, x, y); o.services.push({ kind, id, x, y, name: info[kind] }); o.labels.push({ x: x + px, y: y + py, id, text: info[kind], service: kind }); }
  put(o, B('well'), M[0], M[1]);
  for (const [x, y] of [[41, 57], [60, 50], [80, 64], [61, 80]]) putProp(o, 'brazier', x, y);
  for (const [id, x, y] of [['barrel', 84, 60], ['barrel', 85, 62], ['crate_A_big', 57, 75], ['sack', 58, 77], ['bucket_water', M[0] + 4, M[1] + 2]]) put(o, id, x, y, 'rect', 0);
  o.hub = { x: 58, y: 58, r: 32, focus: { x: 60, y: 60 } };   // the square from the temple's forecourt to the high street's mouth
  o.lead = { x0: 113, y0: GY - 12, x1: 160, y1: GY + 12, x: WX1, y: GY, k: 0.5 };   // on the approach road the camera leads halfway to the gate (renderer.js)

  // the circuit: towers at the corners and mid-runs, the curtain (a palisade in Thornwick) between, the gate over the high street
  const towers = [[WX0, WY0], [61, WY0], [WX1, WY0], [WX0, 58], [WX1, 40], [WX0, WY1], [61, WY1], [WX1, WY1]];
  putWall(o, B('curtain'), true, WY0, WX0, WX1); putWall(o, B('curtain'), true, WY1, WX0, WX1); putWall(o, B('curtainy'), false, WX0, WY0, WY1);
  putWall(o, B('curtainy'), false, WX1, WY0, GY - 7); putWall(o, B('curtainy'), false, WX1, GY + 7, WY1);
  for (const [x, y] of towers) put(o, B('tower'), x, y, 'round', 0.1);
  putGate(o, B('gatehousey'), WX1, GY);

  // houses: a row along the high street's north side, the quarters at the back (north and west), low gardens in front
  [[100, 68, 'house', 1], [76, 19, 'house', 2], [88, 19, 'house', 1], [100, 19, 'house', 3], [101, 31, 'housex', 2], [89, 33, 'housex', 1],
   [24, 70, 'housex', 2], [24, 82, 'house', 1], [40, 97, 'house', 3], [24, 96, 'housex', 1]]
    .forEach(([x, y, t, n]) => put(o, B(t, n), x, y));
  for (const [x, y] of [[97, 75], [107, 75], [87, 75]]) putProp(o, 'brazier', x, y);
  for (const [id, x, y] of [['wheelbarrow', 96, 90], ['resource_lumber', 88, 96], ['barrel', 106, 70], ['crate_A_big', 92, 84]]) put(o, id, x, y, 'rect', 0);
  for (const [id, x, y] of [['oak_2', 20, 18], ['oak_3', 46, 16], ['autumn_3', 19, 36]]) put(o, id, x, y, 'round', 0.35);   // the churchyard's trees, behind the temple
  // trees among the houses of the back quarters (critic pass 11l: the reference's village stands among its trees;
  // ours stood in a clearing, its trees outside the walls). Up-screen of the square and never on it, so they frame
  // the services and hide nobody; a spot is left bare if anything is there.
  for (const [id, x, y] of [['birch_1', 60, 20], ['birch_1', 80, 30], ['autumn_2', 96, 44], ['birch_1', 22, 60], ['autumn_2', 36, 86]])
    if (fits(o, id, x, y, 0)) put(o, id, x, y, 'round', 0.35);
  // outside: farms on the fields
  put(o, B('farm'), 140, 34); put(o, B('farmx'), 144, 104);

  // trees: orchards and gardens in the walls' front corners, woods beyond the back walls, the ring
  const inside = (x, y) => x > WX0 + 4 && x < WX1 - 4 && y > WY0 + 4 && y < WY1 - 4;
  scatter(o, rng, -20, -20, 160, 140, 9, (x, y) => {
    if (inside(x, y)) return y > 84 && x > 84 && rng() < 0.5 ? pick(rng, ['oak_2', 'autumn_3', 'oak_1']) : null;   // the gardens behind the south wall
    if (x > WX0 - 8 && x < WX1 + 22 && y > WY0 - 8 && y < WY1 + 8) return null;   // the walls' verge and the moat
    if (x + y < 60 || x < 0) return rng() < 0.7 ? pick(rng, TREE_CLUSTER) : pick(rng, TREE_SINGLE);
    const n = fbm(x * 0.05, y * 0.05, o.seed + 3);
    return n > 0.55 && rng() < 0.4 ? pick(rng, TREE_SINGLE) : rng() < 0.05 ? pick(rng, ROCKS) : null;
  });
  forestRing(o, rng, 10);
  bound(o, () => 'fence');                                         // the fields' fences first: the beasts graze round them
  { const fr = mulberry32(streamSeed(seed, 4417));                // the farms' beasts, the houses' doorsteps
    herd(o, fr, ['cow_1', 'cow_2', 'cow_3'], 160, 34, 4, 6); herd(o, fr, ['sheep_1', 'sheep_2'], 142, 66, 5, 6);
    herd(o, fr, ['hens_1'], 136, 58, 2, 3); herd(o, fr, ['hay_1', 'hay_2', 'pumpkins_1'], 154, 52, 3, 4); herd(o, fr, ['pumpkins_1', 'hay_1'], 152, 116, 2, 3);
    dress(o, fr, (x, y) => hypot(x - o.hub.x, y - o.hub.y) < o.hub.r); }
  wheat(o);
  // the undergrowth: the walls' verges (in and out), the gardens, flower patches; never the square
  undergrowth(o, -10, -10, 150, 130, 3, (x, y) => {
    if (hypot(x - o.hub.x, y - o.hub.y) < o.hub.r + 4) return -1;
    const wall = Math.min(Math.abs(x - WX0), Math.abs(x - WX1), Math.abs(y - WY0), Math.abs(y - WY1));
    const inBox = x > WX0 - 9 && x < WX1 + 9 && y > WY0 - 9 && y < WY1 + 9;
    return Math.max(inBox && wall < 5 ? 0.5 : 0, x > 84 && y > 84 && x < WX1 && y < WY1 ? 0.5 : 0,
      fbm(x * 0.09, y * 0.09, o.seed + 9) > 0.66 ? 0.45 : 0);
  });
  o.exits.push({ x0: 146, y0: 66, x1: 160, y1: 94, to: 'overland', arrive: 'thornwick' });
  o.arrivals = { default: { x: M[0] + 0.5, y: M[1] + 6.5 }, overland: { x: 141.5, y: GY + 0.5 }, temple: { x: 38.5, y: 42.5 } };
  o.spawn = o.arrivals.default;
  return o;
}

// ── THE GREYWATER FENS (M8; world doc §3.2) — the overland south of the Vale ───────────────────────────────────
// Reed-choked marsh round a drowned imperial canal, ruled straight north to south. The canal road comes down from
// the Vale on its west bank to Saltmere, the stilt town in its mere, and on south to the Canal Locks, where it
// crosses, and the Drowned Abbey in the canal's flood. Open ground is wet peat and reed (o.marsh), with meres of
// still bog water. The five sites (m8-plan slice 3) stand on the canal's banks and the meres' shores, each with its
// way in toward the camera (+y) where its road or causeway ends, its own water behind it.
export const FENS = { north: [60, -6], salt: [72, 60], mound: [34, 104], locks: [100, 128], lockhall: [76, 112], pools: [180, 96], abbey: [126, 206], reedholm: [202, 190] };
function buildFens(seed) {
  const o = makeWorld(seed, 'overland', 240, 240, 90), rng = mulberry32(streamSeed(seed, 4431)), B = (t, n = 1) => `fens_${t}_${n}`;
  o.name = 'The Greywater Fens'; o.region = 'fens'; o.marsh = true;
  const { north, salt, mound, locks, lockhall, pools, abbey, reedholm } = FENS;
  // the canal: straight runs between the imperial works, wider where it broke its banks
  o.rivers.push({ w: 10, pts: [[104, -60], [103, 60], [101, locks[1]], [104, 180], [118, 200], [128, 230], [134, 320]] });
  // meres: Saltmere's, the Mound's (behind the island), the Sickpools' green water, the Abbey's flood round its walls;
  // and the fen's own, by the seed
  o.pools.push({ cx: salt[0] - 3, cy: salt[1] - 6, rx: 16, ry: 13 }, { cx: mound[0] - 12, cy: mound[1] - 10, rx: 17, ry: 12 },
    { cx: pools[0] + 4, cy: pools[1] - 16, rx: 15, ry: 9 }, { cx: abbey[0] + 2, cy: abbey[1] - 4, rx: 22, ry: 15 });
  const keepOut = [north, salt, mound, locks, lockhall, pools, abbey, reedholm];
  for (let i = 0; i < 26; i++) {
    const cx = rng() * 240, cy = rng() * 240, rx = 5 + rng() * 11, ry = 4 + rng() * 8;
    if (keepOut.some(([x, y]) => hypot(x - cx, y - cy) < 26 + rx) || Math.abs(cx - 103) < 16 + rx) continue;
    o.pools.push({ cx, cy, rx, ry });
  }
  const door = (p, dy = 12) => [p[0] + 1, p[1] + dy];                                                            // a site's way in, in front of it
  const ROADS = [
    { w: 5, surface: 'dirt', pts: [[north[0], -30], [north[0] + 2, 14], [salt[0] + 12, salt[1] - 20], [salt[0] + 20, salt[1] + 6], [92, 100], [locks[0] - 8, locks[1]]] },   // the canal road, down from the Vale past Saltmere to the Locks
    { w: 4, surface: 'deck', pts: [[salt[0] + 19, salt[1]], [salt[0] - 2, salt[1]]] },                                     // Saltmere's boardwalk, straight in off the canal road to its landing gate
    { w: 3, surface: 'deck', pts: [[salt[0] + 10, salt[1] + 1], [salt[0] + 10, salt[1] + 4]] },                            // (world doc v1.23) the jetty off it to Wenna Pike's punt: the Mere Tower
    { w: 5, surface: 'dirt', pts: [[locks[0] - 8, locks[1]], [locks[0] + 18, locks[1]]] },                                  // over the lock gates
    { w: 3, surface: 'track', pts: [[92, 114], [86, 122], [lockhall[0] + 1, lockhall[1] + 11]] },                         // to the lock-keepers' door
    { w: 4, surface: 'dirt', pts: [[locks[0] + 18, locks[1]], [150, 116], door(pools, 14)] },                              // east to the Sickpools
    { w: 4, surface: 'dirt', pts: [[locks[0] - 8, locks[1]], [94, 170], [abbey[0] - 26, abbey[1] - 4]] },                    // south to the Abbey's flood
    { w: 4, surface: 'deck', pts: [[abbey[0] - 26, abbey[1] - 4], [abbey[0] - 14, abbey[1] + 10], [abbey[0] - 5, abbey[1] + 17], door(abbey, 17), door(abbey, 9)] },   // the causeway over it, up to the west door
    { w: 3, surface: 'track', pts: [[locks[0] + 18, locks[1]], [150, 150], [184, 196], [192, 204], [reedholm[0] - 2, reedholm[1] + 14]] },   // up to the foot of Reedholm's rise
    { w: 3, surface: 'track', pts: [[92, 96], [62, 100], [mound[0] + 14, mound[1] + 14], door(mound, 12)] },                  // west to the Toadking's shore
  ].map((r) => ({ ...r, pts: r.surface === 'deck' ? r.pts : fillet(r.pts, Math.max(8, r.w * 2)) }));
  o.roads.push(...ROADS);
  finalizeGround(o);
  put(o, 'bridge_90', locks[0] + 1, locks[1], 'deck');                                                              // the lock gates' bridge
  // Saltmere from outside: the boardwalk comes in straight off the canal road to the landing gate (its board and two
  // lanterns: the way in, the town's name over it), the stilt houses standing in the mere behind and beside its end,
  // up-screen of it and clear of the road (2026-10-04, the owner: a house stood on the road and the way in was a gap)
  { const G = [salt[0] + 4, salt[1]];
    put(o, B('landing'), G[0], G[1], 'none');
    for (const dy of [-2.6, 2.6]) { const i = gi(o, G[0], G[1] + dy); if (i >= 0) o.blocked[i] = 1; }   // the piles
    for (const [id, x, y] of [[B('stilttavern'), salt[0] - 6, salt[1] - 12], [B('stilt', 1), salt[0] - 16, salt[1]], [B('stilt', 2), salt[0] + 2, salt[1] - 18],
      [B('stilt', 3), salt[0] - 14, salt[1] + 12], [B('stilt', 1), salt[0] - 20, salt[1] - 16], [B('stilt', 2), salt[0] - 8, salt[1] - 26]]) put(o, id, x, y);
    for (const [id, x, y] of [[B('punt'), salt[0] + 10, salt[1] + 8], [B('punt'), salt[0] - 22, salt[1] - 8], [B('eeltrap'), salt[0] - 22, salt[1] + 4], [B('eeltrap'), salt[0] + 2, salt[1] + 10]]) put(o, id, x, y, 'rect', 0); }
  // the sites (world doc §3.2): the Toadking's island, the lock-keepers' hall by the gates, the vats, the Abbey in its
  // flood, Reedholm on its rise (the Undercroft's door in its chapel front, shut until the Fens set is whole)
  put(o, B('boathall'), mound[0], mound[1]); put(o, B('lockhall'), lockhall[0], lockhall[1]); put(o, B('vats'), pools[0], pools[1]);
  put(o, B('abbey'), abbey[0], abbey[1]); put(o, B('priory'), reedholm[0], reedholm[1]);
  for (const [id, x, y] of [[B('punt'), mound[0] - 14, mound[1] + 4], [B('eeltrap'), mound[0] - 18, mound[1] - 2], [B('punt'), abbey[0] + 16, abbey[1] + 10]]) put(o, id, x, y, 'rect', 0);
  o.labels.push({ x: salt[0] + 4, y: salt[1], id: B('landing'), text: 'Saltmere' },
    { x: mound[0], y: mound[1], id: B('boathall'), text: "Toadking's Mound", site: 'toadking_mound' }, { x: lockhall[0], y: lockhall[1], id: B('lockhall'), text: 'The Canal Locks', site: 'canal_locks' },
    { x: pools[0], y: pools[1], id: B('vats'), text: 'The Sickpools', site: 'sickpools' }, { x: abbey[0], y: abbey[1], id: B('abbey'), text: 'The Drowned Abbey', site: 'drowned_abbey' },
    { x: reedholm[0], y: reedholm[1], id: B('priory'), text: 'Reedholm' },
    { x: salt[0] + 10, y: salt[1] + 8, id: B('punt'), text: 'The Mere Tower · Wenna’s punt', site: 'mere_tower' });
  // the fen's trees: alder carr and willows, low and dark, dead trees standing in the water's edge; never on a road
  // (fens critic pass 2: the Vale's birches and mixed groves read round and cheerful here; the same draws, the Fens' kinds)
  scatter(o, rng, -60, -60, 300, 300, 7, (x, y) => {
    if (keepOut.some(([kx, ky]) => hypot(x - kx, y - ky) < 18) || inFrontOf(keepOut, x, y, 26, 14)) return null;
    const n = fbm(x * 0.03, y * 0.03, o.seed + 41), out = Math.max(-x, x - 240, -y, y - 240);
    if (out > 0) return rng() < 0.8 ? pick(rng, ['carr_1', 'carr_2', 'dead_1', 'willow_1']) : null;
    return n > 0.58 ? pick(rng, ['alder_1', 'alder_2', 'alder_3', 'carr_1', 'willow_2']) : rng() < 0.05 ? pick(rng, ['dead_1', 'dead_2']) : null;
  });
  forestRing(o, rng, 6, FENS_CLUSTER, FENS_SINGLE);
  const ways = [mound, lockhall, pools, abbey, reedholm].map((p) => door(p, 8));
  undergrowth(o, -10, -10, 250, 250, 4, (x, y) => {
    if (keepOut.some(([kx, ky]) => hypot(x - kx, y - ky) < 12) || ways.some(([kx, ky]) => hypot(x - kx, y - ky) < 8)) return -1;
    return fbm(x * 0.08, y * 0.08, o.seed + 43) > 0.6 ? 0.5 : 0.08;
  });
  o.exits.push({ x0: north[0] - 8, y0: -11, x1: north[0] + 9, y1: -4, to: 'overland', region: 'vale', arrive: 'fens' });   // back up the canal road to the Vale
  o.exits.push({ x0: salt[0] - 2, y0: salt[1] - 2, x1: salt[0] + 3.5, y1: salt[1] + 2, to: 'town', arrive: 'overland' });   // through the landing gate: into Saltmere
  // each site's door: a box in front of it (the Undercroft's is the low door in Reedholm's chapel front, left of centre)
  const SITE_AT = { toadking_mound: mound, canal_locks: lockhall, sickpools: pools, drowned_abbey: abbey, reedholm_undercroft: [reedholm[0] - 3, reedholm[1]] };
  const DOOR_Y = { toadking_mound: 7, canal_locks: 5.5, sickpools: 6, drowned_abbey: 8.5, reedholm_undercroft: 7.5 };
  for (const [site, [x, y]] of Object.entries(SITE_AT)) o.exits.push({ x0: x - 2.5, y0: y + DOOR_Y[site], x1: x + 3.5, y1: y + DOOR_Y[site] + 3, to: 'dungeon', site });
  o.arrivals = { default: { x: salt[0] + 12.5, y: salt[1] + 0.5 }, saltmere: { x: salt[0] + 12.5, y: salt[1] + 0.5 }, vale_road: { x: north[0] + 0.5, y: 2.5 } };   // on the boardwalk, facing the gate
  for (const [site, [x, y]] of Object.entries(SITE_AT)) o.arrivals[site] = { x: x + 1.5, y: y + DOOR_Y[site] + 7.5 };
  // Wenna Pike's punt at the jetty's end (world doc v1.23; tower.js): out to the Mere Tower, and back to the jetty
  o.exits.push({ x0: salt[0] + 8.5, y0: salt[1] + 3.5, x1: salt[0] + 11.5, y1: salt[1] + 5.5, to: 'dungeon', site: 'mere_tower' });
  o.arrivals.mere_tower = { x: salt[0] + 10.5, y: salt[1] + 1 };
  o.spawn = o.arrivals.default;
  return o;
}

// ── SALTMERE, the Fens' waystation (M8; docs/region-towns-proposal.md) ─────────────────────────────────────────
// No wall: the water is all round it. Stilt houses over the bog, boardwalks for streets, the square a deck on piles
// in the same place and shape as every town's, and two services standing where a town's tavern and temple stand:
// the Drowned Eel (with the Guild's board) and the Grey Sisters' chapel, on its own peat island. The well is a
// rainwater cistern: nobody drinks the fen.
function buildWaystation(seed, region) {
  const R = region, info = REGIONS[R], o = makeWorld(seed, 'town', 130, 116, 90), rng = mulberry32(streamSeed(seed, 4433)), B = (t, n = 1) => `${R}_${t}_${n}`;
  o.name = info.name; o.region = R; o.marsh = true; o.waystation = true;
  const M = [66, 71], GY = 80;
  // the mere under the town: open water round the square, the chapel's island left dry at the head
  o.pools.push({ cx: 92, cy: 40, rx: 26, ry: 18 }, { cx: 18, cy: 80, rx: 16, ry: 26 }, { cx: 96, cy: 100, rx: 34, ry: 14 }, { cx: 48, cy: 104, rx: 24, ry: 11 },
    { cx: 118, cy: 60, rx: 14, ry: 30 }, { cx: 70, cy: 6, rx: 30, ry: 10 }, { cx: 6, cy: 30, rx: 14, ry: 22 });
  o.plazas.push({ cx: 60, cy: 62, rx: 24, ry: 22, surface: 'deck' }, { cx: 40, cy: 40, rx: 10, ry: 8, surface: 'deck' });
  o.roads.push({ w: 9, surface: 'deck', pts: [[160, GY], [84, GY], [76, 76]] });   // the boardwalk in, from the canal road: a street's width (5 was a plank with a party on it: the owner, 2026-10-04)
  for (const pts of [[[50, 62], [32, 72], [24, 72]], [[60, 44], [76, 24], [86, 22]], [[78, 66], [100, 68]], [[48, 80], [40, 98]], [[84, 82], [94, 94]], [[64, 86], [62, 100]]])
    o.roads.push({ w: 3, surface: 'deck', pts });                                                                            // boardwalks to the houses
  finalizeGround(o);
  const svc = [['temple', B('temple'), [34, 24]], ['tavern', B('stilttavern'), [29, 48]]];
  for (const [kind, id, [x, y]] of svc) { put(o, id, x, y); o.services.push({ kind, id, x, y, name: info[kind === 'tavern' ? 'tavern' : 'temple'] }); o.labels.push({ x, y, id, text: info[kind], service: kind }); }
  put(o, B('cistern'), M[0], M[1]);
  for (const [x, y] of [[41, 57], [60, 50], [80, 64], [61, 80]]) putProp(o, 'brazier', x, y);
  o.hub = { x: 58, y: 58, r: 32, focus: { x: 60, y: 60 } };
  o.lead = { x0: 100, y0: GY - 10, x1: 146, y1: GY + 10, x: 100, y: GY, k: 0.5 };
  for (const [n, x, y] of [[1, 26, 76], [2, 88, 22], [3, 102, 68], [1, 40, 102], [2, 96, 96], [3, 62, 104], [1, 78, 18], [2, 110, 40]]) put(o, B('stilt', n), x, y);
  for (const [id, x, y] of [[B('punt'), 106, 92], [B('punt'), 30, 92], [B('punt'), 122, 68], [B('eeltrap'), 116, 92], [B('eeltrap'), 14, 64], [B('eeltrap'), 84, 112]]) put(o, id, x, y, 'rect', 0);
  for (const [id, x, y] of [['barrel', 84, 60], ['barrel', 85, 62], ['crate_A_big', 57, 75], ['sack', 58, 77]]) put(o, id, x, y, 'rect', 0);
  scatter(o, rng, -40, -40, 170, 156, 8, (x, y) => {
    if (hypot(x - 60, y - 60) < 44) return null;
    return rng() < 0.4 ? pick(rng, ['dead_1', 'dead_2', 'willow_1', 'carr_2']) : null;   // (the Fens' kinds: fens critic pass 2)
  });
  forestRing(o, rng, 10, FENS_CLUSTER, FENS_SINGLE);
  // reed beds and sedge on the peat between the houses and round the meres' edges; never the square
  undergrowth(o, -10, -10, 140, 126, 3, (x, y) => {
    if (hypot(x - o.hub.x, y - o.hub.y) < o.hub.r + 4) return -1;
    return fbm(x * 0.09, y * 0.09, o.seed + 47) > 0.55 ? 0.5 : 0.15;
  });
  o.exits.push({ x0: 136, y0: GY - 8, x1: 146, y1: GY + 8, to: 'overland', arrive: 'saltmere' });   // the boardwalk's end (the ring's hard edge is at 146)
  o.arrivals = { default: { x: M[0] + 0.5, y: M[1] + 6.5 }, overland: { x: 128.5, y: GY + 0.5 }, temple: { x: 40.5, y: 42.5 } };
  o.spawn = o.arrivals.default;
  return o;
}

// ── smooth lines (critic pass 10) ────────────────────────────────────────────
// Roads were straight polylines with hard elbows (up to 77°) and the river ran ruler-straight between kinks.
// fillet: each corner becomes a quadratic arc from d back along the incoming segment to d on along the outgoing,
// d = min(R·tan(θ/2), 0.45 × either segment). chaikin: corner cutting, for the river's spline.
function fillet(pts, R) {
  const out = [pts[0]];
  for (let i = 1; i + 1 < pts.length; i++) {
    const [ax, ay] = pts[i - 1], [bx, by] = pts[i], [cx, cy] = pts[i + 1], l1 = hypot(bx - ax, by - ay), l2 = hypot(cx - bx, cy - by);
    const ux = (bx - ax) / l1, uy = (by - ay) / l1, vx = (cx - bx) / l2, vy = (cy - by) / l2, c = ux * vx + uy * vy;
    if (c > 0.9986) { out.push(pts[i]); continue; }                       // (under 3°: leave it)
    const d = Math.min(R * Math.sqrt((1 - c) / (1 + c)), 0.45 * l1, 0.45 * l2), p0 = [bx - ux * d, by - uy * d], p2 = [bx + vx * d, by + vy * d];
    for (let k = 0; k <= 6; k++) { const t = k / 6, a = (1 - t) * (1 - t), b = 2 * t * (1 - t), e = t * t; out.push([a * p0[0] + b * bx + e * p2[0], a * p0[1] + b * by + e * p2[1]]); }
  }
  out.push(pts[pts.length - 1]);
  return out;
}
function chaikin(pts, n) {
  let p = pts;
  for (let k = 0; k < n; k++) {
    const q = [p[0]];
    for (let i = 0; i + 1 < p.length; i++) { const [ax, ay] = p[i], [bx, by] = p[i + 1]; q.push([0.75 * ax + 0.25 * bx, 0.75 * ay + 0.25 * by], [0.25 * ax + 0.75 * bx, 0.25 * ay + 0.75 * by]); }
    q.push(p[p.length - 1]); p = q;
  }
  return p;
}
// the nearest point on a polyline to (x, y): [x, y, distance]
function nearestOn(pts, x, y) {
  let best = [pts[0][0], pts[0][1], Infinity];
  for (let i = 0; i + 1 < pts.length; i++) { const s = { x1: pts[i][0], y1: pts[i][1], x2: pts[i + 1][0], y2: pts[i + 1][1] }, q = segDist(x, y, s);
    if (q.d < best[2]) best = [s.x1 + (s.x2 - s.x1) * q.t, s.y1 + (s.y2 - s.y1) * q.t, q.d]; }
  return best;
}
// The river's course: resampled every 3 tiles, pushed sideways by a slow meander (a 52-tile wavelength, ±4) and
// given a width that breathes (6.5–12.5), both eased to nothing near the pins (the bridges, the mill), where it
// runs as it always did. Its own stream for the phases. Points carry their width: [x, y, w].
function meander(seed, pts, pins) {
  const rng = mulberry32(streamSeed(seed, 4415)), ph1 = rng() * 6.2832, ph2 = rng() * 6.2832, res = [];
  let acc = 0;
  for (let i = 0; i + 1 < pts.length; i++) { const [ax, ay] = pts[i], [bx, by] = pts[i + 1], L = hypot(bx - ax, by - ay); for (let t = 0; t < L; t += 3) res.push([ax + (bx - ax) * t / L, ay + (by - ay) * t / L, acc + t]); acc += L; }
  res.push([pts[pts.length - 1][0], pts[pts.length - 1][1], acc]);
  return res.map(([x, y, s], i) => {
    const a = res[Math.max(0, i - 1)], b = res[Math.min(res.length - 1, i + 1)], tx = b[0] - a[0], ty = b[1] - a[1], tl = hypot(tx, ty) || 1;
    let pin = Infinity; for (const [px, py] of pins) pin = Math.min(pin, hypot(x - px, y - py));
    const k = Math.max(0, Math.min(1, (pin - 12) / 24)), m = 4 * k * sin(s * 6.2832 / 52 + ph1), w = 9 + k * 3 * sin(s * 6.2832 / 74 + ph2);
    return [x - ty / tl * m, y + tx / tl * m, w];
  });
}

// ── THE HOLLOW VALE — the overland around Thornwick ──────────────────────────
function buildOverland(seed) {
  const o = makeWorld(seed, 'overland', 260, 260, 90), rng = mulberry32(streamSeed(seed, 4402)), B = (t, n = 1) => `vale_${t}_${n}`;
  o.name = 'The Hollow Vale';
  const town = [52, 150], cross = [150, 132], keep = [168, 44], barrows = [66, 228], mine = [226, 70], camp = [196, 214];
  // the Tithe Mill, the Sunken Chapel, the ninth milestone (M5). By difficulty (the owner, 2026-10-03): the easy sites near
  // Thornwick's gate, the hard ones far out. From the gate: the mill (1–3) 57 tiles, the barrows (1–4) 79, the keep (3–6)
  // 154, the chapel (5–8) 183 in the marsh where the river leaves the Vale, the milestone (8) 211 on the old road north-east.
  // The Scrag Warren (2–5, v1.19): the goblins' burrow at the foot of the north range, 142 tiles out, between the barrows
  // and the keep; its door faces the Vale, a track up to it off the keep road.
  const mill = [92, 106], chapel = [226, 218], stone = [236, 40], warren = [108, 18];
  // The river (critic pass 10): the old course as a spline (its lower reach swings east to the chapel's marsh, 2026-10-03), with a slow meander and a breathing width (meander), held
  // where it was at the bridges and the mill. Bridges are axis-aligned (bridge_90 spans x), so every road crosses its
  // bridge on a straight run along x, and the river runs across it (~+y) there.
  o.rivers.push({ w: 9, pts: meander(seed, chaikin([[20, -90], [40, 0], [80, 50], [104, 96], [120, 140], [112, 186], [118, 212], [150, 240], [200, 252], [250, 252], [300, 290], [340, 350]], 3), [[120, 142], [115, 199], [106, 102]]) });
  // the Tithe Mill's race: a narrow channel off the river, under the wheel on the mill's +x side, and back (pass 10:
  // the wheel turned 10 tiles from water)
  o.rivers.push({ w: 2.6, pts: chaikin([[102, 88], [99.5, 95], [98.8, 101], [98.8, 110], [100.5, 116], [106, 120], [112, 121]], 2) });
  // (Thornwick's brook, a branch of the river across the road 13.5 tiles from the gate with a bridge over it, is gone:
  // the owner, 2026-10-04, took it off the approach, here and outside the town scene's gate)
  // The roads, filleted (no elbows), the spurs to the mill, the chapel and the camp narrow tracks without ruts.
  const ROADS = [
    { w: 6, surface: 'dirt', pts: [town, [86, 148], [104, 142], [136, 142], cross] },
    { w: 5, surface: 'dirt', pts: [cross, [158, 100], [164, 70], [keep[0], keep[1] + 7.5]] },   // up to the keep's door (its curtain wall removed, 2026-10-03)
    { w: 5, surface: 'dirt', pts: [cross, [132, 170], [132, 186], [129, 199], [100, 199], [88, 212], [barrows[0] + 8, barrows[1] - 4]] },
    { w: 5, surface: 'dirt', pts: [cross, [190, 140], [230, 150], [350, 156]] },
    { w: 4, surface: 'dirt', pts: [[190, 140], [206, 108], [mine[0] - 6, mine[1] + 12]] },
    { w: 4, surface: 'dirt', pts: [[206, 108], [238, 92], [244, 66], [stone[0] + 0.5, stone[1] + 7.5]] },   // the old road on north-east to the ninth milestone
    { w: 3, surface: 'track', pts: [[132, 176], [168, 196], [camp[0] - 8, camp[1] - 6]] },
    { w: 3, surface: 'track', pts: [[86, 148], [88, 132], [mill[0] - 1, mill[1] + 12]] },                // up to the mill
    { w: 3, surface: 'track', pts: [[168, 196], [184, 226], [206, 234], [chapel[0] + 1, chapel[1] + 14]] },   // the causeway to the chapel, off the camp track
    { w: 4, surface: 'track', pts: [[161, 84], [142, 66], [122, 44], [warren[0] + 2.5, warren[1] + 7]] },      // up under the range to the warren's door (its adit faces down the track)
    { w: 5, surface: 'dirt', fens: true, pts: [[92, 206], [80, 236], [54, 250], [38, 264], [38, 274]] },   // the canal road south off the barrows road, to the Fens (M8; shut until Act I is done)
  ].map((r) => ({ ...r, pts: fillet(r.pts, Math.max(8, r.w * 2)) }));
  // a road that leaves another starts on it as smoothed (the corner it left from was cut), with an apron at the join
  for (const r of ROADS) for (const end of [0, r.pts.length - 1]) {
    const [x, y] = r.pts[end];
    let best = null; for (const h of ROADS) if (h !== r) { const n = nearestOn(h.pts, x, y); if (n[2] < 6 && (!best || n[2] < best[0][2])) best = [n, h]; }
    if (!best) continue;
    r.pts[end] = [best[0][0], best[0][1]];
    if (!o.aprons.some((a) => hypot(a.x - best[0][0], a.y - best[0][1]) < 3)) o.aprons.push({ x: best[0][0], y: best[0][1], r: Math.max(r.w, best[1].w) / 2 + 1.5 });
  }
  o.roads.push(...ROADS);
  // the farms' fields (lost in pass 10's road rewrite, restored in 11d)
  o.fields.push({ x0: 22, y0: 104, x1: 50, y1: 124, axis: 'x' }, { x0: 54, y0: 100, x1: 70, y1: 126, axis: 'y' }, { x0: 26, y0: 174, x1: 46, y1: 196, axis: 'y' });
  finalizeGround(o);

  // bridges where roads cross the river
  put(o, 'bridge_90', 120, 142, 'deck');
  put(o, 'bridge_90', 115, 199, 'deck');
  // Thornwick from outside: the town scene's circuit in small (its timber palisade and watchtowers), the gate on
  // its road, the temple's spire and a few roofs inside
  { const X0 = 18, X1 = town[0] + 4, Y0 = 128, Y1 = 172, GY = town[1];
    for (const [id, x, y] of [[B('temple'), 32, 140], [B('house', 1), 44, 138], [B('housex', 1), 28, 156], [B('house', 2), 44, 162], [B('house', 3), 30, 166], [B('farm'), 44, 110]]) put(o, id, x, y);
    putWall(o, B('curtain'), true, Y0, X0, X1); putWall(o, B('curtain'), true, Y1, X0, X1); putWall(o, B('curtainy'), false, X0, Y0, Y1);
    putWall(o, B('curtainy'), false, X1, Y0, GY - 7); putWall(o, B('curtainy'), false, X1, GY + 7, Y1);
    for (const [x, y] of [[X0, Y0], [X1, Y0], [X0, Y1], [X1, Y1], [(X0 + X1) / 2, Y0], [(X0 + X1) / 2, Y1], [X0, GY]]) put(o, B('tower'), x, y, 'round', 0.1);
    putGate(o, B('gatehousey'), X1, GY); }
  // Wickham Keep, the watchtower at the crossroads, the Old Barrows, the mine, the lumber camp, a farm
  put(o, B('keep'), keep[0], keep[1]);
  put(o, B('shop', 1), cross[0] + 12, cross[1] - 12);          // waystation at the crossroads
  put(o, 'ruin', barrows[0], barrows[1], 'round', 0.3);          // the mound blocks; its doorway (front, +y) stays open
  for (const [id, x, y] of [['rock_C', barrows[0] - 8, barrows[1] + 4], ['rock_E', barrows[0] + 24, barrows[1] + 8], ['rock_A', barrows[0] - 4, barrows[1] - 9], ['stump', barrows[0] - 14, barrows[1] - 4]]) put(o, id, x, y, 'rect', 0);
  put(o, 'mine_0', mine[0], mine[1]);
  put(o, 'lumbermill_90', camp[0], camp[1]);
  put(o, 'watermill_0', mill[0], mill[1]);
  put(o, 'chapelruin_0', chapel[0], chapel[1]);
  put(o, 'milestone_0', stone[0], stone[1], 'rect', 0.2);
  put(o, 'warren_0', warren[0], warren[1]);
  for (const [id, dx, dy] of [['grove_3', -20, -2], ['grove_5', 14, -20], ['pine_2', -12, -12], ['pine_5', 16, -6]]) put(o, id, warren[0] + dx, warren[1] + dy, 'round', 0.35);   // the range's foot is wooded either side of the scar
  put(o, B('farm'), 64, 114); put(o, 'wheelbarrow', 57, 128, 'rect', 0);
  for (const [id, x, y] of [['resource_lumber', camp[0] + 10, camp[1] + 4], ['stump', camp[0] - 16, camp[1] + 14], ['stump', camp[0] + 4, camp[1] + 14], ['flag_red', keep[0] - 14, keep[1] + 30]])
    put(o, id, x, y, 'rect', 0);
  putProp(o, 'stairs', barrows[0] + 1, barrows[1] + 7);           // just outside the barrow's door
  for (const [x, y] of [[barrows[0] + 10, barrows[1] - 2], [cross[0] + 4, cross[1] + 4], [town[0] + 9, town[1] - 5], [town[0] + 9, town[1] + 5]]) putProp(o, 'brazier', x, y);
  o.labels.push({ x: town[0] + 4, y: town[1], id: B('gatehousey'), text: 'Thornwick' }, { x: keep[0], y: keep[1], id: B('keep'), text: 'Wickham Keep', site: 'wickham_keep' }, { x: barrows[0], y: barrows[1], id: 'ruin', text: 'The Old Barrows', site: 'barrows' },
    { x: mill[0], y: mill[1], id: 'watermill_0', text: 'The Tithe Mill', site: 'tithe_mill' }, { x: chapel[0], y: chapel[1], id: 'chapelruin_0', text: 'The Sunken Chapel', site: 'sunken_chapel' },
    { x: stone[0], y: stone[1], id: 'milestone_0', text: 'The Ninth Milestone', site: 'ninth_milestone' }, { x: warren[0], y: warren[1], id: 'warren_0', text: 'The Scrag Warren', site: 'scrag_warren' },
    { x: mine[0], y: mine[1], id: 'mine_0', text: 'Deepdelve Mine' }, { x: camp[0], y: camp[1], id: 'lumbermill_90', text: 'Lumber camp' });

  // THE RANGES (critic pass 10: mountains smaller than the keep, on a 15-tile lattice, 11 of them on the meadow).
  // North, past the map's edge: massifs on a spine, the great peaks (twice the keep's height) among smaller ones,
  // overlapping into one range. East, between the camera and the Vale, lower mountains further out. Between them
  // and the meadow a foothill belt: scree, the barrows' grey rocks, pines and dead trees. Nothing of a mountain on
  // the walked map. Their own stream: the sites and the town don't move.
  const mrng = mulberry32(streamSeed(seed, 4411)), F = (id) => ENV_FOOT[id] || [-10, -10, 10, 10];
  const MASSIF = ['mountain_massif_A', 'mountain_massif_B', 'mountain_massif_C'], SHOULDER = ['mountain_A', 'mountain_B', 'mountain_A_grass_trees', 'mountain_B_grass_trees', 'mountain_C_grass_trees'];
  const GORGE = [14, 52];                                              // where the river comes down out of the range
  for (let x = -90, i = 0; x < 360; i++) {
    const id = MASSIF[[2, 1, 0, 2, 1, 0, 1, 2][i % 8]], f = F(id);
    if (x < GORGE[1] && x + f[2] - f[0] > GORGE[0]) { x = GORGE[1]; continue; }
    put(o, id, x - f[0], -12 - f[3] - mrng() * 14, 'round', 0.3);
    x += (f[2] - f[0]) * (0.55 + mrng() * 0.2);
  }
  for (let x = -60; x < 330; x += 20 + mrng() * 14) { const id = pick(mrng, SHOULDER), f = F(id); if (x + f[2] > GORGE[0] && x + f[0] < GORGE[1]) continue; put(o, id, x, -6 - f[3] - mrng() * 6, 'round', 0.35); }   // shoulders before the range
  for (let y = -40; y < 320; y += 20 + mrng() * 10) { const id = pick(mrng, SHOULDER), f = F(id); put(o, id, 268 - f[0] + mrng() * 16, y, 'round', 0.35); }   // the east: lower, further out
  const FOOT_ROCK = ['rock_A', 'rock_B', 'rock_C', 'rock_D', 'rock_E'];
  scatter(o, mrng, -60, -30, 330, 320, 5, (x, y) => {                // the foothills: thick at the range, thinning to the meadow
    const d = Math.min(Math.max(0, y + 12), Math.max(0, 270 - x)), belt = 1 - d / 18;
    if (belt <= 0 || mrng() > belt * 0.7) return null;
    const k = mrng();
    return k < 0.35 ? pick(mrng, FOOT_ROCK) : k < 0.75 ? pick(mrng, ['pine_1', 'pine_2', 'pine_3', 'pine_4', 'pine_5', 'pine_6']) : k < 0.9 ? pick(mrng, TREE_CLUSTER) : pick(mrng, ['dead_1', 'dead_2']);
  });

  // WOODS AND CLUMPS (pass 10: 42 trees on the walked map, 13 % of it within 8 tiles of a tree, a lumber camp in
  // the open). Woods where a wood belongs: the north-west, the slopes under the range, round the lumber camp, the
  // barrows' far side; then the old forest mask; then meadow trees in clumps of 2–4. Every site keeps its clearing
  // and its sightline (inFrontOf). Rocks mostly at the foothills now: 1 % on the meadow, not 5 %.
  const trng = mulberry32(streamSeed(seed, 4412)), sites = [keep, barrows, mine, camp, [60, 112], mill, chapel, stone, warren];
  const sights = [keep, barrows, mine, camp, cross, [town[0] + 4, town[1]], mill, chapel, stone];   // (the warren, dug into the range's foot, keeps a shorter one)
  const clear = (x, y, id) => {
    if (hypot(x - town[0] + 16, y - town[1]) < 40 || hypot(x - cross[0], y - cross[1]) < 18) return false;
    for (const c of sites) if (hypot(x - c[0], y - c[1]) < (c === camp || c === warren ? 16 : 24)) return false;
    return !inFrontOf(sights, x, y, /grove/.test(id) ? 80 : /rock/.test(id) ? 30 : 62, 32) && !inFrontOf([warren], x, y, 40, 26);   // (the adit's spoil and its wreckage reach wider than the old hole did)
  };
  const WOODS = [{ x: 30, y: 48, r: 30 }, { x: 74, y: 16, r: 24 }, { x: 212, y: 24, r: 22 }, { x: 236, y: 182, r: 26 }, { x: 24, y: 240, r: 22 }, { x: 240, y: 104, r: 16 }];
  // a wood's crowns close over each other (groves overlap there, as the range's massifs do); its edge thins to singles
  for (let y = -80; y < 350; y += 6) for (let x = -80; x < 350; x += 6) {
    const jx = x + (trng() - 0.5) * 5.4, jy = y + (trng() - 0.5) * 5.4;
    let wood = 0; for (const w of WOODS) wood = Math.max(wood, 1 - hypot(jx - w.x, jy - w.y) / w.r);
    const f = fbm(jx * 0.022, jy * 0.022, o.seed + 7), core = wood > 0.4 || f > 0.6;
    const id = core ? (trng() < 0.7 ? pick(trng, TREE_CLUSTER) : pick(trng, TREE_SINGLE)) : (wood > 0 || f > 0.52) && trng() < 0.45 ? pick(trng, TREE_SINGLE) : null;
    if (!id) continue;
    // crowns may close over each other, never over a road: one that would steps 4 tiles aside (fixed steps, no draws)
    for (const [dx, dy] of [[0, 0], [4, 0], [-4, 0], [0, 4], [0, -4]]) {
      const tx = jx + dx, ty = jy + dy;
      if (clear(tx, ty, id) && fits(o, id, tx, ty, core && /grove/.test(id) ? -5 : 0.6) && offRoad(o, id, tx, ty)) { put(o, id, tx, ty, 'round', 0.35); break; }
      if (offRoad(o, id, tx, ty)) break;                                  // it failed for something else: no step
    }
  }
  for (let y = 4; y < 256; y += 16) for (let x = 4; x < 256; x += 16) {     // meadow clumps
    if (trng() > 0.32) continue;
    const cx = x + trng() * 12, cy = y + trng() * 12;
    for (let k = 0, n = 2 + Math.floor(trng() * 3); k < n; k++) {
      const id = pick(trng, TREE_SINGLE), tx = cx + (trng() - 0.5) * 9, ty = cy + (trng() - 0.5) * 9;
      if (clear(tx, ty, id) && fits(o, id, tx, ty, 0.6)) put(o, id, tx, ty, 'round', 0.35);
    }
  }
  // the canal road's verges: oaks either side every 6 tiles, crowns closing over the wood's edge where it meets the
  // road. No draws, so nothing else moves; they give back the cover the road took out of the south-west wood.
  { const pts = ROADS.find((r) => r.fens).pts;
    for (let i = 0, run = 0, next = 3.5; i + 1 < pts.length; i++) {
      const [ax, ay] = pts[i], [bx, by] = pts[i + 1], l = hypot(bx - ax, by - ay), nx = -(by - ay) / l, ny = (bx - ax) / l;
      for (; next < run + l; next += 6) for (const s of [-11, 11]) {
        const t = next - run, id = Math.floor(next / 6) % 3 ? 'oak_1' : 'autumn_2', x = ax + (bx - ax) * t / l + nx * s, y = ay + (by - ay) * t / l + ny * s;
        if (y < 258 && clear(x, y, id) && fits(o, id, x, y, -3) && offRoad(o, id, x, y)) put(o, id, x, y, 'round', 0.35);
      }
      run += l;
    } }
  scatter(o, trng, 0, 0, 260, 260, 10, (x, y) => (trng() < 0.01 && clear(x, y, 'rock_F') ? pick(trng, ROCKS) : null));
  forestRing(o, rng, 6);
  bound(o, (k) => (k % 2 ? 'fence' : 'drywall'));                  // the fields' walls first: the beasts graze round them
  { const fr = mulberry32(streamSeed(seed, 4417));                // the farms' beasts, hay at the mill and the camp
    herd(o, fr, ['cow_1', 'cow_2', 'cow_3'], 100, 128, 4, 6); herd(o, fr, ['sheep_1', 'sheep_2'], 34, 92, 6, 8); herd(o, fr, ['sheep_1', 'sheep_2'], 186, 168, 4, 6);
    herd(o, fr, ['hens_1'], 58, 132, 2, 3); herd(o, fr, ['hay_1', 'hay_2', 'pumpkins_1'], 50, 100, 3, 4); herd(o, fr, ['hay_2', 'sack', 'barrel'], 86, 114, 3, 3);
    herd(o, fr, ['pumpkins_1', 'hay_1'], 36, 130, 2, 3); }
  wheat(o);
  // the undergrowth: thick at the woods' and forests' edges and along the river's banks, in patches in the meadows;
  // clear of every site and its way in
  const nearWater = (x, y) => { for (const [dx, dy] of [[0, 0], [2.5, 0], [-2.5, 0], [0, 2.5], [0, -2.5]]) { const g = groundAt(o, x + dx, y + dy).g; if (g === G.WATER || g === G.BANK) return true; } return false; };
  undergrowth(o, -40, -40, 300, 300, 4, (x, y) => {
    for (const c of [keep, barrows, mine, camp, cross, [town[0] + 4, town[1]], mill, chapel, stone, warren]) if (hypot(x - c[0], y - c[1]) < 14) return -1;
    let wood = 0; for (const w of WOODS) wood = Math.max(wood, 1 - hypot(x - w.x, y - w.y) / w.r);
    const f = fbm(x * 0.022, y * 0.022, o.seed + 7);
    return nearWater(x, y) ? 0.55 : (f > 0.5 && f < 0.6) || (wood > 0 && wood < 0.35) ? 0.4 : fbm(x * 0.08, y * 0.08, o.seed + 13) > 0.68 ? 0.45 : 0;
  });

  o.exits.push({ x0: town[0] - 6, y0: town[1] - 4, x1: town[0] + 1, y1: town[1] + 4, to: 'town', arrive: 'overland' });
  // walk into the barrow's doorway (around the glowing stairs) to go down into the dungeon
  o.exits.push({ x0: barrows[0] - 2, y0: barrows[1] + 6, x1: barrows[0] + 4, y1: barrows[1] + 9, to: 'dungeon', site: 'barrows' });
  // the other sites' ways in (M5, sites.js): the mill's door, the keep's door, the chapel's door
  // across the pools, a slab at the milestone's foot. A hidden site's stays shut until it's revealed (core.js).
  o.exits.push({ x0: mill[0] - 4, y0: mill[1] + 7, x1: mill[0] + 2, y1: mill[1] + 10, to: 'dungeon', site: 'tithe_mill' });
  o.exits.push({ x0: keep[0] - 3, y0: keep[1] + 6.5, x1: keep[0] + 3, y1: keep[1] + 9.5, to: 'dungeon', site: 'wickham_keep' });   // the keep's own door (the owner removed its curtain wall)
  o.exits.push({ x0: chapel[0] - 2, y0: chapel[1] + 11, x1: chapel[0] + 4, y1: chapel[1] + 14, to: 'dungeon', site: 'sunken_chapel' });
  o.exits.push({ x0: stone[0] - 2, y0: stone[1] + 4, x1: stone[0] + 3, y1: stone[1] + 7, to: 'dungeon', site: 'ninth_milestone' });
  o.exits.push({ x0: warren[0] - 1, y0: warren[1] + 4.5, x1: warren[0] + 5.5, y1: warren[1] + 8, to: 'dungeon', site: 'scrag_warren' });   // the old adit's mouth
  o.arrivals = { default: { x: town[0] + 30.5, y: town[1] + 0.5 }, thornwick: { x: town[0] + 30.5, y: town[1] + 0.5 }, barrows: { x: barrows[0] + 1.5, y: barrows[1] + 13.5 },
    tithe_mill: { x: mill[0] - 0.5, y: mill[1] + 15.5 }, wickham_keep: { x: keep[0] + 0.5, y: keep[1] + 27.5 }, sunken_chapel: { x: chapel[0] + 1.5, y: chapel[1] + 19.5 }, ninth_milestone: { x: stone[0] + 0.5, y: stone[1] + 11.5 },
    scrag_warren: { x: warren[0] + 4, y: warren[1] + 13.5 }, fens: { x: 38.5, y: 255.5 } };
  // the canal road leaves the Vale at its south edge, for the Fens (regions.js); shut, with a word, until Act I is done
  o.exits.push({ x0: 30, y0: 263, x1: 47, y1: 271, to: 'overland', region: 'fens', arrive: 'vale_road',
    shut: "The canal road's under water past the barrows. Sister Ilse says there's a way through, when you've a reason to go." });
  o.spawn = o.arrivals.default;
  return o;
}

// The Stage (docs/character-stage-proposal.md; src/dev/stage.js): a dev-only preview scene, a flat field
// with nothing on it, where figures are lined up and drawn through the real renderer for captures. Grass
// by default; `cobble` lays one wide cobbled square under it. No structures, people, foes or ways out.
export const STAGE_W = 160;
function buildStage(seed, floor) {
  const o = makeWorld(seed, 'stage', STAGE_W, STAGE_W, 8), c = STAGE_W / 2;
  o.name = 'The Stage';
  if (floor === 'cobble') o.plazas.push({ cx: c, cy: c, rx: c - 6, ry: c - 6 });
  finalizeGround(o);
  o.arrivals = { default: { x: c + 0.5, y: c + 0.5 } }; o.spawn = o.arrivals.default;
  return o;
}

// region picks the land (regions.js): the Vale's overland and Thornwick, or the Fens' and Saltmere; reach · heights
// still preview their walled hubs;
// 'stage' takes its floor in `region`'s place (grass · cobble)
export function createOutdoor(seed, kind, region = 'vale') {
  if (kind === 'stage') return buildStage(seed, region);
  if (region === 'fens') return kind === 'town' ? buildWaystation(seed, 'fens') : buildFens(seed);   // (M8: Saltmere, the Fens)
  return kind === 'town' ? buildTown(seed, region) : buildOverland(seed);
}

// ── world API (dispatched from world.js) ─────────────────────────────────────
export const oHeightAt = () => FLOOR_Z;
/** place a baked structure after the layout (road.js: the stopped wagon) @param {any} o @param {string} id @param {number} x @param {number} y @param {string} [shape] @param {number} [shrink] */
export function oPut(o, id, x, y, shape = 'rect', shrink = 0.12) { put(o, id, x, y, shape, shrink); }
/** make a tile solid (a person standing there: sim/npcs.js) @param {any} o @param {number} x @param {number} y */
export function oBlock(o, x, y) { const i = gi(o, x, y); if (i >= 0) o.blocked[i] = 1; }
export function oMaterialAt(o, x, y) { const i = gi(o, x, y); return i < 0 ? 'grass' : G_MAT[o.tmat[i]]; }
export function oIsWalkable(o, x, y) {
  const i = gi(o, x, y); if (i < 0 || o.blocked[i]) return false;
  const k = Math.floor(x) + ',' + Math.floor(y);
  return !(o.props.has(k) && !o.mods.get(k)?.opened);
}
export function oExitAt(o, x, y) { return o.exits.find((e) => x >= e.x0 && x < e.x1 && y >= e.y0 && y < e.y1) || null; }
export const G_NAMES = G_MAT;
