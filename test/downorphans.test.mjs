// Downed with no fight (the owner, 2026-11-26: "2 down, but temple says i dont have anyone down"). `down` is saved
// (MEMBER_KEYS) and the fight isn't, so a save made mid-fight, reloaded, left members at 0 HP and Downed in town: the
// temple raises only the Fallen, and no fight's end was left to get them up. A reload or a trip gets them up at 20 %.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createSim } from '../src/sim/core.js';
import { statsFor } from '../src/sim/party.js';
import { hire } from './fixtures/hire.mjs';

const SEED = 20260807;
const downed = (sim) => sim.state.party.filter((m) => m.down);

test('a save with members Downed and no fight loads with them on their feet at 20 %, the Fallen still Fallen', () => {
  const sim = createSim(SEED, undefined, { scene: 'town' }); sim.tick(); hire(sim, [0, 1]);
  const snap = JSON.parse(JSON.stringify(sim.snapshot()));
  snap.party[0].down = true; snap.party[0].hp = 0;          // (as the report: the hero and a companion Downed, in town)
  snap.party[2].down = true; snap.party[2].hp = 0;
  snap.party[1].fallen = true; snap.party[1].hp = 0;
  const back = createSim(SEED, undefined, { scene: 'town' }); back.tick(); back.restore(snap); back.tick();
  assert.deepEqual(downed(back), [], 'nobody left Downed out of a fight');
  for (const i of [0, 2]) { const m = back.state.party[i], max = statsFor(m).maxHp; assert.ok(m.hp >= Math.round(max * 0.2) && m.hp < max * 0.25, `${m.name}: up at a fifth (${m.hp}/${max})`); }
  assert.equal(back.state.party[1].fallen, true, 'the Fallen are the temple\'s, as before');
});

test('the same for a save made mid-fight in a dungeon: reloaded, the fight is gone and so is the Downed', () => {
  const sim = createSim(SEED, undefined, { scene: 'town' }); sim.tick(); hire(sim, [0]);
  const snap = { ...JSON.parse(JSON.stringify(sim.snapshot())), scene: 'dungeon', site: 'barrows', depth: 0, floors: [] };
  snap.party[1].down = true; snap.party[1].hp = 0;
  const back = createSim(SEED, undefined, { scene: 'town' }); back.tick(); back.restore(snap); back.tick();
  const m = back.state.party[1]; assert.equal(m.down, false); assert.ok(m.hp >= 1); assert.ok(!m.fallen);
});
