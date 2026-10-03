// @ts-check
// attributes.js — the four attributes and stat points (GDD §4.1). Pure data and formulas;
// party.js folds them into statsFor, heroes.js owns the commands.
//
// Every level-up grants POINTS_PER_LEVEL points. Unspent points are never stored: they are
// derived (earned by level − spent), so a save can't carry points the sim didn't grant.
//
// Balance contract: each class has a recommended build (BUILD, one level's three points),
// and a class's automatic growth per level is its class-table growth MINUS what that build
// adds (recommendedGrowth). So a member on the recommended build has exactly the class-table
// HP / MP / ATK / DEF at every level, and the balance harness stays valid. Finesse's CRIT /
// DODGE and Focus's MP regen / ability power are the build's own edge on top.

export const ATTRS = /** @type {const} */ (['might', 'grit', 'finesse', 'focus']);
export const ATTR_LABEL = { might: 'Might', grit: 'Grit', finesse: 'Finesse', focus: 'Focus' };
export const ATTR_TEXT = {
  might: '+0.4 ATK', grit: '+3.5 HP, +0.3 DEF', finesse: '+0.25 % CRIT, +0.2 % DODGE', focus: '+2.5 MP, +0.03 MP/s, +0.5 % ability power',
};
/** what one point adds */
export const PER_POINT = {
  might: { atk: 0.4 },
  grit: { hp: 3.5, def: 0.3 },
  finesse: { crit: 0.25, dodge: 0.2 },
  focus: { mp: 2.5, mpr: 0.03, power: 0.005 },
};
export const POINTS_PER_LEVEL = 3;
/** the recommended build: where one level's three points go, in order (auto-allocation cycles it) */
export const BUILD = {
  fighter: ['grit', 'might', 'grit'],
  rogue: ['might', 'finesse', 'grit'],
  mage: ['focus', 'might', 'focus'],
  cleric: ['grit', 'focus', 'grit'],
  shaman: ['focus', 'grit', 'might'],
};

/** @param {any} m @returns {Record<string, number>} */
export const attrsOf = (m) => ({ might: 0, grit: 0, finesse: 0, focus: 0, ...(m.attrs || {}) });
/** @param {any} m */
export const pointsSpent = (m) => { const a = attrsOf(m); return a.might + a.grit + a.finesse + a.focus; };
/** @param {any} m */
export const pointsEarned = (m) => POINTS_PER_LEVEL * Math.max(0, (m.level || 1) - 1);
/** @param {any} m */
export const pendingPoints = (m) => Math.max(0, pointsEarned(m) - pointsSpent(m));

/** what a member's attributes add @param {any} m */
export function attrStats(m) {
  const a = attrsOf(m), s = { hp: 0, mp: 0, atk: 0, def: 0, crit: 0, dodge: 0, mpr: 0, power: 0 };
  for (const k of ATTRS) for (const [stat, v] of Object.entries(PER_POINT[k])) s[stat] += v * a[k];
  return s;
}
/** per level, what the class's recommended build adds (subtracted from the class growth) @param {string} cls */
export function recommendedGrowth(cls) {
  const s = { hp: 0, mp: 0, atk: 0, def: 0 };
  for (const k of BUILD[cls] || []) for (const [stat, v] of Object.entries(PER_POINT[k])) if (stat in s) s[stat] += v;
  return s;
}
/** spend every pending point on the class build (companions, and anyone on Auto). Deterministic:
 * the build cycles from however many points are already spent. @param {any} m */
export function autoAllocate(m) {
  const a = attrsOf(m), build = BUILD[m.cls] || BUILD.fighter;
  let n = pendingPoints(m), k = pointsSpent(m);
  if (!n) return false;
  while (n-- > 0) { a[build[k % build.length]] += 1; k++; }
  m.attrs = a;
  return true;
}
