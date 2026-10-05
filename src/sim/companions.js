// @ts-check
// companions.js — the Lantern Guild's sellswords (GDD §6.2 v1.9, world doc §4 v1.11): ranks,
// perks, wages and loyalty. Pure data and formulas; heroes.js owns the commands (hire, ask around,
// retrain, pay) and the dawn wage, battle.js fights the perks out, party.js adds the ones that are
// only the companion's own stats.
//
// A hired companion carries, durably (core.js MEMBER_KEYS):
//   rank      'wick' | 'lamp' | 'lantern' | 'beacon' (a found companion: 'found', no wage)
//   perks     [ids] it fights with; hidden: a perk id kept back until loyalty 3 (Lantern, Beacon)
//   bond      loyalty points: +1 a dawn it's paid in the party, +1 a boss it helped put down,
//             −2 a dawn it isn't paid; loyalty 0–5 is read off LOYALTY
//   owed      gold it's waiting on (unpaid dawns): while owed, its perks are dark
//   retrains  how often a perk was retrained (each costs more)
// The ids are API (saved); their names and lines are content/companions/perks.json, kept in step
// by test/companions.test.mjs (the sim can't read JSON, and mustn't trust the client's).

import { mulberry32, streamSeed } from './rng.js';

/** @typedef {'stat'|'fight'|'skill'|'aura'|'bond'|'gold'|'quirk'} Family */
/** @typedef {{ fam: Family, cost: number, cls?: string[], aura?: string }} PerkDef */

// fee and wage are × the companion's level; perks: how many it shows, budget: their summed cost
// (a quirk adds 1); odds: % of tavern rolls; hidden: one more, kept back until loyalty 3; aura: the
// Beacon's signature (one aura always among its perks)
export const RANKS = {
  wick:    { fee: 30,  wage: 5,  perks: 1, budget: 1, odds: 55, hidden: false, aura: false },
  lamp:    { fee: 90,  wage: 12, perks: 2, budget: 3, odds: 30, hidden: false, aura: false },
  lantern: { fee: 250, wage: 25, perks: 2, budget: 4, odds: 12, hidden: true,  aura: false },
  beacon:  { fee: 600, wage: 45, perks: 3, budget: 6, odds: 3,  hidden: true,  aura: true },
};
export const RANK_IDS = /** @type {(keyof typeof RANKS)[]} */ (Object.keys(RANKS));
export const BENCH_WAGE = 0.5;          // a benched companion draws half
export const QUIRK_CHANCE = 0.2;
// loyalty n needs LOYALTY[n] bond: 3 shows the hidden perk, 5 is Sworn (a quarter off the wage, and
// once a room visit it gets up from a blow that would have Downed it, at 30 %)
export const LOYALTY = [0, 1, 3, 5, 8, 12];
export const REVEAL_AT = 3, SWORN_AT = 5, SWORN_WAGE = 0.75, SWORN_RISE = 0.3;
export const ASK_COST = 10, RETRAIN_COST = 60;   // × level: Ask around (doubles each time the same day), a retrain (× retrains + 1)

// The perks (GDD §6.2). Effects live where they're fought out; the numbers are here.
/** @type {Record<string, PerkDef>} */
export const PERKS = {
  // the companion's own stats (party.js statsFor)
  stubborn:       { fam: 'stat', cost: 1 },                                    // +10 % DEF
  hardy:          { fam: 'stat', cost: 1 },                                    // +10 % max HP
  keen_eyed:      { fam: 'stat', cost: 1 },                                    // +3 % CRIT
  light_footed:   { fam: 'stat', cost: 1 },                                    // +3 % DODGE
  iron_lunged:    { fam: 'stat', cost: 1 },                                    // +25 % HP regen
  devout:         { fam: 'stat', cost: 1, cls: ['cleric', 'fighter', 'shaman'] },   // their heals +10 %
  // how they fight (battle.js)
  bodyguard:      { fam: 'fight', cost: 2, cls: ['fighter'] },                 // takes 20 % of what's aimed at the hero, within 3 tiles
  skirmisher:     { fam: 'fight', cost: 2, cls: ['rogue', 'fighter'] },        // +20 % to a foe that isn't fighting them
  finisher:       { fam: 'fight', cost: 2 },                                   // +15 % to a foe under half its HP
  last_stand:     { fam: 'fight', cost: 2, cls: ['fighter', 'rogue'] },        // +20 % ATK under a quarter HP
  field_medic:    { fam: 'fight', cost: 2, cls: ['cleric', 'mage', 'fighter', 'shaman'] },   // every 12 s in a fight: the most hurt ally +5 % max HP
  grave_warden:   { fam: 'fight', cost: 2 },                                   // +15 % to the Ashbound
  redhand_breaker: { fam: 'fight', cost: 2 },                                  // +15 % to the living
  // their abilities (battle.js)
  venomous:       { fam: 'skill', cost: 2, cls: ['rogue'] },                   // Venom lasts 2 s longer
  smoke_artist:   { fam: 'skill', cost: 2, cls: ['rogue'] },                   // Smoke Step lasts 2 s longer
  long_watch:     { fam: 'skill', cost: 2, cls: ['fighter'] },                 // Shield Wall lasts 2 s longer
  kindler:        { fam: 'skill', cost: 2, cls: ['mage'] },                    // Firebolt splashes 0.3× to those beside its target
  steady_hands:   { fam: 'skill', cost: 2, cls: ['cleric'] },                  // Mend heals 15 % more
  deep_drinker:   { fam: 'skill', cost: 2, cls: ['shaman'] },                  // Spirit Drain lasts 2 s longer (v1.19)
  // party auras (battle.js): only the strongest of a kind counts, however many carry it
  drillmaster:    { fam: 'aura', cost: 3, aura: 'pace' },                      // the party attacks 5 % faster
  banner_man:     { fam: 'aura', cost: 3, aura: 'guard' },                     // the party +5 % DEF
  old_campaigner: { fam: 'aura', cost: 3, aura: 'regen' },                     // the party +10 % HP regen
  // with the company they keep (battle.js)
  hometown:       { fam: 'bond', cost: 2 },                                    // +8 % DEF if the hero is Thornwick-born
  deserters_bond: { fam: 'bond', cost: 2 },                                    // +10 % ATK if the hero is a Redhand deserter
  sisters_ward:   { fam: 'bond', cost: 2, cls: ['cleric', 'fighter', 'mage'] },   // their heals +15 % if the hero is a Grey Sisters' ward
  delvers_eyes:   { fam: 'bond', cost: 2 },                                    // +10 % ATK on a site's second floor and deeper, if the hero was Deepdelver-fostered
  shield_brother: { fam: 'bond', cost: 2, cls: ['fighter'] },                  // +10 % DEF while another fighter is in the party
  // gold (heroes.js, battle.js)
  thrifty:        { fam: 'gold', cost: 1 },                                    // their own wage −30 %
  haggler:        { fam: 'gold', cost: 1 },                                    // the inn and the temple 15 % cheaper (the party's best)
  scavenger:      { fam: 'gold', cost: 2 },                                    // +10 % gold from foes (the party's best)
  // quirks: a cost for one more point of budget
  greedy:         { fam: 'quirk', cost: -1 },                                  // wage × 1.5, +5 % gold from foes
  reckless:       { fam: 'quirk', cost: -1, cls: ['fighter', 'rogue'] },       // +10 % ATK, −10 % DEF
  drinker:        { fam: 'quirk', cost: -1 },                                  // −5 % ATK unless the party has slept at an inn in the last two days
};
export const PERK_IDS = Object.keys(PERKS);
export const STAT = { stubborn: 1.1, hardy: 1.1, keen_eyed: 3, light_footed: 3, iron_lunged: 1.25, devout: 1.1, reckless: [1.1, 0.9], drinker: 0.95 };
export const FIGHT = { bodyguard: 0.2, bodyguardR: 3, skirmisher: 1.2, finisher: 1.15, last_stand: 1.2, medicEvery: 12, medicHeal: 0.05, warden: 1.15, venom: 2, smoke: 2, wall: 2, kindle: 0.3, steady: 1.15, drink: 2 };
export const AURA = { pace: 0.95, guard: 1.05, regen: 1.1 };
export const BOND = { hometown: 1.08, deserters_bond: 1.1, sisters_ward: 1.15, delvers_eyes: 1.1, shield_brother: 1.1 };
export const GOLD = { thrifty: 0.7, haggler: 0.85, scavenger: 0.1, greedy: 0.05, greedyWage: 1.5 };
export const DRINK_DAYS = 2;

// the old tavern traits (v13 saves) and the perk each one now is: they were only words before
export const TRAIT_PERK = { Stubborn: 'stubborn', 'Keen-eyed': 'keen_eyed', 'Light-footed': 'light_footed', Hardy: 'hardy', Greedy: 'greedy', Devout: 'devout' };
// found companions: no rank, no wage, their own perks (world doc §5)
export const FOUND_PERKS = { brannoc: ['bodyguard', 'hardy'], wren: ['skirmisher', 'smoke_artist'] };

/** is it a Guild hire (paid, ranked)? @param {any} m */
export const hired = (m) => !!m && Object.prototype.hasOwnProperty.call(RANKS, m.rank);
/** loyalty 0–5 @param {any} m */
export const loyaltyOf = (m) => { let n = 0; for (let i = 1; i < LOYALTY.length; i++) if ((m.bond || 0) >= LOYALTY[i]) n = i; return n; };
export const sworn = (m) => hired(m) && loyaltyOf(m) >= SWORN_AT;
/** does m fight with this perk now? (a sellsword who's owed keeps them to themselves) @param {any} m @param {string} id */
export const has = (m, id) => !!m && Array.isArray(m.perks) && m.perks.includes(id) && !(m.owed > 0);
/** does anyone in the party fight with it now? @param {any[]} party @param {string} id */
export const anyHas = (party, id) => party.some((q) => !q.fallen && has(q, id));

/** the signing fee @param {any} m */
export const feeOf = (m) => (hired(m) ? RANKS[m.rank].fee * m.level : 0);
/** a dawn's wage (perks or not: what it costs is the contract, owed or paid) @param {any} m @param {boolean} benched */
export function wageOf(m, benched) {
  if (!hired(m)) return 0;
  let w = RANKS[m.rank].wage * m.level;
  if (benched) w *= BENCH_WAGE;
  if (m.perks && m.perks.includes('thrifty')) w *= GOLD.thrifty;
  if (m.perks && m.perks.includes('greedy')) w *= GOLD.greedyWage;
  if (sworn(m)) w *= SWORN_WAGE;
  return Math.round(w);
}

const pick = (rng, a) => a[Math.floor(rng() * a.length)];
const fits = (id, cls) => { const P = PERKS[id]; return !P.cls || P.cls.includes(cls); };

/** a rank by the odds @param {() => number} rng */
export function rollRank(rng) {
  let r = rng() * 100;
  for (const id of RANK_IDS) { r -= RANKS[id].odds; if (r < 0) return id; }
  return 'wick';
}
/** a sellsword's perks, to its rank's budget @param {() => number} rng @param {string} cls @param {string} rank
 * @returns {{ perks: string[], hidden: string|null }} */
export function rollPerks(rng, cls, rank) {
  const R = RANKS[rank], out = [];
  let budget = R.budget;
  if (rng() < QUIRK_CHANCE) { const q = PERK_IDS.filter((id) => PERKS[id].fam === 'quirk' && fits(id, cls)); out.push(pick(rng, q)); budget += 1; }
  if (R.aura) { const a = pick(rng, PERK_IDS.filter((id) => PERKS[id].fam === 'aura')); out.push(a); budget -= PERKS[a].cost; }
  const shown = () => out.filter((id) => PERKS[id].fam !== 'quirk').length;
  while (shown() < R.perks) {
    const left = R.perks - shown() - 1;                                          // keep a point for every slot still to fill
    const pool = PERK_IDS.filter((id) => { const P = PERKS[id]; return P.fam !== 'quirk' && P.fam !== 'aura' && fits(id, cls) && !out.includes(id) && P.cost <= budget - left; });
    if (!pool.length) break;
    const p = pick(rng, pool); out.push(p); budget -= PERKS[p].cost;
  }
  let hidden = null;
  if (R.hidden) { const pool = PERK_IDS.filter((id) => { const P = PERKS[id]; return P.fam !== 'quirk' && P.fam !== 'aura' && fits(id, cls) && !out.includes(id) && P.cost <= 2; }); hidden = pool.length ? pick(rng, pool) : null; }
  return { perks: out, hidden };
}
/** a sellsword's rank and perks: their own stream, so the names and levels the tavern drew before
 * the ranks came stay what they were for a given roster @param {number} seed @param {string} key */
export function rollSellsword(seed, key, cls) {
  let h = 0x811c9dc5; for (let i = 0; i < key.length; i++) h = Math.imul(h ^ key.charCodeAt(i), 0x01000193);
  const rng = mulberry32(streamSeed((seed ^ h) >>> 0, 6300));
  const rank = rollRank(rng);
  return { rank, ...rollPerks(rng, cls, rank) };
}
/** a retrained perk: another of the same family the companion can use, costing no more, that it
 * doesn't already have; null when there's none @param {number} seed @param {any} m @param {number} idx */
export function retrainPerk(seed, m, idx) {
  const old = m.perks[idx], P = PERKS[old];
  if (!P || P.fam === 'quirk') return null;
  const pool = PERK_IDS.filter((id) => PERKS[id].fam === P.fam && PERKS[id].cost <= P.cost && fits(id, m.cls) && !m.perks.includes(id) && id !== m.hidden);
  if (!pool.length) return null;
  let h = 0x811c9dc5; const key = m.id + ':' + ((m.retrains || 0) + 1); for (let i = 0; i < key.length; i++) h = Math.imul(h ^ key.charCodeAt(i), 0x01000193);
  return pick(mulberry32(streamSeed((seed ^ h) >>> 0, 6400)), pool);
}

/** what the party's company gives a member in a fight: auras (the strongest of a kind, from anyone
 * fighting with it) and the member's own bonds with the hero, the party and the floor
 * @param {any} m @param {any[]} party @param {{ depth?: number, innDay?: number, day?: number }} [ctx]
 * @returns {{ atk: number, def: number, hpr: number, pace: number }} */
export function companyMods(m, party, ctx = {}) {
  const o = { atk: 1, def: 1, hpr: 1, pace: 1 }, hero = party[0] || {};
  if (anyHas(party, 'drillmaster')) o.pace *= AURA.pace;
  if (anyHas(party, 'banner_man')) o.def *= AURA.guard;
  if (anyHas(party, 'old_campaigner')) o.hpr *= AURA.regen;
  if (has(m, 'hometown') && hero.origin === 'thornwick_born') o.def *= BOND.hometown;
  if (has(m, 'deserters_bond') && hero.origin === 'redhand_deserter') o.atk *= BOND.deserters_bond;
  if (has(m, 'delvers_eyes') && hero.origin === 'deepdelver_fostered' && (ctx.depth || 0) >= 1) o.atk *= BOND.delvers_eyes;
  if (has(m, 'shield_brother') && party.some((q) => q !== m && !q.fallen && q.cls === 'fighter')) o.def *= BOND.shield_brother;
  if (has(m, 'drinker') && ctx.day !== undefined && !((ctx.innDay ?? -1e9) >= ctx.day - DRINK_DAYS)) o.atk *= STAT.drinker;
  return o;
}
/** how much stronger a member's heals land @param {any} m @param {any[]} party */
export const healMod = (m, party) => (has(m, 'devout') ? STAT.devout : 1) * (has(m, 'sisters_ward') && party[0] && party[0].origin === 'grey_sisters_ward' ? BOND.sisters_ward : 1) * (has(m, 'steady_hands') ? FIGHT.steady : 1);
/** the gold foes drop, × this (scavenger and greed, the party's best of each) @param {any[]} party */
export const goldMod = (party) => 1 + (anyHas(party, 'scavenger') ? GOLD.scavenger : 0) + (anyHas(party, 'greedy') ? GOLD.greedy : 0);
/** the inn and the temple cost × this @param {any[]} party */
export const priceMod = (party) => (anyHas(party, 'haggler') ? GOLD.haggler : 1);
