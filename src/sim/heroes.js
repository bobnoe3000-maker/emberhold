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
//   hire        { idx }           town        a tavern sellsword → the party, or the bench when full
//   dismiss     { id }            town        a companion → the bench
//   swap        { slot, id }      town        a bench member into companion slot 1 or 2
//   release     { id }            town        a bench member leaves for good
//
// Every command is validated (ownership, place, class, cost, points); an invalid one does
// nothing but emit 'refused' { reason } for the UI. Nothing here grants XP, items or gold.

import { CLASSES, LOOKS, ORIGINS, ORIGIN_EDGE, MAX_COMPANIONS, makeHero, cleanName, statsFor, tavernRoster } from './party.js';
import { ATTRS, pendingPoints, autoAllocate } from './attributes.js';
import { skillsOf, skillDef, unlocked, rankOf, pendingSkillPoints, MAX_RANK, STANCES } from './skills.js';

export const BENCH_MAX = 6;
export const DAY_S = 1440;              // an in-game day: 24 minutes of play (1 min = 1 h)
export const WEAK_S = 600;              // Weakened lasts 10 minutes of play
export const RES_COST = 25, RESPEC_COST = 20, REST_COST = 5, FREE_RES_LEVEL = 5;

/** @param {{ state: any, bus: any, getWorld: () => any, seed: number }} deps */
export function createHeroes({ state, bus, getWorld, seed }) {
  if (!state.bench) state.bench = [];
  if (!state.temple) state.temple = { freeDay: -1 };
  const C = state.counters;
  const inTown = () => getWorld().kind === 'town';
  const find = (id) => state.party.find((m) => m.id === id) || state.bench.find((m) => m.id === id) || null;
  const refuse = (reason) => { bus.emit('refused', { reason }); return true; };
  const changed = () => bus.emit('partyChanged', state.party);
  const pay = (n) => { if ((C.gold || 0) < n) return false; C.gold -= n; bus.emit('countersChanged', { ...C }); return true; };
  const day = () => Math.floor(state.t / DAY_S);
  const clampPools = (m) => { const s = statsFor(m); m.hp = Math.min(m.hp, s.maxHp); if (m.mp !== undefined) m.mp = Math.min(m.mp, s.maxMp); };

  /** what the temple asks to raise m right now @param {any} m */
  function resurrectCost(m) {
    const free = state.party[0].level <= FREE_RES_LEVEL && state.temple.freeDay !== day();
    return free ? 0 : RES_COST * m.level;
  }
  /** @param {any} m */
  const respecCost = (m) => ((m.respecs || 0) === 0 ? 0 : RESPEC_COST * m.level);
  const restCost = () => REST_COST * state.party[0].level;
  const extraHirelings = () => (ORIGIN_EDGE[state.party[0].origin]?.kind === 'tavernHirelings' ? ORIGIN_EDGE[state.party[0].origin].value : 0);
  const roster = () => tavernRoster(seed, getWorld().region, 0, state.party[0].level, extraHirelings());

  function raise(m, frac) {
    m.fallen = false; m.down = false;
    const s = statsFor(m); m.hp = Math.max(1, Math.round(s.maxHp * frac)); m.mp = s.maxMp;
  }

  // Weakened wears off after WEAK_S of play (core ticks this)
  function tick() {
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
        if (!inTown()) return refuse('Respec at a town temple');
        if (!pay(respecCost(m))) return refuse('Not enough gold');
        m.attrs = { might: 0, grit: 0, finesse: 0, focus: 0 }; m.respecs = (m.respecs || 0) + 1; m.autoAttrs = false;
        clampPools(m); bus.emit('respec', { id: m.id }); changed(); return true;
      }
      case 'rankSkill': {
        const m = find(cmd.id), s = m && skillDef(m.cls, cmd.skill);
        if (!m || !s) return true;
        if (!unlocked(m, s)) return refuse(`${s.name} unlocks at level ${s.lv}`);
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
        if (!inTown()) return refuse('Only a temple can raise the Fallen here');
        const cost = resurrectCost(m);
        if (!pay(cost)) return refuse('Not enough gold');
        if (!cost) state.temple.freeDay = day();
        raise(m, 1);
        bus.emit('resurrected', { id: m.id, name: m.name, how: 'temple', cost }); changed(); return true;
      }
      case 'rest': {
        if (!inTown()) return refuse('Rest at a town inn');
        if (!pay(restCost())) return refuse('Not enough gold');
        for (const m of state.party) if (!m.fallen) { m.weakUntil = 0; m.down = false; const s = statsFor(m); m.hp = s.maxHp; m.mp = s.maxMp; }
        bus.emit('rested', {}); changed(); return true;
      }
      case 'hire': {                                      // today's roster at this town's tavern
        if (!inTown()) return true;
        const c = roster()[cmd.idx];
        if (!c || find(c.id)) return true;
        if (state.party.length <= MAX_COMPANIONS) state.party.push(c);
        else if (state.bench.length < BENCH_MAX) { state.bench.push(c); bus.emit('benched', { id: c.id, name: c.name }); }
        else return refuse('The party and the bench are full');
        changed(); return true;
      }
      case 'dismiss': {                                   // a companion goes to the bench at the inn
        const i = state.party.findIndex((m) => m.id === cmd.id && !m.main);
        if (i < 1) return true;
        if (!inTown()) return refuse('Companions wait at a town inn');
        if (state.bench.length >= BENCH_MAX) return refuse('The bench is full');
        const [m] = state.party.splice(i, 1); m.down = false; state.bench.push(m);
        changed(); return true;
      }
      case 'swap': {                                      // bench → companion slot (1 or 2); the one there takes its place
        const slot = cmd.slot, j = state.bench.findIndex((m) => m.id === cmd.id);
        if ((slot !== 1 && slot !== 2) || j < 0) return true;
        if (!inTown()) return refuse('Swap companions in a town');
        const incoming = state.bench[j];
        if (slot < state.party.length) { const out = state.party[slot]; out.down = false; state.party[slot] = incoming; state.bench[j] = out; }
        else if (state.party.length <= MAX_COMPANIONS) { state.party.push(incoming); state.bench.splice(j, 1); }
        else return true;
        changed(); return true;
      }
      case 'release': {
        const j = state.bench.findIndex((m) => m.id === cmd.id);
        if (j < 0) return true;
        if (!inTown()) return refuse('Only at a town inn');
        state.bench.splice(j, 1); changed(); return true;
      }
    }
    return false;
  }
  return { command, tick, resurrectCost, respecCost, restCost, roster, raise };
}
