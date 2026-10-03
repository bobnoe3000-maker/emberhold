// world.js — the world is now a single generated DUNGEON LEVEL (see level.js):
// a themed graph of rooms + corridors, ringed by high walls, floating in the
// abyss. Terrain is a lookup into that level rather than an infinite field, but
// the renderer- and sim-facing API is unchanged: heightAt / materialAt /
// isWalkable / resourceAt / propAt are still pure functions of (world, x, y),
// and the whole level is a pure function of (seed, theme) so saves reproduce it.

import { hash2, fbm, streamSeed, mulberry32, STREAM } from './rng.js';
import { generateLevel, THEME_KEYS, FLOOR_Z, WALL_Z } from './level.js';
import { oHeightAt, oMaterialAt, oIsWalkable } from './outdoor.js';
import { hypot } from './detmath.js';
import { siteOf, roomLevelAt, hasFloorBelow } from './sites.js';

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
// goes on down. The Old Barrows' look is still picked from the seed.
export const CHEST_KEEP = 0.35;
export function createWorld(seed, theme, depth = 0, site = 'barrows') {
  const S = siteOf(site);   // (its furniture below: `human`, `themes`)
  const th = theme || S.theme || THEME_KEYS[(seed >>> 0) % THEME_KEYS.length];
  const level = generateLevel(seed, th, { rooms: S.rooms });
  const world = {
    kind: 'dungeon', seed, theme: th, depth, level, site, siteName: S.name,
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
  // a site's furniture (M5): the living keep stores and camps where the dead keep crypts. The same
  // draws either way, so an Old Barrows floor is dressed as it always was.
  const human = S.family === 'redhand';
  const decor = human ? ['crates', 'barrels', 'sacks'] : ['spire', 'monolith', 'totem'];
  const themes = human ? ['storehouse', 'camp', 'colonnade'] : S.family === 'chapel' ? ['nave', 'crypt', 'ossuary'] : ['colonnade', 'crypt', 'ossuary'];
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
    for (const o of openings) {
      const ix = Math.round(o.x) - o.dx * 2, iy = Math.round(o.y) - o.dy * 2, px = o.dy, py = o.dx;   // two steps inside, perpendicular to the corridor
      for (const s of [-1, 1]) for (let w = 4; w <= 6; w++) if (place(ix + px * s * w, iy + py * s * w, 'brazier')) break;
    }
    // wall-side cells: open floor within 2 tiles of the room's edge, away from doorways
    const nearDoor = (x, y) => openings.some((o) => hypot(x - o.x, y - o.y) < 8);
    const edge = cells.filter(([x, y, c]) => {
      if (c.corridor || nearDoor(x, y)) return false;
      let open = 0; for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) if (!isFloor(x + dx, y + dy)) open++;
      return open > 0 && isFloor(x + 1, y) && isFloor(x - 1, y) && isFloor(x, y + 1) && isFloor(x, y - 1);
    });
    const taken = [];
    const pickEdge = (minGap, ok = null) => {
      for (let t = 0; t < 40 && edge.length; t++) { const [x, y] = edge[(prng() * edge.length) | 0]; if ((!ok || ok(x, y)) && taken.every(([a, b]) => hypot(a - x, b - y) >= minGap)) { taken.push([x, y]); return [x, y]; } }
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
    const putAt = (u, v, kind) => { const [x, y] = at(u, v); if (!nearDoor(x, y)) place(x, y, kind); };
    if (r === level.descentRoom) {
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
      } else if (theme === 'crypt') {
        for (const side of [-1, 1]) for (let u = -L * 0.45; u <= L * 0.45 + 0.01; u += 6) putAt(u, side * Wd * 0.5, 'sarcophagus');
        for (let i = 0; i < 3; i++) { const q = pickEdge(6); if (q) place(q[0], q[1], 'bones'); }
      } else {
        for (let i = 0; i < 6; i++) { const q = pickEdge(6); if (q) place(q[0], q[1], 'bones'); }
        for (const side of [-1, 1]) putAt(side * L * 0.35, -side * Wd * 0.45, 'brokenpillar');
      }
    }
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
  const kept = chests.filter(() => keep() < CHEST_KEEP);
  if (!kept.length && chests.length) kept.push(chests[Math.floor(keep() * chests.length)]);
  for (const k of chests) if (!kept.includes(k)) world.props.delete(k);
  // Every floor's way back up, one floor at a time: a stone stair built against the entrance
  // room's back wall (north or west, the walls you see), climbing into it. Walk up its bottom
  // steps: on the first floor it leads out to the surface, deeper to the floor above (core.js).
  world.structs = [];
  if (level.entrance) placeStairsUp(world, level);
  if (level.descentRoom && hasFloorBelow(site, depth)) placeStairsDown(world, level);   // (a site's last floor ends in its hall)
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
// room level = the site's base + its levels a floor × depth + ⌊rank ÷ 2⌋ (sites.js roomLevelAt; the Old
// Barrows: 1 + ROOM_LEVELS_PER_FLOOR × depth + ⌊rank ÷ 2⌋). The entrance is safe (0).
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
  const ranked = rooms.filter((r) => r !== entrance)
    .sort((a, b) => (a === level.descentRoom) - (b === level.descentRoom) || (best.get(a.id) ?? 1e9) - (best.get(b.id) ?? 1e9) || a.id - b.id);
  out.set(entrance.id, 0);
  ranked.forEach((r, i) => out.set(r.id, roomLevelAt(site, depth, i)));
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
  const DECOR = new Set(['spire', 'monolith', 'totem', 'crates', 'barrels', 'sacks', 'bedroll', 'pillar', 'brokenpillar', 'sarcophagus', 'bones', 'pew']);
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

// Hazard field: blobby pools of the theme's hazard material across open floor.
// Pools spread as you descend (lower threshold = more hazard, deeper = deadlier).
function hazardAt(world, x, y) {
  const th = world.level.th;
  const cut = Math.max(0.34, th.hazardCut - world.depth * 0.045);
  return fbm(x * th.hazardScale, y * th.hazardScale, world.cs + 909) > cut;
}

// Material: abyss off-platform, the theme's wall on the ring, else a noise-picked
// floor material with hazard pools cut into open (non-corridor) ground.
export function materialAt(world, x, y) {
  if (world.kind !== 'dungeon') return oMaterialAt(world, x, y);
  const tx = Math.floor(x), ty = Math.floor(y), c = cellAt(world, tx, ty);
  if (!c) return MAT.ABYSS;
  const g = world.level._dense, idx = (ty - g.y0) * g.w + (tx - g.x0), known = g.mat[idx];   // (cellAt built g)
  if (known !== undefined) return known;
  const th = world.level.th;
  let m;
  if (c.kind === 'wall') m = th.wall;
  else if (!c.corridor && !(world.dry && world.dry.has(K(tx, ty))) && hazardAt(world, tx, ty)) m = th.hazard;
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
  const k = K(x, y);
  if (world.mods.get(k)?.opened) return null;
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
  if (propAt(world, tx, ty)) return false;
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
