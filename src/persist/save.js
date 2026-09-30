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
//   v9: the Lantern Guild's board — board { day, lv } (sim/board.js); board jobs sit in quests under
//       ids board_<day>_<lv>_<slot>. Only grew: older data loads with no board (it goes up in town).

import * as idb from './idb.js';

export const SAVE_VERSION = 9;
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
    party: (data.party || []).length, scene: data.scene || 'town', depth: data.depth || 0,
    playtime: Math.round(data.t || 0), gold: (data.counters && data.counters.gold) || 0,
  };
}

/** @param {any} raw @returns {any|null} a current-version slot, or null if unusable */
export function migrate(raw) {
  if (!raw || typeof raw !== 'object' || !raw.data) return null;
  if (raw.version === SAVE_VERSION) return raw;
  if (raw.version >= 3 && raw.version < SAVE_VERSION) return { version: SAVE_VERSION, savedAt: raw.savedAt || 0, meta: metaOf(raw.data), data: raw.data };
  return null;                       // unknown / newer / un-migratable
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
