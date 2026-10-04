// @ts-check
// weatherfx.js — how the weather looks (sim/weather.js says what it is). The owner (2026-10-03): rain, fog, snow and
// wind, "not overly visually intrusive". So it's mostly in the light, and only a little on the screen:
//   light   rain and fog take some of the sun, soften the shadows and the colour, and thicken the haze; snow cools
//           and lifts the ambient a touch; wind clears the air (less haze, a touch more colour). At full strength the
//           light loses at most a third.
//   screen  rain: sparse fine streaks, faint; snow: a few slow flakes that drift; wind: long thin gust lines that come
//           and go, and a few leaves; fog: a soft drifting veil, thickest toward the top of the screen (the distance)
//           and thin over the party, at the bottom
// Outdoors only (underground there's no sky), and never on the dev Stage. The particles are placed by a hash of their
// index and the clock, anchored to the world (they pass by as the camera moves), so nothing is stored or allocated
// per frame. ?dev&weather=rain|fog|snow|wind|clear[:0..1] holds a weather for captures.

import { weatherAt } from '../sim/weather.js';

/** @type {{ kind: import('../sim/weather.js').WeatherKind, k: number } | null} */
let hold = null;
/** dev: hold a weather (null: follow the clock) @param {string | null} v e.g. 'rain', 'fog:0.6' */
export function holdWeather(v) {
  if (!v) { hold = null; return; }
  const [kind, k] = String(v).split(':');
  hold = ['clear', 'fog', 'rain', 'snow', 'wind'].includes(kind) ? { kind: /** @type {any} */ (kind), k: kind === 'clear' ? 0 : Math.max(0, Math.min(1, k === undefined ? 1 : +k)) } : null;
}
/** the weather now, for any reader (the renderer, the sound, the HUD) @param {any} sim */
export function weatherNow(sim) {
  if (hold) return hold;
  const w = sim.world;
  if (!w || w.kind === 'dungeon') return { kind: 'clear', k: 0 };
  return weatherAt(sim.seed >>> 0, sim.state.t || 0, w.region || 'vale');
}

const h1 = (i, s) => { let x = Math.imul(i ^ s, 0x9e3779b1); x ^= x >>> 15; x = Math.imul(x, 0x85ebca6b); x ^= x >>> 13; return (x >>> 0) / 4294967296; };

/** how bright the light is, 0 (night) .. 1 (day), from the sky's sun (daylight.js LOOKS: day 2.76, dusk 1.73, night 1.25)
 * @param {import('./daylight.js').Sky} sky */
export const lightOf = (sky) => Math.max(0, Math.min(1, (sky.sun[0] + sky.sun[1] + sky.sun[2] - 1.25) / 1.51));

/** grade the light for the weather (outdoors), in place
 * @param {import('./daylight.js').Sky} sky @param {{ kind: string, k: number }} w */
export function weatherLight(sky, w) {
  const k = w.k; if (!k) return;
  if (w.kind === 'wind') { sky.haze *= 1 - 0.35 * k; sky.sat *= 1 + 0.05 * k; return; }   // the wind clears the air
  const sun = w.kind === 'rain' ? 0.32 : w.kind === 'fog' ? 0.24 : 0.16, sat = w.kind === 'snow' ? 0.22 : 0.16;
  for (let i = 0; i < 3; i++) sky.sun[i] *= 1 - sun * k;
  if (w.kind === 'snow') { sky.amb[0] *= 1 + 0.04 * k; sky.amb[1] *= 1 + 0.06 * k; sky.amb[2] *= 1 + 0.12 * k; }   // a cold, even light
  else for (let i = 0; i < 3; i++) sky.amb[i] *= 1 - 0.06 * k;
  // (overcast softens the shadows a little; the haze, an additive violet glow, thickens only a touch: at night more of
  // either lit the dark, and the owner wants the dusk kept)
  sky.sat *= 1 - sat * k; sky.lift = Math.min(1, sky.lift + 0.15 * k); sky.bloom *= 1 - 0.3 * k;
  sky.haze *= 1 + (w.kind === 'fog' ? 0.3 : 0.1) * k;
}

/** draw the weather over the world (the 2D overlay, device px)
 * @param {CanvasRenderingContext2D} c @param {{ kind: string, k: number }} w
 * @param {{ vw: number, vh: number, S: number, camX: number, camY: number, now: number, light: number }} o
 *   camX / camY: the camera in native px (the particles move with the world); now: ms; light: how bright the light is
 *   now, 0 (night) .. 1 (day) (lightOf: the fog's colour and the particles follow it, through dawn and dusk too) */
export function drawWeather(c, w, o) {
  const k = w.k; if (!k) return;
  const { vw, vh, S, now } = o, t = now / 1000, area = (vw * vh) / (390 * 844 * 4), night = o.light < 0.35;    // (a phone at DPR 2 is 1)
  if (w.kind === 'rain') {
    // fine streaks, a little slanted, fast; faint enough that the world reads through them
    const n = Math.round(90 * k * Math.max(0.6, area)), L = 8 * S, slant = 0.18, H = vh + L, W = vw + H * slant;
    c.strokeStyle = night ? 'rgba(170,185,215,0.22)' : 'rgba(200,210,228,0.28)'; c.lineWidth = Math.max(1, S * 0.32);
    c.beginPath();
    for (let i = 0; i < n; i++) {
      const sp = (0.9 + 0.3 * h1(i, 7)) * vh * 1.6, y = ((h1(i, 3) * H + t * sp) % H + H) % H - L;
      const x = (((h1(i, 5) * W - o.camX * S - y * slant) % W) + W) % W - H * slant * 0.5;
      c.moveTo(x, y); c.lineTo(x - L * slant, y + L);
    }
    c.stroke();
  } else if (w.kind === 'snow') {
    // a few slow flakes, drifting side to side
    const n = Math.round(75 * k * Math.max(0.6, area)), H = vh + 8, W = vw + 16;
    c.fillStyle = night ? 'rgba(210,218,235,0.6)' : 'rgba(240,242,248,0.72)';
    for (let i = 0; i < n; i++) {
      const sp = (0.05 + 0.04 * h1(i, 7)) * vh, sz = Math.round((h1(i, 11) < 0.7 ? 1 : 1.5) * Math.max(2, S * 0.9));
      const y = ((h1(i, 3) * H + t * sp - o.camY * S) % H + H) % H - 4;
      const x = (((h1(i, 5) * W - o.camX * S + Math.sin(t * (0.6 + h1(i, 13)) + i) * 9 * S / 3) % W) + W) % W - 8;
      c.fillRect(x, y, sz, sz);
    }
  } else if (w.kind === 'wind') {
    // the owner (2026-10-03): "longer intermittent string like streaks". Gust lines: each a long, thin, gently waving
    // thread that draws itself across the screen on the wind and is gone, a few at a time with gaps between (each slot
    // is seen for half its own cycle); pale, brightest at the head, fading to nothing at the tail
    const gust = 0.75 + 0.25 * Math.sin(t * 0.7) + 0.15 * Math.sin(t * 1.9);
    const ns = Math.round(10 * k * Math.max(0.7, area)), W = vw * 1.15, SEG = 16;
    c.lineWidth = Math.max(2.5, S * 1.2); c.lineCap = 'round';
    const rgb = night ? '190,200,220' : '236,240,244', a0 = (night ? 0.36 : 0.55) * Math.min(1, 0.4 + 0.6 * k);
    for (let i = 0; i < ns; i++) {
      const per = 3.2 + 2.6 * h1(i, 31), ph = (t / per + h1(i, 33)) % 1, cyc = Math.floor(t / per + h1(i, 33));
      if (ph > 0.5) continue;                                                   // between gusts: not there
      const u = ph / 0.5, ri = h1(i * 131 + cyc, 35), rj = h1(i * 131 + cyc, 37);   // (each cycle somewhere new)
      const len = (0.4 + 0.3 * ri) * vw, travel = (0.7 + 0.35 * rj) * vw * gust;
      const head = travel * Math.min(1, u * 1.25), tail = Math.max(0, head - len * Math.min(1, u * 2.2)) + travel * Math.max(0, u - 0.6) * 1.6;
      if (head - tail < 2) continue;
      const x0 = (((ri * W - o.camX * S * 0.8) % W) + W) % W - vw * 0.45, y0 = (((rj * 0.8 + 0.05) * vh - o.camY * S * 0.8) % vh + vh) % vh;
      const amp = (0.005 + 0.007 * h1(i, 39)) * vh, wl = (0.05 + 0.04 * h1(i, 41)) * vw, wp = t * 2.4 + i, env = Math.min(1, 2.5 * Math.sin(Math.PI * u));
      const ay = (d) => y0 + d * 0.06 + amp * Math.sin(d / wl + wp);           // (a little downhill, and waving)
      let px = x0 + tail, py = ay(tail);
      for (let j = 1; j <= SEG; j++) {
        const d = tail + ((head - tail) * j) / SEG, x = x0 + d, y = ay(d);
        c.strokeStyle = `rgba(${rgb},${(a0 * env * Math.sqrt(j / SEG)).toFixed(3)})`;
        c.beginPath(); c.moveTo(px, py); c.lineTo(x, y); c.stroke(); px = x; py = y;
      }
    }
    // and a few leaves, blown across side-on: each tumbles (its width flickers with its spin) and rides the gusts
    const n = Math.round(10 * k * Math.max(0.6, area)), LW = vw + 40, H = vh + 40, LEAF = ['168,120,58', '138,92,44', '112,122,60', '150,72,40'];
    for (let i = 0; i < n; i++) {
      const sp = (0.22 + 0.22 * h1(i, 7)) * vw * gust, sz = Math.max(3, S * (1.8 + 0.9 * h1(i, 11)));   // (a native leaf is ~2 px: smaller ones were lost in the ground's own flecks)
      const x = (((h1(i, 5) * LW + t * sp - o.camX * S) % LW) + LW) % LW - 20;
      const y = (((h1(i, 3) * H + t * 0.025 * vh + Math.sin(t * (1.3 + h1(i, 13)) + i) * 10 * S / 3 - o.camY * S) % H) + H) % H - 20;
      const spin = Math.abs(Math.cos(t * (2.5 + 2 * h1(i, 17)) + i));
      c.fillStyle = `rgba(${LEAF[i % 4]},${night ? 0.6 : 0.9})`; c.fillRect(x, y, Math.max(1, sz * (0.3 + 0.7 * spin)), Math.max(1, sz * 0.55));
    }
  } else if (w.kind === 'fog') {
    // a veil, thickest at the top (the distance), thin over the party at the bottom; soft banks drift through it
    // the fog takes the light's own level: pale grey by day, near the dark's own tone at night (a grey veil over the
    // night lit it: +97 % mean luma), and thinner in the dark
    const L = Math.max(0, Math.min(1, o.light)), f = 0.16 + 0.84 * L, col = `${Math.round(150 * f)},${Math.round(156 * f)},${Math.round(172 * f)}`, m = 0.7 + 0.3 * L;
    const g = c.createLinearGradient(0, 0, 0, vh);
    g.addColorStop(0, `rgba(${col},${(0.24 * k * m).toFixed(3)})`); g.addColorStop(0.55, `rgba(${col},${(0.1 * k * m).toFixed(3)})`); g.addColorStop(1, `rgba(${col},${(0.04 * k * m).toFixed(3)})`);
    c.fillStyle = g; c.fillRect(0, 0, vw, vh);
    const banks = 5, R = Math.max(vw, vh) * 0.45;
    for (let i = 0; i < banks; i++) {
      const x = (((h1(i, 21) * (vw + 2 * R) + t * (6 + 5 * h1(i, 23)) * S - o.camX * S * 0.6) % (vw + 2 * R)) + (vw + 2 * R)) % (vw + 2 * R) - R;
      const y = (0.12 + 0.55 * h1(i, 25)) * vh, a = 0.09 * k * m * (1 - y / vh);
      const rg = c.createRadialGradient(x, y, 0, x, y, R);
      rg.addColorStop(0, `rgba(${col},${a.toFixed(3)})`); rg.addColorStop(1, `rgba(${col},0)`);
      c.fillStyle = rg; c.fillRect(x - R, y - R, 2 * R, 2 * R);
    }
  }
}
