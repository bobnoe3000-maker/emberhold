// Hire from the tavern in a test: through the real command (fee and all), with the purse topped up
// for it and put back after, so a test's own gold counts are as they were. Unless `perks` is set,
// the hires fight as the balance contract measures them: no rolled perks (GDD §6.2, companions.js).
/** @param {any} sim @param {number[]} idxs @param {{ perks?: boolean }} [o] */
export function hire(sim, idxs, { perks = false } = {}) {
  const C = sim.state.counters, gold = C.gold || 0;
  for (const idx of idxs) { C.gold = 1e9; sim.commands.push({ type: 'hire', idx }); sim.tick(); }
  C.gold = gold;
  if (!perks) for (const m of [...sim.state.party, ...sim.state.bench]) if (!m.main && m.rank !== 'found') { m.perks = []; m.hidden = null; }
}
