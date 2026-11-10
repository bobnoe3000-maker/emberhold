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
  part(geo, bone, colour, glow = false) { this.parts.push({ geo: geo.index ? geo.toNonIndexed() : geo, bone: this.bones.indexOf(this.by.get(bone)), colour, glow }); }
  mesh(glowColour) {
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
            pos.set([p.x, p.y, p.z], o * 3); col.set([c.r, c.g, c.b], o * 3); si.set([q.bone, 0, 0, 0], o * 4); sw.set([1, 0, 0, 0], o * 4); o++;
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
      const m = make(eyes, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.4, emissive: new THREE.Color(glowColour), emissiveIntensity: 2 }));
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
  const n = Math.max(2, Math.round(dur * fps) + 1), times = [], rot = new Map(), pos = new Map();
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1); times.push(t * dur);
    const f = fn(t);
    for (const [b, q] of Object.entries(f.q || {})) { if (!rot.has(b)) rot.set(b, new Array(n)); rot.get(b)[i] = q; }
    for (const [b, p] of Object.entries(f.p || {})) { if (!pos.has(b)) pos.set(b, new Array(n)); pos.get(b)[i] = p; }
  }
  const tracks = [];
  for (const [b, qs] of rot) tracks.push(new THREE.QuaternionKeyframeTrack(`${b}.quaternion`, times, qs.flatMap((q) => (q || new THREE.Quaternion()).toArray())));
  for (const [b, ps] of pos) { const base = rig.by.get(b).position; tracks.push(new THREE.VectorKeyframeTrack(`${b}.position`, times, ps.flatMap((p) => base.clone().add(p || V(0, 0, 0)).toArray()))); }
  return new THREE.AnimationClip(name, dur, tracks);
}
const TAU = Math.PI * 2, S = (x) => Math.sin(TAU * x), C = (x) => Math.cos(TAU * x);
const ease = (a, b, t) => { const u = Math.max(0, Math.min(1, (t - a) / (b - a))); return u * u * (3 - 2 * u); };
const bell = (a, m, b, t) => (t < m ? ease(a, m, t) : 1 - ease(m, b, t));

// ── the giant rat (the quadruped: wolves, hounds and boars after it, on its proportions: world doc §8) ────────────────────
// A grave rat the size of a dog (GDD §16, Old Gutter): hunched, mangy, a long bare tail, eyes like coals.
function rat(o = {}) {
  const R = new Rig(o.seed || 11), fur = new THREE.Color(o.fur || '#4a4038'), belly = new THREE.Color(o.belly || '#6e6152'), skin = new THREE.Color('#9a6a64');
  const furC = (p, n) => (n.y < -0.35 ? belly : fur);
  const root = R.bone('root', null, V(0, 0.2, 0.0)), pelvis = R.bone('pelvis', root, V(0, 0.21, -0.17)), chest = R.bone('chest', root, V(0, 0.22, 0.14));
  const neck = R.bone('neck', chest, V(0, 0.24, 0.25)), head = R.bone('head', neck, V(0, 0.26, 0.31)); R.bone('jaw', head, V(0, 0.235, 0.36));
  let tp = pelvis; const tail = [V(0, 0.18, -0.3), V(0, 0.12, -0.44), V(0.03, 0.06, -0.58), V(0.08, 0.025, -0.7)];
  tail.forEach((p, i) => { tp = R.bone(`tail${i + 1}`, tp, p); });
  for (const s of [1, -1]) {
    const sh = R.bone(`armU${s}`, chest, V(0.075 * s, 0.19, 0.16)), el = R.bone(`armL${s}`, sh, V(0.085 * s, 0.1, 0.19)); R.bone(`paw${s}`, el, V(0.085 * s, 0.025, 0.2));
    const hip = R.bone(`legU${s}`, pelvis, V(0.09 * s, 0.18, -0.17)), kn = R.bone(`legL${s}`, hip, V(0.1 * s, 0.1, -0.1)); R.bone(`foot${s}`, kn, V(0.1 * s, 0.035, -0.2));
  }
  // the body: hindquarters, the barrel, the hunched shoulders, the head and its long snout
  // (one long hunched body, the haunches the broadest of it, the back arched highest over them: not a string of beads)
  R.part(blob(V(0, 0.205, -0.13), [0.125, 0.125, 0.15], [12, 9]), 'pelvis', furC);
  R.part(blob(V(0, 0.215, 0.0), [0.11, 0.12, 0.22], [12, 9]), 'root', furC);
  R.part(blob(V(0, 0.215, 0.15), [0.085, 0.09, 0.1], [10, 8]), 'chest', furC);
  for (let i = 0; i < 7; i++) { const z = -0.17 + i * 0.05, y = 0.3 + 0.03 * Math.sin((i / 6) * Math.PI) + (i < 3 ? 0.03 : 0); R.part(limb(V(0, y, z), V(0, y + 0.035, z - 0.03), 0.018, 0.002, 4), i < 3 ? 'pelvis' : i < 6 ? 'root' : 'chest', fur); }   // the mangy ridge
  R.part(blob(V(0, 0.255, 0.31), [0.06, 0.06, 0.07], [10, 8]), 'head', fur);
  R.part(limb(V(0, 0.25, 0.34), V(0, 0.228, 0.47), 0.045, 0.012, 7), 'head', fur);
  R.part(blob(V(0, 0.232, 0.475), [0.013, 0.012, 0.012]), 'head', skin);              // the nose
  for (const s of [1, -1]) R.part(blob(V(0.05 * s, 0.31, 0.295), [0.04, 0.042, 0.01], [8, 6]).rotateY(0).translate(0, 0, 0), 'head', skin);   // the ears, round and bare
  R.part(blob(V(0, 0.222, 0.4), [0.024, 0.012, 0.05]), 'jaw', fur);
  R.part(new THREE.BoxGeometry(0.014, 0.022, 0.006).translate(0, 0.215, 0.455), 'jaw', new THREE.Color('#c8b878'));   // the teeth, yellow
  // the tail, bare and ringed, tapering to nothing
  const tl = [V(0, 0.2, -0.27), ...tail, V(0, 0.04, -0.88)];
  const tailC = new THREE.Color('#7e5e58'); tl.push(V(0.13, 0.015, -0.8), V(0.16, 0.012, -0.9));
  for (let i = 0; i < tl.length - 1; i++) R.part(limb(tl[i], tl[i + 1], 0.024 - i * 0.003, 0.021 - i * 0.003, 6), `tail${Math.min(4, i)}`.replace('tail0', 'pelvis'), tailC);
  for (const s of [1, -1]) {
    R.part(limb(V(0.075 * s, 0.19, 0.16), V(0.085 * s, 0.1, 0.19), 0.03, 0.02), `armU${s}`, fur);
    R.part(limb(V(0.085 * s, 0.1, 0.19), V(0.085 * s, 0.025, 0.2), 0.018, 0.014), `armL${s}`, fur);
    R.part(blob(V(0.085 * s, 0.012, 0.225), [0.02, 0.012, 0.03], [6, 4]), `paw${s}`, skin);
    R.part(limb(V(0.09 * s, 0.18, -0.17), V(0.1 * s, 0.1, -0.1), 0.05, 0.03), `legU${s}`, furC);
    R.part(limb(V(0.1 * s, 0.1, -0.1), V(0.1 * s, 0.035, -0.2), 0.022, 0.016), `legL${s}`, fur);
    R.part(blob(V(0.1 * s, 0.012, -0.15), [0.022, 0.012, 0.05], [6, 4]), `foot${s}`, skin);
    R.part(blob(V(0.036 * s, 0.278, 0.375), [0.012, 0.012, 0.01], [6, 4]), 'head', new THREE.Color('#ff5530'), true);   // the eyes, coals
  }
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
    clip(R, 'Idle', 2.0, (t) => ({ q: { ...tailSway(t, 0.15), head: qe(0.08 * S(t * 4) * bell(0.2, 0.35, 0.5, t), 0.15 * S(t), 0), jaw: qe(0.15 * Math.max(0, S(t * 6)) * bell(0.2, 0.35, 0.5, t), 0, 0), chest: qe(0.02 * S(t), 0, 0) }, p: { root: V(0, 0.004 * S(t * 2), 0) } })),
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

// ── the giant spider (the arachnid) ────────────────────────────────────────────────────────────────────────────────────
// A cellar spider grown wrong: low and wide, eight banded legs, a swollen abdomen with a pale mark, eight eyes catching
// the light, the fangs working.
function spider(o = {}) {
  const R = new Rig(o.seed || 23), dark = new THREE.Color(o.body || '#241d1a'), band = new THREE.Color(o.band || '#5e4b3a'), mark = new THREE.Color(o.mark || '#b8ab8e');
  const root = R.bone('root', null, V(0, 0.28, 0)), ceph = R.bone('ceph', root, V(0, 0.29, 0.1)), abd = R.bone('abdomen', root, V(0, 0.31, -0.08));
  for (const s of [1, -1]) { const f = R.bone(`fang${s}`, ceph, V(0.035 * s, 0.25, 0.27)); R.bone(`palp${s}`, ceph, V(0.06 * s, 0.27, 0.24)); void f; }
  const LEG = [[38, 1.15], [72, 1.0], [108, 0.95], [142, 1.1]], legs = [];
  for (const s of [1, -1]) LEG.forEach(([deg, k], i) => {
    const a = (deg * Math.PI) / 180, d = V(Math.sin(a) * s, 0, Math.cos(a)), at = V(0, 0.29, 0.1).add(d.clone().multiplyScalar(0.085));
    const knee = at.clone().add(d.clone().multiplyScalar(0.25 * k)).add(V(0, 0.19 * k, 0));
    const ankle = knee.clone().add(d.clone().multiplyScalar(0.27 * k)).add(V(0, -0.3 * k, 0));
    const tip = ankle.clone().add(d.clone().multiplyScalar(0.13 * k)); tip.y = 0.005;
    const A = R.bone(`leg${s}${i}a`, ceph, at), B = R.bone(`leg${s}${i}b`, A, knee); R.bone(`leg${s}${i}c`, B, ankle);
    legs.push({ s, i, d, k: d.clone().cross(UP).normalize(), name: `leg${s}${i}` });
    R.part(limb(at, knee, 0.03 * k, 0.025 * k), `leg${s}${i}a`, dark);
    R.part(blob(knee, [0.03 * k, 0.03 * k, 0.03 * k], [6, 4]), `leg${s}${i}b`, band);
    R.part(limb(knee, ankle, 0.024 * k, 0.017 * k), `leg${s}${i}b`, dark);
    R.part(blob(ankle, [0.02 * k, 0.02 * k, 0.02 * k], [6, 4]), `leg${s}${i}c`, band);
    R.part(limb(ankle, tip, 0.016 * k, 0.005), `leg${s}${i}c`, dark);
  });
  R.part(blob(V(0, 0.3, 0.1), [0.115, 0.07, 0.135]), 'ceph', dark);                     // the cephalothorax
  R.part(blob(V(0, 0.315, 0.225), [0.07, 0.055, 0.055]), 'ceph', dark);                 // the head
  // the abdomen, swollen, tilted up, a pale chevron down its back
  R.part(blob(V(0, 0.36, -0.29), [0.19, 0.165, 0.25], [12, 9], -0.25), 'abdomen', (p, n) => (n.y > 0.55 && Math.abs(p.x) < 0.012 + 0.03 * Math.max(0, Math.sin((p.z + 0.29) * 22)) ? mark : dark));
  R.part(limb(V(0, 0.27, -0.5), V(0, 0.24, -0.54), 0.03, 0.012), 'abdomen', band);      // the spinnerets
  for (const s of [1, -1]) {
    R.part(limb(V(0.035 * s, 0.27, 0.26), V(0.032 * s, 0.22, 0.3), 0.022, 0.016), `fang${s}`, dark);
    R.part(limb(V(0.032 * s, 0.22, 0.3), V(0.025 * s, 0.17, 0.29), 0.013, 0.003), `fang${s}`, new THREE.Color('#1a1012'));
    R.part(limb(V(0.06 * s, 0.27, 0.24), V(0.075 * s, 0.24, 0.33), 0.012, 0.009), `palp${s}`, band);
    R.part(limb(V(0.075 * s, 0.24, 0.33), V(0.07 * s, 0.19, 0.36), 0.009, 0.006), `palp${s}`, dark);
    // eight eyes: two large forward, six round them
    for (const [x, y, z, r] of [[0.018, 0.335, 0.272, 0.014], [0.045, 0.34, 0.258, 0.01], [0.03, 0.358, 0.25, 0.009], [0.055, 0.322, 0.252, 0.008]]) R.part(blob(V(x * s, y, z), [r, r, r], [6, 4]), 'ceph', new THREE.Color('#e8ff90'), true);
  }
  const root3 = R.mesh(o.eyes || '#b8e060');
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

const KINDS = { rat, spider };
export const CREATURE_KINDS = Object.keys(KINDS);
/** a creature as figure.js builds a figure: { root, mixer, clips, frame } @param {{ kind: string, [k: string]: any }} spec */
export function buildCreature(spec) {
  const { root, clips } = KINDS[spec.kind](spec);
  return { root, mixer: new THREE.AnimationMixer(root), clips, frame: null, creature: spec.kind };
}
