// Floors, one at a time (GDD §3.1): every floor has a stair up against its entrance room's back
// wall and stairs down in its descent room. Down goes one floor deeper, arriving at the foot of
// the stair up; up climbs one floor, arriving in the corridor by that floor's stairs down; the
// first floor's stair leads out to the surface. A visit remembers its floors (chests stay opened),
// and so does the save; leaving the site forgets them. (v1.48: the Old Barrows have a bottom, three floors; the last
// ends in its hall, with no stairs down.)
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createSim } from '../src/sim/core.js';
import { isWalkable } from '../src/sim/world.js';

const dungeon = (seed = 20260807) => createSim(seed, undefined, { scene: 'dungeon' });
const at = (sim, q) => { const p = sim.state.player; p.x = p.px = q.x; p.y = p.py = q.y; };
const stairsDown = (w) => { for (const [k, v] of w.props) if (v === 'stairs') { const [x, y] = k.split(',').map(Number); return { x, y }; } return null; };
const goDown = (sim) => { const s = stairsDown(sim.world); at(sim, { x: s.x + 1.5, y: s.y + 0.5 }); sim.commands.push({ type: 'harvest', tx: s.x, ty: s.y }); sim.tick(); };
const goUp = (sim) => { at(sim, sim.world.exitAt); sim.tick(); };
const cellOf = (w, q) => w.level.cells.get(Math.floor(q.x) + ',' + Math.floor(q.y));

for (const seed of [20260807, 7, 99991]) test(`every floor has a stair up; every floor but the last, stairs down and a safe arrival by them (seed ${seed})`, () => {
  const sim = dungeon(seed);
  for (let d = 0; d < 3; d++) {
    const w = sim.world;
    assert.equal(w.depth, d);
    assert.ok(w.exitAt && w.stairArrive, `depth ${d}: no stair up`);
    if (d < 2) {
      assert.ok(stairsDown(w), `depth ${d}: no stairs down`);
      assert.ok(w.stairsDownArrive && isWalkable(w, w.stairsDownArrive.x, w.stairsDownArrive.y) && cellOf(w, w.stairsDownArrive).corridor && cellOf(w, w.stairsDownArrive).room < 0, `depth ${d}: no corridor arrival by the stairs down`);
      goDown(sim);
    } else {
      assert.ok(!stairsDown(w) && !w.stairwell, `depth ${d}: the last floor, no stairs down`);
      assert.ok(w.level.descentRoom, `depth ${d}: it ends in its hall`);
    }
  }
});

test('down one floor to the foot of its stair up; up one floor into the corridor by the stairs down; the first floor leads out', () => {
  const sim = dungeon(), ev = []; sim.bus.on('levelChanged', (e) => ev.push(e));
  goDown(sim); goDown(sim);
  assert.equal(sim.state.depth, 2);
  const p = sim.state.player, a = sim.world.stairArrive;
  assert.ok(Math.hypot(p.x - a.x, p.y - a.y) < 1, 'arrived at the foot of the stair up');
  for (let i = 0; i < 20; i++) sim.tick();
  assert.equal(sim.state.depth, 2, 'arriving does not bounce you back up');
  goUp(sim);
  assert.equal(sim.state.depth, 1, 'one floor up, not out');
  assert.equal(sim.world.kind, 'dungeon');
  assert.ok(cellOf(sim.world, p).corridor && cellOf(sim.world, p).room < 0, 'in the corridor, not the boss room');
  for (let i = 0; i < 20; i++) sim.tick();
  assert.equal(sim.battle, null, 'no fight on arrival');
  assert.equal(ev.at(-1).up, true);
  for (let i = 0; i < 20; i++) sim.tick();
  assert.equal(sim.state.depth, 1, 'arriving does not send you down again');
  goUp(sim); assert.equal(sim.state.depth, 0); assert.equal(sim.world.kind, 'dungeon');
  goUp(sim); assert.equal(sim.world.kind, 'overland', 'the first floor\'s stair leads out');
});

test('a visit remembers its floors: a chest opened stays opened after going down and back up; a new visit is fresh', () => {
  const sim = dungeon();
  const chest = [...sim.world.props].find(([, v]) => v === 'chest')[0], [cx, cy] = chest.split(',').map(Number);
  at(sim, { x: cx + 1.5, y: cy + 0.5 }); sim.commands.push({ type: 'harvest', tx: cx, ty: cy }); sim.tick();
  assert.ok(sim.world.mods.get(chest)?.opened);
  const disc = sim.world.discovered.size;
  goDown(sim); goUp(sim);
  assert.equal(sim.state.depth, 0);
  assert.ok(sim.world.mods.get(chest)?.opened, 'still opened');
  assert.ok(sim.world.discovered.size >= disc, 'the fog stays lifted');
  // the save keeps the other floors of the visit
  goDown(sim);
  const data = JSON.parse(JSON.stringify(sim.snapshot())), b = dungeon(); b.restore(data);
  assert.equal(b.state.depth, 1); goUp(b);
  assert.ok(b.world.mods.get(chest)?.opened, 'still opened after a reload');
  // leave and come back: a new visit
  goUp(b); assert.equal(b.world.kind, 'overland');
  const e = b.world.exits.find((x) => x.to === 'dungeon'); at(b, { x: (e.x0 + e.x1) / 2, y: (e.y0 + e.y1) / 2 });
  for (let i = 0; i < 3 && b.world.kind !== 'dungeon'; i++) b.tick();
  assert.equal(b.world.kind, 'dungeon'); assert.ok(!b.world.mods.get(chest)?.opened, 'a new visit is fresh');
});

test('saves without floors load; bad entries are dropped', () => {
  const sim = dungeon(); goDown(sim);
  const data = JSON.parse(JSON.stringify(sim.snapshot()));
  const b = dungeon(); b.restore({ ...data, floors: undefined }); assert.equal(b.state.depth, 1);
  b.restore({ ...data, floors: [['x', {}], [-1, {}], [1, {}], [0, null], 'junk'] }); goUp(b); assert.equal(b.state.depth, 0);
});

test('the compass: the first floor\'s stair is the way out; deeper it is "Stairs up" one floor', () => {
  const sim = dungeon();
  assert.equal(sim.destinations().find((r) => r.id === 'exit')?.label, 'Exit to the Hollow Vale');
  goDown(sim);
  const up = sim.destinations().find((r) => r.id === 'exit');
  assert.equal(up.label, 'Stairs up'); assert.match(up.sub, /^to depth 1 /);
});

// The stairs down are a stairwell you can see (a 6×6 hole in the descent room, 'stairsdown_0'):
// nothing walks over it, any of its tiles takes you down from its rim, a tap in its middle walks
// you to its top step, and the compass finds a way to its rim on every floor.
test('the stairs down are a stairwell: solid to walk on, used from any side, found by the compass; the last floor has none', () => {
  for (const seed of [20260807, 777, 4242, 6]) {
    const sim = dungeon(seed);
    for (let d = 0; d < 3; d++) {
      if (d === 2) {                                                  // the Old Barrows' third floor is their last: no stairwell, none on the compass
        assert.ok(!sim.world.stairwell && !sim.world.structs.some((s) => s.id === 'stairsdown_0'), `no stairwell on the last floor (seed ${seed})`);
        assert.ok(!sim.destinations().some((r) => r.id === 'stairs-down' && !r.off), `no stairs down on the compass (seed ${seed})`);
        break;
      }
      const w = sim.world, S = w.stairwell;
      assert.ok(S && S.x1 - S.x0 === 6 && S.y1 - S.y0 === 6, `a stairwell (seed ${seed}, floor ${d + 1})`);
      assert.ok(w.structs.some((s) => s.id === 'stairsdown_0' && s.hole), 'drawn by its structure');
      for (let y = S.y0; y < S.y1; y++) for (let x = S.x0; x < S.x1; x++) assert.ok(!isWalkable(w, x + 0.5, y + 0.5), `no walking over the hole at ${x},${y}`);
      assert.equal(w.props.get(w.stairsAt.x + ',' + w.stairsAt.y), 'stairs', 'its top step');
      w.discovered.add(w.level.descentRoom.id);
      const row = sim.destinations().find((r) => r.id === 'stairs-down' && !r.off);
      assert.ok(row, `the compass reaches its rim (seed ${seed}, floor ${d + 1})`);
      if (d === 0) {                                                  // down from the far side (the back rim), by a tile that isn't the top step
        at(sim, { x: S.x0 + 2.5, y: S.y0 - 0.5 }); sim.commands.push({ type: 'harvest', tx: S.x0 + 2, ty: S.y0 }); sim.tick();
      } else if (d === 1) {                                           // a tap in the middle walks to the top step, and down
        at(sim, { x: w.stairsAt.x + 0.5, y: w.stairsAt.y + 4.5 }); sim.commands.push({ type: 'tap', tx: S.x0 + 2, ty: S.y0 + 2 });
        for (let i = 0; i < 200 && sim.state.depth === d; i++) sim.tick();
      }
      assert.equal(sim.state.depth, d + 1, `down a floor (seed ${seed}, from floor ${d + 1})`);
    }
  }
});
