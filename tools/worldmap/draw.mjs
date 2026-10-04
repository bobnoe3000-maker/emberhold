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
const W = 1200, H = 2400;                 // portrait, the shape of a phone held upright (the owner)

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

// ── the land (portrait, the owner: "more elongated and taller to fit mobile portrait mode"): the island runs north to
// south, the Heights at the top, Emberfall at the foot ────────────────────────────────────────────────────────────────
const COAST = ragged([[300, 250], [420, 205], [520, 168], [620, 190], [720, 158], [820, 198], [900, 250], [960, 330], [1010, 420], [990, 520],
  [1040, 620], [1062, 720], [1020, 800], [1060, 880], [1050, 960], [985, 1010], [1022, 1080], [1040, 1180], [1000, 1260], [1032, 1340],
  [1010, 1450], [1042, 1560], [1000, 1680], [962, 1780], [982, 1860], [900, 1940], [820, 1975], [740, 1945], [680, 2005], [620, 2080],
  [560, 2160], [480, 2200], [400, 2192], [320, 2168], [240, 2120], [200, 2040], [222, 1960], [170, 1880], [190, 1780], [160, 1680],
  [200, 1600], [262, 1560], [250, 1500], [180, 1462], [150, 1380], [190, 1300], [160, 1200], [200, 1100], [150, 1000], [172, 880],
  [140, 780], [180, 680], [160, 580], [210, 480], [200, 380], [250, 300]], true, 0.2, 5);
const ISLES = [
  ragged([[1085, 875], [1125, 880], [1132, 922], [1090, 930]], true, 0.3, 4),                 // the Gull Isles
  ragged([[1098, 958], [1140, 962], [1136, 1002], [1096, 996]], true, 0.3, 4),
  ragged([[62, 1000], [104, 994], [110, 1040], [70, 1046]], true, 0.3, 4),                     // the western skerries
  ragged([[80, 860], [106, 856], [110, 884], [84, 888]], true, 0.3, 4),
  ragged([[760, 2110], [818, 2102], [830, 2142], [772, 2152]], true, 0.3, 4),                  // the southern rocks
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
  [[600, 600], [606, 760], [588, 900], [602, 1090]],                                            // the Sol, from the crater to the Mere
  [[680, 1200], [780, 1300], [880, 1400], [960, 1520], [1010, 1600]],                            // the Long Water, the Mere to the sea
  [[820, 840], [880, 880], [950, 920], [1020, 960]],                                             // the Highmarch water, to Tollhaven
  [[380, 1525], [360, 1650], [330, 1800], [300, 1950], [262, 2140]],                             // the Vale's river, to the fens and the sea
  [[400, 860], [440, 950], [490, 1040], [540, 1120]],                                            // the Ashwater, from the Reach to the Mere
];
for (const rv of RIVERS) { const p = ragged(rv, false, 0.35, 4); add(`<path d="${pathOf(p, false)}" fill="none" stroke="${INK2}" stroke-width="2" stroke-linecap="round" opacity="0.85"/>`); }
const MERE = ragged([[520, 1130], [580, 1100], [670, 1110], [690, 1150], [640, 1195], [550, 1192], [510, 1162]], true, 0.25, 4);
add(`<path d="${pathOf(MERE, true)}" fill="${SEA}" fill-opacity="0.75" stroke="${INK}" stroke-width="1.8"/>`);
for (let i = 0; i < 4; i++) add(`<path d="M${535 + i * 30},${1135 + (i % 2) * 24} h20" stroke="${INK2}" stroke-width="0.9" opacity="0.6"/>`);
add(`<path d="M342,1800 L342,2185" stroke="${INK2}" stroke-width="2.4" stroke-dasharray="14 5" opacity="0.8"/>`);   // the drowned canal

// the land's marks
const HEIGHTS_C = [600, 520];
for (let i = 0; i < 24; i++) { const a = (i / 24) * Math.PI * 2, rad = rr(78, 92); const x = HEIGHTS_C[0] + Math.cos(a) * rad * 1.25, y = HEIGHTS_C[1] + Math.sin(a) * rad * 0.8; if (Math.sin(a) > 0.55 && Math.abs(Math.cos(a)) < 0.3) continue; add(peak(x, y + 10, rr(26, 40), rr(14, 20))); }   // the crater's rim, open to the south (the Pilgrims' Stair)
range([[240, 390], [310, 350], [380, 345], [430, 368]], 9, 44, 21); range([[770, 368], [830, 345], [900, 350], [960, 400]], 9, 44, 21);   // the Pale Heights (the name between them)
range([[230, 470], [300, 440]], 5, 32, 17); range([[900, 450], [970, 480]], 5, 32, 17);
range([[200, 770], [270, 742], [340, 752], [430, 770]], 12, 30, 16, true);                    // the Cinder Reach: black hills
range([[220, 1010], [300, 1036], [410, 1046]], 9, 24, 14, true);
add(peak(236, 800, 60, 32, true)); add(`<path d="M224,742 q12,-13 24,0" fill="none" stroke="${INK}" stroke-width="1.4"/>`);   // Kell's dead volcano, and its smoke
for (let i = 0; i < 3; i++) add(`<path d="M${239 + i * 4},${732 - i * 6} q${8 + i * 3},-10 0,-${18 + i * 6} q-${8 + i * 3},-10 0,-${18 + i * 4}" fill="none" stroke="${INK2}" stroke-width="1" opacity="${0.5 - i * 0.12}"/>`);
range([[205, 1525], [280, 1512], [360, 1518], [440, 1534]], 11, 22, 13);                      // the Vale's north range (the Scrag Warren)
range([[930, 820], [985, 800], [1015, 840]], 5, 24, 13);                                      // the Highmarch fells
range([[930, 1790], [960, 1720], [990, 1650]], 5, 22, 12);
scatter([[640, 1380], [800, 1340], [960, 1420], [990, 1600], [930, 1780], [760, 1830], [640, 1760], [600, 1560]], 250, 17, (x, y) => tree(x, y, rr(7, 10)));   // the Tithewood
scatter([[440, 1650], [560, 1650], [580, 1770], [470, 1810], [420, 1730]], 26, 18, (x, y) => tree(x, y, rr(6, 8)));                      // the Vale's woods
scatter([[200, 470], [330, 470], [380, 580], [240, 620]], 26, 17, (x, y) => pine(x, y, rr(8, 11)));                                      // pines under the Heights
scatter([[830, 470], [960, 480], [990, 610], [850, 620]], 24, 17, (x, y) => pine(x, y, rr(8, 11)));
scatter([[190, 1880], [360, 1860], [560, 1930], [560, 2120], [400, 2180], [230, 2130]], 64, 16, (x, y) => reeds(x, y, rr(5, 7)));      // the Greywater Fens
scatter([[460, 1340], [600, 1300], [610, 1470], [500, 1500]], 12, 34, (x, y) => hill(x, y, rr(10, 14)));                                 // the downs
scatter([[220, 1150], [440, 1150], [450, 1310], [250, 1330]], 12, 34, (x, y) => hill(x, y, rr(10, 14)));
scatter([[700, 980], [900, 950], [950, 1100], [760, 1130]], 12, 34, (x, y) => hill(x, y, rr(10, 14)));

// ── the imperial roads, ruled straight from Solmere, with their dead beacon-towers ──────────────────────────────────
const SOL = [600, 1150];
const PLACES = {
  thornwick: [330, 1720], greyholt: [470, 1655], saltmere: [262, 2062], reedholm: [470, 2082], ashgate: [360, 905], kells: [240, 838],
  frosthold: [420, 440], glass: [790, 440], throne: [600, 522], tollhaven: [1020, 960], highmarch: [820, 835], brine: [722, 1012],
  gullwick: [998, 1180], rookstead: [800, 1600], hollin: [690, 1450],
};
const ROADS = [[SOL, PLACES.greyholt, PLACES.thornwick], [SOL, PLACES.ashgate], [SOL, PLACES.brine, PLACES.highmarch, PLACES.tollhaven], [SOL, PLACES.rookstead], [SOL, [600, 770]], [PLACES.ashgate, PLACES.kells], [PLACES.tollhaven, PLACES.gullwick], [PLACES.greyholt, PLACES.ashgate]];
for (const r of ROADS) {
  add(`<path d="${pathOf(r, false)}" fill="none" stroke="${RED}" stroke-width="2" stroke-dasharray="9 6" opacity="0.8"/>`);
  for (let i = 0; i < r.length - 1; i++) {                      // a beacon-tower each long stretch
    const a = r[i], b = r[i + 1], n = Math.floor(Math.hypot(b[0] - a[0], b[1] - a[1]) / 150);
    for (let k = 1; k <= n; k++) { const t = k / (n + 1), x = a[0] + (b[0] - a[0]) * t, y = a[1] + (b[1] - a[1]) * t; add(`<path d="M${f1(x - 3)},${f1(y + 4)} l1,-11 h4 l1,11 z" fill="${INK}" opacity="0.75"/>`); }
  }
}
add(`<path d="M600,770 l-14,-16 l22,-14 l-20,-16 l18,-16 l-12,-14 l8,-12" fill="none" stroke="${RED}" stroke-width="1.8" stroke-dasharray="5 4"/>`);   // the Pilgrims' Stair

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
// the Mere Tower: older than the empire, standing up out of the lake east of the city
add(`<path d="M661,1140 v-17 l3,-3 l2,2 l3,-4 l2,3 l3,-2 l2,3 v18 z" fill="#1e1610" stroke="${INK}" stroke-width="1.2"/><path d="M656,1141 q15,-4 30,0" fill="none" stroke="${INK}" stroke-width="1"/>`);
// the crater and the Throne in it
add(`<ellipse cx="${HEIGHTS_C[0]}" cy="${HEIGHTS_C[1]}" rx="52" ry="30" fill="${PAPER}" stroke="${INK}" stroke-width="1.8"/>`);
for (let i = 0; i < 9; i++) add(`<path d="M${f1(HEIGHTS_C[0] - 44 + i * 11)},${f1(HEIGHTS_C[1] - 16 + Math.abs(i - 4) * 2.5)} l4,9" stroke="${INK}" stroke-width="0.9"/>`);
add(`<path d="M${HEIGHTS_C[0] - 10},${HEIGHTS_C[1] + 8} v-12 l4,-6 l3,4 l3,-8 l3,8 l3,-4 l4,6 v12 z" fill="#1e1610"/>`);
for (const k of ['thornwick', 'ashgate', 'tollhaven', 'rookstead', 'frosthold']) add(hub(...PLACES[k]));
for (const k of ['greyholt', 'saltmere', 'reedholm', 'kells', 'highmarch', 'brine', 'gullwick', 'hollin']) add(town(...PLACES[k]));
const SITES = [[400, 1550, 'site'], [470, 1772, 'ruin'], [300, 1962, 'ruin'], [430, 1930, 'site'], [530, 2030, 'site'], [420, 818, 'site'], [482, 952, 'ruin'], [282, 990, 'site'],
  [790, 440, 'ruin'], [752, 618, 'site'], [1108, 902, 'site'], [960, 1062, 'ruin'], [1040, 760, 'site'], [722, 1562, 'ruin'], [860, 1722, 'site'], [700, 1772, 'ruin']];
for (const [x, y, k] of SITES) add(k === 'ruin' ? ruin(x, y) : site(x, y));
add(`<path d="${pathOf(ragged([[690, 610], [730, 626], [770, 606], [815, 628]], false, 0.6, 3), false)}" fill="none" stroke="${INK}" stroke-width="2.6"/>`);   // the Soulcracks

// ── the old province lines, faint and dotted (the Guild's guess at where one ends) ────────────────────────────────
const BORDERS = [[[160, 660], [350, 690], [480, 720], [600, 770], [720, 720], [860, 690], [1040, 680]],   // the Heights' foot
  [[480, 720], [520, 860], [500, 1000], [440, 1120], [300, 1250], [160, 1300]],                              // the Reach
  [[720, 720], [680, 880], [700, 1060], [780, 1250], [1030, 1300]],                                          // the Tidemark
  [[160, 1420], [330, 1440], [500, 1420], [580, 1520], [620, 1720], [640, 1960]],                            // Emberfall
  [[580, 1520], [640, 1330], [780, 1260], [1030, 1300]]];                                                    // the Tithewood
for (const bd of BORDERS) add(`<path d="${pathOf(ragged(bd, false, 0.25, 3), false)}" fill="none" stroke="${INK}" stroke-width="1.6" stroke-dasharray="1 7" stroke-linecap="round" opacity="0.55" clip-path="url(#land)"/>`);

// ── lettering ────────────────────────────────────────────────────────────────────────────────────────────────────────
const halo = `paint-order="stroke" stroke="${PAPER}" stroke-width="5" stroke-linejoin="round"`;
const label = (x, y, txt, size, o = {}) => add(`<text x="${x}" y="${y}" font-family="${o.sc ? 'Fell SC' : o.it ? 'Fell It' : 'Fell'}" font-size="${size}" fill="${o.fill || INK}" text-anchor="${o.anchor || 'middle'}" letter-spacing="${o.ls || 0}" ${o.halo === false ? '' : halo}${o.rot ? ` transform="rotate(${o.rot} ${x} ${y})"` : ''}${o.op ? ` opacity="${o.op}"` : ''}>${txt}</text>`);
// the regions: spaced capitals, and the band under each in red, in whoever's hand added it later
const REG = [[310, 1598, ['EMBERFALL'], '1 – 15'], [330, 636, ['THE CINDER', 'REACH'], '15 – 30'], [870, 726, ['THE TIDEMARK'], '30 – 45'], [800, 1902, ['THE TITHEWOOD'], '45 – 60'], [600, 300, ['THE PALE HEIGHTS'], '60 – 75']];
for (const [x, y, lines, lv] of REG) { lines.forEach((l, i) => label(x, y + i * 34, l, 32, { sc: true, ls: 5 })); label(x, y + (lines.length - 1) * 34 + 28, `levels ${lv}`, 20, { it: true, fill: RED }); }
label(520, 1840, 'the Hollow Vale', 19, { it: true }); label(470, 2160, 'the Greywater Fens', 19, { it: true });
label(600, 1250, 'SOLMERE', 32, { sc: true, ls: 8 }); label(600, 1276, 'the dead capital · the Bowl', 17, { it: true }); label(600, 1296, 'the Great Beacon', 17, { it: true });
label(600, 480, 'the Ember Throne', 16, { it: true });
label(600, 1088, 'the Mere', 15, { it: true }); label(684, 1124, 'the Mere Tower', 15, { it: true, anchor: 'start' });
const T = [['thornwick', 'Thornwick', 0, 28], ['greyholt', 'Greyholt', 44, 6], ['saltmere', 'Saltmere', 0, 26], ['reedholm', 'Reedholm', 0, 26], ['ashgate', 'Ashgate', 0, 28], ['kells', 'Kell’s Rest', 0, 26],
  ['frosthold', 'Frosthold', 0, 28], ['glass', 'the Glass Keep', 0, -14], ['tollhaven', 'Tollhaven', -12, 30], ['highmarch', 'Highmarch', 0, -16], ['brine', 'Brine Cross', 0, 26], ['gullwick', 'Gullwick', -48, 6],
  ['rookstead', 'Rookstead', 0, 28], ['hollin', 'Hollin Ford', 0, -14]];
for (const [k, n, dx, dy] of T) { const [x, y] = PLACES[k]; label(x + dx, y + dy, n, ['thornwick', 'ashgate', 'tollhaven', 'rookstead', 'frosthold'].includes(k) ? 21 : 17); }
const S = [[400, 1574, 'the Scrag Warren'], [470, 1796, 'the Old Barrows'], [268, 1986, 'the Drowned Abbey'], [440, 1954, 'the Sickpools'], [530, 2054, 'the Toadking'], [420, 842, 'the Cinderworks'], [482, 976, 'the Forgehall'], [282, 1014, 'the Slag Tunnels'],
  [752, 652, 'the Soulcracks'], [1105, 862, 'the Gull Isles'], [960, 1086, 'the Drowned Mole'], [1040, 784, 'the Lamp Fort'], [722, 1586, 'the Tally-House'], [860, 1746, 'the Root Granary'], [700, 1796, 'the First Barn?']];
for (const [x, y, n] of S) label(x, y, n, 14, { it: true });
label(70, 1300, 'THE GREY SEA', 28, { sc: true, ls: 12, rot: -90, halo: false, op: 0.75 });
label(1135, 1450, 'THE NARROW SEA', 28, { sc: true, ls: 12, rot: 90, halo: false, op: 0.75 });
label(800, 2215, 'THE SALT DEEPS', 26, { sc: true, ls: 12, halo: false, op: 0.75 });
label(600, 118, 'the White Waste', 22, { it: true, halo: false, op: 0.7 });
label(990, 196, 'Here the map', 18, { it: true, halo: false, op: 0.55 }); label(990, 216, 'is not finished.', 18, { it: true, halo: false, op: 0.55 });
label(912, 1470, 'the Long Water', 14, { it: true, rot: 52 });
label(578, 930, 'the Sol', 14, { it: true, rot: -88 });
label(486, 1012, 'the Ashwater', 14, { it: true, rot: 60 });
label(618, 700, 'the Pilgrims’ Stair', 14, { it: true, anchor: 'start' });
label(356, 2010, 'the drowned canal', 13, { it: true, anchor: 'start', rot: -90 });
label(700, 1990, 'the Bight of Sol', 14, { it: true, halo: false, op: 0.7 });
add(`<g transform="translate(-1745,640)"><path d="M1835,1060 q14,-26 28,0 q14,26 28,0 q14,-26 28,0" fill="none" stroke="${INK}" stroke-width="3" stroke-linecap="round"/><path d="M1828,1062 q-12,-16 -2,-24 q10,-4 12,8" fill="${PAPER}" stroke="${INK}" stroke-width="2"/><circle cx="1830" cy="1046" r="1.6" fill="${INK}"/></g>`);   // a sea-serpent, because there always is one

// ── the cartouche, the rose, the key, the scale and the border ─────────────────────────────────────────────────────
add(`<g transform="translate(280,2300)"><rect x="-200" y="-56" width="400" height="104" fill="${PAPER}" stroke="${INK}" stroke-width="2"/><rect x="-192" y="-48" width="384" height="88" fill="none" stroke="${INK}" stroke-width="1"/></g>`);
label(280, 2280, 'The Old Provinces', 32, { sc: true, ls: 3, halo: false });
label(280, 2306, 'of Solmere', 22, { it: true, halo: false });
label(280, 2330, 'as the Lantern Guild knows them, in the 301st year of the Dim', 13, { it: true, halo: false });
const rose = [1050, 2270];
add(`<g transform="translate(${rose[0]},${rose[1]}) scale(0.8)"><circle r="62" fill="none" stroke="${INK}" stroke-width="1.4"/><circle r="56" fill="none" stroke="${INK}" stroke-width="0.8"/>`
  + [0, 90, 180, 270].map((a) => `<path d="M0,0 L-11,-11 L0,-70 L11,-11 Z" fill="${PAPER}" stroke="${INK}" stroke-width="1.4" transform="rotate(${a})"/><path d="M0,0 L0,-70 L11,-11 Z" fill="${INK}" transform="rotate(${a})"/>`).join('')
  + [45, 135, 225, 315].map((a) => `<path d="M0,0 L-7,-7 L0,-44 L7,-7 Z" fill="${PAPER}" stroke="${INK}" stroke-width="1.1" transform="rotate(${a})"/>`).join('') + `<circle r="5" fill="${RED}"/></g>`);
label(rose[0], rose[1] - 64, 'N', 22, { sc: true, halo: false });
add(`<g transform="translate(660,2316)">` + [0, 1, 2, 3].map((i) => `<rect x="${i * 40}" y="0" width="40" height="7" fill="${i % 2 ? PAPER : INK}" stroke="${INK}" stroke-width="1.2"/>`).join('') + `</g>`);
label(740, 2308, 'leagues', 14, { it: true, halo: false }); label(660, 2342, '0', 12, { halo: false }); label(740, 2342, '50', 12, { halo: false }); label(820, 2342, '100', 12, { halo: false });
add(`<g transform="translate(80,96)">`
  + `<g>${hub(0, 0)}</g><g transform="translate(0,26)">${town(0, 0)}</g><g transform="translate(0,52)">${site(0, 0)}</g><g transform="translate(0,76)">${ruin(0, 0)}</g>`
  + `<path d="M-12,100 h24" stroke="${RED}" stroke-width="2" stroke-dasharray="9 6"/><path d="M-3,128 l1,-11 h4 l1,11 z" fill="${INK}"/></g>`);
for (const [i, t] of ['a region’s town', 'a town or waystation', 'a dungeon or site', 'a ruin', 'an imperial road', 'a dead beacon-tower'].entries()) label(100, 101 + i * 25 + (i > 3 ? 2 : 0), t, 14, { it: true, anchor: 'start', halo: false });
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
