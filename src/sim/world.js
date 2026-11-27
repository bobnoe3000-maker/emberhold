// world.js — the world is now a single generated DUNGEON LEVEL (see level.js):
// a themed graph of rooms + corridors, ringed by high walls, floating in the
// abyss. Terrain is a lookup into that level rather than an infinite field, but
// the renderer- and sim-facing API is unchanged: heightAt / materialAt /
// isWalkable / resourceAt / propAt are still pure functions of (world, x, y),
// and the whole level is a pure function of (seed, theme) so saves reproduce it.

import { hash2, fbm, streamSeed, mulberry32, STREAM } from './rng.js';
import { generateLevel, THEME_KEYS, FLOOR_Z, WALL_Z } from './level.js';
import { oHeightAt, oMaterialAt, oIsWalkable } from './outdoor.js';
import { hypot, atan2, sin, cos } from './detmath.js';
import { siteOf, roomLevelAt, hasFloorBelow, themeAt, familyAt, dressAt, planFloor } from './sites.js';
import { mayPlace, REPEAT as REPEAT_CAPPED, LIGHT } from './dresscaps.js';
import { mouths, againstWall, stairZone, STAIR_OWN } from './keepclear.js';

export const CHUNK = 32;
export const TILE = 16;

// Material classification. Renderer maps each to a palette ramp + emissive rule.
export const MAT = {
  ABYSS: 'abyss', WATER: 'water', SOIL: 'soil', FLESH: 'flesh', BONE: 'bone',
  POISON: 'poison', SAND: 'sand', BASALT: 'basalt', LAVA: 'lava', EMBER: 'ember', CHASM: 'chasm', OBSID: 'obsid',
};
// Materials you cannot stand on (hazard pools, void, and open water).
export const NONWALK = new Set([MAT.ABYSS, MAT.WATER, MAT.POISON, MAT.LAVA, MAT.EMBER]);

const clampi = (v, a, b) => (v < a ? a : v > b ? b : v);
const K = (x, y) => x + ',' + y;

// site (sites.js): which dungeon this is — its look, its rooms, its levels and whether a floor
// goes on down. A floor can have its own look and foes (sites.js themes, families: the Keep's cellars are a cave).
export const CHEST_KEEP = 0.35;
// The dressing kits (v1.48; sites.js `dress`, floor by floor): what a dungeon floor is furnished with, so a crypt reads
// as a crypt and a cave as a cave (the owner, 2026-10-10). Each names its rooms' layouts (one drawn per fighting room,
// below), the decor it stands against the walls, and its standing water: `pools`, the number of shallow pools a room
// may have (walkable: world.pools, painted by the renderer; no impassable pools in rooms, v1.29) and `pool`, how the
// water looks; `obstacles`, what stands out on a room's floor (below). The light's tint is the renderer's
// (renderer.js KIT_TINT). A floor with no kit is dressed by its family, as before.
/** @type {Record<string, { rooms: string[], decor: string[], obstacles: string[], pools?: number, pool?: string }>} */
export const DRESS = {
  dig:      { rooms: ['dig', 'camp', 'dig'], decor: ['spoil', 'lantern', 'crates'], obstacles: ['pillar', 'brokenpillar', 'spoil'] },                       // the Barrow Mouth: the Redhand's dig
  gallery:  { rooms: ['gallery', 'crypt', 'gallery'], decor: ['urns', 'candles', 'bones'], obstacles: ['pillar', 'pillar', 'sarcophagus'] },                // the Long Gallery: niches, the dead in rows
  muster:   { rooms: ['muster', 'colonnade', 'gallery'], decor: ['standard', 'urns', 'candles'], obstacles: ['pillar', 'standard', 'pillar'] },          // the Muster Hall: the legion racked
  bailey:   { rooms: ['bailey', 'storehouse', 'camp'], decor: ['banner', 'crates', 'barrels'], obstacles: ['gibbet', 'pillar', 'banner'] },            // the Keep's bailey: the Company's camp
  barracks: { rooms: ['barracks', 'storehouse', 'barracks'], decor: ['rack', 'banner', 'crates'], obstacles: ['pillar', 'pillar', 'rack'] },         // bunks, the armoury
  cellar:   { rooms: ['cave', 'cellar', 'cave'], decor: ['stalagmite', 'boulder', 'lantern'], obstacles: ['stalagmite', 'boulder', 'scaffold'], pools: 2, pool: 'still' },   // dug into a cave
  nave:     { rooms: ['nave', 'chancel', 'nave'], decor: ['candles', 'saint', 'urns'], obstacles: ['pillar', 'brokenpillar', 'saint'], pools: 2, pool: 'bog' },             // the drowned nave
  cultcut:  { rooms: ['cultcut', 'camp', 'cultcut'], decor: ['chains', 'candles', 'sacks'], obstacles: ['gibbet', 'chains', 'pillar'] },               // the Cult's dig
  binding:  { rooms: ['binding', 'crypt', 'binding'], decor: ['chains', 'candles', 'bones'], obstacles: ['bound', 'pillar', 'chains'] },              // where the legion was bound
  mound:    { rooms: ['mound', 'storehouse', 'cave'], decor: ['reeds', 'boat', 'barrels'], obstacles: ['reeds', 'boat', 'gibbet'], pools: 2, pool: 'mud' },         // the Toadking's island of boats
  locks:    { rooms: ['lockhall', 'storehouse', 'colonnade'], decor: ['windlass', 'barrels', 'chains'], obstacles: ['pillar', 'windlass', 'gibbet'], pools: 1, pool: 'bog' },
  vats:     { rooms: ['vats', 'ossuary', 'vats'], decor: ['vat', 'barrels', 'bones'], obstacles: ['vat', 'pillar', 'gibbet'], pools: 2, pool: 'poison' },           // Vat Seven
  abbey:    { rooms: ['nave', 'chancel', 'crypt'], decor: ['candles', 'urns', 'saint'], obstacles: ['pillar', 'brokenpillar', 'gibbet'], pools: 1, pool: 'bog' },
  // the Cinder Reach (v1.124): the Cold Seam's old pithead (timbered galleries, the winding gear, carts) and the warren
  // the goblins dug through into it (raw rock, their fires and their spoil)
  // (the owner, 2026-11-22: a dungeon inside a building, a tavern: plans.js shuttered_inn; its dressing at the rooms' edges)
  tavern:   { rooms: ['storehouse', 'barracks', 'storehouse'], decor: ['barrels', 'crates', 'lantern'], obstacles: ['pillar'] },   // (no barrels or crates as obstacles: they'd count as such in every kit's rooms (test/ways), and the inn stands none: PLAN_OB.tavern)
  tavern_cellar: { rooms: ['storehouse', 'storehouse', 'storehouse'], decor: ['barrels', 'crates', 'candles'], obstacles: ['pillar'] },   // (the inn's cellar: rough stone, candles in niches; convert.js)
  // (the owner, 2026-11-22: "do a similar dungeon style as the inside of a crypt": plans.js haddow_crypt, docs/crypt-dungeon.md)
  crypt:    { rooms: ['crypt', 'crypt', 'crypt'], decor: ['urns', 'candles', 'bones'], obstacles: ['pillar'] },
  ossuary:  { rooms: ['ossuary', 'ossuary', 'ossuary'], decor: ['bones', 'urns', 'candles'], obstacles: ['pillar'] },   // (its walls of the dead's bones: convert.js)
  // (the owner, 2026-11-23: "two new level dressing types, docks and harbor": plans.js old_eel_wharf, docs/docks-dungeon.md;
  // a wharf's decks over open water, no walls: what's past a deck's edge is the harbour, convert.js)
  docks:    { rooms: ['storehouse', 'storehouse', 'storehouse'], decor: ['barrels', 'crates', 'lantern'], obstacles: ['pillar'] },
  // (v1.150, docs/tidemark-plan.md) the Drowned Mole's second floor: the empire's stone moles at low water, weed to the tide
  // line, the hulls dragged up to break and never broken; the water all round (convert.js), as the wharf's
  mole:     { rooms: ['storehouse', 'storehouse', 'storehouse'], decor: ['barrels', 'chains', 'lantern'], obstacles: ['pillar'] },
  // (v1.151) the Gull Isles: the sea cave where the fleet hides its boats (the cellar's cave with the sea in it:
  // convert.js), and the hulks moored in its lagoon (a ship's inside, its decks and ribs: convert.js)
  seacave:  { rooms: ['cave', 'storehouse', 'cave'], decor: ['stalagmite', 'barrels', 'lantern'], obstacles: ['stalagmite', 'boulder'] },
  hulk:     { rooms: ['storehouse', 'storehouse', 'storehouse'], decor: ['barrels', 'crates', 'lantern'], obstacles: ['pillar'] },
  // (v1.154) Highmarch's second floor, the Seventh's Palace: the crypt kit's dressed stone and arcade, the tavern kit's
  // furniture, banners down the walls, and in the throne room a dais with the throne (convert.js)
  palace:   { rooms: ['crypt', 'storehouse', 'crypt'], decor: ['candelabra', 'banner', 'crates'], obstacles: ['pillar'] },
  // (the owner, 2026-11-23: "the reaches, high up on the ramparts": plans.js high_ramparts, docs/ramparts-dungeon.md; a
  // walled town's terraces high on its ramparts, the houses at their backs and a parapet over the drop at their fronts)
  ramparts: { rooms: ['storehouse', 'storehouse', 'storehouse'], decor: ['barrels', 'crates', 'torch'], obstacles: ['pillar'] },
  pithead:  { rooms: ['cellar', 'storehouse', 'cave'], decor: ['lantern', 'crates', 'sacks'], obstacles: ['boulder', 'spoil', 'stalagmite'], pools: 1, pool: 'still' },
  warren:   { rooms: ['cave', 'camp', 'cave'], decor: ['spoil', 'bones', 'sacks'], obstacles: ['stalagmite', 'boulder', 'spoil'] },
  // (v1.126) the Assay Yards (the yards and the counting house; the cellars and the quota office), the Forgehall (its
  // anvil hall; the deep forges), the Cinderworks (the works; the Magma Vault), the Ninth Vault's strongroom
  yards:    { rooms: ['storehouse', 'barracks', 'bailey'], decor: ['crates', 'barrels', 'lantern'], obstacles: ['pillar', 'spoil', 'brokenpillar'] },
  quota:    { rooms: ['cellar', 'storehouse', 'barracks'], decor: ['chains', 'barrels', 'lantern'], obstacles: ['pillar', 'pillar', 'brokenpillar'] },
  forge:    { rooms: ['muster', 'colonnade', 'storehouse'], decor: ['rack', 'chains', 'brazier'], obstacles: ['pillar', 'brokenpillar', 'spoil'] },
  deepforge:{ rooms: ['muster', 'binding', 'colonnade'], decor: ['chains', 'rack', 'brazier'], obstacles: ['pillar', 'bound', 'brokenpillar'] },
  works:    { rooms: ['storehouse', 'camp', 'barracks'], decor: ['crates', 'sacks', 'chains'], obstacles: ['pillar', 'spoil', 'gibbet'] },
  vault:    { rooms: ['cave', 'binding', 'cave'], decor: ['chains', 'brazier', 'bones'], obstacles: ['stalagmite', 'boulder', 'spoil'] },
  // (obstacles stand: never a decor piece, crates or a rack, which the room rule would count in every kit's rooms)
  strongroom: { rooms: ['muster', 'storehouse', 'muster'], decor: ['urns', 'candles', 'crates'], obstacles: ['pillar', 'pillar', 'brokenpillar'] },
  // (2026-11-27, docs/greenwood-dungeon.md: the Root Granary's way in) a wood under its canopy, open air: no walls, the
  // trunks and root-banks round each glade are the renderer's (convert.js); mossed boulders and the empire's fallen stone
  greenwood: { rooms: ['storehouse', 'storehouse', 'storehouse'], decor: ['boulder', 'brokenpillar', 'lantern'], obstacles: ['boulder'] },
};
// An authored room (plans.js), dressed for what it was (the dressing pass: docs/vale-dungeon-dressing.md). Its plan's
// `dress` names the pieces; each name is a small recipe here, placed by the room's own axes: u along its length, v
// across it, v < 0 the back wall (north or west: the walls the camera sees, where the tall pieces stand) and v > 0 the
// near wall (cut to stubs toward the camera: only low pieces, or they'd stand between the camera and the fight). The
// middle is kept open for the fight; the pieces go in the thirds and at the walls, a focal piece on the room's axis.
// A piece that runs along a wall comes in two (`<kind>` along x, `<kind>_y` along y: gsprite.js), picked by the wall it's
// on. A big piece's footprint past its own tile is `block` (stands in the way, draws nothing).
const ORIENT = new Set(['tomb', 'pew', 'longtable', 'tbench', 'rack', 'urnshelf', 'standard', 'banner', 'scaffold', 'stall', 'trough', 'portcullis', 'iron_door', 'desk', 'shelf', 'shoring', 'hives', 'bench', 'fallen_door', 'bars', 'cask_rack', 'shoring_broken', 'clerk_desk']);
/** the pieces the dressing pass added (keepTheWaysOpen clears them like any decor when they shut a way) */
export const DRESS_PIECES = new Set(['tomb', 'great_tomb', 'mourner', 'offering', 'hearth', 'noticeboard', 'counter', 'longtable', 'tbench', 'logpile', 'stall', 'hay', 'trough', 'hen_cart', 'well', 'cart', 'portcullis', 'iron_door', 'desk', 'shelf', 'pit', 'ladder', 'shoring', 'hives', 'bench',
  'fallen_door', 'bars', 'strongbox', 'map_table', 'ledgers', 'stockade', 'guardian', 'sarcophagus_open', 'cask_rack', 'torch', 'candelabra', 'cookfire', 'block', 'crane', 'fishcrates', 'market_stall', 'oven',
  'throne', 'reliquary',
  'magma', 'furnace', 'anvil', 'crucible',   // (the Magma Vault's: the owner, 2026-11-26, "flowing magma and a few furnaces, anvils")
  'rail', 'cart_tipped', 'shoring_broken',   // (the Cold Seam's mine: docs/dungeon-looks-plan.md item 8)
  'clerk_desk',   // (the quota office's clerks' desks, in rows: item 9)
  'fallen_block',   // (the greenwood's: an ashlar block of the empire's, down in the moss; docs/greenwood-dungeon.md)
  ...[...ORIENT].map((k) => k + '_y')]);
// what lights a doorway, by the room's kit (a brazier each side, before, in every room: the screen was a field of
// identical fires; now the light says the place): the dig's lanterns on poles, the crypt's candles, the keep's and the
// barracks' torches, the cellars' lanterns, the chapel's candelabra, the cut's candles
/** the Breach's fallen columns (u, v as fractions of the room's half-length and half-width) */
const FALLEN = [[-0.4, 0.25], [0.25, -0.3]];   // (two columns down across the passage, one toward the dig's end, one toward the door: chosen among eight layouts against every gate of the balance contract and the room-level harness, docs/vale-dungeon-dressing.md)
/** how many of a piece a room holds at most (the owner, 2026-11-04: "Dont repeat or duplicate set pieces in a room,
 *  piece placement and counts should make sense"): a set piece once, a pair where the place has a pair (guardians either
 *  side of the stair, a camp's two cookfires, the porch's two doors), the rest by what the room would hold */
export const DRESS_CAP = { tomb: 6, great_tomb: 1, mourner: 2, offering: 1, hearth: 1, noticeboard: 1, counter: 1, longtable: 3, tbench: 6, logpile: 2, urns: 4, bones: 4, well: 1, hen_cart: 1, map_table: 1, stockade: 1, altar: 1, font: 1, shaft: 1, portcullis: 1, iron_door: 1, sarcophagus_open: 1, circle: 1, windlass: 2,
  ledgers: 1, rug: 1, coins: 2, papers: 2, boat: 3, vat: 6, guardian: 2, cookfire: 2, desk: 2, cart: 2, fallen_door: 2, hives: 2, bench: 2, standard: 2, banner: 2, hay: 3, tent: 3,
  crane: 1, fishcrates: 6, rope: 6, net: 3,   // (the wharf's: docks)
  market_stall: 2, oven: 1,   // (the ramparts')
  throne: 1, reliquary: 1,   // (the palace's: v1.154)
  furnace: 2, anvil: 3, crucible: 2,   // (the Magma Vault's; its magma has no cap: a channel is many tiles of it)
  cart_tipped: 1, clerk_desk: 8,   // (the Cold Seam's goblins' cart on its side; the quota office's desks: a row a wall. Rails no cap: a run is many tiles)
  fallen_block: 4,   // (the greenwood's)
  saint: 2, lantern: 4, candles: 4, candelabra: 4, torch: 4, brazier: 4, ladder: 1, puddle: 4, scorch: 3, straw: 6, sacks: 3, crates: 2, barrels: 2, cracks: 6 };
/** what stands out on an authored room's floor, by its place (not the kit's whole list: a gibbet in the stables and the
 *  gate-warden's chapel, a monolith in the legion's vault, said nothing) */
const PLAN_OB = { dig: ['spoil', 'brokenpillar'], gallery: ['pillar', 'brokenpillar'], muster: ['pillar'], bailey: ['pillar'], barracks: ['pillar'], cellar: ['stalagmite', 'boulder'], nave: ['pillar', 'brokenpillar'], cultcut: ['brokenpillar', 'spoil'], binding: ['pillar'],
  mound: ['reeds'], locks: ['pillar'], vats: ['pillar'], abbey: ['pillar', 'brokenpillar'], pithead: ['boulder', 'spoil'], warren: ['stalagmite', 'boulder'],
  yards: ['pillar', 'spoil'], quota: ['pillar'], forge: ['pillar', 'brokenpillar'], deepforge: ['pillar'], works: ['pillar', 'spoil'], vault: ['stalagmite', 'boulder'], strongroom: ['pillar'], tavern: [], tavern_cellar: [], crypt: [], ossuary: [], docks: [], mole: [], ramparts: [], seacave: ['stalagmite', 'boulder'], hulk: [], palace: ['pillar'], greenwood: [] };   // (the tavern: nothing stood out in its floors, which are for the fight)   // (v1.126)   // (v1.124: the Cold Seam)   // (v1.102: the Fens authored)
const DOOR_LIGHT = { dig: 'lantern', gallery: 'candles', muster: 'torch', bailey: 'torch', barracks: 'torch', cellar: 'lantern', nave: 'candelabra', cultcut: 'candles', binding: 'candles',
  mound: 'lantern', locks: 'lantern', vats: 'lantern', abbey: 'candelabra', pithead: 'lantern', warren: 'torch',
  yards: 'lantern', quota: 'lantern', forge: 'torch', deepforge: 'torch', works: 'torch', vault: 'torch', strongroom: 'candelabra', tavern: 'torch', tavern_cellar: 'candles', crypt: 'candles', ossuary: 'candles', docks: 'lantern', mole: 'lantern', ramparts: 'torch', seacave: 'lantern', hulk: 'lantern', palace: 'candelabra', greenwood: 'lantern' };   // (the crypt's doorways a low pricket: a candelabrum crowded the threshold, round 3)   // (v1.126: the Assay's lanterns, the forges' and the works' torches)   // (the miners' lamps; the goblins' torches)   // (the toad-men's and the lock-men's lanterns, the abbey's candelabra)
const PLAN_THEME = { dig: 'dig', gallery: 'gallery', muster: 'muster', bailey: 'bailey', barracks: 'barracks', cellar: 'cellar', cave: 'cave', nave: 'nave', cultcut: 'cultcut', binding: 'binding', mound: 'mound', locks: 'lockhall', vats: 'vats', abbey: 'nave', pithead: 'cellar', warren: 'cave', yards: 'storehouse', quota: 'cellar', forge: 'muster', deepforge: 'binding', works: 'storehouse', vault: 'cave', strongroom: 'muster', tavern: 'storehouse', tavern_cellar: 'storehouse', crypt: 'crypt', ossuary: 'ossuary', docks: 'storehouse', mole: 'storehouse', ramparts: 'storehouse', seacave: 'cave', hulk: 'storehouse', palace: 'crypt', greenwood: 'storehouse' };
// (the Reedholm Undercroft's own kits, docs/dungeon-looks-plan.md item 6: the Haddow Crypt's plan and set pieces, and its
// fights, in the reed town's brick: the crypt's and the ossuary's dressing, kept as they are; convert.js draws them)
DRESS.fenbrick = DRESS.crypt; DRESS.fenbones = DRESS.ossuary;
PLAN_OB.fenbrick = PLAN_OB.crypt; PLAN_OB.fenbones = PLAN_OB.ossuary;
DOOR_LIGHT.fenbrick = DOOR_LIGHT.crypt; DOOR_LIGHT.fenbones = DOOR_LIGHT.ossuary;
PLAN_THEME.fenbrick = PLAN_THEME.crypt; PLAN_THEME.fenbones = PLAN_THEME.ossuary;
const PLAN_KIND = { candles: 'candles', lanterns: 'lantern', spoil: 'spoil', crates: 'crates', sacks: 'sacks', windlass: 'windlass', chains: 'chains', gibbets: 'gibbet', bedrolls: 'bedroll', saints: 'saint', skulls: 'bones', bones: 'bones', barrels: 'barrels' };
function dressPlanned(r, { putAt: put0, pickEdge, place: place0, L, Wd, along, count }) {
  // every piece through the room's caps (CAP): a recipe can't stand a second well or a fifth torch
  const room = (k) => !DRESS_CAP[k] || count(k) < DRESS_CAP[k];
  const place = (x, y, k) => room(k) && place0(x, y, k), putAt = (u, v, k) => room(k) && put0(u, v, k);
  const at = (n, gap, kind) => { for (let i = 0; i < n; i++) { const q = pickEdge(gap); if (q) place(q[0], q[1], kind); } };
  const wall = Wd - 1.5, alongK = (k) => (ORIENT.has(k) && !along ? k + '_y' : k), acrossK = (k) => (ORIENT.has(k) && along ? k + '_y' : k);
  const row = (v, from, to, step, kind) => { for (let u = from; u <= to + 0.01; u += step) putAt(u, v, alongK(kind)); };
  // a big piece and its footprint: the tiles behind it (toward the back, −x and −y, where its sprite stands over)
  const big = (u, v, kind, w = 2, h = 2) => { putAt(u, v, kind); for (let a = 0; a < w; a++) for (let b = 0; b < h; b++) if (a || b) putAt(along ? u - a : u - b, along ? v - b : v - a, 'block'); };
  const has = (d) => r.dress.includes(d);
  // a pew is drawn as a bench three tiles long down x (convert.js DRESS_3D pew): walled so, its ends `block`, as drawn
  // (on its one tile the party walked through its ends: docs/pathing-audit.md)
  const pewAt = (u, v) => { if (!putAt(u, v, 'pew')) return; for (const d of [-1, 1]) { if (along) put0(u + d, v, 'block'); else put0(u, v + d, 'block'); } };
  const unit = (u, v, a0, a1, b0, b1, kind) => { if (!putAt(u, v, kind)) return false; for (let b = b0; b <= b1; b++) for (let a = a0; a <= a1; a++) if (a || b) putAt(u + a, v + b, 'block'); return true; };
  for (const d of r.dress) {
    switch (d) {
      // ── the Old Barrows: the Redhand's dig, then the legion's crypt
      case 'camp': big(-L * 0.25, -Wd * 0.25, 'cookfire', 1, 1); for (const [a, b] of [[1, 0], [0, 1], [1, 1]]) putAt(-L * 0.25 + a, -Wd * 0.25 + b, 'scorch');
        if (!has('tents')) { putAt(-L * 0.25 - 3, -Wd * 0.25 + 2, 'bedroll'); putAt(-L * 0.25 + 3, -Wd * 0.25 - 2, 'bedroll'); }   // (with tents, theirs)
        break;   // (its light: the cookfire, the plan's lanterns, the sanctuary's door braziers)
      case 'tents': for (let u = -L * 0.6; u <= L * 0.6 + 0.01; u += 14) { putAt(u, -(Wd - 3), 'tent'); putAt(u + 3, -(Wd - 6), 'bedroll'); } break;   // (a bedroll at each tent's door: the plan's bedrolls)
      case 'timbers': row(-wall, -L * 0.7, L * 0.7, 7, 'shoring'); for (const s of [-1, 1]) putAt(s * (L - 1.5), 0, acrossK('shoring')); putAt(L * 0.55, -(wall - 1), 'ladder'); break;
      case 'barrows': putAt(L * 0.3, Wd * 0.45, 'cart'); putAt(L * 0.3 + 2, Wd * 0.45, 'sacks'); putAt(-L * 0.4, Wd * 0.5, 'sacks'); break;
      // (the Breach, the contract's arena: where the dig broke through, the passage's columns down across the floor,
      // authored, so the fight's ground is the same on every seed; the raw earth and the cracked flags at its west end)
      case 'rubble': at(3, 6, 'spoil'); for (const [u, v] of [[-0.55, 0.2], [-0.4, -0.35], [-0.65, -0.1]]) putAt(u * L, v * Wd, 'cracks');
        for (const [u, v] of FALLEN) putAt(u * L, v * Wd, 'brokenpillar'); break;
      // niches: the shelves cut in the back wall, every six paces; at the near wall the families' urns and candles, low
      // (tall shelves there stood between the camera and the fight). The same tiles either way.
      // (at the near wall the families' urns and a skull by turns, a niche's width apart, every third left bare: nine
      // jars in a row read as a potter's)
      case 'niches': row(-wall, -L * 0.8, L * 0.8, 6, 'urnshelf'); { let i = 0; for (let u = -L * 0.8; u <= L * 0.8 + 0.01; u += 6, i++) if (i % 3 !== 2) putAt(u, wall, i % 3 ? 'bones' : 'urns'); } break;
      case 'sarcophagi': for (const s of [-1, 1]) for (let u = -L * 0.6 + (s > 0 ? 6 : 0); u <= L * 0.6 + 0.01; u += 12) putAt(u, s * (Wd - 4), 'sarcophagus'); break;   // (staggered, every twelve paces: ten in two rows read as a store of coffins)
      case 'sarcophagus_open': putAt(0, -Wd * 0.35, 'sarcophagus_open'); putAt(1, -Wd * 0.35 + 2, 'coins'); putAt(-2, -Wd * 0.35 + 2, 'bones'); putAt(3, -Wd * 0.35 + 1, 'papers'); break;
      case 'grave_goods': putAt(-L * 0.45, -wall, 'urns'); putAt(L * 0.45, -wall, 'urns'); putAt(-2, -Wd * 0.1, 'coins'); putAt(L * 0.3, Wd * 0.3, 'coins'); break;
      case 'guardians': break;                                             // (flanking the stair down, once it's placed: createWorld)
      // (the Clerk's Room and the Muniment Room are both come into through their back wall: the desks to the front, low,
      // the pigeonholes down the back and the end walls)
      case 'desks': for (const s of [-1, 1]) { putAt(s * L * 0.5, Wd * 0.25, alongK('desk')); putAt(s * L * 0.5 + 1, Wd * 0.25 + 2, 'papers'); } break;
      case 'rolls': row(-wall, -L * 0.55, L * 0.55, 5.5, 'shelf'); for (const s of [-1, 1]) for (const v of [-Wd * 0.45, 0]) putAt(s * (L - 1.5), v, acrossK('shelf')); break;
      case 'racks': row(-wall, -L * 0.7, L * 0.7, 7, 'rack'); if (has('crates')) break; putAt(L * 0.8, -wall + 2, 'crates'); break;
      case 'standards': for (const s of [-1, 1]) putAt(s * L * 0.6, -wall, alongK('standard')); break;
      case 'colonnade': for (const s of [-1, 1]) for (let u = -L * 0.6; u <= L * 0.6 + 0.01; u += 8) putAt(u, s * Wd * 0.5, 'pillar'); break;
      // (a way in has its doors' braziers, and a stair down its own pair: no third and fourth)
      case 'braziers': if (r.role === 'entrance' || r.role === 'descent') break; for (const s of [-1, 1]) putAt(s * L * 0.4, -Wd * 0.4, 'brazier'); break;
      // ── Wickham Keep: the bailey, the barracks, the cellars and the cave under them
      case 'portcullis': putAt(-L * 0.55, -wall, alongK('portcullis')); for (const s of [-1, 1]) putAt(-L * 0.55 + s * 3, -wall + 1, 'torch'); break;
      case 'banners': for (const s of [-1, 1]) putAt(s * L * 0.5, -wall, alongK('banner')); break;
      case 'stalls': for (let u = -L * 0.75, i = 0; u <= L * 0.75 + 0.01; u += 6, i++) { putAt(u, -wall, alongK('stall')); putAt(u + 1, -wall + 2.5, i % 2 ? 'straw' : 'hay'); } break;   // (hay and straw by turns in front of the stalls)
      case 'hay': putAt(-(L - 2), Wd * 0.3, 'hay'); break;
      case 'troughs': row(wall, -L * 0.5, L * 0.5, 10, 'trough'); break;
      case 'hen_cart': big(L * 0.6, Wd * 0.15, 'hen_cart', 2, 1); putAt(L * 0.6 + 2, Wd * 0.15 + 1, 'sacks'); putAt(L * 0.6 - 1, Wd * 0.15 + 2, 'straw'); break;
      case 'benches': for (const s of [-1, 1]) putAt(s * L * 0.3, Wd * 0.35, alongK('bench')); break;
      case 'cookfires': for (const s of [-1, 1]) { putAt(s * L * 0.35, -Wd * 0.05, 'cookfire'); putAt(s * L * 0.35 + 1, -Wd * 0.05 + 1, 'scorch'); putAt(s * L * 0.35 + 2, -Wd * 0.05 - 1, 'crates'); } break;
      case 'cage': big(L * 0.8, -Wd * 0.25, 'stockade', 2, 2); putAt(L * 0.8 - 3, -Wd * 0.25 + 2, 'straw'); break;
      case 'well': big(-L * 0.45, -Wd * 0.3, 'well', 2, 2); putAt(-L * 0.45 + 2, -Wd * 0.3 + 1, 'puddle'); putAt(-L * 0.45 - 3, -Wd * 0.3 + 2, 'torch'); break;   // (each set piece its own key light: in the dark, unlit, it wasn't there)
      case 'carts': putAt(L * 0.6, -wall + 1, 'cart'); putAt(L * 0.6 + 2, -wall + 1, 'sacks'); putAt(-L * 0.7, wall - 1, 'cart'); for (const [u, v] of [[0.55, 0.1], [-0.65, 0.4]]) putAt(u * L, v * Wd, 'straw'); break;
      // ── the tavern (the owner, 2026-11-22; plans.js shuttered_inn): the walls dressed, the middle left open for the fight.
      // The hearth and the notice board stand against the back wall (the one the camera faces), the long tables along the
      // end walls and the near one, each with a bench either side; the fire baskets in the near corners, low.
      // (the inn's pieces stand at the inn's scale, half again Luminati's own, as the figures do (convert.js TAV_S): each
      // blocks the floor it covers, a wall piece against the wall itself, so nothing walks through a hearth's back)
      case 'hearth': case 'kitchen_hearth': {
        const u0 = d === 'hearth' ? L * 0.25 : -L * 0.3;
        for (let b = 0; b <= 2; b++) for (let a = d === 'hearth' ? -5 : -3; a <= (d === 'hearth' ? 4 : 2); a++) putAt(u0 + a, -Wd + b, a || b ? 'block' : 'hearth');   // (the common room's in its stone surround, ten wide: round 3, "too small to anchor the room")
      } break;
      case 'noticeboard': for (let a = -2; a <= 2; a++) putAt(-L * 0.15 + a, -Wd, a ? 'block' : 'noticeboard'); break;
      case 'firewood': for (const s of [-1, 1]) for (let b = 0; b <= 1; b++) putAt(L * 0.25 - 0.5 + s * 7, -Wd + b, b ? 'block' : 'logpile'); break;
      case 'counter': for (let b = 0; b <= 3; b++) for (let a = -3; a <= 3; a++) putAt(-L * 0.5 + a, -Wd + b, a || b !== 3 ? 'block' : 'counter'); break;   // (the bar a step out, the keeper's shelf behind it on the wall)
      case 'rug': putAt(-L * 0.1, Wd * 0.1, 'rug'); break;
      // the inn's corners packed as the reference's are (round 7): a cluster in each, barrels, a sack, crates, inside a
      // corner's two tiles by two so the middle stays open (a doorway's mouth keeps it off: putAt)
      case 'corners': for (const sx of [-1, 1]) for (const sv of [-1, 1]) { putAt(sx * (L - 1), sv * Wd, 'barrels'); putAt(sx * (L - 2.5), sv * Wd, sv < 0 ? 'sacks' : 'crates'); putAt(sx * (L - 1), sv * (Wd - 1.5), sv < 0 ? 'crates' : 'barrels'); } break;
      case 'prep_table': for (let b = 0; b <= 1; b++) for (let a = -2; a <= 2; a++) putAt(L * 0.3 + a, -Wd + b, a || b !== 1 ? 'block' : 'longtable'); break;   // (the cook's table against the kitchen's wall)
      case 'fire_baskets': for (const s of [-1, 1]) putAt(s * (L - 3), -Wd + 1, 'brazier'); break;   // (in the back corners, by a wall (keepclear.js): by the near sill, the sill hid the basket and left its flame floating, the art critic's round 2)
      // a long table: its middle (the piece) and its length (blocks) along the room, a bench either side
      case 'tavern_tables': case 'snug_tables': {
        const tables = d === 'snug_tables' ? [[-L * 0.5, -Wd + 3], [L * 0.5, -Wd + 3]] : [[-L * 0.64, -Wd * 0.5], [L * 0.85, -Wd * 0.5], [-L * 0.42, wall - 2.5]];   // (the hearth an apron of clear stone before it; the snug's two by its back wall, the rug alone in the middle)
        for (const [u, v] of tables) {
          for (let b = -1; b <= 1; b++) for (let a = -2; a <= 2; a++) putAt(u + a, v + b, a || b ? 'block' : alongK('longtable'));
          for (const s of [-1, 1]) for (let a = -2; a <= 2; a++) putAt(u + a, v + s * 2, a ? 'block' : alongK('tbench'));
        }
      } break;
      case 'casks': row(-wall, -L * 0.6, L * 0.6, 8, 'cask_rack'); putAt(L * 0.7, wall, 'barrels'); putAt(-L * 0.7, wall, 'barrels'); break;
      // (Wickham Keep's great hall, docs/dungeon-looks-plan.md item 2: the trestles down its sides, a bench on the room's side
      // of each, two along the back wall either side of the hearth and one along the near wall; the armoury's racks along
      // the back wall's west end, where the camera sees them; the middle open for the fight)
      case 'trestles': for (const [u, v, s] of [[-L * 0.4, -Wd + 3.5, 1], [L * 0.72, -Wd + 3.5, 1], [L * 0.1, Wd - 3.5, -1]]) {
        if (!unit(u, v, -2, 2, -1, 1, alongK('longtable'))) continue;
        unit(u, v + s * 2, -2, 2, 0, 0, alongK('tbench'));
      } break;
      case 'armoury': row(-wall, -L * 0.88, -L * 0.6, 4, 'rack'); break;
      case 'bunks': for (const s of [-1, 1]) for (let u = -L * 0.75, i = 0; u <= L * 0.75 + 0.01; u += 6, i++) { putAt(u, s * wall, 'bunk'); if (s < 0 && i % 3 === 1) putAt(u + 3, s * (wall - 2), 'straw'); } break;
      case 'iron_door': break;                                             // (at the doorway: dressRoom, which knows the openings)
      case 'chests': at(2, 6, 'chest'); break;   // (the paymaster's two: Brannoc's errand)
      case 'ledger': putAt(L * 0.35, -Wd * 0.4, alongK('desk')); putAt(L * 0.35, -Wd * 0.4 + 2, 'papers'); break;
      case 'scaffold': row(-wall, -L * 0.55, 0, 9, 'scaffold'); break;
      case 'broken_floor': for (let a = -1; a <= 1; a++) for (let b = 0; b <= 1; b++) putAt(L * 0.1 + a * 2, Wd * 0.35 + b * 2, 'pit'); putAt(L * 0.1 - 4, Wd * 0.35 + 2, 'spoil'); putAt(L * 0.1 - 4, Wd * 0.35 - 1, 'lantern'); break;
      case 'ladders': if (has('broken_floor')) putAt(L * 0.1 + 4, Wd * 0.35, 'ladder'); else putAt(L * 0.75, -wall, 'ladder'); break;   // (the one ladder: down the broken floor where there is one)
      case 'stalagmites': at(6, 5, 'stalagmite'); break;
      case 'drips': for (const [u, v] of [[-0.3, -0.2], [0.2, 0.3], [-0.6, 0.35], [0.5, -0.4]]) putAt(u * L, v * Wd, 'puddle'); break;
      case 'garrows_table': big(L * 0.4, -Wd * 0.35, 'map_table', 2, 1); putAt(L * 0.4 + 1, -Wd * 0.35 + 2, 'rug'); putAt(L * 0.4 - 3, -Wd * 0.35, 'lantern'); putAt(L * 0.4 + 4, -Wd * 0.35 - 1, 'chest');
        putAt(-L * 0.45, -Wd * 0.45, 'stalagmite'); putAt(-L * 0.45 + 2, -Wd * 0.45 + 1, 'chains'); break;   // (Brannoc's stake: a chain post by a stone tooth)
      // ── the Sunken Chapel: the drowned temple, the cult's cut, the binding crypt
      case 'hives': row(-wall, -L * 0.5, L * 0.2, 7, 'hives'); break;
      case 'doors': putAt(L * 0.55, -wall, alongK('fallen_door')); putAt(L * 0.55 + 3, -wall + 1, 'fallen_door'); break;
      case 'pews': for (const s of [-1, 1]) for (const v of [0.28, 0.5]) for (let u = -L * 0.45; u <= L * 0.45 + 0.01; u += 5) pewAt(u, s * Wd * v); break;
      case 'font': putAt(L * 0.3, -Wd * 0.25, 'font'); break;
      // (the flags cracked in a ring where the tower came down, walked over: the fallen stone at the walls, out of the fight)
      case 'light_shaft': putAt(0, 0, 'shaft'); for (let i = 0; i < 5; i++) { const a = (i / 5) * 6.2832 + 0.4; putAt(cos(a) * 6, sin(a) * 6, 'cracks'); } for (const s of [-1, 1]) putAt(s * L * 0.7, Wd * 0.6, 'spoil'); break;
      case 'altar': case 'altar_small': if (r.role === 'descent') break; putAt(L * 0.55, 0, 'altar'); for (const s of [-1, 1]) putAt(L * 0.55 - 1, s * 3, d === 'altar' ? 'candelabra' : 'candles'); break;   // (a side chapel's small altar: candles at its foot)
      case 'candles': if (has('altar_small')) break; at(2, 6, 'candles'); break;   // (the side chapel's candles are its altar's)
      case 'ladders_cut': break;
      case 'ledgers': putAt(L * 0.6, -Wd * 0.2, 'ledgers'); putAt(L * 0.6 - 2, -Wd * 0.2 + 2, 'papers'); break;
      case 'bound': for (const s of [-1, 1]) for (let u = -L * 0.7; u <= L * 0.7 + 0.01; u += 5) putAt(u, s * wall, 'bound'); break;
      case 'circle': putAt(0, 0, 'circle'); break;
      case 'ring_of_pillars': for (let i = 0; i < 10; i++) { const a = (i / 10) * 6.2832; putAt(cos(a) * L * 0.62, sin(a) * Wd * 0.62, 'pillar'); } break;
      // ── the Ninth Milestone: the legion's strongroom
      case 'pay_chests': for (let u = -L * 0.75; u <= L * 0.75 + 0.01; u += 6) putAt(u, -wall, 'strongbox'); break;   // (one in each barred alcove, and no more)
      case 'bars': row(-(wall - 1), -L * 0.75, L * 0.75, 6, 'bars'); break;
      case 'chest': at(1, 6, 'chest'); break;
      case 'shrine': { const q = pickEdge(8); if (q) place(q[0], q[1], 'shrine'); } break;
      case 'shrine_west': putAt(-(L - 2), 0, 'shrine'); break;   // (by the west wall, out of the line between the camera and the hearth: the inn's kitchen, round 4)
      // ── the crypt (the owner, 2026-11-22: "do a similar dungeon style as the inside of a crypt"; plans.js haddow_crypt,
      // docs/crypt-dungeon.md): as the inn, every piece at a wall and the middle left for the fight. The tombs stand along
      // the back wall and the near one (their long sides to the room, an aisle between), at the figures' scale, each
      // blocking the floor it covers (five by three); the founder's in its canopy against the back wall, a mourner either
      // side; the candelabra by the back wall; the urns and the bones in the corners.
      // (a piece and its footprint as one: the piece first, its blocks only where it stood, so a doorway's mouth that
      // turns the piece away never leaves its footprint standing there unseen)
      case 'tombs': case 'tombs_near': {
        // (the hall's: two along the back wall east of the chantry's door, two along the near wall west of the vault's;
        // the vault's own pair along its near wall)
        const spots = d === 'tombs' ? [[L * 0.25, -Wd + 2], [L * 0.7, -Wd + 2], [L * 0.28, Wd - 2], [L * 0.7, Wd - 2]] : [[-L * 0.55, Wd - 2], [L * 0.55, Wd - 2]];   // (the hall's doors west, to the chantry and down to the vault: its tombs east)
        for (const [u, v] of spots) unit(u, v, -2, 2, -1, 1, alongK('tomb'));
      } break;
      case 'great_tomb': unit(0, -Wd + 2, -4, 4, -2, 2, 'great_tomb'); break;   // (its chest and canopy, nine wide by five deep, at the back wall's middle: round 3)
      case 'mourners': for (const s of [-1, 1]) unit(s * 7, -Wd + 5.5, 0, 1, 0, 1, 'mourner'); break;   // (their own silhouette, clear of the columns: round 9)   // (at the canopy's front corners, where they're seen: round 2)
      case 'tombs_side': for (const s of [-1, 1]) unit(s * (L - 2.5), 0, -1, 1, -2, 2, acrossK('tomb')); break;   // (one against each side wall: round 4, "the vault is sparse")
      case 'founder_lights': for (const s of [-1, 1]) putAt(s * 8.5, -Wd + 1, 'candelabra'); break;   // (outside his hatchments: round 6)   // (a candelabrum either side of his canopy, his light)
      case 'tomb_one': unit(-L * 0.4, Wd - 2, -2, 2, -1, 1, alongK('tomb')); break;   // (the stair hall's one tomb, by the near wall)
      case 'candelabra_pair': putAt(L * 0.47, -Wd + 1, 'candelabra'); putAt(0, Wd - 1, 'candelabra'); break;   // (between the back wall's tombs, and at the near wall's middle: the hall's doors take its west end)
      case 'candelabra_ends': for (const s of [-1, 1]) putAt(s * (L - 1), -Wd * 0.45, 'candelabra'); break;   // (at the end walls, by the wall: keepclear.js)
      case 'offering': unit(-L * 0.6, -Wd + 1, -2, 2, -1, 0, 'offering'); break;   // (clear of the stair well beside it: round 3)   // (the stair hall's table of offerings, against the back wall)
      case 'chantry_altar': unit(0, -Wd + 1, -3, 3, -1, 1, 'altar'); for (const s of [-1, 1]) putAt(s * 5, -Wd + 1, 'candles'); break;
      case 'chantry_pews': for (const s of [-1, 1]) for (const v of [-3, 2]) unit(s * (L - 1), v, 0, 0, -1, 1, acrossK('pew')); break;   // (two either side, against the side walls, the middle open: round 1, "the pews fill the middle")
      // the corners: an urn and a heap of the bones the shelves no longer hold (a doorway's mouth keeps them off: putAt)
      case 'crypt_corners': for (const sx of [-1, 1]) for (const sv of [-1, 1]) { putAt(sx * (L - 1), sv * Wd, 'urns'); if (sv < 0) putAt(sx * (L - 1), -(Wd - 1.5), 'bones'); } break;   // (bones at the back walls only: by the near sill they read as debris, round 6)
      case 'bedrolls': if (!has('tents')) at(3, 6, 'bedroll'); break;   // (where there are tents, a bedroll at each one's door)
      // ── the docks (the owner, 2026-11-23: "docks and harbor", a reference; plans.js old_eel_wharf, docs/docks-dungeon.md):
      // a wharf's decks over the harbour. No walls: a deck's edge is the water (convert.js rails it). As the inn, every
      // piece at an edge and the middle left for the fight: the lamps on their posts at the back corners and one at the
      // front, the cargo stacked in the back corners, rope coils and nets lying flat where the work was, a boat tied up.
      case 'dock_lamps': for (const s of [-1, 1]) putAt(s * (L - 1), -Wd, 'lantern'); putAt(L * 0.55, Wd, 'lantern'); break;
      case 'dock_cargo': for (const s of [-1, 1]) { putAt(s * (L - 1), -(Wd - 1.5), 'barrels'); putAt(s * (L - 2.5), -Wd, s < 0 ? 'crates' : 'sacks'); } putAt(-(L - 1), Wd, 'crates'); break;
      case 'dock_ropes': for (const [u, v] of [[-0.35, -1], [0.2, -1], [-0.6, 1], [0.05, 1]]) putAt(u * L, v * (Wd - 0.5), 'rope'); putAt(L * 0.4, -(Wd - 1), 'net'); putAt(-L * 0.25, Wd - 1, 'net'); break;
      case 'fish_market': for (let u = -L * 0.55; u <= L * 0.25 + 0.01; u += 5) putAt(u, -Wd, 'fishcrates'); for (const s of [-1, 1]) putAt(s * (L - 1), 0, 'fishcrates'); break;   // (the morning's catch in its crates along the back, never collected)
      case 'moorings': putAt(L * 0.35, -Wd, 'boat'); break;   // (a boat tied up off the back edge, in the water where the camera sees it: convert.js; at the near edge it was below the frame, round 2)
      case 'crane': unit(-L * 0.3, -Wd + 1, -1, 1, -1, 0, 'crane'); break;
      // ── the moles (v1.150; plans.js drowned_mole, floor 2): the stone at low water. As the wharf, every piece at an edge
      // and the middle left for the fight: the harbour lamps on their posts, rope coiled at the bollards, the anchors' chain
      // laid out, the tide's pools on the stone, the wrecks along the back, the lamp-stand at the mole's end
      // ── the Seventh's Palace (v1.154): the throne on its dais at the throne room's back wall, the chapel's empty stand
      // where Livia's box stood, the palace's candelabra at the end walls and one by the near wall
      case 'throne': unit(-L * 0.5, -Wd + 2, -2, 2, -1, 1, 'throne'); for (const s of [-1, 1]) putAt(-L * 0.5 + s * 5, -Wd + 1, 'candelabra'); break;   // (west along the back wall: the chapel's door comes in at its middle)
      case 'reliquary': unit(L * 0.4, -Wd + 1, 0, 1, -1, 0, 'reliquary'); break;
      // ── the Magma Vault (the owner, 2026-11-26: "The magma vault dungeon needs more dressing.. flowing magma and a few
      // furnaces, anvils, and other appropriate dressing"): magma running in a channel along the back wall's foot, a tile
      // wide, the room's floor left whole (impassable tiles in the fight's ground were taken out, 2026-10-04: it runs where
      // nobody stands); a pool of it in the near far corner; the furnaces built into the back wall, a crucible by each; the
      // anvils in the thirds, low, where the smiths stood
      case 'magma_channel': for (let u = -L + 2; u <= L - 2 + 0.01; u += 1) putAt(u, -wall, 'magma'); break;
      case 'magma_pool': for (const [a, b] of [[0, 0], [1, 0], [2, 0], [0, 1], [1, 1], [2, 1], [1, -1]]) putAt(L * 0.62 + a, Wd * 0.45 + b, 'magma'); break;
      case 'furnaces': for (const s of [-1, 1]) for (const v of [-Wd + 2, -Wd + 4, -Wd * 0.55]) if (unit(s * L * 0.45, v, -1, 1, -1, 0, 'furnace')) { putAt(s * L * 0.45 + s * 3, v + 1, 'crucible'); break; } break;   // (a cave's back wall curves in: step off it till it stands)
      case 'anvils': for (const [u, v] of [[-0.28, -0.42], [0.3, -0.4], [-0.62, 0.3]]) putAt(u * L, v * Wd, 'anvil'); break;
      case 'palace_lamps': for (const s of [-1, 1]) putAt(s * (L - 1), -Wd * 0.45, 'candelabra'); putAt(-L * 0.5, Wd - 1, 'candelabra'); break;
      case 'mole_lamps': for (const s of [-1, 1]) putAt(s * (L - 1), -Wd, 'lantern'); putAt(-L * 0.55, Wd, 'lantern'); break;
      case 'bollards': for (const [u, v] of [[-0.45, -1], [0.3, -1], [-0.1, 1], [0.6, 1]]) putAt(u * L, v * (Wd - 0.5), 'rope'); break;
      case 'anchors': putAt(L * 0.5, -(Wd - 1), 'chains'); putAt(-L * 0.6, Wd - 1, 'chains'); break;
      case 'weed': for (const [u, v] of [[-0.3, -0.4], [0.35, 0.3], [-0.65, 0.3], [0.55, -0.35]]) putAt(u * L, v * Wd, 'puddle'); break;
      case 'wrecks': for (let u = -L * 0.5, i = 0; u <= L * 0.5 + 0.01 && i < 3; u += 12, i++) putAt(u, -Wd, 'boat'); break;
      case 'lamp_stand': putAt(0, -Wd, 'brazier'); break;   // (where Lucan sang: the mole's lamp, lit by nobody)   // (round 3: into the frame, clear of the boat)   // (the wharf's derrick at the back edge, a net of cargo on its hook)
      // ── the ramparts (the owner, 2026-11-23: "the reaches, high up on the ramparts", a reference; plans.js high_ramparts,
      // docs/ramparts-dungeon.md): a walled town's terraces up on its walls, the houses along their backs (convert.js), a
      // parapet over the drop at their fronts. Every piece by the houses or the parapet, the middle left for the fight: torches
      // on poles at the corners, a stall or two by the houses, the cargo in the back corners, a baker's oven, a well.
      case 'rampart_torches': for (const s of [-1, 1]) putAt(s * (L - 1), -Wd, 'torch'); putAt(-L * 0.5, Wd, 'torch'); break;
      case 'rampart_cargo': for (const s of [-1, 1]) { putAt(s * (L - 1), -(Wd - 1.5), 'barrels'); putAt(s * (L - 2.5), -Wd, s < 0 ? 'crates' : 'sacks'); } break;
      case 'market_stalls': for (const u of [-L * 0.3, L * 0.3]) unit(u, -Wd + 1, -1, 1, -1, 0, 'market_stall'); break;   // (against the houses, their awnings over the street)
      case 'oven': unit(-L * 0.6, -Wd + 1, -1, 1, -1, 0, 'oven'); break;   // (the bakers' oven, built out from a house's front)
      case 'rampart_well': unit(-L * 0.45, -Wd + 2, -1, 0, -1, 0, 'well'); break;   // (round 2: into the frame, by the back wall)
      case 'rampart_clutter': putAt(-L * 0.15, -Wd, 'barrels'); putAt(L * 0.45, -Wd, 'crates'); putAt(L * 0.45 + 1.5, -Wd, 'sacks'); break;   // (round 1: more against the house fronts)
      // ── the greenwood (2026-11-27, docs/greenwood-dungeon.md; plans.js root_granary): glades under the oaks, open air. No
      // walls: the trunks, root-banks and the empire's ruins round the glades are the renderer's (`tithe_road`, `arcade`,
      // `falls`, `granary_door`: convert.js, no sim piece). Here only what stands in a glade: a waymark lamp at a back corner
      // and one by the near edge, the empire's fallen blocks and a broken pillar in the corners' thirds, mossed boulders at
      // the edges; the middle left for the fight
      case 'wood_lamps': putAt(-(L - 1), -Wd, 'lantern'); putAt(L * 0.55, Wd, 'lantern'); break;
      case 'ruin_blocks': for (const [u, v, k] of /** @type {[number, number, string][]} */ ([[-0.72, -0.78, 'fallen_block'], [0.66, -0.74, 'brokenpillar'], [-0.6, 0.8, 'fallen_block'], [0.8, 0.62, 'fallen_block']])) putAt(u * L, v * Wd, k); break;
      case 'mossy_boulders': at(2, 7, 'boulder'); break;
      // ── the Greywater Fens (v1.102, authored): the Toadking's mound, the Canal Locks and Vat Seven, the Drowned Abbey
      case 'boats': for (let u = -L * 0.55, i = 0; u <= L * 0.55 + 0.01 && i < 3; u += 13, i++) putAt(u, -(wall - 1), 'boat'); break;   // (hauled up keel-over at the back wall, three at most)
      case 'reeds': at(4, 5, 'reeds'); break;
      case 'nets': row(-wall, -L * 0.5, L * 0.5, 9, 'rack'); break;                 // (the drying racks, nets over them)
      case 'pens': for (let u = -L * 0.7, i = 0; u <= L * 0.7 + 0.01; u += 7, i++) { putAt(u, -wall, alongK('stall')); putAt(u + 1, -wall + 2.5, i % 2 ? 'straw' : 'reeds'); } putAt(L * 0.5, Wd * 0.45, alongK('trough')); break;
      case 'windlasses': for (const s of [-1, 1]) putAt(s * L * 0.45, -wall, 'windlass'); break;   // (the gear either side, at the back wall)
      case 'vats': for (let u = -L * 0.6; u <= L * 0.6 + 0.01; u += 10) putAt(u, -(Wd - 3), 'vat'); break;   // (the tubs down the back wall: tall, so never the near one, §4.2)
      // ── the Cold Seam a worked mine (docs/dungeon-looks-plan.md item 8): the pithead's rails down the gallery's middle, a
      // cart on them where the shift left it (flat, walked over: the fight crosses them); the warren's shoring robbed for
      // its timber, a set every nine paces at the back wall, broken; and a cart the goblins tipped by their heap
      case 'rails': putAt(L * 0.42, 0, 'cart'); for (let u = -L + 3; u <= L - 3 + 0.01; u += 1) putAt(u, 0, 'rail'); break;
      case 'robbed_shoring': row(-wall, -L * 0.65, L * 0.65, 9, 'shoring_broken'); break;
      case 'tipped_cart': putAt(-L * 0.5, -wall + 2, 'cart_tipped'); putAt(-L * 0.5 + 2, -wall + 1, 'spoil'); break;
      // ── the quota office a counting house (item 9): the clerks' desks in a row along the back wall, a step out from the
      // ledger shelves on it (convert.js countingRun), each chained to a ring in the floor; the strongbox in a back corner
      case 'desk_rows': for (let u = -L * 0.6; u <= L * 0.6 + 0.01; u += 6) putAt(u, -(Wd - 4), alongK('clerk_desk')); break;
      case 'strongbox': putAt(L * 0.72, -(Wd - 2), 'strongbox'); break;
      default: if (PLAN_KIND[d]) at(d === 'candles' || d === 'lanterns' ? 2 : d === 'spoil' || d === 'bedrolls' ? 3 : 1, 6, PLAN_KIND[d]);
    }
  }
}

// Props you walk over (flat on the floor, or underfoot): a dropped cage, a binding circle.
export const FLAT_PROPS = new Set(['cage', 'circle', 'shaft', 'straw', 'rug', 'scorch', 'cracks', 'coins', 'papers', 'puddle', 'rope', 'net', 'rail']);   // (a wharf's rope coils and nets lie flat on its deck: walked over)   // (the Cold Seam's rails, walked over)
export function createWorld(seed, theme, depth = 0, site = 'barrows') {
  const S = siteOf(site), FAM = familyAt(site, depth), kit = dressAt(site, depth), KIT = kit ? DRESS[kit] : null;   // (its furniture below: `human`, `themes`, or its kit)
  const th = theme || themeAt(site, depth) || THEME_KEYS[(seed >>> 0) % THEME_KEYS.length];
  const level = generateLevel(seed, th, { rooms: S.rooms, layout: S.layout, plan: planFloor(site, depth) });   // (an authored floor: plans.js)
  const world = {
    kind: 'dungeon', seed, theme: th, depth, level, site, siteName: S.name, kit, ...(S.arena ? { arena: true } : {}),
    ss: streamSeed(seed, 131),            // floor-material selector
    hs: streamSeed(seed, 7919),           // cliff-face strata / detail
    cs: streamSeed(seed, 577),            // hazard field
    spawn: level.spawn,
    props: new Map(),                     // "x,y" -> kind
    mods: new Map(),                      // "x,y" -> { cleared } | { opened }
    hp: new Map(),                        // "x,y" -> remaining hits
    discovered: new Set(),                // room ids seen (minimap fog)
  };
  // Populate rooms (GDD §3: rooms are battle arenas, so the middle stays open):
  //   • braziers flank each real doorway (where a corridor enters), one step inside;
  //   • decor (spires / monoliths / totems) stands against the walls, spaced out;
  //   • a chest and sometimes a shrine sit against a wall, away from the doorways.
  // All snap onto solid, open floor; the descent gate goes in the farthest room.
  const prng = mulberry32(streamSeed(seed, 321));
  const orng = mulberry32(streamSeed(seed, 324)), OBSTACLES = ['pillar', 'pillar', 'monolith', 'gibbet'];   // (the standing obstacles: below)
  // a site's furniture (M5): the living keep stores and camps where the dead keep crypts. The same
  // draws either way, so an Old Barrows floor is dressed as it always was.
  // (the goblins keep a camp of what fell off the carts, and their totems)
  // (the Toadking's reed-cutters keep stores like the Redhand; the drowned clergy keep their naves like the chapel)
  const human = FAM === 'redhand' || FAM === 'reedmen' || FAM === 'diggers', gob = FAM === 'goblin';
  const decor = KIT ? KIT.decor : human ? ['crates', 'barrels', 'sacks'] : gob ? ['sacks', 'totem', 'crates'] : ['spire', 'monolith', 'totem'];
  const themes = KIT ? KIT.rooms : human ? ['storehouse', 'camp', 'colonnade'] : gob ? ['camp', 'storehouse', 'ossuary'] : FAM === 'chapel' || FAM === 'drowned' ? ['nave', 'crypt', 'ossuary'] : ['colonnade', 'crypt', 'ossuary'];
  // (docs/level-design-rules.md §4.3: a room holds as many of a piece as its size allows, dresscaps.js; the owner,
  // 2026-11-10: "dont repeat with 6+ torches unless the room is large". A piece past its cap isn't set down)
  const roomHas = new Map(), roomSize = new Map(level.rooms.map((r) => [r.id, r.size || 'large']));
  // (docs/level-design-rules.md §4.4, keepclear.js; the owner, 2026-11-10: "need rules to prevent things like barrels
  // blocking the stairway, or a torch in the middle of a hallway or entrance to another room": nothing in a doorway's
  // mouth, and a light only by a wall. The stairs, placed after, clear their own ground: below)
  const MOUTHS = mouths(level);
  const place = (px, py, kind) => {
    const k = K(px, py), c = level.cells.get(k);
    if (MOUTHS.has(k) || (LIGHT.has(kind) && !againstWall(level, px, py))) return false;
    if (c && c.kind === 'floor' && !c.corridor && !world.props.has(k) && NONWALK_OK(world, px, py)) {
      if (c.room >= 0 && REPEAT_CAPPED.has(kind)) {
        let has = roomHas.get(c.room); if (!has) roomHas.set(c.room, (has = new Map()));
        if (!mayPlace(kind, roomSize.get(c.room) || 'large', has)) return false;
        has.set(kind, (has.get(kind) || 0) + 1);
      }
      world.props.set(k, kind); return true;
    }
    return false;
  };
  const isFloor = (x, y) => { const c = level.cells.get(K(x, y)); return c && c.kind === 'floor'; };
  for (const r of level.rooms) {
    const cells = [], doors = [];
    for (const [k, c] of level.cells) if (c.kind === 'floor' && c.room === r.id) { const [x, y] = k.split(',').map(Number); cells.push([x, y, c]); }
    // doorway cells: room floor touching corridor floor that lies outside the room
    for (const [x, y] of cells) for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const n = level.cells.get(K(x + dx, y + dy));
      if (n && n.kind === 'floor' && n.room < 0) { doors.push([x, y, dx, dy]); break; }
    }
    // group doorway cells into openings (a 6-wide corridor mouth) and flank each with braziers
    const openings = [];
    for (const d of doors) { const g = openings.find((o) => Math.abs(o.x - d[0]) + Math.abs(o.y - d[1]) < 9 && o.dx === d[2] && o.dy === d[3]); if (g) { g.pts.push(d); g.x = (g.x * (g.pts.length - 1) + d[0]) / g.pts.length; g.y = (g.y * (g.pts.length - 1) + d[1]) / g.pts.length; } else openings.push({ x: d[0], y: d[1], dx: d[2], dy: d[3], pts: [d] }); }
    // (an authored room's doorways lit as its place is: DOOR_LIGHT; a floor's way in, its sanctuary, keeps its braziers, so
    // the safe room reads warm and lit and the fighting rooms take their own place's light)
    const DL = r.dress && r !== level.entrance ? DOOR_LIGHT[r.kit] || 'brazier' : 'brazier';
    // (one light a doorway in an authored fighting room, on alternate sides: a pair at each of three doorways stood six
    // torches about the Horse Lines; a sanctuary keeps its pair)
    const pair = !r.dress || r === level.entrance;
    // (against the wall the corridor comes through, just past the opening's edge, a step in at most: §4.4. They stood two
    // steps inside and out in the floor, a light in the way in: the owner, 2026-11-10)
    openings.forEach((o, oi) => {
      const px = o.dy, py = o.dx;   // along the wall the opening is in
      const side = (s) => {
        const e = o.pts.reduce((a, q) => (s * (q[0] * px + q[1] * py) > s * (a[0] * px + a[1] * py) ? q : a));   // the opening's end on this side
        for (let j = 0; j <= 1; j++) for (let w = 2; w <= 6; w++) if (place(e[0] + px * s * w - o.dx * j, e[1] + py * s * w - o.dy * j, DL)) return true;
        return false;
      };
      if (pair) { side(-1); side(1); } else { const s0 = oi % 2 ? 1 : -1; if (!side(s0)) side(-s0); }   // (one side, else the other)
    });
    // the strongroom's iron door, hung open inside its doorway, against the wall it's set in
    if (r.dress && r.dress.includes('iron_door') && openings.length) { const o = openings[0], ix = Math.round(o.x) - o.dx, iy = Math.round(o.y) - o.dy; for (let w = 7; w <= 9; w++) if (place(ix + o.dy * w, iy + o.dx * w, o.dx ? 'iron_door_y' : 'iron_door')) break; }
    // wall-side cells: open floor within 2 tiles of the room's edge, away from doorways
    const nearDoor = (x, y, rr = 8) => openings.some((o) => hypot(x - o.x, y - o.y) < rr);
    const edge = cells.filter(([x, y, c]) => {
      if (c.corridor || nearDoor(x, y)) return false;
      let open = 0; for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) if (!isFloor(x + dx, y + dy)) open++;
      return open > 0 && isFloor(x + 1, y) && isFloor(x - 1, y) && isFloor(x, y + 1) && isFloor(x, y - 1);
    });
    const taken = [];
    // an authored room draws its dressing from a stream of its own (the dressing pass): a recipe changed in one room
    // moved every room after it on the shared one, the contract's arena among them
    const rr = r.dress ? mulberry32(streamSeed(seed, 3210 + r.id)) : prng, orr = r.dress ? mulberry32(streamSeed(seed, 3240 + r.id)) : orng;
    const pickEdge = (minGap, ok = null) => {
      for (let t = 0; t < 40 && edge.length; t++) { const [x, y] = edge[(rr() * edge.length) | 0]; if ((!ok || ok(x, y)) && taken.every(([a, b]) => hypot(a - x, b - y) >= minGap)) { taken.push([x, y]); return [x, y]; } }
      return null;
    };
    // room identity: every fighting room gets a layout theme, furniture kept to the thirds so
    // the middle of the arena stays open (and corridors running through stay clear):
    //   colonnade — two rows of pillars along the long axis, a few fallen;
    //   crypt — rows of sarcophagi down the sides, bones at the walls;
    //   ossuary — bone heaps at the walls around broken pillars.
    // The descent room rings its gate with four pillars; the entrance stays a bare sanctuary.
    const along = r.rw >= r.rh, L = along ? r.rw : r.rh, Wd = along ? r.rh : r.rw;
    const at = (u, v) => along ? [Math.round(r.cx + u), Math.round(r.cy + v)] : [Math.round(r.cx + v), Math.round(r.cy + u)];
    const putAt = (u, v, kind) => { const [x, y] = at(u, v); return !nearDoor(x, y, r.dress ? 6.5 : 8) && place(x, y, kind); };   // (an authored room keeps its doorway's mouth clear, 10 wide: 8 took most of a small room)
    if (r.dress) {                                                // an authored room (plans.js): its kit's theme, then the pieces it names
      const theme = r === level.entrance ? null : PLAN_THEME[r.shape === 'cave' && r.kit === 'cellar' ? 'cave' : r.kit] || null;
      r.theme = theme;
      const count = (k) => { let n = 0; for (const [x, y] of cells) if (world.props.get(K(x, y)) === k) n++; return n; };   // (cells: this room's floor)
      dressPlanned(r, { putAt, pickEdge, place, L, Wd, along, count });
    } else if (r === level.descentRoom) {
      const k = Math.min(r.rw, r.rh) * 0.45; for (const [a, b] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) putAt(a * k, b * k, 'pillar');
    } else if (r !== level.entrance) {
      const theme = themes[(prng() * 3) | 0];
      r.theme = theme;
      if (theme === 'storehouse') {                              // stacks of crates, barrels and the tithe's sacks down both long walls
        for (const side of [-1, 1]) for (let u = -L * 0.55; u <= L * 0.55 + 0.01; u += 6) putAt(u, side * Wd * 0.55, ['crates', 'barrels', 'sacks'][(prng() * 3) | 0]);
      } else if (theme === 'camp') {                             // bedrolls by the walls, a fire either end, the loot piled up
        for (let i = 0; i < 6; i++) { const q = pickEdge(6); if (q) place(q[0], q[1], 'bedroll'); }
        for (const side of [-1, 1]) putAt(side * L * 0.4, 0, 'brazier');
        for (let i = 0; i < 2; i++) { const q = pickEdge(8); if (q) place(q[0], q[1], 'crates'); }
      } else if (theme === 'nave') {                             // two ranks of pews either side of an aisle
        for (const side of [-1, 1]) for (const v of [0.28, 0.5]) for (let u = -L * 0.45; u <= L * 0.45 + 0.01; u += 5) putAt(u, side * Wd * v, 'pew');
      } else if (theme === 'colonnade') {
        for (const side of [-1, 1]) for (let u = -L * 0.6; u <= L * 0.6 + 0.01; u += 7) putAt(u, side * Wd * 0.55, prng() < 0.25 ? 'brokenpillar' : 'pillar');
      } else if (theme === 'dig') {                              // the dig: spoil thrown up at the walls, lanterns, a grave broken open
        for (let i = 0; i < 4; i++) { const q = pickEdge(7); if (q) place(q[0], q[1], 'spoil'); }
        for (const side of [-1, 1]) putAt(side * L * 0.42, side * Wd * 0.45, 'lantern');
        putAt(L * 0.3, -Wd * 0.5, 'sarcophagus');
      } else if (theme === 'gallery') {                          // burial niches down both long walls, candles burning at their feet
        for (const side of [-1, 1]) for (let u = -L * 0.5; u <= L * 0.5 + 0.01; u += 7) putAt(u, side * Wd * 0.58, 'urnshelf');
        for (let i = 0; i < 3; i++) { const q = pickEdge(7); if (q) place(q[0], q[1], i ? 'urns' : 'candles'); }
      } else if (theme === 'muster') {                           // the legion's racks down the walls, its standards at either end
        for (const side of [-1, 1]) for (let u = -L * 0.4; u <= L * 0.4 + 0.01; u += 7) putAt(u, side * Wd * 0.56, 'rack');
        for (const side of [-1, 1]) putAt(side * L * 0.55, 0, 'standard');
      } else if (theme === 'bailey') {                           // the Company's tents round the walls, a cookfire, their colours
        for (let i = 0; i < 3; i++) { const q = pickEdge(10); if (q) place(q[0], q[1], 'tent'); }
        putAt(L * 0.38, 0, 'brazier'); putAt(-L * 0.5, Wd * 0.45, 'banner');
        for (let i = 0; i < 2; i++) { const q = pickEdge(7); if (q) place(q[0], q[1], i ? 'barrels' : 'crates'); }
      } else if (theme === 'barracks') {                         // bunks down the long walls, a rack at the end
        for (const side of [-1, 1]) for (let u = -L * 0.45; u <= L * 0.45 + 0.01; u += 6) putAt(u, side * Wd * 0.55, 'bunk');
        putAt(L * 0.58, 0, 'rack');
      } else if (theme === 'cellar') {                           // where they dug: scaffolding at the walls, spoil, lamps
        for (const side of [-1, 1]) for (let u = -L * 0.35; u <= L * 0.35 + 0.01; u += 9) putAt(u, side * Wd * 0.58, 'scaffold');
        for (let i = 0; i < 2; i++) { const q = pickEdge(7); if (q) place(q[0], q[1], 'spoil'); }
        putAt(-L * 0.45, -Wd * 0.4, 'lantern');
      } else if (theme === 'cave') {                             // the rock: stalagmites up out of the floor at the walls, fallen boulders
        for (let i = 0; i < 6; i++) { const q = pickEdge(5); if (q) place(q[0], q[1], 'stalagmite'); }
        for (let i = 0; i < 2; i++) { const q = pickEdge(7); if (q) place(q[0], q[1], 'boulder'); }
      } else if (theme === 'chancel') {                          // an altar at the far end, candles, a saint fallen from his plinth, two short pews
        putAt(-L * 0.52, 0, 'altar');
        for (const side of [-1, 1]) putAt(-L * 0.45, side * Wd * 0.4, 'candles');
        for (const side of [-1, 1]) { const u = L * 0.15, v = side * Wd * 0.4; if (putAt(u, v, 'pew')) for (const d of [-1, 1]) { if (along) putAt(u + d, v, 'block'); else putAt(u, v + d, 'block'); } }   // (three tiles down x, as drawn: dressPlanned pewAt)
        putAt(L * 0.45, Wd * 0.5, 'saint');
      } else if (theme === 'cultcut') {                          // the Cult's dig: a binding circle in the cinders, chains, braziers
        putAt(0, 0, 'circle');
        for (const side of [-1, 1]) putAt(side * L * 0.4, side * Wd * 0.45, 'chains');
        for (const side of [-1, 1]) putAt(side * L * 0.45, -side * Wd * 0.4, 'brazier');
        for (let i = 0; i < 2; i++) { const q = pickEdge(7); if (q) place(q[0], q[1], 'spoil'); }
      } else if (theme === 'binding') {                          // the bound standing in rows at the walls, chains, the font
        for (const side of [-1, 1]) for (let u = -L * 0.45; u <= L * 0.45 + 0.01; u += 5) putAt(u, side * Wd * 0.58, 'bound');
        putAt(L * 0.5, 0, 'font');
      } else if (theme === 'mound') {                            // the Toadking's: boats hauled up and turned over, reeds through the floor
        for (let i = 0; i < 3; i++) { const q = pickEdge(9); if (q) place(q[0], q[1], 'boat'); }
        for (let i = 0; i < 4; i++) { const q = pickEdge(5); if (q) place(q[0], q[1], 'reeds'); }
      } else if (theme === 'lockhall') {                         // the lock-keepers': windlasses at the walls, chains, barrels
        for (const side of [-1, 1]) for (let u = -L * 0.4; u <= L * 0.4 + 0.01; u += 9) putAt(u, side * Wd * 0.56, 'windlass');
        for (let i = 0; i < 2; i++) { const q = pickEdge(7); if (q) place(q[0], q[1], i ? 'barrels' : 'chains'); }
      } else if (theme === 'vats') {                             // Vat Seven: the Cult's tubs down the walls
        for (const side of [-1, 1]) for (let u = -L * 0.35; u <= L * 0.35 + 0.01; u += 10) putAt(u, side * Wd * 0.55, 'vat');
        for (let i = 0; i < 2; i++) { const q = pickEdge(7); if (q) place(q[0], q[1], 'barrels'); }
      } else if (theme === 'crypt') {
        for (const side of [-1, 1]) for (let u = -L * 0.45; u <= L * 0.45 + 0.01; u += 6) putAt(u, side * Wd * 0.5, 'sarcophagus');
        for (let i = 0; i < 3; i++) { const q = pickEdge(6); if (q) place(q[0], q[1], 'bones'); }
      } else {
        for (let i = 0; i < 6; i++) { const q = pickEdge(6); if (q) place(q[0], q[1], 'bones'); }
        for (const side of [-1, 1]) putAt(side * L * 0.35, -side * Wd * 0.45, 'brokenpillar');
      }
    }
    // a standing obstacle or two out on the open floor, sparingly (where the pools were: the owner, 2026-10-04): a
    // pillar taller than the walls, a monolith, or an empty gibbet-cage on its post. Each with open floor all round
    // (3 × 3 clear, 5 tiles from other furniture), never by a doorway, never in the entrance or the descent hall. On
    // their own stream, so the rest of a floor's dressing stands where it did.
    // (an authored kit with no such pieces, the tavern's, keeps its floors open: its middle is for the fight)
    if (r !== level.entrance && r !== level.descentRoom && !(r.dress && PLAN_OB[r.kit] && !PLAN_OB[r.kit].length)) {
      const n = 1 + (orr() < 0.5 ? 1 : 0), mid = cells.filter(([x, y, c]) => !c.corridor && Math.abs(x - r.cx) <= r.rw * 0.45 && Math.abs(y - r.cy) <= r.rh * 0.45 && hypot(x - r.cx, y - r.cy) > 4 && !nearDoor(x, y));
      // (an authored room's own set piece out on the floor, the yard's well, a cart, stands for one: the middle stays open;
      // what lies flat, the Cold Seam's rails, stands for none)
      const OBK = r.dress ? PLAN_OB[r.kit] || ['pillar'] : KIT ? KIT.obstacles : OBSTACLES, pre = r.dress ? Math.min(n, cells.filter(([x, y, c]) => { const p = world.props.get(K(x, y)); return p && p !== 'block' && !FLAT_PROPS.has(p) && (DRESS_PIECES.has(p) || OBK.includes(p)) && !c.corridor && Math.abs(x - r.cx) <= r.rw * 0.45 && Math.abs(y - r.cy) <= r.rh * 0.45 && hypot(x - r.cx, y - r.cy) > 4; }).length) : 0;
      for (let i = 0, got = pre; i < 30 && got < n && mid.length; i++) {
        const [x, y] = mid[(orr() * mid.length) | 0];
        let clear = true;
        // (what's laid flat on the floor, cracks, straw, is no furniture: it doesn't crowd an obstacle out)
        const solid = (k) => { const p = world.props.get(k); return !!p && !FLAT_PROPS.has(p); };
        for (let dy = -1; dy <= 1 && clear; dy++) for (let dx = -1; dx <= 1; dx++) { const c = level.cells.get(K(x + dx, y + dy)); if (!c || c.kind !== 'floor' || c.corridor || world.props.has(K(x + dx, y + dy))) { clear = false; break; } }
        if (!clear || [...world.props.keys()].some((k) => { if (!solid(k)) return false; const [a, b] = k.split(',').map(Number); return Math.abs(a - x) < 5 && Math.abs(b - y) < 5; })) continue;
        const OB = OBK;
        if (place(x, y, OB[(orr() * OB.length) | 0])) got++;
      }
    }
    if (r.dress) continue;                                        // (an authored room's chests, shrine and decor are its plan's)
    const nDecor = r === level.entrance ? 1 : 1 + ((prng() * 2) | 0);
    for (let i = 0; i < nDecor; i++) { const q = pickEdge(12); if (q) place(q[0], q[1], decor[(prng() * decor.length) | 0]); }
    if (prng() < 0.55) { const q = pickEdge(8); if (q) place(q[0], q[1], 'chest'); }
    // a shrine stands against a far wall, like an altar: against a near one (+x, +y: toward the camera) the
    // wall hid all of it but the orb (2026-10-01)
    if (prng() < 0.30) { const q = pickEdge(8, (x, y) => isFloor(x + 2, y) && isFloor(x, y + 2) && isFloor(x + 2, y + 2)); if (q) place(q[0], q[1], 'shrine'); }
  }
  // Chests are a find, not furniture (2026-10-01, GDD §8): the dressing above drew one in 55 % of rooms,
  // about three a floor. Each is kept at CHEST_KEEP, on its own stream, so every other piece of a floor's
  // dressing stands where it always did. Never none: a floor keeps one at least (the Tithe Mill is a
  // single floor, the same every visit, and Brannoc's paymaster hid his coin in its chests): about one
  // a floor, now and then two or three.
  const keep = mulberry32(streamSeed(seed, 323)), chests = [...world.props].filter(([, kind]) => kind === 'chest').map(([k]) => k);
  const kept = level.plan ? chests : chests.filter(() => keep() < CHEST_KEEP);   // (an authored floor's chests are where its plan puts them)
  if (!kept.length && chests.length) kept.push(chests[Math.floor(keep() * chests.length)]);
  for (const k of chests) if (!kept.includes(k)) world.props.delete(k);
  // A kit's standing water (v1.48): a pool or two in a fighting room, shallow and walkable, on their own stream so the
  // rest of the floor stands where it did. Each a blob of open floor away from the doorways' mouths; never under a prop.
  world.pools = new Set();
  if ((KIT && KIT.pools) || level.plan) {
    const wrng = mulberry32(streamSeed(seed, 325));
    for (const r of level.rooms) {
      if (level.plan ? !(r.dress && r.dress.includes('pools')) : r === level.entrance || r === level.descentRoom) continue;   // (authored: where the plan floods)
      const n = level.plan ? 2 + ((wrng() * 2) | 0) : (wrng() * (KIT.pools + 1)) | 0;
      for (let i = 0; i < n; i++) {
        const cx = r.cx + (wrng() - 0.5) * r.rw * 0.7, cy = r.cy + (wrng() - 0.5) * r.rh * 0.7, rad = 1.6 + wrng() * 1.8, ph = wrng() * 6.28;
        for (let y = Math.floor(cy - rad - 1); y <= Math.ceil(cy + rad + 1); y++) for (let x = Math.floor(cx - rad - 1); x <= Math.ceil(cx + rad + 1); x++) {
          const c = level.cells.get(K(x, y)); if (!c || c.kind !== 'floor' || c.corridor || c.room !== r.id || (level.plan && world.props.has(K(x, y)))) continue;   // (never under a piece: the water had drowned the Crossing's shaft of daylight)
          const a = atan2(y - cy, x - cx), rr = rad * (1 + 0.25 * sin(a * 3 + ph));
          if (hypot(x - cx, y - cy) < rr) world.pools.add(K(x, y));
        }
      }
    }
  }
  // Every floor's way back up, one floor at a time: a stone stair built against the entrance
  // room's back wall (north or west, the walls you see), climbing into it. Walk up its bottom
  // steps: on the first floor it leads out to the surface, deeper to the floor above (core.js).
  world.structs = []; world.stairOwn = new Set();   // (the stairs' own pieces: their lights and set piece, never cleared from round them)
  if (level.entrance) placeStairsUp(world, level);
  if (level.descentRoom && hasFloorBelow(site, depth)) placeStairsDown(world, level);   // (a site's last floor ends in its hall)
  // the stair down's own set piece, once it's placed (docs/vale-dungeon-dressing.md): the Barrow Door's two guardians
  // either side of it; the Chancel's altar behind it, broken through, the cult's cut going down beneath
  if (world.stairwell && level.descentRoom.dress) {
    const W0 = world.stairwell, dr = level.descentRoom, put = (x, y, kind) => { const c = level.cells.get(K(x, y)); if (c && c.kind === 'floor' && c.room === dr.id && !world.props.has(K(x, y))) { world.props.set(K(x, y), kind); world.stairOwn.add(K(x, y)); } };
    if (dr.dress.includes('guardians')) { put(W0.x0 - 3, W0.y0 + 1, 'guardian'); put(W0.x1 + 2, W0.y0 + 1, 'guardian'); }
    if (dr.dress.includes('altar')) { const ax = (W0.x0 + W0.x1) >> 1; put(ax, W0.y0 - 2, 'altar'); put(W0.x0 - 1, W0.y0 - 2, 'candelabra'); put(W0.x1, W0.y0 - 2, 'candelabra'); for (const dx of [-2, 2]) put(ax + dx, W0.y0 - 1, 'cracks'); }
  }
  clearStairs(world);
  if (level.descentRoom && S.vault && !hasFloorBelow(site, depth)) placeVault(world, level, S.vault, !!S.side);
  // coming back up from the floor below, you arrive in the corridor nearest this floor's stairs
  // down: corridors are safe, and the descent room holds the floor's boss (GDD §3.1)
  if (level.descentRoom) {
    const d = level.descentRoom; let best = null, bd = Infinity;
    for (const [k, c] of level.cells) {
      if (c.kind !== 'floor' || !c.corridor || c.room >= 0) continue;   // (a room keeps its tiles where a corridor cuts in: those start its fight)
      const [x, y] = k.split(',').map(Number);
      if ([[1, 0], [-1, 0], [0, 1], [0, -1]].some(([ox, oy]) => { const n = level.cells.get(K(x + ox, y + oy)); return n && n.room === d.id; })) continue;   // (a step back from the hall's door: its gate stands on the tiles that touch it, gatesOf)
      const dd = (x - d.cx) * (x - d.cx) + (y - d.cy) * (y - d.cy);
      if (dd < bd && isWalkable(world, x + 0.5, y + 0.5)) { bd = dd; best = { x: x + 0.5, y: y + 0.5 }; }
    }
    world.stairsDownArrive = best;
  }
  const reach = keepTheWaysOpen(world, level);
  pruneUnreachable(world, reach);
  if (S.arena) { for (const [k, p] of world.props) if (p === 'chest' || p === 'shrine') world.props.delete(k); }   // (the Bowl pays marks, not loot: bowl.js)
  else if (![...world.props.values()].includes('chest')) placeOneChest(world, level, keep, reach);
  seeChests(world, level, reach);

  // Enemies arrive in waves when the party enters a room (battle.js). Each room has a
  // fixed level: the further you walk from the entrance, the harder it is.
  world.roomLevels = rankRooms(level, depth, site);
  world.gates = S.arena ? [] : gatesOf(level, world.roomLevels, site, depth);   // (the Bowl's sand: no gates, its bouts are bowl.js's)
  world.enemies = []; world.projectiles = [];
  return world;
}

// Room difficulty (GDD §3.3). Rooms are ranked by walking distance from the entrance
// (BFS over the floor); the descent room always ranks last. Every two rooms deeper is
// one level harder, and each floor down starts where the one above left off:
// room level = sites.js roomLevelAt (v1.48: a band's floor level, the two rooms before the hall one up). The entrance is
// safe (0). ROOM_LEVELS_PER_FLOOR is the old Barrows' rule, kept for older checkouts' tools.
export const ROOM_LEVELS_PER_FLOOR = 3;
function rankRooms(level, depth, site) {
  const { cells, rooms, entrance } = level, out = new Map();
  if (!entrance) return out;
  const dist = new Map(), best = new Map(), q = [];
  const start = K(Math.floor(level.spawn.x), Math.floor(level.spawn.y));
  dist.set(start, 0); q.push(start);
  for (let h = 0; h < q.length; h++) {
    const k = q[h], d = dist.get(k), c = cells.get(k), [x, y] = k.split(',').map(Number);
    if (c.room >= 0 && !(best.get(c.room) <= d)) best.set(c.room, d);
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nk = K(x + dx, y + dy), n = cells.get(nk);
      if (n && n.kind === 'floor' && !dist.has(nk)) { dist.set(nk, d + 1); q.push(nk); }
    }
  }
  if (level.plan) {                                              // an authored floor: each space at its plan's level (plans.js lv)
    const S = siteOf(site);
    for (const r of rooms) out.set(r.id, r === entrance ? 0 : S.flat ? S.base : S.base + r.lv);
    return out;
  }
  const ranked = rooms.filter((r) => r !== entrance)
    .sort((a, b) => (a === level.descentRoom) - (b === level.descentRoom) || (best.get(a.id) ?? 1e9) - (best.get(b.id) ?? 1e9) || a.id - b.id);
  out.set(entrance.id, 0);
  ranked.forEach((r, i) => out.set(r.id, roomLevelAt(site, depth, i, ranked.length)));
  return out;
}

// Dense per-level lookups. level.cells is a string-keyed Map that generateLevel fills once and
// nothing changes after (loot and growths live in mods / props), and a dungeon tile's material
// is a pure function of the level. Both were recomputed on every call — a string key, fbm noise
// — and were most of the sim's time in fights and path searches (a long walk's search ran for
// seconds on a phone). The same answers from arrays, rebuilt if the level or its seeds change.
function dense(world) {
  const L = world.level; let g = L._dense;
  if (g && g.n === L.cells.size && g.depth === world.depth && g.ss === world.ss && g.cs === world.cs) return g;
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity; const at = [];
  for (const [k, c] of L.cells) { const i = k.indexOf(','), x = +k.slice(0, i), y = +k.slice(i + 1); at.push(x, y, c);
    if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
  const w = at.length ? x1 - x0 + 1 : 0, h = at.length ? y1 - y0 + 1 : 0, cells = new Array(w * h);
  for (let i = 0; i < at.length; i += 3) cells[(at[i + 1] - y0) * w + (at[i] - x0)] = at[i + 2];
  g = { n: L.cells.size, depth: world.depth, ss: world.ss, cs: world.cs, x0, y0, w, h, cells, mat: new Array(w * h) };
  Object.defineProperty(L, '_dense', { value: g, writable: true, configurable: true, enumerable: false });   // never in a snapshot or a hash
  return g;
}
const cellAt = (world, x, y) => { const g = dense(world), i = x - g.x0, j = y - g.y0; return i >= 0 && j >= 0 && i < g.w && j < g.h ? g.cells[j * g.w + i] : undefined; };
function NONWALK_OK(world, x, y) { return !NONWALK.has(materialAt(world, x, y)); }

// ...and never none even when the dressing drew none, or the stairs or the pruning took the last (2026-10-03: one
// Barrows first floor in 25, one third floor in 6, a quarter to half of the Sunken Chapel's; the Barrows' first floor then hid its
// Chronicle fragment in the hall while Ilse's errand said "the chests on the first floor"). One goes against a wall
// of a fighting room you can walk to, clear of the doorways and the furniture, drawn on the keep stream: every
// floor that kept a chest is the same as before.
// The floor's gates (GDD §3.4, v1.70, v1.118; the owner, 2026-11-11: "A gate prevents a player from moving to the next room
// until they have survived 20 waves. Then the gate drops down into the ground and disappears. Once open, always open for
// that game slot"; and 2026-11-15: "There should be a gate between every dungeon room not just the final room, 10 waves to
// open"). The rooms stand in rings out from the entrance, a ring each corridor walked (roomRings): the first ring is open
// to the entrance (it has no waves to win anything with); every room past it has a gate across every way into it, the
// corridor's tiles that touch it, won by holding GATE_WAVES waves in one visit of a room of the ring before it that
// leads there. The floor's last hall's gate keeps its id (`site:depth`, the v41 saves'); another room's is
// `site:depth:room`. A hall straight off the entrance is won, as before, in the floor's hardest rooms. Opened, a gate is
// open for good in this slot (state.gates); shut, its tiles can't be walked (isWalkable, world.gateShut: core.js sets it
// from the slot on every floor built). The hall's open opens them all: a floor walked to its end is yours. No room to win
// one in (the Mere Tower's landings, a room past a room without waves): no gate. Pure: the same floor gives the same gates.
export const GATE_WAVES = 10;
/** @typedef {{ id: string, room: number, cells: string[], rooms: number[], waves: number, hall: boolean }} Gate */
/** the tiles touching a room from outside it (its doors: a corridor's floor) @param {any} level @param {number} id */
function doorsOf(level, id) {
  const cells = [];
  for (const [k, c] of level.cells) {
    if (c.kind !== 'floor' || c.room !== id) continue;
    const [x, y] = k.split(',').map(Number);
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const q = K(x + dx, y + dy), n = level.cells.get(q); if (n && n.kind === 'floor' && n.room < 0 && !cells.includes(q)) cells.push(q); }
  }
  return cells;
}
/** the rooms a room's doors lead to, along the corridors (not through another room) @param {any} level @param {number} id @param {string[]} doors */
function roomsOff(level, id, doors) {
  const seen = new Set(doors), Q = [...doors], out = [];
  while (Q.length) {
    const [x, y] = Q.shift().split(',').map(Number);
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const q = K(x + dx, y + dy), n = level.cells.get(q);
      if (!n || n.kind !== 'floor' || seen.has(q) || n.room === id) continue;
      if (n.room >= 0) { if (!out.includes(n.room)) out.push(n.room); continue; }
      seen.add(q); Q.push(q);
    }
  }
  return out;
}
/** @returns {Gate[]} */
export function gatesOf(level, roomLevels, site, depth) {
  const E = level.entrance, D = level.descentRoom; if (!E) return [];
  const doors = new Map(), off = new Map();
  for (const r of level.rooms) { const d = doorsOf(level, r.id); doors.set(r.id, d); off.set(r.id, roomsOff(level, r.id, d)); }
  // the rings: the entrance 0, the rooms off it 1, and so on, each a corridor's walk on
  const ring = new Map([[E.id, 0]]), Q = [E.id];
  while (Q.length) { const a = /** @type {number} */ (Q.shift()); for (const b of off.get(a) || []) if (!ring.has(b)) { ring.set(b, /** @type {number} */ (ring.get(a)) + 1); Q.push(b); } }
  const fights = (id) => id !== E.id && (roomLevels.get(id) || 0) > 0;
  /** @type {Gate[]} */ const out = [];
  for (const r of level.rooms) {
    const n = ring.get(r.id), cells = doors.get(r.id) || [], hall = r === D;
    if (r === E || n === undefined || !cells.length) continue;
    let rooms = n >= 2 ? (off.get(r.id) || []).filter((q) => ring.get(q) === n - 1 && fights(q)) : [];
    // (a hall straight off the entrance, its corridor leading nowhere else: the floor's hardest room wins it, wherever it is)
    if (hall && !rooms.length) { let top = 0; for (const q of level.rooms) { const lv = roomLevels.get(q.id) || 0; if (q === D || !fights(q.id)) continue; if (lv > top) { top = lv; rooms = []; } if (lv === top) rooms.push(q.id); } }
    if (!rooms.length) continue;                                    // (the Mere Tower: its landings are its waves)
    out.push({ id: hall ? `${site}:${depth}` : `${site}:${depth}:${r.id}`, room: r.id, cells, rooms, waves: GATE_WAVES, hall });
  }
  return out;
}
/** the tiles a floor's gates still shut, given which are open; null when none (or the hall's is open: the floor is yours)
 *  @param {Gate[]} gates @param {(id: string) => boolean} isOpen @returns {Set<string> | null} */
export function gateShutOf(gates, isOpen) {
  if (!gates || !gates.length || gates.some((g) => g.hall && isOpen(g.id))) return null;
  const s = new Set(); for (const g of gates) if (!isOpen(g.id)) for (const c of g.cells) s.add(c);
  return s.size ? s : null;
}
/** is this gate still up on this floor? @param {any} w @param {Gate} g */
export const gateUp = (w, g) => !!(w && w.gateShut && g.cells.some((c) => w.gateShut.has(c)));
/** the floor's last hall's gate, or null (the compass, the raid, the old single gate's readers) @param {any} w */
export const hallGate = (w) => (w && w.gates ? w.gates.find((g) => g.hall) || null : null);

// A chest is seen whole (the owner, 2026-11-11: "Chests should always be visible to the player not tucked against a
// southern wall so you can barely see the top"; level-design-rules.md §4.4): the camera looks from the south-east, so a
// wall on a chest's near side (+x, +y, within two tiles) stood between them and showed its lid at most, as it had a
// shrine's (whose placement has kept the near side clear since 2026-10-01). Every chest placed (a room's plan, the
// dressing, a floor's one at least) is moved, if it must be, to the nearest free tile of its room that's clear there and
// reachable; a vault's key goes with it. No draw: nothing else on the floor moves.
/** is the near side of a tile open (+x, +y: toward the camera), two tiles out? */
export const nearClear = (level, x, y) => [[1, 0], [2, 0], [0, 1], [0, 2], [1, 1], [2, 1], [1, 2]].every(([dx, dy]) => { const c = level.cells.get(K(x + dx, y + dy)); return !!c && c.kind === 'floor'; });
// (the owner, 2026-11-12, of one on the Old Barrows' second floor still out of sight: two tiles weren't enough. A
// dungeon's walls stand four steps over its floor, about two units, and the camera looks down at 30°: the line from a
// chest's middle clears a wall's top only some four tiles back along the camera's line. So a chest also has the band
// along that line open, SIGHT tiles out (sightRun), or, where its room has no such tile, the longest it has. Measured
// on eleven floors, tools/capture/visibility.mjs: four chests under half in view before, every one nearly whole after.)
export const SIGHT = 4;
/** how far the band along the camera's line (+x+y, three cells wide) runs open from a tile, up to n: floor, and nothing
 * stood on it (the Barrows' clerks' desks hid the chest behind them as a wall had) @param {any} world @param {any} level
 * @param {number} x @param {number} y */
export function sightRun(world, level, x, y, n = SIGHT) {
  const fl = (a, b) => { const c = level.cells.get(K(a, b)); return !!c && c.kind === 'floor'; };
  // (furniture a tile wider: a long piece is one prop tile, its model longer, the shelves beside that same chest)
  const bare = (i) => { for (let a = -1; a <= 1; a++) for (let b = -1; b <= 1; b++) { const k = K(x + i + a, y + i + b); if ((a || b || i) && k !== K(x, y) && world.props.has(k)) return false; } return true; };
  let i = 0; while (i < n && fl(x + i + 1, y + i + 1) && fl(x + i, y + i + 1) && fl(x + i + 1, y + i) && bare(i + 1)) i++;
  return i;
}
function seeChests(world, level, reach) {
  for (const [k, kind] of [...world.props]) {
    if (kind !== 'chest') continue;
    const [x, y] = k.split(',').map(Number), c0 = level.cells.get(k);
    if (!c0 || (nearClear(level, x, y) && sightRun(world, level, x, y) >= SIGHT)) continue;
    let best = null, bd = Infinity, br = nearClear(level, x, y) ? sightRun(world, level, x, y) : -1;   // (better than it stands, or it stays)
    for (const [q, c] of level.cells) {
      if (c.kind !== 'floor' || c.corridor || c.room !== c0.room || world.props.has(q)) continue;
      const [tx, ty] = q.split(',').map(Number), d = (tx - x) * (tx - x) + (ty - y) * (ty - y);
      if (!reach(tx, ty) || !NONWALK_OK(world, tx, ty) || resourceAt(world, tx, ty) || !nearClear(level, tx, ty)) continue;
      const r = sightRun(world, level, tx, ty);
      if (r < br || (r === br && d >= bd)) continue;
      br = r; bd = d; best = q;
    }
    if (!best) continue;                                          // (no such tile in the room: it stays)
    world.props.delete(k); world.props.set(best, 'chest');
    if (world.vault && world.vault.key === k) world.vault.key = best;
  }
}
function placeOneChest(world, level, keep, reach) {
  const floorAt = (x, y) => { const c = level.cells.get(K(x, y)); return !!c && c.kind === 'floor'; };
  const spots = [], loose = [], ent = level.entrance ? level.entrance.id : -1;
  for (const [k, c] of level.cells) {
    if (c.kind !== 'floor' || c.corridor || c.room < 0 || c.room === ent || world.props.has(k)) continue;
    const [x, y] = k.split(',').map(Number);
    if (!reach(x, y) || !NONWALK_OK(world, x, y) || resourceAt(world, x, y)) continue;
    let wall = false, door = false, crowd = false;
    for (let dy = -4; dy <= 4; dy++) for (let dx = -4; dx <= 4; dx++) {
      const n = level.cells.get(K(x + dx, y + dy)), d = Math.max(Math.abs(dx), Math.abs(dy));
      if (d <= 2 && !(n && n.kind === 'floor')) wall = true;
      if (n && n.kind === 'floor' && n.room < 0) door = true;
      if (d <= 2 && world.props.has(K(x + dx, y + dy))) crowd = true;
    }
    if (crowd) continue;
    if (wall && !door && floorAt(x + 1, y) && floorAt(x - 1, y) && floorAt(x, y + 1) && floorAt(x, y - 1)) spots.push(k); else loose.push(k);
  }
  const from = spots.length ? spots : loose;
  if (from.length) world.props.set(from[Math.floor(keep() * from.length)], 'chest');
}

// A chest or shrine is only worth placing where you can walk up to it. Decor, pools and walls can close off
// a pocket of a room (a chest you could see and never open: Barrows floor 2, seed 20260807, found by the
// M5 loot farm); one no walkable tile reaches from the way in is taken out again. reach: keepTheWaysOpen's.
function pruneUnreachable(world, reach) {
  for (const [k, kind] of [...world.props]) {
    if (kind !== 'chest' && kind !== 'shrine') continue;
    const [x, y] = k.split(',').map(Number); let near = false;
    for (let dy = -1; dy <= 1 && !near; dy++) for (let dx = -1; dx <= 1 && !near; dx++) if ((dx || dy) && reach(x + dx, y + dy)) near = true;
    if (!near) world.props.delete(k);
  }
}

// The ways a floor must keep open, from the way in: the stairs down (from anywhere on the
// stairwell's rim) or a last hall's vault chest, the stair up, and where you arrive coming back up.
// Corridors are kept dry, but a room's pools aren't: a sweep of 200 floors as the game builds them
// found the stair up standing behind a pool on 26, so once down there was no walking out (Sunken
// Chapel floor 2, game seed 23757). Any way that's shut gets the fewest tiles of pool between it and the
// rest drained (world.dry: plain floor there, 3 wide, so a party walks it), and decor in the way is
// taken out. Floors that were already open are as they were.
// Returns what's open from the way in, for pruneUnreachable: (x, y) → true.
function keepTheWaysOpen(world, level) {
  const sx = Math.floor(level.spawn.x), sy = Math.floor(level.spawn.y);
  const ends = [];   // each way: the tiles you'd stand on to use it
  const around = (x, y) => { const o = []; for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) if (dx || dy) o.push([x + dx, y + dy]); return o; };
  const S = world.stairwell;   // the stairs are used from anywhere on the stairwell's rim (core.js REACH)
  if (S) { const rim = []; for (let y = S.y0 - 1; y <= S.y1; y++) for (let x = S.x0 - 1; x <= S.x1; x++) if (x < S.x0 || x >= S.x1 || y < S.y0 || y >= S.y1) rim.push([x, y]); ends.push(rim); }
  else if (world.stairsAt) ends.push(around(world.stairsAt.x, world.stairsAt.y));
  if (world.vault) { const [x, y] = world.vault.key.split(',').map(Number); ends.push(around(x, y)); }
  for (const a of [world.exitAt, world.stairArrive, world.stairsDownArrive]) if (a) { const x = Math.floor(a.x), y = Math.floor(a.y); ends.push([[x, y], ...around(x, y)]); }   // (within reach is enough: core.js)
  const DECOR = new Set(['spire', 'monolith', 'totem', 'crates', 'barrels', 'sacks', 'bedroll', 'pillar', 'brokenpillar', 'sarcophagus', 'bones', 'pew', 'gibbet',
    'spoil', 'lantern', 'urnshelf', 'urns', 'candles', 'rack', 'standard', 'banner', 'tent', 'bunk', 'scaffold', 'stalagmite', 'boulder', 'altar', 'saint', 'chains', 'bound', 'font', 'boat', 'reeds', 'windlass', 'vat', ...DRESS_PIECES]);
  const floorAt = (x, y) => { const c = level.cells.get(K(x, y)); return !!c && c.kind === 'floor'; };
  // a tile's cost to open: 0 walkable, 1 a pool or decor to clear, Infinity never (walls, the well, chests)
  const cost = (x, y) => {
    if (isWalkable(world, x + 0.5, y + 0.5)) return 0;
    if (!floorAt(x, y) || resourceAt(world, x, y)) return Infinity;
    const p = world.props.get(K(x, y));
    if (p) return DECOR.has(p) ? 1 : Infinity;
    return NONWALK.has(materialAt(world, x, y)) ? 1 : Infinity;
  };
  const N4 = [[1, 0], [-1, 0], [0, 1], [0, -1]];
  // what's open from the arrival, on the level's dense grid (a string-keyed flood cost every floor 40 ms)
  const g = dense(world), at = (x, y) => (x < g.x0 || y < g.y0 || x >= g.x0 + g.w || y >= g.y0 + g.h ? -1 : (y - g.y0) * g.w + (x - g.x0));
  const flood = () => {
    const seen = new Uint8Array(g.w * g.h), q = new Int32Array(g.w * g.h); let n = 0;
    const s0 = at(sx, sy); if (s0 < 0) return seen; seen[s0] = 1; q[n++] = s0;
    for (let h = 0; h < n; h++) {
      const i = q[h], x = g.x0 + (i % g.w), y = g.y0 + ((i / g.w) | 0);
      for (const [dx, dy] of N4) { const j = at(x + dx, y + dy); if (j >= 0 && !seen[j] && g.cells[j] && g.cells[j].kind === 'floor' && isWalkable(world, x + dx + 0.5, y + dy + 0.5)) { seen[j] = 1; q[n++] = j; } }
    }
    return seen;
  };
  let open = flood();
  for (const end of ends) {
    if (end.some(([x, y]) => open[at(x, y)] === 1)) continue;   // (nearly every floor: nothing to do)
    // 0-1 search from the arrival (a deque as two stacks): the cheapest way to any tile of this end
    const goal = new Set(end.map(([x, y]) => K(x, y))), dist = new Map([[K(sx, sy), 0]]), prev = new Map();
    let front = [[sx, sy]], back = [], hit = null;
    for (;;) {
      if (!front.length) { if (!back.length) break; front = back.reverse(); back = []; }
      const [x, y] = front.pop(), k = K(x, y), d = dist.get(k);
      if (goal.has(k) && cost(x, y) === 0) { hit = k; break; }
      for (const [dx, dy] of N4) {
        const nx = x + dx, ny = y + dy, nk = K(nx, ny), c = cost(nx, ny);
        if (c === Infinity || dist.has(nk) && dist.get(nk) <= d + c) continue;
        dist.set(nk, d + c); prev.set(nk, k);
        (c === 0 ? front : back).push([nx, ny]);
      }
    }
    if (!hit) { for (const k of goal) if (dist.has(k) && floorAt(...k.split(',').map(Number)) && !world.props.has(k)) { hit = k; break; } }
    if (!hit || dist.get(hit) === 0) continue;
    // open the way: every costly tile on it, and its floor neighbours (3 wide)
    world.dry = world.dry || new Set();
    for (let k = hit; k; k = prev.get(k)) {
      const [x, y] = k.split(',').map(Number); if (cost(x, y) === 0) continue;
      for (const [ax, ay] of [[x, y], [x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]]) {
        const ak = K(ax, ay); if (!floorAt(ax, ay)) continue;
        if (DECOR.has(world.props.get(ak) || '')) world.props.delete(ak);
        world.dry.add(ak);
      }
    }
    level._dense.mat = new Array(level._dense.w * level._dense.h);   // materials are cached: drop them
    open = flood();
  }
  return (x, y) => open[at(x, y)] === 1;
}

// A vault site's last hall keeps its heirloom in a chest (sites.js `vault`): on the open tile nearest the
// hall's middle, where the stairs down would be. world.vault = { key, heirloom }. (v1.151) A side vault's (`side`: its
// keepsake) stands at the back wall's middle instead: its end room is fought in, and its middle is kept open
function placeVault(world, level, heirloom, back = false) {
  const r = level.descentRoom, tx = r.cx, ty = back ? r.cy - r.rh + 2 : r.cy; let best = null, bd = Infinity;
  for (const [k, c] of level.cells) {
    if (c.kind !== 'floor' || c.room !== r.id || world.props.has(k)) continue;
    const [x, y] = k.split(',').map(Number), d = (x - tx) * (x - tx) + (y - ty) * (y - ty);
    if (d < bd && !NONWALK.has(materialAt(world, x, y)) && !NONWALK.has(materialAt(world, x, y + 1))) { bd = d; best = k; }
  }
  if (!best) return;
  world.props.set(best, 'chest'); world.vault = { key: best, heirloom };
}

// Every floor's way down: a stairwell 6 tiles by 6 in the descent room (the 'stairsdown_0'
// structure), going down toward −y from its open +y edge, with a brazier either side of the top.
// Its tiles are props, so nothing walks over the hole: 'stairs' is the top step (the one to use;
// world.stairsAt) and the rest 'stairwell' (tapping any of them uses the stairs too, core.js). It
// sits as near the room's middle as fits (an L-shaped room's middle can be its notch), with the
// row in front cleared of decor so you can walk up to it. No room for it: the single 'stairs' tile.
const WELL = 6;
function placeStairsDown(world, level) {
  const r = level.descentRoom, fits = (x, y) => { const c = level.cells.get(K(x, y)); return c && c.kind === 'floor' && c.room === r.id; };
  const clear = (ax, ay) => {
    for (let y = ay; y <= ay + WELL; y++) for (let x = ax - 1; x <= ax + WELL; x++) if (!fits(x, y)) return false;
    for (let x = ax; x < ax + WELL; x++) if (NONWALK.has(materialAt(world, x, ay + WELL))) return false;   // a pool across the way in
    return true;
  };
  let at = null;
  for (let d = 0; d <= 8 && !at; d++) for (let dy = -d; dy <= d && !at; dy++) for (let dx = -d; dx <= d && !at; dx++)
    if (Math.max(Math.abs(dx), Math.abs(dy)) === d && clear(r.cx - WELL / 2 + dx, r.cy - WELL / 2 + dy)) at = [r.cx - WELL / 2 + dx, r.cy - WELL / 2 + dy];
  if (!at) { world.props.set(K(r.cx, r.cy), 'stairs'); world.stairsAt = { x: r.cx, y: r.cy }; return; }
  const [x0, y0] = at, x1 = x0 + WELL, y1 = y0 + WELL;
  for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) world.props.set(K(x, y), 'stairwell');
  for (let x = x0; x < x1; x++) world.props.delete(K(x, y1));
  world.props.set(K(x0 - 1, y1 - 1), 'brazier'); world.props.set(K(x1, y1 - 1), 'brazier'); world.stairOwn.add(K(x0 - 1, y1 - 1)); world.stairOwn.add(K(x1, y1 - 1));
  world.stairsAt = { x: x0 + WELL / 2, y: y1 - 1 };
  world.props.set(K(world.stairsAt.x, world.stairsAt.y), 'stairs');
  world.stairwell = { x0, y0, x1, y1 };                                  // the opening, in tiles
  world.structs.push({ id: 'stairsdown_0', x: x0 + WELL / 2, y: y0 + WELL / 2, hole: true });
}

// The stairs' ground cleared (docs/level-design-rules.md §4.4, keepclear.js stairZone): every piece of dressing on a stair,
// within STAIR_CLEAR of it or on its approach is taken up (the dressing is laid before the stairs are placed, and a heap of
// barrels stood on the way up). What isn't dressing stays: the stairs themselves, their own lights and set piece, a chest,
// a lamp, the found. A shrine there goes too (2026-11-13: one stood on the way up in 2 of 48 floors of the Fens' halls,
// the Mound's and the Canal Locks'; it's set against a wall, and the entrance's wall is the stair's).
const DRESSING = (kind) => LIGHT.has(kind) || REPEAT_CAPPED.has(kind) || DRESS_PIECES.has(kind) || STAIR_CLEARS.has(kind);
const STAIR_CLEARS = new Set(['spire', 'monolith', 'totem', 'crates', 'barrels', 'sacks', 'bedroll', 'pillar', 'brokenpillar', 'sarcophagus', 'bones', 'pew', 'gibbet', 'spoil',
  'urnshelf', 'urns', 'rack', 'standard', 'banner', 'tent', 'bunk', 'scaffold', 'stalagmite', 'boulder', 'saint', 'chains', 'bound', 'font', 'boat', 'reeds', 'windlass', 'vat',
  'scorch', 'cracks', 'puddle', 'straw', 'hay', 'rug', 'coins', 'papers', 'cookfire', 'web', 'cobweb', 'rubble', 'rope', 'net', 'fishcrates', 'crane']);
function clearStairs(world) {
  for (const k of stairZone(world)) { const p = world.props.get(k); if (p && !STAIR_OWN.has(p) && !world.stairOwn.has(k) && (DRESSING(p) || p === 'shrine')) world.props.delete(k); }
}

// Find a stretch of the entrance room's north (−y) or west (−x) wall with room for the
// stair (3 wide × 7 deep of plain room floor in front of a standing wall), nearest the
// room's middle. Places the 'stairsup' structure and the exit trigger at its foot.
function placeStairsUp(world, level) {
  const r = level.entrance, cells = level.cells, isFloor = (x, y) => { const c = cells.get(K(x, y)); return c && c.kind === 'floor' && !c.corridor && c.room === r.id; };
  const isWall = (x, y) => { const c = cells.get(K(x, y)); return c && c.kind === 'wall' && (c.wz ?? WALL_Z) >= WALL_Z - 1; };
  let best = null;
  for (let y = r.cy - r.rh; y <= r.cy + r.rh; y++) for (let x = r.cx - r.rw; x <= r.cx + r.rw; x++) {
    for (const side of ['n', 'w']) {
      let ok = true;
      for (let a = -1; a <= 1 && ok; a++) {
        if (side === 'n') { if (!isWall(x + a, y - 1)) ok = false; for (let d = 0; d < 7 && ok; d++) if (!isFloor(x + a, y + d)) ok = false; }
        else { if (!isWall(x - 1, y + a)) ok = false; for (let d = 0; d < 7 && ok; d++) if (!isFloor(x + d, y + a)) ok = false; }
      }
      if (!ok) continue;
      const score = Math.abs(x - r.cx) + Math.abs(y - r.cy) + (side === 'n' ? 0 : 0.5);
      if (!best || score < best.score) best = { x, y, side, score };
    }
  }
  if (!best) return;
  const { x, y, side } = best;
  if (side === 'n') { world.structs.push({ id: 'stairsup_0', x: x + 0.5, y: y + 3.1 }); world.exitAt = { x: x + 0.5, y: y + 5.6 }; }
  else { world.structs.push({ id: 'stairsup_90', x: x + 3.1, y: y + 0.5 }); world.exitAt = { x: x + 5.6, y: y + 0.5 }; }
  // arrive a few steps out from the foot of the stair, facing into the room
  world.stairArrive = side === 'n' ? { x: x + 0.5, y: y + 10.5 } : { x: x + 10.5, y: y + 0.5 };
}

// Elevation: floor platforms sit at FLOOR_Z, walls tower at WALL_Z, the abyss is 0.
export function heightAt(world, x, y) {
  if (world.kind !== 'dungeon') return oHeightAt(world, x, y);
  const c = cellAt(world, Math.floor(x), Math.floor(y));
  if (!c) return 0;
  return c.kind === 'wall' ? (c.wz ?? WALL_Z) : FLOOR_Z;
}

// Material: abyss off-platform, the theme's wall on the ring, else a noise-picked floor material. (Rooms had
// the theme's hazard pools cut into them, impassable and spreading with depth: the owner, 2026-10-04, "Its too
// hard now to navigate a room". Every floor tile walks now; a few standing obstacles stand in for them, below.
// THEMES keeps each theme's hazard for the ground hazard to come, M8.6.)
export function materialAt(world, x, y) {
  if (world.kind !== 'dungeon') return oMaterialAt(world, x, y);
  const tx = Math.floor(x), ty = Math.floor(y), c = cellAt(world, tx, ty);
  if (!c) return MAT.ABYSS;
  const g = world.level._dense, idx = (ty - g.y0) * g.w + (tx - g.x0), known = g.mat[idx];   // (cellAt built g)
  if (known !== undefined) return known;
  const th = world.level.th;
  let m;
  if (c.kind === 'wall') m = th.wall;
  else { const bag = th.floors; m = bag[clampi(Math.floor(fbm(tx * 0.11, ty * 0.11, world.ss) * bag.length), 0, bag.length - 1)]; }
  g.mat[idx] = m; return m;
}

// Harvestable growths — obsidian shards along the wall bases of rooms (never corridors,
// open floor, hazards, or void). Mods overlay removals.
export function resourceAt(world, x, y) {
  if (world.kind !== 'dungeon') return null;
  const k = K(x, y);
  if (world.mods.has(k) || world.props.has(k)) return null;
  const c = cellAt(world, x, y);
  if (!c || c.kind !== 'floor' || c.corridor) return null;
  const m = materialAt(world, x, y);
  if (NONWALK.has(m)) return null;
  // shards grow at the foot of walls (within 2 tiles of the room's edge), never out in
  // the open floor where they'd litter the battle arena
  const r = hash2(x, y, streamSeed(world.seed, STREAM.WORLD) + 888);
  if (r <= 0.955) return null;
  for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) {
    const n = cellAt(world, x + dx, y + dy);
    if (!n || n.kind !== 'floor') return 'rock';
  }
  return null;
}

// Props: room decor + functional gates/loot. A looted chest / spent shrine is
// consumed via the mods overlay (opened) and stops rendering + blocking.
export function propAt(world, x, y) {
  const k = K(x, y), m = world.mods.get(k);
  if (m?.opened) return null;
  if (m?.cage) return 'cage';                       // a harvester's lantern-cage where it fell (lamps.js; kept in the mods, so saved)
  return world.props.get(k) || null;
}
export const CONSUMABLE_PROP = new Set(['chest', 'shrine']);

// Walkable if on a floor cell whose material isn't a hazard, the step up is at
// most one level (walls are far taller), and nothing occupies the tile.
export const MAX_CLIMB = 1;
export function isWalkable(world, x, y, fromZ) {
  if (world.kind !== 'dungeon') return oIsWalkable(world, x, y);
  const tx = Math.floor(x), ty = Math.floor(y), c = cellAt(world, tx, ty);
  if (!c || c.kind !== 'floor') return false;
  if (NONWALK.has(materialAt(world, tx, ty))) return false;
  if (fromZ !== undefined && heightAt(world, tx, ty) - fromZ > MAX_CLIMB) return false;
  if (resourceAt(world, tx, ty)) return false;
  const pr = propAt(world, tx, ty); if (pr && !FLAT_PROPS.has(pr)) return false;   // (a dropped cage, a binding circle: underfoot, never in the way)
  if (world.gateShut && world.gateShut.has(K(tx, ty))) return false;              // (a gate of the floor's, still up: gatesOf)
  return true;
}

export const chunkOf = (t) => Math.floor(t / CHUNK);

export function hitResource(world, tx, ty) {
  const kind = resourceAt(world, tx, ty);
  if (!kind) return null;
  const key = K(tx, ty);
  const left = (world.hp.get(key) ?? 3) - 1;
  if (left <= 0) { world.hp.delete(key); world.mods.set(key, { cleared: true }); return { destroyed: true, kind }; }
  world.hp.set(key, left);
  return { destroyed: false, kind };
}
