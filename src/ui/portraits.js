// @ts-check
// portraits.js — a company member's portrait (GDD §6.1 v1.65; the owner, 2026-11-10: "do the party card portraits
// next"): the baked head and shoulders (<actor>.face.png) while a member looks as their look was baked, and their own
// face, rendered as the bake renders it (render3d/preview.js portraitOf), once they've a look of their own or wear a
// different helm or armour from their kit's. One portrait a look, cached and copied into every canvas that shows it
// (the cards re-render often: a copy is instant where a paint would flash). Where models are off (?world=off,
// ?figures=sprites) the baked one stands.

import { drawPortrait, PORTRAIT_W, PORTRAIT_H } from './actorart.js';
import { portraitOf } from '../render3d/preview.js';
import { CLASSES } from '../sim/party.js';
import { STARTER, STARTER_LOOK } from '../sim/items.js';

let models = true;
/** @param {boolean} on */
export const setPortraitModels = (on) => { models = on; };
const actorOf = (m) => m.actor || CLASSES[m.cls].actor;
const worn = (it) => (it ? it.base : null);
/** what shows in a head-and-shoulders: the face and build, the helm, the armour */
function lookOf(m) {
  const kit = STARTER_LOOK[actorOf(m)] || STARTER[m.cls] || {}, g = m.gear || {};
  const own = !m.appearance && worn(g.helm) === (kit.helm || null) && worn(g.armor) === (kit.armor || null);
  if (own) return null;                                                     // (as baked)
  const it = (x) => (x ? { base: x.base, r: 'common', up: 0 } : null);     // (a portrait's helm and armour as made: no light)
  return { appearance: m.appearance || null, gear: { helm: it(g.helm), armor: it(g.armor) } };
}
/** a canvas key for the member's portrait: their actor, or their actor and look @param {any} m */
export function portraitKey(m) {
  const a = actorOf(m), L = models ? lookOf(m) : null;
  if (!L) return a;
  const j = JSON.stringify(L); let h = 0x811c9dc5; for (let i = 0; i < j.length; i++) h = Math.imul(h ^ j.charCodeAt(i), 0x01000193);
  return `${a}#${(h >>> 0).toString(36)}`;
}
const cache = new Map();
/** the painted portrait for a key (the baked one at once; the member's own replaces it in every canvas showing it once
 * it's rendered) @param {string} key @param {any} m */
export function portraitCanvas(key, m) {
  if (cache.has(key)) return cache.get(key);
  const c = document.createElement('canvas'); c.width = PORTRAIT_W; c.height = PORTRAIT_H; cache.set(key, c);
  const copy = () => { for (const el of /** @type {NodeListOf<HTMLCanvasElement>} */ (document.querySelectorAll(`canvas[data-actor="${key}"]`))) { const y = el.getContext('2d'); if (!y) continue; y.clearRect(0, 0, el.width, el.height); y.drawImage(c, 0, 0); } };
  drawPortrait(c, actorOf(m), copy);
  const L = key.includes('#') ? lookOf(m) : null;
  if (L) portraitOf(actorOf(m), L).then((p) => { if (!p) return; const x = c.getContext('2d'); if (!x) return; x.clearRect(0, 0, c.width, c.height); x.drawImage(p, 0, 0, c.width, c.height); copy(); });
  return c;
}
/** paint a member's portrait into a canvas (its data-actor set to their key) @param {HTMLCanvasElement} cv @param {any} m */
export function paintPortrait(cv, m) {
  const src = portraitCanvas(cv.dataset.actor || portraitKey(m), m), x = cv.getContext('2d'); if (!x) return;
  x.clearRect(0, 0, cv.width, cv.height); x.drawImage(src, 0, 0, cv.width, cv.height);
}
