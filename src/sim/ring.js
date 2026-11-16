// @ts-check
// ring.js — the region boss (GDD §19 v1.105; docs/region-boss-proposal.md; the owner, 2026-11-15: "Ok go with your
// proposal, except world boss at the top of each hour for now (24x)"). The Kingstone, the old stones' centre stone in the
// Greywater Fens (world doc v1.50 §3.2), stands for a window at the top of every hour, there in the Fens' own map (v1.106,
// the owner: "Can we spawn the region boss directly in the map?"); a company walks into the stones' reach then and fights
// it where it stands, with up to four other companies. Offline those are AI companies (rivals.js, as the Bowl's); online
// they'll be other players' (docs/region-boss-proposal.md §7).
//
// What's here is the event's rules and numbers, and nothing that runs: the fight is battle.js's (startRing, the tells,
// its walk, the respawn), its standing at the stones and the pay core.js's. Pure data and pure functions, so the harness and the tests
// read the same numbers.
//
// The window. The sim keeps no clock (AGENTS.md rule 1), so the UI (src/ui/ring.js) reads the device's and says when a
// window is on: a command (ringOpen) carries the window's id ('2026-11-15T14', the hour) and the seconds it has left. Offline play
// is unverified anyway (as the raid's three a day are); online the server opens the window and the id is its.
// state.ring = { paid: [window ids, the last PAID_KEEP], won, best (s, the fastest fall) } (save v51).

import { mulberry32, streamSeed } from './rng.js';
import { ROSTER_IDS } from './rivals.js';

export const RING = {
  id: 'kingstone', name: 'The Kingstone', kind: 'kingstone', family: 'golems',
  offset: 0,             // its window opens this many seconds into the hour (Furnace Nine's at half past, v1.126)
  region: 'fens',
  camp: 'fens_stones',   // where it stands (camps.js): the old stones' middle, in the Fens' own map (v1.106: no Ring of its own)
  level: 18,             // the region's top: every hero fights at it (level sync, §5)
  minLevel: 10,          // the region's band starts here: below it, the stones don't take you
  window: 900,           // a window's length (s): the first 15 minutes of the hour
  announce: 600,         // its warning, before the hour (s)
  respawn: 8,            // a Downed member gets up at the ring's edge after this (s), whole, at no cost
  maxParties: 5,         // yours and four more
  joinUntil: 0.25,       // a company can walk in until the Kingstone is under this share of its HP
  hpStep: [1, 1.85, 4.0, 5.0, 6.5],   // its HP × by parties present (steps up as one arrives, never down; set by the harness, regionboss.mjs, so the fight's length holds from 2 to 5)
  arrive: [6, 14, 22, 30],            // the AI companies' arrivals (s into the fight), as many as the window's draw says
  over: 4,               // s after the end before the end card (the ring cleared)
  // the three tells (GDD §19.2): every one a shape on the ground filling over `wind` s, landing as a share of max HP
  // (v1.106, the owner: "Hits from the region boss should take my level 15 char down to about 30% health, the second if
  // im not healed enough should knock me out": every hit 70 % of max HP, the plain blow too, which is now a tell, slam)
  slam: { every: 4, crackedEvery: 3, wind: 1.3, r: 2.4, hurt: 0.7, reach: 6 },   // its blow: where the nearest within reach stands
  stamp: { every: 7, crackedEvery: 5, wind: 2.0, r: 3.5, hurt: 0.7 },   // (2.0 s, 3.5: from its middle, after a look, a member at a run clears it; 1.6 and 4 caught most, test/ring.test.mjs)
  sweep: { every: 12, crackedEvery: 9, wind: 2.0, len: 9, arc: (2 * Math.PI) / 3, hurt: 0.7, throw: 3 },
  stones: { every: 30, wind: 2.4, r: 2.5, n: [6, 10], crackedN: [10, 14], hurt: 0.7, at: [0.75, 0.5, 0.25] },
  cracked: 0.5,          // under half: it cracks, and its tells come faster
  // how it moves (battle.js kingTurn): a giant's walk to the thick of the fight, turning slowly; its swing's lead on a tell
  king: { pace: 1.1, turn: 1.2, keep: 2.5, edge: 3, retarget: 6 },   // (v1.122: 1.4 and 1.5 before; a giant walks slower, turns slower)
  swingLead: 0.45,
  // the AI's eye for a tell: how long before a member steps out (s), a companion's and the hero's when you let go
  react: [0.4, 0.9], heroReact: 0.8,
  // the tiers, by a company's part against the Ring's average company's (damage dealt + healing done ×1.5, its members'
  // together: the fighter who holds it and the cleric who heals count as the mage who hits), and the hero there a minute
  tier: { gold: 1.15, silver: 0.8, bronze: 60 },
  // the pay a tier, paid by the event (not dropped: GDD v1.104's halving isn't this): XP as a share of the hero's next
  // level, gold × the hero's level, cinders, and an item's rarity (a Rare's chance at gold)
  pay: {
    bronze: { xp: 0.1, gold: 60, cinders: 5, item: null },
    silver: { xp: 0.2, gold: 120, cinders: 10, item: 'fine' },
    gold: { xp: 0.3, gold: 200, cinders: 20, item: 'fine', rare: 0.3, heirloom: 0.04 },
  },
  heirloom: 'kingstones_ember',
  PAID_KEEP: 48,         // window ids remembered (two days of hours)
};
// Furnace Nine (v1.126; world doc v1.54; docs/reach-plan.md *The region boss*; the owner: "Furnace Nine at 30 after on the
// hour"): the Cinder Reach's, the same event a half hour on. Once the story has broken it (lamps.js `furnace_nine`, the
// Stoker's) it relights on its own ("It learned to feed itself") and burns at the Magma Vault's mouth (camps.js
// `reach_mouth`) for the first quarter of every second half hour. Its tells are the Kingstone's shapes (a pour where the
// nearest stands, a knot's stamp, a sweep of slag, the vents across the ground); it **feeds on the fallen**: a member who
// goes down and gets up at the edge, not raised where they lay, gives it `feeds` of its life back.
export const FURNACE = {
  ...RING, id: 'furnace_nine', name: 'Furnace Nine', kind: 'furnace_nine', family: 'works', offset: 1800,
  region: 'reach', camp: 'reach_mouth', level: 30, minLevel: 25,
  lamp: 'furnace_nine',  // it burns again only once the company has broken it (the Stoker's lamp)
  hpStep: [1, 1.85, 3.3, 3.9, 4.6],   // (its own: on the Kingstone's, 4.0 / 5.0 / 6.5, five companies took 8.5–10.6 min at 30 and one ran out of time)
  feeds: 0.02,           // of its max HP back for each one who goes down near it and isn't raised
  feedReach: 8,          // "near it": tiles past its body
  heirloom: 'quota',
};
/** every region boss, by id @type {Record<string, typeof RING>} */
export const RINGS = { kingstone: RING, furnace_nine: FURNACE };
/** the region boss whose ground is this spawn point, if any @param {string} campId */
export const ringByCamp = (campId) => Object.values(RINGS).find((R) => R.camp === campId) || null;
const two = (n) => String(n).padStart(2, '0');
/** the suffix a window's id carries for its boss (the Kingstone's none, the hour's top; Furnace Nine's ':30') @param {typeof RING} R */
const suffixOf = (R) => (R.offset ? ':' + two(Math.round(R.offset / 60)) : '');
/** the region boss a window's id is for @param {string} id */
export const ringForId = (id) => Object.values(RINGS).find((R) => (R.offset ? id.endsWith(suffixOf(R)) : !id.includes(':'))) || RING;

/** a window's id, the hour it opens: 'YYYY-MM-DDTHH' @param {any} id */
export const isWindowId = (id) => typeof id === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}(:30)?$/.test(id);   // (':30': Furnace Nine's)

/** @param {any} state */
export function ringOf(state) {
  if (!state.ring) state.ring = { paid: [], won: 0, best: 0 };
  return state.ring;
}
/** a save's record, read back whole or not at all @param {any} v */
export function restoreRing(v) {
  const n = (x) => (Number.isFinite(x) && x >= 0 ? Math.floor(x) : 0);
  if (!v || typeof v !== 'object') return { paid: [], won: 0, best: 0 };
  return { paid: (Array.isArray(v.paid) ? v.paid.filter(isWindowId) : []).slice(-RING.PAID_KEEP), won: n(v.won), best: n(v.best) };
}
/** has this hero been paid for this window? @param {any} state @param {string} id */
export const paidFor = (state, id) => ringOf(state).paid.includes(id);

/** a window's draws (its own stream: the same Ring for anyone in it): how many AI companies come, and which @param {number} seed
 *  @param {string} id @returns {{ n: number, ids: string[], salt: number }} */
export function windowDraw(seed, id) {
  let h = 0; for (let i = 0; i < id.length; i++) h = (Math.imul(h, 31) + id.charCodeAt(i)) | 0;
  const rng = mulberry32(streamSeed(seed ^ h, 0x41b6)), n = 1 + Math.floor(rng() * 4), ids = [];
  while (ids.length < n) { const c = ROSTER_IDS[Math.floor(rng() * ROSTER_IDS.length)]; if (!ids.includes(c)) ids.push(c); }
  return { n, ids, salt: h >>> 0 };
}
/** where the hour stands for a region boss, from the clock's fields (the UI reads the device's; the sim never does): a
 * window open in its first 15 minutes (its id and the seconds it has left), or the next one's id and the seconds till it,
 * announced in the last 10. The Kingstone's opens at the hour's top, Furnace Nine's at half past (R.offset)
 * @param {{ y: number, mo: number, d: number, h: number, m: number, s: number }} c the local date (mo 1–12) and time
 * @param {typeof RING} [R] the boss (the Kingstone if not said)
 * @returns {{ id: string, open: boolean, left: number, soon: boolean, until: number }} */
export function windowAt(c, R = RING) {
  const sec = c.m * 60 + c.s, into = (sec - R.offset + 3600) % 3600, h0 = sec >= R.offset ? c.h : (c.h + 23) % 24, suf = suffixOf(R);
  const day = `${c.y}-${two(c.mo)}-${two(c.d)}T`;
  if (into < R.window) return { id: `${day}${two(h0)}${suf}`, open: true, left: R.window - into, soon: false, until: 0 };
  const until = 3600 - into, nh = (h0 + 1) % 24;
  // (the next window's id: past midnight the next day's, worked out by the UI's own Date: here the hour only, as a label)
  return { id: `${day}${two(nh)}${suf}`, open: false, left: 0, soon: until <= R.announce, until };
}
/** a region boss's HP × for this many parties @param {number} parties @param {typeof RING} [R] */
export const hpStepOf = (parties, R = RING) => R.hpStep[Math.max(1, Math.min(R.maxParties, parties)) - 1];

/** a hero's tier: its company's score against the Ring's average company's, the hero there a minute ('gold' | 'silver' |
 * 'bronze' | null) @param {{ score: number, stood: number }} part the company's score, the hero's time standing
 * @param {number} avg the average company's score */
export function tierOf(part, avg, R = RING) {
  if (!part || part.stood < R.tier.bronze) return null;
  const k = avg > 0 ? part.score / avg : 1;
  return k >= R.tier.gold ? 'gold' : k >= R.tier.silver ? 'silver' : 'bronze';
}
/** what a tier pays a hero (the draws its own: the window's salt and the hero's), before the item is made (core.js)
 * @param {'gold' | 'silver' | 'bronze'} tier @param {number} level @param {number} toNext the hero's XP to its next level
 * @param {number} seed @param {number} salt @param {boolean} won the boss fell (else a minute there pays Bronze, no more) @param {typeof RING} [R] */
export function payOf(tier, level, toNext, seed, salt, won, R = RING) {
  const t = won ? tier : 'bronze', P = R.pay[t], rng = mulberry32(streamSeed(seed ^ salt, 0x41b7));
  const rare = P.rare && rng() < P.rare, heirloom = !!P.heirloom && rng() < P.heirloom;
  return { tier: t, xp: Math.round(toNext * P.xp), gold: P.gold * level, cinders: P.cinders, item: P.item ? (rare ? 'rare' : P.item) : null, heirloom };
}
