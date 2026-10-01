// battle movement: the hero autobattles at its class speed; companions never teleport mid-fight
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createSim } from '../src/sim/core.js';
import { isWalkable } from '../src/sim/world.js';
import { hire } from './fixtures/hire.mjs';

const SEED = 20260807;
function party3() {
  const t = createSim(SEED, undefined, { scene: 'town' }); hire(t, [1, 2]);
  const sim = createSim(SEED, undefined, { scene: 'dungeon' }); sim.state.party.push(...t.state.party.slice(1).map((m) => ({ ...m })));
  const L = sim.world.level, r = L.rooms.find((q) => q !== L.entrance), p = sim.state.player; sim.world.roomLevels.set(r.id, 1);
  let best = null, bd = 1e9;
  for (const [k, c] of L.cells) { if (c.kind !== 'floor' || c.room !== r.id) continue; const [x, y] = k.split(',').map(Number); const d = Math.hypot(x - r.cx, y - r.cy); if (d < bd && isWalkable(sim.world, x + 0.5, y + 0.5)) { bd = d; best = [x, y]; } }
  p.x = p.px = best[0] + 0.5; p.y = p.py = best[1] + 0.5;
  return sim;
}
test('the hero autobattles at the fighter speed (was stuck at 2 tiles/s)', () => {
  const sim = party3(), p = sim.state.player; let peak = 0;
  for (let i = 0; i < 20 * 60; i++) { const x = p.x, y = p.y; sim.tick(); if (sim.battle) peak = Math.max(peak, Math.hypot(p.x - x, p.y - y) * 20); }
  assert.ok(peak > 6.5 && peak < 7, `hero peak ${peak.toFixed(2)} tiles/s`);
});
test('companions never teleport or get shoved during a battle', () => {
  const sim = party3(); for (let i = 0; i < 20; i++) sim.tick();         // (the test drops them overlapping; they spread out first)
  let jump = 0;
  for (let i = 0; i < 20 * 60; i++) {
    const b = sim.state.party.map((m) => [m.x, m.y]); sim.tick();
    if (sim.battle) sim.state.party.forEach((m, j) => { if (j) jump = Math.max(jump, Math.hypot(m.x - b[j][0], m.y - b[j][1])); });
  }
  assert.ok(jump < 1, `largest one-tick move ${jump.toFixed(2)} tiles`);
});
