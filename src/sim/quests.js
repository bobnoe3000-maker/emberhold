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
// Events: 'questChanged' { id, state, step, progress } · 'questAccepted' { id } · 'questReward' { id, xp, gold } · 'questTracked' { id }.
// Objective types (quest-lore-system §4.3), each counted in its site:
//   waves   waves cleared (hall: only in a floor's stairs-down hall; floor: on that floor or deeper)
//   loot    chests opened
//   elites  elites slain
//   reach   the deepest floor reached (count = the floor, 1 = the first), going down after taking it
//   fragment  Chronicle fragments found (lore.js 'fragmentFound')
//   boss      a named boss put down in its site (battle.js 'bossDown'); one who already fell counts on accept
// Chapters and chains (M5): `after` names the quests that must be done first; `turnin` names who takes
// it in (default: its giver); `reveal` names hidden sites its hand-in reveals (sites.js). A found
// companion's chain (Brannoc's) is given and taken in by him (`companion`: only while he's with you, in
// the party or on the bench); `rewards.item` is an heirloom (items.js HEIRLOOMS) paid into the bag.
// A class trial (`trial`: the class) is offered while someone of that class in the company (party or
// bench) is level 6 or more and the company hasn't done it; handed in, it teaches that class its
// level-6 ability (state.trials, skills.js), every member of the class, for good.

import { gainXp, levelShare } from './party.js';
import { FRAGMENTS } from './lore.js';

export const QS = { LOCKED: -1, AVAILABLE: 0, ACTIVE: 1, READY: 2, DONE: 3 };
// What a quest pays in XP (GDD §9 v1.39; the owner, 2026-10-05, with the slower curve): a share of a level, at the level
// the quest is written for (rewards.lv), or a member's own if they're under it. So a chapter is about half a level to
// whoever it was meant for, an underlevelled companion catches up, and an old errand doesn't hand a high-level company
// a third of its level. (They were fixed numbers sized for the old curve: a chapter fell from ~25 % to ~3 % of a level.)
/** @param {{ share?: number, lv?: number }} r @param {number} level the member's */
export const questXp = (r, level) => levelShare(Math.min(level, r.lv), r.share);
/** @typedef {{ type: 'waves' | 'loot' | 'elites' | 'reach' | 'fragment' | 'boss', site: string, count: number, hall?: boolean, floor?: number, boss?: string }} Objective */
/** @typedef {{ kind: string, giver: string, region: string, level: [number, number], steps: { id: string, objectives: Objective[] }[], rewards: { share?: number, lv?: number, xp?: number, gold: number, item?: string }, turnin?: string, after?: string[], reveal?: string[], companion?: string, trial?: string }} QuestDef */
/** @type {Record<string, QuestDef>} */
export const QUESTS = {
  vale_long_way_round: {
    kind: 'errand', giver: 'maudry_fenn', region: 'vale', level: [1, 8],
    steps: [{ id: 'barrows', objectives: [{ type: 'waves', site: 'barrows', count: 4 }, { type: 'loot', site: 'barrows', count: 1 }] }],
    rewards: { share: 0.25, lv: 2, gold: 40 },
  },
  vale_captains_ledger: {                            // Osric's bounty (world doc §5, v1.6): the bright-eyed ones lead every fifth wave
    kind: 'bounty', giver: 'osric_hale', region: 'vale', level: [2, 8],
    steps: [{ id: 'barrows', objectives: [{ type: 'elites', site: 'barrows', count: 3 }] }],
    rewards: { share: 0.3, lv: 3, gold: 60 },
  },
  vale_first_page: {                                 // Sister Ilse's errand (world doc §7, v1.6): bring her the first line of the Vale's Chronicle
    kind: 'errand', giver: 'sister_ilse', region: 'vale', level: [1, 8],
    steps: [{ id: 'barrows', objectives: [{ type: 'fragment', site: 'barrows', count: 1 }] }],
    rewards: { share: 0.2, lv: 1, gold: 25 },
  },
  vale_hens_under_the_hill: {                        // Hedda's errand (world doc §5, v1.19): the goblins have her hens; tell their chief
    kind: 'errand', giver: 'hedda', region: 'vale', level: [2, 30],   // (open past 8: a Vale hero who finished Act I still finds it)
    steps: [{ id: 'warren', objectives: [{ type: 'boss', site: 'scrag_warren', boss: 'goblin_chief', count: 1 }] }],
    rewards: { share: 0.3, lv: 4, gold: 70 },
  },
  // Act I, Smoke over the Vale (world doc §6, v1.7; docs/m5-plan.md §4): the Tithe Mill for Maudry, then
  // Wickham Keep and Captain Garrow for Osric, then the Sunken Chapel, where the Robed Stranger dies
  // with an ember-shard in his fist, which goes to Sister Ilse.
  ch1_smoke_over_the_vale: {
    kind: 'chapter', giver: 'maudry_fenn', turnin: 'osric_hale', region: 'vale', level: [1, 30],
    steps: [{ id: 'mill', objectives: [{ type: 'waves', site: 'tithe_mill', count: 4 }] }],
    rewards: { share: 0.35, lv: 2, gold: 60 }, reveal: ['wickham_keep'],
  },
  ch1_the_diggers: {
    kind: 'chapter', giver: 'osric_hale', region: 'vale', level: [3, 30], after: ['ch1_smoke_over_the_vale'],
    steps: [{ id: 'keep', objectives: [{ type: 'reach', site: 'wickham_keep', count: 2 }] },
      { id: 'captain', objectives: [{ type: 'boss', site: 'wickham_keep', boss: 'redhand_captain', count: 1 }] }],
    rewards: { share: 0.45, lv: 4, gold: 150 },
  },
  ch1_ember_in_the_fist: {
    kind: 'chapter', giver: 'osric_hale', turnin: 'sister_ilse', region: 'vale', level: [5, 30], after: ['ch1_the_diggers'],
    steps: [{ id: 'chapel', objectives: [{ type: 'boss', site: 'sunken_chapel', boss: 'robed_stranger', count: 1 }] }],
    rewards: { share: 0.55, lv: 6, gold: 200 },
  },
  // Brannoc's chain, Chains of the Redhand (world doc §5, v1.7; docs/m5-plan.md §5): the debts he owes the
  // Company, the Paymaster's box, and a last stand with the legion that never deserted anything
  brannoc_old_debts: {
    kind: 'companion', giver: 'brannoc', companion: 'brannoc', region: 'vale', level: [1, 30],
    steps: [{ id: 'keep', objectives: [{ type: 'elites', site: 'wickham_keep', count: 3 }] }],
    rewards: { share: 0.35, lv: 4, gold: 90 },
  },
  brannoc_paymasters_box: {
    kind: 'companion', giver: 'brannoc', companion: 'brannoc', region: 'vale', level: [1, 30], after: ['brannoc_old_debts'],
    steps: [{ id: 'mill', objectives: [{ type: 'loot', site: 'tithe_mill', count: 2 }] }],
    rewards: { share: 0.3, lv: 5, gold: 120 },
  },
  brannoc_standing_down: {
    kind: 'companion', giver: 'brannoc', companion: 'brannoc', region: 'vale', level: [1, 30], after: ['brannoc_paymasters_box'],
    steps: [{ id: 'barrows', objectives: [{ type: 'waves', site: 'barrows', count: 5, hall: true, floor: 2 }] }],
    rewards: { share: 0.45, lv: 6, gold: 100, item: 'broken_chain' },
  },
  // the class trials (world doc §5 v1.7; docs/m5-plan.md §6): at level 6, from Thornwick's people
  trial_hold_the_keep_gate: {
    kind: 'trial', giver: 'osric_hale', trial: 'fighter', region: 'vale', level: [1, 30],
    steps: [{ id: 'keep', objectives: [{ type: 'waves', site: 'wickham_keep', count: 8 }] }],
    rewards: { share: 0.3, lv: 6, gold: 60 },
  },
  trial_quiet_feet: {
    kind: 'trial', giver: 'nell_tolley', trial: 'rogue', region: 'vale', level: [1, 30],
    steps: [{ id: 'keep', objectives: [{ type: 'elites', site: 'wickham_keep', count: 3 }] }],
    rewards: { share: 0.3, lv: 6, gold: 60 },
  },
  trial_cold_weather: {
    kind: 'trial', giver: 'hedda', trial: 'mage', region: 'vale', level: [1, 30],
    steps: [{ id: 'chapel', objectives: [{ type: 'waves', site: 'sunken_chapel', count: 6 }] }],
    rewards: { share: 0.3, lv: 6, gold: 60 },
  },
  trial_old_roads: {                                 // (v1.19) Col teaches the hedge-callers' breath; the long way round runs past the Scrag
    kind: 'trial', giver: 'col', trial: 'shaman', region: 'vale', level: [1, 30],
    steps: [{ id: 'warren', objectives: [{ type: 'waves', site: 'scrag_warren', count: 6 }] }],
    rewards: { share: 0.3, lv: 6, gold: 60 },
  },
  trial_last_rites: {
    kind: 'trial', giver: 'sister_ilse', trial: 'cleric', region: 'vale', level: [1, 30],
    steps: [{ id: 'barrows', objectives: [{ type: 'waves', site: 'barrows', count: 5, hall: true, floor: 2 }] }],
    rewards: { share: 0.3, lv: 6, gold: 60 },
  },
};
export const TRIAL_LEVEL = 6;
const BENCH_XP = 0.5;                                // the bench earns half, as in battle
const target = (o) => o.count;

/** @param {{ state: any, bus: any, getWorld: () => any, extraDef?: (id: string) => QuestDef | null, reveal?: (site: string) => void, grant?: (item: string) => void, drop?: (src: string) => void }} o
 * grant: an heirloom reward; drop: a chapter's guaranteed Fine (loot.js DROP.chapter) */
export function createQuests({ state, bus, getWorld, extraDef = () => null, reveal = () => {}, grant = () => {}, drop = () => {} }) {
  if (!state.quests) state.quests = {};
  if (state.tracked === undefined) state.tracked = null;
  /** @param {string} id @returns {QuestDef | null} */
  const defOf = (id) => (Object.prototype.hasOwnProperty.call(QUESTS, id) ? QUESTS[id] : extraDef(id));
  const inst = (id) => state.quests[id] || null;
  const withUs = (id) => [...state.party, ...(state.bench || [])].some((m) => m.id === id);
  const trialOpen = (cls) => !(state.trials || {})[cls] && [...state.party, ...(state.bench || [])].some((m) => m.cls === cls && m.level >= TRIAL_LEVEL);
  const gates = (id) => { const d = QUESTS[id], lv = state.party[0].level; return !!d && lv >= d.level[0] && lv <= d.level[1] && (d.after || []).every((a) => inst(a) && inst(a).st === QS.DONE) && (!d.companion || withUs(d.companion)) && (!d.trial || trialOpen(d.trial)); };
  const takerOf = (d) => d.turnin || d.giver;         // who hands out the reward
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
        if (q.step + 1 < d.steps.length) { q.step += 1; q.n = d.steps[q.step].objectives.map(() => 0); settle(id); }
        else q.st = QS.READY;
      }
      changed(id);
    }
  }
  bus.on('wave', (e) => { if (e.cleared) count((o, n) => (o.type === 'waves' && siteHere(o.site) && (!o.hall || hallHere(e.room)) && (!o.floor || floorHere() >= o.floor) ? n + 1 : n)); });
  bus.on('looted', (e) => { if (e.kind === 'chest') count((o, n) => (o.type === 'loot' && siteHere(o.site) ? n + 1 : n)); });
  bus.on('slain', (e) => { if (e.elite) count((o, n) => (o.type === 'elites' && siteHere(o.site) ? n + 1 : n)); });
  bus.on('fragmentFound', () => count((o, n) => (o.type === 'fragment' && siteHere(o.site) ? Math.max(n + 1, heldAt(o.site)) : n)));
  bus.on('bossDown', (e) => count((o, n) => (o.type === 'boss' && o.boss === e.id && siteHere(o.site) ? n + 1 : n)));
  // a floor change inside a site (arriving from the overland or loading a save carry a scene, and don't count)
  bus.on('levelChanged', (e) => { if (!('scene' in e)) count((o, n) => (o.type === 'reach' && siteHere(o.site) ? Math.max(n, floorHere()) : n)); });

  function pay(id) {
    const r = /** @type {QuestDef} */ (defOf(id)).rewards, lv = (m) => bus.emit('levelUp', { id: m.id, name: m.name, level: m.level });
    const xpOf = (m) => (r.xp !== undefined ? r.xp : questXp(r, m.level)), heroXp = xpOf(state.party[0]);   // (a board job's is a number: board.js)
    for (const m of state.party) if (!m.fallen) gainXp(m, xpOf(m), lv);
    for (const m of state.bench || []) gainXp(m, Math.round(xpOf(m) * BENCH_XP), lv);
    state.counters.gold = (state.counters.gold || 0) + r.gold;
    if (r.item) grant(r.item);
    if (/** @type {QuestDef} */ (defOf(id)).kind === 'chapter') drop('chapter');                 // (GDD §8: a chapter pays a Fine too)
    bus.emit('questReward', { id, xp: heroXp, gold: r.gold, ...(r.item ? { item: r.item } : {}) });
    bus.emit('countersChanged', { ...state.counters }); bus.emit('partyChanged', state.party);
  }
  const nextTracked = () => Object.keys(state.quests).find((k) => state.quests[k].st === QS.ACTIVE || state.quests[k].st === QS.READY) || null;

  /** take a quest (the caller has checked where and whether) @param {string} id */
  function begin(id) {
    const d = defOf(id); if (!d || inst(id)) return;
    state.quests[id] = { st: QS.ACTIVE, step: 0, n: d.steps[0].objectives.map(() => 0) };
    if (!state.tracked) state.tracked = id;
    settle(id);
    changed(id);
    bus.emit('questAccepted', { id });                  // (the dialogue window says so where you took it)
  }
  // what was done before the quest was taken counts, where it can't be done again: a story boss who already fell
  // (he won't come back to be counted), and a Chronicle fragment already found at the site (it's found once; Ilse's
  // errand asked for one from the barrows, and a hero who'd opened the first floor's chest first had none left to find)
  const heldAt = (site) => (state.fragments || []).filter((f) => FRAGMENTS[f] && FRAGMENTS[f].site === site).length;
  function settle(id) {
    const q = state.quests[id], d = defOf(id); if (!q || !d) return;
    for (;;) {
      const objs = d.steps[q.step].objectives;
      objs.forEach((o, i) => {
        if (o.type === 'boss' && (state.bosses || {})[o.boss]) q.n[i] = target(o);
        if (o.type === 'fragment') q.n[i] = Math.max(q.n[i], Math.min(target(o), heldAt(o.site)));
      });
      if (!objs.every((o, i) => q.n[i] >= target(o))) return;
      if (q.step + 1 < d.steps.length) { q.step += 1; q.n = d.steps[q.step].objectives.map(() => 0); } else { q.st = QS.READY; return; }
    }
  }
  /** hand one in: done, paid once @param {string} id */
  function finish(id) {
    if (status(id) !== QS.READY) return;
    state.quests[id].st = QS.DONE;
    pay(id);
    for (const s of /** @type {QuestDef} */ (defOf(id)).reveal || []) reveal(s);
    const cls = /** @type {QuestDef} */ (defOf(id)).trial;
    if (cls && !(state.trials ||= {})[cls]) { state.trials[cls] = 1; bus.emit('trialDone', { cls, id }); bus.emit('partyChanged', state.party); }
    if (state.tracked === id) state.tracked = nextTracked();
    changed(id);
  }
  /** an Ink `# quest: <verb> <id>` tag, from a conversation with `talking` (null: none open) */
  function effect(talking, args) {
    const [verb, id] = Array.isArray(args) ? args : [], d = QUESTS[id];
    if (!talking || !d) return;
    if (verb === 'accept' && d.giver === talking && status(id) === QS.AVAILABLE) begin(id);      // only its giver, in conversation
    else if (verb === 'turnin' && takerOf(d) === talking) finish(id);                             // only whoever takes it in
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
    for (const [id, d] of Object.entries(QUESTS)) if (d.giver === npc || takerOf(d) === npc) v['q_' + id] = status(id);
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
      if (d.companion && withUs(d.companion)) return rows;           // he's with you: hand it in from his card
      if (world.kind === 'town') {
        if (d.kind === 'board') base = pick('square');                 // the board is in the tavern, off the square (none once you're there)
        else { const n = (world.npcs || []).find((x) => x.id === takerOf(d)); if (n) base = { tx: Math.floor(n.x), ty: Math.floor(n.y), near: 1, then: { type: 'talk', npc: n.id }, sub: 'in town', steps: 0 }; }
      } else base = world.kind === 'dungeon' ? pick('exit') : pick('town');
    } else {
      const objs = d.steps[q.step].objectives, owe = objs.filter((o, i) => q.n[i] < o.count);
      const inSite = owe.some((o) => siteHere(o.site));
      if (battle && inSite && owe.some((o) => (o.type === 'waves' && (!o.hall || hallHere(battle.room)) && (!o.floor || floorHere() >= o.floor)) || o.type === 'elites')) return rows;
      const there = owe.find((o) => siteHere(o.site)) || owe[0], site = there ? there.site : null;
      if (world.kind === 'town') base = pick('road-out');
      else if (world.kind !== 'dungeon') base = site ? pick('site:' + site) : null;           // the site it wants (sites.js)
      else if (!inSite) base = pick('exit');                                                  // the wrong dungeon: out first
      else {
        const o = there, down = pick('stairs-down'), last = pick('last-hall');                // (a site's last floor: its hall, no stairs)
        if (!o) base = null;
        else if (o.type === 'reach' || (o.floor && floorHere() < o.floor)) base = down || pick('next-room');
        else if (o.hall) base = down ? { ...down, then: null, label: 'The stairs-down hall', sub: down.sub.replace(/^to depth \d+ · /, '') } : last || pick('next-room');
        else if (o.type === 'loot' || o.type === 'fragment') base = pick('loot', 'next-room', 'farm-room');
        else base = pick('next-room', 'farm-room', 'loot');
      }
    }
    if (!base) return rows;
    return [{ ...base, id: 'quest', icon: 'quest', quest: id, label: base.label || '', off: false, journey: 'quest' }, ...rows];   // it walks on through each scene change (core.js)
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
  /** who has something for you, by NPC id (the marker over their head, renderer.js): 'ready' for a quest to
   * hand in to them, else 'new' for one they'd give you now. The same gates as their conversation's choices
   * (status: level, the quests before it, a companion with you, a trial still to do); board jobs are the
   * board's. @returns {Record<string, 'new'|'ready'>} */
  function marks() {
    const out = {};
    for (const id of Object.keys(QUESTS)) {
      const d = QUESTS[id], st = status(id);
      if (st === QS.READY) out[takerOf(d)] = 'ready';
      else if (st === QS.AVAILABLE && !out[d.giver]) out[d.giver] = 'new';
    }
    return out;
  }
  /** after a load (lore restored after quests: core.js): settle every active quest against what's held now */
  function settleAll() { for (const id of Object.keys(state.quests)) if (state.quests[id].st === QS.ACTIVE) { settle(id); changed(id); } }
  return { command, effect, begin, finish, varsFor, compass, snapshot, restore, settleAll, status, marks, def: defOf };
}
