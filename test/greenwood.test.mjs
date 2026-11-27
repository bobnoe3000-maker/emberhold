// The Root Granary's way in (docs/greenwood-dungeon.md; docs/dungeon-looks-plan.md item 12, from the owner's two
// references): a forest dungeon, open air under the great oaks. The sim's side: a parked site on the Greenwood (a land not
// built yet), one authored floor of `greenwood` glades, each dressed as plans.js writes it, the fighting glades' middles
// open, nothing on the stairs or in a doorway, every glade reached. The renderer's: no walls, the wood's ground a step up
// round every glade, the Tithe Road's flags, the trunks kept low wherever they'd stand between the camera and a glade, the
// arcade, the granary's door and the falls built, the pieces ours (no cards).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createWorld, isWalkable, FLAT_PROPS } from '../src/sim/world.js';
import { createSim } from '../src/sim/core.js';
import { SITES, siteOpen } from '../src/sim/sites.js';
import { PLANS, checkPlan } from '../src/sim/plans.js';
import { dressingFaults } from '../src/sim/keepclear.js';
import { convertWorld } from '../src/render3d/convert.js';

const SEEDS = [1, 2, 3, 20260807, 617082301];
const wood = (seed) => createWorld(seed, undefined, 0, 'root_granary');
const propsOf = (w, part) => {
  const r = w.level.rooms.find((q) => q.part === part), out = {};
  for (const [k, kind] of w.props) { const c = w.level.cells.get(k); if (c && c.room === r.id && kind !== 'block') out[kind] = (out[kind] || 0) + 1; }
  return out;
};

test('the Root Granary: a parked prototype on the Greenwood at 56, one authored floor of greenwood glades, its plan sound', () => {
  const S = SITES.root_granary;
  assert.ok(S && S.plan && S.flat && S.parked, 'authored, flat, parked');
  assert.equal(S.region, 'greenwood'); assert.equal(S.floors, 1); assert.equal(S.family, 'ashbound'); assert.equal(S.base, 56);
  assert.ok(!siteOpen('root_granary', []), 'no door on any land yet');
  const P = PLANS.root_granary;
  assert.deepEqual(checkPlan(P), []);
  const spaces = P.floors.flatMap((f) => f.spaces);
  assert.deepEqual(spaces.map((s) => s.id), ['the_tithe_road', 'the_great_oaks', 'the_falls', 'the_arcade', 'the_granary_door']);
  assert.ok(spaces.every((s) => s.kit === 'greenwood'));
});

test('the Root Granary: each glade dressed as written, on every seed', () => {
  for (const seed of SEEDS) {
    const w = wood(seed), oaks = propsOf(w, 'the_great_oaks'), arcade = propsOf(w, 'the_arcade'), door = propsOf(w, 'the_granary_door');
    assert.ok(oaks.fallen_block >= 1 && oaks.brokenpillar === 1, `seed ${seed}: the empire's stone in the oaks`);
    assert.ok(arcade.fallen_block >= 1 && arcade.chest === 1 && door.chest === 1, `seed ${seed}: the arcade's and the door's`);
    assert.ok((propsOf(w, 'the_tithe_road').boulder || 0) >= 1, `seed ${seed}: boulders by the road`);
    for (const r of w.level.rooms) { const p = propsOf(w, r.part); assert.ok((p.lantern || 0) + (p.brazier || 0) >= 1, `seed ${seed}: ${r.part}'s lamps`); }
  }
});

test('the Root Granary: the fighting glades keep their middles open, nothing on the stairs or in a doorway, every glade reached', () => {
  for (const seed of SEEDS) {
    const w = wood(seed), L = w.level;
    for (const r of L.rooms.filter((q) => q.family && q !== L.entrance)) {
      let solid = 0, n = 0, mid = 0;
      for (const [k, c] of L.cells) {
        if (c.kind !== 'floor' || c.room !== r.id) continue;
        const [x, y] = k.split(',').map(Number), p = w.props.get(k), blocks = !!p && !FLAT_PROPS.has(p);
        n++; if (blocks) solid++;
        if (blocks && Math.abs(x - r.cx) <= r.rw * 0.4 && Math.abs(y - r.cy) <= r.rh * 0.4) mid++;
      }
      assert.equal(mid, 0, `seed ${seed}: ${r.name}'s middle is open`);
      assert.ok(solid / n < 0.1, `seed ${seed}: ${r.name} ${(100 * solid / n).toFixed(0)} % stone`);
    }
    assert.deepEqual(dressingFaults(w), [], `seed ${seed}`);
    const K = (x, y) => `${x},${y}`, s = [Math.floor(L.spawn.x), Math.floor(L.spawn.y)], seen = new Set([K(...s)]), q = [s], reached = new Set();
    while (q.length) {
      const [x, y] = q.pop(), c = L.cells.get(K(x, y)); if (c && c.room >= 0) reached.add(c.room);
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const k = K(x + dx, y + dy); if (!seen.has(k) && isWalkable(w, x + dx + 0.5, y + dy + 0.5)) { seen.add(k); q.push([x + dx, y + dy]); } }
    }
    assert.equal(reached.size, L.rooms.length, `seed ${seed}: every glade reached`);
  }
});

test('the Root Granary: a fight in the great oaks, the Ashbound come; in the land the sim does not know, and out by the stair', () => {
  const sim = createSim(20260807, undefined, { scene: 'dungeon', site: 'root_granary' }); sim.tick();
  assert.equal(sim.state.region, 'greenwood');
  const L = sim.world.level, r = L.rooms.find((q) => q.part === 'the_great_oaks'), p = sim.state.player;
  p.x = p.px = r.cx + 0.5; p.y = p.py = r.cy + 0.5;
  for (let i = 0; i < 20 * 6 && !(sim.world.enemies || []).length; i++) sim.tick();
  assert.ok((sim.world.enemies || []).length > 0, 'a wave comes');
  const out = createSim(20260807, undefined, { scene: 'dungeon', site: 'root_granary' }); out.tick();
  const q = out.state.player; q.x = q.px = out.world.exitAt.x; q.y = q.py = out.world.exitAt.y; out.tick();
  assert.equal(out.world.kind, 'overland', 'the stair up comes out on an overland (the Vale: the Greenwood is not built)');
});

test('the Root Granary drawn: glades in the wood, no walls, the road, the trunks low before every glade, its set pieces built (no cards)', () => {
  const w = wood(20260807); w.site = 'root_granary';
  const { level, sprites, origin } = convertWorld(w, {});
  const hs = new Set(level.heights.join('').split('')), ts = new Set(level.tiles.join('').split(''));
  assert.ok(!level.environment.interior && level.environment.greenwood && level.environment.outerScenery === false, 'open air, its own air');
  assert.ok(hs.has('2') && hs.has('3') && ![...hs].some((h) => /[6-9a-z]/.test(h)), 'the glades at the floor, the wood a step up: no wall');
  for (const ch of ['ᚠ', 'ᚢ', 'ᚦ', 'ᚨ']) assert.ok(ts.has(ch), `the greenwood's ground ${ch}`);
  const t = sprites.find((s) => s.tavern); assert.ok(t, "the wood's trim");
  const by = (k) => t.tavern.pieces.filter((p) => p.k === k).length;
  assert.ok(by('wtrunk') > 60 && by('wfern') > 80 && by('wshaft') >= 5, `trunks ${by('wtrunk')}, ferns ${by('wfern')}, shafts ${by('wshaft')}`);
  assert.equal(by('warcade'), 1); assert.equal(by('wgate'), 1); assert.equal(by('wfalls'), 1); assert.equal(by('woodmist'), 1);
  assert.ok(by('waylamp') >= 8 && by('wblock') >= 4 && by('wpillar') >= 2);
  // the visibility rule (docs/level-design-rules.md §1.1): no trunk taller than the ground it stands before allows, along
  // the camera's line (north-west at 30°): a figure's feet in the glade behind it stay in view
  const cell = (i, j) => [[0, 0], [1, 0], [0, 1], [1, 1]].some(([a, b]) => w.level.cells.get(`${origin.x + 2 * i + a},${origin.y + 2 * j + b}`)?.kind === 'floor');
  const floor = (x, z) => cell(Math.floor(x), Math.floor(z));   // (the sim's floor: the road on through the wood is no glade)
  for (const p of t.tavern.pieces.filter((q) => q.k === 'wtrunk' || q.k === 'wsnag')) {
    let first = 99; for (let s = 0; s <= 26 && first === 99; s += 0.5) if (floor(p.x - s * Math.SQRT1_2, p.z - s * Math.SQRT1_2)) first = s;
    assert.ok(p.h <= first * Math.tan(Math.PI / 6) + 0.05, `a ${p.k} ${p.h} tall at ${p.x},${p.z}, ${first} before a glade`);
  }
  assert.ok(!t.tavern.pieces.some((p) => p.k === 'post' || p.k === 'beam' || p.k === 'pier'), "no inn's frame, no crypt's arcade");
  assert.ok(!sprites.some((s) => ['lantern', 'brazier', 'boulder', 'fallen_block', 'brokenpillar'].includes(s.prop)), 'no piece left to a card');
});
