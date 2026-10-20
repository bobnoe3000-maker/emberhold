// @ts-check
// land.js — the Frontier's land (docs/frontier-proposal.md §1–4): what's on every tile of a 2520 × 5040-tile world,
// without ever holding the whole of it. One macro raster (a cell per wall-map unit: land or sea, the region, the
// woods, the marsh, the downs, the Mere) is filled once from geo.js's polygons; the lines (rivers, roads, ridges) are
// meandered once into tile coordinates and bucketed by chunk; everything finer is made a 64 × 64 chunk at a time,
// when something asks for it, from the seed and the chunk's own coordinates alone (hash2: no stream is drawn). So a
// chunk is the same whoever asks first, and in whatever order the land is walked: a replay or a server sees the land
// the player saw.
//
// A chunk holds:
//   ground  a code a tile (G below), passability and pace with it (WALK, PACE)
//   solid   a tile a trunk, a rock or a slag heap stands on (features block, as the game's structures do)
//   feats   the features to draw: trees, pines, the dead, rocks, peaks, reeds, ruins, beacon-towers ({ k, x, y, v })
//   camps   the camps whose home is in it (§4: placed on a jittered 24-tile grid, levelled from the level map)

import { hash2, vnoise } from '../rng.js';
import { hypot } from '../detmath.js';
import { FAMILIES } from '../battle.js';
import { K, W, H, MAP_W, MAP_H, REGIONS, TOWNS, SAFE, SITES, RIVERS, MERE, RANGES, CRATER, VOLCANO, AREAS, ROADS, FENS_LINE } from './geo.js';

export const CH = 64;                                    // a chunk's side, tiles
export const CW = Math.ceil(W / CH), CHN = Math.ceil(H / CH);
/** the grounds */
export const G = { SEA: 0, LAKE: 1, RIVER: 2, BRIDGE: 3, ROAD: 4, TRACK: 5, TOWN: 6, MEADOW: 7, FIELD: 8, FOREST: 9, HILLS: 10, ROCK: 11,
  MARSH: 12, POOL: 13, ASH: 14, TAILINGS: 15, SNOW: 16, CRATER: 17, SAND: 18, WALL: 19, PINES: 20 };
export const GROUND_NAMES = ['sea', 'lake', 'river', 'bridge', 'road', 'track', 'town', 'meadow', 'fields', 'forest', 'hills', 'mountain',
  'marsh', 'mere', 'ash', 'tailings', 'snow', 'the crater', 'shore', 'wall', 'pine wood'];
/** can a tile of this ground be walked */
export const WALK = GROUND_NAMES.map((_, g) => ![G.SEA, G.LAKE, G.RIVER, G.ROCK, G.POOL, G.TAILINGS, G.WALL].includes(g));
/** its pace (× the walking speed): the roads quicker, the marsh slow */
export const PACE = GROUND_NAMES.map((_, g) => (g === G.ROAD || g === G.TRACK || g === G.BRIDGE ? 1.25 : g === G.MARSH ? 0.7 : g === G.HILLS || g === G.SNOW ? 0.85 : g === G.FOREST || g === G.PINES ? 0.9 : 1));

// camps (§4): the grid, the chance a cell holds one by its ground, and the kinds of camp
export const CAMP_GRID = 20;
const DENSITY = { [G.FOREST]: 0.8, [G.PINES]: 0.75, [G.MARSH]: 0.7, [G.HILLS]: 0.7, [G.ASH]: 0.7, [G.SNOW]: 0.6, [G.MEADOW]: 0.55, [G.FIELD]: 0.25, [G.CRATER]: 0.8, [G.SAND]: 0.35 };
/** respawn (s) by camp kind, each foe from when it fell; an elite in a camp takes ELITE_S */
export const RESPAWN = { wanderer: 40, pack: 50, camp: 75, elite: 75, lair: 75 };
export const ELITE_S = 180, RARE_S = 480, WARDEN_S = 900;
export const ROAD_NEAR = 14, HOT_R = 30, WILD_R = 40;

const S_COAST = 0x0c0a, S_RIVER = 0x41e5, S_FEAT = 0xfea7, S_CAMP = 0xca3b, S_GROUND = 0x9e0d;

/** @param {number[][]} poly @param {number} x @param {number} y */
export function inside(poly, x, y) {
  let c = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) { const [xi, yi] = poly[i], [xj, yj] = poly[j]; if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c; }
  return c;
}
// a polygon filled into a raster a map unit a cell (scanline): fn(i) for every cell whose middle is inside
/** @param {number[][]} poly @param {(i: number) => void} fn */
function fill(poly, fn) {
  let y0 = Infinity, y1 = -Infinity; for (const p of poly) { y0 = Math.min(y0, p[1]); y1 = Math.max(y1, p[1]); }
  const xs = [];
  for (let v = Math.max(0, Math.floor(y0)); v <= Math.min(MAP_H - 1, Math.ceil(y1)); v++) {
    const y = v + 0.5; xs.length = 0;
    for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) { const [xi, yi] = poly[i], [xj, yj] = poly[j]; if ((yi > y) !== (yj > y)) xs.push(xi + ((y - yi) * (xj - xi)) / (yj - yi)); }
    xs.sort((a, b) => a - b);
    for (let k = 0; k + 1 < xs.length; k += 2) for (let u = Math.max(0, Math.ceil(xs[k] - 0.5)); u <= Math.min(MAP_W - 1, Math.floor(xs[k + 1] - 0.5)); u++) fn(v * MAP_W + u);
  }
}
// a line resampled every `step` tiles and pushed sideways by slow noise (amp tiles): a river's meander, a ridge's wander
/** @param {number[][]} pts map units @param {number} step @param {number} amp @param {number} s */
function wander(pts, step, amp, s) {
  const out = []; let along = 0;
  for (let i = 0; i + 1 < pts.length; i++) {
    const ax = pts[i][0] * K, ay = pts[i][1] * K, bx = pts[i + 1][0] * K, by = pts[i + 1][1] * K, L = hypot(bx - ax, by - ay), n = Math.max(1, Math.round(L / step));
    const nx = -(by - ay) / L, ny = (bx - ax) / L;
    for (let k = 0; k < n; k++) {
      const t = k / n, a = along + L * t, ends = Math.min(1, Math.min(i === 0 ? t * n : 99, 9) / 3);   // held at the first point (a river's source)
      const off = ((vnoise(a / 90, 0.5, s) - 0.5) * 2 * amp + (vnoise(a / 26, 7.5, s + 1) - 0.5) * amp * 0.45) * ends;
      out.push([ax + (bx - ax) * t + nx * off, ay + (by - ay) * t + ny * off]);
    }
    along += L;
  }
  const e = pts[pts.length - 1]; out.push([e[0] * K, e[1] * K]);
  return out;
}

/** @param {number} seed @param {number[][]} coast the wall map's coast (assets/maps/old-provinces.json) */
export function createLand(seed, coast) {
  seed >>>= 0;
  // ── the macro raster: 0 sea, else 1 + the region's index; and the areas as bits ──────────────────────────────────
  const region = new Uint8Array(MAP_W * MAP_H), area = new Uint8Array(MAP_W * MAP_H);
  const LAND = 255; fill(coast, (i) => { region[i] = LAND; });
  REGIONS.forEach((R, ri) => { if (R.poly) fill(R.poly, (i) => { if (region[i] === LAND) region[i] = ri + 1; }); });
  for (let i = 0; i < region.length; i++) if (region[i] === LAND) {          // a scrap no polygon took: the nearest region's
    const u = (i % MAP_W) + 0.5, v = Math.floor(i / MAP_W) + 0.5; let best = 0, bd = Infinity;
    REGIONS.forEach((R, ri) => { for (const p of R.pts) { const d = (p[0] - u) * (p[0] - u) + (p[1] - v) * (p[1] - v); if (d < bd) { bd = d; best = ri; } } });
    region[i] = best + 1;
  }
  const BIT = { forest: 1, pines: 2, marsh: 4, downs: 8, mere: 16 };
  for (const [k, polys] of Object.entries(AREAS)) for (const p of polys) fill(p, (i) => { area[i] |= /** @type {any} */ (BIT)[k]; });
  fill(MERE, (i) => { area[i] |= BIT.mere; });

  // ── the lines, in tiles, bucketed by chunk ─────────────────────────────────────────────────────────────────────────
  /** @type {Array<{ t: 'river' | 'road' | 'ridge', kind?: string, ax: number, ay: number, bx: number, by: number, hw: number, i: number }>} */
  const segs = [];
  const buckets = new Map();
  /** @param {number[][]} line tiles @param {any} base @param {number} reach */
  const addLine = (line, base, reach) => {
    for (let i = 0; i + 1 < line.length; i++) {
      const s = { ...base, ax: line[i][0], ay: line[i][1], bx: line[i + 1][0], by: line[i + 1][1], i: segs.length }; segs.push(s);
      const x0 = Math.floor((Math.min(s.ax, s.bx) - reach) / CH), x1 = Math.floor((Math.max(s.ax, s.bx) + reach) / CH);
      const y0 = Math.floor((Math.min(s.ay, s.by) - reach) / CH), y1 = Math.floor((Math.max(s.ay, s.by) + reach) / CH);
      for (let cy = y0; cy <= y1; cy++) for (let cx = x0; cx <= x1; cx++) { const k = cy * 4096 + cx; let b = buckets.get(k); if (!b) buckets.set(k, (b = [])); b.push(s); }
    }
  };
  const rivers = RIVERS.map((r, i) => ({ name: r.name, w: r.w, line: wander(r.pts, 6, 14, seed ^ (S_RIVER + i * 31)) }));
  for (const r of rivers) addLine(r.line, { t: 'river', hw: r.w / 2 }, WILD_R + 8);
  const roads = ROADS.map((r, i) => ({ kind: r.kind, line: r.kind === 'imperial' ? r.pts.map(([x, y]) => [x * K, y * K]) : wander(r.pts, 8, 4, seed ^ (0x70ad + i)) }));
  // a track from each dungeon's mouth to the nearest road (straight, as the land's own tracks are)
  for (const s of SITES) {
    const sx = s.x * K, sy = (s.y + 6) * K; let best = null, bd = Infinity;
    for (const r of roads) for (let i = 0; i + 1 < r.line.length; i++) { const q = nearestOn(sx, sy, r.line[i], r.line[i + 1]); if (q.d < bd) { bd = q.d; best = q; } }
    if (best && bd > 6 && bd < 360) roads.push({ kind: 'track', line: [[sx, sy], [best.x, best.y]] });
  }
  for (const r of roads) addLine(r.line, { t: 'road', kind: r.kind, hw: r.kind === 'imperial' ? 2.4 : 1.6 }, WILD_R + 8);
  const ridges = RANGES.map((r, i) => wander(r, 10, 7, seed ^ (0x41d6 + i * 17)));
  for (const r of ridges) addLine(r, { t: 'ridge', hw: 9 }, WILD_R + 30);
  // the beacon-towers: one each 300 tiles along an imperial road
  const beacons = [];
  for (const r of roads) if (r.kind === 'imperial') { let along = 0, next = 150; for (let i = 0; i + 1 < r.line.length; i++) { const [ax, ay] = r.line[i], [bx, by] = r.line[i + 1], L = hypot(bx - ax, by - ay);
    while (next < along + L) { const t = (next - along) / L; beacons.push([ax + (bx - ax) * t + (by - ay) / L * 5, ay + (by - ay) * t - (bx - ax) / L * 5]); next += 300; } along += L; } }

  /** the nearest of each kind of line to a tile: river, imperial road, track, ridge (distance to its edge, < 0 inside) */
  function lines(x, y) {
    const b = buckets.get(Math.floor(y / CH) * 4096 + Math.floor(x / CH));
    const o = { river: Infinity, imperial: Infinity, track: Infinity, ridge: Infinity, riverW: 0 };
    if (!b) return o;
    for (const s of b) {
      const d = nearestOn(x, y, [s.ax, s.ay], [s.bx, s.by]).d - s.hw;
      if (s.t === 'river') { if (d < o.river) { o.river = d; o.riverW = s.hw; } }
      else if (s.t === 'ridge') o.ridge = Math.min(o.ridge, d);
      else if (s.kind === 'imperial') o.imperial = Math.min(o.imperial, d); else o.track = Math.min(o.track, d);
    }
    return o;
  }

  // ── a tile ──────────────────────────────────────────────────────────────────────────────────────────────────────────
  const cellAt = (u, v) => { const iu = Math.floor(u), iv = Math.floor(v); return iu < 0 || iv < 0 || iu >= MAP_W || iv >= MAP_H ? -1 : iv * MAP_W + iu; };
  /** the macro cell under a tile, the coast's line roughened at the tile's scale */
  function macroAt(x, y) {
    const jx = (vnoise(x / 9, y / 9, seed ^ S_COAST) - 0.5) * 3.2, jy = (vnoise(x / 9 + 40, y / 9, seed ^ S_COAST) - 0.5) * 3.2;
    return cellAt((x + jx) / K, (y + jy) / K);
  }
  const regionIdx = (x, y) => { const c = macroAt(x, y); return c < 0 ? 0 : region[c]; };
  /** the region at a tile (geo.js REGIONS), or null at sea */
  const regionAt = (x, y) => { const r = regionIdx(x, y); return r ? REGIONS[r - 1] : null; };
  const fens = (u, v) => { for (let i = 0; i + 1 < FENS_LINE.length; i++) { const [ax, ay] = FENS_LINE[i], [bx, by] = FENS_LINE[i + 1]; if (u >= ax && u <= bx) return v > ay + ((by - ay) * (u - ax)) / (bx - ax); } return false; };
  const townAt = (x, y) => { for (const t of TOWNS) { const d = hypot(x - t.x * K, y - t.y * K); if (d < t.r + SAFE) return { t, d }; } return null; };

  /** the ground a tile has (G), from the macro layers, the lines and the noise */
  function groundAt(x, y) {
    const c = macroAt(x, y);
    if (c < 0 || !region[c]) return G.SEA;
    const R = REGIONS[region[c] - 1], a = area[c], u = x / K, v = y / K;
    const L = lines(x, y), road = Math.min(L.imperial, L.track);
    if (a & BIT.mere) return road < 0 ? G.BRIDGE : G.LAKE;                   // (the Ashgate road crosses the Mere on its causeway)
    const tn = townAt(x, y);
    if (tn && tn.d < tn.t.r) { if (tn.d > tn.t.r - 2 && road > 1) return G.WALL; return road < 0 ? G.ROAD : G.TOWN; }
    if (L.river < 0) return road < 1.5 ? G.BRIDGE : G.RIVER;
    if (road < 0) return L.imperial < 0 ? G.ROAD : G.TRACK;
    // the shore: sand a couple of tiles in from the sea
    for (const [dx, dy] of [[2.5, 0], [-2.5, 0], [0, 2.5], [0, -2.5]]) { const q = macroAt(x + dx, y + dy); if (q < 0 || !region[q]) return G.SAND; }
    // the crater's rim and floor, open south where the Stair comes up
    const ex = (u - CRATER.x) / CRATER.rx, ey = (v - CRATER.y) / CRATER.ry, e = hypot(ex, ey), rim = 0.13 + (vnoise(x / 14, y / 14, seed ^ 0xc4a7) - 0.5) * 0.08;
    if (Math.abs(e - 1) < rim) return ey > 0 && Math.abs(ex) < CRATER.gap ? G.HILLS : G.ROCK;
    if (e < 1) return G.CRATER;
    const vd = hypot(u - VOLCANO.x, v - VOLCANO.y);
    if (vd < VOLCANO.r * 0.75) return G.ROCK;
    if (vd < VOLCANO.r * 1.8) return G.HILLS;
    // a ridge: rock, opening to a pass where a road goes through; hills round its skirt
    const wob = (vnoise(x / 11, y / 11, seed ^ 0x51d6) - 0.5) * 6;
    if (L.ridge < wob) return road < 10 ? G.HILLS : G.ROCK;
    if (L.ridge < 16 + wob) return G.HILLS;
    const n = vnoise(x / 23, y / 23, seed ^ S_GROUND), n2 = vnoise(x / 7, y / 7, seed ^ (S_GROUND + 1));
    if (a & BIT.marsh) return n2 > 0.68 && n > 0.35 && road > 3 ? G.POOL : G.MARSH;
    if (a & BIT.forest) return n < 0.26 ? G.MEADOW : G.FOREST;
    if (a & BIT.pines) return n < 0.22 ? (R.id === 'heights' ? G.SNOW : G.MEADOW) : G.PINES;
    if (a & BIT.downs) return n > 0.35 ? G.HILLS : G.MEADOW;
    if (R.id === 'emberfall' && fens(u, v)) return n2 > 0.72 && n > 0.4 && road > 3 ? G.POOL : G.MARSH;
    if (R.id === 'heights') return n > 0.7 ? G.PINES : G.SNOW;
    if (R.id === 'reach') { const sv = SITES.find((s) => s.id === 'cinderworks'); if (sv && hypot(u - sv.x, v - sv.y) < 40 && n2 > 0.6 && road > 3) return G.TAILINGS; return n > 0.72 ? G.HILLS : G.ASH; }
    if (tn && tn.d < tn.t.r + 34 && n2 > 0.45) return G.FIELD;
    if (R.id === 'greenwood') return n > 0.4 ? G.FOREST : G.MEADOW;
    if (n > 0.78) return G.FOREST;                                             // a wood in the meadows
    return G.MEADOW;
  }

  // ── the level map (§3) ──────────────────────────────────────────────────────────────────────────────────────────────
  /** the land's level at a tile before the roads and the hotspots: the region's control points blended, in its band */
  function baseLevel(x, y) {
    const R = regionAt(x, y); if (!R) return 0;
    const u = x / K, v = y / K; let sw = 0, sl = 0;
    for (const [px, py, lv] of R.pts) { const d2 = (px - u) * (px - u) + (py - v) * (py - v), w = 1 / (d2 + 600); sw += w; sl += w * lv; }
    return Math.max(R.band[0], Math.min(R.band[1], sl / sw));
  }
  const hotAt = (x, y) => SITES.some((s) => hypot(x - s.x * K, y - (s.y + 6) * K) < HOT_R);
  /** a camp's level at a tile: the blend, −2 by an imperial road, −1 by a track, +1 deep in the wild, +2 at a hotspot */
  function levelAt(x, y, g = groundAt(x, y)) {
    const R = regionAt(x, y); if (!R) return 0;
    const L = lines(x, y); let lv = baseLevel(x, y);
    if (L.imperial < ROAD_NEAR) lv -= 2; else if (L.track < ROAD_NEAR) lv -= 1;
    else if (Math.min(L.imperial, L.track) > WILD_R && (g === G.FOREST || g === G.PINES || g === G.HILLS || g === G.MARSH || g === G.SNOW)) lv += 1;
    if (hotAt(x, y)) lv += 2;
    return Math.max(R.band[0], Math.min(R.band[1], Math.round(lv)));
  }

  // ── who camps where (§4) ────────────────────────────────────────────────────────────────────────────────────────────
  function familyFor(R, g, hot, x, y, h) {
    const u = x / K, v = y / K;
    switch (R.id) {
      case 'emberfall': if (fens(u, v)) { const n = vnoise(u / 90, v / 90, seed ^ 0xfe25); return n < 0.4 ? 'reedmen' : n < 0.7 ? 'harvest' : 'drowned'; }
        return hot ? 'ashbound' : g === G.HILLS ? 'goblin' : g === G.FOREST ? 'redhand' : h < 0.5 ? 'redhand' : 'diggers';
      case 'reach': return hot ? 'chapel' : g === G.HILLS ? 'goblin' : h < 0.5 ? 'goblin' : 'diggers';
      case 'solmere': return h < 0.5 ? 'redhand' : 'lockcult';
      case 'tidemark': return g === G.MARSH || g === G.SAND ? 'drowned' : 'redhand';
      case 'greenwood': return g === G.FOREST ? (h < 0.6 ? 'reedmen' : 'goblin') : 'redhand';
      default: return hot ? 'chapel' : 'ashbound';
    }
  }
  /** a camp's foes: kinds, levels and who's the elite @param {string} fam @param {number} n @param {number} lv @param {number} eliteAt @param {number} h0 */
  function members(fam, n, lv, eliteAt, h0) {
    const F = FAMILIES[fam] || FAMILIES.ashbound, out = [];
    for (let i = 0; i < n; i++) {
      const h = hash2(h0 * 7919 | 0, i, seed ^ 0x3e3b), h2 = hash2(i, h0 * 104729 | 0, seed ^ 0x3e3c);
      if (i === eliteAt) { out.push({ kind: F.elite, lvl: lv, elite: true }); continue; }
      const ranged = h < 0.35, pair = ranged ? F.ranged : F.melee;
      out.push({ kind: pair[h2 < 0.5 ? 0 : 1], lvl: Math.max(1, lv - (h2 > 0.8 ? 1 : 0)), elite: false });
    }
    return out;
  }
  /** the camp a grid cell holds, or null @param {number} gx @param {number} gy */
  function campAt(gx, gy) {
    const h = hash2(gx, gy, seed ^ S_CAMP), hx = hash2(gx, gy, seed ^ (S_CAMP + 1)), hy = hash2(gx, gy, seed ^ (S_CAMP + 2)), hk = hash2(gx, gy, seed ^ (S_CAMP + 3));
    const x = gx * CAMP_GRID + 4 + hx * (CAMP_GRID - 8), y = gy * CAMP_GRID + 4 + hy * (CAMP_GRID - 8);
    if (x < 0 || y < 0 || x >= W || y >= H) return null;
    const g = groundAt(x, y), R = regionAt(x, y);
    if (!R || !WALK[g] || g === G.ROAD || g === G.TRACK || g === G.BRIDGE || g === G.TOWN || townAt(x, y)) return null;
    const L = lines(x, y), nearRoad = Math.min(L.imperial, L.track) < ROAD_NEAR;
    if (h >= (DENSITY[g] || 0.4) * (nearRoad ? 0.4 : 1)) return null;
    for (const [dx, dy] of [[1.5, 0], [-1.5, 0], [0, 1.5], [0, -1.5]]) if (!WALK[groundAt(x + dx, y + dy)]) return null;   // room to stand
    const hot = hotAt(x, y), lv = levelAt(x, y, g);
    const kind = hk < (hot ? 0.25 : 0.03) ? 'elite' : hk < 0.33 ? 'wanderer' : hk < 0.78 ? 'pack' : 'camp';
    const n = kind === 'wanderer' ? 1 : kind === 'pack' ? 2 + (hx > 0.5 ? 1 : 0) : kind === 'camp' ? 3 + Math.floor(hy * 3) : 3;
    const eliteAt = kind === 'elite' ? 0 : kind === 'camp' && lv >= 5 && hk > 0.78 + 0.22 * 2 / 3 ? 0 : -1;
    const fam = familyFor(R, g, hot, x, y, hx);
    return { id: gy * 256 + gx, kind, x, y, lv, region: R.id, family: fam, foes: members(fam, n, lv, eliteAt, gy * 256 + gx), hot };
  }
  // the lairs: one at each dungeon's mouth, its warden an elite at the band's top, three of its own
  const lairs = SITES.map((s, i) => {
    const x = s.x * K, y = (s.y + 6) * K, lv = s.lv[1], F = FAMILIES[s.family] || FAMILIES.ashbound, R = regionAt(x, y);
    return { id: 100000 + i, kind: 'lair', x, y, lv, region: R ? R.id : 'emberfall', family: s.family, site: s.id, name: s.name, hot: true,
      foes: [{ kind: F.elite, lvl: lv, elite: true, warden: true }, { kind: F.melee[0], lvl: lv - 1, elite: false }, { kind: F.melee[1], lvl: lv - 1, elite: false }, { kind: F.ranged[0], lvl: lv - 1, elite: false }] };
  });

  // ── chunks ──────────────────────────────────────────────────────────────────────────────────────────────────────────
  const cache = new Map(), CACHE_MAX = 320;
  /** the features (§2) on a chunk: trees on an 8-tile lattice, small things on a 4-tile one */
  function featsOf(cx, cy, ground, solid) {
    const out = [], X0 = cx * CH, Y0 = cy * CH;
    const gAt = (x, y) => { const i = Math.floor(x) - X0, j = Math.floor(y) - Y0; return i >= 0 && j >= 0 && i < CH && j < CH ? ground[j * CH + i] : groundAt(x, y); };
    const block = (x, y, r) => { for (let j = Math.floor(y - r); j <= Math.floor(y + r); j++) for (let i = Math.floor(x - r); i <= Math.floor(x + r); i++) { const a = i - X0, b = j - Y0; if (a >= 0 && b >= 0 && a < CH && b < CH) solid[b * CH + a] = 1; } };
    const R = regionAt(X0 + CH / 2, Y0 + CH / 2), rid = R ? R.id : '';
    for (let gy = Y0 / 8; gy < (Y0 + CH) / 8; gy++) for (let gx = X0 / 8; gx < (X0 + CH) / 8; gx++) {
      const h = hash2(gx, gy, seed ^ S_FEAT), x = gx * 8 + 1 + hash2(gx, gy, seed ^ (S_FEAT + 1)) * 6, y = gy * 8 + 1 + hash2(gx, gy, seed ^ (S_FEAT + 2)) * 6, g = gAt(x, y), v = hash2(gx, gy, seed ^ (S_FEAT + 3));
      if (g === G.ROCK && h < 0.55) out.push({ k: v < 0.3 ? 'massif' : 'peak', x, y, v });
      else if (g === G.FOREST && h < 0.72) { out.push({ k: rid === 'greenwood' ? (v < 0.45 ? 'oak' : 'grove') : rid === 'tidemark' ? 'birch' : v < 0.35 ? 'oak' : v < 0.55 ? 'autumn' : v < 0.75 ? 'birch' : 'grove', x, y, v }); block(x, y, 0.6); }
      else if (g === G.PINES && h < 0.7) { out.push({ k: 'pine', x, y, v }); block(x, y, 0.5); }
      else if (g === G.MEADOW && h < 0.07) { out.push({ k: rid === 'heights' ? 'pine' : v < 0.5 ? 'oak' : 'birch', x, y, v }); block(x, y, 0.6); }
      else if (g === G.SNOW && h < 0.1) { out.push({ k: 'pine', x, y, v }); block(x, y, 0.5); }
      else if (g === G.MARSH && h < 0.3) { out.push({ k: v < 0.4 ? 'dead' : v < 0.7 ? 'willow' : 'carr', x, y, v }); block(x, y, 0.5); }
      else if (g === G.HILLS && h < 0.18) { out.push({ k: 'rock', x, y, v }); block(x, y, 0.8); }
      else if ((g === G.ASH || g === G.CRATER) && h < 0.12) { out.push({ k: v < 0.5 ? 'slag' : 'dead', x, y, v }); block(x, y, 0.8); }
    }
    for (let gy = Y0 / 4; gy < (Y0 + CH) / 4; gy++) for (let gx = X0 / 4; gx < (X0 + CH) / 4; gx++) {
      const h = hash2(gx, gy, seed ^ (S_FEAT + 9)), x = gx * 4 + 0.5 + hash2(gx, gy, seed ^ (S_FEAT + 10)) * 3, y = gy * 4 + 0.5 + hash2(gx, gy, seed ^ (S_FEAT + 11)) * 3, g = gAt(x, y), v = hash2(gx, gy, seed ^ (S_FEAT + 12));
      if (g === G.MARSH && h < 0.45) out.push({ k: 'reeds', x, y, v });
      else if ((g === G.MEADOW || g === G.FIELD) && h < 0.22) out.push({ k: 'brush', x, y, v });
      else if ((g === G.HILLS || g === G.SNOW || g === G.ASH) && h < 0.08) { out.push({ k: 'stone', x, y, v }); block(x, y, 0.3); }
    }
    for (const [bx, by] of beacons) if (bx >= X0 && bx < X0 + CH && by >= Y0 && by < Y0 + CH) { out.push({ k: 'beacon', x: bx, y: by, v: 0 }); block(bx, by, 0.8); }
    for (const s of SITES) { const x = s.x * K, y = s.y * K; if (x >= X0 && x < X0 + CH && y >= Y0 && y < Y0 + CH) { out.push({ k: 'site', x, y, v: 0, id: s.id, name: s.name }); block(x, y, 3); } }
    out.sort((a, b) => a.y - b.y);
    return out;
  }
  /** the chunk at (cx, cy), made on first asking @param {number} cx @param {number} cy */
  function chunk(cx, cy) {
    const key = cy * CW + cx;
    let c = cache.get(key);
    if (c) { cache.delete(key); cache.set(key, c); return c; }
    const ground = new Uint8Array(CH * CH), solid = new Uint8Array(CH * CH);
    for (let j = 0; j < CH; j++) for (let i = 0; i < CH; i++) ground[j * CH + i] = groundAt(cx * CH + i + 0.5, cy * CH + j + 0.5);
    const feats = featsOf(cx, cy, ground, solid);
    const camps = [];
    const g0x = Math.floor(cx * CH / CAMP_GRID) - 1, g1x = Math.ceil((cx + 1) * CH / CAMP_GRID), g0y = Math.floor(cy * CH / CAMP_GRID) - 1, g1y = Math.ceil((cy + 1) * CH / CAMP_GRID);
    for (let gy = g0y; gy <= g1y; gy++) for (let gx = g0x; gx <= g1x; gx++) {
      const k = campAt(gx, gy); if (k && Math.floor(k.x / CH) === cx && Math.floor(k.y / CH) === cy) camps.push(k);
    }
    for (const l of lairs) if (Math.floor(l.x / CH) === cx && Math.floor(l.y / CH) === cy) camps.push(l);
    c = { cx, cy, ground, solid, feats, camps };
    cache.set(key, c);
    if (cache.size > CACHE_MAX) cache.delete(cache.keys().next().value);
    return c;
  }
  const chunkOf = (x, y) => { const cx = Math.floor(x / CH), cy = Math.floor(y / CH); return cx < 0 || cy < 0 || cx >= CW || cy >= CHN ? null : chunk(cx, cy); };
  /** the ground under a point (from its chunk) */
  const ground = (x, y) => { const c = chunkOf(x, y); return c ? c.ground[(Math.floor(y) - c.cy * CH) * CH + Math.floor(x) - c.cx * CH] : G.SEA; };
  /** can a point be stood on: its ground walkable, nothing solid on it */
  const walkable = (x, y) => { const c = chunkOf(x, y); if (!c) return false; const i = (Math.floor(y) - c.cy * CH) * CH + Math.floor(x) - c.cx * CH; return WALK[c.ground[i]] && !c.solid[i]; };

  return { seed, W, H, K, CH, CW, CHN, region, area, rivers, roads, ridges, beacons, lairs,
    regionAt, groundAt, baseLevel, levelAt, lines, townAt, chunk, chunkOf, ground, walkable, campAt, cacheSize: () => cache.size };
}

/** the nearest point on a segment to (x, y), and how far @param {number} x @param {number} y @param {number[]} a @param {number[]} b */
export function nearestOn(x, y, a, b) {
  const dx = b[0] - a[0], dy = b[1] - a[1], l = dx * dx + dy * dy || 1, t = Math.max(0, Math.min(1, ((x - a[0]) * dx + (y - a[1]) * dy) / l));
  const px = a[0] + dx * t, py = a[1] + dy * t;
  return { x: px, y: py, d: hypot(x - px, y - py) };
}
