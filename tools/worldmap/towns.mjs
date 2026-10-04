// towns.mjs — the region towns side by side (docs/region-towns-proposal.md): each one drawn as a block model in the
// game's own view (the camera looks from the south-east, so the back of a town, north and west, is the top of its
// panel), all at one scale so a small town reads small. Every town keeps Thornwick's square: the five services and the
// well stand in the same tiles (src/sim/outdoor.js buildTown); what changes is the size, the edge, the ground and the
// set pieces. Deterministic (seeded); a proposal sketch, not a bake.
//   node tools/worldmap/towns.mjs [out.jpg]   → docs/img/towns/town-plans.jpg
import { writeFileSync, mkdirSync, unlinkSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const OUT = resolve(process.argv[2] || join(ROOT, 'docs', 'img', 'towns', 'town-plans.jpg'));
const W = 1200, PW = 1200, PH = 780, TOP = 112, K = 2.45;   // one column: read on a phone held upright
const BG = '#17161d', PANEL = '#1e1d25', TEXT = '#e6d9bd', DIM = '#a89c84', EDGE = '#0e0d12';

let seed = 0x70e115;
const rand = () => { seed = (seed + 0x6d2b79f5) >>> 0; let t = seed; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
const rr = (a, b) => a + (b - a) * rand();
const f1 = (v) => v.toFixed(1);
const out = [];
const add = (s) => out.push(s);

// ── one panel: a projection, a ground layer and a list of solids drawn back to front ─────────────────────────────────
function panel(col, row, spec) {
  const px = col * PW, py = TOP + row * PH, [x0, y0, x1, y1] = spec.extent;
  const cx = px + PW / 2, cy = py + 100 + 300 + (spec.dy || 0), DX = (x0 - y1 + x1 - y0) / 2, DY = (x0 + y0 + x1 + y1) / 2;
  const P = (x, y, z = 0) => [cx + (x - y - DX) * K, cy + (x + y - DY) * K * 0.5 - z * K];
  const pts = (a, z = 0) => a.map(([x, y]) => P(x, y, z)).map(([a, b]) => f1(a) + ',' + f1(b)).join(' ');
  const ground = [], solids = [], notes = [];
  const g = {
    P,
    poly: (a, fill, o = '') => ground.push(`<polygon points="${pts(a)}" fill="${fill}" ${o}/>`),
    ellipse: (x, y, rx, ry, fill, n = 36) => g.poly(Array.from({ length: n }, (_, i) => [x + Math.cos(i / n * 6.2832) * rx, y + Math.sin(i / n * 6.2832) * ry]), fill),
    blob: (x, y, r, fill, rough = 0.35, n = 14) => g.poly(Array.from({ length: n }, (_, i) => { const a = i / n * 6.2832, k = 1 + (rand() - 0.5) * rough; return [x + Math.cos(a) * r * k, y + Math.sin(a) * r * k]; }), fill),
    line: (a, w, stroke, o = '') => ground.push(`<polyline points="${pts(a)}" fill="none" stroke="${stroke}" stroke-width="${f1(w * K * 0.8)}" stroke-linecap="round" stroke-linejoin="round" ${o}/>`),
    // a block: footprint x0..x1 × y0..y1, h tall. The camera sees its top and its +x and +y faces.
    box: (bx0, by0, bx1, by1, h, c, o = {}) => solids.push({ d: bx1 + by1, s: () => {
      const top = [[bx0, by0], [bx1, by0], [bx1, by1], [bx0, by1]];
      const z = o.z || 0, t = z + h;   // o.z: stood on posts (Saltmere's stilts)
      let s = z ? [[bx0, by1], [bx1, by1], [bx1, by0], [(bx0 + bx1) / 2, by1]].map(([x, y]) => { const [a, b] = P(x, y), [, c2] = P(x, y, z); return `<line x1="${f1(a)}" y1="${f1(b)}" x2="${f1(a)}" y2="${f1(c2)}" stroke="#2a2018" stroke-width="1.6"/>`; }).join('') : '';
      s += `<polygon points="${[P(bx0, by1, z), P(bx1, by1, z), P(bx1, by1, t), P(bx0, by1, t)].map((p) => p.map(f1).join(',')).join(' ')}" fill="${c[1]}" stroke="${EDGE}" stroke-width="0.8"/>`;
      s += `<polygon points="${[P(bx1, by0, z), P(bx1, by1, z), P(bx1, by1, t), P(bx1, by0, t)].map((p) => p.map(f1).join(',')).join(' ')}" fill="${c[2]}" stroke="${EDGE}" stroke-width="0.8"/>`;
      s += `<polygon points="${pts(top, t)}" fill="${o.open ? '#2a2620' : c[0]}" stroke="${EDGE}" stroke-width="0.8"/>`;
      if (o.ridge) { const [a, b] = o.ridge === 'x' ? [[bx0, (by0 + by1) / 2], [bx1, (by0 + by1) / 2]] : [[(bx0 + bx1) / 2, by0], [(bx0 + bx1) / 2, by1]];
        s += `<polyline points="${pts([a, b], t)}" stroke="${EDGE}" stroke-width="1" opacity="0.6"/>`; }
      if (o.lit) for (let i = 0; i < o.lit; i++) { const u = (i + 0.5) / o.lit, [wx, wy] = P(bx0 + (bx1 - bx0) * u, by1, z + h * 0.45); s += `<rect x="${f1(wx - 1.2)}" y="${f1(wy - 1.6)}" width="2.4" height="3.2" fill="#e8a24a" opacity="0.9"/>`; }
      return s; } }),
    tree: (x, y, r, c = '#34452a', trunk = 3) => solids.push({ d: x + y, s: () => { const [a, b] = P(x, y), [, tb] = P(x, y, trunk);
      return `<line x1="${f1(a)}" y1="${f1(b)}" x2="${f1(a)}" y2="${f1(tb)}" stroke="#2a1f17" stroke-width="2"/><ellipse cx="${f1(a)}" cy="${f1(tb - r * K * 0.55)}" rx="${f1(r * K)}" ry="${f1(r * K * 0.75)}" fill="${c}" stroke="${EDGE}" stroke-width="0.8"/>`; } }),
    pine: (x, y, h, c = '#2c3a30', snow = false) => solids.push({ d: x + y, s: () => { const [a, b] = P(x, y), w = h * 0.32 * K;
      return `<polygon points="${f1(a - w)},${f1(b)} ${f1(a + w)},${f1(b)} ${f1(a)},${f1(b - h * K)}" fill="${c}" stroke="${EDGE}" stroke-width="0.8"/>` + (snow ? `<polygon points="${f1(a - w * 0.35)},${f1(b - h * K * 0.66)} ${f1(a + w * 0.35)},${f1(b - h * K * 0.66)} ${f1(a)},${f1(b - h * K)}" fill="#c3c6cc"/>` : ''); } }),
    rock: (x, y, r, h, c, top) => solids.push({ d: x + y + r * 0.5, s: () => {
      const n = 9, ring = Array.from({ length: n }, (_, i) => { const a = i / n * 6.2832, k = 0.75 + rand() * 0.45; return [x + Math.cos(a) * r * k, y + Math.sin(a) * r * k]; });
      const crown = ring.map(([a, b]) => [x + (a - x) * 0.6, y + (b - y) * 0.6]), q = (a) => a.map((p) => p.map(f1).join(',')).join(' ');
      let s = `<polygon points="${q(ring.map(([a, b]) => P(a, b)))}" fill="${c}" stroke="${EDGE}" stroke-width="0.8"/>`;
      const sides = ring.map((p, i) => [i, (i + 1) % n]).filter(([i, j]) => { const [ax, ay] = ring[i], [bx, by] = ring[j]; return (by - ay) - (bx - ax) < 0 ? false : true; })
        .sort((u, v) => (ring[u[0]][0] + ring[u[0]][1]) - (ring[v[0]][0] + ring[v[0]][1]));
      for (const [i, j] of sides) s += `<polygon points="${q([P(...ring[i]), P(...ring[j]), P(...crown[j], h), P(...crown[i], h)])}" fill="${c}" stroke="${EDGE}" stroke-width="0.6"/>`;
      return s + `<polygon points="${q(crown.map(([a, b]) => P(a, b, h)))}" fill="${top}" stroke="${EDGE}" stroke-width="0.6"/>`; } }),
    cone: (x, y, r, h, c, top) => solids.push({ d: x + y, s: () => { const [a, b] = P(x, y), [, t] = P(x, y, h);
      return `<polygon points="${f1(a - r * K)},${f1(b)} ${f1(a + r * K)},${f1(b)} ${f1(a)},${f1(t)}" fill="${c}" stroke="${EDGE}" stroke-width="0.8"/><polygon points="${f1(a)},${f1(t)} ${f1(a + r * K)},${f1(b)} ${f1(a + r * K * 0.2)},${f1(b)}" fill="${top}" opacity="0.5"/>`; } }),
    raw: (d, f) => solids.push({ d, s: f }),
    note: (x, y, txt, o = {}) => notes.push([P(x, y, o.z || 0), txt, o]),
  };
  spec.draw(g);
  add(`<rect x="${px + 8}" y="${py + 6}" width="${PW - 16}" height="${PH - 12}" rx="10" fill="${PANEL}"/>`);
  add(`<clipPath id="c${col}${row}"><rect x="${px + 8}" y="${py + 76}" width="${PW - 16}" height="${PH - 170}" rx="6"/></clipPath>`);
  add(`<g clip-path="url(#c${col}${row})"><rect x="${px}" y="${py}" width="${PW}" height="${PH}" fill="${spec.outside || '#1b1a20'}"/>${ground.join('')}${solids.sort((a, b) => a.d - b.d).map((s) => s.s()).join('')}</g>`);
  for (const [[x, y], txt, o] of notes) add(`<text x="${f1(x)}" y="${f1(y)}" font-family="Fell It" font-size="${o.size || 14}" fill="${o.fill || TEXT}" text-anchor="${o.anchor || 'middle'}" paint-order="stroke" stroke="#14131a" stroke-width="4" stroke-linejoin="round">${txt}</text>`);
  add(`<text x="${px + 26}" y="${py + 40}" font-family="Fell SC" font-size="27" fill="${TEXT}" letter-spacing="2">${spec.name}</text>`);
  add(`<text x="${px + 26}" y="${py + 64}" font-family="Fell It" font-size="16" fill="${DIM}">${spec.sub}</text>`);
  add(`<text x="${px + PW - 26}" y="${py + 40}" font-family="Fell It" font-size="16" fill="${spec.tagc || '#d49a5a'}" text-anchor="end">${spec.tag}</text>`);
  spec.swatches.forEach(([c, label], i) => {
    const sx = px + 26 + i * 118, sy = py + PH - 86;
    add(`<rect x="${sx}" y="${sy}" width="96" height="30" rx="4" fill="${c}" stroke="#0c0b10"/>`);
    add(`<text x="${sx + 48}" y="${sy + 50}" font-family="Fell It" font-size="13.5" fill="${DIM}" text-anchor="middle">${label}</text>`);
  });
}

// ── the square every town shares (outdoor.js buildTown) ───────────────────────────────────────────────────────────────
function square(g, st, paving) {
  g.ellipse(60, 62, 25, 23, paving); g.ellipse(36, 40, 9, 8, paving);
  g.box(26, 19, 42, 30, 13, st.temple || st.house, { ridge: 'x', lit: 2 });   // the temple at the head
  g.box(23, 42, 34, 55, 9, st.house, { ridge: 'y', lit: 2 });                 // tavern
  g.box(46, 37, 55, 46, 8, st.house, { ridge: 'x', lit: 1 });                 // shop
  g.box(46, 63, 56, 72, 6, st.house, { ridge: 'x', lit: 1 });                 // smithy
  g.box(67, 49, 79, 62, 10, st.house, { ridge: 'y', lit: 2 });                // inn
  g.box(65, 70, 67.5, 72.5, 2, ['#3a3a3a', '#2c2c30', '#36363a']);            // the well
}
function houses(g, list, c) { for (const [x, y, w = 8, d = 8, h = 7] of list) g.box(x - w / 2, y - d / 2, x + w / 2, y + d / 2, h, c, { ridge: w > d ? 'x' : 'y', lit: 1 }); }
function wallBox(g, x0, y0, x1, y1, h, c, gate) {   // a circuit; gate = [x, y] cut in the east wall
  const t = 2;
  g.box(x0, y0 - t, x1, y0, h, c); g.box(x0, y1, x1, y1 + t, h, c); g.box(x0 - t, y0, x0, y1, h, c);
  g.box(x1, y0, x1 + t, gate[1] - 6, h, c); g.box(x1, gate[1] + 6, x1 + t, y1, h, c);
  g.box(x1 - 1, gate[1] - 7, x1 + 4, gate[1] - 3, h + 5, c); g.box(x1 - 1, gate[1] + 3, x1 + 4, gate[1] + 7, h + 5, c);
}
function towers(g, list, h, c) { for (const [x, y] of list) g.box(x - 2.8, y - 2.8, x + 2.8, y + 2.8, h, c); }
const scatter = (n, x0, y0, x1, y1, ok, f) => { for (let i = 0; i < n; i++) { const x = rr(x0, x1), y = rr(y0, y1); if (ok(x, y)) f(x, y); } };

// ── the towns ─────────────────────────────────────────────────────────────────────────────────────────────────────────
const TOWNS = [
  { name: 'Thornwick', sub: 'Emberfall · levels 1–15 · shipped, for scale', tag: 'medium · timber palisade', tagc: '#9fb07a',
    extent: [-10, -10, 160, 135], outside: '#1d2219',
    swatches: [['#4d5934', 'meadow grass'], ['#6b5a44', 'dirt road'], ['#6e655a', 'cobbles'], ['#8a7a45', 'wheat'], ['#34526a', 'the brook']],
    draw(g) {
      g.poly([[-10, -10], [160, -10], [160, 135], [-10, 135]], '#4d5934');
      g.poly([[128, 18], [150, 18], [150, 50], [128, 50]], '#8a7a45'); g.poly([[132, 92], [152, 92], [152, 114], [132, 114]], '#8a7a45');
      g.line([[124, -10], [122, 20], [126, 60], [125, 100], [128, 135]], 7, '#34526a');
      g.line([[160, 80], [112, 80]], 6, '#6b5a44'); g.line([[114, 80], [84, 80], [76, 76]], 6, '#6e655a');
      g.box(121, 77, 130, 83, 1.2, ['#7a7064', '#5a5148', '#6a6158']);
      const st = { house: ['#4a4c5a', '#5d4634', '#6e5640'] }, tim = ['#5a4632', '#3e3024', '#4b3a2b'];
      square(g, st, '#6e655a');
      houses(g, [[100, 68], [76, 19], [88, 19], [100, 19], [101, 31], [89, 33], [24, 70], [24, 82], [40, 97], [24, 96]], st.house);
      wallBox(g, 10, 8, 112, 108, 5, tim, [112, 80]);
      towers(g, [[10, 8], [61, 8], [112, 8], [10, 58], [112, 40], [10, 108], [61, 108], [112, 108]], 9, tim);
      scatter(70, -10, -10, 160, 135, (x, y) => (x < 4 || y < 2) && x + y < 120, (x, y) => g.tree(x, y, rr(3, 5)));
      scatter(10, 86, 86, 110, 106, () => true, (x, y) => g.tree(x, y, 3, '#3c5130'));
      g.note(139, 30, 'fields'); g.note(124, 120, 'brook');
    } },
  { name: 'Saltmere', sub: 'the Greywater Fens · Emberfall’s waystation · levels 8–15', tag: 'small · no wall: stilts over the water', tagc: '#9fb08a',
    extent: [-6, -6, 140, 122], outside: '#161c1a',
    swatches: [['#2f3a33', 'bog water'], ['#3a3226', 'peat and mud'], ['#6b6a3e', 'reed beds'], ['#4e5a2e', 'duckweed'], ['#5e4a36', 'boardwalk']],
    draw(g) {
      g.poly([[-6, -6], [140, -6], [140, 122], [-6, 122]], '#2f3a33');
      for (let i = 0; i < 30; i++) g.blob(rr(-6, 140), rr(-6, 122), rr(5, 13), '#3a3226', 0.6);                 // islands of peat
      for (let i = 0; i < 40; i++) g.blob(rr(-6, 140), rr(-6, 122), rr(2, 5), '#4e5a2e', 0.7);                  // duckweed
      for (let i = 0; i < 34; i++) { const x = rr(-6, 140), y = rr(-6, 122); for (let k = 0; k < 6; k++) { const a = rr(-0.6, 0.6); g.line([[x + k * 0.7, y], [x + k * 0.7 + a, y - 0.1]], 0.5, '#6b6a3e'); } g.blob(x + 2, y, 2.4, '#6b6a3e', 0.6); }   // reed beds
      g.ellipse(60, 62, 25, 23, '#5e4a36'); g.ellipse(36, 40, 9, 8, '#5e4a36');                                 // the square is a deck on piles
      g.line([[140, 80], [84, 80], [76, 76]], 3.4, '#5e4a36');                                                     // the boardwalk in
      g.line([[30, 56], [20, 76], [24, 96]], 2.4, '#5e4a36'); g.line([[66, 50], [80, 26], [96, 22]], 2.4, '#5e4a36'); g.line([[72, 70], [92, 92], [110, 100]], 2.4, '#5e4a36');
      const st = { house: ['#363d36', '#5b5f57', '#6a6e64'], temple: ['#363d36', '#7a7e72', '#8a8e82'] };
      g.box(26, 19, 42, 30, 11, st.temple, { ridge: 'x', lit: 2, z: 2 });   // the Grey Sisters' chapel, where a town's temple stands
      g.box(23, 42, 34, 55, 9, st.house, { ridge: 'y', lit: 2, z: 2 });    // the Drowned Eel, with the board, where the tavern stands
      g.box(65, 70, 67.5, 72.5, 2, ['#3a3a3a', '#2c2c30', '#36363a']);     // the well, here a cistern of rainwater
      for (const [x, y, w, d] of [[48, 40, 8, 8], [76, 22, 9, 8], [96, 22, 8, 9], [20, 76, 8, 9], [24, 96, 9, 8], [92, 92, 8, 8], [110, 100, 9, 8], [50, 68, 8, 8]])
        g.box(x - w / 2, y - d / 2, x + w / 2, y + d / 2, 6, st.house, { ridge: w > d ? 'x' : 'y', lit: 1, z: 3 });
      for (const [x, y] of [[104, 60], [112, 66], [20, 30]]) g.box(x - 1, y - 3, x + 1, y + 3, 1.6, ['#4b3a2b', '#3e3024', '#5e4a36']);   // punts
      for (const [x, y] of [[120, 40], [118, 46], [124, 52], [8, 110]]) g.box(x - 0.6, y - 0.6, x + 0.6, y + 0.6, 3, ['#6b5a40', '#4b3a2b', '#5e4a36']);   // eel traps on stakes
      scatter(36, -6, -6, 140, 122, (x, y) => (x - 60) ** 2 + (y - 62) ** 2 > 2200, (x, y) => rand() < 0.6 ? g.tree(x, y, rr(2, 3.4), '#3a4232', rr(4, 6)) : g.raw(x + y, () => { const [a, b] = g.P(x, y), [, c] = g.P(x, y, 9); return `<path d="M${f1(a)},${f1(b)} L${f1(a)},${f1(c)} M${f1(a)},${f1(c + 8)} l-7,-6 M${f1(a)},${f1(c + 14)} l6,-5" stroke="#2c241c" stroke-width="2" fill="none"/>`; }));   // stunted alders, dead trees
      g.raw(400, () => [[16, 12], [118, 20], [100, 112], [6, 60]].map(([x, y]) => { const [a, b] = g.P(x, y, 4); return `<circle cx="${f1(a)}" cy="${f1(b)}" r="3" fill="#b8d4c0" opacity="0.8"/><circle cx="${f1(a)}" cy="${f1(b)}" r="9" fill="#b8d4c0" opacity="0.12"/>`; }).join(''));   // marsh-lights
      g.note(110, 112, 'the boardwalk in', { size: 13 }); g.note(60, 92, 'the square: a deck on piles', { size: 13 }); g.note(122, 34, 'eel traps', { size: 13 }); g.note(16, 4, 'marsh-lights', { size: 13, z: 8 });
    } },
  { name: 'Ashgate', sub: 'the Cinder Reach · levels 15–30 · a mining town', tag: 'large · slag-brick walls', tagc: '#d08a5a',
    extent: [-26, -26, 176, 150], outside: '#2a221c', dy: 36,
    swatches: [['#7a5f45', 'dry earth'], ['#94785a', 'dust'], ['#7d4a35', 'red outcrop'], ['#2e2a28', 'slag'], ['#6b4a32', 'tailings']],
    draw(g) {
      g.poly([[-26, -26], [176, -26], [176, 150], [-26, 150]], '#7a5f45');
      for (let i = 0; i < 26; i++) g.blob(rr(-26, 176), rr(-26, 150), rr(6, 16), '#94785a', 0.5);          // dust pans
      for (let i = 0; i < 70; i++) { const x = rr(-26, 176), y = rr(-26, 150), a = rr(0, 6.28); g.line([[x, y], [x + Math.cos(a) * 3, y + Math.sin(a) * 3], [x + Math.cos(a + 0.8) * 5, y + Math.sin(a + 0.8) * 5]], 0.5, '#5a4432'); }   // cracks
      g.line([[134, -26], [131, 30], [136, 80], [132, 150]], 8, '#8c7a62', 'opacity="0.9"');                // the dry wash
      for (let i = 0; i < 22; i++) g.blob(rr(129, 139), rr(-20, 146), 1.2, '#a8987e');
      g.poly([[140, 104], [168, 100], [172, 128], [146, 132]], '#6b4a32'); g.note(158, 140, 'tailings pond', { size: 13 });
      g.line([[176, 80], [118, 80]], 6, '#5e4a38'); g.line([[176, 84], [140, 84], [128, 96], [100, 140]], 1.2, '#2b2420');   // road and the ore rails
      g.line([[120, 80], [84, 80], [76, 76]], 6, '#4b4542');
      g.box(129, 77, 139, 83, 1.4, ['#5a5450', '#3a3633', '#4a4542']);
      const st = { house: ['#5e3024', '#4c4542', '#5c544f'], temple: ['#4a2a22', '#4c4542', '#5c544f'] }, wall = ['#3a3533', '#262321', '#312d2b'];
      square(g, st, '#4b4542');
      houses(g, [[70, -2, 16, 6, 6], [92, -2, 16, 6, 6], [108, 6, 6, 14, 6], [70, 10, 16, 6, 6], [92, 12, 16, 6, 6], [-2, 50, 6, 16, 6], [-2, 70, 6, 16, 6], [8, 90, 6, 14, 6],
        [100, 66], [64, 92, 14, 6, 6], [84, 92, 14, 6, 6], [104, 92, 10, 6, 6], [64, 104, 14, 6, 6], [84, 104, 14, 6, 6], [30, 100], [44, 104]], st.house);
      g.rock(8, 20, 8, 9, '#7d4a35', '#9a5e44');                                                            // an outcrop the town was built round
      wallBox(g, -8, -10, 120, 116, 7, wall, [120, 80]);
      towers(g, [[-8, -10], [40, -10], [88, -10], [120, -10], [-8, 40], [-8, 90], [120, 40], [-8, 116], [56, 116], [120, 116]], 12, wall);
      g.raw(205, () => { const [a, b] = g.P(122, 80, 22); return `<ellipse cx="${f1(a)}" cy="${f1(b)}" rx="${f1(7 * K)}" ry="${f1(9 * K)}" fill="none" stroke="#1a1614" stroke-width="2.4"/>` + [0, 1, 2, 3].map((i) => `<line x1="${f1(a + Math.cos(i * 0.785) * 7 * K)}" y1="${f1(b + Math.sin(i * 0.785) * 9 * K)}" x2="${f1(a - Math.cos(i * 0.785) * 7 * K)}" y2="${f1(b - Math.sin(i * 0.785) * 9 * K)}" stroke="#1a1614" stroke-width="1.2"/>`).join(''); });
      for (const [x, y, r] of [[146, -6, 9], [160, 10, 7], [150, 26, 8], [166, 34, 6]]) g.cone(x, y, r, r * 1.2, '#2e2a28', '#4a4440');
      for (const [x, y] of [[-20, -22], [-12, -24], [-4, -22]]) g.box(x - 2, y - 2, x + 2, y + 2, 34, ['#2a2422', '#1c1816', '#24201e']);
      g.raw(-1, () => [[-20, -22], [-12, -24], [-4, -22]].map(([x, y], i) => { const [a, b] = g.P(x, y, 38 + i * 3); return `<circle cx="${f1(a + 6)}" cy="${f1(b - 6)}" r="9" fill="#3a3436" opacity="0.6"/><circle cx="${f1(a + 16)}" cy="${f1(b - 14)}" r="12" fill="#3a3436" opacity="0.4"/>`; }).join(''));
      scatter(40, -26, -26, 176, 150, (x, y) => x < -12 || y < -14 || x > 126 || y > 122, (x, y) => rand() < 0.45 ? g.rock(x, y, rr(3, 8), rr(3, 9), '#7d4a35', '#9a5e44') : g.tree(x, y, 1.6, '#5a5a38', 2));
      g.note(156, -16, 'slag heaps'); g.note(-2, -30, 'the Cinderworks', { z: 26, anchor: 'start' }); g.note(122, 80, 'pithead wheel', { z: 36, size: 13 });
    } },
  { name: 'Tollhaven', sub: 'the Tidemark · levels 30–45 · the free port', tag: 'large · stone walls, the harbour open', tagc: '#8fb3c0',
    extent: [-14, -14, 178, 168], outside: '#1a2329',
    swatches: [['#a08c68', 'beach sand'], ['#7d7360', 'wet sand'], ['#77756c', 'shingle'], ['#6b6e45', 'dune grass'], ['#2f4b55', 'the sea']],
    draw(g) {
      g.poly([[-14, -14], [178, -14], [178, 168], [-14, 168]], '#2f4b55');
      g.poly([[-14, -14], [178, -14], [178, 70], [150, 96], [124, 112], [112, 122], [10, 122], [-14, 128]], '#5b5a48');       // the land behind the shore
      g.poly([[124, 60], [178, 40], [178, 120], [160, 140], [134, 136], [118, 122]], '#a08c68');                                // the beach
      g.poly([[178, 120], [160, 140], [134, 136], [118, 122], [124, 126], [138, 142], [162, 146], [178, 128]], '#7d7360');     // the wet sand
      g.poly([[118, 122], [124, 126], [138, 142], [162, 146], [178, 128], [178, 150], [160, 156], [130, 150], [116, 132]], '#46656b');   // the shallows
      for (let i = 0; i < 20; i++) g.blob(rr(126, 176), rr(44, 110), rr(3, 6), '#6b6e45', 0.6);                               // dune grass
      for (let i = 0; i < 16; i++) g.blob(rr(112, 128), rr(100, 124), rr(1.5, 3), '#77756c', 0.5);                             // shingle
      g.line([[124, -14], [122, 30], [126, 70], [122, 110], [126, 130]], 6, '#3a5a64');                                        // the creek to the sea
      g.line([[178, 80], [112, 80]], 6, '#7a6a52'); g.line([[114, 80], [84, 80], [76, 76]], 6, '#6a5a50');
      g.box(119, 77, 129, 83, 1.4, ['#7a7064', '#5a5148', '#6a6158']);
      const st = { house: ['#6a3a2c', '#6c5446', '#7a6050'], temple: ['#4a4f5a', '#6c6460', '#7a726c'] }, wall = ['#706a60', '#4e4942', '#5e5850'];
      g.poly([[8, 108], [114, 108], [114, 124], [8, 124]], '#6e6a64');                                                         // the quay
      square(g, st, '#6a5a50');
      houses(g, [[76, 19], [88, 19], [100, 19], [101, 31], [89, 33], [76, 32], [24, 70], [24, 82], [24, 96], [100, 66], [40, 92], [90, 92], [102, 92]], st.house);
      for (const x of [22, 46, 70, 94]) g.box(x - 8, 100, x + 8, 106, 7, ['#4a4f5a', '#4e4942', '#5e5850'], { ridge: 'x' });  // warehouses on the quay
      g.box(-2, 8, 0, 124, 8, wall); g.box(-2, 6, 114, 8, 8, wall); g.box(112, 8, 114, 74, 8, wall); g.box(112, 86, 114, 108, 8, wall);
      g.box(111, 73, 116, 77, 13, wall); g.box(111, 83, 116, 87, 13, wall);
      towers(g, [[-1, 7], [56, 7], [113, 7], [-1, 60], [113, 40]], 13, wall);
      g.box(8, 124, 14, 154, 3, wall); g.box(96, 124, 102, 154, 3, wall);                                                     // the moles
      towers(g, [[11, 156], [99, 156]], 12, wall);
      g.raw(320, () => { const [a, b] = g.P(11, 156, 4), [c, d] = g.P(99, 156, 4); return `<path d="M${f1(a)},${f1(b)} Q${f1((a + c) / 2)},${f1((b + d) / 2 + 12)} ${f1(c)},${f1(d)}" fill="none" stroke="#14131a" stroke-width="2" stroke-dasharray="3 2"/>`; });
      for (const x of [30, 54, 78]) { g.box(x - 1.5, 124, x + 1.5, 144, 1, ['#5e4a36', '#3e3024', '#4b3a2b']); g.box(x + 3, 132, x + 9, 136, 1.6, ['#4b3a2b', '#3e3024', '#5e4a36']); g.raw(x + 140, () => { const [a, b] = g.P(x + 6, 134, 1.6); return `<line x1="${f1(a)}" y1="${f1(b)}" x2="${f1(a)}" y2="${f1(b - 22)}" stroke="#2a2018" stroke-width="1.4"/>`; }); }
      for (const [x, y] of [[150, 128], [140, 120]]) g.box(x - 4, y - 1.5, x + 4, y + 1.5, 1.4, ['#4b3a2b', '#3e3024', '#5e4a36']);   // boats on the beach
      for (const [x, y] of [[140, 70], [146, 80]]) g.box(x - 4, y, x + 4, y + 0.6, 4, ['#3e3024', '#3e3024', '#4b3a2b']);            // net racks
      scatter(14, -14, -14, 120, 6, () => true, (x, y) => g.tree(x, y, rr(2.5, 4), '#3c4a34'));
      g.note(55, 164, 'the harbour chain'); g.note(158, 96, 'the beach'); g.note(54, 140, 'the jetties', { size: 13 });
    } },
  { name: 'Rookstead', sub: 'the Greenwood · levels 45–60 · a clan steading', tag: 'small · no wall: a ring of stones', tagc: '#9fb07a',
    extent: [-6, -6, 132, 118], outside: '#171d15',
    swatches: [['#3d3826', 'forest floor'], ['#3f4a2c', 'moss'], ['#5a4630', 'leaf litter'], ['#4f5a3a', 'clearing grass'], ['#556070', 'standing stone']],
    draw(g) {
      g.poly([[-6, -6], [132, -6], [132, 118], [-6, 118]], '#3d3826');
      for (let i = 0; i < 40; i++) g.blob(rr(-6, 132), rr(-6, 118), rr(3, 9), rand() < 0.5 ? '#5a4630' : '#3f4a2c', 0.6);
      g.ellipse(56, 56, 52, 50, '#4f5a3a'); g.ellipse(60, 62, 24, 22, '#5b5340');
      g.line([[132, 80], [104, 80], [84, 78], [72, 74]], 4, '#5a4a36');
      g.line([[112, -6], [110, 30], [114, 70], [112, 118]], 4, '#2e4652');
      g.box(108, 78, 117, 82, 1, ['#5e4a36', '#3e3024', '#4b3a2b']);
      const turf = ['#4a5232', '#4e3a2a', '#5c4632'];
      square(g, { house: turf, temple: ['#3e4a2c', '#5a5450', '#686260'] }, '#5b5340');
      houses(g, [[80, 14, 18, 7, 6], [96, 30, 7, 18, 6], [14, 72, 7, 18, 6], [30, 96, 18, 7, 6], [80, 96, 18, 7, 6], [96, 62, 7, 14, 6]], turf);
      for (let i = 0; i < 14; i++) { const a = i / 14 * 6.2832; const x = 56 + Math.cos(a) * 52, y = 56 + Math.sin(a) * 50; g.box(x - 1.2, y - 1.2, x + 1.2, y + 1.2, 6 + (i % 3), ['#6a7480', '#4a5260', '#556070']); }
      g.box(69.5, 64, 72.5, 67, 4, ['#6a7480', '#4a5260', '#556070']);   // the moot-stone by the well
      g.tree(16, 18, 14, '#2f4026', 6);                                     // the great oak by the temple
      scatter(90, -6, -6, 132, 118, (x, y) => (x - 56) ** 2 / 3000 + (y - 56) ** 2 / 2800 > 1, (x, y) => g.tree(x, y, rr(4, 7), rand() < 0.5 ? '#2f4026' : '#36472a', 4));
      for (const [x, y] of [[100, 46], [102, 50], [98, 52]]) g.cone(x, y, 1.6, 2.4, '#8a7448', '#a08a58');   // skeps
      g.cone(118, 104, 7, 4, '#2a2622', '#3a3430');                                                           // the charcoal clamp
      g.note(56, 4, 'the ring of stones', { size: 13 }); g.note(16, 0, 'the great oak', { z: 20, size: 13 }); g.note(118, 112, 'charcoal clamp', { size: 13 });
    } },
  { name: 'Frosthold', sub: 'the Pale Heights · levels 60–75 · the monastery in the pass', tag: 'small · the pass is its wall', tagc: '#b8c4d4',
    extent: [-10, -24, 150, 124], outside: '#1d2026',
    swatches: [['#b8bcc4', 'snow'], ['#6a6258', 'frozen dirt'], ['#8a8060', 'tussock'], ['#6b6d70', 'rock and scree'], ['#2f3d33', 'pines']],
    draw(g) {
      g.poly([[-10, -24], [150, -24], [150, 124], [-10, 124]], '#6a6258');
      for (let i = 0; i < 24; i++) g.blob(rr(-10, 150), rr(-10, 100), rr(3, 8), '#8a8060', 0.6);
      for (let i = 0; i < 46; i++) { const y = rr(-24, 110); g.blob(rr(-10, 150), y, rr(4, 12) * (y < 30 ? 1.4 : 0.8), '#b8bcc4', 0.55); }   // snow, deeper in the lee of the north crags
      g.poly([[-10, 104], [150, 100], [150, 124], [-10, 124]], '#3e4248');                                                   // the drop to the frozen stream
      g.line([[-10, 116], [60, 114], [150, 118]], 5, '#8aa0b0');
      g.line([[150, 80], [112, 80]], 5, '#5a5248'); g.line([[114, 80], [84, 80], [76, 76]], 6, '#5c5854');
      const st = { house: ['#48536a', '#7a7974', '#8a8984'], temple: ['#3e475c', '#8a8984', '#9a9994'] }, wall = ['#8a8984', '#5e5d5a', '#6e6d6a'];
      square(g, st, '#5c5854');
      g.box(18, 10, 24, 16, 26, st.temple);                                                                                  // the bell tower
      houses(g, [[76, 22], [90, 26], [100, 66], [24, 74], [26, 90], [84, 92]], st.house);
      g.box(110, 10, 113, 74, 9, wall); g.box(110, 86, 113, 102, 9, wall); g.box(108, 72, 115, 76, 14, wall); g.box(108, 84, 115, 88, 14, wall);   // the pass-wall
      for (let x = -10; x < 150; x += rr(7, 12)) g.rock(x, rr(-20, -8), rr(8, 13), rr(16, 30), '#5e6064', '#c3c6cc');       // the north crags, snow on their heads
      for (let y = 0; y < 100; y += rr(9, 13)) g.rock(rr(-12, -4), y, rr(7, 11), rr(14, 24), '#5e6064', '#c3c6cc');           // the mountainside behind the monastery
      scatter(26, 0, 0, 150, 104, (x, y) => (x > 112 || y > 86 || x < 14) && !(Math.abs(y - 80) < 6 && x > 100), (x, y) => rand() < 0.5 ? g.rock(x, y, rr(2.5, 6), rr(2, 6), '#6b6d70', '#b8bcc4') : g.pine(x, y, rr(9, 14), '#2f3d33', true));
      for (const x of [124, 134, 144]) g.cone(x, 74, 1.4, 3, '#7a7974', '#9a9994');                                          // pilgrims' cairns
      g.note(60, -22, 'the north crags', { z: 26 }); g.note(111, 104, 'the pass-wall', { size: 13 }); g.note(60, 122, 'the frozen stream', { size: 13 }); g.note(21, 13, 'bells', { z: 30, size: 13 });
    } },
  { name: 'The Lamphall', sub: 'Solmere · from level 15 · the Guild’s house in the dead capital', tag: 'largest · broken imperial walls', tagc: '#d4b46a',
    extent: [-34, -40, 170, 150], outside: '#1d1d20',
    swatches: [['#8a8478', 'imperial flags'], ['#4f5536', 'weeds'], ['#6f6a61', 'rubble'], ['#5a5040', 'mud flats'], ['#3d5059', 'the Mere']],
    draw(g) {
      g.poly([[-34, -40], [170, -40], [170, 150], [-34, 150]], '#8a8478');
      g.poly([[40, -40], [170, -40], [170, 20], [140, -6], [100, -18], [60, -24]], '#5a5040');                              // the mud where the Mere was
      g.poly([[80, -40], [170, -40], [170, 0], [150, -14], [118, -28]], '#3d5059');                                           // the Mere now
      for (let i = 0; i < 160; i++) { const x = rr(-34, 170), y = rr(-20, 150), a = rr(0, 3.14); g.line([[x, y], [x + Math.cos(a) * 6, y + Math.sin(a) * 6]], 0.45, '#5f5a50'); }   // the pavers' joints
      for (let i = 0; i < 40; i++) g.blob(rr(-34, 170), rr(-16, 150), rr(1.5, 4), '#4f5536', 0.7);
      g.line([[170, 80], [124, 80]], 7, '#7a746a'); g.line([[126, 80], [84, 80], [76, 76]], 7, '#7a746a'); g.line([[-34, 120], [10, 100], [40, 80]], 6, '#7a746a');
      const st = { house: ['#4a4c5a', '#7a746a', '#8a8478'], temple: ['#4e4a5e', '#8a8478', '#9a948a'] }, wall = ['#9a948a', '#6e6a62', '#7e7a72'];
      square(g, st, '#7a746a');
      houses(g, [[76, 19, 10, 10, 12], [92, 19, 10, 10, 14], [104, 34, 8, 12, 12], [100, 66, 10, 10, 12], [24, 72, 10, 10, 11], [20, 92, 10, 10, 12], [40, 104, 12, 8, 10], [96, 96, 10, 10, 12], [-10, 30, 10, 12, 12], [-12, 60, 10, 12, 12]], st.house);
      for (const [x, y] of [[84, 104], [110, 100], [-14, 92], [60, 104]]) g.box(x - 5, y - 5, x + 5, y + 5, 7, st.house, { open: true });   // roofless
      for (let x = 88; x < 116; x += 6) for (const y of [74, 86]) g.box(x - 0.8, y - 0.8, x + 0.8, y + 0.8, 7, wall);         // the colonnade on the high street
      g.box(-24, -28, -22, 60, 12, wall); g.box(-24, 70, -22, 128, 12, wall); g.box(-24, -30, 30, -28, 12, wall); g.box(46, -30, 124, -28, 12, wall);
      g.box(124, -28, 126, 72, 12, wall); g.box(124, 88, 126, 128, 12, wall); g.box(-24, 128, 126, 130, 12, wall);
      g.box(121, 70, 129, 74, 18, wall); g.box(121, 86, 129, 90, 18, wall);
      towers(g, [[-23, -29], [125, -29], [-23, 129], [125, 129], [-23, 30], [50, 129]], 17, wall);
      for (let i = 0; i < 8; i++) g.rock(rr(30, 46), rr(-34, -24), rr(2, 4), rr(2, 5), '#7e7a72', '#9a948a');                // the breach
      g.box(0, 36, 12, 48, 66, ['#2a2a30', '#3a3834', '#46443e']);                                                          // the Great Beacon, dark
      g.box(144, -32, 154, -24, 10, ['#14141a', '#1c1c22', '#22222a']);                                                     // the Mere Tower, a stump far out
      g.note(6, 42, 'the Great Beacon', { z: 72 }); g.note(149, -28, 'the Mere Tower', { z: 14, size: 13 }); g.note(38, -36, 'the breach', { size: 13 });
      g.note(-30, 112, 'to the Bowl', { size: 13 }); g.note(100, -26, 'the quay over the mud', { size: 13 });
    } },
];

// ── the sheet ─────────────────────────────────────────────────────────────────────────────────────────────────────────
const H = TOP + PH * TOWNS.length + 20;
add(`<rect width="${W}" height="${H}" fill="${BG}"/>`);
add(`<text x="30" y="50" font-family="Fell SC" font-size="34" fill="${TEXT}" letter-spacing="3">The region towns</text>`);
add(`<text x="30" y="80" font-family="Fell It" font-size="17" fill="${DIM}">One scale throughout. Seen as the game sees it: the camera looks from the south-east, so each town's back (north and west)</text>`);
add(`<text x="30" y="101" font-family="Fell It" font-size="17" fill="${DIM}">is the top of its panel. The square, its five services and the well stand in the same tiles in every town.</text>`);
TOWNS.forEach((t, i) => panel(0, i, t));

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${out.join('\n')}</svg>`;
mkdirSync(dirname(OUT), { recursive: true });
const font = (f) => pathToFileURL(join(ROOT, 'assets', 'fonts', f)).href;
const html = `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face { font-family: 'Fell'; src: url('${font('im-fell-english.woff2')}'); }
@font-face { font-family: 'Fell It'; src: url('${font('im-fell-english-italic.woff2')}'); }
@font-face { font-family: 'Fell SC'; src: url('${font('im-fell-english-sc.woff2')}'); }
html, body { margin: 0; background: ${BG}; }</style></head><body>${svg}</body></html>`;
const tmp = OUT.replace(/\.(jpg|png)$/, '.render.html');
writeFileSync(tmp, html);
const { chromium } = await import(pathToFileURL(join(ROOT, 'node_modules', 'playwright', 'index.mjs')).href);
const b = await chromium.launch({ executablePath: process.env.CHROME || '/opt/pw-browsers/chromium' }).catch(() => chromium.launch());
const p = await b.newPage({ viewport: { width: W, height: H } });
await p.goto(pathToFileURL(tmp).href); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(300);
await p.screenshot({ path: OUT, type: OUT.endsWith('.png') ? 'png' : 'jpeg', ...(OUT.endsWith('.png') ? {} : { quality: 88 }) });
await b.close();
unlinkSync(tmp);
console.log('drew', OUT);
