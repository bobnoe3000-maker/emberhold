// @ts-check
// regions.js — the lands you can walk (world doc v1.20 §3; docs/m8-plan.md slice 1). The sim keeps the land you're
// in (core.js `state.region`, saved since v18): it picks the overland, the town you wake in and the town a Homeward
// Scroll takes you to. A land opens when its `opens` chapter is done: the Fens when Act I ends with the shard in
// Ilse's hands; the Cinder Reach (v1.124) when Act II does, with the Abbey's ledger read and the Kell Assay's mark on it;
// the Pale Heights (v1.148) when Act III does, the night shift out of Furnace Nine and the vessel a day ahead on the
// Solmere road (the owner: "Open the Heights so we can fight him in play"). (v1.150) The Tidemark opens when Act III
// does, the vessel gone by the Solmere road to Brine Cross; the Heights move to Act IV's end, Lucan walking north, and a
// company that has already stood in Frosthold keeps them (`kept`: a coach stop in state.reached). Solmere and the
// Greenwood aren't built: Solmere is the crossroads every land's road meets at (SOLMERE, core.js), walked through.
// Its words (the shut road's line) are the overland's own (outdoor.js region exits).

/** @typedef {'vale' | 'fens' | 'reach' | 'tidemark' | 'heights'} LandId */
/** @type {Record<LandId, { name: string, town: string, opens: string | null, kept?: string }>} */
export const LANDS = {
  vale: { name: 'The Hollow Vale', town: 'Thornwick', opens: null },
  fens: { name: 'The Greywater Fens', town: 'Saltmere', opens: 'ch1_ember_in_the_fist' },
  reach: { name: 'The Cinder Reach', town: 'Ashgate', opens: 'ch2_the_last_office' },
  tidemark: { name: 'The Tidemark', town: 'Tollhaven', opens: 'ch3_quota' },
  heights: { name: 'The Pale Heights', town: 'Frosthold', opens: 'ch4_seventh_voice', kept: 'frosthold' },
};
// (v1.150) the lands whose road meets at Solmere, in the order the crossroads lists them, each with the way its road
// leaves the dead capital: walking into Solmere on one asks which of the others (open) to go on to, and comes out on
// that land's overland at its `solmere` arrival (outdoor.js: an exit `to: 'solmere'` on each)
/** @type {Array<{ land: LandId, road: string }>} */
export const SOLMERE = [
  { land: 'reach', road: 'west, the Ashgate road' },
  { land: 'tidemark', road: 'north-east, the road to Brine Cross' },
  { land: 'heights', road: 'north, up the frozen Sol' },
];
export const LAND_IDS = /** @type {LandId[]} */ (Object.keys(LANDS));
/** @param {string} id @returns {LandId} */
export const landId = (id) => (Object.prototype.hasOwnProperty.call(LANDS, id) ? /** @type {LandId} */ (id) : 'vale');
