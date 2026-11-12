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
// a mark's or a lip's colour on this skin: the skin turned toward a hue by k, at the skin's own lightness × light, so a
// blush or a scar sits in the face at every tone (mixed toward one fixed colour, a blush was a bright rose blot on deep
// skin: the owner, 2026-11-10, "dark skin, shows up blotchy")
const lumOf = (c) => 0.2126 * c.r + 0.7152 * c.g + 0.0722 * c.b;
const toned = (skin, hex, k, light = 1) => { const c = skin.clone().lerp(new THREE.Color(hex), k), l = lumOf(c); return l > 0 ? c.multiplyScalar((lumOf(skin) * light) / l) : c; };

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
/** a shell cut cleanly along a line (the painted head's hair): a triangle the line crosses is clipped at it, the
 * crossing found by halving each edge, so the edge follows the line, not the skull's grid (filterTris keeps or drops a
 * triangle whole: a hairline in steps); smooth normals, welded by position */
function clipTris(geo, inside, move = null) {
  const pos = geo.attributes.position, P = [], v = [new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()], q = new THREE.Vector3(), r = new THREE.Vector3();
  const cross = (a, b) => { let lo = 0, hi = 1; for (let i = 0; i < 12; i++) { const m = (lo + hi) / 2; q.lerpVectors(a, b, m); if (inside(q) === inside(a)) lo = m; else hi = m; } return r.lerpVectors(a, b, (lo + hi) / 2).clone(); };
  for (let t = 0; t < pos.count; t += 3) {
    for (let k = 0; k < 3; k++) v[k].fromBufferAttribute(pos, t + k);
    const inn = v.map((p) => inside(p)), n = inn.filter(Boolean).length; if (!n) continue;
    let poly = [];
    if (n === 3) poly = v.map((p) => p.clone());
    else for (let k = 0; k < 3; k++) { const a = v[k], b = v[(k + 1) % 3]; if (inn[k]) poly.push(a.clone()); if (inn[k] !== inn[(k + 1) % 3]) poly.push(cross(a, b)); }
    for (let k = 1; k + 1 < poly.length; k++) for (const p of [poly[0], poly[k], poly[k + 1]]) { const m = p.clone(); if (move) move(m); P.push(m.x, m.y, m.z); }
  }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(P, 3)); g.computeVertexNormals();
  const nr = g.attributes.normal, key = (i) => `${Math.round(P[i * 3] * 2000)},${Math.round(P[i * 3 + 1] * 2000)},${Math.round(P[i * 3 + 2] * 2000)}`, sum = new Map();
  for (let i = 0; i < P.length / 3; i++) { const k = key(i), o = sum.get(k) || [0, 0, 0]; o[0] += nr.getX(i); o[1] += nr.getY(i); o[2] += nr.getZ(i); sum.set(k, o); }
  for (let i = 0; i < P.length / 3; i++) { const o = sum.get(key(i)), l = Math.hypot(o[0], o[1], o[2]) || 1; nr.setXYZ(i, o[0] / l, o[1] / l, o[2] / l); }
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
      const a = new THREE.Mesh(new THREE.SphereGeometry(r, 10, 6), M.lash); a.scale.set(1.15 * st.w, 1.1 * Math.min(1, st.h + 0.1), 0.4); e.add(a);
      a.userData.part = side < 0 ? 'eyeA' : 'eyeB'; g.add(e); continue;
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
    e.traverse((o) => { if (o.isMesh) o.userData.part = side < 0 ? 'eyeA' : 'eyeB'; });   // (pass 7: which eye, for the atlas's pixel eye)
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
// the painted head's own cuts where they differ (the owner's reference head, 2026-11-12): the short cut a thick cap, the
// hairline up off the brow, sideburns to the ear's top, a forelock over one brow
// (a hairline by the angle round the head: [angle from the front, height] pairs, eased between; the painted head's face
// is flatter than KayKit's, so hairline()'s depth-blend never reaches its front)
const lineRound = (pts) => (c) => { const a = Math.abs(Math.atan2(c.x, c.z + 0.03)); let i = 0; while (i < pts.length - 2 && a > pts[i + 1][0]) i++;
  const [a0, y0] = pts[i], [a1, y1] = pts[i + 1]; return c.y > lerp(y0, y1, smooth(a0, a1, a)); };
const HAIRS_PAINTED = {
  short: { line: lineRound([[0, 0.72], [0.55, 0.75], [0.95, 0.7], [1.15, 0.42], [1.42, 0.4], [1.62, 0.44], [1.95, 0.16], [Math.PI, 0.04]]),
    grow: (v) => 0.035 + 0.06 * smooth(0.5, 0.9, v.y) + 0.02 * smooth(0.85, 1.05, v.y), lock: true },
};
/** a lock of hair: a ribbon tapering along a curve lying on the face, a little proud of it */
function lockMesh(pts, w0, mat) {
  const P = [], I = [], n = pts.length;
  for (let i = 0; i < n; i++) { const [x, y, z] = pts[i], [x1, y1] = pts[Math.min(n - 1, i + 1)], [x0, y0] = pts[Math.max(0, i - 1)];
    let dx = x1 - x0, dy = y1 - y0; const l = Math.hypot(dx, dy) || 1; dx /= l; dy /= l; const w = w0 * (1 - i / (n - 1)) * 0.5 + 0.002;
    P.push(x - dy * w, y + dx * w, z, x + dy * w, y - dx * w, z, x, y, z + 0.012 * (1 - i / (n - 1))); }
  for (let i = 0; i < n - 1; i++) { const a = i * 3, b = a + 3; I.push(a, a + 2, b, a + 2, b + 2, b, a + 2, a + 1, b + 2, a + 1, b + 1, b + 2); }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(P, 3)); g.setIndex(I); g.computeVertexNormals();
  return new THREE.Mesh(g, mat);
}
async function hair(load, skull, f, M, S = null, clean = false) {
  const at = (a) => { const v = new THREE.Vector3(...a); if (S) S(v); return v; };
  const g = new THREE.Group(), st = (clean && HAIRS_PAINTED[f.hair ?? 'crop']) || HAIRS[f.hair ?? 'crop']; if (!st) return g;
  if (st.kk) {
    const h = await kkHead(load, st.kk);
    g.add(new THREE.Mesh(filterTris(h.parts['1,0'], (c) => !isBrow(c), (v) => { if (S) S(v); grow(0.05)(v); }), M.hair));   // grown to clear the skull's crown (it sits higher than theirs)
    if (st.tie && h.parts['1,1']) g.add(new THREE.Mesh(S ? filterTris(h.parts['1,1'], () => true, S) : h.parts['1,1'], M.tie));
    return g;
  }
  g.add(new THREE.Mesh(clean ? clipTris(skull, st.line, grow(st.grow)) : filterTris(skull, st.line, grow(st.grow)), M.hair));
  if (st.knot) { const k = new THREE.Mesh(new THREE.IcosahedronGeometry(st.knot.r, 1), M.hair); k.position.copy(at(st.knot.at)); g.add(k);
    const band = new THREE.Mesh(new THREE.TorusGeometry(st.knot.r * 0.62, 0.025, 4, 10), M.tie); band.position.copy(at(st.knot.at)); band.position.z += st.knot.at[2] < -0.2 ? st.knot.r * 0.55 : 0; band.position.y -= st.knot.at[2] < -0.2 ? 0 : st.knot.r * 0.6; if (st.knot.at[2] >= -0.2) band.rotation.x = Math.PI / 2; g.add(k, band); }
  if (st.lock) {                                                   // the forelock: two tapered strands from the hairline down over the left brow
    const sp = skull.attributes.position, frontZ = (x, y) => { let best = 1e9, z = 0.4; for (let i = 0; i < sp.count; i++) { if (sp.getZ(i) < 0) continue; const d = (sp.getX(i) - x) ** 2 + (sp.getY(i) - y) ** 2; if (d < best) { best = d; z = sp.getZ(i); } } return z; };
    const mat = M.hair.clone(); mat.side = THREE.DoubleSide;
    for (const [x0, y0, x1, y1, w] of [[0.09, 0.78, 0.13, 0.55, 0.075], [0.17, 0.77, 0.2, 0.6, 0.055]]) {   // (from inside the hairline, curving down over the brow)
      const pts = []; for (let i = 0; i <= 8; i++) { const t = i / 8, x = lerp(x0, x1, t) - 0.03 * Math.sin(Math.PI * t), y = lerp(y0, y1, t); pts.push([x, y, frontZ(x, y) + 0.008 + 0.03 * (1 - t) * (1 - t)]); }
      g.add(lockMesh(pts, w, mat));
    }
  }
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
      if (f.skull !== 'own') g.add(strokeOn(on, [[-0.4, 0.62], [-0.1, 0.55], [0.17, EYE.y + 0.05], [0.44, 0.35]], 0.013, M.patch, 0.03, 4));   // (the strap round a bare head; under a hood it was a stray line on the cloth)
    }
    if (m === 'earring') { const r = new THREE.Mesh(new THREE.TorusGeometry(0.035, 0.012, 5, 10), M.gold); r.position.set(0.52, 0.18, 0.02); r.rotation.y = Math.PI / 2; g.add(r); }
  }
  return g;
}

// ears: KayKit's are a human's, small nubs at the skull's sides. `pointed` (goblins, the owner 2026-10-03: "bigger
// pointy ears") grows a long flat leaf from each, out, up and a little back, with a darker hollow on its front face so
// the shape reads at 56 px; `earSize` scales it (default 1.2: 0.74 head units long, over two-thirds of the head's width; swept back so it shows side-on too).
function ears(f, M, S) {
  const g = new THREE.Group(); if (f.ears !== 'pointed') return g;
  const k = f.earSize || 1.2, L = 0.62 * k, R = 0.15 * k;
  for (const sd of [-1, 1]) {
    const base = new THREE.Vector3(sd * 0.5, 0.33, -0.04); if (S) S(base);
    const d = new THREE.Vector3(sd, 0.5, -0.6).normalize(), up = new THREE.Vector3(0, 0.35, 1);
    const n = up.addScaledVector(d, -up.dot(d)).normalize(), x = new THREE.Vector3().crossVectors(d, n);
    const q = new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(x, d, n));
    const leaf = (r, len, mat, lift) => { const m = new THREE.Mesh(new THREE.ConeGeometry(r, len, 8), mat); m.quaternion.copy(q); m.scale.set(1, 1, 0.32);
      m.position.copy(base).addScaledVector(d, len / 2 - 0.06 * k).addScaledVector(n, lift); return m; };
    g.add(leaf(R, L, M.skin, 0), leaf(R * 0.55, L * 0.72, M.earIn, R * 0.2));
  }
  return g;
}

// ── the painted head (the face spike, 2026-11-12; the owner: "Go with the packs proportions, selectable by player
// expressions as a part of character creation. Start the spike", after the Meshtint Cute Series faces pack) ─────────────
// Three parts, as the pack builds its heads (our own art, built in code; nothing of theirs): a smooth egg of a skull of our
// own (a full crown, round cheeks, a soft narrow chin, the nose a sculpted bump, small set-in ears), fitted inside KayKit's
// head so its helms, hoods and our hair shells still fit; a face mask, a curved patch following the skull's front; and on
// the mask the whole face as one painted picture (eyes, brows, mouth, marks) on a canvas, the skin painted under it so a
// blush or freckles blend. Big dark eyes with a glint, thick brows in the hair's colour, a short mouth line: what reads at
// 56 px. An expression is the picture redrawn (brows' tilt, lids, the mouth), a part the player picks at creation.
// Behind a switch for the spike: setFaceStyle('painted') or a face's own `style: 'painted'`.
let STYLE = 'mesh';
/** the face kit's style for every face without its own: 'mesh' (the parts in 3D, as before) or 'painted' @param {string} s */
export const setFaceStyle = (s) => { STYLE = s === 'painted' ? 'painted' : 'mesh'; };
export const faceStyle = () => STYLE;
export const EXPRESSIONS = ['neutral', 'smile', 'happy', 'stern', 'sad', 'smug', 'surprised', 'fierce'];

const CHIN = -0.01, CROWN = 1.05, HH = CROWN - CHIN;              // the egg's height, in KayKit's head (chin y 0, crown 1.05)
const EGG = { cy: (CHIN + CROWN) / 2, cz: -0.03, ax: 0.49, ay: HH / 2, az: 0.55 };   // (KayKit's head fills x ±0.54, z −0.57…0.5: helms fit)
// the nose, a bump in the skull's front: width (x), height (y), depth (z), its middle's height (s: 0 the chin, 1 the crown)
const BUMP = { kk: [0.08, 0.064, 0, 0.27, 'ball'], button: [0.075, 0.06, 0.027, 0.28], long: [0.07, 0.095, 0.036, 0.3], hook: [0.075, 0.085, 0.042, 0.31], broad: [0.11, 0.065, 0.027, 0.28], snub: [0.07, 0.056, 0.024, 0.29] };   // (low, just over the mouth: the pack's)
// The head's shape (the owner, 2026-11-12, after the pack's rounded box: "I dont like the shape of the head or the big
// eyes. Build 20 different head shapes with some depth or detail that i can choose from"): one skull built from numbers,
// HEADS the twenty to choose from. Its sections are superellipses (sq: 2 an ellipse, more a box), the crown's and the
// chin's curves (top, low), the jaw drawn in toward the chin (jaw, to the height jawTo), the face's front and the back of
// the skull (front, back); then sculpted: the brow ridge, the eye sockets, the nose's bridge, the cheekbones and the
// hollows under them, the lips' fullness, the chin's point and cleft, the jaw's corners, the temples, jowls, the back of
// the skull, a sloped forehead, a long jaw (chinL) or a tall crown (tall). Every shape stays inside KayKit's head
// (x ±0.54, z −0.57…0.5, chin 0 to crown 1.05), so its helms and hoods and our hair shells still fit.
const HEAD0 = { w: 0.47, d: 0.55, sq: 2.3, top: 2.1, low: 2.5, jaw: 0.72, jawTo: 0.5, front: 0.93, back: 1.08, slope: 0, tall: 0, chinL: 0,
  brow: 0.014, socket: 0.008, bridge: 0.006, cheek: 0.01, hollow: 0, lips: 0.006, chin: 0.01, cleft: 0, gonion: 0, temple: 0, jowl: 0, occ: 0, flat: 0, flatK: 0.06, muzzle: 0, cheekF: 0, nape: 0.12, lowF: 0 };
/** the twenty heads (and the pack's rounded box, the spike's first): each the numbers that differ from HEAD0 */
export const HEADS = {
  // the owner's reference head (2026-11-12: "Map this closely and critic pass until you get it right"), the default: a flat face
  // plane, the sides turning back from it, the widest at the cheekbones, a broad jaw straight to a rounded chin
  shield:    { w: 0.43, d: 0.52, sq: 2.1, top: 2.1, low: 2.6, lowF: 4.2, jaw: 0.76, jawTo: 0.48, front: 1, back: 0.86, nape: 0.36, brow: 0.016, socket: 0.012, bridge: 0.03, cheek: 0.012, cheekF: 0.02, muzzle: 0.035, temple: 0.012, lips: 0.008, chin: 0.018 },
  oval:      {},
  heart:     { w: 0.48, jaw: 0.52, low: 1.9, cheek: 0.02, temple: -0.006, chin: 0.012 },
  square:    { w: 0.48, sq: 3.1, low: 4, jaw: 0.95, gonion: 0.022, brow: 0.02, chin: 0.006 },
  round:     { w: 0.5, sq: 2.05, top: 2, low: 2.1, jaw: 0.86, front: 0.97, cheek: 0.016, brow: 0.006, socket: 0.004, chin: 0.004 },
  long:      { w: 0.44, chinL: 0.09, tall: 0.03, jaw: 0.74, low: 2.4, cheek: 0.008, chin: 0.012 },
  diamond:   { w: 0.47, jaw: 0.56, low: 2.0, cheek: 0.028, temple: 0.022, hollow: 0.008, chin: 0.01 },
  pear:      { w: 0.45, jaw: 1.0, jawTo: 0.35, low: 3.2, temple: 0.02, gonion: 0.026, jowl: 0.01, cheek: 0.004 },
  rugged:    { w: 0.48, sq: 2.7, low: 3.4, jaw: 0.9, brow: 0.042, socket: 0.014, cheek: 0.016, hollow: 0.014, chin: 0.026, cleft: 0.008, gonion: 0.016 },
  gaunt:     { w: 0.45, sq: 2.4, jaw: 0.7, cheek: 0.024, hollow: 0.03, temple: 0.02, socket: 0.016, brow: 0.024, chin: 0.012 },
  broad:     { w: 0.54, sq: 2.6, chinL: -0.05, jaw: 0.9, low: 3, cheek: 0.012, gonion: 0.012, brow: 0.02 },
  elfin:     { w: 0.45, jaw: 0.42, low: 1.7, cheek: 0.022, hollow: 0.01, chin: 0.008, tall: 0.02, brow: 0.006, socket: 0.006 },
  brute:     { w: 0.52, d: 0.56, sq: 2.8, low: 4, jaw: 1.04, jawTo: 0.4, slope: 0.12, brow: 0.055, socket: 0.016, chin: 0.03, gonion: 0.03, cheek: 0.012 },
  noble:     { w: 0.45, tall: 0.04, chinL: 0.05, jaw: 0.76, low: 2.6, chin: 0.024, cheek: 0.016, hollow: 0.008, brow: 0.018, bridge: 0.014 },
  cherub:    { w: 0.51, sq: 2.0, top: 1.9, low: 1.9, jaw: 0.64, front: 0.96, back: 1.18, chinL: -0.05, cheek: 0.02, brow: 0.002, socket: 0.003, chin: 0.004, lips: 0.01 },
  wedge:     { w: 0.47, sq: 3.4, low: 1.75, jaw: 0.55, cheek: 0.02, hollow: 0.014, chin: 0.016, brow: 0.024 },
  jowly:     { w: 0.5, sq: 2.4, low: 2.8, jaw: 0.98, jowl: 0.03, cheek: 0.008, brow: 0.018, socket: 0.012, chin: 0.004, lips: 0.004 },
  hawk:      { w: 0.44, chinL: 0.06, chin: -0.02, slope: 0.14, brow: 0.036, socket: 0.014, bridge: 0.026, cheek: 0.012, hollow: 0.012, jaw: 0.68 },
  moon:      { w: 0.54, sq: 2.2, front: 0.82, jaw: 0.88, low: 2.3, chinL: -0.05, cheek: 0.012, brow: 0.006, socket: 0.004, bridge: 0.002 },
  chiselled: { w: 0.47, sq: 2.8, low: 3.2, jaw: 0.84, brow: 0.026, socket: 0.012, cheek: 0.022, hollow: 0.02, chin: 0.02, cleft: 0.005, gonion: 0.018 },
  dome:      { w: 0.46, top: 1.8, tall: 0.07, jaw: 0.68, low: 2.2, back: 1.16, occ: 0.02, brow: 0.01, chin: 0.008 },
  pack:      { w: 0.49, sq: 2.9, top: 2.3, low: 3.4, jaw: 0.8, front: 0.95, back: 1.1, brow: 0, socket: 0, bridge: 0, cheek: 0, lips: 0, chin: 0 },
};
/** the twenty, in the board's order (the pack's box left out) */
export const HEAD_SHAPES = Object.keys(HEADS).filter((k) => k !== 'pack');
const HEADQ = Object.fromEntries(Object.entries(HEADS).map(([k, v]) => [k, { ...HEAD0, ...v }]));
const spow = (v, e) => Math.sign(v) * Math.pow(Math.abs(v), e), G = (d, w) => Math.exp(-(d / w) * (d / w));
const DEPTH = 1.6;                                                 // the sculpting's strength over the numbers (the first board's read too faint)
/** a point on the painted skull: th the angle round it (0 the front, +x to the right as you face it), s the height (0 the chin, 1 the crown) */
function eggAt(th, s, f, out = new THREE.Vector3()) {
  const H = HEADQ[f.head] || HEADQ.shield, yU = 2 * s - 1, m = yU > 0 ? H.top : H.lowF ? lerp(H.low, H.lowF, Math.max(0, Math.cos(th)) ** 2) : H.low,
    r = Math.pow(Math.max(0, 1 - Math.pow(Math.abs(yU), m)), 1 / m);
  // (lowF: the face's front squarer at the bottom than the back, the chin forward under the mouth)
  let x = spow(Math.sin(th), 2 / H.sq) * r, z = spow(Math.cos(th), 2 / H.sq) * r;
  x *= lerp(H.jaw, 1, smooth(0.0, H.jawTo, s));                                          // the jaw drawn in toward the chin
  z *= z > 0 ? H.front * lerp(0.92, 1, smooth(0.0, 0.45, s)) * (1 - H.slope * smooth(0.55, 1, s)) : H.back * lerp(1 - H.nape, 1, smooth(0.0, 0.45, s));   // (the back of the skull curving in toward the neck, as the jaw does at the sides)   // the face's front (a forehead sloped back), the skull's back
  if (H.flat && z > 0) z = (z + H.flat - Math.sqrt((z - H.flat) * (z - H.flat) + H.flatK * H.flatK)) / 2;   // a flat face plane, the sides turning back from it (a soft min)
  const lo = Math.max(0, 1 - s / 0.24);
  out.set(x * H.w, EGG.cy + yU * EGG.ay - H.chinL * lo * lo + H.tall * smooth(0.5, 1, s), EGG.cz + z * H.d);
  // the sculpting: a push along the face (z) at the front, outward round the sides (x and z), each a soft hill or dent
  const a = Math.abs(th), sx = Math.sin(th), cz = Math.cos(th), front = Math.max(0, cz), eS = (PE.y - CHIN) / HH, bS = eS + 0.1 / HH;   // (the eye line's and the brows' heights)
  const dz = H.brow * G(s - bS, 0.04) * G(th, 0.62) * front       // the brow ridge over the eyes
    - H.socket * G(s - eS, 0.045) * G(a - 0.38, 0.16)              // the eyes set in
    + H.bridge * G(th, 0.07 + 0.05 * smooth(0.45, 0.28, s)) * smooth(0.24, 0.3, s) * smooth(bS + 0.02, eS - 0.02, s) * lerp(1, 0.45, smooth(0.3, eS, s))   // the nose's bridge, widening to its tip, down from the brow
    + H.lips * G(s - 0.18, 0.035) * G(th, 0.3)                       // the lips' fullness
    + H.chin * G(s - 0.06, 0.06) * G(th, 0.32) * front               // the chin's point
    + H.muzzle * G(s - 0.19, 0.1) * G(th, 0.5) * front              // the mouth's and the jaw's front pushed out, as a face's is
    + H.cheekF * G(s - 0.32, 0.08) * G(a - 0.5, 0.25)                 // the cheeks' fullness under the eyes
    - H.cleft * G(s - 0.06, 0.045) * G(th, 0.05);                    // a cleft in it
  const side = H.cheek * G(s - 0.37, 0.07) * G(a - 0.8, 0.3)        // cheekbones under the eyes' outer corners
    - H.hollow * G(s - 0.22, 0.065) * G(a - 0.95, 0.32)              // the hollows under them
    + H.gonion * G(s - 0.11, 0.07) * G(a - 1.35, 0.35)               // the jaw's corners
    - H.temple * G(s - 0.64, 0.08) * G(a - 1.3, 0.32)                // the temples drawn in
    + H.jowl * G(s - 0.1, 0.07) * G(a - 0.95, 0.35)                  // jowls
    + H.occ * G(s - 0.6, 0.16) * G(a - Math.PI, 0.9);               // the back of the skull, fuller
  out.x += DEPTH * side * sx; out.z += DEPTH * (dz + side * cz); out.y -= H.jowl * 0.6 * G(s - 0.1, 0.07) * G(a - 0.95, 0.35);
  const [w, h, d, ns, ball] = BUMP[f.nose] || BUMP.kk, dx = out.x / w, dy = (s - ns) * HH / h, r2 = dx * dx + dy * dy;
  if (cz > 0) out.z += d * (ball ? Math.exp(-r2 * r2) : Math.exp(-r2)) * (f.nose === 'snub' && dy > 0 ? 0.8 : 1);   // (a ball: steep sides, a round top)
  if (f.nose === 'hook' && cz > 0) out.y -= 0.02 * Math.exp(-dx * dx - dy * dy);
  return out;
}
/** the painted skull (a triangle soup, as the kit's shells want), shaped by the face's shape */
function eggSkull(f, S) {
  const NT = 72, NS = 52, P = [], I = [], v = new THREE.Vector3(), A = 0.45;   // (the angles packed toward the face: twice the grid there, for the nose and the face's volume)
  for (let j = 0; j <= NS; j++) for (let i = 0; i <= NT; i++) { const t = -1 + (2 * i) / NT; eggAt(Math.PI * (A * t + (1 - A) * t * t * t), j / NS, f, v); if (S) S(v); P.push(v.x, v.y, v.z); }
  for (let j = 0; j < NS; j++) for (let i = 0; i < NT; i++) { const a = j * (NT + 1) + i, b = a + 1, c = a + NT + 1, d = c + 1; I.push(a, b, c, b, d, c); }   // (wound outward: the kit's shells grow off it and keep its facing)
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(P, 3)); g.setIndex(I); g.computeVertexNormals();
  return g.toNonIndexed();
}
// the mask: the front of the skull from TH left to TH right and S0 to S1 up, a little proud of it; its picture's u and v
const TH = 1.15, S0 = 0.06, S1 = 0.84, LIFT = 0.006;
function faceMask(f, S) {
  const NU = 56, NV = 48, P = [], U = [], I = [], v = new THREE.Vector3(), a = new THREE.Vector3(), b = new THREE.Vector3(), n = new THREE.Vector3(), e = 0.004;
  for (let j = 0; j <= NV; j++) for (let i = 0; i <= NU; i++) {
    const th = -TH + (2 * TH * i) / NU, s = S0 + ((S1 - S0) * j) / NV, at = (t, q, o) => { eggAt(t, q, f, o); if (S) S(o); return o; };
    at(th, s, v); n.crossVectors(at(th, s + e, a).sub(at(th, s - e, b)), at(th + e, s, b).sub(at(th - e, s, n.clone()))).normalize();
    if (n.z < 0 && Math.abs(th) < 1.4) n.negate();
    U.push(toU(v.x), toV(v.y)); v.addScaledVector(n, LIFT); P.push(v.x, v.y, v.z);   // (the picture by where the point is, not its angle: a narrow head or a long jaw keeps the features' spacing)
  }
  for (let j = 0; j < NV; j++) for (let i = 0; i < NU; i++) { const p = j * (NU + 1) + i, q = p + 1, r = p + NU + 1, t = r + 1; I.push(p, q, r, q, t, r); }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(P, 3)); g.setAttribute('uv', new THREE.Float32BufferAttribute(U, 2)); g.setIndex(I); g.computeVertexNormals();
  return g;
}

// the picture: authored in the head's own units on its front (x across, y up), drawn where the mask carries that point
const PX = 512, toU = (x) => (Math.asin(Math.max(-0.98, Math.min(0.98, x / 0.52))) + TH) / (2 * TH), toV = (y) => ((y - CHIN) / HH - S0) / (S1 - S0);
const cx = (x) => toU(x) * PX, cy = (y) => (1 - toV(y)) * PX, kx = PX / (2 * TH * 0.5), ky = PX / ((S1 - S0) * HH);   // (px a unit across, up)
const hex = (c) => '#' + c.getHexString();
// the eyes (the owner, 2026-11-12: "I dont like … the big eyes", then a reference head to map): small dark ovals with a
// glint, low on the face (the eye line under the head's middle, the brows just over them, the nose a ball, a wide thin mouth)
const PE = { x: 0.165, y: 0.37, rx: 0.04, ry: 0.05 };
const PEYES = { round: { w: 1, h: 1, tilt: 0 }, wide: { w: 1.1, h: 1.12, tilt: 0, white: true }, narrow: { w: 1.08, h: 0.72, tilt: 0.04, lash: true }, tired: { w: 1, h: 0.95, tilt: -0.08, lid: 0.32, bags: true }, sharp: { w: 1.12, h: 0.8, tilt: 0.22, lash: true } };
const PBROWS = { straight: { w: 0.12, t: 0.046, arch: 0.006, tilt: 0 }, arched: { w: 0.12, t: 0.042, arch: 0.034, tilt: 0 }, heavy: { w: 0.13, t: 0.066, arch: 0.008, tilt: 0.05 }, angry: { w: 0.12, t: 0.052, arch: 0.004, tilt: 0.2 }, worried: { w: 0.115, t: 0.044, arch: 0.012, tilt: -0.2 }, thin: { w: 0.11, t: 0.026, arch: 0.016, tilt: 0 } };
// an expression: the brows turned (+ inner end down), raised, lids, and the mouth it wears (null: the face's own)
const PEXPR = {
  neutral:   { brow: 0, lift: 0, lid: 0, mouth: null },
  smile:     { brow: -0.02, lift: 0.004, lid: 0, mouth: 'smile', cheek: true },
  happy:     { brow: -0.06, lift: 0.012, lid: 0, mouth: 'grin', cheek: true, glad: true },
  stern:     { brow: 0.2, lift: -0.008, lid: 0.24, mouth: 'grim' },
  sad:       { brow: -0.22, lift: 0.004, lid: 0.12, mouth: 'frown', tear: true },
  smug:      { brow: 0.05, lift: 0, lid: 0.34, mouth: 'smirk', oneBrow: true },
  surprised: { brow: -0.1, lift: 0.028, lid: 0, mouth: 'open', small: true },
  fierce:    { brow: 0.26, lift: -0.01, lid: 0.18, mouth: 'fangs', creases: true },
};
const faceCache = new Map();
/** the face's picture, a canvas texture shared by every face drawn alike */
function facePicture(f) {
  const ex = PEXPR[f.expression] || PEXPR.neutral, key = JSON.stringify([f.skin, f.hairColor, f.browColor, f.eyes, f.iris, f.brows, f.mouth, f.marks, f.expression, f.lashes]);
  if (faceCache.has(key)) return faceCache.get(key);
  const c = document.createElement('canvas'); c.width = c.height = PX; const g = c.getContext('2d');
  const skin = col(SKIN, f.skin, SKIN.fair), hairC = col(HAIR, f.browColor || f.hairColor, HAIR.brown), dark = lumOf(skin) < 0.28;
  // (no skin under the features: the skull's own shows through, so the mask never shows as a patch of another tone under
  // the game's light; a lid or a blush is painted in the skin's colour where it is)
  const P = (x, y) => [cx(x), cy(y)];
  const ink = '#1a110d', mouthC = hex(skin.clone().lerp(new THREE.Color('#3a1210'), 0.78)), lipC = hex(toned(skin, '#a04a40', 0.32, 0.84));
  // cheeks (a smile's, a blush): soft, the skin turned rose
  const cheeks = (a) => { for (const sd of [-1, 1]) { const [x, y] = P(sd * 0.25, 0.3), r = 0.06 * kx; const q = g.createRadialGradient(x, y, 0, x, y, r); q.addColorStop(0, hex(toned(skin, '#e05a58', 0.35, 1.0)) + Math.round(a * 255).toString(16).padStart(2, '0')); q.addColorStop(1, hex(skin) + '00'); g.fillStyle = q; g.fillRect(x - r, y - r, 2 * r, 2 * r); } };
  if (ex.cheek || (f.marks || []).includes('blush')) cheeks(ex.cheek ? 0.45 : 0.6);
  // the eyes: a big dark eye, the iris ringed in its colour, a glint; lids for a mood; a lash flick
  const E = PEYES[f.eyes] || PEYES.round, irisC = col(IRIS, f.iris, IRIS.brown), patched = (f.marks || []).includes('eyepatch');
  for (const sd of [-1, 1]) {
    if (patched && sd > 0) continue;
    const [ex0, ey0] = P(sd * PE.x, PE.y + ex.lift * 0.4), rx = PE.rx * E.w * kx, ry = PE.ry * E.h * ky * (ex.small ? 1.08 : 1), tilt = sd * E.tilt;
    g.save(); g.translate(ex0, ey0); g.rotate(-tilt);
    if (ex.small) { g.fillStyle = '#ece4d6'; g.beginPath(); g.ellipse(0, 0, rx * 1.2, ry * 1.1, 0, 0, Math.PI * 2); g.fill(); }   // (surprise: the white shows round it)
    g.fillStyle = ink; g.beginPath(); g.ellipse(0, 0, rx * (ex.small ? 0.75 : 1), ry * (ex.small ? 0.8 : 1), 0, 0, Math.PI * 2); g.fill();   // a small dark eye, a little taller than wide
    g.fillStyle = hex(irisC.clone().multiplyScalar(0.8)); g.globalAlpha = 0.55; g.beginPath(); g.ellipse(0, ry * 0.25, rx * 0.62, ry * 0.5, 0, 0, Math.PI * 2); g.fill(); g.globalAlpha = 1;   // the iris's colour, a glow low in it
    g.fillStyle = '#ffffff'; g.beginPath(); g.ellipse(rx * 0.32, -ry * 0.3, rx * 0.36, ry * 0.3, 0, 0, Math.PI * 2); g.fill();   // the glint, high on the light's side
    const lid = Math.max(E.lid || 0, ex.lid) * (ex.oneBrow && sd < 0 ? 0.25 : 1);
    if (lid > 0) {                                                // the lid over the eye's top, in the skin, its edge a dark line
      const ly = -ry + 2 * ry * lid, slant = sd * (ex.brow > 0 ? 0.25 : ex.brow < 0 ? -0.2 : 0) * ry;
      g.fillStyle = hex(skin); g.beginPath(); g.moveTo(-rx * 1.3, -ry * 1.3); g.lineTo(rx * 1.3, -ry * 1.3); g.lineTo(rx * 1.3, ly - slant); g.lineTo(-rx * 1.3, ly + slant); g.closePath(); g.fill();
      g.strokeStyle = ink; g.lineWidth = ry * 0.16; g.lineCap = 'round'; g.beginPath(); g.moveTo(-rx * 0.98, ly + slant * 0.98); g.lineTo(rx * 0.98, ly - slant * 0.98); g.stroke();
    }
    if (ex.glad) { g.strokeStyle = hex(skin); g.lineWidth = ry * 0.5; g.beginPath(); g.ellipse(0, ry * 1.05, rx * 1.2, ry * 0.7, 0, Math.PI * 1.1, Math.PI * 1.9); g.stroke(); }   // (a happy eye's lower lid rising)
    if (E.lash || f.lashes) { g.strokeStyle = ink; g.lineWidth = ry * 0.14; g.lineCap = 'round'; g.beginPath(); g.moveTo(sd * rx * 0.7, -ry * 0.72); g.quadraticCurveTo(sd * rx * 1.2, -ry * 0.9, sd * rx * 1.45, -ry * 1.05); g.stroke(); }
    if (E.bags) { g.strokeStyle = hex(skin.clone().multiplyScalar(0.72)); g.lineWidth = ry * 0.1; g.beginPath(); g.ellipse(0, ry * 0.95, rx * 0.8, ry * 0.3, 0, Math.PI * 0.15, Math.PI * 0.85); g.stroke(); }
    g.restore();
  }
  if (patched) {                                                 // a patch over the right eye, its strap across the brow
    const [x, y] = P(PE.x, PE.y); g.fillStyle = '#1c1616'; g.beginPath(); g.ellipse(x, y, PE.rx * 1.6 * kx, PE.ry * 2.1 * ky, 0, 0, Math.PI * 2); g.fill();
    g.strokeStyle = '#1c1616'; g.lineWidth = 0.018 * ky; g.beginPath(); g.moveTo(...P(-0.5, 0.68)); g.lineTo(...P(0.5, 0.36)); g.stroke();
  }
  // the brows: thick tapered strokes in the hair's colour, turned by the mood
  const B = PBROWS[f.brows] || PBROWS.straight, browC = hex(hairC.clone().multiplyScalar(dark ? 0.9 : 0.5));
  for (const sd of [-1, 1]) {
    const tilt = B.tilt + ex.brow * (ex.oneBrow && sd < 0 ? -0.6 : 1), y0 = PE.y + 0.1 + ex.lift + (ex.oneBrow && sd < 0 ? 0.02 : 0);
    const inner = [sd * 0.075, y0 - tilt * 0.05], outer = [sd * (0.075 + B.w * 1.15), y0 + tilt * 0.03 - B.arch * 0.3], mid = [sd * (0.075 + B.w * 0.6), y0 + B.arch + tilt * 0.005];
    const [ix, iy] = P(...inner), [mx, my] = P(...mid), [ox, oy] = P(...outer), t = B.t * 1.25 * ky;   // a thick stroke, round at both ends
    g.strokeStyle = browC; g.lineCap = 'round'; g.lineWidth = t; g.beginPath(); g.moveTo(ix, iy); g.quadraticCurveTo(mx, my - t * 0.25, ox, oy); g.stroke();
  }
  if (ex.creases) { g.strokeStyle = browC; g.lineWidth = 0.008 * ky; for (const d of [-0.02, 0.02]) { g.beginPath(); g.moveTo(...P(d - 0.01, PE.y + 0.07)); g.lineTo(...P(d * 1.4, PE.y + 0.13)); g.stroke(); } }   // a scowl's lines between the brows
  // the mouth: a short line, curved for the mood; teeth or fangs where it shows them
  const kind = ex.mouth || f.mouth || 'line', my = 0.14, mw = 0.115;
  const curve = { line: 0, smile: 0.022, grin: 0.03, frown: -0.014, smirk: 0, grim: -0.01, open: 0, fangs: -0.012 }[kind] ?? 0;
  g.lineCap = 'round'; g.strokeStyle = mouthC; g.lineWidth = (kind === 'grim' ? 0.02 : 0.014) * ky;
  if (kind === 'open') { const [x, y] = P(0, my); g.fillStyle = mouthC; g.beginPath(); g.ellipse(x, y, (ex.small ? 0.026 : 0.04) * kx, (ex.small ? 0.032 : 0.03) * ky, 0, 0, Math.PI * 2); g.fill(); }
  else if (kind === 'grin') {                                      // a wide open smile, the top teeth showing
    g.fillStyle = mouthC; g.beginPath(); g.moveTo(...P(-mw, my + 0.012)); g.quadraticCurveTo(...P(0, my - 0.07), ...P(mw, my + 0.012)); g.closePath(); g.fill();
    g.fillStyle = '#f4efe6'; g.beginPath(); g.moveTo(...P(-mw * 0.8, my + 0.006)); g.lineTo(...P(mw * 0.8, my + 0.006)); g.lineTo(...P(mw * 0.6, my - 0.012)); g.lineTo(...P(-mw * 0.6, my - 0.012)); g.closePath(); g.fill();
  } else if (kind === 'smirk') { g.beginPath(); g.moveTo(...P(-mw * 0.8, my - 0.004)); g.quadraticCurveTo(...P(0.01, my - 0.01), ...P(mw, my + 0.022)); g.stroke(); }
  else {
    g.beginPath(); g.moveTo(...P(-mw, my + curve)); g.quadraticCurveTo(...P(0, my - curve), ...P(mw, my + curve)); g.stroke();
    if (kind === 'fangs') { g.fillStyle = '#f4efe6'; for (const sd of [-1, 1]) { g.beginPath(); g.moveTo(...P(sd * 0.03, my + 0.004)); g.lineTo(...P(sd * 0.045, my + 0.002)); g.lineTo(...P(sd * 0.038, my - 0.03)); g.closePath(); g.fill(); } }
  }
  if (kind !== 'open' && kind !== 'grin' && !dark) { g.strokeStyle = lipC; g.lineWidth = 0.008 * ky; g.beginPath(); g.moveTo(...P(-0.025, my - 0.026)); g.quadraticCurveTo(...P(0, my - 0.036), ...P(0.025, my - 0.026)); g.globalAlpha = 0.6; g.stroke(); g.globalAlpha = 1; }   // (the lower lip, a hint)
  // marks
  for (const m of f.marks || []) {
    if (m === 'scar') { g.strokeStyle = hex(toned(skin, '#d07a70', 0.45, 1.05)); g.lineWidth = 0.014 * ky; g.beginPath(); g.moveTo(...P(0.1, PE.y + 0.2)); g.lineTo(...P(0.27, PE.y - 0.08)); g.stroke();   // across the right brow, the pack's slash
      g.lineWidth = 0.006 * ky; for (const t of [0.3, 0.55, 0.8]) { const x = lerp(0.1, 0.27, t), y = lerp(PE.y + 0.2, PE.y - 0.08, t); g.beginPath(); g.moveTo(...P(x - 0.025, y - 0.012)); g.lineTo(...P(x + 0.025, y + 0.012)); g.stroke(); } }
    if (m === 'scar_cheek') { g.strokeStyle = hex(toned(skin, '#d07a70', 0.45, 1.05)); g.lineWidth = 0.012 * ky; g.beginPath(); g.moveTo(...P(-0.32, 0.36)); g.lineTo(...P(-0.2, 0.24)); g.stroke(); }
    if (m === 'freckles') { g.fillStyle = hex(toned(skin, '#6a2a10', 0.5, 0.74)); for (const sd of [-1, 1]) for (const [x, y] of [[0.2, 0.33], [0.25, 0.31], [0.29, 0.34], [0.23, 0.36], [0.27, 0.28], [0.32, 0.31]]) { g.beginPath(); g.arc(...P(sd * x, y), 0.006 * kx, 0, Math.PI * 2); g.fill(); } }
    if (m === 'wrinkles') { g.strokeStyle = hex(skin.clone().multiplyScalar(0.74)); g.lineWidth = 0.007 * ky; for (const y of [0.74, 0.79]) { g.beginPath(); g.moveTo(...P(-0.15, y)); g.quadraticCurveTo(...P(0, y + 0.012), ...P(0.15, y)); g.stroke(); } }
    if (m === 'warpaint') { g.fillStyle = 'rgba(232,226,214,0.9)'; g.beginPath(); g.moveTo(...P(0.12, 0.54)); g.lineTo(...P(0.16, 0.54)); g.lineTo(...P(0.3, 0.26)); g.lineTo(...P(0.26, 0.26)); g.closePath(); g.fill();   // a stripe down through the right eye
      g.beginPath(); g.moveTo(...P(0.12, 0.38)); g.lineTo(...P(0.32, 0.38)); g.lineTo(...P(0.32, 0.36)); g.lineTo(...P(0.12, 0.36)); g.closePath(); g.fill(); }
  }
  if (ex.tear) { g.fillStyle = 'rgba(180,215,240,0.85)'; for (const sd of [-1, 1]) { g.beginPath(); g.ellipse(...P(sd * (PE.x - 0.02), PE.y - PE.ry - 0.03), 0.008 * kx, 0.016 * ky, 0, 0, Math.PI * 2); g.fill(); } }
  const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 4;
  tex.generateMipmaps = false; tex.minFilter = THREE.LinearFilter;   // (no averaging down: at a 20 px head the eyes stay dark pixels, as the far face's dot eyes did)
  faceCache.set(key, tex); return tex;
}
/** (a debug look at a face's picture: the canvas) */
export const facePictureOf = (f) => facePicture(f).image;
/** the painted head: skull, mask and picture, with the kit's ears, hair, beards and an earring on it */
async function paintedFace(load, model, f) {
  const mine = await kkHead(load, model), S = SHAPES[f.shape] || null;
  const skin = col(SKIN, f.skin, SKIN.fair), hairC = col(HAIR, f.hairColor, HAIR.brown);
  const M = { skin: std(skin, 0.72), hair: std(hairC, 0.85), beard: std(col(HAIR, f.beardColor, hairC), 0.9), stubble: std(skin.clone().multiplyScalar(0.7).lerp(col(HAIR, f.beardColor, hairC), 0.35), 1),
    gold: std('#d8a848', 0.3, 0.8), tie: std(col(HAIR, f.tieColor, '#6a3a22'), 0.8), earIn: std(skin.clone().multiplyScalar(0.62).lerp(new THREE.Color('#7a3a34'), 0.25), 0.9) };
  const head = new THREE.Group(); head.name = 'Face';
  const tag = (o, part) => { o.traverse((q) => { if (q.isMesh && !q.userData.part) q.userData.part = part; }); return o; };
  const skull = eggSkull(f, S);
  head.add(tag(new THREE.Mesh(skull, M.skin), 'skin'));
  const face = new THREE.Mesh(faceMask(f, S), new THREE.MeshStandardMaterial({ map: facePicture(f), alphaTest: 0.35, roughness: 0.72, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 }));   // (alphaTest, a cutout: the game's figure fade sets `transparent` by its opacity, world.js, and an opaque mask drew its clear parts black)
  face.name = 'FaceMask'; head.add(tag(face, 'eye'));
  if ((BUMP[f.nose] || BUMP.kk)[4] === 'ball') {                 // the ball nose: a mesh of its own (the skull's grid is too coarse for a round one)
    const [w, h, , ns] = BUMP[f.nose] || BUMP.kk, p = eggAt(0, ns, f); if (S) S(p);
    const n = new THREE.Mesh(new THREE.SphereGeometry(1, 24, 18), M.skin); n.scale.set(w * 1.1, h, w * 0.8); n.position.set(p.x, p.y, p.z - w * 0.25); head.add(tag(n, 'skin'));
  }
  if (f.ears === 'pointed') head.add(tag(ears(f, M, S), 'skin'));
  else for (const sd of [-1, 1]) {                                // the pack's ears: flat, a fair size, set back at the eyes' and nose's height
    const p = eggAt(sd * Math.PI / 2, 0.355, f), ear = new THREE.Group(); if (S) S(p);
    ear.position.set(p.x + sd * 0.012, p.y, p.z - 0.05); ear.rotation.y = -sd * 0.6;   // (big, flared out and forward, standing clear of the hair: the reference's)
    const plate = new THREE.Mesh(new THREE.SphereGeometry(0.1, 18, 14), M.skin); plate.scale.set(0.32, 1.35, 0.95); ear.add(plate);
    const rim = new THREE.Mesh(new THREE.TorusGeometry(0.082, 0.024, 8, 28, Math.PI * 1.55), M.skin);   // the rim, a C open toward the face
    rim.scale.set(0.95, 1.32, 1); rim.position.x = sd * 0.018; rim.rotation.set(0, sd * Math.PI / 2, sd > 0 ? Math.PI * 1.225 : Math.PI * 0.225); ear.add(rim);
    const inner = new THREE.Mesh(new THREE.SphereGeometry(0.06, 14, 10), M.earIn); inner.scale.set(0.22, 1.1, 0.75); inner.position.set(sd * 0.016, -0.008, 0.008); ear.add(inner);
    head.add(tag(ear, 'skin'));
  }
  const on = surface(skull);
  head.add(tag(await beard(load, skull, on, f, M, S), 'hair'));
  if ((f.marks || []).includes('earring')) head.add(marks(on, { ...f, marks: ['earring'] }, M));
  const hr = await hair(load, skull, f, M, S, true); hr.name = 'Hair'; head.add(tag(hr, 'hair'));
  if (HAIRS[f.hair]?.kk) hr.traverse((o) => { if (o.isMesh) o.geometry = filterTris(o.geometry, () => true, (v) => { v.x *= 1.06; grow(0.12)(v); }); });   // (KayKit's own long cuts were made for its smaller crown: out over ours)
  head.traverse((o) => { if (o.isMesh) { o.frustumCulled = false; o.userData.face = true; } });
  return { head, replaces: [mine.headName], skull, on };
}

// every option of every part, for the face board (faces.cjs) and faces.json authors
export const OPTIONS = {
  hair: Object.keys(HAIRS), eyes: Object.keys(EYES), brows: Object.keys(BROWS), mouth: Object.keys(MOUTHS),
  nose: ['kk', ...Object.keys(NOSES)], beard: [null, 'stubble', 'short', 'goatee', 'mustache', 'full'],
  marks: ['scar', 'scar_cheek', 'freckles', 'blush', 'wrinkles', 'eyepatch', 'earring'], ears: [null, 'pointed'], skin: Object.keys(SKIN), iris: Object.keys(IRIS), shape: Object.keys(SHAPES),
};

// ── a face ────────────────────────────────────────────────────────────────────
/** Build a face for a variant: the head group to put under the head bone, and the names of the
 * KayKit head meshes it replaces. `far` builds the atlas version (dot eyes, no marks, no lip).
 * @param {(url: string) => Promise<any>} load @param {string} model @param {any} f the face */
export async function buildFace(load, model, f, { far = false } = {}) {
  if ((f.style || STYLE) === 'painted' && f.skull !== 'own') return paintedFace(load, model, f);   // (the painted head: the face spike, below)
  const own = f.skull === 'own';
  const base = own ? await kkHead(load, model) : null, mine = await kkHead(load, model);
  const skin = col(SKIN, f.skin, SKIN.fair), hairC = col(HAIR, f.hairColor, HAIR.brown);
  const M = {
    skin: std(skin, 0.72), hair: std(hairC, 0.85), brow: std(col(HAIR, f.browColor, hairC.clone().multiplyScalar(0.72)), 0.9),
    beard: std(col(HAIR, f.beardColor, hairC), 0.9), stubble: std(skin.clone().multiplyScalar(0.7).lerp(col(HAIR, f.beardColor, hairC), 0.35), 1),
    white: std('#f2ece2', 0.35), iris: std(col(IRIS, f.iris, IRIS.brown), 0.3), pupil: std('#120c0a', 0.4), glint: new THREE.MeshBasicMaterial({ color: '#ffffff' }),
    lash: std('#1c120e', 0.8), lid: std(skin.clone().multiplyScalar(0.94), 0.72), crease: std(skin.clone().multiplyScalar(0.78), 0.95),
    mouth: std(skin.clone().lerp(new THREE.Color('#3a1210'), 0.7), 0.95), lip: std(toned(skin, '#a04a40', 0.3, 0.86), 0.95),
    scar: std(toned(skin, '#a04a44', 0.35, 0.8), 0.9), freckle: std(toned(skin, '#6a2a10', 0.5, 0.74), 0.9),
    blush: std(toned(skin, '#e05a58', 0.3, 1.02), 0.8), patch: std('#1a1414', 0.7), gold: std('#d8a848', 0.3, 0.8), tie: std(col(HAIR, f.tieColor, '#6a3a22'), 0.8),
    earIn: std(skin.clone().multiplyScalar(0.62).lerp(new THREE.Color('#7a3a34'), 0.25), 0.9),
  };
  const head = new THREE.Group(); head.name = 'Face';
  // the skull: skin in the chosen tone; an own head keeps its other kept tiles (a hood) textured
  const S = SHAPES[f.shape], sh = (g) => (S && g ? filterTris(g, () => true, S, false) : g);   // (smooth normals kept: the deformations are gentle)
  const B0 = own ? null : await bald(load), B = B0 && { skin: sh(B0.skin), wedge: sh(B0.wedge), whole: sh(B0.whole), noNose: sh(B0.noNose) };
  const skull = own ? sh(base.parts['0,0']) : B.whole;
  const ownNose = own || !NOSES[f.nose], patch = ownNose ? null : sh(nosePatch(surface(B0.whole)));
  // (art pass 7) every part says what it is (userData.part: skin · hair · eye · brow · mouth), so the atlas
  // bake can keep the features whole and grade a face apart from its clothes (lab.js)
  const tag = (g, part) => { g.traverse((o) => { if (o.isMesh && !o.userData.part) o.userData.part = part; }); return g; };   // (an eye already knows which it is)
  head.add(tag(new THREE.Mesh(own ? skull : ownNose ? B.skin : B.noNose, M.skin), 'skin'));
  if (patch) head.add(tag(new THREE.Mesh(patch, M.skin), 'skin'));
  if (B) head.add(tag(new THREE.Mesh(B.wedge, far ? M.skin : M.lip), 'skin'));
  if (own) for (const t of f.keep || ['1,1']) if (base.parts[t]) head.add(new THREE.Mesh(sh(base.parts[t]), base.material));
  const onShaped = surface(ownNose ? skull : merge(B.noNose, B.wedge, patch));
  const on = S ? (x, y, dir) => { const q = new THREE.Vector3(x, y, 0.45); S(q); return onShaped(q.x, q.y, dir); } : onShaped;   // parts are authored on the normal head
  // the atlas (far) keeps what reads at 56 px — skin, hair, beard, brows, dot eyes, a mouth — and
  // drops the marks, which only turned into smudges there
  head.add(tag(eyes(on, f, M, far), 'eye'), tag(brows(on, f, M), 'brow'), tag(mouth(on, f, M, far), 'mouth'), tag(nose(on, f, M), 'skin'), tag(await beard(load, skull, on, f, M, S), 'hair'));
  head.add(tag(ears(f, M, S), 'skin'));
  if (!far) head.add(marks(on, f, M));
  if (!own) { const hr = await hair(load, skull, f, M, S); hr.name = 'Hair'; head.add(tag(hr, 'hair')); }   // (named: a helm worn hides it, gear.js)
  head.traverse((o) => { if (o.isMesh) { o.frustumCulled = false; o.userData.face = true; } });
  return { head, replaces: [mine.headName], skull, on };
}
