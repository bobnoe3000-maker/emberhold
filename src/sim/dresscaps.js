// @ts-check
// dresscaps.js — how many of a piece a room may hold, by its size (docs/level-design-rules.md §4.3; the owner,
// 2026-11-10: "dont repeat with 6+ torches unless the room is large, or dont repeat with 12 banners unless it makes
// design sense"). world.js `place` asks before it sets a piece down, so every floor keeps them, the authored and the
// generated alike: a piece past its cap is simply not placed (the place it would have taken stays floor).
//
// Three families of piece, each capped its own way:
//   · LIGHTS (a brazier, a torch, a lantern, a candelabra, a cluster of candles): each kind capped, and all of them
//     together (LIGHTS_ALL), so a small room is lit by two or three, a hall by half a dozen. A floor's stairwell has its
//     own pair (world.js, set directly, not counted).
//   · CLUTTER (barrels, crates, sacks, bones, urns, spoil, cracks, scorch, puddles, straw): a few in a heap or two,
//     never a carpet of them.
//   · FEATURES (the big set pieces a place has several of: a windlass, a vat, a sarcophagus, a boat, a monolith, a
//     gibbet, a spire, a totem, a stalagmite, a pillar, a banner, a standard, a rack): by size; ROWS (pews, bunks,
//     shelves of urns, strongboxes, the bound) stand in a row along a wall where the place is a row, a nave's pews, a
//     barracks' bunks, and are capped by the row a size of room holds.
// A cap is per room. The sizes are level.js ROOM_SIZES and plans.js sizeOf: small, medium, large and the gallery (a
// large corridor). Anything not listed has no cap here (a chest, a shrine, a set piece: one each by their own rules).
// Deterministic: a pure table.

/** @typedef {'small' | 'medium' | 'large' | 'gallery'} Size */
/** @type {Record<string, [number, number, number, number]>} small, medium, large, gallery */
export const CAPS = {
  // the lights
  brazier: [2, 2, 4, 4], torch: [2, 3, 4, 4], lantern: [2, 4, 4, 4], candelabra: [1, 3, 3, 3], candles: [3, 4, 4, 4],
  // the clutter
  barrels: [2, 3, 4, 4], crates: [2, 3, 4, 4], sacks: [2, 2, 3, 3], bones: [2, 3, 4, 4], urns: [2, 3, 4, 4], spoil: [2, 5, 6, 6],
  cracks: [2, 6, 6, 6], scorch: [2, 3, 3, 3], puddle: [2, 3, 4, 4], straw: [2, 3, 4, 4], reeds: [3, 5, 6, 6], hay: [1, 2, 3, 3],
  // the features
  windlass: [1, 2, 3, 3], vat: [1, 3, 4, 4], sarcophagus: [2, 4, 6, 6], boat: [1, 3, 4, 4], monolith: [1, 2, 2, 2], gibbet: [1, 1, 2, 2],
  spire: [1, 1, 2, 2], totem: [1, 1, 2, 2], stalagmite: [3, 6, 8, 8], pillar: [2, 4, 10, 10], brokenpillar: [1, 2, 3, 3],
  banner: [1, 2, 3, 4], standard: [1, 1, 2, 2], rack: [2, 4, 4, 7], stall: [1, 2, 3, 3], trough: [1, 2, 2, 2], cart: [1, 1, 2, 2],
  // the rows (a row only where the place is one: the gallery and the large room hold the long ones)
  pew: [4, 8, 16, 24], bunk: [4, 8, 12, 16], urnshelf: [3, 4, 6, 9], strongbox: [2, 4, 8, 8], bars: [2, 4, 8, 8], bound: [3, 8, 8, 8],
};
/** the lights, counted together too */
export const LIGHT = new Set(['brazier', 'torch', 'lantern', 'candelabra', 'candles']);
/** every light in a room together, by size */
export const LIGHTS_ALL = { small: 3, medium: 5, large: 7, gallery: 8 };
/** the pieces with a cap */
export const REPEAT = new Set(Object.keys(CAPS));
const AT = { small: 0, medium: 1, large: 2, gallery: 3 };
/** a piece's cap in a room of this size (Infinity: no cap) @param {string} kind @param {string} size */
export const capOf = (kind, size) => (CAPS[kind] ? CAPS[kind][AT[size] ?? 2] : Infinity);
/** may one more of `kind` go in a room holding `has` (kind → count) of this size? @param {string} kind @param {string} size @param {Map<string, number>} has */
export function mayPlace(kind, size, has) {
  if ((has.get(kind) || 0) >= capOf(kind, size)) return false;
  if (LIGHT.has(kind)) { let n = 0; for (const k of LIGHT) n += has.get(k) || 0; if (n >= (LIGHTS_ALL[size] ?? LIGHTS_ALL.large)) return false; }
  return true;
}
