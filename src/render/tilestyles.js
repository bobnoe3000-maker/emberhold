// tilestyles.js — pluggable floor / wall painters for the G-buffer bake.
//
// The original terrain look ("classic", still inlined in renderer.js) chose every
// pixel's ramp step AND its normal from fbm noise — lively, but it reads as
// grain and sparkles under dynamic light. These styles paint from STRUCTURE
// instead (slabs, grout, courses, flat planes), with one floor ramp and one wall
// ramp per theme ("less colour"), flat or low-frequency normals, and noise only
// at tile/slab granularity. All are pure functions of world coordinates, so the
// margin-cached bake stays deterministic.
//
// floor(c) → { c: [r,g,b], n?: [x,y,z], e?: glowId }   c = FloorCtx (see renderer)
// wall(c)  → { c, n?, e? }   n is a tweak ADDED to the face normal
// cap(c)   → floor painter for the top of wall tiles (defaults to floor with wall ramp)

import { hash2, fbm, vnoise } from '../sim/rng.js';
import { norm3 } from './gsprite.js';

export const N_UP = [0, 0.30, 0.95];            // the flat-floor normal the renderer has always used
const H = (a, b, s) => hash2(a | 0, b | 0, s | 0);
const mix = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
const mul = (a, k) => [a[0] * k, a[1] * k, a[2] * k];
const frac = (v) => v - Math.floor(v);
const ZH = 6;                                   // one wall course per elevation level

// ─── 1. FLAGSTONE — cut slabs in a running bond, 1px grout, bevelled edges;
// walls are ashlar blocks, one course per level, staggered half a block.
const flagstone = {
  label: 'Flagstone keep',
  floor(c) {
    const row = Math.floor(c.gy), off = (row & 1) ? 1 : 0, sxl = Math.floor((c.gx + off) / 2);
    const fx = ((c.gx + off) / 2 - sxl) * 2, fy = c.gy - row;          // 0..2 along the slab, 0..1 across
    const r = c.fr;
    if (fx < 0.13 || fy < 0.13) return { c: r[0] };                     // grout on the slab's low edges only → 1px lines
    const base = H(sxl, row, c.seed) > 0.55 ? r[3] : r[2];
    if (fx < 0.26 || fy < 0.26) return { c: mix(base, r[4], 0.35) };   // lit bevel
    if (fx > 1.87 || fy > 0.87) return { c: mul(base, 0.8) };          // shaded bevel
    return { c: base };
  },
  wall(c) {
    const r = c.wr;
    if (c.k === 0) return { c: r[4] };                                  // cap rim
    if (c.hz % ZH === 0) return { c: r[0] };                            // bed joint
    const course = Math.floor(c.hz / ZH), a = c.along * 1 + (course & 1) * 0.5, bi = Math.floor(a);
    if (frac(a) < 0.13) return { c: r[0] };                             // head joint
    const base = H(bi, course, c.seed + 5) > 0.5 ? r[2] : r[3];
    return { c: (c.hz % ZH === ZH - 1) ? mix(base, r[4], 0.3) : base };   // lit top edge of each block
  },
};

// ─── 2. LOW-POLY — flat planes that match the KayKit characters: one value per
// tile (two close tones), no grout; walls flat with a bright rim + base AO.
const lowpoly = {
  label: 'Low-poly planes',
  floor(c) {
    const r = c.fr, t = H(c.tx, c.ty, c.seed) > 0.5 ? 0.6 : 0;
    return { c: mix(r[2], r[3], t) };
  },
  wall(c) {
    const r = c.wr;
    if (c.k === 0) return { c: r[4] };
    if (c.k === 1) return { c: r[3] };
    const toBase = c.h - 1 - c.k;
    return { c: toBase < 3 ? mix(r[1], r[2], toBase / 3) : r[2] };
  },
};

// ─── 3. TEMPLE — 2×2-tile checkerboard of polished flags with fine joints;
// walls get pilasters every two tiles, a trim band and a dark plinth.
const temple = {
  label: 'Temple checker',
  floor(c) {
    const r = c.fr, u = frac(c.gx), v = frac(c.gy);
    const dark = ((Math.floor(c.gx / 2) + Math.floor(c.gy / 2)) & 1) === 1;
    const base = dark ? r[1] : r[3];
    if (u < 0.12 || v < 0.12) return { c: mul(base, 0.72) };           // fine joint, same family
    if ((u < 0.24 || v < 0.24) && !dark) return { c: mix(base, r[4], 0.3) };
    return { c: base };
  },
  wall(c) {
    const r = c.wr, pil = frac(c.along / 2) < 0.19;
    if (c.k === 0) return { c: r[4] };
    if (c.k === 2) return { c: r[3] };                                  // trim band under the cap
    if (c.h - c.k <= 3) return { c: r[0] };                             // plinth
    return { c: pil ? r[3] : r[2], n: pil ? [0, 0.15, 0] : undefined };
  },
};

// ─── 4. CATACOMB COBBLE — irregular Voronoi stones (~0.8 tile) with dark gaps,
// each lit on its up-screen side; walls of irregular stones, one course per level.
function cobbleCell(gx, gy, seed) {
  const S = 0.8, cx = Math.floor(gx / S), cy = Math.floor(gy / S);
  let d1 = 9, d2 = 9, id = 0, px = 0, py = 0;
  for (let j = -1; j <= 1; j++) for (let i = -1; i <= 1; i++) {
    const X = cx + i, Y = cy + j;
    const qx = (X + 0.2 + 0.6 * H(X, Y, seed)) * S, qy = (Y + 0.2 + 0.6 * H(Y, X, seed + 1)) * S;
    const d = Math.hypot(gx - qx, gy - qy);
    if (d < d1) { d2 = d1; d1 = d; id = X * 7919 + Y; px = qx; py = qy; } else if (d < d2) d2 = d;
  }
  return { gap: d2 - d1 < 0.1, id, dx: gx - px, dy: gy - py };
}
const cobble = {
  label: 'Catacomb cobble',
  floor(c) {
    const r = c.fr, s = cobbleCell(c.gx, c.gy, c.seed + 9);
    if (s.gap) return { c: r[0] };
    const base = H(s.id, 3, c.seed) > 0.5 ? r[2] : r[3];
    const col = s.dx < -0.17 ? mix(base, r[4], 0.3) : (s.dx > 0.2 || s.dy > 0.24) ? mul(base, 0.8) : base;
    return { c: col, n: norm3(s.dx * 0.6, 0.30 - s.dy * 0.5, 0.9) };
  },
  wall(c) {
    const r = c.wr;
    if (c.k === 0) return { c: r[3] };
    if (c.hz % ZH === 0) return { c: r[0] };
    const course = Math.floor(c.hz / ZH), a = c.along * (0.9 + 0.7 * H(course, 1, c.seed)) + H(course, 2, c.seed), bi = Math.floor(a);
    if (frac(a) < 0.11) return { c: r[0] };
    const base = H(bi, course, c.seed + 2) > 0.5 ? r[2] : r[3], cy = c.hz % ZH;
    return { c: cy >= ZH - 2 ? mix(base, r[4], 0.25) : cy === 1 ? mul(base, 0.8) : base, n: [0, cy >= ZH - 2 ? 0.2 : -0.1, 0] };
  },
};

// ─── 5. RUNE PLATES — big 2×2 obsidian plates with an engraved inset border;
// a few carry a glowing sigil. Walls are smooth panels whose seams sometimes glow.
const runeplate = {
  label: 'Rune plates',
  floor(c) {
    const r = c.fr, pi = Math.floor(c.gx / 2), pj = Math.floor(c.gy / 2);
    const fx = c.gx / 2 - pi, fy = c.gy / 2 - pj;
    if (fx < 0.065 || fy < 0.065) return { c: r[0] };                   // plate seam
    const inset = Math.max(Math.abs(fx - 0.5), Math.abs(fy - 0.5));
    if (inset > 0.36 && inset < 0.40) return { c: r[1] };               // engraved border channel
    if (H(pi, pj, c.seed + 17) > 0.8) {                                 // sigil: a small diamond ring
      const d = Math.abs(fx - 0.5) + Math.abs(fy - 0.5);
      if (d > 0.11 && d < 0.17) return { c: r[4], e: c.accent };
    }
    return { c: inset > 0.40 ? r[3] : r[2] };
  },
  wall(c) {
    const r = c.wr;
    if (c.k === 0) return { c: r[4] };
    const a = c.along, seam = frac(a) < 0.13;
    if (seam) return (H(Math.floor(a), 7, c.seed) > 0.7 && c.k > 2) ? { c: r[3], e: c.accent } : { c: r[0] };
    return { c: c.k < 3 ? r[3] : r[2] };
  },
};

// ─── 6. CAVERN — natural rock: broad two/three-tone regions from LOW-frequency
// noise (no per-pixel speckle) with gently undulating normals; walls are rock
// faces with vertical striations that darken toward the base.
const cavern = {
  label: 'Cavern rock',
  floor(c) {
    const r = c.fr, k = 0.32, s = c.seed + 41;
    const t = fbm(c.gx * k, c.gy * k, s);
    const col = t < 0.42 ? r[1] : t < 0.62 ? r[2] : r[3];
    const e = 0.35, gx = fbm(c.gx * k + e, c.gy * k, s) - fbm(c.gx * k - e, c.gy * k, s);
    const gy = fbm(c.gx * k, c.gy * k + e, s) - fbm(c.gx * k, c.gy * k - e, s);
    return { c: col, n: norm3(gx * 1.4, 0.30 + gy * 1.4, 0.95) };
  },
  wall(c) {
    const r = c.wr;
    if (c.k === 0) return { c: r[3] };
    const band = vnoise(c.along * 2.2, 0.5, c.seed + 3);
    let col = band < 0.35 ? r[1] : band < 0.7 ? r[2] : r[3];
    if (c.h - c.k <= 4) col = mix(r[0], col, (c.h - c.k) / 5);
    return { c: col, n: [(band - 0.5) * 0.35, 0, 0] };
  },
};

export const TILE_STYLES = { flagstone, lowpoly, temple, cobble, runeplate, cavern };
export const TILE_STYLE_KEYS = ['classic', ...Object.keys(TILE_STYLES)];

// Hazard liquids / vents, shared by every structured style: broad two-tone
// bodies with a calm normal; the renderer layers its emissive glows on top.
export function liquid(c, ramp) {
  const t = fbm(c.gx * 0.45, c.gy * 0.45, c.seed + 63);
  const w = vnoise(c.gx * 1.3, c.gy * 1.3, c.seed + 64) - 0.5;
  return { c: t < 0.55 ? ramp[1] : ramp[2], n: norm3(w * 0.25, 0.30, 0.95) };
}

// Hazard glows for the structured styles: broad crack veins instead of the
// classic high-frequency speckle; ember vents become one glowing core per tile.
// Returns a GLOW_ID, or -1 to defer to the renderer's sparse speckle (water/poison).
export function hazardGlow(m, c) {
  if (m === 'lava')  return Math.abs(vnoise(c.gx * 0.55 + 3, c.gy * 0.55, c.seed + 5) - 0.5) < 0.07 ? 5 : 0;   // long calm veins
  if (m === 'chasm') return Math.abs(vnoise(c.gx * 0.6 + 7, c.gy * 0.6, c.seed + 9) - 0.5) < 0.045 ? 6 : 0;
  if (m === 'ember') return (H(c.tx, c.ty, c.seed + 31) > 0.6 && Math.abs(c.u - 0.5) + Math.abs(c.v - 0.5) < 0.22) ? 3 : 0;
  if (m === 'poison' || m === 'water') {                           // ≤ one small glint per tile, not per-pixel glitter
    if (H(c.tx, c.ty, c.seed + 71) < 0.5) return 0;
    const gu = 0.2 + 0.6 * H(c.tx, c.ty, c.seed + 72), gv = 0.2 + 0.6 * H(c.ty, c.tx, c.seed + 73);
    return (Math.abs(c.u - gu) < 0.08 && Math.abs(c.v - gv) < 0.08) ? (m === 'poison' ? 1 : 4) : 0;
  }
  return -1;
}

// Theme accent glow for style sigils / seams.
export const THEME_ACCENT = { dread: 2, desert: 3, poison: 1, ember: 3, lava: 5, chasm: 6 };
