// creatureslab.js — the creatures' model sheet (docs/creatures-proposal.md): each kind through its clips from the game's
// camera (iso, 45° round, 35° down), beside the KayKit knight at the scale the cast gives them, in a dusky room's light.
// Driven by creatures-sheet.cjs (window.sheet()); open creatures.html served from this folder to look at it live.
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import * as SkeletonUtils from 'three/addons/utils/SkeletonUtils.js';
import { buildCreature } from './creatures.js';
import { build, pose, fitPpu } from './figure.js';

const W = 220, H = 200, gl = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
gl.setSize(W, H); gl.setPixelRatio(2); gl.outputColorSpace = THREE.SRGBColorSpace; gl.toneMapping = THREE.ACESFilmicToneMapping; gl.toneMappingExposure = 1.15;
gl.shadowMap.enabled = true; document.body.appendChild(gl.domElement);
const scene = new THREE.Scene(); scene.background = new THREE.Color('#1c1822');
scene.add(new THREE.HemisphereLight(0x8a90c0, 0x2a2018, 0.9));
const sun = new THREE.DirectionalLight(0xffd6a0, 2.2); sun.position.set(-2, 4, 2.5); sun.castShadow = true; sun.shadow.mapSize.set(1024, 1024);
Object.assign(sun.shadow.camera, { left: -2, right: 2, top: 2, bottom: -2 }); scene.add(sun);
const torch = new THREE.PointLight(0xff9a45, 3, 4, 1.5); torch.position.set(1.2, 1.1, 1.2); scene.add(torch);
const floor = new THREE.Mesh(new THREE.PlaneGeometry(8, 8), new THREE.MeshStandardMaterial({ color: '#3a3430', roughness: 1 })); floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; scene.add(floor);
const cam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.01, 50);
const aim = (cx, cy, half) => { const az = Math.PI / 4, el = (35 * Math.PI) / 180, d = 10; cam.position.set(cx + d * Math.cos(el) * Math.sin(az), cy + d * Math.sin(el), d * Math.cos(el) * Math.cos(az)); cam.left = -half * W / H; cam.right = half * W / H; cam.top = half; cam.bottom = -half; cam.updateProjectionMatrix(); cam.lookAt(cx, cy, 0); };
const loader = new GLTFLoader(), load = (u) => loader.loadAsync(u).then((g) => ({ scene: SkeletonUtils.clone(g.scene), animations: g.animations }));
const shoot = () => { gl.render(scene, cam); return gl.domElement.toDataURL('image/png'); };
const show = (c) => c.root.traverse((o) => { if (o.isMesh) o.castShadow = true; });

window.sheet = async (rows) => {
  const out = [], knight = await build({ model: 'Knight', show: ['1H_Sword', 'Round_Shield', 'Knight_Helmet', 'Knight_Cape'] }, { load, faces: async () => ({}) });
  pose(knight, 'Idle', 0, true); const kb = new THREE.Box3().setFromObject(knight.root), kh = kb.max.y - kb.min.y; show(knight);
  for (const row of rows) {
    const c = buildCreature(row.spec); show(c); c.root.scale.setScalar(kh); scene.add(c.root);   // (a man stands 1: at the knight's height)
    const frames = [];
    // the lineup: the knight and the creature, side by side
    knight.root.position.set(-0.55 * kh, 0, -0.3 * kh); scene.add(knight.root); c.root.position.set(0.35 * kh, 0, 0); c.root.rotation.y = -0.5;
    pose(c, 'Idle', 0, false); aim(0, 0.45 * kh, 0.62 * kh); frames.push({ label: 'beside a man', img: shoot() });
    scene.remove(knight.root); c.root.position.set(0, 0, 0); c.root.rotation.y = row.yaw ?? -0.6;
    for (const [clipName, ts] of row.shots) for (const t of ts) { pose(c, clipName, t, false); aim(0, row.cy * kh, row.half * kh); frames.push({ label: `${clipName} ${t.toFixed(2)}`, img: shoot() }); }
    scene.remove(c.root);
    let tris = 0, draws = 0, bones = 0; c.root.traverse((o) => { if (o.isMesh) { draws++; tris += o.geometry.attributes.position.count / 3; } if (o.isBone) bones++; });
    out.push({ name: row.name, frames, tris, draws, bones, clips: c.clips.map((a) => `${a.name} ${a.duration}s`) });
  }
  return out;
};
window.ready = true;
