// Headless proof the sim core has zero DOM deps and is deterministic, now over a
// generated dungeon level (rooms + corridors + walls + abyss).
import { createSim, TICK_DT } from './src/sim/core.js';
import { resourceAt, materialAt, heightAt, isWalkable } from './src/sim/world.js';
import { THEME_KEYS } from './src/sim/level.js';
import { mulberry32, streamSeed, STREAM } from './src/sim/rng.js';
import { rollRecipe } from './src/assetforge/doll.js';

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

const ok = found && res2 && destroyed && relocated && detOk && themesOk && isoOk && zmax - zmin >= 5 && Object.keys(mix).length >= 3;
console.log(ok ? 'SMOKE_OK' : 'SMOKE_FAIL');
if (!ok) process.exit(1);
