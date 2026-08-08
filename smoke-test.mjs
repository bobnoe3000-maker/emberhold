// Headless proof the sim core has zero DOM deps and is deterministic.
import { createSim, TICK_DT } from './src/sim/core.js';
import { resourceAt, tileType, isWalkable } from './src/sim/world.js';
import { mulberry32, streamSeed, STREAM } from './src/sim/rng.js';
import { rollRecipe } from './src/assetforge/doll.js';

const SEED = 20260807;
const sim = createSim(SEED);
const p = sim.state.player;
console.log('spawn:', p.x.toFixed(2), p.y.toFixed(2), 'walkable:', isWalkable(sim.world, p.x, p.y));

// walk east for 100 ticks (5 seconds sim time)
const x0 = p.x, y0 = p.y;
for (let i = 0; i < 100; i++) { sim.commands.push({ type: 'move', x: 1, y: 0 }); sim.tick(); }
console.log('after 5s east: dx =', (p.x - x0).toFixed(2), 'dy =', (p.y - y0).toFixed(2), 'dir:', p.dir, 'mirror:', p.mirror);

// find a resource near the player and chop it down
let found = null;
outer: for (let r = 0; r < 40 && !found; r++)
  for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) {
    const tx = Math.floor(p.x) + dx, ty = Math.floor(p.y) + dy;
    if (resourceAt(sim.world, tx, ty)) { found = { tx, ty, kind: resourceAt(sim.world, tx, ty) }; break outer; }
  }
console.log('nearest resource:', found);
// teleport adjacent (test-only) and hit it 3x
p.x = found.tx + 1.5; p.y = found.ty + 0.5;
let events = [];
sim.bus.on('harvested', (e) => events.push(e));
for (let i = 0; i < 3; i++) { sim.commands.push({ type: 'harvest', tx: found.tx, ty: found.ty }); sim.tick(); }
console.log('harvest events:', events, 'counters:', sim.state.counters);
console.log('resource gone:', resourceAt(sim.world, found.tx, found.ty) === null);

// determinism: fresh sim, same seed, same script → identical state
const sim2 = createSim(SEED);
for (let i = 0; i < 100; i++) { sim2.commands.push({ type: 'move', x: 1, y: 0 }); sim2.tick(); }
const match = Math.abs(sim2.state.player.x - x0 - (p.x - (found.tx + 1.5)) ) >= 0; // positions diverged by teleport; compare pre-teleport paths instead
const sim3 = createSim(SEED);
for (let i = 0; i < 100; i++) { sim3.commands.push({ type: 'move', x: 1, y: 0 }); sim3.tick(); }
console.log('determinism (two runs, same path):', sim2.state.player.x === sim3.state.player.x && sim2.state.player.y === sim3.state.player.y);

// hero recipe is stable across boots
const r1 = rollRecipe(mulberry32(streamSeed(SEED, STREAM.RECIPE)));
const r2 = rollRecipe(mulberry32(streamSeed(SEED, STREAM.RECIPE)));
console.log('hero recipe stable:', JSON.stringify(r1) === JSON.stringify(r2));
console.log('hero:', JSON.stringify(r1));

// save/load round-trip: snapshot → fresh sim → restore → identical player, counters, cleared resource
const snap = sim.snapshot();
const reloaded = createSim(SEED);
reloaded.restore(snap);
const rp = reloaded.state.player;
const posMatch = rp.x === p.x && rp.y === p.y && rp.dir === p.dir && rp.mirror === p.mirror;
const countMatch = reloaded.state.counters.wood === sim.state.counters.wood
  && reloaded.state.counters.stone === sim.state.counters.stone;
console.log('save round-trip (player + counters):', posMatch && countMatch);
console.log('save round-trip (harvested stays gone):', resourceAt(reloaded.world, found.tx, found.ty) === null);

// partial-harvest HP survives a save: hit a fresh resource once, snapshot, restore, finish it off
let res2 = null;
outer2: for (let r = 1; r < 60 && !res2; r++)
  for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) {
    const tx = Math.floor(p.x) + dx, ty = Math.floor(p.y) + dy;
    if ((tx !== found.tx || ty !== found.ty) && resourceAt(sim.world, tx, ty)) { res2 = { tx, ty }; break outer2; }
  }
p.x = res2.tx + 1.5; p.y = res2.ty + 0.5;
sim.commands.push({ type: 'harvest', tx: res2.tx, ty: res2.ty }); sim.tick();   // 1 of 3 hits landed
const cont = createSim(SEED);
cont.restore(sim.snapshot());
cont.state.player.x = res2.tx + 1.5; cont.state.player.y = res2.ty + 0.5;
let destroyed = false;
cont.bus.on('harvested', () => { destroyed = true; });
for (let i = 0; i < 2; i++) { cont.commands.push({ type: 'harvest', tx: res2.tx, ty: res2.ty }); cont.tick(); }
console.log('save round-trip (partial harvest resumes: 2 more hits finish it):', destroyed);

// tile sanity: sample 2000 tiles, count types
let counts = [0, 0, 0];
for (let i = 0; i < 2000; i++) counts[tileType(sim.world, (i * 7919) % 500 - 250, (i * 104729) % 500 - 250)]++;
console.log('tile mix (water/dirt/grass):', counts);

// iso geometry: project → unproject round-trips exactly for all heights
import { project, unproject, screenDirToWorld, resolveTap } from './src/render/iso.js';
let isoOk = true;
for (let h = 0; h <= 2; h++) for (let x = -20; x <= 20; x += 3) for (let y = -20; y <= 20; y += 3) {
  const s = project(x, y, h), w = unproject(s.sx, s.sy, h);
  if (Math.abs(w.x - x) > 1e-9 || Math.abs(w.y - y) > 1e-9) isoOk = false;
}
console.log('iso project/unproject round-trip:', isoOk);
// a screen point at a tile's center floors back to that tile
let tileOk = true;
for (const [tx, ty] of [[3, 7], [-4, 2], [12, 18]]) {
  const c = project(tx + 0.5, ty + 0.5, 0), w = unproject(c.sx, c.sy, 0);
  if (Math.floor(w.x) !== tx || Math.floor(w.y) !== ty) tileOk = false;
}
console.log('iso tap-to-tile (center floors correctly):', tileOk);
// drag down-right → move toward +x/+y (front); drag up → -x/-y
const dr = screenDirToWorld(2, 2), up = screenDirToWorld(0, -2);
console.log('iso drag mapping (down-right → +x+y, up → −x−y):',
  dr.x > 0 && dr.y > 0 && up.x < 0 && up.y < 0);
// fat-finger snap: a tap just off a resource tile snaps onto it
const snapAt = project(5.9, 5.1, 0);   // near tile (5,5) but nudged
const snapped = resolveTap(snapAt.sx, snapAt.sy, { heightAt: () => 0, hasResource: (x, y) => x === 5 && y === 5 });
console.log('iso fat-finger snap:', snapped.tx === 5 && snapped.ty === 5);
