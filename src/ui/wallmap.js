// @ts-check
// wallmap.js — the Old Provinces' wall map as data (docs/worldmap-travel-proposal.md): where each place is on the
// Lantern Guild's map (tools/worldmap/draw.mjs draws it from these, and the World map's pins stand on them, so the two
// can't drift apart), and where the game's lands lie on it. Whatever isn't a land you can walk yet is under fog. Map
// units: the drawing's own pixels, 1200 × 2400, north up.

export const WALL = { w: 1200, h: 2400, src: './assets/maps/old-provinces.jpg' };

/** @type {Record<string, [number, number]>} */
export const PLACES = {
  thornwick: [330, 1720], greyholt: [470, 1655], saltmere: [262, 2062], reedholm: [470, 2082], ashgate: [360, 905], kells: [240, 838],
  frosthold: [420, 440], glass: [790, 440], throne: [600, 522], tollhaven: [1020, 960], highmarch: [820, 835], brine: [722, 1012],
  gullwick: [998, 1180], rookstead: [800, 1600], hollin: [690, 1450],
};

// the game's lands (sim/regions.js) on the wall map: each one's ground, as a polygon that doesn't overlap the others
// (the fog is the map with the open ones cut out). Emberfall's line is the drawing's own (draw.mjs BORDERS); the
// Vale and the Fens part where the reeds begin.
/** @type {Record<string, Array<[number, number]>>} */
export const LAND_AREA = {
  vale: [[120, 1420], [330, 1440], [500, 1420], [580, 1520], [620, 1720], [636, 1900], [560, 1905], [340, 1885], [120, 1900]],
  fens: [[120, 1900], [340, 1885], [560, 1905], [636, 1900], [640, 1960], [700, 2240], [120, 2240]],
};
// the words on the fog: what's beyond the lands you can walk, and a land not open yet (where its words go on the map)
export const FOG_WORDS = {
  beyond: { at: [600, 1080], lines: ['The Cinder Reach, Solmere, the Tidemark,', 'the Greenwood and the Pale Heights', 'the Guild’s roads north aren’t open yet'] },
  fens: { at: [400, 2090], lines: ['The Greywater Fens', 'the canal road south is shut'] },
};
