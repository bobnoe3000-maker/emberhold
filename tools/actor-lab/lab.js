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
  for (const [bone, name] of Object.entries(v.hold || {})) { const p = PROPS[name](); p.position.y = 0.033; findNode(root, bone)?.add(p); }   // sits like the kits' 1H weapons
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
// grim pass: partial desat, a cool (not magenta) tint, value gain, and a gentle contrast
// S-curve around mid-grey so armour plates, cloth and skin separate at 56 px. Hot pixels
// (the emissive eye mask) stay hot — bright texture (fur trim, bone) is graded like the rest. Earlier tint (0.92, 0.87, 1.0) cut green hardest → a magenta
// cast that dusk light turned pink.
function grimPass(d, gain = 1, desat = 0.34, contrast = 1.18, glow = null) {
  for (let i = 0; i < d.length; i += 4) { if (!d[i + 3]) continue;
    const r = d[i], g = d[i + 1], b = d[i + 2]; if (glow && glow[i] > 128) continue;   // only the glowing eyes stay hot
    const L = 0.3 * r + 0.59 * g + 0.11 * b;
    const c = (v) => Math.max(0, Math.min(255, 128 + (v - 128) * contrast));
    d[i] = c(r + (L - r) * desat) * 0.9 * gain; d[i + 1] = c(g + (L - g) * desat) * 0.91 * gain; d[i + 2] = c(b + (L - b) * desat) * 0.98 * gain; }
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
  const wr = weaponRig(c, v), anchors = {};
  for (const k of Object.keys(wr)) anchors[k] = [];
  const mats = { alb: new Map(), emi: new Map() }, black = new THREE.MeshBasicMaterial({ color: 0 }), white = new THREE.MeshBasicMaterial({ color: 0xffffff });
  c.root.traverse((o) => { if (!o.isMesh) return; const eyes = /Eyes/.test(o.name), m = o.material;
    // eyes glow only on figures that ask for it (skeletons); heroes keep their painted eyes —
    // a flat white eye mesh read as a white "grin" through the knight's visor
    const glow = eyes && v.eyes;
    mats.alb.set(o, glow ? new THREE.MeshBasicMaterial({ color: v.eyes }) : new THREE.MeshBasicMaterial({ map: m.map, color: m.color }));
    mats.emi.set(o, glow ? white : black); });
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
  const despeckle = (d) => {
    const src = new Uint8ClampedArray(d), at = (x, y) => (x >= 0 && y >= 0 && x < W && y < H && src[(y * W + x) * 4 + 3] ? (y * W + x) * 4 : -1);
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const i = at(x, y); if (i < 0) continue;
      const ns = []; for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) { if (!dx && !dy) continue; const k = at(x + dx, y + dy); if (k >= 0) ns.push(k); }
      if (ns.length < 6) continue;                                          // edges and thin parts keep their pixels
      const dist = (k) => Math.abs(src[k] - src[i]) + Math.abs(src[k + 1] - src[i + 1]) + Math.abs(src[k + 2] - src[i + 2]);
      ns.sort((p, q) => dist(p) - dist(q));
      if (dist(ns[0]) < 54) continue;                                        // has a like neighbour: real detail
      for (let c = 0; c < 3; c++) d[i + c] = (src[ns[0] + c] + src[ns[1] + c] + src[ns[2] + c]) / 3;
    }
  };
  const pass = (kind) => {
    if (kind === 'nrm') { scene.overrideMaterial = nrmMat; R.outputColorSpace = THREE.LinearSRGBColorSpace; }
    else { scene.overrideMaterial = null; R.outputColorSpace = THREE.SRGBColorSpace; c.root.traverse((o) => { if (o.isMesh) o.material = mats[kind].get(o); }); }
    R.toneMapping = THREE.NoToneMapping; R.setClearColor(0, 0); R.render(scene, cam);
    tx.clearRect(0, 0, W * SS, H * SS); tx.drawImage(R.domElement, 0, 0); return down(tx.getImageData(0, 0, W * SS, H * SS), kind);
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
      const a = pass('alb'), n = pass('nrm'), e = pass('emi'), ad = a.data, nd = n.data, ed = e.data;
      despeckle(ad);
      grimPass(ad, gain, v.desat ?? 0.34, v.contrast ?? 1.18, ed);
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
  let start = 0; const meta = { cw: W, ch: H, ax: W / 2, ay: H - 6, dirs: 8, frames, dirOrder: 'screen', clips: {}, ...(Object.keys(anchors).length ? { anchors: packAnchors(anchors) } : {}) };
  for (const k of clips) { meta.clips[k.key] = { start, len: k.frames, fps: k.fps, ...(k.once ? { once: true } : {}), ...(k.impact != null ? { impact: k.impact } : {}) }; start += k.frames; }
  return { meta, alb: A.toDataURL('image/png'), nrm: N.toDataURL('image/png'), emi: hasGlow ? E.toDataURL('image/png') : null };
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
  return { frames, anchors: packAnchors(anchors), info: Object.fromEntries(Object.entries(wr).map(([k, w]) => [k, { tip: w.tip.toArray().map((n) => +n.toFixed(3)), len: +w.len.toFixed(3) }])) };
};
// dev probe: where the weapon meshes hang in each rig (tools/actor-lab weapon anchors)
window.probeWeapons = async (v) => {
  const c = await build(v), out = [];
  c.root.traverse((o) => { if (o.isMesh && o.visible) { const chain = []; let q = o.parent; while (q && chain.length < 4) { chain.push(q.name); q = q.parent; } out.push(`${o.name}${o.isSkinnedMesh ? ' [skinned]' : ''} <- ${chain.join(' <- ')}`); } });
  return out;
};
window.ready = true;
