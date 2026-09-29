// faces.js — modular faces for human figures (art critic pass 4). KayKit ships one face for every
// human: the same dot eyes, the same brows, the same nose and mouth, as geometry in each head mesh
// coloured by swatch tiles of its 8 × 4 texture (0,0 skin · 1,0 hair, beard and brows · 2,0 the
// eyes · 3,0 trinkets · 1,1 hood or hair tie). This kit takes the heads apart by swatch and
// rebuilds them:
//
//   skull      a bald skull stitched from two KayKit heads (ears included; KayKit's nose kept, or
//              cut out and patched for another), in any skin tone; or the model's own face and
//              hood for hooded heads (`skull: "own"`)
//   parts      eyes, brows, nose, mouth, hair, facial hair, marks and trinkets: code-built pieces
//              placed ON the skull's surface (a ray from the front finds it), or KayKit's own hair
//              and beard meshes lifted out of other models ('long', 'ponytail', 'swept', 'full'),
//              recoloured
//
// Everything is a rigid mesh under the head bone (the KayKit head is skinned only to it), so the
// clips, the heroic head scale, helmets and hats all carry it unchanged. A face is data: a preset
// in faces.json, named by a variant's `face` knob (variants.json), or an inline object; OPTIONS
// lists every choice, and `node faces.cjs` draws them all. The atlas bake builds a `far` face
// (what reads at 56 px); the portraits the full one.
// Units are head-bone space: the head is ~1.08 wide, the chin at y ≈ 0, the crown ≈ 1.05, the
// face toward +z (front surface z ≈ 0.5), the eye line y ≈ 0.36.
import * as THREE from 'three';

const TILE = (u, v) => `${Math.floor(u * 8)},${Math.floor(v * 4)}`;
const std = (color, roughness = 0.8, metalness = 0) => new THREE.MeshStandardMaterial({ color, roughness, metalness });

// ── palettes (names are what faces.json uses; any '#rrggbb' works too) ──
export const SKIN = { porcelain: '#f2d2bc', fair: '#e8b896', rose: '#dca088', olive: '#c89a6c', tan: '#b07850', umber: '#8a5a3a', deep: '#6c4430' };
export const HAIR = { black: '#1c1612', soot: '#2e2620', brown: '#5a3a22', chestnut: '#6e3e24', auburn: '#7e3a1e', copper: '#a65428', straw: '#c8a060', flax: '#e0c88a', ash: '#8a8278', grey: '#a8a49c', white: '#e4e0d8' };
export const IRIS = { brown: '#5a3218', hazel: '#7a6a30', green: '#4a7a3a', blue: '#4a74b0', grey: '#7a8894', amber: '#b07820' };
const col = (table, v, dflt) => new THREE.Color(table[v] || v || dflt);

// ── the KayKit heads, split by swatch into head-bone space (loaded once per model) ──
const kk = new Map();
/** @param {(url: string) => Promise<any>} load GLTF loader @param {string} model */
export async function kkHead(load, model) {
  if (kk.has(model)) return kk.get(model);
  const g = await load(`./models/${model}.glb`); g.scene.updateMatrixWorld(true);
  let head = null; g.scene.traverse((o) => { if (o.isSkinnedMesh && /Head/.test(o.name)) head = o; });
  const sk = head.skeleton, hb = sk.bones.findIndex((b) => b.name === 'head');
  const toBone = sk.boneInverses[hb].clone().multiply(head.bindMatrix);          // mesh (bind) → head-bone space
  const src = head.geometry, pos = src.attributes.position, nrm = src.attributes.normal, uv = src.attributes.uv, idx = src.index;
  const at = (k) => (idx ? idx.getX(k) : k), tri = (idx ? idx.count : pos.count) / 3, nm = new THREE.Matrix3().getNormalMatrix(toBone);
  const buckets = {};
  for (let t = 0; t < tri; t++) {
    let u = 0, v = 0; for (let k = 0; k < 3; k++) { const i = at(t * 3 + k); u += uv.getX(i) / 3; v += uv.getY(i) / 3; }
    (buckets[TILE(u, v)] ||= []).push(t);
  }
  const p = new THREE.Vector3(), n = new THREE.Vector3(), parts = {};
  for (const [tile, ts] of Object.entries(buckets)) {
    const P = [], N = [], U = [];
    for (const t of ts) for (let k = 0; k < 3; k++) { const i = at(t * 3 + k);
      p.fromBufferAttribute(pos, i).applyMatrix4(toBone); P.push(p.x, p.y, p.z);
      n.fromBufferAttribute(nrm, i).applyMatrix3(nm).normalize(); N.push(n.x, n.y, n.z); U.push(uv.getX(i), uv.getY(i)); }
    const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.Float32BufferAttribute(P, 3)); geo.setAttribute('normal', new THREE.Float32BufferAttribute(N, 3)); geo.setAttribute('uv', new THREE.Float32BufferAttribute(U, 2));
    parts[tile] = geo;
  }
  const out = { parts, material: head.material, headName: head.name };
  kk.set(model, out); return out;
}

// ── triangle soup helpers (the extracted geometries are non-indexed: 3 vertices per triangle) ──
/** keep the triangles whose centroid passes `keep`; `move` maps each kept vertex (a continuous
 * function of position, so shared edges stay shared and a shell stays watertight) */
function filterTris(geo, keep, move = null, renormal = true) {
  const pos = geo.attributes.position, nrm = geo.attributes.normal, uv = geo.attributes.uv, P = [], N = [], U = [];
  const a = new THREE.Vector3(), c = new THREE.Vector3(), fn = new THREE.Vector3(), e1 = new THREE.Vector3(), e2 = new THREE.Vector3();
  for (let t = 0; t < pos.count; t += 3) {
    c.set(0, 0, 0); for (let k = 0; k < 3; k++) c.add(a.fromBufferAttribute(pos, t + k)); c.multiplyScalar(1 / 3);
    a.fromBufferAttribute(pos, t); e1.fromBufferAttribute(pos, t + 1).sub(a); e2.fromBufferAttribute(pos, t + 2).sub(a); fn.crossVectors(e1, e2).normalize();
    if (!keep(c, fn)) continue;
    for (let k = 0; k < 3; k++) { a.fromBufferAttribute(pos, t + k); if (move) move(a); P.push(a.x, a.y, a.z); N.push(nrm.getX(t + k), nrm.getY(t + k), nrm.getZ(t + k)); if (uv) U.push(uv.getX(t + k), uv.getY(t + k)); }
  }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(P, 3)); g.setAttribute('normal', new THREE.Float32BufferAttribute(N, 3));
  if (uv) g.setAttribute('uv', new THREE.Float32BufferAttribute(U, 2));
  if (move && renormal) g.computeVertexNormals();
  return g;
}
/** one triangle soup from several */
function merge(...gs) {
  const out = {}; for (const k of ['position', 'normal', 'uv']) { const arrs = gs.map((g) => g.attributes[k]).filter(Boolean); if (arrs.length !== gs.length) continue;
    const size = arrs[0].itemSize, a = new Float32Array(arrs.reduce((n, x) => n + x.array.length, 0)); let o = 0; for (const x of arrs) { a.set(x.array, o); o += x.array.length; } out[k] = new THREE.Float32BufferAttribute(a, size); }
  const g = new THREE.BufferGeometry(); for (const [k, v] of Object.entries(out)) g.setAttribute(k, v); return g;
}
// the bald skull: no KayKit head is whole under its hair or beard. The Knight's face is complete
// below the hairline and the Barbarian's head everywhere but under his beard (the same base
// sculpt), so the skull is the Knight's face (below y 0.6) and the Barbarian's head bar his beard.
let SKULL = null;
// KayKit's mouth: a small inset wedge under the nose whose floor faces up, so it catches the key
// light as a pale sliver. The kit colours it as the lower lip instead.
// KayKit's nose (big and pointed; the kit's other noses replace it and cover where it was)
const isNose = (c) => Math.abs(c.x) < 0.11 && c.y > 0.17 && c.y < 0.46 && c.z > 0.44;
const isWedge = (c, n) => Math.abs(c.x) < 0.17 && c.y > 0.1 && c.y < 0.2 && c.z > 0.34 && c.z < 0.5 && n.y > 0.35;
async function bald(load) {
  if (SKULL) return SKULL;
  const k = await kkHead(load, 'Knight'), b = await kkHead(load, 'Barbarian');
  // the two overlap across the hairline and the cheeks (the same surface: no crack)
  const whole = merge(filterTris(k.parts['0,0'], (c) => c.z > 0.05 && c.y < 0.6), filterTris(b.parts['0,0'], (c) => !(Math.abs(c.x) < 0.36 && c.z > 0.2 && c.y < 0.5)));
  SKULL = { skin: filterTris(whole, (c, n) => !isWedge(c, n)), wedge: filterTris(whole, isWedge), whole, nose: filterTris(whole, isNose), noNose: filterTris(whole, (c, n) => !isWedge(c, n) && !isNose(c)) };
  return SKULL;
}
const CENTER = new THREE.Vector3(0, 0.42, -0.02);                 // the skull's middle: shells grow out from here
const grow = (k) => (v) => { const f = typeof k === 'function' ? k(v) : k; v.sub(CENTER).multiplyScalar(1 + f).add(CENTER); };
// the brows ride in KayKit's hair tile: split them off by where they sit (over the eyes, in front)
const isBrow = (c) => c.z > 0.3 && c.y > 0.4 && c.y < 0.62 && Math.abs(c.x) < 0.38;
const isEar = (c) => Math.abs(c.x) > 0.46 && c.y > 0.12 && c.y < 0.52 && c.z > -0.2 && c.z < 0.2;
const smooth = (a, b, x) => { const t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
const lerp = (a, b, t) => a + (b - a) * t;

// ── face shapes: the skull deformed as a whole, and every part placed on (or grown off) the
// deformed skull, or mapped through the same function, so hair, beards, noses and headgear fit ──
const bell = (y, c, w) => Math.exp(-((y - c) / w) * ((y - c) / w));
export const SHAPES = {
  normal: null,
  thin:   (v) => { v.x *= 0.86; v.z = -0.02 + (v.z + 0.02) * 0.97; },
  thick:  (v) => { v.x *= 1.15; v.z = -0.02 + (v.z + 0.02) * 1.05; },
  round:  (v) => { v.x *= 1.08 * (1 + 0.07 * bell(v.y, 0.25, 0.22)); v.y = 0.5 + (v.y - 0.5) * 0.92; },
  oblong: (v) => { v.y *= 1.13; v.x *= 0.92; },
  pear:   (v) => { v.x *= lerp(1.17, 0.85, smooth(0.02, 0.95, v.y)); },
};
/** a grown shell of the (shaped) skull where `keep` holds: helmets, hoods and coifs fit any head */
export const shellOf = (skull, keep, amount) => filterTris(skull, keep, grow(amount));

// ── the surface: a ray from the front (or any direction) onto the skull ──
function surface(skull) {
  const mesh = new THREE.Mesh(skull, new THREE.MeshBasicMaterial({ side: THREE.DoubleSide })), ray = new THREE.Raycaster();
  /** the skull's surface at (x, y) seen from the front: { p, n } (n = outward normal) */
  return (x, y, dir = new THREE.Vector3(0, 0, -1)) => {
    ray.set(new THREE.Vector3(x, y, 0).addScaledVector(dir, -3), dir);
    const h = ray.intersectObject(mesh)[0];
    if (!h) return { p: new THREE.Vector3(x, y, 0.45), n: new THREE.Vector3(0, 0, 1) };
    const n = h.face.normal.clone(); if (n.dot(dir) > 0) n.negate();
    return { p: h.point.clone(), n };
  };
}
const orient = (o, n) => { o.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), n); return o; };
/** a low-poly tube through surface points (brows, mouths, scars, lines), `lift` off the skin */
function strokeOn(on, pts, radius, material, lift = 0.012, seg = 5) {
  const P = pts.map(([x, y]) => { const s = on(x, y); return s.p.addScaledVector(s.n, lift); });
  const curve = new THREE.CatmullRomCurve3(P), g = new THREE.TubeGeometry(curve, Math.max(4, pts.length * 2), radius, seg, false);
  const m = new THREE.Mesh(g, material); m.scale.set(1, 1, 1); return m;
}
// the curve's points, symmetric about x = 0: f(u) for u in [-1, 1] → [x, y]
const across = (w, y0, f, n = 7) => Array.from({ length: n }, (_, i) => { const u = -1 + (2 * i) / (n - 1); return [u * w, y0 + f(u)]; });

// ── the parts ─────────────────────────────────────────────────────────────────
const EYE = { x: 0.17, y: 0.365 };
// eyes: white, iris, pupil, a catchlight, the lash line, a lid fold and lower line; the style is
// the eye's width, height and tilt. `far` (the 56 px atlas) keeps only a dark dot: at 1–2 px a
// white eye reads as a stare and a lidded one as a smudge.
const EYES = {
  round:  { w: 1, h: 1, tilt: 0 },
  wide:   { w: 1.08, h: 1.16, tilt: 0 },
  narrow: { w: 1.06, h: 0.74, tilt: 0.05, lash: 1.25, lower: true },            // appraising: a flatter eye under a heavier lash
  tired:  { w: 1, h: 0.86, tilt: -0.1, fold: true, lower: true },              // the lids droop outward; folds above, bags below
  sharp:  { w: 1.12, h: 0.78, tilt: 0.16, lash: 1.2 },                           // tilted up at the outer corner
};
function eyes(on, f, M, far) {
  const g = new THREE.Group(), st = EYES[f.eyes] || EYES.round, r = 0.068;
  for (const side of [-1, 1]) {
    const { p, n } = on(side * EYE.x, EYE.y), e = orient(new THREE.Group(), n); e.position.copy(p);
    e.rotation.z += side * st.tilt;
    if (far) {                                                     // atlas: a dark dot (what survives at 56 px), tilted like the style
      const a = new THREE.Mesh(new THREE.SphereGeometry(r, 10, 6), M.lash); a.scale.set(1.15 * st.w, 1.1 * Math.min(1, st.h + 0.1), 0.4); e.add(a); g.add(e); continue;
    } else {
      const white = new THREE.Mesh(new THREE.SphereGeometry(r, 14, 8), M.white); white.scale.set(st.w, 0.66 * st.h, 0.32); e.add(white);
      const iris = new THREE.Mesh(new THREE.CircleGeometry(r * 0.56, 14), M.iris); iris.position.z = r * 0.33; iris.position.y = -r * 0.04; e.add(iris);
      const pupil = new THREE.Mesh(new THREE.CircleGeometry(r * 0.26, 10), M.pupil); pupil.position.set(0, -r * 0.04, r * 0.335); e.add(pupil);
      const glint = new THREE.Mesh(new THREE.CircleGeometry(r * 0.12, 6), M.glint); glint.position.set(r * 0.16 * -side, r * 0.14, r * 0.34); e.add(glint);
      if (st.fold) {                                               // the upper lid's fold: a soft line above the lash
        const fold = new THREE.Mesh(new THREE.TorusGeometry(r * st.w * 1.02, r * 0.07, 3, 12, Math.PI * 0.8), M.crease);
        fold.rotation.z = Math.PI * 0.1; fold.scale.set(1, 0.66 * st.h + 0.28, 1); fold.position.set(0, r * 0.1, r * 0.12); e.add(fold);
      }
    }
    // lash line along the lid's edge (an arc over the eye), and a faint lower one
    const lash = new THREE.Mesh(new THREE.TorusGeometry(r * st.w, r * 0.17 * (st.lash ?? 1), 4, 12, Math.PI * 0.9), M.lash);
    lash.rotation.z = Math.PI * 0.05; lash.scale.set(1, 0.66 * st.h, 1); lash.position.z = r * 0.24; e.add(lash);
    if (st.lower && !far) { const lo = new THREE.Mesh(new THREE.TorusGeometry(r * st.w * 0.86, r * 0.06, 3, 10, Math.PI * 0.6), M.crease); lo.rotation.z = Math.PI * 1.2; lo.scale.set(1, 0.42 * st.h, 1); lo.position.set(0, -r * 0.08, r * 0.2); e.add(lo); }
    g.add(e);
  }
  return g;
}
// brows: a stroke over each eye; the style is its shape (u: 0 inner → 1 outer) and weight
const BROWS = {
  straight: { y: (u) => 0, r: 0.022 },
  arched:   { y: (u) => 0.03 * Math.sin(Math.PI * u) - 0.01 * u, r: 0.02 },
  heavy:    { y: (u) => 0.008 * Math.sin(Math.PI * u) - 0.012, r: 0.034 },
  angry:    { y: (u) => -0.035 + 0.05 * u, r: 0.026 },
  worried:  { y: (u) => 0.03 - 0.045 * u, r: 0.022 },
  thin:     { y: (u) => 0.022 * Math.sin(Math.PI * u), r: 0.012 },
};
function brows(on, f, M) {
  const g = new THREE.Group(), st = BROWS[f.brows] || BROWS.straight;
  for (const side of [-1, 1]) {
    const pts = Array.from({ length: 5 }, (_, i) => { const u = i / 4; return [side * (0.07 + 0.2 * u), 0.475 + st.y(u)]; });
    g.add(strokeOn(on, pts, st.r * (f.browWeight ?? 1), M.brow, 0.018));
  }
  return g;
}
// mouths: a lip line (its curve is the expression) and, for some, a lower-lip shade
const MOUTHS = {
  line:  { w: 0.1, f: (u) => 0 },
  smile: { w: 0.11, f: (u) => 0.022 * u * u - 0.004 },
  grin:  { w: 0.12, f: (u) => 0.03 * u * u - 0.008, open: 0.6 },
  frown: { w: 0.1, f: (u) => -0.02 * u * u },
  smirk: { w: 0.1, f: (u) => (u > 0 ? 0.03 * u * u : -0.004 * u * u) },
  grim:  { w: 0.12, f: (u) => -0.008 * u * u, thin: true },
  open:  { w: 0.08, f: (u) => 0, open: 1 },
};
const MOUTH_Y = 0.168;
function mouth(on, f, M, far) {
  const g = new THREE.Group(), st = MOUTHS[f.mouth] || MOUTHS.line, w = st.w * (f.mouthWidth ?? 1);
  g.add(strokeOn(on, across(w, MOUTH_Y, st.f, 7), far ? 0.011 : st.thin ? 0.012 : 0.017, M.mouth, 0.016));
  if (st.open) { const { p, n } = on(0, MOUTH_Y - 0.012), o = orient(new THREE.Mesh(new THREE.SphereGeometry(w * 0.55, 10, 6), M.pupil), n); o.position.copy(p); o.scale.set(1, 0.42 * st.open, 0.25); g.add(o); }
  return g;
}
// noses: the skull's own ('kk'), or one built where it was (the skull under KayKit's nose is
// whole): a bridge from between the brows to the tip, the tip, and nostril wings
// where KayKit's nose was there is no face under it: a patch shaped to the face either side of it
// (a slight swell, so its rim tucks under the skin around) closes the hole first
function nosePatch(on) {
  const g = new THREE.PlaneGeometry(0.3, 0.36, 8, 10), p = g.attributes.position;
  for (let i = 0; i < p.count; i++) { const x = p.getX(i), y = p.getY(i) + 0.31, z = (on(-0.16, y).p.z + on(0.16, y).p.z) / 2;
    p.setXYZ(i, x, y, z + 0.018 * (1 - (x / 0.15) ** 2) * (1 - ((y - 0.31) / 0.18) ** 2)); }
  g.computeVertexNormals(); return g.toNonIndexed();
}
const NOSES = {
  button: { tipY: 0.27, out: 0.065, tip: 0.055, bridge: 0.024, wing: 0.036 },
  long:   { tipY: 0.21, out: 0.115, tip: 0.048, bridge: 0.036, wing: 0.034 },
  hook:   { tipY: 0.205, out: 0.11, tip: 0.05, bridge: 0.038, wing: 0.036, hump: 0.04, droop: 0.025 },
  broad:  { tipY: 0.235, out: 0.085, tip: 0.072, bridge: 0.046, wing: 0.058 },
  snub:   { tipY: 0.275, out: 0.075, tip: 0.052, bridge: 0.026, wing: 0.036, up: 0.025 },
};
function nose(on, f, M) {
  const g = new THREE.Group(), st = NOSES[f.nose]; if (!st) return g;
  const top = on(0, 0.43).p, base = on(0, st.tipY).p, tip = new THREE.Vector3(0, st.tipY + (st.up || 0) - (st.droop || 0), base.z + st.out);
  const seg = (a, b, r0, r1) => { const m = new THREE.Mesh(new THREE.CylinderGeometry(r0, r1, a.distanceTo(b), 6), M.skin); m.position.copy(a).add(b).multiplyScalar(0.5); m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), a.clone().sub(b).normalize()); return m; };
  const mid = top.clone().lerp(tip, 0.5); if (st.hump) mid.z += st.hump;
  g.add(seg(top.clone().setZ(top.z - 0.01), mid, st.bridge * 0.7, st.bridge), seg(mid, tip, st.bridge, st.tip * 0.9));
  if (st.hump) { const h = new THREE.Mesh(new THREE.IcosahedronGeometry(st.bridge * 1.05, 1), M.skin); h.position.copy(mid); g.add(h); }
  const t = new THREE.Mesh(new THREE.IcosahedronGeometry(st.tip, 1), M.skin); t.position.copy(tip); t.scale.set(1.05, 0.9, 0.9); g.add(t);
  for (const sd of [-1, 1]) { const w = new THREE.Mesh(new THREE.IcosahedronGeometry(st.wing, 1), M.skin); w.position.set(sd * st.tip * 1.05, tip.y - st.tip * 0.35, tip.z - st.out * 0.45); w.scale.set(1, 0.8, 0.9); g.add(w);
    const nos = new THREE.Mesh(new THREE.CircleGeometry(st.wing * 0.42, 6), M.crease); nos.rotation.x = Math.PI / 2; nos.position.set(sd * st.tip * 0.6, tip.y - st.tip * 0.85, tip.z - st.out * 0.25); g.add(nos); }
  return g;
}
// hair: shells grown off the skull above a hairline (watertight: the growth is a function of
// position), plus knots and braids; or KayKit's own hair meshes ('kk_rogue', 'kk_mage', 'kk_knight')
function hairline(front, side, back) {
  return (c) => { if (isEar(c)) return false;
    const zf = smooth(-0.25, 0.3, c.z), hy = lerp(back, lerp(side, front, smooth(0.15, 0.38, c.z)), zf);
    return c.y > hy; };
}
const HAIRS = {
  bald: null,
  crop:     { line: hairline(0.72, 0.44, 0.1), grow: 0.035 },
  short:    { line: hairline(0.66, 0.4, 0.05), grow: (v) => 0.04 + 0.03 * smooth(0.6, 0.95, v.y) },
  receding: { line: (c) => hairline(0.86, 0.44, 0.1)(c) && !(c.z > 0.2 && c.y < 0.9 && Math.abs(c.x) < 0.3 + (c.y - 0.72) * 1.2), grow: 0.03 },
  crest:    { line: (c) => Math.abs(c.x) < 0.14 && c.y > 0.5 && !isEar(c), grow: (v) => 0.03 + 0.14 * smooth(0.55, 0.95, v.y) },
  bun:      { line: hairline(0.7, 0.42, 0.12), grow: 0.04, knot: { at: [0, 0.8, -0.44], r: 0.19 } },
  topknot:  { line: hairline(0.72, 0.44, 0.1), grow: 0.03, knot: { at: [0, 1.04, -0.08], r: 0.15 } },
  braid:    { line: hairline(0.7, 0.42, 0.08), grow: 0.04, braid: true },
  long:     { kk: 'Rogue' }, ponytail: { kk: 'Mage', tie: true }, swept: { kk: 'Knight' },
};
async function hair(load, skull, f, M, S = null) {
  const at = (a) => { const v = new THREE.Vector3(...a); if (S) S(v); return v; };
  const g = new THREE.Group(), st = HAIRS[f.hair ?? 'crop']; if (!st) return g;
  if (st.kk) {
    const h = await kkHead(load, st.kk);
    g.add(new THREE.Mesh(filterTris(h.parts['1,0'], (c) => !isBrow(c), (v) => { if (S) S(v); grow(0.05)(v); }), M.hair));   // grown to clear the skull's crown (it sits higher than theirs)
    if (st.tie && h.parts['1,1']) g.add(new THREE.Mesh(S ? filterTris(h.parts['1,1'], () => true, S) : h.parts['1,1'], M.tie));
    return g;
  }
  g.add(new THREE.Mesh(filterTris(skull, st.line, grow(st.grow)), M.hair));
  if (st.knot) { const k = new THREE.Mesh(new THREE.IcosahedronGeometry(st.knot.r, 1), M.hair); k.position.copy(at(st.knot.at)); g.add(k);
    const band = new THREE.Mesh(new THREE.TorusGeometry(st.knot.r * 0.62, 0.025, 4, 10), M.tie); band.position.copy(at(st.knot.at)); band.position.z += st.knot.at[2] < -0.2 ? st.knot.r * 0.55 : 0; band.position.y -= st.knot.at[2] < -0.2 ? 0 : st.knot.r * 0.6; if (st.knot.at[2] >= -0.2) band.rotation.x = Math.PI / 2; g.add(k, band); }
  if (st.braid) {                                                  // over the right shoulder, towards the front
    const P = [[0.4, 0.42, -0.18], [0.44, 0.18, -0.02], [0.42, -0.08, 0.1], [0.38, -0.34, 0.18], [0.35, -0.56, 0.2]];
    P.forEach((q, i) => { const s = new THREE.Mesh(new THREE.IcosahedronGeometry(0.1 - i * 0.008, 0), M.hair); s.position.copy(at(q)); s.rotation.set(i, i * 0.7, 0); g.add(s); });
    const band = new THREE.Mesh(new THREE.TorusGeometry(0.05, 0.022, 4, 8), M.tie); band.position.copy(at([0.35, -0.62, 0.2])); band.rotation.x = Math.PI / 2; g.add(band);
  }
  return g;
}
// facial hair: stubble and short beards are shells off the jaw; 'full' is the Barbarian's beard
const jaw = (c) => c.y < 0.3 && c.z > -0.22 && !isEar(c) && !(Math.abs(c.x) < 0.14 && c.y > 0.1 && c.y < 0.26 && c.z > 0.3);
async function beard(load, skull, on, f, M, S = null) {
  const g = new THREE.Group(), kind = f.beard; if (!kind) return g;
  if (kind === 'stubble') g.add(new THREE.Mesh(filterTris(skull, jaw, grow(0.008)), M.stubble));
  if (kind === 'short' || kind === 'goatee') g.add(new THREE.Mesh(filterTris(skull, kind === 'goatee' ? (c) => jaw(c) && Math.abs(c.x) < 0.16 && c.y < 0.14 && c.z > 0.2 : jaw, grow((v) => 0.04 + 0.05 * smooth(0.2, -0.05, v.y))), M.beard));
  if (kind === 'full') { const h = await kkHead(load, 'Barbarian'); g.add(new THREE.Mesh(filterTris(h.parts['1,0'], (c) => !isBrow(c), (v) => { if (S) S(v); grow(0.01)(v); }), M.beard)); }
  if (kind === 'short' || kind === 'goatee' || kind === 'mustache') g.add(strokeOn(on, across(0.13, 0.225, (u) => -0.035 * u * u + (kind === 'mustache' ? -0.02 * u * u * u * u : 0), 7), 0.028, M.beard, 0.02));
  return g;
}
// marks: small things that make a face someone's
function marks(on, f, M) {
  const g = new THREE.Group();
  for (const m of f.marks || []) {
    if (m === 'scar') g.add(strokeOn(on, [[0.1, 0.58], [0.13, 0.5]], 0.012, M.scar, 0.02, 4), strokeOn(on, [[0.2, 0.3], [0.24, 0.2]], 0.012, M.scar, 0.016, 4));   // across the brow and cheek, broken by the eye
    if (m === 'scar_cheek') g.add(strokeOn(on, [[-0.32, 0.3], [-0.26, 0.25], [-0.2, 0.21]], 0.012, M.scar, 0.014, 4));
    if (m === 'freckles') for (const [x, y] of [[0.2, 0.27], [0.26, 0.24], [0.15, 0.24], [0.23, 0.2], [0.3, 0.28], [0.18, 0.3]]) for (const s of [-1, 1]) {
      const { p, n } = on(s * x, y), d = orient(new THREE.Mesh(new THREE.CircleGeometry(0.011, 5), M.freckle), n); d.position.copy(p).addScaledVector(n, 0.006); g.add(d); }
    if (m === 'blush') for (const s of [-1, 1]) { const { p, n } = on(s * 0.25, 0.235), d = orient(new THREE.Mesh(new THREE.CircleGeometry(0.06, 10), M.blush), n); d.position.copy(p).addScaledVector(n, 0.004); d.scale.y = 0.6; g.add(d); }
    if (m === 'wrinkles') {                                        // crow's feet, a forehead line, the lines from nose to mouth
      for (const sd of [-1, 1]) g.add(strokeOn(on, [[sd * 0.262, EYE.y - 0.015], [sd * 0.292, EYE.y - 0.035]], 0.005, M.crease, 0.01, 3));
      g.add(strokeOn(on, across(0.14, 0.62, (u) => 0.01 * (1 - u * u)), 0.005, M.crease, 0.01, 3));
      for (const sd of [-1, 1]) g.add(strokeOn(on, [[sd * 0.1, 0.26], [sd * 0.14, 0.2], [sd * 0.145, 0.16]], 0.006, M.crease, 0.01, 3));
    }
    if (m === 'eyepatch') {
      const { p, n } = on(0.17, EYE.y), d = orient(new THREE.Mesh(new THREE.CircleGeometry(0.1, 10), M.patch), n); d.position.copy(p).addScaledVector(n, 0.05); d.scale.y = 0.85; g.add(d);
      g.add(strokeOn(on, [[-0.4, 0.62], [-0.1, 0.55], [0.17, EYE.y + 0.05], [0.44, 0.35]], 0.013, M.patch, 0.03, 4));
    }
    if (m === 'earring') { const r = new THREE.Mesh(new THREE.TorusGeometry(0.035, 0.012, 5, 10), M.gold); r.position.set(0.52, 0.18, 0.02); r.rotation.y = Math.PI / 2; g.add(r); }
  }
  return g;
}

// every option of every part, for the face board (faces.cjs) and faces.json authors
export const OPTIONS = {
  hair: Object.keys(HAIRS), eyes: Object.keys(EYES), brows: Object.keys(BROWS), mouth: Object.keys(MOUTHS),
  nose: ['kk', ...Object.keys(NOSES)], beard: [null, 'stubble', 'short', 'goatee', 'mustache', 'full'],
  marks: ['scar', 'scar_cheek', 'freckles', 'blush', 'wrinkles', 'eyepatch', 'earring'], skin: Object.keys(SKIN), iris: Object.keys(IRIS), shape: Object.keys(SHAPES),
};

// ── a face ────────────────────────────────────────────────────────────────────
/** Build a face for a variant: the head group to put under the head bone, and the names of the
 * KayKit head meshes it replaces. `far` builds the atlas version (dot eyes, no marks, no lip).
 * @param {(url: string) => Promise<any>} load @param {string} model @param {any} f the face */
export async function buildFace(load, model, f, { far = false } = {}) {
  const own = f.skull === 'own';
  const base = own ? await kkHead(load, model) : null, mine = await kkHead(load, model);
  const skin = col(SKIN, f.skin, SKIN.fair), hairC = col(HAIR, f.hairColor, HAIR.brown);
  const M = {
    skin: std(skin, 0.72), hair: std(hairC, 0.85), brow: std(col(HAIR, f.browColor, hairC.clone().multiplyScalar(0.72)), 0.9),
    beard: std(col(HAIR, f.beardColor, hairC), 0.9), stubble: std(skin.clone().multiplyScalar(0.7).lerp(col(HAIR, f.beardColor, hairC), 0.35), 1),
    white: std('#f2ece2', 0.35), iris: std(col(IRIS, f.iris, IRIS.brown), 0.3), pupil: std('#120c0a', 0.4), glint: new THREE.MeshBasicMaterial({ color: '#ffffff' }),
    lash: std('#1c120e', 0.8), lid: std(skin.clone().multiplyScalar(0.94), 0.72), crease: std(skin.clone().multiplyScalar(0.78), 0.95),
    mouth: std(skin.clone().lerp(new THREE.Color('#3a1210'), 0.7), 0.95), lip: std(skin.clone().multiplyScalar(0.86).lerp(new THREE.Color('#a04a40'), 0.22), 0.95),
    scar: std(skin.clone().multiplyScalar(0.72).lerp(new THREE.Color('#a04a44'), 0.35), 0.9), freckle: std(skin.clone().lerp(new THREE.Color('#6a2a10'), 0.5), 0.9),
    blush: std(skin.clone().lerp(new THREE.Color('#e05a58'), 0.4), 0.8), patch: std('#1a1414', 0.7), gold: std('#d8a848', 0.3, 0.8), tie: std(col(HAIR, f.tieColor, '#6a3a22'), 0.8),
  };
  const head = new THREE.Group(); head.name = 'Face';
  // the skull: skin in the chosen tone; an own head keeps its other kept tiles (a hood) textured
  const S = SHAPES[f.shape], sh = (g) => (S && g ? filterTris(g, () => true, S, false) : g);   // (smooth normals kept: the deformations are gentle)
  const B0 = own ? null : await bald(load), B = B0 && { skin: sh(B0.skin), wedge: sh(B0.wedge), whole: sh(B0.whole), noNose: sh(B0.noNose) };
  const skull = own ? sh(base.parts['0,0']) : B.whole;
  const ownNose = own || !NOSES[f.nose], patch = ownNose ? null : sh(nosePatch(surface(B0.whole)));
  head.add(new THREE.Mesh(own ? skull : ownNose ? B.skin : B.noNose, M.skin));
  if (patch) head.add(new THREE.Mesh(patch, M.skin));
  if (B) head.add(new THREE.Mesh(B.wedge, far ? M.skin : M.lip));
  if (own) for (const t of f.keep || ['1,1']) if (base.parts[t]) head.add(new THREE.Mesh(sh(base.parts[t]), base.material));
  const onShaped = surface(ownNose ? skull : merge(B.noNose, B.wedge, patch));
  const on = S ? (x, y, dir) => { const q = new THREE.Vector3(x, y, 0.45); S(q); return onShaped(q.x, q.y, dir); } : onShaped;   // parts are authored on the normal head
  // the atlas (far) keeps what reads at 56 px — skin, hair, beard, brows, dot eyes, a mouth — and
  // drops the marks, which only turned into smudges there
  head.add(eyes(on, f, M, far), brows(on, f, M), mouth(on, f, M, far), nose(on, f, M), await beard(load, skull, on, f, M, S));
  if (!far) head.add(marks(on, f, M));
  if (!own) head.add(await hair(load, skull, f, M, S));
  head.traverse((o) => { if (o.isMesh) { o.frustumCulled = false; o.userData.face = true; } });
  return { head, replaces: [mine.headName], skull, on };
}
