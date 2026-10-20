// @ts-check
// view.js — the Frontier drawn (docs/frontier-proposal.md §5): a top-down view of the sim's land that zooms from the
// game's own scale out to the whole of the Old Provinces, in three tiers that cross-fade:
//   Near (≥ 8 px a tile)   the land painted a chunk at a time (8 px a tile, cached), the game's own baked sprites on it
//                          (trees, rocks, peaks, ruins, the towns' buildings, the party and the foes, animated), each
//                          foe's level in its con colour, the locked area's edge, the blows and the numbers
//   Mid  (1.5–12)          the land as a map in the wall map's hand, a chunk at a time (2 px a tile), every camp a dot
//   Far  (< 1.5)           the Guild's wall map itself (assets/maps/old-provinces.jpg), which the land is laid out from
// Presentation only: it reads the sim and never writes it; what it remembers (where an actor was a tick ago, its clip,
// the floating numbers) is kept here, keyed by the sim's objects.

import { CH, G } from '../sim/frontier/land.js';
import { K, TOWNS, SITES } from '../sim/frontier/geo.js';

const NEAR_PX = 8, MID_PX = 2;
const DIRS = 8;
// the near ground, dusk-dark (the game's own light is dusk under the title)
const NEAR = { [G.SEA]: '#1f3442', [G.LAKE]: '#28424f', [G.RIVER]: '#2f4d59', [G.BRIDGE]: '#6b5238', [G.ROAD]: '#76624a', [G.TRACK]: '#6a5a44',
  [G.TOWN]: '#69645a', [G.MEADOW]: '#4b5933', [G.FIELD]: '#6c6838', [G.FOREST]: '#37472a', [G.HILLS]: '#5a5843', [G.ROCK]: '#4d4842',
  [G.MARSH]: '#45503a', [G.POOL]: '#2a3f3f', [G.ASH]: '#4b4541', [G.TAILINGS]: '#7a3a24', [G.SNOW]: '#aeb3bc', [G.CRATER]: '#3a3436',
  [G.SAND]: '#86795a', [G.WALL]: '#38322d', [G.PINES]: '#33432d' };
// the map's ground, in the wall map's hand (tools/worldmap/minimap.mjs land-<region>.jpg)
const MAP = { [G.SEA]: '#8fa4a6', [G.LAKE]: '#8fa4a6', [G.RIVER]: '#7f979b', [G.BRIDGE]: '#8a6a48', [G.ROAD]: '#a4583c', [G.TRACK]: '#9c7b55',
  [G.TOWN]: '#6e5e4a', [G.MEADOW]: '#e3d2aa', [G.FIELD]: '#e0c68a', [G.FOREST]: '#aeb282', [G.HILLS]: '#d2c098', [G.ROCK]: '#9c8f7e',
  [G.MARSH]: '#c4c296', [G.POOL]: '#7f9290', [G.ASH]: '#cbbfab', [G.TAILINGS]: '#b8643a', [G.SNOW]: '#f0ede4', [G.CRATER]: '#8f857b',
  [G.SAND]: '#e4d3a2', [G.WALL]: '#3b2f24', [G.PINES]: '#a2ab86' };
const WET = new Set([G.SEA, G.LAKE, G.RIVER, G.POOL, G.TAILINGS]);
export const CON = { grey: '#9a968e', green: '#7fc46a', gold: '#f0c860', orange: '#f08c3a', red: '#f0503a' };
const rgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const NEAR_RGB = Object.fromEntries(Object.entries(NEAR).map(([k, v]) => [k, rgb(v)])), MAP_RGB = Object.fromEntries(Object.entries(MAP).map(([k, v]) => [k, rgb(v)]));

// every foe kind's baked look (renderer.js ENEMY_ACTOR)
const ACTOR = { warrior: 'skeleton_warrior', minion: 'skeleton_minion', rogue: 'skeleton_rogue', mage: 'skeleton_mage',
  cutthroat: 'redhand_cutthroat', brute: 'redhand_brute', crossbow: 'redhand_crossbow', acolyte: 'cinder_acolyte',
  goblin: 'goblin_skirmisher', bruiser: 'goblin_bruiser', archer: 'goblin_archer', hexer: 'goblin_hexer',
  fenghoul: 'fen_ghoul', reedcutter: 'reed_cutter', fowler: 'reed_fowler', bogwitch: 'bog_witch', harvester: 'cult_harvester', drowned: 'drowned_brother', cantor: 'drowned_cantor' };
// their names (the Stage's, src/dev/stage.js)
export const KIND_NAME = { warrior: 'Ashbound warrior', minion: 'Ashbound minion', rogue: 'Ashbound archer', mage: 'Ashbound mage', cutthroat: 'Cutthroat', brute: 'Brute',
  crossbow: 'Crossbowman', acolyte: 'Acolyte', goblin: 'Goblin', bruiser: 'Bruiser', archer: 'Goblin archer', hexer: 'Hexer', fenghoul: 'Fen ghoul',
  reedcutter: 'Reed-cutter', fowler: 'Fowler', bogwitch: 'Bog-witch', harvester: 'Harvester', drowned: 'Drowned brother', cantor: 'Cantor' };
const TREE = { oak: ['oak_1', 'oak_2', 'oak_3', 'oak_4'], birch: ['birch_1', 'birch_2', 'birch_3'], autumn: ['autumn_1', 'autumn_2', 'autumn_3'], grove: ['grove_1', 'grove_2', 'grove_3', 'grove_4', 'grove_5', 'grove_6'],
  pine: ['pine_1', 'pine_2', 'pine_3', 'pine_4', 'pine_5', 'pine_6'], dead: ['dead_1', 'dead_2'], willow: ['willow_1', 'willow_2'], carr: ['carr_1', 'carr_2'],
  rock: ['rock_C', 'rock_E', 'rock_D'], stone: ['rock_A', 'rock_B', 'rock_F', 'rock_G'], slag: ['rock_H', 'rock_E'], reeds: ['ug_grass_1', 'ug_grass_2', 'ug_fern'],
  brush: ['ug_flowers_1', 'ug_flowers_2', 'ug_clover', 'ug_bush', 'ug_plant', 'ug_grass_1'], peak: ['mountain_A', 'mountain_B', 'mountain_B_grass_trees', 'mountain_A_grass_trees'], massif: ['mountain_massif_A', 'mountain_massif_B', 'mountain_massif_C'] };
const SITE_LOOK = { barrows: 'ruin', wickham_keep: 'keep', sunken_chapel: 'chapelruin', cold_seam: 'mine', slag_tunnels: 'mine', assay_yards: 'lumbermill', cinderworks: 'mine', magma_vault: 'mine',
  forgehall: 'warren', drowned_mole: 'ruin', lamp_fort: 'keep', highmarch_road: 'ruin', hollin_barn: 'watermill', charcoal_clearing: 'lumbermill', antler_stones: 'ruin', tally_house: 'chapelruin',
  thornway: 'ruin', root_granary: 'warren', frozen_hospice: 'chapelruin', pilgrims_stair: 'ruin', soulcracks: 'ruin', praetory: 'keep', glass_keep: 'keep', the_lip: 'ruin',
  toadking_mound: 'boathall', canal_locks: 'lockhall', drowned_abbey: 'abbey' };
const townSet = (id) => (id === 'saltmere' || id === 'reedholm' ? 'fens' : id === 'ashgate' || id === 'kells' ? 'reach' : id === 'frosthold' ? 'heights' : 'vale');

/** @param {HTMLCanvasElement} canvas @param {any} fr the sim (sim/frontier/frontier.js) */
export function createView(canvas, fr) {
  const g = /** @type {CanvasRenderingContext2D} */ (canvas.getContext('2d'));
  const land = fr.land;
  let W = 0, H = 0, dpr = 1;
  const cam = { x: 0, y: 0, s: 16 };
  const opts = { levels: false, fog: true };

  // ── assets ────────────────────────────────────────────────────────────────────────────────────────────────────────
  const loadImg = (/** @type {string} */ url) => new Promise((res) => { const i = new Image(); i.onload = () => res(i); i.onerror = () => res(null); i.src = url; });
  const atlases = new Map();   // actor name → { img, meta } | 'loading'
  function actorAtlas(name) {
    const a = atlases.get(name); if (a) return a === 'loading' ? null : a;
    atlases.set(name, 'loading');
    fetch(`./assets/actors/${name}.json`).then((r) => r.json()).then(async (meta) => { const img = await loadImg(`./assets/actors/${name}.alb.png`); atlases.set(name, img ? { img, meta } : null); }).catch(() => atlases.set(name, null));
    return null;
  }
  /** @type {Record<string, { img: HTMLImageElement, sprites: any }>} */
  const sheets = {};
  for (const s of ['env', 'town-vale', 'town-fens', 'town-reach', 'town-heights']) fetch(`./assets/env/${s}.json`).then((r) => r.json()).then(async (j) => { const img = await loadImg(`./assets/env/${s}.alb.png`); if (img) sheets[s] = { img, sprites: j.sprites }; }).catch(() => {});
  /** @type {HTMLImageElement | null} */ let wall = null;
  loadImg('./assets/maps/old-provinces.jpg').then((i) => { wall = /** @type {any} */ (i); });
  const sprite = (sheet, id) => { const S = sheets[sheet]; return S && S.sprites[id] ? { img: S.img, s: S.sprites[id] } : null; };

  // ── the chunk canvases, near and mid, made a few a frame ──────────────────────────────────────────────────────────
  const near = new Map(), mid = new Map(), NEAR_MAX = 40, MID_MAX = 420;
  const want = [];
  const noise = new Float32Array(64 * 64); { let s = 0x9e37; for (let i = 0; i < noise.length; i++) { s = (s * 1103515245 + 12345) >>> 0; noise[i] = (s >>> 8) / 16777216; } }
  const smooth = new Float32Array(64 * 64); for (let y = 0; y < 64; y++) for (let x = 0; x < 64; x++) { let t = 0; for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) t += noise[((y + dy) & 63) * 64 + ((x + dx) & 63)]; smooth[y * 64 + x] = t / 25; }
  function paintNear(cx, cy) {
    const P = NEAR_PX, n = CH * P, cv = document.createElement('canvas'); cv.width = n; cv.height = n;
    const cg = /** @type {CanvasRenderingContext2D} */ (cv.getContext('2d')), im = cg.createImageData(n, n), d = im.data;
    const c = land.chunk(cx, cy), X0 = cx * CH, Y0 = cy * CH;
    const gAt = (tx, ty) => (tx >= 0 && ty >= 0 && tx < CH && ty < CH ? c.ground[ty * CH + tx] : land.ground(X0 + tx + 0.5, Y0 + ty + 0.5));
    const sampled = new Uint8Array(n * n);
    for (let py = 0; py < n; py++) for (let px = 0; px < n; px++) {
      const ni = ((py + cy * 17) & 63) * 64 + ((px + cx * 29) & 63), jx = (smooth[ni] - 0.5) * 9, jy = (smooth[(ni + 2111) & 4095] - 0.5) * 9;
      sampled[py * n + px] = gAt(Math.floor((px + jx) / P), Math.floor((py + jy) / P));
    }
    for (let py = 0; py < n; py++) for (let px = 0; px < n; px++) {
      const i = py * n + px, gg = sampled[i], base = NEAR_RGB[gg] || NEAR_RGB[G.MEADOW], ni = ((py * 3 + cy * 7) & 63) * 64 + ((px * 3 + cx * 11) & 63);
      let k = 0.86 + noise[ni] * 0.16 + (smooth[((py >> 2) & 63) * 64 + ((px >> 2) & 63)] - 0.5) * 0.25;
      if (WET.has(gg)) {
        const up = py ? sampled[i - n] : gg, lf = px ? sampled[i - 1] : gg, dn = py < n - 1 ? sampled[i + n] : gg;
        if (!WET.has(up) || !WET.has(lf)) k *= 0.55; else if (!WET.has(dn)) k *= 1.18;
        else if (((px + py * 3 + Math.floor(noise[ni] * 9)) % 23) === 0) k *= 1.25;           // a glint on the water
      } else if (gg === G.ROAD || gg === G.TRACK) { if (((px + (py >> 1)) % 7) === 0) k *= 0.88; }
      else if (gg === G.FIELD) { if (((py >> 1) % 3) === 0) k *= 0.85; }
      else if (gg === G.WALL) { if ((px % 8) === 0 || (py % 6) === 0) k *= 0.7; }
      else if (gg === G.TOWN) { if ((px % 6) === 0 || ((py + (px >> 3) * 3) % 5) === 0) k *= 0.82; }
      else { const up = py ? sampled[i - n] : gg; if (WET.has(up)) k *= 0.7; }                   // the bank under the water's edge
      d[i * 4] = Math.min(255, base[0] * k); d[i * 4 + 1] = Math.min(255, base[1] * k); d[i * 4 + 2] = Math.min(255, base[2] * k); d[i * 4 + 3] = 255;
    }
    cg.putImageData(im, 0, 0);
    return cv;
  }
  function paintMid(cx, cy) {
    const P = MID_PX, n = CH * P, cv = document.createElement('canvas'); cv.width = n; cv.height = n;
    const cg = /** @type {CanvasRenderingContext2D} */ (cv.getContext('2d')), im = cg.createImageData(n, n), d = im.data;
    const c = land.chunk(cx, cy);
    for (let py = 0; py < n; py++) for (let px = 0; px < n; px++) {
      const t = Math.floor(py / P) * CH + Math.floor(px / P), g0 = c.ground[t], gg = g0 === G.ROAD || g0 === G.TRACK || g0 === G.TOWN || g0 === G.WALL ? G.MEADOW : g0 === G.BRIDGE ? G.RIVER : g0, base = MAP_RGB[gg] || MAP_RGB[G.MEADOW], i = py * n + px;   // (the roads are drawn as lines, below)
      let k = 0.96 + noise[((py + cy * 5) & 63) * 64 + ((px + cx * 3) & 63)] * 0.08;
      if (WET.has(gg) && gg !== G.TAILINGS) { const up = py >= P ? c.ground[t - CH] : gg, lf = px >= P ? c.ground[t - 1] : gg; if ((!WET.has(up) && py % P === 0) || (!WET.has(lf) && px % P === 0)) k = 0.42; }
      d[i * 4] = base[0] * k; d[i * 4 + 1] = base[1] * k; d[i * 4 + 2] = base[2] * k; d[i * 4 + 3] = 255;
    }
    cg.putImageData(im, 0, 0);
    // the roads, ruled as the wall map rules them: the imperial red dashed, the tracks dotted (dashes carried across the
    // chunks' edges by each segment's distance along its road)
    const X0 = cx * CH, Y0 = cy * CH;
    for (const r of land.roads) {
      let along = 0;
      for (let i = 0; i + 1 < r.line.length; i++) {
        const [ax, ay] = r.line[i], [bx, by] = r.line[i + 1], L = Math.hypot(bx - ax, by - ay);
        if (Math.max(ax, bx) >= X0 - 4 && Math.min(ax, bx) <= X0 + CH + 4 && Math.max(ay, by) >= Y0 - 4 && Math.min(ay, by) <= Y0 + CH + 4) {
          const imp = r.kind === 'imperial';
          cg.setLineDash(imp ? [10, 6] : [2, 4]); cg.lineDashOffset = -along * P; cg.lineCap = 'butt';
          cg.strokeStyle = imp ? 'rgba(154,58,34,0.9)' : 'rgba(59,47,36,0.7)'; cg.lineWidth = imp ? 2.4 : 1.4;
          cg.beginPath(); cg.moveTo((ax - X0) * P, (ay - Y0) * P); cg.lineTo((bx - X0) * P, (by - Y0) * P); cg.stroke();
        }
        along += L;
      }
    }
    cg.setLineDash([]);
    // the towns as the wall map draws a walled town: a ring of wall with its towers, roofs inside
    for (const t of TOWNS) {
      const x = (t.x * K - X0) * P, y = (t.y * K - Y0) * P, r = t.r * P;
      if (x < -r - 4 || y < -r - 4 || x > n + r + 4 || y > n + r + 4) continue;
      cg.beginPath(); cg.arc(x, y, r, 0, 6.2832); cg.fillStyle = '#e6d6b0'; cg.fill(); cg.lineWidth = 2.6; cg.strokeStyle = '#3b2f24'; cg.stroke();
      for (let i = 0; i < 8; i++) { const a = i / 8 * 6.2832; cg.fillStyle = '#5a4a3c'; cg.beginPath(); cg.arc(x + Math.cos(a) * r, y + Math.sin(a) * r, 2.6, 0, 6.2832); cg.fill(); }
      for (let i = 0; i < 7; i++) { const a = i / 7 * 6.2832 + 0.4, d = r * (i % 2 ? 0.55 : 0.32), w = r * 0.22, h = r * 0.15; cg.fillStyle = '#ad7a5c'; cg.fillRect(x + Math.cos(a) * d - w / 2, y + Math.sin(a) * d - h / 2, w, h); cg.lineWidth = 0.8; cg.strokeRect(x + Math.cos(a) * d - w / 2, y + Math.sin(a) * d - h / 2, w, h); }
    }
    // the marks: crowns, peaks, reeds, in the hand's ink
    cg.lineWidth = 0.8; cg.strokeStyle = 'rgba(59,47,36,0.75)';
    for (const f of c.feats) {
      const x = (f.x - cx * CH) * P, y = (f.y - cy * CH) * P;
      if (f.k === 'peak' || f.k === 'massif') { const h = f.k === 'massif' ? 13 : 9; cg.beginPath(); cg.moveTo(x - h * 0.8, y + 2); cg.lineTo(x, y - h); cg.lineTo(x + h * 0.8, y + 2); cg.closePath(); cg.fillStyle = '#d3c5a2'; cg.fill(); cg.stroke(); cg.beginPath(); cg.moveTo(x, y - h); cg.lineTo(x + h * 0.8, y + 2); cg.lineTo(x + h * 0.15, y + 2); cg.closePath(); cg.fillStyle = 'rgba(59,47,36,0.3)'; cg.fill(); }
      else if (f.k === 'pine') { cg.beginPath(); cg.moveTo(x - 2.5, y + 2); cg.lineTo(x, y - 5); cg.lineTo(x + 2.5, y + 2); cg.closePath(); cg.fillStyle = '#9fa882'; cg.fill(); cg.stroke(); }
      else if (TREE[f.k] && f.k !== 'reeds' && f.k !== 'brush' && f.k !== 'stone' && f.k !== 'rock' && f.k !== 'slag' && f.k !== 'dead') { cg.beginPath(); cg.arc(x, y - 1.5, f.k === 'grove' ? 4 : 3, 0, 6.2832); cg.fillStyle = f.k === 'autumn' ? '#c9a26e' : '#aab07e'; cg.fill(); cg.stroke(); }
      else if (f.k === 'dead') { cg.beginPath(); cg.moveTo(x, y + 2); cg.lineTo(x, y - 3); cg.moveTo(x, y - 1); cg.lineTo(x - 2, y - 3); cg.stroke(); }
      else if (f.k === 'reeds' && f.v < 0.5) { cg.beginPath(); cg.moveTo(x - 2, y); cg.lineTo(x - 1, y - 3); cg.moveTo(x, y); cg.lineTo(x, y - 3.5); cg.moveTo(x + 2, y); cg.lineTo(x + 1, y - 3); cg.stroke(); }
      else if (f.k === 'rock' || f.k === 'slag') { cg.beginPath(); cg.arc(x, y, 1.6, 0, 6.2832); cg.fillStyle = f.k === 'slag' ? '#4a4440' : '#ada392'; cg.fill(); }
      else if (f.k === 'beacon') { cg.fillStyle = '#3b2f24'; cg.fillRect(x - 1.5, y - 6, 3, 7); }
      else if (f.k === 'site') { cg.beginPath(); cg.moveTo(x - 5, y + 4); cg.lineTo(x, y - 6); cg.lineTo(x + 5, y + 4); cg.closePath(); cg.fillStyle = '#3b2f24'; cg.fill(); }
    }
    return cv;
  }
  const keyOf = (cx, cy) => cy * land.CW + cx;
  function getChunk(map, cx, cy, max) {
    const k = keyOf(cx, cy), c = map.get(k);
    if (c) { map.delete(k); map.set(k, c); return c; }
    if (!want.some((w) => w[0] === map && w[1] === cx && w[2] === cy)) want.push([map, cx, cy, max]);
    return null;
  }
  function make(budgetMs) {
    const t0 = performance.now();
    // nearest the middle first
    want.sort((a, b) => Math.hypot((a[1] + 0.5) * CH - cam.x, (a[2] + 0.5) * CH - cam.y) - Math.hypot((b[1] + 0.5) * CH - cam.x, (b[2] + 0.5) * CH - cam.y));
    while (want.length && performance.now() - t0 < budgetMs) {
      const [map, cx, cy, max] = want.shift();
      map.set(keyOf(cx, cy), map === near ? paintNear(cx, cy) : paintMid(cx, cy));
      if (map.size > max) map.delete(map.keys().next().value);
    }
    want.length = Math.min(want.length, 200);
  }

  // ── where things were a tick ago (interpolation), and their clips ────────────────────────────────────────────────
  const prev = new WeakMap(), anim = new WeakMap();
  function beforeTick() { for (const m of fr.state.party) prev.set(m, [m.x, m.y]); for (const f of fr.foes()) prev.set(f, [f.x, f.y]); }
  const at = (u, a) => { const p = prev.get(u); return p ? [p[0] + (u.x - p[0]) * a, p[1] + (u.y - p[1]) * a] : [u.x, u.y]; };

  // ── what happened: numbers, sparks, toasts ──────────────────────────────────────────────────────────────────────
  /** @type {any[]} */ const fx = [];
  const now = () => performance.now() / 1000;
  fr.bus.on('hit', (e) => { fx.push({ t: now(), k: 'num', x: e.x, y: e.y, s: String(e.amount), c: e.party ? '#ff7a62' : e.crit ? '#ffd27a' : '#f2ead8', big: e.crit });
    fx.push({ t: now(), k: e.ranged ? 'shot' : 'spark', x: e.x, y: e.y, ax: e.ax, ay: e.ay, c: e.party ? '#ff6a50' : '#ffd890' }); });
  fr.bus.on('miss', (e) => fx.push({ t: now(), k: 'num', x: e.x, y: e.y, s: 'miss', c: '#bdb4a4' }));
  fr.bus.on('heal', (e) => { fx.push({ t: now(), k: 'num', x: e.x, y: e.y, s: '+' + e.amount, c: '#8fe07a' }); fx.push({ t: now(), k: 'mend', x: e.x, y: e.y }); });
  fr.bus.on('kill', (e) => { if (e.xp) fx.push({ t: now(), k: 'num', x: e.x, y: e.y - 1.2, s: `+${e.xp} xp`, c: '#e0b0ff' }); });
  fr.bus.on('respawn', (e) => fx.push({ t: now(), k: 'rise', x: e.x, y: e.y }));
  fr.bus.on('aggro', (e) => fx.push({ t: now(), k: 'bang', x: e.x, y: e.y }));

  // ── drawing ───────────────────────────────────────────────────────────────────────────────────────────────────────
  function resize() {
    dpr = Math.min(2, window.devicePixelRatio || 1); W = canvas.clientWidth; H = canvas.clientHeight;
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
  }
  const sx = (x) => (x - cam.x) * cam.s + W / 2, sy = (y) => (y - cam.y) * cam.s + H * 0.48;
  /** a screen point → tiles */
  const toTile = (px, py) => ({ x: (px - W / 2) / cam.s + cam.x, y: (py - H * 0.48) / cam.s + cam.y });
  const smoothstep = (a, b, v) => { const t = Math.max(0, Math.min(1, (v - a) / (b - a))); return t * t * (3 - 2 * t); };

  function drawActor(u, x, y, atlasName, opt) {
    const A = actorAtlas(atlasName), k = cam.s / 16, X = sx(x), Y = sy(y);
    g.globalAlpha = opt.alpha;
    g.fillStyle = 'rgba(10,6,14,0.35)'; g.beginPath(); g.ellipse(X, Y, 9 * k * (opt.big || 1), 3.5 * k * (opt.big || 1), 0, 0, 6.2832); g.fill();
    if (opt.ring) { g.strokeStyle = opt.ring; g.lineWidth = Math.max(1.5, 2 * k); g.beginPath(); g.ellipse(X, Y, 11 * k * (opt.big || 1), 4.5 * k * (opt.big || 1), 0, 0, 6.2832); g.stroke(); }
    if (!A) { g.fillStyle = opt.token || '#ccc'; g.beginPath(); g.arc(X, Y - 18 * k, 8 * k, 0, 6.2832); g.fill(); g.globalAlpha = 1; return; }
    const m = A.meta, st = anim.get(u) || { clip: '', t0: 0 }, clip = opt.clip in m.clips ? opt.clip : 'idle';
    if (st.clip !== clip) { st.clip = clip; st.t0 = now(); anim.set(u, st); }
    const C = m.clips[clip], t = now() - st.t0, f = C.once ? Math.min(C.len - 1, Math.floor(t * C.fps)) : Math.floor(t * C.fps + (opt.seed || 0) * C.len) % C.len;
    let dir = Math.round(Math.atan2(u.fy || 1, u.fx || 0) / (Math.PI / 4)); dir = ((dir % DIRS) + DIRS) % DIRS;
    const sc = k * (opt.big || 1);
    g.drawImage(A.img, (C.start + f) * m.cw, dir * m.ch, m.cw, m.ch, X - m.ax * sc, Y - m.ay * sc, m.cw * sc, m.ch * sc);
    if (opt.flash) { g.globalAlpha = opt.alpha * 0.5; g.globalCompositeOperation = 'lighter'; g.drawImage(A.img, (C.start + f) * m.cw, dir * m.ch, m.cw, m.ch, X - m.ax * sc, Y - m.ay * sc, m.cw * sc, m.ch * sc); g.globalCompositeOperation = 'source-over'; }
    g.globalAlpha = 1;
  }
  function drawSprite(sheet, id, x, y, alpha = 1, scale = 1) {
    const S = sprite(sheet, id); if (!S) return false;
    const k = cam.s / 16 * scale, s = S.s;
    g.globalAlpha = alpha; g.drawImage(S.img, s.x, s.y, s.w, s.h, sx(x) - s.ax * k, sy(y) - s.ay * k, s.w * k, s.h * k); g.globalAlpha = 1;
    return true;
  }
  function label(txt, x, y, o = {}) {
    g.font = `${o.it ? 'italic ' : ''}${o.b ? '600 ' : ''}${o.size || 12}px Georgia, serif`; g.textAlign = 'center'; g.textBaseline = 'middle';
    const w = g.measureText(txt).width;
    if (o.pill) { g.fillStyle = o.pill; g.beginPath(); g.roundRect(x - w / 2 - 5, y - 9, w + 10, 18, 5); g.fill(); }
    else { g.lineWidth = 3; g.strokeStyle = o.halo || 'rgba(12,8,16,0.85)'; g.strokeText(txt, x, y); }
    g.fillStyle = o.c || '#efe4cf'; g.fillText(txt, x, y);
  }

  function draw(alpha) {
    if (canvas.clientWidth !== W || canvas.clientHeight !== H) resize();
    const H0 = fr.state.party[0], [hx, hy] = at(H0, alpha);
    cam.x += (hx - cam.x) * 0.25; cam.y += (hy - cam.y) * 0.25;
    if (Math.hypot(hx - cam.x, hy - cam.y) > 60) { cam.x = hx; cam.y = hy; }
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.fillStyle = '#121019'; g.fillRect(0, 0, W, H);
    const s = cam.s, tl = toTile(0, 0), br = toTile(W, H);
    const aFar = 1 - smoothstep(1.2, 1.9, s), aNear = smoothstep(8, 12, s), aMid = 1 - aNear;
    const lv = fr.partyLv();

    // far: the Guild's wall map, the land under it
    if (aFar > 0 || s < 3) {
      if (wall) { g.imageSmoothingEnabled = true; g.globalAlpha = 1; g.drawImage(wall, sx(0), sy(0), 1200 * K * s, 2400 * K * s); }
    }
    // mid: the map a chunk at a time (over the wall map, fading in as they come)
    if (aMid > 0 && s >= 1.2) {
      g.imageSmoothingEnabled = true;
      const cx0 = Math.max(0, Math.floor(tl.x / CH)), cx1 = Math.min(land.CW - 1, Math.floor(br.x / CH)), cy0 = Math.max(0, Math.floor(tl.y / CH)), cy1 = Math.min(land.CHN - 1, Math.floor(br.y / CH));
      g.globalAlpha = Math.min(aMid, 1 - aFar * 0.0) * smoothstep(1.2, 1.9, s);
      for (let cy = cy0; cy <= cy1; cy++) for (let cx = cx0; cx <= cx1; cx++) { const cv = getChunk(mid, cx, cy, MID_MAX); if (cv) g.drawImage(cv, sx(cx * CH), sy(cy * CH), CH * s + 0.6, CH * s + 0.6); }
      g.globalAlpha = 1;
    }
    if (aNear < 1) { if (opts.fog) drawFog(1 - aNear); if (opts.levels) drawLevels(1 - aNear); }
    // near: the land painted, then everything standing on it, back to front
    if (aNear > 0) {
      g.imageSmoothingEnabled = false;
      const cx0 = Math.max(0, Math.floor((tl.x - 4) / CH)), cx1 = Math.min(land.CW - 1, Math.floor((br.x + 4) / CH)), cy0 = Math.max(0, Math.floor((tl.y - 4) / CH)), cy1 = Math.min(land.CHN - 1, Math.floor((br.y + 20) / CH));
      g.globalAlpha = aNear;
      for (let cy = cy0; cy <= cy1; cy++) for (let cx = cx0; cx <= cx1; cx++) { const cv = getChunk(near, cx, cy, NEAR_MAX); if (cv) g.drawImage(cv, sx(cx * CH), sy(cy * CH), CH * s + 0.6, CH * s + 0.6); }
      g.globalAlpha = 1;
      drawWorld(tl, br, cx0, cx1, cy0, cy1, alpha, aNear, lv);
    }
    // the lock, the party, the camps as dots, the names: above the tiers
    if (aNear < 1) drawMapMarks(tl, br, lv, 1 - aNear);
    // dusk over it all, and the vignette
    g.globalAlpha = 1;
    const v = g.createRadialGradient(W / 2, H * 0.5, Math.min(W, H) * 0.3, W / 2, H * 0.5, Math.hypot(W, H) * 0.6);
    v.addColorStop(0, 'rgba(10,6,16,0)'); v.addColorStop(1, `rgba(10,6,16,${0.3 + aNear * 0.25})`); g.fillStyle = v; g.fillRect(0, 0, W, H);
    make(want.length > 8 ? 14 : 8);
  }

  // the level overlay: the land's level a cell of 16 tiles, coloured against the party's, one small picture of the whole
  // world drawn smooth (remade when the party's level changes)
  const LV_STEP = 16, lvW = Math.ceil(land.W / LV_STEP), lvH = Math.ceil(land.H / LV_STEP), lvGrid = new Uint8Array(lvW * lvH);
  for (let j = 0; j < lvH; j++) for (let i = 0; i < lvW; i++) { const x = (i + 0.5) * LV_STEP, y = (j + 0.5) * LV_STEP; lvGrid[j * lvW + i] = land.regionAt(x, y) ? Math.round(land.baseLevel(x, y)) : 0; }
  let lvPic = /** @type {HTMLCanvasElement | null} */ (null), lvFor = -1;
  function drawLevels(a) {
    const lv = fr.partyLv();
    if (!lvPic || lvFor !== lv) {
      lvPic = document.createElement('canvas'); lvPic.width = lvW; lvPic.height = lvH; const cg = /** @type {CanvasRenderingContext2D} */ (lvPic.getContext('2d')), im = cg.createImageData(lvW, lvH);
      const C = Object.fromEntries(Object.entries(CON).map(([k, v]) => [k, rgb(v)]));
      lvGrid.forEach((L, i) => { if (!L) return; const c = C[fr.conOf(L, lv)]; im.data.set([c[0], c[1], c[2], 255], i * 4); });
      cg.putImageData(im, 0, 0); lvFor = lv;
    }
    g.imageSmoothingEnabled = true; g.globalAlpha = 0.38 * a; g.drawImage(lvPic, sx(0), sy(0), lvW * LV_STEP * cam.s, lvH * LV_STEP * cam.s); g.globalAlpha = 1;
  }
  // the fog: a pixel a chunk, dark where nobody's been, drawn smooth so its edge is soft
  const fogPic = document.createElement('canvas'); fogPic.width = land.CW; fogPic.height = land.CHN;
  const fogG = /** @type {CanvasRenderingContext2D} */ (fogPic.getContext('2d')); let fogSeen = -1;
  function drawFog(a) {
    if (fogSeen !== fr.state.seen.size) {
      fogSeen = fr.state.seen.size; const im = fogG.createImageData(land.CW, land.CHN);
      for (let i = 0; i < land.CW * land.CHN; i++) im.data.set([18, 14, 24, fr.state.seen.has(i) ? 0 : 150], i * 4);
      fogG.putImageData(im, 0, 0);
    }
    g.imageSmoothingEnabled = true; g.globalAlpha = a; g.drawImage(fogPic, sx(0), sy(0), land.CW * CH * cam.s, land.CHN * CH * cam.s); g.globalAlpha = 1;
  }

  function drawWorld(tl, br, cx0, cx1, cy0, cy1, alpha, aNear, lv) {
    const items = [], party = fr.state.party, L = fr.state.lock;
    // the locked area's edge on the ground (the screen it was when the stick was let go; it shows when the camera drifts)
    if (L) lockFrame(L, aNear);
    for (let cy = cy0; cy <= cy1; cy++) for (let cx = cx0; cx <= cx1; cx++) {
      const c = land.chunk(cx, cy);
      for (const f of c.feats) if (f.x > tl.x - 16 && f.x < br.x + 16 && f.y > tl.y - 4 && f.y < br.y + 24) items.push({ y: f.y, f });
    }
    // the towns: their walls' towers and their buildings
    for (const t of TOWNS) { const x = t.x * K, y = t.y * K; if (x > tl.x - t.r - 30 && x < br.x + t.r + 30 && y > tl.y - t.r - 30 && y < br.y + t.r + 40) townItems(t, x, y, items); }
    for (const a of fr.awake.values()) for (const f of a.foes) { const [x, y] = at(f, alpha); if (x > tl.x - 6 && x < br.x + 6 && y > tl.y - 6 && y < br.y + 10) items.push({ y, foe: f, x }); }
    party.forEach((m, i) => { const [x, y] = at(m, alpha); items.push({ y, m, x, i }); });
    items.sort((a, b) => a.y - b.y);
    const near = (x, y, r) => party.some((m) => Math.abs(m.x - x) < r && m.y < y && m.y > y - r * 1.4);
    for (const it of items) {
      if (it.f) {
        const f = it.f, list = TREE[f.k];
        if (f.k === 'beacon') { beacon(f.x, f.y); continue; }
        if (f.k === 'site') { const look = SITE_LOOK[f.id] || 'ruin'; const sheet = /boathall|lockhall|abbey/.test(look) ? 'town-fens' : look === 'keep' ? 'town-vale' : 'env'; const id = sheet === 'env' ? look : sheet === 'town-fens' ? 'fens_' + look + '_1' : 'vale_keep_1'; drawSprite(sheet, id, f.x, f.y, aNear); continue; }
        if (!list) continue;
        const id = list[Math.floor(f.v * list.length) % list.length], big = f.k === 'peak' || f.k === 'massif' || f.k === 'oak' || f.k === 'grove' || f.k === 'willow' || f.k === 'carr' || f.k === 'autumn' || f.k === 'birch' || f.k === 'pine';
        drawSprite('env', id, f.x, f.y, aNear * (big && near(f.x, f.y, f.k === 'massif' ? 14 : 6) ? 0.45 : 1), f.k === 'peak' || f.k === 'massif' ? 1.1 : 1);
      } else if (it.b) drawSprite(it.sheet, it.b, it.x, it.y, aNear);
      else if (it.foe) {
        const f = it.foe, con = fr.conOf(f.lvl, lv), elite = f.elite;
        const clip = f.dead ? 'death' : f.act > 0.15 ? 'attack' : f.moving ? 'walk' : 'idle';
        drawActor(f, it.x, it.y, ACTOR[f.kind] || 'skeleton_minion', { alpha: aNear * (f.dead ? Math.max(0, f.dead) : f.rise) * (f.state === 'evade' ? 0.6 : 1), clip, ring: f.warden ? '#c080ff' : elite ? '#f0c860' : null, big: f.warden ? 1.35 : elite ? 1.15 : 1, flash: f.flash > 0, seed: (f.id % 7) / 7, token: CON[con] });
        if (!f.dead) foeBadge(f, it.x, it.y, con, aNear);
      } else if (it.m) {
        const m = it.m, clip = m.down ? 'death' : m.act > 0.15 ? 'attack' : m.moving ? 'walk' : 'idle';
        drawActor(m, it.x, it.y, m.actor, { alpha: aNear, clip, ring: it.i === 0 ? 'rgba(240,200,128,0.9)' : null, flash: m.flash > 0, seed: it.i * 0.3 });
      }
    }
    // names over the land: the towns and the dungeons' mouths
    for (const t of TOWNS) { const x = t.x * K, y = t.y * K; if (x > tl.x - 40 && x < br.x + 40 && y > tl.y - 40 && y < br.y + 40) label(t.name, sx(x), sy(y - t.r - 3), { size: 15, b: true, c: '#f0c880' }); }
    for (const s of SITES) { const x = s.x * K, y = s.y * K; if (x > tl.x - 20 && x < br.x + 20 && y > tl.y - 20 && y < br.y + 20) label(`${s.name} · ${s.lv[0]}–${s.lv[1]}`, sx(x), sy(y + 9), { size: 12, it: true }); }
    drawFx(aNear);
  }
  function lockFrame(L, a) {
    const x0 = sx(L.x - L.hw), y0 = sy(L.y - L.hh), w = L.hw * 2 * cam.s, h = L.hh * 2 * cam.s;
    g.globalAlpha = a; g.fillStyle = 'rgba(240,200,128,0.05)'; g.fillRect(x0, y0, w, h);
    g.setLineDash([12, 8]); g.lineDashOffset = -now() * 12; g.strokeStyle = 'rgba(240,200,128,0.9)'; g.lineWidth = 2.5; g.strokeRect(x0 + 2, y0 + 2, w - 4, h - 4); g.setLineDash([]);
    const c = 14; g.lineWidth = 4; g.strokeStyle = 'rgba(240,200,128,0.95)'; g.beginPath();   // its corners, solid, so the edge reads at the screen's border
    for (const [px, py, dx, dy] of [[x0 + 2, y0 + 2, 1, 1], [x0 + w - 2, y0 + 2, -1, 1], [x0 + 2, y0 + h - 2, 1, -1], [x0 + w - 2, y0 + h - 2, -1, -1]]) { g.moveTo(px + dx * c, py); g.lineTo(px, py); g.lineTo(px, py + dy * c); }
    g.stroke(); g.globalAlpha = 1;
  }
  function townItems(t, x, y, items) {
    const set = 'town-' + townSet(t.id), p = set.slice(5) + '_';
    // its towers round the wall, and a ring of its buildings round the well (the town set's own, art critic pass 14)
    const n = t.r > 20 ? 6 : 4;
    for (let i = 0; i < n; i++) { const a = (i / n + 0.08) * 6.2832; items.push({ y: y + Math.sin(a) * (t.r - 2), x: x + Math.cos(a) * (t.r - 2), b: p + 'tower_1', sheet: set }); }
    const ring = t.r > 20 ? ['temple_1', 'inn_1', 'shop_1', 'house_2', 'smith_1', 'house_1', 'tavern_1'] : ['inn_1', 'shop_1', 'tavern_1', 'house_1'], R0 = t.r * 0.56;
    ring.forEach((id, i) => { const a = (i / ring.length) * 6.2832 - 1.57; items.push({ y: y + Math.sin(a) * R0 * 0.9, x: x + Math.cos(a) * R0, b: p + id, sheet: set }); });
    items.push({ y, x, b: p + 'well_1', sheet: set });
  }
  function beacon(x, y) {
    const X = sx(x), Y = sy(y), k = cam.s / 16;
    g.fillStyle = 'rgba(10,6,14,0.35)'; g.beginPath(); g.ellipse(X, Y, 10 * k, 4 * k, 0, 0, 6.2832); g.fill();
    g.fillStyle = '#4a423a'; g.fillRect(X - 6 * k, Y - 44 * k, 12 * k, 44 * k); g.fillStyle = '#5c5248'; g.fillRect(X - 6 * k, Y - 44 * k, 5 * k, 44 * k);
    g.fillStyle = '#3a332c'; for (let i = 0; i < 3; i++) g.fillRect(X - 7 * k + i * 5 * k, Y - 50 * k, 4 * k, 6 * k);
  }
  function foeBadge(f, x, y, con, a) {
    const k = cam.s / 16, X = sx(x), Y = sy(y) - (f.warden ? 92 : f.elite ? 74 : 64) * k;
    g.globalAlpha = a;
    if (f.hp < f.maxHp || f.state === 'fight') { const w = 26 * k; g.fillStyle = 'rgba(10,6,14,0.75)'; g.fillRect(X - w / 2 - 1, Y + 9, w + 2, 4); g.fillStyle = f.state === 'evade' ? '#9a968e' : '#d24a36'; g.fillRect(X - w / 2, Y + 10, w * f.hp / f.maxHp, 2); }
    label(String(f.lvl) + (f.warden ? ' ◆' : f.elite ? ' ★' : ''), X, Y, { size: 11, b: true, c: CON[con] });
    g.globalAlpha = 1;
  }
  function drawFx(a) {
    const t = now(), k = cam.s / 16;
    for (let i = fx.length - 1; i >= 0; i--) {
      const e = fx[i], age = t - e.t, X = sx(e.x), Y = sy(e.y);
      const life = e.k === 'num' ? 1.0 : e.k === 'rise' ? 1.0 : e.k === 'bang' ? 0.8 : 0.25;
      if (age > life) { fx.splice(i, 1); continue; }
      g.globalAlpha = a * (1 - age / life);
      if (e.k === 'num') label(e.s, X + ((e.x * 7) % 1) * 10, Y - 60 * k - age * 30, { size: e.big ? 15 : 12, b: true, c: e.c });
      else if (e.k === 'spark') { g.strokeStyle = e.c; g.lineWidth = 2; g.beginPath(); for (let j = 0; j < 5; j++) { const an = j * 1.26 + e.x, r = (6 + age * 60) * k; g.moveTo(X + Math.cos(an) * r * 0.4, Y - 24 * k + Math.sin(an) * r * 0.4); g.lineTo(X + Math.cos(an) * r, Y - 24 * k + Math.sin(an) * r); } g.stroke(); }
      else if (e.k === 'shot') { g.strokeStyle = e.c; g.lineWidth = 2; g.beginPath(); g.moveTo(sx(e.ax), sy(e.ay) - 26 * k); g.lineTo(X, Y - 24 * k); g.stroke(); }
      else if (e.k === 'mend') { g.strokeStyle = '#8fe07a'; g.lineWidth = 2; g.beginPath(); g.arc(X, Y - 20 * k, (10 + age * 30) * k, 0, 6.2832); g.stroke(); }
      else if (e.k === 'rise') { g.strokeStyle = '#c080ff'; g.lineWidth = 2; g.beginPath(); g.ellipse(X, Y, (14 - age * 8) * k, (5 - age * 3) * k, 0, 0, 6.2832); g.stroke(); }
      else if (e.k === 'bang') label('!', X, Y - 80 * k - age * 10, { size: 20, b: true, c: '#ffd27a' });
    }
    g.globalAlpha = 1;
  }

  // at the mid and far tiers: the camps as dots in their con colour, the towns and sites named, the party and the locked area
  function drawMapMarks(tl, br, lv, a) {
    const s = cam.s;
    g.globalAlpha = a;
    if (s >= 1.5) {
      const cx0 = Math.max(0, Math.floor(tl.x / CH)), cx1 = Math.min(land.CW - 1, Math.floor(br.x / CH)), cy0 = Math.max(0, Math.floor(tl.y / CH)), cy1 = Math.min(land.CHN - 1, Math.floor(br.y / CH));
      if ((cx1 - cx0 + 1) * (cy1 - cy0 + 1) <= 140) for (let cy = cy0; cy <= cy1; cy++) for (let cx = cx0; cx <= cx1; cx++) {
        if (!mid.has(cy * land.CW + cx)) continue;
        for (const k of land.chunk(cx, cy).camps) {
          const at = fr.state.respawnAt.get(k.id), up = !at || at.some((t) => t === 0 || t <= fr.state.tick), con = fr.conOf(k.lv, lv), r = Math.max(2, Math.min(5, s * 0.9)) * (k.kind === 'elite' || k.kind === 'lair' ? 1.5 : 1);
          g.beginPath(); g.arc(sx(k.x), sy(k.y), r, 0, 6.2832);
          if (up) { g.fillStyle = CON[con]; g.fill(); g.strokeStyle = 'rgba(30,20,14,0.8)'; g.lineWidth = 1; g.stroke(); } else { g.strokeStyle = CON[con]; g.lineWidth = 1.5; g.stroke(); }
          if (s >= 4) label(String(k.lv), sx(k.x), sy(k.y) - r - 7, { size: 10, b: true, c: CON[con] });
        }
      }
    }
    const L = fr.state.lock;
    if (L) lockFrame(L, a);
    for (const t of TOWNS) if (t.x * K > tl.x - 200 && t.x * K < br.x + 200 && t.y * K > tl.y - 200 && t.y * K < br.y + 200) {
      g.fillStyle = '#f6ecd2'; g.strokeStyle = '#8a3a22'; g.lineWidth = 2.5; g.beginPath(); g.arc(sx(t.x * K), sy(t.y * K), t.hub || t.city ? 6 : 4, 0, 6.2832); g.fill(); g.stroke();
      if (s >= 0.5 || t.hub || t.city) label(t.name, sx(t.x * K), sy(t.y * K) + 15, { size: 12, it: true, c: '#2a2018', pill: 'rgba(240,228,200,0.88)' });
    }
    if (s >= 1.2) for (const st of SITES) if (st.x * K > tl.x - 100 && st.x * K < br.x + 100 && st.y * K > tl.y - 100 && st.y * K < br.y + 100) label(`${st.name} ${st.lv[0]}–${st.lv[1]}`, sx(st.x * K), sy(st.y * K) + 13, { size: 11, it: true, c: '#2a2018', pill: 'rgba(240,228,200,0.78)' });
    // the party: you are here
    const H0 = fr.state.party[0], X = sx(H0.x), Y = sy(H0.y);
    g.strokeStyle = '#f0c880'; g.lineWidth = 2; g.beginPath(); g.arc(X, Y, 14, 0, 6.2832); g.stroke();
    g.fillStyle = '#e0a85a'; g.beginPath(); g.arc(X, Y, 6, 0, 6.2832); g.fill(); g.strokeStyle = '#3b2208'; g.stroke();
    g.globalAlpha = 1;
  }

  /** the screen's area in tiles: half its width and height, and its middle from the hero (the lock's area, §5) */
  const screenArea = () => { if (canvas.clientWidth !== W || canvas.clientHeight !== H) resize(); const H0 = fr.state.party[0], c = toTile(W / 2, H / 2); return { hw: W / 2 / cam.s, hh: H / 2 / cam.s, ox: c.x - H0.x, oy: c.y - H0.y }; };
  return { draw, beforeTick, toTile, screenArea, cam, opts, resize, pending: () => want.length, ready: () => !!wall && !!sheets.env };
}
