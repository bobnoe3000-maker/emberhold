// @ts-check
// sites.js — the dungeon sites (M5, docs/m5-plan.md; world doc §3.1). A site is data: its name,
// its look (a level.js theme; null keeps the Old Barrows' seeded pick), its level band, how many
// floors it has, which enemy family holds it, how many rooms a floor has, and the boss waiting in
// a floor's stairs-down hall. The words shown for a site live in content/sites/<id>.json; the sim
// keeps its own table (it can't read JSON files) and a test keeps the two in step.
//
// A room's level: base + perFloor × floor + ⌊rank ÷ 2⌋ (rank: its walking order from the entrance,
// the stairs-down hall last), or `base` everywhere in a `flat` site. `floors` 0: no bottom (the Old
// Barrows go on down). A site's last floor has no stairs down; its hall is where it ends.
// `hidden` sites can't be entered, and don't show on the Vale, until revealed (state.revealed:
// a chapter's reward, or the Chronicle). A `vault` site keeps a chest in its last hall with an
// heirloom in it, once (items.js HEIRLOOMS; core.js, state.flags vault_<site>).

/** @typedef {{ name: string, theme: string | null, base: number, perFloor: number, floors: number, family: string, rooms: [number, number] | null, flat?: boolean, hidden?: boolean, bosses?: Record<number, string>, families?: string[], vault?: string, mix: number }} SiteDef */
/** @type {Record<string, SiteDef>} */
export const SITES = {
  barrows: { name: 'The Old Barrows', theme: null, base: 1, perFloor: 3, floors: 0, family: 'ashbound', rooms: null, bosses: { 3: 'standard' }, mix: 0 },
  tithe_mill: { name: 'The Tithe Mill', theme: 'desert', base: 1, perFloor: 0, floors: 1, family: 'redhand', rooms: [6, 6], mix: 0x3117 },
  wickham_keep: { name: 'Wickham Keep', theme: 'dread', base: 3, perFloor: 1, floors: 2, family: 'redhand', families: ['redhand', 'diggers'], rooms: [6, 6], hidden: true, bosses: { 2: 'redhand_captain' }, mix: 0x7e40 },
  sunken_chapel: { name: 'The Sunken Chapel', theme: 'poison', base: 5, perFloor: 1, floors: 2, family: 'chapel', rooms: [6, 6], bosses: { 2: 'robed_stranger' }, mix: 0xc4a9 },
  ninth_milestone: { name: 'The Ninth Milestone', theme: 'chasm', base: 8, perFloor: 0, floors: 1, family: 'ashbound', rooms: [4, 4], flat: true, hidden: true, vault: 'last_order', mix: 0x9e11 },
};
export const SITE_IDS = Object.keys(SITES);

/** @param {string | undefined | null} id */
export const siteOf = (id) => SITES[id || 'barrows'] || SITES.barrows;
/** is there a floor below this one? @param {string} id @param {number} depth (0 = the first floor) */
export const hasFloorBelow = (id, depth) => { const s = siteOf(id); return !s.floors || depth + 1 < s.floors; };
/** a room's level in this site @param {string} id @param {number} depth @param {number} rank */
export const roomLevelAt = (id, depth, rank) => { const s = siteOf(id); return s.flat ? s.base : s.base + s.perFloor * depth + Math.floor(rank / 2); };
/** the boss in this floor's stairs-down hall, if any @param {string} id @param {number} depth */
export const bossAt = (id, depth) => (siteOf(id).bosses || {})[depth + 1] || null;
/** a site's levels, for the compass ("LV 3–6") @param {string} id */
export function levelBand(id) {
  const s = siteOf(id);
  if (s.flat) return `${s.base}`;
  const top = s.floors ? s.base + s.perFloor * (s.floors - 1) + 2 : s.base + 3;
  return `${s.base}–${top}`;
}
/** can the party go in? (not hidden, or revealed) @param {string} id @param {Set<string> | string[]} revealed */
export const siteOpen = (id, revealed) => !!SITES[id] && (!SITES[id].hidden || (Array.isArray(revealed) ? revealed.includes(id) : revealed.has(id)));
