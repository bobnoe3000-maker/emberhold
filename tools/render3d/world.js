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
import { IceCrystals } from '../src/engine/fx/IceCrystals.js';
import { GroundFrost } from '../src/engine/fx/GroundFrost.js';
import { FxQuads } from '../src/engine/fx/FxQuads.js';
import { WardDome } from '../src/engine/fx/WardDome.js';
import { SpectralBlades } from '../src/engine/fx/SpectralBlades.js';
import { RockSpikes } from '../src/engine/fx/RockSpikes.js';
import { SpectralBells } from '../src/engine/fx/SpectralBells.js';
import { createFxAtlas } from '../src/engine/pixel/FxSprites.js';
import { DEFAULT_KEYFRAMES } from '../src/engine/lighting/LightingSystem.js';
import { setFogStart } from '../src/game/AtmosphereFog.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { clone as cloneSkinned } from 'three/addons/utils/SkeletonUtils.js';
import { build as buildFigure, fitPpu, pose as poseFigure, compact } from './figure.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import './ground.js';

let ASSETS = '';                                              // (the game's assets/: createWorld's `assets`)
const FOV = 1;                                                // (degrees: near enough orthographic, see above)
const PIXEL_RATIO = 3;                                        // (the most of the device's pixel ratio Luminati draws at: boot)
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

// ── the people as models (docs/dungeon-kit-proposal.md §9, 4b; the owner, 2026-11-09: "Lets do just the character and
// npc model change to 4b at 3x") ──────────────────────────────────────────────────────────────────────────────────────
// Each figure Emberlit draws is stood here as its variant's KayKit model, built by the bake's own code (figure.js: the
// same loadout, face, gear, repaint and heroic proportions as its atlas), at the atlas's size (the bake's pixels a unit),
// posed at the clip and frame Emberlit's animator chose, played on smoothly between the baked frames, and turned smoothly
// toward its octant. The animator stays the authority: when a swing lands, when a walk steps, which way they face. The
// models come from assets/models (tools/actor-lab/models.mjs). A figure whose model isn't in yet, or ?figures=sprites
// (settings figures), is drawn as its sprite, as before.
let FIGURES = 'models';
const _camDir = new THREE.Vector3();
const FILL = 0.4;                                             // (the share of the sprites' self-light a model gets: the owner's 4b; it catches the room's light as a card can't)
let cast = null, castAsked = false;                           // assets/models/cast.json: the actors' variants, sizes and clips
let figErr = '';                                              // (the first model that failed, and why: the menu's Graphics says so, for a phone we can't see)
const castOf = (name) => {
  if (!castAsked) { castAsked = true; json(`${ASSETS}models/cast.json`).then((c) => { cast = c || false; if (!c) figErr ||= 'models/cast.json unreadable'; }); }
  return cast ? cast.actors[name] || false : cast === false ? false : null;
};
const gltfLoader = new GLTFLoader(), gltfs = new Map();
// the bake's paths (./models/<file>) to the game's assets; each build gets its own copy of the scene (bones, meshes),
// sharing geometry, textures and clips
const loadModel = (u) => {
  const url = `${ASSETS}models/${u.replace('./models/', '')}`;
  let p = gltfs.get(url); if (!p) { p = gltfLoader.loadAsync(url); gltfs.set(url, p); }
  return p.then((g) => ({ scene: cloneSkinned(g.scene), animations: g.animations }));
};
const metaOf = new Map();                                     // atlas name → its JSON (the clips' columns), once in
const templates = new Map();                                  // atlas name → { root, clips, frame, ppu, minY } | null (building) | false
function templateOf(name, def) {
  const t = templates.get(name); if (t !== undefined) return t;
  templates.set(name, null);
  if (!metaOf.has(name)) json(`${ASSETS}actors/${name}.json`).then((m) => metaOf.set(name, m));
  buildFigure(def.v, { far: false, load: loadModel, faces: async () => cast.faces }).then((c) => {
    const rest = []; c.root.traverse((b) => { if (b.isBone) rest.push([b, b.position.clone(), b.quaternion.clone(), b.scale.clone()]); });
    poseFigure(c, 'Idle', 0, true);                           // (sized from the heroic idle, as the bake fits it)
    const { box, ppu } = fitPpu(c.root, def.v, def.px);
    for (const [b, p, q, s] of rest) { b.position.copy(p); b.quaternion.copy(q); b.scale.copy(s); }
    const cut = compact(c.root, mergeGeometries);              // (once a figure: its copies share the merged parts)
    templates.set(name, { root: c.root, clips: c.clips, frame: c.frame, ppu, minY: box.min.y, meshes: cut });
  }).catch((e) => { console.warn('[luminati] figure', name, e); figErr ||= `${name}: ${e?.message || e}`; templates.set(name, false); });
  return null;
}
const figs = new Map();                                       // a figure's key (hybrid.js) → its model, posed
let figSeen = 0;
function figureFor(key, name, T) {
  let f = figs.get(key);
  if (f && f.name !== name) { game.engine.scene.remove(f.root); figs.delete(key); f = null; }
  if (f) return f;
  const root = cloneSkinned(T.root), mats = [];
  root.traverse((o) => {
    if (!o.isMesh) return;
    o.castShadow = true; o.receiveShadow = true; o.frustumCulled = false;
    o.material = o.material.clone();
    // matte, as the atlases are (they're baked unlit): KayKit's sheen took the hero's carry light, a light at the shoulder,
    // as a white blaze on the helmet
    if (o.material.isMeshStandardMaterial) { o.material.metalness = 0; o.material.roughness = Math.max(o.material.roughness ?? 1, 0.92); }
    // (the skeletons' eyes and a lantern's glass keep their own glow; an unlit material, a prop's MeshBasicMaterial, has
    // no emissive: given one, three's uniforms threw mid-render)
    const own = /Eyes/.test(o.name) || !!o.userData.glow || !o.material.emissive;
    if (!own) { o.material.emissive = o.material.map ? new THREE.Color(0xffe9d2) : o.material.color.clone(); if (o.material.map) o.material.emissiveMap = o.material.map; }
    // a compacted face (figure.js compact) is coloured by vertex: its fill is too, or every part of it glowed one white
    if (!own && o.material.vertexColors) {
      o.material.onBeforeCompile = (sh) => { sh.fragmentShader = sh.fragmentShader.replace('#include <emissivemap_fragment>', '#include <emissivemap_fragment>\n#ifdef USE_COLOR\n\ttotalEmissiveRadiance *= vColor.rgb;\n#endif'); };
      o.material.customProgramCacheKey = () => 'ember-figure-vc';
    }
    mats.push({ m: o.material, own, base: o.material.emissive ? o.material.emissive.clone() : null });
  });
  const bones = []; root.traverse((b) => { if (b.isBone) bones.push([b, b.position.clone(), b.quaternion.clone(), b.scale.clone()]); });
  f = { name, root, mixer: new THREE.AnimationMixer(root), clips: T.clips, frame: T.frame, bones, mats, yaw: null, key: '', fpos: 0, seen: 0, look: '' };
  game.engine.scene.add(root); figs.set(key, f);
  return f;
}
const WARN_EMI = new THREE.Color(1, 0.45, 0.15);
/** stand, pose and light a figure as a model: false while its model is still coming (draw the sprite) */
function placeFigure(a, key, dt, camAz) {
  if (FIGURES !== 'models') return false;
  const def = castOf(a.name); if (!def) return false;
  const T = templateOf(a.name, def), meta = metaOf.get(a.name); if (!T || !meta) return false;
  // the clip and frame Emberlit chose: the atlas column's clip, its frame within it
  let ck = null; for (const k in meta.clips) { const c = meta.clips[k]; if (a.col >= c.start && a.col < c.start + c.len) { ck = k; break; } }
  const d = ck && def.clips[ck]; if (!d) return false;
  const f = figureFor(key, a.name, T), mc = meta.clips[ck], n = d.frames, fr = a.col - mc.start;
  // played on between the baked frames: the frame Emberlit chose is the floor, the next its ceiling (a walk, stepped by
  // distance, waits there; a figure far off its frame is put back on it)
  if (f.key !== ck) { f.key = ck; f.fpos = fr; }
  else if (d.once) f.fpos = Math.min(Math.max(f.fpos + dt * mc.fps, fr), Math.min(fr + 0.999, n - 1));
  else {
    const p = f.fpos + dt * mc.fps, c = (((p - fr) % n) + n) % n;
    f.fpos = c < 1 ? ((p % n) + n) % n : c > n / 2 ? fr : fr + 0.999;
  }
  const a0 = d.from ?? 0, a1 = d.to ?? 1, u = d.once ? a0 + (a1 - a0) * (f.fpos / Math.max(1, n - 1)) : a0 + (a1 - a0) * (f.fpos / n);
  for (const [b, p, q, s] of f.bones) { b.position.copy(p); b.quaternion.copy(q); b.scale.copy(s); }
  // facing: the octant's yaw as the bake turns it (135° − 45° a step, its camera at 45°), on the camera's yaw here
  const want = (135 - 45 * a.row) * Math.PI / 180 + camAz - Math.PI / 4;
  if (f.yaw === null || f.seen < figSeen - 1) f.yaw = want;
  else { let df = want - f.yaw; df -= 2 * Math.PI * Math.round(df / (2 * Math.PI)); f.yaw += df * (1 - Math.exp(-dt * 16)); }
  f.root.rotation.y = f.yaw;
  poseFigure(f, d.clip, Math.min(0.999, u), true);
  const k = (a.cw && meta.cw ? a.cw / meta.cw : 1) * T.ppu / NATIVE_PER_UNIT;
  f.root.scale.setScalar(k);
  f.root.position.set(a.x, game.tileMap.getHeight(a.x, a.z) - T.minY * k, a.z);
  f.root.updateMatrixWorld(true);
  // its light: a share of the sprites' self-light, a hit's white flash, a wind-up's ember glow (as the sprites' tint)
  const fl = a.flash || 0, wn = fl ? 0 : Math.round((a.warn || 0) * 20) / 20, op = 1 - (a.fade || 0);
  const look = `${figGlow}|${fl}|${wn}|${op.toFixed(2)}`;
  if (f.look !== look) {
    f.look = look;
    for (const q of f.mats) {
      if (!q.own) { if (wn) q.m.emissive.copy(q.base).lerp(WARN_EMI, Math.min(1, wn)); else q.m.emissive.copy(q.base); q.m.emissiveIntensity = figGlow * FILL + fl * 2.6 + wn * 0.9; }
      const tr = op < 0.999; if (q.m.transparent !== tr) { q.m.transparent = tr; q.m.needsUpdate = true; } q.m.opacity = op;
    }
  }
  f.root.visible = true; f.seen = figSeen;
  return true;
}
/** the figures not drawn this frame hidden; one unseen for a minute let go */
function sweepFigures() {
  for (const [k, f] of figs) {
    if (f.seen === figSeen) continue;
    if (f.root.visible) f.root.visible = false;
    if (figSeen - f.seen > 3600) { game.engine.scene.remove(f.root); figs.delete(k); }
  }
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
  G.saturation = 0.74 + 0.18 * n; G.exposure = (0.84 + 0.06 * n) * bright * brightHour;
}
// brightness on top of the hour's grade, a post-tone-map multiply:
//   · brightHour: the game's, each frame (hybrid.js BRIGHT: the Vale's day, dusk and night as the owner set them);
//   · bright: a further one from settings({ bright }), for tuning by captures (tools/capture/rig.mjs "bright").
let bright = 1, brightHour = 1;

// The figures' own light, against the light they stand in. Emberlit's figures read in their full colours at every hour
// (their emissive alpha: a steady glow). Luminati's are lit only by the sky and the lamps, so at dusk and by night the
// townsfolk went to dark silhouettes (the owner, 2026-11-02, from the phone). The glow fills the gap between the
// light here (the hemisphere's and the sun's, by luminance) and a lit figure's FIG_LIT, from SPRITE_OPTS's 0.2 to at
// most FIG_MAX. By day the sky alone is over FIG_LIT, so the glow stays 0.2.
let FIG_LIT = 1.6, FIG_MAX = 1, figGlow = SPRITE_OPTS.emissiveIntensity, figLit = 0;
const lumOf = (c) => 0.2126 * c.r + 0.7152 * c.g + 0.0722 * c.b;
function figureGlow() {
  const L = game?.lighting, h = L?.hemi, sun = L?.sun;
  figLit = (h ? lumOf(h.color) * h.intensity : 0) + (sun ? lumOf(sun.color) * sun.intensity * 0.5 : 0);
  return Math.round(Math.min(FIG_MAX, Math.max(SPRITE_OPTS.emissiveIntensity, FIG_LIT - figLit)) * 100) / 100;
}
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
// ── what Emberlit draws without an atlas (hybrid.js bits): Teague's lantern-cage held at his side, the bolts and arrows
// in flight; a sheet a canvas, pooled as the figures are (the pools' sweep hides what a frame doesn't use)
const bitSheets = new WeakMap();
function bitSheet(b) {
  let sh = bitSheets.get(b.canvas);
  if (!sh) {
    const tex = new THREE.CanvasTexture(b.canvas); tex.magFilter = tex.minFilter = THREE.NearestFilter; tex.generateMipmaps = false; tex.colorSpace = THREE.SRGBColorSpace;
    sh = { texture: tex, frameWidth: b.canvas.width, frameHeight: b.canvas.height, columns: 1, rows: 1, pixelsPerUnit: NATIVE_PER_UNIT, anchor: [b.ax / b.canvas.width, 0],
      animations: { idle_down: { frames: [{ col: 0, row: 0 }], fps: 1, loop: false } }, name: 'ember-bit' };
    bitSheets.set(b.canvas, sh);
  }
  return sh;
}
function bitFor(sheet, n) {
  let p = pools.get(sheet); if (!p) pools.set(sheet, (p = []));
  while (p.length <= n) { const s = new Sprite3D(sheet, { ...SPRITE_OPTS, castShadow: false, blobShadow: false }); s.visible = false; game.engine.scene.add(s); p.push(s); }
  return p[n];
}
// ── the Abbess's water (hybrid.js water): a dark teal square a flooded tile, the tide line a little lighter, laid over
// the floor as Emberlit tints it (renderer.js paintHazards); one instanced draw, rebuilt only when the water comes in
const WATER = { mesh: null, id: '', cap: 0 };
function placeWater(w) {
  if (!w || !w.cells.length) { if (WATER.mesh) WATER.mesh.visible = false; WATER.id = ''; return; }
  if (w.id === WATER.id && WATER.mesh) { WATER.mesh.visible = true; return; }
  const n = w.cells.length / 3;
  if (!WATER.mesh || WATER.cap < n) {
    if (WATER.mesh) { game.engine.scene.remove(WATER.mesh); WATER.mesh.geometry.dispose(); WATER.mesh.material.dispose(); }
    const geo = new THREE.PlaneGeometry(0.5, 0.5); geo.rotateX(-Math.PI / 2);
    const mat = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.72, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2, toneMapped: false });
    WATER.cap = Math.max(256, Math.ceil(n * 1.5)); WATER.mesh = new THREE.InstancedMesh(geo, mat, WATER.cap); WATER.mesh.renderOrder = 2; WATER.mesh.frustumCulled = false;
    game.engine.scene.add(WATER.mesh);
  }
  const m = new THREE.Matrix4(), deep = new THREE.Color().setRGB(16 / 255, 54 / 255, 64 / 255, THREE.SRGBColorSpace), shore = new THREE.Color().setRGB(40 / 255, 92 / 255, 104 / 255, THREE.SRGBColorSpace);
  for (let i = 0; i < n; i++) { const x = w.cells[i * 3], z = w.cells[i * 3 + 1]; m.makeTranslation(x, game.tileMap.getHeight(x, z) + 0.035, z); WATER.mesh.setMatrixAt(i, m); WATER.mesh.setColorAt(i, w.cells[i * 3 + 2] ? shore : deep); }
  WATER.mesh.count = n; WATER.mesh.instanceMatrix.needsUpdate = true; if (WATER.mesh.instanceColor) WATER.mesh.instanceColor.needsUpdate = true;
  WATER.mesh.visible = true; WATER.id = w.id;
}
const beastPool = [];                                         // Sprite3D, re-sheeted as their frame changes
function beastSprite(n, sheet) {
  let s = beastPool[n];
  if (s && s.sheet !== sheet) { game.engine.scene.remove(s); s.dispose?.(); s = null; }
  if (!s) { s = new Sprite3D(sheet, { ...SPRITE_OPTS }); game.engine.scene.add(s); beastPool[n] = s; }
  if (s.material.emissiveIntensity !== figGlow) s.material.emissiveIntensity = figGlow;
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
  // (and its pixel ratio: the phone's own, to 3×, where Luminati drew at 1.25× and the browser stretched it 2.4× on a 3×
  // phone: the owner's 4b "at 3x", docs/dungeon-kit-proposal.md §9)
  Object.assign(globalThis, { __emberUiRoot: uiRoot, __emberInputTarget: new EventTarget(), __emberSilent: true, __emberPixelRatio: PIXEL_RATIO });
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
// a foe's warning (renderer.js warnsNow, battle.js 'windup'): Luminati's own enemy marker (GroundMarkers' style 0: a
// red-orange rim, its fill 0.22 → 0.5 as the blow comes, the rim white as it lands), drawn as the rings are: a heavy
// blow's disc filling out to its rim under the one it's meant for; a shot's lane, a bed the length of the shot and its
// fill running along it to the mark. A lane is a unit strip from its start (x 0..1), turned and stretched to the shot.
const WRIM_GEO = new THREE.RingGeometry(0.88, 1, 40), LANE_GEO = new THREE.PlaneGeometry(1, 1).translate(0.5, 0, 0);
const groundMat = () => new THREE.MeshBasicMaterial({ transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2, toneMapped: false });
const groundPools = { ring: [], disc: [], rim: [], focus: [], wfill: [], wrim: [], lane: [] };
const GEO = { ring: RING_GEO, disc: DISC_GEO, rim: RIM_GEO, focus: FOCUS_GEO, wfill: DISC_GEO, wrim: WRIM_GEO, lane: LANE_GEO };
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
/** a lane on the ground from (x, z) toward (tx, tz), u (0..1) of the way, w wide */
function placeLane(m, x, z, tx, tz, u, w, col, a) {
  const dx = tx - x, dz = tz - z, len = Math.hypot(dx, dz) * u;
  m.visible = a > 0.01 && len > 0.02; if (!m.visible) return;
  m.position.set(x, Math.max(game.tileMap.getHeight(x, z), game.tileMap.getHeight(tx, tz)) + 0.05, z);
  m.rotation.z = Math.atan2(-dz, dx); m.scale.set(len, w, 1);
  m.material.color.setRGB(col[0] / 255, col[1] / 255, col[2] / 255, THREE.SRGBColorSpace); m.material.opacity = a;
}
const WARN = [255, 86, 30], WARN_HOT = [255, 238, 220], WARN_INK = [24, 6, 4];
let blastLight = null, carryLight = null, carryLevel = -1, focusSpin = 0, frameAmbient = null, inside = false;

// ── two skills in Luminati's own looks (renderer.js spells; docs/combat-fx.md "Frost Nova and Turn Undead on Luminati") ─
// Frost Nova: Luminati's ice mage's pieces (her Glacial Tomb): frost spreading over the ground with its cracks racing out
// (GroundFrost: painted from the cast, over a few frames, so it's ready as the nova lands), a ring of 3D ice crystals
// shooting up round its edge and one under each foe it took, glinting, cracking and sinking away; a cold spell light.
// Turn Undead: the cleric's (her Judgement): her sun glyph drawn under her as she casts, a shockwave out to its reach,
// a pillar of light striking down on each of the dead it took with a burst at its foot, a burst over her; a gold light.
// Made once, at the first fight, and warmed (their programs compiled behind the frames of a level being built); every
// piece freed when its spell ends. Emberlit draws these two skills itself (skillfx.js); here they replace its light.
const HOLY = { body: [1.15, 0.8, 0.16], core: [1.6, 1.25, 0.3], burst: [1.45, 1.08, 0.22], glyph: [0.85, 0.6, 0.12], ring: [0.8, 0.56, 0.1] };
// (the owner's review, 2026-11-08: the five Luminati looks) her heals' green-lime (HolySpellFx LIFE), a ward's azure, the
// taunt's amber, fire
const LIFE = { body: [0.32, 0.85, 0.1], core: [0.75, 1.65, 0.25] }, WARD = [0.45, 0.75, 1.4], TAUNT = [1.6, 0.85, 0.25], FLAME = [1.6, 0.8, 0.3];
const smooth = (u) => (u <= 0 ? 0 : u >= 1 ? 1 : u * u * (3 - 2 * u)), clamp01 = (u) => (u < 0 ? 0 : u > 1 ? 1 : u);
/** a crystal's eruption (IceSpellFx riseAt): up to 1.15 at 55 % of its rise, settling to 1 */
const riseAt = (u) => (u <= 0 ? 0 : u < 0.55 ? 1.15 * (1 - (1 - u / 0.55) ** 3) : u < 1 ? 1.15 - 0.15 * smooth((u - 0.55) / 0.45) : 1);
let SK = null, spellLight = null;
const spellLive = new Map(), qp = {}, camDir = new THREE.Vector3();
function spellKit() {
  if (SK || !game?.engine) return SK;
  const scene = game.engine.scene;
  const crystals = new IceCrystals({ capacity: 48 });
  const frost = new GroundFrost({ capacity: 4, heightField: { sample: (x, z) => game.tileMap.getHeight(x, z), surface: (x, z) => game.tileMap._surface(x, z), minX: 0, minZ: 0,
    get maxX() { return game.tileMap.width; }, get maxZ() { return game.tileMap.depth; } } });   // (read at each paint: the level of the moment)
  const quads = new FxQuads({ atlas: createFxAtlas(), capacity: 320, name: 'ember:spells' });
  const dome = new WardDome(), blades = new SpectralBlades({ capacity: 15 }), rocks = new RockSpikes({ capacity: 24 }), bells = new SpectralBells({ capacity: 2 });
  quads.enableHalo();
  scene.add(crystals.object); scene.add(frost.object); scene.add(quads.object); scene.add(dome.object); scene.add(blades.object); scene.add(rocks.object); scene.add(bells.object);
  crystals.warm(); frost.warm(); dome.warm(); blades.warm(); rocks.warm(); bells.warm();
  const wq = quads.alloc(); quads.set(wq, { frame: 'partyPillar', x: 0, y: -500, z: 0, mode: 'billboard', a: 1, halo: 1 });
  SK = { crystals, frost, quads, dome, blades, rocks, bells, warmQuad: wq, warmN: 4, domeOf: null };
  return SK;
}
function q(h, o) { for (const k in qp) delete qp[k]; Object.assign(qp, o); SK.quads.set(h, qp); }
function freeSpell(rec) {
  for (const h of rec.blades || []) SK.blades.free(h);
  for (const h of rec.rocks || []) SK.rocks.free(h);
  for (const h of rec.bells || []) SK.bells.free(h);
  if (rec.dome && SK.domeOf === rec) { SK.dome.hide(); SK.domeOf = null; }
  for (const h of rec.crystals) SK.crystals.free(h);
  for (const h of rec.quads) SK.quads.free(h);
  if (rec.gf >= 0) SK.frost.free(rec.gf);
}
/** the frame's spells: start, animate, end @param {any[]} spells @param {number} dt @param {number} [lamps] @param {boolean} [fight] */
function placeSpells(spells, dt, lamps, fight) {
  if (!SK && !fight && !spells.length) return;                // (made as the first fight starts: warmed before anyone casts)
  const K = spellKit(); if (!K) return;
  if (K.warmN > 0 && --K.warmN === 0) { K.crystals.unwarm(); K.frost.unwarm(); K.dome.unwarm(); K.blades.unwarm(); K.rocks.unwarm(); K.bells.unwarm(); K.quads.free(K.warmQuad); }
  const seen = new Set(), H = (x, z) => game.tileMap.getHeight(x, z);
  game.engine.camera.getWorldDirection(camDir); const cl = Math.hypot(camDir.x, camDir.z) || 1, vx = -camDir.x / cl, vz = -camDir.z / cl;   // (toward the camera: a pillar stands a little in front of its foe)
  let light = null;
  for (const S of spells) {
    seen.add(S.key);
    let rec = spellLive.get(S.key);
    if (!rec) { rec = { crystals: [], quads: [], gf: -1, landed: false, seed: (S.seed >>> 0) % 8192 }; spellLive.set(S.key, rec); }
    const L = S.land;                                         // s since it landed (null: still being cast)
    if (S.id === 'frost_nova') {
      if (rec.gf < 0) rec.gf = K.frost.add({ x: S.tx, z: S.tz, radius: Math.max(0.6, Math.min(7, S.r)), seed: rec.seed + 1 });
      if (L != null && !rec.landed) {                         // the eruption: a ring round the edge, one under each foe taken
        rec.landed = true; rec.spikes = [];
        const N = 7;
        for (let i = 0; i < N; i++) {
          const a = (i / N) * Math.PI * 2 + (rec.seed % 7) * 0.13, d = S.r * (0.72 + 0.12 * ((i * 37 + rec.seed) % 5) / 4), x = S.tx + Math.cos(a) * d, z = S.tz + Math.sin(a) * d;
          rec.spikes.push({ x, z, height: 0.75 + 0.35 * (((i * 53 + rec.seed) % 7) / 6), radius: 0.17, yaw: a, tiltX: Math.cos(a) * 0.18, tiltZ: Math.sin(a) * 0.18, start: 0.03 * i });
        }
        for (const o of S.reached.slice(0, 4)) rec.spikes.push({ x: o.x + 0.12, z: o.z - 0.18, height: 0.95, radius: 0.2, yaw: 0, tiltX: 0, tiltZ: 0, start: 0.05 });
        for (const sp of rec.spikes) { sp.h = K.crystals.spawn({ x: sp.x, y: H(sp.x, sp.z) - 0.02, z: sp.z, height: sp.height, radius: sp.radius, yaw: sp.yaw, tiltX: sp.tiltX, tiltZ: sp.tiltZ, seed: rec.seed + sp.x * 7 }); if (sp.h >= 0) rec.crystals.push(sp.h); }
      }
      const flare = L != null ? Math.exp(-L / 0.15) : 0;
      if (rec.gf >= 0) K.frost.set(rec.gf, { spread: L == null ? 0.08 * smooth(S.age / 0.38) : 0.08 + 0.92 * smooth(L / 0.3), cracks: L == null ? 0 : smooth((L - 0.04) / 0.5), fade: L == null ? 0 : smooth((L - 1.5) / 1.0), glow: 1 + 0.8 * flare });
      if (rec.spikes) for (const sp of rec.spikes) {
        if (sp.h < 0) continue;
        const u = (L - sp.start) / 0.13, crack = smooth((L - 0.55) / 0.3), sink = smooth((L - 0.88) / 0.3);
        K.crystals.set(sp.h, { rise: riseAt(u) * (1 - sink), crack, glint: smooth((L - 0.08 - sp.start) / 0.38), glow: 1 + 0.35 * Math.exp(-Math.max(0, L - sp.start - 0.07) / 0.1) + 0.2 * flare + 0.5 * crack });
      }
      const k = L == null ? 0.25 * smooth(S.age / 0.38) : 0.25 + 3.2 * flare + 0.6 * (1 - smooth((L - 0.4) / 0.6));
      if (!light || k > light.k) light = { x: S.tx, z: S.tz, k, color: [0.55, 0.95, 1.9] };
    } else if (S.id === 'turn_undead') {
      // her glyph under her: drawn as she casts, burning out after the burst
      if (!rec.glyph) { rec.glyph = K.quads.alloc(); rec.quads.push(rec.glyph); }
      const g = L == null ? smooth(S.age / 0.38) : 1, out = L == null ? 1 : 1 - smooth((L - 0.35) / 0.5), y0 = H(S.x, S.z) + 0.04;
      q(rec.glyph, { frame: 'partyGlyphHoly', x: S.x, y: y0, z: S.z, mode: 'flat', scale: (2 * S.r / 8) * (0.35 + 0.65 * g), rot: S.age * 0.9, r: HOLY.glyph[0], g: HOLY.glyph[1], b: HOLY.glyph[2], a: 0.85 * g * out * (L != null && L < 0.12 ? 1.25 : 1) });
      if (L != null) {
        if (!rec.landed) {                                    // the burst: the shockwave, a burst over her, a pillar on each of the dead
          rec.landed = true;
          rec.ring = K.quads.alloc(); rec.over = K.quads.alloc(); rec.quads.push(rec.ring, rec.over);
          rec.dead = S.reached.slice(0, 6).map((o) => { const d = Math.hypot(o.x - S.x, o.z - S.z); const body = K.quads.alloc(), core = K.quads.alloc(), foot = K.quads.alloc(); rec.quads.push(body, core, foot); return { x: o.x, z: o.z, at: 0.06 + 0.12 * Math.min(1, d / Math.max(0.5, S.r)), body, core, foot }; });
        }
        const u = smooth(L / 0.32);
        q(rec.ring, { frame: 'partyRing', index: L < 0.16 ? 0 : 1, x: S.x, y: y0 + 0.02, z: S.z, mode: 'flat', scale: (2.2 * S.r / 6) * (0.15 + 0.85 * u), r: HOLY.ring[0], g: HOLY.ring[1], b: HOLY.ring[2], a: 0.9 * (1 - smooth((L - 0.2) / 0.3)) });
        q(rec.over, { frame: 'partySunburst', index: Math.min(3, Math.floor(L / 0.08)), x: S.x + vx * 0.3, y: y0 + 1.5, z: S.z + vz * 0.3, mode: 'billboard', scale: 1.5, r: HOLY.burst[0], g: HOLY.burst[1], b: HOLY.burst[2], a: 1 - smooth((L - 0.15) / 0.2), halo: 1 });
        for (const D of rec.dead) {
          const t = L - D.at, yf = H(D.x, D.z), sc = 0.85, lift = (96 / 2 / 16) * sc;
          if (t < 0) { q(D.body, { frame: 'partyPillar', a: 0 }); q(D.core, { frame: 'partyPillar', a: 0 }); q(D.foot, { frame: 'partySunburst', a: 0 }); continue; }
          q(D.body, { frame: 'partyPillar', index: 1 + Math.min(2, Math.floor(t / 0.107)), x: D.x + vx * 0.15, y: yf + lift, z: D.z + vz * 0.15, mode: 'billboard', scale: sc, r: HOLY.body[0], g: HOLY.body[1], b: HOLY.body[2], a: 0.9 * Math.max(0, Math.min(1, (0.32 - t) / 0.14)) });
          q(D.core, { frame: 'partyPillar', index: 0, x: D.x + vx * 0.17, y: yf + lift, z: D.z + vz * 0.17, mode: 'billboard', scale: sc, r: HOLY.core[0], g: HOLY.core[1], b: HOLY.core[2], a: Math.max(0, Math.min(1, (0.24 - t) / 0.1)), halo: 1 });
          q(D.foot, { frame: 'partySunburst', index: Math.min(3, Math.floor(t / 0.08)), x: D.x, y: yf + 0.05, z: D.z, mode: 'flat', scale: 1.1, rot: t * 2, r: HOLY.burst[0], g: HOLY.burst[1], b: HOLY.burst[2], a: Math.max(0, 1 - t / 0.4), halo: 1 });
        }
      }
      const k = L == null ? 0.4 * smooth(S.age / 0.38) : 0.4 + 3.4 * Math.exp(-L / 0.18);
      if (!light || k > light.k) light = { x: S.x, z: S.z, k, color: [1.9, 1.4, 0.5] };
    } else if (S.id === 'mend' && L != null) {
      // her Mend (HolySpellFx's): three orbs flying from her staff to the ally, then a pillar of green light on them
      if (!rec.orbs) { rec.orbs = [0, 1, 2].map(() => K.quads.alloc()); rec.body = K.quads.alloc(); rec.core = K.quads.alloc(); rec.foot = K.quads.alloc(); rec.quads.push(...rec.orbs, rec.body, rec.core, rec.foot); }
      const y0 = H(S.x, S.z) + 1.2, y1 = H(S.tx, S.tz) + 0.9;
      rec.orbs.forEach((h, i) => { const u = clamp01((L - i * 0.05) / 0.3), arc = Math.sin(u * Math.PI) * 0.6;
        q(h, { frame: 'partyHolyOrb', index: Math.floor(L * 12) % 2, x: S.x + (S.tx - S.x) * u + vx * 0.2, y: y0 + (y1 - y0) * u + arc, z: S.z + (S.tz - S.z) * u + vz * 0.2, mode: 'billboard', scale: 1.2, r: LIFE.core[0], g: LIFE.core[1], b: LIFE.core[2], a: u > 0 && u < 1 ? 1 : 0, halo: 1 }); });
      const p = L - 0.3, yf = H(S.tx, S.tz), sc = 0.6, lift = (96 / 2 / 16) * sc;
      q(rec.body, { frame: 'partyPillar', index: 1 + Math.min(2, Math.max(0, Math.floor(p / 0.13))), x: S.tx + vx * 0.3, y: yf + lift, z: S.tz + vz * 0.3, mode: 'billboard', scale: sc, r: LIFE.body[0], g: LIFE.body[1], b: LIFE.body[2], a: p > 0 ? 0.85 * clamp01((0.45 - p) / 0.18) : 0 });
      q(rec.core, { frame: 'partyPillar', index: 0, x: S.tx + vx * 0.32, y: yf + lift, z: S.tz + vz * 0.32, mode: 'billboard', scale: sc, r: LIFE.core[0], g: LIFE.core[1], b: LIFE.core[2], a: p > 0 ? clamp01((0.28 - p) / 0.1) : 0, halo: 1 });
      q(rec.foot, { frame: 'partySunburst', index: Math.min(3, Math.max(0, Math.floor(p / 0.08))), x: S.tx, y: yf + 0.05, z: S.tz, mode: 'flat', scale: 1, rot: p * 2, r: LIFE.core[0], g: LIFE.core[1], b: LIFE.core[2], a: p > 0 ? Math.max(0, 1 - p / 0.5) : 0, halo: 1 });
      const k = p > 0 ? 2.6 * Math.exp(-p / 0.2) : 0.3;
      if (!light || k > light.k) light = { x: S.tx, z: S.tz, k, color: [0.6, 1.8, 0.5] };
    } else if (S.id === 'bless' && L != null) {
      // her glyph turning under her (Sanctuary's, in gold), a burst over each of the party
      if (!rec.glyph) { rec.glyph = K.quads.alloc(); rec.bursts = S.reached.slice(0, 4).map(() => K.quads.alloc()); rec.quads.push(rec.glyph, ...rec.bursts); }
      const g = smooth(L / 0.3) * (1 - smooth((L - 0.9) / 0.5));
      q(rec.glyph, { frame: 'partyGlyphHoly', x: S.x, y: H(S.x, S.z) + 0.04, z: S.z, mode: 'flat', scale: 0.32 + 0.14 * smooth(L / 0.3), rot: L * 0.8, r: HOLY.glyph[0], g: HOLY.glyph[1], b: HOLY.glyph[2], a: 0.9 * g });
      rec.bursts.forEach((h, i) => { const o = S.reached[i], t = L - 0.15; q(h, { frame: 'partySunburst', index: Math.min(3, Math.max(0, Math.floor(t / 0.08))), x: o.x + vx * 0.2, y: H(o.x, o.z) + 1.7, z: o.z + vz * 0.2, mode: 'billboard', scale: 0.9, r: HOLY.burst[0], g: HOLY.burst[1], b: HOLY.burst[2], a: t > 0 ? Math.max(0, 1 - t / 0.4) : 0, halo: 1 }); });
      const k = 1.8 * Math.exp(-L / 0.35);
      if (!light || k > light.k) light = { x: S.x, z: S.z, k, color: [1.9, 1.4, 0.5] };
    } else if (S.id === 'cleave' && L != null) {
      // three spectral swords (the swordmaster's) swept round the fighter toward the foe and past, then gone
      if (!rec.blades) rec.blades = [0, 1, 2].map((i) => K.blades.spawn({ x: S.x, y: -500, z: S.z, length: 1.1, width: 0.17, palette: 0, seed: rec.seed + i * 7 }));
      const a0 = Math.atan2(S.tz - S.z, S.tx - S.x), sweep = -0.9 + 1.8 * smooth(L / 0.22), yb = H(S.x, S.z) + 0.75;
      rec.blades.forEach((h, i) => { if (h < 0) return; const a = a0 + (i - 1) * 0.55 + sweep, c = Math.cos(a), sn = Math.sin(a), R = 1.05;
        K.blades.set(h, { x: S.x + c * R, y: yb, z: S.z + sn * R, ax: -c, ay: 0.05, az: -sn, nx: 0, ny: 1, nz: 0, glow: 1.5, runes: smooth(L / 0.15), dissolve: smooth((L - 0.28) / 0.3), dissolveDir: 1, ghost: 0.15 }); });
    } else if (S.id === 'shield_wall' && L != null) {
      // the war cry's snap: an amber ring under each foe it turns (Bulwark's)
      if (!rec.snaps) { rec.snaps = S.reached.slice(0, 8).map(() => K.quads.alloc()); rec.quads.push(...rec.snaps); }
      rec.snaps.forEach((h, i) => { const o = S.reached[i], u = clamp01(L / 0.35); q(h, { frame: 'partyRing', index: u < 0.5 ? 0 : 1, x: o.x, y: H(o.x, o.z) + 0.05, z: o.z, mode: 'flat', scale: 0.25 + 0.2 * u, r: TAUNT[0], g: TAUNT[1], b: TAUNT[2], a: 1 - u }); });
    } else if (S.id === 'aura_wall') {
      // Bulwark's hex dome over the walled fighter while it lasts: rising as it begins, dissolving over its last 0.8 s (one dome)
      if (!K.domeOf || !spellLive.has(K.domeOf.key)) { K.dome.show({ x: S.x, y: H(S.x, S.z), z: S.z, radius: 1.15 }); K.domeOf = rec; rec.key = S.key; rec.dome = true; rec.t = 0; }
      if (K.domeOf === rec) { rec.t += dt; K.dome.object.position.set(S.x, H(S.x, S.z), S.z); K.dome.object.updateMatrix(); K.dome.object.updateMatrixWorld(true);
        const sw = (rec.t * 0.6) % 1; K.dome.set({ rise: smooth(rec.t / 0.35), dissolve: 1 - clamp01(S.k / 0.8), sweepA: sw, sweepB: (sw + 0.5) % 1 }); }
    } else if (S.id === 'aura_ward') {
      // Arcane Ward's ring under the warded ally (it read better than a dome on three people), a slow pulse
      if (!rec.ring) { rec.ring = K.quads.alloc(); rec.quads.push(rec.ring); rec.t = 0; } rec.t += dt;
      q(rec.ring, { frame: 'partyWardRing', x: S.x, y: H(S.x, S.z) + 0.05, z: S.z, mode: 'flat', scale: 0.85 + 0.05 * Math.sin(rec.t * 4), rot: rec.t * 0.5, r: WARD[0], g: WARD[1], b: WARD[2], a: 0.9 * smooth(rec.t / 0.25), halo: 1 });
    } else if (S.id === 'firebolt_fly') {
      // the Firebolt in flight: Luminati's ember bolt riding it
      if (!rec.bolt) { rec.bolt = K.quads.alloc(); rec.quads.push(rec.bolt); rec.t = 0; } rec.t += dt;
      q(rec.bolt, { frame: 'emberBolt', index: Math.floor(rec.t * 12) % 2, x: S.x + vx * 0.2, y: H(S.x, S.z) + 1.0, z: S.z + vz * 0.2, mode: 'billboard', scale: 1.5, r: FLAME[0], g: FLAME[1], b: FLAME[2], a: 1, halo: 1 });
    } else if (S.id === 'firebolt' && L != null) {
      // where it lands: flames licking up round the blast (wallFlame), an impact at its heart (the light: the blast's)
      if (!rec.flames) { rec.flames = [0, 1, 2, 3, 4, 5].map(() => K.quads.alloc()); rec.hit = K.quads.alloc(); rec.quads.push(...rec.flames, rec.hit); }
      const g = smooth(L / 0.12) * (1 - smooth((L - 0.5) / 0.6)), yf = H(S.tx, S.tz);
      rec.flames.forEach((h, i) => { const a = (i / 6) * Math.PI * 2 + (rec.seed % 5) * 0.3, rr = 0.45 + 0.15 * ((i * 3 + rec.seed) % 4) / 3;
        q(h, { frame: 'wallFlame', index: Math.floor(L * 10 + i) % 4, x: S.tx + Math.cos(a) * rr, y: yf + 0.55 * (0.8 + 0.3 * g), z: S.tz + Math.sin(a) * rr, mode: 'billboard', scale: 0.9 + 0.3 * g, r: FLAME[0], g: FLAME[1], b: FLAME[2], a: g, halo: 1 }); });
      q(rec.hit, { frame: 'impact', index: Math.min(3, Math.floor(L * 14)), x: S.tx + vx * 0.3, y: yf + 0.9, z: S.tz + vz * 0.3, mode: 'billboard', scale: 3, r: 1.8, g: 1.2, b: 0.5, a: L < 0.3 ? 1 : 0, halo: 1 });
    } else if (TIER_LOOK[S.id]) {
      const lt = TIER_LOOK[S.id](S, rec, L, K, H, vx, vz, dt);
      if (lt && (!light || lt.k > light.k)) light = lt;
    }
  }
  for (const [key, rec] of spellLive) if (!seen.has(key)) { freeSpell(rec); spellLive.delete(key); }
  if (spellLight) {
    if (light && light.k > 0.02) spellLight.set(light.x, H(light.x, light.z) + 1.4, light.z, { color: light.color, intensity: 2.6 * light.k / (lamps ?? 1), distance: 6.5, decay: 1.5, flicker: 0.08 });
    else spellLight.off();
  }
  if (K.domeOf && !spellLive.has(K.domeOf.key)) { K.dome.hide(); K.domeOf = null; }
  K.crystals.update(dt); K.frost.update(dt); K.blades.update(dt); K.rocks.update(dt); K.bells.update(dt); K.quads.update();
}

// ── the tiers' skills in Luminati's looks (GDD v1.55; the owner's picks: renderer.js TIER_LUM, the rest Emberlit's) ──
// Each from the Luminati move or piece it was drawn from (docs/skill-trees-proposal.md §5): the swordmaster's falling
// sword, wave, crest and cyclone; the greatshield's rock spikes; the ice mage's shells, crystals, frost and storm; the
// cleric's glyphs and pillars; the bellwarden's bell. S: the spell (world units: a tile is 0.5); rec: its pieces; L: s
// since it landed (null: still cast); returns its light, or null. Every quad, crystal, rock, blade and bell it takes is
// put on rec, so freeSpell frees it.
const STEEL = [1.6, 1.3, 0.85], STEEL_HOT = [2.0, 1.85, 1.45], CRIMSON = [1.7, 0.22, 0.32], VERDANT = [0.45, 1.5, 0.6], IRON = [0.75, 0.72, 0.8],
  ARCANE = [0.55, 0.75, 1.7], FROST_C = [0.55, 0.95, 1.9], SPIRIT = [0.35, 1.45, 1.25], HEXG = [0.75, 1.55, 0.3], VIOLET = [1.15, 0.45, 1.65], DUSTC = [0.7, 0.58, 0.42];
const col = (c, k = 1) => ({ r: c[0] * k, g: c[1] * k, b: c[2] * k });
/** n quads on rec, allocated once */
function quadsOf(rec, key, n) { if (!rec[key]) { rec[key] = []; for (let i = 0; i < n; i++) { const h = SK.quads.alloc(); if (h >= 0) { rec[key].push(h); rec.quads.push(h); } } } return rec[key]; }
/** a flat directional frame (pointing along +U) laid along (dx, dz) */
const along = (dx, dz) => { const l = Math.hypot(dx, dz) || 1; return { dirX: dz / l, dirZ: -dx / l }; };
const TIER_LOOK = {
  // FIGHTER · Vault (Skyfall Judgement): his sigil under the foe, the great sword falling onto it, the floor cracking, dust
  vault(S, rec, L, K, H, vx, vz) {
    if (L == null) return null;
    const [sig, sword, crack, hit, ...dust] = quadsOf(rec, 'q', 9), yf = H(S.tx, S.tz), fall = clamp01((L - 0.12) / 0.18);
    q(sig, { frame: 'heroSigil', x: S.tx, y: yf + 0.04, z: S.tz, mode: 'flat', scale: 0.12 + 0.1 * smooth(L / 0.3), rot: L * 1.5, ...col(STEEL, 0.8), a: 0.9 * (1 - smooth((L - 0.5) / 0.4)) });
    q(sword, { frame: 'heroSword', index: L < 0.3 ? 0 : 1, x: S.tx + vx * 0.25, y: yf + 2.4 + 3.2 * (1 - fall), z: S.tz + vz * 0.25, mode: 'billboard', scale: 0.4, ...col(STEEL_HOT), a: L < 0.12 ? 0 : 1 - smooth((L - 0.45) / 0.25), halo: 1 });
    q(crack, { frame: 'heroCrack', x: S.tx, y: yf + 0.05, z: S.tz, mode: 'flat', scale: 0.55 * smooth((L - 0.3) / 0.12), ...col(STEEL, 0.9), a: L > 0.3 ? 1 - smooth((L - 0.6) / 0.35) : 0 });
    q(hit, { frame: 'impact', index: Math.min(3, Math.floor((L - 0.3) * 14)), x: S.tx + vx * 0.3, y: yf + 0.7, z: S.tz + vz * 0.3, mode: 'billboard', scale: 3.2, ...col(STEEL_HOT), a: L > 0.3 && L < 0.6 ? 1 : 0, halo: 1 });
    dust.forEach((h, i) => { const a = i * 1.2566 + (rec.seed % 5) * 0.2, t = L - 0.3, d = 0.3 + 0.6 * smooth(t / 0.4); q(h, { frame: 'dust', index: Math.min(2, Math.floor(t * 8)), x: S.tx + Math.cos(a) * d, y: yf + 0.2 + 0.2 * t, z: S.tz + Math.sin(a) * d, mode: 'billboard', scale: 2, ...col(DUSTC), a: t > 0 ? 1 - smooth(t / 0.5) : 0 }); });
    return L > 0.28 ? { x: S.tx, z: S.tz, k: 2.6 * Math.exp(-(L - 0.3) / 0.2), color: [1.9, 1.5, 0.8] } : null;
  },
  // FIGHTER · Cutting Wave (Dragonfang Wave): the wave racing along its lane, the fang crest riding it
  cutting_wave(S, rec, L, K, H, vx, vz) {
    if (L == null) return null;
    const [w1, w2, crest] = quadsOf(rec, 'q', 3), dx = S.tx - S.fx, dz = S.tz - S.fz, l = Math.hypot(dx, dz) || 1, ux = dx / l, uz = dz / l, run = 3 * smooth(L / 0.35), out = 1 - smooth((L - 0.45) / 0.35);
    const x = S.fx + ux * run, z = S.fz + uz * run, y = H(x, z), d = along(dx, dz);
    q(w1, { frame: 'heroWaveLit', index: Math.floor(L * 24) % 4, x, y: y + 0.1, z, mode: 'flat', ...d, scale: 0.75, ...col(STEEL_HOT), a: out, halo: 1 });
    q(w2, { frame: 'heroWave', index: (Math.floor(L * 24) + 2) % 4, x: x - ux * 0.5, y: y + 0.08, z: z - uz * 0.5, mode: 'flat', ...d, scale: 0.6, ...col(STEEL), a: 0.8 * out });
    q(crest, { frame: 'heroFangCrestLit', index: Math.floor(L * 20) % 4, x: x + vx * 0.2, y: y + 0.55, z: z + vz * 0.2, mode: 'billboard', scale: 0.85, ...col(STEEL_HOT), a: out, halo: 1 });
    return { x, z, k: 1.6 * out, color: [1.7, 1.4, 0.9] };
  },
  // FIGHTER · Earthshatter (the greatshield's): the floor cracks out from him, a ring of stone spikes erupts, crumbles, sinks
  earthshatter(S, rec, L, K, H, vx, vz) {
    if (L == null) return null;
    const yf = H(S.x, S.z), [crack, ring, ...dust] = quadsOf(rec, 'q', 8);
    if (!rec.rocks) { rec.rocks = []; rec.spec = [];
      for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2 + (rec.seed % 9) * 0.07, d = 0.5 + 0.9 * (((i * 37 + rec.seed) % 7) / 6), x = S.x + Math.cos(a) * d, z = S.z + Math.sin(a) * d;
        const h = K.rocks.spawn({ x, y: H(x, z) - 0.02, z, height: 0.75 + 0.5 * (((i * 53 + rec.seed) % 5) / 4), radius: 0.2, yaw: a, tiltX: Math.cos(a) * 0.12, tiltZ: Math.sin(a) * 0.12, seed: rec.seed + i * 11, aspect: 0.7 });
        if (h >= 0) { rec.rocks.push(h); rec.spec.push({ h, start: 0.12 + 0.02 * (i % 4) }); } } }
    for (const sp of rec.spec) K.rocks.set(sp.h, { rise: riseAt((L - sp.start) / 0.14) * (1 - smooth((L - 1.0) / 0.35)), crack: smooth((L - 0.65) / 0.3) });
    q(crack, { frame: 'partyCrack', x: S.x, y: yf + 0.05, z: S.z, mode: 'flat', scale: 0.35 * smooth(L / 0.15), rot: (rec.seed % 7) * 0.4, ...col(DUSTC, 1.1), a: 1 - smooth((L - 1.0) / 0.35) });
    q(ring, { frame: 'partyRing', index: L < 0.15 ? 0 : 1, x: S.x, y: yf + 0.07, z: S.z, mode: 'flat', scale: 0.2 + 0.4 * smooth(L / 0.3), ...col(STEEL, 0.9), a: 1 - smooth((L - 0.1) / 0.3) });
    dust.forEach((h, i) => { const a = i * 1.047 + 0.3, t = L - 0.12, d = 0.6 + 0.8 * smooth(t / 0.5); q(h, { frame: 'dust', index: Math.min(2, Math.floor(t * 6)), x: S.x + Math.cos(a) * d, y: yf + 0.25 + 0.3 * t, z: S.z + Math.sin(a) * d, mode: 'billboard', scale: 2.4, ...col(DUSTC), a: t > 0 ? 1 - smooth(t / 0.7) : 0 }); });
    return { x: S.x, z: S.z, k: 2.2 * Math.exp(-L / 0.25), color: [1.7, 1.3, 0.8] };
  },
  // FIGHTER · Whirling Blades (Tempest Edge): three spectral swords circling him while it lasts, the cyclone's gust under them
  whirling_blades(S, rec, L, K, H, vx, vz) {
    if (L == null) return null;
    if (!rec.blades) rec.blades = [0, 1, 2].map((i) => K.blades.spawn({ x: S.x, y: -500, z: S.z, length: 0.95, width: 0.16, palette: 0, seed: rec.seed + i * 13 }));
    const [gust] = quadsOf(rec, 'q', 1), yb = H(S.x, S.z) + 0.6, on = smooth(L / 0.25), off = smooth((L - 4.6) / 0.45), R = 0.8;
    rec.blades.forEach((h, i) => { if (h < 0) return; const a = L * 5.2 + (i * Math.PI * 2) / 3, c = Math.cos(a), sn = Math.sin(a);
      K.blades.set(h, { x: S.x + c * R, y: yb + 0.08 * Math.sin(L * 7 + i), z: S.z + sn * R, ax: -sn, ay: 0, az: c, nx: 0, ny: 1, nz: 0, glow: 1.4, runes: on, dissolve: Math.max(1 - on, off), dissolveDir: 1, ghost: 0.12 }); });
    q(gust, { frame: 'heroCyclone', index: Math.floor(L * 18) % 4, x: S.x, y: H(S.x, S.z) + 0.15, z: S.z, mode: 'flat', scale: 0.32, rot: -L * 6, ...col(STEEL, 0.75), a: 0.75 * on * (1 - off) });
    return { x: S.x, z: S.z, k: 0.9 * on * (1 - off), color: [1.6, 1.4, 1.0] };
  },
  // ROGUE · Kidney Shot: a short, hard blow (a crimson crit and a hit) and the foe reeling (its stun: aura_stun)
  kidney_shot(S, rec, L, K, H, vx, vz) {
    if (L == null) return null;
    const [crit, hit] = quadsOf(rec, 'q', 2), y = H(S.tx, S.tz);
    q(crit, { frame: 'crit', index: Math.min(3, Math.floor(L * 12)), x: S.tx + vx * 0.3, y: y + 0.85, z: S.tz + vz * 0.3, mode: 'billboard', scale: 2.4, ...col(CRIMSON, 1.2), a: L < 0.35 ? 1 : 0, halo: 1 });
    q(hit, { frame: 'impact', index: Math.min(3, Math.floor(L * 14)), x: S.tx + vx * 0.32, y: y + 0.8, z: S.tz + vz * 0.32, mode: 'billboard', scale: 2.8, r: 1.9, g: 1.5, b: 1.2, a: L < 0.28 ? 1 : 0, halo: 1 });
    return { x: S.tx, z: S.tz, k: 1.4 * Math.exp(-L / 0.15), color: [1.8, 0.5, 0.5] };
  },
  // ROGUE · Fan of Knives: five knives thrown out in a fan, each a verdant streak, a hit where they find someone
  fan_of_knives(S, rec, L, K, H, vx, vz) {
    if (L == null) return null;
    const ks = quadsOf(rec, 'q', 5), hits = quadsOf(rec, 'h', Math.min(4, S.reached.length)), a0 = Math.atan2(S.tz - S.z, S.tx - S.x), run = 3 * smooth(L / 0.28), y0 = H(S.x, S.z) + 0.6;
    ks.forEach((h, i) => { const a = a0 + (i - 2) * 0.26, dx = Math.cos(a), dz = Math.sin(a); q(h, { frame: 'heroBlade', index: Math.floor(L * 20) % 2, x: S.x + dx * (0.3 + run), y: y0, z: S.z + dz * (0.3 + run), mode: 'flat', ...along(dx, dz), scale: 0.6, ...col(VERDANT, 1.2), a: L < 0.3 ? 1 : 0, halo: 1 }); });
    hits.forEach((h, i) => { const o = S.reached[i], t = L - 0.12; q(h, { frame: 'impact', index: Math.min(3, Math.max(0, Math.floor(t * 14))), x: o.x + vx * 0.3, y: H(o.x, o.z) + 0.75, z: o.z + vz * 0.3, mode: 'billboard', scale: 2, ...col(VERDANT, 1.3), a: t > 0 && t < 0.28 ? 1 : 0, halo: 1 }); });
    return null;
  },
  // ROGUE · Shadowstep: smoke where she stood and where she comes out, a crimson cross-cut and its crit on the foe
  shadowstep(S, rec, L, K, H, vx, vz) {
    if (L == null) return null;
    const puffs = quadsOf(rec, 'p', 8), [cut, crit] = quadsOf(rec, 'q', 2), y = H(S.tx, S.tz);
    puffs.forEach((h, i) => { const at = i < 4 ? { x: S.fx, z: S.fz, t: L } : { x: S.tx, z: S.tz, t: L - 0.1 }, a = i * 1.57 + 0.4, t = at.t, d = 0.15 + 0.35 * smooth(t / 0.5);
      q(h, { frame: 'dust', index: Math.min(2, Math.max(0, Math.floor(t * 5))), x: at.x + Math.cos(a) * d, y: H(at.x, at.z) + 0.35 + 0.35 * t, z: at.z + Math.sin(a) * d, mode: 'billboard', scale: 2.6, r: 0.35, g: 0.32, b: 0.45, a: t > 0 ? 1 - smooth(t / 0.6) : 0 }); });
    q(cut, { frame: 'slashBig', index: Math.min(3, Math.max(0, Math.floor((L - 0.12) * 16))), x: S.tx + vx * 0.3, y: y + 0.8, z: S.tz + vz * 0.3, mode: 'billboard', scale: 1.1, rot: 0.6, ...col(CRIMSON, 1.3), a: L > 0.12 && L < 0.4 ? 1 : 0, halo: 1 });
    q(crit, { frame: 'crit', index: Math.min(3, Math.max(0, Math.floor((L - 0.14) * 12))), x: S.tx + vx * 0.32, y: y + 1.0, z: S.tz + vz * 0.32, mode: 'billboard', scale: 2.4, ...col(CRIMSON, 1.4), a: L > 0.14 && L < 0.5 ? 1 : 0, halo: 1 });
    return L > 0.12 ? { x: S.tx, z: S.tz, k: 1.5 * Math.exp(-(L - 0.12) / 0.2), color: [1.8, 0.4, 0.5] } : null;
  },
  // ROGUE · Caltrops: a handful of iron points scattered on the knot, glinting while they lie, a dull crimson ring round them
  caltrops(S, rec, L, K, H, vx, vz) {
    if (L == null) return null;
    const pts = quadsOf(rec, 'q', 14), [ring] = quadsOf(rec, 'r', 1), off = 1 - smooth((L - 5.4) / 0.6), R = Math.max(0.6, S.r);
    pts.forEach((h, i) => { const a = ((i * 137.5 + rec.seed) % 360) * Math.PI / 180, d = R * 0.85 * Math.sqrt(((i * 61 + rec.seed) % 97) / 97), x = S.tx + Math.cos(a) * d, z = S.tz + Math.sin(a) * d, land = clamp01((L - i * 0.015) / 0.25), tw = 0.6 + 0.4 * Math.sin(L * 6 + i * 1.7);
      q(h, { frame: 'partyIceShard', index: i % 4, x, y: H(x, z) + 0.06 + 0.8 * (1 - land) * Math.sin(land * Math.PI), z, mode: 'billboard', scale: 0.55, ...col(IRON, 0.8 + 0.6 * tw), a: land > 0 ? off : 0 }); });
    q(ring, { frame: 'partyRing', index: 1, x: S.tx, y: H(S.tx, S.tz) + 0.05, z: S.tz, mode: 'flat', scale: (2 * R) / 6, ...col(CRIMSON, 0.5), a: 0.7 * smooth(L / 0.3) * off });
    return null;
  },
  // MAGE · Flare: her sigil on the marked foe, then a pillar of fire bursting there, flames round its foot
  flare(S, rec, L, K, H, vx, vz) {
    if (L == null) return null;
    const [sig, body, core, hit, ...fl] = quadsOf(rec, 'q', 10), y = H(S.tx, S.tz), p = L - 0.7;
    q(sig, { frame: 'heroSigil', x: S.tx, y: y + 0.04, z: S.tz, mode: 'flat', scale: 0.1 + 0.12 * smooth(L / 0.7), rot: L * 2.2, ...col(FLAME, 0.9), a: L < 0.7 ? 0.8 + 0.2 * Math.sin(L * 30) : 1 - smooth(p / 0.3) });
    q(body, { frame: 'pillar', index: Math.floor(Math.max(0, p) * 12) % 4, x: S.tx + vx * 0.2, y: y + 1.6, z: S.tz + vz * 0.2, mode: 'billboard', scale: 1.4, ...col(FLAME, 1.1), a: p > 0 ? 1 - smooth((p - 0.25) / 0.3) : 0, halo: 1 });
    q(core, { frame: 'partyPillar', index: 0, x: S.tx + vx * 0.22, y: y + 1.5, z: S.tz + vz * 0.22, mode: 'billboard', scale: 0.8, r: 2.0, g: 1.5, b: 0.7, a: p > 0 ? clamp01((0.25 - p) / 0.1) : 0, halo: 1 });
    q(hit, { frame: 'impact', index: Math.min(3, Math.max(0, Math.floor(p * 14))), x: S.tx + vx * 0.3, y: y + 0.6, z: S.tz + vz * 0.3, mode: 'billboard', scale: 3.4, r: 2.0, g: 1.3, b: 0.5, a: p > 0 && p < 0.3 ? 1 : 0, halo: 1 });
    fl.forEach((h, i) => { const a = i * 1.047, rr = 0.55; q(h, { frame: 'wallFlame', index: Math.floor(L * 10 + i) % 4, x: S.tx + Math.cos(a) * rr, y: y + 0.5, z: S.tz + Math.sin(a) * rr, mode: 'billboard', scale: 1, ...col(FLAME), a: p > 0 ? 1 - smooth((p - 0.25) / 0.35) : 0, halo: 1 }); });
    return { x: S.tx, z: S.tz, k: p > 0 ? 3.2 * Math.exp(-p / 0.25) : 0.4 * smooth(L / 0.7), color: [1.9, 0.95, 0.35] };
  },
  // MAGE · Gather: an arcane whirl on the knot drawing inward, a streak from each foe it pulls
  gather(S, rec, L, K, H, vx, vz) {
    if (L == null) return null;
    const [sw1, sw2] = quadsOf(rec, 'q', 2), pulls = quadsOf(rec, 'p', Math.min(5, S.reached.length)), y = H(S.tx, S.tz), out = 1 - smooth((L - 0.5) / 0.35);
    q(sw1, { frame: 'partySwirl', index: Math.floor(L * 8) % 2, x: S.tx, y: y + 0.08, z: S.tz, mode: 'flat', scale: (S.r * 2 / 5) * (1 - 0.6 * smooth(L / 0.5)), rot: L * 7, ...col(ARCANE, 1.1), a: out });
    q(sw2, { frame: 'partySwirl', index: (Math.floor(L * 8) + 1) % 2, x: S.tx, y: y + 0.5, z: S.tz, mode: 'flat', scale: (S.r * 2 / 7) * (1 - 0.6 * smooth(L / 0.5)), rot: -L * 9, ...col(ARCANE, 1.4), a: 0.8 * out, halo: 1 });
    pulls.forEach((h, i) => { const o = S.reached[i], u = smooth(L / 0.4), x = o.x + (S.tx - o.x) * 0.5 * u, z = o.z + (S.tz - o.z) * 0.5 * u; q(h, { frame: 'heroGaleLit', index: Math.floor(L * 20) % 4, x, y: H(x, z) + 0.4, z, mode: 'flat', ...along(S.tx - o.x, S.tz - o.z), scale: 0.45, ...col(ARCANE, 1.3), a: L < 0.45 ? 1 : 0 }); });
    return { x: S.tx, z: S.tz, k: 1.4 * out, color: [0.6, 0.85, 1.9] };
  },
  // MAGE · Glacial Tomb (hers): frost over the knot, each foe it takes locked in an ice shell, crystals round them; it shatters
  glacial_tomb(S, rec, L, K, H, vx, vz) {
    if (rec.gf == null || rec.gf < 0) rec.gf = K.frost.add({ x: S.tx, z: S.tz, radius: Math.max(0.6, Math.min(4, S.r)), seed: rec.seed + 3 });
    if (L == null) { if (rec.gf >= 0) K.frost.set(rec.gf, { spread: 0.1 * smooth(S.age / 0.38), cracks: 0, fade: 0, glow: 1 }); return { x: S.tx, z: S.tz, k: 0.25, color: [0.55, 0.95, 1.9] }; }
    const shells = quadsOf(rec, 's', Math.min(5, S.reached.length)), brk = smooth((L - 2.4) / 0.3);
    if (!rec.spikes) { rec.spikes = [];
      for (const o of S.reached.slice(0, 5)) for (let j = 0; j < 2; j++) { const a = j * 2.6 + rec.seed * 0.01, x = o.x + Math.cos(a) * 0.32, z = o.z + Math.sin(a) * 0.32, h = K.crystals.spawn({ x, y: H(x, z) - 0.02, z, height: 0.55, radius: 0.13, yaw: a, tiltX: Math.cos(a) * 0.1, tiltZ: Math.sin(a) * 0.1, seed: rec.seed + j * 7 }); if (h >= 0) { rec.crystals.push(h); rec.spikes.push(h); } } }
    rec.spikes.forEach((h) => K.crystals.set(h, { rise: riseAt(L / 0.13) * (1 - brk), crack: smooth((L - 2.1) / 0.3), glint: smooth(L / 0.4), glow: 1.1 }));
    if (rec.gf >= 0) K.frost.set(rec.gf, { spread: 0.1 + 0.9 * smooth(L / 0.3), cracks: smooth((L - 0.1) / 0.5), fade: smooth((L - 2.3) / 0.6), glow: 1 + 0.6 * Math.exp(-L / 0.2) });
    shells.forEach((h, i) => { const o = S.reached[i]; q(h, { frame: 'partyIceShellLit', index: L > 2.1 ? 1 : 0, x: o.x + vx * 0.12, y: H(o.x, o.z) + 0.6, z: o.z + vz * 0.12, mode: 'billboard', scale: 1.15 - 0.1 * smooth(L / 0.1), ...col(FROST_C, 0.85), a: (L > 0.05 ? 1 : 0) * (1 - brk), halo: 1 }); });
    return { x: S.tx, z: S.tz, k: 0.4 + 2.4 * Math.exp(-L / 0.2) + 1.8 * Math.exp(-Math.abs(L - 2.5) / 0.1), color: [0.55, 0.95, 1.9] };
  },
  // MAGE · Blizzard (hers): two storm whirls turning over the knot, snow falling through them, frost on the floor under it
  blizzard(S, rec, L, K, H, vx, vz) {
    if (L == null) return null;
    const [sw1, sw2, floor] = quadsOf(rec, 'q', 3), flakes = quadsOf(rec, 'f', 18), y = H(S.tx, S.tz), on = smooth(L / 0.4) * (1 - smooth((L - 5.4) / 0.6)), R = Math.max(0.6, S.r);
    q(floor, { frame: 'partyFrostFloor', x: S.tx, y: y + 0.04, z: S.tz, mode: 'flat', scale: (2 * R) / 4, rot: 0.3, ...col(FROST_C, 0.55), a: 0.8 * on });
    q(sw1, { frame: 'partySwirl', index: Math.floor(L * 6) % 2, x: S.tx, y: y + 2.0, z: S.tz, mode: 'flat', scale: (2 * R) / 5 * 1.1, rot: L * 2.4, ...col(FROST_C, 0.9), a: 0.85 * on });
    q(sw2, { frame: 'partySwirl', index: (Math.floor(L * 6) + 1) % 2, x: S.tx, y: y + 1.1, z: S.tz, mode: 'flat', scale: (2 * R) / 5 * 0.75, rot: -L * 3.6, ...col(FROST_C, 1.1), a: 0.85 * on, halo: 1 });
    flakes.forEach((h, i) => { const ph = ((L * (0.55 + 0.07 * (i % 5)) + i * 0.137) % 1), a = i * 2.399 + L * 0.8, d = R * 0.9 * Math.sqrt(((i * 31) % 17) / 17), x = S.tx + Math.cos(a) * d, z = S.tz + Math.sin(a) * d;
      q(h, { frame: 'partyIceFlake', index: i % 2, x, y: y + 2.1 * (1 - ph) + 0.05, z, mode: 'billboard', scale: 1.4, ...col(FROST_C, 1.3), a: on * (ph < 0.95 ? 1 : 0) }); });
    return { x: S.tx, z: S.tz, k: 0.8 * on, color: [0.55, 0.95, 1.9] };
  },
  // CLERIC · Sanctuary (hers): her life-green glyph turning under them while it holds, motes rising, a ward-ring on each
  sanctuary(S, rec, L, K, H, vx, vz) {
    if (L == null) return null;
    const [glyph] = quadsOf(rec, 'q', 1), motes = quadsOf(rec, 'm', 8), rings = quadsOf(rec, 'r', Math.min(3, S.reached.length)), y = H(S.tx, S.tz), on = smooth(L / 0.3) * (1 - smooth((L - 3.5) / 0.5)), R = Math.max(0.6, S.r);
    q(glyph, { frame: 'partyGlyphHoly', x: S.tx, y: y + 0.04, z: S.tz, mode: 'flat', scale: (2 * R) / 8, rot: L * 0.6, ...col(LIFE.core, 0.8), a: 0.9 * on, halo: 1 });
    motes.forEach((h, i) => { const ph = (L * 0.6 + i / 8) % 1, a = i * 0.785 + L * 0.5, d = R * 0.7; q(h, { frame: 'partyHolyOrb', index: i % 2, x: S.tx + Math.cos(a) * d, y: y + 0.2 + 1.6 * ph, z: S.tz + Math.sin(a) * d, mode: 'billboard', scale: 0.9, ...col(LIFE.core), a: on * (1 - ph), halo: 1 }); });
    rings.forEach((h, i) => { const o = S.reached[i]; q(h, { frame: 'partyWardRing', x: o.x, y: H(o.x, o.z) + 0.06, z: o.z, mode: 'flat', scale: 0.9, rot: L, ...col(LIFE.core, 0.9), a: on, halo: 1 }); });
    return { x: S.tx, z: S.tz, k: 1.1 * on, color: [0.6, 1.8, 0.5] };
  },
  // CLERIC · Consecrate: holy ground: her gold glyph laid on the knot for as long as it holds, light rising off it
  consecrate(S, rec, L, K, H, vx, vz) {
    if (L == null) return null;
    const [glyph, ring] = quadsOf(rec, 'q', 2), shafts = quadsOf(rec, 's', 5), y = H(S.tx, S.tz), on = smooth(L / 0.4) * (1 - smooth((L - 7.4) / 0.6)), R = Math.max(0.6, S.r);
    q(glyph, { frame: 'partyGlyphHoly', x: S.tx, y: y + 0.04, z: S.tz, mode: 'flat', scale: (2 * R) / 8, rot: -L * 0.3, ...col(HOLY.glyph, 1.0), a: 0.9 * on, halo: 1 });
    q(ring, { frame: 'partyRing', index: 1, x: S.tx, y: y + 0.05, z: S.tz, mode: 'flat', scale: (2 * R) / 6, ...col(HOLY.ring, 1.1), a: 0.8 * on });
    shafts.forEach((h, i) => { const a = i * 1.2566 + L * 0.2, d = R * 0.6, ph = (L * 0.5 + i * 0.2) % 1; q(h, { frame: 'partyPillar', index: 1 + (i % 3), x: S.tx + Math.cos(a) * d, y: y + 1.2, z: S.tz + Math.sin(a) * d, mode: 'billboard', scale: 0.45, ...col(HOLY.body, 0.7), a: on * 0.6 * Math.sin(ph * Math.PI) }); });
    return { x: S.tx, z: S.tz, k: 0.9 * on, color: [1.9, 1.4, 0.5] };
  },
  // CLERIC · Revive (hers): a pillar of gold coming down on the fallen, a burst at their feet, motes rising with them
  revive(S, rec, L, K, H, vx, vz) {
    if (L == null) return null;
    const [body, core, foot, over] = quadsOf(rec, 'q', 4), motes = quadsOf(rec, 'm', 6), y = H(S.tx, S.tz), sc = 0.9, lift = (96 / 2 / 16) * sc;
    q(body, { frame: 'partyPillar', index: 1 + Math.min(2, Math.floor(L / 0.15)), x: S.tx + vx * 0.2, y: y + lift, z: S.tz + vz * 0.2, mode: 'billboard', scale: sc, ...col(HOLY.body), a: 0.95 * clamp01((1.0 - L) / 0.4) });
    q(core, { frame: 'partyPillar', index: 0, x: S.tx + vx * 0.22, y: y + lift, z: S.tz + vz * 0.22, mode: 'billboard', scale: sc, ...col(HOLY.core), a: clamp01((0.5 - L) / 0.2), halo: 1 });
    q(foot, { frame: 'partySunburst', index: Math.min(3, Math.floor(L / 0.1)), x: S.tx, y: y + 0.05, z: S.tz, mode: 'flat', scale: 1.4, rot: L * 2, ...col(HOLY.burst), a: Math.max(0, 1 - L / 0.6), halo: 1 });
    q(over, { frame: 'partySunburst', index: Math.min(3, Math.floor((L - 0.3) / 0.08)), x: S.tx + vx * 0.3, y: y + 1.6, z: S.tz + vz * 0.3, mode: 'billboard', scale: 1.4, ...col(HOLY.burst), a: L > 0.3 ? 1 - smooth((L - 0.45) / 0.25) : 0, halo: 1 });
    motes.forEach((h, i) => { const ph = clamp01((L - i * 0.08) / 1.1), a = i * 1.047; q(h, { frame: 'partyHolyOrb', index: i % 2, x: S.tx + Math.cos(a) * 0.3, y: y + 0.2 + 1.8 * ph, z: S.tz + Math.sin(a) * 0.3, mode: 'billboard', scale: 0.9, ...col(HOLY.core), a: ph > 0 && ph < 1 ? 1 - ph : 0, halo: 1 }); });
    return { x: S.tx, z: S.tz, k: 2.6 * Math.exp(-L / 0.5), color: [1.9, 1.4, 0.5] };
  },
  // CLERIC · Judgement (hers): her glyph under the foe, six pillars round it, then the great pillar on it
  judgement(S, rec, L, K, H, vx, vz) {
    if (L == null) return null;
    const [glyph, gBody, gCore, gFoot] = quadsOf(rec, 'q', 4), six = quadsOf(rec, 'six', 6), y = H(S.tx, S.tz), R = Math.max(0.6, S.r), p = L - 0.8;
    q(glyph, { frame: 'partyGlyphHoly', x: S.tx, y: y + 0.04, z: S.tz, mode: 'flat', scale: ((2 * R) / 8) * (0.4 + 0.6 * smooth(L / 0.4)), rot: L * 1.2, ...col(HOLY.glyph), a: 0.9 * (1 - smooth((L - 1.2) / 0.4)), halo: 1 });
    six.forEach((h, i) => { const a = i * 1.047 + 0.2, t = L - 0.1 - i * 0.05, x = S.tx + Math.cos(a) * R * 0.75, z = S.tz + Math.sin(a) * R * 0.75; q(h, { frame: 'partyPillar', index: 1 + Math.min(2, Math.max(0, Math.floor(t / 0.1))), x: x + vx * 0.1, y: H(x, z) + 1.5, z: z + vz * 0.1, mode: 'billboard', scale: 0.5, ...col(HOLY.body), a: t > 0 ? clamp01((0.35 - t) / 0.12) : 0, halo: 1 }); });
    const sc = 1.3, lift = (96 / 2 / 16) * sc;
    q(gBody, { frame: 'partyPillar', index: 1 + Math.min(2, Math.max(0, Math.floor(p / 0.12))), x: S.tx + vx * 0.25, y: y + lift, z: S.tz + vz * 0.25, mode: 'billboard', scale: sc, ...col(HOLY.body, 1.2), a: p > 0 ? clamp01((0.45 - p) / 0.15) : 0 });
    q(gCore, { frame: 'partyPillar', index: 0, x: S.tx + vx * 0.27, y: y + lift, z: S.tz + vz * 0.27, mode: 'billboard', scale: sc, ...col(HOLY.core, 1.2), a: p > 0 ? clamp01((0.3 - p) / 0.1) : 0, halo: 1 });
    q(gFoot, { frame: 'partySunburst', index: Math.min(3, Math.max(0, Math.floor(p / 0.08))), x: S.tx, y: y + 0.05, z: S.tz, mode: 'flat', scale: 1.8, rot: p * 2, ...col(HOLY.burst), a: p > 0 ? Math.max(0, 1 - p / 0.45) : 0, halo: 1 });
    return { x: S.tx, z: S.tz, k: p > 0 ? 3.4 * Math.exp(-p / 0.2) : 0.8 * smooth(L / 0.3), color: [1.9, 1.4, 0.5] };
  },
  // SHAMAN · Binding Roots: hex-green thorns thrusting up round each foe it takes, a ring of them on the ground (aura_root holds)
  binding_roots(S, rec, L, K, H, vx, vz) {
    if (L == null) return null;
    const [ring] = quadsOf(rec, 'q', 1), th = quadsOf(rec, 't', Math.min(15, S.reached.length * 3)), y = H(S.tx, S.tz), out = 1 - smooth((L - 2.1) / 0.4);
    q(ring, { frame: 'partyRing', index: L < 0.15 ? 0 : 1, x: S.tx, y: y + 0.05, z: S.tz, mode: 'flat', scale: (2 * Math.max(0.6, S.r)) / 6 * (0.4 + 0.6 * smooth(L / 0.25)), ...col(HEXG, 0.9), a: 1 - smooth((L - 0.3) / 0.4) });
    th.forEach((h, i) => { const o = S.reached[Math.floor(i / 3)], a = (i % 3) * 2.094 + 0.5, x = o.x + Math.cos(a) * 0.22, z = o.z + Math.sin(a) * 0.22; q(h, { frame: 'partyIceSpike', index: Math.min(2, Math.floor(L * 10)), x: x + vx * 0.05, y: H(x, z) + 0.35 * smooth(L / 0.18), z: z + vz * 0.05, mode: 'billboard', scale: 0.9, r: 0.35, g: 0.9, b: 0.2, a: out }); });
    return { x: S.tx, z: S.tz, k: 0.9 * Math.exp(-L / 0.3), color: [0.8, 1.6, 0.4] };
  },
  // SHAMAN · Old Marks: a rune struck over the foe a mark, and on the third, all of them breaking in violet
  old_marks(S, rec, L, K, H, vx, vz) {
    if (L == null) return null;
    const [rune, brk, burst] = quadsOf(rec, 'q', 3), y = H(S.tx, S.tz), n = S.k || 1;
    q(rune, { frame: 'heroRunes', index: (n - 1) % 2, x: S.tx + vx * 0.3, y: y + 1.45 + 0.1 * L, z: S.tz + vz * 0.3, mode: 'billboard', scale: 0.7 + 0.15 * n, ...col(n >= 3 ? VIOLET : SPIRIT, 1.1 + 0.2 * n), a: 1 - smooth((L - 0.45) / 0.3), halo: 1 });
    q(brk, { frame: 'crit', index: Math.min(3, Math.floor(L * 12)), x: S.tx + vx * 0.32, y: y + 0.85, z: S.tz + vz * 0.32, mode: 'billboard', scale: 2.6, ...col(VIOLET, 1.3), a: n >= 3 && L < 0.35 ? 1 : 0, halo: 1 });
    q(burst, { frame: 'partySunburst', index: Math.min(3, Math.floor(L / 0.08)), x: S.tx + vx * 0.3, y: y + 0.9, z: S.tz + vz * 0.3, mode: 'billboard', scale: 1.3, ...col(VIOLET, 1.2), a: n >= 3 ? Math.max(0, 1 - L / 0.4) : 0, halo: 1 });
    return n >= 3 ? { x: S.tx, z: S.tz, k: 1.6 * Math.exp(-L / 0.2), color: [1.3, 0.5, 1.8] } : null;
  },
  // SHAMAN · Spirit Totem (the bellwarden's bell): a spectral bell hanging by the party, tolling every 1.5 s, each toll a ring
  // drawing the foes in; its guard ring under it
  spirit_totem(S, rec, L, K, H, vx, vz) {
    if (L == null) return null;
    const y = H(S.tx, S.tz), on = smooth(L / 0.4), off = smooth((L - 7.4) / 0.6), toll = (L % 1.5) / 1.5, [guard, ring] = quadsOf(rec, 'q', 2);
    // (the owner, 2026-11-08: "make the yellow bell totem bigger": 0.75 → 1.4 tall, hung higher to keep its lip clear)
    if (!rec.bells) rec.bells = [K.bells.spawn({ x: S.tx, y: -500, z: S.tz, height: 1.4, palette: 0, seed: rec.seed })];
    const h = rec.bells[0]; if (h >= 0) K.bells.set(h, { x: S.tx, y: y + 2.3, z: S.tz, swing: 0.35 * Math.sin(toll * Math.PI * 2) * Math.exp(-toll * 2), swingX: 1, swingZ: 0, spin: L * 0.3, dissolve: Math.max(1 - on, off), dissolveDir: 1, ghost: 0.15, glow: 1.2, strike: Math.exp(-toll * 6) });
    q(guard, { frame: 'partyWardRing', x: S.tx, y: y + 0.05, z: S.tz, mode: 'flat', scale: 2.2, rot: L * 0.4, ...col(SPIRIT, 0.8), a: 0.85 * on * (1 - off), halo: 1 });
    q(ring, { frame: 'partyRing', index: toll < 0.15 ? 0 : 1, x: S.tx, y: y + 0.07, z: S.tz, mode: 'flat', scale: 0.3 + 0.7 * (1 - toll), ...col(SPIRIT, 1.2), a: on * (1 - off) * (1 - smooth(toll / 0.8)) });
    return { x: S.tx, z: S.tz, k: (0.5 + 1.2 * Math.exp(-toll * 5)) * on * (1 - off), color: [0.5, 1.6, 1.4] };
  },
  // SHAMAN · Thunder Drum: a shock ring out from the hurt ally, a gust at each foe it throws back (their daze: aura_stun)
  thunder_drum(S, rec, L, K, H, vx, vz) {
    if (L == null) return null;
    const [r1, r2, burst] = quadsOf(rec, 'q', 3), gusts = quadsOf(rec, 'g', Math.min(5, S.reached.length)), y = H(S.tx, S.tz), u = smooth(L / 0.3), R = Math.max(0.6, S.r);
    q(r1, { frame: 'partyRing', index: L < 0.12 ? 0 : 1, x: S.tx, y: y + 0.06, z: S.tz, mode: 'flat', scale: ((2 * R) / 6) * (0.15 + 0.95 * u), ...col(SPIRIT, 1.4), a: 1 - smooth((L - 0.25) / 0.3), halo: 1 });
    q(r2, { frame: 'partyRing', index: 1, x: S.tx, y: y + 0.6, z: S.tz, mode: 'flat', scale: ((2 * R) / 6) * (0.1 + 0.7 * u), ...col([1.6, 1.6, 1.9], 1), a: 0.7 * (1 - smooth((L - 0.15) / 0.25)) });
    q(burst, { frame: 'partySunburst', index: Math.min(3, Math.floor(L / 0.07)), x: S.tx + vx * 0.3, y: y + 0.8, z: S.tz + vz * 0.3, mode: 'billboard', scale: 1.5, ...col(SPIRIT, 1.3), a: Math.max(0, 1 - L / 0.3), halo: 1 });
    gusts.forEach((h, i) => { const o = S.reached[i], t = L - 0.08; q(h, { frame: 'heroGaleLit', index: Math.floor(L * 20) % 4, x: o.x, y: H(o.x, o.z) + 0.4, z: o.z, mode: 'flat', ...along(o.x - S.tx, o.z - S.tz), scale: 0.55, ...col(SPIRIT, 1.2), a: t > 0 && t < 0.4 ? 1 : 0 }); });
    return { x: S.tx, z: S.tz, k: 2.4 * Math.exp(-L / 0.2), color: [0.6, 1.7, 1.6] };
  },
  // the holds on a foe (battle.js crowd control): Luminati's stun stars over its head (a stun, a knockdown), the ice mage's
  // shell (a freeze), green thorns gripping its feet (a root)
  aura_stun(S, rec, L, K, H, vx, vz, dt) {
    const [st] = quadsOf(rec, 'q', 1); rec.t = (rec.t || 0) + dt;
    q(st, { frame: 'stun', index: Math.floor(rec.t * 10) % 4, x: S.x + vx * 0.1, y: H(S.x, S.z) + 1.35, z: S.z + vz * 0.1, mode: 'billboard', scale: 1.1, r: 3.0, g: 2.6, b: 0.8, a: 1, halo: 1 });
    return null;
  },
  aura_frozen(S, rec, L, K, H, vx, vz, dt) {
    const [sh] = quadsOf(rec, 'q', 1); rec.t = (rec.t || 0) + dt;
    q(sh, { frame: 'partyIceShellLit', index: 0, x: S.x + vx * 0.12, y: H(S.x, S.z) + 0.6, z: S.z + vz * 0.12, mode: 'billboard', scale: 1.1, ...col(FROST_C, 0.85), a: smooth(rec.t / 0.1), halo: 1 });
    return null;
  },
  aura_root(S, rec, L, K, H, vx, vz, dt) {
    const th = quadsOf(rec, 'q', 3); rec.t = (rec.t || 0) + dt;
    th.forEach((h, i) => { const a = i * 2.094 + 0.5, x = S.x + Math.cos(a) * 0.22, z = S.z + Math.sin(a) * 0.22; q(h, { frame: 'partyIceSpike', index: 2, x: x + vx * 0.05, y: H(x, z) + 0.3, z: z + vz * 0.05, mode: 'billboard', scale: 0.8, r: 0.35, g: 0.9, b: 0.2, a: 1 }); });
    return null;
  },
};

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
    if (o.figLit > 0) FIG_LIT = o.figLit;
    if (o.figMax > 0) FIG_MAX = o.figMax;
    if (o.figures === 'models' || o.figures === 'sprites') FIGURES = o.figures;   // (?figures=sprites: the atlases, as before 4b)
    const S = game?.postfx?.settings;
    // 'soft': the prototype's eased lens (its view.js): a band most of the screen tall, 16 units of depth in focus, so the
    // square is sharp and the far roofs and the near hedges a little soft; 'off': everything sharp
    // (none underground: the rooms below the one in view held their fires as blurred orbs over the HUD)
    if (S?.dof) Object.assign(S.dof, { enabled: dof !== 'off' && !inside, focusRange: 16, tiltShift: 0.14, tiltWidth: 0.62 });
  },
  /**
   * one frame: the camera, the hour, the weather, who's where, then a step of Luminati and its picture
   * @param {{ dt: number, focus: number[], ppu: number, hour: number, weather: string, fog?: number, hero: number[] | null,
   *   actors: { name: string, cw: number, col: number, row: number, x: number, z: number, fade: number, flash?: number, warn?: number, key?: number }[],   (key: the same figure from frame to frame, its model's)
   *   rings?: { x: number, z: number, col: number[], a: number }[], hazards?: { x: number, z: number, r: number, col: number[], rim: number[], a: number }[], mark?: { x: number, z: number } | null, ambient?: { sky: number[], ground: number[], i: number, sun: number, lamps?: number } | null, carry?: number, draw?: boolean, bright?: number,
   *   bits?: { canvas: HTMLCanvasElement, ax: number, ay: number, x: number, z: number, lift: number, glow: number, flash?: number }[], water?: { id: string, cells: number[] } | null,
   *   blast?: { x: number, z: number, k: number } | null,
   *   spells?: { key: string, id: string, seed: number, age: number, land: number | null, x: number, z: number, tx: number, tz: number, r: number, k?: number, reached: { x: number, z: number }[] }[],
   *   warns?: { x: number, z: number, tx: number, tz: number, r: number, w: number, p: number, hit: number, heavy: boolean, lane: boolean }[] }} f
   */
  frame(f) {
    if (!game || !game.engine) return;
    brightHour = f.bright > 0 ? f.bright : 1;
    cam.x = f.focus[0]; cam.y = f.focus[1]; cam.z = f.focus[2]; cam.ppu = f.ppu;
    if (Number.isFinite(f.hour) && Math.abs((game.lighting?.timeOfDay ?? -1) - f.hour) > 0.004) game.setTime(f.hour);
    if (f.weather && game.weather?.weather !== f.weather) game.setWeather(f.weather);
    if (game.lighting?.settings) { game.lighting.settings.fogMul = 1 + 0.6 * (f.fog || 0); game.lighting.settings.pointLightMul = f.ambient?.lamps ?? 1; }   // (the sim's fog: the air a little thicker, Emberlit's overlay drifting its banks over it; underground, the lamps the game's)
    if (f.hero && game.player) { hidePlayer(); game.player.position.set(f.hero[0], game.tileMap.getHeight(f.hero[0], f.hero[1]), f.hero[1]); }
    // the people: as models (placeFigure), or each atlas's pool filled in the order drawn; the rest hidden
    figGlow = figureGlow();
    const used = new Map(), camera = game.engine.camera, order = new Map();
    figSeen++;
    camera.getWorldDirection(_camDir); const camAz = Math.atan2(-_camDir.x, -_camDir.z);
    for (const a of f.actors) {
      const nth = order.get(a.name) || 0; order.set(a.name, nth + 1);
      if (placeFigure(a, a.key ?? `${a.name}#${nth}`, Math.max(0, Math.min(0.1, f.dt || 0)), camAz)) continue;
      const A = atlas(a.name); if (!A) continue;
      const k = a.cw ? a.cw / A.meta.cw : 1, sheet = sheetOf(A, k), n = used.get(sheet) || 0; used.set(sheet, n + 1);
      const s = spriteFor(sheet, n);
      s.visible = true;
      if (s.material.emissiveIntensity !== figGlow) s.material.emissiveIntensity = figGlow;
      if (s._col !== a.col || s._row !== a.row) s.setFrame(a.col, a.row);
      standAt(s, a.x, a.z, (A.meta.ch - A.meta.ay) * k, sheet.pixelsPerUnit * k);
      const fl = a.flash || 0, wn = fl ? 0 : Math.round((a.warn || 0) * 20) / 20;   // (a hit's flash: Emberlit's look.flash, white over the figure; a wind-up's glow, Luminati's own highlight 1.6, 0.7, 0.3)
      if (s._emberFlash !== fl || s._emberWarn !== wn) { s._emberFlash = fl; s._emberWarn = wn; const k = 1 + fl * 2.6; s.tint = wn ? new THREE.Color(1 + 0.9 * wn, 1 + 0.12 * wn, 1 - 0.35 * wn) : new THREE.Color(k, k * 0.96, k * 0.9); }   // (the sprite's colour lifted, lit as ever: Luminati's own hit flash, combatFx, drew our sheets as pale cut-outs)
      const op = 1 - (a.fade || 0);
      if (Math.abs(s.opacity - op) > 0.01) s.opacity = op;
      s.update(0, camera);
    }
    for (const b of f.bits || []) {                            // the cage at Teague's side, the bolts: lifted as Emberlit drew them
      const sheet = bitSheet(b), n = used.get(sheet) || 0; used.set(sheet, n + 1);
      const s = bitFor(sheet, n), em = b.glow ? 1.6 : 0.3;
      s.visible = true; if (s.material.emissiveIntensity !== em) s.material.emissiveIntensity = em;
      standAt(s, b.x, b.z, b.canvas.height - b.ay - b.lift, NATIVE_PER_UNIT);
      const fl = b.flash || 0; if (s._emberFlash !== fl) { s._emberFlash = fl; const k = 1 + fl * 2.6; s.tint = new THREE.Color(k, k * 0.96, k * 0.9); }
      s.update(0, camera);
    }
    for (const [sheet, p] of pools) { const n = used.get(sheet) || 0; for (let i = n; i < p.length; i++) if (p[i].visible) p[i].visible = false; }
    sweepFigures();
    // the fight's ground
    const nk = { ring: 0, disc: 0, rim: 0, focus: 0, wfill: 0, wrim: 0, lane: 0 };
    for (const r of f.rings || []) placeGround(groundMesh('ring', nk.ring++), r.x, r.z, 1, r.col, r.a);
    if (f.mark) { const m = groundMesh('focus', nk.focus++); placeGround(m, f.mark.x, f.mark.z, 1, [255, 226, 150], 0.7 + 0.2 * Math.sin(focusSpin * 4)); m.rotation.z = focusSpin; focusSpin += (f.dt || 0) * 0.9; }
    for (const h of f.hazards || []) { placeGround(groundMesh('disc', nk.disc++), h.x, h.z, h.r, h.col, 0.82 * h.a); placeGround(groundMesh('rim', nk.rim++), h.x, h.z, h.r, h.rim, 0.42 * h.a); }
    for (const w of f.warns || []) {                           // the foes' warnings
      const g = w.heavy ? 1 : 0.62, out = w.hit > 0 ? w.hit : 1, e = 1 - (1 - w.p) * (1 - w.p);
      if (!w.lane) {
        placeGround(groundMesh('wrim', nk.wrim++), w.tx, w.tz, w.r * 1.1, WARN_INK, 0.5 * out);   // (a dark edge: on a firelit floor the red alone was lost)
        placeGround(groundMesh('wfill', nk.wfill++), w.tx, w.tz, w.r * e, w.hit > 0 ? WARN_HOT : WARN, (0.26 + 0.3 * w.p) * out);
        placeGround(groundMesh('wrim', nk.wrim++), w.tx, w.tz, w.r, w.hit > 0 ? WARN_HOT : WARN, (0.7 + 0.3 * w.p) * out);
      } else {
        placeLane(groundMesh('lane', nk.lane++), w.x, w.z, w.tx, w.tz, 1, w.w * 1.25, WARN_INK, 0.3 * g * out);
        placeLane(groundMesh('lane', nk.lane++), w.x, w.z, w.tx, w.tz, 1, w.w, WARN, 0.16 * g * out);
        placeLane(groundMesh('lane', nk.lane++), w.x, w.z, w.tx, w.tz, w.p, w.w * 0.7, w.hit > 0 ? WARN_HOT : WARN, (0.22 + 0.28 * w.p) * g * out);
        placeGround(groundMesh('wrim', nk.wrim++), w.tx, w.tz, w.heavy ? 0.42 : 0.3, w.hit > 0 ? WARN_HOT : WARN, (0.35 + 0.4 * w.p) * g * out);
      }
    }
    placeWater(f.water);
    for (const kind of Object.keys(groundPools)) for (let i = nk[kind]; i < groundPools[kind].length; i++) groundPools[kind][i].visible = false;
    // the hero's ember-wisp: one of Luminati's spell lights (never a lamp), taken again after each level is built
    if (carryLevel !== levelId) {
      carryLevel = levelId; carryLight = game.world?.acquireSpellLight?.({ minor: false }) ?? null; blastLight = game.world?.acquireSpellLight?.({ minor: false }) ?? null;
      spellLight = game.world?.acquireSpellLight?.({ minor: false }) ?? null;
      for (const rec of spellLive.values()) if (SK) freeSpell(rec);
      spellLive.clear();
    }
    if (carryLight && f.hero) {
      const k = Math.max(0, Math.min(1, f.carry ?? 0)), hx = f.hero[0] + 0.35, hz = f.hero[1] + 0.35;
      // (above a model it hangs higher, and a little stronger, so the floor round the hero is as lit: at 2.4 it was a hand
      // over the helmet, and a model's head, facing it, went white)
      const up = FIGURES === 'models' ? 3.6 : 2.4, gain = FIGURES === 'models' ? 1.75 : 1;
      carryLight.set(hx, game.tileMap.getHeight(f.hero[0], f.hero[1]) + up, hz, { color: [1.9, 1.15, 0.42], intensity: (4.5 * gain * k) / (f.ambient?.lamps ?? 1), distance: 6 + (up - 2.4), decay: 1.4, flicker: 0.12 });   // (a glow round the hero, not a floodlight: 16 washed the figure out)
    }
    // a fire landing (renderer.js blasts: the Firebolt's explosion, a mage's bolt): a hot flash on the room round it, gone
    // in half a second; one of Luminati's spell lights, as the carry light is
    if (blastLight) {
      const b = f.blast;
      if (b && b.k > 0.01) blastLight.set(b.x, game.tileMap.getHeight(b.x, b.z) + 1.6, b.z, { color: [2.0, 0.95, 0.32], intensity: 9 * b.k / (f.ambient?.lamps ?? 1), distance: 7, decay: 1.6, flicker: 0.25 });
      else blastLight.off();
    }
    placeSpells(f.spells || [], f.dt || 0, f.ambient?.lamps, !!(f.rings && f.rings.length));
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
    return { bits: [...pools.entries()].filter(([sh]) => sh.name === 'ember-bit').reduce((n, [, p]) => n + p.filter((s) => s.visible).length, 0), water: WATER.mesh && WATER.mesh.visible ? WATER.mesh.count : 0, fig: figGlow, lit: Math.round(figLit * 100) / 100, beasts: beastPool.filter((s) => s?.visible).length, light: light.on ? 1 : 0, lightDepth: light.on && light.keyed && game?.postfx?.depthTexture ? 1 : 0, rings: shown('ring'), hazards: shown('disc'), warns: shown('wrim'), lanes: shown('lane'), spells: spellLive.size, dome: SK && SK.domeOf ? 1 : 0, blades: SK ? SK.blades.count - (SK.warmN > 0 ? 2 : 0) : 0, crystals: SK ? SK.crystals.count - (SK.warmN > 0 ? 1 : 0) : 0, frost: SK ? SK.frost.count - (SK.warmN > 0 ? 1 : 0) : 0, spellLight: spellLight && SK ? 1 : 0, focus: shown('focus'), carry: carryLight ? 1 : 0, level: levelId, actors: [...pools.values()].reduce((n, p) => n + p.filter((s) => s.visible).length, 0) + [...figs.values()].filter((q) => q.root.visible).length, models: [...figs.values()].filter((q) => q.root.visible).length, figErr, figFailed: [...templates.values()].filter((t) => t === false).length, pr: game?.engine?.pixelRatio ?? null, dpr: devicePixelRatio || 1, modelMeshes: [...templates.values()].filter(Boolean).map((t) => t.meshes.after).reduce((a, b) => a + b, 0), modelMeshesBefore: [...templates.values()].filter(Boolean).map((t) => t.meshes.before).reduce((a, b) => a + b, 0), figures: FIGURES, atlases: atlases.size, env: envSprites.length, sky: skyShown, ours: envSprites.filter((q) => q.name.startsWith('ember:prop:')).length,
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
