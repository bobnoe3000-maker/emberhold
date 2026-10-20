// @ts-check
// geo.js — the Frontier's geography (docs/frontier-proposal.md): the Old Provinces as one land, laid out from the
// Lantern Guild's wall map (tools/worldmap/draw.mjs draws the same marks; src/ui/wallmap.js holds its places). Every
// figure here is in the wall map's own units (1200 × 2400, north up); the land is K tiles to the unit, so the far zoom
// *is* the wall map and the land under it lines up. The coast isn't here: it's the wall map's exported polygon
// (assets/maps/old-provinces.json), handed in by whoever builds the land (the sim can't fetch).
//
// What's authored here is the design: where the ranges, rivers, woods and roads run; each region's level band and the
// control points its level map is blended from (low at the town and the road in, high in the far wilds); the towns;
// the dungeons' mouths by name. Emberfall's sites stand where the game's Vale and Fens put them (wallmap.js EMBERFALL
// maps an overland tile to the wall map); the regions north take the names of their overland proposals
// (tools/worldmap/overlands.mjs), placed on the wall map's site marks where it has one.

/** tiles to the wall map's unit: 2520 × 5040 tiles, about 6.75 M of them land, 100× the Vale (proposal §1) */
export const K = 2.1;
export const MAP_W = 1200, MAP_H = 2400;
export const W = Math.round(MAP_W * K), H = Math.round(MAP_H * K);

/** @typedef {{ id: string, name: string, band: [number, number], pts: number[][], poly: number[][] | null }} Region */
// The regions, in the order a spot is tested (the first whose polygon holds it): bands from GDD §17 (Emberfall 1–18,
// the Reach from 19; Solmere's country a step under it, from 15). `pts`: [x, y, level] control points.
/** @type {Region[]} */
export const REGIONS = [
  { id: 'heights', name: 'The Pale Heights', band: [60, 75],
    poly: [[0, 0], [1200, 0], [1200, 660], [1040, 680], [860, 690], [720, 720], [600, 770], [480, 720], [350, 690], [160, 660], [0, 600]],
    pts: [[600, 705, 60], [420, 440, 63], [300, 600, 61], [900, 610, 62], [790, 440, 70], [600, 600, 68], [600, 522, 75], [600, 300, 72], [300, 300, 70], [950, 300, 71], [1050, 520, 66], [160, 450, 66]] },
  { id: 'solmere', name: 'Solmere', band: [15, 26],
    poly: [[520, 860], [600, 775], [690, 740], [680, 880], [700, 1000], [760, 1180], [780, 1260], [640, 1330], [580, 1520], [500, 1420], [460, 1300], [440, 1120], [500, 1000]],
    pts: [[600, 1180, 15], [600, 1260, 16], [530, 1360, 17], [560, 1470, 17], [470, 1130, 20], [720, 1110, 21], [600, 900, 22], [600, 800, 26], [740, 1230, 22], [520, 1000, 22], [680, 900, 24]] },
  { id: 'tidemark', name: 'The Tidemark', band: [30, 45],
    poly: [[720, 720], [860, 690], [1040, 680], [1200, 660], [1200, 1300], [1030, 1300], [780, 1260], [760, 1180], [700, 1000], [680, 880], [690, 740]],
    pts: [[722, 1012, 30], [710, 900, 32], [1020, 960, 34], [820, 835, 40], [998, 1180, 37], [1040, 760, 44], [900, 720, 43], [1100, 1100, 39], [880, 1100, 35], [1000, 1280, 38], [780, 1200, 33]] },
  { id: 'greenwood', name: 'The Greenwood', band: [45, 60],
    poly: [[580, 1520], [640, 1330], [780, 1260], [1030, 1300], [1200, 1300], [1200, 2400], [640, 2400], [640, 1960], [620, 1720]],
    pts: [[690, 1450, 45], [655, 1390, 45], [800, 1600, 50], [900, 1700, 56], [950, 1820, 60], [700, 1772, 58], [760, 2000, 60], [1000, 1450, 54], [630, 1650, 51], [900, 1380, 50]] },
  { id: 'reach', name: 'The Cinder Reach', band: [19, 30],
    poly: [[0, 600], [160, 660], [350, 690], [480, 720], [520, 860], [500, 1000], [440, 1120], [460, 1300], [500, 1420], [330, 1440], [160, 1420], [0, 1420]],
    pts: [[330, 1415, 19], [470, 1400, 19], [300, 1250, 21], [360, 905, 22], [480, 1000, 23], [240, 838, 26], [236, 800, 30], [300, 715, 28], [440, 760, 27], [160, 1000, 25], [420, 818, 25], [180, 1300, 22]] },
  { id: 'emberfall', name: 'Emberfall', band: [1, 18],
    poly: [[0, 1420], [160, 1420], [330, 1440], [500, 1420], [580, 1520], [620, 1720], [640, 1960], [640, 2400], [0, 2400]],
    // the Vale 1–9 round Thornwick, by its dungeons' bands (the Barrows 1–3, Wickham Keep 4–6, the Sunken Chapel 7–9);
    // the Fens 10–18 south of the reeds (Toadking's Mound 10–12, the Locks 13–15, the Abbey 16–18)
    pts: [[330, 1720, 1], [470, 1655, 3], [344, 1826, 2], [487, 1578, 5], [582, 1572, 9], [568, 1813, 8], [300, 1525, 8], [200, 1700, 5], [190, 1810, 6], [450, 1870, 9], [330, 1450, 9], [560, 1460, 9],
      [329, 1947, 10], [261, 1991, 11], [329, 1999, 14], [409, 2093, 17], [530, 2077, 15], [200, 2150, 18], [600, 1990, 16], [480, 1960, 12]] },
];
/** the Fens begin where the reeds do (wallmap.js LAND_AREA) */
export const FENS_LINE = [[120, 1900], [340, 1885], [560, 1905], [636, 1900]];

/** @typedef {{ id: string, name: string, x: number, y: number, r: number, hub?: boolean, city?: boolean }} Town */
// the towns (wallmap.js PLACES; Solmere where draw.mjs puts it): r, its walls' radius in tiles; a hub is a region's
// full town, the rest waystations. Nothing camps within r + SAFE of one.
/** @type {Town[]} */
export const TOWNS = [
  { id: 'thornwick', name: 'Thornwick', x: 330, y: 1720, r: 26, hub: true }, { id: 'greyholt', name: 'Greyholt', x: 470, y: 1655, r: 14 },
  { id: 'saltmere', name: 'Saltmere', x: 323, y: 1947, r: 18, hub: true }, { id: 'reedholm', name: 'Reedholm', x: 530, y: 2077, r: 14 },
  { id: 'ashgate', name: 'Ashgate', x: 360, y: 905, r: 30, hub: true }, { id: 'kells', name: "Kell's Rest", x: 240, y: 838, r: 14 },
  { id: 'solmere', name: 'Solmere', x: 600, y: 1180, r: 60, city: true },
  { id: 'brine', name: 'Brine Cross', x: 722, y: 1012, r: 14 }, { id: 'highmarch', name: 'Highmarch', x: 820, y: 835, r: 26 },
  { id: 'tollhaven', name: 'Tollhaven', x: 1020, y: 960, r: 28, hub: true }, { id: 'gullwick', name: 'Gullwick', x: 998, y: 1180, r: 14 },
  { id: 'hollin', name: 'Hollin Ford', x: 690, y: 1450, r: 14 }, { id: 'rookstead', name: 'Rookstead', x: 800, y: 1600, r: 22, hub: true },
  { id: 'frosthold', name: 'Frosthold', x: 420, y: 440, r: 24, hub: true },
];
export const SAFE = 40;

/** @typedef {{ id: string, name: string, x: number, y: number, lv: [number, number], family: string }} Site */
// the dungeons' mouths (closed in the proof of concept): a lair camps at each, its warden at the band's top
/** @type {Site[]} */
export const SITES = [
  { id: 'barrows', name: 'The Old Barrows', x: 344, y: 1826, lv: [1, 3], family: 'ashbound' },
  { id: 'wickham_keep', name: 'Wickham Keep', x: 487, y: 1578, lv: [4, 6], family: 'redhand' },
  { id: 'sunken_chapel', name: 'The Sunken Chapel', x: 568, y: 1813, lv: [7, 9], family: 'chapel' },
  { id: 'toadking_mound', name: "Toadking's Mound", x: 261, y: 1991, lv: [10, 12], family: 'reedmen' },
  { id: 'canal_locks', name: 'The Canal Locks', x: 352, y: 2010, lv: [13, 15], family: 'lockcult' },
  { id: 'drowned_abbey', name: 'The Drowned Abbey', x: 409, y: 2093, lv: [16, 18], family: 'drowned' },
  { id: 'cold_seam', name: 'The Cold Seam', x: 282, y: 990, lv: [19, 21], family: 'diggers' },
  { id: 'forgehall', name: 'The Forgehall of Oruth', x: 440, y: 1060, lv: [22, 24], family: 'goblin' },
  { id: 'slag_tunnels', name: 'The Slag Tunnels', x: 470, y: 940, lv: [23, 25], family: 'goblin' },
  { id: 'assay_yards', name: 'The Assay Yards', x: 290, y: 875, lv: [24, 26], family: 'redhand' },
  { id: 'cinderworks', name: 'The Cinderworks', x: 420, y: 815, lv: [26, 28], family: 'chapel' },
  { id: 'magma_vault', name: 'The Magma Vault', x: 268, y: 745, lv: [28, 30], family: 'chapel' },
  { id: 'drowned_mole', name: 'The Drowned Mole', x: 960, y: 1062, lv: [33, 36], family: 'drowned' },
  { id: 'highmarch_road', name: 'The Highmarch Road', x: 785, y: 915, lv: [37, 40], family: 'redhand' },
  { id: 'lamp_fort', name: 'The Lamp Fort', x: 1040, y: 760, lv: [42, 45], family: 'drowned' },
  { id: 'hollin_barn', name: 'Hollin Ford Barn', x: 712, y: 1482, lv: [45, 47], family: 'reedmen' },
  { id: 'charcoal_clearing', name: 'The Charcoal Clearing', x: 735, y: 1560, lv: [47, 49], family: 'goblin' },
  { id: 'antler_stones', name: 'The Antler Stones', x: 860, y: 1722, lv: [50, 52], family: 'goblin' },
  { id: 'tally_house', name: 'The Tally-House', x: 770, y: 1700, lv: [52, 55], family: 'redhand' },
  { id: 'thornway', name: 'The Thornway', x: 935, y: 1690, lv: [54, 57], family: 'reedmen' },
  { id: 'root_granary', name: 'The Root Granary', x: 880, y: 1825, lv: [57, 60], family: 'goblin' },
  { id: 'frozen_hospice', name: 'The Frozen Hospice', x: 612, y: 742, lv: [60, 62], family: 'chapel' },
  { id: 'pilgrims_stair', name: "The Pilgrims' Stair", x: 588, y: 655, lv: [62, 65], family: 'ashbound' },
  { id: 'soulcracks', name: 'The Soulcracks', x: 752, y: 640, lv: [64, 68], family: 'ashbound' },
  { id: 'praetory', name: 'The Praetory', x: 870, y: 560, lv: [67, 71], family: 'ashbound' },
  { id: 'glass_keep', name: 'The Glass Keep', x: 790, y: 440, lv: [70, 73], family: 'ashbound' },
  { id: 'the_lip', name: 'The Lip', x: 650, y: 572, lv: [72, 75], family: 'ashbound' },
];

// the rivers (draw.mjs RIVERS, and Emberfall's two as the game lays them, through wallmap.js EMBERFALL): [points, width in tiles]
/** @type {Array<{ name: string, pts: number[][], w: number }>} */
export const RIVERS = [
  { name: 'the river', w: 7, pts: [[280, 1349], [308, 1519], [364, 1586], [398, 1648], [420, 1708], [409, 1770], [417, 1805], [462, 1843], [532, 1859], [602, 1859], [672, 1910], [728, 1991], [760, 2060]] },
  { name: 'the drowned canal', w: 8, pts: [[373, 1827], [372, 1947], [369, 1999], [373, 2067], [396, 2087], [412, 2117], [421, 2207], [430, 2300]] },
  { name: 'the Sol', w: 7, pts: [[600, 588], [606, 760], [588, 900], [602, 1090]] },
  { name: 'the Long Water', w: 9, pts: [[680, 1140], [780, 1300], [880, 1400], [960, 1520], [1010, 1600], [1060, 1680]] },
  { name: 'the Highmarch water', w: 6, pts: [[820, 840], [880, 880], [950, 920], [1020, 960], [1080, 990]] },
  { name: 'the Ashwater', w: 6, pts: [[400, 860], [440, 950], [490, 1040], [540, 1100]] },
];
// the Mere, north of the city so Solmere stands on its south shore (overlands.mjs)
export const MERE = [[520, 1060], [580, 1030], [670, 1040], [700, 1085], [650, 1120], [600, 1112], [550, 1118], [510, 1092]];

// the ranges (draw.mjs range()): ridge lines; the ridge is solid rock with a skirt of hills, and opens where a road crosses
export const RANGES = [
  [[240, 390], [310, 350], [380, 345], [430, 368]], [[770, 368], [830, 345], [900, 350], [960, 400]],   // the Pale Heights
  [[230, 470], [300, 440]], [[900, 450], [970, 480]],
  [[200, 770], [270, 742], [340, 752], [430, 770]], [[220, 1010], [300, 1036], [410, 1046]],           // the Reach's black hills
  [[205, 1525], [280, 1512], [360, 1518], [440, 1534]],                                               // the Vale's north range
  [[930, 820], [985, 800], [1015, 840]],                                                              // the Highmarch fells
  [[930, 1790], [960, 1720], [990, 1650]],                                                            // the Greenwood's east ridge
];
// the crater (draw.mjs HEIGHTS_C): a ring of mountains open to the south, where the Pilgrims' Stair goes up
export const CRATER = { x: 600, y: 520, rx: 106, ry: 68, gap: 0.2 };
export const VOLCANO = { x: 236, y: 800, r: 16 };

// areas (draw.mjs scatter polygons): woods, pine woods, the marsh, the downs, the salt marsh
export const AREAS = {
  forest: [[[640, 1380], [800, 1340], [960, 1420], [990, 1600], [930, 1780], [760, 1830], [660, 1760], [626, 1560]],
    [[440, 1650], [560, 1650], [580, 1770], [470, 1810], [420, 1730]], [[160, 1560], [240, 1580], [250, 1660], [170, 1680]],
    [[640, 1880], [800, 1860], [1000, 1900], [1040, 2100], [800, 2200], [650, 2120]]],
  pines: [[[200, 470], [330, 470], [380, 580], [240, 620]], [[830, 470], [960, 480], [990, 610], [850, 620]], [[120, 300], [230, 260], [260, 340], [150, 380]]],
  marsh: [[[150, 1890], [360, 1860], [560, 1910], [600, 2000], [560, 2140], [400, 2200], [200, 2160], [140, 2040]], [[980, 880], [1060, 880], [1070, 950], [1000, 940]]],
  downs: [[[460, 1340], [600, 1300], [610, 1470], [500, 1500]], [[220, 1150], [440, 1150], [450, 1310], [250, 1330]], [[700, 980], [900, 950], [950, 1100], [760, 1130]]],
};

// the roads: the imperial roads ruled straight from Solmere (draw.mjs ROADS), and the tracks from the towns out to
// what's near them (the dungeons' mouths join the nearest road by a track of their own: land.js)
const SOL = [600, 1180], P = Object.fromEntries(TOWNS.map((t) => [t.id, [t.x, t.y]]));
export const ROADS = [
  { kind: 'imperial', pts: [SOL, P.greyholt, P.thornwick] }, { kind: 'imperial', pts: [SOL, P.ashgate] },
  { kind: 'imperial', pts: [SOL, P.brine, P.highmarch, P.tollhaven] }, { kind: 'imperial', pts: [SOL, P.hollin, P.rookstead] },
  { kind: 'imperial', pts: [SOL, [602, 1000], [610, 860], [612, 742]] }, { kind: 'imperial', pts: [P.ashgate, P.kells] },
  { kind: 'imperial', pts: [P.tollhaven, P.gullwick] }, { kind: 'imperial', pts: [P.greyholt, [480, 1420], P.ashgate] },
  { kind: 'track', pts: [P.thornwick, [330, 1830], P.saltmere, [430, 2010], P.reedholm] },        // the canal road south to the Fens
  { kind: 'track', pts: [[612, 742], [596, 700], [606, 660], [594, 620], [600, 590]] },             // the Pilgrims' Stair, up to the rim's gap
  { kind: 'track', pts: [[600, 590], [600, 530]] },                                               // into the crater
  { kind: 'track', pts: [[612, 742], [420, 440]] }, { kind: 'track', pts: [[612, 742], [790, 470]] },   // the pass roads, Frosthold and the Glass Keep
];

/** the band of the region named @param {string} id */
export const bandOf = (id) => (REGIONS.find((r) => r.id === id) || REGIONS[REGIONS.length - 1]).band;
