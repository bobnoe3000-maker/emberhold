// @ts-check
// preview.js — a figure on its own, as the model you'll play (GDD §6.1 v1.64; docs/character-look-plan.md §5): the
// windows' live preview, opened with a window and let go when it closes. Luminati's bundle (the same versioned entry
// hybrid.js imports, so the same module and the same models) builds it in its own small canvas (world.js
// createPreview). Anything that fails (no bundle, no WebGL, no model, a lost context) says so to the caller, which
// keeps its still image: the rule of ui/worldfail.js, never a blank.

import { VENDOR } from './hybrid.js';

let mod = null;
/** the bundle, once @returns {Promise<any>} */
function bundle() {
  if (!mod) {
    const at = new URL(VENDOR, import.meta.url);
    mod = fetch(new URL('version.json', at), { cache: 'no-cache' }).then((r) => (r.ok ? r.json() : null)).catch(() => null)
      .then((ver) => import(ver && ver.v ? `${at.href}?v=${ver.v}` : VENDOR));
    mod.catch(() => { mod = null; });
  }
  return mod;
}
/** open a preview on `canvas` @param {HTMLCanvasElement} canvas @param {(e: any) => void} onError
 * @returns {Promise<{ show: (actor: string) => Promise<boolean>, attack: () => void, close: () => void } | null>} null: none to be had */
export async function openPreview(canvas, onError) {
  try {
    const m = await bundle();
    if (!m.createPreview) return null;                    // (an older bundle)
    return m.createPreview(canvas, { assets: new URL('../../assets/', import.meta.url).href, onError });
  } catch (e) { onError(e); return null; }
}
/** a member's own portrait (world.js renderPortrait), or null where none can be had @param {string} actor @param {any} look
 * @returns {Promise<HTMLCanvasElement|null>} */
export async function portraitOf(actor, look) {
  try { const m = await bundle(); return m.renderPortrait ? await m.renderPortrait(actor, look, { assets: new URL('../../assets/', import.meta.url).href }) : null; }
  catch (e) { console.warn('[portrait]', e); return null; }
}
