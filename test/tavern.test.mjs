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
import { FAMILIES } from '../src/sim/battle.js';

const SEEDS = [1, 2, 3, 20260807, 617082301];
const inn = (seed) => createWorld(seed, undefined, 0, 'shuttered_inn');
/** a room's props by kind @returns {Record<string, number>} */
const propsOf = (w, part) => {
  const r = w.level.rooms.find((q) => q.part === part), out = {};
  for (const [k, kind] of w.props) { const c = w.level.cells.get(k); if (c && c.room === r.id) out[kind] = (out[kind] || 0) + 1; }
  return out;
};

test('the Inn: on the Reach at 20, open, one authored floor, every room of the tavern kits, its plan sound', () => {
  const S = SITES.shuttered_inn;
  assert.ok(S && S.plan && S.flat && !S.parked && !S.hidden, 'authored, flat, placed');
  assert.equal(S.region, 'reach'); assert.equal(S.floors, 1); assert.equal(S.base, 20); assert.equal(PLANS.shuttered_inn.base, 20);
  assert.ok(siteOpen('shuttered_inn', []), 'its door opens');
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
    for (const r of L.rooms.filter((q) => q.family && q !== L.entrance)) {
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

test('the Inn: a fight in the common room at 20, the Redhand\'s crew drinking there (the taproom: one crossbow in four ranged)', () => {
  const F = FAMILIES.taproom;
  assert.ok(F && F.ranged.filter((k) => k === 'crossbow').length === 1, 'one crossbow among the ranged');
  assert.ok(PLANS.shuttered_inn.floors.flatMap((f) => f.spaces).filter((s) => s.role !== 'entrance').every((s) => s.foes === 'taproom'), 'every fighting room the taproom\'s');
  const sim = createSim(20260807, undefined, { scene: 'dungeon', site: 'shuttered_inn' }); sim.tick();
  const L = sim.world.level, r = L.rooms.find((q) => q.part === 'the_common_room'), p = sim.state.player;
  for (const q of L.rooms) if (q !== L.entrance) assert.equal(sim.world.roomLevels.get(q.id), 20, `${q.name} at 20`);   // (the way in a sanctuary)
  p.x = p.px = r.cx + 0.5; p.y = p.py = r.cy + 0.5;
  for (let i = 0; i < 20 * 6 && !(sim.world.enemies || []).length; i++) sim.tick();
  const foes = sim.world.enemies || [], kinds = new Set([...F.melee, ...F.ranged, F.elite]);
  assert.ok(foes.length > 0, 'a wave comes');
  for (const e of foes) assert.ok(kinds.has(e.kind), `${e.kind}: one of the taproom's`);
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

// (the owner, 2026-11-22: "Add it as a location in game with lvl 20 NPCs.. close to town in the overworld near ashgate")
test('the Inn on the Reach: a door on its overland near Ashgate, in and back out to where you went in', () => {
  const sim = createSim(20260807, undefined, { scene: 'overland', region: 'reach' }); sim.tick();
  const w = sim.world, ex = w.exits.find((e) => e.to === 'dungeon' && e.site === 'shuttered_inn');
  assert.ok(ex, 'its door');
  const gate = w.exits.find((e) => e.to === 'town'), mid = (e) => [(e.x0 + e.x1) / 2, (e.y0 + e.y1) / 2];
  const [dx, dy] = mid(ex), [gx, gy] = mid(gate), d = Math.hypot(dx - gx, dy - gy);
  assert.ok(d < 60, `near Ashgate's gate: ${d.toFixed(0)} tiles`);
  const a = w.arrivals.shuttered_inn; assert.ok(a && isWalkable(w, a.x, a.y), 'one arrives on open ground before its door');
  assert.ok(w.labels.some((l) => l.text === 'The Shuttered Inn'), 'named on the land');
  // the walk from the town's arrival to the door is open ground the whole way
  const K = (x, y) => `${x},${y}`, s0 = [Math.floor(w.arrivals.default.x), Math.floor(w.arrivals.default.y)], seen = new Set([K(...s0)]), q = [s0];
  let found = false;
  while (q.length && !found) { const [x, y] = q.shift(); if (x >= ex.x0 - 1 && x <= ex.x1 && y >= ex.y0 - 1 && y <= ex.y1) found = true;
    for (const [ddx, ddy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const k = K(x + ddx, y + ddy); if (!seen.has(k) && Math.abs(x + ddx - dx) < 80 && Math.abs(y + ddy - dy) < 80 && isWalkable(w, x + ddx + 0.5, y + ddy + 0.5)) { seen.add(k); q.push([x + ddx, y + ddy]); } } }
  assert.ok(found, 'walked to from the gate');
});
