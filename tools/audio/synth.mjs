// @ts-check
// synth.mjs — sounds the bank needs that no recording in it has, made here and written as WAV for prep.mjs to trim,
// normalise and encode like any other source (sounds.json: a variant `{ "synth": "<name>", "seed": N }`). Deterministic:
// a seed gives the same file every time, so a rebuild changes nothing it shouldn't. Ours (CC0, assets/CREDITS.md).
//
//   ice: ice cracking (the owner, 2026-11-09: Frost Nova "sound like a horn? Should be more like ice crackling"). The
//   shield's chime pitched up was a held tone; ice is the opposite, nothing held: a sharp split, a low crunch under it,
//   then a run of brittle ticks thinning out (each a burst of noise rung through a narrow band, 1.5–7 kHz) and a few
//   glassy pings that die in a tenth of a second.
import { writeFileSync } from 'node:fs';

const SR = 44100;

/** @param {number} a */
function rng(a) { return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

/** a band-pass biquad (RBJ, constant 0 dB peak) run over x in place from i0 for n samples @param {Float64Array} x */
function bandpass(x, i0, n, f, q) {
  const w = 2 * Math.PI * f / SR, al = Math.sin(w) / (2 * q), a0 = 1 + al;
  const b0 = al / a0, b2 = -al / a0, a1 = -2 * Math.cos(w) / a0, a2 = (1 - al) / a0;
  let x1 = 0, x2 = 0, y1 = 0, y2 = 0;
  for (let i = i0; i < Math.min(x.length, i0 + n); i++) { const y = b0 * x[i] + b2 * x2 - a1 * y1 - a2 * y2; x2 = x1; x1 = x[i]; y2 = y1; y1 = y; x[i] = y; }
}

/** @param {number} seed @returns {Float64Array} */
function ice(seed) {
  const r = rng(seed), len = 1.15, out = new Float64Array(Math.floor(SR * len));
  const noise = () => r() * 2 - 1;
  // the split: a hard, bright burst (noise differenced, so its weight is high), 8 ms decay
  for (let i = 0, prev = 0; i < SR * 0.04; i++) { const n = noise(); out[i] += (n - prev) * 0.9 * Math.exp(-i / (SR * 0.008)); prev = n; }
  // the crunch under it: low noise (one-pole at ~500 Hz), 60 ms decay
  { const k = 1 - Math.exp(-2 * Math.PI * 500 / SR); let lp = 0; for (let i = 0; i < SR * 0.25; i++) { lp += k * (noise() - lp); out[i] += lp * 1.6 * Math.exp(-i / (SR * 0.06)); } }
  // the ticks: thick at first, thinning out (t = 0.95·u²), quieter as they go; each its own band and ring
  const tick = new Float64Array(Math.floor(SR * 0.03));
  for (let j = 0; j < 90; j++) {
    const u = r(), t0 = 0.012 + 0.95 * u * u, f = 1500 + 5500 * r(), q = 3 + 6 * r(), g = (0.35 + 0.65 * r()) * Math.exp(-t0 / 0.32);
    const burst = Math.floor(SR * (0.0008 + 0.0025 * r()));
    tick.fill(0); for (let i = 0; i < burst; i++) tick[i] = noise() * (1 - i / burst);
    bandpass(tick, 0, tick.length, f, q);
    const at = Math.floor(t0 * SR); for (let i = 0; i < tick.length && at + i < out.length; i++) out[at + i] += tick[i] * g * 2.2;
  }
  // the pings: a few glassy partials, never in tune with each other, each gone in a twentieth of a second (longer, they whistled)
  for (let j = 0; j < 5; j++) {
    const t0 = 0.25 * r() * r(), f = 2600 + 4600 * r(), tau = 0.012 + 0.025 * r(), g = 0.1 + 0.1 * r(), at = Math.floor(t0 * SR);
    for (let i = 0; i < SR * tau * 5 && at + i < out.length; i++) out[at + i] += Math.sin(2 * Math.PI * f * i / SR) * g * Math.exp(-i / (SR * tau)) * Math.min(1, i / 40);
  }
  return out;
}

export const SYNTHS = { ice };

/** write a 16-bit mono WAV of a synth, peak at −1 dBFS (prep.mjs sets the level again) @param {string} name @param {number} seed @param {string} file */
export function writeSynth(name, seed, file) {
  const gen = SYNTHS[/** @type {keyof typeof SYNTHS} */ (name)]; if (!gen) throw new Error(`no synth '${name}'`);
  const x = gen(seed); let peak = 0; for (const v of x) peak = Math.max(peak, Math.abs(v));
  const s = peak > 0 ? 0.89 / peak : 1, buf = Buffer.alloc(44 + x.length * 2);
  buf.write('RIFF', 0); buf.writeUInt32LE(36 + x.length * 2, 4); buf.write('WAVE', 8); buf.write('fmt ', 12);
  buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20); buf.writeUInt16LE(1, 22); buf.writeUInt32LE(SR, 24); buf.writeUInt32LE(SR * 2, 28);
  buf.writeUInt16LE(2, 32); buf.writeUInt16LE(16, 34); buf.write('data', 36); buf.writeUInt32LE(x.length * 2, 40);
  for (let i = 0; i < x.length; i++) buf.writeInt16LE(Math.max(-32767, Math.min(32767, Math.round(x[i] * s * 32767))), 44 + i * 2);
  writeFileSync(file, buf);
}
