// plans.mjs — the dungeon layouts top-down at one scale, for docs/dungeon-halls-proposal.md: today's caverns
// (sim/level.js generateLevel) beside the proposed halls (tools/dungeon/halls.mjs), the same seeds and room counts,
// and the numbers that compare them. Writes docs/img/dungeon/plans.png and prints the table.
//
//   node tools/dungeon/plans.mjs [seeds=24]
//
// The plan's key: a room's floor in its own tone, a corridor or hall in sand, a full-height wall dark, a wall cut to a
// stub (it would hide floor from the camera) light, the void black; E the entrance, D the descent room.
import { mkdirSync } from 'node:fs';
import { chromium } from 'playwright';
import { generateLevel, FLOOR_Z } from '../../src/sim/level.js';
import { generateHalls } from './halls.mjs';

const N = +(process.argv[2] || 24), ZH = 6, HH = 4;
const key = (x, y) => x + ',' + y;

// how much of a level's floor a wall hides from the camera (+x+y): a wall of height wz at (x, y) hides floor up-screen
// of it whose x + y is within (wz − FLOOR_Z) × ZH ÷ HH and whose x − y is within a tile of its own
function hidden(L) {
  const hid = new Set();
  for (const [k, c] of L.cells) {
    if (c.kind !== 'wall') continue;
    const [x, y] = k.split(',').map(Number), reach = ((c.wz ?? 7) - FLOOR_Z) * ZH / HH;
    for (let s = 1; s < reach; s++) for (let i = 0; i <= s; i++) { const fx = x - i, fy = y - (s - i), f = L.cells.get(key(fx, fy)); if (f && f.kind === 'floor' && Math.abs((x - y) - (fx - fy)) <= 1) hid.add(key(fx, fy)); }
  }
  return hid;
}
function walk(L, from, to) {             // tiles walked from the entrance's middle to the descent room's
  const s = key(Math.floor(from.x), Math.floor(from.y)), d = new Map([[s, 0]]), q = [s];
  for (let h = 0; h < q.length; h++) { const k = q[h], [x, y] = k.split(',').map(Number); if (x === to.cx && y === to.cy) return d.get(k); for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const n = key(x + dx, y + dy), c = L.cells.get(n); if (c && c.kind === 'floor' && !d.has(n)) { d.set(n, d.get(k) + 1); q.push(n); } } }
  return NaN;
}
function stats(L) {
  let floor = 0, corr = 0, x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
  for (const [k, c] of L.cells) { const [x, y] = k.split(',').map(Number); x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y); if (c.kind !== 'floor') continue; floor++; if (c.room < 0) corr++; }
  const roomFloor = floor - corr, hid = [...hidden(L)].filter((k) => L.cells.get(k).room >= 0).length;
  return { rooms: L.rooms.length, corrPerJoin: corr / 6 / Math.max(1, L.edges.length), corrShare: corr / floor, walk: walk(L, L.spawn, L.descentRoom), span: Math.max(x1 - x0, y1 - y0) + 1, hiddenShare: hid / roomFloor };
}
const mean = (a, f) => a.reduce((s, v) => s + f(v), 0) / a.length;

const CASES = [['six rooms (Wickham Keep, the Chapel)', [6, 6]], ['four rooms (the Abbey, the Undercroft)', [4, 4]], ['the Old Barrows (6–8)', undefined]];
const rows = [];
for (const [name, rooms] of CASES) {
  const cav = [], hal = [];
  for (let s = 1; s <= N; s++) { cav.push(stats(generateLevel(s * 7919, 'dread', { rooms }))); hal.push(stats(generateHalls(s * 7919, 'dread', { rooms }))); }
  rows.push([name, cav, hal]);
}
console.log(`| Over ${N} seeds | Caverns (today) | Halls (proposed) |\n|---|---|---|`);
for (const [name, cav, hal] of rows) {
  console.log(`| **${name}** | | |`);
  for (const [label, f, fmt] of [['Tiles walked from the entrance to the descent room', (v) => v.walk, (v) => v.toFixed(0)], ['Corridor length a join (tiles)', (v) => v.corrPerJoin, (v) => v.toFixed(0)],
    ['Corridor share of the floor', (v) => v.corrShare, (v) => (v * 100).toFixed(0) + ' %'], ['Span of the level (tiles)', (v) => v.span, (v) => v.toFixed(0)], ['Room floor hidden behind a wall from the camera', (v) => v.hiddenShare, (v) => (v * 100).toFixed(1) + ' %']])
    console.log(`| ${label} | ${fmt(mean(cav, f))} | ${fmt(mean(hal, f))} |`);
}

// the sheet: three seeds, caverns over halls, each level cropped to its own bounds and drawn at one scale
// (the seeds: the first three whose buildings come out different shapes, an empty bay or more among them, to show the range)
const SEEDS = [], shapes = new Set();
for (let s = 1; SEEDS.length < 3 && s < 400; s++) { const L = generateHalls(s * 7919, 'dread', { rooms: [6, 6] }), k = L.grid.cols + 'x' + L.grid.rows + ':' + L.rooms.map((r) => r.bay.join('')).join(); if (L.grid.cols * L.grid.rows > L.rooms.length && !shapes.has(k)) { shapes.add(k); SEEDS.push(s); } }
const K = 2, PAD = 6, LABEL = 22;
const levels = SEEDS.map((s) => [generateLevel(s * 7919, 'dread', { rooms: [6, 6] }), generateHalls(s * 7919, 'dread', { rooms: [6, 6] })]);
const box = (L) => { let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9; for (const k of L.cells.keys()) { const [x, y] = k.split(',').map(Number); x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y); } return [x0, y0, x1, y1]; };
const cellW = Math.max(...levels.flat().map((L) => { const b = box(L); return b[2] - b[0] + 1; })) * K + PAD * 2, cellH = Math.max(...levels.flat().map((L) => { const b = box(L); return b[3] - b[1] + 1; })) * K + PAD * 2 + LABEL;
// drawn on a canvas in Chromium (as tools/worldmap draws its sheets), each level as [x, y, colour] runs
const TONES = ['#5a4e44', '#4e5560', '#5c5048', '#4a5248', '#584a52', '#505a58', '#5a5444', '#4c4c5c'];
const sheets = levels.map((pair, col) => pair.map((L, row) => {
  const [bx, by] = box(L), ox = col * cellW + PAD - bx * K, oy = row * cellH + LABEL + PAD - by * K, px = [];
  for (const [k, c] of L.cells) { const [x, y] = k.split(',').map(Number); px.push([ox + x * K, oy + y * K, c.kind === 'wall' ? ((c.wz ?? 7) >= 7 ? '#24212b' : '#8a8478') : c.room < 0 ? '#b49a6a' : TONES[c.room % TONES.length]]); }
  const marks = [[L.entrance, 'E'], [L.descentRoom, 'D']].map(([r, t]) => [ox + r.cx * K - 4, oy + r.cy * K + 5, t]);
  return { px, marks, label: [col * cellW + PAD, row * cellH + 16, `${row ? 'Halls (proposed)' : 'Caverns (today)'} · seed ${SEEDS[col] * 7919} · six rooms`] };
})).flat();
mkdirSync('docs/img/dungeon', { recursive: true });
const b = await chromium.launch({ executablePath: process.env.CHROME || '/opt/pw-browsers/chromium' }).catch(() => chromium.launch());
const p = await b.newPage({ viewport: { width: cellW * SEEDS.length, height: cellH * 2 } });
await p.setContent(`<body style="margin:0;background:#0b0a0f"><canvas id=c width=${cellW * SEEDS.length} height=${cellH * 2}></canvas></body>`);
await p.evaluate(({ sheets, K }) => {
  const g = document.getElementById('c').getContext('2d');
  for (const s of sheets) {
    for (const [x, y, c] of s.px) { g.fillStyle = c; g.fillRect(x, y, K, K); }
    g.font = 'bold 13px sans-serif'; g.fillStyle = '#e8dcc4'; for (const [x, y, t] of s.marks) g.fillText(t, x, y);
    g.font = '13px sans-serif'; g.fillStyle = '#c8bca4'; g.fillText(s.label[2], s.label[0], s.label[1]);
  }
}, { sheets, K });
await p.locator('#c').screenshot({ path: 'docs/img/dungeon/plans.png' }); await b.close();
console.log('wrote docs/img/dungeon/plans.png', cellW * SEEDS.length, cellH * 2);
