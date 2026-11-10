// creatures.js — our creatures built in code (docs/creatures-proposal.md: giant rats and giant spiders). The beasts
// KayKit has no model for: a rig per body plan (the quadruped, the arachnid), built as the env kit is (buildkit.js, one
// catalogue in code), its parts rigid on its bones in one skinned mesh (one draw, two with its glowing eyes), its clips
// keyed in code. It returns what figure.js `build` returns for a KayKit model ({ root, mixer, clips, frame }), so the
// bake draws its atlases (lab.js), the game stands it in the world (tools/render3d/world.js) and the animator picks its
// clips by name (cast.json), all unchanged: a variant names `creature: { kind, … }` in place of `model`.
//
// Units: a man stands 1 (fitPpu's `height` sizes a figure against the cast: a rat's is its own height in men). Facing
// +Z, as the KayKit models do. Deterministic: a seed for the fur's facets, nothing drawn at random.
// Clips (the cast maps the game's clips onto them): Idle, Walk, Attack, Attack2, Heavy, Hit, Death, Cast.
import * as THREE from 'three';
import { toCreasedNormals } from 'three/addons/utils/BufferGeometryUtils.js';

const rng = (seed) => { let s = (seed >>> 0) || 1; return () => { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 4294967296; }; };
const V = (x, y, z) => new THREE.Vector3(x, y, z);
const UP = V(0, 1, 0);

// ── a rig: bones placed at their bind positions (world, no rotation), parts rigid on them ──────────────────────────────
class Rig {
  constructor(seed) { this.bones = []; this.by = new Map(); this.parts = []; this.r = rng(seed); this.crease = CREASE; this.mottle = 0.1; }
  bone(name, parent, p) {
    const b = new THREE.Bone(); b.name = name; b.userData.at = p.clone();
    b.position.copy(parent ? p.clone().sub(parent.userData.at) : p);
    if (parent) parent.add(b);
    this.bones.push(b); this.by.set(name, b); return b;
  }
  /** a geometry in bind (world) space on a bone; colour a THREE.Color or (p, n) => THREE.Color; glow: the eyes' mesh */
  /** crease: the angle (radians) past which two faces meet in a hard edge; under it the surface is shaded smooth (the
   *  rig's own by default: a chiselled golem's lower) */
  part(geo, bone, colour, glow = false, crease = this.crease) { this.parts.push({ geo: geo.index ? geo.toNonIndexed() : geo, bone: typeof bone === 'function' ? bone : this.bones.indexOf(this.by.get(bone)), colour, glow, crease }); }
  /** a weight function for a part bent across bones: (p) → [[bone, w], [bone, w]] by where the vertex is */
  skin(fn) { return (p) => fn(p).map(([b, w]) => [this.bones.indexOf(this.by.get(b)), w]); }
  mesh(glowColour, glowK = 1.6) {
    const make = (parts, mat) => {
      let n = 0; for (const q of parts) n += q.geo.attributes.position.count;
      const pos = new Float32Array(n * 3), col = new Float32Array(n * 3), si = new Uint16Array(n * 4), sw = new Float32Array(n * 4);
      let o = 0; const p = new THREE.Vector3(), nm = new THREE.Vector3(), c = new THREE.Color();
      const nrm = new Float32Array(n * 3);
      for (const q of parts) {
        // (smooth, as KayKit's are: each part's normals averaged across the faces that meet at a gentle angle and kept hard
        // where they meet past its crease, a block's cut edge, a blade's rim; round S1, the owner's 2026-11-10 "the same
        // detail and smoothness as the KayKit models": the facets each shaded flat with their own shade read as a crumpled
        // paper model beside the cast)
        const geo = toCreasedNormals(q.geo, q.crease), P = geo.attributes.position, N = geo.attributes.normal;
        for (let v = 0; v < P.count; v++) {
          p.fromBufferAttribute(P, v); nm.fromBufferAttribute(N, v);
          if (typeof q.colour === 'function') c.copy(q.colour(p, nm)); else c.copy(q.colour);
          // (a hand-painted mottle, smooth over the surface: a vertex's shade by where it is, so the faces that share it agree)
          if (!q.glow && this.mottle) c.multiplyScalar(1 - this.mottle + 2 * this.mottle * hash3(Math.round(p.x * 60), Math.round(p.y * 60), Math.round(p.z * 60), 3));
          pos.set([p.x, p.y, p.z], o * 3); col.set([c.r, c.g, c.b], o * 3); nrm.set([nm.x, nm.y, nm.z], o * 3);
          if (typeof q.bone === 'function') { const w = q.bone(p), a = w[0], b = w[1] || [0, 0]; si.set([a[0], b[0], 0, 0], o * 4); sw.set([a[1], b[1], 0, 0], o * 4); }
          else { si.set([q.bone, 0, 0, 0], o * 4); sw.set([1, 0, 0, 0], o * 4); }
          o++;
        }
      }
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.BufferAttribute(pos, 3)); g.setAttribute('color', new THREE.BufferAttribute(col, 3));
      g.setAttribute('skinIndex', new THREE.BufferAttribute(si, 4)); g.setAttribute('skinWeight', new THREE.BufferAttribute(sw, 4));
      g.setAttribute('normal', new THREE.BufferAttribute(nrm, 3));
      return new THREE.SkinnedMesh(g, mat);
    };
    const root = new THREE.Group(), skeleton = new THREE.Skeleton(this.bones);
    root.add(this.bones[0]); root.updateMatrixWorld(true);
    const body = make(this.parts.filter((q) => !q.glow), new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.95, metalness: 0 }));
    body.name = 'Body'; root.add(body); body.bind(skeleton);
    const eyes = this.parts.filter((q) => q.glow);
    if (eyes.length) {
      const m = make(eyes, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.4, emissive: new THREE.Color(glowColour), emissiveIntensity: glowK }));   // (over ~1.6 it burns out white and loses its colour)
      m.name = 'Eyes'; m.userData.glow = true; root.add(m); m.bind(skeleton);
    }
    root.traverse((o) => { if (o.isMesh) o.frustumCulled = false; });
    return root;
  }
}

// ── shapes, in bind space ────────────────────────────────────────────────────────────────────────────────────────────
// (segments: round S1 raised them all to the KayKit cast's density, a sphere 16 × 12 and a limb 10 round, and every
// count a part names is scaled by SEG and floored at what reads round shaded smooth)
const SEG = 1.6, CREASE = (50 * Math.PI) / 180;
const segs = (n, lo) => Math.max(lo, Math.round(n * SEG));
function blob(c, r, seg = [10, 8], tilt = 0) {
  seg = [segs(seg[0], 8), segs(seg[1], 6)];
  const g = new THREE.SphereGeometry(1, seg[0], seg[1]); g.scale(r[0], r[1], r[2]); if (tilt) g.rotateX(tilt); g.translate(c.x, c.y, c.z); return g;
}
function limb(a, b, r0, r1, radial = 6) {                       // a tapered segment from a to b
  radial = segs(radial, 5);
  const d = b.clone().sub(a), len = d.length(), g = new THREE.CylinderGeometry(r1, r0, len, radial, 1);
  g.translate(0, len / 2, 0); g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(UP, d.normalize())); g.translate(a.x, a.y, a.z); return g;
}

// a swept tube: one smooth tapering body through the points (a tendril, a tail), its radius eased between theirs; no caps
// between segments to show as rings (round S4: a string of capped limbs read as logs once shaded smooth). Returns the
// geometry and a skin: each vertex on the bones of the stretch it lies along, blended across the joints.
function tube(pts, rad, bones, radial = 8, steps = 24) {
  const curve = new THREE.CatmullRomCurve3(pts), g = new THREE.TubeGeometry(curve, steps, 1, segs(radial, 6), false), P = g.attributes.position, c = V(0, 0, 0), v = V(0, 0, 0);
  const rOf = (u) => { const x = u * (rad.length - 1), i = Math.min(rad.length - 2, Math.floor(x)), f = x - i; return rad[i] + (rad[i + 1] - rad[i]) * f; };
  const R1 = segs(radial, 6) + 1, at = [];
  for (let i = 0; i <= steps; i++) { const u = i / steps; curve.getPointAt(u, c); at.push([c.clone(), u]); for (let j = 0; j < R1; j++) { const k = i * R1 + j; v.fromBufferAttribute(P, k).sub(c).multiplyScalar(rOf(u)).add(c); P.setXYZ(k, v.x, v.y, v.z); } }
  const skin = (p) => {   // (the nearest point of the spine: how far along it the vertex is)
    let best = 0, bd = Infinity; for (const [q, u] of at) { const d = q.distanceToSquared(p); if (d < bd) { bd = d; best = u; } }
    const x = best * bones.length - 0.5, i = Math.max(0, Math.min(bones.length - 1, Math.floor(x))), j = Math.min(bones.length - 1, i + 1), f = Math.max(0, Math.min(1, x - i));
    return i === j ? [[bones[i], 1]] : [[bones[i], 1 - f], [bones[j], f]];
  };
  return { g, skin };
}

// ── clips keyed in code: fn(t 0..1) → { bone: Quaternion } and { bone: Vector3 (a position offset) } ───────────────────
const qe = (x, y, z) => new THREE.Quaternion().setFromEuler(new THREE.Euler(x, y, z));
const qa = (axis, a) => new THREE.Quaternion().setFromAxisAngle(axis, a);
function clip(rig, name, dur, fn, fps = 24) {
  const n = Math.max(2, Math.round(dur * fps) + 1), times = [], rot = new Map(), pos = new Map(), scl = new Map();
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1); times.push(t * dur);
    const f = fn(t);
    for (const [b, q] of Object.entries(f.q || {})) { if (!rot.has(b)) rot.set(b, new Array(n)); rot.get(b)[i] = q; }
    for (const [b, p] of Object.entries(f.p || {})) { if (!pos.has(b)) pos.set(b, new Array(n)); pos.get(b)[i] = p; }
    for (const [b, s] of Object.entries(f.s || {})) { if (!scl.has(b)) scl.set(b, new Array(n)); scl.get(b)[i] = s; }   // (a scale: a wraith fading into its shroud)
  }
  const tracks = [];
  for (const [b, qs] of rot) tracks.push(new THREE.QuaternionKeyframeTrack(`${b}.quaternion`, times, qs.flatMap((q) => (q || new THREE.Quaternion()).toArray())));
  for (const [b, ps] of pos) { const base = rig.by.get(b).position; tracks.push(new THREE.VectorKeyframeTrack(`${b}.position`, times, ps.flatMap((p) => base.clone().add(p || V(0, 0, 0)).toArray()))); }
  for (const [b, ss] of scl) tracks.push(new THREE.VectorKeyframeTrack(`${b}.scale`, times, ss.flatMap((s) => (s || V(1, 1, 1)).toArray())));
  return new THREE.AnimationClip(name, dur, tracks);
}
// a hash of a place (the same corner the same way on every face it's on: a carved block stays closed)
const hash3 = (x, y, z, s = 0) => { const h = Math.sin(x * 127.1 + y * 311.7 + z * 74.7 + s * 19.19) * 43758.5453; return h - Math.floor(h); };
// a body as one hull: a profile of [z, radius] turned round the z axis (a lathe), its cross-section `ry` as tall as wide,
// its centre line raised by cy(z) (an arched back): one smooth body, not a string of blobs
function hull(profile, seg, cy, ry = 1) {
  const g = new THREE.LatheGeometry(profile.map(([z, r]) => new THREE.Vector2(Math.max(1e-4, r), z)), seg).rotateX(Math.PI / 2);
  const P = g.attributes.position; for (let i = 0; i < P.count; i++) { const z = P.getZ(i); P.setY(i, P.getY(i) * ry + cy(z)); }
  return g;
}
// a part built at the origin facing +Z, turned and set down (a crown's spike, a rat in the king's knot)
const placed = (g, yaw, at) => g.rotateY(yaw).translate(at.x, at.y, at.z);
const mixC = (a, b, k) => a.clone().lerp(b, Math.max(0, Math.min(1, k)));
const TAU = Math.PI * 2, S = (x) => Math.sin(TAU * x), C = (x) => Math.cos(TAU * x);
const ease = (a, b, t) => { const u = Math.max(0, Math.min(1, (t - a) / (b - a))); return u * u * (3 - 2 * u); };
const bell = (a, m, b, t) => (t < m ? ease(a, m, t) : 1 - ease(m, b, t));

// ── the giant rat (the quadruped: wolves, hounds and boars after it, on its proportions: world doc §8) ────────────────────
// A grave rat the size of a dog (GDD §16, Old Gutter): hunched, mangy, a long bare tail, eyes like coals.
function rat(o = {}) {
  // (the owner's reference, 2026-11-10: a heavy, hunched, shaggy grave rat, a big snarling head on long incisors, big
  // clawed hands, a thick ringed tail; grey. In the kit's low poly: the coat as raked tufts over one hull)
  const K = !!o.king, R = new Rig(o.seed || 11), fur = new THREE.Color(o.fur || '#3c3b3a'), belly = new THREE.Color(o.belly || '#4c4a48'), skin = new THREE.Color(o.skin || '#8e7672');   // (grey, cool: the reference's)
  const furTop = new THREE.Color(o.furTop || '#64625e')   /* (the game's light lifts it: round R6) */, furC = (p, n) => (n.y < -0.35 ? belly : n.y > 0.62 ? mixC(fur, furTop, 0.45) : fur);
  const claw = new THREE.Color('#d8cdb4'), tooth = new THREE.Color('#e0cf8a'), maw = new THREE.Color('#3a1214'), tailC = new THREE.Color(o.tail || '#8e706a'), ring = new THREE.Color('#5a4642');
  const root = R.bone('root', null, V(0, 0.2, 0.0)), pelvis = R.bone('pelvis', root, V(0, 0.21, -0.17)), chest = R.bone('chest', root, V(0, 0.22, 0.14));
  const neck = R.bone('neck', chest, V(0, 0.235, 0.25)), head = R.bone('head', neck, V(0, 0.245, 0.31)); R.bone('jaw', head, V(0, 0.22, 0.35));
  let tp = pelvis; const tail = [V(0, 0.17, -0.31), V(0, 0.11, -0.45), V(0.03, 0.055, -0.59), V(0.08, 0.025, -0.71)];
  tail.forEach((p, i) => { tp = R.bone(`tail${i + 1}`, tp, p); });
  for (const s of [1, -1]) {
    const sh = R.bone(`armU${s}`, chest, V(0.085 * s, 0.19, 0.16)), el = R.bone(`armL${s}`, sh, V(0.095 * s, 0.1, 0.2)); R.bone(`paw${s}`, el, V(0.095 * s, 0.025, 0.215));
    const hip = R.bone(`legU${s}`, pelvis, V(0.1 * s, 0.18, -0.17)), kn = R.bone(`legL${s}`, hip, V(0.11 * s, 0.09, -0.1)); R.bone(`foot${s}`, kn, V(0.11 * s, 0.03, -0.2));
  }
  // one heavy hull: the back humped highest in the middle, the shoulders as big as the haunches, the head hung low
  const cy = (z) => 0.2 + 0.04 * Math.exp(-(((z + 0.06) / 0.2) ** 2)) - (z > 0.14 ? 0.015 * (z - 0.14) / 0.14 : 0);
  // (round R4: a tenth shorter, the head less hung: the reference's is chunky, its head a third of it)
  const prof = [...[1, 0.92, 0.75, 0.5, 0.2, 0].map((u) => [-0.2 - 0.11 * u, 0.15 * Math.sqrt(1 - u * u)]), [-0.12, 0.155], [-0.04, 0.152], [0.04, 0.145], [0.11, 0.128], [0.17, 0.1], [0.22, 0.078], [0.25, 0.05], [0.27, 0]];
  const along = (z, pts) => { for (let i = 0; i < pts.length - 1; i++) { const [z0, a] = pts[i], [z1, b] = pts[i + 1]; if (z <= z1) { const k = Math.max(0, Math.min(1, (z - z0) / (z1 - z0))); return k < 0.5 ? [[a, 1 - k], [b, k]] : [[b, k], [a, 1 - k]]; } } return [[pts[pts.length - 1][1], 1]]; };
  const bodyW = R.skin((p) => along(p.z, [[-0.2, 'pelvis'], [-0.06, 'pelvis'], [0.05, 'root'], [0.12, 'root'], [0.2, 'chest'], [0.24, 'chest'], [0.3, 'neck']]));
  const rOf = (z) => { for (let i = 0; i < prof.length - 1; i++) if (z <= prof[i + 1][0]) { const [z0, r0] = prof[i], [z1, r1] = prof[i + 1]; return r0 + (r1 - r0) * (z - z0) / Math.max(1e-6, z1 - z0); } return 0; };
  R.part(hull(prof, 28, cy, 0.92), bodyW, furC);
  // the coat: a few big ragged clumps where the reference's shag is heaviest, the hull smooth between them (the kit's
  // chunky style: critic round R2, a coat of shingles read as a pine cone): a crest bristling along the spine, a ruff over
  // the shoulders and neck, clumps on the haunches and flanks, each a broad blade of fur lighter at its tip
  const clump = (z, a, len, w, lift = 0.35, back = 0.9) => {
    const r = rOf(z) * 0.9, at = V(Math.sin(a) * r, cy(z) + Math.cos(a) * r * 0.92, z), out = V(Math.sin(a), Math.cos(a) * 0.92, 0).normalize();
    const dir = out.clone().multiplyScalar(lift).add(V(0, -0.1, -back)).normalize(), tip = at.clone().add(dir.clone().multiplyScalar(len));
    // (a blade of fur, not a quill: the cone pressed flat against the body, round S2)
    const g = limb(at.clone().add(out.clone().multiplyScalar(-0.01)), tip, w, 0.003, 4), P = g.attributes.position, ax = out.clone().sub(dir.clone().multiplyScalar(out.dot(dir))).normalize(), v = V(0, 0, 0);
    for (let i = 0; i < P.count; i++) { v.fromBufferAttribute(P, i); const d = v.clone().sub(at).dot(ax); v.addScaledVector(ax, -0.55 * d); P.setXYZ(i, v.x, v.y, v.z); }
    R.part(g, bodyW, (p, n) => (p.distanceTo(at) > len * 0.55 ? furTop : mixC(fur, furTop, 0.15)));
  };
  for (let i = 0; i < 9; i++) { const z = -0.24 + i * 0.05, h = hash3(i, 7, 1, 5); clump(z, (i % 2 ? 0.12 : -0.12) + (h - 0.5) * 0.15, (0.048 + 0.025 * h) * (z > 0.05 ? 0.6 : 1), 0.036, z > 0.05 ? 0.12 : 0.22); }   // (round S2: shaded smooth, the crest read as quills from the camera: laid flatter)   // the crest (low at the front: the head shows over it)
  for (const s of [1, -1]) {
    for (let i = 0; i < 4; i++) { const h = hash3(i, s, 2, 6); clump(0.1 + i * 0.03, s * (0.8 + 0.3 * i), 0.055 + 0.02 * h, 0.03, 0.25, 0.85); }   // the ruff, at the shoulders' sides (low: the head over it)
    for (let i = 0; i < 4; i++) { const h = hash3(i, s, 4, 7); clump(-0.22 + i * 0.09, s * (0.95 + 0.25 * (i % 2)), 0.06 + 0.03 * h, 0.03, 0.3, 0.9); }   // the flanks
    clump(-0.18, s * 0.6, 0.075, 0.034, 0.4, 0.95);                                         // the haunch
  }
  for (const a of [-0.5, 0, 0.5]) clump(-0.29, a, 0.06, 0.034, 0.6, 0.85);                  // (over the rump: round R5, its bare end read dark and flat)
  // the head: big, the brow heavy, the eyes small coals under it, the snout blunt, the mouth open on its teeth
  R.part(blob(V(0, 0.262, 0.31), [0.1, 0.09, 0.1], [12, 9]), 'head', furC);
  for (const s of [1, -1]) for (const [y, z] of [[0.245, 0.31], [0.28, 0.29], [0.215, 0.33]]) R.part(limb(V(0.075 * s, y, z), V(0.125 * s, y - 0.015, z - 0.055), 0.024, 0.002, 3), 'head', furTop);   // cheek tufts
  for (const s of [1, -1]) R.part(blob(V(0, 0, 0), [0.04, 0.016, 0.03], [8, 5]).rotateZ(-0.42 * s).translate(0.036 * s, 0.3, 0.362), 'head', fur);   // the brow: two ridges low at the snout, a scowl (round S4: one band read as a teddy bear's)
  R.part(limb(V(0, 0.258, 0.36), V(0, 0.24, 0.47), 0.06, 0.03, 8), 'head', furC);         // the snout, blunt
  R.part(blob(V(0, 0.246, 0.472), [0.02, 0.016, 0.013], [6, 4]), 'head', skin);           // the nose
  R.part(blob(V(0, 0.21, 0.4), [0.04, 0.024, 0.06], [8, 6]), 'head', maw);             // the open mouth
  for (const s of [1, -1]) {
    R.part(limb(V(0.01 * s, 0.222, 0.46), V(0.01 * s, 0.165, 0.466), 0.01, 0.004, 4), 'head', tooth);   // the incisors, long
    R.part(limb(V(0.033 * s, 0.215, 0.405), V(0.032 * s, 0.185, 0.41), 0.006, 0.001, 3), 'head', tooth);     // fangs
    R.part(blob(V(0.05 * s, 0.283, 0.388), [0.014, 0.012, 0.009], [6, 4]), 'head', new THREE.Color('#ff5530'), true);   // the eyes, coals
    R.part(placed(blob(V(0, 0, 0), [0.04, 0.044, 0.012], [8, 6]), 0.5 * s, V(0.066 * s, 0.33, 0.275)), 'head', fur);      // the ears, small and round
    R.part(placed(blob(V(0, 0, 0.006), [0.029, 0.033, 0.008], [6, 4]), 0.5 * s, V(0.066 * s, 0.33, 0.275)), 'head', skin);
  }
  R.part(blob(V(0, 0.19, 0.4), [0.034, 0.017, 0.055], [8, 5]), 'jaw', furC);               // the lower jaw, hung open
  for (const s of [1, -1]) R.part(limb(V(0.007 * s, 0.192, 0.448), V(0.007 * s, 0.222, 0.452), 0.007, 0.003, 4), 'jaw', tooth);
  // the tail: thick at its root, ringed, tapering to nothing
  const tl = [V(0, 0.19, -0.27), ...tail, V(0.13, 0.015, -0.8), V(0.16, 0.012, -0.9)], tb = ['pelvis', 'tail1', 'tail2', 'tail3', 'tail4', 'tail4'];
  for (let i = 0; i < tl.length - 1; i++) for (let k = 0; k < 3; k++) {
    const a0 = tl[i].clone().lerp(tl[i + 1], k / 3), a1 = tl[i].clone().lerp(tl[i + 1], (k + 1) / 3), u = (i * 3 + k) / ((tl.length - 1) * 3);
    R.part(limb(a0, a1, 0.036 * (1 - u) + 0.004, 0.036 * (1 - u - 1 / 18) + 0.004, 6), tb[i], k === 2 ? ring : tailC);
  }
  // the limbs: furred above, the hands and feet bare, long-fingered and clawed
  const hand = (at, fwd, bone, s, len) => {
    R.part(blob(at, [0.026, 0.012, 0.03], [6, 4]), bone, skin);
    for (let f = -1.5; f <= 1.5; f++) { const a = f * 0.32 + 0.1 * s, d = V(Math.sin(a) * fwd.z + fwd.x, 0, Math.cos(a) * fwd.z), b = at.clone().add(d.clone().multiplyScalar(0.015)), e = b.clone().add(d.clone().multiplyScalar(len)); e.y = 0.004;
      R.part(limb(b, e, 0.007, 0.004, 3), bone, skin); R.part(limb(e, e.clone().add(d.clone().multiplyScalar(0.016)).add(V(0, -0.003, 0)), 0.004, 0.001, 3), bone, claw); }
  };
  for (const s of [1, -1]) {
    R.part(limb(V(0.085 * s, 0.2, 0.15), V(0.095 * s, 0.1, 0.2), 0.052, 0.036), `armU${s}`, furC);
    R.part(limb(V(0.095 * s, 0.1, 0.2), V(0.095 * s, 0.025, 0.215), 0.036, 0.024), `armL${s}`, furC);
    R.part(limb(V(0.1 * s, 0.09, 0.19), V(0.12 * s, 0.05, 0.17), 0.018, 0.002, 3), `armL${s}`, furTop);   // (a tuft at the elbow)
    hand(V(0.095 * s, 0.012, 0.235), V(0, 0, 1), `paw${s}`, s, 0.045);
    R.part(blob(V(0.1 * s, 0.17, -0.17), [0.06, 0.075, 0.085], [8, 6]), `legU${s}`, furC);   // the haunch
    R.part(limb(V(0.11 * s, 0.11, -0.12), V(0.11 * s, 0.03, -0.2), 0.024, 0.016), `legL${s}`, fur);
    R.part(blob(V(0.11 * s, 0.014, -0.165), [0.026, 0.012, 0.055], [6, 4]), `foot${s}`, skin);
    hand(V(0.11 * s, 0.01, -0.13), V(0, 0, 1), `foot${s}`, s, 0.04);
  }
  if (o.king) king(R, tail);
  // (in the game, round R5: from the camera's height the hump and ruff hid a head hung low and it read as a hedgehog; the
  // head raised over the shoulders, as the reference's snarl: the bone and everything on it and the jaw)
  const lift = V(0, 0.045, 0.015), hb = [R.bones.indexOf(R.by.get('head')), R.bones.indexOf(R.by.get('jaw'))];
  R.by.get('head').position.add(lift); R.by.get('head').userData.at.add(lift); R.by.get('jaw').userData.at.add(lift);
  // (and a quarter bigger, round R6: from the camera's height the face was small under the back; the reference's head is
  // a third of the rat)
  const hc = R.by.get('head').userData.at.clone(), HK = o.king ? 1.1 : 1.25;
  for (const q of R.parts) if (hb.includes(q.bone)) q.geo.translate(lift.x - hc.x, lift.y - hc.y, lift.z - hc.z).scale(HK, HK, HK).translate(hc.x, hc.y, hc.z);
  const jw = R.by.get('jaw'); jw.position.multiplyScalar(HK); jw.userData.at.copy(hc).add(jw.position);
  R.part(limb(V(0, 0.235, 0.24), V(0, 0.28, 0.31), 0.075, 0.07, 8), 'neck', furC);   // (the neck, thick, under it)
  const root3 = R.mesh(o.eyes || '#ff4020');
  const legs = (t, A = 1) => {                                  // a scurry: the diagonal pairs together
    const q = {};
    for (const s of [1, -1]) for (const [u, l, ph] of [[`armU${s}`, `armL${s}`, s > 0 ? 0 : 0.5], [`legU${s}`, `legL${s}`, s > 0 ? 0.5 : 0]]) {
      const sw = S(t + ph), lift = Math.max(0, C(t + ph));
      q[u] = qe(-0.55 * A * sw, 0, 0); q[l] = qe((u.startsWith('arm') ? 0.9 : -0.9) * A * lift, 0, 0);
    }
    return q;
  };
  const tailSway = (t, a = 0.25, k = 1) => Object.fromEntries([1, 2, 3, 4].map((i) => [`tail${i}`, qe(0, a * S(k * t - i * 0.12), 0)]));
  const clips = [
    // (the owner, 2026-11-10: "non humanoid NPCs should also have some idle movements": a loop of four seconds, a rat's
    // business in it: breathing, a sniff with the head up and the nose working, a look round, a paw wiped over the face,
    // the tail sweeping and flicking. The king, heavier, five: no grooming, a longer look and a snarl, the knot dragged)
    clip(R, 'Idle', K ? 5.0 : 4.0, (t) => {
      const sn = bell(0.06, 0.14, 0.34, t), lk = bell(0.38, 0.46, 0.7, t), turn = S((t - 0.38) / 0.32 * 0.5 + 0.25) * lk, gr = K ? 0 : bell(0.72, 0.8, 0.94, t), fl = bell(0.52, 0.55, 0.6, t);
      const br = S(t * (K ? 5 : 6)), tw = 0.05 * S(t * 32) * sn, snarl = K ? bell(0.72, 0.8, 0.95, t) : 0;
      return { q: {
        ...Object.fromEntries([1, 2, 3, 4].map((i) => [`tail${i}`, qe(0, 0.2 * S(t * 2 - i * 0.1) + 0.5 * fl * (i > 2 ? 1 : 0.3), 0.04 * S(t * 2 - i * 0.1))])),
        chest: qe(0.03 * br - 0.1 * sn, 0.15 * turn, 0), pelvis: qe(-0.015 * br, -0.06 * turn, 0.03 * S(t)),
        neck: qe(-0.2 * sn + 0.25 * gr, 0.25 * turn, 0), head: qe(-0.15 * sn + tw + 0.15 * gr - 0.1 * snarl, 0.35 * turn + 0.2 * gr, 0.1 * turn + 0.25 * gr),
        jaw: qe(0.2 + 0.15 * Math.max(0, S(t * 16)) * sn + 0.55 * snarl, 0, 0),
        root: qe(-0.3 * gr, 0, 0), armU1: qe(-1.5 * gr, 0, 0.25 * gr), armL1: qe(1.4 * gr, 0, 0), paw1: qe(-0.6 * gr * (1 + 0.3 * S(t * 24)), 0, 0), 'armU-1': qe(-0.35 * gr, 0, 0),
        legU1: qe(0.06 * sn, 0, 0), 'legU-1': qe(0.06 * sn, 0, 0) },
        p: { root: V(0, 0.004 * br + 0.022 * sn + 0.02 * gr, -0.01 * sn - 0.04 * gr) } };   // (grooming, it sits back on its haunches)
    }),
    clip(R, 'Walk', 0.42, (t) => ({ q: { ...legs(t), ...tailSway(t, 0.3, 1), pelvis: qe(0, 0.08 * S(t), 0), chest: qe(0, -0.06 * S(t), 0), head: qe(0.06 * S(t * 2), 0, 0) }, p: { root: V(0, 0.012 * Math.abs(S(t)), 0) } })),
    clip(R, 'Attack', 0.6, (t) => { const k = bell(0.15, 0.45, 0.85, t), w = bell(0, 0.15, 0.3, t); return { q: { ...tailSway(t, 0.3, 2), root: qe(-0.15 * w + 0.12 * k, 0, 0), chest: qe(0.2 * k, 0, 0), neck: qe(0.25 * k - 0.3 * w, 0, 0), head: qe(-0.35 * k, 0, 0), jaw: qe(0.85 * bell(0.15, 0.36, 0.5, t), 0, 0), armU1: qe(-0.6 * k, 0, 0), 'armU-1': qe(-0.6 * k, 0, 0) }, p: { root: V(0, 0.02 * w - 0.02 * k, 0.16 * k - 0.03 * w) } }; }),
    clip(R, 'Attack2', 0.55, (t) => { const k = bell(0.1, 0.35, 0.8, t); return { q: { ...tailSway(t, 0.2), root: qe(-0.35 * k, 0, 0), armU1: qe(-1.3 * bell(0.2, 0.4, 0.6, t), 0, 0.2), 'armU-1': qe(-1.3 * bell(0.35, 0.55, 0.75, t), 0, -0.2), jaw: qe(0.5 * k, 0, 0) }, p: { root: V(0, 0.03 * k, 0.03 * k) } }; }),
    clip(R, 'Heavy', 0.9, (t) => { const c = bell(0, 0.25, 0.4, t), j = bell(0.3, 0.55, 0.8, t); return { q: { ...legs(t * 0.5, 0.6 * j), ...tailSway(t, 0.4), root: qe(0.15 * c - 0.25 * j, 0, 0), jaw: qe(0.7 * j, 0, 0) }, p: { root: V(0, -0.04 * c + 0.14 * j, 0.28 * ease(0.3, 0.8, t)) } }; }),
    clip(R, 'Hit', 0.4, (t) => { const k = bell(0, 0.25, 1, t); return { q: { ...tailSway(t, 0.5, 2), head: qe(-0.35 * k, 0.3 * k, 0), chest: qe(-0.15 * k, 0, 0) }, p: { root: V(0, 0, -0.05 * k) } }; }),
    clip(R, 'Death', 1.0, (t) => { const k = ease(0, 0.6, t); return { q: { root: qe(0, 0, 1.45 * k), head: qe(0.3 * k, 0, 0), jaw: qe(0.4 * k, 0, 0), armU1: qe(-0.6 * k, 0, 0), 'armU-1': qe(0.4 * k, 0, 0), legU1: qe(0.5 * k, 0, 0), 'legU-1': qe(-0.3 * k, 0, 0), ...tailSway(0, 0) }, p: { root: V(0, -0.07 * k, 0) } }; }),
    clip(R, 'Cast', 0.8, (t) => { const k = bell(0.1, 0.5, 0.9, t); return { q: { root: qe(-0.5 * k, 0, 0), head: qe(-0.4 * k, 0, 0), jaw: qe(0.8 * k, 0, 0), ...tailSway(t, 0.3) }, p: { root: V(0, 0.05 * k, 0) } }; }),   // (a squeal: the plague rat's call, if a rat casts)
  ];
  return { root: root3, clips };
}

// The Rat King (a boss): the biggest of them, crowned with nails bent into a ring, a rag of purple over its shoulders,
// its yellow incisors long, and behind it the knot: rats grown together by their tails, dragged where it goes, their eyes
// lit. The knot rides the tail's last bones, so it swings and bumps as the tail does.
function king(R, tail) {
  const rust = new THREE.Color('#8a5a24'), brass = new THREE.Color('#9a7a34'), cloak = new THREE.Color('#2a1226'), cloakHi = new THREE.Color('#3c1c36');   /* (darker: in the game's light it glowed magenta) */
  const tooth = new THREE.Color('#d8c27a'), scar = new THREE.Color('#b07a72'), tailC = new THREE.Color('#8a6460'), fur = new THREE.Color('#3a342e'), furHi = new THREE.Color('#5a534a');
  // the crown: a ring and seven bent nails standing out of it
  R.part(new THREE.TorusGeometry(0.047, 0.009, 4, 12).rotateX(Math.PI / 2 - 0.25).translate(0, 0.315, 0.3), 'head', brass);
  for (let i = 0; i < 7; i++) {
    const a = (i / 7) * Math.PI * 2, d = V(Math.sin(a), 0, Math.cos(a)), b = V(0, 0.318, 0.3).add(d.clone().multiplyScalar(0.046));
    const tip = b.clone().add(d.clone().multiplyScalar(0.018)).add(V(0, 0.05 + (i % 2) * 0.015, 0));
    R.part(limb(b, tip, 0.008, 0.002, 4), 'head', i % 2 ? rust : brass);
  }
  // the incisors, long; a scar over one eye; the cloak's rag over the shoulders, its edge torn
  for (const s of [1, -1]) R.part(limb(V(0.007 * s, 0.226, 0.462), V(0.008 * s, 0.19, 0.468), 0.007, 0.004, 4), 'head', tooth);
  R.part(limb(V(0.05, 0.31, 0.33), V(0.03, 0.25, 0.4), 0.005, 0.004, 3), 'head', scar);
  // the shoulders heavier than a rat's, a ruff of matted fur round the neck
  R.part(blob(V(0, 0.27, 0.13), [0.115, 0.1, 0.12], [10, 8]), 'chest', (p, n) => (n.y > 0.55 ? furHi : fur));
  for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2, d = V(Math.sin(a), Math.cos(a) * 0.8, 0), b = V(0, 0.26, 0.25).add(d.clone().multiplyScalar(0.075)); R.part(limb(b, b.clone().add(d.clone().multiplyScalar(0.05)).add(V(0, 0, -0.04)), 0.02, 0.003, 3), 'neck', i % 3 ? fur : furHi); }
  // the cape: a rag of purple over the shoulders, hanging down both flanks and over the haunches in tatters, a clasp at the throat
  const capeC = (p, n) => (n.y > 0.5 ? cloakHi : cloak);
  R.part(blob(V(0, 0.275, 0.02), [0.172, 0.075, 0.22], [12, 8]), 'root', capeC);   // (round S2: a rounder one read as a shell)   // (wider than the back: it hangs down the flanks)
  for (let i = 0; i < 10; i++) { const a = (i / 9) * Math.PI - Math.PI / 2, z = 0.02 + 0.21 * Math.sin(a); for (const s of [1, -1]) { const top = V(0.165 * s * Math.cos(a * 0.85), 0.22, z); R.part(limb(top, top.clone().add(V(0.012 * s, -0.04 - 0.02 * (i % 2), -0.01)), 0.022, 0.003, 3), 'root', cloak); } }
  R.part(blob(V(0, 0.255, 0.33), [0.016, 0.016, 0.01], [6, 4]), 'neck', brass);
  // the knot: the tails tangled (a torus knot) and six rats round it, heads out, on the tail's last two bones
  const at = tail[3].clone().add(V(0.02, 0.03, -0.06));
  R.part(new THREE.TorusKnotGeometry(0.045, 0.012, 40, 5, 2, 3).translate(at.x, at.y + 0.01, at.z), 'tail4', tailC);
  for (let i = 0; i < 6; i++) {
    const yaw = (i / 6) * Math.PI * 2 + 0.3, d = V(Math.sin(yaw), 0, Math.cos(yaw)), c = at.clone().add(d.clone().multiplyScalar(0.085)).add(V(0, (i % 2) * 0.02, 0));
    const bone = i < 3 ? 'tail4' : 'tail3', sc = 0.85 + (i % 3) * 0.12;
    const furC = (p, n) => (n.y > 0.5 ? furHi : fur);
    R.part(placed(blob(V(0, 0.035 * sc, 0), [0.04 * sc, 0.036 * sc, 0.065 * sc], [8, 6]), yaw, c), bone, furC);
    R.part(placed(limb(V(0, 0.04 * sc, 0.05 * sc), V(0, 0.03 * sc, 0.115 * sc), 0.026 * sc, 0.007, 5), yaw, c), bone, furC);
    for (const s of [1, -1]) {
      R.part(placed(blob(V(0.02 * s * sc, 0.06 * sc, 0.055 * sc), [0.016 * sc, 0.017 * sc, 0.005], [6, 4]), yaw, c), bone, scar);
      R.part(placed(blob(V(0.014 * s * sc, 0.05 * sc, 0.085 * sc), [0.006, 0.006, 0.005], [5, 3]), yaw, c), bone, new THREE.Color('#ff5530'), true);
      R.part(placed(limb(V(0.03 * s * sc, 0.02, 0.03 * sc), V(0.05 * s * sc, 0.0, 0.05 * sc), 0.008, 0.005, 4), yaw, c), bone, fur);
    }
  }
}

// ── the giant spider (the arachnid) ────────────────────────────────────────────────────────────────────────────────────
// A cellar spider grown wrong: low and wide, eight banded legs, a swollen abdomen with a pale mark, eight eyes catching
// the light, the fangs working.
// The Spider Queen (a boss): the spider grown into a brood-mother. An egg-sac abdomen half again as long, ringed in bone
// and glowing with the eggs packed under its skin; a crown of bone spines; forelegs long and raised; fangs like sickles.
function queen(R, { dark, band, mark }) {
  const bone = new THREE.Color('#d6ccb2'), egg = new THREE.Color('#9ccc5a');
  const sac = (p, n) => { const zc = (p.z + 0.4) / 0.3, ring = Math.sin((p.z + 0.4) * 30) > 0.72; return n.y > 0.62 && Math.abs(zc) < 0.9 && Math.abs(p.x) < 0.014 + 0.05 * Math.abs(zc) ? mark : ring ? band : dark; };   // (an hourglass, in bone)
  R.part(blob(V(0, 0.4, -0.4), [0.25, 0.22, 0.38], [14, 10], -0.3), 'abdomen', sac);
  R.part(limb(V(0, 0.3, -0.74), V(0, 0.25, -0.8), 0.04, 0.014), 'abdomen', band);
  // the eggs, glowing under the skin of its flanks and back: a cluster each side and a line along the top
  for (let i = 0; i < 14; i++) {
    const a = (i / 14) * Math.PI * 2, z = -0.4 + 0.24 * Math.cos(a * 1.7), side = i % 2 ? 1 : -1, y = 0.4 + 0.12 * Math.sin(a * 2.3), x = side * Math.sqrt(Math.max(0, 1 - ((y - 0.4) / 0.22) ** 2 - ((z + 0.4) / 0.38) ** 2)) * 0.25 * 0.97;
    R.part(blob(V(x, y, z), [0.022, 0.018, 0.022], [6, 4]), 'abdomen', egg, true);
  }
  // the crown: five spines of bone along the cephalothorax's rear rim, raking back
  for (let i = 0; i < 5; i++) { const x = (i - 2) * 0.04, b = V(x, 0.34, 0.06 - Math.abs(i - 2) * 0.012); R.part(limb(b, b.clone().add(V(x * 0.6, 0.11 - Math.abs(i - 2) * 0.025, -0.07)), 0.014, 0.002, 4), 'ceph', bone); }
  for (const s of [1, -1]) R.part(limb(V(0.03 * s, 0.24, 0.3), V(0.045 * s, 0.13, 0.31), 0.012, 0.002, 4), `fang${s}`, bone);   // (sickles)
}

function spider(o = {}) {
  const R = new Rig(o.seed || 23), dark = new THREE.Color(o.body || '#241d1a'), band = new THREE.Color(o.band || '#5e4b3a'), mark = new THREE.Color(o.mark || '#b8ab8e');
  const legC = dark.clone().lerp(band, 0.4);   // (the legs a shade lighter than the body: on a dark floor they vanished, critic round in the game)
  const root = R.bone('root', null, V(0, 0.28, 0)), ceph = R.bone('ceph', root, V(0, 0.29, 0.1)), _abd = R.bone('abdomen', root, V(0, 0.31, -0.08));
  for (const s of [1, -1]) { const f = R.bone(`fang${s}`, ceph, V(0.035 * s, 0.25, 0.27)); R.bone(`palp${s}`, ceph, V(0.06 * s, 0.27, 0.24)); void f; }
  const Q = !!o.queen, LEG = [[38, Q ? 1.4 : 1.15], [72, 1.0], [108, 0.95], [142, 1.1]], legs = [];   // (the queen's forelegs long, raised to strike)
  for (const s of [1, -1]) LEG.forEach(([deg, k], i) => {
    const a = (deg * Math.PI) / 180, d = V(Math.sin(a) * s, 0, Math.cos(a)), at = V(0, 0.29, 0.1).add(d.clone().multiplyScalar(0.085));
    const knee = at.clone().add(d.clone().multiplyScalar(0.25 * k)).add(V(0, 0.19 * k, 0));
    const ankle = knee.clone().add(d.clone().multiplyScalar(0.27 * k)).add(V(0, -0.3 * k, 0));
    const tip = ankle.clone().add(d.clone().multiplyScalar(0.13 * k)); tip.y = 0.005;
    const A = R.bone(`leg${s}${i}a`, ceph, at), B = R.bone(`leg${s}${i}b`, A, knee); R.bone(`leg${s}${i}c`, B, ankle);
    legs.push({ s, i, d, k: d.clone().cross(UP).normalize(), name: `leg${s}${i}` });
    R.part(limb(at, knee, 0.03 * k, 0.025 * k), `leg${s}${i}a`, legC);
    R.part(blob(knee, [0.03 * k, 0.03 * k, 0.03 * k], [6, 4]), `leg${s}${i}b`, band);
    R.part(limb(knee, ankle, 0.024 * k, 0.017 * k), `leg${s}${i}b`, legC);
    R.part(blob(ankle, [0.02 * k, 0.02 * k, 0.02 * k], [6, 4]), `leg${s}${i}c`, band);
    R.part(limb(ankle, tip, 0.016 * k, 0.005), `leg${s}${i}c`, legC);
  });
  R.part(blob(V(0, 0.3, 0.1), [0.115, 0.07, 0.135]), 'ceph', dark);                     // the cephalothorax
  R.part(blob(V(0, 0.315, 0.225), [0.07, 0.055, 0.055]), 'ceph', dark);                 // the head
  // the abdomen, swollen, tilted up, a pale chevron down its back (the queen's: an egg-sac, half again as long, banded)
  if (!Q) {
    R.part(blob(V(0, 0.36, -0.29), [0.19, 0.165, 0.25], [12, 9], -0.25), 'abdomen', (p, n) => (n.y > 0.55 && Math.abs(p.x) < 0.012 + 0.03 * Math.max(0, Math.sin((p.z + 0.29) * 22)) ? mark : dark));
    R.part(limb(V(0, 0.27, -0.5), V(0, 0.24, -0.54), 0.03, 0.012), 'abdomen', band);    // the spinnerets
  } else queen(R, { dark, band, mark });
  for (const s of [1, -1]) {
    R.part(limb(V(0.035 * s, 0.27, 0.26), V(0.032 * s, 0.22, 0.3), 0.022, 0.016), `fang${s}`, dark);
    R.part(limb(V(0.032 * s, 0.22, 0.3), V(0.025 * s, 0.17, 0.29), 0.013, 0.003), `fang${s}`, new THREE.Color('#1a1012'));
    R.part(limb(V(0.06 * s, 0.27, 0.24), V(0.075 * s, 0.24, 0.33), 0.012, 0.009), `palp${s}`, band);
    R.part(limb(V(0.075 * s, 0.24, 0.33), V(0.07 * s, 0.19, 0.36), 0.009, 0.006), `palp${s}`, dark);
    // eight eyes: two large forward, six round them
    for (const [x, y, z, r] of [[0.018, 0.335, 0.272, 0.014], [0.045, 0.34, 0.258, 0.01], [0.03, 0.358, 0.25, 0.009], [0.055, 0.322, 0.252, 0.008]]) R.part(blob(V(x * s, y, z), [r, r, r], [6, 4]), 'ceph', new THREE.Color('#e8ff90'), true);
  }
  const root3 = R.mesh(o.eyes || '#b8e060', o.queen ? 1.25 : 1.6);
  // a leg's pose: swing (yaw, forward +), lift (the femur up), fold (knee and ankle bent in)
  const legQ = (L, swing, lift, fold = 0) => ({
    [`${L.name}a`]: qa(UP, -L.s * swing).multiply(qa(L.k, lift)),
    [`${L.name}b`]: qa(L.k, -fold), [`${L.name}c`]: qa(L.k, -fold * 0.6),
  });
  const walk = (t, A = 1) => {                                  // the alternating tetrapod: L0 R1 L2 R3, then the others
    let q = {};
    for (const L of legs) { const ph = ((L.i + (L.s > 0 ? 0 : 1)) % 2) * 0.5, sw = S(t + ph), lift = Math.max(0, C(t + ph)); q = { ...q, ...legQ(L, 0.28 * A * sw, 0.32 * A * lift, 0.25 * A * lift) }; }
    return q;
  };
  const fangs = (k) => ({ fang1: qe(-0.6 * k, 0, 0.35 * k), 'fang-1': qe(-0.6 * k, 0, -0.35 * k) });
  const palps = (t) => ({ palp1: qe(0.3 * S(t * 3), 0, 0), 'palp-1': qe(0.3 * S(t * 3 + 0.5), 0, 0) });
  const front = (k, extra = 0) => Object.assign({}, ...legs.filter((L) => L.i === 0).map((L) => legQ(L, 0.25 * k, (0.9 + extra) * k, -0.4 * k)));
  const clips = [
    // (idle, four seconds: breathing in the abdomen, the palps never still, the fangs flexing; one leg at a time lifted and
    // set down, the forelegs feeling ahead, the body turning a little on them. The queen's forelegs raised and weaving, her
    // sac swelling with the eggs)
    clip(R, 'Idle', Q ? 5.0 : 4.0, (t) => {
      const seq = [[0, 1, 0.06], [1, -1, 0.2], [0, -1, 0.34], [2, 1, 0.48], [1, 1, 0.6], [3, -1, 0.72], [2, -1, 0.82], [3, 1, 0.9]];
      let q = { ...walk(0, 0) };
      for (const L of legs) {
        const st = seq.find(([i, s]) => i === L.i && s === L.s), u = bell(st[2], st[2] + 0.04, st[2] + 0.1, t), feel = L.i === 0 ? 1 : 0.45;
        const raise = Q && L.i === 0 ? 0.55 + 0.15 * S(t * 3 + L.s * 0.25) : 0;
        q = { ...q, ...legQ(L, 0.12 * u * feel + (Q && L.i === 0 ? 0.2 : 0) + 0.04 * S(t + L.s * 0.25), (0.35 * u + 0.08 * u * S(t * 20)) * feel + raise, 0.25 * u - (raise ? 0.3 : 0)) };
      }
      const br = S(t * (Q ? 4 : 5)), fg = bell(0.42, 0.48, 0.58, t);
      return { q: { ...q, ...palps(t * 4), ...fangs(0.15 + 0.5 * fg * (0.6 + 0.4 * S(t * 24))), abdomen: qe(0.05 * br, 0.04 * S(t), 0), root: qe(0.02 * S(t * 2), 0.07 * S(t), 0.015 * S(t)) },
        p: { root: V(0, 0.005 * br, 0) }, s: { abdomen: V(1 + (Q ? 0.04 : 0.025) * br, 1 + (Q ? 0.05 : 0.03) * br, 1 + (Q ? 0.03 : 0.02) * br) } };
    }),
    clip(R, 'Walk', 0.55, (t) => ({ q: { ...walk(t), ...palps(t), abdomen: qe(0.05 * S(t * 2), 0.06 * S(t), 0) }, p: { root: V(0.008 * S(t), 0.01 * Math.abs(S(t * 2)), 0) } })),
    clip(R, 'Attack', 0.7, (t) => { const r = bell(0, 0.3, 0.55, t), s = bell(0.35, 0.5, 0.85, t); return { q: { ...walk(0, 0), ...front(r - 0.3 * s), ...fangs(r * 0.8 + s), root: qe(-0.45 * r + 0.25 * s, 0, 0) }, p: { root: V(0, 0.05 * r, 0.12 * s) } }; }),
    clip(R, 'Attack2', 0.5, (t) => { const s = bell(0.1, 0.35, 0.8, t); return { q: { ...walk(t * 0.5, 0.4), ...fangs(s * 1.2), root: qe(0.12 * s, 0, 0) }, p: { root: V(0, -0.02 * s, 0.09 * s) } }; }),
    clip(R, 'Heavy', 1.0, (t) => { const c = bell(0, 0.25, 0.4, t), j = bell(0.3, 0.55, 0.85, t); return { q: { ...walk(0, 0), ...Object.assign({}, ...legs.map((L) => legQ(L, (L.i < 2 ? 0.3 : -0.25) * j, -0.25 * c + 0.4 * j, 0.4 * c))), ...front(j, 0.3), ...fangs(j), root: qe(-0.3 * j, 0, 0) }, p: { root: V(0, -0.06 * c + 0.18 * j, 0.4 * ease(0.3, 0.85, t)) } }; }),
    clip(R, 'Hit', 0.45, (t) => { const k = bell(0, 0.2, 1, t); return { q: { ...Object.assign({}, ...legs.map((L) => legQ(L, 0, 0.3 * k, 0.2 * k))), root: qe(-0.2 * k, 0.15 * k, 0), ...fangs(0.6 * k) }, p: { root: V(0, 0.02 * k, -0.06 * k) } }; }),
    clip(R, 'Death', 1.2, (t) => { const k = ease(0, 0.7, t); return { q: { ...Object.assign({}, ...legs.map((L) => legQ(L, 0, 0.7 * k, 1.9 * k))), ...fangs(0.4 * k), abdomen: qe(0.25 * k, 0, 0) }, p: { root: V(0, -0.16 * k, 0) } }; }),   // the legs curled in under it, as a dead spider's are
    clip(R, 'Cast', 0.8, (t) => { const r = bell(0, 0.35, 0.6, t), s = bell(0.45, 0.55, 0.8, t); return { q: { ...walk(0, 0), ...front(r * 0.7), ...fangs(0.4 + s), root: qe(-0.35 * r + 0.15 * s, 0, 0), abdomen: qe(0.5 * r, 0, 0) }, p: { root: V(0, 0.04 * r, 0.04 * s) } }; }),   // (the web, spat: the spinner's shot)
  ];
  return { root: root3, clips };
}

// ── the fire beetle (the hexapod) ──────────────────────────────────────────────────────────────────────────────────────
// A red fire beetle: low and domed, its wing-cases a lacquered crimson going black at the tips, a dark pronotum, sickle
// mandibles, clubbed feelers, and the two fire-glands over its eyes that give it its name (a third at the tail). Under
// the wing-cases its belly smoulders: they lift for its charge and fly wide when it spits.
function beetle(o = {}) {
  const R = new Rig(o.seed || 31);
  const shell = new THREE.Color(o.shell || '#5e0e10'), shellHi = new THREE.Color(o.shellHi || '#8c1e1c')   /* (round S2: shaded smooth, the brighter read as an orange blob in the game) */, shellLo = new THREE.Color('#3a0b07'), tipC = new THREE.Color('#160a08');
  const chit = new THREE.Color(o.body || '#2a1510'), chitHi = new THREE.Color('#5a2a1c'), leg = new THREE.Color('#1b110d'), legHi = new THREE.Color('#4e2c1e'), ember = new THREE.Color('#ffb050');
  const shellC = (p, n) => (p.z < -0.27 ? tipC : n.y > 0.8 ? shellHi : n.y > 0.45 ? shell : n.y < 0.05 ? shellLo : mixC(shellLo, shell, n.y * 2.2));
  const chitC = (p, n) => (n.y > 0.7 ? chitHi : chit);
  R.bone('root', null, V(0, 0.16, 0)); const thorax = R.by.get('root');
  R.bone('thorax', thorax, V(0, 0.18, 0.15)); R.bone('head', R.by.get('thorax'), V(0, 0.16, 0.27)); R.bone('abdomen', thorax, V(0, 0.17, -0.04));
  for (const s of [1, -1]) {
    R.bone(`elytra${s}`, R.by.get('abdomen'), V(0.02 * s, 0.29, 0.1));
    R.bone(`mand${s}`, R.by.get('head'), V(0.04 * s, 0.13, 0.33));
    R.bone(`ant${s}`, R.by.get('head'), V(0.045 * s, 0.19, 0.32));
  }
  // the belly under the cases: dark plates, the smoulder between them (seen only when they lift)
  R.part(blob(V(0, 0.15, -0.08), [0.15, 0.085, 0.24], [10, 7]), 'abdomen', chit);
  for (let i = 0; i < 4; i++) R.part(blob(V(0, 0.228, -0.0 - i * 0.075), [0.11 - i * 0.017, 0.012, 0.024], [8, 4]), 'abdomen', ember, true);
  R.part(blob(V(0, 0.12, -0.31), [0.03, 0.026, 0.026], [6, 4]), 'abdomen', ember, true);   // the gland at the tail
  // the wing-cases: two lacquered domes meeting in a black seam
  for (const s of [1, -1]) {
    R.part(blob(V(0.05 * s, 0.17, -0.07), [0.12, 0.165, 0.265], [14, 10]), `elytra${s}`, shellC);   // (high and round: one dome, split)
    R.part(limb(V(0.004 * s, 0.335, 0.1), V(0.004 * s, 0.26, -0.3), 0.008, 0.005, 4), `elytra${s}`, tipC);
    for (let k = 0; k < 2; k++) R.part(limb(V((0.045 + k * 0.04) * s, 0.32 - k * 0.035, 0.08), V((0.05 + k * 0.045) * s, 0.27 - k * 0.05, -0.24), 0.005, 0.004, 3), `elytra${s}`, shellLo);   // the grooves
  }
  // the pronotum, broad and ridged; the head; the glands; the eyes; the mandibles; the feelers
  R.part(blob(V(0, 0.205, 0.16), [0.13, 0.085, 0.1], [12, 8]), 'thorax', chitC);
  R.part(limb(V(0, 0.29, 0.21), V(0, 0.28, 0.1), 0.012, 0.01, 4), 'thorax', chitHi);
  R.part(blob(V(0, 0.165, 0.27), [0.085, 0.062, 0.075], [10, 7]), 'head', chitC);
  for (const s of [1, -1]) {
    R.part(blob(V(0.046 * s, 0.215, 0.262), [0.026, 0.022, 0.026], [8, 6]), 'head', ember, true);   // the fire-glands
    R.part(blob(V(0.07 * s, 0.17, 0.3), [0.02, 0.022, 0.018], [6, 4]), 'head', new THREE.Color('#0b0707'));
    R.part(limb(V(0.04 * s, 0.13, 0.33), V(0.09 * s, 0.12, 0.4), 0.022, 0.015, 5), `mand${s}`, chit);
    R.part(limb(V(0.09 * s, 0.12, 0.4), V(0.03 * s, 0.115, 0.47), 0.015, 0.003, 5), `mand${s}`, tipC);
    R.part(limb(V(0.075 * s, 0.12, 0.42), V(0.06 * s, 0.12, 0.425), 0.006, 0.001, 3), `mand${s}`, tipC);   // (a tooth)
    R.part(limb(V(0.045 * s, 0.19, 0.32), V(0.095 * s, 0.27, 0.37), 0.007, 0.006, 4), `ant${s}`, leg);
    R.part(limb(V(0.095 * s, 0.27, 0.37), V(0.135 * s, 0.285, 0.43), 0.006, 0.005, 4), `ant${s}`, leg);
    R.part(blob(V(0.14 * s, 0.288, 0.44), [0.018, 0.012, 0.022], [6, 4]), `ant${s}`, legHi);
  }
  // six legs: spined, the front pair forward, the back pair raked
  const legs = [];
  [[0.15, 35, 0.9], [0.05, 85, 1.0], [-0.06, 135, 1.12]].forEach(([z, deg, k], i) => {
    for (const s of [1, -1]) {
      const a = (deg * Math.PI) / 180, d = V(Math.sin(a) * s, 0, Math.cos(a)), at = V(0.075 * s, 0.1, z);   // (short and close in: a beetle, not a spider)
      const knee = at.clone().add(d.clone().multiplyScalar(0.13 * k)).add(V(0, 0.05, 0)), ankle = knee.clone().add(d.clone().multiplyScalar(0.15 * k)); ankle.y = 0.025;
      const tip = ankle.clone().add(d.clone().multiplyScalar(0.07 * k)); tip.y = 0.004;
      const A = R.bone(`leg${s}${i}a`, R.by.get('root'), at), B = R.bone(`leg${s}${i}b`, A, knee); R.bone(`leg${s}${i}c`, B, ankle);
      legs.push({ s, i, k: d.clone().cross(UP).normalize(), name: `leg${s}${i}` });
      R.part(limb(at, knee, 0.034, 0.026), `leg${s}${i}a`, leg);
      R.part(blob(knee, [0.025, 0.025, 0.025], [6, 4]), `leg${s}${i}b`, legHi);
      R.part(limb(knee, ankle, 0.019, 0.012), `leg${s}${i}b`, leg);
      for (const f of [0.35, 0.7]) { const q = knee.clone().lerp(ankle, f); R.part(limb(q, q.clone().add(d.clone().multiplyScalar(0.035)).add(V(0, 0.01, 0)), 0.006, 0.001, 3), `leg${s}${i}b`, legHi); }   // spines
      R.part(limb(ankle, tip, 0.01, 0.004), `leg${s}${i}c`, leg);
    }
  });
  const root3 = R.mesh(o.glow || '#ff6a14', 1.4);
  const legQ = (L, swing, lift, fold = 0) => ({ [`${L.name}a`]: qa(UP, -L.s * swing).multiply(qa(L.k, lift)), [`${L.name}b`]: qa(L.k, -fold), [`${L.name}c`]: qa(L.k, -fold * 0.5) });
  const walk = (t, A = 1) => { let q = {}; for (const L of legs) { const ph = ((L.i + (L.s > 0 ? 0 : 1)) % 2) * 0.5, sw = S(t + ph), lift = Math.max(0, C(t + ph)); q = { ...q, ...legQ(L, 0.32 * A * sw, 0.35 * A * lift, 0.2 * A * lift) }; } return q; };   // the tripod gait
  const mand = (k) => ({ mand1: qe(0, 0.55 * k, 0), 'mand-1': qe(0, -0.55 * k, 0) });
  const cases = (k, spread = 0) => ({ elytra1: qe(0, 0.3 * spread, 1.05 * k), 'elytra-1': qe(0, -0.3 * spread, -1.05 * k) });
  const feel = (t, a = 1) => ({ ant1: qe(0.25 * a * S(t * 2), 0.3 * a * S(t), 0), 'ant-1': qe(0.25 * a * S(t * 2 + 0.3), -0.3 * a * S(t + 0.2), 0) });
  const clips = [
    // (idle, four seconds: the feelers sweeping and stopping, the mandibles clacking twice, one leg after another shifted,
    // the head turned to look; and once a loop the wing-cases lifted and fluttered, the smoulder under them showing)
    clip(R, 'Idle', 4.0, (t) => {
      const seq = [[0, 1, 0.08], [2, -1, 0.2], [1, 1, 0.3], [0, -1, 0.44], [2, 1, 0.82], [1, -1, 0.9]];
      let q = { ...walk(0, 0) };
      for (const L of legs) { const st = seq.find(([i, s]) => i === L.i && s === L.s), u = bell(st[2], st[2] + 0.035, st[2] + 0.08, t); q = { ...q, ...legQ(L, 0.15 * u * S(st[2] * 7), 0.3 * u, 0.2 * u) }; }
      const cl = bell(0.14, 0.17, 0.2, t) + bell(0.22, 0.25, 0.28, t), fl = bell(0.58, 0.64, 0.76, t), lk = bell(0.32, 0.4, 0.56, t), pause = 1 - 0.8 * lk;
      return { q: { ...q, ...feel(t * 4, pause), ...mand(0.15 + 0.7 * cl), head: qe(0.04 * S(t * 2), 0.3 * lk * S((t - 0.32) * 1.6), 0.08 * lk), thorax: qe(-0.04 * fl, 0, 0),
        ...cases(0.03 * Math.max(0, S(t * 5)) + fl * (0.42 + 0.08 * S(t * 40)), 0.2 * fl), abdomen: qe(-0.06 * fl, 0, 0), root: qe(0.015 * S(t * 2), 0.03 * S(t), 0) },
        p: { root: V(0, 0.004 * S(t * 5) + 0.008 * fl, 0) } };
    }),
    clip(R, 'Walk', 0.42, (t) => ({ q: { ...walk(t), ...feel(t * 2, 0.6), abdomen: qe(0, 0.05 * S(t), 0), head: qe(0, -0.05 * S(t), 0) }, p: { root: V(0.006 * S(t), 0.008 * Math.abs(S(t * 2)), 0) } })),
    clip(R, 'Attack', 0.6, (t) => { const w = bell(0, 0.25, 0.45, t), k = bell(0.3, 0.45, 0.8, t); return { q: { ...walk(0, 0), ...mand(1.0 * w - 0.25 * k), ...feel(t, 0.4), root: qe(-0.12 * w + 0.12 * k, 0, 0), head: qe(-0.2 * w + 0.25 * k, 0, 0) }, p: { root: V(0, 0.015 * w, -0.03 * w + 0.12 * k) } }; }),
    clip(R, 'Attack2', 0.55, (t) => { const w = bell(0, 0.3, 0.5, t), k = bell(0.35, 0.5, 0.85, t); return { q: { ...walk(t * 0.5, 0.3), ...mand(0.4 * w), root: qe(0.12 * w - 0.2 * k, 0.12 * k, 0), thorax: qe(-0.2 * k, 0, 0) }, p: { root: V(0, 0.03 * k, 0.1 * k) } }; }),
    clip(R, 'Heavy', 0.9, (t) => { const c = bell(0, 0.25, 0.4, t), j = bell(0.3, 0.55, 0.85, t); return { q: { ...walk(t * 2, 0.9 * j), ...cases(0.35 * (c + j), 0.3), ...mand(0.8 * j), root: qe(0.1 * c - 0.15 * j, 0, 0) }, p: { root: V(0, -0.03 * c + 0.05 * j, 0.32 * ease(0.3, 0.8, t)) } }; }),
    clip(R, 'Hit', 0.4, (t) => { const k = bell(0, 0.22, 1, t); return { q: { ...Object.assign({}, ...legs.map((L) => legQ(L, 0, 0.25 * k, 0.2 * k))), ...cases(0.12 * k), root: qe(-0.15 * k, 0.15 * k, 0.06 * k), ...feel(t * 3, k) }, p: { root: V(0, 0.02 * k, -0.05 * k) } }; }),
    clip(R, 'Death', 1.2, (t) => { const f = ease(0.05, 0.55, t), k = ease(0.3, 0.9, t); return { q: { root: qe(0, 0, Math.PI * f), ...Object.assign({}, ...legs.map((L) => legQ(L, 0.15 * Math.sin(L.i * 2 + t * 30) * (1 - k) * f, 0.9 * k, 1.6 * k))), ...mand(0.3 * k) }, p: { root: V(0, 0.12 * bell(0.05, 0.3, 0.55, t) + 0.15 * f, 0) } }; }),   // (flipped onto its back, the legs kicking, then curled)
    clip(R, 'Cast', 0.9, (t) => { const o = bell(0.05, 0.35, 0.85, t), s = bell(0.45, 0.55, 0.75, t); return { q: { ...walk(0, 0), ...cases(1.0 * o, 0.5 * o), ...mand(0.9 * o), root: qe(-0.22 * o + 0.18 * s, 0, 0), abdomen: qe(-0.25 * o, 0, 0), head: qe(-0.15 * o + 0.3 * s, 0, 0) }, p: { root: V(0, 0.03 * o, 0.04 * s) } }; }),   // (the cases flung wide, the belly glowing: the spit)
  ];
  return { root: root3, clips };
}

// ── the goblin (the small biped) ───────────────────────────────────────────────────────────────────────────────────────
// After the owner's reference (2026-11-10): two-thirds of a man and hunched, a big bald head a third of its height, bat
// ears out wide and up, ragged at their edges and ringed in brass; a heavy brow over small red eyes sunk deep, a big
// nose, a wide grin of sharp teeth; skinny, a little pot belly, long arms to big long-fingered hands, big bare feet. A
// ragged red scarf over its shoulders on a leather mantle, a belt of round pouches and a buckle, a red rag of a
// loincloth, leather wound round its wrists and shins. No weapon: it fights with its claws.
function goblin(o = {}) {
  const R = new Rig(o.seed || 41);
  // (green, darker than the reference's: the game's figure light lifts it, and a bright green read lime: round W4's lesson)
  const skin = new THREE.Color(o.skin || '#3a5022'), skinHi = new THREE.Color(o.skinHi || '#56702e'), skinLo = new THREE.Color('#203012');   // (round S2: '#47622a' read lime in the game)
  const skinC = (p, n) => (n.y > 0.55 ? mixC(skin, skinHi, (n.y - 0.55) * 2.2) : n.y < -0.4 ? skinLo : skin);
  const red = new THREE.Color(o.rag || '#7e1c14'), redHi = new THREE.Color('#a8321e'), redLo = new THREE.Color('#4a100c');
  const redC = (p, n) => (n.y > 0.6 ? redHi : n.y < -0.3 ? redLo : red);
  const leather = new THREE.Color(o.leather || '#3a2618'), leatherHi = new THREE.Color('#5c3e26'), leatherC = (p, n) => (n.y > 0.5 ? leatherHi : leather);
  const wrap = new THREE.Color('#6a4a30'), wrapLo = new THREE.Color('#4a3220');
  const tooth = new THREE.Color('#e2d6a8'), nail = new THREE.Color('#cfc29a'), mouth = new THREE.Color('#1c0806'), socket = new THREE.Color('#141a0c'), inner = new THREE.Color('#6e3a2c'), brass = new THREE.Color('#b08a3a');
  R.bone('root', null, V(0, 0.3, 0)); R.bone('spine', R.by.get('root'), V(0, 0.37, 0.01)); R.bone('chest', R.by.get('spine'), V(0, 0.45, 0.03));
  R.bone('neck', R.by.get('chest'), V(0, 0.5, 0.06)); R.bone('head', R.by.get('neck'), V(0, 0.56, 0.08)); R.bone('jaw', R.by.get('head'), V(0, 0.545, 0.13));
  for (const s of [1, -1]) {
    const u = R.bone(`armU${s}`, R.by.get('chest'), V(0.1 * s, 0.475, 0.03)), l = R.bone(`armL${s}`, u, V(0.15 * s, 0.36, 0.05)); R.bone(`hand${s}`, l, V(0.165 * s, 0.25, 0.08));
    const h = R.bone(`legU${s}`, R.by.get('root'), V(0.055 * s, 0.29, 0)), k = R.bone(`legL${s}`, h, V(0.07 * s, 0.17, 0.045)); R.bone(`foot${s}`, k, V(0.07 * s, 0.045, -0.01));
  }
  // the body: skinny, a little pot belly, a narrow chest under the mantle
  R.part(blob(V(0, 0.3, 0.005), [0.068, 0.05, 0.058], [8, 6]), 'root', skinC);
  R.part(blob(V(0, 0.375, 0.04), [0.07, 0.068, 0.068], [9, 7]), 'spine', skinC);                     // the belly
  R.part(blob(V(0, 0.445, 0.03), [0.08, 0.06, 0.058], [8, 6]), 'chest', skinC);
  for (const s of [1, -1]) R.part(limb(V(0.025 * s, 0.45, 0.085), V(0.03 * s, 0.415, 0.088), 0.007, 0.004), 'chest', skinLo);   // (ribs showing under the skin)
  R.part(limb(V(0, 0.47, 0.05), V(0, 0.55, 0.085), 0.03, 0.026), 'neck', skinC);
  // the mantle and the scarf: dark leather over the shoulders, a V down the back; over it the red scarf wound round the
  // neck in a thick roll and hanging in rags down the chest and the back
  R.part(blob(V(0, 0.478, 0.025), [0.125, 0.04, 0.088], [9, 6]), 'chest', leatherC);
  R.part(limb(V(0, 0.49, -0.04), V(0, 0.4, -0.06), 0.06, 0.004, 4), 'chest', leather);           // (the V at the back)
  for (const s of [1, -1]) R.part(limb(V(0.1 * s, 0.47, 0.0), V(0.12 * s, 0.43, 0.0), 0.04, 0.006, 4), 'chest', leather);
  R.part(new THREE.TorusGeometry(0.062, 0.03, 10, 20).rotateX(Math.PI / 2 - 0.25).scale(1.25, 1, 1.1).translate(0, 0.505, 0.045), 'chest', redC);   // the roll round the neck
  const rag = (a, b, w, bone, c = redC) => R.part(limb(a, b, w, 0.004, 4).scale(1, 1, 1), bone, c);
  for (const [x, l, z] of [[-0.05, 0.1, 0.1], [-0.01, 0.13, 0.11], [0.035, 0.09, 0.105]]) rag(V(x, 0.49, z), V(x * 1.2, 0.49 - l, z + 0.012), 0.024, 'chest');   // down the chest
  for (const [x, l] of [[-0.06, 0.1], [-0.02, 0.14], [0.03, 0.12], [0.07, 0.09]]) rag(V(x, 0.5, -0.02), V(x * 1.15, 0.5 - l, -0.06), 0.026, 'chest');           // down the back
  for (const s of [1, -1]) rag(V(0.11 * s, 0.49, 0.03), V(0.14 * s, 0.43, 0.03), 0.03, 'chest');
  // the belt: a strap round the waist, a buckle, round pouches at its sides and back
  R.part(new THREE.TorusGeometry(0.072, 0.012, 6, 20).rotateX(Math.PI / 2).scale(1, 1, 1.05).translate(0, 0.325, 0.025), 'root', leatherC);
  R.part(new THREE.BoxGeometry(0.034, 0.03, 0.014).translate(0, 0.325, 0.104), 'root', brass);
  R.part(new THREE.BoxGeometry(0.018, 0.014, 0.016).translate(0, 0.325, 0.106), 'root', leather);
  for (const [x, z, k] of [[0.07, 0.05, 1], [-0.075, 0.03, 0.9], [0.04, -0.06, 0.8]]) {
    R.part(blob(V(x, 0.3, z), [0.026 * k, 0.03 * k, 0.022 * k], [7, 5]), 'root', leatherC);
    R.part(blob(V(x, 0.322, z), [0.024 * k, 0.008, 0.02 * k], [7, 3]), 'root', leather);                  // (its flap)
  }
  // the loincloth: a red rag hanging front and back from the belt, its hem torn
  const cloth = (z, dir) => {
    const pts = [[-0.045, 0], [0.045, 0], [0.04, -0.07], [0.022, -0.085], [0.012, -0.11], [-0.004, -0.09], [-0.022, -0.115], [-0.035, -0.08], [-0.045, -0.075]];
    const g = new THREE.ExtrudeGeometry(new THREE.Shape(pts.map(([x, y]) => new THREE.Vector2(x, y))), { depth: 0.008, bevelEnabled: false });
    g.translate(0, 0, -0.004).rotateX(0.15 * dir).translate(0, 0.32, z); R.part(g, 'root', redC);
  };
  cloth(0.085, -1); cloth(-0.06, 1);
  // the head: big and bald, a heavy brow, the eyes sunk under it, a big nose, a wide grin of sharp teeth
  R.part(blob(V(0, 0.625, 0.07), [0.112, 0.102, 0.108]), 'head', skinC);                     // the skull
  R.part(blob(V(0, 0.58, 0.125), [0.088, 0.058, 0.07], [9, 7]), 'head', skinC);                      // the face, the cheeks
  for (const s of [1, -1]) R.part(blob(V(0.058 * s, 0.57, 0.155), [0.03, 0.026, 0.026], [8, 6]), 'head', skinC);   // (cheeks pushed up by the grin)
  // (the brow: two heavy ridges over the eyes, low at the nose, a scowl; round G1's one band round the skull read as a cap)
  for (const s of [1, -1]) R.part(blob(V(0, 0, 0), [0.042, 0.019, 0.03], [8, 6]).rotateZ(-0.38 * s).translate(0.038 * s, 0.632, 0.168), 'head', skinC);
  R.part(limb(V(0, 0.625, 0.19), V(0, 0.58, 0.235), 0.022, 0.02), 'head', skinC);               // the nose, big and hooked
  R.part(blob(V(0, 0.575, 0.232), [0.024, 0.022, 0.022], [8, 6]), 'head', skinC);
  for (const s of [1, -1]) {
    R.part(blob(V(0.04 * s, 0.608, 0.178), [0.022, 0.016, 0.012], [6, 4]), 'head', socket);         // the sockets, deep
    R.part(blob(V(0.04 * s, 0.608, 0.186), [0.011, 0.009, 0.006], [6, 4]), 'head', new THREE.Color('#ff3a20'), true);   // the eyes, red
  }
  // the grin: a dark mouth wide across the face, teeth along both its lips (the lower on the jaw), the jaw under it
  const arc = (x) => 0.195 - 1.6 * x * x;
  R.part(blob(V(0, 0.548, 0.172), [0.07, 0.016, 0.032], [9, 4]), 'head', mouth);
  for (let i = -4; i <= 4; i++) { const x = i * 0.0145; R.part(limb(V(x, 0.556, arc(x)), V(x, 0.538, arc(x) + 0.003), 0.0065, 0.001, 4), 'head', tooth); }
  for (let i = -3; i <= 3; i++) { const x = i * 0.016 + 0.007; R.part(limb(V(x, 0.534, arc(x) - 0.004), V(x, 0.55, arc(x)), 0.006, 0.001, 4), 'jaw', tooth); }
  R.part(blob(V(0, 0.527, 0.14), [0.07, 0.028, 0.058], [8, 6]), 'jaw', skinC);                        // the jaw, the chin
  // the ears: bat's, out wide and up, ragged along their lower edges, the inside darker; brass rings through them
  const EAR = [[0, -0.04], [0.05, -0.05], [0.07, -0.036], [0.095, -0.048], [0.13, -0.034], [0.145, -0.022], [0.175, -0.024], [0.215, 0.002], [0.25, 0.03], [0.2, 0.034], [0.15, 0.042], [0.09, 0.05], [0.03, 0.05], [0, 0.04]];
  const EK = 1.25;   // (round S3: in the game they read small beside the reference's)
  const earXf = (g, s) => g.rotateZ(0.5 * s).rotateY(0.45 * s).translate(0.085 * s, 0.635, 0.05);
  for (const s of [1, -1]) {
    const shape = (k, dz) => { const g = new THREE.ExtrudeGeometry(new THREE.Shape(EAR.map(([x, y]) => new THREE.Vector2(x * k * s * EK, y * k * EK))), { depth: 0.012, bevelEnabled: false }); return g.translate(0, 0, dz); };
    R.part(earXf(shape(1, -0.006), s), 'head', skinC);
    R.part(earXf(shape(0.78, 0.004).translate(0.02 * s, 0.002, 0), s), 'head', inner);
    for (const [x, y] of s > 0 ? [[0.07, -0.046], [0.12, -0.04]] : [[0.1, -0.046]]) R.part(earXf(new THREE.TorusGeometry(0.016, 0.004, 4, 10).rotateY(Math.PI / 2).translate(x * s * EK, y * EK, 0), s), 'head', brass);
  }
  // the arms: long and thin, knobbed at the elbow, leather round the wrist; the hands big, long-fingered, clawed
  for (const s of [1, -1]) {
    R.part(blob(V(0.1 * s, 0.47, 0.03), [0.03, 0.028, 0.03], [7, 5]), `armU${s}`, skinC);
    R.part(limb(V(0.1 * s, 0.475, 0.03), V(0.15 * s, 0.36, 0.05), 0.022, 0.017), `armU${s}`, skinC);
    R.part(blob(V(0.15 * s, 0.36, 0.05), [0.02, 0.02, 0.02], [6, 4]), `armL${s}`, skinC);
    R.part(limb(V(0.15 * s, 0.36, 0.05), V(0.165 * s, 0.25, 0.08), 0.018, 0.016), `armL${s}`, skinC);
    for (const [y, r] of [[0.3, 0.021], [0.282, 0.022], [0.264, 0.021]]) R.part(limb(V(0.158 * s, y + 0.008, 0.066), V(0.16 * s, y - 0.008, 0.07), r, r, 7), `armL${s}`, (p, n) => (n.y > 0.2 ? wrap : wrapLo));
    const at = V(0.168 * s, 0.226, 0.09);
    R.part(blob(at, [0.034, 0.028, 0.038], [8, 6]), `hand${s}`, skinC);
    for (let f = 0; f < 4; f++) {   // (long, splayed a little, the tips curled down and under: a claw; round G1's straight ones read as a rake)
      const a = (f - 1.5) * 0.22, d = V(Math.sin(a) * 0.5 * s, -0.55, 0.65).normalize(), d2 = V(Math.sin(a) * 0.4 * s, -0.95, 0.15).normalize();
      const b = at.clone().add(V((f - 1.5) * 0.015 * s, -0.008, 0.026)), m = b.clone().add(d.clone().multiplyScalar(0.034 - Math.abs(f - 1.5) * 0.004)), e = m.clone().add(d2.clone().multiplyScalar(0.026));
      R.part(limb(b, m, 0.0105, 0.009, 4), `hand${s}`, skinC); R.part(blob(m, [0.0095, 0.0095, 0.0095], [5, 4]), `hand${s}`, skinC);
      R.part(limb(m, e, 0.009, 0.0065, 4), `hand${s}`, skinC); R.part(limb(e, e.clone().add(V(0, -0.012, -0.008)), 0.0065, 0.0008, 4), `hand${s}`, nail);
    }
    { const b = at.clone().add(V(-0.022 * s, -0.004, 0.018)), e = b.clone().add(V(-0.016 * s, -0.022, 0.026)); R.part(limb(b, e, 0.01, 0.008, 4), `hand${s}`, skinC); R.part(limb(e, e.clone().add(V(-0.002 * s, -0.012, 0.004)), 0.006, 0.0008, 4), `hand${s}`, nail); }   // the thumb
    // the legs: thin, the knee a knob, leather wound round the shin; the feet big and bare, long-toed
    R.part(limb(V(0.055 * s, 0.29, 0), V(0.07 * s, 0.17, 0.045), 0.027, 0.02), `legU${s}`, skinC);
    R.part(blob(V(0.07 * s, 0.17, 0.045), [0.024, 0.024, 0.024], [6, 4]), `legL${s}`, skinC);
    R.part(limb(V(0.07 * s, 0.17, 0.045), V(0.07 * s, 0.045, -0.01), 0.02, 0.016), `legL${s}`, skinC);
    for (const [y, r] of [[0.14, 0.023], [0.12, 0.024], [0.1, 0.023], [0.08, 0.021]]) { const k = (0.17 - y) / 0.125; R.part(limb(V(0.07 * s, y + 0.009, 0.045 - 0.055 * k), V(0.07 * s, y - 0.009, 0.045 - 0.055 * (k + 0.07)), r, r, 7), `legL${s}`, (p, n) => (n.y > 0.2 ? wrap : wrapLo)); }
    R.part(blob(V(0.07 * s, 0.026, 0.04), [0.036, 0.02, 0.068], [8, 6]), `foot${s}`, skinC);
    R.part(blob(V(0.07 * s, 0.035, -0.02), [0.022, 0.022, 0.026], [6, 4]), `foot${s}`, skinC);          // the heel
    for (let f = 0; f < 4; f++) { const x = (0.07 + (f - 1.5) * 0.017) * s, b = V(x, 0.016, 0.09), e = V(x * 1.06, 0.01, 0.132 - Math.abs(f - 1.2) * 0.007);
      R.part(limb(b, e, 0.011, 0.008, 4), `foot${s}`, skinC); R.part(limb(e, e.clone().add(V(0, -0.005, 0.014)), 0.007, 0.001, 4), `foot${s}`, nail); }
  }
  // (round S2: from the game's camera the head read a quarter of it, the reference's is a third: the head and all on it a
  // tenth bigger about its middle, the jaw's bone with it)
  { const hb = [R.bones.indexOf(R.by.get('head')), R.bones.indexOf(R.by.get('jaw'))], hc = V(0, 0.59, 0.1), K = 1.12;
    for (const q of R.parts) if (hb.includes(q.bone)) q.geo.translate(-hc.x, -hc.y, -hc.z).scale(K, K, K).translate(hc.x, hc.y, hc.z);
    const jw = R.by.get('jaw'); jw.userData.at.sub(hc).multiplyScalar(K).add(hc); jw.position.copy(jw.userData.at).sub(R.by.get('head').userData.at); }
  const root3 = R.mesh(o.eyes || '#ff3a20', 1.5);
  // poses: a crouch (always), the claws ready, a stride
  const crouch = (k = 1) => ({ legU1: qe(-0.35 * k, 0, 0.05), 'legU-1': qe(-0.35 * k, 0, -0.05), legL1: qe(0.6 * k, 0, 0), 'legL-1': qe(0.6 * k, 0, 0) });
  const ready = { armU1: qe(-0.45, 0, 0.18), armL1: qe(-0.55, 0, 0), 'armU-1': qe(-0.45, 0, -0.18), 'armL-1': qe(-0.55, 0, 0), hand1: qe(0.3, 0, 0), 'hand-1': qe(0.3, 0, 0) };   // (the claws up and out)
  const run = (t, A = 1) => {
    const q = {};
    for (const s of [1, -1]) { const ph = s > 0 ? 0 : 0.5, sw = S(t + ph), up = Math.max(0, -C(t + ph)); q[`legU${s}`] = qe(-0.35 - 0.6 * A * sw, 0, 0.05 * s); q[`legL${s}`] = qe(0.55 + 1.0 * A * up, 0, 0); q[`foot${s}`] = qe(-0.3 * A * up, 0, 0); q[`armU${s}`] = qe(-0.35 + 0.6 * A * sw, 0, 0.15 * s); q[`armL${s}`] = qe(-0.7, 0, 0); }
    return q;
  };
  const clips = [
    clip(R, 'Idle', 1.8, (t) => { const look = Math.max(-1, Math.min(1, 2.2 * S(t))); return { q: { ...crouch(), ...ready, spine: qe(0.25 + 0.03 * S(t * 2), 0, 0), chest: qe(0.05 * S(t * 2), 0, 0), head: qe(-0.2, 0.45 * look, 0.06 * look), jaw: qe(0.12 * Math.max(0, S(t * 3)), 0, 0), hand1: qe(0.3 + 0.2 * S(t * 4), 0, 0), 'hand-1': qe(0.3 + 0.2 * S(t * 4 + 0.3), 0, 0) }, p: { root: V(0, -0.035 + 0.006 * S(t * 2), 0) } }; }),   // (the fingers working)
    clip(R, 'Walk', 0.5, (t) => ({ q: { ...run(t), spine: qe(0.4, 0.12 * S(t), 0), head: qe(-0.35 + 0.08 * S(t * 2), -0.12 * S(t), 0), root: qe(0, -0.15 * S(t), 0) }, p: { root: V(0, -0.04 + 0.025 * Math.abs(S(t)), 0) } })),
    clip(R, 'Attack', 0.6, (t) => { const w = bell(0, 0.3, 0.42, t), k = bell(0.36, 0.48, 0.85, t); return { q: { ...crouch(1 + 0.3 * k), ...ready, spine: qe(0.2 - 0.25 * w + 0.45 * k, 0.35 * w - 0.35 * k, 0), 'armU-1': qe(-0.45 - 2.1 * w + 1.6 * k, 0, -0.18 - 0.3 * w + 0.3 * k), 'armL-1': qe(-0.55 - 0.4 * w + 0.5 * k, 0, 0), 'hand-1': qe(-0.4 * w + 0.6 * k, 0, 0), head: qe(-0.2 + 0.25 * k, 0, 0), jaw: qe(0.4 * w, 0, 0) }, p: { root: V(0, -0.035 - 0.02 * k, 0.06 * k) } }; }),   // (a raking swipe, right claw)
    clip(R, 'Attack2', 0.5, (t) => { const w = bell(0, 0.25, 0.38, t), k = bell(0.32, 0.42, 0.8, t); return { q: { ...crouch(1 + 0.4 * k), ...ready, spine: qe(0.25 + 0.3 * k, 0.3 * w - 0.3 * k, 0), armU1: qe(-0.45 + 0.4 * w - 1.2 * k, -0.3 * k, 0.18), armL1: qe(-1.3 * w - 0.1 * k, 0, 0), jaw: qe(0.3 * k, 0, 0) }, p: { root: V(0, -0.04, -0.03 * w + 0.12 * k) } }; }),   // (a jab, left claw)
    clip(R, 'Heavy', 0.9, (t) => { const c = bell(0, 0.22, 0.32, t), a = bell(0.25, 0.45, 0.62, t), k = bell(0.55, 0.65, 0.95, t); return { q: { ...crouch(1 + 0.8 * c - 0.6 * a + 0.5 * k), spine: qe(0.3 * c - 0.3 * a + 0.6 * k, 0, 0), armU1: qe(-0.45 - 2.4 * a + 1.8 * k, 0, 0.3), 'armU-1': qe(-0.45 - 2.4 * a + 1.8 * k, 0, -0.3), armL1: qe(-0.5 - 0.3 * a, 0, 0), 'armL-1': qe(-0.5 - 0.3 * a, 0, 0), jaw: qe(0.5 * a, 0, 0), head: qe(-0.3 * a + 0.2 * k, 0, 0) }, p: { root: V(0, -0.035 - 0.05 * c + 0.16 * a - 0.03 * k, 0.3 * ease(0.25, 0.65, t)) } }; }),   // (a leap, both claws down on it)
    clip(R, 'Hit', 0.4, (t) => { const k = bell(0, 0.2, 1, t); return { q: { ...crouch(), ...ready, spine: qe(0.2 - 0.35 * k, 0.15 * k, 0), head: qe(-0.2 - 0.4 * k, -0.3 * k, 0), jaw: qe(0.3 * k, 0, 0) }, p: { root: V(0, -0.035, -0.05 * k) } }; }),
    clip(R, 'Death', 1.1, (t) => { const k = ease(0, 0.65, t); return { q: { ...crouch(1 - 0.5 * k), root: qe(-1.45 * k, 0, 0.1 * k), spine: qe(0.2 - 0.3 * k, 0, 0), head: qe(-0.3 - 0.5 * k, 0.4 * k, 0), jaw: qe(0.5 * k, 0, 0), armU1: qe(-0.3 - 1.2 * k, 0, 0.7 * k), 'armU-1': qe(-0.5 - 1.4 * k, 0, -0.6 * k), armL1: qe(-0.3, 0, 0), 'armL-1': qe(-0.4, 0, 0) }, p: { root: V(0, -0.035 - 0.18 * k, -0.12 * k) } }; }),   // (on its back, arms flung out)
    clip(R, 'Cast', 0.9, (t) => { const k = bell(0.05, 0.3, 0.85, t), h = Math.max(0, S(t * 4)); return { q: { ...crouch(1 - 0.3 * k), ...ready, spine: qe(0.2 - 0.3 * k, 0, 0), head: qe(-0.2 - 0.5 * k, 0.1 * S(t * 2), 0), jaw: qe(0.6 * k * (0.5 + 0.5 * h), 0, 0), 'armU-1': qe(-0.45 - 2.2 * k, 0, -0.18 - 0.4 * k), armU1: qe(-0.45 - 2.2 * k, 0, 0.18 + 0.4 * k), armL1: qe(-0.55 + 0.3 * k, 0, 0), 'armL-1': qe(-0.55 + 0.3 * k, 0, 0) }, p: { root: V(0, -0.035 + 0.04 * k * h, 0) } }; }),   // (a jeer: both claws up, the head back, cackling)
  ];
  return { root: root3, clips };
}

// ── the graveyard wraith (the floating shroud) ─────────────────────────────────────────────────────────────────────────
// After the owner's reference (2026-11-10): a man and a half tall and never touching the ground. A skull under a hood
// crowned with three horns, its jaw hung open and its sockets lit; a shroud over the shoulders hanging in tatters; long
// arms flung wide, gaunt, the fingers splayed and clawed; below the waist no legs but the shroud twisting down into a
// point, and round it tendrils that curl up off it like flames. Dark, the green of its own light catching its tips.
function wraith(o = {}) {
  const R = new Rig(o.seed || 53);
  const robe = new THREE.Color(o.robe || '#2b2f30'), robeHi = new THREE.Color(o.robeHi || '#38483f')   /* (in the game's light a brighter green read lime: round W4) */, robeLo = new THREE.Color('#141617');   // (its upper edges green: the reference's rim of its own light)
  const robeC = (p, n) => (n.y > 0.8 ? robeHi : n.y < -0.35 ? robeLo : robe);   // (round W2: green on the top edges only)
  const skull = new THREE.Color('#b9b4a0'), skullLo = new THREE.Color('#7d796a'), flesh = new THREE.Color('#3f4744'), claw = new THREE.Color('#c8c6b0'), voidC = new THREE.Color('#050706'), horn = new THREE.Color('#2a2c2c');
  const soul = new THREE.Color('#bfffe0');
  const skullC = (p, n) => (n.y < -0.3 ? skullLo : skull);
  R.bone('root', null, V(0, 0.85, 0)); R.bone('spine', R.by.get('root'), V(0, 1.0, 0.0)); R.bone('chest', R.by.get('spine'), V(0, 1.2, 0.03));
  R.bone('neck', R.by.get('chest'), V(0, 1.32, 0.07)); R.bone('head', R.by.get('neck'), V(0, 1.4, 0.1)); R.bone('jaw', R.by.get('head'), V(0, 1.375, 0.15));
  // (the owner, 2026-11-10: "wraith arms are always stuck out wide, they should move, and be more like human arm movements".
  // The bind pose was the reference's spread, every clip a few degrees off it. Now a man's arms at rest: hanging from slack
  // shoulders a little out from the body (from the game's camera arms at the sides vanish against the robe), the elbows
  // bent, gaunt forearms bringing the claws forward to the hips, reaching; the reference's spread is the peak of its
  // Heavy and its Cast. Each hand has a `claw` bone at the knuckles, so the fingers curl and splay.)
  const ARM = {};
  for (const s of [1, -1]) {
    const Sh = V(0.2 * s, 1.27, 0.04), El = V(0.3 * s, 0.99, 0.12), Wr = V(0.35 * s, 0.7, 0.29);   // (round A2: longer, gaunt, the reference's)
    const up = El.clone().sub(Sh).normalize(), fore = Wr.clone().sub(El).normalize(), hinge = up.clone().cross(fore).normalize();   // (the elbow's hinge)
    const palm = V(-s, 0, 0.25).normalize(), spread = palm.clone().cross(fore).normalize(), Kn = Wr.clone().add(fore.clone().multiplyScalar(0.07));
    const u = R.bone(`armU${s}`, R.by.get('chest'), Sh), l = R.bone(`armL${s}`, u, El), h = R.bone(`hand${s}`, l, Wr); R.bone(`claw${s}`, h, Kn);
    ARM[s] = { Sh, El, Wr, Kn, up, fore, hinge, palm, spread };
  }
  // the column: the shroud below the waist twisting down to a point (three bones), and six tendrils curling up off it
  const colP = [V(0, 0.95, 0.0), V(0.03, 0.66, -0.02), V(-0.03, 0.4, 0.0), V(0.01, 0.15, 0.03)], colR = [0.13, 0.15, 0.11, 0.06];   // (a waist, then the shroud's fall)
  let cb = R.by.get('root');
  for (let i = 0; i < 3; i++) { cb = R.bone(`shroud${i}`, cb, colP[i]); R.part(limb(colP[i + 1], colP[i], colR[i + 1], colR[i], 9), `shroud${i}`, robeC); }
  R.part(limb(colP[3], V(0, 0.04, 0.04), 0.04, 0.003, 6), 'shroud2', robeC);
  const T = 6, tend = [];
  for (let i = 0; i < T; i++) {
    const th = (i / T) * TAU + 0.3, tw = 0.9, h = hash3(i, 2, 5, 13), lo = 0.08 + 0.12 * h;
    const pt = (k, r, y) => V(r * Math.cos(th + tw * k), y, r * Math.sin(th + tw * k));
    // (from low on the column out along the ground and curling up: a tongue of flame; round W1, thin sticks read as legs)
    const P = [pt(0, 0.08, 0.5 - 0.12 * (i % 2)), pt(0.5, 0.18, 0.24 + lo * 0.3), pt(0.9, 0.27 + 0.05 * h, 0.26 + lo * 0.5), pt(1.25, 0.32 + 0.06 * h, 0.42 + lo), pt(1.45, 0.3 + 0.06 * h, 0.62 + lo * 1.2)];
    let tb = R.by.get('root'); const names = [];
    for (let k = 0; k < 3; k++) { tb = R.bone(`tend${i}${k}`, tb, P[k]); names.push(`tend${i}${k}`); }
    const rad = [0.09, 0.08, 0.06, 0.035, 0.002];
    const tb2 = tube(P, rad, names, 8, 20); R.part(tb2.g, R.skin(tb2.skin), robeC);
    tend.push(names);
  }
  // the shroud over the shoulders, and its tatters hanging over the chest and back
  // (round W2: no barrel ringed in spikes; shoulders draped, a chest narrowing to a waist, the shroud hanging from the
  // shoulders in a V over the chest and long down the back)
  R.part(blob(V(0, 1.25, 0.02), [0.24, 0.11, 0.16], [12, 8]), 'chest', robeC);
  R.part(limb(V(0, 0.96, 0.0), V(0, 1.2, 0.02), 0.13, 0.2, 10), 'spine', robeC);
  for (const s of [1, -1]) {
    R.part(limb(V(0.17 * s, 1.27, 0.08), V(0.03 * s, 0.95, 0.15), 0.085, 0.01, 3), 'chest', robeC);    // the V over the chest
    R.part(limb(V(0.21 * s, 1.24, 0.03), V(0.12 * s, 0.9, 0.09), 0.07, 0.006, 3), 'chest', robeC);
    R.part(limb(V(0.12 * s, 1.27, -0.08), V(0.1 * s, 0.82, -0.14), 0.085, 0.006, 3), 'chest', robeC);  // down the back
  }
  R.part(limb(V(0, 1.27, -0.1), V(0, 0.74, -0.16), 0.09, 0.006, 3), 'chest', robeC);
  // the hood, over the skull and down the shoulders; its crown of three horns
  R.part(blob(V(0, 1.45, 0.05), [0.14, 0.16, 0.13], [12, 9]), 'head', robeC);
  R.part(blob(V(0, 1.53, 0.14), [0.11, 0.04, 0.08], [8, 5], -0.3), 'head', robeC);   // (the hood's brim, over the brow)
  for (const s of [1, -1]) R.part(limb(V(0.11 * s, 1.44, 0.1), V(0.15 * s, 1.26, 0.06), 0.05, 0.03, 5), 'head', robeC);
  for (const [x, top, lean] of [[0, 0.33, 0], [0.075, 0.25, 0.05], [-0.075, 0.25, -0.05]]) {
    const b = V(x, 1.56, 0.1), m = V(x + lean * 0.6, 1.56 + top * 0.55, 0.09), e = V(x + lean * 1.6, 1.56 + top, 0.06);
    R.part(limb(b, m, 0.03, 0.017, 5), 'head', horn); R.part(limb(m, e, 0.017, 0.002, 4), 'head', horn);
  }
  // the skull: the cranium, the brow, the sockets dark with a light in each, the nose's hole, the teeth; the jaw hung open
  R.part(blob(V(0, 1.425, 0.165), [0.09, 0.098, 0.088], [10, 8]), 'head', skullC);
  R.part(blob(V(0, 1.462, 0.23), [0.08, 0.025, 0.035], [8, 4]), 'head', skull);
  for (const s of [1, -1]) {
    R.part(blob(V(0.037 * s, 1.43, 0.238), [0.03, 0.027, 0.016], [6, 5]), 'head', voidC);
    R.part(blob(V(0.037 * s, 1.43, 0.25), [0.012, 0.01, 0.006], [5, 3]), 'head', soul, true);
    R.part(blob(V(0.063 * s, 1.39, 0.215), [0.024, 0.02, 0.027], [6, 4]), 'head', skull);   // the cheekbones
  }
  R.part(blob(V(0, 1.4, 0.252), [0.011, 0.015, 0.008], [4, 3]), 'head', voidC);
  for (let i = -3; i <= 3; i++) R.part(limb(V(i * 0.012, 1.374, 0.238 - Math.abs(i) * 0.005), V(i * 0.012, 1.352, 0.24 - Math.abs(i) * 0.005), 0.006, 0.002, 3), 'head', claw);
  R.part(blob(V(0, 1.33, 0.205), [0.058, 0.024, 0.045], [8, 5]), 'jaw', skullC);
  for (let i = -2; i <= 2; i++) R.part(limb(V(i * 0.013, 1.34, 0.243 - Math.abs(i) * 0.005), V(i * 0.013, 1.36, 0.244 - Math.abs(i) * 0.005), 0.006, 0.002, 3), 'jaw', claw);
  // the arms: a bell sleeve from the shoulder to the elbow, its mouth dark inside and its hem in rags; gaunt forearms; big
  // hands with long clawed fingers. The sleeve's top is shared with the chest and the forearm's root with the sleeve, so a
  // raised arm stays joined at the shoulder and bends at the elbow (round A1: rigid pieces broke apart when they moved)
  for (const s of [1, -1]) {
    const A = ARM[s], U = `armU${s}`, Lb = `armL${s}`, H = `hand${s}`, Cl = `claw${s}`;
    const shoulderW = R.skin((p) => { const k = Math.max(0, Math.min(1, p.distanceTo(A.Sh) / 0.1)); return k >= 1 ? [[U, 1]] : [[U, 0.45 + 0.55 * k], ['chest', 0.55 - 0.55 * k]]; });
    const elbowW = R.skin((p) => { const k = Math.max(0, Math.min(1, p.distanceTo(A.El) / 0.06)); return k >= 1 ? [[Lb, 1]] : [[Lb, 0.5 + 0.5 * k], [U, 0.5 - 0.5 * k]]; });
    R.part(blob(A.Sh.clone().add(V(0, 0.01, 0)), [0.075, 0.065, 0.075]), shoulderW, robeC);               // (the shoulder, rounded under the drape)
    R.part(limb(A.Sh, A.El.clone().add(A.up.clone().multiplyScalar(0.03)), 0.065, 0.12, 9), shoulderW, (p, n) => (n.dot(A.up) > 0.7 ? voidC : robeC(p, n)));
    for (let k = 0; k < 7; k++) {   // (the hem: rags hanging from the sleeve's mouth, longest at the back and under)
      const a = (k / 7) * TAU + 0.4, r = 0.105, m = A.El.clone().add(A.up.clone().multiplyScalar(0.03)), side = V(s, 0, 0), fw = V(0, 0, 1);
      const at = m.clone().add(side.clone().multiplyScalar(Math.cos(a) * r)).add(fw.clone().multiplyScalar(Math.sin(a) * r * 0.9));
      const len = 0.1 + 0.09 * hash3(k, s, 6, 3) + (Math.sin(a) < 0 ? 0.06 : 0);
      R.part(limb(at, at.clone().add(V(0.01 * s * Math.cos(a), -len, -0.02)), 0.032, 0.003, 3), U, robeC);
    }
    R.part(limb(A.El.clone().add(A.up.clone().multiplyScalar(-0.02)), A.Wr, 0.034, 0.025, 7), elbowW, flesh);   // the forearm, gaunt
    R.part(blob(A.El, [0.032, 0.03, 0.032], [6, 5]), elbowW, flesh);                                                // (the elbow's knob)
    R.part(blob(A.Wr.clone().add(A.fore.clone().multiplyScalar(0.035)), [0.05, 0.055, 0.04], [7, 5]), H, flesh);   // the palm (round A2: the reference's big hands)
    for (let f = 0; f < 4; f++) {   // (long, a little splayed, curled in toward the palm at their tips)
      const ang = (f - 1.5) * 0.24, d = A.fore.clone().multiplyScalar(Math.cos(ang)).add(A.spread.clone().multiplyScalar(Math.sin(ang))).normalize();
      const b = A.Kn.clone().add(A.spread.clone().multiplyScalar((f - 1.5) * 0.022)), len = 0.1 - Math.abs(f - 1.5) * 0.01;
      const m = b.clone().add(d.clone().multiplyScalar(len)), d2 = d.clone().add(A.palm.clone().multiplyScalar(0.45)).normalize(), e = m.clone().add(d2.clone().multiplyScalar(len * 0.8));
      const d3 = d2.clone().add(A.palm.clone().multiplyScalar(0.5)).normalize();
      R.part(limb(b, m, 0.015, 0.012, 5), Cl, flesh); R.part(blob(m, [0.013, 0.013, 0.013], [5, 4]), Cl, flesh);
      R.part(limb(m, e, 0.012, 0.009, 5), Cl, flesh); R.part(limb(e, e.clone().add(d3.multiplyScalar(0.065)), 0.009, 0.001, 4), Cl, claw);
    }
    { const b = A.Wr.clone().add(A.fore.clone().multiplyScalar(0.025)).add(A.palm.clone().multiplyScalar(0.025)).add(A.spread.clone().multiplyScalar(-0.03)), d = A.fore.clone().multiplyScalar(0.5).add(A.palm.clone().multiplyScalar(0.55)).add(A.spread.clone().multiplyScalar(-0.45)).normalize(), e = b.clone().add(d.clone().multiplyScalar(0.07));
      R.part(limb(b, e, 0.012, 0.009, 5), H, flesh); R.part(limb(e, e.clone().add(d.add(A.palm.clone().multiplyScalar(0.4)).normalize().multiplyScalar(0.04)), 0.008, 0.001, 4), H, claw); }   // the thumb
  }
  const root3 = R.mesh(o.glow || '#5ff0a0', 1.3);
  const writhe = (t, a = 1, trail = 0) => ({
    ...Object.fromEntries([0, 1, 2].map((i) => [`shroud${i}`, qe(trail * (0.12 + 0.08 * i) + 0.05 * a * S(t - i * 0.2), 0.15 * a * S(t * 0.5 - i * 0.25), 0.05 * a * C(t - i * 0.2))])),
    ...Object.fromEntries(tend.flatMap((n, i) => n.map((b, k) => [b, qe(trail * 0.3 + 0.16 * a * S(t + i / T + k * 0.15), 0.1 * a * C(t * 0.5 + i / T), 0.14 * a * S(t * 1.3 + i / T - k * 0.2))]))) });
  // an arm's pose, as a man's: `fwd` raises it forward (up over the head at about 2.6), `out` swings it out to the side
  // (the reference's spread at about 1.6; under 0 across the body), `bend` flexes the elbow (under 0 straightens it),
  // `curl` closes the claws (under 0 splays them), `wrist` cocks the hand; `twist` turns the arm in its socket
  const X = V(1, 0, 0), Z = V(0, 0, 1);
  const arm = (s, { fwd = 0, out = 0, bend = 0, curl = 0, wrist = 0, twist = 0 } = {}) => {
    const A = ARM[s];
    return { [`armU${s}`]: qa(UP, -twist * s).multiply(qa(Z, out * s)).multiply(qa(X, -fwd)), [`armL${s}`]: qa(A.hinge, -bend), [`hand${s}`]: qa(A.hinge, -wrist), [`claw${s}`]: qa(A.spread, curl * s) };
  };
  const arms = (l, r) => ({ ...arm(1, l), ...arm(-1, r) });   // (its left, its right: the right is −x, facing +z)
  const lag = (f, t, d) => f(t - d);                          // (overlap: the elbow a beat after the shoulder, the claws after that)
  const clips = [
    // breathing in the shoulders; its right hand slowly rising to the chest, the claws curling, the left a beat behind it
    clip(R, 'Idle', 3.0, (t) => {
      const rise = (u) => bell(0.25, 0.48, 0.78, ((u % 1) + 1) % 1), b = 0.06 * S(t);
      return { q: { ...writhe(t), ...arms(
        { fwd: 0.06 + b + 0.35 * lag(rise, t, 0.5), out: 0.05, bend: 0.1 + 0.45 * lag(rise, t, 0.56), curl: 0.15 + 0.5 * lag(rise, t, 0.62) },
        { fwd: 0.06 + b + 0.75 * rise(t), out: 0.05 + 0.1 * rise(t), bend: 0.1 + 1.0 * lag(rise, t, 0.05), curl: 0.15 + 0.85 * lag(rise, t, 0.12) - 0.4 * lag(rise, t, 0.35) * 0, wrist: 0.25 * lag(rise, t, 0.08) }),
        head: qe(0.08 * S(t + 0.2), 0.15 * S(t * 0.5), 0.05 * S(t)), jaw: qe(0.3 + 0.12 * Math.max(0, S(t * 2)), 0, 0), spine: qe(0.06 + 0.03 * S(t), 0, 0) }, p: { root: V(0, 0.04 * S(t), 0) } };
    }),
    // drifting: the arms trailing back with it, swinging a little against each other, the forearms lagging
    clip(R, 'Walk', 1.2, (t) => ({ q: { ...writhe(t * 2, 1.3, 0.45), root: qe(0.2, 0, 0.05 * S(t)), ...arms(
      { fwd: -0.4 + 0.18 * S(t), out: 0.12, bend: 0.3 + 0.12 * S(t - 0.1), curl: 0.3 + 0.1 * S(t - 0.2) },
      { fwd: -0.4 + 0.18 * S(t + 0.5), out: 0.12, bend: 0.3 + 0.12 * S(t + 0.4), curl: 0.3 + 0.1 * S(t + 0.3) }), jaw: qe(0.3, 0, 0) }, p: { root: V(0, 0.03 * S(t * 2), 0) } })),
    // a rake with the right claw: the arm cocked up behind the head, the body wound back; then raked down across it, the
    // elbow snapping straight, the claws closing after it and the follow-through past the left hip
    clip(R, 'Attack', 0.7, (t) => {
      const w = bell(0, 0.3, 0.45, t), k = bell(0.38, 0.52, 0.9, t), we = bell(0, 0.33, 0.48, t), ke = bell(0.4, 0.55, 0.9, t), c = bell(0.46, 0.6, 0.95, t);
      return { q: { ...writhe(t, 1.5, 0.2 * k), chest: qe(0.15 * k, -0.45 * w + 0.5 * k, 0), ...arms(
        { fwd: 0.1 + 0.3 * w - 0.25 * k, out: 0.2 * w, bend: 0.25 + 0.4 * we, curl: 0.2 },
        { fwd: 0.05 + 2.5 * w + 0.6 * k, out: 0.45 * w - 0.55 * k, bend: 0.1 + 1.3 * we - 0.45 * ke, curl: -0.45 * w + 1.1 * c, wrist: 0.5 * we - 0.5 * ke }),
        jaw: qe(0.3 + 0.4 * k, 0, 0), head: qe(0.15 * k, 0.25 * k, 0) }, p: { root: V(0, 0.04 * w, 0.12 * k) } };
    }),
    // a two-handed lunge: both arms drawn back, then thrown forward at head height, the claws open, and shut on it
    clip(R, 'Attack2', 0.75, (t) => {
      const w = bell(0, 0.35, 0.5, t), k = bell(0.42, 0.56, 0.92, t), ke = bell(0.46, 0.6, 0.92, t), g = bell(0.52, 0.64, 0.96, t);
      const one = (o) => ({ fwd: -0.45 * w + 1.55 * k, out: 0.3 * w - 0.2 * k + o, bend: 0.2 + 0.8 * w - 0.55 * ke, curl: 0.2 - 0.6 * w - 0.2 * k + 1.3 * g });
      return { q: { ...writhe(t, 1.5, 0.3 * k), ...arms(one(0), one(0.04)), spine: qe(-0.2 * w + 0.4 * k, 0, 0), jaw: qe(0.3 + 0.5 * w, 0, 0) }, p: { root: V(0, 0.08 * w - 0.04 * k, 0.1 * k) } };
    }),
    // it rises and flings its arms wide and up (the reference's spread), shrieking; then dives, both sweeping forward and down
    clip(R, 'Heavy', 1.1, (t) => {
      const r = bell(0, 0.35, 0.55, t), d = bell(0.5, 0.62, 0.95, t), re = bell(0, 0.4, 0.6, t);
      const one = (o) => ({ fwd: 0.45 * r + 1.3 * d, out: 1.65 * r + o - 0.1 * d, bend: 0.2 - 0.55 * re + 0.15 * d, curl: 0.2 - 0.8 * re + 1.0 * d, wrist: -0.3 * re });
      return { q: { ...writhe(t * 1.5, 2, 0.6 * d), ...arms(one(0), one(0.06)), spine: qe(-0.35 * r + 0.5 * d, 0, 0), head: qe(-0.5 * r + 0.3 * d, 0, 0), jaw: qe(0.3 + 0.6 * r, 0, 0) }, p: { root: V(0, 0.18 * r - 0.08 * d, 0.38 * ease(0.5, 0.8, t)) } };
    }),
    // struck: the arms snap in to the chest, elbows up, the head thrown back
    clip(R, 'Hit', 0.45, (t) => {
      const k = bell(0, 0.2, 1, t), ke = bell(0, 0.26, 1, t);
      const one = { fwd: 0.85 * k, out: -0.45 * k, bend: 0.1 + 1.5 * ke, curl: 0.2 + 0.8 * ke };
      return { q: { ...writhe(t * 2, 1 + 2 * k, -0.3 * k), ...arms(one, one), spine: qe(-0.3 * k, 0.2 * k, 0), head: qe(-0.35 * k, -0.2 * k, 0), jaw: qe(0.3 + 0.3 * k, 0, 0) }, p: { root: V(0, 0.03 * k, -0.08 * k) } };
    }),
    // a last reach upward, a shriek; then the arms go slack and fold in as the shroud empties into a heap
    clip(R, 'Death', 1.6, (t) => {
      const r = bell(0, 0.18, 0.42, t), k = ease(0.2, 0.9, t), f = 1 - 0.72 * k;
      const one = (o) => ({ fwd: 2.3 * r + 0.35 * k, out: 0.4 * r - 0.3 * k + o, bend: 0.1 - 0.35 * r + 0.6 * k, curl: -0.5 * r + 0.9 * k });
      return { q: { ...writhe(t * 2, 2 * r + 0.3, -0.5 * k), ...arms(one(0), one(0.1)), spine: qe(0.15 * k - 0.3 * r, 0, 0), head: qe(-0.5 * r + 0.5 * k, 0, 0), jaw: qe(0.3 + 0.6 * r, 0, 0) }, p: { root: V(0, 0.1 * r - 0.74 * k, 0) }, s: { root: V(1 + 0.3 * k, f, 1 + 0.3 * k) } };
    }),
    // the drain: arms lifted wide and forward, palms to its prey, the fingers splayed and trembling, the head back
    clip(R, 'Cast', 1.0, (t) => {
      const k = bell(0.05, 0.4, 0.9, t), ke = bell(0.1, 0.45, 0.92, t), tr = 0.06 * S(t * 11) * k;
      const one = (o) => ({ fwd: 0.85 * k + tr, out: 1.3 * k + o, bend: 0.15 - 0.4 * ke, curl: 0.15 - 0.75 * ke + tr * 2, wrist: -0.45 * ke });   // (round A2: narrower, the hands crossed before its face)
      return { q: { ...writhe(t * 1.5, 1.5, -0.2 * k), ...arms(one(0), one(0.05)), spine: qe(-0.25 * k, 0, 0), head: qe(-0.45 * k, 0, 0), jaw: qe(0.3 + 0.5 * k, 0, 0) }, p: { root: V(0, 0.1 * k, 0) } };
    }),
  ];
  return { root: root3, clips };
}

// ── the stone golem (the heavy biped) ──────────────────────────────────────────────────────────────────────────────────
// After the owner's reference (2026-11-10): twice a man, built of chiselled blocks of pale blue-grey stone. A great chest
// with a carved disc on it, a ring cut round a hole at its heart; a small block of a head between the shoulders, two
// stub horns on it, round holes for eyes, a dark slot of a mouth; shoulders like cut boulders; long arms in segments,
// boxy fists hanging to the knees, rusted manacles on the forearms and their broken chains trailing on the floor; a
// narrow waist-block over stacked block legs. Yellow-green lichen in veins down the stone and in tufts on its tops. It
// falls apart when it dies.
// a chiselled block: an octagonal prism (its edges cut) with its top and bottom rims cut too, turned so its faces meet
// the axes, its corners nudged by a hash so it looks worked by hand; half-extents h, the cut k (a fraction)
function block(c, h, seed = 0, k = 0.22, rot = [0, 0, 0]) {
  const prof = [[0, -1], [1 - k, -1], [1, -1 + k], [1, 1 - k], [1 - k, 1], [0, 1]].map(([r, y]) => new THREE.Vector2(Math.max(1e-4, r), y));
  const g = new THREE.LatheGeometry(prof, 8).rotateY(Math.PI / 8), P = g.attributes.position, v = new THREE.Vector3(), co = 1 / Math.cos(Math.PI / 8);
  for (let i = 0; i < P.count; i++) { v.fromBufferAttribute(P, i); const j = 1 + (hash3(Math.round(v.x * 1e3), Math.round(v.y * 1e3), Math.round(v.z * 1e3), seed) - 0.5) * 0.12; P.setXYZ(i, v.x * h[0] * co * j, v.y * h[1] * j, v.z * h[2] * co * j); }
  g.rotateX(rot[0]).rotateY(rot[1]).rotateZ(rot[2]); g.translate(c.x, c.y, c.z); return g;
}
function golem(o = {}) {
  const R = new Rig(o.seed || 67), sd = o.seed || 67; R.crease = (28 * Math.PI) / 180;   // (its blocks' cut edges stay hard: an octagon's faces meet at 45°)
  const stone = new THREE.Color(o.stone || '#46525e'), stoneHi = new THREE.Color(o.stoneHi || '#5a6774'), stoneLo = new THREE.Color('#2c343e');   // (blue-grey, darker than the reference's: the game's figure light lifts it, round G3; under the torches a greyer one read beige)
  const moss = new THREE.Color(o.moss || '#5e6c1e'), mossHi = new THREE.Color('#7e8c2a'), vein = new THREE.Color('#68761a')   /* (round S2: shaded smooth it read pale blue and its veins neon) */, rust = new THREE.Color('#5e3a20'), rustHi = new THREE.Color('#84552c');
  const hole = new THREE.Color('#121416'), ember = new THREE.Color('#ffb24a');
  // (stone, lichen on what faces up in patches: the reference's)
  const stoneC = (p, n) => (n.y > 0.8 && hash3(Math.round(p.x * 18), Math.round(p.y * 18), Math.round(p.z * 18), sd) > 0.72 ? moss : n.y > 0.35 ? mixC(stone, stoneHi, (n.y - 0.35) * 2) : n.y < -0.35 ? stoneLo : stone);
  R.bone('root', null, V(0, 0.62, 0)); R.bone('spine', R.by.get('root'), V(0, 0.84, 0)); R.bone('chest', R.by.get('spine'), V(0, 1.22, 0.02)); R.bone('head', R.by.get('chest'), V(0, 1.5, 0.12));
  for (const s of [1, -1]) {
    const u = R.bone(`armU${s}`, R.by.get('chest'), V(0.48 * s, 1.48, 0)), l = R.bone(`armL${s}`, u, V(0.6 * s, 1.08, 0.05)); R.bone(`fist${s}`, l, V(0.6 * s, 0.62, 0.14));
    const h = R.bone(`legU${s}`, R.by.get('root'), V(0.19 * s, 0.58, 0)), k = R.bone(`legL${s}`, h, V(0.21 * s, 0.33, 0.03)); R.bone(`foot${s}`, k, V(0.21 * s, 0.09, 0.02));
  }
  let n = 0; const B = (c, h, bone, k = 0.22, rot = [0, 0, 0]) => R.part(block(c, h, sd + ++n, k, rot), bone, stoneC);
  // the trunk: the belt over the hips, a narrow waist, the great chest and its plates, the back
  B(V(0, 0.62, 0), [0.25, 0.08, 0.17], 'root', 0.3); B(V(0, 0.78, 0.01), [0.2, 0.1, 0.16], 'spine', 0.3);
  B(V(0, 1.18, 0), [0.38, 0.25, 0.25], 'chest', 0.28); B(V(0, 1.38, -0.12), [0.3, 0.14, 0.15], 'chest', 0.3);
  for (const s of [1, -1]) { B(V(0.2 * s, 1.34, 0.17), [0.15, 0.1, 0.08], 'chest', 0.3, [0.1, 0, 0.08 * s]); B(V(0.22 * s, 1.02, 0.15), [0.13, 0.08, 0.08], 'chest', 0.3, [-0.1, 0, -0.06 * s]); }
  // the disc: carved, a ring cut round a hole at its heart (an ember far back in it)
  R.part(new THREE.CylinderGeometry(0.17, 0.19, 0.08, 10).rotateX(Math.PI / 2).translate(0, 1.16, 0.25), 'chest', stoneC);
  R.part(new THREE.TorusGeometry(0.115, 0.016, 4, 14).translate(0, 1.16, 0.293), 'chest', stoneLo);
  R.part(new THREE.CylinderGeometry(0.045, 0.045, 0.04, 8).rotateX(Math.PI / 2).translate(0, 1.16, 0.282), 'chest', hole);
  R.part(blob(V(0, 1.16, 0.27), [0.022, 0.022, 0.01], [6, 4]), 'chest', ember, true);
  for (const [x, y] of [[-0.07, 1.25], [0.08, 1.09], [0.1, 1.23]]) R.part(blob(V(x, y, 0.295), [0.012, 0.012, 0.006], [5, 3]), 'chest', hole);   // pocks in the stone
  // the head: a block between the shoulders, its stub horns, round eye holes, the slot of a mouth
  B(V(0, 1.54, 0.15), [0.13, 0.11, 0.12], 'head', 0.25);
  for (const s of [1, -1]) {
    B(V(0.1 * s, 1.69, 0.13), [0.05, 0.075, 0.05], 'head', 0.3, [0, 0, -0.35 * s]);
    R.part(blob(V(0.052 * s, 1.565, 0.268), [0.026, 0.026, 0.012], [6, 4]), 'head', hole);
    R.part(blob(V(0.052 * s, 1.565, 0.272), [0.011, 0.011, 0.005], [5, 3]), 'head', ember, true);
  }
  R.part(new THREE.BoxGeometry(0.11, 0.035, 0.02).translate(0, 1.485, 0.266), 'head', hole);
  // the arms: cut boulders for shoulders, the upper arm, the elbow, the great forearm and its manacle, the fist
  for (const s of [1, -1]) {
    B(V(0.48 * s, 1.5, 0), [0.17, 0.15, 0.16], `armU${s}`, 0.28, [0, 0, 0.15 * s]);
    B(V(0.55 * s, 1.27, 0.02), [0.11, 0.14, 0.11], `armU${s}`, 0.25);
    B(V(0.6 * s, 1.08, 0.05), [0.1, 0.07, 0.1], `armL${s}`, 0.3);
    B(V(0.6 * s, 0.86, 0.09), [0.14, 0.19, 0.14], `armL${s}`, 0.25);
    B(V(0.6 * s, 0.58, 0.14), [0.13, 0.1, 0.13], `fist${s}`, 0.3);
    for (const f of [-1, 0, 1]) B(V((0.6 + f * 0.075) * s, 0.5, 0.2), [0.035, 0.04, 0.045], `fist${s}`, 0.35);
    // the manacle, rusted, and its chain: off the cuff, down to the floor and trailing along it
    R.part(new THREE.TorusGeometry(0.165, 0.035, 5, 12).rotateX(Math.PI / 2).translate(0.6 * s, 0.76, 0.09), `armL${s}`, (p, nn) => (nn.y > 0.3 ? rustHi : rust));
    const pts = [V((0.6 + 0.13) * s, 0.72, 0.16), V((0.68) * s, 0.42, 0.22), V((0.66) * s, 0.12, 0.28), V(0.6 * s, 0.03, 0.4), V(0.45 * s, 0.03, 0.5)];
    let link = 0;
    for (let i = 0; i < pts.length - 1; i++) {
      const a = pts[i], b = pts[i + 1], len = a.distanceTo(b), steps = Math.max(2, Math.round(len / 0.055));
      for (let k = 0; k < steps; k++) {
        const c = a.clone().lerp(b, (k + 0.5) / steps), d = b.clone().sub(a).normalize();
        const g = new THREE.TorusGeometry(0.03, 0.01, 3, 6).scale(1, 1.5, 1);
        if (link++ % 2) g.rotateY(Math.PI / 2);
        g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(UP, d)).translate(c.x, c.y, c.z);
        R.part(g, `armL${s}`, (p, nn) => (nn.y > 0.3 ? rustHi : rust));
      }
    }
    // the legs: stacked blocks, the knees cut, the feet broad
    B(V(0.19 * s, 0.47, 0.02), [0.12, 0.11, 0.12], `legU${s}`, 0.28);
    B(V(0.21 * s, 0.33, 0.04), [0.1, 0.06, 0.1], `legL${s}`, 0.3);
    B(V(0.21 * s, 0.2, 0.04), [0.11, 0.1, 0.11], `legL${s}`, 0.28);
    B(V(0.21 * s, 0.055, 0.08), [0.13, 0.055, 0.17], `foot${s}`, 0.3);
  }
  // the lichen: veins of it down the stone (thin strokes on its faces), and tufts on its tops
  const veins = [['chest', V(-0.25, 1.4, 0.21), V(-0.12, 1.02, 0.25)], ['chest', V(0.3, 1.32, 0.2), V(0.18, 0.98, 0.22)], ['chest', V(-0.05, 1.34, 0.25), V(0.04, 1.27, 0.27)],
    ['spine', V(0.1, 0.86, 0.17), V(0.05, 0.7, 0.17)], ['head', V(-0.08, 1.64, 0.25), V(-0.05, 1.5, 0.27)]];
  for (const s of [1, -1]) veins.push([`armL${s}`, V(0.68 * s, 1.0, 0.2), V(0.62 * s, 0.7, 0.24)], [`legU${s}`, V(0.25 * s, 0.56, 0.13), V(0.2 * s, 0.4, 0.14)], [`armU${s}`, V(0.4 * s, 1.62, 0.12), V(0.5 * s, 1.4, 0.16)]);
  veins.push(['chest', V(0.05, 1.42, 0.22), V(0.25, 1.24, 0.24)], ['chest', V(-0.3, 1.08, 0.2), V(-0.1, 0.96, 0.2)]);
  for (const s of [1, -1]) veins.push([`legL${s}`, V(0.25 * s, 0.29, 0.14), V(0.18 * s, 0.1, 0.15)], [`armU${s}`, V(0.58 * s, 1.38, 0.13), V(0.52 * s, 1.16, 0.13)]);
  for (const [bone, a, b] of veins) {   // (zigzags, thick enough to read: round G1's were lost)
    const m1 = a.clone().lerp(b, 0.33).add(V(0.025, 0, 0.01)), m2 = a.clone().lerp(b, 0.66).add(V(-0.02, 0, 0.01));
    R.part(limb(a, m1, 0.018, 0.016, 3), bone, vein); R.part(limb(m1, m2, 0.016, 0.013, 3), bone, vein); R.part(limb(m2, b, 0.013, 0.004, 3), bone, vein);
  }
  // (fuzzy balls of it, as the reference's: a core and a burst of short blades; round G1's were sticks)
  const tuft = (c, bone, r = 1) => {
    R.part(blob(c.clone().add(V(0, 0.015 * r, 0)), [0.03 * r, 0.025 * r, 0.03 * r], [6, 4]), bone, moss);
    for (let i = 0; i < 12; i++) { const a = (i / 12) * TAU + (i % 2) * 0.3, e = 0.35 + 0.5 * ((i * 7) % 5) / 5, d = V(Math.cos(a) * Math.cos(e), Math.sin(e) + 0.3, Math.sin(a) * Math.cos(e)).normalize(); R.part(limb(c.clone().add(V(0, 0.012 * r, 0)), c.clone().add(d.clone().multiplyScalar((0.045 + 0.015 * (i % 3)) * r)), 0.016 * r, 0.002, 3), bone, i % 3 ? mossHi : moss); }
  };
  // (round G2: the tufts read as little stars at the game's size; the reference's are big fuzzy clumps)
  for (const s of [1, -1]) { tuft(V(0.11 * s, 1.77, 0.13), 'head', 1.5); tuft(V(0.46 * s, 1.66, 0.02), `armU${s}`, 1.9); tuft(V(0.62 * s, 1.0, 0.18), `armL${s}`, 1.6); tuft(V(0.21 * s, 0.4, 0.12), `legU${s}`, 1.3); tuft(V(0.66 * s, 0.6, 0.12), `fist${s}`, 1.2); }
  tuft(V(-0.2, 1.44, 0.12), 'chest', 1.8); tuft(V(0.16, 0.71, 0.08), 'root', 1.3); tuft(V(0.27, 1.3, 0.22), 'chest', 1.3);
  const root3 = R.mesh(o.glow || '#ff8418', 1.0);
  const stance = { armU1: qe(-0.1, 0, 0.12), 'armU-1': qe(-0.1, 0, -0.12), armL1: qe(-0.25, 0, 0), 'armL-1': qe(-0.25, 0, 0) };
  const clips = [
    clip(R, 'Idle', 3.2, (t) => ({ q: { ...stance, chest: qe(0.06 + 0.03 * S(t), 0.06 * S(t * 0.5), 0), head: qe(0.05 * S(t), 0.25 * S(t * 0.5 + 0.2), 0), armU1: qe(-0.1 + 0.04 * S(t), 0, 0.12), 'armU-1': qe(-0.1 + 0.04 * S(t + 0.3), 0, -0.12) }, p: { root: V(0, -0.012 + 0.008 * S(t), 0) } })),
    clip(R, 'Walk', 1.1, (t) => { const q = {}; for (const s of [1, -1]) { const ph = s > 0 ? 0 : 0.5, sw = S(t + ph), up = Math.max(0, -C(t + ph)); q[`legU${s}`] = qe(-0.38 * sw - 0.15 * up, 0, 0); q[`legL${s}`] = qe(0.65 * up, 0, 0); q[`armU${s}`] = qe(-0.1 + 0.3 * S(t + ph + 0.5), 0, 0.12 * s); q[`armL${s}`] = qe(-0.3, 0, 0); } return { q: { ...q, root: qe(0, 0.08 * S(t), 0.06 * S(t)), chest: qe(0.12, -0.1 * S(t), -0.04 * S(t)) }, p: { root: V(0.03 * S(t), -0.035 * Math.abs(C(t)), 0) } }; }),
    clip(R, 'Attack', 0.9, (t) => { const w = bell(0, 0.38, 0.52, t), k = bell(0.45, 0.58, 0.95, t); return { q: { ...stance, chest: qe(0.1 + 0.2 * k, 0.45 * w - 0.6 * k, 0), 'armU-1': qe(0.5 * w - 1.6 * k, 0.4 * k, -0.6 * w + 0.2 * k), 'armL-1': qe(-1.0 * w - 0.2 * k, 0, 0), armU1: qe(-0.4 * w, 0, 0.3), head: qe(0.15 * k, -0.2 * k, 0) }, p: { root: V(0, 0, 0.12 * k) } }; }),   // (a hook from the right)
    clip(R, 'Attack2', 0.85, (t) => { const w = bell(0, 0.35, 0.5, t), k = bell(0.42, 0.56, 0.9, t); return { q: { ...stance, chest: qe(0.1, -0.5 * w + 0.6 * k, 0), armU1: qe(-0.5 - 0.6 * w - 0.4 * k, 0.7 * w - 1.2 * k, 0.4 + 0.6 * w), armL1: qe(-0.6 * w, 0, 0) }, p: { root: V(0, 0, 0.06 * k) } }; }),   // (the backhand, left)
    clip(R, 'Heavy', 1.4, (t) => { const r = bell(0, 0.4, 0.55, t), k = bell(0.5, 0.6, 1.0, t); return { q: { armU1: qe(-0.1 - 2.9 * r + 2.2 * k, 0, 0.12), 'armU-1': qe(-0.1 - 2.9 * r + 2.2 * k, 0, -0.12), armL1: qe(-0.25 - 0.3 * r + 0.15 * k, 0, 0), 'armL-1': qe(-0.25 - 0.3 * r + 0.15 * k, 0, 0), chest: qe(-0.25 * r + 0.65 * k, 0, 0), spine: qe(0.25 * k, 0, 0), head: qe(-0.2 * r + 0.1 * k, 0, 0), legU1: qe(-0.4 * k, 0, 0), 'legU-1': qe(-0.4 * k, 0, 0), legL1: qe(0.7 * k, 0, 0), 'legL-1': qe(0.7 * k, 0, 0) }, p: { root: V(0, 0.06 * r - 0.17 * k, 0.1 * k) } }; }),   // (both fists up and down on the ground)
    clip(R, 'Hit', 0.5, (t) => { const k = bell(0, 0.25, 1, t); return { q: { ...stance, chest: qe(-0.15 * k, 0.12 * k, 0), head: qe(-0.2 * k, 0.15 * k, 0) }, p: { root: V(0, 0, -0.05 * k) } }; }),
    clip(R, 'Death', 1.8, (t) => { const b = ease(0, 0.5, t), c = ease(0.3, 0.85, t), h = ease(0.15, 0.6, t); return { q: { legU1: qe(-0.9 * b, 0, 0.3 * b), 'legU-1': qe(-0.7 * b, 0, -0.2 * b), legL1: qe(1.3 * b, 0, 0), 'legL-1': qe(1.1 * b, 0, 0), chest: qe(0.7 * c, 0.2 * c, 0.25 * c), spine: qe(0.3 * c, 0, 0), head: qe(1.2 * h, 0.8 * h, 0.5 * h), armU1: qe(0.6 * c, 0, 0.5 * c), 'armU-1': qe(-0.3 * c, 0, -0.9 * c), armL1: qe(0.4 * c, 0, 0), 'armL-1': qe(0.3 * c, 0, 0) }, p: { root: V(0, -0.42 * b, 0.05 * c), head: V(0.12 * h, -0.55 * h, 0.35 * h), armU1: V(0.15 * c, -0.35 * c, 0.05 * c), 'armU-1': V(-0.2 * c, -0.3 * c, 0.1 * c) } }; }),   // (it falls apart: the knees go, the head rolls off, the arms come away)
    clip(R, 'Cast', 1.2, (t) => { const k = bell(0.05, 0.4, 0.9, t), p = Math.max(0, S(t * 3)) * k; return { q: { armU1: qe(-0.6 * k, 0, 0.12 + 1.0 * k), 'armU-1': qe(-0.6 * k, 0, -0.12 - 1.0 * k), armL1: qe(-0.6 * k, 0, 0), 'armL-1': qe(-0.6 * k, 0, 0), chest: qe(-0.3 * k, 0, 0), head: qe(-0.4 * k, 0, 0) }, p: { root: V(0, 0.04 * p, 0) } }; }),   // (a roar, arms wide, the core flaring)
  ];
  return { root: root3, clips };
}

// the bosses: the rat and the spider grown into kings and queens (their own colours, their own parts: king(), queen())
const ratking = (o = {}) => rat({ fur: '#3a342e', belly: '#5a5048', furTop: '#544c44', eyes: '#ff3818', seed: 17, ...o, king: true });
const spiderqueen = (o = {}) => spider({ body: '#1e1622', band: '#6a4864', mark: '#e2d8c2', eyes: '#78c038', seed: 37, ...o, queen: true });
const KINDS = { rat, spider, beetle, goblin, wraith, golem, ratking, spiderqueen };
export const CREATURE_KINDS = Object.keys(KINDS);

// ── the humanoids on KayKit's rig (the owner, 2026-11-10: "goblin and other humanoids NPCs should use the same rigging,
// movement and idle like player and NPC characters. Idle should fit with the type") ────────────────────────────────────
// A variant's `creature.rig: { model, clips: { ours: KayKit's }, hips }` stands the creature on the KayKit skeleton of
// that model (Rig_Medium, the cast's): its joints moved to the creature's own (its proportions kept: the goblin's short
// legs, the golem's long arms), the body built above bound to them as it stands, and its clips KayKit's own, by the name
// the cast plays (Idle, Walk, Attack…: bake.json unchanged). A clip is sampled at the creature's joints: every bone's
// keyed translation put back to its own place after each pose (figure.js applyFit), the hips' sway scaled to its height
// (× `hips`: a floating wraith barely bobs). The bones KayKit hasn't (a jaw, a wraith's claws, its shroud and tendrils)
// ride on their KayKit parent and keep the motion the kit keyed for them, the clip's of the same name, retimed to it.
const KK_LIMB = { armU: 'upperarm', armL: 'lowerarm', hand: 'hand', fist: 'hand', legU: 'upperleg', legL: 'lowerleg', foot: 'foot' };
const KK_TRUNK = { root: 'hips', spine: 'spine', chest: 'chest', neck: 'chest', head: 'head' };   // (no neck in KayKit's: ours rides the chest)
/** our bone's KayKit bone (as GLTFLoader names it: no dots), or null for one of our own */
const kkOf = (n) => { const m = /^(armU|armL|hand|fist|legU|legL|foot)(-?1)$/.exec(n); return m ? KK_LIMB[m[1]] + (m[2] === '1' ? 'l' : 'r') : KK_TRUNK[n] || null; };
async function onKayKit(made, rig, load) {
  const g = await load(`./models/${rig.model}.glb`), kk = g.scene;
  let src = null; kk.traverse((o) => { if (o.isSkinnedMesh && !src) src = o; });
  const kb = src.skeleton.bones, kn = new Map(kb.map((b) => [b.name.replace(/\./g, ''), b]));
  { const ms = []; kk.traverse((o) => { if (o.isMesh) ms.push(o); }); for (const m of ms) m.parent.remove(m); }   // (KayKit's meshes: never drawn)
  // KayKit's idle at its first frame is the bind: the creature stands in it as built
  const clipOf = (n) => { const c = g.animations.find((a) => a.name === n); if (!c) throw new Error(`${rig.model}: no clip ${n}`); return c; };
  const mx = new THREE.AnimationMixer(kk); mx.clipAction(clipOf(rig.clips.Idle)).play(); mx.setTime(0);   // (not stopped: a stopped action puts its bones back as they were)
  kk.updateMatrixWorld(true);
  const ours = []; made.root.traverse((o) => { if (o.isBone) ours.push(o); });
  const hips = kn.get('hips'), hipsRest = hips.position.clone();
  // the joints moved, parents first: each mapped bone to ours, the wrist to our hand (KayKit's hand on it)
  const want = new Map();
  for (const b of ours) { const k = kkOf(b.name); if (!k || b.name === 'neck') continue; want.set(k, b.userData.at); if (k.startsWith('hand')) want.set('wrist' + k.slice(-1), b.userData.at); }
  kk.traverse((o) => { if (!o.isBone) return; const n = o.name.replace(/\./g, ''), at = want.get(n); if (!at) return;
    o.parent.updateMatrixWorld(true); o.position.copy(o.parent.worldToLocal(at.clone())); o.updateMatrixWorld(true); o.userData.fit = o.position.toArray(); });
  hips.userData.fitHips = { rest: hipsRest.toArray(), k: (hips.position.length() / Math.max(1e-6, hipsRest.length())) * (rig.hips ?? 1) };
  // our own bones on their KayKit parent, turned so they stand as built (their keyed turns are in our bind's frame)
  const node = new Map(), q0 = new Map(), _q = new THREE.Quaternion();
  for (const b of ours) {   // (traverse order: a parent before its children)
    const k = kkOf(b.name); if (k) { node.set(b.name, kn.get(k)); continue; }
    const p = node.get(b.parent.name), e = new THREE.Bone(); e.name = b.name; p.add(e); p.updateMatrixWorld(true);
    e.position.copy(p.worldToLocal(b.userData.at.clone())); p.getWorldQuaternion(_q); e.quaternion.copy(_q.invert()); e.updateMatrixWorld(true);
    node.set(b.name, e); q0.set(b.name, e.quaternion.clone());
  }
  const root = new THREE.Group(); root.add(kk); root.updateMatrixWorld(true);
  const bones = [...kb, ...[...q0.keys()].map((n) => node.get(n))], skeleton = new THREE.Skeleton(bones);
  made.root.traverse((o) => { if (!o.isSkinnedMesh) return;
    const old = o.skeleton.bones, re = old.map((b) => bones.indexOf(node.get(b.name))), SI = o.geometry.attributes.skinIndex, si = new Uint16Array(SI.count * 4);
    for (let i = 0; i < SI.count; i++) for (let j = 0; j < 4; j++) si[i * 4 + j] = re[SI.getComponent(i, j)];
    const geo = o.geometry.clone(); geo.setAttribute('skinIndex', new THREE.BufferAttribute(si, 4));
    const m = new THREE.SkinnedMesh(geo, o.material); m.name = o.name; m.userData = { ...o.userData }; m.frustumCulled = false; root.add(m); m.updateMatrixWorld(true); m.bind(skeleton, m.matrixWorld);
  });
  // the clips: KayKit's, named as ours, with our own bones' turns from ours of the same name laid in
  const clips = Object.entries(rig.clips).map(([name, from]) => {
    const c = clipOf(from).clone(), mine = made.clips.find((a) => a.name === name); c.name = name;
    if (mine) for (const t of mine.tracks) {
      const [bn, prop] = t.name.split('.'); if (prop !== 'quaternion' || !q0.has(bn)) continue;
      const Q = q0.get(bn), v = t.values.slice(), q = new THREE.Quaternion();
      for (let i = 0; i < v.length; i += 4) { q.fromArray(v, i); q.premultiply(Q).toArray(v, i); }
      c.tracks.push(new THREE.QuaternionKeyframeTrack(t.name, Array.from(t.times, (x) => (x * c.duration) / mine.duration), v));
    }
    return c;
  });
  return { root, mixer: new THREE.AnimationMixer(root), clips, frame: null, creature: made.kind, rig: rig.model };
}
/** a creature as figure.js builds a figure: { root, mixer, clips, frame }; one with a `rig` stands on KayKit's skeleton
 *  (onKayKit), loaded by `load` (figure.js build's: the bake's paths) @param {{ kind: string, rig?: any, [k: string]: any }} spec
 *  @param {(url: string) => Promise<any>} [load] */
export async function buildCreature(spec, load) {
  const { root, clips } = KINDS[spec.kind](spec);
  if (spec.rig && load) return onKayKit({ root, clips, kind: spec.kind }, spec.rig, load);
  return { root, mixer: new THREE.AnimationMixer(root), clips, frame: null, creature: spec.kind };
}
/** a pose sampled from KayKit's clips put back on the creature's joints (onKayKit): every moved bone to its place, the
 *  hips' keyed sway scaled to its height @param {THREE.Object3D} root */
export function applyFit(root) {
  root.traverse((b) => { if (!b.isBone) return;
    const h = b.userData.fitHips, f = b.userData.fit;
    if (h) { const r = h.rest; b.position.set(f[0] + (b.position.x - r[0]) * h.k, f[1] + (b.position.y - r[1]) * h.k, f[2] + (b.position.z - r[2]) * h.k); }
    else if (f) b.position.set(f[0], f[1], f[2]); });
}
