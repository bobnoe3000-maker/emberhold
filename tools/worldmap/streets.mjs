// streets.mjs — the region towns' street plans (docs/town-streets-proposal.md; the owner, 2026-10-10: "Town square works
// well for the menu, but outside of this there could be a few side streets and in the bigger towns, a grid with houses
// and shops. The city with the dock"). Top-down surveyor's plans, north up, one scale for every town (S px a tile), in the
// world's own tiles (x east, y south): the square, its five services and the well stand in Thornwick's tiles in every
// town (src/sim/outdoor.js buildTown), drawn gold and dashed as the part that doesn't change. The camera looks from the
// south-east, so the half of its frame in front of the square (hatched) keeps to low buildings. Deterministic (seeded);
// a proposal sketch, not a bake.
//   node tools/worldmap/streets.mjs [outDir]   → docs/img/towns/streets-<town>.jpg, one a town
import { writeFileSync, mkdirSync, unlinkSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';


// a smoothed line (Chaikin), for a creek or a drift's edge
function chaikin(a, n = 2, closed = false) {
  let p = a;
  for (let k = 0; k < n; k++) { const q = closed ? [] : [p[0]]; for (let i = 0; i < (closed ? p.length : p.length - 1); i++) { const [x0, y0] = p[i], [x1, y1] = p[(i + 1) % p.length]; q.push([x0 * 0.75 + x1 * 0.25, y0 * 0.75 + y1 * 0.25], [x0 * 0.25 + x1 * 0.75, y0 * 0.25 + y1 * 0.75]); } if (!closed) q.push(p[p.length - 1]); p = q; }
  return p;
}
// a building's name inside it (art critic pass 12: "Deepdelver's Rest" ran out of its walls): one line if it fits, else
// two, else smaller, down to 9 px
function fitName(cx, cy, w, h, name) {
  const width = (s, sz) => s.length * sz * 0.47, words = String(name).split(' ');
  let lines = [String(name)];
  if (width(name, 11) > w && words.length > 1) { let best = null; for (let i = 1; i < words.length; i++) { const a = words.slice(0, i).join(' '), b = words.slice(i).join(' '), m = Math.max(width(a, 11), width(b, 11)); if (!best || m < best[0]) best = [m, a, b]; } lines = [best[1], best[2]]; }
  let size = 11; while (size > 9 && (Math.max(...lines.map((l) => width(l, size))) > w || lines.length * size * 1.1 > h)) size -= 0.5;
  const y0 = cy - ((lines.length - 1) * size * 1.1) / 2;
  return `<text text-anchor="middle" font-family="Fell" font-size="${size}" fill="${INK}">${lines.map((l, k) => `<tspan x="${f1(cx)}" y="${f1(y0 + k * size * 1.1)}" dy="0.35em">${esc(l)}</tspan>`).join('')}</text>`;
}

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const { ENV_FOOT } = await import(pathToFileURL(join(ROOT, 'src', 'sim', 'envfoot.js')).href);
const OUT = resolve(process.argv[2] && !process.argv[2].startsWith('--') ? process.argv[2] : join(ROOT, 'docs', 'img', 'towns'));
const W = 1200, S = 4.4, MARGIN = 40;
const PAPER = '#e9dfc6', INK = '#3b2f24', DIM = '#6e5e4a', GOLD = '#b8862e', SVC = '#d9ae4e';

let seed = 0x57ee75;
const rand = () => { seed = (seed + 0x6d2b79f5) >>> 0; let t = seed; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
const f1 = (v) => (+v).toFixed(1);
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/'/g, '&#39;');

// ── the square every town keeps (src/sim/outdoor.js buildTown: Thornwick's tiles) ─────────────────────────────────────
const TOWN_SQUARE = {
  plaza: [60, 62, 24, 22], forecourt: [36, 40, 8, 7], well: [66, 71], mouth: [76, 76], hub: [58, 58, 32],
  // the services' real footprints: where buildTown puts them, and their baked sizes (src/sim/envfoot.js)
  services: [['temple', 34, 24], ['tavern', 29, 48], ['shop', 50, 41], ['smith', 51, 67], ['inn', 73, 55]].map(([k, x, y]) => { const f = ENV_FOOT[`vale_${k}_1`]; return [k, x + f[0], y + f[1], x + f[2], y + f[3]]; }),
};

// ── the square every waystation keeps (outdoor.js buildWaystation: Saltmere's tiles): a small tavern, the shop, the inn
// and the shrine round the cistern, no forge (GDD §10 v1.44; the owner: "there should at least be a shop, and small
// tavern at these way stations… a reason to be there")
const WAY = {
  plaza: [60, 62, 24, 22], forecourt: [40, 40, 10, 8], well: [66, 71], mouth: [76, 76], hub: [58, 58, 32],
  services: [['temple', 28, 24, 'fens_temple_1'], ['tavern', 29, 48, 'fens_stilttavern_1'], ['inn', 49, 29, 'fens_stiltinn_1'], ['shop', 62, 49, 'fens_shop_1']].map(([k, x, y, id]) => { const f = ENV_FOOT[id]; return [k, x + f[0], y + f[1], x + f[2], y + f[3]]; }),
};

// ── a plan: a builder the town specs draw into, then one SVG ──────────────────────────────────────────────────────────
function plan(spec) {
  const [ex0, ey0, ex1, ey1] = spec.extent, PW = (ex1 - ex0) * S, PH = (ey1 - ey0) * S;
  const ox = (W - PW) / 2, oy = 150;
  const X = (x) => ox + (x - ex0) * S, Y = (y) => oy + (y - ey0) * S;
  const pts = (a) => a.map(([x, y]) => f1(X(x)) + ',' + f1(Y(y))).join(' ');
  const L = { ground: [], water: [], streets: [], streetTop: [], low: [], walls: [], blds: [], trees: [], marks: [], text: [] };
  const key = [];
  const t = {
    // ground washes
    rect: (x0, y0, x1, y1, fill, layer = 'ground', o = '') => L[layer].push(`<rect x="${f1(X(x0))}" y="${f1(Y(y0))}" width="${f1((x1 - x0) * S)}" height="${f1((y1 - y0) * S)}" fill="${fill}" ${o}/>`),
    poly: (a, fill, layer = 'ground', o = '') => L[layer].push(`<polygon points="${pts(a)}" fill="${fill}" ${o}/>`),
    ellipse: (x, y, rx, ry, fill, layer = 'ground', o = '') => L[layer].push(`<ellipse cx="${f1(X(x))}" cy="${f1(Y(y))}" rx="${f1(rx * S)}" ry="${f1(ry * S)}" fill="${fill}" ${o}/>`),
    blob: (x, y, r, fill, layer = 'ground', rough = 0.35, n = 13) => t.poly(Array.from({ length: n }, (_, i) => { const a = i / n * 6.2832, k = 1 + (rand() - 0.5) * rough; return [x + Math.cos(a) * r * k, y + Math.sin(a) * r * k]; }), fill, layer),
    drift: (x, y, r, fill, layer = 'ground') => t.poly(chaikin(Array.from({ length: 11 }, (_, i) => { const a = i / 11 * 6.2832, k = 1 + (rand() - 0.5) * 0.45; return [x + Math.cos(a) * r * k, y + Math.sin(a) * r * k * 0.8]; }), 3, true), fill, layer),
    line: (a, w, stroke, layer = 'ground', o = '') => L[layer].push(`<polyline points="${pts(a)}" fill="none" stroke="${stroke}" stroke-width="${f1(w * S)}" stroke-linecap="round" stroke-linejoin="round" ${o}/>`),
    // a street: an inked edge, its surface, and its name along its longest run
    street: (a, w, name, surf = '#d8c9a8', o = {}) => {
      L.streets.push(`<polyline points="${pts(a)}" fill="none" stroke="${INK}" stroke-width="${f1(w * S + 2.4)}" stroke-linecap="${o.cap || 'butt'}" stroke-linejoin="round" opacity="0.85"/>`);
      L.streetTop.push(`<polyline points="${pts(a)}" fill="none" stroke="${surf}" stroke-width="${f1(w * S)}" stroke-linecap="${o.cap || 'butt'}" stroke-linejoin="round"${o.dash ? ` stroke-dasharray="${o.dash}"` : ''}/>`);
      if (o.steps) for (let i = 0; i + 1 < a.length; i++) { const [x0, y0] = a[i], [x1, y1] = a[i + 1], n = Math.floor(Math.hypot(x1 - x0, y1 - y0) / 2.2), nx = -(y1 - y0), ny = x1 - x0, k = Math.hypot(nx, ny) || 1;
        for (let j = 1; j < n; j++) { const u = j / n, cx = x0 + (x1 - x0) * u, cy = y0 + (y1 - y0) * u, h = w / 2; L.streetTop.push(`<line x1="${f1(X(cx + nx / k * h))}" y1="${f1(Y(cy + ny / k * h))}" x2="${f1(X(cx - nx / k * h))}" y2="${f1(Y(cy - ny / k * h))}" stroke="${INK}" stroke-width="0.7" opacity="0.5"/>`); } }
      if (name) {
        let best = 0, bi = 0; for (let i = 0; i + 1 < a.length; i++) { const d = Math.hypot(a[i + 1][0] - a[i][0], a[i + 1][1] - a[i][1]); if (d > best) { best = d; bi = i; } }
        const [x0, y0] = a[bi], [x1, y1] = a[bi + 1]; let ang = Math.atan2(y1 - y0, x1 - x0) * 180 / Math.PI; if (ang > 90) ang -= 180; if (ang < -90) ang += 180;
        const u = o.at ?? 0.5, cx = X(x0 + (x1 - x0) * u), cy = Y(y0 + (y1 - y0) * u);
        L.text.push(`<text x="${f1(cx)}" y="${f1(cy)}" transform="rotate(${f1(ang)} ${f1(cx)} ${f1(cy)})" dy="0.34em" text-anchor="middle" font-family="Fell It" font-size="${o.size || Math.max(10.5, Math.min(14, w * S * 0.62))}" fill="${o.ink || INK}" stroke="${surf}" stroke-width="3" paint-order="stroke">${esc(name)}</text>`);
      }
    },
    // buildings: kind sets the fill; a numbered one goes in the key under the plan
    bld: (x0, y0, x1, y1, kind, o = {}) => {
      const K = spec.palette[kind] || spec.palette.house, op = kind === 'shell' ? ` fill="none" stroke-dasharray="3 2"` : ` fill="${K}"`;
      L.blds.push(`<rect x="${f1(X(x0))}" y="${f1(Y(y0))}" width="${f1((x1 - x0) * S)}" height="${f1((y1 - y0) * S)}"${op} stroke="${INK}" stroke-width="${kind === 'svc' ? 1.6 : 1}"/>`);
      if (kind === 'shell') for (let i = 0; i < 4; i++) L.blds.push(`<circle cx="${f1(X(x0 + rand() * (x1 - x0)))}" cy="${f1(Y(y0 + rand() * (y1 - y0)))}" r="1.4" fill="${DIM}"/>`);
      if (o.ridge !== false && kind !== 'shell' && kind !== 'stall' && x1 - x0 > 3 && y1 - y0 > 3) { const v = (y1 - y0) > (x1 - x0); L.blds.push(`<line x1="${f1(X(v ? (x0 + x1) / 2 : x0 + 0.8))}" y1="${f1(Y(v ? y0 + 0.8 : (y0 + y1) / 2))}" x2="${f1(X(v ? (x0 + x1) / 2 : x1 - 0.8))}" y2="${f1(Y(v ? y1 - 0.8 : (y0 + y1) / 2))}" stroke="${INK}" stroke-width="0.6" opacity="0.45"/>`); }
      if (o.n) { key.push({ n: o.n, name: o.name, note: o.note, kind }); const cx = X((x0 + x1) / 2), cy = Y((y0 + y1) / 2);
        L.marks.push(`<circle cx="${f1(cx)}" cy="${f1(cy)}" r="8.5" fill="${kind === 'land' ? '#5a3a6a' : '#7a2e1e'}" stroke="${PAPER}" stroke-width="1.2"/><text x="${f1(cx)}" y="${f1(cy)}" dy="0.36em" text-anchor="middle" font-family="Fell" font-size="11.5" fill="#f4ead2">${o.n}</text>`); }
      if (o.label) t.note((x0 + x1) / 2, o.labelY ?? y1 + 3.2, o.label, { size: o.size || 12 });
    },
    // a row of houses along a block: split into frontages with a gap between
    row: (x0, y0, x1, y1, kind = 'house', each = 7) => {
      const vert = (y1 - y0) > (x1 - x0), len = vert ? y1 - y0 : x1 - x0, n = Math.max(1, Math.round(len / each)), step = len / n;
      for (let i = 0; i < n; i++) { const a = i * step + 0.35, b = (i + 1) * step - 0.35; if (rand() < 0.06) continue;
        vert ? t.bld(x0, y0 + a, x1, y0 + b, kind) : t.bld(x0 + a, y0, x0 + b, y1, kind); }
    },
    wall: (a, w, fill) => { L.walls.push(`<polyline points="${pts(a)}" fill="none" stroke="${INK}" stroke-width="${f1(w * S + 2.2)}" stroke-linejoin="miter" stroke-linecap="square"/><polyline points="${pts(a)}" fill="none" stroke="${fill}" stroke-width="${f1(w * S)}" stroke-linejoin="miter" stroke-linecap="square"/>`); },
    tower: (x, y, r, fill, round = true) => L.walls.push(round ? `<circle cx="${f1(X(x))}" cy="${f1(Y(y))}" r="${f1(r * S)}" fill="${fill}" stroke="${INK}" stroke-width="1.6"/>` : `<rect x="${f1(X(x - r))}" y="${f1(Y(y - r))}" width="${f1(2 * r * S)}" height="${f1(2 * r * S)}" fill="${fill}" stroke="${INK}" stroke-width="1.6"/>`),
    tree: (x, y, r, c) => L.trees.push(`<circle cx="${f1(X(x))}" cy="${f1(Y(y))}" r="${f1(r * S)}" fill="${c}" stroke="${INK}" stroke-width="0.7" opacity="0.92"/>`),
    stone: (x, y, r, c) => L.trees.push(`<ellipse cx="${f1(X(x))}" cy="${f1(Y(y))}" rx="${f1(r * S)}" ry="${f1(r * S * 0.8)}" fill="${c}" stroke="${INK}" stroke-width="1"/>`),
    rock: (x, y, r, c) => t.poly(Array.from({ length: 7 }, (_, i) => { const a = i / 7 * 6.2832, k = 0.7 + rand() * 0.5; return [x + Math.cos(a) * r * k, y + Math.sin(a) * r * k]; }), c, 'trees', `stroke="${INK}" stroke-width="0.9"`),
    dots: (x0, y0, x1, y1, n, c, r = 0.5, layer = 'ground') => { for (let i = 0; i < n; i++) L[layer].push(`<circle cx="${f1(X(x0 + rand() * (x1 - x0)))}" cy="${f1(Y(y0 + rand() * (y1 - y0)))}" r="${f1(r * S)}" fill="${c}"/>`); },
    note: (x, y, s, o = {}) => L.text.push(`<text x="${f1(X(x))}" y="${f1(Y(y))}" text-anchor="${o.anchor || 'middle'}" font-family="${o.font || 'Fell It'}" font-size="${o.size || 13}" fill="${o.ink || INK}" stroke="${o.halo || PAPER}" stroke-width="${o.halo === 'none' ? 0 : 3}" paint-order="stroke"${o.rot ? ` transform="rotate(${o.rot} ${f1(X(x))} ${f1(Y(y))})"` : ''}>${esc(s)}</text>`),
    boat: (x, y, len, ang, c = '#7a5a3e') => { const a = ang * Math.PI / 180, dx = Math.cos(a) * len / 2, dy = Math.sin(a) * len / 2, nx = -Math.sin(a) * len * 0.18, ny = Math.cos(a) * len * 0.18;
      t.poly([[x - dx, y - dy], [x - dx * 0.4 + nx, y - dy * 0.4 + ny], [x + dx * 0.7 + nx * 0.6, y + dy * 0.7 + ny * 0.6], [x + dx, y + dy], [x + dx * 0.7 - nx * 0.6, y + dy * 0.7 - ny * 0.6], [x - dx * 0.4 - nx, y - dy * 0.4 - ny]], c, 'trees', `stroke="${INK}" stroke-width="0.8"`); },
  };
  spec.draw(t);
  const SQUARE = spec.square || TOWN_SQUARE;

  // the square: the services, the well, the plaza; the camera's frame at it, its front half hatched (keep it low)
  const [hx, hy, hr] = SQUARE.hub, cid = 'c' + spec.id;
  const square = [];
  square.push(`<defs><clipPath id="${cid}"><circle cx="${f1(X(hx))}" cy="${f1(Y(hy))}" r="${f1(hr * S)}"/></clipPath>
    <pattern id="h${spec.id}" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="7" stroke="${GOLD}" stroke-width="1.4" opacity="0.55"/></pattern></defs>`);
  square.push(`<g clip-path="url(#${cid})"><polygon points="${pts([[hx + hr + 10, hy - hr - 10], [hx + hr + 10, hy + hr + 10], [hx - hr - 10, hy + hr + 10]])}" fill="url(#h${spec.id})"/></g>`);
  const [px, py, prx, pry] = SQUARE.plaza, [fx, fy, frx, fry] = SQUARE.forecourt;
  square.push(`<ellipse cx="${f1(X(px))}" cy="${f1(Y(py))}" rx="${f1(prx * S)}" ry="${f1(pry * S)}" fill="${spec.palette.plaza}" stroke="${INK}" stroke-width="1"/>`);
  square.push(`<ellipse cx="${f1(X(fx))}" cy="${f1(Y(fy))}" rx="${f1(frx * S)}" ry="${f1(fry * S)}" fill="${spec.palette.plaza}"/>`);
  for (const [kind, x0, y0, x1, y1] of SQUARE.services) {
    square.push(`<rect x="${f1(X(x0))}" y="${f1(Y(y0))}" width="${f1((x1 - x0) * S)}" height="${f1((y1 - y0) * S)}" fill="${SVC}" stroke="${INK}" stroke-width="1.6"/>`);
    square.push(fitName(X((x0 + x1) / 2), Y((y0 + y1) / 2), (x1 - x0) * S - 6, (y1 - y0) * S - 4, (spec.svcNames || {})[kind] || kind));
  }
  square.push(`<circle cx="${f1(X(SQUARE.well[0]))}" cy="${f1(Y(SQUARE.well[1]))}" r="${f1(1.8 * S)}" fill="#7d8e96" stroke="${INK}" stroke-width="1.2"/>`);
  square.push(`<circle cx="${f1(X(hx))}" cy="${f1(Y(hy))}" r="${f1(hr * S)}" fill="none" stroke="${GOLD}" stroke-width="2" stroke-dasharray="7 5"/>`);
  if (spec.squareNote !== false) square.push(`<text x="${f1(X(hx - hr * 0.2))}" y="${f1(Y(hy + hr + 4.2))}" text-anchor="middle" font-family="Fell It" font-size="12.5" fill="${GOLD}" stroke="${PAPER}" stroke-width="3" paint-order="stroke">the square, as it is (the menus)</text>`);

  // the sheet: title, the plan, a compass and the camera, the scale, the key
  const keyRows = Math.ceil(key.length / 2), notes = spec.notes || [];
  const H = oy + PH + 70 + keyRows * 24 + notes.length * 22 + 50;
  const svg = [];
  svg.push(`<rect width="${W}" height="${H}" fill="#d9ccb0"/><rect x="14" y="14" width="${W - 28}" height="${H - 28}" fill="${PAPER}" stroke="${INK}" stroke-width="1.4"/>`);
  svg.push(`<text x="${MARGIN}" y="62" font-family="Fell SC" font-size="36" fill="${INK}" letter-spacing="3">${esc(spec.name)}</text>`);
  svg.push(`<text x="${MARGIN}" y="90" font-family="Fell It" font-size="17" fill="${DIM}">${esc(spec.sub)}</text>`);
  svg.push(`<text x="${W - MARGIN}" y="62" text-anchor="end" font-family="Fell It" font-size="16" fill="${DIM}">${esc(spec.size)}</text>`);
  svg.push(`<text x="${MARGIN}" y="118" font-family="Fell It" font-size="15" fill="${INK}">${esc(spec.lede)}</text>`);
  svg.push(`<g>${[...L.ground, ...L.water, ...L.low, ...L.streets, ...L.streetTop].join('')}</g>`);
  svg.push(square.join(''));
  svg.push(`<g>${[...L.walls, ...L.blds, ...L.trees, ...L.marks, ...L.text].join('')}</g>`);
  // compass (north up) and the camera's side
  const cx = W - 74, cy = oy + 52;
  svg.push(`<g font-family="Fell" fill="${INK}"><circle cx="${cx}" cy="${cy}" r="30" fill="${PAPER}" stroke="${INK}" stroke-width="1"/><polygon points="${cx},${cy - 26} ${cx + 6},${cy} ${cx},${cy + 4} ${cx - 6},${cy}" fill="${INK}"/><text x="${cx}" y="${cy - 34}" text-anchor="middle" font-size="14">N</text>
    <line x1="${cx + 40}" y1="${cy + 60}" x2="${cx + 16}" y2="${cy + 36}" stroke="${GOLD}" stroke-width="2.4" marker-end="url(#arr)"/><text x="${cx + 4}" y="${cy + 84}" text-anchor="middle" font-family="Fell It" font-size="12" fill="${GOLD}">the camera</text></g>`);
  svg.push(`<defs><marker id="arr" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="${GOLD}"/></marker></defs>`);
  // the scale: 20 tiles
  const sy = oy + PH + 30, sx = MARGIN;
  svg.push(`<g font-family="Fell It" font-size="12" fill="${INK}"><rect x="${sx}" y="${sy}" width="${f1(10 * S)}" height="5" fill="${INK}"/><rect x="${f1(sx + 10 * S)}" y="${sy}" width="${f1(10 * S)}" height="5" fill="${PAPER}" stroke="${INK}"/><text x="${sx}" y="${sy + 20}">0</text><text x="${f1(sx + 20 * S)}" y="${sy + 20}" text-anchor="middle">20 tiles</text>
    <text x="${f1(sx + 20 * S + 40)}" y="${sy + 9}">${esc(spec.legend || '')}</text></g>`);
  // legend swatches
  let lx = W - MARGIN; const legend = [...(spec.swatches || [])].reverse();
  for (const [c, s] of legend) { const w = 14 + s.length * 6.4; lx -= w + 14; svg.push(`<rect x="${f1(lx)}" y="${sy - 2}" width="12" height="12" fill="${c}" stroke="${INK}" stroke-width="0.8"/><text x="${f1(lx + 16)}" y="${sy + 9}" font-family="Fell It" font-size="12" fill="${INK}">${esc(s)}</text>`); }
  // the key
  const ky = sy + 50;
  key.sort((a, b) => a.n - b.n).forEach((k, i) => {
    const col = i < keyRows ? 0 : 1, row = col ? i - keyRows : i, kx = MARGIN + col * (W - 2 * MARGIN) / 2, yy = ky + row * 24;
    svg.push(`<circle cx="${kx + 9}" cy="${yy - 4}" r="9" fill="${k.kind === 'land' ? '#5a3a6a' : '#7a2e1e'}"/><text x="${kx + 9}" y="${yy - 4}" dy="0.36em" text-anchor="middle" font-family="Fell" font-size="11.5" fill="#f4ead2">${k.n}</text>`);
    svg.push(`<text x="${kx + 26}" y="${yy}" font-family="Fell" font-size="14.5" fill="${INK}">${esc(k.name)}<tspan font-family="Fell It" fill="${DIM}">${k.note ? ' · ' + esc(k.note) : ''}</tspan></text>`);
  });
  notes.forEach((n, i) => svg.push(`<text x="${MARGIN}" y="${ky + keyRows * 24 + 12 + i * 22}" font-family="Fell It" font-size="14" fill="${DIM}">${esc(n)}</text>`));
  return { svg: svg.join('\n'), H };
}

// ── the towns ─────────────────────────────────────────────────────────────────────────────────────────────────────────
const TOWNS = [];

// ASHGATE, the Cinder Reach (large, slag-brick walls, arid): the miners' grid. The Rows run east-west behind the high
// street, crossed by lanes every ~25 tiles; Assay Row is the market street; the front quarter (south of the high street)
// keeps to one storey: the ore yard, workshops and the old terraces, slag heaps against the south wall.
TOWNS.push({ id: 'ashgate', name: 'Ashgate', sub: 'the Cinder Reach · levels 15–30 · a mining town that pays well and doesn\'t ask', size: 'large · slag-brick walls · 182 × 146 inside', extent: [-10, -32, 236, 176],
  lede: 'A grid of miners\' terraces behind the high street; Assay Row its market; the ore yard and the old rows low in front.',
  svcNames: { tavern: 'Slag & Bellows', temple: 'Last Flame', inn: 'Deepdelver\'s Rest', smith: 'Forge', shop: 'shop' },
  palette: { house: '#a8644a', terrace: '#9a5a42', shop: '#c98a3c', land: '#b07a9a', low: '#b89878', ware: '#8a6a52', plaza: '#cdb595', stall: '#d4a45a' },
  swatches: [['#c9a77a', 'dry earth'], ['#4a4440', 'slag'], ['#a0563a', 'red rock'], ['#6e6660', 'black setts'], ['#9a5a42', 'terraces'], ['#c98a3c', 'shops']],
  legend: 'black setts in town, dirt outside',
  notes: ['The Rows: four streets of two-storey terraces, a door every 7 tiles, every window lit orange. Nothing over two storeys south of Charter Street.',
    'Walking off the square, the camera follows the hero as it does on the approach road, and comes back to the square\'s frame on the way in.'],
  draw(t) {
    t.rect(-10, -32, 236, 176, '#c9a77a');
    for (let i = 0; i < 9; i++) t.blob(rand() * 236 - 10, rand() * 200 - 32, 8 + rand() * 10, '#d6bb8f');        // dust pans
    t.rect(8, 6, 188, 152, '#c4a072');
    // outside: the Cinderworks' chimneys over the north wall, slag heaps, the tailings pond, the ore rails
    t.rect(112, -30, 170, -6, '#5a4c42', 'ground', `stroke="${INK}" stroke-width="1"`); for (const y of [-24, -12]) t.line([[113, y], [169, y]], 0.25, INK, 'ground', 'opacity="0.5"');
    for (const x of [126, 141, 156]) { t.line(chaikin([[x, -18], [x - 5, -25], [x - 2, -32], [x - 9, -40], [x - 7, -46]], 3), 2.2, '#8a827a', 'trees', 'opacity="0.55"'); t.ellipse(x, -18, 2.6, 2.6, '#2c2622', 'trees', `stroke="${INK}" stroke-width="1"`); }
    t.note(141, -2, 'the Cinderworks, over the wall', { size: 12.5 });
    for (const [x, y, r] of [[200, 14, 9], [214, 30, 7], [198, 44, 6], [-2, 120, 7]]) t.blob(x, y, r, '#4a4440');
    t.blob(212, 150, 18, '#a86a3c'); t.blob(212, 150, 12, '#c07a44'); t.note(212, 172, 'the tailings pond', { size: 12 });
    t.line([[188, 92], [236, 92]], 1.2, INK, 'low', 'stroke-dasharray="4 3"');
    t.street([[236, 80], [188, 80]], 7, 'the Solmere road', '#bfa27a');
    // the Knuckle: the red outcrop the back quarter was built round
    t.poly([[10, 60], [20, 56], [24, 66], [22, 84], [26, 96], [14, 100], [9, 88]], '#a0563a', 'low', `stroke="${INK}" stroke-width="1"`); t.note(16, 79, 'the Knuckle', { rot: -80, size: 12 });
    // streets
    const ST = '#6e6660', LN = '#857c74', LOW = '#b39a78';
    t.street([[76, 76], [86, 80], [188, 80]], 7, 'Charter Street (the high street)', ST, { size: 13.5 });
    for (const [y, n] of [[18, 'First Row'], [36, 'Second Row'], [56, 'Third Row']]) t.street([[86, y], [184, y]], 5, n, LN, { at: 0.2 });
    t.street([[96, 10], [96, 80]], 5, 'Shaft Lane', LN); t.street([[122, 10], [122, 80]], 5, 'Bell Lane', LN); t.street([[148, 10], [148, 80]], 6, 'Assay Row', '#9a8668', { size: 13 }); t.street([[176, 10], [176, 80]], 4, 'Wall Lane', LN);
    t.street([[86, 80], [90, 100], [184, 100]], 6, 'Ore Street', LOW);
    t.street([[90, 100], [78, 112], [14, 112]], 5, 'Dust Lane', LOW); t.street([[14, 130], [120, 130]], 4, 'Cinder Lane', LOW);
    t.street([[40, 112], [40, 148]], 4, '', LOW); t.street([[64, 112], [64, 148]], 4, '', LOW); t.street([[90, 112], [90, 148]], 4, '', LOW);
    t.street([[23, 54], [14, 58], [8, 66]], 3, '', LOW);
    // the ore rails: from the pithead at the gate along the ore yard
    t.line([[188, 92], [100, 92], [96, 96]], 1, INK, 'streetTop', 'stroke-dasharray="5 3"');
    // the Rows: terraces both sides of every row, two storeys
    const cols = [[86, 93], [99, 119], [125, 145], [151, 173], [179, 186]];
    for (const [a, b] of cols) for (const [y0, y1] of [[9, 15], [21, 27], [28, 33], [39, 45], [47, 53], [59, 65]]) t.row(a, y0, b, y1, 'terrace', 7);
    for (const [a, b] of cols) t.row(a, 68, b, 76, 'house', 9);
    // Assay Row and Charter Street's shops
    t.bld(151, 59, 172, 76, 'shop', { n: 1, name: 'The Kell Assay\'s town office', note: 'Morrow Vane\'s clerks hire the night shift here (Act III)' });
    t.bld(151, 21, 163, 33, 'land', { n: 2, name: 'The Shift-Office', note: 'the Shift-Bell over it, rung for every shift' });
    t.bld(139, 21, 145, 27, 'shop', { n: 3, name: 'A lampwright\'s', note: 'oil, wick and glass; the Reach\'s Pim' });
    t.bld(139, 39, 145, 45, 'shop', { n: 4, name: 'Second Hands', note: 'Hob\'s pawnshop; he knows which shift is short' });
    t.bld(151, 39, 166, 53, 'shop', { n: 5, name: 'The bathhouse', note: 'the only clean water in Ashgate, by the hour' });
    t.bld(139, 47, 145, 53, 'shop', { n: 6, name: 'A money-changer\'s', note: 'Charter scrip into coin, at a loss' });
    t.bld(100, 68, 111, 76, 'shop', { n: 7, name: 'A cookshop', note: 'pies for the shift, open all night' });
    t.bld(126, 68, 137, 76, 'shop', { n: 8, name: 'The Charter\'s notary', note: 'leases, claims and the moot\'s roll' });
    t.bld(181, 72, 190, 88, 'land', { n: 9, name: 'The pithead wheel', note: 'over the gate: the first thing you see' });
    // the front: one storey. The ore yard, workshops, the old rows; slag heaps against the south wall
    for (const [a, b, n, nm] of [[96, 110, 10, 'A farrier\'s'], [114, 128, 11, 'A cooper\'s'], [132, 148, 0, '']]) t.bld(a, 104, b, 111, n ? 'shop' : 'low', n ? { n, name: nm, note: 'low workshops along Ore Street' } : {});
    t.bld(152, 104, 184, 116, 'ware', { label: 'the ore sheds' });
    for (const [x, y, r] of [[160, 132, 9], [178, 136, 8], [140, 140, 7], [124, 142, 6]]) t.blob(x, y, r, '#4a4440', 'low');
    for (const [a, b] of [[16, 38], [42, 62], [66, 88]]) { t.row(a, 115, b, 120, 'low', 7); t.row(a, 122, b, 127, 'low', 7); t.row(a, 133, b, 138, 'low', 7); t.row(a, 140, b, 146, 'low', 7); }
    t.note(52, 150, 'the Old Rows: the first terraces, one storey', { size: 12 });
    t.row(14, 60, 20, 98, 'house', 9);   // up the Knuckle's shoulder
    t.row(44, 9, 80, 14, 'house', 9); t.row(44, 31, 52, 34, 'house', 8);
    // walls: slag-brick curtain, ten towers, the gate east under the wheel
    const WL = '#2c2622';
    t.wall([[188, 73], [188, 6], [8, 6], [8, 152], [188, 152], [188, 87]], 2.2, WL);
    for (const [x, y] of [[8, 6], [68, 6], [128, 6], [188, 6], [8, 58], [8, 108], [8, 152], [98, 152], [188, 152], [188, 40]]) t.tower(x, y, 3.2, '#3a322c', false);
    t.tower(188, 71, 2.8, WL, false); t.tower(188, 89, 2.8, WL, false);
    t.note(206, 74, 'the gate', { size: 13 });
    for (let i = 0; i < 14; i++) t.rock(-6 + rand() * 12, 20 + rand() * 140, 2 + rand() * 2, '#a0563a');
    for (let i = 0; i < 10; i++) t.rock(196 + rand() * 36, 100 + rand() * 20, 1.6 + rand() * 2, '#a0563a');
  } });

// TOLLHAVEN, the Tidemark (large, stone walls landward, the harbour north-east): the dock city. Quay Street runs from the
// square down to the quay, where the Speaker's counting-house stands at its foot; the merchants' grid fills between; the
// warehouses back on to the quay; three jetties; the moles and the chain close the harbour. In from the west gate,
// Landward Street comes along the square's south side.
TOWNS.push({ id: 'tollhaven', name: 'Tollhaven', sub: 'the Tidemark · levels 30–45 · the League\'s largest port: even the harbour chain takes a toll', size: 'large · stone walls landward, the quay on the sea side', extent: [-14, -36, 226, 178],
  lede: 'The dock city: Quay Street from the square to the quay, the merchants\' grid between, warehouses, three jetties and the chain.',
  svcNames: { tavern: 'The Paid Toll', temple: 'temple', inn: 'inn', smith: 'smith', shop: 'shop' },
  palette: { house: '#b0634a', terrace: '#a45a44', shop: '#c98a3c', land: '#a07aa0', low: '#c2a07e', ware: '#7e5a46', plaza: '#d9c7a6', stall: '#d4a45a' },
  swatches: [['#cfbd9a', 'brick and cobble'], ['#a9a59a', 'quay stone'], ['#e3cf9e', 'sand'], ['#8f9a72', 'salt marsh'], ['#6f8d98', 'the sea'], ['#7e5a46', 'warehouses']],
  legend: 'cobble in town, quay stone along the water',
  notes: ['Every jetty is a walkable deck (like the shipped bridge), boats moored along them. The quay is the town\'s edge on the sea side: no wall.',
    'The fish market and the ropewalk stand low in front of the square; the tall brick and the warehouses stand behind it and along the water.'],
  draw(t) {
    t.rect(-14, -36, 226, 178, '#cfbd9a');
    // the salt marsh along the north shore, the sea and the harbour, the beach south-east
    t.poly([[-14, -36], [170, -36], [170, 6], [-14, 6]], '#8f9a72');
    for (let i = 0; i < 9; i++) { let x = 8 + i * 17 + rand() * 6, y = -36, dx = (rand() - 0.5) * 2; const a = [[x, y]]; while (y < 3) { y += 4 + rand() * 2; dx = dx * 0.6 + (rand() - 0.5) * 3.2; x += dx; a.push([x, y]); } t.line(chaikin(a, 3), 0.45 + rand() * 0.4, '#6f8d98'); }
    t.note(60, -14, 'the salt marsh', { size: 13 });
    t.poly([[164, -36], [226, -36], [226, 178], [150, 178], [140, 160], [164, 140]], '#6f8d98', 'water');
    t.poly([[90, 150], [130, 150], [164, 140], [150, 178], [70, 178]], '#e3cf9e');
    t.poly([[164, 140], [146, 178], [150, 178], [168, 142]], '#bfa77a');
    t.note(118, 168, 'the beach, south to Gullwick', { size: 12.5 }); for (const [x, y, a] of [[104, 160, 20], [116, 164, 30], [130, 158, 15]]) t.boat(x, y, 8, a);
    // the moles and the chain
    const MOLE = '#a9a59a';
    t.street([[164, 10], [186, 8], [204, 38]], 6, '', MOLE); t.street([[164, 136], [190, 124], [204, 84]], 6, '', MOLE);
    t.tower(204, 40, 3.6, '#8c877c'); t.tower(204, 82, 3.6, '#8c877c');
    t.line([[204, 44], [204, 78]], 0.5, INK, 'streetTop', 'stroke-dasharray="2 2"'); t.note(214, 62, 'the chain', { rot: 90, size: 13 });
    // the quay and the jetties
    t.street([[160, 6], [160, 138]], 8, 'the Quay', '#a9a59a', { size: 13.5 });
    for (const [y, x1] of [[30, 192], [56, 196], [104, 192]]) { t.street([[164, y], [x1, y]], 3, '', '#8a6a48'); for (let i = 0; i < 3; i++) t.boat(170 + i * 8, y + (i % 2 ? 4 : -4), 7, 0); }
    t.note(184, 22, 'the jetties', { size: 12.5 });
    // streets
    const ST = '#c4b08c', LN = '#cbb898', LOW = '#d2bf9c';
    t.street([[-14, 88], [8, 88], [40, 88], [54, 82]], 6, 'Landward Street', ST, { at: 0.6 });
    t.street([[76, 76], [90, 80], [156, 80]], 7, 'Quay Street (the high street)', ST, { size: 13.5 });
    for (const [y, n] of [[22, 'Chandlers\' Row'], [42, 'Net Lane'], [60, 'Tallow Street']]) t.street([[86, y], [132, y]], 5, n, LN);
    t.street([[96, 10], [96, 80]], 5, 'Salt Street', LN); t.street([[116, 10], [116, 80]], 5, 'Gull Lane', LN); t.street([[134, 8], [134, 136]], 4, 'Bonded Lane', LN, { at: 0.3 });
    t.street([[90, 80], [90, 98], [156, 98]], 5, 'Rope Street', LOW); t.street([[54, 82], [40, 104], [40, 146]], 4, 'Gullwick Lane', LOW); t.street([[40, 122], [134, 122]], 4, 'Fishwives\' Lane', LOW);
    t.street([[46, 14], [84, 14], [86, 22]], 4, '', LN);
    // the waterfront: warehouses backing on to the quay, the counting-house at Quay Street's foot, the fish market
    t.bld(138, 9, 154, 26, 'ware'); t.bld(138, 30, 154, 58, 'ware', { label: 'the bonded warehouses', labelY: 46 });
    t.bld(138, 62, 155, 76, 'land', { n: 1, name: 'The Speaker\'s counting-house', note: 'the League\'s tolls; seen from the square, down Quay Street' });
    t.bld(138, 84, 155, 95, 'stall', { n: 2, name: 'The fish market', note: 'an open hall on the quay; morning only' });
    t.bld(138, 102, 154, 118, 'ware'); t.bld(138, 124, 154, 136, 'ware');
    t.bld(94, 101, 132, 105, 'low', { n: 3, name: 'The ropewalk', note: 'a shed a hundred and fifty feet long, one storey' });
    // the merchants' grid
    for (const [a, b] of [[86, 93], [99, 113], [119, 131]]) for (const [y0, y1] of [[9, 19], [25, 31], [33, 39], [45, 51], [53, 57], [63, 76]]) t.row(a, y0, b, y1, 'house', 7);
    t.bld(119, 63, 131, 76, 'shop', { n: 4, name: 'A ship-chandler\'s', note: 'rope, pitch, lamps, everything a ship eats' });
    t.bld(99, 63, 113, 76, 'shop', { n: 5, name: 'A sailmaker\'s loft' });
    t.bld(99, 45, 106, 51, 'shop', { n: 6, name: 'The chartmaker\'s', note: 'maps of every coast, most of them true' });
    t.bld(119, 25, 126, 31, 'shop', { n: 7, name: 'A League money-changer' });
    t.bld(86, 45, 93, 51, 'shop', { n: 8, name: 'A pawnbroker', note: 'won\'t take anything wet' });
    t.bld(126, 9, 131, 19, 'shop', { n: 9, name: 'The Customs House', note: 'duty on everything that comes off a jetty' });
    // the back quarter and the west, tall brick; the south-west, low houses toward the beach
    t.row(44, 7, 80, 12, 'house', 8); t.row(12, 30, 20, 80, 'house', 9); t.row(12, 8, 22, 26, 'house', 9);
    for (const [a, b] of [[14, 36], [44, 70], [74, 130]]) { if (a < 70) { t.row(a, 96, b, 101, 'low', 8); t.row(a, 109, b, 116, 'low', 8); } t.row(a, 125, b, 131, 'low', 8); t.row(a, 136, b, 144, 'low', 8); }
    t.row(60, 108, 84, 116, 'low', 8); t.row(94, 84, 132, 94, 'low', 8);
    // walls: grey stone, round towers, landward only; the west gate
    const WL = '#8c877c';
    t.wall([[136, 6], [8, 6], [8, 81]], 2, WL); t.wall([[8, 95], [8, 150], [124, 150]], 2, WL);
    for (const [x, y] of [[8, 6], [70, 6], [136, 6], [8, 46], [8, 120], [8, 150], [66, 150], [124, 150]]) t.tower(x, y, 3.2, WL);
    t.tower(8, 81, 3, WL); t.tower(8, 95, 3, WL); t.note(-12, 98, 'the gate, from Highmarch', { anchor: 'start', size: 12.5 });
  } });

// ROOKSTEAD, the Greenwood (small, a ring of standing stones): no streets, tracks. The ring is the edge; the tracks are
// trodden earth out from the square to each longhouse, the hives, the great oak and the clamp.
TOWNS.push({ id: 'rookstead', name: 'Rookstead', sub: 'the Greenwood · levels 45–60 · a clan steading inside a ring of stones', size: 'small · no wall: fourteen standing stones', extent: [-14, -14, 146, 136],
  lede: 'No streets: trodden tracks from the square out to six longhouses, the hives, the great oak and the charcoal clamp.',
  svcNames: { tavern: 'The Antler', temple: 'shrine', inn: 'inn', smith: 'smith', shop: 'shop' },
  palette: { house: '#7d8a4e', low: '#9a8a62', shop: '#c98a3c', land: '#a07aa0', plaza: '#b9a77e', stall: '#c8a464' },
  swatches: [['#8a9660', 'clearing grass'], ['#5d6b44', 'forest floor'], ['#b39a70', 'trodden track'], ['#7d8a4e', 'turf roofs'], ['#9c988e', 'standing stones']],
  notes: ['Longhouses sit end-on to the tracks, smoke through the roofs. Lean-tos instead of shops: the clans make what they need.'],
  draw(t) {
    t.rect(-14, -14, 146, 136, '#5d6b44'); t.ellipse(62, 64, 58, 56, '#8a9660');
    // the wood, close round the ring
    for (let i = 0; i < 420; i++) { const x = rand() * 160 - 14, y = rand() * 150 - 14, d = Math.hypot(x - 62, y - 64); if (d > 60 + rand() * 6) t.tree(x, y, 2.2 + rand() * 2.4, rand() < 0.5 ? '#4f6a3a' : '#5a7442'); }
    // the stream and the log bridge, the way in
    t.line([[128, -14], [126, 30], [132, 70], [126, 110], [130, 136]], 3, '#6f8d98', 'water');
    const TR = '#b39a70';
    t.street([[146, 80], [124, 80], [90, 80], [76, 76]], 5, 'the way in', TR); t.rect(124, 77, 133, 83, '#7a5a3e', 'trees'); t.note(129, 90, 'the log bridge', { size: 12 });
    t.street([[36, 30], [40, 14]], 3, 'Oak Walk', TR, { cap: 'round' }); t.ellipse(42, 9, 9, 8, '#3f5a30', 'trees', `stroke="${INK}" stroke-width="1"`); t.note(42, 0, 'the great oak', { size: 12.5 });
    t.street([[80, 54], [100, 32], [104, 20]], 3, 'Hive Walk', TR, { cap: 'round' }); for (const [x, y] of [[100, 14], [106, 13], [111, 16], [104, 19]]) t.ellipse(x, y, 1.6, 1.4, '#c8a464', 'trees', `stroke="${INK}" stroke-width="0.6"`);
    for (const a of [[[84, 80], [100, 96]], [[62, 84], [64, 104]], [[38, 70], [22, 76]], [[78, 50], [94, 42]], [[46, 80], [32, 98]]]) t.street(a, 3, '', TR, { cap: 'round' });
    t.street([[30, 98], [8, 116], [-8, 126]], 3, 'Clamp Track', TR, { cap: 'round' }); t.blob(-6, 128, 6, '#3b3530', 'trees'); t.note(4, 136, 'the charcoal clamp', { anchor: 'start', size: 12 });
    // longhouses: end-on to their tracks
    t.bld(97, 96, 104, 112, 'house', { label: '' }); t.bld(58, 104, 74, 111, 'house'); t.bld(8, 72, 22, 79, 'house'); t.bld(93, 34, 109, 41, 'house'); t.bld(20, 98, 32, 106, 'house'); t.bld(80, 96, 90, 102, 'house');
    t.bld(84, 86, 91, 91, 'stall', { n: 1, name: 'The woodcarver\'s lean-to', note: 'antler, oak and yew' });
    t.bld(24, 86, 30, 92, 'stall', { n: 2, name: 'The hide-shed', note: 'skins drying on frames' });
    t.bld(108, 60, 114, 66, 'stall', { n: 3, name: 'The smokehouse' });
    t.bld(64, 74, 69, 77, 'land', { n: 4, name: 'The moot-stone', note: 'beside the well, where the clans swear' });
    // the ring: fourteen stones
    for (let i = 0; i < 14; i++) { const a = i / 14 * 6.2832 + 0.1; t.stone(62 + Math.cos(a) * 56, 64 + Math.sin(a) * 54, 1.8, '#9c988e'); }
    t.note(116, 30, 'the ring', { size: 13 });
  } });

// FROSTHOLD, the Pale Heights (small, the pass is its wall): one street, stepped, from the pass-wall up to the cloister;
// a lane of cells cut into the crag foot behind; the infirmary down by the frozen stream.
TOWNS.push({ id: 'frosthold', name: 'Frosthold', sub: 'the Pale Heights · levels 60–75 · the monastery in the pass: pilgrims who never went home', size: 'small · the pass is its wall', extent: [-12, -16, 168, 152],
  lede: 'One stepped street up from the pass-wall; a lane of cells cut into the crag behind; the infirmary down by the frozen stream.',
  svcNames: { tavern: 'Frozen Flagon', temple: 'chapel', inn: 'hospice', smith: 'smith', shop: 'shop' },
  palette: { house: '#6e7684', low: '#8e8a84', shop: '#c98a3c', land: '#a07aa0', plaza: '#cfc7b8', stall: '#c8a464' },
  swatches: [['#eef0f2', 'snow'], ['#b8aa94', 'frozen dirt'], ['#8a8d94', 'crag'], ['#a9c4d4', 'ice'], ['#6e7684', 'slate roofs']],
  notes: ['The street climbs: steps every few tiles (presentation only; the walk is level). Snow lies deepest north of everything.'],
  draw(t) {
    t.rect(-12, -16, 168, 152, '#b8aa94');
    for (let i = 0; i < 26; i++) t.drift(rand() * 180 - 12, rand() * 168 - 16, 6 + rand() * 12, '#eef0f2');
    // the crags behind: the north, and a spur down the west
    t.poly([[-12, -16], [168, -16], [168, 10], [130, 6], [110, 12], [90, 6], [60, 10], [44, 4], [20, 8], [8, 20], [6, 50], [-2, 70], [-12, 70]], '#8a8d94', 'low', `stroke="${INK}" stroke-width="1"`);
    for (let i = 0; i < 18; i++) t.drift(rand() * 170 - 10, -14 + rand() * 12, 3 + rand() * 4, '#eef0f2', 'low');
    t.note(84, -4, 'the north crags', { size: 13 });
    // the frozen stream in front, and the drop
    t.line([[-12, 132], [40, 136], [90, 130], [140, 138], [168, 134]], 4, '#a9c4d4', 'water'); t.rect(58, 128, 64, 140, '#7a5a3e', 'trees'); t.note(61, 148, 'the footbridge', { size: 12 });
    const ST = '#c9bfae', LN = '#d2c9b8';
    t.street([[168, 82], [120, 80], [90, 80], [76, 76]], 6, 'the Pilgrims\' Way', ST, { steps: true });
    t.street([[80, 46], [96, 34], [114, 20], [124, 14]], 4, 'Cell Row', LN, { steps: true });
    t.street([[46, 76], [32, 96], [22, 104]], 4, 'Infirmary Lane', LN);
    t.street([[52, 84], [58, 110], [61, 128]], 3, '', LN);
    // the monastery round the square: the bell tower over the chapel, the cloister walk, the refectory
    t.bld(30, 8, 38, 16, 'land', { n: 1, name: 'The bell tower', note: 'bells on the hour; heard on the Stair' });
    t.line([[26, 31], [26, 36], [44, 36], [44, 31]], 1.6, '#cfc7b8', 'low', `stroke-dasharray="2 1.5"`); t.note(46, 34, 'the cloister walk', { anchor: 'start', size: 11.5 });
    t.bld(84, 42, 100, 54, 'house', { n: 2, name: 'The refectory', note: 'pilgrims eat here, and have for three hundred years' });
    for (let i = 0; i < 5; i++) t.bld(98 + i * 5, 34 - i * 4.5, 103 + i * 5, 40 - i * 4.5, 'house');
    t.bld(10, 100, 28, 112, 'house', { n: 3, name: 'The infirmary', note: 'Sister Hild\'s' });
    t.bld(36, 108, 44, 114, 'stall', { n: 4, name: 'The ice-house' });
    t.bld(96, 86, 104, 92, 'shop', { n: 5, name: 'A candle-seller', note: 'pilgrims\' tapers, the only trade the Prior allows' });
    t.row(84, 86, 92, 92, 'house', 8); t.row(106, 86, 116, 92, 'house', 8); t.row(84, 68, 116, 74, 'house', 9);
    // the pass-wall across the road, the gate and its towers; the cairns and bells outside
    const WL = '#9a9690';
    t.wall([[120, 9], [120, 74]], 2.4, WL); t.wall([[120, 86], [120, 132]], 2.4, WL);
    t.tower(120, 74, 3.2, WL, false); t.tower(120, 86, 3.2, WL, false); t.note(132, 112, 'the pass-wall, crag to stream', { anchor: 'start', size: 12.5 });
    for (let i = 0; i < 9; i++) t.stone(130 + i * 4, 72 + (i % 2) * 18, 1.3, '#9c988e'); t.note(150, 66, 'the pilgrims\' cairns', { size: 12 });
    for (let i = 0; i < 26; i++) { const x = rand() * 170 - 10, y = 20 + rand() * 120; if (x < 12 || x > 126 || y > 116) t.tree(x, y, 1.6 + rand() * 1.2, '#2c3a30'); }
  } });

// THE LAMPHALL, Solmere (the largest, broken imperial walls): the empire's grid, still there under the rubble. The
// colonnaded Via runs from the square to the arch; the Cardo crosses it; the insulae between, a third of them roofless;
// four embassy quarters; the breach in the north wall out to the quay over the mud.
TOWNS.push({ id: 'lamphall', name: 'The Lamphall', sub: 'Solmere · from level 15 · the Guild\'s house at the Great Beacon\'s foot, in the dead capital', size: 'largest · broken imperial walls', extent: [-14, -44, 214, 196],
  lede: 'The empire\'s grid under the rubble: the colonnaded Via to the arch, the Cardo across it, insulae, four embassy quarters, the breach.',
  svcNames: { tavern: 'the Lamphall', temple: 'Sisters\' Hospice', inn: 'inn', smith: 'smith', shop: 'shop' },
  palette: { house: '#a08870', shop: '#c98a3c', land: '#a07aa0', low: '#b8a68a', ware: '#8a7660', plaza: '#ddd4c0', stall: '#d4a45a', shell: '#a08870' },
  swatches: [['#d6cdb8', 'imperial flags'], ['#a69b86', 'rubble'], ['#a08870', 'tenements'], ['#8f8064', 'mud flats'], ['#7f9196', 'the Mere']],
  notes: ['Insulae are four-storey tenements; the dashed ones are roofless shells, walkable inside. The Via\'s colonnade is broken columns, presentation only.',
    'Each embassy quarter opens with that region\'s renown (world-map proposal §4): its street is the way in to its people and its board.'],
  draw(t) {
    t.rect(-14, -44, 214, 196, '#d6cdb8');
    t.poly([[-14, -44], [214, -44], [214, -4], [-14, -4]], '#8f8064'); t.poly([[-14, -44], [214, -44], [214, -30], [-14, -26]], '#7f9196', 'water');
    t.note(40, -34, 'the Mere', { size: 13, ink: '#f0e8d4', halo: 'none' }); t.note(120, -16, 'the mud flats, where the lake was', { size: 12.5 });
    t.street([[130, 4], [130, -12], [150, -12], [150, -28]], 4, 'the quay over the mud', '#a69b86', { at: 0.5, size: 11.5 }); t.note(178, -34, 'to the Mere Tower, by punt', { size: 12 });
    for (let i = 0; i < 40; i++) t.blob(rand() * 220 - 12, rand() * 190, 1 + rand() * 2, '#a69b86');
    // the aqueduct, which runs into a street
    t.line([[-14, 138], [30, 138]], 2.2, '#b8a68a', 'low', `stroke="${INK}"`); for (let x = -12; x < 30; x += 5) t.rect(x, 136, x + 1.4, 140, INK, 'trees'); t.note(4, 132, 'the aqueduct, which runs into a street', { anchor: 'start', size: 12 });
    // the grid
    const VIA = '#c6bba4', ST = '#cdc3ad';
    t.street([[76, 76], [90, 80], [198, 80]], 9, 'the Via Lucerna (the high street)', VIA, { size: 13.5 });
    for (let x = 94; x < 196; x += 6) { t.tree(x, 75, 0.8, '#efe9dc'); t.tree(x, 85, 0.8, '#efe9dc'); }
    t.street([[116, 6], [116, 182]], 7, 'the Cardo', VIA, { at: 0.75 });
    for (const x of [92, 140, 164]) t.street([[x, 6], [x, 182]], 5, '', ST);
    for (const y of [14, 36, 56, 104, 128, 152, 174]) t.street([[86, y], [196, y]], 5, '', ST);
    for (const y of [104, 128, 152, 174]) t.street([[6, y], [86, y]], 5, '', ST);
    for (const x of [30, 58]) t.street([[x, 96], [x, 182]], 5, '', ST);
    t.street([[54, 82], [58, 96]], 5, '', ST);
    // insulae: a block between every pair of streets, a third roofless
    const xs = [[95, 113], [119, 137], [143, 161], [167, 194]], ys = [[17, 33], [39, 53], [59, 76], [85, 101], [107, 125], [131, 149], [155, 171]];
    for (const [x0, x1] of xs) for (const [y0, y1] of ys) { const k = rand(); if (k < 0.08) continue; t.bld(x0, y0, x1, y1, k < 0.4 ? 'shell' : 'house'); }
    for (const [x0, x1] of [[9, 27], [33, 55], [61, 83]]) for (const [y0, y1] of [[107, 125], [131, 149], [155, 171]]) { const k = rand(); t.bld(x0, y0, x1, y1, k < 0.35 ? 'shell' : 'house'); }
    t.row(44, 7, 84, 12, 'house', 10); t.row(9, 62, 18, 92, 'house', 10);
    // the Beacon over the Lamphall (the tavern), the breach, the arch
    t.ellipse(14, 40, 7, 7, '#2a2624', 'trees', `stroke="${INK}" stroke-width="1.6"`); t.note(14, 54, 'the Great Beacon', { size: 13 });
    t.bld(119, 59, 137, 76, 'land', { n: 1, name: 'The Exchange', note: 'customs and the city\'s tolls: “one lamp, large; duty paid”' });
    t.bld(95, 59, 113, 76, 'shop', { n: 2, name: 'The Guild\'s chandlery', note: 'lamp-breaking tools for every company' });
    t.bld(143, 85, 161, 101, 'shop', { n: 3, name: 'The Bowl\'s ticket-office', note: 'bouts posted daily' });
    t.bld(95, 17, 137, 33, 'land', { n: 4, name: 'The Charter\'s quarter', note: 'the Reach\'s embassy, from Reach renown' });
    t.bld(143, 17, 194, 33, 'land', { n: 5, name: 'Highmarch\'s quarter', note: 'the Seventh\'s envoys, recruiting' });
    t.bld(167, 107, 194, 149, 'land', { n: 6, name: 'The League\'s quarter', note: 'Tollhaven\'s factors' });
    t.bld(9, 155, 55, 171, 'land', { n: 7, name: 'The Clans\' Close', note: 'a green kept inside the walls' });
    for (let i = 0; i < 10; i++) t.tree(12 + rand() * 40, 157 + rand() * 12, 1.6, '#5a7442');
    // walls: pale imperial stone, twice Ashgate's; the breach in the north wall; the arch east
    const WL = '#c9bfa8';
    t.wall([[198, 73], [198, 4], [140, 4]], 3, WL); t.wall([[120, 4], [4, 4], [4, 186], [198, 186], [198, 87]], 3, WL);
    for (let x = 122; x < 139; x += 4) t.blob(x, 4 + (rand() - 0.5) * 6, 1.8, '#a69b86', 'trees');
    t.note(130, 14, 'the breach', { size: 13 });
    for (const [x, y] of [[4, 4], [70, 4], [198, 4], [4, 95], [4, 186], [100, 186], [198, 186], [198, 40], [198, 140]]) t.tower(x, y, 3.8, WL, false);
    t.tower(198, 72, 3.4, WL, false); t.tower(198, 88, 3.4, WL, false); t.note(208, 96, 'the arch', { size: 13 });
  } });

// ── the waystations (world doc v1.31 §3, *The waystations*): one street, or a bridge, or a beach, off the same square
const WAYSTATIONS = [];
const WAY_NOTE = 'Four services round the square, as Saltmere\'s: a small tavern (the board, hiring, the coach), the shop with its own shelves, a bed and a shrine. No forge: that\'s the town\'s.';

// KELL'S REST, the Reach: the Kell Assay's depot under the dead volcano. Depot Street runs east from the square to the
// Kell road; the Assay's walled yard behind it, the weigh-house at its gate; the old track climbs the volcano behind the shrine.
WAYSTATIONS.push({ id: 'kells', name: 'Kell\'s Rest', square: WAY, sub: 'the Cinder Reach · levels 15–30 · the Kell Assay\'s depot under the dead volcano', size: 'waystation · one street · no wall', extent: [-12, -24, 168, 128],
  lede: 'Depot Street east to the Kell road; the Assay\'s walled yard and its weigh-house behind; the old track up the volcano.',
  svcNames: { tavern: 'The Short Weight', shop: 'The Company Store', inn: 'The Bunkhouse', temple: 'Ash Shrine' },
  palette: { house: '#9a5a42', low: '#b89878', shop: '#c98a3c', land: '#b07a9a', ware: '#8a6a52', plaza: '#cdb595', stall: '#d4a45a' },
  swatches: [['#c9a77a', 'dry earth'], ['#6e5a50', 'the volcano\'s foot'], ['#a0563a', 'red rock'], ['#8a6a52', 'ore sheds']],
  legend: 'dry earth; the street is beaten cinder',
  notes: [WAY_NOTE, 'Why stop: the Assay Yards next door, the depot\'s company store (scrip at par, coin at a premium), and the track up to the Ninth Vault.'],
  draw(t) {
    t.rect(-12, -24, 168, 128, '#c9a77a');
    t.poly([[-12, -24], [80, -24], [60, -6], [30, 4], [10, 18], [-12, 30]], '#6e5a50', 'low', `stroke="${INK}" stroke-width="1"`); t.note(14, -12, 'the dead volcano\'s foot', { anchor: 'start', size: 12.5, ink: '#f0e2c8', halo: 'none' });
    t.street([[20, 12], [8, 0], [4, -14]], 2.4, '', '#b39a70', { dash: '3 2' }); t.note(-2, 6, 'the old track up', { anchor: 'start', size: 12, rot: -60 });
    const ST = '#a9998a';
    t.street([[76, 76], [96, 80], [168, 80]], 7, 'Depot Street', ST); t.note(158, 92, 'the Kell road', { size: 12 });
    // the Assay's yard behind the street: a fence, the weigh-house at its gate, the ore sheds
    t.line([[96, 30], [160, 30], [160, 72], [96, 72], [96, 30]], 0.6, INK, 'low', 'stroke-dasharray="2 2"');
    t.bld(98, 62, 112, 72, 'land', { n: 1, name: 'The weigh-house', note: 'the Assay\'s scales: every cart weighed in and out' });
    t.bld(118, 36, 156, 46, 'ware', { n: 2, name: 'The ore sheds' }); t.bld(118, 52, 140, 66, 'ware'); t.note(138, 26, 'the Assay\'s yard', { size: 12.5 });
    t.note(170, 34, 'to the Assay Yards ›', { anchor: 'end', size: 12 });
    // in front, low: the bunk huts, a farrier
    t.row(96, 86, 150, 92, 'low', 9); t.bld(80, 88, 90, 96, 'stall', { n: 3, name: 'A farrier', note: 'the depot\'s carts and their mules' });
    t.row(84, 100, 140, 106, 'low', 9); t.note(112, 114, 'the bunk huts, one storey', { size: 12 });
    for (const [x, y, r] of [[150, 110, 5], [160, 100, 4], [-6, 96, 6], [6, 110, 4]]) t.rock(x, y, r, '#a0563a');
  } });

// BRINE CROSS, the Tidemark: the bridge-town on the Highmarch road. Its street is the bridge: houses on both sides of
// it over the Brine, the tollhouse at mid-span; the far bank is where the siege comes.
WAYSTATIONS.push({ id: 'brine', name: 'Brine Cross', square: WAY, sub: 'the Tidemark · levels 30–45 · the bridge-town on the Highmarch road', size: 'waystation · the street is the bridge', extent: [-12, -16, 196, 128],
  lede: 'The square on the west bank; the bridge east over the Brine, built up on both sides; the tollhouse at mid-span; the far bank.',
  svcNames: { tavern: 'The Middle Arch', shop: 'The Bridge Stores', inn: 'The Upstream Rooms', temple: 'Bridgehead Shrine' },
  palette: { house: '#8a6a58', low: '#a89880', shop: '#c98a3c', land: '#a07aa0', plaza: '#cfc0a2', stall: '#d4a45a' },
  swatches: [['#cfbd9a', 'brick and setts'], ['#6f8d98', 'the Brine'], ['#a69b86', 'the bridge'], ['#8a6a58', 'houses on the bridge']],
  legend: 'setts in town, the bridge\'s stone over the water',
  notes: [WAY_NOTE, 'Why stop: the only crossing of the Brine on the Highmarch road; Act IV\'s siege is held here room by room (a site, 40–43).'],
  draw(t) {
    t.rect(-12, -16, 196, 128, '#cfbd9a');
    t.poly([[100, -16], [132, -16], [136, 40], [130, 90], [138, 128], [104, 128], [98, 90], [104, 40]], '#6f8d98', 'water'); t.note(118, -6, 'the Brine', { size: 13, ink: '#f0e8d4', halo: 'none' });
    t.rect(132, -16, 196, 128, '#c8b894');
    t.street([[76, 76], [96, 80], [196, 80]], 8, '', '#a69b86');
    for (let x = 98; x < 140; x += 7) t.bld(x, 70, x + 6, 75.6, 'house'); for (let x = 98; x < 140; x += 7) t.bld(x, 84.4, x + 6, 90, 'house');
    t.note(118, 64, 'the bridge: houses both sides', { size: 12.5 });
    t.bld(115, 76.5, 121, 83.5, 'land', { n: 1, name: 'The tollhouse', note: 'mid-span; a coin a cart, a copper a walker' });
    t.line([[166, 70], [166, 90]], 1.2, '#5a3e2a', 'trees'); t.bld(164, 66, 170, 70, 'stall', { n: 2, name: 'The east barricade', note: 'where the siege comes (Act IV)' });
    t.note(186, 96, 'to Highmarch', { anchor: 'end', size: 12 });
    t.row(84, 94, 96, 108, 'low', 6); t.bld(82, 110, 96, 118, 'stall', { n: 3, name: 'The boat-stairs', note: 'down to the water, under the first arch' });
    t.row(140, 36, 150, 66, 'house', 8); t.row(152, 36, 160, 66, 'house', 8); t.row(140, 94, 160, 112, 'house', 8);
  } });

// GULLWICK, the Tidemark: a fishing hamlet on the beach south of Tollhaven. The Strand runs down from the square to the
// sand; cottages along it, boats hauled up, the net racks; the beach road north to Tollhaven.
WAYSTATIONS.push({ id: 'gullwick', name: 'Gullwick', square: WAY, sub: 'the Tidemark · levels 30–45 · a fishing hamlet on the beach road', size: 'waystation · one street down to the sand', extent: [-12, -16, 190, 132],
  lede: 'The Strand down from the square to the beach; cottages along it, the boats drawn up, the net racks; the sea east.',
  svcNames: { tavern: 'The Gutted Herring', shop: 'Net & Needle', inn: 'The Net Loft', temple: 'Drowned Men\'s Cairn' },
  palette: { house: '#8e8a7c', low: '#a89c86', shop: '#c98a3c', land: '#a07aa0', plaza: '#d8c8a2', stall: '#c8a464' },
  swatches: [['#cdbf9a', 'dune grass'], ['#e3cf9e', 'sand'], ['#6f8d98', 'the sea'], ['#8e8a7c', 'cottages']],
  legend: 'dune grass and sand; the Strand is shingle',
  notes: [WAY_NOTE, 'Why stop: the beach road south of Tollhaven, and the only boats out to the Drowned Mole and the reef.'],
  draw(t) {
    t.rect(-12, -16, 190, 132, '#cdbf9a');
    t.poly([[110, -16], [190, -16], [190, 132], [96, 132], [104, 90], [100, 40]], '#e3cf9e');
    t.poly([[146, -16], [190, -16], [190, 132], [134, 132], [142, 100], [138, 60], [146, 20]], '#6f8d98', 'water'); t.note(170, 50, 'the sea', { size: 13, ink: '#f0e8d4', halo: 'none' });
    t.street([[76, 76], [96, 80], [132, 86]], 6, 'the Strand', '#c2b49a');
    t.street([[104, 40], [108, 10], [112, -16]], 4, '', '#c2b49a', { cap: 'round' }); t.note(118, -6, 'the beach road, to Tollhaven', { anchor: 'start', size: 12 });
    t.row(92, 68, 128, 74, 'house', 8); t.row(92, 90, 128, 96, 'house', 8);
    for (const [x, y, a] of [[134, 94, 80], [138, 108, 70], [130, 116, 95], [140, 72, 85]]) t.boat(x, y, 10, a);
    for (let i = 0; i < 4; i++) t.line([[108 + i * 6, 102], [108 + i * 6, 112]], 0.4, INK, 'trees');
    t.bld(106, 100, 128, 104, 'stall', { n: 1, name: 'The net racks', note: 'drying in rows' });
    t.bld(84, 100, 96, 108, 'low', { n: 2, name: 'The fish-smokery' });
    t.bld(124, 76, 132, 84, 'land', { n: 3, name: 'The ferryman\'s post', note: 'out to the Drowned Mole, weather allowing' });
    t.blob(176, 112, 4, '#d8c7a0', 'trees'); t.note(170, 124, 'the reef', { size: 12 });
  } });

// HOLLIN FORD, the Greenwood: where the slow river spreads into fen. The Tithe Road runs from the square down to the
// ford; log houses along it; the barn the clans keep shut across the water.
WAYSTATIONS.push({ id: 'hollin', name: 'Hollin Ford', square: WAY, sub: 'the Greenwood · levels 45–60 · the ford on the Tithe Road', size: 'waystation · one road to the ford', extent: [-12, -16, 184, 132],
  lede: 'The Tithe Road down from the square to the ford; log houses along it; the fen both sides; the shut barn across the water.',
  svcNames: { tavern: 'The Wet Boots', shop: 'The Ford Store', inn: 'The Hayloft', temple: 'Ford Stone' },
  palette: { house: '#7d6a4e', low: '#9a8a62', shop: '#c98a3c', land: '#a07aa0', plaza: '#b9a77e', stall: '#c8a464' },
  swatches: [['#8a9660', 'clearing grass'], ['#5d6b44', 'the wood'], ['#7f8a66', 'fen'], ['#6f8d98', 'the slow river']],
  legend: 'grass and trodden earth; the ford is stones',
  notes: [WAY_NOTE, 'Why stop: the ford is the Tithe Road\'s only crossing, and the clans\' trading post is the last before Rookstead.'],
  draw(t) {
    t.rect(-12, -16, 184, 132, '#8a9660');
    t.poly([[112, -16], [150, -16], [156, 132], [104, 132]], '#7f8a66'); for (let i = 0; i < 40; i++) t.tree(110 + rand() * 46, rand() * 148 - 16, 0.6, '#5a6a44');
    t.line([[132, -16], [128, 40], [132, 80], [126, 132]], 6, '#6f8d98', 'water'); t.note(138, 8, 'the slow river', { anchor: 'start', size: 12.5 });
    t.street([[76, 76], [96, 80], [126, 80]], 6, 'the Tithe Road', '#b39a70'); t.street([[138, 80], [184, 80]], 6, '', '#b39a70');
    for (let i = 0; i < 5; i++) t.stone(127 + i * 2.6, 78 + (i % 2) * 3, 1.1, '#9c988e'); t.note(132, 92, 'the ford', { size: 12.5 });
    t.bld(126, 66, 134, 72, 'land', { n: 1, name: 'The Ford Stone\'s keeper', note: 'calls the water: wade, or wait' });
    t.row(92, 68, 120, 74, 'house', 9); t.row(92, 88, 120, 94, 'low', 9);
    t.bld(150, 50, 172, 66, 'land', { n: 2, name: 'Hollin Ford Barn', note: 'sealed; the clans call what\'s inside their grandparents (a site, 42–47)' });
    t.bld(84, 98, 94, 106, 'stall', { n: 3, name: 'A cooper', note: 'the trading post\'s salt barrels' });
    for (let i = 0; i < 260; i++) { const x = rand() * 196 - 12, y = rand() * 148 - 16; if (Math.hypot(x - 62, y - 64) > 58 && (x < 104 || x > 160) && Math.abs(y - 80) > 8) t.tree(x, y, 2 + rand() * 2.2, rand() < 0.5 ? '#4f6a3a' : '#5a7442'); }
  } });

// THE FROZEN HOSPICE, the Heights: the pilgrims' hospice at the foot of the Stair. A walled court round the square; the
// Stair goes up from its north-east gate; the Cult's camp outside the wall is the site.
WAYSTATIONS.push({ id: 'hospice', name: 'The Frozen Hospice', square: WAY, sub: 'the Pale Heights · levels 60–75 · the pilgrims\' hospice at the foot of the Stair', size: 'waystation · a walled court', extent: [-12, -24, 176, 128],
  lede: 'A walled court round the square; the Stair up from the north-east gate; the Sol frozen below; the Cult\'s camp outside the wall.',
  svcNames: { tavern: 'The Warming Room', shop: 'The Pilgrims\' Store', inn: 'The Long Dormitory', temple: 'Stair Shrine' },
  palette: { house: '#6e7684', low: '#8e8a84', shop: '#c98a3c', land: '#a07aa0', plaza: '#cfc7b8', stall: '#c8a464' },
  swatches: [['#eef0f2', 'snow'], ['#b8aa94', 'frozen dirt'], ['#9a9690', 'the court wall'], ['#a9c4d4', 'the Sol, frozen']],
  legend: 'frozen dirt; snow drifted against every wall',
  notes: [WAY_NOTE, 'Why stop: the last warm room before the Stair. The hospice keeps its court; the Cult\'s camp round it is the site (57–62).'],
  draw(t) {
    t.rect(-12, -24, 176, 128, '#b8aa94');
    for (let i = 0; i < 18; i++) t.drift(rand() * 188 - 12, rand() * 152 - 24, 5 + rand() * 9, '#eef0f2');
    t.line([[150, -24], [146, 40], [152, 90], [148, 128]], 5, '#a9c4d4', 'water'); t.note(156, 0, 'the Sol', { anchor: 'start', size: 12.5 });
    const WL = '#9a9690';
    t.wall([[6, 8], [100, 8], [100, 70]], 2, WL); t.wall([[100, 90], [100, 112], [6, 112], [6, 8]], 2, WL);
    t.tower(100, 70, 2.6, WL, false); t.tower(100, 90, 2.6, WL, false); t.note(108, 104, 'the court gate', { anchor: 'start', size: 12 });
    t.street([[76, 76], [100, 80], [140, 80]], 5, '', '#c9bfae');
    t.street([[100, 8], [110, -6], [118, -24]], 4, 'the Stair', '#c9bfae', { steps: true });
    t.bld(94, 2, 102, 10, 'land', { n: 1, name: 'The Stair\'s first step', note: 'and the bell rung for pilgrims who don\'t come down' });
    for (const [x, y] of [[118, 30], [128, 40], [116, 50], [126, 100], [114, 112], [136, 116], [134, 60]]) t.poly([[x - 4, y + 3], [x, y - 3], [x + 4, y + 3]], '#7a6050', 'trees', `stroke="${INK}" stroke-width="0.8"`);
    t.bld(112, 22, 120, 28, 'stall', { n: 2, name: 'The Cult\'s camp', note: 'tents round the hospice\'s wall: the site' });
    t.bld(80, 94, 94, 104, 'low', { n: 3, name: 'The woodstore', note: 'a winter\'s fuel, stacked to the eaves' });
    t.row(10, 92, 40, 98, 'low', 8);
  } });

// ── draw ──────────────────────────────────────────────────────────────────────────────────────────────────────────────
mkdirSync(OUT, { recursive: true });
const font = (f) => pathToFileURL(join(ROOT, 'assets', 'fonts', f)).href;
const { chromium } = await import(pathToFileURL(join(ROOT, 'node_modules', 'playwright', 'index.mjs')).href);
const b = await chromium.launch({ executablePath: process.env.CHROME || '/opt/pw-browsers/chromium' }).catch(() => chromium.launch());
const ONLY = process.argv.includes('--waystations');   // just the waystations' sheets
for (const spec of ONLY ? WAYSTATIONS : [...TOWNS, ...WAYSTATIONS]) {
  seed = 0x57ee75 ^ spec.id.length * 7919;
  const { svg, H } = plan(spec), file = join(OUT, `streets-${spec.id}.jpg`), tmp = file.replace(/\.jpg$/, '.render.html');
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
