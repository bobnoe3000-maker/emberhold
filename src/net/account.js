// @ts-check
// account.js — the player's account, as the game sees it (development plan §2.2; architecture A7: Supabase, guest-
// first). Today it's the guest alone: the local profile (net/profile.js), playable with no network. The online part
// waits on the owner's Supabase project (docs/online-setup.md): with no online config every way of linking says it isn't
// set up yet and nothing touches the network. Once `online.json` names a project, `linkWith` will sign the guest in
// anonymously and upgrade that same user by linking Apple, Google or an email code (Supabase keeps the uuid, so the
// heroes stay), and the Account window will show the link, the cloud save's last sync, Sign out and Delete account.
//
// The online config: `online.json` at the site's root (committed: the project's URL and its anon key are public by
// design; the service-role key never ships): { "supabaseUrl": "https://….supabase.co", "supabaseAnonKey": "…",
// "providers": ["email", "google", "apple"] }. Missing or unreadable: offline, guest only.

import { ensureProfile, setDisplayName, handleOf } from './profile.js';

/** @typedef {import('./profile.js').Profile} Profile */
/** @typedef {{ supabaseUrl: string, supabaseAnonKey: string, providers: string[] }} Online */
/** @typedef {'apple' | 'google' | 'email'} Provider */

export const PROVIDERS = /** @type {Provider[]} */ (['apple', 'google', 'email']);
export const PROVIDER_LABEL = { apple: 'Sign in with Apple', google: 'Sign in with Google', email: 'Email me a code' };

/** the online config, whole, or null @param {any} c @returns {Online | null} */
export function onlineOf(c) {
  if (!c || typeof c !== 'object') return null;
  const url = String(c.supabaseUrl || ''), key = String(c.supabaseAnonKey || '');
  if (!/^https:\/\/[a-z0-9-]+\.supabase\.co\/?$/.test(url) || key.length < 20) return null;
  const providers = Array.isArray(c.providers) ? c.providers.filter((p) => PROVIDERS.includes(p)) : ['email'];
  return { supabaseUrl: url.replace(/\/$/, ''), supabaseAnonKey: key, providers };
}

/** the online config from the site (online.json), or null: offline (none there, no network, unreadable) @returns {Promise<Online | null>} */
export async function loadOnline(url = './online.json') {
  try { const r = await fetch(url, { cache: 'no-cache' }); return r.ok ? onlineOf(await r.json()) : null; } catch { return null; }
}

/**
 * The account. `state` is what the Account window draws: the profile, the handle, whether online accounts are set up.
 * @param {{ online?: Online | null, storage?: Storage }} [o]
 */
export function createAccount({ online = null, storage = globalThis.localStorage } = {}) {
  let profile = ensureProfile(storage);
  const subs = new Set();
  const changed = () => { for (const f of subs) f(api.state); };
  const api = {
    get state() {
      return { profile, handle: handleOf(profile), guest: !profile.link, online: !!online, providers: online ? online.providers : [] };
    },
    /** a new display name (the name rule as a hero's) @param {string} name */
    rename(name) { const r = setDisplayName(name, storage); if (r.ok) { profile = r.profile; changed(); } return r; },
    /**
     * link this guest to an online account. Not set up yet: says so and does nothing.
     * @param {Provider} provider @returns {Promise<{ ok: boolean, why?: string }>}
     */
    async linkWith(provider) {
      if (!online) return { ok: false, why: 'Online accounts aren’t set up yet: your heroes are safe on this device.' };
      if (!online.providers.includes(provider)) return { ok: false, why: 'That sign-in isn’t offered yet.' };
      return { ok: false, why: 'Online accounts are on their way: this build can’t link one yet.' };   // (net/supabase.js, once the project is up)
    },
    /** the online config, once the site's is read (loadOnline): offline until then @param {Online | null} o */
    setOnline(o) { online = o; changed(); },
    /** @param {(s: any) => void} f */
    onChange(f) { subs.add(f); return () => subs.delete(f); },
  };
  return api;
}
