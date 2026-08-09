// save.js — persistence layer. Browser-only (localStorage + lifecycle events);
// never imported by /sim, so the sim stays headless and node-testable.
//
// A save is small by design: world seed + settings + the diff overlay. The world
// itself is a pure function of the seed (see world.js), so we never store tiles —
// only what the player changed. Schema is versioned from day one.

// v2: the world model changed from an infinite field to generated dungeon levels,
// so v1 saved positions no longer land on floor. Refusing them (migrate → null)
// gives existing players a fresh spawn instead of stranding them in the abyss.
export const SAVE_VERSION = 2;
const KEY = 'emberhold.save';
const AUTOSAVE_MS = 15000;

// migrate(raw) -> normalized save at SAVE_VERSION, or null if unusable.
// Future versions add a step per bump; v1 is the baseline, so anything that
// isn't already v1 is refused rather than half-read.
function migrate(raw) {
  if (!raw || typeof raw !== 'object') return null;
  if (raw.version === SAVE_VERSION) return raw;
  // e.g. when SAVE_VERSION becomes 2:
  //   if (raw.version === 1) raw = { ...raw, version: 2, data: up_1_to_2(raw.data) };
  return null;                       // unknown / newer / un-migratable
}

export function writeSave(sim) {
  try {
    const payload = { version: SAVE_VERSION, savedAt: Date.now(), data: sim.snapshot() };
    localStorage.setItem(KEY, JSON.stringify(payload));
    return true;
  } catch (e) {                      // quota, private-mode, disabled storage
    return false;
  }
}

export function readSave() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? migrate(JSON.parse(raw)) : null;
  } catch (e) {                      // malformed JSON, storage unavailable
    return null;
  }
}

// Load a prior session into `sim`. Only restores a save for the SAME world seed
// (a different seed = a different world; leave the fresh one alone).
export function loadInto(sim) {
  const save = readSave();
  if (!save || save.data?.seed !== sim.world.seed) return false;
  sim.restore(save.data);
  return true;
}

export function clearSave() {
  try { localStorage.removeItem(KEY); } catch (e) { /* nothing to do */ }
}

// Wire autosave: a steady interval plus the mobile lifecycle moments that matter
// (tab hidden, page unloaded) — these fire when the OS is about to reclaim us.
export function createAutosave(sim, { intervalMs = AUTOSAVE_MS } = {}) {
  const save = () => writeSave(sim);
  let timer = setInterval(save, intervalMs);

  const onHide = () => { if (document.hidden) save(); };
  document.addEventListener('visibilitychange', onHide);
  window.addEventListener('pagehide', save);       // more reliable than unload on mobile

  return {
    save,
    stop() {
      clearInterval(timer); timer = null;
      document.removeEventListener('visibilitychange', onHide);
      window.removeEventListener('pagehide', save);
    },
  };
}
