// @ts-check
// hybrid.js — Luminati drawing the game's world (docs/luminati-port-plan.md: phase 0's trial, then §13 step 1: in the
// game's own page). With the menu's Graphics set to Luminati (or ?renderer=luminati), Luminati's world sits under
// Emberlit's overlay canvas: its engine and world layers and three.js, built as ES modules into
// src/vendor/luminati-80e1aa6/ (tools/render3d/build.mjs, from tools/render3d/world.js), imported here when it's
// chosen. Its canvas takes no pointer, so the taps still reach the game's own canvas and input; its own UI is under a
// hidden element, its input listens to nothing, and its sound never starts (the build's tags). One WebGL context draws:
// Emberlit, made with `external` (render/renderer.js), keeps a 1 × 1 stub and none of its bake's buffers.
//
// Emberlit keeps running as the game's eye (render/renderer.js setExternal): its camera, its animator's choice of clip,
// octant and frame for everyone on screen, and everything drawn over the world and every tap test (the minimap, the
// names, the service plaques, the bars and numbers, npcAt / enemyAt / serviceAt / screenToTile). It skips its own bake
// and light. Each frame it hands this module the figures it would have drawn, and this module hands Luminati:
//   · the camera: the ground point at the middle of the screen and the CSS px a unit, from Emberlit's (iso.js:
//     screen = camera + project(x, y, z), 16 × 8 px a tile); world.js places a 45° / 30° camera on a 1° lens to match,
//     so what Emberlit draws over the world lands on it;
//   · the figures: each one's atlas, frame and octant, and where it stands (Emberlit's screen point turned back into
//     ours, then Luminati's units);
//   · the fights' effects (fx3d.js: what Emberlit's fx.js drew into its light, as Luminati's);
//   · the hour (the sim's clock: its four parts of the day onto Luminati's 24 hours, so dawn on the dial is dawn in the
//     sky) and the weather (rain and snow; Luminati has no fog or wind of its own here).
// When the sim changes world (a town gate, a dungeon's stairs, a load), the new world is converted (convert.js) and built
// behind Emberlit's black; the sim holds still meanwhile (renderer.transiting), as it does for a bake.
// Presentation only: reads the sim, writes nothing to it.
import { convertWorld, GROUND_Y, SIM_FLOOR } from './convert.js';
import { HW, HH, ZH, project } from '../render/iso.js';
import { DAY_S } from '../sim/heroes.js';
import { PART_S } from '../sim/npcs.js';
import { weatherNow } from '../render/weatherfx.js';
import { readGraphics } from './settings.js';
import { brightAt, brightFor } from './bright.js';
import { buildProps } from '../render/gsprite.js';
import { propAt } from '../sim/world.js';
import { shrineKind } from '../sim/shrines.js';
import { hash2 } from '../sim/rng.js';
import { WARN_R } from '../render/skillfx.js';

// the sim's four parts of the day (dawn · day · dusk · night, PART_S each) on Luminati's clock: where each part begins
// (dusk is Luminati's golden hour and sunset: Emberlit's dusk is a warm low sun, the game's old fixed look; held across
// Luminati's purple dusk it sat darker than its own night)
const PART_HOURS = [5, 7.5, 17, 19.6, 29];
/** the hour on Luminati's 24-hour clock for t seconds of play @param {number} t */
export function hourOf(t) {
  const s = ((t % DAY_S) + DAY_S) % DAY_S, p = Math.floor(s / PART_S), u = (s - p * PART_S) / PART_S;
  return (PART_HOURS[p] + (PART_HOURS[p + 1] - PART_HOURS[p]) * u) % 24;
}
const NATIVE_PER_UNIT = 16 * Math.SQRT2;                      // (iso.js: a tile's half-width 8 px; two tiles a unit)
const TEAM_RGB = [null, [214, 176, 92], [196, 58, 46], [236, 128, 48]];   // (renderer.js: the party's gold, foes' red, the elite's orange)
const CARRY = [0.45, 0, 0.6, 1];                              // the carry light by the part of the day (dawn, day, dusk, night)
// the brightness outdoors, by the part of the day: the shipped look and the player's dial (render3d/bright.js)
export { BRIGHT, brightAt } from './bright.js';

// ── a dungeon's furniture of ours (port step 3: convert.js names it by tile) ──────────────────────────────────────────
// Built as Emberlit builds it (gsprite.js buildProps, the floor's seed), the same variant on the same tile, and the
// same state: an opened chest with its lid back, a used shrine dark, a broken cage empty. Its albedo as a canvas, for
// the world page to stand up facing the camera; lit there by Luminati's lights.
let propSet = null, propSeed = -1;
const propCanvases = new Map();
function propSprite(w, it) {
  if (propSeed !== w.seed) { propSeed = w.seed; propSet = buildProps(w.seed); propCanvases.clear(); }
  const { tx, ty } = it, k = tx + ',' + ty, now = propAt(w, tx, ty), was = !now && w.props.get(k), md = w.mods.get(k);
  const pk = now || (was === 'chest' ? 'chestOpen' : was === 'shrine' ? 'shrineSpent' : md && md.cage ? 'cageOpen' : null);
  if (!pk) return null;
  const key = pk === 'shrine' ? 'shrine_' + shrineKind(w, tx, ty) : pk, arr = propSet[key] || propSet.spire;
  const v = arr.length === 1 ? 0 : (hash2(tx, ty, 5) * arr.length) | 0, id = `${key}#${v}`;
  let c = propCanvases.get(id);
  if (!c) {
    const sp = arr[v]; c = document.createElement('canvas'); c.width = sp.w; c.height = sp.h;
    const g = /** @type {CanvasRenderingContext2D} */ (c.getContext('2d')), im = g.createImageData(sp.w, sp.h);
    for (let i = 0; i < sp.w * sp.h; i++) if (sp.mask[i]) { im.data[i * 4] = sp.alb[i * 3]; im.data[i * 4 + 1] = sp.alb[i * 3 + 1]; im.data[i * 4 + 2] = sp.alb[i * 3 + 2]; im.data[i * 4 + 3] = 255; }
    g.putImageData(im, 0, 0); propCanvases.set(id, c);
    Object.assign(c, { ax: sp.ax, ay: sp.ay });
  }
  return { id, x: it.x, z: it.z, canvas: c, ax: /** @type {any} */ (c).ax, ay: /** @type {any} */ (c).ay, flat: !!it.flat };
}
/** the furniture's state, for a change to rebuild it (a chest opened, a shrine used, a cage broken) */
const propState = (w, list) => list.map((it) => propAt(w, it.tx, it.ty) || '-').join('|');

// ── what Emberlit draws that has no atlas: Teague's lantern-cage held at his side, the bolts and arrows in flight ────
// (the boss pass, docs/combat-fx.md: on Luminati they weren't drawn at all, only the bolts' light). Each sprite of
// Emberlit's (renderer.js boltSprite, arrowSprite, gsprite's cage) as a canvas once, its glowing pixels lifted (Luminati
// lights the canvas as a figure; a bolt is its own light), for the world page to stand up where Emberlit drew it.
const bitCanvases = new WeakMap();
// a figure's key, the same each frame (a unit, an NPC's presence, a crowd walker, a picket: renderer.js `u` / `who`), so
// Luminati keeps its model, mid-clip and mid-turn (world.js placeFigure); a draw with none is keyed by order there
const figKeys = new WeakMap(); let figKeyN = 0;
const keyOf = (o) => { if (!o || typeof o !== 'object') return undefined; let k = figKeys.get(o); if (k === undefined) figKeys.set(o, (k = ++figKeyN)); return k; };
function bitCanvas(sp, glow) {
  let c = bitCanvases.get(sp);
  if (!c) {
    c = document.createElement('canvas'); c.width = sp.w; c.height = sp.h;
    const g = /** @type {CanvasRenderingContext2D} */ (c.getContext('2d')), im = g.createImageData(sp.w, sp.h);
    for (let i = 0; i < sp.w * sp.h; i++) if (sp.mask[i]) {
      const k = glow && sp.emi && sp.emi[i] ? 1.25 : 1;
      im.data[i * 4] = Math.min(255, sp.alb[i * 3] * k); im.data[i * 4 + 1] = Math.min(255, sp.alb[i * 3 + 1] * k); im.data[i * 4 + 2] = Math.min(255, sp.alb[i * 3 + 2] * k); im.data[i * 4 + 3] = 255;
    }
    g.putImageData(im, 0, 0); bitCanvases.set(sp, c);
  }
  return c;
}
// the Abbess's water (battle.js bells: each flooded tile, by its distance from the walls), as tile squares for the world
// page to lay over its floor; built again only when the water comes further in
let waterKey = '', waterCells = /** @type {number[]} */ ([]);
function waterOf(b, origin) {
  if (!(b && b.flood > 0 && b.edge)) { waterKey = ''; waterCells = []; return null; }
  const key = `${b.room}:${b.flood}:${origin.x},${origin.y}`;
  if (key !== waterKey) {
    waterKey = key; waterCells = [];
    const lim = b.flood * (b.floodStep || 1), shoreAt = (b.flood - 1) * (b.floodStep || 1);
    for (const [k, d] of b.edge) { if (d > lim) continue; const c = k.indexOf(','), tx = +k.slice(0, c), ty = +k.slice(c + 1); waterCells.push((tx + 0.5 - origin.x) / 2, (ty + 0.5 - origin.y) / 2, d > shoreAt && d === lim ? 1 : 0); }
  }
  return { id: waterKey, cells: waterCells };
}

/** the bundle (tools/render3d/build.mjs; its folder is named for Luminati's pin) */
export const VENDOR = '../vendor/luminati-80e1aa6/luminati.js';
const CSS = `#world3d { position: fixed; inset: 0; pointer-events: none; background: #000; overflow: hidden; }
#world3d canvas { display: block; width: 100%; height: 100%; }
#world3d-ui { position: fixed; inset: 0; z-index: -1; visibility: hidden; pointer-events: none; overflow: hidden; }
/* the top bar over Luminati's world (the owner, 2026-11-01: "At the top of the phone screen its a bit blurry washing out
   the town name and gold and ember count"). Emberlit's halls and dusky squares were dark behind it; Luminati's day, and
   its snow, are bright. A dusk-coloured fade behind the bar, drawn as its own backdrop so the bar's size (which places the
   minimap) never changes, and a crisp one-pixel outline round its words (a soft 6 px glow read as smudged on a phone). */
body.world3d #hud { z-index: 0; }
body.world3d #hud::before { content: ''; position: absolute; left: 0; right: 0; top: 0; bottom: -34px; z-index: -1; pointer-events: none;
  background: linear-gradient(to bottom, rgba(12, 9, 18, 0.86) 0%, rgba(12, 9, 18, 0.7) 55%, rgba(12, 9, 18, 0) 100%); }
body.world3d #hud, body.world3d #hud .stat { text-shadow: 0 1px 0 #0d0913, 1px 0 0 #0d0913, -1px 0 0 #0d0913, 0 -1px 0 #0d0913; }
body.world3d #hud .stat { color: #b4b0c6; }`;

/**
 * Put Luminati under the game. Resolves to a small handle (for checks) once Luminati is loaded.
 * @param {{ renderer: any, sim: any, region?: string, vendor?: string }} o
 */
export async function attachLuminati({ renderer, sim, region = 'vale', vendor = VENDOR }) {
  const style = document.createElement('style'); style.textContent = CSS; document.head.appendChild(style);
  const box = document.createElement('div'); box.id = 'world3d'; box.setAttribute('aria-hidden', 'true');
  const ui = document.createElement('div'); ui.id = 'world3d-ui'; ui.setAttribute('aria-hidden', 'true');
  // (straight after the game's canvas, unstacked, as it is: so the vignette, the top bar and everything after them stay over
  // the world. At z-index 1 the world covered the top bar, the ☰ and the vignette, none of which carry a z-index.)
  const game = document.getElementById('game');
  if (game) game.after(box); else document.body.prepend(box);
  document.body.append(ui);
  document.body.classList.add('world3d');                      // (the top bar's backdrop: CSS above)
  let api = null, built = null, building = null, last = 0, origin = { x: 0, y: 0 }, lastC = null, ours = [], oursState = '', oursCheck = 0, houses = [], ambient = null;
  const state = { level: null, sprites: 0, loads: 0, failed: '' };
  renderer.setExternal({
    // a tap on a service's building, as Luminati draws it (renderer.js serviceAt): each named house's box (its footprint,
    // its walls and roof) through Luminati's camera, the nearest of those under the finger
    serviceAt: (sx, sy) => {
      if (!api || built !== sim.world) return null;
      let best = null;
      for (const { o, sv } of houses) {
        const hw = o.opts.width / 2, hd = o.opts.depth / 2, top = GROUND_Y + 2.4 * (o.opts.stories || 1) + 2;
        let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
        for (const [dx, dz] of [[-hw, -hd], [hw, -hd], [-hw, hd], [hw, hd]]) for (const y of [GROUND_Y, top]) {
          const q = api.project(o.x + dx, y, o.z + dz); if (!q) return null;
          x0 = Math.min(x0, q[0]); x1 = Math.max(x1, q[0]); y0 = Math.min(y0, q[1]); y1 = Math.max(y1, q[1]);
        }
        if (sx >= x0 && sx <= x1 && sy >= y0 && sy <= y1 && (!best || o.x + o.z > best.k)) best = { sv, k: o.x + o.z };
      }
      return best ? best.sv : null;
    },
    ready: (w) => {
      if (!api) return false;
      if (built === w) return true;
      if (building !== w) {                                   // a new world: convert it and build it behind black
        building = w;
        const r = convertWorld(w, { region: w.region || region });
        origin = r.origin; state.level = `${r.level.width}×${r.level.depth}`; state.sprites = r.sprites.length; state.loads++;
        ours = r.sprites.filter((q) => q.prop); oursState = propState(w, ours); ambient = r.ambient || null;
        houses = r.level.objects.filter((o) => o.type === 'house' && o.name).map((o) => ({ o, sv: (w.services || []).find((v) => v.name === o.name) })).filter((q) => q.sv);
        const sprites = r.sprites.map((q) => (q.prop ? propSprite(w, q) : q)).filter(Boolean);
        api.load(r.level, sprites, w.region || region).then((ok) => { if (ok && building === w) built = w; })
          .catch((err) => { state.failed = String(err?.message || err); console.error('[luminati]', err); built = w; });
      }
      return false;
    },
    frame: (draws, c) => {
      if (!api || built !== sim.world) return;
      lastC = c;
      if (ours.length && ++oursCheck % 20 === 0) {                 // (a chest opened, a shrine used: its prop as it is now)
        const st = propState(sim.world, ours);
        if (st !== oursState) { oursState = st; api.sprites(ours.map((q) => propSprite(sim.world, q)).filter(Boolean)); }
      }
      const now = c.now, dt = last ? Math.min(0.1, (now - last) / 1000) : 1 / 60; last = now;
      // the ground point at the middle of the screen (iso.js unproject at the floor's height), in Luminati's units
      const cx = c.vw / (2 * c.S), cy = c.vh / (2 * c.S);
      const a = (cx - c.rx) / HW, b = (cy - c.ry + SIM_FLOOR * ZH) / HH;
      const mx = (a + b) / 2, my = (b - a) / 2;
      const ppu = (NATIVE_PER_UNIT * c.S) / c.k;              // CSS px a unit
      const actors = [], rings = [], beasts = [], bits = [];
      let mark = null;
      for (const d of draws) {
        if (d.lift !== undefined && d.sp && !d.atl) {             // a held or flying piece (Teague's cage, a bolt): its ground point, lifted
          const u = (d.fx - c.ox) / HW, v = (d.fy - c.oy + d.h) / HH, x = (u + v) / 2, y = (v - u) / 2;
          bits.push({ canvas: bitCanvas(d.sp, !!d.glow), ax: d.sp.ax, ay: d.sp.ay, x: (x - origin.x) / 2, z: (y - origin.y) / 2, lift: d.lift, glow: d.glow ? 1 : 0, flash: (d.look && d.look.flash) || 0 });
          continue;
        }
        if (d.env && !d.atl) {                                  // a farm beast, in the frame Emberlit chose (render/beasts.js)
          const u = (d.fx - c.ox) / HW, v = (d.fy - c.oy + d.h) / HH;
          beasts.push({ id: d.env, x: ((u + v) / 2 - origin.x) / 2, z: ((v - u) / 2 - origin.y) / 2 }); continue;
        }
        if (!d.atl || !d.a || !d.atl.name) continue;
        // the figure's ground point: Emberlit drew it at (fx, fy) = camera + project(x, y, z), z·ZH in d.h
        const u = (d.fx - c.ox) / HW, v = (d.fy - c.oy + d.h) / HH, x = (u + v) / 2, y = (v - u) / 2;
        const fade = d.look ? Math.max(d.look.fade || 0, d.look.dissolve || 0, d.look.ghost ? 0.55 : 0) : 0;
        const X = (x - origin.x) / 2, Z = (y - origin.y) / 2;
        actors.push({ name: d.atl.name, cw: d.atl.meta.cw, col: d.a.frame, row: d.a.dir, x: X, z: Z, fade, flash: (d.look && d.look.flash) || 0, warn: (d.look && d.look.warn) || 0, key: keyOf(d.u || d.who) });   // (cw: as drawn, a boss 1.3×; key: the same figure each frame, its model's)
        // in a fight, a ring at each fighter's feet in its side's colour (Emberlit's footMark), on the ground in 3D
        if (c.rings && d.team !== undefined && TEAM_RGB[d.team] && !(d.look && (d.look.ghost || d.look.dissolve))) {
          rings.push({ x: X, z: Z, col: TEAM_RGB[d.team], a: 0.55 });
          if (d.uid && d.uid === sim.focusId) mark = { x: X, z: Z };   // the foe a tap set the party on (battle.js focus)
        }
      }
      // the ground a fight churns (battle.js hazards: the Toadking's mud, the Vatwarden's sluice), welling up and sinking away
      const hazards = [];
      for (const hz of (c.battle && c.battle.hazards) || []) {
        const fade = Math.max(0, Math.min(1, (hz.until - sim.state.t) / 0.8, (sim.state.t - (hz.from ?? -1e9)) / 0.4));
        hazards.push({ x: (hz.x - origin.x) / 2, z: (hz.y - origin.y) / 2, r: (hz.r * Math.SQRT2) / 2, col: hz.kind === 'sluice' ? [24, 40, 14] : [26, 20, 14], rim: hz.kind === 'sluice' ? [104, 132, 52] : [128, 104, 64], a: fade });
      }
      const p = sim.state.player, wx = sim.world.kind === 'dungeon' ? null : weatherNow(sim);
      api.frame({ dt, focus: [(mx - origin.x) / 2, GROUND_Y, (my - origin.y) / 2], ppu, hour: hourOf(c.t ?? sim.state.t),
        weather: wx && wx.k > 0.3 && (wx.kind === 'rain' || wx.kind === 'snow') ? wx.kind : 'clear',
        fog: wx && wx.kind === 'fog' ? wx.k : 0,                    // (Luminati has no fog weather: its air thickened; Emberlit's overlay drifts the banks)
        hero: [(p.x - origin.x) / 2, (p.y - origin.y) / 2], actors, rings, hazards, beasts, mark, ambient, bits, water: waterOf(c.battle, origin),
        // Frost Nova and Turn Undead in Luminati's looks (renderer.js spellsNow): their reach at Emberlit's size, as the warnings
        spells: (c.spells || []).map((S) => ({ key: S.key, id: S.id, seed: S.seed, age: S.age, land: S.land, x: (S.x - origin.x) / 2, z: (S.y - origin.y) / 2,
          tx: (S.tx - origin.x) / 2, tz: (S.ty - origin.y) / 2, r: (S.r * Math.SQRT2) / 2, k: S.k || 0, reached: S.reached.map((o) => ({ x: (o.x - origin.x) / 2, z: (o.y - origin.y) / 2 })),
          fx: ((S.fx ?? S.x) - origin.x) / 2, fz: ((S.fy ?? S.y) - origin.y) / 2 })),   // (fx, fz: where a leap or a dash began)
        // a foe's warning (renderer.js warnsNow): a heavy blow's ring at Emberlit's size (its circles drawn ×√2), a shot's lane
        warns: (c.warns || []).map((w) => ({ x: (w.x - origin.x) / 2, z: (w.y - origin.y) / 2, tx: (w.tx - origin.x) / 2, tz: (w.ty - origin.y) / 2,
          r: ((w.boss ? WARN_R.boss : WARN_R.heavy) * Math.SQRT2) / 2, w: ((w.heavy ? 0.6 : 0.4) * Math.SQRT2) / 2, p: w.p, hit: w.hit, heavy: w.heavy, lane: w.lane })),
        blast: c.blast ? { x: (c.blast.x - origin.x) / 2, z: (c.blast.y - origin.y) / 2, k: c.blast.k } : null,   // (a fire landing's light: renderer.js blasts)
        bright: sim.world.kind === 'dungeon' ? 1 : brightAt(brightFor(sim.world.region || 'vale', sim.state.scene, dial), c.t ?? sim.state.t),   // (bright.js: the shipped look × the player's dial)
        draw: globalThis.__lumDraw !== false,                   // (dev, tools/capture/rig.mjs: frames stepped and not drawn while a shot settles)
        // the fights' light: Emberlit's fx.js drawn on black into its emissive plane (native px), for Luminati to lay over its
        // picture as light, placed as Emberlit composites its window (CSS px: the plane's origin and a native px's size).
        // In Luminati's own render, not as page layers blended over it: those (plus-lighter, a CSS blur) left the top bar's
        // words soft on a phone's Safari.
        // Its alpha holds each effect's owner's depth key (fx.js flush): Luminati dims an effect where a wall, a prop or
        // a figure nearer the camera stands over it, as Emberlit's own depth plane did (key: a sim x + y, from base by step)
        light: c.emi ? { emi: c.emi, w: c.nvw, h: c.nvh, x: (c.rx - c.ox) * (c.S / c.k), y: (c.ry - c.oy) * (c.S / c.k), px: c.S / c.k,
          key: c.key ? { base: c.key.base, step: c.key.step, origin: origin.x + origin.y } : null } : null,
        // the hero's ember-wisp (Emberlit's carry light): a light at the shoulder, strong underground and by night, gone by day
        carry: sim.world.kind === 'dungeon' ? 1 : CARRY[Math.floor((((c.t ?? sim.state.t) % DAY_S) + DAY_S) % DAY_S / PART_S)] });
    },
  });
  const mod = await import(vendor);
  api = mod.createWorld({ container: box, uiRoot: ui, assets: new URL('../../assets/', import.meta.url).href });
  api.settings({ dof: readGraphics().dof, figures: new URLSearchParams(location.search).get('figures') === 'sprites' ? 'sprites' : 'models',
    landmarks: new URLSearchParams(location.search).get('landmarks') === '3d' ? '3d' : 'sprites' });   // (?landmarks=3d: the Vale's dungeon doors built: docs/vale-landmarks-proposal.md)   // (?figures=sprites: the atlases, as before the models: docs/dungeon-kit-proposal.md §9)
  let dial = readGraphics().bright;                              // (the menu's Brightness tray: a percentage a part, ui/brightness.js)
  return {
    box, state,
    /** (for checks) the level's origin: a sim point x is Luminati's (x − origin.x) / 2 */
    get origin() { return origin; },
    /** the menu's depth of field, applied at once @param {'soft'|'off'} dof */
    setDof: (dof) => api && api.settings({ dof }),
    /** the menu's Brightness dial, applied at once @param {import('./settings.js').Bright} b percentages by part (100: as shipped) */
    setBright: (b) => { dial = b; },
    get world() { return api; },
    /** (for checks) a ground point of ours on the screen, CSS px: where Emberlit puts it (its overlay, its taps) and where
     * Luminati draws it; the two should agree to a pixel or two @param {number} x @param {number} y */
    probe(x, y) {
      if (!lastC || !api) return null;
      const q = project(x, y, SIM_FLOOR), k = lastC.S / lastC.k;
      return { emberlit: [(lastC.rx + q.sx) * k, (lastC.ry + q.sy) * k], luminati: api.project((x - origin.x) / 2, GROUND_Y, (y - origin.y) / 2) };
    },
  };
}
