// The local guest profile and the account (net/profile.js, net/account.js; development plan §2.2: "First launch creates
// a local profile (a uuid) with no sign-up and no network"; the owner, 2026-11-13: "Lets do the account setup including
// guest"). No network anywhere here: a guest plays in airplane mode.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ensureProfile, readProfile, setDisplayName, tagOf, handleOf, PROFILE_KEY } from '../src/net/profile.js';
import { createAccount, onlineOf } from '../src/net/account.js';

const memory = () => { const m = new Map(); return /** @type {any} */ ({ getItem: (k) => m.get(k) ?? null, setItem: (k, v) => m.set(k, String(v)), m }); };

test('the first launch makes a guest profile, once: a uuid, the name Guest, a tag of its own that never changes', () => {
  const s = memory();
  assert.equal(readProfile(s), null, 'none before the first launch');
  const p = ensureProfile(s, 1763000000000);
  assert.match(p.id, /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
  assert.equal(p.name, 'Guest'); assert.equal(p.link, null); assert.equal(p.createdAt, 1763000000000);
  assert.match(p.tag, /^[1-9][0-9]{3}$/); assert.equal(p.tag, tagOf(p.id));
  assert.deepEqual(ensureProfile(s, 1), p, 'the second launch finds the same profile');
  assert.equal(handleOf(p), `Guest#${p.tag}`);
});

test('a display name follows the hero\'s name rule: cleaned, the refused names refused, kept', () => {
  const s = memory(); ensureProfile(s);
  assert.equal(setDisplayName('  Brann  of   Vale ', s).ok, true);
  assert.equal(readProfile(s).name, 'Brann of Vale');
  const rude = setDisplayName('Shitlord', s); assert.equal(rude.ok, false); assert.match(rude.why, /not allowed/);
  const staff = setDisplayName('Admin', s); assert.equal(staff.ok, false);
  assert.equal(setDisplayName('!!!', s).ok, false, 'nothing left after cleaning');
  assert.equal(readProfile(s).name, 'Brann of Vale', 'a refused name changes nothing');
});

test('an unreadable or tampered profile is never half-read', () => {
  const s = memory();
  s.setItem(PROFILE_KEY, '{not json'); assert.equal(readProfile(s), null);
  s.setItem(PROFILE_KEY, JSON.stringify({ v: 1, id: 'not-a-uuid', name: 'X' })); assert.equal(readProfile(s), null);
  const p = ensureProfile(s); s.setItem(PROFILE_KEY, JSON.stringify({ ...p, name: 'Fuuuck', tag: '0001' }));
  const r = readProfile(s); assert.equal(r.name, 'Guest', 'a refused stored name read as Guest'); assert.equal(r.tag, tagOf(p.id), 'the tag comes from the id');
});

test('the account offline: a guest, every link says it isn\'t set up and touches nothing; the online config is checked whole', async () => {
  const s = memory(), a = createAccount({ storage: s });
  assert.equal(a.state.guest, true); assert.equal(a.state.online, false); assert.deepEqual(a.state.providers, []);
  const seen = []; a.onChange((st) => seen.push(st.handle));
  assert.equal(a.rename('Wick').ok, true); assert.equal(a.state.handle, `Wick#${a.state.profile.tag}`); assert.equal(seen.length, 1);
  const r = await a.linkWith('google'); assert.equal(r.ok, false); assert.match(r.why, /set up/);
  assert.equal(readProfile(s).link, null, 'no link recorded');
  assert.equal(onlineOf(null), null);
  assert.equal(onlineOf({ supabaseUrl: 'http://evil.example.com', supabaseAnonKey: 'x'.repeat(40) }), null, 'only a supabase.co project over https');
  assert.equal(onlineOf({ supabaseUrl: 'https://abcd.supabase.co', supabaseAnonKey: 'short' }), null);
  assert.deepEqual(onlineOf({ supabaseUrl: 'https://abcd.supabase.co/', supabaseAnonKey: 'k'.repeat(40), providers: ['google', 'myspace'] }),
    { supabaseUrl: 'https://abcd.supabase.co', supabaseAnonKey: 'k'.repeat(40), providers: ['google'] });
  a.setOnline(onlineOf({ supabaseUrl: 'https://abcd.supabase.co', supabaseAnonKey: 'k'.repeat(40), providers: ['email'] }));
  assert.equal(a.state.online, true); assert.deepEqual(a.state.providers, ['email']);
  assert.equal((await a.linkWith('apple')).ok, false, 'a provider not offered');
});
