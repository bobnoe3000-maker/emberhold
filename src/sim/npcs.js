// @ts-check
// npcs.js — named NPCs in towns and talking to them (quest-lore-system §4.4, §5, §6; architecture §4
// "Dialogue"). Headless: where each stands, the `talk` command, the variables a conversation may
// read, and the effects a conversation may make. The words live in Ink (content/dialogue/); the
// look, name and dialogue file in content/npcs/*.json. The sim keeps its own table below (it can't
// read JSON files, and must not trust the client's); a test keeps the two in step.
//
// Commands:
//   talk { npc }                in reach → a 'dialogue' event; out of reach → walk over, then talk
//   dialogueEffect { tag, args } an Ink tag from the open conversation; applied only if that NPC is
//                                allowed it (flags it may set; `quest` tags go to quests.js, which
//                                takes only the talking NPC's own quests). Anything else does nothing.
//   endTalk {}                   the window closed
// Events: 'dialogue' { npc, knot, vars } · 'talkVars' { npc, vars } (after each dialogueEffect) ·
//         'flagChanged' { name, value } · 'talkEnded' { npc }
// Save: state.flags { [name]: number } (core.js snapshot / restore). A conversation itself is not
// saved: it ends on a reload, and anything it changed went through a command.
//
// Named people (Maudry, Osric, Ilse) keep one spot and are solid: you walk round them. Townsfolk
// (`folk`) keep a routine (world doc §5, v1.6): the in-game day (DAY_S) has four parts, dawn · day ·
// dusk · night, and each townsperson stands at one of two spots in each part (`day`). When the part
// changes they walk there along a path, and between times they stroll about their spot (walkers,
// not walls: you pass through them). A town built mid-day places them where the hour has them; their
// positions are runtime, never saved. Everyone keeps apart on screen, so a tap picks one person.
//
// (M8) A visitor (`visitor`: the Kindler) stands in a dungeon's entrance room until a flag of his own says he's gone:
// he's met, talks, and leaves when the conversation ends.
// Found companions (`found`: Brannoc, M5) stand in a dungeon until they join: at the back of their
// site's floor's hall (placeFound), a walker like townsfolk (the hall is a fight room). Once one has
// joined (heroes.js FOUND), `talk` reaches him wherever you are, from his party card, while he's in the
// party and up; `# companion: join` in his own talk is the only way in.

import { hypot } from './detmath.js';
import { DAY_S } from './heroes.js';
import { findPath } from './path.js';
import { mulberry32, streamSeed, STREAM } from './rng.js';

// Where each stands: beside a service building of its region's town (or the square's well, `hub`;
// off = tiles from that anchor), and what it may change. A spot is [anchor, [dx, dy]].
// Every spot is in view: no building, roof or the well in front of it on screen (art critic pass 8 measured
// them with the renderer's x-ray share; browser test 15d holds them under 5 %). Osric stands in front of the
// well, not in it; Ilse and Jory by the shrine's door, clear of Wendel's roof; Nell clear of the Mule's.
export const NPCS = {
  maudry_fenn: { region: 'vale', spots: [['tavern', [10, 1]]], knot: 'maudry_hub', flags: ['met_maudry'] },
  osric_hale: { region: 'vale', spots: [['hub', [11, 7]]], knot: 'osric_hub', flags: ['met_osric'] },
  sister_ilse: { region: 'vale', spots: [['temple', [-2, 10]]], knot: 'ilse_hub', flags: ['met_ilse'] },
  wendel: { region: 'vale', folk: true, spots: [['shop', [2, 9]], ['tavern', [10, 7]]], day: [0, 0, 0, 1], knot: 'wendel_hub', flags: ['met_wendel'] },
  bess_hale: { region: 'vale', folk: true, spots: [['smith', [7, 2]], ['tavern', [12, 16]]], day: [0, 0, 0, 1], knot: 'bess_hub', flags: ['met_bess'] },
  col: { region: 'vale', folk: true, spots: [['hub', [14, 15]], ['tavern', [6, 10]]], day: [0, 0, 1, 1], knot: 'col_hub', flags: ['met_col'] },
  jory: { region: 'vale', folk: true, spots: [['hub', [8, 17]], ['inn', [10, 9]]], day: [0, 1, 0, 1], knot: 'jory_hub', flags: ['met_jory'] },
  nell_tolley: { region: 'vale', folk: true, spots: [['inn', [-1, 5]], ['hub', [1, 22]]], day: [1, 0, 0, 0], knot: 'nell_hub', flags: ['met_nell'] },
  hedda: { region: 'vale', folk: true, spots: [['hub', [21, 14]], ['shop', [1, 14]]], day: [0, 0, 1, 1], knot: 'hedda_hub', flags: ['met_hedda'] },
  brannoc: { region: 'vale', found: { site: 'wickham_keep', depth: 2, boss: 'redhand_captain' }, spots: [], knot: 'brannoc_hub', flags: ['met_brannoc'] },
  // (M8, Act II; world doc v1.29 §3.2) Saltmere's people: Dace Pike by the Drowned Eel, Pim's handcart by the cistern,
  // Sister Orla and Mother Agnes by the chapel
  dace_pike: { region: 'fens', spots: [['tavern', [10, 2]]], knot: 'dace_hub', flags: ['met_dace'] },
  pim_rushlight: { region: 'fens', spots: [['shop', [2, 9]]], knot: 'pim_hub', flags: ['met_pim'] },   // (at his chandlery's door, v1.44)
  sister_orla: { region: 'fens', spots: [['temple', [8, 9]]], knot: 'orla_hub', flags: ['met_orla'] },
  mother_agnes: { region: 'fens', spots: [['temple', [12, 15]]], knot: 'agnes_hub', flags: ['met_agnes'] },   // (on the chapel's deck: at [14, 4] she stood in the Stilt House's footprint, drawn through it on the home screen: Saltmere's critic pass)
  // Wren, found tied in the Toadking's Boat Hall (world doc v1.29 §5); the Kindler, met once on the Canal Locks' first
  // floor, by its way in (`entrance`), who leaves when he's said his piece (`visitor`: gone once that flag is set)
  wren: { region: 'fens', found: { site: 'toadking_mound', depth: 2, boss: 'toadking' }, spots: [], knot: 'wren_hub', flags: ['met_wren'] },
  kindler: { region: 'fens', found: { site: 'canal_locks', depth: 0, entrance: true }, visitor: 'met_kindler', spots: [], knot: 'kindler_hub', flags: ['met_kindler'] },
  // (v1.48, world doc §3.1) the Vale's dungeons each have someone by the way in, who names the floors: Thornwick's
  // sexton at the barrow mouth, the Mill's miller held in the Keep's bailey, the beekeeper in the chapel's porch
  tobin_hask: { region: 'vale', found: { site: 'barrows', depth: 0, entrance: true }, spots: [], knot: 'tobin_hub', flags: ['met_tobin'] },
  ned_fallow: { region: 'vale', found: { site: 'wickham_keep', depth: 0, entrance: true }, spots: [], knot: 'ned_hub', flags: ['met_ned'] },
  hester_lowe: { region: 'vale', found: { site: 'sunken_chapel', depth: 0, entrance: true }, spots: [], knot: 'hester_hub', flags: ['met_hester'] },
};
export const PARTS = 4, PART_S = DAY_S / PARTS;                  // dawn · day · dusk · night
/** the part of the in-game day at time t (s of play) @param {number} t */
export const partOf = (t) => Math.floor((t % DAY_S) / PART_S);
const FOLK_SPEED = 1.6;                                          // tiles a second: an amble
export const TALK_REACH = 2.2;                    // tiles, centre to centre
const BESIDE = [[1, -1], [-1, 1], [2, 0], [0, 2]];   // (x+1, y−1) and (x−1, y+1) stand level with them on screen
const FLAG_MAX = 99;

// Room to be told apart: two people must not stand where their figures overlap on screen, or a tap
// can't tell them apart (Col and Jory had spots two to six tiles from Maudry's door). On screen a
// tile step is (x − y) × 8 px across and (x + y) × 4 px down, and a figure is ~32 × 56 px: apart when
// SEP_X tiles of (dx − dy) or SEP_Y of (dx + dy) separate them. Every spot keeps apart from every
// other spot, and a stroll only goes where it still is.
const SEP_X = 6, SEP_Y = 14, ROAM = 3;
/** @param {{x: number, y: number}} a @param {{x: number, y: number}} b */
export const apart = (a, b) => Math.abs((a.x - b.x) - (a.y - b.y)) >= SEP_X || Math.abs((a.x - b.x) + (a.y - b.y)) >= SEP_Y;
/** the open tile nearest a spot of this town that keeps apart from the taken ones, or null
 * @param {any} world @param {any[]} spot [anchor, [dx, dy]] @param {(w: any, x: number, y: number) => boolean} isWalkable @param {{x: number, y: number}[]} taken */
function spotTile(world, [anchor, off], isWalkable, taken) {
  const a = anchor === 'hub' ? world.hub : (world.services || []).find((s) => s.kind === anchor); if (!a) return null;
  const tx = Math.floor(a.x + off[0]), ty = Math.floor(a.y + off[1]);
  for (let d = 0; d <= 14; d++) for (let dy = -d; dy <= d; dy++) for (let dx = -d; dx <= d; dx++) {
    if (Math.max(Math.abs(dx), Math.abs(dy)) !== d) continue;
    const q = { x: tx + dx + 0.5, y: ty + dy + 0.5 };
    if (isWalkable(world, q.x, q.y) && taken.every((t) => apart(q, t))) return q;
  }
  return null;
}
const hashId = (s) => { let h = 2166136261; for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619); return h >>> 0; };
/** stand each of this town's NPCs where the hour has them: the named on their spot, made solid (you
 * walk round people, not through them), and townsfolk at the spot of this part of the day. Every spot
 * keeps apart from every other (named and townsfolk, both of a townsperson's spots), and each
 * townsperson has the tiles near each spot that still do, to stroll between.
 * world.npcs = [{ id, x, y, folk?, spots, roam, at, path, moving, fx, fy, rest, rng }]
 * @param {any} world @param {(w: any, x: number, y: number) => boolean} isWalkable
 * @param {(w: any, x: number, y: number) => void} block @param {number} part the part of the day (partOf) */
export function placeNpcs(world, isWalkable, block, part = 0) {
  world.npcs = [];
  if (world.kind !== 'town') return world;
  const taken = Object.values(world.arrivals || {}).map((q) => ({ x: q.x, y: q.y }));   // (nobody stands where you arrive: the hero came in on top of Col)
  for (const [id, n] of Object.entries(NPCS)) {                  // (the named first: their tiles go solid before townsfolk look for theirs)
    if (n.region !== world.region || n.folk || n.found) continue;
    const spot = spotTile(world, n.spots[0], isWalkable, taken);
    if (spot) { world.npcs.push({ id, x: spot.x, y: spot.y, px: spot.x, py: spot.y }); block(world, spot.x, spot.y); taken.push(spot); }
  }
  const folk = [];
  for (const [id, n] of Object.entries(NPCS)) {
    if (n.region !== world.region || !n.folk || n.found) continue;
    const spots = [];
    for (const sp of n.spots) { const q = spotTile(world, sp, isWalkable, taken); if (!q) break; spots.push(q); taken.push(q); }
    if (spots.length === n.spots.length) folk.push({ id, spots });
  }
  const roamed = new Map();                                       // id → every tile it may stroll to
  for (const { id, spots } of folk) {                             // strolls: near its own spot, clear of everyone else's spots and strolls
    const others = [...taken.filter((t) => !spots.includes(t)), ...[...roamed.values()].flat()];
    const roam = spots.map((c) => {
      const out = [c];
      for (let dy = -ROAM; dy <= ROAM; dy++) for (let dx = -ROAM; dx <= ROAM; dx++) {
        const q = { x: c.x + dx, y: c.y + dy };
        if ((dx || dy) && hypot(dx, dy) <= ROAM && isWalkable(world, q.x, q.y) && others.every((t) => apart(q, t))) out.push(q);
      }
      return out;
    });
    roamed.set(id, roam.flat());
    const at = NPCS[id].day[part] || 0, q = spots[at];
    world.npcs.push({ id, folk: true, x: q.x, y: q.y, px: q.x, py: q.y, spots, roam, at, path: null, moving: false, fx: 0, fy: 1,
      rest: 0, rng: mulberry32(streamSeed(hashId(id) ^ (world.seed >>> 0), STREAM.FOLK)) });
  }
  for (const n of world.npcs) if (n.folk) n.rest = 2 + n.rng() * 6;
  return world;
}
/** a found companion still waiting (sites.js hall of his floor): at the back of the hall (the
 * walkable tile furthest up the screen, least x + y), chained to the wall. world.npcs gets him.
 * @param {any} world @param {(w: any, x: number, y: number) => boolean} isWalkable @param {(id: string) => boolean} waiting */
export function placeFound(world, isWalkable, waiting) {
  if (world.kind !== 'dungeon' || !world.level || !world.level.descentRoom) return world;
  for (const [id, n] of Object.entries(NPCS)) {
    if (!n.found || n.found.site !== (world.site || 'barrows') || n.found.depth !== (world.depth || 0) || !waiting(id)) continue;
    // (a visitor by the way in stands in the entrance room, nearest its middle: no fight starts there)
    const r = n.found.entrance ? world.level.entrance : world.level.descentRoom; if (!r) continue;
    let best = null;
    for (const [k, c] of world.level.cells) {
      if (c.room !== r.id || c.kind !== 'floor') continue;
      const [x, y] = k.split(',').map(Number), q = { x: x + 0.5, y: y + 0.5 };
      const open = [[0, 0], [1, 0], [0, 1], [1, 1]].every(([dx, dy]) => isWalkable(world, q.x + dx, q.y + dy));   // room to walk up beside him
      if (n.found.entrance && world.level.spawn && hypot(q.x - world.level.spawn.x, q.y - world.level.spawn.y) < 3) continue;   // (not where you arrive: you'd stand in him)
      const key = n.found.entrance ? hypot(x - r.cx, y - r.cy) : x + y;
      if (open && (!best || key < best.k || (key === best.k && x < best.x - 0.5))) best = { ...q, k: key };
    }
    if (best) world.npcs.push({ id, found: true, visitor: !!n.visitor, boss: n.found.boss, x: best.x, y: best.y, px: best.x, py: best.y });
  }
  return world;
}
const pathTo = (world, n, g, isWalkable) => { const path = findPath(n.x, n.y, g.x, g.y, (x, y) => isWalkable(world, x + 0.5, y + 0.5), { maxNodes: 20000 }); return path ? path.slice(1).map(([x, y]) => ({ x, y })) : null; };
/** townsfolk keep their routine: when the part of the day changes, each walks to that part's spot;
 * between times they stroll, every 4–12 s, to a tile near it (and not while you stand beside them, or
 * talk to them: a person you're about to tap keeps still). Deterministic: paths from the world's own
 * walkability, strolls from each townsperson's own stream.
 * @param {any} world @param {number} t state.t @param {(w: any, x: number, y: number) => boolean} isWalkable @param {string|null} talking @param {number} dt @param {{x: number, y: number}} [hero] */
export function stepFolk(world, t, isWalkable, talking, dt, hero) {
  if (world.kind !== 'town') return;
  const part = partOf(t);
  for (const n of world.npcs || []) {
    if (!n.folk) continue;
    n.px = n.x; n.py = n.y; n.moving = false;
    if (talking === n.id) continue;
    const want = NPCS[n.id].day[part] || 0;
    if (want !== n.at && !n.path) {
      const g = n.spots[want], path = pathTo(world, n, g, isWalkable);
      n.at = want; n.path = path || [];
      if (!path) { n.x = n.px = g.x; n.y = n.py = g.y; }          // (no way there: they're simply there, off in the next street)
    }
    if (!n.path && (n.rest -= dt) <= 0) {
      const near = hero && hypot(hero.x - n.x, hero.y - n.y) < 3;
      const tiles = n.roam[n.at], g = tiles[Math.floor(n.rng() * tiles.length)];
      if (!near && g && hypot(g.x - n.x, g.y - n.y) > 0.5) n.path = pathTo(world, n, g, isWalkable);
      n.rest = 4 + n.rng() * 8;
    }
    if (n.path && n.path.length) {
      const q = n.path[0], dx = q.x - n.x, dy = q.y - n.y, d = hypot(dx, dy), s = FOLK_SPEED * dt;
      if (d <= s) { n.x = q.x; n.y = q.y; n.path.shift(); } else { n.x += (dx / d) * s; n.y += (dy / d) * s; }
      n.moving = true; n.fx = dx; n.fy = dy;
    }
    if (n.path && !n.path.length) n.path = null;
  }
}

/** @param {{ state: any, bus: any, getWorld: () => any, walkTo: (tx: number, ty: number, then: any, opts?: any) => boolean, canStand: (tx: number, ty: number) => boolean,
 *   moreVars?: (npc: string) => Record<string, number>, effect?: (npc: string, args: any) => void, join?: (npc: string) => void }} o
 *   moreVars: what else Ink may read (quests.js); effect: the `quest` tag; join: the `companion` tag (heroes.js) */
export function createTalk({ state, bus, getWorld, walkTo, canStand, moreVars = () => ({}), effect = () => {}, join = () => {} }) {
  if (!state.flags) state.flags = {};
  let talking = null;                             // the NPC id of the open conversation (runtime only)
  const npcHere = (id) => (getWorld().npcs || []).find((n) => n.id === id) || null;
  // a found companion in the party, up: you talk to him from his card, wherever you are (a visitor never joins)
  const withYou = (id) => !!NPCS[id] && !!NPCS[id].found && !NPCS[id].visitor && state.party.some((m) => m.id === id && !m.down && !m.fallen);
  const withParty = (id) => [...state.party, ...(state.bench || [])].some((m) => m.id === id);
  const dist = (n) => { const p = state.player; return hypot(n.x - p.x, n.y - p.y); };

  // what Ink may read: the hero, the party, and this NPC's own flags (quest-lore-system §6)
  function varsFor(id) {
    const h = state.party[0], fallen = state.party.slice(1).find((m) => m.fallen);
    /** @type {Record<string, string|number>} */
    const v = { hero_name: h.name, hero_class: h.cls, hero_origin: h.origin || '', hero_level: h.level,
      party_size: state.party.filter((m) => !m.fallen).length, fallen_name: fallen ? fallen.name : '', day_part: partOf(state.t) };
    for (const f of NPCS[id].flags) v['flag_' + f] = state.flags[f] || 0;
    if (NPCS[id].found) { v.joined = withParty(id) ? 1 : 0; v.in_party = state.party.some((m) => m.id === id) ? 1 : 0; }
    return { ...v, ...moreVars(id) };
  }

  function command(cmd) {
    if (cmd.type === 'talk') {
      if (withYou(cmd.npc) && !state.party[0].down) { talking = cmd.npc; bus.emit('dialogue', { npc: cmd.npc, knot: NPCS[cmd.npc].knot, vars: varsFor(cmd.npc) }); return true; }
      const n = NPCS[cmd.npc] ? npcHere(cmd.npc) : null;
      if (!n || state.party[0].down) return true;
      if (dist(n) > TALK_REACH) {
        // walk up beside them (the tiles level with them on screen first, so neither hides the
        // other), else as near as the path allows
        const p = state.player, tx = Math.floor(n.x), ty = Math.floor(n.y);
        const d = (q) => hypot(q.x + 0.5 - p.x, q.y + 0.5 - p.y);
        const spots = BESIDE.map(([dx, dy], i) => ({ x: tx + dx, y: ty + dy, level: i < 2 ? 0 : 1 })).filter((q) => canStand(q.x, q.y));
        spots.sort((a, b) => a.level - b.level || d(a) - d(b));
        if (!(spots.length && walkTo(spots[0].x, spots[0].y, { type: 'talk', npc: n.id }, { near: 0 }))) walkTo(tx, ty, { type: 'talk', npc: n.id }, { near: 1 });
        return true;
      }
      talking = n.id;
      bus.emit('dialogue', { npc: n.id, knot: NPCS[n.id].knot, vars: varsFor(n.id) });
      return true;
    }
    if (cmd.type === 'dialogueEffect') {
      if (!talking || !Array.isArray(cmd.args)) return true;
      if (cmd.tag === 'quest') effect(talking, cmd.args);   // quests.js checks it's this NPC's quest, in the right state
      if (cmd.tag === 'companion' && cmd.args[0] === 'join' && NPCS[talking].found && npcHere(talking)) {   // heroes.js checks he's free to go
        join(talking);                                    // (he stays where he stood until the talk ends: tick)
      }
      const def = NPCS[talking], [verb, name, amt] = cmd.args;
      if (cmd.tag === 'flag' && def.flags.includes(name)) {
        const before = state.flags[name] || 0;
        const value = verb === 'set' ? 1 : verb === 'add' ? Math.min(FLAG_MAX, before + Math.max(0, Math.min(FLAG_MAX, Math.floor(+amt) || 0))) : before;
        if (value !== before) { state.flags[name] = value; bus.emit('flagChanged', { name, value }); }
      }
      // unknown tags and names are ignored, never an error; either way the story gets the variables
      // as they now stand, so a topic list it comes back to reads the quest it just handed in
      bus.emit('talkVars', { npc: talking, vars: varsFor(talking) });
      return true;
    }
    if (cmd.type === 'endTalk') { if (talking) bus.emit('talkEnded', { npc: talking }); talking = null; return true; }
    return false;
  }
  // walking off ends the conversation (a stale one can't be used to set flags later)
  function tick() {
    const w = getWorld();
    if (!talking && w.npcs && w.npcs.some((n) => n.visitor && state.flags[NPCS[n.id].visitor])) w.npcs = w.npcs.filter((n) => !(n.visitor && state.flags[NPCS[n.id].visitor]));   // a visitor who's said his piece is gone
    if (!talking && w.npcs && w.npcs.some((n) => n.found && withParty(n.id))) {   // a found companion who joined leaves the hall with you; it stays quiet for the visit (battle.js)
      w.npcs = w.npcs.filter((n) => !(n.found && withParty(n.id)));
      if (w.level && w.level.descentRoom) w.freedHall = w.level.descentRoom.id;
    }
    if (talking && !withYou(talking)) { const n = npcHere(talking); if (!n || dist(n) > TALK_REACH * 3) { bus.emit('talkEnded', { npc: talking }); talking = null; } }
  }
  return { command, tick, get talking() { return talking; } };
}
