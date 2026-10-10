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
// each, in tiles), and a default run copies the overlands' bare maps to assets/maps/ for the World map's region tab
// (src/ui/worldmap.js). The exits don't move with the seed (test/worldmap.test.mjs holds the copies to the sim).
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
  return { id, region, crop, cw, ch, ground, pieces, services: w.services, labels: w.labels, exits: w.exits, hub: w.hub, name: w.name };
}

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
  if (over && ASSETS) { mkdirSync(ASSETS, { recursive: true }); for (const ext of ['png', 'json']) copyFileSync(join(OUT, `minimap-${sc.id}.${ext}`), join(ASSETS, `minimap-${sc.id}.${ext}`)); console.log('copied', `assets/maps/minimap-${sc.id}`); }
  if (sc.id === 'thornwick') { const s = sheetFor(sc); await shoot(page(sc, s), s.W, s.H, join(OUT, `map-${sc.id}.jpg`), 'jpeg'); }
}
await b.close();
