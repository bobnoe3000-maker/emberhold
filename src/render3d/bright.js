// @ts-check
// bright.js — the Luminati world's brightness by the part of the day, outdoors (docs/luminati-port-plan.md §13). A multiply
// on world.js's graded exposure, set by hybrid.js each frame. Its own module so the menu's Brightness tray (ui/brightness.js)
// can show the numbers without loading the renderer.
//
// BRIGHT is the shipped look, by the part of the day (dawn, day, dusk, night). The owner (2026-11-02, from the phone):
// "Day 75, dusk 55 and night 40", the mean brightness of the world band at each part's middle (tools/capture/rig.mjs,
// 390 × 844, the spawn); dawn takes dusk's 55. Each value was fitted by captures. Thornwick and the overland need
// different multiplies for the same mean: the town has its windows and lamps by night, the overland next to nothing. The
// other regions keep 1 (their own tune is to come).
//
// On top of it, the player's own dial (the owner, 2026-11-04: "In game add a setting for me to dial in brightness for
// day, dusk, dawn and night so i can better test and confirm settings"): a percentage a part, kept per device
// (render3d/settings.js `bright`), 100 being the shipped look.

import { DAY_S } from '../sim/heroes.js';
import { PART_S } from '../sim/npcs.js';

export const PARTS = /** @type {const} */ (['dawn', 'day', 'dusk', 'night']);
/** @type {Record<string, number[]>} the shipped multiply a part (dawn, day, dusk, night), by scene, in the Vale */
export const BRIGHT = { town: [1.445, 1.093, 2.406, 1.06], overland: [2, 0.941, 2.763, 3.391] };
const ONE = [1, 1, 1, 1];

/** the brightness at t seconds of play, eased from each part's middle to the next's (log-linear, so a ×2.5 dusk comes on
 *  over half a part, not at the part's first second) @param {number[]} k dawn, day, dusk, night @param {number} t */
export function brightAt(k, t) {
  const x = ((((t % DAY_S) + DAY_S) % DAY_S) / PART_S + 3.5) % 4, i = Math.floor(x), u = x - i;
  return Math.exp(Math.log(k[i]) + (Math.log(k[(i + 1) % 4]) - Math.log(k[i])) * u);
}

/** the multiply a part, for a scene outdoors: the shipped look (the Vale's; 1 elsewhere) times the player's dial
 * @param {string} region @param {string} scene @param {Record<string, number>} [dial] percentages by part (100: as shipped) */
export function brightFor(region, scene, dial) {
  const base = (region || 'vale') === 'vale' && BRIGHT[scene] ? BRIGHT[scene] : ONE;
  return base.map((v, i) => v * (dial && Number.isFinite(dial[PARTS[i]]) ? dial[PARTS[i]] / 100 : 1));
}
