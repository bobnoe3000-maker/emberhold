// @ts-check
// profile.js — the player's local profile, the guest's identity (development plan §2.2: "First launch creates a local
// profile (a uuid) with no sign-up and no network"; the owner, 2026-11-13: "Lets do the account setup including guest.
// Local then guide me through how to setup online services"). One a device, not one a slot: the three game slots are
// this player's. Made at the first launch, kept in localStorage, read without a network, so a guest plays in airplane
// mode. When online accounts arrive (docs/online-setup.md), linking one keeps this id's heroes: Supabase's anonymous
// sign-in is upgraded in place (net/account.js), and the profile records the link.
//
// A display name is the player's to choose, filtered as a hero's name is (sim/party.js cleanName, sim/names.js
// nameRefusal: the same rule everywhere), and carries a 4-digit tag so two players may share a name (Brann#4821).
// Presentation and persistence only: nothing here reaches the sim or a save.

import { cleanName, NAME_MAX } from '../sim/party.js';
import { nameRefusal } from '../sim/names.js';

export const PROFILE_KEY = 'emberfall.profile';
export const PROFILE_VERSION = 1;

/** @typedef {{ provider: 'apple' | 'google' | 'email', at: number, email?: string }} Link */
/** @typedef {{ v: number, id: string, name: string, tag: string, createdAt: number, link: Link | null }} Profile */

/** a v4 uuid: the browser's own where it has one */
function uuid() {
  const c = globalThis.crypto;
  if (c && typeof c.randomUUID === 'function') return c.randomUUID();
  const b = new Uint8Array(16);
  if (c && typeof c.getRandomValues === 'function') c.getRandomValues(b); else for (let i = 0; i < 16; i++) b[i] = Math.floor(Math.random() * 256);
  b[6] = (b[6] & 0x0f) | 0x40; b[8] = (b[8] & 0x3f) | 0x80;
  const h = [...b].map((x) => x.toString(16).padStart(2, '0')).join('');
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
}
/** four digits, 1000–9999, from the id (so a profile's tag never changes) @param {string} id */
export function tagOf(id) {
  let n = 0; for (const ch of id.replace(/-/g, '')) n = (n * 31 + parseInt(ch, 16)) % 9000;
  return String(1000 + n);
}

/** a stored profile, whole and of this version, or null @param {any} p @returns {Profile | null} */
function valid(p) {
  if (!p || typeof p !== 'object' || p.v !== PROFILE_VERSION || typeof p.id !== 'string' || !/^[0-9a-f-]{36}$/.test(p.id)) return null;
  const name = cleanName(p.name) || 'Guest';
  return { v: PROFILE_VERSION, id: p.id, name: nameRefusal(name) ? 'Guest' : name, tag: tagOf(p.id), createdAt: Number(p.createdAt) || 0,
    link: p.link && ['apple', 'google', 'email'].includes(p.link.provider) ? { provider: p.link.provider, at: Number(p.link.at) || 0, ...(p.link.email ? { email: String(p.link.email) } : {}) } : null };
}

/** the storage the profile lives in (tests hand their own) */
const store = () => globalThis.localStorage;

/** the profile as stored, or null (none yet, or unreadable) @param {Storage} [s] @returns {Profile | null} */
export function readProfile(s = store()) {
  try { return valid(JSON.parse(s.getItem(PROFILE_KEY) || 'null')); } catch { return null; }
}
/** @param {Profile} p @param {Storage} [s] */
function writeProfile(p, s = store()) {
  try { s.setItem(PROFILE_KEY, JSON.stringify(p)); } catch { /* a private window: this page's profile lasts the page */ }
  return p;
}

/** the profile, made at the first launch (a guest called Guest) @param {Storage} [s] @param {number} [now] @returns {Profile} */
export function ensureProfile(s = store(), now = Date.now()) {
  const had = readProfile(s); if (had) return had;
  const id = uuid();
  return writeProfile({ v: PROFILE_VERSION, id, name: 'Guest', tag: tagOf(id), createdAt: now, link: null }, s);
}

/**
 * a new display name, if the name rule takes it (a hero's: letters, spaces and hyphens, NAME_MAX long, nothing on the
 * refused lists). @param {string} raw @param {Storage} [s]
 * @returns {{ ok: true, profile: Profile } | { ok: false, why: string }}
 */
export function setDisplayName(raw, s = store()) {
  const name = cleanName(raw);
  if (!name) return { ok: false, why: `A name of letters, spaces or hyphens, up to ${NAME_MAX}` };
  const no = nameRefusal(name); if (no) return { ok: false, why: no };
  const p = ensureProfile(s);
  return { ok: true, profile: writeProfile({ ...p, name }, s) };
}

/** the profile's link to an online account recorded (net/account.js, once signed in) @param {Link | null} link @param {Storage} [s] */
export function setLink(link, s = store()) { return writeProfile({ ...ensureProfile(s), link }, s); }

/** the name as others see it: Brann#4821 @param {Profile} p */
export const handleOf = (p) => `${p.name}#${p.tag}`;
