// Level design rules written down but untested until now (docs/level-design-rules.md §7): a bridge's ends are clear,
// and a town's square is open round its well. Where the code and the doc differed, the code won (§6): the square keeps
// its table, its bucket and its people; what may not stand there is a house or a tree.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createSim } from '../src/sim/core.js';
import { isWalkable } from '../src/sim/world.js';
import { ENV_FOOT } from '../src/sim/envfoot.js';

const SEED = 20260807;
for (const region of ['vale', 'fens', 'reach', 'heights']) {
  test(`${region}: each bridge's ends open, 3 tiles across and 2 deep past its deck`, () => {
    const w = createSim(SEED, undefined, { scene: 'overland', region }).world, bridges = w.structs.filter((s) => /^bridge_/.test(s.id));
    assert.ok(bridges.length >= 1);
    for (const b of bridges) {
      const ax = b.id === 'bridge_90', half = ax ? ENV_FOOT[b.id][2] : ENV_FOOT[b.id][3];
      for (const sd of [-1, 1]) for (let d = half + 0.8; d <= half + 2.8; d++) for (let o = -1.5; o <= 1.5; o++) {
        const x = ax ? b.x + sd * d : b.x + o, y = ax ? b.y + o : b.y + sd * d;
        assert.ok(isWalkable(w, x, y), `${b.id} at ${b.x.toFixed(0)},${b.y.toFixed(0)}: ${x.toFixed(1)},${y.toFixed(1)} blocked`);
      }
    }
  });
  test(`${region}: the square open 10 tiles round its well: no house or tree in it (a waystation's deck square has no well, and is exempt)`, () => {
    const w = createSim(SEED, undefined, { scene: 'town', region }).world, c = w.structs.find((s) => /_well_1$/.test(s.id));
    if (!c) { assert.equal(region, 'fens', 'only Saltmere, a waystation, has no well'); return; }
    const BIG = /(house|inn|tavern|shop|smith|temple|farm|cottage|longhouse|workshop|stilt|keep|tower|pine|oak|autumn|birch|grove|alder|willow|carr|dead_)/;
    for (const s of w.structs) {
      if (!BIG.test(s.id) || !ENV_FOOT[s.id]) continue;
      const f = ENV_FOOT[s.id], nx = Math.max(s.x + f[0], Math.min(c.x, s.x + f[2])), ny = Math.max(s.y + f[1], Math.min(c.y, s.y + f[3]));
      assert.ok(Math.hypot(nx - c.x, ny - c.y) >= 10, `${s.id} reaches within ${Math.hypot(nx - c.x, ny - c.y).toFixed(1)} tiles of the square's middle`);
    }
  });
}
