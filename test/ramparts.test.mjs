// The High Ramparts (docs/ramparts-dungeon.md; the owner, 2026-11-23, from a reference: "the reaches, high up on the
// ramparts"): a dungeon along a walled town's high streets. The sim's side: a parked site, one authored floor of `ramparts`
// terraces, each dressed as plans.js writes it, every piece by the houses or the parapet and the fighting terraces' middles
// open, nothing on the stairs or in a doorway, every terrace reached. The renderer's: the town's houses along the terraces'
// backs (never between the camera and a terrace), a parapet over the drop along their fronts, towers out in the mist.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createWorld, isWalkable, FLAT_PROPS } from '../src/sim/world.js';
import { createSim } from '../src/sim/core.js';
import { SITES, siteOpen } from '../src/sim/sites.js';
import { PLANS, checkPlan } from '../src/sim/plans.js';
import { dressingFaults } from '../src/sim/keepclear.js';
import { convertWorld } from '../src/render3d/convert.js';

const SEEDS = [1, 2, 3, 20260807, 617082301];
const walls = (seed) => createWorld(seed, undefined, 0, 'high_ramparts');
const propsOf = (w, part) => {
  const r = w.level.rooms.find((q) => q.part === part), out = {};
  for (const [k, kind] of w.props) { const c = w.level.cells.get(k); if (c && c.room === r.id && kind !== 'block') out[kind] = (out[kind] || 0) + 1; }
  return out;
};

test('the Ramparts: a parked trial in the Reach at 22, one authored floor of ramparts terraces, its plan sound', () => {
  const S = SITES.high_ramparts;
  assert.ok(S && S.plan && S.flat && S.parked, 'authored, flat, parked');
  assert.equal(S.region, 'reach'); assert.equal(S.floors, 1); assert.equal(S.family, 'yards'); assert.equal(S.base, 22);
  assert.ok(!siteOpen('high_ramparts', []), 'no door on any land yet');
  assert.deepEqual(checkPlan(PLANS.high_ramparts), []);
  const spaces = PLANS.high_ramparts.floors.flatMap((f) => f.spaces);
  assert.deepEqual(spaces.map((s) => s.id), ['the_stair_head', 'the_market_terrace', 'the_watch_walk', 'the_bakers_row', 'the_bastion']);
  assert.ok(spaces.every((s) => s.kit === 'ramparts'));
});

test('the Ramparts: each terrace dressed as written, the middles open, nothing on the stairs or in a doorway, every terrace reached', () => {
  for (const seed of SEEDS) {
    const w = walls(seed), L = w.level;
    assert.ok(propsOf(w, 'the_market_terrace').market_stall >= 1, `seed ${seed}: a stall`);
    assert.equal(propsOf(w, 'the_bakers_row').oven, 1, `seed ${seed}: the oven`); assert.equal(propsOf(w, 'the_bastion').well, 1, `seed ${seed}: the well`);
    for (const r of L.rooms.filter((q) => q.family && q !== L.entrance)) {
      let solid = 0, n = 0, mid = 0;
      for (const [k, c] of L.cells) {
        if (c.kind !== 'floor' || c.room !== r.id) continue;
        const [x, y] = k.split(',').map(Number), p = w.props.get(k), blocks = !!p && !FLAT_PROPS.has(p);
        n++; if (blocks) solid++;
        if (blocks && Math.abs(x - r.cx) <= r.rw * 0.4 && Math.abs(y - r.cy) <= r.rh * 0.4) mid++;
      }
      assert.equal(mid, 0, `seed ${seed}: ${r.name}'s middle is open`);
      assert.ok(solid / n < 0.15, `seed ${seed}: ${r.name} ${(100 * solid / n).toFixed(0)} %`);
    }
    assert.deepEqual(dressingFaults(w), [], `seed ${seed}`);
    const K = (x, y) => `${x},${y}`, s = [Math.floor(L.spawn.x), Math.floor(L.spawn.y)], seen = new Set([K(...s)]), q = [s], reached = new Set();
    while (q.length) {
      const [x, y] = q.pop(), c = L.cells.get(K(x, y)); if (c && c.room >= 0) reached.add(c.room);
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const k = K(x + dx, y + dy); if (!seen.has(k) && isWalkable(w, x + dx + 0.5, y + dy + 0.5)) { seen.add(k); q.push([x + dx, y + dy]); } }
    }
    assert.equal(reached.size, L.rooms.length, `seed ${seed}: every terrace reached`);
  }
});

test('the Ramparts: a fight on the market terrace, the Assay\'s men on the walls', () => {
  const sim = createSim(20260807, undefined, { scene: 'dungeon', site: 'high_ramparts' }); sim.tick();
  const L = sim.world.level, r = L.rooms.find((q) => q.part === 'the_market_terrace'), p = sim.state.player;
  p.x = p.px = r.cx + 0.5; p.y = p.py = r.cy + 0.5;
  for (let i = 0; i < 20 * 6 && !(sim.world.enemies || []).length; i++) sim.tick();
  assert.ok((sim.world.enemies || []).length > 0, 'a wave comes');
});

test('the Ramparts drawn: houses behind the terraces and never in front of one, a parapet over the drop, towers in the mist', () => {
  const w = walls(20260807); w.site = 'high_ramparts';
  const { level, sprites } = convertWorld(w, {});
  const houses = level.objects.filter((o) => o.type === 'house');
  assert.ok(houses.length >= 12, `${houses.length} houses`);
  assert.ok(houses.every((h) => h.opts.stories === 2 && /roof_/.test(h.opts.roof)), 'two storeys under a roof');
  // no house between the camera and a terrace: none with floor within five tiles to its north or west, in front of it
  const floor = (i, j) => level.heights[j]?.[i] === '2' && /c|\^|v|<|>/.test(level.tiles[j][i]);
  for (const h of houses) { const i = Math.floor(h.x), j = Math.floor(h.z); for (let k = 2; k <= 4; k++) assert.ok(!floor(i, j - k) && !floor(i - k, j), `a house at ${h.x},${h.z} stands in front of a terrace`); }
  const ts = new Set(level.tiles.join('').split(''));
  assert.ok(ts.has('[') && ts.has(']') && ts.has(' '), 'the parapet, the street, the drop');
  assert.ok(level.objects.some((o) => o.type === 'marketStall') && level.objects.some((o) => o.type === 'well'));
  const t = sprites.find((s) => s.tavern); assert.ok(t);
  const by = (k) => t.tavern.pieces.filter((p) => p.k === k).length;
  assert.ok(by('merlons') > 10 && by('fartower') === 5 && by('torchpole') >= 8 && by('oven') === 1);
  assert.ok(!sprites.some((s) => ['torch', 'barrels', 'crates', 'market_stall', 'oven', 'well'].includes(s.prop)), 'no piece left to a card');
});
