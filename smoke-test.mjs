// Headless proof the sim core has zero DOM deps and is deterministic, now over a
// generated dungeon level (rooms + corridors + walls + abyss).
import { createSim, TICK_DT } from './src/sim/core.js';
import { resourceAt, materialAt, heightAt, isWalkable, propAt } from './src/sim/world.js';
import { THEME_KEYS } from './src/sim/level.js';
import { mulberry32, streamSeed, STREAM } from './src/sim/rng.js';
import { rollRecipe } from './src/assetforge/doll.js';
import { statsFor } from './src/sim/party.js';
import { autoAllocate } from './src/sim/attributes.js';
import { makeItem, SLOTS } from './src/sim/items.js';
import { startSession, verifySession, stateHash } from './src/sim/replay.js';

const SEED = 20260807;
const sim = createSim(SEED);
const p = sim.state.player;
console.log('theme:', sim.world.theme, '| rooms:', sim.world.level.rooms.length);
console.log('spawn:', p.x.toFixed(2), p.y.toFixed(2), 'walkable:', isWalkable(sim.world, p.x, p.y));

// walk east for 100 ticks (5 seconds sim time) — the wall/abyss collision holds
const x0 = p.x, y0 = p.y;
for (let i = 0; i < 100; i++) { sim.commands.push({ type: 'move', x: 1, y: 0 }); sim.tick(); }
console.log('after 5s east: dx =', (p.x - x0).toFixed(2), 'dy =', (p.y - y0).toFixed(2), '| still walkable:', isWalkable(sim.world, p.x, p.y));

// find any harvestable in the level and chop it down
let found = null;
for (const k of sim.world.level.cells.keys()) {
  const [tx, ty] = k.split(',').map(Number);
  const kind = resourceAt(sim.world, tx, ty);
  if (kind) { found = { tx, ty, kind }; break; }
}
console.log('a resource:', found);
p.x = found.tx + 1.5; p.y = found.ty + 0.5;
const events = [];
sim.bus.on('harvested', (e) => events.push(e));
for (let i = 0; i < 3; i++) { sim.commands.push({ type: 'harvest', tx: found.tx, ty: found.ty }); sim.tick(); }
console.log('harvest events:', events, 'counters:', sim.state.counters);
console.log('resource gone:', resourceAt(sim.world, found.tx, found.ty) === null);

// determinism: fresh sim, same seed, same script → identical state
const sim2 = createSim(SEED); for (let i = 0; i < 100; i++) { sim2.commands.push({ type: 'move', x: 1, y: 0 }); sim2.tick(); }
const sim3 = createSim(SEED); for (let i = 0; i < 100; i++) { sim3.commands.push({ type: 'move', x: 1, y: 0 }); sim3.tick(); }
console.log('determinism (two runs, same path):', sim2.state.player.x === sim3.state.player.x && sim2.state.player.y === sim3.state.player.y);

// hero recipe stable across boots
const r1 = rollRecipe(mulberry32(streamSeed(SEED, STREAM.RECIPE)));
const r2 = rollRecipe(mulberry32(streamSeed(SEED, STREAM.RECIPE)));
console.log('hero recipe stable:', JSON.stringify(r1) === JSON.stringify(r2));

// save/load round-trip — park the hero on solid floor first (restore relocates
// an off-floor position, which is the whole point of the v2 change)
for (const k of sim.world.level.cells.keys()) { const [tx, ty] = k.split(',').map(Number); if (isWalkable(sim.world, tx + 0.5, ty + 0.5)) { p.x = p.px = tx + 0.5; p.y = p.py = ty + 0.5; break; } }
const snap = sim.snapshot();
const reloaded = createSim(SEED); reloaded.restore(snap);
const rp = reloaded.state.player;
console.log('save round-trip (player + counters):', rp.x === p.x && rp.y === p.y && rp.dir === p.dir && rp.mirror === p.mirror
  && reloaded.state.counters.wood === sim.state.counters.wood && reloaded.state.counters.stone === sim.state.counters.stone);
console.log('save round-trip (harvested stays gone):', resourceAt(reloaded.world, found.tx, found.ty) === null);

// partial-harvest HP survives a save
let res2 = null;
for (const k of sim.world.level.cells.keys()) {
  const [tx, ty] = k.split(',').map(Number);
  if ((tx !== found.tx || ty !== found.ty) && resourceAt(sim.world, tx, ty)) { res2 = { tx, ty }; break; }
}
p.x = res2.tx + 1.5; p.y = res2.ty + 0.5;
sim.commands.push({ type: 'harvest', tx: res2.tx, ty: res2.ty }); sim.tick();   // 1 of 3
const cont = createSim(SEED); cont.restore(sim.snapshot());
cont.state.player.x = res2.tx + 1.5; cont.state.player.y = res2.ty + 0.5;
let destroyed = false; cont.bus.on('harvested', () => { destroyed = true; });
for (let i = 0; i < 2; i++) { cont.commands.push({ type: 'harvest', tx: res2.tx, ty: res2.ty }); cont.tick(); }
console.log('save round-trip (partial harvest resumes):', destroyed);

// a stale save whose position is now void (worldgen changed) relocates to spawn
const stale = createSim(SEED);
stale.restore({ ...sim.snapshot(), player: { x: 0.5, y: 0.5, dir: 'down', mirror: false } });
const relocated = isWalkable(stale.world, stale.state.player.x, stale.state.player.y);
console.log('stale off-floor save relocates to walkable ground:', relocated);

// descent: tapping the stairs regenerates the level one deeper + relocates the hero
const dsim = createSim(SEED);
const droom = dsim.world.level.descentRoom, theme0 = dsim.world.theme;
dsim.state.player.x = droom.cx + 1.2; dsim.state.player.y = droom.cy + 0.5;
dsim.commands.push({ type: 'harvest', tx: droom.cx, ty: droom.cy }); dsim.tick();
const descended = dsim.state.depth === 1 && dsim.world.depth === 1 && dsim.world.level.rooms.length >= 3
  && isWalkable(dsim.world, dsim.state.player.x, dsim.state.player.y);
console.log('descend deepens the level:', descended, '|', theme0, '→', dsim.world.theme);

// loot: tapping a chest grants resources and consumes it
const csim = createSim(SEED);
let chest = null;
for (const [k, v] of csim.world.props) if (v === 'chest') { const [x, y] = k.split(',').map(Number); chest = { x, y }; break; }
let looted = true;
if (chest) {
  csim.state.player.x = chest.x + 1.2; csim.state.player.y = chest.y + 0.5;
  const w0 = csim.state.counters.wood;
  csim.commands.push({ type: 'harvest', tx: chest.x, ty: chest.y }); csim.tick();
  looted = csim.state.counters.wood > w0 && propAt(csim.world, chest.x, chest.y) === null;
}
console.log('chest loots + consumes:', chest ? looted : 'no chest (ok)');

// discovery: rooms reveal as the hero moves, and it survives a save round-trip
const discOK = sim.world.discovered.size >= 1;
const rdisc = createSim(SEED); rdisc.restore(sim.snapshot());
const discPersist = rdisc.world.discovered.size === sim.world.discovered.size;
console.log('discovery tracked + persisted:', discOK, discPersist);

// level terrain: floor/wall/abyss all present, elevation spans, deterministic
const { W, H } = sim.world.level, mix = {};
let zmin = 9, zmax = -1;
for (let y = 0; y < H; y += 2) for (let x = 0; x < W; x += 2) {
  const m = materialAt(sim.world, x, y), z = heightAt(sim.world, x, y);
  mix[m] = (mix[m] || 0) + 1; if (z < zmin) zmin = z; if (z > zmax) zmax = z;
}
console.log('material mix:', mix);
console.log('elevation range z:', zmin, '..', zmax);
const w2 = createSim(SEED).world;
let detOk = true;
for (const [x, y] of [[10, 10], [40, 40], [55, 30], [70, 62]]) if (heightAt(w2, x, y) !== heightAt(sim.world, x, y) || materialAt(w2, x, y) !== materialAt(sim.world, x, y)) detOk = false;
console.log('terrain determinism (height + material):', detOk);

// every theme generates a connected, spawn-walkable level
let themesOk = true;
for (const t of THEME_KEYS) { const s = createSim(SEED, t); if (!isWalkable(s.world, s.state.player.x, s.state.player.y) || s.world.level.rooms.length < 3) { themesOk = false; console.log('  BAD theme', t); } }
console.log('all themes spawn-walkable + roomed:', themesOk);

// iso geometry: project → unproject round-trips exactly for all heights
import { project, unproject, screenDirToWorld, resolveTap } from './src/render/iso.js';
let isoOk = true;
for (let h = 0; h <= 2; h++) for (let x = -20; x <= 20; x += 3) for (let y = -20; y <= 20; y += 3) {
  const s = project(x, y, h), w = unproject(s.sx, s.sy, h);
  if (Math.abs(w.x - x) > 1e-9 || Math.abs(w.y - y) > 1e-9) isoOk = false;
}
console.log('iso project/unproject round-trip:', isoOk);
const dr = screenDirToWorld(2, 2), up = screenDirToWorld(0, -2);
console.log('iso drag mapping:', dr.x > 0 && dr.y > 0 && up.x < 0 && up.y < 0);
const snapAt = project(5.9, 5.1, 0);
const snapped = resolveTap(snapAt.sx, snapAt.sy, { heightAt: () => 0, hasResource: (x, y) => x === 5 && y === 5 });
console.log('iso fat-finger snap:', snapped.tx === 5 && snapped.ty === 5);

// Room battle: a solo L1 fighter left alone in a level-1 room holds it (GDD §15 M1 exit test),
// and rooms deepen: levels rise with walking distance from the entrance and per floor.
function soloHold(seed, secs) {
  const sim = createSim(seed, undefined, { scene: 'dungeon' });
  const L = sim.world.level, r = L.rooms.find((q) => sim.world.roomLevels.get(q.id) === 1), p = sim.state.player;
  let best = null, bd = 1e9;
  for (const [k, c] of L.cells) { if (c.kind !== 'floor' || c.room !== r.id) continue; const [x, y] = k.split(',').map(Number); const d = Math.hypot(x - r.cx, y - r.cy); if (d < bd && isWalkable(sim.world, x + 0.5, y + 0.5)) { bd = d; best = [x, y]; } }
  p.x = p.px = best[0] + 0.5; p.y = p.py = best[1] + 0.5;
  let waves = 0, defeated = false;
  sim.bus.on('wave', (d) => { if (d.cleared) waves++; }); sim.bus.on('defeat', () => (defeated = true));
  for (let t = 0; t < secs / TICK_DT && !defeated; t++) sim.tick();
  return { held: !defeated, waves, level: sim.state.party[0].level };
}
const holds = [20260807, 777].map((sd) => soloHold(sd, 600));
const holdOk = holds.every((h) => h.held && h.waves >= 25);
const rl = createSim(20260807, undefined, { scene: 'dungeon' }).world, rlv = [...rl.roomLevels.values()];
const roomLvOk = rl.roomLevels.get(rl.level.entrance.id) === 0 && Math.min(...rlv.filter(Boolean)) === 1 && rl.roomLevels.get(rl.level.descentRoom.id) === Math.max(...rlv);
console.log('room levels (entrance safe, 1 → deepest at the descent):', roomLvOk, rlv.join(','));
console.log('solo fighter holds a room 10 min:', holdOk, holds.map((h) => `${h.waves} waves L${h.level}`).join(', '));

// M3 (death and resurrection): a same-level room visit (~5 waves) with a party of three never
// leaves anyone Fallen (development plan §2.10 exit test), on the recommended builds
function partyVisit(seed, lv, hires) {
  const t = createSim(seed, undefined, { scene: 'town' }); for (const i of hires) { t.commands.push({ type: 'hire', idx: i }); t.tick(); }
  const sim = createSim(seed, undefined, { scene: 'dungeon' }); sim.state.party.push(...t.state.party.slice(1).map((m) => ({ ...m })));
  for (const m of sim.state.party) { m.level = lv; m.attrs = null; autoAllocate(m); m.hp = statsFor(m).maxHp; m.mp = undefined; }
  const L = sim.world.level, r = L.rooms.find((q) => q !== L.entrance), p = sim.state.player; sim.world.roomLevels.set(r.id, lv);
  let best = null, bd = 1e9;
  for (const [k, c] of L.cells) { if (c.kind !== 'floor' || c.room !== r.id) continue; const [x, y] = k.split(',').map(Number); const d = Math.hypot(x - r.cx, y - r.cy); if (d < bd && isWalkable(sim.world, x + 0.5, y + 0.5)) { bd = d; best = [x, y]; } }
  p.x = p.px = best[0] + 0.5; p.y = p.py = best[1] + 0.5;
  let fallen = 0, defeated = false; sim.bus.on('fallen', () => fallen++); sim.bus.on('defeat', () => (defeated = true));
  for (let i = 0; i < 20 * 100 && !defeated; i++) sim.tick();
  return fallen || defeated ? 1 : 0;
}
const visits = [];
for (const sd of [20260807, 777, 4242]) for (const lv of [3, 6, 9]) for (const h of [[0, 2], [1, 2]]) visits.push(partyVisit(sd, lv, h));
const visitsOk = visits.every((v) => v === 0);
console.log('same-level party visits leave nobody Fallen:', visitsOk, `${visits.length - visits.reduce((a, b) => a + b, 0)}/${visits.length}`);

// Tap to move: tap a far room → the hero paths there; tap a distant chest → walks up and loots it.
const tw = createSim(20260807, undefined, { scene: 'dungeon' }), twp = tw.state.player;
const twRoom = tw.world.level.rooms.find((q) => tw.world.roomLevels.get(q.id) === 1);
tw.commands.push({ type: 'tap', tx: twRoom.cx, ty: twRoom.cy });
for (let t = 0; t < 20 * 30 && (t === 0 || twp.path); t++) tw.tick();
const walked = !twp.path && Math.hypot(twp.x - twRoom.cx - 0.5, twp.y - twRoom.cy - 0.5) < 0.6;
let twChest = null; for (const [k, v] of tw.world.props) if (v === 'chest') { twChest = k.split(',').map(Number); break; }
let twLoot = false; tw.bus.on('looted', () => (twLoot = true));
tw.commands.push({ type: 'tap', tx: twChest[0], ty: twChest[1] });
for (let t = 0; t < 20 * 60 && !twLoot; t++) tw.tick();
const tapOk = walked && twLoot;
console.log('tap to move (walk a path; walk up to a chest and loot it):', walked, twLoot);

// Compass travel: context-sensitive destinations, and a pick auto-walks the party there.
const cDun = createSim(20260807, undefined, { scene: 'dungeon' }); cDun.tick();
const dd = cDun.destinations(), ids = dd.map((o) => o.id);
const nextRoom = dd.find((o) => o.id === 'next-room');
cDun.commands.push({ type: 'goto', ...nextRoom });
let reachedRoom = false; for (let t = 0; t < 20 * 40 && !reachedRoom; t++) { cDun.tick(); reachedRoom = !!cDun.battle || !cDun.state.player.path; }
const cOv = createSim(20260807, undefined, { scene: 'overland' }); cOv.tick();
const od = cOv.destinations().map((o) => o.id);
const compassOk = ids.includes('next-room') && ids.includes('exit') && ids.includes('stairs-down') && reachedRoom && od.includes('town') && od.includes('dungeon');
console.log('compass destinations + auto-walk:', compassOk, ids.join(','), '|', od.join(','));

// Gear and loot (GDD §8): six slots with class kits, seeded drops, equip rules, stats, saves.
const gs = createSim(SEED); gs.tick();
const gh = gs.state.party[0], kitOk = SLOTS.filter((sl) => gh.gear[sl]).length === 5 && statsFor(gh).maxHp === 140 && statsFor(gh).def === 15.4;   // 14 + the fighter's shield (+10 %)
// drops are seeded by the world and a running counter: the same chest sequence twice gives the same items
const dropRun = () => { const s = createSim(SEED); s.tick(); const got = []; s.bus.on('loot', (l) => got.push(`${l.item.name}/${l.item.r}/${l.item.ilv}`));
  for (const [k, v] of s.world.props) if (v === 'chest') { const [tx, ty] = k.split(',').map(Number); s.state.player.x = tx + 0.5; s.state.player.y = ty + 1.5; s.commands.push({ type: 'harvest', tx, ty }); s.tick(); }
  return { s, got }; };
const d1 = dropRun(), d2 = dropRun(), dropsOk = d1.got.length > 0 && d1.got.join('|') === d2.got.join('|');
// equip rules: a greatsword frees the off-hand; a shield then refuses; a mage wand is refused on the fighter
const gb = d1.s, fh = gb.state.party[0], bag0 = gb.state.bag.length; let refused = 0; gb.bus.on('gearRefused', () => refused++);
gb.state.bag.push(makeItem('greatsword', 3, 'fine', { uid: 't1', aff: [['crit', 3]] }), makeItem('kite', 3, 'common', { uid: 't2' }), makeItem('wand', 3, 'common', { uid: 't3' }));
const atk0 = statsFor(fh).atk;
gb.commands.push({ type: 'equip', member: fh.id, uid: 't1' }); gb.tick();
const twoH = fh.gear.weapon.uid === 't1' && !fh.gear.off && statsFor(fh).atk > atk0 && gb.state.bag.some((it) => it.base === 'roundshield');
gb.commands.push({ type: 'equip', member: fh.id, uid: 't2' }); gb.commands.push({ type: 'equip', member: fh.id, uid: 't3' }); gb.tick();
gb.commands.push({ type: 'unequip', member: fh.id, slot: 'helm' }); gb.tick();
const emb0 = gb.state.counters.embers; gb.commands.push({ type: 'salvage', uid: 't3' }); gb.tick();
const rulesOk = twoH && refused === 2 && !fh.gear.helm && gb.state.counters.embers > emb0 && !gb.state.bag.some((it) => it.uid === 't3');
// save / load keeps worn gear, the bag and Embers
const gSnap = JSON.parse(JSON.stringify(gb.snapshot())), gr = createSim(SEED); gr.restore(gSnap);
const saveOk = gr.state.party[0].gear.weapon.uid === 't1' && gr.state.bag.length === gb.state.bag.length && gr.state.counters.embers === gb.state.counters.embers;
const gearOk = kitOk && dropsOk && rulesOk && saveOk;
console.log('gear + loot (kit, seeded drops, 2H/class rules, salvage, save):', gearOk, kitOk, dropsOk, rulesOk, saveOk, `| ${d1.got.length} chest drops, e.g. ${d1.got.slice(0, 3).join(', ')}`);

// Verified progression (anti-cheat, development plan §2.13): a recorded session replays headless
// to the identical state; edited memory, spawned items, edited saves and sped-up clocks are rejected.
const vs = createSim(SEED, undefined, { scene: 'dungeon' });
{ const L = vs.world.level, r = L.rooms.find((q) => vs.world.roomLevels.get(q.id) === 1), c = [...L.cells].find(([k, v]) => v.kind === 'floor' && v.room === r.id && isWalkable(vs.world, +k.split(',')[0] + 0.5, +k.split(',')[1] + 0.5));
  const [x, y] = c[0].split(',').map(Number); vs.state.player.x = vs.state.player.px = x + 0.5; vs.state.player.y = vs.state.player.py = y + 0.5; }
const vses = startSession(vs, { scene: 'dungeon' }), verifiedStart = vses.startHash;
for (let t = 0; t < 20 * 150; t++) { if (t % 400 === 100) vs.commands.push({ type: 'move', x: 0.7, y: -0.4 }); vs.tick(); }
const vclaim = vses.claim(), vh = vs.state.party[0];
const honest = verifySession(vclaim, { verified: verifiedStart, elapsedMs: vclaim.ticks * 50 });
const tamper = (edit) => { const t = createSim(SEED, undefined, { scene: 'dungeon' }), ss = startSession(t, { scene: 'dungeon' }); for (let i = 0; i < 300; i++) { if (i === 150) edit(t); t.tick(); } return verifySession(ss.claim(), { verified: ss.startHash, elapsedMs: 1e9 }); };
const tLevel = tamper((t) => { t.state.party[0].level = 30; t.state.party[0].xp = 99999; });
const tItem = tamper((t) => t.state.bag.push(makeItem('greatsword', 30, 'rare', { uid: 'forged' })));
const tGold = tamper((t) => { t.state.counters.gold += 5000; });
const es = createSim(SEED, undefined, { scene: 'dungeon' }), esHash = stateHash(es.snapshot()), bad = es.snapshot(); bad.party[0].level = 25; es.restore(bad);
const tSave = verifySession(startSession(es).claim(), { verified: esHash, elapsedMs: 1e9 });
const tSpeed = verifySession(vclaim, { verified: verifiedStart, elapsedMs: vclaim.ticks * 5 });
const cheatOk = honest.ok && !tLevel.ok && !tItem.ok && !tGold.ok && !tSave.ok && !tSpeed.ok;
console.log('verified progression (honest replays; level / item / gold / save / speed tampering rejected):', cheatOk, honest.ok, tLevel.ok, tItem.ok, tGold.ok, tSave.ok, tSpeed.ok,
  `| ${vclaim.ticks} ticks, L${vh.level} ${vh.xp}xp ${vs.state.counters.gold}g, hash ${honest.hash}`);

const ok = visitsOk && cheatOk && gearOk && compassOk && tapOk && holdOk && roomLvOk && found && res2 && destroyed && relocated && descended && looted && discOK && discPersist
  && detOk && themesOk && isoOk && zmax - zmin >= 5 && Object.keys(mix).length >= 3;
console.log(ok ? 'SMOKE_OK' : 'SMOKE_FAIL');
if (!ok) process.exit(1);
