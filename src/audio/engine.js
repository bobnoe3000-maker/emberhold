// @ts-check
// engine.js — the game's sound (docs/sound-plan.md §3, decision A15): raw WebAudio on the context the intro's score
// shares (audio/context.js), no library. Presentation only: it plays what audio/listen.js asks for and writes nothing
// the sim reads.
//
//   master (the player's volume) → a limiter → the speakers
//   buses: ambient · combat · steps · voices, each at the player's level for it (audio/settings.js: 0 is off)
//
// Samples come from assets/audio/bank.json (tools/audio/prep.mjs): one-shots decoded on first use (the whole set is
// small: ~250 KB), loops only for the place you're in. A cue picks one of its variants, never the same twice
// running, with a little pitch spread. Voices are capped per bus, and a cue can't retrigger inside its gap, so a
// crowded fight thins out rather than piling up. Loops crossfade their own seam (MP3 pads a file's ends, which a
// plain loop would click on).

import { audioContext, resumeAudio } from './context.js';
import { soundSettings, setSoundSettings, onSoundSettings } from './settings.js';

/** @typedef {import('./settings.js').SoundSettings} SoundSettings */
/** @typedef {'ambient' | 'combat' | 'steps' | 'voices'} Bus */

// each bus's level under the master (sound critic pass 1 set these; the player's level for it scales this: 1 is as
// mixed), and how many voices it may hold at once
const BUS_GAIN = { ambient: 0.65, combat: 0.62, steps: 0.36, voices: 0.7 };
const BUS_CAP = { ambient: 8, combat: 6, steps: 4, voices: 3 };
const GAP_MS = { steps: 45, combat: 55, voices: 220 };     // the shortest time between two of the same cue
const XFADE = 0.6;                                          // a loop's seam, s

/** the master gain for the player's 0..1 volume: a gentle curve, so 0.6 (the default) is moderate, not loud */
export const masterGain = (v) => Math.pow(Math.max(0, Math.min(1, v)), 1.6);

/** the music's level for the player's settings: its slider, under the master volume (at the default volume or above,
 * the music plays at its own slider's level: the score has no limiter after it to take more) @param {SoundSettings} s */
export const musicLevel = (s) => s.music * Math.min(1, masterGain(s.volume) / masterGain(0.6));

/** @param {{ base?: string }} [o] */
export function createAudio({ base = './assets/audio/' } = {}) {
  /** @type {AudioContext | null} */ let ctx = null;
  /** @type {any} */ let master = null, bank = null, limiter = null;
  /** @type {Record<string, GainNode>} */ const buses = {};
  /** @type {SoundSettings} */ let settings = soundSettings();
  onSoundSettings((s) => {                                 // (from the menu, or the intro's ♪)
    settings = s; apply();
    if (ctx) for (const [, L] of loops) L.g.gain.setTargetAtTime(settings.ambient > 0 ? L.level : 0, ctx.currentTime, 0.3);
  });
  const buffers = new Map(), live = { ambient: 0, combat: 0, steps: 0, voices: 0 }, lastVariant = new Map(), lastAt = new Map();
  const loops = new Map();
  let seed = 0x9e3779b9;
  const rand = () => { seed = (Math.imul(seed ^ (seed >>> 15), 0x2c1b3c6d) + 0x6d2b79f5) >>> 0; return seed / 4294967296; };   // presentation's own (never the sim's)

  /** start sound: call from a tap (browsers allow sound only after a gesture). Safe to call again. */
  function start() {
    ctx = audioContext(); if (!ctx) return;
    resumeAudio();
    if (master) return;
    const lim = ctx.createDynamicsCompressor(); lim.threshold.value = -8; lim.knee.value = 6; lim.ratio.value = 12; lim.attack.value = 0.003; lim.release.value = 0.25; lim.connect(ctx.destination);
    master = ctx.createGain(); master.connect(lim); limiter = lim;
    for (const k of Object.keys(BUS_GAIN)) { const g = ctx.createGain(); g.connect(master); buses[k] = g; }
    apply(true);
    fetch(base + 'bank.json').then((r) => r.json()).then((b) => { bank = b; for (const list of Object.values(b.shots)) for (const v of list) buffer(v.f); }).catch(() => {});
    if (typeof document !== 'undefined') document.addEventListener('visibilitychange', () => { if (!ctx) return; if (document.hidden) ctx.suspend().catch(() => {}); else ctx.resume().catch(() => {}); });
  }

  function apply(now = false) {
    if (!ctx || !master) return;
    const t = ctx.currentTime, tc = now ? 0.001 : 0.08;
    master.gain.setTargetAtTime(masterGain(settings.volume), t, tc);
    for (const [k, g] of Object.entries(buses)) g.gain.setTargetAtTime(BUS_GAIN[k] * settings[k], t, tc);
  }

  /** @param {string} f @returns {AudioBuffer | null} the decoded buffer, or null while it loads */
  function buffer(f) {
    const b = buffers.get(f);
    if (b) return b instanceof Promise ? null : b;
    if (!ctx) return null;
    const c = ctx;
    const p = fetch(base + f).then((r) => r.arrayBuffer()).then((a) => new Promise((ok, no) => c.decodeAudioData(a, ok, no)))
      .then((buf) => { buffers.set(f, buf); return buf; }).catch(() => { buffers.delete(f); return null; });
    buffers.set(f, p); return null;
  }

  /** play a one-shot cue
   * @param {{ cue: string, bus: Bus, rate?: number, gain?: number }} c @param {{ pan?: number, gain?: number, when?: number }} [o] */
  function play(c, o = {}) {
    if (!ctx || !master || !bank || ctx.state !== 'running' || !(settings[c.bus] > 0)) return false;
    const list = bank.shots[c.cue]; if (!list || !list.length) return false;
    const nowMs = ctx.currentTime * 1000, gap = GAP_MS[c.bus] || 0;
    if (nowMs - (lastAt.get(c.cue) ?? -1e9) < gap || live[c.bus] >= BUS_CAP[c.bus]) return false;
    let i = Math.floor(rand() * list.length); if (list.length > 1 && i === lastVariant.get(c.cue)) i = (i + 1) % list.length;
    const buf = buffer(list[i].f); if (!buf) return false;
    lastVariant.set(c.cue, i); lastAt.set(c.cue, nowMs);
    const src = ctx.createBufferSource(); src.buffer = buf;
    src.playbackRate.value = (c.rate || 1) * (1 + (rand() - 0.5) * 0.08);
    const g = ctx.createGain(); g.gain.value = (c.gain ?? 1) * (o.gain ?? 1);
    let out = /** @type {AudioNode} */ (g);
    if (o.pan && ctx.createStereoPanner) { const p = ctx.createStereoPanner(); p.pan.value = Math.max(-1, Math.min(1, o.pan)); g.connect(p); out = p; }
    src.connect(g); out.connect(buses[c.bus]);
    live[c.bus]++; src.onended = () => { live[c.bus]--; src.disconnect(); g.disconnect(); if (out !== g) out.disconnect(); };
    src.start(ctx.currentTime + (o.when || 0));
    return true;
  }

  /** the body of a blow (synthesised: a short thump of filtered noise; a crit adds a bright crack, a heavy one more
   * low end). The weapon's own sound is the swing; this is what it lands on.
   * @param {{ crit?: boolean, heavy?: boolean }} b @param {{ pan?: number, gain?: number }} [o] */
  function blow(b, o = {}) {
    if (!ctx || !master || ctx.state !== 'running' || !(settings.combat > 0)) return false;
    const nowMs = ctx.currentTime * 1000; if (nowMs - (lastAt.get('_blow') ?? -1e9) < 70 || live.combat >= BUS_CAP.combat) return false;
    lastAt.set('_blow', nowMs);
    const t = ctx.currentTime, len = b.heavy ? 0.22 : 0.14, n = Math.floor(ctx.sampleRate * len), buf = ctx.createBuffer(1, n, ctx.sampleRate), d = buf.getChannelData(0);
    for (let i = 0; i < n; i++) { const k = i / n; d[i] = (rand() * 2 - 1) * Math.pow(1 - k, b.heavy ? 2.2 : 3.2); }
    const src = ctx.createBufferSource(); src.buffer = buf; src.playbackRate.value = 0.9 + rand() * 0.2;
    const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = b.heavy ? 420 : 700; lp.Q.value = 1.2;
    const g = ctx.createGain(); g.gain.value = (b.heavy ? 1.3 : 1) * (o.gain ?? 1);
    src.connect(lp); lp.connect(g);
    let out = /** @type {AudioNode} */ (g);
    if (o.pan && ctx.createStereoPanner) { const p = ctx.createStereoPanner(); p.pan.value = Math.max(-1, Math.min(1, o.pan)); g.connect(p); out = p; }
    out.connect(buses.combat); live.combat++;
    src.onended = () => { live.combat--; src.disconnect(); lp.disconnect(); g.disconnect(); if (out !== g) out.disconnect(); };
    src.start(t);
    if (b.crit) {                                            // the crack: a bright click on top
      const c = ctx.createOscillator(), cg = ctx.createGain(), bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 2400; bp.Q.value = 3;
      c.type = 'square'; c.frequency.setValueAtTime(1800, t); c.frequency.exponentialRampToValueAtTime(600, t + 0.06);
      cg.gain.setValueAtTime(0.25 * (o.gain ?? 1), t); cg.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
      c.connect(bp); bp.connect(cg); cg.connect(out); c.start(t); c.stop(t + 0.09); c.onended = () => { c.disconnect(); bp.disconnect(); cg.disconnect(); };
    }
    return true;
  }

  // loops made here rather than downloaded (the weather's rain: a soft hiss of filtered noise with sparse drops in it)
  const SYNTH = { syn_rain: { d: 4 } };
  /** @param {string} name @returns {AudioBuffer | null} */
  function synthLoop(name) {
    if (buffers.has(name)) return buffers.get(name);
    if (!ctx) return null;
    const sr = ctx.sampleRate, n = Math.floor(sr * SYNTH[name].d), buf = ctx.createBuffer(1, n, sr), d = buf.getChannelData(0);
    let lp = 0, lp2 = 0;
    for (let i = 0; i < n; i++) { const w = rand() * 2 - 1; lp += (w - lp) * 0.12; lp2 += (lp - lp2) * 0.35; d[i] = (lp - lp2 * 0.6) * 0.9 + w * 0.06; }   // a hiss without its top or its bottom
    for (let j = 0, drops = Math.floor(SYNTH[name].d * 28); j < drops; j++) {                               // drops on leaves and stone
      const at = Math.floor(rand() * (n - sr * 0.02)), f = 1800 + rand() * 3200, a = 0.08 + rand() * 0.22, len = Math.floor(sr * (0.004 + rand() * 0.01));
      for (let i = 0; i < len; i++) d[at + i] += a * Math.sin((2 * Math.PI * f * i) / sr) * Math.exp((-6 * i) / len);
    }
    let peak = 0; for (let i = 0; i < n; i++) peak = Math.max(peak, Math.abs(d[i])); for (let i = 0; i < n; i++) d[i] *= 0.7 / (peak || 1);
    buffers.set(name, buf); return buf;
  }

  /** hold an ambient loop at a level (0 lets it fade out and stop); call every so often with the place's levels
   * @param {string} name @param {number} level */
  function loop(name, level) {
    if (!ctx || !master || !bank) return;
    if (!bank.loops[name] && !SYNTH[name]) return;
    let L = loops.get(name);
    if (!L) { if (level <= 0) return; const g = ctx.createGain(); g.gain.value = 0; g.connect(buses.ambient); L = { g, cur: null, next: 0, level: 0 }; loops.set(name, L); }
    L.level = level;
    L.g.gain.setTargetAtTime(settings.ambient > 0 ? level : 0, ctx.currentTime, 0.8);
  }

  /** keep the loops going: start a layer before the last one runs out, crossfading the seam (call each frame) */
  function tick() {
    if (!ctx || !master || !bank || ctx.state !== 'running') return;
    const t = ctx.currentTime;
    for (const [name, L] of loops) {
      if (L.level <= 0.001 && L.g.gain.value < 0.002) { if (L.cur) { try { L.cur.stop(); } catch {} L.cur = null; } continue; }
      if (L.cur && t < L.next) continue;
      const buf = SYNTH[name] ? synthLoop(name) : buffer(bank.loops[name].f); if (!buf) continue;
      const src = ctx.createBufferSource(); src.buffer = buf;
      const fade = ctx.createGain(), d = buf.duration, x = Math.min(XFADE, d / 4);
      src.connect(fade); fade.connect(L.g);
      const start = L.cur ? Math.max(t, L.next) : t, off = L.cur ? 0 : rand() * d * 0.6;   // (a fresh loop starts anywhere in its first 60 %)
      fade.gain.setValueAtTime(L.cur ? 0 : 1, start); if (L.cur) fade.gain.linearRampToValueAtTime(1, start + x);
      const end = start + (d - off);
      fade.gain.setValueAtTime(1, end - x); fade.gain.linearRampToValueAtTime(0, end);
      src.start(start, off); src.stop(end + 0.05);
      src.onended = () => { src.disconnect(); fade.disconnect(); };
      L.cur = src; L.next = end - x;
    }
  }

  return {
    start, play, blow, loop, tick,
    /** @returns {SoundSettings} */ get settings() { return settings; },
    /** @param {Partial<SoundSettings>} s */ set(s) { setSoundSettings(s); },
    get running() { return !!(ctx && master && ctx.state === 'running'); },
    get ready() { return !!bank; },
    /** dev (the sound critic's meter): the output after the limiter, as RMS and peak dBFS since the last read */
    meter() {
      if (!ctx || !limiter) return null;
      const an = ctx.createAnalyser(); an.fftSize = 2048; limiter.connect(an); const buf = new Float32Array(an.fftSize);
      return () => { an.getFloatTimeDomainData(buf); let s = 0, p = 0; for (const v of buf) { s += v * v; p = Math.max(p, Math.abs(v)); } const db = (x) => (x > 0 ? 20 * Math.log10(x) : -120); return { rms: db(Math.sqrt(s / buf.length)), peak: db(p) }; };
    },
    /** dev: what's playing now, per bus */ get live() { return { ...live, loops: [...loops].filter(([, L]) => L.level > 0).map(([k, L]) => [k, +L.level.toFixed(2)]) }; },
  };
}
