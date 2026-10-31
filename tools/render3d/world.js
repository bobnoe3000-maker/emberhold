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
import { setFogStart } from '../src/game/AtmosphereFog.js';
import './ground.js';

let ASSETS = '';                                              // (the game's assets/: createWorld's `assets`)
const FOV = 1;                                                // (degrees: near enough orthographic, see above)
const NATIVE_PER_UNIT = 16 * Math.SQRT2;                      // Emberlit's native px a unit: a tile's half-width 8 px, two tiles a unit
const SPRITE_OPTS = { billboard: 'spherical', normalUp: 0.6, wrap: 0.6, roundness: 0.35, emissive: '#ffe9d2', emissiveIntensity: 0.12 };

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
const groundMat = () => new THREE.MeshBasicMaterial({ transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2, toneMapped: false });
const groundPools = { ring: [], disc: [], rim: [] };
function groundMesh(kind, n) {
  const p = groundPools[kind];
  while (p.length <= n) { const m = new THREE.Mesh(kind === 'ring' ? RING_GEO : kind === 'disc' ? DISC_GEO : RIM_GEO, groundMat()); m.rotation.x = -Math.PI / 2; m.renderOrder = 2; m.visible = false; game.engine.scene.add(m); p.push(m); }
  return p[n];
}
function placeGround(m, x, z, r, col, a) {
  m.visible = a > 0.01; if (!m.visible) return;
  m.position.set(x, game.tileMap.getHeight(x, z) + 0.03, z); m.scale.setScalar(r);
  m.material.color.setRGB(col[0] / 255, col[1] / 255, col[2] / 255, THREE.SRGBColorSpace); m.material.opacity = a;
}
let carryLight = null, carryLevel = -1;

/** the frame's API, for src/render3d/hybrid.js */
const api = {
  ready: false,
  /** build a level (the sim's world, converted), then stand our art in it; resolves when it's drawn */
  async load(level, sprites = [], region = 'vale') {
    const id = ++levelId;
    const lv = normalizeLevel(level).level;
    building = (async () => {
      if (!game) await boot(lv);
      else await game.swapLevel(lv, { spawn: lv.spawn });
      if (id !== levelId) return;
      hidePlayer();
      api.settings({ dof });
      await placeEnv(sprites, region);
    })();
    await building;
    return id === levelId;
  },
  /** the menu's Graphics: the depth of field */
  settings(o = {}) {
    if (o.dof) dof = o.dof;
    const S = game?.postfx?.settings;
    // 'soft': the prototype's eased lens (its view.js): a band most of the screen tall, 16 units of depth in focus, so the
    // square is sharp and the far roofs and the near hedges a little soft; 'off': everything sharp
    if (S?.dof) Object.assign(S.dof, { enabled: dof !== 'off', focusRange: 16, tiltShift: 0.14, tiltWidth: 0.62 });
  },
  /**
   * one frame: the camera, the hour, the weather, who's where, then a step of Luminati and its picture
   * @param {{ dt: number, focus: number[], ppu: number, hour: number, weather: string, hero: number[] | null,
   *   actors: { name: string, cw: number, col: number, row: number, x: number, z: number, fade: number, flash?: number }[],
   *   rings?: { x: number, z: number, col: number[], a: number }[], hazards?: { x: number, z: number, r: number, col: number[], rim: number[], a: number }[], carry?: number }} f
   */
  frame(f) {
    if (!game || !game.engine) return;
    cam.x = f.focus[0]; cam.y = f.focus[1]; cam.z = f.focus[2]; cam.ppu = f.ppu;
    if (Number.isFinite(f.hour) && Math.abs((game.lighting?.timeOfDay ?? -1) - f.hour) > 0.004) game.setTime(f.hour);
    if (f.weather && game.weather?.weather !== f.weather) game.setWeather(f.weather);
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
    const nk = { ring: 0, disc: 0, rim: 0 };
    for (const r of f.rings || []) placeGround(groundMesh('ring', nk.ring++), r.x, r.z, 1, r.col, r.a);
    for (const h of f.hazards || []) { placeGround(groundMesh('disc', nk.disc++), h.x, h.z, h.r, h.col, 0.82 * h.a); placeGround(groundMesh('rim', nk.rim++), h.x, h.z, h.r, h.rim, 0.42 * h.a); }
    for (const kind of Object.keys(groundPools)) for (let i = nk[kind]; i < groundPools[kind].length; i++) groundPools[kind][i].visible = false;
    // the hero's ember-wisp: one of Luminati's spell lights (never a lamp), taken again after each level is built
    if (carryLevel !== levelId) { carryLevel = levelId; carryLight = game.world?.acquireSpellLight?.({ minor: false }) ?? null; }
    if (carryLight && f.hero) {
      const k = Math.max(0, Math.min(1, f.carry ?? 0)), hx = f.hero[0] + 0.35, hz = f.hero[1] + 0.35;
      carryLight.set(hx, game.tileMap.getHeight(f.hero[0], f.hero[1]) + 2.4, hz, { color: [1.9, 1.15, 0.42], intensity: 4.5 * k, distance: 6, decay: 1.4, flicker: 0.12 });   // (a glow round the hero, not a floodlight: 16 washed the figure out)
    }
    game.engine.step(Math.max(0, Math.min(0.1, f.dt)));
  },
  /** (for checks) a world point on the screen, CSS px, through this camera */
  project(x, y, z) {
    if (!game) return null;
    const v = new THREE.Vector3(x, y, z).project(game.engine.camera);
    return [((v.x + 1) / 2) * innerWidth, ((1 - v.y) / 2) * innerHeight];
  },
  get stats() {
    const shown = (k) => groundPools[k].filter((m) => m.visible).length;
    return { rings: shown('ring'), hazards: shown('disc'), carry: carryLight ? 1 : 0, level: levelId, actors: [...pools.values()].reduce((n, p) => n + p.filter((s) => s.visible).length, 0), atlases: atlases.size, env: envSprites.length,
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
