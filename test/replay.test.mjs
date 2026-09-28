// verified progression: an honest session replays exactly; tampering is rejected
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createSim } from '../src/sim/core.js';
import { startSession, verifySession, stateHash } from '../src/sim/replay.js';
import { makeItem } from '../src/sim/items.js';

const SEED = 20260807;
function play(edit) {
  const sim = createSim(SEED, undefined, { scene: 'dungeon' }), s = startSession(sim, { scene: 'dungeon' });
  const d = sim.destinations().find((o) => o.id === 'next-room'); sim.commands.push({ type: 'goto', ...d });
  for (let i = 0; i < 600; i++) { if (i === 300 && edit) edit(sim); if (i % 150 === 70) sim.commands.push({ type: 'move', x: 0.6, y: 0.5 }); sim.tick(); }
  return { sim, s, claim: s.claim() };
}
test('an honest session replays to the identical state', () => {
  const { s, claim } = play();
  const r = verifySession(claim, { verified: s.startHash, elapsedMs: claim.ticks * 50 });
  assert.equal(r.ok, true, r.reason);
  assert.equal(r.hash, claim.endHash);
});
test('memory edits, forged items and gold are rejected', () => {
  for (const edit of [(sim) => { sim.state.party[0].level = 30; }, (sim) => sim.state.bag.push(makeItem('staff', 30, 'rare', { uid: 'x' })), (sim) => { sim.state.counters.gold += 999; }]) {
    const { s, claim } = play(edit);
    assert.equal(verifySession(claim, { verified: s.startHash, elapsedMs: 1e9 }).ok, false);
  }
});
test('an edited save and a sped-up clock are rejected', () => {
  const sim = createSim(SEED, undefined, { scene: 'dungeon' }), verified = stateHash(sim.snapshot()), bad = sim.snapshot();
  bad.counters.gold = 5000; sim.restore(bad);
  const c = startSession(sim).claim();
  assert.match(verifySession(c, { verified, elapsedMs: 1e9 }).reason, /verified state/);
  const { s, claim } = play();
  assert.match(verifySession(claim, { verified: s.startHash, elapsedMs: claim.ticks * 5 }).reason, /real time/);
});
test('forged commands change nothing (the sim validates them)', () => {
  const forged = createSim(SEED, undefined, { scene: 'dungeon' }), control = createSim(SEED, undefined, { scene: 'dungeon' });
  forged.commands.push({ type: 'equip', member: 'you', uid: 'not-in-bag' });
  forged.commands.push({ type: 'hire', idx: 0 });                   // not in a town
  forged.commands.push({ type: 'salvage', uid: 'nope' });
  forged.commands.push({ type: 'harvest', tx: 0, ty: 0 });           // out of reach
  for (let i = 0; i < 5; i++) { forged.tick(); control.tick(); }
  assert.equal(stateHash(forged.snapshot()), stateHash(control.snapshot()));
});
