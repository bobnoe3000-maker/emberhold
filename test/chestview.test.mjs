// A chest is seen whole (the owner, 2026-11-11: "Chests should always be visible to the player not tucked against a
// southern wall so you can barely see the top"; level-design-rules.md §4.4): on every site's floors, every chest has open
// floor on its near side (+x, +y: toward the camera), two tiles out. Before, 86 of 195 had a wall there.
// And (the owner, 2026-11-12, of the Old Barrows' second floor's, out of sight behind a wall three tiles off, then behind
// the clerks' shelves): the band along the camera's line open SIGHT tiles out, walls and furniture both (world.js
// sightRun). Before, nearly every chest stood at exactly two; in the game four of thirteen were under half in view,
// after every one 67-100 % (tools/capture/visibility.mjs).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createSim } from '../src/sim/core.js';
import { SITES } from '../src/sim/sites.js';
import { nearClear, sightRun, SIGHT } from '../src/sim/world.js';

test('every chest on every floor of every site has its near side open and its line to the camera clear, and stands where the party can reach it', () => {
  let n = 0; const bad = [];
  for (const site of Object.keys(SITES)) for (const seed of [1, 20260807]) {
    const sim = createSim(seed, undefined, { scene: 'dungeon', site });
    for (let d = 0; d < 3; d++) {
      if (d) { sim.restore({ ...JSON.parse(JSON.stringify(sim.snapshot())), depth: d, floors: [] }); if (sim.state.depth !== d) break; }
      const w = sim.world;
      for (const [k, kind] of w.props) if (kind === 'chest') { n++; const [x, y] = k.split(',').map(Number); if (!nearClear(w.level, x, y) || sightRun(w, w.level, x, y) < SIGHT) bad.push(`${site} f${d + 1} seed ${seed} at ${k}: sight ${sightRun(w, w.level, x, y)}`); }
    }
  }
  assert.ok(n > 50, `chests met: ${n}`);
  assert.deepEqual(bad, [], 'a chest behind a near wall');
});
