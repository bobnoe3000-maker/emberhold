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
export const G = { GRASS: 0, DIRT: 1, COBBLE: 2, WATER: 3, BANK: 4, FIELD: 5 };
const G_MAT = ['grass', 'dirt', 'cobble', 'water', 'bank', 'field'];
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
      const [x1, y1] = f.pts[i], [x2, y2] = f.pts[i + 1], len = hypot(x2 - x1, y2 - y1);
      o.segs.push({ x1, y1, x2, y2, len, s0: acc, w: f.w, type: f.type, surface: f.surface || 'dirt' });
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
const OUT = { g: 0, t: 0, lat: 0, along: 0, hw: 0, fx: 0 };
export function groundAt(o, gx, gy) {
  const out = OUT; out.g = G.GRASS; out.t = 1; out.lat = 0; out.along = 0; out.hw = 0; out.fx = 0; out.cap = false;
  const cell = o.grid.get(Math.floor(gx / CELL) + ',' + Math.floor(gy / CELL));
  let best = 0, bestRank = 0, roadD = Infinity;      // rank: water 4 > bank 3 > cobble 2 > dirt 1
  if (cell) {
    for (const i of cell) {
      const s = o.segs[i], q = segDist(gx, gy, s);
      if (s.type === 'river') {
        const wob = (fbm(gx * 0.18, gy * 0.18, o.seed + 11) - 0.5) * 2.2, hw = s.w / 2 + wob, d = q.d;
        if (d < hw && bestRank < 4) { bestRank = 4; out.g = G.WATER; out.t = d / hw; out.lat = Math.sign(q.side) * d; out.along = s.s0 + q.t * s.len; out.hw = hw; }
        else if (d < hw + 1.1 && bestRank < 3) { bestRank = 3; out.g = G.BANK; out.t = (d - hw) / 1.1; out.hw = hw; }
      } else {
        const rank = s.surface === 'cobble' ? 2 : 1;
        const wob = (fbm(gx * 0.3, gy * 0.3, o.seed + 23) - 0.5) * (rank === 2 ? 0.4 : 1.4), hw = s.w / 2 + wob;
        // the NEAREST road segment paints the pixel (not the first found); where that nearest point is a
        // segment end (bends, joins, road ends) the lateral offset is radial, so the painter drops the
        // wheel ruts there (cap) — they used to curl into rings at every bend
        if (q.d < hw && (bestRank < rank || (bestRank === rank && q.d < roadD))) {
          bestRank = rank; roadD = q.d; out.g = rank === 2 ? G.COBBLE : G.DIRT; out.t = q.d / hw; out.lat = Math.sign(q.side) * q.d; out.along = s.s0 + q.t * s.len; out.hw = hw;
          out.cap = (q.t <= 0.001 || q.t >= 0.999) && q.d > 0.6;
        }
      }
    }
  }
  if (bestRank >= 3) return out;
  for (const p of o.plazas) {                        // cobbled squares: soft superellipse
    const u = (gx - p.cx) / p.rx, v = (gy - p.cy) / p.ry, au = Math.abs(u), av = Math.abs(v), e = au * au * au + av * av * av;
    const wob = (fbm(gx * 0.3, gy * 0.3, o.seed + 29) - 0.5) * 0.25;
    if (e < 1 + wob && bestRank < 2) { bestRank = 2; out.g = G.COBBLE; out.t = e; out.lat = 0; out.hw = 0; }
  }
  if (bestRank) return out;
  for (const f of o.fields) {
    if (gx >= f.x0 && gx < f.x1 && gy >= f.y0 && gy < f.y1) {
      out.g = G.FIELD; out.fx = f.axis === 'x' ? gy - f.y0 : gx - f.x0;
      out.t = Math.min(gx - f.x0, f.x1 - gx, gy - f.y0, f.y1 - gy); return out;
    }
  }
  return out;
}

// ── world construction ───────────────────────────────────────────────────────
function makeWorld(seed, kind, W, H, PAD) {
  const GW = W + 2 * PAD, GH = H + 2 * PAD;
  return {
    kind, theme: kind, seed, depth: 0, W, H, PAD, GW, GH,
    rivers: [], roads: [], plazas: [], fields: [], structs: [], exits: [], arrivals: {}, labels: [], services: [], hub: null, region: 'vale',
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
    if (g === G.WATER) o.blocked[Y * o.GW + X] = 1;
    if (g !== G.GRASS && g !== G.FIELD) o.occ[Y * o.GW + X] = 2;      // keep roads, plazas and water clear of scatter
  }
}

// Footprint of a baked sprite placed with its origin at (x, y).
function footRect(id, x, y) { const f = ENV_FOOT[id]; return f ? [x + f[0], y + f[1], x + f[2], y + f[3]] : [x - 0.5, y - 0.5, x + 0.5, y + 0.5]; }

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

const TREE_SINGLE = ['pine_1', 'pine_2', 'pine_3', 'pine_4', 'pine_5', 'pine_6', 'oak_1', 'oak_2', 'oak_3', 'oak_4', 'autumn_1', 'autumn_2', 'autumn_3', 'dead_1', 'dead_2'];
const TREE_CLUSTER = ['grove_1', 'grove_2', 'grove_3', 'grove_4', 'grove_5', 'grove_6'];
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
    const mount = /mountain/.test(id), round = mount || /pine|oak|autumn|dead|grove/.test(id);
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
    if (!/pine|oak|autumn|grove/.test(t.id) || rng() < 0.35) continue;
    const f = ENV_FOOT[t.id], rad = f ? Math.max(f[2] - f[0], f[3] - f[1]) / 2 : 4;
    for (let k = 0, n = 1 + Math.floor(rng() * 3); k < n; k++) {
      const a = (rng() - 0.5) * 2.2 + Math.PI / 4, dist = rad * (0.7 + rng() * 0.5), x = t.x + cos(a) * dist, y = t.y + sin(a) * dist, id = pick(rng, FOOT);
      if (density(x, y) >= 0 && fits(o, id, x, y, 0.1)) put(o, id, x, y, 'none', 0.35);
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
function forestRing(o, rng, inset) {
  const lo = -o.PAD + 4, hiX = o.W + o.PAD - 4, hiY = o.H + o.PAD - 4;
  scatter(o, rng, lo, lo, hiX, hiY, 11, (x, y) => {
    const out = Math.max(-x - inset, x - (o.W + inset), -y - inset, y - (o.H + inset));
    if (out < 0) return null;
    return out > 8 || rng() < 0.75 ? pick(rng, TREE_CLUSTER) : pick(rng, TREE_SINGLE);
  });
  // hard edge: nothing walks past the ring
  for (let Y = 0; Y < o.GH; Y++) for (let X = 0; X < o.GW; X++) {
    const x = X - o.PAD, y = Y - o.PAD;
    if (x < -inset - 6 || y < -inset - 6 || x > o.W + inset + 6 || y > o.H + inset + 6) o.blocked[Y * o.GW + X] = 1;
  }
}

// ── TOWNS — one hub per region ───────────────────────────────────────────────
// Every region's town is the same hub (docs/town-layout-proposal.md): a walled circuit, the road over a stream
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
  o.rivers.push({ w: 6, pts: [[124, -90], [122, 20], [126, 60], [125, 100], [130, 210]] });
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
  put(o, 'bridge_90', 125.5, GY, 'deck');

  // houses: a row along the high street's north side, the quarters at the back (north and west), low gardens in front
  [[100, 68, 'house', 1], [76, 19, 'house', 2], [88, 19, 'house', 1], [100, 19, 'house', 3], [101, 31, 'housex', 2], [89, 33, 'housex', 1],
   [24, 70, 'housex', 2], [24, 82, 'house', 1], [40, 97, 'house', 3], [24, 96, 'housex', 1]]
    .forEach(([x, y, t, n]) => put(o, B(t, n), x, y));
  for (const [x, y] of [[97, 75], [107, 75], [87, 75]]) putProp(o, 'brazier', x, y);
  for (const [id, x, y] of [['wheelbarrow', 96, 90], ['resource_lumber', 88, 96], ['barrel', 106, 70], ['crate_A_big', 92, 84]]) put(o, id, x, y, 'rect', 0);
  for (const [id, x, y] of [['oak_2', 20, 18], ['oak_3', 46, 16], ['autumn_3', 19, 36]]) put(o, id, x, y, 'round', 0.35);   // the churchyard's trees, behind the temple
  // outside: farms on the fields, the stream under the east wall
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
  // the undergrowth: the walls' verges (in and out), the stream's banks, the gardens, flower patches; never the square
  undergrowth(o, -10, -10, 150, 130, 3, (x, y) => {
    if (hypot(x - o.hub.x, y - o.hub.y) < o.hub.r + 4) return -1;
    const wall = Math.min(Math.abs(x - WX0), Math.abs(x - WX1), Math.abs(y - WY0), Math.abs(y - WY1));
    const inBox = x > WX0 - 9 && x < WX1 + 9 && y > WY0 - 9 && y < WY1 + 9;
    return Math.max(inBox && wall < 5 ? 0.5 : 0, Math.abs(x - 125) < 9 ? 0.5 : 0, x > 84 && y > 84 && x < WX1 && y < WY1 ? 0.5 : 0,
      fbm(x * 0.09, y * 0.09, o.seed + 9) > 0.66 ? 0.45 : 0);
  });
  o.exits.push({ x0: 146, y0: 66, x1: 160, y1: 94, to: 'overland', arrive: 'thornwick' });
  o.arrivals = { default: { x: M[0] + 0.5, y: M[1] + 6.5 }, overland: { x: 141.5, y: GY + 0.5 }, temple: { x: 38.5, y: 42.5 } };
  o.spawn = o.arrivals.default;
  return o;
}

// ── THE HOLLOW VALE — the overland around Thornwick ──────────────────────────
function buildOverland(seed) {
  const o = makeWorld(seed, 'overland', 260, 260, 90), rng = mulberry32(streamSeed(seed, 4402)), B = (t, n = 1) => `vale_${t}_${n}`;
  o.name = 'The Hollow Vale';
  o.rivers.push({ w: 9, pts: [[20, -90], [40, 0], [80, 50], [104, 96], [120, 140], [112, 186], [122, 230], [150, 290], [170, 350]] });
  const town = [52, 150], cross = [150, 132], keep = [168, 44], barrows = [66, 228], mine = [226, 70], camp = [196, 214];
  const mill = [92, 106], chapel = [92, 174], stone = [168, 86];   // the Tithe Mill, the Sunken Chapel, the ninth milestone (M5)
  // Bridges are axis-aligned (bridge_90 spans x, bridge_0 spans y), so every road crosses
  // its bridge on a straight run along that axis, long enough to reach past both ramps, and
  // each crossing sits where the river runs across the bridge (here the river flows ~+y, so
  // both bridges span x). Critic pass (roads): the south bridge used to lie along the river
  // and the north road met its bridge at an angle.
  o.roads.push({ w: 6, surface: 'dirt', pts: [town, [86, 148], [104, 142], [136, 142], cross] });
  o.roads.push({ w: 5, surface: 'dirt', pts: [cross, [158, 100], [164, 70], [keep[0], keep[1] + 14]] });
  o.roads.push({ w: 5, surface: 'dirt', pts: [cross, [132, 170], [132, 186], [129, 199], [100, 199], [88, 212], [barrows[0] + 8, barrows[1] - 4]] });
  o.roads.push({ w: 4, surface: 'dirt', pts: [cross, [190, 140], [230, 150], [350, 156]] });
  o.roads.push({ w: 4, surface: 'dirt', pts: [[190, 140], [206, 108], [mine[0] - 6, mine[1] + 12]] });
  o.roads.push({ w: 4, surface: 'dirt', pts: [[132, 176], [168, 196], [camp[0] - 8, camp[1] - 6]] });
  o.roads.push({ w: 4, surface: 'dirt', pts: [[86, 148], [88, 132], [mill[0] - 1, mill[1] + 12]] });                // up to the mill
  o.roads.push({ w: 4, surface: 'dirt', pts: [[100, 199], [96, 192], [chapel[0] + 1, chapel[1] + 14]] });          // the causeway to the chapel
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
  put(o, B('wall'), keep[0], keep[1] + 16);
  put(o, B('shop', 1), cross[0] + 12, cross[1] - 12);          // waystation at the crossroads
  put(o, 'ruin', barrows[0], barrows[1], 'round', 0.3);          // the mound blocks; its doorway (front, +y) stays open
  for (const [id, x, y] of [['rock_C', barrows[0] - 8, barrows[1] + 4], ['rock_E', barrows[0] + 18, barrows[1] + 2], ['rock_A', barrows[0] - 4, barrows[1] - 9], ['stump', barrows[0] + 14, barrows[1] - 6]]) put(o, id, x, y, 'rect', 0);
  put(o, 'mine_0', mine[0], mine[1]);
  put(o, 'lumbermill_90', camp[0], camp[1]);
  put(o, 'watermill_0', mill[0], mill[1]);
  put(o, 'chapelruin_0', chapel[0], chapel[1]);
  put(o, 'milestone_0', stone[0], stone[1], 'rect', 0.2);
  put(o, B('farm'), 64, 114); put(o, 'wheelbarrow', 57, 128, 'rect', 0);
  for (const [id, x, y] of [['resource_lumber', camp[0] + 10, camp[1] + 4], ['stump', camp[0] - 12, camp[1] + 8], ['stump', camp[0] + 4, camp[1] + 14], ['flag_red', keep[0] - 14, keep[1] + 30]])
    put(o, id, x, y, 'rect', 0);
  putProp(o, 'stairs', barrows[0] + 1, barrows[1] + 7);           // just outside the barrow's door
  for (const [x, y] of [[barrows[0] + 10, barrows[1] - 2], [cross[0] + 4, cross[1] + 4], [town[0] + 9, town[1] - 5], [town[0] + 9, town[1] + 5]]) putProp(o, 'brazier', x, y);
  o.labels.push({ x: town[0] + 4, y: town[1], id: B('gatehousey'), text: 'Thornwick' }, { x: keep[0], y: keep[1], id: B('keep'), text: 'Wickham Keep', site: 'wickham_keep' }, { x: barrows[0], y: barrows[1], id: 'ruin', text: 'The Old Barrows', site: 'barrows' },
    { x: mill[0], y: mill[1], id: 'watermill_0', text: 'The Tithe Mill', site: 'tithe_mill' }, { x: chapel[0], y: chapel[1], id: 'chapelruin_0', text: 'The Sunken Chapel', site: 'sunken_chapel' },
    { x: stone[0], y: stone[1], id: 'milestone_0', text: 'The Ninth Milestone', site: 'ninth_milestone' },
    { x: mine[0], y: mine[1], id: 'mine_0', text: 'Deepdelve Mine' }, { x: camp[0], y: camp[1], id: 'lumbermill_90', text: 'Lumber camp' });

  // mountains along the north and east, forests where the forest mask is high, meadow trees and rocks
  const MOUNT = ['mountain_A_grass_trees', 'mountain_B_grass_trees', 'mountain_C_grass_trees', 'mountain_A', 'mountain_B'];
  scatter(o, rng, -60, -80, 350, 350, 15, (x, y) => {
    const north = -y + 6 + (fbm(x * 0.04, 0, o.seed + 5) - 0.5) * 30, east = x - 250 + (fbm(0, y * 0.04, o.seed + 6) - 0.5) * 30;
    return north > 0 || east > 0 ? pick(rng, MOUNT) : null;
  });
  scatter(o, rng, -80, -80, 350, 350, 10, (x, y) => {
    const f = fbm(x * 0.022, y * 0.022, o.seed + 7);
    if (hypot(x - town[0] + 16, y - town[1]) < 40 || hypot(x - cross[0], y - cross[1]) < 18) return null;
    for (const c of [keep, barrows, mine, camp, [60, 112], mill, chapel, stone]) if (hypot(x - c[0], y - c[1]) < 24) return null;
    // sightlines to every landmark: the clear wedge runs deeper for taller things (a grove's
    // crowns reach ~30 tiles up-screen, a lone tree ~15), so nothing in front rises over the site
    const sights = [keep, barrows, mine, camp, cross, [town[0] + 4, town[1]], mill, chapel, stone];
    const id = f > 0.58 ? (rng() < 0.8 ? pick(rng, TREE_CLUSTER) : pick(rng, TREE_SINGLE)) : f > 0.45 && rng() < 0.3 ? pick(rng, TREE_SINGLE) : rng() < 0.05 ? pick(rng, ROCKS) : null;
    if (!id) return null;
    const reach = /grove/.test(id) ? 80 : /rock/.test(id) ? 30 : 62;
    return inFrontOf(sights, x, y, reach, 32) ? null : id;
  });
  forestRing(o, rng, 6);
  // the undergrowth: thick at the forests' edges, in patches in the meadows; clear of every site and its way in
  undergrowth(o, -40, -40, 300, 300, 4, (x, y) => {
    for (const c of [keep, barrows, mine, camp, cross, [town[0] + 4, town[1]], mill, chapel, stone]) if (hypot(x - c[0], y - c[1]) < 14) return -1;
    const f = fbm(x * 0.022, y * 0.022, o.seed + 7);
    return f > 0.5 && f < 0.6 ? 0.4 : fbm(x * 0.08, y * 0.08, o.seed + 13) > 0.68 ? 0.45 : 0;
  });

  o.exits.push({ x0: town[0] - 6, y0: town[1] - 4, x1: town[0] + 1, y1: town[1] + 4, to: 'town', arrive: 'overland' });
  // walk into the barrow's doorway (around the glowing stairs) to go down into the dungeon
  o.exits.push({ x0: barrows[0] - 2, y0: barrows[1] + 6, x1: barrows[0] + 4, y1: barrows[1] + 9, to: 'dungeon', site: 'barrows' });
  // the other sites' ways in (M5, sites.js): the mill's door, the keep's gatehouse, the chapel's door
  // across the pools, a slab at the milestone's foot. A hidden site's stays shut until it's revealed (core.js).
  o.exits.push({ x0: mill[0] - 4, y0: mill[1] + 7, x1: mill[0] + 2, y1: mill[1] + 10, to: 'dungeon', site: 'tithe_mill' });
  o.exits.push({ x0: keep[0] - 3, y0: keep[1] + 19, x1: keep[0] + 3, y1: keep[1] + 22, to: 'dungeon', site: 'wickham_keep' });
  o.exits.push({ x0: chapel[0] - 2, y0: chapel[1] + 11, x1: chapel[0] + 4, y1: chapel[1] + 14, to: 'dungeon', site: 'sunken_chapel' });
  o.exits.push({ x0: stone[0] - 2, y0: stone[1] + 4, x1: stone[0] + 3, y1: stone[1] + 7, to: 'dungeon', site: 'ninth_milestone' });
  o.arrivals = { default: { x: town[0] + 14.5, y: town[1] + 0.5 }, thornwick: { x: town[0] + 14.5, y: town[1] + 0.5 }, barrows: { x: barrows[0] + 1.5, y: barrows[1] + 13.5 },
    tithe_mill: { x: mill[0] - 0.5, y: mill[1] + 15.5 }, wickham_keep: { x: keep[0] + 0.5, y: keep[1] + 27.5 }, sunken_chapel: { x: chapel[0] + 1.5, y: chapel[1] + 19.5 }, ninth_milestone: { x: stone[0] + 0.5, y: stone[1] + 11.5 } };
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

// region picks the town (one hub per region: vale · fens · reach · heights); the overland is the Hollow Vale's;
// 'stage' takes its floor in `region`'s place (grass · cobble)
export function createOutdoor(seed, kind, region = 'vale') { return kind === 'town' ? buildTown(seed, region) : kind === 'stage' ? buildStage(seed, region) : buildOverland(seed); }

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
