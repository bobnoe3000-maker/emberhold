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
// Events: 'dialogue' { npc, knot, vars } · 'flagChanged' { name, value } · 'talkEnded' { npc }
// Save: state.flags { [name]: number } (core.js snapshot / restore). A conversation itself is not
// saved: it ends on a reload, and anything it changed went through a command.
//
// Named people (Maudry, Osric, Ilse) keep one spot and are solid: you walk round them. Townsfolk
// (`folk`) keep a routine (world doc §5, v1.6): the in-game day (DAY_S) has four parts, dawn · day ·
// dusk · night, and each townsperson stands at one of two spots in each part (`day`). When the part
// changes they walk there along a path (walkers, not walls: you pass through them). A town built
// mid-day places them where the hour has them; their positions are runtime, never saved.

import { hypot } from './detmath.js';
import { DAY_S } from './heroes.js';
import { findPath } from './path.js';

// Where each stands: beside a service building of its region's town (or the square's well, `hub`;
// off = tiles from that anchor), and what it may change. A spot is [anchor, [dx, dy]].
export const NPCS = {
  maudry_fenn: { region: 'vale', spots: [['tavern', [4, 7]]], knot: 'maudry_hub', flags: ['met_maudry'] },
  osric_hale: { region: 'vale', spots: [['hub', [3, -2]]], knot: 'osric_hub', flags: ['met_osric'] },
  sister_ilse: { region: 'vale', spots: [['temple', [3, 6]]], knot: 'ilse_hub', flags: ['met_ilse'] },
  wendel: { region: 'vale', folk: true, spots: [['shop', [3, 6]], ['tavern', [7, 8]]], day: [0, 0, 0, 1], knot: 'wendel_hub', flags: ['met_wendel'] },
  bess_hale: { region: 'vale', folk: true, spots: [['smith', [3, 6]], ['tavern', [2, 9]]], day: [0, 0, 0, 1], knot: 'bess_hub', flags: ['met_bess'] },
  col: { region: 'vale', folk: true, spots: [['hub', [9, 7]], ['tavern', [6, 10]]], day: [0, 0, 1, 1], knot: 'col_hub', flags: ['met_col'] },
  jory: { region: 'vale', folk: true, spots: [['hub', [-2, -7]], ['temple', [6, 4]]], day: [0, 1, 0, 1], knot: 'jory_hub', flags: ['met_jory'] },
  nell_tolley: { region: 'vale', folk: true, spots: [['inn', [3, 6]], ['hub', [-7, -5]]], day: [1, 0, 0, 0], knot: 'nell_hub', flags: ['met_nell'] },
  hedda: { region: 'vale', folk: true, spots: [['hub', [-8, 4]], ['shop', [-2, 7]]], day: [0, 0, 1, 1], knot: 'hedda_hub', flags: ['met_hedda'] },
};
export const PARTS = 4, PART_S = DAY_S / PARTS;                  // dawn · day · dusk · night
/** the part of the in-game day at time t (s of play) @param {number} t */
export const partOf = (t) => Math.floor((t % DAY_S) / PART_S);
const FOLK_SPEED = 1.6;                                          // tiles a second: an amble
export const TALK_REACH = 2.2;                    // tiles, centre to centre
const BESIDE = [[1, -1], [-1, 1], [2, 0], [0, 2]];   // (x+1, y−1) and (x−1, y+1) stand level with them on screen
const FLAG_MAX = 99;

/** the open tile nearest a spot of this town, or null @param {any} world @param {any[]} spot [anchor, [dx, dy]] @param {(w: any, x: number, y: number) => boolean} isWalkable */
function spotTile(world, [anchor, off], isWalkable) {
  const a = anchor === 'hub' ? world.hub : (world.services || []).find((s) => s.kind === anchor); if (!a) return null;
  const tx = Math.floor(a.x + off[0]), ty = Math.floor(a.y + off[1]);
  for (let d = 0; d <= 6; d++) for (let dy = -d; dy <= d; dy++) for (let dx = -d; dx <= d; dx++)
    if (Math.max(Math.abs(dx), Math.abs(dy)) === d && isWalkable(world, tx + dx + 0.5, ty + dy + 0.5)) return { x: tx + dx + 0.5, y: ty + dy + 0.5 };
  return null;
}
/** stand each of this town's NPCs where the hour has them: the named on their spot, made solid (you
 * walk round people, not through them), and townsfolk at the spot of this part of the day;
 * world.npcs = [{ id, x, y, folk?, spots, at, path, moving, fx, fy }]
 * @param {any} world @param {(w: any, x: number, y: number) => boolean} isWalkable
 * @param {(w: any, x: number, y: number) => void} block @param {number} part the part of the day (partOf) */
export function placeNpcs(world, isWalkable, block, part = 0) {
  world.npcs = [];
  if (world.kind !== 'town') return world;
  for (const [id, n] of Object.entries(NPCS)) {                  // (the named first: their tiles go solid before townsfolk look for theirs)
    if (n.region !== world.region || n.folk) continue;
    const spot = spotTile(world, n.spots[0], isWalkable);
    if (spot) { world.npcs.push({ id, x: spot.x, y: spot.y, px: spot.x, py: spot.y }); block(world, spot.x, spot.y); }
  }
  for (const [id, n] of Object.entries(NPCS)) {
    if (n.region !== world.region || !n.folk) continue;
    const spots = n.spots.map((s) => spotTile(world, s, isWalkable)); if (spots.some((q) => !q)) continue;
    const at = n.day[part] || 0, q = spots[at];
    world.npcs.push({ id, folk: true, x: q.x, y: q.y, px: q.x, py: q.y, spots, at, path: null, moving: false, fx: 0, fy: 1 });
  }
  return world;
}
/** townsfolk keep their routine: when the part of the day changes, each walks to that part's spot
 * (stopping while you talk to them). Deterministic: paths from the world's own walkability.
 * @param {any} world @param {number} t state.t @param {(w: any, x: number, y: number) => boolean} isWalkable @param {string|null} talking @param {number} dt */
export function stepFolk(world, t, isWalkable, talking, dt) {
  if (world.kind !== 'town') return;
  const part = partOf(t);
  for (const n of world.npcs || []) {
    if (!n.folk) continue;
    n.px = n.x; n.py = n.y; n.moving = false;
    if (talking === n.id) continue;
    const want = NPCS[n.id].day[part] || 0;
    if (want !== n.at && !n.path) {
      const g = n.spots[want], path = findPath(n.x, n.y, g.x, g.y, (x, y) => isWalkable(world, x + 0.5, y + 0.5), { maxNodes: 20000 });
      n.at = want; n.path = path ? path.slice(1).map(([x, y]) => ({ x, y })) : [];
      if (!path) { n.x = n.px = g.x; n.y = n.py = g.y; }          // (no way there: they're simply there, off in the next street)
    }
    if (n.path && n.path.length) {
      const q = n.path[0], dx = q.x - n.x, dy = q.y - n.y, d = hypot(dx, dy), s = FOLK_SPEED * dt;
      if (d <= s) { n.x = q.x; n.y = q.y; n.path.shift(); } else { n.x += (dx / d) * s; n.y += (dy / d) * s; }
      n.moving = true; n.fx = dx; n.fy = dy;
      if (!n.path.length) n.path = null;
    }
  }
}

/** @param {{ state: any, bus: any, getWorld: () => any, walkTo: (tx: number, ty: number, then: any, opts?: any) => boolean, canStand: (tx: number, ty: number) => boolean,
 *   moreVars?: (npc: string) => Record<string, number>, effect?: (npc: string, args: any) => void }} o moreVars: what else Ink may read (quests.js); effect: the `quest` tag */
export function createTalk({ state, bus, getWorld, walkTo, canStand, moreVars = () => ({}), effect = () => {} }) {
  if (!state.flags) state.flags = {};
  let talking = null;                             // the NPC id of the open conversation (runtime only)
  const npcHere = (id) => (getWorld().npcs || []).find((n) => n.id === id) || null;
  const dist = (n) => { const p = state.player; return hypot(n.x - p.x, n.y - p.y); };

  // what Ink may read: the hero, the party, and this NPC's own flags (quest-lore-system §6)
  function varsFor(id) {
    const h = state.party[0], fallen = state.party.slice(1).find((m) => m.fallen);
    /** @type {Record<string, string|number>} */
    const v = { hero_name: h.name, hero_class: h.cls, hero_origin: h.origin || '', hero_level: h.level,
      party_size: state.party.filter((m) => !m.fallen).length, fallen_name: fallen ? fallen.name : '', day_part: partOf(state.t) };
    for (const f of NPCS[id].flags) v['flag_' + f] = state.flags[f] || 0;
    return { ...v, ...moreVars(id) };
  }

  function command(cmd) {
    if (cmd.type === 'talk') {
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
      if (cmd.tag === 'quest') { effect(talking, cmd.args); return true; }   // quests.js checks it's this NPC's quest, in the right state
      const def = NPCS[talking], [verb, name, amt] = cmd.args;
      if (cmd.tag === 'flag' && def.flags.includes(name)) {
        const before = state.flags[name] || 0;
        const value = verb === 'set' ? 1 : verb === 'add' ? Math.min(FLAG_MAX, before + Math.max(0, Math.min(FLAG_MAX, Math.floor(+amt) || 0))) : before;
        if (value !== before) { state.flags[name] = value; bus.emit('flagChanged', { name, value }); }
      }
      return true;                                // unknown tags and names: ignored, never an error
    }
    if (cmd.type === 'endTalk') { if (talking) bus.emit('talkEnded', { npc: talking }); talking = null; return true; }
    return false;
  }
  // walking off ends the conversation (a stale one can't be used to set flags later)
  function tick() { if (talking) { const n = npcHere(talking); if (!n || dist(n) > TALK_REACH * 3) { bus.emit('talkEnded', { npc: talking }); talking = null; } } }
  return { command, tick, get talking() { return talking; } };
}
