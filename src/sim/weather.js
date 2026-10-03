// @ts-check
// weather.js — the weather (the owner, 2026-10-03: "Add weather cycles also, not overly visually intrusive though —
// rain, fog, snow… on longer cycles"; GDD §10.1). A pure function of the world's seed, the clock and the region: no
// state, no draw from any stream, nothing saved. Every reader agrees (the renderer, the sound, the HUD's sky dial),
// a reload brings back the same sky, and a replay is untouched (the sim's rules don't read it).
//
// The clock is cut into spells of SPELL_S (20 minutes of play, a third of a day). Each spell is clear, fog, rain or
// snow by a hash of the seed and the spell's number, weighted by region; fog comes more often in a spell that starts
// in the night or at dawn. A spell builds over RAMP_S and fades over RAMP_S, except where the next spell is the same
// weather, which runs on unbroken (so it lasts 40 or 60 minutes). Its strength: 0.55–1 at its height.

import { hash2, STREAM } from './rng.js';
import { DAY_S } from './heroes.js';

export const SPELL_S = 1200, RAMP_S = 180;
export const KINDS = /** @type {const} */ (['clear', 'fog', 'rain', 'snow']);
/** @typedef {'clear' | 'fog' | 'rain' | 'snow'} WeatherKind */
// [clear, fog, rain, snow] by region: the Vale is mostly fair, the fens wet and misty, the heights snowy
const WEIGHTS = { vale: [0.46, 0.18, 0.26, 0.1], fens: [0.36, 0.3, 0.28, 0.06], reach: [0.5, 0.2, 0.2, 0.1], heights: [0.36, 0.16, 0.14, 0.34] };

/** the weather of spell n: its kind and its strength at its height @param {number} seed @param {number} n @param {string} region */
export function spellOf(seed, n, region = 'vale') {
  const w = (WEIGHTS[region] || WEIGHTS.vale).slice();
  const startPart = Math.floor((((n * SPELL_S) % DAY_S) + DAY_S) % DAY_S / (DAY_S / 4));    // 0 dawn · 1 day · 2 dusk · 3 night
  if (startPart === 0 || startPart === 3) w[1] *= 1.6;                                        // mist at night and dawn
  const tot = w[0] + w[1] + w[2] + w[3], s = (seed ^ STREAM.WEATHER) | 0;
  let r = hash2(n, 0, s) * tot, i = 0;
  while (i < 3 && r >= w[i]) { r -= w[i]; i++; }
  return { kind: KINDS[i], peak: 0.55 + 0.45 * hash2(n, 1, s) };
}

const smooth = (x) => { const k = Math.max(0, Math.min(1, x)); return k * k * (3 - 2 * k); };

/** the weather at t seconds of play: its kind and how strong it is now (0..1)
 * @param {number} seed @param {number} t @param {string} [region] @returns {{ kind: WeatherKind, k: number }} */
export function weatherAt(seed, t, region = 'vale') {
  const n = Math.floor(t / SPELL_S), into = t - n * SPELL_S, cur = spellOf(seed, n, region);
  if (cur.kind === 'clear') return { kind: 'clear', k: 0 };
  const prev = spellOf(seed, n - 1, region), next = spellOf(seed, n + 1, region);
  const up = prev.kind === cur.kind ? 1 : smooth(into / RAMP_S), down = next.kind === cur.kind ? 1 : smooth((SPELL_S - into) / RAMP_S);
  // (a run of one weather eases its strength from one spell's peak to the next's across the join)
  const peak = prev.kind === cur.kind && into < RAMP_S ? prev.peak + (cur.peak - prev.peak) * smooth(0.5 + into / (2 * RAMP_S))
    : next.kind === cur.kind && into > SPELL_S - RAMP_S ? cur.peak + (next.peak - cur.peak) * smooth((into - (SPELL_S - RAMP_S)) / (2 * RAMP_S)) : cur.peak;
  return { kind: cur.kind, k: Math.min(up, down) * peak };
}

/** seconds until the weather now has gone (its run of spells ends), or 0 when it's clear
 * @param {number} seed @param {number} t @param {string} [region] */
export function weatherLeft(seed, t, region = 'vale') {
  let n = Math.floor(t / SPELL_S); const kind = spellOf(seed, n, region).kind;
  if (kind === 'clear') return 0;
  for (let i = 0; i < 12 && spellOf(seed, n + 1, region).kind === kind; i++) n++;
  return (n + 1) * SPELL_S - t;
}

/** the weather's name for the sky dial ('' when clear) @param {WeatherKind} kind */
export const weatherName = (kind) => ({ clear: '', fog: 'Fog', rain: 'Rain', snow: 'Snow' })[kind];
