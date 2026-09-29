// @ts-check
// quests.js — quests (quest-lore-system §3–5, §10). Headless: a quest's state, its objectives
// counted from the sim's own events, and its rewards, paid by the sim's own rules. Titles and
// journal text live in content/quests/*.json; the sim keeps its own table of what counts and what
// pays (it can't read JSON files, and must not trust the client's) and a test keeps the two in step.
//
// States: 0 available · 1 active · 2 ready (objectives done: go back to the giver) · 3 done;
// −1 locked (its gates fail). Kept per quest in state.quests[id] = { st, step, n } (n: one counter
// per objective of the current step).
//
// Accepting and turning in happen in conversation: the Ink tags `# quest: accept <id>` and
// `# quest: turnin <id>` arrive as dialogueEffect commands and count only while talking to that
// quest's giver, and only from the right state. Nothing else grants a quest's rewards.
// Commands: track { id | null } · questAbandon { id } (not chapters).
// Events: 'questChanged' { id, state, step, progress } · 'questReward' { id, xp, gold } · 'questTracked' { id }.
// Objective types today: `waves` (waves cleared in a site's rooms) and `loot` (chests opened in a
// site). More come with more sites (quest-lore-system §4.3). (`reach` a floor can come now that every
// floor has a stair back up, GDD §3.1.)

import { gainXp } from './party.js';

export const QS = { LOCKED: -1, AVAILABLE: 0, ACTIVE: 1, READY: 2, DONE: 3 };
/** @typedef {{ type: 'waves' | 'loot', site: string, count: number }} Objective */
/** @type {Record<string, { kind: string, giver: string, region: string, level: [number, number], steps: { id: string, objectives: Objective[] }[], rewards: { xp: number, gold: number } }>} */
export const QUESTS = {
  vale_long_way_round: {
    kind: 'errand', giver: 'maudry_fenn', region: 'vale', level: [1, 8],
    steps: [{ id: 'barrows', objectives: [{ type: 'waves', site: 'barrows', count: 4 }, { type: 'loot', site: 'barrows', count: 1 }] }],
    rewards: { xp: 150, gold: 40 },
  },
};
const BENCH_XP = 0.5;                                // the bench earns half, as in battle
const target = (o) => o.count;

/** @param {{ state: any, bus: any, getWorld: () => any }} o */
export function createQuests({ state, bus, getWorld }) {
  if (!state.quests) state.quests = {};
  if (state.tracked === undefined) state.tracked = null;
  const inst = (id) => state.quests[id] || null;
  const gates = (id) => { const d = QUESTS[id], lv = state.party[0].level; return !!d && lv >= d.level[0] && lv <= d.level[1]; };
  /** @param {string} id */
  const status = (id) => (inst(id) ? inst(id).st : gates(id) ? QS.AVAILABLE : QS.LOCKED);
  const changed = (id) => { const q = inst(id); bus.emit('questChanged', { id, state: q ? q.st : status(id), step: q ? q.step : 0, progress: q ? q.n.slice() : [] }); };
  const siteHere = (site) => { const w = getWorld(); return w.kind === 'dungeon' && (w.site || 'barrows') === site; };

  // count an event into every active quest's current step, then advance any step that's done
  function count(fn) {
    for (const id of Object.keys(state.quests)) {
      const q = state.quests[id]; if (q.st !== QS.ACTIVE) continue;
      const objs = QUESTS[id].steps[q.step].objectives; let moved = false;
      objs.forEach((o, i) => { const v = Math.min(target(o), fn(o, q.n[i])); if (v !== q.n[i]) { q.n[i] = v; moved = true; } });
      if (!moved) continue;
      if (objs.every((o, i) => q.n[i] >= target(o))) {
        if (q.step + 1 < QUESTS[id].steps.length) { q.step += 1; q.n = QUESTS[id].steps[q.step].objectives.map(() => 0); }
        else q.st = QS.READY;
      }
      changed(id);
    }
  }
  bus.on('wave', (e) => { if (e.cleared) count((o, n) => (o.type === 'waves' && siteHere(o.site) ? n + 1 : n)); });
  bus.on('looted', (e) => { if (e.kind === 'chest') count((o, n) => (o.type === 'loot' && siteHere(o.site) ? n + 1 : n)); });

  function pay(id) {
    const r = QUESTS[id].rewards, lv = (m) => bus.emit('levelUp', { id: m.id, name: m.name, level: m.level });
    for (const m of state.party) if (!m.fallen) gainXp(m, r.xp, lv);
    for (const m of state.bench || []) gainXp(m, Math.round(r.xp * BENCH_XP), lv);
    state.counters.gold = (state.counters.gold || 0) + r.gold;
    bus.emit('questReward', { id, xp: r.xp, gold: r.gold });
    bus.emit('countersChanged', { ...state.counters }); bus.emit('partyChanged', state.party);
  }
  const nextTracked = () => Object.keys(state.quests).find((k) => state.quests[k].st === QS.ACTIVE || state.quests[k].st === QS.READY) || null;

  /** an Ink `# quest: <verb> <id>` tag, from a conversation with `talking` (null: none open) */
  function effect(talking, args) {
    const [verb, id] = Array.isArray(args) ? args : [], d = QUESTS[id];
    if (!talking || !d || d.giver !== talking) return;                  // only its giver, in conversation
    if (verb === 'accept' && status(id) === QS.AVAILABLE) {
      state.quests[id] = { st: QS.ACTIVE, step: 0, n: d.steps[0].objectives.map(() => 0) };
      if (!state.tracked) state.tracked = id;
      changed(id);
    } else if (verb === 'turnin' && status(id) === QS.READY) {
      state.quests[id].st = QS.DONE;
      pay(id);
      if (state.tracked === id) state.tracked = nextTracked();
      changed(id);
    }
  }
  function command(cmd) {
    if (cmd.type === 'track') {
      const id = cmd.id ?? null;
      if (id === null || status(id) === QS.ACTIVE || status(id) === QS.READY) { state.tracked = id; bus.emit('questTracked', { id }); }
      return true;
    }
    if (cmd.type === 'questAbandon') {
      const id = cmd.id, d = QUESTS[id];
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
   * (travel.js): back to the giver when ready; else into its site, to a chest when one is owed.
   * None while a fight in its site is what it wants: you're already there. */
  function compass(rows, world, inBattle = false) {
    const id = state.tracked, q = id && inst(id); if (!q || (q.st !== QS.ACTIVE && q.st !== QS.READY)) return rows;
    const d = QUESTS[id], pick = (...ids) => ids.map((k) => rows.find((r) => r.id === k && !r.off)).find(Boolean);
    let base = null;
    if (q.st === QS.READY) {
      if (world.kind === 'town') { const n = (world.npcs || []).find((x) => x.id === d.giver); if (n) base = { tx: Math.floor(n.x), ty: Math.floor(n.y), near: 1, then: { type: 'talk', npc: n.id }, sub: 'in town', steps: 0 }; }
      else base = world.kind === 'dungeon' ? pick('exit') : pick('town');
    } else {
      const objs = d.steps[q.step].objectives, owed = (type) => objs.some((o, i) => o.type === type && q.n[i] < o.count);
      if (inBattle && owed('waves') && objs.some((o) => o.type === 'waves' && siteHere(o.site))) return rows;
      base = world.kind === 'town' ? pick('road-out') : world.kind === 'dungeon' ? (owed('waves') ? pick('next-room', 'farm-room', 'loot') : pick('loot', 'next-room', 'farm-room')) : pick('dungeon', 'unexplored');
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
  function restore(data) {
    state.quests = {}; state.tracked = null;
    for (const [id, t] of Object.entries(data?.quests || {})) {
      const d = QUESTS[id]; if (!d || !Array.isArray(t)) continue;
      const [st, step, ...n] = t;
      if (![QS.ACTIVE, QS.READY, QS.DONE].includes(st) || !(step >= 0 && step < d.steps.length)) continue;
      const objs = d.steps[step].objectives;
      state.quests[id] = { st, step, n: objs.map((o, i) => Math.max(0, Math.min(target(o), Math.floor(+n[i]) || 0))) };
    }
    const tr = data?.tracked; if (tr && state.quests[tr] && state.quests[tr].st !== QS.DONE) state.tracked = tr;
  }
  return { command, effect, varsFor, compass, snapshot, restore, status };
}
