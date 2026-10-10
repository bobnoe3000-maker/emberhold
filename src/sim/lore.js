// @ts-check
// lore.js — the Chronicle of the Fall's fragments (world doc §7, quest-lore-system §7). Headless:
// where each fragment lies, finding it, and what finding it pays. The words (title, text, note)
// live in content/lore/<id>.json; the sim keeps its own table of where and what (it can't read
// JSON files, and must not trust the client's) and a test keeps the two in step.
//
// Placement is deterministic from the world seed (world doc §7: two players find the same truth in
// different places). A fragment names a site, a floor and a kind of holder:
//   chest · shrine   one of that floor's chests or shrines, drawn on the LORE stream; opening the chest
//                    finds the fragment, and so does touching the shrine (used, or kept for later). A floor with none of that kind keeps the fragment in its hall.
//   hall             the floor's stairs-down hall: hold it HALL_WAVES waves in one visit and it's found
//   boss             carried by the floor's boss (sites.js bossAt): found when he falls. A story boss who
//                    fell before this fragment existed (an older save) left it in his hall instead.
// Finding one pays a little XP (LORE_XP × the hero's level, +20 % for a ward of the Grey Sisters,
// ORIGIN_EDGE loreXp) and emits 'fragmentFound' { id, set, order, found, of }; the last of a set
// emits 'setComplete' { set }; a whole set reveals its hidden site (SET_REVEALS, core.js). state.fragments =
// [ids] in the order found (save v10).

import { mulberry32, streamSeed, STREAM } from './rng.js';
import { gainXp, ORIGIN_EDGE, levelShare } from './party.js';
import { bossAt } from './sites.js';
import { BOSSES } from './battle.js';

/** @type {Record<string, { set: string, order: number, site: string, floor: number, via: 'chest' | 'shrine' | 'hall' | 'boss' }>} */
export const FRAGMENTS = {
  frag_vale_standing_order: { set: 'vale', order: 1, site: 'barrows', floor: 1, via: 'chest' },
  frag_vale_muster_roll: { set: 'vale', order: 2, site: 'barrows', floor: 2, via: 'shrine' },
  frag_vale_centurion_tablet: { set: 'vale', order: 3, site: 'barrows', floor: 2, via: 'hall' },
  // the rest of the Vale set (world doc §7, v1.7)
  frag_vale_tithe_ledger: { set: 'vale', order: 4, site: 'wickham_keep', floor: 2, via: 'chest' },   // (v1.48: in the Keep's strongroom, with the paymaster's box; it was the Mill's)
  frag_vale_gate_warden_note: { set: 'vale', order: 5, site: 'wickham_keep', floor: 1, via: 'shrine' },
  frag_vale_last_dispatch: { set: 'vale', order: 6, site: 'wickham_keep', floor: 3, via: 'boss' },        // Garrow had it, sealed (v1.48: he holds the Old Cellars)
  frag_vale_chaplains_prayer: { set: 'vale', order: 7, site: 'sunken_chapel', floor: 1, via: 'chest' },
  frag_vale_binding_rite: { set: 'vale', order: 8, site: 'sunken_chapel', floor: 2, via: 'shrine' },
  frag_vale_chaplains_last_page: { set: 'vale', order: 9, site: 'sunken_chapel', floor: 2, via: 'boss' },  // under the Stranger's feet
  frag_vale_standards_ribbon: { set: 'vale', order: 10, site: 'sunken_chapel', floor: 3, via: 'boss' },   // taken from the Standard (v1.48: over the binding in the Chapel's crypt)
  // the Fens set (world doc §7, v1.30; M8 slice 10): the lock-men, the vats, the Abbey, and the night the canal broke
  frag_fens_lock_tally: { set: 'fens', order: 1, site: 'canal_locks', floor: 1, via: 'chest' },
  frag_fens_canal_order: { set: 'fens', order: 2, site: 'canal_locks', floor: 1, via: 'shrine' },
  frag_fens_sluice_book: { set: 'fens', order: 3, site: 'canal_locks', floor: 2, via: 'hall' },          // in the Sluice
  frag_fens_reed_stick: { set: 'fens', order: 4, site: 'toadking_mound', floor: 1, via: 'chest' },
  frag_fens_tithe_plate: { set: 'fens', order: 5, site: 'toadking_mound', floor: 3, via: 'boss' },       // it hung in the Toadking's Boat Hall (v1.48: the Mound's third floor)
  frag_fens_vat_ledger: { set: 'fens', order: 6, site: 'canal_locks', floor: 3, via: 'chest' },   // (v1.48: Vat Seven, the Locks' third floor; it was the Sickpools')
  frag_fens_drain_order: { set: 'fens', order: 7, site: 'canal_locks', floor: 3, via: 'shrine' },
  frag_fens_novice_letter: { set: 'fens', order: 8, site: 'drowned_abbey', floor: 1, via: 'chest' },
  frag_fens_day_book: { set: 'fens', order: 9, site: 'drowned_abbey', floor: 2, via: 'hall' },           // in the Choir
  frag_fens_last_hour: { set: 'fens', order: 10, site: 'drowned_abbey', floor: 3, via: 'boss' },         // the Abbess Below's
};
/** a whole set reveals its hidden site (sites.js; world doc §7) */
export const SET_REVEALS = { vale: 'ninth_milestone', fens: 'reedholm_undercroft' };
/** the fragments of each set, in reading order */
export const SETS = /** @type {Record<string, string[]>} */ ({});
for (const [id, f] of Object.entries(FRAGMENTS)) (SETS[f.set] ||= []).push(id);
for (const k of Object.keys(SETS)) SETS[k].sort((a, b) => FRAGMENTS[a].order - FRAGMENTS[b].order);
export const HALL_WAVES = 3, LORE_SHARE = 0.05;   // (GDD §9 v1.39: a fragment is 5 % of a level, each finder's own; it was 20 XP × the hero's level)
const hashId = (s) => { let h = 2166136261; for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619); return h >>> 0; };

/** where a fragment lies on this world, if this is its floor: { via, key?, boss? } (key = 'x,y' of its
 * chest or shrine) or null @param {number} seed @param {string} id @param {any} world
 * @param {Record<string, number>} [bosses] state.bosses: a story boss who already fell left his in the hall */
export function holderOf(seed, id, world, bosses = {}) {
  const f = FRAGMENTS[id];
  if (!f || world.kind !== 'dungeon' || (world.site || 'barrows') !== f.site || (world.depth || 0) + 1 !== f.floor) return null;
  if (f.via === 'hall') return { via: 'hall' };
  if (f.via === 'boss') { const b = bossAt(f.site, f.floor - 1); return b && !(BOSSES[b].once && bosses[b]) ? { via: 'boss', boss: b } : { via: 'hall' }; }
  const keys = [...world.props].filter(([, v]) => v === f.via).map(([k]) => k).sort();
  if (!keys.length) return { via: 'hall' };                        // (no such holder on this floor: it waits in the hall)
  const rng = mulberry32(streamSeed(seed ^ hashId(id), STREAM.LORE));
  return { via: f.via, key: keys[Math.floor(rng() * keys.length)] };
}

/** @param {{ state: any, bus: any, getWorld: () => any, seed: number }} o */
export function createLore({ state, bus, getWorld, seed }) {
  if (!state.fragments) state.fragments = [];
  let hallWaves = 0;                                                 // waves held in this floor's hall, this visit (runtime)
  const has = (id) => state.fragments.includes(id);
  function found(id) {
    if (has(id)) return;
    state.fragments.push(id);
    const f = FRAGMENTS[id], h = state.party[0], edge = ORIGIN_EDGE[h.origin]?.kind === 'loreXp' ? ORIGIN_EDGE[h.origin].value : 0;
    const xpOf = (m) => levelShare(m.level, LORE_SHARE * (1 + edge)), xp = xpOf(h), lv = (m) => bus.emit('levelUp', { id: m.id, name: m.name, level: m.level });
    for (const m of state.party) if (!m.fallen) gainXp(m, xpOf(m), lv);
    const got = SETS[f.set].filter(has).length;
    bus.emit('fragmentFound', { id, set: f.set, order: f.order, found: got, of: SETS[f.set].length, xp });
    bus.emit('partyChanged', state.party);
    if (got === SETS[f.set].length) bus.emit('setComplete', { set: f.set });
  }
  const unfound = () => Object.keys(FRAGMENTS).filter((id) => !has(id));
  const read = (kind) => (e) => {
    const w = getWorld(), key = `${e.tx},${e.ty}`;
    for (const id of unfound()) { const h = holderOf(seed, id, w, state.bosses); if (h && h.key === key && h.via === kind) found(id); }
  };
  bus.on('looted', (e) => { if (e.kind === 'chest') read('chest')(e); });
  bus.on('shrineTouched', read('shrine'));             // a shrine's words are read at a touch, used or kept for later (core.js)
  bus.on('battle', (e) => { if (e.on) hallWaves = 0; });
  bus.on('wave', (e) => {
    if (!e.cleared) return;
    const w = getWorld(), L = w.level; if (!L || !L.descentRoom || e.room !== L.descentRoom.id) return;
    hallWaves++;
    for (const id of unfound()) { const h = holderOf(seed, id, w, state.bosses); if (h && h.via === 'hall' && hallWaves >= HALL_WAVES) found(id); }
  });
  // a boss down on his floor: what he carried (his count is already up, so this asks the table, not holderOf)
  bus.on('bossDown', (e) => {
    const w = getWorld();
    for (const id of unfound()) { const f = FRAGMENTS[id]; if (f.via === 'boss' && (w.site || 'barrows') === f.site && (w.depth || 0) + 1 === f.floor && bossAt(f.site, f.floor - 1) === e.id) found(id); }
  });
  /** what Ink may read: frag_<id> (0 / 1) and frag_<set>_count */
  function varsFor() {
    /** @type {Record<string, number>} */
    const v = {};
    for (const id of Object.keys(FRAGMENTS)) v[id] = has(id) ? 1 : 0;
    for (const [set, ids] of Object.entries(SETS)) v[`frag_${set}_count`] = ids.filter(has).length;
    return v;
  }
  const snapshot = () => ({ fragments: state.fragments.slice() });
  function restore(data) {
    state.fragments = [];                                            // v9 and older: none yet
    for (const id of Array.isArray(data?.fragments) ? data.fragments : []) if (FRAGMENTS[id] && !has(id)) state.fragments.push(id);
  }
  return { varsFor, snapshot, restore, has, holder: (/** @type {string} */ id) => holderOf(seed, id, getWorld(), state.bosses) };
}
