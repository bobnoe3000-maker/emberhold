// @ts-check
// expeditions.js — the bench's road work (GDD §6.3 v1.33; world doc v1.24 §4; the owner, 2026-10-04: "let me send my
// benched companions on timed adventures to level up and bring some gold and possibly one looted item back"). At a
// town's inn you send one of the companions waiting on the bench out on a job the Lantern Guild has going: a short one,
// a day's or a long one (EXPEDITIONS). They're gone until it's done (sim time: it runs while you play, and through the
// time away, ui/away.js); then they come back on their own, wherever you are, with:
//   - XP: a share of what active play earns in the same time (party.js xpRate at their level, a minute out: GDD v1.38;
//     it was a share of their next level, which outran active play once levels grew 15 % each), less the longer the job;
//   - gold: GOLD × their level a minute out;
//   - maybe one item: at their level, for their class, on its own stream (the room drops' counter doesn't move), Fine
//     or Rare now and then; into the bag, or salvaged for cinders if it's full.
// While out they can't be swapped in, released or retrained, and they draw the bench's half wage as before. One out at
// a time each; any number of the bench may be out. Nothing here is given: the rewards are this rule, which the server
// can replay. member.exp { kind, from, until } is durable (core.js MEMBER_KEYS; save v22).
// Commands: expeditionSend { id, kind } (in town, at an inn). Events: 'expeditionSent' { id, name, kind, until },
// 'expeditionBack' { id, name, kind, xp, gold, item?, salvaged?, levels }.

import { mulberry32, streamSeed } from './rng.js';
import { xpRate, gainXp } from './party.js';
import { rollItem } from './items.js';

// xp: the share of active play's XP a minute (the bench earns half a member's share in play; out on the road, less)
/** @type {Record<string, { secs: number, xp: number, item: number, fine: number, rare: number }>} */
export const EXPEDITIONS = {
  short: { secs: 15 * 60, xp: 0.3, item: 0.15, fine: 0.25, rare: 0.03 },
  day: { secs: 60 * 60, xp: 0.25, item: 0.4, fine: 0.3, rare: 0.05 },
  long: { secs: 4 * 60 * 60, xp: 0.2, item: 0.85, fine: 0.35, rare: 0.08 },
};
export const GOLD = 4;                    // gold a level a minute out
const STREAM_EXP = 0xe7d1;

/** what an expedition of this kind pays a member of this level (the item is rolled at its return) @param {string} kind @param {number} level */
export function expeditionPay(kind, level) {
  const E = EXPEDITIONS[kind];
  return { xp: Math.round(xpRate(level) * (E.secs / 60) * E.xp), gold: Math.round(GOLD * level * (E.secs / 60)) };
}
/** is this member out on the road? @param {any} m */
export const isOut = (m) => !!(m && m.exp);

/** @param {{ state: any, bus: any, getWorld: () => any, seed: number, give: (item: any, src: string) => number }} o */
export function createExpeditions({ state, bus, getWorld, seed, give }) {
  const refuse = (reason) => { bus.emit('refused', { reason }); return true; };
  const inn = () => { const w = getWorld(); return w.kind === 'town' && (w.services || []).some((s) => s.kind === 'inn'); };

  function command(cmd) {
    if (cmd.type !== 'expeditionSend') return false;
    const m = (state.bench || []).find((q) => q.id === cmd.id), E = EXPEDITIONS[cmd.kind];
    if (!inn()) return refuse('Send them from an inn in town');
    if (!m || !E) return true;
    if (m.exp) return refuse(`${m.name} is already out`);
    if (m.fallen) return refuse(`${m.name} is slain: raise them first`);
    m.exp = { kind: cmd.kind, from: state.t, until: state.t + E.secs };
    bus.emit('expeditionSent', { id: m.id, name: m.name, kind: cmd.kind, until: m.exp.until });
    bus.emit('partyChanged', state.party); return true;
  }

  // back: the pay, and the item on the expedition's own stream (the member and when they set out)
  function back(m) {
    const kind = m.exp.kind, E = EXPEDITIONS[kind], pay = expeditionPay(kind, m.level), from = Math.round(m.exp.from * 20);   // (the tick it set out)
    let idh = 7; for (let i = 0; i < m.id.length; i++) idh = Math.imul(idh ^ m.id.charCodeAt(i), 16777619);
    const rng = mulberry32(streamSeed((seed ^ Math.imul(from, 0x9e3779b1) ^ idh) >>> 0, STREAM_EXP));
    const before = m.level, out = { id: m.id, name: m.name, kind, xp: pay.xp, gold: pay.gold, item: null, salvaged: 0, levels: 0 };
    m.exp = null;
    gainXp(m, pay.xp, () => bus.emit('levelUp', { id: m.id, name: m.name, level: m.level }));
    out.levels = m.level - before;
    state.counters.gold = (state.counters.gold || 0) + pay.gold;
    if (rng() < E.item) {
      const q = rng(), rarity = q < E.rare ? 'rare' : q < E.rare + E.fine ? 'fine' : 'common';
      state.counters.uidN = (state.counters.uidN || 0) + 1;
      const item = rollItem(rng, { ilv: Math.max(1, m.level), rarity, classes: [m.cls], uid: 'i' + state.counters.uidN });
      out.item = item; out.salvaged = give(item, 'expedition');
    }
    bus.emit('expeditionBack', out);
    bus.emit('countersChanged', { ...state.counters }); bus.emit('partyChanged', state.party);
  }
  function tick() {
    for (const m of state.bench || []) if (m.exp && state.t >= m.exp.until) back(m);
  }
  return { command, tick };
}
