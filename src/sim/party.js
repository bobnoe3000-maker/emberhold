// party.js — the party: your main character plus two companions (GDD §5–§6.1). Pure data
// and formulas; heroes.js owns the commands (creation, points, skills, bench, temple, inn).
//
// Stats follow the GDD class tables: base at level 1 + automatic growth per level + the
// four attributes (attributes.js) + the six gear slots (items.js), then the origin's edge,
// the stance, the level-20 passive and Weakened (after a wipe) on top.

import { mulberry32, streamSeed } from './rng.js';
import { gearStats, starterKit, kitGrowth, BASES } from './items.js';
import { attrStats, recommendedGrowth, autoAllocate } from './attributes.js';
import { STANCE_MOD, stanceOf, hasPassive } from './skills.js';
import { has, STAT, rollSellsword } from './companions.js';

// Level-1 values here are the GDD table MINUS the class's level-1 starting kit (items.js
// STARTER), so a fresh character in their kit has exactly the GDD numbers; beyond that,
// power comes from levels and from gear found.
export const CLASSES = {
  fighter: { label: 'Fighter', abbr: 'FTR', hp: [129, 14], mp: [20, 2], atk: [11, 2.0], def: [10, 2.0], crit: 4, dodge: 5, hpr: 2.0, mpr: 0.5, actor: 'hero_barbarian' },
  rogue:   { label: 'Rogue',   abbr: 'ROG', hp: [100, 10], mp: [30, 3], atk: [11, 2.2], def: [5, 1.2],  crit: 14, dodge: 11, hpr: 1.2, mpr: 0.8, actor: 'hero_rogue' },
  mage:    { label: 'Mage',    abbr: 'MAG', hp: [80, 8],   mp: [63, 8], atk: [12, 2.4], def: [3, 0.8],  crit: 8, dodge: 5, hpr: 0.8, mpr: 1.9, actor: 'hero_mage' },
  cleric:  { label: 'Cleric',  abbr: 'CLR', hp: [118, 12], mp: [47, 5], atk: [10, 1.8], def: [8, 1.8],  crit: 5, dodge: 5, hpr: 1.6, mpr: 1.5, actor: 'hero_cleric' },
  // (v1.19) the hedge-callers' shaman: a ranged support who drains a foe a breath at a time
  shaman:  { label: 'Shaman',  abbr: 'SHM', hp: [94, 9.5], mp: [50, 6], atk: [10.5, 2.0], def: [5, 1.2], crit: 6, dodge: 6, hpr: 1.3, mpr: 1.6, actor: 'hero_shaman' },
};
// Class bonuses (GDD §5), on top of the class table: the fighter's shield (+10 % DEF while one
// is carried) is here; the rogue's backstab crits, the mage's clusters and the cleric's
// stronger heals are battle rules (battle.js).
export const SHIELD_DEF = 1.1;
const hasShield = (m) => { const off = m.gear && m.gear.off; return !!off && BASES[off.base] && BASES[off.base].kind === 'shield'; };
export const MAX_COMPANIONS = 2;
// XP to the next level (GDD §7 v1.38; the owner, 2026-10-05: "Much slower level progression"): each level takes 15 %
// longer to fight through than the one before, from 20 minutes for level 1 → 2: T(L) = 20 × 1.15^(L − 1) minutes of
// fighting rooms of your own level, at xpRate (what the right party earns a minute each there, measured). So the
// table is T(L) × xpRate(L), rounded to three figures: level 10 in ~6 h of fighting, 15 in ~14 h, 20 in ~29 h, 30 in
// ~126 h. (v27: from level 10 smaller by what the rate fell when the wave stopped growing; the minutes are the same.) (It was 300 × L^1.6: level 30 in ~8 h.) A fixed integer table: Math.pow is engine-approximated, and the curve
// must replay bit-for-bit on the server (detmath.js).
const XP_TABLE = [
  1730, 4040, 7080, 11000, 16100, 22500, 30700, 40900, 53700, 62700,
  75100, 95500, 121000, 151000, 189000, 235000, 291000, 359000, 441000, 540000,
  661000, 806000, 980000, 1190000, 1440000, 1750000, 2110000, 2540000, 3060000, 3690000,
  4430000, 5310000, 6370000, 7630000, 9120000, 10900000, 13000000, 15500000, 18500000, 22100000,
  26300000, 31300000, 37200000, 44100000, 52400000, 62200000, 73800000, 87500000, 104000000, 123000000,
  145000000, 172000000, 203000000, 240000000, 284000000, 335000000, 396000000, 467000000, 551000000, 649000000,
];
/** XP a minute each, the right party (fighter, rogue, cleric, kit at level) in a room of its own level, while fighting:
 * measured 2026-10-05 (L2 132, L4 354, L6 555, L9 862, L12 1219, L15 1569), fit 85 L + 1.4 L². From level 10 the wave
 * stopped growing at 5 foes (battle.js waveSize, GDD §7.1 v1.42) and the rate fell by a measured 0.89 at 10 and
 * 0.80–0.85 from 11 (three seeds, the same harness either side): × 0.9 at 10, × 0.84 from 11, so a level still takes
 * T(L) minutes. Priced against this: the XP table, and the bench's expeditions. @param {number} lv */
export const xpRate = (lv) => (85 * lv + 1.4 * lv * lv) * (lv <= 9 ? 1 : lv === 10 ? 0.9 : 0.84);
export const xpToNext = (lv) => XP_TABLE[Math.max(1, Math.min(XP_TABLE.length, lv)) - 1];
/** a share of a level in XP, at a level (GDD §9 v1.39: what quests, the board and the Chronicle pay) @param {number} lv @param {number} share */
export const levelShare = (lv, share) => Math.round(xpToNext(lv) * share);

// Weakened (a wipe, GDD §3.6): −10 % to max HP / MP, ATK and DEF until an inn rest or 10 minutes
export const WEAK = 0.9;

// class + level + attributes, plus what the gear adds (items.js). `gear` is that share on its
// own (the character sheet shows it in green), `attr` the attributes' share; hpr / mpr are HP /
// MP per second, the class rate growing with the pool (GDD §4) plus gear regen. `power` is the
// ability-power bonus (Focus).
export function statsFor(m) {
  const c = CLASSES[m.cls], L = m.level - 1, r1 = (v) => Math.round(v * 10) / 10, g = gearStats(m), a = attrStats(m), kg = kitGrowth(m.cls);
  const rg0 = recommendedGrowth(m.cls), rg = { hp: rg0.hp + kg.hp, mp: rg0.mp + kg.mp, atk: rg0.atk + kg.atk, def: rg0.def + kg.def };   // attributes and the kit's extra growth carry the rest
  const baseHp = c.hp[0] + (c.hp[1] - rg.hp) * L + a.hp, baseMp = c.mp[0] + (c.mp[1] - rg.mp) * L + a.mp;
  const st = STANCE_MOD[stanceOf(m)], weak = m.weakUntil > 0 ? WEAK : 1, passive = hasPassive(m);
  const edge = m.origin === 'redhand_deserter' ? 1 : 0;                       // origins.js: +1 ATK
  // a sellsword's own perks (companions.js; dark while it's owed wages); the company's are fought out in battle.js
  const reck = has(m, 'reckless'), pk = (id, v) => (has(m, id) ? v : 1);
  const atk = (c.atk[0] + (c.atk[1] - rg.atk) * L + a.atk + edge + g.atk) * st.atk * weak * (reck ? STAT.reckless[0] : 1);
  const def = (c.def[0] + (c.def[1] - rg.def) * L + a.def + g.def) * st.def * weak * (passive && m.cls === 'fighter' ? 1.1 : 1)   // Iron Hide
    * (m.cls === 'fighter' && hasShield(m) ? SHIELD_DEF : 1) * pk('stubborn', STAT.stubborn) * (reck ? STAT.reckless[1] : 1);     // the fighter's shield
  const mpr = (c.mpr * (baseMp / c.mp[0]) + a.mpr + g.mpr) * (passive && m.cls === 'mage' ? 1.25 : 1);                              // Kindled Mind
  return {
    maxHp: Math.round((baseHp + g.hp) * weak * pk('hardy', STAT.hardy)), maxMp: Math.round((baseMp + g.mp) * weak), atk: r1(atk), def: r1(def),
    crit: Math.min(60, r1(c.crit + a.crit + g.crit + (has(m, 'keen_eyed') ? STAT.keen_eyed : 0))), dodge: Math.max(0, Math.min(50, r1(c.dodge + a.dodge + g.dodge + (has(m, 'light_footed') ? STAT.light_footed : 0)))),
    hpr: r1((c.hpr * (baseHp / c.hp[0]) + g.hpr) * pk('iron_lunged', STAT.iron_lunged)), mpr: r1(mpr), power: a.power, gear: g, attr: a,
  };
}
export function makeMember(id, name, cls, level = 1, trait = null) {
  const m = { id, name, cls, level, xp: 0, trait, hp: 0, autoAttrs: true };
  autoAllocate(m);                                         // companions spend their points on the class build
  m.gear = starterKit(m);                                  // Common kit at their level: what the model already wears
  m.hp = statsFor(m).maxHp;
  return m;
}

// ── the main character (GDD §6.1, development plan §2.3) ────────────────────
// Looks are baked atlases (assets/actors); the first is the class default.
export const LOOKS = { fighter: ['hero_knight', 'hero_barbarian'], rogue: ['hero_rogue'], mage: ['hero_mage'], cleric: ['hero_cleric'], shaman: ['hero_shaman'] };
export const LOOK_LABEL = { hero_knight: 'Knight', hero_barbarian: 'Barbarian', hero_rogue: 'Rogue', hero_mage: 'Mage', hero_cleric: 'Grey Sister’s cleric', hero_shaman: 'Hedge-caller' };
// Origins: content/origins.json holds the text; the ids and their rule edges live here, and a
// test keeps the two in step (the sim can't read JSON files, and must not trust the client's).
export const ORIGINS = ['thornwick_born', 'redhand_deserter', 'grey_sisters_ward', 'deepdelver_fostered'];
export const ORIGIN_EDGE = {
  thornwick_born: { kind: 'tavernHirelings', value: 1 },
  redhand_deserter: { kind: 'atk', value: 1 },
  grey_sisters_ward: { kind: 'loreXp', value: 0.2 },
  deepdelver_fostered: { kind: 'smithDiscount', value: 0.1 },
};
export const NAME_MAX = 16;
// A typed name, made safe: Latin letters (with accents), hyphen and single spaces, 1–16
// characters. No apostrophes (world doc §11: none in the middle of names). Explicit ranges, not \p{L}: Unicode tables differ between engines, and the
// replay must not.
export function cleanName(name) {
  return String(name ?? '').replace(/[^A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u024F -]/g, '').replace(/\s+/g, ' ').trim().slice(0, NAME_MAX).trim();
}
// The main character. The defaults are the pre-creation knight (previews and old saves).
/** @param {{ cls?: string, look?: string, origin?: string|null, name?: string }} [o] */
export function makeHero({ cls = 'fighter', look, origin = null, name = 'Aldric' } = {}) {
  const m = { ...makeMember('you', name, cls), actor: look || LOOKS[cls][0], main: true, autoAttrs: false, origin };
  m.hp = statsFor(m).maxHp;
  return m;
}

// (Brannoc was a fighter's name here; he's a found companion now, M5, and there's only one of him)
const NAMES = {
  fighter: ['Garruk', 'Dunstan', 'Hild', 'Torvald', 'Maera', 'Osric'],
  rogue: ['Pell', 'Osk', 'Tamsin', 'Lark', 'Vesna', 'Quill'],   // (Wren is the Fens' found companion now: world doc v1.29)
  mage: ['Sigrun', 'Ilsabet', 'Corwin', 'Aveline', 'Merrow', 'Thane'],
  cleric: ['Maren', 'Aldous', 'Wenna', 'Cuthbert', 'Edda', 'Rowan'],
  shaman: ['Gammer Rook', 'Tobin', 'Hesk', 'Old Mab', 'Wilber', 'Sedge'],
};
// No two in a company share a name (the owner, 2026-10-05: "I have 2 Tobins"): a name already taken goes to the next
// free one in its class's list after it, then any class's, then "the Younger". Deterministic: the same company and
// the same roster give the same names.
const ALL_NAMES = Object.values(NAMES).flat();
/** a name for a `cls` hireling not in `taken`: `want` if it's free @param {string} cls @param {string} want @param {Set<string>} taken */
export function freeName(cls, want, taken) {
  if (!taken.has(want)) return want;
  const own = NAMES[cls] || [], at = own.indexOf(want);
  for (let k = 1; k <= own.length; k++) { const n = own[(Math.max(0, at) + k) % own.length]; if (!taken.has(n)) return n; }
  for (const n of ALL_NAMES) if (!taken.has(n)) return n;
  for (let k = 2; ; k++) { const n = k === 2 ? `${want} the Younger` : `${want} ${k}`; if (!taken.has(n)) return n; }
}
/** a tavern's roster with names nobody in the company has (nor anyone earlier on the list); one already hired keeps the
 * name they joined with @param {any[]} list @param {any[]} company the party and the bench */
export function distinctNames(list, company) {
  const byId = new Map(company.map((m) => [m.id, m])), taken = new Set(company.map((m) => m.name));
  for (const c of list) {
    const was = byId.get(c.id);
    if (was) c.name = was.name; else { c.name = freeName(c.cls, c.name, taken); taken.add(c.name); }
  }
  return list;
}
/** a company's members, a later one with a name already taken renamed (save v24) @param {any[]} members in order: the party, then the bench */
export function dedupeNames(members) {
  const seen = new Set(), taken = new Set(members.map((m) => m.name));        // (a new name mustn't be one a later member has)
  for (const m of members) { if (seen.has(m.name) && !m.main) { m.name = freeName(m.cls, m.name, taken); taken.add(m.name); } seen.add(m.name); }
  return members;
}
// Today's sellswords at a town's tavern (GDD §6.2): one candidate per class, deterministic per
// (world seed, town, day, times you asked around), within ±1 of your level. A Thornwick-born hero
// sees one more. The order: fighter, rogue, mage, then that extra hireling, then the cleric, then (v1.19) the
// shaman, last, so every earlier sellsword's draws stand as they were. Each
// has a Lantern Guild rank and perks (companions.js), drawn on their own stream. (The tavern drew a
// trait here before the perks were real: the draw stays, so the names and levels are as they were.)
/** A new companion's level (GDD §6.2 v1.11, world doc §4 v1.12): half the hero's, rounded up. The Guild
 * keeps its seasoned members for companies it knows, so whoever you sign on learns the rest at your
 * side: a change of companion costs time as well as gold. @param {number} heroLevel */
export const hireLevel = (heroLevel) => Math.max(1, Math.ceil(heroLevel / 2));
export function tavernRoster(seed, region, day, heroLevel, extra = 0, ask = 0) {
  const rng = mulberry32(streamSeed(seed ^ (day * 7919) ^ Math.imul(ask, 104729), 6100 + region.length * 13 + region.charCodeAt(0)));
  const classes = ['fighter', 'rogue', 'mage'];
  for (let i = 0; i < extra; i++) classes.push(['fighter', 'rogue', 'mage'][i % 3]);
  classes.push('cleric', 'shaman');
  return classes.map((cls, i) => {
    const name = NAMES[cls][(rng() * NAMES[cls].length) | 0]; rng();
    // (the id as it always was for a day's first roster: same draw, same sellsword; battle.js also
    // reads it for a companion's place in the formation)
    rng();                                                  // (the old ±1 level's draw, kept: the same perks and names follow)
    const lv = hireLevel(heroLevel), id = ask ? `${region}-${day}.${ask}-${i}` : `${region}-${day}-${i}`;
    const m = makeMember(id, name, cls, lv);
    const { rank, perks, hidden } = rollSellsword(seed, id, cls);
    Object.assign(m, { rank, perks, hidden, bond: 0, owed: 0 }); m.hp = statsFor(m).maxHp;
    return m;
  });
}

// Add XP; level up as often as it carries (new points go straight onto the build for anyone
// on Auto). onLevel(m) fires per level gained.
export function gainXp(m, n, onLevel = () => {}) {
  m.xp += n;
  while (m.xp >= xpToNext(m.level)) {
    m.xp -= xpToNext(m.level); const before = statsFor(m).maxHp; m.level += 1;
    if (m.autoAttrs) autoAllocate(m);
    if (!m.fallen) m.hp += statsFor(m).maxHp - before;
    onLevel(m);
  }
}
