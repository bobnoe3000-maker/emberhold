// Chest quests send you exploring: a quest that asks for chests counts them anywhere in its dungeon, on any floor (the
// owner, 2026-11-21: "adjust the quest completion text so that its open 2 chests on any level … to promote exploration").
// Before that, three asked for two on a first floor that held one ("The quest 'the lease' says open 2 chests on first
// floor but there is only one chest on the first floor"), and two counted only below the first floor.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createWorld } from '../src/sim/world.js';
import { createSim } from '../src/sim/core.js';
import { QUESTS } from '../src/sim/quests.js';
import { SITES } from '../src/sim/sites.js';

const chestQuests = () => Object.entries(QUESTS).flatMap(([id, q]) => q.steps.flatMap((st) => st.objectives.filter((o) => o.type === 'loot').map((o) => ({ id, o }))));

test('a chest quest names no floor, and its dungeon holds enough chests over its floors, on every seed', () => {
  const qs = chestQuests();
  assert.ok(qs.length >= 7, 'the chest quests were found');
  for (const { id, o } of qs) {
    assert.equal(o.floor, undefined, `${id}: chests on any floor`);
    for (const seed of [1, 2, 3, 20260807, 617082301]) {
      let n = 0;
      for (let d = 0; d < SITES[o.site].floors; d++) n += [...createWorld(seed, undefined, d, o.site).props.values()].filter((k) => k === 'chest').length;
      assert.ok(n >= o.count, `${id}: ${o.site} has ${n} chest(s) over its floors, the quest asks for ${o.count} (seed ${seed})`);
    }
  }
});

test('a chest opened on a floor the quest once named no longer matters: one on the first floor counts for Night Boats', () => {
  const s = createSim(20260807, undefined, { scene: 'dungeon', site: 'canal_locks' }); s.tick();
  s.quests.begin('wren_night_boats'); assert.equal(s.state.depth, 0, 'on the first floor');
  s.bus.emit('looted', { kind: 'chest' });   // (Night Boats asked for the second floor until 2026-11-21)
  assert.deepEqual(s.state.quests.wren_night_boats.n, [1], 'counted on the first floor');
});
