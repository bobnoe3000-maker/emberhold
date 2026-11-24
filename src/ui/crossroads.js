// @ts-check
// crossroads.js — Solmere's crossroads (GDD v1.150; regions.js SOLMERE). Every land's imperial road meets in the dead
// capital, which isn't a land you walk: walking into Solmere on one road, the sim says which other open lands have a
// road out (`crossroads`), and this card asks which. A road picked sends `solmere` (the sim checks you're still in the
// road's mouth and the land is open); Turn back, or walking off, closes it. Its text is text.

import { swallow } from './actorart.js';
import { oExitAt } from '../sim/outdoor.js';

const CSS = `
#crossCard { position: fixed; left: 12px; right: 12px; bottom: calc(env(safe-area-inset-bottom, 0px) + 200px); z-index: 7; max-width: 420px; margin: 0 auto; display: none;
  background: rgba(14,11,22,.97); border: 1px solid rgba(214,170,98,.55); border-radius: 14px; padding: 13px 14px 12px; color: #efe4cf;
  box-shadow: 0 6px 28px rgba(0,0,0,.6); font-family: Georgia, serif; }
#crossCard.on { display: block; }
#crossCard .kind { font: 11px ui-monospace, Menlo, monospace; letter-spacing: 2px; color: #d8a040; text-transform: uppercase; }
#crossCard h2 { font: 600 19px Georgia, serif; color: #f0d8a8; margin: 2px 0 6px; }
#crossCard p { font-size: 14px; line-height: 1.4; margin: 0 0 10px; }
#crossCard .roads { display: flex; flex-direction: column; gap: 8px; }
#crossCard button { min-height: 46px; border-radius: 10px; font: 600 14px Georgia, serif; text-align: left; padding: 6px 12px; }
#crossCard button small { display: block; font: 11.5px ui-monospace, Menlo, monospace; color: #3a2a12; font-weight: 400; margin-top: 2px; }
#crossCard .go { background: linear-gradient(#e8c47a, #b07a30); color: #1a1208; border: 1px solid #f0d8a8; }
#crossCard .back { background: none; color: #d8a040; border: 1px solid rgba(214,170,98,.5); text-align: center; }
`;

/** @param {{ sim: any }} o */
export function createCrossroads({ sim }) {
  const style = document.createElement('style'); style.textContent = CSS; document.head.appendChild(style);
  const card = document.createElement('div'); card.id = 'crossCard'; card.setAttribute('role', 'dialog'); card.setAttribute('aria-label', 'Solmere: which road on');
  card.innerHTML = `<div class="kind">Solmere</div><h2>Through the dead capital</h2>
    <p>Every imperial road meets here, and nobody stays longer than it takes to cross the square. Which road out?</p>
    <div class="roads"></div>`;
  document.body.appendChild(card); swallow(card);
  const roads = /** @type {HTMLElement} */ (card.querySelector('.roads'));
  const close = () => card.classList.remove('on');
  /** @param {{ lands: { land: string, name: string, road: string }[] }} e */
  function open(e) {
    roads.textContent = '';
    for (const r of e.lands) {
      const b = document.createElement('button'); b.className = 'go';
      b.append(`On to ${r.name.replace(/^The /, 'the ')}`); const s = document.createElement('small'); s.textContent = r.road; b.append(s);
      b.addEventListener('click', () => { sim.commands.push({ type: 'solmere', land: r.land }); close(); });
      roads.append(b);
    }
    const back = document.createElement('button'); back.className = 'back'; back.textContent = 'Turn back';
    back.addEventListener('click', close); roads.append(back);
    card.classList.add('on');
    (function watch() {   // walked off the road's mouth: the card goes
      if (!card.classList.contains('on')) return;
      const p = sim.state.player, ex = sim.world && sim.world.kind === 'overland' ? oExitAt(sim.world, p.x, p.y) : null;
      if (!ex || ex.to !== 'solmere') { close(); return; }
      setTimeout(watch, 250);
    })();
  }
  sim.bus.on('crossroads', open);
  sim.bus.on('levelChanged', close);
  return { open, close, get isOpen() { return card.classList.contains('on'); } };
}
