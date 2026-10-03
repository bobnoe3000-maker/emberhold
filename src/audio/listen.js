// @ts-check
// listen.js — turns what happens into sound (docs/sound-plan.md §4). It hears two things, and writes neither:
//   sim.bus     the sim's events: blows, heals, wards, level-ups, loot, chests, stairs (cues.js eventCue)
//   each frame  the figures the renderer drew (renderer.onFrame): a foot coming down, a swing beginning; and the
//               foes in the world: one arriving (its cry), one falling (its death)
// and keeps the place's ambience: the creek by its distance, birds and owls by the time of day, rain or a wind by the
// weather, the dungeon's drips, its draught and the goblins' fires.
//
// Positions: a sound pans by where its figure stands on the screen, and fades with its distance from the view's centre
// (silent beyond HEAR tiles). The party is heard at full level, foes a little under, townsfolk quietly.
// Catch-up is silent: a frame that ran many ticks (a resume) plays nothing it missed, and a world change starts clean.

import { voiceOf, familyOf, swingOf, stepOf, eventCue, ambienceFor, RIVER_REACH } from './cues.js';
import { materialAt } from '../sim/world.js';
import { partOf } from '../sim/npcs.js';
import { weatherNow } from '../render/weatherfx.js';

const HEAR = 22;                                    // tiles: beyond this a figure is silent
const TEAM_GAIN = { 0: 0.45, 1: 0.9, 2: 0.7, 3: 0.75 };
const CRY_EVERY = 1500;                             // ms: one cry per family this often, at most
const AMB_EVERY = 400;                              // ms between ambience updates

/** @param {{ sim: any, audio: ReturnType<typeof import('./engine.js').createAudio>, renderer: any }} o */
export function createListener({ sim, audio, renderer }) {
  /** @type {Map<number, { dead: boolean, cried: boolean }>} */ let foes = new Map();
  const cried = new Map();
  let world = sim.world, ambAt = -1e9, view = { hx: 0, hy: 0, nvw: 360, ix: 0, iy: 0 };

  const fall = (dx, dy) => { const d = Math.hypot(dx, dy); return d > HEAR ? 0 : 1 / (1 + (d / 9) * (d / 9)); };
  const panOf = (sx) => Math.max(-0.85, Math.min(0.85, (sx - view.hx) / (view.nvw * 0.5)));
  const screenX = (x, y) => view.hx + ((x - y) - (view.ix - view.iy)) * 8;         // iso: 8 px a tile along x − y

  // the sim's events
  for (const name of ['combat', 'levelUp', 'loot', 'chestOpened', 'descend', 'traded']) {
    sim.bus.on(name, (ev) => {
      if (name === 'combat' && ev && ev.t === 'hit') return hit(ev);
      const c = eventCue(name, ev); if (!c) return;
      const at = ev && typeof ev.x === 'number' ? { pan: panOf(screenX(ev.x, ev.y)), gain: Math.max(0.35, fall(ev.x - view.ix, ev.y - view.iy)) } : {};
      audio.play(c, at);
    });
  }
  // a blow lands: its body, and now and then the one it landed on cries out
  function hit(ev) {
    const g = fall(ev.x - view.ix, ev.y - view.iy); if (!g) return;
    const pan = panOf(screenX(ev.x, ev.y));
    audio.blow({ crit: !!ev.crit, heavy: !!ev.heavy }, { pan, gain: 0.8 * g });
    if (!ev.party) {                                  // a foe was struck (ev.party: the one hit is the party's): the nearest foe to the blow
      let best = null, bd = 1.5;
      for (const e of world.enemies || []) { const d = Math.hypot(e.x - ev.x, e.y - ev.y); if (d < bd && e.hp > 0) { bd = d; best = e; } }
      if (best) audio.play(voiceOf(best.kind, 'hurt'), { pan, gain: g });
    }
  }
  sim.bus.on('levelChanged', () => { foes = new Map(); cried.clear(); world = sim.world; ambAt = -1e9; });

  // each frame: steps and swings from the figures drawn, arrivals and deaths from the foes
  renderer.onFrame((draws, v) => {
    view = v; world = sim.world;
    const dungeon = world.kind === 'dungeon';
    for (const d of draws) {
      const a = d.a; if (!a || (!a.step && !a.swing) || d.team === undefined) continue;
      const g = fall(a.x - v.ix, a.y - v.iy) * (TEAM_GAIN[d.team] ?? 0.5); if (!g) continue;
      const pan = panOf(d.fx), name = d.atl ? d.atl.name || '' : '';
      if (a.step) audio.play(stepOf(materialAt(world, a.x, a.y), dungeon, name), { pan, gain: g });
      if (a.swing) audio.play(swingOf(name), { pan, gain: g });
    }
    const now = performance.now();
    for (const e of world.enemies || []) {
      let f = foes.get(e.id);
      if (!f) { f = { dead: e.hp <= 0, cried: false }; foes.set(e.id, f); }
      if (!f.cried && !f.dead) {                      // a foe comes within earshot (it walks in, or rises): its cry, once per family a while
        const g = fall(e.x - v.ix, e.y - v.iy);
        if (g) {
          f.cried = true; const fam = familyOf(e.kind);
          if (now - (cried.get(fam) ?? -1e9) > CRY_EVERY) { cried.set(fam, now); audio.play(voiceOf(e.kind, 'cry'), { pan: panOf(screenX(e.x, e.y)), gain: Math.max(0.5, g) }); }
        }
      }
      if (!f.dead && e.hp <= 0) {                     // fallen: its death
        f.dead = true;
        const g = fall(e.x - v.ix, e.y - v.iy); if (g) audio.play(voiceOf(e.kind, 'die'), { pan: panOf(screenX(e.x, e.y)), gain: g });
      }
    }
    if (now - ambAt > AMB_EVERY) { ambAt = now; ambience(); }
    audio.tick();
  });

  // the place: how near the water is (outdoors), the time of day, the dungeon's theme
  function ambience() {
    const kind = world.kind || 'overland';
    let waterD = Infinity;
    if (kind !== 'dungeon') {
      for (let dy = -RIVER_REACH; dy <= RIVER_REACH; dy += 2) for (let dx = -RIVER_REACH; dx <= RIVER_REACH; dx += 2) {
        const d = Math.hypot(dx, dy); if (d >= waterD) continue;
        const m = materialAt(world, view.ix + dx, view.iy + dy); if (m === 'water' || m === 'bank') waterD = d;
      }
    }
    const levels = ambienceFor({ kind, theme: world.theme ?? null, part: partOf(sim.state.t || 0), waterD, weather: weatherNow(sim) });
    for (const [name, lv] of Object.entries(levels)) audio.loop(name, lv);
  }
}
