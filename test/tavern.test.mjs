// The Shuttered Inn (docs/tavern-dungeon.md; the owner, 2026-11-22: "Prototype a dungeon level that looks like the inside
// of a building.. a tavern. Needs more open floor to accommodate NPC battle but the walls are up and set dressing looks
// great"): a new kind of dungeon, a building's inside. The sim's side: a parked site, one authored floor of `tavern` rooms,
// each dressed as plans.js writes it, the furniture against the walls and the fighting rooms' middles open, nothing on the
// stairs or in a doorway, every room reached. The renderer's: whole walls (no ruin), its timber frame and furniture.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createWorld, isWalkable, FLAT_PROPS } from '../src/sim/world.js';
import { createSim } from '../src/sim/core.js';
import { SITES, siteOpen } from '../src/sim/sites.js';
import { PLANS, checkPlan } from '../src/sim/plans.js';
import { dressingFaults } from '../src/sim/keepclear.js';
import { convertWorld } from '../src/render3d/convert.js';

const SEEDS = [1, 2, 3, 20260807, 617082301];
const inn = (seed) => createWorld(seed, undefined, 0, 'shuttered_inn');
/** a room's props by kind @returns {Record<string, number>} */
const propsOf = (w, part) => {
  const r = w.level.rooms.find((q) => q.part === part), out = {};
  for (const [k, kind] of w.props) { const c = w.level.cells.get(k); if (c && c.room === r.id) out[kind] = (out[kind] || 0) + 1; }
  return out;
};

test('the Inn: a parked prototype, one authored floor, every room of the tavern kits, its plan sound', () => {
  const S = SITES.shuttered_inn;
  assert.ok(S && S.plan && S.flat && S.parked, 'authored, flat, parked: on no land yet');
  assert.equal(S.floors, 1); assert.equal(S.base, 6);
  assert.ok(!siteOpen('shuttered_inn', []) || S.parked, 'no way in from a land');
  const P = PLANS.shuttered_inn;
  assert.deepEqual(checkPlan(P), []);
  const spaces = P.floors.flatMap((f) => f.spaces);
  assert.ok(spaces.every((s) => s.kit === (s.id === 'the_cellar_hall' ? 'tavern_cellar' : 'tavern')), 'every room an inn\'s, its cellar the cellar\'s');
  assert.deepEqual(spaces.map((s) => s.id), ['the_front_room', 'the_common_room', 'the_kitchen', 'the_snug', 'the_cellar_hall']);
});

test('the Inn: each room dressed as written, on every seed', () => {
  for (const seed of SEEDS) {
    const w = inn(seed), common = propsOf(w, 'the_common_room'), front = propsOf(w, 'the_front_room'), snug = propsOf(w, 'the_snug'), kitchen = propsOf(w, 'the_kitchen');
    assert.equal(common.hearth, 1, `seed ${seed}: the common room's hearth`);
    assert.equal(common.noticeboard, 1, `seed ${seed}: its notice board`);
    assert.equal(common.longtable, 3, `seed ${seed}: three long tables`);
    assert.equal(common.tbench, 6, `seed ${seed}: a bench either side of each`);
    assert.equal(common.logpile, 2, `seed ${seed}: firewood either side of the hearth`);
    assert.equal(front.counter, 1, `seed ${seed}: the bar`); assert.equal(front.rug, 1);
    assert.equal(snug.longtable, 2, `seed ${seed}: the snug's tables`); assert.equal(snug.tbench, 4);
    assert.equal(kitchen.hearth, 1, `seed ${seed}: the kitchen's hearth`);
  }
});

test('the Inn: the fighting rooms keep their middles open (furniture to the walls)', () => {
  for (const seed of SEEDS) {
    const w = inn(seed), L = w.level;
    for (const r of L.rooms.filter((q) => q.foes)) {
      let solid = 0, n = 0, mid = 0;
      for (const [k, c] of L.cells) {
        if (c.kind !== 'floor' || c.room !== r.id) continue;
        const [x, y] = k.split(',').map(Number), p = w.props.get(k), blocks = !!p && !FLAT_PROPS.has(p);
        n++; if (blocks) solid++;
        if (blocks && Math.abs(x - r.cx) <= r.rw * 0.4 && Math.abs(y - r.cy) <= r.rh * 0.4) mid++;
      }
      assert.equal(mid, 0, `seed ${seed}: ${r.name}'s middle is open`);
      assert.ok(solid / n < 0.2, `seed ${seed}: ${r.name} ${(100 * solid / n).toFixed(0)} % furniture`);
    }
  }
});

test('the Inn: nothing on the stairs or in a doorway, lights by the walls, every room reached from the way in', () => {
  for (const seed of SEEDS) {
    const w = inn(seed), L = w.level;
    assert.deepEqual(dressingFaults(w), [], `seed ${seed}`);
    const K = (x, y) => `${x},${y}`, s = [Math.floor(L.spawn.x), Math.floor(L.spawn.y)], seen = new Set([K(...s)]), q = [s], reached = new Set();
    while (q.length) {
      const [x, y] = q.pop(), c = L.cells.get(K(x, y)); if (c && c.room >= 0) reached.add(c.room);
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const k = K(x + dx, y + dy); if (!seen.has(k) && isWalkable(w, x + dx + 0.5, y + dy + 0.5)) { seen.add(k); q.push([x + dx, y + dy]); } }
    }
    assert.equal(reached.size, L.rooms.length, `seed ${seed}: every room reached`);
  }
});

test('the Inn: a fight in the common room at 6, the Redhand drinking there', () => {
  const sim = createSim(20260807, undefined, { scene: 'dungeon', site: 'shuttered_inn' }); sim.tick();
  const L = sim.world.level, r = L.rooms.find((q) => q.part === 'the_common_room'), p = sim.state.player;
  assert.equal(sim.world.roomLevels.get(r.id), 6);
  p.x = p.px = r.cx + 0.5; p.y = p.py = r.cy + 0.5;
  for (let i = 0; i < 20 * 6 && !(sim.world.enemies || []).length; i++) sim.tick();
  assert.ok((sim.world.enemies || []).length > 0, 'a wave comes');
});

test('the Inn drawn: whole walls, the back a storey and a half and the near cut to a sill, its frame and furniture, a lit fill', () => {
  const w = inn(20260807); w.site = 'shuttered_inn';
  const { level, sprites, ambient } = convertWorld(w, {});
  const hs = new Set(level.heights.join('').split(''));
  assert.ok(hs.has('8') && hs.has('3'), 'back walls at 8, sills at 3');
  for (const h of ['5', '7', '9']) assert.ok(!hs.has(h), `no ruined course at ${h}`);
  assert.ok(level.environment.interior);
  assert.ok(ambient.sky[0] > 0.8 && ambient.sun === 0, 'a building\'s lit fill, no sun');
  const t = sprites.find((s) => s.tavern); assert.ok(t, 'the inn\'s trim');
  const by = (k) => t.tavern.pieces.filter((p) => p.k === k);
  assert.ok(by('post').length > 20 && by('beam').length > 5, 'posts and beams along the back walls');
  assert.equal(by('board').length, 1); assert.equal(by('logs').length, 2);
  const furn = by('furn').map((p) => p.type).sort();
  assert.deepEqual([...new Set(furn)], ['bench', 'counter', 'sacks', 'shelf', 'table']);
  assert.equal(furn.filter((f) => f === 'table').length, 6); assert.equal(furn.filter((f) => f === 'bench').length, 10);
  const types = new Set(level.objects.map((o) => o.type));
  assert.ok(types.has('hearth') && types.has('rug') && types.has('wallTorch'));
  assert.ok(!level.objects.some((o) => o.onWall), 'nothing heaped on a ruin\'s top');
  assert.ok(!sprites.some((s) => s.prop === 'longtable' || s.prop === 'tbench' || s.prop === 'hearth' || s.prop === 'counter'), 'no piece left to a card');
});
