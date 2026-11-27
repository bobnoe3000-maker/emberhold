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

import { mulberry32, streamSeed, fbm } from './rng.js';
import { FLOOR_Z } from './level.js';
import { ENV_FOOT, DRAWN_FOOT } from './envfoot.js';
import { hypot, sin, cos } from './detmath.js';
import { campsOf, CAMP_BY } from './camps.js';

// ground codes (pixel + tile)
// (M8: the Fens' swamp ground, docs/region-towns-proposal.md: MARSH is wet peat and reeds you can walk; POOL still bog
// water you can't; DECK the boardwalks and Saltmere's square on piles, laid over either)
// (the Reach's and the Heights' open ground, docs/reach-heights-overlands.md: SCREE is cracked earth and red rock in the
// Reach, loose stone in the Heights; SNOW the Heights' patches. Both walked, both scattered on. Append-only.)
export const G = { GRASS: 0, DIRT: 1, COBBLE: 2, WATER: 3, BANK: 4, FIELD: 5, MARSH: 6, POOL: 7, DECK: 8, SCREE: 9, SNOW: 10, SAND: 11 };
const G_MAT = ['grass', 'dirt', 'cobble', 'water', 'bank', 'field', 'marsh', 'pool', 'deck', 'scree', 'snow', 'sand'];   // (v1.150: the Tidemark's beaches and dunes, a sea's fringe)
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
  let bestRank = 0, roadD = Infinity, riverD = Infinity;                // rank: water 4 > bank 3 > cobble 2 > dirt 1
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
  // (Saltmere's critic pass: a boardwalk running into the square laid its own planks across it, and its rounded end lay
  // on the square like a rug; inside a deck square the square's deck is the floor)
  let walkIn = false;                                                  // (and no rim across a boardwalk's mouth)
  if (deckS) for (const p of o.plazas) if (p.surface === 'deck') { const u = Math.abs(gx - p.cx) / p.rx, v = Math.abs(gy - p.cy) / p.ry; if (u * u * u + v * v * v < 1) { deckS = null; walkIn = true; break; } }
  if (deckS) { out.g = G.DECK; out.t = deckD / (deckS.w / 2); out.lat = Math.sign(deckQ.side) * deckD; out.along = deckS.s0 + deckQ.t * deckS.len; out.hw = deckS.w / 2; return out; }
  if (bestRank >= 3) return out;
  // a junction's apron: packed earth where roads meet, no ruts (critic pass 10: each road's ruts ran on into the join)
  for (const a of o.aprons) {
    const d = hypot(gx - a.x, gy - a.y);
    if (d < a.r && bestRank <= 1) { if (!bestRank) { out.g = G.DIRT; out.t = d / a.r * 0.85; out.lat = 0; out.hw = a.r; } out.cap = true; bestRank = 1; }
  }
  for (const p of o.plazas) {                        // cobbled squares: soft superellipse
    const u = (gx - p.cx) / p.rx, v = (gy - p.cy) / p.ry, au = Math.abs(u), av = Math.abs(v), e = au * au * au + av * av * av;
    const wob = p.surface === 'deck' ? 0 : (fbm(gx * 0.3, gy * 0.3, o.seed + 29) - 0.5) * 0.25;   // (a deck's edge is built: no wobble)
    if (e < 1 + wob && bestRank < 2) { bestRank = 2; out.g = p.surface === 'deck' ? G.DECK : G.COBBLE; out.t = e; out.lat = p.surface === 'deck' ? (gx - gy) / 2 : 0; out.hw = 0; out.along = gx + gy; }
    else if (e < 1 && p.surface === 'deck' && out.g === G.DECK) out.t = Math.min(out.t, e);   // (two decks joined: the rim only where both end)
    if (walkIn && out.g === G.DECK) out.t = Math.min(out.t, 0.9);
  }
  if (bestRank) return out;
  for (const p of o.pools || []) {                   // still water (M8): a soft superellipse, a reedy fringe round it
    if (inClear(o, gx, gy)) break;                   // (a clearing is dry: o.clear, set once the land is built: clearGround)
    const u = (gx - p.cx) / p.rx, v = (gy - p.cy) / p.ry, au = Math.abs(u), av = Math.abs(v), e = au * au * au + av * av * av;
    const wob = (fbm(gx * 0.11, gy * 0.11, o.seed + 37) - 0.5) * 0.55;
    if (e < 1 + wob) { out.g = G.POOL; out.t = e; return out; }
    const fr = p.beach || 0.45;                      // (a sea's beach can be wider: the Tidemark's, v1.156)
    if (e < 1 + fr + wob) { out.g = p.sea ? G.SAND : G.MARSH; out.t = (e - 1) / fr; return out; }   // (a sea's fringe is its beach, v1.150)
  }
  for (const f of o.fields) {
    if (gx >= f.x0 && gx < f.x1 && gy >= f.y0 && gy < f.y1) {
      out.g = G.FIELD; out.fx = f.axis === 'x' ? gy - f.y0 : gx - f.x0;
      out.t = Math.min(gx - f.x0, f.x1 - gx, gy - f.y0, f.y1 - gy); return out;
    }
  }
  if (o.marsh && fbm(gx * 0.045, gy * 0.045, o.seed + 31) > 0.55 && !inClear(o, gx, gy)) { out.g = G.MARSH; out.t = 1; }   // the fen's open ground: patches of wet peat and reed (none in a clearing: o.clear)
  else if (o.patches) for (const p of o.patches) {   // the Reach's cracked earth, the Heights' snow and scree: patches by a slow noise
    const n = fbm(gx * p.f, gy * p.f, o.seed + p.s);   // (t: 0 at the patch's edge → 1 a little way in, for the painter's dither)
    if (n > p.th) { out.g = p.g; out.t = Math.min(1, (n - p.th) / 0.06); break; }
  }
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
    if (g !== G.GRASS && g !== G.FIELD && g !== G.MARSH && g !== G.SCREE && g !== G.SNOW && g !== G.SAND) o.occ[Y * o.GW + X] = 2;      // keep roads, plazas and water clear of scatter
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

// A town's circuit (its curtains, towers and gatehouses) is drawn as raised ground (render3d/convert.js: stone, or for
// Thornwick a bank a step high under our kit's timber palisade, as thick as its footprint), and the drawn ground comes in
// cells of two tiles each way, on even tiles (a Luminati tile is two of ours, and a level is cropped on even tiles). Walled
// by its footprint (a curtain's middle row, a tower's circle), the sim's wall was a tile thick where four were drawn, and the
// party walked along on top of it (docs/pathing-audit.md; the owner, 2026-11-26: "Ashgate.. characters often auto path and
// walk over or through walls"). So a wall piece is walled on whole cells, the ones its footprint covers at least half of
// each way (wallCells; a tower's those its round holds), and the converter raises those same cells (`cells` on the
// struct). A tower out on the Reach's roads or at its works, away from any wall, is a beacon or a furnace stack (our kit's,
// stood on the ground: convert.js), its footprint as any building's.
const STONE_PIECE = /^(vale|fens|reach|heights|tidemark)_(curtainy?|gatehousey|tower)_\d$/;
/** the tiles a stone wall piece walls (whole cells, even-aligned): [tx0, ty0, tx1, ty1], inclusive @param {string} id @param {number} x @param {number} y */
export function wallCells(id, x, y) {
  const [x0, y0, x1, y1] = footRect(id, x, y);
  const lo = (a) => { const c = Math.floor(a / 2) * 2; return c + 2 - a < 1 ? c + 2 : c; };   // (the first cell it covers half of)
  const hi = (b) => { const c = Math.floor(b / 2) * 2; return (b - c < 1 ? c - 2 : c) + 1; };
  return [lo(x0), lo(y0), hi(x1), hi(y1)];
}
const cellPiece = (o, id, x, y) => STONE_PIECE.test(id) && (!/_tower_/.test(id) || o.kind === 'town' || o.region !== 'reach' ||
  o.structs.some((q) => /_(curtainy?|gatehousey)_\d$/.test(q.id) && Math.abs(q.x - x) < 14 && Math.abs(q.y - y) < 14));   // (convert.js beacon(): the same 14)
/** wall a stone piece's cells, but those `keep` leaves open (a gate's way through); a tower's are those whose middles its
 * round (90 % of its footprint, as it was walled) holds */
function wallOn(o, id, x, y, keep = null) {
  const [a, b, c, d] = wallCells(id, x, y), [x0, y0, x1, y1] = footRect(id, x, y), mx = (x0 + x1) / 2, my = (y0 + y1) / 2, rx = (x1 - x0) * 0.45, ry = (y1 - y0) * 0.45;
  const round = /_tower_/.test(id), out = (tx, ty) => { const cx = Math.floor(tx / 2) * 2 + 1, cy = Math.floor(ty / 2) * 2 + 1; const u = (cx - mx) / rx, v = (cy - my) / ry; return u * u + v * v > 1; };
  for (let ty = b; ty <= d; ty++) for (let tx = a; tx <= c; tx++) { if ((keep && keep(tx, ty)) || (round && out(tx, ty))) continue; const i = gi(o, tx, ty); if (i >= 0) { o.blocked[i] = 1; if (o.occ[i] !== 2) o.occ[i] = 1; } }
}

// A home or a service of a town's set is drawn as Luminati's own house (render3d/convert.js HOUSES): a box HOME.w of its
// footprint's width by HOME.d of its depth (within HOME's least and most, in Luminati's units, two of our tiles each), on a
// plinth a tenth of a unit wider each side, centred on its footprint. Walled by its footprint 12 % in from each side, the
// sim's wall stood up to a tile inside the walls drawn (the small homes most: drawn at Luminati's least house, three units
// by two and a half), and the party walked through them (docs/pathing-audit.md). So a home is walled on the tiles whose
// middles the drawn house covers (homeWalls), and the converter draws the house on exactly those tiles. Not a piece the
// Reach's overland draws as one of our kit's (REACH_KIT: the Assay Yards' counting house, the Cinderworks' furnace hall).
const HOME_ID = /^(vale|fens|reach|heights|tidemark)_(temple|tavern|shop|smith|inn|longhousex?|workshopx?|cottagex?|housex?|farmx?)_\d+$/;
export const HOME = { w: 0.82, d: 0.72, minW: 3, maxW: 8, minD: 2.5, maxD: 6, plinth: 0.1 };
const clampH = (v, a, b) => Math.max(a, Math.min(b, v)), r2 = (v) => Math.round(v * 100) / 100;
/** the tiles a home walls, as their outer edges [x0, y0, x1, y1] in our tiles @param {string} id @param {number} x @param {number} y */
export function homeWalls(id, x, y) {
  const f = ENV_FOOT[id], cx = x + (f[0] + f[2]) / 2, cy = y + (f[1] + f[3]) / 2;
  const hw = clampH(r2(((f[2] - f[0]) / 2) * HOME.w), HOME.minW, HOME.maxW) + 2 * HOME.plinth, hd = clampH(r2(((f[3] - f[1]) / 2) * HOME.d), HOME.minD, HOME.maxD) + 2 * HOME.plinth;   // (units across: half that, in tiles, each side)
  return [Math.floor(cx - hw - 0.5) + 1, Math.floor(cy - hd - 0.5) + 1, Math.ceil(cx + hw - 0.5), Math.ceil(cy + hd - 0.5)];
}
/** the Reach's overland pieces drawn as our kit's on the sim's footprints (convert.js): [the sim's piece, the REACH place
 * it stands at (within `r`), the kit's piece] @type {[RegExp, string, string, number][]} */
export const REACH_KIT = [[/_longhouse_\d/, 'yards', 'reach_assayhouse', 6], [/_keep_\d/, 'forge', 'reach_forgedoor', 6], [/^chapelruin_0$/, 'ninth', 'reach_ninthdoor', 6], [/^ruin$/, 'vault', 'reach_vaultmouth', 6], [/_smith_/, 'works', 'reach_works', 3],
  [/_tower_\d/, 'works', 'reach_stack', 16], [/_tower_\d/, 'vault', 'reach_stack', 16]];   // (a tower by the works or the Vault's mouth is a furnace stack)
// (the furnace hall and the stacks are stood on their host's footprint's middle; the doors on its origin: convert.js)
const KIT_AT_MIDDLE = new Set(['reach_works', 'reach_stack']);
/** the kit piece the Reach's overland draws this piece as, or null @param {any} o @param {{ id: string, x: number, y: number }} s */
export function reachKitOf(o, s) {
  if (o.kind !== 'overland' || o.region !== 'reach') return null;
  const k = REACH_KIT.find(([re, at, , r]) => re.test(s.id) && Math.abs(s.x - REACH[at][0]) < r && Math.abs(s.y - REACH[at][1]) < r);
  return k ? k[2] : null;
}
/** is this piece drawn as a home (Luminati's house)? @param {any} o @param {{ id: string, x: number, y: number }} s */
export const isHome = (o, s) => HOME_ID.test(s.id) && !reachKitOf(o, s);

// A tree is walled by its crown's ellipse where a crown is drawn over the ground. Where it's drawn bare (convert.js BIOMES:
// every tree of the Reach dead, the Heights' leafless but its pines, a dead tree anywhere) only its trunk stands at a figure's
// height, and the crown's wall was a wall of nothing round a dead stick, two to four tiles out (docs/pathing-audit.md):
// there it walls its trunk, TRUNK_R round the footprint's middle, where it's drawn.
const TREE_ID = /^(pine|oak|autumn|dead|grove|birch|alder|willow|carr)_\d/;
export const TRUNK_R = 1;
/** is this tree drawn bare in this land? (convert.js draws each land's trees as BIOMES says) @param {string} region @param {string} id */
export const bareTree = (region, id) => TREE_ID.test(id) && (/^dead_/.test(id) || region === 'reach' || (region === 'heights' && !/^pine_/.test(id)));

// A mountain is drawn as raised ground, a dome from a step at its footprint's edge to its top (convert.js raise): walled at
// 65 % of its footprint, the party walked up its flanks, three and four steps up (docs/pathing-audit.md). Walled to where the
// dome stands more than a step high (its edge, MOUNT_SHRINK in); the converter raises only the cells it walls whole.
// A rock on the Heights' snow is drawn as a small stone showing through it (convert.js, the foliage critic's round 3), so
// it walls what a trunk does.
export const MOUNT_SHRINK = 0.03;

// shape: 'rect' (buildings), 'round' (trees, mountains), 'none', 'deck' (bridges clear water), 'trunk' (a bare tree, a stone in the snow: TRUNK_R)
function put(o, id, x, y, shape = 'rect', shrink = 0.12) {
  if (!ENV_FOOT[id]) return;
  if ((shape === 'round' || shape === 'rect') && bareTree(o.region, id)) shape = 'trunk';   // (a birch is scattered as 'rect')
  if (shape === 'round' && /^mountain_/.test(id)) shrink = MOUNT_SHRINK;
  if (shape === 'rect' && /_stilt/.test(id)) shrink = 0;   // (a stilt house's deck runs out to its footprint's edge at a man's chest, on its stilts: our kit's, buildkit.js)
  if (/^rock_/.test(id) && shape !== 'none' && o.tmat[gi(o, x, y)] === G.SNOW) { shape = 'trunk'; }   // (a stone through the snow: SNOW_STONE)
  const kit = reachKitOf(o, { id, x, y });
  if (kit && DRAWN_FOOT[kit]) {   // (the Reach's site doors, its furnace hall and stacks, walled as our kit's piece drawn there: as big as a hill, the Forgehall's)
    o.structs.push({ id, x, y }); stamp(o, id, x, y, 'none', 0);
    const f = ENV_FOOT[id], k = DRAWN_FOOT[kit], at = KIT_AT_MIDDLE.has(kit) ? [x + (f[0] + f[2]) / 2, y + (f[1] + f[3]) / 2] : [x, y];
    stamp(o, id, at[0], at[1], kit === 'reach_stack' ? 'round' : 'rect', kit === 'reach_stack' ? 0.1 : 0.12, k);
    return;
  }
  if (shape === 'rect' && isHome(o, { id, x, y })) {   // (homeWalls: what's drawn)
    o.structs.push({ id, x, y }); stamp(o, id, x, y, 'none', 0);
    const [a, b, c, d] = homeWalls(id, x, y);
    for (let ty = b; ty < d; ty++) for (let tx = a; tx < c; tx++) { const i = gi(o, tx, ty); if (i >= 0) { o.blocked[i] = 1; if (o.occ[i] !== 2) o.occ[i] = 1; } }
    return;
  }
  if (/_tower_\d$/.test(id) && cellPiece(o, id, x, y)) { o.structs.push({ id, x, y, cells: true }); stamp(o, id, x, y, 'none', 0); wallOn(o, id, x, y); return; }
  o.structs.push({ id, x, y }); stamp(o, id, x, y, shape, shrink);
}
// a footprint's tiles: held (occ), and walled where it stands (blocked) by its shape
function stamp(o, id, x, y, shape, shrink, foot = null) {   // (foot: another piece's footprint, drawn there in its place)
  const [x0, y0, x1, y1] = foot ? [x + foot[0], y + foot[1], x + foot[2], y + foot[3]] : footRect(id, x, y), w = x1 - x0, h = y1 - y0;
  for (let ty = Math.floor(y0); ty <= Math.floor(y1); ty++) for (let tx = Math.floor(x0); tx <= Math.floor(x1); tx++) {
    const i = gi(o, tx, ty); if (i < 0) continue;
    if (shape !== 'deck' && o.occ[i] !== 2) o.occ[i] = 1;
    const cx = tx + 0.5, cy = ty + 0.5;
    if (shape === 'rect') { if (cx > x0 + w * shrink && cx < x1 - w * shrink && cy > y0 + h * shrink && cy < y1 - h * shrink) o.blocked[i] = 1; }
    else if (shape === 'round') { const u = (cx - (x0 + x1) / 2) / (w / 2 * (1 - shrink)), v = (cy - (y0 + y1) / 2) / (h / 2 * (1 - shrink)); if (u * u + v * v < 1) o.blocked[i] = 1; }
    else if (shape === 'deck' && (w > h ? Math.abs(cy - y) < 3.2 : Math.abs(cx - x) < 3.2)) o.blocked[i] = 0;   // the walkable deck only
    else if (shape === 'trunk') { const u = cx - (x0 + x1) / 2, v = cy - (y0 + y1) / 2; if (u * u + v * v < TRUNK_R * TRUNK_R) o.blocked[i] = 1; }
    if (shape === 'round' && shrink === MOUNT_SHRINK && o.occ[i] === 2 && /^mountain_/.test(id)) o.blocked[i] = o.tmat[i] === G.WATER || o.tmat[i] === G.POOL ? 1 : 0;   // (never over a road or a plaza it leans on: fits' margin)
  }
}
// a thin run (fence / wall) that must block at least one tile across
function putRun(o, id, x, y) {
  put(o, id, x, y, 'none');
  if (cellPiece(o, id, x, y)) { o.structs[o.structs.length - 1].cells = true; wallOn(o, id, x, y); return; }
  const [x0, y0, x1, y1] = footRect(id, x, y), cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
  if (x1 - x0 > y1 - y0) { for (let tx = Math.floor(x0 + 0.5); tx < x1 - 0.5; tx++) { const i = gi(o, tx, cy); if (i >= 0) o.blocked[i] = 1; } }
  else for (let ty = Math.floor(y0 + 0.5); ty < y1 - 0.5; ty++) { const i = gi(o, cx, ty); if (i >= 0) o.blocked[i] = 1; }
}
// a gate across a road: block the wall, leave the gatehouse's way through (±3 tiles) clear
function putGate(o, id, x, y) {
  put(o, id, x, y, 'none');
  const [x0, y0, x1, y1] = footRect(id, x, y), alongX = x1 - x0 > y1 - y0;
  if (cellPiece(o, id, x, y)) {   // (its way through: every cell holding a tile of the ±3, as the converter clears the road through it)
    o.structs[o.structs.length - 1].cells = true;
    const g = alongX ? x : y, way = (t) => { const c = Math.floor(t / 2) * 2; return Math.abs(c + 0.5 - g) < 3 || Math.abs(c + 1.5 - g) < 3; };
    wallOn(o, id, x, y, (tx, ty) => way(alongX ? tx : ty));
    return;
  }
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
const TREE_KEEP = 0.36;   // a draw per tree on the Hollow Vale's land (v1.71): crown cover 19,429 → 14,576 tiles (−25 %), trees 100 → 67; low because a tree let go frees room another pass fills
const TREE_CLUSTER = ['grove_1', 'grove_2', 'grove_3', 'grove_4', 'grove_5', 'grove_6'];
// the Fens' (M8, fens critic pass 2): alder carr and willows, low and dark, and the drowned dead
const FENS_KEEP = 0.55;   // the share of the Fens' trees on the land that stand (v1.78): crown cover 10,083 → 7,548 tiles of its 240² (−25 %); low because a tree let go frees room another fills
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
// The Fens' water's edge (level-design-rules.md §3.6: "willows and the dead at the edges of the water"): round every mere
// and along the canal's banks, a willow leaning over the water now and then, a dead tree standing in its shallows. A
// crown may hang over the water (the scatter's trees can't: their whole footprint must be on land), never over a road,
// a building or a way in. Its own stream: nothing else on the map moves for it.
function waterEdge(o, keepOut, keep = () => true) {   // (keep: the Fens' thinning, v1.78)
  const rng = mulberry32(streamSeed(o.seed, 4434)), roadish = new Set([G.DIRT, G.COBBLE, G.DECK]);
  const fitsOver = (id, x, y) => { const [x0, y0, x1, y1] = footRect(id, x, y);
    for (let ty = Math.floor(y0); ty <= Math.floor(y1); ty++) for (let tx = Math.floor(x0); tx <= Math.floor(x1); tx++) {
      const i = gi(o, tx, ty); if (i < 0 || o.occ[i] === 1) return false;
      if (o.occ[i] === 2 && roadish.has(groundAt(o, tx + 0.5, ty + 0.5).g)) return false;
    }
    const t = groundAt(o, x, y).g; return t === G.GRASS || t === G.BANK || (t === G.MARSH && waterNear(o, x, y, 3)); };   // (the trunk on the bank or the grass, or the marsh at the water's lip: never out on the open marsh)
  const plant = (x, y) => {
    if (x < 4 || y < 4 || x > o.W - 4 || y > o.H - 4 || keepOut.some(([kx, ky]) => hypot(x - kx, y - ky) < 20)) return;
    const id = rng() < 0.78 ? pick(rng, ['willow_1', 'willow_2']) : pick(rng, ['dead_1', 'dead_2']);
    if (keep() && fitsOver(id, x, y)) put(o, id, x, y, 'round', 0.35);
  };
  for (const q of o.pools) for (let a = rng() * 0.6; a < Math.PI * 2; a += 0.42 + rng() * 0.3) {
    if (rng() > 0.3) continue;
    const k = 1 + (1.5 + rng() * 1.5) / Math.max(q.rx, q.ry);   // (the trunk a tile and a half to three out: at the edge, the art critic)
    plant(q.cx + cos(a) * q.rx * k, q.cy + sin(a) * q.ry * k);
  }
  for (const r of o.rivers) for (let i = 1; i < r.pts.length; i++) {
    const [ax, ay] = r.pts[i - 1], [bx, by] = r.pts[i], L = hypot(bx - ax, by - ay), nx = -(by - ay) / L, ny = (bx - ax) / L;
    for (let t = rng() * 8; t < L; t += 7 + rng() * 6) for (const sd of [-1, 1]) if (rng() < 0.5) {
      const d = r.w / 2 + 2 + rng() * 1.5; plant(ax + (bx - ax) * t / L + nx * sd * d, ay + (by - ay) * t / L + ny * sd * d);
    }
  }
}
/** is there open water (a pool, the canal, a river or its bank) within r tiles of (x, y)? (the Fens' edges: §3.6) */
function waterNear(o, x, y, r) {
  for (const [dx, dy] of [[0, 0], [r, 0], [-r, 0], [0, r], [0, -r], [r * 0.7, r * 0.7], [-r * 0.7, r * 0.7], [r * 0.7, -r * 0.7], [-r * 0.7, -r * 0.7]]) {
    const g = groundAt(o, x + dx, y + dy).g; if (g === G.POOL || g === G.WATER || g === G.BANK) return true;
  }
  return false;
}
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
// (kinds: the lists it picks from, the same draws whichever: the Reach's and the Heights' grow dry grass and stones)
function undergrowth(o, x0, y0, x1, y1, step, density, kinds = { low: LOW, solid: SOLID, foot: FOOT }) {
  const rng = mulberry32(streamSeed(o.seed, 4409));
  for (let y = y0; y < y1; y += step) for (let x = x0; x < x1; x += step) {
    const jx = x + (rng() - 0.5) * step * 0.9, jy = y + (rng() - 0.5) * step * 0.9, d = density(jx, jy), r = rng();
    if (!(d > 0) || r > d) continue;
    // (a bush isn't walled: the converter leaves the undergrowth to Luminati's ground cover, and nothing stood there at a
    // figure's height, an invisible wall: docs/pathing-audit.md. The stones are drawn, and walled)
    const solid = rng() < 0.3, id = pick(rng, solid ? kinds.solid : kinds.low);
    if (fits(o, id, jx, jy, solid ? 0.4 : 0.1)) put(o, id, jx, jy, solid && !/^ug_/.test(id) ? 'round' : 'none', 0.35);
  }
  for (const t of o.structs.slice()) {
    if (!/pine|oak|autumn|grove|alder|willow|carr/.test(t.id) || rng() < 0.35) continue;
    const f = ENV_FOOT[t.id], rad = f ? Math.max(f[2] - f[0], f[3] - f[1]) / 2 : 4;
    for (let k = 0, n = 1 + Math.floor(rng() * 3); k < n; k++) {
      const a = (rng() - 0.5) * 2.2 + Math.PI / 4, dist = rad * (0.7 + rng() * 0.5), x = t.x + cos(a) * dist, y = t.y + sin(a) * dist, id = pick(rng, kinds.foot);
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
    if (!/_(house|housex|cottage|cottagex|longhouse|longhousex)_\d$/.test(st.id)) continue;
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
function forestRing(o, rng, inset, cluster = TREE_CLUSTER, single = TREE_SINGLE, skip = null) {
  const lo = -o.PAD + 4, hiX = o.W + o.PAD - 4, hiY = o.H + o.PAD - 4;
  scatter(o, rng, lo, lo, hiX, hiY, 11, (x, y) => {
    const out = Math.max(-x - inset, x - (o.W + inset), -y - inset, y - (o.H + inset));
    if (out < 0 || (skip && skip(x, y))) return null;   // (skip: the Tidemark's sea and beaches, v1.150)
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
  fens:    { name: 'Saltmere',  tavern: 'The Drowned Eel',    inn: 'The Stilt House',   shop: "Rushlight's Chandlery",   smith: 'The Tidewater Forge',     temple: 'Chapel of the Grey Sisters' },
  reach:   { name: 'Ashgate',   tavern: 'The Slag & Bellows', inn: "Deepdelver's Rest", shop: 'The Ashgate Exchange', smith: 'The Ashgate Forge',       temple: 'Shrine of the Last Flame' },
  heights: { name: 'Frosthold', tavern: 'The Frozen Flagon',  inn: "Pilgrims' Hall",    shop: 'Frosthold Outfitters', smith: 'Ironpeak Smithy',         temple: 'The Monastery Chapel' },
  tidemark: { name: 'Tollhaven', tavern: 'The Paid Toll',     inn: 'The Chain Locker',  shop: 'The Bonded Stores',    smith: 'The Quay Forge',          temple: 'The Quay Chapel' },   // (v1.150; world doc §3.7)
};
// The square is the home screen, and its plaques are its menu: each service's sign hangs at a set height (tiles over
// the ground), the same in every town, not at its roof's top. A roof that changes (art critic pass 14: the shop and
// the inn came down a storey) moves no plaque, so the menu reads alike in every town (test/town.test.mjs). These are
// the heights the plaques were laid out at (the roofs' tops before that pass).
const SIGN_TOP = { temple: 23.5, tavern: 15.1, shop: 13.4, smith: 11.1, inn: 18.7 };
const WAY_SIGN_TOP = { temple: 23.5, tavern: 15.25, inn: 14.05, shop: 10.1, smith: 11.1 };   // a waystation's (its stilt tavern and inn; the chandlery's on its one-storey roof: at 13.4 it hung over the Stilt House, Saltmere's critic pass)
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
  // (v1.150) Tollhaven's harbour outside the walls, where the others have their north farm: the sea north-east, its
  // beach, three jetties out over it (world doc §3.7: the harbour on the north-east); nothing is sown by the sea
  const SEA = R === 'tidemark';
  if (SEA) {
    o.pools.push({ cx: 184, cy: 6, rx: 56, ry: 40, sea: true });
    for (const x of [146, 166, 186]) o.roads.push({ w: 3, surface: 'deck', pts: [[x, 50], [x, 14]] });
    o.roads.push({ w: 5, surface: 'deck', pts: [[134, 52], [200, 52]] });   // the quay's boards along the beach's top
    o.fields.push({ x0: 20, y0: 110, x1: 60, y1: 122, axis: 'x' });
  } else o.fields.push({ x0: 128, y0: 18, x1: 150, y1: 50, axis: 'x' }, { x0: 132, y0: 92, x1: 152, y1: 114, axis: 'y' }, { x0: 20, y0: 110, x1: 60, y1: 122, axis: 'x' });
  finalizeGround(o);

  // the square: the temple at its head (the top of the frame), the tavern and the shop, then the smithy and the inn
  const svc = [
    ['temple', B('temple'), [34, 24]], ['tavern', B('tavern'), [29, 48]], ['shop', B('shop'), [50, 41]],
    ['smith', B('smith'), [51, 67]], ['inn', B('inn'), [73, 55]],
  ];
  const PLAQUE = { shop: [8, 5] };                         // the shop's plaque down on its own roof: off the temple's door behind it and the HUD's buttons
  for (const [kind, id, [x, y]] of svc) { const [px, py] = PLAQUE[kind] || [0, 0]; put(o, id, x, y); o.services.push({ kind, id, x, y, name: info[kind] }); o.labels.push({ x: x + px, y: y + py, id, text: info[kind], service: kind, top: SIGN_TOP[kind] }); }
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

  // houses: a row along the high street's north side, the quarters at the back (north and west), low gardens in front.
  // Every home is one storey (2026-10-10, the owner: "Inns should be 2 story, homes and shops one story"), and the
  // quarters mix the house with the town set's cottage, longhouse and workshop (art critic pass 14), each dressed for its region
  [[100, 68, 'house', 1], [76, 19, 'cottage', 1], [88, 19, 'house', 1], [101, 19, 'longhouse', 1], [101, 31, 'housex', 2], [89, 32, 'workshopx', 1],
   [24, 70, 'housex', 2], [24, 82, 'cottagex', 1], [40, 97, 'workshop', 1], [24, 97, 'longhousex', 1]]
    .forEach(([x, y, t, n]) => put(o, B(t, n), x, y));
  // the town set's common things (art critic pass 14), each where it would be and none in the way: off the roads,
  // clear of the walk from the square to every door (test/town.test.mjs holds them to it)
  for (const [id, x, y] of [
    [B('standard'), 104, 73], [B('standard'), 104, 87],             // the town's colours either side of the high street, inside the gate
    ['lamppost_0', 88, 85], ['lamppost_0', 101, 85],                // lamps down the high street's south side (the braziers are the north's)
    [B('foodstand'), 40, 77], ['boxes_0', 47, 77],                  // a stall at the square's south-west edge, the smithy's delivery beside it
    ['table_0', 65, 63], ['bench_0', 43, 33],                       // the inn's table out front; a bench on the temple's forecourt
    ['handcart_0', 57, 44], [B('lanewell'), 70, 28], ['woodpile_0', 24, 62],   // by the shop; the north quarter's own well; a home's winter wood
    ['cart_90', 124, 70], ['cart_0', 153, 42], ['trough_0', 136, 60],   // outside: a cart off the road by the gate, one at the farm, the beasts' trough
  ]) put(o, id, x, y, 'rect', 0.1);
  if (R === 'vale') put(o, 'windmill_0', 122, 20, 'round', 0.2);     // the Vale's corn: a post mill by the north field
  for (const [x, y] of [[97, 75], [107, 75], [87, 75]]) putProp(o, 'brazier', x, y);
  for (const [id, x, y] of [['wheelbarrow', 96, 90], ['resource_lumber', 88, 96], ['barrel', 106, 70], ['crate_A_big', 92, 84]]) put(o, id, x, y, 'rect', 0);
  for (const [id, x, y] of [['oak_2', 20, 18], ['oak_3', 46, 16], ['autumn_3', 19, 36]]) put(o, id, x, y, 'round', 0.35);   // the churchyard's trees, behind the temple
  // trees among the houses of the back quarters (critic pass 11l: the reference's village stands among its trees;
  // ours stood in a clearing, its trees outside the walls). Up-screen of the square and never on it, so they frame
  // the services and hide nobody; a spot is left bare if anything is there.
  for (const [id, x, y] of [['birch_1', 60, 20], ['birch_1', 80, 30], ['autumn_2', 96, 44], ['birch_1', 22, 60], ['autumn_2', 36, 86]])
    if (fits(o, id, x, y, 0)) put(o, id, x, y, 'round', 0.35);
  // outside: farms on the fields (the Reach's: nothing grows in the ash, so its ore sheds and the slag tipped by them,
  // v1.126; the art pass, docs/art-critic-pass-reach.md, found Ashgate's outskirts the Vale's farms, beasts and wheat)
  const ASH = R === 'reach';
  if (ASH) { put(o, B('workshop'), 140, 34); put(o, B('workshopx'), 144, 104); }
  else if (SEA) { put(o, B('workshop'), 140, 64); put(o, B('workshopx'), 124, 64); put(o, B('longhousex'), 144, 104); }   // the bonded warehouses on the quay; the ropewalk's long shed
  else { put(o, B('farm'), 140, 34); put(o, B('farmx'), 144, 104); }

  // trees: orchards and gardens in the walls' front corners, woods beyond the back walls, the ring
  const inside = (x, y) => x > WX0 + 4 && x < WX1 - 4 && y > WY0 + 4 && y < WY1 - 4;
  scatter(o, rng, -20, -20, 160, 140, 9, (x, y) => {
    if (SEA && x > 116 && y < 70) return null;                    // (the harbour's beach and quay: nothing grows there)
    if (inside(x, y)) return y > 84 && x > 84 && rng() < 0.5 ? pick(rng, ['oak_2', 'autumn_3', 'oak_1']) : null;   // the gardens behind the south wall
    if (x > WX0 - 8 && x < WX1 + 22 && y > WY0 - 8 && y < WY1 + 8) return null;   // the walls' verge and the moat
    if (x + y < 60 || x < 0) return rng() < 0.7 ? pick(rng, TREE_CLUSTER) : pick(rng, TREE_SINGLE);
    const n = fbm(x * 0.05, y * 0.05, o.seed + 3);
    return n > 0.55 && rng() < 0.4 ? pick(rng, TREE_SINGLE) : rng() < 0.05 ? pick(rng, ROCKS) : null;
  });
  forestRing(o, rng, 10);
  bound(o, () => 'fence');                                         // the fields' fences first: the beasts graze round them
  { const fr = mulberry32(streamSeed(seed, 4417));                // the farms' beasts, the houses' doorsteps
    if (SEA) {   // the quay's cargo, the nets drying, the ropewalk's coils
      herd(o, fr, ['barrel', 'crate_A_small', 'crate_A_big'], 132, 60, 4, 4); herd(o, fr, ['crate_A_big', 'sack', 'barrel'], 176, 60, 4, 4);
      herd(o, fr, ['barrel', 'sack'], 154, 112, 3, 4);
    } else if (ASH) {   // the sheds' yards: slag tipped, ore in crates, the sacks and barrels of a working yard
      herd(o, fr, ['rock_C', 'rock_E', 'resource_stone'], 160, 34, 4, 6); herd(o, fr, ['rock_D', 'rock_C'], 142, 66, 4, 6);
      herd(o, fr, ['crate_A_small', 'barrel'], 136, 58, 2, 3); herd(o, fr, ['crate_A_big', 'sack', 'barrel'], 154, 52, 3, 4); herd(o, fr, ['resource_stone', 'rock_E'], 152, 116, 2, 3);
    } else {
      herd(o, fr, ['cow_1', 'cow_2', 'cow_3'], 160, 34, 4, 6); herd(o, fr, ['sheep_1', 'sheep_2'], 142, 66, 5, 6);
      herd(o, fr, ['hens_1'], 136, 58, 2, 3); herd(o, fr, ['hay_1', 'hay_2', 'pumpkins_1'], 154, 52, 3, 4); herd(o, fr, ['pumpkins_1', 'hay_1'], 152, 116, 2, 3);
    }
    dress(o, fr, (x, y) => hypot(x - o.hub.x, y - o.hub.y) < o.hub.r); }
  if (!ASH && !SEA) wheat(o);
  // the undergrowth: the walls' verges (in and out), the gardens, flower patches; never the square
  undergrowth(o, -10, -10, 150, 130, 3, (x, y) => {
    if (hypot(x - o.hub.x, y - o.hub.y) < o.hub.r + 4) return -1;
    const wall = Math.min(Math.abs(x - WX0), Math.abs(x - WX1), Math.abs(y - WY0), Math.abs(y - WY1));
    const inBox = x > WX0 - 9 && x < WX1 + 9 && y > WY0 - 9 && y < WY1 + 9;
    return Math.max(inBox && wall < 5 ? 0.5 : 0, x > 84 && y > 84 && x < WX1 && y < WY1 ? 0.5 : 0,
      fbm(x * 0.09, y * 0.09, o.seed + 9) > 0.66 ? 0.45 : 0);
  });
  o.exits.push({ x0: 146, y0: 66, x1: 160, y1: 94, to: 'overland', arrive: R === 'vale' ? 'thornwick' : info.name.toLowerCase() });   // (out at the region's own overland's gate: ashgate, frosthold)
  o.arrivals = { default: { x: M[0] + 0.5, y: M[1] + 6.5 }, overland: { x: 141.5, y: GY + 0.5 }, temple: { x: 38.5, y: 42.5 } };
  o.spawn = o.arrivals.default;
  return o;
}

// ── THE GREYWATER FENS (M8; world doc §3.2) — the overland north-east of the Vale ───────────────────────────────────
// Reed-choked marsh round a drowned imperial canal, ruled straight north to south. The road from the Vale comes in at
// the south-west (v1.146) to the Abbey road below the Locks; the canal road runs up its west bank to Saltmere, the
// stilt town in its mere, and south to the Canal Locks, where it crosses, and the Drowned Abbey in the canal's flood. Open ground is wet peat and reed (o.marsh), with meres of
// still bog water. The five sites (m8-plan slice 3) stand on the canal's banks and the meres' shores, each with its
// way in toward the camera (+y) where its road or causeway ends, its own water behind it.
export const FENS = { north: [60, -6], salt: [72, 60], mound: [34, 104], locks: [100, 128], lockhall: [76, 112], pools: [180, 96], abbey: [126, 206], reedholm: [202, 190], stones: [200, 40] };
// the old stones' clearing (camps.js fens_stones, the Kingstone's ground, GDD §19; the owner, 2026-11-15: "move the region
// boss further to the NE corner, and make sure the ground area is clear of trees - and no water or mini islands for players
// to get stuck on"): its fight's arena (REACH_WIDE + 4 = 25) and a margin, dry ground, no mere, no marsh, no tree
export const STONES_CLEAR = 32;
/** inside a land's clearing (o.clear: [x, y, r][]): no mere, marsh or tree there @param {any} o @param {number} x @param {number} y */
const inClear = (o, x, y) => !!o.clear && o.clear.some(([cx, cy, r]) => { const d = hypot(x - cx, y - cy);
  return d < r - CLEAR_WOB || (d < r + CLEAR_WOB && d < r + (fbm(x * 0.09, y * 0.09, o.seed + 53) - 0.5) * 2 * CLEAR_WOB); });   // (its edge wanders: a mere it cuts keeps a shore, not an arc)
const CLEAR_WOB = 4;
function buildFens(seed) {
  const o = makeWorld(seed, 'overland', 240, 240, 90), rng = mulberry32(streamSeed(seed, 4431)), B = (t, n = 1) => `fens_${t}_${n}`;
  o.name = 'The Greywater Fens'; o.region = 'fens'; o.marsh = true;
  const { north, salt, mound, locks, lockhall, pools, abbey, reedholm } = FENS;
  const VALE_ROAD = [[-30, 218], [20, 216], [52, 204], [78, 186], [93.5, 168]];   // (v1.146: the Vale lies south-west of the Fens on the wall map; the road used to come down from the north)
  // the canal: straight runs between the imperial works, wider where it broke its banks
  o.rivers.push({ w: 10, pts: [[104, -60], [103, 60], [101, locks[1]], [104, 180], [118, 200], [128, 230], [134, 320]] });
  // meres: Saltmere's, the Mound's (behind the island), the Sickpools' green water, the Abbey's flood round its walls;
  // and the fen's own, by the seed
  o.pools.push({ cx: salt[0] - 3, cy: salt[1] - 6, rx: 16, ry: 13 }, { cx: mound[0] - 12, cy: mound[1] - 10, rx: 17, ry: 12 },
    { cx: pools[0] + 4, cy: pools[1] - 16, rx: 15, ry: 9 }, { cx: abbey[0] + 2, cy: abbey[1] - 4, rx: 22, ry: 15 },
    { cx: salt[0] + 9, cy: salt[1] + 16, rx: 6, ry: 5 });   // (and the pool Wenna's punt waits in, at the jetty's end)
  const named = o.pools.length;
  const keepOut = [north, salt, mound, locks, lockhall, pools, abbey, reedholm];
  for (let i = 0; i < 26; i++) {
    const cx = rng() * 240, cy = rng() * 240, rx = 5 + rng() * 11, ry = 4 + rng() * 8;
    if (keepOut.some(([x, y]) => hypot(x - cx, y - cy) < 26 + rx) || Math.abs(cx - 103) < 16 + rx) continue;
    if (VALE_ROAD.some(([x, y]) => hypot(x - cx, y - cy) < 12 + rx)) continue;   // (v1.146: no mere across the road in from the Vale; after the draws, so the rest stay where they were)
    o.pools.push({ cx, cy, rx, ry });
  }
  const door = (p, dy = 12) => [p[0] + 1, p[1] + dy];                                                            // a site's way in, in front of it
  const ROADS = [
    { w: 5, surface: 'dirt', pts: [[north[0], -30], [north[0] + 2, 14], [salt[0] + 12, salt[1] - 20], [salt[0] + 20, salt[1] + 6], [92, 100], [locks[0] - 8, locks[1]]] },   // the canal road, down from the north past Saltmere to the Locks
    { w: 5, surface: 'dirt', pts: VALE_ROAD },   // (v1.146) the road from the Vale, in at the fen's south-west and up to the Abbey road, the Locks and Saltmere
    { w: 4, surface: 'deck', pts: [[salt[0] + 19, salt[1]], [salt[0] - 2, salt[1]]] },                                     // Saltmere's boardwalk, straight in off the canal road to its landing gate
    { w: 3, surface: 'deck', pts: [[salt[0] + 10, salt[1] + 1], [salt[0] + 10, salt[1] + 12]] },                            // (world doc v1.23) the jetty off it to Wenna Pike's punt: the Mere Tower
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
    for (const [id, x, y] of [[B('punt'), salt[0] + 8, salt[1] + 17], [B('punt'), salt[0] - 22, salt[1] - 8], [B('eeltrap'), salt[0] - 22, salt[1] + 4], [B('eeltrap'), salt[0] + 2, salt[1] + 10]]) put(o, id, x, y, 'rect', 0);
    // (Wenna Pike's ferry stage stood over the jetty's end, the way out to the Mere Tower, until 2026-11-15, the owner:
    // "put the Mere Tower entrance just on the main menu - like party up and arena. Move it off of the actual map": the
    // Tower is ☰'s now, core.js towerGo. The jetty and her punt stay, a landing's own.)
  }
  // the sites (world doc §3.2): the Toadking's island, the lock-keepers' hall by the gates, the vats, the Abbey in its
  // flood, Reedholm on its rise (the Undercroft's door in its chapel front, shut until the Fens set is whole)
  put(o, B('boathall'), mound[0], mound[1]); put(o, B('lockhall'), lockhall[0], lockhall[1]); put(o, B('vats'), pools[0], pools[1]);
  put(o, B('abbey'), abbey[0], abbey[1]); put(o, B('priory'), reedholm[0], reedholm[1]);
  for (const [id, x, y] of [[B('punt'), mound[0] - 14, mound[1] + 4], [B('eeltrap'), mound[0] - 18, mound[1] - 2], [B('punt'), abbey[0] + 16, abbey[1] + 10]]) put(o, id, x, y, 'rect', 0);
  o.labels.push({ x: salt[0] + 4, y: salt[1], id: B('landing'), text: 'Saltmere' },
    { x: mound[0], y: mound[1], id: B('boathall'), text: "Toadking's Mound", site: 'toadking_mound' }, { x: lockhall[0], y: lockhall[1], id: B('lockhall'), text: 'The Canal Locks', site: 'canal_locks' },
    { x: pools[0], y: pools[1], id: B('vats'), text: 'The Sickpools' }, { x: abbey[0], y: abbey[1], id: B('abbey'), text: 'The Drowned Abbey', site: 'drowned_abbey' },   // (v1.48: the Sickpools a landmark; their vats are the Canal Locks' third floor)
    { x: reedholm[0], y: reedholm[1], id: B('priory'), text: 'Reedholm' });
  // the fen's trees: alder carr and willows, low and dark, dead trees standing in the water's edge; never on a road
  // (v1.78, the owner: "Thin the Fens trees by 25% too": each on the land, and each willow at the water's edge, kept on a draw
  // of its own stream, as the Vale's (TREE_KEEP); the ring past the edge whole, the Fens' wall)
  const thinF = mulberry32(streamSeed(o.seed, 4439)), keepFen = () => thinF() < FENS_KEEP;
  // (fens critic pass 2: the Vale's birches and mixed groves read round and cheerful here; the same draws, the Fens' kinds)
  scatter(o, rng, -60, -60, 300, 300, 7, (x, y) => {
    if (keepOut.some(([kx, ky]) => hypot(x - kx, y - ky) < 18) || inFrontOf(keepOut, x, y, 26, 14)) return null;
    const n = fbm(x * 0.03, y * 0.03, o.seed + 41), out = Math.max(-x, x - 240, -y, y - 240);
    if (out > 0) return rng() < 0.8 ? pick(rng, ['carr_1', 'carr_2', 'dead_1', 'willow_1']) : null;
    // (level-design-rules.md §3.6, the foliage pass: the willows and the dead at the water's edge and off the marsh; a
    // thicket's alders and carr on the raised ground. The same draws as before, only the kind they come out as; the thicket at 0.67 of the noise, 0.61 before the pools' edges were planted: cover 23 %)
    const g = groundAt(o, x, y).g, edge = g !== G.MARSH && waterNear(o, x, y, 8);   // (8: a willow's crown is 7 across, and stands back from the water it leans over)
    const id = n > 0.67 ? pick(rng, edge ? ['willow_1', 'willow_2', 'alder_1', 'willow_2', 'dead_1'] : ['alder_1', 'alder_2', 'alder_3', 'carr_1', 'carr_2']) : rng() < (edge ? 0.12 : 0.05) ? pick(rng, ['dead_1', 'dead_2']) : null;
    return id && /willow|dead/.test(id) && !edge ? null : id && keepFen() ? id : null;
  });
  // (v1.146) the road from the Vale's verges: alder and carr either side every 7 tiles, as the Vale's canal road has its
  // oaks. No draws, so nothing else moves; they give back the cover the road and its drier ground took off the south-west
  { const pts = fillet(VALE_ROAD, 10);
    for (let i = 0, run = 0, next = 4; i + 1 < pts.length; i++) {
      const [ax, ay] = pts[i], [bx, by] = pts[i + 1], l = hypot(bx - ax, by - ay), nx = -(by - ay) / l, ny = (bx - ax) / l;
      for (; next < run + l; next += 7) for (const sd of [-11, 11]) {
        const t = next - run, id = ['alder_1', 'carr_2', 'alder_2', 'carr_1'][Math.floor(next / 7) % 4], x = ax + (bx - ax) * t / l + nx * sd, y = ay + (by - ay) * t / l + ny * sd;
        if (x > 2 && y < 236 && fits(o, id, x, y, -3) && offRoad(o, id, x, y) && !waterNear(o, x, y, 3)) put(o, id, x, y, 'round', 0.35);   // (crowns over the verge, never the road: the Vale's margin)
      }
      run += l;
    } }
  forestRing(o, rng, 6, FENS_CLUSTER, FENS_SINGLE);
  waterEdge(o, keepOut, keepFen);
  const ways = [mound, lockhall, pools, abbey, reedholm].map((p) => door(p, 8));
  undergrowth(o, -10, -10, 250, 250, 4, (x, y) => {
    if (keepOut.some(([kx, ky]) => hypot(x - kx, y - ky) < 12) || ways.some(([kx, ky]) => hypot(x - kx, y - ky) < 8)) return -1;
    return fbm(x * 0.08, y * 0.08, o.seed + 43) > 0.6 ? 0.5 : 0.08;
  });
  o.exits.push({ x0: -11, y0: 209, x1: -4, y1: 227, to: 'overland', region: 'vale', arrive: 'fens' });   // (v1.146) back down the road south-west to the Vale
  o.exits.push({ x0: north[0] - 8, y0: -11, x1: north[0] + 9, y1: -4, to: 'overland', closed: true, shut: 'The canal road runs on north to the Mere and Solmere. Another day.' });
  o.exits.push({ x0: salt[0] - 2, y0: salt[1] - 2, x1: salt[0] + 3.5, y1: salt[1] + 2, to: 'town', arrive: 'overland' });   // through the landing gate: into Saltmere
  // each site's door: a box in front of it (the Undercroft's is the low door in Reedholm's chapel front, left of centre)
  const SITE_AT = { toadking_mound: mound, canal_locks: lockhall, drowned_abbey: abbey, reedholm_undercroft: [reedholm[0] - 3, reedholm[1]] };   // (v1.48: the Sickpools have no door of their own)
  const DOOR_Y = { toadking_mound: 7, canal_locks: 5.5, drowned_abbey: 8.5, reedholm_undercroft: 7.5 };
  for (const [site, [x, y]] of Object.entries(SITE_AT)) o.exits.push({ x0: x - 2.5, y0: y + DOOR_Y[site], x1: x + 3.5, y1: y + DOOR_Y[site] + 3, to: 'dungeon', site });
  o.arrivals = { default: { x: salt[0] + 12.5, y: salt[1] + 0.5 }, saltmere: { x: salt[0] + 12.5, y: salt[1] + 0.5 }, vale_road: { x: 6.5, y: 217.5 } };   // on the boardwalk, facing the gate (and in from the Vale, at the fen's south-west: v1.146)
  for (const [site, [x, y]] of Object.entries(SITE_AT)) o.arrivals[site] = { x: x + 1.5, y: y + DOOR_Y[site] + 7.5 };
  o.spawn = o.arrivals.default;
  clearGround(o, FENS.stones[0], FENS.stones[1], STONES_CLEAR, named);   // (last: the rest of the fen as it was, tree for tree)
  return o;
}

// A clearing carved in a land already built (the Fens' old stones, the Kingstone's ground: the owner, 2026-11-15, "make
// sure the ground area is clear of trees - and no water or mini islands for players to get stuck on"). Every mere the
// seed laid that reaches into it runs dry, whole (cut, its shore would be an arc), and the willows and the dead that
// stood at its edge go with it; inside r the named meres' fringes and the marsh run dry too (groundAt reads o.clear), and
// every tree, rock and bush that reaches in is taken away. The grass and flowers walked through stay. Carved after the
// build, so nothing else on the map moves for it (a draw skipped while building shifts every tree after it).
const STANDS = /^(pine|oak|autumn|dead|grove|birch|alder|willow|carr|rock_|ug_bush)/;
function clearGround(o, cx, cy, r, named = o.pools.length) {
  (o.clear ||= []).push([cx, cy, r]);
  const meets = (p) => { if (hypot(p.cx - cx, p.cy - cy) < r) return true;
    for (let a = 0; a < 32; a++) if (hypot(p.cx + cos(a * Math.PI / 16) * p.rx * 1.3 - cx, p.cy + sin(a * Math.PI / 16) * p.ry * 1.3 - cy) < r + CLEAR_WOB) return true;   // (1.3: its reedy fringe)
    return false; };
  let x0 = cx - r - CLEAR_WOB - 2, y0 = cy - r - CLEAR_WOB - 2, x1 = cx + r + CLEAR_WOB + 2, y1 = cy + r + CLEAR_WOB + 2;
  for (let k = o.pools.length - 1; k >= named; k--) { const p = o.pools[k]; if (!meets(p)) continue;
    o.pools.splice(k, 1); x0 = Math.min(x0, p.cx - p.rx * 1.5 - 12); y0 = Math.min(y0, p.cy - p.ry * 1.5 - 12); x1 = Math.max(x1, p.cx + p.rx * 1.5 + 12); y1 = Math.max(y1, p.cy + p.ry * 1.5 + 12); }
  x0 = Math.max(x0, -6); y0 = Math.max(y0, -6); x1 = Math.min(x1, o.W + 6); y1 = Math.min(y1, o.H + 6);   // (inside the forest ring's hard edge, which stays as it is)
  const reach = (s) => { const [a, b, c, d] = footRect(s.id, s.x, s.y), dx = Math.max(a - cx, 0, cx - c), dy = Math.max(b - cy, 0, cy - d); return Math.sqrt(dx * dx + dy * dy); };
  const inBox = (s) => { const [a, b, c, d] = footRect(s.id, s.x, s.y); return c >= x0 - 1 && a <= x1 + 1 && d >= y0 - 1 && b <= y1 + 1; };
  for (let k = o.structs.length - 1; k >= 0; k--) { const s = o.structs[k];
    if (STANDS.test(s.id) && (reach(s) < r + CLEAR_WOB + 1.5 || (/willow|dead/.test(s.id) && inBox(s) && !waterNear(o, s.x, s.y, 9)))) o.structs.splice(k, 1); }   // (+1.5: a tile stamped round a footprint's edge; 9: the edge's own reach, test/biomes.test.mjs)
  // the ground in the box built again: its tiles as the land now lies, then what still stands on them stamped back (a
  // building, which none here is, kept as it was)
  const held = new Map();
  for (const s of o.structs) if (inBox(s) && !STANDS.test(s.id) && !/^ug_/.test(s.id)) { const [a, b, c, d] = footRect(s.id, s.x, s.y);
    for (let ty = Math.floor(b); ty <= Math.floor(d); ty++) for (let tx = Math.floor(a); tx <= Math.floor(c); tx++) { const i = gi(o, tx, ty); if (i >= 0) held.set(i, [o.blocked[i], o.occ[i]]); } }
  for (let ty = Math.floor(y0); ty <= y1; ty++) for (let tx = Math.floor(x0); tx <= x1; tx++) {
    const i = gi(o, tx, ty); if (i < 0) continue;
    const g = groundAt(o, tx + 0.5, ty + 0.5).g; o.tmat[i] = g;
    o.blocked[i] = g === G.WATER || g === G.POOL ? 1 : 0;
    o.occ[i] = g !== G.GRASS && g !== G.FIELD && g !== G.MARSH && g !== G.SCREE && g !== G.SNOW && g !== G.SAND ? 2 : 0;
  }
  for (const s of o.structs) if (inBox(s) && (STANDS.test(s.id) || /^ug_/.test(s.id))) stamp(o, s.id, s.x, s.y, STANDS.test(s.id) ? 'round' : 'none', 0.35);
  for (const [i, [b, q]] of held) { o.blocked[i] = b; o.occ[i] = q; }
}

// ── SALTMERE, the Fens' waystation (M8; docs/region-towns-proposal.md) ─────────────────────────────────────────
// No wall: the water is all round it. Stilt houses over the bog, boardwalks for streets, the square a deck on piles
// in the same place and shape as every town's, and (v1.95) the five services a town has: the Drowned Eel (with the Guild's board) and the
// Grey Sisters' chapel, on its own peat island, where a town's tavern and temple stand, and (2026-10-05, the owner:
// "Saltmere needs an inn for party mgt") the Stilt House over the square's head, where a company's sellswords wait.
// The well is a rainwater cistern: nobody drinks the fen.
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
  // (v1.44, the owner: "there should at least be a shop, and small tavern at these way stations… a reason to be there")
  // Pim Rushlight's chandlery stands on the deck right of the square, its door to the cistern, its own day's stock
  // (v1.95, the owner: "Add a smith in saltmere.. all services in Every town") Marrit Coyle's Tidewater Forge on the deck where a
  // town's smithy stands, two tiles down (8 clear of the chandlery), its door to the cistern: the five services, as a town's
  const svc = [['temple', B('temple'), [28, 24]], ['tavern', B('stilttavern'), [29, 48]], ['inn', B('stiltinn'), [49, 29]], ['shop', B('shop'), [62, 49]], ['smith', B('smith'), [51, 69]]];
  for (const [kind, id, [x, y]] of svc) { put(o, id, x, y); o.services.push({ kind, id, x, y, name: info[kind] }); o.labels.push({ x, y, id, text: info[kind], service: kind, top: WAY_SIGN_TOP[kind] }); }
  put(o, B('cistern'), M[0], M[1]);
  for (const [x, y] of [[41, 57], [52, 54], [80, 64], [61, 80]]) putProp(o, 'brazier', x, y);   // (the second off the chandlery's deck)
  o.hub = { x: 58, y: 58, r: 32, focus: { x: 60, y: 60 } };
  o.lead = { x0: 100, y0: GY - 10, x1: 146, y1: GY + 10, x: 100, y: GY, k: 0.5 };
  for (const [n, x, y] of [[1, 26, 76], [2, 88, 22], [3, 102, 68], [1, 40, 102], [2, 96, 96], [3, 62, 104], [1, 78, 18], [2, 110, 40]]) put(o, B('stilt', n), x, y);
  for (const [id, x, y] of [[B('punt'), 106, 92], [B('punt'), 30, 92], [B('punt'), 122, 68], [B('eeltrap'), 116, 92], [B('eeltrap'), 14, 64], [B('eeltrap'), 84, 112]]) put(o, id, x, y, 'rect', 0);
  for (const [id, x, y] of [['barrel', 84, 60], ['barrel', 85, 62], ['crate_A_big', 57, 75], ['sack', 58, 77]]) put(o, id, x, y, 'rect', 0);
  // the town set (art critic pass 14): on the peat, the Fens' one-storey homes on their short piles and a boat-builder's
  // shed by the north mere, each with its door to dry ground (on a face the camera sees: down-screen, so never south of the square); on the deck, an eel-stall, the colours where the boardwalk comes in, a lamp, the Eel's table
  for (const [id, x, y] of [[B('cottage'), 62, 28], [B('workshop'), 104, 17], [B('longhouse'), 23, 1]]) put(o, id, x, y);
  for (const [id, x, y] of [[B('foodstand'), 75, 60], [B('standard'), 88, 73], ['lamppost_0', 96, 73], ['table_0', 37, 58], ['boxes_0', 70, 47], ['handcart_0', 52, 77]])
    put(o, id, x, y, 'rect', 0.1);
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
// a road that leaves another starts on it as smoothed (the corner it left from was cut), with an apron at the join
function joinRoads(o, ROADS) {
  for (const r of ROADS) for (const end of [0, r.pts.length - 1]) {
    const [x, y] = r.pts[end];
    let best = null; for (const h of ROADS) if (h !== r) { const n = nearestOn(h.pts, x, y); if (n[2] < 6 && (!best || n[2] < best[0][2])) best = [n, h]; }
    if (!best) continue;
    r.pts[end] = [best[0][0], best[0][1]];
    if (!o.aprons.some((a) => hypot(a.x - best[0][0], a.y - best[0][1]) < 3)) o.aprons.push({ x: best[0][0], y: best[0][1], r: Math.max(r.w, best[1].w) / 2 + 1.5 });
  }
}
// The imperial roads' dead beacon-towers (world doc §3.6: one every day's march; the overland sketches draw one each
// 46 tiles from 30 in): a tower `side` tiles off the road's left-hand verge, where it fits. No draws.
function beacons(o, pts, id, side = 8, every = 46, first = 30) {
  for (let i = 0, run = 0, next = first; i + 1 < pts.length; i++) {
    const [ax, ay] = pts[i], [bx, by] = pts[i + 1], l = hypot(bx - ax, by - ay);
    for (; next < run + l; next += every) {
      const t = (next - run) / l, x = ax + (bx - ax) * t + (by - ay) / l * side, y = ay + (by - ay) * t - (bx - ax) / l * side;
      for (const k of [1, -1]) {                                   // (the left-hand verge, or the right where that's taken)
        const bx2 = x + (k - 1) * (by - ay) / l * side, by2 = y - (k - 1) * (bx - ax) / l * side;
        if (bx2 > 6 && by2 > 6 && bx2 < o.W - 6 && by2 < o.H - 6 && fits(o, id, bx2, by2, 0.5)) { put(o, id, bx2, by2, 'round', 0.1); break; }
      }
    }
    run += l;
  }
}
// x where a polyline crosses the line y (the first crossing; its last point's x if none)
function xAt(pts, y) {
  for (let i = 0; i + 1 < pts.length; i++) { const [ax, ay] = pts[i], [bx, by] = pts[i + 1]; if ((ay - y) * (by - y) <= 0 && ay !== by) return ax + (bx - ax) * (y - ay) / (by - ay); }
  return pts[pts.length - 1][0];
}
// The river's course: resampled every 3 tiles, pushed sideways by a slow meander (a 52-tile wavelength, ±4) and
// given a width that breathes (6.5–12.5), both eased to nothing near the pins (the bridges, the mill), where it
// runs as it always did. Its own stream for the phases (each land's river its own). Points carry their width: [x, y, w].
function meander(seed, pts, pins, stream = 4415) {
  const rng = mulberry32(streamSeed(seed, stream)), ph1 = rng() * 6.2832, ph2 = rng() * 6.2832, res = [];
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
  // the Haddow Crypt (v1.140; the owner: "put it in the vale"): the Haddows' chantry in the meadow east of the lumber
  // camp, the chapel's marsh beyond it, its door south onto a track off the camp road; the family's vault under it. 163
  // tiles from the gate, between the keep (4-6, 154) and the chapel (7-9, 183): a level-6 room. (By the crossroads, 127
  // out, it lay nearer than the Pens at 4; and the Vale's woods are at their floor, so it stands where no grove has to go)
  const crypt = [214, 190];
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
    { w: 3, surface: 'track', pts: [[182, 204], [196, 203], [crypt[0] - 0.5, crypt[1] + 12]] },                 // (v1.140) off the camp road to the Haddows' chantry door
    { w: 5, surface: 'dirt', fens: true, pts: [[244, 66], [258, 54], [266, 44], [300, 34]] },   // the canal road off the old road north-east, past the milestone and out at the Vale's north-east, to the Fens (M8; shut until Act I is done; v1.146: it left by the south-west, before the wall map was re-laid: docs/world-map-replan.md §5)
    { w: 5, surface: 'dirt', reach: true, pts: [[142, 66], [146, 46], [150, 22], [152, -16]] },   // the Wickham road north off the warren track, past the keep's west side, over the range to the Cinder Reach (v1.124; shut until Act II is done)
  ].map((r) => ({ ...r, pts: fillet(r.pts, Math.max(8, r.w * 2)) }));
  joinRoads(o, ROADS);
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
  put(o, B('temple'), crypt[0], crypt[1]);                        // the Haddows' chantry (v1.140), the family's vault under it
  putProp(o, 'brazier', crypt[0] + 4, crypt[1] + 11);           // a brazier at the chantry's step
  for (const [id, dx, dy] of [['grove_3', -20, -2], ['grove_5', 14, -20], ['pine_2', -12, -12], ['pine_5', 16, -6]]) put(o, id, warren[0] + dx, warren[1] + dy, 'round', 0.35);   // the range's foot is wooded either side of the scar
  put(o, B('farm'), 64, 114); put(o, 'wheelbarrow', 57, 128, 'rect', 0);
  for (const [id, x, y] of [['resource_lumber', camp[0] + 10, camp[1] + 4], ['stump', camp[0] - 16, camp[1] + 14], ['stump', camp[0] + 4, camp[1] + 14], ['flag_red', keep[0] - 14, keep[1] + 30]])
    put(o, id, x, y, 'rect', 0);
  putProp(o, 'stairs', barrows[0] + 1, barrows[1] + 7);           // just outside the barrow's door
  for (const [x, y] of [[barrows[0] + 10, barrows[1] - 2], [cross[0] + 4, cross[1] + 4], [town[0] + 9, town[1] - 5], [town[0] + 9, town[1] + 5]]) putProp(o, 'brazier', x, y);
  o.labels.push({ x: town[0] + 4, y: town[1], id: B('gatehousey'), text: 'Thornwick' }, { x: keep[0], y: keep[1], id: B('keep'), text: 'Wickham Keep', site: 'wickham_keep' }, { x: barrows[0], y: barrows[1], id: 'ruin', text: 'The Old Barrows', site: 'barrows' },
    { x: mill[0], y: mill[1], id: 'watermill_0', text: 'The Tithe Mill' }, { x: chapel[0], y: chapel[1], id: 'chapelruin_0', text: 'The Sunken Chapel', site: 'sunken_chapel' },   // (v1.48: the Tithe Mill a working mill again, a landmark)
    { x: stone[0], y: stone[1], id: 'milestone_0', text: 'The Ninth Milestone', site: 'ninth_milestone' },   // (v1.48: the Scrag Warren's adit is boarded up again: no label)
    { x: warren[0], y: warren[1], id: 'warren_0', text: 'The Proving Pens', site: 'proving_pens' },   // (v1.60: the adit's boards off again, for a trial: the bestiary's pens)
    { x: crypt[0], y: crypt[1], id: B('temple'), text: 'The Haddow Crypt', site: 'haddow_crypt' },   // (v1.140)
    { x: mine[0], y: mine[1], id: 'mine_0', text: 'Deepdelve Mine' }, { x: camp[0], y: camp[1], id: 'lumbermill_90', text: 'Lumber camp' });

  // THE RANGES (critic pass 10: mountains smaller than the keep, on a 15-tile lattice, 11 of them on the meadow).
  // North, past the map's edge: massifs on a spine, the great peaks (twice the keep's height) among smaller ones,
  // overlapping into one range. East, between the camera and the Vale, lower mountains further out. Between them
  // and the meadow a foothill belt: scree, the barrows' grey rocks, pines and dead trees. Nothing of a mountain on
  // the walked map. Their own stream: the sites and the town don't move.
  const mrng = mulberry32(streamSeed(seed, 4411)), F = (id) => ENV_FOOT[id] || [-10, -10, 10, 10];
  const MASSIF = ['mountain_massif_A', 'mountain_massif_B', 'mountain_massif_C'], SHOULDER = ['mountain_A', 'mountain_B', 'mountain_A_grass_trees', 'mountain_B_grass_trees', 'mountain_C_grass_trees'];
  const GORGE = [14, 52];                                              // where the river comes down out of the range
  const PASS = [138, 166];                                             // (v1.124) where the Wickham road goes over it: the same draws, nothing put in the pass
  const inPass = (x0, x1) => x1 > PASS[0] && x0 < PASS[1];
  for (let x = -90, i = 0; x < 360; i++) {
    const id = MASSIF[[2, 1, 0, 2, 1, 0, 1, 2][i % 8]], f = F(id);
    if (x < GORGE[1] && x + f[2] - f[0] > GORGE[0]) { x = GORGE[1]; continue; }
    const my = -12 - f[3] - mrng() * 14; if (!inPass(x, x + f[2] - f[0])) put(o, id, x - f[0], my, 'round', 0.3);
    x += (f[2] - f[0]) * (0.55 + mrng() * 0.2);
  }
  for (let x = -60; x < 330; x += 20 + mrng() * 14) { const id = pick(mrng, SHOULDER), f = F(id); if (x + f[2] > GORGE[0] && x + f[0] < GORGE[1]) continue; const sy = -6 - f[3] - mrng() * 6; if (!inPass(x + f[0], x + f[2])) put(o, id, x, sy, 'round', 0.35); }   // shoulders before the range
  const EAST_PASS = [16, 64];                                          // (v1.146) where the canal road goes out east: the same draws, nothing put across it
  for (let y = -40; y < 320; y += 20 + mrng() * 10) { const id = pick(mrng, SHOULDER), f = F(id), ex = 268 - f[0] + mrng() * 16; if (!(y + f[3] > EAST_PASS[0] && y + f[1] < EAST_PASS[1])) put(o, id, ex, y, 'round', 0.35); }   // the east: lower, further out
  // the owner, 2026-11-11: "Reduce the trees in Hollow Vale by 25%". Every tree on the land (the foothills, the woods,
  // the meadow clumps, the canal road's verges; not the forest ring past the edge, the Vale's wall) is kept on a draw
  // of its own stream, so the thinning moves nothing else: the trees left stand where they stood.
  const thinT = mulberry32(streamSeed(seed, 4419)), keepTree = () => thinT() < TREE_KEEP;
  const FOOT_ROCK = ['rock_A', 'rock_B', 'rock_C', 'rock_D', 'rock_E'];
  scatter(o, mrng, -60, -30, 330, 320, 5, (x, y) => {                // the foothills: thick at the range, thinning to the meadow
    const d = Math.min(Math.max(0, y + 12), Math.max(0, 270 - x)), belt = 1 - d / 18;
    if (belt <= 0 || mrng() > belt * 0.7) return null;
    const k = mrng();
    const id = k < 0.35 ? pick(mrng, FOOT_ROCK) : k < 0.75 ? pick(mrng, ['pine_1', 'pine_2', 'pine_3', 'pine_4', 'pine_5', 'pine_6']) : k < 0.9 ? pick(mrng, TREE_CLUSTER) : pick(mrng, ['dead_1', 'dead_2']);
    return k < 0.35 || keepTree() ? id : null;
  });

  // WOODS AND CLUMPS (pass 10: 42 trees on the walked map, 13 % of it within 8 tiles of a tree, a lumber camp in
  // the open). Woods where a wood belongs: the north-west, the slopes under the range, round the lumber camp, the
  // barrows' far side; then the old forest mask; then meadow trees in clumps of 2–4. Every site keeps its clearing
  // and its sightline (inFrontOf). Rocks mostly at the foothills now: 1 % on the meadow, not 5 %.
  const trng = mulberry32(streamSeed(seed, 4412)), sites = [keep, barrows, mine, camp, [60, 112], mill, chapel, stone, warren, crypt];
  const sights = [keep, barrows, mine, camp, cross, [town[0] + 4, town[1]], mill, chapel, stone, crypt];   // (the warren, dug into the range's foot, keeps a shorter one)
  const clear = (x, y, id) => {
    if (hypot(x - town[0] + 16, y - town[1]) < 40 || hypot(x - cross[0], y - cross[1]) < 18) return false;
    for (const c of sites) if (hypot(x - c[0], y - c[1]) < (c === camp || c === warren ? 16 : 24)) return false;
    for (const c of campsOf('vale')) if (hypot(x - c.x, y - c.y) < (/grove/.test(id) ? 16 : 10)) return false;   // a spawn point's fire and posts on open ground (camps.js; v1.71 the thinning let a grove in over the Spit's)
    return !inFrontOf(sights, x, y, /grove/.test(id) ? 80 : /rock/.test(id) ? 30 : 62, 32) && !inFrontOf([warren], x, y, 40, 26);   // (the adit's spoil and its wreckage reach wider than the old hole did)
  };
  const WOODS = [{ x: 30, y: 48, r: 30 }, { x: 74, y: 16, r: 24 }, { x: 212, y: 24, r: 22 }, { x: 236, y: 182, r: 26 }, { x: 24, y: 240, r: 22 }, { x: 240, y: 104, r: 16 }, { x: 54, y: 252, r: 14 }];   // (v1.146: the last, the south-west wood closing over where the canal road ran before it went north-east)
  // a wood's crowns close over each other (groves overlap there, as the range's massifs do); its edge thins to singles
  for (let y = -80; y < 350; y += 6) for (let x = -80; x < 350; x += 6) {
    const jx = x + (trng() - 0.5) * 5.4, jy = y + (trng() - 0.5) * 5.4;
    let wood = 0; for (const w of WOODS) wood = Math.max(wood, 1 - hypot(jx - w.x, jy - w.y) / w.r);
    const f = fbm(jx * 0.022, jy * 0.022, o.seed + 7), core = wood > 0.4 || f > 0.6;
    const id = core ? (trng() < 0.7 ? pick(trng, TREE_CLUSTER) : pick(trng, TREE_SINGLE)) : (wood > 0 || f > 0.52) && trng() < 0.45 ? pick(trng, TREE_SINGLE) : null;
    if (!id || !keepTree()) continue;
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
      if (keepTree() && clear(tx, ty, id) && fits(o, id, tx, ty, 0.6)) put(o, id, tx, ty, 'round', 0.35);
    }
  }
  // the canal road's verges: oaks either side every 6 tiles, crowns closing over the wood's edge where it meets the
  // road. No draws, so nothing else moves; they give back the cover the road took out of the south-west wood.
  { const pts = ROADS.find((r) => r.fens).pts;
    for (let i = 0, run = 0, next = 3.5; i + 1 < pts.length; i++) {
      const [ax, ay] = pts[i], [bx, by] = pts[i + 1], l = hypot(bx - ax, by - ay), nx = -(by - ay) / l, ny = (bx - ax) / l;
      for (; next < run + l; next += 6) for (const s of [-11, 11]) {
        const t = next - run, id = Math.floor(next / 6) % 3 ? 'oak_1' : 'autumn_2', x = ax + (bx - ax) * t / l + nx * s, y = ay + (by - ay) * t / l + ny * s;
        if (x < 258 && y < 258 && keepTree() && clear(x, y, id) && fits(o, id, x, y, -3) && offRoad(o, id, x, y)) put(o, id, x, y, 'round', 0.35);
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
    for (const c of [keep, barrows, mine, camp, cross, [town[0] + 4, town[1]], mill, chapel, stone, warren, crypt]) if (hypot(x - c[0], y - c[1]) < 14) return -1;
    let wood = 0; for (const w of WOODS) wood = Math.max(wood, 1 - hypot(x - w.x, y - w.y) / w.r);
    const f = fbm(x * 0.022, y * 0.022, o.seed + 7);
    return nearWater(x, y) ? 0.55 : (f > 0.5 && f < 0.6) || (wood > 0 && wood < 0.35) ? 0.4 : fbm(x * 0.08, y * 0.08, o.seed + 13) > 0.68 ? 0.45 : 0;
  });

  o.exits.push({ x0: town[0] - 6, y0: town[1] - 4, x1: town[0] + 7, y1: town[1] + 4, to: 'town', arrive: 'overland' });   // (out to the gate's mouth: a walk up to the gate goes in; it began 3 tiles inside it)
  // walk into the barrow's doorway (around the glowing stairs) to go down into the dungeon
  o.exits.push({ x0: barrows[0] - 2, y0: barrows[1] + 6, x1: barrows[0] + 4, y1: barrows[1] + 9, to: 'dungeon', site: 'barrows' });
  // the other sites' ways in (M5, sites.js): the keep's door, the chapel's door across the pools, a slab at the milestone's
  // foot. A hidden site's stays shut until it's revealed (core.js). (v1.48: the mill and the warren have none: one
  // dungeon a level, and those two went to the Reach.)
  o.exits.push({ x0: keep[0] - 3, y0: keep[1] + 6.5, x1: keep[0] + 3, y1: keep[1] + 9.5, to: 'dungeon', site: 'wickham_keep' });   // the keep's own door (the owner removed its curtain wall)
  o.exits.push({ x0: chapel[0] - 2, y0: chapel[1] + 11, x1: chapel[0] + 4, y1: chapel[1] + 14, to: 'dungeon', site: 'sunken_chapel' });
  o.exits.push({ x0: stone[0] - 2, y0: stone[1] + 4, x1: stone[0] + 3, y1: stone[1] + 7, to: 'dungeon', site: 'ninth_milestone' });
  o.exits.push({ x0: warren[0], y0: warren[1] + 6, x1: warren[0] + 5, y1: warren[1] + 9, to: 'dungeon', site: 'proving_pens' });   // (v1.60) the adit's mouth, where the track ends
  o.exits.push({ x0: crypt[0] - 3, y0: crypt[1] + 7.5, x1: crypt[0] + 2, y1: crypt[1] + 10, to: 'dungeon', site: 'haddow_crypt' });   // (v1.140) the chantry's door, on its +y face: the stair down to the vault
  o.arrivals = { default: { x: town[0] + 30.5, y: town[1] + 0.5 }, thornwick: { x: town[0] + 30.5, y: town[1] + 0.5 }, barrows: { x: barrows[0] + 1.5, y: barrows[1] + 13.5 },
    tithe_mill: { x: mill[0] - 0.5, y: mill[1] + 15.5 }, wickham_keep: { x: keep[0] + 0.5, y: keep[1] + 27.5 }, sunken_chapel: { x: chapel[0] + 1.5, y: chapel[1] + 19.5 }, ninth_milestone: { x: stone[0] + 0.5, y: stone[1] + 11.5 },
    scrag_warren: { x: warren[0] + 4, y: warren[1] + 13.5 }, proving_pens: { x: warren[0] + 2.5, y: warren[1] + 13.5 }, haddow_crypt: { x: crypt[0] - 0.5, y: crypt[1] + 14.5 }, fens: { x: 255.5, y: 57.5 }, reach: { x: 151.5, y: 4.5 } };
  // the canal road leaves the Vale at its north-east, for the Fens (regions.js; v1.146: the wall map's way, the Fens
  // north-east of the Vale); shut, with a word, until Act I is done
  o.exits.push({ x0: 263, y0: 34, x1: 271, y1: 54, to: 'overland', region: 'fens', arrive: 'vale_road',
    shut: "The canal road's under water past the milestone. Sister Ilse says there's a way through, when you've a reason to go." });
  // the Wickham road leaves at its north edge over the range, for the Cinder Reach (v1.124); shut, with a word, until Act II is done
  o.exits.push({ x0: 143, y0: -11, x1: 162, y1: -4, to: 'overland', region: 'reach', arrive: 'vale_road',
    shut: 'The Wickham road goes north over the range to the Cinder Reach. Not yet: Sister Ilse has the Abbey\'s ledger to read first.' });
  o.spawn = o.arrivals.default;
  return o;
}

// ── THE CINDER REACH (world doc §3.3, v1.34; docs/reach-heights-overlands.md) — the overland around Ashgate ─────
// Laid out on the sketch (tools/worldmap/overlands.mjs `reach`, docs/img/world/overland-reach.jpg), 260 × 260, north
// up. Three imperial roads meet at Ashgate's east gate: the Wickham road up from the Vale, the Kell road west round the
// north wall to Kell's Rest under the dead volcano, the Solmere road east over the Ashwater's bridge, a dead
// beacon-tower beside each every day's march. Tracks to the sites. A land since v1.124 (regions.js `reach`, open when
// Act II is done): the Wickham road down to the Vale, and the sites' doors as their bands are built (the Cold Seam's
// first; the rest still landmarks). The Solmere road stays shut, with its word. Its own streams: 4441 (the scatter), 4443 (the hills), 4445 (the river).
export const REACH = { gate: [132, 140], join: [152, 140], kells: [38, 104], yards: [64, 132], works: [176, 64], vault: [168, 30], ninth: [64, 30],
  tunnels: [74, 192], seam: [122, 212], forge: [194, 146], volcano: [14, 64], tailings: [[148, 90, 9, 7], [222, 76, 8, 6]],
  // the Shuttered Inn (v1.138; the owner: "close to town in the overworld near ashgate"): a roadside inn across the Kell
  // road from Ashgate's north wall, its door south (the inn piece's) onto the road. (East of the gate it stood in the
  // Forgehall's line from the camera, the keep's name over its door)
  inn: [122, 88] };
function buildReach(seed) {
  const o = makeWorld(seed, 'overland', 260, 260, 90), rng = mulberry32(streamSeed(seed, 4441)), B = (t, n = 1) => `reach_${t}_${n}`;
  o.name = 'The Cinder Reach'; o.region = 'reach';
  const { gate, join, kells, yards, works, vault, ninth, tunnels, seam, forge, volcano, tailings, inn } = REACH, town = [gate[0] - 4, gate[1]];
  o.patches = [{ g: G.SCREE, f: 0.05, s: 51, th: 0.58 }];   // cracked earth and red rock through the ash-dusted scrub
  // the Ashwater: down out of the north past the Cinderworks, straight (+y) under the Solmere road's bridge, out east
  const riverPts = chaikin([[180, -60], [182, 0], [194, 50], [206, 100], [216, 140], [222, 160], [224, 172], [224, 186], [230, 204], [250, 220], [300, 250], [340, 280]], 3);
  const BRIDGE = [xAt(riverPts, 179), 179];
  o.rivers.push({ w: 8, pts: meander(seed, riverPts, [BRIDGE, [196, 60]], 4445) });
  for (const [cx, cy, rx, ry] of tailings) o.pools.push({ cx, cy, rx, ry });   // the works' tailings ponds (painted rust: outdoorpaint.js)
  const door = (p, dy) => [p[0] + 1, p[1] + dy];
  const ROADS = [
    { w: 6, surface: 'dirt', imperial: true, pts: [town, join, [BRIDGE[0] - 14, BRIDGE[1]], [BRIDGE[0] + 14, BRIDGE[1]], [300, 196]] },   // the gate road, on east as the Solmere road over the bridge
    { w: 6, surface: 'dirt', imperial: true, pts: [[146, 276], join] },                                              // the Wickham road, up from the Vale
    { w: 6, surface: 'dirt', imperial: true, pts: [join, [join[0], 102], [64, 102], [kells[0] + 12, kells[1]]] },   // the Kell road, round the north wall
    { w: 4, surface: 'track', pts: [[join[0], 120], [168, 90], [works[0] - 1, works[1] + 10]] },                     // up to the Cinderworks
    { w: 3, surface: 'track', pts: [[works[0] - 6, works[1] + 6], [166, 50], door(vault, 9)] },                      // on up to the Magma Vault's mouth, under Furnace Nine
    { w: 3, surface: 'track', pts: [[166, 46], [158, 36], [152, 30]] },                                                // (v1.126) to the furnace yard beside it, Furnace Nine's ground (camps.js reach_mouth)
    { w: 3, surface: 'track', pts: [[150, 182], [108, 188], [82, 212], [tunnels[0] + 2.5, tunnels[1] + 8]] },        // west to the Slag Tunnels' adit, up to its mouth from below
    { w: 3, surface: 'track', pts: [[148, 226], [132, 230], [seam[0] - 6, seam[1] + 12]] },                          // to the Cold Seam's pithead
    { w: 3, surface: 'track', pts: [[190, 165], [forge[0] + 0.5, forge[1] + 8]] },                                   // to the Forgehall's door
    { w: 3, surface: 'track', pts: [[76, 102], [76, 122], [76, 134], [yards[0] + 0.5, yards[1] + 5]] },   // into the Assay Yards, to the counting house's door
    { w: 2.5, surface: 'track', pts: [[kells[0], kells[1] - 6], [48, 82], [58, 56], door(ninth, 12)] },          // the old track up the volcano's flank (the Ninth Vault's), to its door
    { w: 3, surface: 'track', pts: [[inn[0] + 1.5, 101], [inn[0] + 1.5, inn[1] + 8]] },                               // (v1.138) off the Kell road to the Shuttered Inn's door
  ].map((r) => ({ ...r, pts: fillet(r.pts, Math.max(8, r.w * 2)) }));
  joinRoads(o, ROADS);
  o.roads.push(...ROADS);
  o.aprons.push({ x: kells[0] + 2, y: kells[1] + 4, r: 7 });                                                       // Kell's Rest's yard, packed earth
  finalizeGround(o);
  put(o, 'bridge_90', BRIDGE[0], BRIDGE[1], 'deck');
  // Ashgate from outside: its slag-brick circuit in small, the gate on its road, the temple and roofs inside (the town
  // scene's gate is east, as here)
  { const X0 = 98, X1 = gate[0], Y0 = 114, Y1 = 166, GY = gate[1];   // (each half of the east wall a curtain piece long, so neither runs into the gate)
    for (const [id, x, y] of [[B('temple'), 108, 124], [B('house', 1), 122, 124], [B('housex', 1), 106, 154], [B('house', 2), 121, 156], [B('smith'), 112, 140], [B('workshop'), 122, 140]]) put(o, id, x, y);
    putWall(o, B('curtain'), true, Y0, X0, X1); putWall(o, B('curtain'), true, Y1, X0, X1); putWall(o, B('curtainy'), false, X0, Y0, Y1);
    putWall(o, B('curtainy'), false, X1, Y0, GY - 7); putWall(o, B('curtainy'), false, X1, GY + 7, Y1);
    for (const [x, y] of [[X0, Y0], [X1, Y0], [X0, Y1], [X1, Y1], [(X0 + X1) / 2, Y0], [(X0 + X1) / 2, Y1], [X0, GY]]) put(o, B('tower'), x, y, 'round', 0.1);
    putGate(o, B('gatehousey'), X1, GY);
    put(o, B('standard'), X1 + 4, GY - 5, 'rect', 0.1); put(o, B('standard'), X1 + 4, GY + 5, 'rect', 0.1); }
  // Kell's Rest (a place on the land, not a town: GDD v1.132, world doc v1.57): the Assay's depot round its yard, the bunk
  // huts in front, the end of the Kell road between the depot's colours; its people are met at the Yards' gate (npcs.js)
  put(o, B('standard'), kells[0] + 7, kells[1] - 4.5, 'rect', 0.1); put(o, B('standard'), kells[0] + 7, kells[1] + 4.5, 'rect', 0.1);
  for (const [id, x, y] of [[B('longhouse'), kells[0] - 10, kells[1] - 8], [B('house', 3), kells[0] + 10, kells[1] - 9], [B('cottage'), kells[0] - 10, kells[1] + 8],
    [B('workshopx'), kells[0] + 6, kells[1] + 14]]) put(o, id, x, y);
  put(o, B('lanewell'), kells[0] + 2, kells[1] + 3, 'rect', 0.1);
  // the Assay Yards: the counting house and the ore shed in their fence, the weigh-house's crates at the gate
  put(o, B('longhouse'), yards[0], yards[1] - 3); put(o, B('workshop'), yards[0] - 4, yards[1] + 9);
  for (const x of [yards[0] - 8, yards[0] + 4]) putRun(o, 'fence_90', x, yards[1] - 9);              // (the gate in it east, where the track comes in)
  for (const y of [yards[1] - 3, yards[1] + 9]) putRun(o, 'fence_0', yards[0] - 14, y);
  for (const [id, x, y] of [['crate_A_big', yards[0] + 9, yards[1] + 9], ['crate_A_small', yards[0] + 10, yards[1] + 11], ['resource_stone', yards[0] + 4, yards[1] + 12], ['cart_0', yards[0] - 10, yards[1] - 6]]) put(o, id, x, y, 'rect', 0.1);
  // the Cinderworks: the furnace hall open to its yard, two stacks, the ore shed; Furnace Nine's stack over the Vault's
  // mouth; the Slag Tunnels' adit; the Cold Seam's pithead; the Forgehall of Oruth; the Ninth Vault's ruin, unnamed
  put(o, B('smith'), works[0], works[1]); put(o, B('workshopx'), works[0] - 13, works[1] + 2); put(o, B('tower'), works[0] + 9, works[1] - 7, 'round', 0.1); put(o, B('tower'), works[0] - 5, works[1] - 11, 'round', 0.1);
  for (const [id, x, y] of [['wagon_0', works[0] + 8, works[1] + 9], ['resource_stone', works[0] - 9, works[1] + 10], ['crate_B_big', works[0] + 12, works[1] + 4]]) put(o, id, x, y, 'rect', 0.1);
  put(o, 'ruin', vault[0], vault[1], 'round', 0.3); put(o, B('tower'), vault[0] + 10, vault[1] - 6, 'round', 0.1);
  put(o, 'warren_0', tunnels[0], tunnels[1]); put(o, 'mine_0', seam[0], seam[1]); put(o, B('keep'), forge[0], forge[1]);
  put(o, 'chapelruin_0', ninth[0], ninth[1]);
  // the Shuttered Inn: Ashgate's own build of tavern, shut, a barrel and a crate stack by its door (v1.138)
  put(o, B('inn'), inn[0], inn[1]);
  for (const [id, x, y] of [['barrel', inn[0] + 7, inn[1] + 7], ['crate_A_small', inn[0] - 4, inn[1] + 7]]) put(o, id, x, y, 'rect', 0.1);
  o.labels.push({ x: gate[0], y: gate[1], id: B('gatehousey'), text: 'Ashgate' }, { x: kells[0], y: kells[1], id: B('longhouse'), text: "Kell's Rest" },
    { x: yards[0], y: yards[1], id: B('longhouse'), text: 'The Assay Yards' }, { x: works[0], y: works[1], id: B('smith'), text: 'The Cinderworks' },
    { x: vault[0], y: vault[1], id: 'ruin', text: 'The Magma Vault' }, { x: tunnels[0], y: tunnels[1], id: 'warren_0', text: 'The Slag Tunnels' },
    { x: seam[0], y: seam[1], id: 'mine_0', text: 'The Cold Seam' }, { x: forge[0], y: forge[1], id: B('keep'), text: 'The Forgehall, walled up' },
    { x: inn[0], y: inn[1], id: B('inn'), text: 'The Shuttered Inn' });
  for (const r of ROADS) if (r.imperial) beacons(o, r.pts, B('tower'));

  // THE HILLS (their own stream): the dead volcano over Kell's Rest; the black slag hills north-west, as the sketch
  // has them; a range past the north and west edges; the low hills round the Slag Tunnels
  const mrng = mulberry32(streamSeed(seed, 4443)), F = (id) => ENV_FOOT[id] || [-10, -10, 10, 10];
  put(o, 'mountain_massif_C', volcano[0], volcano[1], 'round', 0.3);
  const keepOut = [gate, kells, yards, works, vault, ninth, tunnels, seam, forge, inn, ...campsOf('reach').map((c) => [c.x, c.y])];   // (and the spawn points' ground, v1.126)
  const sights = [[gate[0], gate[1]], [join[0] - 5, join[1]], kells, yards, works, vault, tunnels, seam, forge, inn];   // (and where you arrive)
  // (and a region boss's ground, the Vault's mouth, open over its whole arena as the Fens' old stones are: Furnace Nine's
  // fight at 70 % open ground, the ruin and the works' heaps in it, wiped five companies in one window of three; v1.126)
  const ring = campsOf('reach').find((c) => c.ring), inRing = (x, y, m = 2) => !!ring && hypot(x - ring.x, y - ring.y) < ring.arena + m;
  const clear = (x, y, r = 18) => !keepOut.some(([kx, ky]) => hypot(x - kx, y - ky) < r) && !inFrontOf(sights, x, y, 40, 22) && !inRing(x, y);
  for (const [x, y] of [[40, 30], [86, 36], [106, 54], [118, 22], [28, 6], [62, 4], [92, 8], [80, 66], [140, 30], [36, 182], [58, 200], [100, 204], [30, 224]]) {
    const id = mrng() < 0.5 ? 'mountain_A' : 'mountain_B', jx = x + (mrng() - 0.5) * 6, jy = y + (mrng() - 0.5) * 6;
    if (clear(jx, jy, 20) && !inFrontOf(sights, jx, jy, 72, 28) && fits(o, id, jx, jy, -1)) put(o, id, jx, jy, 'round', 0.35);   // (a hill is tall: a deeper wedge)
  }
  for (let x = -90, i = 0; x < 360; i++) { const id = ['mountain_massif_A', 'mountain_massif_B', 'mountain_massif_C'][i % 3], f = F(id); put(o, id, x - f[0], -14 - f[3] - mrng() * 12, 'round', 0.3); x += (f[2] - f[0]) * (0.6 + mrng() * 0.2); }
  for (let y = -20; y < 330; ) { const id = pick(mrng, ['mountain_A', 'mountain_B', 'mountain_massif_C']), f = F(id); put(o, id, -12 - f[2] - mrng() * 10, y - f[1], 'round', 0.35); y += (f[3] - f[1]) * (0.7 + mrng() * 0.2); }
  // THE SCATTER: slag heaps round the works, red rock outcrops and their rubble everywhere, dead trees, pines on the
  // hills' feet; never on a road, a site or its sightline
  const HEAP = ['rock_C', 'rock_E', 'rock_D', 'rock_C', 'resource_stone'], RED = ['rock_A', 'rock_B', 'rock_C', 'rock_D', 'rock_E', 'rock_B'];   // (the barrows' bare stone: the nature pack's rock_F–H are mossy)
  scatter(o, rng, -60, -60, 320, 320, 6, (x, y) => {
    const out = Math.max(-x, x - 260, -y, y - 260);
    if (out > 0) return rng() < 0.55 ? pick(rng, ['rock_E', 'rock_C', 'dead_1', 'dead_2', 'rock_D']) : null;
    if (!clear(x, y, 14)) return null;
    if (x > 140 && x < 220 && y > 30 && y < 104 && rng() < 0.35) return pick(rng, HEAP);           // the works' heaps
    const n = fbm(x * 0.04, y * 0.04, o.seed + 61), hill = y < 70 && x < 140;
    if (n > 0.6 || (hill && rng() < 0.2)) { const id = rng() < 0.6 ? pick(rng, RED) : hill ? pick(rng, ['pine_2', 'pine_4', 'dead_2']) : pick(rng, ['dead_1', 'dead_2']);
      return /pine/.test(id) && groundAt(o, x, y).g === G.SCREE ? 'rock_B' : id; }   // (§3.6: the pines on the hills' feet, none on scree: its red rock there)
    return rng() < 0.03 ? pick(rng, RED) : null;
  });
  forestRing(o, rng, 6, ['rock_E', 'rock_C', 'dead_1', 'rock_D'], ['dead_1', 'dead_2', 'rock_A', 'rock_B']);
  undergrowth(o, -10, -10, 270, 270, 5, (x, y) => (keepOut.some(([kx, ky]) => hypot(x - kx, y - ky) < 12) || inRing(x, y, 0) ? -1 : fbm(x * 0.07, y * 0.07, o.seed + 63) > 0.62 ? 0.4 : 0.05),
    { low: ['ug_grass_1', 'ug_grass_2'], solid: ['rock_A', 'rock_B'], foot: ['ug_grass_2'] });

  o.exits.push({ x0: gate[0] - 8, y0: gate[1] - 4, x1: gate[0] - 1, y1: gate[1] + 4, to: 'town', arrive: 'overland' });
  // the roads out: shut, each with its word (the Reach isn't joined to the other lands yet)
  o.exits.push({ x0: 138, y0: 263, x1: 155, y1: 271, to: 'overland', region: 'vale', arrive: 'reach' });   // (v1.124) down the Wickham road, home to the Vale
  // the sites' doors (v1.124): the Cold Seam's pithead, where its track ends
  o.exits.push({ x0: seam[0] - 9, y0: seam[1] + 10, x1: seam[0] - 3, y1: seam[1] + 13, to: 'dungeon', site: 'cold_seam' });
  // (v1.126) the rest of Act III's: the Yards' gate where the track comes in, the Forgehall's door, the Cinderworks'
  // yard under its stacks (the Magma Vault is its second floor: the mouth up the track is Furnace Nine's, ring.js), and
  // the Ninth Vault's ruin up the volcano's flank, shut until the Chronicle's reach set finds it (sites.js siteOpen)
  // (each at its building's door, the middle of the +y face its kit piece's door is on: convert.js SITE_DOORS, buildkit.js
  // assayhouse / forgedoor / ninthdoor; the works' furnace hall is the smithy's. Before, beside them: the Yards' 6 east of
  // its door, the Ninth Vault's inside its ruin's footprint; the owner, 2026-11-16, "do 3")
  o.exits.push({ x0: yards[0] - 3, y0: yards[1] + 0.5, x1: yards[0] + 3, y1: yards[1] + 3.5, to: 'dungeon', site: 'assay_yards' });   // (the counting house stands 3 north of yards)
  // (v1.144) the Forgehall's great doors are walled: the Assay cut in to it from the works, the Cinderworks' first floor
  o.exits.push({ x0: works[0] - 3, y0: works[1] + 5.5, x1: works[0] + 3, y1: works[1] + 8.5, to: 'dungeon', site: 'cinderworks' });
  o.exits.push({ x0: ninth[0] - 3, y0: ninth[1] + 8.5, x1: ninth[0] + 3, y1: ninth[1] + 11.5, to: 'dungeon', site: 'ninth_vault' });
  o.exits.push({ x0: inn[0] - 1.5, y0: inn[1] + 5.5, x1: inn[0] + 4.5, y1: inn[1] + 8.5, to: 'dungeon', site: 'shuttered_inn' });   // (v1.138) the inn's door, on its +y face
  // (v1.148) the Solmere road east: through the dead capital (not a land you walk) and up the Sol to the Pale Heights,
  // open once Act III is done, the vessel a day ahead on it
  // (v1.150) into Solmere, the crossroads: on to the Tidemark or up the Sol to the Heights, whichever is open (core.js)
  o.exits.push({ x0: 263, y0: 180, x1: 271, y1: 198, to: 'solmere',
    shut: 'The Solmere road runs east, straight as the day it was laid, to the dead capital. Not yet: the night shift is still down under the Cinderworks.' });
  o.arrivals = { default: { x: join[0] - 4.5, y: gate[1] + 0.5 }, ashgate: { x: join[0] - 4.5, y: gate[1] + 0.5 }, heights: { x: 256.5, y: 189.5 }, solmere: { x: 256.5, y: 189.5 }, kells_rest: { x: kells[0] + 10.5, y: kells[1] + 4.5 },
    vale_road: { x: 146.5, y: 255.5 }, cold_seam: { x: seam[0] - 5.5, y: seam[1] + 17.5 },
    assay_yards: { x: yards[0] + 6.5, y: yards[1] + 4.5 },   // (east of the workshop, which hid one arriving at the door: visibility.mjs)
    cinderworks: { x: works[0] + 0.5, y: works[1] + 12.5 },
    ninth_vault: { x: ninth[0] + 0.5, y: ninth[1] + 15.5 }, shuttered_inn: { x: inn[0] + 1.5, y: inn[1] + 12.5 } };
  o.spawn = o.arrivals.default;
  // Furnace Nine's yard (camps.js reach_mouth): slag heaps round its arena, a gap south for the way in and at the Vault's
  // mouth. Last, so nothing placed before moves; each walled as our kit's heap (DRAWN_FOOT), off the roads. (The converter
  // stood them on its own, walled by nothing: docs/pathing-audit.md)
  for (const [x, y] of furnaceHeaps()) {
    const k = DRAWN_FOOT.reach_slagheap; let road = false;
    for (let ty = Math.floor(y + k[1]); ty <= y + k[3] && !road; ty++) for (let tx = Math.floor(x + k[0]); tx <= x + k[2]; tx++) { const i = gi(o, tx, ty); if (i < 0 || o.occ[i] === 2) { road = true; break; } }
    if (!road) { o.structs.push({ id: 'reach_slagheap', x, y }); stamp(o, 'reach_slagheap', x, y, 'round', 0.15, k); }
  }
  return o;
}
/** the slag heaps round Furnace Nine's yard: [x, y][] (20 round its arena's rim, the south and the Vault's mouth left open) */
export function furnaceHeaps() {
  const camp = CAMP_BY.reach_mouth, out = [], N = 20; if (!camp) return out;
  const rim = camp.arena + 1;
  for (let k = 0; k < N; k++) {
    const a = (k / N) * Math.PI * 2 + 0.2, x = camp.x + cos(a) * rim, y = camp.y + sin(a) * rim;
    if (sin(a) > 0.94 || hypot(x - REACH.vault[0], y - REACH.vault[1]) < 10) continue;
    out.push([x, y]);
  }
  return out;
}

// ── THE PALE HEIGHTS (world doc §3.4, v1.34; docs/reach-heights-overlands.md) — the overland around Frosthold ───
// On the sketch (tools/worldmap/overlands.mjs `heights`, docs/img/world/overland-heights.jpg), 260 × 260, north up.
// The imperial road comes up the frozen Sol to the Frozen Hospice; the pass road runs from it over the Sol's bridge
// and north-west to Frosthold's one wall in its pass (the gate east, as the town scene's); the Pilgrims' Stair climbs
// in switchbacks to the Lip, the one break in the crater's rim; the crater's floor is glass, the Throne half-sunk in
// it. (v1.148) A land you walk once Act III is done, up the Sol from the Reach's Solmere road; its sites have no doors
// yet (the Heights' dungeons aren't built), its spawn points and the First Pilgrim at the Lip are its fights. Its own streams: 4442 (the scatter), 4444 (the peaks).
export const HEIGHTS = { gate: [74, 100], hospice: [152, 204], lip: [158, 100], crater: [150, 64], throne: [150, 60], cracks: [206, 152], praetory: [214, 104],
  glass: [220, 34], tarn: [88, 142] };
function buildHeights(seed) {
  const o = makeWorld(seed, 'overland', 260, 260, 90), rng = mulberry32(streamSeed(seed, 4442)), B = (t, n = 1) => `heights_${t}_${n}`;
  o.name = 'The Pale Heights'; o.region = 'heights';
  const { gate, hospice, lip, crater, throne, cracks, praetory, glass, tarn } = HEIGHTS;
  o.patches = [{ g: G.SNOW, f: 0.035, s: 53, th: 0.5 }, { g: G.SCREE, f: 0.06, s: 57, th: 0.64 }];   // patchy snow, rock and scree (§3.4)
  // the Sol, from under the Lip down past the Hospice, frozen (outdoorpaint.js); Frosthold's stream east into its tarn
  const sol = chaikin([[150, 100], [148, 120], [146, 150], [138, 180], [132, 210], [126, 250], [122, 300]], 3);
  o.rivers.push({ w: 7, pts: sol });
  o.rivers.push({ w: 3.5, pts: chaikin([[-40, 126], [10, 124], [44, 122], [68, 122], [80, 128], [tarn[0] - 2, tarn[1] - 2]], 2) });
  // the crater's glass; the tarn; the Soulcracks, a chain of splits running south-east
  o.pools.push({ cx: crater[0], cy: crater[1], rx: 34, ry: 22 }, { cx: tarn[0], cy: tarn[1], rx: 8, ry: 6 });
  for (let k = 0; k < 8; k++) o.pools.push({ cx: cracks[0] - 20 + k * 5.6 + (k % 2 ? 1.5 : -1.5), cy: cracks[1] - 20 + k * 5.6 + (k % 2 ? -1.5 : 1.5), rx: 4.2, ry: 2.4 });
  const BRIDGE = [xAt(sol, 188), 188];
  const ROADS = [
    { w: 6, surface: 'dirt', imperial: true, pts: [[150, 300], [150, hospice[1] - 6]] },                                 // up the Sol from Solmere
    { w: 5, surface: 'dirt', pts: [[150, hospice[1] - 6], [150, 188], [BRIDGE[0] - 14, 188], [112, 160], [104, 110], [96, 100], [gate[0] - 4, gate[1]]] },   // the pass road, over the bridge to Frosthold's gate
    { w: 3, surface: 'track', pts: [[158, 194], [168, 184], [158, 172], [170, 160], [160, 148], [172, 136], [162, 124], [168, 114], [lip[0], lip[1] + 6]] },   // the Pilgrims' Stair
    { w: 3, surface: 'track', pts: [[164, 107], [192, 112], [praetory[0] + 1, praetory[1] + 12]] },                      // the Lip to the Praetory
    { w: 3, surface: 'track', pts: [[praetory[0] + 1, praetory[1] + 12], [228, 114], [234, 84], [226, 56], [glass[0] + 0.5, glass[1] + 8]] },   // on round to the Glass Keep
    { w: 2.5, surface: 'track', pts: [[171, 150], [188, 158], [cracks[0] - 14, cracks[1] + 6]] },                        // to the Soulcracks' edge
  ].map((r) => ({ ...r, pts: fillet(r.pts, Math.max(8, r.w * 2)) }));
  joinRoads(o, ROADS);
  o.roads.push(...ROADS);
  o.aprons.push({ x: hospice[0] - 2, y: hospice[1] - 4, r: 7 });                                                  // the Hospice's court, packed snow
  finalizeGround(o);
  put(o, 'bridge_90', BRIDGE[0], BRIDGE[1], 'deck');
  // Frosthold: no circuit (§3.4), the crags behind and the stream in front its walls, one wall across the pass road
  // with the gate in it; the chapel and its bell tower, the hall, the cells
  { const X = gate[0], GY = gate[1];
    for (const [id, x, y] of [[B('temple'), 50, 88], [B('house', 1), 62, 88], [B('longhouse'), 50, 106], [B('cottage'), 62, 108], [B('house', 2), 38, 98]]) put(o, id, x, y);
    putRun(o, B('curtainy'), X, GY - 17); putRun(o, B('curtainy'), X, GY + 17);   // a curtain piece each side of the gate, the south one down into the stream
    put(o, B('tower'), X, GY - 27, 'round', 0.1);
    putGate(o, B('gatehousey'), X, GY);
    put(o, B('standard'), X + 4, GY - 5, 'rect', 0.1); put(o, B('standard'), X + 4, GY + 5, 'rect', 0.1); }
  // the Frozen Hospice (a landmark: the waystation isn't built): its walled court at the Stair's foot
  put(o, B('inn'), hospice[0] + 12, hospice[1] - 2); put(o, B('longhouse'), hospice[0] + 12, hospice[1] + 12); put(o, B('lanewell'), hospice[0] + 4, hospice[1] + 4, 'rect', 0.1);
  putRun(o, B('wall'), hospice[0] + 26, hospice[1] - 12); putRun(o, B('curtainy'), hospice[0] + 24, hospice[1] + 8);   // (the north wall stops short of the Stair: its gate)
  // the Lip's marker stone; the Throne half-sunk in the glass; the Praetory's ruin between its two posts; the Glass Keep
  put(o, 'milestone_0', lip[0] + 4, lip[1] + 2, 'rect', 0.2); put(o, B('keep'), throne[0], throne[1]);
  put(o, 'chapelruin_0', praetory[0], praetory[1]); put(o, B('tower'), praetory[0] - 9, praetory[1] + 6, 'round', 0.1); put(o, B('tower'), praetory[0] - 8, praetory[1] - 8, 'round', 0.1);
  put(o, B('keep'), glass[0], glass[1]);
  o.labels.push({ x: gate[0], y: gate[1], id: B('gatehousey'), text: 'Frosthold' }, { x: hospice[0] + 8, y: hospice[1], id: B('inn'), text: 'The Frozen Hospice' },
    { x: 165, y: 150, text: "The Pilgrims' Stair" }, { x: lip[0], y: lip[1], id: 'milestone_0', text: 'The Lip' }, { x: throne[0], y: throne[1], id: B('keep'), text: 'The Ember Throne' },
    { x: cracks[0], y: cracks[1], text: 'The Soulcracks' }, { x: praetory[0], y: praetory[1], id: 'chapelruin_0', text: 'The Praetory' }, { x: glass[0], y: glass[1], id: B('keep'), text: 'The Glass Keep' });
  for (const r of ROADS) if (r.imperial) beacons(o, r.pts, B('tower'));

  // THE PEAKS (their own stream): the crater's rim, broken only at the Lip; the crags behind Frosthold; peaks over the
  // whole north as the sketch has them; a range past the edges
  const mrng = mulberry32(streamSeed(seed, 4444)), F = (id) => ENV_FOOT[id] || [-10, -10, 10, 10];
  const keepOut = [gate, hospice, lip, cracks, praetory, glass, tarn], sights = [gate, [gate[0] + 22, gate[1]], hospice, lip, cracks, praetory, glass, [165, 150]];   // (and where you arrive)
  const clear = (x, y, r = 18) => !keepOut.some(([kx, ky]) => hypot(x - kx, y - ky) < r) && !inFrontOf(sights, x, y, 40, 22)
    && hypot(x - 60, y - 98) > 26 && hypot((x - crater[0]) / 40, (y - crater[1]) / 27) > 1;
  for (let a = 0; a < 6.2832; a += 0.21) {                                                      // the rim: rocks and crags, the Lip left open
    const x = crater[0] + cos(a) * 44, y = crater[1] + sin(a) * 30;
    if (hypot(x - lip[0], y - lip[1]) < 16) continue;
    const id = mrng() < 0.35 ? pick(mrng, ['mountain_A', 'mountain_B']) : pick(mrng, ['rock_C', 'rock_E', 'rock_D', 'rock_E']);
    if (fits(o, id, x, y, -1.5)) put(o, id, x, y, /mountain/.test(id) ? 'round' : 'rect', /mountain/.test(id) ? 0.35 : 0.1);
  }
  for (const [x, y] of [[30, 70], [56, 66], [18, 96], [24, 112], [6, 70], [40, 46], [10, 30], [70, 40], [100, 24], [96, 62], [212, 70], [240, 58], [236, 14], [196, 16],
    [246, 112], [230, 136], [102, 84], [120, 128], [96, 190], [184, 200], [236, 176], [120, 14], [172, 12], [252, 84], [36, 150], [20, 52], [86, 50]]) {
    const id = pick(mrng, ['mountain_A', 'mountain_B', 'mountain_A', 'mountain_B', 'mountain_massif_C']), jx = x + (mrng() - 0.5) * 8, jy = y + (mrng() - 0.5) * 8;
    // (and its wall off a spawn point's ground: walled to its foot, MOUNT_SHRINK, the Glass Keep's peak stood in its fight)
    const off = (cc) => { const f = F(id); return hypot(jx - cc.x, jy - cc.y) > cc.reach + Math.max(f[2] - f[0], f[3] - f[1]) / 2; };
    if (clear(jx, jy, 22) && !inFrontOf(sights, jx, jy, 72, 28) && fits(o, id, jx, jy, -1) && offRoad(o, id, jx, jy) && campsOf('heights').every(off)) put(o, id, jx, jy, 'round', 0.35);   // (a peak is tall: a deeper wedge)
  }
  for (let x = -90, i = 0; x < 360; i++) { const id = ['mountain_massif_A', 'mountain_massif_B', 'mountain_massif_C'][i % 3], f = F(id); put(o, id, x - f[0], -14 - f[3] - mrng() * 12, 'round', 0.3); x += (f[2] - f[0]) * (0.6 + mrng() * 0.2); }
  for (let y = -20; y < 330; ) { const id = pick(mrng, ['mountain_A', 'mountain_B', 'mountain_massif_C']), f = F(id); put(o, id, -12 - f[2] - mrng() * 10, y - f[1], 'round', 0.35); y += (f[3] - f[1]) * (0.7 + mrng() * 0.2); }
  for (let y = -20; y < 330; ) { const id = pick(mrng, ['mountain_A', 'mountain_B']), f = F(id); put(o, id, 268 - f[0] + mrng() * 14, y - f[1], 'round', 0.35); y += (f[3] - f[1]) * (0.8 + mrng() * 0.3); }
  // THE SCATTER: pines on the lower slopes (the south-west and south-east, as the sketch), scree and boulders, a dead
  // tree here and there; never on a road, a site or its sightline
  const PINES = ['pine_1', 'pine_2', 'pine_3', 'pine_4', 'pine_5', 'pine_6'];
  scatter(o, rng, -60, -60, 320, 320, 6, (x, y) => {
    const out = Math.max(-x, x - 260, -y, y - 260);
    if (out > 0) return rng() < 0.7 ? pick(rng, PINES) : null;
    if (!clear(x, y, 14)) return null;
    const low = y > 140 && (x < 110 || x > 180), n = fbm(x * 0.035, y * 0.035, o.seed + 65);
    const id = low && n > 0.42 ? (rng() < 0.8 ? pick(rng, PINES) : 'dead_1')
      : n > 0.62 ? (rng() < 0.5 ? pick(rng, PINES) : pick(rng, ['rock_A', 'rock_C', 'rock_D', 'rock_E'])) : rng() < 0.03 ? pick(rng, ['rock_C', 'rock_D', 'rock_B', 'dead_2']) : null;
    // (§3.6: living pines only below the snow line; on the snow and the scree, rock and the odd dead pine: of a stand
    // that would have been, a dead pine one in five, a rock one in three, the rest bare. One for one, a stand became a
    // ring of rocks: the foliage critic, round 3. By the tile, no draw: nothing else on the map moves for it.)
    if (id && /pine/.test(id)) { const g = groundAt(o, x, y).g; if (g === G.SNOW || g === G.SCREE) { const k = (Math.floor(x) * 7 + Math.floor(y) * 3) % 15; return k < 3 ? 'dead_1' : k < 8 ? 'rock_C' : null; } }
    return id;
  });
  forestRing(o, rng, 6, PINES, [...PINES, 'dead_1']);
  undergrowth(o, -10, -10, 270, 270, 5, (x, y) => { const g = groundAt(o, x, y).g;
    return keepOut.some(([kx, ky]) => hypot(x - kx, y - ky) < 12) || g === G.SNOW || g === G.SCREE || g === G.MARSH ? -1 : fbm(x * 0.07, y * 0.07, o.seed + 67) > 0.64 ? 0.35 : 0.04; },   // (§3.6: nothing green on snow, scree or marsh)
    { low: ['ug_grass_1', 'ug_grass_2', 'ug_fern'], solid: ['rock_A', 'rock_B'], foot: ['ug_grass_2', 'ug_fern'] });

  o.exits.push({ x0: gate[0] - 8, y0: gate[1] - 4, x1: gate[0] - 1, y1: gate[1] + 4, to: 'town', arrive: 'overland' });
  o.exits.push({ x0: 142, y0: 263, x1: 159, y1: 271, to: 'solmere', shut: 'The road down the Sol goes to Solmere. Not open to you from here.' });   // (v1.148) down the Sol to Solmere; (v1.150) its crossroads, on to the Reach or the Tidemark
  o.arrivals = { default: { x: gate[0] + 22.5, y: gate[1] + 0.5 }, frosthold: { x: gate[0] + 22.5, y: gate[1] + 0.5 }, hospice: { x: hospice[0] - 1.5, y: hospice[1] + 10.5 }, reach: { x: 150.5, y: 255.5 }, solmere: { x: 150.5, y: 255.5 } };
  o.spawn = o.arrivals.default;
  return o;
}

// ── THE TIDEMARK (world doc §3.7, v1.69; GDD v1.150; docs/tidemark-plan.md) — the east coast ─────────────────────
// 260 × 260, north up, as the plan's overland has it: the imperial road in from Solmere at the west, over the Brine at
// Brine Cross (a place, not a town: its houses at the bridge's two ends, the barricade at its east end where Act IV's
// siege comes); north from the junction up the Highmarch road to the walled march-kingdom's east gate; east on the coast
// road to Tollhaven's west gate, its harbour north-east of its walls; south-east down the beach road to Gullwick on the
// sand, its ferry jetty out toward the Drowned Mole. The sea is the east and the south-east, a salt marsh along the north
// shore toward Highmarch, the Lamp Fort on its headland. Grey field-walls and sheep inland.
export const TIDEMARK = { cross: [46, 172], join: [100, 172], highmarch: [100, 40], tollhaven: [176, 104], gullwick: [188, 226], ferry: [204, 256],
  lampfort: [240, 148], isles: [178, 12], reef: [231, 203] };   // (reef, v1.156: the Sister's Cabin's way in)
function buildTidemark(seed) {
  const o = makeWorld(seed, 'overland', 260, 260, 90), rng = mulberry32(streamSeed(seed, 4450)), B = (t, n = 1) => `tidemark_${t}_${n}`;
  o.name = 'The Tidemark'; o.region = 'tidemark';
  const { cross, join, highmarch, tollhaven, gullwick, ferry, lampfort, isles, reef } = TIDEMARK;
  // the sea: the east coast, Tollhaven's harbour bay north-east, the bay under Gullwick in the south-east, as the Guild's
  // wall map has the coast (tools/worldmap/draw.mjs); each one's fringe its beach (groundAt: a sea's fringe is sand)
  // (v1.156, the owner: "make the area more sandy, grass plains.. fewer trees") the beaches twice as wide, and sand
  // drifted inland over the grass in patches, thickest toward the coast (o.patches, as the Reach's ash)
  o.pools.push({ cx: 306, cy: 150, rx: 72, ry: 170, sea: true, beach: 0.9 }, { cx: 226, cy: 26, rx: 56, ry: 44, sea: true, beach: 0.9 },
    { cx: 262, cy: 300, rx: 100, ry: 70, sea: true, beach: 0.9 });
  o.patches = [{ g: G.SAND, f: 0.035, s: 91, th: 0.6 }];
  for (const [cx, cy, rx, ry] of [[112, 14, 9, 4], [134, 22, 11, 5], [154, 12, 8, 4], [126, 6, 6, 3]]) o.pools.push({ cx, cy, rx, ry });   // the salt pans, their marsh round them
  (o.clear ||= []).push([lampfort[0], lampfort[1], 13]);       // the Lamp Fort's headland out into the sea
  // the Brine, down out of the north, under the bridge (straight, +y, at Brine Cross), out to the sea in the south-west
  const brine = chaikin([[36, -60], [38, 0], [42, 60], [44, 120], [46, 160], [46, 186], [52, 230], [64, 300]], 3);
  const BRIDGE = [xAt(brine, cross[1]), cross[1]];
  o.rivers.push({ w: 8, pts: meander(seed, brine, [BRIDGE], 4451) });
  const ROADS = [
    { w: 6, surface: 'dirt', imperial: true, pts: [[-30, cross[1]], [BRIDGE[0] - 14, cross[1]], [BRIDGE[0] + 14, cross[1]], join] },   // the imperial road in from Solmere, over the bridge
    { w: 6, surface: 'dirt', imperial: true, pts: [join, [112, 140], [118, 96], [116, 60], [highmarch[0] + 2, highmarch[1]]] },        // the Highmarch road north, to its east gate
    { w: 6, surface: 'dirt', imperial: true, pts: [join, [128, 150], [150, 118], [tollhaven[0] - 12, tollhaven[1]]] },                   // the coast road east, to Tollhaven's west gate
    { w: 4, surface: 'dirt', pts: [[146, 124], [164, 160], [178, 196], [gullwick[0], gullwick[1] - 6]] },                                // the beach road south-east to Gullwick
    { w: 3, surface: 'track', pts: [[168, 168], [200, 160], [lampfort[0] - 8, lampfort[1] + 2]] },                                       // out along the cliffs to the Lamp Fort
    { w: 3, surface: 'track', pts: [[156, 110], [158, 72], [162, 36], [isles[0] - 14, isles[1] + 6]] },                                  // (v1.151) north past the salt marsh to the Gull Isles' landing
  ].map((r) => ({ ...r, pts: fillet(r.pts, Math.max(8, r.w * 2)) }));
  joinRoads(o, ROADS);
  o.roads.push(...ROADS);
  o.roads.push({ w: 3, surface: 'deck', pts: [[ferry[0] - 6, gullwick[1] + 8], [ferry[0], ferry[1]]] });   // Gullwick's ferry jetty, out toward the Mole
  o.roads.push({ w: 3, surface: 'deck', pts: [[isles[0] - 14, isles[1] + 6], [isles[0], isles[1]]] });   // (v1.151) the landing jetty on the bay's west shore, where the fleet's boats put in
  for (const x of [196, 216, 236]) o.roads.push({ w: 3, surface: 'deck', pts: [[x, 76], [x + 2, 46]] });   // Tollhaven's three jetties
  for (const [a, b] of [[[176, 72], [192, 30]], [[252, 72], [244, 28]]]) o.roads.push({ w: 4, surface: 'deck', pts: [a, b] });   // the two moles, the chain between their ends
  o.aprons.push({ x: gullwick[0], y: gullwick[1], r: 7 }, { x: BRIDGE[0] + 18, y: cross[1], r: 6 });
  o.fields.push({ x0: 62, y0: 100, x1: 86, y1: 132, axis: 'y' }, { x0: 122, y0: 196, x1: 150, y1: 218, axis: 'x' }, { x0: 64, y0: 196, x1: 90, y1: 224, axis: 'y' });
  finalizeGround(o);
  put(o, 'bridge_90', BRIDGE[0], BRIDGE[1], 'deck');
  // Brine Cross: the houses at the bridge's two ends, the tollhouse at its west foot, the barricade across the east one
  for (const [id, x, y] of [[B('house', 1), BRIDGE[0] - 12, cross[1] - 10], [B('cottage'), BRIDGE[0] - 12, cross[1] + 10], [B('longhouse'), BRIDGE[0] + 13, cross[1] - 11],
    [B('workshop'), BRIDGE[0] + 13, cross[1] + 11], [B('housex', 1), BRIDGE[0] - 22, cross[1] - 9]]) put(o, id, x, y);
  put(o, B('standard'), BRIDGE[0] - 8, cross[1] - 4.5, 'rect', 0.1);
  for (const [id, x, y] of [['cart_90', BRIDGE[0] + 20, cross[1] - 4], ['crate_A_big', BRIDGE[0] + 20, cross[1] + 4], ['barrel', BRIDGE[0] + 21, cross[1] + 6]]) put(o, id, x, y, 'rect', 0.1);
  // Highmarch from outside: its walls in small, the keep over them, the gate east on its road
  { const X0 = 52, X1 = highmarch[0], Y0 = 8, Y1 = 64, GY = highmarch[1];
    for (const [id, x, y] of [[B('keep'), 68, 26], [B('temple'), 86, 22], [B('house', 2), 64, 50], [B('housex', 2), 86, 54], [B('house', 3), 76, 40]]) put(o, id, x, y);
    putWall(o, B('curtain'), true, Y0, X0, X1); putWall(o, B('curtain'), true, Y1, X0, X1); putWall(o, B('curtainy'), false, X0, Y0, Y1);
    putWall(o, B('curtainy'), false, X1, Y0, GY - 7); putWall(o, B('curtainy'), false, X1, GY + 7, Y1);
    for (const [x, y] of [[X0, Y0], [X1, Y0], [X0, Y1], [X1, Y1], [(X0 + X1) / 2, Y0], [(X0 + X1) / 2, Y1], [X0, 36]]) put(o, B('tower'), x, y, 'round', 0.1);
    putGate(o, B('gatehousey'), X1, GY);
    put(o, B('standard'), X1 + 4, GY - 5, 'rect', 0.1); put(o, B('standard'), X1 + 4, GY + 5, 'rect', 0.1); }
  // Tollhaven from outside: grey stone on its landward sides, the gate west on the coast road, its roofs inside; the
  // harbour beyond its north wall (the jetties and the moles laid above)
  { const X0 = tollhaven[0], X1 = 214, Y0 = 84, Y1 = 124, GY = tollhaven[1];
    for (const [id, x, y] of [[B('temple'), 196, 96], [B('inn'), 186, 112], [B('house', 1), 204, 114], [B('workshopx'), 204, 98]]) put(o, id, x, y);
    putWall(o, B('curtain'), true, Y0, X0, X1); putWall(o, B('curtain'), true, Y1, X0, X1); putWall(o, B('curtainy'), false, X1, Y0, Y1);
    putWall(o, B('curtainy'), false, X0, Y0, GY - 7); putWall(o, B('curtainy'), false, X0, GY + 7, Y1);
    for (const [x, y] of [[X0, Y0], [X1, Y0], [X0, Y1], [X1, Y1], [(X0 + X1) / 2, Y0], [(X0 + X1) / 2, Y1]]) put(o, B('tower'), x, y, 'round', 0.1);
    putGate(o, B('gatehousey'), X0, GY);
    put(o, B('standard'), X0 - 4, GY - 5, 'rect', 0.1); put(o, B('standard'), X0 - 4, GY + 5, 'rect', 0.1);
    put(o, B('workshop'), 186, 78); put(o, B('longhouse'), 206, 78);                                    // the bonded warehouses on the quay
    put(o, B('tower'), 192, 28, 'round', 0.1); put(o, B('tower'), 244, 26, 'round', 0.1); }             // the chain's towers at the moles' ends
  // Gullwick (a place: its cottages on the Strand, the nets drying, the ferryman's post at the jetty's foot)
  for (const [id, x, y] of [[B('cottage'), gullwick[0] - 12, gullwick[1] - 6], [B('cottagex'), gullwick[0] - 4, gullwick[1] - 14], [B('house', 2), gullwick[0] + 10, gullwick[1] - 10],
    [B('longhousex'), gullwick[0] - 16, gullwick[1] + 6], [B('lanewell'), gullwick[0] + 2, gullwick[1] - 2]]) put(o, id, x, y, 'rect', /well/.test(id) ? 0.1 : 0.12);
  for (const x of [gullwick[0] + 6, gullwick[0] + 12]) putRun(o, 'fence_0', x, gullwick[1] + 4);
  for (const [id, x, y] of [['barrel', ferry[0] - 9, gullwick[1] + 6], ['crate_A_small', ferry[0] - 10, gullwick[1] + 8], ['sack', gullwick[0] - 6, gullwick[1] + 4]]) put(o, id, x, y, 'rect', 0.1);
  // the Lamp Fort on its headland: Old Gannet's light, a tower in a wall
  put(o, B('tower'), lampfort[0] + 2, lampfort[1] - 2, 'round', 0.1); put(o, B('wall'), lampfort[0] - 4, lampfort[1] - 8);   // (north of the door: south of it, the wall hid the door and the arrival from the camera, visibility.mjs)
  o.labels.push({ x: BRIDGE[0], y: cross[1], id: B('standard'), text: 'Brine Cross' }, { x: highmarch[0], y: highmarch[1], id: B('gatehousey'), text: 'Highmarch' },
    { x: tollhaven[0], y: tollhaven[1], id: B('gatehousey'), text: 'Tollhaven' }, { x: gullwick[0], y: gullwick[1], id: B('cottage'), text: 'Gullwick' },
    { x: lampfort[0], y: lampfort[1], id: B('tower'), text: 'The Lamp Fort' }, { x: 132, y: 20, text: 'The salt marsh' },
    { x: ferry[0], y: ferry[1] - 2, text: 'The ferry to the Drowned Mole', site: 'drowned_mole' },
    { x: isles[0] - 2, y: isles[1] + 2, text: 'Boats to the Gull Isles', site: 'gull_isles' });   // (the same: the landing jetty's end, a boat waiting)   // (the owner, 2026-11-26: the jetty's end read as a dead end; the boat and the ferryman waiting in it are drawn there, render3d/convert.js)
  for (const r of ROADS) if (r.imperial) beacons(o, r.pts, B('tower'));

  // THE HILLS (their own stream): Highmarch's high ground in the north-west, a range past the north and west edges
  const mrng = mulberry32(streamSeed(seed, 4452)), F = (id) => ENV_FOOT[id] || [-10, -10, 10, 10];
  const keepOut = [cross, join, highmarch, tollhaven, gullwick, lampfort, isles, [isles[0] - 14, isles[1] + 6], [BRIDGE[0] + 18, cross[1]], reef];   // (reef: the Cabin's beach, v1.156)
  const sights = [[BRIDGE[0] + 18, cross[1]], [highmarch[0] + 14, highmarch[1]], [tollhaven[0] - 14, tollhaven[1]], gullwick, lampfort, isles, reef];
  const sea = (x, y) => { const g = groundAt(o, x, y).g; return g === G.POOL || g === G.SAND; };
  const clear = (x, y, r = 18) => !keepOut.some(([kx, ky]) => hypot(x - kx, y - ky) < r) && !inFrontOf(sights, x, y, 40, 22) && !sea(x, y);
  for (const [x, y] of [[18, 40], [24, 92], [14, 132], [124, 40], [140, 66], [20, 226], [96, 234]]) {
    const id = mrng() < 0.5 ? 'mountain_A' : 'mountain_B', jx = x + (mrng() - 0.5) * 6, jy = y + (mrng() - 0.5) * 6;
    if (clear(jx, jy, 20) && !inFrontOf(sights, jx, jy, 72, 28) && fits(o, id, jx, jy, -1)) put(o, id, jx, jy, 'round', 0.35);
  }
  for (let y = -20; y < 330; ) { const id = pick(mrng, ['mountain_A', 'mountain_B', 'mountain_massif_C']), f = F(id); put(o, id, -12 - f[2] - mrng() * 10, y - f[1], 'round', 0.35); y += (f[3] - f[1]) * (0.7 + mrng() * 0.2); }
  // THE SCATTER: oaks and birch in the Brine's valley and round Highmarch, windbent pines toward the coast, rocks on the
  // cliffs; nothing on the beach or in the sea, a road, a place or its sightline
  scatter(o, rng, -60, -60, 320, 320, 6, (x, y) => {
    const out = Math.max(-x, x - 260, -y, y - 260);
    if (out > 0) return sea(x, y) ? null : rng() < 0.25 ? pick(rng, TREE_CLUSTER) : null;   // (v1.156: thinner past the edge too)
    if (!clear(x, y, 14)) return null;
    const n = fbm(x * 0.04, y * 0.04, o.seed + 71), coast = x > 150 || y > 200;   // (v1.156: open grass plain, a copse here and there; the coast bare dune)
    if (n > 0.7) return coast ? (rng() < 0.25 ? pick(rng, ['pine_2', 'pine_4']) : rng() < 0.4 ? pick(rng, ROCKS) : null) : rng() < 0.6 ? pick(rng, TREE_SINGLE.filter((t) => /oak|birch|autumn/.test(t))) : null;
    return rng() < 0.015 ? pick(rng, ROCKS) : null;
  });
  forestRing(o, rng, 6, TREE_CLUSTER, TREE_SINGLE, (x, y) => { const g = groundAt(o, x, y).g; return g === G.POOL || g === G.SAND || x > 200 || y > 236 || fbm(x * 0.05, y * 0.05, o.seed + 79) < 0.62; });   // (no wood on the beach or in the sea, nor past the coast; v1.156: a broken line, not a wall)
  { const fr = mulberry32(streamSeed(seed, 4453));   // the sheep inland on the field-walled pasture
    herd(o, fr, ['sheep_1', 'sheep_2'], 74, 144, 5, 8); herd(o, fr, ['sheep_1', 'sheep_2'], 136, 230, 4, 6); }
  bound(o, () => 'fence');
  undergrowth(o, -10, -10, 270, 270, 5, (x, y) => { const g = groundAt(o, x, y).g;
    return keepOut.some(([kx, ky]) => hypot(x - kx, y - ky) < 12) || g === G.POOL ? -1 : g === G.SAND ? 0.06 : fbm(x * 0.07, y * 0.07, o.seed + 73) > 0.62 ? 0.4 : 0.06; },
    { low: ['ug_grass_1', 'ug_grass_2', 'ug_grass_1'], solid: ['rock_F', 'rock_G'], foot: ['ug_grass_2'] });

  o.exits.push({ x0: tollhaven[0] + 1, y0: tollhaven[1] - 4, x1: tollhaven[0] + 8, y1: tollhaven[1] + 4, to: 'town', arrive: 'overland' });
  // the Drowned Mole's door, at the end of Gullwick's ferry jetty: the ferryman rows a company out (v1.150)
  o.exits.push({ x0: ferry[0] - 3, y0: ferry[1] - 3, x1: ferry[0] + 3, y1: ferry[1] + 1, to: 'dungeon', site: 'drowned_mole' });
  // (v1.151) the Gull Isles' door at the end of the landing jetty (the fleet's boats row a company out), and the Lamp
  // Fort's at the tower's foot, where the cliff track ends
  o.exits.push({ x0: isles[0] - 2, y0: isles[1] - 3, x1: isles[0] + 3, y1: isles[1] + 2, to: 'dungeon', site: 'gull_isles' });
  o.exits.push({ x0: lampfort[0] - 5, y0: lampfort[1] - 3, x1: lampfort[0] - 2, y1: lampfort[1] + 2, to: 'dungeon', site: 'lamp_fort' });
  // (v1.154) Highmarch's door is its gate, east on the Highmarch road (the League's engines have the walls)
  o.exits.push({ x0: highmarch[0] - 1, y0: highmarch[1] - 2.5, x1: highmarch[0] + 1.5, y1: highmarch[1] + 2.5, to: 'dungeon', site: 'highmarch' });
  // (v1.156) the Sister's Cabin: the wreck of Aurelle's Grace on her reef off the east beach below the Lamp Fort, its way
  // in where the reef shows at low water; shut until the Tidemark's Chronicle set finds it (sites.js siteOpen)
  o.exits.push({ x0: reef[0] - 2, y0: reef[1] - 3, x1: reef[0] + 2, y1: reef[1] + 3, to: 'dungeon', site: 'sisters_cabin' });
  // the imperial road west, into Solmere (a crossroads: GDD v1.150, core.js)
  o.exits.push({ x0: -11, y0: cross[1] - 9, x1: -4, y1: cross[1] + 9, to: 'solmere' });
  o.arrivals = { default: { x: tollhaven[0] - 14.5, y: tollhaven[1] + 0.5 }, tollhaven: { x: tollhaven[0] - 14.5, y: tollhaven[1] + 0.5 }, solmere: { x: 4.5, y: cross[1] + 0.5 },
    brine_cross: { x: BRIDGE[0] - 15.5, y: cross[1] + 0.5 },   // (v1.151: the west bank, by the tollhouse; the east barricade is the stand's, camps.js) gullwick: { x: gullwick[0] + 0.5, y: gullwick[1] - 2.5 },
    drowned_mole: { x: ferry[0] - 2.5, y: ferry[1] - 8.5 },   // (back up the jetty, off the door)
    gull_isles: { x: isles[0] - 7.5, y: isles[1] + 3.5 }, lamp_fort: { x: lampfort[0] - 9.5, y: lampfort[1] + 2.5 },
    highmarch: { x: highmarch[0] + 7.5, y: highmarch[1] + 0.5 },   // (v1.154: back out on the road, off the gate)
    sisters_cabin: { x: reef[0] - 8.5, y: reef[1] + 0.5 } };   // (v1.156: up the beach from the reef)
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
// preview their walled hubs and their own overlands (not lands you can walk to yet: docs/reach-heights-overlands.md);
// 'stage' takes its floor in `region`'s place (grass · cobble). One town a land (GDD v1.132).
/** @param {number} seed @param {string} kind @param {string} [region] */
export function createOutdoor(seed, kind, region = 'vale') {
  if (kind === 'stage') return buildStage(seed, region);
  if (region === 'fens') return kind === 'town' ? buildWaystation(seed, 'fens') : dressCamps(buildFens(seed), 'fens');   // (M8: Saltmere, the Fens)
  if (kind === 'overland' && region === 'reach') return dressCamps(buildReach(seed), 'reach');
  if (kind === 'overland' && region === 'heights') return dressCamps(buildHeights(seed), 'heights');
  if (kind === 'overland' && region === 'tidemark') return dressCamps(buildTidemark(seed), 'tidemark');   // (v1.150)
  return kind === 'town' ? buildTown(seed, region) : dressCamps(buildOverland(seed), 'vale');
}
// a land's spawn points dressed (camps.js, GDD §10.3): each piece on its tile, solid (the fire, the dead cow, the burrow…)
function dressCamps(o, region) {
  for (const c of campsOf(region)) for (const [kind, dx, dy] of c.dress || []) putProp(o, kind, c.x + dx, c.y + dy);
  return o;
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
