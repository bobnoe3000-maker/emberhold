// @ts-check
// wallmap.js — the Old Provinces' wall map as data (docs/worldmap-travel-proposal.md): where each place is on the
// Lantern Guild's map (tools/worldmap/draw.mjs draws it from these, and the World map's pins stand on them, so the two
// can't drift apart), and where the game's lands lie on it. Whatever isn't a land you can walk yet is under fog. Map
// units: the drawing's own pixels, 1200 × 2400, north up.

export const WALL = { w: 1200, h: 2400, src: './assets/maps/old-provinces.jpg' };

// (v1.143, the owner: "Replan and rearrange the world map.. lowest levels at the bottom and highest at the top. The mere
// tower and ember throne can stay where they are"): the lands climb the map as their levels do, the Vale (1–9) at its
// foot, then the Fens (10–18) east of it, the Reach (19–30) west, the Tidemark (31–45) east, the Greenwood (46–60) west
// and the Heights (61–75) at the top round the Throne; Solmere, its Mere and the Mere Tower in the middle, where they were
/** @type {Record<string, [number, number]>} */
export const PLACES = {
  thornwick: [228, 2051], greyholt: [368, 1986], saltmere: [636, 1660], reedholm: [843, 1790], ashgate: [336, 1382], kells_rest: [222, 1315],
  frosthold: [420, 440], glass: [790, 440], throne: [600, 522], tollhaven: [1020, 960], highmarch: [820, 835], brine: [722, 1012],
  gullwick: [998, 1180], rookstead: [330, 830], hollin: [440, 980],
};
// the lands in the order they're climbed, bottom to top: each one's band, where its name stands on the map (the progress
// rail and the words over the fog use these), its town (a coach stop or a place), and whether the game has built it yet
/** @type {Array<{ id: string, name: string, lv: [number, number], at: [number, number], town: string, built: boolean }>} */
export const CLIMB = [
  { id: 'vale', name: 'The Hollow Vale', lv: [1, 9], at: [300, 1770], town: 'thornwick', built: true },
  { id: 'fens', name: 'The Greywater Fens', lv: [10, 18], at: [760, 1572], town: 'saltmere', built: true },
  { id: 'reach', name: 'The Cinder Reach', lv: [19, 30], at: [336, 1146], town: 'ashgate', built: true },
  { id: 'tidemark', name: 'The Tidemark', lv: [31, 45], at: [870, 726], town: 'tollhaven', built: false },
  { id: 'greenwood', name: 'The Greenwood', lv: [46, 60], at: [330, 668], town: 'rookstead', built: false },
  { id: 'heights', name: 'The Pale Heights', lv: [61, 75], at: [600, 300], town: 'frosthold', built: false },
];

// Emberfall's two overlands on the wall map (art critic pass 12): a tile of each (x, y) to the map's units, north up, so
// the Guild's map puts every site and town where the game does. The Vale's Thornwick lands on its place; the Fens' road
// north meets the Vale's road south (draw.mjs draws the sites through these; test/worldmap.test.mjs checks the towns).
/** @type {Record<string, (x: number, y: number) => [number, number]>} */
export const EMBERFALL = {
  vale: (x, y) => [150 + 1.4 * x, 1850 + 1.35 * y],          // (v1.143: at the map's foot, south-west)
  fens: (x, y) => [520 + 1.6 * x, 1600 + y],                 // (v1.143: north-east of the Vale, above it)
  // (v1.124) the Cinder Reach: Ashgate's gate on its place, Kell's Rest about on its own, 1.3 map units a tile (v1.143: west, above the Fens)
  reach: (x, y) => [170 + 1.3 * x, 1200 + 1.3 * y],
};

// the game's lands (sim/regions.js) on the wall map: each one's ground, as a polygon that doesn't overlap the others
// (the fog is the map with the open ones cut out). Emberfall's line is the drawing's own (draw.mjs BORDERS); the
// Vale and the Fens part where the reeds begin.
/** @type {Record<string, Array<[number, number]>>} */
export const LAND_AREA = {
  vale: [[120, 1560], [518, 1560], [518, 1846], [560, 1880], [610, 2000], [640, 2260], [120, 2260]],   // (v1.143: to the Reach's foot, the downs and its north range the Vale's)
  fens: [[518, 1560], [1070, 1560], [1070, 1990], [610, 2000], [560, 1880], [518, 1846]],
  reach: [[130, 1166], [518, 1166], [518, 1556], [130, 1556]],   // (v1.124: the overland's square, round Ashgate)
};
// the words on the fog: what's beyond the lands you can walk, and a land not open yet (where its words go on the map)
export const FOG_WORDS = {
  beyond: { at: [700, 1300], lines: ['Solmere, the Tidemark,', 'the Greenwood and the Pale Heights', 'the Guild’s roads beyond aren’t open yet'] },
  fens: { at: [720, 1730], lines: ['The Greywater Fens', 'the canal road is shut'] },
  reach: { at: [340, 1380], lines: ['The Cinder Reach', 'the Wickham road north is shut'] },
};
