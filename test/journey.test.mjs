// A compass walk that crosses a scene change keeps going (sim/core.js journeys): picked in town,
// "Nearest dungeon" walks out of town, across the Vale, into the barrows and on to the first
// unexplored room, stopping only for the fight there. The tracked quest's row does the same. A
// plain row (the road out) still ends where it said, and the stick or ✕ ends a journey.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createSim } from '../src/sim/core.js';

const SEED = 20260807;
const go = (sim, row) => sim.commands.push({ type: 'goto', tx: row.tx, ty: row.ty, near: row.near, then: row.then || null, label: row.chip || row.label, room: row.room, journey: row.journey || null });
// run until `done` or the time runs out; the scenes passed through, in order
function walk(sim, done, secs = 240) {
  const scenes = [sim.world.kind];
  sim.bus.on('levelChanged', () => scenes.push(sim.world.kind + (sim.state.depth ? sim.state.depth + 1 : '')));
  for (let i = 0; i < secs * 20 && !done(); i++) sim.tick();
  return scenes;
}

test('"Nearest dungeon" from town walks out, across the Vale, into the barrows and to the first fight', () => {
  const sim = createSim(SEED, undefined, { scene: 'town' }); sim.tick();
  const row = sim.destinations().find((r) => r.id === 'to-dungeon');
  assert.ok(row && row.journey === 'delve', 'offered in town');
  go(sim, row);
  const scenes = walk(sim, () => !!sim.battle);
  assert.deepEqual(scenes, ['town', 'overland', 'dungeon'], 'town → the Vale → the barrows, without a tap between');
  assert.ok(sim.battle, 'it walked on into a room, and stopped there for the fight');
  assert.equal(sim.state.player.journey, null, 'the fight ends the journey (the room was where it was going)');
});

test('the tracked quest\'s row walks on through scene changes too', () => {
  const sim = createSim(SEED, undefined, { scene: 'town' }); sim.tick();
  sim.quests.begin('vale_long_way_round'); sim.tick();
  const row = sim.destinations().find((r) => r.id === 'quest');
  assert.ok(row && row.journey === 'quest');
  go(sim, row);
  const scenes = walk(sim, () => !!sim.battle);
  assert.deepEqual(scenes.slice(0, 3), ['town', 'overland', 'dungeon']);
  assert.ok(sim.battle, 'on to the quest\'s fight');
});

test('a plain row still ends where it said; the stick ends a journey', () => {
  const a = createSim(SEED, undefined, { scene: 'town' }); a.tick();
  go(a, a.destinations().find((r) => r.id === 'road-out'));
  walk(a, () => a.world.kind !== 'town');
  for (let i = 0; i < 40; i++) a.tick();
  assert.equal(a.world.kind, 'overland'); assert.equal(a.state.player.path, null, 'the road out ends on the road');

  const b = createSim(SEED, undefined, { scene: 'town' }); b.tick();
  go(b, b.destinations().find((r) => r.id === 'to-dungeon'));
  for (let i = 0; i < 10; i++) b.tick();
  assert.ok(b.state.player.journey);
  b.commands.push({ type: 'move', x: 1, y: 0 }); b.tick();
  assert.equal(b.state.player.journey, null);
  b.commands.push({ type: 'move', x: 0, y: 0 });
  walk(b, () => false, 60);
  assert.equal(b.world.kind, 'town', 'nowhere near the road out: it stays in town');
});

test('journeys replay exactly: the same commands, the same walk', () => {
  const run = () => { const s = createSim(SEED, undefined, { scene: 'town' }); s.tick(); go(s, s.destinations().find((r) => r.id === 'to-dungeon')); walk(s, () => !!s.battle); const p = s.state.player; return [s.state.tick, p.x, p.y].join(); };
  assert.equal(run(), run());
});
