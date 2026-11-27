// The Pilgrims' Stair and the Praetory (docs/pass-dungeon.md; docs/dungeon-looks-plan.md items 13 and 10, from the owner's
// three references): a mountain pass in the open air, and a fortress frozen through. The sim's side: two parked sites in the
// Heights, one authored floor each on the one-floor template, each room dressed as plans.js writes it, the fighting rooms'
// middles open, nothing on the stairs or in a doorway, every room reached. The renderer's: the pass's ledges under a held
// day, the rock only behind a ledge and never before one, the drop past it, its two bridges' planks and a frozen river under
// the gully's; the Praetory's walls in rime, its guard frozen at their posts, icicles along its walls.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createWorld, isWalkable, FLAT_PROPS } from '../src/sim/world.js';
import { createSim } from '../src/sim/core.js';
import { SITES, siteOpen } from '../src/sim/sites.js';
import { PLANS, checkPlan } from '../src/sim/plans.js';
import { dressingFaults } from '../src/sim/keepclear.js';
import { convertWorld } from '../src/render3d/convert.js';

const SEEDS = [1, 2, 3, 20260807, 617082301];
const floorOf = (site, seed) => createWorld(seed, undefined, 0, site);
const propsOf = (w, part) => {
  const r = w.level.rooms.find((q) => q.part === part), out = {};
  for (const [k, kind] of w.props) { const c = w.level.cells.get(k); if (c && c.room === r.id && kind !== 'block') out[kind] = (out[kind] || 0) + 1; }
  return out;
};

test('the Stair and the Praetory: parked trials in the Heights at 62 and 70, one authored floor each, their plans sound', () => {
  for (const [id, base, family, kits] of [['pilgrims_stair', 62, 'redhand', ['pass', 'gully']], ['praetory', 70, 'siege', ['frostkeep']]]) {
    const S = SITES[id];
    assert.ok(S && S.plan && S.flat && S.parked, `${id}: authored, flat, parked`);
    assert.equal(S.region, 'heights'); assert.equal(S.floors, 1); assert.equal(S.family, family); assert.equal(S.base, base);
    assert.ok(!siteOpen(id, []), `${id}: no door on any land yet`);
    assert.deepEqual(checkPlan(PLANS[id]), []);
    const spaces = PLANS[id].floors.flatMap((f) => f.spaces);
    assert.equal(spaces.length, 5); assert.ok(spaces.every((s) => kits.includes(s.kit)), `${id}: its kits`);
  }
  const halls = PLANS.pilgrims_stair.floors[0].halls;
  assert.deepEqual(halls.filter((h) => h.bridge).map((h) => [h.to, h.bridge]), [['the_red_gully', 'river'], ['the_cloud_ledge', 'cloud']], 'two bridges: over the river, over the cloud');
});

test('the Stair and the Praetory: each room dressed as written, the middles open, nothing on the stairs or in a doorway, every room reached', () => {
  for (const site of ['pilgrims_stair', 'praetory']) for (const seed of SEEDS) {
    const w = floorOf(site, seed), L = w.level;
    if (site === 'pilgrims_stair') {
      assert.equal(propsOf(w, 'the_red_gully').pass_icefall, 1, `seed ${seed}: the gully's frozen fall`);
      assert.equal(propsOf(w, 'the_wayside_shrine').pass_shrine, 1, `seed ${seed}: the shrine`);
      for (const part of ['the_first_turn', 'the_cloud_ledge']) assert.ok((propsOf(w, part).pass_ice || 0) >= 12, `seed ${seed}: ${part}'s frozen pool`);
      for (const part of ['the_first_turn', 'the_cloud_ledge', 'the_red_gully']) assert.ok(propsOf(w, part).pass_crystals >= 1 && propsOf(w, part).pass_pine >= 1, `seed ${seed}: ${part}'s crystals and pines`);
      assert.ok(propsOf(w, 'the_stair_foot').pass_post >= 2 && propsOf(w, 'the_stair_foot').pass_cairn >= 1, `seed ${seed}: the pilgrims' posts and cairns`);
    } else {
      for (const part of ['the_guard_hall', 'the_mess', 'the_praetors_door']) assert.ok(propsOf(w, part).frozen_guard >= 3, `seed ${seed}: ${part}'s guard at their posts`);
    }
    for (const r of L.rooms.filter((q) => q.family && q !== L.entrance)) {
      let solid = 0, n = 0, mid = 0;
      for (const [k, c] of L.cells) {
        if (c.kind !== 'floor' || c.room !== r.id) continue;
        const [x, y] = k.split(',').map(Number), p = w.props.get(k), blocks = !!p && !FLAT_PROPS.has(p);
        n++; if (blocks) solid++;
        if (blocks && Math.abs(x - r.cx) <= r.rw * 0.4 && Math.abs(y - r.cy) <= r.rh * 0.4) mid++;
      }
      assert.equal(mid, 0, `${site} seed ${seed}: ${r.name}'s middle is open`);
      assert.ok(solid / n < 0.15, `${site} seed ${seed}: ${r.name} ${(100 * solid / n).toFixed(0)} %`);
    }
    assert.deepEqual(dressingFaults(w), [], `${site} seed ${seed}`);
    const K = (x, y) => `${x},${y}`, s = [Math.floor(L.spawn.x), Math.floor(L.spawn.y)], seen = new Set([K(...s)]), q = [s], reached = new Set();
    while (q.length) {
      const [x, y] = q.pop(), c = L.cells.get(K(x, y)); if (c && c.room >= 0) reached.add(c.room);
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const k = K(x + dx, y + dy); if (!seen.has(k) && isWalkable(w, x + dx + 0.5, y + dy + 0.5)) { seen.add(k); q.push([x + dx, y + dy]); } }
    }
    assert.equal(reached.size, L.rooms.length, `${site} seed ${seed}: every room reached`);
  }
});

test('the Stair: a fight on the first turn, the Redhand holding the pass', () => {
  const sim = createSim(20260807, undefined, { scene: 'dungeon', site: 'pilgrims_stair' }); sim.tick();
  const L = sim.world.level, r = L.rooms.find((q) => q.part === 'the_first_turn'), p = sim.state.player;
  p.x = p.px = r.cx + 0.5; p.y = p.py = r.cy + 0.5;
  for (let i = 0; i < 20 * 6 && !(sim.world.enemies || []).length; i++) sim.tick();
  assert.ok((sim.world.enemies || []).length > 0, 'a wave comes');
});

test('the Stair drawn: ledges of snow, the rock behind them and never before one, the drop, two bridges and a frozen river, a held day', () => {
  const w = floorOf('pilgrims_stair', 20260807);
  const { level, sprites, hour, ambient } = convertWorld(w, { region: 'heights' });
  assert.equal(hour, 10.6, 'a held day'); assert.ok(ambient && ambient.sun > 0, 'the sun out'); assert.equal(level.environment.interior, false, 'open to the sky');
  const ts = new Set(level.tiles.join('').split(''));
  for (const ch of ['ä', 'ø', 'å', 'æ', ' ']) assert.ok(ts.has(ch), `the ${ch} tile`);
  // no rock before a ledge: none with a ledge within four tiles to its north or west (the camera looks over it)
  const ledge = (i, j) => level.heights[j]?.[i] === '2';
  for (let j = 0; j < level.depth; j++) for (let i = 0; i < level.width; i++) {
    if (!/[øå]/.test(level.tiles[j][i])) continue;
    for (let k = 1; k <= 4; k++) assert.ok(!ledge(i, j - k) && !ledge(i - k, j), `rock at ${i},${j} stands before a ledge`);
  }
  const P = sprites.find((s) => s.pass); assert.ok(P, 'the pass\'s own pieces');
  const by = (k) => P.pass.pieces.filter((p) => p.k === k).length;
  assert.equal(by('bridge'), 2); assert.equal(by('river'), 1); assert.equal(by('cloud'), 1); assert.equal(by('icefall'), 1); assert.equal(by('shrine'), 1); assert.equal(by('pool'), 1);
  assert.ok(by('cliff') >= 8 && by('rock') >= 60 && by('post') >= 8 && by('cairn') >= 4, 'the ledges\' faces, the rock\'s blocks, the posts and cairns');
  assert.ok(level.objects.some((o) => o.type === 'crag' && o.opts.stone === 'ice') && level.objects.some((o) => o.type === 'tree' && o.opts.kind === 'snowpine'), 'the ice\'s crystals, the pines');
  assert.ok(level.objects.some((o) => o.type === 'emitter' && o.preset === 'snow'), 'the snow falling');
  assert.ok(level.objects.filter((o) => o.type === 'light').length <= 16, 'its lights within reason');
  assert.ok(!sprites.some((s) => ['pass_post', 'pass_cairn', 'pass_pine', 'pass_crystals', 'pass_ice', 'pass_icefall', 'pass_shrine', 'lantern', 'sacks', 'crates'].includes(s.prop)), 'no piece left to a card');
});

test('the Praetory drawn: walls in rime, icicles along their tops, snow in at the doors, the guard frozen at their posts', () => {
  const w = floorOf('praetory', 20260807);
  const { level, sprites } = convertWorld(w, { region: 'heights' });
  const ts = new Set(level.tiles.join('').split(''));
  assert.ok(ts.has('é') && ts.has('ê') && ts.has('h'), 'rimed walls, frosted flags, snow at the doors');
  assert.ok(level.objects.some((o) => o.type === 'rock' && o.opts.stone === 'snow'), 'drifts at the doors');
  const P = sprites.find((s) => s.pass); assert.ok(P);
  const guards = [...w.props.values()].filter((k) => k === 'frozen_guard').length;
  assert.equal(P.pass.pieces.filter((p) => p.k === 'iceshell').length, guards, 'each guard in his ice');
  assert.equal(sprites.filter((s) => s.prop === 'bound').length, guards, 'each guard our bound legionary');
  assert.ok(P.pass.pieces.filter((p) => p.k === 'icicles').length >= 20, 'icicles along the walls');
});
