// @ts-check
// score.js — the intro's music (development plan §2.1; approved in docs/intro-mockup.html, revision 4).
// Slow, haunting synth in D minor, synthesised live in WebAudio: detuned-saw pads through a
// breathing low-pass, a formant choir, FM bells, a glass arpeggio through a dark echo, a heartbeat,
// wind and a gong, into a 6 s hall. Nothing is downloaded. Cues, by name:
//   loading · kindling · empire · fall · thornwick
// Each sustains and moves (chords turn, figures repeat) for as long as it plays. The same cue on
// consecutive cards plays on unbroken: the Fall's carries through the Long Dim and Year 301.
// Transitions are voice-led: card(id, cue) rings that card's chime (CHIMES) on the notes the two keys
// share, and the outgoing chord slides each voice to the nearest note of the incoming chord as it
// fades (the Fall's E♭ falls to D as Thornwick arrives). Crossfades are equal-power; the Fall is
// the one hard cut. Presentation only: the sim never hears any of this.

/** the nearest pitch to MIDI note `m` that is a note of `chord` (any octave); a tie resolves downward
 * @param {number} m @param {number[]} chord */
import { audioContext } from '../audio/context.js';

export function nearest(m, chord) { const pcs = chord.map((n) => ((n % 12) + 12) % 12); for (let d = 0; d <= 6; d++) for (const x of [m - d, m + d]) if (pcs.includes(((x % 12) + 12) % 12)) return x; return m; }

// the chime into each card: [note, delay s, bell | glass, level], on the notes the two keys share
/** @type {Record<string, Array<[number, number, string, number]>>} */
export const CHIMES = {
  kindling: [[62, 0, 'bell', 0.06], [74, 0.6, 'glass', 0.05]],                                          // out of the title's D major: D (in both), then D an octave up
  empire: [[77, 0, 'glass', 0.055], [74, 0.45, 'glass', 0.055], [58, 0.9, 'bell', 0.06]],                   // D minor to B♭: F and D are in both, then B♭ names the new key
  long_dim: [[74, 0, 'glass', 0.045], [69, 0.6, 'glass', 0.04]],                                        // inside the Fall: D falling to A, both in its cluster
  year301: [[69, 0, 'glass', 0.045], [75, 0.55, 'glass', 0.045]],                                      // A rising to E♭, the tritone: something is wrong
  thornwick: [[75, 0, 'glass', 0.05], [74, 0.5, 'glass', 0.055], [78, 1.1, 'bell', 0.06], [81, 1.6, 'glass', 0.045]],   // E♭ falls to D (the Phrygian close), then F♯ and A: D major
};
export const CUES = ['loading', 'kindling', 'empire', 'fall', 'thornwick'];
const FADE = { loading: 1.2, kindling: 1.8, empire: 1.8, fall: 0.35, thornwick: 2.4 };

export function createScore() {
  /** @type {any} */ let ac = null;
  /** @type {any} */ let out, verbIn, echoIn, noise, fx, cur = null, cueId = null, muted = false;
  const mid = (m) => 440 * Math.pow(2, (m - 69) / 12), now = () => ac.currentTime;
  function init(ctx) {
    if (ac) { if (ac.state === 'suspended') ac.resume(); return; }
    ac = ctx || audioContext() || new (window.AudioContext || /** @type {any} */ (window).webkitAudioContext)();   // (the game's one context: audio/context.js)
    const comp = ac.createDynamicsCompressor(); comp.threshold.value = -20; comp.ratio.value = 3; comp.attack.value = 0.03; comp.release.value = 0.5; comp.connect(ac.destination);
    out = ac.createGain(); out.gain.value = muted ? 0 : 0.9; out.connect(comp);
    // a long, dark hall: decaying noise that loses its top end as it tails off
    const len = ac.sampleRate * 6, ir = ac.createBuffer(2, len, ac.sampleRate);
    for (let ch = 0; ch < 2; ch++) { const x = ir.getChannelData(ch); let y = 0; for (let i = 0; i < len; i++) { const k = i / len; y += (0.12 + 0.8 * (1 - k)) * (Math.random() * 2 - 1 - y); x[i] = y * Math.pow(1 - k, 2.4); } }
    const verb = ac.createConvolver(); verb.buffer = ir; const wet = ac.createGain(); wet.gain.value = 0.6; verb.connect(wet); wet.connect(out); verbIn = ac.createGain(); verbIn.connect(verb);
    // a dotted echo, each repeat duller than the last
    const d = ac.createDelay(2), fb = ac.createGain(), lp = ac.createBiquadFilter(); d.delayTime.value = 0.48; fb.gain.value = 0.45; lp.type = 'lowpass'; lp.frequency.value = 2000;
    echoIn = ac.createGain(); echoIn.connect(d); d.connect(lp); lp.connect(fb); fb.connect(d); lp.connect(out); lp.connect(verbIn);
    noise = ac.createBuffer(1, ac.sampleRate * 4, ac.sampleRate); const nx = noise.getChannelData(0); for (let i = 0; i < nx.length; i++) nx[i] = Math.random() * 2 - 1;
    fx = { buses: [out, verbIn, echoIn], srcs: [] };                  // chimes: straight to the mix, outside any scene's fade
    if (!ctx) { setInterval(() => pump(0.3), 60);                     // a lookahead scheduler for the repeating figures
      document.addEventListener('visibilitychange', () => { if (document.hidden) ac.suspend(); else ac.resume(); }); }
  }
  // a scene: three buses (dry, hall, echo) that fade in and out together
  // equal-power fades: sine in, cosine out, so a crossfade holds its loudness (exponential ramps left a 5-6 dB hole)
  function fade(p, from, to, t, dur) { const n = 64, c = new Float32Array(n); for (let k = 0; k < n; k++) { const u = k / (n - 1); c[k] = to > from ? from + (to - from) * Math.sin(u * Math.PI / 2) : to + (from - to) * Math.cos(u * Math.PI / 2); } p.cancelScheduledValues(t); p.setValueCurveAtTime(c, t, dur); }
  function scene(fadeIn) {
    const t = now(), s = { t0: t, srcs: [], seqs: [], buses: [], voices: [], chord0: null, alive: true };
    for (const dest of [out, verbIn, echoIn]) { const b = ac.createGain(); b.gain.value = 0; fade(b.gain, 0, 1, t, fadeIn); b.connect(dest); s.buses.push(b); }
    return s;
  }
  // the nearest pitch to `m` that is a note of `chord` (in any octave); a tie resolves downward
  function nearest(m, chord) { const pcs = chord.map((n) => ((n % 12) + 12) % 12); for (let d = 0; d <= 6; d++) for (const x of [m - d, m + d]) if (pcs.includes(((x % 12) + 12) % 12)) return x; return m; }
  function end(s, tt, into = null) {
    if (!s) return; s.alive = false; const t = now();
    for (const b of s.buses) fade(b.gain, b.gain.value, 0, t, tt);
    if (into) for (const v of s.voices) { const m = nearest(v.m, into); if (m === v.m) continue;          // voice-lead the fade into the new chord
      for (const x of v.oscs) { const f = x.frequency; if (f.cancelAndHoldAtTime) f.cancelAndHoldAtTime(t); else { f.cancelScheduledValues(t); f.setValueAtTime(f.value, t); } f.setTargetAtTime(mid(m), t + 0.15, tt * 0.22); } }
    s.srcs.forEach((o) => o.stop(t + tt + 0.2));
  }
  function route(s, node, dry, hall, echo = 0) { [dry, hall, echo].forEach((a, k) => { if (!a) return; const g = ac.createGain(); g.gain.value = a; node.connect(g); g.connect(s.buses[k]); }); }
  // sustained sources are tracked on the scene and stopped with it; one-shots stop themselves
  function osc(s, type, f, t, stopAt) { const o = ac.createOscillator(); o.type = type; o.frequency.value = f; o.start(t); if (stopAt) o.stop(stopAt); else s.srcs.push(o); return o; }
  function hiss(s, t, stopAt) { const b = ac.createBufferSource(); b.buffer = noise; b.loop = true; b.start(t, Math.random() * 3); if (stopAt) b.stop(stopAt); else s.srcs.push(b); return b; }
  function env(t, level, atk, dur) { const g = ac.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(level, t + atk); g.gain.exponentialRampToValueAtTime(0.0001, t + dur); return g; }
  function filt(type, f, q = 0.8) { const x = ac.createBiquadFilter(); x.type = type; x.frequency.value = f; x.Q.value = q; return x; }
  const every = (s, start, step, fn) => s.seqs.push({ at: s.t0 + start, n: 0, step, fn });

  // pad: three detuned saws a note through a low-pass that breathes; glides chord to chord
  function pad(s, chords, o) {
    const t = s.t0 + (o.delay || 0), f = filt('lowpass', o.cut, o.q ?? 0.9);
    if (o.sweep) { f.frequency.setValueAtTime(o.cut, t); f.frequency.exponentialRampToValueAtTime(o.sweep, t + o.sweepT); }
    const lfo = osc(s, 'sine', o.lfo ?? 0.07, t), lg = ac.createGain(); lg.gain.value = o.cut * (o.depth ?? 0.4); lfo.connect(lg); lg.connect(f.frequency);
    const n = chords[0].length * 3, g = ac.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(o.level / Math.sqrt(n), t + (o.attack ?? 2.5)); f.connect(g); route(s, g, 1, o.hall ?? 0.7);
    const vo = chords[0].map((m) => ({ m, oscs: [-1, 0, 1].map((k) => { const x = osc(s, 'sawtooth', mid(m), t); x.detune.value = k * (o.detune ?? 8); x.connect(f); return x; }) }));
    s.voices.push(...vo); s.chord0 = s.chord0 || chords[0];
    if (chords.length > 1) every(s, (o.delay || 0) + o.period, o.period, (tt, i) => { const ch = chords[(i + 1) % chords.length]; vo.forEach((v, j) => { v.m = ch[j]; v.oscs.forEach((x) => x.frequency.setTargetAtTime(mid(ch[j]), tt, 0.4)); }); });
  }
  function sub(s, m, level) { const t = s.t0, g = ac.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(level, t + 3); osc(s, 'sine', mid(m), t).connect(g); route(s, g, 1, 0); }
  // choir: saws through vowel formants, with vibrato and a slow breath
  const VOWEL = { ah: [[730, 1], [1090, 0.5], [2440, 0.2]], oo: [[300, 1], [870, 0.35], [2240, 0.1]] };
  function choir(s, notes, vowel, level, attack = 3.5) {
    const t = s.t0, g = ac.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(level, t + attack); route(s, g, 0.45, 1.3);
    const br = osc(s, 'sine', 0.11, t), bg = ac.createGain(); bg.gain.value = level * 0.45; br.connect(bg); bg.connect(g.gain);
    const forms = VOWEL[vowel].map(([fr, a]) => { const bp = filt('bandpass', fr, 8), ga = ac.createGain(); ga.gain.value = a * 4; bp.connect(ga); ga.connect(g); return bp; });
    notes.forEach((m, i) => { const vib = osc(s, 'sine', 4.4 + i * 0.6, t), vg = ac.createGain(); vg.gain.value = 10; vib.connect(vg);
      s.voices.push({ m, oscs: [-7, 7].map((det) => { const x = osc(s, 'sawtooth', mid(m), t); x.detune.value = det; vg.connect(x.detune); forms.forEach((bp) => x.connect(bp)); return x; }) }); });
  }
  // bell: two-operator FM, bright at the strike and dulling as it rings
  function bell(s, m, t, level, dur = 5, ratio = 3.5) {
    const f = mid(m), car = osc(s, 'sine', f, t, t + dur), mod = osc(s, 'sine', f * ratio, t, t + dur), mg = ac.createGain();
    mg.gain.setValueAtTime(f * 2.4, t); mg.gain.exponentialRampToValueAtTime(f * 0.04, t + dur * 0.7); mod.connect(mg); mg.connect(car.frequency);
    const g = env(t, level, 0.004, dur); car.connect(g); route(s, g, 0.6, 1, 0.3);
  }
  // glass: a sine and a quiet octave, short, fed hard into the echo
  function glass(s, m, t, level, echo = 0.7, dur = 2.4) { const g = env(t, level, 0.008, dur); osc(s, 'sine', mid(m), t, t + dur + 0.1).connect(g); const g2 = env(t, level * 0.3, 0.004, 0.9); osc(s, 'triangle', mid(m + 12), t, t + 1).connect(g2); g2.connect(g); route(s, g, 0.5, 0.9, echo); }
  const arp = (s, notes, step, level, start = 1) => every(s, start, step, (tt, i) => glass(s, notes[i % notes.length], tt, level * (i % notes.length ? 1 : 1.3)));
  // heartbeat: lub-dub, a pitch-dropping thump with enough overtone to be felt on a phone
  function thump(s, t, level) { const o = osc(s, 'triangle', 90, t, t + 0.5); o.frequency.exponentialRampToValueAtTime(42, t + 0.3); const g = env(t, level, 0.005, 0.45); o.connect(g); route(s, g, 1, 0.25); }
  const pulse = (s, step, level, start = 0.5) => every(s, start, step, (tt) => { thump(s, tt, level); thump(s, tt + 0.21, level * 0.55); });
  // wind (or rain, high and steady): looped noise through a band-pass that wanders
  function wind(s, level, centre, q = 1.2, rate = 0.09) {
    const t = s.t0, bp = filt('bandpass', centre, q), g = ac.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(level, t + 3);
    const w = osc(s, 'sine', rate, t), wg = ac.createGain(); wg.gain.value = centre * 0.45; w.connect(wg); wg.connect(bp.frequency);
    hiss(s, t).connect(bp); bp.connect(g); route(s, g, 1, 0.5);
  }
  function crackle(s, level) { every(s, 0.3, 0.2, (tt) => { if (Math.random() < 0.45) return; const b = hiss(s, tt, tt + 0.03), bp = filt('bandpass', 1800 + Math.random() * 2400, 1.2), g = env(tt, level * (0.4 + Math.random()), 0.003, 0.025); b.connect(bp); bp.connect(g); route(s, g, 1, 0.3); }); }
  // gong: inharmonic FM on a low A, a sub that drops away under it, and a thud of noise
  function gong(s, t, level) {
    const car = osc(s, 'sine', 55, t, t + 10), mod = osc(s, 'sine', 55 * 1.41, t, t + 10), mg = ac.createGain(); mg.gain.setValueAtTime(260, t); mg.gain.exponentialRampToValueAtTime(8, t + 7); mod.connect(mg); mg.connect(car.frequency);
    const g = env(t, level, 0.01, 9.5); car.connect(g); route(s, g, 0.9, 1.1);
    const sb = osc(s, 'sine', 90, t, t + 3), sg = env(t, level * 0.9, 0.01, 2.8); sb.frequency.exponentialRampToValueAtTime(26, t + 2.5); sb.connect(sg); route(s, sg, 1, 0.2);
    const nb = hiss(s, t, t + 0.6), lp = filt('lowpass', 400), ng = env(t, level * 0.5, 0.003, 0.5); nb.connect(lp); lp.connect(ng); route(s, ng, 1, 0.8);
  }
  const bells = (s, start, step, notes, level, ratio) => every(s, start, step, (tt, i) => bell(s, notes[i % notes.length], tt, level, 5.5, ratio));

  const MAKE = {
    // loading: a low D and an open fifth in the wind, a far bell now and then
    loading: (s) => { pad(s, [[38, 45, 50]], { cut: 480, level: 0.16, attack: 3 }); wind(s, 0.05, 350); bells(s, 3, 7.5, [62, 57], 0.03, 2.76); },
    // the Kindling: awe. D minor walking down to Bb and G minor; a slow glass figure, a bell, the fire
    kindling: (s) => { pad(s, [[38, 45, 53, 57, 62], [34, 46, 53, 58, 62], [31, 43, 50, 58, 62], [38, 45, 53, 57, 62]], { cut: 900, level: 0.2, period: 5.5 });
      sub(s, 26, 0.07); choir(s, [62, 69], 'oo', 0.05, 4); arp(s, [74, 77, 81, 76, 74, 72], 0.85, 0.05, 1.2); bells(s, 0.4, 6.8, [62, 69], 0.05); crackle(s, 0.035); },
    // the Empire: majesty with a pulse under it. Bb, G minor, Eb; the heartbeat is the legion's step
    empire: (s) => { pad(s, [[34, 46, 53, 58, 62], [31, 43, 50, 58, 62], [39, 46, 51, 55, 63], [34, 46, 53, 58, 62]], { cut: 1200, level: 0.22, period: 4.8 });
      sub(s, 34, 0.07); choir(s, [58, 65], 'ah', 0.055, 3); pulse(s, 0.8, 0.3); arp(s, [70, 74, 77, 82, 77, 74], 0.42, 0.03, 1.6); },
    // the Fall, and the three hundred years after it: a gong and a sub dropping out, then a cold D / E♭ cluster, wind, lonely glass
    fall: (s) => { gong(s, s.t0 + 0.05, 0.5); pad(s, [[50, 51, 57]], { cut: 450, depth: 0.3, level: 0.14, attack: 4, delay: 2.5, detune: 5 });
      wind(s, 0.06, 500, 1.5, 0.06); every(s, 4, 2.9, (tt, i) => glass(s, [74, 75, 69, 74, 63][i % 5], tt, 0.04)); },
    // Thornwick: the release. D major, warm, G and B minor and A, the glass figure turned major, bells
    thornwick: (s) => { pad(s, [[38, 45, 54, 57, 62], [38, 47, 55, 59, 62], [35, 47, 54, 59, 62], [33, 45, 52, 57, 61]], { cut: 1300, level: 0.2, period: 5 });
      choir(s, [66, 69], 'ah', 0.045, 3); arp(s, [74, 78, 81, 86, 81, 78], 0.6, 0.035, 1.5); bells(s, 0.3, 5, [74, 81], 0.05); },
  };
  function pump(h) { if (!cur || !cur.alive) return; const lim = now() + h; for (const q of cur.seqs) while (q.at < lim) { q.fn(q.at, q.n++); q.at += q.step; } }
  // (the E♭ into Thornwick is a passing note: short and nearly dry, so it resolves rather than rings)
  function chime(card) { const t = now() + 0.05; for (const [m, d, kind, lv] of CHIMES[card] || []) if (kind === 'bell') bell(fx, m, t + d, lv, 5.5); else if (card === 'thornwick' && m === 75) glass(fx, m, t + d, lv, 0.05, 0.8); else glass(fx, m, t + d, lv, 0.35); }
  /** @param {string} id */
  function play(id) { if (!ac || id === cueId || !MAKE[id]) return; const fade = FADE[id], old = cur; cur = scene(fade); cueId = id; MAKE[id](cur); end(old, fade, id === 'fall' ? null : cur.chord0); pump(0.3); }
  return {
    /** start the audio (call from a tap: browsers only allow sound after a gesture); ctx: an OfflineAudioContext, for tests */
    init,
    /** schedule the repeating figures up to h seconds ahead (the live scheduler does this itself) */
    pump,
    /** play a cue by name (CUES); the same cue again carries on */
    play,
    /** a card starts: its chime, then its cue @param {string} card @param {string} music */
    card(card, music) { if (!ac) return; chime(card); play(music); },
    /** fade the music out */
    stop(fade = 2.4) { if (!ac || !cur) return; end(cur, fade); cur = null; cueId = null; },
    /** @param {boolean} m */
    setMuted(m) { muted = m; if (ac) out.gain.setTargetAtTime(m ? 0 : 0.9, now(), 0.15); },
    get muted() { return muted; },
    get cue() { return cueId; },
  };
}
