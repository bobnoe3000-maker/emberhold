// draw.mjs — the Old Provinces of Solmere as the Lantern Guild's wall map (docs/world-map-proposal.md): ink on
// parchment in the old style, the coasts ragged, hills hatched, woods in little crowns, the imperial roads ruled
// straight with their dead beacon-towers, the blank corners left blank. Deterministic (seeded), so a re-run draws the
// same map; edit the places below and run it again.
//   node tools/worldmap/draw.mjs [out.jpg]   → docs/img/world/old-provinces.jpg (and .svg beside it)
// The labels are set in IM Fell English (assets/fonts, OFL), the game's own face; Chromium renders the SVG.
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const OUT = resolve(process.argv[2] || join(ROOT, 'docs', 'img', 'world', 'old-provinces.jpg'));
const W = 2000, H = 1400;

// ── chance, seeded ───────────────────────────────────────────────────────────────────────────────────────────────────
let seed = 0x5017e7e;
const rand = () => { seed = (seed + 0x6d2b79f5) >>> 0; let t = seed; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
const rr = (a, b) => a + (b - a) * rand();
const f1 = (v) => v.toFixed(1);

// ── ink ──────────────────────────────────────────────────────────────────────────────────────────────────────────────
const INK = '#3b2a1c', INK2 = '#5a4330', RED = '#8a3a22', SEA = '#cdbf9c', PAPER = '#eadcbc';
const out = [];
const add = (s) => out.push(s);

// a ragged line through points: each edge split and nudged, again and again (midpoint displacement)
function ragged(pts, closed, rough = 0.18, depth = 5) {
  let p = pts.slice();
  for (let d = 0; d < depth; d++) {
    const q = [];
    for (let i = 0; i < (closed ? p.length : p.length - 1); i++) {
      const a = p[i], b = p[(i + 1) % p.length], len = Math.hypot(b[0] - a[0], b[1] - a[1]);
      const nx = -(b[1] - a[1]) / (len || 1), ny = (b[0] - a[0]) / (len || 1), k = (rand() - 0.5) * len * rough;
      q.push(a, [(a[0] + b[0]) / 2 + nx * k, (a[1] + b[1]) / 2 + ny * k]);
    }
    if (!closed) q.push(p[p.length - 1]);
    p = q;
  }
  return p;
}
const pathOf = (pts, closed) => 'M' + pts.map((p) => f1(p[0]) + ',' + f1(p[1])).join('L') + (closed ? 'Z' : '');
const inside = (pt, poly) => { let c = false; for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) { const [xi, yi] = poly[i], [xj, yj] = poly[j]; if (((yi > pt[1]) !== (yj > pt[1])) && pt[0] < ((xj - xi) * (pt[1] - yi)) / (yj - yi) + xi) c = !c; } return c; };

// ── the land ─────────────────────────────────────────────────────────────────────────────────────────────────────────
const COAST = ragged([[300, 230], [420, 205], [520, 150], [600, 190], [720, 160], [840, 120], [930, 150], [1010, 105], [1100, 140], [1230, 125],
  [1330, 170], [1440, 150], [1560, 210], [1650, 200], [1720, 290], [1800, 350], [1770, 420], [1720, 450], [1760, 520], [1735, 585],
  [1660, 600], [1640, 640], [1700, 680], [1720, 760], [1680, 850], [1700, 930], [1620, 1010], [1580, 1090], [1480, 1120], [1400, 1180],
  [1290, 1170], [1200, 1210], [1110, 1180], [1050, 1110], [990, 1090], [940, 1140], [880, 1170], [780, 1160], [690, 1200], [600, 1185],
  [540, 1240], [470, 1255], [400, 1225], [330, 1190], [300, 1120], [240, 1060], [215, 960], [265, 900], [255, 830], [330, 790],
  [360, 740], [300, 700], [235, 690], [200, 620], [230, 560], [195, 480], [240, 420], [215, 340], [250, 280]], true, 0.2, 5);
const ISLES = [
  ragged([[1810, 470], [1860, 480], [1870, 525], [1820, 540], [1795, 505]], true, 0.3, 4),    // the Gull Isles
  ragged([[1850, 580], [1895, 590], [1890, 630], [1845, 625]], true, 0.3, 4),
  ragged([[1790, 650], [1825, 655], [1818, 690], [1785, 682]], true, 0.3, 4),
  ragged([[120, 640], [170, 630], [180, 690], [130, 705]], true, 0.3, 4),                      // the western skerries
  ragged([[150, 520], [180, 515], [185, 545], [155, 550]], true, 0.3, 4),
  ragged([[880, 1270], [960, 1262], [975, 1300], [900, 1312]], true, 0.3, 4),                  // the southern rocks
];

// ── the frame of the drawing ─────────────────────────────────────────────────────────────────────────────────────────
add(`<defs>
  <radialGradient id="vig" cx="50%" cy="50%" r="72%"><stop offset="60%" stop-color="#000" stop-opacity="0"/><stop offset="100%" stop-color="#3b2208" stop-opacity="0.38"/></radialGradient>
  <filter id="grain" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="7"/><feColorMatrix values="0 0 0 0 0.23  0 0 0 0 0.16  0 0 0 0 0.09  0 0 0 0.10 0"/></filter>
  <filter id="blot" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.006" numOctaves="3" seed="3"/><feColorMatrix values="0 0 0 0 0.45  0 0 0 0 0.33  0 0 0 0 0.16  0 0 0 0.32 -0.06"/></filter>
  <filter id="rough"><feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="2" seed="11"/><feDisplacementMap in="SourceGraphic" scale="2.2"/></filter>
</defs>`);
add(`<rect width="${W}" height="${H}" fill="${PAPER}"/>`);
add(`<rect width="${W}" height="${H}" filter="url(#blot)"/>`);
// the sea: a shade darker, and the old engravers' ripple-lines along every shore
add(`<rect x="40" y="40" width="${W - 80}" height="${H - 80}" fill="${SEA}" opacity="0.35"/>`);
for (const [w, o] of [[44, 0.07], [30, 0.09], [18, 0.12], [8, 0.16]]) {
  add(`<path d="${pathOf(COAST, true)}" fill="none" stroke="${INK2}" stroke-width="${w}" stroke-opacity="${o}" stroke-linejoin="round"/>`);
  for (const isle of ISLES) add(`<path d="${pathOf(isle, true)}" fill="none" stroke="${INK2}" stroke-width="${w * 0.6}" stroke-opacity="${o}" stroke-linejoin="round"/>`);
}
add(`<path d="${pathOf(COAST, true)}" fill="${PAPER}" stroke="${INK}" stroke-width="2.6" stroke-linejoin="round" filter="url(#rough)"/>`);
add(`<clipPath id="land"><path d="${pathOf(COAST, true)}"/></clipPath>`);
for (const isle of ISLES) add(`<path d="${pathOf(isle, true)}" fill="${PAPER}" stroke="${INK}" stroke-width="2" filter="url(#rough)"/>`);

// ── marks: hills, peaks, woods, marsh ────────────────────────────────────────────────────────────────────────────────
// a peak in the old style: a lopsided caret, its shadow side hatched
function peak(x, y, h, w, dark = false) {
  const top = [x + rr(-0.15, 0.15) * w, y - h], l = [x - w, y], r = [x + w, y];
  let s = `<path d="M${f1(l[0])},${f1(l[1])} L${f1(top[0])},${f1(top[1])} L${f1(r[0])},${f1(r[1])}" fill="${dark ? '#4a3a2e' : PAPER}" fill-opacity="${dark ? 0.55 : 1}" stroke="${INK}" stroke-width="1.6" stroke-linejoin="round"/>`;
  const n = Math.max(2, Math.round(h / 5));
  for (let i = 1; i < n; i++) { const t = i / n, ax = top[0] + (r[0] - top[0]) * t, ay = top[1] + (r[1] - top[1]) * t; s += `<path d="M${f1(ax)},${f1(ay)} l${f1(-w * 0.32 * (1 - t * 0.4))},${f1(h * 0.18)}" stroke="${INK}" stroke-width="1" opacity="0.8"/>`; }
  return s;
}
function hill(x, y, w) { return `<path d="M${f1(x - w)},${f1(y)} Q${f1(x)},${f1(y - w * 0.9)} ${f1(x + w)},${f1(y)}" fill="none" stroke="${INK}" stroke-width="1.3"/><path d="M${f1(x + w * 0.25)},${f1(y - w * 0.32)} l${f1(w * 0.3)},${f1(w * 0.18)}" stroke="${INK}" stroke-width="0.9"/>`; }
function tree(x, y, s) { const b = s * 0.55; return `<path d="M${f1(x)},${f1(y + s * 0.2)} l0,${f1(s * 0.7)}" stroke="${INK}" stroke-width="1.1"/><path d="M${f1(x - s * 0.8)},${f1(y + s * 0.35)} a${f1(b)},${f1(b)} 0 0 1 ${f1(s * 0.3)},${f1(-s * 0.95)} a${f1(b)},${f1(b)} 0 0 1 ${f1(s)},${f1(-s * 0.15)} a${f1(b)},${f1(b)} 0 0 1 ${f1(s * 0.3)},${f1(s * 1.1)} z" fill="${PAPER}" stroke="${INK}" stroke-width="1.2"/><path d="M${f1(x + s * 0.15)},${f1(y - s * 0.1)} q${f1(s * 0.35)},${f1(s * 0.1)} ${f1(s * 0.4)},${f1(s * 0.4)}" fill="none" stroke="${INK}" stroke-width="0.8"/>`; }
function pine(x, y, s) { return `<path d="M${f1(x)},${f1(y - s * 1.3)} L${f1(x - s * 0.55)},${f1(y)} L${f1(x + s * 0.55)},${f1(y)} Z" fill="${PAPER}" stroke="${INK}" stroke-width="1.1"/><path d="M${f1(x)},${f1(y)} l0,${f1(s * 0.4)}" stroke="${INK}" stroke-width="1"/>`; }
function reeds(x, y, s) { return `<path d="M${f1(x - s)},${f1(y)} h${f1(s * 2)} M${f1(x)},${f1(y)} l0,${f1(-s * 1.1)} M${f1(x - s * 0.5)},${f1(y)} l${f1(-s * 0.25)},${f1(-s * 0.8)} M${f1(x + s * 0.5)},${f1(y)} l${f1(s * 0.25)},${f1(-s * 0.8)}" stroke="${INK}" stroke-width="1" fill="none"/>`; }

// scatter marks inside an area, roughly evenly, back to front
function scatter(poly, n, minD, make) {
  const xs = poly.map((p) => p[0]), ys = poly.map((p) => p[1]), pts = [];
  for (let t = 0; t < n * 40 && pts.length < n; t++) {
    const p = [rr(Math.min(...xs), Math.max(...xs)), rr(Math.min(...ys), Math.max(...ys))];
    if (inside(p, poly) && inside(p, COAST) && pts.every((q) => Math.hypot(q[0] - p[0], q[1] - p[1]) > minD)) pts.push(p);
  }
  pts.sort((a, b) => a[1] - b[1]); for (const p of pts) add(make(p[0], p[1]));
}
// a chain of peaks along a line
function range(line, n, h, w, dark = false) {
  const pts = [];
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1), seg = t * (line.length - 1), k = Math.min(line.length - 2, Math.floor(seg)), u = seg - k, a = line[k], b = line[k + 1];
    pts.push([a[0] + (b[0] - a[0]) * u + rr(-10, 10), a[1] + (b[1] - a[1]) * u + rr(-12, 12), h * rr(0.7, 1.25), w * rr(0.8, 1.2)]);
  }
  pts.sort((p, q) => p[1] - q[1]); for (const p of pts) add(peak(p[0], p[1], p[2], p[3], dark));
}

// rivers first (marks sit over them), roads after the land
const RIVERS = [
  [[985, 470], [990, 540], [970, 600], [985, 668]],                                            // the Sol, from the crater to the Mere
  [[1080, 720], [1180, 760], [1290, 800], [1420, 840], [1530, 880], [1625, 905]],              // the Long Water, the Mere to the sea
  [[1460, 470], [1540, 520], [1610, 560], [1700, 605]],                                         // the Highmarch water, to Tollhaven
  [[470, 790], [455, 860], [470, 930], [440, 1000], [420, 1070], [395, 1150]],                 // the Vale's river, to the fens and the sea
  [[640, 520], [700, 600], [780, 650], [905, 700]],                                             // the Ashwater, from the Reach to the Mere
];
for (const rv of RIVERS) { const p = ragged(rv, false, 0.35, 4); add(`<path d="${pathOf(p, false)}" fill="none" stroke="${INK2}" stroke-width="2" stroke-linecap="round" opacity="0.85"/>`); }
// the Mere, and the drowned canal (ruled straight, as the empire cut it)
const MERE = ragged([[915, 690], [980, 668], [1070, 680], [1090, 720], [1040, 760], [950, 755], [905, 725]], true, 0.25, 4);
add(`<path d="${pathOf(MERE, true)}" fill="${SEA}" fill-opacity="0.75" stroke="${INK}" stroke-width="1.8"/>`);
for (let i = 0; i < 4; i++) add(`<path d="M${930 + i * 30},${700 + (i % 2) * 22} h22" stroke="${INK2}" stroke-width="0.9" opacity="0.6"/>`);
add(`<path d="M470,960 L470,1195" stroke="${INK2}" stroke-width="2.4" stroke-dasharray="14 5" opacity="0.8"/>`);

// the land's marks
const HEIGHTS_C = [1000, 400];
for (let i = 0; i < 26; i++) { const a = (i / 26) * Math.PI * 2, rad = rr(78, 92); const x = HEIGHTS_C[0] + Math.cos(a) * rad * 1.25, y = HEIGHTS_C[1] + Math.sin(a) * rad * 0.8; if (Math.sin(a) > 0.55 && Math.abs(Math.cos(a)) < 0.3) continue; add(peak(x, y + 10, rr(26, 40), rr(14, 20))); }   // the crater's rim (open to the south: the Pilgrims' Stair)
range([[600, 300], [670, 262], [740, 250], [790, 262]], 11, 46, 22); range([[1215, 262], [1280, 250], [1340, 270], [1400, 310]], 11, 46, 22);   // the Pale Heights (the crater's north kept clear for the name)
range([[700, 330], [800, 300], [900, 300]], 9, 34, 18); range([[1100, 300], [1200, 320], [1300, 350]], 9, 34, 18);
range([[330, 420], [420, 460], [520, 470], [620, 470]], 16, 30, 16, true);                    // the Cinder Reach: black hills
range([[360, 560], [440, 610], [560, 630]], 10, 24, 14, true);
add(peak(395, 470, 62, 34, true)); add(`<path d="M382,410 q13,-14 26,0" fill="none" stroke="${INK}" stroke-width="1.4"/>`);   // Kell's dead volcano, and its smoke
for (let i = 0; i < 3; i++) add(`<path d="M${398 + i * 4},${400 - i * 6} q${8 + i * 3},-10 0,-${18 + i * 6} q-${8 + i * 3},-10 0,-${18 + i * 4}" fill="none" stroke="${INK2}" stroke-width="1" opacity="${0.5 - i * 0.12}"/>`);
range([[350, 770], [420, 760], [500, 765], [580, 780]], 12, 22, 13);                          // the Vale's north range (the Scrag Warren)
range([[1380, 380], [1460, 400], [1520, 440]], 8, 26, 14);                                    // the Highmarch fells
range([[1500, 1000], [1560, 960], [1610, 900]], 7, 22, 12);
scatter([[1060, 830], [1260, 800], [1460, 880], [1520, 1000], [1400, 1060], [1150, 1070], [1010, 1020], [1000, 900]], 280, 17, (x, y) => tree(x, y, rr(7, 10)));   // the Tithewood
scatter([[560, 840], [700, 830], [760, 900], [700, 980], [600, 960]], 34, 18, (x, y) => tree(x, y, rr(6, 8)));               // the Vale's woods
scatter([[600, 380], [700, 350], [760, 420], [680, 470], [600, 450]], 30, 17, (x, y) => pine(x, y, rr(8, 11)));              // pines under the Heights
scatter([[1180, 400], [1300, 390], [1350, 470], [1240, 500]], 26, 17, (x, y) => pine(x, y, rr(8, 11)));
scatter([[300, 1000], [440, 980], [600, 1050], [640, 1160], [420, 1180], [300, 1120]], 70, 16, (x, y) => reeds(x, y, rr(5, 7)));   // the Greywater Fens
scatter([[700, 760], [880, 760], [920, 880], [800, 960], [700, 900]], 26, 30, (x, y) => hill(x, y, rr(10, 15)));             // the downs
scatter([[1160, 560], [1360, 540], [1420, 640], [1250, 680], [1150, 640]], 22, 34, (x, y) => hill(x, y, rr(10, 15)));
scatter([[640, 1000], [880, 960], [960, 1100], [780, 1140]], 16, 36, (x, y) => hill(x, y, rr(9, 14)));

// ── the imperial roads, ruled straight from Solmere, with their dead beacon-towers ──────────────────────────────────
const SOL = [1000, 712];
const PLACES = {
  thornwick: [470, 905], greyholt: [565, 838], saltmere: [385, 1105], reedholm: [545, 1120], ashgate: [525, 560], kells: [395, 485],
  frosthold: [880, 300], glass: [1130, 315], throne: [1000, 402], tollhaven: [1700, 600], highmarch: [1440, 470], brine: [1290, 575],
  gullwick: [1665, 790], rookstead: [1240, 965], hollin: [1095, 885],
};
const ROADS = [[SOL, PLACES.greyholt, PLACES.thornwick], [SOL, PLACES.ashgate], [SOL, PLACES.brine, PLACES.highmarch, PLACES.tollhaven], [SOL, PLACES.rookstead], [SOL, [1000, 470]], [PLACES.ashgate, PLACES.kells], [PLACES.tollhaven, PLACES.gullwick], [PLACES.greyholt, PLACES.ashgate]];
for (const r of ROADS) {
  add(`<path d="${pathOf(r, false)}" fill="none" stroke="${RED}" stroke-width="2" stroke-dasharray="9 6" opacity="0.8"/>`);
  for (let i = 0; i < r.length - 1; i++) {                      // a beacon-tower each long stretch
    const a = r[i], b = r[i + 1], n = Math.floor(Math.hypot(b[0] - a[0], b[1] - a[1]) / 150);
    for (let k = 1; k <= n; k++) { const t = k / (n + 1), x = a[0] + (b[0] - a[0]) * t, y = a[1] + (b[1] - a[1]) * t; add(`<path d="M${f1(x - 3)},${f1(y + 4)} l1,-11 h4 l1,11 z" fill="${INK}" opacity="0.75"/>`); }
  }
}
// the Pilgrims' Stair: a zigzag up into the crater
add(`<path d="M1000,560 l-14,-14 l22,-12 l-20,-14 l18,-14 l-12,-12 l8,-10" fill="none" stroke="${RED}" stroke-width="1.8" stroke-dasharray="5 4"/>`);

// ── places ───────────────────────────────────────────────────────────────────────────────────────────────────────────
const town = (x, y) => `<rect x="${x - 6}" y="${y - 6}" width="12" height="10" fill="${PAPER}" stroke="${INK}" stroke-width="1.5"/><path d="M${x - 7},${y - 6} l7,-7 l7,7" fill="${PAPER}" stroke="${INK}" stroke-width="1.5"/>`;
const hub = (x, y) => `<circle cx="${x}" cy="${y}" r="9" fill="${PAPER}" stroke="${INK}" stroke-width="2"/><circle cx="${x}" cy="${y}" r="4" fill="${RED}"/>`;
const site = (x, y) => `<path d="M${x - 5},${y + 4} l5,-9 l5,9 z" fill="${INK}"/>`;
const ruin = (x, y) => `<path d="M${x - 7},${y + 4} v-8 h3 v4 h3 v-6 h3 v5 h2 v5" fill="none" stroke="${INK}" stroke-width="1.4"/>`;
// Solmere: a great ring-wall on the Mere's shore, the Bowl, and the Great Beacon standing over all
add(`<circle cx="${SOL[0]}" cy="${SOL[1]}" r="34" fill="${PAPER}" stroke="${INK}" stroke-width="2.4"/>`);
for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; add(`<rect x="${f1(SOL[0] + Math.cos(a) * 34 - 3.5)}" y="${f1(SOL[1] + Math.sin(a) * 34 - 3.5)}" width="7" height="7" fill="${PAPER}" stroke="${INK}" stroke-width="1.3"/>`); }
add(`<path d="M${SOL[0] - 30},${SOL[1] + 8} a34,34 0 0 0 22,24" fill="none" stroke="${INK}" stroke-width="3" stroke-dasharray="3 5" opacity="0.6"/>`);   // a breach in the wall
add(`<ellipse cx="${SOL[0] + 14}" cy="${SOL[1] + 10}" rx="10" ry="7" fill="none" stroke="${INK}" stroke-width="1.6"/><ellipse cx="${SOL[0] + 14}" cy="${SOL[1] + 10}" rx="5" ry="3.2" fill="none" stroke="${INK}" stroke-width="1"/>`);   // the Bowl
add(`<path d="M${SOL[0] - 9},${SOL[1] + 4} l3,-46 h12 l3,46 z" fill="#1e1610" stroke="${INK}" stroke-width="1.4"/><path d="M${SOL[0] - 8},${SOL[1] - 42} h16 l-3,-9 h-10 z" fill="#1e1610"/>`);   // the Great Beacon: dark
// the crater and the Throne in it
add(`<ellipse cx="${HEIGHTS_C[0]}" cy="${HEIGHTS_C[1]}" rx="52" ry="30" fill="${PAPER}" stroke="${INK}" stroke-width="1.8"/>`);
for (let i = 0; i < 9; i++) add(`<path d="M${f1(HEIGHTS_C[0] - 44 + i * 11)},${f1(HEIGHTS_C[1] - 16 + Math.abs(i - 4) * 2.5)} l4,9" stroke="${INK}" stroke-width="0.9"/>`);
add(`<path d="M${HEIGHTS_C[0] - 10},${HEIGHTS_C[1] + 8} v-12 l4,-6 l3,4 l3,-8 l3,8 l3,-4 l4,6 v12 z" fill="#1e1610"/>`);
// towns and sites
for (const k of ['thornwick', 'ashgate', 'tollhaven', 'rookstead', 'frosthold']) add(hub(...PLACES[k]));
for (const k of ['greyholt', 'saltmere', 'reedholm', 'kells', 'highmarch', 'brine', 'gullwick', 'hollin']) add(town(...PLACES[k]));
const SITES = [[540, 800, 'site'], [392, 1032, 'ruin'], [520, 1010, 'site'], [620, 900, 'ruin'], [560, 520, 'site'], [610, 560, 'ruin'], [460, 600, 'site'], [1130, 315, 'ruin'], [1215, 440, 'site'],
  [1825, 505, 'site'], [1600, 650, 'ruin'], [1440, 470, 'site'], [1120, 940, 'ruin'], [1320, 1040, 'site'], [1120, 1040, 'ruin']];
for (const [x, y, k] of SITES) add(k === 'ruin' ? ruin(x, y) : site(x, y));
// the Soulcracks: a jagged split in the Heights
add(`<path d="${pathOf(ragged([[1150, 430], [1195, 446], [1240, 428], [1290, 452]], false, 0.6, 3), false)}" fill="none" stroke="${INK}" stroke-width="2.6"/>`);

// ── the old province lines, faint and dotted (the Guild's guess at where one ends) ────────────────────────────────
const BORDERS = [[[230, 700], [420, 720], [600, 720], [760, 760], [820, 900], [800, 1060], [780, 1160]],   // Emberfall
  [[600, 720], [700, 620], [760, 520], [780, 420], [740, 300], [700, 180]],                                  // the Reach / the Heights
  [[760, 520], [900, 560], [1100, 560], [1250, 520], [1320, 420], [1300, 300], [1350, 170]],                 // the Heights' foot
  [[1250, 520], [1320, 640], [1400, 760], [1560, 820], [1690, 820]],                                         // the Tidemark
  [[820, 900], [960, 820], [1100, 790], [1250, 760], [1400, 760]]];                                           // the Tithewood
for (const bd of BORDERS) add(`<path d="${pathOf(ragged(bd, false, 0.25, 3), false)}" fill="none" stroke="${INK}" stroke-width="1.6" stroke-dasharray="1 7" stroke-linecap="round" opacity="0.55" clip-path="url(#land)"/>`);

// ── lettering ────────────────────────────────────────────────────────────────────────────────────────────────────────
const halo = `paint-order="stroke" stroke="${PAPER}" stroke-width="5" stroke-linejoin="round"`;
const label = (x, y, txt, size, o = {}) => add(`<text x="${x}" y="${y}" font-family="${o.sc ? 'Fell SC' : o.it ? 'Fell It' : 'Fell'}" font-size="${size}" fill="${o.fill || INK}" text-anchor="${o.anchor || 'middle'}" letter-spacing="${o.ls || 0}" ${o.halo === false ? '' : halo}${o.rot ? ` transform="rotate(${o.rot} ${x} ${y})"` : ''}${o.op ? ` opacity="${o.op}"` : ''}>${txt}</text>`);
// the regions: spaced capitals, and the band under each in the hand of whoever added it later
const REG = [[330, 860, 'EMBERFALL', '1 – 15'], [450, 345, 'THE CINDER REACH', '15 – 30'], [1520, 380, 'THE TIDEMARK', '30 – 45'], [1290, 1112, 'THE TITHEWOOD', '45 – 60'], [1000, 238, 'THE PALE HEIGHTS', '60 – 75']];
for (const [x, y, n, lv] of REG) { label(x, y, n, n === 'THE PALE HEIGHTS' ? 33 : 38, { sc: true, ls: n === 'THE PALE HEIGHTS' ? 5 : 7 }); label(x, y + 30, `levels ${lv}`, 21, { it: true, fill: RED }); }
label(600, 960, 'the Hollow Vale', 20, { it: true }); label(330, 1170, 'the Greywater Fens', 20, { it: true });
label(1000, 790, 'SOLMERE', 34, { sc: true, ls: 9 }); label(1000, 816, 'the dead capital · the Bowl · the Great Beacon', 18, { it: true });
label(1000, 360, 'the Ember Throne', 17, { it: true });
label(1000, 652, 'the Mere', 16, { it: true });
// towns
const T = [['thornwick', 'Thornwick', 0, 26], ['greyholt', 'Greyholt', 36, -10], ['saltmere', 'Saltmere', -6, 24], ['reedholm', 'Reedholm', 30, 22], ['ashgate', 'Ashgate', 0, 28], ['kells', "Kell’s Rest", -64, 4],
  ['frosthold', 'Frosthold', -58, 6], ['glass', 'the Glass Keep', 4, 28], ['tollhaven', 'Tollhaven', 0, 30], ['highmarch', 'Highmarch', 0, -16], ['brine', 'Brine Cross', 0, 26], ['gullwick', 'Gullwick', -50, 6],
  ['rookstead', 'Rookstead', 0, 28], ['hollin', 'Hollin Ford', -6, -12]];
for (const [k, n, dx, dy] of T) { const [x, y] = PLACES[k]; label(x + dx, y + dy, n, k === 'thornwick' || k === 'ashgate' || k === 'tollhaven' || k === 'rookstead' || k === 'frosthold' ? 22 : 18); }
// sites, small and italic
const S = [[540, 790, 'the Scrag Warren'], [380, 1056, 'the Drowned Abbey'], [520, 1030, 'the Sickpools'], [620, 920, 'the Old Barrows'], [560, 508, 'the Cinderworks'], [612, 584, 'the Forgehall'], [458, 622, 'the Slag Tunnels'],
  [1230, 478, 'the Soulcracks'], [1820, 462, 'the Gull Isles'], [1592, 676, 'the Drowned Mole'], [1120, 962, 'the Tally-House'], [1320, 1062, 'the Root Granary'], [1120, 1060, 'the First Barn?']];
for (const [x, y, n] of S) label(x, y, n, 15, { it: true });
// seas, waters, and the blank corners
label(115, 760, 'THE GREY SEA', 30, { sc: true, ls: 14, rot: -90, halo: false, op: 0.75 });
label(1880, 900, 'THE NARROW SEA', 30, { sc: true, ls: 14, rot: 90, halo: false, op: 0.75 });
label(760, 1300, 'THE SALT DEEPS', 30, { sc: true, ls: 14, halo: false, op: 0.75 });
label(1000, 1150, 'the Bight of Sol', 16, { it: true, halo: false, op: 0.7 });
label(290, 735, 'Cinder Bight', 15, { it: true, halo: false, op: 0.7 });
label(1000, 78, 'the White Waste', 24, { it: true, halo: false, op: 0.7 });
label(1640, 140, 'Here the map is not finished.', 20, { it: true, halo: false, op: 0.55 });
label(1520, 905, 'the Long Water', 15, { it: true, rot: 18 });
label(950, 600, 'the Sol', 15, { it: true, rot: -80 });
label(756, 640, 'the Ashwater', 15, { it: true, rot: 30 });
label(1040, 520, 'the Pilgrims’ Stair', 15, { it: true, anchor: 'start' });
label(486, 1150, 'the drowned canal', 14, { it: true, anchor: 'start', rot: -90 });
// a sea-serpent, because there always is one
add(`<g transform="translate(-1720,-30)"><path d="M1835,1060 q14,-26 28,0 q14,26 28,0 q14,-26 28,0" fill="none" stroke="${INK}" stroke-width="3" stroke-linecap="round"/><path d="M1828,1062 q-12,-16 -2,-24 q10,-4 12,8" fill="${PAPER}" stroke="${INK}" stroke-width="2"/><circle cx="1830" cy="1046" r="1.6" fill="${INK}"/></g>`);

// ── the cartouche, the rose, the scale and the border ───────────────────────────────────────────────────────────────
add(`<g transform="translate(250,1255)"><rect x="-190" y="-62" width="380" height="118" fill="${PAPER}" stroke="${INK}" stroke-width="2"/><rect x="-182" y="-54" width="364" height="102" fill="none" stroke="${INK}" stroke-width="1"/></g>`);
label(250, 1228, 'The Old Provinces', 36, { sc: true, ls: 3, halo: false });
label(250, 1258, 'of Solmere', 26, { it: true, halo: false });
label(250, 1284, 'as the Lantern Guild knows them, in the', 16, { it: true, halo: false });
label(250, 1302, 'three hundred and first year of the Dim', 16, { it: true, halo: false });
const rose = [1800, 1230];
add(`<g transform="translate(${rose[0]},${rose[1]})"><circle r="62" fill="none" stroke="${INK}" stroke-width="1.4"/><circle r="56" fill="none" stroke="${INK}" stroke-width="0.8"/>`
  + [0, 90, 180, 270].map((a) => `<path d="M0,0 L-11,-11 L0,-70 L11,-11 Z" fill="${PAPER}" stroke="${INK}" stroke-width="1.4" transform="rotate(${a})"/><path d="M0,0 L0,-70 L11,-11 Z" fill="${INK}" transform="rotate(${a})"/>`).join('')
  + [45, 135, 225, 315].map((a) => `<path d="M0,0 L-7,-7 L0,-44 L7,-7 Z" fill="${PAPER}" stroke="${INK}" stroke-width="1.1" transform="rotate(${a})"/>`).join('') + `<circle r="5" fill="${RED}"/></g>`);
label(rose[0], rose[1] - 80, 'N', 26, { sc: true, halo: false });
add(`<g transform="translate(1500,1300)">` + [0, 1, 2, 3].map((i) => `<rect x="${i * 50}" y="0" width="50" height="8" fill="${i % 2 ? PAPER : INK}" stroke="${INK}" stroke-width="1.2"/>`).join('') + `</g>`);
label(1600, 1290, 'leagues', 16, { it: true, halo: false }); label(1500, 1330, '0', 14, { halo: false }); label(1600, 1330, '50', 14, { halo: false }); label(1700, 1330, '100', 14, { halo: false });
// the key
add(`<g transform="translate(1580,1100)">`
  + `<g transform="translate(0,0)">${hub(0, 0)}</g><g transform="translate(0,28)">${town(0, 0)}</g><g transform="translate(0,56)">${site(0, 0)}</g><g transform="translate(0,82)">${ruin(0, 0)}</g>`
  + `<path d="M-12,108 h24" stroke="${RED}" stroke-width="2" stroke-dasharray="9 6"/><path d="M-3,138 l1,-11 h4 l1,11 z" fill="${INK}"/></g>`);
for (const [i, t] of ['a hub town', 'a town or waystation', 'a dungeon or site', 'a ruin', 'an imperial road', 'a dead beacon-tower'].entries()) label(1600, 1106 + i * 27 + (i > 3 ? 2 : 0), t, 15, { it: true, anchor: 'start', halo: false });
// the border
add(`<rect x="22" y="22" width="${W - 44}" height="${H - 44}" fill="none" stroke="${INK}" stroke-width="3"/><rect x="34" y="34" width="${W - 68}" height="${H - 68}" fill="none" stroke="${INK}" stroke-width="1.2"/>`);
for (const [x, y] of [[34, 34], [W - 34, 34], [34, H - 34], [W - 34, H - 34]]) add(`<circle cx="${x}" cy="${y}" r="9" fill="${PAPER}" stroke="${INK}" stroke-width="1.6"/><circle cx="${x}" cy="${y}" r="3" fill="${RED}"/>`);
add(`<rect width="${W}" height="${H}" filter="url(#grain)"/>`);
add(`<rect width="${W}" height="${H}" fill="url(#vig)"/>`);

// ── out ──────────────────────────────────────────────────────────────────────────────────────────────────────────────
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${out.join('\n')}</svg>`;
mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT.replace(/\.(jpg|png)$/, '.svg'), svg);
const font = (f) => pathToFileURL(join(ROOT, 'assets', 'fonts', f)).href;
const html = `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face { font-family: 'Fell'; src: url('${font('im-fell-english.woff2')}'); }
@font-face { font-family: 'Fell It'; src: url('${font('im-fell-english-italic.woff2')}'); }
@font-face { font-family: 'Fell SC'; src: url('${font('im-fell-english-sc.woff2')}'); }
html, body { margin: 0; background: ${PAPER}; }</style></head><body>${svg}</body></html>`;
const tmp = OUT.replace(/\.(jpg|png)$/, '.render.html');
writeFileSync(tmp, html);
const { chromium } = await import(pathToFileURL(join(ROOT, 'node_modules', 'playwright', 'index.mjs')).href);
const b = await chromium.launch({ executablePath: process.env.CHROME || '/opt/pw-browsers/chromium' }).catch(() => chromium.launch());
const p = await b.newPage({ viewport: { width: W, height: H } });
await p.goto(pathToFileURL(tmp).href); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(300);
await p.screenshot({ path: OUT, type: OUT.endsWith('.png') ? 'png' : 'jpeg', ...(OUT.endsWith('.png') ? {} : { quality: 86 }) });
await b.close();
const { unlinkSync } = await import('node:fs'); unlinkSync(tmp);
console.log('drew', OUT);
