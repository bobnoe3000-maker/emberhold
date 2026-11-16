// @ts-check
// lamps.js — the soul-lamps, the Cult's cages and the count (GDD §17 *Lamps and the count*; world doc v1.20 §2.1, §7).
// A lamp is pale iron that holds the souls of the bound; its keeper stands over it (the Standard of the Third Legion
// carries his legion's on his standard). It can't be struck while its keeper stands; when the keeper falls it breaks
// (every lamp so far is carried by its keeper), and every bound foe in the room lies down where it stands. A Cult
// harvester carries one caught soul in a lantern-cage; it drops the cage where it falls, and a touch breaks it.
//
// The count is two durable integers on the game slot, added to only by these rules: **lamps** broken (a cage counts)
// and **souls** freed by the company's own hand (each cage, every soul a broken lamp held; v1.119: an Ashbound put down
// goes free by itself and isn't counted, as it ran to 170–560 an hour of fighting). The living and beasts never count:
// they were never bound. No command touches it (the replay validator will write the leaderboard, the Freed).
// state.count = { lamps, souls }; state.lampsBroken = [lamp ids] (a lamp counts once, though its keeper's echo comes
// back on the next visit). Save v19 (persist/save.js): older saves credit the Standard's lamp if he fell.
// Events: 'lampBroken' { id, name, first, freed, x, y } · 'cageBroken' { tx, ty, x, y, by?, auto? } · 'countChanged' { lamps, souls }.

/** @type {Record<string, { name: string, keeper: string, souls: number }>} */
export const LAMPS = {
  // what a lamp holds is what it keeps back, unwoken; the bound walk, and each one put down is freed by itself (world doc
  // v1.49 §2.1; the owner, 2026-11-15: "should be under 20"). The Third Legion's muster, "Souls, two hundred and forty",
  // walks; the standard-lamp holds its colour party (240 before, save v50)
  third_legion: { name: "The Third Legion's standard-lamp", keeper: 'standard', souls: 16 },
  // the Abbey's roll, "three hundred and twelve professed" (world doc v1.27 §3.2), walks as the drowned; the choir-lamp
  // holds the Abbess's own chapter (312 before)
  choir_lamp: { name: "The Abbey's choir-lamp", keeper: 'abbess_below', souls: 12 },
  furnace_nine: { name: 'Furnace Nine', keeper: 'stoker', souls: 18 },   // (v1.126: the night shift, Act III's end; its forty working hands walk in the Cinderworks, the lamp holds the shift's last)
};
/** the lamp a boss carries, if any @param {string} boss */
export const lampOf = (boss) => Object.keys(LAMPS).find((id) => LAMPS[id].keeper === boss) || null;
/** the kinds that drop a cage where they fall: only the band's elite carries a caught soul (world doc v1.26; the owner,
 * 2026-10-05: a cage from every harvester was ~1 a wave, 250+ an hour) */
export const CAGE_KINDS = new Set(['harvester']);
// and the party picks a cage up on its own (GDD v1.35): after CAGE_PICKUP_S with no foe standing, every cage within
// CAGE_REACH tiles of the hero breaks, by the member standing nearest it (the same lamp and soul as a tap)
export const CAGE_PICKUP_S = 3, CAGE_REACH = 14;

/** @param {any} state */
export function countOf(state) {
  if (!state.count) state.count = { lamps: 0, souls: 0 };
  if (!state.lampsBroken) state.lampsBroken = [];
  return state.count;
}
/** add to the count (a sim rule's call only) @param {any} state @param {any} bus @param {{ lamps?: number, souls?: number }} add */
export function credit(state, bus, { lamps = 0, souls = 0 }) {
  const c = countOf(state); if (!lamps && !souls) return;
  c.lamps += lamps; c.souls += souls;
  bus.emit('countChanged', { lamps: c.lamps, souls: c.souls });
}
/** a save's count, read back whole or not at all: non-negative integers, a known lamp once @param {any} data */
export function restoreCount(data) {
  const n = (v) => (Number.isInteger(v) && v >= 0 ? v : 0), c = data && data.count;
  return { count: { lamps: n(c && c.lamps), souls: n(c && c.souls) },
    lampsBroken: [...new Set((data && Array.isArray(data.lampsBroken) ? data.lampsBroken : []).filter((id) => LAMPS[id]))] };
}
