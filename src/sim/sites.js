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

import { PLANS } from './plans.js';

/** @typedef {{ name: string, region: string, theme: string | null, base: number, perFloor: number, floors: number, span?: number, plan?: boolean, family: string, rooms: [number, number] | null, layout?: 'caverns' | 'halls', flat?: boolean, hidden?: boolean, minLevel?: number, bosses?: Record<number, string>, families?: string[], themes?: string[], dress?: string[], vault?: string, band?: boolean, secret?: boolean, side?: boolean, parked?: boolean, arena?: boolean, menu?: boolean, mix: number }} SiteDef */   // (menu: reached from ☰, no way in on its land: the Mere Tower, v1.112)
/** @type {Record<string, SiteDef>} */
export const SITES = {
  // the Hollow Vale, 1–9: a crypt, a fort that goes down into a cave, a drowned chapel; the Ninth Milestone its secret
  // (2026-11-02, docs/vale-dungeons-plan.md; the owner: "Same layout every visit, Skarn at 5, halls 10") each authored:
  // `plan` builds its floors from plans.js, two floors at most, five spaces a floor; a band of three levels (`span`) over
  // its two floors, a space's level its plan's (plans.js lv); the bosses each in their floor's last hall
  barrows: { name: 'The Old Barrows', region: 'vale', theme: 'crypt', base: 1, perFloor: 1, floors: 2, span: 3, plan: true, family: 'ashbound', families: ['diggers', 'ashbound'], rooms: [5, 5], layout: 'halls', band: true, bosses: { 2: 'quartermaster' }, dress: ['dig', 'gallery'], mix: 0 },
  wickham_keep: { name: 'Wickham Keep', region: 'vale', theme: 'dread', themes: ['dread', 'cave'], base: 4, perFloor: 1, floors: 2, span: 3, plan: true, family: 'redhand', families: ['redhand', 'redhand'], rooms: [5, 5], layout: 'halls', band: true, bosses: { 1: 'goblin_chief', 2: 'redhand_captain' }, dress: ['bailey', 'barracks'], mix: 0x7e40 },
  sunken_chapel: { name: 'The Sunken Chapel', region: 'vale', theme: 'nave', themes: ['nave', 'cinder'], base: 7, perFloor: 1, floors: 2, span: 3, plan: true, family: 'chapel', rooms: [5, 5], layout: 'halls', band: true, bosses: { 1: 'robed_stranger', 2: 'standard' }, dress: ['nave', 'binding'], mix: 0xc4a9 },
  // (v1.60, the owner: "Add a test dungeon to thornvale, one room with each of the new creatures.. level 4") a trial site
  // behind the Scrag Warren's old adit: the bestiary in pens, flat at 4 (no band: the Keep keeps 4–6), the Rat King and the
  // Spider Queen in its halls. Not canon (world doc v1.38): it goes, or gets a story, when the creatures are placed.
  proving_pens: { name: 'The Proving Pens', region: 'vale', theme: 'cave', base: 4, perFloor: 0, floors: 2, plan: true, family: 'bestiary', rooms: [5, 5], layout: 'halls', flat: true, bosses: { 1: 'rat_king', 2: 'spider_queen' }, dress: ['dig', 'cellar'], mix: 0x9e57 },
  ninth_milestone: { name: 'The Ninth Milestone', region: 'vale', theme: 'chasm', base: 9, perFloor: 0, floors: 1, plan: true, family: 'ashbound', rooms: [5, 5], layout: 'halls', flat: true, hidden: true, secret: true, vault: 'last_order', mix: 0x9e11 },
  // the Greywater Fens, 10–18: the Toadking's island of boats, the lock halls going down into the vats, the Abbey; the
  // Undercroft its secret. (v1.102, the owner: the Vale's rules for them too) each authored as the Vale's are, two floors
  // of five spaces from plans.js, a band of three levels over the two: Vat Seven the Locks' second floor (it was the
  // third; the Sickpools before that, a site of its own), the Toadking and Wren the Mound's second, the Abbess the Abbey's.
  toadking_mound: { name: "Toadking's Mound", region: 'fens', theme: 'mire', base: 10, perFloor: 1, floors: 2, span: 3, plan: true, family: 'reedmen', families: ['toadmen', 'boathall'], rooms: [5, 5], layout: 'halls', band: true, bosses: { 2: 'toadking' }, dress: ['mound', 'mound'], mix: 0x70ad },
  canal_locks: { name: 'The Canal Locks', region: 'fens', theme: 'sluice', themes: ['sluice', 'poison'], base: 13, perFloor: 1, floors: 2, span: 3, plan: true, family: 'lockcult', families: ['lockcult', 'harvest'], rooms: [5, 5], layout: 'halls', band: true, bosses: { 2: 'vatwarden' }, dress: ['locks', 'vats'], mix: 0x10c5 },
  drowned_abbey: { name: 'The Drowned Abbey', region: 'fens', theme: 'water', base: 16, perFloor: 1, floors: 2, span: 3, plan: true, family: 'drowned', rooms: [5, 5], layout: 'halls', band: true, bosses: { 1: 'drowned_choir', 2: 'abbess_below' }, dress: ['abbey', 'abbey'], mix: 0xab3e },   // (Brother Teague in his cell off the cloister: plans.js, battle.js sideBoss)
  // the Cinder Reach (GDD v1.124, world doc v1.53; docs/reach-plan.md): its first band, the Cold Seam (19–21), the
  // Deepdelvers' played-out pithead and the goblins' warren dug through into it; the Foreman in the tally cave
  // (v1.126, the build sheet: docs/reach-plan.md) the Reach's other three bands and its secret
  // (v1.144, the owner: "Make the reach as 3 dungeons") the Reach's twelve levels in three bands of four, two floors a
  // band and two levels a floor (`perFloor: 2`): the Cold Seam 19–22, the Assay Yards 23–26, the Cinderworks 27–30, the
  // Forgehall of Oruth its first floor (the Assay walled the forge-hall's doors and cut in from the works)
  cold_seam: { name: 'The Cold Seam', region: 'reach', theme: 'cave', base: 19, perFloor: 2, floors: 2, span: 4, plan: true, family: 'pithead', families: ['pithead', 'warren'], rooms: [5, 5], layout: 'halls', band: true, bosses: { 2: 'foreman' }, dress: ['pithead', 'warren'], mix: 0xc01d },
  assay_yards: { name: 'The Assay Yards', region: 'reach', theme: 'desert', base: 23, perFloor: 2, floors: 2, span: 4, plan: true, family: 'yards', families: ['yards', 'quota'], rooms: [5, 5], layout: 'halls', band: true, bosses: { 2: 'weighmaster' }, dress: ['yards', 'quota'], mix: 0xa55a },
  cinderworks: { name: 'The Cinderworks', region: 'reach', theme: 'ember', themes: ['ember', 'lava'], base: 27, perFloor: 2, floors: 2, span: 4, plan: true, family: 'works', families: ['works', 'vault'], rooms: [5, 5], layout: 'halls', band: true, bosses: { 1: 'oruth', 2: 'stoker' },   // (Morrow Vane holds the furnace hall on the second floor, a side room's boss: battle.js sideBoss)
  dress: ['works', 'vault'], mix: 0xc1d3 },
  // (v1.150) the Tidemark, 31–45 (docs/tidemark-plan.md): bands of five, three levels on the first floor and two on the
  // second. The Drowned Mole, the sunken imperial harbour off Gullwick: its wharf, then its moles at low water; the
  // Harbourmaster on the outer mole's end, Sister Maren in his office. Its door at the end of Gullwick's ferry jetty.
  drowned_mole: { name: 'The Drowned Mole', region: 'tidemark', theme: 'mound', base: 31, perFloor: 3, floors: 2, span: 5, plan: true, family: 'wharf', families: ['wharf', 'mole'], rooms: [5, 5], layout: 'halls', band: true, bosses: { 2: 'harbourmaster' }, dress: ['docks', 'mole'], mix: 0x3017 },
  // (v1.151) the Gull Isles (36–40): the sea cave where the Gull Fleet hides its boats, then the hulks moored in its lagoon;
  // Admiral Hesk in the flagship's great cabin. Its door at the landing jetty on the harbour bay's west shore.
  gull_isles: { name: 'The Gull Isles', region: 'tidemark', theme: 'cave', themes: ['cave', 'storehouse'], base: 36, perFloor: 3, floors: 2, span: 5, plan: true, family: 'fleet', rooms: [5, 5], layout: 'halls', band: true, bosses: { 2: 'hesk' }, dress: ['seacave', 'hulk'], mix: 0x9a11 },
  // (v1.151) the Lamp Fort (38): the Tidemark's side vault (`side`), Old Gannet's coast light on its headland with the
  // Gull Fleet at its door; its lamp room keeps his spare wick, once (`vault`), then seals for SECRET_REST (core.js)
  lamp_fort: { name: 'The Lamp Fort', region: 'tidemark', theme: 'storehouse', base: 38, perFloor: 0, floors: 1, plan: true, family: 'fleet', rooms: [5, 5], layout: 'halls', flat: true, side: true, vault: 'gannets_spare_wick', mix: 0x1a4f },
  ninth_vault: { name: 'The Ninth Vault', region: 'reach', theme: 'chasm', base: 30, perFloor: 0, floors: 1, plan: true, family: 'ashbound', rooms: [5, 5], layout: 'halls', flat: true, hidden: true, secret: true, vault: 'the_quota_ledgers', dress: ['strongroom'], mix: 0x9a17 },
  // the Mere Tower (tower.js; world doc v1.23): its landing and the stair hall, where the climb goes on; Wenna Pike's punt
  // out to it from ☰ (v1.112, core.js towerGo: from wherever the company is, and back there), from level 12 (minLevel:
  // core.js turns a company under it away). It pays no XP, so it competes with no band.
  mere_tower: { name: 'The Mere Tower', region: 'fens', theme: 'dread', base: 12, perFloor: 0, floors: 1, family: 'ashbound', rooms: [2, 2], layout: 'halls', flat: true, minLevel: 12, menu: true, mix: 0x3e7e },
  reedholm_undercroft: { name: 'The Reedholm Undercroft', region: 'fens', theme: 'crypt', base: 18, perFloor: 0, floors: 1, plan: true, family: 'ashbound', rooms: [5, 5], layout: 'halls', flat: true, hidden: true, secret: true, vault: 'the_fair_copy', mix: 0x4e3d },
  // the Bowl (GDD §17 v1.85; bowl.js): the arena in Solmere, reached from the menu for now (from level 6), never from a
  // land, so parked: on no map, in no band, no foes of its own (a bout's rivals are bowl.js's)
  bowl: { name: 'The Bowl', region: 'fens', theme: 'desert', base: 6, perFloor: 0, floors: 1, plan: true, family: 'ashbound', rooms: [1, 1], layout: 'halls', flat: true, parked: true, arena: true, mix: 0xb0e1 },
  // the Ring (GDD §19 v1.105; ring.js): the old stones north-east of Saltmere, where the Kingstone stands at the top of
  // every hour; reached by walking into the stones in a window, never from a door, so parked as the Bowl is
  // parked for the Cinder Reach (world doc v1.32 §3.3): its Assay Yards and its Cold Seam, as they were in the Vale
  tithe_mill: { name: 'The Tithe Mill', region: 'reach', theme: 'desert', base: 1, perFloor: 0, floors: 1, family: 'redhand', rooms: [6, 6], layout: 'halls', parked: true, mix: 0x3117 },
  // (the owner, 2026-11-22, from a reference: "Prototype a dungeon level that looks like the inside of a building.. a
  // tavern. Needs more open floor to accommodate NPC battle but the walls are up and set dressing looks great. This is a
  // new dungeon type": the tavern kit, plans.js shuttered_inn; a prototype, then placed: below)
  shuttered_inn: { name: 'The Shuttered Inn', region: 'reach', theme: 'dread', base: 23, perFloor: 0, floors: 1, plan: true, family: 'taproom', rooms: [5, 5], layout: 'halls', flat: true, side: true, vault: 'hobs_spare_key', mix: 0x1ee5 },   // (the owner, 2026-11-22: "Add it as a location in game with lvl 20 NPCs.. close to town in the overworld near ashgate": on the Reach across the Kell road from Ashgate's north wall, outdoor.js REACH.inn; GDD v1.138)
  // (the owner, 2026-11-22: "do a similar dungeon style as the inside of a crypt": the crypt kit, plans.js haddow_crypt,
  // docs/crypt-dungeon.md; parked, a prototype for review, on no land yet, as the inn was)
  haddow_crypt: { name: 'The Haddow Crypt', region: 'vale', theme: 'crypt', base: 6, perFloor: 0, floors: 1, plan: true, family: 'ashbound', rooms: [5, 5], layout: 'halls', flat: true, side: true, vault: 'the_haddow_roll', mix: 0xc4e7 },   // (the owner, 2026-11-23: "put it in the vale": the Haddows' chantry north of the east road past the crossroads, outdoor.js buildOverland `crypt`; GDD v1.140),
  // (the owner, 2026-11-23, from a reference: "start two new level dressing types, docks and harbor": the docks kit, plans.js
  // old_eel_wharf; parked, a prototype for review, on no land yet)
  old_eel_wharf: { name: 'The Old Eel Wharf', region: 'fens', theme: 'mound', base: 12, perFloor: 0, floors: 1, plan: true, family: 'drowned', rooms: [5, 5], layout: 'halls', flat: true, parked: true, mix: 0xd0c5 },
  // (the owner, 2026-11-23, from a reference: "the reaches, high up on the ramparts": the ramparts kit, plans.js high_ramparts;
  // parked, a prototype for review, on no land yet)
  high_ramparts: { name: 'The High Ramparts', region: 'reach', theme: 'dread', base: 22, perFloor: 0, floors: 1, plan: true, family: 'yards', rooms: [5, 5], layout: 'halls', flat: true, parked: true, mix: 0x4a3b },
  scrag_warren: { name: 'The Scrag Warren', region: 'reach', theme: 'warren', base: 2, perFloor: 1, floors: 2, family: 'goblin', rooms: [6, 6], parked: true, mix: 0x6b1d },
};
export const SITE_IDS = Object.keys(SITES);

/** @param {string | undefined | null} id */
export const siteOf = (id) => SITES[id || 'barrows'] || SITES.barrows;
/** is there a floor below this one? @param {string} id @param {number} depth (0 = the first floor) */
export const hasFloorBelow = (id, depth) => { const s = siteOf(id); return !s.floors || depth + 1 < s.floors; };
/** a band's top level (a planned band spans its three levels over two floors) @param {SiteDef} s */
export const bandTop = (s) => s.base + (s.span || s.floors) - 1;
/** a planned site's floor (plans.js), or null: generated as before @param {string} id @param {number} depth */
export const planFloor = (id, depth) => { const s = siteOf(id), P = s.plan ? PLANS[id] : null; return (P && P.floors[depth]) || null; };
/** a room's level in this site @param {string} id @param {number} depth @param {number} rank its walking order from the
 *  entrance (0 the nearest; the hall last) @param {number} [count] the floor's ranked rooms (its hall the last of them) */
export function roomLevelAt(id, depth, rank, count = 0) {
  const s = siteOf(id);
  if (s.flat) return s.base;
  if (s.band) { const lv = s.base + (s.perFloor || 1) * depth, before = count >= 3 && (rank === count - 2 || rank === count - 3); return Math.min(bandTop(s), lv + (before ? 1 : 0)); }
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
