// @ts-check
// smith.js — Hale & Daughter's forge and Wendel's Provisions (GDD §8 v1.13): where gold and cinders (✦,
// counters.embers in the save) go. No draughts: what keeps a party standing is who's in it.
//
// The forge (in town):
//   upgrade { uid }         +1 a step up to +5 (items.js UP_STEP more on the base stats a step), for
//                           UP_GOLD[n] × item level gold (−10 % for a Deepdelver-fostered hero), UP_CINDERS[n] cinders and, from +3, wood and stone
//   reforge { uid, aff }    reroll one affix of a Fine or better item: a different kind, rolled fresh at the
//                           item's level on the REFORGE stream (the item's uid and how often it's been
//                           reforged), so it's the same for everyone who does the same; each reforge of
//                           that item costs double the last
//   salvageCommons {}       every plain Common in the bag (never one upgraded) to cinders, 1 each
// (salvage { uid } is loot.js's, anywhere: it now gives back half the cinders an upgrade took.)
//
// The shop (in town): a stock of STOCK_N plain Commons at the hero's level, for the party's classes,
// rolled on the SHOP stream for the day and put up the first time you're in town that day (state.shop
// = { day, lv, bought }); bought ones are gone until the next dawn.
//   buy { idx }             BUY × item level gold, into the bag
//   sell { uid }            a bag item (not an heirloom) for SELL[rarity] × item level, +25 % a smith's step;
//                           the last BUYBACK_N sold wait in state.buyback
//   buyBack { uid }         one of them, for what it fetched
// Every command checks the town, the gold and cinders, and the bag's room; an invalid one does nothing
// (or says why: 'refused'). Events: 'forged' { uid, what: 'upgrade' | 'reforge' | 'salvage', up?, aff?, n? },
// 'traded' { what: 'buy' | 'sell' | 'buyBack', uid, gold }.

import { mulberry32, streamSeed, STREAM } from './rng.js';
import { BASES, SALVAGE, UP_MAX, UP_GOLD, UP_CINDERS, UP_MATS, rollItem, rollAffix, refreshItem, salvageOf, cindersIn, CLASS_IDS, makeItem, isUsable, SCROLL_PRICE } from './items.js';
import { bagStacks, BAG_SIZE } from './loot.js';
import { DAY_S } from './heroes.js';
import { ORIGIN_EDGE } from './party.js';

export { UP_GOLD, UP_CINDERS, UP_MATS, salvageOf, cindersIn };
export const REFORGE_GOLD = 50, REFORGE_CINDERS = 3;     // × item level, doubling with each reforge of the item
export const BUY = 40, STOCK_N = 4, BUYBACK_N = 5;
export const SELL = { common: 6, fine: 15, rare: 40 };   // × item level (heirlooms aren't sold)
const hashStr = (s) => { let h = 2166136261; for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619); return h >>> 0; };

/** the next upgrade's price, or null at +5; a Deepdelver-fostered hero's gold is 10 % less (ORIGIN_EDGE)
 * @param {any} it @param {string} [origin] the hero's @returns {{ gold: number, cinders: number, wood: number, stone: number } | null} */
export function upgradeCost(it, origin) {
  const n = it.up || 0; if (n >= UP_MAX) return null;
  const e = origin ? ORIGIN_EDGE[origin] : null, off = e && e.kind === 'smithDiscount' ? e.value : 0;
  return { gold: Math.round(UP_GOLD[n] * it.ilv * (1 - off)), cinders: UP_CINDERS[n], wood: UP_MATS[n], stone: UP_MATS[n] };
}
/** the next reforge's price @param {any} it */
export const reforgeCost = (it) => ({ gold: REFORGE_GOLD * it.ilv * (1 << Math.min(10, it.rf || 0)), cinders: REFORGE_CINDERS });
/** what the shop pays (null: it won't buy it) @param {any} it */
export const sellPrice = (it) => (isUsable(it) ? Math.round(SCROLL_PRICE / 4) : SELL[it.r] ? Math.round(SELL[it.r] * it.ilv * (1 + 0.25 * (it.up || 0))) : null);   // a scroll: a quarter of its price
/** what the shop asks @param {any} it */
export const buyPrice = (it) => BUY * it.ilv;

/** The shop's stock for a day: plain Commons at a level, for these classes (the party's).
 * @param {number} seed @param {number} day @param {number} lv @param {string[]} classes */
export function shopStock(seed, day, lv, classes) {
  const rng = mulberry32(streamSeed(seed ^ Math.imul(day + 1, 0x85ebca6b), STREAM.SHOP)), out = [];
  for (let i = 0; i < STOCK_N; i++) out.push(rollItem(rng, { ilv: Math.max(1, lv), rarity: 'common', classes: classes.length ? classes : CLASS_IDS, uid: `shop${day}.${i}` }));
  return out;
}

/** @param {{ state: any, bus: any, getWorld: () => any, seed: number }} o */
export function createSmith({ state, bus, getWorld, seed }) {
  if (!state.shop) state.shop = { day: -1, lv: 1, bought: [] };
  if (!state.buyback) state.buyback = [];
  const C = state.counters;
  // the forge or the shop, if this town has it (M8: a waystation has neither); null if here, else the refusal
  const lacks = (kind, away) => { const w = getWorld(); if (w.kind !== 'town') return away; return (w.services || []).some((v) => v.kind === kind) ? null : `${w.name} has no ${kind === 'smith' ? 'forge' : 'shop'}`; };
  const day = () => Math.floor(state.t / DAY_S);
  const refuse = (reason) => { bus.emit('refused', { reason }); return true; };
  const members = () => [...state.party, ...state.bench];
  const classes = () => [...new Set(state.party.map((m) => m.cls))];
  /** an item of the company's: in the bag, or worn by anyone in the party or on the bench */
  const find = (uid) => state.bag.find((it) => it.uid === uid) || members().map((m) => Object.values(m.gear || {}).find((it) => it && it.uid === uid)).find(Boolean) || null;
  const fits = (add) => bagStacks(state.bag.concat(add)).length <= BAG_SIZE;
  const counters = () => bus.emit('countersChanged', { ...C });
  const gear = () => { bus.emit('gearChanged', { member: null }); bus.emit('partyChanged', state.party); };
  const short = (cost) => ((C.gold || 0) < cost.gold ? 'gold' : (C.embers || 0) < (cost.cinders || 0) ? 'cinders' : (C.wood || 0) < (cost.wood || 0) ? 'wood' : (C.stone || 0) < (cost.stone || 0) ? 'stone' : null);
  const pay = (cost) => { C.gold -= cost.gold; C.embers = (C.embers || 0) - (cost.cinders || 0); C.wood -= cost.wood || 0; C.stone -= cost.stone || 0; };

  // the day's stock goes up the first time you're in town that day (like the board)
  function tick() {
    if (state.shop.day === day() || lacks('shop', 'x')) return;
    state.shop = { day: day(), lv: state.party[0].level, bought: [] };
  }
  const stock = () => (state.shop.day >= 0 ? shopStock(seed, state.shop.day, state.shop.lv, classes()) : []);

  /** @param {any} cmd @returns {boolean} true when the command was ours */
  function command(cmd) {
    switch (cmd.type) {
      case 'upgrade': {
        { const no = lacks('smith', 'Upgrades are done at the forge in town'); if (no) return refuse(no); }
        const it = find(cmd.uid); if (!it || isUsable(it)) return true;
        const cost = upgradeCost(it, state.party[0].origin); if (!cost) return refuse(`${it.name} is at +${UP_MAX}`);
        const no = short(cost); if (no) return refuse(`Not enough ${no}`);
        pay(cost); it.up = (it.up || 0) + 1;
        bus.emit('forged', { uid: it.uid, what: 'upgrade', up: it.up }); counters(); gear(); return true;
      }
      case 'reforge': {
        { const no = lacks('smith', 'Reforging is done at the forge in town'); if (no) return refuse(no); }
        const it = find(cmd.uid); if (!it || !Array.isArray(it.aff)) return true;
        const i = cmd.aff; if (!Number.isInteger(i) || i < 0 || i >= it.aff.length) return true;
        const cost = reforgeCost(it), no = short(cost); if (no) return refuse(`Not enough ${no}`);
        pay(cost);
        const rng = mulberry32(streamSeed(seed ^ hashStr(String(it.uid)) ^ Math.imul((it.rf || 0) + 1, 0x9e3779b1), STREAM.REFORGE));
        it.aff[i] = rollAffix(rng, it.ilv, it.aff.map((a) => a[0]));   // (a different kind from all it has)
        it.rf = (it.rf || 0) + 1;
        bus.emit('forged', { uid: it.uid, what: 'reforge', aff: i }); counters(); gear(); return true;
      }
      case 'salvageCommons': {
        const plain = state.bag.filter((it) => it.r === 'common' && !(it.up > 0) && !isUsable(it));   // (never a scroll)
        if (!plain.length) return true;
        state.bag = state.bag.filter((it) => !plain.includes(it));
        C.embers = (C.embers || 0) + plain.length * SALVAGE.common;
        bus.emit('forged', { uid: null, what: 'salvage', n: plain.length }); counters(); gear(); return true;
      }
      case 'buy': {
        { const no = lacks('shop', 'Buy at the shop in town'); if (no) return refuse(no); }
        const st = stock(), it = st[cmd.idx]; if (!it || state.shop.bought.includes(cmd.idx)) return true;
        const price = buyPrice(it); if ((C.gold || 0) < price) return refuse('Not enough gold');
        if (!fits([it])) return refuse('The bag is full');
        C.gold -= price; C.uidN = (C.uidN || 0) + 1;
        state.bag.push({ ...it, uid: 'i' + C.uidN }); state.shop.bought = [...state.shop.bought, cmd.idx];
        bus.emit('traded', { what: 'buy', uid: 'i' + C.uidN, gold: price }); counters(); gear(); return true;
      }
      case 'buyScroll': {                                    // a Homeward Scroll: always on the shelf, at SCROLL_PRICE
        { const no = lacks('shop', 'Buy at the shop in town'); if (no) return refuse(no); }
        if ((C.gold || 0) < SCROLL_PRICE) return refuse('Not enough gold');
        C.uidN = (C.uidN || 0) + 1;
        const it = makeItem('homeward', 1, 'common', { uid: 'i' + C.uidN });
        if (!fits([it])) { C.uidN -= 1; return refuse('The bag is full'); }
        C.gold -= SCROLL_PRICE; state.bag.push(it);
        bus.emit('traded', { what: 'buy', uid: it.uid, gold: SCROLL_PRICE }); counters(); gear(); return true;
      }
      case 'sell': {
        { const no = lacks('shop', 'Sell at the shop in town'); if (no) return refuse(no); }
        const i = state.bag.findIndex((q) => q.uid === cmd.uid); if (i < 0) return true;
        const it = state.bag[i], price = sellPrice(it); if (price === null) return refuse('Wendel won\'t take an heirloom');
        state.bag.splice(i, 1); C.gold = (C.gold || 0) + price;
        state.buyback = [{ ...it, sold: price }, ...state.buyback].slice(0, BUYBACK_N);
        bus.emit('traded', { what: 'sell', uid: it.uid, gold: price }); counters(); gear(); return true;
      }
      case 'buyBack': {
        { const no = lacks('shop', 'Buy back at the shop in town'); if (no) return refuse(no); }
        const i = state.buyback.findIndex((q) => q.uid === cmd.uid); if (i < 0) return true;
        const { sold, ...it } = state.buyback[i];
        if ((C.gold || 0) < sold) return refuse('Not enough gold');
        if (!fits([it])) return refuse('The bag is full');
        C.gold -= sold; state.buyback.splice(i, 1); state.bag.push(it);
        bus.emit('traded', { what: 'buyBack', uid: it.uid, gold: sold }); counters(); gear(); return true;
      }
    }
    return false;
  }
  const snapshot = () => ({ shop: { ...state.shop, bought: [...state.shop.bought] }, buyback: state.buyback.map((it) => ({ ...it })) });
  function restore(data) {
    const s = data && data.shop, d = s && Number.isInteger(s.day) ? s.day : -1, lv = s && Number.isInteger(s.lv) ? s.lv : 1;
    const ok = d >= 0 && d <= day() && lv >= 1 && lv <= state.party[0].level;
    state.shop = ok ? { day: d, lv, bought: (Array.isArray(s.bought) ? s.bought : []).filter((i) => Number.isInteger(i) && i >= 0 && i < STOCK_N) } : { day: -1, lv: 1, bought: [] };   // v16 and older: none yet
    state.buyback = (Array.isArray(data && data.buyback) ? data.buyback : []).filter((it) => it && BASES[it.base] && Number.isInteger(it.sold) && it.sold > 0).slice(0, BUYBACK_N).map((it) => refreshItem({ ...it }));
  }
  return { tick, command, stock, snapshot, restore, find };
}
