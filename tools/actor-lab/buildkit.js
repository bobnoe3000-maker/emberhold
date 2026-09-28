// buildkit.js — Emberfall's own building kit: procedural low-poly buildings authored
// in code (no third-party models), in three art-direction options. Every building is
// composed from a few parts — stone/plaster/plank walls with course textures, timber
// framing, gable / hip / conical roofs in slate, thatch or lead, lit windows, doors,
// chimneys, crenellations, buttresses, signs, banners — and baked by envlab.js
// exactly like the KayKit models (albedo, normals, depth key, shadow, lit windows).
//
// Units: 1 unit = 10 game tiles; the 56 px knight stands ~0.57 units tall, so a door
// is ~0.5 and a storey ~0.55 (grounded, not chibi). Meshes flagged userData.glow are
// window glass (baked emissive).
import * as THREE from 'three';
import { mergeVertices } from 'three/addons/utils/BufferGeometryUtils.js';

// ── deterministic rng for texture + detail variation ────────────────────────
function rng(seed) { let a = seed >>> 0; return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const hex = (h) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
const shade = (c, k) => c.map((v) => Math.max(0, Math.min(255, Math.round(v * k))));
const css = (c) => `rgb(${c[0]},${c[1]},${c[2]})`;

// ── procedural textures (64 px tiles, nearest-filtered; one tile ≈ TEX_UNITS units) ──
const TEX_UNITS = 0.5;
const texCache = new Map();
function tex(kind, base, seed = 1, alt) {
  const key = kind + base + seed + (alt || '');
  if (texCache.has(key)) return texCache.get(key);
  const S = 64, c = document.createElement('canvas'); c.width = c.height = S; const x = c.getContext('2d'), r = rng(seed * 977 + kind.length);
  const b = hex(base), a2 = alt ? hex(alt) : shade(b, 0.62);
  x.fillStyle = css(b); x.fillRect(0, 0, S, S);
  const rect = (col, X, Y, W, H) => { x.fillStyle = css(col); x.fillRect(X, Y, W, H); };
  if (kind === 'ashlar' || kind === 'rubble' || kind === 'field') {         // stone courses
    const ch = kind === 'ashlar' ? 11 : kind === 'rubble' ? 8 : 9;
    for (let y = 0; y < S; y += ch) {
      let X = -((y / ch) % 2) * (kind === 'ashlar' ? 11 : 6) - r() * 4;
      while (X < S) {
        const w = kind === 'ashlar' ? 22 : 8 + r() * 14, k = 0.86 + r() * 0.26;
        rect(shade(b, k), X + 1, y + 1, w - 1, ch - 1);
        rect(shade(b, k * 1.12), X + 1, y + 1, w - 1, 1);                // lit top edge
        X += w;
      }
      rect(a2, 0, y, S, 1);
    }
  } else if (kind === 'plaster') {
    for (let i = 0; i < 26; i++) { const k = 0.9 + r() * 0.16; rect(shade(b, k), r() * S, r() * S, 4 + r() * 14, 3 + r() * 8); }
    for (let i = 0; i < 6; i++) rect(shade(b, 0.8), r() * S, S - 6 - r() * 10, 2 + r() * 6, 10);       // damp stains low down
  } else if (kind === 'planks') {
    for (let X = 0; X < S; X += 8) { rect(shade(b, 0.85 + r() * 0.25), X, 0, 7, S); rect(a2, X + 7, 0, 1, S); if (r() < 0.5) rect(shade(b, 0.7), X + 3, r() * S, 1, 3); }
  } else if (kind === 'slate' || kind === 'lead') {                         // roof courses, staggered
    const ch = kind === 'slate' ? 6 : 16;
    for (let y = 0; y < S; y += ch) {
      let X = ((y / ch) % 2) * 5;
      for (; X < S + 10; X += kind === 'slate' ? 10 : 16) { rect(shade(b, 0.82 + r() * 0.28), X, y, (kind === 'slate' ? 9 : 15), ch - 1); }
      rect(a2, 0, y + ch - 1, S, 1);
    }
  } else if (kind === 'thatch') {
    for (let y = 0; y < S; y += 10) { rect(shade(b, 0.7), 0, y + 9, S, 1); }
    for (let i = 0; i < 260; i++) { const X = r() * S, Y = r() * S; rect(shade(b, 0.78 + r() * 0.4), X, Y, 1, 3 + r() * 5); }
  } else if (kind === 'shingle') {
    for (let y = 0; y < S; y += 8) { let X = ((y / 8) % 2) * 4; for (; X < S; X += 8) rect(shade(b, 0.8 + r() * 0.3), X, y, 7, 7); rect(a2, 0, y + 7, S, 1); }
  } else if (kind === 'palisade') {
    for (let X = 0; X < S; X += 10) { rect(shade(b, 0.85 + r() * 0.2), X, 0, 9, S); rect(shade(b, 1.12), X + 1, 0, 2, S); rect(a2, X + 9, 0, 1, S); }
  }
  const t = new THREE.CanvasTexture(c); t.magFilter = THREE.NearestFilter; t.minFilter = THREE.NearestFilter;
  t.wrapS = t.wrapT = THREE.RepeatWrapping; t.colorSpace = THREE.SRGBColorSpace; texCache.set(key, t);
  return t;
}
const mat = (t, color) => new THREE.MeshStandardMaterial({ map: t || null, color: color ? new THREE.Color(color) : 0xffffff });

// box with UVs scaled to world size so textures keep one density everywhere
function box(w, h, d, m, x = 0, y = 0, z = 0, g) {
  const geo = new THREE.BoxGeometry(w, h, d), uv = geo.attributes.uv;
  const dims = [[d, h], [d, h], [w, d], [w, d], [w, h], [w, h]];
  for (let f = 0; f < 6; f++) for (let v = 0; v < 4; v++) { const i = f * 4 + v; uv.setXY(i, uv.getX(i) * dims[f][0] / TEX_UNITS, uv.getY(i) * dims[f][1] / TEX_UNITS); }
  const mesh = new THREE.Mesh(geo, m); mesh.position.set(x, y + h / 2, z); if (g) g.add(mesh); return mesh;
}

// gable roof over a w (x) × d (z) rectangle, ridge along x, eaves at y0, rise `rise`
function gable(g, w, d, y0, rise, m, wallM, over = 0.08, thick = 0.05) {
  const W = w / 2 + over, D = d / 2 + over, pos = [], uvs = [], idx = [];
  const slope = Math.hypot(D, rise);
  const quad = (a, b, c, e, u1, v1) => { const n = pos.length / 3; pos.push(...a, ...b, ...c, ...e); uvs.push(0, 0, u1, 0, u1, v1, 0, v1); idx.push(n, n + 1, n + 2, n, n + 2, n + 3); };
  quad([-W, y0, D], [W, y0, D], [W, y0 + rise, 0], [-W, y0 + rise, 0], 2 * W / TEX_UNITS, slope / TEX_UNITS);   // front slope
  quad([W, y0, -D], [-W, y0, -D], [-W, y0 + rise, 0], [W, y0 + rise, 0], 2 * W / TEX_UNITS, slope / TEX_UNITS);  // back slope
  // underside thickness strip along the eaves
  quad([-W, y0 - thick, D], [W, y0 - thick, D], [W, y0, D], [-W, y0, D], 2 * W / TEX_UNITS, 0.1);
  quad([W, y0 - thick, -D], [-W, y0 - thick, -D], [-W, y0, -D], [W, y0, -D], 2 * W / TEX_UNITS, 0.1);
  const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2)); geo.setIndex(idx); geo.computeVertexNormals();
  const roof = new THREE.Mesh(geo, m); roof.material.side = THREE.DoubleSide; g.add(roof);
  // gable end triangles in the wall material
  const tp = [], tu = [];
  for (const sx of [-1, 1]) { const X = sx * (w / 2); tp.push(X, y0, -d / 2, X, y0, d / 2, X, y0 + rise * (d / 2) / D, 0); tu.push(0, 0, d / TEX_UNITS, 0, d / 2 / TEX_UNITS, rise / TEX_UNITS); }
  const tg = new THREE.BufferGeometry(); tg.setAttribute('position', new THREE.Float32BufferAttribute(tp, 3)); tg.setAttribute('uv', new THREE.Float32BufferAttribute(tu, 2)); tg.computeVertexNormals();
  const tri = new THREE.Mesh(tg, wallM.clone()); tri.material.side = THREE.DoubleSide; g.add(tri);
  return roof;
}
function pyramid(g, w, y0, rise, m, sides = 4, over = 0.08) {
  const c = new THREE.Mesh(new THREE.ConeGeometry((w / 2 + over) * (sides === 4 ? Math.SQRT2 : 1), rise, sides, 1), m);
  c.position.y = y0 + rise / 2; if (sides === 4) c.rotation.y = Math.PI / 4; g.add(c); return c;
}

// window on a wall face: frame + glowing glass (+ optional pointed head / shutters)
function windowOn(g, S, face, u, y, w = 0.12, h = 0.16, opt = {}) {
  const { wallW, wallD } = face, t = 0.025;
  const place = (mesh, off) => {
    if (face.side === 'z') { mesh.position.set(u, y, wallD / 2 + off); }
    else { mesh.position.set(wallW / 2 + off, y, u); mesh.rotation.y = Math.PI / 2; }
    g.add(mesh);
  };
  const frame = new THREE.Mesh(new THREE.BoxGeometry(w + 0.04, h + 0.04, t), S.m.trim); place(frame, 0.004);
  const lit = opt.lit ?? S.rnd() < 0.65;                 // not every window is lit
  const glass = new THREE.Mesh(new THREE.BoxGeometry(w, h, t), lit ? S.m.glass : S.m.dark); glass.userData.glow = lit; place(glass, 0.012);
  const bar = new THREE.Mesh(new THREE.BoxGeometry(0.014, h, t), S.m.trim); place(bar, 0.02);
  if (opt.pointed) { const p = new THREE.Mesh(new THREE.ConeGeometry(w / 2 + 0.02, 0.09, 4, 1), S.m.trim); p.rotation.z = 0; p.scale.z = 0.25; place(p, 0.004); p.position.y = y + h / 2 + 0.045; p.rotation.y += Math.PI / 4; }
  if (opt.shutters) for (const sx of [-1, 1]) { const sh = new THREE.Mesh(new THREE.BoxGeometry(w * 0.5, h + 0.02, t), S.m.wood); place(sh, 0.01); if (face.side === 'z') sh.position.x += sx * (w * 0.78); else sh.position.z += sx * (w * 0.78); }
}
function doorOn(g, S, face, u, w = 0.2, h = 0.42, arch = true) {
  const t = 0.03, d = new THREE.Mesh(new THREE.BoxGeometry(w, h, t), S.m.door), fr = new THREE.Mesh(new THREE.BoxGeometry(w + 0.05, h + 0.04, t * 0.8), S.m.trim);
  for (const [mesh, off] of [[fr, 0.004], [d, 0.014]]) {
    if (face.side === 'z') mesh.position.set(u, h / 2, face.wallD / 2 + off); else { mesh.position.set(face.wallW / 2 + off, h / 2, u); mesh.rotation.y = Math.PI / 2; }
    g.add(mesh);
  }
  if (arch) { const a = new THREE.Mesh(new THREE.CylinderGeometry(w / 2 + 0.025, w / 2 + 0.025, t * 0.8, 10, 1, false, 0, Math.PI), S.m.trim); a.rotation.x = Math.PI / 2; a.rotation.z = Math.PI / 2;
    if (face.side === 'z') { a.position.set(u, h, face.wallD / 2 + 0.004); a.rotation.set(Math.PI / 2, 0, Math.PI / 2); } else { a.position.set(face.wallW / 2 + 0.004, h, u); a.rotation.set(0, 0, 0); a.rotation.x = Math.PI / 2; a.rotation.y = Math.PI / 2; a.rotation.z = 0; }
    g.add(a); }
}
// timber framing on a wall face between y0..y1: posts, rails, braces
function timber(g, S, face, y0, y1, n = 3, braces = true) {
  const t = 0.03, span = face.side === 'z' ? face.wallW : face.wallD, out = (face.side === 'z' ? face.wallD : face.wallW) / 2 + 0.012;
  const add = (w, h, u, y, rot = 0) => { const b = new THREE.Mesh(new THREE.BoxGeometry(w, h, t), S.m.beam);
    if (face.side === 'z') { b.position.set(u, y, out); b.rotation.z = rot; } else { b.position.set(out, y, u); b.rotation.y = Math.PI / 2; b.rotation.x = -rot; b.rotation.order = 'YXZ'; b.rotation.set(0, Math.PI / 2, 0); b.rotateZ(rot); }
    g.add(b); };
  for (let i = 0; i <= n; i++) add(0.04, y1 - y0, -span / 2 + (span * i) / n, (y0 + y1) / 2);
  add(span + 0.02, 0.04, 0, y0 + 0.02); add(span + 0.02, 0.04, 0, y1 - 0.02); add(span, 0.035, 0, (y0 + y1) / 2);
  if (braces) for (let i = 0; i < n; i += 2) { const cw = span / n, len = Math.hypot(cw, (y1 - y0) / 2); add(0.035, len, -span / 2 + cw * (i + 0.5), y0 + (y1 - y0) * 0.25, Math.atan2(cw, (y1 - y0) / 2) * (i % 4 ? 1 : -1)); }
}
function chimney(g, S, x, z, y0, h) { box(0.1, h, 0.1, S.m.stone, x, y0, z, g); box(0.13, 0.03, 0.13, S.m.stoneDark, x, y0 + h, z, g); }
function crenels(g, S, w, d, y, m = S.m.stone, size = 0.07) {
  const step = size * 2;
  for (let x = -w / 2 + size / 2; x <= w / 2; x += step) for (const z of [-d / 2 + size / 2, d / 2 - size / 2]) box(size, size, size, m, x, y, z, g);
  for (let z = -d / 2 + size / 2 + step; z <= d / 2 - step; z += step) for (const x of [-w / 2 + size / 2, w / 2 - size / 2]) box(size, size, size, m, x, y, z, g);
}
function banner(g, S, x, y, z, side = 'z', h = 0.3) {
  const b = new THREE.Mesh(new THREE.BoxGeometry(0.1, h, 0.012), S.m.banner);
  if (side === 'z') b.position.set(x, y - h / 2, z); else { b.position.set(x, y - h / 2, z); b.rotation.y = Math.PI / 2; }
  g.add(b); const p = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.015, 0.015), S.m.trim); p.position.set(b.position.x, y, b.position.z); p.rotation.y = b.rotation.y; g.add(p);
}
function sign(g, S, x, y, z) {
  const arm = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.02, 0.16), S.m.trim); arm.position.set(x, y, z + 0.08); g.add(arm);
  const bd = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.1, 0.12), S.m.signboard); bd.position.set(x, y - 0.07, z + 0.12); g.add(bd);
}
function barrel(g, S, x, z) { const b = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.12, 8), S.m.wood); b.position.set(x, 0.06, z); g.add(b); const h = new THREE.Mesh(new THREE.CylinderGeometry(0.052, 0.052, 0.012, 8), S.m.trim); h.position.set(x, 0.09, z); g.add(h); }
function hay(g, S, x, z, r = 0.09) { const h = new THREE.Mesh(new THREE.CylinderGeometry(r, r * 1.1, r * 1.3, 8), S.m.hay); h.position.set(x, r * 0.65, z); g.add(h); const c = new THREE.Mesh(new THREE.ConeGeometry(r * 1.05, r * 0.7, 8), S.m.hay); c.position.set(x, r * 1.3 + r * 0.35, z); g.add(c); }
function fenceRun(g, S, x0, z0, x1, z1) {
  const len = Math.hypot(x1 - x0, z1 - z0), n = Math.max(2, Math.round(len / 0.14)), ang = Math.atan2(x1 - x0, z1 - z0);
  for (let i = 0; i <= n; i++) { const t = i / n; box(0.025, 0.14, 0.025, S.m.wood, x0 + (x1 - x0) * t, 0, z0 + (z1 - z0) * t, g); }
  for (const y of [0.05, 0.11]) { const r = new THREE.Mesh(new THREE.BoxGeometry(0.015, 0.02, len), S.m.wood); r.position.set((x0 + x1) / 2, y, (z0 + z1) / 2); r.rotation.y = ang; g.add(r); }
}

// ── the three art-direction options ──────────────────────────────────────────
// A · Timber & Slate: fieldstone ground floor, limewashed plaster over dark oak
//     framing, jettied upper storey, steep blue-grey slate. Paperback-D&D village.
// B · Thatch & Rubble: older, earthier. Rubble stone and wattle-and-daub, rough
//     posts, heavy thatch; timber palisades and a motte keep.
// C · Gothic Stone: cold dark ashlar, buttresses, pointed windows, steep lead roofs,
//     iron finials and blood-red banners. Closest to the dungeon's mood.
export const STYLES = {
  A: { key: 'A', name: 'Timber & Slate', lower: ['field', '#6c665c'], upper: ['plaster', '#cdbf9f'], roof: ['slate', '#434856'], roofRise: 1.05,
    wood: '#3a2c22', beam: '#2c2019', door: '#4a3526', trim: '#2a221d', banner: '#6b2226', hay: '#8a7a4c', signboard: '#5a4432', jetty: 0.04, timber: true },
  B: { key: 'B', name: 'Thatch & Rubble', lower: ['rubble', '#736955'], upper: ['plaster', '#a08c66'], roof: ['thatch', '#8a7446'], roofRise: 0.95,
    wood: '#4a3a2a', beam: '#3a2d22', door: '#503c2a', trim: '#33271e', banner: '#5a3a24', hay: '#8c7a48', signboard: '#5a4432', jetty: 0, timber: false, thatch: true },
  C: { key: 'C', name: 'Gothic Stone', lower: ['ashlar', '#4f4c58'], upper: ['ashlar', '#4f4c58'], roof: ['lead', '#2a2b33'], roofRise: 1.6,
    wood: '#34282a', beam: '#26201f', door: '#3a2a26', trim: '#1f1b20', banner: '#6e1c22', hay: '#7c6d45', signboard: '#4a3a33', jetty: 0, timber: false, gothic: true },
};
// Regional tones: every region's town keeps option A's SHAPES (so the shop, tavern,
// inn and temple read the same everywhere) and changes only materials and colour.
const A_SHAPE = { roofRise: 1.05, jetty: 0.04, timber: true };
Object.assign(STYLES, {
  vale:    { ...STYLES.A, key: 'vale' },                                                          // Hollow Vale: warm oak, limewash, slate
  fens:    { ...A_SHAPE, key: 'fens', lower: ['rubble', '#5b5f57'], upper: ['plaster', '#98a089'], roof: ['slate', '#363d36'],
             wood: '#35302a', beam: '#26231f', door: '#3d3a30', trim: '#1f201c', banner: '#3b5a4a', hay: '#6f6a46', signboard: '#4a463a' },  // damp, mossy, grey-green
  reach:   { ...A_SHAPE, key: 'reach', lower: ['field', '#4c4542'], upper: ['plaster', '#8c7d70'], roof: ['slate', '#5e3024'],
             wood: '#2a211d', beam: '#1b1613', door: '#3a2820', trim: '#191412', banner: '#7c2c18', hay: '#7a6a44', signboard: '#4a3226' },  // soot, ash, rust-red tile
  heights: { ...A_SHAPE, key: 'heights', lower: ['ashlar', '#8a8984'], upper: ['plaster', '#c9c7bf'], roof: ['slate', '#48536a'],
             wood: '#4a4038', beam: '#38312c', door: '#4a3e34', trim: '#28282c', banner: '#2c4a70', hay: '#8a8060', signboard: '#4a4a52' },  // pale limestone, cold blue slate
});
function kit(style, seed = 1) {
  const s = STYLES[style], g = new THREE.Group();
  const m = {
    lower: mat(tex(s.lower[0], s.lower[1], seed)), upper: mat(tex(s.upper[0], s.upper[1], seed + 1)),
    roof: mat(tex(s.roof[0], s.roof[1], seed + 2)), stone: mat(tex(s.lower[0] === 'ashlar' ? 'ashlar' : 'field', s.lower[1], seed + 3)),
    stoneDark: mat(null, shade(hex(s.lower[1]), 0.6).reduce((a, v) => a + v.toString(16).padStart(2, '0'), '#')),
    wood: mat(tex('planks', s.wood, seed + 4)), beam: mat(null, s.beam), door: mat(tex('planks', s.door, seed + 5)), trim: mat(null, s.trim),
    glass: mat(null, '#e0a050'), dark: mat(null, '#1c1a22'), paper: mat(null, '#b8ad92'), banner: mat(null, s.banner), hay: mat(tex('thatch', s.hay, seed + 6)), signboard: mat(null, s.signboard),
    palisade: mat(tex('palisade', s.wood, seed + 7)),
    ashlar: mat(tex('ashlar', s.lower[1], seed + 8)),         // dressed stone (the temple, in every region)
  };
  return { S: { ...s, m, rnd: rng(seed * 31 + 7) }, g };
}

// A walled storey block with windows on the two camera-facing sides (+z and +x).
function storeyBlock(S, g, w, d, y0, h, wallM, winRow, opts = {}) {
  const b = box(w, h, d, wallM, 0, y0, 0, g);
  const fz = { side: 'z', wallW: w, wallD: d }, fx = { side: 'x', wallW: w, wallD: d };
  if (winRow) {
    const nz = Math.max(1, Math.round(w / 0.32)), nx = Math.max(1, Math.round(d / 0.32));
    for (let i = 0; i < nz; i++) { const u = -w / 2 + (w * (i + 0.5)) / nz; if (opts.doorZ !== undefined && Math.abs(u - opts.doorZ) < 0.16) continue; windowOn(g, S, fz, u, y0 + h * 0.55, 0.11, 0.15, { pointed: S.gothic, shutters: !S.gothic && !S.thatch && i % 2 === 0 }); }
    for (let i = 0; i < nx; i++) { const u = -d / 2 + (d * (i + 0.5)) / nx; windowOn(g, S, fx, u, y0 + h * 0.55, 0.11, 0.15, { pointed: S.gothic }); }
    // the two far faces too (mirrored groups), so a 90°-turned building still shows windows
    const back = new THREE.Group(); back.rotation.y = Math.PI; g.add(back);
    for (let i = 0; i < nz; i++) windowOn(back, S, fz, -w / 2 + (w * (i + 0.5)) / nz, y0 + h * 0.55, 0.11, 0.15, { pointed: S.gothic });
    for (let i = 0; i < nx; i++) windowOn(back, S, fx, -d / 2 + (d * (i + 0.5)) / nx, y0 + h * 0.55, 0.11, 0.15, { pointed: S.gothic });
  }
  if (opts.timber && S.timber) {
    timber(g, S, fz, y0, y0 + h, Math.max(2, Math.round(w / 0.25))); timber(g, S, fx, y0, y0 + h, Math.max(2, Math.round(d / 0.25)));
    const back = new THREE.Group(); back.rotation.y = Math.PI; g.add(back);
    timber(back, S, fz, y0, y0 + h, Math.max(2, Math.round(w / 0.25))); timber(back, S, fx, y0, y0 + h, Math.max(2, Math.round(d / 0.25)));
  }
  return b;
}
function roofOver(S, g, w, d, y0, rise, alongX = true) {
  const r = new THREE.Group(); g.add(r);
  if (!alongX) r.rotation.y = Math.PI / 2;
  const [W, D] = alongX ? [w, d] : [d, w];
  gable(r, W, D, y0, rise * D / 2, S.m.roof, S.m.upper, S.thatch ? 0.1 : 0.07, S.thatch ? 0.09 : 0.04);
  if (S.thatch) { const rr = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, W + 0.2, 8), S.m.roof); rr.rotation.z = Math.PI / 2; rr.position.y = y0 + rise * D / 2 + 0.01; r.add(rr); }
  if (S.gothic) { for (const sx of [-1, 1]) { const f = new THREE.Mesh(new THREE.ConeGeometry(0.025, 0.14, 4), S.m.trim); f.position.set(sx * W / 2, y0 + rise * D / 2 + 0.06, 0); r.add(f); } }
  return r;
}
function buttresses(S, g, w, d, h) {
  for (let i = 0; i <= 2; i++) { const x = -w / 2 + (w * i) / 2; box(0.07, h * 0.75, 0.1, S.m.stone, x, 0, d / 2 + 0.04, g); }
  for (let i = 1; i <= 1; i++) box(0.1, h * 0.75, 0.07, S.m.stone, w / 2 + 0.04, 0, -d / 2 + (d * i) / 2, g);
}

// ── building types ───────────────────────────────────────────────────────────
const TYPES = {
  house(S, g, r) {
    const w = 0.72, d = 0.58, h1 = 0.5, h2 = S.thatch ? 0 : 0.42;
    storeyBlock(S, g, w, d, 0, h1, S.m.lower, true, { doorZ: -0.12 });
    doorOn(g, S, { side: 'z', wallW: w, wallD: d }, -0.12, 0.17, 0.36, !S.timber);
    let top = h1;
    if (h2) { const j = S.jetty; storeyBlock(S, g, w + j * 2, d + j * 2, h1, h2, S.m.upper, true, { timber: true }); top += h2; }
    roofOver(S, g, w + S.jetty * 2, d + S.jetty * 2, top, S.roofRise);
    chimney(g, S, w / 2 - 0.12, -d / 4, top, 0.32 + S.roofRise * 0.2);
    if (S.gothic) buttresses(S, g, w, d, h1);
  },
  tavern(S, g, r) {
    const w = 1.0, d = 0.7, h1 = 0.55, h2 = 0.48;
    storeyBlock(S, g, w, d, 0, h1, S.m.lower, true, { doorZ: 0.05 });
    doorOn(g, S, { side: 'z', wallW: w, wallD: d }, 0.05, 0.22, 0.4, true);
    const j = S.jetty; storeyBlock(S, g, w + j * 2, d + j * 2, h1, h2, S.thatch ? S.m.lower : S.m.upper, true, { timber: true });
    roofOver(S, g, w + j * 2, d + j * 2, h1 + h2, S.roofRise);
    // back wing, lower, at right angles
    const wing = new THREE.Group(); wing.position.set(-0.3, 0, -0.55); g.add(wing);
    storeyBlock(S, wing, 0.5, 0.45, 0, 0.5, S.m.lower, false); roofOver(S, wing, 0.5, 0.45, 0.5, S.roofRise, false);
    chimney(g, S, 0.34, -0.12, h1 + h2, 0.45); chimney(g, S, -0.38, 0.1, h1 + h2, 0.4);
    sign(g, S, 0.32, 0.5, d / 2); barrel(g, S, 0.62, 0.3); barrel(g, S, 0.62, 0.16);
    // a covered porch over the door with trestle tables and two lanterns: the tavern spills outside
    const po = new THREE.Group(); po.position.set(0.12, 0, d / 2 + 0.17); g.add(po);
    for (const x of [-0.26, 0.4]) box(0.035, 0.42, 0.035, S.m.beam, x, 0, 0.14, po);
    const pr = box(0.76, 0.03, 0.36, S.m.roof, 0.07, 0.43, 0, po); pr.rotation.x = 0.3;
    for (const x of [-0.12, 0.26]) { box(0.16, 0.02, 0.1, S.m.wood, x, 0.1, 0.05, po); for (const lx of [-0.06, 0.06]) box(0.018, 0.1, 0.018, S.m.beam, x + lx, 0, 0.05, po); box(0.16, 0.015, 0.035, S.m.wood, x, 0.06, 0.12, po); }
    lantern(po, S, -0.26, 0.38, 0.17); lantern(po, S, 0.4, 0.38, 0.17);
    // notice board (the Lantern Guild's quests) beside the door: posts, board, pinned notes
    const nb = new THREE.Group(); nb.position.set(-0.46, 0, d / 2 + 0.1); g.add(nb);
    for (const sx of [-1, 1]) box(0.025, 0.34, 0.025, S.m.beam, sx * 0.13, 0, 0, nb);
    box(0.3, 0.18, 0.025, S.m.wood, 0, 0.14, 0, nb); box(0.34, 0.03, 0.06, S.m.roof, 0, 0.33, 0, nb);
    for (const [x, y] of [[-0.08, 0.26], [0.02, 0.2], [0.09, 0.25], [-0.03, 0.16], [0.08, 0.16]]) box(0.05, 0.06, 0.03, S.m.paper, x, y, 0.004, nb);
    if (S.gothic) buttresses(S, g, w, d, h1);
  },
  inn(S, g, r) {
    const w = 1.2, d = 0.66, h = [0.52, 0.46, 0.44];
    let y = 0; h.forEach((hh, i) => { storeyBlock(S, g, w + (i ? S.jetty * 2 : 0), d + (i ? S.jetty * 2 : 0), y, hh, i ? (S.thatch ? S.m.lower : S.m.upper) : S.m.lower, true, { doorZ: 0.3, timber: i > 0 }); y += hh; });
    doorOn(g, S, { side: 'z', wallW: w, wallD: d }, 0.3, 0.24, 0.42, true);
    roofOver(S, g, w + S.jetty * 2, d + S.jetty * 2, y, S.roofRise);
    // dormers on the front slope
    for (const x of [-0.3, 0.3]) { const dm = new THREE.Group(); dm.position.set(x, y + 0.05, d / 4); g.add(dm); storeyBlock(S, dm, 0.2, 0.2, 0, 0.16, S.m.upper, false); windowOn(dm, S, { side: 'z', wallW: 0.2, wallD: 0.2 }, 0, 0.09, 0.09, 0.1); roofOver(S, dm, 0.2, 0.22, 0.16, S.roofRise, false); }
    chimney(g, S, -0.5, 0, y, 0.42); chimney(g, S, 0.52, -0.1, y, 0.38);
    // stable lean-to on the right
    const st = new THREE.Group(); st.position.set(w / 2 + 0.22, 0, 0.05); g.add(st);
    for (const [x, z] of [[-0.18, 0.28], [0.18, 0.28], [0.18, -0.25]]) box(0.04, 0.4, 0.04, S.m.beam, x, 0, z, st);
    const lean = box(0.46, 0.04, 0.62, S.m.roof, 0, 0.42, 0, st); lean.rotation.x = 0.0; lean.rotation.z = -0.25;
    hay(st, S, 0.05, 0.05, 0.08);
    sign(g, S, -0.2, 0.52, d / 2);
  },
  shop(S, g, r) {
    const w = 0.62, d = 0.62, h1 = 0.52, h2 = 0.44;
    storeyBlock(S, g, w, d, 0, h1, S.m.lower, false);
    doorOn(g, S, { side: 'z', wallW: w, wallD: d }, -0.16, 0.17, 0.36, false);
    windowOn(g, S, { side: 'z', wallW: w, wallD: d }, 0.12, 0.26, 0.2, 0.14);
    windowOn(g, S, { side: 'x', wallW: w, wallD: d }, 0, 0.3, 0.16, 0.14);
    storeyBlock(S, g, w + S.jetty * 2, d + S.jetty * 2, h1, h2, S.thatch ? S.m.lower : S.m.upper, true, { timber: true });
    roofOver(S, g, w + S.jetty * 2, d + S.jetty * 2, h1 + h2, S.roofRise, false);
    // striped awning + stall counter with goods
    const aw = box(0.36, 0.02, 0.2, S.m.banner, 0.1, 0.44, d / 2 + 0.1, g); aw.rotation.x = 0.35;
    box(0.34, 0.12, 0.12, S.m.wood, 0.1, 0, d / 2 + 0.1, g);
    for (let i = 0; i < 4; i++) box(0.05, 0.04, 0.05, i % 2 ? S.m.hay : S.m.banner, -0.02 + i * 0.08, 0.12, d / 2 + 0.1, g);
    barrel(g, S, 0.38, 0.3); chimney(g, S, -0.2, -0.2, h1 + h2, 0.35);
    // a general store: crates and sacks stacked by the stall, a hanging sign (the forge is the smithy's now)
    crate(g, S, 0.12, 0.1, 0.12, w / 2 + 0.1, 0.18); crate(g, S, 0.1, 0.08, 0.1, w / 2 + 0.12, 0.05, true); sackMesh(g, S, w / 2 + 0.2, 0.3);
    sign(g, S, -0.2, 0.46, d / 2);
  },
  // A stone church that reads as one at a glance (critic pass 2: the old box-with-a-spike read
  // as a barn): the bell tower stands at the FRONT-left corner where the camera sees it, a tall
  // arched door with steps under a lit rose window, lit lancets between buttresses along the
  // side, a steep roof, and a lantern either side of the door. Dressed stone in every region.
  temple(S, g, r) {
    const w = 0.72, d = 1.25, h = S.gothic ? 0.98 : 0.86, stone = S.m.ashlar;
    const fz = { side: 'z', wallW: w, wallD: d }, fx = { side: 'x', wallW: w, wallD: d };
    box(w, h, d, stone, 0, 0, 0, g); box(w + 0.06, 0.06, d + 0.06, S.m.stoneDark, 0, 0, 0, g);      // nave on a plinth
    // west front: steps, a tall arched door, the rose window, corner buttresses
    box(0.38, 0.035, 0.14, S.m.stoneDark, 0.06, 0, d / 2 + 0.07, g); box(0.32, 0.035, 0.08, S.m.stoneDark, 0.06, 0.035, d / 2 + 0.04, g);
    doorOn(g, S, fz, 0.06, 0.26, 0.5, true);
    const rim = new THREE.Mesh(new THREE.CylinderGeometry(0.115, 0.115, 0.02, 14), S.m.trim); rim.rotation.x = Math.PI / 2; rim.position.set(0.06, h * 0.8, d / 2 + 0.006); g.add(rim);
    const rose = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.02, 14), S.m.glass); rose.userData.glow = true; rose.rotation.x = Math.PI / 2; rose.position.set(0.06, h * 0.8, d / 2 + 0.014); g.add(rose);
    for (const k of [0, 1, 2]) { const bar = box(0.012, 0.18, 0.01, S.m.trim, 0.06, h * 0.8 - 0.09, d / 2 + 0.024, g); bar.rotation.z = (k * Math.PI) / 3; }
    box(0.08, h * 0.85, 0.08, stone, w / 2 - 0.02, 0, d / 2 + 0.02, g);
    // the long side: three lit lancets between four buttresses
    for (let i = 0; i < 3; i++) windowOn(g, S, fx, -d / 2 + (d * (i + 0.5)) / 3, h * 0.5, 0.09, 0.34, { pointed: true, lit: true });
    for (let i = 0; i <= 3; i++) box(0.09, h * 0.8, 0.08, stone, w / 2 + 0.045, 0, -d / 2 + (d * i) / 3, g);
    const back = new THREE.Group(); back.rotation.y = Math.PI; g.add(back);
    for (let i = 0; i < 3; i++) windowOn(back, S, fx, -d / 2 + (d * (i + 0.5)) / 3, h * 0.5, 0.09, 0.34, { pointed: true, lit: true });
    roofOver(S, g, w, d, h, S.roofRise * 1.2, false);
    // bell tower at the front-left: tall, a lit lancet low, an open belfry, spire and cross
    const tw = 0.34, th = h + 0.6, t = new THREE.Group(); t.position.set(-w / 2 - tw / 2 + 0.08, 0, d / 2 - tw / 2 + 0.02); g.add(t);
    box(tw, th, tw, stone, 0, 0, 0, t); box(tw + 0.05, 0.05, tw + 0.05, S.m.stoneDark, 0, th - 0.34, 0, t);
    const tz = { side: 'z', wallW: tw, wallD: tw }, tx = { side: 'x', wallW: tw, wallD: tw };
    windowOn(t, S, tz, 0, h * 0.45, 0.08, 0.2, { pointed: true, lit: true });
    for (const f of [tz, tx]) windowOn(t, S, f, 0, th - 0.17, 0.12, 0.2, { pointed: true, lit: false });   // the open belfry
    pyramid(t, tw + 0.02, th, S.gothic ? 0.9 : 0.66, S.m.roof, 8, 0.04);
    const cr = new THREE.Group(); cr.position.set(0, th + (S.gothic ? 0.9 : 0.66) + 0.01, 0); t.add(cr);
    box(0.02, 0.16, 0.02, S.m.trim, 0, 0, 0, cr); box(0.09, 0.02, 0.02, S.m.trim, 0, 0.1, 0, cr);
    lantern(g, S, -0.16, 0.36, d / 2 + 0.05); lantern(g, S, 0.28, 0.36, d / 2 + 0.05);
  },
  // The blacksmith: an open-fronted stone forge under a heavy gable — glowing hearth under a
  // hood and a tall chimney at the back, an anvil on a stump, a quench trough, a rack of
  // blades outside and a hanging sign — so it reads as the smith from across the square.
  smith(S, g, r) {
    const w = 0.78, d = 0.6, h = 0.46, stone = S.m.stone;
    box(w, h, 0.08, stone, 0, 0, -d / 2 + 0.04, g);                         // back wall
    box(0.08, h, d, stone, -w / 2 + 0.04, 0, 0, g);                         // left wall
    box(0.08, h * 0.5, d * 0.55, stone, w / 2 - 0.04, 0, -d * 0.2, g);       // low right wall
    for (const [x, z] of [[w / 2 - 0.03, d / 2 - 0.03], [-w / 2 + 0.03, d / 2 - 0.03], [w / 2 - 0.03, -0.02]]) box(0.06, h, 0.06, S.m.beam, x, 0, z, g);
    box(w, 0.05, 0.06, S.m.beam, 0, h - 0.05, d / 2 - 0.03, g);             // lintel
    roofOver(S, g, w + 0.12, d + 0.12, h, S.roofRise * 0.85);
    box(0.28, 0.17, 0.26, stone, -0.2, 0, -0.06, g);                         // hearth, near the open front
    const coals = box(0.22, 0.025, 0.2, S.m.glass, -0.2, 0.17, -0.06, g); coals.userData.glow = true;
    const mouth = box(0.16, 0.08, 0.012, S.m.glass, -0.2, 0.04, 0.075, g); mouth.userData.glow = true;   // the fire's mouth, facing the square
    box(0.24, 0.14, 0.16, stone, -0.2, 0.3, -0.16, g);                       // hood
    chimney(g, S, -0.2, -0.2, h, 0.62);
    box(0.06, 0.09, 0.06, S.m.wood, 0.12, 0, 0.1, g); box(0.14, 0.05, 0.06, S.m.dark, 0.12, 0.09, 0.1, g); box(0.05, 0.03, 0.04, S.m.dark, 0.2, 0.1, 0.1, g);   // anvil on a stump
    box(0.22, 0.08, 0.09, S.m.wood, 0.2, 0, -0.16, g); box(0.19, 0.012, 0.06, mat(null, '#1d3040'), 0.2, 0.08, -0.16, g);                                      // quench trough
    const rack = new THREE.Group(); rack.position.set(w / 2 + 0.12, 0, 0.12); g.add(rack);                                                                   // a rack of blades outside
    for (const z of [-0.12, 0.12]) box(0.025, 0.3, 0.025, S.m.beam, 0, 0, z, rack);
    box(0.025, 0.025, 0.28, S.m.beam, 0, 0.26, 0, rack);
    for (let i = 0; i < 4; i++) box(0.012, 0.22, 0.03, S.m.trim, 0.02, 0.04, -0.09 + i * 0.06, rack);
    sign(g, S, w / 2 - 0.05, 0.4, d / 2);
  },
  keep(S, g, r) {
    if (S.thatch) {                                     // motte-and-bailey: timber tower on an earth mound inside a palisade
      const mound = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.85, 0.3, 10), mat(tex('rubble', '#5a5040', 9))); mound.position.y = 0.15; g.add(mound);
      const t = new THREE.Group(); t.position.y = 0.3; g.add(t);
      box(0.6, 0.9, 0.6, S.m.palisade, 0, 0, 0, t); box(0.72, 0.2, 0.72, S.m.wood, 0, 0.9, 0, t);
      windowOn(t, S, { side: 'z', wallW: 0.72, wallD: 0.72 }, 0, 1.0, 0.1, 0.08); windowOn(t, S, { side: 'x', wallW: 0.72, wallD: 0.72 }, 0, 1.0, 0.1, 0.08);
      pyramid(t, 0.72, 1.1, 0.5, S.m.roof);
      for (let a = 0; a < 18; a++) { const ang = (a / 18) * Math.PI * 2; if (a === 2) continue; box(0.07, 0.36, 0.07, S.m.palisade, Math.cos(ang) * 0.95, 0, Math.sin(ang) * 0.95, g).rotation.y = -ang; }
      banner(g, S, 0.05, 1.95, 0.0);
      return;
    }
    const w = 0.95, h = S.gothic ? 1.9 : 1.6;
    box(w, h, w, S.m.stone, 0, 0, 0, g); box(w + 0.08, 0.06, w + 0.08, S.m.stoneDark, 0, h, 0, g);
    crenels(g, S, w + 0.06, w + 0.06, h + 0.06, S.m.stone, 0.08);
    const fz = { side: 'z', wallW: w, wallD: w }, fx = { side: 'x', wallW: w, wallD: w };
    doorOn(g, S, fz, 0, 0.24, 0.44, true);
    for (const y of [0.75, 1.2]) for (const u of [-0.25, 0.25]) { windowOn(g, S, fz, u, y, 0.07, 0.14, { pointed: S.gothic }); windowOn(g, S, fx, u, y, 0.07, 0.14, { pointed: S.gothic }); }
    for (const [x, z] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {               // corner turrets
      const tr = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.15, h + 0.3, 10), S.m.stone); tr.position.set(x * w / 2, (h + 0.3) / 2, z * w / 2); g.add(tr);
      pyramid(g, 0.3, h + 0.3, S.gothic ? 0.6 : 0.4, S.m.roof, 10, 0.02).position.set(x * w / 2, h + 0.3 + (S.gothic ? 0.3 : 0.2), z * w / 2);
    }
    banner(g, S, 0.2, h - 0.1, w / 2 + 0.02); banner(g, S, w / 2 + 0.02, h - 0.1, -0.2, 'x');
    if (S.gothic) buttresses(S, g, w, w, h * 0.7);
  },
  wall(S, g, r) {                                        // a curtain-wall run with a gatehouse
    const L = 2.2, t = 0.2, h = S.thatch ? 0.5 : 0.62;
    if (S.thatch) {
      for (let i = 0; i < 26; i++) { const x = -L / 2 + (L * i) / 25; if (Math.abs(x) < 0.2) continue; box(0.075, h + (i % 3) * 0.02, 0.075, S.m.palisade, x, 0, 0, g); const tip = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.08, 4), S.m.wood); tip.position.set(x, h + 0.04 + (i % 3) * 0.02, 0); g.add(tip); }
      for (const sx of [-1, 1]) { box(0.08, 0.9, 0.08, S.m.wood, sx * 0.22, 0, 0.05, g); }
      box(0.56, 0.08, 0.3, S.m.wood, 0, 0.82, 0.05, g); box(0.5, 0.2, 0.26, S.m.palisade, 0, 0.9, 0.05, g); pyramid(g, 0.5, 1.1, 0.22, S.m.roof);
      return;
    }
    for (const sx of [-1, 1]) { box(L / 2 - 0.3, h, t, S.m.stone, sx * (L / 4 + 0.15), 0, 0, g); crenels(g, S, L / 2 - 0.3, 0.001, h, S.m.stone, 0.07); }
    g.children.slice(-0).forEach(() => {});
    // gatehouse: two towers and an arch
    const gh = new THREE.Group(); g.add(gh);
    for (const sx of [-1, 1]) { box(0.26, h + 0.35, 0.34, S.m.stone, sx * 0.26, 0, 0.02, gh); crenels(gh, S, 0.001, 0.001, 0, S.m.stone); }
    box(0.78, 0.2, 0.34, S.m.stone, 0, h + 0.15, 0.02, gh); crenels(gh, S, 0.78, 0.34, h + 0.35, S.m.stone, 0.07);
    const door = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.45, 0.04), S.m.door); door.position.set(0, 0.225, 0.19); gh.add(door);
    if (S.gothic) for (const sx of [-1, 1]) pyramid(gh, 0.26, h + 0.35, 0.5, S.m.roof, 4, 0.03).position.set(sx * 0.26, h + 0.6, 0.02);
    banner(gh, S, 0, h + 0.3, 0.2);
    windowOn(gh, S, { side: 'z', wallW: 0.78, wallD: 0.34 }, -0.26, h + 0.1, 0.06, 0.1, { pointed: S.gothic }); windowOn(gh, S, { side: 'z', wallW: 0.78, wallD: 0.34 }, 0.26, h + 0.1, 0.06, 0.1, { pointed: S.gothic });
  },
  well(S, g, r) {                                        // the square's well: stone ring, posts, little roof, bucket
    const ring = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.18, 0.16, 10), S.m.stone); ring.position.y = 0.08; g.add(ring);
    const water = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.13, 0.01, 10), mat(null, '#1d3040')); water.position.y = 0.155; g.add(water);
    for (const sx of [-1, 1]) box(0.03, 0.36, 0.03, S.m.beam, sx * 0.15, 0.1, 0, g);
    box(0.34, 0.025, 0.025, S.m.beam, 0, 0.42, 0, g);
    const rf = new THREE.Group(); rf.position.y = 0.46; g.add(rf); gable(rf, 0.36, 0.3, 0, 0.12, S.m.roof, S.m.wood, 0.03, 0.02);
    box(0.06, 0.06, 0.06, S.m.wood, 0.05, 0.25, 0, g);
  },
  farm(S, g, r) {                                        // farmhouse + barn + hay + fenced yard
    const barn = new THREE.Group(); barn.position.set(-0.25, 0, -0.2); g.add(barn);
    box(0.95, 0.5, 0.6, S.gothic ? S.m.stone : S.m.wood, 0, 0, 0, barn); roofOver(S, barn, 0.95, 0.6, 0.5, S.roofRise * 0.9);
    const bd = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.36, 0.03), S.m.door); bd.position.set(0.05, 0.18, 0.31); barn.add(bd);
    const fh = new THREE.Group(); fh.position.set(0.55, 0, 0.3); g.add(fh);
    storeyBlock(S, fh, 0.45, 0.42, 0, 0.44, S.m.lower, true, { doorZ: -0.08 }); doorOn(fh, S, { side: 'z', wallW: 0.45, wallD: 0.42 }, -0.08, 0.14, 0.3, false);
    roofOver(S, fh, 0.45, 0.42, 0.44, S.roofRise, false); chimney(fh, S, 0.12, -0.05, 0.44, 0.3);
    hay(g, S, -0.72, 0.35); hay(g, S, -0.5, 0.48, 0.08); hay(g, S, 0.9, -0.3, 0.07);
    fenceRun(g, S, -0.95, 0.75, 0.25, 0.75); fenceRun(g, S, -0.95, 0.75, -0.95, -0.2);
    barrel(g, S, 0.2, 0.55);
  },
};
// ── trees (our own, to replace the stock cones): pine, broadleaf, dead, groves ──
const flat = (color) => new THREE.MeshStandardMaterial({ color: new THREE.Color(color), flatShading: true });
const jitter = (geo, r, amt) => { const p = geo.attributes.position; for (let i = 0; i < p.count; i++) p.setXYZ(i, p.getX(i) + (r() - 0.5) * amt, p.getY(i) + (r() - 0.5) * amt * 0.6, p.getZ(i) + (r() - 0.5) * amt); geo.computeVertexNormals(); return geo; };
const TREE_COL = { pine: ['#1f2b22', '#243226', '#2a392b'], leaf: ['#3a4527', '#42502c', '#4b5530'], autumn: ['#6a4f25', '#76582a', '#5e3f21'], bark: '#3a2c22', dead: '#4a4038' };
// Foliage (critic pass 2: faceted gem-like crowns clashed with the buildings): closed,
// softly-shaded masses. Geometry is vertex-merged BEFORE jittering so faces never crack
// apart, shaded smooth, and vertex-coloured from a dark self-shadowed underside to a lighter
// crown top, with a little per-vertex variation — foliage mass, not cut stone.
const foliageMat = new THREE.MeshStandardMaterial({ vertexColors: true, flatShading: false, roughness: 1 });
function foliage(geo, r, amt, base, top = 1.35, bottom = 0.55) {
  const g0 = geo.clone(); g0.deleteAttribute('normal'); g0.deleteAttribute('uv');       // weld on position alone (seams too)
  const m = mergeVertices(g0), p = m.attributes.position;
  let y0 = 1e9, y1 = -1e9; for (let i = 0; i < p.count; i++) { y0 = Math.min(y0, p.getY(i)); y1 = Math.max(y1, p.getY(i)); }
  const col = new Float32Array(p.count * 3), c = new THREE.Color(base);
  for (let i = 0; i < p.count; i++) {
    p.setXYZ(i, p.getX(i) + (r() - 0.5) * amt, p.getY(i) + (r() - 0.5) * amt * 0.6, p.getZ(i) + (r() - 0.5) * amt);
    const t = (p.getY(i) - y0) / Math.max(1e-6, y1 - y0), k = (bottom + (top - bottom) * Math.pow(t, 0.8)) * (0.92 + r() * 0.16);
    col[i * 3] = c.r * k; col[i * 3 + 1] = c.g * k; col[i * 3 + 2] = c.b * k;
  }
  m.setAttribute('color', new THREE.BufferAttribute(col, 3)); m.computeVertexNormals();
  return m;
}
function pine(g, r, x, z, sc = 1) {
  const t = new THREE.Group(); t.position.set(x, 0, z); t.scale.setScalar(sc); g.add(t);
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.045, 0.34, 6), flat(TREE_COL.bark)); trunk.position.y = 0.17; t.add(trunk);
  const tiers = 5, col = TREE_COL.pine[(r() * 3) | 0];
  for (let i = 0; i < tiers; i++) {                        // drooping boughs, each a little narrower, overlapping
    const rad = 0.29 * (1 - i / (tiers + 0.8)), h = 0.3 * (1 - i * 0.08);
    const c = new THREE.Mesh(foliage(new THREE.ConeGeometry(rad, h, 11, 2), r, 0.035, col, 1.55, 0.62), foliageMat);
    c.position.y = 0.2 + i * 0.16 + h / 2; c.rotation.y = r() * 3; t.add(c);
  }
}
function broadleaf(g, r, x, z, sc = 1, autumn = false) {
  const t = new THREE.Group(); t.position.set(x, 0, z); t.scale.setScalar(sc); g.add(t);
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.034, 0.064, 0.44, 7), flat(TREE_COL.bark)); trunk.position.y = 0.22; t.add(trunk);
  for (const a of [0.6, 2.7, 4.6]) { const b = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.024, 0.2, 5), flat(TREE_COL.bark)); b.position.set(Math.cos(a) * 0.05, 0.44, Math.sin(a) * 0.05); b.rotation.set(Math.sin(a) * 0.7, 0, -Math.cos(a) * 0.7); t.add(b); }
  const pal = autumn ? TREE_COL.autumn : TREE_COL.leaf, n = 7 + ((r() * 4) | 0);
  for (let i = 0; i < n; i++) {                            // a cloud of rounded clumps: big core, smaller lobes around and on top
    const a = (i / n) * Math.PI * 2 + r(), rr = i === 0 ? 0 : 0.17 + r() * 0.1, size = i === 0 ? 0.3 : 0.15 + r() * 0.09;   // a broad crown, not a lollipop
    const b = new THREE.Mesh(foliage(new THREE.IcosahedronGeometry(size, 1), r, size * 0.22, pal[(r() * 3) | 0]), foliageMat);
    b.position.set(Math.cos(a) * rr, 0.6 + (i === 0 ? 0.1 : r() * 0.18 - 0.06), Math.sin(a) * rr); t.add(b);
  }
}
function deadTree(g, r, x, z, sc = 1) {
  const t = new THREE.Group(); t.position.set(x, 0, z); t.scale.setScalar(sc); g.add(t);
  const m = flat(TREE_COL.dead), trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.05, 0.8, 5), m); trunk.position.y = 0.4; trunk.rotation.z = (r() - 0.5) * 0.15; t.add(trunk);
  for (let i = 0; i < 5; i++) { const b = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.018, 0.3, 4), m); const y = 0.35 + i * 0.09, a = r() * 6.28;
    b.position.set(Math.cos(a) * 0.1, y + 0.1, Math.sin(a) * 0.1); b.rotation.set(Math.sin(a) * 0.9, 0, -Math.cos(a) * 0.9); t.add(b); }
}
const TREES = {
  pine: (g, r) => pine(g, r, 0, 0, 1.25 + r() * 0.35),
  oak: (g, r) => broadleaf(g, r, 0, 0, 1.15 + r() * 0.3),
  autumn: (g, r) => broadleaf(g, r, 0, 0, 1.1 + r() * 0.3, true),
  dead: (g, r) => deadTree(g, r, 0, 0, 1.2 + r() * 0.2),
  grove: (g, r) => {                                  // a clump of 5–8 mixed trees
    const n = 5 + ((r() * 4) | 0);
    for (let i = 0; i < n; i++) { const a = r() * 6.28, d = Math.sqrt(r()) * 0.62, x = Math.cos(a) * d, z = Math.sin(a) * d, k = r();
      if (k < 0.6) pine(g, r, x, z, 0.95 + r() * 0.45); else if (k < 0.9) broadleaf(g, r, x, z, 0.9 + r() * 0.35, r() < 0.3); else deadTree(g, r, x, z, 1); }
  },
};
export function makeTree(kind, seed = 1) { const g = new THREE.Group(); TREES[kind](g, rng(seed * 101 + kind.length)); return g; }

// ── nature & civil works (our own, replacing the stock bridge / rocks / mountains) ──
// Rocks and mountains are faceted low-poly masses with per-face colour: moss or grass on
// up-facing faces, lighter rock on crags, scree toward the base, snow on high peaks.
const C3 = (h) => new THREE.Color(h);
function faceted(geo, r, jit, colorFn) {
  const g = geo.index ? geo.toNonIndexed() : geo, p = g.attributes.position;
  // jitter shared positions consistently (hash the rounded coordinate) so faces stay closed
  const key = (x, y, z) => `${x.toFixed(3)},${y.toFixed(3)},${z.toFixed(3)}`, moved = new Map();
  for (let i = 0; i < p.count; i++) {
    const k = key(p.getX(i), p.getY(i), p.getZ(i));
    if (!moved.has(k)) moved.set(k, [(r() - 0.5) * jit, (r() - 0.5) * jit * 0.7, (r() - 0.5) * jit]);
    const d = moved.get(k); p.setXYZ(i, p.getX(i) + d[0], p.getY(i) + d[1], p.getZ(i) + d[2]);
  }
  g.computeVertexNormals();
  const col = new Float32Array(p.count * 3), n = g.attributes.normal;
  for (let f = 0; f < p.count; f += 3) {
    const ny = (n.getY(f) + n.getY(f + 1) + n.getY(f + 2)) / 3, y = (p.getY(f) + p.getY(f + 1) + p.getY(f + 2)) / 3;
    const c = colorFn(ny, y, r());
    for (let v = 0; v < 3; v++) { col[(f + v) * 3] = c.r; col[(f + v) * 3 + 1] = c.g; col[(f + v) * 3 + 2] = c.b; }
  }
  g.setAttribute('color', new THREE.BufferAttribute(col, 3));
  return g;
}
const vmat = () => new THREE.MeshStandardMaterial({ vertexColors: true, flatShading: true });
// rocks: warm dark field-stone (pale neutral grey read lilac under the violet dusk), more moss on top
const ROCK = { base: C3('#5b564b'), dark: C3('#433f37'), light: C3('#6f685a'), moss: C3('#4a5233'), grass: C3('#46502f'), snow: C3('#d4d6da'), scree: C3('#524d44') };
const tint = (c, k) => c.clone().multiplyScalar(k);

function rockMesh(r, size, flatten = 0.6) {
  const geo = faceted(new THREE.DodecahedronGeometry(size, 0), r, size * 0.35, (ny, y, q) =>
    ny > 0.6 && q < 0.8 ? tint(ROCK.moss, 0.9 + q * 0.2) : ny > 0.3 ? tint(ROCK.light, 0.9 + q * 0.15) : tint(ROCK.base, 0.85 + q * 0.2));
  const m = new THREE.Mesh(geo, vmat()); m.scale.y = flatten; m.position.y = size * flatten * 0.55; return m;
}
function mountainMesh(r, { h = 2.0, w = 0.9, peaks = 3, snow = true, grass = false }) {
  const g = new THREE.Group();
  const colorFn = (ny, y, q) => {
    if (snow && y > h * 0.58 && ny > 0.05) return tint(ROCK.snow, 0.9 + q * 0.12);
    if (snow && y > h * 0.5 && ny > 0.45) return tint(ROCK.snow, 0.8 + q * 0.1);
    if (grass && y < h * 0.34 && ny > 0.4) return tint(ROCK.grass, 0.85 + q * 0.25);
    if (y < h * 0.1) return tint(ROCK.scree, 0.85 + q * 0.2);
    return ny > 0.35 ? tint(ROCK.light, 0.85 + q * 0.2) : tint(ROCK.base, 0.78 + q * 0.25);
  };
  const crag = (x, z, rad, ht, seg = 7) => {
    const geo = new THREE.ConeGeometry(rad, ht, seg, 3); geo.translate(0, ht / 2, 0);
    const m = new THREE.Mesh(faceted(geo, r, rad * 0.32, colorFn), vmat()); m.position.set(x, 0, z); m.rotation.y = r() * 6; g.add(m);
  };
  // a low broad skirt, then a ring of shoulder crags around one main peak
  crag(0, 0, w, h * 0.34, 10);
  crag((r() - 0.5) * 0.1, (r() - 0.5) * 0.1, w * 0.62, h, 8);
  for (let i = 0; i < peaks; i++) { const a = (i / peaks) * 6.28 + r(), d = w * (0.38 + r() * 0.2); crag(Math.cos(a) * d, Math.sin(a) * d, w * (0.42 + r() * 0.12), h * (0.5 + r() * 0.22)); }
  for (let i = 0; i < 5; i++) { const a = r() * 6.28, rr = w * (0.8 + r() * 0.25); const k = rockMesh(r, 0.12 + r() * 0.1, 0.7); k.position.x = Math.cos(a) * rr; k.position.z = Math.sin(a) * rr; g.add(k); }
  if (grass) for (let i = 0; i < 10; i++) { const a = r() * 6.28, rr = w * (0.62 + r() * 0.35); pine(g, r, Math.cos(a) * rr, Math.sin(a) * rr, 0.75 + r() * 0.4); }
  return g;
}
// Stone bridge: one humped arch, parapets, cutwaters, spanning 1.9 units along z.
function bridgeMesh(r) {
  const g = new THREE.Group(), L = 0.95, W = 0.62, stone = mat(tex('ashlar', '#6a655c', 11)), deck = mat(tex('field', '#5e584f', 12));
  stone.map = stone.map.clone(); stone.map.repeat.set(2, 2); stone.map.needsUpdate = true;
  const prof = new THREE.Shape();                                           // side profile in (z, y), arch cut out
  const CTRL = 0.5, top = (t) => 0.07 + 2 * t * (1 - t) * (CTRL - 0.07);   // deck hump (crown ≈ 0.285)
  prof.moveTo(-L, 0); prof.lineTo(-L, 0.07); prof.quadraticCurveTo(0, CTRL, L, 0.07); prof.lineTo(L, 0); prof.lineTo(0.52, 0);
  prof.absellipse(0, 0, 0.52, 0.17, 0, Math.PI, false); prof.lineTo(-L, 0);          // a flattened arch under the crown
  const body = new THREE.Mesh(new THREE.ExtrudeGeometry(prof, { depth: W, bevelEnabled: false, curveSegments: 12 }), stone);
  body.rotation.y = -Math.PI / 2; body.position.x = W / 2; g.add(body);
  const para = new THREE.Shape();                                            // parapet: a band following the hump
  const N = 16; for (let i = 0; i <= N; i++) { const z = -L + (2 * L * i) / N, y = top(i / N) - 0.01; if (i === 0) para.moveTo(z, y); else para.lineTo(z, y); }
  for (let i = N; i >= 0; i--) para.lineTo(-L + (2 * L * i) / N, top(i / N) + 0.08);
  for (const sx of [-1, 1]) { const pm = new THREE.Mesh(new THREE.ExtrudeGeometry(para, { depth: 0.06, bevelEnabled: false }), stone); pm.rotation.y = -Math.PI / 2; pm.position.x = sx * (W / 2 - 0.03) + 0.03; g.add(pm); }
  for (const sz of [-1, 1]) for (const sx of [-1, 1]) box(0.08, 0.2, 0.08, stone, sx * (W / 2 + 0.01), 0, sz * (L - 0.02), g);   // end posts
  return g;
}
const NATURE = {
  bridge: (r) => bridgeMesh(r),
  rock: (r, v) => { const g = new THREE.Group(), n = [1, 1, 2, 3, 2][v % 5], big = [0.2, 0.14, 0.24, 0.18, 0.32][v % 5];
    for (let i = 0; i < n; i++) { const m = rockMesh(r, big * (i ? 0.55 + r() * 0.3 : 1), 0.55 + r() * 0.25); m.position.x = i ? (r() - 0.5) * big * 2.2 : 0; m.position.z = i ? (r() - 0.5) * big * 2.2 : 0; m.rotation.y = r() * 6; g.add(m); }
    return g; },
  mountain: (r, v) => mountainMesh(r, [
    { h: 1.5, w: 0.95, peaks: 3, snow: false, grass: true },
    { h: 1.9, w: 0.95, peaks: 3, snow: true, grass: true },
    { h: 1.4, w: 1.0, peaks: 4, snow: false, grass: true },
    { h: 1.8, w: 0.92, peaks: 3, snow: true, grass: false },
    { h: 2.1, w: 0.95, peaks: 4, snow: true, grass: false },
  ][v % 5]),
};
export function makeNature(kind, seed = 1, variant = 0) { return NATURE[kind](rng(seed * 131 + kind.length), variant); }

// ── overland sites (our own, replacing the stock ruin / mine / lumber mill) ─────
function lantern(g, S, x, y, z) {
  box(0.02, 0.22, 0.02, S.m.beam, x, y - 0.22, z, g);
  const l = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.06, 0.05), S.m.glass); l.userData.glow = true; l.position.set(x, y + 0.02, z); g.add(l);
  box(0.07, 0.015, 0.07, S.m.trim, x, y + 0.05, z, g);
}
function standingStone(g, r, x, z, h, lean = 0) {
  const geo = faceted(new THREE.BoxGeometry(0.1, h, 0.07, 1, 2, 1), r, 0.03, (ny, y, q) => (ny > 0.6 ? tint(ROCK.moss, 0.9 + q * 0.2) : tint(ROCK.base, 0.8 + q * 0.25)));
  geo.translate(0, h / 2, 0);
  const m = new THREE.Mesh(geo, vmat()); m.position.set(x, 0, z); m.rotation.set(lean, r() * 3, lean * 0.5); g.add(m); return m;
}
Object.assign(TYPES, {
  // The Old Barrows: an earthen burial mound with a stone doorway, standing stones, a tumbled wall
  barrow(S, g, r) {
    const moundGeo = new THREE.SphereGeometry(0.62, 12, 6, 0, Math.PI * 2, 0, Math.PI / 2); moundGeo.scale(1.15, 0.62, 1);
    const mound = new THREE.Mesh(faceted(moundGeo, r, 0.06, (ny, y, q) => (ny > 0.35 ? tint(ROCK.grass, 0.8 + q * 0.3) : tint(C3('#4a4034'), 0.85 + q * 0.2))), vmat());
    mound.position.set(-0.1, 0, -0.12); g.add(mound);
    // entrance passage on the camera side: dark mouth, uprights, lintel, kerb stones
    const dark = mat(null, '#0c0a10'); box(0.22, 0.26, 0.3, dark, 0.12, 0, 0.36, g);
    for (const sx of [-1, 1]) box(0.09, 0.32, 0.36, S.m.stone, 0.12 + sx * 0.155, 0, 0.36, g);
    box(0.44, 0.08, 0.42, S.m.stone, 0.12, 0.32, 0.36, g);
    for (let i = 0; i < 6; i++) { const a = -0.6 + i * 0.28; const k = rockMesh(r, 0.07 + r() * 0.03, 0.6); k.position.set(0.12 + Math.cos(a + 1.2) * 0.62, 0, 0.3 + Math.sin(a + 1.2) * 0.24); g.add(k); }
    // a ring of leaning stones, a tumbled wall, a dead tree
    for (const [x, z, h, l] of [[-0.85, 0.35, 0.34, 0.12], [-0.72, 0.62, 0.26, -0.2], [0.7, -0.5, 0.38, 0.06], [0.85, 0.2, 0.22, 0.3], [-0.3, -0.85, 0.3, -0.1]]) standingStone(g, r, x, z, h, l);
    for (let i = 0; i < 4; i++) box(0.14, 0.07 + (i % 2) * 0.05, 0.1, S.m.stone, 0.45 + i * 0.12, 0, 0.55 - i * 0.05, g).rotation.y = 0.2 * i;
    deadTree(g, r, -0.6, -0.4, 1.0);
  },
  // Deepdelve Mine: a rock outcrop with a timbered adit, rails and an ore cart, spoil heap, winch frame, lanterns
  mine(S, g, r) {
    const out = new THREE.Group(); out.position.set(-0.2, 0, -0.25); g.add(out);
    const oc = (ny, y, q) => (ny > 0.6 && y < 0.35 ? tint(ROCK.grass, 0.8 + q * 0.3) : ny > 0.35 ? tint(ROCK.light, 0.85 + q * 0.2) : tint(ROCK.base, 0.8 + q * 0.25));
    const crag = (x, z, rad, ht, seg) => { const geo = new THREE.ConeGeometry(rad, ht, seg, 3); geo.translate(0, ht / 2, 0); const m = new THREE.Mesh(faceted(geo, r, rad * 0.3, oc), vmat()); m.position.set(x, 0, z); m.rotation.y = r() * 6; out.add(m); };
    crag(0, 0, 0.85, 0.42, 10);                                                   // a broad low outcrop…
    crag(-0.25, -0.2, 0.5, 0.78, 7); crag(0.22, -0.28, 0.42, 0.62, 7); crag(-0.05, 0.1, 0.4, 0.55, 7);   // …with a few blunt crags
    for (let i = 0; i < 3; i++) { const a = r() * 6.28; const k = rockMesh(r, 0.18 + r() * 0.1, 0.8); k.position.set(Math.cos(a) * 0.6 - 0.2, 0, Math.sin(a) * 0.5 - 0.25); g.add(k); }
    // adit on the +z face: dark mouth framed with timber, a little plank roof
    const ad = new THREE.Group(); ad.position.set(0.05, 0, 0.35); g.add(ad);
    box(0.34, 0.36, 0.3, mat(null, '#0b0a0e'), 0, 0, -0.05, ad);
    for (const sx of [-1, 1]) box(0.05, 0.4, 0.05, S.m.beam, sx * 0.19, 0, 0.08, ad);
    box(0.46, 0.06, 0.07, S.m.beam, 0, 0.4, 0.08, ad);
    const rf = box(0.52, 0.03, 0.22, S.m.wood, 0, 0.47, 0.05, ad); rf.rotation.x = 0.35;
    lantern(ad, S, -0.24, 0.36, 0.14);
    // rails running out of the adit with sleepers, an ore cart on them
    for (let i = 0; i < 7; i++) box(0.22, 0.015, 0.035, S.m.wood, 0.05, 0, 0.5 + i * 0.09, g);
    for (const sx of [-1, 1]) box(0.015, 0.02, 0.66, S.m.trim, 0.05 + sx * 0.07, 0.015, 0.78, g);
    const cart = new THREE.Group(); cart.position.set(0.05, 0.02, 0.86); g.add(cart);
    box(0.18, 0.1, 0.22, S.m.wood, 0, 0.03, 0, cart); for (const [x, z] of [[-0.08, -0.07], [0.08, -0.07], [-0.08, 0.07], [0.08, 0.07]]) { const w = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.02, 8), S.m.trim); w.rotation.z = Math.PI / 2; w.position.set(x, 0.03, z); cart.add(w); }
    const ore = new THREE.Mesh(faceted(new THREE.DodecahedronGeometry(0.08, 0), r, 0.03, () => tint(C3('#5c5750'), 1)), vmat()); ore.position.y = 0.14; ore.scale.y = 0.6; cart.add(ore);
    // spoil heap and a winch frame on the outcrop's shoulder
    const heap = new THREE.Mesh(faceted(new THREE.ConeGeometry(0.3, 0.12, 8, 2).translate(0, 0.06, 0), r, 0.04, (ny, y, q) => tint(ROCK.scree, 0.62 + q * 0.2)), vmat()); heap.position.set(0.55, 0, 0.5); g.add(heap);
    const wf = new THREE.Group(); wf.position.set(0.5, 0, -0.1); g.add(wf);
    for (const [x, z] of [[-0.12, -0.1], [0.12, -0.1], [-0.12, 0.1], [0.12, 0.1]]) box(0.03, 0.62, 0.03, S.m.beam, x, 0, z, wf);
    box(0.32, 0.04, 0.28, S.m.beam, 0, 0.62, 0, wf);
    const pul = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.03, 10), S.m.wood); pul.rotation.x = Math.PI / 2; pul.position.set(0, 0.7, 0); wf.add(pul);
    box(0.008, 0.45, 0.008, S.m.trim, 0.06, 0.2, 0, wf);
    lantern(g, S, 0.32, 0.46, 0.62);
    barrel(g, S, -0.35, 0.55); barrel(g, S, -0.45, 0.5);
  },
  // Lumber mill: an open saw-shed on posts, saw bench, log and plank stacks, stumps, a cabin
  lumbermill(S, g, r) {
    const shed = new THREE.Group(); shed.position.set(-0.05, 0, -0.1); g.add(shed);
    for (const [x, z] of [[-0.45, -0.3], [0.45, -0.3], [-0.45, 0.3], [0.45, 0.3], [0, -0.3], [0, 0.3]]) box(0.05, 0.55, 0.05, S.m.beam, x, 0, z, shed);
    box(0.95, 0.04, 0.05, S.m.beam, 0, 0.53, 0.3, shed); box(0.95, 0.04, 0.05, S.m.beam, 0, 0.53, -0.3, shed);
    box(0.95, 0.5, 0.03, S.m.wood, 0, 0.05, -0.31, shed);                       // back wall of planks
    roofOver(S, shed, 0.95, 0.62, 0.55, S.roofRise * 0.8);
    // saw bench with a log on it and a big blade
    box(0.55, 0.14, 0.14, S.m.wood, 0, 0, 0.02, shed);
    const lg = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.065, 0.62, 8), mat(null, '#5a4430')); lg.rotation.z = Math.PI / 2; lg.position.set(0, 0.2, 0.02); shed.add(lg);
    const blade = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.01, 16), mat(null, '#8a8a90')); blade.rotation.x = Math.PI / 2; blade.position.set(0.12, 0.2, 0.1); shed.add(blade);
    // log pile (pyramid of cylinders) and plank stacks
    const logs = new THREE.Group(); logs.position.set(0.72, 0, 0.35); g.add(logs);
    const bark = mat(null, '#4a3828');
    for (const [row, n] of [[0, 4], [1, 3], [2, 2]]) for (let i = 0; i < n; i++) { const c = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 0.6, 8), bark); c.rotation.x = Math.PI / 2; c.position.set((i - (n - 1) / 2) * 0.11, 0.055 + row * 0.095, 0); logs.add(c);
      const end = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.005, 8), mat(null, '#9a7a52')); end.rotation.x = Math.PI / 2; end.position.set(c.position.x, c.position.y, 0.302); logs.add(end); }
    for (let i = 0; i < 4; i++) box(0.5, 0.025, 0.12, S.m.wood, -0.72, i * 0.027, 0.42, g);
    for (let i = 0; i < 3; i++) box(0.5, 0.025, 0.12, S.m.wood, -0.72, i * 0.027, 0.56, g);
    // cabin behind, stumps and an axe block in front
    const cab = new THREE.Group(); cab.position.set(-0.75, 0, -0.45); g.add(cab);
    storeyBlock(S, cab, 0.42, 0.38, 0, 0.4, S.m.wood, true, { doorZ: 0.1 }); doorOn(cab, S, { side: 'z', wallW: 0.42, wallD: 0.38 }, 0.1, 0.13, 0.28, false);
    roofOver(S, cab, 0.42, 0.38, 0.4, S.roofRise); chimney(cab, S, -0.1, -0.05, 0.4, 0.28);
    for (const [x, z] of [[0.25, 0.7], [0.5, 0.82], [-0.2, 0.78]]) { const st = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.07, 0.08, 8), bark); st.position.set(x, 0.04, z); g.add(st); const top = new THREE.Mesh(new THREE.CylinderGeometry(0.058, 0.058, 0.005, 8), mat(null, '#9a7a52')); top.position.set(x, 0.083, z); g.add(top); }
    box(0.02, 0.16, 0.02, S.m.beam, 0.5, 0.08, 0.82, g).rotation.z = 0.5;
    lantern(g, S, 0.5, 0.5, 0.36);
  },
});

// ── small props (our own; the last of the stock KayKit pieces) ───────────────
function crate(g, S, w, h, d, x = 0, z = 0, dark = false) {
  const c = new THREE.Group(); c.position.set(x, 0, z); g.add(c);
  box(w, h, d, dark ? S.m.door : S.m.wood, 0, 0, 0, c);
  const e = 0.018, fr = S.m.beam;                                              // edge battens
  for (const [sx, sz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) box(e, h + 0.004, e, fr, sx * (w / 2 - e / 2 + 0.002), 0, sz * (d / 2 - e / 2 + 0.002), c);
  for (const y of [0, h - e]) { box(w + 0.004, e, e, fr, 0, y, d / 2 - e / 2 + 0.002, c); box(e, e, d + 0.004, fr, w / 2 - e / 2 + 0.002, y, 0, c); }
  const br = box(Math.hypot(w, h) * 0.92, e * 0.8, e * 0.6, fr, 0, h / 2 - e / 2, d / 2 + 0.004, c); br.rotation.z = Math.atan2(h, w);   // diagonal brace
  return c;
}
function sackMesh(g, S, x, z, s = 1, rot = 0) {
  const pts = [[0, 0], [0.05, 0.005], [0.062, 0.03], [0.058, 0.07], [0.04, 0.1], [0.018, 0.115], [0.022, 0.13], [0, 0.135]].map(([a, b]) => new THREE.Vector2(a * s, b * s));
  const m = new THREE.Mesh(new THREE.LatheGeometry(pts, 8), mat(tex('plaster', '#8a7858', 21))); m.position.set(x, 0, z); m.rotation.set(0.15, rot, 0); m.scale.set(1, 1, 0.8); g.add(m);
  box(0.03 * s, 0.01 * s, 0.03 * s, S.m.trim, x, 0.105 * s, z, g);                   // the tie
}
Object.assign(TYPES, {
  barrel(S, g) {                                        // bellied staves, two iron hoops, a lid
    const pts = [[0, 0], [0.078, 0], [0.09, 0.05], [0.094, 0.105], [0.09, 0.16], [0.078, 0.21], [0, 0.21]].map(([a, b]) => new THREE.Vector2(a, b));
    const staves = mat(tex('planks', '#5a4430', 22)); staves.map = staves.map.clone(); staves.map.repeat.set(3, 0.5); staves.map.needsUpdate = true;
    g.add(new THREE.Mesh(new THREE.LatheGeometry(pts, 10), staves));
    for (const y of [0.045, 0.165]) { const h = new THREE.Mesh(new THREE.CylinderGeometry(0.093, 0.093, 0.014, 10), S.m.trim); h.position.y = y; g.add(h); }
    const lid = new THREE.Mesh(new THREE.CylinderGeometry(0.076, 0.076, 0.006, 10), S.m.door); lid.position.y = 0.21; g.add(lid);
  },
  crate_A_big(S, g) { crate(g, S, 0.22, 0.21, 0.22); },
  crate_A_small(S, g) { crate(g, S, 0.14, 0.14, 0.14); },
  crate_B_big(S, g) { crate(g, S, 0.22, 0.2, 0.22, 0, 0, true); crate(g, S, 0.13, 0.12, 0.13, 0.02, 0.01).position.y = 0.2; },
  crate_long_A(S, g) {
    crate(g, S, 0.4, 0.14, 0.2, 0, 0, true);
    for (let i = 0; i < 3; i++) { const b = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.38, 5), mat(null, '#7a7a80')); b.rotation.z = Math.PI / 2; b.position.set(0, 0.15, -0.05 + i * 0.05); g.add(b); }   // a bundle of bars on top
  },
  sack(S, g) { sackMesh(g, S, 0, 0, 1); sackMesh(g, S, 0.07, 0.06, 0.8, 1.2); },
  wheelbarrow(S, g) {
    const tray = new THREE.Group(); tray.position.set(0, 0.1, 0.02); tray.rotation.x = -0.08; g.add(tray);
    box(0.22, 0.012, 0.3, S.m.wood, 0, 0, 0, tray);
    for (const sx of [-1, 1]) { const w = box(0.012, 0.09, 0.32, S.m.wood, sx * 0.115, 0, 0, tray); w.rotation.z = sx * 0.25; }
    box(0.24, 0.09, 0.012, S.m.wood, 0, 0, 0.16, tray); box(0.24, 0.09, 0.012, S.m.wood, 0, 0, -0.16, tray).rotation.x = 0.35;
    const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.075, 0.03, 12), S.m.wood); wheel.rotation.z = Math.PI / 2; wheel.position.set(0, 0.075, 0.24); g.add(wheel);
    const tyre = new THREE.Mesh(new THREE.TorusGeometry(0.075, 0.008, 4, 14), S.m.trim); tyre.rotation.y = Math.PI / 2; tyre.position.copy(wheel.position); g.add(tyre);
    for (const sx of [-1, 1]) { const h = box(0.018, 0.018, 0.5, S.m.beam, sx * 0.08, 0.12, -0.02, g); h.rotation.x = -0.12; box(0.018, 0.1, 0.018, S.m.beam, sx * 0.08, 0, -0.14, g); }
    for (let i = 0; i < 3; i++) { const k = rockMesh(rng(40 + i), 0.035, 0.7); k.position.set(-0.05 + i * 0.05, 0.1, 0.02 + (i % 2) * 0.04); g.add(k); }   // a load of stones
  },
  weaponrack(S, g) {
    for (const sx of [-1, 1]) { const l = box(0.018, 0.26, 0.018, S.m.beam, sx * 0.1, 0, 0, g); l.rotation.x = 0.08; }
    box(0.24, 0.018, 0.02, S.m.beam, 0, 0.2, 0.01, g); box(0.24, 0.018, 0.02, S.m.beam, 0, 0.05, 0.03, g);
    const steel = mat(null, '#8c8c94');
    for (const [x, t] of [[-0.06, 'spear'], [0, 'sword'], [0.06, 'spear']]) {
      const shaft = box(0.01, t === 'spear' ? 0.34 : 0.24, 0.01, t === 'spear' ? S.m.wood : steel, x, 0.03, 0.035, g); shaft.rotation.x = -0.12;
      if (t === 'spear') { const tip = new THREE.Mesh(new THREE.ConeGeometry(0.014, 0.05, 4), steel); tip.position.set(x, 0.39, 0.0); g.add(tip); }
      else box(0.06, 0.012, 0.014, S.m.trim, x, 0.08, 0.04, g);
    }
    const sh = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.015, 12), S.m.banner); sh.rotation.x = Math.PI / 2 - 0.2; sh.position.set(0.14, 0.08, 0.06); g.add(sh);
  },
  bucket_water(S, g) {
    const b = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.05, 0.1, 10, 1, true), mat(tex('planks', '#5a4430', 23))); b.position.y = 0.05; b.material.side = THREE.DoubleSide; g.add(b);
    const w = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.005, 10), mat(null, '#23384a')); w.position.y = 0.085; g.add(w);
    const bot = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.006, 10), S.m.wood); bot.position.y = 0.003; g.add(bot);
    const hdl = new THREE.Mesh(new THREE.TorusGeometry(0.06, 0.005, 4, 12, Math.PI), S.m.trim); hdl.position.y = 0.1; g.add(hdl);
  },
  resource_lumber(S, g) {                               // a stacked log pile
    const bark = mat(null, '#4a3828'), end = mat(null, '#9a7a52');
    for (const [row, n] of [[0, 4], [1, 3], [2, 2]]) for (let i = 0; i < n; i++) {
      const c = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.048, 0.66, 7), bark); c.rotation.z = Math.PI / 2; c.position.set(0, 0.045 + row * 0.078, (i - (n - 1) / 2) * 0.09); g.add(c);
      for (const sx of [-1, 1]) { const e = new THREE.Mesh(new THREE.CylinderGeometry(0.042, 0.042, 0.004, 7), end); e.rotation.z = Math.PI / 2; e.position.set(sx * 0.331, c.position.y, c.position.z); g.add(e); }
    }
    for (const sx of [-1, 1]) box(0.03, 0.2, 0.03, S.m.beam, sx * 0.2, 0, 0.2, g);
  },
  resource_stone(S, g) {                                // a pile of cut blocks
    const st = S.m.stone;
    for (const [x, y, z, r] of [[-0.1, 0, 0, 0], [0.08, 0, 0.02, 0.2], [0, 0, -0.12, -0.1], [-0.02, 0.09, -0.03, 0.4], [0.1, 0, -0.14, 0.1]]) box(0.14, 0.09, 0.1, st, x, y, z, g).rotation.y = r;
  },
  flag_red(S, g) {
    box(0.014, 0.42, 0.014, S.m.beam, 0, 0, 0, g);
    const f = new THREE.Mesh(new THREE.BoxGeometry(0.005, 0.12, 0.18), S.m.banner); f.position.set(0, 0.35, 0.095); f.rotation.y = 0.15; g.add(f);
    const tip = new THREE.Mesh(new THREE.SphereGeometry(0.014, 6, 4), S.m.trim); tip.position.y = 0.425; g.add(tip);
  },
  stump(S, g) {
    const r = rng(77), bark = mat(null, '#3e3024');
    const st = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.09, 0.1, 8), bark); st.position.y = 0.05; g.add(st);
    const top = new THREE.Mesh(new THREE.CylinderGeometry(0.068, 0.068, 0.005, 8), mat(null, '#9a7a52')); top.position.y = 0.1; g.add(top);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.035, 0.004, 3, 10), mat(null, '#7a5c3c')); ring.rotation.x = Math.PI / 2; ring.position.y = 0.103; g.add(ring);
    for (let i = 0; i < 4; i++) { const a = (i / 4) * 6.28 + r(); const root = box(0.03, 0.03, 0.08, bark, Math.cos(a) * 0.09, 0, Math.sin(a) * 0.09, g); root.rotation.y = -a; root.rotation.x = 0.3; }
  },
  fence(S, g) {                                          // a waist-high rail fence run along z (1.16 long)
    const L = 1.16, n = 5;
    for (let i = 0; i <= n; i++) { const z = -L / 2 + (L * i) / n; box(0.035, 0.3, 0.035, S.m.beam, 0, 0, z, g); const cap = new THREE.Mesh(new THREE.ConeGeometry(0.025, 0.04, 4), S.m.beam); cap.position.set(0, 0.32, z); g.add(cap); }
    for (const y of [0.1, 0.22]) box(0.02, 0.03, L, S.m.wood, 0.02, y, 0, g);
  },
});

// ── dungeon: the way up — a stone stair built against a back wall, climbing (toward −z)
// to an arched opening that glows with the light outside, torches either side.
Object.assign(TYPES, {
  stairsup(S, g) {
    const W = 0.36, L = 0.62, N = 8, rise = 0.43, stone = mat(tex('ashlar', '#4c4852', 31)), dark = mat(null, '#221f27');
    for (let i = 0; i < N; i++) {                          // steps: front (+z) low → back (−z) high
      const d = L / N, h = rise * (i + 1) / N, z = L / 2 - (i + 0.5) * d;
      box(W, h, d, stone, 0, 0, z, g);
      box(W, 0.008, 0.012, mat(null, '#6a6570'), 0, h - 0.004, z + d / 2 - 0.006, g);      // worn nosing, lit edge
    }
    // side cheeks: stepped stone walls following the flight
    for (const sx of [-1, 1]) for (let i = 0; i < N; i++) {
      const d = L / N, h = rise * (i + 1) / N + 0.06, z = L / 2 - (i + 0.5) * d;
      box(0.05, h, d, stone, sx * (W / 2 + 0.025), 0, z, g);
    }
    // arch at the top: pillars, lintel, and the bright opening beyond
    const top = rise, zb = -L / 2 - 0.02;
    for (const sx of [-1, 1]) box(0.07, 0.42, 0.08, stone, sx * (W / 2 + 0.01), top, zb, g);
    box(W + 0.16, 0.08, 0.09, stone, 0, top + 0.4, zb, g);
    const glow = new THREE.Mesh(new THREE.BoxGeometry(W - 0.04, 0.38, 0.02), S.m.glass); glow.userData.glow = true; glow.position.set(0, top + 0.19, zb - 0.02); g.add(glow);
    box(W + 0.16, 0.5, 0.05, dark, 0, top, zb - 0.06, g);                                      // wall face around the arch
    for (const sx of [-1, 1]) {                                                                 // torches on the cheeks
      const t = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.05, 0.03), S.m.glass); t.userData.glow = true;
      t.position.set(sx * (W / 2 + 0.03), rise * 0.35 + 0.16, L / 2 - 0.08); g.add(t);
      box(0.015, 0.1, 0.015, S.m.trim, sx * (W / 2 + 0.03), rise * 0.35 + 0.05, L / 2 - 0.08, g);
    }
  },
});

export const BUILD_TYPES = Object.keys(TYPES);

export function makeBuilding(type, style, seed = 1, faceX = false) {
  const { S, g } = kit(style, seed);
  TYPES[type](S, g, rng(seed));
  if (faceX) g.rotation.y = Math.PI / 2;          // door on +x (screen down-right) instead of +z (down-left)
  g.traverse((o) => { if (o.isMesh) { o.frustumCulled = false; } });
  return g;
}
