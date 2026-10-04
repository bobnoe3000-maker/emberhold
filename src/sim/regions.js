// @ts-check
// regions.js — the lands you can walk (world doc v1.20 §3; docs/m8-plan.md slice 1). The sim keeps the land you're
// in (core.js `state.region`, saved since v18): it picks the overland, the town you wake in and the town a Homeward
// Scroll takes you to. A land opens when its `opens` chapter is done: the Fens when Act I ends with the shard in
// Ilse's hands. Its words (the shut road's line) are the overland's own (outdoor.js region exits).

/** @typedef {'vale' | 'fens'} LandId */
/** @type {Record<LandId, { name: string, town: string, opens: string | null }>} */
export const LANDS = {
  vale: { name: 'The Hollow Vale', town: 'Thornwick', opens: null },
  fens: { name: 'The Greywater Fens', town: 'Saltmere', opens: 'ch1_ember_in_the_fist' },
};
export const LAND_IDS = /** @type {LandId[]} */ (Object.keys(LANDS));
/** @param {string} id @returns {LandId} */
export const landId = (id) => (Object.prototype.hasOwnProperty.call(LANDS, id) ? /** @type {LandId} */ (id) : 'vale');
