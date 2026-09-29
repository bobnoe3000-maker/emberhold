// Walking the overland: a tap or compass walk keeps out of exit zones it isn't heading for.
// Leaving the barrows for town used to walk straight back through the barrows' mouth (the path
// north crossed it) and back into the dungeon.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createSim } from '../src/sim/core.js';

const outFromBarrows = (seed) => { const sim = createSim(seed, undefined, { scene: 'overland' }), a = sim.world.arrivals.barrows, p = sim.state.player; p.x = p.px = a.x; p.y = p.py = a.y; return sim; };
const walk = (sim, id) => {
  const o = sim.destinations().find((d) => d.id === id); assert.ok(o, `no "${id}" in the compass`);
  sim.commands.push({ type: 'goto', tx: o.tx, ty: o.ty, near: o.near, label: o.label });
  let went = null; sim.bus.on('levelChanged', () => { went = went || sim.world.kind; });
  for (let t = 0; t < 20 * 120 && !went; t++) sim.tick();
  return went;
};

for (const seed of [20260807, 7, 99991]) test(`the compass walk to town from the barrows reaches town, seed ${seed}`, () => {
  assert.equal(walk(outFromBarrows(seed), 'town'), 'town');
});
test('a walk that ends in an exit still goes through it (the nearest dungeon)', () => {
  const sim = createSim(20260807, undefined, { scene: 'overland' });   // from the Thornwick road
  assert.equal(walk(sim, 'dungeon'), 'dungeon');
});
test('the stick still takes you through any exit', () => {
  const sim = outFromBarrows(20260807);
  for (let t = 0; t < 20 * 10 && sim.world.kind === 'overland'; t++) { sim.commands.push({ type: 'move', x: 0, y: -1 }); sim.tick(); }   // north, back into the barrows' mouth
  assert.equal(sim.world.kind, 'dungeon');
});
