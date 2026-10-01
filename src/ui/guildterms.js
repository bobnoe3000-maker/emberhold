// @ts-check
// guildterms.js — "The Guild's terms": the reference card for the Lantern Guild's sellswords (GDD
// §6.2, world doc §4 v1.11), pinned up by the tavern board. Opened from the tavern's Hire view and
// from a companion's Contract tab. The ranks table reads the sim's numbers (companions.js RANKS), so
// it can't drift from the rules; every other line is content/companions.json `terms`, rendered as
// text. DOM only; reads, never writes.

import { RANKS, RANK_IDS } from '../sim/companions.js';
import { RANK_COL, rankName, rankLine, wordsReady, companionWords as words } from './sellswords.js';
import { esc, swallow } from './actorart.js';

const CSS = `
#gterms { position: fixed; inset: 0; z-index: 20; background: rgba(6,4,10,.66); display: none; }
#gterms.on { display: block; }
#gterms .pane { position: absolute; left: 0; right: 0; bottom: 0; max-height: 88vh; overflow-y: auto; max-width: 480px; margin: 0 auto;
  background: linear-gradient(#1a1422, #120e18); border-top: 1px solid rgba(214,170,98,.5); border-radius: 16px 16px 0 0;
  padding: 16px 18px calc(env(safe-area-inset-bottom, 0px) + 18px); color: #e8e0d0; font-family: Georgia, 'Times New Roman', serif; }
#gterms .kind { font: 11px ui-monospace, Menlo, monospace; letter-spacing: 2px; color: #a08a6a; text-transform: uppercase; }
#gterms h2 { font-size: 21px; color: #f0c880; margin: 2px 0 6px; font-weight: 600; }
#gterms .intro { font-size: 13.5px; color: #c8bca8; line-height: 1.4; font-style: italic; margin-bottom: 12px; }
#gterms h3 { font: 11px ui-monospace, Menlo, monospace; letter-spacing: 2px; color: #a08a6a; text-transform: uppercase; margin: 16px 0 6px; }
#gterms p { font-size: 13.5px; color: #d8ccb8; line-height: 1.45; margin: 0; }
#gterms table { width: 100%; border-collapse: collapse; font: 11.5px ui-monospace, Menlo, monospace; color: #d8ccb8; margin-top: 8px; }
#gterms th { text-align: left; font-weight: 400; color: #a08a6a; font-size: 10px; letter-spacing: 1px; text-transform: uppercase; padding: 0 4px 4px; }
#gterms td { padding: 6px 4px; border-top: 1px solid rgba(214,170,98,.15); vertical-align: top; }
#gterms td:nth-child(n+3) { white-space: nowrap; }
#gterms td small { color: #a8987e; }
#gterms td i { display: block; font: italic 11.5px Georgia, serif; color: #a8a090; margin-top: 2px; }
#gterms .rk { font-weight: 700; }
#gterms .fam { display: flex; gap: 8px; font-size: 13px; color: #d8ccb8; line-height: 1.35; margin-top: 5px; }
#gterms .fam b { flex: none; width: 92px; font: 10.5px ui-monospace, Menlo, monospace; color: #c0a070; letter-spacing: .5px; text-transform: uppercase; padding-top: 2px; }
#gterms .x { position: absolute; right: 12px; top: 10px; width: 44px; height: 44px; border-radius: 22px; border: 1px solid rgba(214,170,98,.35); background: none; color: #e0c8a0; font-size: 18px; }
`;

/** @param {{ sim: any }} o */
export function createGuildTerms({ sim }) {
  const style = document.createElement('style'); style.textContent = CSS; document.head.appendChild(style);
  const wrap = document.createElement('div'); wrap.id = 'gterms'; wrap.setAttribute('role', 'dialog'); wrap.setAttribute('aria-label', 'The Guild’s terms');
  document.body.appendChild(wrap); swallow(wrap);
  wrap.addEventListener('click', (e) => { const t = /** @type {HTMLElement} */ (e.target); if (t === wrap || t.closest('.x')) close(); });

  function draw() {
    const T = (words() || {}).terms, F = (words() || {}).families || {};
    if (!T) { wrap.innerHTML = '<div class="pane"><button class="x" aria-label="Close">✕</button><p>…</p></div>'; return; }
    const lv = Math.max(1, sim.state.party[0].level);
    const rows = RANK_IDS.map((r) => { const R = RANKS[r];
      return `<tr><td><span class="rk" style="color:${RANK_COL[r]}">◆ ${esc(rankName(r))}</span><i>${esc(rankLine(r))}</i></td>
        <td>${R.perks}${R.hidden ? ' + 1 kept back' : ''}</td><td>${R.fee} × lv<br><small>(${R.fee * lv} now)</small></td><td>${R.wage} × lv<br><small>(${R.wage * lv} now)</small></td></tr>`; }).join('');
    const sec = (s) => `<h3>${esc(s.head)}</h3><p>${esc(s.text)}</p>${s.head === 'Ranks' ? `<table><tr><th>Rank</th><th>Perks</th><th>Fee</th><th>Wage a dawn</th></tr>${rows}</table>` : ''}`;
    wrap.innerHTML = `<div class="pane"><button class="x" aria-label="Close">✕</button>
      <div class="kind">Lantern Guild · the Tired Mule</div><h2>${esc(T.title)}</h2><div class="intro">${esc(T.intro)}</div>
      ${T.sections.map(sec).join('')}
      <h3>Perks</h3>${Object.keys(T.families).map((k) => `<div class="fam"><b>${esc(F[k] || k)}</b><span>${esc(T.families[k])}</span></div>`).join('')}
      <h3>Found companions</h3><p>${esc(T.found)}</p></div>`;
  }
  function open() { draw(); wrap.classList.add('on'); wordsReady.then(() => { if (wrap.classList.contains('on')) draw(); }); }
  function close() { wrap.classList.remove('on'); }
  return { open, close, isOpen: () => wrap.classList.contains('on') };
}
