// @ts-check
// shrines.js — the three kinds of dungeon shrine (GDD §3.6 v1.30; the owner, 2026-10-04: "Shrines- lets have 3 types.
// Green is current HP and MP replaced. Red gives a 2 min attack boost and the current blue gives a 2 min defense boost").
// A shrine's kind is its tile's, by the floor's seed: the same shrine is the same colour every visit, and placing
// shrines draws nothing new (world.js still places a 'shrine' prop). One use each, as before (core.js useShrine).
//   mend  (green): raises the first of the slain at half health, else mends everyone standing to full HP and MP;
//   might (red):   the whole party's ATK +25 % for 2 minutes;
//   ward  (blue):  the whole party's DEF +25 % for 2 minutes.
// A boon is a time on the sim's clock (state.boons { atk, def }: until when), so it runs in a fight or out of one,
// on any floor, and stops at its time; using another of the same kind sets it to 2 minutes again (never stacks).
// Saved since v20 (persist/save.js). battle.js combatStats applies it.

import { hash2, streamSeed } from './rng.js';

/** @type {Record<string, { name: string, stat?: 'atk' | 'def', k?: number, secs?: number }>} */
export const SHRINES = {
  mend: { name: 'Shrine of Mending' },
  might: { name: 'Shrine of Might', stat: 'atk', k: 0.25, secs: 120 },
  ward: { name: 'Shrine of Warding', stat: 'def', k: 0.25, secs: 120 },
};
/** which kind the shrine at a tile is @param {{ seed: number }} world @param {number} tx @param {number} ty @returns {'mend' | 'might' | 'ward'} */
export function shrineKind(world, tx, ty) {
  const u = hash2(tx, ty, streamSeed(world.seed | 0, 0x51e5));   // (its own stream: no other draw moves)
  return u < 0.4 ? 'mend' : u < 0.7 ? 'might' : 'ward';
}
/** @param {any} state */
export function boonsOf(state) { if (!state.boons) state.boons = { atk: 0, def: 0 }; return state.boons; }
/** a stat's boon multiplier now (1 when none) @param {any} state @param {'atk' | 'def'} stat */
export function boonK(state, stat) {
  const b = state.boons; if (!b || !(b[stat] > state.t)) return 1;
  const S = Object.values(SHRINES).find((q) => q.stat === stat); return 1 + ((S && S.k) || 0);
}
/** a save's boons, read back whole or not at all: non-negative finite times @param {any} data */
export function restoreBoons(data) {
  const b = data && data.boons, n = (v) => (typeof v === 'number' && Number.isFinite(v) && v >= 0 ? v : 0);
  return { atk: n(b && b.atk), def: n(b && b.def) };
}
