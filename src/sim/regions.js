// @ts-check
// regions.js — the lands you can walk (world doc v1.20 §3; docs/m8-plan.md slice 1). The sim keeps the land you're
// in (core.js `state.region`, saved since v18): it picks the overland, the town you wake in and the town a Homeward
// Scroll takes you to. A land opens when its `opens` chapter is done: the Fens when Act I ends with the shard in
// Ilse's hands; the Cinder Reach (v1.124) when Act II does, with the Abbey's ledger read and the Kell Assay's mark on it;
// the Pale Heights (v1.148) when Act III does, the night shift out of Furnace Nine and the vessel a day ahead on the
// Solmere road (the owner: "Open the Heights so we can fight him in play"). The lands between, Solmere, the Tidemark and
// the Greenwood, aren't built: the road goes through them unwalked, as the Wickham road goes over the range.
// Its words (the shut road's line) are the overland's own (outdoor.js region exits).

/** @typedef {'vale' | 'fens' | 'reach' | 'heights'} LandId */
/** @type {Record<LandId, { name: string, town: string, opens: string | null }>} */
export const LANDS = {
  vale: { name: 'The Hollow Vale', town: 'Thornwick', opens: null },
  fens: { name: 'The Greywater Fens', town: 'Saltmere', opens: 'ch1_ember_in_the_fist' },
  reach: { name: 'The Cinder Reach', town: 'Ashgate', opens: 'ch2_the_last_office' },
  heights: { name: 'The Pale Heights', town: 'Frosthold', opens: 'ch3_quota' },
};
export const LAND_IDS = /** @type {LandId[]} */ (Object.keys(LANDS));
/** @param {string} id @returns {LandId} */
export const landId = (id) => (Object.prototype.hasOwnProperty.call(LANDS, id) ? /** @type {LandId} */ (id) : 'vale');
