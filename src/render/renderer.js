// renderer.js — the game's eye over Luminati's world (docs/luminati-only-cleanup.md; A17, A21). The sim doesn't know
// this file exists. Luminati draws the world and the people (src/render3d/hybrid.js, the painter: setExternal); this
// keeps everything around it, as Emberlit had it:
//   · the camera (iso.js): it follows the hero, eases onto a town square's framing, jolts with a blow (the feel pass);
//   · each frame's figures (`draws`): who stands where, with the clip, frame and facing the animator chose (anim.js), for
//     the painter to pose its models from;
//   · the fights' light (fx.js, skillfx.js): weapon trails, sparks, the skills' moments, drawn into an emissive plane on
//     black that the painter lays over its world; and the state of what it draws in its own looks (spells, warnings,
//     blasts);
//   · the overlay canvas: the minimaps, names, plaques, stair and shrine signs, the goal ring, battle bars and numbers,
//     the banner, the weather's fog and wind, the stick;
//   · the taps: npcAt, enemyAt, doorAt, propAt, serviceAt, screenToTile.
// Emberlit's own painting of the world (its G-buffer bake, tiles, stamping and WebGL light passes) was removed in the
// cleanup's step 4; git history has it, and docs/emberlit-tdd.md describes it.

import { materialAt, heightAt, resourceAt, propAt, isWalkable } from '../sim/world.js';
import { ELIT } from './palette.js';
import { skyAt, makeSky, mixSky, holdT } from './daylight.js';
import { weatherNow, weatherLight, drawWeather, lightOf } from './weatherfx.js';
import { beastOf, beastFrame } from './beasts.js';
import { TW, HW, HH, ZH, project, resolveTap } from './iso.js';
import { buildProps } from './gsprite.js';
import { createAnimator } from './anim.js';
import { createFX, styleOfSrc, raisedLook, BOLT_RGB } from './fx.js';
import { createSkillFX, LUM_LOOKS, LUM_HOLDS } from './skillfx.js';
import { siteOpen, bossAt } from '../sim/sites.js';
import { shrineKind } from '../sim/shrines.js';
import { WARDENS } from '../sim/tower.js';
import { familyOf, BOSSES, halved } from '../sim/battle.js';
import { DEATH_T } from '../sim/battle.js';
import { statsFor } from '../sim/party.js';
import { shotOf } from '../sim/items.js';
import { campsOf, campUp } from '../sim/camps.js';

const INTERACT = new Set(['chest', 'shrine', 'stairs', 'stairwell']);   // props a tap can target
// Actor atlases (tools/actor-lab/bake.cjs) store one row per screen octant:
// 0=E, 1=SE, 2=S (toward the camera), 3=SW, 4=W, 5=NW, 6=N, 7=NE.
const SKELETONS = ['skeleton_warrior', 'skeleton_minion', 'skeleton_rogue', 'skeleton_mage'];
// every enemy kind's baked look (battle.js ENEMIES and the bosses): the Ashbound, the Redhand Company, the
// Cinder Cult. The Ashbound load with the game; the others when a floor that has them loads.
const ENEMY_ACTOR = { warrior: 'skeleton_warrior', minion: 'skeleton_minion', rogue: 'skeleton_rogue', mage: 'skeleton_mage',
  cutthroat: 'redhand_cutthroat', brute: 'redhand_brute', crossbow: 'redhand_crossbow', acolyte: 'cinder_acolyte',
  goblin: 'goblin_skirmisher', bruiser: 'goblin_bruiser', archer: 'goblin_archer', hexer: 'goblin_hexer',
  fenghoul: 'fen_ghoul', reedcutter: 'reed_cutter', fowler: 'reed_fowler', bogwitch: 'bog_witch', harvester: 'cult_harvester', drowned: 'drowned_brother', cantor: 'drowned_cantor',
  rat: 'vermin_rat', spider: 'vermin_spider', spinner: 'vermin_spinner', gutter: 'vermin_gutter',   // (v1.58) the vermin, built in code (tools/actor-lab/creatures.js)
  redhand_captain: 'boss_garrow', robed_stranger: 'boss_stranger', standard: 'boss_standard', goblin_chief: 'boss_skarn',
  toadking: 'boss_toadking', teague: 'boss_teague', drowned_choir: 'boss_choir', abbess_below: 'boss_abbess',   // (M8.6: the Fens' four)
  quartermaster: 'boss_quartermaster', vatwarden: 'boss_vatwarden',   // (v1.48)
  firebeetle: 'creature_firebeetle', gob: 'creature_goblin', wraith: 'creature_wraith', golem: 'creature_golem',   // (v1.59) the bestiary, built in code
  rat_king: 'boss_ratking', spider_queen: 'boss_spiderqueen' };
// the Mere Tower's wardens (sim tower.js): baked tall as the bosses are (tools/actor-lab variants W1–W10), named on the boss bar
for (const id of Object.keys(WARDENS)) ENEMY_ACTOR[id] = 'boss_' + id.slice('warden_'.length);
const UNDEAD_LOOK = new Set(SKELETONS.concat(['boss_standard', 'boss_quartermaster', 'drowned_brother', 'drowned_cantor', 'boss_bellringer', 'boss_hush', 'boss_watcher', 'boss_starroom', 'boss_choir', 'boss_abbess']));   // (they rise from the ground and shamble)
// walk-cycle length in tiles (one full loop of the baked walk clip): frames advance with
// distance, so this sets the stride — hero/companion run (Running_A), skeleton shamble
const STRIDE = { hero: 4.5, skel: 3.2, walk: 2.2 };   // tiles a cycle, from the baked feet: the party's run ~50 px of screen travel, the Ashbound's shuffle ~36 px;
// a Walking_A figure (townsfolk, the Redhand, the robes) carries its own measured `stride` in its atlas JSON (actor-lab
// lab.js strideOf, art pass 6: 1.97–2.33), 2.2 when it has none. They had the run's 4.5, so their feet skated 2×. The
// goblins run (Running_A/B, measured the same way: 3.0–3.2): their short legs barely parted in a walk, and read as skating.
const strideOf = (atl, fallback) => (atl && atl.meta.stride) || fallback;
const NO_WEATHER = Object.freeze({ kind: 'clear', k: 0 });
// a marsh world's marsh-lights: one over each mere big enough to hold one, at its middle, with its own phase (fx.wisps)
const WISPS = new WeakMap();
const wispsOf = (w) => { let l = WISPS.get(w); if (!l) { l = (w.pools || []).filter((p) => p.rx >= 6 && p.ry >= 5).map((p, i) => ({ x: p.cx, y: p.cy, ph: i * 2.39 })); WISPS.set(w, l); } return l; };

// A scene change (town ↔ overland, stairs, a load): black until the painter has the new scene built, then a fade in
const TRANSIT_FADE = 320;
// the quest markers' colours (quests.js markKinds): a side quest's gold, the main story's blue, any quest done green
const QUEST_SIDE = '#ffc840', QUEST_MAIN = '#6fb4ff', QUEST_DONE = '#8fe07a';
const VIEW_TILES = 25;             // tiles across the screen (was ~16, then 20; each step zooms out 20%)
/** the player's zoom range, a factor on the default (pinch, the wheel, Graphics): a third and more each way */
export const ZOOM_MIN = 0.67, ZOOM_MAX = 1.5;
const PHONE_CSS = 390 / (VIEW_TILES * 16); // an iPhone 13 upright: CSS px per native px (≈ 0.98), the size of things elsewhere


/**
 * @param {HTMLCanvasElement} canvas  the taps' surface (never drawn: Luminati draws the world, src/render3d/hybrid.js
 *   setExternal) @param {any} sim @param {any} input
 */
export function createRenderer(canvas, sim, input) {

  // the overlay: the minimap, names, bars, numbers, the banner and the joystick, over the painter's world
  const overlay = document.createElement('canvas');
  overlay.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:2;';
  document.body.appendChild(overlay);
  const octx = overlay.getContext('2d');

  let S = 3, baseS = 3, zoom = 1, vw = 0, vh = 0, nvw = 0, nvh = 0;
  // the time of day outdoors (daylight.js): the sim's clock, or a held look (the title's dusk, ?dev&tod=);
  // a change of hold eases over SKY_EASE ms instead of cutting
  const sky = makeSky(), skyNow = makeSky(), skyFrom = makeSky(), SKY_EASE = 1500;
  let skyHoldT = /** @type {number|null} */ (null), skyEase0 = -1e9, lastNow = 0;
  let sEMI;                                          // the window's emissive plane: the effects' light (native px)
  let terrValid = false;                             // the painter has this scene built (render: ext.ready)

  function resize() {
    const dpr = Math.min(3, window.devicePixelRatio || 1);
    vw = Math.floor(window.innerWidth * dpr);
    vh = Math.floor(window.innerHeight * dpr);
    canvas.style.width = window.innerWidth + 'px'; canvas.style.height = window.innerHeight + 'px';
    overlay.width = vw; overlay.height = vh;
    overlay.style.width = window.innerWidth + 'px'; overlay.style.height = window.innerHeight + 'px';
    // CSS px per native px. A phone held upright fits VIEW_TILES across (the owner: on an iPhone 13 it's right). Any
    // other screen keeps things about that size and shows more world, instead of blowing the same 25 tiles up to fill
    // a desktop window (the owner, 2026-10-03: "too zoomed in" there): the phone's own size on a touch screen (so
    // turning a phone sideways keeps the figures' size), a quarter larger with a mouse (a desk is viewed from further).
    const cw = window.innerWidth, fit = cw / (VIEW_TILES * TW);
    const touch = !!(window.matchMedia && window.matchMedia('(pointer: coarse)').matches), upright = touch && cw <= 500;
    const css = upright ? fit : Math.min(fit, PHONE_CSS * (touch ? 1 : 1.25));
    // Device px per native px: fractional; never under one. (Its floor
    // was 1.5, from when 25 tiles filled any window: on a 1× desktop that overrode the cap, 1.5 for 1.22, owner 2026-10-04.)
    baseS = Math.max(1, css * dpr);
    scaleTo();
  }
  // the player's zoom (the owner, 2026-11-10: "let me zoom in and out by the current default camera zoom by at least
  // 33%"): a factor on the scale, ZOOM_MIN..ZOOM_MAX of the default; Luminati's camera, the overlay and every tap follow S
  function scaleTo() {
    S = baseS * zoom;
    nvw = Math.ceil(vw / S) + 2; nvh = Math.ceil(vh / S) + 2;
    if (!sEMI || sEMI.length !== nvw * nvh * 4) sEMI = new Uint8Array(nvw * nvh * 4);   // (the fights' light, on black, for the painter to lay over its world: hybrid.js)
    terrValid = false;
  }
  window.addEventListener('resize', resize); resize();
  // The HUD row's bottom edge, in CSS px: it sits under the phone's safe area (an iPhone's camera island
  // pushes it ~60 px down), so everything drawn along the top (minimap, room pill, boss bar, labels)
  // keys off it rather than a fixed height that fit a desktop and overlapped on a phone.
  let hudB = 50, hudL1 = 30;   // (hudL1: the bar's line 1, which the minimap hangs under: docs/hud-mockup.html)
  // ...and the party's column down the left on a phone held sideways (ui/party.js sets --party-side, CSS px; 0 when
  // the cards sit along the bottom): the camera centres the hero in the rest of the screen
  // and the notch's inset on the right, if it's there (ui/safearea.js's probe): the minimap and the room pill keep clear of it
  let sideL = 0, safeR = 0;
  const measureHud = () => {
    const h = typeof document !== 'undefined' && document.getElementById('hud'); if (h) hudB = Math.max(40, h.getBoundingClientRect().bottom);
    const l1 = typeof document !== 'undefined' && document.getElementById('hudL1'); hudL1 = l1 ? Math.max(24, l1.getBoundingClientRect().bottom) : hudB - 24;
    if (typeof document !== 'undefined') {
      sideL = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--party-side')) || 0;
      const pr = document.getElementById('safeProbe'); safeR = pr ? parseFloat(getComputedStyle(pr).paddingRight) || 0 : 0;
    }
  };
  measureHud(); window.addEventListener('resize', () => { measureHud(); requestAnimationFrame(measureHud); }); setInterval(measureHud, 1000);
  const MM_CSS = 96, MM_PAD = 6, MM_RIGHT = 12;                // the minimap's size and margins (CSS px; + the notch's inset, safeR): its frame's
  // right edge lines up with the bar's gold and cinders and the compass and Journal (12 px in)
  const mmTop = () => hudL1 + 6 + MM_PAD;                        // the map's top edge (CSS px): its frame 6 px under the bar's line 1, which
  // leaves line 2 and 3's left column clear (they stop 118 px short); the buttons hang under the frame (compass.js, journal.js: --hud-l1 + 122 / + 174)

  /* ── load-time bakes: props ─────────────────────────────────────────────── */
  let props = buildProps(sim.world.seed);


  // ── Actor atlases (tools/actor-lab/bake.cjs): only their JSON here, the clips' columns and rows, the cell size, the
  // weapon anchors and the walk's stride, which the animator (anim.js) and the weapons' effects (fx.js) read. The painter
  // draws the people (as models, or from the same atlas's albedo: tools/render3d/world.js); this never decodes it (it
  // did, every atlas into per-frame sprites, for Emberlit's painting: docs/luminati-only-cleanup.md step 4). Until its
  // JSON is in, a figure isn't drawn.
  let heroAtlas = null, outMap = null;
  const pickAnim = createAnimator();                   // per-unit clip playback (anim.js)
  const fx = createFX();                               // weapon trails / glints / cast shimmer + hit sparks (fx.js)
  const sfx = createSkillFX(fx.primitives);            // each class skill's own effect, and what it leaves on people (skillfx.js)
  const skelAtlases = [], enemyAtlases = new Map();   // actor name → atlas, or a promise while it loads
  const actorAtlas = (name) => {                       // any actor's atlas by name, loaded on first ask (null until it's in)
    const a = enemyAtlases.get(name);
    if (a === undefined) enemyAtlases.set(name, loadActorAtlas(name, name.startsWith('boss_') ? 1.3 : 1).then((x) => { enemyAtlases.set(name, x); return x; }).catch(() => { enemyAtlases.set(name, null); }));
    return a && a.meta ? a : null;
  };
  const enemyAtlas = (kind) => actorAtlas(ENEMY_ACTOR[kind] || 'skeleton_minion');
  // a floor's family, loaded before its first wave (battle.js FAMILIES): no enemy pops in undrawn
  const preloadFamily = () => { const w = sim.world; if (w.kind === 'overland') { for (const q of w.pickets || []) enemyAtlas(q.kind); return; } if (w.kind !== 'dungeon') return; for (const id of [undefined, ...(w.level && w.level.plan ? w.level.rooms.map((r) => r.id) : [])]) { const F = familyOf(w, id); for (const k of [...F.melee, ...F.ranged, F.elite]) enemyAtlas(k); } const b = bossAt(w.site, w.depth || 0); if (b) enemyAtlas(b); };   // (an authored floor's rooms each their own foes)
  // An atlas is a JSON of rects plus PNGs, and a re-bake moves the rects. A browser (or host) that
  // cached one half and not the other slices from the wrong place: a stairwell drawn blank. So the
  // small JSON is always revalidated, and the PNGs are asked for at a version hashed from it.
  const atlasMeta = (url) => fetch(url, { cache: 'no-cache' }).then((r) => r.text()).then((t) => {
    let h = 0x811c9dc5; for (let i = 0; i < t.length; i++) h = Math.imul(h ^ t.charCodeAt(i), 0x01000193);
    return { meta: JSON.parse(t), v: (h >>> 0).toString(36) };
  });
  // scale: how tall against a man (a boss 1.3×). The bake makes the bosses tall (73 px; art pass 9), so their atlas
  // comes as it is; one baked smaller (88-px cells at 56 px) has its cell, foot point and weapon anchors scaled up to it
  async function loadActorAtlas(name, scale = 1) {
    const { meta: m0 } = await atlasMeta(`./assets/actors/${name}.json`), k = scale * 88 / m0.cw;
    return { name, meta: Math.abs(k - 1) > 0.04 ? scaledMeta(m0, k) : m0 };
  }
  const scaledMeta = (m, k) => ({ ...m, cw: Math.round(m.cw * k), ch: Math.round(m.ch * k), ax: Math.round(m.ax * k), ay: Math.round(m.ay * k),
    ...(m.anchors ? { anchors: Object.fromEntries(Object.entries(m.anchors).map(([sl, A]) => [sl, A.map((n) => Math.round(n * k))])) } : {}) });
  const firstLoads = [];                               // what the boot's loading screen waits for (`ready`)
  firstLoads.push(loadActorAtlas('hero_knight').then((a) => { heroAtlas = a; partyAtlases.hero_knight = a; }).catch(() => {}));   // the default look; a created hero's own look loads via partyAtlas
  SKELETONS.forEach((n, i) => firstLoads.push(loadActorAtlas(n).then((a) => { skelAtlases[i] = a; enemyAtlases.set(n, a); }).catch(() => {})));

  // ── Environment atlases (tools/actor-lab/bake-env.cjs): only their JSON here, each sprite's rect, foot and size, for
  // the outdoor minimap's structures, a service's building under a tap and the farm beasts' frames. The painter stands
  // the sprites it keeps from the albedo itself (tools/render3d/world.js placeEnv). Two are live at a time: the shared
  // base ('env': trees, rocks, props) and the current region's town buildings ('town-<region>').
  let envMeta = null;                                  // { sprites: id → meta (+ .atlas) } merged across loaded atlases
  let envGen = 0;                                      // bumped as each atlas lands (the beasts' list is rebuilt)
  const envAtlases = new Set();
  function loadAtlas(name) {
    if (envAtlases.has(name)) return null;
    envAtlases.add(name);
    return atlasMeta(`./assets/env/${name}.json`).then(({ meta: m }) => {
      envMeta = envMeta || { sprites: {} };
      for (const [id, sm] of Object.entries(m.sprites)) envMeta.sprites[id] = { ...sm, atlas: name };
      outMap = null; envGen++;
    }).catch(() => envAtlases.delete(name));
  }
  const wantAtlases = () => [loadAtlas('env'), sim.world.kind !== 'dungeon' ? loadAtlas('town-' + (sim.world.region || 'vale')) : null];   // env carries the dungeon's stair too
  firstLoads.push(...wantAtlases());
  // bolts: tiny emissive sprites (firebolt ember, soul-bolt violet, a goblin's hex green, crossbow quarrel steel)
  const bolts = {};
  function boltSprite(kind) {
    if (bolts[kind]) return bolts[kind];
    const w = 7, h = 7, sp = { w, h, ax: 3, ay: 3, mask: new Uint8Array(w * h), alb: new Uint8Array(w * h * 3), nrm: new Uint8Array(w * h * 3), emi: new Uint8Array(w * h) };
    const col = kind === 'fire' ? [255, 170, 80] : kind === 'soul' ? [190, 150, 255] : kind === 'hex' ? [160, 235, 110] : kind === 'spirit' ? [150, 235, 215] : kind === 'marsh' ? [200, 240, 205] : kind === 'web' ? [232, 230, 214] : kind === 'firespit' ? [255, 120, 40] : [210, 210, 220], glow = kind === 'fire' || kind === 'firespit' ? 5 : kind === 'soul' ? 2 : kind === 'hex' ? 1 : kind === 'spirit' ? 8 : kind === 'marsh' ? 10 : 0;
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      // a round orb, a hot core in a coloured rim (a 2.9 radius took the whole 5 × 5 square and read as a square tile at
      // any zoom: art critic pass 16, the effects' strips)
      const d = Math.hypot(x - 3, y - 3); if (d > (kind === 'bolt' ? 1.6 : 2.5)) continue;
      const j = y * w + x, hot = kind !== 'bolt' && d < 1.2, c = hot ? [col[0] + (255 - col[0]) * 0.6, col[1] + (255 - col[1]) * 0.6, col[2] + (255 - col[2]) * 0.6] : col;
      sp.mask[j] = 1; sp.alb.set(c, j * 3); sp.nrm.set([127, 160, 250], j * 3); sp.emi[j] = d < (kind === 'fire' ? 2.6 : 1.8) ? glow : 0;   // (fire: the whole orb burns, lava-hot; with ember at its core it read a dull tan at night)
    }
    return (bolts[kind] = sp);
  }
  // an arrow: a short line along its flight on screen (q of 16 headings), steel head forward, pale
  // fletching behind, both glinting; baked once per heading
  function arrowSprite(q) {
    const key = 'arrow' + q; if (bolts[key]) return bolts[key];
    const w = 15, h = 15, sp = { w, h, ax: 7, ay: 7, mask: new Uint8Array(w * h), alb: new Uint8Array(w * h * 3), nrm: new Uint8Array(w * h * 3), emi: new Uint8Array(w * h) };
    const a = (q / 16) * Math.PI * 2, dx = Math.cos(a), dy = Math.sin(a);
    for (let t = -6; t <= 6; t++) {
      const x = Math.round(7 + dx * t), y = Math.round(7 + dy * t), j = y * w + x;
      sp.mask[j] = 1; sp.alb.set(t >= 5 ? [215, 220, 230] : t <= -5 ? [240, 232, 214] : [196, 146, 90], j * 3); sp.nrm.set([127, 160, 250], j * 3);
      if (t >= 5 || t <= -5) sp.emi[j] = 7;               // a frost glint at the head and the fletching: it reads in the dark
    }
    return (bolts[key] = sp);
  }
  // companions (hired party members) — atlases load on first use
  const partyAtlases = {};
  let cast = {};                                      // content/npcs/*.json by id (setCast): each NPC's look and name
  const npcPres = new Map();                          // NPC id → its animation state (never on the sim's objects)
  // The crowd (critic pass 11f, scored against the owner's reference: its village is busy with people at work,
  // ten or more a frame; ours had its nine named townsfolk). Unnamed villagers (npc_villager_1–4) stroll from one
  // open spot of the square or the high street to another, wait a while, and go on. Presentation only: the sim
  // knows nothing of them, they're never tapped or saved, and their walk is the renderer's own (a seeded LCG).
  const CROWD_N = 8, CROWD_SPEED = 1.3, crowds = new WeakMap(), CROWD_LOOK = { flash: 0, dissolve: 0 };   // passers-by never x-ray through a wall: a hidden one is just out of sight
  function crowdOf(world) {
    let c = crowds.get(world); if (c) return c;
    c = [];
    if (world.kind === 'town' && world.hub) {
      let s = (world.seed ^ 0x9e3779b9) >>> 0; const rnd = () => ((s = (Math.imul(s, 1664525) + 1013904223) >>> 0) / 4294967296);
      const H = world.hub, spots = [];
      for (let t = 0; t < 400 && spots.length < 48; t++) {          // open spots: the square, and the high street to the gate
        const onStreet = rnd() < 0.3, x = onStreet ? 84 + rnd() * 24 : H.x + (rnd() - 0.5) * H.r * 1.6, y = onStreet ? 77 + rnd() * 6 : H.y + (rnd() - 0.5) * H.r * 1.6;
        if (!onStreet && Math.hypot(x - H.x, y - H.y) > H.r - 3) continue;
        if (isWalkable(world, x, y) && isWalkable(world, x + 0.6, y) && isWalkable(world, x, y + 0.6)) spots.push([x, y]);
      }
      for (let i = 0; i < CROWD_N && spots.length > 2; i++) { const [x, y] = spots[(rnd() * spots.length) | 0];
        c.push({ x, y, tx: x, ty: y, wait: rnd() * 4000, look: 'npc_villager_' + (1 + (i % 4)), fx: 0, fy: 1, moving: false, u: { fidgetN: 0, lookN: 0, h: i * 977, seed: rnd(), next: 1e15, near: false } }); }
      c.spots = spots; c.rnd = rnd; c.last = 0;
    }
    crowds.set(world, c); return c;
  }
  const clearWalk = (world, ax, ay, bx, by) => { const n = Math.ceil(Math.hypot(bx - ax, by - ay) / 0.5); for (let k = 1; k <= n; k++) if (!isWalkable(world, ax + (bx - ax) * k / n, ay + (by - ay) * k / n)) return false; return true; };
  function stepCrowd(world, c, now) {
    const dt = Math.min(0.1, c.last ? (now - c.last) / 1000 : 0); c.last = now;
    for (const v of c) {
      const dx = v.tx - v.x, dy = v.ty - v.y, d = Math.hypot(dx, dy);
      if (d > 0.05) { const st = Math.min(d, CROWD_SPEED * dt); v.x += dx / d * st; v.y += dy / d * st; v.fx = dx; v.fy = dy; v.moving = true; continue; }
      v.moving = false; v.wait -= dt * 1000;
      if (v.wait > 0) continue;
      for (let t = 0; t < 8; t++) {                                   // the next spot: near enough, and a clear walk to it
        const [x, y] = c.spots[(c.rnd() * c.spots.length) | 0];
        if (Math.hypot(x - v.x, y - v.y) < 18 && clearWalk(world, v.x, v.y, x, y)) { v.tx = x; v.ty = y; break; }
      }
      v.wait = 1500 + c.rnd() * 5000;
    }
  }
  // the person you're talking to (sim 'dialogue' … 'talkEnded'): they turn to you, greet you and talk with their
  // hands; you turn to them (art pass 6: both stood as they were, often back to back)
  let talkingTo = null, greet = null;
  sim.bus.on('dialogue', ({ npc }) => { talkingTo = greet = npc; });
  sim.bus.on('talkEnded', () => { talkingTo = greet = null; });
  // each townsperson's own beat: an idle phase and a gesture rhythm from their id, so the square doesn't
  // breathe and wave in unison (it did: every NPC had seed 0.61 and the same fidget schedule)
  const idHash = (id) => { let h = 0x811c9dc5; for (let i = 0; i < id.length; i++) h = Math.imul(h ^ id.charCodeAt(i), 0x01000193); return h >>> 0; };
  // farm beasts at their ease (beasts.js): a struct with idle frames baked beside it leaves the static bake, all but its
  // ground shadow, and is stamped each frame instead, on a timeline of its own
  const isBeast = (id) => !!(envMeta && envMeta.sprites[id + '~tl']);
  let beasts = [], beastWorld = null, beastGen = -1;
  function beastList() {
    if (beastWorld === sim.world && beastGen === envGen) return beasts;
    beastWorld = sim.world; beastGen = envGen;
    return (beasts = (sim.world.structs || []).filter((st) => isBeast(st.id)).map(beastOf));
  }
  // a rogue is drawn with what they shoot with (sim items.js `shot`; the atlases: actor-lab bake.json),
  // in their dagger look until that atlas has loaded
  const RANGED_LOOK = { bow: '_bow', longbow: '_longbow', crossbow: '_hxbow', heavy: '_xbow' };
  // (Wren, the Fens' found rogue, has hers too: baked as the rogue's, from her own look; tools/actor-lab CP2B/L/X/H)
  const memberAtlas = (m, base) => { const k = (base === 'hero_rogue' || base === 'hero_wren') && shotOf(m); return (k && partyAtlas(base + RANGED_LOOK[k])) || partyAtlas(base); };
  const partyPending = new Map();                     // name → its load, for `ready` (the restored party's looks load behind the loading screen)
  const partyAtlas = (name) => { if (!(name in partyAtlases)) { partyAtlases[name] = null; partyPending.set(name, loadActorAtlas(name).then((a) => { partyAtlases[name] = a; }).catch(() => {})); } return partyAtlases[name]; };
  const MEMBER_LOOK = { fighter: 'hero_barbarian', rogue: 'hero_rogue', mage: 'hero_mage', cleric: 'hero_cleric', shaman: 'hero_shaman' };

  const fol = [];                                     // smoothed companion draw positions


  // The Abbess's water under another painter (hybrid.js lays it as tile squares; the boss pass): the glints paintHazards
  // puts in the bake's emissive, here as the effects' light, a few a frame where the water lies
  const GLINT = [70, 170, 200];
  function floodGlints(b, proj, now) {
    const t = Math.floor(now / 500), lim = b.flood * (b.floodStep || 1), P = fx.primitives;
    for (const [k, d] of b.edge) {
      if (d > lim) continue;
      const c = k.indexOf(','), tx = +k.slice(0, c), ty = +k.slice(c + 1);
      if (((tx * 31 + ty * 17 + t * 7) % 23 + 23) % 23) continue;
      const q = proj(tx + 0.25 + ((tx * 7 + t) % 5) * 0.12, ty + 0.25 + ((ty * 3 + t) % 5) * 0.12);
      if (q.sx < -8 || q.sy < -8 || q.sx > nvw + 8 || q.sy > nvh + 8) continue;
      P.depth(q.key - 0.3, q.sy, q.h); P.disc(q.sx, q.sy, 1.8, 0.9, 1); P.mark(q.sx, q.sy, 1.2); P.flush(GLINT);
    }
  }

  let transit = null;                                  // { fadeFrom }: a scene change, black until the painter has built it, then a fade in

  // the render clock (dev slow motion runs it slow, ?dev&manual steps it): everything timed on screen reads this, so a
  // capture on the manual clock is the same pixels every run (the numbers and the camera's jolt read the wall clock
  // once, and came out at random in captures: art-review.md)
  let clockNow = 0;
  const clock = () => clockNow || performance.now();
  // descending / restoring rebuilds the world — rebuild seed-keyed props + re-bake.
  const withExit = (p) => ({ ...p, exit: p.stairs });          // the dungeon's way back up reuses the stair sprite
  props = withExit(props);
  let banner = null;
  const sceneTitle = () => (sim.world.kind === 'dungeon' ? `${sim.world.siteName || 'The Old Barrows'} · depth ${sim.state.depth + 1}` : sim.world.name);
  const hiddenHere = (L) => !!L.site && !siteOpen(L.site, sim.state.revealed || []);   // a site not found yet has no name on the Vale
  sim.bus.on('levelChanged', () => { liveBolts.clear(); transit = { fadeFrom: 0 }; fol.length = 0; props = withExit(buildProps(sim.world.seed)); terrValid = false; outMap = null; wantAtlases(); preloadFamily(); banner = { text: sceneTitle(), until: clock() + 2600 }; });
  preloadFamily();
  banner = { text: sceneTitle(), until: clock() + 2600 };

  // v1.47 (the owner: "fx should be a bit more dynamic visually like an arpg"): a bolt streaks (its last few points),
  // bursts where it lands, and a fallen foe's light goes up. Presentation only, keyed by the sim's own objects.
  const trails = new WeakMap(), gone = new WeakSet();
  // fire landing (the owner, 2026-11-08: "more explosion fx on hit"): a moment of light thrown on the room round it, in
  // the lighting pass's third slot while it lasts (the nearer lamp keeps the second), and on Luminati one of its own lights
  const blasts = [];
  function blast(x, y, now, life, amp) { blasts.push({ x, y, t0: now, life, amp }); if (blasts.length > 6) blasts.shift(); }
  /** the brightest blast now, with its strength 0..amp, or null */
  function blastNow(now) {
    let best = null, bk = 0;
    for (let i = blasts.length - 1; i >= 0; i--) { const b = blasts[i], a = (now - b.t0) / 1000 / b.life; if (a >= 1) { blasts.splice(i, 1); continue; } if (a < 0) continue; const k = b.amp * (1 - a) * (1 - a); if (k > bk) { bk = k; best = b; } }
    return best ? { x: best.x, y: best.y, k: bk } : null;
  }
  // the warnings under way, for another painter's ground (Luminati's markers): where each is now, followed by id while the
  // shooter and its mark move, the shot's start held from its release (as skillfx.js draws it)
  const warns = [];
  const foeById = (id) => (sim.world.enemies || []).find((q) => q.id === id) || null;
  const memberById = (id) => { const i = sim.state.party.findIndex((q) => q.id === id); return i < 0 ? null : i === 0 ? sim.state.player : sim.state.party[i]; };
  /** @param {number} now @returns {{ x: number, y: number, tx: number, ty: number, p: number, hit: number, heavy: boolean, lane: boolean, boss: boolean }[]} */
  function warnsNow(now) {
    const out = [];
    for (let i = warns.length - 1; i >= 0; i--) {
      const W = warns[i], e = W.e, t = (now - W.t0) / 1000, T = e.wind + e.fly;
      if (t >= W.life) { warns.splice(i, 1); continue; } if (t < 0) continue;
      const a = foeById(e.by), b = memberById(e.tid);
      if (t >= e.wind && !W.lock) W.lock = a ? { x: a.x, y: a.y } : { x: e.x, y: e.y };
      const A = W.lock || (a ? { x: a.x, y: a.y } : { x: e.x, y: e.y }), B = b && b.x !== undefined ? b : { x: e.tx, y: e.ty };
      out.push({ x: A.x, y: A.y, tx: B.x, ty: B.y, p: Math.min(1, t / T), hit: t >= T ? 1 - (t - T) / 0.16 : 0, heavy: !!e.heavy, lane: !!e.bolt, boss: !!e.boss });
    }
    return out;
  }
  // the skills Luminati draws in its own looks (skillfx.js LUM_LOOKS: world.js placeSpells), from the cast (Frost Nova's
  // frost painted, Turn Undead's glyph drawn) to the landing and after; Firebolt and Shield Wall in its pieces beside our
  // light (LUM_ALSO: Shield Wall's dome and Arcane Ward's ring follow the state, auras below); and the holds it draws on
  // foes (LUM_HOLDS: a stun's or a knockdown's stars). The owner's picks, final (2026-11-09: the ?tierlooks review went)
  const LUM_SPELLS = new Set(LUM_LOOKS), LUM_ALSO = new Set(['firebolt', 'shield_wall']), lumHolds = new Set(LUM_HOLDS);
  const SPELL_LIFE = { frost_nova: 2.7, turn_undead: 1.2, mend: 1.0, bless: 1.4, cleave: 0.8, firebolt: 1.2, shield_wall: 0.9,
    vault: 1.0, cutting_wave: 0.9, kidney_shot: 0.8, fan_of_knives: 0.7, shadowstep: 0.9, caltrops: 6, flare: 1.4, gather: 0.9,
    sanctuary: 4, consecrate: 8, revive: 1.7, judgement: 1.7, old_marks: 0.8, spirit_totem: 8, thunder_drum: 0.9 }, spells = [];
  const boltIds = new WeakMap(); let boltN = 0;
  let spellN = 0;
  function spellEvent(e, now) {
    if (e.at === 'cast') { spells.push({ e, key: `${e.id}:${++spellN}`, seed: (spellN * 7919) % 8192, t0: now, land: null }); if (spells.length > 12) spells.shift(); return; }
    if (e.id === 'shield_wall') e = { ...e, reached: (sim.world.enemies || []).filter((f) => f.hp > 0 && !f.dead && Math.hypot(f.x - e.x, f.y - e.y) < 7).map((f) => ({ id: f.id, x: f.x, y: f.y })) };   // (the foes it turns: battle.js taunt, 7 tiles)
    const S = [...spells].reverse().find((q) => q.e.id === e.id && q.e.by === e.by && q.land == null);
    if (S) { S.land = now; S.e = { ...e, tx: S.e.tx, ty: S.e.ty }; } else spells.push({ e, key: `${e.id}:${++spellN}`, seed: (spellN * 7919) % 8192, t0: now, land: now });
  }
  /** @param {number} now */
  function spellsNow(now) {
    const out = [];
    for (let i = spells.length - 1; i >= 0; i--) {
      const S = spells[i], age = (now - S.t0) / 1000, L = S.land == null ? null : (now - S.land) / 1000;
      if ((L ?? 0) >= SPELL_LIFE[S.e.id] || (L == null && age > 1.2)) { spells.splice(i, 1); continue; }   // (over, or cut down mid-cast)
      const by = S.e.cls ? memberById(S.e.by) : null;
      out.push({ key: S.key, id: S.e.id, seed: S.seed, age, land: L, x: by && by.x !== undefined ? by.x : S.e.x, y: by && by.y !== undefined ? by.y : S.e.y, fx: S.e.x, fy: S.e.y, tx: S.e.tx, ty: S.e.ty, r: S.e.r, k: S.e.marks || 0, reached: S.e.reached || [] });   // (fx, fy: where it was cast from: a leap's, a dash's start)
    }
    // what holds, from the state: Shield Wall's dome over each walled member, Arcane Ward's ring under each warded one
    sim.state.party.forEach((m, i) => {
      const u = i === 0 ? sim.state.player : m; if (!u || u.x === undefined || m.down) return;
      const b = m.buff || {};
      if (b.wall > 0) out.push({ key: 'aura:wall:' + m.id, id: 'aura_wall', seed: 0, age: 0, land: null, x: u.x, y: u.y, tx: u.x, ty: u.y, r: 0, k: b.wall, reached: [] });
      if (m.ward > 0) out.push({ key: 'aura:ward:' + m.id, id: 'aura_ward', seed: 0, age: 0, land: null, x: u.x, y: u.y, tx: u.x, ty: u.y, r: 0, k: m.ward, reached: [] });
    });
    // what holds on foes (battle.js crowd control), in Luminati's pieces with the tiers' looks: a stun's or a knockdown's
    // stars, a freeze's ice shell, a root's grip
    for (const f of sim.world.enemies || []) {
      if (f.dead || f.hp <= 0) continue;
      const k = f.frozen > 0 ? 'frozen' : f.stun > 0 || f.knocked > 0 ? 'stun' : f.rooted > 0 ? 'root' : null; if (!k || !lumHolds.has(k)) continue;
      out.push({ key: `aura:${k}:${f.id}`, id: 'aura_' + k, seed: f.id, age: 0, land: null, x: f.x, y: f.y, tx: f.x, ty: f.y, r: 0, k: f.frozen || f.stun || f.knocked || f.rooted || 0, reached: [] });
    }
    // a Firebolt in flight: Luminati's ember bolt riding it
    for (const b of sim.world.projectiles || []) if (b.skill === 'firebolt') {
      let id = boltIds.get(b); if (!id) boltIds.set(b, (id = ++boltN));
      out.push({ key: 'fly:' + id, id: 'firebolt_fly', seed: id, age: b.t || 0, land: null, x: b.x, y: b.y, tx: b.x, ty: b.y, r: 0, reached: [] });
    }
    return out;
  }
  // the wind-up glow (Luminati's wind-up highlight, Enemy.js: 0.45 ↔ 0.9 at 8 Hz): a foe winding up a heavy blow or shot
  // pulses on its figure until it strikes, so the ring on the floor reads with the one making it. By foe id, each frame
  const windGlow = new Map();
  function windGlowNow(now) {
    windGlow.clear();
    for (let i = warns.length - 1; i >= 0; i--) {
      const W = warns[i], e = W.e, t = (now - W.t0) / 1000;
      if (t >= W.life) { if (!ext) warns.splice(i, 1); continue; }   // (another painter's frame prunes its own: warnsNow)
      if (!e.heavy || t < 0 || t >= e.wind) continue;
      windGlow.set(e.by, Math.max(windGlow.get(e.by) || 0, (0.45 + 0.45 * (0.5 + 0.5 * Math.sin(t * Math.PI * 16))) * Math.min(1, t / 0.06 + 0.3)));
    }
  }
  let liveBolts = new Set(), nextBolts = new Set();
  function boltFx(b, bx, by, kind, proj) {
    let t = trails.get(b); if (!t) trails.set(b, t = []);
    t.push(bx, by); if (t.length > 14) t.splice(0, 2);
    const P = proj(bx, by), pts = [];
    for (let k = 0; k < t.length; k += 2) { const q = proj(t[k], t[k + 1]); pts.push({ sx: q.sx, sy: q.sy - 18 }); }
    fx.trail(pts, BOLT_RGB[kind] || BOLT_RGB.bolt, P.key, P.sy, P.h, kind === 'arrow');
    if (b.skill === 'firebolt') sfx.fireHead(pts, P.key, P.sy, P.h, clock());   // (the Firebolt's own head: skillfx.js)
    nextBolts.add(b);
  }
  function boltsLand(now) {                                     // a bolt gone since the last frame has landed: burst where it was
    for (const b of liveBolts) if (!nextBolts.has(b)) {
      const t = trails.get(b); if (!t || !t.length) continue;
      const small = b.kind === 'arrow' || b.kind === 'bolt';
      fx.burst(t[t.length - 2], t[t.length - 1], BOLT_RGB[b.kind] || BOLT_RGB.bolt, { now, size: small ? 0.55 : 1, ember: b.kind === 'fire' });
      if (b.kind === 'fire' && b.skill !== 'firebolt') blast(t[t.length - 2], t[t.length - 1], now, 0.3, 0.9);   // (a Firebolt's own: its 'skill' event)
    }
    const o = liveBolts; liveBolts = nextBolts; nextBolts = o; nextBolts.clear();
  }

  // Camera: follows the hero, but in a town square (world.hub) it eases onto the square's
  // fixed framing, so the square sits still like a home screen while the hero moves in it.
  let camT = 0, leadT = 0, shake = null;             // shake: a blow's short camera jolt (jolt below)
  // The feel of a hit (the feel pass, docs/combat-fx.md; Luminati's hit-stop and shake tables, combat-catalog.md §F): each
  // kind of moment its hold (ms of the world held still: main.js) and its jolt (px of the native window, ms). A blow's
  // jolt is thrown along it, from the one who struck, then settles; the rest shake in place. Only near the hero (14
  // tiles: on screen), and × the menu's Hit feel (feelK: full 1, light 0.5, off 0). A stronger jolt running is kept.
  const FEEL = {
    crit: { stop: 35, amp: 0.9, ms: 110 },            // our crit on a foe
    heavy: { stop: 50, amp: 1.6, ms: 160 },           // our heavy blow (an ability)
    heavyCrit: { stop: 75, amp: 2.0, ms: 170 },
    struck: { stop: 0, amp: 1.2, ms: 120 },           // a foe's crit on one of us
    struckHeavy: { stop: 65, amp: 2.2, ms: 180 },     // an elite's heavy blow on one of us
    struckBoss: { stop: 90, amp: 3.0, ms: 240 },      // a boss's
    nova: { stop: 45, amp: 1.8, ms: 170 },            // Frost Nova, Turn Undead bursting
    blast: { stop: 60, amp: 2.8, ms: 220 },           // the Firebolt's explosion
    stamp: { stop: 0, amp: 2.4, ms: 260 },            // the Toadking's stamp
    bell: { stop: 0, amp: 1.4, ms: 420 },             // the Abbess's bell
    down: { stop: 110, amp: 2.4, ms: 220 },           // one of us falls
    bossDown: { stop: 140, amp: 3.2, ms: 320 },       // a boss falls
  };
  let feelMul = 1, stopMs = 0;
  /** a moment's feel at (x, y), its blow from (ax, ay) when it has one @param {keyof FEEL} kind */
  function jolt(kind, x, y, ax = null, ay = null) {
    const F = FEEL[kind], pl = sim.state.player;
    if (!F || !feelMul || Math.hypot(x - pl.x, y - pl.y) > 14) return;
    stopMs = Math.max(stopMs, F.stop * feelMul);
    const amp = F.amp * feelMul, now = clock();
    if (shake) { const a = (now - shake.t0) / shake.ms; if (a < 1 && shake.amp * (1 - a) * (1 - a) >= amp) return; }
    let ux = 0, uy = 0;
    if (ax != null) { const dx = x - ax, dy = y - ay, sx = dx - dy, sy = (dx + dy) / 2, l = Math.hypot(sx, sy); if (l > 0.01) { ux = sx / l; uy = sy / l; } }   // (the blow's way on screen: iso)
    shake = { t0: now, amp, ms: F.ms, ux, uy };
  }
  function camera(ix, iy, pz) {
    const hub = sim.world.hub;
    let cx = ix, cy = iy;
    if (hub) {
      const d = Math.hypot(ix - hub.x, iy - hub.y), want = d < hub.r - 6 ? 1 : d > hub.r ? 0 : (hub.r - d) / 6;
      camT += (want - camT) * 0.08;
      const t = camT * camT * (3 - 2 * camT);
      cx = ix + (hub.focus.x - ix) * t; cy = iy + (hub.focus.y - iy) * t;
    } else camT = 0;
    // On a town's approach road the camera leads toward the gate, so the gate is in the frame from the arrival on
    // (world.lead: the road's zone, the point to lead toward, and how far, 0..1; docs/town-layout-proposal.md)
    const lead = sim.world.lead;
    if (lead) {
      const inZone = ix > lead.x0 && ix < lead.x1 && iy > lead.y0 && iy < lead.y1;
      leadT += ((inZone ? 1 : 0) - leadT) * 0.05;
      const e = leadT * leadT * (3 - 2 * leadT) * lead.k;
      cx += (lead.x - ix) * e; cy += (lead.y - iy) * e;
    } else leadT = 0;
    const C = project(cx, cy, pz), t = camT * camT * (3 - 2 * camT);
    const anchor = (sideL ? 0.52 : 0.47) + (0.56 - 0.47) * t;   // hero sits higher (party cards below; level with no cards there); the square keeps its framing
    let jx = 0, jy = 0;
    if (shake) {
      const a = (clock() - shake.t0) / shake.ms;
      if (a >= 1) shake = null;
      else {
        const k = shake.amp * (1 - a) * (1 - a), push = Math.cos(a * Math.PI * 3);   // (thrown along the blow, back past, settling)
        jx = Math.round(shake.ux ? shake.ux * k * push + Math.sin(a * 37) * k * 0.3 : Math.sin(a * 37) * k);
        jy = Math.round(shake.ux || shake.uy ? shake.uy * k * push * 0.7 + Math.cos(a * 29) * k * 0.25 : Math.cos(a * 29) * k * 0.6);
      }
    }
    // SUB-PIXEL SCROLL (critic pass 3: the world stepped in whole native pixels — 3 CSS px — in
    // an uneven 1-1-2 cadence, a judder over the whole screen). The window is rendered at the
    // camera rounded UP (ox, oy) and PASS B shifts the upscaled image back by the fraction
    // (rx − ox, a value in (−1, 0]), so the world glides; figures land on the nearest pixel.
    const rx = nvw / 2 + ((sideL - safeR) * vw) / (2 * window.innerWidth * S) - C.sx + jx, ry = nvh * anchor - C.sy + jy;
    return { ox: Math.ceil(rx), oy: Math.ceil(ry), rx, ry };
  }
  // another world painter (src/render3d/hybrid.js: Luminati, the port plan's trial): it draws the world and the figures
  // behind this renderer's overlay, from this camera and this frame's draws; here the bake, the stamping and the light
  // passes are skipped, and everything over the world (the minimap, names, plaques, bars, numbers, the banner, the
  // stick) and every tap test stay as they are. null: Emberlit draws the world itself.
  /** @type {null | { ready: (world: any) => boolean, frame: (draws: any[], cam: any) => void }} */
  let ext = null;
  // dev: the Stage's lineup (src/dev/stage.js, ?dev&scene=stage&show=cast|fx): a function of the render clock giving
  // figures to draw as any actor at a clip and a moment, through the same draws as the game's own people (only: the
  // game's own not drawn)
  /** @type {null | ((now: number) => { only?: boolean, figures: { actor: string, x: number, y: number, dir?: number, clip?: string, t?: number, at?: number, seed?: number, team?: number }[] })} */
  let stageFn = null;
  let lastCam = { ox: 0, oy: 0, rx: 0, ry: 0 }, lastDrawn = 0;   // (lastDrawn: the frame's clock, so npcAt knows a drawn position is current)
  /** @type {((draws: any[], view: { hx: number, hy: number, nvw: number, ix: number, iy: number }) => void) | null} */
  let heard = null;                                   // a listener for each frame's figures (the sound); reads, never writes

  function render(alpha, now) {
    clockNow = now;
    const p = sim.state.player;
    const ix = p.px + (p.x - p.px) * alpha, iy = p.py + (p.y - p.py) * alpha;
    const pz = heightAt(sim.world, Math.floor(ix), Math.floor(iy));
    const P = project(ix, iy, pz);
    const { ox, oy } = (lastCam = camera(ix, iy, pz)); lastDrawn = now;

    const t0 = performance.now();
    windGlowNow(clock());
    {                                                              // (the painter's level built is the scene's being ready)
      const ok = !!ext && ext.ready(sim.world);                    // (before the painter's module is in, or its level built: black)
      if (!ok && !terrValid && !transit) transit = { fadeFrom: 0 };
      if (ok && !terrValid) { terrValid = true; if (transit) transit.fadeFrom = t0; }
      if (!ok) terrValid = false;
    }
    if (transit && !terrValid) {                                   // the new scene is still building: the scene's name
      octx.clearRect(0, 0, vw, vh); drawBanner(now);
      return;
    }

    // this frame's figures, depth-sorted by (x+y) so nearer ones come after farther ones: the painter's to draw
    const draws = [], party = sim.state.party, H = party[0];
    const lerp = (u, k) => (u['p' + k] === undefined ? u[k] : u['p' + k] + (u[k] - u['p' + k]) * alpha);   // between 20 Hz steps
    const lookOf = (u, fade = 0) => ({ flash: u.flash > 0 ? 0.32 : 0, fade });
    const GHOST = { ghost: 1 };
    // the hero
    const hAtl = H.actor && H.actor !== 'hero_knight' ? memberAtlas(H, H.actor) : heroAtlas;
    if (hAtl) {                                       // (until its atlas is in, the hero isn't drawn, as a companion isn't: the old paper doll read as a pink stand-in)
      const heroAtlas = hAtl;
      const tn = talkingTo && !p.moving && (sim.world.npcs || []).find((n) => n.id === talkingTo);   // in a conversation: face them
      const a = pickAnim(H, heroAtlas, { now, x: ix, y: iy, moving: p.moving, faceX: tn ? tn.x - ix : H.fx, faceY: tn ? tn.y - iy : H.fy, facing: H.act > 0 || !!tn, dead: H.down, stride: STRIDE.hero });
      draws.push({ d: ix + iy + 0.01, fx: ox + P.sx, fy: oy + P.sy, h: pz * ZH, k: ix + iy, look: lookOf(H, H.down ? 0.35 : 0), team: 1, atl: heroAtlas, a, u: H });
    }
    // companions: their sim positions (they follow you, or fight on their own)
    party.slice(1).forEach((m, i) => {
      const atl = memberAtlas(m, m.actor || MEMBER_LOOK[m.cls]); if (!atl || m.x === undefined) return;
      const mx = lerp(m, 'x'), my = lerp(m, 'y'), f = fol[i] || (fol[i] = {}); f.x = mx; f.y = my;
      const cz = heightAt(sim.world, Math.floor(mx), Math.floor(my)), cp = project(mx, my, cz);
      const a = pickAnim(m, atl, { now, x: mx, y: my, moving: m.moving, faceX: m.fx, faceY: m.fy, facing: m.act > 0 || !m.moving, dead: m.down, sit: m.sitting && !m.moving, stride: STRIDE.hero, seed: 0.37 * (i + 1) });
      const up = raisedAt.get(m), rl = raisedLook(up === undefined ? undefined : (now - up) / 1000);   // just raised (fx.js)
      const look = m.fallen || rl === 'ghost' ? GHOST : rl !== null ? { flash: rl, fade: 0 } : lookOf(m, m.down ? 0.35 : 0);
      draws.push({ d: mx + my, fx: ox + cp.sx, fy: oy + cp.sy, h: cz * ZH, k: mx + my, look, team: m.fallen ? undefined : 1, atl, a, u: m.fallen ? null : m });
    });
    // named townsfolk (sim world.npcs): idle where they stand, turning to you as you come near, with a
    // gesture now and then. Their playback state is presentation-only, kept here by NPC id.
    // (townsfolk walk a routine, world doc §5 v1.6: interpolated like everyone else, walking where they're headed)
    for (const n of sim.world.npcs || []) {
      const def = cast[n.id], atl = def && partyAtlas(def.look); if (!atl) continue;
      const qx = n.folk ? lerp(n, 'x') : n.x, qy = n.folk ? lerp(n, 'y') : n.y;
      const nz = heightAt(sim.world, Math.floor(qx), Math.floor(qy)), np = project(qx, qy, nz), nx = ox + np.sx, ny = oy + np.sy;
      if (nx < -60 || nx > nvw + 60 || ny < -40 || ny > nvh + 120) continue;
      let u = npcPres.get(n.id);
      if (!u) { const h = idHash(n.id); npcPres.set(n.id, (u = { fidgetN: 0, lookN: 0, h, seed: (h % 997) / 997, next: now + 2500 + (h % 6000), near: false })); }
      u.qx = qx; u.qy = qy; u.qz = nz; u.drawn = now;                   // where they're drawn, for a tap (npcAt)
      const near = Math.hypot(ix - n.x, iy - n.y) < 7, talking = talkingTo === n.id;
      if (greet === n.id) { greet = null; u.fidgetN++; u.next = now + 2600; }   // a greeting as the conversation opens
      else if (near && !u.near && !talking) u.lookN++;                  // she looks up as you come over
      else if (now > u.next) {                                         // a gesture: often in a conversation, now and then otherwise
        if (talking && u.fidgetN % 2) u.lookN++; else u.fidgetN++;
        const r = Math.imul(u.fidgetN + u.lookN + 1, 2654435761) ^ u.h;
        u.next = now + (talking ? 2800 + (r >>> 0) % 2400 : 7000 + (r >>> 0) % 6000);
      }
      u.near = near;
      const walking = !!n.moving;
      const a = pickAnim(u, atl, { now, x: qx, y: qy, moving: walking, faceX: walking ? n.fx : near || talking ? ix - qx : -1, faceY: walking ? n.fy : near || talking ? iy - qy : 1, facing: true, dir0: 2, stride: strideOf(atl, STRIDE.walk), seed: u.seed });
      draws.push({ d: qx + qy, fx: nx, fy: ny, h: nz * ZH, k: qx + qy, look: lookOf(n), team: 0, atl, a, id: n.id, who: u });
    }
    // the crowd (pass 11f): no id, so a tap never picks one
    { const crowd = crowdOf(sim.world); if (crowd.length) stepCrowd(sim.world, crowd, now);
      for (const v of crowd) {
        const atl = partyAtlas(v.look); if (!atl) continue;
        const vz = heightAt(sim.world, Math.floor(v.x), Math.floor(v.y)), vp = project(v.x, v.y, vz), vx = ox + vp.sx, vy = oy + vp.sy;
        if (vx < -60 || vx > nvw + 60 || vy < -40 || vy > nvh + 120) continue;
        const a = pickAnim(v.u, atl, { now, x: v.x, y: v.y, moving: v.moving, faceX: v.fx, faceY: v.fy, facing: true, dir0: 2, stride: strideOf(atl, STRIDE.walk), seed: v.u.seed });
        draws.push({ d: v.x + v.y, fx: vx, fy: vy, h: vz * ZH, k: v.x + v.y, look: CROWD_LOOK, team: 0, atl, a, noXray: true, who: v.u });
      } }
    // the dead on the barrows road (sim road.js; world doc §3.1 v1.9): ranks standing at ease, facing north
    // up the road for the relief that never came. No ring, no bar: they aren't in a fight with you.
    for (const q of sim.world.pickets || []) {
      const atl = enemyAtlas(q.kind); if (!atl) continue;
      const qz = heightAt(sim.world, Math.floor(q.x), Math.floor(q.y)), qp = project(q.x, q.y, qz), qx = ox + qp.sx, qy = oy + qp.sy;
      if (qx < -60 || qx > nvw + 60 || qy < -40 || qy > nvh + 120) continue;
      const a = pickAnim(q, atl, { now, x: q.x, y: q.y, moving: false, faceX: -0.25, faceY: -1, facing: true, dir0: 2, stride: STRIDE.skel, seed: (q.x * 0.37 + q.y * 0.11) % 1 });
      draws.push({ d: q.x + q.y, fx: qx, fy: qy, h: qz * ZH, k: q.x + q.y, look: { flash: 0, dissolve: 0 }, team: 0, atl, a, who: q });
    }
    // the farm beasts, at their ease (beastFrame): no ring, no tap; the painter stands the frame's sprite (env)
    for (const bst of beastList()) {
      const st = bst.st, bz = heightAt(sim.world, Math.floor(st.x), Math.floor(st.y)), bp = project(st.x, st.y, bz), bxs = ox + bp.sx, bys = oy + bp.sy;
      if (bxs < -60 || bxs > nvw + 60 || bys < -40 || bys > nvh + 80) continue;
      const fid = st.id + beastFrame(bst, now), env = envMeta.sprites[fid] ? fid : envMeta.sprites[st.id] ? st.id : null; if (!env) continue;
      draws.push({ d: st.x + st.y, fx: bxs, fy: bys, h: bz * ZH, k: st.x + st.y, look: null, env });   // (env: the frame's sprite id, for the painter)
    }
    // enemies: one atlas per kind (ENEMY_ACTOR); the Ashbound rise from the ground, and the slain collapse, lie, then fade
    for (const e of sim.world.enemies || []) {
      if (e.kind === 'lantern') {                                                 // Brother Teague's lit cage (battle.js): the harvester's cage, held up at his side
        const lx = lerp(e, 'x'), ly = lerp(e, 'y'), lz = heightAt(sim.world, Math.floor(lx), Math.floor(ly)), lp = project(lx, ly, lz), sp = props.cage && props.cage[0];
        if (!sp || e.hp <= 0) continue;
        draws.push({ d: lx + ly + 0.05, sp, fx: ox + lp.sx, fy: oy + lp.sy - 12, h: lz * ZH + 12, k: lx + ly + 0.05, look: { flash: e.flash > 0 ? 0.36 : 0 }, uid: e.id, u: e, foe: true, lift: 12 });   // (lift: another painter stands it at his side, held up: hybrid.js)
        continue;
      }
      const skelAtlas = enemyAtlas(e.kind);
      if (!skelAtlas) continue;
      const undead = UNDEAD_LOOK.has(skelAtlas.name);
      const exi = lerp(e, 'x'), eyi = lerp(e, 'y');
      const ez = heightAt(sim.world, Math.floor(exi), Math.floor(eyi));
      const ep = project(exi, eyi, ez), ex = ox + ep.sx, ey = oy + ep.sy;
      if (ex < -60 || ex > nvw + 60 || ey < -40 || ey > nvh + 120) continue;      // offscreen
      const dead = e.hp <= 0, deadT = dead ? DEATH_T - Math.max(0, e.dead || 0) : 0;
      const a = pickAnim(e, skelAtlas, { now, x: exi, y: eyi, moving: e.moving, faceX: e.fx, faceY: e.fy, facing: true, dead, deadT, dir0: 2,
        spawnP: e.spawn > 0 && undead ? 1 - e.spawn / 0.5 : undefined, stride: undead ? STRIDE.skel : strideOf(skelAtlas, STRIDE.walk), seed: (e.id * 0.37) % 1 });
      const fade = dead ? Math.max(0, (deadT - (DEATH_T - 0.35)) / 0.35) : 0;
      draws.push({ d: exi + eyi, fx: ex, fy: ey, h: ez * ZH, k: exi + eyi, look: { flash: e.flash > 0 ? 0.36 : 0, warn: dead ? 0 : windGlow.get(e.id) || 0, dissolve: dead ? fade : !undead && e.spawn > 0 ? e.spawn / 0.5 : 0 }, team: dead ? 0 : e.elite ? 3 : 2, atl: skelAtlas, a, uid: e.id, u: e, foe: true });   // (the living walk in out of the dark: a fade, not a rise)
    }
    // bolts in flight: small glowing sprites, a little above the ground
    for (const b of sim.world.projectiles || []) {
      if (!b.kind) continue;
      const bx = lerp(b, 'x'), by = lerp(b, 'y'), bz = heightAt(sim.world, Math.floor(bx), Math.floor(by)), bp = project(bx, by, bz);
      let sp;
      if (b.kind === 'arrow') { const vx = b.tgt.x - b.sx, vy = b.tgt.y - b.sy, a = Math.atan2((vx + vy) * HH, (vx - vy) * HW); sp = arrowSprite(((Math.round(a / (Math.PI / 8)) % 16) + 16) % 16); }
      else sp = boltSprite(b.kind);
      draws.push({ d: bx + by + 0.2, sp, fx: ox + bp.sx, fy: oy + bp.sy - 18, h: bz * ZH + 18, k: bx + by + 1.5, lift: 18, glow: b.kind !== 'arrow' && b.kind !== 'bolt' });   // (lift, glow: hybrid.js stands it in Luminati's world, lit by its own light)
    }
    if (globalThis.__trace) globalThis.__trace.push({ t: now, ox, oy, rx: lastCam.rx, ry: lastCam.ry, ix, iy, mv: p.moving,   // dev: motion trace (per rendered frame)
      party: draws.filter((d) => d.team === 1 && d.a).map((d) => [d.fx, d.fy, d.a.frame, d.a.dir]),
      foes: draws.filter((d) => d.team >= 2 && d.a && d.atl).map((d) => [d.fx, d.fy, d.a.frame, d.a.dir, d.atl.name, d.uid]) });
    if (heard) heard(draws, { hx: ox + P.sx, hy: oy + P.sy, nvw, ix, iy });   // the sound's listener (audio/listen.js): steps, swings, who's where
    if (stageFn) {                                                 // dev: the Stage's figures (after the sound's listener: they make none)
      const S0 = stageFn(now);
      if (S0.only) draws.length = 0;
      for (const q of S0.figures) {
        const atl = actorAtlas(q.actor); if (!atl) continue;
        const C = atl.meta.clips, c = C[q.clip || 'idle'] || C.idle, held = q.t !== undefined || q.at !== undefined, t = q.at !== undefined ? q.at * (c.len / c.fps) : q.t ?? (now / 1000 + (q.seed || 0) * (c.len / c.fps));
        const frame = c.start + (held || c.once ? Math.min(c.len - 1, Math.max(0, Math.floor(t * c.fps))) : Math.floor(t * c.fps) % c.len);
        const z = heightAt(sim.world, Math.floor(q.x), Math.floor(q.y)), pp = project(q.x, q.y, z);
        draws.push({ d: q.x + q.y, fx: ox + pp.sx, fy: oy + pp.sy, h: z * ZH, k: q.x + q.y, look: { flash: 0, fade: 0 }, team: q.team, atl, a: { dir: q.dir ?? 2, frame, atk: null }, u: q });
      }
    }
    if (globalThis.__noactors) draws.length = 0;   // dev: tools/actor-lab backdrop capture
    draws.sort((a, b) => a.d - b.d);
    // the fight's ground (its hazards, the team rings) is the painter's, from the battle (ext.frame below)
    const hb = sim.battle, rings = !!sim.battle;
    sEMI.fill(0);
    const fxKey = { base: Math.floor(ix + iy) - 64, step: 0.5 };   // (the painter tests the effects' depth itself: fx.js flush)
    {
    // the effects alone, on black (the EMISSIVE plane), for the painter to lay over its world as light: weapon effects
    // over the figures, then the hit sparks
    fx.target({ EMI: sEMI, W: nvw, H: nvh, KEY: fxKey });
    for (const dr of draws) if (dr.atl && dr.a.atk) fx.weapon(dr.atl, dr.a, dr.fx, dr.fy, dr.h, dr.k);
    const fxProj = (x, y) => { const z = heightAt(sim.world, Math.floor(x), Math.floor(y)), q = project(x, y, z); return { sx: ox + q.sx, sy: oy + q.sy, h: z * ZH, key: x + y }; };
    for (const b of sim.world.projectiles || []) if (b.kind) boltFx(b, lerp(b, 'x'), lerp(b, 'y'), b.kind, fxProj);
    boltsLand(clock());
    for (const e of sim.world.enemies || []) if (e.dead && !gone.has(e) && e.kind !== 'lantern') {   // a foe goes out
      gone.add(e); const fs = styleOfSrc(e.kind, true, ENEMY_ACTOR);
      fx.soul(e.x, e.y, (fs && fs.spark) || [220, 220, 235], { now: clock(), big: !!(e.boss || e.elite) });
    }
    fx.particles(now, fxProj);
    if (hb && hb.flood > 0 && hb.edge) floodGlints(hb, fxProj, now);   // (the painter lays the water itself: its sparse glints as light)
    sfx.draw(now, fxProj, draws.filter((dr) => dr.u).map((dr) => ({ u: dr.u, foe: !!dr.foe, sx: dr.fx, sy: dr.fy, h: dr.h, key: dr.k })));   // the skills' moments and auras (skillfx.js)
    // the Fens' marsh-lights over the meres, as the lamps come up (dusk, night): presentation only, one a mere, kept off the world
    if (sim.world.marsh) fx.wisps(now, fxProj, wispsOf(sim.world), Math.min(1.2, Math.max(0, (sky.lamp - 0.4) / 0.6)));

    }
    // the painter's frame: the figures, the camera, the effects' light (EMI, native px) and the fight's ground
    if (ext) ext.frame(draws, { ox, oy, rx: lastCam.rx, ry: lastCam.ry, S, k: vw / window.innerWidth, vw, vh, nvw, nvh, pz, now, t: skyHoldT ?? sim.state.t, emi: sEMI, key: fxKey, battle: hb, rings, blast: blastNow(clock()), warns: warnsNow(clock()), spells: spellsNow(clock()) });   // (t: the held look's, the title's dusk; blast: a fire landing's light)
    if (globalThis.__rstats) globalThis.__rstats.cpu.push(performance.now() - t0);
    const outdoor = sim.world.kind !== 'dungeon';
    skyAt(skyHoldT ?? sim.state.t, skyNow); lastNow = now;
    const ease = Math.min(1, (now - skyEase0) / SKY_EASE); mixSky(sky, skyFrom, skyNow, ease * ease * (3 - 2 * ease));
    const wx = outdoor ? weatherNow(sim) : NO_WEATHER, wLight = lightOf(sky); weatherLight(sky, wx);   // rain, fog, snow: mostly in the light (weatherfx.js)

    // the overlay (above the painter's world): the minimap, names, bars, numbers, the banner, the floating joystick
    octx.clearRect(0, 0, vw, vh);
    // (under the minimap and labels; with another painter, its own rain and snow fall in its world, so ours don't: they
    // doubled up, and fell over the top bar's words, this canvas being above it)
    if (wx.k && !(wx.kind === 'rain' || wx.kind === 'snow')) drawWeather(octx, wx, { vw, vh, S, camX: -lastCam.rx, camY: -lastCam.ry, now, light: wLight });
    if (sim.world.kind === 'dungeon') { drawShrines(lastCam.rx, lastCam.ry, ix, iy); drawStairs(lastCam.rx, lastCam.ry, ix, iy); drawMinimap(ix, iy); } else { if (camT < 0.5) drawOutdoorMinimap(ix, iy); drawLabels(lastCam.rx, lastCam.ry, ix, iy); if (sim.world.kind === 'overland') drawCampRings(lastCam.rx, lastCam.ry, ix, iy, now); }   // no minimap on the town's home screen
    drawGoal(lastCam.rx, lastCam.ry, now);                 // overlays use the exact camera: glued to the gliding world
    drawBattle(lastCam.rx, lastCam.ry, ix, iy, pz, now);
    if (transit) {                                                 // fading in from the scene change
      const a = 1 - (t0 - transit.fadeFrom) / TRANSIT_FADE;
      if (a <= 0) transit = null; else { octx.fillStyle = `rgba(0,0,0,${a.toFixed(3)})`; octx.fillRect(0, 0, vw, vh); }
    }
    drawBanner(now);
    const j = input.joystick();
    if (j) {
      const k = vw / window.innerWidth;                            // (the stick in CSS px, onto this overlay's own pixels)
      octx.strokeStyle = 'rgba(200,220,180,0.25)'; octx.lineWidth = 2;
      octx.beginPath(); octx.arc(j.bx * k, j.by * k, 46 * k, 0, Math.PI * 2); octx.stroke();
      octx.fillStyle = 'rgba(240,165,0,0.5)'; octx.beginPath(); octx.arc(j.kx * k, j.ky * k, 18 * k, 0, Math.PI * 2); octx.fill();
    }
  }

  // Fog-of-war minimap, top-right: discovered rooms in the theme tint, corridors
  // that lead out of them (so unexplored exits are visible), and the hero marker.
  // Outdoor minimap: the whole map pre-rendered once per scene (ground, water, roads,
  // structures), shown top-down like the dungeon's, with the hero dot.
  function drawOutdoorMinimap(ix, iy) {
    const w = sim.world, k = vw / window.innerWidth, MM = 96 * k, pad = 6 * k;
    const bx = vw - MM - pad - (MM_RIGHT + safeR) * k, by = mmTop() * k, x0 = -12, y0 = -12, span = Math.max(w.W, w.H) + 24;
    if (!outMap) {
      const N = 128, c = document.createElement('canvas'); c.width = c.height = N; const x = c.getContext('2d'), img = x.createImageData(N, N);
      const COL = [[46, 64, 42], [96, 80, 60], [104, 98, 104], [40, 86, 118], [70, 60, 48], [128, 110, 60], [112, 100, 86], [196, 202, 208]];
      for (let py = 0; py < N; py++) for (let px = 0; px < N; px++) {
        const tx = x0 + (px + 0.5) * span / N, ty = y0 + (py + 0.5) * span / N, m = materialAt(w, tx, ty), i = (py * N + px) * 4;
        const turf = w.region === 'reach' ? [58, 54, 48] : w.region === 'heights' ? [74, 82, 78] : COL[0];   // (the ash scrub and frost-bitten turf, scree and snow: the Reach's and the Heights')
        const cc = m === 'grass' ? turf : COL[['grass', 'dirt', 'cobble', 'water', 'bank', 'field', 'scree', 'snow'].indexOf(m)] || COL[0];
        img.data[i] = cc[0]; img.data[i + 1] = cc[1]; img.data[i + 2] = cc[2]; img.data[i + 3] = 235;
      }
      x.putImageData(img, 0, 0);
      for (const st of w.structs) {
        const f = envMeta && envMeta.sprites[st.id]; if (!f) continue;
        if (st.id.startsWith('ug_')) continue;                   // (the undergrowth isn't mapped: a tuft isn't a landmark)
        const tree = /pine|oak|autumn|dead|grove|alder|willow|carr|mountain|rock/.test(st.id), sx = (st.x - x0) * N / span, sy = (st.y - y0) * N / span;
        x.fillStyle = /mountain/.test(st.id) ? 'rgba(120,118,128,0.9)' : tree ? 'rgba(24,44,28,0.9)' : 'rgba(170,86,70,0.95)';
        const r = tree ? (/grove|mountain/.test(st.id) ? 3 : 1.3) : 2.2; x.fillRect(sx - r, sy - r, r * 2, r * 2);
      }
      outMap = c;
    }
    octx.fillStyle = 'rgba(10,8,16,0.60)'; octx.fillRect(bx - pad, by - pad, MM + 2 * pad, MM + 2 * pad);
    octx.imageSmoothingEnabled = true; octx.drawImage(outMap, bx, by, MM, MM);
    octx.strokeStyle = 'rgba(130,120,160,0.35)'; octx.lineWidth = Math.max(1, k); octx.strokeRect(bx - pad, by - pad, MM + 2 * pad, MM + 2 * pad);
    // places of note: diamonds (the Barrows violet — the way down; Thornwick gold; others pale)
    for (const L of w.labels || []) {
      if (L.service || hiddenHere(L)) continue;
      const mx = bx + (L.x - x0) / span * MM, my = by + (L.y - y0) / span * MM, r = Math.max(2.5, 3.2 * k);
      octx.fillStyle = /Barrows/.test(L.text) ? '#b48cff' : /Thornwick|Saltmere|Ashgate|Frosthold/.test(L.text) ? '#e0b060' : 'rgba(220,210,190,0.85)';
      octx.beginPath(); octx.moveTo(mx, my - r); octx.lineTo(mx + r, my); octx.lineTo(mx, my + r); octx.lineTo(mx - r, my); octx.closePath(); octx.fill();
      octx.strokeStyle = 'rgba(0,0,0,0.55)'; octx.lineWidth = Math.max(1, 0.8 * k); octx.stroke();
    }
    octx.fillStyle = '#f0a500'; octx.beginPath(); octx.arc(bx + (ix - x0) / span * MM, by + (iy - y0) / span * MM, Math.max(2, 2.6 * k), 0, Math.PI * 2); octx.fill();
    octx.strokeStyle = 'rgba(0,0,0,0.6)'; octx.stroke();
  }
  // Place names float over nearby landmarks (the tavern, the guild hall, the keep…).
  // a door label's plaque as last drawn (canvas px), for a tap (doorAt): a way somewhere, tapped to walk there
  const doorRects = [], plaqueRects = [];   // (plaqueRects: the square's service plaques as last drawn, canvas px: a test reads them)
  function drawLabels(ox, oy, ix, iy) {
    const k = vw / window.innerWidth, z = heightAt(sim.world, 0, 0);
    doorRects.length = 0; plaqueRects.length = 0;
    octx.font = `600 ${Math.round(11 * k)}px Georgia, 'Times New Roman', serif`; octx.textAlign = 'center';
    for (const L of sim.world.labels || []) {
      const d = Math.hypot(L.x - ix, L.y - iy); if (d > (L.service && camT > 0.5 ? 90 : L.door ? 70 : 60) || hiddenHere(L)) continue;   // (on the home screen every service's plaque, however far: the temple heads the square)
      const top = (L.top ? L.top * 9.8 : (envMeta && L.id && envMeta.sprites[L.id]) ? envMeta.sprites[L.id].top * 9.8 : 100) * (L.door ? 0.62 : 1);   // (a door's sign hangs on it, at its beam; a service's plaque at its set height, sim outdoor.js SIGN_TOP)
      const P = project(L.x, L.y, z), sy0 = (oy + P.sy - top - 10) * S; let sx = (ox + P.sx) * S;
      if (L.service ? (sx < -vw * 0.3 || sx > vw * 1.3 || sy0 < -vh * 0.4 || sy0 > vh) : (sx < 0 || sx > vw || sy0 < -40 * k || sy0 > vh)) continue;
      const sy = Math.max(sy0, (hudB + 22) * k);               // never under the top HUD: a tall spire's label slides down below it
      const a = L.service && camT > 0.5 ? 1 : Math.max(0, Math.min(1, (60 - d) / 20));   // on the home screen every service reads
      if (L.service) {                                              // service plaques: tappable-looking signs
        const tw = octx.measureText(L.text).width + 14 * k, th = 17 * k, ax = sx;   // (ax: where it hangs, before it's kept on screen)
        sx = Math.min(Math.max(sx, tw / 2 + 4 * k), vw - tw / 2 - 4 * k);      // a service at the frame's edge keeps its plaque on screen
        if (sy > (hudL1 + 114) * k && sy - th < (hudL1 + 288) * k) sx = Math.min(sx, vw - tw / 2 - (62 + safeR) * k);   // ...and clear of the compass, journal and world map buttons on the right (ui/compass.js, ui/journal.js, ui/worldmap.js: right 12, 44 wide, from 122 to 284 under the bar's line 1)
        octx.fillStyle = `rgba(16,12,22,${0.78 * a})`; octx.strokeStyle = `rgba(214,170,98,${0.55 * a})`; octx.lineWidth = Math.max(1, k);
        octx.beginPath(); octx.roundRect(sx - tw / 2, sy - th + 4 * k, tw, th, 5 * k); octx.fill(); octx.stroke();
        plaqueRects.push({ kind: L.service, ax, x0: sx - tw / 2, y0: sy - th + 4 * k, x1: sx + tw / 2, y1: sy + 4 * k });
        octx.fillStyle = `rgba(240,200,128,${a})`; octx.fillText(L.text, sx, sy);
        continue;
      }
      if (L.door) {                                                 // a way somewhere (the Mere Tower's punt): a sign with a ›, tapped to walk there
        const t = L.text + '  ›', tw = octx.measureText(t).width + 16 * k, th = 19 * k, y0 = sy - th + 5 * k;
        sx = Math.min(Math.max(sx, tw / 2 + 4 * k), vw - tw / 2 - 4 * k);       // (kept on screen whole, as a service's is)
        octx.fillStyle = `rgba(16,12,22,${0.82 * a})`; octx.strokeStyle = `rgba(232,190,110,${0.85 * a})`; octx.lineWidth = Math.max(1.5, 1.5 * k);
        octx.beginPath(); octx.roundRect(sx - tw / 2, y0, tw, th, 6 * k); octx.fill(); octx.stroke();
        octx.fillStyle = `rgba(250,214,140,${a})`; octx.fillText(t, sx, sy);
        if (a > 0.3) doorRects.push({ x0: sx - tw / 2, y0, x1: sx + tw / 2, y1: y0 + th, L });
        continue;
      }
      octx.fillStyle = `rgba(8,5,14,${0.7 * a})`; octx.fillText(L.text, sx + k, sy + k);
      octx.fillStyle = `rgba(236,214,170,${0.92 * a})`; octx.fillText(L.text, sx, sy);
    }
    // named people: their name over their head as you come near (tap them to talk)
    for (const n of sim.world.npcs || []) {
      const d = Math.hypot(n.x - ix, n.y - iy), def = cast[n.id]; if (d > 12 || !def) continue;
      const a = Math.max(0, Math.min(1, (12 - d) / 4)), nz = heightAt(sim.world, Math.floor(n.x), Math.floor(n.y)), P = project(n.x, n.y, nz);
      const sx = (ox + P.sx) * S, sy = (oy + P.sy - 62) * S;
      octx.fillStyle = `rgba(8,5,14,${0.75 * a})`; octx.fillText(def.name, sx + k, sy + k);
      octx.fillStyle = `rgba(255,226,160,${a})`; octx.fillText(def.name, sx, sy);
    }
    // who has a quest for you (sim quests.js markKinds), bobbing over their head and seen from across the square: a "!"
    // for one to take, a "?" for one to hand in, the symbol saying which, not just the colour (the owner, 2026-11-11:
    // "stay yellow for non main quests. Change to blue for open or in progress main quests. Keep the green color for any
    // type of completed quests"):
    //   · a side quest to take: gold "!"     · a main quest to take: blue "!"   · a main quest under way: blue "?" at who
    //     takes it in, dimmer               · any quest to hand in: green "?"
    // A main quest's diamond is doubled (an inner outline), so main and side differ by shape as well as colour.
    const QM = sim.quests && sim.quests.markKinds ? sim.quests.markKinds() : {}, bob = Math.sin(clock() / 380) * 2;
    for (const n of sim.world.npcs || []) {
      const q = QM[n.id], d = Math.hypot(n.x - ix, n.y - iy); if (!q || d > 40 || !cast[n.id]) continue;
      const nz = heightAt(sim.world, Math.floor(n.x), Math.floor(n.y)), P = project(n.x, n.y, nz);
      const sx = (ox + P.sx) * S, sy = (oy + P.sy - (d <= 12 ? 80 : 68) + bob) * S, r = 12 * k;   // (over the name when it shows)
      if (sx < -20 * k || sx > vw + 20 * k || sy < (hudB + 14) * k || sy > vh) continue;
      const col = q.mark === 'ready' ? QUEST_DONE : q.main ? QUEST_MAIN : QUEST_SIDE, going = q.mark === 'going';
      const diamond = (rr) => { octx.beginPath(); octx.moveTo(sx, sy - rr * 1.25); octx.lineTo(sx + rr, sy); octx.lineTo(sx, sy + rr * 1.25); octx.lineTo(sx - rr, sy); octx.closePath(); };
      octx.globalAlpha = going ? 0.72 : 1;
      diamond(r); octx.shadowColor = col; octx.shadowBlur = (going ? 4 : 8) * k; octx.fillStyle = 'rgba(16,12,22,0.9)'; octx.fill(); octx.shadowBlur = 0;
      octx.lineWidth = Math.max(2, 2 * k); octx.strokeStyle = col; octx.stroke();
      if (q.main) { diamond(r * 0.74); octx.lineWidth = Math.max(1, 1.1 * k); octx.stroke(); }
      octx.font = `800 ${Math.round((q.main ? 15 : 17) * k)}px Georgia, 'Times New Roman', serif`; octx.textAlign = 'center'; octx.textBaseline = 'middle';
      octx.fillStyle = col; octx.fillText(q.mark === 'new' ? '!' : '?', sx, sy + 0.5 * k);
      octx.textBaseline = 'alphabetic'; octx.globalAlpha = 1;
    }
  }
  // The props a tap can use (a chest, a shrine, the stairs gate), each matched against its sprite as drawn
  // rather than the floor tile under the finger: a chest stands twice its old height and a shrine three
  // times, so a tap on the lid or the orb landed on the tile behind and only walked there (2026-10-01).
  // Within 3 native px of a drawn pixel counts; the nearest the camera wins. (nx, ny) are native px from
  // the camera origin.
  const USABLE = new Set(['chest', 'shrine', 'stairs', 'cage']);
  function propUnder(nx, ny) {
    const w = sim.world; if (!w.props) return null;
    let best = null;
    const dropped = [...w.mods].filter(([, m]) => m && m.cage && !m.opened).map(([k]) => [k, 'cage']);   // (a harvester's cage, where it fell: lamps.js)
    for (const [key, kind] of dropped.length ? [...w.props, ...dropped] : w.props) {
      if (!USABLE.has(kind) || (kind === 'stairs' && w.stairwell)) continue;
      const c = key.indexOf(','), tx = +key.slice(0, c), ty = +key.slice(c + 1);
      if (propAt(w, tx, ty) !== kind || (best && tx + ty <= best.tx + best.ty)) continue;
      const sp = props[kind] && props[kind][0]; if (!sp) continue;
      const P = project(tx + 0.5, ty + 0.5, heightAt(w, tx, ty)), lx = Math.floor(nx - (P.sx - sp.ax)), ly = Math.floor(ny - (P.sy - sp.ay));
      if (lx < -3 || ly < -3 || lx >= sp.w + 3 || ly >= sp.h + 3) continue;
      let hit = false;
      for (let dy = -3; dy <= 3 && !hit; dy++) for (let dx = -3; dx <= 3; dx++) { const X = lx + dx, Y = ly + dy; if (X >= 0 && Y >= 0 && X < sp.w && Y < sp.h && sp.mask[Y * sp.w + X]) { hit = true; break; } }
      if (hit) best = { tx, ty, kind };
    }
    return best;
  }
  // An unused shrine says what it is from across the room, and what it does as you come near (GDD §3.6):
  // its orb's colour, never the colour alone (v1.30: the name says which of the three, sim shrines.js). A used one
  // goes dark and unlabelled.
  const SHRINE_LABEL = {
    mend: { name: 'Shrine of Mending', rgb: '150,236,170', does: 'mends everyone, or raises one of the slain · once' },
    might: { name: 'Shrine of Might', rgb: '255,150,130', does: 'the party strikes harder: +25 % ATK for 2 minutes · once' },
    ward: { name: 'Shrine of Warding', rgb: '150,214,244', does: 'the party stands firmer: +25 % DEF for 2 minutes · once' },
  };
  function drawShrines(ox, oy, ix, iy) {
    const w = sim.world, sp = props.shrine && props.shrine[0]; if (!w.props || !sp) return;
    const k = vw / window.innerWidth;
    for (const [key, kind] of w.props) {
      if (kind !== 'shrine') continue;
      const c = key.indexOf(','), tx = +key.slice(0, c), ty = +key.slice(c + 1), d = Math.hypot(tx + 0.5 - ix, ty + 0.5 - iy);
      if (d > 14 || propAt(w, tx, ty) !== 'shrine') continue;
      const P = project(tx + 0.5, ty + 0.5, heightAt(w, tx, ty)), sx = (ox + P.sx) * S, sy = (oy + P.sy - sp.ay - 4) * S;
      if (sx < -60 * k || sx > vw + 60 * k || sy < (hudB + 14) * k || sy > vh) continue;
      const a = Math.max(0, Math.min(1, (14 - d) / 4)), sk = shrineKind(w, tx, ty), L = SHRINE_LABEL[sk];
      octx.textAlign = 'center'; octx.font = `700 ${Math.round(12 * k)}px Georgia, 'Times New Roman', serif`;
      octx.fillStyle = `rgba(6,10,14,${0.8 * a})`; octx.fillText(L.name, sx + k, sy + k);
      octx.fillStyle = `rgba(${L.rgb},${a})`; octx.fillText(L.name, sx, sy);
      if (d <= 6) {
        const b = Math.max(0, Math.min(1, (6 - d) / 2)), t2 = L.does;
        octx.font = `${Math.round(11 * k)}px Georgia, 'Times New Roman', serif`;
        octx.fillStyle = `rgba(6,10,14,${0.8 * b})`; octx.fillText(t2, sx + k, sy + 14 * k + k);
        octx.fillStyle = `rgba(200,236,240,${b})`; octx.fillText(t2, sx, sy + 14 * k);
      }
    }
  }
  // The ways up and down, signed (the owner, 2026-11-04: "The stairs arent obvious enough"): a sign over each, bobbing a
  // little, read across the room ("▲ Way out" on a first floor, "▲ Stairs up" deeper, "▼ Stairs down"), its edge gold
  // for up and violet for down (the arch below is lit violet), the arrow saying which as well as the colour. Tapped, it
  // walks the party there and takes them (a door sign's rect: main.js). In a fight too: the descent room's fight starts as
  // you come in, and that's when the way on is wanted. On either renderer: this is the overlay.
  const STAIR_SIGN = { out: ['▲ Way out', '232,190,110'], up: ['▲ Stairs up', '232,190,110'], down: ['▼ Stairs down', '176,140,255'] };
  function drawStairs(ox, oy, ix, iy) {
    const w = sim.world; doorRects.length = 0;
    const up = (w.structs || []).find((q) => /^stairsup/.test(q.id)), wl = w.stairwell, k = vw / window.innerWidth, bob = Math.sin(clock() / 420) * 2 * k;
    const signs = [];
    if (up && w.exitAt) signs.push({ kind: (w.depth || 0) === 0 ? 'out' : 'up', x: up.x, y: up.y, lift: 74, tx: Math.floor(w.exitAt.x), ty: Math.floor(w.exitAt.y) });
    if (w.stairsAt) signs.push({ kind: 'down', x: wl ? (wl.x0 + wl.x1) / 2 : w.stairsAt.x + 0.5, y: wl ? (wl.y0 + wl.y1) / 2 : w.stairsAt.y + 0.5, lift: 34, tx: w.stairsAt.x, ty: w.stairsAt.y });
    octx.textAlign = 'center'; octx.font = `700 ${Math.round(12 * k)}px Georgia, 'Times New Roman', serif`;
    for (const g of signs) {
      const d = Math.hypot(g.x - ix, g.y - iy); if (d > 44) continue;
      const P = project(g.x, g.y, heightAt(w, Math.floor(g.x), Math.floor(g.y))), sy = (oy + P.sy - g.lift) * S + bob; let sx = (ox + P.sx) * S;
      if (sx < -80 * k || sx > vw + 80 * k || sy < (hudB + 22) * k || sy > vh) continue;
      const [text, rgb] = STAIR_SIGN[g.kind], a = Math.max(0, Math.min(1, (44 - d) / 8));
      const tw = octx.measureText(text).width + 18 * k, th = 21 * k, y0 = sy - th + 6 * k;
      sx = Math.min(Math.max(sx, tw / 2 + 4 * k), vw - tw / 2 - 4 * k);   // (kept on screen whole, and clear of the right's buttons, as a plaque is)
      if (sy > (hudL1 + 114) * k && sy - th < (hudL1 + 288) * k) sx = Math.min(sx, vw - tw / 2 - (62 + safeR) * k);
      octx.fillStyle = `rgba(14,10,20,${0.84 * a})`; octx.strokeStyle = `rgba(${rgb},${0.9 * a})`; octx.lineWidth = Math.max(1.5, 1.6 * k);
      octx.beginPath(); octx.roundRect(sx - tw / 2, y0, tw, th, 6 * k); octx.fill(); octx.stroke();
      octx.fillStyle = `rgba(${rgb},${a})`; octx.fillText(text, sx, sy);
      if (a > 0.3) doorRects.push({ x0: sx - tw / 2, y0, x1: sx + tw / 2, y1: y0 + th, L: { stairs: g.kind, tx: g.tx, ty: g.ty } });
    }
  }
  // ── battle overlay: HP bars, floating numbers, ability callouts, the room-level · wave pill ──
  const floats = [];
  // numbers fan out: each new float near a recent one steps sideways/up so a melee doesn't stack them into mush
  const addFloat = (x, y, text, color, size = 12, rise = 22) => {
    const t0 = clock(), busy = floats.filter((f) => t0 - f.t0 < 450 && Math.hypot(f.x - x, f.y - y) < 1.5).length;
    floats.push({ x, y, text, color, size, rise, t0, jx: ((busy % 3) - 1) * 11 + (busy ? 0 : 0), jy: Math.floor(busy / 3) * 9 + (busy % 2) * 4 });
    if (floats.length > 40) floats.shift();
  };
  // a chest's gold rises off it, gilt; gear follows as its own beam and card (sheet.js)
  sim.bus.on('chestOpened', (c) => addFloat(c.x, c.y, '+' + c.gold + ' gold', '#ffd070', 11, 32));
  sim.bus.on('combat', (c) => {
    if (c.t === 'hit') {                                                          // sparks fly off the struck, away from the striker
      const st = styleOfSrc(c.src, c.party, ENEMY_ACTOR), a = project(c.ax ?? c.x, c.ay ?? c.y, 0), b = project(c.x, c.y, 0);
      let dx = b.sx - a.sx, dy = b.sy - a.sy; const l = Math.hypot(dx, dy); if (l > 1e-3) { dx /= l; dy /= l; } else { dx = 0; dy = -1; }
      const sc = (st && ((c.heavy && st.heavySpark) || st.spark)) || [255, 232, 200];
      fx.impact(c.x, c.y, dx, dy, sc, { heavy: c.heavy, crit: c.crit, now: clock() });
      if (c.heavy || c.crit) fx.shock(c.x, c.y, sc, { now: clock(), big: !!(c.heavy && c.crit) || !!(st && st.quake && c.heavy) });   // (v1.47) the blow thumps the ground
      if (st && st.quake && c.heavy) jolt('stamp', c.x, c.y);                // (v1.59) a golem's heavy blow shakes the room
      if (st && st.burn) blast(c.x, c.y, clock(), 0.22, 1.3);                // (v1.59) a fire beetle's spit bursts into light where it lands
    }
    if (c.t === 'hit') {
      addFloat(c.x, c.y, (c.crit ? c.amount + '!' : '' + c.amount), c.party ? '#ff6a5a' : c.crit ? '#ffd24a' : '#f2ece0', c.crit ? 15 : 12);
      const kind = c.party ? (c.boss ? 'struckBoss' : c.heavy ? 'struckHeavy' : c.crit ? 'struck' : null) : c.heavy ? (c.crit ? 'heavyCrit' : 'heavy') : c.crit ? 'crit' : null;
      if (kind) jolt(kind, c.x, c.y, c.ax, c.ay);
    }
    else if (c.t === 'miss') addFloat(c.x, c.y, 'miss', '#9a93a8', 10);
    else if (c.t === 'xp') addFloat(c.x, c.y, '+' + c.amount + ' xp', '#c8a0ff', 10, 30);
    else if (c.t === 'cinders') addFloat(c.x, c.y, '+' + c.amount + ' ✦', '#ff9440', 11, 36);   // an elite's or a boss's cinders, for the smith
    else if (c.t === 'ability') addFloat(c.x, c.y, c.name, '#ffb060', 11, 16);
    else if (c.t === 'down') { addFloat(c.x, c.y, c.name + ' falls', '#ff6a5a', 12, 26); jolt('down', c.x, c.y); }
    else if (c.t === 'rise') addFloat(c.x, c.y, c.name + ' rises', '#8fd08f', 12, 26);
    else if (c.t === 'fallen') addFloat(c.x, c.y, c.name + ' is slain', '#b8c4d8', 12, 30);
    else if (c.t === 'heal') addFloat(c.x, c.y, '+' + c.amount, '#8fe07a', 12, 20);
    else if (c.t === 'ward') addFloat(c.x, c.y, 'ward ' + c.amount, '#8fc8ff', 11, 20);
    else if (c.t === 'warded') addFloat(c.x, c.y, 'warded', '#8fc8ff', 10);
    else if (c.t === 'wardBreak') moment('ward_break', { by: c.id, tid: c.id, x: c.x, y: c.y }, { foeBy: false, ally: true });   // a ward spent: it shatters (skillfx.js)
    else if (c.t === 'hex') addFloat(c.x, c.y, 'hexed', '#b8e070', 11, 20);
    else if (c.t === 'freed') fx.beam(c.x, c.y, SOUL_FREE, { now: clock(), life: 1.4 });   // a bound foe laid down by its lamp's breaking: its soul goes up
    else if (c.t === 'lifeline') addFloat(c.x, c.y, 'Lifeline', '#f0e0a0', 12, 24);
  });
  const LOOT_RGB = { common: [220, 208, 185], fine: [120, 235, 110], rare: [90, 160, 255], heirloom: [255, 165, 50] };
  sim.bus.on('skill', (e) => {                                  // a skill's moment (battle.js skillEv)
    if (LUM_SPELLS.has(e.id)) spellEvent(e, clock());   // (these skills in Luminati's own looks: tools/render3d/world.js)
    else { sfx.event(e, clock()); if (LUM_ALSO.has(e.id)) spellEvent(e, clock()); }   // (and these with its pieces beside our light)
    if (e.id === 'firebolt' && e.at === 'land') {                // an explosion: its light on the room, and a harder jolt than a heavy blow's
      blast(e.tx, e.ty, clock(), 0.55, 2.4);
      jolt('blast', e.tx, e.ty);
    }
    if ((e.id === 'frost_nova' || e.id === 'turn_undead') && e.at === 'land') jolt('nova', e.tx, e.ty);
  });
  // the fight's other moments (skillfx.js, the boss pass): each boss's mechanic, from the boss (by) to those it raised,
  // called or issued to (tid, reached), followed by id while they move; and a level gained, at the member who gained it
  function moment(id, ev, more = {}) { sfx.moment({ id, by: ev.by ?? null, foeBy: true, tid: ev.tid ?? null, ally: false, x: ev.x, y: ev.y, tx: ev.tx ?? ev.x, ty: ev.ty ?? ev.y, reached: ev.reached || [], ...more }, clock()); }
  // a foe's warning (battle.js 'windup': the telegraph grammar): a heavy blow's ring, a shot's lane, in the light on both
  // painters (skillfx.js warn), and kept here for another painter to lay on its own ground (warnsNow)
  sim.bus.on('windup', (e) => {
    const life = e.wind + e.fly + 0.16;
    moment('warn', e, { foeBy: true, ally: true, life, wind: e.wind, fly: e.fly, heavy: e.heavy, bolt: e.bolt, boss: e.boss });
    warns.push({ e, t0: clock(), life, lock: null }); if (warns.length > 24) warns.shift();   // (another painter's markers; both painters' wind-up glow)
  });
  // a wind-up cut (battle.js 'interrupt', GDD v1.55: a stun, a freeze, a knockdown): its warning goes with it, on both painters
  sim.bus.on('interrupt', (e) => { sfx.cut(e.by); for (let i = warns.length - 1; i >= 0; i--) if (warns[i].e.by === e.by) warns.splice(i, 1); });
  sim.bus.on('bossIssue', (e) => moment('boss_issue', e));
  sim.bus.on('bossCall', (e) => moment('boss_call', e));
  sim.bus.on('bossKindle', (e) => moment('boss_kindle', e));
  sim.bus.on('bossSwarm', (e) => moment('boss_swarm', e));
  sim.bus.on('bossVespers', (e) => moment('boss_vespers', e));
  sim.bus.on('bossMud', (e) => { moment('boss_mud', e); jolt('stamp', e.x, e.y); });
  sim.bus.on('bossFlood', (e) => { if (e.level > 0) { moment('boss_bells', e); jolt('bell', e.x ?? sim.state.player.x, e.y ?? sim.state.player.y); } });
  sim.bus.on('levelUp', (l) => {
    const i = sim.state.party.findIndex((q) => q.id === l.id), m = sim.state.party[i]; if (!m) return;   // (one on the bench isn't drawn)
    const u = i === 0 ? sim.state.player : m; if (u.x === undefined) return;
    moment('level_up', { by: l.id, tid: l.id, x: u.x, y: u.y }, { foeBy: false, ally: true });
  });
  sim.bus.on('loot', (l) => { if (!l.salvaged) fx.beam(l.x, l.y, LOOT_RGB[l.item.r] || LOOT_RGB.common, { now: clock() }); });   // a drop: a column of light where it fell
  sim.bus.on('wave', (w) => { banner = { text: w.cleared ? `Wave ${w.wave} cleared` : `Wave ${w.wave}`, until: clock() + (w.cleared ? 1600 : 1300), small: true }; });
  // bosses (battle.js): who stands in the hall, what it does, and its fall
  const bossLine = { call: ['calls his men to him', 'he stands behind them until they fall'], kindle: ['kindles the dead', 'the last one down gets back up'], line: ['holds the line', 'the dead near it take half: knock it down first'], swarm: ['drums', 'while he drums, more come out of the tunnels: put him down'],
    mud: ['stamps', 'mud comes up round your feet: step out of it'], cage: ['carries a lit cage', 'while his cage burns he mends: break it first'],
    vespers: ['sings', 'while a cantor sings, the drowned mend: silence them'], bells: ['rings the bells', 'the water comes in from the walls: keep to the middle'],
    issue: ['issues arms', 'the most broken of his ranks stands up whole: put him down first'], sluice: ['opens the sluice', 'the vat runs across the floor: step out of it'] };
  sim.bus.on('bossWave', ({ id, name }) => { const B = BOSSES[id]; banner = { text: name, sub: bossLine[B.mech][1], until: clock() + 3200 }; });
  // (named from the boss: the Mere Tower's wardens call, drum and kindle too)
  const bossName = (id) => ({ redhand_captain: 'Garrow', goblin_chief: 'Skarn', robed_stranger: 'The Stranger' })[id] || (BOSSES[id] ? BOSSES[id].name : 'The warden');
  sim.bus.on('bossCall', ({ id }) => { banner = { text: `${bossName(id)} calls ${id === 'redhand_captain' ? 'his men' : id === 'spider_queen' ? 'her brood' : 'for help'}`, sub: bossLine.call[1], until: clock() + 2200, small: true }; });
  sim.bus.on('bossSwarm', ({ id }) => { banner = { text: id === 'goblin_chief' ? 'Skarn drums: goblins pour out' : id === 'rat_king' ? 'The knot squeals: rats pour out' : `${bossName(id)} calls more out of the dark`, sub: bossLine.swarm[1], until: clock() + 2000, small: true }; });
  sim.bus.on('bossIssue', ({ id }) => { banner = { text: `${bossName(id)} issues arms`, sub: 'one of his ranks stands up whole', until: clock() + 1800, small: true }; });
  sim.bus.on('bossSluice', ({ id }) => { banner = { text: `${bossName(id)} opens the sluice`, sub: bossLine.sluice[1], until: clock() + 1800, small: true }; });
  sim.bus.on('bossMud', ({ id }) => { banner = { text: `${bossName(id)} stamps`, sub: bossLine.mud[1], until: clock() + 1800, small: true }; });
  sim.bus.on('bossCage', () => { banner = { text: "Teague's cage breaks", sub: "a soul goes free · he's only a man now", until: clock() + 2400, small: true }; });
  sim.bus.on('bossVespers', () => { banner = { text: 'Another sister stands to sing', sub: bossLine.vespers[1], until: clock() + 2000, small: true }; });
  sim.bus.on('bossFlood', ({ level }) => { banner = level ? { text: 'A bell · the water rises', sub: bossLine.bells[1], until: clock() + 2000, small: true } : { text: 'The water goes down', until: clock() + 1800, small: true }; });
  sim.bus.on('bossKindle', ({ id }) => { banner = { text: `${bossName(id)} kindles the dead`, sub: bossLine.kindle[1], until: clock() + 2000, small: true }; });
  sim.bus.on('bossDown', (e) => { if (e.x !== undefined) jolt('bossDown', e.x, e.y); else jolt('bossDown', sim.state.player.x, sim.state.player.y); });
  sim.bus.on('bossDown', ({ name, first, tower }) => { banner = { text: `${name} falls`, sub: tower ? `a landing · the satchel is banked${first ? ' · something was left behind' : ''}` : first ? 'the room is quiet · something was left behind' : 'the room is quiet', until: clock() + 3200 }; });
  sim.bus.on('tideTurned', () => { banner = { text: 'The room falls back', sub: 'the tide turns: the next climb starts here', until: clock() + 2200, small: true }; });
  sim.bus.on('battle', (b) => { if (b.on) banner = sim.world.site === 'mere_tower' ? { text: 'The Mere Tower', sub: `the stair hall · wave ${(sim.state.tower || {}).wave + 1}`, until: clock() + 1600 } : { text: `Level ${b.level} room`, sub: gateRoom() ? `${dangerWord(b.level)} · hold ${sim.world.gate.waves} waves to drop the gate` : dangerWord(b.level), until: clock() + (gateRoom() ? 2200 : 1100) }; });
  // the floor's gate (sim world.js gateOf, GDD §3.4 v1.70): this room's waves win it while it's up; down, a banner
  const gateRoom = () => { const w = sim.world, G = w.gate, bt = sim.battle; return !!(G && w.gateShut && bt && G.rooms.includes(bt.room) && !bt.camp && !bt.tower); };
  sim.bus.on('gateOpened', () => { banner = { text: 'The gate is down', sub: 'it sinks into the floor · the way to the hall is open', until: clock() + 3200 }; });
  sim.bus.on('levelUp', (l) => { banner = { text: `${l.name} reaches level ${l.level}`, until: clock() + 2200, small: true }; });
  sim.bus.on('defeat', (d) => { banner = { text: 'Your party is beaten', sub: `you wake at the temple · Weakened${d.lost ? ` · lost ${d.lost} gold` : ''}`, until: clock() + 3600 }; });
  // one of the slain raised: the column of holy light over them where they stand (fx.rise), and their ghost turning solid
  // (raisedAt, keyed by the member: presentation only). One on the bench isn't drawn, so only the banner says it.
  const raisedAt = new WeakMap();
  sim.bus.on('resurrected', (r) => {
    const m = sim.state.party.find((q) => q.id === r.id), now = clock(); if (!m) return;
    raisedAt.set(m, now);
    const u = m === sim.state.party[0] ? sim.state.player : m; if (u.x !== undefined) fx.rise(u.x, u.y, { now });
  });
  // the count (sim lamps.js): a lamp breaks with its keeper, its souls going up in a violet column; a cage breaks underfoot
  const SOUL_FREE = [200, 180, 255];
  sim.bus.on('lampBroken', (l) => {
    banner = { text: `${l.name} breaks`, sub: l.first ? `${l.held} souls go free · its line lies down` : 'its line lies down', until: clock() + 3600 };
    fx.rise(l.x, l.y, { now: clock(), life: 2.6, col: SOUL_FREE });
  });
  sim.bus.on('cageBroken', (c) => fx.rise(c.x, c.y, { now: clock(), life: 1.6, col: SOUL_FREE }));
  sim.bus.on('resurrected', (r) => { banner = { text: `${r.name} is raised`, sub: r.how === 'shrine' ? 'back on their feet · the shrine’s light fades' : 'back on their feet · the temple’s grace', until: clock() + 3000 }; });
  // How a room's level reads against your hero's: at or below → gold, +1 → amber, +2 → orange, +3 or more → red.
  const DANGER = [['#f0c880', 'even match'], ['#ffc060', 'a step up'], ['#ff9a50', 'dangerous'], ['#ff5a4a', 'deadly']];
  const dangerOf = (lv) => DANGER[Math.max(0, Math.min(3, lv - sim.state.party[0].level))];
  const dangerColor = (lv) => dangerOf(lv)[0], dangerWord = (lv) => dangerOf(lv)[1];
  function drawBattle(ox, oy, ix, iy, pz, now) {
    const k = vw / window.innerWidth, w = sim.world, b = sim.battle, party = sim.state.party;
    const scr = (x, y, lift = 0) => { const z = heightAt(w, Math.floor(x), Math.floor(y)), P = project(x, y, z); return [(ox + P.sx) * S, (oy + P.sy - lift) * S]; };
    const bar = (x, y, frac, col, wide = 18) => {
      const [sx, sy] = scr(x, y, 62), bw = wide * S * 0.9, bh = Math.max(3, 3.2 * k);
      octx.fillStyle = 'rgba(8,6,12,0.8)'; octx.fillRect(sx - bw / 2 - k, sy - k, bw + 2 * k, bh + 2 * k);
      octx.fillStyle = col; octx.fillRect(sx - bw / 2, sy, bw * Math.max(0, Math.min(1, frac)), bh);
    };
    if (b) {
      for (const e of w.enemies || []) if (e.hp > 0 && !(e.spawn > 0)) bar(e.x, e.y, e.hp / e.maxHp, e.elite ? '#ff9a3a' : '#d24a3c', e.elite ? 24 : 18);
      party.forEach((m, i) => { if (m.down || m.fallen) return; const x = i ? (fol[i - 1] || m).x : ix, y = i ? (fol[i - 1] || m).y : iy; const s = sim.state.party[i]; const mx = maxHpOf(s); bar(x, y, s.hp / mx, '#5aa35c', 16); });
      // the room-level · wave pill under the HUD, tinted by how far the room is above you
      // …and, from the second wave, how far the tide has lifted the foes (GDD §7.1: each wave of a visit is tougher)
      const T = b.tower && sim.state.tower, sat = T ? `  ·  ${T.satchel.gold}g ${T.satchel.cinders}✦` : '';   // (the Mere Tower: its wave, its strength, the satchel at risk)
      const G = gateRoom() ? sim.world.gate : null, held = G ? Math.min(G.waves, b.between ? b.wave : Math.max(0, b.wave - 1)) : 0;   // (the gate: waves held this visit)
      const txt = `${T ? 'MERE TOWER' : `ROOM LV ${b.level}`}  ·  WAVE ${b.wave}${b.tide > 0.005 ? `  ·  FOES +${Math.round(b.tide * 100)}%` : ''}${G ? `  ·  GATE ${held}/${G.waves}` : ''}${sat}`, dc = T ? '#c8b0ff' : dangerColor(b.level);
      octx.font = `700 ${Math.round(11 * k)}px ui-monospace, Menlo, monospace`; octx.textAlign = 'center';
      // under the HUD row (hudB: the phone's safe area included), centred, but never under the minimap
      const tw = octx.measureText(txt).width + 18 * k, mmL = vw - (MM_CSS + 2 * MM_PAD + MM_RIGHT + safeR + 8) * k;
      const px = Math.max(tw / 2 + 10 * k, Math.min(vw / 2, mmL - tw / 2)), py = (hudB + 16) * k;
      octx.fillStyle = 'rgba(14,10,18,0.82)'; octx.strokeStyle = dc; octx.lineWidth = Math.max(1, k);
      octx.beginPath(); octx.roundRect(px - tw / 2, py - 13 * k, tw, 19 * k, 9 * k); octx.fill(); octx.stroke();
      octx.fillStyle = dc; octx.fillText(txt, px, py + 1 * k);
      // a boss's bar under the pill: its name, its health, and a shield while it's guarded (battle.js BOSSES)
      const boss = (w.enemies || []).find((e) => e.boss && e.hp > 0 && !e.dead);
      if (boss) {
        const bw = Math.min(vw * 0.38, 150 * k, 2 * (mmL - px)), bh = 7 * k, bx0 = px - bw / 2, by0 = py + 24 * k, f = boss.hp / boss.maxHp;   // (clear of the minimap on the right)
        const guarded = halved(boss, w.enemies || []);
        octx.font = `600 ${Math.round(12 * k)}px Georgia, 'Times New Roman', serif`; octx.fillStyle = 'rgba(0,0,0,0.7)'; octx.fillText(BOSSES[boss.boss].name, px + k, by0 - 3 * k + k);
        octx.fillStyle = '#f0c880'; octx.fillText(BOSSES[boss.boss].name + (guarded ? '  ⛨' : ''), px, by0 - 3 * k);
        octx.fillStyle = 'rgba(14,10,18,0.85)'; octx.fillRect(bx0 - k, by0 + 2 * k, bw + 2 * k, bh + 2 * k);
        octx.fillStyle = guarded ? '#8a93a8' : '#c8402c'; octx.fillRect(bx0, by0 + 3 * k, bw * f, bh);
        octx.strokeStyle = 'rgba(240,200,128,0.6)'; octx.lineWidth = Math.max(1, k); octx.strokeRect(bx0 - k, by0 + 2 * k, bw + 2 * k, bh + 2 * k);
      }
    }
    // floating numbers
    const t = clock();
    for (let i = floats.length - 1; i >= 0; i--) {
      const f = floats[i], a = (t - f.t0) / 900; if (a >= 1) { floats.splice(i, 1); continue; }
      const [sx0, sy0] = scr(f.x, f.y, 56 + (f.jy || 0) + f.rise * a), sx = sx0 + (f.jx || 0) * S, sy = sy0;
      octx.font = `800 ${Math.round(f.size * k)}px ui-monospace, Menlo, monospace`; octx.textAlign = 'center';
      octx.globalAlpha = a < 0.7 ? 1 : 1 - (a - 0.7) / 0.3;
      octx.fillStyle = 'rgba(0,0,0,0.75)'; octx.fillText(f.text, sx + k, sy + k);
      octx.fillStyle = f.color; octx.fillText(f.text, sx, sy);
      octx.globalAlpha = 1;
    }
  }
  // the sim's own max HP (class, level, attributes, gear, Weakened). A separate class table here
  // had no cleric: the first HP bar drawn in a fight threw, and the frame loop stopped (a freeze).
  const maxHpOf = (m) => statsFor(m).maxHp;
  function drawBanner(now) {
    if (!banner || now > banner.until) return;
    const k = vw / window.innerWidth, a = Math.min(1, (banner.until - now) / 600);
    const size = banner.small ? 16 : 20, y = (hudB + (banner.small ? 68 : 100)) * k;   // (under the room pill and a boss's bar)
    octx.font = `600 ${Math.round(size * k)}px Georgia, 'Times New Roman', serif`; octx.textAlign = 'center';
    octx.fillStyle = `rgba(8,5,14,${0.75 * a})`; octx.fillText(banner.text, vw / 2 + 1.5 * k, y + 1.5 * k);
    octx.fillStyle = `rgba(240,200,130,${a})`; octx.fillText(banner.text, vw / 2, y);
    if (banner.sub) { octx.font = `${Math.round(12 * k)}px Georgia, serif`; octx.fillStyle = `rgba(200,190,176,${a})`; octx.fillText(banner.sub, vw / 2, y + 22 * k); }
  }
  // Tap-to-move destination: a small gold iso ring that pulses in, with a faint dot trail
  // along the remaining path; gone the moment the hero arrives or the stick takes over.
  let goalT0 = 0, lastGoal = null;
  const partyH = () => { const el = document.getElementById('party'); return el ? el.getBoundingClientRect().height : 0; };
  // a spawn point's edge as a dashed ring on the ground (GDD §10.3 v1.68; the owner: "show as a dotted line when
  // encountered"): coming up on a full one, its reach (where it sees you: amber dashes, fading in from 14 tiles out); in its
  // fight, its arena (where it'll chase you to: red; out past it and the fight's off). Each dot on the ground's height.
  function drawCampRings(ox, oy, hx, hy, now) {
    const b = sim.battle, k = vw / window.innerWidth;
    for (const c of campsOf(sim.world.region)) {
      const fighting = b && b.camp === c, d = Math.hypot(hx - c.x, hy - c.y);
      const r = fighting ? c.arena : c.reach, a = fighting ? 0.7 : campUp(sim.state, c) ? Math.max(0, Math.min(1, (c.reach + 14 - d) / 10)) * 0.75 : 0;
      if (a <= 0.02) continue;
      const n = Math.max(64, Math.round(2 * Math.PI * r / 0.8)), sp = now / 4000;   // (a point every 0.8 tile round it, the dashes creeping slowly)
      octx.beginPath();
      for (let i = 0; i <= n; i++) {
        const t = (i / n) * Math.PI * 2, x = c.x + Math.cos(t) * r, y = c.y + Math.sin(t) * r;
        const P = project(x, y, heightAt(sim.world, Math.floor(x), Math.floor(y))), sx = (ox + P.sx) * S, sy = (oy + P.sy) * S;
        if (i) octx.lineTo(sx, sy); else octx.moveTo(sx, sy);
      }
      octx.save(); octx.setLineDash([9 * k, 7 * k]); octx.lineDashOffset = -(sp % 1) * 16 * k; octx.lineCap = 'round';
      octx.lineWidth = 4.5 * k; octx.strokeStyle = `rgba(12,8,4,${(0.5 * a).toFixed(3)})`; octx.stroke();   // (a dark edge under it, as the goal ring has: it reads on grass and on road)
      octx.lineWidth = 2.4 * k; octx.strokeStyle = fighting ? `rgba(232,96,66,${a.toFixed(3)})` : `rgba(242,198,112,${a.toFixed(3)})`; octx.stroke();
      octx.restore();
    }
  }
  function drawGoal(ox, oy, now) {
    const p = sim.state.player, g = p.goal;
    if (!g || !p.path) { lastGoal = null; return; }
    if (g !== lastGoal) { lastGoal = g; goalT0 = now; }
    const k = vw / window.innerWidth, t = Math.min(1, (now - goalT0) / 220), pulse = 1 + 0.08 * Math.sin(now / 160);
    const at = (x, y) => { const z = heightAt(sim.world, Math.floor(x), Math.floor(y)), P = project(x, y, z); return [(ox + P.sx) * S, (oy + P.sy) * S]; };
    octx.fillStyle = 'rgba(240,200,120,0.35)';
    for (const [x, y] of p.path.slice(0, -1)) { const [sx, sy] = at(x, y); octx.beginPath(); octx.arc(sx, sy, 1.6 * k, 0, Math.PI * 2); octx.fill(); }
    const [sx, sy] = at(g.x, g.y), rx = 11 * S * (1.6 - 0.6 * t) * pulse, ry = rx / 2;
    // off-screen destination: the trail ends in a chevron at the screen edge, pointing at it
    const m = 26 * k, top = 70 * k, bottom = vh - (partyH ? partyH() * k : 0) - 16 * k;
    if (sx < m || sx > vw - m || sy < top || sy > bottom) {
      const cx = vw / 2, cy = (top + bottom) / 2, dx = sx - cx, dy = sy - cy;
      const s2 = Math.min((vw / 2 - m) / Math.max(1e-6, Math.abs(dx)), ((bottom - top) / 2) / Math.max(1e-6, Math.abs(dy)));
      const ex = cx + dx * s2, ey = cy + dy * s2, a = Math.atan2(dy, dx), L = 11 * k;
      octx.save(); octx.translate(ex, ey); octx.rotate(a);
      octx.lineWidth = Math.max(2, 2.6 * k); octx.lineJoin = 'round';
      octx.strokeStyle = 'rgba(20,12,6,0.6)'; octx.beginPath(); octx.moveTo(-L, -L + k); octx.lineTo(k, k); octx.lineTo(-L, L + k); octx.stroke();
      octx.strokeStyle = `rgba(240,196,110,${0.6 + 0.3 * Math.sin(now / 200)})`; octx.beginPath(); octx.moveTo(-L, -L); octx.lineTo(0, 0); octx.lineTo(-L, L); octx.stroke();
      octx.restore();
      return;
    }
    octx.lineWidth = Math.max(1.5, 2 * k);
    octx.strokeStyle = `rgba(20,12,6,${0.55 * t})`; octx.beginPath(); octx.ellipse(sx, sy + k, rx, ry, 0, 0, Math.PI * 2); octx.stroke();
    octx.strokeStyle = `rgba(240,196,110,${0.9 * t})`; octx.beginPath(); octx.ellipse(sx, sy, rx, ry, 0, 0, Math.PI * 2); octx.stroke();
  }
  function drawMinimap(ix, iy) {
    const lvl = sim.world.level, rooms = lvl.rooms, discovered = sim.world.discovered;
    if (!rooms.length) return;
    const k = vw / window.innerWidth, MM = 96 * k, pad = 6 * k;
    const bx = vw - MM - pad - (MM_RIGHT + safeR) * k, by = mmTop() * k;     // top-right, under the HUD
    // panel
    octx.fillStyle = 'rgba(10,8,16,0.60)';
    octx.fillRect(bx - pad, by - pad, MM + 2 * pad, MM + 2 * pad);
    octx.strokeStyle = 'rgba(130,120,160,0.35)'; octx.lineWidth = Math.max(1, k);
    octx.strokeRect(bx - pad, by - pad, MM + 2 * pad, MM + 2 * pad);
    // fit all rooms into the square, centered, preserving aspect
    let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
    for (const r of rooms) { x0 = Math.min(x0, r.cx - r.rw); x1 = Math.max(x1, r.cx + r.rw); y0 = Math.min(y0, r.cy - r.rh); y1 = Math.max(y1, r.cy + r.rh); }
    const span = Math.max(x1 - x0, y1 - y0) || 1, s = MM / span;
    const mx = (tx) => bx + (tx - x0) * s + (MM - (x1 - x0) * s) / 2;
    const my = (ty) => by + (ty - y0) * s + (MM - (y1 - y0) * s) / 2;
    // corridors leading out of any discovered room
    octx.strokeStyle = 'rgba(150,140,180,0.45)'; octx.lineWidth = Math.max(1, 1.5 * k);
    for (const [a, b] of lvl.edges) {
      if (!discovered.has(a) && !discovered.has(b)) continue;
      octx.beginPath(); octx.moveTo(mx(rooms[a].cx), my(rooms[a].cy)); octx.lineTo(mx(rooms[b].cx), my(rooms[b].cy)); octx.stroke();
    }
    // discovered rooms, in the theme's floor tint
    const rc = ELIT[lvl.th.floors[0]][3] || [90, 80, 110];
    octx.fillStyle = `rgba(${rc[0]},${rc[1]},${rc[2]},0.9)`;
    for (const r of rooms) {
      if (!discovered.has(r.id)) continue;
      const w = Math.max(3 * k, r.rw * 2 * s), h = Math.max(3 * k, r.rh * 2 * s);
      octx.fillRect(mx(r.cx) - w / 2, my(r.cy) - h / 2, w, h);
    }
    // each discovered room's level (GDD §3.2: rooms show their threat before you commit)
    const levels = sim.world.roomLevels;
    if (levels) {
      octx.font = `700 ${Math.round(8 * k)}px ui-monospace, Menlo, monospace`; octx.textAlign = 'center'; octx.textBaseline = 'middle';
      for (const r of rooms) {
        const lv = levels.get(r.id); if (!lv || !discovered.has(r.id) || r === lvl.descentRoom) continue;
        octx.fillStyle = 'rgba(0,0,0,0.7)'; octx.fillText(String(lv), mx(r.cx) + k, my(r.cy) + k);
        octx.fillStyle = dangerColor(lv); octx.fillText(String(lv), mx(r.cx), my(r.cy));
      }
      octx.textBaseline = 'alphabetic';
    }
    // descent gate marker, once its room is known (a violet diamond → the way down)
    const dr = lvl.descentRoom;
    if (dr && discovered.has(dr.id)) {
      const r = Math.max(2.5, 3 * k); octx.fillStyle = '#b48cff';
      octx.beginPath(); octx.moveTo(mx(dr.cx), my(dr.cy) - r); octx.lineTo(mx(dr.cx) + r, my(dr.cy)); octx.lineTo(mx(dr.cx), my(dr.cy) + r); octx.lineTo(mx(dr.cx) - r, my(dr.cy)); octx.closePath(); octx.fill();
    }
    // hero marker
    octx.fillStyle = '#f0a500';
    octx.beginPath(); octx.arc(mx(ix), my(iy), Math.max(2, 2.6 * k), 0, Math.PI * 2); octx.fill();
    octx.strokeStyle = 'rgba(0,0,0,0.6)'; octx.lineWidth = Math.max(1, k); octx.stroke();
  }

  return {
    render, resize,
    /** (for checks and tools/capture/feel.mjs) the camera's jolt now (native px) and the foes glowing as they wind up */
    get feel() { return { jx: lastCam ? lastCam.rx : 0, jy: lastCam ? lastCam.ry : 0, shaking: !!shake, glow: windGlow.size }; },
    /** the hit-stop asked for since the last call, ms (main.js holds the world) */
    takeHitStop() { const h = stopMs; stopMs = 0; return h; },
    /** the menu's Hit feel: hit-stop and jolt × k (0 off) @param {number} k */
    setFeel(k) { feelMul = k; },
    /** hold the outdoor light at a look (a part's name or a fraction of the day, daylight.js holdT), or
     * null to follow the sim's clock; a change eases in. The title holds dusk; ?dev&tod= holds any. */
    holdSky(v) {
      const t = holdT(v); if (t === skyHoldT) return;
      mixSky(skyFrom, sky, sky, 0); skyEase0 = lastNow; skyHoldT = t;
    },
    /** true while a scene change is still baking behind black (main.js holds the sim still meanwhile) */
    get transiting() { return !!transit && !terrValid; },
    /** settles once the first actor and environment atlases have loaded (or failed), and every member of the party and the
     * bench has their own look: the loading screen's cue. Read after the save is restored (main.js), so a created hero (a
     * cleric, say) is in before the first frame; before, only the knight was, and the rest showed the pink paper doll. */
    /** after the time away was played through with the bus quiet (ui/away.js): re-bake the floor (cages, chests) */
    refresh() { terrValid = false; banner = null; },
    get ready() {
      for (const m of [...sim.state.party, ...sim.state.bench]) memberAtlas(m, m.actor && m.actor !== 'hero_knight' ? m.actor : m.main ? 'hero_knight' : MEMBER_LOOK[m.cls]);
      return Promise.allSettled([...firstLoads.filter(Boolean), ...partyPending.values()]);
    },
    /** (for captures) a ground point of the sim's on the screen, CSS px, through this frame's camera @param {number} x @param {number} y */
    screenAt(x, y) { const z = heightAt(sim.world, Math.floor(x), Math.floor(y)), P = project(x, y, z), k = S / (vw / window.innerWidth); return [(lastCam.rx + P.sx) * k, (lastCam.ry + P.sy) * k]; },
    enemyAt(sxPx, syPx) {                                  // the enemy under (or nearest to) a tap, for focus
      const w = sim.world; if (!w.enemies || !w.enemies.length) return null;
      const dpr = vw / window.innerWidth, nx = (sxPx * dpr) / S, ny = (syPx * dpr) / S;
      let best = null, bd = 26;
      for (const e of w.enemies) { if (e.hp <= 0) continue; const z = heightAt(w, Math.floor(e.x), Math.floor(e.y)), P = project(e.x, e.y, z);
        const d = Math.hypot(lastCam.rx + P.sx - nx, lastCam.ry + P.sy - 24 - ny); if (d < bd) { bd = d; best = e; } }
      return best;
    },
    /** the named NPCs' content defs (content/npcs/*.json), by id: until they load, nobody stands there */
    setCast(c) { cast = c || {}; },
    npcAt(sxPx, syPx) {                                    // the named person under a tap: their whole drawn figure, a thumb wide
      // (the owner, 2026-10-04: "Col is pretty hard to click on". The test was a 28 × 40 px oval round the chest, at
      // the sim's stepped position for one walking a routine: now a box round the figure where it's drawn, at least
      // 44 CSS px wide, from the feet to over the head; the nearest body centre wins where two overlap.)
      const w = sim.world; if (!w.npcs || !w.npcs.length) return null;
      const dpr = vw / window.innerWidth, k = S / dpr, nx = (sxPx * dpr) / S, ny = (syPx * dpr) / S;
      const hw = Math.max(13, 22 / k), up = Math.max(54, 60 / k), dn = Math.max(6, 8 / k);   // native px: half-width, above and below the foot
      let best = null, bd = Infinity;
      for (const n of w.npcs) {
        if (!cast[n.id]) continue;
        const u = npcPres.get(n.id), fresh = u && u.drawn !== undefined && lastDrawn - u.drawn < 500;
        const qx = fresh ? u.qx : n.x, qy = fresh ? u.qy : n.y, z = fresh ? u.qz : heightAt(w, Math.floor(n.x), Math.floor(n.y)), P = project(qx, qy, z);
        const dx = nx - (lastCam.rx + P.sx), dy = ny - (lastCam.ry + P.sy);
        if (Math.abs(dx) > hw || dy < -up || dy > dn) continue;
        const d = Math.hypot(dx, dy + up * 0.45); if (d < bd) { bd = d; best = n; }
      }
      return best;
    },
    /** the minimap's frame as drawn this frame (CSS px), or null when there's none (the town's home screen; a test) */
    get minimapRect() {
      const w = sim.world; if (!w || (w.kind !== 'dungeon' && camT >= 0.5) || (w.kind === 'dungeon' && !w.level.rooms.length)) return null;
      const r = window.innerWidth - (MM_RIGHT + safeR), t = mmTop() - MM_PAD;
      return { l: r - MM_CSS - 2 * MM_PAD, t, r, b: t + MM_CSS + 2 * MM_PAD };
    },
    /** a dungeon floor's stair signs as last drawn (CSS px; drawStairs): which, where they lead, and where they hang (a test) */
    get stairSigns() { const k = vw / window.innerWidth; return doorRects.filter((r) => r.L.stairs).map((r) => ({ kind: r.L.stairs, tx: r.L.tx, ty: r.L.ty, l: r.x0 / k, t: r.y0 / k, r: r.x1 / k, b: r.y1 / k })); },
    /** the square's service plaques as last drawn (CSS px): the town's menu, the same in every town (a test) */
    get plaques() { const k = vw / window.innerWidth; return plaqueRects.map((r) => ({ kind: r.kind, ax: r.ax / k, l: r.x0 / k, t: r.y0 / k, r: r.x1 / k, b: r.y1 / k })); },
    /** the door label (a plaque with a ›) under a tap, a thumb's reach round it (44 CSS px tall at least), or null */
    doorAt(sxPx, syPx) {
      const k = vw / window.innerWidth, x = sxPx * k, y = syPx * k;
      for (const r of doorRects) { const pad = Math.max(0, (44 * k - (r.y1 - r.y0)) / 2); if (x >= r.x0 - 6 * k && x <= r.x1 + 6 * k && y >= r.y0 - pad && y <= r.y1 + pad) return r.L; }
      return null;
    },
    serviceAt(sxPx, syPx) {
      const w = sim.world; if (!w.services || !w.services.length) return null;
      if (ext && ext.serviceAt) return ext.serviceAt(sxPx, syPx);   // (another painter's buildings: the one drawn under the tap)
      if (!envMeta) return null;
      const dpr = vw / window.innerWidth, nx = (sxPx * dpr) / S, ny = (syPx * dpr) / S, z = heightAt(w, 0, 0);
      let best = null;
      for (const sv of w.services) {
        const m = envMeta.sprites[sv.id]; if (!m) continue;
        const P = project(sv.x, sv.y, z), x0 = lastCam.rx + P.sx - m.ax, y0 = lastCam.ry + P.sy - m.ay;
        if (nx >= x0 && nx < x0 + m.w && ny >= y0 && ny < y0 + m.h * 0.85 && (!best || sv.x + sv.y > best.x + best.y)) best = sv;
      }
      return best;
    },
    /** the chest, shrine or stairs drawn under a tap (its whole sprite, not its floor tile), or null */
    /** dev: the Stage's lineup (src/dev/stage.js), or null @param {typeof stageFn} fn */
    setStage(fn) { stageFn = fn || null; },
    /** the sound's listener: called each frame with the figures drawn (audio/listen.js) @param {any} fn */
    onFrame(fn) { heard = fn; },
    propAt(sxPx, syPx) { const dpr = vw / window.innerWidth; return propUnder((sxPx * dpr) / S - lastCam.rx, (syPx * dpr) / S - lastCam.ry); },
    /** another painter for the world (src/render3d/hybrid.js), or null for Emberlit's own; the world is drawn by it from
     * the next frame, behind black until its level is built */
    setExternal(e) { ext = e || null; terrValid = false; transit = { job: null, fadeFrom: 0 }; },
    /** dev: how many native px of the window's emissive plane are lit (with another painter: the fights' light it lays over its world) */
    get emiLit() { let n = 0; if (sEMI) for (let i = 0; i < sEMI.length; i += 4) if (sEMI[i] | sEMI[i + 1] | sEMI[i + 2]) n++; return n; },
    /** dev: the floating numbers on screen now (they live 900 ms of the render clock: browser test §15c2) */
    get floatCount() { return floats.length; },
    /** dev: the native view size (px) */
    get view() { return { w: nvw, h: nvh, S }; },
    /** the player's zoom, a factor on the default scale (clamped to ZOOM_MIN..ZOOM_MAX) @param {number} z @returns {number} */
    setZoom(z) { const k = Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, +z || 1)); if (k !== zoom) { zoom = k; scaleTo(); } return zoom; },
    get zoom() { return zoom; },
    screenToTile(sxPx, syPx, alpha) {
      const { rx: ox, ry: oy } = lastCam;
      const dpr = vw / window.innerWidth;
      return resolveTap((sxPx * dpr) / S - ox, (syPx * dpr) / S - oy, {
        heightAt: (tx, ty) => heightAt(sim.world, tx, ty),
        // snap to harvestables AND interactable props (chest / shrine / stairs)
        hasResource: (tx, ty) => !!resourceAt(sim.world, tx, ty) || INTERACT.has(propAt(sim.world, tx, ty)),
        heights: [7, 6, 5, 4, 3, 2, 1, 0],
      });
    },
  };

}
