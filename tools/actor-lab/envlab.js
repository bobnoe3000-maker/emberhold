// envlab.js — bake KayKit Medieval Hexagon (CC0) environment models into the
// renderer's G-sprites: albedo, screen-space normal, emissive (lit windows) and a
// per-pixel DEPTH KEY (the ground x+y, in tiles, of the surface each pixel shows)
// so actors are occluded correctly by big multi-tile buildings and trees.
// Same camera as the characters (orthographic, 30° pitch / 45° yaw — iso.js's
// 2:1 dimetric). World +X ↔ game +x (screen right-down), world +Z ↔ game +y.
// Scale: 1 model unit = UNIT_TILES game tiles.
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { makeBuilding, makeTree, makeNature } from './buildkit.js';
const R = new THREE.WebGLRenderer({ antialias: false, alpha: true, preserveDrawingBuffer: true });
R.setPixelRatio(1); document.body.appendChild(R.domElement);
const loader = new GLTFLoader(), load = (u) => new Promise((res, rej) => loader.load(u, res, undefined, rej));
const UNIT_TILES = 10, PPU = UNIT_TILES * 8 / Math.SQRT1_2;   // px per model unit (a tile axis step is 8px across)
const INK = [8, 5, 14];

window.measure = async (names) => {
  const out = {};
  for (const n of names) { const g = await load(`./models/env/${n}.gltf`), b = new THREE.Box3().setFromObject(g.scene);
    out[n] = { min: b.min.toArray(), max: b.max.toArray() }; }
  return out;
};

// DEPTH KEY = distance toward the camera in tile units: ground x+y plus 0.816 × height
// (the 30° camera: a point one tile-unit higher sits 0.816 tiles nearer). The renderer
// composes structures and actors with a "nearer wins" test on this key.
// (uFloor: the lowest height baked, in model units — just under the ground, or a stairwell's
// bottom for a bake with o.below)
const keyMat = new THREE.ShaderMaterial({
  uniforms: { uFloor: { value: -0.02 } },
  vertexShader: `varying vec3 vW; void main(){ vec4 w = modelMatrix * vec4(position,1.0); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }`,
  fragmentShader: `uniform float uFloor; varying vec3 vW; void main(){ if (vW.y < uFloor) discard; float k = (vW.x + vW.z + 0.816 * vW.y) * ${UNIT_TILES.toFixed(1)} + 128.0;
    gl_FragColor = vec4(floor(k) / 255.0, fract(k), 0.0, 1.0); }`,
});
// planar shadow: every vertex slid along the sun direction onto the ground plane
const SUN = new THREE.Vector3(-0.30, 0.81, 0.51).normalize();      // world direction TO the sun (upper left of screen)
const shadowMat = new THREE.ShaderMaterial({
  uniforms: { uSun: { value: SUN } },
  vertexShader: `uniform vec3 uSun; void main(){ vec4 w = modelMatrix * vec4(position,1.0); w.y = max(w.y, 0.0); w.xyz -= uSun * (w.y / uSun.y); w.y = 0.001; gl_Position = projectionMatrix * viewMatrix * w; }`,
  fragmentShader: `void main(){ gl_FragColor = vec4(1.0); }`,
});
const CLIP = [new THREE.Plane(new THREE.Vector3(0, 1, 0), 0.02)];   // nothing below the ground plane (but o.below: a stairwell's depth)
R.localClippingEnabled = true;
const nrmMat = new THREE.MeshNormalMaterial({ clippingPlanes: CLIP, side: THREE.DoubleSide });
keyMat.side = THREE.DoubleSide; shadowMat.side = THREE.DoubleSide;
const glowOn = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide, clippingPlanes: CLIP }), glowOff = new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.DoubleSide, clippingPlanes: CLIP });
// CUT-OUT materials (a glTF alphaMode MASK: leaf cards, petals, grass blades): the passes above are one
// material for every mesh, so a leaf card would bake as a solid quad into the normals, the depth key and the
// shadow. A cut-out mesh gets its own copy of each pass that drops the texels under its alpha cutoff.
const cutCache = new WeakMap();
function cutPass(src, kind) {
  let c = cutCache.get(src); if (!c) cutCache.set(src, (c = {}));
  if (c[kind]) return c[kind];
  const U = { uMap: { value: src.map }, uCut: { value: src.alphaTest }, uFloor: keyMat.uniforms.uFloor, uSun: { value: SUN } };
  const drop = 'if (texture2D(uMap, vUv).a < uCut) discard;';
  const VS = {
    key: 'varying vec3 vW; varying vec2 vUv; void main(){ vUv = uv; vec4 w = modelMatrix * vec4(position,1.0); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }',
    sh: 'uniform vec3 uSun; varying vec2 vUv; void main(){ vUv = uv; vec4 w = modelMatrix * vec4(position,1.0); w.y = max(w.y, 0.0); w.xyz -= uSun * (w.y / uSun.y); w.y = 0.001; gl_Position = projectionMatrix * viewMatrix * w; }',
    nrm: 'varying vec3 vN; varying vec2 vUv; varying float vY; void main(){ vUv = uv; vN = normalize(normalMatrix * normal); vY = (modelMatrix * vec4(position,1.0)).y; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
    uv: 'varying vec2 vUv; varying float vY; void main(){ vUv = uv; vY = (modelMatrix * vec4(position,1.0)).y; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
    emi: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
  };
  const FS = {
    key: `uniform sampler2D uMap; uniform float uCut, uFloor; varying vec3 vW; varying vec2 vUv; void main(){ ${drop} if (vW.y < uFloor) discard; float k = (vW.x + vW.z + 0.816 * vW.y) * ${UNIT_TILES.toFixed(1)} + 128.0; gl_FragColor = vec4(floor(k) / 255.0, fract(k), 0.0, 1.0); }`,
    sh: `uniform sampler2D uMap; uniform float uCut; varying vec2 vUv; void main(){ ${drop} gl_FragColor = vec4(1.0); }`,
    // (as MeshNormalMaterial: the view-space normal, turned to face the camera on a back face, packed 0..1)
    nrm: `uniform sampler2D uMap; uniform float uCut, uFloor; varying vec3 vN; varying vec2 vUv; varying float vY; void main(){ ${drop} if (vY < uFloor) discard; vec3 n = normalize(vN) * (gl_FrontFacing ? 1.0 : -1.0); gl_FragColor = vec4(n * 0.5 + 0.5, 1.0); }`,
    uv: `uniform sampler2D uMap; uniform float uCut, uFloor; varying vec2 vUv; varying float vY; void main(){ ${drop} if (vY < uFloor) discard; vec2 u = fract(vUv); gl_FragColor = vec4((floor(u.x * 8.0) + 0.5) / 8.0, (floor(u.y * 4.0) + 0.5) / 4.0, fract(u.y * 4.0), 1.0); }`,
    emi: `uniform sampler2D uMap; uniform float uCut; varying vec2 vUv; void main(){ ${drop} gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0); }`,
  };
  return (c[kind] = new THREE.ShaderMaterial({ uniforms: U, vertexShader: VS[kind], fragmentShader: FS[kind], side: THREE.DoubleSide }));
}

// atlas swatch id (8 × 4 gradient swatches): R = column/8, G = row/4 — used to find windows
const uvMat = new THREE.ShaderMaterial({
  uniforms: { uFloor: keyMat.uniforms.uFloor },
  vertexShader: `varying vec2 vUv; varying float vY; void main(){ vUv = uv; vY = (modelMatrix * vec4(position,1.0)).y; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
  fragmentShader: `uniform float uFloor; varying vec2 vUv; varying float vY; void main(){ if (vY < uFloor) discard; vec2 u = fract(vUv); gl_FragColor = vec4((floor(u.x * 8.0) + 0.5) / 8.0, (floor(u.y * 4.0) + 0.5) / 4.0, fract(u.y * 4.0), 1.0); }`,
});

// bake one model → { w, h, ax, ay, alb, nrm, key (dataURLs), emi, foot } ; ax/ay = pixel of the model origin
window.bakeEnv = async (name, o = {}) => {
  const root = o.nature ? makeNature(o.nature, o.seed || 1, o.variant || 0) : o.tree ? makeTree(o.tree, o.seed || 1) : o.build ? makeBuilding(o.build, o.style, o.seed || 1, !!o.faceX) : (await load(o.gltf ? `./models/${o.gltf}.gltf` : `./models/env/${name}.gltf`)).scene;   // o.gltf: a path under models/ (models/nature: the Stylized Nature MegaKit)
  if (o.rotY) root.rotation.y = o.rotY * Math.PI / 180;
  if (o.scale) root.scale.setScalar(o.scale);
  root.updateMatrixWorld(true);
  // o.below (model units): keep geometry down to that depth under the ground — a stairwell. Its
  // keys come out further than the ground's (they are); the renderer lets such a sprite through
  // the floor only inside its opening (renderer.js, `hole`).
  const below = o.below || 0; CLIP[0].constant = 0.02 + below; keyMat.uniforms.uFloor.value = -0.02 - below;
  // (a `mask` mesh — a stairwell's floor — writes depth only: it hides, and is never drawn or framed)
  const box = new THREE.Box3(); root.traverse((m) => { if (m.isMesh && !m.userData.mask) box.expandByObject(m); });
  // frame: project the 8 bbox corners with the game camera to size the canvas
  const pr = THREE.MathUtils.degToRad(30), yw = THREE.MathUtils.degToRad(45);
  const cam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 200);
  cam.position.set(50 * Math.cos(pr) * Math.sin(yw), 50 * Math.sin(pr), 50 * Math.cos(pr) * Math.cos(yw)); cam.lookAt(0, 0, 0); cam.updateMatrixWorld(true);
  const right = new THREE.Vector3(1, 0, 0).applyQuaternion(cam.quaternion), up = new THREE.Vector3(0, 1, 0).applyQuaternion(cam.quaternion);
  let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9;
  const minY = Math.max(-below, box.min.y);
  for (const X of [box.min.x, box.max.x]) for (const Y of [minY, box.max.y]) for (const Z of [box.min.z, box.max.z]) {
    const vs = [new THREE.Vector3(X, Y, Z)];
    if (o.shadow !== false) vs.push(new THREE.Vector3(X, 0, Z).addScaledVector(SUN, -Y / SUN.y));
    for (const v of vs) { const sx = v.dot(right) * PPU, sy = v.dot(up) * PPU;
      x0 = Math.min(x0, sx); x1 = Math.max(x1, sx); y0 = Math.min(y0, sy); y1 = Math.max(y1, sy); } }
  const W = Math.ceil(x1 - x0) + 4, H = Math.ceil(y1 - y0) + 4, cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
  cam.left = -W / 2 / PPU; cam.right = W / 2 / PPU; cam.top = H / 2 / PPU; cam.bottom = -H / 2 / PPU;
  cam.position.addScaledVector(right, cx / PPU).addScaledVector(up, cy / PPU); cam.updateProjectionMatrix(); cam.updateMatrixWorld(true);
  R.setSize(W, H);
  const scene = new THREE.Scene(); scene.add(root);
  const albMats = new Map();
  const maskMat = new THREE.MeshBasicMaterial({ colorWrite: false, side: THREE.DoubleSide });
  const cut = new Map();                                    // a cut-out mesh → its source material (alphaTest, map)
  root.traverse((m) => { if (m.isMesh && !m.userData.mask && m.material.alphaTest > 0 && m.material.map) cut.set(m, m.material); });
  root.traverse((m) => { if (m.isMesh && m.userData.mask) albMats.set(m, maskMat); else if (m.isMesh) albMats.set(m, new THREE.MeshBasicMaterial({ map: m.material.map, color: m.material.color, vertexColors: !!m.geometry.attributes.color, alphaTest: m.material.alphaTest || 0, clippingPlanes: CLIP, side: THREE.DoubleSide })); });
  const tmp = document.createElement('canvas'); tmp.width = W; tmp.height = H; const tx = tmp.getContext('2d', { willReadFrequently: true });
  const pass = (kind) => {
    if (kind === 'alb') { scene.overrideMaterial = null; root.traverse((m) => { if (m.isMesh) m.material = albMats.get(m); }); R.outputColorSpace = THREE.SRGBColorSpace; }
    else if (kind === 'emi') { scene.overrideMaterial = null; root.traverse((m) => { if (m.isMesh) m.material = m.userData.glow ? glowOn : cut.has(m) ? cutPass(cut.get(m), 'emi') : glowOff; }); R.outputColorSpace = THREE.SRGBColorSpace; }
    else if (cut.size) {                                    // per mesh: a cut-out mesh drops its cut texels in every pass
      const base = kind === 'nrm' ? nrmMat : kind === 'uv' ? uvMat : kind === 'sh' ? shadowMat : keyMat;
      scene.overrideMaterial = null; root.traverse((m) => { if (m.isMesh) m.material = cut.has(m) ? cutPass(cut.get(m), kind) : base; }); R.outputColorSpace = THREE.LinearSRGBColorSpace;
    }
    else { scene.overrideMaterial = kind === 'nrm' ? nrmMat : kind === 'uv' ? uvMat : kind === 'sh' ? shadowMat : keyMat; R.outputColorSpace = THREE.LinearSRGBColorSpace; }
    R.toneMapping = THREE.NoToneMapping; R.setClearColor(0, 0); R.render(scene, cam);
    tx.clearRect(0, 0, W, H); tx.drawImage(R.domElement, 0, 0); return tx.getImageData(0, 0, W, H);
  };
  const S = o.shadow !== false ? pass('sh').data : null;
  let hasGlow = false; root.traverse((m) => { if (m.isMesh && m.userData.glow) hasGlow = true; });
  const GL = hasGlow ? pass('emi').data : null;
  const U = pass('uv'), A = pass('alb'), N = pass('nrm'), K = pass('key'), a = A.data, n = N.data, k = K.data, uvd = U.data;
  // origin (model 0,0,0) in canvas pixels
  const ax = Math.round(W / 2 - cx), ay = Math.round(H / 2 + cy);
  const desat = o.desat ?? 0.3, gain = o.gain ?? 0.6, tint = o.tint || [0.95, 0.92, 1.0];
  let emiCount = 0;
  const E = new Uint8ClampedArray(W * H);
  for (let i = 0, j = 0; j < W * H; j++, i += 4) {
    if (a[i + 3] < 128) { a[i + 3] = 0; continue; }
    a[i + 3] = 255;
    let r = a[i], gg = a[i + 1], b = a[i + 2];
    const sw = Math.floor(uvd[i] / 256 * 8) + 8 * Math.floor(uvd[i + 1] / 256 * 4);   // swatch index 0..31
    if ((o.windowSwatches && o.windowSwatches.includes(sw)) || (GL && GL[i] > 128)) { E[j] = 1; emiCount++; }
    const L = 0.3 * r + 0.59 * gg + 0.11 * b;
    a[i] = (r + (L - r) * desat) * tint[0] * gain; a[i + 1] = (gg + (L - gg) * desat) * tint[1] * gain; a[i + 2] = (b + (L - b) * desat) * tint[2] * gain;
    let vx = n[i] / 127.5 - 1, vy = n[i + 1] / 127.5 - 1, vz = Math.max(0.05, n[i + 2] / 127.5 - 1);
    vy = vy * 0.6 - 0.25; const l = Math.hypot(vx, vy, vz);
    n[i] = (vx / l * 0.5 + 0.5) * 255; n[i + 1] = (vy / l * 0.5 + 0.5) * 255; n[i + 2] = vz / l * 255;
  }
  // 1px ink outline (only where the sprite meets transparency), keyed like its neighbour
  if (o.outline !== false) {
    const al = new Uint8Array(W * H); for (let j = 0; j < W * H; j++) al[j] = a[j * 4 + 3];
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const j = y * W + x; if (al[j]) continue;
      const nb = [[1, 0], [-1, 0], [0, 1], [0, -1]].map(([dx, dy]) => (x + dx >= 0 && y + dy >= 0 && x + dx < W && y + dy < H && al[(y + dy) * W + x + dx]) ? (y + dy) * W + x + dx : -1).find((v) => v >= 0);
      if (nb === undefined) continue;
      const i = j * 4, s = nb * 4;
      a[i] = INK[0]; a[i + 1] = INK[1]; a[i + 2] = INK[2]; a[i + 3] = 255;
      n[i] = 127; n[i + 1] = 91; n[i + 2] = 245; k[i] = k[s]; k[i + 1] = k[s + 1];
    }
  }
  // pack key hi/lo + emissive flag into one opaque image
  for (let j = 0; j < W * H; j++) { const i = j * 4; n[i + 3] = a[i + 3] ? 255 : (S && S[i + 3] > 128 ? 100 : 0); k[i + 2] = E[j] ? 255 : 0; k[i + 3] = 255; }
  if (o.raw) {                                    // crop to what's visible (sprite or its shadow)
    let cx0 = W, cy0 = H, cx1 = -1, cy1 = -1;
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (n[(y * W + x) * 4 + 3]) { if (x < cx0) cx0 = x; if (x > cx1) cx1 = x; if (y < cy0) cy0 = y; if (y > cy1) cy1 = y; }
    const cw = cx1 - cx0 + 1, ch = cy1 - cy0 + 1, crop = (img) => { tx.putImageData(img, 0, 0); return tx.getImageData(cx0, cy0, cw, ch); };
    return { w: cw, h: ch, ax: ax - cx0, ay: ay - cy0, emi: emiCount, A: crop(A), N: crop(N), K: crop(K),
      foot: [box.min.x * UNIT_TILES, box.min.z * UNIT_TILES, box.max.x * UNIT_TILES, box.max.z * UNIT_TILES].map((v) => +v.toFixed(2)),
      top: +(box.max.y * UNIT_TILES).toFixed(2) };
  }
  const url = (img) => { tx.putImageData(img, 0, 0); return tmp.toDataURL('image/png'); };
  return { name, w: W, h: H, ax, ay, emi: emiCount,
    foot: [box.min.x * UNIT_TILES, box.min.z * UNIT_TILES, box.max.x * UNIT_TILES, box.max.z * UNIT_TILES].map((v) => +v.toFixed(2)),
    top: +(box.max.y * UNIT_TILES).toFixed(2), uv: url(U), alb: url(A), nrm: url(N), key: url(K) };
};
// Bake a whole manifest and shelf-pack it into three atlases (albedo RGBA, normal +
// shadow alpha, depth-key hi/lo + emissive flag). Returns atlas PNGs + per-sprite meta.
window.bakeAll = async (list, width = 2048) => {
  const items = [];
  for (const e of list) { const r = await window.bakeEnv(e.model, { ...e, raw: true, windowSwatches: e.windows ? [14] : [] }); items.push({ e, r }); await new Promise((q) => setTimeout(q, 0)); }
  const order = items.map((_, i) => i).sort((p, q) => items[q].r.h - items[p].r.h);
  let x = 0, y = 0, rowH = 0; const pos = [];
  for (const i of order) { const r = items[i].r; if (x + r.w > width) { x = 0; y += rowH + 1; rowH = 0; } pos[i] = [x, y]; x += r.w + 1; rowH = Math.max(rowH, r.h); }
  const H = y + rowH;
  const mk = () => { const c = document.createElement('canvas'); c.width = width; c.height = H; return c; };
  const ca = mk(), cn = mk(), ck = mk(), xa = ca.getContext('2d'), xn = cn.getContext('2d'), xk = ck.getContext('2d');
  const meta = {};
  items.forEach(({ e, r }, i) => { const [px, py] = pos[i];
    xa.putImageData(r.A, px, py); xn.putImageData(r.N, px, py); xk.putImageData(r.K, px, py);
    meta[e.id] = { x: px, y: py, w: r.w, h: r.h, ax: r.ax, ay: r.ay, foot: r.foot, top: r.top, glow: r.emi ? (e.glowId || 9) : 0 }; });   // glow: its GLOW_ID (9 lit windows; 2 violet)
  return { meta, width, height: H, alb: ca.toDataURL('image/png'), nrm: cn.toDataURL('image/png'), key: ck.toDataURL('image/png') };
};
window.ready = true;
