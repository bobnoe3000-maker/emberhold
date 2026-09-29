// @ts-check
// actorart.js — figures and portraits for the windows. Portraits are the baked head-and-shoulders
// <actor>.face.png (96 × 112, lit, tools/actor-lab renderPortrait — art critic pass 4); an actor
// without one falls back to a crop of its atlas (assets/actors/<actor>.alb.png: 102 px rows per
// facing, the camera-facing idle frame is row 2, frame 0). Portrait canvases are 96 × 112 in any
// CSS size, drawn smooth. The character window's figure is the baked, lit and posed
// <actor>.fig.png (drawCharacter). Shared by the party cards, the sheet, the party screen, the
// dialogue window, the title and creation.

/** @type {Map<string, HTMLImageElement>} */
const imgs = new Map();

/** Paint an atlas region onto a canvas (brightened: the albedo alone reads dark off the lit scene).
 * @param {HTMLCanvasElement} cv @param {string} actor @param {number} sx @param {number} sy
 * @param {number} sw @param {number} sh @param {number} [bright] */
export function drawActor(cv, actor, sx, sy, sw, sh, bright = 1.9) {
  let img = imgs.get(actor);
  if (!img) { img = new Image(); img.src = `./assets/actors/${actor}.alb.png`; imgs.set(actor, img); }
  const im = img;
  const paint = () => {
    const x = cv.getContext('2d'); if (!x) return;
    x.imageSmoothingEnabled = false; x.clearRect(0, 0, cv.width, cv.height);
    x.filter = `brightness(${bright}) saturate(1.12)`; x.drawImage(im, sx, 2 * 102 + sy, sw, sh, 0, 0, cv.width, cv.height);
  };
  if (im.complete && im.naturalWidth) paint(); else im.addEventListener('load', paint, { once: true });
}
/** @type {Map<string, Promise<HTMLImageElement|null>>} */
const faces = new Map();
const faceOf = (/** @type {string} */ actor) => {
  let f = faces.get(actor);
  if (!f) { f = new Promise((res) => { const im = new Image(); im.onload = () => res(im); im.onerror = () => res(null); im.src = `./assets/actors/${actor}.face.png`; }); faces.set(actor, f); }
  return f;
};
export const PORTRAIT_W = 96, PORTRAIT_H = 112;
/** head and shoulders: the baked portrait, else a crop of the atlas; `done` runs once it's painted
 * @param {HTMLCanvasElement} cv @param {string} actor @param {() => void} [done] */
export function drawPortrait(cv, actor, done) {
  faceOf(actor).then((img) => {
    if (!img) { drawActor(cv, actor, 22, 26, 44, 52); if (done) setTimeout(done, 60); return; }
    const x = cv.getContext('2d'); if (!x) return;
    x.imageSmoothingEnabled = true; x.imageSmoothingQuality = 'high'; x.filter = 'none';
    x.clearRect(0, 0, cv.width, cv.height); x.drawImage(img, 0, 0, cv.width, cv.height); if (done) done();
  });
}
/** the whole figure @param {HTMLCanvasElement} cv @param {string} actor */
export const drawFigure = (cv, actor) => drawActor(cv, actor, 0, 0, 88, 102, 2.1);

/** @type {Map<string, Promise<HTMLImageElement|null>>} */
const figs = new Map();
export const FIGURE_W = 352, FIGURE_H = 408;
/** the whole character, lit and posed (<actor>.fig.png, 352 × 408: the character window); an actor
 * without one falls back to its atlas frame @param {HTMLCanvasElement} cv @param {string} actor */
export function drawCharacter(cv, actor) {
  let f = figs.get(actor);
  if (!f) { f = new Promise((res) => { const im = new Image(); im.onload = () => res(im); im.onerror = () => res(null); im.src = `./assets/actors/${actor}.fig.png`; }); figs.set(actor, f); }
  f.then((img) => {
    if (!img) return drawFigure(cv, actor);
    const x = cv.getContext('2d'); if (!x) return;
    x.imageSmoothingEnabled = true; x.imageSmoothingQuality = 'high'; x.filter = 'none';
    x.clearRect(0, 0, cv.width, cv.height); x.drawImage(img, 0, 0, cv.width, cv.height);
  });
}

/** escape text for innerHTML templates (names are sanitized by the sim; this is the second lock)
 * @param {any} s */
export const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] || c);

/** stop a window's touches reaching the world underneath @param {HTMLElement} el */
export function swallow(el) { for (const ev of ['pointerdown', 'touchstart', 'mousedown']) el.addEventListener(ev, (e) => e.stopPropagation()); }
