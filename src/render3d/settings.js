// @ts-check
// settings.js — the menu's Graphics settings, kept per device (docs/luminati-port-plan.md §12, the owner, 2026-10-31).
// The world is Luminati's (render3d/hybrid.js): the owner, 2026-11-09, "we are going to stick with the Luminati version"
// (docs/luminati-only-cleanup.md, step 1). There's no choice of renderer any more; what's left to set:
//   · the depth of field: Luminati's diorama blur, 'soft' (the prototype's eased blur) or 'off'. The owner: "Depth of
//     field blur is a new menu setting." It applies to the Luminati renderer only (Emberlit has no lens).
//   · the brightness outdoors by the part of the day (the owner, 2026-11-04: "In game add a setting for me to dial in
//     brightness for day, dusk, dawn and night so i can better test and confirm settings"): a percentage a part, 100 the
//     shipped look (render3d/bright.js), for the Luminati renderer (the menu's Brightness tray, ui/brightness.js).
//   · the hit feel (the feel pass, docs/combat-fx.md): a blow's hit-stop and camera jolt, 'full', 'light' (half) or 'off',
//     on both renderers, for anyone who'd rather the screen kept still.
//   · the frame rate on screen (the owner, 2026-11-09: "add a menu option to toggle on/off the frame rate so I can
//     monitor"): 'off' or 'on' (ui/fps.js).
// ?renderer=emberlit is a developer's escape until Emberlit's world painting is removed (the cleanup's step 4): Emberlit
// paints the world in this tab, kept for its later loads (a slot's switch drops the URL's flags); ?renderer=luminati ends
// it. The browser suite and the capture tools use it; no player sees it. A stored `renderer` from before is ignored.
// Presentation only: nothing here reaches the sim or a save.

const KEY = 'emberfall.graphics';
/** @typedef {{ dawn: number, day: number, dusk: number, night: number }} Bright percentages, 100 the shipped look */
/** @typedef {{ dof: 'soft' | 'off', bright: Bright, feel: 'full' | 'light' | 'off', fps: 'off' | 'on' }} Graphics */
/** @type {Graphics} */
const DEFAULTS = { dof: 'soft', bright: { dawn: 100, day: 100, dusk: 100, night: 100 }, feel: 'full', fps: 'off' };
/** the dial's range and step, percent */
export const BRIGHT_MIN = 25, BRIGHT_MAX = 300, BRIGHT_STEP = 5;
/** a stored dial, each part a whole step within the range (100 where missing or unreadable) @param {any} b @returns {Bright} */
function brightOf(b) {
  const out = { ...DEFAULTS.bright };
  for (const k of Object.keys(out)) { const v = b && +b[k]; if (Number.isFinite(v)) out[k] = Math.min(BRIGHT_MAX, Math.max(BRIGHT_MIN, Math.round(v / BRIGHT_STEP) * BRIGHT_STEP)); }
  return out;
}
const DOFS = ['soft', 'off'], FEELS = ['full', 'light', 'off'], FPS = ['off', 'on'];
/** the hit feel's strength: hit-stop and camera jolt × this @param {string} f */
export const feelK = (f) => (f === 'off' ? 0 : f === 'light' ? 0.5 : 1);

/** the stored settings (the defaults where storage is missing or unreadable) @returns {Graphics} */
export function readGraphics() {
  let v;
  try { v = JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch { v = {}; }
  return { dof: DOFS.includes(v.dof) ? v.dof : DEFAULTS.dof, bright: brightOf(v.bright), feel: FEELS.includes(v.feel) ? v.feel : DEFAULTS.feel, fps: FPS.includes(v.fps) ? v.fps : DEFAULTS.fps };
}
/** store a change (merged over what's stored) @param {Partial<Graphics>} patch @returns {Graphics} */
export function writeGraphics(patch) {
  const cur = readGraphics(), next = { ...cur, ...patch, bright: brightOf({ ...cur.bright, ...(patch.bright || {}) }) };
  delete /** @type {any} */ (next).renderer;   // (the choice there was before Luminati only)
  try { localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* private window: the change lasts this page */ }
  return next;
}
const ESCAPE = 'emberfall.renderer';
/** the renderer this page load uses: Luminati, but for a developer's ?renderer=emberlit, kept for this tab (above)
 * @returns {'emberlit' | 'luminati'} */
export function rendererFor(search = typeof location === 'undefined' ? '' : location.search) {
  const q = new URLSearchParams(search).get('renderer');
  let v = q === 'emberlit' || q === 'luminati' ? q : null;
  try { if (v) sessionStorage.setItem(ESCAPE, v); else v = sessionStorage.getItem(ESCAPE); } catch { /* no storage: this load only */ }
  return v === 'emberlit' ? 'emberlit' : 'luminati';
}
