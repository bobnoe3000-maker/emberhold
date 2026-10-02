// The Stage's world (sim outdoor.js buildStage; docs/character-stage-proposal.md): a dev-only preview scene,
// a flat field and nothing else (no buildings, people, foes or ways out), the hero at its centre; grass, or
// one wide cobbled square. Pure and deterministic like every scene; the sim ticks it without incident.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createSim } from '../src/sim/core.js';
import { materialAt, isWalkable } from '../src/sim/world.js';
import { STAGE_W } from '../src/sim/outdoor.js';

test('the stage is an empty flat field: nobody, nothing, nowhere to go', () => {
  const s = createSim(7, undefined, { scene: 'stage', region: 'grass' }), w = s.world, c = STAGE_W / 2;
  assert.equal(w.kind, 'stage');
  assert.equal(w.structs.length, 0); assert.equal(w.props.size, 0); assert.equal(w.exits.length, 0);
  assert.equal((w.npcs || []).length, 0); assert.equal(w.enemies.length, 0);
  assert.deepEqual([s.state.player.x, s.state.player.y], [c + 0.5, c + 0.5]);
  for (const [x, y] of [[c, c], [10, 10], [STAGE_W - 10, STAGE_W - 10]]) { assert.equal(materialAt(w, x, y), 'grass'); assert.ok(isWalkable(w, x + 0.5, y + 0.5)); }
  assert.deepEqual(s.destinations(), []);
  for (let i = 0; i < 100; i++) s.tick();                        // a few seconds: no fights, no folk, no errors
  assert.equal(s.battle, null);
});

test('floor=cobble lays one wide cobbled square; the same seed builds the same field', () => {
  const a = createSim(7, undefined, { scene: 'stage', region: 'cobble' }), b = createSim(7, undefined, { scene: 'stage', region: 'cobble' }), c = STAGE_W / 2;
  assert.equal(materialAt(a.world, c, c), 'cobble'); assert.equal(materialAt(a.world, 2, 2), 'grass');
  assert.deepEqual([...a.world.tmat], [...b.world.tmat]);
});
