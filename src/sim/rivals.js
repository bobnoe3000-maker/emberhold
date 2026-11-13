// @ts-check
// rivals.js — the Bowl's rival companies (GDD §17.2 v1.85; docs/bowl-arena-proposal.md §4): the strength of a company the
// roster names. The roster's words (content/arena.json) are authored text: each company's name, banner, home, its
// members' names and the Crier's lines; its make-up (ROSTER below: a manner, three classes) is mechanics, kept here and in
// step with the content by test/bowl.test.mjs. What's rolled here is numbers only: their level, their
// kit (by grade), their builds and their skills, so a company is a pure function of its entry, a level and a grade.
//
// A rival is a member record, as a party member is (party.js makeMember: a class, a level, attributes, gear, skills,
// trials), and battle.js fights it through the same turn as the party's companions (memberTurn). Nothing here touches
// the sim's state, and nothing a rival carries is ever the player's.
//
// For now, while the companies are generated, a company is made at the level of the company it's set against (the
// hero's), and the bracket (bowl.js) groups the ladder. Levels evened at the bracket's top wait for live companies.

import { makeMember } from './party.js';
import { makeItem, isTwoHanded } from './items.js';
import { skillsOf, MAX_RANK, skillPointsEarned, unlocked } from './skills.js';
import { drawAppearance } from './appearance.js';

/** the roster's make-up (content/arena.json has its words): [manner, the three members' classes] (`:bow` a rogue with a
 *  hunting bow, `:barbarian` a fighter in the Barbarian's look and kit). Ids are API: a save keeps them */
export const ROSTER = /** @type {Record<string, string[]>} */ ({
  widow_brack: ['wall', 'fighter', 'cleric', 'shaman'],
  coalbrook_boys: ['brawlers', 'fighter', 'fighter:barbarian', 'shaman'],
  hesks_cousins: ['stalkers', 'rogue', 'rogue', 'shaman'],
  lantern_lads: ['balanced', 'fighter', 'rogue', 'cleric'],
  mabrys_mudlarks: ['stalkers', 'rogue', 'rogue', 'cleric'],
  ninth_irregulars: ['balanced', 'fighter', 'mage', 'cleric'],
  orlas_penitents: ['wall', 'fighter', 'cleric', 'cleric'],
  ember_choir: ['spellbinders', 'mage', 'mage', 'shaman'],
  reedcutters: ['brawlers', 'fighter', 'fighter:barbarian', 'cleric'],
  pellams_men: ['balanced', 'fighter', 'rogue:bow', 'cleric'],
  slagg_hammers: ['brawlers', 'fighter', 'fighter', 'shaman'],
  quiet_company: ['stalkers', 'rogue', 'rogue:bow', 'shaman'],
  archive_wardens: ['spellbinders', 'mage', 'mage', 'shaman'],
  greywater_hedge: ['wall', 'fighter', 'shaman', 'shaman'],
  drovers: ['brawlers', 'fighter:barbarian', 'fighter', 'cleric'],
  candlemakers: ['balanced', 'fighter', 'mage', 'cleric'],
  breakwater: ['wall', 'fighter', 'cleric', 'shaman'],
  kilnfolk: ['spellbinders', 'mage', 'mage', 'shaman'],
  foxes: ['stalkers', 'rogue:bow', 'rogue', 'cleric'],
  lucky_seven: ['balanced', 'rogue', 'fighter', 'shaman'],
  frost_wardens: ['spellbinders', 'mage', 'shaman', 'fighter'],
  gravediggers: ['wall', 'fighter', 'cleric', 'shaman'],
  sun_dogs: ['brawlers', 'fighter', 'rogue', 'fighter:barbarian'],
  greenwood_kith: ['balanced', 'fighter', 'rogue:bow', 'shaman'],
});
export const ROSTER_IDS = Object.keys(ROSTER);
/** how a company fights (proposal §4): its make-up is the roster's, its stance and the rogues' weapons are this */
export const MANNERS = {
  balanced:     { name: 'Balanced',     stance: 'balanced',   text: 'A front-liner, a striker and a healer, played straight.' },
  brawlers:     { name: 'Brawlers',     stance: 'aggressive', text: 'Close fast and hit the nearest.' },
  stalkers:     { name: 'Stalkers',     stance: 'balanced',   text: 'Round the front to your healer or your mage.', bow: true },
  wall:         { name: 'Wall',         stance: 'defensive',  text: 'Hold the line, heal through it, outlast the clock.' },
  spellbinders: { name: 'Spellbinders', stance: 'balanced',   text: 'Hold you still, then burn you down.' },
};
/** the make-up the generator gives a manner when the roster names none (and the harness's companies) */
export const MAKEUP = {
  balanced: ['fighter', 'rogue', 'cleric'],
  brawlers: ['fighter', 'fighter', 'shaman'],
  stalkers: ['rogue', 'rogue', 'shaman'],
  wall: ['fighter', 'cleric', 'shaman'],
  spellbinders: ['mage', 'mage', 'shaman'],
};
/**
 * how well a company is built (proposal §4): its kit against its level (rarity, how old, the smith's +), and how many of
 * its skill points it has spent (ranks: the share of what its level has earned).
 */
export const GRADES = {
  green:    { name: 'Green',    rarity: 'common', old: 2, up: 0, ranks: 0,    marks: 2, rating: 1000 },
  steady:   { name: 'Steady',   rarity: 'common', old: 0, up: 0, ranks: 0.25, marks: 3, rating: 1150 },
  seasoned: { name: 'Seasoned', rarity: 'common', old: 0, up: 1, ranks: 0.5,  marks: 4, rating: 1300 },
  hardened: { name: 'Hardened', rarity: 'fine',   old: 0, up: 1, ranks: 0.75, marks: 5, rating: 1450 },
  champion: { name: 'Champion', rarity: 'fine',   old: 0, up: 2, ranks: 1,    marks: 6, rating: 1600 },
};
export const GRADE_IDS = /** @type {(keyof typeof GRADES)[]} */ (Object.keys(GRADES));
/** every class trial done: a rival company has its tier skills (the contract's assumption for the party, too) */
export const ALL_TRIALS = Object.freeze({ fighter: 1, rogue: 1, mage: 1, cleric: 1, shaman: 1, fighter12: 1, rogue12: 1, mage12: 1, cleric12: 1, shaman12: 1 });

/**
 * one rival: a member of the class at the level, its kit by grade, its points spent (attributes on its class's build,
 * skill ranks round its loadout, the share its grade spends), on its manner's stance
 * @param {{ id: string, name: string, cls: string, level: number, grade: string, manner?: string, bow?: boolean, actor?: string, appearance?: any }} o
 */
export function makeRival({ id, name, cls, level, grade, manner = 'balanced', bow = false, actor, appearance }) {
  const G = GRADES[grade] || GRADES.steady, M = MANNERS[manner] || MANNERS.balanced, lv = Math.max(1, Math.floor(level));
  const m = /** @type {any} */ (makeMember(id, name, cls, lv));
  if (actor) m.actor = actor;
  m.appearance = appearance || drawAppearance(0xb0e1, id);           // (a face of its own, the same every bout)
  m.stance = M.stance; m.trials = ALL_TRIALS; m.perks = []; m.manner = manner; m.grade = grade;
  const ilv = Math.max(1, lv - G.old);
  for (const [slot, it] of Object.entries(m.gear)) {
    if (!it) continue;
    const base = slot === 'weapon' && cls === 'rogue' && bow ? 'huntbow' : it.base;
    const n = makeItem(base, ilv, G.rarity, { uid: `${id}:${slot}` }); if (G.up) n.up = G.up;
    m.gear[slot] = n;
  }
  if (m.gear.weapon && isTwoHanded(m.gear.weapon)) m.gear.off = null;
  // skill ranks: its grade's share of the points its level has earned, round its first four (what it takes in), cheapest
  // rank first, so a company's skills come up together
  let pts = Math.floor(skillPointsEarned(m) * G.ranks);
  const take = skillsOf(cls).filter((s) => unlocked(m, s, ALL_TRIALS)).slice(0, 4), sk = /** @type {Record<string, number>} */ ({});
  for (let r = 2; r <= MAX_RANK && pts > 0; r++) for (const s of take) { if (pts <= 0) break; sk[s.id] = r; pts--; }
  m.skills = sk;
  return m;
}

/**
 * a company of the roster (or a manner's make-up, for the harness), at a level and a grade: three rivals. Their names are
 * content's (the UI's); here each is its company's id and place.
 * @param {string | { id: string, manner: string }} def a roster id, or { id, manner }
 * @param {number} level @param {string} grade
 */
export function makeCompany(def, level, grade) {
  const id = typeof def === 'string' ? def : def.id, row = typeof def === 'string' ? ROSTER[def] : null;
  const manner = row ? row[0] : /** @type {any} */ (def).manner, M = MANNERS[manner] || MANNERS.balanced;
  const toks = row ? row.slice(1) : MAKEUP[manner] || MAKEUP.balanced;
  let rogues = 0;
  return toks.map((t, i) => {
    const [cls, ...o] = t.split(':'), bow = o.includes('bow') || (!row && !!M.bow && cls === 'rogue' && rogues++ === 1);   // (the harness's Stalkers: their second rogue a bow)
    return makeRival({ id: `${id}:${i}`, name: `${id}:${i}`, cls, level, grade, manner, bow, actor: o.includes('barbarian') ? 'hero_barbarian' : undefined });
  });
}
