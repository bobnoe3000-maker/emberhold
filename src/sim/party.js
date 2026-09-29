// party.js — the party: your main character plus two companions (GDD §5–§6.1). Pure data
// and formulas; heroes.js owns the commands (creation, points, skills, bench, temple, inn).
//
// Stats follow the GDD class tables: base at level 1 + automatic growth per level + the
// four attributes (attributes.js) + the six gear slots (items.js), then the origin's edge,
// the stance, the level-20 passive and Weakened (after a wipe) on top.

import { mulberry32, streamSeed } from './rng.js';
import { gearStats, starterKit } from './items.js';
import { attrStats, recommendedGrowth, autoAllocate } from './attributes.js';
import { STANCE_MOD, stanceOf, hasPassive } from './skills.js';

// Level-1 values here are the GDD table MINUS the class's level-1 starting kit (items.js
// STARTER), so a fresh character in their kit has exactly the GDD numbers; beyond that,
// power comes from levels and from gear found.
export const CLASSES = {
  fighter: { label: 'Fighter', abbr: 'FTR', hp: [129, 14], mp: [20, 2], atk: [11, 2.0], def: [10, 2.0], crit: 4, dodge: 5, hpr: 2.0, mpr: 0.5, actor: 'hero_barbarian' },
  rogue:   { label: 'Rogue',   abbr: 'ROG', hp: [100, 10], mp: [30, 3], atk: [11, 2.2], def: [5, 1.2],  crit: 14, dodge: 11, hpr: 1.2, mpr: 0.8, actor: 'hero_rogue' },
  mage:    { label: 'Mage',    abbr: 'MAG', hp: [80, 8],   mp: [63, 8], atk: [12, 2.4], def: [3, 0.8],  crit: 8, dodge: 5, hpr: 0.8, mpr: 1.9, actor: 'hero_mage' },
};
export const MAX_COMPANIONS = 2;
// XP to the next level = round(100 × L^1.6) (GDD §7), as a fixed integer table: Math.pow is
// engine-approximated and the curve must replay bit-for-bit on the server (detmath.js).
const XP_TABLE = [
  100, 303, 580, 919, 1313, 1758, 2250, 2786, 3363, 3981,
  4637, 5330, 6058, 6820, 7616, 8445, 9305, 10196, 11117, 12068,
  13048, 14056, 15093, 16156, 17247, 18364, 19507, 20675, 21869, 23088,
  24332, 25600, 26892, 28208, 29547, 30909, 32294, 33702, 35132, 36584,
  38059, 39555, 41072, 42611, 44171, 45752, 47354, 48976, 50619, 52282,
  53965, 55668, 57391, 59133, 60895, 62676, 64476, 66296, 68134, 69991,
];
export const xpToNext = (lv) => XP_TABLE[Math.max(1, Math.min(XP_TABLE.length, lv)) - 1];

// Weakened (a wipe, GDD §3.6): −10 % to max HP / MP, ATK and DEF until an inn rest or 10 minutes
export const WEAK = 0.9;

// class + level + attributes, plus what the gear adds (items.js). `gear` is that share on its
// own (the character sheet shows it in green), `attr` the attributes' share; hpr / mpr are HP /
// MP per second, the class rate growing with the pool (GDD §4) plus gear regen. `power` is the
// ability-power bonus (Focus).
export function statsFor(m) {
  const c = CLASSES[m.cls], L = m.level - 1, r1 = (v) => Math.round(v * 10) / 10, g = gearStats(m), a = attrStats(m), rg = recommendedGrowth(m.cls);
  const baseHp = c.hp[0] + (c.hp[1] - rg.hp) * L + a.hp, baseMp = c.mp[0] + (c.mp[1] - rg.mp) * L + a.mp;
  const st = STANCE_MOD[stanceOf(m)], weak = m.weakUntil > 0 ? WEAK : 1, passive = hasPassive(m);
  const edge = m.origin === 'redhand_deserter' ? 1 : 0;                       // origins.js: +1 ATK
  const atk = (c.atk[0] + (c.atk[1] - rg.atk) * L + a.atk + edge + g.atk) * st.atk * weak;
  const def = (c.def[0] + (c.def[1] - rg.def) * L + a.def + g.def) * st.def * weak * (passive && m.cls === 'fighter' ? 1.1 : 1);   // Iron Hide
  const mpr = (c.mpr * (baseMp / c.mp[0]) + a.mpr + g.mpr) * (passive && m.cls === 'mage' ? 1.25 : 1);                              // Kindled Mind
  return {
    maxHp: Math.round((baseHp + g.hp) * weak), maxMp: Math.round((baseMp + g.mp) * weak), atk: r1(atk), def: r1(def),
    crit: Math.min(60, r1(c.crit + a.crit + g.crit)), dodge: Math.max(0, Math.min(50, r1(c.dodge + a.dodge + g.dodge))),
    hpr: r1(c.hpr * (baseHp / c.hp[0]) + g.hpr), mpr: r1(mpr), power: a.power, gear: g, attr: a,
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
export const LOOKS = { fighter: ['hero_knight', 'hero_barbarian'], rogue: ['hero_rogue'], mage: ['hero_mage'] };
export const LOOK_LABEL = { hero_knight: 'Knight', hero_barbarian: 'Barbarian', hero_rogue: 'Rogue', hero_mage: 'Mage' };
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
// A typed name, made safe: Latin letters (with accents), apostrophe, hyphen and single spaces,
// 1–16 characters. Explicit ranges, not \p{L}: Unicode tables differ between engines, and the
// replay must not.
export function cleanName(name) {
  return String(name ?? '').replace(/[^A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u024F' -]/g, '').replace(/\s+/g, ' ').trim().slice(0, NAME_MAX).trim();
}
// The main character. The defaults are the pre-creation knight (previews and old saves).
/** @param {{ cls?: string, look?: string, origin?: string|null, name?: string }} [o] */
export function makeHero({ cls = 'fighter', look, origin = null, name = 'Aldric' } = {}) {
  const m = { ...makeMember('you', name, cls), actor: look || LOOKS[cls][0], main: true, autoAttrs: false, origin };
  m.hp = statsFor(m).maxHp;
  return m;
}

const NAMES = {
  fighter: ['Garruk', 'Brannoc', 'Hild', 'Torvald', 'Maera', 'Osric'],
  rogue: ['Wren', 'Osk', 'Tamsin', 'Lark', 'Vesna', 'Quill'],
  mage: ['Sigrun', 'Ilsabet', 'Corwin', 'Aveline', 'Merrow', 'Thane'],
};
const TRAITS = [['Stubborn', '+10% DEF'], ['Keen-eyed', '+3% CRIT'], ['Light-footed', '+3% DDG'], ['Hardy', '+10% HP'], ['Greedy', '+5% gold, costs more'], ['Devout', 'heals a little more']];

// Today's sellswords at a town's tavern: three candidates, one per class, deterministic
// per (world seed, town, day), within ±1 of your level. A Thornwick-born hero sees one more
// (drawn after the three, so theirs don't change).
export function tavernRoster(seed, region, day, heroLevel, extra = 0) {
  const rng = mulberry32(streamSeed(seed ^ (day * 7919), 6100 + region.length * 13 + region.charCodeAt(0)));
  const classes = ['fighter', 'rogue', 'mage'];
  for (let i = 0; i < extra; i++) classes.push(['fighter', 'rogue', 'mage'][i % 3]);
  return classes.map((cls, i) => {
    const name = NAMES[cls][(rng() * NAMES[cls].length) | 0], t = TRAITS[(rng() * TRAITS.length) | 0];
    const lv = Math.max(1, heroLevel + ((rng() * 3) | 0) - 1);
    return makeMember(`${region}-${day}-${i}`, name, cls, lv, t);
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
