// sheets.js — Emberfall's own people in Luminati's world (docs/lumina-prototype.md). Luminati paints every character at
// runtime (CharacterSprites.js createCharacterSheet: 32 × 32 frames, four directions). The prototype's build (tools/lumina/
// vite.config.mjs) points every import of that module here instead, so the player, the party, the villagers and anyone a
// story brings on are drawn from Emberfall's baked actor atlases, as they are, from the game's own assets/actors/: no copy,
// no re-bake. Everything else of Luminati's module passes through untouched (the presets, the creature sheets). Of the
// monsters, the humanoid ones (goblin, archer, shaman) are Emberfall's hill goblins; the rest keep Luminati's look.
//
// An atlas (tools/actor-lab/bake.cjs) is a row a screen octant (0 E, 1 SE, 2 S, 3 SW, 4 W, 5 NW, 6 N, 7 NE) and a column a
// frame, its clips named in its JSON. The sheet made here keeps all eight rows and, of the columns, the clips Luminati
// plays: idle, walk (run is the walk, quicker), and the attack, the hit and the death for the combat and festival poses
// it asks for by name. Luminati's Sprite3D knows four directions (down, left, right, up), and its animations name those
// four rows; view.js draws the octant row of the sprite's heading within that quarter (`emberOctants`).
//
// The atlases are big (a hero's is 7392 × 816): only their JSON is fetched at boot (a few hundred bytes each, every one the
// prototype might use); a sheet's image loads when it's first asked for and is cut into a small canvas of its own. Sprite3D
// clones a sheet's texture a sprite (each its own frame offset) and a clone is uploaded only when its own version moves,
// so the sheet keeps its clones and marks each one updated when the pixels come in.

import * as THREE from 'three';
import * as LUMINATI from '../src/engine/pixel/CharacterSprites.js';
import { ACTOR_NAMES, ACTOR_FACES } from './actors.js';
import './view.js';                                           // (the camera, and the eight facings: before any sprite is made)
import './ground.js';                                         // (the ground cover's size and the motes: before the world is built)

export * from '../src/engine/pixel/CharacterSprites.js';

/** where Emberfall's baked actors are, from the built prototype's pages (lumina/ beside assets/) */
const ACTORS = new URL('../assets/actors/', document.baseURI).href;
/** native pixels a world unit: a 56-px figure stands 1.75 units, a touch taller than Luminati's own (28 px at 16) */
export const EMBER_PPU = 32;

// who Luminati's presets are, in Emberfall's cast (content/npcs/: the innkeepers, the merchants, the priests, the
// wardens …); a villager is one of the townsfolk, picked by the villager's own seed and name
const CAST = {
  innkeeper: ['npc_maudry', 'npc_dace', 'npc_nell'],
  merchant: ['npc_wendel', 'npc_pim', 'npc_hedda'],
  cleric: ['npc_ilse', 'npc_orla', 'npc_agnes'],
  guard: ['npc_jory', 'npc_osric'],
  swordsman: ['hero_brannoc', 'hero_barbarian'],
  scholar: ['npc_kindler', 'npc_agnes'],
  hunter: ['hero_wren', 'hero_rogue_bow'],
  farmer: ['npc_ned', 'npc_hedda', 'npc_tobin'],
  elder: ['npc_osric', 'npc_agnes', 'npc_hester'],
  child: ['npc_col'],
  dancer: ['npc_nell', 'npc_villager_2'],
  bard: ['npc_col', 'npc_villager_3'],
  traveler: ['npc_villager_1', 'npc_tobin'],
  villager: ['npc_villager_1', 'npc_villager_2', 'npc_villager_3', 'npc_villager_4', 'npc_hester', 'npc_tobin', 'npc_bess', 'npc_ned'],
  // Luminati's humanoid foes (MonsterSprites.js HUMANOID_SPECS) in Emberfall's hill goblins
  goblin: ['goblin_skirmisher'], archer: ['goblin_archer'], shaman: ['goblin_hexer'],
};
// the party's classes (party/PartyMember.js memberSpec presets) in Emberfall's heroes
const PARTY = { swordsman: 'hero_barbarian', guard: 'hero_brannoc', cleric: 'hero_cleric', scholar: 'hero_mage', hunter: 'hero_rogue_bow', bard: 'hero_shaman', traveler: 'hero_rogue' };
export const HEROES = ['hero_knight', 'hero_barbarian', 'hero_rogue', 'hero_mage', 'hero_cleric', 'hero_shaman', 'hero_wren', 'hero_brannoc'];
const params = new URLSearchParams(location.search);
/** the player's look: ?hero=…, Emberfall's knight by default */
export const HERO = HEROES.includes(/** @type {string} */ (params.get('hero'))) ? /** @type {string} */ (params.get('hero')) : 'hero_knight';

// every actor baked (actors.js, the build's list of assets/actors/): a level names any of them by its look
// (Emberfall's levels, tools/lumina/levels.mjs: spec.emberActor)
const ALL = [...new Set([...HEROES, ...Object.values(CAST).flat(), ...Object.values(PARTY), ...ACTOR_NAMES])];
/** every atlas's JSON, fetched once at boot (the module's import waits for it: the sheets are asked for synchronously) */
const META = Object.fromEntries(await Promise.all(ALL.map(async (name) => {
  try { const r = await fetch(`${ACTORS}${name}.json`); return [name, r.ok ? await r.json() : null]; } catch { return [name, null]; }
})));

const hashOf = (s) => { let h = 0x811c9dc5; for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 0x01000193); return h >>> 0; };
/** the atlas for a spec: the player's hero, a level's named look, a party member's class, a villager's preset (and seed and name) */
export function atlasFor(spec) {
  const s = spec && typeof spec === 'object' ? spec : { preset: typeof spec === 'string' ? spec : 'villager' };
  const preset = typeof s.preset === 'string' ? s.preset : 'villager';
  if (s.__ember === 'player') return HERO;
  if (typeof s.emberActor === 'string' && META[s.emberActor]) return s.emberActor;   // a level's own choice (a townsman, a party member)
  if (s.__ember === 'party') { const a = PARTY[preset] || 'hero_rogue'; return a === HERO ? 'hero_rogue' : a; }
  const list = (CAST[preset] || CAST.villager).filter((a) => META[a]);
  return list.length ? list[hashOf(`${preset}|${s.seed ?? ''}|${s.__id ?? ''}|${s.female ? 'f' : ''}`) % list.length] : 'npc_villager_1';
}

// ── the sheet ───────────────────────────────────────────────────────────────────────────────────────────────────────
const DIRS = ['down', 'left', 'right', 'up'];                      // Luminati's four, its rows' names (view.js: → octants)
const OCTANTS = 8;
const CLIPS = ['idle', 'walk', 'attack', 'hit', 'death'];
const pick = (n, k) => Array.from({ length: k }, (_, i) => Math.min(n - 1, Math.round((i * n) / k)));

/** an atlas's cut: the canvas (the eight octant rows, the clips' columns side by side), filled once its image is in */
const cuts = new Map();
function cutOf(name) {
  let c = cuts.get(name);
  if (c) return c;
  const m = META[name], cw = m.cw, ch = m.ch, at = {}; let cols = 0;
  for (const k of CLIPS) { const C = m.clips[k] || m.clips.idle; at[k] = { col: cols, len: C.len, fps: C.fps, impact: C.impact ?? Math.floor(C.len / 2) }; cols += C.len; }
  const canvas = document.createElement('canvas'); canvas.width = cw * cols; canvas.height = ch * OCTANTS;
  c = { name, m, cw, ch, cols, at, canvas, clones: new Set(), ready: false, face: null };
  const img = new Image(); img.decoding = 'async';
  img.onload = () => {
    const g = /** @type {CanvasRenderingContext2D} */ (canvas.getContext('2d')); g.imageSmoothingEnabled = false;
    for (let row = 0; row < OCTANTS; row++) for (const k of CLIPS) { const C = m.clips[k] || m.clips.idle, A = at[k]; g.drawImage(img, C.start * cw, row * ch, C.len * cw, ch, A.col * cw, row * ch, C.len * cw, ch); }
    c.ready = true;
    for (const t of c.clones) t.needsUpdate = true;                // every sprite's own copy, uploaded again
  };
  img.src = `${ACTORS}${name}.alb.png`;
  // the dialogue box's portrait is cut from a sheet canvas's first 32-px frame (art/portrait.js: 17 × 17 at 8, 2): a
  // canvas of that size with Emberfall's own portrait (<actor>.face.png) in that square
  const face = document.createElement('canvas'); face.width = 32; face.height = 32; c.face = face;
  const fimg = new Image();
  fimg.onload = () => { const g = /** @type {CanvasRenderingContext2D} */ (face.getContext('2d')); g.imageSmoothingEnabled = true; g.drawImage(fimg, 8, 2, 17, 17); };
  if (ACTOR_FACES.includes(name)) fimg.src = `${ACTORS}${name}.face.png`;   // (the townsfolk, the bow rogues and the foes have none baked)
  cuts.set(name, c);
  return c;
}
/** a texture over the cut's canvas that hands its clones to the cut, so each is uploaded again when the pixels come in */
function textureOf(c, label) {
  const tex = new THREE.CanvasTexture(c.canvas);
  tex.name = label; tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping; tex.magFilter = tex.minFilter = THREE.NearestFilter;
  tex.generateMipmaps = false; tex.colorSpace = THREE.SRGBColorSpace;
  c.clones.add(tex);
  const clone = tex.clone.bind(tex);
  tex.clone = () => { const t = clone(); c.clones.add(t); const dispose = t.dispose.bind(t); t.dispose = () => { c.clones.delete(t); dispose(); }; return t; };
  return tex;
}
/** the columns a pose name stands for (Luminati's plain, combat and festival poses) */
function posesOf(at) {
  const A = at.attack, W = at.walk, I = at.idle, D = at.death, Hh = at.hit, last = (q) => q.col + q.len - 1;
  const iw = pick(I.len, 2), ww = pick(W.len, 4), dw = pick(W.len, 4);
  return {
    idle0: I.col + iw[0], idle1: I.col + iw[1], walk0: W.col + ww[0], walk1: W.col + ww[1], walk2: W.col + ww[2], walk3: W.col + ww[3],
    // combat (CharacterSprites COMBAT_POSE_NAMES)
    wind: A.col, slash: A.col + A.impact, follow: last(A), backhand: A.col + Math.min(A.len - 1, 2), thrust: A.col + A.impact, spin: A.col + Math.min(A.len - 1, 4),
    cast: A.col + A.impact, aim: A.col + 1, hurt: Hh.col + 1, tuck: I.col, roll: W.col + dw[2], down: last(D),
    // the festival's (FestivalPoses FESTIVAL_POSE_NAMES)
    cower: Hh.col + 1, cheer0: A.col, cheer1: A.col + A.impact, dance0: W.col + dw[0], dance1: W.col + dw[1], dance2: W.col + dw[2], dance3: W.col + dw[3],
    kneel: D.col + Math.min(D.len - 1, 3), bow: I.col,
  };
}
/** the sheet Luminati's Sprite3D plays (its SpriteSheet: texture, frames, animations by `<clip>_<dir>`) */
export function emberSheet(spec, { combat = false, festival = false } = {}) {
  const name = atlasFor(spec), c = cutOf(name), { at, cw, ch, m } = c, poses = posesOf(at);
  const animations = {};
  DIRS.forEach((d, row) => {
    const run = (q, fps = q.fps, loop = true) => ({ frames: Array.from({ length: q.len }, (_, i) => ({ col: q.col + i, row })), fps, loop });
    animations[`idle_${d}`] = run(at.idle);
    animations[`walk_${d}`] = run(at.walk);
    animations[`run_${d}`] = run(at.walk, Math.round(at.walk.fps * 1.6));
    animations[`attack1_${d}`] = run(at.attack, at.attack.fps, false);
    animations[`attack2_${d}`] = run(at.attack, at.attack.fps, false);
    animations[`attack3_${d}`] = run(at.attack, at.attack.fps, false);
    animations[`hurt_${d}`] = run(at.hit, at.hit.fps, false);
    animations[`down_${d}`] = run(at.death, at.death.fps, false);
    const held = (p) => ({ frames: [{ col: poses[p], row }], fps: 1, loop: true });
    for (const p of ['spin', 'cast', 'aim', 'cower', 'kneel', 'bow']) animations[`${p}_${d}`] = held(p);
    animations[`dodge_${d}`] = { frames: ['tuck', 'roll', 'tuck'].map((p) => ({ col: poses[p], row })), fps: 10, loop: false };
    animations[`cheer_${d}`] = { frames: [{ col: poses.cheer0, row }, { col: poses.cheer1, row }], fps: 4, loop: true };
    animations[`dance_${d}`] = { frames: ['dance0', 'dance1', 'dance2', 'dance3'].map((p) => ({ col: poses[p], row })), fps: 6, loop: true };
  });
  const label = `ember:${name}${combat ? ':combat' : festival ? ':festival' : ''}`, texture = textureOf(c, label);
  texture.userData.emberOctants = true;                        // (the mark view.js reads: MonsterSprites rebuilds the sheet, keeps the texture)
  return {
    texture, canvas: c.face, frameWidth: cw, frameHeight: ch, columns: c.cols, rows: OCTANTS,
    pixelsPerUnit: EMBER_PPU, anchor: [m.ax / cw, 1 - m.ay / ch], animations, name: label,
    spec: { ...(spec && typeof spec === 'object' ? spec : {}), preset: (spec && spec.preset) || 'villager' },
    ...(combat || festival ? { poses } : {}),
    dispose() { c.clones.delete(texture); texture.dispose(); },
  };
}

/** Luminati's createCharacterSheet, in Emberfall's people (and its humanoid foes in our goblins) */
export function createCharacterSheet(spec = {}, opts = {}) {
  return emberSheet(spec, { combat: !!(opts && opts.combat) });
}
// ── a foe group's own look ─────────────────────────────────────────────────────────────────────────────────────────
// Luminati makes one sheet a kind (CombatSystem: createEnemySheet), so every goblin is the same goblin. A level's enemy
// object may name an atlas of ours (`emberActor`: the Old Barrows' Ashbound and its Quartermaster); the build tags
// CombatSystem._spawnGroup to ask here first. The sheet is built as MonsterSprites' humanoidSheet builds its own: the
// combat sheet, with the kind's pose aliases (its windup, attack, dead … named onto our columns).
const MOVE = { move0: 'walk0', move1: 'walk1', move2: 'walk2', move3: 'walk3' };
const ALIASES = {
  goblin: { ...MOVE, windup: 'wind', attack: 'slash', attack2: 'backhand', dead: 'down' },
  archer: { ...MOVE, windup: 'aim', attack: 'follow', shove: 'thrust', dead: 'down' },
  shaman: { ...MOVE, windup: 'cast', attack: 'aim', blink: 'tuck', dead: 'down' },
};
const groupSheets = new Map();
/** the sheet for a level enemy object that names its look, else null (Luminati's sheet for its kind) */
export function enemySheetFor(g) {
  const actor = g && typeof g.emberActor === 'string' ? g.emberActor : null, kind = g && g.kind;
  if (!actor || !META[actor] || !Object.hasOwn(ALIASES, kind)) return null;
  const key = `${kind}|${actor}`;
  let sh = groupSheets.get(key);
  if (sh) return sh;
  const s = emberSheet({ preset: kind, emberActor: actor }, { combat: true }), poses = { ...s.poses };
  for (const [alias, name] of Object.entries(ALIASES[kind])) poses[alias] = s.poses[name];
  sh = { texture: s.texture, canvas: s.canvas, frameWidth: s.frameWidth, frameHeight: s.frameHeight, columns: s.columns, rows: s.rows, pixelsPerUnit: s.pixelsPerUnit,
    anchor: s.anchor, animations: s.animations, name: kind, kind, poses, spriteOptions: {}, dispose() { s.dispose(); groupSheets.delete(key); } };
  groupSheets.set(key, sh);
  return sh;
}
Object.assign(globalThis, { __emberFoes: { sheetFor: enemySheetFor } });

/** (for checks: the atlas a spec would get, and Luminati's own painter if wanted side by side) */
export const luminatiCreateCharacterSheet = LUMINATI.createCharacterSheet;
