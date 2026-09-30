// Everything placed for you can be reached (M5, found by the loot farm, tools/balance/loot.mjs):
// - a chest or shrine never sits in a pocket of floor nothing walks to (world.js pruneUnreachable);
// - a wave's foes always spawn where the party can get at them (battle.js spot): one stood in a pool
//   for good once, and its wave never ended.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createSim } from '../src/sim/core.js';
import { isWalkable, heightAt } from '../src/sim/world.js';

const reachable = (w) => {
  const s = w.level.spawn, K = (x, y) => x + ',' + y, q = [[Math.floor(s.x), Math.floor(s.y)]], seen = new Set([K(q[0][0], q[0][1])]);
  for (let h = 0; h < q.length; h++) { const [x, y] = q[h], z = heightAt(w, x, y); for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const k = K(x + dx, y + dy); if (!seen.has(k) && isWalkable(w, x + dx + 0.5, y + dy + 0.5, z)) { seen.add(k); q.push([x + dx, y + dy]); } } }
  return seen;
};
test('every chest and shrine has a walkable tile beside it that the way in reaches (Barrows floor 2, seed 20260807, had one that didn\'t)', () => {
  for (const [seed, site] of [[20260807, 'barrows'], [777, 'barrows'], [4242, 'barrows'], [1, 'tithe_mill'], [2, 'wickham_keep'], [3, 'sunken_chapel']]) for (const depth of [0, 1, 2]) {
    const sim = createSim(seed, undefined, { scene: 'dungeon', site }); if (depth) sim.restore({ ...JSON.parse(JSON.stringify(sim.snapshot())), depth, floors: [] });
    const w = sim.world, seen = reachable(w);
    for (const [k, kind] of w.props) {
      if (kind !== 'chest' && kind !== 'shrine') continue;
      const [x, y] = k.split(',').map(Number); let ok = false;
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) if ((dx || dy) && seen.has(`${x + dx},${y + dy}`)) ok = true;
      assert.ok(ok, `${site} seed ${seed} floor ${depth + 1}: the ${kind} at ${k} can't be reached`);
    }
  }
});
test('a wave never spawns a foe on a tile the party can\'t stand on, even in a small room', () => {
  let rooms = 0;
  for (const seed of [20260807, 777, 4242, 11, 12, 13]) for (const depth of [0, 1, 2]) {
    const base = createSim(seed, undefined, { scene: 'dungeon' });
    if (depth) base.restore({ ...JSON.parse(JSON.stringify(base.snapshot())), depth, floors: [] });
    const L = base.world.level;
    for (const r of L.rooms) {
      if (r === L.entrance) continue;
      const sim = createSim(seed, undefined, { scene: 'dungeon' }); sim.restore({ ...JSON.parse(JSON.stringify(base.snapshot())), floors: [] });
      for (const m of sim.state.party) { m.level = 20; m.hp = 9999; }
      // stand at the room's corner tile nearest its middle: small rooms have no tile 9 away, the fallback case
      let best = null, bd = 1e9; for (const [k, c] of L.cells) { if (c.room !== r.id || c.kind !== 'floor') continue; const [x, y] = k.split(',').map(Number); const d = Math.hypot(x - r.cx, y - r.cy); if (d < bd && isWalkable(sim.world, x + 0.5, y + 0.5)) { bd = d; best = [x, y]; } }
      if (!best) continue;
      const p = sim.state.player; p.x = p.px = best[0] + 0.5; p.y = p.py = best[1] + 0.5;
      for (let i = 0; i < 20 * 3 && !(sim.world.enemies || []).length; i++) sim.tick();
      for (const e of sim.world.enemies) assert.ok(isWalkable(sim.world, e.x, e.y), `seed ${seed} floor ${depth + 1} room ${r.id}: a ${e.kind} spawned at ${e.x},${e.y}, off the floor`);
      rooms++;
    }
  }
  assert.ok(rooms > 60, `${rooms} rooms`);
});
