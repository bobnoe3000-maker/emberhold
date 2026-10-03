// iconlab.js — item icons from the same KayKit CC0 kits the figures wear, so an item's icon
// and the weapon in the figure's hand are one object. Each icon isolates one accessory mesh
// (or a small procedural trinket), turns it to the classic RPG diagonal (grip bottom-left,
// point top-right) with a 3/4 tilt, lights it warm key + cool rim, renders at 4× and
// area-averages down, then adds a 1 px ink outline. Driven by icons.cjs (icons.json). A spec's
// `swatches` repaints the kit texture the way the figure's variant does (props.js), and the
// cleric's mace is the same code-built prop the figure holds.
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { PROPS, repaint } from './props.js';

const SS = 4, INK = [10, 7, 16];
const R = new THREE.WebGLRenderer({ antialias: false, alpha: true, preserveDrawingBuffer: true });
R.setPixelRatio(1); R.outputColorSpace = THREE.SRGBColorSpace; R.toneMapping = THREE.ACESFilmicToneMapping; R.toneMappingExposure = 1.15;
document.body.appendChild(R.domElement);
const loader = new GLTFLoader(), files = new Map();
const load = (u) => { if (!files.has(u)) files.set(u, new Promise((res, rej) => loader.load(u, res, undefined, rej))); return files.get(u); };
const std = (color, o = {}) => new THREE.MeshStandardMaterial({ color, metalness: 0.6, roughness: 0.4, ...o });

// small trinkets the kits don't have
const PROC = {
  // bows: limbs on the diagonal (top-right to bottom-left), the string toward the viewer's lower right
  huntbow: () => { const g = new THREE.Group(), b = PROPS.huntbow(); b.rotation.z = Math.PI / 4; b.rotation.y = Math.PI; g.add(b); g.rotation.x = 0.2; return g; },
  longbow: () => { const g = new THREE.Group(), b = PROPS.longbow(); b.rotation.z = Math.PI / 4; b.rotation.y = Math.PI; g.add(b); g.rotation.x = 0.2; return g; },
  mace: () => { const g = new THREE.Group(), m = PROPS.mace(); m.rotation.z = -Math.PI / 4; m.rotation.y = 0.26; g.add(m); g.rotation.x = 0.3; return g; },   // grip bottom-left, head top-right
  ring: () => { const g = new THREE.Group(), gold = std(0xd9a441, { metalness: 0.95, roughness: 0.28 });
    g.add(new THREE.Mesh(new THREE.TorusGeometry(1, 0.2, 18, 56), gold));
    const set = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.4, 0.22, 16), gold); set.position.y = 1.12; g.add(set);
    const gem = new THREE.Mesh(new THREE.OctahedronGeometry(0.4), std(0xff4a26, { metalness: 0.1, roughness: 0.15, emissive: 0x6a1204 })); gem.scale.y = 0.8; gem.position.y = 1.42; g.add(gem);
    g.rotation.set(0.55, 0.5, 0.15); return g; },
  amulet: () => { const g = new THREE.Group(), silver = std(0xb8c0cc, { metalness: 0.95, roughness: 0.3 }), gold = std(0xd9a441, { metalness: 0.95, roughness: 0.3 });
    const chain = new THREE.Mesh(new THREE.TorusGeometry(1.05, 0.06, 8, 64), silver); chain.scale.y = 1.15; chain.position.y = 0.55; chain.rotation.x = 0.9; g.add(chain);
    const disc = new THREE.Mesh(new THREE.CylinderGeometry(0.62, 0.62, 0.18, 28), gold); disc.rotation.x = Math.PI / 2; disc.position.y = -0.7; g.add(disc);
    const gem = new THREE.Mesh(new THREE.SphereGeometry(0.34, 20, 14), std(0x3f8cff, { metalness: 0.1, roughness: 0.12, emissive: 0x0a2a70 })); gem.scale.z = 0.6; gem.position.set(0, -0.7, 0.14); g.add(gem);
    g.rotation.set(0.25, -0.35, 0); return g; },
  charm: () => { const g = new THREE.Group(), bone = std(0xe6dcc4, { metalness: 0, roughness: 0.7 }), cord = std(0x6a3a22, { metalness: 0, roughness: 0.9 });
    const fang = new THREE.Mesh(new THREE.ConeGeometry(0.36, 1.9, 14), bone); fang.rotation.z = Math.PI; fang.position.y = -0.55; fang.scale.x = 0.8; g.add(fang);
    const loop = new THREE.Mesh(new THREE.TorusGeometry(0.34, 0.09, 8, 24), cord); loop.position.y = 0.66; g.add(loop);
    for (const [x, y] of [[-0.55, 0.25], [0.55, 0.25]]) { const b = new THREE.Mesh(new THREE.SphereGeometry(0.2, 12, 10), std(0x9a2a2a, { metalness: 0.1, roughness: 0.3 })); b.position.set(x, y, 0); g.add(b); }
    g.rotation.set(0.2, 0.4, -0.35); return g; },
  // the Homeward Scroll: rolled vellum on two turned knobs, tied with a ribbon under a red wax seal
  scroll: () => { const g = new THREE.Group(), vellum = std(0xe8dcb8, { metalness: 0, roughness: 0.85 }), wood = std(0x6a4426, { metalness: 0, roughness: 0.6 }), wax = std(0xb02a20, { metalness: 0.1, roughness: 0.35, emissive: 0x300604 });
    const roll = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 2.2, 24), vellum); roll.rotation.z = Math.PI / 2; g.add(roll);
    const lip = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.04, 0.5), vellum); lip.position.set(0.1, -0.42, 0.28); lip.rotation.x = 0.5; g.add(lip);
    for (const s of [-1, 1]) { const k = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.16, 0.36, 14), wood); k.rotation.z = Math.PI / 2; k.position.x = s * 1.26; g.add(k);
      const ball = new THREE.Mesh(new THREE.SphereGeometry(0.2, 12, 10), wood); ball.position.x = s * 1.48; g.add(ball); }
    const band = new THREE.Mesh(new THREE.TorusGeometry(0.44, 0.06, 8, 28), wax); band.rotation.y = Math.PI / 2; g.add(band);
    const seal = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.28, 0.1, 18), wax); seal.rotation.x = Math.PI / 2; seal.position.set(0, -0.05, 0.47); g.add(seal);
    g.rotation.set(0.35, -0.45, 0.4); return g; },
};

// the accessory as a standalone group (its meshes re-expressed relative to the node)
async function part(spec) {
  if (spec.proc) return PROC[spec.proc]();
  const out = await kitPart(spec); if (spec.swatches) repaint(out, spec.swatches); return out;
}
async function kitPart(spec) {
  const g = (await load(`./models/${spec.file}`)).scene; g.updateMatrixWorld(true);
  const names = spec.meshes || [spec.mesh], out = new THREE.Group();
  const first = spec.mesh || spec.meshes ? g.getObjectByName(names[0]) : g; if (!first) throw new Error('no mesh ' + names[0]);
  const inv = first.matrixWorld.clone().invert();
  for (const nm of spec.mesh || spec.meshes ? names : [null]) {
    const node = nm ? g.getObjectByName(nm) : g; if (!node) throw new Error('no mesh ' + nm);
    node.traverse((o) => { if (!o.isMesh) return; const m = new THREE.Mesh(o.geometry, o.material); m.matrixAutoUpdate = false; m.matrix.copy(inv.clone().multiply(o.matrixWorld)); out.add(m); });
  }
  if (spec.below != null) {                       // keep only the triangles below a height fraction (legs → boots)
    out.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(out), cut = box.min.y + (box.max.y - box.min.y) * spec.below, v = new THREE.Vector3();
    for (const m of out.children) {
      const src = m.geometry.index ? m.geometry.toNonIndexed() : m.geometry, pos = src.attributes.position, keep = [];
      for (let t = 0; t < pos.count; t += 3) { let ok = true; for (let k = 0; k < 3; k++) if (v.fromBufferAttribute(pos, t + k).applyMatrix4(m.matrix).y > cut) ok = false; if (ok) keep.push(t); }
      const geo = new THREE.BufferGeometry();
      for (const [name, at] of Object.entries(src.attributes)) { const arr = new at.array.constructor(keep.length * 3 * at.itemSize);
        keep.forEach((t, i) => { for (let k = 0; k < 3 * at.itemSize; k++) arr[i * 3 * at.itemSize + k] = at.array[t * at.itemSize + k]; }); geo.setAttribute(name, new THREE.BufferAttribute(arr, at.itemSize, at.normalized)); }
      m.geometry = geo;
    }
  }
  return out;
}

window.bakeIcon = async (spec, S = 96) => {
  const obj = await part(spec), pivot = new THREE.Group(); pivot.add(obj); pivot.updateMatrixWorld(true);
  if (!spec.proc) {
    // long axis → the screen diagonal, far end (the point, away from the grip at the origin) top-right
    const pts = []; obj.traverse((o) => { if (!o.isMesh) return; const p = o.geometry.attributes.position, v = new THREE.Vector3();
      for (let i = 0; i < p.count; i += 3) pts.push(v.fromBufferAttribute(p, i).applyMatrix4(o.matrixWorld).clone()); });
    const box = new THREE.Box3().setFromPoints(pts), size = box.getSize(new THREE.Vector3()), dims = ['x', 'y', 'z'].sort((a, b) => size[b] - size[a]);
    if (spec.rot) obj.rotation.set(...spec.rot.map((d) => THREE.MathUtils.degToRad(d)));
    else if (size[dims[0]] > size[dims[1]] * 1.45) {
      const ax = dims[0], far = Math.abs(box.max[ax]) >= Math.abs(box.min[ax]) ? 1 : -1, from = new THREE.Vector3(); from[ax] = far * (spec.flip ? -1 : 1);
      const q = new THREE.Quaternion().setFromUnitVectors(from, new THREE.Vector3(1, 1, 0).normalize());
      const roll = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 1, 0).normalize(), THREE.MathUtils.degToRad(spec.roll ?? 0));
      obj.quaternion.copy(roll.multiply(q));
      pivot.rotation.set(THREE.MathUtils.degToRad(spec.tilt ?? 18), THREE.MathUtils.degToRad(-12), 0);
    } else obj.rotation.set(THREE.MathUtils.degToRad(15), THREE.MathUtils.degToRad(-30), 0);
  }
  if (spec.spin) pivot.rotation.z += THREE.MathUtils.degToRad(spec.spin);
  pivot.updateMatrixWorld(true);
  const bb = new THREE.Box3().setFromObject(pivot), c = bb.getCenter(new THREE.Vector3()), sz = bb.getSize(new THREE.Vector3());
  const half = Math.max(sz.x, sz.y) / 2 * (spec.pad ?? 1.1);
  const cam = new THREE.OrthographicCamera(c.x - half, c.x + half, c.y + half, c.y - half, -100, 100); cam.position.set(0, 0, 50); cam.lookAt(0, 0, 0);
  cam.left = c.x - half; cam.right = c.x + half; cam.top = c.y + half; cam.bottom = c.y - half; cam.position.set(0, 0, 50); cam.updateProjectionMatrix();
  const scene = new THREE.Scene(); scene.add(pivot);
  scene.add(new THREE.HemisphereLight(0xfff0dc, 0x2a2436, 1.5));
  const key = new THREE.DirectionalLight(0xffe2b8, 2.6); key.position.set(-2, 3, 4); scene.add(key);
  const rim = new THREE.DirectionalLight(0x9ab8ff, 1.6); rim.position.set(3, -1, -2); scene.add(rim);
  const fill = new THREE.DirectionalLight(0xffffff, 0.5); fill.position.set(0, 0, 5); scene.add(fill);
  R.setSize(S * SS, S * SS); R.setClearColor(0, 0); R.render(scene, cam);
  const big = document.createElement('canvas'); big.width = big.height = S * SS; const bx = big.getContext('2d', { willReadFrequently: true }); bx.drawImage(R.domElement, 0, 0);
  const b = bx.getImageData(0, 0, S * SS, S * SS).data, out = new ImageData(S, S), o = out.data;
  for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {                      // area-average, premultiplied
    let r = 0, g = 0, bl = 0, a = 0;
    for (let sy = 0; sy < SS; sy++) for (let sx = 0; sx < SS; sx++) { const i = ((y * SS + sy) * S * SS + x * SS + sx) * 4, al = b[i + 3] / 255; r += b[i] * al; g += b[i + 1] * al; bl += b[i + 2] * al; a += al; }
    const j = (y * S + x) * 4; if (a > 0) { o[j] = r / a; o[j + 1] = g / a; o[j + 2] = bl / a; } o[j + 3] = (a / (SS * SS)) * 255;
  }
  const src = new Uint8ClampedArray(o), A = (x, y) => (x < 0 || y < 0 || x >= S || y >= S ? 0 : src[(y * S + x) * 4 + 3]);
  for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {                      // ink outline under soft edges
    const j = (y * S + x) * 4; if (src[j + 3] > 200) continue;
    const n = Math.max(A(x + 1, y), A(x - 1, y), A(x, y + 1), A(x, y - 1), A(x + 1, y + 1) * 0.7, A(x - 1, y - 1) * 0.7, A(x + 1, y - 1) * 0.7, A(x - 1, y + 1) * 0.7);
    if (n < 60) continue; const k = src[j + 3] / 255, ia = Math.min(255, n * 1.1);
    o[j] = src[j] * k + INK[0] * (1 - k); o[j + 1] = src[j + 1] * k + INK[1] * (1 - k); o[j + 2] = src[j + 2] * k + INK[2] * (1 - k); o[j + 3] = Math.max(src[j + 3], ia);
  }
  const cv = document.createElement('canvas'); cv.width = cv.height = S; cv.getContext('2d').putImageData(out, 0, 0);
  return cv.toDataURL('image/png');
};
window.ready = true;
