// Every quest that asks for chests opened on a floor finds that many there (the owner, 2026-11-21: "The quest 'the lease'
// says open 2 chests on first floor but there is only one chest on the first floor. Make sure there are 2"). The Lease,
// The Pattern Store and The Last Wages each asked for two on a first floor that held one; their rooms keep two now
// (plans.js: the counting house's chest, the pattern store's and the pay office's pair).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createWorld } from '../src/sim/world.js';
import { QUESTS } from '../src/sim/quests.js';

test('a quest that asks for N chests on a floor finds at least N there, on every seed', () => {
  let n = 0;
  for (const [id, q] of Object.entries(QUESTS)) for (const st of q.steps) for (const o of st.objectives) {
    if (o.type !== 'loot') continue;
    n++;
    const depth = (o.floor || 1) - 1;
    for (const seed of [1, 2, 3, 20260807, 617082301]) {
      const w = createWorld(seed, undefined, depth, o.site), chests = [...w.props.values()].filter((k) => k === 'chest').length;
      assert.ok(chests >= o.count, `${id}: ${o.site} floor ${depth + 1} has ${chests} chest(s), the quest asks for ${o.count} (seed ${seed})`);
    }
  }
  assert.ok(n >= 7, 'the chest quests were found');
});
