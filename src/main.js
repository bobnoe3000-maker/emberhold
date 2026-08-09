// main.js — boot + game loop. Fixed 20 Hz sim, render interpolated at display rate.

import { createSim, TICK_DT } from './sim/core.js';
import { createRenderer } from './render/renderer.js';
import { createInput } from './ui/input.js';
import { createHud } from './ui/hud.js';
import { mulberry32, streamSeed, STREAM } from './sim/rng.js';
import { rollRecipe } from './assetforge/doll.js';
import { loadInto, createAutosave } from './persist/save.js';
import { screenDirToWorld } from './render/iso.js';

const WORLD_SEED = 20260807;
// Theme picks the level's terrain (dread · desert · poison · ember · lava · chasm).
// Defaults to a seed-derived theme; ?theme= overrides for previewing a biome.
const THEME = new URLSearchParams(location.search).get('theme') || undefined;

const canvas = document.getElementById('game');
const sim = createSim(WORLD_SEED, THEME);
const input = createInput(canvas);
const renderer = createRenderer(canvas, sim, input);
createHud(sim);   // subscribe before restore, so a loaded counters event repaints

// Restore a prior session for this world (player, counters, harvested resources).
// Must run before the first render so restored mods are reflected in chunk bakes.
loadInto(sim);
createAutosave(sim);

// Hero: deterministic recipe from the world seed's recipe stream.
const heroRng = mulberry32(streamSeed(WORLD_SEED, STREAM.RECIPE));
const hero = rollRecipe(heroRng);
hero.tool = null;                 // hands free at spawn; tools come from crafting (phase 1)
renderer.setHero(hero);

// tap → harvest command
input.onTap((sx, sy) => {
  const { tx, ty } = renderer.screenToTile(sx, sy, 1);
  sim.commands.push({ type: 'harvest', tx, ty });
});

// ---- loop ----
let last = performance.now();
let acc = 0;
const MAX_FRAME = 0.25;           // clamp after tab-away

function frame(now) {
  let dt = (now - last) / 1000;
  last = now;
  if (dt > MAX_FRAME) dt = MAX_FRAME;
  acc += dt;

  while (acc >= TICK_DT) {
    const v = input.vec();
    if (v) {                                   // screen drag → iso world direction
      const w = screenDirToWorld(v.x, v.y);
      const len = Math.hypot(w.x, w.y) || 1;
      const mag = Math.min(1, Math.hypot(v.x, v.y));
      sim.commands.push({ type: 'move', x: (w.x / len) * mag, y: (w.y / len) * mag });
    }
    sim.tick();
    acc -= TICK_DT;
  }

  renderer.render(acc / TICK_DT, now);
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

// pause the clock when backgrounded (offline math covers gaps later)
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) last = performance.now();
});
