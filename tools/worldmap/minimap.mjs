// minimap.mjs — maps of the shipped scenes drawn from the sim itself (the owner, 2026-10-10: "leave Thornwick as is, but
// create a map for it; we might use these as the minimap backgrounds"). Each scene is built by the game's own code
// (createSim → world): every tile's ground (world.tmat: grass, dirt, cobble, water, field, marsh, deck…) and every
// placed piece's footprint (world.structs, src/sim/envfoot.js), so a map lines up with the world tile for tile. In the
// hand of the street plans (tools/worldmap/streets.mjs): top-down, north up.
// Two outputs a scene:
//   minimap-<scene>.png + .json   bare: ground, roads, buildings, walls and trees, no words; PX pixels a tile, and the
//                                  world tile at its top-left corner (x0, y0), so a minimap can place the player on it
//   map-<scene>.jpg               a sheet with a title and the names on it (Thornwick; the owner's ask)
//   node tools/worldmap/minimap.mjs [outDir]   → docs/img/towns/
// An overland's .json also lists its pins (its exits: the town, every site, the road to another land; at the middle of
// each, in tiles). An overland is also drawn illustrated, land-<scene>.jpg (in the wall map's hand, below), and a default
// run copies that and the .json to assets/maps/ for the World map's region tab (src/ui/worldmap.js).
// The exits don't move with the seed (test/worldmap.test.mjs holds the copies to the sim).
import { writeFileSync, mkdirSync, unlinkSync, copyFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const OUT = resolve(process.argv[2] || join(ROOT, 'docs', 'img', 'towns')), ASSETS = process.argv[2] ? null : join(ROOT, 'assets', 'maps');
const { createSim } = await import(pathToFileURL(join(ROOT, 'src', 'sim', 'core.js')).href);
const { ENV_FOOT } = await import(pathToFileURL(join(ROOT, 'src', 'sim', 'envfoot.js')).href);
const SEED = 20260807, PX = 4;
const INK = '#3b2f24', PAPER = '#e9dfc6', DIM = '#6e5e4a', GOLD = '#b8862e';

// the ground, by world.tmat (outdoor.js G): grass, dirt, cobble, water, bank, field, marsh, pool, deck
const GROUND = { vale: ['#b4b886', '#c9a77a', '#cfc1a2', '#8fa4a6', '#b5a17a', '#d8c27c', '#8f9a72', '#7f9196', '#8a6a48'],
  fens: ['#9aa07a', '#b39a78', '#c2b69a', '#6f8478', '#9a8c6a', '#c8b47a', '#7f8a66', '#5f7470', '#8a6a48'] };
// what a placed piece is, by its id
const kindOf = (id) => {
  if (/_(temple|tavern|shop|smith|inn|stilttavern|stiltinn)_\d/.test(id)) return 'svc';
  if (/_(well|cistern)_\d/.test(id)) return 'well';
  if (/_(curtainy?|wall)_\d/.test(id)) return 'wall';
  if (/_tower_\d/.test(id)) return 'tower';
  if (/_gatehousey?_\d/.test(id)) return 'gate';
  if (/_(housex?|stilt|cottagex?|longhousex?|workshopx?)_\d|_farmx?_\d|^windmill_/.test(id)) return 'house';   // (the town set, art critic pass 14: every home, and the Vale's mill)
  if (/^(oak|autumn|birch|grove|pine|dead|alder|willow|carr)_/.test(id)) return 'tree';
  if (/^(rock_|mountain)/.test(id)) return 'rock';
  if (/^fence_/.test(id)) return 'fence';
  if (/^bridge_|_landing_|_ferrystage_|_punt_/.test(id)) return 'deck';
  if (/^(watermill|chapelruin|ruin|mine|lumbermill|warren|milestone|wagon|stairs)|_(keep|boathall|lockhall|vats|abbey|priory)_\d/.test(id)) return 'site';
  return null;                                    // props, crops, beasts, undergrowth: too small for a map
};

// a scene: the sim's world, cropped to what a map needs
function scene(id, simOpts, crop, region) {
  const sim = createSim(SEED, undefined, simOpts), w = sim.world, [x0, y0, x1, y1] = crop;
  const cw = x1 - x0, ch = y1 - y0, ground = new Array(cw * ch);
  for (let y = 0; y < ch; y++) for (let x = 0; x < cw; x++) { const X = x + x0 + w.PAD, Y = y + y0 + w.PAD; ground[y * cw + x] = X >= 0 && Y >= 0 && X < w.GW && Y < w.GH ? w.tmat[Y * w.GW + X] : 0; }
  const pieces = [];
  for (const s of w.structs) { const k = kindOf(s.id), f = ENV_FOOT[s.id]; if (!k || !f) continue; pieces.push({ k, x0: s.x + f[0], y0: s.y + f[1], x1: s.x + f[2], y1: s.y + f[3] }); }
  const order = { tree: 0, rock: 1, fence: 2, deck: 3, site: 4, house: 5, wall: 6, gate: 7, tower: 7, svc: 8, well: 9 };
  pieces.sort((a, b) => order[a.k] - order[b.k] || (a.y1 - b.y1));
  // the illustrated map's marks: every piece big enough to draw, by its own id (a crown, a peak, a roof), front to back
  const marks = [];
  for (const s of w.structs) { const f = ENV_FOOT[s.id], g = glyphOf(s.id); if (!f || !g) continue; marks.push({ g, id: s.id, x0: s.x + f[0], y0: s.y + f[1], x1: s.x + f[2], y1: s.y + f[3] }); }
  marks.sort((a, b) => a.y1 - b.y1);
  const line = (r) => ({ w: r.w, surface: r.surface, pts: r.pts.map((p) => [r1(p[0]), r1(p[1])]) });
  return { id, region, crop, cw, ch, ground, pieces, marks, roads: w.roads.map(line), rivers: w.rivers.map(line), fields: w.fields,
    services: w.services, labels: w.labels, exits: w.exits, hub: w.hub, name: w.name };
}
// what the illustrated map draws a piece as (the wall map's hand, tools/worldmap/overlands.mjs)
const glyphOf = (id) => {
  if (/^mountain_massif/.test(id)) return 'massif';
  if (/^mountain/.test(id)) return /grass_trees/.test(id) ? 'hillwood' : 'peak';
  if (/^pine_/.test(id)) return 'pine';
  if (/^dead_/.test(id)) return 'dead';
  if (/^grove_/.test(id)) return 'grove';
  if (/^(oak|autumn|birch|alder|carr|willow)_/.test(id)) return 'tree';
  if (/^rock_/.test(id)) return 'rock';
  if (/^(fence|drywall)_/.test(id)) return 'fence';
  const k = kindOf(id); return k && k !== 'tree' && k !== 'rock' && k !== 'fence' ? k : null;
};

// an overland's pins: the middle of each exit (outdoor.js exits), in tiles
const r1 = (v) => Math.round(v * 10) / 10;
const pinsOf = (sc) => sc.exits.map((e) => ({ kind: e.to === 'dungeon' ? 'site' : e.to === 'town' ? 'town' : 'land', id: e.site || e.region || sc.region, x: r1((e.x0 + e.x1) / 2), y: r1((e.y0 + e.y1) / 2) }));

const SCENES = [
  scene('thornwick', { scene: 'town', region: 'vale' }, [-22, -20, 166, 136], 'vale'),
  scene('saltmere', { scene: 'town', region: 'fens' }, [-12, -10, 146, 130], 'fens'),
  scene('vale', { scene: 'overland', region: 'vale' }, [-6, -36, 262, 278], 'vale'),
  scene('fens', { scene: 'overland', region: 'fens' }, [-6, -36, 246, 244], 'fens'),
];

// the page: a canvas for the map (ground a tile a pixel-block, then the pieces), an SVG over it for the sheet's words
const page = (sc, sheet) => `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face { font-family: 'Fell'; src: url('${pathToFileURL(join(ROOT, 'assets', 'fonts', 'im-fell-english.woff2')).href}'); }
@font-face { font-family: 'Fell It'; src: url('${pathToFileURL(join(ROOT, 'assets', 'fonts', 'im-fell-english-italic.woff2')).href}'); }
@font-face { font-family: 'Fell SC'; src: url('${pathToFileURL(join(ROOT, 'assets', 'fonts', 'im-fell-english-sc.woff2')).href}'); }
html, body { margin: 0; background: ${sheet ? '#d9ccb0' : 'transparent'}; } #c { position: absolute; } svg { position: absolute; left: 0; top: 0; }</style></head>
<body><canvas id="c"></canvas><script>
const sc = ${JSON.stringify(sc)}, P = ${sheet ? sheet.px : PX}, OX = ${sheet ? sheet.ox : 0}, OY = ${sheet ? sheet.oy : 0};
const GROUND = ${JSON.stringify(GROUND[sc.region])}, INK = '${INK}';
const c = document.getElementById('c'); c.width = sc.cw * P; c.height = sc.ch * P; c.style.left = OX + 'px'; c.style.top = OY + 'px';
const g = c.getContext('2d');
// the ground a pixel a tile, scaled up smooth: no seams between tiles, and the roads read as ways, not staircases
const t = document.createElement('canvas'); t.width = sc.cw; t.height = sc.ch; const tg = t.getContext('2d'), im = tg.createImageData(sc.cw, sc.ch);
const rgb = GROUND.map((h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16)));
for (let i = 0; i < sc.cw * sc.ch; i++) { const [r, gg, bb] = rgb[sc.ground[i]] || rgb[0]; im.data.set([r, gg, bb, 255], i * 4); }
tg.putImageData(im, 0, 0); g.imageSmoothingEnabled = true; g.imageSmoothingQuality = 'high'; g.drawImage(t, 0, 0, sc.cw * P, sc.ch * P);
// and again through a blur of half a tile, over itself: the tile steps along a square's or a pool's edge soften into a line
// (art critic pass 12: they read as stairs on Thornwick's sheet); the copy beneath keeps the map's edges whole
g.filter = 'blur(' + (P * 0.5) + 'px)'; g.drawImage(t, 0, 0, sc.cw * P, sc.ch * P); g.filter = 'none';
const X = (x) => (x - sc.crop[0]) * P, Y = (y) => (y - sc.crop[1]) * P;
const FILL = { gate: '#4a3c30', house: sc.region === 'fens' ? '#7e7464' : '#a8644a', svc: '#d9ae4e', wall: '#5a4a3c', tower: '#4a3c30', site: '#9a7aa0', deck: '#8a6a48', rock: '#9a958a' };   // (the Fens' stilt houses grey thatch, not the Vale's brick)
for (const p of sc.pieces) {
  const x = X(p.x0), y = Y(p.y0), w = (p.x1 - p.x0) * P, h = (p.y1 - p.y0) * P;
  if (p.k === 'tree') { g.fillStyle = sc.region === 'fens' ? '#5d6e4a' : '#5e7444'; g.strokeStyle = INK; g.lineWidth = 0.6; g.beginPath(); g.ellipse(x + w / 2, y + h / 2, w * 0.36, h * 0.36, 0, 0, 6.2832); g.fill(); g.globalAlpha = 0.5; g.stroke(); g.globalAlpha = 1; continue; }
  if (p.k === 'fence') { g.strokeStyle = '#6e5a44'; g.lineWidth = Math.max(1, P * 0.3); g.beginPath(); if (w > h) { g.moveTo(x, y + h / 2); g.lineTo(x + w, y + h / 2); } else { g.moveTo(x + w / 2, y); g.lineTo(x + w / 2, y + h); } g.stroke(); continue; }
  if (p.k === 'well') { g.fillStyle = '#7d8e96'; g.strokeStyle = INK; g.lineWidth = 1.2; g.beginPath(); g.arc(x + w / 2, y + h / 2, Math.min(w, h) * 0.45, 0, 6.2832); g.fill(); g.stroke(); continue; }
  if (p.k === 'rock') { g.fillStyle = FILL.rock; g.beginPath(); g.ellipse(x + w / 2, y + h / 2, w * 0.4, h * 0.35, 0, 0, 6.2832); g.fill(); continue; }
  if (p.k === 'tower') { g.fillStyle = FILL.tower; g.strokeStyle = INK; g.lineWidth = 1.2; g.beginPath(); g.ellipse(x + w / 2, y + h / 2, w * 0.42, h * 0.42, 0, 0, 6.2832); g.fill(); g.stroke(); continue; }
  // a wall keeps its full length and is drawn thinner across; a building a touch inside its footprint
  const ix = p.k === 'wall' ? (w > h ? 0 : 0.28) : 0.06, iy = p.k === 'wall' ? (w > h ? 0.28 : 0) : 0.06;
  g.fillStyle = FILL[p.k]; g.strokeStyle = INK; g.lineWidth = p.k === 'svc' ? 1.6 : 1;
  g.fillRect(x + w * ix, y + h * iy, w * (1 - 2 * ix), h * (1 - 2 * iy)); if (p.k !== 'wall') g.strokeRect(x + w * ix, y + h * iy, w * (1 - 2 * ix), h * (1 - 2 * iy));
}
</script>${sheet ? sheet.svg : ''}</body></html>`;

// An overland in the wall map's hand, for the World map's region tab (the owner, 2026-10-11: the flat minimap there read
// worse than the illustrated overlands): parchment, water inked with the coast's ripple lines, roads ruled in the
// imperial red or dotted as tracks, woods in crowns, hills hatched, roofs, walls and the sites drawn as plans. Every
// mark stands where the game has it (the tiles, the road and river lines, each piece's footprint), so the pins land true.
// No words: the World map writes its own beside the pins. LPX pixels a tile (the .json's px stays the layout's unit).
const LPX = 6;
const landPage = (sc) => `<!doctype html><html><head><meta charset="utf-8"><style>html, body { margin: 0; } #c { display: block; }</style></head>
<body><canvas id="c"></canvas><script>
const sc = ${JSON.stringify(sc)}, P = ${LPX}, W = sc.cw * P, H = sc.ch * P, fens = sc.region === 'fens';
const INK = '#3b2f24', RED = '#9a3a22', PAPER = fens ? '#e0d6b0' : '#e8d7b0';
let seed = 0x0ae1a2 ^ sc.cw;
const rand = () => { seed = (seed + 0x6d2b79f5) >>> 0; let t = seed; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
const X = (x) => (x - sc.crop[0]) * P, Y = (y) => (y - sc.crop[1]) * P;
const at = (x, y) => { const i = Math.floor(x) - sc.crop[0], j = Math.floor(y) - sc.crop[1]; return i < 0 || j < 0 || i >= sc.cw || j >= sc.ch ? 0 : sc.ground[j * sc.cw + i]; };
const c = document.getElementById('c'); c.width = W; c.height = H;
const g = c.getContext('2d');
const canvas = () => { const k = document.createElement('canvas'); k.width = W; k.height = H; return k; };

// the paper, and its age: broad soft stains, a fine grain
g.fillStyle = PAPER; g.fillRect(0, 0, W, H);
for (let i = 0; i < 46; i++) { const x = rand() * W, y = rand() * H, r = 60 + rand() * 220, s = g.createRadialGradient(x, y, 0, x, y, r);
  s.addColorStop(0, rand() < 0.5 ? 'rgba(150,118,72,0.10)' : 'rgba(255,248,226,0.10)'); s.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = s; g.fillRect(x - r, y - r, 2 * r, 2 * r); }
for (let i = 0; i < 9000; i++) { g.fillStyle = rand() < 0.5 ? 'rgba(90,64,34,0.07)' : 'rgba(255,250,232,0.08)'; g.fillRect(rand() * W, rand() * H, 1 + rand() * 1.5, 1 + rand() * 1.5); }

// a ground's shape from the tiles, smoothed (a blur, then a hard edge again): the tile steps become a drawn line
function shape(codes, soft, crisp) {
  const t = document.createElement('canvas'); t.width = sc.cw; t.height = sc.ch; const tg = t.getContext('2d'), im = tg.createImageData(sc.cw, sc.ch);
  for (let i = 0; i < sc.cw * sc.ch; i++) if (codes.includes(sc.ground[i])) im.data.set([255, 255, 255, 255], i * 4);
  tg.putImageData(im, 0, 0);
  const k = canvas(), kg = k.getContext('2d'); kg.imageSmoothingQuality = 'high'; kg.filter = 'blur(' + soft * P + 'px)'; kg.drawImage(t, 0, 0, W, H); kg.filter = 'none';
  if (crisp) { const d = kg.getImageData(0, 0, W, H), a = d.data; for (let i = 3; i < a.length; i += 4) a[i] = Math.max(0, Math.min(255, (a[i] - 118) * 9)); kg.putImageData(d, 0, 0); }
  return k;
}
const tint = (k, fill) => { const t = canvas(), tg = t.getContext('2d'); tg.drawImage(k, 0, 0); tg.globalCompositeOperation = 'source-in'; tg.fillStyle = fill; tg.fillRect(0, 0, W, H); return t; };
const grow = (k, r) => { const t = canvas(), tg = t.getContext('2d'); for (let i = 0; i < 16; i++) { const a = i / 16 * 6.2832; tg.drawImage(k, Math.cos(a) * r, Math.sin(a) * r); } tg.drawImage(k, 0, 0); return t; };
const ring = (k, r0, r1) => { const t = grow(k, r1), tg = t.getContext('2d'); tg.globalCompositeOperation = 'destination-out'; tg.drawImage(grow(k, r0), 0, 0); return t; };

// the meadows' green, faint; the fields in their furrows; the marsh in reeds
g.globalAlpha = fens ? 0.22 : 0.16; for (let i = 0; i < 30; i++) { const x = rand() * W, y = rand() * H, r = 80 + rand() * 160, s = g.createRadialGradient(x, y, 0, x, y, r); s.addColorStop(0, '#8c9a5c'); s.addColorStop(1, 'rgba(140,154,92,0)'); g.fillStyle = s; g.fillRect(x - r, y - r, 2 * r, 2 * r); } g.globalAlpha = 1;
const fieldK = shape([5], 0.35, true); g.globalAlpha = 0.8; g.drawImage(tint(fieldK, '#e2c98a'), 0, 0); g.globalAlpha = 1;
g.save(); g.strokeStyle = INK; g.globalAlpha = 0.28; g.lineWidth = 1;
for (const f of sc.fields) { g.save(); g.beginPath(); g.rect(X(f.x0), Y(f.y0), (f.x1 - f.x0) * P, (f.y1 - f.y0) * P); g.clip(); g.beginPath();
  if (f.axis === 'x') for (let y = f.y0 + 0.75; y < f.y1; y += 1.5) { g.moveTo(X(f.x0), Y(y)); g.lineTo(X(f.x1), Y(y)); } else for (let x = f.x0 + 0.75; x < f.x1; x += 1.5) { g.moveTo(X(x), Y(f.y0)); g.lineTo(X(x), Y(f.y1)); }
  g.stroke(); g.restore(); g.save(); g.globalAlpha = 0.55; g.strokeRect(X(f.x0), Y(f.y0), (f.x1 - f.x0) * P, (f.y1 - f.y0) * P); g.restore(); }
g.restore();
const marshK = shape([6], 0.8, false); g.globalAlpha = 0.55; g.drawImage(tint(marshK, '#b9b98a'), 0, 0); g.globalAlpha = 1;
const tufts = [];
for (let y = sc.crop[1]; y < sc.crop[1] + sc.ch; y += 2.6) for (let x = sc.crop[0]; x < sc.crop[0] + sc.cw; x += 2.6) {
  const jx = x + rand() * 2.2, jy = y + rand() * 2.2; if (at(jx, jy) === 6 && at(jx + 1.5, jy) === 6 && at(jx - 1.5, jy) === 6 && rand() < 0.3) tufts.push([X(jx), Y(jy), 0.8 + rand() * 0.5]); }
g.strokeStyle = INK; g.lineWidth = 0.9; g.globalAlpha = 0.6; g.beginPath();
for (const [x, y, k] of tufts) { g.moveTo(x - 4 * k, y); g.lineTo(x - 2 * k, y - 6 * k); g.moveTo(x, y); g.lineTo(x, y - 7.5 * k); g.moveTo(x + 4 * k, y); g.lineTo(x + 2 * k, y - 6 * k); g.moveTo(x - 6 * k, y); g.lineTo(x + 6 * k, y); }
g.stroke(); g.globalAlpha = 1;

// the water: the river, the canal and the meres, from the tiles; an inked edge and the wall map's ripples off it
const water = shape([3, 7], 0.5, true), bank = shape([4], 0.6, false);
g.globalAlpha = 0.35; g.drawImage(tint(bank, '#b8a47a'), 0, 0); g.globalAlpha = 1;
g.globalAlpha = 0.32; g.drawImage(tint(ring(water, 4.5, 5.7), INK), 0, 0); g.globalAlpha = 0.16; g.drawImage(tint(ring(water, 9, 10), INK), 0, 0); g.globalAlpha = 1;
g.drawImage(tint(grow(water, 1.4), INK), 0, 0);
g.drawImage(tint(water, fens ? '#7f9290' : '#8fa4a6'), 0, 0);
// the current: a paler streak down the middle of the running water
g.save(); g.globalCompositeOperation = 'source-atop'; g.strokeStyle = 'rgba(214,226,222,0.55)'; g.lineCap = 'round'; g.lineJoin = 'round';
for (const r of sc.rivers) { if (r.w < 4) continue; g.lineWidth = 1.6; g.setLineDash([22, 14]); g.beginPath(); r.pts.forEach(([x, y], i) => i ? g.lineTo(X(x), Y(y)) : g.moveTo(X(x), Y(y))); g.stroke(); }
g.restore(); g.setLineDash([]);
// and ripple strokes on the meres
g.strokeStyle = 'rgba(214,226,222,0.5)'; g.lineWidth = 1.2;
for (let i = 0; i < 900; i++) { const x = sc.crop[0] + rand() * sc.cw, y = sc.crop[1] + rand() * sc.ch; if (at(x, y) !== 7 || at(x + 3, y) !== 7 || at(x - 3, y) !== 7 || rand() < 0.6) continue;
  g.beginPath(); g.moveTo(X(x) - 7, Y(y)); g.quadraticCurveTo(X(x) - 3.5, Y(y) - 2.5, X(x), Y(y)); g.quadraticCurveTo(X(x) + 3.5, Y(y) + 2.5, X(x) + 7, Y(y)); g.stroke(); }

// the roads: a worn band the width the game walks, then the hand's line down it (the imperial red on the high roads,
// a dotted track on the rest, planks on the boardwalks)
const path = (pts) => { g.beginPath(); pts.forEach(([x, y], i) => i ? g.lineTo(X(x), Y(y)) : g.moveTo(X(x), Y(y))); };
g.lineCap = 'round'; g.lineJoin = 'round';
for (const r of sc.roads) { if (r.surface === 'deck') continue; path(r.pts); g.strokeStyle = 'rgba(120,92,56,0.45)'; g.lineWidth = r.w * P * 0.62 + 2.4; g.stroke(); }
for (const r of sc.roads) { if (r.surface === 'deck') continue; path(r.pts); g.strokeStyle = '#dcc597'; g.lineWidth = r.w * P * 0.62; g.stroke(); }
for (const r of sc.roads) { if (r.surface !== 'deck') continue; path(r.pts); g.strokeStyle = INK; g.lineWidth = r.w * P * 0.7 + 2.4; g.stroke(); path(r.pts); g.strokeStyle = '#9c7b55'; g.lineWidth = r.w * P * 0.7; g.stroke();
  path(r.pts); g.strokeStyle = 'rgba(59,47,36,0.55)'; g.lineWidth = r.w * P * 0.7; g.setLineDash([1.2, P - 1.2]); g.lineCap = 'butt'; g.stroke(); g.setLineDash([]); g.lineCap = 'round'; }
for (const r of sc.roads) { if (r.surface === 'deck') continue; const high = r.surface !== 'track' && r.w >= 5; path(r.pts);
  g.strokeStyle = high ? RED : INK; g.globalAlpha = high ? 0.9 : 0.7; g.lineWidth = high ? 2.4 : 1.5; g.setLineDash(high ? [11, 6] : [2.5, 4]); g.stroke(); g.setLineDash([]); g.globalAlpha = 1; }

// the marks, back to front: crowns, peaks, rocks, roofs and walls, the sites as plans
const STONE = '#b7aa94';
const CROWN = { oak: '#b9bc8a', grove: '#b3b784', birch: '#cacb9e', autumn: '#c9a26e', alder: '#a9ae84', carr: '#a3a87f', willow: '#b4ba8c' };
const crown = (x, y, r, fill) => {
  g.strokeStyle = INK; g.lineWidth = 1; g.beginPath(); g.moveTo(x, y + r * 0.7); g.lineTo(x, y + r * 1.25); g.stroke();
  g.beginPath(); g.arc(x, y, r, 0, 6.2832); g.fillStyle = fill; g.fill();
  g.save(); g.clip(); g.beginPath(); g.arc(x - r * 0.45, y - r * 0.45, r * 1.05, 0, 6.2832); g.rect(x + 2 * r, y - 2 * r, -4 * r, 4 * r); g.fillStyle = 'rgba(59,47,36,0.2)'; g.fill('evenodd'); g.restore();
  g.beginPath(); g.arc(x, y, r, 0, 6.2832); g.lineWidth = 1.05; g.stroke(); };
const peak = (x, y, w, h, fill) => {
  g.beginPath(); g.moveTo(x - w, y); g.lineTo(x, y - h); g.lineTo(x + w, y); g.closePath(); g.fillStyle = fill; g.fill();
  g.beginPath(); g.moveTo(x, y - h); g.lineTo(x + w, y); g.lineTo(x + w * 0.2, y); g.closePath(); g.fillStyle = 'rgba(59,47,36,0.32)'; g.fill();
  g.strokeStyle = INK; g.lineWidth = 1.3; g.beginPath(); g.moveTo(x - w, y); g.lineTo(x, y - h); g.lineTo(x + w, y); g.stroke();
  g.lineWidth = 0.8; g.globalAlpha = 0.5; g.beginPath(); for (let k = 1; k <= 3; k++) { const u = 0.25 + k * 0.17; g.moveTo(x + w * u * 0.55, y - h * (1 - u)); g.lineTo(x + w * u * 0.55 + w * 0.18, y - h * (1 - u) + h * 0.12); } g.stroke(); g.globalAlpha = 1; };
const plan = (x, y, w, h, fill, hatch) => {
  g.fillStyle = fill; g.fillRect(x, y, w, h);
  if (hatch) { g.save(); g.beginPath(); g.rect(x, y, w, h); g.clip(); g.strokeStyle = 'rgba(59,47,36,0.35)'; g.lineWidth = 0.9; g.beginPath(); for (let d = -h; d < w; d += 4) { g.moveTo(x + d, y + h); g.lineTo(x + d + h, y); } g.stroke(); g.restore(); }
  g.strokeStyle = INK; g.lineWidth = 1.4; g.strokeRect(x, y, w, h); };
for (const m of sc.marks) {
  const x = X(m.x0), y = Y(m.y0), w = (m.x1 - m.x0) * P, h = (m.y1 - m.y0) * P, cx = x + w / 2, cy = y + h / 2, kind = m.id.split('_')[0];
  if (m.g === 'tree') { crown(cx, cy, Math.min(w, h) * 0.3, CROWN[kind] || CROWN.oak); continue; }
  if (m.g === 'grove') { for (const [u, v, k] of [[0.3, 0.35, 0.2], [0.68, 0.3, 0.18], [0.5, 0.62, 0.22], [0.22, 0.7, 0.15], [0.8, 0.68, 0.16]]) crown(x + w * u, y + h * v, Math.min(w, h) * k, CROWN.grove); continue; }
  if (m.g === 'pine') { const r = Math.min(w, h) * 0.32; g.beginPath(); g.moveTo(cx - r * 0.6, cy + r); g.lineTo(cx, cy - r * 1.2); g.lineTo(cx + r * 0.6, cy + r); g.closePath(); g.fillStyle = '#a3aa80'; g.fill(); g.strokeStyle = INK; g.lineWidth = 1; g.stroke(); g.beginPath(); g.moveTo(cx, cy + r); g.lineTo(cx, cy + r * 1.4); g.stroke(); continue; }
  if (m.g === 'dead') { const r = Math.min(w, h) * 0.3; g.strokeStyle = INK; g.lineWidth = 1.1; g.beginPath(); g.moveTo(cx, cy + r); g.lineTo(cx, cy - r); g.moveTo(cx, cy - r * 0.1); g.lineTo(cx - r * 0.6, cy - r * 0.7); g.moveTo(cx, cy + r * 0.25); g.lineTo(cx + r * 0.55, cy - r * 0.35); g.stroke(); continue; }
  if (m.g === 'rock') { const r = Math.min(w, h) * 0.3; g.beginPath(); for (let i = 0; i < 6; i++) { const a = i / 6 * 6.2832, k = 0.7 + rand() * 0.45; g.lineTo(cx + Math.cos(a) * r * k, cy + Math.sin(a) * r * k * 0.72); } g.closePath(); g.fillStyle = '#ada392'; g.fill(); g.strokeStyle = INK; g.lineWidth = 0.9; g.stroke(); continue; }
  if (m.g === 'peak' || m.g === 'hillwood') { peak(cx, y + h * 0.82, w * 0.46, h * 0.7, '#cfc09c'); if (m.g === 'hillwood') for (const [u, k] of [[-0.3, 0.07], [0.32, 0.06], [0.05, 0.065]]) crown(cx + w * u, y + h * 0.84, w * k, CROWN.grove); continue; }
  if (m.g === 'massif') { peak(cx - w * 0.22, y + h * 0.7, w * 0.26, h * 0.5, '#cbbc98'); peak(cx + w * 0.24, y + h * 0.72, w * 0.25, h * 0.46, '#cbbc98'); peak(cx, y + h * 0.84, w * 0.34, h * 0.72, '#d3c5a2'); continue; }
  if (m.g === 'fence') { g.strokeStyle = INK; g.globalAlpha = 0.7; g.lineWidth = 1.2; g.beginPath(); if (w > h) { g.moveTo(x, cy); g.lineTo(x + w, cy); } else { g.moveTo(cx, y); g.lineTo(cx, y + h); } g.stroke(); g.globalAlpha = 1; continue; }
  if (m.g === 'tower') { g.beginPath(); g.arc(cx, cy, Math.min(w, h) * 0.42, 0, 6.2832); g.fillStyle = '#8a7a66'; g.fill(); g.strokeStyle = INK; g.lineWidth = 1.4; g.stroke(); continue; }
  if (m.g === 'wall') { g.fillStyle = '#5a4a3c'; if (w > h) g.fillRect(x, cy - h * 0.22, w, h * 0.44); else g.fillRect(cx - w * 0.22, y, w * 0.44, h); continue; }
  if (m.g === 'gate') { plan(x + w * 0.08, y + h * 0.08, w * 0.84, h * 0.84, '#5a4a3c', false); continue; }
  if (m.g === 'deck') { plan(x + w * 0.04, y + h * 0.04, w * 0.92, h * 0.92, '#9c7b55', false); g.strokeStyle = 'rgba(59,47,36,0.55)'; g.lineWidth = 1; g.beginPath(); if (w > h) for (let u = x + P; u < x + w; u += P) { g.moveTo(u, y + 2); g.lineTo(u, y + h - 2); } else for (let v = y + P; v < y + h; v += P) { g.moveTo(x + 2, v); g.lineTo(x + w - 2, v); } g.stroke(); continue; }
  if (m.g === 'house' || m.g === 'svc') { const ix = w * 0.08, iy = h * 0.08, rw = w - 2 * ix, rh = h - 2 * iy; plan(x + ix, y + iy, rw, rh, fens ? '#8e8571' : '#ad7a5c', false);
    g.strokeStyle = INK; g.lineWidth = 1; g.beginPath(); if (rw > rh) { g.moveTo(x + ix, cy); g.lineTo(x + ix + rw, cy); } else { g.moveTo(cx, y + iy); g.lineTo(cx, y + iy + rh); } g.stroke();
    if (/temple/.test(m.id)) { g.beginPath(); g.arc(cx, cy, Math.min(rw, rh) * 0.2, 0, 6.2832); g.fillStyle = '#d8c08a'; g.fill(); g.stroke(); } continue; }
  if (m.g === 'site') { site(m.id, cx, cy, Math.min(Math.min(w, h) * 1.15, 124)); continue; }
}

// each site as the hand would draw it, s across, on its footprint: mounds, a pithead, a mill, a broken chapel, a keep
function site(id, x, y, s) {
  const S = STONE, k = s / 2;
  const mound = (mx, my, r, door) => { g.beginPath(); g.moveTo(mx - r, my); g.quadraticCurveTo(mx, my - r * 1.25, mx + r, my); g.closePath(); g.fillStyle = '#c4b48a'; g.fill(); g.strokeStyle = INK; g.lineWidth = 1.3; g.stroke();
    g.globalAlpha = 0.45; g.lineWidth = 0.8; g.beginPath(); for (let i = 1; i < 4; i++) { g.moveTo(mx + r * (0.1 + i * 0.18), my - r * 0.5 + i * r * 0.1); g.lineTo(mx + r * (0.2 + i * 0.18), my - r * 0.02); } g.stroke(); g.globalAlpha = 1;
    if (door) { g.beginPath(); g.moveTo(mx - r * 0.18, my); g.lineTo(mx - r * 0.18, my - r * 0.22); g.arc(mx, my - r * 0.22, r * 0.18, Math.PI, 0); g.lineTo(mx + r * 0.18, my); g.closePath(); g.fillStyle = INK; g.fill(); } };
  const roof = (rx, ry, rw, rh, fill = '#ad7a5c') => { plan(rx - rw / 2, ry - rh / 2, rw, rh, fill, false); g.strokeStyle = INK; g.lineWidth = 1; g.beginPath(); if (rw > rh) { g.moveTo(rx - rw / 2, ry); g.lineTo(rx + rw / 2, ry); } else { g.moveTo(rx, ry - rh / 2); g.lineTo(rx, ry + rh / 2); } g.stroke(); };
  const disc = (dx, dy, r, fill) => { g.beginPath(); g.arc(dx, dy, r, 0, 6.2832); g.fillStyle = fill; g.fill(); g.strokeStyle = INK; g.lineWidth = 1.2; g.stroke(); };
  if (/^ruin/.test(id)) { mound(x - k * 0.5, y + k * 0.1, k * 0.42); mound(x + k * 0.5, y + k * 0.05, k * 0.4); mound(x, y + k * 0.45, k * 0.55, true); return; }   // the Old Barrows
  if (/^warren/.test(id)) { for (const [u, v, r] of [[-0.5, -0.05, 0.42], [0.4, -0.3, 0.38], [0.02, 0.4, 0.46], [0.62, 0.42, 0.32]]) { mound(x + k * u, y + k * v, k * r); disc(x + k * u, y + k * v - k * r * 0.25, k * 0.06, INK); } return; }
  if (/^mine/.test(id)) { peak(x, y + k * 0.55, k * 0.75, k * 0.95, '#bfae90'); g.beginPath(); g.moveTo(x - k * 0.2, y + k * 0.55); g.lineTo(x - k * 0.2, y + k * 0.25); g.arc(x, y + k * 0.25, k * 0.2, Math.PI, 0); g.lineTo(x + k * 0.2, y + k * 0.55); g.closePath(); g.fillStyle = INK; g.fill();
    g.strokeStyle = '#7a5a3a'; g.lineWidth = 2.2; g.beginPath(); g.moveTo(x - k * 0.26, y + k * 0.55); g.lineTo(x - k * 0.26, y + k * 0.12); g.lineTo(x + k * 0.26, y + k * 0.12); g.lineTo(x + k * 0.26, y + k * 0.55); g.stroke(); return; }
  if (/^lumbermill/.test(id)) { roof(x - k * 0.15, y - k * 0.1, k * 1.1, k * 0.6); for (let i = 0; i < 3; i++) for (let j = 0; j < 3 - i; j++) disc(x + k * 0.55 + j * k * 0.16 + i * k * 0.08, y + k * 0.5 - i * k * 0.14, k * 0.08, '#c9a874'); return; }
  if (/^watermill/.test(id)) { roof(x - k * 0.15, y, k * 1.1, k * 0.8); disc(x + k * 0.62, y, k * 0.32, '#9c7b55'); g.beginPath(); for (let i = 0; i < 4; i++) { const a = i / 4 * Math.PI; g.moveTo(x + k * 0.62 + Math.cos(a) * k * 0.32, y + Math.sin(a) * k * 0.32); g.lineTo(x + k * 0.62 - Math.cos(a) * k * 0.32, y - Math.sin(a) * k * 0.32); } g.lineWidth = 0.9; g.stroke(); return; }
  if (/^chapelruin/.test(id)) { g.fillStyle = S; g.strokeStyle = INK; g.lineWidth = 1.2;
    for (const [u, v, uw, vh] of [[-0.6, -0.7, 0.16, 0.9], [-0.6, 0.45, 0.16, 0.3], [0.44, -0.7, 0.16, 0.5], [0.44, 0.1, 0.16, 0.65], [-0.6, -0.7, 0.55, 0.16], [0.2, -0.7, 0.4, 0.16], [-0.6, 0.6, 1.2, 0.16]]) { g.fillRect(x + k * u, y + k * v, k * uw, k * vh); g.strokeRect(x + k * u, y + k * v, k * uw, k * vh); }
    disc(x - k * 0.08, y - k * 0.1, k * 0.07, S); disc(x + k * 0.12, y + k * 0.25, k * 0.06, S); return; }
  if (/^milestone/.test(id)) { const r = Math.max(k * 0.8, 16); g.beginPath(); g.moveTo(x - r * 0.4, y + r * 0.6); g.lineTo(x - r * 0.4, y - r * 0.3); g.arc(x, y - r * 0.3, r * 0.4, Math.PI, 0); g.lineTo(x + r * 0.4, y + r * 0.6); g.closePath(); g.fillStyle = S; g.fill(); g.strokeStyle = INK; g.lineWidth = 1.3; g.stroke(); return; }
  if (/keep/.test(id)) { plan(x - k * 0.7, y - k * 0.7, k * 1.4, k * 1.4, S, false); g.fillStyle = INK; for (let i = 0; i < 5; i++) for (const [ex, ey] of [[x - k * 0.7 + i * k * 0.3, y - k * 0.7], [x - k * 0.7 + i * k * 0.3, y + k * 0.7], [x - k * 0.7, y - k * 0.7 + i * k * 0.3], [x + k * 0.7, y - k * 0.7 + i * k * 0.3]]) g.fillRect(ex - 2.5, ey - 2.5, 5, 5);
    plan(x - k * 0.28, y - k * 0.28, k * 0.56, k * 0.56, '#8a7a66', false); return; }
  if (/boathall/.test(id)) { mound(x, y + k * 0.55, k * 0.95); roof(x, y - k * 0.05, k * 0.9, k * 0.42, '#8e8571'); return; }   // Toadking's Mound
  if (/lockhall/.test(id)) { roof(x - k * 0.2, y, k * 0.9, k * 0.65, '#8e8571'); g.strokeStyle = INK; g.lineWidth = 2.6; g.beginPath(); g.moveTo(x + k * 0.4, y - k * 0.45); g.lineTo(x + k * 0.8, y - k * 0.1); g.moveTo(x + k * 0.4, y + k * 0.45); g.lineTo(x + k * 0.8, y + k * 0.1); g.stroke(); return; }
  if (/vats/.test(id)) { for (const [u, v] of [[-0.42, -0.3], [0.38, -0.32], [-0.05, 0.38]]) { disc(x + k * u, y + k * v, k * 0.32, '#9a8c6a'); disc(x + k * u, y + k * v, k * 0.2, '#6f7f6c'); } return; }
  if (/abbey/.test(id)) { g.beginPath(); for (const [u, v] of [[-0.2, -0.85], [0.2, -0.85], [0.2, -0.35], [0.7, -0.35], [0.7, 0.05], [0.2, 0.05], [0.2, 0.85], [-0.2, 0.85], [-0.2, 0.05], [-0.7, 0.05], [-0.7, -0.35], [-0.2, -0.35]]) g.lineTo(x + k * u, y + k * v); g.closePath();
    g.fillStyle = S; g.fill(); g.strokeStyle = INK; g.lineWidth = 1.4; g.stroke(); disc(x, y - k * 0.15, k * 0.12, '#8a7a66'); return; }
  if (/priory/.test(id)) { plan(x - k * 0.8, y - k * 0.7, k * 1.6, k * 1.4, S, false); plan(x - k * 0.45, y - k * 0.38, k * 0.9, k * 0.76, '#b9b98a', false); roof(x, y - k * 0.86, k * 1.2, k * 0.3, '#8e8571'); return; }
  plan(x - k * 0.7, y - k * 0.7, k * 1.4, k * 1.4, S, true);
}

// the age at the edge, and the frame and the compass
const v = g.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.35, W / 2, H / 2, Math.hypot(W, H) * 0.55); v.addColorStop(0, 'rgba(70,44,20,0)'); v.addColorStop(1, 'rgba(70,44,20,0.42)'); g.fillStyle = v; g.fillRect(0, 0, W, H);
g.strokeStyle = INK; g.lineWidth = 3; g.strokeRect(5, 5, W - 10, H - 10); g.lineWidth = 1; g.strokeRect(11, 11, W - 22, H - 22);
const ox = 52, oy = 60; g.beginPath(); g.arc(ox, oy, 26, 0, 6.2832); g.fillStyle = PAPER; g.fill(); g.strokeStyle = INK; g.lineWidth = 1.2; g.stroke();
g.beginPath(); g.arc(ox, oy, 21, 0, 6.2832); g.lineWidth = 0.6; g.stroke();
g.beginPath(); g.moveTo(ox, oy - 22); g.lineTo(ox + 5.5, oy); g.lineTo(ox, oy + 4); g.lineTo(ox - 5.5, oy); g.closePath(); g.fillStyle = INK; g.fill();
g.beginPath(); g.moveTo(ox, oy + 22); g.lineTo(ox + 4, oy); g.lineTo(ox - 4, oy); g.closePath(); g.fillStyle = PAPER; g.fill(); g.lineWidth = 0.9; g.stroke();
g.fillStyle = INK; g.font = 'bold 13px Georgia, serif'; g.textAlign = 'center'; g.fillText('N', ox, oy - 30);
</script></body></html>`;

// Thornwick's sheet: the names on the map, a title, the scale, the camera
function sheetFor(sc) {
  const px = 5.4, ox = 40, oy = 140, W = 1100, PH = sc.ch * px, H = oy + PH + 110;
  const X = (x) => ox + (x - sc.crop[0]) * px, Y = (y) => oy + (y - sc.crop[1]) * px;
  const t = (x, y, s, o = {}) => `<text x="${X(x).toFixed(1)}" y="${Y(y).toFixed(1)}" text-anchor="${o.anchor || 'middle'}" font-family="${o.font || 'Fell It'}" font-size="${o.size || 13}" fill="${o.ink || INK}" stroke="${o.halo || PAPER}" stroke-width="3" paint-order="stroke">${s}</text>`;
  const out = [`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">`];
  out.push(`<rect x="14" y="14" width="${W - 28}" height="${H - 28}" fill="none" stroke="${INK}" stroke-width="1.4"/>`);
  out.push(`<text x="40" y="62" font-family="Fell SC" font-size="36" fill="${INK}" letter-spacing="3">Thornwick</text>`);
  out.push(`<text x="40" y="90" font-family="Fell It" font-size="17" fill="${DIM}">the Hollow Vale · levels 1–15 · as shipped, drawn from the game's own world (seed ${SEED})</text>`);
  out.push(`<text x="${W - 40}" y="62" text-anchor="end" font-family="Fell It" font-size="16" fill="${DIM}">medium · timber palisade · ${sc.cw} × ${sc.ch} tiles shown</text>`);
  out.push(`<text x="40" y="118" font-family="Fell It" font-size="15" fill="${INK}">The square and its five services, ten houses, the palisade and its eight towers, the gate east, the fields and farms outside.</text>`);
  for (const s of sc.services) { const k = { temple: [0, -9.5], tavern: [0, 10], shop: [0, -7], smith: [0, 9], inn: [3, 8] }[s.kind] || [0, 9]; out.push(t(s.x + k[0], s.y + k[1], s.name, { font: 'Fell', size: 13.5 })); }
  const [hx, hy, hr] = [sc.hub.x, sc.hub.y, sc.hub.r];
  out.push(`<circle cx="${X(hx)}" cy="${Y(hy)}" r="${hr * px}" fill="none" stroke="${GOLD}" stroke-width="2" stroke-dasharray="7 5"/>`);
  out.push(t(hx - 4, hy + hr + 4.5, 'the square (its menus)', { ink: GOLD }));
  out.push(t(119, 70, 'the gate'), t(150, 86, 'the road out, to the Vale'), t(140, 24, 'fields and a farm'), t(144, 124, 'a farm'), t(40, 128, 'fields'), t(30, 2, 'the churchyard', { size: 12 }));
  const cx = W - 70, cy = oy + 46;
  out.push(`<circle cx="${cx}" cy="${cy}" r="26" fill="${PAPER}" stroke="${INK}"/><polygon points="${cx},${cy - 22} ${cx + 5},${cy} ${cx},${cy + 3} ${cx - 5},${cy}" fill="${INK}"/><text x="${cx}" y="${cy - 30}" text-anchor="middle" font-family="Fell" font-size="13" fill="${INK}">N</text>`);
  const sy = oy + PH + 32;
  out.push(`<rect x="40" y="${sy}" width="${10 * px}" height="5" fill="${INK}"/><rect x="${40 + 10 * px}" y="${sy}" width="${10 * px}" height="5" fill="${PAPER}" stroke="${INK}"/><text x="40" y="${sy + 20}" font-family="Fell It" font-size="12" fill="${INK}">0</text><text x="${40 + 20 * px}" y="${sy + 20}" text-anchor="middle" font-family="Fell It" font-size="12" fill="${INK}">20 tiles</text>`);
  out.push(`<text x="${40 + 20 * px + 40}" y="${sy + 9}" font-family="Fell It" font-size="13" fill="${DIM}">Drawn by tools/worldmap/minimap.mjs from src/sim/outdoor.js buildTown: the same tiles the game walks. The bare copy (minimap-thornwick.png) has no words.</text>`);
  out.push('</svg>');
  return { svg: out.join(''), px, ox, oy, W, H };
}

mkdirSync(OUT, { recursive: true });
const { chromium } = await import(pathToFileURL(join(ROOT, 'node_modules', 'playwright', 'index.mjs')).href);
const b = await chromium.launch({ executablePath: process.env.CHROME || '/opt/pw-browsers/chromium' }).catch(() => chromium.launch());
const shoot = async (html, w, h, file, type) => {
  const tmp = join(OUT, `.render-${Date.now()}.html`); writeFileSync(tmp, html);
  const p = await b.newPage({ viewport: { width: Math.ceil(w), height: Math.ceil(h) } });
  await p.goto(pathToFileURL(tmp).href); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(150);
  await p.screenshot({ path: file, type, omitBackground: type === 'png', ...(type === 'jpeg' ? { quality: 88 } : {}) }); await p.close(); unlinkSync(tmp);
  console.log('drew', file);
};
for (const sc of SCENES) {
  await shoot(page(sc, null), sc.cw * PX, sc.ch * PX, join(OUT, `minimap-${sc.id}.png`), 'png');
  const over = sc.id === sc.region, pins = over ? pinsOf(sc) : undefined;
  writeFileSync(join(OUT, `minimap-${sc.id}.json`), JSON.stringify({ scene: sc.id, region: sc.region, px: PX, x0: sc.crop[0], y0: sc.crop[1], w: sc.cw, h: sc.ch, seed: SEED, ...(pins ? { pins } : {}) }, null, 1) + '\n');
  if (over) await shoot(landPage(sc), sc.cw * LPX, sc.ch * LPX, join(OUT, `land-${sc.id}.jpg`), 'jpeg');
  if (over && ASSETS) { mkdirSync(ASSETS, { recursive: true }); for (const f of [`minimap-${sc.id}.json`, `land-${sc.id}.jpg`]) copyFileSync(join(OUT, f), join(ASSETS, f)); console.log('copied', `assets/maps/land-${sc.id}`); }
  if (sc.id === 'thornwick') { const s = sheetFor(sc); await shoot(page(sc, s), s.W, s.H, join(OUT, `map-${sc.id}.jpg`), 'jpeg'); }
}
await b.close();
