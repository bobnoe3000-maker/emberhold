// body.js — MOCK-UP (docs/body-mockup.md): our own bodies on KayKit's skeleton and animations.
// Every KayKit mesh is hidden; what you see is built here in code and SKINNED to the kit's rig
// (the same bones, bind pose and 76–95 clips), so every KayKit animation drives it:
//
//   body       torso, neck, arms, hands, legs and feet as low-poly tubes; each ring of vertices
//              is weighted to its bone and blended across the joint, so elbows and knees bend
//   builds     thin · normal · thick: widths and girths only (bone lengths are untouched, so the
//              clips still fit); thick adds a belly, front only
//   outfits    the body's own colours are the clothes (as KayKit's are), plus layers: breastplate,
//              pauldrons, vambraces, greaves, belt, pouches, tabard, cape, mantle, robe skirt
//              (each half follows its thigh)
//   heads      the face kit (faces.js) with any face shape; headgear — helm, hood, coif, wizard
//              hat — is grown off the SHAPED skull, so it fits every face shape
//   weapons    code-built props in the hand slots (props.js), as the kits' weapons sit
//
// Units are KayKit's bind space (T-pose): feet at y 0, hips 0.41, chest 0.97, head bone 1.24,
// arms along ±x (left = +x), the figure facing +z.
import * as THREE from 'three';
import { buildFace, shellOf } from './faces.js';

const V = (x, y, z) => new THREE.Vector3(x, y, z);
const smooth = (a, b, x) => { const t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
const lerp = (a, b, t) => a + (b - a) * t;
const std = (c, r = 0.8, m = 0) => new THREE.MeshStandardMaterial({ color: c, roughness: r, metalness: m });

export const BUILDS = {
  thin:   { w: 0.76, d: 0.8, limb: 0.72, belly: 0, hip: 0.84 },
  normal: { w: 1, d: 1, limb: 1, belly: 0, hip: 1 },
  thick:  { w: 1.32, d: 1.34, limb: 1.34, belly: 0.12, hip: 1.22 },
};

// one skinned mesh's worth of vertices: positions, up to 4 bone weights each, triangles
class Soup {
  constructor(bones) { this.bones = bones; this.P = []; this.SI = []; this.SW = []; this.idx = []; }
  v(p, w) {
    const i = this.P.length / 3; this.P.push(p.x, p.y, p.z);
    const ws = w.filter(([, x]) => x > 1e-4).slice(0, 4), tot = ws.reduce((n, [, x]) => n + x, 0) || 1;
    for (let k = 0; k < 4; k++) { const e = ws[k]; this.SI.push(e ? this.bones[e[0]] ?? 0 : 0); this.SW.push(e ? e[1] / tot : 0); }
    return i;
  }
  p(i) { return V(this.P[i * 3], this.P[i * 3 + 1], this.P[i * 3 + 2]); }
  // a triangle wound so its face points away from `inside`
  tri(a, b, c, inside) {
    const pa = this.p(a), n = this.p(b).sub(pa).cross(this.p(c).sub(pa));
    if (n.dot(pa.clone().add(this.p(b)).add(this.p(c)).multiplyScalar(1 / 3).sub(inside)) < 0) this.idx.push(a, c, b); else this.idx.push(a, b, c);
  }
  mesh(material, skeleton, bindMatrix) {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(this.P, 3));
    g.setAttribute('skinIndex', new THREE.Uint16BufferAttribute(this.SI, 4)); g.setAttribute('skinWeight', new THREE.Float32BufferAttribute(this.SW, 4));
    g.setIndex(this.idx); g.computeVertexNormals();
    const m = new THREE.SkinnedMesh(g, material); m.bind(skeleton, bindMatrix); m.frustumCulled = false; m.userData.body = true; return m;
  }
}

// a ring of `seg` vertices around centre c in the (u, v) plane: radii ru, rv; `front` bulges +v
function ring(S, c, u, v, ru, rv, seg, w, front = 0) {
  const out = [];
  for (let k = 0; k < seg; k++) { const a = (2 * Math.PI * k) / seg, s = Math.sin(a), q = c.clone().addScaledVector(u, Math.cos(a) * ru).addScaledVector(v, s * rv + (s > 0 ? front * s : 0)); out.push(S.v(q, w)); }
  return out;
}
function bridge(S, r0, r1, c0, c1) {
  const n = r0.length, mid = c0.clone().add(c1).multiplyScalar(0.5);
  for (let k = 0; k < n; k++) { const k1 = (k + 1) % n; S.tri(r0[k], r0[k1], r1[k1], mid); S.tri(r0[k], r1[k1], r1[k], mid); }
}
function cap(S, r, c, w, out) { const m = S.v(c, w), inside = c.clone().sub(out.clone().multiplyScalar(0.1)); for (let k = 0; k < r.length; k++) S.tri(m, r[k], r[(k + 1) % r.length], inside); }

// a chain of joints (limbs): rings along it, each weighted to its segment's bone and blended with
// the next / previous bone near the joints. joints: [{ p, r, bone }] (r = [ru, rv])
function chain(S, joints, u, v, seg = 8, { caps = [true, true], steps = 3 } = {}) {
  let prev = null, prevC = null;
  const ringAt = (i, t) => {
    const a = joints[i], b = joints[Math.min(i + 1, joints.length - 1)], c = a.p.clone().lerp(b.p, t);
    const r = [lerp(a.r[0], b.r[0], t), lerp(a.r[1], b.r[1], t)];
    const w = [[a.bone, 1]];
    if (i + 1 < joints.length - 1 || (i + 1 === joints.length - 1 && joints[i + 1].bone !== a.bone)) { const bn = smooth(0.62, 1, t) * 0.5; w[0][1] -= bn; w.push([b.bone, bn]); }
    if (i > 0) { const bp = (1 - smooth(0, 0.38, t)) * 0.5; w[0][1] -= bp; w.push([joints[i - 1].bone, bp]); }
    return { c, r: ring(S, c, u, v, r[0], r[1], seg, w), w };
  };
  const all = [];
  for (let i = 0; i < joints.length - 1; i++) for (let s = 0; s < steps; s++) all.push(ringAt(i, s / steps));
  all.push(ringAt(joints.length - 2, 1));
  for (const q of all) { if (prev) bridge(S, prev.r, q.r, prevC, q.c); prev = q; prevC = q.c; }
  const dir = joints[joints.length - 1].p.clone().sub(joints[0].p).normalize();
  if (caps[0]) cap(S, all[0].r, all[0].c, all[0].w, dir.clone().negate());
  if (caps[1]) cap(S, all[all.length - 1].r, all[all.length - 1].c, all[all.length - 1].w, dir);
}

// the torso's profile: y → [half-width, half-depth] for a build
const TORSO = [[0.36, 0.23, 0.18], [0.46, 0.29, 0.21], [0.62, 0.27, 0.2], [0.82, 0.3, 0.22], [0.98, 0.33, 0.23], [1.1, 0.31, 0.21], [1.18, 0.2, 0.16], [1.25, 0.1, 0.09]];
const torsoW = (y) => { if (y < 0.55) return [['hips', 1]]; if (y < 0.78) { const t = smooth(0.55, 0.78, y); return [['hips', 1 - t], ['spine', t]]; } if (y < 0.98) { const t = smooth(0.78, 0.98, y); return [['spine', 1 - t], ['chest', t]]; } return [['chest', 1]]; };
function torso(S, B, { y0 = 0.36, y1 = 1.25, grow = 0, seg = 12, capBottom = true, capTop = true, flare = 0 } = {}) {
  const rows = TORSO.filter(([y]) => y >= y0 - 1e-6 && y <= y1 + 1e-6);
  const X = V(1, 0, 0), Z = V(0, 0, 1);
  let prev = null, first = null, last = null;
  for (const [y, rx, rz] of rows) {
    const belly = B.belly * smooth(0.55, 0.7, y) * (1 - smooth(0.85, 1.0, y)), hip = y < 0.7 ? lerp(B.hip, B.w, smooth(0.46, 0.7, y)) : B.w;
    const c = V(0, y, 0), r = ring(S, c, X, Z, rx * hip + grow + (y < 0.5 ? flare : 0), rz * B.d + grow, seg, torsoW(y), belly);
    if (prev) bridge(S, prev.r, r, prev.c, c);
    prev = { r, c }; first ||= prev; last = prev;
  }
  if (capBottom) cap(S, first.r, first.c, torsoW(first.c.y), V(0, -1, 0));
  if (capTop) cap(S, last.r, last.c, torsoW(last.c.y), V(0, 1, 0));
}
// a robe's skirt from the waist down: each side follows its thigh, the top the hips
function skirt(S, B, { y0 = 0.62, y1 = 0.1, flare = 0.14, seg = 16, grow = 0.02 } = {}) {
  const rows = 5;
  let prev = null;
  const [, rx0, rz0] = TORSO.find(([y]) => y >= y0) || TORSO[2];
  for (let i = 0; i <= rows; i++) {
    const t = i / rows, y = lerp(y0, y1, t), c = V(0, y, 0), ru = rx0 * B.hip + grow + flare * t, rv = rz0 * B.d + grow + flare * t * 0.8;
    const ids = [];
    for (let k = 0; k < seg; k++) {
      const a = (2 * Math.PI * k) / seg, x = Math.cos(a) * ru, z = Math.sin(a) * rv, side = smooth(-0.1, 0.1, x), top = 1 - smooth(0.42, 0.62, y);   // top: how much the legs move it
      ids.push(S.v(V(x, y, z), [['hips', 1 - top], ['upperlegl', top * side], ['upperlegr', top * (1 - side)]]));
    }
    if (prev) bridge(S, prev.ids, ids, prev.c, c);
    prev = { ids, c };
  }
}
// a flat, slightly curved panel (tabards, capes): corners bottom-left … top-right, weights by y
function panel(S, x0, x1, y0, y1, zAt, weights, cols = 4, rows = 6) {
  const grid = [];
  for (let j = 0; j <= rows; j++) { const y = lerp(y0, y1, j / rows), row = [];
    for (let i = 0; i <= cols; i++) { const x = lerp(x0, x1, i / cols); row.push(S.v(V(x, y, zAt(x, y)), weights(x, y))); } grid.push(row); }
  const toward = V(0, (y0 + y1) / 2, 0);
  for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) { S.tri(grid[j][i], grid[j][i + 1], grid[j + 1][i + 1], toward); S.tri(grid[j][i], grid[j + 1][i + 1], grid[j + 1][i], toward); }
}
function limbs(S, B, part, grow = 0) {
  const L = B.limb, g = grow;
  for (const sd of [1, -1]) {
    const s = sd > 0 ? 'l' : 'r', Y = V(0, 1, 0), Z = V(0, 0, 1), X = V(1, 0, 0);
    if (part.arms) chain(S, [
      { p: V(sd * 0.2, 1.11, 0), r: [0.11 * L + g, 0.1 * L + g], bone: 'upperarm' + s },
      { p: V(sd * 0.45, 1.11, 0), r: [0.088 * L + g, 0.085 * L + g], bone: 'lowerarm' + s },
      { p: V(sd * part.armTo, 1.11, 0), r: [0.072 * L + g, 0.07 * L + g], bone: 'wrist' + s }].slice(0, part.armTo > 0.6 ? 3 : 2), Y, Z, 8, { caps: [true, true] });
    if (part.hands) chain(S, [
      { p: V(sd * 0.7, 1.11, 0), r: [0.075 * L + g, 0.07 * L + g], bone: 'wrist' + s },
      { p: V(sd * 0.8, 1.11, 0), r: [0.088 * L + g, 0.075 * L + g], bone: 'hand' + s },
      { p: V(sd * 0.92, 1.09, 0), r: [0.06 * L + g, 0.055 * L + g], bone: 'hand' + s }], Y, Z, 8);
    if (part.legs) chain(S, [
      { p: V(sd * 0.16, 0.56, 0), r: [0.13 * L * B.hip + g, 0.13 * L + g], bone: 'upperleg' + s },
      { p: V(sd * 0.17, 0.29, 0.01), r: [0.1 * L + g, 0.1 * L + g], bone: 'lowerleg' + s },
      { p: V(sd * 0.17, part.legTo, -0.01), r: [0.08 * L + g, 0.082 * L + g], bone: 'foot' + s }], X, Z, 8, { caps: [false, true] });
    if (part.feet) chain(S, [
      { p: V(sd * 0.17, 0.065, -0.08), r: [0.085 * L + g, 0.07 + g], bone: 'foot' + s },
      { p: V(sd * 0.17, 0.065, 0.05), r: [0.09 * L + g, 0.07 + g], bone: 'toes' + s },
      { p: V(sd * 0.17, 0.055, 0.19), r: [0.075 * L + g, 0.055 + g], bone: 'toes' + s }], X, V(0, 1, 0), 8);
  }
}

// class looks for the mock-up: the body's colours are the clothes; `extras` are layers over them
export const OUTFITS = {
  fighter: { top: '#4a3a34', sleeves: '#4a3a34', hands: '#3a2a20', legs: '#34303c', boots: '#3a2418', headgear: 'helm', extras: ['breastplate', 'pauldrons', 'vambraces', 'greaves', 'belt', 'tabard', 'cape'],
    colors: { steel: '#8e959e', cloth: '#8a2a22', trim: '#c89a40', belt: '#3a2418' } },
  rogue: { top: '#2e4a32', sleeves: '#2a3a2c', hands: '#2a2018', legs: '#3a3028', boots: '#241810', headgear: 'hood', extras: ['belt', 'pouches', 'mantle'],
    colors: { cloth: '#24402a', hood: '#2a4a30', belt: '#4a2e1a', trim: '#8a6a3a' } },
  mage: { top: '#3c2e6a', sleeves: '#3c2e6a', hands: null, legs: '#2a2440', boots: '#4a2a1a', headgear: 'hat', extras: ['robe', 'belt', 'mantle'],
    colors: { cloth: '#3c2e6a', robe: '#3c2e6a', hat: '#3a2c66', band: '#c86a2a', belt: '#6a3a1a', trim: '#c89a40' } },
  cleric: { top: '#e2dccb', sleeves: '#e2dccb', hands: null, legs: '#8a8070', boots: '#5a3a22', headgear: 'coif', extras: ['robe', 'tabard', 'belt'],
    colors: { robe: '#e2dccb', cloth: '#d8d0bc', trim: '#c89a40', coif: '#ece6d8', belt: '#8a6a4a' }, robeTo: 0.2 },
};

/** Replace a KayKit figure's look with a built one: hides every KayKit mesh under `root`, adds the
 * skinned body and clothes, the face (faces.js) and headgear under the head bone.
 * spec: { outfit, build, face (a faces.json face, `shape` included) } @returns {Promise<void>} */
export async function buildBody(load, root, spec, { far = false, findNode } = {}) {
  let src = null; root.traverse((o) => { if (o.isSkinnedMesh && /Body/.test(o.name)) src = o; });
  const skel = src.skeleton, bind = src.bindMatrix, parent = src.parent;
  root.traverse((o) => { if (o.isMesh) o.visible = false; });
  const bones = Object.fromEntries(skel.bones.map((b, i) => [b.name, i]));
  const B = BUILDS[spec.build] || BUILDS.normal, O = OUTFITS[spec.outfit] || OUTFITS.fighter, C = O.colors || {};
  const face = { ...spec.face };
  const hg = spec.headgear !== undefined ? spec.headgear : O.headgear, covered = hg && hg !== 'hat';
  if (covered && !['crop', 'short', 'bald', undefined].includes(face.hair)) face.hair = 'crop';   // long hair would poke through a hood or helm
  const skinC = face.skin;
  const add = (fill, color) => { const S = new Soup(bones); fill(S); if (S.idx.length) parent.add(S.mesh(std(color, 0.8), skel, bind)); };
  const { SKIN } = await import('./faces.js'), skin = SKIN[skinC] || skinC || SKIN.fair;
  // the body: the clothes' colours are its own
  add((S) => torso(S, B), O.top);
  add((S) => limbs(S, B, { arms: true, armTo: 0.7 }), O.sleeves);
  add((S) => limbs(S, B, { hands: true }), O.hands || skin);
  add((S) => limbs(S, B, { legs: true, legTo: 0.1 }), O.legs);
  add((S) => limbs(S, B, { feet: true }), O.boots);
  add((S) => chain(S, [{ p: V(0, 1.18, 0), r: [0.09 * B.limb, 0.085 * B.limb], bone: 'chest' }, { p: V(0, 1.3, 0.01), r: [0.085 * B.limb, 0.08 * B.limb], bone: 'head' }, { p: V(0, 1.36, 0.01), r: [0.08 * B.limb, 0.075 * B.limb], bone: 'head' }], V(1, 0, 0), V(0, 0, 1), 8), skin);   // the neck
  for (const x of O.extras || []) {
    const front = (grow) => (xx, y) => { const rz = (TORSO.find(([ty]) => ty >= y) || TORSO[TORSO.length - 1])[2] * B.d; return rz + grow + B.belly * smooth(0.55, 0.7, y) * (1 - smooth(0.85, 1, y)); };
    if (x === 'breastplate') add((S) => torso(S, B, { y0: 0.62, y1: 1.18, grow: 0.03, capBottom: false }), C.steel);
    if (x === 'belt') add((S) => torso(S, B, { y0: 0.46, y1: 0.62, grow: 0.035, capBottom: false, capTop: false, seg: 14 }), C.belt);
    if (x === 'pauldrons') add((S) => { for (const sd of [1, -1]) chain(S, [{ p: V(sd * 0.2, 1.12, 0), r: [0.16 * B.limb, 0.16 * B.d], bone: sd > 0 ? 'upperarml' : 'upperarmr' }, { p: V(sd * 0.36, 1.1, 0), r: [0.14 * B.limb, 0.14 * B.d], bone: sd > 0 ? 'upperarml' : 'upperarmr' }], V(0, 1, 0), V(0, 0, 1), 10); }, C.steel);
    if (x === 'vambraces') add((S) => { for (const sd of [1, -1]) chain(S, [{ p: V(sd * 0.5, 1.11, 0), r: [0.1 * B.limb, 0.098 * B.limb], bone: sd > 0 ? 'lowerarml' : 'lowerarmr' }, { p: V(sd * 0.69, 1.11, 0), r: [0.085 * B.limb, 0.083 * B.limb], bone: sd > 0 ? 'lowerarml' : 'lowerarmr' }], V(0, 1, 0), V(0, 0, 1), 8); }, C.steel);
    if (x === 'greaves') add((S) => { for (const sd of [1, -1]) chain(S, [{ p: V(sd * 0.17, 0.31, 0.01), r: [0.115 * B.limb, 0.117 * B.limb], bone: sd > 0 ? 'lowerlegl' : 'lowerlegr' }, { p: V(sd * 0.17, 0.12, -0.01), r: [0.1 * B.limb, 0.1 * B.limb], bone: sd > 0 ? 'lowerlegl' : 'lowerlegr' }], V(1, 0, 0), V(0, 0, 1), 8); }, C.steel);
    if (x === 'pouches') add((S) => { for (const sd of [1, -1]) chain(S, [{ p: V(sd * 0.27 * B.hip, 0.5, 0.12), r: [0.06, 0.05], bone: 'hips' }, { p: V(sd * 0.27 * B.hip, 0.4, 0.12), r: [0.06, 0.05], bone: 'hips' }], V(1, 0, 0), V(0, 0, 1), 6); }, C.belt);
    if (x === 'mantle') add((S) => { const X = V(1, 0, 0), Z = V(0, 0, 1); const a = ring(S, V(0, 1.24, 0), X, Z, 0.16 * B.w, 0.14 * B.d, 14, [['chest', 1]]), b = ring(S, V(0, 1.02, 0), X, Z, 0.4 * B.w, 0.3 * B.d, 14, [['chest', 1]]); bridge(S, a, b, V(0, 1.24, 0), V(0, 1.02, 0)); }, C.cloth);
    if (x === 'robe') add((S) => skirt(S, B, { y1: O.robeTo ?? 0.08, flare: 0.13 }), C.robe);
    if (x === 'tabard') {
      const w = (xx, y) => (y > 0.62 ? torsoW(y) : [['hips', 1]]);
      add((S) => panel(S, -0.15, 0.15, 0.28, 1.08, front(0.05), w), C.cloth);
      add((S) => { panel(S, -0.17, -0.14, 0.28, 1.08, front(0.055), w, 1, 6); panel(S, 0.14, 0.17, 0.28, 1.08, front(0.055), w, 1, 6); }, C.trim);
    }
    if (x === 'cape') add((S) => panel(S, -0.3 * B.w, 0.3 * B.w, 0.18, 1.16, (xx, y) => -((TORSO.find(([ty]) => ty >= y) || TORSO[TORSO.length - 1])[2] * B.d) - 0.06 - (1.16 - y) * 0.12, (xx, y) => torsoW(Math.max(y, 0.5)), 5, 7), C.cloth);
  }
  // the head: the face kit on the head bone, headgear grown off its shaped skull
  const head = findNode(root, 'head'), f = await buildFace(load, 'Knight', face, { far });
  head.add(f.head);
  const gear = new THREE.Group(), sk = f.skull, M = (c, r = 0.8, m = 0) => std(c, r, m);
  sk.computeBoundingBox(); const bb = sk.boundingBox, hw = (bb.max.x - bb.min.x) / 2, crown = bb.max.y;
  if (hg === 'helm') {
    const steel = M(C.steel, 0.4, 0.3);                                     // (no environment to reflect: a full metal reads black)
    gear.add(new THREE.Mesh(shellOf(sk, (c) => c.y > 0.14 && !(c.z > 0.12 && c.y < 0.64 && Math.abs(c.x) < 0.4), 0.17), steel));
    gear.add(new THREE.Mesh(shellOf(sk, (c) => c.y > 0.08 && c.y < 0.55 && Math.abs(c.x) > 0.3 && c.z > -0.15, 0.2), steel));   // cheek guards
    gear.add(new THREE.Mesh(shellOf(sk, (c) => c.y > 0.56 && c.y < 0.68, 0.2), M(C.trim, 0.5, 0.4)));                            // a brass brow band
    const nasal = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.3, 0.07), steel), top = f.on(0, 0.5).p; nasal.position.set(0, 0.47, top.z + 0.14); gear.add(nasal);
    const crest = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.14, 0.9), M(C.trim, 0.5, 0.4)); crest.position.set(0, crown * 1.12 + 0.02, -0.04); gear.add(crest);
  }
  if (hg === 'hood') {
    const cloth = new THREE.MeshStandardMaterial({ color: C.hood, roughness: 0.9, side: THREE.DoubleSide });
    gear.add(new THREE.Mesh(shellOf(sk, (c) => !(c.z > 0.0 && c.y < 0.84 && Math.abs(c.x) < 0.42), 0.26), cloth));
    const cowl = new THREE.Mesh(new THREE.CylinderGeometry(hw * 1.2, hw * 1.55, 0.5, 16, 1, true, 0.7, Math.PI * 2 - 1.4), cloth); cowl.position.set(0, -0.12, -0.04); gear.add(cowl);   // open at the front
    const tip = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.7, 8), cloth); tip.position.set(0, 0.62, -0.7); tip.rotation.x = -1.95; gear.add(tip);   // the hood's point, falling back
  }
  if (hg === 'coif') {                                             // the Grey Sisters' coif and wimple
    const cloth = new THREE.MeshStandardMaterial({ color: C.coif, roughness: 0.95, side: THREE.DoubleSide });
    gear.add(new THREE.Mesh(shellOf(sk, (c) => !(c.z > 0.04 && c.y < 0.72 && Math.abs(c.x) < 0.4), 0.12), cloth));
    const wimple = new THREE.Mesh(new THREE.CylinderGeometry(hw * 1.08, hw * 1.45, 0.46, 16, 1, true, 0.9, Math.PI * 2 - 1.8), cloth); wimple.position.set(0, -0.1, -0.02); gear.add(wimple);
    const band = new THREE.Mesh(shellOf(sk, (c) => c.y > 0.66 && c.y < 0.74 && c.z > -0.1, 0.135), M(C.trim, 0.5, 0.4)); gear.add(band);
  }
  if (hg === 'hat') {                                              // one group, tilted back as a whole
    const hat = new THREE.Group(), felt = new THREE.MeshStandardMaterial({ color: C.hat, roughness: 0.85, side: THREE.DoubleSide });
    const brim = new THREE.Mesh(new THREE.CylinderGeometry(hw * 1.55, hw * 1.6, 0.06, 24), felt); hat.add(brim);
    const cone = new THREE.Mesh(new THREE.ConeGeometry(hw * 0.98, 1.05, 16, 1), felt); cone.position.y = 0.55; hat.add(cone);
    const band = new THREE.Mesh(new THREE.CylinderGeometry(hw * 0.9, hw * 0.99, 0.13, 16, 1, true), M(C.band)); band.position.y = 0.09; band.scale.setScalar(1.03); hat.add(band);
    const tip = new THREE.Mesh(new THREE.ConeGeometry(hw * 0.2, 0.34, 8), felt); tip.position.set(0, 1.12, -0.12); tip.rotation.x = -0.7; hat.add(tip);   // the tip, bent back
    hat.position.set(0, crown * 0.8, -0.02); hat.rotation.x = -0.22; gear.add(hat);
  }
  gear.traverse((o) => { if (o.isMesh) o.frustumCulled = false; });
  head.add(gear);
}
