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
window.ready = true;
