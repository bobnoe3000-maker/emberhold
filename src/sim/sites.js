// @ts-check
// sites.js — the dungeon sites (M5, docs/m5-plan.md; world doc §3.1). A site is data: its name,
// its look (a level.js theme; null keeps the Old Barrows' seeded pick), its level band, how many
// floors it has, which enemy family holds it, how many rooms a floor has, and the boss waiting in
// a floor's stairs-down hall. The words shown for a site live in content/sites/<id>.json; the sim
// keeps its own table (it can't read JSON files) and a test keeps the two in step.
//
// A room's level: in a `band` site (v1.48, below) its floor's level, or the band's base + perFloor × floor + ⌊rank ÷ 2⌋
// in an older one (rank: its walking order from the entrance, the stairs-down hall last), or `base` everywhere in a
// `flat` site. `floors` 0 would be no bottom (the Old Barrows went on down until v1.48; no site does now). A site's last
// floor has no stairs down; its hall is where it ends.
// `layout` (2026-10-10, docs/dungeon-halls-proposal.md): 'halls' for what was built (a mill, a keep, a chapel, the
// locks, an abbey, a tower, an undercroft): one building of rectangular rooms and short straight halls (halls.js);
// else the caverns (level.js), for what was dug or grew (the barrows, the warren, the mound, the pools).
// `hidden` sites can't be entered, and don't show on the Vale, until revealed (state.revealed:
// a chapter's reward, or the Chronicle). A `vault` site keeps a chest in its last hall with an
// heirloom in it, once (items.js HEIRLOOMS; core.js, state.flags vault_<site>). `region`: the land whose overland
// has its way in (regions.js); entering a site's floors puts you in its land.
//
// The Greywater Fens (M8, docs/m8-plan.md slices 3–4; world doc v1.20 §3.2), held by the Fens' own (battle.js FAMILIES
// reedmen, lockcult, harvest, drowned; the Locks' first floor the bound lock-men, the Ashbound). (M8.6) The Toadking holds
// the Mound's hall; the Abbey's three are Brother Teague's, the Drowned Choir's and the Abbess Below's (world doc v1.27);
// (v1.48) the Vatwarden holds Vat Seven, the Locks' third floor.
// One dungeon a level (v1.48, GDD §3, world doc v1.32; the owner: "not have more than 1 dungeon overlapping what levels
// to grind"). Every level a player grinds at belongs to exactly one dungeon, a `band` of three: three floors of a level
// each (floor n is base + n − 1), the two rooms before a floor's hall a level up (capped at the band's top), the hall at
// its floor's level with its boss. Emberfall runs 1–18 in six. A `secret` site (one a land, `hidden` until its Chronicle
// is whole, `flat` at the land's top level) seals for SECRET_REST of play once its vault is opened, then can be walked
// again (core.js). `parked` sites are out of play, kept for a land not built yet (the Reach): no way in, on no overland.
// `themes` / `families` give a floor its own look and foes (by depth); `dress` its dressing kit (world.js DRESS: the
// furniture, the pools, the light's tint), floor by floor.

/** @typedef {{ name: string, region: string, theme: string | null, base: number, perFloor: number, floors: number, family: string, rooms: [number, number] | null, layout?: 'caverns' | 'halls', flat?: boolean, hidden?: boolean, minLevel?: number, bosses?: Record<number, string>, families?: string[], themes?: string[], dress?: string[], vault?: string, band?: boolean, secret?: boolean, parked?: boolean, mix: number }} SiteDef */
/** @type {Record<string, SiteDef>} */
export const SITES = {
  // the Hollow Vale, 1–9: a crypt, a fort that goes down into a cave, a drowned chapel; the Ninth Milestone its secret
  barrows: { name: 'The Old Barrows', region: 'vale', theme: 'crypt', base: 1, perFloor: 1, floors: 3, family: 'ashbound', families: ['diggers', 'ashbound', 'ashbound'], rooms: [6, 6], layout: 'halls', band: true, bosses: { 3: 'quartermaster' }, dress: ['dig', 'gallery', 'muster'], mix: 0 },
  wickham_keep: { name: 'Wickham Keep', region: 'vale', theme: 'dread', themes: ['dread', 'dread', 'cave'], base: 4, perFloor: 1, floors: 3, family: 'redhand', families: ['redhand', 'redhand', 'diggers'], rooms: [6, 6], layout: 'halls', band: true, bosses: { 1: 'goblin_chief', 3: 'redhand_captain' }, dress: ['bailey', 'barracks', 'cellar'], mix: 0x7e40 },
  sunken_chapel: { name: 'The Sunken Chapel', region: 'vale', theme: 'nave', themes: ['nave', 'cinder', 'crypt'], base: 7, perFloor: 1, floors: 3, family: 'chapel', rooms: [6, 6], layout: 'halls', band: true, bosses: { 2: 'robed_stranger', 3: 'standard' }, dress: ['nave', 'cultcut', 'binding'], mix: 0xc4a9 },
  ninth_milestone: { name: 'The Ninth Milestone', region: 'vale', theme: 'chasm', base: 9, perFloor: 0, floors: 1, family: 'ashbound', rooms: [4, 4], layout: 'halls', flat: true, hidden: true, secret: true, vault: 'last_order', mix: 0x9e11 },
  // the Greywater Fens, 10–18: the Toadking's island of boats, the lock halls going down into the vats, the Abbey; the
  // Undercroft its secret. The Sickpools are the Locks' third floor, Vat Seven (they were a site of their own).
  toadking_mound: { name: "Toadking's Mound", region: 'fens', theme: 'mire', base: 10, perFloor: 1, floors: 3, family: 'reedmen', rooms: [6, 6], band: true, bosses: { 3: 'toadking' }, dress: ['mound', 'mound', 'mound'], mix: 0x70ad },
  canal_locks: { name: 'The Canal Locks', region: 'fens', theme: 'sluice', themes: ['sluice', 'sluice', 'poison'], base: 13, perFloor: 1, floors: 3, family: 'lockcult', families: ['ashbound', 'lockcult', 'harvest'], rooms: [6, 6], layout: 'halls', band: true, bosses: { 3: 'vatwarden' }, dress: ['locks', 'locks', 'vats'], mix: 0x10c5 },
  drowned_abbey: { name: 'The Drowned Abbey', region: 'fens', theme: 'water', base: 16, perFloor: 1, floors: 3, family: 'drowned', rooms: [4, 4], layout: 'halls', band: true, bosses: { 1: 'teague', 2: 'drowned_choir', 3: 'abbess_below' }, dress: ['abbey', 'abbey', 'abbey'], mix: 0xab3e },
  // the Mere Tower (tower.js; world doc v1.23): its landing and the stair hall, where the climb goes on; Wenna Pike's punt
  // from Saltmere's landing, from level 12 (minLevel: core.js turns a company under it back at the jetty). It pays no XP,
  // so it competes with no band.
  mere_tower: { name: 'The Mere Tower', region: 'fens', theme: 'dread', base: 12, perFloor: 0, floors: 1, family: 'ashbound', rooms: [2, 2], layout: 'halls', flat: true, minLevel: 12, mix: 0x3e7e },
  reedholm_undercroft: { name: 'The Reedholm Undercroft', region: 'fens', theme: 'chasm', base: 18, perFloor: 0, floors: 1, family: 'ashbound', rooms: [4, 4], layout: 'halls', flat: true, hidden: true, secret: true, vault: 'the_fair_copy', mix: 0x4e3d },
  // parked for the Cinder Reach (world doc v1.32 §3.3): its Assay Yards and its Cold Seam, as they were in the Vale
  tithe_mill: { name: 'The Tithe Mill', region: 'reach', theme: 'desert', base: 1, perFloor: 0, floors: 1, family: 'redhand', rooms: [6, 6], layout: 'halls', parked: true, mix: 0x3117 },
  scrag_warren: { name: 'The Scrag Warren', region: 'reach', theme: 'warren', base: 2, perFloor: 1, floors: 2, family: 'goblin', rooms: [6, 6], parked: true, mix: 0x6b1d },
};
export const SITE_IDS = Object.keys(SITES);

/** @param {string | undefined | null} id */
export const siteOf = (id) => SITES[id || 'barrows'] || SITES.barrows;
/** is there a floor below this one? @param {string} id @param {number} depth (0 = the first floor) */
export const hasFloorBelow = (id, depth) => { const s = siteOf(id); return !s.floors || depth + 1 < s.floors; };
/** a band's top level @param {SiteDef} s */
const bandTop = (s) => s.base + s.floors - 1;
/** a room's level in this site @param {string} id @param {number} depth @param {number} rank its walking order from the
 *  entrance (0 the nearest; the hall last) @param {number} [count] the floor's ranked rooms (its hall the last of them) */
export function roomLevelAt(id, depth, rank, count = 0) {
  const s = siteOf(id);
  if (s.flat) return s.base;
  if (s.band) { const lv = s.base + depth, before = count >= 3 && (rank === count - 2 || rank === count - 3); return Math.min(bandTop(s), lv + (before ? 1 : 0)); }
  return s.base + s.perFloor * depth + Math.floor(rank / 2);
}
/** the boss in this floor's stairs-down hall, if any @param {string} id @param {number} depth */
export const bossAt = (id, depth) => (siteOf(id).bosses || {})[depth + 1] || null;
/** a site's levels, for the compass ("LV 4–6") @param {string} id */
export function levelBand(id) {
  const s = siteOf(id);
  if (s.flat) return `${s.base}`;
  if (s.band) return `${s.base}–${bandTop(s)}`;
  const top = s.floors ? s.base + s.perFloor * (s.floors - 1) + Math.floor(((s.rooms ? s.rooms[1] : 6) - 2) / 2) : s.base + 3;   // (the hall is the last ranked room)
  return `${s.base}–${top}`;
}
/** a floor's look (level.js THEMES) and foes (battle.js FAMILIES) @param {string} id @param {number} depth */
export const themeAt = (id, depth) => { const s = siteOf(id); return (s.themes && s.themes[depth]) || s.theme; };
export const familyAt = (id, depth) => { const s = siteOf(id); return (s.families && s.families[depth]) || s.family; };
/** a floor's dressing kit (world.js DRESS), or null: dressed by its family, as before @param {string} id @param {number} depth */
export const dressAt = (id, depth) => { const s = siteOf(id); return (s.dress && s.dress[depth]) || null; };
/** play time a secret site stays sealed once its vault is opened (seconds of sim time: two hours of play) */
export const SECRET_REST = 7200;
/** can the party go in? (not hidden, or revealed) @param {string} id @param {Set<string> | string[]} revealed */
export const siteOpen = (id, revealed) => !!SITES[id] && !SITES[id].parked && (!SITES[id].hidden || (Array.isArray(revealed) ? revealed.includes(id) : revealed.has(id)));
