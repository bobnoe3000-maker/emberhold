// @ts-check
// settings.js — the menu's Graphics settings, kept per device (docs/luminati-port-plan.md §12, the owner, 2026-10-31):
//   · the world's renderer: 'emberlit', the game's own (the default), or 'luminati', the trial of Luminati drawing the
//     world under the same sim and UI (render3d/hybrid.js; phase 0 of the port plan);
//   · the depth of field: Luminati's diorama blur, 'soft' (the prototype's eased blur) or 'off'. The owner: "Depth of
//     field blur is a new menu setting." It applies to the Luminati renderer only (Emberlit has no lens).
// ?renderer=emberlit|luminati overrides the stored choice for one page load (tests, captures, a link to try it).
// Presentation only: nothing here reaches the sim or a save.

const KEY = 'emberfall.graphics';
/** @typedef {{ renderer: 'emberlit' | 'luminati', dof: 'soft' | 'off' }} Graphics */
/** @type {Graphics} */
const DEFAULTS = { renderer: 'emberlit', dof: 'soft' };
const RENDERERS = ['emberlit', 'luminati'], DOFS = ['soft', 'off'];

/** the stored settings (the defaults where storage is missing or unreadable) @returns {Graphics} */
export function readGraphics() {
  let v;
  try { v = JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch { v = {}; }
  return { renderer: RENDERERS.includes(v.renderer) ? v.renderer : DEFAULTS.renderer, dof: DOFS.includes(v.dof) ? v.dof : DEFAULTS.dof };
}
/** store a change (merged over what's stored) @param {Partial<Graphics>} patch @returns {Graphics} */
export function writeGraphics(patch) {
  const next = { ...readGraphics(), ...patch };
  try { localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* private window: the change lasts this page */ }
  return next;
}
/** the renderer this page load uses: ?renderer= first, then the stored choice @returns {'emberlit' | 'luminati'} */
export function rendererFor(search = typeof location === 'undefined' ? '' : location.search) {
  const q = new URLSearchParams(search).get('renderer');
  return q === 'luminati' || q === 'emberlit' ? q : readGraphics().renderer;
}
