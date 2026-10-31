// touch.js — Luminati's world on a phone (docs/lumina-prototype.md): Luminati reads the keyboard and the mouse only
// (engine/core/Input.js), so the prototype adds Emberfall's own thumb controls over it.
//   · a floating stick: touch and drag in the lower two-thirds and the player walks that way, runs at full tilt
//     (Input.getMoveVector and its 'run' action read the stick while it's held)
//   · Talk: the 'confirm' action (Space) — speak to whoever's near, turn a dialogue's page
//   · two fingers: pinch to zoom (the camera's wheel)
// Only touches on the world (its canvas) drive the stick; the game's own windows, buttons and dialogue take their taps
// as ever. The stick's touches never reach Luminati's pointer handling, and a mouse is left alone.
import { Input } from '../src/engine/core/Input.js';

const STICK_MAX = 46, SLOP = 10;
const stick = { on: false, x: 0, y: 0 };

// the stick into Luminati's input: its move vector (x right, y up the screen) and its run, while a finger holds it
const getMove = Input.prototype.getMoveVector;
Input.prototype.getMoveVector = function (out) {
  const v = getMove.call(this, out);
  if (stick.on && this.enabled && (stick.x || stick.y)) { v.x = stick.x; v.y = -stick.y; }
  return v;
};
const action = Input.prototype.action;
Input.prototype.action = function (name) {
  if (name === 'run' && stick.on && this.enabled && Math.hypot(stick.x, stick.y) > 0.92) return true;
  return action.call(this, name);
};

const css = `
#ember-touch { position: fixed; inset: 0; z-index: 40; pointer-events: none; touch-action: none; }
#ember-stick { position: absolute; width: 104px; height: 104px; margin: -52px 0 0 -52px; border-radius: 52px; border: 2px solid rgba(232,207,138,.5);
  background: rgba(7,8,15,.18); display: none; pointer-events: none; }
#ember-stick i { position: absolute; left: 50%; top: 50%; width: 40px; height: 40px; margin: -20px 0 0 -20px; border-radius: 20px; background: rgba(232,207,138,.6); }
#ember-talk { position: absolute; right: calc(14px + env(safe-area-inset-right, 0px)); bottom: calc(env(safe-area-inset-bottom, 0px) + 96px); width: 64px; height: 64px;
  border-radius: 32px; border: 2px solid rgba(232,207,138,.75); background: rgba(12,16,34,.82); color: #e8cf8a; font: 600 13px Georgia, serif;
  pointer-events: auto; touch-action: none; }
#ember-talk:active { background: rgba(232,207,138,.35); }
#ember-back { position: absolute; left: calc(10px + env(safe-area-inset-left, 0px)); top: calc(env(safe-area-inset-top, 0px) + 58px); min-width: 44px; min-height: 44px;
  padding: 0 12px; border-radius: 22px; border: 1px solid rgba(232,207,138,.45); background: rgba(12,16,34,.7); color: #e8cf8a; font: 13px Georgia, serif;
  pointer-events: auto; display: flex; align-items: center; text-decoration: none; }
@media (hover: hover) and (pointer: fine) { #ember-talk { display: none; } }`;

function mount() {
  const style = document.createElement('style'); style.textContent = css; document.head.append(style);
  const root = document.createElement('div'); root.id = 'ember-touch';
  // (opened from the game's menu, Compare worlds: ?from=game, and the way out goes straight back to the game)
  const fromGame = new URLSearchParams(location.search).get('from') === 'game';
  root.innerHTML = `<div id="ember-stick"><i></i></div><button id="ember-talk" aria-label="Talk">Talk</button><a id="ember-back" href="${fromGame ? '../index.html' : './index.html'}">◂ ${fromGame ? 'Game' : 'Worlds'}</a>`;
  document.body.append(root);
  const ring = /** @type {HTMLElement} */ (root.querySelector('#ember-stick')), knob = /** @type {HTMLElement} */ (ring.firstElementChild);
  const ptrs = new Map(); let origin = null, pinch = 0;
  for (const ev of ['pointerdown', 'pointermove', 'pointerup', 'pointercancel']) root.addEventListener(ev, (e) => e.stopPropagation());
  // a finger on the world: caught before Luminati's own handlers (capture, on the document), and kept from them
  // (the game's own canvas: Luminati paints its UI's art on canvases too, inside its root — a tap on the death screen's
  // or a window's art is the UI's)
  const world = (e) => e.pointerType !== 'mouse' && e.target instanceof HTMLCanvasElement && !e.target.closest('.lu-root');
  document.addEventListener('pointerdown', (e) => {
    if (!world(e)) return;
    e.stopPropagation(); ptrs.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (ptrs.size === 1 && e.clientY > innerHeight * 0.33) origin = { x: e.clientX, y: e.clientY, id: e.pointerId, live: false };
    if (ptrs.size === 2) { const [a, b] = [...ptrs.values()]; pinch = Math.hypot(a.x - b.x, a.y - b.y); release(); }
  }, true);
  document.addEventListener('pointermove', (e) => {
    const p = ptrs.get(e.pointerId); if (!p) return; e.stopPropagation(); p.x = e.clientX; p.y = e.clientY;
    if (ptrs.size >= 2) {                                        // pinch: the camera's wheel, a notch a few pixels
      const [a, b] = [...ptrs.values()], d = Math.hypot(a.x - b.x, a.y - b.y);
      if (pinch && Math.abs(d - pinch) > 6) { window.dispatchEvent(new WheelEvent('wheel', { deltaY: (pinch - d) * 2.2 })); pinch = d; }
      return;
    }
    if (!origin || e.pointerId !== origin.id) return;
    const dx = e.clientX - origin.x, dy = e.clientY - origin.y, d = Math.hypot(dx, dy);
    if (!origin.live && d > SLOP) { origin.live = true; ring.style.display = 'block'; ring.style.left = `${origin.x}px`; ring.style.top = `${origin.y}px`; }
    if (origin.live) { const k = Math.min(1, d / STICK_MAX) / (d || 1); stick.on = true; stick.x = dx * k; stick.y = dy * k; knob.style.transform = `translate(${stick.x * STICK_MAX * 0.6}px, ${stick.y * STICK_MAX * 0.6}px)`; }
  }, true);
  const up = (e) => { if (!ptrs.has(e.pointerId)) return; e.stopPropagation(); ptrs.delete(e.pointerId); if (origin && e.pointerId === origin.id) release(); if (ptrs.size < 2) pinch = 0; };
  document.addEventListener('pointerup', up, true); document.addEventListener('pointercancel', up, true);
  function release() { origin = null; stick.on = false; stick.x = stick.y = 0; ring.style.display = 'none'; knob.style.transform = ''; }
  // Talk: Space down and up on the window, as a key would be (Input reads 'confirm' as pressed this frame)
  const talk = /** @type {HTMLElement} */ (root.querySelector('#ember-talk'));
  talk.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    window.dispatchEvent(new KeyboardEvent('keydown', { code: 'Space', key: ' ' }));
    setTimeout(() => window.dispatchEvent(new KeyboardEvent('keyup', { code: 'Space', key: ' ' })), 90);
  });
}
if (document.body) mount(); else addEventListener('DOMContentLoaded', mount);
// on a phone, Luminati's keyboard chart (its controls panel, H) would sit under the thumb: put away once the game is up
if (matchMedia('(pointer: coarse)').matches) {
  const t0 = performance.now(), wait = setInterval(() => {
    if (/** @type {any} */ (window).__game || performance.now() - t0 > 60000) {
      clearInterval(wait);
      setTimeout(() => { window.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyH', key: 'h' })); setTimeout(() => window.dispatchEvent(new KeyboardEvent('keyup', { code: 'KeyH', key: 'h' })), 80); }, 400);
    }
  }, 250);
}
/** (for checks) */
Object.assign(globalThis, { __emberStick: stick });
