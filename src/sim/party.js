// party.js — the party: you plus up to two hired companions (GDD §5–§6). Pure data
// and formulas; core.js owns the state and the hire/dismiss commands.
//
// Stats follow the GDD class tables: base at level 1 + growth per level, plus the six
// gear slots (items.js, GDD §8).

import { mulberry32, streamSeed } from './rng.js';
import { gearStats, starterKit } from './items.js';

// Level-1 values here are the GDD table MINUS the class's level-1 starting kit (items.js
// STARTER), so a fresh character in their kit has exactly the GDD numbers; beyond that,
// power comes from levels and from gear found.
export const CLASSES = {
  fighter: { label: 'Fighter', abbr: 'FTR', hp: [129, 14], mp: [20, 2], atk: [11, 2.0], def: [10, 2.0], crit: 4, dodge: 5, hpr: 2.0, mpr: 0.5, actor: 'hero_barbarian' },
  rogue:   { label: 'Rogue',   abbr: 'ROG', hp: [100, 10], mp: [30, 3], atk: [11, 2.2], def: [5, 1.2],  crit: 14, dodge: 11, hpr: 1.2, mpr: 0.8, actor: 'hero_rogue' },
  mage:    { label: 'Mage',    abbr: 'MAG', hp: [80, 8],   mp: [63, 8], atk: [12, 2.4], def: [3, 0.8],  crit: 8, dodge: 5, hpr: 0.8, mpr: 1.9, actor: 'hero_mage' },
};
export const MAX_COMPANIONS = 2;
export const xpToNext = (lv) => Math.round(100 * Math.pow(lv, 1.6));

// class + level, plus what the gear adds (items.js). `gear` is that share on its own (the
// character sheet shows it in green); hpr / mpr are HP / MP per second, the class rate
// growing with the pool (GDD §4) plus gear regen.
export function statsFor(m) {
  const c = CLASSES[m.cls], L = m.level - 1, r1 = (v) => Math.round(v * 10) / 10, g = gearStats(m);
  const baseHp = c.hp[0] + c.hp[1] * L, baseMp = c.mp[0] + c.mp[1] * L;
  const maxHp = Math.round(baseHp + g.hp), maxMp = Math.round(baseMp + g.mp);
  return {
    maxHp, maxMp, atk: r1(c.atk[0] + c.atk[1] * L + g.atk), def: r1(c.def[0] + c.def[1] * L + g.def),
    crit: Math.min(60, c.crit + g.crit), dodge: Math.max(0, Math.min(50, c.dodge + g.dodge)),
    hpr: r1(c.hpr * (baseHp / c.hp[0]) + g.hpr), mpr: r1(c.mpr * (baseMp / c.mp[0]) + g.mpr), gear: g,
  };
}
export function makeMember(id, name, cls, level = 1, trait = null) {
  const m = { id, name, cls, level, xp: 0, trait, hp: 0 };
  m.gear = starterKit(m);                                  // Common kit at their level: what the model already wears
  m.hp = statsFor(m).maxHp;
  return m;
}
// You: a fighter in the knight's kit (the class pick comes later — GDD §5).
export const makeHero = () => ({ ...makeMember('you', 'Aldric', 'fighter'), actor: 'hero_knight', main: true });

const NAMES = {
  fighter: ['Garruk', 'Brannoc', 'Hild', 'Torvald', 'Maera', 'Osric'],
  rogue: ['Wren', 'Osk', 'Tamsin', 'Lark', 'Vesna', 'Quill'],
  mage: ['Sigrun', 'Ilsabet', 'Corwin', 'Aveline', 'Merrow', 'Thane'],
};
const TRAITS = [['Stubborn', '+10% DEF'], ['Keen-eyed', '+3% CRIT'], ['Light-footed', '+3% DDG'], ['Hardy', '+10% HP'], ['Greedy', '+5% gold, costs more'], ['Devout', 'heals a little more']];

// Today's sellswords at a town's tavern: three candidates, one per class, deterministic
// per (world seed, town, day), within ±1 of your level.
export function tavernRoster(seed, region, day, heroLevel) {
  const rng = mulberry32(streamSeed(seed ^ (day * 7919), 6100 + region.length * 13 + region.charCodeAt(0)));
  return ['fighter', 'rogue', 'mage'].map((cls, i) => {
    const name = NAMES[cls][(rng() * NAMES[cls].length) | 0], t = TRAITS[(rng() * TRAITS.length) | 0];
    const lv = Math.max(1, heroLevel + ((rng() * 3) | 0) - 1);
    return makeMember(`${region}-${day}-${i}`, name, cls, lv, t);
  });
}
