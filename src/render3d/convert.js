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
import { ENV_FOOT } from '../sim/envfoot.js';
import { FLOOR_Z } from '../sim/level.js';
import { PROP_LIGHT } from '../render/gsprite.js';
import { KIT_TINT } from '../render/palette.js';

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
  // a dungeon's own stone (port step 3, by its kit): dressed walls, bare rock underfoot, standing water
  B: { top: 'crag', side: 'stone_brick', walkable: false }, U: { top: 'crag', side: 'cliff', walkable: true },
  P: { top: 'riverbed', side: 'cliff', walkable: true },
  // a built room's walls by what it was (the dressing pass): the dig's raw earth, the crypt's dressed limestone, the
  // chapel's pale sandstone under moss (the keep's and the muster's stone brick stay B)
  D: { top: 'dirt', side: 'dirt_side', walkable: false }, W: { top: 'crag', side: 'stone_wall', walkable: false },
  C: { top: 'moss_stone', side: 'sandstone_brick', walkable: false },
  // a dungeon's stairs (Luminati's stair tiles, its own characters for them): each climbs one level toward its side
  '^': { top: 'stone_tiles', side: 'stone_wall', riser: 'stone_wall', stairs: 'N', walkable: true }, v: { top: 'stone_tiles', side: 'stone_wall', riser: 'stone_wall', stairs: 'S', walkable: true },
  '>': { top: 'stone_tiles', side: 'stone_wall', riser: 'stone_wall', stairs: 'E', walkable: true }, '<': { top: 'stone_tiles', side: 'stone_wall', riser: 'stone_wall', stairs: 'W', walkable: true },
};
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
  reach: { wall: 'stone_brick', upperWall: 'brick', roof: 'roof_slate' },
  heights: { wall: 'stone_brick', upperWall: '', roof: 'roof_slate' },
};
const TREES = { oak: 'oak', autumn: 'autumn', birch: 'birch', pine: 'pine', dead: 'deadwood', alder: 'oak', willow: 'birch', carr: 'deadwood' };
// The biomes (the owner, 2026-10-31: "create assets/tiles in the new engine to cover desert/grassland, and icy/snowy
// areas"): a region's look in Luminati's own tile sets. `ground` redraws our ground's tile (outdoor.js G, by the
// grassland's character), `turf` scatters the open ground, `trees` and `stone` are the region's kinds, `mountain` the tile
// a mountain's footprint is raised in, and `env` the level's light (Luminati's arid day; its winter).
//   grassland: the Vale and the Fens, as before;  desert: the Cinder Reach (dry earth, cracked pans, red sand, scree,
//   red rock, junipers and the dead);  snow: the Pale Heights (snow, trodden paths, frozen water, snow pines, bare trees).
/** @type {Record<string, { ground: Record<string, string>, water?: string, turf: (h: number) => string, trees: Record<string, string>, stone: string, mountain: string, env: Record<string, any> }>} */
export const BIOMES = {
  grassland: { ground: {}, turf: (h) => (h < 12 ? 'G' : h < 16 ? 'f' : 'g'), trees: {}, stone: '', mountain: 'x', env: {} },
  // the Hollow Vale's: mostly Luminati's dark grass (Emberlit's Vale is olive; its bright grass is a summer's), a little bright
  vale: { ground: {}, turf: (h) => (h < 58 ? 'G' : h < 62 ? 'f' : 'g'), trees: {}, stone: '', mountain: 'x', env: {} },
  desert: { ground: { '.': 'e', c: 'Y', s: 'r', F: 'e', G: 'y', d: 'q', m: 'q' }, turf: (h) => (h < 52 ? 'a' : h < 76 ? 'y' : h < 90 ? 'e' : 'r'),
    trees: { oak: 'juniper', autumn: 'juniper', birch: 'deadwood', pine: 'juniper', deadwood: 'deadwood' }, stone: 'redrock', mountain: 'X', env: { climate: 'arid' } },
  snow: { ground: { '.': 'h', c: 'R', F: 'n', G: 'n', d: 'q', s: 'n' }, water: 'I', turf: (h) => (h < 82 ? 'n' : h < 93 ? 'h' : 'q'),   // (no green: Luminati's turf is a summer's)
    trees: { oak: 'bare', autumn: 'bare', birch: 'bare', pine: 'snowpine', deadwood: 'bare' }, stone: 'snow', mountain: 'N', env: { season: 'winter' } },
};
/** the biome a region draws in */
export const BIOME_OF = { vale: 'vale', fens: 'grassland', reach: 'desert', heights: 'snow' };
// our ground (outdoor.js G: grass dirt cobble water bank field marsh pool deck, the Reach's and the Heights' scree and
// snow) as Luminati's tile and height (snow as its pale sand: Luminati's snow stone is The Bells of Evermere's own)
const GROUND = [['g', '2'], ['.', '2'], ['c', '2'], ['~', '0'], ['s', '1'], ['F', '2'], ['G', '2'], ['o', '0'], ['b', '2'], ['d', '2'], ['s', '2']];
// MARSH_FRONT: the Sunken Chapel's water reaches this far in front of its middle (sim tiles; its porch stands dry past it).
// KEEP_FACE: Wickham Keep's door face before its middle (sim tiles: buildkit keep's front wall, 0.475 kit units, and the torch's plate).
const MARSH_FRONT = 5, KEEP_FACE = 4.8;
const RANK = { c: 4, b: 4, '~': 5, o: 5, '.': 3, F: 2, s: 2, d: 2, G: 1, g: 0 };

/**
 * The world the sim is in, as a Luminati level, and the pieces of our own art to stand in it.
 * @param {any} w the sim's world (sim.world)
 * @param {{ region?: string, stairs?: string }} [o]
 * @returns {{ level: any, ambient?: { sky: number[], ground: number[], i: number, sun: number, lamps: number }, sprites: { id?: string, prop?: string, tx?: number, ty?: number, flat?: boolean, x: number, z: number }[], origin: { x: number, y: number }, stats: Record<string, number> }}
 */
export function convertWorld(w, o = {}) {
  return w.kind === 'dungeon' ? dungeon(w, o) : outdoor(w, o.region || w.region || 'vale');
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
function frame({ name, W, D, environment, tiles, heights, objects, spawn }) {
  // (only the tiles the level uses: Luminati loads its desert's and its winter's kits for a legend that names theirs)
  const used = new Set(tiles.flat()), legend = Object.fromEntries(Object.entries(LEGEND).filter(([ch]) => used.has(ch)));
  return { format: 'luminati-level', version: 1, name, subtitle: '', author: 'Emberfall', description: 'Converted at runtime from the sim (src/render3d/convert.js).',
    width: W, depth: D, waterLevel: 0.4, water: { flow: [0, 0.45], reflect: 0.2, neutral: 0.2 }, legend,
    environment: { clock: false, weather: 'clear', music: false, dust: false, camera: null, highGround: null, ...environment },
    spawn, tiles: rows(tiles), heights: rows(heights), objects };
}

// ── towns and overlands ─────────────────────────────────────────────────────────────────────────────────────────────
function outdoor(w, region) {
  // the map, its approach roads (a town's exits lie past its edge) and a margin; never past the grid the sim built
  let bx0 = 0, by0 = 0, bx1 = w.W, by1 = w.H;
  for (const e of w.exits || []) { bx0 = Math.min(bx0, e.x0); by0 = Math.min(by0, e.y0); bx1 = Math.max(bx1, e.x1); by1 = Math.max(by1, e.y1); }
  bx0 = Math.max(-w.PAD, bx0 - 8); by0 = Math.max(-w.PAD, by0 - 8); bx1 = Math.min(w.W + w.PAD, bx1 + 8); by1 = Math.min(w.H + w.PAD, by1 + 8);
  const C = crop(bx0, by0, bx1, by1, w.W / 2, w.H / 2), { x0, y0, W, D } = C;
  const X = (x) => r2((x - x0) / 2), Z = (y) => r2((y - y0) / 2);
  const tm = (x, y) => { const gx = x + w.PAD, gy = y + w.PAD; return gx >= 0 && gy >= 0 && gx < w.GW && gy < w.GH ? w.tmat[gy * w.GW + gx] : 0; };
  const B = BIOMES[BIOME_OF[region] || 'grassland'];
  const tiles = grid(W, D, 'g'), heights = grid(W, D, '2');
  for (let j = 0; j < D; j++) for (let i = 0; i < W; i++) {
    const n = new Map();                                       // (by our ground's index: the Fens' bank and the Heights' snow share a tile)
    for (const [dx, dy] of [[0, 0], [1, 0], [0, 1], [1, 1]]) { const t = GROUND[tm(x0 + 2 * i + dx, y0 + 2 * j + dy)] ? tm(x0 + 2 * i + dx, y0 + 2 * j + dy) : 0; n.set(t, (n.get(t) || 0) + 1); }
    const t = [...n.keys()].sort((a, b) => n.get(b) - n.get(a) || (RANK[GROUND[b][0]] ?? 0) - (RANK[GROUND[a][0]] ?? 0))[0];
    let c = GROUND[t][0], hh = GROUND[t][1];
    if (c === 'g') c = B.turf(hash('g', i, j) % 100);         // (the open ground: the region's turf, scrub or snow)
    else if ((c === '~' || c === 'o') && B.water) { c = B.water; hh = '1'; }   // (the Heights' water frozen over: ice, at the bank's height)
    else c = B.ground[c] ?? c;
    tiles[j][i] = c; heights[j][i] = hh;
  }
  const objects = [], sprites = [], count = {};
  const add = (ob) => { count[ob.type] = (count[ob.type] || 0) + 1; objects.push({ id: `${ob.type}_${count[ob.type]}`, ...ob }); };
  const inside = (x, z, m = 0.5) => x > m && z > m && x < W - m && z < D - m;
  const foot = (s) => { const f = ENV_FOOT[s.id]; if (!f) return null; return { cx: X(s.x + (f[0] + f[2]) / 2), cz: Z(s.y + (f[1] + f[3]) / 2), w: (f[2] - f[0]) / 2, d: (f[3] - f[1]) / 2, f }; };
  const services = new Map((w.services || []).map((v) => [v.id, v]));
  // raised ground under a footprint (the town's walls; a mountain, highest at its middle)
  const raise = (s, level, ch, dome = false) => {
    const f = ENV_FOOT[s.id]; if (!f) return;
    const i0 = Math.floor((s.x + f[0] - x0) / 2), i1 = Math.ceil((s.x + f[2] - x0) / 2), j0 = Math.floor((s.y + f[1] - y0) / 2), j1 = Math.ceil((s.y + f[3] - y0) / 2);
    for (let j = j0; j < j1; j++) for (let i = i0; i < i1; i++) {
      if (i < 0 || j < 0 || i >= W || j >= D) continue;
      let h = level;
      if (dome) { const u = ((i + 0.5 - (i0 + i1) / 2) / ((i1 - i0) / 2)) ** 2 + ((j + 0.5 - (j0 + j1) / 2) / ((j1 - j0) / 2)) ** 2; if (u > 1) continue; h = Math.round(3 + (level - 3) * (1 - u)); }
      const cur = parseInt(heights[j][i], 36);
      if (cur < h) { tiles[j][i] = ch; heights[j][i] = h.toString(36); }
    }
  };
  const gates = [], timber = PALISADE.has(region);
  for (const s of w.structs) {
    if (/_curtainy?_\d/.test(s.id)) raise(s, timber ? 3 : 6, timber ? 'E' : 'k');
    else if (/_tower_\d/.test(s.id)) raise(s, timber ? 3 : 8, timber ? 'E' : 'k');
    else if (/_gatehousey?_\d/.test(s.id)) { raise(s, timber ? 3 : 8, timber ? 'E' : 'k'); gates.push(s); }
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
        if (i >= 0 && j >= 0 && i < W && j < D) { tiles[j][i] = 'c'; heights[j][i] = '2'; }
      }
    }
  }
  const raised = (x, z) => { const i = Math.floor(x), j = Math.floor(z); return i < 0 || j < 0 || i >= W || j >= D || heights[j][i] !== '2'; };
  const look = REGION_LOOK[region] || {};
  for (const s of w.structs) {
    const id = s.id, p = foot(s);
    // (the palisade: ours, on its bank; inside a town a card, the owner's choice: from inside, the model shows its shaded
    // face and its tower reads as a block: docs/vale-landmarks-proposal.md §8)
    if (timber && p && inside(p.cx, p.cz, -4) && /_curtainy?_\d|_tower_\d|_gatehousey?_\d/.test(id)) { sprites.push({ id, x: X(s.x), z: Z(s.y), ...(w.hub ? { card: true } : {}) }); continue; }
    if (!p || !inside(p.cx, p.cz) || /_curtainy?_\d|_tower_\d|_gatehousey?_\d|^mountain_|^ug_/.test(id)) {
      if (/^ug_flowers/.test(id) && (B === BIOMES.grassland || B === BIOMES.vale) && p && inside(p.cx, p.cz) && !raised(p.cx, p.cz)) tiles[Math.floor(p.cz)][Math.floor(p.cx)] = 'f';
      continue;
    }
    const house = HOUSES.find(([re]) => re.test(id));
    if (house && /^(vale|fens|reach|heights)_/.test(id) && !/_stilt|_punt|_cistern|_eeltrap/.test(id)) {
      const svc = services.get(id);
      add({ type: 'house', x: p.cx, z: p.cz, rotation: 0, ...(svc ? { name: svc.name } : {}), light: !!svc || hash(id, s.x) % 3 === 0,
        opts: { width: r2(clamp(p.w * 0.82, 3, 8)), depth: r2(clamp(p.d * 0.72, 2.5, 6)), chimney: true, shutters: true, doorHood: false, woodpile: false,
          gableFront: false, sign: false, upperWall: '', ...house[1], ...(/_temple_|_smith_/.test(id) ? { ...look, wall: 'stone_brick' } : look), seed: hash(id, s.x, s.y) % 997 } });
      continue;
    }
    const m = /^([a-z]+)_\d/.exec(id), kind = m && m[1];
    if (kind && (TREES[kind] || kind === 'grove')) {
      if (raised(p.cx, p.cz)) continue;
      const h = hash(id, s.x, s.y), tk0 = kind === 'grove' ? ['oak', 'oak', 'pine', 'autumn', 'deadwood'][h % 5] : TREES[kind], tk = B.trees[tk0] || tk0;
      add({ type: 'tree', x: p.cx, z: p.cz, collider: false, opts: { kind: tk, height: r2(clamp(Math.max(p.w, p.d) * 0.62, 2.6, 6.2)), seed: h % 997 } });
    } else if (/^rock_/.test(id)) add({ type: 'rock', x: p.cx, z: p.cz, opts: { size: r2(clamp(Math.max(p.w, p.d) * 0.55, 0.6, 1.6)), ...(B.stone ? { stone: B.stone } : {}), seed: hash(id, s.x) % 97 } });
    else if (/^(fence|drywall)_/.test(id)) {
      const f = p.f, horiz = f[2] - f[0] > f[3] - f[1];
      add(horiz ? { type: 'fence', x0: X(s.x + f[0]), z0: p.cz, x1: X(s.x + f[2]), z1: p.cz, opts: {} } : { type: 'fence', x0: p.cx, z0: Z(s.y + f[1]), x1: p.cx, z1: Z(s.y + f[3]), opts: {} });
    }
    else if (/_(well|lanewell)_\d/.test(id)) add({ type: 'well', x: p.cx, z: p.cz, rotation: 0, opts: { roof: 'roof_thatch' } });
    else if (/^windmill_/.test(id)) add({ type: 'windmill', x: p.cx, z: p.cz, rotation: 0, opts: { height: 7, roof: 'roof_thatch', seed: 7 } });
    else if (/^lamppost_/.test(id)) add({ type: 'lamppost', x: p.cx, z: p.cz, rotation: 0, opts: { style: 'arm' } });
    else if (/_foodstand_/.test(id)) add({ type: 'marketStall', x: p.cx, z: p.cz, rotation: 0, opts: { cloth: 'cloth_stripe', width: 3, crates: 'right', seed: 2 } });
    else if (/^barrel/.test(id)) add({ type: 'barrel', x: p.cx, z: p.cz, rotation: (hash(id, s.x, s.y) % 7) / 7, opts: { height: 1, lying: false } });
    else if (/^crate_|^boxes/.test(id)) add({ type: 'crateStack', x: p.cx, z: p.cz, rotation: 0.2, opts: { count: /^boxes/.test(id) ? 3 : 2, size: 0.8, seed: hash(id, s.x) % 31 } });
    else if (/^sack/.test(id)) add({ type: 'sacks', x: p.cx, z: p.cz, rotation: 0, opts: { count: 3, seed: 5 } });
    else if (/^table_/.test(id)) add({ type: 'table', x: p.cx, z: p.cz, rotation: 0, opts: { shape: 'rect', width: 1.6, depth: 0.9, cloth: false, items: true, candle: false, seed: 6 } });
    else if (/^bench_/.test(id)) add({ type: 'bench', x: p.cx, z: p.cz, rotation: 0, opts: { length: 1.6, back: true } });
    else if (/^hay_/.test(id)) add({ type: 'haystack', x: p.cx, z: p.cz, opts: { size: 0.8, seed: hash(id, s.x) % 31 } });
    // a bridge (the owner, 2026-11-01: "the bridge doesnt look right and characters dont walk over it they walk through it"):
    // Luminati's own, its deck walkable (the figures stand on it: TileMap's walk surface), across its span on our deck's
    // line (outdoor.js 'deck': the walkable 6.4 tiles of the footprint's short side), the river left open under it
    else if (/^bridge/.test(id)) {
      const f = p.f, alongX = f[2] - f[0] > f[3] - f[1];
      add(alongX ? { type: 'bridge', x0: X(s.x + f[0]), z0: Z(s.y), x1: X(s.x + f[2]), z1: Z(s.y), deckY: GROUND_Y, opts: { width: 2.8, arch: 0.22 } }
        : { type: 'bridge', x0: X(s.x), z0: Z(s.y + f[1]), x1: X(s.x), z1: Z(s.y + f[3]), deckY: GROUND_Y, opts: { width: 2.8, arch: 0.22 } });
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
  // the lit things on the ground (the town's braziers: a fire each, sharing Luminati's lamps)
  for (const [k, kind] of w.props || []) {
    const [tx, ty] = k.split(',').map(Number), x = X(tx + 0.5), z = Z(ty + 0.5);
    if (!inside(x, z)) continue;
    if (kind === 'brazier') add({ type: 'campfire', x, z, rotation: 0, opts: { seat: false } });   // (a core light: Luminati's monument brazier is The Bells of Evermere's and loads its kits)
    // (v1.63, GDD §10.3: a spawn point's dressing, sim/camps.js) the camp's fire Luminati's own; crates, sacks and bones its
    // own pieces as underground; the rest ours (gsprite.js: the tent, the dead cow, the burrow), stood as a dungeon's are
    else if (kind === 'cookfire') add({ type: 'campfire', x, z, rotation: 0, opts: { seat: false } });
    else if (kind === 'crates' || kind === 'sacks' || kind === 'bones') add(DRESS_3D[kind](x, z, hash(kind, tx, ty)));
    else if (OVERLAND_OURS.has(kind)) sprites.push({ prop: kind, tx, ty, x, z });
  }
  // the land goes on past the edge: Luminati's forest border on the blocked ring and its outer scenery beyond, round every
  // map (the owner, 2026-11-02: "The edge of the map falls off a cliff, and is blank. The old maps were surrounded by
  // trees, boulders or other impassable objects". An overland is cropped to 256 of ours, and its forest ring in the
  // sim's margin fell outside the crop; the outer scenery had been kept to town-sized maps)
  const town = W * D <= 96 * 96;
  const level = frame({ name: w.name || 'Emberfall', W, D, tiles, heights, objects, spawn: { x: W / 2, z: D / 2, facing: 'down' },
    environment: { timeOfDay: 17.9, border: 'forest', outerScenery: true, godRays: town, interior: false, ...B.env } });
  return { level, sprites, origin: { x: x0, y: y0 }, stats: { ...count, sprites: sprites.length, size: W * 1000 + D } };
}

// ── a floor's ways up and down (sim/world.js placeStairsUp, placeStairsDown), in Luminati's stair tiles ─────────────────
// The way up: a flight of three climbing from the floor (level 2) into the wall it stands against, over the stairsup
// structure's 3 × 7 of ours. The way down: the 6 × 6 stairwell sunk two levels, the top step at its open (+y) edge, a
// landing at the bottom. Before, both were lampposts (one on each of the well's 36 tiles). A tile of Luminati's is
// 2 × 2 of ours, and one is in the flight when its middle is.
const FLOOR = 2;
// The ways up and down, seen across the room (the owner, 2026-11-04: "The stairs arent obvious enough"): besides the
// torches, a glow of their own, the way up's at its head (daylight on a first floor, where it leads out; a warm lamp
// deeper) and the well's violet light rising out of it (the arch below lit violet, GDD §3.1). Emberlit's overlay hangs a
// sign over each as well (renderer.js drawStairs).
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
const THEME_LOOK = { crypt: KIT_LOOK.gallery, dread: KIT_LOOK.barracks, cave: KIT_LOOK.cellar, nave: KIT_LOOK.nave, cinder: KIT_LOOK.cultcut, chasm: { floor: ['U', 'm'], wall: 'x', hour: 22.8 } };
const DEFAULT_LOOK = { floor: ['k', 'm'], wall: 'x', hour: 19.4 };
/** an overland prop of ours (gsprite.js), a spawn point's dressing (sim/camps.js) */
const OVERLAND_OURS = new Set(['tent', 'carcass', 'burrow']);
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
/** the ambient a floor's kit wants: Luminati's hemisphere light's sky and ground colours (linear) and intensity */
export function ambientOf(kit) {
  // (the tint squared: at its own strength every floor read one navy; the dig wants its warmth, the gallery its cold)
  const t = (KIT_TINT[kit] || [1, 1, 1]).map((v) => v * v), c = (k) => AMB_BASE.map((v, i) => r2(v * t[i] * k));
  // (the owner on the phone, 2026-11-02: "The dungeons are too dark". At Emberlit's own brightness a room's floor away
  // from the braziers was lost on a phone; the fill is nearly doubled and the lamps reach further: lamps is Luminati's
  // point lights ×, a brazier a pool of orange at 1)
  return { sky: c(1.0), ground: c(0.5), i: 1, sun: 0, lamps: 0.85 };
}

/** @param {any} w @param {{ region?: string, stairs?: string }} [o] */
function dungeon(w, o = {}) {
  const cells = w.level.cells;
  let bx0 = Infinity, by0 = Infinity, bx1 = -Infinity, by1 = -Infinity;
  for (const k of cells.keys()) { const c = k.indexOf(','), x = +k.slice(0, c), y = +k.slice(c + 1); if (x < bx0) bx0 = x; if (y < by0) by0 = y; if (x + 1 > bx1) bx1 = x + 1; if (y + 1 > by1) by1 = y + 1; }
  const sp = w.spawn || { x: (bx0 + bx1) / 2, y: (by0 + by1) / 2 };
  // a cavern too big for one level is held round the middle of its ways up and down, so both are in it (the Toadking's
  // Mound and the Scrag Warren run past 256 of ours); round where the hero comes in when they're further apart
  const up = (w.structs || []).find((s) => s.id.startsWith('stairsup')) || sp, wl = w.stairwell, dn = wl ? { x: (wl.x0 + wl.x1) / 2, y: (wl.y0 + wl.y1) / 2 } : w.stairsAt || sp;
  const both = Math.abs(up.x - dn.x) < MAX_TILES - 24 && Math.abs(up.y - dn.y) < MAX_TILES - 24;
  const { x0, y0, W, D } = crop(bx0 - 2, by0 - 2, bx1 + 2, by1 + 2, both ? (up.x + dn.x) / 2 : sp.x, both ? (up.y + dn.y) / 2 : sp.y);
  const X = (x) => r2((x - x0) / 2), Z = (y) => r2((y - y0) / 2);
  const look = KIT_LOOK[w.kit] || THEME_LOOK[w.theme] || DEFAULT_LOOK;
  const tiles = grid(W, D, look.wall), heights = grid(W, D, '6'), pools = w.pools || new Set();
  // an authored floor (plans.js) is dressed room by room: each room in its own kit's stone (the Keep's barracks in dressed
  // stone, its cellars' cave in rock), a dug room (a 'cave') walled in rock whatever its kit; the halls in the floor's
  const L = w.level, roomLook = (c) => {
    const r = L.plan && c && c.room >= 0 ? L.rooms[c.room] : null; if (!r) return look;
    const k = KIT_LOOK[r.kit] || look; return r.shape === 'cave' ? (k.caveLook ||= { ...k, wall: k.cave || 'x' }) : k;
  };
  const looks = new Array(W * D).fill(null);
  // a tile is floor when any of its four of ours is (a corridor one of ours wide stays open); standing water where two are
  for (let j = 0; j < D; j++) for (let i = 0; i < W; i++) {
    let floor = 0, wet = 0, lk = null;
    for (const [dx, dy] of [[0, 0], [1, 0], [0, 1], [1, 1]]) {
      const k = `${x0 + 2 * i + dx},${y0 + 2 * j + dy}`, c = cells.get(k);
      if (c && c.kind === 'floor') { floor++; if (!lk || c.room >= 0) lk = roomLook(c); }
      if (pools.has(k)) wet++;
    }
    if (floor) { looks[j * W + i] = lk; tiles[j][i] = wet >= 2 ? 'P' : hash('d', i, j) % 100 < 18 ? lk.floor[1] : lk.floor[0]; heights[j][i] = '2'; }
  }
  // the rock beyond the walls is nothing, as Emberlit draws it: only the ring of wall round the floor stands, the rest
  // void (black), not a sea of lit wall-tops
  const open = (i, j) => i >= 0 && j >= 0 && i < W && j < D && heights[j][i] === '2';
  for (let j = 0; j < D; j++) for (let i = 0; i < W; i++) {
    if (heights[j][i] === '2') continue;
    let near = false;
    for (let dj = -1; dj <= 1 && !near; dj++) for (let di = -1; di <= 1 && !near; di++) near = open(i + di, j + dj);
    if (!near) { tiles[j][i] = ' '; heights[j][i] = '0'; continue; }
    // a wall in the stone of the room it stands by (an authored floor's rooms differ; elsewhere the floor's one look)
    for (let dj = -1; dj <= 1; dj++) for (let di = -1; di <= 1; di++) { const n = open(i + di, j + dj) ? looks[(j + dj) * W + i + di] : null; if (n && n !== look) { tiles[j][i] = n.wall; dj = di = 2; } }
  }
  // the Old Cellars' broken floor (world.js 'pit'): its tiles sunk two steps, rock at the bottom, a black hole to look into
  for (const [k, kind] of w.props || []) {
    if (kind !== 'pit') continue;
    const [tx, ty] = k.split(',').map(Number), i = Math.floor((tx - x0) / 2), j = Math.floor((ty - y0) / 2);
    if (i >= 0 && j >= 0 && i < W && j < D && heights[j][i] === '2') { heights[j][i] = '0'; tiles[j][i] = 'U'; }
  }
  const stairLights = stairs(w, x0, y0, W, D, tiles, heights, o.stairs !== 'plain');
  const objects = [], count = {}, sprites = [];
  // (an arch over each way, built by world.js in the floor's own stone: GDD v1.57, docs/dungeon-stairs-proposal.md;
  // ?stairs=plain the stairs as they were)
  const archStone = (LEGEND[look.wall]?.side && !/cliff|dirt/.test(LEGEND[look.wall].side)) ? LEGEND[look.wall].side : 'stone_brick';
  for (const a of stairLights.arches || []) sprites.push({ arch: { ...a, stone: archStone } });
  const add = (ob) => { count[ob.type] = (count[ob.type] || 0) + 1; objects.push({ id: `${ob.type}_${count[ob.type]}`, ...ob }); };
  for (const l of stairLights) add(l.glow ? { type: 'light', x: X(l.x), z: Z(l.y), dy: l.dy, color: l.glow.color, intensity: l.glow.intensity, distance: l.glow.distance, flicker: 0.08, nightOnly: false }
    : { type: 'wallTorch', x: X(l.x), z: Z(l.y), rotation: 0, dy: l.dy ?? 1.4, opts: { embers: true } });
  for (const [k, kind] of w.props || []) {
    const [tx, ty] = k.split(',').map(Number), x = X(tx + 0.5), z = Z(ty + 0.5);
    if (x < 0.5 || z < 0.5 || x > W - 0.5 || z > D - 0.5 || /^stair/.test(kind)) continue;   // (the stairs are the floor's own: stairs())
    const h = hash('p', tx, ty);
    if (kind === 'exit') { add({ type: 'lamppost', x, z, rotation: 0, opts: { style: 'arm' } }); continue; }
    if (kind === 'block') continue;                                 // (a big piece's footprint: world.js big)
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
  const level = frame({ name: w.siteName || 'The Old Barrows', W, D, tiles, heights, objects, spawn: { x: X(sp.x), z: Z(sp.y), facing: 'up' },
    // (black beyond the walls, as Emberlit's: a backdrop colour, which the fog takes too, so the far rooms fade to it)
    environment: { timeOfDay: look.hour, border: 'none', outerScenery: false, godRays: false, interior: true, backdrop: '#040306' } });
  return { level, sprites, ambient: ambientOf(w.kit), origin: { x: x0, y: y0 }, stats: { ...count, ours: sprites.length, size: W * 1000 + D } };
}
