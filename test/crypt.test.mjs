// The Haddow Crypt (docs/crypt-dungeon.md; the owner, 2026-11-22: "do a similar dungeon style as the inside of a crypt"):
// a second dungeon inside a building, after the Shuttered Inn. The sim's side: a parked site, one authored floor of
// `crypt` rooms and an `ossuary`, each dressed as plans.js writes it, the tombs and the rest at the walls and the
// fighting rooms' middles open, every piece standing whole (never its footprint without it), nothing on the stairs or in
// a doorway, every room reached. The renderer's: whole walls (no ruin) under a blind arcade, its furniture ours, a cold
// fill.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createWorld, isWalkable, FLAT_PROPS } from '../src/sim/world.js';
import { createSim } from '../src/sim/core.js';
import { SITES, siteOpen } from '../src/sim/sites.js';
import { PLANS, checkPlan } from '../src/sim/plans.js';
import { dressingFaults } from '../src/sim/keepclear.js';
import { convertWorld } from '../src/render3d/convert.js';

const SEEDS = [1, 2, 3, 20260807, 617082301];
const crypt = (seed) => createWorld(seed, undefined, 0, 'haddow_crypt');
/** a room's props by kind (its footprints left out) @returns {Record<string, number>} */
const propsOf = (w, part) => {
  const r = w.level.rooms.find((q) => q.part === part), out = {};
  for (const [k, kind] of w.props) { const c = w.level.cells.get(k); if (c && c.room === r.id && kind !== 'block') out[kind] = (out[kind] || 0) + 1; }
  return out;
};

test('the Crypt: a parked prototype in the Vale, one authored floor of the crypt kits, its plan sound', () => {
  const S = SITES.haddow_crypt;
  assert.ok(S && S.plan && S.flat && S.parked, 'authored, flat, parked');
  assert.equal(S.region, 'vale'); assert.equal(S.floors, 1); assert.equal(S.family, 'ashbound');
  assert.ok(!siteOpen('haddow_crypt', []), 'no door on any land yet');
  const P = PLANS.haddow_crypt;
  assert.deepEqual(checkPlan(P), []);
  const spaces = P.floors.flatMap((f) => f.spaces);
  assert.deepEqual(spaces.map((s) => s.id), ['the_stair_hall', 'the_hall_of_tombs', 'the_chantry_chapel', 'the_ossuary', 'the_founders_vault']);
  assert.ok(spaces.every((s) => s.kit === (s.id === 'the_ossuary' ? 'ossuary' : 'crypt')), 'every room the crypt\'s, its ossuary the ossuary\'s');
});

test('the Crypt: each room dressed as written, on every seed', () => {
  for (const seed of SEEDS) {
    const w = crypt(seed), hall = propsOf(w, 'the_hall_of_tombs'), vault = propsOf(w, 'the_founders_vault'), chantry = propsOf(w, 'the_chantry_chapel'), stair = propsOf(w, 'the_stair_hall');
    assert.equal((hall.tomb || 0) + (hall.tomb_y || 0), 4, `seed ${seed}: the hall's four tombs`);
    assert.equal(vault.great_tomb, 1, `seed ${seed}: the founder's`); assert.equal(vault.mourner, 2, `seed ${seed}: his mourners`);
    assert.equal(chantry.altar, 1, `seed ${seed}: the chantry's altar`); assert.equal((chantry.pew || 0) + (chantry.pew_y || 0), 4, `seed ${seed}: its pews`);
    assert.equal(stair.offering, 1, `seed ${seed}: the offering table`);
    assert.ok(hall.candelabra >= 2, `seed ${seed}: candelabra in the hall`);
  }
});

test('the Crypt: the fighting rooms keep their middles open, every piece stands whole', () => {
  for (const seed of SEEDS) {
    const w = crypt(seed), L = w.level;
    const rooms = L.rooms.filter((q) => q.family && q !== L.entrance);
    assert.equal(rooms.length, 4, 'four fighting rooms');
    for (const r of rooms) {
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
    // a footprint is never left standing without its piece (a doorway's mouth turns the piece away: world.js unit)
    for (const [k, kind] of w.props) {
      if (kind !== 'block') continue;
      const [x, y] = k.split(',').map(Number); let near = false;
      for (let dy = -5; dy <= 5 && !near; dy++) for (let dx = -5; dx <= 5 && !near; dx++) { const q = w.props.get(`${x + dx},${y + dy}`); near = !!q && q !== 'block'; }
      assert.ok(near, `seed ${seed}: a footprint at ${k} with no piece`);
    }
  }
});

test('the Crypt: nothing on the stairs or in a doorway, lights by the walls, every room reached from the way in', () => {
  for (const seed of SEEDS) {
    const w = crypt(seed), L = w.level;
    assert.deepEqual(dressingFaults(w), [], `seed ${seed}`);
    const K = (x, y) => `${x},${y}`, s = [Math.floor(L.spawn.x), Math.floor(L.spawn.y)], seen = new Set([K(...s)]), q = [s], reached = new Set();
    while (q.length) {
      const [x, y] = q.pop(), c = L.cells.get(K(x, y)); if (c && c.room >= 0) reached.add(c.room);
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const k = K(x + dx, y + dy); if (!seen.has(k) && isWalkable(w, x + dx + 0.5, y + dy + 0.5)) { seen.add(k); q.push([x + dx, y + dy]); } }
    }
    assert.equal(reached.size, L.rooms.length, `seed ${seed}: every room reached`);
  }
});

test('the Crypt: a fight in the hall of tombs, the Ashbound risen there', () => {
  const sim = createSim(20260807, undefined, { scene: 'dungeon', site: 'haddow_crypt' }); sim.tick();
  const L = sim.world.level, r = L.rooms.find((q) => q.part === 'the_hall_of_tombs'), p = sim.state.player;
  p.x = p.px = r.cx + 0.5; p.y = p.py = r.cy + 0.5;
  for (let i = 0; i < 20 * 6 && !(sim.world.enemies || []).length; i++) sim.tick();
  assert.ok((sim.world.enemies || []).length > 0, 'a wave comes');
});

test('the Crypt drawn: whole walls under an arcade, its furniture built (no cards), the ossuary\'s bones, a cold fill', () => {
  const w = crypt(20260807); w.site = 'haddow_crypt';
  const { level, sprites, ambient } = convertWorld(w, {});
  const hs = new Set(level.heights.join('').split(''));
  assert.ok(hs.has('8') && hs.has('3'), 'back walls at 8, sills at 3');
  for (const h of ['5', '7', '9']) assert.ok(!hs.has(h), `no ruined course at ${h}`);
  assert.ok(level.environment.interior);
  assert.ok(ambient.sky[2] > ambient.sky[0] && ambient.sun === 0, 'a crypt\'s cold fill, no sun');
  const t = sprites.find((s) => s.tavern); assert.ok(t, 'the crypt\'s trim');
  const by = (k) => t.tavern.pieces.filter((p) => p.k === k).length;
  assert.ok(by('pier') > 20 && by('arcade') > 10 && by('sconce') > 5, 'the arcade along the back walls, its sconces');
  assert.ok(by('loculi') > 0 && by('plaque') > 0 && by('saint') > 0, 'each bay its own story');
  assert.ok(by('skullniche') > 0 && by('boneshelf') > 0, 'the ossuary\'s walls');
  assert.ok(by('lightwell') > 0, 'a light-well');
  assert.equal(by('greattomb'), 1); assert.equal(by('mourner'), 2); assert.equal(by('altar'), 1); assert.equal(by('tomb'), 6);
  assert.ok(!by('post') && !by('beam') && !by('lantern'), 'no inn\'s timber or lanterns');
  assert.ok(!level.objects.some((o) => o.onWall), 'nothing heaped on a ruin\'s top');
  assert.ok(!sprites.some((s) => ['tomb', 'tomb_y', 'great_tomb', 'mourner', 'altar', 'urns', 'bones', 'candelabra', 'pew', 'pew_y', 'offering'].includes(s.prop)), 'no piece left to a card');
});
