// rng.js — deterministic randomness. Two flavors:
//   mulberry32(seed) : sequential stream (character recipes, loot rolls)
//   hash2(x,y,s)     : position-stable hash (worldgen, dither) — same inputs, same value, forever.
// Streams: each system derives its own seed offset so systems never steal each other's rolls.

export function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function hash2(x, y, s) {
  let h = Math.imul(x, 374761393) + Math.imul(y, 668265263) + Math.imul(s, 974634679);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  h ^= h >>> 16;
  return (h >>> 0) / 4294967296;
}

export function vnoise(x, y, s) {
  const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi;
  const a = hash2(xi, yi, s), b = hash2(xi + 1, yi, s);
  const c = hash2(xi, yi + 1, s), d = hash2(xi + 1, yi + 1, s);
  const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}

export function fbm(x, y, s) {
  return 0.62 * vnoise(x, y, s) + 0.38 * vnoise(x * 2.17 + 31, y * 2.17 + 17, s + 7);
}

// Per-system seed streams derived from the world seed.
export const STREAM = {
  WORLD: 0,       // terrain + resources
  DECOR: 1234,    // scatter
  RECIPE: 5150,   // character recipes
  LOOT: 9090,     // (phase 1) drop rolls
};
export const streamSeed = (worldSeed, stream) => (worldSeed ^ Math.imul(stream, 2654435761)) >>> 0;
