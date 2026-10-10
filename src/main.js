// main.js — boot + game loop. Fixed 20 Hz sim, render interpolated at display rate.

import { createSim, TICK_DT, AWAY_MIN } from './sim/core.js';
import { createRenderer } from './render/renderer.js';
import { watchSafeArea } from './ui/safearea.js';
import { createInput } from './ui/input.js';
import { createHud } from './ui/hud.js';
import { createTownMenu } from './ui/townmenu.js';
import { createPartyPanel } from './ui/party.js';
import { createCompass } from './ui/compass.js';
import { createGearSheet } from './ui/sheet.js';
import { SLOTS, activeSlot, setActiveSlot, readSlot, writeSlot, migrateLegacy, createAutosave } from './persist/save.js';
import { createSlotsWindow } from './ui/slots.js';
import { createTitle } from './ui/title.js';
import { createCreation } from './ui/create.js';
import { createPartyScreen } from './ui/partyscreen.js';
import { createCinema } from './cutscene/player.js';
import { createDialogue } from './ui/dialogue.js';
import { createJournal } from './ui/journal.js';
import { createWorldMap } from './ui/worldmap.js';
import { createStepOut } from './ui/stepout.js';
import { createShrineCard } from './ui/shrine.js';
import { createTowerCard } from './ui/tower.js';
import { createAway } from './ui/away.js';
import { createDefeat } from './ui/defeat.js';
import { createGuildTerms } from './ui/guildterms.js';
import { NPCS } from './sim/npcs.js';
import { screenDirToWorld } from './render/iso.js';
import { createAudio } from './audio/engine.js';
import { createListener } from './audio/listen.js';
import { holdWeather } from './render/weatherfx.js';

const WORLD_SEED = 20260807;                      // slot 1's world (and every pre-slots save)
const params = new URLSearchParams(location.search);
// Theme picks the level's terrain (dread · desert · poison · ember · lava · chasm).
// Defaults to a seed-derived theme; ?theme= overrides for previewing a biome.
const THEME = new URLSearchParams(location.search).get('theme') || undefined;

const canvas = document.getElementById('game');
// Dev hooks (?dev: the live sim on globalThis, slow motion, manual clock, the Stage) exist only on a local
// server — on a deployed build they'd be a one-line cheat console. (They can't make cheating
// *possible*, only easy: progression is trusted only once the server replays it — replay.js.)
const DEV = location.search.includes('dev') && /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname);
// ?scene=town|overland|dungeon picks where a fresh game starts (default: Thornwick); ?dev&scene=stage is the
// dev Stage (src/dev/stage.js: the cast in a lineup, for captures), refused off localhost.
const SCENE0 = new URLSearchParams(location.search).get('scene') || 'town', STAGE = SCENE0 === 'stage' && DEV;
const SCENE = SCENE0 === 'stage' && !DEV ? 'town' : SCENE0;
// ?region=vale|fens|reach|heights previews another region's hub town (same buildings, its own tones).
const REGION = new URLSearchParams(location.search).get('region') || 'vale';
// ?scene=dungeon&site=wickham_keep|sunken_chapel|ninth_milestone|toadking_mound|… previews another dungeon site (sim/sites.js; a parked one, the Mill or the Warren, too).
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
const sim = createSim(SEED, THEME, { scene: SCENE, region: STAGE ? (params.get('floor') || 'grass') : REGION, site: SITE });   // (the Stage's floor in region's place: outdoor.js)
if (DEV) globalThis.__sim = sim;   // dev inspection hook
// offline progress (ui/away.js; GDD §12): made before anything presentational listens, then the bus is sealed, so while
// the time away plays through (the bus quiet) only the sim's own listeners and its collector hear the hours of fighting
let autosave = null;
const away = createAway({ sim, hold: (on) => { if (autosave) { autosave.hold(on); if (!on) autosave.save(); } }, refresh: () => {
  renderer.refresh();
  sim.bus.emit('countersChanged', { ...sim.state.counters }); sim.bus.emit('partyChanged', sim.state.party);
  sim.bus.emit('boonsChanged', { ...(sim.state.boons || {}) }); sim.bus.emit('questTracked', { id: sim.state.tracked });
} });
sim.bus.seal();
if (DEV) globalThis.__away = away;
const input = createInput(canvas);
watchSafeArea();   // the notch's side on a phone held sideways (--safe-l / --safe-r)
const renderer = createRenderer(canvas, sim, input);
if (DEV) globalThis.__renderer = renderer;   // dev: hit-tests for captures and browser tests
// sound (docs/sound-plan.md): presentation only, listening to the sim and the renderer. Browsers let it start only after
// a gesture, so the first tap or key starts it; the player's settings (the menu's Sound) are kept per device.
const audio = createAudio();
createListener({ sim, audio, renderer });
for (const ev of ['pointerdown', 'keydown']) addEventListener(ev, () => audio.start(), { capture: true });
if (DEV) globalThis.__audio = audio;
if (STAGE) import('./dev/stage.js').then(async ({ createStage }) => { globalThis.__stage = await createStage({ renderer, sim, params }); });   // the lineup (docs/character-stage-proposal.md)
const hud = createHud(sim);
const partyPanel = createPartyPanel(sim);
const partyScreen = createPartyScreen({ sim, openSheet: (i) => gearSheet.open(i) });   // the three hero slots and the bench
const guildTerms = createGuildTerms({ sim });   // the Lantern Guild's terms for its sellswords (GDD §6.2): from the tavern and a Contract tab
const townMenu = createTownMenu(sim, partyPanel, { openParty: () => partyScreen.open(), openTerms: () => guildTerms.open(), openMap: () => worldMap.open('world') });   // subscribe before restore, so a loaded counters event repaints
const journal = createJournal({ sim, npcName: (id) => (cast[id] ? cast[id].name : id), toast: (m, ms, key) => hud.show(m, ms, key), partyPanel });   // quests (M4): the Journal, tracker and toasts
const worldMap = createWorldMap({ sim, toast: (m, ms) => hud.show(m, ms), inSquare: () => townMenu.inSquare(), questTitle: (id) => journal.title(id) });   // the World map and the Guild's coach (docs/worldmap-travel-proposal.md)
createStepOut({ sim, partyPanel });   // the way out of a fight (GDD §7.1)
createShrineCard({ sim });             // a shrine's blessing, offered: Use or Close (GDD §3.6)
createTowerCard({ sim });              // the Mere Tower's landings: Climb on or Home with Wenna (GDD §17)
createDefeat({ sim });                // a wipe: what happened, before you wake at the Shrine (ui/defeat.js)
createCompass(sim, { partyPanel, inSquare: () => townMenu.inSquare(), questTitle: (id) => journal.title(id) });   // compass travel (docs/compass-mockup.html)
const gearSheet = createGearSheet(sim, { partyPanel, openTerms: () => guildTerms.open() });   // tap a party card: gear, stats, the bag (docs/gear-mockup.html)
hud.onWage(() => { if (sim.world.kind !== 'town') return false; townMenu.openHire(); return true; });   // the wage line under the gold
if (DEV) globalThis.__gear = gearSheet;
// named NPCs (M4): their look, name and Ink file from content/npcs/; tap one to talk (dialogue.js)
const cast = {};
Promise.all(Object.keys(NPCS).map((id) => fetch(`./content/npcs/${id}.json`).then((r) => r.json()).then((d) => { cast[id] = d; }).catch(() => {})))
  .then(() => renderer.setCast(cast));
const dialogue = createDialogue({ sim, cast: () => cast, openService: (kind) => townMenu.open(kind), questTitle: (id) => journal.title(id) });

// Restore the slot's game (party, counters, the dungeon overlay, discovery). Must run before
// the first render so restored mods are reflected in chunk bakes.
if (saved) sim.restore(saved.data);
// Autosave only a game that has its hero: a slot stays empty until creation's Begin.
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
const title = createTitle({ sim, slot: SLOT, audio, setPaused: (on) => { paused = on; }, openSlots: () => slots.open(),
  openParty: () => partyScreen.open(), openCreate: () => cinema.intro(() => { paused = false; creation.open(); }),
  openChronicle: (mode) => cinema.intro(() => title.open(mode)), onPlay: () => { cinema.stopMusic(); catchUp(); },
  onOpen: () => { townMenu.close(); gearSheet.close(); partyScreen.close(); worldMap.close(); } });   // the menu comes up over a clear screen
if (BOOT) cinema.boot(renderer.ready, () => title.open('title'));
else document.getElementById('bootSplash')?.remove();
// offline progress (ui/away.js): a slot's game picks up the time since it was last saved, once play starts (the title
// can stand open as long as it likes: that isn't time away); and a tab that comes back after a minute or more
let awaySecs = saved && !PREVIEW ? Math.max(0, (Date.now() - (saved.savedAt || Date.now())) / 1000) : 0, hiddenAt = 0;
function catchUp(secs = awaySecs) { awaySecs = 0; if (secs >= AWAY_MIN && sim.state.created && !PREVIEW) away.run(secs); }
if (!BOOT) renderer.ready.then(() => catchUp());
if (DEV) globalThis.__ui = { title, creation, partyScreen, slots, cinema, dialogue, journal, worldMap };


// tap: a named person → talk; a service → its menu; an enemy → focus; anything else → walk there (and use a chest /
// shrine / stairs / growth when it's what you tapped)
input.onTap((sx, sy) => {
  if (STAGE) return;                                     // the Stage: nothing in the world to tap
  const npc = renderer.npcAt(sx, sy);                    // a named person: walk over and talk (the sim checks reach)
  if (npc) { sim.commands.push({ type: 'talk', npc: npc.id }); return; }
  const door = renderer.doorAt(sx, sy);                  // a way somewhere's sign (the Mere Tower's punt): walk to it, as its compass row does
  if (door) {
    const row = door.site && sim.destinations().find((d) => d.id === 'site:' + door.site && !d.off);
    if (row) sim.commands.push({ type: 'goto', tx: row.tx, ty: row.ty, near: 0, label: row.label, site: row.site, journey: row.journey || null });
    else { const t = renderer.screenToTile(sx, sy, 1); sim.commands.push({ type: 'tap', tx: t.tx, ty: t.ty }); }
    return;
  }
  const sv = renderer.serviceAt(sx, sy);                 // a service building: its menu once you're in the square,
  if (sv && townMenu.inSquare()) { townMenu.open(sv); return; }
  if (sv) { const h = sim.world.hub; sim.commands.push({ type: 'tap', tx: Math.floor(h.x), ty: Math.floor(h.y) }); return; }   // else walk to the square
  const foe = renderer.enemyAt(sx, sy);                  // tap an enemy: the party focuses it
  if (foe) { sim.commands.push({ type: 'focus', id: foe.id }); return; }
  const pr = renderer.propAt(sx, sy);                    // a chest / shrine / stairs, anywhere on it: walk over and use it
  if (pr) { sim.commands.push({ type: 'tap', tx: pr.tx, ty: pr.ty }); return; }
  const { tx, ty } = renderer.screenToTile(sx, sy, 1);
  sim.commands.push({ type: 'tap', tx, ty });
});

// ---- loop ----
let last = performance.now();
let acc = 0;
const MAX_FRAME = 0.25;           // clamp after tab-away
const TOD = DEV ? params.get('tod') : null;              // ?dev&tod=dawn|day|dusk|night|0..1: hold the light (look-dev; the sim's clock runs on)
if (DEV && params.get('weather')) holdWeather(params.get('weather'));   // ?dev&weather=rain|fog|snow|wind|clear[:0..1]|sunny|partly: hold the weather (and the HUD's icon) (render/weatherfx.js)
// dev slow motion (?dev&slow=8, or globalThis.__slow at runtime): the sim and the render
// clock run 8× slower — for inspecting animation and weapon effects frame by frame
if (DEV) globalThis.__slow = Math.max(1, +(new URLSearchParams(location.search).get('slow') || 1));
let vnow = performance.now(), slowed = false;

function frame(now) {
  // the next frame first: an error while drawing (a renderer bug) must not stop the loop — it
  // did once, and a missing class in a lookup froze the whole game at the first fight
  if (!MANUAL) requestAnimationFrame(frame);
  if (away.running) { last = now; return; }   // the time away is being played through (ui/away.js): no ticks, no drawing
  const SLOW = DEV ? Math.max(1, globalThis.__slow || 1) : 1;
  let dt = (now - last) / 1000 / SLOW;
  last = now;
  if (SLOW !== 1 || slowed) { vnow += Math.min(dt, MAX_FRAME) * 1000; now = vnow; slowed = true; } else vnow = now;
  if (dt > MAX_FRAME) dt = MAX_FRAME;
  acc += dt;

  while (acc >= TICK_DT) {
    if (paused || renderer.transiting) { acc -= TICK_DT; continue; }   // (a scene change baking: hold still, or a stick still held could walk you back out)
    const v = STAGE ? null : input.vec();
    if (v) {                                   // screen drag → iso world direction
      const w = screenDirToWorld(v.x, v.y);
      const len = Math.hypot(w.x, w.y) || 1;
      const mag = Math.min(1, Math.hypot(v.x, v.y));
      sim.commands.push({ type: 'move', x: (w.x / len) * mag, y: (w.y / len) * mag });
    }
    sim.tick();
    acc -= TICK_DT;
  }

  renderer.holdSky(title.isOpen ? 'dusk' : STAGE ? TOD || 'dusk' : TOD);              // the title is always at dusk; play follows the clock
  if (!cinema.playing) renderer.render(acc / TICK_DT, now);   // the intro covers the world: don't draw it underneath
}
// dev manual clock (?dev&manual): the page stops driving frames itself; a capture script calls
// globalThis.__frame(ms) at exact intervals, so motion traces don't depend on the machine's speed
const MANUAL = DEV && location.search.includes('manual');
if (MANUAL) { let mt = performance.now(); last = mt; globalThis.__frame = (ms = 1000 / 60) => { mt += ms; frame(mt); }; }
else requestAnimationFrame(frame);

// pause the clock when backgrounded (offline math covers gaps later)
document.addEventListener('visibilitychange', () => {
  if (document.hidden) { hiddenAt = Date.now(); return; }
  last = performance.now();
  if (hiddenAt && !paused && !away.running) catchUp((Date.now() - hiddenAt) / 1000);
  hiddenAt = 0;
});
