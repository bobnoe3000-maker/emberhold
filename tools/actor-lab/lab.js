// lab.js — render KayKit CC0 characters exactly as Emberhold's camera sees them:
// orthographic, 30° pitch / 45° yaw (the 2:1 dimetric of iso.js), sized so the
// figure is TARGET_PX tall at native resolution, no AA. Driven by render.cjs.
//
// Variant knobs (see variants.json): which accessory meshes to show (loadout),
// weapons to parent onto hand bones, a CSS-filter texture recolor (enemy NPCs
// reuse hero models), glowing-eye color, pose clip, and stock vs HEROIC
// proportions. Heroic = smaller head + joints pushed outward to lengthen legs,
// arms and torso without thickening them; applied AFTER each pose is sampled,
// because the clips key scale + translation on every bone.
//
// Gotcha: GLTFLoader strips '.' from node names ('handslot.r' → 'handslotr',
// 'lowerleg.l' → 'lowerlegl'); findNode()/applyHeroic() match both spellings.
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
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
const HEROIC = { scale: { head: 0.62 }, reach: { spine: 1.2, chest: 1.18, head: 1.1,
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
async function build(v) {
  const g = await load(`./models/${v.model}.glb`), root = g.scene;
  const acc = ACC[v.model] || [];
  root.traverse((o) => { if (o.isMesh) { o.frustumCulled = false; if (acc.includes(o.name) && !(v.show || []).includes(o.name)) o.visible = false; } });
  for (const [bone, file] of Object.entries(v.attach || {})) { const w = await load(`./models/${file}`); findNode(root, bone)?.add(w.scene); }
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
}
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
function grimPass(d, gain = 1) {                         // 42% desat, cool tint, value gain; hot pixels (eyes) stay hot
  for (let i = 0; i < d.length; i += 4) { if (!d[i + 3]) continue;
    const r = d[i], g = d[i + 1], b = d[i + 2]; if (Math.max(r, g, b) > 225) continue;
    const L = 0.3 * r + 0.59 * g + 0.11 * b, k = 0.42;
    d[i] = (r + (L - r) * k) * 0.92 * gain; d[i + 1] = (g + (L - g) * k) * 0.87 * gain; d[i + 2] = (b + (L - b) * k) * gain; }
}
window.bakeAtlas = async (v, clips, gain = 1) => {
  const c = await build(v), bones = [];
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
  const mats = { alb: new Map(), emi: new Map() }, black = new THREE.MeshBasicMaterial({ color: 0 }), white = new THREE.MeshBasicMaterial({ color: 0xffffff });
  c.root.traverse((o) => { if (!o.isMesh) return; const eyes = /Eyes/.test(o.name), m = o.material;
    mats.alb.set(o, eyes ? new THREE.MeshBasicMaterial({ color: v.eyes || 0xffffff }) : new THREE.MeshBasicMaterial({ map: m.map, color: m.color }));
    mats.emi.set(o, eyes ? white : black); });
  const nrmMat = new THREE.MeshNormalMaterial();
  const frames = clips.reduce((n, k) => n + k.frames, 0), cols = frames, rows = 8;
  const mk = () => { const cv = document.createElement('canvas'); cv.width = W * cols; cv.height = H * rows; return cv; };
  const A = mk(), N = mk(), E = mk(), ax = A.getContext('2d'), nx = N.getContext('2d'), ex = E.getContext('2d');
  nx.fillStyle = '#000'; nx.fillRect(0, 0, N.width, N.height); ex.fillStyle = '#000'; ex.fillRect(0, 0, E.width, E.height);
  const tmp = document.createElement('canvas'); tmp.width = W; tmp.height = H; const tx = tmp.getContext('2d', { willReadFrequently: true });
  const pass = (kind) => {
    if (kind === 'nrm') { scene.overrideMaterial = nrmMat; R.outputColorSpace = THREE.LinearSRGBColorSpace; }
    else { scene.overrideMaterial = null; R.outputColorSpace = THREE.SRGBColorSpace; c.root.traverse((o) => { if (o.isMesh) o.material = mats[kind].get(o); }); }
    R.toneMapping = THREE.NoToneMapping; R.setClearColor(0, 0); R.render(scene, cam);
    tx.clearRect(0, 0, W, H); tx.drawImage(R.domElement, 0, 0); return tx.getImageData(0, 0, W, H);
  };
  let hasGlow = false;
  for (let dir = 0; dir < 8; dir++) {
    c.root.rotation.y = THREE.MathUtils.degToRad(135 - 45 * dir);
    let col = 0;
    for (const k of clips) for (let f = 0; f < k.frames; f++, col++) {
      // loops sample f/N (the cycle wraps); one-shots (k.once) span [from, to] inclusive so the last frame is the end pose
      const a0 = k.from ?? 0, a1 = k.to ?? 1, u = k.once ? a0 + (a1 - a0) * (f / Math.max(1, k.frames - 1)) : a0 + (a1 - a0) * (f / k.frames);
      sample(k.clip, Math.min(0.999, u)); c.root.rotation.y = THREE.MathUtils.degToRad(135 - 45 * dir); c.root.updateMatrixWorld(true);
      const a = pass('alb'), n = pass('nrm'), e = pass('emi'), ad = a.data, nd = n.data, ed = e.data;
      grimPass(ad, gain);
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
  let start = 0; const meta = { cw: W, ch: H, ax: W / 2, ay: H - 6, dirs: 8, frames, dirOrder: 'screen', clips: {} };
  for (const k of clips) { meta.clips[k.key] = { start, len: k.frames, fps: k.fps, ...(k.once ? { once: true } : {}), ...(k.impact != null ? { impact: k.impact } : {}) }; start += k.frames; }
  return { meta, alb: A.toDataURL('image/png'), nrm: N.toDataURL('image/png'), emi: hasGlow ? E.toDataURL('image/png') : null };
};
window.ready = true;
