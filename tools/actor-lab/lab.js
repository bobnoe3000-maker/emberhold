// lab.js — render KayKit CC0 characters exactly as Emberhold's camera sees them:
// orthographic, 30° pitch / 45° yaw (the 2:1 dimetric of iso.js), sized so the
// figure is TARGET_PX tall at native resolution, no AA. Driven by render.cjs.
//
// Variant knobs (see variants.json): which accessory meshes to show (loadout),
// weapons to parent onto hand bones, code-built props for a hand slot and swatch
// repaints (props.js: the cleric's mace and vestments), a CSS-filter texture recolor
// (enemy NPCs reuse hero models), glowing-eye color, pose clip, and stock vs HEROIC
// proportions. Heroic = smaller head + joints pushed outward to lengthen legs,
// arms and torso without thickening them; applied AFTER each pose is sampled,
// because the clips key scale + translation on every bone.
//
// Gotcha: GLTFLoader strips '.' from node names ('handslot.r' → 'handslotr',
// 'lowerleg.l' → 'lowerlegl'); findNode()/applyHeroic() match both spellings.
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { PROPS, repaint } from './props.js';
import { buildFace, IRIS } from './faces.js';
import { buildBody } from './body.js';
// figure height in native px (?px=, default 46); the cell scales with it, feet sit 6px above the bottom
const TARGET_PX = +(new URLSearchParams(location.search).get('px') || 46);
const W = Math.round(72 * TARGET_PX / 46), H = Math.round(84 * TARGET_PX / 46);
const R = new THREE.WebGLRenderer({ antialias: false, alpha: true, preserveDrawingBuffer: true });
R.setPixelRatio(1); R.setSize(W, H); R.outputColorSpace = THREE.SRGBColorSpace;
R.toneMapping = THREE.ACESFilmicToneMapping; R.toneMappingExposure = 1.05; document.body.appendChild(R.domElement);
const loader = new GLTFLoader(), cache = new Map();
const load = (u) => new Promise((res, rej) => loader.load(u, res, undefined, rej));

// every toggleable accessory per model (anything not listed in a variant's `show` is hidden)
const ACC = {
  Knight: ['1H_Sword_Offhand', 'Badge_Shield', 'Rectangle_Shield', 'Round_Shield', 'Spike_Shield', '1H_Sword', '2H_Sword', 'Knight_Helmet', 'Knight_Cape'],
  Barbarian: ['1H_Axe_Offhand', 'Barbarian_Round_Shield', '1H_Axe', '2H_Axe', 'Mug', 'Barbarian_Hat', 'Barbarian_Cape'],
  Rogue: ['Knife_Offhand', '1H_Crossbow', '2H_Crossbow', 'Knife', 'Throwable', 'Rogue_Cape'],
  Rogue_Hooded: ['Knife_Offhand', '1H_Crossbow', '2H_Crossbow', 'Knife', 'Throwable', 'Rogue_Cape'],
  Mage: ['Spellbook', 'Spellbook_open', '1H_Wand', '2H_Staff', 'Mage_Hat', 'Mage_Cape'],
};
// "heroic" proportions: shrink the head, push joints outward to lengthen limbs/torso
// (moving a child joint along its parent lengthens the segment without thickening it)
// (art pass 7: the face knobs, bake.cjs env BAKE_PROTO / BAKE_HEAD → ?proto=features,grade&head=0.72. The
// shipped bake is 'eyes2,grade', A2b + B; ?proto= replaces the set, and proto=off bakes faces as before pass 7)
const QS = new URLSearchParams(location.search), PROTO = new Set((QS.get('proto') ?? 'eyes2,grade').split(',').filter((s) => s && s !== 'off'));
const HEROIC = { scale: { head: +(QS.get('head') || 0.62) }, reach: { spine: 1.2, chest: 1.18, head: 1.1,
  lowerleg: 1.5, foot: 1.45, lowerarm: 1.3, wrist: 1.3 } };
function applyHeroic(root) {
  root.traverse((b) => { if (!b.isBone) return;
    const base = b.name.replace(/\.?(l|r)$/, '');   // three sanitizes 'lowerleg.l' → 'lowerlegl'
    if (HEROIC.scale[base]) b.scale.multiplyScalar(HEROIC.scale[base]);
    if (HEROIC.reach[base]) b.position.multiplyScalar(HEROIC.reach[base]); });
}
// GLTFLoader strips '.' from node names; match either spelling
const findNode = (root, n) => root.getObjectByName(n) || root.getObjectByName(n.replace(/\./g, ''));
function recolor(root, filter) {
  const done = new Map();
  root.traverse((o) => { if (!o.isMesh || /Eyes/.test(o.name) || !o.material.map) return;
    let m = done.get(o.material);
    if (!m) { const img = o.material.map.image, cv = document.createElement('canvas');
      cv.width = img.width; cv.height = img.height; const x = cv.getContext('2d'); x.filter = filter; x.drawImage(img, 0, 0);
      const t = new THREE.CanvasTexture(cv); t.flipY = o.material.map.flipY; t.colorSpace = o.material.map.colorSpace;
      t.magFilter = o.material.map.magFilter; t.minFilter = o.material.map.minFilter; t.wrapS = o.material.map.wrapS; t.wrapT = o.material.map.wrapT;
      m = o.material.clone(); m.map = t; done.set(o.material, m); }
    o.material = m; });
}
// faces.json presets (faces.js): a variant's `face` is a preset name or an inline face
let FACES = null;
const facePreset = async (f) => { if (typeof f !== 'string') return f; FACES ||= await (await fetch('./faces.json')).json(); if (!FACES[f]) throw new Error(`no face preset "${f}"`); return FACES[f]; };
async function build(v, { far = false } = {}) {
  const g = await load(`./models/${v.model}.glb`), root = g.scene;
  const acc = ACC[v.model] || [];
  root.traverse((o) => { if (o.isMesh) { o.frustumCulled = false; if (acc.includes(o.name) && !(v.show || []).includes(o.name)) o.visible = false; } });
  if (v.body) {                                          // mock-up: our own body, clothes and head on the KayKit rig (body.js)
    const b = { ...v.body, face: await facePreset(v.body.face) };
    if (v.body.shape) b.face = { ...b.face, shape: v.body.shape };
    await buildBody(load, root, b, { far, findNode });
  } else if (v.face) {                                   // a modular face replaces the KayKit head (faces.js)
    const { head, replaces } = await buildFace(load, v.model, await facePreset(v.face), { far });
    root.traverse((o) => { if (o.isMesh && replaces.includes(o.name)) o.visible = false; });
    findNode(root, 'head').add(head);
  }
  for (const [bone, file] of Object.entries(v.attach || {})) { const w = await load(`./models/${file}`); findNode(root, bone)?.add(w.scene); }
  for (const [bone, name] of Object.entries(v.hold || {})) { const p = PROPS[name](); p.position.y = 0.033; findNode(root, bone)?.add(p); }   // sits like the kits' 1H weapons
  for (const [bone, name] of Object.entries(v.wear || {})) findNode(root, bone)?.add(PROPS[name]());   // worn on a body bone (the smith's apron)
  if (v.swatches) repaint(root, v.swatches);
  if (v.recolor) recolor(root, v.recolor);
  if (v.eyes) root.traverse((o) => { if (o.isMesh && /Eyes/.test(o.name)) { o.material = o.material.clone(); o.material.emissive = new THREE.Color(v.eyes); o.material.emissiveIntensity = 3; } });
  return { root, mixer: new THREE.AnimationMixer(root), clips: g.animations };
}
function pose(c, clipName, t, heroic) {
  c.mixer.stopAllAction();
  const clip = c.clips.find((a) => a.name === clipName) || c.clips.find((a) => a.name === 'Idle');
  c.mixer.clipAction(clip).play(); c.mixer.setTime(t * clip.duration);
  if (heroic) applyHeroic(c.root);                       // after sampling: clips key scale+translation
  c.root.updateMatrixWorld(true);
  plumb(c.root);
}
// carried things hang plumb (art pass 6): a lantern, a basket or a hammer held at the side hangs from
// the grip whatever the hand's angle, where a rigid prop stuck out like a pole. A prop with
// userData.hang turns, every sampled pose, so its +y points straight down (a prop built along −y, the
// whip, stands upright); it keeps the figure's yaw so it faces the way they do.
const _q = new THREE.Quaternion(), _qp = new THREE.Quaternion(), _down = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI);
function plumb(root) {
  const hung = []; root.traverse((o) => { if (o.userData.hang) hung.push(o); });
  if (!hung.length) return;
  const yaw = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), root.rotation.y);
  for (const o of hung) {
    o.parent.getWorldQuaternion(_qp);
    _q.copy(yaw).multiply(_down);
    o.quaternion.copy(_qp.invert().multiply(_q));
  }
  root.updateMatrixWorld(true);
}
// dev probe: a bone's world position and axes in a pose (placing worn props)
window.probeBone = async (v, bone, clip = 'Idle', t = 0) => {
  const c = await build(v); pose(c, clip, t, true); const b = findNode(c.root, bone), q = b.getWorldQuaternion(new THREE.Quaternion()), s = b.getWorldScale(new THREE.Vector3());
  const ax = (x, y, z) => new THREE.Vector3(x, y, z).applyQuaternion(q).toArray().map((n) => +n.toFixed(2));
  return { pos: b.getWorldPosition(new THREE.Vector3()).toArray().map((n) => +n.toFixed(3)), x: ax(1, 0, 0), y: ax(0, 1, 0), z: ax(0, 0, 1), scale: s.toArray().map((n) => +n.toFixed(3)) };
};
function lights(s, side) {
  s.add(new THREE.HemisphereLight(0x9a8cc0, 0x1a1428, 1.5));
  const pl = new THREE.PointLight(0xffb070, 16, 0, 1.4); pl.position.set(side * 1.6, 1.9, 1.4); s.add(pl);
  const rim = new THREE.DirectionalLight(0xa88cff, 1.1); rim.position.set(-2, 2, -3); s.add(rim);
}
window.renderVariants = async (vs) => {
  const out = {};
  for (const v of vs) for (const heroic of v.props) {
    const c = await build(v);
    const [clip, t] = v.pose || ['Idle', 0.5];
    pose(c, clip, t, heroic);
    const box = new THREE.Box3().setFromObject(c.root), h = box.max.y - box.min.y, ppu = TARGET_PX / h;
    const cam = new THREE.OrthographicCamera(-W / 2 / ppu, W / 2 / ppu, H / 2 / ppu, -H / 2 / ppu, 0.1, 100);
    const p = THREE.MathUtils.degToRad(30), y = THREE.MathUtils.degToRad(45), tgt = new THREE.Vector3(0, box.min.y + (H * 0.5 - 6) / ppu, 0);
    cam.position.set(20 * Math.cos(p) * Math.sin(y), tgt.y + 20 * Math.sin(p), 20 * Math.cos(p) * Math.cos(y)); cam.lookAt(tgt);
    for (const d of v.dirs) {
      c.root.rotation.y = d * Math.PI / 4; c.root.updateMatrixWorld(true);
      const s = new THREE.Scene(); s.add(c.root); lights(s, -1);
      R.setClearColor(0, 0); R.render(s, cam);
      out[`${v.id}|${heroic ? 'heroic' : 'stock'}|${d}`] = R.domElement.toDataURL('image/png');
    }
  }
  return out;
};
// ─── Game atlas bake (bake.cjs). One build per character; every (direction, clip
// frame) is rendered three times — ALBEDO (unlit palette colour → grim pass +
// 1px ink outline; `gain` scales value into the terrain's albedo range, since the
// deferred pass relights it), NORMAL (view-space → Emberhold's screen-normal convention) and
// EMISSIVE (eyes only) — and packed into rows = 8 screen octants (0=E, 1=SE,
// 2=S toward the camera, … clockwise), columns = clip frames. Scale and camera are
// fixed from the idle pose so the figure never pulses between frames.
const INK = [8, 5, 14];
// grim pass: partial desat, a cool (not magenta) tint, value gain, and a gentle contrast
// S-curve around mid-grey so armour plates, cloth and skin separate at 56 px. Hot pixels
// (the emissive eye mask) stay hot — bright texture (fur trim, bone) is graded like the rest. Earlier tint (0.92, 0.87, 1.0) cut green hardest → a magenta
// cast that dusk light turned pink.
function grimPass(d, gain = 1, desat = 0.34, contrast = 1.18, glow = null, cls = null) {
  for (let i = 0; i < d.length; i += 4) { if (!d[i + 3]) continue;
    const r = d[i], g = d[i + 1], b = d[i + 2]; if (glow && glow[i] > 128) continue;   // only the glowing eyes stay hot
    const L = 0.3 * r + 0.59 * g + 0.11 * b, soft = cls && cls[i >> 2];          // (pass 7 'grade': a face keeps its warmth)
    const ds = soft ? 0.12 : desat, ct = soft ? 1.1 : contrast;
    const c = (v) => Math.max(0, Math.min(255, 128 + (v - 128) * ct));
    d[i] = c(r + (L - r) * ds) * 0.9 * gain; d[i + 1] = c(g + (L - g) * ds) * 0.91 * gain; d[i + 2] = c(b + (L - b) * ds) * 0.98 * gain; }
}
// (pass 7 'grade') where hair meets skin, the hair's edge pixel darkens a step, an inner line, so light
// hair on light skin (Ilse, Osric, Nell) reads as hair; a face feature is kept at least 35 % darker than the
// skin beside it, or a pale brow or mouth vanishes again after the grade
function faceLines(d, cls) {
  const W2 = W, H2 = H, L = (i) => 0.3 * d[i] + 0.59 * d[i + 1] + 0.11 * d[i + 2], src = new Uint8ClampedArray(d);
  for (let y = 0; y < H2; y++) for (let x = 0; x < W2; x++) {
    const k = y * W2 + x, c = cls[k]; if (c !== 2 && c !== 3) continue;   // (4, an eye's white, is meant to be light)
    let skin = -1; for (const [dx, dy] of [[0, 1], [1, 0], [-1, 0], [0, -1]]) { const xx = x + dx, yy = y + dy; if (xx >= 0 && yy >= 0 && xx < W2 && yy < H2 && cls[yy * W2 + xx] === 1) { skin = (yy * W2 + xx) * 4; break; } }
    if (skin < 0) continue;
    const i = k * 4, ls = 0.3 * src[skin] + 0.59 * src[skin + 1] + 0.11 * src[skin + 2], lp = L(i);
    const want = c === 3 ? ls * 0.65 : Math.abs(lp - ls) < 40 ? lp * 0.72 : lp * 0.86, kf = lp > 0 ? Math.min(1, want / lp) : 1;
    d[i] *= kf; d[i + 1] *= kf; d[i + 2] *= kf;
  }
}
// WEAPON ANCHORS (src/render/fx.js draws trails / glints / cast shimmer from these): each
// held weapon is a rigid mesh under a hand slot, so its tip is fixed in slot space. Found
// once — the extreme of the weapon's long axis farthest from the grip (sword point, axe
// head, staff crown, crossbow nose) — then projected every baked frame to cell pixels:
// [tipX, tipY, gripX, gripY, z], z = px the tip sits toward the camera from the figure's
// centre line (negative = behind the body, so the FX can tuck under the figure).
function weaponRig(c, v) {
  const rig = {};
  for (const [sl, bone] of [['r', 'handslot.r'], ['l', 'handslot.l']]) {
    const slot = findNode(c.root, bone); if (!slot) continue;
    c.root.updateMatrixWorld(true);
    const inv = slot.matrixWorld.clone().invert(), pts = [], p = new THREE.Vector3();
    slot.traverse((o) => { if (!o.isMesh || !o.visible || /Shield/i.test(o.name)) return;
      const pos = o.geometry.attributes.position, m = inv.clone().multiply(o.matrixWorld);
      for (let i = 0; i < pos.count; i++) pts.push(p.fromBufferAttribute(pos, i).applyMatrix4(m).clone()); });
    if (pts.length < 8) continue;
    const box = new THREE.Box3().setFromPoints(pts), size = box.getSize(new THREE.Vector3());
    const ax = (v.tipAxis && v.tipAxis[sl]) || (size.x >= size.y && size.x >= size.z ? 'x' : size.y >= size.z ? 'y' : 'z');
    let lo = pts[0], hi = pts[0]; for (const q of pts) { if (q[ax] < lo[ax]) lo = q; if (q[ax] > hi[ax]) hi = q; }
    const flip = v.tipFlip && v.tipFlip[sl], far = Math.abs(hi[ax]) >= Math.abs(lo[ax]);
    rig[sl] = { slot, tip: (far !== !!flip ? hi : lo).clone(), len: size[ax] };
  }
  return rig;
}
function anchorAt(w, root, cam, ppu) {
  const pr = (q) => { const n = q.clone().project(cam); return [(n.x + 1) / 2 * W, (1 - n.y) / 2 * H]; };
  const tipW = w.slot.localToWorld(w.tip.clone()), gripW = w.slot.getWorldPosition(new THREE.Vector3());
  const ctr = root.getWorldPosition(new THREE.Vector3()), fwd = cam.getWorldDirection(new THREE.Vector3());
  const z = -tipW.clone().sub(ctr).dot(fwd) * ppu;                                         // toward the camera = +
  return [...pr(tipW), ...pr(gripW), z].map((n) => Math.round(n));
}
// flatten per-cell anchors into one int array per slot: 5 per cell, cell = dir * frames + frame
const packAnchors = (a) => Object.fromEntries(Object.entries(a).map(([k, v]) => [k, v.flat()]));
// STRIDE (art pass 6): how far the figure travels in one walk cycle, in game tiles, measured from its
// own feet. The clips walk in place, so a planted foot slides back at the body's speed. The contact is the
// lowest SKINNED vertex of each leg (heel, then toe as the foot rolls; the ankle bone lifts while the sole
// is down), and KayKit's plants aren't clean, so: each stretch where a leg's contact stays within 5 cm of
// the floor gets a least-squares slope, and the stride is their mean (weighted by length) × one cycle.
// Converted at the camera's scale (ppu px a unit; 8√2 px a tile along the screen's x). The renderer steps
// walk frames by distance ÷ stride, so feet that match it don't skate. Null when the fit disagrees with
// itself (the Ashbound's shuffle drags its feet): the renderer keeps its constant then.
function strideOf(c, clipName, ppu, sample) {
  const legs = []; c.root.traverse((o) => { if (o.isSkinnedMesh && o.visible && /Leg(Left|Right)|_Leg/.test(o.name)) legs.push(o); });
  if (legs.length < 2) return null;
  const N = 72, P = [], v = new THREE.Vector3();
  for (let i = 0; i < N; i++) {
    sample(clipName, i / N); c.root.rotation.y = 0; c.root.updateMatrixWorld(true);
    P.push(legs.map((m) => { const pos = m.geometry.attributes.position; let lo = null;
      for (let k = 0; k < pos.count; k++) { m.getVertexPosition(k, v); v.applyMatrix4(m.matrixWorld); if (!lo || v.y < lo[0]) lo = [v.y, v.z]; }
      return lo; }));
  }
  const floor = Math.min(...P.flat().map((q) => q[0])), segs = [];
  for (let k = 0; k < legs.length; k++) for (let i = 0; i < N;) {
    if (P[i][k][0] - floor >= 0.05) { i++; continue; }
    let j = i; while (j < N && P[j][k][0] - floor < 0.05) j++;
    if (j - i >= 3) {                                     // slope of z over t (cycles) by least squares
      let st = 0, sz = 0, stt = 0, stz = 0; const n = j - i;
      for (let q = i; q < j; q++) { const t = q / N, z = P[q][k][1]; st += t; sz += z; stt += t * t; stz += t * z; }
      const slope = (n * stz - st * sz) / (n * stt - st * st);
      if (slope < 0) segs.push([-slope, n]);
    }
    i = j;
  }
  if (segs.length < 2) return null;
  const tot = segs.reduce((a, [, n]) => a + n, 0), mean = segs.reduce((a, [s, n]) => a + s * n, 0) / tot;
  if (segs.some(([s]) => Math.abs(s - mean) > 0.3 * mean)) return null;
  return Math.round((mean * ppu / (8 * Math.SQRT2)) * 100) / 100;
}
window.bakeAtlas = async (v, clips, gain = 1) => {
  const c = await build(v, { far: TARGET_PX < 90 }), bones = [];   // (a figure baked at 90 px or more keeps the portrait's face: D)
  const face = v.face ? await facePreset(v.face) : null, irisC = new THREE.Color((face && IRIS[face.iris]) || IRIS.brown);
  c.root.traverse((b) => { if (b.isBone) bones.push([b, b.position.clone(), b.quaternion.clone(), b.scale.clone()]); });
  const sample = (name, t) => {                          // restore rest pose first so the heroic pass never compounds
    for (const [b, p, q, s] of bones) { b.position.copy(p); b.quaternion.copy(q); b.scale.copy(s); }
    pose(c, name, t, true);
  };
  sample('Idle', 0);
  const box = new THREE.Box3().setFromObject(c.root), ppu = TARGET_PX / (box.max.y - box.min.y);
  const cam = new THREE.OrthographicCamera(-W / 2 / ppu, W / 2 / ppu, H / 2 / ppu, -H / 2 / ppu, 0.1, 100);
  const pr = THREE.MathUtils.degToRad(30), yw = THREE.MathUtils.degToRad(45), tgt = new THREE.Vector3(0, box.min.y + (H * 0.5 - 6) / ppu, 0);
  cam.position.set(20 * Math.cos(pr) * Math.sin(yw), tgt.y + 20 * Math.sin(pr), 20 * Math.cos(pr) * Math.cos(yw)); cam.lookAt(tgt);
  const scene = new THREE.Scene(); scene.add(c.root);
  const wr = weaponRig(c, v), anchors = {};
  for (const k of Object.keys(wr)) anchors[k] = [];
  const walkClip = clips.find((k) => k.key === 'walk' && /^Walking_/.test(k.clip)), stride = walkClip ? strideOf(c, walkClip.clip, ppu, sample) : null;   // (the party's run has flight and no clean plant: the renderer keeps its 4.5)
  const mats = { alb: new Map(), emi: new Map() }, black = new THREE.MeshBasicMaterial({ color: 0 }), white = new THREE.MeshBasicMaterial({ color: 0xffffff });
  c.root.traverse((o) => { if (!o.isMesh) return; const eyes = /Eyes/.test(o.name), m = o.material;
    // eyes glow only on figures that ask for it (skeletons); heroes keep their painted eyes —
    // a flat white eye mesh read as a white "grin" through the knight's visor
    // (a prop part with userData.glow, Wendel's lantern glass, glows too: art pass 6)
    const lit = !eyes && o.userData.glow, glow = (eyes && v.eyes) || lit;
    mats.alb.set(o, glow ? new THREE.MeshBasicMaterial({ color: lit || v.eyes }) : new THREE.MeshBasicMaterial({ map: m.map, color: m.color }));
    mats.emi.set(o, glow ? white : black); });
  // (pass 7) what each pixel is: face features (eye, brow, mouth) red, skin green, hair and beard blue
  // (A2 tells the features apart by red: the two eyes, the brows, the mouth)
  const PART = { eye: 0xfa0000, eyeA: 0xfa0000, eyeB: 0xd20000, brow: 0xaa0000, mouth: 0x820000, skin: 0x00ff00, hair: 0x0000ff };
  mats.part = new Map(); c.root.traverse((o) => { if (o.isMesh) mats.part.set(o, new THREE.MeshBasicMaterial({ color: PART[o.userData.part] ?? 0 })); });
  let hasFace = false; c.root.traverse((o) => { if (o.isMesh && o.userData.part) hasFace = true; });   // (no face, no part pass: skeletons bake as before)
  const nrmMat = new THREE.MeshNormalMaterial();
  const frames = clips.reduce((n, k) => n + k.frames, 0), cols = frames, rows = 8;
  const mk = () => { const cv = document.createElement('canvas'); cv.width = W * cols; cv.height = H * rows; return cv; };
  const A = mk(), N = mk(), E = mk(), ax = A.getContext('2d'), nx = N.getContext('2d'), ex = E.getContext('2d');
  nx.fillStyle = '#000'; nx.fillRect(0, 0, N.width, N.height); ex.fillStyle = '#000'; ex.fillRect(0, 0, E.width, E.height);
  // SUPERSAMPLED (critic: figures looked grainy): each pass renders at SS× and is area-
  // averaged down, so a pixel's colour is the mean of the texture under it rather than one
  // arbitrary texel, and its normal the mean of the surface under it (smooth light, no
  // blotches). Coverage ≥ 50 % keeps the pixel; emissive needs half the covered sub-pixels.
  const SS = 4;
  R.setSize(W * SS, H * SS);
  const tmp = document.createElement('canvas'); tmp.width = W * SS; tmp.height = H * SS; const tx = tmp.getContext('2d', { willReadFrequently: true });
  const down = (big, kind) => {
    const out = new ImageData(W, H), o = out.data, b = big.data, BW = W * SS;
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      let n = 0, r = 0, g = 0, bl = 0, hot = 0;
      for (let sy = 0; sy < SS; sy++) for (let sx = 0; sx < SS; sx++) {
        const i = ((y * SS + sy) * BW + x * SS + sx) * 4; if (!b[i + 3]) continue;
        n++;
        if (kind === 'nrm') { r += b[i] / 127.5 - 1; g += b[i + 1] / 127.5 - 1; bl += b[i + 2] / 127.5 - 1; }
        else if (kind === 'emi') { if (b[i] > 128) hot++; }
        else { r += b[i] * b[i]; g += b[i + 1] * b[i + 1]; bl += b[i + 2] * b[i + 2]; }     // average in ~linear light (squares), so edges don't darken
      }
      const j = (y * W + x) * 4;
      if (n < (SS * SS) / 2) continue;
      if (kind === 'nrm') { const l = Math.hypot(r, g, bl) || 1; o[j] = (r / l * 0.5 + 0.5) * 255; o[j + 1] = (g / l * 0.5 + 0.5) * 255; o[j + 2] = (bl / l * 0.5 + 0.5) * 255; }
      else if (kind === 'emi') { const v = hot * 2 >= n ? 255 : 0; o[j] = o[j + 1] = o[j + 2] = v; }
      else { o[j] = Math.sqrt(r / n); o[j + 1] = Math.sqrt(g / n); o[j + 2] = Math.sqrt(bl / n); }
      o[j + 3] = 255;
    }
    return out;
  };
  // despeckle: a pixel unlike all 8 neighbours (an isolated texel spike) takes the mean of the
  // three neighbours closest to it — clean colour regions, detail that spans ≥ 2 px survives
  // (A2) a pixel-art face, placed from the geometry: each eye exactly one pixel wide (two tall where the
  // eye covers two rows well), dark and tinted by the iris, not black; 'eyes2' adds the white beside it on
  // the outer side when the face is wide enough to hold it. Brows a single row, never touching the eye (a row
  // of skin between); the mouth at most two pixels, only when both eyes show. Everything else averages as before.
  const pixelFace = (big, pb, out, cls, measure, outer) => {
    const o = out.data, BW = W * SS, N = W * H, cov = { A: new Uint8Array(N), B: new Uint8Array(N), brow: new Uint8Array(N), mouth: new Uint8Array(N) };
    const sum = { brow: new Float64Array(N * 3), mouth: new Float64Array(N * 3) };
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      let n = 0, r = 0, g = 0, bl = 0, sk = 0, hr = 0; const k = y * W + x;
      for (let sy = 0; sy < SS; sy++) for (let sx = 0; sx < SS; sx++) {
        const i = ((y * SS + sy) * BW + x * SS + sx) * 4; if (!big[i + 3]) continue;
        n++; r += big[i] * big[i]; g += big[i + 1] * big[i + 1]; bl += big[i + 2] * big[i + 2];
        const R = pb[i];
        if (R > 230) cov.A[k]++; else if (R > 190) cov.B[k]++;
        else if (R > 150) { cov.brow[k]++; sum.brow[k * 3] += big[i]; sum.brow[k * 3 + 1] += big[i + 1]; sum.brow[k * 3 + 2] += big[i + 2]; }
        else if (R > 100) { cov.mouth[k]++; sum.mouth[k * 3] += big[i]; sum.mouth[k * 3 + 1] += big[i + 1]; sum.mouth[k * 3 + 2] += big[i + 2]; }
        if (R > 100 || pb[i + 1] > 128) sk++; else if (pb[i + 2] > 128) hr++;   // (a feature's sub-samples count as face)
      }
      if (n < (SS * SS) / 2) continue;
      const j = k * 4; o[j] = Math.sqrt(r / n); o[j + 1] = Math.sqrt(g / n); o[j + 2] = Math.sqrt(bl / n); o[j + 3] = 255;
      cls[k] = sk >= hr && sk * 3 >= n ? 1 : hr * 3 >= n ? 2 : 0;
    }
    const set = (k, rgb, c) => { const j = k * 4; if (!o[j + 3]) return false; o[j] = rgb[0]; o[j + 1] = rgb[1]; o[j + 2] = rgb[2]; cls[k] = c; return true; };
    const skinNear = (k) => { const j = k * 4; return [o[j], o[j + 1], o[j + 2]]; };
    const eyeRGB = (k) => { const s = skinNear(k), d = irisC.clone().lerp(new THREE.Color('#120a08'), 0.55); return [d.r * 255 * 0.85 + s[0] * 0.15 * 0.3, d.g * 255 * 0.85 + s[1] * 0.15 * 0.3, d.b * 255 * 0.85 + s[2] * 0.15 * 0.3]; };
    const eyesAt = [];
    for (const id of ['A', 'B']) {
      const c = cov[id]; let best = -1, bc = 1;
      for (let k = 0; k < N; k++) if (c[k] > bc) { bc = c[k]; best = k; }
      if (best < 0 || bc < 2) continue;
      const up = best - W, dn = best + W, cu = up >= 0 ? c[up] : 0, cd = dn < N ? c[dn] : 0, alt = cu >= cd ? up : dn;
      eyesAt.push({ id, x: best % W, k: best, alt, tall: Math.max(cu, cd) >= Math.max(3, bc * 0.55) });
    }
    const tall = eyesAt.length && eyesAt.every((e) => e.tall);                // a pair matches: two tall only when both are
    for (const e of eyesAt) { const px = tall ? [e.k, e.alt] : [e.k], rgb = eyeRGB(e.k); for (const k of px) set(k, rgb, 3); e.ys = px.map((k) => Math.floor(k / W)); }
    const eyeSet = new Set(eyesAt.flatMap((e) => e.ys.map((y) => y * W + e.x)));
    const pair = eyesAt.length === 2 && Math.abs(eyesAt[0].x - eyesAt[1].x) >= 3;   // (two eyes: a face wide enough for whites)
    if (PROTO.has('eyes2') && (pair || eyesAt.length === 1)) {              // the whites, on each eye's outer side (from the geometry,
      for (const e of eyesAt) { const dx = outer && outer[e.id]; if (!dx) continue;   //  so a lone three-quarter eye gets one too)
        const k = e.ys[0] * W + e.x + dx; if (cls[k] !== 1) continue; const s = skinNear(k);
        set(k, [s[0] + (236 - s[0]) * 0.75, s[1] + (228 - s[1]) * 0.75, s[2] + (216 - s[2]) * 0.75], 4);
      }
    }
    // brows: the topmost covered pixel of each column, only over an eye (its column and either side; a lone
    // three-quarter eye's, its column and the outer one), and toned a step toward the skin so a saturated brow
    // (Maudry's auburn) doesn't read as a mark
    const browCols = new Set(); for (const e of eyesAt) for (const dx of eyesAt.length === 2 ? [-1, 0, 1] : [0, (outer && outer[e.id]) || 0]) browCols.add(e.x + dx);
    for (const x of browCols) {
      for (let y = 0; y < H; y++) { const k = y * W + x; if (cov.brow[k] < 3 || cls[k] === 3) continue;
        if (eyeSet.has(k + W)) break;                                        // (a row of skin between brow and eye)
        const n = cov.brow[k], s = skinNear(k); set(k, [0, 1, 2].map((c) => sum.brow[k * 3 + c] / n * 0.65 + s[c] * 0.6 * 0.35), 3); break; }
    }
    if (eyesAt.length === 2) {                                              // the mouth: its two best pixels
      const m = []; for (let k = 0; k < N; k++) if (cov.mouth[k] >= 3 && cls[k] === 1) m.push(k);
      m.sort((a, b) => cov.mouth[b] - cov.mouth[a]);
      for (const k of m.slice(0, 2)) { const n = cov.mouth[k]; set(k, [sum.mouth[k * 3] / n * 0.85, sum.mouth[k * 3 + 1] / n * 0.85, sum.mouth[k * 3 + 2] / n * 0.85], 3); }
    }
    if (measure) { measure.eyes = eyesAt.map((e) => e.ys.length); for (const [c, key] of [[3, 'feat'], [4, 'whites']]) measure[key] = cls.reduce((n, v) => n + (v === c), 0); }
    return { img: out, cls };
  };
  // which way each eye's outer corner lies on screen this frame (+1 right, −1 left, 0 can't tell): away from the
  // other eye and a little back along the face, so a lone three-quarter eye knows its side too
  const eyeMesh = {}; c.root.traverse((o) => { const p = o.isMesh && o.userData.part; if ((p === 'eyeA' || p === 'eyeB') && !eyeMesh[p[3]]) eyeMesh[p[3]] = o; });
  const outerOf = () => {
    if (!eyeMesh.A || !eyeMesh.B) return null;
    const P = { A: eyeMesh.A.getWorldPosition(new THREE.Vector3()), B: eyeMesh.B.getWorldPosition(new THREE.Vector3()) }, res = {};
    for (const [id, other] of [['A', 'B'], ['B', 'A']]) {
      const nrm = new THREE.Vector3(0, 0, 1).applyQuaternion(eyeMesh[id].parent.getWorldQuaternion(new THREE.Quaternion()));
      const d = P[id].clone().sub(P[other]).normalize().addScaledVector(nrm, -0.6), x0 = P[id].clone().project(cam).x, x1 = P[id].clone().addScaledVector(d, 0.05).project(cam).x;
      res[id] = Math.abs(x1 - x0) * W / 2 < 0.05 ? 0 : Math.sign(x1 - x0);
    }
    return res;
  };
  const despeckle = (d, cls = null) => {
    const src = new Uint8ClampedArray(d), at = (x, y) => (x >= 0 && y >= 0 && x < W && y < H && src[(y * W + x) * 4 + 3] ? (y * W + x) * 4 : -1);
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const i = at(x, y); if (i < 0 || (cls && cls[i >> 2] >= 3)) continue;   // (a face feature is meant to stand alone)
      const ns = []; for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) { if (!dx && !dy) continue; const k = at(x + dx, y + dy); if (k >= 0) ns.push(k); }
      if (ns.length < 6) continue;                                          // edges and thin parts keep their pixels
      const dist = (k) => Math.abs(src[k] - src[i]) + Math.abs(src[k + 1] - src[i + 1]) + Math.abs(src[k + 2] - src[i + 2]);
      ns.sort((p, q) => dist(p) - dist(q));
      if (dist(ns[0]) < 54) continue;                                        // has a like neighbour: real detail
      for (let c = 0; c < 3; c++) d[i + c] = (src[ns[0] + c] + src[ns[1] + c] + src[ns[2] + c]) / 3;
    }
  };
  const passBig = (kind) => {
    if (kind === 'nrm') { scene.overrideMaterial = nrmMat; R.outputColorSpace = THREE.LinearSRGBColorSpace; }
    else { scene.overrideMaterial = null; R.outputColorSpace = THREE.SRGBColorSpace; c.root.traverse((o) => { if (o.isMesh) o.material = mats[kind].get(o); }); }
    R.toneMapping = THREE.NoToneMapping; R.setClearColor(0, 0); R.render(scene, cam);
    tx.clearRect(0, 0, W * SS, H * SS); tx.drawImage(R.domElement, 0, 0); return tx.getImageData(0, 0, W * SS, H * SS);
  };
  const pass = (kind) => down(passBig(kind), kind);
  // (pass 7 'features') the albedo with its face features kept whole: a pixel where an eye, brow or mouth
  // covers 3 of the 16 sub-samples takes the feature's own colour, where plain averaging washed a 1 px eye
  // into the skin. Also returns each pixel's class (0 other · 1 skin · 2 hair · 3 feature) for the grade.
  const faceStats = PROTO.has('stats') ? { 2: { feat3: 0, feat8: 0, headW: 0, headH: 0 }, 1: { feat3: 0, feat8: 0, headW: 0, headH: 0 } } : null;   // (measured on the idle cell, front and three-quarter)
  const A2 = PROTO.has('eyes1') || PROTO.has('eyes2');
  const albParts = (measure) => {
    const big = passBig('alb').data, pb = passBig('part').data, out = new ImageData(W, H), o = out.data, cls = new Uint8Array(W * H), BW = W * SS;
    if (A2) return pixelFace(big, pb, out, cls, measure, outerOf());
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      let n = 0, r = 0, g = 0, bl = 0, fn = 0, fr = 0, fg = 0, fb = 0, sk = 0, hr = 0;
      for (let sy = 0; sy < SS; sy++) for (let sx = 0; sx < SS; sx++) {
        const i = ((y * SS + sy) * BW + x * SS + sx) * 4; if (!big[i + 3]) continue;
        n++; r += big[i] * big[i]; g += big[i + 1] * big[i + 1]; bl += big[i + 2] * big[i + 2];
        if (pb[i] > 128) { fn++; fr += big[i] * big[i]; fg += big[i + 1] * big[i + 1]; fb += big[i + 2] * big[i + 2]; } else if (pb[i + 1] > 128) sk++; else if (pb[i + 2] > 128) hr++;
      }
      if (n < (SS * SS) / 2) continue;
      const j = (y * W + x) * 4, f = PROTO.has('features') && fn >= 3;
      if (f) { o[j] = Math.sqrt(fr / fn); o[j + 1] = Math.sqrt(fg / fn); o[j + 2] = Math.sqrt(fb / fn); cls[y * W + x] = 3; }
      else { o[j] = Math.sqrt(r / n); o[j + 1] = Math.sqrt(g / n); o[j + 2] = Math.sqrt(bl / n); cls[y * W + x] = fn * 2 >= n ? 3 : sk >= hr && sk * 3 >= n ? 1 : hr * 3 >= n ? 2 : 0; }
      o[j + 3] = 255;
      if (measure) { if (fn >= 3) measure.feat3++; if (fn >= 8) measure.feat8++; }
    }
    if (measure) { let x0 = W, y0 = H, x1 = -1, y1 = -1; for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (cls[y * W + x]) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); } measure.headW = x1 - x0 + 1; measure.headH = y1 - y0 + 1; }
    return { img: out, cls };
  };
  let hasGlow = false;
  for (let dir = 0; dir < 8; dir++) {
    c.root.rotation.y = THREE.MathUtils.degToRad(135 - 45 * dir);
    let col = 0;
    for (const k of clips) for (let f = 0; f < k.frames; f++, col++) {
      // loops sample f/N (the cycle wraps); one-shots (k.once) span [from, to] inclusive so the last frame is the end pose
      const a0 = k.from ?? 0, a1 = k.to ?? 1, u = k.once ? a0 + (a1 - a0) * (f / Math.max(1, k.frames - 1)) : a0 + (a1 - a0) * (f / k.frames);
      sample(k.clip, Math.min(0.999, u)); c.root.rotation.y = THREE.MathUtils.degToRad(135 - 45 * dir); c.root.updateMatrixWorld(true);
      for (const [sl, w] of Object.entries(wr)) anchors[sl][dir * frames + col] = anchorAt(w, c.root, cam, ppu);
      const AP = PROTO.size && hasFace ? albParts(faceStats && col === 0 ? faceStats[dir] : null) : null, a = AP ? AP.img : pass('alb'), n = pass('nrm'), e = pass('emi'), ad = a.data, nd = n.data, ed = e.data, cls = AP && AP.cls;
      despeckle(ad, cls);
      grimPass(ad, gain, v.desat ?? 0.34, v.contrast ?? 1.18, ed, PROTO.has('grade') ? cls : null);
      if (cls && PROTO.has('grade')) faceLines(ad, cls);
      const solid = (x, y) => x >= 0 && y >= 0 && x < W && y < H && a.data[(y * W + x) * 4 + 3] > 0;
      const out = new Uint8ClampedArray(ad);
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
        const i = (y * W + x) * 4;
        if (ad[i + 3]) {
          ad[i + 3] = 255;
          // view normal (x right, y up, z to camera) → screen convention: floors ≈ (0, .3, .95), camera-facing ≈ (0, -.28, .96)
          let vx = nd[i] / 127.5 - 1, vy = nd[i + 1] / 127.5 - 1, vz = Math.max(0.05, nd[i + 2] / 127.5 - 1);
          vy = vy * 0.6 - 0.25; const l = Math.hypot(vx, vy, vz); vx /= l; vy /= l; vz /= l;
          nd[i] = (vx * 0.5 + 0.5) * 255; nd[i + 1] = (vy * 0.5 + 0.5) * 255; nd[i + 2] = vz * 255; nd[i + 3] = 255;
          const g = ed[i] > 128 ? 255 : 0; ed[i] = ed[i + 1] = ed[i + 2] = g; ed[i + 3] = 255; if (g) hasGlow = true;
        } else if (solid(x + 1, y) || solid(x - 1, y) || solid(x, y + 1) || solid(x, y - 1)) {
          out[i] = INK[0]; out[i + 1] = INK[1]; out[i + 2] = INK[2]; out[i + 3] = 255;             // outline
          nd[i] = 127; nd[i + 1] = 91; nd[i + 2] = 245; nd[i + 3] = 255; ed[i] = ed[i + 1] = ed[i + 2] = 0; ed[i + 3] = 255;
        } else { nd[i] = nd[i + 1] = nd[i + 2] = 0; nd[i + 3] = 255; ed[i] = ed[i + 1] = ed[i + 2] = 0; ed[i + 3] = 255; }
        if (ad[i + 3]) { out[i] = ad[i]; out[i + 1] = ad[i + 1]; out[i + 2] = ad[i + 2]; out[i + 3] = 255; }
      }
      ax.putImageData(new ImageData(out, W, H), col * W, dir * H);
      nx.putImageData(n, col * W, dir * H); ex.putImageData(e, col * W, dir * H);
    }
  }
  let start = 0; const meta = { cw: W, ch: H, ax: Math.floor(W / 2), ay: H - 6,   // (a whole pixel: an odd cell at another px made it 56.5, and the renderer's buffer index fractional)
    dirs: 8, frames, dirOrder: 'screen', ...(stride ? { stride } : {}), clips: {}, ...(Object.keys(anchors).length ? { anchors: packAnchors(anchors) } : {}) };
  for (const k of clips) { meta.clips[k.key] = { start, len: k.frames, fps: k.fps, ...(k.once ? { once: true } : {}), ...(k.impact != null ? { impact: k.impact } : {}) }; start += k.frames; }
  return { meta, alb: A.toDataURL('image/png'), nrm: N.toDataURL('image/png'), emi: hasGlow ? E.toDataURL('image/png') : null, faceStats };
};
// anchors only (bake.cjs --anchors): same pose sampling and camera as bakeAtlas, no raster —
// refreshes the weapon anchors in an existing atlas's JSON in seconds
window.bakeAnchors = async (v, clips) => {
  const c = await build(v), bones = [];
  c.root.traverse((b) => { if (b.isBone) bones.push([b, b.position.clone(), b.quaternion.clone(), b.scale.clone()]); });
  const sample = (name, t) => { for (const [b, p, q, s] of bones) { b.position.copy(p); b.quaternion.copy(q); b.scale.copy(s); } pose(c, name, t, true); };
  sample('Idle', 0);
  const box = new THREE.Box3().setFromObject(c.root), ppu = TARGET_PX / (box.max.y - box.min.y);
  const cam = new THREE.OrthographicCamera(-W / 2 / ppu, W / 2 / ppu, H / 2 / ppu, -H / 2 / ppu, 0.1, 100);
  const pr = THREE.MathUtils.degToRad(30), yw = THREE.MathUtils.degToRad(45), tgt = new THREE.Vector3(0, box.min.y + (H * 0.5 - 6) / ppu, 0);
  cam.position.set(20 * Math.cos(pr) * Math.sin(yw), tgt.y + 20 * Math.sin(pr), 20 * Math.cos(pr) * Math.cos(yw)); cam.lookAt(tgt); cam.updateMatrixWorld(true);
  const walkClip = clips.find((k) => k.key === 'walk' && /^Walking_/.test(k.clip)), stride = walkClip ? strideOf(c, walkClip.clip, ppu, sample) : null;   // (the party's run has flight and no clean plant: the renderer keeps its 4.5)
  const wr = weaponRig(c, v), anchors = {}, frames = clips.reduce((n, k) => n + k.frames, 0);
  for (const k of Object.keys(wr)) anchors[k] = [];
  for (let dir = 0; dir < 8; dir++) {
    let col = 0;
    for (const k of clips) for (let f = 0; f < k.frames; f++, col++) {
      const a0 = k.from ?? 0, a1 = k.to ?? 1, u = k.once ? a0 + (a1 - a0) * (f / Math.max(1, k.frames - 1)) : a0 + (a1 - a0) * (f / k.frames);
      sample(k.clip, Math.min(0.999, u)); c.root.rotation.y = THREE.MathUtils.degToRad(135 - 45 * dir); c.root.updateMatrixWorld(true);
      for (const [sl, w] of Object.entries(wr)) anchors[sl][dir * frames + col] = anchorAt(w, c.root, cam, ppu);
    }
  }
  return { frames, stride, anchors: packAnchors(anchors), info: Object.fromEntries(Object.entries(wr).map(([k, w]) => [k, { tip: w.tip.toArray().map((n) => +n.toFixed(3)), len: +w.len.toFixed(3) }])) };
};
// dev probe: where the weapon meshes hang in each rig (tools/actor-lab weapon anchors)
window.probeWeapons = async (v) => {
  const c = await build(v), out = [];
  c.root.traverse((o) => { if (o.isMesh && o.visible) { const chain = []; let q = o.parent; while (q && chain.length < 4) { chain.push(q.name); q = q.parent; } out.push(`${o.name}${o.isSkinnedMesh ? ' [skinned]' : ''} <- ${chain.join(' <- ')}`); } });
  return out;
};
// ─── PORTRAITS (bake.cjs → <actor>.face.png): head and shoulders for the windows (party cards,
// the sheet, dialogue), rendered LIT — the UI has no deferred light — from the same build as the
// atlas, so it is the same person. The figure turns PYAW toward the camera (a three-quarter
// view), the camera sits a little above eye level, and the frame is fixed to the head bone: the
// head fills the top ~55 %, the shoulders the rest. Supersampled SS× and area-averaged in ~linear
// light, a light grade (less desaturation than the world pass: faces need their warmth), then the
// same 1 px ink outline as the atlas.
const PW = 96, PH = 112, PSS = 4;
function portraitLights(s) {
  s.add(new THREE.HemisphereLight(0xb8a8d8, 0x2a2030, 1.25));
  const key = new THREE.DirectionalLight(0xffd4a8, 2.3); key.position.set(-1.6, 1.8, 2.4); s.add(key);        // warm key, front-left, above
  const fill = new THREE.DirectionalLight(0x8fa4ff, 0.55); fill.position.set(2.2, 0.4, 1.2); s.add(fill);       // cool fill, right
  const rim = new THREE.DirectionalLight(0xc0a0ff, 1.6); rim.position.set(1.5, 2.2, -2.6); s.add(rim);          // rim from behind
}
// one lit shot of a posed build through `cam` at pw × ph: supersampled ss×, graded, outlined → PNG data URL
function litShot(c, cam, pw, ph, ss, o) {
  const s = new THREE.Scene(); s.add(c.root); portraitLights(s);
  R.setSize(pw * ss, ph * ss); R.toneMapping = THREE.ACESFilmicToneMapping; R.toneMappingExposure = o.exposure ?? 1.0; R.outputColorSpace = THREE.SRGBColorSpace;
  R.setClearColor(0, 0); R.render(s, cam);
  const big = document.createElement('canvas'); big.width = pw * ss; big.height = ph * ss; const bx = big.getContext('2d', { willReadFrequently: true }); bx.drawImage(R.domElement, 0, 0);
  const b = bx.getImageData(0, 0, pw * ss, ph * ss).data, out = new ImageData(pw, ph), d = out.data, BW = pw * ss;
  for (let y = 0; y < ph; y++) for (let x = 0; x < pw; x++) {
    let n = 0, r = 0, g = 0, bl = 0;
    for (let sy = 0; sy < ss; sy++) for (let sx = 0; sx < ss; sx++) { const i = ((y * ss + sy) * BW + x * ss + sx) * 4; if (b[i + 3] < 128) continue; n++; r += b[i] * b[i]; g += b[i + 1] * b[i + 1]; bl += b[i + 2] * b[i + 2]; }
    if (n * 2 < ss * ss) continue;
    const j = (y * pw + x) * 4; d[j] = Math.sqrt(r / n); d[j + 1] = Math.sqrt(g / n); d[j + 2] = Math.sqrt(bl / n); d[j + 3] = 255;
  }
  grimPass(d, o.gain ?? 1, o.desat ?? 0.14, o.contrast ?? 1.08);
  const ink = new Uint8ClampedArray(d), solid = (x, y) => x >= 0 && y >= 0 && x < pw && y < ph && d[(y * pw + x) * 4 + 3] > 0;
  for (let y = 0; y < ph; y++) for (let x = 0; x < pw; x++) { const i = (y * pw + x) * 4;
    if (!d[i + 3] && (solid(x + 1, y) || solid(x - 1, y) || solid(x, y + 1) || solid(x, y - 1)) && (o.inkBottom || y < ph - 1)) { ink[i] = INK[0]; ink[i + 1] = INK[1]; ink[i + 2] = INK[2]; ink[i + 3] = 255; } }
  const cv = document.createElement('canvas'); cv.width = pw; cv.height = ph; cv.getContext('2d').putImageData(new ImageData(ink, pw, ph), 0, 0);
  R.setSize(W, H); R.toneMapping = THREE.ACESFilmicToneMapping; R.toneMappingExposure = 1.05;
  return cv.toDataURL('image/png');
}
const orthoAt = (cx, cy, spanW, spanH, pitchDeg) => {
  const cam = new THREE.OrthographicCamera(-spanW / 2, spanW / 2, spanH / 2, -spanH / 2, 0.1, 100), pitch = THREE.MathUtils.degToRad(pitchDeg);
  cam.position.set(cx, cy + 20 * Math.sin(pitch), 20 * Math.cos(pitch)); cam.lookAt(cx, cy, 0); cam.updateMatrixWorld(true); return cam;
};
window.renderPortrait = async (v, o = {}) => {
  const c = await build(v), pw = o.w || PW, ph = o.h || PH, ss = o.ss || PSS;
  pose(c, 'Idle', o.t ?? 0, o.heroic ?? true);
  c.root.rotation.y = THREE.MathUtils.degToRad(o.yaw ?? 22); c.root.updateMatrixWorld(true);
  const head = findNode(c.root, 'head');
  const top = head.localToWorld(new THREE.Vector3(0, 1.08, 0)), chin = head.localToWorld(new THREE.Vector3(0, 0, 0.1));
  const hh = top.y - chin.y, span = hh / (o.head ?? 0.6);                           // the head is ~60 % of the frame's height
  const cy = top.y + hh * (o.over ?? 0.1) - span / 2, cx = (top.x + chin.x) / 2;
  return litShot(c, orthoAt(cx, cy, span * pw / ph, span, o.pitch ?? 8), pw, ph, ss, o);
};
// ─── FIGURES (bake.cjs → <actor>.fig.png): the whole figure for the character window, lit like
// the portraits, in the actor's own pose (bake.json `figure.pose`: a guard, a raised staff…),
// turned `yaw` toward the camera. Framed on the rest pose's bounds (the figure fills 80 % of the
// height, feet 7 % above the bottom in every figure, where the window's ground shadow sits). FW × FH at `scale` (2 = crisp on
// phones), supersampled 3×.
const FW = 176, FH = 204;
window.renderFigure = async (v, o = {}) => {
  const c = await build(v), k = o.scale || 2, pw = FW * k, ph = FH * k, ss = o.ss || 3;
  // the frame is fixed from the rest pose (so a raised staff doesn't shrink the figure), feet at
  // the same line in every figure; then the pose
  const bones = []; c.root.traverse((b) => { if (b.isBone) bones.push([b, b.position.clone(), b.quaternion.clone(), b.scale.clone()]); });
  pose(c, 'Idle', 0, true); c.root.rotation.y = THREE.MathUtils.degToRad(o.yaw ?? 24); c.root.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(c.root), spanH = (box.max.y - box.min.y) / 0.8, spanW = spanH * pw / ph;
  const cy = box.min.y - spanH * 0.07 + spanH / 2, cx = (box.min.x + box.max.x) / 2;
  for (const [b, p, q, sc] of bones) { b.position.copy(p); b.quaternion.copy(q); b.scale.copy(sc); }
  const [clip, t] = o.pose || ['Idle', 0];
  pose(c, clip, t, true); c.root.rotation.y = THREE.MathUtils.degToRad(o.yaw ?? 24); c.root.updateMatrixWorld(true);
  return litShot(c, orthoAt(cx, cy, spanW, spanH, o.pitch ?? 10), pw, ph, ss, { ...o, inkBottom: true });
};
// the face board (faces.cjs): every preset, then each part's options on one plain figure, labelled
window.renderFaceBoard = async (o = {}) => {
  const FACES_ = await (await fetch('./faces.json')).json(), K = await import('./faces.js');
  const body = { id: 'board', model: 'Rogue', show: [] }, base = { skin: 'fair', hair: 'crop', hairColor: 'brown', brows: 'straight', eyes: 'round', iris: 'brown', mouth: 'line' };
  const rows = [['presets', Object.entries(FACES_).map(([k, f]) => [k, f, /Hooded|own/.test(f.skull || '') ? 'Rogue_Hooded' : null])]];
  for (const [knob, opts] of Object.entries(K.OPTIONS)) rows.push([knob, opts.map((x) => [String(x ?? 'none'), knob === 'marks' ? { ...base, marks: [x] } : { ...base, [knob]: x }, null])]);
  const cw = o.cw || 96, ch = o.ch || 112, sc = o.scale || 2, pad = 6, lab = 16, head = 22, cols = Math.max(...rows.map((r) => r[1].length));
  const board = document.createElement('canvas'); board.width = pad + cols * (cw * sc + pad); board.height = rows.reduce((n, r) => n + head + ch * sc + lab + pad, pad);
  const x = board.getContext('2d'); x.fillStyle = '#17131e'; x.fillRect(0, 0, board.width, board.height); x.imageSmoothingEnabled = false;
  let y = pad;
  for (const [name, cells] of rows) {
    x.fillStyle = '#f0c880'; x.font = '600 15px Georgia, serif'; x.fillText(name, pad, y + 16); y += head;
    for (let i = 0; i < cells.length; i++) {
      const [label, f, model] = cells[i], img = new Image();
      img.src = await window.renderPortrait({ ...body, model: model || (f.skull === 'own' ? 'Rogue_Hooded' : 'Rogue'), face: f }, { w: cw, h: ch, ss: 3 });
      await img.decode(); const cx = pad + i * (cw * sc + pad);
      x.fillStyle = '#221c2c'; x.fillRect(cx, y, cw * sc, ch * sc); x.drawImage(img, cx, y, cw * sc, ch * sc);
      x.fillStyle = '#c8bca8'; x.font = '12px ui-monospace, Menlo, monospace'; x.fillText(label, cx + 2, y + ch * sc + 12);
    }
    y += ch * sc + lab + pad;
  }
  return board.toDataURL('image/png');
};
// dev probe: the head mesh and the head-bone accessories, as boxes in head-bone space (bind pose)
window.probeHead = async (model) => {
  const g = await load(`./models/${model}.glb`), root = g.scene; root.updateMatrixWorld(true);
  const head = findNode(root, 'head'), inv = head.matrixWorld.clone().invert(), out = { headBoneWorld: head.getWorldPosition(new THREE.Vector3()).toArray().map((n) => +n.toFixed(3)) };
  root.traverse((o) => { if (!o.isMesh) return;
    if (!(o.isSkinnedMesh ? /Head/.test(o.name) : o.parent === head)) return;
    const pos = o.geometry.attributes.position, p = new THREE.Vector3(), box = new THREE.Box3();
    const m = o.isSkinnedMesh ? inv.clone().multiply(o.matrixWorld) : inv.clone().multiply(o.matrixWorld);
    for (let i = 0; i < pos.count; i++) box.expandByPoint(p.fromBufferAttribute(pos, i).applyMatrix4(m));
    out[o.name] = [box.min.toArray().map((n) => +n.toFixed(3)), box.max.toArray().map((n) => +n.toFixed(3))]; });
  return out;
};
window.ready = true;
