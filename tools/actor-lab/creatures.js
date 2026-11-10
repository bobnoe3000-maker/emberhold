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

const rng = (seed) => { let s = (seed >>> 0) || 1; return () => { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 4294967296; }; };
const V = (x, y, z) => new THREE.Vector3(x, y, z);
const UP = V(0, 1, 0);

// ── a rig: bones placed at their bind positions (world, no rotation), parts rigid on them ──────────────────────────────
class Rig {
  constructor(seed) { this.bones = []; this.by = new Map(); this.parts = []; this.r = rng(seed); }
  bone(name, parent, p) {
    const b = new THREE.Bone(); b.name = name; b.userData.at = p.clone();
    b.position.copy(parent ? p.clone().sub(parent.userData.at) : p);
    if (parent) parent.add(b);
    this.bones.push(b); this.by.set(name, b); return b;
  }
  /** a geometry in bind (world) space on a bone; colour a THREE.Color or (p, n) => THREE.Color; glow: the eyes' mesh */
  part(geo, bone, colour, glow = false) { this.parts.push({ geo: geo.index ? geo.toNonIndexed() : geo, bone: typeof bone === 'function' ? bone : this.bones.indexOf(this.by.get(bone)), colour, glow }); }
  /** a weight function for a part bent across bones: (p) → [[bone, w], [bone, w]] by where the vertex is */
  skin(fn) { return (p) => fn(p).map(([b, w]) => [this.bones.indexOf(this.by.get(b)), w]); }
  mesh(glowColour, glowK = 1.6) {
    const make = (parts, mat) => {
      let n = 0; for (const q of parts) n += q.geo.attributes.position.count;
      const pos = new Float32Array(n * 3), col = new Float32Array(n * 3), si = new Uint16Array(n * 4), sw = new Float32Array(n * 4);
      let o = 0; const p = new THREE.Vector3(), nm = new THREE.Vector3(), c = new THREE.Color();
      for (const q of parts) {
        q.geo.computeVertexNormals();
        const P = q.geo.attributes.position, N = q.geo.attributes.normal;
        for (let i = 0; i < P.count; i += 3) {
          const k = 0.86 + this.r() * 0.26;                     // (each facet its own shade: a hide, not a plastic)
          for (let v = i; v < i + 3 && v < P.count; v++) {
            p.fromBufferAttribute(P, v); nm.fromBufferAttribute(N, v);
            if (typeof q.colour === 'function') c.copy(q.colour(p, nm)); else c.copy(q.colour);
            if (!q.glow) c.multiplyScalar(k);
            pos.set([p.x, p.y, p.z], o * 3); col.set([c.r, c.g, c.b], o * 3);
            if (typeof q.bone === 'function') { const w = q.bone(p), a = w[0], b = w[1] || [0, 0]; si.set([a[0], b[0], 0, 0], o * 4); sw.set([a[1], b[1], 0, 0], o * 4); }
            else { si.set([q.bone, 0, 0, 0], o * 4); sw.set([1, 0, 0, 0], o * 4); }
            o++;
          }
        }
      }
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.BufferAttribute(pos, 3)); g.setAttribute('color', new THREE.BufferAttribute(col, 3));
      g.setAttribute('skinIndex', new THREE.BufferAttribute(si, 4)); g.setAttribute('skinWeight', new THREE.BufferAttribute(sw, 4));
      g.computeVertexNormals();
      return new THREE.SkinnedMesh(g, mat);
    };
    const root = new THREE.Group(), skeleton = new THREE.Skeleton(this.bones);
    root.add(this.bones[0]); root.updateMatrixWorld(true);
    const body = make(this.parts.filter((q) => !q.glow), new THREE.MeshStandardMaterial({ vertexColors: true, flatShading: true, roughness: 0.95, metalness: 0 }));
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
function blob(c, r, seg = [8, 6], tilt = 0) {
  const g = new THREE.SphereGeometry(1, seg[0], seg[1]); g.scale(r[0], r[1], r[2]); if (tilt) g.rotateX(tilt); g.translate(c.x, c.y, c.z); return g;
}
function limb(a, b, r0, r1, radial = 5) {                       // a tapered segment from a to b
  const d = b.clone().sub(a), len = d.length(), g = new THREE.CylinderGeometry(r1, r0, len, radial, 1);
  g.translate(0, len / 2, 0); g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(UP, d.normalize())); g.translate(a.x, a.y, a.z); return g;
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
// a chunk of stone: an icosahedron, its corners pushed in and out by a hash of where they are (the same corner the same
// way on every face it's on, so the rock stays closed), faceted as the rest of the kit is
const hash3 = (x, y, z, s = 0) => { const h = Math.sin(x * 127.1 + y * 311.7 + z * 74.7 + s * 19.19) * 43758.5453; return h - Math.floor(h); };
function rock(c, r, seed = 0, detail = 0, rough = 0.22) {
  const g = new THREE.IcosahedronGeometry(1, detail), P = g.attributes.position, v = new THREE.Vector3();
  for (let i = 0; i < P.count; i++) { v.fromBufferAttribute(P, i); const k = 1 + (hash3(Math.round(v.x * 1e3), Math.round(v.y * 1e3), Math.round(v.z * 1e3), seed) - 0.5) * 2 * rough; P.setXYZ(i, v.x * k, v.y * k, v.z * k); }
  g.scale(r[0], r[1], r[2]); g.translate(c.x, c.y, c.z); return g;
}
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
  const R = new Rig(o.seed || 11), fur = new THREE.Color(o.fur || '#3c3b3a'), belly = new THREE.Color(o.belly || '#4c4a48'), skin = new THREE.Color(o.skin || '#8e7672');   // (grey, cool: the reference's)
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
  R.part(hull(prof, 16, cy, 0.92), bodyW, furC);
  // the coat: a few big ragged clumps where the reference's shag is heaviest, the hull smooth between them (the kit's
  // chunky style: critic round R2, a coat of shingles read as a pine cone): a crest bristling along the spine, a ruff over
  // the shoulders and neck, clumps on the haunches and flanks, each a broad blade of fur lighter at its tip
  const clump = (z, a, len, w, lift = 0.35, back = 0.9) => {
    const r = rOf(z) * 0.9, at = V(Math.sin(a) * r, cy(z) + Math.cos(a) * r * 0.92, z), out = V(Math.sin(a), Math.cos(a) * 0.92, 0).normalize();
    const dir = out.clone().multiplyScalar(lift).add(V(0, -0.1, -back)).normalize(), tip = at.clone().add(dir.clone().multiplyScalar(len));
    R.part(limb(at.clone().add(out.clone().multiplyScalar(-0.01)), tip, w, 0.003, 4), bodyW, (p, n) => (p.distanceTo(at) > len * 0.55 ? furTop : mixC(fur, furTop, 0.15)));
  };
  for (let i = 0; i < 9; i++) { const z = -0.24 + i * 0.05, h = hash3(i, 7, 1, 5); clump(z, (i % 2 ? 0.12 : -0.12) + (h - 0.5) * 0.15, (0.055 + 0.03 * h) * (z > 0.05 ? 0.6 : 1), 0.03, z > 0.05 ? 0.2 : 0.4); }   // the crest (low at the front: the head shows over it)
  for (const s of [1, -1]) {
    for (let i = 0; i < 4; i++) { const h = hash3(i, s, 2, 6); clump(0.1 + i * 0.03, s * (0.8 + 0.3 * i), 0.055 + 0.02 * h, 0.03, 0.25, 0.85); }   // the ruff, at the shoulders' sides (low: the head over it)
    for (let i = 0; i < 4; i++) { const h = hash3(i, s, 4, 7); clump(-0.22 + i * 0.09, s * (0.95 + 0.25 * (i % 2)), 0.06 + 0.03 * h, 0.03, 0.3, 0.9); }   // the flanks
    clump(-0.18, s * 0.6, 0.075, 0.034, 0.4, 0.95);                                         // the haunch
  }
  for (const a of [-0.5, 0, 0.5]) clump(-0.29, a, 0.06, 0.034, 0.6, 0.85);                  // (over the rump: round R5, its bare end read dark and flat)
  // the head: big, the brow heavy, the eyes small coals under it, the snout blunt, the mouth open on its teeth
  R.part(blob(V(0, 0.262, 0.31), [0.1, 0.09, 0.1], [12, 9]), 'head', furC);
  for (const s of [1, -1]) for (const [y, z] of [[0.245, 0.31], [0.28, 0.29], [0.215, 0.33]]) R.part(limb(V(0.075 * s, y, z), V(0.125 * s, y - 0.015, z - 0.055), 0.024, 0.002, 3), 'head', furTop);   // cheek tufts
  R.part(blob(V(0, 0.302, 0.36), [0.078, 0.022, 0.04], [8, 4]), 'head', fur);              // the brow
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
    clip(R, 'Idle', 2.0, (t) => ({ q: { ...tailSway(t, 0.15), head: qe(-0.08 + 0.08 * S(t * 4) * bell(0.2, 0.35, 0.5, t), 0.15 * S(t), 0), jaw: qe(0.25 + 0.2 * Math.max(0, S(t * 6)) * bell(0.2, 0.35, 0.5, t), 0, 0), chest: qe(0.02 * S(t), 0, 0) }, p: { root: V(0, 0.004 * S(t * 2), 0) } })),   // (a snarl, the jaw hanging open)
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
  const rust = new THREE.Color('#8a5a24'), brass = new THREE.Color('#9a7a34'), cloak = new THREE.Color('#361830'), cloakHi = new THREE.Color('#4e2646');   /* (darker: in the game's light it glowed magenta) */
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
  R.part(blob(V(0, 0.29, 0.02), [0.172, 0.1, 0.22], [12, 8]), 'root', capeC);   // (wider than the back: it hangs down the flanks)
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
  const sac = (p, n) => { const zc = (p.z + 0.4) / 0.3, ring = Math.sin((p.z + 0.4) * 30) > 0.72; return n.y > 0.5 && Math.abs(zc) < 0.95 && Math.abs(p.x) < 0.025 + 0.085 * Math.abs(zc) ? mark : ring ? band : dark; };   // (an hourglass, in bone)
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
    clip(R, 'Idle', 2.4, (t) => ({ q: { ...walk(0, 0), ...palps(t), ...fangs(0.2 * Math.max(0, S(t * 2))), abdomen: qe(0.04 * S(t), 0, 0), ...Object.assign({}, ...legs.filter((L) => L.i === 1).map((L) => legQ(L, 0.06 * S(t + L.s * 0.25), 0.05 * Math.max(0, S(t * 2)))) ) }, p: { root: V(0, 0.006 * S(t), 0) } })),
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
  const shell = new THREE.Color(o.shell || '#84200f'), shellHi = new THREE.Color(o.shellHi || '#c4462a'), shellLo = new THREE.Color('#3a0b07'), tipC = new THREE.Color('#160a08');
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
    clip(R, 'Idle', 2.2, (t) => ({ q: { ...walk(0, 0), ...feel(t), ...mand(0.25 * Math.max(0, S(t * 3)) * bell(0.4, 0.55, 0.75, t)), head: qe(0.05 * S(t), 0.1 * S(t), 0), ...cases(0.03 * Math.max(0, S(t * 2))) }, p: { root: V(0, 0.004 * S(t * 2), 0) } })),
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
// A goblin built for the part (the KayKit goblins are men in green): two-thirds of a man and hunched, a head a quarter
// of its height with ears out past its shoulders and a long hooked nose, a wide mouth of teeth, eyes like lamp-flames,
// arms to its knees, big flat feet; a leather pauldron and rags; a rusted cleaver in its right fist.
function goblin(o = {}) {
  const R = new Rig(o.seed || 41);
  const skin = new THREE.Color(o.skin || '#4f5b36'), skinHi = new THREE.Color(o.skinHi || '#6f7b4c'), skinLo = new THREE.Color('#2f3722');   // (olive gone grey: the dusk's, not a lime)
  const skinC = (p, n) => (n.y > 0.65 ? skinHi : n.y < -0.45 ? skinLo : skin);
  const leather = new THREE.Color(o.leather || '#4c3222'), leatherHi = new THREE.Color('#70503a'), rag = new THREE.Color(o.rag || '#5a4634'), inner = new THREE.Color('#8e5a4c');
  const tooth = new THREE.Color('#d8cc98'), mouth = new THREE.Color('#1a0c0a'), iron = new THREE.Color('#5a524a'), rust = new THREE.Color('#7a4426'), edge = new THREE.Color('#b8ad98'), brass = new THREE.Color('#a08038');
  R.bone('root', null, V(0, 0.3, 0)); R.bone('spine', R.by.get('root'), V(0, 0.38, 0.02)); R.bone('chest', R.by.get('spine'), V(0, 0.46, 0.06));
  R.bone('neck', R.by.get('chest'), V(0, 0.52, 0.1)); R.bone('head', R.by.get('neck'), V(0, 0.58, 0.13)); R.bone('jaw', R.by.get('head'), V(0, 0.56, 0.17));
  for (const s of [1, -1]) {
    const u = R.bone(`armU${s}`, R.by.get('chest'), V(0.1 * s, 0.49, 0.06)), l = R.bone(`armL${s}`, u, V(0.15 * s, 0.37, 0.08)); R.bone(`hand${s}`, l, V(0.15 * s, 0.26, 0.12));
    const h = R.bone(`legU${s}`, R.by.get('root'), V(0.06 * s, 0.29, 0)), k = R.bone(`legL${s}`, h, V(0.075 * s, 0.17, 0.05)); R.bone(`foot${s}`, k, V(0.07 * s, 0.045, -0.01));
  }
  // the body: a pot belly on scrawny hips, a narrow chest, hunched shoulders
  R.part(blob(V(0, 0.3, 0.0), [0.08, 0.06, 0.065]), 'root', leather);
  R.part(blob(V(0, 0.22, 0.068), [0.05, 0.075, 0.012], [6, 4]), 'root', rag); R.part(blob(V(0, 0.23, -0.06), [0.055, 0.07, 0.012], [6, 4]), 'root', rag);
  R.part(new THREE.TorusGeometry(0.078, 0.012, 4, 12).rotateX(Math.PI / 2).translate(0, 0.33, 0.012), 'spine', leatherHi);
  R.part(blob(V(0.075, 0.31, 0.04), [0.025, 0.03, 0.02], [6, 4]), 'spine', leather);              // the pouch
  R.part(blob(V(0, 0.375, 0.045), [0.082, 0.078, 0.078], [10, 8]), 'spine', skinC);              // the belly
  R.part(blob(V(0, 0.46, 0.045), [0.095, 0.062, 0.068], [10, 8]), 'chest', skinC);
  R.part(limb(V(-0.08, 0.5, 0.09), V(0.07, 0.36, 0.1), 0.012, 0.012, 4), 'chest', leather);      // a strap
  R.part(blob(V(0.11, 0.505, 0.05), [0.058, 0.036, 0.058], [8, 6]), 'chest', (p, n) => (n.y > 0.5 ? leatherHi : leather));   // the pauldron
  for (let i = 0; i < 3; i++) R.part(limb(V(0.09 + i * 0.022, 0.535, 0.05), V(0.09 + i * 0.026, 0.565, 0.045), 0.006, 0.001, 3), 'chest', iron);
  R.part(limb(V(0, 0.5, 0.09), V(0, 0.56, 0.13), 0.025, 0.022), 'neck', skin);
  // the head: a big skull, a heavy brow, the long nose, the wide mouth, the ears out past the shoulders
  R.part(blob(V(0, 0.6, 0.125), [0.088, 0.08, 0.088], [12, 9]), 'head', skinC);
  R.part(blob(V(0, 0.62, 0.095), [0.08, 0.07, 0.08], [10, 7]), 'head', skinC);
  R.part(blob(V(0, 0.627, 0.19), [0.072, 0.017, 0.03], [8, 4]), 'head', skinLo);
  R.part(limb(V(0, 0.605, 0.205), V(0, 0.567, 0.29), 0.022, 0.008, 6), 'head', skinC);
  R.part(limb(V(0, 0.567, 0.29), V(0, 0.55, 0.292), 0.008, 0.004, 4), 'head', skin);
  R.part(new THREE.BoxGeometry(0.09, 0.013, 0.02).translate(0, 0.556, 0.198), 'head', mouth);
  for (const x of [-0.035, -0.015, 0.012, 0.034]) R.part(limb(V(x, 0.551, 0.206), V(x, 0.566, 0.209), 0.005, 0.001, 3), 'jaw', tooth);
  R.part(blob(V(0, 0.54, 0.17), [0.058, 0.024, 0.048], [8, 5]), 'jaw', skinC);
  for (const s of [1, -1]) {
    R.part(limb(V(0.075 * s, 0.61, 0.11), V(0.26 * s, 0.665, 0.03), 0.042, 0.003, 4), 'head', skinC);
    R.part(limb(V(0.09 * s, 0.612, 0.118), V(0.22 * s, 0.655, 0.05), 0.018, 0.002, 3), 'head', inner);
    R.part(blob(V(0.036 * s, 0.606, 0.198), [0.015, 0.011, 0.008], [6, 4]), 'head', new THREE.Color('#ffe080'), true);   // the eyes
    // the arms, long and thin; the big hands
    R.part(limb(V(0.1 * s, 0.49, 0.06), V(0.15 * s, 0.37, 0.08), 0.026, 0.02), `armU${s}`, skinC);
    R.part(limb(V(0.15 * s, 0.37, 0.08), V(0.15 * s, 0.26, 0.12), 0.021, 0.017), `armL${s}`, skinC);
    R.part(limb(V(0.15 * s, 0.3, 0.1), V(0.15 * s, 0.27, 0.115), 0.024, 0.024, 5), `armL${s}`, leather);   // a wrist-wrap
    R.part(blob(V(0.15 * s, 0.235, 0.13), [0.034, 0.03, 0.04], [8, 6]), `hand${s}`, skinC);
    for (const f of [-1, 0, 1]) R.part(limb(V((0.15 + f * 0.018) * s, 0.215, 0.15), V((0.15 + f * 0.022) * s, 0.195, 0.175), 0.008, 0.002, 3), `hand${s}`, tooth);
    // the legs, bent; the big flat feet
    R.part(limb(V(0.06 * s, 0.29, 0), V(0.075 * s, 0.17, 0.05), 0.03, 0.022), `legU${s}`, skinC);
    R.part(limb(V(0.075 * s, 0.17, 0.05), V(0.07 * s, 0.045, -0.01), 0.022, 0.016), `legL${s}`, skinC);
    R.part(limb(V(0.073 * s, 0.13, 0.035), V(0.072 * s, 0.09, 0.02), 0.026, 0.024, 5), `legL${s}`, rag);
    R.part(blob(V(0.07 * s, 0.022, 0.04), [0.034, 0.02, 0.075], [8, 5]), `foot${s}`, skinC);
    for (const f of [-1, 0, 1]) R.part(limb(V((0.07 + f * 0.018) * s, 0.015, 0.1), V((0.07 + f * 0.02) * s, 0.008, 0.125), 0.008, 0.002, 3), `foot${s}`, tooth);
  }
  R.part(new THREE.TorusGeometry(0.012, 0.003, 3, 8).rotateY(Math.PI / 2).translate(0.2, 0.635, 0.05), 'head', brass);   // a ring in one ear
  // the cleaver, in the right fist (−x), its blade forward: a rusted slab, notched, its edge bright
  R.part(limb(V(-0.15, 0.235, 0.1), V(-0.15, 0.235, 0.24), 0.012, 0.011, 5), 'hand-1', leather);
  // (a blade: thin, longer than the arm's reach, widening to a squared tip, the edge along its bottom bright)
  const slab = new THREE.ExtrudeGeometry(new THREE.Shape([new THREE.Vector2(0.24, 0.29), new THREE.Vector2(0.24, 0.232), new THREE.Vector2(0.46, 0.212), new THREE.Vector2(0.47, 0.3), new THREE.Vector2(0.4, 0.31)]), { depth: 0.012, bevelEnabled: false });
  slab.rotateY(-Math.PI / 2).translate(-0.144, 0, 0);
  R.part(slab, 'hand-1', (p) => (p.y < 0.232 ? edge : p.y > 0.295 ? iron : rust));
  R.part(new THREE.BoxGeometry(0.016, 0.016, 0.016).translate(-0.15, 0.285, 0.43), 'hand-1', mouth);   // (a hole near the tip, for a nail)
  // a scraggle of black hair over the crown
  for (const [x, z, a] of [[-0.02, 0.07, -0.3], [0.015, 0.06, 0.2], [0.0, 0.1, 0.0], [0.035, 0.08, 0.5]]) R.part(limb(V(x, 0.675, z), V(x + a * 0.05, 0.725, z - 0.05), 0.012, 0.002, 3), 'head', new THREE.Color('#1c1814'));
  const root3 = R.mesh(o.eyes || '#ffd040');
  // poses: a crouch (always), a stride
  const crouch = (k = 1) => ({ legU1: qe(-0.35 * k, 0, 0.05), 'legU-1': qe(-0.35 * k, 0, -0.05), legL1: qe(0.6 * k, 0, 0), 'legL-1': qe(0.6 * k, 0, 0) });
  const ready = { armU1: qe(-0.35, 0, 0.15), armL1: qe(-0.5, 0, 0), 'armU-1': qe(-0.5, 0, -0.1), 'armL-1': qe(-0.8, 0, 0) };   // (the cleaver up)
  const run = (t, A = 1) => {
    const q = {};
    for (const s of [1, -1]) { const ph = s > 0 ? 0 : 0.5, sw = S(t + ph), up = Math.max(0, -C(t + ph)); q[`legU${s}`] = qe(-0.35 - 0.6 * A * sw, 0, 0.05 * s); q[`legL${s}`] = qe(0.55 + 1.0 * A * up, 0, 0); q[`foot${s}`] = qe(-0.3 * A * up, 0, 0); }
    q.armU1 = qe(-0.3 + 0.55 * A * S(t), 0, 0.15); q.armL1 = qe(-0.7, 0, 0); q['armU-1'] = qe(-0.55 - 0.35 * A * S(t), 0, -0.1); q['armL-1'] = qe(-0.9, 0, 0);
    return q;
  };
  const clips = [
    clip(R, 'Idle', 1.8, (t) => { const look = Math.max(-1, Math.min(1, 2.2 * S(t))); return { q: { ...crouch(), ...ready, spine: qe(0.25 + 0.03 * S(t * 2), 0, 0), chest: qe(0.05 * S(t * 2), 0, 0), head: qe(-0.2, 0.45 * look, 0.06 * look), jaw: qe(0.15 * Math.max(0, S(t * 3)), 0, 0), 'armU-1': qe(-0.5 - 0.08 * S(t * 2), 0, -0.1) }, p: { root: V(0, -0.035 + 0.006 * S(t * 2), 0) } }; }),
    clip(R, 'Walk', 0.5, (t) => ({ q: { ...run(t), spine: qe(0.4, 0.12 * S(t), 0), head: qe(-0.35 + 0.08 * S(t * 2), -0.12 * S(t), 0), root: qe(0, -0.15 * S(t), 0) }, p: { root: V(0, -0.04 + 0.025 * Math.abs(S(t)), 0) } })),
    clip(R, 'Attack', 0.6, (t) => { const w = bell(0, 0.3, 0.42, t), k = bell(0.36, 0.48, 0.85, t); return { q: { ...crouch(1 + 0.3 * k), ...ready, spine: qe(0.2 - 0.25 * w + 0.45 * k, 0.35 * w - 0.25 * k, 0), 'armU-1': qe(-0.5 - 2.3 * w + 1.5 * k, 0, -0.25 * w), 'armL-1': qe(-0.8 - 0.6 * w + 0.6 * k, 0, 0), head: qe(-0.2 + 0.25 * k, 0, 0), jaw: qe(0.4 * w, 0, 0) }, p: { root: V(0, -0.035 - 0.02 * k, 0.06 * k) } }; }),
    clip(R, 'Attack2', 0.5, (t) => { const w = bell(0, 0.25, 0.38, t), k = bell(0.32, 0.42, 0.8, t); return { q: { ...crouch(1 + 0.4 * k), ...ready, spine: qe(0.25 + 0.3 * k, -0.3 * w + 0.3 * k, 0), 'armU-1': qe(-0.3 + 0.4 * w - 1.2 * k, 0.3 * k, -0.1), 'armL-1': qe(-1.4 * w - 0.1 * k, 0, 0) }, p: { root: V(0, -0.04, -0.03 * w + 0.12 * k) } }; }),
    clip(R, 'Heavy', 0.9, (t) => { const c = bell(0, 0.22, 0.32, t), a = bell(0.25, 0.45, 0.62, t), k = bell(0.55, 0.65, 0.95, t); return { q: { ...crouch(1 + 0.8 * c - 0.6 * a + 0.5 * k), spine: qe(0.3 * c - 0.3 * a + 0.6 * k, 0, 0), armU1: qe(-0.3 - 2.6 * a + 1.8 * k, 0, 0.2), 'armU-1': qe(-0.5 - 2.6 * a + 2.0 * k, 0, -0.2), armL1: qe(-0.5 - 0.3 * a, 0, 0), 'armL-1': qe(-0.8 - 0.3 * a, 0, 0), jaw: qe(0.5 * a, 0, 0), head: qe(-0.3 * a + 0.2 * k, 0, 0) }, p: { root: V(0, -0.035 - 0.05 * c + 0.16 * a - 0.03 * k, 0.3 * ease(0.25, 0.65, t)) } }; }),
    clip(R, 'Hit', 0.4, (t) => { const k = bell(0, 0.2, 1, t); return { q: { ...crouch(), ...ready, spine: qe(0.2 - 0.35 * k, 0.15 * k, 0), head: qe(-0.2 - 0.4 * k, -0.3 * k, 0), jaw: qe(0.3 * k, 0, 0) }, p: { root: V(0, -0.035, -0.05 * k) } }; }),
    clip(R, 'Death', 1.1, (t) => { const k = ease(0, 0.65, t); return { q: { ...crouch(1 - 0.5 * k), root: qe(-1.45 * k, 0, 0.1 * k), spine: qe(0.2 - 0.3 * k, 0, 0), head: qe(-0.3 - 0.5 * k, 0.4 * k, 0), jaw: qe(0.5 * k, 0, 0), armU1: qe(-0.3 - 1.2 * k, 0, 0.7 * k), 'armU-1': qe(-0.5 - 1.4 * k, 0, -0.6 * k), armL1: qe(-0.3, 0, 0), 'armL-1': qe(-0.4, 0, 0) }, p: { root: V(0, -0.035 - 0.18 * k, -0.12 * k) } }; }),   // (on its back, arms flung out)
    clip(R, 'Cast', 0.9, (t) => { const k = bell(0.05, 0.3, 0.85, t), h = Math.max(0, S(t * 4)); return { q: { ...crouch(1 - 0.3 * k), ...ready, spine: qe(0.2 - 0.3 * k, 0, 0), head: qe(-0.2 - 0.5 * k, 0.1 * S(t * 2), 0), jaw: qe(0.6 * k * (0.5 + 0.5 * h), 0, 0), 'armU-1': qe(-0.5 - 2.4 * k, 0, -0.3 * k), 'armL-1': qe(-0.8 + 0.5 * k, 0, 0), armU1: qe(-0.3 - 0.6 * k, 0, 0.6 * k) }, p: { root: V(0, -0.035 + 0.04 * k * h, 0) } }; }),   // (a jeer: the cleaver up, the head back, cackling)
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
  for (const s of [1, -1]) {   // (flung wide and a little up, as the reference's: the bind pose is the pose)
    const u = R.bone(`armU${s}`, R.by.get('chest'), V(0.18 * s, 1.27, 0.04)), l = R.bone(`armL${s}`, u, V(0.42 * s, 1.35, 0.1)); R.bone(`hand${s}`, l, V(0.62 * s, 1.47, 0.15));
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
    for (let k = 0; k < 4; k++) R.part(limb(P[k], P[k + 1], rad[k], rad[k + 1], 5), names[Math.min(2, k)], robeC);
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
  // the arms: the sleeve's drape hanging under each, gaunt forearms, hands with long splayed clawed fingers
  for (const s of [1, -1]) {
    R.part(limb(V(0.17 * s, 1.27, 0.04), V(0.43 * s, 1.35, 0.1), 0.07, 0.11, 7), `armU${s}`, robeC);   // (a bell sleeve: round W3, a pipe)
    // the sleeve: a wide drape hanging under the arm to the elbow and past it, its edge in rags (round W1: a scarecrow's sleeve)
    for (let k = 0; k < 6; k++) { const x = (0.2 + k * 0.05) * s, y = 1.27 + k * 0.016, len = 0.3 + 0.12 * hash3(k, s, 4, 2) - k * 0.015; R.part(limb(V(x, y, 0.06 + k * 0.01), V(x * 1.04, y - len, 0.03 + k * 0.012), 0.055, 0.004, 3), `armU${s}`, robeC); }
    for (let k = 0; k < 3; k++) { const x = (0.45 + k * 0.05) * s, y = 1.36 + k * 0.025; R.part(limb(V(x, y, 0.1 + k * 0.01), V(x * 1.02, y - 0.16 - 0.05 * k, 0.09 + k * 0.012), 0.04, 0.003, 3), `armL${s}`, robeC); }
    R.part(limb(V(0.42 * s, 1.35, 0.1), V(0.62 * s, 1.47, 0.15), 0.032, 0.024, 6), `armL${s}`, flesh);
    R.part(blob(V(0.66 * s, 1.49, 0.16), [0.048, 0.032, 0.05], [6, 5]), `hand${s}`, flesh);
    for (let f = 0; f < 5; f++) {
      const a = (f - 2) * 0.32, d = V(Math.cos(a) * s, Math.sin(a) * 0.9 + 0.25, 0.25 + 0.15 * (f === 0 ? -1 : 0)).normalize();
      const b = V(0.67 * s, 1.49, 0.16).add(d.clone().multiplyScalar(0.04)), m = b.clone().add(d.clone().multiplyScalar(0.085)), e = m.clone().add(d.clone().multiplyScalar(0.075)).add(V(0, -0.03, 0.015));
      R.part(limb(b, m, 0.013, 0.01, 4), `hand${s}`, flesh); R.part(limb(m, e, 0.01, 0.001, 3), `hand${s}`, claw);
    }
  }
  const root3 = R.mesh(o.glow || '#5ff0a0', 1.3);
  const writhe = (t, a = 1, trail = 0) => ({
    ...Object.fromEntries([0, 1, 2].map((i) => [`shroud${i}`, qe(trail * (0.12 + 0.08 * i) + 0.05 * a * S(t - i * 0.2), 0.15 * a * S(t * 0.5 - i * 0.25), 0.05 * a * C(t - i * 0.2))])),
    ...Object.fromEntries(tend.flatMap((n, i) => n.map((b, k) => [b, qe(trail * 0.3 + 0.16 * a * S(t + i / T + k * 0.15), 0.1 * a * C(t * 0.5 + i / T), 0.14 * a * S(t * 1.3 + i / T - k * 0.2))]))) });
  const armQ = (s, fwd, down, twist = 0) => qe(twist, -s * fwd, -s * down);   // (forward toward the face, down toward the floor)
  const clips = [
    clip(R, 'Idle', 3.0, (t) => ({ q: { ...writhe(t), armU1: armQ(1, 0.15 + 0.08 * S(t), 0.1 * S(t + 0.2)), 'armU-1': armQ(-1, 0.15 + 0.08 * S(t + 0.4), 0.1 * S(t + 0.6)), armL1: armQ(1, 0.15, 0.05 * S(t)), 'armL-1': armQ(-1, 0.15, 0.05 * S(t + 0.3)), head: qe(0.08 * S(t + 0.2), 0.15 * S(t * 0.5), 0.05 * S(t)), jaw: qe(0.3 + 0.12 * Math.max(0, S(t * 2)), 0, 0), spine: qe(0.06 + 0.03 * S(t), 0, 0) }, p: { root: V(0, 0.04 * S(t), 0) } })),
    clip(R, 'Walk', 1.2, (t) => ({ q: { ...writhe(t * 2, 1.3, 0.45), root: qe(0.2, 0, 0.05 * S(t)), armU1: armQ(1, -0.25, 0.35 + 0.08 * S(t)), 'armU-1': armQ(-1, -0.25, 0.35 + 0.08 * S(t + 0.5)), armL1: armQ(1, 0.2, 0.1), 'armL-1': armQ(-1, 0.2, 0.1), jaw: qe(0.3, 0, 0) }, p: { root: V(0, 0.03 * S(t * 2), 0) } })),
    clip(R, 'Attack', 0.7, (t) => { const w = bell(0, 0.3, 0.45, t), k = bell(0.38, 0.52, 0.9, t); return { q: { ...writhe(t, 1.5, 0.2 * k), chest: qe(0.15 * k, 0.4 * w - 0.5 * k, 0), 'armU-1': armQ(-1, -0.6 * w + 1.4 * k, -0.3 * w + 0.3 * k), 'armL-1': armQ(-1, 0.6 * k, 0.2 * k), armU1: armQ(1, 0.2, 0), jaw: qe(0.3 + 0.4 * k, 0, 0), head: qe(0.15 * k, -0.25 * k, 0) }, p: { root: V(0, 0.04 * w, 0.12 * k) } }; }),
    clip(R, 'Attack2', 0.75, (t) => { const w = bell(0, 0.35, 0.5, t), k = bell(0.42, 0.56, 0.92, t); return { q: { ...writhe(t, 1.5, 0.3 * k), armU1: armQ(1, -0.4 * w + 1.3 * k, -0.4 * w + 0.4 * k), 'armU-1': armQ(-1, -0.4 * w + 1.3 * k, -0.4 * w + 0.4 * k), armL1: armQ(1, 0.5 * k, 0), 'armL-1': armQ(-1, 0.5 * k, 0), spine: qe(-0.2 * w + 0.4 * k, 0, 0), jaw: qe(0.3 + 0.5 * w, 0, 0) }, p: { root: V(0, 0.08 * w - 0.04 * k, 0.1 * k) } }; }),
    clip(R, 'Heavy', 1.1, (t) => { const r = bell(0, 0.35, 0.55, t), d = bell(0.5, 0.62, 0.95, t); return { q: { ...writhe(t * 1.5, 2, 0.6 * d), armU1: armQ(1, -0.5 * r + 1.2 * d, -0.6 * r + 0.3 * d), 'armU-1': armQ(-1, -0.5 * r + 1.2 * d, -0.6 * r + 0.3 * d), spine: qe(-0.35 * r + 0.5 * d, 0, 0), head: qe(-0.5 * r + 0.3 * d, 0, 0), jaw: qe(0.3 + 0.6 * r, 0, 0) }, p: { root: V(0, 0.18 * r - 0.08 * d, 0.38 * ease(0.5, 0.8, t)) } }; }),   // (it rises, spreads wider and shrieks, then dives)
    clip(R, 'Hit', 0.45, (t) => { const k = bell(0, 0.2, 1, t); return { q: { ...writhe(t * 2, 1 + 2 * k, -0.3 * k), armU1: armQ(1, -0.3 * k, 0.2 * k), 'armU-1': armQ(-1, -0.3 * k, 0.2 * k), spine: qe(-0.3 * k, 0.2 * k, 0), head: qe(-0.35 * k, -0.2 * k, 0), jaw: qe(0.3 + 0.3 * k, 0, 0) }, p: { root: V(0, 0.03 * k, -0.08 * k) } }; }),
    clip(R, 'Death', 1.6, (t) => { const r = bell(0, 0.18, 0.4, t), k = ease(0.2, 0.9, t), f = 1 - 0.72 * k; return { q: { ...writhe(t * 2, 2 * r + 0.3, -0.5 * k), spine: qe(0.15 * k - 0.3 * r, 0, 0), head: qe(-0.5 * r + 0.5 * k, 0, 0), jaw: qe(0.3 + 0.6 * r, 0, 0), armU1: armQ(1, 0.2 * k, -0.4 * r + 0.9 * k), 'armU-1': armQ(-1, 0.2 * k, -0.4 * r + 0.9 * k) }, p: { root: V(0, 0.1 * r - 0.74 * k, 0) }, s: { root: V(1 + 0.3 * k, f, 1 + 0.3 * k) } }; }),   // (a last shriek, then the shroud empties and settles, a heap of rags)
    clip(R, 'Cast', 1.0, (t) => { const k = bell(0.05, 0.4, 0.9, t); return { q: { ...writhe(t * 1.5, 1.5, -0.2 * k), armU1: armQ(1, 0.3 * k, -0.7 * k), 'armU-1': armQ(-1, 0.3 * k, -0.7 * k), spine: qe(-0.25 * k, 0, 0), head: qe(-0.45 * k, 0, 0), jaw: qe(0.3 + 0.5 * k, 0, 0) }, p: { root: V(0, 0.1 * k, 0) } }; }),   // (arms raised, head back, jaw wide: the drain)
  ];
  return { root: root3, clips };
}

// ── the stone golem (the heavy biped) ──────────────────────────────────────────────────────────────────────────────────
// Twice a man: boulders fitted into a body, the back humped, the head a small block sunk under a brow, fists that hang to
// its knees. Moss on everything that faces up. An ember core in its chest with the light coming out through the cracks,
// two slits of it for eyes, and runes cut in its forearms. It falls apart when it dies.
function golem(o = {}) {
  const R = new Rig(o.seed || 67), sd = o.seed || 67;
  const stone = new THREE.Color(o.stone || '#4c4842'), stoneHi = new THREE.Color(o.stoneHi || '#67625a'), stoneLo = new THREE.Color('#2a2724'), moss = new THREE.Color(o.moss || '#4a5c32'), mossHi = new THREE.Color('#66783f');   // (darker: the game's figure light lifts it, critic round 1 in the game)
  const stoneC = (p, n) => (n.y > 0.7 ? (hash3(Math.round(p.x * 40), Math.round(p.y * 40), Math.round(p.z * 40), sd) > 0.4 ? (n.y > 0.9 ? mossHi : moss) : stoneHi) : n.y > 0.3 ? mixC(stone, stoneHi, (n.y - 0.3) * 2) : n.y < -0.35 ? stoneLo : stone);
  const core = new THREE.Color('#ffb24a');
  R.bone('root', null, V(0, 0.62, 0)); R.bone('spine', R.by.get('root'), V(0, 0.86, 0)); R.bone('chest', R.by.get('spine'), V(0, 1.25, 0.02)); R.bone('head', R.by.get('chest'), V(0, 1.5, 0.3));
  for (const s of [1, -1]) {
    const u = R.bone(`armU${s}`, R.by.get('chest'), V(0.5 * s, 1.5, 0)), l = R.bone(`armL${s}`, u, V(0.63 * s, 1.1, 0.08)); R.bone(`fist${s}`, l, V(0.6 * s, 0.66, 0.2));
    const h = R.bone(`legU${s}`, R.by.get('root'), V(0.2 * s, 0.6, 0)), k = R.bone(`legL${s}`, h, V(0.24 * s, 0.33, 0.04)); R.bone(`foot${s}`, k, V(0.24 * s, 0.1, 0.02));
  }
  let n = 0; const RK = (c, r, bone, det = 0, rough = 0.22) => R.part(rock(c, r, sd + ++n, det, rough), bone, stoneC);
  RK(V(0, 0.66, 0), [0.3, 0.17, 0.22], 'root'); RK(V(0, 0.92, 0.04), [0.3, 0.21, 0.25], 'spine');
  RK(V(0, 1.25, 0.0), [0.46, 0.32, 0.32], 'chest', 1, 0.14); RK(V(0, 1.47, -0.14), [0.33, 0.21, 0.23], 'chest');
  for (const s of [1, -1]) RK(V(0.2 * s, 1.3, 0.2), [0.2, 0.15, 0.13], 'chest');
  // (the head low and forward between the shoulders, under a heavy brow: a block, not another boulder on top)
  RK(V(0, 1.52, 0.33), [0.14, 0.12, 0.13], 'head'); R.part(rock(V(0, 1.6, 0.42), [0.16, 0.045, 0.07], sd + 90, 0, 0.15), 'head', stoneLo); RK(V(0, 1.43, 0.4), [0.1, 0.05, 0.07], 'head');
  for (const s of [1, -1]) R.part(new THREE.BoxGeometry(0.055, 0.02, 0.02).translate(0.06 * s, 1.545, 0.46), 'head', core, true);   // the eyes
  // the core: an ember set in the chest, the light coming out through cracks in the stone round it
  R.part(rock(V(0, 1.18, 0.31), [0.11, 0.11, 0.05], sd + 91, 1, 0.12), 'chest', core, true);
  for (const [a, l] of [[0.6, 0.16], [2.4, 0.18], [3.9, 0.13], [5.3, 0.15]]) {
    const d = V(Math.cos(a), Math.sin(a), 0), b = V(0, 1.18, 0.34).add(d.clone().multiplyScalar(0.09)), e = b.clone().add(d.clone().multiplyScalar(l)); e.z = 0.31 - 0.08 * l;
    R.part(limb(b, e, 0.018, 0.004, 3), 'chest', core, true);
  }
  for (const s of [1, -1]) {
    RK(V(0.5 * s, 1.52, 0), [0.23, 0.2, 0.23], `armU${s}`, 1, 0.16); RK(V(0.58 * s, 1.3, 0.04), [0.14, 0.2, 0.14], `armU${s}`);
    RK(V(0.63 * s, 1.1, 0.08), [0.12, 0.11, 0.12], `armL${s}`); RK(V(0.62 * s, 0.88, 0.14), [0.17, 0.25, 0.17], `armL${s}`);
    RK(V(0.6 * s, 0.6, 0.22), [0.2, 0.17, 0.2], `fist${s}`, 1, 0.16);
    for (const f of [-1, 0, 1]) RK(V((0.6 + f * 0.08) * s, 0.58, 0.39), [0.06, 0.06, 0.06], `fist${s}`);
    // runes cut in the forearm, lit from inside
    const rz = 0.3; for (const [y0, y1, x0, x1] of [[0.98, 0.82, 0, 0], [0.94, 0.88, -0.04, 0.04], [0.86, 0.8, 0.04, -0.02]]) R.part(limb(V((0.62 + x0) * s, y0, rz), V((0.62 + x1) * s, y1, rz + 0.01), 0.008, 0.008, 3), `armL${s}`, core, true);
    RK(V(0.21 * s, 0.47, 0.02), [0.16, 0.17, 0.15], `legU${s}`); RK(V(0.24 * s, 0.24, 0.04), [0.14, 0.16, 0.14], `legL${s}`);
    RK(V(0.24 * s, 0.07, 0.08), [0.17, 0.08, 0.21], `foot${s}`);
  }
  const root3 = R.mesh(o.glow || '#ff8418', 1.15);
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
/** a creature as figure.js builds a figure: { root, mixer, clips, frame } @param {{ kind: string, [k: string]: any }} spec */
export function buildCreature(spec) {
  const { root, clips } = KINDS[spec.kind](spec);
  return { root, mixer: new THREE.AnimationMixer(root), clips, frame: null, creature: spec.kind };
}
