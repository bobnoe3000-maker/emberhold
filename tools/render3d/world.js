// world.js — Luminati drawing Emberfall's world, in the game's own page (docs/luminati-port-plan.md §13 step 1; it was
// phase 0's frame, lumina/world.html). Built by tools/render3d/build.mjs with Luminati's engine and world layers and
// three.js into src/vendor/luminati-80e1aa6/luminati.js, which src/render3d/hybrid.js imports: `createWorld()`.
//
// It boots Luminati's Game on a level the game converted from the sim (src/render3d/convert.js), with none of
// Luminati's play: no title, no HUD (its UI root is a hidden element of ours), no input (its keys and pointer listen to
// a detached target, tagged by the build, so the game's own keys and taps never reach it), no sound (its audio never
// unlocks), its player hidden and its loop stopped. The game steps it once a frame. What it draws is the game's:
//   · the camera: Emberlit's own, exactly (hybrid.js works out the ground point at the middle of the screen and how many
//     CSS px a unit is; the camera here is placed to match: yaw 45°, pitch 30°, a 1° lens at the distance that gives
//     that scale, near enough orthographic that Emberlit's labels, minimap, names, bars and taps line up);
//   · the people: the sprites Emberlit chose this frame (its animator: the clip, the octant, the frame), drawn from our
//     atlases as Luminati sprites facing the camera, lit by its sun and lamps, with its shadows;
//   · the hour and the weather: the sim's;
//   · our own art where the converter kept it (a mill, a ruin, the Fens' stilts): stood as a sprite at its foot;
//   · the fights' effects (fx.js below).
// The depth of field is the menu's (Graphics: soft or off).
import * as THREE from 'three';
import { Game } from '../src/game/Game.js';
import { normalizeLevel } from '../src/engine/level/LevelFormat.js';
import { setLang } from '../src/engine/i18n/I18n.js';
import { registerCoreStrings } from '../src/engine/i18n/strings/index.js';
import { loadContentTables } from '../src/engine/i18n/ContentText.js';
import { startFonts } from '../src/engine/ui/FontLoader.js';
import { artScale } from '../src/engine/ui/UiScale.js';
import { Sprite3D } from '../src/engine/sprite/Sprite3D.js';
import { DEFAULT_KEYFRAMES } from '../src/engine/lighting/LightingSystem.js';
import { setFogStart } from '../src/game/AtmosphereFog.js';
import './ground.js';

let ASSETS = '';                                              // (the game's assets/: createWorld's `assets`)
const FOV = 1;                                                // (degrees: near enough orthographic, see above)
const NATIVE_PER_UNIT = 16 * Math.SQRT2;                      // Emberlit's native px a unit: a tile's half-width 8 px, two tiles a unit
const SPRITE_OPTS = { billboard: 'spherical', normalUp: 0.6, wrap: 0.6, roundness: 0.35, emissive: '#ffe9d2', emissiveIntensity: 0.2 };   // (0.12: a figure outside a lamp's pool went to a black silhouette underground; Emberlit's always read)

let lang = 'en', fonts = null, tables = null, container = null, uiRoot = null;

let game = null, building = null, levelId = 0, dof = 'soft', yawDeg = 45, pitchDeg = 30;
const images = new Map(), metas = new Map();
const image = (url) => { let p = images.get(url); if (!p) { p = new Promise((res, rej) => { const i = new Image(); i.decoding = 'async'; i.onload = () => res(i); i.onerror = rej; i.src = url; }); images.set(url, p); } return p; };
const json = (url) => { let p = metas.get(url); if (!p) { p = fetch(url).then((r) => (r.ok ? r.json() : null)).catch(() => null); metas.set(url, p); } return p; };

// ── the actors: one texture an atlas (each frame a UV rectangle: nothing cut), a pool of sprites an atlas ───────────
const atlases = new Map();                                    // name → { sheet, meta } | null while loading | false (failed)
function atlas(name) {
  if (atlases.has(name)) return atlases.get(name);
  atlases.set(name, null);
  Promise.all([json(`${ASSETS}actors/${name}.json`), image(`${ASSETS}actors/${name}.alb.png`)]).then(([meta, img]) => {
    if (!meta) { atlases.set(name, false); return; }
    const tex = new THREE.Texture(img);
    tex.magFilter = tex.minFilter = THREE.NearestFilter; tex.generateMipmaps = false; tex.colorSpace = THREE.SRGBColorSpace;
    tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping; tex.needsUpdate = true; tex.name = `ember-actor:${name}`;
    atlases.set(name, { meta, tex, sheets: new Map() });
  }).catch(() => atlases.set(name, false));
  return null;
}
/** the sheet for an atlas at a drawn size (a boss is drawn 1.3×: its own pixels per unit) */
function sheetOf(A, k) {
  const key = k.toFixed(3); let s = A.sheets.get(key);
  if (!s) {
    const m = A.meta;
    s = { texture: A.tex, frameWidth: m.cw, frameHeight: m.ch, columns: m.frames, rows: m.dirs, pixelsPerUnit: NATIVE_PER_UNIT / k,
      anchor: [m.ax / m.cw, 0], animations: { idle_down: { frames: [{ col: 0, row: 0 }], fps: 1, loop: false } }, name: A.tex.name };
    A.sheets.set(key, s);
  }
  return s;
}
const pools = new Map();                                      // sheet → Sprite3D[]
function spriteFor(sheet, n) {
  let p = pools.get(sheet); if (!p) pools.set(sheet, (p = []));
  while (p.length <= n) { const s = new Sprite3D(sheet, { ...SPRITE_OPTS }); s.visible = false; game.engine.scene.add(s); p.push(s); }
  return p[n];
}
// the foot of a sprite drawn at Emberlit's anchor: the plane's bottom row stands nearer the camera, by the pixels under
// the anchor, so the anchor lands where Emberlit drew it (a ground step toward the camera moves the screen half its
// length down: pitch 30°)
function standAt(s, X, Z, belowPx, ppu) {
  const back = (2 * belowPx) / ppu / Math.SQRT2;
  const tm = game.tileMap, x = X + back, z = Z + back;
  s.position.set(x, tm.getHeight(X, Z), z);
}

// ── our own art kept by the converter: a sprite each from the env atlases ───────────────────────────────────────────
let envSprites = [];
async function placeEnv(list, region) {
  for (const s of envSprites) { game.engine.scene.remove(s); s.dispose?.(); }
  envSprites = [];
  if (!list?.length) return;
  const sets = ['env', `town-${region || 'vale'}`];
  const all = await Promise.all(sets.map((n) => json(`${ASSETS}env/${n}.json`)));
  const at = (id) => { for (let i = 0; i < sets.length; i++) { const m = all[i]?.sprites?.[id]; if (m) return [sets[i], m]; } return null; };
  const mine = levelId;
  for (const p of list) {
    if (p.canvas) { standOurs(p); continue; }
    const f = at(p.id); if (!f) continue;
    const [set, m] = f, img = await image(`${ASSETS}env/${set}.alb.png`).catch(() => null);
    if (!img || mine !== levelId) return;
    const c = document.createElement('canvas'); c.width = m.w; c.height = m.h;
    const g = /** @type {CanvasRenderingContext2D} */ (c.getContext('2d')); g.drawImage(img, m.x, m.y, m.w, m.h, 0, 0, m.w, m.h);
    const tex = new THREE.CanvasTexture(c); tex.magFilter = tex.minFilter = THREE.NearestFilter; tex.generateMipmaps = false; tex.colorSpace = THREE.SRGBColorSpace;
    const sheet = { texture: tex, frameWidth: m.w, frameHeight: m.h, columns: 1, rows: 1, pixelsPerUnit: NATIVE_PER_UNIT, anchor: [m.ax / m.w, 0],
      animations: { idle_down: { frames: [{ col: 0, row: 0 }], fps: 1, loop: false } }, name: `ember-env:${p.id}`, dispose() { tex.dispose(); } };
    const s = new Sprite3D(sheet, { ...SPRITE_OPTS, castShadow: false, blobShadow: false });
    s.name = `ember:${set}:${p.id}`;
    standAt(s, p.x, p.z, m.h - m.ay, NATIVE_PER_UNIT);
    game.engine.scene.add(s); envSprites.push(s);
    s.update(0, game.engine.camera);
  }
}

// ── the Vale's light outdoors (port step 5; the owner's standing direction: keep the game's dusky, gloomy tones) ─────
// Luminati's 24 hours graded toward Emberlit's looks (render/daylight.js LOOKS): its colours greyer, the sun and the
// fill softer, the nights darker, the air a little thicker. Emberlit's day is a grey ambient under a mild sun, and its
// night near 45 % of its day; Luminati's were a bright blue noon and a bright blue night. The other regions keep
// Luminati's palette (and the Reach's and the Heights' their climates') until the Vale is right (the owner, 2026-11-01).
const grey = (hex, k) => { const c = new THREE.Color(hex), l = c.r * 0.299 + c.g * 0.587 + c.b * 0.114; c.r += (l - c.r) * k; c.g += (l - c.g) * k; c.b += (l - c.b) * k; return '#' + c.getHexString(); };
const dim = (hex, k) => { const c = new THREE.Color(hex); c.multiplyScalar(k); return '#' + c.getHexString(); };
const DUSKY = DEFAULT_KEYFRAMES.map((f) => {
  const night = f.night ?? 0;
  // (darker, not whiter: greying the horizon also greyed the fog, and the Vale went milky)
  return { ...f, top: dim(grey(f.top, 0.3), 0.8), horizon: dim(grey(f.horizon, 0.3), 0.6), bottom: dim(grey(f.bottom, 0.3), 0.75), sun: grey(f.sun, 0.3), hemiSky: grey(f.hemiSky, 0.45), hemiGround: grey(f.hemiGround, 0.3),
    // (dusk lifted, the nights only a little dimmer: graded harder, Luminati's dusk and night sat far darker than Emberlit's, whose
    // dusk is the game's old fixed look and whose night is 0.8 of it)
    sunI: f.sunI * 0.72, hemiI: f.hemiI * (0.86 - 0.08 * night) * (f.t >= 18 && f.t <= 20.5 ? 1.4 : 1), exp: f.exp * 0.97, fog: f.fog * (0.5 + 0.3 * night) };   // (the far ground under a veil of the horizon's colour: thin by day, as Emberlit's day is clear)   // (the far ground under a veil of the horizon's colour: thinner)
});
// and the picture graded as Emberlit's is: Luminati's game grades it a saturated 1.3 under a light vignette; Emberlit's
// Vale is olive grass and grey stone under a heavy one (daylight.js vig 0.85)
// By day greyer and dimmer (Emberlit's day is a grey ambient: daylight.js LOOKS.day), by night as night is
const VALE_GRADE = { saturation: 0.92, exposure: 0.9, contrast: 1.06, vignette: 0.78 };
let graded = false;
function gradeByHour() {
  const G = game?.postfx?.settings?.grade, n = game?.lighting?.state?.night ?? 1;
  if (!graded || !G) return;
  G.saturation = 0.74 + 0.18 * n; G.exposure = (0.84 + 0.06 * n) * bright;
}
// a brightness on top of the hour's grade (settings({ bright })): a post-tone-map multiply, so 1.2 is a picture a fifth
// brighter at every hour. The owner tunes the Vale's day, dusk and night against captures at a few of these.
let bright = 1;
let gradeOwn = null;
let skyShown = 'default';
function skyFor(lv, region) {
  const L = game?.lighting; if (!L) return;
  const env = lv.environment || {}, G = game.postfx?.settings?.grade;
  if (G) { if (!gradeOwn) gradeOwn = { ...G }; Object.assign(G, gradeOwn, region === 'vale' ? VALE_GRADE : {}); }
  graded = region === 'vale' && !env.interior;
  if (env.interior || env.climate || env.season) return;                 // (underground: the ambient's ours; a climate's sky its own)
  const want = region === 'vale' ? 'dusky' : 'default';
  L.setKeyframes(want === 'dusky' ? DUSKY : DEFAULT_KEYFRAMES); skyShown = want;   // (each outdoor level: a climate before may have set its own)
}

// a prop of ours built in the page (hybrid.js: a dungeon's furniture, gsprite.js), from its canvas: stood facing the
// camera at its tile's middle with a soft shadow, or laid under the figures when it lies on the floor (a binding circle,
// a bedroll: walked over)
const ourSheets = new Map();
function standOurs(p) {
  let sheet = ourSheets.get(p.canvas);
  if (!sheet) {
    const tex = new THREE.CanvasTexture(p.canvas); tex.magFilter = tex.minFilter = THREE.NearestFilter; tex.generateMipmaps = false; tex.colorSpace = THREE.SRGBColorSpace;
    sheet = { texture: tex, frameWidth: p.canvas.width, frameHeight: p.canvas.height, columns: 1, rows: 1, pixelsPerUnit: NATIVE_PER_UNIT, anchor: [p.ax / p.canvas.width, 0],
      animations: { idle_down: { frames: [{ col: 0, row: 0 }], fps: 1, loop: false } }, name: `ember-prop:${p.id}` };
    ourSheets.set(p.canvas, sheet);
  }
  const s = new Sprite3D(sheet, { ...SPRITE_OPTS, emissiveIntensity: 0.3, castShadow: false, blobShadow: !p.flat });   // (a little of their own colour: lit only by the hemisphere and a far torch, they read as cut-outs)
  s.name = `ember:prop:${p.id}`;
  standAt(s, p.x, p.z, p.canvas.height - p.ay, NATIVE_PER_UNIT);
  if (p.flat) s.traverse((o) => { o.renderOrder = -1; if (o.material) o.material.depthWrite = false; });
  game.engine.scene.add(s); envSprites.push(s);
  s.update(0, game.engine.camera);
}

// ── the farm's beasts, alive (the owner, 2026-11-01: "The cows look bad too") ─────────────────────────────────────
// Emberlit animates them (render/beasts.js: the tail swished, the head lifted to chew), from frames baked beside each
// in the env atlas (cow_1, cow_1~tl, cow_1~tr, cow_1~hd). The converter leaves them out of the level; hybrid.js hands
// the frame Emberlit chose each frame, and it's drawn here as a figure is: a sprite facing the camera at its foot, with
// its shadow, from a texture cut once a frame of the atlas.
const envFrames = new Map();                                  // id → sheet | null (loading) | false
let envRegion = 'vale';
function envSheet(id) {
  if (envFrames.has(id)) return envFrames.get(id);
  envFrames.set(id, null);
  const sets = ['env', `town-${envRegion}`];
  Promise.all(sets.map((n) => json(`${ASSETS}env/${n}.json`))).then(async (all) => {
    for (let i = 0; i < sets.length; i++) {
      const m = all[i]?.sprites?.[id]; if (!m) continue;
      const img = await image(`${ASSETS}env/${sets[i]}.alb.png`);
      const c = document.createElement('canvas'); c.width = m.w; c.height = m.h;
      /** @type {CanvasRenderingContext2D} */ (c.getContext('2d')).drawImage(img, m.x, m.y, m.w, m.h, 0, 0, m.w, m.h);
      const tex = new THREE.CanvasTexture(c); tex.magFilter = tex.minFilter = THREE.NearestFilter; tex.generateMipmaps = false; tex.colorSpace = THREE.SRGBColorSpace;
      envFrames.set(id, { texture: tex, frameWidth: m.w, frameHeight: m.h, columns: 1, rows: 1, pixelsPerUnit: NATIVE_PER_UNIT, anchor: [m.ax / m.w, 0], below: m.h - m.ay,
        animations: { idle_down: { frames: [{ col: 0, row: 0 }], fps: 1, loop: false } }, name: `ember-beast:${id}` });
      return;
    }
    envFrames.set(id, false);
  }).catch(() => envFrames.set(id, false));
  return null;
}
const beastPool = [];                                         // Sprite3D, re-sheeted as their frame changes
function beastSprite(n, sheet) {
  let s = beastPool[n];
  if (s && s.sheet !== sheet) { game.engine.scene.remove(s); s.dispose?.(); s = null; }
  if (!s) { s = new Sprite3D(sheet, { ...SPRITE_OPTS }); game.engine.scene.add(s); beastPool[n] = s; }
  return s;
}

// ── the fights' light, in Luminati's own render ─────────────────────────────────────────────────────────────────────
// Emberlit's fx.js draws every blow's and spell's light on black into its emissive plane (hybrid.js `light`). Laid over
// Luminati's finished picture after its post pass as light (added), with a little bloom from a few taps round each
// pixel, placed as Emberlit composites its window. (It was two page layers blended over the canvas, plus-lighter and a
// CSS blur: on a phone's Safari the top bar's words above them came out soft.)
const LIGHT_VS = `uniform vec4 uRect; uniform vec2 uView; varying vec2 vUv;
void main() { vUv = position.xy; vec2 p = uRect.xy + position.xy * uRect.zw; gl_Position = vec4(p.x / uView.x * 2.0 - 1.0, 1.0 - p.y / uView.y * 2.0, 0.0, 1.0); }`;
// Each lit texel's alpha holds its owner's depth key (fx.js flush; 0: none): where the scene's own surface at that pixel
// stands above the floor and nearer the camera than the owner (a wall, a pillar, a figure in front), the light is cut
// to Emberlit's 0.22. The floor never hides it: sparks fall onto the ground in front. A key is a sim x + y, the
// iso view's depth; the scene's is rebuilt from its depth buffer.
const LIGHT_FS = `uniform sampler2D tEmi, tDepth; uniform vec2 uTexel, uBuf; uniform mat4 uInvVP; uniform vec4 uKey; uniform float uFloor; varying vec2 vUv;
void main() {
  vec4 e = texture2D(tEmi, vUv); vec3 c = e.rgb * 2.4, g = vec3(0.0); float own = e.a;
  for (int i = 0; i < 8; i++) { float a = float(i) * 0.785398; vec2 d = vec2(cos(a), sin(a)) * uTexel;
    vec4 n = texture2D(tEmi, vUv + d * 2.0), f = texture2D(tEmi, vUv + d * 4.5); g += n.rgb + f.rgb * 0.6; own = max(own, max(n.a, f.a)); }
  float k = 1.0;
  if (uKey.w > 0.5 && own > 0.002) {
    vec2 suv = gl_FragCoord.xy / uBuf; float z = texture2D(tDepth, suv).x;
    if (z < 1.0) {
      vec4 w = uInvVP * vec4(suv * 2.0 - 1.0, z * 2.0 - 1.0, 1.0); w.xyz /= w.w;
      float scene = 2.0 * (w.x + w.z) + uKey.z, eff = uKey.x + own * 255.0 * uKey.y;
      if (w.y > uFloor && scene > eff + 1.5) k = 0.22;
    }
  }
  gl_FragColor = vec4((c + g * 0.12) * k, 1.0);
}`;
const light = { scene: null, cam: null, mat: null, tex: null, on: false, keyed: false };
function lightPass() {
  if (!light.on || !game) return;
  const r = game.engine.renderer, ac = r.autoClear, U = light.mat.uniforms, cam = game.engine.camera;
  U.tDepth.value = game.postfx?.depthTexture || null; U.uKey.value.w = light.keyed && U.tDepth.value ? 1 : 0;
  r.getDrawingBufferSize(U.uBuf.value);
  U.uInvVP.value.multiplyMatrices(cam.matrixWorld, cam.projectionMatrixInverse);
  r.autoClear = false; r.setRenderTarget(null); r.render(light.scene, light.cam); r.autoClear = ac;
}
/** this frame's light: upload the plane only when anything is lit (a scan of its words), else draw nothing */
function setLight(L) {
  if (!L || !L.emi) { light.on = false; return; }
  const words = new Uint32Array(L.emi.buffer, L.emi.byteOffset, L.emi.byteLength >> 2);
  let any = false; for (let i = 0; i < words.length; i++) if (words[i] & 0x00ffffff) { any = true; break; }
  light.on = any; if (!any) return;
  if (!light.scene) {
    light.scene = new THREE.Scene(); light.cam = new THREE.Camera();
    light.mat = new THREE.ShaderMaterial({ vertexShader: LIGHT_VS, fragmentShader: LIGHT_FS, transparent: true, depthTest: false, depthWrite: false, blending: THREE.AdditiveBlending,
      uniforms: { tEmi: { value: null }, uTexel: { value: new THREE.Vector2() }, uRect: { value: new THREE.Vector4() }, uView: { value: new THREE.Vector2() },
        tDepth: { value: null }, uBuf: { value: new THREE.Vector2(1, 1) }, uInvVP: { value: new THREE.Matrix4() }, uKey: { value: new THREE.Vector4() }, uFloor: { value: 1.2 } } });   // (the floor of our levels is 1: convert.js GROUND_Y)
    const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.Float32BufferAttribute([0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 1, 0], 3)); geo.setIndex([0, 2, 1, 1, 2, 3]);
    const mesh = new THREE.Mesh(geo, light.mat); mesh.frustumCulled = false; light.scene.add(mesh);
    game.engine.events.on('afterRender', lightPass);
  }
  if (!light.tex || light.tex.image.width !== L.w || light.tex.image.height !== L.h || light.tex.image.data !== L.emi) {
    light.tex?.dispose();
    light.tex = new THREE.DataTexture(L.emi, L.w, L.h, THREE.RGBAFormat); light.tex.flipY = false;
    light.tex.magFilter = light.tex.minFilter = THREE.LinearFilter; light.tex.generateMipmaps = false;
    light.mat.uniforms.tEmi.value = light.tex; light.mat.uniforms.uTexel.value.set(1 / L.w, 1 / L.h);
  }
  light.tex.needsUpdate = true;
  light.mat.uniforms.uRect.value.set(L.x, L.y, L.w * L.px, L.h * L.px);
  light.mat.uniforms.uView.value.set(innerWidth, innerHeight);
  light.keyed = !!L.key;
  if (L.key) light.mat.uniforms.uKey.value.set(L.key.base, L.key.step, L.key.origin, 1);
}

// ── the camera: Emberlit's ──────────────────────────────────────────────────────────────────────────────────────────
const cam = { x: 0, y: 1, z: 0, ppu: 22, ready: false };
function placeCamera() {
  const rig = game.rig, camera = game.engine.camera;
  const D = innerHeight / (2 * cam.ppu * Math.tan((FOV / 2) * Math.PI / 180));
  rig.target = null; rig.bounds = null; rig.lift = 0;
  rig.minDistance = 1; rig.maxDistance = 1e6; rig.minPitch = 0; rig.maxPitch = Math.PI / 2; rig.freeYaw = true;
  rig.yaw = rig.yawTarget = yawDeg * Math.PI / 180; rig.pitch = rig.pitchTarget = pitchDeg * Math.PI / 180;
  rig.distance = rig.distanceTarget = D;
  rig.focusPoint.set(cam.x, cam.y, cam.z);
  if (Math.abs(camera.fov - FOV) > 1e-6 || Math.abs(camera.far - (D + 600)) > 1) {
    camera.fov = FOV; camera.near = Math.max(1, D - 300); camera.far = D + 600; camera.updateProjectionMatrix();
  }
  rig._apply(0);
  setFogStart(D - 7);
  // the lens focused on the middle of the screen, where the hero is: Luminati focuses on its player at its own short
  // distances and eases there; at this one the focus is the camera's distance, held
  const dofS = game.postfx?.settings?.dof;
  if (dofS) { dofS.autoFocus = false; dofS.focusDistance = D; }
}

async function boot(level) {
  await tables;
  // (read by the build's tags in Game.js: its UI under a hidden root of ours, its input on a target nothing sends to, its
  // sound never unlocked)
  Object.assign(globalThis, { __emberUiRoot: uiRoot, __emberInputTarget: new EventTarget(), __emberSilent: true });
  game = new Game({ container, level, source: 'emberfall', autostart: true, lang, fonts, look: 'diorama' });
  await game.init(() => {});
  if (game.audio) game.audio.muted = true;                    // (the game has its own sound: src/audio/)
  game._updatePlayCamera = () => {};                          // (the camera is the game's: placeCamera)
  game._updateCameraBounds = () => {};
  game.start();
  await game.warmedUp;
  game.engine.stop();                                         // (the game steps it: frame())
  game.engine.events.on('lateUpdate', () => { if (game) placeCamera(); });
  // underground, the ambient is the game's (convert.js ambientOf), laid over the palette's after it updates
  game.engine.events.on('update', gradeByHour);
  game.engine.events.on('update', () => {
    const a = frameAmbient, L = game?.lighting; if (!a || !L?.hemi) return;
    L.hemi.color.setRGB(a.sky[0], a.sky[1], a.sky[2]); L.hemi.groundColor.setRGB(a.ground[0], a.ground[1], a.ground[2]); L.hemi.intensity = a.i;
    if (L.sun) L.sun.intensity *= a.sun;
  });
  if (game.lighting) game.lighting._shadowExtent = Math.max(game.lighting._shadowExtent || 22, 34);   // (the view is wider than Luminati's: shadows reach the screen's top)
}
function hidePlayer() {
  const p = game.player; if (!p) return;
  if (p.sprite) p.sprite.visible = false;
  p.visible = false;
}

// ── the fight's ground: rings at the fighters' feet, the churned mud and sluice (hybrid.js), drawn on the ground ────────
// The rings are Emberlit's footMark (its near arc in the side's colour), here a whole thin ring, a hand's breadth over the
// ground so the terrain never cuts it; the hazards a dark pool and its rim. Made once and reused: no material is made
// in a fight (a new program mid-fight is a hitch).
const RING_GEO = new THREE.RingGeometry(0.46, 0.6, 40), DISC_GEO = new THREE.CircleGeometry(1, 40), RIM_GEO = new THREE.RingGeometry(0.8, 1, 40);
// the foe the party is set on (a tap on it: battle.js focus): four arcs round its ring, turning, a hand outside it
const FOCUS_GEO = (() => { const g = []; for (let k = 0; k < 4; k++) g.push(new THREE.RingGeometry(0.7, 0.8, 10, 1, k * Math.PI / 2 + 0.25, Math.PI / 2 - 0.5)); return mergeGeo(g); })();
function mergeGeo(list) {
  const pos = [], idx = []; let base = 0;
  for (const g of list) { const p = g.getAttribute('position'), ix = g.getIndex(); for (let i = 0; i < p.count; i++) pos.push(p.getX(i), p.getY(i), p.getZ(i)); for (let i = 0; i < ix.count; i++) idx.push(ix.getX(i) + base); base += p.count; g.dispose(); }
  const m = new THREE.BufferGeometry(); m.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); m.setIndex(idx); return m;
}
const groundMat = () => new THREE.MeshBasicMaterial({ transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2, toneMapped: false });
const groundPools = { ring: [], disc: [], rim: [], focus: [] };
const GEO = { ring: RING_GEO, disc: DISC_GEO, rim: RIM_GEO, focus: FOCUS_GEO };
function groundMesh(kind, n) {
  const p = groundPools[kind];
  while (p.length <= n) { const m = new THREE.Mesh(GEO[kind], groundMat()); m.rotation.x = -Math.PI / 2; m.renderOrder = 2; m.visible = false; game.engine.scene.add(m); p.push(m); }
  return p[n];
}
function placeGround(m, x, z, r, col, a) {
  m.visible = a > 0.01; if (!m.visible) return;
  m.position.set(x, game.tileMap.getHeight(x, z) + 0.03, z); m.scale.setScalar(r);
  m.material.color.setRGB(col[0] / 255, col[1] / 255, col[2] / 255, THREE.SRGBColorSpace); m.material.opacity = a;
}
let carryLight = null, carryLevel = -1, focusSpin = 0, frameAmbient = null, inside = false;

/** the frame's API, for src/render3d/hybrid.js */
const api = {
  ready: false,
  /** build a level (the sim's world, converted), then stand our art in it; resolves when it's drawn */
  async load(level, sprites = [], region = 'vale') {
    const id = ++levelId;
    if (region !== envRegion) { envRegion = region; envFrames.clear(); }
    const lv = normalizeLevel(level).level;
    building = (async () => {
      if (!game) await boot(lv);
      else await game.swapLevel(lv, { spawn: lv.spawn });
      if (id !== levelId) return;
      hidePlayer();
      inside = !!lv.environment?.interior;
      api.settings({ dof });
      skyFor(lv, region);
      await placeEnv(sprites, region);
    })();
    await building;
    return id === levelId;
  },
  /** the menu's Graphics: the depth of field */
  settings(o = {}) {
    if (o.dof) dof = o.dof;
    if (o.bright > 0) bright = o.bright;
    const S = game?.postfx?.settings;
    // 'soft': the prototype's eased lens (its view.js): a band most of the screen tall, 16 units of depth in focus, so the
    // square is sharp and the far roofs and the near hedges a little soft; 'off': everything sharp
    // (none underground: the rooms below the one in view held their fires as blurred orbs over the HUD)
    if (S?.dof) Object.assign(S.dof, { enabled: dof !== 'off' && !inside, focusRange: 16, tiltShift: 0.14, tiltWidth: 0.62 });
  },
  /**
   * one frame: the camera, the hour, the weather, who's where, then a step of Luminati and its picture
   * @param {{ dt: number, focus: number[], ppu: number, hour: number, weather: string, fog?: number, hero: number[] | null,
   *   actors: { name: string, cw: number, col: number, row: number, x: number, z: number, fade: number, flash?: number }[],
   *   rings?: { x: number, z: number, col: number[], a: number }[], hazards?: { x: number, z: number, r: number, col: number[], rim: number[], a: number }[], mark?: { x: number, z: number } | null, ambient?: { sky: number[], ground: number[], i: number, sun: number, lamps?: number } | null, carry?: number, draw?: boolean }} f
   */
  frame(f) {
    if (!game || !game.engine) return;
    cam.x = f.focus[0]; cam.y = f.focus[1]; cam.z = f.focus[2]; cam.ppu = f.ppu;
    if (Number.isFinite(f.hour) && Math.abs((game.lighting?.timeOfDay ?? -1) - f.hour) > 0.004) game.setTime(f.hour);
    if (f.weather && game.weather?.weather !== f.weather) game.setWeather(f.weather);
    if (game.lighting?.settings) { game.lighting.settings.fogMul = 1 + 0.6 * (f.fog || 0); game.lighting.settings.pointLightMul = f.ambient?.lamps ?? 1; }   // (the sim's fog: the air a little thicker, Emberlit's overlay drifting its banks over it; underground, the lamps the game's)
    if (f.hero && game.player) { hidePlayer(); game.player.position.set(f.hero[0], game.tileMap.getHeight(f.hero[0], f.hero[1]), f.hero[1]); }
    // the people: each atlas's pool filled in the order drawn; the rest hidden
    const used = new Map(), camera = game.engine.camera;
    for (const a of f.actors) {
      const A = atlas(a.name); if (!A) continue;
      const k = a.cw ? a.cw / A.meta.cw : 1, sheet = sheetOf(A, k), n = used.get(sheet) || 0; used.set(sheet, n + 1);
      const s = spriteFor(sheet, n);
      s.visible = true;
      if (s._col !== a.col || s._row !== a.row) s.setFrame(a.col, a.row);
      standAt(s, a.x, a.z, (A.meta.ch - A.meta.ay) * k, sheet.pixelsPerUnit * k);
      const fl = a.flash || 0;                                 // (a hit's flash: Emberlit's look.flash, white over the figure)
      if (s._emberFlash !== fl) { s._emberFlash = fl; const k = 1 + fl * 2.6; s.tint = new THREE.Color(k, k * 0.96, k * 0.9); }   // (the sprite's colour lifted, lit as ever: Luminati's own hit flash, combatFx, drew our sheets as pale cut-outs)
      const op = 1 - (a.fade || 0);
      if (Math.abs(s.opacity - op) > 0.01) s.opacity = op;
      s.update(0, camera);
    }
    for (const [sheet, p] of pools) { const n = used.get(sheet) || 0; for (let i = n; i < p.length; i++) if (p[i].visible) p[i].visible = false; }
    // the fight's ground
    const nk = { ring: 0, disc: 0, rim: 0, focus: 0 };
    for (const r of f.rings || []) placeGround(groundMesh('ring', nk.ring++), r.x, r.z, 1, r.col, r.a);
    if (f.mark) { const m = groundMesh('focus', nk.focus++); placeGround(m, f.mark.x, f.mark.z, 1, [255, 226, 150], 0.7 + 0.2 * Math.sin(focusSpin * 4)); m.rotation.z = focusSpin; focusSpin += (f.dt || 0) * 0.9; }
    for (const h of f.hazards || []) { placeGround(groundMesh('disc', nk.disc++), h.x, h.z, h.r, h.col, 0.82 * h.a); placeGround(groundMesh('rim', nk.rim++), h.x, h.z, h.r, h.rim, 0.42 * h.a); }
    for (const kind of Object.keys(groundPools)) for (let i = nk[kind]; i < groundPools[kind].length; i++) groundPools[kind][i].visible = false;
    // the hero's ember-wisp: one of Luminati's spell lights (never a lamp), taken again after each level is built
    if (carryLevel !== levelId) { carryLevel = levelId; carryLight = game.world?.acquireSpellLight?.({ minor: false }) ?? null; }
    if (carryLight && f.hero) {
      const k = Math.max(0, Math.min(1, f.carry ?? 0)), hx = f.hero[0] + 0.35, hz = f.hero[1] + 0.35;
      carryLight.set(hx, game.tileMap.getHeight(f.hero[0], f.hero[1]) + 2.4, hz, { color: [1.9, 1.15, 0.42], intensity: (4.5 * k) / (f.ambient?.lamps ?? 1), distance: 6, decay: 1.4, flicker: 0.12 });   // (a glow round the hero, not a floodlight: 16 washed the figure out)
    }
    // the farm's beasts, in the frame Emberlit chose
    let nb = 0;
    for (const b of f.beasts || []) {
      const sh = envSheet(b.id); if (!sh) continue;
      const s = beastSprite(nb++, sh); s.visible = true;
      standAt(s, b.x, b.z, sh.below, NATIVE_PER_UNIT); s.update(0, camera);
    }
    for (let i = nb; i < beastPool.length; i++) if (beastPool[i]?.visible) beastPool[i].visible = false;
    frameAmbient = f.ambient || null;
    // our art kept standing (env, props) faces the camera: turned each frame as the figures are. Turned once, when it was
    // placed, it kept the camera's angle before the camera was set, and the props read as thin leaning strips
    for (const s of envSprites) s.update(0, camera);
    setLight(f.light);
    game.engine.step(Math.max(0, Math.min(0.1, f.dt)), { render: f.draw !== false });   // (draw false: stepped, not drawn: tools/capture/rig.mjs settling)
  },
  /** stand the converter's art again (a chest opened, a shrine used: hybrid.js), the level kept */
  sprites(list) { if (game) placeEnv(list, envRegion); },
  /** (for checks) a world point on the screen, CSS px, through this camera */
  project(x, y, z) {
    if (!game) return null;
    const v = new THREE.Vector3(x, y, z).project(game.engine.camera);
    return [((v.x + 1) / 2) * innerWidth, ((1 - v.y) / 2) * innerHeight];
  },
  /** (for checks) the ground's height at a point of Luminati's, as its figures stand on it (a stair's step, a bridge's deck) */
  ground(x, z) { return game?.tileMap ? game.tileMap.getHeight(x, z) : null; },
  get stats() {
    const shown = (k) => groundPools[k].filter((m) => m.visible).length;
    return { beasts: beastPool.filter((s) => s?.visible).length, light: light.on ? 1 : 0, lightDepth: light.on && light.keyed && game?.postfx?.depthTexture ? 1 : 0, rings: shown('ring'), hazards: shown('disc'), focus: shown('focus'), carry: carryLight ? 1 : 0, level: levelId, actors: [...pools.values()].reduce((n, p) => n + p.filter((s) => s.visible).length, 0), atlases: atlases.size, env: envSprites.length, sky: skyShown, ours: envSprites.filter((q) => q.name.startsWith('ember:prop:')).length,
      programs: game?.engine?.renderer?.info?.programs?.length ?? null };
  },
};
/**
 * Luminati, ready to draw the game's world into `container` (a full-window element of the game's, under its overlay)
 * @param {{ container: HTMLElement, uiRoot: HTMLElement, assets: string }} o  uiRoot: a hidden element for Luminati's own UI;
 *   assets: the game's assets/ folder (a URL ending in /)
 */
export function createWorld(o) {
  if (container) throw new Error('createWorld: one world a page');
  container = o.container; uiRoot = o.uiRoot; ASSETS = o.assets;
  lang = setLang('en');
  registerCoreStrings();
  fonts = startFonts({ lang, px: artScale({ w: innerWidth, h: innerHeight, dpr: devicePixelRatio || 1 }).px });
  tables = loadContentTables(lang, {});
  api.ready = true;
  return api;
}
