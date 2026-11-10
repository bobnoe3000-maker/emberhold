// @ts-check
// looks.js — a member's look for the world (GDD §6.1 v1.65): their appearance and what they have equipped (weapon, off-hand, helm:
// base, rarity and the smith's +N, tools/actor-lab/gear.js), and a short key for it, made again only when it changes (a
// restyle, an item put on), so the world builds a figure a look and keeps it
/** @type {WeakMap<object, { j: string, a: any, k: string }>} */
const looks = new WeakMap();
const worn = (it) => (it ? { base: it.base, r: it.r || 'common', up: it.up || 0 } : null);
/** @param {any} m @returns {{ a: any, k: string } | null} */
export function lookOf(m) {
  if (!m || !m.gear || !m.cls) return null;                 // (a company member's: a foe is drawn with its unit too, and is as built)
  const g = m.gear, a = { appearance: m.appearance || null, gear: { weapon: worn(g.weapon), off: worn(g.off), helm: worn(g.helm) } };
  const j = JSON.stringify(a), c = looks.get(m); if (c && c.j === j) return c;
  let h = 0x811c9dc5; for (let i = 0; i < j.length; i++) h = Math.imul(h ^ j.charCodeAt(i), 0x01000193);
  const o = { j, a, k: (h >>> 0).toString(36) }; looks.set(m, o); return o;
}
