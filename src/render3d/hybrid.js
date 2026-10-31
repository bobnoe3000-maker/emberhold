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

// the sim's four parts of the day (dawn · day · dusk · night, PART_S each) on Luminati's clock: where each part begins
const PART_HOURS = [5, 7.5, 17.5, 20.5, 29];
/** the hour on Luminati's 24-hour clock for t seconds of play @param {number} t */
export function hourOf(t) {
  const s = ((t % DAY_S) + DAY_S) % DAY_S, p = Math.floor(s / PART_S), u = (s - p * PART_S) / PART_S;
  return (PART_HOURS[p] + (PART_HOURS[p + 1] - PART_HOURS[p]) * u) % 24;
}
const NATIVE_PER_UNIT = 16 * Math.SQRT2;                      // (iso.js: a tile's half-width 8 px; two tiles a unit)

/** the bundle (tools/render3d/build.mjs; its folder is named for Luminati's pin) */
export const VENDOR = '../vendor/luminati-80e1aa6/luminati.js';
const CSS = `#world3d { position: fixed; inset: 0; z-index: 1; pointer-events: none; background: #000; overflow: hidden; }
#world3d canvas { display: block; width: 100%; height: 100%; }
#world3d-ui { position: fixed; inset: 0; z-index: -1; visibility: hidden; pointer-events: none; overflow: hidden; }`;

/**
 * Put Luminati under the game. Resolves to a small handle (for checks) once Luminati is loaded.
 * @param {{ renderer: any, sim: any, region?: string, vendor?: string }} o
 */
export async function attachLuminati({ renderer, sim, region = 'vale', vendor = VENDOR }) {
  const style = document.createElement('style'); style.textContent = CSS; document.head.appendChild(style);
  const box = document.createElement('div'); box.id = 'world3d'; box.setAttribute('aria-hidden', 'true');
  const ui = document.createElement('div'); ui.id = 'world3d-ui'; ui.setAttribute('aria-hidden', 'true');
  document.body.append(box, ui);
  let api = null, built = null, building = null, last = 0, origin = { x: 0, y: 0 }, lastC = null;
  const state = { level: null, sprites: 0, loads: 0, failed: '' };
  renderer.setExternal({
    ready: (w) => {
      if (!api) return false;
      if (built === w) return true;
      if (building !== w) {                                   // a new world: convert it and build it behind black
        building = w;
        const r = convertWorld(w, { region: w.region || region });
        origin = r.origin; state.level = `${r.level.width}×${r.level.depth}`; state.sprites = r.sprites.length; state.loads++;
        api.load(r.level, r.sprites, w.region || region).then((ok) => { if (ok && building === w) built = w; })
          .catch((err) => { state.failed = String(err?.message || err); console.error('[luminati]', err); built = w; });
      }
      return false;
    },
    frame: (draws, c) => {
      if (!api || built !== sim.world) return;
      lastC = c;
      const now = c.now, dt = last ? Math.min(0.1, (now - last) / 1000) : 1 / 60; last = now;
      // the ground point at the middle of the screen (iso.js unproject at the floor's height), in Luminati's units
      const cx = c.vw / (2 * c.S), cy = c.vh / (2 * c.S);
      const a = (cx - c.rx) / HW, b = (cy - c.ry + SIM_FLOOR * ZH) / HH;
      const mx = (a + b) / 2, my = (b - a) / 2;
      const ppu = (NATIVE_PER_UNIT * c.S) / c.k;              // CSS px a unit
      const actors = [];
      for (const d of draws) {
        if (!d.atl || !d.a || !d.atl.name) continue;
        // the figure's ground point: Emberlit drew it at (fx, fy) = camera + project(x, y, z), z·ZH in d.h
        const u = (d.fx - c.ox) / HW, v = (d.fy - c.oy + d.h) / HH, x = (u + v) / 2, y = (v - u) / 2;
        const fade = d.look ? Math.max(d.look.fade || 0, d.look.dissolve || 0, d.look.ghost ? 0.55 : 0) : 0;
        actors.push({ name: d.atl.name, cw: d.atl.meta.cw, col: d.a.frame, row: d.a.dir, x: (x - origin.x) / 2, z: (y - origin.y) / 2, fade });   // (cw: as drawn, a boss 1.3×)
      }
      const p = sim.state.player, wx = sim.world.kind === 'dungeon' ? null : weatherNow(sim);
      api.frame({ dt, focus: [(mx - origin.x) / 2, GROUND_Y, (my - origin.y) / 2], ppu, hour: hourOf(c.t ?? sim.state.t),
        weather: wx && wx.k > 0.3 && (wx.kind === 'rain' || wx.kind === 'snow') ? wx.kind : 'clear',
        hero: [(p.x - origin.x) / 2, (p.y - origin.y) / 2], actors });
    },
  });
  const mod = await import(vendor);
  api = mod.createWorld({ container: box, uiRoot: ui, assets: new URL('../../assets/', import.meta.url).href });
  api.settings({ dof: readGraphics().dof });
  return {
    box, state,
    /** the menu's depth of field, applied at once @param {'soft'|'off'} dof */
    setDof: (dof) => api && api.settings({ dof }),
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
