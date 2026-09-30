// loot.js — the party bag, gear drops and the equip commands (GDD §8). Headless: the sim
// calls drop() when a chest opens, a wave falls or an elite dies; the UI sends commands.
//
// Every roll draws from its own seeded stream (world seed × a running drop counter kept
// in the save), so a replay of the same inputs finds the same loot.
//
// Events: 'loot' { item, x, y, src, best, salvaged } — best = id of the member it upgrades
// most (the toast's "Equip on …"), salvaged = Embers when the bag was full.
//         'gearChanged' { member } — after any equip / unequip / salvage.
//         'gearRefused' { reason } — an equip the rules don't allow.

import { mulberry32, streamSeed } from './rng.js';
import { BASES, SALVAGE, rollItem, canWear, isTwoHanded, upgradeScore, makeHeirloom } from './items.js';
import { statsFor } from './party.js';

export const BAG_SIZE = 20;                  // slots; a slot holds one item or a stack
// Identical plain items (no affixes, Rare modifier or flavour: the same base, rarity, item level
// and name, so the same stats) stack in one slot, up to STACK_MAX. Each keeps its own uid in
// state.bag (the save's shape is unchanged); stacking is how the slots are counted and shown.
export const STACK_MAX = 10;
/** @param {any} it */
export const stackKey = (it) => ((it.aff && it.aff.length) || it.mod || it.flav ? null : `${it.base}|${it.r}|${it.ilv}|${it.name}`);
/** the bag as slots, in bag order: each an array of the items stacked there @param {any[]} bag */
export function bagStacks(bag) {
  const out = [], open = new Map();
  for (const it of bag) {
    const k = stackKey(it), st = k && open.get(k);
    if (st && st.length < STACK_MAX) st.push(it); else { const n = [it]; out.push(n); if (k) open.set(k, n); }
  }
  return out;
}
// drop odds: chance of any item, then the rarity split (the rest is Common). Generous for
// v1 so the loop is felt early; deeper rooms add +5 % per room level to the chance.
export const DROP = {
  chest: { chance: 0.6, fine: 0.25, rare: 0.04 },
  boss: { chance: 1, fine: 0.55, rare: 0.3 },            // a boss always leaves something, never less than Fine (below)
  wave: { chance: 0.08, fine: 0.2, rare: 0.02 },
  elite: { chance: 0.3, fine: 0.35, rare: 0.06 },
};

export function createLoot({ state, bus, seed }) {
  if (!state.bag) state.bag = [];
  const C = state.counters;
  const member = (id) => state.party.find((m) => m.id === id);
  // would the bag still fit its slots with these items added and those taken out?
  const fits = (add, remove = []) => bagStacks(state.bag.filter((it) => !remove.includes(it)).concat(add)).length <= BAG_SIZE;
  const toBag = (it) => { if (it) state.bag.push(it); };
  const fromBag = (uid) => { const i = state.bag.findIndex((it) => it.uid === uid); return i < 0 ? null : state.bag.splice(i, 1)[0]; };

  // who this item upgrades most (null if nobody)
  function bestFor(it) {
    let best = null, top = 0.05;
    for (const m of state.party) { const s = upgradeScore(m, it); if (s > top) { top = s; best = m.id; } }
    return best;
  }

  function drop(src, { ilv, x, y }) {
    const odds = DROP[src]; if (!odds) return null;
    C.lootN = (C.lootN || 0) + 1;
    const rng = mulberry32(streamSeed(seed, 91000 + C.lootN));
    if (rng() >= Math.min(0.95, odds.chance * (1 + 0.05 * Math.max(0, ilv - 1)))) return null;
    const q = rng(), rarity = q < odds.rare ? 'rare' : q < odds.rare + odds.fine || src === 'boss' ? 'fine' : 'common';
    C.uidN = (C.uidN || 0) + 1;
    const classes = [...new Set(state.party.map((m) => m.cls))];
    const item = rollItem(rng, { ilv: Math.max(1, ilv), rarity, classes, uid: 'i' + C.uidN });
    let salvaged = 0;
    if (fits([item])) toBag(item);
    else { salvaged = SALVAGE[item.r]; C.embers = (C.embers || 0) + salvaged; }            // bag full: straight to Embers
    bus.emit('loot', { item, x, y, src, best: salvaged ? null : bestFor(item), salvaged });
    bus.emit('countersChanged', { ...C });
    return item;
  }

  // an heirloom (items.js HEIRLOOMS): once, from its boss's first fall, a companion's chain or a vault
  function grant(id, { ilv, x, y, src }) {
    C.uidN = (C.uidN || 0) + 1;
    const item = makeHeirloom(id, Math.max(1, ilv), 'i' + C.uidN);
    let salvaged = 0;
    if (fits([item])) toBag(item); else { salvaged = SALVAGE[item.r]; C.embers = (C.embers || 0) + salvaged; }
    bus.emit('loot', { item, x, y, src, best: salvaged ? null : bestFor(item), salvaged, heirloom: id });
    bus.emit('countersChanged', { ...C });
    return item;
  }

  const refuse = (reason) => { bus.emit('gearRefused', { reason }); return true; };
  const changed = (m) => {
    const s = statsFor(m); m.hp = Math.min(m.hp, s.maxHp); if (m.mp !== undefined) m.mp = Math.min(m.mp, s.maxMp);
    bus.emit('gearChanged', { member: m.id }); bus.emit('partyChanged', state.party);
  };

  // commands: equip { member, uid } (from the bag — also how an item is given to a companion),
  // unequip { member, slot }, salvage { uid }. Returns true when it handled the command.
  function command(cmd) {
    if (cmd.type === 'equip') {
      const m = member(cmd.member), it = state.bag.find((q) => q.uid === cmd.uid);
      if (!m || !it) return true;
      if (!canWear(m, it)) return refuse(`${m.name} can't use ${it.name}`);
      const slot = BASES[it.base].slot, g = m.gear || (m.gear = {});
      if (slot === 'off' && isTwoHanded(g.weapon)) return refuse(`${g.weapon.name} needs both hands`);
      const out = [g[slot], isTwoHanded(it) ? g.off : null].filter(Boolean);
      if (!fits(out, [it])) return refuse('The bag is full');
      fromBag(it.uid); g[slot] = it; if (isTwoHanded(it)) g.off = null;
      out.forEach(toBag); changed(m); return true;
    }
    if (cmd.type === 'unequip') {
      const m = member(cmd.member), it = m && m.gear && m.gear[cmd.slot];
      if (!it) return true;
      if (!fits([it])) return refuse('The bag is full');
      m.gear[cmd.slot] = null; toBag(it); changed(m); return true;
    }
    if (cmd.type === 'salvage') {
      const it = fromBag(cmd.uid); if (!it) return true;
      C.embers = (C.embers || 0) + SALVAGE[it.r];
      bus.emit('countersChanged', { ...C }); bus.emit('gearChanged', { member: null }); return true;
    }
    return false;
  }
  return { drop, grant, command, bestFor };
}
