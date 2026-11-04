// @ts-check
// settings.js — the menu's Graphics settings, kept per device (docs/luminati-port-plan.md §12, the owner, 2026-10-31):
//   · the world's renderer: 'emberlit', the game's own (the default), or 'luminati', the trial of Luminati drawing the
//     world under the same sim and UI (render3d/hybrid.js; phase 0 of the port plan);
//   · the depth of field: Luminati's diorama blur, 'soft' (the prototype's eased blur) or 'off'. The owner: "Depth of
//     field blur is a new menu setting." It applies to the Luminati renderer only (Emberlit has no lens).
//   · the brightness outdoors by the part of the day (the owner, 2026-11-04: "In game add a setting for me to dial in
//     brightness for day, dusk, dawn and night so i can better test and confirm settings"): a percentage a part, 100 the
//     shipped look (render3d/bright.js), for the Luminati renderer (the menu's Brightness tray, ui/brightness.js).
// ?renderer=emberlit|luminati overrides the stored choice for one page load (tests, captures, a link to try it).
// Presentation only: nothing here reaches the sim or a save.

const KEY = 'emberfall.graphics';
/** @typedef {{ dawn: number, day: number, dusk: number, night: number }} Bright percentages, 100 the shipped look */
/** @typedef {{ renderer: 'emberlit' | 'luminati', dof: 'soft' | 'off', bright: Bright }} Graphics */
/** @type {Graphics} */
const DEFAULTS = { renderer: 'emberlit', dof: 'soft', bright: { dawn: 100, day: 100, dusk: 100, night: 100 } };
/** the dial's range and step, percent */
export const BRIGHT_MIN = 25, BRIGHT_MAX = 300, BRIGHT_STEP = 5;
/** a stored dial, each part a whole step within the range (100 where missing or unreadable) @param {any} b @returns {Bright} */
function brightOf(b) {
  const out = { ...DEFAULTS.bright };
  for (const k of Object.keys(out)) { const v = b && +b[k]; if (Number.isFinite(v)) out[k] = Math.min(BRIGHT_MAX, Math.max(BRIGHT_MIN, Math.round(v / BRIGHT_STEP) * BRIGHT_STEP)); }
  return out;
}
const RENDERERS = ['emberlit', 'luminati'], DOFS = ['soft', 'off'];

/** the stored settings (the defaults where storage is missing or unreadable) @returns {Graphics} */
export function readGraphics() {
  let v;
  try { v = JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch { v = {}; }
  return { renderer: RENDERERS.includes(v.renderer) ? v.renderer : DEFAULTS.renderer, dof: DOFS.includes(v.dof) ? v.dof : DEFAULTS.dof, bright: brightOf(v.bright) };
}
/** store a change (merged over what's stored) @param {Partial<Graphics>} patch @returns {Graphics} */
export function writeGraphics(patch) {
  const cur = readGraphics(), next = { ...cur, ...patch, bright: brightOf({ ...cur.bright, ...(patch.bright || {}) }) };
  try { localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* private window: the change lasts this page */ }
  return next;
}
/** the renderer this page load uses: ?renderer= first, then the stored choice @returns {'emberlit' | 'luminati'} */
export function rendererFor(search = typeof location === 'undefined' ? '' : location.search) {
  const q = new URLSearchParams(search).get('renderer');
  return q === 'luminati' || q === 'emberlit' ? q : readGraphics().renderer;
}
