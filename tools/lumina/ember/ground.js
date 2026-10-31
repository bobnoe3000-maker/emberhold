// ground.js — what stands between the camera and our people in Luminati's world (docs/lumina-prototype.md §7). The owner,
// 2026-10-31: "The grasses and ground cover hide the characters too much, what if those were at 25% of current size?
// Other larger assets like trees, houses, are fine at current size. Also drop the floating luminous dots."
//   · the ground cover: every grass tuft, tall grass, flower, bush, fern, mushroom, pebble and reed of Luminati's ground
//     detail (game/GroundDetail.js, its one Foliage call, tagged by the build) at a quarter of its size. Trees,
//     houses, rocks, crags and the forest border are other builders: unchanged.
//   · the floating luminous dots: the camera's dust motes (World.js, environment.dust) are off, and a level's dust,
//     firefly and sparkle areas are left out (World.js's emitter loop, tagged). The embers rising off a fire, the
//     smoke, mist, leaves and petals stay. The catalogue's own exhibits of those three (levels.mjs, `emberExhibit`) stay,
//     being what they show.
// In every world and both views.

/** the ground cover's size against Luminati's */
export const GROUND_COVER = 0.25;
/** the particle areas that are floating luminous dots (engine/fx/Particles.js presets) */
const MOTES = new Set(['dust', 'fireflies', 'sparkle']);

Object.assign(globalThis, {
  __emberGround: {
    /** a Foliage field's instances, each at GROUND_COVER of its scale (a copy: Luminati's list is its own) */
    foliage(list) { this.scaled += list.length; return list.map((it) => ({ ...it, scale: (it.scale ?? 1) * GROUND_COVER })); },
    /** (for checks) how many ground-cover instances were made at GROUND_COVER */
    scaled: 0,
    size: GROUND_COVER,
    /** whether a level's emitter object is built */
    keeps: (obj) => obj?.emberExhibit === true || !MOTES.has(obj?.preset),
    /** the camera's dust motes */
    dust: false,
  },
});
