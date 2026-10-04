// @ts-check
// settings.js — the player's sound settings. Kept per device in localStorage, never in the save: a phone on the bus and
// a laptop at home want different sound.
//   the owner, 2026-10-03: "sound should start moderate, with a game menu of settings to turn on and off ambient sounds
//   and attack/spell fx, and NPCs spawn and death sounds"; then, the same day: "instead of on or off for each effect add
//   a volume slider. Include a slider option for any background music", and "default foot steps should be 25% of
//   current volume".
//   volume   0..1, the master level (0.6: moderate, the default)
//   music    0..1, the music (the intro's score, under the title and creation too); 1 is the level it was made at
//   ambient  0..1, the Vale's and the dungeons' ambience: the creek, wind, rain, fire, and the drips, birds and owls
//   combat   0..1, attacks, spells and blows, and the effects that go with play (loot, level up, chests, stairs)
//   steps    0..1, footsteps (0.25: a quarter of their level before the sliders)
//   voices   0..1, foes' cries as they arrive, and as they fall
// Each is a gain on its bus (audio/engine.js; the music's on the score, cutscene/score.js): 1 is the bus as it was
// mixed, 0 is off. Older settings held on/off switches: on reads as the default level, off as 0.
//
// One copy for the page: the engine and the intro's score both read it here, and hear each change (onSoundSettings).

export const SOUND_KEY = 'emberfall.sound';
const OLD_MUSIC_KEY = 'emberfall.music';            // the intro's ♪ switch, before the music had a slider: 'on' | 'off'
/** @typedef {{ volume: number, music: number, ambient: number, combat: number, steps: number, voices: number }} SoundSettings */
/** @type {SoundSettings} */
export const DEFAULTS = Object.freeze({ volume: 0.6, music: 1, ambient: 1, combat: 1, steps: 0.25, voices: 1 });
export const LEVELS = /** @type {const} */ (['music', 'ambient', 'combat', 'steps', 'voices']);

/** a settings object made whole and in range, whatever was stored (an older version, a hand edit, garbage)
 * @param {any} v @returns {SoundSettings} */
export function cleanSettings(v) {
  const o = v && typeof v === 'object' ? v : {};
  const level = (k) => {
    const x = o[k];
    if (typeof x === 'boolean') return x ? DEFAULTS[k] : 0;               // (a switch, from before the sliders)
    const n = typeof x === 'number' ? x : NaN;
    return Number.isFinite(n) ? Math.min(1, Math.max(0, n)) : DEFAULTS[k];
  };
  return { volume: level('volume'), music: level('music'), ambient: level('ambient'), combat: level('combat'), steps: level('steps'), voices: level('voices') };
}

/** @param {{ getItem: (k: string) => string | null } | null} [store] @returns {SoundSettings} */
export function loadSettings(store = globalThis.localStorage) {
  try {
    const raw = store && store.getItem(SOUND_KEY), o = raw ? JSON.parse(raw) : {};
    if (o && typeof o === 'object' && !('music' in o) && store && store.getItem(OLD_MUSIC_KEY) === 'off') o.music = 0;   // the intro's old ♪ off
    return cleanSettings(o);
  } catch { return cleanSettings(null); }
}

/** @param {SoundSettings} s @param {{ setItem: (k: string, v: string) => void } | null} [store] */
export function saveSettings(s, store = globalThis.localStorage) {
  try { if (store) store.setItem(SOUND_KEY, JSON.stringify(cleanSettings(s))); } catch { /* private mode: kept for this session only */ }
}

/** @type {SoundSettings | null} */ let current = null;
/** @type {Set<(s: SoundSettings) => void>} */ const subs = new Set();
/** the page's settings (loaded on first use) @returns {SoundSettings} */
export function soundSettings() { return current || (current = loadSettings()); }
/** change some settings: kept, and every reader told @param {Partial<SoundSettings>} s @returns {SoundSettings} */
export function setSoundSettings(s) {
  current = cleanSettings({ ...soundSettings(), ...s }); saveSettings(current);
  for (const f of subs) f(current);
  return current;
}
/** hear each change @param {(s: SoundSettings) => void} fn @returns {() => void} stop hearing */
export function onSoundSettings(fn) { subs.add(fn); return () => { subs.delete(fn); }; }
