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
import { LightPool } from '../src/engine/lighting/LightPool.js';
import { MAX_POINT_LIGHTS } from '../src/game/World.js';
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
import { registerPresets } from '../src/engine/fx/Particles.js';
import { globalUniforms } from '../src/engine/render/GlobalUniforms.js';
import { DEFAULT_KEYFRAMES } from '../src/engine/lighting/LightingSystem.js';
import { ARID_KEYFRAMES } from '../src/game/Climate.js';
import { registerTextureSet, TextureLibrary } from '../src/engine/pixel/Textures.js';
import { setFogStart } from '../src/game/AtmosphereFog.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { makeBuilding } from './buildkit.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import ENV_LIST from './env.json';
import TOWN_SETS from './town.json';
import { clone as cloneSkinned } from 'three/addons/utils/SkeletonUtils.js';
import { build as buildFigure, fitPpu, pose as poseFigure, compact, findNode } from './figure.js';
import { setFaceStyle, forgetFace } from './faces.js';
// (GDD v1.79: every face is the painted head, faces.js paintedFace; ?faces=mesh the 3D parts, as before, for a comparison)
if (typeof location !== 'undefined' && new URLSearchParams(location.search).get('faces') === 'mesh') setFaceStyle('mesh');
import './ground.js';
import { applyHires } from './hires.js';

let ASSETS = '';                                              // (the game's assets/: createWorld's `assets`)
const FOV = 1;                                                // (degrees: near enough orthographic, see above)
const PIXEL_RATIO = 3;                                        // (the most of the device's pixel ratio Luminati draws at: boot)
const NATIVE_PER_UNIT = 16 * Math.SQRT2;                      // Emberlit's native px a unit: a tile's half-width 8 px, two tiles a unit
const SPRITE_OPTS = { billboard: 'spherical', normalUp: 0.6, wrap: 0.6, roundness: 0.35, emissive: '#ffe9d2', emissiveIntensity: 0.2 };   // (0.12: a figure outside a lamp's pool went to a black silhouette underground; Emberlit's always read)

let lang = 'en', fonts = null, tables = null, container = null, uiRoot = null;

let game = null, building = null, levelId = 0, dof = 'soft', res = 'sharp', resSet = 'sharp', yawDeg = 45, pitchDeg = 30;
// The menu's Quality (render3d/settings.js; the owner, 2026-11-12: "lets package into a high and low graphics setting
// option. high is current, low is with your recommendations without sacrificing much of the looks"). Low, from the owner's
// phone's Frame tests in Thornwick's square at dusk (docs/performance-options.md): the sun's shadow sharp-edged (one tap
// of its map, not PCF's five: 2.4 ms of 27); the lamp pool LOW_LAMPS lights, the nearest (the pool ranks them), and of
// Luminati's four effect lights only the hero's wisp and the spells' light shown (every point light is in every lit
// shader: 4 in all saved 2.7 ms of 16's, 8 only 0.8); the grade's sharpen, grain and colour fringe off (unseen at play's
// size). High: all of it as it was.
let quality = 'high', lampsSet = 0, gradeKeep = null, wispSlots = [];
const LOW_LAMPS = 3;
const lampsFor = () => (quality === 'low' ? LOW_LAMPS : MAX_POINT_LIGHTS);
// The levels set aside on leaving (Luminati's swapLevel `keep`), by their content (levelKey): going back re-attaches
// one, its programs compiled and its buffers on the GPU, instead of building it again (the owner, 2026-11-11: "Load
// times from town to the main map takes up to 5-6 seconds"). Each with our art stood in it (its env sprites and kit
// models), kept out of the scene meanwhile. Two at most: the overland, a town and a dungeon's floor are the round trips.
const aside = new Map(), ASIDE_MAX = 2;
const CALM_FLICKER = 0.12;                                    // (frame(): underground, no light flickers more than this)
let curKey = '', curEnvKey = '', loading = false, lastWay = '';   // (lastWay: how the last level came: 'built', 'ahead', 'kept')
// The level next door built ahead (api.prepare: a town's overland, an overland's town), in slices (PREP_MS of work, then
// PREP_GAP ms for the frames) while this one plays, as Luminati builds a campaign's next level (prepareWorld, buildSteps
// paced); a swap to it takes it (swapLevel `prepared`), so the first trip there skips the build too. One at a time. Its
// own timer, not the frames': a slow frame (a phone's busy square) mustn't starve it.
let prep = null;
const PREP_MS = 5, PREP_GAP = 10;
function prepPump() { if (!prep || prep.done) return; prepStep(PREP_MS); setTimeout(prepPump, prep?.wait || loading ? 60 : PREP_GAP); }
function dropPrep() { if (!prep) return; try { prep.world.dispose(); } catch (err) { console.warn('[luminati] a level built ahead:', err); } prep = null; }
/** a slice of the level built ahead: its steps for about ms, or until it waits on its worker */
function prepStep(ms) {
  const p = prep;
  if (!p || p.done || p.wait || loading) return;
  const end = performance.now() + ms;
  try {
    for (;;) {
      const r = p.steps.next();
      if (r.done) { p.done = true; return; }
      if (r.value && 'wait' in r.value) { p.wait = r.value.wait; const off = () => { p.wait = null; }; p.wait.then(off, off); return; }
      if (performance.now() >= end) return;
    }
  } catch (err) { console.warn('[luminati] building a level ahead:', err); if (prep === p) prep = null; }
}
/** what a swap takes of a level built ahead: its world, its level, and its last steps run */
const preparedOf = (p) => ({ world: p.world, level: p.level, async finish() {
  for (;;) {
    if (p.wait) await p.wait;
    if (p.done) return;
    const r = p.steps.next();
    if (r.done) { p.done = true; return; }
    if (r.value && 'wait' in r.value) await r.value.wait;
  }
} });
const images = new Map(), metas = new Map();
const image = (url) => { let p = images.get(url); if (!p) { p = new Promise((res, rej) => { const i = new Image(); i.decoding = 'async'; i.onload = () => res(i); i.onerror = rej; i.src = url; }); images.set(url, p); } return p; };
// An atlas is a JSON of rects plus a PNG, and a re-bake moves the rects: a browser (or host) that cached one and not the
// other cuts from the wrong place (a stairwell drawn blank, 3494747). So the JSON is always revalidated, and its PNG is
// asked for at a version hashed from its text (`_v`): renderer.js's atlasMeta, here since Luminati loads the images.
const fnv = (t) => { let h = 0x811c9dc5; for (let i = 0; i < t.length; i++) h = Math.imul(h ^ t.charCodeAt(i), 0x01000193); return (h >>> 0).toString(36); };
const json = (url) => { let p = metas.get(url); if (!p) { p = fetch(url, { cache: 'no-cache' }).then((r) => (r.ok ? r.text() : null)).then((t) => { if (!t) return null; const m = JSON.parse(t); Object.defineProperty(m, '_v', { value: fnv(t) }); return m; }).catch(() => null); metas.set(url, p); } return p; };

// ── the actors: one texture an atlas (each frame a UV rectangle: nothing cut), a pool of sprites an atlas ───────────
const atlases = new Map();                                    // name → { sheet, meta } | null while loading | false (failed)
function atlas(name) {
  if (atlases.has(name)) return atlases.get(name);
  atlases.set(name, null);
  json(`${ASSETS}actors/${name}.json`).then((meta) => (meta ? image(`${ASSETS}actors/${name}.alb.png?v=${meta._v}`).then((img) => [meta, img]) : [null, null])).then(([meta, img]) => {
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
// the bake's paths (./models/<file>) to the game's assets, at cast.json's version (a model re-made with the cast, so a
// browser's old copy of a .glb isn't used against the new cast; cast.json itself is always revalidated, json above); each
// build gets its own copy of the scene (bones, meshes), sharing geometry, textures and clips
const loadModel = (u) => {
  const url = `${ASSETS}models/${u.replace('./models/', '')}${cast && cast._v ? `?v=${cast._v}` : ''}`;
  let p = gltfs.get(url); if (!p) { p = gltfLoader.loadAsync(url); gltfs.set(url, p); }
  return p.then((g) => ({ scene: cloneSkinned(g.scene), animations: g.animations }));
};
const metaOf = new Map();                                     // atlas name → its JSON (the clips' columns), once in
const templates = new Map();                                  // atlas name → { root, clips, frame, ppu, minY } | null (building) | false
/** a variant as a member wears it: their face and build (appearance), what they have equipped (gear) @param {any} v @param {any} look */
// (bare: a member's helm hidden, GDD v1.65: the model's own Helmet, Hat or Hood off too, as the creation preview's bare is; the
// owner, 2026-11-16, "hiding helm on rogue does not work": the rogue's hood is the KayKit model's Rogue_Hooded, not a worn helm)
const BARE = /Helmet|Hat|Hood/;
const withLook = (v, look) => (!look ? v : { ...v, ...(look.appearance ? { appearance: look.appearance } : {}), ...(look.gear ? { gear: look.gear } : {}),
  ...(look.bare && v.show ? { show: v.show.filter((n) => !BARE.test(n)) } : {}),
  ...(look.bare && /_Hooded$/.test(v.model || '') ? { model: v.model.replace(/_Hooded$/, '') } : {}) });   // (the rogue's hood is the whole model, Rogue_Hooded: bare, KayKit's own Rogue, the same rig)
// (GDD v1.65) a member with a look of their own (a.look: its appearance, a.lk its key) has a template of its own, its
// atlas's clips and size, its face and build its own: one build a look, its copies sharing it as any figure's do
function templateOf(name, def, look = null, lk = '') {
  const tk = lk ? `${name}#${lk}` : name, t = templates.get(tk); if (t !== undefined) return t;
  templates.set(tk, null);
  if (!metaOf.has(name)) json(`${ASSETS}actors/${name}.json`).then((m) => metaOf.set(name, m));
  buildFigure(withLook(def.v, look), { far: false, load: loadModel, faces: async () => cast.faces, lod: 'play' }).then((c) => {   // (the head as play draws it: faces.js LOD)
    const rest = []; c.root.traverse((b) => { if (b.isBone) rest.push([b, b.position.clone(), b.quaternion.clone(), b.scale.clone()]); });
    poseFigure(c, 'Idle', 0, true);                           // (sized from the heroic idle, as the bake fits it)
    const { box, ppu } = fitPpu(c.root, def.v, def.px);
    for (const [b, p, q, s] of rest) { b.position.copy(p); b.quaternion.copy(q); b.scale.copy(s); }
    const cut = compact(c.root, mergeGeometries);              // (once a figure: its copies share the merged parts)
    templates.set(tk, { root: c.root, clips: c.clips, frame: c.frame, creature: c.creature || null, look: c.look || null, ppu, minY: box.min.y, meshes: cut });
  }).catch((e) => { console.warn('[luminati] figure', tk, e); figErr ||= `${tk}: ${e?.message || e}`; templates.set(tk, false); });
  return null;
}
// (an heirloom's flourish, embers drifting up round a figure wearing one, was here from 2026-11-10; the owner, 2026-11-12:
// "Stop adding the sparkles around a character when they wear Heirloom items". An heirloom shows as its piece does, and by
// its amber frame in the bag.)

const HEAD_SHADOW = typeof location !== 'undefined' && new URLSearchParams(location.search).get('headshadow') === '1';
const figs = new Map();                                       // a figure's key (hybrid.js) → its model, posed
let figSeen = 0;
// the halo round a full cage's soul (figureFor): one additive sprite material, a soft violet disc, made once
let haloMat = null;
function soulHalo() {
  if (haloMat) return haloMat;
  const c = document.createElement('canvas'); c.width = c.height = 64; const g = c.getContext('2d'), r = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  r.addColorStop(0, 'rgba(225,210,255,0.95)'); r.addColorStop(0.25, 'rgba(170,140,255,0.55)'); r.addColorStop(1, 'rgba(120,80,230,0)');
  g.fillStyle = r; g.fillRect(0, 0, 64, 64);
  const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace;
  haloMat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, fog: false });
  return haloMat;
}
function figureFor(key, name, T) {
  let f = figs.get(key);
  if (f && f.name !== name) { game.engine.scene.remove(f.root); figs.delete(key); f = null; }
  if (f) return f;
  const root = cloneSkinned(T.root), mats = [];
  root.traverse((o) => {
    if (!o.isMesh) return;
    o.castShadow = !o.userData.face || HEAD_SHADOW; o.receiveShadow = true; o.frustumCulled = false;   // (the head out of the shadow pass: the body's shadow is the figure's)
    o.material = o.material.clone();
    // matte, as the atlases are (they're baked unlit): KayKit's sheen took the hero's carry light, a light at the shoulder,
    // as a white blaze on the helmet
    if (o.material.isMeshStandardMaterial) { o.material.metalness = 0; o.material.roughness = Math.max(o.material.roughness ?? 1, 0.92); }
    // (the skeletons' eyes and a lantern's glass keep their own glow; an unlit material, a prop's MeshBasicMaterial, has
    // no emissive: given one, three's uniforms threw mid-render)
    const own = /Eyes/.test(o.name) || (!!o.userData.glow && !o.material.userData.rarity) || !o.material.emissive;
    if (!own) { o.material.emissive = o.material.map ? new THREE.Color(0xffe9d2) : o.material.color.clone(); if (o.material.map) o.material.emissiveMap = o.material.map; }
    // a compacted face (figure.js compact) is coloured by vertex: its fill is too, or every part of it glowed one white
    if (!own && o.material.vertexColors) {
      o.material.onBeforeCompile = (sh) => { sh.fragmentShader = sh.fragmentShader.replace('#include <emissivemap_fragment>', '#include <emissivemap_fragment>\n#ifdef USE_COLOR\n\ttotalEmissiveRadiance *= vColor.rgb;\n#endif'); };
      o.material.customProgramCacheKey = () => 'ember-figure-vc';
    }
    mats.push({ m: o.material, own, base: o.material.emissive ? o.material.emissive.clone() : null, add: o.material.userData.rarity || 0, shine: !!o.material.userData.shine });   // (add: a piece's rarity, its own colours lit over the fill: gear.js lookOn)
  });
  const bones = []; root.traverse((b) => { if (b.isBone) bones.push([b, b.position.clone(), b.quaternion.clone(), b.scale.clone()]); });
  // (creature: a creature keeps its own proportions, figure.js pose, and one on KayKit's rig its joints; without it the
  // heroes' heroic pass shrank a creature's head to 0.62 in the world, the atlases had it as built)
  // a Cult harvester's caught soul (props.js cagepole Cage_Soul): lit only in a cage that holds one (a.empty: the lot's
  // empty cages, dark; the leader's full one burns, the one the Sickpools want broken: lamps.js)
  const souls = []; root.traverse((o) => { if (o.name === 'Cage_Soul') souls.push(o); });
  for (const s of souls) { const h = new THREE.Sprite(soulHalo()); h.scale.setScalar(0.9 / Math.max(1e-3, s.scale.x)); h.renderOrder = 2; s.add(h); s.scale.multiplyScalar(1.3); }   // (a halo three times the soul, so a full cage reads at a phone's size)
  f = { name, root, mixer: new THREE.AnimationMixer(root), clips: T.clips, frame: T.frame, creature: T.creature, look: T.look, bones, mats, shines: mats.some((q) => q.shine), yaw: null, key: '', fpos: 0, seen: 0, lit: '', souls,
    stack: T.creature === 'furnace' ? stackOf(root) : null, puff: 0, puffN: 0 };
  game.engine.scene.add(root); figs.set(key, f);
  return f;
}
// ── Furnace Nine's stack smoke (docs/art-critic-pass-reach-fx.md; the owner: "has smoke as solid geometry that doesn't
// drift") ──────────────────────────────────────────────────────────────────────────────────────────────────────────────
// Its smoke was two grey blobs over its stack, carried round with its head (creatures.js furnace). Now the stack breathes
// it: a puff of Luminati's lit smoke particles every STACK_EVERY s from the fire at its lip, each left where it was let go
// to rise, swell, thin and go with the wind (a burst each, in world space: an emitter's particles go wherever it goes), and
// now and then a spark. The lip is the highest point of its fire (the glow mesh, 'Eyes': the stack's fire disc over its
// mouth and eyes), found once, skinned each frame.
const STACK_EVERY = 0.14, STACK_SPARK = 5;                    // (a puff a seventh of a second; a spark every fifth)
registerPresets({
  // the stack's smoke: grey, lit by the world, its colour white-balanced as it's let go (greyPuff); rising, swelling and
  // leaning off downwind (a burst, as Luminati's deathPoof: its pool and program)
  emberStackSmoke: { mode: 'burst', motion: 'emit', texture: 'smoke', blending: 'normal', variants: 1, lit: 1, pulse: 0, tumble: 0, aspect: 1, streak: 0, fade: [0.05, 0.6], twinkle: 0, blink: 0, nightVisibility: 0,
    count: 1, life: [3.6, 5.2], size: [0.55, 0.85], sizeEnd: 3.8, spawnSize: [0.3, 0.05, 0.3], velocity: [0.1, 1.45, 0.05], velocityVariance: [0.16, 0.2, 0.16],
    burstSpeed: [0.05, 0.25], burstUp: [0, 0.2], gravity: 0.12, drag: 0.35, windInfluence: 0.85, spin: [0.1, 0.4], color: '#7e7974', alpha: 0.64 },
  // a spark up out of it (Luminati's hitSpark's pool: a streak)
  emberStackSpark: { mode: 'burst', motion: 'emit', texture: 'streak', blending: 'additive', variants: 1, lit: 0, pulse: 0, tumble: 0, aspect: 4, streak: 0.04, fade: [0, 0.3], twinkle: 0, blink: 0, nightVisibility: 0,
    count: 1, life: [0.5, 1.0], size: [0.04, 0.06], sizeEnd: 0.4, spawnSize: [0.18, 0.05, 0.18], burstSpeed: [0.2, 0.6], burstUp: [1.6, 2.6], gravity: -1.5, drag: 0.6, windInfluence: 0.3,
    colors: ['#ffd27a', '#ff9a3c', '#ff6a1e'], hdr: 3, alpha: 1 },
  // the rest (renderer.js puffs): Oruth's hammer on his anvil, sparks thrown up off its face and falling
  emberForgeSparks: { mode: 'burst', motion: 'emit', texture: 'streak', blending: 'additive', variants: 1, lit: 0, pulse: 0, tumble: 0, aspect: 4, streak: 0.04, fade: [0, 0.3], twinkle: 0, blink: 0, nightVisibility: 0,
    count: 12, life: [0.3, 0.75], size: [0.04, 0.07], sizeEnd: 0.5, spawnSize: [0.15, 0.05, 0.15], burstSpeed: [1.2, 3.4], burstUp: [1.8, 3.6], gravity: -9, drag: 1.2,
    colors: ['#fff4c8', '#ffd27a', '#ff9a3c'], hdr: 4, alpha: 1 },
  // a spoiled piece: a puff of dark smoke off the anvil, slow, and the piece's embers falling dead
  emberSpoilSmoke: { mode: 'burst', motion: 'emit', texture: 'smoke', blending: 'normal', variants: 1, lit: 1, pulse: 0, tumble: 0, aspect: 1, streak: 0, fade: [0.05, 0.6], twinkle: 0, blink: 0, nightVisibility: 0,
    count: 16, life: [1.6, 2.6], size: [0.4, 0.7], sizeEnd: 3.6, spawnSize: [0.6, 0.3, 0.6], burstSpeed: [0.3, 0.9], burstUp: [0.8, 1.6], gravity: 0.25, drag: 1.4, windInfluence: 0.3, spin: [0.2, 0.8],
    color: '#4e4641', colorEnd: '#76716c', alpha: 0.72 },
  emberSpoilEmbers: { mode: 'burst', motion: 'emit', texture: 'streak', blending: 'additive', variants: 1, lit: 0, pulse: 0, tumble: 0, aspect: 4, streak: 0.04, fade: [0, 0.3], twinkle: 0, blink: 0, nightVisibility: 0,
    count: 8, life: [0.5, 1.0], size: [0.035, 0.05], sizeEnd: 0.3, spawnSize: [0.3, 0.1, 0.3], burstSpeed: [0.3, 1.0], burstUp: [0.2, 0.9], gravity: -6, drag: 1,
    colors: ['#ff7a2a', '#c8401a', '#7a2a14'], hdr: 1.8, alpha: 1 },
  // a wight risen re-armed: a column of forge-sparks up round it
  emberArmSparks: { mode: 'burst', motion: 'emit', texture: 'streak', blending: 'additive', variants: 1, lit: 0, pulse: 0, tumble: 0, aspect: 4, streak: 0.04, fade: [0, 0.3], twinkle: 0, blink: 0, nightVisibility: 0,
    count: 22, life: [0.5, 1.1], size: [0.045, 0.075], sizeEnd: 0.4, spawnSize: [0.7, 0.3, 0.7], burstSpeed: [0.4, 1.6], burstUp: [2.2, 4.4], gravity: -4, drag: 1.1,
    colors: ['#fff0c0', '#ffc060', '#ff7a2a'], hdr: 3.6, alpha: 1 },
  // a vent letting go: slag thrown up and falling back, and a breath of its smoke
  emberVentSlag: { mode: 'burst', motion: 'emit', texture: 'streak', blending: 'additive', variants: 1, lit: 0, pulse: 0, tumble: 0, aspect: 4, streak: 0.04, fade: [0, 0.3], twinkle: 0, blink: 0, nightVisibility: 0,
    count: 12, life: [0.4, 0.8], size: [0.05, 0.08], sizeEnd: 0.5, spawnSize: [0.5, 0.05, 0.5], burstSpeed: [0.4, 1.4], burstUp: [2.4, 4.2], gravity: -10, drag: 0.8,
    colors: ['#ffe08a', '#ff8a2a', '#ff4a12'], hdr: 3.4, alpha: 1 },
  emberVentSmoke: { mode: 'burst', motion: 'emit', texture: 'smoke', blending: 'normal', variants: 1, lit: 1, pulse: 0, tumble: 0, aspect: 1, streak: 0, fade: [0.05, 0.6], twinkle: 0, blink: 0, nightVisibility: 0,
    count: 4, life: [1.2, 2.0], size: [0.3, 0.45], sizeEnd: 3, spawnSize: [0.5, 0.1, 0.5], burstSpeed: [0.1, 0.4], burstUp: [0.8, 1.4], gravity: 0.2, drag: 1.4, windInfluence: 0.4, spin: [0.2, 0.6],
    color: '#3a302a', colorEnd: '#625a54', alpha: 0.5 },
});
/** the furnace's stack lip: its fire's highest vertex, as { mesh, idx } (null if it has none) @param {THREE.Object3D} root */
function stackOf(root) {
  let best = null, by = -Infinity;
  root.traverse((o) => {
    if (!o.isSkinnedMesh || !o.userData.glow) return;
    const P = o.geometry.attributes.position;
    for (let i = 0; i < P.count; i++) if (P.getY(i) > by) { by = P.getY(i); best = { mesh: o, idx: i }; }
  });
  return best;
}
const _stack = new THREE.Vector3();
// Smoke grey under any light (docs/art-critic-pass-reach-fx.md, rounds 4–7). The smoke is lit: Luminati's particle
// shader takes its colour × (amb + sun × 0.75), amb its own grey-blue by the night. Underground that "sun" is the rooms'
// warm key ((1.1, 0.56, 0.52) in the Old Barrows): the smoke went red-brown, the room's violet air over it, and it read
// purple. Each puff is let go white-balanced against the light it's let go in: STACK_GREY of the light's hue taken off
// (a quarter kept, so at dusk it takes the dusk as the works' chimney smoke beside it does), its brightness kept (Rec. 709
// luma), so it sits dark in a dark room and dims at night as everything round it does, but stays smoke. Its colour is a
// burst's own, written as it's let go (Particles.burst: the resolved preset's _color, cached per preset), so the cached
// config's colour is set before each puff: nothing made, no program (STACK_GAIN: no channel more than doubled under a
// light that has next to none of it).
const STACK_GREY = 0.75, STACK_GAIN = 2, NO_OVERRIDES = Object.freeze({});
let stackP = null, stackCfg = null, stackBase = null;
const greyGain = (t, L) => (t > 1e-3 ? Math.min(STACK_GAIN, 1 + STACK_GREY * (L / t - 1)) : 1);
function greyPuff(P) {
  if (stackP !== P) { stackP = P; stackCfg = P._burstConfig ? P._burstConfig('emberStackSmoke', NO_OVERRIDES) : null; stackBase = stackCfg ? stackCfg._color.clone() : null; }
  if (!stackCfg) return;
  const s = globalUniforms.uSunColor.value, n = globalUniforms.uNight.value;   // (the shader's own: Particles.js, a lit burst)
  const r = 0.42 - 0.36 * n + s.r * 0.75, g = 0.45 - 0.37 * n + s.g * 0.75, b = 0.52 - 0.37 * n + s.b * 0.75, L = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  stackCfg._color.setRGB(stackBase.r * greyGain(r, L), stackBase.g * greyGain(g, L), stackBase.b * greyGain(b, L));
}
/** the stack breathing, dt s of it (placeFigure, a furnace stood this frame) */
function puffStack(f, dt) {
  const P = game?.particles; if (!P || !f.stack) return;
  f.puff += dt; if (f.puff < STACK_EVERY) return;
  greyPuff(P);
  const { mesh, idx } = f.stack;
  _stack.fromBufferAttribute(mesh.geometry.attributes.position, idx); mesh.applyBoneTransform(idx, _stack); _stack.applyMatrix4(mesh.matrixWorld);
  for (; f.puff >= STACK_EVERY; f.puff -= STACK_EVERY) { P.burst('emberStackSmoke', _stack, 1); if (++f.puffN % STACK_SPARK === 0) P.burst('emberStackSpark', _stack, 1); }
}
/** the bosses' moments in Luminati's particles (renderer.js puffs, hybrid.js), each a burst where it happens */
const _puff = new THREE.Vector3();
const PUFFS = { strike: [['emberForgeSparks', 12, 0.55]], arm: [['emberArmSparks', 22, 0.3]], spoil: [['emberSpoilSmoke', 14, 0.6], ['emberSpoilEmbers', 8, 0.55]], vent: [['emberVentSlag', 12, 0.1], ['emberVentSmoke', 4, 0.2]] };
function placePuffs(list) {
  const P = game?.particles; if (!P || !list) return;
  for (const q of list) { const B = PUFFS[q.kind]; if (!B) continue; for (const [preset, n, lift] of B) { _puff.set(q.x, game.tileMap.getHeight(q.x, q.z) + lift, q.z); P.burst(preset, _puff, n); } }
}
const WARN_EMI = new THREE.Color(1, 0.45, 0.15);
/** stand, pose and light a figure as a model: false while its model is still coming (draw the sprite) */
function placeFigure(a, key, dt, camAz) {
  if (FIGURES !== 'models') return false;
  const def = castOf(a.name); if (!def) return false;
  const T = templateOf(a.name, def, a.look || null, a.lk || ''), meta = metaOf.get(a.name); if (!T || !meta) return false;
  T.used = figSeen;
  // the clip and frame Emberlit chose: the atlas column's clip, its frame within it
  let ck = null; for (const k in meta.clips) { const c = meta.clips[k]; if (a.col >= c.start && a.col < c.start + c.len) { ck = k; break; } }
  const d = ck && def.clips[ck]; if (!d) return false;
  const f = figureFor(key, a.lk ? `${a.name}#${a.lk}` : a.name, T), mc = meta.clips[ck], n = d.frames, fr = a.col - mc.start;   // (a new look: a new figure)
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
  for (const s of f.souls) s.visible = !a.empty;
  // a Vault in flight (src/render/leap.js): its pose, the chop over the jump's legs, on a model that carries the clips
  if (a.mv && def.moves) poseFigure(f, a.mv.clip, Math.min(0.999, a.mv.t), true, a.mv.legs ? { clip: a.mv.legs.clip, t: Math.min(0.999, a.mv.legs.t) } : null);
  else poseFigure(f, d.clip, Math.min(0.999, u), true);
  const k = (a.cw && meta.cw ? a.cw / meta.cw : 1) * T.ppu / NATIVE_PER_UNIT;
  const L = T.look; if (L) f.root.scale.set(k * L.w, k * L.h, k * L.w); else f.root.scale.setScalar(k);   // (a build's girth, a height's stature)
  f.root.position.set(a.x, game.tileMap.getHeight(a.x, a.z) - T.minY * k * (L ? L.h : 1) + (a.air || 0), a.z);   // (air: a leap's height)
  f.root.updateMatrixWorld(true);
  // its light: a share of the sprites' self-light, a hit's white flash, a wind-up's ember glow (as the sprites' tint)
  const fl = a.flash || 0, wn = fl ? 0 : Math.round((a.warn || 0) * 20) / 20, op = 1 - (a.fade || 0);
  if (f.stack && op > 0.5) puffStack(f, dt);                   // (Furnace Nine's stack smoke: while it stands, not as it goes out)
  const lit = `${figGlow}|${fl}|${wn}|${op.toFixed(2)}`;
  if (f.lit !== lit) {
    f.lit = lit;
    for (const q of f.mats) {
      if (!q.own) { if (wn) q.m.emissive.copy(q.base).lerp(WARN_EMI, Math.min(1, wn)); else q.m.emissive.copy(q.base); q.m.emissiveIntensity = figGlow * FILL + q.add + fl * 2.6 + wn * 0.9; }
      const tr = op < 0.999; if (q.m.transparent !== tr) { q.m.transparent = tr; q.m.needsUpdate = true; } q.m.opacity = op;
    }
  }
  if (f.shines) { const br = 0.75 + 0.25 * Math.sin(performance.now() * 0.0026 + f.root.id);   // (an heirloom's light pulses: gear.js)
    for (const q of f.mats) if (q.shine) q.m.emissiveIntensity = figGlow * FILL + q.add * br + fl * 2.6 + wn * 0.9; }
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
  // a member's look nobody wears any more (a restyle, a piece taken off: GDD v1.65) let go after two minutes, with the
  // geometry its build merged for itself (the models' own are shared, and stay) and the pictures it painted for itself
  // (its face, a variant's recoloured sheet) once no look left wears them; so a long evening at the smith, or a day's
  // walk past a hundred townsfolk each with their own face, doesn't grow the page (the owner, 2026-11-17: "Every now and
  // again the game will crash and relaunch": a 512² face a passer-by, a megabyte each, were never let go). A template a
  // frame: the check is a counter and a map's size.
  if (figSeen % 120 === 0) for (const [tk, T] of templates) {
    if (!T || !tk.includes('#') || figSeen - (T.used || 0) < 7200) continue;
    let worn = false; for (const f of figs.values()) if (f.name === tk) { worn = true; break; }
    if (worn) continue;
    for (const g of T.root.userData.ownGeos || []) g.dispose();
    templates.delete(tk);
    const mine = ownTextures(T.root);
    if (mine.size) { for (const U of templates.values()) if (U) for (const t of ownTextures(U.root)) mine.delete(t); for (const t of mine) forgetFace(t); }
    break;   // (one a sweep: the rest wait for the next)
  }
}
/** the pictures a figure's build painted for itself (faces.js facePicture, figure.js recolor): those it may let go */
function ownTextures(root) {
  const out = new Set();
  root.traverse((o) => { if (!o.isMesh) return; for (const m of Array.isArray(o.material) ? o.material : [o.material]) for (const k of ['map', 'emissiveMap']) { const t = m?.[k]; if (t && (t.userData?.faceKey || t.userData?.own)) out.add(t); } });
  return out;
}

// ── our own art kept by the converter: our building kit's models stood in 3D, or a sprite each from the env atlases ───
// Every piece the converter keeps (Luminati has no match for it) is a model of our own kit, tools/actor-lab/buildkit.js,
// that the bake turns into a sprite (bake-env.cjs, its entry in env.json or town.json). Stood here as itself instead:
// the same design, lit and shadowed by the world (docs/vale-landmarks-proposal.md; the owner, 2026-11-10: "the old
// design for the Keep actually looks OK - can we keep this, and are those tile assets re-usable for our overall asset
// catalogue?" — one catalogue). One kit unit is ten of our tiles, five of Luminati's units. Which pieces (?landmarks=):
//   'chosen' (the default, the owner's choices: the proposal's §8): every kit piece but the ones convert.js marks `card`
//     (Thornwick's palisade, towers and gatehouse seen from inside the town). Every region's since the buildings' art
//     pass (2026-11-15, docs/buildings-art-pass.md): the Fens' doors and Saltmere's stilts were cards till then;
//   'doors': the Vale's three dungeon doors alone, the Keep, the Old Barrows and the Sunken Chapel;
//   'all': every kit piece, cards and all;
//   'sprites': the baked sprites, as before.
let envSprites = [], LANDMARKS = 'chosen';
const KIT_UNIT = 5, KIT_LIFT = 1.3, KIT = new Map();
let KIT_MADE = new Map();   // (a level's: set aside with it, load())
for (const e of ENV_LIST) if (e.build) KIT.set(e.id, e);
for (const list of Object.values(TOWN_SETS)) for (const e of list) if (e.build) KIT.set(e.id, e);
// (the Cinder Reach's own pieces, docs/art-critic-pass-reach.md: Ashgate's pithead wheel over its gate, the Cinderworks'
// furnace hall and stacks, the Cold Seam's headframe, the other sites' doors, the slag heaps round Furnace Nine's yard,
// stood by convert.js on the sim's footprints, are town.json's reach_gatewheel … reach_slagheap: in 3D as the rest, and
// since docs/art-critic-pass-reach-fx.md baked as cards too, for ?landmarks=sprites; `nofoot`, no footprint of their own)
const DOORS = new Set(['vale_keep_1', 'ruin', 'chapelruin_0']);
/** a kit piece as one mesh a material (its many boxes merged: a phone draws a few calls, not sixty), lit windows in the
 * world's own glass (they light at dusk with the town's) */
function kitPiece(e, x, y, z) {
  // (one model an id a scene, its geometry shared by every copy: Thornwick's palisade is the same few pieces many times)
  const hit = KIT_MADE.get(e.id);
  if (hit) { const c = hit.clone(); c.position.set(x, y, z); return c; }
  const src = makeBuilding(e.build, e.style, e.seed || 1, !!e.faceX);
  if (e.rotY) src.rotation.y = e.rotY * Math.PI / 180;
  if (e.scale) src.scale.multiplyScalar(e.scale);
  src.updateMatrixWorld(true);
  const glass = game.world?.glassMaterial || null, by = new Map(), g = new THREE.Group();
  // the bake's grade (envlab.js: toward the luma by desat, the warm tint) on the albedo, in the shader, so the piece
  // takes its card's palette; not the bake's gain, which answers the bake's own bright lights: the world lights it
  // here, and an albedo lift (KIT_LIFT) brings it to its card's brightness (Wickham Keep at dusk: luma 40 at the gain,
  // 51 lifted, its card 64.5; saturation 0.59 → 0.57, the card 0.36)
  // (The slate roofs' blue at dusk is the world's dusk light and air, not their albedo: a stronger desaturation or a warm
  // tint on a roof moved Thornwick's gatehouse roof, blue over red 1.90, not at all; Luminati's own roofs take it too.)
  const desat = e.desat ?? 0.3, gain = KIT_LIFT, tint = e.tint || [0.95, 0.92, 1.0], gkey = `kitgrade:${desat},${gain},${tint}`;
  const grade = (m) => {
    const c = m.clone();
    c.onBeforeCompile = (sh) => {
      sh.uniforms.uGrade = { value: new THREE.Vector4(desat, gain * tint[0], gain * tint[1], gain * tint[2]) };
      sh.fragmentShader = 'uniform vec4 uGrade;\n' + sh.fragmentShader.replace('#include <color_fragment>', '#include <color_fragment>\n  { float L = dot(diffuseColor.rgb, vec3(0.3, 0.59, 0.11)); diffuseColor.rgb = mix(diffuseColor.rgb, vec3(L), uGrade.x) * uGrade.yzw; }');
    };
    c.customProgramCacheKey = () => gkey;
    return c;
  };
  src.traverse((o) => {
    if (!o.isMesh || o.userData.mask || o.userData.bakeOnly) return;   // (bakeOnly: what the world draws itself, the chapel's water)
    const m = o.userData.glow && glass ? glass : o.material;
    let geo = o.geometry.index ? o.geometry.toNonIndexed() : o.geometry.clone();
    geo.applyMatrix4(o.matrixWorld);
    if (!geo.attributes.normal) geo.computeVertexNormals();
    if (!geo.attributes.uv) geo.setAttribute('uv', new THREE.Float32BufferAttribute(new Float32Array(geo.attributes.position.count * 2), 2));
    for (const k of Object.keys(geo.attributes)) if (!['position', 'normal', 'uv', 'color'].includes(k) || (k === 'color' && !m.vertexColors)) geo.deleteAttribute(k);
    // (the kit's vertex-coloured pieces, rocks and turf, each made its own material: one shared for all of them)
    const key = m.vertexColors ? `vc|${m.flatShading}` : m.uuid;
    if (!by.has(key)) by.set(key, { m, geos: [] });
    by.get(key).geos.push(geo);
  });
  for (const { m, geos } of by.values()) {
    const merged = geos.length > 1 ? mergeGeometries(geos) : geos[0];
    if (!merged) continue;
    for (const q of geos) if (q !== merged) q.dispose();
    const mesh = new THREE.Mesh(merged, m === glass ? m : grade(m)); mesh.castShadow = mesh.receiveShadow = true; g.add(mesh);
  }
  g.name = `ember:kit:${e.id}`; g.scale.setScalar(KIT_UNIT); KIT_MADE.set(e.id, g);
  const c = g.clone(); c.position.set(x, y, z); return c;
}
/** The stairs under arches (GDD v1.57, docs/dungeon-stairs-proposal.md option A; the owner, 2026-11-10: "the up and down
 * stairs are too narrow - make them wider and add an arch that slightly glows so its more obvious", then "Option A with
 * the current brightness"; ?stairs=plain the stairs before them): a stone arch over
 * a floor's way up (at its head, against the wall, a dark doorway in it) or its way down (over the well's far edge),
 * in the floor's own wall stone (Luminati's builder: its textures and ambient occlusion), its inner edge a soft glow in
 * the way's own light (warm up, violet down: GDD §3.1), the world's bloom giving it a halo.
 * a: { kind, x, z (Luminati's units: the arch's middle on its face), rot, span (tiles across), level, glow, stone } */
const ARCH_GLOW = 1.7;   // (the glow's colour over 1: bloom's halo picks it up; a lamp's glass reads about 2.4)
function buildArch(a) {
  const f = game.world.factory, b = f.builder(), W = a.span, PH = a.kind === 'up' ? 1.55 : 1.35, PW = 0.42, D = 0.5, R = W / 2 + PW / 2;
  const stone = a.stone || 'stone_brick', dark = [0.05, 0.045, 0.06];
  for (const sx of [-1, 1]) {                                     // the piers, a plinth and an impost each
    b.box(stone, [PW + 0.1, 0.22, D + 0.1], { at: [sx * R, 0.11, 0] });
    b.box(stone, [PW, PH, D], { at: [sx * R, PH / 2, 0] });
    b.box(stone, [PW + 0.12, 0.12, D + 0.08], { at: [sx * R, PH - 0.06, 0] });
  }
  const N = 9;                                                     // the voussoirs round the half circle, the keystone proud
  for (let k = 0; k < N; k++) {
    const t = ((k + 0.5) / N) * Math.PI, key = k === (N - 1) / 2, c = Math.cos(t), sn = Math.sin(t);
    b.box(stone, [key ? 0.52 : 0.42, (Math.PI * R) / N * 0.96, key ? D + 0.1 : D], { at: [c * R, PH + sn * R, 0], rot: [0, 0, t] });
  }
  if (a.kind === 'up') b.tinted(dark, () => b.box(stone, [W, PH + R * 0.92, 0.3], { at: [0, (PH + R * 0.92) / 2, -0.2] }));   // the doorway's dark, into the wall
  const g = f.finish(b, `ember:arch:${a.kind}`, a.x, a.level * 0.5, a.z + (a.kind === 'up' ? 0.25 : 0), a.rot || 0);
  // the glow: a thin band round the opening's inner edge, up the piers and over the arch, unlit, a little over white
  const col = new THREE.Color(a.glow).multiplyScalar(ARCH_GLOW), m = new THREE.MeshBasicMaterial({ color: col, fog: false });
  const ri = R - PW / 2 - 0.02, band = new THREE.Mesh(new THREE.TorusGeometry(ri, 0.045, 5, 28, Math.PI), m);
  band.position.set(0, PH, D / 2 + 0.02); g.add(band);
  for (const sx of [-1, 1]) { const s = new THREE.Mesh(new THREE.BoxGeometry(0.09, PH - 0.22, 0.09), m); s.position.set(sx * ri, 0.22 + (PH - 0.22) / 2, D / 2 + 0.02); g.add(s); }
  g.traverse((o) => { if (o.isMesh) { o.castShadow = o.material !== m; o.receiveShadow = true; } });
  g.dispose = () => g.traverse((o) => { if (o.isMesh && o.material === m) o.geometry.dispose(); });
  return g;
}
/** The Shuttered Inn's frame, what hangs on its walls and its furniture (convert.js tavernDress, TAVERN_3D;
 * docs/tavern-dungeon.md): every piece built, then merged a material at a time, so the whole inn's dressing costs a draw
 * a material however many tables it has. Pieces in Luminati's units, world positions:
 *   post {x, z, n: 'z'|'x' (the face's normal: +z a north wall's, +x a west wall's), end}; beam {x0, z0, x1, z1, n, y};
 *   shield {x, z, n, y, look}; lantern {x, z, n, y}; board {x, z, n, y, seed}; logs {x, z, n, y, seed}; web {x, z, y};
 *   furn {type (a Luminati builder: table, bench, counter, shelf), x, z, rot, s (its scale), opts} */
const OAK = [0.5, 0.37, 0.27], OAK_LIT = [0.68, 0.5, 0.36],   // (round 5: the frame smoke-dark, a step under the furniture's worn oak, so the two part)
  TAV_IRON = [0.32, 0.3, 0.3];   // (round 3: the oak a step lighter, a warm mid-brown, and its top edge lit: near black, the frame was lost at a phone's size)
const SHIELD_LOOKS = [['quilt_ochre', [0.95, 0.9, 0.85]],   // (round 8: no bright red, a red disc and its boss read as an eye)
  ['quilt_blue', [0.9, 0.95, 1.1]], ['furniture_wood', [1, 0.9, 0.8]], ['quilt_green', [0.9, 1, 0.9]], ['cloth_red', [1.05, 0.95, 0.9]]];
let PATCH_TEX = null;
/** where the shaft lands: a soft oval, four darker stripes across it (the grate's bars' shadows) */
function barPatch() {
  if (PATCH_TEX) return PATCH_TEX;
  const c = document.createElement('canvas'); c.width = 64; c.height = 64;
  const g = /** @type {CanvasRenderingContext2D} */ (c.getContext('2d')), img = g.createImageData(64, 64);
  for (let y = 0; y < 64; y++) for (let x = 0; x < 64; x++) {
    const dx = x / 63 - 0.5, dy = y / 63 - 0.5, r = Math.sqrt(dx * dx * 4 + dy * dy * 4), bar = [0.2, 0.4, 0.6, 0.8].some((b) => Math.abs(x / 63 - b) < 0.055) ? 0.3 : 1;
    const k = Math.round(255 * Math.max(0, 1 - r) * bar), o = (y * 64 + x) * 4; img.data[o] = img.data[o + 1] = img.data[o + 2] = k; img.data[o + 3] = 255;
  }
  g.putImageData(img, 0, 0); PATCH_TEX = new THREE.CanvasTexture(c); PATCH_TEX.colorSpace = THREE.SRGBColorSpace;
  return PATCH_TEX;
}
const BONE_TINT = [1.06, 0.99, 0.83];   // (the dead's bones: old ivory, gone yellow-grey; round 6, a quarter down, they were the whitest thing on screen)   // (the dead's bones: old ivory, gone yellow-grey)
let cryptDark = null, cryptDamp = null, cryptPatch = null, cryptGold = null, cryptOx = null, cryptBrass = null;
/** a skull on its frame p (a wall's, or {n: 'z'} facing the camera), at u along it and y, s its size, v out of the wall */
function skull(b, p, u, y, s, v) {
  const on = (q, uu, yy, vv) => (q.n === 'z' ? [q.x + uu, yy, q.z + vv] : [q.x + vv, yy, q.z + uu]), sz = (q, w, h, d) => (q.n === 'z' ? [w, h, d] : [d, h, w]);
  b.tinted(BONE_TINT, () => {
    b.lathe('linen', [{ y: -0.45 * s, r: 0.5 * s }, { y: 0, r: 1.0 * s }, { y: 0.55 * s, r: 0.85 * s }, { y: 0.9 * s, r: 0 }], { segments: 10, at: on(p, u, y, v), capTop: true });
    b.box('linen', sz(p, 1.2 * s, 0.55 * s, 0.9 * s), { at: on(p, u, y - 0.55 * s, v + 0.25 * s) });   // (the face and the jaw)
  });
  cryptDark ||= new THREE.MeshBasicMaterial({ color: '#0d0a08' });
  for (const sg of [-1, 1]) b.box(cryptDark, sz(p, 0.36 * s, 0.34 * s, 0.05 * s), { at: on(p, u + sg * 0.3 * s, y - 0.12 * s, v + 0.72 * s) });   // (the eyes)
  b.box(cryptDark, sz(p, 0.16 * s, 0.24 * s, 0.05 * s), { at: on(p, u, y - 0.48 * s, v + 0.72 * s) });   // (the nose)
}
let tavernGlass = null, tavernWeb = null, tavernWebFill = null, tavernEmber = null, tavernNight = null, tavernNightHi = null, tavernStar = null, tavernGrime = null;
function buildTavern(pieces) {
  const f = game.world.factory, b = f.builder(), FL = 1.0, TOP = FL + TAV_H, furn = [], webTris = [];
  tavernGlass ||= new THREE.MeshBasicMaterial({ color: new THREE.Color('#ffb45e').multiplyScalar(2.2), fog: false });
  cryptDark ||= new THREE.MeshBasicMaterial({ color: '#0d0a08' });
  tavernWeb ||= new THREE.MeshBasicMaterial({ color: '#cfc9bf', transparent: true, opacity: 0.45, depthWrite: false });   // (round 3: grey-white, a third opaque)
  tavernWebFill ||= new THREE.MeshBasicMaterial({ color: '#e2dccf', transparent: true, opacity: 0.1, depthWrite: false, side: THREE.DoubleSide });   // (a film: at 0.28 a bay's web read as a white pennant, round 3)
  // (local frame per piece: u along the wall, v out of it into the room; a point on the face at (x, z))
  const on = (p, u, y, v) => (p.n === 'z' ? [p.x + u, y, p.z + v] : [p.x + v, y, p.z + u]);
  const sz = (p, w, h, d) => (p.n === 'z' ? [w, h, d] : [d, h, w]);
  const tilt = (p, a) => (p.n === 'z' ? [0, 0, -a] : [a, 0, 0]);   // (leaning toward +u by a radians, in the wall's plane)
  const STORY_S = new Set(['shelf', 'antlers', 'pegs', 'slate', 'herbs']);
  for (const p of pieces) {
    const big = STORY_S.has(p.k) || p.k === 'plaque' || p.k === 'saint' || p.k === 'mourner' || p.k === 'greattomb' || p.k === 'hatchment';   // (the bay's story items built half again as big about their anchor: round 6, "dark specks")
    if (big) { const S = p.k === 'plaque' ? 1.8 : p.k === 'saint' ? 1.45 : p.k === 'mourner' ? 1.2 : p.k === 'greattomb' ? 1.3 : p.k === 'hatchment' ? 1.3 : 1.95, A = p.k === 'plaque' ? on(p, 0, FL + 1.7, 0) : p.k === 'saint' || p.k === 'mourner' || p.k === 'greattomb' ? [p.x, FL, p.z] : on(p, 0, p.y, 0);   // (round 6: the founder's canopy 1.3×, the vault's showpiece; the hatchments 1.8 across)
      b.pushMatrix(new THREE.Matrix4().makeTranslation(A[0], A[1], A[2]).multiply(new THREE.Matrix4().makeScale(S, S, S)).multiply(new THREE.Matrix4().makeTranslation(-A[0], -A[1], -A[2]))); }   // (the crypt's tablet half again as big: round 1)
    if (p.k === 'post') b.tinted(OAK, () => {
      const u = p.end * 0.13;
      b.box('furniture_wood', sz(p, 0.28, TAV_H, 0.2), { at: on(p, u, FL + TAV_H / 2, 0.1) });
      b.box('furniture_wood', sz(p, 0.42, 0.16, 0.28), { at: on(p, u, FL + 0.08, 0.14) });   // (a footing)
      b.box('furniture_wood', sz(p, 0.26, 0.26, 1.05), { at: on(p, u, TOP - 0.3, 0.52) });   // (a joist's end jutting into the room: the floor above)
      if (!p.end) for (const sg of [-1, 1]) b.box('furniture_wood', sz(p, 0.14, 0.95, 0.14), { at: on(p, sg * 0.36, TOP - 0.62, 0.09), rot: tilt(p, sg * 0.72) });   // (knee braces up to the beam)
    });
    else if (p.k === 'beam') b.tinted(OAK, () => {
      const len = Math.hypot(p.x1 - p.x0, p.z1 - p.z0), q = { ...p, x: (p.x0 + p.x1) / 2, z: (p.z0 + p.z1) / 2 };
      b.box('furniture_wood', sz(q, len, 0.3, 0.2), { at: on(q, 0, p.y, 0.1) });
      b.tinted(OAK_LIT, () => b.box('furniture_wood', sz(q, len, 0.04, 0.22), { at: on(q, 0, p.y + 0.17, 0.11) }));
      b.box('furniture_wood', sz(q, len, 0.12, 0.14), { at: on(q, 0, FL + 1.05, 0.07) });   // (a rail at the dado: the frame's middle course)
    });
    else if (p.k === 'shield') {
      const [mat, tint] = SHIELD_LOOKS[p.look % SHIELD_LOOKS.length], rot = p.n === 'z' ? [Math.PI / 2, 0, 0] : [0, 0, -Math.PI / 2], R = 0.46, at = on(p, 0, p.y, 0.03);
      if (p.look % 3 === 0) b.tinted([0.36, 0.36, 0.39], () => {   // (crossed blades behind one in three, dull steel: round 4, "white pinwheels")
        for (const sg of [-1, 1]) { b.box('metal', sz(p, 0.07, 1.5, 0.03), { at: on(p, 0, p.y - 0.05, 0.02), rot: tilt(p, sg * 0.7) }); b.box('metal', sz(p, 0.3, 0.06, 0.05), { at: on(p, sg * 0.5, p.y - 0.58, 0.03), rot: tilt(p, sg * 0.7) }); }
      });
      b.tinted(tint, () => b.lathe(mat, [{ y: 0, r: 0 }, { y: 0.03, r: R }, { y: 0.07, r: R }, { y: 0.09, r: 0 }], { segments: 16, at, rot }));
      b.tinted([0.6, 0.56, 0.52], () => {
        b.lathe('metal', [{ y: 0.03, r: R + 0.05 }, { y: 0.03, r: R - 0.03 }, { y: 0.1, r: R - 0.03 }, { y: 0.1, r: R + 0.05 }, { y: 0.03, r: R + 0.05 }], { segments: 16, at, rot });   // the rim
        b.lathe('metal', [{ y: 0.08, r: 0.13 }, { y: 0.15, r: 0.1 }, { y: 0.19, r: 0 }], { segments: 10, at, rot });   // the boss
      });
    } else if (p.k === 'lantern') {
      const v = 0.85, y = p.y - 0.75;   // (an iron arm out from the wall, the lantern on a chain below it)
      b.tinted(TAV_IRON, () => {
        b.box('metal', sz(p, 0.06, 0.06, v + 0.05), { at: on(p, 0, p.y, v / 2) });
        b.box('metal', sz(p, 0.05, 0.4, 0.05), { at: on(p, 0, p.y - 0.18, 0.04) });
        b.box('metal', sz(p, 0.05, 0.05, 0.5), { at: on(p, 0, p.y - 0.18, 0.2), rot: p.n === 'z' ? [0.6, 0, 0] : [0, 0, -0.6] });
        b.box('metal', sz(p, 0.025, 0.42, 0.025), { at: on(p, 0, p.y - 0.21, v) });
        b.box('metal', sz(p, 0.34, 0.05, 0.34), { at: on(p, 0, y + 0.23, v) });
        b.box('metal', sz(p, 0.2, 0.08, 0.2), { at: on(p, 0, y + 0.28, v) });
        b.box('metal', sz(p, 0.3, 0.05, 0.3), { at: on(p, 0, y - 0.22, v) });
        for (const [du, dv] of [[-0.13, -0.13], [0.13, -0.13], [-0.13, 0.13], [0.13, 0.13]]) b.box('metal', sz(p, 0.03, 0.44, 0.03), { at: on(p, du, y, v + dv) });
      });
      b.box(tavernGlass, sz(p, 0.22, 0.38, 0.22), { at: on(p, 0, y, v) });
    } else if (p.k === 'board') {
      // the notice board: a timber frame and a header, cork-dark boards, the notices pinned askew, red wax on most
      b.tinted(OAK, () => { b.box('furniture_wood', sz(p, 3.4, 1.75, 0.1), { at: on(p, 0, p.y, 0.05) }); });
      b.tinted([1.02, 0.8, 0.55], () => { b.box('furniture_wood', sz(p, 3.8, 0.32, 0.18), { at: on(p, 0, p.y + 1.0, 0.09) }); for (const sg of [-1, 1]) b.box('furniture_wood', sz(p, 0.32, 0.46, 0.2), { at: on(p, sg * 1.95, p.y + 1.05, 0.1) }); b.box('furniture_wood', sz(p, 0.7, 0.2, 0.2), { at: on(p, 0, p.y + 1.24, 0.1) }); });   // (the header a step lighter, its ends carved up: round 4)
      b.tinted(OAK, () => { b.box('furniture_wood', sz(p, 2.7, 0.12, 0.2), { at: on(p, 0, p.y - 0.9, 0.1) }); });
      b.tinted([0.72, 0.6, 0.48], () => b.box('wood_planks', sz(p, 3.15, 1.5, 0.04), { at: on(p, 0, p.y, 0.11) }));
      const R = (k) => ((Math.imul(p.seed + k * 977, 0x9e3779b1) >>> 0) % 1000) / 1000;
      for (let k = 0; k < 15; k++) {
        const col = k % 5, row = (k / 5) | 0; if (col === 2 && row < 2) continue;   // (the wanted poster's place)
        const u = -1.3 + col * 0.65 + (R(k) - 0.5) * 0.12, y = p.y + 0.45 - row * 0.46 + (R(k + 9) - 0.5) * 0.08, w = 0.36 + R(k + 3) * 0.12, h = 0.36 + R(k + 5) * 0.08, a = (R(k + 7) - 0.5) * 0.35;
        b.tinted(R(k + 13) < 0.3 ? [0.95, 0.86, 0.66] : [1.02, 0.96, 0.8], () => b.box('linen', sz(p, w, h, 0.012), { at: on(p, u, y, 0.14), rot: tilt(p, a) }));
        if (R(k + 11) < 0.7) b.tinted([1.1, 0.22, 0.18], () => b.box('cloth_red', sz(p, 0.09, 0.09, 0.025), { at: on(p, u + (R(k + 15) - 0.5) * 0.1, y + h * 0.34, 0.155) }));
      }
      // the wanted poster: bigger, a face in charcoal, the reward in red; and a note pinned by a knife
      b.tinted([1.05, 0.95, 0.74], () => b.box('linen', sz(p, 0.9, 1.15, 0.014), { at: on(p, 0, p.y + 0.12, 0.14), rot: tilt(p, 0.04) }));
      b.tinted([0.1, 0.09, 0.09], () => b.lathe('linen', [{ y: 0, r: 0.24 }, { y: 0.012, r: 0.24 }], { segments: 12, at: on(p, 0, p.y + 0.3, 0.152), rot: p.n === 'z' ? [Math.PI / 2, 0, 0] : [0, 0, -Math.PI / 2], scale: [1, 1, 1.3] }));
      b.tinted([1.2, 0.2, 0.16], () => b.box('cloth_red', sz(p, 0.62, 0.1, 0.016), { at: on(p, 0, p.y - 0.22, 0.152) }));
      b.tinted([0.55, 0.55, 0.58], () => b.box('metal', sz(p, 0.05, 0.34, 0.03), { at: on(p, 1.25, p.y - 0.42, 0.2), rot: tilt(p, -0.6) }));
      b.tinted([0.4, 0.28, 0.2], () => b.box('furniture_wood', sz(p, 0.07, 0.14, 0.06), { at: on(p, 1.37, p.y - 0.3, 0.22), rot: tilt(p, -0.6) }));
    } else if (p.k === 'logs') {
      // split logs stacked against the wall, three, two, one, their cut ends to the room
      b.tinted([0.85, 0.75, 0.65], () => {
        for (const [row, n] of [[0, 4], [1, 3], [2, 2], [3, 1]]) for (let c = 0; c < n; c++) {
          const u = (c - (n - 1) / 2) * 0.3, y = p.y + 0.14 + row * 0.25;
          b.tube('bark', on(p, u, y, 0.06), on(p, u, y, 0.95), 0.14, 0.13, { segments: 7, capTop: 'furniture_wood', capBottom: 'furniture_wood' });
        }
      });
    } else if (p.k === 'web' || p.k === 'web2') {
      // a web across a high corner: threads from the corner out, rings across them, a film between. 'web': where a north
      // wall meets a west one; 'web2': in a bay, where a post meets the beam, across the wall's face (round 3: bigger, paler)
      let C, ends;
      if (p.k === 'web') {
        const S = 1.5; C = [p.x + 0.03, p.y, p.z + 0.03]; ends = [[C[0] + S, C[1], C[2]]];
        for (let q = 1; q <= 3; q++) { const t = (q / 4) * (Math.PI / 2); ends.push([C[0] + Math.cos(t) * S * 0.8, C[1] - Math.sin(t) * S * 0.95, C[2] + Math.sin(t) * Math.cos(t) * S * 0.9]); }
        ends.push([C[0], C[1] - S * 1.05, C[2]]); ends.push([C[0], C[1], C[2] + S]);
      } else {
        const S = p.size || 0.8, sg = p.side, u0 = sg * -1.85;   // (the post two tiles off, the web in its corner under the beam, spreading into the bay)
        C = on(p, u0, p.y, 0.06); ends = [];
        for (let q = 0; q <= 4; q++) { const t = (q / 4) * (Math.PI / 2); ends.push(on(p, u0 + sg * Math.cos(t) * S, p.y - Math.sin(t) * S, 0.06 + Math.sin(t * 2) * 0.2 * S)); }
      }
      const pt = (e, k) => [C[0] + (e[0] - C[0]) * k, C[1] + (e[1] - C[1]) * k, C[2] + (e[2] - C[2]) * k];
      for (const e of ends) b.tube(tavernWeb, C, e, 0.018, 0.014, { segments: 3 });
      for (const k of [0.28, 0.5, 0.72, 0.95]) for (let q = 0; q < ends.length - 1; q++) b.tube(tavernWeb, pt(ends[q], k), pt(ends[q + 1], k), 0.012, 0.012, { segments: 3 });
      for (let q = 0; q < ends.length - 1; q++) webTris.push(...C, ...ends[q], ...ends[q + 1]);
    } else if (p.k === 'surround') {
      // the common room's hearth in a stone surround: piers to the beam either side, an oak mantel across with its jugs
      const half = p.w / 2 + 0.36, my = FL + 1.85;
      for (const sg of [-1, 1]) {
        b.box('tavern_wall', sz(p, 0.72, TAV_H, 1.2), { at: on(p, sg * half, FL + TAV_H / 2, 0.6) });
        b.box('tavern_wall', sz(p, 0.86, 0.2, 1.32), { at: on(p, sg * half, FL + 0.1, 0.66) });   // (its plinth)
      }
      { const h1 = TOP - my; b.tinted([1.12, 1.07, 0.98], () => b.box('tavern_wall', sz(p, p.w * 0.82, h1, 1.05), { at: on(p, 0, my + h1 / 2, 0.52) }));   // (the breast to the beam, lighter stone)
        b.tinted([0.82, 0.77, 0.7], () => b.box('tavern_wall', sz(p, p.w * 0.66, 0.8, 0.85), { at: on(p, 0, TOP + 0.4, 0.42) }));   // (above it the stack, narrower, soot-dark)
        b.tinted([0.6, 0.56, 0.52], () => b.box('tavern_wall', sz(p, p.w * 0.74, 0.16, 0.97), { at: on(p, 0, TOP + 0.86, 0.45) }));
        b.tinted([1.35, 1.25, 1.1], () => b.box('tavern_wall', sz(p, p.w * 0.76, 0.04, 0.99), { at: on(p, 0, TOP + 0.95, 0.45) })); }   // (its top edge lit, so the stack reads against the dark: round 7)   // (its cap course, projecting: round 6, "reads as a stack of crates")   // (the chimney breast from the mantel up through the beam, lighter stone, the room's tallest mass: round 5)
      b.tinted(OAK, () => b.box('furniture_wood', sz(p, p.w + 1.6, 0.26, 0.34), { at: on(p, 0, my, 1.12) }));
      for (const [u, kind] of [[-1.5, 'jug'], [-0.9, 'pot'], [0.6, 'jug'], [1.35, 'pot'], [-2.3, 'jug'], [2.25, 'jug']]) {
        const at = on(p, u, my + 0.13, 1.12);
        if (kind === 'jug') b.tinted([0.95, 0.72, 0.52], () => b.lathe('furniture_wood', [{ y: 0, r: 0.08 }, { y: 0.1, r: 0.12 }, { y: 0.22, r: 0.09 }, { y: 0.3, r: 0.05 }, { y: 0.34, r: 0.06 }], { segments: 9, capTop: true, at }));
        else b.tinted([0.5, 0.48, 0.46], () => b.lathe('metal', [{ y: 0, r: 0.1 }, { y: 0.14, r: 0.13 }, { y: 0.18, r: 0.12 }], { segments: 9, capTop: true, at }));
      }
    } else if (p.k === 'apron') {
      // on the hearthstones: a log fallen half out of the fire and a spill of embers, glowing (the fire reads past the lintel)
      b.tinted([0.7, 0.55, 0.45], () => b.tube('bark', on(p, -0.5, FL + 0.1, 1.15), on(p, 0.35, FL + 0.1, 1.45), 0.1, 0.09, { segments: 7, capTop: 'furniture_wood', capBottom: 'furniture_wood' }));
      const R = (k) => ((Math.imul(p.seed + k * 977, 0x9e3779b1) >>> 0) % 1000) / 1000;
      for (let k = 0; k < 9; k++) b.box(tavernEmber ||= new THREE.MeshBasicMaterial({ color: new THREE.Color('#ff6a1e').multiplyScalar(1.6), fog: false }), [0.07, 0.04, 0.07], { at: on(p, (R(k) - 0.5) * 1.6, FL + 0.02, 1.1 + R(k + 5) * 0.55), rot: [0, R(k + 9) * 3, 0] });
    } else if (p.k === 'tableware') {
      // tankards along the table, wood and pewter, and a candle in its dish in the middle (Luminati's plates beside them)
      const c = Math.cos(p.rot || 0), sn = Math.sin(p.rot || 0), W = (lx, lz) => [p.x + lx * c + lz * sn, p.z - lx * sn + lz * c];
      const R = (k) => ((Math.imul(p.seed + k * 977, 0x9e3779b1) >>> 0) % 1000) / 1000, y = FL + (p.y - TAV_FLOOR) ;
      for (let k = 0; k < 5; k++) {
        const [tx, tz] = W(-1.15 + k * 0.55 + (R(k) - 0.5) * 0.2, (R(k + 7) < 0.5 ? -1 : 1) * (0.32 + R(k + 3) * 0.1));
        if (Math.abs(-1.15 + k * 0.55) < 0.2) continue;   // (the candle's place)
        const pewter = R(k + 11) < 0.4, mat = pewter ? 'metal' : 'furniture_wood';
        b.tinted(pewter ? [0.75, 0.74, 0.72] : [0.85, 0.62, 0.42], () => {
          b.lathe(mat, [{ y: 0, r: 0.085 }, { y: 0.2, r: 0.075 }, { y: 0.22, r: 0.08 }], { segments: 8, capTop: true, at: [tx, y, tz] });
          b.box(mat, [0.03, 0.12, 0.08], { at: [tx + 0.1, y + 0.1, tz] });   // (its handle)
        });
      }
      const [cx, cz] = W(0, 0);
      b.tinted([0.5, 0.48, 0.46], () => b.lathe('metal', [{ y: 0, r: 0.13 }, { y: 0.03, r: 0.13 }, { y: 0.035, r: 0 }], { segments: 10, at: [cx, y, cz] }));
      b.tinted([1.2, 1.15, 1.0], () => b.lathe('linen', [{ y: 0.03, r: 0.045 }, { y: 0.26, r: 0.04 }], { segments: 7, capTop: true, at: [cx, y, cz] }));
      b.box(tavernGlass, [0.05, 0.1, 0.05], { at: [cx, y + 0.33, cz] });
    } else if (p.k === 'cauldron') {
      // the kitchen's pot hung low in the fire's mouth on an iron crane, black against the flames, the stew bright on top
      b.tinted([0.12, 0.11, 0.11], () => {
        b.box('metal', sz(p, 0.12, 1.7, 0.12), { at: on(p, -1.05, FL + 0.85, 0.85) });
        b.box('metal', sz(p, 1.1, 0.1, 0.1), { at: on(p, -0.5, FL + 1.55, 0.85) });
        b.box('metal', sz(p, 0.05, 0.55, 0.05), { at: on(p, 0, FL + 1.25, 0.85) });
        b.lathe('metal', [{ y: 0, r: 0.14 }, { y: 0.12, r: 0.34 }, { y: 0.36, r: 0.42 }, { y: 0.52, r: 0.37 }, { y: 0.56, r: 0.4 }], { segments: 14, at: on(p, 0, FL + 0.4, 0.85) });
      });
      b.box(tavernEmber ||= new THREE.MeshBasicMaterial({ color: new THREE.Color('#ff6a1e').multiplyScalar(1.6), fog: false }), sz(p, 0.6, 0.02, 0.6), { at: on(p, 0, FL + 0.95, 0.85) });
    } else if (p.k === 'window') {
      // a shuttered window: a pale dressed-stone surround (lintel, jambs), a sill board with a candle, two weathered plank
      // shutters rimmed cool where the night leaks round them, a black iron bar across, the crack a soft glow, not a line
      // (round 7: "the crack is many times brighter than everything else in the window")
      const W = 1.3, H = 1.55;
      b.tinted([1.5, 1.44, 1.32], () => { b.box('tavern_wall', sz(p, W + 1.0, 0.4, 0.4), { at: on(p, 0, p.y + H / 2 + 0.2, 0.2) }); for (const sg of [-1, 1]) b.box('tavern_wall', sz(p, 0.4, H + 0.2, 0.36), { at: on(p, sg * (W / 2 + 0.2), p.y, 0.18) }); });
      b.tinted(OAK_LIT, () => b.box('furniture_wood', sz(p, W + 1.1, 0.12, 0.48), { at: on(p, 0, p.y - H / 2 - 0.06, 0.24) }));
      // the right shutter shut and barred, the left swung open into the room on its hinge, the night dark-blue behind it
      // (round 8: the crack and the rims read as two blue strips; one open shutter reads as a window at a glance)
      const A = 1.1, ajar = p.n === 'z' ? [0, -A, 0] : [0, A, 0];
      b.tinted([0.82, 0.72, 0.6], () => { b.box('wood_planks', sz(p, W / 2 - 0.05, H, 0.06), { at: on(p, W / 4 + 0.03, p.y, 0.06) }); b.box('wood_planks', sz(p, W / 2 - 0.1, 0.1, 0.03), { at: on(p, W / 4 + 0.03, p.y - 0.45, 0.1) }); });
      // (the open shutter warm in the sill candle's light, its face to the room, against the dark: round 9)
      b.tinted([1.3, 1.08, 0.72], () => { b.box('wood_planks', sz(p, W / 2 - 0.05, H, 0.08), { at: on(p, -W / 2 + Math.cos(A) * W / 4, p.y, 0.1 + Math.sin(A) * W / 4), rot: ajar }); b.box('wood_planks', sz(p, W / 2 - 0.1, 0.1, 0.05), { at: on(p, -W / 2 + Math.cos(A) * W / 4 + (p.n === 'z' ? 0.03 : 0.05), p.y - 0.45, 0.1 + Math.sin(A) * W / 4 + (p.n === 'z' ? 0.05 : 0.03)), rot: ajar }); });
      b.tinted([0.1, 0.1, 0.1], () => { b.box('metal', sz(p, W / 2 + 0.3, 0.12, 0.07), { at: on(p, W / 4 + 0.05, p.y + 0.12, 0.13) }); b.box('metal', sz(p, 0.08, 0.2, 0.1), { at: on(p, W / 2 + 0.27, p.y + 0.12, 0.12) }); });
      // the night through the open half: a hole, darker than the stone, a touch lighter at its top, two faint stars (round
      // 9: a lit royal-blue panel read as a banner)
      b.box(tavernNight ||= new THREE.MeshBasicMaterial({ color: new THREE.Color('#0b1019'), fog: false }), sz(p, W / 2 - 0.04, H - 0.04, 0.02), { at: on(p, -W / 4, p.y, 0.03) });
      b.box(tavernNightHi ||= new THREE.MeshBasicMaterial({ color: new THREE.Color('#141c2e'), fog: false }), sz(p, W / 2 - 0.04, H * 0.3, 0.02), { at: on(p, -W / 4, p.y + H * 0.33, 0.035) });
      for (const [du, dv] of [[-0.42, 0.55], [-0.2, 0.3]]) b.box(tavernStar ||= new THREE.MeshBasicMaterial({ color: new THREE.Color('#8c97b4'), fog: false }), sz(p, 0.035, 0.035, 0.01), { at: on(p, du, p.y + dv, 0.042) });
      // a candle on the sill board, the window's own warm light
      b.tinted([1.2, 1.15, 1.0], () => b.lathe('linen', [{ y: 0, r: 0.05 }, { y: 0.22, r: 0.045 }], { segments: 7, capTop: true, at: on(p, W / 2 - 0.15, p.y - H / 2, 0.3) }));
      b.box(tavernGlass, [0.05, 0.09, 0.05], { at: on(p, W / 2 - 0.15, p.y - H / 2 + 0.28, 0.3) });
    } else if (p.k === 'grime') {
      // grime at the wall's foot: a darkened band, soft at its top
      const len = Math.hypot(p.x1 - p.x0, p.z1 - p.z0), q = { ...p, x: (p.x0 + p.x1) / 2, z: (p.z0 + p.z1) / 2 };
      b.box(tavernGrime ||= new THREE.MeshBasicMaterial({ color: '#0e0a08', transparent: true, opacity: 0.34, depthWrite: false }), sz(q, len, 0.42, 0.01), { at: on(q, 0, FL + 0.21, 0.012) });
      b.box(tavernGrime, sz(q, len, 0.28, 0.01), { at: on(q, 0, FL + 0.56, 0.012) });
    } else if (p.k === 'shelf') {
      // a plate shelf: a board on brackets, plates stood on edge, jugs between
      b.tinted(OAK, () => { b.box('furniture_wood', sz(p, 1.5, 0.07, 0.3), { at: on(p, 0, p.y, 0.15) }); for (const sg of [-1, 1]) b.box('furniture_wood', sz(p, 0.06, 0.28, 0.24), { at: on(p, sg * 0.6, p.y - 0.17, 0.12) }); b.box('furniture_wood', sz(p, 1.5, 0.04, 0.04), { at: on(p, 0, p.y + 0.12, 0.27) }); });
      for (const u of [-0.55, -0.2, 0.3]) b.tinted([1.5, 1.48, 1.45], () => b.lathe('linen', [{ y: 0, r: 0 }, { y: 0.01, r: 0.17 }, { y: 0.03, r: 0.17 }, { y: 0.04, r: 0 }], { segments: 12, at: on(p, u, p.y + 0.2, 0.08), rot: p.n === 'z' ? [Math.PI / 2 - 0.2, 0, 0] : [0, 0, -Math.PI / 2 + 0.2] }));
      for (const u of [0.05, 0.6]) b.tinted([0.9, 0.62, 0.42], () => b.lathe('furniture_wood', [{ y: 0, r: 0.07 }, { y: 0.09, r: 0.1 }, { y: 0.2, r: 0.07 }, { y: 0.26, r: 0.04 }], { segments: 8, capTop: true, at: on(p, u, p.y + 0.035, 0.15) }));
    } else if (p.k === 'antlers') {
      // a stag's antlers on a shield-shaped plaque
      b.tinted([0.2, 0.14, 0.1], () => b.box('furniture_wood', sz(p, 0.42, 0.55, 0.06), { at: on(p, 0, p.y + 0.2, 0.03) }));   // (a walnut plaque, near black, so the tines stand out: round 9)
      b.tinted([1.6, 1.52, 1.34], () => {
        for (const sg of [-1, 1]) {
          b.box('linen', sz(p, 0.07, 0.6, 0.07), { at: on(p, sg * 0.25, p.y + 0.55, 0.1), rot: tilt(p, -sg * 0.6) });
          b.box('linen', sz(p, 0.06, 0.45, 0.06), { at: on(p, sg * 0.52, p.y + 0.85, 0.1), rot: tilt(p, sg * 0.15) });
          for (const [du, dy, a] of [[0.33, 0.68, -0.1], [0.62, 1.02, 0.5], [0.44, 0.98, -0.4], [0.18, 0.5, 0.9], [0.58, 1.2, -0.2]]) b.box('linen', sz(p, 0.065, 0.3, 0.065), { at: on(p, sg * du, p.y + dy, 0.1), rot: tilt(p, -sg * a) });
        }
      });
    } else if (p.k === 'pegs') {
      // a peg rail with a cloak hung on it and a hat on the next peg
      b.tinted(OAK, () => { b.box('furniture_wood', sz(p, 1.4, 0.1, 0.06), { at: on(p, 0, p.y + 0.4, 0.03) }); for (const u of [-0.45, 0, 0.45]) b.box('furniture_wood', sz(p, 0.05, 0.05, 0.14), { at: on(p, u, p.y + 0.4, 0.1) }); });
      b.tinted([0.85, 1.05, 0.8], () => { b.box('quilt_green', sz(p, 0.5, 1.05, 0.1), { at: on(p, -0.42, p.y - 0.15, 0.1) }); b.box('quilt_green', sz(p, 0.6, 0.4, 0.12), { at: on(p, -0.42, p.y - 0.62, 0.11) }); });
      b.tinted([0.45, 0.35, 0.28], () => { b.lathe('leather', [{ y: 0, r: 0.24 }, { y: 0.02, r: 0.24 }, { y: 0.03, r: 0.13 }, { y: 0.2, r: 0.11 }, { y: 0.21, r: 0 }], { segments: 10, at: on(p, 0.45, p.y + 0.18, 0.18), rot: p.n === 'z' ? [Math.PI / 2 - 0.3, 0, 0] : [0, 0, -Math.PI / 2 + 0.3] }); });
    } else if (p.k === 'slate') {
      // the slate by the bar: a framed dark board, tallies in chalk
      b.tinted(OAK_LIT, () => b.box('furniture_wood', sz(p, 0.9, 0.7, 0.06), { at: on(p, 0, p.y, 0.03) }));
      b.tinted([0.22, 0.23, 0.25], () => b.box('metal', sz(p, 0.78, 0.58, 0.02), { at: on(p, 0, p.y, 0.065) }));
      b.tinted([1.7, 1.7, 1.65], () => { for (let r = 0; r < 3; r++) for (let k = 0; k < 4 + r; k++) b.box('linen', sz(p, 0.018, 0.1, 0.01), { at: on(p, -0.3 + k * 0.07 + (k > 3 ? 0.06 : 0), p.y + 0.16 - r * 0.15, 0.078) }); });
    } else if (p.k === 'herbs') {
      // herbs drying from a pole: bunches hung head down
      b.tinted(OAK, () => b.box('furniture_wood', sz(p, 1.5, 0.06, 0.06), { at: on(p, 0, p.y + 0.55, 0.28) }));
      for (let k = 0; k < 5; k++) b.tinted(k % 2 ? [0.75, 1.0, 0.5] : [1.0, 0.88, 0.5], () => b.lathe('leaves', [{ y: -0.4, r: 0.02 }, { y: -0.28, r: 0.1 }, { y: -0.05, r: 0.06 }, { y: 0, r: 0.02 }], { segments: 6, capTop: true, at: on(p, -0.6 + k * 0.3, p.y + 0.52, 0.28) }));
    } else if (p.k === 'niche') {
      // a cellar's niche: a dark recess in the rubble, a stone sill, candles in it
      b.tinted([0.18, 0.15, 0.13], () => b.box('tavern_rubble', sz(p, 0.6, 0.7, 0.06), { at: on(p, 0, p.y + 0.3, 0.02) }));
      b.tinted([1.05, 1.0, 0.92], () => { b.box('tavern_rubble', sz(p, 0.8, 0.12, 0.26), { at: on(p, 0, p.y - 0.06, 0.12) }); b.box('tavern_rubble', sz(p, 0.8, 0.14, 0.16), { at: on(p, 0, p.y + 0.72, 0.08) }); });
      for (const [u, h] of [[-0.15, 0.24], [0.05, 0.34], [0.2, 0.18]]) {
        b.tinted([1.2, 1.15, 1.0], () => b.lathe('linen', [{ y: 0, r: 0.045 }, { y: h, r: 0.04 }], { segments: 7, capTop: true, at: on(p, u, p.y, 0.12) }));
        b.box(tavernGlass, [0.04, 0.08, 0.04], { at: on(p, u, p.y + h + 0.06, 0.12) });
      }
    } else if (p.k === 'ham') {
      // on a hook from the vault: a ham in its cloth, or a string of onions
      b.tinted(TAV_IRON, () => b.box('metal', sz(p, 0.03, 0.35, 0.03), { at: on(p, 0, p.y + 0.2, 0.3) }));
      if (p.look) b.tinted([0.85, 0.55, 0.4], () => b.lathe('linen', [{ y: -0.62, r: 0.04 }, { y: -0.52, r: 0.17 }, { y: -0.25, r: 0.2 }, { y: -0.06, r: 0.1 }, { y: 0, r: 0.03 }], { segments: 9, capTop: true, at: on(p, 0, p.y, 0.3) }));
      else for (let k = 0; k < 6; k++) b.tinted([1.0, 0.78, 0.45], () => b.lathe('linen', [{ y: -0.07, r: 0.02 }, { y: -0.04, r: 0.07 }, { y: 0.02, r: 0.06 }, { y: 0.05, r: 0.01 }], { segments: 7, at: on(p, (k % 2 ? 0.05 : -0.05), p.y - 0.1 - k * 0.1, 0.3) }));
    } else if (p.k === 'casks') {
      // two casks on a cradle against the wall, their heads to the room, a third laid on them
      b.tinted(OAK, () => { for (const du of [-0.5, 0.5]) b.box('furniture_wood', sz(p, 1.9, 0.16, 0.14), { at: on(p, 0, FL + 0.08, 0.35 + du) }); });
      for (const [du, dy] of [[-0.5, 0.06], [0.5, 0.06], [0, 0.8]]) {
        const [cx, , cz] = on(p, du, 0, 0.12), o = f.barrel(cx, FL + dy, cz, { lying: true, height: 1.25, radius: 0.46, rotation: p.n === 'z' ? 0 : Math.PI / 2, seed: p.seed + du * 10 }).object;
        if (o) { o.updateMatrixWorld(true); furn.push(o); }
      }
    } else if (p.k === 'pier') {
      // ── the crypt (convert.js cryptRun, docs/crypt-dungeon.md): a pier of the blind arcade, its base and its capital
      // where the arches spring, on up to the cornice
      const u = p.end * 0.2, PH = (p.top || TOP) - FL;
      b.tinted([1.02, 1.0, 0.97], () => b.box('crypt_wall', sz(p, 0.6, PH, 0.34), { at: on(p, u, FL + PH / 2, 0.17) }));
      b.tinted([0.92, 0.9, 0.88], () => b.box('crypt_cap', sz(p, 0.74, 0.32, 0.42), { at: on(p, u, FL + 0.16, 0.21) }));
      b.tinted([1.18, 1.15, 1.08], () => { b.box('crypt_cap', sz(p, 0.72, 0.16, 0.44), { at: on(p, u, CR_SPRING + 0.08, 0.22) }); b.box('crypt_cap', sz(p, 0.62, 0.1, 0.38), { at: on(p, u, CR_SPRING - 0.05, 0.19) }); });
    } else if (p.k === 'cornice' || p.k === 'plinth') {
      const len = Math.hypot(p.x1 - p.x0, p.z1 - p.z0), q = { ...p, x: (p.x0 + p.x1) / 2, z: (p.z0 + p.z1) / 2 };
      if (p.k === 'cornice') {
        b.tinted([1.05, 1.02, 0.97], () => b.box('crypt_cap', sz(q, len, 0.28, 0.32), { at: on(q, 0, p.y, 0.16) }));
        b.tinted([1.3, 1.26, 1.18], () => b.box('crypt_cap', sz(q, len, 0.04, 0.36), { at: on(q, 0, p.y + 0.15, 0.18) }));   // (its top edge lit, so the wall's line reads)
        b.tinted([1.25, 1.2, 1.1], () => b.box('crypt_top', sz(q, len, 0.12, 0.55), { at: on(q, 0, p.y + 0.21, 0.0) }));   // (the coping over the wall's top, proud of its face: round 4, "the cut tops look unfinished")
      } else {
        b.tinted([0.86, 0.84, 0.82], () => b.box('crypt_cap', sz(q, len, 0.26, 0.14), { at: on(q, 0, FL + 0.13, 0.07) }));
        b.box(cryptDamp ||= new THREE.MeshBasicMaterial({ color: '#10120e', transparent: true, opacity: 0.3, depthWrite: false }), sz(q, len, 0.5, 0.01), { at: on(q, 0, FL + 0.5, 0.012) });   // (damp rising up the wall's foot)
      }
    } else if (p.k === 'arcade') {
      // a blind arch between two piers, a depressed one (the walls stand three units: a round arch over a four-tile bay
      // would rise past the cornice): the bay's back a shade darker, the arch's voussoirs over it from the capitals, a
      // keystone at its crown
      const R = p.w / 2 - 0.05, RV = Math.min(R, (p.top || TOP) - 0.42 - CR_SPRING), N = 13, pt = (th, k) => [Math.cos(th) * (R + k), CR_SPRING + Math.sin(th) * (RV + k)];
      b.tinted([0.42, 0.36, 0.3], () => {
        b.box('crypt_wall', sz(p, 2 * R, CR_SPRING - FL - 0.26, 0.02), { at: on(p, 0, (CR_SPRING + FL + 0.26) / 2, 0.01) });
        b.lathe('crypt_wall', [{ y: 0, r: 0 }, { y: 0.001, r: R }, { y: 0.02, r: R }, { y: 0.021, r: 0 }], { segments: 20, at: on(p, 0, CR_SPRING, 0.0), rot: p.n === 'z' ? [Math.PI / 2, 0, 0] : [0, 0, -Math.PI / 2], scale: p.n === 'z' ? [1, 1, RV / R] : [RV / R, 1, 1] });
      });
      b.tinted([1.52, 1.46, 1.34], () => {
        for (let k = 0; k < N; k++) {
          const t0 = (k / N) * Math.PI, t1 = ((k + 1) / N) * Math.PI, [u0, y0] = pt(t0, 0.11), [u1, y1] = pt(t1, 0.11);
          b.box('crypt_cap', sz(p, Math.hypot(u1 - u0, y1 - y0) + 0.03, 0.3, 0.4), { at: on(p, (u0 + u1) / 2, (y0 + y1) / 2, 0.2), rot: tilt(p, -Math.atan2(y1 - y0, u1 - u0)) });
        }
      });
      b.tinted([1.62, 1.55, 1.42], () => b.box('crypt_cap', sz(p, 0.36, 0.52, 0.44), { at: on(p, 0, CR_SPRING + RV + 0.14, 0.22) }));   // (the keystone)
    } else if (p.k === 'loculi') {
      // the burial shelves: two tiers of two, most sealed with a slab and a name; one open on a shroud, one on a skull
      const R = (k) => ((Math.imul(p.seed + k * 977, 0x9e3779b1) >>> 0) % 1000) / 1000;
      for (let row = 0; row < 3; row++) for (let col = 0; col < 3; col++) {   // (round 1: three across and bigger, the bay filled: two read as specks; round 2, three high in the taller bay)
        const k = row * 3 + col, u = (col - 1) * 1.0, y = FL + 0.62 + row * 0.76, open = R(k) < 0.22;
        b.tinted([1.1, 1.07, 1.0], () => b.box('crypt_cap', sz(p, 0.96, 0.1, 0.24), { at: on(p, u, y - 0.36, 0.1) }));   // (its sill)
        if (open) {
          b.box(cryptDark, sz(p, 0.86, 0.6, 0.02), { at: on(p, u, y, 0.03) });
          if (R(k + 5) < 0.5) b.tinted([1.15, 1.1, 0.98], () => b.lathe('linen', [{ y: -0.32, r: 0.02 }, { y: -0.26, r: 0.1 }, { y: 0.2, r: 0.12 }, { y: 0.3, r: 0.07 }, { y: 0.34, r: 0.0 }], { segments: 9, at: on(p, u, y - 0.16, 0.1), rot: p.n === 'z' ? [0, 0, Math.PI / 2] : [Math.PI / 2, 0, 0], scale: [1.3, 1.3, 1.3] }));   // (a shroud laid along the shelf)
          else skull(b, p, u, y - 0.14, 0.14, 0.75);
        } else {
          const askew = R(k + 11) < 0.2 ? (R(k + 13) - 0.5) * 0.5 : 0;   // (one in five cracked or askew: round 3)
          b.box(cryptDark, sz(p, 0.86, 0.6, 0.02), { at: on(p, u, y, 0.03) });   // (a dark rim round each slab, the slab set back: round 6, "bright white logs")
          b.tinted([1.04 + (R(k + 7) - 0.5) * 0.16, 1.0, 0.92], () => b.box('crypt_cap', sz(p, 0.74, 0.5, 0.04), { at: on(p, u, y, 0.05 + Math.abs(askew) * 0.1), rot: tilt(p, askew) }));
          b.tinted([0.4, 0.38, 0.36], () => { for (const dy of [0.12, 0.02, -0.08]) b.box('crypt_cap', sz(p, 0.34 + R(k + dy * 10) * 0.2, 0.03, 0.01), { at: on(p, u, y + dy, 0.075) }); });   // (the name and the dates cut in it)
        }
      }
    } else if (p.k === 'plaque') {
      // a memorial tablet: a framed slab with lines cut in it under a little pediment, a skull and an hourglass under it
      const y = FL + 1.75;
      b.tinted([1.05, 1.02, 0.96], () => { b.box('crypt_cap', sz(p, 1.2, 0.95, 0.1), { at: on(p, 0, y, 0.06) }); b.box('crypt_cap', sz(p, 1.4, 0.12, 0.16), { at: on(p, 0, y + 0.53, 0.08) }); b.box('crypt_cap', sz(p, 1.3, 0.1, 0.14), { at: on(p, 0, y - 0.52, 0.07) }); });
      b.tinted([1.32, 1.28, 1.18], () => { b.box('crypt_cap', sz(p, 0.96, 0.72, 0.04), { at: on(p, 0, y, 0.12) }); for (const sg of [-1, 1]) b.box('crypt_cap', sz(p, 0.6, 0.1, 0.12), { at: on(p, sg * 0.27, y + 0.66, 0.08), rot: tilt(p, sg * 0.42) }); });
      b.tinted([0.36, 0.35, 0.34], () => { for (let k = 0; k < 5; k++) b.box('crypt_cap', sz(p, k === 0 ? 0.5 : 0.7 - (k % 2) * 0.16, 0.03, 0.01), { at: on(p, 0, y + 0.24 - k * 0.12, 0.145) }); });
      skull(b, p, -0.22, y - 0.78, 0.09, 1);
      b.tinted([0.9, 0.86, 0.8], () => { b.lathe('crypt_cap', [{ y: 0, r: 0.07 }, { y: 0.06, r: 0.02 }, { y: 0.12, r: 0.07 }], { segments: 8, capTop: true, at: on(p, 0.22, y - 0.86, 0.1) }); });   // (the hourglass)
    } else if (p.k === 'saint') {
      // a saint in a round-headed niche on a corbel, hands at his breast, a candle at his feet (unlit: the sconces light it)
      const y = FL + 0.7;   // (under the arch's crown: the niche's head at 2.4 over the floor)
      b.box(cryptDark, sz(p, 0.76, 1.2, 0.02), { at: on(p, 0, y + 0.7, 0.03) });
      b.lathe(cryptDark, [{ y: 0, r: 0 }, { y: 0.001, r: 0.38 }, { y: 0.02, r: 0.38 }, { y: 0.021, r: 0 }], { segments: 14, at: on(p, 0, y + 1.3, 0.03), rot: p.n === 'z' ? [Math.PI / 2, 0, 0] : [0, 0, -Math.PI / 2] });
      b.tinted([1.12, 1.08, 1.0], () => { b.box('crypt_cap', sz(p, 0.7, 0.16, 0.38), { at: on(p, 0, y + 0.02, 0.19) }); b.box('crypt_cap', sz(p, 0.5, 0.18, 0.28), { at: on(p, 0, y - 0.14, 0.14) }); });
      cryptGold ||= new THREE.MeshBasicMaterial({ color: new THREE.Color('#d4a640').multiplyScalar(0.85) });
      b.lathe(cryptGold, [{ y: 0, r: 0 }, { y: 0.001, r: 0.2 }, { y: 0.02, r: 0.2 }, { y: 0.021, r: 0 }], { segments: 14, at: on(p, 0, y + 1.22, 0.1), rot: p.n === 'z' ? [Math.PI / 2, 0, 0] : [0, 0, -Math.PI / 2] });   // (a gilt halo behind his head: round 10)
      b.tinted([1.0, 0.95, 0.86], () => b.lathe('crypt_cap', [{ y: 0, r: 0.24 }, { y: 0.3, r: 0.22 }, { y: 0.78, r: 0.17 }, { y: 0.98, r: 0.16 }, { y: 1.04, r: 0 }], { segments: 12, capTop: true, at: on(p, 0, y + 0.1, 0.2) }));   // (the robe a step darker, his face and hands pale: round 10)
      b.tinted([1.62, 1.54, 1.38], () => {
        b.lathe('crypt_cap', [{ y: 0, r: 0.08 }, { y: 0.1, r: 0.12 }, { y: 0.22, r: 0.1 }, { y: 0.27, r: 0 }], { segments: 10, at: on(p, 0, y + 1.12, 0.22) });   // (his hooded head, bowed)
        b.box('crypt_cap', sz(p, 0.16, 0.2, 0.12), { at: on(p, 0, y + 0.72, 0.4), rot: tilt(p, 0) });   // (hands at the breast)
      });
      b.tinted([1.2, 1.15, 1.0], () => b.lathe('linen', [{ y: 0, r: 0.04 }, { y: 0.16, r: 0.036 }], { segments: 7, capTop: true, at: on(p, 0.26, y + 0.1, 0.3) }));
      b.box(tavernGlass, [0.04, 0.07, 0.04], { at: on(p, 0.26, y + 0.31, 0.3) });
    } else if (p.k === 'sconce') {
      // an iron sconce on a pier: a plate, an arm, a dish with three candles burning
      b.tinted(TAV_IRON, () => { b.box('metal', sz(p, 0.2, 0.42, 0.04), { at: on(p, 0, p.y, 0.32) }); b.box('metal', sz(p, 0.05, 0.05, 0.42), { at: on(p, 0, p.y - 0.12, 0.52) }); b.lathe('metal', [{ y: 0, r: 0.05 }, { y: 0.03, r: 0.2 }, { y: 0.06, r: 0.21 }], { segments: 10, at: on(p, 0, p.y - 0.12, 0.72) }); });
      for (const [du, dv, h] of [[-0.1, 0, 0.22], [0.08, -0.04, 0.3], [0.02, 0.09, 0.17]]) {
        b.tinted([1.2, 1.15, 1.0], () => b.lathe('linen', [{ y: 0, r: 0.04 }, { y: h, r: 0.036 }], { segments: 7, capTop: true, at: on(p, du, p.y - 0.06, 0.72 + dv) }));
        b.box(tavernGlass, [0.065, 0.13, 0.065], { at: on(p, du, p.y - 0.06 + h + 0.08, 0.72 + dv) });
      }
    } else if (p.k === 'lightwell') {
      // a light-well: a barred grate high in the bay, the night's cold light down through it in a shaft
      b.box(tavernNight ||= new THREE.MeshBasicMaterial({ color: new THREE.Color('#0b1019'), fog: false }), sz(p, 1.0, 0.62, 0.02), { at: on(p, 0, p.y, 0.03) });
      b.tinted([1.6, 1.54, 1.42], () => { b.box('crypt_cap', sz(p, 1.3, 0.14, 0.32), { at: on(p, 0, p.y - 0.38, 0.14) }); b.box('crypt_cap', sz(p, 1.3, 0.14, 0.22), { at: on(p, 0, p.y + 0.38, 0.1) }); });
      b.tinted([0.06, 0.06, 0.07], () => { for (const u of [-0.36, -0.12, 0.12, 0.36]) b.box('metal', sz(p, 0.05, 0.64, 0.05), { at: on(p, u, p.y, 0.08) }); b.box('metal', sz(p, 1.0, 0.05, 0.05), { at: on(p, 0, p.y, 0.08) }); });
      // the shaft: one plane leaning from the grate into the room, 1.2 wide at the top and 1.8 on the floor, brightest at
      // the grate and gone by the floor (round 5: crossed planes read as a white sheet); the patch where it lands striped
      // with the bars' shadows, so the light has its cause
      cryptPatch ||= new THREE.MeshBasicMaterial({ color: new THREE.Color('#d6dae0'), map: barPatch(), transparent: true, opacity: 0.42, depthWrite: false, fog: false, blending: THREE.AdditiveBlending });
      // (round 9: the shaft dropped, it read as smoke; the barred patch carries the light)
      const C0 = on(p, -1.1, FL + 0.02, 0.8), C1 = on(p, 1.1, FL + 0.02, 0.8), C2 = on(p, 1.1, FL + 0.02, 3.4), C3 = on(p, -1.1, FL + 0.02, 3.4);   // (round 10: bigger, so it's seen)
      b.quad(cryptPatch, p.n === 'z' ? [C3, C2, C1, C0] : [C0, C1, C2, C3], p.n === 'z' ? [[0, 0], [1, 0], [1, 1], [0, 1]] : [[0, 1], [1, 1], [1, 0], [0, 0]]);
    } else if (p.k === 'skullniche') {
      // ── the ossuary: an arched niche heaped with skulls, three and two and one, a candle on the heap
      const y = FL + 0.55;
      b.box(cryptDark, sz(p, 1.1, 1.0, 0.02), { at: on(p, 0, y + 0.5, 0.03) });
      b.lathe(cryptDark, [{ y: 0, r: 0 }, { y: 0.001, r: 0.55 }, { y: 0.02, r: 0.55 }, { y: 0.021, r: 0 }], { segments: 14, at: on(p, 0, y + 1.0, 0.03), rot: p.n === 'z' ? [Math.PI / 2, 0, 0] : [0, 0, -Math.PI / 2] });
      b.tinted([1.12, 1.08, 1.0], () => { b.box('crypt_cap', sz(p, 1.3, 0.12, 0.34), { at: on(p, 0, y - 0.02, 0.17) }); for (const sg of [-1, 1]) b.box('crypt_cap', sz(p, 0.14, 1.1, 0.14), { at: on(p, sg * 0.62, y + 0.55, 0.07) }); });
      for (const [u, dy] of [[-0.3, 0], [0, 0], [0.3, 0], [-0.15, 0.24], [0.15, 0.24], [0, 0.48]]) skull(b, p, u, y + 0.15 + dy, 0.12, 0.3);
      b.tinted([1.2, 1.15, 1.0], () => b.lathe('linen', [{ y: 0, r: 0.04 }, { y: 0.18, r: 0.036 }], { segments: 7, capTop: true, at: on(p, 0.42, y + 0.04, 0.32) }));
      b.box(tavernGlass, [0.04, 0.08, 0.04], { at: on(p, 0.42, y + 0.28, 0.32) });
    } else if (p.k === 'boneshelf') {
      // a stone shelf lined with skulls, two long bones crossed under it
      const y = FL + 1.45;
      b.tinted([1.1, 1.06, 0.98], () => { b.box('crypt_cap', sz(p, 1.5, 0.1, 0.36), { at: on(p, 0, y, 0.18) }); for (const sg of [-1, 1]) b.box('crypt_cap', sz(p, 0.1, 0.24, 0.26), { at: on(p, sg * 0.6, y - 0.16, 0.13) }); });
      for (let k = 0; k < 5; k++) skull(b, p, -0.56 + k * 0.28, y + 0.13, 0.11, 0.2);
      b.tinted(BONE_TINT, () => { for (const sg of [-1, 1]) b.tube('linen', on(p, -0.38 * sg, y - 0.65, 0.1), on(p, 0.38 * sg, y - 0.22, 0.1), 0.045, 0.045, { segments: 6 }); });
    } else if (p.k === 'tomb' || p.k === 'greattomb') {
      // a tomb chest: a plinth, the chest with its panels, the lid, and the likeness on it, hands together, a cushion
      // under the head, a sword on one in three; the founder's in a canopy on four columns, a gable over
      const G = p.k === 'greattomb', L0 = G ? 2.9 : 2.4, W0 = G ? 1.4 : 1.15, H0 = G ? 0.95 : 0.78, base = G ? 0.32 : 0.16;
      const c = Math.cos(p.rot || 0), sn = Math.sin(p.rot || 0), at = (lx, y, lz) => [p.x + lx * c + lz * sn, y, p.z - lx * sn + lz * c], ry = [0, p.rot || 0, 0];
      const R = (k) => ((Math.imul(p.seed + k * 977, 0x9e3779b1) >>> 0) % 1000) / 1000;
      b.tinted([0.86, 0.85, 0.84], () => { b.box('crypt_cap', [L0 + 0.3, base, W0 + 0.3], { at: at(0, FL + base / 2, 0), rot: ry }); if (G) b.box('crypt_cap', [L0 + 0.7, 0.16, W0 + 0.7], { at: at(0, FL + 0.08, 0), rot: ry }); });
      b.tinted([1.36, 1.23, 1.03], () => b.box('crypt_cap', [L0, H0, W0], { at: at(0, FL + base + H0 / 2, 0), rot: ry }));
      b.tinted([0.5, 0.47, 0.44], () => { for (const sg of [-1, 1]) for (let k = 0; k < 3; k++) b.box('crypt_cap', [L0 / 3 - 0.16, H0 - 0.24, 0.02], { at: at((k - 1) * L0 / 3, FL + base + H0 / 2, sg * (W0 / 2 + 0.005)), rot: ry }); });   // (the chest's panels)
      b.tinted([0.4, 0.37, 0.33], () => b.box('crypt_cap', [L0 + 0.04, 0.15, W0 + 0.04], { at: at(0, FL + base + 0.075, 0), rot: ry }));   // (a dark band at the chest's foot: round 4)
      b.tinted([1.32, 1.26, 1.15], () => { for (const sg of [-1, 1]) { b.box('crypt_cap', [0.36, 0.42, 0.06], { at: at(0, FL + base + H0 / 2 + 0.03, sg * (W0 / 2 + 0.04)), rot: ry }); b.box('crypt_cap', [0.26, 0.14, 0.065], { at: at(0, FL + base + H0 / 2 - 0.22, sg * (W0 / 2 + 0.04)), rot: [0, p.rot || 0, 0.78] }); } });   // (proud and lighter: round 6)   // (a shield on each long side, its point below: not the treasure chest)
      b.tinted([1.6, 1.5, 1.3], () => b.box('crypt_cap', [L0 + 0.2, 0.04, W0 + 0.2], { at: at(0, FL + base + H0 + 0.13, 0), rot: ry }));   // (a lit bevel round the lid: round 9)
      b.tinted([1.38, 1.27, 1.1], () => b.box('crypt_cap', [L0 + 0.12, 0.12, W0 + 0.12], { at: at(0, FL + base + H0 + 0.06, 0), rot: ry }));
      const top = FL + base + H0 + 0.12 + (G ? 0.22 : 0.1), E = G ? 1.12 : 1;   // (round 1: the likeness raised off the lid, paler, so it reads from above)
      b.tinted([0.85, 0.8, 0.74], () => b.box('crypt_cap', [L0 * 0.86, 0.08, 0.66 * E], { at: at(0.05, top - 0.05, 0), rot: ry }));   // (the slab he lies on)
      // (round 5: one clean figure, not a heap: a head on a darker pillow, the robed body, a ridge for the folded hands, the feet)
      b.tinted([0.95, 0.9, 0.84], () => b.box('crypt_cap', [0.44 * E, 0.14, 0.6 * E], { at: at(-L0 * 0.37, top + 0.07, 0), rot: ry }));   // (a bigger, squarer pillow: round 6)
      b.tinted([1.78, 1.7, 1.55], () => {
        b.lathe('crypt_cap', [{ y: 0, r: 0.09 }, { y: 0.1, r: 0.15 * E }, { y: 0.22, r: 0.13 * E }, { y: 0.28, r: 0 }], { segments: 12, at: at(-L0 * 0.36 + 0.06, top + 0.3, 0), rot: [0, p.rot || 0, Math.PI / 2] });   // (the head, a shade off the pillow)
        b.box('crypt_cap', [L0 * 0.6, 0.3, 0.5 * E], { at: at(0.12, top + 0.15, 0), rot: ry });                                  // (the robed body)
        b.box('crypt_cap', [0.3, 0.1, 0.22], { at: at(-0.18, top + 0.29, 0), rot: ry });                                         // (the folded hands)
        for (const sg of [-1, 1]) b.box('crypt_cap', [0.14, 0.22, 0.13], { at: at(L0 * 0.42, top + 0.13, sg * 0.12), rot: ry });   // (the feet, apart)
      });
      if (!G && R(3) < 0.5) { b.tinted([1.2, 1.15, 1.0], () => b.lathe('linen', [{ y: 0, r: 0.045 }, { y: 0.2, r: 0.04 }], { segments: 7, capTop: true, at: at(L0 / 2 - 0.1, top - 0.1, W0 / 2 - 0.12) })); b.box(tavernGlass, [0.05, 0.09, 0.05], { at: at(L0 / 2 - 0.1, top + 0.17, W0 / 2 - 0.12) }); }   // (a candle on a corner of the lid, on half of them)
      if (G || R(1) < 0.34) b.tinted([0.8, 0.8, 0.82], () => { b.box('crypt_cap', [1.3, 0.05, 0.08], { at: at(0.2, top + 0.32, 0.12), rot: ry }); b.box('crypt_cap', [0.05, 0.05, 0.3], { at: at(-0.38, top + 0.32, 0.12), rot: ry }); });   // (a sword laid on him)
      if (G) {
        // the canopy: four columns, an entablature, a gable with a finial, the founder's arms on its face
        const CH = 2.5, cx = L0 / 2 + 0.25, cz = W0 / 2 + 0.3;
        b.tinted([0.98, 0.96, 0.92], () => {
          for (const sx of [-1, 1]) for (const sz2 of [-1, 1]) { b.box('crypt_cap', [0.3, CH - 0.3, 0.3], { at: at(sx * cx, FL + 0.16 + CH / 2, sz2 * cz), rot: ry }); b.box('crypt_cap', [0.42, 0.16, 0.42], { at: at(sx * cx, FL + 0.24, sz2 * cz), rot: ry }); b.box('crypt_cap', [0.42, 0.16, 0.42], { at: at(sx * cx, FL + 0.16 + CH - 0.08, sz2 * cz), rot: ry }); }   // (round 1: square, solid: round shafts read as glass)
          b.box('crypt_cap', [2 * cx + 0.5, 0.3, 2 * cz + 0.5], { at: at(0, FL + 0.16 + CH + 0.15, 0), rot: ry });
        });
        b.box(cryptDark, [2 * cx + 0.3, 0.02, 2 * cz + 0.3], { at: at(0, FL + 0.16 + CH - 0.01, 0), rot: ry });
        b.tinted([0.42, 0.36, 0.3], () => b.box('crypt_wall', [2 * cx, CH - 0.2, 0.06], { at: at(0, FL + 0.16 + CH / 2, -cz - 0.12), rot: ry }));   // (its back warm-dark, so the tomb inside stands out: round 5)   // (the soffit, dark, so the canopy is a roof over him)
        b.tinted([1.3, 1.25, 1.14], () => {
          for (const sg of [-1, 1]) b.tinted([0.74, 0.65, 0.58], () => b.box('crypt_cap', [cx + 0.55, 0.14, 2 * cz + 0.6], { at: at(sg * (cx + 0.2) / 2, FL + 0.16 + CH + 0.78, 0), rot: [0, p.rot || 0, -sg * 0.62] }));   // (a roof of dark lead, steep: round 2)
          b.lathe('crypt_cap', [{ y: 0, r: 0.1 }, { y: 0.16, r: 0.14 }, { y: 0.3, r: 0.0 }], { segments: 9, at: at(0, FL + 0.16 + CH + 1.3, 0) });
          // the pediment on its face, pale stone, the lead only on the slopes behind (round 3: "a bus shelter")
          const yb = FL + 0.16 + CH + 0.3, ya = FL + 0.16 + CH + 1.25, zf = cz + 0.27;
          b.poly('crypt_cap', [at(-cx - 0.2, yb, zf), at(cx + 0.2, yb, zf), at(0, ya, zf)], { uAxis: [1, 0, 0], vAxis: [0, 1, 0] });
          b.box('crypt_cap', [2 * cx + 0.62, 0.1, 0.12], { at: at(0, yb + 0.02, zf), rot: ry });
          b.tinted([1.6, 1.52, 1.38], () => { for (const sg of [-1, 1]) b.box('crypt_cap', [cx + 0.4, 0.06, 0.1], { at: at(sg * (cx + 0.2) / 2, (yb + ya) / 2 + 0.04, zf + 0.04), rot: [0, p.rot || 0, -sg * 0.62] }); });   // (the pediment's raking edges lit: round 9)
        });
      }
    } else if (p.k === 'mourner') {
      // a stone mourner on a plinth: the robe flaring to the ground, narrow shoulders, a head on its neck under the hood's
      // lip, bowed; hands folded at the breast (round 7: a cone read as a stalagmite)
      b.tinted([0.78, 0.75, 0.7], () => { b.box('crypt_cap', [0.8, 0.5, 0.8], { at: [p.x, FL + 0.25, p.z] }); b.box('crypt_cap', [0.9, 0.15, 0.9], { at: [p.x, FL + 0.08, p.z] }); });
      b.tinted([0.5, 0.48, 0.45], () => b.box('crypt_cap', [0.84, 0.05, 0.84], { at: [p.x, FL + 0.505, p.z] }));   // (a darker top edge to the plinth)
      b.tinted([0.92, 0.85, 0.74], () => b.lathe('crypt_cap', [{ y: 0, r: 0.36 }, { y: 0.35, r: 0.28 }, { y: 0.95, r: 0.19 }, { y: 1.12, r: 0.15 }, { y: 1.16, r: 0.08 }, { y: 1.18, r: 0 }], { segments: 14, capTop: true, at: [p.x, FL + 0.5, p.z] }));   // (round 8: mid limestone, a step under the canopy; round 10, the robe darker, face and hands pale)
      b.tinted([1.5, 1.42, 1.26], () => {
        b.lathe('crypt_cap', [{ y: 0, r: 0.06 }, { y: 0.06, r: 0.07 }], { segments: 8, at: [p.x, FL + 1.66, p.z + 0.03] });                         // (the neck)
        b.lathe('crypt_cap', [{ y: 0, r: 0.1 }, { y: 0.08, r: 0.15 }, { y: 0.2, r: 0.14 }, { y: 0.3, r: 0 }], { segments: 12, at: [p.x, FL + 1.72, p.z + 0.07], rot: [0.4, 0, 0] });   // (the head, bowed)
        b.lathe('crypt_cap', [{ y: 0, r: 0.2 }, { y: 0.04, r: 0.21 }, { y: 0.24, r: 0.17 }, { y: 0.36, r: 0 }], { segments: 12, at: [p.x, FL + 1.7, p.z - 0.02], rot: [0.4, 0, 0] });   // (the hood, its lip over the face)
        b.box('crypt_cap', [0.22, 0.24, 0.16], { at: [p.x, FL + 1.35, p.z + 0.24] });
      });
    } else if (p.k === 'hatchment') {
      // the family's arms in a diamond hatchment, 1.4 across: a black field, a gilt rim, a golden fleece filling it (round 5)
      cryptGold ||= new THREE.MeshBasicMaterial({ color: new THREE.Color('#d4a640').multiplyScalar(0.85) });   // (gold that reads in the dark: round 6)
      b.tinted([1.3, 1.25, 1.14], () => b.box('crypt_cap', sz(p, 1.12, 1.12, 0.04), { at: on(p, 0, p.y, 0.04), rot: tilt(p, Math.PI / 4) }));   // (a pale stone frame: round 9)
      b.box(cryptGold, sz(p, 0.98, 0.98, 0.05), { at: on(p, 0, p.y, 0.06), rot: tilt(p, Math.PI / 4) });
      cryptOx ||= new THREE.MeshBasicMaterial({ color: new THREE.Color('#6e1e20') });   // (an oxblood field: a black one in a gold rim read as a hazard sign, round 7)
      b.box(cryptOx, sz(p, 0.92, 0.92, 0.02), { at: on(p, 0, p.y, 0.095), rot: tilt(p, Math.PI / 4) });
      b.box(cryptGold, sz(p, 0.6, 0.26, 0.03), { at: on(p, 0, p.y - 0.02, 0.11) });                   // (the fleece's body, hung by the middle)
      b.box(cryptGold, sz(p, 0.18, 0.16, 0.03), { at: on(p, 0.34, p.y + 0.02, 0.11), rot: tilt(p, -0.4) });   // (its head, hanging)
      b.box(cryptGold, sz(p, 0.05, 0.3, 0.03), { at: on(p, 0, p.y + 0.24, 0.11) });                   // (the ring's band)
      for (const du of [-0.22, -0.12, 0.1, 0.2]) b.box(cryptGold, sz(p, 0.05, 0.18, 0.03), { at: on(p, du, p.y - 0.22, 0.11) });   // (its legs)
    } else if (p.k === 'ledger') {
      // a ledger stone let into the floor, one unit by two along the room: lighter than the flags, a border cut round it,
      // a small brass cross at its head, the lines of a name (round 5)
      const c = Math.cos(p.rot || 0), sn = Math.sin(p.rot || 0), at = (lx, lz) => [p.x + lx * c + lz * sn, FL + 0.022, p.z - lx * sn + lz * c], ry = [0, p.rot || 0, 0];
      b.tinted([1.06, 1.0, 0.91], () => b.box('crypt_cap', [2.0, 0.04, 1.0], { at: at(0, 0), rot: ry }));   // (round 6: lighter, raised a little so its edge catches; round 9 a touch nearer the flags)
      b.tinted([0.42, 0.39, 0.35], () => { for (const sg of [-1, 1]) { b.box('crypt_cap', [1.84, 0.045, 0.06], { at: at(0, sg * 0.41), rot: ry }); b.box('crypt_cap', [0.06, 0.045, 0.88], { at: at(sg * 0.91, 0), rot: ry }); } for (const [lx, w] of [[0.05, 0.9], [0.25, 0.7], [0.45, 0.8]]) b.box('crypt_cap', [0.025, 0.045, w * 0.55], { at: at(lx, 0), rot: ry }); });
      cryptBrass ||= new THREE.MeshBasicMaterial({ color: new THREE.Color('#c9a24a').multiplyScalar(0.62) }); b.box(cryptBrass, [1.3, 0.05, 0.08], { at: at(-0.05, 0), rot: ry }); b.box(cryptBrass, [0.08, 0.05, 0.5], { at: at(-0.38, 0), rot: ry });   // (a long thin brass cross, softly self-lit: round 7, a gold blob read as dropped loot; round 10, unseen at play size)
    } else if (p.k === 'bonering') {
      // the ossuary's floor: a ring of bone-coloured cobbles let in flush at its middle (round 10)
      const N = 28, R0 = p.r || 1.5;
      b.tinted([1.12, 1.04, 0.86], () => { for (let k = 0; k < N; k++) { const a = (k / N) * Math.PI * 2; b.box('crypt_cap', [0.17, 0.03, 0.12], { at: [p.x + Math.cos(a) * R0, FL + 0.016, p.z + Math.sin(a) * R0], rot: [0, -a, 0] }); } });
    } else if (p.k === 'rood') {
      // the chantry's cross over its altar, a unit and a fifth tall, dull gilt on a dark board
      b.tinted([0.3, 0.22, 0.16], () => b.box('furniture_wood', sz(p, 1.0, 1.4, 0.05), { at: on(p, 0, p.y, 0.04) }));   // (a dark panel behind it: round 9)
      cryptGold ||= new THREE.MeshBasicMaterial({ color: new THREE.Color('#d4a640').multiplyScalar(0.85) });
      b.box(cryptGold, sz(p, 0.16, 1.2, 0.05), { at: on(p, 0, p.y, 0.09) }); b.box(cryptGold, sz(p, 0.8, 0.16, 0.05), { at: on(p, 0, p.y + 0.24, 0.09) });
    } else if (p.k === 'footcandles') {
      // at the bay's foot: candle stubs left burning, in their own wax
      const R = (k) => ((Math.imul(p.seed + k * 977, 0x9e3779b1) >>> 0) % 1000) / 1000;
      b.tinted([1.05, 1.0, 0.92], () => b.box('crypt_cap', sz(p, 0.95, 0.12, 0.42), { at: on(p, 0, FL + 0.06, 0.3) }));   // (a stone step, the stubs on it in their wax: round 5, loose ones read as sparkle)
      for (let k = 0; k < 4; k++) {
        const u = -0.33 + k * 0.22 + (R(k) - 0.5) * 0.06, v = 0.24 + R(k + 3) * 0.12, h = 0.1 + R(k + 5) * 0.18;
        b.tinted([1.15, 1.1, 0.96], () => { b.lathe('linen', [{ y: 0, r: 0.08 }, { y: 0.02, r: 0.06 }, { y: 0.03, r: 0 }], { segments: 8, at: on(p, u, FL + 0.12, v) }); b.lathe('linen', [{ y: 0, r: 0.045 }, { y: h, r: 0.04 }], { segments: 7, capTop: true, at: on(p, u, FL + 0.12, v) }); });
        b.box(tavernGlass, [0.04, 0.07, 0.04], { at: on(p, u, FL + 0.12 + h + 0.05, v) });
      }
    } else if (p.k === 'footbones') {
      // a few of the dead's bones swept to the wall's foot, a skull among them
      b.tinted([0.8, 0.75, 0.66], () => { for (const [u0, u1, v0, v1] of [[-0.3, 0.12, 0.2, 0.42], [-0.22, 0.2, 0.42, 0.22], [-0.05, 0.3, 0.3, 0.34]]) b.tube('linen', on(p, u0, FL + 0.06, v0), on(p, u1, FL + 0.08, v1), 0.05, 0.045, { segments: 6 }); });   // (round 5: toned to old bone; round 8, one tight heap against the wall's foot)
      skull(b, p, 0.28, FL + 0.14, 0.15, 0.3);
    } else if (p.k === 'fallenslab') {
      // a slab fallen from a shelf, leaning on the wall, its name to the room
      b.tinted([1.25, 1.2, 1.1], () => b.box('crypt_cap', sz(p, 0.82, 0.58, 0.07), { at: on(p, 0.1, FL + 0.27, 0.22), rot: p.n === 'z' ? [-0.32, 0, 0] : [0, 0, 0.32] }));
      b.tinted([0.32, 0.31, 0.3], () => { for (const dy of [0.1, 0, -0.1]) b.box('crypt_cap', sz(p, 0.44, 0.03, 0.01), { at: on(p, 0.1, FL + 0.27 + dy, 0.26 - dy * 0.32) , rot: p.n === 'z' ? [-0.32, 0, 0] : [0, 0, 0.32] }); });
    } else if (p.k === 'candlestand') {
      // a low iron pricket by the altar, three candles on it
      b.tinted(TAV_IRON, () => { b.tube('metal', [p.x, FL, p.z], [p.x, FL + 0.9, p.z], 0.04, 0.03, { segments: 6 }); b.lathe('metal', [{ y: 0, r: 0.2 }, { y: 0.03, r: 0.2 }, { y: 0.04, r: 0 }], { segments: 10, at: [p.x, FL, p.z] }); b.lathe('metal', [{ y: 0, r: 0.05 }, { y: 0.03, r: 0.2 }, { y: 0.06, r: 0.21 }], { segments: 10, at: [p.x, FL + 0.9, p.z] }); });
      for (const [du, dv, h] of [[-0.1, 0, 0.24], [0.08, -0.05, 0.32], [0.03, 0.09, 0.18]]) {
        b.tinted([1.2, 1.15, 1.0], () => b.lathe('linen', [{ y: 0, r: 0.04 }, { y: h, r: 0.036 }], { segments: 7, capTop: true, at: [p.x + du, FL + 0.95, p.z + dv] }));
        b.box(tavernGlass, [0.065, 0.13, 0.065], { at: [p.x + du, FL + 0.95 + h + 0.08, p.z + dv] });
      }
    } else if (p.k === 'candelabra') {
      // an iron candle-stand, a man's height: three feet, the stem, a bar across with five candles burning
      b.tinted(TAV_IRON, () => {
        for (let k = 0; k < 3; k++) { const a = (k / 3) * Math.PI * 2; b.box('metal', [0.36, 0.05, 0.06], { at: [p.x + Math.cos(a) * 0.15, FL + 0.03, p.z + Math.sin(a) * 0.15], rot: [0, -a, 0] }); }
        b.tube('metal', [p.x, FL, p.z], [p.x, FL + 1.85, p.z], 0.045, 0.035, { segments: 6 });
        b.box('metal', [1.0, 0.05, 0.05], { at: [p.x, FL + 1.85, p.z] });
        for (const u of [-0.45, -0.22, 0, 0.22, 0.45]) b.lathe('metal', [{ y: 0, r: 0.03 }, { y: 0.04, r: 0.08 }, { y: 0.06, r: 0.08 }], { segments: 8, at: [p.x + u, FL + 1.87, p.z] });
      });
      for (const [u, h] of [[-0.45, 0.2], [-0.22, 0.28], [0, 0.34], [0.22, 0.26], [0.45, 0.18]]) {
        b.tinted([1.2, 1.15, 1.0], () => b.lathe('linen', [{ y: 0, r: 0.035 }, { y: h, r: 0.032 }], { segments: 7, capTop: true, at: [p.x + u, FL + 1.92, p.z] }));
        b.box(tavernGlass, [0.065, 0.13, 0.065], { at: [p.x + u, FL + 1.92 + h + 0.08, p.z] });   // (round 10: half again as big, the light's source at a phone's size)
      }
    } else if (p.k === 'urns') {
      // the family's urns: two or three, their own shapes, lidded
      const R = (k) => ((Math.imul(p.seed + k * 977, 0x9e3779b1) >>> 0) % 1000) / 1000, n = 2 + (R(1) < 0.5 ? 1 : 0);
      for (let k = 0; k < n; k++) {
        // (round 2: squat and buff, a dark mouth: thin dark ones read as little figures)
        const a = R(k + 3) * 6.28, d = k ? 0.42 : 0, ux = p.x + Math.cos(a) * d, uz = p.z + Math.sin(a) * d, H = 0.42 + R(k + 5) * 0.2, W = 0.27 + R(k + 9) * 0.06;
        b.tinted(R(k + 7) < 0.5 ? [1.38, 1.08, 0.74] : [1.28, 1.12, 0.88], () => b.lathe('crypt_cap', [{ y: 0, r: W * 0.55 }, { y: 0.05, r: W * 0.7 }, { y: H * 0.45, r: W }, { y: H * 0.85, r: W * 0.62 }, { y: H, r: W * 0.66 }], { segments: 12, at: [ux, FL, uz] }));
        b.tinted([1.2, 1.12, 0.98], () => b.lathe('crypt_cap', [{ y: 0, r: W * 0.7 }, { y: 0.05, r: W * 0.62 }, { y: 0.1, r: W * 0.2 }, { y: 0.16, r: 0 }], { segments: 10, at: [ux, FL + H, uz] }));   // (a lid: open mouths read as black holes from above, round 7)
      }
    } else if (p.k === 'bonepile') {
      // a heap of the dead the shelves no longer hold: skulls and the long bones
      const R = (k) => ((Math.imul(p.seed + k * 977, 0x9e3779b1) >>> 0) % 1000) / 1000, q = { x: p.x, z: p.z, n: 'z' };
      b.tinted(BONE_TINT, () => { for (let k = 0; k < 6; k++) { const a = R(k) * 6.28, l = 0.32 + R(k + 9) * 0.14, cx = p.x + (R(k + 3) - 0.5) * 0.5, cz = p.z + (R(k + 5) - 0.5) * 0.5; b.tube('linen', [cx - Math.cos(a) * l, FL + 0.06 + k * 0.025, cz - Math.sin(a) * l], [cx + Math.cos(a) * l, FL + 0.08 + k * 0.02, cz + Math.sin(a) * l], 0.035, 0.035, { segments: 5 }); } });
      for (const [u, v, y] of [[-0.12, 0.08, 0.1], [0.16, -0.06, 0.1], [0.02, 0.0, 0.3]].slice(0, 2 + (R(1) < 0.6 ? 1 : 0))) skull(b, q, u, FL + y, 0.12, v);
    } else if (p.k === 'offering') {
      // the family's table of offerings, against the wall: a stone slab on two blocks, bowls, a wreath gone brown, a candle
      const y = FL + 0.82;
      b.tinted([1.05, 1.02, 0.96], () => { b.box('crypt_cap', sz(p, 2.0, 0.12, 0.8), { at: on(p, 0, y, 0.45) }); for (const sg of [-1, 1]) b.box('crypt_cap', sz(p, 0.3, 0.76, 0.6), { at: on(p, sg * 0.7, FL + 0.38, 0.45) }); });
      for (const [u, r] of [[-0.6, 0.16], [-0.2, 0.12], [0.62, 0.14]]) b.tinted([0.9, 0.66, 0.48], () => b.lathe('furniture_wood', [{ y: 0, r: r * 0.6 }, { y: 0.08, r }, { y: 0.1, r: r * 0.92 }], { segments: 10, at: on(p, u, y + 0.06, 0.5) }));
      b.tinted([0.55, 0.42, 0.25], () => { for (let k = 0; k < 10; k++) { const a = (k / 10) * 6.28, a2 = ((k + 1) / 10) * 6.28; b.tube('leaves', on(p, 0.2 + Math.cos(a) * 0.2, y + 0.08, 0.5 + Math.sin(a) * 0.2), on(p, 0.2 + Math.cos(a2) * 0.2, y + 0.08, 0.5 + Math.sin(a2) * 0.2), 0.05, 0.05, { segments: 5 }); } });
      b.tinted([1.2, 1.15, 1.0], () => b.lathe('linen', [{ y: 0, r: 0.045 }, { y: 0.3, r: 0.04 }], { segments: 7, capTop: true, at: on(p, 0.85, y + 0.06, 0.35) }));
      b.box(tavernGlass, [0.05, 0.1, 0.05], { at: on(p, 0.85, y + 0.42, 0.35) });
    } else if (p.k === 'altar') {
      // the chantry's altar: a stone table, a red frontal hung on it and a white cloth over, the relic in its casket, two
      // tall candlesticks
      const y = FL + 1.0;
      b.tinted([1.02, 1.0, 0.95], () => { b.box('crypt_cap', sz(p, 2.3, 1.0, 1.0), { at: on(p, 0, FL + 0.5, 0.6) }); b.box('crypt_cap', sz(p, 2.5, 0.1, 1.12), { at: on(p, 0, y + 0.05, 0.6) }); });
      b.tinted([0.62, 0.14, 0.13], () => b.box('cloth_red', sz(p, 1.5, 0.78, 0.02), { at: on(p, 0, FL + 0.6, 1.12) }));
      b.tinted([1.2, 1.18, 1.1], () => { b.box('linen', sz(p, 2.4, 0.02, 0.5), { at: on(p, 0, y + 0.11, 0.6) }); b.box('linen', sz(p, 1.5, 0.12, 0.02), { at: on(p, 0, y + 0.06, 1.13) }); });
      b.tinted([1.3, 1.0, 0.48], () => { b.box('metal', sz(p, 0.5, 0.3, 0.3), { at: on(p, 0, y + 0.27, 0.5) }); for (const sg of [-1, 1]) b.box('metal', sz(p, 0.54, 0.05, 0.22), { at: on(p, 0, y + 0.48, 0.5 + sg * 0.07), rot: p.n === 'z' ? [sg * 0.6, 0, 0] : [0, 0, -sg * 0.6] }); });   // (the casket, gilt, its gabled lid)
      for (const sg of [-1, 1]) {
        b.tinted([1.2, 0.95, 0.5], () => b.lathe('metal', [{ y: 0, r: 0.1 }, { y: 0.04, r: 0.06 }, { y: 0.5, r: 0.03 }, { y: 0.54, r: 0.07 }], { segments: 8, at: on(p, sg * 0.85, y + 0.11, 0.55) }));
        b.tinted([1.2, 1.15, 1.0], () => b.lathe('linen', [{ y: 0, r: 0.04 }, { y: 0.3, r: 0.036 }], { segments: 7, capTop: true, at: on(p, sg * 0.85, y + 0.65, 0.55) }));
        b.box(tavernGlass, [0.05, 0.09, 0.05], { at: on(p, sg * 0.85, y + 1.0, 0.55) });
      }
    } else if (p.k === 'furn') {
      const r = f[p.type](p.x, FL, p.z, p.opts || {}), o = r.object || r.group;
      if (!o) continue;
      o.rotation.y = p.rot || 0; o.scale.setScalar(p.s || 1); o.updateMatrixWorld(true); furn.push(o);
    }
    if (big) b.pop();
  }
  // merged a material at a time (the trim, the furniture): what three can merge, the attributes all of them carry
  const built = b.build('ember:tavern').group; built.updateMatrixWorld(true);
  const by = new Map();
  for (const root of [built, ...furn]) root.traverse((o) => {
    if (!o.isMesh || Array.isArray(o.material)) return;
    const geo = o.geometry.index ? o.geometry.toNonIndexed() : o.geometry.clone();
    geo.applyMatrix4(o.matrixWorld);
    (by.get(o.material) || by.set(o.material, []).get(o.material)).push(geo);
  });
  const g = new THREE.Group(); g.name = 'ember:tavern';
  for (const [m, geos] of by) {
    const keep = Object.keys(geos[0].attributes).filter((k) => geos.every((q) => q.attributes[k] && q.attributes[k].itemSize === geos[0].attributes[k].itemSize));
    for (const q of geos) for (const k of Object.keys(q.attributes)) if (!keep.includes(k)) q.deleteAttribute(k);
    for (const q of geos) for (const k of Object.keys(q.morphAttributes)) delete q.morphAttributes[k];
    const merged = geos.length > 1 ? mergeGeometries(geos) : geos[0];
    for (const q of geos) if (q !== merged) q.dispose();
    if (!merged) continue;
    const mesh = new THREE.Mesh(merged, m);
    const lit = m === tavernGlass || m === tavernEmber || m === tavernNight || m === tavernNightHi || m === tavernStar || m === tavernGrime || m === cryptDark || m === cryptDamp || m === cryptPatch || m === cryptGold || m === cryptOx || m === cryptBrass;
    mesh.castShadow = !lit && m !== tavernWeb; mesh.receiveShadow = !lit;
    g.add(mesh);
  }
  if (webTris.length) { const wg = new THREE.BufferGeometry(); wg.setAttribute('position', new THREE.Float32BufferAttribute(webTris, 3)); g.add(new THREE.Mesh(wg, tavernWebFill)); }
  for (const o of [built, ...furn]) o.traverse((q) => { if (q.isMesh) q.geometry.dispose(); });
  g.dispose = () => g.traverse((o) => { if (o.isMesh) o.geometry.dispose(); });
  return g;
}
const TAV_H = 3.0, TAV_FLOOR = 1.0;
const CR_SPRING = 1.0 + 2.25;   // (where the crypt's arches spring, over a figure's head: its walls stand four units, convert.js CR_BACK)   // (a back wall's height over the floor: convert.js TAV_BACK, level 8, over the floor's 2)
/** our art of a level gone for good: its cards (and their sheets' textures, which Sprite3D's dispose leaves: a texture a
 * card leaked every load, 199 → 288 over four trips), its arches and its kit models */
function dropEnv(list, made) {
  for (const s of list) { game.engine.scene.remove(s); s.dispose?.(); s.userData?.sheet?.dispose?.(); }
  for (const g of made.values()) g.traverse((o) => { if (o.isMesh) o.geometry.dispose(); });
}
async function placeEnv(list, region) {
  dropEnv(envSprites, KIT_MADE);
  envSprites = []; KIT_MADE = new Map();
  if (!list?.length) return;
  const sets = ['env', `town-${region || 'vale'}`];
  const all = await Promise.all(sets.map((n) => json(`${ASSETS}env/${n}.json`)));
  const at = (id) => { for (let i = 0; i < sets.length; i++) { const m = all[i]?.sprites?.[id]; if (m) return [sets[i], m]; } return null; };
  const mine = levelId;
  for (const p of list) {
    if (p.canvas) { standOurs(p); continue; }
    if (p.arch) { const g = buildArch(p.arch); game.engine.scene.add(g); envSprites.push(g); continue; }
    if (p.tavern) { const g = buildTavern(p.tavern.pieces); game.engine.scene.add(g); envSprites.push(g); continue; }
    const kit = KIT.get(p.id);
    if (kit && (LANDMARKS === 'all' || (LANDMARKS === 'chosen' && !p.card) || (LANDMARKS === 'doors' && DOORS.has(p.id)))) {
      // (on the ground round it, not the tile under its middle: the chapel stands in water the converter laid under it)
      const H = (dx, dz) => game.tileMap.getHeight(p.x + dx, p.z + dz), y = Math.max(H(0, 0), H(0, 3), H(0, -3), H(3, 0), H(-3, 0));
      const g = kitPiece(kit, p.x, y, p.z);
      game.engine.scene.add(g); envSprites.push(g); continue;
    }
    const f = at(p.id); if (!f) continue;
    const [set, m] = f, img = await image(`${ASSETS}env/${set}.alb.png?v=${all[sets.indexOf(set)]._v}`).catch(() => null);
    if (!img || mine !== levelId) return;
    const c = document.createElement('canvas'); c.width = m.w; c.height = m.h;
    const g = /** @type {CanvasRenderingContext2D} */ (c.getContext('2d')); g.drawImage(img, m.x, m.y, m.w, m.h, 0, 0, m.w, m.h);
    const tex = new THREE.CanvasTexture(c); tex.magFilter = tex.minFilter = THREE.NearestFilter; tex.generateMipmaps = false; tex.colorSpace = THREE.SRGBColorSpace;
    const sheet = { texture: tex, frameWidth: m.w, frameHeight: m.h, columns: 1, rows: 1, pixelsPerUnit: NATIVE_PER_UNIT, anchor: [m.ax / m.w, 0],
      animations: { idle_down: { frames: [{ col: 0, row: 0 }], fps: 1, loop: false } }, name: `ember-env:${p.id}`, dispose() { tex.dispose(); } };
    const s = new Sprite3D(sheet, { ...SPRITE_OPTS, castShadow: false, blobShadow: false });
    s.name = `ember:${set}:${p.id}`; s.userData.sheet = sheet;
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
let graded = false, gradedReach = false;
function gradeByHour() {
  const G = game?.postfx?.settings?.grade, n = game?.lighting?.state?.night ?? 1;
  // (the Reach: its own grade held, the exposure the game's brightness by the hour: hybrid.js REACH_BRIGHT)
  if (gradedReach && G) { G.exposure = (gradeOwn?.exposure ?? 1) * bright * brightHour; return; }
  if (!graded || !G) return;
  G.saturation = 0.74 + 0.18 * n; G.exposure = (0.84 + 0.06 * n) * bright * brightHour;
}
// brightness on top of the hour's grade, a post-tone-map multiply:
//   · brightHour: the game's, each frame (hybrid.js BRIGHT: the Vale's day, dusk and night as the owner set them; the
//     Reach's, REACH_BRIGHT, on its own grade);
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
  const env = lv.environment || {}, G = game.postfx?.settings?.grade, ash = region === 'reach' && !env.interior;
  if (G) { if (!gradeOwn) gradeOwn = { ...G }; Object.assign(G, gradeOwn, region === 'vale' ? VALE_GRADE : ash ? REACH_GRADE : {}); gradeKeep = { sharpen: G.sharpen, grain: G.grain, chromaticAberration: G.chromaticAberration }; applyGrade(); }
  graded = region === 'vale' && !env.interior; gradedReach = ash;
  // (the Reach: the arid climate's sky graded to ash; any other arid level, the Bowl, its own again)
  if (env.climate === 'arid' && !env.interior) { const want = ash ? 'ash' : 'arid'; if (skyShown !== want) { L.setKeyframes(ash ? ASH_KEYFRAMES : ARID_KEYFRAMES); skyShown = want; } }
  if (ash) reachAir();
  if (env.interior || env.climate || env.season) return;                 // (underground: the ambient's ours; a climate's sky its own)
  const want = region === 'vale' ? 'dusky' : 'default';
  L.setKeyframes(want === 'dusky' ? DUSKY : DEFAULT_KEYFRAMES); skyShown = want;   // (each outdoor level: a climate before may have set its own)
}

// ── the Cinder Reach's air (docs/art-critic-pass-reach.md) ──────────────────────────────────────────────────────────
// Luminati's arid sky is a dry range's: a hazy blue noon, a molten golden hour, violet shade. The Reach is soot over slag
// (world doc §3.3): its sky greyed toward ash and its horizon a dirty ochre, the sun a little weaker and whiter, the
// ground's bounce dark, the air a little thicker; at dusk the sun warm but not molten, the shade grey not violet (the
// critic's round 1: the dusk frame went deep red and the tailings read purple). The picture a little less saturated.
const mixHex = (a, b, k) => '#' + new THREE.Color(a).lerp(new THREE.Color(b), k).getHexString();
// (round 2: at dusk the frame was still red, the sun's '#ff7040' through a red haze: the sun toward a smoky amber and
// the haze grey; by night the arid sky's saturated blue fill read as a moonlit sea: toward slate, the moon greyer. Round
// 3: the air thinner, 1.25 → 1.1 of the arid fog: the top of a day frame had gone milky)
const ASH_KEYFRAMES = ARID_KEYFRAMES.map((f) => {
  const night = f.night ?? 0, dusk = f.t >= 16.5 && f.t <= 19.5 ? 1 : 0;
  return { ...f,
    top: dim(mixHex(f.top, '#6c6a70', 0.45 * (1 - night)), 0.85), horizon: mixHex(grey(f.horizon, dusk ? 0.6 : 0.45), '#9a8a74', 0.35 * (1 - night)), bottom: dim(grey(f.bottom, 0.55), 0.8),
    sun: dusk ? mixHex(grey(f.sun, 0.35), '#e0a878', 0.45) : grey(f.sun, 0.25), sunI: f.sunI * (dusk ? 0.92 : 0.96),
    hemiSky: mixHex(grey(f.hemiSky, dusk ? 0.7 : 0.5), '#4c4e5a', 0.75 * night), hemiGround: grey(f.hemiGround, 0.4), hemiI: f.hemiI * (dusk ? 1.2 : 1.1),
    ...(night > 0.5 ? { sun: grey(f.sun, 0.75), horizon: mixHex(f.horizon, '#2c2830', 0.5) } : {}),
    fog: f.fog * 1.1, clouds: Math.min(0.5, (f.clouds ?? 0.15) + 0.15) };
});
const REACH_GRADE = { saturation: 0.86, contrast: 1.05, vignette: 0.8 };
// the Ashwater murky (slate over rust silt, not a mountain stream's blue); the land past the map's edge in cracked dark
// earth (the arid climate lays it in orange dry dirt); the climate's gold dust motes as ash
const MURK = ['#6e5440', '#4c3e33', '#30302e', '#1c1e21'], MURK_CREST = '#8c7c6a', MURK_FOAM = '#a89a88';
function reachAir() {
  const W = game?.world; if (!W) return;
  const u = W.water?.uniforms;
  if (u) { ['uC0', 'uC1', 'uC2', 'uC3'].forEach((k, i) => u[k]?.value.set(MURK[i])); u.uCrest?.value.set(MURK_CREST); u.uFoam?.value.set(MURK_FOAM); if (u.uSaturation) u.uSaturation.value = 0.8; }
  const og = W.outerGround;
  if (og && W.textures && !og.userData.ash) { og.material = W.textures.material('cinder_earth', { vertexColors: true, normalScale: 0.35 }); og.userData.ash = true; }
  const d = W.emitters?.dust?.uniforms;
  if (d) { d.uColor0?.value.set('#b4aca2').multiplyScalar(1.1); d.uColor1?.value.set('#8a847e').multiplyScalar(1.1); }
}
// The Reach's own textures (registered once, painted when a level names them): Ashgate's slag brick and rust tile, and
// six of Luminati's set repainted (their relief kept, their colours through a ramp by luminance): cracked earth dark as
/** big dressed blocks (the inn's walls, the crypt's): a course three-quarters of a unit high, half a figure's height to a
 * block, one in six two courses tall, a few a shade darker, one in four a touch warmer or cooler (`tints`); a chamfer lit
 * along each top, pits; `mortar` its two shades */
function ashlar(s, ctx, K, STONE, mortar, tints) {
  const w = s.w, h = s.h, RH = 12, id = new Int32Array(w * h).fill(-1), blocks = [];
  const at = (R, t) => R[Math.max(0, Math.min(R.length - 1, Math.round(t * (R.length - 1))))];
  for (let r = 0; r < h / RH; r++) {
    const ws = []; let sum = 0;
    while (sum < w) { const bw = 15 + Math.floor(K.hash2(r, ws.length, ctx.seed + 72) * 12); ws.push(bw); sum += bw; }
    ws[ws.length - 1] -= sum - w; if (ws[ws.length - 1] < 10) { const l = ws.pop(); ws[ws.length - 1] += l; }
    let x = Math.floor(K.hash2(r, 9, ctx.seed + 71) * 20);
    for (const bw of ws) { blocks.push({ x, y: r * RH, w: bw, base: K.hash2(blocks.length, 3, ctx.seed + 73) }); x += bw; }
  }
  // (round 8: a block now and then two courses tall, a few a shade darker: the grid read uniform)
  blocks.forEach((b) => { b.tall = b.y + 2 * RH <= h && K.hash2(b.x, b.y, ctx.seed + 75) < 0.16; if (K.hash2(b.y, b.x, ctx.seed + 76) < 0.1) b.base *= 0.55; const q = K.hash2(b.x + 3, b.y, ctx.seed + 77); b.tint = q < 0.12 ? tints[0] : q < 0.25 ? tints[1] : null; });   // (one in four a touch warmer or cooler: round 10)
  blocks.forEach((b, k) => { if (!b.tall) for (let dy = 1; dy < RH; dy++) for (let dx = 1; dx < b.w; dx++) id[(b.y + dy) * w + ((b.x + dx) % w)] = k; });
  blocks.forEach((b, k) => { if (b.tall) for (let dy = 1; dy < 2 * RH; dy++) for (let dx = 1; dx < b.w; dx++) id[(b.y + dy) * w + ((b.x + dx) % w)] = k; });
  const N = K.field(w, h, 6, 6, ctx.seed + 61, { oct: 3 });
  s.each((x, y, i) => {
    const k = id[i];
    if (k < 0) { s.set(x, y, K.parseColor(N[i] > 0.55 ? mortar[0] : mortar[1])); s.hf[i] = 0; return; }
    const b = blocks[k], bh = b.tall ? 2 * RH : RH, lx = (x - b.x + w) % w, ly = y - b.y, d = Math.min(lx - 1, b.w - 1 - lx, ly - 1, bh - 1 - ly);
    let t = 0.3 + b.base * 0.32 + (N[i] - 0.5) * 0.3;
    if (ly <= 2) t += 0.14; else if (ly >= bh - 2) t -= 0.12;     // (a chamfer: lit along the top, shadowed under)
    if (lx <= 2) t += 0.06; else if (lx >= b.w - 2) t -= 0.08;
    if (K.hash2(x >> 1, y >> 1, ctx.seed + 74) > 0.97) t -= 0.18;   // (pits)
    const col = at(STONE, Math.max(0, Math.min(1, t)));
    s.set(x, y, b.tint ? K.mixColor(col, b.tint, 0.12) : col);
    s.hf[i] = 0.35 + 0.65 * Math.min(1, d / 2.5) + (N[i] - 0.5) * 0.15;
  });
  return { normal: 2.2 };
}
/** a ledger stone let into the crypt's floor: one long slab across the tile, a border cut round it, a name in lines, a
 * small roundel at its head; the floor's joint round it */
function ledgerStone(s, K, R) {
  const w = s.w, h = s.h, N = K.field(w, h, 8, 8, 941, { oct: 3 }), at = (t) => R[Math.max(0, Math.min(R.length - 1, Math.round(t * (R.length - 1))))];
  const x0 = 10, x1 = w - 10, y0 = 4, y1 = h - 4;
  s.each((x, y, i) => {
    if (x < x0 || x > x1 || y < y0 || y > y1) { s.set(x, y, R[1]); s.hf[i] = 0.1; return; }   // (the joint, and the slabs either side in the floor's tone)
    let t = 0.55 + (N[i] - 0.5) * 0.16, hf = 0.9;
    const bx = Math.min(x - x0, x1 - x), by = Math.min(y - y0, y1 - y);
    if (bx >= 3 && bx <= 4 || by >= 3 && by <= 4) { t -= 0.4; hf = 0.45; }                            // (the cut border)
    const ry = y - (y0 + 11), rx = x - (x0 + x1) / 2;
    if (Math.abs(Math.sqrt(rx * rx + ry * ry) - 5) < 0.8) { t -= 0.25; hf = 0.55; }   // (the roundel at its head)
    for (const ly of [26, 32, 38, 46, 52]) if (y === ly && x > x0 + 7 && x < x1 - 7 && K.hash2(x >> 1, ly, 943) > 0.25) { t -= 0.22; hf = 0.6; }   // (the lines of the name and dates)
    if (K.hash2(x >> 2, y >> 2, 945) > 0.8) t -= 0.06;                              // (worn by feet)
    s.set(x, y, at(Math.max(0.15, Math.min(1, t)))); s.hf[i] = hf;
  });
  return { normal: 2.0 };
}
/** the ossuary's walls: the dead's bones stacked into courses, a row of skulls and then a row of the long bones' ends,
 * by turns, in bone-white gone yellow-grey, the gaps black */
function ossuaryBones(s, K) {
  const w = s.w, h = s.h, BONE = ['#5a5040', '#716552', '#8a7d66', '#a19279', '#b5a587', '#c8b796'].map((c) => K.parseColor(c)), GAP = K.parseColor('#3b2d23');   // (round 9: a warm dark brown between, not navy)   // (round 5: desaturated, bone not yellow)
  const at = (t) => BONE[Math.max(0, Math.min(BONE.length - 1, Math.round(t * (BONE.length - 1))))];
  const N = K.field(w, h, 6, 6, 951, { oct: 2 });
  s.each((x, y, i) => {
    const band = y % 24, row = Math.floor(y / 24);   // (round 4: back to two courses a unit, each skull its own turn: at three they read as gravel)
    let t = 0, hf = 0, gap = true;
    if (band < 15) {                                           // a row of skulls, twelve wide, staggered row to row
      const cw = 12, k = Math.floor((x + (row % 2) * 6) / cw), turn = (K.hash2(k, row, 957) - 0.5) * 2.6, cx = ((x + (row % 2) * 6) % cw) - cw / 2 + 0.5 - turn * 0.4, cy = band - 7;
      const sz = 0.85 + K.hash2(k, row, 959) * 0.3, rr = (cx * cx) / (27 * sz * sz) + (cy * cy) / (38 * sz * sz);   // (each its own size, ±10 %)
      if (rr < 1) {
        gap = false; t = 0.5 + K.hash2(k, row, 953) * 0.45 - cy * 0.03 + (N[i] - 0.5) * 0.12; hf = 1 - rr * 0.6;
        if (cy > -1.5 && cy < 2.2 && Math.abs(Math.abs(cx - turn * 0.6) - 2.1) < 1.3) { t = 0.12; hf = 0.15; }   // (the eye sockets)
        if (cy > 3.2 && cy < 4.8 && Math.abs(cx - turn * 0.6) < 0.7) { t = 0.05; hf = 0.3; }                      // (the nose)
      }
    } else {                                                   // a band of the long bones' ends, four wide, paler
      const cx = (x % 4) - 1.5, cy = band - 19.5 + ((Math.floor(x / 4) % 2) ? 0.5 : -0.4), rr = (cx * cx) / 3.2 + (cy * cy) / 9;
      if (rr < 1) { gap = false; t = 0.72 + K.hash2(x >> 2, row, 955) * 0.28 + (N[i] - 0.5) * 0.14; hf = 0.85 - rr * 0.4; }   // (the long bones paler than the skulls, a band between each course: rounds 2, 4)
    }
    if (gap) { s.set(x, y, GAP); s.hf[i] = 0; return; }
    s.set(x, y, at(Math.max(0, Math.min(1, t)))); s.hf[i] = hf;
  });
  return { normal: 2.4 };
}
/** the cellar's rubble: rough stones of all sizes (Voronoi on a jittered grid, wrapped), three or four to a wall's
 * height, a light mortar between, each stone its own tone in a narrow band, lit along its top */
function tavernRubble(s, K, R, mortar) {
  const w = s.w, h = s.h, G = 4, cell = w / G, pts = [];
  for (let j = 0; j < G; j++) for (let i = 0; i < G; i++) pts.push([(i + 0.15 + K.hash2(i, j, 931) * 0.7) * cell, (j + 0.2 + K.hash2(i, j, 932) * 0.6) * cell, K.hash2(i, j, 933)]);
  const N = K.field(w, h, 6, 6, 935, { oct: 2 }), at = (t) => R[Math.max(0, Math.min(R.length - 1, Math.round(t * (R.length - 1))))];
  s.each((x, y, i) => {
    let d1 = 1e9, d2 = 1e9, k1 = 0, ny = 0;
    for (let k = 0; k < pts.length; k++) for (let oy = -h; oy <= h; oy += h) for (let ox = -w; ox <= w; ox += w) {
      const dx = (x + 0.5 - pts[k][0] - ox) * 0.8, dy = y + 0.5 - pts[k][1] - oy, d = Math.sqrt(dx * dx + dy * dy);   // (stones a little wider than tall)
      if (d < d1) { d2 = d1; d1 = d; k1 = k; ny = dy; } else if (d < d2) d2 = d;
    }
    const e = (d2 - d1) / 2;
    if (e < 0.9) { s.set(x, y, mortar); s.hf[i] = 0.05; return; }
    let t = 0.3 + pts[k1][2] * 0.4 + (N[i] - 0.5) * 0.14 + (ny < -3 ? 0.08 : ny > 3 ? -0.08 : 0);
    if (e < 1.8) t -= 0.1;
    s.set(x, y, at(Math.max(0, Math.min(1, t))));
    s.hf[i] = 0.4 + 0.6 * Math.min(1, (e - 0.9) / 2.5);
  });
  return { normal: 2.2 };
}
/** the inn's flagstones (registerTextureSet below): cut slabs in running courses (round 3, the art critic: "every
 * stone is a rounded blob with a fat black outline… crocodile skin or a cobbled street, not cut flagstones"), courses of
 * two depths, each slab its own length and its own shade in a narrow band, a joint a pixel wide in mid-dark grey, the
 * corners chipped, a crack across one slab in seven. One layout for both flags (`worn` only shades), so they meet joint
 * to joint. */
function tavernFlags(s, K, R, worn) {
  const w = s.w, h = s.h, id = new Int32Array(w * h).fill(-1), slabs = [], rows = [12, 10, 14, 12, 16];
  let y0 = 0;
  for (let r = 0; y0 < h; r++) {
    const rh = Math.min(rows[r % rows.length], h - y0), lens = []; let sum = 0;
    while (sum < w) { const L = 14 + Math.floor(K.hash2(r, lens.length, 911) * 14); lens.push(L); sum += L; }
    lens[lens.length - 1] -= sum - w; if (lens[lens.length - 1] < 9) { const l = lens.pop(); lens[lens.length - 1] += l; }
    let x = Math.floor(K.hash2(r, 7, 913) * 24);
    for (const L of lens) { slabs.push({ x, y: y0, w: L, h: rh, t: K.hash2(slabs.length, 3, 915), crack: K.hash2(slabs.length, 5, 917) < 0.15 }); x += L; }
    y0 += rh;
  }
  slabs.forEach((sl, k) => { for (let dy = 1; dy < sl.h; dy++) for (let dx = 1; dx < sl.w; dx++) id[(sl.y + dy) * w + ((sl.x + dx) % w)] = k; });
  const N = K.field(w, h, 8, 8, 905, { oct: 3 }), at = (t) => R[Math.max(0, Math.min(R.length - 1, Math.round(t * (R.length - 1))))];
  s.each((x, y, i) => {
    const k = id[i];
    if (k < 0) { s.set(x, y, R[1]); s.hf[i] = 0.1; return; }
    const sl = slabs[k], lx = (x - sl.x + w) % w, ly = y - sl.y, e = Math.min(lx, sl.w - lx, ly, sl.h - ly);
    const corner = Math.min(lx, sl.w - lx) + Math.min(ly, sl.h - ly) < 4 && K.hash2(k, (lx < 4 ? 1 : 2) + (ly < 4 ? 0 : 2), 919) < 0.6;
    if (corner) { s.set(x, y, R[1]); s.hf[i] = 0.15; return; }   // (a chipped corner)
    let t = 0.42 + sl.t * 0.3 + (N[i] - 0.5) * 0.18;
    if (ly <= 1) t += 0.07; else if (ly >= sl.h - 2) t -= 0.06;   // (lit along the top edge, a shade under)
    if (sl.crack && Math.abs(lx - sl.w * 0.5 - (ly - sl.h * 0.5) * 0.8) < 0.6) t -= 0.25;
    if (worn && K.hash2(x >> 2, y >> 2, 907) > 0.78) t -= 0.1;     // (soot, spilt ale)
    if (K.hash2(x, y, 909) > 0.985) t -= 0.15;
    s.set(x, y, at(Math.max(0.2, Math.min(1, t))));
    s.hf[i] = 0.45 + 0.55 * Math.min(1, e / 2.5) + (N[i] - 0.5) * 0.1;
  });
  return { normal: 2.0 };
}
// cinders, cobbles in charcoal without their moss, red sand as rust-stained mud, red rock iron-dark, dry grass ash-grey, ash a step darker;
// and the dungeons' stone for the Reach's other sites and the Fens' kits (below).
let reachLib = null;
registerTextureSet((K) => {
  const P = (a) => a.map((c) => K.parseColor(c)), at = (R, t) => R[Math.max(0, Math.min(R.length - 1, Math.round(t * (R.length - 1))))];
  const lum = (c) => (0.3 * c[0] + 0.59 * c[1] + 0.11 * c[2]) / 255;
  // (post: a touch after the ramp, per pixel, with t the pixel's place on it: the dungeons' bronze joints, glowing cracks,
  // wet sheen and slime, below)
  const recolor = (src, R, post = null) => (s, ctx) => {
    const p = (reachLib ||= new TextureLibrary({ seed: 7 })).pixels(src); if (!p) return {};
    const { width: w, height: h } = p.color, L = new Float32Array(w * h); let lo = 1, hi = 0;
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const l = lum(p.color.get(x, y)); L[y * w + x] = l; lo = Math.min(lo, l); hi = Math.max(hi, l); }
    s.each((x, y, i) => { const t = (L[i] - lo) / Math.max(1e-3, hi - lo); s.set(x, y, at(R, t)); s.hf[i] = p.height[i]; post?.(s, x, y, i, t, ctx); });
    return { normal: 2.2 };
  };
  // (the owner, 2026-11-16, from the phone at dawn: "Cinder reach is too dark at dawn.. check other times too": the
  // ground ramps had been painted near charcoal, a third of the Vale's grass, and outside Ashgate's gate the world band's
  // mean was 10–28 from dusk to dawn against the Vale's 39–66. Ash is pale; the ground lifted toward a mid ash grey
  // (LIFT), the slag brick left dark so the town still stands black on it)
  const LIFT = (a) => a.map((c) => { const k = new THREE.Color(c).multiplyScalar(1.55).lerp(new THREE.Color('#8e877c'), 0.2); return '#' + k.getHexString(); });
  const SLAG = P(['#0c0b0e', '#141318', '#1c1a20', '#25222a', '#2f2b33', '#3b363d', '#4a4348']), MORTAR = P(['#3a3532', '#4e4743', '#625a54']);
  const RUST = P(['#3a1a10', '#5a2814']), GLASS = P(['#2c4a4c', '#3e6662']);
  const BRONZE_J = P(['#6a4e24', '#8a6a34']), FORGE_M = K.parseColor('#1a1614'), FORGE_S = P(['#141212', '#1c1918', '#26221f', '#302a27', '#3c3430', '#4a403a']);
  const EMBER = P(['#e8501a', '#ffa040']), WET = P(['#9aacb4', '#8a8a70']), SLIME = P(['#5a7a24', '#6e8e2c']);
  return {
    // black slag brick in ash-grey mortar, rust weeping here and there, a fleck of slag glass
    slag_brick: { px: [32, 32], normalScale: 0.6, gen: (s, ctx) => {
      const r = K.genStoneBrick(s, ctx), N = K.field(s.w, s.h, 4, 4, ctx.seed + 41, { oct: 2 });
      s.each((x, y, i) => {
        const l = lum(s.get(x, y)), q = K.hash2(x, y, ctx.seed + 43);
        if (s.hf[i] <= 0.001) { s.set(x, y, MORTAR[q < 0.3 ? 0 : N[i] > 0.6 ? 2 : 1]); return; }
        let col = at(SLAG, Math.min(1, l * 1.25));
        if (N[i] > 0.84 && K.hash2(x, y >> 1, ctx.seed + 44) < 0.7) col = K.mixColor(col, RUST[N[i] > 0.92 ? 1 : 0], 0.32);
        if (q > 0.985) col = GLASS[q > 0.995 ? 1 : 0];
        s.set(x, y, col);
      });
      return r;
    } },
    // rust-red tile under drifts of soot
    roof_rust: { px: [32, 32], normalScale: 0.7, gen: (s, ctx) => {
      const r = K.genClayRoof(s, ctx, ['#1e0f0c', '#36180f', '#552517', '#73341e', '#8e4826', '#a65e34']), N = K.field(s.w, s.h, 3, 3, ctx.seed + 51, { oct: 3 });
      s.each((x, y, i) => { if (N[i] > 0.6) s.set(x, y, K.mixColor(s.get(x, y), '#1a1514', Math.min(0.6, (N[i] - 0.6) * 2.2))); });
      return r;
    } },
    cinder_earth: { px: [64, 64], normalScale: 0.6, gen: recolor('cracked_earth', P(LIFT(['#121011', '#1b1817', '#25211f', '#302a27', '#3c3530', '#4a413a', '#5a4f46', '#6c5f53']))) },
    cinder_cobble: { px: [64, 64], normalScale: 0.7, gen: recolor('cobblestone', P(LIFT(['#141317', '#1d1c21', '#28262c', '#333038', '#3f3b43', '#4c4750', '#5c5660']))) },
    rust_mud: { px: [64, 64], normalScale: 0.5, gen: recolor('red_sand', P(LIFT(['#200d09', '#33150d', '#481f11', '#5e2a16', '#73361c', '#874424', '#9a5430']))) },
    // (round 2: Luminati's red rock and dry grass were the loudest things in the frame, orange and yellow; here the red
    // rock is iron-stained and dark, the scrub dried to an ash-dusted olive grey)
    rust_rock: { px: [64, 64], normalScale: 0.65, gen: recolor('redrock', P(LIFT(['#1c0e0b', '#2a1510', '#3a1d14', '#4a2618', '#5a301e', '#6a3a24', '#7a4630']))) },
    ash_scrub: { px: [64, 64], normalScale: 0.5, gen: recolor('dry_grass', P(LIFT(['#1e1c19', '#2a2722', '#36322b', '#433d33', '#4f483b', '#5c5444', '#6a604e']))) },
    // (round 4: Luminati's ash, near white in its drifts, beside the cinder earth read as a mosaic of pale tiles: a
    // step darker, still the lightest ground in the Reach)
    ash_drift: { px: [64, 64], normalScale: 0.5, gen: recolor('ash', P(LIFT(['#262422', '#33302d', '#413d39', '#504b46', '#5f5953', '#6f6860', '#80786f', '#91897e']))) },
    // ── the dungeons' stone (docs/art-critic-pass-reach.md part 2; docs/art-critic-pass-fens-dungeons.md): mid values all,
    // as underground's dim violet fill takes dark stone to black (the pithead's round 3; round 2 here lifted the forge's
    // flags, the mud and the Fens' flags a third)
    // the Forgehall's floor: the empire's flags, dark warm stone, bronze in the joints
    forge_flag: { px: [64, 64], normalScale: 0.6, gen: recolor('stone_tiles', P(['#3a3430', '#4c4440', '#5e554e', '#70665c', '#82776a', '#948878', '#a69a88']), (s, x, y, i, t) => { if (t < 0.12) s.set(x, y, BRONZE_J[(x + y) & 1]); }) },
    // its walls: black dressed stone, a bronze course every second row of blocks
    forge_stone: { px: [32, 32], normalScale: 0.6, gen: (s, ctx) => {
      const r = K.genStoneBrick(s, ctx);
      s.each((x, y, i) => { const l = lum(s.get(x, y)); s.set(x, y, s.hf[i] <= 0.001 ? (y % 16 < 8 ? BRONZE_J[1] : FORGE_M) : at(FORGE_S, Math.min(1, l * 1.2))); });
      return r;
    } },
    // the deep forges and the Magma Vault: broken black rock, fire in its cracks (the cracks lit: an emissive mask)
    magma_floor: { px: [64, 64], normalScale: 0.7, emissive: true, gen: recolor('basalt', P(['#1e1a1a', '#2a2422', '#38302c', '#463c36', '#544840', '#62564c', '#706252']), (s, x, y, i, t, ctx) => {
      if (t < 0.16 && K.hash2(x >> 1, y >> 1, ctx.seed + 9) < 0.7) { const c = EMBER[t < 0.08 ? 1 : 0]; s.set(x, y, c); s.emissive().set(x, y, c); } }) },
    // the Fens' (world doc §3.2): the Toadking's mud, black and olive, a wet glint; the locks' slick blue-grey flags;
    // Vat Seven's flags stained sick green, slime in the joints; the abbey's pale cloister stone gone green-grey
    fen_mud: { px: [64, 64], normalScale: 0.5, gen: recolor('dirt', P(['#2c271e', '#3a3428', '#4a4232', '#5a503c', '#6a5e46', '#7a6c52', '#8a7a5e']), (s, x, y, i, t, ctx) => { if (K.hash2(x, y, ctx.seed + 5) > 0.985) s.set(x, y, WET[1]); }) },
    wet_flag: { px: [64, 64], normalScale: 0.6, gen: recolor('stone_tiles', P(['#2c3438', '#3a454a', '#4a565c', '#5a676e', '#6a7880', '#7c8a92', '#909ea4']), (s, x, y, i, t, ctx) => { if (t > 0.7 && K.hash2(x, y, ctx.seed + 5) > 0.93) s.set(x, y, WET[0]); }) },
    sick_flag: { px: [64, 64], normalScale: 0.6, gen: recolor('stone_tiles', P(['#2c3224', '#3a422e', '#4a5438', '#5a6544', '#6a7650', '#7a865c', '#8a9668']), (s, x, y, i, t, ctx) => { if (t < 0.14 && K.hash2(x >> 1, y >> 1, ctx.seed + 7) < 0.8) s.set(x, y, SLIME[(x + y) & 1]); }) },
    abbey_flag: { px: [64, 64], normalScale: 0.6, gen: recolor('stone_tiles', P(['#2e3430', '#3e4540', '#4f5650', '#606860', '#717970', '#838a80', '#969c90'])) },
    // (round 2: underground's fill is a dim violet, and the charcoal cobbles of the Ashgate square read black there, the
    // yards' world band 26 → 19 with them, the foes in Assay grey lost on it: the dungeons' cobbles a mid warm grey)
    dun_cobble: { px: [64, 64], normalScale: 0.7, gen: recolor('cobblestone', P(['#3c3834', '#4e4944', '#625b54', '#766e65', '#8a8177', '#9e948a', '#b2a89c'])) },
    // the Shuttered Inn (docs/tavern-dungeon.md, the owner's reference): warm grey-buff flagstones, dark joints; a worn,
    // sooted flag among them; walls of big dressed blocks in grey-buff stone, dark mortar; dark oak along their tops
    // (round 2: irregular flags a unit or so across, about twice stone_tiles', in wide dark joints, neighbours close in
    // tone, the art critic: "a tight diamond grid of mottled squares reads as checkerboard noise". Both flags share one
    // layout, so a worn tile meets a clean one joint to joint)
    tavern_flag: { px: [64, 64], normalScale: 0.8, gen: (s) => tavernFlags(s, K, P(['#40362c', '#6b5e4f', '#7b6d5c', '#897a67', '#968571', '#a1907b', '#ae9d87']), false) },   // (round 5: a step toward umber)
    tavern_flag_worn: { px: [64, 64], normalScale: 0.8, gen: (s) => tavernFlags(s, K, P(['#332c27', '#5a5148', '#675d52', '#73685c', '#7e7366', '#897d70', '#968a7c']), true) },
    // (big dressed blocks, a course three-quarters of a unit high, half a figure's height to a block as in the reference,
    // Luminati's stone_brick's courses half that: painted here, K has no block layout)
    tavern_wall: { px: [48, 48], normalScale: 0.85, gen: (s, ctx) => ashlar(s, ctx, K, P(['#3c3631', '#4e4741', '#605850', '#726960', '#857a6e', '#978b7d', '#a99d8d', '#bbb09e']), ['#2c2622', '#231e1b'], ['#8a7a64', '#6e7480']) },
    // the Haddow Crypt (docs/crypt-dungeon.md): pale cool limestone ashlar in a light mortar, worn smooth; pale slabs
    // underfoot, the family's ledger stones among them, a name and a border cut in each; the ossuary's walls of bones
    crypt_wall: { px: [48, 48], normalScale: 0.75, gen: (s, ctx) => ashlar(s, ctx, K, P(['#7a6e5c', '#8e806b', '#a3937c', '#b6a58c', '#c9b698', '#d5c3a6', '#dfcfb3', '#e8dbc2']), ['#7a6c58', '#6c5f4d'], ['#b09e7c', '#9a9a94']) },   // (round 4: warm grey joints)   // (round 2: warm pale limestone, a clear step over the floor)
    crypt_top: { px: [32, 32], normalScale: 0.3, gen: (s) => { const N = K.field(s.w, s.h, 4, 4, 965, { oct: 2 }), R = P(['#8c8474', '#9a917f', '#a89e8b', '#b5ab97', '#c1b7a2']); s.each((x, y, i) => { s.set(x, y, at(R, Math.max(0, Math.min(1, 0.5 + (N[i] - 0.5) * 0.6)))); s.hf[i] = 0.6; }); return { normal: 1 }; } },   // (the walls' coping, pale: round 2, "the tops read flat and dark")
    crypt_sill: { px: [48, 48], normalScale: 0.75, gen: (s, ctx) => ashlar(s, ctx, K, P(['#4f4a3f', '#5e584b', '#6d6656', '#7c7462', '#8a816d', '#968c77', '#a19782', '#aba18c']), ['#5c5244', '#51483b'], ['#867860', '#787874']) },   // (the near sills, a quarter darker: round 5)
    crypt_sill_top: { px: [32, 32], normalScale: 0.3, gen: (s) => { const N = K.field(s.w, s.h, 4, 4, 967, { oct: 2 }), R = P(['#867d6c', '#938b78', '#a09784', '#ada390', '#b8ae9a']); s.each((x, y, i) => { s.set(x, y, at(R, Math.max(0, Math.min(1, 0.5 + (N[i] - 0.5) * 0.6)))); s.hf[i] = 0.6; }); return { normal: 1 }; } },
    crypt_flag: { px: [64, 64], normalScale: 0.7, gen: (s) => tavernFlags(s, K, P(['#3a332b', '#6a6052', '#73685a', '#7c7062', '#85796a', '#8e8272', '#978a7a']), false) },   // (round 8: warmer and a sixth lighter, the joints darker)   // (round 4: the flags' spread narrowed, so the ledger stones stand out)   // (round 1: a step darker and warmer than the tombs' pale stone, so they stand off it)
    crypt_ledger: { px: [64, 64], normalScale: 0.8, gen: (s) => ledgerStone(s, K, P(['#36312b', '#706757', '#82786a', '#928879', '#9f9582', '#aca290', '#b8ae9b'])) },   // (round 1: a fifth lighter than the flags round it, so they're seen)
    // the carving stone (the tombs, their likenesses, the arches, the tablets): a fine pale limestone, its grain soft, a
    // fleck or a pit here and there (painted: Luminati's limestone isn't in the library the recolours draw on)
    crypt_cap: { px: [32, 32], normalScale: 0.35, gen: (s) => {
      const N = K.field(s.w, s.h, 4, 4, 961, { oct: 3 }), R = P(['#6e6b66', '#7e7a74', '#8c8881', '#9a958d', '#a7a299', '#b3aea4']);
      s.each((x, y, i) => { let t = 0.35 + (N[i] - 0.5) * 0.5; const q = K.hash2(x, y, 963); if (q > 0.97) t -= 0.25; else if (q < 0.02) t += 0.2; s.set(x, y, at(R, Math.max(0, Math.min(1, t)))); s.hf[i] = 0.6 + (N[i] - 0.5) * 0.3; });
      return { normal: 1.4 };
    } },
    ossuary_wall: { px: [48, 48], normalScale: 1.0, gen: (s) => ossuaryBones(s, K) },
    // the cellar's rough rubble: stones of all sizes in thick dark mortar
    tavern_rubble: { px: [48, 48], normalScale: 0.9, gen: (s) => tavernRubble(s, K, P(['#4a433b', '#5c544a', '#6a6156', '#776d61', '#84796c', '#918577']), K.parseColor('#7e7468')) },   // (round 6: big stones, three or four to a wall's height, in a light mortar: the cobble read as bark)
    tavern_cap: { px: [32, 32], normalScale: 0.5, gen: recolor('wood_planks_dark', P(['#2a1c13', '#3a281b', '#4a3423', '#5a402b', '#6a4c33', '#7a583c'])) },   // (round 4: the wall tops a warm oak, not a black band)
  };
});

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
      const img = await image(`${ASSETS}env/${sets[i]}.alb.png?v=${all[i]._v}`);
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
// the floor's gates (hybrid.js gatesOf; GDD §3.4 v1.70, v1.118 a gate a room): an iron portcullis across each way into a
// room still shut, three bars and two rails a tile on the tile's room-side edge, stood up across the corridor; one
// instanced mesh a gate, built once. As it opens it sinks into the floor (drop 0 → 1, eased in: it starts slow, then
// goes), and it's gone. A gate not in the frame's list (another floor's, or long down) is put away.
const GATE_H = 2.3, GATE_BAR = 0.07;
const gateMeshes = new Map();                                  // gate id → its mesh
const GATE_GEO = new THREE.BoxGeometry(1, 1, 1);
function gateMeshOf(g) {
  const n = g.cells.length * 5, mat = new THREE.MeshStandardMaterial({ color: 0x2c2a2f, roughness: 0.48, metalness: 0.65, emissive: 0x120d08 });
  const mesh = new THREE.InstancedMesh(GATE_GEO, mat, n); mesh.name = 'ember:gate'; mesh.castShadow = true; mesh.frustumCulled = false;
  const M = new THREE.Matrix4(), Q = new THREE.Quaternion(), P = new THREE.Vector3(), Sc = new THREE.Vector3(), up = new THREE.Vector3(0, 1, 0);
  let i = 0;
  for (const [x, z, dx, dz] of g.cells) {
    const y = game.tileMap.getHeight(x, z), ex = x + dx * 0.22, ez = z + dz * 0.22, ang = dx ? Math.PI / 2 : 0;   // (on the room's side; the bars along the edge)
    Q.setFromAxisAngle(up, ang);
    for (const o of [-0.17, 0, 0.17]) {                         // the bars
      P.set(ex + (dx ? 0 : o), y + GATE_H / 2, ez + (dx ? o : 0)); Sc.set(GATE_BAR, GATE_H, GATE_BAR);
      M.compose(P, Q, Sc); mesh.setMatrixAt(i++, M);
    }
    for (const hy of [0.55, 1.75]) {                            // the rails across, a tile wide
      P.set(ex, y + hy, ez); Sc.set(0.52, GATE_BAR * 1.4, GATE_BAR * 1.2);
      M.compose(P, Q, Sc); mesh.setMatrixAt(i++, M);
    }
  }
  mesh.instanceMatrix.needsUpdate = true;
  return mesh;
}
const gateSeen = new Set();
function placeGates(list) {
  gateSeen.clear();
  if (game) for (const g of list || []) {
    let mesh = gateMeshes.get(g.id);
    if (!mesh || !mesh.parent) { if (mesh) { mesh.material.dispose(); mesh.dispose?.(); } mesh = gateMeshOf(g); game.engine.scene.add(mesh); gateMeshes.set(g.id, mesh); }
    const d = Math.max(0, Math.min(1, g.drop));
    mesh.visible = d < 1;
    mesh.position.y = -(GATE_H + 0.1) * d * d;                  // (into the floor: the floor hides what's sunk)
    gateSeen.add(g.id);
  }
  for (const [id, mesh] of gateMeshes) if (!gateSeen.has(id)) { mesh.removeFromParent(); mesh.material.dispose(); mesh.dispose?.(); gateMeshes.delete(id); }
}
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

// ── the menu's Quality (above: quality) ───────────────────────────────────────────────────────────────────────────
// applied at once and at every level built (settings()); a change of shadow type or light count recompiles the lit
// programs once, three.js seeing the change
function applyQuality() {
  const R = game?.engine?.renderer; if (!R) return;
  const t = quality === 'low' ? THREE.BasicShadowMap : THREE.PCFShadowMap;
  if (R.shadowMap.type !== t) {
    R.shadowMap.type = t; R.shadowMap.needsUpdate = true;
    game.engine.scene.traverse((q) => { if (q.material) for (const m of [].concat(q.material)) m.needsUpdate = true; });
  }
  applyGrade(); lampsTo(lampsFor()); showWisps();
}
// the grade's fine grain (skyFor sets each level's grade; this lays Low's over it)
function applyGrade() {
  const G = game?.postfx?.settings?.grade; if (!G || !gradeKeep) return;
  Object.assign(G, quality === 'low' ? { sharpen: 0, grain: 0, chromaticAberration: 0 } : gradeKeep);
}
// the lamp pool at n lights: a new fixed pool, the level's lamps wired into it again (its story lamps hidden as they
// were), the old one let go; the levels set aside and one built ahead held the old pool, so they're dropped (built again
// when visited). At boot the pool is made at its size (boot: game.lightPool)
function lampsTo(n) {
  const old = game?.lightPool; if (!old || lampsSet === n || !game.lighting) return;
  for (const [, v] of aside) { game.disposeKept(v.kept); dropEnv(v.env, v.made); }
  aside.clear(); dropPrep();
  const np = new LightPool(game.lighting, [], { size: n, fixed: true });
  game.lightPool = np; lampsSet = n;
  const w = game.world;
  if (w) { w._sharedPool = np; w._wireLights(); }
  old.dispose();
}
// of the effect lights, Low shows the hero's wisp and the spells' light (wispSlots: theirs, found as they're taken); the
// blast's flash and the spare go dark (each still taken and set: unseen)
function showWisps() {
  const S = game?.vfxLights?._slots; if (!S) return;
  for (const sl of S) sl.handle.light.visible = quality !== 'low' || wispSlots.includes(sl);
}
const loaned = () => new Set((game?.vfxLights?._slots || []).filter((sl) => sl.loan));

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
  // one fixed pool of point lights for every level, as Luminati gives a campaign (its init makes one only for those): the
  // light count, and with it every lit program, the same from level to level, so a level's swap compiles no program the
  // last one had; and a level left can be set aside (swapLevel `keep` needs the shared pool). Its init writes null here.
  let pool = null;
  Object.defineProperty(game, 'lightPool', { configurable: true, enumerable: true, get: () => pool,
    set: (v) => { pool = v || pool || (game.lighting ? new LightPool(game.lighting, [], { size: (lampsSet = lampsFor()), fixed: true }) : null); } });
  await game.init(() => {});
  if (game.audio) game.audio.muted = true;                    // (the game has its own sound: src/audio/)
  game._updatePlayCamera = () => {};                          // (the camera is the game's: placeCamera)
  game._updateCameraBounds = () => {};
  game.start();
  await game.warmedUp;
  game.engine.stop();                                         // (the game steps it: frame())
  // a swap's warm-up frames, drawn here: Luminati's swapLevel waits for a few (`_frames`: the new level's programs finish
  // at their first draw), counting its engine's frames; that stopped, and the game stepping it only once a level is built
  // (hybrid.js frame), every swap waited out its one-second fallback. Now those few are drawn at once, back to back,
  // behind the overlay's black (renderer.js transit): a level set aside is back in two frames (7–10 ms each), not 1 s.
  game._frames = (n) => {
    for (let i = 0; i < n; i++) {
      try { game.engine.step(1 / 60); } catch (err) { console.warn('[luminati] a warm-up frame:', err); break; }
    }
    return Promise.resolve(undefined);
  };
  game.engine.events.on('lateUpdate', () => { if (game) placeCamera(); });
  // underground, the ambient is the game's (convert.js ambientOf), laid over the palette's after it updates
  game.engine.events.on('update', gradeByHour);
  game.engine.events.on('update', () => {
    const a = frameAmbient, L = game?.lighting; if (!a || !L?.hemi) return;
    L.hemi.color.setRGB(a.sky[0], a.sky[1], a.sky[2]); L.hemi.groundColor.setRGB(a.ground[0], a.ground[1], a.ground[2]); L.hemi.intensity = a.i;
    if (L.sun) L.sun.intensity *= a.sun;
  });
  if (game.lighting) game.lighting._shadowExtent = Math.max(game.lighting._shadowExtent || 22, 34);   // (the view is wider than Luminati's: shadows reach the screen's top)
  api.settings({});   // (what the menu set before the game was up: the shadows' edges, the resolution; a level swap applies them again)
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
// the Kingstone's sweep (GDD §19 v1.105, battle.js ringTells): a 120° fan from its middle, filling out to its rim; its
// rim the arc alone (the fan's straight sides drawn as lanes)
const CONE_ARC = (2 * Math.PI) / 3, CONE_GEO = new THREE.CircleGeometry(1, 36, -CONE_ARC / 2, CONE_ARC), CRIM_GEO = new THREE.RingGeometry(0.93, 1, 36, 1, -CONE_ARC / 2, CONE_ARC);
const groundMat = () => new THREE.MeshBasicMaterial({ transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2, toneMapped: false });
const groundPools = { ring: [], disc: [], rim: [], focus: [], wfill: [], wrim: [], lane: [], cone: [], crim: [] };
const GEO = { ring: RING_GEO, disc: DISC_GEO, rim: RIM_GEO, focus: FOCUS_GEO, wfill: DISC_GEO, wrim: WRIM_GEO, lane: LANE_GEO, cone: CONE_GEO, crim: CRIM_GEO };
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
// (the Reach's, docs/art-critic-pass-reach-fx.md) the Stoker's vents: slag coming up, molten orange, its heart hotter as it
// comes; the Weighmaster's pan's footprint in brass inside the red
const SLAG = [255, 122, 24], SLAG_HOT = [255, 206, 96], BRASS = [232, 186, 92];
// The Weighmaster's pan (battle.js 'scales' tells): a brass scale-pan on three chains, hung from out of sight over the one
// he weighs, coming down through its wind to land on the tell as it lands (its shadow on the floor closing on them), then
// hauled back up. One mesh (dish, chains, ring and the chain up merged), a unit across, scaled to the tell; pooled.
const PAN_DROP = 2.8;                                           // (units over the floor it starts from: over a man's head)
let PAN_GEO = null, PAN_MAT = null;
const panPool = [];
function panGeo() {
  if (PAN_GEO) return PAN_GEO;
  const parts = [], pts = [[0, 0], [0.55, 0.015], [0.86, 0.06], [0.98, 0.13], [1.03, 0.15], [1.0, 0.16]].map(([r, y]) => new THREE.Vector2(r, y));
  parts.push(new THREE.LatheGeometry(pts, 28));                                                          // the dish
  parts.push(new THREE.TorusGeometry(1.01, 0.03, 5, 28).rotateX(Math.PI / 2).translate(0, 0.15, 0));     // its rolled rim
  const top = new THREE.Vector3(0, 1.5, 0), up = new THREE.Vector3(0, 1, 0);
  for (let i = 0; i < 3; i++) {                                                                          // the three chains to a ring
    const a = (i / 3) * Math.PI * 2 + 0.3, foot = new THREE.Vector3(Math.cos(a) * 0.96, 0.16, Math.sin(a) * 0.96), d = top.clone().sub(foot);
    const c = new THREE.CylinderGeometry(0.018, 0.018, d.length(), 4); c.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(up, d.clone().normalize())); c.translate((foot.x + top.x) / 2, (foot.y + top.y) / 2, (foot.z + top.z) / 2); parts.push(c);
  }
  parts.push(new THREE.TorusGeometry(0.07, 0.022, 4, 10).translate(0, 1.55, 0));                        // the ring
  parts.push(new THREE.CylinderGeometry(0.022, 0.022, 4, 4).translate(0, 3.6, 0));                      // the chain up, out of sight
  const geos = parts.map((g) => { const q = g.index ? g.toNonIndexed() : g; for (const k of Object.keys(q.attributes)) if (k !== 'position' && k !== 'normal') q.deleteAttribute(k); if (!q.attributes.normal) q.computeVertexNormals(); return q; });
  PAN_GEO = mergeGeometries(geos); for (const g of [...parts, ...geos]) if (g !== PAN_GEO) g.dispose();
  return PAN_GEO;
}
function panMesh(n) {
  while (panPool.length <= n) {
    PAN_MAT ||= new THREE.MeshStandardMaterial({ color: new THREE.Color('#b8893a'), metalness: 0.55, roughness: 0.42, emissive: new THREE.Color('#ffc864'), emissiveIntensity: 0.12, side: THREE.DoubleSide });
    const m = new THREE.Mesh(panGeo(), PAN_MAT.clone()); m.castShadow = true; m.receiveShadow = false; m.visible = false; m.name = 'ember:pan'; game.engine.scene.add(m); panPool.push(m);
  }
  return panPool[n];
}
const easeIn = (u) => u * u * u;
const OCC_RAY = new THREE.Raycaster();   // (occluded(): the visibility check's ray)
// (occluded(): a card's pixel alpha where a ray met it, 0..255, read from its texture as Sprite3D samples it, offset +
// uv × repeat, flipped in y; null where the image can't be read. Each image is copied once into a canvas, for checks only.)
const cardPx = new WeakMap();
function cardAlpha(mat, uv) {
  const t = mat && mat.map, img = t && t.image;
  if (!uv || !img || !img.width) return null;
  let d = cardPx.get(img);
  if (!d) {
    try {
      const c = document.createElement('canvas'); c.width = img.width; c.height = img.height;
      const g = /** @type {CanvasRenderingContext2D} */ (c.getContext('2d', { willReadFrequently: true })); g.drawImage(img, 0, 0);
      d = { w: c.width, h: c.height, px: g.getImageData(0, 0, c.width, c.height).data };
    } catch { return null; }
    cardPx.set(img, d);
  }
  let u = t.offset.x + uv.x * t.repeat.x, v = t.offset.y + uv.y * t.repeat.y;
  u -= Math.floor(u); v -= Math.floor(v);
  const x = Math.min(d.w - 1, Math.floor(u * d.w)), y = Math.min(d.h - 1, Math.floor((t.flipY ? 1 - v : v) * d.h));
  return d.px[(y * d.w + x) * 4 + 3];
}
let CARRY_UP = 6, CARRY_GAIN = 1.6;   // (the carry light over the models: its height and strength; settings({ carryUp, carryGain }) for look-dev)
let DLOOK = '';   // (a spike: ?dlook=, settings({ dlook }))
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

// ── the tiers' skills in Luminati's looks (GDD v1.55; the owner's picks: skillfx.js LUM_LOOKS, the rest in our light) ──
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
  // FIGHTER · Vault (Skyfall Judgement; v1.99 the slow leap: src/render/leap.js): dust kicked up where he springs, his
  // sigil turning under the foe through the flight (the great sword's ghost that fell in his place is gone: he is the
  // blade falling now, and it drew the eye off him onto the foe); and as he lands (S.hit: the sim's strike), the floor cracking, the blow's flash, a ring of dust thrown out, the light
  vault(S, rec, L, K, H, vx, vz) {
    if (L == null) return null;
    const T = S.air || 0.3, P = S.hit != null ? S.hit : L >= T + 0.25 ? L - T : null;   // (P: s since he landed; a strike never heard: as timed)
    const [sig, crack, hit, ring, ...rest] = quadsOf(rec, 'q', 11), dust = rest.slice(0, 5), puff = rest.slice(5), yf = H(S.tx, S.tz), y0 = H(S.fx, S.fz);
    const grow = smooth(L / T), out = P == null ? 1 : 1 - smooth((P - 0.3) / 0.4);
    q(sig, { frame: 'heroSigil', x: S.tx, y: yf + 0.04, z: S.tz, mode: 'flat', scale: 0.1 + 0.14 * grow, rot: L * 2.2, ...col(STEEL, 0.5 + 0.6 * grow), a: 0.95 * out });
    puff.forEach((h, i) => { const a = i * 3.1416 + 0.8, t = L, d = 0.25 + 0.45 * smooth(t / 0.35); q(h, { frame: 'dust', index: Math.min(2, Math.floor(t * 7)), x: S.fx + Math.cos(a) * d, y: y0 + 0.15 + 0.15 * t, z: S.fz + Math.sin(a) * d, mode: 'billboard', scale: 1.6, ...col(DUSTC), a: 0.8 * (1 - smooth(t / 0.45)) }); });
    const p = P == null ? -1 : P;
    q(crack, { frame: 'heroCrack', x: S.tx, y: yf + 0.05, z: S.tz, mode: 'flat', scale: 0.62 * smooth(p / 0.1), ...col(STEEL, 0.9), a: p >= 0 ? 1 - smooth((p - 0.45) / 0.4) : 0 });
    q(hit, { frame: 'impact', index: Math.min(3, Math.floor(p * 14)), x: S.tx + vx * 0.3, y: yf + 0.7, z: S.tz + vz * 0.3, mode: 'billboard', scale: 2.8, ...col(STEEL_HOT), a: p >= 0 && p < 0.25 ? 1 : 0, halo: 1 });
    q(ring, { frame: 'partyRing', index: 1, x: S.tx, y: yf + 0.06, z: S.tz, mode: 'flat', scale: 0.15 + 0.5 * smooth(p / 0.35), ...col(DUSTC, 1.2), a: p >= 0 ? 0.8 * (1 - smooth(p / 0.45)) : 0 });
    dust.forEach((h, i) => { const a = i * 1.2566 + (rec.seed % 5) * 0.2, d = 0.35 + 0.9 * smooth(p / 0.45); q(h, { frame: 'dust', index: Math.min(2, Math.floor(p * 7)), x: S.tx + Math.cos(a) * d, y: yf + 0.2 + 0.25 * Math.max(0, p), z: S.tz + Math.sin(a) * d, mode: 'billboard', scale: 2.3, ...col(DUSTC), a: p >= 0 ? 1 - smooth(p / 0.6) : 0 }); });
    if (P == null) return { x: S.tx, z: S.tz, k: 0.5 * grow, color: [1.4, 1.2, 0.8] };
    return { x: S.tx, z: S.tz, k: 3.0 * Math.exp(-P / 0.22), color: [1.9, 1.5, 0.8] };
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
  // ROGUE · Shadowstep: smoke where she stood as she goes (L: since the dash began, v1.111 render/moves.js), and as she
  // comes out behind the foe (S.hit: the sim's blow) smoke there, a crimson cross-cut and its crit on the foe
  shadowstep(S, rec, L, K, H, vx, vz) {
    if (L == null) return null;
    const T = S.air || 0, P = S.hit != null ? S.hit : L >= T + 0.25 ? L - T : null, p = P == null ? -1 : P;   // (P: s since she came out; never heard: as timed)
    const puffs = quadsOf(rec, 'p', 8), [cut, crit] = quadsOf(rec, 'q', 2), y = H(S.tx, S.tz);
    puffs.forEach((h, i) => { const at = i < 4 ? { x: S.fx, z: S.fz, t: L } : { x: S.tx, z: S.tz, t: p + 0.05 }, a = i * 1.57 + 0.4, t = at.t, d = 0.15 + 0.35 * smooth(t / 0.5);
      q(h, { frame: 'dust', index: Math.min(2, Math.max(0, Math.floor(t * 5))), x: at.x + Math.cos(a) * d, y: H(at.x, at.z) + 0.35 + 0.35 * t, z: at.z + Math.sin(a) * d, mode: 'billboard', scale: 2.6, r: 0.35, g: 0.32, b: 0.45, a: t > 0 ? 1 - smooth(t / 0.6) : 0 }); });
    q(cut, { frame: 'slashBig', index: Math.min(3, Math.max(0, Math.floor(p * 16))), x: S.tx + vx * 0.3, y: y + 0.8, z: S.tz + vz * 0.3, mode: 'billboard', scale: 1.1, rot: 0.6, ...col(CRIMSON, 1.3), a: p >= 0 && p < 0.28 ? 1 : 0, halo: 1 });
    q(crit, { frame: 'crit', index: Math.min(3, Math.max(0, Math.floor((p - 0.02) * 12))), x: S.tx + vx * 0.32, y: y + 1.0, z: S.tz + vz * 0.32, mode: 'billboard', scale: 2.4, ...col(CRIMSON, 1.4), a: p > 0.02 && p < 0.38 ? 1 : 0, halo: 1 });
    return p >= 0 ? { x: S.tx, z: S.tz, k: 1.5 * Math.exp(-p / 0.2), color: [1.8, 0.4, 0.5] } : null;
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

/** a level's (or a list's) content as a short key: FNV-1a over its JSON (an overland's in a few ms) */
function levelKey(o) {
  const t = JSON.stringify(o); let h = 0x811c9dc5, g = 0x01000193;
  for (let i = 0; i < t.length; i++) { const c = t.charCodeAt(i); h = Math.imul(h ^ c, 0x01000193); g = Math.imul(g ^ c, 0x85ebca6b) ^ (g >>> 13); }
  return `${t.length}.${(h >>> 0).toString(36)}.${(g >>> 0).toString(36)}`;
}

/** our art's list as a key: what stands where (a chest opened is another prop's canvas, an id of its own: hybrid.js) */
const envKeyOf = (list) => levelKey(list.map((q) => [q.id, q.x, q.z, q.prop || '', q.arch ? 1 : 0, q.tavern ? q.tavern.pieces.length : 0]));

/** the frame's API, for src/render3d/hybrid.js */
const api = {
  ready: false,
  /** build a level ahead, while this one plays (the one next door: hybrid.js), unless it's this one, set aside or already
   * being built @param {any} level @param {string} region */
  prepare(level, region = 'vale') {
    if (!game || loading) return false;
    const lv = normalizeLevel(level).level, key = `${region}|${levelKey(lv)}`;
    if (key === curKey || aside.has(key) || prep?.key === key) return false;
    dropPrep();
    try {
      const world = game.prepareWorld(lv, () => true);
      prep = { key, level: lv, world, steps: world.buildSteps({ paced: true }), wait: null, done: false, t0: performance.now() };
      setTimeout(prepPump, PREP_GAP);
    } catch (err) { console.warn('[luminati] building a level ahead:', err); prep = null; return false; }
    return true;
  },
  /** (for checks) Luminati's game */
  get game() { return game; },
  /** (for checks: the load times) Luminati's last level swap (ms), three.js's compiled programs and what's on the GPU */
  loadStats() {
    const R = game?.engine?.renderer;
    return { swap: game?.loadStats?.lastSwap ?? null, programs: R?.info?.programs?.length ?? 0, geometries: R?.info?.memory?.geometries ?? 0, textures: R?.info?.memory?.textures ?? 0, kept: aside.size, ahead: prep ? (prep.done ? 'ready' : 'building') : '', last: lastWay };
  },
  /** build a level (the sim's world, converted), then stand our art in it; resolves when it's drawn */
  async load(level, sprites = [], region = 'vale') {
    const id = ++levelId;
    if (region !== envRegion) { envRegion = region; envFrames.clear(); }
    const lv = normalizeLevel(level).level, key = `${region}|${levelKey(lv)}`, envKey = envKeyOf(sprites);
    loading = true;
    building = (async () => {
      let back = null;
      if (!game) { await boot(lv); lastWay = 'built'; }
      else {
        back = aside.get(key) || null; if (back) aside.delete(key);
        const ahead = !back && prep && prep.key === key ? prep : null; if (ahead) prep = null;
        const to = back ? back.kept.level : ahead ? ahead.level : lv;
        lastWay = back ? 'kept' : ahead ? 'ahead' : 'built';
        const { aside: left } = await game.swapLevel(to, { spawn: lv.spawn, keep: true, kept: back ? back.kept : null, prepared: ahead ? preparedOf(ahead) : null });
        if (left && curKey) {                                     // the level left, with our art in it, out of the scene
          for (const o of envSprites) game.engine.scene.remove(o);
          aside.set(curKey, { kept: left, env: envSprites, made: KIT_MADE, envKey: curEnvKey });
          envSprites = []; KIT_MADE = new Map();
          while (aside.size > ASIDE_MAX) { const [k, v] = aside.entries().next().value; aside.delete(k); game.disposeKept(v.kept); dropEnv(v.env, v.made); }
        }
      }
      curKey = key;
      if (id !== levelId) return;
      hidePlayer();
      inside = !!lv.environment?.interior;
      api.settings({ dof });
      skyFor(lv, region);
      if (back && back.envKey === envKey) {                       // its art as it was: stood back in
        dropEnv(envSprites, KIT_MADE);
        envSprites = back.env; KIT_MADE = back.made;
        for (const o of envSprites) { game.engine.scene.add(o); o.update?.(0, game.engine.camera); }
      } else {
        if (back) dropEnv(back.env, back.made);
        await placeEnv(sprites, region);
      }
      curEnvKey = envKey;
      if (inside && /b/.test(DLOOK)) { const r = applyHires(game.tileMap, game.engine?.renderer); globalThis.__dlook = r; }   // (a spike: ?dlook=b|bc, hires.js)
    })();
    try { await building; } finally { loading = false; }
    return id === levelId;
  },
  /** the menu's Graphics: the depth of field */
  settings(o = {}) {
    if (o.dof) dof = o.dof;
    if (typeof o.dlook === 'string') DLOOK = o.dlook;
    // the resolution (the menu's: settings.js). Luminati draws at the screen's density up to PIXEL_RATIO within a budget of
    // 2.1 million pixels (its resolution controller: 2.53× on a 390 × 844 phone), and steps its render scale down when the
    // GPU's timer says a frame is slow, which iOS never tells it (no timer queries: the owner's phone drew every frame at
    // the full budget, 22 fps in the square at dusk). Sharp: as that is, the controller free; balanced: at most 2× (on that
    // phone 63 % of the pixels), fast: at most 1.5× (35 %), by the engine's render scale, the controller held off so it
    // can't step back up (the canvas's CSS size is untouched: the overlay and taps agree)
    // (settings() runs again at every level built: Sharp leaves the engine's scale and controller as they are, touching
    // them only on the way back from a cap; forcing the scale to 1 at each level undid the controller's step down where it
    // can see the GPU, and CI's software GL ran a frame a second slower: the M3 check's fight timed out, run 412)
    if (o.res === 'sharp' || o.res === 'balanced' || o.res === 'fast') res = o.res;
    if (game?.engine && (res !== 'sharp' || resSet !== 'sharp')) {
      const E = game.engine, top = Math.min(globalThis.devicePixelRatio || 1, E.maxPixelRatio || PIXEL_RATIO), cap = res === 'fast' ? 1.5 : res === 'balanced' ? 2 : 0;
      if (game.resolution) game.resolution.manual = cap > 0;
      E.renderScale = cap > 0 ? Math.min(1, cap / top) : 1;
      resSet = res;
    }
    if (o.bright > 0) bright = o.bright;
    if (o.figLit > 0) FIG_LIT = o.figLit;
    if (o.carryUp > 0) CARRY_UP = o.carryUp;
    if (o.carryGain > 0) CARRY_GAIN = o.carryGain;
    if (o.figMax > 0) FIG_MAX = o.figMax;
    if (o.figures === 'models' || o.figures === 'sprites') FIGURES = o.figures;
    if (['chosen', 'doors', 'all', 'sprites'].includes(o.landmarks)) LANDMARKS = o.landmarks;   // (?landmarks=: our kit's pieces in 3D, placeEnv)   // (?figures=sprites: the atlases, as before 4b)
    const S = game?.postfx?.settings;
    // 'soft': the top and bottom 15 % of the screen soft, the rest sharp (the owner, 2026-11-13: "reduce the blur band to
    // be only the top 15% and bottom 15% of the screen"): Luminati's screen band alone (tilt-shift: sharp from 0.15 to 0.85
    // of the height, the blur building from nothing at the band's edge to tiltShift at the screen's), its blur by depth off
    // (a focus range wider than any view: before, 16 units in focus softened the far roofs and near hedges wherever they
    // stood on screen); 'off': everything sharp (none underground: the rooms below the one in view held their fires as
    // blurred orbs over the HUD)
    if (S?.dof) Object.assign(S.dof, { enabled: dof !== 'off' && !inside, focusRange: 1e4, tiltShift: 0.45, tiltCenter: 0.5, tiltWidth: 0.7, tiltFeather: 0.15 });
    if (o.quality === 'high' || o.quality === 'low') quality = o.quality;
    applyQuality();
  },
  /**
   * one frame: the camera, the hour, the weather, who's where, then a step of Luminati and its picture
   * @param {{ dt: number, focus: number[], ppu: number, hour: number, weather: string, fog?: number, hero: number[] | null,
   *   actors: { name: string, cw: number, col: number, row: number, x: number, z: number, fade: number, flash?: number, warn?: number, key?: number, air?: number, mv?: { clip: string, t: number, legs?: { clip: string, t: number } } }[],   (key: the same figure from frame to frame, its model's; air, mv: a Vault in flight, its height and pose: src/render/leap.js)
   *   rings?: { x: number, z: number, col: number[], a: number }[], hazards?: { x: number, z: number, r: number, col: number[], rim: number[], a: number }[], mark?: { x: number, z: number } | null, ambient?: { sky: number[], ground: number[], i: number, sun: number, lamps?: number } | null, carry?: number, draw?: boolean, bright?: number,
   *   bits?: { canvas: HTMLCanvasElement, ax: number, ay: number, x: number, z: number, lift: number, glow: number, flash?: number }[], water?: { id: string, cells: number[] } | null,
   *   blast?: { x: number, z: number, k: number } | null,
   *   spells?: { key: string, id: string, seed: number, age: number, land: number | null, x: number, z: number, tx: number, tz: number, r: number, k?: number, reached: { x: number, z: number }[] }[],
   *   warns?: { x: number, z: number, tx: number, tz: number, r: number, w: number, p: number, hit: number, heavy: boolean, lane: boolean }[],
   *   tells?: { kind: string, x: number, z: number, r: number, dx: number, dz: number, p: number, hit: number }[],
   *   puffs?: { kind: string, x: number, z: number }[] | null }} f
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
    const nk = { ring: 0, disc: 0, rim: 0, focus: 0, wfill: 0, wrim: 0, lane: 0, cone: 0, crim: 0 };
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
    // the Kingstone's tells (hybrid.js tellsOf, battle.js ringTells): its stamp's and the falling stones' circles, its
    // sweep's fan, each filling from nothing to its edge as it winds (p 0..1), white as it lands (hit: 1 → 0 after it)
    // (the Reach's: the Weighmaster's 'scales' a pan coming down over its circle, a brass ring inside the red; the Stoker's
    // 'vent' the floor glowing slag-orange, its heart hotter as it comes, not the Kingstone's red)
    let np = 0;
    for (const t of f.tells || []) {
      const e = 1 - (1 - t.p) * (1 - t.p), hot = t.hit > 0, col = hot ? WARN_HOT : WARN, out = hot ? t.hit : 1;
      if (t.kind === 'scales') {
        const m = panMesh(np++), lift = hot ? PAN_DROP * easeIn(clamp01((1 - t.hit - 0.35) / 0.65)) : PAN_DROP * (1 - easeIn(t.p));
        m.visible = true; m.position.set(t.x, game.tileMap.getHeight(t.x, t.z) + 0.02 + lift, t.z); m.scale.setScalar(t.r * 0.95); m.rotation.y = t.p * 0.6;
        m.material.emissiveIntensity = 0.12 + 0.25 * t.p + (hot ? 1.6 * t.hit * t.hit : 0);
        placeGround(groundMesh('wrim', nk.wrim++), t.x, t.z, t.r * 0.9, hot ? WARN_HOT : BRASS, (0.45 + 0.4 * t.p) * out);
      }
      if (t.kind === 'vent') {
        const beat = 0.85 + 0.15 * Math.sin(performance.now() * 0.012 + t.x * 3.1);
        placeGround(groundMesh('wrim', nk.wrim++), t.x, t.z, t.r * 1.08, WARN_INK, 0.5 * out);
        placeGround(groundMesh('wfill', nk.wfill++), t.x, t.z, t.r * e, hot ? WARN_HOT : SLAG, (0.28 + 0.36 * t.p) * beat * out);
        placeGround(groundMesh('wfill', nk.wfill++), t.x, t.z, t.r * 0.5 * e, hot ? WARN_HOT : SLAG_HOT, 0.35 * t.p * beat * out);
        placeGround(groundMesh('wrim', nk.wrim++), t.x, t.z, t.r, hot ? WARN_HOT : SLAG, (0.75 + 0.25 * t.p) * out);
        continue;
      }
      if (t.kind === 'sweep') {
        const yaw = Math.atan2(-t.dz, t.dx), pc = (m, r, a) => { placeGround(m, t.x, t.z, r, hot ? WARN_HOT : a === 0.5 ? WARN_INK : col, a * out); if (m.visible) m.rotation.z = yaw; };
        pc(groundMesh('cone', nk.cone++), t.r * 1.03, 0.5);
        pc(groundMesh('cone', nk.cone++), t.r * e, 0.22 + 0.32 * t.p);
        pc(groundMesh('crim', nk.crim++), t.r, 0.75 + 0.25 * t.p);
        for (const s of [-1, 1]) { const a = yaw + s * CONE_ARC / 2; placeLane(groundMesh('lane', nk.lane++), t.x, t.z, t.x + Math.cos(a) * t.r, t.z - Math.sin(a) * t.r, 1, 0.06, col, (0.7 + 0.3 * t.p) * out); }
      } else {
        placeGround(groundMesh('wrim', nk.wrim++), t.x, t.z, t.r * 1.08, WARN_INK, 0.5 * out);
        placeGround(groundMesh('wfill', nk.wfill++), t.x, t.z, t.r * e, col, (0.24 + 0.32 * t.p) * out);
        placeGround(groundMesh('wrim', nk.wrim++), t.x, t.z, t.r, col, (0.75 + 0.25 * t.p) * out);
      }
    }
    for (let i = np; i < panPool.length; i++) if (panPool[i].visible) panPool[i].visible = false;
    placePuffs(f.puffs);
    placeWater(f.water);
    placeGates(f.gates);
    for (const kind of Object.keys(groundPools)) for (let i = nk[kind]; i < groundPools[kind].length; i++) groundPools[kind][i].visible = false;
    // the hero's ember-wisp: one of Luminati's spell lights (never a lamp), taken again after each level is built
    if (carryLevel !== levelId) {
      const had = loaned();
      carryLevel = levelId; carryLight = game.world?.acquireSpellLight?.({ minor: false }) ?? null;
      const withWisp = loaned(); blastLight = game.world?.acquireSpellLight?.({ minor: false }) ?? null;
      const withBlast = loaned(); spellLight = game.world?.acquireSpellLight?.({ minor: false }) ?? null;
      wispSlots = [...withWisp].filter((sl) => !had.has(sl)).concat([...loaned()].filter((sl) => !withBlast.has(sl))); showWisps();
      for (const rec of spellLive.values()) if (SK) freeSpell(rec);
      spellLive.clear();
    }
    if (carryLight && f.hero) {
      const k = Math.max(0, Math.min(1, f.carry ?? 0)), hx = f.hero[0] + 0.35, hz = f.hero[1] + 0.35;
      // (above a model it hangs higher, and a little stronger, so the floor round the hero is as lit: at 2.4 it was a hand
      // over the helmet, and a model's head, facing it, went white)
      // (the owner, 2026-11-10: "at dusk, and perhaps night - the shining light on the characters is too bright - it washes
      // out the center character": at 3.6 a hand over the head, 48 % of the knight's pixels went white at night. Hung higher,
      // its falloff flatter across the party: the ground round them lit as before, a head under it far less)
      const up = FIGURES === 'models' ? CARRY_UP : 2.4, gain = FIGURES === 'models' ? CARRY_GAIN : 1;
      carryLight.set(hx, game.tileMap.getHeight(f.hero[0], f.hero[1]) + up, hz, { color: [1.9, 1.15, 0.42], intensity: (4.5 * gain * k) / (f.ambient?.lamps ?? 1), distance: FIGURES === 'models' ? Math.hypot(6.2, up) : 6 + (up - 2.4), decay: 1.4, flicker: 0 });   // (steady: hung a hand over the figures, a flicker of 0.12 made them pulse while the floor held still, the owner, 2026-11-11: "Player and npc characters flicker in the dungeon not overland"; the torches round the walls flicker for it)   // (a glow round the hero, not a floodlight: 16 washed the figure out)
    }
    // a fire landing (renderer.js blasts: the Firebolt's explosion, a mage's bolt): a hot flash on the room round it, gone
    // in half a second; one of Luminati's spell lights, as the carry light is
    if (blastLight) {
      const b = f.blast;
      if (b && b.k > 0.01) blastLight.set(b.x, game.tileMap.getHeight(b.x, b.z) + 1.6, b.z, { color: [2.0, 0.95, 0.32], intensity: 9 * b.k / (f.ambient?.lamps ?? 1), distance: 7, decay: 1.6, flicker: 0.25 });
      else blastLight.off();
    }
    placeSpells(f.spells || [], f.dt || 0, f.ambient?.lamps, !!(f.rings && f.rings.length));
    // underground, the lights' flicker held to CALM_FLICKER (the owner, 2026-11-11: "Player and npc characters flicker in
    // the dungeon not overland. Probably due to torch lighting effect"): Luminati's wall torch swings its light ±38 %
    // (flicker 0.45) 2.6 times a second, and a figure by a wall, close to it, took the whole swing while the floor beyond
    // hardly moved. The flames still dance; their light steadies. Each frame, as the pool hands its lights on (LightPool
    // sets a light's flicker from the torch it's given).
    if (inside) for (const h of game.lighting?._pointLights || []) if (h.flicker > CALM_FLICKER) h.flicker = CALM_FLICKER;
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
    for (const s of envSprites) s.update?.(0, camera);
    setLight(f.light);
    game.engine.step(Math.max(0, Math.min(0.1, f.dt)), { render: f.draw !== false });   // (draw false: stepped, not drawn: tools/capture/rig.mjs settling)
  },
  /** stand the converter's art again (a chest opened, a shrine used: hybrid.js), the level kept */
  sprites(list) { if (game) { curEnvKey = envKeyOf(list); placeEnv(list, envRegion); } },
  /** (for checks) a world point on the screen, CSS px, through this camera */
  project(x, y, z) {
    if (!game) return null;
    const v = new THREE.Vector3(x, y, z).project(game.engine.camera);
    return [((v.x + 1) / 2) * innerWidth, ((1 - v.y) / 2) * innerHeight];
  },
  /** (for checks: docs/level-design-rules.md §5, the browser suite's visibility check) whether each point of Luminati's
   * is hidden from the camera by the world: a ray from the point toward the camera, against what's drawn and could hide
   * someone (houses, walls, trees, rocks, kit pieces, the cards of the world), not the people, the beasts, the ground's
   * rings or the effects. A card's hit near its edges is let through (a card's corners are clear). Returns, for each point,
   * the hiding piece's name, or null where it's in view. @param {[number, number, number][]} pts */
  occluded(pts) {
    if (!game) return pts.map(() => null);
    const cam = game.engine.camera, skip = new Set(), list = [];
    for (const f of figs.values()) skip.add(f.root);
    for (const p of pools.values()) for (const q of p) skip.add(q);
    for (const q of beastPool) if (q) skip.add(q);
    for (const k of Object.keys(groundPools)) for (const m of groundPools[k]) skip.add(m);
    const walk = (o) => {
      if (skip.has(o) || !o.visible) return;
      if (o.parent && o.parent.shadowProxy === o) return;
      const m = o.material, mm = Array.isArray(m) ? m[0] : m;
      if ((o.isMesh || o.isInstancedMesh) && !o.isPoints && mm && mm.colorWrite !== false && mm.depthWrite !== false && !(mm.transparent && mm.opacity < 0.5)) list.push(o);
      for (const c of o.children) walk(c);
    };
    walk(game.engine.scene);
    const ray = OCC_RAY, at = new THREE.Vector3(), to = new THREE.Vector3(), dir = new THREE.Vector3();
    ray.camera = cam;
    return pts.map(([x, y, z]) => {
      at.set(x, y, z);
      if (cam.isOrthographicCamera) { cam.getWorldDirection(dir).multiplyScalar(-1); ray.far = 400; }
      else { cam.getWorldPosition(to); dir.copy(to).sub(at); ray.far = dir.length(); dir.normalize(); }
      ray.set(at.clone().addScaledVector(dir, 0.05), dir);
      for (const h of ray.intersectObjects(list, false)) {
        if (h.object.name === 'Sprite3D.mesh') {   // a card: solid only where its own pixel is (as it's drawn: alphaTest 0.5)
          const a = cardAlpha(h.object.material, h.uv);
          if (a === null ? (h.uv && (h.uv.x < 0.15 || h.uv.x > 0.85 || h.uv.y > 0.92)) : a < 128) continue;   // (unreadable: the old margin)
          return h.object.parent?.name || 'card';
        }
        return h.object.name || h.object.parent?.name || h.object.type;
      }
      return null;
    });
  },
  /** (for checks) the ground's height at a point of Luminati's, as its figures stand on it (a stair's step, a bridge's deck) */
  ground(x, z) { return game?.tileMap ? game.tileMap.getHeight(x, z) : null; },
  get stats() {
    const shown = (k) => groundPools[k].filter((m) => m.visible).length;
    return { bits: [...pools.entries()].filter(([sh]) => sh.name === 'ember-bit').reduce((n, [, p]) => n + p.filter((s) => s.visible).length, 0), water: WATER.mesh && WATER.mesh.visible ? WATER.mesh.count : 0, fig: figGlow, lit: Math.round(figLit * 100) / 100, beasts: beastPool.filter((s) => s?.visible).length, light: light.on ? 1 : 0, lightDepth: light.on && light.keyed && game?.postfx?.depthTexture ? 1 : 0, rings: shown('ring'), hazards: shown('disc'), warns: shown('wrim'), lanes: shown('lane'), pans: panPool.filter((m) => m.visible).length, spells: spellLive.size, dome: SK && SK.domeOf ? 1 : 0, blades: SK ? SK.blades.count - (SK.warmN > 0 ? 2 : 0) : 0, crystals: SK ? SK.crystals.count - (SK.warmN > 0 ? 1 : 0) : 0, frost: SK ? SK.frost.count - (SK.warmN > 0 ? 1 : 0) : 0, spellLight: spellLight && SK ? 1 : 0, focus: shown('focus'), carry: carryLight ? 1 : 0, level: levelId, actors: [...pools.values()].reduce((n, p) => n + p.filter((s) => s.visible).length, 0) + [...figs.values()].filter((q) => q.root.visible).length, models: [...figs.values()].filter((q) => q.root.visible).length, modelNames: [...new Set([...figs.values()].filter((q) => q.root.visible).map((q) => q.name))], figErr, figFailed: [...templates.values()].filter((t) => t === false).length, pr: game?.engine?.pixelRatio ?? null, dpr: devicePixelRatio || 1, modelMeshes: [...templates.values()].filter(Boolean).map((t) => t.meshes.after).reduce((a, b) => a + b, 0), modelMeshesBefore: [...templates.values()].filter(Boolean).map((t) => t.meshes.before).reduce((a, b) => a + b, 0), figures: FIGURES, atlases: atlases.size, env: envSprites.length, sky: skyShown, ours: envSprites.filter((q) => q.name.startsWith('ember:prop:')).length,
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

// ── a figure on its own: the windows' live preview (docs/character-look-plan.md §5; GDD §6.1 v1.64, creation) ──────
// The same model as in play, built the same way (figure.js, cast.json, the models' versions), in a small canvas with its
// own WebGL context: the actor idling, one of its attacks every few seconds or on a tap, a drag to turn it. It draws
// only while it's shown and there's something to move, and lets go of its context and models when closed. A world
// needn't be up: it reads the same assets/ (the first of createWorld's and this one's `assets` to arrive).
/**
 * @param {HTMLCanvasElement} canvas  @param {{ assets: string, onError?: (e: any) => void, yaw?: number }} o  yaw: the turn it opens at (the gear sheet's back views)
 * @returns {{ show: (actor: string, look?: any, o?: { bare?: boolean, close?: boolean, gear?: any }) => Promise<boolean>, attack: () => void, close: () => void, readonly actor: string }}
 */
export function createPreview(canvas, o) {
  if (!ASSETS) ASSETS = o.assets;
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(3, devicePixelRatio || 1)); renderer.outputColorSpace = THREE.SRGBColorSpace;   // (a small canvas: the phone's own 3x, or the painted face blurs)
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.05;
  const scene = new THREE.Scene(), cam = new THREE.PerspectiveCamera(26, 1, 0.05, 100), turn = new THREE.Group();
  scene.add(turn);
  scene.add(new THREE.HemisphereLight(0xfff0dc, 0x2a2036, 1.35));                    // (the creation stage's dusk: warm from above, violet below)
  const key = new THREE.DirectionalLight(0xffd29a, 2.4); key.position.set(2.2, 4, 3.2); scene.add(key);
  const rim = new THREE.DirectionalLight(0x9db0ff, 1.1); rim.position.set(-3, 2.5, -2.5); scene.add(rim);
  // the camera's framing, eased toward its aim: the whole figure, or (close) head and shoulders while a face is chosen
  const camAt = { y: 0, d: 0, ly: 0 }, camTo = { y: 0, d: 0, ly: 0 }; let close = false, easing = false;
  const aim = (snap) => {
    if (!cur) return; const h = cur.h, t = Math.tan((cam.fov * Math.PI) / 360);
    if (close) { camTo.ly = h * 0.76; camTo.y = h * 0.8; camTo.d = (h * 0.3) / t; }   // (the top half of the figure, in a 0.6 h window: the head fills a third of the canvas)
    else { camTo.ly = h * 0.47; camTo.y = h * 0.62; camTo.d = (h * 0.62) / t; }    // (the figure about four fifths of the canvas's height)
    if (snap) Object.assign(camAt, camTo); easing = true;
  };
  const place = () => { cam.position.set(0, camAt.y, camAt.d); cam.lookAt(0, camAt.ly, 0); };
  let cur = null, name = '', wantN = 0, yaw = o.yaw ?? 0.42, spin = 0, drag = null, raf = 0, dead = false, last = 0, clock = 0, act = null, nextAct = 4;
  // sized to its box in CSS px; never from canvas.width, its buffer already × the pixel ratio: a canvas taken out of the page
  // (the sheet's tabs re-render it away: Gear → Skills) has no box, and sizing it from its buffer tripled it each time, 750
  // → 2250 → 6750 px a side, gigabytes with antialiasing (the owner, 2026-11-17: "the game keeps crashing after i click the
  // skills tab"). Out of the page, or not laid out yet, it's left as it is until it has a box again.
  const size = () => { const w = canvas.clientWidth, h = canvas.clientHeight; if (!w || !h) return; renderer.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix(); };
  const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(size) : null; ro?.observe(canvas); size();
  const clipOf = (k) => cur && cur.def.clips && cur.def.clips[k];
  let cw = -1, ch = -1;
  function frame(now) {
    raf = 0; if (dead || !cur) return;
    if (canvas.clientWidth && canvas.clientHeight && (canvas.clientWidth !== cw || canvas.clientHeight !== ch)) { cw = canvas.clientWidth; ch = canvas.clientHeight; size(); }   // (moved into a box, or made before it was in one: framed to the box it's in)
    const dt = Math.min(0.1, last ? (now - last) / 1000 : 0); last = now; clock += dt;
    if (!drag) { yaw += spin * dt; spin *= Math.max(0, 1 - 3 * dt); }
    turn.rotation.y = yaw;
    if (easing) { const k = 1 - Math.exp(-7 * dt); let far = 0; for (const q of ['y', 'd', 'ly']) { camAt[q] += (camTo[q] - camAt[q]) * k; far = Math.max(far, Math.abs(camTo[q] - camAt[q])); } if (far < 1e-4) { Object.assign(camAt, camTo); easing = false; } place(); }
    if (!act && clock >= nextAct) act = { k: clock % 2 < 1 ? 'attack' : 'attack2', t: 0 };
    const idle = clipOf('idle'), c = cur.fig;
    if (act) {
      const A = clipOf(act.k) || clipOf('attack'), clip = A && c.clips.find((q) => q.name === A.clip);
      act.t += dt;
      if (!clip || act.t >= clip.duration * (A.to || 1)) { act = null; nextAct = clock + 5 + (clock % 3); }
      else poseFigure(c, A.clip, act.t / clip.duration, true);
    }
    if (!act) { const clip = c.clips.find((q) => q.name === (idle ? idle.clip : 'Idle')) || c.clips[0]; poseFigure(c, clip.name, (clock % clip.duration) / clip.duration, true); }
    for (const m of cur.shine) m.emissiveIntensity = m.userData.shine * (0.75 + 0.25 * Math.sin(now * 0.0026));
    renderer.render(scene, cam);
    if (!document.hidden && canvas.isConnected) raf = requestAnimationFrame(frame);
  }
  const wake = () => { if (!raf && !dead && cur) { last = 0; raf = requestAnimationFrame(frame); } };
  document.addEventListener('visibilitychange', wake);
  // a drag turns them; a tap plays an attack
  const down = (e) => { drag = { x: e.clientX, y0: yaw, moved: 0, t: performance.now() }; canvas.setPointerCapture?.(e.pointerId); };
  const move = (e) => { if (!drag) return; const dx = e.clientX - drag.x; drag.moved = Math.max(drag.moved, Math.abs(dx)); const ny = drag.y0 + dx * 0.012; spin = (ny - yaw) * 30; yaw = ny; wake(); };
  const up = () => { if (!drag) return; if (drag.moved < 6) api.attack(); drag = null; wake(); };
  canvas.addEventListener('pointerdown', down); canvas.addEventListener('pointermove', move); canvas.addEventListener('pointerup', up); canvas.addEventListener('pointercancel', up);
  const api = {
    get actor() { return name; },
    /** stand this actor: true once it's built (false: no model for it, the caller keeps its still) */
    async show(actor, look = null, o2 = {}) {
      const id = `${actor}#${look ? JSON.stringify(look) : ''}#${o2.bare ? 'bare' : ''}#${o2.gear ? JSON.stringify(o2.gear) : ''}`;
      if (!!o2.close !== close) { close = !!o2.close; aim(false); wake(); }   // (a new framing alone: eased to, nothing rebuilt)
      if (id === name && cur) return true;
      const n = ++wantN; name = id;
      const c = await json(`${ASSETS}models/cast.json`); if (c && !cast) cast = c;
      const def = c && c.actors[actor]; if (!def || dead || n !== wantN) return false;
      try {
        // (bare: the helm or hat off, while a face is being chosen: GDD v1.65)
        const v = withLook(def.v, { appearance: look, gear: o2.gear || null, bare: !!o2.bare });
        if (o2.bare && v.gear) v.gear = { ...v.gear, helm: null };
        const fig = await buildFigure(v, { far: false, load: loadModel, faces: async () => cast.faces });
        if (dead || n !== wantN) return false;
        // matte, as in play (figureFor): KayKit's sheen on a dark skin caught every curve of the face as a pale blotch
        fig.root.traverse((q) => { if (q.isMesh && q.material && q.material.isMeshStandardMaterial) { q.material.metalness = 0; q.material.roughness = Math.max(q.material.roughness ?? 1, 0.92); } });
        poseFigure(fig, 'Idle', 0, true);
        const box = new THREE.Box3(); fig.root.updateMatrixWorld(true); fig.root.traverse((q) => { if (q.isMesh && q.visible) box.expandByObject(q); });
        const L = fig.look || { w: 1, h: 1 }, h0 = box.max.y - box.min.y, cx = (box.min.x + box.max.x) / 2, cz = (box.min.z + box.max.z) / 2;
        const pin = new THREE.Group(); pin.add(fig.root); fig.root.position.set(-cx, -box.min.y, -cz); pin.scale.set(L.w, L.h, L.w);   // (a build's girth, a height's stature: framed for the average, so a tall one stands taller)
        const h = h0 * 1.06;
        if (cur) turn.remove(cur.pin);
        const shine = []; fig.root.traverse((q) => { if (q.isMesh && q.material && q.material.userData && q.material.userData.shine) shine.push(q.material); });
        const first = !cur; turn.add(pin); cur = { fig, def, pin, shine, h };
        aim(first); place();
        clock = 0; act = null; nextAct = 3; wake();
        return true;
      } catch (e) { o.onError?.(e); return false; }
    },
    attack() { if (cur && !act) { act = { k: 'attack', t: 0 }; wake(); } },
    close() {
      dead = true; if (raf) cancelAnimationFrame(raf); raf = 0; ro?.disconnect(); document.removeEventListener('visibilitychange', wake);
      canvas.removeEventListener('pointerdown', down); canvas.removeEventListener('pointermove', move); canvas.removeEventListener('pointerup', up); canvas.removeEventListener('pointercancel', up);
      if (cur) turn.remove(cur.pin); cur = null; renderer.dispose(); renderer.forceContextLoss();
    },
  };
  // (nothing of the figure is disposed: its geometry, textures and materials may be the world's too, the models shared;
  // the context going takes this canvas's copies of them with it)
  canvas.addEventListener('webglcontextlost', (e) => { e.preventDefault(); if (!dead) o.onError?.(new Error('preview: the WebGL context was lost')); });   // (close() lets it go on purpose: no error then)
  return api;
}

// ── a member's portrait (the party cards, the sheet's tabs: GDD v1.65, the owner: "do the party card portraits next"):
// their own face, as the bake renders <actor>.face.png (tools/actor-lab/lab.js renderPortrait: the same three lights, the
// three-quarter turn, the frame fixed to the head bone, supersampled and area-averaged, a light grade, the 1 px ink line),
// from the same build as their figure in play: their look and what they wear on head and body. One small offscreen
// renderer for every portrait, made at the first and kept (a portrait is drawn again only when the look changes).
const PORT_W = 96, PORT_H = 112, PORT_SS = 3, PORT_INK = [8, 5, 14];
let portR = null;
// (its own WebGL context, a third beside the world's and a window's live figure: on a phone each holds its own copy of
// every model and picture it drew. Let go a few seconds after the last portrait, so it holds nothing while you play;
// the owner, 2026-11-17: "the game will crash and relaunch ... when in a map transition and im looking at inventory")
let portTimer = 0;
function portIdle() { clearTimeout(portTimer); portTimer = setTimeout(() => { if (!portR) return; portR.dispose(); portR.forceContextLoss(); portR = null; }, 4000); }
/** @param {string} actor @param {any} look { appearance, gear } @param {{ assets?: string }} [o] @returns {Promise<HTMLCanvasElement|null>} */
export async function renderPortrait(actor, look = null, o = {}) {
  if (!ASSETS && o.assets) ASSETS = o.assets;
  const c = await json(`${ASSETS}models/cast.json`); if (c && !cast) cast = c;
  const def = c && c.actors[actor]; if (!def) return null;
  const fig = await buildFigure(withLook(def.v, look), { far: false, load: loadModel, faces: async () => cast.faces });
  fig.root.traverse((q) => { if (q.isMesh && q.material && q.material.isMeshStandardMaterial) { q.material = q.material.clone(); q.material.metalness = 0; q.material.roughness = Math.max(q.material.roughness ?? 1, 0.92); } });
  poseFigure(fig, 'Idle', 0, true);
  const L = fig.look; if (L) fig.root.scale.set(L.w, L.h, L.w);
  fig.root.rotation.y = THREE.MathUtils.degToRad(22); fig.root.updateMatrixWorld(true);
  const head = findNode(fig.root, 'head'); if (!head) return null;
  const top = head.localToWorld(new THREE.Vector3(0, 1.08, 0)), chin = head.localToWorld(new THREE.Vector3(0, 0, 0.1));
  const hh = top.y - chin.y, span = hh / 0.6, cy = top.y + hh * 0.1 - span / 2, cx = (top.x + chin.x) / 2, pitch = THREE.MathUtils.degToRad(8);
  const cam = new THREE.OrthographicCamera(-(span * PORT_W / PORT_H) / 2, (span * PORT_W / PORT_H) / 2, span / 2, -span / 2, 0.1, 100);
  cam.position.set(cx, cy + 20 * Math.sin(pitch), 20 * Math.cos(pitch)); cam.lookAt(cx, cy, 0); cam.updateMatrixWorld(true);
  const s = new THREE.Scene(); s.add(fig.root);
  s.add(new THREE.HemisphereLight(0xb8a8d8, 0x2a2030, 1.25));
  const key = new THREE.DirectionalLight(0xffd4a8, 2.3); key.position.set(-1.6, 1.8, 2.4); s.add(key);
  const fill = new THREE.DirectionalLight(0x8fa4ff, 0.55); fill.position.set(2.2, 0.4, 1.2); s.add(fill);
  const rim = new THREE.DirectionalLight(0xc0a0ff, 1.6); rim.position.set(1.5, 2.2, -2.6); s.add(rim);
  if (!portR) { portR = new THREE.WebGLRenderer({ alpha: true, antialias: false, preserveDrawingBuffer: true }); portR.outputColorSpace = THREE.SRGBColorSpace; portR.toneMapping = THREE.ACESFilmicToneMapping; portR.toneMappingExposure = 1; }
  const BW = PORT_W * PORT_SS, BH = PORT_H * PORT_SS; portR.setPixelRatio(1); portR.setSize(BW, BH, false); portR.setClearColor(0, 0);
  portR.render(s, cam); portIdle();
  const big = document.createElement('canvas'); big.width = BW; big.height = BH; const bx = big.getContext('2d', { willReadFrequently: true }); bx.drawImage(portR.domElement, 0, 0);
  const b = bx.getImageData(0, 0, BW, BH).data, d = new Uint8ClampedArray(PORT_W * PORT_H * 4), SS = PORT_SS;
  for (let y = 0; y < PORT_H; y++) for (let x = 0; x < PORT_W; x++) {
    let n = 0, r = 0, g = 0, bl = 0;
    for (let sy = 0; sy < SS; sy++) for (let sx = 0; sx < SS; sx++) { const i = ((y * SS + sy) * BW + x * SS + sx) * 4; if (b[i + 3] < 128) continue; n++; r += b[i] * b[i]; g += b[i + 1] * b[i + 1]; bl += b[i + 2] * b[i + 2]; }
    if (n * 2 < SS * SS) continue;
    const j = (y * PORT_W + x) * 4; d[j] = Math.sqrt(r / n); d[j + 1] = Math.sqrt(g / n); d[j + 2] = Math.sqrt(bl / n); d[j + 3] = 255;
  }
  for (let i = 0; i < d.length; i += 4) { if (!d[i + 3]) continue;   // (the bake's grade for a portrait: a little desaturated, a gentle contrast)
    const r = d[i], g = d[i + 1], bl = d[i + 2], Lm = 0.3 * r + 0.59 * g + 0.11 * bl, k = (v) => Math.max(0, Math.min(255, 128 + (v - 128) * 1.08));
    d[i] = k(r + (Lm - r) * 0.14) * 0.9; d[i + 1] = k(g + (Lm - g) * 0.14) * 0.91; d[i + 2] = k(bl + (Lm - bl) * 0.14) * 0.98; }
  const ink = new Uint8ClampedArray(d), solid = (x, y) => x >= 0 && y >= 0 && x < PORT_W && y < PORT_H && d[(y * PORT_W + x) * 4 + 3] > 0;
  for (let y = 0; y < PORT_H; y++) for (let x = 0; x < PORT_W; x++) { const i = (y * PORT_W + x) * 4;
    if (!d[i + 3] && y < PORT_H - 1 && (solid(x + 1, y) || solid(x - 1, y) || solid(x, y + 1) || solid(x, y - 1))) { ink[i] = PORT_INK[0]; ink[i + 1] = PORT_INK[1]; ink[i + 2] = PORT_INK[2]; ink[i + 3] = 255; } }
  const cv = document.createElement('canvas'); cv.width = PORT_W; cv.height = PORT_H; cv.getContext('2d').putImageData(new ImageData(ink, PORT_W, PORT_H), 0, 0);
  return cv;
}
