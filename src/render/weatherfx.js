// @ts-check
// weatherfx.js — how the weather looks (sim/weather.js says what it is). The owner (2026-10-03): rain, fog and snow
// "not overly visually intrusive". So it's mostly in the light, and only a little on the screen:
//   light   rain and fog take some of the sun, soften the shadows and the colour, and thicken the haze; snow cools
//           and lifts the ambient a touch. At full strength the light loses at most a third.
//   screen  rain: sparse fine streaks, faint; snow: a few slow flakes that drift; fog: a soft drifting veil,
//           thickest toward the top of the screen (the distance) and thin over the party, at the bottom
// Outdoors only (underground there's no sky), and never on the dev Stage. The particles are placed by a hash of their
// index and the clock, anchored to the world (they pass by as the camera moves), so nothing is stored or allocated
// per frame. ?dev&weather=rain|fog|snow|clear[:0..1] holds a weather for captures.

import { weatherAt } from '../sim/weather.js';

/** @type {{ kind: import('../sim/weather.js').WeatherKind, k: number } | null} */
let hold = null;
/** dev: hold a weather (null: follow the clock) @param {string | null} v e.g. 'rain', 'fog:0.6' */
export function holdWeather(v) {
  if (!v) { hold = null; return; }
  const [kind, k] = String(v).split(':');
  hold = ['clear', 'fog', 'rain', 'snow'].includes(kind) ? { kind: /** @type {any} */ (kind), k: kind === 'clear' ? 0 : Math.max(0, Math.min(1, k === undefined ? 1 : +k)) } : null;
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
