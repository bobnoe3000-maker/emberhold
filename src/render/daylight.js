// @ts-check
// daylight.js — the outdoor light by the time of day (GDD §10.1 v1.10, Emberlit TDD §9). Day/night is a
// curve over a few light-pass uniforms, not a rebake: the sun's colour and strength, the ambient's,
// how bright the lit windows and the lamps burn, how big the hero's carry light is, how much bloom, and
// how far the baked ground shadows lift. The sun never moves: the shadows are baked at one low angle
// from the upper left (tools/actor-lab/bake-env.cjs), so only colour and strength change, and by day the
// shadows go lighter instead of shorter.
//
// Presentation only: it reads the sim's clock (state.t) and the sim's parts of the day (npcs.js partOf),
// so the light, the townsfolk's routines and the dawn wage always agree, and writes nothing back. Each
// part holds its own look; the look blends into the next over BLEND_S, centred on the boundary, so the
// dial's word turns at the same second the routines do. Dungeons keep their own light (renderer.js).

import { DAY_S } from '../sim/heroes.js';
import { PARTS, PART_S } from '../sim/npcs.js';

export const PART_IDS = /** @type {const} */ (['dawn', 'day', 'dusk', 'night']);
export const PART_NAMES = ['Dawn', 'Day', 'Dusk', 'Night'];
export const BLEND_S = 120;                       // two minutes of play from one look to the next

/** @typedef {{ sun: number[], amb: number[], win: number, lamp: number, wisp: number, bloom: number, lift: number }} Sky
 *  sun / amb: light-pass colours; win: lit-window glow ×; lamp: braziers' and windows' cast light ×;
 *  wisp: the hero's carry light × (1 = the old dusk look); bloom ×; lift: 0 = the baked ground shadow
 *  as baked, 1 = no shadow at all */
/** @type {Record<string, Sky>} The looks, measured on the contact sheet (docs/art-critic-pass-5.md):
 * dusk is the game's old fixed look; night sits near 45 % of day's brightness. */
export const LOOKS = {
  dawn: { sun: [0.98, 0.70, 0.58], amb: [0.34, 0.34, 0.44], win: 0.45, lamp: 0.65, wisp: 0.8, bloom: 0.9, lift: 0.2 },
  day: { sun: [1.02, 0.94, 0.80], amb: [0.44, 0.45, 0.50], win: 0.12, lamp: 0.3, wisp: 0.55, bloom: 0.7, lift: 0.45 },
  dusk: { sun: [0.78, 0.55, 0.40], amb: [0.31, 0.29, 0.44], win: 1, lamp: 1, wisp: 1, bloom: 1, lift: 0 },
  night: { sun: [0.30, 0.37, 0.58], amb: [0.23, 0.24, 0.38], win: 1.3, lamp: 1.4, wisp: 1.45, bloom: 1.2, lift: 0.15 },
};

/** a fresh Sky to write into (one per renderer: skyAt allocates nothing) @returns {Sky} */
export const makeSky = () => ({ sun: [0, 0, 0], amb: [0, 0, 0], win: 0, lamp: 0, wisp: 0, bloom: 0, lift: 0 });

/** out = a + (b − a)·k @param {Sky} out @param {Sky} a @param {Sky} b @param {number} k */
export function mixSky(out, a, b, k) {
  for (let i = 0; i < 3; i++) { out.sun[i] = a.sun[i] + (b.sun[i] - a.sun[i]) * k; out.amb[i] = a.amb[i] + (b.amb[i] - a.amb[i]) * k; }
  out.win = a.win + (b.win - a.win) * k; out.lamp = a.lamp + (b.lamp - a.lamp) * k; out.wisp = a.wisp + (b.wisp - a.wisp) * k;
  out.bloom = a.bloom + (b.bloom - a.bloom) * k; out.lift = a.lift + (b.lift - a.lift) * k;
  return out;
}

/** The light at t seconds of play. @param {number} t @param {Sky} [out] @returns {Sky} */
export function skyAt(t, out = makeSky()) {
  const s = ((t % DAY_S) + DAY_S) % DAY_S, p = Math.min(PARTS - 1, Math.floor(s / PART_S)), into = s - p * PART_S, h = BLEND_S / 2;
  let a = p, b = p, k = 0;
  if (into > PART_S - h) { b = (p + 1) % PARTS; k = (into - (PART_S - h)) / BLEND_S; }       // 0 → ½ toward the next part
  else if (into < h) { a = (p + PARTS - 1) % PARTS; k = 0.5 + into / BLEND_S; }              // ½ → 1 out of the last one
  return mixSky(out, LOOKS[PART_IDS[a]], LOOKS[PART_IDS[b]], k * k * (3 - 2 * k));
}

/** A held look for the title screen and ?dev&tod=: a part's name, or a fraction of the day (0 = dawn
 * breaking). Returns the t to light, or null for no hold. @param {string|number|null|undefined} v */
export function holdT(v) {
  if (v === null || v === undefined || v === '') return null;
  const i = PART_IDS.indexOf(/** @type {any} */ (v));
  if (i >= 0) return (i + 0.5) * PART_S;
  const f = +v; return Number.isFinite(f) ? (((f % 1) + 1) % 1) * DAY_S : null;
}
