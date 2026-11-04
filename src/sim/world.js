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
};
// An authored room (plans.js), dressed for what it was (the dressing pass: docs/vale-dungeon-dressing.md). Its plan's
// `dress` names the pieces; each name is a small recipe here, placed by the room's own axes: u along its length, v
// across it, v < 0 the back wall (north or west: the walls the camera sees, where the tall pieces stand) and v > 0 the
// near wall (cut to stubs toward the camera: only low pieces, or they'd stand between the camera and the fight). The
// middle is kept open for the fight; the pieces go in the thirds and at the walls, a focal piece on the room's axis.
// A piece that runs along a wall comes in two (`<kind>` along x, `<kind>_y` along y: gsprite.js), picked by the wall it's
// on. A big piece's footprint past its own tile is `block` (stands in the way, draws nothing).
const ORIENT = new Set(['rack', 'urnshelf', 'standard', 'banner', 'scaffold', 'stall', 'trough', 'portcullis', 'iron_door', 'desk', 'shelf', 'shoring', 'hives', 'bench', 'fallen_door', 'bars', 'cask_rack']);
/** the pieces the dressing pass added (keepTheWaysOpen clears them like any decor when they shut a way) */
export const DRESS_PIECES = new Set(['stall', 'hay', 'trough', 'hen_cart', 'well', 'cart', 'portcullis', 'iron_door', 'desk', 'shelf', 'pit', 'ladder', 'shoring', 'hives', 'bench',
  'fallen_door', 'bars', 'strongbox', 'map_table', 'ledgers', 'stockade', 'guardian', 'sarcophagus_open', 'cask_rack', 'torch', 'candelabra', 'cookfire', 'block',
  ...[...ORIENT].map((k) => k + '_y')]);
// what lights a doorway, by the room's kit (a brazier each side, before, in every room: the screen was a field of
// identical fires; now the light says the place): the dig's lanterns on poles, the crypt's candles, the keep's and the
// barracks' torches, the cellars' lanterns, the chapel's candelabra, the cut's candles
/** the Breach's fallen columns (u, v as fractions of the room's half-length and half-width) */
const FALLEN = [[-0.3, 0.25], [0.3, -0.25]];   // (two columns down across the passage, either side of its middle: chosen among eight layouts by the balance contract, docs/vale-dungeon-dressing.md)
const DOOR_LIGHT = { dig: 'lantern', gallery: 'candles', muster: 'torch', bailey: 'torch', barracks: 'torch', cellar: 'lantern', nave: 'candelabra', cultcut: 'candles', binding: 'candles' };
const PLAN_THEME = { dig: 'dig', gallery: 'gallery', muster: 'muster', bailey: 'bailey', barracks: 'barracks', cellar: 'cellar', cave: 'cave', nave: 'nave', cultcut: 'cultcut', binding: 'binding' };
const PLAN_KIND = { candles: 'candles', lanterns: 'lantern', spoil: 'spoil', crates: 'crates', sacks: 'sacks', windlass: 'windlass', chains: 'chains', gibbets: 'gibbet', bedrolls: 'bedroll', saints: 'saint', skulls: 'bones' };
function dressPlanned(r, { putAt, pickEdge, place, L, Wd, along }) {
  const at = (n, gap, kind) => { for (let i = 0; i < n; i++) { const q = pickEdge(gap); if (q) place(q[0], q[1], kind); } };
  const wall = Wd - 1.5, alongK = (k) => (ORIENT.has(k) && !along ? k + '_y' : k), acrossK = (k) => (ORIENT.has(k) && along ? k + '_y' : k);
  const row = (v, from, to, step, kind) => { for (let u = from; u <= to + 0.01; u += step) putAt(u, v, alongK(kind)); };
  // a big piece and its footprint: the tiles behind it (toward the back, −x and −y, where its sprite stands over)
  const big = (u, v, kind, w = 2, h = 2) => { putAt(u, v, kind); for (let a = 0; a < w; a++) for (let b = 0; b < h; b++) if (a || b) putAt(along ? u - a : u - b, along ? v - b : v - a, 'block'); };
  const has = (d) => r.dress.includes(d);
  for (const d of r.dress) {
    switch (d) {
      // ── the Old Barrows: the Redhand's dig, then the legion's crypt
      case 'camp': big(-L * 0.25, -Wd * 0.25, 'cookfire', 1, 1); for (const [a, b] of [[1, 0], [0, 1], [1, 1]]) putAt(-L * 0.25 + a, -Wd * 0.25 + b, 'scorch');
        putAt(-L * 0.25 - 3, -Wd * 0.25 + 2, 'bedroll'); putAt(-L * 0.25 + 3, -Wd * 0.25 - 2, 'bedroll');
        for (const s of [-1, 1]) putAt(s * L * 0.4, Wd * 0.1, 'brazier'); break;   // (the camp's fire-baskets either side: the way in is the dungeon's first look, and on the cookfire alone it was a third darker)
      case 'tents': for (let u = -L * 0.6; u <= L * 0.6 + 0.01; u += 14) { putAt(u, -(Wd - 3), 'tent'); putAt(u + 3, -(Wd - 6), 'bedroll'); } break;
      case 'timbers': row(-wall, -L * 0.7, L * 0.7, 7, 'shoring'); for (const s of [-1, 1]) putAt(s * (L - 1.5), 0, acrossK('shoring')); putAt(L * 0.55, -(wall - 1), 'ladder'); break;
      case 'barrows': putAt(L * 0.3, Wd * 0.45, 'cart'); putAt(L * 0.3 + 2, Wd * 0.45, 'sacks'); putAt(-L * 0.4, Wd * 0.5, 'sacks'); break;
      // (the Breach, the contract's arena: where the dig broke through, the passage's columns down across the floor,
      // authored, so the fight's ground is the same on every seed; the raw earth and the cracked flags at its west end)
      case 'rubble': at(3, 6, 'spoil'); for (const [u, v] of [[-0.55, 0.2], [-0.4, -0.35], [-0.65, -0.1]]) putAt(u * L, v * Wd, 'cracks');
        for (const [u, v] of FALLEN) putAt(u * L, v * Wd, 'brokenpillar'); break;
      // niches: the shelves cut in the back wall, every six paces; at the near wall the families' urns and candles, low
      // (tall shelves there stood between the camera and the fight). The same tiles either way.
      case 'niches': row(-wall, -L * 0.8, L * 0.8, 6, 'urnshelf'); { let i = 0; for (let u = -L * 0.8; u <= L * 0.8 + 0.01; u += 6) putAt(u, wall, i++ % 2 ? 'candles' : 'urns'); } break;
      case 'sarcophagi': for (const s of [-1, 1]) for (let u = -L * 0.6; u <= L * 0.6 + 0.01; u += 9) putAt(u, s * (Wd - 4), 'sarcophagus'); break;
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
      case 'braziers': for (const s of [-1, 1]) putAt(s * L * 0.4, -Wd * 0.4, 'brazier'); break;
      // ── Wickham Keep: the bailey, the barracks, the cellars and the cave under them
      case 'portcullis': putAt(-L * 0.55, -wall, alongK('portcullis')); for (const s of [-1, 1]) putAt(-L * 0.55 + s * 3, -wall + 1, 'torch'); break;
      case 'banners': for (const s of [-1, 1]) putAt(s * L * 0.5, -wall, alongK('banner')); break;
      case 'stalls': for (let u = -L * 0.75, i = 0; u <= L * 0.75 + 0.01; u += 6, i++) { putAt(u, -wall, alongK('stall')); if (i % 2 === 0) putAt(u, -wall + 2, 'hay'); putAt(u + 1, -wall + 3, 'straw'); } break;
      case 'hay': putAt(-(L - 2), Wd * 0.3, 'hay'); putAt(-(L - 2), -Wd * 0.1, 'hay'); break;
      case 'troughs': row(wall, -L * 0.5, L * 0.5, 10, 'trough'); break;
      case 'hen_cart': big(L * 0.6, Wd * 0.15, 'hen_cart', 2, 1); putAt(L * 0.6 + 2, Wd * 0.15 + 1, 'sacks'); putAt(L * 0.6 - 1, Wd * 0.15 + 2, 'straw'); break;
      case 'benches': for (const s of [-1, 1]) putAt(s * L * 0.3, Wd * 0.35, alongK('bench')); break;
      case 'cookfires': for (const s of [-1, 1]) { putAt(s * L * 0.35, -Wd * 0.05, 'cookfire'); putAt(s * L * 0.35 + 1, -Wd * 0.05 + 1, 'scorch'); putAt(s * L * 0.35 + 2, -Wd * 0.05 - 1, 'crates'); } break;
      case 'cage': big(L * 0.8, -Wd * 0.25, 'stockade', 2, 2); putAt(L * 0.8 - 3, -Wd * 0.25 + 2, 'straw'); break;
      case 'well': big(-L * 0.45, -Wd * 0.3, 'well', 2, 2); putAt(-L * 0.45 + 2, -Wd * 0.3 + 1, 'puddle'); putAt(-L * 0.45 - 3, -Wd * 0.3 + 2, 'torch'); break;   // (each set piece its own key light: in the dark, unlit, it wasn't there)
      case 'carts': putAt(L * 0.6, -wall + 1, 'cart'); putAt(L * 0.6 + 2, -wall + 1, 'sacks'); putAt(-L * 0.7, wall - 1, 'cart'); for (const [u, v] of [[0.55, 0.1], [-0.65, 0.4]]) putAt(u * L, v * Wd, 'straw'); break;
      case 'casks': row(-wall, -L * 0.6, L * 0.6, 8, 'cask_rack'); putAt(L * 0.7, wall, 'barrels'); putAt(-L * 0.7, wall, 'barrels'); break;
      case 'bunks': for (const s of [-1, 1]) for (let u = -L * 0.75; u <= L * 0.75 + 0.01; u += 6) { putAt(u, s * wall, 'bunk'); putAt(u + 3, s * (wall - 2), 'straw'); } break;
      case 'iron_door': break;                                             // (at the doorway: dressRoom, which knows the openings)
      case 'chests': at(2, 6, 'chest'); for (const s of [-1, 1]) putAt(s * L * 0.55, -wall, 'strongbox'); break;
      case 'ledger': putAt(L * 0.35, -Wd * 0.4, alongK('desk')); putAt(L * 0.35, -Wd * 0.4 + 2, 'papers'); break;
      case 'scaffold': row(-wall, -L * 0.55, 0, 9, 'scaffold'); break;
      case 'broken_floor': for (let a = -1; a <= 1; a++) for (let b = 0; b <= 1; b++) putAt(L * 0.1 + a * 2, Wd * 0.35 + b * 2, 'pit'); putAt(L * 0.1 + 4, Wd * 0.35, 'ladder'); putAt(L * 0.1 - 4, Wd * 0.35 + 2, 'spoil'); putAt(L * 0.1 - 4, Wd * 0.35 - 1, 'lantern'); break;
      case 'ladders': putAt(L * 0.75, -wall, 'ladder'); break;
      case 'stalagmites': at(6, 5, 'stalagmite'); break;
      case 'drips': for (const [u, v] of [[-0.3, -0.2], [0.2, 0.3], [-0.6, 0.35], [0.5, -0.4]]) putAt(u * L, v * Wd, 'puddle'); break;
      case 'garrows_table': big(L * 0.4, -Wd * 0.35, 'map_table', 2, 1); putAt(L * 0.4 + 1, -Wd * 0.35 + 2, 'rug'); putAt(L * 0.4 - 3, -Wd * 0.35, 'lantern'); putAt(L * 0.4 + 4, -Wd * 0.35 - 1, 'chest');
        putAt(-L * 0.45, -Wd * 0.45, 'stalagmite'); putAt(-L * 0.45 + 2, -Wd * 0.45 + 1, 'chains'); break;   // (Brannoc's stake: a chain post by a stone tooth)
      // ── the Sunken Chapel: the drowned temple, the cult's cut, the binding crypt
      case 'hives': row(-wall, -L * 0.5, L * 0.2, 7, 'hives'); break;
      case 'doors': putAt(L * 0.55, -wall, alongK('fallen_door')); putAt(L * 0.55 + 3, -wall + 1, 'fallen_door'); break;
      case 'pews': for (const s of [-1, 1]) for (const v of [0.28, 0.5]) for (let u = -L * 0.45; u <= L * 0.45 + 0.01; u += 5) putAt(u, s * Wd * v, 'pew'); break;
      case 'font': putAt(L * 0.3, -Wd * 0.25, 'font'); break;
      // (the flags cracked in a ring where the tower came down, walked over: the fallen stone at the walls, out of the fight)
      case 'light_shaft': putAt(0, 0, 'shaft'); for (let i = 0; i < 7; i++) { const a = (i / 7) * 6.2832 + 0.4; putAt(cos(a) * 6, sin(a) * 6, 'cracks'); } for (const s of [-1, 1]) putAt(s * L * 0.7, Wd * 0.6, 'spoil'); break;
      case 'altar': case 'altar_small': if (r.role === 'descent') break; putAt(L * 0.55, 0, 'altar'); for (const s of [-1, 1]) putAt(L * 0.55 - 1, s * 3, 'candelabra'); break;
      case 'ladders_cut': break;
      case 'ledgers': putAt(L * 0.6, -Wd * 0.2, 'ledgers'); putAt(L * 0.6 - 2, -Wd * 0.2 + 2, 'papers'); putAt(-L * 0.6, -Wd * 0.3, 'ledgers'); break;
      case 'bound': for (const s of [-1, 1]) for (let u = -L * 0.7; u <= L * 0.7 + 0.01; u += 5) putAt(u, s * wall, 'bound'); break;
      case 'circle': putAt(0, 0, 'circle'); break;
      case 'ring_of_pillars': for (let i = 0; i < 10; i++) { const a = (i / 10) * 6.2832; putAt(cos(a) * L * 0.62, sin(a) * Wd * 0.62, 'pillar'); } break;
      // ── the Ninth Milestone: the legion's strongroom
      case 'pay_chests': for (let u = -L * 0.75; u <= L * 0.75 + 0.01; u += 6) { putAt(u, -wall, 'strongbox'); putAt(u, wall, 'strongbox'); } break;
      case 'bars': row(-(wall - 1), -L * 0.75, L * 0.75, 6, 'bars'); break;
      case 'chest': at(1, 6, 'chest'); break;
      case 'shrine': { const q = pickEdge(8); if (q) place(q[0], q[1], 'shrine'); } break;
      default: if (PLAN_KIND[d]) at(d === 'candles' || d === 'lanterns' ? 2 : d === 'spoil' || d === 'bedrolls' ? 3 : 1, 6, PLAN_KIND[d]);
    }
  }
}

// Props you walk over (flat on the floor, or underfoot): a dropped cage, a binding circle.
export const FLAT_PROPS = new Set(['cage', 'circle', 'shaft', 'straw', 'rug', 'scorch', 'cracks', 'coins', 'papers', 'puddle']);
export function createWorld(seed, theme, depth = 0, site = 'barrows') {
  const S = siteOf(site), FAM = familyAt(site, depth), kit = dressAt(site, depth), KIT = kit ? DRESS[kit] : null;   // (its furniture below: `human`, `themes`, or its kit)
  const th = theme || themeAt(site, depth) || THEME_KEYS[(seed >>> 0) % THEME_KEYS.length];
  const level = generateLevel(seed, th, { rooms: S.rooms, layout: S.layout, plan: planFloor(site, depth) });   // (an authored floor: plans.js)
  const world = {
    kind: 'dungeon', seed, theme: th, depth, level, site, siteName: S.name, kit,
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
  const place = (px, py, kind) => {
    const k = K(px, py), c = level.cells.get(k);
    if (c && c.kind === 'floor' && !c.corridor && !world.props.has(k) && NONWALK_OK(world, px, py)) { world.props.set(k, kind); return true; }
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
    for (const o of openings) {
      const ix = Math.round(o.x) - o.dx * 2, iy = Math.round(o.y) - o.dy * 2, px = o.dy, py = o.dx;   // two steps inside, perpendicular to the corridor
      for (const s of [-1, 1]) for (let w = 4; w <= 6; w++) if (place(ix + px * s * w, iy + py * s * w, DL)) break;
    }
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
    const putAt = (u, v, kind) => { const [x, y] = at(u, v); if (!nearDoor(x, y, r.dress ? 6.5 : 8)) place(x, y, kind); };   // (an authored room keeps its doorway's mouth clear, 10 wide: 8 took most of a small room)
    if (r.dress) {                                                // an authored room (plans.js): its kit's theme, then the pieces it names
      const theme = r === level.entrance ? null : PLAN_THEME[r.shape === 'cave' && r.kit === 'cellar' ? 'cave' : r.kit] || null;
      r.theme = theme;
      dressPlanned(r, { putAt, pickEdge, place, L, Wd, along });
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
        for (const side of [-1, 1]) putAt(L * 0.15, side * Wd * 0.4, 'pew');
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
    if (r !== level.entrance && r !== level.descentRoom) {
      const n = 1 + (orr() < 0.5 ? 1 : 0), mid = cells.filter(([x, y, c]) => !c.corridor && Math.abs(x - r.cx) <= r.rw * 0.45 && Math.abs(y - r.cy) <= r.rh * 0.45 && hypot(x - r.cx, y - r.cy) > 4 && !nearDoor(x, y));
      // (an authored room's own set piece out on the floor, the yard's well, a cart, stands for one: the middle stays open)
      const OBK = KIT ? KIT.obstacles : OBSTACLES, pre = r.dress ? Math.min(n, cells.filter(([x, y, c]) => { const p = world.props.get(K(x, y)); return p && p !== 'block' && (DRESS_PIECES.has(p) || OBK.includes(p)) && !c.corridor && Math.abs(x - r.cx) <= r.rw * 0.45 && Math.abs(y - r.cy) <= r.rh * 0.45 && hypot(x - r.cx, y - r.cy) > 4; }).length) : 0;
      for (let i = 0, got = pre; i < 30 && got < n && mid.length; i++) {
        const [x, y] = mid[(orr() * mid.length) | 0];
        let clear = true;
        // (what's laid flat on the floor, cracks, straw, is no furniture: it doesn't crowd an obstacle out)
        const solid = (k) => { const p = world.props.get(k); return !!p && !FLAT_PROPS.has(p); };
        for (let dy = -1; dy <= 1 && clear; dy++) for (let dx = -1; dx <= 1; dx++) { const c = level.cells.get(K(x + dx, y + dy)); if (!c || c.kind !== 'floor' || c.corridor || world.props.has(K(x + dx, y + dy))) { clear = false; break; } }
        if (!clear || [...world.props.keys()].some((k) => { if (!solid(k)) return false; const [a, b] = k.split(',').map(Number); return Math.abs(a - x) < 5 && Math.abs(b - y) < 5; })) continue;
        const OB = KIT ? KIT.obstacles : OBSTACLES;
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
  world.structs = [];
  if (level.entrance) placeStairsUp(world, level);
  if (level.descentRoom && hasFloorBelow(site, depth)) placeStairsDown(world, level);   // (a site's last floor ends in its hall)
  // the stair down's own set piece, once it's placed (docs/vale-dungeon-dressing.md): the Barrow Door's two guardians
  // either side of it; the Chancel's altar behind it, broken through, the cult's cut going down beneath
  if (world.stairwell && level.descentRoom.dress) {
    const W0 = world.stairwell, dr = level.descentRoom, put = (x, y, kind) => { const c = level.cells.get(K(x, y)); if (c && c.kind === 'floor' && c.room === dr.id && !world.props.has(K(x, y))) world.props.set(K(x, y), kind); };
    if (dr.dress.includes('guardians')) { put(W0.x0 - 3, W0.y0 + 1, 'guardian'); put(W0.x1 + 2, W0.y0 + 1, 'guardian'); }
    if (dr.dress.includes('altar')) { const ax = (W0.x0 + W0.x1) >> 1; put(ax, W0.y0 - 2, 'altar'); put(W0.x0 - 1, W0.y0 - 2, 'candelabra'); put(W0.x1, W0.y0 - 2, 'candelabra'); for (const dx of [-2, 2]) put(ax + dx, W0.y0 - 1, 'cracks'); }
  }
  if (level.descentRoom && S.vault && !hasFloorBelow(site, depth)) placeVault(world, level, S.vault);
  // coming back up from the floor below, you arrive in the corridor nearest this floor's stairs
  // down: corridors are safe, and the descent room holds the floor's boss (GDD §3.1)
  if (level.descentRoom) {
    const d = level.descentRoom; let best = null, bd = Infinity;
    for (const [k, c] of level.cells) {
      if (c.kind !== 'floor' || !c.corridor || c.room >= 0) continue;   // (a room keeps its tiles where a corridor cuts in: those start its fight)
      const [x, y] = k.split(',').map(Number), dd = (x - d.cx) * (x - d.cx) + (y - d.cy) * (y - d.cy);
      if (dd < bd && isWalkable(world, x + 0.5, y + 0.5)) { bd = dd; best = { x: x + 0.5, y: y + 0.5 }; }
    }
    world.stairsDownArrive = best;
  }
  const reach = keepTheWaysOpen(world, level);
  pruneUnreachable(world, reach);
  if (![...world.props.values()].includes('chest')) placeOneChest(world, level, keep, reach);

  // Enemies arrive in waves when the party enters a room (battle.js). Each room has a
  // fixed level: the further you walk from the entrance, the harder it is.
  world.roomLevels = rankRooms(level, depth, site);
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
// hall's middle, where the stairs down would be. world.vault = { key, heirloom }.
function placeVault(world, level, heirloom) {
  const r = level.descentRoom; let best = null, bd = Infinity;
  for (const [k, c] of level.cells) {
    if (c.kind !== 'floor' || c.room !== r.id || world.props.has(k)) continue;
    const [x, y] = k.split(',').map(Number), d = (x - r.cx) * (x - r.cx) + (y - r.cy) * (y - r.cy);
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
  world.props.set(K(x0 - 1, y1 - 1), 'brazier'); world.props.set(K(x1, y1 - 1), 'brazier');
  world.stairsAt = { x: x0 + WELL / 2, y: y1 - 1 };
  world.props.set(K(world.stairsAt.x, world.stairsAt.y), 'stairs');
  world.stairwell = { x0, y0, x1, y1 };                                  // the opening, in tiles
  world.structs.push({ id: 'stairsdown_0', x: x0 + WELL / 2, y: y0 + WELL / 2, hole: true });
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
