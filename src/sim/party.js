// party.js — the party: you plus up to two hired companions (GDD §5–§6). Pure data
// and formulas; core.js owns the state and the hire/dismiss commands.
//
// Stats follow the GDD class tables: base at level 1 + growth per level. HP and XP
// are the only mutable numbers for now (combat will move them).

import { mulberry32, streamSeed } from './rng.js';

export const CLASSES = {
  fighter: { label: 'Fighter', abbr: 'FTR', hp: [140, 14], mp: [20, 2], atk: [12, 2.0], def: [14, 2.0], crit: 5, dodge: 5, hpr: 2.0, mpr: 0.5, actor: 'hero_barbarian' },
  rogue:   { label: 'Rogue',   abbr: 'ROG', hp: [100, 10], mp: [30, 3], atk: [13, 2.2], def: [8, 1.2],  crit: 15, dodge: 15, hpr: 1.2, mpr: 0.8, actor: 'hero_rogue' },
  mage:    { label: 'Mage',    abbr: 'MAG', hp: [80, 8],   mp: [80, 8], atk: [14, 2.4], def: [6, 0.8],  crit: 8, dodge: 5, hpr: 0.8, mpr: 2.0, actor: 'hero_mage' },
};
export const MAX_COMPANIONS = 2;
export const xpToNext = (lv) => Math.round(100 * Math.pow(lv, 1.6));

export function statsFor(m) {
  const c = CLASSES[m.cls], L = m.level - 1, r1 = (v) => Math.round(v * 10) / 10;
  return {
    maxHp: Math.round(c.hp[0] + c.hp[1] * L), maxMp: Math.round(c.mp[0] + c.mp[1] * L),
    atk: r1(c.atk[0] + c.atk[1] * L), def: r1(c.def[0] + c.def[1] * L), crit: c.crit, dodge: c.dodge,
  };
}
export function makeMember(id, name, cls, level = 1, trait = null) {
  const m = { id, name, cls, level, xp: 0, trait, hp: 0 };
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
