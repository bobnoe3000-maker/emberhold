// pathing.mjs — does the drawn world match the ground the sim walks? (docs/pathing-audit.md; the owner, 2026-11-26:
// "Ashgate.. characters often auto path and walk over or through walls.. eval all pathing and make sure it makes sense")
//
// The sim walks its own grid (isWalkable: outdoor.js footprints and walls, level.js cells and props); Luminati draws a
// level converted from it (convert.js) with its own houses, our kit's pieces (buildkit.js) and raised terrain. Where the
// two disagree a figure is seen walking over a wall, through a house, or stopping at nothing. Map by map, in the game on
// Luminati, this measures the scene as it is drawn, every mesh of it (the figures, the effects, the sky and the ground
// cover aside), against the sim's grid, a tile at a time (a tile is half a unit of Luminati's):
//   · contact: something drawn at a figure's height (BAND units above the walk level, ankle to shoulder: a man is 1.75)
//     within a body's half-width (BODY tiles) of the tile's middle: a wall face, a post, a trunk, a prop;
//   · raised: the walk surface Luminati stands a figure on is more than a step (STEP units: a bank's one level is 0.5) above
//     the ground (a wall raised as terrain, a mountain), not a stair; sunk: as far below (water, a ditch);
//   · enclosed: open at a figure's height but shut in by what's drawn a unit or more high, unreachable from where you wake
//     (a house's inside);
//   · cover: something drawn overhead (a crown, a roof's eaves);
//   · card: a baked sprite stood up (a picture, not a solid): its atlas footprint as the sim stamps it, drawn there but
//     never counted as walked through.
// Then, over the ground the sim lets the party reach from the spawn (R):
//   · through: a tile of R in contact or enclosed (walked through what's drawn), over: a tile of R raised (walked over it),
//     sunk: a tile of R sunk;
//   · invisible: a tile the sim blocks beside R with nothing drawn there at a figure's height (a wall you bump into that
//     isn't there): bare, under cover (a crown, eaves), or near (a step short of something drawn).
// And the walks: the hero and two hired companions replayed headless (the same seed and map) to every compass row, each
// townsperson and WALKS seeded random tiles of R, every tick's position kept; a sample is bad where its tile is drawn
// solid (through, over), or (cut) where the unit's middle is on a tile the sim blocks.
// Out: tools/capture/out/pathing/<map>.png (the map top-down, a few pixels a tile, the walks over it) and summary.json.
//   node tools/capture/pathing.mjs [towns | overlands | dungeons | all | <map> …] [--walks 60] [--px 3] [--out dir] [--json file] [--no-walks] [--base url]
import { createServer } from 'node:http';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { join, extname, normalize, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { createSim } from '../../src/sim/core.js';
import { isWalkable } from '../../src/sim/world.js';
import { mulberry32 } from '../../src/sim/rng.js';
import { ENV_FOOT } from '../../src/sim/envfoot.js';

const ROOT = fileURLToPath(new URL('../..', import.meta.url));
const args = process.argv.slice(2), opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args.splice(i, 2)[1] : d; };
const WALKS = +opt('--walks', 60), PX = +opt('--px', 3), OUT = resolve(opt('--out', join(ROOT, 'tools/capture/out/pathing'))), JSON_OUT = opt('--json', ''), BASE = opt('--base', '');
const NO_WALKS = args.includes('--no-walks');
const PROBE = (opt('--probe', '') || '').split(';').filter(Boolean).map((q) => q.split(',').map(Number));   // (--probe x,y;x,y: what's drawn there, for a look)
/** the band a figure fills, Luminati units over its walk level (a man is 1.75), and a body's half-width in our tiles */
const BAND = [0.3, 1.35], BODY = 0.25, STEP = 0.6;
const town = (region) => ({ scene: 'town', region }), land = (region) => ({ scene: 'overland', region }), floor = (site, f = 0) => ({ scene: 'dungeon', site, floor: f });
export const MAPS = {
  'vale-town': town('vale'), 'fens-town': town('fens'), 'reach-town': town('reach'), 'tidemark-town': town('tidemark'), 'heights-town': town('heights'),
  vale: land('vale'), fens: land('fens'), reach: land('reach'), tidemark: land('tidemark'), heights: land('heights'),
  'barrows-f1': floor('barrows'), 'keep-f1': floor('wickham_keep'), 'chapel-f1': floor('sunken_chapel'), 'pens-f1': floor('proving_pens'),
  'mound-f1': floor('toadking_mound'), 'abbey-f1': floor('drowned_abbey'), 'seam-f1': floor('cold_seam'), 'yards-f1': floor('assay_yards'),
  'works-f1': floor('cinderworks'), 'inn-f1': floor('shuttered_inn'), 'crypt-f1': floor('haddow_crypt'), 'highmarch-f1': floor('highmarch'),
};
const GROUPS = { towns: Object.keys(MAPS).filter((k) => MAPS[k].scene === 'town'), overlands: Object.keys(MAPS).filter((k) => MAPS[k].scene === 'overland'), dungeons: Object.keys(MAPS).filter((k) => MAPS[k].scene === 'dungeon') };
const want = args.filter((a) => !a.startsWith('--'));
const names = !want.length || want.includes('all') ? Object.keys(MAPS) : want.flatMap((w) => GROUPS[w] || [w]);
for (const n of names) if (!MAPS[n]) { console.error(`no map ${n} (${Object.keys(MAPS).join(' ')})`); process.exit(1); }

// ── in the page: the drawn scene, a tile at a time ──────────────────────────────────────────────────────────────────
// (the scene, caught as it's made: Luminati keeps it to itself, and its build is never edited for a tool)
const CATCH = () => {
  globalThis.__scenes = [];
  Object.defineProperty(Object.prototype, 'isScene', { configurable: true, get() { return undefined; },
    set(v) { Object.defineProperty(this, 'isScene', { value: v, writable: true, configurable: true, enumerable: true }); if (v) globalThis.__scenes.push(this); } });
};
async function measure({ BAND, BODY, STEP, PROBE }) {
  const probed = [];
  const s = globalThis.__sim, w = s.world, h = globalThis.__world3d, O = h.origin;
  const { isWalkable } = await import('/src/sim/world.js'), { convertWorld, LEGEND } = await import('/src/render3d/convert.js');
  const q = new URLSearchParams(location.search), conv = convertWorld(w, { region: w.region || q.get('region') || 'vale', stairs: '', walls: '', dlook: '' });
  const NX = conv.level.width * 2, NY = conv.level.depth * 2, X0 = O.x, Y0 = O.y, N = NX * NY;
  const lx = (x) => (x - X0) / 2, lz = (y) => (y - Y0) / 2;
  const walk = new Uint8Array(N), contact = new Uint8Array(N), barrier = new Uint8Array(N), cover = new Uint8Array(N), stair = new Uint8Array(N), water = new Uint8Array(N), card = new Uint8Array(N), person = new Uint8Array(N);
  const gh = new Float32Array(N);
  const P = s.state.player, g0 = h.world.ground(lx(P.x), lz(P.y));
  for (let ty = 0; ty < NY; ty++) for (let tx = 0; tx < NX; tx++) {
    const i = ty * NX + tx, x = X0 + tx, y = Y0 + ty;
    walk[i] = isWalkable(w, x + 0.5, y + 0.5) ? 1 : 0;
    gh[i] = h.world.ground(lx(x + 0.5), lz(y + 0.5)) ?? g0;
    const ch = conv.level.tiles[ty >> 1][tx >> 1], L = LEGEND[ch] || {};
    if (L.stairs) stair[i] = 1;
    if (L.water || L.void || L.walkable === false) water[i] = 1;   // (water, ice, the void, ground Luminati itself won't walk)
  }
  for (const n of w.npcs || []) for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) { const tx = Math.floor(n.x) + dx - X0, ty = Math.floor(n.y) + dy - Y0; if (tx >= 0 && ty >= 0 && tx < NX && ty < NY) person[ty * NX + tx] = 1; }
  // the scene's meshes: the world's and our kit's; not the people (glTF scenes, skinned), the effects, the sky, the ground
  // cover, the shadows' stand-ins. A card (a baked sprite stood up) is its atlas footprint, as the sim stamps it.
  const scene = globalThis.__scenes.reduce((a, b) => (b.children.length > a.children.length ? b : a));
  scene.updateMatrixWorld(true);
  // (what the sim lets you walk through, and Luminati draws as such: the wheat, the low undergrowth)
  // (nor the ground itself: a bank or a step's side is walked up, a wall raised as ground is `raised`, below)
  const SKIP = /^ember:kit:(wheat|ug_(flowers|grass|fern|clover|plant|mushroom))|^terrain:|^TileMap|^(Player|Particles|Sky|GodRays|OuterGround|BlobBatch|GroundDetail|LightingSystem|Scene|Rig)$|shadowProxy|Sprite3D\.blob|silhouette|:shadow|^terrain:shadow|^trees:outer|Foliage|^ember:fig|^ember:beast|^ember:fx|^ember:ring|^ember:spell|^ember:bit/;
  const meshes = [], cards = [];
  const visit = (o) => {
    if (!o.visible || SKIP.test(o.name || '')) return;
    if (o.isSkinnedMesh || o.isPoints || o.isLine || o.isSprite) return;
    if (o.name === 'Sprite3D.mesh') { cards.push(o.parent); return; }
    if (o.isMesh || o.isInstancedMesh) {
      const m = Array.isArray(o.material) ? o.material[0] : o.material;
      if (m && m.colorWrite !== false && m.depthWrite !== false && !(m.transparent && m.opacity < 0.5)) meshes.push(o);
    }
    for (const c of o.children) visit(c);
  };
  for (const c of scene.children) visit(c);
  const yLo = g0 + BAND[0], yHi = g0 + BAND[1];
  // a convex polygon (our tiles) laid on the grid: each tile whose square of half-width `half` round its middle meets it
  const rast = (poly, half, arr) => {
    let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
    for (const [x, y] of poly) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
    const i0 = Math.max(0, Math.floor(x0 - X0 - half - 0.5)), i1 = Math.min(NX - 1, Math.floor(x1 - X0 + half - 0.5) + 1);
    const j0 = Math.max(0, Math.floor(y0 - Y0 - half - 0.5)), j1 = Math.min(NY - 1, Math.floor(y1 - Y0 + half - 0.5) + 1);
    if (i0 > i1 || j0 > j1) return;
    const axes = [];
    for (let k = 0; k < poly.length; k++) { const a = poly[k], b = poly[(k + 1) % poly.length], nx = -(b[1] - a[1]), ny = b[0] - a[0]; if (Math.abs(nx) + Math.abs(ny) > 1e-9) { let mn = 1e9, mx = -1e9; for (const p of poly) { const d = nx * p[0] + ny * p[1]; if (d < mn) mn = d; if (d > mx) mx = d; } axes.push([nx, ny, mn, mx]); } }
    for (let j = j0; j <= j1; j++) for (let i = i0; i <= i1; i++) {
      const cx = X0 + i + 0.5, cy = Y0 + j + 0.5;
      if (cx + half < x0 || cx - half > x1 || cy + half < y0 || cy - half > y1) continue;
      let sep = false;
      for (const [nx, ny, mn, mx] of axes) { const c = nx * cx + ny * cy, r = half * (Math.abs(nx) + Math.abs(ny)); if (mx < c - r || mn > c + r) { sep = true; break; } }
      if (!sep) arr[j * NX + i] = 1;
    }
  };
  // a polygon cut to y ≥ a (dir 1) or y ≤ a (dir −1) (Sutherland–Hodgman), points [x, y, z]
  const cut = (poly, a, dir) => {
    const out = [];
    for (let k = 0; k < poly.length; k++) {
      const p = poly[k], q2 = poly[(k + 1) % poly.length], pin = (p[1] - a) * dir >= 0, qin = (q2[1] - a) * dir >= 0;
      if (pin) out.push(p);
      if (pin !== qin) { const t = (a - p[1]) / (q2[1] - p[1]); out.push([p[0] + (q2[0] - p[0]) * t, a, p[2] + (q2[2] - p[2]) * t]); }
    }
    return out;
  };
  const toSim = (poly) => poly.map(([x, , z]) => [x * 2 + X0, z * 2 + Y0]);
  const mm = new Float32Array(16);
  const mul = (a, b, o) => { for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) { let v = 0; for (let k = 0; k < 4; k++) v += a[k * 4 + r] * b[c * 4 + k]; o[c * 4 + r] = v; } };
  const xf = (m, pos, k) => { const x = pos.getX(k), y = pos.getY(k), z = pos.getZ(k); return [m[0] * x + m[4] * y + m[8] * z + m[12], m[1] * x + m[5] * y + m[9] * z + m[13], m[2] * x + m[6] * y + m[10] * z + m[14]]; };
  let tris = 0, drawnBy = new Map();
  const LIM = [lx(X0) - 1, lz(Y0) - 1, lx(X0 + NX) + 1, lz(Y0 + NY) + 1];
  for (const o of meshes) {
    const g = o.geometry, pos = g.attributes.position; if (!pos) continue;
    const idx = g.index, nt = idx ? idx.count / 3 : pos.count / 3, mats = [];
    if (o.isInstancedMesh) { for (let k = 0; k < o.count; k++) { const im = o.instanceMatrix.array.subarray(k * 16, k * 16 + 16); mul(o.matrixWorld.elements, im, mm); mats.push(Float32Array.from(mm)); } }
    else mats.push(Float32Array.from(o.matrixWorld.elements));
    const label = (() => { for (let q2 = o; q2 && q2 !== scene; q2 = q2.parent) if (/^ember:|^village|^trees|^terrain|^World$/.test(q2.name || '')) return q2.name; return o.name || o.type; })();
    let hit = 0;
    for (const m of mats) for (let t = 0; t < nt; t++) {
      const a = idx ? idx.getX(t * 3) : t * 3, b = idx ? idx.getX(t * 3 + 1) : t * 3 + 1, c = idx ? idx.getX(t * 3 + 2) : t * 3 + 2;
      const A = xf(m, pos, a), B = xf(m, pos, b), C = xf(m, pos, c);
      const ymax = Math.max(A[1], B[1], C[1]); if (ymax < yLo) continue;
      if (Math.max(A[0], B[0], C[0]) < LIM[0] || Math.min(A[0], B[0], C[0]) > LIM[2] || Math.max(A[2], B[2], C[2]) < LIM[1] || Math.min(A[2], B[2], C[2]) > LIM[3]) continue;
      tris++;
      const tri = [A, B, C], ymin = Math.min(A[1], B[1], C[1]);
      if (ymin <= yHi) {
        const sl = cut(cut(tri, yLo, 1), yHi, -1);
        if (sl.length) { const p = toSim(sl); rast(p, BODY, contact); if (Math.max(...sl.map((q) => q[1])) >= g0 + 1) rast(p, 0.45, barrier); hit++;   // (a wall shuts a space in; a bench or a crate doesn't)
          if (PROBE.length) for (const [px, py] of PROBE) { const one = new Uint8Array(N); rast(p, BODY, one); if (one[(py - Y0) * NX + (px - X0)]) probed.push(`${px},${py}: ${label} / ${(Array.isArray(o.material) ? o.material[0] : o.material)?.name || ''} y ${(ymin - g0).toFixed(2)}..${(ymax - g0).toFixed(2)} at ${p.map((q) => q.map((v) => v.toFixed(2)).join(' ')).join(' | ')}`); } }
      }
      if (ymax > yHi) {   // overhead: what lies over the ground, not a wall seen edge on
        const ux = B[0] - A[0], uy = B[1] - A[1], uz = B[2] - A[2], vx = C[0] - A[0], vy = C[1] - A[1], vz = C[2] - A[2];
        const nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx, nl = Math.hypot(nx, ny, nz) || 1;
        if (Math.abs(ny) / nl > 0.2) { const up = cut(tri, yHi, 1); if (up.length) rast(toSim(up), 0.001, cover); }
      }
    }
    if (hit) drawnBy.set(label, (drawnBy.get(label) || 0) + hit);
  }
  // the cards: their atlas footprints, shrunk as the sim stamps a building's (outdoor.js stamp: 12 % a side)
  const atl = {}; for (const n of ['env', `town-${w.region || 'vale'}`]) atl[n] = (await (await fetch(`/assets/env/${n}.json`)).json()).sprites;
  const wp = { x: 0, y: 0, z: 0 };
  for (const c of cards) {
    const m = /^ember:([a-z-]+):(.+)$/.exec(c.name || ''); if (!m) continue;
    // (a card stands pushed back from its spot by its height below the anchor: world.js standAt)
    const e2 = c.matrixWorld.elements, A = atl[m[1]]?.[m[2]], back = A ? (2 * (A.h - A.ay)) / (16 * Math.SQRT2) / Math.SQRT2 : 0; wp.x = e2[12] - back; wp.z = e2[14] - back;
    const sx = wp.x * 2 + X0, sy = wp.z * 2 + Y0, f = A?.foot;
    if (m[1] === 'prop' || !f) { const i = Math.floor(sx) - X0, j = Math.floor(sy) - Y0; if (i >= 0 && j >= 0 && i < NX && j < NY) card[j * NX + i] = 1; continue; }
    const W = f[2] - f[0], H = f[3] - f[1];
    rast([[sx + f[0] + W * 0.12, sy + f[1] + H * 0.12], [sx + f[2] - W * 0.12, sy + f[1] + H * 0.12], [sx + f[2] - W * 0.12, sy + f[3] - H * 0.12], [sx + f[0] + W * 0.12, sy + f[3] - H * 0.12]], 0, card);
  }
  // the ways the map is entered and the places a walk is sent to: where the drawn world's open ground is flooded from
  const seeds = [[P.x, P.y]];
  for (const a of Object.values(w.arrivals || {})) seeds.push([a.x, a.y]);
  if (w.kind === 'dungeon') for (const r of w.level.rooms || []) seeds.push([r.cx + 0.5, r.cy + 0.5]);
  for (const n of w.npcs || []) seeds.push([n.x + 1.5, n.y + 1.5]);
  const b64 = (a) => { let s2 = ''; const u = new Uint8Array(a.buffer); for (let k = 0; k < u.length; k += 32768) s2 += String.fromCharCode.apply(null, u.subarray(k, k + 32768)); return btoa(s2); };
  const pack = (a) => b64(a);
  return { probed, X0, Y0, NX, NY, g0, tris, meshes: meshes.length, cards: cards.length, seed: s.seed, kind: w.kind, name: w.name, region: w.region, spawn: [P.x, P.y], seeds,
    drawnBy: [...drawnBy.entries()].sort((a, b) => b[1] - a[1]).slice(0, 40),
    walk: pack(walk), contact: pack(contact), barrier: pack(barrier), cover: pack(cover), stair: pack(stair), water: pack(water), card: pack(card), person: pack(person), gh: pack(gh) };
}

// ── in node: the walks, replayed headless on the same map ────────────────────────────────────────────────────────────
/** the hero and two hired companions sent about the map: every tick's positions, by member @param {any} m the map @param {number} seed */
function walks(m, seed, R, X0, Y0, NX, NY, none = false) {
  const sim = createSim(seed, undefined, { scene: 'town', region: m.region || 'vale' });
  sim.state.counters.gold = 1e6; sim.state.party[0].level = m.scene === 'dungeon' ? 40 : 6; sim.tick();
  for (const idx of [0, 1]) { sim.commands.push({ type: 'hire', idx }); sim.tick(); }
  if (m.scene === 'dungeon') for (const p of sim.state.party) { p.level = 40; }
  if (m.scene !== 'town' || m.floor) {
    const site = m.site || 'barrows';
    sim.restore({ ...JSON.parse(JSON.stringify(sim.snapshot())), scene: m.scene, region: m.region || (m.scene === 'dungeon' ? undefined : 'vale'), site, depth: m.floor || 0, floors: [] });
  }
  for (const p of sim.state.party) if (m.scene === 'dungeon') { p.level = 40; p.hp = 1e5; p.maxHp = 1e5; }
  const W0 = sim.world, base = JSON.parse(JSON.stringify(sim.snapshot()));
  const party = () => sim.state.party.map((p, i) => (i === 0 ? sim.state.player : p));
  const out = sim.state.party.map(() => []), cut = sim.state.party.map(() => 0), graze = sim.state.party.map(() => 0);
  const rng = mulberry32(0x9a7e + seed);
  const inExit = (x, y) => W0.kind === 'dungeon' ? !!W0.exitAt && Math.hypot(x - W0.exitAt.x, y - W0.exitAt.y) < 4 || (W0.stairsAt && Math.hypot(x - W0.stairsAt.x, y - W0.stairsAt.y) < 5)
    : (W0.exits || []).some((e) => x >= e.x0 - 3 && x <= e.x1 + 3 && y >= e.y0 - 3 && y <= e.y1 + 3);
  const goals = [];
  for (const d of sim.destinations()) if (Number.isFinite(d.tx) && !inExit(d.tx, d.ty)) goals.push({ type: 'goto', tx: d.tx, ty: d.ty, near: d.near });
  for (const n of W0.npcs || []) goals.push({ type: 'goto', tx: Math.floor(n.x), ty: Math.floor(n.y), near: 1.5 });
  const cells = []; for (let i = 0; i < R.length; i++) if (R[i]) cells.push(i);
  for (let k = 0; k < WALKS && cells.length; k++) { const i = cells[Math.floor(rng() * cells.length)], x = X0 + (i % NX), y = Y0 + Math.floor(i / NX); if (!inExit(x + 0.5, y + 0.5)) goals.push({ type: 'tap', tx: x, ty: y }); }
  let ticks = 0, resets = 0, stalls = 0, W = W0;
  for (const g of none ? [] : goals) {
    sim.commands.push(g);
    for (let t = 0; t < 20 * 90; t++) {
      sim.tick(); ticks++;
      if (sim.world !== W) { sim.restore(base); W = sim.world; resets++; break; }
      party().forEach((u, i) => { if (!u || u.down || !Number.isFinite(u.x)) return; out[i].push(u.x, u.y); if (!isWalkable(W0, u.x, u.y)) cut[i]++;
        else if (!isWalkable(W0, u.x - BODY, u.y - BODY) || !isWalkable(W0, u.x + BODY, u.y - BODY) || !isWalkable(W0, u.x - BODY, u.y + BODY) || !isWalkable(W0, u.x + BODY, u.y + BODY)) graze[i]++; });
      const p = sim.state.player;
      if (!p.path && !sim.battle) { if (p.resume) sim.commands.push({ type: 'resume' }); else if (t > 40) break; }
      if (t === 20 * 90 - 1) stalls++;
    }
  }
  return { goals: goals.length, ticks, resets, stalls, traces: out.map((a) => Float32Array.from(a)), cut, graze, world: W0 };
}

// ── the picture: drawn in the page (it has a canvas and fonts) ───────────────────────────────────────────────────────
function draw({ NX, NY, PX, cls, traces, title, lines }) {
  const HEAD = 92, c = document.createElement('canvas'); c.width = Math.max(NX * PX, 760); c.height = NY * PX + HEAD;
  const g = c.getContext('2d'), img = g.createImageData(NX * PX, NY * PX), d = img.data;
  const COL = [[226, 220, 202], [196, 192, 180], [78, 78, 86], [72, 112, 160], [228, 30, 30], [214, 40, 214], [240, 150, 30], [30, 80, 255], [64, 196, 214], [150, 186, 255], [150, 150, 150], [112, 96, 80]];
  const cl = atob(cls);
  for (let j = 0; j < NY; j++) for (let i = 0; i < NX; i++) {
    const col = COL[cl.charCodeAt(j * NX + i)];
    for (let b = 0; b < PX; b++) for (let a = 0; a < PX; a++) { const o = ((j * PX + b) * NX * PX + i * PX + a) * 4; d[o] = col[0]; d[o + 1] = col[1]; d[o + 2] = col[2]; d[o + 3] = 255; }
  }
  const TC = [[255, 255, 255], [40, 170, 60], [250, 200, 40]];
  traces.forEach((tr, u) => { const a = new Float32Array(Uint8Array.from(atob(tr.pts), (ch) => ch.charCodeAt(0)).buffer);
    const bad = new Uint8Array(Uint8Array.from(atob(tr.bad), (ch) => ch.charCodeAt(0)).buffer);
    for (let k = 0; k < a.length; k += 2) { const x = Math.floor(a[k] * PX), y = Math.floor(a[k + 1] * PX); if (x < 0 || y < 0 || x >= NX * PX || y >= NY * PX) continue;
      const o = (y * NX * PX + x) * 4, col = bad[k >> 1] ? [0, 0, 0] : TC[u % 3]; d[o] = col[0]; d[o + 1] = col[1]; d[o + 2] = col[2]; }
  });
  g.fillStyle = '#16161a'; g.fillRect(0, 0, c.width, HEAD);
  g.putImageData(img, 0, HEAD);
  g.font = 'bold 15px sans-serif'; g.fillStyle = '#fff'; g.fillText(title, 8, 18);
  g.font = '11px sans-serif'; lines.forEach((t, k) => g.fillText(t, 8, 34 + k * 13));
  const KEY = [['through', 4], ['over', 5], ['sunk', 6], ['invisible', 7], ['inv. under cover', 8], ['inv. a step short', 9], ['blocked, drawn', 2], ['water', 3]];
  let kx = 8;
  KEY.forEach(([t, k]) => { g.fillStyle = `rgb(${COL[k]})`; g.fillRect(kx, 76, 10, 10); g.fillStyle = '#ddd'; g.fillText(t, kx + 14, 85); kx += 24 + g.measureText(t).width; });
  return c.toDataURL('image/png');
}

// ── the run ─────────────────────────────────────────────────────────────────────────────────────────────────────────
const unb = (s, T = Uint8Array) => { const b = Buffer.from(s, 'base64'); return new T(b.buffer, b.byteOffset, b.byteLength / T.BYTES_PER_ELEMENT); };
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.css': 'text/css', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.mp3': 'audio/mpeg' };
let srv = null, base = BASE;
if (!base) {
  srv = createServer(async (req, res) => { const p = normalize(join(ROOT, decodeURIComponent(req.url.split('?')[0]))); if (!p.startsWith(ROOT)) { res.writeHead(403); return res.end(); } try { const b = await readFile(p); res.writeHead(200, { 'Content-Type': MIME[extname(p)] || 'application/octet-stream' }); res.end(b); } catch { res.writeHead(404); res.end(); } });
  await new Promise((r) => srv.listen(0, '127.0.0.1', r)); base = `http://127.0.0.1:${srv.address().port}`;
}
const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
await mkdir(OUT, { recursive: true });
const all = [];
for (const name of names) {
  const m = MAPS[name], t0 = Date.now();
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } }), page = await ctx.newPage(), errs = [];
  page.on('pageerror', (e) => errs.push(e.message));
  await page.addInitScript(CATCH);
  const q = new URLSearchParams({ scene: m.scene, ...(m.region ? { region: m.region } : {}), ...(m.site ? { site: m.site } : {}) });
  let r;
  try {
    await page.goto(`${base}/index.html?dev&manual&notitle&world=on&tod=day&${q}`);
    await page.waitForFunction(() => typeof globalThis.__frame === 'function' && !!globalThis.__sim, null, { timeout: 400000 });
    const built = async (n) => { for (let i = 0; i < 1600; i++) { if (await page.evaluate((n) => { globalThis.__frame(16); const h = globalThis.__world3d; return !!h && h.state.loads >= n && h.world?.stats.level >= n && !globalThis.__renderer.transiting; }, n)) return true; await page.waitForTimeout(120); } return false; };
    if (!(await built(1))) throw new Error('the world never built');
    if (m.floor) { await page.evaluate((d) => { const s = globalThis.__sim; s.restore({ ...JSON.parse(JSON.stringify(s.snapshot())), depth: d, floors: [] }); }, m.floor); if (!(await built(2))) throw new Error('the floor never built'); }
    for (let i = 0; i < 40; i++) { await page.evaluate(() => globalThis.__frame(16)); await page.waitForTimeout(40); }   // (the kit's pieces and cards, placed after the level)
    r = await page.evaluate(measure, { BAND, BODY, STEP, PROBE });
    if (PROBE.length) console.log(r.probed.slice(0, 60).join('\n'));
  } catch (e) { console.log(`${name}: ${String(e.message || e).split('\n')[0]}`); all.push({ name, error: String(e.message || e) }); await ctx.close(); continue; }
  const { X0, Y0, NX, NY, g0 } = r, N = NX * NY;
  const A = Object.fromEntries(['walk', 'contact', 'barrier', 'cover', 'stair', 'water', 'card', 'person'].map((k) => [k, unb(r[k])])), gh = unb(r.gh, Float32Array);
  const raised = new Uint8Array(N), sunk = new Uint8Array(N);
  for (let i = 0; i < N; i++) { if (!A.stair[i] && gh[i] > g0 + STEP) raised[i] = 1; if (!A.stair[i] && gh[i] < g0 - STEP && !A.water[i]) sunk[i] = 1; }
  const at = (x, y) => { const i = Math.floor(x) - X0, j = Math.floor(y) - Y0; return i < 0 || j < 0 || i >= NX || j >= NY ? -1 : j * NX + i; };
  const N4 = [1, -1, NX, -NX], nb = (i, k) => { const x = i % NX; if ((k === 0 && x === NX - 1) || (k === 1 && x === 0)) return -1; const j = i + N4[k]; return j < 0 || j >= N ? -1 : j; };
  const flood = (seedsI, ok) => { const seen = new Uint8Array(N), q = new Int32Array(N); let h = 0, t = 0; for (const i of seedsI) if (i >= 0 && ok(i) && !seen[i]) { seen[i] = 1; q[t++] = i; } while (h < t) { const i = q[h++]; for (let k = 0; k < 4; k++) { const j = nb(i, k); if (j >= 0 && !seen[j] && ok(j)) { seen[j] = 1; q[t++] = j; } } } return seen; };
  // R: what the sim lets the party reach from the spawn; open: what the drawn world leaves open from the same places
  const R = flood([at(r.spawn[0], r.spawn[1])], (i) => A.walk[i] === 1);
  const open = flood(r.seeds.map(([x, y]) => at(x, y)), (i) => !A.barrier[i] && !raised[i]);
  const solid = new Uint8Array(N);   // drawn at a figure's height (or shut in, or raised)
  for (let i = 0; i < N; i++) if (A.barrier[i] || A.contact[i] || raised[i] || A.card[i] || (!open[i] && !A.water[i])) solid[i] = 1;
  // distance (4-way steps) to the nearest thing drawn solid, for a blocked tile's "a step short"
  const dist = new Uint16Array(N).fill(65535); { const q = new Int32Array(N); let h = 0, t = 0; for (let i = 0; i < N; i++) if (solid[i] || A.water[i]) { dist[i] = 0; q[t++] = i; } while (h < t) { const i = q[h++]; for (let k = 0; k < 4; k++) { const j = nb(i, k); if (j >= 0 && dist[j] > dist[i] + 1) { dist[j] = dist[i] + 1; q[t++] = j; } } } }
  // the classes: 0 clear (R), 1 clear (not reached), 2 blocked and drawn, 3 water, 4 through, 5 over, 6 sunk, 7 invisible, 8 under cover, 9 a step short, 10 a person, 11 a card
  const cls = new Uint8Array(N), C = { through: 0, over: 0, sunk: 0, invisible: 0, covered: 0, short: 0, reach: 0 };
  for (let i = 0; i < N; i++) {
    if (A.walk[i]) {
      if (!R[i]) { cls[i] = 1; continue; }
      C.reach++;
      if (raised[i]) { cls[i] = 5; C.over++; }
      else if (A.contact[i] || (!open[i] && !A.water[i] && !A.card[i])) { cls[i] = 4; C.through++; }
      else if (sunk[i]) { cls[i] = 6; C.sunk++; }
      else cls[i] = 0;
      continue;
    }
    if (A.person[i]) { cls[i] = 10; continue; }
    if (A.water[i] && !raised[i]) { cls[i] = 3; continue; }   // (a wall raised as ground Luminati won't walk is a wall, not water)
    if (solid[i] || sunk[i]) { cls[i] = A.card[i] && !A.barrier[i] ? 11 : 2; continue; }
    let edge = false; for (let k = 0; k < 4; k++) { const j = nb(i, k); if (j >= 0 && R[j]) edge = true; }
    if (!edge) { cls[i] = 2; continue; }
    if (dist[i] <= 1) { cls[i] = 9; C.short++; } else if (A.cover[i]) { cls[i] = 8; C.covered++; } else { cls[i] = 7; C.invisible++; }
  }
  let walked = null;
  {
    walked = walks(m, r.seed, R, X0, Y0, NX, NY, NO_WALKS);
    // (the same map? the sim's grid, the people's tiles aside)
    let diff = 0; for (let i = 0; i < N; i++) { if (A.person[i]) continue; const x = X0 + (i % NX), y = Y0 + Math.floor(i / NX); if ((isWalkable(walked.world, x + 0.5, y + 0.5) ? 1 : 0) !== A.walk[i]) diff++; }
    walked.diff = diff;
  }
  const traces = [], T = { samples: 0, through: 0, over: 0, cut: 0, graze: [], tiles: new Set() };
  if (walked && !NO_WALKS) walked.traces.forEach((a, u) => {
    const bad = new Uint8Array(a.length >> 1), pts = new Float32Array(a.length);
    for (let k = 0; k < a.length; k += 2) {
      const i = at(a[k], a[k + 1]); pts[k] = a[k] - X0; pts[k + 1] = a[k + 1] - Y0; T.samples++;
      if (i < 0) continue;
      if (raised[i] && A.walk[i]) { T.over++; bad[k >> 1] = 1; T.tiles.add(i); }
      else if (A.walk[i] && (A.contact[i] || (!open[i] && !A.water[i] && !A.card[i]))) { T.through++; bad[k >> 1] = 1; T.tiles.add(i); }
    }
    T.cut += walked.cut[u]; T.graze.push(walked.graze[u]);
    traces.push({ pts: Buffer.from(pts.buffer).toString('base64'), bad: Buffer.from(bad.buffer).toString('base64') });
  });
  // what the sim has there: the struct whose footprint (and a tile round it) holds each bad tile, the smallest first;
  // a dungeon's prop by its kind
  const world = walked ? walked.world : null, blame = new Map(), owner = new Int32Array(N).fill(-1), structs = world ? (world.structs || []) : [];
  if (world) {
    const order = structs.map((st, k) => [k, ENV_FOOT[st.id]]).filter(([, f]) => f).sort((a, b) => (a[1][2] - a[1][0]) * (a[1][3] - a[1][1]) - (b[1][2] - b[1][0]) * (b[1][3] - b[1][1]));
    for (const [k, f] of order) { const st = structs[k]; for (let y = Math.floor(st.y + f[1] - 1); y <= Math.floor(st.y + f[3] + 1); y++) for (let x = Math.floor(st.x + f[0] - 1); x <= Math.floor(st.x + f[2] + 1); x++) { const i = at(x, y); if (i >= 0 && owner[i] < 0) owner[i] = k; } }
  }
  const KEYS = { 4: 'through', 5: 'over', 6: 'sunk', 7: 'invisible', 8: 'covered', 9: 'short' };
  for (let i = 0; i < N; i++) {
    const k = KEYS[cls[i]]; if (!k) continue;
    let who = owner[i] >= 0 ? structs[owner[i]].id.replace(/_\d+$/, '') : null;
    if (!who && world) { const x = X0 + (i % NX), y = Y0 + Math.floor(i / NX); const pr = world.props?.get(`${x},${y}`); who = pr ? `prop:${pr}` : world.kind === 'dungeon' ? 'floor' : '(none)'; }
    const b = blame.get(who) || blame.set(who, { through: 0, over: 0, sunk: 0, invisible: 0, covered: 0, short: 0, walked: 0, at: [] }).get(who); b[k]++;
    if (b.at.length < 4 && (k === 'through' || k === 'over' || k === 'invisible') && !b.at.some(([x, y]) => Math.abs(x - X0 - (i % NX)) < 6 && Math.abs(y - Y0 - Math.floor(i / NX)) < 6)) b.at.push([X0 + (i % NX), Y0 + Math.floor(i / NX)]);
  }
  for (const i of T.tiles) { const who = owner[i] >= 0 ? structs[owner[i]].id.replace(/_\d+$/, '') : '(none)'; const b = blame.get(who) || blame.set(who, { through: 0, over: 0, sunk: 0, invisible: 0, covered: 0, short: 0, walked: 0, at: [] }).get(who); b.walked++; }
  const worst = [...blame.entries()].map(([k, b]) => [k, b, b.through + b.over + b.sunk + b.invisible]).sort((a, b) => b[2] - a[2]).slice(0, 14).map(([k, b]) => ({ what: k, ...b }));
  // the trees: how far out from its middle what's drawn of one stands at a figure's height, against how far the sim walls
  const trees = {};
  for (const st of structs) {
    const mk = /^(pine|oak|autumn|dead|grove|birch|alder|willow|carr)_/.exec(st.id), f = ENV_FOOT[st.id]; if (!mk || !f) continue;
    const cx = st.x + (f[0] + f[2]) / 2, cy = st.y + (f[1] + f[3]) / 2; let drawn = 0, walled = 0, crown = 0;
    for (let y = Math.floor(st.y + f[1]); y <= Math.floor(st.y + f[3]); y++) for (let x = Math.floor(st.x + f[0]); x <= Math.floor(st.x + f[2]); x++) {
      const i = at(x, y); if (i < 0) continue; const d = Math.hypot(x + 0.5 - cx, y + 0.5 - cy);
      if (A.contact[i] && d > drawn) drawn = d; if (!A.walk[i] && d > walled) walled = d; if (A.cover[i] && d > crown) crown = d;
    }
    const t = trees[mk[1]] || (trees[mk[1]] = { n: 0, drawn: 0, crown: 0, walled: 0, foot: 0 }); t.n++; t.drawn += drawn; t.crown += crown; t.walled += walled; t.foot += Math.max(f[2] - f[0], f[3] - f[1]) / 2;
  }
  for (const t of Object.values(trees)) { t.drawn = +(t.drawn / t.n).toFixed(2); t.crown = +(t.crown / t.n).toFixed(2); t.walled = +(t.walled / t.n).toFixed(2); t.foot = +(t.foot / t.n).toFixed(2); }
  const pct = (n, d) => (d ? ((100 * n) / d).toFixed(2) : '0.00');
  const res = { name, ...m, size: [NX, NY], tris: r.tris, meshes: r.meshes, cards: r.cards, reach: C.reach, through: C.through, over: C.over, sunk: C.sunk, invisible: C.invisible, covered: C.covered, short: C.short,
    worst, trees, walks: !NO_WALKS ? { goals: walked.goals, ticks: walked.ticks, resets: walked.resets, stalls: walked.stalls, gridDiff: walked.diff, samples: T.samples, through: T.through, over: T.over, cut: T.cut, graze: T.graze, badTiles: T.tiles.size } : null, drawnBy: r.drawnBy.slice(0, 12), errors: errs.slice(0, 5) };
  const lines = [
    `reach ${C.reach} tiles · through ${C.through} · over ${C.over} · sunk ${C.sunk} · invisible ${C.invisible} (+${C.covered} under cover, +${C.short} a step short)`,
    !NO_WALKS ? `walks: ${walked.goals} goals, ${T.samples} samples (hero white, companions green, yellow), on drawn solid ${T.through + T.over} (${pct(T.through + T.over, T.samples)} %, black), centre on a blocked tile ${T.cut}` : 'no walks',
    `${r.meshes} meshes, ${r.tris} triangles near the ground, ${r.cards} cards; ${PX} px a tile, origin ${X0},${Y0}`,
  ];
  const png = await page.evaluate(draw, { NX, NY, PX, cls: Buffer.from(cls).toString('base64'), traces, title: `${name}: ${r.name || ''}`, lines });
  await writeFile(join(OUT, `${name}.png`), Buffer.from(png.split(',')[1], 'base64'));
  await ctx.close();
  all.push(res);
  console.log(`${name} (${((Date.now() - t0) / 1000).toFixed(0)} s): reach ${C.reach}, through ${C.through}, over ${C.over}, sunk ${C.sunk}, invisible ${C.invisible} (+${C.covered} covered, +${C.short} short)` +
    `\n  worst: ${worst.slice(0, 8).map((b) => `${b.what} (${['through', 'over', 'sunk', 'invisible', 'walked'].filter((k) => b[k]).map((k) => `${k} ${b[k]}`).join(', ')}${b.at.length ? ' at ' + b.at.map((q) => q.join(',')).join(' ') : ''})`).join('; ')}` +
    (!NO_WALKS ? `\n  walks ${walked.goals} goals (${walked.resets} left the map, ${walked.stalls} never arrived), ${T.samples} samples, on drawn solid ${T.through + T.over} (${pct(T.through + T.over, T.samples)} %: through ${T.through}, over ${T.over}), cut ${T.cut}, a body on a blocked tile (hero, companions) ${T.graze.join('/')}, grid diff ${walked.diff}` : '') + (errs.length ? `; ${errs.length} page errors` : ''));
}
await writeFile(join(OUT, 'summary.json'), JSON.stringify(all, null, 1));
if (JSON_OUT) await writeFile(JSON_OUT, JSON.stringify(all, null, 1));
await browser.close(); if (srv) srv.close();
