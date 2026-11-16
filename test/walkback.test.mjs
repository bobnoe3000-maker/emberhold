// A companion outside the fight's room walks back in along a real way (battle.js walkBack; the owner's pacing check,
// 2026-11-16, tools/balance/pace.mjs: a rogue out in the next room walked straight at its foe through the wall, the foes
// leashed to the room crowded its edge, and with the hero and the cleric down the wave never fell: Toadking's Mound, a
// fight four hours long). Fails without walkBack: the companion stands against the wall for good.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createSim } from '../src/sim/core.js';
import { statsFor } from '../src/sim/party.js';
import { isWalkable } from '../src/sim/world.js';
import { openAllGates } from './gates.mjs';

const cellRoom = (w, x, y) => { const c = w.level.cells.get(Math.floor(x) + ',' + Math.floor(y)); return c && c.kind === 'floor' ? c.room : -2; };

// the very spot from the pacing walk (seed 20261116 + 2 × 7919): the Mound's second floor, the fight in room 3, the rogue
// stood in room 1 at its east wall (187, 120), ten tiles of rock west of the fight
test('a companion stranded in the next room, a wall between it and the fight, walks back into the fight\'s room', () => {
  const seed = 20261116 + 2 * 7919;
  const t = createSim(seed, undefined, { scene: 'town' }); t.state.counters.gold = 1e9; t.commands.push({ type: 'hire', idx: 0 }); t.tick();
  const sim = openAllGates(createSim(seed, undefined, { scene: 'dungeon', site: 'toadking_mound' })); sim.tick();
  sim.restore({ ...JSON.parse(JSON.stringify(sim.snapshot())), depth: 1, floors: [] }); openAllGates(sim);
  sim.state.party.push({ ...t.state.party[1], cls: 'rogue' });
  const w = sim.world, L = w.level, A = L.rooms.find((r) => r.id === 3);
  assert.ok(A && cellRoom(w, 187.5, 120.5) === 1, 'the floor as the walk had it');
  let best = null, bd = 1e9; for (const [k, c] of L.cells) { if (c.kind !== 'floor' || c.room !== A.id) continue; const [x, y] = k.split(',').map(Number); const d = Math.hypot(x - A.cx, y - A.cy); if (d < bd && isWalkable(w, x + 0.5, y + 0.5)) { bd = d; best = [x + 0.5, y + 0.5]; } }
  const p = sim.state.player; p.x = p.px = best[0]; p.y = p.py = best[1];
  for (const q of sim.state.party) q.level = 30;
  for (let i = 0; i < 40 && !sim.battle; i++) sim.tick();
  assert.ok(sim.battle && sim.battle.room === A.id, 'a fight in room 3');
  const m = sim.state.party[1]; m.x = m.px = 187.5; m.y = m.py = 120.5;
  let back = false;
  for (let i = 0; i < 20 * 30 && !back; i++) { for (const q of sim.state.party) { q.hp = statsFor(q).maxHp; q.down = false; } p.x = best[0]; p.y = best[1]; sim.tick(); back = cellRoom(w, m.x, m.y) === A.id; }
  assert.ok(back, `back in the fight's room within 30 s (at ${m.x.toFixed(1)}, ${m.y.toFixed(1)}, room ${cellRoom(w, m.x, m.y)})`);
});
