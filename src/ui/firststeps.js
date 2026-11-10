// @ts-check
// firststeps.js — the opening square's first steps (GDD §6.1 v1.64; the owner, 2026-11-10: "After Ready - create a few
// focus screen, tool tips/tutorials - Opening square: How to move, how to view your character and whats on those
// screens, compass navigation, quest log, and world menu and main menu. how to find your first quest"). One card at a
// time, each ringing the thing it's about (content/firststeps.json `at`), Next and Skip; the world dimmed round it.
// Shown once a game slot, after creation (a per-device note, like the menu's settings: it's how the screen is learned,
// not the game's progress, so the sim and the save never see it); the menu's First steps shows them again.
// Presentation only: nothing here touches the sim. The cards swallow their taps (AGENTS.md: overlays), and the sim is
// held while they're up, so nothing happens behind them.
// The plan for the services' first-open cards (shop, smith, tavern, inn, temple, the board, the coach): docs/first-steps-plan.md.

import { swallow } from './actorart.js';

const CSS = `
#steps { position: fixed; inset: 0; z-index: 30; display: none; pointer-events: auto; }
#steps.on { display: block; }
#steps .ring { position: absolute; border-radius: 12px; box-shadow: 0 0 0 9999px rgba(8,6,12,.62), 0 0 0 2px #f0c880, 0 0 18px 4px rgba(240,200,128,.55); transition: all .25s ease; pointer-events: none; }
#steps .ring.none { left: 50%; top: 42%; width: 0; height: 0; box-shadow: 0 0 0 9999px rgba(8,6,12,.45); }
#steps .card { position: absolute; left: 14px; right: 14px; max-width: 452px; margin: 0 auto; padding: 14px 14px 12px; border-radius: 14px;
  background: rgba(16,12,22,.98); border: 1px solid rgba(214,170,98,.55); color: #efe4cf; font-family: Georgia, serif; box-shadow: 0 8px 28px rgba(0,0,0,.5); }
#steps .card .n { float: right; font: 10px ui-monospace, Menlo, monospace; letter-spacing: 1px; color: #978c80; margin-top: 4px; }
#steps .card h3 { font: 600 18px Georgia, serif; color: #f0c880; margin: 0 0 6px; }
#steps .card p { font-size: 14px; line-height: 1.45; color: #d8ccb8; margin: 0; }
#steps .card .nav { display: flex; gap: 10px; margin-top: 12px; }
#steps .card button { flex: 1; min-height: 46px; border-radius: 10px; font: 600 15px Georgia, serif; border: 1px solid rgba(214,170,98,.5); background: none; color: #f0c880; }
#steps .card button.pri { flex: 2; background: linear-gradient(#e0a84a, #b67c2a); color: #1a1208; border-color: #f0c880; }
`;
const KEY = (slot) => `emberfall.firststeps.${slot}`;
/** has this slot seen them? (a per-device note; storage off: as if seen, never a card that won't go) @param {number|string} slot */
export function seen(slot) { try { return localStorage.getItem(KEY(slot)) === '1'; } catch { return true; } }
const mark = (slot) => { try { localStorage.setItem(KEY(slot), '1'); } catch { /* (private mode: shown this once) */ } };

/** @param {{ slot: number|string, setPaused: (on: boolean) => void }} o */
export function createFirstSteps({ slot, setPaused }) {
  const style = document.createElement('style'); style.textContent = CSS; document.head.appendChild(style);
  const wrap = document.createElement('div'); wrap.id = 'steps'; wrap.setAttribute('role', 'dialog'); wrap.setAttribute('aria-label', 'First steps');
  wrap.innerHTML = '<div class="ring none"></div><div class="card"><span class="n"></span><h3></h3><p></p><div class="nav"><button class="skip">Skip</button><button class="pri">Next</button></div></div>';
  document.body.appendChild(wrap); swallow(wrap);
  const ring = /** @type {HTMLElement} */ (wrap.querySelector('.ring')), card = /** @type {HTMLElement} */ (wrap.querySelector('.card'));
  /** @type {{ id: string, at?: string, title: string, text: string }[]} */ let steps = [];
  let i = -1, data = null;
  const load = () => data || (data = fetch('./content/firststeps.json').then((r) => r.json()).then((d) => d.steps).catch(() => []));

  function place() {
    const s = steps[i], el = s && s.at ? /** @type {HTMLElement|null} */ (document.querySelector(s.at)) : null;
    const r = el && el.getClientRects().length ? el.getBoundingClientRect() : null, pad = 6;
    if (r && r.width && r.height) {
      ring.classList.remove('none');
      Object.assign(ring.style, { left: `${r.left - pad}px`, top: `${r.top - pad}px`, width: `${r.width + pad * 2}px`, height: `${r.height + pad * 2}px` });
    } else { ring.classList.add('none'); ring.removeAttribute('style'); }
    // the card on the far side of the screen from what it rings (thumb reach: the lower half when it can be)
    const low = !r || r.top + r.height / 2 < innerHeight * 0.55;
    card.style.top = low ? '' : `calc(env(safe-area-inset-top, 0px) + ${Math.max(16, Math.min(innerHeight * 0.25, (r ? r.top : 0) - 220))}px)`;
    card.style.bottom = low ? `calc(env(safe-area-inset-bottom, 0px) + ${r && r.top > innerHeight * 0.6 ? innerHeight - r.top + 16 : 24}px)` : '';
  }
  function draw() {
    const s = steps[i];
    card.querySelector('.n').textContent = `${i + 1} of ${steps.length}`;
    card.querySelector('h3').textContent = s.title;                      // (text, never HTML: AGENTS.md)
    card.querySelector('p').textContent = s.text;
    card.querySelector('.pri').textContent = i === steps.length - 1 ? 'Done' : 'Next';
    place();
  }
  function end() { wrap.classList.remove('on'); i = -1; mark(slot); setPaused(false); removeEventListener('resize', place); }
  /** @type {HTMLElement} */ (card.querySelector('.pri')).addEventListener('click', () => { if (++i >= steps.length) end(); else draw(); });
  /** @type {HTMLElement} */ (card.querySelector('.skip')).addEventListener('click', end);

  return {
    /** show them (again: `force`); false when this slot has seen them @param {boolean} [force] */
    async open(force = false) {
      if ((!force && seen(slot)) || wrap.classList.contains('on')) return false;
      steps = await load(); if (!steps.length) return false;
      i = 0; wrap.classList.add('on'); setPaused(true); addEventListener('resize', place); draw();
      return true;
    },
    get isOpen() { return wrap.classList.contains('on'); },
    get step() { return i >= 0 && steps[i] ? steps[i].id : null; },
  };
}
