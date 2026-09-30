// @ts-check
// lore.js — the Chronicle of the Fall's fragments (world doc §7, quest-lore-system §7). Headless:
// where each fragment lies, finding it, and what finding it pays. The words (title, text, note)
// live in content/lore/<id>.json; the sim keeps its own table of where and what (it can't read
// JSON files, and must not trust the client's) and a test keeps the two in step.
//
// Placement is deterministic from the world seed (world doc §7: two players find the same truth in
// different places). A fragment names a site, a floor and a kind of holder:
//   chest · shrine   one of that floor's chests or shrines, drawn on the LORE stream; opening it finds
//                    the fragment. A floor with none of that kind keeps the fragment in its hall.
//   hall             the floor's stairs-down hall: hold it HALL_WAVES waves in one visit and it's found
// Finding one pays a little XP (LORE_XP × the hero's level, +20 % for a ward of the Grey Sisters,
// ORIGIN_EDGE loreXp) and emits 'fragmentFound' { id, set, order, found, of }; the last of a set
// emits 'setComplete' { set }. state.fragments = [ids] in the order found (save v10).

import { mulberry32, streamSeed, STREAM } from './rng.js';
import { gainXp, ORIGIN_EDGE } from './party.js';

/** @type {Record<string, { set: string, order: number, site: string, floor: number, via: 'chest' | 'shrine' | 'hall' }>} */
export const FRAGMENTS = {
  frag_vale_standing_order: { set: 'vale', order: 1, site: 'barrows', floor: 1, via: 'chest' },
  frag_vale_muster_roll: { set: 'vale', order: 2, site: 'barrows', floor: 2, via: 'shrine' },
  frag_vale_centurion_tablet: { set: 'vale', order: 3, site: 'barrows', floor: 2, via: 'hall' },
};
/** the fragments of each set, in reading order */
export const SETS = /** @type {Record<string, string[]>} */ ({});
for (const [id, f] of Object.entries(FRAGMENTS)) (SETS[f.set] ||= []).push(id);
for (const k of Object.keys(SETS)) SETS[k].sort((a, b) => FRAGMENTS[a].order - FRAGMENTS[b].order);
export const HALL_WAVES = 3, LORE_XP = 20;
const hashId = (s) => { let h = 2166136261; for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619); return h >>> 0; };

/** where a fragment lies on this world, if this is its floor: { via, key? } (key = 'x,y' of its chest
 * or shrine) or null @param {number} seed @param {string} id @param {any} world */
export function holderOf(seed, id, world) {
  const f = FRAGMENTS[id];
  if (!f || world.kind !== 'dungeon' || (world.site || 'barrows') !== f.site || (world.depth || 0) + 1 !== f.floor) return null;
  if (f.via === 'hall') return { via: 'hall' };
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
    const xp = Math.round(LORE_XP * h.level * (1 + edge)), lv = (m) => bus.emit('levelUp', { id: m.id, name: m.name, level: m.level });
    for (const m of state.party) if (!m.fallen) gainXp(m, xp, lv);
    const got = SETS[f.set].filter(has).length;
    bus.emit('fragmentFound', { id, set: f.set, order: f.order, found: got, of: SETS[f.set].length, xp });
    bus.emit('partyChanged', state.party);
    if (got === SETS[f.set].length) bus.emit('setComplete', { set: f.set });
  }
  const unfound = () => Object.keys(FRAGMENTS).filter((id) => !has(id));
  bus.on('looted', (e) => {
    const w = getWorld(), key = `${e.tx},${e.ty}`;
    for (const id of unfound()) { const h = holderOf(seed, id, w); if (h && h.key === key && h.via === e.kind) found(id); }
  });
  bus.on('battle', (e) => { if (e.on) hallWaves = 0; });
  bus.on('wave', (e) => {
    if (!e.cleared) return;
    const w = getWorld(), L = w.level; if (!L || !L.descentRoom || e.room !== L.descentRoom.id) return;
    hallWaves++;
    for (const id of unfound()) { const h = holderOf(seed, id, w); if (h && h.via === 'hall' && hallWaves >= HALL_WAVES) found(id); }
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
  return { varsFor, snapshot, restore, has, holder: (/** @type {string} */ id) => holderOf(seed, id, getWorld()) };
}
