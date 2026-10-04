// @ts-check
// tower.js — the Mere Tower's landing card (sim/tower.js; GDD §17 v1.31). Every tenth wave past a warden is a landing:
// the satchel is banked and the stair hall waits. The card says what was banked and how high the company has been,
// and offers **Climb on** (`towerClimb`) or **Home with Wenna** (`towerLeave`, back to Saltmere's jetty, everything
// kept). It says what walking out mid-climb costs before you do it. It shows on 'towerLanding' and, after a load, when
// the climb was left at a landing; it closes on a climb, on leaving, or when the floor changes. Its text is text.

import { swallow } from './actorart.js';
import { towerOf, towerTough, TOWER } from '../sim/tower.js';

const CSS = `
#towerCard { position: fixed; left: 12px; right: 12px; bottom: calc(env(safe-area-inset-bottom, 0px) + 200px); z-index: 7; max-width: 420px; margin: 0 auto; display: none;
  background: rgba(14,11,22,.97); border: 1px solid rgba(190,160,255,.55); border-radius: 14px; padding: 13px 14px 12px; color: #efe4cf;
  box-shadow: 0 6px 28px rgba(0,0,0,.6), 0 0 22px rgba(170,140,255,.14); font-family: Georgia, serif; }
#towerCard.on { display: block; }
#towerCard .kind { font: 11px ui-monospace, Menlo, monospace; letter-spacing: 2px; color: #b8a4e8; text-transform: uppercase; }
#towerCard h2 { font: 600 19px Georgia, serif; color: #ddd0ff; margin: 2px 0 6px; }
#towerCard p { font-size: 14px; line-height: 1.4; margin: 0 0 8px; }
#towerCard .nums { font: 11.5px ui-monospace, Menlo, monospace; color: #cbbfae; line-height: 1.6; margin: 0 0 10px; }
#towerCard .nums b { color: #efe4cf; font-weight: 600; }
#towerCard .row { display: flex; gap: 8px; }
#towerCard button { flex: 1; min-height: 46px; border-radius: 10px; font: 600 14px Georgia, serif; }
#towerCard .climb { background: linear-gradient(#b8a0f0, #6a52b0); color: #0e0a18; border: 1px solid #ddd0ff; }
#towerCard .home { background: none; color: #d8a040; border: 1px solid rgba(214,170,98,.5); }
`;

/** @param {{ sim: any }} o */
export function createTowerCard({ sim }) {
  const style = document.createElement('style'); style.textContent = CSS; document.head.appendChild(style);
  const card = document.createElement('div'); card.id = 'towerCard'; card.setAttribute('role', 'dialog'); card.setAttribute('aria-label', 'The Mere Tower: a landing');
  card.innerHTML = `<div class="kind">The Mere Tower</div><h2></h2><p></p><div class="nums"></div>
    <div class="row"><button class="climb">Climb on</button><button class="home">Home with Wenna</button></div>`;
  document.body.appendChild(card); swallow(card);
  const h2 = /** @type {HTMLElement} */ (card.querySelector('h2')), p = /** @type {HTMLElement} */ (card.querySelector('p')), nums = /** @type {HTMLElement} */ (card.querySelector('.nums'));
  const line = (label, v) => { const d = document.createElement('div'); d.append(`${label} `); const b = document.createElement('b'); b.textContent = v; d.append(b); return d; };
  /** @param {{ wave: number, landing: number, banked?: { gold: number, cinders: number } }} e */
  function open(e) {
    const T = towerOf(sim.state);
    h2.textContent = `Landing ${e.landing}`;
    p.textContent = e.banked
      ? 'The satchel is banked: it’s yours, whatever happens above. The stair goes on, and the next ten are harder and of a new kind.'
      : 'The company waits on the landing. What was in the satchel is banked.';
    nums.textContent = '';
    if (e.banked) nums.append(line('Banked', `+${e.banked.gold} gold · +${e.banked.cinders} cinders`));
    nums.append(line('Highest', `wave ${T.best} · landing ${T.landing}`), line('Next', `wave ${e.wave + 1}${(e.wave + 1) % TOWER.landing === 0 ? ' · a warden' : ''} · foes +${Math.round((towerTough(e.wave + 1) - 1) * 100)}%`));
    card.classList.add('on');
  }
  const close = () => card.classList.remove('on');
  card.querySelector('.climb')?.addEventListener('click', () => { sim.commands.push({ type: 'towerClimb' }); close(); });
  card.querySelector('.home')?.addEventListener('click', () => { sim.commands.push({ type: 'towerLeave' }); close(); });
  sim.bus.on('towerLanding', open);
  sim.bus.on('towerClimb', close); sim.bus.on('towerOut', close); sim.bus.on('levelChanged', close);
  // after a load: a climb left at a landing waits there with its card (the hall starts when the hero is in it)
  sim.bus.on('battle', (b) => { const T = towerOf(sim.state); if (b.on && sim.world.site === TOWER.site && T.atLanding) open({ wave: T.wave, landing: T.wave / TOWER.landing }); });
  return { open, close, get isOpen() { return card.classList.contains('on'); } };
}
