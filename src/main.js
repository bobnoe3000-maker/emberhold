// main.js — boot + game loop. Fixed 20 Hz sim, render interpolated at display rate.

import { createSim, TICK_DT } from './sim/core.js';
import { createRenderer } from './render/renderer.js';
import { createInput } from './ui/input.js';
import { createHud } from './ui/hud.js';
import { createTownMenu } from './ui/townmenu.js';
import { createPartyPanel } from './ui/party.js';
import { createCompass } from './ui/compass.js';
import { createGearSheet } from './ui/sheet.js';
import { mulberry32, streamSeed, STREAM } from './sim/rng.js';
import { rollRecipe } from './assetforge/doll.js';
import { loadInto, createAutosave } from './persist/save.js';
import { screenDirToWorld } from './render/iso.js';

const WORLD_SEED = 20260807;
// Theme picks the level's terrain (dread · desert · poison · ember · lava · chasm).
// Defaults to a seed-derived theme; ?theme= overrides for previewing a biome.
const THEME = new URLSearchParams(location.search).get('theme') || undefined;

const canvas = document.getElementById('game');
// ?scene=town|overland|dungeon picks where a fresh game starts (default: Thornwick).
const SCENE = new URLSearchParams(location.search).get('scene') || 'town';
// ?region=vale|fens|reach|heights previews another region's hub town (same buildings, its own tones).
const REGION = new URLSearchParams(location.search).get('region') || 'vale';
const sim = createSim(WORLD_SEED, THEME, { scene: SCENE, region: REGION });
if (location.search.includes('dev')) globalThis.__sim = sim;   // dev inspection hook
const input = createInput(canvas);
const renderer = createRenderer(canvas, sim, input);
createHud(sim);
const partyPanel = createPartyPanel(sim);
const townMenu = createTownMenu(sim, partyPanel);   // subscribe before restore, so a loaded counters event repaints
createCompass(sim, { partyPanel, inSquare: () => townMenu.inSquare() });   // compass travel (docs/compass-mockup.html)
const gearSheet = createGearSheet(sim, { partyPanel });   // tap a party card: gear, stats, the bag (docs/gear-mockup.html)
if (location.search.includes('dev')) globalThis.__gear = gearSheet;

// Restore a prior session for this world (player, counters, harvested resources).
// Must run before the first render so restored mods are reflected in chunk bakes.
// an explicit ?scene= link (review / preview) starts fresh there instead of resuming a save
if (!new URLSearchParams(location.search).has('scene')) loadInto(sim);
createAutosave(sim);

// Hero: deterministic recipe from the world seed's recipe stream.
const heroRng = mulberry32(streamSeed(WORLD_SEED, STREAM.RECIPE));
const hero = rollRecipe(heroRng);
hero.tool = null;                 // hands free at spawn; tools come from crafting (phase 1)
renderer.setHero(hero);

// tap: a service → its menu; an enemy → focus; anything else → walk there (and use a chest /
// shrine / stairs / growth when it's what you tapped)
input.onTap((sx, sy) => {
  const sv = renderer.serviceAt(sx, sy);                 // a service building: its menu once you're in the square,
  if (sv && townMenu.inSquare()) { townMenu.open(sv); return; }
  if (sv) { const h = sim.world.hub; sim.commands.push({ type: 'tap', tx: Math.floor(h.x), ty: Math.floor(h.y) }); return; }   // else walk to the square
  const foe = renderer.enemyAt(sx, sy);                  // tap an enemy: the party focuses it
  if (foe) { sim.commands.push({ type: 'focus', id: foe.id }); return; }
  const { tx, ty } = renderer.screenToTile(sx, sy, 1);
  sim.commands.push({ type: 'tap', tx, ty });
});

// ---- loop ----
let last = performance.now();
let acc = 0;
const MAX_FRAME = 0.25;           // clamp after tab-away
// dev slow motion (?dev&slow=8, or globalThis.__slow at runtime): the sim and the render
// clock run 8× slower — for inspecting animation and weapon effects frame by frame
const DEV = location.search.includes('dev');
if (DEV) globalThis.__slow = Math.max(1, +(new URLSearchParams(location.search).get('slow') || 1));
let vnow = performance.now(), slowed = false;

function frame(now) {
  const SLOW = DEV ? Math.max(1, globalThis.__slow || 1) : 1;
  let dt = (now - last) / 1000 / SLOW;
  last = now;
  if (SLOW !== 1 || slowed) { vnow += Math.min(dt, MAX_FRAME) * 1000; now = vnow; slowed = true; } else vnow = now;
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
  if (!MANUAL) requestAnimationFrame(frame);
}
// dev manual clock (?dev&manual): the page stops driving frames itself; a capture script calls
// globalThis.__frame(ms) at exact intervals, so motion traces don't depend on the machine's speed
const MANUAL = DEV && location.search.includes('manual');
if (MANUAL) { let mt = performance.now(); last = mt; globalThis.__frame = (ms = 1000 / 60) => { mt += ms; frame(mt); }; }
else requestAnimationFrame(frame);

// pause the clock when backgrounded (offline math covers gaps later)
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) last = performance.now();
});
