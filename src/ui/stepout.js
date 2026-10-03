// @ts-check
// stepout.js — the way out of a fight (GDD §7.1). A room never gives up: each wave of a visit is
// tougher than the last and the lull is only a breath, so a visit ends when you walk out or when the
// room wins. During a fight this button, above the party cards on the right, walks the hero to the
// nearest corridor past a doorway (the sim's 'step-out' destination, travel.js), where the fight
// ends and the party recovers at 5×. It pulses when the party is low, and says so when leaving would
// make a Downed companion slain (you don't walk out on someone lying on the floor lightly).
// DOM only: reads sim state, sends a `goto` command.

import { statsFor } from '../sim/party.js';
import { swallow } from './actorart.js';

const CSS = `
#stepOut { position: fixed; right: calc(12px + var(--safe-r, env(safe-area-inset-right, 0px))); bottom: 140px; z-index: 5; display: none; min-height: 44px; min-width: 112px; max-width: 46vw; padding: 6px 12px 6px 10px;
  border-radius: 22px; border: 1px solid rgba(214,170,98,0.55); background: rgba(16,12,22,0.94); color: #f0c880; box-shadow: 0 2px 10px rgba(0,0,0,.5);
  font: 600 13px Georgia, serif; text-align: left; align-items: center; gap: 8px; }
#stepOut.on { display: flex; }
#stepOut svg { flex: none; width: 20px; height: 20px; fill: none; stroke: #e0a85a; stroke-width: 1.7; stroke-linejoin: round; stroke-linecap: round; }
#stepOut span { display: block; }
#stepOut small { display: block; font: 10.5px ui-monospace, Menlo, monospace; color: #cbbfae; margin-top: 1px; white-space: normal; }
#stepOut.low { border-color: #ff8a6a; color: #ffd8c8; animation: stepPulse 1.1s ease-in-out infinite; }
#stepOut.low svg { stroke: #ff9a7a; }
@keyframes stepPulse { 0%, 100% { box-shadow: 0 0 0 0 rgba(255,138,106,.55), 0 2px 10px rgba(0,0,0,.5); } 50% { box-shadow: 0 0 0 6px rgba(255,138,106,0), 0 2px 10px rgba(0,0,0,.5); } }
`;
const ICON = '<svg viewBox="0 0 24 24"><path d="M10 4H5v16h5M14 8l4 4-4 4M18 12H9"/></svg>';
export const LOW = 0.45;                 // the party's share of HP under which the button pulses

/** @param {{ sim: any, partyPanel?: { height: () => number, side?: () => number } }} o */
export function createStepOut({ sim, partyPanel }) {
  const style = document.createElement('style'); style.textContent = CSS; document.head.appendChild(style);
  const btn = document.createElement('button'); btn.id = 'stepOut'; btn.setAttribute('aria-label', 'Step out of the fight');
  document.body.appendChild(btn); swallow(btn);
  btn.addEventListener('click', () => {
    const row = sim.destinations().find((/** @type {any} */ r) => r.id === 'step-out'); if (!row) return;
    sim.commands.push({ type: 'goto', tx: row.tx, ty: row.ty, near: row.near, then: null, label: 'Step out' });
  });
  let last = '';
  (function watch() {
    const b = sim.battle, S = sim.state, p = S.player;
    const walking = !!(p.path && p.dest && p.dest.label === 'Step out');
    let html = '', low = false;
    if (b && !S.party[0].down && !walking) {
      const up = S.party.filter((/** @type {any} */ m) => !m.fallen), frac = up.reduce((a, /** @type {any} */ m) => a + (m.down ? 0 : m.hp), 0) / Math.max(1, up.reduce((a, /** @type {any} */ m) => a + statsFor(m).maxHp, 0));
      const downed = S.party.slice(1).find((/** @type {any} */ m) => m.down && !m.fallen);
      low = frac < LOW;
      html = `${ICON}<div><span>Step out</span>${downed ? `<small>${downed.name.replace(/[<>&"]/g, '')} is Downed: walk out now and they're slain</small>` : low ? '<small>the party is low</small>' : ''}</div>`;
    }
    if (html !== last) { btn.innerHTML = html; last = html; }
    btn.classList.toggle('on', !!html); btn.classList.toggle('low', low);
    if (html) { const b2 = `${Math.round((partyPanel ? partyPanel.height() : 0) + (partyPanel && partyPanel.side && partyPanel.side() ? 14 : 8))}px`; if (btn.style.bottom !== b2) btn.style.bottom = b2; }   // (sideways: 14, clear of the rounded corner)
    requestAnimationFrame(watch);
  })();
  return { el: btn };
}
