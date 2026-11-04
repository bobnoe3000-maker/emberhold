// dressing.test.mjs — the Vale's authored rooms dressed with sense (docs/vale-dungeon-dressing.md; the owner, 2026-11-04:
// "Dont repeat or duplicate set pieces in a room, piece placement and counts should make sense").
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createWorld, DRESS_CAP } from '../src/sim/world.js';
import { PLANS } from '../src/sim/plans.js';

const SEEDS = [20260807, 777, 104729];
const ONE = Object.entries(DRESS_CAP).filter(([, n]) => n === 1).map(([k]) => k);

test('no set piece twice in a room, and no piece past what the room would hold', () => {
  for (const pl of Object.values(PLANS)) pl.floors.forEach((_, depth) => { for (const seed of SEEDS) {
    const w = createWorld(seed, null, depth, pl.site), L = w.level;
    for (const r of L.rooms) {
      const n = {};
      for (const [k, kind] of w.props) { const c = L.cells.get(k); if (c && c.room === r.id) n[kind] = (n[kind] || 0) + 1; }
      for (const [kind, cap] of Object.entries(DRESS_CAP)) assert.ok((n[kind] || 0) <= cap + (kind === 'brazier' ? 2 : 0), `${pl.site} ${seed} ${r.name}: ${n[kind]} ${kind} (at most ${cap})`);   // (a stairwell brings its own pair)
      for (const kind of ONE) assert.ok((n[kind] || 0) <= 1, `${pl.site} ${seed} ${r.name}: ${kind} twice`);
    }
  } });
});

test('each set piece the plan names stands in its room, once', () => {
  const want = [['wickham_keep', 0, 'keep_yard', 'well'], ['wickham_keep', 0, 'horse_lines', 'hen_cart'], ['wickham_keep', 0, 'company_camp', 'stockade'], ['wickham_keep', 0, 'gatehouse', 'portcullis'],
    ['wickham_keep', 1, 'cellar_cave', 'map_table'], ['wickham_keep', 1, 'strongroom', 'iron_door'], ['sunken_chapel', 0, 'the_crossing', 'shaft'], ['sunken_chapel', 0, 'the_chancel', 'altar'],
    ['barrows', 0, 'robbed_tomb', 'sarcophagus_open'], ['sunken_chapel', 1, 'robed_camp', 'ledgers']];
  for (const [site, depth, part, kind] of want) {
    const w = createWorld(20260807, null, depth, site), L = w.level, r = L.rooms.find((q) => q.part === part);
    const n = [...w.props].filter(([k, v]) => v.replace(/_y$/, '') === kind && L.cells.get(k)?.room === r.id).length;
    assert.equal(n, 1, `${site} ${part}: ${n} ${kind}`);
  }
  // the pairs the place has: the Barrow Door's guardians either side of its stair down
  const w = createWorld(20260807, null, 0, 'barrows'), L = w.level, door = L.rooms.find((q) => q.part === 'barrow_door');
  assert.equal([...w.props].filter(([k, v]) => v === 'guardian' && L.cells.get(k)?.room === door.id).length, 2);
});

test("a fighting room's doorway has one light, a sanctuary's its pair", () => {
  const w = createWorld(20260807, null, 0, 'wickham_keep'), L = w.level, horses = L.rooms.find((q) => q.part === 'horse_lines');
  const torches = [...w.props].filter(([k, v]) => v === 'torch' && L.cells.get(k)?.room === horses.id).length;
  assert.ok(torches >= 2 && torches <= 3, `the Horse Lines' three doorways: ${torches} torches`);
});
