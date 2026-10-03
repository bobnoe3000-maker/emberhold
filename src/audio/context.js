// @ts-check
// context.js — the one AudioContext the game makes (docs/sound-plan.md §3, A15). The intro's score (cutscene/score.js)
// and the game's sound (audio/engine.js) share it: phones limit how many a page may open, and one context means one
// unlock. Browsers only let it start after a gesture, so it's made on the first call from a tap, not at load.

/** @type {AudioContext | null} */
let ac = null;

/** the shared context, made on first use; null where there's no WebAudio (node, a locked-down WebView) */
export function audioContext() {
  if (ac) return ac;
  const w = /** @type {any} */ (globalThis), C = w.AudioContext || w.webkitAudioContext;
  if (!C) return null;
  try { ac = new C(); } catch { ac = null; }
  return ac;
}

/** resume after a gesture (iOS starts every context suspended) */
export function resumeAudio() { if (ac && ac.state === 'suspended') ac.resume().catch(() => {}); }
