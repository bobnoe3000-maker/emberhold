// outdoorpaint.js — per-pixel ground painter for the surface scenes (town and
// overland). The sim's outdoor.js describes the ground as continuous features;
// here each G-buffer pixel samples groundAt() at its exact world point, so river
// banks, road verges and plaza edges are smooth curves rather than tile steps.
// Same art rules as the dungeon tile styles: structure over noise, few tones per
// material, flat or low-frequency normals, noise only at low frequency or per cell.

import { groundAt, G } from '../sim/outdoor.js';
import { hash2, fbm } from '../sim/rng.js';
import { ELIT } from './palette.js';
import { norm3 } from './gsprite.js';
import { TILE_STYLES, N_UP } from './tilestyles.js';

const H = (a, b, s) => hash2(a | 0, b | 0, s | 0);
const mix = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
const mul = (a, k) => [a[0] * k, a[1] * k, a[2] * k];
const frac = (v) => v - Math.floor(v);
const N_TUFT = norm3(0, 0.55, 0.83), N_WATER = norm3(0, 0.36, 0.93);
const FLOWERS = [[168, 150, 80], [160, 150, 178], [150, 70, 66], [176, 170, 150]];
const R = { g: ELIT.grass, d: ELIT.dirt, s: ELIT.street, w: ELIT.river, m: ELIT.mud, f: ELIT.wheat };
const OUT = { c: null, n: N_UP, e: 0 };
const ret = (c, n = N_UP, e = 0) => { OUT.c = c; OUT.n = n; OUT.e = e; return OUT; };

// Grass: three broad tones from low-frequency noise, per-tile tufts (a little
// 3-blade 'W'), rare flowers. rx/ry = pixel offset from the tile's top vertex.
function grass(o, gx, gy, tx, ty, rx, ry, dark = 0) {
  const Rg = (o.region && ELIT['grass_' + o.region]) || R.g;
  // three tones blended smoothly by the noise, with a little dither (critic pass 11a: hard thresholds drew
  // camouflage blotches that, in the brighter day, read before anything placed on them)
  const n = fbm(gx * 0.06, gy * 0.06, o.seed + 41) + dark + (H(tx * 7 + rx, ty * 7 + ry, o.seed + 3) - 0.5) * 0.05;
  const k = Math.min(1, Math.max(0, (n - 0.32) / 0.34));
  let c = k < 0.5 ? mix(Rg[1], Rg[2], k * 2) : mix(Rg[2], Rg[3], k * 2 - 1);
  const h = H(tx, ty, o.seed + 5);
  if (h > 0.5) {                                          // tuft centre in screen px within the diamond
    const tu = 0.3 + 0.4 * H(tx, ty, o.seed + 6), tv = 0.3 + 0.4 * H(ty, tx, o.seed + 7);
    const cx = (tu - tv) * 8, cy = (tu + tv) * 4, dx = Math.round(rx - cx), dy = Math.round(ry - cy);
    if ((dx === -2 || dx === 2) && dy >= -1 && dy <= 0) return ret(dy === -1 ? Rg[4] : Rg[3], N_TUFT);
    if (dx === 0 && dy >= -2 && dy <= 0) return ret(dy === -2 ? Rg[4] : Rg[3], N_TUFT);
    if (dy === 1 && Math.abs(dx) <= 2) return ret(Rg[0]);                     // the tuft's own little shadow
  }
  if (h < 0.06) {                                         // a flower
    const fu = 0.3 + 0.4 * H(tx, ty, o.seed + 8), fv = 0.3 + 0.4 * H(ty, tx, o.seed + 9);
    const dx = Math.round(rx - (fu - fv) * 8), dy = Math.round(ry - (fu + fv) * 4);
    if (dx === 0 && dy === 0) return ret(FLOWERS[(h * 1000 | 0) % FLOWERS.length], N_TUFT);
    if (dx === 0 && dy === 1) return ret(Rg[1]);
  }
  return ret(c);
}

// Dirt road: two tones, a groove per wheel, a grassy crown on country roads, pebbles, a worn verge. Critic pass 10:
// each rut was a dark line and a half-tone one (four stripes a road, like rails); a hard edge stepped on the
// diagonals. Now one soft groove per wheel; a half-tile verge of worn grass, dithered into the meadow; a track (the
// spurs to the mill, the chapel and the camp) is one worn band without ruts; aprons and bends are packed earth.
function dirt(o, q, gx, gy, tx, ty, rx, ry) {
  const n = fbm(gx * 0.12, gy * 0.12, o.seed + 43);
  let c = n < 0.5 ? R.d[2] : R.d[3];
  const al = Math.abs(q.lat), vt = 1 - 0.5 / Math.max(1, q.hw);
  if (q.t > vt) {                                                            // the verge
    const k = (q.t - vt) / (1 - vt);
    return H(Math.floor(gx * 8), Math.floor(gy * 8), o.seed + 61) < k * k ? grass(o, gx, gy, tx, ty, rx, ry, -0.06) : ret(mix(c, R.g[1], 0.5));
  }
  if (q.track) { if (al < q.hw * 0.5) c = mix(c, R.d[4], 0.22); }        // a worn band down the middle
  else if (q.cap) { /* bends' ends, joins, aprons: packed earth */ }
  else if (Math.abs(al - q.hw * 0.42) < 0.26) c = mix(c, R.d[1], 0.75);    // the groove
  else if (o.kind === 'overland' && al < 0.45 && q.hw > 2.2) return grass(o, gx, gy, tx, ty, rx, ry, -0.12);   // crown
  const pc = Math.floor(gx * 2.2), pr = Math.floor(gy * 2.2);
  if (H(pc, pr, o.seed + 47) > 0.9 && frac(gx * 2.2) > 0.4 && frac(gx * 2.2) < 0.62 && frac(gy * 2.2) > 0.4 && frac(gy * 2.2) < 0.62) return ret(R.d[4], norm3(0, 0.45, 0.88));
  return ret(c);
}

// Cobbles: the dungeon's catacomb-cobble painter on a warmer street stone, with a kerb.
function cobble(o, q, gx, gy) {
  const r = TILE_STYLES.cobble.floor({ gx: gx * 1.25, gy: gy * 1.25, fr: R.s, seed: o.seed + 51 });
  if (q.hw && q.t > 0.9) return ret(R.s[1]);                                  // kerb line on streets
  return ret(r.c, r.n || N_UP);
}

// River: depth by distance from the bank, broken by slow noise; thin dashes along the current; lighter shallows at
// the edge; rare glints. Critic pass 10: three tones at fixed fractions drew canal stripes parallel to the banks, a
// pale foam line outlined it, and the flow streaks ran across the current in a cell pattern, like ice.
function water(o, q, gx, gy) {
  const w = R.w, t = q.t + (fbm(gx * 0.07, gy * 0.07, o.seed + 55) - 0.5) * 0.4;
  let c = t < 0.45 ? w[1] : t < 0.8 ? w[2] : w[3];
  if (q.t > 0.9) return ret(mix(w[3], R.m[3], 0.3), N_WATER);               // the shallows
  const lane = frac(q.lat / 1.8 + fbm(gx * 0.1, gy * 0.1, o.seed + 53) * 0.6), dash = frac(q.along * 0.09 + H(Math.floor(q.lat / 1.8 + 64), 0, o.seed + 59));
  if (q.t < 0.8 && Math.abs(lane - 0.5) < 0.05 && dash < 0.3) c = mix(c, w[4], 0.4);
  const gc = Math.floor(gx * 1.5), gr = Math.floor(gy * 1.5);
  const e = t < 0.7 && H(gc, gr, o.seed + 57) > 0.985 && frac(gx * 1.5) < 0.2 && frac(gy * 1.5) < 0.2 ? 8 : 0;
  return ret(c, N_WATER, e);
}

function bank(o, q, gx, gy, tx, ty, rx, ry) {
  if (q.t < 0.45) return ret(R.m[3], N_WATER);                                 // wet mud
  if (q.t < 0.8) return ret(R.m[2]);
  return grass(o, gx, gy, tx, ty, rx, ry, -0.2);
}

// Wheat: rows across the field's axis, furrows between, lit crests.
function field(o, q, gx, gy, tx, ty, rx, ry) {
  if (q.t < 0.6) return grass(o, gx, gy, tx, ty, rx, ry, -0.1);
  const r = frac(q.fx / 1.5);
  if (r < 0.3) return ret(R.d[1]);
  const n = fbm(gx * 0.1, gy * 0.1, o.seed + 59);
  if (r > 0.5 && r < 0.62) return ret(n > 0.55 ? R.f[4] : R.f[3], norm3(0, 0.5, 0.86));
  return ret(n > 0.5 ? R.f[2] : R.f[3]);
}

// Paint one G-buffer pixel of outdoor ground. Returns a shared { c, n, e }.
export function paintOutdoor(o, gx, gy, tx, ty, rx, ry) {
  const q = groundAt(o, gx, gy);
  switch (q.g) {
    case G.WATER: return water(o, q, gx, gy);
    case G.BANK: return bank(o, q, gx, gy, tx, ty, rx, ry);
    case G.DIRT: return dirt(o, q, gx, gy, tx, ty, rx, ry);
    case G.COBBLE: return cobble(o, q, gx, gy);
    case G.FIELD: return field(o, q, gx, gy, tx, ty, rx, ry);
    default: return grass(o, gx, gy, tx, ty, rx, ry);
  }
}
