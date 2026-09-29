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
//                                allowed it (flags it may set). Anything else does nothing.
//   endTalk {}                   the window closed
// Events: 'dialogue' { npc, knot, vars } · 'flagChanged' { name, value } · 'talkEnded' { npc }
// Save: state.flags { [name]: number } (core.js snapshot / restore). A conversation itself is not
// saved: it ends on a reload, and anything it changed went through a command.

import { hypot } from './detmath.js';

// Where each stands: beside a service building of its region's town (off = tiles from the
// building's anchor toward the square), and what it may change.
export const NPCS = {
  maudry_fenn: { region: 'vale', near: 'tavern', off: [4, 7], knot: 'maudry_hub', flags: ['met_maudry'] },
};
export const TALK_REACH = 2.2;                    // tiles, centre to centre
const BESIDE = [[1, -1], [-1, 1], [2, 0], [0, 2]];   // (x+1, y−1) and (x−1, y+1) stand level with them on screen
const FLAG_MAX = 99;

/** stand each of this town's NPCs on the nearest open tile to its spot, and make that tile solid
 * (you walk round people, not through them); world.npcs = [{ id, x, y }]
 * @param {any} world @param {(w: any, x: number, y: number) => boolean} isWalkable
 * @param {(w: any, x: number, y: number) => void} block */
export function placeNpcs(world, isWalkable, block) {
  world.npcs = [];
  if (world.kind !== 'town') return world;
  for (const [id, n] of Object.entries(NPCS)) {
    if (n.region !== world.region) continue;
    const sv = (world.services || []).find((s) => s.kind === n.near); if (!sv) continue;
    const tx = Math.floor(sv.x + n.off[0]), ty = Math.floor(sv.y + n.off[1]);
    let spot = null;
    for (let d = 0; d <= 6 && !spot; d++) for (let dy = -d; dy <= d && !spot; dy++) for (let dx = -d; dx <= d && !spot; dx++)
      if (Math.max(Math.abs(dx), Math.abs(dy)) === d && isWalkable(world, tx + dx + 0.5, ty + dy + 0.5)) spot = { x: tx + dx + 0.5, y: ty + dy + 0.5 };
    if (spot) { world.npcs.push({ id, x: spot.x, y: spot.y }); block(world, spot.x, spot.y); }
  }
  return world;
}

/** @param {{ state: any, bus: any, getWorld: () => any, walkTo: (tx: number, ty: number, then: any, opts?: any) => boolean, canStand: (tx: number, ty: number) => boolean }} o */
export function createTalk({ state, bus, getWorld, walkTo, canStand }) {
  if (!state.flags) state.flags = {};
  let talking = null;                             // the NPC id of the open conversation (runtime only)
  const npcHere = (id) => (getWorld().npcs || []).find((n) => n.id === id) || null;
  const dist = (n) => { const p = state.player; return hypot(n.x - p.x, n.y - p.y); };

  // what Ink may read: the hero, the party, and this NPC's own flags (quest-lore-system §6)
  function varsFor(id) {
    const h = state.party[0], fallen = state.party.slice(1).find((m) => m.fallen);
    /** @type {Record<string, string|number>} */
    const v = { hero_name: h.name, hero_class: h.cls, hero_origin: h.origin || '', hero_level: h.level,
      party_size: state.party.filter((m) => !m.fallen).length, fallen_name: fallen ? fallen.name : '' };
    for (const f of NPCS[id].flags) v['flag_' + f] = state.flags[f] || 0;
    return v;
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
