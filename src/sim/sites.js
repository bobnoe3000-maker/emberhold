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
// heirloom in it, once (items.js HEIRLOOMS; core.js, state.flags vault_<site>). `region`: the land whose overland
// has its way in (regions.js); entering a site's floors puts you in its land.
//
// The Greywater Fens (M8, docs/m8-plan.md slices 3–4; world doc v1.20 §3.2): five sites from 8 to 15, held by the
// Fens' own (battle.js FAMILIES reedmen, lockcult, harvest, drowned; the Locks' first floor the bound lock-men, the
// Ashbound). (M8.6) The Toadking holds the Mound's hall; the Abbey's three are Brother Teague's, the Drowned Choir's and
// the Abbess Below's (world doc v1.27); the Locks' and the Sickpools' halls fight as any other until Act II gives them one. The Drowned Abbey has three floors of four rooms, so its band stays 12–15.

/** @typedef {{ name: string, region: string, theme: string | null, base: number, perFloor: number, floors: number, family: string, rooms: [number, number] | null, flat?: boolean, hidden?: boolean, minLevel?: number, bosses?: Record<number, string>, families?: string[], vault?: string, mix: number }} SiteDef */
/** @type {Record<string, SiteDef>} */
export const SITES = {
  barrows: { name: 'The Old Barrows', region: 'vale', theme: null, base: 1, perFloor: 3, floors: 0, family: 'ashbound', rooms: null, bosses: { 3: 'standard' }, mix: 0 },
  tithe_mill: { name: 'The Tithe Mill', region: 'vale', theme: 'desert', base: 1, perFloor: 0, floors: 1, family: 'redhand', rooms: [6, 6], mix: 0x3117 },
  wickham_keep: { name: 'Wickham Keep', region: 'vale', theme: 'dread', base: 3, perFloor: 1, floors: 2, family: 'redhand', families: ['redhand', 'diggers'], rooms: [6, 6], hidden: true, bosses: { 2: 'redhand_captain' }, mix: 0x7e40 },
  sunken_chapel: { name: 'The Sunken Chapel', region: 'vale', theme: 'poison', base: 5, perFloor: 1, floors: 2, family: 'chapel', rooms: [6, 6], bosses: { 2: 'robed_stranger' }, mix: 0xc4a9 },
  scrag_warren: { name: 'The Scrag Warren', region: 'vale', theme: 'warren', base: 2, perFloor: 1, floors: 2, family: 'goblin', rooms: [6, 6], bosses: { 2: 'goblin_chief' }, mix: 0x6b1d },
  ninth_milestone: { name: 'The Ninth Milestone', region: 'vale', theme: 'chasm', base: 8, perFloor: 0, floors: 1, family: 'ashbound', rooms: [4, 4], flat: true, hidden: true, vault: 'last_order', mix: 0x9e11 },
  toadking_mound: { name: "Toadking's Mound", region: 'fens', theme: 'mire', base: 8, perFloor: 1, floors: 2, family: 'reedmen', rooms: [6, 6], bosses: { 2: 'toadking' }, mix: 0x70ad },
  canal_locks: { name: 'The Canal Locks', region: 'fens', theme: 'sluice', base: 9, perFloor: 1, floors: 2, family: 'lockcult', families: ['ashbound', 'lockcult'], rooms: [6, 6], mix: 0x10c5 },
  sickpools: { name: 'The Sickpools', region: 'fens', theme: 'poison', base: 10, perFloor: 1, floors: 2, family: 'harvest', rooms: [6, 6], mix: 0x51c7 },
  drowned_abbey: { name: 'The Drowned Abbey', region: 'fens', theme: 'water', base: 12, perFloor: 1, floors: 3, family: 'drowned', rooms: [4, 4], bosses: { 1: 'teague', 2: 'drowned_choir', 3: 'abbess_below' }, mix: 0xab3e },
  // the Mere Tower (tower.js; world doc v1.23): its landing and the stair hall, where the climb goes on; Wenna Pike's punt
  // from Saltmere's landing, from level 12 (minLevel: core.js turns a company under it back at the jetty)
  mere_tower: { name: 'The Mere Tower', region: 'fens', theme: 'dread', base: 12, perFloor: 0, floors: 1, family: 'ashbound', rooms: [2, 2], flat: true, minLevel: 12, mix: 0x3e7e },
  reedholm_undercroft: { name: 'The Reedholm Undercroft', region: 'fens', theme: 'chasm', base: 15, perFloor: 0, floors: 1, family: 'ashbound', rooms: [4, 4], flat: true, hidden: true, mix: 0x4e3d },
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
  const top = s.floors ? s.base + s.perFloor * (s.floors - 1) + Math.floor(((s.rooms ? s.rooms[1] : 6) - 2) / 2) : s.base + 3;   // (the hall is the last ranked room)
  return `${s.base}–${top}`;
}
/** can the party go in? (not hidden, or revealed) @param {string} id @param {Set<string> | string[]} revealed */
export const siteOpen = (id, revealed) => !!SITES[id] && (!SITES[id].hidden || (Array.isArray(revealed) ? revealed.includes(id) : revealed.has(id)));
