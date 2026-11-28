// @ts-check
// convert.js — the sim's world as a Luminati level (docs/luminati-port-plan.md §5; phase 0, the trial build). The owner
// (2026-10-31): "Recreate each emberfall map in luminati." Every map the game has is built by the sim (towns, the
// waystation, the overlands, every dungeon floor of every site, per save seed), so it is converted here at runtime, from
// the world the sim is walking, and what you see is where the sim's walls are. It grew out of the prototype's build-time
// Thornwick (docs/lumina-prototype.md, removed 2026-11-09) and keeps its look tables.
//
// A Luminati tile is two of ours each way (X = x/2, Z = y/2: a figure is 3.5 of our tiles and 1.75 of theirs). The
// ground is ours: grass, dirt, cobble, fields, water and banks (outdoor.js G), a dungeon's floor and walls (level.js
// cells). The structs (envfoot.js footprints) become one of two things, by a table, so either art can stand anywhere
// (the plan's §7, "keep both asset sets in reserve"):
//   · a Luminati object: houses (each region's walls and roofs), trees, rocks, fences, wells, lamps, the small props;
//     the town walls and the overlands' mountains raised as terrain;
//   · an Emberfall sprite (`sprites`, stood by the world page as our baked art): everything Luminati has no match for
//     (mills, ruins, the keep, the Fens' stilt houses, the animals, a milestone).
// The undergrowth is left to Luminati's own ground cover (a quarter of its size: the owner, ember/ground.js).
// Luminati holds a level to 128 units a side (LevelFormat MAX_SIZE): a bigger map is cropped round its middle (the plan's
// §5; the overlands lose a few tiles of their edges).
// Pure: reads the world, writes nothing to it (presentation only, AGENTS.md rule 2).
import { ENV_FOOT, DRAWN_FOOT } from '../sim/envfoot.js';
import { G, REACH, TIDEMARK, wallCells, bareTree, homeWalls, isHome, reachKitOf } from '../sim/outdoor.js';
import { FLOOR_Z } from '../sim/level.js';
import { PROP_LIGHT } from '../render/gsprite.js';
import { KIT_TINT } from '../render/palette.js';
import { SITES } from '../sim/sites.js';
import { CAMP_BY } from '../sim/camps.js';
import { PLANS } from '../sim/plans.js';

/** the most of ours a level takes each way: 128 of Luminati's */
export const MAX_TILES = 256;
/** the ground's height in the level (heights '2': a unit up, as Luminati's own levels stand) and ours (FLOOR_Z) */
export const GROUND_Y = 1, SIM_FLOOR = FLOOR_Z;

const hash = (...v) => { let h = 0x811c9dc5; for (const c of v.join('|')) h = Math.imul(h ^ c.charCodeAt(0), 0x01000193); return h >>> 0; };
const r2 = (v) => Math.round(v * 100) / 100;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

// Luminati's ground types (their sample levels' legend), and the two of ours added: a dungeon's floor and its rock
export const LEGEND = {
  g: { top: 'grass', side: 'cliff', lip: 'grass_side', walkable: true }, G: { top: 'grass_dark', side: 'cliff', lip: 'grass_side', walkable: true },
  f: { top: 'grass_flowers', side: 'cliff', lip: 'grass_side', walkable: true }, F: { top: 'farmland', side: 'dirt_side', walkable: true },
  s: { top: 'sand', side: 'dirt_side', walkable: true }, m: { top: 'moss_stone', side: 'cliff', walkable: true },
  '.': { top: 'dirt_path', side: 'dirt_side', walkable: true }, d: { top: 'dirt', side: 'dirt_side', walkable: true },
  c: { top: 'cobblestone', side: 'stone_wall', walkable: true }, k: { top: 'stone_tiles', side: 'stone_wall', walkable: true },
  b: { top: 'wood_deck', side: 'wood_planks_dark', walkable: true },
  // the earth bank a timber palisade stands on (Thornwick's: PALISADE below), turfed over, its earth showing at the sides
  E: { top: 'grass_dark', side: 'dirt_side', lip: 'grass_side', walkable: true },
  '~': { top: 'riverbed', side: 'cliff', water: true, walkable: false }, o: { top: 'riverbed', side: 'cliff', water: true, walkable: false, flow: 0 },
  T: { top: 'grass_dark', side: 'cliff', lip: 'grass_side', walkable: false }, x: { top: 'moss_stone', side: 'cliff', walkable: false },
  ' ': { void: true },
  // the desert (Luminati's arid set, its set-piece kit): dry earth and scrub, cracked pans, red sand, scree, sandstone, red rock
  a: { top: 'arid_dirt', side: 'arid_dirt_side', walkable: true }, y: { top: 'dry_grass', side: 'arid_dirt_side', lip: 'dry_grass_side', walkable: true },
  e: { top: 'cracked_earth', side: 'arid_dirt_side', walkable: true }, r: { top: 'red_sand', side: 'arid_dirt_side', walkable: true },
  q: { top: 'scree', side: 'arid_dirt_side', walkable: true }, Y: { top: 'sandstone', side: 'sandstone_cliff', walkable: true },
  X: { top: 'redrock', side: 'redrock_cliff', walkable: false },
  // the snow and ice (Luminati's winter set, its season kit): snow, trodden paths, frosted cobbles, ice, frozen water
  n: { top: 'snow_top', side: 'snow_side', walkable: true }, h: { top: 'snow_path', side: 'snow_side', walkable: true },
  R: { top: 'frost_cobble', side: 'stone_wall', walkable: true }, i: { top: 'ice_top', side: 'ice_cliff', walkable: true },
  I: { top: 'ice_top', side: 'ice_cliff', walkable: false }, N: { top: 'snow_top', side: 'snow_side', walkable: false },
  // the Cinder Reach (world doc §3.3; docs/art-critic-pass-reach.md): ash and char, cracked dark earth, black basalt and
  // slag, red rock in patches, rust-stained banks; Ashgate's slag brick (cinder_earth, cinder_cobble, rust_mud and
  // slag_brick, rust_rock, ash_scrub and ash_drift are ours, painted by world.js reachTextures; the rest Luminati's arid set)
  A: { top: 'ash_drift', side: 'basalt_cliff', walkable: true }, H: { top: 'scorched', side: 'basalt_cliff', walkable: true },
  K: { top: 'basalt', side: 'basalt_cliff', walkable: true }, O: { top: 'basalt', side: 'basalt_cliff', walkable: false },
  Q: { top: 'cinder_earth', side: 'basalt_cliff', walkable: true }, M: { top: 'rust_rock', side: 'redrock_cliff', walkable: true },
  L: { top: 'ash_scrub', side: 'basalt_cliff', walkable: true },
  J: { top: 'rust_mud', side: 'basalt_cliff', walkable: true }, V: { top: 'cinder_cobble', side: 'slag_brick', walkable: true },
  Z: { top: 'cinder_cobble', side: 'slag_brick', walkable: false },
  // the dungeons' own stone (part 2 of the Reach's pass; the Fens' kits): the Forgehall's flags and black-and-bronze
  // walls, broken rock with fire in its cracks, the Toadking's mud and his walls of upturned hulls under reed, the locks'
  // slick flags, Vat Seven's sick ones, the abbey's pale cloister (painted by world.js, ours)
  S: { top: 'forge_flag', side: 'forge_stone', walkable: true }, j: { top: 'forge_flag', side: 'forge_stone', walkable: false },
  l: { top: 'magma_floor', side: 'basalt_cliff', walkable: true }, t: { top: 'fen_mud', side: 'dirt_side', walkable: true },
  u: { top: 'roof_thatch', side: 'wood_planks_dark', walkable: false }, w: { top: 'wet_flag', side: 'stone_wall', walkable: true },
  // (step 9, docs/art-critic-pass-tidemark.md) the Drowned Mole's moles: big dressed granite flags, wet, warm grey (the
  // locks' blue-grey tiles read as a bathroom's grid out on a sea wall)
  'µ': { top: 'mole_flag', side: 'stone_wall', walkable: true },
  z: { top: 'sick_flag', side: 'stone_wall', walkable: true }, p: { top: 'abbey_flag', side: 'stone_wall', walkable: true },
  // (round 2: the dungeons' cobbles a mid warm grey, the charcoal ones read black underground; the slag hills' tops lighter
  // than their sides: all basalt, they stood as black stepped blobs)
  // (round 3: ash-topped, every step of a hill's terraces stood out pale, a ziggurat: char tops, a step lighter than the
  // basalt sides, the hill one form)
  '%': { top: 'dun_cobble', side: 'stone_wall', walkable: true }, '&': { top: 'scorched', side: 'basalt_cliff', walkable: false },
  // a dungeon's own stone (port step 3, by its kit): dressed walls, bare rock underfoot, standing water
  B: { top: 'crag', side: 'stone_brick', walkable: false }, U: { top: 'crag', side: 'cliff', walkable: true },
  P: { top: 'riverbed', side: 'cliff', walkable: true },
  // a built room's walls by what it was (the dressing pass): the dig's raw earth, the crypt's dressed limestone, the
  // chapel's pale sandstone under moss (the keep's and the muster's stone brick stay B)
  D: { top: 'dirt', side: 'dirt_side', walkable: false }, W: { top: 'crag', side: 'stone_wall', walkable: false },
  C: { top: 'moss_stone', side: 'sandstone_brick', walkable: false },
  // the Shuttered Inn (docs/tavern-dungeon.md; the owner's reference, 2026-11-22): warm flagstones, a worn and sooted
  // second flag, walls of dressed grey-buff stone blocks capped in dark timber (painted by world.js, ours)
  '#': { top: 'tavern_flag', side: 'tavern_wall', walkable: true }, '=': { top: 'tavern_flag_worn', side: 'tavern_wall', walkable: true },
  '@': { top: 'tavern_cap', side: 'tavern_wall', walkable: false },
  // its cellar's rough rubble walls (round 5: "a cellar should feel lower and rougher")
  '+': { top: 'tavern_rubble', side: 'tavern_rubble', walkable: false },
  // the Haddow Crypt (docs/crypt-dungeon.md; the owner, 2026-11-22: "a similar dungeon style as the inside of a crypt"):
  // pale limestone slabs, the family's ledger stones let into the floor among them, walls of pale dressed ashlar capped
  // in stone; the ossuary's walls built of the dead's own bones (painted by world.js, ours)
  '!': { top: 'crypt_flag', side: 'crypt_wall', walkable: true }, '$': { top: 'crypt_ledger', side: 'crypt_wall', walkable: true },
  '*': { top: 'crypt_top', side: 'crypt_wall', walkable: false },
  ':': { top: 'crypt_top', side: 'ossuary_wall', walkable: false },
  // its near walls, the sills, a quarter darker than the back walls so the arcade holds the light (round 5)
  ';': { top: 'crypt_sill_top', side: 'crypt_sill', walkable: false },
  // a wharf's decks (docs/docks-dungeon.md): weathered grey planks, and under them only the dark, the piles and the weed
  // at the waterline (round 1: the engine's plank sides read as a stone quay wall)
  _: { top: 'dock_deck', side: 'dock_side', walkable: true },
  // the ramparts (docs/ramparts-dungeon.md): the street behind each terrace the houses stand on, and the parapet's stone
  ']': { top: 'rampart_cobble', side: 'rampart_wall', walkable: false }, '[': { top: 'rampart_top', side: 'rampart_wall', walkable: false },
  '{': { top: 'rampart_cobble', side: 'rampart_wall', walkable: true },   // (its terraces' cobbles, quieter than the town's: round 1, "the foes lost in the speckle")
  // the Seventh's Palace (v1.154, docs/tidemark-plan.md step 6; docs/art-critic-pass-palace.md): polished marble flags laid
  // in a broad checker of honey and rose-grey, the courtyard's yard flags, walls of warm dressed limestone under a marble
  // arcade (palaceRun), the near sills a step darker (painted by world.js, ours)
  '(': { top: 'palace_flag', side: 'palace_wall', walkable: true }, ')': { top: 'palace_flag2', side: 'palace_wall', walkable: true },
  '/': { top: 'palace_yard', side: 'palace_wall', walkable: true },
  // water indoors (docs/water-indoors.md): the Fens' own stone, a pale blue-grey ashlar gone green at the waterline and weed
  // below it (the Canal Locks); the abbey's pale stone above its flood line, darker and weeded under it; a channel's deep
  // water (sunk, Luminati's own water over it); its banks, each kit's floor over its own walling down into the channel; the
  // abbey garth's drowned turf (painted by world.js, ours; a channel's bridges are the wharf's decks, `_`)
  'α': { top: 'crag', side: 'fen_wall', walkable: false }, 'β': { top: 'crag', side: 'abbey_wall', walkable: false },
  'γ': { top: 'riverbed', side: 'fen_wall', water: true, walkable: false },
  'ε': { top: 'wet_flag', side: 'fen_wall', walkable: true }, 'ζ': { top: 'sick_flag', side: 'fen_wall', walkable: true },
  'η': { top: 'abbey_flag', side: 'abbey_wall', walkable: true }, 'θ': { top: 'drowned_turf', side: 'abbey_wall', walkable: true },
  '|': { top: 'palace_top', side: 'palace_wall', walkable: false },
  '?': { top: 'palace_sill_top', side: 'palace_sill', walkable: false },
  // the Reedholm Undercroft (docs/dungeon-looks-plan.md item 6; docs/art-critic-pass-stone.md): the reed town's brick, narrow
  // and dark red, lime-washed in patches, vaulted on the crypt kit's plan; brick paviors underfoot in a herringbone, mud in
  // the joints; the near sills cut in the peat the undercroft was dug from; the bone room's bones packed into peat
  'ж': { top: 'fen_paver', side: 'fen_brick', walkable: true },
  'б': { top: 'fen_top', side: 'fen_brick', walkable: false }, 'п': { top: 'fen_top', side: 'fen_bones', walkable: false },
  'т': { top: 'fen_peat_top', side: 'fen_peat', walkable: false },
  // the counting house (item 9: the quota office, the look `counting`): dressed pale stone, swept pale flags, a scuffed one
  // among them, the near sills a step darker
  'с': { top: 'count_top', side: 'count_wall', walkable: false }, 'ч': { top: 'count_top', side: 'count_sill', walkable: false },
  'к': { top: 'count_flag', side: 'count_wall', walkable: true }, 'л': { top: 'count_flag_worn', side: 'count_wall', walkable: true },
  // the greenwood (docs/greenwood-dungeon.md; the Root Granary's way in, from the owner's two references): the glades' moss
  // and fern with stones in it, leaf litter in drifts, the Tithe Road's cracked flags half swallowed; off the glades the wood's
  // own ground a step up, its banks earth and roots (painted by world.js, ours). Runic letters: clear of every other kit's
  ['\u16A0']: { top: 'wood_moss', side: 'wood_bank', walkable: true }, ['\u16A2']: { top: 'wood_litter', side: 'wood_bank', walkable: true },
  ['\u16A6']: { top: 'tithe_flag', side: 'wood_bank', walkable: true }, ['\u16A8']: { top: 'wood_ground', side: 'wood_bank', walkable: false },
  // its stair up: the empire's grey steps, flagged and in ashlar (round 10: the shared stair tiles read as a pallet)
  ['\u16AA']: { top: 'tithe_flag', side: 'wood_ashlar', riser: 'wood_ashlar', stairs: 'N', walkable: true }, ['\u16AB']: { top: 'tithe_flag', side: 'wood_ashlar', riser: 'wood_ashlar', stairs: 'W', walkable: true },
  ['\u16AC']: { top: 'tithe_flag', side: 'wood_ashlar', riser: 'wood_ashlar', stairs: 'S', walkable: true }, ['\u16AD']: { top: 'tithe_flag', side: 'wood_ashlar', riser: 'wood_ashlar', stairs: 'E', walkable: true },
  // a dungeon's stairs (Luminati's stair tiles, its own characters for them): each climbs one level toward its side
  '^': { top: 'stone_tiles', side: 'stone_wall', riser: 'stone_wall', stairs: 'N', walkable: true }, v: { top: 'stone_tiles', side: 'stone_wall', riser: 'stone_wall', stairs: 'S', walkable: true },
  '>': { top: 'stone_tiles', side: 'stone_wall', riser: 'stone_wall', stairs: 'E', walkable: true }, '<': { top: 'stone_tiles', side: 'stone_wall', riser: 'stone_wall', stairs: 'W', walkable: true },
};
// the Tidemark's coast (docs/dungeon-looks-plan.md item 7; docs/strand-dungeon.md; painted by world.js, ours): the sea
// cave's wet black rock ('Σ' its walls, 'Ξ' an outcrop or the isle's rock over a cave) and its shingle ('Π'); the strand's
// sand, dry ('Δ') and wet ('Λ'), the dunes behind it ('Φ', and 'Ψ' a dune you walk on, the overland's); a rock pool ('Ω':
// a skin of still water over its bed, walked through, the figures at the floor's height); the sea ('Γ': over wet sand,
// its surface the level's)
Object.assign(LEGEND, {
  'Σ': { top: 'sea_rock_top', side: 'sea_rock', walkable: false }, 'Ξ': { top: 'sea_rock_top', side: 'sea_rock', walkable: false },
  'Π': { top: 'sea_shingle', side: 'sea_rock', walkable: true },
  'Δ': { top: 'strand_sand', side: 'dune_sand', walkable: true }, 'Λ': { top: 'wet_sand', side: 'wet_sand', walkable: true },
  'Φ': { top: 'dune_sand', side: 'dune_sand', walkable: false }, 'Ψ': { top: 'dune_sand', side: 'dune_sand', walkable: true },
  'Ω': { top: 'pool_bed', side: 'sea_rock', water: true, walkable: true, waterDepth: 0.05, flow: 0 },
  'Γ': { top: 'wet_sand', side: 'wet_sand', water: true, walkable: false, flow: [0.02, 0.05] },
  'Θ': { top: '', side: 'wet_sand', water: true, walkable: false, flow: [0.02, 0.05] },   // (the deep sea: no bed drawn, coastGround)
});
// the pass (docs/pass-dungeon.md; docs/dungeon-looks-plan.md items 13 and 10, the owner's three references): the ledges'
// snowfield, wind-scoured and flecked with grit, a scoured patch of it; the dark blue-grey rock in big facets with snow on
// its tops, and the gully's brown; the bridge's planks over its truss; the Praetory's walls, dressed stone under rime
// (painted by world.js, ours; letters picked clear of every other kit's)
Object.assign(LEGEND, {
  'ა': { top: 'pass_snow', side: 'pass_rock', walkable: true }, 'ბ': { top: 'pass_scour', side: 'pass_rock', walkable: true },
  'გ': { top: 'pass_cap', side: 'pass_rock', walkable: false }, 'დ': { top: 'pass_cap', side: 'pass_brown', walkable: false },
  'ე': { top: 'pass_plank', side: 'pass_truss', walkable: true },
  'ვ': { top: 'pass_cap', side: 'frost_wall', walkable: false }, 'ზ': { top: 'frost_flag', side: 'frost_wall', walkable: true }, 'თ': { top: 'pass_snow', side: 'frost_wall', walkable: true },
});
// a town's walls by its region (the owner, 2026-11-02: "bring back the wooden walls to thornwick? Save stone walls for
// another town"): the Vale's are Thornwick's timber palisade on an earth bank, with its watchtowers and gatehouse (world
// doc §3.1), as Emberlit draws them: our own baked pieces (town-vale's curtain, tower, gatehouse) stood on a bank one
// step high. Luminati has no palisade (its wood runs as log-cabin courses, and its stakes are a battlefield's
// barricade). Elsewhere the walls are raised in stone, as before.
const PALISADE = new Set(['vale']);
// a region's buildings in Luminati's walls and roofs, by our piece: the Vale's timber, plaster and thatch (stone for the
// shrine and the forge), the Fens' dark planks and reed, the Reach's black slag-brick and slate, the Heights' stone
/** @type {[RegExp, Record<string, any>][]} */
const HOUSES = [
  [/_temple_/, { wall: 'stone_brick', roof: 'roof_slate', stories: 2, chimney: false }],
  [/_tavern_/, { wall: 'timber_frame', roof: 'roof_thatch', stories: 2, sign: true }],
  [/_shop_/, { wall: 'plaster', roof: 'roof_red', stories: 1, sign: true, doorHood: true }],
  [/_smith_/, { wall: 'stone_brick', roof: 'roof_slate', stories: 1, sign: true }],
  [/_inn_/, { wall: 'stone_brick', upperWall: 'timber_frame', roof: 'roof_red', stories: 2, sign: true }],
  [/_longhousex?_/, { wall: 'log_wall', roof: 'roof_thatch', stories: 1 }],
  [/_workshopx?_/, { wall: 'wood_planks', roof: 'roof_slate', stories: 1 }],
  [/_cottagex?_/, { wall: 'plaster', roof: 'roof_thatch', stories: 1 }],
  [/_housex?_/, { wall: 'timber_frame', roof: 'roof_thatch', stories: 2 }],
  [/_farmx?_/, { wall: 'wood_planks_dark', roof: 'roof_thatch', stories: 1 }],
];
const REGION_LOOK = {
  vale: {},
  fens: { wall: 'wood_planks_dark', upperWall: '', roof: 'roof_thatch' },
  // (the Reach critic, round 1: its houses read as the Heights' blue-slate cottages; Ashgate's are black slag brick under
  // rust tile, the odd roof gone to soot, a timber upper storey dark with it: world doc §3.3)
  reach: { wall: 'slag_brick', upperWall: '', roof: 'roof_rust', roofs: ['roof_rust', 'roof_rust', 'roof_rust', 'roof_charred'], uppers: ['', '', 'wood_planks_dark'], stone: 'charred_wall' },
  heights: { wall: 'stone_brick', upperWall: '', roof: 'roof_slate' },
  // (v1.150) Tollhaven's grey harbour stone, brick-red render over it on the inns, weathered red tile (world doc §3.7)
  tidemark: { wall: 'stone_brick', upperWall: 'plaster', roof: 'roof_red', roofs: ['roof_red', 'roof_red', 'roof_slate'] },
};
const TREES = { oak: 'oak', autumn: 'autumn', birch: 'birch', pine: 'pine', dead: 'deadwood', alder: 'oak', willow: 'birch', carr: 'oak' };   // (carr, a living alder thicket, was deadwood: bare trees out on the marsh, against §3.6: the foliage critic, round 3)
// The biomes (the owner, 2026-10-31: "create assets/tiles in the new engine to cover desert/grassland, and icy/snowy
// areas"): a region's look in Luminati's own tile sets. `ground` redraws our ground's tile (outdoor.js G, by the
// grassland's character), `turf` scatters the open ground, `trees` and `stone` are the region's kinds, `mountain` the tile
// a mountain's footprint is raised in, and `env` the level's light (Luminati's arid day; its winter).
//   grassland: the Vale and the Fens, as before;  desert: the Cinder Reach (dry earth, cracked pans, red sand, scree,
//   red rock, junipers and the dead);  snow: the Pale Heights (snow, trodden paths, frozen water, snow pines, bare trees).
/** @type {Record<string, { ground: Record<string, string>, water?: string, turf: (h: number, i: number, j: number) => string, scree?: (i: number, j: number) => string, trees: Record<string, string>, stone: string, mountain: string, wall?: string, env: Record<string, any> }>} */
export const BIOMES = {
  grassland: { ground: {}, turf: (h) => (h < 12 ? 'G' : h < 16 ? 'f' : 'g'), trees: {}, stone: '', mountain: 'x', env: {} },
  // the Hollow Vale's: mostly Luminati's dark grass (Emberlit's Vale is olive; its bright grass is a summer's), a little bright
  vale: { ground: {}, turf: (h) => (h < 58 ? 'G' : h < 62 ? 'f' : 'g'), trees: {}, stone: '', mountain: 'x', env: {} },
  desert: { ground: { '.': 'e', c: 'Y', s: 'r', F: 'e', G: 'y', d: 'q', m: 'q' }, turf: (h) => (h < 52 ? 'a' : h < 76 ? 'y' : h < 90 ? 'e' : 'r'),
    trees: { oak: 'juniper', autumn: 'juniper', birch: 'deadwood', pine: 'juniper', deadwood: 'deadwood' }, stone: 'redrock', mountain: 'X', env: { climate: 'arid' } },
  snow: { ground: { '.': 'h', c: 'R', F: 'n', G: 'n', d: 'q', s: 'n' }, water: 'I', turf: (h) => (h < 82 ? 'n' : h < 93 ? 'h' : 'q'),   // (no green: Luminati's turf is a summer's)
    trees: { oak: 'bare', autumn: 'bare', birch: 'bare', pine: 'snowpine', deadwood: 'bare' }, stone: 'snow', mountain: 'N', env: { season: 'winter' } },
  // the Cinder Reach (world doc §3.3: "black hills of slag … someone has lit the furnaces again"; the critic pass,
  // docs/art-critic-pass-reach.md). The desert read as the Sahara: orange sand everywhere, green junipers. Here the open
  // ground is ash in drifts over char and cracked dark earth, black basalt breaking through, a thin fringe of dry scrub
  // between (in broad patches, value noise, not a checkerboard of tiles); the roads cracked dark earth, the town's cobbles
  // charcoal, the banks rust-stained; the scree patches (outdoor.js G.SCREE) red rock and cracked earth; the hills basalt;
  // the trees dead; the rocks black, red where the ground is. Luminati's arid climate stays (its set-piece kit, the
  // textures, the dust), its sky graded to ash (world.js ASH_KEYFRAMES).
  ash: { ground: { '.': 'Q', c: 'V', s: 'J', F: 'Q', G: 'H', m: 'K' }, turf: (h, i, j) => ashTurf(h, i, j), scree: (i, j) => (vnoise(i, j, 'r', 4) < 0.32 ? 'M' : 'Q'),
    trees: { oak: 'deadwood', autumn: 'deadwood', birch: 'deadwood', pine: 'deadwood', juniper: 'deadwood', deadwood: 'deadwood' }, stone: 'basalt', mountain: '&', wall: 'Z',
    env: { climate: 'arid', dust: true } },
};
/** the biome a region draws in */
export const BIOME_OF = { vale: 'vale', fens: 'grassland', reach: 'ash', heights: 'snow', tidemark: 'grassland' };
/** smooth value noise in 0..1 over a level's tiles, `cell` tiles a lattice step (presentation: a hash, no sim stream) */
function vnoise(i, j, s, cell) {
  const x = i / cell, y = j / cell, x0 = Math.floor(x), y0 = Math.floor(y), sm = (t) => t * t * (3 - 2 * t), u = sm(x - x0), v = sm(y - y0);
  const f = (a, b) => (hash(s, a, b) % 1000) / 1000, a = f(x0, y0), b = f(x0 + 1, y0), c = f(x0, y0 + 1), d = f(x0 + 1, y0 + 1);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}
/** the Reach's open ground by tile: ash, a fringe of scrub, char, cracked earth, ash again, basalt breaking through */
// (round 2: in an order of value, light to dark, so each patch meets the next a step darker, not white on black; broad
// patches with a little edge: tile-sized specks of white ash on char read as a mosaic at the game's camera)
function ashTurf(h, i, j) {
  const t = 0.75 * vnoise(i, j, 'a', 10) + 0.25 * vnoise(i, j, 'b', 4) + (h / 100 - 0.5) * 0.03;
  return t < 0.4 ? 'A' : t < 0.48 ? 'L' : t < 0.6 ? 'Q' : t < 0.7 ? 'H' : t < 0.8 ? 'Q' : 'K';
}
// our ground (outdoor.js G: grass dirt cobble water bank field marsh pool deck, the Reach's and the Heights' scree and
// snow) as Luminati's tile and height (snow as its pale sand: Luminati's snow stone is The Bells of Evermere's own)
const GROUND = [['g', '2'], ['.', '2'], ['c', '2'], ['~', '0'], ['s', '1'], ['F', '2'], ['G', '2'], ['o', '0'], ['b', '2'], ['d', '2'], ['s', '2'], ['s', '2']];   // (v1.150: the Tidemark's sand)
// MARSH_FRONT: the Sunken Chapel's water reaches this far in front of its middle (sim tiles; its porch stands dry past it).
// KEEP_FACE: Wickham Keep's door face before its middle (sim tiles: buildkit keep's front wall, 0.475 kit units, and the torch's plate).
const MARSH_FRONT = 5, KEEP_FACE = 4.8;
// a bridge's deck, Luminati's units across: the sim's walkable deck (outdoor.js 'deck') is the tiles whose middles lie within
// 3.2 of its line, up to 3 out; at 2.8 (2.8 tiles each side) its rails stood across the outer rows (docs/pathing-audit.md)
const BRIDGE_W = 3.4;
const RANK = { c: 4, b: 4, '~': 5, o: 5, '.': 3, F: 2, s: 2, d: 2, G: 1, g: 0 };

/**
 * The world the sim is in, as a Luminati level, and the pieces of our own art to stand in it.
 * @param {any} w the sim's world (sim.world)
 * @param {{ region?: string, stairs?: string, walls?: string}} [o]
 * @returns {{ level: any, ambient?: { sky: number[], ground: number[], i: number, sun: number, lamps: number }, hour?: number, sprites: { id?: string, prop?: string, tx?: number, ty?: number, flat?: boolean, here?: boolean, fleet?: { lit: boolean, pieces: any[] }, x: number, z: number }[], figures?: { name: string, x: number, z: number, air: number, row: number }[], origin: { x: number, y: number }, stats: Record<string, number> }}
 */
export function convertWorld(w, o = {}) {
  return w.arena ? arena(w, o) : w.kind === 'dungeon' ? dungeon(w, o) : outdoor(w, o.region || w.region || 'vale');
}

/** a crop of ours, its tiles even and at most MAX_TILES a side, round a middle */
function crop(x0, y0, x1, y1, mx, my) {
  // (over the size Luminati holds: the window round m, kept inside the bounds: a window past them held nothing, and a
  // cavern's stairwell fell outside it)
  const cut = (a, b, m) => {
    a = Math.floor(a / 2) * 2; b = Math.ceil(b / 2) * 2;
    if (b - a > MAX_TILES) { a = Math.min(Math.max(Math.floor((m - MAX_TILES / 2) / 2) * 2, a), b - MAX_TILES); b = a + MAX_TILES; }
    return [a, b];
  };
  const [ax, bx] = cut(x0, x1, mx), [ay, by] = cut(y0, y1, my);
  return { x0: ax, y0: ay, W: (bx - ax) / 2, D: (by - ay) / 2 };
}
const grid = (w, d, ch) => Array.from({ length: d }, () => Array(w).fill(ch));
const rows = (g) => g.map((r) => r.join(''));
function frame({ name, W, D, environment, tiles, heights, objects, spawn, water = null, waterLevel = 0.4 }) {
  // (only the tiles the level uses: Luminati loads its desert's and its winter's kits for a legend that names theirs)
  const used = new Set(tiles.flat()), legend = Object.fromEntries(Object.entries(LEGEND).filter(([ch]) => used.has(ch)));
  return { format: 'luminati-level', version: 1, name, subtitle: '', author: 'Emberfall', description: 'Converted at runtime from the sim (src/render3d/convert.js).',
    width: W, depth: D, waterLevel, water: water || { flow: [0, 0.45], reflect: 0.2, neutral: 0.2 }, legend,
    environment: { clock: false, weather: 'clear', music: false, dust: false, camera: null, highGround: null, ...environment },
    spawn, tiles: rows(tiles), heights: rows(heights), objects };
}

// ── towns and overlands ─────────────────────────────────────────────────────────────────────────────────────────────
// The Reach's industry (outdoor.js buildReach): a tower within reach of the Cinderworks or the Magma Vault's mouth is a
// furnace stack, not a wall tower or a road's beacon (a `_stack_` id, should the sim name them, is one anywhere); the
// works' smithy is its furnace hall. STACK_H: the stack's lip over the ground, Luminati's units (buildkit.js stack, 1.86
// kit units × world.js KIT_UNIT); SMOKE: its smoke, sootier and heavier than a chimney's.
const STACK_H = 9.3, VENTS = 24;
const SMOKE = { color: '#5a5450', colorEnd: '#8e8884', size: [0.7, 1.0], sizeEnd: 5.5, life: [5, 8.5], alpha: 0.55, velocity: [0, 1.1, 0] };
const near = (s, at, r) => at && Math.abs(s.x - at[0]) < r && Math.abs(s.y - at[1]) < r;
const stackAt = (region, w, s) => region === 'reach' && w.kind === 'overland' && (/_stack_/.test(s.id) || (/_tower_\d/.test(s.id) && (near(s, REACH.works, 16) || near(s, REACH.vault, 16))));
// (the Reach's site doors on the overland, part 2, and the Cinderworks' furnace hall: the sim's REACH_KIT, outdoor.js reachKitOf)
/** Furnace Nine's yard (the region boss's ground, camps.js reach_mouth: the furnace yard west of the Vault's ruin, its
 *  arena cleared of scatter): char and cracked earth to its reach, slag heaps just past its arena, vents inside them */
const FURNACE_YARD = { vents: 10 };
/** the Grace's place in her window (sim tiles): in Gullwick's bay east-south-east of the wreckers' camp (161.5, 246.5),
 *  her near side where her broadside's lanes begin (about 189, 255: past the arena's edge), lying east and west; partly past
 *  the level's crop, on world.js's sea (round 1, at 186, 252 and full size, she sat against the shore and read beached) */
const GRACE_SHIP = [192, 259];
/** the wreckers' wreck: in the shallows off their camp's south shore (the sand ends at y 254 there), all of it in the water */
const WRECKAGE = [173, 257];
/** the boats moored at Tollhaven's jetties (sim tiles, the town's: each her middle 2.4 tiles east of a jetty's edge) */
const MOORED = [[150, 28], [170, 21], [190, 33]];
/** the Tidemark's two waiting boats (town.json tidemark_ferry, tidemark_fleetboat; buildkit.js skiff): her middle, in sim
 *  tiles, alongside the jetty's end (outdoor.js: the ferry jetty from [198, 234] to TIDEMARK.ferry, the landing jetty from
 *  [164, 18] to TIDEMARK.isles), her post on its edge; her lantern and the boatman's place in her stern, from her middle;
 *  the boatman's facing (an atlas row: toward the jetty and the camera). BOAT_FLOOR: her floorboards over the sea floor,
 *  Luminati's units (buildkit.js skiff F, 0.115 of a kit unit, × KIT_UNIT) */
const BOATS = [
  { site: 'drowned_mole', id: 'tidemark_ferry', at: [207.4, 254.5], lamp: [-1.2, -1.6], stern: [0, -1.6], man: 'npc_ferryman', row: 1 },
  { site: 'gull_isles', id: 'tidemark_fleetboat', at: [177, 8.8], lamp: [-1.6, 1.2], stern: [-1.6, 0], man: 'npc_fleet_boatman', row: 1 },
];
const BOAT_FLOOR = 0.575;
/** the Grace's middle east of the Sister's Cabin's door (sim tiles: outdoor.js TIDEMARK.reef), her bow on the shallows */
const GRACE_OFF = 13;
function outdoor(w, region) {
  // the map, its approach roads (a town's exits lie past its edge) and a margin; never past the grid the sim built
  let bx0 = 0, by0 = 0, bx1 = w.W, by1 = w.H;
  for (const e of w.exits || []) { bx0 = Math.min(bx0, e.x0); by0 = Math.min(by0, e.y0); bx1 = Math.max(bx1, e.x1); by1 = Math.max(by1, e.y1); }
  // (step 9, docs/art-critic-pass-tidemark.md) Tollhaven's harbour: its jetties run out past the town's edge into the
  // grid's margin (outdoor.js buildTown), and the crop cut them off: the quay ended in open water. Its deck roads kept in
  if (region === 'tidemark' && w.kind !== 'overland') for (const r of w.roads || []) if (r.surface === 'deck') for (const [x, y] of r.pts) { bx0 = Math.min(bx0, x - 4); by0 = Math.min(by0, y - 4); bx1 = Math.max(bx1, x + 4); by1 = Math.max(by1, y + 4); }
  bx0 = Math.max(-w.PAD, bx0 - 8); by0 = Math.max(-w.PAD, by0 - 8); bx1 = Math.min(w.W + w.PAD, bx1 + 8); by1 = Math.min(w.H + w.PAD, by1 + 8);
  const C = crop(bx0, by0, bx1, by1, w.W / 2, w.H / 2), { x0, y0, W, D } = C;
  const X = (x) => r2((x - x0) / 2), Z = (y) => r2((y - y0) / 2);
  const tm = (x, y) => { const gx = x + w.PAD, gy = y + w.PAD; return gx >= 0 && gy >= 0 && gx < w.GW && gy < w.GH ? w.tmat[gy * w.GW + gx] : 0; };
  const B = BIOMES[BIOME_OF[region] || 'grassland'];
  const tiles = grid(W, D, 'g'), heights = grid(W, D, '2');
  for (let j = 0; j < D; j++) for (let i = 0; i < W; i++) {
    const n = new Map();                                       // (by our ground's index: the Fens' bank and the Heights' snow share a tile)
    for (const [dx, dy] of [[0, 0], [1, 0], [0, 1], [1, 1]]) { const t = GROUND[tm(x0 + 2 * i + dx, y0 + 2 * j + dy)] ? tm(x0 + 2 * i + dx, y0 + 2 * j + dy) : 0; n.set(t, (n.get(t) || 0) + 1); }
    // (step 9: on the Tidemark a jetty's deck takes its cell: two of our tiles wide or less, Tollhaven's three jetties lost
    // the vote to the water round them and the harbour had none; docs/art-critic-pass-tidemark.md)
    const t = region === 'tidemark' && n.has(G.DECK) ? G.DECK : [...n.keys()].sort((a, b) => n.get(b) - n.get(a) || (RANK[GROUND[b][0]] ?? 0) - (RANK[GROUND[a][0]] ?? 0))[0];
    let c = GROUND[t][0], hh = GROUND[t][1];
    if (c === 'g') c = B.turf(hash('g', i, j) % 100, i, j);   // (the open ground: the region's turf, scrub or snow)
    else if ((c === '~' || c === 'o') && B.water) { c = B.water; hh = '1'; }   // (the Heights' water frozen over: ice, at the bank's height)
    else if (c === 'd' && B.scree) c = B.scree(i, j);          // (the Reach's scree patches: red rock and cracked earth)
    else c = B.ground[c] ?? c;
    tiles[j][i] = c; heights[j][i] = hh;
  }
  const objects = [], sprites = [], count = {};
  const add = (ob) => { count[ob.type] = (count[ob.type] || 0) + 1; objects.push({ id: `${ob.type}_${count[ob.type]}`, ...ob }); };
  const inside = (x, z, m = 0.5) => x > m && z > m && x < W - m && z < D - m;
  const foot = (s) => { const f = ENV_FOOT[s.id] || DRAWN_FOOT[s.id]; if (!f) return null; return { cx: X(s.x + (f[0] + f[2]) / 2), cz: Z(s.y + (f[1] + f[3]) / 2), w: (f[2] - f[0]) / 2, d: (f[3] - f[1]) / 2, f }; };
  const services = new Map((w.services || []).map((v) => [v.id, v]));
  // raised ground under a footprint (the town's walls; a mountain, highest at its middle)
  const raise = (s, level, ch, dome = false) => {
    const f = ENV_FOOT[s.id]; if (!f) return;
    const i0 = Math.floor((s.x + f[0] - x0) / 2), i1 = Math.ceil((s.x + f[2] - x0) / 2), j0 = Math.floor((s.y + f[1] - y0) / 2), j1 = Math.ceil((s.y + f[3] - y0) / 2);
    for (let j = j0; j < j1; j++) for (let i = i0; i < i1; i++) {
      if (i < 0 || j < 0 || i >= W || j >= D) continue;
      let h = level;
      if (dome) {
        const u = ((i + 0.5 - (i0 + i1) / 2) / ((i1 - i0) / 2)) ** 2 + ((j + 0.5 - (j0 + j1) / 2) / ((j1 - j0) / 2)) ** 2; if (u > 1) continue; h = Math.round(3 + (level - 3) * (1 - u));
        // (above a step only where the sim walls the whole cell: outdoor.js MOUNT_SHRINK; a step's rise is walked up)
        const tx = x0 + 2 * i, ty = y0 + 2 * j; if (h > 3 && !(blockedAt(tx, ty) && blockedAt(tx + 1, ty) && blockedAt(tx, ty + 1) && blockedAt(tx + 1, ty + 1))) h = 3;
      }
      const cur = parseInt(heights[j][i], 36);
      if (cur < h) { tiles[j][i] = ch; heights[j][i] = h.toString(36); }
    }
  };
  // a stone wall piece the sim walls on whole cells (outdoor.js wallCells, `cells`): raised on just those cells, every tile of
  // which the sim blocks (a gate's way through left at the ground): what you see is where its wall is (docs/pathing-audit.md:
  // raised over its whole footprint, four tiles thick and its gatehouse ten wide over the sim's one and three, the party
  // walked along on top of Ashgate's walls)
  const blockedAt = (x, y) => { const gx = x + w.PAD, gy = y + w.PAD; return gx >= 0 && gy >= 0 && gx < w.GW && gy < w.GH && w.blocked[gy * w.GW + gx] === 1; };
  const raiseCells = (s, level, ch) => {
    const [a, b, c, d] = wallCells(s.id, s.x, s.y);
    for (let ty = b; ty <= d; ty += 2) for (let tx = a; tx <= c; tx += 2) {
      if (!(blockedAt(tx, ty) && blockedAt(tx + 1, ty) && blockedAt(tx, ty + 1) && blockedAt(tx + 1, ty + 1))) continue;
      const i = (tx - x0) / 2, j = (ty - y0) / 2;
      if (i < 0 || j < 0 || i >= W || j >= D) continue;
      if (parseInt(heights[j][i], 36) < level) { tiles[j][i] = ch; heights[j][i] = level.toString(36); }
    }
  };
  /** the tiles the sim walls inside a piece's footprint */
  const walledNear = (s, f) => { let n = 0; for (let y = Math.floor(s.y + f[1]); y <= Math.floor(s.y + f[3]); y++) for (let x = Math.floor(s.x + f[0]); x <= Math.floor(s.x + f[2]); x++) if (blockedAt(x, y)) n++; return n; };
  const gates = [], timber = PALISADE.has(region), stoneWall = B.wall || 'k';
  // a tower out on the Reach's roads, away from any wall, is a dead beacon (outdoor.js beacons): our kit's drum tower
  // (town.json reach_tower_1) stood on the ground, not a block of slag brick raised under it (round 1: a black slab)
  const walls = region === 'reach' && w.kind === 'overland' ? w.structs.filter((q) => /_curtainy?_\d|_gatehousey?_\d/.test(q.id)) : [];
  const beacon = (s) => walls.length > 0 && /_tower_\d/.test(s.id) && !stackAt(region, w, s) && !walls.some((q) => Math.abs(q.x - s.x) < 14 && Math.abs(q.y - s.y) < 14);
  for (const s of w.structs) {
    const up = s.cells ? raiseCells : raise;
    if (/_curtainy?_\d/.test(s.id)) up(s, timber ? 3 : 6, timber ? 'E' : stoneWall);
    else if (/_tower_\d/.test(s.id)) { if (!stackAt(region, w, s) && !beacon(s)) up(s, timber ? 3 : 8, timber ? 'E' : stoneWall); }   // (a Cinderworks stack, a beacon: ours, below)
    else if (/_gatehousey?_\d/.test(s.id)) { up(s, timber ? 3 : 8, timber ? 'E' : stoneWall); gates.push(s); }
    else if (/^mountain_/.test(s.id)) raise(s, /massif/.test(s.id) ? 16 : 11, B.mountain, true);
  }
  // the roads through a gate stay open (the sim walks them)
  for (const g of gates) for (const r of w.roads || []) for (let k = 0; k + 1 < r.pts.length; k++) {
    const [a, b] = [r.pts[k], r.pts[k + 1]];
    for (let t = 0; t <= 1; t += 0.01) {
      const x = a[0] + (b[0] - a[0]) * t, y = a[1] + (b[1] - a[1]) * t;
      if (Math.abs(x - g.x) > 8 || Math.abs(y - g.y) > 16) continue;
      for (let ox = -r.w / 2; ox <= r.w / 2; ox += 1) for (let oy = -r.w / 2; oy <= r.w / 2; oy += 1) {
        const i = Math.floor((x + ox - x0) / 2), j = Math.floor((y + oy - y0) / 2);
        if (i >= 0 && j >= 0 && i < W && j < D) { tiles[j][i] = B.ground.c || 'c'; heights[j][i] = '2'; }
      }
    }
  }
  const raised = (x, z) => { const i = Math.floor(x), j = Math.floor(z); return i < 0 || j < 0 || i >= W || j >= D || heights[j][i] !== '2'; };
  const look = REGION_LOOK[region] || {}, reach = region === 'reach';
  // a furnace stack (our kit's, town.json 'reach_stack': STACK_H units to its lip): its smoke, a few sparks
  // and, by night, the glow of its lip
  const stack = (x, z, h) => {
    sprites.push({ id: 'reach_stack', x, z });
    add({ type: 'emitter', x, z, preset: 'smoke', dy: STACK_H, size: [0.6, 0.4, 0.6], count: 26, params: SMOKE });
    add({ type: 'emitter', x, z, preset: 'embers', dy: STACK_H - 0.2, size: [0.4, 0.2, 0.4], count: 10, params: { life: [1.2, 2.6], velocity: [0, 1.8, 0] } });
    if (h % 2 === 0) add({ type: 'light', x, z, dy: STACK_H + 0.4, color: '#ff7a30', intensity: 4, distance: 6, flicker: 0.2, nightOnly: true });
  };
  // the Cinderworks' furnace hall (ours, 'reach_works'), its mouth glowing on the yard, embers and smoke over its roof
  const works = (s, p) => {
    sprites.push({ id: 'reach_works', x: p.cx, z: p.cz });
    add({ type: 'fire', x: r2(p.cx + 0.6), z: r2(p.cz + p.d - 0.6), opts: { kind: 'embers', size: 0.9, smoke: false, light: true, seed: hash('w', s.x) % 997 } });
    add({ type: 'emitter', x: r2(p.cx + 0.1), z: r2(p.cz - 1.25), preset: 'smoke', dy: 5.1, size: [0.6, 0.3, 0.6], count: 20, params: SMOKE });   // (over its own stack: buildkit.js works)
  };
  for (const s of w.structs) {
    const id = s.id, p = foot(s);
    // (the palisade: ours, on its bank; inside a town a card, the owner's choice: from inside, the model shows its shaded
    // face and its tower reads as a block: docs/vale-landmarks-proposal.md §8)
    if (timber && p && inside(p.cx, p.cz, -4) && /_curtainy?_\d|_tower_\d|_gatehousey?_\d/.test(id)) { sprites.push({ id, x: X(s.x), z: Z(s.y), ...(w.hub ? { card: true } : {}) }); continue; }
    // the Reach's own pieces (our kit, town.json's reach_*): Ashgate's pithead wheel over its gate, the Cinderworks'
    // furnace hall and its stacks, the Cold Seam's headframe in place of the Vale's mine (on the sim's footprints)
    if (reach && /_gatehousey?_\d/.test(id) && p) { sprites.push({ id: 'reach_gatewheel', x: p.cx, z: p.cz }); continue; }
    if (reach && p && stackAt(region, w, s)) { stack(p.cx, p.cz, hash(id, s.x, s.y)); continue; }
    if (p && beacon(s)) { if (inside(p.cx, p.cz)) sprites.push({ id, x: X(s.x), z: Z(s.y) }); continue; }
    if (!p || !inside(p.cx, p.cz) || /_curtainy?_\d|_tower_\d|_gatehousey?_\d|^mountain_|^ug_/.test(id)) {
      if (/^ug_flowers/.test(id) && (B === BIOMES.grassland || B === BIOMES.vale) && p && inside(p.cx, p.cz) && !raised(p.cx, p.cz)) tiles[Math.floor(p.cz)][Math.floor(p.cx)] = 'f';
      continue;
    }
    if (reach && id === 'mine_0') { sprites.push({ id: 'reach_pithead', x: X(s.x), z: Z(s.y) }); continue; }
    // (part 2: the other sites' doors, on the sim's own footprints: the Yards' counting house with the Assay's gate, the
    // Forgehall's bronze doors in their hill, the Ninth Vault's strongroom door in the volcano's flank, the Magma Vault's
    // mouth; each door on its +y face, where the sim's other doors are)
    const kit = reachKitOf(w, s);
    if (kit === 'reach_works') { works(s, p); continue; }
    if (kit) { sprites.push({ id: kit, x: X(s.x), z: Z(s.y) }); continue; }
    if (reach && /^(wheat|pumpkins)_/.test(id)) continue;      // (Ashgate's fields are the sim's generic town's: nothing grows green in the Reach)
    const house = isHome(w, s) && HOUSES.find(([re]) => re.test(id));
    if (house) {
      const svc = services.get(id), hh = hash(id, s.x, s.y), { roofs, uppers, stone, ...lk } = look;
      const mine = { ...lk, ...(roofs ? { roof: roofs[hh % roofs.length] } : {}), ...(uppers && (house[1].stories || 1) > 1 ? { upperWall: uppers[(hh >>> 4) % uppers.length] } : {}) };
      // (on exactly the tiles the sim walls for it, its plinth to their edge: outdoor.js homeWalls, the house's size as it
      // was drawn, 82 % by 72 % of the footprint within Luminati's least and most, laid on whole tiles. Walled 12 % in from
      // its footprint's sides, the sim stopped the party up to a tile inside its walls: docs/pathing-audit.md)
      const k = homeWalls(id, s.x, s.y), PLINTH = 0.1;
      add({ type: 'house', x: X((k[0] + k[2]) / 2), z: Z((k[1] + k[3]) / 2), rotation: 0, ...(svc ? { name: svc.name } : {}), light: !!svc || hash(id, s.x) % 3 === 0,
        opts: { width: r2((k[2] - k[0]) / 2 - 2 * PLINTH), depth: r2((k[3] - k[1]) / 2 - 2 * PLINTH), chimney: true, shutters: true, doorHood: false, woodpile: false,
          gableFront: false, sign: false, upperWall: '', ...house[1], ...(/_temple_|_smith_/.test(id) ? { ...mine, wall: stone || 'stone_brick' } : mine), seed: hh % 997,
          // (a service's chimney on its east end, toward the camera: laid on whole tiles the houses moved a little, Luminati
          // drew their chimneys afresh, and Saltmere's chandlery's stood in front of the Stilt House's door, 33 % in view)
          ...(svc ? { chimneySide: 1 } : {}) } });
      continue;
    }
    const m = /^([a-z]+)_\d/.exec(id), kind = m && m[1];
    if (kind && (TREES[kind] || kind === 'grove')) {
      if (raised(p.cx, p.cz)) continue;
      // (a grove in a land whose trees are bare is bare: the sim walls only a bare tree's trunk, outdoor.js bareTree)
      const h = hash(id, s.x, s.y), tk0 = kind === 'grove' ? (bareTree(region, id) ? 'oak' : ['oak', 'oak', 'pine', 'autumn', 'deadwood'][h % 5]) : TREES[kind], tk = B.trees[tk0] || tk0;
      add({ type: 'tree', x: p.cx, z: p.cz, collider: false, opts: { kind: tk, height: r2(clamp(Math.max(p.w, p.d) * 0.62, 2.6, 6.2)), seed: h % 997 } });
    } else if (/^rock_/.test(id)) {
      // (a rock on snow is basalt showing through it: the land's own snow stone, white on white, hid the rocks that stand
      // where a pine would have on the Heights' snow: level-design-rules.md §3.6, the foliage critic. In the Reach a rock
      // is black slag, red only where the ground is red rock: round 1's one in five red read as orange boulders everywhere)
      const onSnow = B.stone === 'snow' && tm(Math.floor(s.x), Math.floor(s.y)) === G.SNOW;
      const stone = onSnow ? 'basalt' : reach && tiles[Math.floor(p.cz)]?.[Math.floor(p.cx)] === 'M' ? 'redrock' : B.stone;
      // (and no bigger than the ground the sim walls for it: Luminati's boulder reaches 0.8 of its size out, a leaning one
      // beside it from a size of 1; drawn to its footprint, it stood a tile or two past the wall, docs/pathing-audit.md)
      const walled = Math.sqrt(walledNear(s, p.f) / Math.PI) / 2;   // (its wall's radius, Luminati's units)
      const fit = walled >= 1 ? walled : Math.max(0.3, Math.min(0.99, walled / 0.8));   // (from a size of 1 the leaning one reaches about its size out)
      const size = Math.min(onSnow ? clamp(Math.max(p.w, p.d) * 0.3, 0.4, 0.8) : clamp(Math.max(p.w, p.d) * 0.55, 0.6, 1.6), fit);   // (and small: stones through the snow, not boulders: round 3)
      add({ type: 'rock', x: p.cx, z: p.cz, opts: { size: r2(size), ...(stone ? { stone } : {}), seed: hash(id, s.x) % 97 } });
    }
    else if (/^(fence|drywall)_/.test(id)) {
      // (down the middle of the row the sim walls, end to end of it: outdoor.js putRun. On the footprint's own middle line
      // it stood off the walled row's middle by up to half a tile, in the next row the party walks)
      const f = p.f, horiz = f[2] - f[0] > f[3] - f[1], a = Math.floor((horiz ? s.x + f[0] : s.y + f[1]) + 0.5), b = Math.ceil((horiz ? s.x + f[2] : s.y + f[3]) - 0.5);
      const mid = Math.floor(horiz ? s.y + (f[1] + f[3]) / 2 : s.x + (f[0] + f[2]) / 2) + 0.5;
      add(horiz ? { type: 'fence', x0: X(a), z0: Z(mid), x1: X(b), z1: Z(mid), opts: {} } : { type: 'fence', x0: X(mid), z0: Z(a), x1: X(mid), z1: Z(b), opts: {} });
    }
    else if (/_(well|lanewell)_\d/.test(id)) add({ type: 'well', x: p.cx, z: p.cz, rotation: 0, opts: { roof: reach ? 'roof_rust' : 'roof_thatch' } });
    else if (/^windmill_/.test(id)) add({ type: 'windmill', x: p.cx, z: p.cz, rotation: 0, opts: { height: 7, roof: 'roof_thatch', seed: 7 } });
    else if (/^lamppost_/.test(id)) add({ type: 'lamppost', x: p.cx, z: p.cz, rotation: 0, opts: { style: 'arm' } });
    else if (/_foodstand_/.test(id)) add({ type: 'marketStall', x: p.cx, z: p.cz, rotation: 0, opts: { cloth: 'cloth_stripe', width: 3, crates: 'right', seed: 2 } });
    else if (/^barrel/.test(id)) add({ type: 'barrel', x: p.cx, z: p.cz, rotation: (hash(id, s.x, s.y) % 7) / 7, opts: { height: 1, lying: false } });
    // (a crate's and a sack's pile on the ground the sim walls for it, no barrel beside it: two crates of 0.8 and a barrel, or
    // three sacks, stood two to four tiles wide over a wall of one or two, docs/pathing-audit.md)
    else if (/^crate_|^boxes/.test(id)) { const n = /^boxes/.test(id) ? 3 : 1, side = Math.sqrt(Math.max(1, walledNear(s, p.f))) / 2;
      add({ type: 'crateStack', x: p.cx, z: p.cz, rotation: 0.2, opts: { count: n, size: r2(clamp((side * 0.85) / n, 0.35, 0.8)), barrel: false, seed: hash(id, s.x) % 31 } }); }
    else if (/^sack/.test(id)) add({ type: 'sacks', x: p.cx, z: p.cz, rotation: 0, opts: { count: 1, seed: 5 } });
    else if (/^table_/.test(id)) add({ type: 'table', x: p.cx, z: p.cz, rotation: 0, opts: { shape: 'rect', width: 1.6, depth: 0.9, cloth: false, items: true, candle: false, seed: 6 } });
    else if (/^bench_/.test(id)) add({ type: 'bench', x: p.cx, z: p.cz, rotation: 0, opts: { length: 1.6, back: true } });
    else if (/^hay_/.test(id)) add({ type: 'haystack', x: p.cx, z: p.cz, opts: { size: 0.8, seed: hash(id, s.x) % 31 } });
    // a bridge (the owner, 2026-11-01: "the bridge doesnt look right and characters dont walk over it they walk through it"):
    // Luminati's own, its deck walkable (the figures stand on it: TileMap's walk surface), across its span on our deck's
    // line (outdoor.js 'deck': the walkable 6.4 tiles of the footprint's short side), the river left open under it
    else if (/^bridge/.test(id)) {
      const f = p.f, alongX = f[2] - f[0] > f[3] - f[1];
      add(alongX ? { type: 'bridge', x0: X(s.x + f[0]), z0: Z(s.y), x1: X(s.x + f[2]), z1: Z(s.y), deckY: GROUND_Y, opts: { width: BRIDGE_W, arch: 0.22 } }
        : { type: 'bridge', x0: X(s.x), z0: Z(s.y + f[1]), x1: X(s.x), z1: Z(s.y + f[3]), deckY: GROUND_Y, opts: { width: BRIDGE_W, arch: 0.22 } });
    }
    else if (/^hens_/.test(id)) add({ type: 'critters', x: p.cx, z: p.cz, kind: 'chicken', count: 4, radius: 1.6 });   // (Luminati's own hens, pecking about)
    else if (/^(cow|sheep)_/.test(id)) continue;               // (the farm's beasts are figures, alive: hybrid.js beasts, from Emberlit's animator)
    else {
      sprites.push({ id, x: X(s.x), z: Z(s.y) });              // ours: Luminati has nothing like it (or it's ours to keep)
      // the Sunken Chapel's marsh (docs/vale-landmarks-proposal.md §4): the world's own still water under it, to the
      // porch at its front; inside its footprint, which the sim never walks, so nobody wades (presentation only)
      // Wickham Keep's door (docs/vale-landmarks-proposal.md §4): a wall torch either side of it on the keep's south face
      // (the kit model's door, buildkit keep: centred, its face KEEP_FACE tiles out), Luminati's own, burning day and
      // night with its own light, so the way in reads at dusk and the ground before it is lit
      if (id === 'vale_keep_1' && region === 'vale' && !w.hub)
        for (const sx of [-1, 1]) add({ type: 'wallTorch', x: X(s.x + sx * 2), z: Z(s.y + KEEP_FACE), rotation: 0, dy: 1.7, opts: { embers: true } });
      if (id === 'chapelruin_0' && region === 'vale') {
        const f = p.f, i0 = Math.ceil((s.x + f[0] - x0) / 2 - 0.5), i1 = Math.floor((s.x + f[2] - x0) / 2 - 0.5), j0 = Math.ceil((s.y + f[1] - y0) / 2 - 0.5), j1 = Math.floor((s.y + MARSH_FRONT - y0) / 2 - 0.5);
        for (let j = Math.max(0, j0); j <= Math.min(D - 1, j1); j++) for (let i = Math.max(0, i0); i <= Math.min(W - 1, i1); i++) { tiles[j][i] = 'o'; heights[j][i] = '0'; }
      }
    }
  }
  // (v1.156) the Sister's Cabin's way in on the Tidemark's east beach: the wreck of Aurelle's Grace on her reef offshore
  // (our kit's, town.json tidemark_wreck: broadside along the shore, the reef's rocks out to her from the beach, the
  // ladder down her side), in the sea east of the exit, which no one walks; it stands whether her door is shut or open,
  // as the Ninth Vault's does. GRACE_OFF: her middle that many sim tiles east of the reef (the sea's edge is 5 out,
  // outdoor.js pools; the level ends at 258, MAX_TILES, so she lies along the shore, not out to sea)
  if (region === 'tidemark' && w.kind === 'overland' && TIDEMARK?.reef) sprites.push({ id: 'tidemark_wreck', x: X(TIDEMARK.reef[0] + GRACE_OFF), z: Z(TIDEMARK.reef[1]) });
  // (step 9) the sea past the level's crop, from the sim's own grid (it runs PAD tiles past the map): a mask a cell of
  // Luminati's (two of ours), '1' where the sim has sea or beach, for world.js seaAir to lay the sea there and take the
  // outer ground and its trees down (Luminati's outer scenery only continues the edge: south of a grass edge tile it laid
  // fields where the sim has the bay; docs/art-critic-pass-tidemark.md)
  if (region === 'tidemark') {
    const mx0 = Math.floor((-w.PAD - x0) / 2), mz0 = Math.floor((-w.PAD - y0) / 2), mw = Math.floor((w.W + 2 * w.PAD) / 2), md = Math.floor((w.H + 2 * w.PAD) / 2), rows = [];
    for (let j = 0; j < md; j++) { let r = ''; for (let i = 0; i < mw; i++) { const g = tm(x0 + 2 * (mx0 + i), y0 + 2 * (mz0 + j)); r += g === G.POOL || g === G.WATER || g === G.SAND ? '1' : '0'; } rows.push(r); }
    sprites.push({ seaMask: { x0: mx0, z0: mz0, w: mw, d: md, rows } });
  }
  // (v1.157) the Grace herself, the region boss's ship, hove to in Gullwick's bay off the wreckers' beach, where her
  // broadside comes from (ring.js GRACE.broadside.from, past the arena's edge); stood always, shown only while her window
  // is open (world.js: `ring`, the frame's ringOn from hybrid.js)
  // (step 9) Tollhaven's harbour: the League's boats moored alongside its three jetties (outdoor.js buildTown's jetties,
  // x 146, 166, 186 north from the quay), in the water between them, painters to the jetties' posts: the harbour read as
  // a lake with planks out into it (docs/art-critic-pass-tidemark.md)
  if (region === 'tidemark' && w.kind !== 'overland') for (const [bx, by] of MOORED) sprites.push({ id: 'tidemark_ferry', x: X(bx), z: Z(by), here: true });
  // (step 9) the wreck the wreckers are stripping, in the shallows off their beach (camps.js tide_wreckers), where nobody
  // walks: their camp otherwise reads as any beach fire (docs/art-critic-pass-tidemark.md)
  if (region === 'tidemark' && w.kind === 'overland') sprites.push({ id: 'tidemark_wreckage', x: X(WRECKAGE[0]), z: Z(WRECKAGE[1]), here: true });
  if (region === 'tidemark' && w.kind === 'overland') sprites.push({ id: 'tidemark_graceship', x: X(GRACE_SHIP[0]), z: Z(GRACE_SHIP[1]), y: 0, ring: 'the_grace' });   // (y: the sea floor's, her middle past the level's edge)
  // (the owner, 2026-11-26: the jetties to the Drowned Mole and the Gull Isles "just stop at a dead end") a boat waiting at
  // each, moored off the jetty's end by its exit (outdoor.js TIDEMARK.ferry, .isles), her lantern lit by night, her
  // boatman stood in her stern as a figure (hybrid.js: `figures`, idle, never the sim's)
  const figures = [];
  if (region === 'tidemark' && w.kind === 'overland') for (const bt of BOATS) {
    if (!(w.exits || []).some((e) => e.site === bt.site)) continue;
    sprites.push({ id: bt.id, x: X(bt.at[0]), z: Z(bt.at[1]), here: true });
    add({ type: 'light', x: X(bt.at[0] + bt.lamp[0]), z: Z(bt.at[1] + bt.lamp[1]), dy: 3.1, color: '#ffc070', intensity: 2.6, distance: 5.5, flicker: 0.12, nightOnly: true });
    figures.push({ name: bt.man, x: X(bt.at[0] + bt.stern[0]), z: Z(bt.at[1] + bt.stern[1]), air: BOAT_FLOOR, row: bt.row });
  }
  // (dungeon-looks-plan item 7) the Tidemark's shore: the sim's huts, boats and nets, and the renderer's own dunes, surf,
  // wrack and rock pools
  if (region === 'tidemark' && w.kind === 'overland') shoreLand(w, { W, D, tiles, heights, X, Z, add, sprites, inside });
  // the lit things on the ground (the town's braziers: a fire each, sharing Luminati's lamps)
  for (const [k, kind] of w.props || []) {
    const [tx, ty] = k.split(',').map(Number), x = X(tx + 0.5), z = Z(ty + 0.5);
    if (!inside(x, z)) continue;
    if (kind === 'brazier') add({ type: 'campfire', x, z, rotation: 0, opts: { seat: false } });   // (a core light: Luminati's monument brazier is The Bells of Evermere's and loads its kits)
    // (v1.63, GDD §10.3: a spawn point's dressing, sim/camps.js) the camp's fire Luminati's own; crates, sacks and bones its
    // own pieces as underground; the rest ours (gsprite.js: the tent, the dead cow, the burrow), stood as a dungeon's are
    else if (kind === 'cookfire') add({ type: 'campfire', x, z, rotation: 0, opts: { seat: false } });
    else if (OVERLAND_3D.has(kind)) add(DRESS_3D[kind](x, z, hash(kind, tx, ty)));
    else if (reach && kind === 'burrow') sprites.push({ id: 'reach_slagheap', x, z });   // (the cinder hounds' den: a heap of slag, not the Vale's turf)
    else if (reach && kind === 'tent') sprites.push({ prop: kind, kind: 'tent_reach', tx, ty, x, z });   // (the renegades' and the haulers' canvas grey with ash, not the Vale's: gsprite.js)
    else if (region === 'tidemark' && kind === 'tent') sprites.push({ prop: kind, kind: 'tent_tidemark', tx, ty, x, z });   // (Highmarch's outriders' at their kennels, in the march's oxblood: gsprite.js)
    else if (OVERLAND_OURS.has(kind)) sprites.push({ prop: kind, tx, ty, x, z });
  }
  // the land goes on past the edge: Luminati's forest border on the blocked ring and its outer scenery beyond, round every
  // map (the owner, 2026-11-02: "The edge of the map falls off a cliff, and is blank. The old maps were surrounded by
  // trees, boulders or other impassable objects". An overland is cropped to 256 of ours, and its forest ring in the
  // sim's margin fell outside the crop; the outer scenery had been kept to town-sized maps)
  // the Reach's vents: embers smouldering in the char out on the open ground (a few, spread: each a little smoke and a
  // glow, no light of its own; Luminati culls their particles far from the camera)
  if (reach && w.kind === 'overland') {
    let n = 0;
    for (let j = 2; j < D - 2 && n < VENTS; j++) for (let i = 2; i < W - 2 && n < VENTS; i++) {
      if (tiles[j][i] !== 'H' || heights[j][i] !== '2' || hash('vent', i, j) % 60) continue;
      if ([[1, 0], [-1, 0], [0, 1], [0, -1]].some(([a, b]) => !/[AHKLQ]/.test(tiles[j + b][i + a]) || heights[j + b][i + a] !== '2')) continue;   // (out in the open, off the roads)
      add({ type: 'fire', x: r2(i + 0.5), z: r2(j + 0.5), opts: { kind: 'embers', size: r2(0.4 + (hash('vs', i, j) % 4) * 0.08), smoke: hash('vk', i, j) % 3 === 0, light: false, seed: hash('vf', i, j) % 997 } });
      n++;
    }
  }
  if (reach && w.kind === 'overland') {
    const camp = CAMP_BY.reach_mouth, c = camp ? [camp.x, camp.y] : [REACH.vault[0] - 20, REACH.vault[1] - 18], r = camp ? camp.reach : 21;
    // the yard's floor: char and cracked earth inside the ring (only open ground: the stack's plinth, a heap, a road stay)
    for (let j = 0; j < D; j++) for (let i = 0; i < W; i++) {
      const d = Math.hypot(x0 + 2 * i + 1 - c[0], y0 + 2 * j + 1 - c[1]);
      if (d < r && heights[j][i] === '2' && /[AHKLQMy]/.test(tiles[j][i])) tiles[j][i] = vnoise(i, j, 'fy', 3) < 0.55 ? 'H' : 'Q';
    }
    // (the heaps on its rim are the sim's, walled: outdoor.js furnaceHeaps, stood as its other pieces are) vents round its reach
    for (let k = 0; k < FURNACE_YARD.vents; k++) {
      const a = ((k + 0.5) / FURNACE_YARD.vents) * Math.PI * 2 + 0.2, x = X(c[0] + Math.cos(a) * (r - 1)), z = Z(c[1] + Math.sin(a) * (r - 1));
      if (inside(x, z) && !raised(x, z)) add({ type: 'fire', x, z, opts: { kind: 'embers', size: 0.55, smoke: k % 2 === 0, light: false, seed: 300 + k } });
    }
  }
  const town = W * D <= 96 * 96;
  const level = frame({ name: w.name || 'Emberfall', W, D, tiles, heights, objects, spawn: { x: W / 2, z: D / 2, facing: 'down' },
    environment: { timeOfDay: 17.9, border: 'forest', outerScenery: true, godRays: town, interior: false, ...B.env } });
  return { level, sprites, figures, origin: { x: x0, y: y0 }, stats: { ...count, sprites: sprites.length, size: W * 1000 + D } };
}

// ── a floor's ways up and down (sim/world.js placeStairsUp, placeStairsDown), in Luminati's stair tiles ─────────────────
// The way up: a flight of three climbing from the floor (level 2) into the wall it stands against, over the stairsup
// structure's 3 × 7 of ours. The way down: the 6 × 6 stairwell sunk two levels, the top step at its open (+y) edge, a
// landing at the bottom. Before, both were lampposts (one on each of the well's 36 tiles). A tile of Luminati's is
// 2 × 2 of ours, and one is in the flight when its middle is.
const FLOOR = 2;
// The ways up and down, seen across the room (the owner, 2026-11-04: "The stairs arent obvious enough"): besides the
// torches, a glow of their own, the way up's at its head (daylight on a first floor, where it leads out; a warm lamp
// deeper) and the well's violet light rising out of it (the arch below lit violet, GDD §3.1). (Their signs, Emberlit's
// overlay's, are gone: the arches and their light are enough, GDD v1.89.)
const UP_GLOW = { out: { color: '#ffe6b0', intensity: 5, distance: 7 }, up: { color: '#ffc27a', intensity: 4, distance: 6 } };
const DOWN_GLOW = { color: '#a274ff', intensity: 11, distance: 10 };
function stairs(w, x0, y0, W, D, tiles, heights, arch = false) {
  /** @type {any[] & { arches?: any[] }} */
  const lights = [], arches = [];
  lights.arches = arches;
  const up = (w.depth || 0) === 0 ? UP_GLOW.out : UP_GLOW.up;   // torches (ours) beside the way up's top step and at the well's foot; the glows
  const set = (i, j, ch, h) => { if (i >= 0 && j >= 0 && i < W && j < D) { tiles[j][i] = ch; heights[j][i] = String(h); } };
  const cols = (a, b) => { const o = []; for (let i = 0; i < W; i++) { const c = x0 + 2 * i + 1; if (c >= a && c < b) o.push(i); } return o; };
  const rows = (a, b) => { const o = []; for (let j = 0; j < D; j++) { const c = y0 + 2 * j + 1; if (c >= a && c < b) o.push(j); } return o; };
  for (const st of w.structs || []) {
    // (GDD v1.57: the flight three tiles wide, two abreast, over the sim's own footprint for the stairs, 5.2 of ours
    // across, and only where the room's floor is: never over a wall)
    const open = (i, j) => heights[j]?.[i] === String(FLOOR);
    if (st.id === 'stairsup_0') {                                // against a north wall: x the middle of its 3, y its first row
      const x = Math.round(st.x - 0.5), y = Math.round(st.y - 3.1), js = rows(y, y + 6);
      const is = (arch ? cols(x - 2, x + 4) : cols(x - 1, x + 2)).filter((i) => !arch || js.every((j) => open(i, j)));
      for (const i of is) js.forEach((j, k) => set(i, j, '^', FLOOR + js.length - 1 - k));
      lights.push({ x: x + 2.5 + (arch ? 1 : 0), y: y + 0.5 }, { x: x + 0.5, y: y + 1, dy: 2.2, glow: up });
      if (arch && is.length) arches.push({ kind: 'up', x: (is[0] + is[is.length - 1]) / 2 + 0.5, z: js[0], rot: 0, span: is.length, level: FLOOR + js.length - 1, glow: up.color });
    } else if (st.id === 'stairsup_90') {                        // against a west wall
      const x = Math.round(st.x - 3.1), y = Math.round(st.y - 0.5), is = cols(x, x + 6);
      const js = (arch ? rows(y - 2, y + 4) : rows(y - 1, y + 2)).filter((j) => !arch || is.every((i) => open(i, j)));
      for (const j of js) is.forEach((i, k) => set(i, j, '<', FLOOR + is.length - 1 - k));
      lights.push({ x: x + 0.5, y: y + 2.5 + (arch ? 1 : 0) }, { x: x + 1, y: y + 0.5, dy: 2.2, glow: up });
      if (arch && js.length) arches.push({ kind: 'up', x: is[0], z: (js[0] + js[js.length - 1]) / 2 + 0.5, rot: Math.PI / 2, span: js.length, level: FLOOR + is.length - 1, glow: up.color });
    }
  }
  const wl = w.stairwell;
  if (wl) {
    const js = rows(wl.y0, wl.y1), n = js.length;                // from the far (−y) side: the landing, then the steps up
    for (const i of cols(wl.x0, wl.x1)) js.forEach((j, k) => k === 0 ? set(i, j, 'k', FLOOR - (n - 1)) : set(i, j, 'v', FLOOR - (n - k)));
    lights.push({ x: (wl.x0 + wl.x1) / 2, y: wl.y0 + 0.5, dy: 0.7 });   // (its bottom lit: unlit, the well read as more floor)
    lights.push({ x: (wl.x0 + wl.x1) / 2, y: (wl.y0 + wl.y1) / 2, dy: 2.2, glow: DOWN_GLOW });
    { const is = cols(wl.x0, wl.x1); if (arch && is.length && js.length) arches.push({ kind: 'down', x: (is[0] + is[is.length - 1]) / 2 + 0.5, z: js[0], rot: 0, span: is.length, level: FLOOR, glow: DOWN_GLOW.color }); }   // (over the well's far edge, its landing below: the way down framed from the room)   // (at the rim's height, over the well: inside it, its walls hid it)   // (the arch below lit violet, GDD §3.1)
  } else if (w.stairsAt) {                                       // no room for a well: one step down where the stairs are
    const i = Math.floor((w.stairsAt.x - x0) / 2), j = Math.floor((w.stairsAt.y - y0) / 2);
    set(i, j, 'v', FLOOR - 1);
  }
  return lights;
}

// ── a dungeon floor ─────────────────────────────────────────────────────────────────────────────────────────────────
// Port step 3, "dungeons dressed" (the Vale first): each floor in its kit's stone, at its kit's hour, its furniture
// stood as art critic pass 18 dressed it.
//   · Luminati's own 3D, where it has the thing: the braziers (stone, real fire, a light each), crates, barrels, sacks,
//     boulders, stalagmites, bones, spoil, pews and pillars;
//   · our voxel props (render/gsprite.js), where the kit's piece is its own: standards, banners, saints, the bound,
//     the font, sarcophagi, urn shelves, tents, bunks… `sprites` names them by tile, hybrid.js builds them as Emberlit
//     does and the world page stands them up, facing the camera as the figures do. Chests, shrines and cages among
//     them change as they're opened, used or broken.
//   · a light at each prop Emberlit lights (gsprite.js PROP_LIGHT): lanterns, candles, the altar, the circle, the font.
/** each kit's look: its floor (two tiles, the second a scatter), its walls, its hour (the light's colour underground;
 *  renderer.js KIT_TINT's warm and cold read through Luminati's clock) */
const KIT_LOOK = {
  dig: { floor: ['d', 'k'], wall: 'B', cave: 'D', hour: 19.3 }, gallery: { floor: ['k', 'm'], wall: 'W', hour: 21.4 }, muster: { floor: ['k', 'k'], wall: 'B', hour: 22.2 },
  bailey: { floor: ['c', 'd'], wall: 'B', hour: 18.9 }, barracks: { floor: ['c', 'k'], wall: 'B', hour: 19.6 }, cellar: { floor: ['U', 'd'], wall: 'x', hour: 20.8 },
  nave: { floor: ['k', 'm'], wall: 'C', hour: 21.0 }, cultcut: { floor: ['d', 'U'], wall: 'x', hour: 19.0 }, binding: { floor: ['k', 'm'], wall: 'W', hour: 22.6 },
};
// the Cinder Reach's (docs/art-critic-pass-reach.md; GDD §3: the Cold Seam's kits, plans.js): the pithead, a played-out
// Deepdelver mine, cracked dark earth and black rock, warm lamplight; the warren the goblins dug from it, raw earth
// walls and a dirt floor; and, for the Reach's sites to come (level.js THEMES), the Cinderworks in slag brick over
// scorched basalt, the Magma Vault black rock lit hot. (Their stone is Luminati's arid set and ours, world.js
// reachTextures: a legend that names the arid set loads its kit.)
Object.assign(KIT_LOOK, {
  // (round 3: the pithead first in cinder earth under basalt walls, and underground's dim violet fill took both to black,
  // a mean luminance of 15 against the warren's 23: its floor now packed earth and rock, its walls the Deepdelvers' cut
  // stone, its dug rooms raw earth. The works and the vault keep their dark stone: their hazard and their fires light them)
  pithead: { floor: ['d', 'U'], wall: 'W', cave: 'D', hour: 19.4 }, warren: { floor: ['d', 'Q'], wall: 'D', cave: 'D', hour: 19.1, mix: 9 },   // (the warren's char patches fewer: at a fifth they read as a checker of black holes, item 8)
  // (part 2: the vault's floor broken rock with fire in its cracks, ember vents along its walls: `vents`)
  ember: { floor: ['U', 'H'], wall: 'Z', cave: 'O', hour: 18.7 }, lava: { floor: ['U', 'l'], wall: 'O', cave: 'O', hour: 18.3, vents: 14 },
});
// Part 2 (the build sheet, docs/reach-plan.md; docs/art-critic-pass-reach.md): the Reach's other bands, a look a plan
// kit. `mix`: the share of the floor in its second tile (18 % if not said); `vents`: ember beds along the walls.
//   yards: the Assay's yards and counting house, slag brick over charcoal cobbles and cracked earth, a day's work light;
//   quota: its cellars and the quota office, dressed stone and swept flags, a clerk's cool lamp;
//   forge: the empire's forge-hall, dark flags with bronze in the joints, black walls banded in bronze, the forges warm;
//   deepforge: deeper and hotter, broken rock with fire in its cracks, basalt walls, vents;
//   works: the Cinderworks, slag brick over cobbles and char; vault: the Magma Vault (the `lava` look);
//   strongroom: the Ninth Vault, the empire's flags and black-and-bronze walls, by candle.
Object.assign(KIT_LOOK, {
  yards: { floor: ['%', 'Q'], wall: 'Z', cave: 'D', hour: 19.2 }, quota: { floor: ['k', '%'], wall: 'W', cave: 'W', hour: 20.6 },
  forge: { floor: ['S', 'U'], wall: 'j', cave: 'O', hour: 18.8 }, deepforge: { floor: ['U', 'l'], wall: 'O', cave: 'O', hour: 18.4, vents: 10 },
  works: { floor: ['%', 'H'], wall: 'Z', cave: 'O', hour: 18.6 }, vault: KIT_LOOK.lava, strongroom: { floor: ['S', 'k'], wall: 'j', cave: 'W', hour: 20.9, mix: 12 },
});
KIT_LOOK.ember = KIT_LOOK.works;
// The Fens' kits (world doc §3.2; docs/art-critic-pass-fens-dungeons.md): they drew in DEFAULT_LOOK, stone tiles and moss.
//   mound: the Toadking's island, mud underfoot with planks laid over it, walls of upturned hulls under reed, its dug
//     rooms earth banks turfed over;   locks: the lock-keepers' halls, slick blue-grey flags and cobbles, pale stone brick;
//   vats: Vat Seven, flags stained sick green, slime in the joints;   abbey: the flooded cloister, pale flags gone
//     green-grey, moss, the chapel's sandstone under moss (the Vale's nave's sister).
Object.assign(KIT_LOOK, {
  mound: { floor: ['t', 'b'], wall: 'u', cave: 'E', hour: 19.6, mix: 10 }, locks: { floor: ['w', 'c'], wall: 'B', cave: 'W', hour: 20.4 },
  vats: { floor: ['z', 'w'], wall: 'W', cave: 'W', hour: 20.0 }, abbey: { floor: ['p', 'm'], wall: 'C', cave: 'C', hour: 21.2 },
});
// Water indoors (docs/water-indoors.md; docs/dungeon-looks-plan.md items 3–5): `wet` names a kit's water (world.js
// WET_LOOKS: its shin-deep sheet over the sim's pools and its channels' deep water), `bank` the letter a floor tile takes
// beside a channel (its walling down into the water), `garth` the floor of a room open to the sky (plans.js dress 'garth').
// The Locks and Vat Seven in the Fens' own ashlar, the Abbey in its own pale stone (the Vale nave's sandstone before);
// the Sunken Chapel's nave keeps its sandstone, its water the river's.
Object.assign(KIT_LOOK.locks, { wall: 'α', cave: 'α', wet: 'canal', bank: 'ε' });
Object.assign(KIT_LOOK.vats, { wall: 'α', cave: 'α', wet: 'sick', bank: 'ζ' });
Object.assign(KIT_LOOK.abbey, { wall: 'β', cave: 'β', wet: 'abbey', bank: 'η', garth: 'θ' });
Object.assign(KIT_LOOK.nave, { wet: 'chapel' });
/** a channel's water under the floor (Luminati's units: the floor's top at 1, its bed at 0) */
const WET_WL = 0.62;   // (round 5: deeper, plainly under the floor; 0.72, then 0.8 in round 2)
// a building's inside (the Shuttered Inn, docs/tavern-dungeon.md): its flagstones, its stone walls, an evening's hour; its
// walls stand whole (tavernWalls, below), not ruined
KIT_LOOK.tavern = { floor: ['#', '='], wall: '@', cave: '@', hour: 19.2, mix: 14, inside: true };
// its cellar: the worn flag most of the floor, rough rubble walls, no timber frame, candles in niches (tavernDress)
KIT_LOOK.tavern_cellar = { floor: ['=', '#'], wall: '+', cave: '+', hour: 19.2, mix: 30, inside: true, frame: false };
// a crypt's inside (the Haddow Crypt, docs/crypt-dungeon.md): pale slabs with a ledger stone now and then, pale ashlar
// walls under a blind arcade (cryptDress), a cold fill and the candles warm against it
const CRYPT_FILL = { sky: [1.05, 1.04, 1.07], ground: [0.52, 0.45, 0.38], lamps: 2.2 };   // (round 10: the ground's bounce warm, so the shadowed faces read limestone, not slate)   // (round 5: the floor a step up, its middle went blue-black)   // (round 4: a touch warmer still, the limestone read taupe)   // (round 3: the blue a tint in the shadows only, not on the lit stone)   // (round 2: a tenth down, so the candles' pools carry)   // (round 1: at 0.7 the room was a murk of navy)
KIT_LOOK.crypt = { floor: ['!', '$'], wall: '*', cave: '*', hour: 19.2, mix: 0, ledgers: true, inside: true, fill: CRYPT_FILL };
// its ossuary: walls of stacked bones and skulls, no arcade, skulls heaped in niches, candles among them
KIT_LOOK.ossuary = { floor: ['!', '$'], wall: ':', cave: ':', hour: 19.2, mix: 0, ledgers: true, inside: true, fill: CRYPT_FILL };
// a wharf (the Old Eel Wharf, docs/docks-dungeon.md; the owner, 2026-11-23, from a reference: "docks and harbor"): plank
// decks over still black water, no walls: off every deck is the harbour, to the fog (dungeon: `water`); its rails and
// piles, its lamps on their posts, its cargo (docksDress, DOCK_3D); a cold night fill, the lamps warm against it
// (the harbour high under the decks: only their fascia shows over it and the piles go straight in, round 2: "the near
// edges read as a quay wall"; world.js DOCK_WL the same)
const DOCK_WL = 0.84;
const DOCK_FILL = { sky: [0.62, 0.74, 0.98], ground: [0.34, 0.33, 0.36], lamps: 2.3 };
// the ramparts (the High Ramparts, docs/ramparts-dungeon.md; the owner, 2026-11-23, from a reference: "the reaches, high
// up on the ramparts"): cobbled terraces on a town's walls, its half-timbered houses along their backs (Luminati's own,
// rampartsDress), a crenellated parapet over the drop at their fronts, the mist below and towers standing up out of it;
// dusk, the windows and the torches warm
const RAMP_FILL = { sky: [0.86, 0.92, 1.06], ground: [0.46, 0.43, 0.4], lamps: 2.2 };
KIT_LOOK.ramparts = { floor: ['{', '{'], wall: ']', cave: ']', hour: 21.6, mix: 0, inside: true, ramparts: true, fill: RAMP_FILL, backdrop: '#3a4656' };   // (round 2: night proper, so the houses' windows light)   // (round 1: a later hour, the windows lit; the drop's fog a mid tone, not the brightest thing on screen)
KIT_LOOK.docks = { floor: ['_', '_'], wall: 'o', cave: 'o', hour: 21.2, mix: 0, inside: true, water: true, fill: DOCK_FILL, backdrop: '#3e4d62' };   // (round 1: the distance blue-grey, not black; round 2, lighter than the deck)
// (v1.150) the Drowned Mole's second floor (docs/tidemark-plan.md): the empire's stone moles at low water, the same harbour
// round them as the wharf's; wet flagstone, the stone's own face down to the water (no deck fascia, piles or rail), the
// bollards and the mist kept; a later dusk than the wharf's, the lamps just lit
KIT_LOOK.mole = { floor: ['µ', 'µ'], wall: 'o', cave: 'o', hour: 19.4, mix: 0, inside: true, water: true, stone: true, fill: DOCK_FILL, backdrop: '#465870' };
// (v1.151) the Gull Isles (docs/tidemark-plan.md step 4): the sea cave, dark earth and rock under the isle with its wet
// shingle, a cool fill off the water; the hulks, a ship's inside, deck planks under whole timber walls (the inn's, its frame
// the ribs), the lanterns warm. A first look: the art pass (step 9) takes them further
KIT_LOOK.hulk = { floor: ['_', '#'], wall: '@', cave: '@', hour: 19.6, mix: 0, inside: true };
// (dungeon-looks-plan item 7, docs/strand-dungeon.md; the owner, 2026-11-27: "Tidemark needs to be more beachy, including
// the dungeons.. sea caves and docks like you have now") the coast's kits, each laid out room by room on a floor with the
// sea round it (`coast`, coastGround): the sea cave in wet black rock over shingle and wet sand, its tide pools, barnacles
// and weed at the tide line, light down its blowholes ('cave'; it was the Cold Seam's dirt and crag: the two read alike);
// the strand, the shore itself in the open, dry sand and wet, dunes and rocks behind it and the sea and its surf in front
// ('strand'); a sea fort's walk, its walls standing behind it and its parapet over the rocks and the sea ('fort': the Lamp
// Fort). A cold sea light, the lamps warm against it
const SEA_FILL = { sky: [0.66, 0.78, 0.96], ground: [0.36, 0.37, 0.4], lamps: 2.3 };
const STRAND_FILL = { sky: [0.84, 0.88, 1.0], ground: [0.62, 0.54, 0.44], lamps: 2.1 };
KIT_LOOK.seacave = { wet: 'sea', floor: ['Π', 'Λ'], wall: 'Σ', cave: 'Σ', hour: 20.2, mix: 28, coast: 'cave', fill: SEA_FILL, backdrop: '#3e4d62' };
KIT_LOOK.strand = { floor: ['Δ', 'Λ'], wall: 'Γ', cave: 'Γ', hour: 19.6, mix: 0, coast: 'strand', fill: STRAND_FILL, backdrop: '#4a5c70' };
KIT_LOOK.fortwall = { floor: ['µ', '{'], wall: ']', cave: ']', hour: 20.2, mix: 24, coast: 'fort', fill: SEA_FILL, backdrop: '#3e4d62' };
// (v1.154) the Seventh's Palace (docs/tidemark-plan.md step 6, docs/art-critic-pass-palace.md): a march-kingdom's seat
// dressed for a coronation that never came. The crypt kit's dressed stone and arcade, warmer and grander (palaceRun): honey
// limestone under marble piers with gilt capitals, the household's banners in the bays, tall windows with the hour's sky
// in them; a polished floor in a broad checker (`checker`: by the tile, not a scatter), a runner down the long rooms and up
// to the throne (palaceRunners), the courtyard in yard flags (`yard`); the tavern kit's furniture in the study, the throne
// on its dais, the chapel's empty reliquary (PALACE_3D). Lit as a lived-in house is: a warm fill and a pool at each
// fighting room's middle (`pools`, as the crypt's), the candelabra gilt
const PALACE_FILL = { sky: [1.1, 1.02, 0.92], ground: [0.62, 0.52, 0.42], lamps: 2.1 };
KIT_LOOK.palace = { floor: ['(', ')'], yard: '/', wall: '|', cave: '|', hour: 19.6, mix: 0, checker: true, pools: true, inside: true, palace: true, fill: PALACE_FILL };
// (docs/pass-dungeon.md; docs/dungeon-looks-plan.md item 13) the pass: the Pilgrims' Stair's ledges in the open air, no
// walls: the rock at each ledge's back, the drop into the cloud at its front (passGround, passDress), its bridges over
// the crevasses. A cold high light held whatever the hour (`held`; hybrid.js), the sun out (`fill.sun`), the cloud's own
// pale for the sky past the edges (`backdrop`; `open`: not a room, Luminati's sky and sun); the gully its brown rock
const PASS_FILL = { sky: [0.56, 0.68, 0.98], ground: [0.3, 0.37, 0.58], lamps: 1.1, sun: 0.85 };   // (round 5: the fill bluer, the shade side of the snow a deep blue)   // (round 1: the snow blown out to white)
KIT_LOOK.pass = { floor: ['ა', 'ბ'], wall: 'გ', cave: 'გ', hour: 10.6, held: 10.6, mix: 0, inside: true, pass: true, open: true, fill: PASS_FILL, backdrop: '#8ea3c8' };   // (round 5: the far cloud a blue-grey, the frame's top darker)
KIT_LOOK.gully = { ...KIT_LOOK.pass, wall: 'დ', cave: 'დ', brown: true };
// (item 10) the Praetory's frostkeep: the barracks kit's fortress rooms in frost cobbles, walls of dressed stone under
// rime, icicles along their tops, snow drifted in at the doors, the guard frozen at their posts (frostDress, FROST_3D)
const FROST_FILL = { sky: [0.66, 0.7, 0.8], ground: [0.36, 0.36, 0.4], lamps: 1.5 };   // (round 1: underground's violet through a cold tint went navy)
KIT_LOOK.frostkeep = { floor: ['ზ', 'ზ'],   // (round 2: Luminati's frost cobble, its blue, read navy under the fort's cold fill: our flags, rime in their joints)
   wall: 'ვ', cave: 'ვ', hour: 19.4, mix: 0, frost: true, fill: FROST_FILL };
// (item 6, docs/art-critic-pass-stone.md) the Reedholm Undercroft: the crypt kit's plan, set pieces and arcade in the reed
// town's own brick (`fenbrick`, its bone room `fenbones`), reed matting down the rooms (`mats`), eel traps and nets hung in
// the bays; a damp cold fill, the candles warm against it
const FEN_FILL = { sky: [0.9, 1.0, 1.04], ground: [0.5, 0.42, 0.34], lamps: 2.3 };
KIT_LOOK.fenbrick = { floor: ['ж', 'ж'], wall: 'б', cave: 'б', hour: 19.2, mix: 0, ledgers: true, inside: true, mats: true, fill: FEN_FILL };
KIT_LOOK.fenbones = { floor: ['ж', 'ж'], wall: 'п', cave: 'п', hour: 19.2, mix: 0, ledgers: true, inside: true, fill: FEN_FILL };
// (item 9) a counting house, the look `counting`: the Assay's quota office first (its sim kit stays `quota`), then the
// Greenwood's Tally-House and the Solmere Archive's wing, which point their kits at it. Dressed pale stone under a
// cornice, the back walls lined with ledger shelves and tally boards between pilasters (countingRun), swept pale flags,
// the clerks' desks in rows, each chained to a ring in the floor, the clerk's cool lamp (COUNT_3D)
const COUNT_FILL = { sky: [0.72, 0.75, 0.82], ground: [0.44, 0.4, 0.36], lamps: 2.3 };   // (round 1: at the crypt's fill the office read a lit ward, flat and grey: the lamps' pools lead now)
KIT_LOOK.counting = { floor: ['к', 'л'], wall: 'с', cave: 'с', hour: 20.6, mix: 12, inside: true, counting: true, fill: COUNT_FILL };
KIT_LOOK.quota = KIT_LOOK.counting;
// (2026-11-27, docs/greenwood-dungeon.md; docs/dungeon-looks-plan.md item 12) the greenwood: glades under the great oaks, open
// air, no walls (`forest`: woodGround, woodDress). Its own green gloom whatever the hour (world.js greenwoodAir), a cool green
// fill, the sun a little through the canopy for the trunks' shadows, warm only at a lamp
const WOOD_FILL = { sky: [0.8, 0.86, 0.64], ground: [0.44, 0.38, 0.26], lamps: 1.9, sun: 0.3 };   // (round 10: olive and warm earth, not teal)   // (round 3: a fifth up, the wood's edges went to black)
KIT_LOOK.greenwood = { floor: ['\u16A0', '\u16A2'], road: '\u16A6', wall: '\u16A8', cave: '\u16A8', hour: 17.4, mix: 0, forest: true, fill: WOOD_FILL, arch: 'wood_ashlar', margin: 36, ground: 12.5, backdrop: '#3a4230' };   // (round 10: an olive gloom, not teal)   // (round 3: a margin of 18 units, the wood before the camera to the frame's foot, not the edge's fog)   // (round 2: the gloom a mid moss green, so the far trunks stand dark against it as in the references)
const THEME_LOOK = { crypt: KIT_LOOK.gallery, dread: KIT_LOOK.barracks, cave: KIT_LOOK.cellar, nave: KIT_LOOK.nave, cinder: KIT_LOOK.cultcut, chasm: { floor: ['U', 'm'], wall: 'x', hour: 22.8 },
  warren: KIT_LOOK.warren, ember: KIT_LOOK.ember, lava: KIT_LOOK.lava, mire: KIT_LOOK.mound, sluice: KIT_LOOK.locks, poison: KIT_LOOK.vats, water: KIT_LOOK.abbey };
// (item 11, docs/art-critic-pass-stone.md) a generated floor (no plan, no kit: the Mere Tower, the endless floors to come)
// drew the Vale's kits whatever land it was in (THEME_LOOK). Its look now follows its land: the theme's own kit there where
// the land has one (the Fens' mire the Toadking's mud), else one of the land's built looks, picked by the floor's seed and
// stepping on with its depth, so the Mere Tower stands in the locks' and the abbey's stone and an endless descent walks
// through a land's looks floor by floor. Only the stone, the light's hour and its fill come over (`plainLook`): a kit's
// set pieces (an inside kit's walls, a wharf's water) belong to its authored rooms. The Vale's floors keep THEME_LOOK.
/** @type {Record<string, Record<string, string[]>>} a land's looks by theme (`any`: every other theme) */
const LAND_LOOKS = {
  fens: { mire: ['mound'], sluice: ['locks'], poison: ['vats'], water: ['abbey'], any: ['locks', 'abbey'] },   // (round 1: Vat Seven's sick green only where the theme is poison: a tower in it read as a cesspit)
  reach: { cave: ['pithead', 'warren'], warren: ['warren'], ember: ['works'], lava: ['lava', 'deepforge'], desert: ['yards', 'works'], chasm: ['deepforge'], any: ['yards', 'forge', 'works', 'pithead'] },
  tidemark: { any: ['seacave'] },
};
const plainLook = (k) => { const L = KIT_LOOK[k]; return L && (L.plainOf ||= { floor: L.floor, wall: L.wall, cave: L.cave, hour: L.hour, mix: L.mix, vents: L.vents, kit: k }); };
/** a generated floor's look by its land, theme, seed and depth: null for the Vale's (THEME_LOOK) @returns {any} */
function landLook(w) {
  const T = LAND_LOOKS[SITES[w.site]?.region]; if (!T) return null;
  const list = (T[w.theme] || T.any).filter((k) => KIT_LOOK[k]); if (!list.length) return null;
  return plainLook(list[((hash('land', w.seed >>> 0) >>> 11) + (w.depth || 0)) % list.length]);   // (the hash's high bits: FNV's low ones follow the seed's last digit)
}
/** the fill's tint underground for the Reach's kits and themes (palette.js KIT_TINT holds the Vale's and the Fens'):
 *  the lamps' warmth in the mine, the furnaces' in the works and the vault, the clerks' cool lamp in the cellars */
const AMB_TINT = { pithead: [1.08, 0.97, 0.86], warren: [1.04, 0.96, 0.88], ember: [1.16, 0.9, 0.78], lava: [1.22, 0.86, 0.72],
  // (round 3: the new kits' fill a step up, ~+12 %: the yards' world band 22 against the stone floors' 26 before)
  yards: [1.1, 1.04, 0.98], quota: [1.02, 1.03, 1.1], forge: [1.2, 1.0, 0.88], deepforge: [1.26, 0.94, 0.8], works: [1.22, 0.96, 0.84], vault: [1.3, 0.9, 0.76], strongroom: [1.12, 1.04, 0.96],
  // (the inn: firelight's warmth in the fill, a lit room's not a cellar's)
  tavern: [1.3, 1.06, 0.84], tavern_cellar: [1.3, 1.06, 0.84],
  seacave: [0.94, 1.0, 1.12], hulk: [1.22, 1.04, 0.86] };
AMB_TINT.frostkeep = [0.9, 1.0, 1.2];   // (the Praetory's: a cold fill, the torches warm against it)
// (item 8, docs/art-critic-pass-stone.md round 3: the Cold Seam's fill a step up, so its timber, rails and carts read on
// the rock: at the old tint a shoring set stood black against black)
Object.assign(AMB_TINT, { pithead: [1.17, 1.05, 0.93], warren: [1.13, 1.04, 0.95] });
const DEFAULT_LOOK = { floor: ['k', 'm'], wall: 'x', hour: 19.4 };
// ── the Vale's stone (docs/dungeon-looks-plan.md items 1 and 2; docs/art-critic-pass-vale.md) ─────────────────────────────
// The Old Barrows a barrow, not a castle: drystone under the mound's turf, its grass hanging over their tops, timber posts
// and lintels framing the niches and the passages' mouths, packed earth and worn slabs underfoot, the dead laid out on biers
// with their shields and spears, their grave goods in the niches, the muster hall's columns standing stones; the mouth cut
// earth shored with timber (barrowDress, BARROW_3D). Wickham Keep a keep: its bailey a cobbled yard under curtain walls of
// honey-grey ashlar with a crenellated parapet along their tops, lit as a yard at the day's end, a low sun over the walls
// (curtainRun); its barracks a great hall of limewashed plaster in an oak frame, the hearth, the trestles, the armoury's
// racks (the inn's frame and furniture, room by room: `whole`); its cellars still the cave the Redhand broke into. Each
// look keeps its kit's sim id, so the rooms, the foes, the bosses and the balance contract stand.
//   `barrow`: dressed by barrowDress; `whole`: the walls stand whole round the rooms in it (tavernWalls, room by room, on
//   any floor); `tint` / `fill`: the floor's light, taken from its way in's room (a barrow's earth-warm fill, a yard's sky);
//   `lift`: its ragged back walls a step taller (a barrow's passage walls, the mound over them).
// The legend's letters (the Old English and Norse ones, unlikely to be wanted by another kit): Þ the barrow's drystone
// under turf, Ð the mouth's cut earth under turf, þ its worn slabs, ð its packed earth; Æ the keep's curtain walls, æ the
// yard's cobbles, œ its trodden mud; Ø the great hall's plaster, ø its flags, Œ its flags strewn with rushes; Ƿ the Ninth
// Milestone's ashlar, ruined as the barrows' walls are (Æ stands whole).
Object.assign(LEGEND, {
  'Þ': { top: 'grass_dark', side: 'barrow_drystone', lip: 'barrow_turf', walkable: false }, 'Ð': { top: 'grass_dark', side: 'barrow_cut', lip: 'barrow_cutturf', walkable: false, overhang: false },   // (the cut's turf in its lip alone: a cave's ragged faces took a brim on every one, the perf pass)
  // (their near walls, broken low, without the turf's hanging brim: on every tile of them it cost a sixth more triangles a
  // frame for an edge the camera sees end-on; the perf pass)
  'Ȝ': { top: 'grass_dark', side: 'barrow_drystone', lip: 'barrow_turf', walkable: false, overhang: false }, 'ȝ': { top: 'grass_dark', side: 'barrow_cut', lip: 'barrow_cutturf', walkable: false, overhang: false },
  'þ': { top: 'barrow_slab', side: 'barrow_drystone', walkable: true }, 'ð': { top: 'barrow_earth', side: 'barrow_cut', walkable: true },
  'Æ': { top: 'rampart_top', side: 'keep_ashlar', walkable: false }, 'æ': { top: 'keep_cobble', side: 'keep_ashlar', walkable: true }, 'œ': { top: 'keep_mud', side: 'keep_ashlar', walkable: true },
  'Ø': { top: 'tavern_cap', side: 'keep_plaster', walkable: false }, 'ø': { top: 'keep_flag', side: 'keep_ashlar', walkable: true }, 'Œ': { top: 'keep_rushes', side: 'keep_ashlar', walkable: true },
  'Ƿ': { top: 'rampart_top', side: 'keep_ashlar', walkable: false }, 'Ǿ': { top: 'tavern_cap', side: 'keep_ashlar', walkable: false },
});
// (round 1: the old violet fill through an earth-warm tint took the earth and drystone to black, the muster hall a mean of
// ~14: a fill of its own, earth-warm, the lamps a step up; the gallery's cold blue had read as any crypt)
const BARROW_FILL = { sky: [0.74, 0.65, 0.56], ground: [0.38, 0.32, 0.27], lamps: 1.3 };   // (round 3: a tenth up, the muster hall still the darkest room)
const MILESTONE_FILL = { sky: [0.64, 0.64, 0.7], ground: [0.32, 0.31, 0.32], lamps: 1.3 };   // (the strongroom cool and dry; under the chasm's violet it read black, round 3)
const KEEP_FILL = { sky: [1.0, 0.9, 0.78], ground: [0.52, 0.45, 0.38], lamps: 1.8, sun: 0.55 };
Object.assign(KIT_LOOK, {
  dig: { floor: ['ð', 'þ'], wall: 'Þ', cave: 'Ð', hour: 19.3, mix: 10, barrow: true, lift: 1, fill: BARROW_FILL, arch: 'barrow_drystone' },
  gallery: { floor: ['þ', 'ð'], wall: 'Þ', cave: 'Ð', hour: 20.4, mix: 26, barrow: true, lift: 1, fill: BARROW_FILL, arch: 'barrow_drystone' },
  muster: { floor: ['þ', 'ð'], wall: 'Þ', cave: 'Ð', hour: 21.0, mix: 14, barrow: true, lift: 1, fill: BARROW_FILL, arch: 'barrow_drystone' },
  bailey: { floor: ['æ', 'œ'], wall: 'Æ', cave: 'Æ', hour: 18.2, mix: 16, whole: true, fill: KEEP_FILL, backdrop: '#262c38', arch: 'keep_ashlar' },
  barracks: { floor: ['ø', 'Œ'], wall: 'Ø', cave: 'Ø', hour: 19.4, mix: 22, whole: true, arch: 'keep_ashlar' },
  // the Ninth Milestone (secret, its kit `muster` in the sim): the legion's strongroom, cut square and dry, in the empire's
  // dressed stone (the keep's) over its flags, not the Barrows' turf and timber: SITE_KIT
  milestone: { floor: ['ø', 'ø'], wall: 'Ƿ', cave: 'x', hour: 21.0, mix: 0, arch: 'keep_ashlar', fill: MILESTONE_FILL },
});
// (v1.166) the Seventh Tower's hall (Highmarch's second floor, the owner: "the setting doesnt feel right for tollhaven area
// and what is in the first floor"): Wickham Keep's great hall, its oak frame and whole walls, in the walls' own grey stone
// (Ŧ: the rampart's wall under a timber cap) over grey flags, the night's cold fill the walls have, the braziers warm
Object.assign(LEGEND, { 'Ŧ': { top: 'tavern_cap', side: 'rampart_wall', walkable: false } });
KIT_LOOK.towerhall = { floor: ['ø', 'µ'], wall: 'Ŧ', cave: 'Ŧ', hour: 21.0, mix: 18, whole: true, inside: true, arch: 'rampart_wall', fill: RAMP_FILL };
/** the Seventh Tower's sea and fleet (buildTavern 'fleetsea', 'fleethull'): the sea SEA_Y under the floor, five ships
 * riding off the roof's south and east parapets, a few units out, each turned and sized by its own hash */
const SEA_Y = -6;
function fleetPieces(roof, W, D, X, Z) {
  /** @type {any[]} */
  const out = [{ k: 'fleetsea', W, D, y: SEA_Y }], R = (k) => (hash('fleet', k) % 1000) / 1000;
  const sx = X(roof.x1 + 1), sz = Z(roof.y1 + 1), wx = X(roof.x0), wz = Z(roof.y0);
  // (along the south parapet, then round the corner down the east: out in the drop and down on the water)
  const at = [[wx + (sx - wx) * 0.25, sz + 3.6], [wx + (sx - wx) * 0.66, sz + 5.2], [sx + 3.4, sz + 2.6], [sx + 4.2, wz + (sz - wz) * 0.5], [sx + 7.5, sz + 7.5]];
  at.forEach(([x, z], k) => out.push({ k: 'fleethull', x: r2(x + (R(k) - 0.5) * 2), z: r2(z + (R(k + 9) - 0.5) * 2), y: SEA_Y, ry: r2((R(k + 17) - 0.5) * 1.2 + (k % 2 ? 0.6 : -0.3)), s: r2(0.9 + R(k + 31) * 0.4), seed: (hash('fh', k) % 997) }));
  return out;
}
/** a site's own look for a kit it shares (renderer only: the sim's kit stands) */
const SITE_KIT = { ninth_milestone: { muster: 'milestone' }, highmarch: { barracks: 'towerhall' } };
/** the sites in the Vale's stone, whose halls take their rooms' looks (dungeon) */
const VALE_STONE = new Set(['barrows', 'wickham_keep', 'proving_pens', 'ninth_milestone']);
/** the barrow's back walls a step taller than the ruin's (a passage wall, the mound over it) */
const LIFT_OF = { 'Þ': 1, 'Ð': 1 };
/** a barrow's near walls, in their own letters (no turf brim: LEGEND) */
const NEAR_OF = { 'Þ': 'Ȝ', 'Ð': 'ȝ' };
/** an overland prop of ours (gsprite.js), a spawn point's dressing (sim/camps.js) */
const OVERLAND_OURS = new Set(['tent', 'carcass', 'burrow', 'rack', 'banner', 'standard', 'bedroll', 'reeds', 'boat', 'bound', 'urns', 'candles', 'saint', 'chains']);   // (v1.68: every land's spawn points' dressing)
/** a spawn point's dressing Luminati builds itself, as underground (DRESS_3D) */
// (step 7 of the Tidemark: the cart and the chains, every land's spawn points' since v1.68, weren't in either set and stood
// nowhere outdoors: the Reach's haulers, the Vault's mouth, the Praetory's watch and the Tidemark's four lacked them)
const OVERLAND_3D = new Set(['crates', 'sacks', 'bones', 'barrels', 'boulder', 'spoil', 'pillar', 'brokenpillar', 'cart']);
/** the furniture Luminati builds itself (h: a hash of the tile, for its size and turn) */
const DRESS_3D = {
  brazier: (x, z, h) => ({ type: 'fire', x, z, opts: { kind: 'brazier', size: 0.36, smoke: false, light: true, seed: h % 997 } }),   // (Emberlit's are small warm points: at 0.7 they bloomed into blobs, at 0.45 still big)
  crates: (x, z, h) => ({ type: 'crateStack', x, z, rotation: (h % 7) * 0.2, opts: { count: 1 + (h % 3), size: 0.7, seed: h % 997 } }),
  barrels: (x, z, h) => ({ type: 'barrel', x, z, rotation: (h % 9) * 0.3, opts: { height: 0.9, lying: h % 3 === 0 } }),
  sacks: (x, z, h) => ({ type: 'sacks', x, z, rotation: (h % 5) * 0.4, opts: { count: 2 + (h % 3), seed: h % 997 } }),
  boulder: (x, z, h) => ({ type: 'rock', x, z, opts: { size: 0.8 + (h % 5) * 0.1, seed: h % 97 } }),
  stalagmite: (x, z, h) => ({ type: 'crag', x, z, rotation: (h % 11) * 0.5, opts: { kind: 'spire', stone: 'basalt', height: 1.5 + (h % 4) * 0.35, width: 0.6, seed: h % 997 } }),
  bones: (x, z, h) => ({ type: 'debris', x, z, rotation: (h % 11) * 0.5, opts: { kind: 'bones', size: 0.32, charred: false, seed: h % 997 } }),
  spoil: (x, z, h) => ({ type: 'debris', x, z, rotation: (h % 11) * 0.5, opts: { kind: 'rubble', size: 0.5, charred: false, seed: h % 997 } }),
  pew: (x, z) => ({ type: 'bench', x, z, rotation: 0, opts: { length: 1.6, back: true } }),
  pillar: (x, z, h) => ({ type: 'crag', x, z, rotation: (h % 7) * 0.4, opts: { kind: 'pillar', stone: 'basalt', height: 2.7, width: 0.8, seed: h % 997 } }),
  brokenpillar: (x, z, h) => ({ type: 'crag', x, z, rotation: (h % 7) * 0.4, opts: { kind: 'pillar', stone: 'basalt', height: 0.9 + (h % 3) * 0.3, width: 0.8, seed: h % 997 } }),
  // the dressing pass (docs/vale-dungeon-dressing.md): Luminati's own, where it has the thing
  well: (x, z) => ({ type: 'well', x: x - 0.25, z: z - 0.25, rotation: 0, opts: { roof: 'wood_planks' } }),   // (over its 2 × 2 of ours: world.js big)
  bench: (x, z, h, k) => ({ type: 'bench', x, z, rotation: k === 'bench_y' ? Math.PI / 2 : 0, opts: { length: 1.4, back: false } }),
  shelf: (x, z, h, k) => ({ type: 'shelf', x, z, rotation: k === 'shelf_y' ? Math.PI / 2 : 0, opts: { kind: 'books', width: 1.6, height: 2.4, seed: h % 997 } }),
  cookfire: (x, z) => ({ type: 'campfire', x, z, rotation: 0, opts: { seat: false } }),
  cart: (x, z, h) => ({ type: 'debris', x, z, rotation: (h % 9) * 0.35, opts: { kind: 'cart', size: 0.8, charred: false, seed: h % 997 } }),
  map_table: (x, z) => ({ type: 'table', x: x - 0.25, z, rotation: 0, opts: { shape: 'rect', width: 1.6, depth: 0.9, cloth: false, items: true, candle: true, seed: 7 } }),
};
DRESS_3D.bench_y = DRESS_3D.bench; DRESS_3D.shelf_y = DRESS_3D.shelf;
/** what a piece brings with it in Luminati: Old Skarn's hens about his cart, a stool at Garrow's table */
const DRESS_3D_MORE = {
  hen_cart: (x, z) => [{ type: 'critters', x: x + 0.6, z: z + 0.9, kind: 'chicken', count: 3, radius: 1.4 }],
  map_table: (x, z) => [{ type: 'chair', x: x - 0.2, z: z + 0.8, rotation: Math.PI, opts: { style: 'stool', seed: 3 } }],
};
// ── the Magma Vault's pieces (sim/world.js DRESS_PIECES magma, furnace, anvil, crucible; docs/art-critic-pass-magma-vault.md)
// A furnace is ours (town.json reach_furnace: a smelting furnace of black brick and iron built into the back wall, its hood
// and flue into the rock, its mouth glowing), stood over its footprint (the sim's: the furnace tile at its front middle, a
// row of `block` either side and the row behind), its mouth's fire and embers Luminati's with the furnace's light, a
// little smoke up into its hood; a crucible ours (reach_crucible: a fireclay crucible on an iron stand, the melt in it
// lit); an anvil ours too (reach_anvil, on its stump, a bar hot on its face: Luminati's smith's stood unlit and unseen),
// turned one of two ways.
const MAGMA_3D = {
  furnace: (tx, ty, h, { X, Z, add, sprites, props }) => {
    // which way it faces: its footprint's back row behind it, toward the back wall (−y: a north wall; −x: a west one)
    const blk = (x, y) => props.get(`${x},${y}`) === 'block', faceX = !blk(tx, ty - 1) && blk(tx - 1, ty);
    const cx = faceX ? X(tx) : X(tx + 0.5), cz = faceX ? Z(ty + 0.5) : Z(ty);                       // (the footprint's middle)
    const mx = faceX ? X(tx + 1) : X(tx + 0.5), mz = faceX ? Z(ty + 0.5) : Z(ty + 1);               // (its mouth, on its face)
    sprites.push({ id: faceX ? 'reach_furnacex' : 'reach_furnace', x: cx, z: cz, here: true });
    add({ type: 'fire', x: mx, z: mz, opts: { kind: 'embers', size: 0.55, smoke: false, light: false, seed: h % 997 } });
    add({ type: 'light', x: mx, z: r2(mz + (faceX ? 0 : 0.4)), dy: 0.9, color: '#ff7a2a', intensity: 6, distance: 6.5, flicker: 0.18, nightOnly: false });
    add({ type: 'emitter', x: cx, z: cz, preset: 'embers', dy: 1.4, size: [0.5, 0.3, 0.3], count: 6, params: { life: [0.8, 1.8], velocity: [0, 1.2, 0] } });
  },
  crucible: (tx, ty, h, { X, Z, sprites }) => { sprites.push({ id: 'reach_crucible', x: X(tx + 0.5), z: Z(ty + 0.5), here: true }); },
  anvil: (tx, ty, h, { X, Z, sprites }) => { sprites.push({ id: h % 2 ? 'reach_anvilx' : 'reach_anvil', x: X(tx + 0.5), z: Z(ty + 0.5), here: true }); },
};
// ── the Cold Seam a worked mine (item 8; sim/world.js rails, robbed_shoring, tipped_cart; docs/art-critic-pass-stone.md).
// The pithead's and the warren's pieces in 3D, built by world.js buildTavern into one batch (`mine`, as an inside kit's
// trim): a shoring set where the sim stands one, two squared props and a cap beam against the rock, lagging boards behind
// (against a near wall only the props' stumps, knee high, so a fight is never behind them); the warren's the same, robbed:
// a prop gone, the cap down, the boards stripped; the rails laid in runs, iron on sleepers; the ore carts on them, an
// iron-banded tub on four small wheels with ore heaped in it, or tipped on its side by the goblins' heap; a lamp hung on
// an iron hook from a post at the wall, its warm light; a ladder against the rock; a spoil heap bigger than a rubble
// scatter; where the roof came in, a fallen prop across the rock. Every choice a hash of the tile.
const MINE_KITS = new Set(['pithead', 'warren']);
const MINE_LAMP = '#ffbc6e';
/** the nearest wall from a point, any side, within four tiles (Luminati's units): its side, its face's line, how far */
function wall4(open, x, z) {
  const i = Math.floor(x), j = Math.floor(z); let best = null;
  for (const [side, di, dj] of /** @type {[string, number, number][]} */ ([['n', 0, -1], ['w', -1, 0], ['s', 0, 1], ['e', 1, 0]])) for (let k = 1; k <= 4; k++) {
    if (open(i + di * k, j + dj * k)) continue;
    const d = side === 'n' ? z - (j - k + 1) : side === 's' ? (j + k) - z : side === 'w' ? x - (i - k + 1) : (i + k) - x;
    if (!best || d < best.d) best = { side, d, line: side === 'n' ? j - k + 1 : side === 's' ? j + k : side === 'w' ? i - k + 1 : i + k };
    break;
  }
  return best;
}
/** a piece set against a wall: its face's frame (n: the axis it runs along, out: +1 into the room toward +z/+x, −1 back) */
const onWall = (wl, x, z) => (wl.side === 'n' || wl.side === 's' ? { x, z: wl.line, n: 'z', out: wl.side === 'n' ? 1 : -1, near: wl.side === 's' } : { x: wl.line, z, n: 'x', out: wl.side === 'w' ? 1 : -1, near: wl.side === 'e' });
const MINE_3D = {
  shoring: (x, z, h, k, { mine, open, add }) => {
    const wl = wall4(open, x, z); if (!wl || wl.d >= 2.6) return;
    const f = onWall(wl, x, z), broken = k.startsWith('shoring_broken'), lamp = !broken && !f.near && h % 2 === 0;   // (round 2: a lamp on the cap of every other set, its light: unlit, the sets stood black on the rock)
    mine.push({ k: 'shoringset', ...f, broken: broken ? 1 : 0, lamp: lamp ? 1 : 0, seed: h % 997 });
    if (lamp) add({ type: 'light', x: f.n === 'z' ? x : r2(f.x + f.out * 0.9), z: f.n === 'z' ? r2(f.z + f.out * 0.9) : z, dy: 2.1, color: MINE_LAMP, intensity: 3.6, distance: 5.5, flicker: 0.12, nightOnly: false });
  },
  cart: (x, z, h, k, { mine, rails, tx, ty }) => {
    const rx = rails.has(`${tx - 1},${ty}`) || rails.has(`${tx + 1},${ty}`), rz = rails.has(`${tx},${ty - 1}`) || rails.has(`${tx},${ty + 1}`);
    mine.push({ k: 'orecart', x, z, rot: rx ? 0 : rz ? Math.PI / 2 : (h % 4) * 0.4, rail: rx || rz ? 1 : 0, tipped: k === 'cart_tipped' ? 1 : 0, seed: h % 997 });
  },
  lantern: (x, z, h, k, { mine, open, add }) => {
    const wl = wall4(open, x, z), f = wl ? onWall(wl, x, z) : { x, z, n: 'z', out: 1, near: false };
    mine.push({ k: 'hooklamp', ...f, at: wl ? (f.n === 'z' ? x : z) : 0, free: wl ? 0 : 1, seed: h % 997 });
    const lx = f.n === 'z' ? x : r2(f.x + f.out * 0.75), lz = f.n === 'z' ? r2(f.z + f.out * 0.75) : z;
    add({ type: 'light', x: wl ? lx : x, z: wl ? lz : z, dy: 1.7, color: MINE_LAMP, intensity: 5.2, distance: 7.5, flicker: 0.12, nightOnly: false });
  },
  ladder: (x, z, h, k, { mine, open }) => { const wl = wall4(open, x, z); if (wl) mine.push({ k: 'mladder', ...onWall(wl, x, z), seed: h % 997 }); },
  // (the perf pass, docs/art-critic-pass-stone.md: a heap's rock and a fall's rock in the mine's own batch, not a Luminati
  // object each: at one each the burrow hall drew a third more)
  spoil: (x, z, h, k, { add, mine }) => {
    add({ type: 'debris', x, z, rotation: (h % 11) * 0.5, opts: { kind: 'rubble', size: 0.85, charred: false, seed: h % 997 } });
    mine.push({ k: 'minerock', x: r2(x + 0.25), z: r2(z - 0.2), r: 0.4 + (h % 3) * 0.08, seed: h % 997 });
  },
  brokenpillar: (x, z, h, k, { mine }) => {
    mine.push({ k: 'minerock', x, z, r: 0.65 + (h % 3) * 0.08, seed: h % 997 });
    mine.push({ k: 'fallenprop', x: r2(x + 0.4), z: r2(z + 0.3), rot: (h % 7) * 0.45, seed: h % 997 });
  },
};
MINE_3D.shoring_y = MINE_3D.shoring_broken = MINE_3D.shoring_broken_y = MINE_3D.shoring; MINE_3D.cart_tipped = MINE_3D.cart;
// ── a counting house's furniture (item 9, the look `counting`), into the inside kit's batch: the clerks' desks in their
// rows, a stool at each, the day's book open on it, a chain from its leg to a ring let into the floor; the Weighmaster's
// own desk bigger and unchained; the clerk's cool lamp on its iron stand; the strongbox, iron-bound, its lock
const COUNT_3D = {
  clerk_desk: (x, z, h, k, { trim, add, wall }) => {
    const rot = k.endsWith('_y') ? Math.PI / 2 : 0, own = k.startsWith('desk');
    trim.push({ k: 'furn', type: 'table', x, z, rot, s: TAV_S, opts: { shape: 'rect', width: own ? 1.4 : 1.05, depth: own ? 0.8 : 0.6, cloth: false, items: false, candle: false, seed: h % 997 } });
    const back = wall && wall.d < 6 ? -1 : 1;   // (the clerk sits with his back to the wall, facing the room)
    trim.push({ k: 'furn', type: 'chair', x: r2(x + (rot ? back * 0.8 : 0)), z: r2(z + (rot ? 0 : back * 0.8)), rot: rot ? (back < 0 ? Math.PI / 2 : -Math.PI / 2) : back < 0 ? Math.PI : 0, s: TAV_S, opts: { style: 'stool', seed: h % 997 } });
    trim.push({ k: 'cbook', x, z, rot, y: TAV_FLOOR_Y + 0.82 * TAV_S, own: own ? 1 : 0, seed: h % 997 });
    if (!own) trim.push({ k: 'chainring', x, z, rot, out: -back, seed: h % 997 });
    if (own) add({ type: 'light', x, z, dy: 0.82 * TAV_S + 0.5, color: COUNT_LIGHT, intensity: 0.9, distance: 2.4, flicker: 0.04, nightOnly: false });
  },
  lantern: (x, z, h, k, { trim, add }) => { trim.push({ k: 'clampstand', x, z, seed: h % 997 }); add({ type: 'light', x, z, dy: 1.9, color: COUNT_LIGHT, intensity: 4.6, distance: 6.5, flicker: 0.04, nightOnly: false }); },
  strongbox: (x, z, h, k, { trim, wall }) => trim.push({ k: 'strongbox', x, z, rot: wall && wall.side === 'w' ? Math.PI / 2 : 0, seed: h % 997 }),
};
COUNT_3D.clerk_desk_y = COUNT_3D.desk = COUNT_3D.desk_y = COUNT_3D.clerk_desk;
// (round 4: the office's pillars dressed square piers of its own pale stone, a fallen one a stump: as the dungeons' basalt
// they stood as black posts in a pale room)
COUNT_3D.pillar = (x, z, h, k, { trim }) => trim.push({ k: 'cpillar', x, z, broken: 0, seed: h % 997 });
COUNT_3D.brokenpillar = (x, z, h, k, { trim }) => trim.push({ k: 'cpillar', x, z, broken: 1, seed: h % 997 });
/** MAGMA_LIGHT: a light every this many of the flow's tiles (of ours), along a run: the rooms have their braziers and
 *  torches already, and Luminati keeps the dozen nearest the camera (docs/art-critic-pass-magma-vault.md, the budget) */
const MAGMA_LIGHT = 12;
/** the magma, as one flow: its tiles to world.js (placeEnv `magma`: one mesh, the molten surface moving, a crust at its
 *  open edges and a lip of black rock), a hot light along each run, embers off it here and there */
function magmaFlow(list, X, Z, add, sprites) {
  const on = new Set(list.map(([x, y]) => `${x},${y}`)), has = (x, y) => on.has(`${x},${y}`);
  const cells = list.map(([x, y]) => [X(x + 0.5), Z(y + 0.5), (has(x, y - 1) ? 1 : 0) | (has(x + 1, y) ? 2 : 0) | (has(x, y + 1) ? 4 : 0) | (has(x - 1, y) ? 8 : 0)]);
  sprites.push({ magma: { cells } });
  // the lights: walk the tiles in order of x then y, a light every MAGMA_LIGHT; a pool's middle gets one
  const seen = new Set(); let n = 0;
  for (const [x, y] of [...list].sort((a, b) => a[1] - b[1] || a[0] - b[0])) {
    if (seen.has(`${x},${y}`)) continue;
    // its group (4-connected), lit at its middle and every MAGMA_LIGHT along it
    const grp = [], q = [[x, y]]; seen.add(`${x},${y}`);
    while (q.length) { const [a, b] = q.pop(); grp.push([a, b]); for (const [da, db] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const k = `${a + da},${b + db}`; if (on.has(k) && !seen.has(k)) { seen.add(k); q.push([a + da, b + db]); } } }
    grp.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    const step = Math.max(1, Math.round(grp.length / Math.max(1, Math.round(grp.length / MAGMA_LIGHT))));
    for (let i = Math.floor(step / 2); i < grp.length; i += step) {
      const [a, b] = grp[i];
      add({ type: 'light', x: X(a + 0.5), z: Z(b + 0.5), dy: 0.5, color: '#ff6a22', intensity: 3.6, distance: 5.5, flicker: 0.08, nightOnly: false });
      if (n++ % 2 === 0) add({ type: 'emitter', x: X(a + 0.5), z: Z(b + 0.5), preset: 'embers', dy: 0.15, size: [0.8, 0.1, 0.4], count: 5, params: { life: [1.0, 2.2], velocity: [0, 0.8, 0] } });
    }
  }
}
/** the light a doorway's lamp throws, intensity and reach (the dressing pass: they stand in for the braziers that lit every
 *  doorway, and the rooms read 12 % darker by them at first) */
const DOOR_POOL = { candelabra: [7, 7], lantern: [6, 6.5], candles: [6.5, 6.5] };
/** our props laid on the floor rather than stood up (walked over: drawn under the figures) */
const FLAT = new Set(['circle', 'bedroll', 'shaft', 'straw', 'rug', 'scorch', 'cracks', 'coins', 'papers', 'puddle', 'pit']);
const hex = (c) => { const m = Math.max(...c, 1e-6); return '#' + c.map((v) => Math.round((v / m) * 255).toString(16).padStart(2, '0')).join(''); };

// The light underground is Emberlit's: its dungeon ambient (renderer.js AMB_BASE, a dim violet-grey) through the kit's
// tint, no sun or moon, the braziers and lamps doing the rest. Luminati's own hour read its dusk and night palette and
// lit every wall a saturated violet.
const AMB_BASE = [0.379, 0.324, 0.449];
const INSIDE_FILL = { sky: [1.05, 0.88, 0.72], ground: [0.56, 0.45, 0.36] };   // (round 6: a tenth down, so the pools lead and the corners fall away)   // (round 5: a touch toward umber, the rooms' middles warmer)
/** the ambient a floor's kit wants: Luminati's hemisphere light's sky and ground colours (linear) and intensity */
export function ambientOf(kit) {
  // (a building's inside is lit, not a cellar: a lamp-and-hearth warmth in the fill, the floor readable from wall to wall,
  // the lamps a little stronger in their pools: docs/tavern-dungeon.md)
  if (KIT_LOOK[kit]?.inside || KIT_LOOK[kit]?.fill || KIT_LOOK[kit]?.coast) { const F = KIT_LOOK[kit].fill || INSIDE_FILL; return { sky: F.sky, ground: F.ground, i: 1, sun: F.sun || 0, lamps: F.lamps || 1.9 }; }   // (a crypt's own, cold: CRYPT_FILL; a yard under the sky, the keep's bailey, its own fill and a low sun: KEEP_FILL)
  // (the tint squared: at its own strength every floor read one navy; the dig wants its warmth, the gallery its cold)
  const t = (KIT_LOOK[kit]?.tint || KIT_TINT[kit] || AMB_TINT[kit] || [1, 1, 1]).map((v) => v * v), c = (k) => AMB_BASE.map((v, i) => r2(v * t[i] * k));
  // (the owner on the phone, 2026-11-02: "The dungeons are too dark". At Emberlit's own brightness a room's floor away
  // from the braziers was lost on a phone; the fill is nearly doubled and the lamps reach further: lamps is Luminati's
  // point lights ×, a brazier a pool of orange at 1)
  return { sky: c(1.0), ground: c(0.5), i: 1, sun: 0, lamps: 0.85 };
}

// ── the walls' ragged tops (GDD §3.1 v1.98; the owner, 2026-11-14, from a reference: "some height variations in walls, some
// minor dressing on top of walls", then "Implement the wall variations but no ribs"; docs/walls-ruin-spike.md). The ring of
// wall round a floor stood at one height, a level box. Here the back walls (the room south and east of them: the faces the
// camera sees) rise and fall in runs of two or three tiles, a pier now and then standing higher with candles and a small
// flame on it, and the near walls (between the camera and the floor) are broken down to a knee-high ruin, so they frame the
// room rather than hide it. On the tops: rubble and the odd fallen block (no bones: the owner). Every choice is a hash of
// the tile, so a floor looks the same every visit. Nothing here touches the sim. ?walls=plain: the level boxes, as before.
const WALL = 6;
/** @returns {{ i: number, j: number, h: string, sprite?: any, ob: (X: (n: number) => number, Z: (n: number) => number) => any }[]} what stands on the tops */
function ruinWalls(W, D, tiles, heights, open, lift = null) {   // (lift(i, j): a step or two more for a kit's back walls, KIT_LOOK `lift`)
  const out = [], raise = [];
  const near = (i, j) => open(i - 1, j) || open(i, j - 1) || (!open(i + 1, j) && !open(i, j + 1) && open(i - 1, j - 1));   // (the floor on its far side: it stands between the camera and the room)
  for (let j = 0; j < D; j++) for (let i = 0; i < W; i++) {
    if (heights[j][i] !== String(WALL)) continue;
    const back = open(i + 1, j) || open(i, j + 1) || open(i + 1, j + 1);
    if (near(i, j) && !(open(i + 1, j) || open(i, j + 1))) {     // a near wall: broken down low, its top ragged
      const h = hash('rn', i >> 1, j >> 1) % 4;
      heights[j][i] = String(3 + (h === 3 ? 2 : h === 0 ? 0 : 1)); if (NEAR_OF[tiles[j][i]]) tiles[j][i] = NEAR_OF[tiles[j][i]];
      if (hash('rd', i, j) % 9 === 0) out.push({ i, j, h: heights[j][i], ob: (X, Z) => ({ type: 'debris', x: r2(i + 0.26 + (hash('rj', i, j) % 5) * 0.12), z: r2(j + 0.26 + (hash('rj', j, i) % 5) * 0.12), rotation: (hash('rr', i, j) % 11) * 0.5, opts: { kind: 'rubble', size: 0.38, charred: false, seed: hash('rs', i, j) % 997 } }) });
      continue;
    }
    if (!back) continue;
    // a back wall: in runs (a run is two or three tiles along it), each a step up or down from the course; one with a floor
    // on its camera side too (between two rooms) only ever steps down, so it never stands taller in front of a fight
    const run = (hash('rb', Math.floor((i + j) / 3)) % 7), both = near(i, j);
    raise.push([i, j, both ? [0, 1, 1, 1, 0, 1, 1][run] : [0, 1, 1, 2, 2, 3, 3][run], both]);
  }
  for (const [i, j, k, both] of raise) {
    // a pier: every so often along a back wall, a block taller, candles on it and a small flame (no light of its own:
    // Luminati shares twelve among all the lights in view, and the room's own lamps need them)
    const pier = !both && hash('rp', i, j) % 13 === 0;
    const h = (pier ? WALL + 3 : WALL - 1 + k) + (lift ? lift(i, j) : 0);
    heights[j][i] = h.toString(36);
    const hs = heights[j][i], d = hash('rt', i, j) % 13, x = r2(i + 0.5), z = r2(j + 0.5);
    if (pier) out.push({ i, j, h: hs, sprite: { prop: 'candles', kind: 'candles', tx: 9000 + i, ty: 9000 + j, x, z }, ob: () => ({ type: 'fire', x, z, opts: { kind: 'brazier', size: 0.34, smoke: false, light: false, seed: hash('rf', i, j) % 997 } }) });
    else if (d === 2 || d === 3) out.push({ i, j, h: hs, ob: () => ({ type: 'debris', x: r2(x - 0.24 + (hash('rj', i, j) % 5) * 0.12), z: r2(z - 0.24 + (hash('rj', j, i) % 5) * 0.12), rotation: (hash('rr', i, j) % 11) * 0.5, opts: { kind: 'rubble', size: 0.36, charred: false, seed: hash('rs', i, j) % 997 } }) });   // (off the tile's middle: four on one wall's line stood at one beat, §4.6)
    else if (d === 4) out.push({ i, j, h: hs, ob: () => ({ type: 'rock', x, z, opts: { size: 0.42, seed: hash('rk', i, j) % 97 } }) });
  }
  return out;
}

// ── a building's inside: the Shuttered Inn (docs/tavern-dungeon.md; the owner, 2026-11-22, from a reference: "a dungeon
// level that looks like the inside of a building.. a tavern. Needs more open floor to accommodate NPC battle but the walls
// are up and set dressing looks great"). The ruin's ragged tops are a dungeon's; an inn's walls stand whole. The back
// walls (the faces the camera sees) rise their full height, a storey and a half, square-topped and capped in timber; the
// near walls (between the camera and the room) are cut down to a clean sill, the cutaway of a doll's house, so a fight
// is never behind one. Along the back walls the building's frame: an oak post at each end of a run and every few tiles,
// a beam along the top; between the posts the inn's own things, shields hung up, a lantern on an iron arm, cobwebs in
// the high corners. The furniture is Luminati's interiors (TAVERN_3D); the rest ours, built in one batch by world.js
// buildTavern (one draw a material). Every choice is a hash of the tile: the same inn every visit.
const TAV_BACK = 8, TAV_NEAR = 3;
// (a crypt's back walls a unit taller, four over the floor: at the inn's three, a round arch over a bay couldn't stand, and
// the arcade flattened to a strip at a phone's size, the art critic's round 2)
const CR_BACK = 10, CR_TOP_Y = CR_BACK * 0.5;
/** what hangs in a bay that isn't a lantern's (world.js buildTavern): a shield, a plate shelf, antlers, a peg rail with a
 * cloak and a hat, the slate of chalked tallies, herbs drying */
const TAV_STORY = ['shield', 'shelf', 'antlers', 'pegs', 'slate', 'herbs'];
/** a ship's (the hulk kit's: the Gull Isles' second floor, the Sister's Cabin): no antlers or drying herbs on her side,
 *  which read as a hunting lodge's (docs/art-critic-pass-tidemark-step7.md); oilskins on pegs, a tally slate, plates */
const SHIP_STORY = ['pegs', 'shelf', 'slate', 'shield', 'pegs', 'slate'];
/** the keep's great hall's (Wickham Keep's barracks): the garrison's shields, some with blades crossed behind, a peg rail,
 *  the duty slate, a stag's antlers over the high table's end */
const HALL_STORY = ['shield', 'pegs', 'shield', 'slate', 'shield', 'antlers'];
const TAV_FLOOR_Y = FLOOR * 0.5, TAV_TOP_Y = TAV_BACK * 0.5;
/** what a back wall carries, by its stone: the inn's timber frame, its cellar's niches, the crypt's blind arcade and its
 * ossuary's bones */
const WALL_STYLE = { '+': 'cellar', '*': 'crypt', ':': 'ossuary', '|': 'palace' };
Object.assign(WALL_STYLE, { 'Æ': 'curtain', 'Ø': 'hall' });
// (the great hall's near walls, cut to their sill, in its ashlar footing: their outer faces in limewash read as a pale
// band under the room, round 3)
const HALL_SILL = { 'Ø': 'Ǿ' };   // (Wickham Keep's: its curtain walls, its great hall: curtainRun, tavernDress)
/** the walls that stand whole on a floor of ruins, round their own rooms (KIT_LOOK `whole`) */
const WHOLE_WALLS = new Set(['Æ', 'Ø']);
// (the Undercroft's brick arcade and its bone room, the crypt's and the ossuary's in fen brick; the counting house's
// ledger walls: items 6, 9)
Object.assign(WALL_STYLE, { 'б': 'fencrypt', 'п': 'fenossuary', 'с': 'counting' });
/** the styles whose back walls stand the crypt's four units, under an arcade (the palace's grander, its own pieces) */
const ARCADED = new Set(['crypt', 'ossuary', 'palace', 'fencrypt', 'fenossuary', 'counting']);
/** a stone's near sill, a step darker (the crypt's limestone, the palace's) */
const SILL_OF = { ':': ';', '*': ';', '|': '?', 'б': 'т', 'п': 'т', 'с': 'ч' };
/** the walls' heights for a building's inside; the back faces, for its frame @returns {{ i: number, j: number, n: 's' | 'e' }[]} */
function tavernWalls(W, D, heights, open, looks, tiles, only = null) {
  const faces = [];
  for (let j = 0; j < D; j++) for (let i = 0; i < W; i++) {
    if (heights[j][i] !== String(WALL)) continue;
    if (only && !only.has(tiles[j][i])) continue;   // (on a floor of ruins, only the rooms whose walls stand whole: WHOLE_WALLS)
    const s = open(i, j + 1), e = open(i + 1, j), near = open(i - 1, j) || open(i, j - 1) || (!s && !e && open(i - 1, j - 1));
    if (near && !(s || e)) { heights[j][i] = String(TAV_NEAR); if (SILL_OF[tiles[j][i]] || HALL_SILL[tiles[j][i]]) tiles[j][i] = SILL_OF[tiles[j][i]] || HALL_SILL[tiles[j][i]]; continue; }   // a near wall: a sill (the ossuary's in ashlar: its bones on the outside read as a cliff of skulls, round 4)
    if (!(s || e || open(i + 1, j + 1))) continue;
    const style = WALL_STYLE[tiles[j][i]] || 'tavern', rough = style === 'cellar';   // (the crypt's arcade, the ossuary's bones: by their stone too)
    heights[j][i] = near ? String(TAV_NEAR) : (ARCADED.has(style) || style === 'curtain' ? CR_BACK.toString(36) : String(TAV_BACK));              // (a wall with the floor on its camera side too stays low: it would stand in front of a fight)   // (the keep's curtain as tall as the crypt's arcade)
    if (near) { if (ARCADED.has(style)) tiles[j][i] = SILL_OF[tiles[j][i]] || ';'; continue; }
    // (rough: the wall's own stone is the cellar's rubble, so it takes no frame; the frame follows the texture, and a
    // timber run ends at a post where the rubble starts: round 6, "a visible seam")
    if (s) faces.push({ i, j, n: 's', rough, style });
    if (e) faces.push({ i, j, n: 'e', rough, style });
  }
  return faces;
}
/** the nearest back wall's face from a point (Luminati's units): north (a face at z, the room south of it) or west */
function wallOf(open, W, D, x, z) {
  const i = Math.floor(x), j = Math.floor(z);
  let n = null, w = null;
  for (let k = 0; k <= 4 && !n; k++) if (!open(i, j - k)) n = { z: j - k + 1, d: z - (j - k + 1) };
  for (let k = 0; k <= 4 && !w; k++) if (!open(i - k, j)) w = { x: i - k + 1, d: x - (i - k + 1) };
  return !w || (n && n.d <= w.d) ? (n ? { side: 'n', z: n.z, x, d: n.d } : null) : { side: 'w', x: w.x, z, d: w.d };
}
/** the frame along the back walls and what hangs on them, into `trim` (world.js buildTavern) */
// ── a wall's beat (docs/level-design-rules.md §4.6; the owner, 2026-11-28, of the Gull Isles' gun deck: "dressing should
// have rules to not repeat and line up the same dressing"). A lantern in every other bay down a seventy-tile wall, a
// shield every third, a sconce on every other pier: the eye reads the stamp, not the room. A run's lights fall about every
// other slot, two slots apart or three as a hash of the wall has it, never the same gap three times running (so never
// four at one spacing: src/sim/dresslines.js); its bays' pieces are drawn from the place's list, never one of the last
// two again. Every choice a hash of the wall: the same room every visit.
/** which of a run's n slots carry a light (or whatever keeps a beat): true at each */
function beats(n, key, salt) {
  const on = new Array(n).fill(false); let i = hash(salt, key) % 2, last = 0, rep = 0;
  while (i < n) {
    on[i] = true;
    let g = 2 + (hash(salt, key, i) % 2);
    if (g === last && ++rep >= 2) { g = g === 2 ? 3 : 2; rep = 0; } else if (g !== last) rep = 0;
    last = g; i += g;
  }
  return on;
}
/** the next bay's piece from a place's list: a hash's pick, but never one of the last two picked (where the list has
 * three kinds or more) */
function storyPick(st, key, t, used) {
  const kinds = [...new Set(st)];
  let k = st[hash('sp', key, t) % st.length];
  for (let g = 0; kinds.length > 2 && used.slice(-2).includes(k) && g < kinds.length; g++) k = kinds[(kinds.indexOf(k) + 1) % kinds.length];
  used.push(k); return k;
}
function tavernDress(faces, arches, open, add, trim, roomAt = () => null, story = TAV_STORY, lamps = []) {
  const clearOf = (x, z) => arches.every((a) => Math.abs(x - a.x) > a.span / 2 + 1.2 || Math.abs(z - a.z) > 2.5);
  const lampBy = (x, z) => lamps.some(([lx, lz]) => Math.abs(lx - x) < 2.2 && Math.abs(lz - z) < 2.2);   // (a room's own lamp within reach: the bay stays bare)
  // runs along each line of faces: a north wall's (faces 's', along x) and a west wall's (faces 'e', along z)
  const lines = new Map();
  for (const f of faces) { const key = `${f.style || 'tavern'}|` + (f.n === 's' ? `s${f.j}` : `e${f.i}`); (lines.get(key) || lines.set(key, []).get(key)).push(f.n === 's' ? f.i : f.j); }
  for (const [key, ts] of lines) {
    ts.sort((a, b) => a - b);
    const [style, k0] = key.split('|'), cellar = style === 'cellar', s = k0[0] === 's', c = +k0.slice(1) + 1;   // (the face's line: z (north wall) or x (west wall))
    const P = (t) => (s ? [t, c] : [c, t]), n = s ? 'z' : 'x';
    const runs = []; for (const t of ts) { const r = runs[runs.length - 1]; if (r && t === r[1]) r[1] = t + 1; else runs.push([t, t + 1]); }
    for (const [a, b] of runs) {
      if (b - a < 2) continue;
      if (style === 'palace') { palaceRun(a, b, { key, s, n, P, add, trim, clearOf, roomAt }); continue; }
      if (style === 'curtain') { curtainRun(a, b, { key, s, n, P, trim, clearOf }); continue; }   // (the keep's bailey: its parapet, slits and torches)
      if (ARCADED.has(style)) {
        // (the Undercroft's runs the crypt's, in fen brick: each piece marked `fen`, world.js builds it in the reed town's
        // brick and lime; its bays' story its own, the eel-men's traps and nets hung among the shelves)
        const n0 = trim.length, fen = style.startsWith('fen');
        (style === 'counting' ? countingRun : style === 'crypt' || style === 'fencrypt' ? cryptRun : ossuaryRun)(a, b, { key, s, n, P, add, trim, clearOf, story: fen ? FEN_STORY : CRYPT_STORY });
        if (fen) for (let i = n0; i < trim.length; i++) trim[i].fen = 1;
        continue;
      }
      if (cellar) {
        // a cellar's wall: no frame; a niche with its candles every four tiles (every other one a light), a ham or a
        // string of onions on a hook between
        for (let t = a + 2, q = 0; t <= b - 2; t += 2, q++) {
          const [x, z] = P(t); if (!clearOf(x, z)) continue;
          if (q % 2 === 0) { trim.push({ k: 'niche', x, z, n, y: TAV_FLOOR_Y + 1.5 }); if (q % 4 === 0) add({ type: 'light', x: r2(x + (s ? 0 : 0.5)), z: r2(z + (s ? 0.5 : 0)), dy: 1.4, color: '#ffbe72', intensity: 2.4, distance: 4.5, flicker: 0.16, nightOnly: false }); }
          else if (hash('tc', key, t) % 3 === 0) trim.push({ k: 'ham', x, z, n, y: TAV_TOP_Y - 0.5, look: hash('th', key, t) % 2 });
        }
        continue;
      }
      const [x0, z0] = P(a), [x1, z1] = P(b);
      trim.push({ k: 'beam', x0, z0, x1, z1, n, y: TAV_TOP_Y - 0.2 });
      trim.push({ k: 'grime', x0, z0, x1, z1, n });   // (a darker band of grime at the wall's foot: round 7, "what gives the reference its depth")
      const posts = [a, b]; for (let t = a + 4; t <= b - 3; t += 4) posts.push(t);
      for (const t of posts) { const [x, z] = P(t); if (clearOf(x, z)) trim.push({ k: 'post', x, z, n, end: t === a ? 1 : t === b ? -1 : 0 }); }
      // between the posts, each bay its own story (round 5: "every back wall is the same bay repeated"): a lantern in every
      // other bay (its light), and in the rest one thing each, never the same twice running; a long wall's middle bay a
      // shuttered window, the inn's name, a cool line of night through its crack
      const bays = []; for (let t = a + 2; t <= b - 2; t += 4) bays.push(t);
      const st = style === 'hall' ? HALL_STORY : story;   // (the keep's great hall: shields and arms, not the inn's plates and herbs)
      const win = b - a >= 14 ? bays[(bays.length / 2) | 0] : null, lit = beats(bays.length, `${key}|${a}`, 'tl'), used = [];
      bays.forEach((t, q) => {
        const [x, z] = P(t); if (!clearOf(x, z) || lampBy(x, z)) return;
        if (t === win) {
          trim.push({ k: 'window', x, z, n, y: TAV_FLOOR_Y + 1.75 });
          add({ type: 'light', x: r2(x + (s ? 0 : 1.0)), z: r2(z + (s ? 1.0 : 0)), dy: 0.5, color: '#7a8fc4', intensity: 1.8, distance: 3.2, flicker: 0, nightOnly: false });   // (moonlight, blue-grey and dim: rounds 9, 10)   // (a cool sliver on the floor below it: round 6)
        } else if (lit[q] && q > 0 && q < bays.length - 1) {   // (on the wall's beat, every other bay or every third: §4.6; never a run's end bay, where the next wall's pieces hang a hand away and burned white)
          const light = add({ type: 'light', x: r2(x + (s ? 0 : 0.7)), z: r2(z + (s ? 0.7 : 0)), dy: 1.6, color: '#ffb468', intensity: 2.9, distance: 6, flicker: 0.1, nightOnly: false });
          trim.push({ k: 'lantern', x, z, n, y: TAV_FLOOR_Y + 2.6, light });
        } else {
          const kind = storyPick(st, key, t, used);
          trim.push(kind === 'shield' ? { k: 'shield', x, z, n, y: TAV_FLOOR_Y + 2.05, look: hash('ts', key, t) % 5 } : { k: kind, x, z, n, y: TAV_FLOOR_Y + 1.95, seed: hash('ty', key, t) % 997 });   // (between the rail and the beam, built half again as big: round 6, "dark specks")
        }
        if ((q === 0 || q === bays.length - 1) && hash('tw2', key, t) % 3 === 0) trim.push({ k: 'web2', x, z, n, y: TAV_TOP_Y - 0.36, side: q === 0 ? 1 : -1, size: 0.6 + (hash('tz', key, t) % 5) * 0.1 });   // (a web in a corner bay now and then)
      });
    }
  }
  // cobwebs in the high corners where a north wall meets a west one (half of them)
  for (const f of faces) {
    if (f.n !== 's') continue;
    const i = f.i, j = f.j + 1;                                    // the floor tile south of this face
    if (open(i - 1, j) || open(i - 1, j - 1) || hash('tw', i, j) % 2) continue;   // (a west wall beside it: an inside corner)
    if (clearOf(i, j) && !ARCADED.has(f.style) && f.style !== 'curtain') trim.push({ k: 'web', x: i, z: j, y: TAV_TOP_Y - 0.25 });   // (and none in a palace: it's kept)   // (the crypt's corner webs read as white X's: round 3)
  }
}
// ── a crypt's back walls (the Haddow Crypt, docs/crypt-dungeon.md): a blind arcade of pale stone. A pier at each end of a
// run and every four tiles, a cornice along the top and a plinth along the foot, a band of damp over it; between each
// pair of piers a round arch, and in each bay one thing: the burial shelves (loculi, two tiers, most sealed with a slab
// and a name, a few open on a shroud or a skull), a memorial tablet, a saint in a niche. A long wall's middle bay is a
// light-well: a barred grate high up, a cold shaft of the day down through it. A candle sconce on every other pier, its
// light. Every choice a hash of the tile: the same crypt every visit.
const CRYPT_STORY = ['loculi', 'plaque', 'loculi', 'saint'];
/** the Undercroft's bays: the priory's shelves of the dead, and between them what the eel-men left hung up down here */
const FEN_STORY = ['loculi', 'eeltraps', 'plaque', 'loculi', 'nets'];
function cryptRun(a, b, { key, s, n, P, add, trim, clearOf, story = CRYPT_STORY }) {
  const [x0, z0] = P(a), [x1, z1] = P(b);
  trim.push({ k: 'cornice', x0, z0, x1, z1, n, y: CR_TOP_Y - 0.15 });
  trim.push({ k: 'plinth', x0, z0, x1, z1, n });
  const piers = [a, b]; for (let t = a + 4; t <= b - 3; t += 4) piers.push(t);
  piers.sort((p, q) => p - q);
  const sconced = beats(piers.length, `${key}|${a}`, 'ks'); let lit = false;   // (every other sconce its light, as before)
  piers.forEach((t, q) => {
    const [x, z] = P(t); if (!clearOf(x, z)) return;
    const end = t === a ? 1 : t === b ? -1 : 0;
    trim.push({ k: 'pier', x, z, n, end, top: CR_TOP_Y });
    if (!end && sconced[q]) {   // (on the wall's beat, §4.6: round 17: its light held close to the pier and up, a warm wash on the pier's face and the arch beside it, so the arcade beats lit and dark)
      // a sconce: an iron bracket, three candles; every other one its light (round 1: Luminati shares a dozen lights among all in view, and forty small ones left each room murk)
      lit = !lit; const light = lit ? add({ type: 'light', x: r2(x + (s ? 0 : 0.4)), z: r2(z + (s ? 0.4 : 0)), dy: 2.1, color: '#ffb060', intensity: 3.8, distance: 4.6, flicker: 0.14, nightOnly: false }) : null;
      trim.push({ k: 'sconce', x, z, n, y: TAV_FLOOR_Y + 2.1, light });
    }
  });
  // the bays between the piers, each its own story; a long wall's middle bay the light-well
  const bays = []; for (let q = 0; q < piers.length - 1; q++) if (piers[q + 1] - piers[q] >= 3) bays.push([(piers[q] + piers[q + 1]) / 2, piers[q + 1] - piers[q]]);
  const well = s && b - a >= 14 ? bays[(bays.length / 2) | 0]?.[0] : null, o = hash('kv', key) % story.length;
  const heaped = beats(bays.length * 2, `${key}|${a}`, 'kh').filter((_, i) => i % 2 === 1);   // (a beat at half the rate)   // (a light-well: a long north wall's, one a room: round 2, "spills outside the room")
  bays.forEach(([t, w], q) => {
    const [x, z] = P(t); if (!clearOf(x, z)) return;
    trim.push({ k: 'arcade', x, z, n, w: w - 0.5, y: TAV_FLOOR_Y, top: CR_TOP_Y });
    if (t === well) {
      trim.push({ k: 'lightwell', x, z, n, y: CR_TOP_Y - 0.85 });
      add({ type: 'light', x: r2(x + (s ? 0 : 1.3)), z: r2(z + (s ? 1.3 : 0)), dy: 0.9, color: '#cfd8e0', intensity: 3.4, distance: 3.2, flicker: 0, nightOnly: false });   // (the shaft's pool on the floor, soft: at 6 it was a blown-out white diamond, round 1)
      add({ type: 'emitter', x: r2(x + (s ? 0 : 0.9)), z: r2(z + (s ? 0.9 : 0)), preset: 'dust', size: [1.4, 2.6, 1.4], dy: 1.6, count: 14 });
      return;
    }
    const kind = story[(o + q) % story.length];
    trim.push({ k: kind, x, z, n, y: TAV_FLOOR_Y, seed: hash('ky', key, t) % 997 });
    // at the bay's foot, a strip of the crypt's leavings: candle stubs, a few bones, a slab fallen from a shelf (round 3:
    // "the rooms feel underdressed"); low, at the wall, where nothing walks
    if (heaped[q]) trim.push({ k: hash('kf', key, t) % 3 ? 'footbones' : 'fallenslab', x, z, n, seed: hash('kg', key, t) % 997 });   // (round 10: a heap now and then, not a scatter of specks: about one bay in four, never at one beat: §4.6)
    if ((q === 0 || q === bays.length - 1) && hash('kw', key, t) % 4 === 0) trim.push({ k: 'web2', x, z, n, y: CR_TOP_Y - 0.45, side: q === 0 ? 1 : -1, size: 0.7 + (hash('kz', key, t) % 4) * 0.1 });
  });
}
// ── an ossuary's back walls: the bones are the wall (its texture), and along it every four tiles an arched niche heaped
// with skulls, a candle in it (every other one its light); between them a stone shelf lined with skulls, the long bones
// crossed under it. A cornice along the top.
function ossuaryRun(a, b, { key, s, n, P, add, trim, clearOf }) {
  const [x0, z0] = P(a), [x1, z1] = P(b);
  trim.push({ k: 'cornice', x0, z0, x1, z1, n, y: CR_TOP_Y - 0.15 });
  // (round 5: an ashlar pier every three tiles splits the bones into panels, each with its own centre: unbroken, the
  // skulls read as wallpaper)
  for (let t = a; t <= b; t += 3) { const [x, z] = P(Math.min(t, b)); if (clearOf(x, z)) trim.push({ k: 'pier', x, z, n, end: t === a ? 1 : t >= b ? -1 : 0, top: CR_TOP_Y }); }
  { const [x, z] = P(a + 0.7); if (clearOf(x, z)) trim.push({ k: 'skullpile', x, z, n }); }   // (a pyramid of skulls at the run's corner: round 12)
  const heaps = beats(Math.ceil((b - a) / 3) + 1, `${key}|${a}`, 'oh');
  for (let t = a + 1.5, q = 0; t <= b - 1.5; t += 3, q++) {
    const [x, z] = P(t); if (!clearOf(x, z)) continue;
    if (heaps[q]) trim.push({ k: 'footbones', x, z, n, seed: hash('ob', key, t) % 997 });   // (a low heap at a panel's foot, most panels but on no one beat: round 6, §4.6)
    if (q % 2 === 0) {
      const lit = q % 4 === 0, light = lit ? add({ type: 'light', x: r2(x + (s ? 0 : 0.9)), z: r2(z + (s ? 0.9 : 0)), dy: 1.4, color: '#ffb060', intensity: 1.35, distance: 5.5, flicker: 0.16, nightOnly: false }) : null;   // (round 14: higher and softer, the heap by it blew out)
      trim.push({ k: 'skullniche', x, z, n, y: TAV_FLOOR_Y, seed: hash('on', key, t) % 997, light });
    } else trim.push({ k: 'boneshelf', x, z, n, y: TAV_FLOOR_Y, seed: hash('os', key, t) % 997 });
  }
}
// ── a counting house's back walls (item 9, the look `counting`; docs/art-critic-pass-stone.md): pale dressed stone, a
// dark oak wainscot along the foot, a plain cornice along the top, a pilaster every four tiles; in each bay the house's
// business: the ledgers on their shelves floor to cornice, a tally board of the week's chalk, now and then the rule of the
// house, QUOTA, on its board, which is not text, only its strokes (a long wall's middle bay). On every other pilaster
// the clerk's cool lamp, its light every other one. Every choice a hash of the tile: the same office every visit.
const COUNT_STORY = ['ledgers', 'tally', 'ledgers', 'ledgers', 'tally'];
const COUNT_LIGHT = '#dfe6f0';   // (round 1: a bluer white went violet through the grade)
function countingRun(a, b, { key, s, n, P, add, trim, clearOf }) {
  const [x0, z0] = P(a), [x1, z1] = P(b);
  trim.push({ k: 'ccornice', x0, z0, x1, z1, n, y: CR_TOP_Y - 0.15 });
  trim.push({ k: 'wainscot', x0, z0, x1, z1, n });
  // (round 2: the quota office's rooms are dug cellars, their walls in short runs: a run too short for a bay takes one
  // thing at its middle, a press of ledgers or a tally board, so no wall of the office stands bare)
  if (b - a < 6) {
    const [x, z] = P((a + b) / 2), seed = hash('cy', key, a) % 997; if (!clearOf(x, z)) return;
    if (b - a >= 2.5) trim.push({ k: 'furn', type: 'shelf', x: r2(x + (s ? 0 : 0.34)), z: r2(z + (s ? 0.34 : 0)), rot: s ? 0 : Math.PI / 2, s: 1.4, opts: { kind: 'books', width: Math.min(2.0, (b - a) / 1.4 - 0.3), height: 2.4, seed } });
    else trim.push({ k: 'tally', x, z, n, y: TAV_FLOOR_Y + 1.7, seed });
    return;
  }
  const piers = [a, b]; for (let t = a + 4; t <= b - 3; t += 4) piers.push(t);
  piers.sort((p, q) => p - q);
  piers.forEach((t, q) => {
    const [x, z] = P(t); if (!clearOf(x, z)) return;
    const end = t === a ? 1 : t === b ? -1 : 0;
    trim.push({ k: 'cpilaster', x, z, n, end, top: CR_TOP_Y });
    if (!end && q % 2 === 1) {
      const light = q % 4 === 1 ? add({ type: 'light', x: r2(x + (s ? 0 : 0.6)), z: r2(z + (s ? 0.6 : 0)), dy: 2.2, color: COUNT_LIGHT, intensity: 3.4, distance: 5, flicker: 0.04, nightOnly: false }) : null;
      trim.push({ k: 'clamp', x, z, n, y: TAV_FLOOR_Y + 2.2, light });
    }
  });
  const bays = []; for (let q = 0; q < piers.length - 1; q++) if (piers[q + 1] - piers[q] >= 3) bays.push([(piers[q] + piers[q + 1]) / 2, piers[q + 1] - piers[q]]);
  const rule = s && b - a >= 14 ? bays[(bays.length / 2) | 0]?.[0] : null, o = hash('cv', key) % COUNT_STORY.length;
  bays.forEach(([t, w], q) => {
    const [x, z] = P(t); if (!clearOf(x, z)) return;
    const kind = t === rule ? 'quotaboard' : COUNT_STORY[(o + q) % COUNT_STORY.length], seed = hash('cy', key, t) % 997;
    if (kind === 'ledgers') trim.push({ k: 'furn', type: 'shelf', x: r2(x + (s ? 0 : 0.34)), z: r2(z + (s ? 0.34 : 0)), rot: s ? 0 : Math.PI / 2, s: 1.4, opts: { kind: 'books', width: Math.min(2.4, w - 0.9), height: 2.4, seed } });
    else trim.push({ k: kind, x, z, n, y: TAV_FLOOR_Y + 1.7, seed });
  });
}
// ── the Seventh's Palace's back walls (v1.154, docs/art-critic-pass-palace.md): the crypt's arcade made grand. Marble
// piers with gilt capitals every four tiles, a cornice over and a dark marble dado along the foot, a round arch over each
// bay; in each bay what its room was for: the household's banners, blue and gold (the hall of banners: the legions'
// standards, every one the empire raised and some it never did), tall windows with the hour's sky in them (a long north
// wall's middle bay, the chapel's, the study's), the study's books, the chapel's saints, the yard's lit windows on the
// house's front. A gilt sconce on every other pier, every other one its light. Every choice a hash of the tile: the same
// palace every visit. (`roomAt`: the room a bay looks into, by its plan id.)
const PALACE_STORY = { the_hall_of_banners: ['pbanner'], the_study: ['books', 'books', 'pwindow'], the_chapel: ['saint', 'pwindow'], the_courtyard: ['pwindow', 'pbanner'], the_throne_room: ['pbanner', 'pwindow'] };
const PALACE_ANY = ['pbanner', 'pwindow', 'parms'];
function palaceRun(a, b, { key, s, n, P, add, trim, clearOf, roomAt }) {
  const [x0, z0] = P(a), [x1, z1] = P(b);
  const part = (t) => { const [x, z] = P(t); return roomAt(Math.floor(x), Math.floor(z))?.part || ''; };
  trim.push({ k: 'cornice', x0, z0, x1, z1, n, y: CR_TOP_Y - 0.15, pal: 1 });
  trim.push({ k: 'plinth', x0, z0, x1, z1, n, pal: 1 });
  const piers = [a, b]; for (let t = a + 4; t <= b - 3; t += 4) piers.push(t);
  piers.sort((p, q) => p - q);
  const sconced = beats(piers.length, `${key}|${a}`, 'ps'); let lit = false;
  piers.forEach((t, q) => {
    const [x, z] = P(t); if (!clearOf(x, z)) return;
    const end = t === a ? 1 : t === b ? -1 : 0;
    trim.push({ k: 'pier', x, z, n, end, top: CR_TOP_Y, pal: 1 });
    if (!end && sconced[q]) {   // (on the wall's beat: §4.6)
      lit = !lit; const light = lit ? add({ type: 'light', x: r2(x + (s ? 0 : 0.4)), z: r2(z + (s ? 0.4 : 0)), dy: 2.1, color: '#ffbe6e', intensity: 3.6, distance: 4.6, flicker: 0.12, nightOnly: false }) : null;
      trim.push({ k: 'sconce', x, z, n, y: TAV_FLOOR_Y + 2.1, light, gilt: 1 });
    }
  });
  const bays = []; for (let q = 0; q < piers.length - 1; q++) if (piers[q + 1] - piers[q] >= 3) bays.push([(piers[q] + piers[q + 1]) / 2, piers[q + 1] - piers[q]]);
  const win = b - a >= 14 ? bays[(bays.length / 2) | 0]?.[0] : null, o = hash('pv', key) % 6;
  bays.forEach(([t, w], q) => {
    const [x, z] = P(t); if (!clearOf(x, z)) return;
    trim.push({ k: 'arcade', x, z, n, w: w - 0.5, y: TAV_FLOOR_Y, top: CR_TOP_Y, pal: 1 });
    const pt = part(t), list = PALACE_STORY[pt] || PALACE_ANY, seed = hash('pk', key, t) % 997;
    const kind = t === win && pt !== 'the_hall_of_banners' ? 'pwindow' : list[(o + q) % list.length];
    if (kind === 'pwindow') {
      const yard = pt === 'the_courtyard';   // (the yard's are the house's own windows, lit from inside; the rest the sky's)
      const light = add({ type: 'light', x: r2(x + (s ? 0 : 1.2)), z: r2(z + (s ? 1.2 : 0)), dy: 1.3, color: yard ? '#ffc27a' : '#f2dcb8', intensity: 2.4, distance: 4.2, flicker: 0, nightOnly: false });
      trim.push({ k: 'pwindow', x, z, n, y: TAV_FLOOR_Y, seed, lit: yard ? 1 : 0, light });
    } else if (kind === 'books') trim.push({ k: 'furn', type: 'shelf', x: r2(x + (s ? 0 : 0.32)), z: r2(z + (s ? 0.32 : 0)), rot: s ? 0 : Math.PI / 2, s: 1.4, opts: { kind: 'books', width: 2.0, height: 2.4, seed } });
    // (the hall's: a legion's colours each, `look` 1…5; elsewhere the household's, 0)
    else if (kind === 'pbanner') trim.push({ k: 'pbanner', x, z, n, look: pt === 'the_hall_of_banners' ? 1 + (hash('pl', key, t) % 5) : 0, seed });
    else trim.push({ k: kind, x, z, n, y: TAV_FLOOR_Y, seed });
  });
}
/** what a palace piece put against a wall takes from it: the bay's own story round it (a banner, a window and its light,
 * the arms, the books), so nothing hangs behind a throne or a banner of the sim's */
function clearPalaceBay(trim, drop, wall, x, z, half) {
  if (!wall) return;
  for (let i = trim.length - 1; i >= 0; i--) {
    const t = trim[i]; if (!['pbanner', 'pwindow', 'parms', 'saint', 'furn', 'sconce'].includes(t.k) || (t.k === 'furn' && t.type !== 'shelf')) continue;
    const on = wall.side === 'n' ? t.n === 'z' && Math.abs(t.z - wall.z) < 0.5 && Math.abs(t.x - x) < half : t.n === 'x' && Math.abs(t.x - wall.x) < 0.5 && Math.abs(t.z - z) < half;
    const shelf = t.k === 'furn' && (wall.side === 'n' ? Math.abs(t.z - wall.z) < 0.6 && Math.abs(t.x - x) < half : Math.abs(t.x - wall.x) < 0.6 && Math.abs(t.z - z) < half);
    if (on || shelf) { if (t.light) drop(t.light); trim.splice(i, 1); }
  }
}
// the palace's furniture (sim/world.js 'throne', 'reliquary', 'palace_lamps' and the plan's banners, standards, desks),
// built by world.js buildTavern in the one batch
const PALACE_LIGHT = '#ffbf72';
const PALACE_3D = {
  // the throne on its dais (the sim's footprint five tiles by three, against the back wall): three steps of marble, gilt
  // at their nosings, the runner up their middle; the throne gilt and blue, the crown waiting on its cushion on the seat;
  // behind it the cloth of estate under its tester. Its own light, warm, from above and in front (docs/art-critic-pass-
  // palace.md). Lucan sits down on these steps at the end of his fight.
  throne: (x, z, h, k, { trim, add, wall, drop }) => {
    if (wall?.side !== 'n') return;
    clearPalaceBay(trim, drop, wall, x, z, 2.4);
    trim.push({ k: 'throne', x, z: wall.z, n: 'z', seed: h % 997 });
    add({ type: 'light', x, z: r2(wall.z + 2.6), dy: 2.6, color: '#ffd9a0', intensity: 6.5, distance: 6.5, flicker: 0, nightOnly: false });
  },
  // the chapel's reliquary: a marble stand, its cushion empty, the box's lid on the floor beside it; an empty niche over
  reliquary: (x, z, h, k, { trim, add, wall, drop }) => {
    const cx = r2(x + 0.25), cz = wall?.side === 'n' ? r2(wall.z + 0.6) : r2(z - 0.25);
    clearPalaceBay(trim, drop, wall, cx, cz, 1.6);
    trim.push({ k: 'reliquary', x: cx, z: cz, wz: wall?.side === 'n' ? wall.z : null, seed: h % 997 });
    add({ type: 'light', x: cx, z: r2(cz + 0.9), dy: 1.6, color: '#ffd090', intensity: 3.2, distance: 3.6, flicker: 0.1, nightOnly: false });
  },
  // a banner of the sim's on a back wall: the household's, the bay's own story round it gives way
  banner: (x, z, h, k, { trim, wall, drop }) => {
    if (!wall || wall.d > 2.2) return;
    const wx = wall.side === 'n' ? x : wall.x, wz = wall.side === 'n' ? wall.z : z;
    clearPalaceBay(trim, drop, wall, wx, wz, 1.6);
    trim.push({ k: 'pbanner', x: wx, z: wz, n: wall.side === 'n' ? 'z' : 'x', look: 0, big: 1, seed: h % 997 });
  },
  // a legion's standard, free-standing a step out from the wall: its pole on a weighted foot, the colours on a crossbar
  standard: (x, z, h, k, { trim }) => trim.push({ k: 'pstandard', x, z, look: [1, 2, 3, 5][h % 4], seed: h % 997 }),   // (round 2: never the black, which read as a sign on its pole)
  candelabra: (x, z, h, k, { trim, add }) => { trim.push({ k: 'candelabra', x, z, gilt: 1 }); add({ type: 'light', x, z, dy: 1.4, color: PALACE_LIGHT, intensity: 5.2, distance: 6.2, flicker: 0.12, nightOnly: false }); },
  // a column out on the floor (the sim's obstacle): marble on a square plinth, a gilt capital, an urn on it
  pillar: (x, z, h, k, { trim }) => trim.push({ k: 'column', x, z, seed: h % 997 }),
  // Lucan's study (the tavern's furniture): a writing table at the inn's scale, a chair at it, its candle and light; the
  // west one the Kindler's letters under the paperweight, unopened, the east one an inkstand and an open book
  desk: (x, z, h, k, { trim, add, room, X }) => {
    const rot = k === 'desk_y' ? Math.PI / 2 : 0, letters = !room || x < X(room.cx + 0.5);
    trim.push({ k: 'furn', type: 'table', x, z, rot, s: TAV_S, opts: { shape: 'rect', width: 1.5, depth: 0.85, cloth: false, items: false, candle: false, seed: h % 997 } });
    trim.push({ k: 'furn', type: 'chair', x: r2(x - (rot ? 0.95 : 0)), z: r2(z - (rot ? 0 : 0.95)), rot: rot ? -Math.PI / 2 : 0, s: TAV_S, opts: { style: 'chair', seed: h % 997 } });
    trim.push({ k: 'desktop', x, z, rot, y: TAV_FLOOR_Y + 0.82 * TAV_S, letters: letters ? 1 : 0, seed: h % 997 });
    add({ type: 'light', x, z, dy: 0.82 * TAV_S + 0.35, color: '#ffc27a', intensity: 1.6, distance: 2.4, flicker: 0.16, nightOnly: false });
  },
  papers: (x, z, h, k, { trim }) => trim.push({ k: 'ppapers', x, z, seed: h % 997 }),
  // a way in's pair of lights (the courtyard's, by the near sill): a broad soft warmth hung higher, not the cellar's low
  // hot pool (round 1: two glowing squares on the yard's flags); by a back wall, the inn's fire basket
  brazier: (x, z, h, k, ctx) => (ctx.wall && ctx.wall.d < 2.6 ? TAVERN_3D.brazier(x, z, h, k, ctx) : ctx.add({ ...sillPool(x, z, ctx.open), dy: 1.6, intensity: 3.2, distance: 6.5, color: '#ffc27a' })),
};
PALACE_3D.banner_y = PALACE_3D.banner; PALACE_3D.standard_y = PALACE_3D.standard; PALACE_3D.desk_y = PALACE_3D.desk;
/** the palace's pieces a hulk's cabins borrow (the Sister's Cabin, the Gull Isles' second floor) */
const HULK_LENT = new Set(['desk', 'desk_y', 'papers']);
/** the palace's runners (convert's own, not the sim's: flat, walked over): down a long room's axis, and from the throne's
 * steps to the near wall; split round anything the sim stood on its line (a column) @returns {any[]} trim pieces */
function palaceRunners(w, L, X, Z) {
  const out = [], solid = new Set(['pillar', 'column', 'candelabra', 'standard', 'standard_y', 'desk', 'desk_y', 'chest', 'brazier']);
  for (const r of L.rooms) {
    if (r.kit !== 'palace' || r.role === 'entrance') continue;
    let throne = null; const block = [];
    for (const [k, v] of w.props) { const c = L.cells.get(k); if (!c || c.room !== r.id) continue; const [tx, ty] = k.split(',').map(Number); if (v === 'throne') throne = [tx, ty]; else if (solid.has(v)) block.push([tx, ty]); }
    // [from, to] along the run's axis (sim tiles), its line across, and which way it runs
    let along, line, from, to;
    if (throne) { along = false; line = throne[0]; from = throne[1] + 2; to = r.cy + r.rh - 3; }
    else if (r.rw >= 2.4 * r.rh) { along = true; line = r.cy; from = r.cx - r.rw + 5; to = r.cx + r.rw - 5; }
    else continue;
    const cuts = block.filter(([bx, by]) => Math.abs((along ? by : bx) - line) <= 2).map(([bx, by]) => (along ? bx : by)).sort((p, q) => p - q);
    let a = from;
    for (const c of [...cuts, Infinity]) {
      const b = Math.min(to, c - 1.6);
      if (b - a >= 3) out.push(along ? { k: 'runner', x0: X(a), z0: Z(line + 0.5), x1: X(b + 1), z1: Z(line + 0.5), w: 1.5, seed: hash('ru', r.id, a) % 997 }
        : { k: 'runner', x0: X(line + 0.5), z0: Z(a), x1: X(line + 0.5), z1: Z(b + 1), w: 1.5, seed: hash('ru', r.id, a) % 997 });
      a = c + 2.6; if (a > to) break;
    }
  }
  return out;
}
/** the Undercroft's reed matting (convert's own, flat, walked over: world.js 'reedmat'): two lengths down a room either side
 * of its ledger stones, where the copyists walked between the desks and the clergy knelt, split round what stands on their
 * line @returns {any[]} trim pieces */
function fenMats(w, L, X, Z) {
  const out = [];
  for (const r of L.rooms) {
    if (!KIT_LOOK[r.kit]?.mats || r.role === 'entrance') continue;
    const along = r.rw >= r.rh, half = along ? r.rw : r.rh, wd = along ? r.rh : r.rw, block = [];
    for (const [k, v] of w.props) { const c = L.cells.get(k); if (!c || c.room !== r.id || FLAT.has(v)) continue; block.push(k.split(',').map(Number)); }
    for (const sg of [-1, 1]) {
      const line = (along ? r.cy : r.cx) + sg * wd * 0.42, from = (along ? r.cx : r.cy) - half + 6, to = (along ? r.cx : r.cy) + half - 6;
      const cuts = block.filter(([bx, by]) => Math.abs((along ? by : bx) - line) <= 2.5).map(([bx, by]) => (along ? bx : by)).sort((p, q) => p - q);
      let a = from;
      for (const c of [...cuts, Infinity]) {
        const b = Math.min(to, c - 2);
        if (b - a >= 4) out.push(along ? { k: 'reedmat', x0: X(a), z0: Z(line + 0.5), x1: X(b + 1), z1: Z(line + 0.5), w: 1.3, seed: hash('rm', r.id, sg, a) % 997 }
          : { k: 'reedmat', x0: X(line + 0.5), z0: Z(a), x1: X(line + 0.5), z1: Z(b + 1), w: 1.3, seed: hash('rm', r.id, sg, a) % 997 });
        a = c + 3; if (a > to) break;
      }
    }
  }
  return out;
}
/** the inn's furniture, set against the wall the sim stood it by (ctx.wall: wallOf). Luminati's interiors are built to
 * its own folk; our figures stand half again as tall (the 3× models), and at Luminati's size a long table read smaller
 * than a figure's ring (art critic, round 1). So the tables, benches, the bar and its shelf are built at the inn's scale
 * (TAV_S) by world.js buildTavern with Luminati's own builders, merged with the trim (a draw a material); the sim's
 * footprints (world.js dressPlanned) are sized to match. The hearth stays a Luminati object (its light), widened. */
const TAV_S = 1.6;
const TAVERN_3D = {
  // the hearth: Luminati's (its fire and light) at its widest, and the common room's in a stone surround of ours, piers to
  // the beam and a mantel, five wide in all (round 3: "too small to anchor the room"); a warm pool across its apron. A
  // small room's (the kitchen's) has the pot on, and no surround.
  hearth: (x, z, h, k, { add, wall, room, trim }) => {
    if (wall?.side !== 'n') return;
    const big = room?.size !== 'small', hx = r2(x - 0.25);
    add({ type: 'hearth', x: hx, z: r2(wall.z + 0.5), rotation: 0, opts: { width: big ? 3.6 : 2.6, height: TAV_TOP_Y - TAV_FLOOR_Y, lit: true, embers: true, pot: !big, seed: h % 997 } });
    if (big) trim.push({ k: 'surround', x: hx, z: wall.z, n: 'z', w: 3.6 });   // (no smoke over the stack: a particle wisp read as a grey ball, and showed over the next room's sill, round 8)
    trim.push({ k: 'apron', x: hx, z: wall.z, n: 'z', seed: h % 997 });
    if (!big) trim.push({ k: 'cauldron', x: hx, z: wall.z, n: 'z' });   // (the kitchen's pot, swung out on its crane where it reads)   // (a log or two and embers spilled on the hearthstones: the fire reads past the lintel)
    add({ type: 'light', x: hx, z: r2(wall.z + (big ? 2.2 : 1.6)), dy: 0.7, color: '#ff9a4a', intensity: big ? 13 : 7, distance: big ? 8 : 5, flicker: 0.28, nightOnly: false });   // (the room's brightest: round 6)
  },
  counter: (x, z, h, k, { wall, trim, add }) => {
    trim.push({ k: 'furn', type: 'counter', x, z, rot: 0, s: 1.45, opts: { style: 'bar', width: 2.4, items: true, seed: h % 997 } });
    if (wall?.side === 'n') {
      trim.push({ k: 'furn', type: 'shelf', x, z: r2(wall.z + 0.37), rot: 0, s: 1.45, opts: { kind: 'pantry', width: 2.4, height: 1.9, seed: (h >>> 3) % 997 } });   // (the keeper's shelf behind the bar)
      for (const sg of [-1, 1]) trim.push({ k: 'lantern', x: r2(x + sg * 2.1), z: wall.z, n: 'z', y: TAV_FLOOR_Y + 2.6 });   // (the bar lit, the way in's warm anchor: round 7)
      add({ type: 'light', x, z: r2(z - 0.3), dy: 2.2, color: '#ffbc70', intensity: 4, distance: 5, flicker: 0.1, nightOnly: false });
    }
    trim.push({ k: 'tableware', x, z, rot: 0, y: TAV_FLOOR_Y + 1.02 * 1.45, seed: (h >>> 5) % 997, bar: true });
  },
  // a long table: Luminati's plates on it, and ours, the tankards and a candle in a pool of its own (round 3: "mugs", and
  // "the middles of the rooms are still dim": a candle on each table lights the room without cluttering its floor)
  longtable: (x, z, h, k, { trim, add }) => {
    const rot = k === 'longtable_y' ? Math.PI / 2 : 0;
    trim.push({ k: 'furn', type: 'table', x, z, rot, s: TAV_S, opts: { shape: 'rect', width: 1.7, depth: 0.85, cloth: false, items: true, candle: false, seed: h % 997 } });
    trim.push({ k: 'tableware', x, z, rot, y: TAV_FLOOR_Y + 0.82 * TAV_S, seed: h % 997 });
    add({ type: 'light', x, z, dy: 0.82 * TAV_S + 0.15, color: '#ffbe72', intensity: 1.3, distance: 1.9, flicker: 0.18, nightOnly: false });   // (low and small: at 2.6 over 3.4 it bleached a figure at the table, round 4)
  },
  tbench: (x, z, h, k, { trim }) => trim.push({ k: 'furn', type: 'bench', x, z, rot: k === 'tbench_y' ? Math.PI / 2 : 0, s: TAV_S, opts: { length: 1.6, back: false } }),
  rug: (x, z, h, k, { add, room }) => add({ type: 'rug', x, z, rotation: Math.PI / 2, opts: { color: room?.role === 'entrance' ? 'red' : 'blue', width: 3, length: 5, seed: h % 997 } }),   // (blue where the Redhand fight: red foes on a red rug lost their outline, round 6)
  barrels: (x, z, h, k, ctx) => { clearBay(ctx, x, z); ctx.add({ type: 'barrel', x, z, rotation: (h % 9) * 0.3, opts: { height: 1.35, lying: false } }); },
  sacks: (x, z, h, k, ctx) => { clearBay(ctx, x, z); ctx.trim.push({ k: 'furn', type: 'sacks', x, z, rot: (h % 5) * 0.4, s: 1.45, opts: { count: 3 + (h % 2), seed: h % 997 } }); },
  crates: (x, z, h, k, ctx) => { clearBay(ctx, x, z); ctx.add({ type: 'crateStack', x, z, rotation: (h % 7) * 0.2, opts: { count: 2 + (h % 2), size: 1.0, seed: h % 997 } }); },
  // the notice board: the back wall's centrepiece, a lantern either side (round 3: "the reference makes it the
  // centrepiece"); the bay's own shield, lantern or web round it give way
  noticeboard: (x, z, h, k, { wall, trim, add }) => {
    if (wall?.side !== 'n') return;
    for (let i = trim.length - 1; i >= 0; i--) { const t = trim[i]; if (t.k !== 'post' && t.k !== 'beam' && t.n === 'z' && Math.abs(t.z - wall.z) < 0.01 && Math.abs(t.x - x) < 3.4) trim.splice(i, 1); }
    trim.push({ k: 'board', x, z: wall.z, n: 'z', y: TAV_FLOOR_Y + 1.6, seed: h % 997 });
    for (const sg of [-1, 1]) trim.push({ k: 'lantern', x: r2(x + sg * 2.4), z: wall.z, n: 'z', y: TAV_FLOOR_Y + 2.55 });
    add({ type: 'light', x, z: r2(wall.z + 1.4), dy: 1.7, color: '#ffc88a', intensity: 4, distance: 4.5, flicker: 0.08, nightOnly: false });   // (second only to the hearth: round 6)
  },
  logpile: (x, z, h, k, { wall, trim }) => wall && trim.push({ k: 'logs', x: wall.side === 'n' ? x : wall.x, z: wall.side === 'n' ? wall.z : z, n: wall.side === 'n' ? 'z' : 'x', y: TAV_FLOOR_Y, seed: h % 997 }),
  // an iron fire basket on its stand (the reference's), big enough to read and lighting a pool round it
  // a fire basket by a back wall, where it's seen whole; by a sill (the way in's pair at its door), its light alone (a
  // basket by the sill showed only its flame over it: rounds 2, 3)
  brazier: (x, z, h, k, { add, wall, open, room }) => add((room?.kit === 'crypt' || room?.kit === 'fenbrick') && !(wall && wall.d < 2.6) ? { ...sillPool(x, z, open), intensity: 2, distance: 3 } : wall && wall.d < 2.6
    ? { type: 'fire', x, z, opts: { kind: 'brazier', size: 1.15, smoke: false, light: true, intensity: 4.2, distance: 6, seed: h % 997 } }   // (under the hearth: round 6, a hierarchy of light)
    : sillPool(x, z, open)),
  // a doorway's candles (the cellar's): in a niche on the back wall beside it, else their light alone (on a sill they
  // read as a blob: round 6)
  candles: (x, z, h, k, { add, wall, trim, open }) => {
    if (wall && wall.d < 1.6) { trim.push(wall.side === 'n' ? { k: 'niche', x, z: wall.z, n: 'z', y: TAV_FLOOR_Y + 1.5 } : { k: 'niche', x: wall.x, z, n: 'x', y: TAV_FLOOR_Y + 1.5 }); add({ type: 'light', x, z, dy: 1.3, color: '#ffbe72', intensity: 2.4, distance: 4.5, flicker: 0.16, nightOnly: false }); }
    else add({ ...sillPool(x, z, open), intensity: 3.5, distance: 4.5 });
  },
  // a cask rack against the wall: two casks on a cradle, their heads to the room, a third on top (in place of the card)
  cask_rack: (x, z, h, k, { wall, trim }) => wall && wall.side === 'n' && trim.push({ k: 'casks', x, z: wall.z, n: 'z', seed: h % 997 }),
  // a doorway's torch on the back wall beside it; where the wall there is a sill, its light alone, a warm pool at the
  // door (a flame on a pole by a sill read as a torch floating, and a basket there was hidden by the sill: rounds 1, 2)
  torch: (x, z, h, k, { add, wall, open }) => add(wall && wall.d < 1.6
    ? { type: 'wallTorch', x: wall.side === 'n' ? x : r2(wall.x + 0.12), z: wall.side === 'n' ? r2(wall.z + 0.12) : z, rotation: wall.side === 'n' ? 0 : Math.PI / 2, dy: 1.8, opts: { embers: true } }
    : sillPool(x, z, open)),
};
/** stores stacked against a back wall take the bay above them: its lantern (and the lantern's light) or its hung thing
 * goes, so nothing hangs in front of the crates (round 8) */
function clearBay({ wall, trim, drop }, x, z) {
  if (!wall || wall.d > 1.6) return;
  for (let i = trim.length - 1; i >= 0; i--) {
    const t = trim[i]; if (!['lantern', 'shield', 'shelf', 'antlers', 'pegs', 'slate', 'herbs', 'web2'].includes(t.k)) continue;
    if (wall.side === 'n' ? (t.n === 'z' && Math.abs(t.z - wall.z) < 0.01 && Math.abs(t.x - x) < 1.3) : (t.n === 'x' && Math.abs(t.x - wall.x) < 0.01 && Math.abs(t.z - z) < 1.3)) { if (t.light) drop(t.light); trim.splice(i, 1); }
  }
}
/** a doorway's lamp by a sill: its light alone, low, and drawn back off the sill into the room (rounds 4, 5: it lit the
 * sill's cap) */
function sillPool(x, z, open) {
  const i = Math.floor(x), j = Math.floor(z);
  return { type: 'light', x: r2(open(i + 1, j) ? x : x - 0.8), z: r2(open(i, j + 1) ? z : z - 0.8), dy: 0.6, color: '#ffae62', intensity: 6, distance: 6, flicker: 0.12, nightOnly: false };
}
TAVERN_3D.longtable_y = TAVERN_3D.longtable; TAVERN_3D.tbench_y = TAVERN_3D.tbench;
// ── the crypt's furniture (the Haddow Crypt, docs/crypt-dungeon.md), built by world.js buildTavern in the one batch: the
// tombs with their likenesses, the founder's under its canopy, his mourners, the candelabra and their light, the urns,
// the bones, the offering table and the chantry's altar against the back wall, its pews (Luminati's bench with a back)
const CRYPT_LIGHT = '#ffb766';
/** the crypt kit's rooms, the Haddows' and the Undercroft's; the bone rooms among them */
const CRYPT_KITS = new Set(['crypt', 'ossuary', 'fenbrick', 'fenbones']), BONE_KITS = new Set(['ossuary', 'fenbones']);
Object.assign(TAVERN_3D, {
  tomb: (x, z, h, k, { trim }) => trim.push({ k: 'tomb', x, z, rot: k === 'tomb_y' ? Math.PI / 2 : 0, seed: h % 997 }),
  great_tomb: (x, z, h, k, { trim, add, wall }) => {
    const zz = wall?.side === 'n' ? r2(wall.z + 1.55) : z;   // (clear of the piers: round 3, the back columns sat in the wall)
    trim.push({ k: 'greattomb', x, z: zz, rot: 0, seed: h % 997 });
    if (wall?.side === 'n') {   // (the family's arms either side of him, a golden fleece on black; urns at the canopy's back corners: round 4)
      for (const sg of [-1, 1]) { trim.push({ k: 'hatchment', x: r2(x + sg * 4.05), z: wall.z, n: 'z', y: 3.6 }); trim.push({ k: 'urns', x: r2(x + sg * 2.55), z: r2(wall.z + 0.45), seed: (h + sg) % 997 }); }
    }
    add({ type: 'light', x, z: r2(zz + 0.15), dy: 2.3, color: '#ffd8a0', intensity: 5.2, distance: 2.5, flicker: 0.1, nightOnly: false });   // (round 5: at 5.5 the canopy's inside an oven; round 14, up under the soffit, down on his likeness)
    add({ type: 'light', x, z: r2(zz + 4.6), dy: 2.4, color: '#ffbe80', intensity: 5.4, distance: 9.5, flicker: 0, nightOnly: false });
    add({ type: 'light', x: r2(x - 9.5), z: r2(zz + 2.5), dy: 2.2, color: '#ffb468', intensity: 3, distance: 5.5, flicker: 0.1, nightOnly: false });   // (a wash on the vault's west wall: round 10, "lopsided")   // (round 6: the flags before him clearly amber; round 7, out across the floor before him)   // (a broad low warmth across the vault's middle from his candles: round 5)   // (under the canopy, small and warm: the effigy the brightest thing in the vault, round 3; round 2 it lit the canopy's outside, "a market stall")
  },
  mourner: (x, z, h, k, { trim }) => trim.push({ k: 'mourner', x: r2(x + 0.25), z: r2(z + 0.25) }),
  candelabra: (x, z, h, k, { trim, add }) => { trim.push({ k: 'candelabra', x, z }); add({ type: 'light', x, z, dy: 1.3, color: CRYPT_LIGHT, intensity: 5, distance: 6, flicker: 0.14, nightOnly: false }); },
  urns: (x, z, h, k, { trim }) => trim.push({ k: 'urns', x, z, seed: h % 997 }),
  bones: (x, z, h, k, { trim }) => trim.push({ k: 'bonepile', x, z, seed: h % 997 }),
  offering: (x, z, h, k, { trim, add, wall }) => {
    if (wall?.side !== 'n') return;
    trim.push({ k: 'offering', x, z: wall.z, n: 'z' });
    add({ type: 'light', x: r2(x + 0.85), z: r2(wall.z + 0.7), dy: 1.3, color: CRYPT_LIGHT, intensity: 2.6, distance: 4, flicker: 0.16, nightOnly: false });
  },
  altar: (x, z, h, k, { trim, add, wall }) => {
    if (wall?.side !== 'n') return;
    // (round 8: the chantry's own wall, not the halls' shelves: the bays beside the altar tablets, a dull gilt cross over it)
    for (let i = trim.length - 1; i >= 0; i--) { const t = trim[i]; if (t.n === 'z' && Math.abs(t.z - wall.z) < 0.01 && Math.abs(t.x - x) < 5 && ['loculi', 'saint', 'plaque', 'footbones', 'footcandles', 'fallenslab', 'web2', 'eeltraps', 'nets'].includes(t.k)) { if (t.k !== 'footbones' && t.k !== 'footcandles' && t.k !== 'fallenslab' && t.k !== 'web2' && Math.abs(t.x - x) > 1) trim.push({ ...t, k: 'plaque', moved: 1 }); trim.splice(i, 1); } }
    trim.push({ k: 'rood', x, z: wall.z, n: 'z', y: TAV_FLOOR_Y + 2.75 });
    trim.push({ k: 'altar', x, z: wall.z, n: 'z' });
    add({ type: 'light', x, z: r2(wall.z + 1.4), dy: 1.9, color: '#ffc27a', intensity: 4.5, distance: 5, flicker: 0.12, nightOnly: false });
  },
  pew: (x, z, h, k, { trim }) => trim.push({ k: 'furn', type: 'bench', x, z, rot: k === 'pew_y' ? Math.PI / 2 : 0, s: TAV_S, opts: { length: 1.6, back: true } }),
});
TAVERN_3D.tomb_y = TAVERN_3D.tomb; TAVERN_3D.pew_y = TAVERN_3D.pew;
// a crypt's candles: a low iron pricket on the floor (the chantry's either side of its altar), not the cellar's niche
{ const cellarCandles = TAVERN_3D.candles;
  TAVERN_3D.candles = (x, z, h, k, /** @type {any} */ ctx) => {
    if (!CRYPT_KITS.has(ctx.room?.kit)) return cellarCandles(x, z, h, k, ctx);
    ctx.trim.push({ k: 'candlestand', x, z });
    ctx.add({ type: 'light', x, z, dy: 1.3, color: CRYPT_LIGHT, intensity: 0.7, distance: 2, flicker: 0.16, nightOnly: false });   // (round 10: under the room's middle, which the fight's in)
  }; }

// ── a wharf's edges (the Old Eel Wharf, docs/docks-dungeon.md): every deck tile with the water past it carries its edge.
// The back edges (north and west, the faces the camera sees across the deck) a rail on posts at a man's waist, the posts
// carried on down as piles into the water; the near edges (south and east, between the camera and the fight) only a low
// stringer and the piles' heads, a bollard now and then, so a fight is never behind a rail. Every choice a hash of the
// tile: the same wharf every visit.
function docksDress(W, D, open, add, trim, arches, stone = false, only = null) {
  const clearOf = (x, z) => arches.every((a) => Math.abs(x - a.x) > a.span / 2 + 1.2 || Math.abs(z - a.z) > 2.5);
  // the harbour's mist (round 1: "the single strongest feature of the reference"): one layer on the water, none at the
  // decks' edges and thickening out to six tiles off them, by each water tile's distance from a deck (world.js)
  // (`only`: a coast floor's decks among its other rooms, coastDress: their edges alone, the mist its own)
  if (!only) { const dist = new Uint8Array(W * D).fill(9), q = [];
    for (let j = 0; j < D; j++) for (let i = 0; i < W; i++) if (open(i, j)) { dist[j * W + i] = 0; q.push(j * W + i); }
    for (let h = 0; h < q.length; h++) { const k = q[h], i = k % W, j = (k / W) | 0, d = dist[k] + 1; if (d > 8) continue;
      for (const [di, dj] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const ii = i + di, jj = j + dj; if (ii < 0 || jj < 0 || ii >= W || jj >= D) continue; const kk = jj * W + ii; if (dist[kk] > d) { dist[kk] = d; q.push(kk); } } }
    const rows = []; for (let j = 0; j < D; j++) { let r = ''; for (let i = 0; i < W; i++) r += dist[j * W + i]; rows.push(r); }
    trim.push({ k: 'harbourmist', W, D, rows }); }
  // runs along each edge line: n (a deck's north edge, along x at z = j), w (west, along z at x = i), s, e
  const lines = new Map(), push = (key, t) => (lines.get(key) || lines.set(key, []).get(key)).push(t);
  for (let j = 0; j < D; j++) for (let i = 0; i < W; i++) {
    if (!open(i, j) || (only && !only(i, j))) continue;
    if (!open(i, j - 1)) push(`n|${j}`, i);
    if (!open(i - 1, j)) push(`w|${i}`, j);
    if (!open(i, j + 1)) push(`s|${j + 1}`, i);
    if (!open(i + 1, j)) push(`e|${i + 1}`, j);
  }
  for (const [key, ts] of lines) {
    ts.sort((a, b) => a - b);
    const [side, c0] = key.split('|'), c = +c0, along = side === 'n' || side === 's', back = side === 'n' || side === 'w';
    const P = (t) => (along ? [t, c] : [c, t]), n = along ? 'z' : 'x', out = side === 'n' || side === 'w' ? -1 : 1;
    const runs = []; for (const t of ts) { const r = runs[runs.length - 1]; if (r && t === r[1]) r[1] = t + 1; else runs.push([t, t + 1]); }
    for (const [a, b] of runs) {
      const [x0, z0] = P(a), [x1, z1] = P(b);
      if (!stone) trim.push({ k: 'dockedge', x0, z0, x1, z1, n, out, back });   // (the deck's edge board, its fascia down to the water; a mole's is its own stone)
      if (!stone) for (let t = a; t <= b; t += 2) {
        const [x, z] = P(Math.min(t, b)); if (!clearOf(x, z)) continue;
        trim.push({ k: 'pile', x, z, n, out, back, seed: hash('dp', key, t) % 997 });
      }
      if (back && b - a >= 2 && !stone) trim.push({ k: 'dockrail', x0, z0, x1, z1, n, out });
      if (!back) for (let t = a + 3; t <= b - 3; t += 7) { const [x, z] = P(t); if (clearOf(x, z) && hash('db', key, t) % 2) trim.push({ k: 'bollard', x, z, n, out }); }
      if (back) for (let t = a + 2; t < b - 1; t += 5) { if (hash('dr', key, t) % 3) continue; const [x, z] = P(t + 0.5); trim.push({ k: 'reeds', x: r2(x + (along ? 0 : out * 1.0)), z: r2(z + (along ? out * 1.0 : 0)), seed: hash('ds', key, t) % 997 }); }   // (reeds up against the back piles, round 1)
    }
  }
}
/** the nearest edge of a deck from a point: its side, where it runs and which way the water lies */
function edgeOf(open, x, z) {
  const i = Math.floor(x), j = Math.floor(z);
  let best = null;
  for (const [dx, dz, side] of /** @type {[number, number, string][]} */ ([[0, -1, 'n'], [-1, 0, 'w'], [0, 1, 's'], [1, 0, 'e']])) {
    for (let k = 0; k <= 5; k++) if (!open(i + dx * k, j + dz * k)) { if (!best || k < best.k) best = { k, side, x: dx ? i + dx * k + (dx < 0 ? 1 : 0) : x, z: dz ? j + dz * k + (dz < 0 ? 1 : 0) : z, dx, dz }; break; }
  }
  return best;
}
// ── the ramparts' ground (the High Ramparts, docs/ramparts-dungeon.md): behind a terrace (north of it, or west), up to four
// tiles of the town's street where its houses stand; in front (south, east) the parapet, a tile of stone a step over the
// floor; past that the drop. A tile with a terrace within five tiles to its north or west is in front of it (the camera
// looks over it), so no house stands there whatever lies behind it: a house between the camera and a fight hid it.
function rampartGround(W, D, tiles, heights, open0) {
  // (on the floor as it stood before any of this: a street tile set down here must not count as a terrace for the next)
  const floor = new Uint8Array(W * D); for (let j = 0; j < D; j++) for (let i = 0; i < W; i++) floor[j * W + i] = open0(i, j) ? 1 : 0;
  const open = (i, j) => i >= 0 && j >= 0 && i < W && j < D && floor[j * W + i] === 1;
  // (round 1: and anything south-east of a terrace within five, the camera's diagonal: a row of houses there covered the
  // Watch Walk's front)
  const front = (i, j) => { for (let a = 0; a <= 6; a++) for (let b = 0; b <= 6; b++) if ((a || b) && a + b <= 8 && open(i - a, j - b)) return true; return false; };   // (round 2: wider, a row still stood south-east of the Watch Walk)
  const behind = (i, j) => { for (let k = 1; k <= 4; k++) if (open(i, j + k) || open(i + k, j)) return true; return false; };
  const street = new Uint8Array(W * D);
  for (let j = 0; j < D; j++) for (let i = 0; i < W; i++) {
    if (open(i, j)) continue;
    if (front(i, j)) { let edge = false; for (let dj = -1; dj <= 1; dj++) for (let di = -1; di <= 1; di++) edge ||= open(i + di, j + dj);   // (a parapet wherever a terrace touches the drop)
      tiles[j][i] = edge ? '[' : ' '; heights[j][i] = edge ? '3' : '0'; continue; }
    if (behind(i, j)) { tiles[j][i] = ']'; heights[j][i] = '1'; street[j * W + i] = 1; continue; }   // (the street a step down from the terrace: at the terrace's own level it would count as one)
    tiles[j][i] = ' '; heights[j][i] = '0';
  }
  return { street };
}
/** the ramparts' dressing: the houses along each terrace's back, facing it; the parapet's merlons along its front; towers
 * standing up out of the mist round the walls */
function rampartsDress(W, D, open, { street }, add, trim, arches) {
  const clearOf = (x, z, r = 0) => arches.every((a) => Math.abs(x - a.x) > a.span / 2 + 1.2 + r || Math.abs(z - a.z) > 3.5 + r);
  const lines = new Map(), push = (key, t) => (lines.get(key) || lines.set(key, []).get(key)).push(t), st = (i, j) => i >= 0 && j >= 0 && i < W && j < D && street[j * W + i];
  for (let j = 0; j < D; j++) for (let i = 0; i < W; i++) {
    if (!open(i, j)) continue;
    if (st(i, j - 1)) push(`n|${j}`, i); if (st(i - 1, j)) push(`w|${i}`, j);
    if (!open(i, j + 1) && !st(i, j + 1)) push(`s|${j + 1}`, i); if (!open(i + 1, j) && !st(i + 1, j)) push(`e|${i + 1}`, j);
  }
  const ROOFS = ['roof_slate', 'roof_slate', 'roof_slate', 'roof_red'], WALLS = ['timber_frame', 'timber_frame', 'plaster'];
  for (const [key, ts] of lines) {
    ts.sort((a, b) => a - b);
    const [side, c0] = key.split('|'), c = +c0, along = side === 'n' || side === 's', P = (t) => (along ? [t, c] : [c, t]);
    const runs = []; for (const t of ts) { const r = runs[runs.length - 1]; if (r && t === r[1]) r[1] = t + 1; else runs.push([t, t + 1]); }
    for (const [a, b] of runs) {
      if (side === 'n' || side === 'w') {
        // the houses: four to six wide, shoulder to shoulder, two storeys, a door to the street
        for (let t = a, q = 0; t < b - 2; q++) {
          const h = hash('rh', key, t), wd = Math.min(b - t, 4 + (h % 3)); if (wd < 3) break;
          const [x, z] = P(t + wd / 2), cx = along ? x : x - 1.75, cz = along ? z - 1.75 : z;
          if (clearOf(cx, cz, 1.5)) add({ type: 'house', x: r2(cx), z: r2(cz), rotation: along ? 0 : Math.PI / 2, light: q % 2 === 0, opts: { width: wd - 0.2, depth: 3.3, stories: 2, roof: ROOFS[h % 4], wall: WALLS[(h >> 2) % 3], upperWall: 'plaster', door: 'front', seed: h % 997, chimney: h % 2 === 0, lantern: q % 2 === 0, flowerboxes: h % 3 !== 1, shutters: true, woodpile: false, windowLights: true, sign: h % 3 === 0 } });   // (a hanging sign on one in three: round 1)
          t += wd;
        }
      } else {
        const [x0, z0] = P(a), [x1, z1] = P(b);
        trim.push({ k: 'merlons', x0, z0, x1, z1, n: along ? 'z' : 'x' });
        trim.push({ k: 'walldrop', x0, z0, x1, z1, n: along ? 'z' : 'x', seed: hash('rw', key, a) % 997 });   // (the wall's face down into the mist below the parapet: round 1, "a model on a white table")
      }
    }
  }
  // towers standing up out of the mist round the walls: at the level's west and east ends and behind the houses
  // (round 1: behind and to the west only, well out: one east of the Bakers' Row stood in front of its fight)
  for (const [x, z, s] of [[-7, D * 0.25, 1], [-8, D * 0.66, 1.1], [W * 0.28, -9, 0.95], [W * 0.7, -8, 1.05], [W * 0.5, -17, 1.35]]) trim.push({ k: 'fartower', x: r2(x), z: r2(z), s, seed: hash('rt', x, z) % 997 });
  // (round 2: and out in the drop before the walls, low, their tops under the street's level so they stand below the parapet
  // in the mist and never over a terrace)
  for (const [x, z, s] of [[W * 0.2, D + 12, 0.9], [W + 12, D * 0.8, 1.0], [W * 0.75, D + 16, 1.1]]) trim.push({ k: 'fartower', x: r2(x), z: r2(z), s, low: true, seed: hash('rt', x, z) % 997 });
}
/** the ramparts' pieces (sim/world.js ramparts dressing): torches on poles, the cargo, the stalls, the oven, the well */
const RAMP_3D = {
  // (round 2: a wider pool)
  torch: (x, z, h, k, { add, trim }) => { const light = add({ type: 'light', x, z, dy: 1.8, color: '#ffa850', intensity: 5.4, distance: 7.2, flicker: 0.2, nightOnly: false });
    trim.push({ k: 'torchpole', x, z, seed: h % 997, light }); },
  brazier: (x, z, h, k, ctx) => RAMP_3D.torch(x, z, h, k, ctx),
  barrels: (x, z, h, k, { add }) => add({ type: 'barrel', x, z, rotation: (h % 9) * 0.3, opts: { height: 1.3, lying: false } }),
  crates: (x, z, h, k, { add }) => add({ type: 'crateStack', x, z, rotation: (h % 7) * 0.2, opts: { count: 2 + (h % 2), size: 1.0, seed: h % 997 } }),
  sacks: (x, z, h, k, { trim }) => trim.push({ k: 'furn', type: 'sacks', x, z, rot: (h % 5) * 0.4, s: 1.45, opts: { count: 3 + (h % 2), seed: h % 997 } }),
  market_stall: (x, z, h, k, { add }) => add({ type: 'marketStall', x, z: r2(z - 0.4), rotation: 0, opts: { seed: h % 997 } }),
  well: (x, z, h, k, { add }) => add({ type: 'well', x, z, rotation: 0, opts: { seed: h % 997 } }),
  oven: (x, z, h, k, { add, trim }) => { trim.push({ k: 'oven', x, z: r2(z - 0.4), seed: h % 997 }); add({ type: 'light', x, z: r2(z + 1.1), dy: 0.8, color: '#ff8a3a', intensity: 3.6, distance: 4.2, flicker: 0.25, nightOnly: false }); },   // (its glow from its mouth on the street before it: rounds 1, 2)
};
/** a wharf's pieces (sim/world.js docks dressing), built by world.js buildTavern: lamps on posts, cargo, rope and nets on
 * the deck, a boat tied up in the water off the nearest edge, the crane */
const DOCK_LAMP = '#ffb45e';
const DOCK_3D = {
  lantern: (x, z, h, k, { add, trim, edge }) => {
    const light = add({ type: 'light', x, z: r2(z + 1.2), dy: 1.3, color: DOCK_LAMP, intensity: 4.8, distance: 6.8, flicker: 0.12, nightOnly: false }); trim.push({ k: 'lamppost', x, z, seed: h % 997, light });
    if (edge && edge.k <= 2) { const along = edge.side === 'n' || edge.side === 's'; trim.push({ k: 'lampglint', x: along ? x : r2(edge.x + edge.dx * 0.7), z: along ? r2(edge.z + edge.dz * 0.7) : r2(z + 0.68), along, out: along ? edge.dz : edge.dx, seed: h % 997 }); }   // (its light broken on the water past the edge: round 1)
  },
  barrels: (x, z, h, k, { add }) => { add({ type: 'barrel', x, z, rotation: (h % 9) * 0.3, opts: { height: 1.35, lying: false } }); if (h % 3 === 0) add({ type: 'barrel', x: r2(x + 0.7), z: r2(z + 0.35), rotation: (h % 7) * 0.4, opts: { height: 1.2, lying: false } }); },
  crates: (x, z, h, k, { add }) => add({ type: 'crateStack', x, z, rotation: (h % 7) * 0.2, opts: { count: 2 + (h % 2), size: 1.0, seed: h % 997 } }),
  sacks: (x, z, h, k, { trim }) => trim.push({ k: 'furn', type: 'sacks', x, z, rot: (h % 5) * 0.4, s: 1.45, opts: { count: 3 + (h % 2), seed: h % 997 } }),
  fishcrates: (x, z, h, k, { trim }) => trim.push({ k: 'fishcrate', x, z, rot: (h % 5) * 0.22 - 0.44, seed: h % 997 }),
  rope: (x, z, h, k, { trim }) => trim.push({ k: 'rope', x, z, seed: h % 997 }),
  net: (x, z, h, k, { trim }) => trim.push({ k: 'net', x, z, rot: (h % 7) * 0.45, seed: h % 997 }),
  boat: (x, z, h, k, { trim, edge }) => { if (!edge) return; const along = edge.side === 'n' || edge.side === 's'; trim.push({ k: 'rowboat', x: along ? x : r2(edge.x + edge.dx * 1.1), z: along ? r2(edge.z + edge.dz * 1.1) : z, rot: along ? 0 : Math.PI / 2, seed: h % 997 }); },
  crane: (x, z, h, k, { trim, add }) => { trim.push({ k: 'crane', x, z, seed: h % 997 }); add({ type: 'light', x: r2(x + 1.2), z: r2(z + 1.4), dy: 1.4, color: DOCK_LAMP, intensity: 2.2, distance: 4, flicker: 0.1, nightOnly: false }); },
  brazier: (x, z, h, k, ctx) => DOCK_3D.lantern(x, z, h, k, ctx),   // (the way in's: lamps, as every light on a wharf)
};

// ── the Tidemark's coast (docs/dungeon-looks-plan.md item 7; docs/strand-dungeon.md) ────────────────────────────────────
// A floor with a coast kit in it (KIT_LOOK `coast`) is laid out room by room, each room's ground round it in its own kind,
// and the sea past it all at the harbour's level (DOCK_WL), into the mist past the level's edges:
//   · strand: no walls. Behind it (north and west, the side the camera looks across it to) dunes and rock outcrops up to
//     three tiles deep; in front of it, and past the dunes, the sea; its floor dry sand, wet sand toward the sea;
//   · cave: its ring of rock wall (the ruin pass breaks the near side down, ruinWalls), the isle's rock behind it, the sea
//     in front of it (the near wall a low rim with the sea outside);
//   · fort: behind it the fort's walls standing whole, in front a parapet, a band of rocks and the sea;
//   · the wharf's decks (docks), the sea all round them as the Drowned Mole's;
//   · any other (the hulk's, walls standing whole: tavernWalls): its ring of wall, the sea past it.
// A hall takes the kind of the room nearest it along the floor. Every choice a hash of the tile: the same shore every
// visit. Nothing here touches the sim.
/** the coast's water: the sea's slow swell; world.js coastAir its colours */
const COAST_WATER = { flow: [0.04, 0.07], reflect: 0.4, neutral: 0.55, glint: 0 };
/** what a tile within this many of ours south-east of a floor is: in front of it (between the camera and the fight) */
const COAST_FRONT = 7;
const coastKind = (lk) => (lk ? lk.coast || (lk === KIT_LOOK.docks || lk === KIT_LOOK.mole ? 'deck' : 'walled') : null);
const floorTile = (lk, i, j) => (hash('d', i, j) % 100 < (lk.mix ?? 18) ? lk.floor[1] : lk.floor[0]);
const N8 = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]];
function coastGround(W, D, tiles, heights, open, looks, roomOf, propTiles) {
  const N = W * D;
  // the halls: each tile the look of the room nearest it along the floor
  { const q = [], seen = new Uint8Array(N);
    for (let k = 0; k < N; k++) if (roomOf[k] >= 0 && looks[k]) { seen[k] = 1; q.push(k); }
    for (let h = 0; h < q.length; h++) {
      const k = q[h], i = k % W, j = (k / W) | 0;
      for (const [di, dj] of N8.slice(0, 4)) {
        const ii = i + di, jj = j + dj; if (!open(ii, jj)) continue; const kk = jj * W + ii; if (seen[kk]) continue;
        seen[kk] = 1; if (looks[kk] !== looks[k]) { looks[kk] = looks[k]; tiles[jj][ii] = floorTile(looks[k], ii, jj); } q.push(kk);
      }
    } }
  // every other tile: how far from the floor (in a ring, as the walls are laid) and the floor it's nearest
  const dist = new Uint8Array(N).fill(255), src = new Int32Array(N).fill(-1), q = [];
  for (let k = 0; k < N; k++) if (open(k % W, (k / W) | 0)) { dist[k] = 0; src[k] = k; q.push(k); }
  for (let h = 0; h < q.length; h++) {
    const k = q[h], d = dist[k] + 1, i = k % W, j = (k / W) | 0; if (d > 12) continue;
    for (const [di, dj] of N8) { const ii = i + di, jj = j + dj; if (ii < 0 || jj < 0 || ii >= W || jj >= D) continue; const kk = jj * W + ii; if (dist[kk] <= d) continue; dist[kk] = d; src[kk] = src[k]; q.push(kk); }
  }
  // (in front: a floor within COAST_FRONT to its north or west, the camera's diagonal, as the ramparts' parapet is placed)
  const front = (i, j) => { for (let a = 0; a <= COAST_FRONT; a++) for (let b = 0; b <= COAST_FRONT; b++) if ((a || b) && a + b <= COAST_FRONT + 2 && open(i - a, j - b)) return true; return false; };
  // (the perf pass tried the sea past seven tiles as the far plane alone, void tiles under it: the water's shore foam ran
  // along that line and the plane read a brighter blue than the water. Kept as water to the margin: docs/art-critic-pass-tidemark-coast.md)
  const sea = (i, j) => { tiles[j][i] = 'Γ'; heights[j][i] = '0'; };
  for (let j = 0; j < D; j++) for (let i = 0; i < W; i++) {
    const k = j * W + i; if (open(i, j)) continue;
    const d = dist[k]; if (d === 255) { sea(i, j); continue; }
    const lk = looks[src[k]], kd = coastKind(lk), fr = front(i, j);
    if (kd === 'strand') {
      // the dunes, rock breaking through them in outcrops (a broad noise, so a run of rock, not a speckle)
      if (fr || d > 3) { sea(i, j); continue; }
      // (round 2: the dunes one level slab: their tops rise and fall by a noise, the rock standing over them)
      const rock = vnoise(i, j, 'cr', 4) < 0.34, up = vnoise(i, j, 'dh', 3) > 0.5 ? 1 : 0;
      tiles[j][i] = rock ? 'Ξ' : 'Φ'; heights[j][i] = rock ? (d === 1 ? '5' : '7') : String(Math.min(5, 2 + Math.min(d, 2) + up));
    } else if (kd === 'cave') {
      if (d === 1) { tiles[j][i] = lk.wall; heights[j][i] = String(WALL); continue; }   // (its wall, for the ruin pass)
      // (the isle's rock over the cave, behind it, turf on its crown from its edge in: round 4, a black mass read as void)
      if (!fr && d <= 5) { const turf = d >= 3 && vnoise(i, j, 'it', 3) > 0.35; tiles[j][i] = turf ? 'G' : 'Ξ'; heights[j][i] = '7'; } else sea(i, j);
    } else if (kd === 'fort') {
      if (fr) { if (d === 1) { tiles[j][i] = '['; heights[j][i] = '3'; } else if (d === 2) { tiles[j][i] = 'Ξ'; heights[j][i] = '2'; } else sea(i, j); }   // (the parapet, the rocks at its foot)
      else if (d <= 3) { tiles[j][i] = ']'; heights[j][i] = '8'; } else sea(i, j);    // (the fort's walls standing whole behind its walk)
    } else if (kd === 'deck') { tiles[j][i] = 'o'; heights[j][i] = '0'; }
    else if (d === 1) { tiles[j][i] = lk.wall; heights[j][i] = String(WALL); }        // (a walled room's: the hulk's side, standing in the sea)
    else sea(i, j);
  }
  // (round 5: a lone tile of the isle's rock left between two rooms' fronts stood out of the sea as a pillar: under three
  // of its kind round it, it's sea)
  for (let j = 0; j < D; j++) for (let i = 0; i < W; i++) if (heights[j][i] === '7' && N8.filter(([di, dj]) => heights[j + dj]?.[i + di] === '7').length < 3) sea(i, j);
  // the shallows off a strand: two tiles of the sea a step up from the deep, its sand bed showing (round 2: the beach
  // stood straight out of deep water, a platform)
  for (let j = 0; j < D; j++) for (let i = 0; i < W; i++) { const k = j * W + i; if (tiles[j][i] === 'Γ' && dist[k] <= 2 && coastKind(looks[src[k]]) === 'strand') heights[j][i] = '1'; }
  // the floors: the strand's sand wet toward the sea (two tiles, ragged), shingle by its rocks; the cave's tide pools in
  // the hollows along its back walls, the strand's rock pools by its outcrops (never under a piece: propTiles)
  const toSea = new Uint8Array(N).fill(9), sq = [];
  for (let k = 0; k < N; k++) { const i = k % W, j = (k / W) | 0; if (!open(i, j) && (tiles[j][i] === 'Γ' || tiles[j][i] === 'o')) { toSea[k] = 0; sq.push(k); } }
  for (let h = 0; h < sq.length; h++) { const k = sq[h], d = toSea[k] + 1, i = k % W, j = (k / W) | 0; if (d > 4) continue; for (const [di, dj] of N8.slice(0, 4)) { const ii = i + di, jj = j + dj; if (!open(ii, jj)) continue; const kk = jj * W + ii; if (toSea[kk] <= d) continue; toSea[kk] = d; sq.push(kk); } }
  const rockBy = (i, j) => N8.some(([di, dj]) => tiles[j + dj]?.[i + di] === 'Ξ');
  for (let j = 0; j < D; j++) for (let i = 0; i < W; i++) {
    const k = j * W + i; if (!open(i, j) || propTiles.has(k)) continue;
    const kd = coastKind(looks[k]), h = hash('cf', i, j);
    if (kd === 'strand') {
      const ts = toSea[k];
      // (round 1: a hashed ragged edge read as a checker of dark squares: the band by its distance and a broad noise)
      tiles[j][i] = ts <= 1 || (ts <= 3 && vnoise(i, j, 'ws', 5) < 0.45) ? 'Λ' : rockBy(i, j) ? (h % 4 ? 'Π' : 'Ω') : 'Δ';
    } else if (kd === 'cave') {
      // (round 1: the shingle and the wet sand mixed by the tile read as cobbles: wet sand in broad drifts across it)
      tiles[j][i] = vnoise(i, j, 'cw', 6) < 0.45 ? 'Λ' : 'Π';
    }
    // (the sea cave's tide pools are the water track's now, docs/water-indoors.md: the sim's `pools` in its fighting caves,
    // a sheet a hand over the floor in the sea's own colours, KIT_LOOK.seacave `wet: 'sea'`; the strand's rock pools stay 'Ω')
  }
  // (the perf pass: the deep sea, three tiles or more off any floor, water over no bed of its own, 'Θ': Luminati lays a
  // tile's top as 4 × 4 quads for its baked shade, and under a sea nobody sees through the coast's floors spent most of
  // their triangles on it; the water's depth, so its colour, is the same)
  for (let j = 0; j < D; j++) for (let i = 0; i < W; i++) { const t = tiles[j][i]; if ((t === 'Γ' || t === 'o') && heights[j][i] === '0' && dist[j * W + i] >= 3) tiles[j][i] = 'Θ'; }
}
/** the room a piece of the sim's stands in (its tile's cell) */
const roomAtProp = (w, k) => { const c = w.level.cells.get(k); return c && c.room >= 0 ? w.level.rooms[c.room] : null; };
/** the coast's dressing (world.js buildTavern's coast pieces): the mist and the far sea past the level; the decks' edges;
 *  the surf along every shore; marram on the dunes; the wrack and driftwood along the strand's tide line; barnacles and weed
 *  along the sea cave's back walls, kelp and wreck timbers at their feet, light down a blowhole in each fighting cave; the
 *  fort's parapet crenellated */
function coastDress(W, D, tiles, heights, open, looks, roomOf, add, trim, arches, L, X, Z) {
  const N = W * D, kindAt = (i, j) => (i < 0 || j < 0 || i >= W || j >= D ? null : coastKind(looks[j * W + i]));
  const clearOf = (x, z, r = 0) => arches.every((a) => Math.abs(x - a.x) > a.span / 2 + 1.2 + r || Math.abs(z - a.z) > 2.5 + r);
  // the mist and the far sea (the harbour's, world.js 'harbourmist'): none at the shore, thick from six tiles out
  { const dist = new Uint8Array(N).fill(9), q = [];
    for (let k = 0; k < N; k++) { const i = k % W, j = (k / W) | 0; if (!(heights[j][i] === '0' && (tiles[j][i] === 'Γ' || tiles[j][i] === 'o' || tiles[j][i] === 'Θ'))) { dist[k] = 0; q.push(k); } }
    for (let h = 0; h < q.length; h++) { const k = q[h], i = k % W, j = (k / W) | 0, d = dist[k] + 1; if (d > 8) continue;
      for (const [di, dj] of N8.slice(0, 4)) { const ii = i + di, jj = j + dj; if (ii < 0 || jj < 0 || ii >= W || jj >= D) continue; const kk = jj * W + ii; if (dist[kk] > d) { dist[kk] = d; q.push(kk); } } }
    const rows = []; for (let j = 0; j < D; j++) { let r = ''; for (let i = 0; i < W; i++) r += dist[j * W + i]; rows.push(r); }
    trim.push({ k: 'harbourmist', W, D, rows, coast: true }); }
  // the decks' edges, as the wharf's
  docksDress(W, D, open, add, trim, arches, false, (i, j) => kindAt(i, j) === 'deck');
  // the surf: along every edge of land (sand, dune, rock, a deck's not: its piles) with the sea past it, a broken line of
  // foam on the water a hand out, its runs as the wharf's edges (n, w, s, e)
  const wet = (i, j) => i >= 0 && j >= 0 && i < W && j < D && (tiles[j][i] === 'Γ' || tiles[j][i] === 'Θ');   // (the shallows too: the surf at the sand, not at the deep's edge)
  const shore = (i, j) => !wet(i, j) && kindAt(i, j) !== 'deck' && /[ΔΛΠΩΦΞ[\]ΣG]/.test(tiles[j][i]) && i >= 0 && j >= 0 && i < W && j < D;
  const lines = new Map(), push = (key, t) => (lines.get(key) || lines.set(key, []).get(key)).push(t);
  for (let j = 0; j < D; j++) for (let i = 0; i < W; i++) {
    if (!shore(i, j)) continue;
    if (wet(i, j - 1)) push(`n|${j}`, i); if (wet(i - 1, j)) push(`w|${i}`, j); if (wet(i, j + 1)) push(`s|${j + 1}`, i); if (wet(i + 1, j)) push(`e|${i + 1}`, j);
  }
  for (const [key, ts] of lines) {
    ts.sort((a, b) => a - b);
    const [side, c0] = key.split('|'), c = +c0, along = side === 'n' || side === 's', out = side === 'n' || side === 'w' ? -1 : 1, P = (t) => (along ? [t, c] : [c, t]);
    const runs = []; for (const t of ts) { const r = runs[runs.length - 1]; if (r && t === r[1]) r[1] = t + 1; else runs.push([t, t + 1]); }
    for (const [a, b] of runs) { const [x0, z0] = P(a), [x1, z1] = P(b); trim.push({ k: 'surf', x0, z0, x1, z1, n: along ? 'z' : 'x', out, seed: hash('su', key, a) % 997 }); }
  }
  // the fort's parapet crenellated, as the ramparts' (world.js 'merlons'), along each walk's front
  { const ml = new Map(), mp = (key, t) => (ml.get(key) || ml.set(key, []).get(key)).push(t);
    for (let j = 0; j < D; j++) for (let i = 0; i < W; i++) { if (!open(i, j) || kindAt(i, j) !== 'fort') continue; if (tiles[j + 1]?.[i] === '[') mp(`s|${j + 1}`, i); if (tiles[j]?.[i + 1] === '[') mp(`e|${i + 1}`, j); }
    for (const [key, ts] of ml) {
      ts.sort((a, b) => a - b);
      const [side, c0] = key.split('|'), c = +c0, along = side === 's', P = (t) => (along ? [t, c] : [c, t]);
      const runs = []; for (const t of ts) { const r = runs[runs.length - 1]; if (r && t === r[1]) r[1] = t + 1; else runs.push([t, t + 1]); }
      for (const [a, b] of runs) { const [x0, z0] = P(a), [x1, z1] = P(b); trim.push({ k: 'merlons', x0, z0, x1, z1, n: along ? 'z' : 'x' }); }
    } }
  // the dunes' marram, a clump on most dune tiles (on the dune's top: its height); a boulder on an outcrop now and then
  for (let j = 0; j < D; j++) for (let i = 0; i < W; i++) {
    const t = tiles[j][i], h = hash('dm', i, j), y = parseInt(heights[j][i], 36) * 0.5;
    if ((t === 'Φ' && h % 5 < 3) || (t === 'G' && heights[j][i] === '7' && h % 4 === 0)) trim.push({ k: 'marram', x: r2(i + 0.08 + (h % 9) * 0.105), z: r2(j + 0.08 + ((h >> 4) % 9) * 0.105), y, seed: h % 997 });   // (anywhere on its tile: on a grid's points the clumps stood in files, §4.6)
    else if (t === 'Ξ' && heights[j][i] !== '7' && h % 13 === 0) add({ type: 'rock', x: r2(i + 0.5), z: r2(j + 0.5), opts: { size: r2(0.7 + (h % 5) * 0.12), stone: 'basalt', seed: h % 97 } });
  }
  // the strand's tide line: wrack where the wet sand meets the dry, a driftwood log now and then there or at a dune's foot
  for (let j = 0; j < D; j++) for (let i = 0; i < W; i++) {
    if (!open(i, j) || kindAt(i, j) !== 'strand') continue;
    const t = tiles[j][i], h = hash('wr', i, j), x = r2(i + 0.5), z = r2(j + 0.5);
    const line = t === 'Δ' && N8.slice(0, 4).some(([di, dj]) => tiles[j + dj]?.[i + di] === 'Λ');
    const foot = t === 'Δ' && N8.slice(0, 4).some(([di, dj]) => tiles[j + dj]?.[i + di] === 'Φ' || tiles[j + dj]?.[i + di] === 'Ξ');
    if (line && h % 5 < 3) trim.push({ k: 'wrack', x: r2(i + 0.1 + ((h >> 3) % 9) * 0.1), z: r2(j + 0.1 + ((h >> 7) % 9) * 0.1), rot: (h % 13) * 0.24, seed: h % 997 });   // (strewn along the line, not set on its tiles' middles: §4.6)
    if ((line && h % 11 === 0) || (foot && h % 9 === 0)) { if (clearOf(x, z)) trim.push({ k: 'driftwood', x, z, rot: (h % 17) * 0.37, seed: h % 997 }); }
  }
  // the sea cave's back walls: weed and barnacles at the tide line, kelp heaped at their feet, wreck timbers washed up
  // against them; and in each fighting cave light down a blowhole
  const faces = new Map(), fpush = (key, t) => (faces.get(key) || faces.set(key, []).get(key)).push(t);
  for (let j = 0; j < D; j++) for (let i = 0; i < W; i++) {
    if (tiles[j][i] !== 'Σ' || heights[j][i] === '0') continue;
    if (open(i, j + 1) && kindAt(i, j + 1) === 'cave') fpush(`s|${j + 1}`, i);
    if (open(i + 1, j) && kindAt(i + 1, j) === 'cave') fpush(`e|${i + 1}`, j);
  }
  for (const [key, ts] of faces) {
    ts.sort((a, b) => a - b);
    const [side, c0] = key.split('|'), c = +c0, along = side === 's', P = (t) => (along ? [t, c] : [c, t]);
    const runs = []; for (const t of ts) { const r = runs[runs.length - 1]; if (r && t === r[1]) r[1] = t + 1; else runs.push([t, t + 1]); }
    for (const [a, b] of runs) {
      const [x0, z0] = P(a), [x1, z1] = P(b); trim.push({ k: 'tideline', x0, z0, x1, z1, n: along ? 'z' : 'x', seed: hash('tl', key, a) % 997 });
      for (let t = a + 1; t < b - 1; t += 3) {
        const h = hash('kp', key, t), [x, z] = P(t + 0.5), px = along ? x : x + 0.55, pz = along ? z + 0.55 : z;
        if (!clearOf(px, pz)) continue;
        if (h % 4 === 0) trim.push({ k: 'kelp', x: r2(px), z: r2(pz), rot: along ? 0 : Math.PI / 2, seed: h % 997 });
        else if (h % 9 === 1) trim.push({ k: 'wreckwood', x: r2(along ? x : x + 0.35), z: r2(along ? z + 0.35 : z), n: along ? 'z' : 'x', seed: h % 997 });
      }
    }
  }
  if (L.plan) for (const r of L.rooms) {
    if (r === L.entrance || KIT_LOOK[r.kit]?.coast !== 'cave') continue;
    // (a blowhole over the room's back third, off its middle: the fight stands in the lamps' light, the shaft beside it)
    const sx = X(r.cx - r.rw * 0.35), sz = Z(r.cy - r.rh * 0.3), hb = hash('bh', r.id);
    trim.push({ k: 'blowhole', x: sx, z: sz, seed: hb % 997, room: r.id });
    add({ type: 'light', x: sx, z: sz, dy: 3, color: '#d4e6ff', intensity: 22, distance: 6, flicker: 0, nightOnly: false });   // (the day's cold light, a hard pool: the Crossing's shaft's)
    add({ type: 'emitter', x: sx, z: sz, preset: 'dust', size: [1.8, 4, 1.8], dy: 2.2, count: 16 });
  }
}
/** a coast floor's piece by the kind of room it stands in: the decks' as the wharf's (DOCK_3D), the fort's as the ramparts'
 *  (RAMP_3D, and the lamp room's light on its stand), the strand's and the cave's lamps on posts, cargo, rope and nets as
 *  the wharf's and their boats drawn up on the sand @returns {boolean} whether it's built */
function coastProp(kind, x, z, h, lk, { add, trim, open, room }) {
  const kd = coastKind(lk);
  if (kd === 'deck') { if (!DOCK_3D[kind]) return false; DOCK_3D[kind](x, z, h, kind, { add, trim, open, edge: edgeOf((i, j) => open(i, j), x, z) }); return true; }
  if (kd === 'fort') {
    if (kind === 'brazier' && room?.role === 'end') { trim.push({ k: 'beacon', x, z: r2(z - 0.3), seed: h % 997 }); add({ type: 'light', x, z: r2(z + 0.6), dy: 3.2, color: '#ffc070', intensity: 9, distance: 11, flicker: 0.06, nightOnly: false }); return true; }   // (the lamp itself, Gannet's light, kept lit)
    if (!RAMP_3D[kind]) return false; RAMP_3D[kind](x, z, h, kind, { add, trim, open }); return true;
  }
  if (kd !== 'strand' && kd !== 'cave') return false;
  if (kind === 'boat') { trim.push({ k: 'beachboat', x, z, rot: (h % 2 ? 0.25 : -0.3) + ((h >> 3) % 5) * 0.06, keel: kd === 'cave' || h % 3 === 0, seed: h % 997 }); return true; }   // (drawn up on the sand, one in three keel up)
  if (kind === 'lantern' || kind === 'brazier') { DOCK_3D.lantern(x, z, h, kind, { add, trim, edge: null }); return true; }
  if (DOCK_3D[kind] && kind !== 'crane') { DOCK_3D[kind](x, z, h, kind, { add, trim, open, edge: null }); return true; }
  if (kind === 'puddle') { trim.push({ k: 'rockpool', x, z, seed: h % 997 }); return true; }   // (the weed's and the drips' puddles: a rock pool's skin of water, flat)
  if (kind === 'stalagmite') { add({ type: 'crag', x, z, rotation: (h % 11) * 0.5, opts: { kind: 'spire', stone: 'basalt', height: 1.3 + (h % 4) * 0.3, width: 0.75, seed: h % 997 } }); return true; }   // (a sea stack's stump, low and black)
  return false;
}

// ── the Tidemark's shore on its overland (dungeon-looks-plan item 7: "dunes and marram grass, driftwood and wrack along
// the tideline, rock pools, beached boats, nets drying on poles, a few fishing huts"). The sim's pieces (outdoor.js
// SHORE: the huts, the boats, the nets, each holding its tiles) and the renderer's own over its sand: the sand wet where
// the sea washes it, dunes where it meets the grass with marram on them, wrack and a driftwood log on the tide line, a
// rock pool now and then down the east beach under the Lamp Fort, the surf a hand off every beach. None of it stands
// near a way in, an arrival or a spawn point's ground (the visibility rule), and the roads keep their own tiles
const SHORE_WALL = 'wood_planks_dark';
function shoreLand(w, { W, D, tiles, heights, X, Z, add, sprites, inside }) {
  const trim = [], wet = (i, j) => i >= 0 && j >= 0 && i < W && j < D && !!LEGEND[tiles[j][i]]?.water;
  const sandy = (c) => c === 's' || c === 'Λ' || c === 'Ψ' || c === 'Ω';
  const keep = [...(w.exits || []).map((e) => [X((e.x0 + e.x1) / 2), Z((e.y0 + e.y1) / 2), 5]), ...Object.values(w.arrivals || {}).map((a) => [X(a.x), Z(a.y), 4]),
    ...Object.values(CAMP_BY).filter((c) => c.region === 'tidemark').map((c) => [X(c.x), Z(c.y), (c.arena || 12) / 2 + 1]), ...(w.shore || []).map((s) => [X(s.x), Z(s.y), 2.2])];
  const clear = (x, z) => !keep.some(([kx, kz, r]) => Math.abs(x - kx) < r && Math.abs(z - kz) < r);
  // the sand: wet a tile or two up from the sea (a noise, so its edge wanders), dunes where it meets the land behind it
  const N4 = N8.slice(0, 4), land = (i, j) => i >= 0 && j >= 0 && i < W && j < D && !wet(i, j) && !sandy(tiles[j][i]) && heights[j][i] === '2' && !/[cb._]/.test(tiles[j][i]);
  const wetBy = (i, j, r) => { for (let dj = -r; dj <= r; dj++) for (let di = -r; di <= r; di++) if (wet(i + di, j + dj)) return true; return false; };
  for (let j = 0; j < D; j++) for (let i = 0; i < W; i++) {
    if (tiles[j][i] !== 's' || heights[j][i] !== '2') continue;
    if (wetBy(i, j, 1) || (wetBy(i, j, 2) && vnoise(i, j, 'sw', 4) < 0.5)) tiles[j][i] = 'Λ';
    else if ((N4.some(([di, dj]) => land(i + di, j + dj)) || (vnoise(i, j, 'sd', 5) > 0.62 && N8.some(([di, dj]) => land(i + 2 * di, j + 2 * dj)))) && wetBy(i, j, 7)) tiles[j][i] = 'Ψ';   // (the dunes the shore's, not the sand drifted inland)
  }
  for (let j = 0; j < D; j++) for (let i = 0; i < W; i++) {
    const t = tiles[j][i], h = hash('sl', i, j), x = r2(i + 0.5), z = r2(j + 0.5);
    if (!clear(x, z)) continue;
    if (t === 'Ψ' && h % 2 === 0) trim.push({ k: 'marram', x: r2(i + 0.25 + (h % 7) * 0.07), z: r2(j + 0.25 + ((h >> 3) % 7) * 0.07), y: 1, seed: h % 997 });
    else if (t === 's' && N4.some(([di, dj]) => tiles[j + dj]?.[i + di] === 'Λ')) {
      // the tide line: wrack along it, a log now and then; down the east beach a rock pool by a rock
      if (h % 3 !== 0) trim.push({ k: 'wrack', x, z, rot: (h % 13) * 0.24, seed: h % 997 });
      if (h % 23 === 0) trim.push({ k: 'driftwood', x, z, rot: (h % 17) * 0.37, seed: h % 997 });
      else if (h % 29 === 1 && x > X(212)) { tiles[j][i] = 'Ω'; add({ type: 'rock', x: r2(x + 0.7), z: r2(z - 0.4), opts: { size: r2(0.6 + (h % 4) * 0.15), stone: 'basalt', seed: h % 97 } }); }
    }
  }
  // the surf: along every edge of the sand with the sea past it, at the water's own level
  const wl = 0.4, lines = new Map(), push = (key, t) => (lines.get(key) || lines.set(key, []).get(key)).push(t);
  for (let j = 0; j < D; j++) for (let i = 0; i < W; i++) {
    if (!sandy(tiles[j][i]) || wet(i, j)) continue;
    if (wet(i, j - 1)) push(`n|${j}`, i); if (wet(i - 1, j)) push(`w|${i}`, j); if (wet(i, j + 1)) push(`s|${j + 1}`, i); if (wet(i + 1, j)) push(`e|${i + 1}`, j);
  }
  for (const [key, ts] of lines) {
    ts.sort((a, b) => a - b);
    const [side, c0] = key.split('|'), c = +c0, along = side === 'n' || side === 's', out = side === 'n' || side === 'w' ? -1 : 1, P = (t) => (along ? [t, c] : [c, t]);
    const runs = []; for (const t of ts) { const r = runs[runs.length - 1]; if (r && t === r[1]) r[1] = t + 1; else runs.push([t, t + 1]); }
    for (const [a, b] of runs) { const [x0, z0] = P(a), [x1, z1] = P(b); trim.push({ k: 'surf', x0, z0, x1, z1, n: along ? 'z' : 'x', out, y: wl, seed: hash('so', key, a) % 997 }); }
  }
  // the sim's pieces: a fishing hut a tarred plank shed under thatch, a boat drawn up (one keel up), nets on their poles
  (w.shore || []).forEach((s, n) => {
    const x = X(s.x), z = Z(s.y), h = hash('sh', s.x, s.y);
    if (!inside(x, z)) return;
    if (s.kind === 'hut') add({ type: 'house', x, z, rotation: 0, light: n === 0, opts: { width: 3, depth: 2.5, stories: 1, wall: SHORE_WALL, roof: 'roof_thatch', chimney: n !== 1, shutters: false, doorHood: false, woodpile: false, gableFront: false, sign: false, upperWall: '', seed: h % 997 } });
    else if (s.kind === 'boat') trim.push({ k: 'beachboat', x, z, rot: -(s.rot || 0), keel: n % 2 === 1, seed: h % 997 });
    else if (s.kind === 'nets') trim.push({ k: 'netrack', x, z, rot: -(s.rot || 0), seed: h % 997 });
  });
  if (trim.length) sprites.push({ tavern: { pieces: trim } });
}
// ── the Old Barrows' walls (docs/dungeon-looks-plan.md item 1; docs/art-critic-pass-vale.md): along the back walls (the
// faces the camera sees) of a barrow's rooms, a timber doorframe over each passage's mouth, two posts and a lintel (the
// way on reads as a door into the mound, not a gap in a castle wall); along the mouth's cut earth, the Redhand's shoring,
// a post and a cap board every few tiles. The niches, the biers, the standing stones are the sim's pieces (BARROW_3D).
const BARROW_WALLS = new Set(['Þ', 'Ð']);
function barrowDress(W, D, tiles, heights, open, trim, arches, roomAt) {
  const clearOf = (x, z) => arches.every((a) => Math.abs(x - a.x) > a.span / 2 + 1.2 || Math.abs(z - a.z) > 2.5);
  const lines = new Map(), push = (key, t) => (lines.get(key) || lines.set(key, []).get(key)).push(t);
  for (let j = 0; j < D; j++) for (let i = 0; i < W; i++) {
    if (!BARROW_WALLS.has(tiles[j][i]) || heights[j][i] === '2' || heights[j][i] === '0') continue;
    const near = open(i - 1, j) || open(i, j - 1);
    if (near) continue;                                                // (a near wall, or one between two rooms: nothing on it)
    if (open(i, j + 1)) push(`${tiles[j][i]}|s|${j + 1}`, i);
    if (open(i + 1, j)) push(`${tiles[j][i]}|e|${i + 1}`, j);
  }
  for (const [key, ts] of lines) {
    ts.sort((a, b) => a - b);
    const [ch, side, c0] = key.split('|'), c = +c0, s = side === 's', n = s ? 'z' : 'x', P = (t) => (s ? [t, c] : [c, t]);
    const runs = []; for (const t of ts) { const r = runs[runs.length - 1]; if (r && t === r[1]) r[1] = t + 1; else runs.push([t, t + 1]); }
    // a passage's mouth: a gap between two runs of the line, the floor going on through the wall's row (a hall)
    for (let q = 0; q + 1 < runs.length; q++) {
      const g0 = runs[q][1], g1 = runs[q + 1][0], wallRow = s ? c - 1 : c - 1;
      if (g1 - g0 < 3 || g1 - g0 > 8) continue;
      let thru = true; for (let t = g0; t < g1 && thru; t++) thru = s ? open(t, wallRow) : open(wallRow, t);
      const [x0, z0] = P(g0), [x1, z1] = P(g1), mx = (x0 + x1) / 2, mz = (z0 + z1) / 2;
      if (thru && clearOf(mx, mz)) trim.push({ k: 'bdoor', x0, z0, x1, z1, n, earth: ch === 'Ð' ? 1 : 0 });
    }
    if (ch !== 'Ð') continue;
    // the cut earth shored: a post and its cap board every three tiles along the face (none where the plan's own shoring
    // stands, the Cutting's: its timbers are the sim's)
    for (const [a, b] of runs) for (let t = a + 1; t < b; t += 3) {
      const [x, z] = P(t + 0.5), rm = roomAt(s ? t : c, s ? c : t);
      if (!clearOf(x, z) || rm?.dress?.includes('timbers')) continue;
      trim.push({ k: 'bpost', x, z, n, seed: hash('bp', key, t) % 997 });
    }
  }
}
/** the barrow's pieces (the sim's: plans.js barrows' dressing), built by world.js buildTavern in one batch: the niches as
 * timber-framed recesses with the dead's grave goods in them, the dead laid out on biers with their shields and spears,
 * the columns standing stones, the dig's shoring as timber sets */
const BARROW_3D = {
  urnshelf: (x, z, h, k, { trim, wall }) => { if (!wall || wall.d > 2.2) return false; trim.push(wall.side === 'n' ? { k: 'bniche', x, z: wall.z, n: 'z', seed: h % 997 } : { k: 'bniche', x: wall.x, z, n: 'x', seed: h % 997 }); },
  sarcophagus: (x, z, h, k, { trim, wall, room }) => { const along = room ? room.rw >= room.rh : true; trim.push({ k: 'bier', x, z, rot: along ? 0 : Math.PI / 2, seed: h % 997 }); },
  sarcophagus_open: (x, z, h, k, { trim }) => trim.push({ k: 'bier', x, z, rot: 0, robbed: 1, seed: h % 997 }),
  pillar: (x, z, h, k, { trim }) => trim.push({ k: 'menhir', x, z, seed: h % 997 }),
  brokenpillar: (x, z, h, k, { trim }) => trim.push({ k: 'menhir', x, z, fallen: 1, seed: h % 997 }),
  shoring: (x, z, h, k, { trim }) => trim.push({ k: 'bshore', x, z, n: k === 'shoring_y' ? 'x' : 'z', seed: h % 997 }),
};
BARROW_3D.urnshelf_y = BARROW_3D.urnshelf; BARROW_3D.shoring_y = BARROW_3D.shoring;
// ── Wickham Keep's bailey (docs/dungeon-looks-plan.md item 2): its curtain walls stand whole, a storey and more over the
// yard, a crenellated parapet along their tops; a buttress every six tiles, an arrow slit between; their near runs cut to
// a breast-high parapet with its merlons, so a fight is never behind one (the ramparts kit's, in the keep's stone)
function curtainRun(a, b, { key, s, n, P, trim, clearOf }) {
  const [x0, z0] = P(a), [x1, z1] = P(b);
  trim.push({ k: 'kparapet', x0, z0, x1, z1, n, y: CR_TOP_Y });
  trim.push({ k: 'grime', x0, z0, x1, z1, n });
  for (let t = a + 3; t <= b - 2; t += 6) { const [x, z] = P(t); if (clearOf(x, z)) trim.push({ k: 'kbutt', x, z, n, top: CR_TOP_Y }); }
  for (let t = a + 6; t <= b - 3; t += 6) { const [x, z] = P(t); if (clearOf(x, z) && hash('ks', key, t) % 3) trim.push({ k: 'kslit', x, z, n, y: TAV_FLOOR_Y + 2.5 }); }
}
/** the near curtain's merlons: each run of the cut-down wall's line, the floor north (or west) of it */
function curtainSills(W, D, tiles, heights, open, trim) {
  const lines = new Map(), push = (key, t) => (lines.get(key) || lines.set(key, []).get(key)).push(t);
  for (let j = 0; j < D; j++) for (let i = 0; i < W; i++) {
    if (tiles[j][i] !== 'Æ' || heights[j][i] !== String(TAV_NEAR)) continue;
    if (open(i, j - 1)) push(`s|${j}`, i); else if (open(i - 1, j)) push(`e|${i}`, j);
  }
  for (const [key, ts] of lines) {
    ts.sort((a, b) => a - b);
    const [side, c0] = key.split('|'), c = +c0, along = side === 's';
    const runs = []; for (const t of ts) { const r = runs[runs.length - 1]; if (r && t === r[1]) r[1] = t + 1; else runs.push([t, t + 1]); }
    for (const [a, b] of runs) if (b - a >= 2) trim.push({ k: 'kmerlons', x0: along ? a : c, z0: along ? c : a, x1: along ? b : c, z1: along ? c : b, n: along ? 'z' : 'x', y: TAV_NEAR * 0.5 });
  }
}
/** the keep's own pieces: a yard's column a square pier of its ashlar, a hall's an oak post to the roof */
const KEEP_3D = {
  pillar: (x, z, h, k, { trim, look }) => trim.push(look.whole && look.wall === 'Ø' ? { k: 'hpost', x, z } : { k: 'kpier', x, z, seed: h % 997 }),
  brokenpillar: (x, z, h, k, { trim }) => trim.push({ k: 'kpier', x, z, low: 1, seed: h % 997 }),
};

// ── the greenwood (the Root Granary's way in, docs/greenwood-dungeon.md; docs/dungeon-looks-plan.md item 12, from the owner's
// two references: tall straight trunks and old twisted ones swathed in moss, shafts of pale green light down through the
// canopy, mist, a moss-and-fern floor with stones in it, the empire's ruins). Built as the docks and the ramparts are: no
// walls. Round each glade the wood's own ground a step up (its bank earth and roots), and on it the trunks, root-banks,
// mossed boulders and ferns; past them more trunks into the mist, and Luminati's outer ground past the level's edge. The
// camera looks north-west at 30°: whatever stands south-east of a glade (between the camera and the fight) is kept low by
// what it would hide (`reach`, below), so the tall trunks stand only at the glades' backs and in the wood beyond them.
// Every choice a hash of the tile: the same wood every visit. Nothing here touches the sim.
const WOOD_TAN = Math.tan((30 * Math.PI) / 180);
/** the greenwood's ground: its glades' floors (moss, the leaf litter in drifts, the Tithe Road's flags), and everything off
 *  them the wood's ground a step up; the road runs on through the wood, ruled straight, to the level's edges */
function woodGround(W, D, tiles, heights, L, x0, y0, look) {
  const floor = new Uint8Array(W * D);
  for (let j = 0; j < D; j++) for (let i = 0; i < W; i++) floor[j * W + i] = heights[j][i] === '2' ? 1 : 0;
  // how far each tile is from a glade (units; a chamfer pass each way, diagonals 1.4)
  const dist = new Float32Array(W * D).fill(99);
  for (let k = 0; k < W * D; k++) if (floor[k]) dist[k] = 0;
  const relax = (i, j, di, dj, c) => { const ii = i + di, jj = j + dj; if (ii < 0 || jj < 0 || ii >= W || jj >= D) return; const k = j * W + i, kk = jj * W + ii; if (dist[kk] + c < dist[k]) dist[k] = dist[kk] + c; };
  for (let j = 0; j < D; j++) for (let i = 0; i < W; i++) { relax(i, j, -1, 0, 1); relax(i, j, 0, -1, 1); relax(i, j, -1, -1, 1.4); relax(i, j, 1, -1, 1.4); }
  for (let j = D - 1; j >= 0; j--) for (let i = W - 1; i >= 0; i--) { relax(i, j, 1, 0, 1); relax(i, j, 0, 1, 1); relax(i, j, 1, 1, 1.4); relax(i, j, -1, 1, 1.4); }
  // the Tithe Road: the band the road's glades share (their middles' mean), eight of ours wide, west to east
  const roadRooms = L.plan ? L.rooms.filter((r) => r.dress && r.dress.includes('tithe_road')) : [];
  const road = roadRooms.length ? (() => { const cy = roadRooms.reduce((n, r) => n + r.cy + 0.5, 0) / roadRooms.length; return { z0: r2((cy - 4 - y0) / 2), z1: r2((cy + 4 - y0) / 2) }; })() : null;
  const onRoad = (j) => !!road && j + 0.5 > road.z0 && j + 0.5 < road.z1;
  // a soft noise for the litter's drifts and the road's swallowed flags (a scatter by the tile read as checkerboard noise
  // in the inn and the crypt: drifts a few units across)
  const vn = (i, j, s, seed) => { const fi = i / s, fj = j / s, a = Math.floor(fi), b = Math.floor(fj), u = fi - a, v = fj - b, h = (p, q) => (hash(seed, p, q) % 1000) / 1000;
    const sm = (t) => t * t * (3 - 2 * t), su = sm(u), sv = sm(v); return (h(a, b) * (1 - su) + h(a + 1, b) * su) * (1 - sv) + (h(a, b + 1) * (1 - su) + h(a + 1, b + 1) * su) * sv; };
  const [MOSS, LITTER] = look.floor, FLAG = look.road || MOSS;
  for (let j = 0; j < D; j++) for (let i = 0; i < W; i++) {
    const k = j * W + i, n = vn(i, j, 4.5, 'wl');
    if (floor[k]) {
      tiles[j][i] = n > 0.64 ? LITTER : MOSS;
      // (the road: its flags in a line, a third swallowed by the moss and more toward its edges)
      if (onRoad(j)) { const edge = Math.min(j + 0.5 - road.z0, road.z1 - (j + 0.5)), gone = vn(i, j, 2.2, 'wr') + (edge < 1 ? 0.18 : 0); if (gone < 0.62) tiles[j][i] = FLAG; }
      continue;
    }
    if (heights[j][i] !== '6') continue;                           // (a pit's sunk tile, say: left as it is)
    if (dist[k] > (look.ground || 99)) { tiles[j][i] = ' '; heights[j][i] = '0'; continue; }   // (past the wood's reach, nothing: the mist and the gloom; the perf pass, the terrain was two-thirds of the frame's triangles)
    tiles[j][i] = dist[k] <= 1.2 ? MOSS : look.wall; heights[j][i] = '3';   // (round 10: the bank's lip in the glades' green moss: the glade's edge solid and green, not dark)
    // (the road on through the wood: sunk in its bank, more of it gone the further from the glades)
    if (onRoad(j)) { const gone = vn(i, j, 2.2, 'wr') + Math.min(0.3, dist[k] * 0.03); if (gone < 0.58) { tiles[j][i] = FLAG; heights[j][i] = '2'; } else if (gone < 0.75) { tiles[j][i] = MOSS; heights[j][i] = '2'; } }
  }
  return { floor, dist, road, onRoad, ground: look.ground || 99 };
}
/** the greenwood's dressing: the trunks, root-banks, boulders and ferns round the glades, the wood past them, the mist, the
 *  shafts of light; the arcade, the granary's door and the falls where a glade's plan names them */
function woodDress(W, D, wood, L, x0, y0, add, trim, arches) {
  const { floor, dist } = wood, F0 = 1.0, BANK = 1.5;
  const isFloor = (x, z) => { const i = Math.floor(x), j = Math.floor(z); return i >= 0 && j >= 0 && i < W && j < D && floor[j * W + i] === 1; };
  const dAt = (x, z) => { const i = Math.floor(x), j = Math.floor(z); return i >= 0 && j >= 0 && i < W && j < D ? dist[j * W + i] : 99; };
  const R = (...v) => (hash('wd', ...v) % 10000) / 10000;
  // how far a thing at (x, z) is from the nearest floor it would stand in front of, along the camera's line (north-west), in a
  // band hw either side: what it hides is reach × tan 30° high at most there (a figure's feet kept in view)
  // (round 10: `core`, the half-width of the trunk itself; the wider band, its limbs and crown, only from three units back,
  // where what's high up lands: the wide band at its foot had counted the glade beside a trunk as behind it)
  const reach = (x, z, hw, core = hw) => { for (let t = 0; t <= 26; t += 0.5) { const w = t < 3 ? Math.min(core, hw) : hw; for (let s = -w; s <= w + 1e-6; s += 0.5) if (isFloor(x - (t - s) * Math.SQRT1_2, z - (t + s) * Math.SQRT1_2)) return t; } return 99; };
  const tallest = (x, z, hw, core = hw) => reach(x, z, hw, core) * WOOD_TAN - 0.25;
  // where nothing of the wood stands: the stairs' arches, and each glade's set piece (below, added as they're placed); the
  // road through the wood
  const keep = arches.map((a) => ({ x0: a.x - a.span / 2 - 2, x1: a.x + a.span / 2 + 2, z0: a.z - 4, z1: a.z + 1.5 }));
  const kept = (x, z, m = 0) => keep.some((q) => x > q.x0 - m && x < q.x1 + m && z > q.z0 - m && z < q.z1 + m) || (!isFloor(x, z) && (wood.onRoad(Math.floor(z - m)) || wood.onRoad(Math.floor(z + m))));
  const U = (r) => ({ X0: r2((r.x0 - x0) / 2), X1: r2((r.x1 + 1 - x0) / 2), Z0: r2((r.y0 - y0) / 2), Z1: r2((r.y1 + 1 - y0) / 2), cx: r2((r.cx + 0.5 - x0) / 2), cz: r2((r.cy + 0.5 - y0) / 2) });
  const rooms = (L.plan ? L.rooms : []).filter((r) => r.dress);
  // ── the set pieces first, so the wood stands round them
  for (const r of rooms) {
    const u = U(r), has = (d) => r.dress.includes(d);
    if (has('arcade')) {
      // the empire's arcade along the glade's back (north) edge, a little up the bank: pointed arches in dark stone, bronze
      // cresting gone green along its top; a bay fallen
      const z = r2(u.Z0 - 1.3), a = u.X0 + 1.2, b = u.X1 - 1.2, n = Math.max(3, Math.round((b - a) / 2.6));
      trim.push({ k: 'warcade', x0: r2(a), x1: r2(b), z, y: BANK, bays: n, seed: hash('wa', r.id) % 997 });
      keep.push({ x0: a - 1.4, x1: b + 1.4, z0: z - 2.4, z1: u.Z0 + 0.2 });
    }
    if (has('granary_door')) {
      // the Root Granary's door: on the glade's west side, its steps up out of the glade into the dark under the roots
      const x = u.X0, z = r2(u.cz + 1);
      trim.push({ k: 'wgate', x, z, y: F0, seed: hash('wg', r.id) % 997 });
      add({ type: 'light', x: r2(x - 4.6), z, dy: 2.4, color: '#ffb064', intensity: 2.6, distance: 5, flicker: 0.18, nightOnly: false });   // (the tithe-lamp, still in its niche inside the door)
      trim.push({ k: 'wshaft', x: r2(x - 1.2), z: r2(z - 0.4), y: F0 + 1.2, w: 1.5, tilt: 0.22, seed: hash('wgs', r.id) % 997 });
      add({ type: 'light', x: r2(x + 1.2), z: r2(z + 0.6), dy: 3.2, color: '#d6ecc0', intensity: 3.2, distance: 8, flicker: 0, nightOnly: false });   // (round 3: the shaft's light on its stone: it was a dark box)   // (round 2: the door was lost in the dark; a shaft down onto its steps, as forest-2's)
      keep.push({ x0: x - 10.5, x1: x + 0.2, z0: z - 6.4, z1: z + 6.4 });   // (round 10: the gateway half again as big)
    }
    if (has('falls')) {
      // the falls past the glade's back corner, straight up the screen from it (round 2: off its north edge they stood
      // under the minimap): a face of dark rock under moss turned to the camera, the water down a cleft in it, its pool
      const x = r2(u.X0 - 1.5), z = r2(u.Z0 - 2.5);
      trim.push({ k: 'wfalls', x, z, y: BANK, w: 11, seed: hash('wf', r.id) % 997 });
      add({ type: 'emitter', x: r2(x + 1.2), z: r2(z + 1.2), preset: 'mist', size: [2.4, 1.6, 2.4], dy: 0.6, count: 18 });
      keep.push({ x0: x - 7, x1: x + 5, z0: z - 7, z1: z + 3.5 });
    }
  }
  // ── the trunks: a jittered grid over the wood, each by how far it is from a glade and how tall it may stand there.
  //   Round a glade (the ring, 1.4–4 units out): the great trunks, tall and straight or old and twisted, their roots
  //   reaching down the bank toward the glade; where one may not stand tall (a glade's near side) a broken snag, a mossed
  //   boulder or a root-mound. Past the ring the wood: slimmer trunks to the mist, fewer. Past 13 units nothing: the fog.
  const S = 2.7, placed = [];
  // (round 10: the great trunks first, along every glade's back edges (north and west, the camera looks over the glade at
  // them) every four units or so, a step up the bank, their roots over the lip: the glade's edge solid, as the references'
  // are; then the jittered grid fills the wood round them)
  for (const r of rooms) {
    const u = U(r);
    for (const [side, a0, a1] of /** @type {[string, number, number][]} */ ([['n', u.X0 + 0.8, u.X1 - 0.8], ['w', u.Z0 + 0.8, u.Z1 - 0.8]])) {
      for (let t = a0 + R('et', r.id, side) * 2; t < a1; t += 3.6 + R('es', r.id, side, t) * 1.8) {
        const oak = R('eo', r.id, side, t) < 0.4, h0 = R('eh', r.id, side, t), rad = oak ? 1.8 + h0 * 0.6 : 0.9 + h0 * 0.5, off = rad * 0.8 + 0.7;
        const x = r2(side === 'n' ? t : u.X0 - off), z = r2(side === 'n' ? u.Z0 - off : t);
        if (isFloor(x, z) || kept(x, z, rad) || placed.some((q) => Math.hypot(q[0] - x, q[1] - z) < q[2] + rad + 0.4)) continue;
        const want = oak ? 7 + h0 * 3 : 12 + h0 * 6, may = tallest(x, z, rad + (oak ? 2.4 : 0.6), rad + 0.3);
        const to = side === 'n' ? [0, 1, r2(off)] : [1, 0, r2(off)];
        if (may < (oak ? 5.5 : 8)) {
          // (where a glade lies behind it on the camera's line the great trunk can't stand tall: an old bole broken off at
          // what the ground allows, its girth kept, or a great fallen trunk along the edge)
          if (may >= 1.6) { placed.push([x, z, rad]); trim.push({ k: 'wsnag', x, z, y: BANK, h: r2(Math.min(may, 2.2 + h0 * 2.6)), r: r2(Math.min(rad, 1.6)), to, seed: hash('wes', r.id, side, t) % 997 }); }
          else if (may >= 0.9) { placed.push([x, z, 1.2]); trim.push({ k: 'wlog', x, z, y: BANK, len: r2(3.5 + h0 * 2.5), r: r2(Math.min(0.75, may * 0.55)), rot: side === 'n' ? 0 : r2(Math.PI / 2), seed: hash('wel', r.id, side, t) % 997 }); }
          continue;
        }
        placed.push([x, z, rad]);
        trim.push({ k: 'wtrunk', kind: oak ? 'oak' : 'straight', x, z, y: BANK, h: r2(Math.min(want, may)), r: r2(rad), lean: r2((R('el', r.id, side, t) - 0.5) * (oak ? 0.4 : 0.06)), to, far: 1, seed: hash('we', r.id, side, t) % 997 });
      }
    }
  }
  for (let gz = 0; gz < D / S; gz++) for (let gx = 0; gx < W / S; gx++) {
    const x = r2((gx + 0.15 + R('x', gx, gz) * 0.7) * S), z = r2((gz + 0.15 + R('z', gx, gz) * 0.7) * S), d = dAt(x, z);
    if (d < 1.4 || d > 11.5 || kept(x, z, 1.2)) continue;
    const ring = d < 5.2, h0 = R('h', gx, gz);
    let kind = R('k', gx, gz) < (ring ? 0.42 : 0.3) ? 'oak' : 'straight';
    if (!ring && R('s', gx, gz) < 0.35 + (d - 4) * 0.03) continue;   // (the wood thins into the mist)
    if (kind === 'oak' && tallest(x, z, 2.2 + 2.4, 2.5) < 5.5) kind = 'straight';   // (an oak's limbs over a glade's ground: a straight trunk there, if it may stand)
    const rad = kind === 'oak' ? (ring ? 1.7 + h0 * 0.7 : 0.8 + h0 * 0.4) : (ring ? 0.8 + h0 * 0.45 : 0.36 + h0 * 0.2);   // (round 10: the edge trunks two to three times the girth: the references are about mass)
    if (d < rad * 0.8 + 0.5 || placed.some((q) => Math.hypot(q[0] - x, q[1] - z) < q[2] + rad + 0.5)) continue;   // (its foot on the bank, roots spilling over the lip)
    const want = kind === 'oak' ? 7 + h0 * 3 : 12 + h0 * 6, may = tallest(x, z, rad + (kind === 'oak' ? 2.4 : 0.6), rad + 0.3);   // (an oak's limbs reach out over three units: round 1, one hung over the Arcade's fight)
    // the way down the bank to the nearest glade, for its roots
    let to = null; if (ring) { let best = 9; for (let a = 0; a < 16; a++) { const ang = (a / 16) * Math.PI * 2; for (let t = 0.5; t < best; t += 0.5) if (isFloor(x + Math.cos(ang) * t, z + Math.sin(ang) * t)) { best = t; to = [r2(Math.cos(ang)), r2(Math.sin(ang)), t]; break; } } }
    const stands = may >= (kind === 'oak' ? 5.5 : 8);   // (round 10: a trunk where it may stand eight units, its top into the gloom: at four-fifths of its want, too few stood at the glades' edges)
    if (stands) placed.push([x, z, rad]);
    if (stands) trim.push({ k: 'wtrunk', kind, x, z, y: BANK, h: r2(Math.min(want, may)), r: r2(rad), lean: r2((R('l', gx, gz) - 0.5) * (kind === 'oak' ? 0.5 : 0.08)), to, far: r2(d), seed: hash('wt', gx, gz) % 997 });
    else if (may >= 1.3 && ring && R('g', gx, gz) < 0.35) trim.push({ k: 'wsnag', x, z, y: BANK, h: r2(Math.min(may, 1.2 + h0 * 2.4)), r: r2(Math.max(rad, 0.5)), to, seed: hash('ws', gx, gz) % 997 });
    else if (ring && R('b', gx, gz) < 0.7) trim.push({ k: 'wboulder', x, z, y: BANK, s: r2(Math.min(1.5 + h0 * 0.9, may * 1.4)), seed: hash('wb', gx, gz) % 997 });   // (round 7: ours, swathed in moss; Luminati's mossy grey rocks read blue-grey with yellow spots)
    else if (ring) trim.push({ k: 'wroots', x, z, y: BANK, to, seed: hash('wr', gx, gz) % 997 });
    // (round 2: the wood before the camera was a flat dark field: a fallen trunk along it, low and mossed, or a boulder)
    else if (may >= 1.1) { if (R('lg', gx, gz) < 0.45) trim.push({ k: 'wlog', x, z, y: BANK, len: r2(3 + h0 * 3), r: r2(0.4 + h0 * 0.25), rot: r2(R('lr', gx, gz) * Math.PI), seed: hash('wlg', gx, gz) % 997 }); else trim.push({ k: 'wboulder', x, z, y: BANK, s: r2(Math.min(1.8 + h0 * 1.2, may * 1.4)), seed: hash('wb', gx, gz) % 997 }); }
  }
  // ── ferns along the glades' edges, on the bank and a step onto the floor (never further in: the fight's ground stays
  //    clear), thicker at the falls; and the odd fern on the bank's top further out
  const fallsAt = rooms.filter((r) => r.dress.includes('falls')).map(U);
  for (let j = 0; j < D; j++) for (let i = 0; i < W; i++) {
    const x = i + 0.5, z = j + 0.5, d = dist[j * W + i], wet = fallsAt.some((u) => x > u.X0 - 3 && x < u.X1 + 3 && z > u.Z0 - 4 && z < u.Z1);
    const edge = d === 0 && (!isFloor(x - 1, z) || !isFloor(x + 1, z) || !isFloor(x, z - 1) || !isFloor(x, z + 1));
    if (!(edge || (d > 0 && d < 3.2)) || kept(x, z) || wood.onRoad(j)) continue;
    if (R('f', i, j) > (wet ? 0.55 : edge ? 0.22 : 0.3)) continue;
    const px = x + (R('fx', i, j) - 0.5) * 0.7, pz = z + (R('fz', i, j) - 0.5) * 0.7;
    const s = edge ? 0.7 + R('fs', i, j) * 0.3 : 0.85 + R('fs', i, j) * 0.5;
    if (s * 0.9 > tallest(px, pz, 0.5) + 0.25) continue;   // (a tall fern on a near bank hid a figure's feet)
    trim.push({ k: 'wfern', x: r2(px), z: r2(pz), y: d === 0 ? F0 : BANK, s: r2(s), seed: hash('wfn', i, j) % 997 });
  }
  // ── the mist: one sheet a little over the ground, clear over the glades and thickening out into the wood
  // (round 3: thin before the glades, where nothing's behind it but the camera: there it lay as a flat pale field over the
  // wood's foot of the frame)
  { const rows = []; for (let j = 0; j < D; j++) { let row = ''; for (let i = 0; i < W; i++) { const c = Math.min(9, Math.floor(dist[j * W + i] / 1.2)); row += c > 2 && reach(i + 0.5, j + 0.5, 0) < 30 ? Math.min(c, 3) : c; } rows.push(row); }
    // (round 5: and closing in near opaque over the last four units of the wood's ground, where it stops: its edge stood as
    // a stepped cliff into the gloom)
    const fade = [], G = wood.ground; for (let j = 0; j < D; j++) { let row = ''; for (let i = 0; i < W; i++) row += Math.max(0, Math.min(9, Math.round(((dist[j * W + i] - (G - 4.5)) / 4) * 9))); fade.push(row); }
    trim.push({ k: 'woodmist', W, D, rows, fade, y: BANK + 0.9 }); }
  // ── the shafts of light down through the canopy: one or two a glade, onto its back third or its edge, never its middle
  //    (the fight reads on the floor's own light), motes in each
  // (round 10, the owner's coordinator: "too big, too many and the same in every room… searchlights": one a glade, thinner
  // and softer, each its own width, slant and place along the back, landing in a pool)
  for (const r of rooms) {
    if (r.dress.includes('granary_door')) continue;   // (the door's own falls on its steps)
    const u = U(r), wd = u.X1 - u.X0, dp = u.Z1 - u.Z0, fx = 0.18 + R('sx', r.id) * 0.6, fz = 0.14 + R('sz', r.id) * 0.14;
    const x = r2(u.X0 + wd * fx), z = r2(u.Z0 + dp * fz);
    trim.push({ k: 'wshaft', x, z, y: F0, w: r2(0.8 + R('sw', r.id) * 0.9), tilt: r2(0.14 + R('st', r.id) * 0.22), side: R('sd', r.id) < 0.3 ? -1 : 1, seed: hash('wsh', r.id) % 997 });
    add({ type: 'emitter', x, z, preset: 'dust', size: [1.2, 4, 1.2], dy: 2.2, count: 8 });
  }
  // ── the glades' edges made solid (round 10): moss-heaped root-banks along the bank's lip and boulders among them, low
  //    where the camera looks across them at a fight, heaped up at the back
  for (let j = 0; j < D; j++) for (let i = 0; i < W; i++) {
    const d = dist[j * W + i]; if (d < 0.9 || d > 1.6 || wood.onRoad(j)) continue;
    const x = i + 0.5 + (R('bx', i, j) - 0.5) * 0.4, z = j + 0.5 + (R('bz', i, j) - 0.5) * 0.4;
    if (kept(x, z, 0.5) || R('bk', i, j) > 0.55 || placed.some((q) => Math.hypot(q[0] - x, q[1] - z) < q[2] * 0.7 + 0.5)) continue;
    const may = Math.max(0.28, tallest(x, z, 1.0));   // (on a near edge a low lip of moss, knee-high at most: the camera looks across it at the fight)
    placed.push([x, z, 0.8]);
    if (R('bb', i, j) < 0.28 && may > 0.6) trim.push({ k: 'wboulder', x: r2(x), z: r2(z), y: BANK, s: r2(Math.min(1.3 + R('bs', i, j) * 0.9, may * 1.5)), seed: hash('wbe', i, j) % 997 });
    else trim.push({ k: 'wbank', x: r2(x), z: r2(z), y: BANK, h: r2(Math.min(0.5 + R('bh', i, j) * 0.6, may)), rot: r2(R('br', i, j) * Math.PI), seed: hash('wbn', i, j) % 997 });
  }
}
/** the greenwood's pieces (sim/world.js greenwood dressing): the waymarks' lamps on their posts, the empire's fallen blocks and
 *  broken pillars, mossed boulders */
const WOOD_LAMP = '#ffb468';
const WOOD_3D = {
  lantern: (x, z, h, k, { add, trim }) => { const light = add({ type: 'light', x, z: r2(z + 0.4), dy: 1.7, color: WOOD_LAMP, intensity: 4.2, distance: 6.2, flicker: 0.14, nightOnly: false }); trim.push({ k: 'waylamp', x, z, y: 1.0, seed: h % 997, light }); },
  brazier: (x, z, h, k, ctx) => WOOD_3D.lantern(x, z, h, k, ctx),
  fallen_block: (x, z, h, k, { trim }) => trim.push({ k: 'wblock', x, z, y: 1.0, rot: r2((h % 13) * 0.24), seed: h % 997 }),
  brokenpillar: (x, z, h, k, { trim }) => trim.push({ k: 'wpillar', x, z, y: 1.0, seed: h % 997 }),
  boulder: (x, z, h, k, { trim }) => trim.push({ k: 'wboulder', x, z, y: 1.0, s: r2(1.5 + (h % 5) * 0.15), seed: h % 997 }),
};
// ── the pass (the Pilgrims' Stair, docs/pass-dungeon.md; docs/dungeon-looks-plan.md item 13, from the owner's three
// references: a snowfield with a frozen pool among big blocks of dark rock, ledges over a drop into cloud with a rope
// bridge across a crevasse, a canyon of brown rock with a frozen river and broken bridges). No walls: behind a ledge
// (north of it, or west) the rock stands in big snow-topped blocks, rising as it goes back; in front (south, east) the
// ledge's edge and the drop into the cloud; between two ledges the drop. A tile with a ledge within six to its north-west
// is in front of it (the camera looks over it): no rock there, whatever lies behind it, as the ramparts keep their houses.
/** the pass's bridges: the plan's `bridge` halls, in Luminati's tiles. Along a bridge only the tiles all of whose four of
 *  ours are the hall's (its ends meet the ledges); across it every tile it touches (a strip of snow along the planks read
 *  as more ledge) @returns {{ i0: number, i1: number, j0: number, j1: number, along: 'x' | 'z', kind: string }[]} */
function passBridges(w, x0, y0) {
  const P = PLANS[w.site]?.floors[w.depth || 0], L = w.level; if (!P || !L.plan) return [];
  const sp = P.spaces[0], r0 = L.rooms.find((r) => r.part === sp.id); if (!r0) return [];
  const ox = r0.x0 - sp.x, oy = r0.y0 - sp.y, byId = new Map(P.spaces.map((s) => [s.id, s]));
  return P.halls.filter((h) => h.bridge).map((h) => {
    const a = byId.get(h.from), alongX = h.x + h.w === a.x || a.x + a.w === h.x;
    const sx0 = ox + h.x - x0, sy0 = oy + h.y - y0, sx1 = sx0 + h.w, sy1 = sy0 + h.h;   // (ours, from the crop's corner)
    const inner = (s0, s1) => [Math.ceil(s0 / 2), Math.floor(s1 / 2) - 1], touch = (s0, s1) => [Math.floor(s0 / 2), Math.ceil(s1 / 2) - 1];
    const [i0, i1] = alongX ? inner(sx0, sx1) : touch(sx0, sx1), [j0, j1] = alongX ? touch(sy0, sy1) : inner(sy0, sy1);
    return { i0, i1, j0, j1, along: alongX ? 'x' : 'z', kind: h.bridge };
  });
}
/** the pass's ground: the ledges' snow (a scoured patch of it in broad patches), the bridges' planks, the rock behind the
 *  ledges a little higher the further back, the drop everywhere else @returns {{ F: Uint8Array, rock: Uint8Array }} */
function passGround(W, D, tiles, heights, open0, looks, bridges, hallAt) {
  const F = new Uint8Array(W * D);   // 1 a ledge, 2 a bridge
  for (let j = 0; j < D; j++) for (let i = 0; i < W; i++) if (open0(i, j)) F[j * W + i] = 1;
  const crev = new Uint8Array(W * D), inb = (i, j) => i >= 0 && j >= 0 && i < W && j < D;
  for (const b of bridges) {
    for (let j = b.j0; j <= b.j1; j++) for (let i = b.i0; i <= b.i1; i++) if (inb(i, j) && F[j * W + i]) { F[j * W + i] = 2; tiles[j][i] = 'ე'; }
    // (beside a bridge the crevasse is kept open: no rock across from its deck)
    for (let j = b.j0 - (b.along === 'x' ? 5 : 0); j <= b.j1 + (b.along === 'x' ? 5 : 0); j++) for (let i = b.i0 - (b.along === 'z' ? 5 : 0); i <= b.i1 + (b.along === 'z' ? 5 : 0); i++) if (inb(i, j)) crev[j * W + i] = 1;
  }
  const ledge = (i, j) => inb(i, j) && F[j * W + i] === 1, any = (i, j) => inb(i, j) && F[j * W + i] > 0;
  const hallTiles = []; for (let k = 0; k < W * D; k++) if (F[k] === 1 && hallAt(k % W, (k / W) | 0)) hallTiles.push(k);
  const rock = new Uint8Array(W * D);   // how far behind its ledge a rock tile stands (1–4), and 8 if the gully's brown
  for (let j = 0; j < D; j++) for (let i = 0; i < W; i++) {
    const k0 = j * W + i; if (F[k0]) continue;
    let d = 0, lk = null;
    for (let k = 1; k <= 4 && !d; k++) for (const [a, b] of [[0, k], [k, 0], [k, k]]) if (!d && ledge(i + a, j + b)) { d = k; lk = looks[(j + b) * W + i + a]; }
    let front = false;
    for (let a = 0; a <= 6 && !front; a++) for (let b = 0; b <= 6; b++) if ((a || b) && a + b <= 8 && any(i - a, j - b)) { front = true; break; }
    // (round 1: taller columns, a step each, read as stacked cubes: a low plinth now, the blocks on it the rock)
    if (d && !front && !crev[k0]) { tiles[j][i] = lk?.brown ? 'დ' : 'გ'; heights[j][i] = (4 + d + Math.floor(vnoise(i, j, 'pr', 3) * 2.2)).toString(36); rock[k0] = d | (lk?.brown ? 8 : 0); continue; }
    tiles[j][i] = ' '; heights[j][i] = '0';
  }
  // (round 1: the scoured snow by the tile, in patches, read as a grid of square blocks: the scour is the texture's own now;
  // the halls that aren't bridges, the way trodden, in the scoured snow)
  for (let j = 0; j < D; j++) for (let i = 0; i < W; i++) if (F[j * W + i] === 1) { const lk = looks[j * W + i]; if (lk?.pass) tiles[j][i] = lk.floor[0]; }
  for (const r of hallTiles) if (F[r] === 1) tiles[(r / W) | 0][r % W] = 'ბ';
  return { F, rock };
}
/** the pass's dressing: the cloud below, the ledges' faces down into it, the rock's blocks, pines on the rock, the
 *  mountains far off, the snow falling, the bridges and the frozen river */
function passDress(W, D, { F, rock }, heights, looks, add, ptrim, bridges, clear = []) {
  const inb = (i, j) => i >= 0 && j >= 0 && i < W && j < D, ledge = (i, j) => inb(i, j) && F[j * W + i] === 1, voidAt = (i, j) => !inb(i, j) || heights[j][i] === '0';
  // the cloud's veil, by each tile's distance from a ledge or a bridge (the wharf's mist)
  { const dist = new Uint8Array(W * D).fill(9), q = [];
    for (let k = 0; k < W * D; k++) if (F[k]) { dist[k] = 0; q.push(k); }
    for (let h = 0; h < q.length; h++) { const k = q[h], i = k % W, j = (k / W) | 0, d = dist[k] + 1; if (d > 8) continue;
      for (const [di, dj] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const ii = i + di, jj = j + dj; if (!inb(ii, jj)) continue; const kk = jj * W + ii; if (dist[kk] > d) { dist[kk] = d; q.push(kk); } } }
    const rows = []; for (let j = 0; j < D; j++) { let r = ''; for (let i = 0; i < W; i++) r += rock[j * W + i] ? 0 : dist[j * W + i]; rows.push(r); }
    ptrim.push({ k: 'cloud', W, D, rows }); }
  // the ledges' faces down into the cloud: their south and east edges over the drop (the faces the camera sees), in runs
  const lines = new Map(), push = (key, t) => (lines.get(key) || lines.set(key, []).get(key)).push(t);
  for (let j = 0; j < D; j++) for (let i = 0; i < W; i++) {
    if (!ledge(i, j)) continue;
    if (voidAt(i, j + 1)) push(`s|${j + 1}`, i);
    if (voidAt(i + 1, j)) push(`e|${i + 1}`, j);
  }
  for (const [key, ts] of lines) {
    ts.sort((a, b) => a - b);
    const [side, c0] = key.split('|'), c = +c0, along = side === 's';
    const runs = []; for (const t of ts) { const r = runs[runs.length - 1]; if (r && t === r[1]) r[1] = t + 1; else runs.push([t, t + 1]); }   // (round 2: split, the veils overlapped and stood a pale pillar in the cloud)
    for (const [a, b] of runs) {
      const lk = looks[along ? (c - 1) * W + a : a * W + c - 1];
      ptrim.push({ k: 'cliff', x0: along ? a : c, z0: along ? c : a, x1: along ? b : c, z1: along ? c : b, n: along ? 'z' : 'x', out: 1, seed: hash('pc', key, a) % 997, brown: !!lk?.brown });
    }
  }
  // the rock's blocks: big ones along a ledge's back, standing on its snow against the rock; smaller ones over the rock's
  // tops, breaking its steps (Luminati's faceted boulder: the references' angular blocks); a pine here and there up there
  let pines = 0;
  for (let j = 0; j < D; j++) for (let i = 0; i < W; i++) {
    const d = rock[j * W + i] & 7, brown = !!(rock[j * W + i] & 8); if (!d) continue;
    const hh = hash('pk', i, j), top = parseInt(heights[j][i], 36) * 0.5;
    if (clear.some((c) => Math.abs(i + 0.5 - c.x) < c.r && Math.abs(j + 0.5 - c.z) < c.r)) continue;   // (round 2: the blocks stood over the fall, the shrine and the stair's arch)
    if (d === 1 && hh % 4 !== 3) {
      const s = 1.3 + (hh % 7) * 0.17, fs = ledge(i, j + 1), fe = ledge(i + 1, j);
      ptrim.push({ k: 'rock', x: r2(i + 0.5 + (fe ? 0.3 : 0) + ((hh >> 3) % 5 - 2) * 0.08), y: 0.7, z: r2(j + 0.5 + (fs ? 0.3 : 0) + ((hh >> 6) % 5 - 2) * 0.08), s: [r2(s * 1.15), r2(s * (1.0 + (hh % 5) * 0.12)), r2(s)], yaw: r2((hh % 13) * 0.48), seed: hh % 997, brown });
    } else if (d >= 2 && hh % 2 === 0) {
      const s = 1.2 + (hh % 6) * 0.2;
      ptrim.push({ k: 'rock', x: r2(i + 0.5 + ((hh >> 4) % 5 - 2) * 0.1), y: r2(top - s * 0.5), z: r2(j + 0.5 + ((hh >> 7) % 5 - 2) * 0.1), s: [r2(s * 1.15), r2(s * (0.9 + (hh % 3) * 0.2)), r2(s)], yaw: r2((hh % 11) * 0.55), seed: hh % 997, brown, flat: 0.3 });
    }
    if (d >= 2 && hh % 13 === 5 && pines < 8) { pines++; add({ type: 'tree', x: r2(i + 0.5), z: r2(j + 0.5), collider: false, opts: { kind: 'snowpine', height: r2(2.6 + (hh % 5) * 0.35), seed: hh % 997 } }); }
  }
  // (round 5, the coordinator: "banks of cloud with shadowed undersides") the cloud's banks in the drop, a lump every few
  // tiles of it two or more out from a ledge, lower the nearer the ledge, and on round past the level's edges
  { const rows = /** @type {any} */ (ptrim.find((q) => q.k === 'cloud')).rows;
    for (let j = -14; j < D + 14; j += 4) for (let i = -14; i < W + 14; i += 4) {
      const hb = hash('cb', i, j); if (hb % 5 === 0) continue;
      const inl = i >= 0 && j >= 0 && i < W && j < D, d = inl ? +rows[j][i] : 9; if (inl && (heights[j][i] !== '0' || d < 2)) continue;
      if (hb % 3 !== 0) continue;   // (rounds 6–7: fewer, the dark floor of the cloud between them)
      ptrim.push({ k: 'cloudbank', x: r2(i + 0.5 + ((hb >> 3) % 5 - 2) * 0.4), y: r2(-5.2 + Math.min(d, 6) * 0.12 - (hb % 3) * 0.3), z: r2(j + 0.5 + ((hb >> 6) % 5 - 2) * 0.4), s: r2(1 + (hb % 4) * 0.15), seed: hb % 997 }); } }
  // the mountains far off, standing up out of the cloud round the pass (behind it and to its sides, never before it; round
  // 1: their tops under the ledges', one close in to the north-west read as a rock floating in the sky)
  for (const [x, z, s] of [[-24, D * 0.35, 1.6], [W * 0.3, -24, 1.8], [-20, -18, 1.5], [W + 20, -12, 1.3], [W * 0.75, -20, 1.4], [-22, D * 0.85, 1.4]]) ptrim.push({ k: 'peak', x: r2(x), z: r2(z), s, seed: hash('pp', x, z) % 997 });
  // the snow falling, a light fall, not a storm
  ptrim.push({ k: 'snowfall', W, D });   // (round 6: our own, world.js; Luminati's snow preset never showed here)   // (round 3: the preset's flakes, two pixels at the game's zoom, didn't read)
  // the bridges; under the one over the river, the river frozen at the crevasse's foot, between the ledges either side
  for (const b of bridges) {
    ptrim.push({ k: 'bridge', x0: b.i0, z0: b.j0, x1: b.i1 + 1, z1: b.j1 + 1, along: b.along });
    if (b.kind !== 'river') continue;
    if (b.along === 'x') {
      let ja = b.j0, jb = b.j1; while (ja > 0 && (ledge(b.i0 - 1, ja - 1) || ledge(b.i1 + 1, ja - 1))) ja--; while (jb < D - 1 && (ledge(b.i0 - 1, jb + 1) || ledge(b.i1 + 1, jb + 1))) jb++;
      ptrim.push({ k: 'river', x0: b.i0, x1: b.i1 + 1, z0: ja - 3, z1: jb + 4, y: -3.4, along: 'z' });
    } else {
      let ia = b.i0, ib = b.i1; while (ia > 0 && (ledge(ia - 1, b.j0 - 1) || ledge(ia - 1, b.j1 + 1))) ia--; while (ib < W - 1 && (ledge(ib + 1, b.j0 - 1) || ledge(ib + 1, b.j1 + 1))) ib++;
      ptrim.push({ k: 'river', x0: ia - 3, x1: ib + 4, z0: b.j0, z1: b.j1 + 1, y: -3.4, along: 'x' });
    }
  }
}
/** the pass's pieces (sim/world.js, the pass's dressing): the pilgrims' prayer posts, the doorways' lanterns hung from
 *  them, cairns, snow-laden pines, the blue ice's crystals (Luminati's own ice, glowing), the frozen fall, the shrine, the
 *  packs the pilgrims left (a frozen pool's ice is gathered: dungeon()) */
const PASS_3D = {
  pass_post: (x, z, h, k, { ptrim }) => ptrim.push({ k: 'post', x, z, seed: h % 997 }),
  lantern: (x, z, h, k, { ptrim, add }) => { ptrim.push({ k: 'post', x, z, seed: h % 997, lamp: true }); add({ type: 'light', x: r2(x - 0.46), z, dy: 1.9, color: '#ffb45e', intensity: 2.6, distance: 4.5, flicker: 0.12, nightOnly: false }); },
  pass_cairn: (x, z, h, k, { ptrim }) => ptrim.push({ k: 'cairn', x, z, seed: h % 997, s: 1 + (h % 3) * 0.15 }),
  pass_pine: (x, z, h, k, { add }) => add({ type: 'tree', x, z, collider: false, opts: { kind: 'snowpine', height: r2(3.0 + (h % 4) * 0.3), seed: h % 997 } }),
  pass_crystals: (x, z, h, k, { add, ptrim }) => {
    ptrim.push({ k: 'crystals', x, z, seed: h % 997, s: r2(1 + (h % 3) * 0.15) });   // (round 5: ours, vivid and haloed; Luminati's ice glowed at 0.15, grey-blue slabs)
    if (h % 2 === 0) add({ type: 'light', x, z: r2(z + 0.7), dy: 1.0, color: '#7fd8ff', intensity: 2.4, distance: 3.8, flicker: 0, nightOnly: false });
  },
  pass_icefall: (x, z, h, k, { ptrim, add, wall, heights }) => {
    const n = wall?.side === 'w' ? 'x' : 'z', fx = n === 'x' ? r2(wall.x + 0.25) : x, fz = n === 'z' && wall ? r2(wall.z + 0.25) : z;
    const bi = n === 'x' ? Math.floor(fx) - 1 : Math.floor(fx), bj = n === 'z' ? Math.floor(fz) - 1 : Math.floor(fz), top = Math.max(4.4, (parseInt(heights[bj]?.[bi] || '8', 36) || 8) * 0.5 + 0.2);
    ptrim.push({ k: 'icefall', x: fx, z: fz, n, top, seed: h % 997 });
    for (const [du, s] of [[-1.1, 2.2], [1.2, 2.0], [0, 2.6]]) ptrim.push({ k: 'rock', x: n === 'z' ? r2(fx + du) : r2(fx - 1.3), y: 0.6, z: n === 'z' ? r2(fz - 1.3) : r2(fz + du), s: [s, r2(top - 0.6), r2(s * 0.8)], yaw: r2(du), seed: (h + Math.round(du * 10)) % 997, brown: true, detail: 1, flat: 0.25 });   // (the rock the fall comes down: round 1, it hung on a low step)
    add({ type: 'light', x: n === 'z' ? fx : r2(fx + 1.2), z: n === 'z' ? r2(fz + 1.2) : fz, dy: 1.6, color: '#86dcff', intensity: 4, distance: 5, flicker: 0, nightOnly: false });
  },
  pass_shrine: (x, z, h, k, { ptrim }) => ptrim.push({ k: 'shrine', x, z: r2(z - 0.25), seed: h % 997 }),
  barrels: (x, z, h, k, ctx) => RAMP_3D.barrels(x, z, h, k, ctx), crates: (x, z, h, k, ctx) => RAMP_3D.crates(x, z, h, k, ctx), sacks: (x, z, h, k, ctx) => RAMP_3D.sacks(x, z, h, k, ctx),
};
PASS_3D.brazier = PASS_3D.lantern; PASS_3D.torch = PASS_3D.lantern;
// ── the Praetory's frost (item 10): icicles along every back wall's top, snow drifted in at the doors (its tiles trodden
// snow, a drift either side), and the guard frozen at their posts (FROST_3D)
function frostDress(W, D, tiles, heights, open, w, x0, y0, add, ptrim, roomAt = (i, j) => null) {
  const FLR = String(FLOOR);
  // the icicles: under each back wall's top (its face to the room: south or east), in runs of one height
  const lines = new Map(), push = (key, t) => (lines.get(key) || lines.set(key, []).get(key)).push(t);
  for (let j = 0; j < D; j++) for (let i = 0; i < W; i++) {
    if (heights[j][i] === FLR || heights[j][i] === '0' || tiles[j][i] === ' ') continue;
    const hy = parseInt(heights[j][i], 36); if (hy < 6) continue;   // (a near wall broken down low: none)
    if (open(i, j + 1)) push(`s|${j + 1}|${hy}`, i);
    if (open(i + 1, j)) push(`e|${i + 1}|${hy}`, j);
  }
  for (const [key, ts] of lines) {
    ts.sort((a, b) => a - b);
    const [side, c0, hy] = key.split('|'), c = +c0, along = side === 's', y = +hy * 0.5;
    const runs = []; for (const t of ts) { const r = runs[runs.length - 1]; if (r && t === r[1]) r[1] = t + 1; else runs.push([t, t + 1]); }
    for (const [a, b] of runs) ptrim.push({ k: 'icicles', x0: along ? a : c, z0: along ? c : a, x1: along ? b : c, z1: along ? c : b, n: along ? 'z' : 'x', out: 1, y, seed: hash('fi', key, a) % 997 });
  }
  // (round 5, the coordinator: "snow drifted across the floor, not just at the doors") the snow in broad drifts over the
  // flags, deepest along the walls' feet
  for (let j = 0; j < D; j++) for (let i = 0; i < W; i++) {
    if (!open(i, j) || tiles[j][i] !== 'ზ') continue;
    let wall = false; for (const [di, dj] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) wall ||= !open(i + di, j + dj) && heights[j + dj]?.[i + di] !== '0';
    // (round 6: patches out in the open, a tile at a time, read as square blocks of snow; round 7, Luminati's drifts too small
    // to see: the snow against the walls' feet a tile deep, and over the floor our own drifts, low soft lumps with edges of
    // their own, in broad drifts by value noise, thinnest under the fight)
    if (wall) tiles[j][i] = 'თ';
    const hd = hash('fm', i, j), r = roomAt(i, j), mid = r && Math.abs(x0 + 2 * i + 1 - r.cx) < r.rw * 0.4 && Math.abs(y0 + 2 * j + 1 - r.cy) < r.rh * 0.4, v = vnoise(i, j, 'fd', 4);
    if (wall || (v < 0.4 && hd % (mid ? 7 : 2) === 0)) ptrim.push({ k: 'drift', x: r2(i + 0.5 + ((hd >> 3) % 5 - 2) * 0.15), z: r2(j + 0.5 + ((hd >> 6) % 5 - 2) * 0.15), s: r2((wall ? 1.3 : 1.0) + (hd % 5) * 0.15), seed: hd % 997 });
  }
  // the doors: where a hall meets a room, trodden snow on the tiles and a drift to one side
  const cells = w.level.cells, seen = new Set();
  for (const [k, c] of cells) {
    if (c.kind !== 'floor' || c.room >= 0) continue;
    const [x, y] = k.split(',').map(Number);
    if (![[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => { const n = cells.get(`${x + dx},${y + dy}`); return n && n.kind === 'floor' && n.room >= 0; })) continue;
    const i = Math.floor((x - x0) / 2), j = Math.floor((y - y0) / 2), key = `${i},${j}`; if (seen.has(key)) continue; seen.add(key);
    for (const [di, dj] of [[0, 0], [1, 0], [-1, 0], [0, 1], [0, -1]]) if (open(i + di, j + dj) && (tiles[j + dj][i + di] === 'ზ' || tiles[j + dj][i + di] === 'თ')) tiles[j + dj][i + di] = 'h';
    const h = hash('fd', i, j); if (h % 3 === 0) add({ type: 'rock', x: r2(i + 0.5 + ((h >> 2) % 3 - 1) * 0.6), z: r2(j + 0.5 + ((h >> 4) % 3 - 1) * 0.6), opts: { stone: 'snow', size: r2(0.9 + (h % 4) * 0.2), seed: h % 97 } });
  }
}
/** the Praetory's pieces: a guard frozen at his post (our bound legionary, the ice grown up round him) */
const FROST_3D = {
  frozen_guard: (x, z, h, k, { ptrim, sprites, tx, ty }) => { sprites.push({ prop: 'bound', kind: 'bound', tx, ty, x, z }); ptrim.push({ k: 'iceshell', x, z, seed: h % 997 }); },
};

/** @param {any} w @param {{ region?: string, stairs?: string, walls?: string}} [o] */
function dungeon(w, o = {}) {
  const cells = w.level.cells;
  let bx0 = Infinity, by0 = Infinity, bx1 = -Infinity, by1 = -Infinity;
  for (const k of cells.keys()) { const c = k.indexOf(','), x = +k.slice(0, c), y = +k.slice(c + 1); if (x < bx0) bx0 = x; if (y < by0) by0 = y; if (x + 1 > bx1) bx1 = x + 1; if (y + 1 > by1) by1 = y + 1; }
  const sp = w.spawn || { x: (bx0 + bx1) / 2, y: (by0 + by1) / 2 };
  // a cavern too big for one level is held round the middle of its ways up and down, so both are in it (the Toadking's
  // Mound and the Scrag Warren run past 256 of ours); round where the hero comes in when they're further apart
  const up = (w.structs || []).find((s) => s.id.startsWith('stairsup')) || sp, wl = w.stairwell, dn = wl ? { x: (wl.x0 + wl.x1) / 2, y: (wl.y0 + wl.y1) / 2 } : w.stairsAt || sp;
  const both = Math.abs(up.x - dn.x) < MAX_TILES - 24 && Math.abs(up.y - dn.y) < MAX_TILES - 24;
  // (a coast floor's sea runs out past its rooms, coastGround, and on as world.js's sheet: at two of ours the camera saw
  // past the level's edge, a flat sheet of mist where the sea stopped)
  // (the greenwood's glades with the wood round them: a margin of trunks and mist, `margin` of ours)
  const M0 = (() => { const k = w.level.plan && w.level.rooms?.length ? w.level.rooms[0].kit : null; return (k && KIT_LOOK[k]?.margin) || 2; })();
  const mg = w.level.plan && (w.level.rooms || []).some((r) => KIT_LOOK[r.kit]?.coast) ? 8 : M0;
  const { x0, y0, W, D } = crop(bx0 - mg, by0 - mg, bx1 + mg, by1 + mg, both ? (up.x + dn.x) / 2 : sp.x, both ? (up.y + dn.y) / 2 : sp.y);
  const X = (x) => r2((x - x0) / 2), Z = (y) => r2((y - y0) / 2);
  // (a plan with no kit of its own, the Ninth Vault: its rooms' one kit, in the Reach; the Vale's Ninth Milestone keeps
  // the chasm's halls it was approved in)
  const L0 = w.level, one = L0.plan && L0.rooms?.length ? [...new Set(L0.rooms.map((r) => r.kit).filter(Boolean))] : [];
  // (a building's inside: its kits all inside ones, the first its floor's; wherever it stands)
  // (a coast floor, coastGround: its kits room by room, the sea round them; with no kit of its own, its sea cave's)
  const coast = one.some((k) => KIT_LOOK[k]?.coast);
  const kit = w.kit || (one.length === 1 && SITES[w.site]?.region === 'reach' ? one[0] : one.length && (one.every((k) => KIT_LOOK[k]?.inside) || one.every((k) => KIT_LOOK[k]?.forest)) ? one[0] : one.length === 1 && SITE_KIT[w.site]?.[one[0]] ? SITE_KIT[w.site][one[0]] : null)   // (the Ninth Milestone: its one kit's own look, SITE_KIT)
    || (coast ? one.find((k) => KIT_LOOK[k].coast === 'cave') || one.find((k) => KIT_LOOK[k]?.coast) : null);
  const gen = KIT_LOOK[kit] ? null : landLook(w);   // (a generated floor outside the Vale: its land's looks, item 11)
  const look = KIT_LOOK[kit] || gen || THEME_LOOK[w.theme] || DEFAULT_LOOK;
  const tiles = grid(W, D, look.wall), heights = grid(W, D, '6'), pools = w.pools || new Set();
  // an authored floor (plans.js) is dressed room by room: each room in its own kit's stone (the Keep's barracks in dressed
  // stone, its cellars' cave in rock), a dug room (a 'cave') walled in rock whatever its kit; the halls in the floor's
  const roomAt0 = (i, j) => { if (!w.level.plan) return null; for (const [dx, dy] of [[0, 0], [1, 0], [0, 1], [1, 1]]) { const c = cells.get(`${x0 + 2 * i + dx},${y0 + 2 * j + dy}`); if (c && c.room >= 0) return w.level.rooms[c.room]; } return null; };
  const L = w.level, roomLook = (c) => {
    const r = L.plan && c && c.room >= 0 ? L.rooms[c.room] : null; if (!r) return look;
    const k = KIT_LOOK[SITE_KIT[w.site]?.[r.kit] || r.kit] || look; return r.shape === 'cave' ? (k.caveLook ||= { ...k, wall: k.cave || 'x' }) : k;   // (a site's own look for a shared kit: SITE_KIT)
  };
  const looks = new Array(W * D).fill(null), roomOf = new Int16Array(W * D).fill(-1);
  // a tile is floor when any of its four of ours is (a corridor one of ours wide stays open); standing water where two are
  for (let j = 0; j < D; j++) for (let i = 0; i < W; i++) {
    let floor = 0, wet = 0, lk = null, rm = -1;
    for (const [dx, dy] of [[0, 0], [1, 0], [0, 1], [1, 1]]) {
      const k = `${x0 + 2 * i + dx},${y0 + 2 * j + dy}`, c = cells.get(k);
      if (c && c.kind === 'floor') { floor++; if (!lk || c.room >= 0) { lk = roomLook(c); if (c.room >= 0) rm = c.room; } }
      if (pools.has(k)) wet++;
    }
    // (a palace's: its marble in a checker by the tile, its yard in flags: KIT_LOOK.palace)
    const yard = lk && lk.yard && L.plan && rm >= 0 && L.rooms[rm]?.role === 'entrance';
    if (floor && rm >= 0) roomOf[j * W + i] = rm;
    // (a wet kit's pools are its water's sheet over the floor, not the riverbed: wetDress; a garth's floor its turf)
    const garth = lk && lk.garth && L.plan && rm >= 0 && L.rooms[rm]?.dress?.includes('garth');
    if (floor) { looks[j * W + i] = lk; tiles[j][i] = wet >= 2 && !lk.wet ? 'P' : garth ? lk.garth : yard ? lk.yard : lk.checker ? lk.floor[(i + j) & 1] : hash('d', i, j) % 100 < (lk.mix ?? 18) ? lk.floor[1] : lk.floor[0]; heights[j][i] = '2'; }
  }
  // (the Vale's stone, docs/dungeon-looks-plan.md items 1, 2: a hall takes the look of the room it leads from, the nearer
  // one: a passage between two of the barrow's rooms is the barrow's, the cellars' rough way down the cave's, not the
  // floor's one look; the Ninth Milestone's halls its stone, not the chasm's)
  if (L.plan && VALE_STONE.has(w.site)) {
    const src = new Int32Array(W * D).fill(-1), q = [];
    for (let j = 0; j < D; j++) for (let i = 0; i < W; i++) { const k = j * W + i; if (!looks[k]) continue; const r = roomAt0(i, j); if (r) { src[k] = k; q.push(k); } }
    for (let h = 0; h < q.length; h++) { const k = q[h], i = k % W, j = (k / W) | 0;
      for (const [di, dj] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const ii = i + di, jj = j + dj; if (ii < 0 || jj < 0 || ii >= W || jj >= D) continue; const kk = jj * W + ii; if (looks[kk] && src[kk] < 0) { src[kk] = src[k]; q.push(kk); } } }
    for (let k = 0; k < W * D; k++) { const lk = src[k] >= 0 ? looks[src[k]] : null; if (!lk || lk === looks[k] || roomAt0(k % W, (k / W) | 0)) continue;
      const i = k % W, j = (k / W) | 0; looks[k] = lk; if (tiles[j][i] !== 'P') tiles[j][i] = hash('d', i, j) % 100 < (lk.mix ?? 18) ? lk.floor[1] : lk.floor[0]; }
  }
  // a crypt's ledger stones in a row down each fighting room's long axis (round 3: scattered, they were lost), flat, so
  // the floor stays open
  // (round 5: each a slab of its own, one unit by two, laid along the axis every three: as floor tiles they read as
  // random paler flags; trim, below, where the crypt's other pieces are built)
  // a broad warm pool at each side of a crypt's fighting rooms, the candles' light on the floor (round 8: between the
  // small pools the floor went dead), the founder's vault lit by his own
  const roomPools = [], rings = [];
  if (L.plan) for (const r of L.rooms) {
    if (!(KIT_LOOK[r.kit]?.ledgers || KIT_LOOK[r.kit]?.pools) || r === L.entrance) continue;
    const along = r.rw >= r.rh;
    // (round 9: one broad low pool at the middle, so the fight stands on the brightest open floor; the ossuary none at
    // its sides, its niches' candles enough: stacked there they burned like a bonfire)
    roomPools.push({ x: r2((r.cx - x0) / 2), z: r2((r.cy - y0) / 2), mid: true });
    roomPools.push({ x: r2((r.cx - x0) / 2), z: r2((r.cy + r.rh * 0.3 - y0) / 2), front: true });   // (a wider dimmer one toward the near sill: round 11, the rooms' fronts went cold)
    if (BONE_KITS.has(r.kit)) rings.push({ k: 'bonering', x: r2((r.cx - x0) / 2), z: r2((r.cy - y0) / 2), r: 1.5, seed: hash('or', r.id) % 997 });
    if (r.role !== 'end' && !BONE_KITS.has(r.kit)) for (const sg of [-1, 1]) roomPools.push({ x: r2((r.cx + (along ? sg * r.rw * 0.62 : 0) - x0) / 2), z: r2((r.cy + (along ? -r.rh * 0.25 : sg * r.rh * 0.62) - y0) / 2) });
  }
  const ledgers = [];
  if (L.plan) for (const r of L.rooms) {
    if (!KIT_LOOK[r.kit]?.ledgers) continue;
    const along = r.rw >= r.rh, n = r === L.entrance ? 2 : Math.max(2, Math.min(4, Math.floor((along ? r.rw : r.rh) / 6)));   // (the stair hall's two: round 7; round 9, half as many, a deliberate line)
    for (let q = 0; q < n; q++) {
      const off = (q - (n - 1) / 2) * 11, side = n > 3 ? (q % 2 ? 1.6 : -1.6) : 0, gx = r.cx + (along ? off : side), gy = r.cy + (along ? side : off);   // (four stood in one file down the room: two and two, out of step, §4.6)
      ledgers.push({ k: 'ledger', x: r2((gx - x0) / 2), z: r2((gy - y0) / 2), rot: along ? 0 : Math.PI / 2, seed: hash('lg', r.id, q) % 997 });
    }
  }
  // the rock beyond the walls is nothing, as Emberlit draws it: only the ring of wall round the floor stands, the rest
  // void (black), not a sea of lit wall-tops. (A wharf's: the harbour, still water to the fog, every tile off its decks)
  const open = (i, j) => i >= 0 && j >= 0 && i < W && j < D && heights[j][i] === '2';
  if (look.water) for (let j = 0; j < D; j++) for (let i = 0; i < W; i++) if (heights[j][i] !== '2') { tiles[j][i] = look.wall; heights[j][i] = '0'; }
  const wood = look.forest ? woodGround(W, D, tiles, heights, L, x0, y0, look) : null;   // (the greenwood: the wood's ground round the glades, the road)
  const rampart = look.ramparts ? rampartGround(W, D, tiles, heights, open) : null;   // (the ramparts: the houses' street behind, the parapet in front, the drop)
  const passB = look.pass ? passBridges(w, x0, y0) : [], pass = look.pass ? passGround(W, D, tiles, heights, open, looks, passB, (i, j) => { for (const [dx, dy] of [[0, 0], [1, 0], [0, 1], [1, 1]]) { const c = cells.get(`${x0 + 2 * i + dx},${y0 + 2 * j + dy}`); if (c && c.kind === 'floor' && c.room >= 0) return false; } return true; }) : null;   // (the pass: the rock behind its ledges, the drop in front, its bridges)
  for (let j = 0; j < D; j++) for (let i = 0; i < W; i++) {
    if (heights[j][i] === '2' || look.water || look.ramparts || look.forest || look.pass) continue;
    let near = false;
    for (let dj = -1; dj <= 1 && !near; dj++) for (let di = -1; di <= 1 && !near; di++) near = open(i + di, j + dj);
    if (!near) { tiles[j][i] = ' '; heights[j][i] = '0'; continue; }
    // a wall in the stone of the room it stands by (an authored floor's rooms differ; elsewhere the floor's one look)
    for (let dj = -1; dj <= 1; dj++) for (let di = -1; di <= 1; di++) { const n = open(i + di, j + dj) ? looks[(j + dj) * W + i + di] : null; if (n && n !== look) { tiles[j][i] = n.wall; dj = di = 2; } }
  }
  // (a coast floor: each room's own ground round it, the sea past it all; before the walls are cut and dressed below)
  const propTiles = new Set(); if (coast) for (const [k] of w.props || []) { const [tx, ty] = k.split(',').map(Number); propTiles.add(Math.floor((ty - y0) / 2) * W + Math.floor((tx - x0) / 2)); }
  if (coast) coastGround(W, D, tiles, heights, open, looks, roomOf, propTiles);
  // the Old Cellars' broken floor (world.js 'pit'): its tiles sunk two steps, rock at the bottom, a black hole to look into
  for (const [k, kind] of w.props || []) {
    if (kind !== 'pit') continue;
    const [tx, ty] = k.split(',').map(Number), i = Math.floor((tx - x0) / 2), j = Math.floor((ty - y0) / 2);
    if (i >= 0 && j >= 0 && i < W && j < D && heights[j][i] === '2') { heights[j][i] = '0'; tiles[j][i] = 'U'; }
  }
  const inside = !!look.inside, faces = inside && !look.pass ? tavernWalls(W, D, heights, open, looks, tiles) : inside ? [] : null;   // (a building's walls stand whole: below)
  // (the Vale's stone: the keep's walls stand whole round their own rooms on a floor of ruins, the barrow's back walls a
  // step taller than the ruin's)
  const wholeFaces = !inside && looks.some((l) => l?.whole) ? tavernWalls(W, D, heights, open, looks, tiles, WHOLE_WALLS) : null, barrowy = looks.some((l) => l?.barrow);
  const crown = o.walls === 'plain' || inside || look.forest ? null : ruinWalls(W, D, tiles, heights, open, barrowy ? (i, j) => LIFT_OF[tiles[j][i]] || 0 : null);   // (the walls' ragged tops, below; ?walls=plain: level boxes, as before)
  const stairLights = stairs(w, x0, y0, W, D, tiles, heights, o.stairs !== 'plain');
  if (look.forest) { const ST = { '^': '\u16AA', '<': '\u16AB', v: '\u16AC', '>': '\u16AD' }; for (const row of tiles) for (let i = 0; i < row.length; i++) if (ST[row[i]]) row[i] = ST[row[i]]; }   // (the greenwood's way up in the empire's grey steps)
  // water indoors (docs/water-indoors.md): the channels sunk now, once the walls round them are cut as the floor's
  const wetLook = [look, ...(L.plan ? L.rooms.map((r) => KIT_LOOK[r.kit]) : [])].find((k) => k && k.wet) || null;
  const wet = wetLook ? wetGround(w, { x0, y0, W, D, X, Z, tiles, heights, looks, roomLook }) : null;
  const objects = [], count = {}, sprites = [];
  // (an arch over each way, built by world.js in the floor's own stone: GDD v1.57, docs/dungeon-stairs-proposal.md;
  // ?stairs=plain the stairs as they were)
  const archStone = look.arch || ((LEGEND[look.wall]?.side && !/cliff|dirt/.test(LEGEND[look.wall].side)) ? LEGEND[look.wall].side : 'stone_brick');
  for (const a of stairLights.arches || []) sprites.push({ arch: { ...a, stone: archStone } });
  const add = (ob) => { count[ob.type] = (count[ob.type] || 0) + 1; const o = { id: `${ob.type}_${count[ob.type]}`, ...ob }; objects.push(o); return o; };
  const drop = (o) => { const i = objects.indexOf(o); if (i >= 0) objects.splice(i, 1); };   // (a lantern's light gone with it: a corner's stores take its bay)
  const trim = inside || wholeFaces || barrowy || look.forest || coast ? [] : null;
  const ptrim = look.pass || look.frost ? [] : null, passIce = /** @type {[number, number][]} */ ([]);   // (the pass's and the Praetory's own pieces: world.js buildPass)
  // (the room a floor tile of Luminati's is in: a palace's bays dress by what their room was for, palaceRun)
  const roomAt = (i, j) => { if (!L.plan) return null; for (const [dx, dy] of [[0, 0], [1, 0], [0, 1], [1, 1]]) { const c = cells.get(`${x0 + 2 * i + dx},${y0 + 2 * j + dy}`); if (c && c.room >= 0) return L.rooms[c.room]; } return null; };
  // (the room's own lamps, the sim's lit props: a wall bay within reach of one stays bare, the lamp its light; a pale
  // hanging there burned white, §4.6)
  const lamps = /** @type {[number, number][]} */ ([]); for (const [k, kind] of w.props) if (PROP_LIGHT[kind]) { const [x, y] = k.split(',').map(Number); lamps.push([X(x + 0.5), Z(y + 0.5)]); }
  if (inside) { tavernDress(faces, stairLights.arches || [], open, add, trim, roomAt, look === KIT_LOOK.hulk ? SHIP_STORY : TAV_STORY, lamps); if (look.palace) trim.push(...palaceRunners(w, L, X, Z)); if (L.plan) trim.push(...fenMats(w, L, X, Z)); if (look.water) docksDress(W, D, open, add, trim, stairLights.arches || [], !!look.stone); if (rampart) rampartsDress(W, D, open, rampart, add, trim, stairLights.arches || []); trim.push(...ledgers, ...rings); for (const q of roomPools) add(q.front ? { type: 'light', x: q.x, z: q.z, dy: 3, color: '#ffc088', intensity: 2.3, distance: 10.4, flicker: 0, nightOnly: false } : q.mid ? { type: 'light', x: q.x, z: q.z, dy: 2.4, color: '#ffc488', intensity: 4.3, distance: 5.5, flicker: 0, nightOnly: false } : { type: 'light', x: q.x, z: q.z, dy: 2.6, color: '#ffbe80', intensity: 2.8, distance: 8, flicker: 0, nightOnly: false }); sprites.push({ tavern: { pieces: trim } }); }
  // (v1.166) the Seventh Tower's roof (Highmarch's second floor, docs/highmarch-floor2-proposal.md §6): the salt marsh at
  // high water far under the tower, and the drowned fleet riding in it off the roof's south and east parapets, their
  // stern-lanterns lit while Lucan's song holds them (`lit`: hybrid.js puts them out when he sits down)
  if (w.site === 'highmarch' && (w.depth || 0) === 1 && L.plan) { const roof = L.rooms.find((r) => r.part === 'the_roof'); if (roof) sprites.push({ fleet: { lit: true, pieces: fleetPieces(roof, W, D, X, Z) } }); }
  if (wood) { woodDress(W, D, wood, L, x0, y0, add, trim, stairLights.arches || []); sprites.push({ tavern: { pieces: trim } }); }
  // (a coast floor's own ground dressed, coastDress; its trim goes out with the rest's, below, or the inside's, above)
  if (coast) coastDress(W, D, tiles, heights, open, looks, roomOf, add, trim, stairLights.arches || [], L, X, Z);
  if (!inside && trim) {   // (the Vale's stone: the keep's whole walls dressed, the barrow's doorframes and shoring)
    if (wholeFaces) { tavernDress(wholeFaces, stairLights.arches || [], open, add, trim, roomAt); curtainSills(W, D, tiles, heights, open, trim); }
    if (barrowy) barrowDress(W, D, tiles, heights, open, trim, stairLights.arches || [], roomAt);
    // (round 3: a barrow's fighting rooms lit at their middles, a broad low warmth: the candles and the doorways' lanterns
    // left the muster hall's floor, a hall of standing stones, black between them)
    // (and the keep's great hall, its middle lit by its lanterns and its hearth: round 4, the floor a violet slate)
    if (L.plan) for (const r of L.rooms) if (r !== L.entrance && (KIT_LOOK[r.kit]?.barrow || KIT_LOOK[r.kit]?.wall === 'Ø') && r.shape !== 'cave') { const hall = KIT_LOOK[r.kit]?.wall === 'Ø'; add({ type: 'light', x: r2((r.cx - x0) / 2), z: r2((r.cy - y0) / 2), dy: 3.2, color: '#ffc488', intensity: hall ? 6.5 : 3.4, distance: hall ? 10 : Math.min(12, Math.max(6, Math.min(r.rw, r.rh) * 0.45)), flicker: 0, nightOnly: false }); }   // (round 5: the hall's under the dungeon's violet fill, a stronger pool)
    sprites.push({ tavern: { pieces: trim } });
  }
  if (pass) passDress(W, D, pass, heights, looks, add, ptrim, passB, [...(stairLights.arches || []).map((a) => ({ x: a.x, z: a.z, r: a.span / 2 + 1.5 })), ...[...(w.props || [])].filter(([, k]) => k === 'pass_icefall' || k === 'pass_shrine').map(([k, kind]) => { const [tx, ty] = k.split(',').map(Number); return { x: X(tx + 0.5), z: Z(ty + 0.5), r: kind === 'pass_icefall' ? 3.2 : 2.6 }; })]);
  if (look.frost) frostDress(W, D, tiles, heights, open, w, x0, y0, add, ptrim, roomAt);
  if (wet) { if (wet.trim.length) sprites.push({ wet: { pieces: wet.trim } }); for (const sh of wet.sheets) sprites.push({ shallows: sh }); for (const l of wet.lights) add(l); }
  if (crown) for (const c of crown) if (heights[c.j]?.[c.i] === c.h && !(coast && c.sprite)) { add({ ...c.ob(X, Z), onWall: true }); if (c.sprite) sprites.push(c.sprite); }   // (onWall: on a wall's top, not the room's own)   // (what stands on the walls' tops, where the stairs didn't take the wall; a coast floor's rock takes no candles)
  for (const l of stairLights) add(l.glow ? { type: 'light', x: X(l.x), z: Z(l.y), dy: l.dy, color: l.glow.color, intensity: l.glow.intensity * (look.fill && look.inside ? 0.45 : 1), distance: l.glow.distance * (look.fill && look.inside ? 0.7 : 1), flicker: 0.08, nightOnly: false }
    : { type: 'wallTorch', x: X(l.x), z: Z(l.y), rotation: 0, dy: l.dy ?? 1.4, opts: { embers: true } });
  const magma = /** @type {[number, number][]} */ ([]);   // (the Magma Vault's magma tiles, of ours: built as one flow below)
  // (the Cold Seam's: its pieces' batch, its rails' tiles, of ours, and the kit a tile's in: its room's, else the floor's)
  const mine = [], rails = new Set(), kitAt = (k) => { const c = cells.get(k); return (c && c.room >= 0 && L.rooms[c.room]?.kit) || kit || w.kit; };
  for (const [k, kind] of w.props || []) if (kind === 'rail') rails.add(k);
  for (const [k, kind] of w.props || []) if (kind === 'cart') { const [a, b] = k.split(',').map(Number); if ((rails.has(`${a - 1},${b}`) && rails.has(`${a + 1},${b}`)) || (rails.has(`${a},${b - 1}`) && rails.has(`${a},${b + 1}`))) rails.add(k); }   // (the rails run on under a cart stood on them)
  for (const [k, kind] of w.props || []) {
    const [tx, ty] = k.split(',').map(Number), x = X(tx + 0.5), z = Z(ty + 0.5);
    if (x < 0.5 || z < 0.5 || x > W - 0.5 || z > D - 0.5 || /^stair/.test(kind)) continue;   // (the stairs are the floor's own: stairs())
    const h = hash('p', tx, ty);
    if (kind === 'exit') { add({ type: 'lamppost', x, z, rotation: 0, opts: { style: 'arm' } }); continue; }
    if (kind === 'block') continue;                                 // (a big piece's footprint: world.js big)
    // (the Magma Vault, the owner 2026-11-26: "flowing magma and a few furnaces, anvils"; sim/world.js magma_channel,
    // magma_pool, furnaces, anvils) its pieces in every kit they stand in (the vault's caves, the works' hall)
    if (kind === 'magma') { magma.push([tx, ty]); continue; }
    // (a coast floor: each piece by the kind of room it stands in, coastProp; the rest as anywhere)
    if (coast && coastProp(kind, x, z, h, looks[Math.floor(z) * W + Math.floor(x)], { add, trim, open, room: roomAtProp(w, k) })) continue;
    if (WET_PROPS.has(kind)) continue;                              // (deep water: the floor's own, wetGround)
    if (MAGMA_3D[kind]) { MAGMA_3D[kind](tx, ty, h, { X, Z, add, sprites, props: w.props }); continue; }
    if (look.pass && kind === 'pass_ice') { passIce.push([x, z]); continue; }   // (a frozen pool's ice, gathered: one pool, its rim lit)
    if (inside && look.pass && PASS_3D[kind]) { PASS_3D[kind](x, z, h, kind, { add, trim, ptrim, open, heights, wall: wallOf(open, W, D, x, z) }); continue; }
    if (look.frost && FROST_3D[kind]) { FROST_3D[kind](x, z, h, kind, { ptrim, sprites, tx, ty }); continue; }
    // (the Cold Seam's mine, item 8: its rails gathered into runs below; the rest of its pieces built in the mine's batch)
    if (kind === 'rail') continue;
    if (MINE_3D[kind] && MINE_KITS.has(kitAt(k))) { MINE_3D[kind](x, z, h, kind, { add, mine, open, rails, tx, ty }); continue; }
    // (a counting house's furniture, item 9: the clerks' desks, their lamps, the strongbox)
    if (inside && look.counting && COUNT_3D[kind]) { COUNT_3D[kind](x, z, h, kind, { add, trim, wall: wallOf(open, W, D, x, z) }); continue; }
    if (inside && look.ramparts && RAMP_3D[kind]) { RAMP_3D[kind](x, z, h, kind, { add, trim, open }); continue; }
    if (wood && WOOD_3D[kind]) { WOOD_3D[kind](x, z, h, kind, { add, trim, wood }); continue; }   // (the greenwood's: docs/greenwood-dungeon.md)
    // (the hulk's way in, a gangway or the Grace's reef ladder, takes the wharf's rope coils and nets: with no drawer of
    // their own there they stood as dark hooded shapes, read as foes: docs/art-critic-pass-tidemark-step7.md)
    if (inside && (look.water || (look === KIT_LOOK.hulk && (kind === 'rope' || kind === 'net'))) && DOCK_3D[kind]) { DOCK_3D[kind](x, z, h, kind, { add, trim, open, edge: edgeOf(open, x, z) }); continue; }
    // (the reliquary is the palace's piece, but the Sister's Cabin keeps one in the Grace's chapel locker, on the hulk kit;
    // and a hulk's cabins (Livia's there, the Gull Isles' wardroom and great cabin) take the palace's writing tables and
    // papers, not the clerk's voxel desk, whose own light burned out to a blob in the lit hulk:
    // docs/art-critic-pass-tidemark-step7.md. The rest stay the palace's)
    if (inside && (look.palace || kind === 'reliquary' || (look === KIT_LOOK.hulk && HULK_LENT.has(kind))) && PALACE_3D[kind]) { const c = w.level.cells.get(k); PALACE_3D[kind](x, z, h, kind, { add, drop, wall: wallOf(open, W, D, x, z), trim, open, X, room: c && c.room >= 0 ? w.level.rooms[c.room] : null }); continue; }
    // (a hulk's lower deck, the Sister's Cabin's children's deck and the Gull Isles' gun deck: the sim's bunks hung as
    // hammocks, along the wall they stand by; world.js buildTavern 'hammock')
    if (inside && look === KIT_LOOK.hulk && kind === 'bunk') { const wl = wallOf(open, W, D, x, z); trim.push({ k: 'hammock', x, z, n: wl && wl.side !== 'n' ? 'x' : 'z', seed: h % 997 }); continue; }
    // (the Vale's stone: a barrow's niches, biers and standing stones, the keep's piers and posts, the great hall's
    // hearth, trestles and fire baskets as the inn's: BARROW_3D, KEEP_3D, TAVERN_3D)
    const pl = trim && !inside ? roomLook(w.level.cells.get(k)) : null;
    if (pl?.barrow && BARROW_3D[kind]) { const c = w.level.cells.get(k); if (BARROW_3D[kind](x, z, h, kind, { trim, wall: wallOf(open, W, D, x, z), room: c && c.room >= 0 ? w.level.rooms[c.room] : null }) !== false) continue; }
    if (pl?.whole && KEEP_3D[kind]) { KEEP_3D[kind](x, z, h, kind, { trim, look: pl }); continue; }
    if (pl?.whole && pl.wall === 'Ø' && kind === 'brazier') { add({ type: 'fire', x, z, opts: { kind: 'brazier', size: 1.0, smoke: false, light: true, intensity: 4, distance: 6, seed: h % 997 } }); continue; }   // (the hall's fire baskets out on its floor, seen whole: the inn's by a wall)
    if (pl?.whole && pl.wall === 'Ø' && TAVERN_3D[kind]) { const c = w.level.cells.get(k); TAVERN_3D[kind](x, z, h, kind, { add, drop, wall: wallOf(open, W, D, x, z), trim, open, room: c && c.room >= 0 ? w.level.rooms[c.room] : null }); continue; }
    if (inside && TAVERN_3D[kind]) { const c = w.level.cells.get(k); TAVERN_3D[kind](x, z, h, kind, { add, drop, wall: wallOf(open, W, D, x, z), trim, open, room: c && c.room >= 0 ? w.level.rooms[c.room] : null }); continue; }
    if (DRESS_3D[kind]) add(DRESS_3D[kind](x, z, h, kind));
    else sprites.push({ prop: kind, tx, ty, x, z, ...(FLAT.has(kind) ? { flat: true } : {}) });
    for (const ob of DRESS_3D_MORE[kind] ? DRESS_3D_MORE[kind](x, z) : []) add(ob);
    if (kind === 'shaft') {                                         // the Crossing's daylight: a cold beam from the fallen tower, dust in it
      add({ type: 'light', x, z, dy: 2.6, color: '#e4ecff', intensity: 48, distance: 6.5, flicker: 0, nightOnly: false });   // (a tight hard pool: at 16 over 8 the cold light was lost on the blue stone)
      add({ type: 'emitter', x, z, preset: 'dust', size: [2.4, 5, 2.4], dy: 2.5, count: 26 });
      continue;
    }
    if (kind === 'torch') { add({ type: 'wallTorch', x, z, rotation: 0, dy: 1.15, opts: { embers: true } }); continue; }   // (a real flame on our pole: its own light)
    const lit = PROP_LIGHT[kind], pool = DOOR_POOL[kind] || [3.2, 4.5];
    if (lit && kind !== 'brazier' && kind !== 'cookfire') add({ type: 'light', x, z, dy: kind === 'candelabra' ? 1.7 : 0.9, color: hex(lit), intensity: pool[0], distance: pool[1], flicker: 0.15, nightOnly: false });
  }
  if (magma.length) magmaFlow(magma, X, Z, add, sprites);
  if (wet && wet.sheets.length) { const lamps = wetLamps(objects, wet.sheets); for (const sh of wet.sheets) sh.lamps = lamps; }
  if (rails.size) mine.push(...railRuns(rails, X, Z));
  if (mine.length) sprites.push({ tavern: { pieces: mine } });
  if (ptrim) { if (passIce.length) ptrim.push({ k: 'pool', cells: passIce }); sprites.push({ pass: { pieces: ptrim } }); }
  const level = frame({ name: w.siteName || 'The Old Barrows', W, D, tiles, heights, objects, spawn: { x: X(sp.x), z: Z(sp.y), facing: 'up' },
    // (black beyond the walls, as Emberlit's: a backdrop colour, which the fog takes too, so the far rooms fade to it)
    environment: look.forest ? { timeOfDay: look.hour, border: 'none', outerScenery: false, godRays: false, interior: false, dust: true, greenwood: true, backdrop: look.backdrop }   // (open air, the air ours: world.js greenwoodAir; past the edges the mist and the gloom, not Luminati's outer woods: round 1, its bright autumn clumps stood at the frame's foot)
      : { timeOfDay: look.hour, border: 'none', outerScenery: false, godRays: false, interior: !look.open, backdrop: look.backdrop || '#040306', ...(look.water ? { harbour: true } : {}), ...(look.pass ? { pass: true } : {}), ...(wet ? { wet: wetLook.wet } : {}), ...(coast ? { coast: true } : {}) },   // (open: the pass, under the sky)
    // (a channel's water still, its own colours: world.js wetAir)
    water: look.water ? { flow: [0.03, 0.05], reflect: 0.45, neutral: 0.7 } : wet && wet.deep ? { flow: [0.01, 0.02], reflect: 0.12, neutral: 0.5 } : coast ? COAST_WATER : null, waterLevel: look.water || coast ? DOCK_WL : wet && wet.deep ? WET_WL : 0.4 });   // (a harbour's water nearly still, the fog's colour in it: world.js harbourAir)
  if (look.vents) vents(W, D, heights, open, add, look.vents);   // (the vault's and the deep forges' ember beds)
  const amb = ambientOf(kit || gen?.kit || (AMB_TINT[w.theme] ? w.theme : kit));
  return { level, sprites, ambient: amb, ...(look.held != null ? { hour: look.held } : {}), origin: { x: x0, y: y0 }, stats: { ...count, ours: sprites.length, size: W * 1000 + D, ...(wet ? { deep: wet.deep, deepPartial: wet.partial, shallow: wet.sheets.reduce((n, q) => n + q.cells.length / 4, 0) } : {}) } };   // (hour: a look's held hour, the pass's day: hybrid.js)
}

// ── water indoors (docs/water-indoors.md; docs/dungeon-looks-plan.md items 3–5) ──────────────────────────────────────────
// One way of drawing water inside walls, for any kit with `wet` (KIT_LOOK):
//   · shin-deep water over a floor: the sim's pools (world.pools: a room's `pools`, or its whole floor with `flood`),
//     walked in. A sheet a hand over the floor (world.js buildShallows), the floor seen through it, rippling, the lamps'
//     light broken on it, its edge soft; every figure's feet a little under it, the rings and warnings drawn over it.
//   · deep water: the sim's `channel` (blocked, as the magma is), and its `lockgate` and `sluice` bands. A tile of
//     Luminati's whose four of ours are all of it is sunk to the bed and Luminati's own water laid over it, under the floor
//     (WET_WL); the floor beside it takes its kit's `bank` (its walling down into the water), a coping kerb along the edge;
//     the sim's bridges (world.bridges) the wharf's plank decks across it, railed; a lock gate's leaves and a sluice's
//     board and winch wheel stood in it.
// Nothing here touches the sim; every choice is the tile's, so a floor looks the same every visit.
const WET_PROPS = new Set(['channel', 'lockgate', 'sluice']);
const STAIR_TILE = /[\^v<>]/;
/** the garth's light: the sky's, cold, from high over the open roof */
const GARTH_SKY = { color: '#a8bcdc', intensity: 7, distance: 13, dy: 5 };
function wetGround(w, { x0, y0, W, D, X, Z, tiles, heights, looks, roomLook }) {
  const L = w.level, cells = L.cells, props = w.props, bridges = w.bridges || new Set(), trim = [], lights = [];
  const SUB = [[0, 0], [1, 0], [0, 1], [1, 1]], subOf = (i, j) => SUB.map(([dx, dy]) => `${x0 + 2 * i + dx},${y0 + 2 * j + dy}`);
  const deepAt = new Uint8Array(W * D), piece = new Array(W * D).fill(null), isBridge = new Uint8Array(W * D);
  let deep = 0, partial = 0;
  for (let j = 0; j < D; j++) for (let i = 0; i < W; i++) {
    if (heights[j][i] !== '2' || STAIR_TILE.test(tiles[j][i])) continue;
    const ks = subOf(i, j), kinds = ks.map((k) => props.get(k));
    const n = kinds.filter((k) => WET_PROPS.has(k)).length;
    if (n === 4) { deepAt[j * W + i] = 1; piece[j * W + i] = kinds.find((k) => k !== 'channel') || null; tiles[j][i] = 'γ'; heights[j][i] = '0'; deep++; }
    else if (n) partial++;
    else if (ks.filter((k) => bridges.has(k)).length >= 2) { isBridge[j * W + i] = 1; tiles[j][i] = '_'; }
  }
  const D4 = /** @type {[number, number, string][]} */ ([[0, -1, 'n'], [1, 0, 'e'], [0, 1, 's'], [-1, 0, 'w']]), dAt = (i, j) => i >= 0 && j >= 0 && i < W && j < D && deepAt[j * W + i] === 1;
  const floorAt = (i, j) => i >= 0 && j >= 0 && i < W && j < D && heights[j][i] === '2' && !STAIR_TILE.test(tiles[j][i]);
  // a near wall (between the camera and the water: south or east of it) cut to the floor's height, a quay's edge, so the
  // channel and its gates are seen over it (round 1: at the ruin's three to five it hid all but a sliver of the Lock Gate's)
  for (let j = 0; j < D; j++) for (let i = 0; i < W; i++) {
    // (its water beside it, or a step of floor away: a channel's rows begin on an even tile, so one of ours may lie between)
    const h = parseInt(heights[j][i], 36); if (!(h > 2) || !(dAt(i, j - 1) || dAt(i - 1, j) || dAt(i - 1, j - 1) || (floorAt(i, j - 1) && dAt(i, j - 2)) || (floorAt(i - 1, j) && dAt(i - 2, j)))) continue;
    if (dAt(i, j + 1) || dAt(i + 1, j)) continue;   // (a wall with water on its far side too: between two channels, left)
    if (floorAt(i, j + 1) || floorAt(i + 1, j)) continue;   // (one with the room on its camera side is a back wall)
    heights[j][i] = '2';   // (round 3: knee-high still hid the water behind it, a sliver at the camera's angle: flush, a quay's edge)
  }
  // the banks: a floor tile beside the water takes its kit's walling down into it
  for (let j = 0; j < D; j++) for (let i = 0; i < W; i++) {
    if (!floorAt(i, j) || isBridge[j * W + i] || !D4.some(([di, dj]) => dAt(i + di, j + dj))) continue;
    const lk = looks[j * W + i]; if (lk && lk.bank) tiles[j][i] = lk.bank;
  }
  // the kerbs along the banks and the rails along the bridges' open sides, in runs along each edge line
  const lines = new Map(), push = (key, t) => (lines.get(key) || lines.set(key, []).get(key)).push(t);
  for (let j = 0; j < D; j++) for (let i = 0; i < W; i++) {
    if (!dAt(i, j)) continue;
    for (const [di, dj, s] of D4) {
      const ii = i + di, jj = j + dj;
      // (the far side, north or west, whatever stands there: the wall or the bank reflected in the water under it)
      if ((s === 'n' || s === 'w') && !dAt(ii, jj)) { if (s === 'n') push(`wrefl|z|${j}|-1`, i); else push(`wrefl|x|${i}|-1`, j); }
      if (!floorAt(ii, jj)) continue;
      const kind = isBridge[jj * W + ii] ? 'wrail' : 'wkerb';
      // keyed by the edge line and which way the bank lies (out: from the water toward it)
      if (s === 'n') push(`${kind}|z|${j}|-1`, i); else if (s === 's') push(`${kind}|z|${j + 1}|1`, i); else if (s === 'w') push(`${kind}|x|${i}|-1`, j); else push(`${kind}|x|${i + 1}|1`, j);
    }
  }
  for (const [key, ts] of lines) {
    ts.sort((a, b) => a - b);
    const [k, n, c0, o] = key.split('|'), c = +c0, out = +o, P = (t) => (n === 'z' ? [t, c] : [c, t]);
    const runs = []; for (const t of ts) { const r = runs[runs.length - 1]; if (r && t === r[1]) r[1] = t + 1; else runs.push([t, t + 1]); }
    for (const [a, b] of runs) { const [ax, az] = P(a), [bx, bz] = P(b); trim.push({ k, x0: ax, z0: az, x1: bx, z1: bz, n, out, seed: hash('wk', key, a) % 997 }); }
  }
  // the lock gates and the sluice boards: each band of them across its channel, one piece
  const seen = new Uint8Array(W * D);
  for (let j = 0; j < D; j++) for (let i = 0; i < W; i++) {
    const kd = piece[j * W + i]; if (!kd || seen[j * W + i]) continue;
    const grp = [], q = [[i, j]]; seen[j * W + i] = 1;
    while (q.length) { const [a, b] = q.pop(); grp.push([a, b]); for (const [da, db] of D4) { const aa = a + da, bb = b + db; if (aa >= 0 && bb >= 0 && aa < W && bb < D && !seen[bb * W + aa] && piece[bb * W + aa] === kd) { seen[bb * W + aa] = 1; q.push([aa, bb]); } } }
    const xs = grp.map((g) => g[0]), zs = grp.map((g) => g[1]), ix0 = Math.min(...xs), ix1 = Math.max(...xs) + 1, iz0 = Math.min(...zs), iz1 = Math.max(...zs) + 1;
    const across = ix1 - ix0 >= iz1 - iz0 ? 'x' : 'z';   // (the band spans the channel: its long side)
    // (which ends of it meet a bank, not a wall: a lock gate's balance beam lies out over a bank)
    const ends = across === 'x' ? [floorAt(ix0 - 1, iz0), floorAt(ix1, iz0)] : [floorAt(ix0, iz0 - 1), floorAt(ix0, iz1)];
    trim.push({ k: kd, x: r2((ix0 + ix1) / 2), z: r2((iz0 + iz1) / 2), across, span: across === 'x' ? ix1 - ix0 : iz1 - iz0, ends, seed: hash('wg', i, j) % 997 });
  }
  // the shin-deep water: the sim's pools, by the room's water, a sim tile a cell (a garth's open to the sky)
  // (each cell's corners that touch dry floor, NW NE SE SW as bits 1–4 over the sky's bit 0: there its edge goes soft;
  // against a wall or a channel the water runs right up to it)
  const sheets = new Map(), pools = w.pools || new Set();
  const dry = (x, y) => { const k = `${x},${y}`, c = cells.get(k); return !!c && c.kind === 'floor' && !pools.has(k) && !WET_PROPS.has(props.get(k) || ''); };
  const isFloorCell = (x, y) => { const c = cells.get(`${x},${y}`); return !!c && c.kind === 'floor'; };
  const CORNERS = [[[-1, 0], [0, -1], [-1, -1]], [[1, 0], [0, -1], [1, -1]], [[1, 0], [0, 1], [1, 1]], [[-1, 0], [0, 1], [-1, 1]]];
  for (const k of pools) {
    const c = cells.get(k); if (!c || c.kind !== 'floor') continue;
    const lk = roomLook(c); if (!lk || !lk.wet) continue;
    const ci = k.indexOf(','), tx = +k.slice(0, ci), ty = +k.slice(ci + 1), i = Math.floor((tx - x0) / 2), j = Math.floor((ty - y0) / 2);
    if (!floorAt(i, j) || isBridge[j * W + i]) continue;   // (never over a stair, the well or a bridge)
    const room = c.room >= 0 ? L.rooms[c.room] : null, sky = room && room.dress && room.dress.includes('garth') ? 1 : 0;
    const s = sheets.get(lk.wet) || sheets.set(lk.wet, { look: lk.wet, cells: [] }).get(lk.wet);
    // (bits 1–4 its corners on dry floor, 5–8 those against a wall: a bright line at both; round 5)
    let f = sky; CORNERS.forEach((cs, q) => { if (cs.some(([dx, dy]) => dry(tx + dx, ty + dy))) f |= 2 << q; if (cs.some(([dx, dy]) => !isFloorCell(tx + dx, ty + dy))) f |= 32 << q; });
    // (how near the wall behind it, away from the camera: the wall's reflection lies on the water in front of it)
    let refl = 0; for (const [dx, dy] of [[-1, 0], [0, -1]]) for (let d = 1; d <= 6; d++) if (!isFloorCell(tx + dx * d, ty + dy * d)) { refl = Math.max(refl, 1 - (d - 1) / 6); break; }
    s.cells.push(X(tx + 0.5), Z(ty + 0.5), f, r2(refl));
  }
  // (a garth open to the sky: its light, and a drizzle falling into it alone, the one room with no roof over it)
  if (L.plan) for (const r of L.rooms) if (r.dress && r.dress.includes('garth')) {
    lights.push({ type: 'light', x: X(r.cx + 0.5), z: Z(r.cy + 0.5), dy: GARTH_SKY.dy, color: GARTH_SKY.color, intensity: GARTH_SKY.intensity, distance: GARTH_SKY.distance, flicker: 0, nightOnly: false });
    lights.push({ type: 'emitter', x: X(r.cx + 0.5), z: Z(r.cy + 0.5), preset: 'rain', dy: 3.5, size: [r2(r.rw), 7, r2(r.rh)], count: 260, params: { followCamera: false, bounds: [r2(r.rw), 7, r2(r.rh)], alpha: 0.32, velocity: [0, -9, 0] } });
  }
  // (a drowned hall's windows, on its back wall, the garth's side: a cold light high up, dust in it, caught on the water;
  // round 5, the dorter and the chapter-house read as dark empty halls)
  if (L.plan) for (const r of L.rooms) if (r.dress && r.dress.includes('windows')) {
    const along = r.x1 - r.x0 >= r.y1 - r.y0;
    for (const sg of [-1, 1]) {
      const x = along ? X(r.cx + sg * r.rw * 0.4 + 0.5) : X(r.x0 + 2.5), z = along ? Z(r.y0 + 2.5) : Z(r.cy + sg * r.rh * 0.4 + 0.5);
      lights.push({ type: 'light', x, z, dy: WINDOW_LIGHT.dy, color: WINDOW_LIGHT.color, intensity: WINDOW_LIGHT.intensity, distance: WINDOW_LIGHT.distance, flicker: 0, nightOnly: false });
      lights.push({ type: 'emitter', x, z: r2(z + 0.8), preset: 'dust', dy: 1.8, size: [1.3, 3.4, 1.3], count: 16, params: { color: '#d4e2ff' } });
    }
  }
  return { trim, sheets: [...sheets.values()], lights, deep, partial };
}
/** a drowned hall's window light (`windows`), cold, from high on its back wall */
const WINDOW_LIGHT = { color: '#a8bfe8', intensity: 6, distance: 9.5, dy: 3.4 };
/** the lamps a sheet of water shows: every light near it, its height over the floor, colour and strength (world.js
 *  buildShallows lays a soft warm streak under each, toward the camera, where its reflection falls) */
function wetLamps(objects, sheets) {
  const near = new Set(); for (const sh of sheets) for (let k = 0; k < sh.cells.length; k += 4) near.add(`${Math.floor(sh.cells[k])},${Math.floor(sh.cells[k + 1])}`);
  const close = (x, z) => { for (let dz = -5; dz <= 5; dz++) for (let dx = -5; dx <= 5; dx++) if (near.has(`${Math.floor(x) + dx},${Math.floor(z) + dz}`)) return true; return false; };
  const out = [];
  for (const o of objects) {
    if (o.onWall) continue;
    const L = o.type === 'light' ? [o.dy ?? 1, o.color, o.intensity] : o.type === 'wallTorch' ? [o.dy ?? 1.4, '#ffa850', 4] : o.type === 'fire' && o.opts?.light ? [0.9, '#ff9a48', 5] : null;
    if (L && close(o.x, o.z)) out.push({ x: o.x, z: o.z, h: L[0], color: L[1], i: Math.min(8, L[2]) });
  }
  return out.sort((a, b) => b.i - a.i).slice(0, 24);
}

/** the Cold Seam's rails (sim/world.js 'rail', a tile of ours each) as runs along x or y, for world.js 'rails' @returns {any[]} */
function railRuns(rails, X, Z) {
  const out = [], seen = new Set(), at = (k) => k.split(',').map(Number);
  for (const k of [...rails].sort((a, b) => { const [ax, ay] = at(a), [bx, by] = at(b); return ay - by || ax - bx; })) {
    if (seen.has(k)) continue;
    const [x, y] = at(k), horiz = rails.has(`${x + 1},${y}`) || !rails.has(`${x},${y + 1}`);
    let n = 0; while (rails.has(horiz ? `${x + n},${y}` : `${x},${y + n}`)) { seen.add(horiz ? `${x + n},${y}` : `${x},${y + n}`); n++; }
    out.push(horiz ? { k: 'rails', x0: X(x), z0: Z(y + 0.5), x1: X(x + n), z1: Z(y + 0.5) } : { k: 'rails', x0: X(x + 0.5), z0: Z(y), x1: X(x + 0.5), z1: Z(y + n) });
  }
  return out;
}
/** ember beds along a hot floor's walls (KIT_LOOK `vents`): on a floor tile against a wall, never a corridor's or a
 *  doorway's, spread by a hash; a glow and a wisp, no light of their own (Luminati shares twelve, the braziers need them) */
function vents(W, D, heights, open, add, max) {
  let n = 0;
  for (let j = 1; j < D - 1 && n < max; j++) for (let i = 1; i < W - 1 && n < max; i++) {
    if (heights[j][i] !== '2' || hash('vt', i, j) % 37) continue;
    const wl = (di, dj) => !open(i + di, j + dj), e = wl(1, 0), w_ = wl(-1, 0), s = wl(0, 1), nn = wl(0, -1);
    if ((e && w_) || (s && nn) || !(e || w_ || s || nn)) continue;
    add({ type: 'fire', x: r2(i + 0.5), z: r2(j + 0.5), opts: { kind: 'embers', size: r2(0.35 + (hash('vz', i, j) % 4) * 0.06), smoke: hash('vs', i, j) % 3 === 0, light: false, seed: hash('vf', i, j) % 997 } });
    n++;
  }
}

// ── the Bowl: the Quarry Ring (the owner chose B of three, docs/bowl-arena-proposal.md §12; world doc v1.46 §3.9) ──────
// The sim's one oval of sand (plans.js bowl), drawn as the bottom of an old sandstone quarry open to the sky: three
// ledges of banded rock stepping back and up behind it (sandstone, red rock, sandstone, where the crowd sits), the rim
// in dry grass and juniper, a timber fence round the sand, pennants strung over the ledges and the Sun's Box, a striped
// awning, on the far side. Lit as a bright day (hybrid.js holds the hour). As the level-design rules ask (§1.1), the half
// between the camera and the sand (the sim's +x +y) is cut low: a lip of scree and a few boulders, nothing that stands in
// front of a fight. The stair up (world.js placeStairsUp) climbs into the north face under its arch: the haul-ramp, the
// Dust Gate, the way back out.
export const ARENA_HOUR = 11.2;
/** @type {[number, number, string][]} */
const LEDGES = [[2, 3, 'Y'], [8, 7, 'Y'], [14, 12, 'X'], [20, 17, 'Y']];   // [from this far past the sand's edge (tiles), height (a level half a metre: steps of 2–2.5 m, as the spike's), tile]
/** @param {any} w @param {{ stairs?: string }} [o] */
function arena(w, o = {}) {
  const L = w.level, r = L.descentRoom, cells = L.cells;
  const A = (r.x1 - r.x0 + 1) / 2, B = (r.y1 - r.y0 + 1) / 2, cx = (r.x0 + r.x1 + 1) / 2, cy = (r.y0 + r.y1 + 1) / 2, avg = (A + B) / 2;
  const { x0, y0, W, D } = crop(r.x0 - 30, r.y0 - 28, r.x1 + 31, r.y1 + 29, cx, cy);
  const X = (x) => r2((x - x0) / 2), Z = (y) => r2((y - y0) / 2);
  // where a point stands: how far past the sand's edge (tiles), and how near the camera's side (0 the far and the
  // flanks, 1 straight toward the camera)
  const at = (x, y) => { const u = (x - cx) / A, v = (y - cy) / B, p = Math.hypot(u, v) || 1e-6; return { past: (p - 1) * avg, near: Math.max(0, (u + v) / p / Math.SQRT2), u: u / p, v: v / p }; };
  const smooth = (a, b, t) => { const k = clamp((t - a) / (b - a), 0, 1); return k * k * (3 - 2 * k); };
  const tiles = grid(W, D, 'a'), heights = grid(W, D, String(FLOOR));
  for (let j = 0; j < D; j++) for (let i = 0; i < W; i++) {
    let floor = false;
    for (const [dx, dy] of [[0, 0], [1, 0], [0, 1], [1, 1]]) { const c = cells.get(`${x0 + 2 * i + dx},${y0 + 2 * j + dy}`); if (c && c.kind === 'floor') floor = true; }
    if (floor) { tiles[j][i] = 's'; heights[j][i] = String(FLOOR); continue; }
    const P = at(x0 + 2 * i + 1, y0 + 2 * j + 1), h0 = hash('q', i, j), past = P.past + ((h0 % 7) - 3) * 0.35;   // (a rough edge to each ledge: quarried, not turned)
    let far = 19, ch = h0 % 3 ? 'y' : 'a';                    // the rim: dry grass and bare earth
    for (const [from, h, t] of LEDGES) if (past >= from) { far = h; ch = t; } else break;
    if (past < LEDGES[0][0]) { far = 3; ch = 'Y'; }
    if (past >= LEDGES[3][0] + 6) { far = 19; ch = h0 % 3 ? 'y' : 'a'; }
    const k = smooth(0.22, 0.5, P.near), nearH = past < 2 ? 3 : 2, h = Math.round(far + (nearH - far) * k);
    tiles[j][i] = k > 0.5 ? (past < 2 ? 'q' : h0 % 4 ? 'a' : 'y') : ch; heights[j][i] = h.toString(36);
  }
  const stairLights = stairs(w, x0, y0, W, D, tiles, heights, o.stairs !== 'plain');
  const objects = [], count = {}, sprites = [];
  const add = (ob) => { count[ob.type] = (count[ob.type] || 0) + 1; objects.push({ id: `${ob.type}_${count[ob.type]}`, ...ob }); };
  for (const a of stairLights.arches || []) sprites.push({ arch: { ...a, stone: 'sandstone_brick' } });
  for (const l of stairLights) if (l.glow) add({ type: 'light', x: X(l.x), z: Z(l.y), dy: l.dy, color: l.glow.color, intensity: l.glow.intensity, distance: l.glow.distance, flicker: 0.08, nightOnly: false });
  const pt = (t, past) => { const k = 1 + past / avg; return { x: cx + Math.cos(t) * A * k, y: cy + Math.sin(t) * B * k }; };
  const gate = (t) => Math.abs(Math.atan2(Math.sin(t + Math.PI / 2), Math.cos(t + Math.PI / 2))) < 0.2;   // (the north face's gap: the stair)
  // the fence: posts and two rails round the sand's edge, a step in from it
  const N = 36;
  for (let n = 0; n < N; n++) {
    const t0 = (n / N) * Math.PI * 2, t1 = ((n + 1) / N) * Math.PI * 2; if (gate((t0 + t1) / 2)) continue;
    const a = pt(t0, -0.9), b = pt(t1, -0.9);
    add({ type: 'fence', x0: X(a.x), z0: Z(a.y), x1: X(b.x), z1: Z(b.y), opts: {} });
  }
  // the far side, where the eye goes: pennants strung along the ledges, the Sun's Box on the second, juniper on the rim
  for (const [ta, tb, past] of [[-2.9, -2.2, 9.5], [-2.0, -1.75, 9.5], [-1.4, -0.7, 9.5], [-2.6, -1.9, 15.5], [-1.2, -0.5, 15.5]]) {
    const a = pt(ta, past), b = pt(tb, past);
    add({ type: 'garland', x0: X(a.x), z0: Z(a.y), x1: X(b.x), z1: Z(b.y), opts: { kind: 'pennants', sag: 0.5, posts: true, seed: (hash('g', ta) % 97) + 1 } });
  }
  { const t = -Math.PI * 0.75, b = pt(t, 11), d = at(b.x, b.y);
    add({ type: 'marketStall', x: X(b.x), z: Z(b.y), rotation: r2(Math.atan2(-d.u, -d.v)), opts: { cloth: 'cloth_stripe', width: 3, crates: 'none', seed: 4 } }); }
  for (let n = 0; n < 14; n++) {
    const t = -Math.PI * 0.98 + (n / 13) * Math.PI * 1.1 + ((hash('j', n) % 10) - 5) * 0.02, b = pt(t, 24 + (hash('jr', n) % 5)), d = at(b.x, b.y);
    if (d.near > 0.2) continue;
    add({ type: 'tree', x: X(b.x), z: Z(b.y), collider: false, opts: { kind: n % 4 === 3 ? 'deadwood' : 'juniper', height: r2(2.6 + (hash('jh', n) % 10) * 0.12), seed: hash('js', n) % 997 } });
  }
  // the near lip: a few boulders and the quarry's leavings, all low
  for (let n = 0; n < 9; n++) {
    const t = Math.PI * 0.25 + ((n - 4) / 4) * 0.9, b = pt(t, 3 + (hash('b', n) % 6)), hh = hash('bh', n);
    add(n % 3 === 1 ? { type: 'debris', x: X(b.x), z: Z(b.y), rotation: (hh % 11) * 0.5, opts: { kind: 'rubble', size: 0.6, charred: false, seed: hh % 997 } }
      : { type: 'rock', x: X(b.x), z: Z(b.y), opts: { size: r2(0.6 + (hh % 5) * 0.12), stone: 'sandstone', seed: hh % 97 } });
  }
  { const g = pt(-Math.PI / 2, 1.5);                         // crates by the gate, the day's water and the rakes
    for (const s of [-1, 1]) add({ type: 'crateStack', x: r2(X(g.x) + s * 2.4), z: r2(Z(g.y) + 0.6), rotation: 0.3 * s, opts: { count: 2, size: 0.7, seed: 7 + s } }); }
  const sp = w.spawn || { x: cx, y: cy };
  const level = frame({ name: w.siteName || 'The Bowl', W, D, tiles, heights, objects, spawn: { x: X(sp.x), z: Z(sp.y), facing: 'up' },
    environment: { timeOfDay: ARENA_HOUR, border: 'none', outerScenery: true, godRays: true, interior: false, climate: 'arid' } });
  return { level, sprites, origin: { x: x0, y: y0 }, stats: { ...count, ours: sprites.length, size: W * 1000 + D } };
}

