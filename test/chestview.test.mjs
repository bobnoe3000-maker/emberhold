// A chest is seen whole (the owner, 2026-11-11: "Chests should always be visible to the player not tucked against a
// southern wall so you can barely see the top"; level-design-rules.md §4.4): on every site's floors, every chest has open
// floor on its near side (+x, +y: toward the camera), two tiles out. Before, 86 of 195 had a wall there.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createSim } from '../src/sim/core.js';
import { SITES } from '../src/sim/sites.js';
import { nearClear } from '../src/sim/world.js';

test('every chest on every floor of every site has its near side open, and stands where the party can reach it', () => {
  let n = 0; const bad = [];
  for (const site of Object.keys(SITES)) for (const seed of [1, 20260807]) {
    const sim = createSim(seed, undefined, { scene: 'dungeon', site });
    for (let d = 0; d < 3; d++) {
      if (d) { sim.restore({ ...JSON.parse(JSON.stringify(sim.snapshot())), depth: d, floors: [] }); if (sim.state.depth !== d) break; }
      const w = sim.world;
      for (const [k, kind] of w.props) if (kind === 'chest') { n++; const [x, y] = k.split(',').map(Number); if (!nearClear(w.level, x, y)) bad.push(`${site} f${d + 1} seed ${seed} at ${k}`); }
    }
  }
  assert.ok(n > 50, `chests met: ${n}`);
  assert.deepEqual(bad, [], 'a chest behind a near wall');
});
