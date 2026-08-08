// main.js — boot + game loop. Fixed 20 Hz sim, render interpolated at display rate.

import { createSim, TICK_DT } from './sim/core.js';
import { createRenderer } from './render/renderer.js';
import { createInput } from './ui/input.js';
import { createHud } from './ui/hud.js';
import { mulberry32, streamSeed, STREAM } from './sim/rng.js';
import { rollRecipe } from './assetforge/doll.js';

const WORLD_SEED = 20260807;

const canvas = document.getElementById('game');
const sim = createSim(WORLD_SEED);
const input = createInput(canvas);
const renderer = createRenderer(canvas, sim, input);
createHud(sim);

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
    if (v) sim.commands.push({ type: 'move', x: v.x, y: v.y });
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
