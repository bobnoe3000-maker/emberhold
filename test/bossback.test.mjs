// A boss away (GDD v1.73, v1.117; the owner: "Boss rooms.. after the boss is defeated.. regular npcs can still spawn. Show
// the timer for when the boss will reappear", and 2026-11-15: "Every Boss room, when boss is defeated regular NPCs should
// still spawn, and show the timer for when the boss will respawn - add test case too"): a boss put down is gone BOSS_BACK
// seconds of game time; his room fights on meanwhile with the floor's own foes, in the same visit and every visit after,
// with his timer; his time up, he holds it again, mid-visit too. A story boss (Captain Garrow) comes back as well, his first
// fall the story's; while one he held waits in his hall to be spoken to, the hall is quiet.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createSim as createSim0 } from '../src/sim/core.js';
import { isWalkable } from '../src/sim/world.js';
import { statsFor } from '../src/sim/party.js';
import { BOSS_BACK, bossAway, roomBossAway } from '../src/sim/battle.js';
import { openAllGates } from './gates.mjs';

// the party at a level well over the hall's, kept standing, on the floor with the hall
function hall(site, depth) {
  const sim = openAllGates(createSim0(20260807, undefined, { scene: 'dungeon', site })); sim.tick();
  while (sim.state.depth < depth && sim.world.stairsAt) { const s = sim.world.stairsAt, p = sim.state.player; p.x = p.px = s.x + 0.5; p.y = p.py = s.y + 1.5; sim.commands.push({ type: 'harvest', tx: s.x, ty: s.y }); sim.tick(); openAllGates(sim); }
  const L = sim.world.level, r = L.descentRoom; let best = null, bd = 1e9;
  for (const [k, c] of L.cells) { if (c.kind !== 'floor' || c.room !== r.id) continue; const [x, y] = k.split(',').map(Number); const d = Math.hypot(x - r.cx, y - r.cy); if (d < bd && isWalkable(sim.world, x + 0.5, y + 0.5)) { bd = d; best = [x, y]; } }
  sim.state.party[0].level = 30;
  return { sim, inHall: best, out: [L.entrance.cx, L.entrance.cy] };
}
const put = (sim, [x, y]) => { const p = sim.state.player; p.x = p.px = Math.floor(x) + 0.5; p.y = p.py = Math.floor(y) + 0.5; };
const keep = (sim) => { const h = sim.state.party[0]; h.hp = statsFor(h).maxHp; h.down = false; };
const run = (sim, secs, until = () => false) => { for (let i = 0; i < secs * 20 && !until(); i++) { keep(sim); sim.tick(); } };

const foesUp = (sim) => (sim.world.enemies || []).filter((e) => !e.dead && e.hp > 0);
for (const [site, depth, story] of [['barrows', 2, false], ['wickham_keep', 1, true]]) {
  test(`${site}: the boss falls, his room fights on with the floor's own foes for ${BOSS_BACK / 60} min of game time, his timer showing, then he holds it again${story ? ' (a story boss too)' : ''}`, () => {
    const { sim, inHall, out } = hall(site, depth), downs = [], waves = [], bossWaves = [];
    sim.bus.on('bossDown', (e) => downs.push(e)); sim.bus.on('wave', (e) => { if (!e.cleared) waves.push(sim.state.t); }); sim.bus.on('bossWave', (e) => bossWaves.push(e.id));
    put(sim, inHall); run(sim, 240, () => downs.length > 0);
    assert.equal(downs.length, 1, 'he fell'); const id = downs[0].id, t0 = sim.state.t;
    assert.ok(Math.abs(sim.state.bossBack[id] - (t0 + BOSS_BACK)) < 0.1, 'away for BOSS_BACK');
    if (story) assert.equal(downs[0].first, true, 'the story\'s fall: the first');
    // (Garrow's hall: Brannoc, chained there, waits to be spoken to, and the hall is quiet for it, npcs.js placeFound; once
    // he's joined you he's gone from it, and the hall fights on as Barrows' does)
    if (story) {
      assert.ok(sim.world.npcs.some((q) => q.found), 'Brannoc waits in the hall'); const n = waves.length; run(sim, 20);
      assert.equal(waves.length, n, 'quiet while he waits'); sim.world.npcs = sim.world.npcs.filter((q) => !q.found);
      put(sim, out); run(sim, 3); put(sim, inHall);
    }
    // the same visit (or the next, for Garrow's): the floor's own foes come on in waves, no boss among them
    const n0 = waves.length; run(sim, 40, () => waves.length >= n0 + 2);
    assert.ok(waves.length >= n0 + 2, `waves go on after he falls: ${waves.length - n0} in 40 s`);
    assert.ok(sim.battle && sim.battle.room === sim.world.level.descentRoom.id && !sim.battle.boss, 'his room\'s fight, not his');
    assert.ok(!foesUp(sim).some((e) => e.boss), 'nobody of his kind standing');
    assert.equal(bossWaves.length, 1, 'only his first');
    // the timer for his room, in the fight
    const a = roomBossAway(sim.state, sim.world, sim.battle.room); assert.ok(a && a.id === id && a.left > BOSS_BACK - 120 && a.left <= BOSS_BACK, `the timer: ${a && a.left.toFixed(0)} s left`);
    assert.deepEqual(bossAway(sim.state, sim.world.site, sim.world.depth), a, 'the floor\'s hall: the same timer');
    // out to the floor's entrance and back in: the room fights again, the floor's own foes
    put(sim, out); run(sim, 3); assert.equal(sim.battle, null, 'out of it'); put(sim, inHall); const n1 = waves.length; run(sim, 10);
    assert.ok(sim.battle && !sim.battle.boss && waves.length > n1, 'a fight again, without him');
    // the save keeps his time away
    const snap = JSON.parse(JSON.stringify(sim.snapshot())); assert.ok(snap.bossBack[id] > sim.state.t, 'in the save');
    // the time passes (out of the hall); then back in: he's there again
    put(sim, out); run(sim, BOSS_BACK - (sim.state.t - t0) + 2);
    assert.equal(bossAway(sim.state, sim.world.site, sim.world.depth), null, 'back');
    put(sim, inHall); run(sim, 5);
    assert.ok(sim.battle && sim.battle.boss === id, 'his hall\'s fight is his again');
    run(sim, 240, () => downs.length > 1);
    if (story) assert.equal(downs[1].first, false, 'his second fall is not the story\'s');
  });
}

test('his time runs out while the company fights on in his room: his next wave is his', () => {
  const { sim, inHall } = hall('barrows', 2), downs = [], bossWaves = [], waves = [];
  sim.bus.on('bossDown', (e) => downs.push(e)); sim.bus.on('bossWave', (e) => bossWaves.push([e.id, sim.state.t])); sim.bus.on('wave', (e) => { if (!e.cleared) waves.push(sim.state.t); });
  put(sim, inHall); run(sim, 240, () => downs.length > 0); const id = downs[0].id;
  run(sim, 30, () => waves.length >= 3); assert.ok(sim.battle && !sim.battle.boss, 'the room fights on');
  sim.state.bossBack[id] = sim.state.t + 1;                                       // (his half hour nearly up)
  run(sim, 60, () => bossWaves.length > 1);
  assert.equal(bossWaves.length, 2, 'he came back into the fight'); assert.equal(bossWaves[1][0], id);
  assert.ok(foesUp(sim).some((e) => e.boss === id), 'standing in his room');
  assert.equal(roomBossAway(sim.state, sim.world, sim.battle.room), null, 'no timer while he holds it');
});

test('the save round-trip: the bosses away come back from a snapshot, and nonsense is dropped', () => {
  const { sim } = hall('barrows', 0), t = sim.state.t;
  sim.state.bossBack = { quartermaster: t + 600 };
  const snap = JSON.parse(JSON.stringify(sim.snapshot())); snap.bossBack.nobody = 5; snap.bossBack.rat_king = 'soon';
  const s2 = createSim0(20260807, undefined, { scene: 'dungeon', site: 'barrows' }); s2.restore(snap);
  assert.deepEqual(s2.state.bossBack, { quartermaster: t + 600 });
  delete snap.bossBack; s2.restore(snap); assert.deepEqual(s2.state.bossBack, {}, 'an older save: none away');
});
