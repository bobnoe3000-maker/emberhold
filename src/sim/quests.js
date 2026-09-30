// @ts-check
// quests.js — quests (quest-lore-system §3–5, §10). Headless: a quest's state, its objectives
// counted from the sim's own events, and its rewards, paid by the sim's own rules. Titles and
// journal text live in content/quests/*.json; the sim keeps its own table of what counts and what
// pays (it can't read JSON files, and must not trust the client's) and a test keeps the two in step.
// Quests made rather than written (the Lantern Guild's board jobs, board.js) come in through
// `extraDef`: a pure function of the id, so the save keeps only ids and counters.
//
// States: 0 available · 1 active · 2 ready (objectives done: go back to the giver) · 3 done;
// −1 locked (its gates fail). Kept per quest in state.quests[id] = { st, step, n } (n: one counter
// per objective of the current step).
//
// Written quests are taken and handed in in conversation: the Ink tags `# quest: accept <id>` and
// `# quest: turnin <id>` arrive as dialogueEffect commands and count only while talking to that
// quest's giver, and only from the right state. Board jobs are taken and handed in at the board
// (board.js). Nothing else grants a quest's rewards: begin() and finish() are the only ways in.
// Commands: track { id | null } · questAbandon { id } (not chapters).
// Events: 'questChanged' { id, state, step, progress } · 'questReward' { id, xp, gold } · 'questTracked' { id }.
// Objective types (quest-lore-system §4.3), each counted in its site:
//   waves   waves cleared (hall: only in a floor's stairs-down hall; floor: on that floor or deeper)
//   loot    chests opened
//   elites  elites slain
//   reach   the deepest floor reached (count = the floor, 1 = the first), going down after taking it

import { gainXp } from './party.js';

export const QS = { LOCKED: -1, AVAILABLE: 0, ACTIVE: 1, READY: 2, DONE: 3 };
/** @typedef {{ type: 'waves' | 'loot' | 'elites' | 'reach', site: string, count: number, hall?: boolean, floor?: number }} Objective */
/** @typedef {{ kind: string, giver: string, region: string, level: [number, number], steps: { id: string, objectives: Objective[] }[], rewards: { xp: number, gold: number } }} QuestDef */
/** @type {Record<string, QuestDef>} */
export const QUESTS = {
  vale_long_way_round: {
    kind: 'errand', giver: 'maudry_fenn', region: 'vale', level: [1, 8],
    steps: [{ id: 'barrows', objectives: [{ type: 'waves', site: 'barrows', count: 4 }, { type: 'loot', site: 'barrows', count: 1 }] }],
    rewards: { xp: 150, gold: 40 },
  },
  vale_captains_ledger: {                            // Osric's bounty (world doc §5, v1.6): the bright-eyed ones lead every fifth wave
    kind: 'bounty', giver: 'osric_hale', region: 'vale', level: [2, 8],
    steps: [{ id: 'barrows', objectives: [{ type: 'elites', site: 'barrows', count: 3 }] }],
    rewards: { xp: 260, gold: 60 },
  },
};
const BENCH_XP = 0.5;                                // the bench earns half, as in battle
const target = (o) => o.count;

/** @param {{ state: any, bus: any, getWorld: () => any, extraDef?: (id: string) => QuestDef | null }} o */
export function createQuests({ state, bus, getWorld, extraDef = () => null }) {
  if (!state.quests) state.quests = {};
  if (state.tracked === undefined) state.tracked = null;
  /** @param {string} id @returns {QuestDef | null} */
  const defOf = (id) => (Object.prototype.hasOwnProperty.call(QUESTS, id) ? QUESTS[id] : extraDef(id));
  const inst = (id) => state.quests[id] || null;
  const gates = (id) => { const d = QUESTS[id], lv = state.party[0].level; return !!d && lv >= d.level[0] && lv <= d.level[1]; };
  /** @param {string} id */
  const status = (id) => (inst(id) ? inst(id).st : gates(id) ? QS.AVAILABLE : QS.LOCKED);
  const changed = (id) => { const q = inst(id); bus.emit('questChanged', { id, state: q ? q.st : status(id), step: q ? q.step : 0, progress: q ? q.n.slice() : [] }); };
  const siteHere = (site) => { const w = getWorld(); return w.kind === 'dungeon' && (w.site || 'barrows') === site; };
  const floorHere = () => (getWorld().depth || 0) + 1;
  const hallHere = (room) => { const L = getWorld().level; return !!L && !!L.descentRoom && L.descentRoom.id === room; };

  // count an event into every active quest's current step, then advance any step that's done
  function count(fn) {
    for (const id of Object.keys(state.quests)) {
      const q = state.quests[id], d = defOf(id); if (q.st !== QS.ACTIVE || !d) continue;
      const objs = d.steps[q.step].objectives; let moved = false;
      objs.forEach((o, i) => { const v = Math.min(target(o), fn(o, q.n[i])); if (v !== q.n[i]) { q.n[i] = v; moved = true; } });
      if (!moved) continue;
      if (objs.every((o, i) => q.n[i] >= target(o))) {
        if (q.step + 1 < d.steps.length) { q.step += 1; q.n = d.steps[q.step].objectives.map(() => 0); }
        else q.st = QS.READY;
      }
      changed(id);
    }
  }
  bus.on('wave', (e) => { if (e.cleared) count((o, n) => (o.type === 'waves' && siteHere(o.site) && (!o.hall || hallHere(e.room)) && (!o.floor || floorHere() >= o.floor) ? n + 1 : n)); });
  bus.on('looted', (e) => { if (e.kind === 'chest') count((o, n) => (o.type === 'loot' && siteHere(o.site) ? n + 1 : n)); });
  bus.on('slain', (e) => { if (e.elite) count((o, n) => (o.type === 'elites' && siteHere(o.site) ? n + 1 : n)); });
  // a floor change inside a site (arriving from the overland or loading a save carry a scene, and don't count)
  bus.on('levelChanged', (e) => { if (!('scene' in e)) count((o, n) => (o.type === 'reach' && siteHere(o.site) ? Math.max(n, floorHere()) : n)); });

  function pay(id) {
    const r = /** @type {QuestDef} */ (defOf(id)).rewards, lv = (m) => bus.emit('levelUp', { id: m.id, name: m.name, level: m.level });
    for (const m of state.party) if (!m.fallen) gainXp(m, r.xp, lv);
    for (const m of state.bench || []) gainXp(m, Math.round(r.xp * BENCH_XP), lv);
    state.counters.gold = (state.counters.gold || 0) + r.gold;
    bus.emit('questReward', { id, xp: r.xp, gold: r.gold });
    bus.emit('countersChanged', { ...state.counters }); bus.emit('partyChanged', state.party);
  }
  const nextTracked = () => Object.keys(state.quests).find((k) => state.quests[k].st === QS.ACTIVE || state.quests[k].st === QS.READY) || null;

  /** take a quest (the caller has checked where and whether) @param {string} id */
  function begin(id) {
    const d = defOf(id); if (!d || inst(id)) return;
    state.quests[id] = { st: QS.ACTIVE, step: 0, n: d.steps[0].objectives.map(() => 0) };
    if (!state.tracked) state.tracked = id;
    changed(id);
  }
  /** hand one in: done, paid once @param {string} id */
  function finish(id) {
    if (status(id) !== QS.READY) return;
    state.quests[id].st = QS.DONE;
    pay(id);
    if (state.tracked === id) state.tracked = nextTracked();
    changed(id);
  }
  /** an Ink `# quest: <verb> <id>` tag, from a conversation with `talking` (null: none open) */
  function effect(talking, args) {
    const [verb, id] = Array.isArray(args) ? args : [], d = QUESTS[id];
    if (!talking || !d || d.giver !== talking) return;                  // only its giver, in conversation
    if (verb === 'accept' && status(id) === QS.AVAILABLE) begin(id);
    else if (verb === 'turnin') finish(id);
  }
  function command(cmd) {
    if (cmd.type === 'track') {
      const id = cmd.id ?? null;
      if (id === null || status(id) === QS.ACTIVE || status(id) === QS.READY) { state.tracked = id; bus.emit('questTracked', { id }); }
      return true;
    }
    if (cmd.type === 'questAbandon') {
      const id = cmd.id, d = defOf(id);
      if (d && d.kind !== 'chapter' && (status(id) === QS.ACTIVE || status(id) === QS.READY)) {
        delete state.quests[id]; if (state.tracked === id) state.tracked = nextTracked(); changed(id);
      }
      return true;
    }
    return false;
  }
  /** what Ink may read about the quests an NPC gives: q_<id> = its status @param {string} npc */
  function varsFor(npc) {
    /** @type {Record<string, number>} */
    const v = {};
    for (const [id, d] of Object.entries(QUESTS)) if (d.giver === npc) v['q_' + id] = status(id);
    return v;
  }
  /** the tracked quest's next place, as a compass row made from one of the rows already listed
   * (travel.js): back to the giver (or the board, in the square) when ready; else into its site,
   * down its stairs, to a chest or the hall it wants. None while the fight it wants is the one
   * you're in. @param {any[]} rows @param {any} world @param {any} battle the fight on, or null */
  function compass(rows, world, battle = null) {
    const id = state.tracked, q = id && inst(id), d = id && defOf(id);
    if (!q || !d || (q.st !== QS.ACTIVE && q.st !== QS.READY)) return rows;
    const pick = (...ids) => ids.map((k) => rows.find((r) => r.id === k && !r.off)).find(Boolean);
    let base = null;
    if (q.st === QS.READY) {
      if (world.kind === 'town') {
        if (d.kind === 'board') base = pick('square');                 // the board is in the tavern, off the square (none once you're there)
        else { const n = (world.npcs || []).find((x) => x.id === d.giver); if (n) base = { tx: Math.floor(n.x), ty: Math.floor(n.y), near: 1, then: { type: 'talk', npc: n.id }, sub: 'in town', steps: 0 }; }
      } else base = world.kind === 'dungeon' ? pick('exit') : pick('town');
    } else {
      const objs = d.steps[q.step].objectives, owe = objs.filter((o, i) => q.n[i] < o.count);
      const inSite = owe.some((o) => siteHere(o.site));
      if (battle && inSite && owe.some((o) => (o.type === 'waves' && (!o.hall || hallHere(battle.room)) && (!o.floor || floorHere() >= o.floor)) || o.type === 'elites')) return rows;
      if (world.kind === 'town') base = pick('road-out');
      else if (world.kind !== 'dungeon') base = pick('dungeon', 'unexplored');
      else {
        const o = owe[0], down = pick('stairs-down');
        if (!o) base = null;
        else if (o.type === 'reach' || (o.floor && floorHere() < o.floor)) base = down || pick('next-room');
        else if (o.hall) base = down ? { ...down, then: null, label: 'The stairs-down hall', sub: down.sub.replace(/^to depth \d+ · /, '') } : pick('next-room');
        else if (o.type === 'loot') base = pick('loot', 'next-room', 'farm-room');
        else base = pick('next-room', 'farm-room', 'loot');
      }
    }
    if (!base) return rows;
    return [{ ...base, id: 'quest', icon: 'quest', quest: id, label: base.label || '', off: false }, ...rows];
  }
  /** @returns {{ quests: Record<string, number[]>, tracked: string|null }} */
  function snapshot() {
    /** @type {Record<string, number[]>} */
    const quests = {};
    for (const [id, q] of Object.entries(state.quests)) quests[id] = [q.st, q.step, ...q.n];
    return { quests, tracked: state.tracked };
  }
  // read back only what makes sense: known quests, real states and steps, counters within bounds
  // (the party is restored first: a board job above the hero's level rebuilds to nothing)
  function restore(data) {
    state.quests = {}; state.tracked = null;
    for (const [id, t] of Object.entries(data?.quests || {})) {
      const d = defOf(id); if (!d || !Array.isArray(t)) continue;
      const [st, step, ...n] = t;
      if (![QS.ACTIVE, QS.READY, QS.DONE].includes(st) || !(step >= 0 && step < d.steps.length)) continue;
      const objs = d.steps[step].objectives;
      state.quests[id] = { st, step, n: objs.map((o, i) => Math.max(0, Math.min(target(o), Math.floor(+n[i]) || 0))) };
    }
    const tr = data?.tracked; if (tr && state.quests[tr] && state.quests[tr].st !== QS.DONE) state.tracked = tr;
  }
  return { command, effect, begin, finish, varsFor, compass, snapshot, restore, status, def: defOf };
}
