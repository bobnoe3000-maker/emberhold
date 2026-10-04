// @ts-check
// shrine.js — the shrine's blessing, offered (GDD §3.6 v1.14). Touching a dungeon shrine used to spend it
// on the spot; now the sim only offers it ('shrineOffer' { tx, ty, will, name? }) and this card says what
// it would do — raise the first of the slain at half health, or mend everyone standing (HP and MP, each
// one's numbers shown) — with Use (the `useShrine` command, which the sim checks: unspent, in reach,
// needed) or Close, which leaves its light for later. With everyone whole there's nothing to use it for:
// Use is off and says why.
// (v1.30, sim shrines.js) Three kinds, by the orb, each card in its own colour and named, never the colour alone:
// green mends or raises (as above), red gives the party +25 % ATK for 2 minutes, blue +25 % DEF for 2 minutes.
// The card reads party state every 300 ms but rewrites only its text, never the buttons under a finger.
// It closes when the shrine is used, the floor changes, or the hero goes well away (a fight's chase
// doesn't close it: Use walks back to the shrine first).

import { statsFor } from '../sim/party.js';
import { swallow } from './actorart.js';

const CSS = `
#shrineCard { --sc: 120,220,220; --st: #bdf0f0; --sk: #8fd8dc; --u1: #7fd8d8; --u2: #3e9aa4; position: fixed; left: 12px; right: 12px; bottom: calc(env(safe-area-inset-bottom, 0px) + 200px); z-index: 7;   /* above the party cards and the Step-out button */ max-width: 420px; margin: 0 auto; display: none;
  background: rgba(16,12,22,.97); border: 1px solid rgba(var(--sc),.55); border-radius: 14px; padding: 13px 14px 12px; color: #efe4cf;
  box-shadow: 0 6px 28px rgba(0,0,0,.6), 0 0 22px rgba(var(--sc),.15); font-family: Georgia, serif; }
#shrineCard.on { display: block; }
#shrineCard .kind { font: 11px ui-monospace, Menlo, monospace; letter-spacing: 2px; color: var(--sk); text-transform: uppercase; }
#shrineCard h2 { font: 600 19px Georgia, serif; color: var(--st); margin: 2px 0 6px; }
#shrineCard .bless { font-size: 14px; line-height: 1.4; margin: 0 0 8px; }
#shrineCard .who { font: 11.5px ui-monospace, Menlo, monospace; color: #cbbfae; line-height: 1.6; margin: 0 0 8px; }
#shrineCard .who b { color: #efe4cf; font-weight: 600; }
#shrineCard .once { font: 11px ui-monospace, Menlo, monospace; color: #978c80; margin: 0 0 10px; }
#shrineCard .row { display: flex; gap: 8px; }
#shrineCard button { flex: 1; min-height: 46px; border-radius: 10px; font: 600 14px Georgia, serif; }
#shrineCard .use { background: linear-gradient(var(--u1), var(--u2)); color: #08161a; border: 1px solid var(--st); }
#shrineCard.mend { --sc: 120,226,150; --st: #c4f4cf; --sk: #92dca4; --u1: #8fe0a0; --u2: #3f9a58; }
#shrineCard.might { --sc: 240,110,90; --st: #ffd0c4; --sk: #f0a090; --u1: #ff9a84; --u2: #b8442e; }
#shrineCard .use:disabled { background: #2a2834; color: #8a8496; border-color: #3a3644; }
#shrineCard .close { background: none; color: #d8a040; border: 1px solid rgba(214,170,98,.5); }
`;
const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const REACH = 1.8, FAR = 10;            // the sim's reach; the offer lasts until you're well away (a fight's chase doesn't end it)

/** @param {{ sim: any }} o */
export function createShrineCard({ sim }) {
  const style = document.createElement('style'); style.textContent = CSS; document.head.appendChild(style);
  const card = document.createElement('div'); card.id = 'shrineCard'; card.setAttribute('role', 'dialog'); card.setAttribute('aria-label', 'Shrine');
  card.innerHTML = `<div class="kind">Shrine</div><h2></h2><p class="bless"></p><div class="who"></div>
    <p class="once">One use: its light goes out when it’s used. Close to keep it for later.</p>
    <div class="row"><button class="use">Use the shrine</button><button class="close">Close</button></div>`;
  document.body.appendChild(card); swallow(card);
  const bless = /** @type {HTMLElement} */ (card.querySelector('.bless')), who = /** @type {HTMLElement} */ (card.querySelector('.who'));
  const use = /** @type {HTMLButtonElement} */ (card.querySelector('.use')), h2 = /** @type {HTMLElement} */ (card.querySelector('h2')), kindEl = /** @type {HTMLElement} */ (card.querySelector('.kind'));
  let at = /** @type {{ tx: number, ty: number, kind: string } | null} */ (null), timer = 0;
  const KIND = { mend: ['Green shrine', 'Shrine of Mending'], might: ['Red shrine', 'Shrine of Might'], ward: ['Blue shrine', 'Shrine of Warding'] };

  // what it would do now (the sim decides when it's used; this only describes the state it reads)
  function paint() {
    if (!at) return;
    const P = sim.state.party, f = P.find((m) => m.fallen);
    const line = (m) => { const s = statsFor(m); return `<b>${esc(m.name)}</b> HP ${Math.max(0, Math.round(m.hp))}/${s.maxHp}${s.maxMp ? ` · MP ${Math.round(m.mp ?? s.maxMp)}/${s.maxMp}` : ''}`; };
    const hurt = P.filter((m) => !m.fallen && !m.down && (m.hp < statsFor(m).maxHp || (m.mp ?? statsFor(m).maxMp) < statsFor(m).maxMp));
    let b, w, ok = true;
    const up = P.filter((m) => !m.fallen && !m.down);
    if (at.kind === 'might' || at.kind === 'ward') {
      const stat = at.kind === 'might' ? 'atk' : 'def', left = Math.max(0, ((sim.state.boons || {})[stat] || 0) - sim.state.t);
      b = at.kind === 'might' ? 'The whole party strikes harder: <b>+25 % ATK</b> for 2 minutes.' : 'The whole party stands firmer: <b>+25 % DEF</b> for 2 minutes.';
      w = left > 0 ? `Already lit on you: ${Math.ceil(left)} s left. Using it sets it to 2 minutes again.` : '';
      ok = up.length > 0; if (!ok) b = 'Nobody is standing to take it.';
    } else if (f) {
      const more = P.filter((m) => m.fallen && m !== f);
      b = `It raises <b>${esc(f.name)}</b> from the slain, at half health.`;
      w = more.length ? `Only the first of the slain: ${more.map((m) => esc(m.name)).join(', ')} ${more.length > 1 ? 'stay' : 'stays'} slain until a temple or another shrine.` : '';
    } else if (hurt.length) {
      b = 'It mends everyone standing to full HP and MP.';
      w = P.filter((m) => !m.fallen && !m.down).map(line).join('<br>');
    } else { b = 'Everyone is whole: there’s nothing for it to mend. Keep it for when someone is hurt or slain.'; w = ''; ok = false; }
    if (bless.innerHTML !== b) bless.innerHTML = b;
    if (who.innerHTML !== w) who.innerHTML = w;
    if (use.disabled === ok) { use.disabled = !ok; use.textContent = ok ? 'Use the shrine' : at.kind === 'mend' ? 'Nobody needs it' : 'Nobody standing'; }
    const p = sim.state.player;
    if (Math.max(Math.abs(at.tx + 0.5 - p.x), Math.abs(at.ty + 0.5 - p.y)) > FAR) close();   // walked away
  }
  function open(e) {
    const kind = e.kind || 'mend'; at = { tx: e.tx, ty: e.ty, kind };
    card.classList.remove('mend', 'might', 'ward'); card.classList.add(kind); kindEl.textContent = KIND[kind][0]; h2.textContent = KIND[kind][1];
    card.classList.add('on'); paint(); clearInterval(timer); timer = setInterval(paint, 300); }
  function close() { at = null; card.classList.remove('on'); clearInterval(timer); }
  // Use: at once if the hero stands by it; else walk back to it and use it there (in a fight the autobattle
  // may have carried them a few steps off while you read)
  use.addEventListener('click', () => {
    if (!at) return; const p = sim.state.player, cmd = { type: 'useShrine', tx: at.tx, ty: at.ty };
    if (Math.max(Math.abs(at.tx + 0.5 - p.x), Math.abs(at.ty + 0.5 - p.y)) <= REACH) sim.commands.push(cmd);
    else sim.commands.push({ type: 'goto', tx: at.tx, ty: at.ty, near: 1, then: cmd, label: 'Shrine' });
  });
  card.querySelector('.close')?.addEventListener('click', close);
  sim.bus.on('shrineOffer', open);
  sim.bus.on('shrine', close);                               // used (or refused): the toast says what happened
  sim.bus.on('levelChanged', close);
  return { open, close, get isOpen() { return !!at; } };
}
