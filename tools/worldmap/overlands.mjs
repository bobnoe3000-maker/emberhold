// overlands.mjs — each region's overland, around its town (docs/town-streets-proposal.md; the owner, 2026-10-10: "show me
// layout designs for each, and their respective overland maps"). Drawn in the wall map's hand (tools/worldmap/draw.mjs:
// ink on parchment, hills hatched, woods in crowns, imperial roads ruled straight with a dead beacon-tower every day's
// march), at the game's own scale: 260 × 260 tiles, as the Vale's overland is (src/sim/outdoor.js buildOverland), north
// up. Sites from world-map-proposal.md §3–4 with their levels; the roads leave by the edge toward the next region.
// Deterministic (seeded); a proposal sketch, not the game's map. Scattered marks (trees, hills, peaks, rocks, reeds) keep
// off the words, the places, the roads and the rivers (art critic pass 12: the Greenwood's oaks stood in its river and on
// its road, the Heights' peaks on their sites' names): each is dropped where it would cover one.
//   node tools/worldmap/overlands.mjs [outDir]   → docs/img/world/overland-<region>.jpg
import { writeFileSync, mkdirSync, unlinkSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const OUT = resolve(process.argv[2] || join(ROOT, 'docs', 'img', 'world'));
const W = 1200, T = 260, S = 4.1, OX = (W - T * S) / 2, OY = 150;
const PAPER = '#ead9b6', INK = '#3b2f24', DIM = '#6e5e4a', RED = '#9a3a22', SEA = '#8fa4a6';

let seed = 0x0ae1a2;
const rand = () => { seed = (seed + 0x6d2b79f5) >>> 0; let t = seed; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
const f1 = (v) => (+v).toFixed(1);
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const X = (x) => OX + x * S, Y = (y) => OY + y * S;
const pts = (a) => a.map(([x, y]) => f1(X(x)) + ',' + f1(Y(y))).join(' ');

// a smoothed line (Chaikin): a coast or a shore drawn by hand, not ruled
function chaikin(a, n = 2, closed = false) {
  let p = a;
  for (let k = 0; k < n; k++) { const q = closed ? [] : [p[0]]; for (let i = 0; i < (closed ? p.length : p.length - 1); i++) { const [x0, y0] = p[i], [x1, y1] = p[(i + 1) % p.length]; q.push([x0 * 0.75 + x1 * 0.25, y0 * 0.75 + y1 * 0.25], [x0 * 0.25 + x1 * 0.75, y0 * 0.25 + y1 * 0.75]); } if (!closed) q.push(p[p.length - 1]); p = q; }
  return p;
}
const segD = (px, py, [ax, ay], [bx, by]) => { const dx = bx - ax, dy = by - ay, l = dx * dx + dy * dy || 1, u = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / l)); return Math.hypot(px - ax - u * dx, py - ay - u * dy); };

function map(spec) {
  const L = { wash: [], water: [], terrain: [], roads: [], places: [], text: [] }, key = [];
  // what the scattered marks keep off, in sheet px: words (a box, turned with the word), places (a circle), lines
  const avoid = { words: [], spots: [], lines: [], fns: [] };
  let soft = false;
  // a terrain mark: its svg, and the circle it covers (px); a scattered one is dropped later if it covers anything kept
  const mark = (svg, cx, cy, r) => L.terrain.push({ svg, cx, cy, r, soft });
  const line = (a, half) => { const q = a.map(([x, y]) => [X(x), Y(y)]); for (let i = 0; i + 1 < q.length; i++) avoid.lines.push([q[i], q[i + 1], half]); };
  const m = {
    wash: (a, fill, o = '') => L.wash.push(`<polygon points="${pts(a)}" fill="${fill}" ${o}/>`),
    blob: (x, y, r, fill, layer = 'wash', rough = 0.35, n = 14, o = '') => L[layer].push(`<polygon points="${pts(Array.from({ length: n }, (_, i) => { const a = i / n * 6.2832, k = 1 + (rand() - 0.5) * rough; return [x + Math.cos(a) * r * k, y + Math.sin(a) * r * k]; }))}" fill="${fill}" ${o}/>`),
    ellipse: (x, y, rx, ry, fill, layer = 'wash', o = '') => L[layer].push(`<ellipse cx="${f1(X(x))}" cy="${f1(Y(y))}" rx="${f1(rx * S)}" ry="${f1(ry * S)}" fill="${fill}" ${o}/>`),
    // a sea: everything past a coastline, its edge inked with the wall map's ripple lines
    sea: (a) => { L.water.push(`<polygon points="${pts(a)}" fill="${SEA}" stroke="${INK}" stroke-width="1.4"/>`); for (let k = 1; k <= 3; k++) L.water.push(`<polygon points="${pts(a)}" fill="none" stroke="${INK}" stroke-width="0.6" opacity="${0.35 / k}" transform="translate(${k * 4} 0)"/>`); },
    river: (a, w = 1.2, name, o = {}) => { const s = []; for (let i = 0; i + 1 < a.length; i++) { const [x0, y0] = a[i], [x1, y1] = a[i + 1]; for (let j = 0; j < 6; j++) { const u = j / 6, n = (rand() - 0.5) * 3; s.push([x0 + (x1 - x0) * u + n, y0 + (y1 - y0) * u + n * 0.5]); } } s.push(a[a.length - 1]);
      L.water.push(`<polyline points="${pts(s)}" fill="none" stroke="#4e6a74" stroke-width="${f1(w * S * 0.9)}" stroke-linecap="round" stroke-linejoin="round"/>`); line(s, w * S * 0.45 + 4);
      if (name) m.note(o.at ? o.at[0] : a[1][0] + 4, o.at ? o.at[1] : a[1][1], name, { size: 12.5, rot: o.rot || 0 }); },
    road: (a, kind = 'imperial', o = {}) => {
      if (kind !== 'faint') line(a, kind === 'imperial' ? 5 : 3.5);
      if (kind === 'imperial') { L.roads.push(`<polyline points="${pts(a)}" fill="none" stroke="${RED}" stroke-width="2.2" stroke-dasharray="9 5" stroke-linecap="round"/>`);
        // a dead beacon-tower every day's march
        for (let i = 0; i + 1 < a.length; i++) { const [x0, y0] = a[i], [x1, y1] = a[i + 1], d = Math.hypot(x1 - x0, y1 - y0); for (let u = 30; u < d - 10; u += 46) { const x = x0 + (x1 - x0) * u / d, y = y0 + (y1 - y0) * u / d; L.roads.push(`<rect x="${f1(X(x) - 2.5)}" y="${f1(Y(y) - 7)}" width="5" height="8" fill="${INK}"/>`); } } }
      else L.roads.push(`<polyline points="${pts(a)}" fill="none" stroke="${INK}" stroke-width="${kind === 'rails' ? 1.6 : 1.3}" stroke-dasharray="${kind === 'rails' ? '2 3' : kind === 'faint' ? '1 4' : '3 3'}" stroke-linecap="round" opacity="${kind === 'faint' ? 0.55 : 0.85}"/>`);
      if (o.name) m.note(o.at[0], o.at[1], o.name, { size: 12, rot: o.rot || 0, ink: kind === 'imperial' ? RED : INK }); },
    // terrain glyphs, the wall map's
    mountain: (x, y, h, fill = PAPER, snow = false) => { const w = h * 0.9; mark(`<polygon points="${f1(X(x - w))},${f1(Y(y))} ${f1(X(x))},${f1(Y(y - h))} ${f1(X(x + w))},${f1(Y(y))}" fill="${fill}" stroke="${INK}" stroke-width="1.2"/>`
      + `<polygon points="${f1(X(x))},${f1(Y(y - h))} ${f1(X(x + w))},${f1(Y(y))} ${f1(X(x + w * 0.25))},${f1(Y(y))}" fill="${INK}" opacity="${fill === PAPER ? 0.28 : 0.35}"/>`
      + (snow ? `<polygon points="${f1(X(x - w * 0.32))},${f1(Y(y - h * 0.65))} ${f1(X(x))},${f1(Y(y - h))} ${f1(X(x + w * 0.32))},${f1(Y(y - h * 0.65))}" fill="#f6f3ec" stroke="${INK}" stroke-width="0.6"/>` : ''), X(x), Y(y - h * 0.4), h * S * 0.62); },
    hill: (x, y, w) => mark(`<path d="M${f1(X(x - w))},${f1(Y(y))} Q${f1(X(x))},${f1(Y(y - w * 0.8))} ${f1(X(x + w))},${f1(Y(y))}" fill="none" stroke="${INK}" stroke-width="1.1"/>`, X(x), Y(y - w * 0.3), w * S * 0.85),
    tree: (x, y, r, fill = PAPER) => mark(`<circle cx="${f1(X(x))}" cy="${f1(Y(y - r))}" r="${f1(r * S)}" fill="${fill}" stroke="${INK}" stroke-width="0.9"/><line x1="${f1(X(x))}" y1="${f1(Y(y))}" x2="${f1(X(x))}" y2="${f1(Y(y) + 3)}" stroke="${INK}" stroke-width="0.9"/>`, X(x), Y(y - r), r * S + 1),
    pine: (x, y, h, snow) => mark(`<polygon points="${f1(X(x - h * 0.35))},${f1(Y(y))} ${f1(X(x))},${f1(Y(y - h))} ${f1(X(x + h * 0.35))},${f1(Y(y))}" fill="${snow ? '#f6f3ec' : PAPER}" stroke="${INK}" stroke-width="0.9"/>`, X(x), Y(y - h * 0.45), h * S * 0.45),
    tuft: (x, y) => mark(`<path d="M${f1(X(x) - 4)},${f1(Y(y))} l2,-6 M${f1(X(x))},${f1(Y(y))} l0,-7 M${f1(X(x) + 4)},${f1(Y(y))} l-2,-6" stroke="${INK}" stroke-width="0.8" fill="none"/>`, X(x), Y(y) - 3.5, 5),
    heap: (x, y, r) => mark(`<path d="M${f1(X(x - r))},${f1(Y(y))} Q${f1(X(x))},${f1(Y(y - r * 1.2))} ${f1(X(x + r))},${f1(Y(y))} z" fill="#4a4440" stroke="${INK}" stroke-width="0.8"/>`, X(x), Y(y - r * 0.4), r * S),
    rock: (x, y, r) => mark(`<polygon points="${pts(Array.from({ length: 6 }, (_, i) => { const a = i / 6 * 6.2832, k = 0.7 + rand() * 0.5; return [x + Math.cos(a) * r * k, y + Math.sin(a) * r * k * 0.7]; }))}" fill="#b0664a" stroke="${INK}" stroke-width="0.8"/>`, X(x), Y(y), r * S * 1.1),
    ruin: (x, y) => mark(`<path d="M${f1(X(x) - 6)},${f1(Y(y))} v-7 h3 v4 h3 v-6 h3 v9" fill="none" stroke="${INK}" stroke-width="1.1"/>`, X(x), Y(y) - 3.5, 7),
    // places
    town: (x, y, name, o = {}) => { avoid.spots.push([X(x), Y(y), 16]); L.places.push(`<circle cx="${f1(X(x))}" cy="${f1(Y(y))}" r="9" fill="${PAPER}" stroke="${RED}" stroke-width="2.4"/><circle cx="${f1(X(x))}" cy="${f1(Y(y))}" r="3.6" fill="${RED}"/>`); m.note(x + (o.dx ?? 0), y + (o.dy ?? 7.5), name, { font: 'Fell SC', size: 21 }); if (o.sub) m.note(x + (o.dx ?? 0), y + (o.dy ?? 7.5) + 5, o.sub, { size: 12.5, ink: DIM }); },
    stop: (x, y, name, o = {}) => { avoid.spots.push([X(x), Y(y) - 1, 12]); L.places.push(`<path d="M${f1(X(x) - 7)},${f1(Y(y) + 6)} v-8 l7,-6 l7,6 v8 z" fill="${PAPER}" stroke="${INK}" stroke-width="1.4"/>`); m.note(x + (o.dx ?? 0), y + (o.dy ?? 6.5), name, { font: 'Fell', size: 15 }); if (o.sub) m.note(x + (o.dx ?? 0), y + (o.dy ?? 6.5) + 4.2, o.sub, { size: 11.5, ink: DIM }); },
    site: (x, y, name, lv, room, o = {}) => { const n = key.length + 1, hid = !!o.hidden; avoid.spots.push([X(x), Y(y), 11], [X(x) + 11, Y(y) - 8, 9]);
      L.places.push(`<polygon points="${f1(X(x) - 7)},${f1(Y(y) + 5)} ${f1(X(x))},${f1(Y(y) - 8)} ${f1(X(x) + 7)},${f1(Y(y) + 5)}" fill="${hid ? 'none' : INK}" stroke="${INK}" stroke-width="1.4"${hid ? ' stroke-dasharray="3 2"' : ''}/>`);
      L.places.push(`<circle cx="${f1(X(x) + 11)}" cy="${f1(Y(y) - 8)}" r="7.5" fill="${hid ? '#5a3a6a' : '#7a2e1e'}"/><text x="${f1(X(x) + 11)}" y="${f1(Y(y) - 8)}" dy="0.36em" text-anchor="middle" font-family="Fell" font-size="10.5" fill="#f4ead2">${n}</text>`);
      m.note(x + (o.dx ?? 0), y + (o.dy ?? 5.6), name, { size: 13.5 }); m.note(x + (o.dx ?? 0), y + (o.dy ?? 5.6) + 3.8, (hid ? 'hidden · ' : '') + 'levels ' + lv, { size: 11.5, ink: RED });
      key.push({ n, name, lv, room, hid }); },
    exit: (x, y, ang, label, sub) => { const a = ang * Math.PI / 180, dx = Math.cos(a), dy = Math.sin(a); line([[x - dx * 8, y - dy * 8], [x, y]], 6);
      L.places.push(`<line x1="${f1(X(x - dx * 8))}" y1="${f1(Y(y - dy * 8))}" x2="${f1(X(x))}" y2="${f1(Y(y))}" stroke="${RED}" stroke-width="2.4" marker-end="url(#ex)"/>`);
      m.note(x - dx * 16, y - dy * 16 - 2, label, { size: 13.5, ink: RED }); if (sub) m.note(x - dx * 16, y - dy * 16 + 2, sub, { size: 11.5, ink: DIM }); },
    note: (x, y, s, o = {}) => { const size = o.size || 13; avoid.words.push({ x: X(x), y: Y(y), w: String(s).length * size * (o.font === 'Fell SC' ? 0.62 : 0.47) + 6, h: size, rot: o.rot || 0, anchor: o.anchor || 'middle' }); L.text.push(`<text x="${f1(X(x))}" y="${f1(Y(y))}" text-anchor="${o.anchor || 'middle'}" font-family="${o.font || 'Fell It'}" font-size="${o.size || 13}" fill="${o.ink || INK}" stroke="${PAPER}" stroke-width="3.2" paint-order="stroke"${o.rot ? ` transform="rotate(${o.rot} ${f1(X(x))} ${f1(Y(y))})"` : ''}>${esc(s)}</text>`); },
    scatter: (n, x0, y0, x1, y1, fn, keep = () => true) => { soft = true; for (let i = 0; i < n; i++) { const x = x0 + rand() * (x1 - x0), y = y0 + rand() * (y1 - y0); if (keep(x, y)) fn(x, y); } soft = false; },
    // a keep-out of the region's own (the crater's rim): fn(px x, px y, r) → true where a mark mustn't stand
    avoid: (fn) => avoid.fns.push(fn),
    // hand-placed marks that may still give way to a word or a place (the Reach's hills round the Ninth Vault)
    yielding: (fn) => { soft = true; fn(); soft = false; },
    shore: (x, y, rx, ry, fill, layer = 'wash', o = '', rough = 0.1, n = 22) => L[layer].push(`<polygon points="${pts(chaikin(Array.from({ length: n }, (_, i) => { const a = i / n * 6.2832, k = 1 + (rand() - 0.5) * rough; return [x + Math.cos(a) * rx * k, y + Math.sin(a) * ry * k]; }), 3, true))}" fill="${fill}" ${o}/>`),
  };
  spec.draw(m);
  // the scattered marks off everything kept: a mark is dropped where its circle meets a word's box, a place or a line
  const covers = (t) => avoid.words.some((q) => { const a = -q.rot * Math.PI / 180, dx = t.cx - q.x, dy = t.cy - q.y, u = dx * Math.cos(a) - dy * Math.sin(a), v = dx * Math.sin(a) + dy * Math.cos(a);
      const x0 = q.anchor === 'middle' ? -q.w / 2 : q.anchor === 'end' ? -q.w : 0, nx = Math.max(x0, Math.min(x0 + q.w, u)), ny = Math.max(-q.h * 0.85, Math.min(q.h * 0.3, v)); return Math.hypot(u - nx, v - ny) < t.r; })
    || avoid.spots.some(([x, y, r]) => Math.hypot(t.cx - x, t.cy - y) < r + t.r)
    || avoid.lines.some(([a, b, half]) => segD(t.cx, t.cy, a, b) < half + t.r * 0.8)
    || avoid.fns.some((fn) => fn(t.cx, t.cy, t.r));
  const kept = L.terrain.filter((t) => !t.soft || !covers(t));
  dropped.push([spec.id, L.terrain.length - kept.length, L.terrain.filter((t) => t.soft).length]);
  L.terrain = kept.map((t) => t.svg);
  const rows = Math.ceil(key.length / 2), H = OY + T * S + 64 + rows * 42 + (spec.notes || []).length * 22 + 40;
  const svg = [];
  svg.push(`<defs><marker id="ex" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="${RED}"/></marker>
    <radialGradient id="vig" cx="50%" cy="50%" r="72%"><stop offset="60%" stop-color="#000" stop-opacity="0"/><stop offset="100%" stop-color="#5a3e22" stop-opacity="0.28"/></radialGradient></defs>`);
  svg.push(`<rect width="${W}" height="${H}" fill="#cdb894"/><rect x="14" y="14" width="${W - 28}" height="${H - 28}" fill="${PAPER}" stroke="${INK}" stroke-width="1.4"/>`);
  svg.push(`<text x="40" y="62" font-family="Fell SC" font-size="36" fill="${INK}" letter-spacing="3">${esc(spec.name)}</text>`);
  svg.push(`<text x="40" y="90" font-family="Fell It" font-size="17" fill="${DIM}">${esc(spec.sub)}</text>`);
  svg.push(`<text x="40" y="118" font-family="Fell It" font-size="15" fill="${INK}">${esc(spec.lede)}</text>`);
  svg.push(`<rect x="${f1(X(0))}" y="${f1(Y(0))}" width="${f1(T * S)}" height="${f1(T * S)}" fill="${spec.ground || PAPER}"/>`);
  svg.push(`<svg x="${f1(X(0))}" y="${f1(Y(0))}" width="${f1(T * S)}" height="${f1(T * S)}" viewBox="${f1(X(0))} ${f1(Y(0))} ${f1(T * S)} ${f1(T * S)}" overflow="hidden">${[...L.wash, ...L.water, ...L.terrain, ...L.roads, ...L.places, ...L.text].join('')}<rect x="${f1(X(0))}" y="${f1(Y(0))}" width="${f1(T * S)}" height="${f1(T * S)}" fill="url(#vig)"/></svg>`);
  svg.push(`<rect x="${f1(X(0))}" y="${f1(Y(0))}" width="${f1(T * S)}" height="${f1(T * S)}" fill="none" stroke="${INK}" stroke-width="2"/>`);
  // the compass, the scale
  const cx = X(T) - 34, cy = Y(0) + 40;
  svg.push(`<g><circle cx="${cx}" cy="${cy}" r="24" fill="${PAPER}" stroke="${INK}"/><polygon points="${cx},${cy - 21} ${cx + 5},${cy} ${cx},${cy + 3} ${cx - 5},${cy}" fill="${INK}"/><text x="${cx}" y="${cy - 27}" text-anchor="middle" font-family="Fell" font-size="13" fill="${INK}">N</text></g>`);
  const sy = Y(T) + 28;
  svg.push(`<g font-family="Fell It" font-size="12" fill="${INK}"><rect x="${f1(X(0))}" y="${sy}" width="${f1(25 * S)}" height="5" fill="${INK}"/><rect x="${f1(X(25))}" y="${sy}" width="${f1(25 * S)}" height="5" fill="${PAPER}" stroke="${INK}"/><text x="${f1(X(0))}" y="${sy + 20}">0</text><text x="${f1(X(50))}" y="${sy + 20}" text-anchor="middle">50 tiles</text>
    <text x="${f1(X(64))}" y="${sy + 9}">the game's overland, 260 × 260 tiles, as the Vale's</text></g>`);
  let lx = X(T); for (const [g, s] of [['town', 'the town'], ['stop', 'a waystation'], ['site', 'a site'], ['hid', 'hidden site'], ['road', 'imperial road'], ['track', 'track']].reverse()) {
    const w = 22 + s.length * 6.2; lx -= w + 12; const gy = sy + 3;
    svg.push(g === 'town' ? `<circle cx="${lx + 6}" cy="${gy}" r="6" fill="${PAPER}" stroke="${RED}" stroke-width="2"/>` : g === 'stop' ? `<path d="M${lx},${gy + 5} v-6 l6,-5 l6,5 v6 z" fill="${PAPER}" stroke="${INK}"/>` : g === 'site' ? `<polygon points="${lx},${gy + 5} ${lx + 6},${gy - 6} ${lx + 12},${gy + 5}" fill="${INK}"/>` : g === 'hid' ? `<polygon points="${lx},${gy + 5} ${lx + 6},${gy - 6} ${lx + 12},${gy + 5}" fill="none" stroke="${INK}" stroke-dasharray="2 2"/>` : `<line x1="${lx}" y1="${gy}" x2="${lx + 14}" y2="${gy}" stroke="${g === 'road' ? RED : INK}" stroke-width="2" stroke-dasharray="${g === 'road' ? '5 3' : '2 2'}"/>`);
    svg.push(`<text x="${lx + 18}" y="${gy + 4}" font-family="Fell It" font-size="12" fill="${INK}">${esc(s)}</text>`);
  }
  // the key: every site, its levels and its room to remember
  const ky = sy + 58;
  key.forEach((k, i) => { const col = i < rows ? 0 : 1, r = col ? i - rows : i, kx = 40 + col * (W - 80) / 2, yy = ky + r * 42;
    svg.push(`<circle cx="${kx + 9}" cy="${yy - 4}" r="9" fill="${k.hid ? '#5a3a6a' : '#7a2e1e'}"/><text x="${kx + 9}" y="${yy - 4}" dy="0.36em" text-anchor="middle" font-family="Fell" font-size="11.5" fill="#f4ead2">${k.n}</text>`);
    svg.push(`<text x="${kx + 26}" y="${yy}" font-family="Fell" font-size="15" fill="${INK}">${esc(k.name)} <tspan fill="${RED}" font-family="Fell It" font-size="13.5">${k.hid ? 'hidden · ' : ''}${esc(k.lv)}</tspan></text><text x="${kx + 26}" y="${yy + 18}" font-family="Fell It" font-size="13" fill="${DIM}">${esc(k.room)}</text>`); });
  (spec.notes || []).forEach((n, i) => svg.push(`<text x="40" y="${ky + rows * 42 + 8 + i * 22}" font-family="Fell It" font-size="14" fill="${DIM}">${esc(n)}</text>`));
  return { svg: svg.join('\n'), H };
}

const REGIONS = [], dropped = [];

// THE CINDER REACH (15–30): black slag hills north-west, dry earth and red rock; Ashgate in the middle where the Wickham
// road from Emberfall meets the road to Kell's Rest and the road east to Solmere; the Cinderworks up the Ashwater.
REGIONS.push({ id: 'reach', name: 'The Cinder Reach', sub: 'levels 15–30 · Act III, Quota · the town: Ashgate · a waystation: Kell\'s Rest', ground: '#e6d0a8',
  lede: 'In by the Wickham road from the Vale; Ashgate where three roads meet; the Cinderworks up the Ashwater, the old dead volcano west.',
  notes: ['Ore rails run from the Cinderworks down to Ashgate\'s gate. The tailings ponds are rust-red, and nothing grows at their edge.'],
  draw(m) {
    m.scatter(18, 0, 160, 260, 260, (x, y) => m.blob(x, y, 8 + rand() * 12, '#dcc298'));
    m.yielding(() => { for (const [x, y, h] of [[20, 40, 16], [40, 30, 20], [62, 46, 15], [86, 36, 18], [104, 52, 14], [30, 64, 13], [120, 26, 12], [56, 18, 13], [12, 18, 12], [76, 66, 12],
      [62, 176, 13], [80, 186, 16], [98, 176, 12], [52, 196, 11], [94, 200, 12]]) m.mountain(x, y, h, '#7a706a'); });
    m.mountain(30, 92, 26, '#8a6a56'); m.avoid((x, y, r) => Math.hypot(x - X(30), y - Y(80)) < 16 * S + r);   // (no rock on the volcano's flank) m.ellipse(30, 68, 5, 2.2, '#3b2f24', 'terrain'); m.note(30, 100, 'the dead volcano', { size: 12.5 });
    m.scatter(40, 0, 0, 260, 260, (x, y) => m.rock(x, y, 2 + rand() * 2.4), (x, y) => Math.hypot(x - 130, y - 140) > 18);
    m.scatter(14, 150, 40, 210, 90, (x, y) => m.heap(x, y, 3 + rand() * 3));
    m.blob(160, 92, 9, '#b8643a', 'wash'); m.blob(204, 72, 7, '#b8643a', 'wash'); m.note(160, 106, 'tailings', { size: 11.5 });
    m.river([[168, 0], [184, 56], [200, 110], [214, 150], [236, 190], [260, 214]], 1.6, 'the Ashwater', { at: [198, 100], rot: 64 });
    m.road([[142, 260], [130, 140]], 'imperial', { name: 'the Wickham road', at: [146, 200], rot: -84 });
    m.road([[130, 140], [46, 118]], 'imperial', { name: 'the Kell road', at: [86, 124], rot: 15 });
    m.road([[130, 140], [260, 196]], 'imperial', { name: 'the Solmere road', at: [196, 162], rot: 23 });
    m.road([[130, 140], [176, 62]], 'track'); m.road([[132, 138], [178, 64]], 'rails'); m.road([[176, 62], [194, 44]], 'track');
    m.road([[118, 140], [86, 178]], 'track'); m.road([[138, 208], [124, 214]], 'track'); m.road([[214, 160], [206, 150]], 'track');
    m.road([[46, 118], [58, 124]], 'track'); m.road([[46, 112], [52, 70], [60, 42]], 'faint');
    m.town(130, 140, 'Ashgate', { sub: 'slag-brick walls, the pithead wheel', dx: -2 });
    m.stop(46, 118, 'Kell\'s Rest', { sub: 'the Assay\'s depot', dx: -14, dy: -9 });
    m.site(124, 214, 'The Cold Seam', '12–17', 'a played-out Deepdelver mine: the Tally Wall');
    m.site(80, 168, 'The Slag Tunnels', '15–19', 'the Shift-Bell, still ringing for a shift nobody works', { dy: 22 });
    m.site(62, 128, 'The Assay Yards', '18–22', 'the Counting House: Vane\'s ledgers, coal-red wax', { dy: 7 });
    m.site(176, 60, 'The Cinderworks', '20–25', 'one floor a furnace, hotter each floor', { dx: 6, dy: -12 });
    m.site(206, 150, 'The Forgehall of Oruth', '23–27', 'the Anvil of the Charter, where the clans swear');
    m.site(196, 40, 'The Magma Vault', '26–30', 'under Furnace Nine', { dx: 20, dy: -6 });
    m.site(60, 40, 'The Ninth Vault', '30', 'the quota office\'s strongroom (the Reach set)', { hidden: true });
    m.exit(142, 256, 90, 'to Emberfall', 'Thornwick, by the Wickham road');
    m.exit(256, 194, 22, 'to Solmere', 'the Lamphall');
  } });

// SOLMERE (from 15): the Mere in the middle, the city on its south shore with the Beacon, the Bowl west of the walls,
// the Mere Tower out on the water; five roads out, one to every region, and the aqueduct in from the hills.
REGIONS.push({ id: 'solmere', name: 'Solmere', sub: 'from level 15 · the dead capital, a free city · the town: the Lamphall', ground: '#e8d8b4',
  lede: 'The Mere and its mud flats; the Lamphall on the south shore under the Great Beacon; the Bowl; the Mere Tower by punt; a road to every region.',
  notes: ['Solmere has no main story (pillar 5): its sites are the Bowl, the Mere Tower and the Great Beacon, and its trouble is side quests.',
    'Every road out opens with the region it goes to: the Reach from 15, the Tidemark from 30, the Greenwood from 45, the Heights from 60.'],
  draw(m) {
    m.shore(132, 92, 82, 60, '#b9a57e', 'wash', '', 0.16); m.shore(132, 90, 70, 50, SEA, 'water', `stroke="${INK}" stroke-width="1.4"`, 0.12);
    m.note(112, 70, 'the Mere', { font: 'Fell SC', size: 20 }); m.note(132, 150, 'the mud flats, where the lake was', { size: 12 });
    m.river([[132, 0], [130, 20], [132, 40]], 1.8, 'the Sol', { at: [140, 14] });
    m.road([[124, 154], [150, 112], [158, 82]], 'track'); L_tower(m, 158, 80);
    m.note(170, 116, 'Wenna\'s punt', { size: 11.5, rot: -50 });
    // the city, the Beacon, the empty quarters round it
    m.blob(124, 176, 26, '#ddd0b2', 'wash', 0.2); m.scatter(30, 90, 150, 170, 210, (x, y) => m.ruin(x, y), (x, y) => Math.hypot(x - 124, y - 176) > 22 && Math.hypot(x - 124, y - 176) < 40);
    m.note(170, 206, 'the empty quarters', { size: 12 });
    m.road([[8, 40], [40, 70], [80, 120], [108, 164]], 'faint'); for (let i = 0; i < 12; i++) { const u = i / 12, x = 8 + 100 * u, y = 40 + 124 * u; m.ruin(x, y); } m.note(40, 90, 'the aqueduct', { size: 12.5, rot: 50 });
    m.ellipse(62, 190, 13, 9, PAPER, 'places', `stroke="${INK}" stroke-width="1.8"`); m.ellipse(62, 190, 7, 4.5, '#d9c9a4', 'places', `stroke="${INK}" stroke-width="1"`);
    m.road([[86, 182], [74, 188]], 'track');
    m.road([[124, 190], [70, 260]], 'imperial', { name: 'to Greyholt', at: [92, 236], rot: -52 });
    m.road([[110, 166], [0, 70]], 'imperial', { name: 'the Reach road', at: [44, 108], rot: 41 });
    m.road([[144, 168], [204, 130], [260, 40]], 'imperial', { name: 'the Brine Cross road', at: [224, 98], rot: -58 });
    m.road([[140, 190], [260, 252]], 'imperial', { name: 'the Tithe Road', at: [206, 228], rot: 27 });
    m.road([[110, 160], [60, 120], [60, 40], [116, 0]], 'track', { name: 'the pilgrims\' road', at: [52, 60], rot: -86 });
    m.scatter(30, 0, 0, 260, 260, (x, y) => m.hill(x, y, 4 + rand() * 4), (x, y) => Math.hypot((x - 132) / 92, (y - 92) / 70) > 1 && Math.hypot(x - 124, y - 176) > 42);
    m.town(124, 176, 'the Lamphall', { sub: 'the Great Beacon over it', dy: 9 });
    L.beacon(m, 118, 170);
    m.site(62, 190, 'The Bowl', '15+', 'the arena: Ma Gorrie and the Crier', { dy: 12 });
    m.site(158, 80, 'The Mere Tower', '12+', 'the endless tower: a landing every tenth wave', { dx: 0, dy: -11 });
    m.site(118, 166, 'The Great Beacon', '75', 'the last lamp: Let Them Go Dark', { dx: -30, dy: -2 });
    m.exit(70, 256, 110, 'to Emberfall', 'from 1');
    m.exit(4, 72, 205, 'to the Reach', 'from 15');
    m.exit(256, 46, -60, 'to the Tidemark', 'from 30');
    m.exit(256, 250, 27, 'to the Greenwood', 'from 45');
    m.exit(116, 4, -60, 'to the Heights', 'from 60, by the Stair');
  } });
// (two little glyphs Solmere needs: the Mere Tower's stump and the Beacon)
function L_tower(m, x, y) { m.ellipse(x, y, 3.2, 2.2, INK, 'places'); m.ellipse(x, y - 1.5, 3.2, 2.2, '#2a2420', 'places'); }
const L = { beacon: (m, x, y) => { m.ellipse(x, y, 3, 2, INK, 'places'); m.ellipse(x, y - 8, 1.6, 9, '#2a2420', 'places'); } };

// THE TIDEMARK (30–45): the east coast; Tollhaven on it with the harbour; Highmarch walled inland north-west; Brine Cross
// on the Brine, where the road from Solmere crosses; the Lamp Fort on its headland; the Gull Isles; the Drowned Mole.
REGIONS.push({ id: 'tidemark', name: 'The Tidemark', sub: 'levels 30–45 · Act IV, The Seventh Voice · the town: Tollhaven · waystations: Brine Cross, Gullwick', ground: '#e8d9b4',
  lede: 'In from Solmere to Brine Cross on the Brine; the Highmarch road north to the walled kingdom; east to Tollhaven on the coast.',
  notes: ['The salt marsh lies along the shore north of Tollhaven (the town\'s north wall looks over it); the beach runs south to Gullwick.'],
  draw(m) {
    m.sea([[262, -4], [262, 264], ...chaikin([[190, 264], [196, 230], [186, 210], [198, 190], [204, 150], [196, 124], [210, 100], [204, 70], [214, 40], [206, 20], [200, -4]], 3)]);
    for (const [x, y, r] of [[238, 92, 8], [248, 116, 6], [232, 124, 4]]) m.blob(x, y, r, '#e8d9b4', 'water', 0.5, 12, `stroke="${INK}" stroke-width="1.3"`);
    m.blob(250, 172, 3, '#d8c7a0', 'water', 0.6, 9, `stroke="${INK}" stroke-width="1" stroke-dasharray="2 2"`);
    m.scatter(30, 176, 56, 206, 104, (x, y) => m.tuft(x, y)); m.note(184, 52, 'salt marsh', { size: 12 });
    m.scatter(40, 10, 10, 180, 250, (x, y) => m.hill(x, y, 4 + rand() * 5), (x, y) => Math.hypot(x - 80, y - 56) > 22 && Math.hypot(x - 64, y - 170) > 14);
    for (const [x, y, h] of [[30, 22, 14], [52, 14, 12], [100, 22, 13], [118, 34, 11], [20, 50, 11]]) m.mountain(x, y, h);
    m.river([[40, 0], [52, 50], [56, 100], [64, 170], [120, 196], [160, 204], [192, 206]], 1.6, 'the Brine', { at: [52, 120], rot: 84 });
    m.road([[0, 232], [64, 170]], 'imperial', { name: 'from Solmere', at: [24, 206], rot: -44 });
    m.road([[64, 170], [72, 112], [80, 56]], 'imperial', { name: 'the Highmarch road', at: [62, 136], rot: -82 });
    m.road([[80, 56], [206, 112]], 'imperial', { name: 'the coast road', at: [140, 78], rot: 24 });
    m.road([[206, 112], [194, 186], [182, 226]], 'track'); m.road([[208, 104], [214, 60], [222, 30]], 'track');
    m.road([[206, 112], [236, 96]], 'faint'); m.road([[198, 160], [210, 168]], 'faint');
    m.blob(80, 56, 11, '#dccba4', 'wash', 0.15); m.town(206, 112, 'Tollhaven', { sub: 'the harbour, the chain', dx: -22, dy: 8 });
    m.stop(64, 170, 'Brine Cross', { sub: 'houses on the bridge', dx: -2, dy: 7 }); m.stop(182, 226, 'Gullwick', { dx: -18, dy: 2 });
    m.site(222, 28, 'The Lamp Fort', '27–32', 'the Lamp-Room: the last lit lamp on the coast', { dx: -22, dy: -2 });
    m.site(238, 90, 'The Gull Isles', '30–34', 'the Prize Hall, stacked with League cargo', { dy: -14 });
    m.site(210, 168, 'The Drowned Mole', '33–37', 'the sunken harbour: the Chain-House', { dx: 4, dy: 7 });
    m.site(70, 110, 'The Highmarch Road', '37–41', 'the legion\'s camps, a tent at a time', { dx: 24, dy: -3 });
    m.site(70, 176, 'Brine Cross (the siege)', '40–43', 'the bridge-town, held room by room', { dx: 22, dy: 14 });
    m.site(80, 50, 'Highmarch: the Seventh\'s Palace', '42–45', 'the Long Gallery: every portrait bought', { dy: -14 });
    m.site(250, 168, 'The Sister\'s Cabin', '45', 'the wreck of Aurelle\'s Grace (the Tidemark set)', { hidden: true, dx: -14, dy: 12 });
    m.exit(4, 230, 140, 'to Solmere', 'the Brine Cross road');
  } });

// THE GREENWOOD (45–60): the clan woods; the Tithe Road ruled straight through the oaks, half swallowed; Hollin Ford where
// it crosses the slow river; Rookstead in its clearing; the Long Water down the east.
REGIONS.push({ id: 'greenwood', name: 'The Greenwood', sub: 'levels 45–60 · Act V, The Unpaid · the town: Rookstead · a waystation: Hollin Ford', ground: '#e2d6b0',
  lede: 'The Tithe Road in from Solmere, ruled straight through the oaks; Hollin Ford on the slow river; Rookstead in its clearing; the Long Water east.',
  notes: ['The Tithe Road is the empire\'s, and the wood is taking it back: past Rookstead it fades to a track, and past the granary to nothing.'],
  draw(m) {
    m.river([[260, 30], [200, 40], [140, 50], [70, 58], [0, 76]], 2, 'the slow river', { at: [178, 38], rot: -8 });
    m.scatter(26, 44, 44, 110, 72, (x, y) => m.tuft(x, y)); m.note(46, 80, 'the fen', { size: 12 });
    m.river([[204, 0], [214, 70], [206, 130], [222, 190], [196, 260]], 1.6, 'the Long Water', { at: [224, 100], rot: 86 });
    const clear = [[150, 150, 20], [70, 56, 14], [112, 96, 9], [204, 128, 9], [110, 176, 8]];
    m.scatter(900, 0, 0, 260, 260, (x, y) => m.tree(x, y, 2 + rand() * 1.6), (x, y) => clear.every(([cx, cy, r]) => Math.hypot(x - cx, y - cy) > r) && !(y > 48 && y < 66 && x < 120) && Math.abs(y - (50 + (x - 0) * 0)) > 0);
    m.road([[20, 0], [70, 56], [150, 150]], 'imperial', { name: 'the Tithe Road', at: [118, 108], rot: 50 });
    m.road([[150, 150], [170, 196]], 'track'); m.road([[170, 196], [180, 226]], 'faint');
    m.road([[70, 56], [112, 96]], 'track'); m.road([[150, 150], [204, 128]], 'track'); m.road([[150, 150], [110, 176]], 'track');
    m.road([[204, 128], [228, 200]], 'faint'); m.road([[110, 176], [60, 228]], 'faint');
    m.town(150, 150, 'Rookstead', { sub: 'a ring of fourteen stones', dy: 8 });
    m.stop(70, 56, 'Hollin Ford', { sub: 'the ford, the barn', dx: -14, dy: -12 });
    m.site(84, 64, 'Hollin Ford Barn', '42–47', 'the Threshing Floor, laid with sheaves that aren\'t grain', { dx: 14, dy: 7 });
    m.site(112, 96, 'The Charcoal Clearing', '45–49', 'the Cart Yard, and the Cult\'s buyers\' tally');
    m.site(204, 128, 'The Antler Stones', '48–52', 'the moot, and the wardens\' trial ground', { dx: -6 });
    m.site(110, 176, 'The Tally-House', '51–55', 'the Abacus Floor: the count in stone beads, still moving');
    m.site(228, 200, 'The Thornway', '54–57', 'the road the wood is taking back', { dx: -8 });
    m.site(180, 226, 'The Root Granary', '56–60', 'under the oldest oak');
    m.site(60, 228, 'The First Barn', '60', 'where the first tithe was taken (the Greenwood set)', { hidden: true });
    m.exit(22, 4, -70, 'to Solmere', 'the Tithe Road');
  } });

// THE PALE HEIGHTS (60–75): mountains round the crater; the Pilgrims' Stair up from the Frozen Hospice at its foot;
// Frosthold in its pass west of the Stair; the Glass Keep north-east; the Throne in the crater.
REGIONS.push({ id: 'heights', name: 'The Pale Heights', sub: 'levels 60–75 · Act VI, The Throne of Embers · the town: Frosthold · a waystation: the Frozen Hospice', ground: '#ecebe4',
  lede: 'Up the Sol from Solmere to the Frozen Hospice; the Pilgrims\' Stair to the crater; Frosthold in its pass to the west; the Glass Keep north-east.',
  notes: ['After the finale, the Undervaults open under the Throne: the XP and loot dive (canon).'],
  draw(m) {
    m.scatter(22, 0, 0, 260, 260, (x, y) => m.blob(x, y, 10 + rand() * 14, '#f6f4ee'));
    m.ellipse(150, 74, 48, 34, '#d8d2c4', 'wash', `stroke="${INK}" stroke-width="2"`); m.ellipse(150, 74, 36, 24, '#c9c0ae', 'wash', `stroke="${INK}" stroke-width="1"`);
    m.note(150, 50, 'the crater', { size: 13 });
    const keep = (x, y) => Math.hypot((x - 150) / 54, (y - 74) / 40) > 1 && Math.hypot(x - 56, y - 96) > 16 && Math.abs(x - (140 + (y > 110 ? (y - 110) * 0 : 0))) > 12 && Math.hypot(x - 216, y - 34) > 12;
    m.scatter(70, 0, 0, 260, 200, (x, y) => m.mountain(x, y, 9 + rand() * 10, PAPER, true), keep);
    m.scatter(60, 0, 140, 90, 260, (x, y) => m.pine(x, y, 5 + rand() * 3, rand() < 0.5), keep);
    m.scatter(60, 190, 160, 260, 260, (x, y) => m.pine(x, y, 5 + rand() * 3, rand() < 0.5), keep);
    m.river([[150, 106], [146, 160], [136, 210], [132, 260]], 1.4, 'the Sol', { at: [154, 180], rot: 84 });
    m.road([[132, 260], [140, 214]], 'imperial');
    const stair = [[140, 214]]; for (let i = 1; i <= 12; i++) { const u = i / 13, rx = 140 + (150 - 140) * u - (u < 0.5 ? 0 : 2) + 9; stair.push([rx + (i % 2 ? 3 : -3), 214 - i * 8.4]); } stair.push([152, 106]);
    m.avoid((x, y, r) => { const u = (x - X(150)) / (54 * S), v = (y - Y(74)) / (40 * S); return Math.hypot(u, v) < 1 + r / (40 * S); });
    m.road(stair, 'track', { name: 'the Pilgrims\' Stair', at: [168, 168], rot: -84 });
    m.road([[140, 214], [96, 160], [56, 96]], 'track', { name: 'the pass road', at: [84, 142], rot: 52 });
    m.road([[176, 92], [214, 96]], 'faint'); m.road([[150, 104], [200, 150]], 'faint'); m.road([[184, 60], [216, 34]], 'faint');
    m.town(56, 96, 'Frosthold', { sub: 'the monastery in the pass', dy: 9 });
    m.stop(140, 214, '', {});
    m.site(140, 222, 'The Frozen Hospice', '57–62', 'the hospice at the Stair\'s foot, and the Cult\'s camp', { dx: 24, dy: 8 });
    m.site(146, 160, 'The Pilgrims\' Stair', '60–65', 'Nan Ruddock\'s Redhand hold it behind you', { dx: -26 });
    m.site(200, 150, 'The Soulcracks', '64–68', 'the ground split open, and something under it');
    m.site(214, 96, 'The Praetory', '67–71', 'the empire\'s last command post', { dx: 6 });
    m.site(216, 34, 'The Glass Keep', '70–73', 'Aurelle\'s last letter, and the Glass Legate', { dy: 7 });
    m.site(170, 104, 'The Lip', '72–75', 'the crater\'s rim: the First Pilgrim', { dx: 16, dy: 6 });
    m.site(150, 74, 'The Ember Throne', '73–75', 'the finale', { dy: 7 });
    m.exit(132, 256, 90, 'to Solmere', 'down the Sol');
  } });

mkdirSync(OUT, { recursive: true });
const font = (f) => pathToFileURL(join(ROOT, 'assets', 'fonts', f)).href;
const { chromium } = await import(pathToFileURL(join(ROOT, 'node_modules', 'playwright', 'index.mjs')).href);
const b = await chromium.launch({ executablePath: process.env.CHROME || '/opt/pw-browsers/chromium' }).catch(() => chromium.launch());
for (const spec of REGIONS) {
  seed = 0x0ae1a2 ^ (spec.id.length * 104729);
  const { svg, H } = map(spec), file = join(OUT, `overland-${spec.id}.jpg`), tmp = file.replace(/\.jpg$/, '.render.html');
  writeFileSync(tmp, `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face { font-family: 'Fell'; src: url('${font('im-fell-english.woff2')}'); }
@font-face { font-family: 'Fell It'; src: url('${font('im-fell-english-italic.woff2')}'); }
@font-face { font-family: 'Fell SC'; src: url('${font('im-fell-english-sc.woff2')}'); }
html, body { margin: 0; }</style></head><body><svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${f1(H)}" viewBox="0 0 ${W} ${f1(H)}">${svg}</svg></body></html>`);
  const p = await b.newPage({ viewport: { width: W, height: Math.ceil(H) } });
  await p.goto(pathToFileURL(tmp).href); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(200);
  await p.screenshot({ path: file, type: 'jpeg', quality: 86 }); await p.close(); unlinkSync(tmp);
  console.log('drew', file);
}
await b.close();
for (const [id, n, of] of dropped) console.log(`${id}: ${n} of ${of} scattered marks kept off the words, places, roads and rivers`);
