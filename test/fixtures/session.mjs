// session.mjs — one scripted play session, identical in Node and in every browser engine: walk
// to the next room (a battle), steer a little, open a chest, equip what drops. The end-state hash
// must match everywhere, or server-side replay (sim/replay.js) would reject honest players.
import { createSim } from '../../src/sim/core.js';
import { startSession, replaySession } from '../../src/sim/replay.js';

export function scriptedSession(ticks = 1800) {
  const sim = createSim(20260807, undefined, { scene: 'dungeon' });
  const ses = startSession(sim, { scene: 'dungeon' });
  const d = sim.destinations().find((o) => o.id === 'next-room'); sim.commands.push({ type: 'goto', ...d });
  let chest = null; for (const [k, v] of sim.world.props) if (v === 'chest') { chest = k.split(',').map(Number); break; }
  for (let i = 0; i < ticks; i++) {
    if (i % 200 === 50) sim.commands.push({ type: 'move', x: 0.9 * ((i / 200) % 2 ? 1 : -0.6), y: 0.5 });
    if (i === 1200 && chest) sim.commands.push({ type: 'tap', tx: chest[0], ty: chest[1] });
    if (i === 1600 && sim.state.bag.length) sim.commands.push({ type: 'equip', member: 'you', uid: sim.state.bag[0].uid });
    sim.tick();
  }
  const claim = ses.claim();
  return { endHash: claim.endHash, replayHash: replaySession(claim).hash, ticks: claim.ticks, level: sim.state.party[0].level, xp: sim.state.party[0].xp, gold: sim.state.counters.gold };
}
