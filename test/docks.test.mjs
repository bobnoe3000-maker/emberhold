// The Old Eel Wharf (docs/docks-dungeon.md; the owner, 2026-11-23, from a reference: "start two new level dressing types,
// docks and harbor"): a dungeon on a wharf's decks over open water. The sim's side: a parked site, one authored floor of
// `docks` decks, each dressed as plans.js writes it, every piece at a deck's edge and the fighting decks' middles open,
// nothing on the stairs or in a doorway, every deck reached. The renderer's: no walls, the harbour off every deck (still
// water), the decks' edges railed and piled, its lamps, cargo and boats ours.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createWorld, isWalkable, FLAT_PROPS } from '../src/sim/world.js';
import { createSim } from '../src/sim/core.js';
import { SITES, siteOpen } from '../src/sim/sites.js';
import { PLANS, checkPlan } from '../src/sim/plans.js';
import { dressingFaults } from '../src/sim/keepclear.js';
import { convertWorld } from '../src/render3d/convert.js';

const SEEDS = [1, 2, 3, 20260807, 617082301];
const wharf = (seed) => createWorld(seed, undefined, 0, 'old_eel_wharf');
const propsOf = (w, part) => {
  const r = w.level.rooms.find((q) => q.part === part), out = {};
  for (const [k, kind] of w.props) { const c = w.level.cells.get(k); if (c && c.room === r.id && kind !== 'block') out[kind] = (out[kind] || 0) + 1; }
  return out;
};

test('the Wharf: a parked trial in the Fens at 12, one authored floor of docks decks, its plan sound', () => {
  const S = SITES.old_eel_wharf;
  assert.ok(S && S.plan && S.flat && S.parked, 'authored, flat, parked');
  assert.equal(S.region, 'fens'); assert.equal(S.floors, 1); assert.equal(S.family, 'drowned'); assert.equal(S.base, 12);
  assert.ok(!siteOpen('old_eel_wharf', []), 'no door on any land yet');
  const P = PLANS.old_eel_wharf;
  assert.deepEqual(checkPlan(P), []);
  const spaces = P.floors.flatMap((f) => f.spaces);
  assert.deepEqual(spaces.map((s) => s.id), ['the_landing', 'the_fish_market', 'the_net_stage', 'the_long_jetty', 'the_harbour_end']);
  assert.ok(spaces.every((s) => s.kit === 'docks'));
});

test('the Wharf: each deck dressed as written, on every seed', () => {
  for (const seed of SEEDS) {
    const w = wharf(seed), end = propsOf(w, 'the_harbour_end'), market = propsOf(w, 'the_fish_market'), landing = propsOf(w, 'the_landing');
    assert.equal(end.crane, 1, `seed ${seed}: the crane`); assert.ok(end.boat >= 1 && market.boat >= 1, `seed ${seed}: boats tied up`);
    assert.ok(market.fishcrates >= 1, `seed ${seed}: the catch`); assert.ok(landing.rope >= 2 && landing.net >= 1, `seed ${seed}: rope and nets`);
    for (const r of w.level.rooms) assert.ok((propsOf(w, r.part).lantern || 0) >= 2, `seed ${seed}: ${r.part}'s lamps`);
  }
});

test('the Wharf: the fighting decks keep their middles open, nothing on the stairs or in a doorway, every deck reached', () => {
  for (const seed of SEEDS) {
    const w = wharf(seed), L = w.level;
    for (const r of L.rooms.filter((q) => q.family && q !== L.entrance)) {
      let solid = 0, n = 0, mid = 0;
      for (const [k, c] of L.cells) {
        if (c.kind !== 'floor' || c.room !== r.id) continue;
        const [x, y] = k.split(',').map(Number), p = w.props.get(k), blocks = !!p && !FLAT_PROPS.has(p);
        n++; if (blocks) solid++;
        if (blocks && Math.abs(x - r.cx) <= r.rw * 0.4 && Math.abs(y - r.cy) <= r.rh * 0.4) mid++;
      }
      assert.equal(mid, 0, `seed ${seed}: ${r.name}'s middle is open`);
      assert.ok(solid / n < 0.15, `seed ${seed}: ${r.name} ${(100 * solid / n).toFixed(0)} % cargo`);
    }
    assert.deepEqual(dressingFaults(w), [], `seed ${seed}`);
    const K = (x, y) => `${x},${y}`, s = [Math.floor(L.spawn.x), Math.floor(L.spawn.y)], seen = new Set([K(...s)]), q = [s], reached = new Set();
    while (q.length) {
      const [x, y] = q.pop(), c = L.cells.get(K(x, y)); if (c && c.room >= 0) reached.add(c.room);
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const k = K(x + dx, y + dy); if (!seen.has(k) && isWalkable(w, x + dx + 0.5, y + dy + 0.5)) { seen.add(k); q.push([x + dx, y + dy]); } }
    }
    assert.equal(reached.size, L.rooms.length, `seed ${seed}: every deck reached`);
  }
});

test('the Wharf: a fight on the fish market, the drowned come up the piles', () => {
  const sim = createSim(20260807, undefined, { scene: 'dungeon', site: 'old_eel_wharf' }); sim.tick();
  const L = sim.world.level, r = L.rooms.find((q) => q.part === 'the_fish_market'), p = sim.state.player;
  p.x = p.px = r.cx + 0.5; p.y = p.py = r.cy + 0.5;
  for (let i = 0; i < 20 * 6 && !(sim.world.enemies || []).length; i++) sim.tick();
  assert.ok((sim.world.enemies || []).length > 0, 'a wave comes');
});

test('the Wharf drawn: decks over still water, no walls, the edges railed and piled, its pieces built (no cards)', () => {
  const w = wharf(20260807); w.site = 'old_eel_wharf';
  const { level, sprites } = convertWorld(w, {});
  const hs = new Set(level.heights.join('').split('')), ts = new Set(level.tiles.join('').split(''));
  assert.ok(hs.has('0') && hs.has('2') && ![...hs].some((h) => /[5-9a-z]/.test(h)), 'the decks at the floor, the rest the harbour: no wall (the stairs at 3 and 4)');
  assert.ok(ts.has('o') && ts.has('_') && !ts.has(' '), 'still water and the wharf\'s own decks');
  assert.ok(level.environment.harbour && level.water.reflect > 0.3, 'a harbour at night');
  const t = sprites.find((s) => s.tavern); assert.ok(t, "the wharf's trim");
  const by = (k) => t.tavern.pieces.filter((p) => p.k === k).length;
  assert.ok(by('pile') > 40 && by('dockrail') > 4 && by('dockedge') > 8, 'piles, rails and edges round every deck');
  assert.ok(by('lamppost') >= 10 && by('crane') === 1 && by('rowboat') >= 3 && by('rope') >= 6 && by('net') >= 3);
  assert.ok(!t.tavern.pieces.some((p) => p.k === 'post' || p.k === 'beam' || p.k === 'pier'), "no inn's frame, no crypt's arcade");
  assert.ok(!sprites.some((s) => ['lantern', 'barrels', 'crates', 'boat', 'crane', 'rope', 'net', 'fishcrates'].includes(s.prop)), 'no piece left to a card');
});
