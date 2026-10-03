// @ts-check
// settings.js — the player's sound settings (the owner, 2026-10-03: "sound should start moderate, with a game menu
// of settings to turn on and off ambient sounds and attack/spell fx, and NPCs spawn and death sounds"). Kept per
// device in localStorage, never in the save: a phone on the bus and a laptop at home want different sound.
//   volume   0..1, the master level (0.6: moderate, the default)
//   ambient  the Vale's and the dungeons' ambience: the creek, the drips, wind, birds, owls, fire
//   combat   attacks, spells and blows, and the effects that go with play (loot, level up, chests, stairs)
//   steps    footsteps
//   voices   foes' cries as they arrive, and as they fall

export const SOUND_KEY = 'emberfall.sound';
/** @typedef {{ volume: number, ambient: boolean, combat: boolean, steps: boolean, voices: boolean }} SoundSettings */
/** @type {SoundSettings} */
export const DEFAULTS = Object.freeze({ volume: 0.6, ambient: true, combat: true, steps: true, voices: true });

/** a settings object made whole and in range, whatever was stored (an old version, a hand edit, garbage)
 * @param {any} v @returns {SoundSettings} */
export function cleanSettings(v) {
  const o = v && typeof v === 'object' ? v : {}, vol = Number(o.volume);
  const flag = (k) => (typeof o[k] === 'boolean' ? o[k] : DEFAULTS[k]);
  return { volume: Number.isFinite(vol) ? Math.min(1, Math.max(0, vol)) : DEFAULTS.volume, ambient: flag('ambient'), combat: flag('combat'), steps: flag('steps'), voices: flag('voices') };
}

/** @param {{ getItem: (k: string) => string | null } | null} [store] @returns {SoundSettings} */
export function loadSettings(store = globalThis.localStorage) {
  try { const raw = store && store.getItem(SOUND_KEY); return cleanSettings(raw ? JSON.parse(raw) : null); } catch { return cleanSettings(null); }
}

/** @param {SoundSettings} s @param {{ setItem: (k: string, v: string) => void } | null} [store] */
export function saveSettings(s, store = globalThis.localStorage) {
  try { if (store) store.setItem(SOUND_KEY, JSON.stringify(cleanSettings(s))); } catch { /* private mode: kept for this session only */ }
}
