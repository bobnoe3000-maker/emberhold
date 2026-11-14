// @ts-check
// raid.js — Raids (GDD §18 v1.97; docs/party-up-raids-proposal.md, the owner's decisions 2026-11-14). A raid is one of
// the band dungeons run with an end by three main heroes, no companions: each room holds RAID.waves waves and is then
// won, quiet for the run; the gate before a floor's hall drops when the room before it is won; the band's boss, in the
// last floor's hall, ends it. It pays better than the farm (RAID_DROP, the XP and gold below, a coffer at the end)
// and a hero sets out on three a day.
//
// Stage 1 (the owner: "start with what we have"): offline, the two other seats filled by stand-ins, AI heroes built as
// the Bowl's rivals are (rivals.js makeRival), named from a list of made-up players until real players take their seats.
// They follow the hero and fight on their own, as companions do. What they find is never the player's; what the hero
// finds is rolled for the hero's class alone.
//
// This module is the rules and the record: what a hero may set out on, the stand-ins, the coffer. Pure functions of
// the state and the seed; the run itself (rooms won, the gates, the end) is core.js's and battle.js's, runtime only:
// a save made in a raid is the world the hero set out from (core.js snapshot), so a reload ends the run.
//
// The owner's decisions (2026-11-14): three a hero a day; spent on setting out; the dungeons as they are (the farm's
// levels); no penalty for a loss (no gold lost, not Weakened, nobody Fallen); "Raid" is the word.

import { mulberry32, streamSeed } from './rng.js';
import { SITES, siteOf, siteOpen, bandTop, bossAt } from './sites.js';
import { BOSSES } from './battle.js';
import { HEIRLOOMS } from './items.js';
import { makeRival } from './rivals.js';
import { drawAppearance } from './appearance.js';
import { DAY_S } from './heroes.js';

export const RAID = {
  perDay: 3,            // raids a hero sets out on in a game day (the owner: "3 per hero")
  waves: 6,             // a room is won after this many waves held
  tide: { step: 0.1, cap: 0.5 },   // a raid room's climb: +10 % a wave, +50 % at the sixth
  xp: 1.25, gold: 1.25, // a kill's XP and gold in a raid
  cofferGold: 50,       // × the band's top level
  cofferCinders: 10,
  coffer: { heirloom: 0.03, rare: 0.27 },   // the rest Fine
  dry: 0.05,            // each coffer without a Rare adds this to the next one's Rare
  grade: 'seasoned',    // the stand-ins' kit and skills (rivals.js GRADES)
  minLevel: 1,
};
export const RAID_CLASSES = ['fighter', 'rogue', 'mage', 'cleric', 'shaman'];
const HEALERS = new Set(['cleric', 'shaman']);
// made-up players for the stand-ins' seats (stage 1), as the Bowl's board names made-up players (content/arena.json)
export const STANDIN_NAMES = ['Kestrel Vane', 'old_maddox', 'Tamsin Holt', 'Wenna Coyle', 'Brannoc77', 'Isolde Marsh', 'Ada Fenn',
  'Pell Harrow', 'quietpike', 'Mira Stokes', 'Jory Teal', 'Hesk', 'Bramble', 'Odo Crane', 'Linnet', 'Sable Wick', 'Corvin Ash',
  'Nell Barrow', 'fenrunner', 'Tobias Reed', 'Greta Holm', 'Ulric', 'Saffi Lane', 'Wat Tyler'];

/** a fresh record: the game day it counts, raids set out that day, all-time set out (the coffers' and stand-ins' draws), coffers since a Rare, won */
export const freshRaid = () => ({ day: -1, used: 0, n: 0, dry: 0, won: 0 });
/** a saved record, made whole (v47 and older: none) @param {any} r */
export function restoreRaid(r) {
  const f = freshRaid(), n = (v, lo = 0) => (Number.isFinite(v) && v >= lo ? Math.floor(v) : null);
  if (!r || typeof r !== 'object') return f;
  return { day: n(r.day, -1) ?? f.day, used: Math.min(RAID.perDay, n(r.used) ?? 0), n: n(r.n) ?? 0, dry: n(r.dry) ?? 0, won: n(r.won) ?? 0 };
}
/** the record, rolled over to today (a new game day: three again) @param {any} state */
export function raidOf(state) {
  const r = state.raid || (state.raid = freshRaid()), d = Math.floor(state.t / DAY_S);
  if (r.day !== d) { r.day = d; r.used = 0; }
  return r;
}
/** raids left today @param {any} state */
export const raidsLeft = (state) => RAID.perDay - raidOf(state).used;

/** the dungeons a raid can go to: the band dungeons (sites.js `band`), in band order */
export const RAID_SITES = Object.keys(SITES).filter((id) => SITES[id].band).sort((a, b) => SITES[a].base - SITES[b].base);

/**
 * each band dungeon, and whether this hero can raid it now: its land open, the way in found, the hero's level reaching
 * its base (the owner: "the dungeon as is": its own levels)
 * @param {any} state @param {(region: string) => boolean} landOpen
 */
export function raidSites(state, landOpen) {
  const H = state.party[0];
  return RAID_SITES.map((id) => {
    const s = SITES[id], top = bandTop(s), last = bossAt(id, s.floors - 1);
    const why = !landOpen(s.region) ? 'land' : !siteOpen(id, state.revealed) ? 'shut' : H.level < s.base ? 'level' : '';
    return { id, name: s.name, region: s.region, base: s.base, top, floors: s.floors, boss: last, bossName: last && BOSSES[last] ? BOSSES[last].name : '', ok: !why, why };
  });
}

/**
 * the two stand-ins for a raid: the classes asked for each open seat ('any' or one of RAID_CLASSES), an 'any' made
 * to round the three out (a healer if none, then a front line, then a striker), at the hero's level, kit and skills
 * by RAID.grade; each a name from STANDIN_NAMES and a face of its own. A pure function of the seed and the raid's number.
 * @param {number} seed @param {number} n the raid's number (raid.n) @param {any} hero @param {string[]} seats
 */
export function standIns(seed, n, hero, seats) {
  const rng = mulberry32(streamSeed((seed ^ Math.imul(n + 1, 0x9e3779b1)) >>> 0, 0x2a1d));
  const want = [0, 1].map((i) => (RAID_CLASSES.includes(seats[i]) ? seats[i] : 'any'));
  const have = [hero.cls, ...want.filter((c) => c !== 'any')];
  const cls = want.map((c) => {
    if (c !== 'any') return c;
    const pick = !have.some((x) => HEALERS.has(x)) ? (rng() < 0.6 ? 'cleric' : 'shaman') : !have.includes('fighter') ? 'fighter' : rng() < 0.5 ? 'rogue' : 'mage';
    have.push(pick); return pick;
  });
  const taken = new Set([hero.name]);
  return cls.map((c, i) => {
    let name = STANDIN_NAMES[Math.floor(rng() * STANDIN_NAMES.length)];
    for (let k = 0; taken.has(name) && k < STANDIN_NAMES.length; k++) name = STANDIN_NAMES[(STANDIN_NAMES.indexOf(name) + 1) % STANDIN_NAMES.length];
    taken.add(name);
    const id = `raid${n}:${i}`, m = /** @type {any} */ (makeRival({ id, name, cls: c, level: hero.level, grade: RAID.grade, manner: 'balanced', appearance: drawAppearance(0x2a1d, id) }));
    m.standin = true; m.rival = false;
    return m;
  });
}

/**
 * the coffer at a won raid's end, the hero's: gold (RAID.cofferGold × the band's top), cinders, and one piece for the
 * hero's class: an heirloom of the dungeon's own bosses the company doesn't already hold (RAID.coffer.heirloom), a Rare
 * (RAID.coffer.rare, + RAID.dry for each coffer since the last Rare), else a Fine. Rolled on its own stream from the
 * raid's number, so a reload can't fish it.
 * @param {number} seed @param {number} n @param {string} site @param {number} dry @param {(name: string) => boolean} holds
 * @returns {{ gold: number, cinders: number, ilv: number, rarity: 'fine' | 'rare' | 'heirloom', heirloom: string | null }}
 */
export function cofferOf(seed, n, site, dry, holds) {
  const s = siteOf(site), top = bandTop(s), rng = mulberry32(streamSeed((seed ^ Math.imul(n + 1, 0x85ebca6b)) >>> 0, 0xc0ff));
  const q = rng(), own = Object.values(s.bosses || {}).map((b) => BOSSES[b] && BOSSES[b].heirloom).filter((h) => h && HEIRLOOMS[h] && !holds(HEIRLOOMS[h].name));
  const heirloom = q < RAID.coffer.heirloom && own.length ? own[Math.floor(rng() * own.length)] : null;
  const rarity = heirloom ? 'heirloom' : q < RAID.coffer.heirloom + RAID.coffer.rare + RAID.dry * dry ? 'rare' : 'fine';
  return { gold: RAID.cofferGold * top, cinders: RAID.cofferCinders, ilv: top, rarity, heirloom };
}
