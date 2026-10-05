// @ts-check
// heroes.js — the M3 hero commands (GDD §3.6, §4.1, §5.1, §6.1; development plan §2.3–§2.4,
// §2.10). Headless: core.js hands it every command first, like loot.js.
//
//   createHero  { cls, look, origin, name }   once per game, before anything else counts
//   spendPoint  { id, attr }                  one attribute point
//   setAutoAttrs{ id, on }                    Auto spends pending points on the class build
//   rankSkill   { id, skill }                 one skill point into an unlocked ability
//   setAutocast { id, skill, on } · setPriority { id, order } · setStance { id, stance }
//   respec      { id }            town        attributes back to points (first free, then 20 g × level)
//   resurrect   { id }            town        the temple (25 g × level; free once a day to level 5)
//   rest        {}                town        the inn: full HP / MP, Weakened lifted (5 g × hero level)
//   hire        { idx }           town        a tavern sellsword → the party, or the bench when full; pays the Guild's fee
//   askAround   {}                town        today's roster again, new faces (10 g × level, doubling each time that day)
//   retrain     { id, idx }       town        one of a sellsword's perks for another of its family (60 g × level × (retrains + 1))
//   payWages    {}                town        settle what the sellswords are owed (their perks come back)
//   dismiss     { id }            town        a companion → the bench
//   swap        { slot, id }      town        a bench member into companion slot 1 or 2
//   release     { id }            town        a bench member leaves for good (not a found companion): "Dismiss for good".
//                                             No more wage, and what's owed is written off; their gear above Common
//                                             (Fine, Rare, heirloom) goes into the bag, and it's refused if it won't fit
// Found companions (FOUND: Brannoc, M5) join in conversation, not at the tavern: the Ink tag
// `# companion: join` from his own talk (npcs.js), once the boss who held him has fallen. He goes to
// the party, or the bench when it's full; he can be benched, never released.
//
// The Lantern Guild's sellswords (GDD §6.2, companions.js) are paid at dawn, wherever the company is:
// party first, then the bench at half, each paid in full or not at all. One who isn't paid is owed
// (its perks go dark until it is); paid in the party it grows loyal, and loyalty shows a Lantern's or
// Beacon's hidden perk (3) and makes it Sworn (5). Events: 'wages' { day, paid, total, unpaid: [names] },
// 'perkRevealed' { id, name, perk }, 'sworn' { id, name }.
//
// Every command is validated (ownership, place, class, cost, points); an invalid one does
// nothing but emit 'refused' { reason } for the UI. Nothing here grants XP, items or gold.

import { CLASSES, LOOKS, ORIGINS, ORIGIN_EDGE, MAX_COMPANIONS, makeHero, makeMember, cleanName, statsFor, tavernRoster, hireLevel, distinctNames, freeName } from './party.js';
import { ATTRS, pendingPoints, autoAllocate } from './attributes.js';
import { skillsOf, skillDef, unlocked, rankOf, pendingSkillPoints, MAX_RANK, STANCES } from './skills.js';
import { bagStacks, BAG_SIZE } from './loot.js';
import { makeItem } from './items.js';
import { hired, feeOf, wageOf, loyaltyOf, retrainPerk, priceMod, PERKS, REVEAL_AT, SWORN_AT, ASK_COST, RETRAIN_COST, FOUND_PERKS } from './companions.js';

export const BENCH_MAX = 6;
// the found companions (world doc §5): who they are, and whose fall frees them
export const FOUND = {
  brannoc: { name: 'Brannoc', cls: 'fighter', actor: 'hero_brannoc', trait: ['Redhand deserter', 'found in Wickham Keep'], freedBy: 'redhand_captain' },
  wren: { name: 'Wren', cls: 'rogue', actor: 'hero_wren', trait: ['Saltmere smuggler', 'found in the Boat Hall'], freedBy: 'toadking' },   // (M8, world doc v1.29 §5)
};
export const DAY_S = 3600;              // an in-game day: an hour of play (2.5 min = 1 h); 1440 (24 min) before save v15
export const WEAK_S = 600;              // Weakened lasts 10 minutes of play
export const RES_COST = 25, RESPEC_COST = 20, REST_COST = 5, FREE_RES_LEVEL = 5;

/** @param {{ state: any, bus: any, getWorld: () => any, seed: number }} deps */
export function createHeroes({ state, bus, getWorld, seed }) {
  if (!state.bench) state.bench = [];
  if (!state.temple) state.temple = { freeDay: -1 };
  if (!state.tavern) state.tavern = { day: 0, ask: 0 };     // how often you asked around, and on which day
  if (state.wageDay === undefined) state.wageDay = 0;       // the last dawn the wages were settled
  if (state.innDay === undefined) state.innDay = -1e9;      // the last day the company slept at an inn (a Drinker's)
  const C = state.counters;
  // a service the town you're in has (M8: a waystation such as Saltmere has only its tavern and temple, outdoor.js);
  // null if it's here, else the refusal: where to go instead
  const NOUN = { temple: 'temple', inn: 'inn', tavern: 'tavern' };
  const lacks = (kind, away) => { const w = getWorld(); if (w.kind !== 'town') return away; return (w.services || []).some((v) => v.kind === kind) ? null : `${w.name} has no ${NOUN[kind]}`; };
  const find = (id) => state.party.find((m) => m.id === id) || state.bench.find((m) => m.id === id) || null;
  const refuse = (reason) => { bus.emit('refused', { reason }); return true; };
  const changed = () => bus.emit('partyChanged', state.party);
  const pay = (n) => { if ((C.gold || 0) < n) return false; C.gold -= n; bus.emit('countersChanged', { ...C }); return true; };
  const day = () => Math.floor(state.t / DAY_S);
  const clampPools = (m) => { const s = statsFor(m); m.hp = Math.min(m.hp, s.maxHp); if (m.mp !== undefined) m.mp = Math.min(m.mp, s.maxMp); };

  /** what the temple asks to raise m right now @param {any} m */
  function resurrectCost(m) {
    const free = state.party[0].level <= FREE_RES_LEVEL && state.temple.freeDay !== day();
    return free ? 0 : Math.round(RES_COST * m.level * priceMod(state.party));
  }
  /** @param {any} m */
  const respecCost = (m) => ((m.respecs || 0) === 0 ? 0 : RESPEC_COST * m.level);
  const restCost = () => Math.round(REST_COST * state.party[0].level * priceMod(state.party));
  const extraHirelings = () => (ORIGIN_EDGE[state.party[0].origin]?.kind === 'tavernHirelings' ? ORIGIN_EDGE[state.party[0].origin].value : 0);
  const asked = () => (state.tavern.day === day() ? state.tavern.ask : 0);
  const roster = () => distinctNames(tavernRoster(seed, getWorld().region, day(), state.party[0].level, extraHirelings(), asked()), [...state.party, ...state.bench]);   // (no two of a company share a name)
  /** asking around again today @returns {number} */
  const askCost = () => { let c = ASK_COST * state.party[0].level; for (let i = 0; i < asked(); i++) c *= 2; return c; };
  /** @param {any} m */
  const retrainCost = (m) => RETRAIN_COST * m.level * ((m.retrains || 0) + 1);
  /** what the company owes, all told */
  const owed = () => [...state.party, ...state.bench].reduce((n, m) => n + (m.owed || 0), 0);

  // loyalty: a hidden perk shows at REVEAL_AT, and SWORN_AT is Sworn (told once each)
  function bonded(m, n) {
    const before = loyaltyOf(m); m.bond = Math.max(0, (m.bond || 0) + n);
    const now = loyaltyOf(m);
    if (now >= REVEAL_AT && m.hidden) { const perk = m.hidden; m.perks = [...m.perks, perk]; m.hidden = null; bus.emit('perkRevealed', { id: m.id, name: m.name, perk }); }
    if (now >= SWORN_AT && before < SWORN_AT) bus.emit('sworn', { id: m.id, name: m.name });
  }
  // the dawn wage: the party first, then the bench at half; each paid in full or owed. (GDD §12) While you're away
  // and the company is in town, it's on retainer: the party is paid the bench's half too.
  function payDawn(d) {
    const C2 = state.counters; let paid = 0, total = 0; const unpaid = [], retainer = !!state.away && getWorld().kind === 'town';
    for (const [list, benched] of [[state.party, retainer], [state.bench, true]]) for (const m of list) {
      if (!hired(m)) continue;
      const w = wageOf(m, benched), due = w + (m.owed || 0); total += due;
      if ((C2.gold || 0) >= due) { C2.gold -= due; paid += due; m.owed = 0; if (!benched && !m.fallen) bonded(m, 1); }
      else { m.owed = (m.owed || 0) + w; unpaid.push(m.name); bonded(m, -2); }
    }
    if (total) { bus.emit('wages', { day: d, paid, total, unpaid }); bus.emit('countersChanged', { ...C2 }); changed(); }
  }
  // a boss the party put down together: loyalty for every sellsword who stood there
  bus.on('bossDown', () => { for (const m of state.party) if (hired(m) && !m.fallen && !m.down) bonded(m, 1); });

  function raise(m, frac) {
    m.fallen = false; m.down = false;
    const s = statsFor(m); m.hp = Math.max(1, Math.round(s.maxHp * frac)); m.mp = s.maxMp;
  }

  // Weakened wears off after WEAK_S of play (core ticks this)
  function tick() {
    for (let d = state.wageDay + 1; d <= day(); d++) payDawn(d);
    state.wageDay = Math.max(state.wageDay, day());
    let any = false;
    for (const m of state.party) if (m.weakUntil > 0 && state.t >= m.weakUntil) { m.weakUntil = 0; clampPools(m); any = true; }
    if (any) { bus.emit('weakened', { on: false }); changed(); }
  }

  /** @param {any} cmd @returns {boolean} true when the command was ours */
  function command(cmd) {
    switch (cmd.type) {
      case 'createHero': {
        if (state.created) return refuse('This game already has its hero');
        const cls = cmd.cls, look = cmd.look, origin = cmd.origin, name = cleanName(cmd.name);
        if (!CLASSES[cls]) return refuse('Unknown class');
        if (!LOOKS[cls].includes(look)) return refuse('That look is not for this class');
        if (!ORIGINS.includes(origin)) return refuse('Unknown origin');
        if (!name) return refuse('Your hero needs a name');
        state.party[0] = makeHero({ cls, look, origin, name });
        state.created = true;
        // every company sets out with one Homeward Scroll (GDD §8 v1.30; the owner, 2026-10-04): a sim rule, once
        state.counters.uidN = (state.counters.uidN || 0) + 1; state.bag.push(makeItem('homeward', 1, 'common', { uid: 'i' + state.counters.uidN }));
        bus.emit('heroCreated', { cls, look, origin, name }); changed(); return true;
      }
      case 'spendPoint': {
        const m = find(cmd.id);
        if (!m || !ATTRS.includes(cmd.attr)) return true;
        if (pendingPoints(m) < 1) return refuse('No points to spend');
        m.attrs = { might: 0, grit: 0, finesse: 0, focus: 0, ...(m.attrs || {}) };
        const before = statsFor(m).maxHp; m.attrs[cmd.attr] += 1;
        if (!m.fallen) m.hp += statsFor(m).maxHp - before;             // new max HP arrives filled, as on a level-up
        changed(); return true;
      }
      case 'setAutoAttrs': {
        const m = find(cmd.id); if (!m) return true;
        m.autoAttrs = !!cmd.on;
        if (m.autoAttrs) { const before = statsFor(m).maxHp; autoAllocate(m); if (!m.fallen) m.hp += statsFor(m).maxHp - before; }
        changed(); return true;
      }
      case 'respec': {
        const m = find(cmd.id); if (!m) return true;
        { const no = lacks('temple', 'Respec at a town temple'); if (no) return refuse(no); }
        if (!pay(respecCost(m))) return refuse('Not enough gold');
        m.attrs = { might: 0, grit: 0, finesse: 0, focus: 0 }; m.respecs = (m.respecs || 0) + 1; m.autoAttrs = false;
        clampPools(m); bus.emit('respec', { id: m.id }); changed(); return true;
      }
      case 'rankSkill': {
        const m = find(cmd.id), s = m && skillDef(m.cls, cmd.skill);
        if (!m || !s) return true;
        if (!unlocked(m, s, state.trials)) return refuse(m.level < s.lv ? `${s.name} unlocks at level ${s.lv}` : `${s.name} comes with the ${CLASSES[m.cls].label.toLowerCase()}'s trial`);
        if (rankOf(m, s.id) >= MAX_RANK) return refuse(`${s.name} is at its highest rank`);
        if (pendingSkillPoints(m) < 1) return refuse('No skill points to spend');
        m.skills = { ...(m.skills || {}), [s.id]: rankOf(m, s.id) + 1 };
        changed(); return true;
      }
      case 'setAutocast': {
        const m = find(cmd.id), s = m && skillDef(m.cls, cmd.skill); if (!s) return true;
        const off = (m.off || []).filter((id) => id !== s.id);
        if (!cmd.on) off.push(s.id);
        m.off = off; changed(); return true;
      }
      case 'setPriority': {
        const m = find(cmd.id); if (!m || !Array.isArray(cmd.order)) return true;
        const ids = skillsOf(m.cls).map((s) => s.id);
        if (cmd.order.length !== ids.length || !ids.every((id) => cmd.order.includes(id))) return true;
        m.prio = ids.map((_, i) => String(cmd.order[i])); changed(); return true;
      }
      case 'setStance': {
        const m = find(cmd.id); if (!m || !STANCES.includes(cmd.stance)) return true;
        m.stance = cmd.stance;
        changed(); return true;
      }
      case 'resurrect': {
        const m = find(cmd.id); if (!m || !m.fallen) return true;
        { const no = lacks('temple', 'Only a temple can raise the Fallen here'); if (no) return refuse(no); }
        const cost = resurrectCost(m);
        if (!pay(cost)) return refuse('Not enough gold');
        if (!cost) state.temple.freeDay = day();
        raise(m, 1);
        bus.emit('resurrected', { id: m.id, name: m.name, how: 'temple', cost }); changed(); return true;
      }
      case 'rest': {
        { const no = lacks('inn', 'Rest at a town inn'); if (no) return refuse(no); }
        if (!pay(restCost())) return refuse('Not enough gold');
        for (const m of state.party) if (!m.fallen) { m.weakUntil = 0; m.down = false; const s = statsFor(m); m.hp = s.maxHp; m.mp = s.maxMp; }
        state.innDay = day();
        bus.emit('rested', {}); changed(); return true;
      }
      case 'hire': {                                      // today's roster at this town's tavern
        if (lacks('tavern', 'x')) return true;
        const c = roster()[cmd.idx];
        if (!c || find(c.id)) return true;
        if (state.party.length > MAX_COMPANIONS && state.bench.length >= BENCH_MAX) return refuse('The party and the bench are full');
        if (!pay(feeOf(c))) return refuse(`The Guild wants ${feeOf(c)} gold for ${c.name}`);
        if (state.party.length <= MAX_COMPANIONS) state.party.push(c);
        else { state.bench.push(c); bus.emit('benched', { id: c.id, name: c.name }); }
        bus.emit('hired', { id: c.id, name: c.name, rank: c.rank, fee: feeOf(c) });
        changed(); return true;
      }
      case 'askAround': {                                 // new faces at the tavern, for a price that doubles each time today
        if (lacks('tavern', 'x')) return true;
        if (!pay(askCost())) return refuse('Not enough gold');
        state.tavern = { day: day(), ask: asked() + 1 };
        bus.emit('rosterChanged', { ask: state.tavern.ask }); return true;
      }
      case 'retrain': {                                   // one perk for another of its family
        const m = find(cmd.id); if (!m || !hired(m) || !Array.isArray(m.perks) || !Number.isInteger(cmd.idx) || cmd.idx < 0 || cmd.idx >= m.perks.length) return true;
        { const no = lacks('tavern', 'Retrain in a town'); if (no) return refuse(no); }
        if (m.exp) return refuse(`${m.name} is out on the road`);   // (expeditions.js)
        if (PERKS[m.perks[cmd.idx]]?.fam === 'quirk') return refuse(`${m.name} won't be trained out of that`);
        const next = retrainPerk(seed, m, cmd.idx);
        if (!next) return refuse('There is nothing else of that kind to learn');
        if (!pay(retrainCost(m))) return refuse('Not enough gold');
        const was = m.perks[cmd.idx]; m.perks = m.perks.map((p, i) => (i === cmd.idx ? next : p)); m.retrains = (m.retrains || 0) + 1;
        bus.emit('retrained', { id: m.id, name: m.name, was, perk: next }); changed(); return true;
      }
      case 'payWages': {                                  // settle what the sellswords are owed, each in full
        { const no = lacks('tavern', 'Settle wages at a town tavern'); if (no) return refuse(no); }
        let any = false;
        for (const m of [...state.party, ...state.bench]) if (m.owed > 0 && pay(m.owed)) { m.owed = 0; any = true; }
        if (!any) return refuse(owed() ? 'Not enough gold' : 'Nobody is owed anything');
        bus.emit('wagesSettled', {}); changed(); return true;
      }
      case 'dismiss': {                                   // a companion goes to the bench at the inn
        const i = state.party.findIndex((m) => m.id === cmd.id && !m.main);
        if (i < 1) return true;
        { const no = lacks('inn', 'Companions wait at a town inn'); if (no) return refuse(no); }
        if (state.bench.length >= BENCH_MAX) return refuse('The bench is full');
        const [m] = state.party.splice(i, 1); m.down = false; state.bench.push(m);
        changed(); return true;
      }
      case 'swap': {                                      // bench → companion slot (1 or 2); the one there takes its place
        const slot = cmd.slot, j = state.bench.findIndex((m) => m.id === cmd.id);
        if ((slot !== 1 && slot !== 2) || j < 0) return true;
        { const no = lacks('inn', 'Swap companions in a town'); if (no) return refuse(no); }
        const incoming = state.bench[j];
        if (incoming.exp) return refuse(`${incoming.name} is out on the road`);   // (expeditions.js: back when the job's done)
        if (slot < state.party.length) { const out = state.party[slot]; out.down = false; state.party[slot] = incoming; state.bench[j] = out; }
        else if (state.party.length <= MAX_COMPANIONS) { state.party.push(incoming); state.bench.splice(j, 1); }
        else return true;
        changed(); return true;
      }
      case 'release': {
        const j = state.bench.findIndex((m) => m.id === cmd.id);
        if (j < 0) return true;
        if (FOUND[cmd.id]) return refuse(`${state.bench[j].name} isn't going anywhere`);
        if (state.bench[j].exp) return refuse(`${state.bench[j].name} is out on the road`);
        { const no = lacks('inn', 'Only at a town inn'); if (no) return refuse(no); }
        const m = state.bench[j], keep = Object.values(m.gear || {}).filter((it) => it && it.r !== 'common');
        if (bagStacks(state.bag.concat(keep)).length > BAG_SIZE) return refuse(`No room in the bag for ${m.name}'s gear (${keep.length})`);
        state.bench.splice(j, 1); m.gear = {}; m.owed = 0;
        for (const it of keep) state.bag.push(it);
        bus.emit('released', { id: m.id, name: m.name, items: keep.map((it) => it.uid) });
        if (keep.length) bus.emit('gearChanged', { member: null });
        changed(); return true;
      }
    }
    return false;
  }
  /** a found companion joins (npcs.js calls this for `# companion: join` from his own talk): once,
   * after the boss who held him fell; the party if there's room, else the bench @param {string} id */
  function join(id) {
    const F = Object.prototype.hasOwnProperty.call(FOUND, id) ? FOUND[id] : null;
    if (!F || find(id) || !(state.bosses || {})[F.freedBy]) return;
    const m = { ...makeMember(id, F.name, F.cls, hireLevel(state.party[0].level), F.trait),   // months on a chain: half as seasoned as you (world doc §5 v1.12)
      actor: F.actor, rank: 'found', perks: [...(FOUND_PERKS[id] || [])], hidden: null, bond: 0, owed: 0 };
    // (no two of a company share a name: a hireling who took a found one's name before she was found takes another)
    const company = [...state.party, ...state.bench], taken = new Set(company.map((q) => q.name));
    for (const q of company) if (q.name === m.name && !q.main) { taken.delete(q.name); q.name = freeName(q.cls, q.name, new Set([...taken, m.name])); taken.add(q.name); }
    if (state.party.length <= MAX_COMPANIONS) state.party.push(m);
    else if (state.bench.length < BENCH_MAX) { state.bench.push(m); bus.emit('benched', { id: m.id, name: m.name }); }
    else { refuse('The party and the bench are full'); return; }
    bus.emit('companionJoined', { id, name: m.name }); changed();
  }
  /** is this found companion with you (party or bench)? @param {string} id */
  const joined = (id) => !!find(id);
  return { command, tick, resurrectCost, respecCost, restCost, roster, raise, join, joined, askCost, retrainCost, owed };
}
