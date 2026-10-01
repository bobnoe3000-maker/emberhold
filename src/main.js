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
import { SLOTS, activeSlot, setActiveSlot, readSlot, writeSlot, migrateLegacy, createAutosave } from './persist/save.js';
import { createSlotsWindow } from './ui/slots.js';
import { createTitle } from './ui/title.js';
import { createCreation } from './ui/create.js';
import { createPartyScreen } from './ui/partyscreen.js';
import { createCinema } from './cutscene/player.js';
import { createDialogue } from './ui/dialogue.js';
import { createJournal } from './ui/journal.js';
import { createStepOut } from './ui/stepout.js';
import { createDefeat } from './ui/defeat.js';
import { NPCS } from './sim/npcs.js';
import { screenDirToWorld } from './render/iso.js';

const WORLD_SEED = 20260807;                      // slot 1's world (and every pre-slots save)
const params = new URLSearchParams(location.search);
// Theme picks the level's terrain (dread · desert · poison · ember · lava · chasm).
// Defaults to a seed-derived theme; ?theme= overrides for previewing a biome.
const THEME = new URLSearchParams(location.search).get('theme') || undefined;

const canvas = document.getElementById('game');
// ?scene=town|overland|dungeon picks where a fresh game starts (default: Thornwick).
const SCENE = new URLSearchParams(location.search).get('scene') || 'town';
// ?region=vale|fens|reach|heights previews another region's hub town (same buildings, its own tones).
const REGION = new URLSearchParams(location.search).get('region') || 'vale';
// ?scene=dungeon&site=tithe_mill|wickham_keep|sunken_chapel|ninth_milestone previews another dungeon site (sim/sites.js).
const SITE = new URLSearchParams(location.search).get('site') || 'barrows';
// Game slots (GDD §6.1): three games, each its own seed, main character, party and progress.
// ?slot=N picks one (and makes it active). An explicit ?scene= link (review / preview) starts
// fresh there and never writes a slot — before slots it silently overwrote the real save.
const PREVIEW = params.has('scene');
await migrateLegacy();                                            // the v3 single save → slot 1
const SLOT = params.has('slot') ? Math.max(1, Math.min(SLOTS, +params.get('slot') || 1)) : activeSlot();
if (params.has('slot')) setActiveSlot(SLOT);
const saved = PREVIEW ? null : await readSlot(SLOT);
const SEED = saved ? saved.data.seed >>> 0 : SLOT === 1 ? WORLD_SEED : crypto.getRandomValues(new Uint32Array(1))[0];
const sim = createSim(SEED, THEME, { scene: SCENE, region: REGION, site: SITE });
// Dev hooks (?dev: the live sim on globalThis, slow motion, manual clock) exist only on a local
// server — on a deployed build they'd be a one-line cheat console. (They can't make cheating
// *possible*, only easy: progression is trusted only once the server replays it — replay.js.)
const DEV = location.search.includes('dev') && /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname);
if (DEV) globalThis.__sim = sim;   // dev inspection hook
const input = createInput(canvas);
const renderer = createRenderer(canvas, sim, input);
if (DEV) globalThis.__renderer = renderer;   // dev: hit-tests for captures and browser tests
const hud = createHud(sim);
const partyPanel = createPartyPanel(sim);
const partyScreen = createPartyScreen({ sim, openSheet: (i) => gearSheet.open(i) });   // the three hero slots and the bench
const townMenu = createTownMenu(sim, partyPanel, { openParty: () => partyScreen.open() });   // subscribe before restore, so a loaded counters event repaints
const journal = createJournal({ sim, npcName: (id) => (cast[id] ? cast[id].name : id), toast: (m, ms) => hud.show(m, ms), partyPanel });   // quests (M4): the Journal, tracker and toasts
createStepOut({ sim, partyPanel });   // the way out of a fight (GDD §7.1)
createDefeat({ sim });                // a wipe: what happened, before you wake at the Shrine (ui/defeat.js)
createCompass(sim, { partyPanel, inSquare: () => townMenu.inSquare(), questTitle: (id) => journal.title(id) });   // compass travel (docs/compass-mockup.html)
const gearSheet = createGearSheet(sim, { partyPanel });   // tap a party card: gear, stats, the bag (docs/gear-mockup.html)
if (DEV) globalThis.__gear = gearSheet;
// named NPCs (M4): their look, name and Ink file from content/npcs/; tap one to talk (dialogue.js)
const cast = {};
Promise.all(Object.keys(NPCS).map((id) => fetch(`./content/npcs/${id}.json`).then((r) => r.json()).then((d) => { cast[id] = d; }).catch(() => {})))
  .then(() => renderer.setCast(cast));
const dialogue = createDialogue({ sim, cast: () => cast, openService: (kind) => townMenu.open(kind) });

// Restore the slot's game (party, counters, the dungeon overlay, discovery). Must run before
// the first render so restored mods are reflected in chunk bakes.
if (saved) sim.restore(saved.data);
// Autosave only a game that has its hero: a slot stays empty until creation's Begin.
let autosave = null;
const startAutosave = () => { if (PREVIEW || autosave) return; autosave = createAutosave(sim, SLOT); autosave.save(); };
if (sim.state.created) startAutosave();
sim.bus.on('heroCreated', startAutosave);
const slots = createSlotsWindow({ active: SLOT, saveNow: () => (PREVIEW || !sim.state.created ? Promise.resolve(true) : writeSlot(SLOT, sim)) });

// Boot, title and creation (development plan §2.1): the studio splash and the loading screen
// (cutscene/player.js, waiting on the renderer's first atlases) → the title / pause menu
// (title.js) → Begin plays the intro, "The Chronicle of the Fall", then character creation
// (create.js). The sim doesn't tick through any of it, except creation, since Begin is a command
// the sim has to take. The intro's music plays on under the title and creation, and fades out
// into play. ?notitle (tests, captures) and previews skip all of it and play straight away.
const BOOT = !PREVIEW && !params.has('notitle');
let paused = BOOT;
const cinema = createCinema();
const creation = createCreation({ sim, onDone: () => { paused = false; cinema.stopMusic(); } });
const title = createTitle({ sim, slot: SLOT, setPaused: (on) => { paused = on; }, openSlots: () => slots.open(),
  openParty: () => partyScreen.open(), openCreate: () => cinema.intro(() => { paused = false; creation.open(); }),
  openChronicle: (mode) => cinema.intro(() => title.open(mode)), onPlay: () => cinema.stopMusic(),
  onOpen: () => { townMenu.close(); gearSheet.close(); partyScreen.close(); } });   // the menu comes up over a clear screen
if (BOOT) cinema.boot(renderer.ready, () => title.open('title'));
else document.getElementById('bootSplash')?.remove();
if (DEV) globalThis.__ui = { title, creation, partyScreen, slots, cinema, dialogue, journal };

// Hero: deterministic recipe from the world seed's recipe stream.
const heroRng = mulberry32(streamSeed(SEED, STREAM.RECIPE));
const hero = rollRecipe(heroRng);
hero.tool = null;                 // hands free at spawn; tools come from crafting (phase 1)
renderer.setHero(hero);

// tap: a named person → talk; a service → its menu; an enemy → focus; anything else → walk there (and use a chest /
// shrine / stairs / growth when it's what you tapped)
input.onTap((sx, sy) => {
  const npc = renderer.npcAt(sx, sy);                    // a named person: walk over and talk (the sim checks reach)
  if (npc) { sim.commands.push({ type: 'talk', npc: npc.id }); return; }
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
if (DEV) globalThis.__slow = Math.max(1, +(new URLSearchParams(location.search).get('slow') || 1));
let vnow = performance.now(), slowed = false;

function frame(now) {
  // the next frame first: an error while drawing (a renderer bug) must not stop the loop — it
  // did once, and a missing class in a lookup froze the whole game at the first fight
  if (!MANUAL) requestAnimationFrame(frame);
  const SLOW = DEV ? Math.max(1, globalThis.__slow || 1) : 1;
  let dt = (now - last) / 1000 / SLOW;
  last = now;
  if (SLOW !== 1 || slowed) { vnow += Math.min(dt, MAX_FRAME) * 1000; now = vnow; slowed = true; } else vnow = now;
  if (dt > MAX_FRAME) dt = MAX_FRAME;
  acc += dt;

  while (acc >= TICK_DT) {
    if (paused || renderer.transiting) { acc -= TICK_DT; continue; }   // (a scene change baking: hold still, or a stick still held could walk you back out)
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

  if (!cinema.playing) renderer.render(acc / TICK_DT, now);   // the intro covers the world: don't draw it underneath
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
