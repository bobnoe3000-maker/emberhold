// The menu's "Copy debug report" (src/ui/debugreport.js, 2026-10-03): read only, and it says where you are, who is
// in the party, each quest's progress, and ends with the save-shaped snapshot as JSON that parses back.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createSim } from '../src/sim/core.js';
import { debugReport } from '../src/ui/debugreport.js';
import { stateHash } from '../src/sim/replay.js';

test('the debug report: where, party, quests, and the snapshot as JSON; reading it changes nothing', () => {
  const sim = createSim(20260807, undefined, { scene: 'town' });
  for (let i = 0; i < 20; i++) sim.tick();
  const n = sim.world.npcs.find((q) => q.id === 'maudry_fenn'), p = sim.state.player; p.x = p.px = n.x + 1; p.y = p.py = n.y - 1;
  sim.commands.push({ type: 'talk', npc: n.id }); sim.tick();
  sim.commands.push({ type: 'dialogueEffect', tag: 'quest', args: ['accept', 'vale_long_way_round'] }); sim.tick();
  const before = stateHash(sim.snapshot());
  const r = debugReport(sim, { slot: 2, when: 'test' });
  assert.equal(stateHash(sim.snapshot()), before, 'reading the report must not touch the sim');
  assert.match(r, /^EMBERFALL DEBUG REPORT/);
  assert.match(r, /slot 2 · seed 20260807/);
  assert.match(r, /WHERE: town · Thornwick/);
  assert.match(r, new RegExp(`1\\. ${sim.state.party[0].name} — Fighter, level 1`));
  assert.match(r, /vale_long_way_round \(errand\): /);
  const json = JSON.parse(r.slice(r.indexOf('SNAPSHOT (save-shaped JSON)\n') + 28));
  assert.deepEqual(json, JSON.parse(JSON.stringify(sim.snapshot())));
});
