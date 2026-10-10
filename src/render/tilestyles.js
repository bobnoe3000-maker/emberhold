// tilestyles.js — pluggable floor / wall painters for the G-buffer bake.
//
// The original terrain look ("classic", still inlined in renderer.js) chose every
// pixel's ramp step AND its normal from fbm noise — lively, but it reads as
// grain and sparkles under dynamic light. These styles paint from STRUCTURE
// instead (slabs, grout, courses, flat planes), with one floor ramp and one wall
// ramp per variant ("less colour"), flat or low-frequency normals, and noise only
// at tile/slab granularity. All are pure functions of world coordinates, so the
// margin-cached bake stays deterministic.
//
// floor(c) → { c: [r,g,b], n?: [x,y,z], e?: glowId, j?: 1 }   c = FloorCtx (see renderer)
// wall(c)  → { c, n?, e?, j? }   n is a tweak ADDED to the face normal
// j marks joint pixels (grout, seams, gaps) so a VARIANT can fill them.
// cap(c)   → floor painter for the top of wall tiles (defaults to floor with wall ramp)

import { hash2, fbm, vnoise } from '../sim/rng.js';
import { norm3 } from './gsprite.js';
import { ELIT } from './palette.js';

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
    if (fx < 0.13 || fy < 0.13) return { c: r[0], j: 1 };               // grout on the slab's low edges only → 1px lines
    const base = H(sxl, row, c.seed) > 0.55 ? r[3] : r[2];
    if (fx < 0.26 || fy < 0.26) return { c: mix(base, r[4], 0.35) };   // lit bevel
    if (fx > 1.87 || fy > 0.87) return { c: mul(base, 0.8) };          // shaded bevel
    return { c: base };
  },
  wall(c) {
    const r = c.wr;
    if (c.k === 0) return { c: r[4] };                                  // cap rim
    if (c.hz % ZH === 0) return { c: r[0], j: 1 };                      // bed joint
    const course = Math.floor(c.hz / ZH), a = c.along * 1 + (course & 1) * 0.5, bi = Math.floor(a);
    if (frac(a) < 0.13) return { c: r[0], j: 1 };                       // head joint
    const base = H(bi, course, c.seed + 5) > 0.5 ? r[2] : r[3];
    return { c: (c.hz % ZH === ZH - 1) ? mix(base, r[4], 0.3) : base };   // lit top edge of each block
  },
};

// ─── 2. TEMPLE — 2×2-tile checkerboard of polished flags with fine joints;
// walls get pilasters every two tiles, a trim band and a dark plinth.
const temple = {
  label: 'Temple checker',
  floor(c) {
    const r = c.fr, u = frac(c.gx), v = frac(c.gy);
    const dark = ((Math.floor(c.gx / 2) + Math.floor(c.gy / 2)) & 1) === 1;
    const base = dark ? r[1] : r[3];
    if (u < 0.12 || v < 0.12) return { c: mul(base, 0.72), j: 1 };     // fine joint, same family
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

// ─── 3. CATACOMB COBBLE — irregular Voronoi stones (~0.8 tile) with dark gaps,
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
    if (s.gap) return { c: r[0], j: 1 };
    const base = H(s.id, 3, c.seed) > 0.5 ? r[2] : r[3];
    const col = s.dx < -0.17 ? mix(base, r[4], 0.3) : (s.dx > 0.2 || s.dy > 0.24) ? mul(base, 0.8) : base;
    return { c: col, n: norm3(s.dx * 0.6, 0.30 - s.dy * 0.5, 0.9) };
  },
  wall(c) {
    const r = c.wr;
    if (c.k === 0) return { c: r[3] };
    if (c.hz % ZH === 0) return { c: r[0], j: 1 };
    const course = Math.floor(c.hz / ZH), a = c.along * (0.9 + 0.7 * H(course, 1, c.seed)) + H(course, 2, c.seed), bi = Math.floor(a);
    if (frac(a) < 0.11) return { c: r[0], j: 1 };
    const base = H(bi, course, c.seed + 2) > 0.5 ? r[2] : r[3], cy = c.hz % ZH;
    return { c: cy >= ZH - 2 ? mix(base, r[4], 0.25) : cy === 1 ? mul(base, 0.8) : base, n: [0, cy >= ZH - 2 ? 0.2 : -0.1, 0] };
  },
};

// ─── 4. RUNE PLATES — big 2×2 obsidian plates with an engraved inset border;
// a few carry a glowing sigil. Walls are smooth panels whose seams sometimes glow.
const runeplate = {
  label: 'Rune plates',
  floor(c) {
    const r = c.fr, pi = Math.floor(c.gx / 2), pj = Math.floor(c.gy / 2);
    const fx = c.gx / 2 - pi, fy = c.gy / 2 - pj;
    if (fx < 0.065 || fy < 0.065) return { c: r[0], j: 1 };             // plate seam
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
    if (seam) return (H(Math.floor(a), 7, c.seed) > 0.7 && c.k > 2) ? { c: r[3], e: c.accent } : { c: r[0], j: 1 };
    return { c: c.k < 3 ? r[3] : r[2] };
  },
};

// ─── 5. CAVERN — natural rock: broad two/three-tone regions from LOW-frequency
// noise (no per-pixel speckle) with gently undulating normals; walls are rock
// faces with vertical striations that darken toward the base.
const cavern = {
  label: 'Cavern rock',
  floor(c) {
    const r = c.fr, k = 0.32, s = c.seed + 41;
    const t = fbm(c.gx * k, c.gy * k, s);
    if (Math.abs(t - 0.42) < 0.012) return { c: r[0], j: 1 };          // crevice between bands
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

export const TILE_STYLES = { flagstone, temple, cobble, runeplate, cavern };
export const TILE_STYLE_KEYS = ['classic', ...Object.keys(TILE_STYLES)];

// ─── VARIANTS — every style comes in seven material sets. A variant swaps the
// floor / wall ramps, the look of the level's hazard pools, the accent glow for
// sigils and seams, what fills the joints (embers, moss, rime, water) and a
// broad low-frequency patch layer (scorch, blight, drifts, puddles). Pools are
// still the sim's hazard tiles (impassable); only their appearance changes.
const P = (k) => ELIT[k];
export const VARIANTS = {
  plain:  { label: 'Plain',  floor: 'stone',  wall: 'basalt',  pool: 'pit',    accent: 2 },
  earth:  { label: 'Earth',  floor: 'earth',  wall: 'loam',    pool: 'mud',    accent: 3,
            patch: { ramp: 'loam', step: 1, t: 0.45 } },
  rock:   { label: 'Rock',   floor: 'rock',   wall: 'crag',    pool: 'rubble', accent: 6 },
  lava:   { label: 'Lava',   floor: 'basalt', wall: 'obsid',   pool: 'lava',   accent: 5,
            patch: { ramp: 'lava', step: 3, t: 0.4 },
            joint: (c, h) => (h > 0.93 ? { c: P('lava')[4], e: 3 } : h > 0.6 ? { c: P('lava')[1] } : null) },   // scorched cracks, a few live embers
  poison: { label: 'Poison', floor: 'moss',   wall: 'bone',    pool: 'poison', accent: 1,
            patch: { ramp: 'poison', step: 2, t: 0.3 },
            joint: (c, h) => (h > 0.96 ? { c: P('poison')[4], e: 1 } : h > 0.45 ? { c: P('poison')[1] } : null) },
  ice:    { label: 'Ice',    floor: 'ice',    wall: 'glacier', pool: 'ice',    accent: 7,
            patch: { ramp: 'frost', step: 2, t: 0.5 },
            joint: () => ({ c: P('frost')[1] }) },                                        // rime-packed joints
  water:  { label: 'Water',  floor: 'slate',  wall: 'slate',   pool: 'water',  accent: 8,
            patch: { ramp: 'tide', step: 3, t: 0.75, wet: true },
            joint: () => ({ c: P('tide')[1] }) },                                         // water-dark joints
  // the Fens' drowned imperial works (M8): grey dressed stone gone green in the joints, standing water in black-green
  // pools that give no light (the water variant's blue glow read as neon against the owner's dusk)
  drowned: { label: 'Drowned', floor: 'stone', wall: 'slate', pool: 'bog',   accent: 1,
            patch: { ramp: 'moss', step: 1, t: 0.4, wet: true },
            joint: (c, h) => (h > 0.5 ? { c: P('moss')[1] } : null) },
  // (v1.48) the Old Barrows' crypts: packed earth between dry-stone, bone-dust in the joints; the cave under Wickham
  // Keep: wet rock, slate-dark where the water stands
  crypt:  { label: 'Crypt', floor: 'earth', wall: 'stone', pool: 'pit',   accent: 2,
            patch: { ramp: 'stone', step: 1, t: 0.4 },
            joint: (c, h) => (h > 0.6 ? { c: P('bone')[1] } : null) },
  cave:   { label: 'Cave',  floor: 'rock',  wall: 'crag',  pool: 'water', accent: 6,
            patch: { ramp: 'slate', step: 1, t: 0.45, wet: true } },
  // the Cult's cut: scorched stone, a rare ember left in the joints (the lava variant's live cracks were loud for the dusk)
  cinder: { label: 'Cinder', floor: 'basalt', wall: 'obsid', pool: 'pit',  accent: 3,
            patch: { ramp: 'obsid', step: 1, t: 0.5 },
            joint: (c, h) => (h > 0.7 ? { c: P('obsid')[0] } : null) },   // (no glow: the cut's light is its braziers and circles)
};
export const VARIANT_KEYS = Object.keys(VARIANTS);
// Default variant per biome when none is forced with ?tv=.
export const THEME_VARIANT = { crypt: 'crypt', cave: 'cave', nave: 'drowned', cinder: 'cinder', dread: 'plain', desert: 'earth', poison: 'poison', ember: 'lava', lava: 'lava', chasm: 'rock', warren: 'rock', mire: 'earth', water: 'drowned', sluice: 'drowned' };
// Point-light colour for glowing pools (the renderer thins these to a few lamps).
export const POOL_LIGHT = { lava: [1.7, 0.8, 0.25], poison: [0.5, 1.5, 0.35], ice: [0.4, 0.7, 1.2], water: [0.3, 0.8, 1.6] };

// Hazard pools: broad two-tone bodies with a calm normal, plus at most one small
// glint per tile (or long calm veins for lava) instead of per-pixel glitter.
function glint(c, id) {
  if (H(c.tx, c.ty, c.seed + 71) < 0.5) return 0;
  const gu = 0.2 + 0.6 * H(c.tx, c.ty, c.seed + 72), gv = 0.2 + 0.6 * H(c.ty, c.tx, c.seed + 73);
  return (Math.abs(c.u - gu) < 0.08 && Math.abs(c.v - gv) < 0.08) ? id : 0;
}
function liquid(c, ramp, lo = 1, hi = 2) {
  const t = fbm(c.gx * 0.45, c.gy * 0.45, c.seed + 63);
  const w = vnoise(c.gx * 1.3, c.gy * 1.3, c.seed + 64) - 0.5;
  return { c: t < 0.55 ? ramp[lo] : ramp[hi], n: norm3(w * 0.25, 0.30, 0.95) };
}
const POOLS = {
  lava(c)   { const r = liquid(c, P('lava')); r.e = Math.abs(vnoise(c.gx * 0.55 + 3, c.gy * 0.55, c.seed + 5) - 0.5) < 0.07 ? 5 : 0; return r; },
  poison(c) { const r = liquid(c, P('poison')); r.e = glint(c, 1); return r; },
  water(c)  { const r = liquid(c, P('tide'), 2, 3); r.e = glint(c, 8); return r; },
  still(c)  { const r = liquid(c, P('slate'), 0, 1); r.n = N_UP; return r; },   // (v1.48) a cave's standing water: black, still, no glint
  mud(c)    { const r = liquid(c, P('mud'), 0, 1); if (vnoise(c.gx * 1.6, c.gy * 1.6, c.seed + 65) > 0.74) r.c = P('mud')[3]; r.n = N_UP; return r; },   // glossy sump
  bog(c)    { const r = liquid(c, P('bog'), 1, 2); if (vnoise(c.gx * 1.2, c.gy * 1.2, c.seed + 69) > 0.7) r.c = P('weed')[1]; else r.e = glint(c, 8); r.n = N_UP; return r; },   // still black-green water, a skin of weed, a rare glint
  pit(c)    { return { c: fbm(c.gx * 0.5, c.gy * 0.5, c.seed + 66) < 0.5 ? P('pit')[1] : P('pit')[2], n: N_UP }; },
  ice(c) {                                     // frozen pool: pale sheet, long hairline cracks, rare frost glint
    const f = P('frost'), crack = Math.abs(vnoise(c.gx * 0.9 + 11, c.gy * 0.9, c.seed + 67) - 0.5) < 0.03;
    if (crack) return { c: f[1], n: N_UP };
    return { c: fbm(c.gx * 0.4, c.gy * 0.4, c.seed + 68) < 0.5 ? f[2] : f[3], n: norm3(0, 0.36, 0.93), e: glint(c, 7) };
  },
  rubble(c, V) {                               // scree: small domed stones with dark gaps
    const r = P(V.wall), S = 0.7, cx = Math.floor(c.gx / S), cy = Math.floor(c.gy / S);
    let d1 = 9, d2 = 9, id = 0, dx = 0, dy = 0;
    for (let j = -1; j <= 1; j++) for (let i = -1; i <= 1; i++) {
      const X = cx + i, Y = cy + j, qx = (X + 0.2 + 0.6 * H(X, Y, c.seed + 91)) * S, qy = (Y + 0.2 + 0.6 * H(Y, X, c.seed + 92)) * S;
      const d = Math.hypot(c.gx - qx, c.gy - qy);
      if (d < d1) { d2 = d1; d1 = d; id = X * 7919 + Y; dx = c.gx - qx; dy = c.gy - qy; } else if (d < d2) d2 = d;
    }
    if (d2 - d1 < 0.09) return { c: P('pit')[2] };
    const base = H(id, 5, c.seed) > 0.5 ? r[3] : r[2];
    return { c: dx < -0.14 ? mix(base, r[4], 0.35) : dy > 0.16 ? mul(base, 0.7) : base, n: norm3(dx * 1.0, 0.30 - dy * 0.9, 0.85) };
  },
};

// Floor / wall-top pixel for (style, variant). `pool` = the level's hazard tile.
export function paintFloor(style, V, c, pool, isWall) {
  if (pool) return POOLS[V.pool](c, V);
  const r = (isWall ? (style.cap || style.floor) : style.floor)(c);
  if (r.j) return accentJoint(V, c, r, H(c.tx, c.ty, c.seed + 81));
  if (V.patch && !isWall && fbm(c.gx * 0.16, c.gy * 0.16, c.seed + 97) > 0.63) {
    const p = V.patch;
    return { c: mix(r.c, P(p.ramp)[p.step], p.t), n: p.wet ? N_UP : r.n, e: r.e };   // puddles are mirror-flat
  }
  return r;
}
export function paintWall(style, V, c) {
  const r = style.wall(c);
  if (!r.j) return r;
  const a = accentJoint(V, c, r, H(Math.floor(c.along), Math.floor(c.hz / ZH), c.seed + 83));
  return a.e && !r.e ? { c: a.c, n: a.n } : a;            // walls take the joint colour, never its glow
}
function accentJoint(V, c, r, h) {
  const a = V.joint && V.joint(c, h);
  return a ? { c: a.c || r.c, n: r.n, e: a.e || r.e } : r;
}
export function variantFor(theme, forced) {
  return VARIANTS[forced] || VARIANTS[THEME_VARIANT[theme]] || VARIANTS.plain;
}
