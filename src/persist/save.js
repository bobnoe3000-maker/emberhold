// @ts-check
// save.js — game slots. Browser-only (IndexedDB + lifecycle events); never imported by /sim,
// so the sim stays headless and node-testable.
//
// The player has up to SLOTS game slots. Each is a whole game: its own world seed, main
// character, party and progress (GDD §6.1). A slot is small by design — the world is a pure
// function of its seed, so we store the sim's snapshot (seed + diffs + party + bag + counters),
// never tiles. The slot's `meta` is a summary for the slots window, derived from the snapshot.
//
// Durability: slots live in IndexedDB (async). On pagehide / tab hidden we ALSO write a
// synchronous localStorage backup of the active slot — the OS may kill a backgrounded page
// before an async write lands. On read, the newer of the two wins.
//
// Versions (schema is versioned from day one; migrate() normalizes or refuses):
//   v2: dungeon levels replaced the infinite field (v1 positions no longer land on floor)
//   v3: town + overland + party; one save in localStorage under 'emberhold.save'
//   v4: three game slots in IndexedDB, each { version, savedAt, meta, data }; the v3 save
//       migrates into slot 1
//   v5: M3 heroes — created, bench, temple; per member attrs, autoAttrs, origin, skills, off,
//       prio, stance, fallen, weakUntil, respecs. The shape only grew: v4 data loads as is and
//       the sim's restore() fills the rest (the class build for attributes, created = true).
//   v6: M4 story flags — flags { [name]: number } set by conversations (sim/npcs.js). Only grew:
//       v3–v5 data loads as is with no flags.
//   v7: M4 quests — quests { [id]: [state, step, ...counters] } and tracked (sim/quests.js). Only
//       grew: older data loads with no quests.
//   v8: stairs up on every floor — floors [[depth, { mods, hp, discovered, visited }]], the other
//       floors of the current dungeon visit (core.js). Only grew: older data loads with none.
//   (2026-09-30, no version bump: the shape is the same) an item's st is re-derived from (base, ilv,
//       rarity) on load (sim/items.js refreshItem), so old loot follows the doubled gear growth.
//   v10: the Chronicle — fragments [ids] in the order found (sim/lore.js). Only grew: older data
//       loads with none found.
//   v9: the Lantern Guild's board — board { day, lv } (sim/board.js); board jobs sit in quests under
//       ids board_<day>_<lv>_<slot>. Only grew: older data loads with no board (it goes up in town).
//   v11: M5 sites (sim/sites.js) — site (the dungeon you're in, or last were) and revealed [site ids]
//       (hidden sites found). Only grew: older data loads in the Old Barrows with nothing revealed.
//   v12: M5 bosses — bosses { [id]: times put down } (sim/battle.js BOSSES; a story boss falls once).
//       Only grew: older data loads with none down.
//   v13: M5 class trials — trials [classes] (sim/quests.js; a level-6 ability wants its class's trial).
//       Older data: every class someone in the company had at level 6 counts as done (sim restore), so
//       nobody loses an ability they had.
//   v14: the Lantern Guild's sellswords (sim/companions.js) — per member rank, perks, hidden, bond, owed,
//       retrains; tavern { day, ask }, wageDay, innDay. Older data: a tavern hire is a Wick and its old
//       trait becomes the matching perk, kept for free with wages from the next dawn; Brannoc gets his
//       own perks (sim restore).
//   v15: the hour-long day (sim/heroes.js DAY_S 1440 → 3600 s) — the snapshot says its dayS. Older data
//       (no dayS: a 24-minute day) is retimed by the sim's restore onto the same day number and the same
//       time of that day, so stored days (wages, board jobs, tavern, temple, inn) read as they did; a
//       slot's playtime now counts ticks, which retiming doesn't touch.
//   v16: the board posts at dawn and at dusk — board { day, lv, half } (sim/board.js), and dusk jobs'
//       ids read board_<day>d_<lv>_<slot>. Only grew: older data has no half (a dawn board), and its
//       board jobs rebuild exactly as before.
//   v17: the forge and the shop (sim/smith.js) — items gain up (the smith's +1…+5) and rf (reforges);
//       shop { day, lv, bought } and buyback [items sold, each with what it fetched]. Only grew: older
//       items have no upgrade, and there's no shop until you're next in town.
//   v18: the land you're in (sim/regions.js): region 'vale' | 'fens' (M8). Only grew: older data is in the Vale.
//        board.region: the land whose town's board the posting went up in (M8, Saltmere's); none is the Vale's.
//   v19: the count (sim/lamps.js; GDD §17): count { lamps, souls } and lampsBroken [ids]. Older data starts at nothing,
//       but a save that already put the Standard of the Third Legion down is credited his lamp: one lamp, and the 240
//       souls of the legion's muster it held. (What else it freed before v19 wasn't counted, so isn't.)

import * as idb from './idb.js';
import { TICK_HZ } from '../sim/core.js';
import { LAMPS } from '../sim/lamps.js';

export const SAVE_VERSION = 19;
export const SLOTS = 3;
const AUTOSAVE_MS = 15000;
const LEGACY_KEY = 'emberhold.save', ACTIVE_KEY = 'emberfall.activeSlot', BACKUP = 'emberfall.backup.slot';
const slotKey = (/** @type {number} */ i) => `slot${i}`;

/** Summary shown on a slot card.
 * @param {any} data a sim snapshot */
export function metaOf(data) {
  const h = (data.party && data.party[0]) || {};
  return {
    name: h.name || 'Hero', cls: h.cls || 'fighter', level: h.level || 1, actor: h.actor || null, origin: h.origin || null,
    party: (data.party || []).length, scene: data.scene || 'town', depth: data.depth || 0, site: data.site || 'barrows', region: data.region || 'vale',
    playtime: Math.round(Number.isFinite(data.tick) && data.tick > 0 ? data.tick / TICK_HZ : data.t || 0),   // seconds played (t is game time, retimed when the day changed length) gold: (data.counters && data.counters.gold) || 0,
  };
}

/** @param {any} raw @returns {any|null} a current-version slot, or null if unusable */
export function migrate(raw) {
  if (!raw || typeof raw !== 'object' || !raw.data) return null;
  if (raw.version === SAVE_VERSION) return raw;
  if (raw.version >= 3 && raw.version < SAVE_VERSION) { const data = raw.version < 19 ? countFrom(raw.data) : raw.data; return { version: SAVE_VERSION, savedAt: raw.savedAt || 0, meta: metaOf(data), data }; }
  return null;                       // unknown / newer / un-migratable
}

/** v18 → v19: the count, crediting the Standard's lamp if he fell (see v19 above) @param {any} data */
export function countFrom(data) {
  if (data.count) return data;
  const L = LAMPS.third_legion, fell = !!(data.bosses && data.bosses[L.keeper] > 0);
  return { ...data, count: { lamps: fell ? 1 : 0, souls: fell ? L.souls : 0 }, lampsBroken: fell ? ['third_legion'] : [] };
}

// one-time: the v3 single save (localStorage) becomes slot 1
export async function migrateLegacy() {
  let raw;
  try { raw = JSON.parse(localStorage.getItem(LEGACY_KEY) || 'null'); } catch (e) { return false; }
  if (!raw) return false;
  const slot = migrate(raw);
  if (slot && !(await readSlot(1))) { if (!(await idb.set(slotKey(1), slot))) return false; }
  try { localStorage.removeItem(LEGACY_KEY); } catch (e) { /* ignore */ }
  return !!slot;
}

/** @param {number} i 1..SLOTS */
export async function readSlot(i) {
  let a, b;
  try { a = migrate(await idb.get(slotKey(i))); } catch (e) { a = null; }
  try { b = migrate(JSON.parse(localStorage.getItem(BACKUP + i) || 'null')); } catch (e) { b = null; }
  if (a && b) return b.savedAt > a.savedAt ? b : a;
  return a || b;
}
/** @returns {Promise<Array<any|null>>} meta per slot (null = empty) */
export async function listSlots() {
  const out = [];
  for (let i = 1; i <= SLOTS; i++) { const s = await readSlot(i); out.push(s ? { ...s.meta, savedAt: s.savedAt } : null); }
  return out;
}
/** @param {number} i @param {any} sim */
function payloadOf(i, sim) { const data = sim.snapshot(); return { version: SAVE_VERSION, savedAt: Date.now(), meta: metaOf(data), data }; }
/** @param {number} i @param {any} sim */
export async function writeSlot(i, sim) {
  try { return await idb.set(slotKey(i), payloadOf(i, sim)); } catch (e) { return false; }
}
/** synchronous backup (pagehide): localStorage only
 * @param {number} i @param {any} sim */
export function writeBackup(i, sim) {
  try { localStorage.setItem(BACKUP + i, JSON.stringify(payloadOf(i, sim))); return true; } catch (e) { return false; }
}
/** @param {number} i */
export async function deleteSlot(i) {
  await idb.del(slotKey(i));
  try { localStorage.removeItem(BACKUP + i); } catch (e) { /* ignore */ }
}

export function activeSlot() {
  let n = 1; try { n = +(localStorage.getItem(ACTIVE_KEY) || 1); } catch (e) { /* ignore */ }
  return n >= 1 && n <= SLOTS ? n : 1;
}
/** @param {number} i */
export function setActiveSlot(i) { try { localStorage.setItem(ACTIVE_KEY, String(i)); } catch (e) { /* ignore */ } }

// Autosave the active slot: a steady interval (IndexedDB) plus the mobile lifecycle moments
// that matter — tab hidden, page hidden — when a synchronous backup is written as well.
/** @param {any} sim @param {number} slot */
export function createAutosave(sim, slot, { intervalMs = AUTOSAVE_MS } = {}) {
  const save = () => writeSlot(slot, sim);
  const urgent = () => { writeBackup(slot, sim); save(); };
  const timer = setInterval(save, intervalMs);
  const onHide = () => { if (document.hidden) urgent(); };
  document.addEventListener('visibilitychange', onHide);
  window.addEventListener('pagehide', urgent);
  return {
    save, urgent,
    stop() { clearInterval(timer); document.removeEventListener('visibilitychange', onHide); window.removeEventListener('pagehide', urgent); },
  };
}
