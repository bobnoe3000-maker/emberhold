// (for tests about something else: quests, the compass, a floor's layout) every floor's gate open, as a slot that has
// held each one's twenty waves (world.js gateOf, GDD §3.4 v1.70): the walks and the reach they check are the ones a
// player has once the gates are down. test/gate.test.mjs tests the gates themselves.
import { SITES } from '../src/sim/sites.js';
/** @param {any} sim @returns {any} the same sim */
export function openAllGates(sim) {
  for (const s of Object.keys(SITES)) for (let d = 0; d < 8; d++) sim.state.gates.add(`${s}:${d}`);
  if (sim.world) { sim.world.gateShut = null; sim.world._openCache = null; }
  return sim;
}
