// @ts-check
// actorart.js — figures and portraits for the windows, cut from a character's own baked atlas
// (assets/actors/<actor>.alb.png: 102 px rows per facing, the camera-facing idle frame is row
// 2, frame 0). Shared by the character sheet, the party screen, the title and creation.

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
/** head and shoulders @param {HTMLCanvasElement} cv @param {string} actor */
export const drawPortrait = (cv, actor) => drawActor(cv, actor, 22, 26, 44, 52);
/** the whole figure @param {HTMLCanvasElement} cv @param {string} actor */
export const drawFigure = (cv, actor) => drawActor(cv, actor, 0, 0, 88, 102, 2.1);

/** escape text for innerHTML templates (names are sanitized by the sim; this is the second lock)
 * @param {any} s */
export const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] || c);

/** stop a window's touches reaching the world underneath @param {HTMLElement} el */
export function swallow(el) { for (const ev of ['pointerdown', 'touchstart', 'mousedown']) el.addEventListener(ev, (e) => e.stopPropagation()); }
