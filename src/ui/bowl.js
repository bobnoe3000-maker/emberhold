// @ts-check
// bowl.js (ui) — the Bowl (GDD §17 v1.85; sim/bowl.js; docs/bowl-arena-proposal.md, its mockup docs/bowl-arena-mockup.html):
//   · the board, from ☰ → The Bowl (from level 6): your rating and tier, marks, today's paid bouts; two tabs, the Ladder
//     (today's three picks, each with Fight and Fight alone) and the Tourney (enter today's, its bracket, your next bout);
//   · on the sand: a bar at the top, the Crier's call, the clock and each company's share of HP standing;
//   · the result: won, lost or drawn, the Crier's line, the marks and the rating; The board, or Back to where you were.
// Every word is content/arena.json's or written here. It pushes commands (bowlBout, tourneyEnter, tourneyBout, bowlLeave)
// and reads state; the sim checks every one. Preact + htm, as every window.

import { html, render } from 'htm/preact';
import { swallow } from './actorart.js';
import { CLASSES } from '../sim/party.js';
import { statsFor } from '../sim/party.js';
import { BOWL, picksOf, tierOf, bracketOf, BRACKETS, tourneyFoe, companyOn } from '../sim/bowl.js';
import { GRADES, MANNERS } from '../sim/rivals.js';

const TIER_NAME = { sweepers: 'Sweepers', sand: 'the Sand', lower: 'the Lower Tiers', upper: 'the Upper Tiers', box: 'the Sun’s Box' };
const ROUND = ['Quarter-final', 'Semi-final', 'Final'];
const PICK = { easier: 'An easier bout', even: 'An even bout', harder: 'A harder bout' };

const CSS = `
#bowlWrap { position: fixed; inset: 0; z-index: 12; display: none; background: rgba(10,8,6,.9); color: #efe4cf; font-family: Georgia, serif; overflow-y: auto;
  padding: calc(env(safe-area-inset-top, 0px) + 14px) max(14px, env(safe-area-inset-right, 0px)) calc(env(safe-area-inset-bottom, 0px) + 18px) max(14px, env(safe-area-inset-left, 0px)); }
#bowlWrap.on { display: block; }
#bowl { max-width: 460px; margin: 0 auto; display: flex; flex-direction: column; gap: 10px; }
#bowl .kind { font: 11px ui-monospace, Menlo, monospace; letter-spacing: 2px; color: #d8b060; text-transform: uppercase; }
#bowl h2 { font: 600 22px Georgia, serif; color: #f5d78a; margin: 0; }
#bowl .who { font: 12px ui-monospace, Menlo, monospace; color: #cbbfae; line-height: 1.6; }
#bowl .who b { color: #efe4cf; font-weight: 600; }
#bowl .tabs { display: flex; gap: 6px; }
#bowl .tabs button { flex: 1; min-height: 44px; border-radius: 10px; background: rgba(255,255,255,.04); color: #cbbfae; border: 1px solid rgba(216,176,96,.3); font: 600 14px Georgia, serif; }
#bowl .tabs button.on { background: rgba(216,176,96,.18); color: #f5d78a; border-color: rgba(216,176,96,.75); }
#bowl .card { background: rgba(26,20,14,.92); border: 1px solid rgba(216,176,96,.35); border-radius: 12px; padding: 11px 12px; display: flex; flex-direction: column; gap: 6px; }
#bowl .card .pick { font: 11px ui-monospace, Menlo, monospace; letter-spacing: 1.5px; text-transform: uppercase; color: #b9a27a; }
#bowl .card h3 { margin: 0; font: 600 17px Georgia, serif; color: #efe4cf; display: flex; align-items: center; gap: 8px; }
#bowl .banner { width: 14px; height: 20px; border-radius: 2px 2px 7px 7px; flex: none; border: 1px solid rgba(0,0,0,.4); }
#bowl .card .line { font-size: 13.5px; line-height: 1.4; color: #dccfb8; }
#bowl .card .quote { font-style: italic; font-size: 13px; color: #c8b896; }
#bowl .card .nums { font: 11.5px ui-monospace, Menlo, monospace; color: #cbbfae; line-height: 1.6; }
#bowl .row { display: flex; gap: 8px; }
#bowl button.go { flex: 1; min-height: 46px; border-radius: 10px; font: 600 14px Georgia, serif; background: linear-gradient(#e6c47a, #a07a2e); color: #1a1208; border: 1px solid #f5d78a; }
#bowl button.alt { flex: 1; min-height: 46px; border-radius: 10px; font: 600 14px Georgia, serif; background: none; color: #e6c47a; border: 1px solid rgba(216,176,96,.55); }
#bowl button:disabled { opacity: .45; }
#bowl .note { font-size: 12.5px; color: #b9a98e; line-height: 1.45; }
#bowl .said { font-size: 13px; color: #ff9a7a; min-height: 1em; }
#bowl .slots { display: grid; grid-template-columns: 1fr 1fr; gap: 4px 10px; font-size: 13px; }
#bowl .slots div { padding: 4px 6px; border-radius: 6px; background: rgba(255,255,255,.04); }
#bowl .slots .you { color: #f5d78a; border: 1px solid rgba(216,176,96,.6); }
#boutBar { position: fixed; left: 50%; transform: translateX(-50%); top: calc(env(safe-area-inset-top, 0px) + 54px); z-index: 6; display: none; min-width: 240px; max-width: 92vw;
  background: rgba(14,10,8,.88); border: 1px solid rgba(216,176,96,.5); border-radius: 12px; padding: 6px 12px; color: #efe4cf; font: 12px ui-monospace, Menlo, monospace; text-align: center; pointer-events: none; }
#boutBar.on { display: block; }
#boutBar .t { font: 600 18px Georgia, serif; color: #f5d78a; }
#boutBar .hp { display: flex; gap: 8px; align-items: center; justify-content: center; margin-top: 3px; }
#boutBar .meter { width: 90px; height: 6px; background: rgba(255,255,255,.12); border-radius: 3px; overflow: hidden; }
#boutBar .meter i { display: block; height: 100%; }
#boutBar .crier { font: italic 13px Georgia, serif; color: #e8d8b8; margin-top: 3px; }
`;

/** @param {{ sim: any, onOpen?: () => void, onClose?: () => void }} o */
export function createBowl({ sim, onOpen = () => {}, onClose = () => {} }) {
  const style = document.createElement('style'); style.textContent = CSS; document.head.appendChild(style);
  const wrap = document.createElement('div'); wrap.id = 'bowlWrap'; wrap.setAttribute('role', 'dialog'); wrap.setAttribute('aria-label', 'The Bowl');
  document.body.appendChild(wrap); swallow(wrap);
  const bar = document.createElement('div'); bar.id = 'boutBar'; bar.setAttribute('aria-live', 'polite'); document.body.appendChild(bar);
  /** @type {any} */ let words = null;
  fetch('./content/arena.json').then((r) => r.json()).then((d) => { words = { crier: d.crier, by: Object.fromEntries(d.companies.map((c) => [c.id, c])) }; if (wrap.classList.contains('on')) draw(); }).catch(() => {});
  let tab = 'ladder', said = '', result = /** @type {any} */ (null), crier = '';
  const W = (id) => (words && words.by[id]) || null;
  const nameOf = (id) => (id === 'you' ? 'Your company' : (W(id) && W(id).name) || id);
  sim.bus.on('refused', (e) => { if (wrap.classList.contains('on')) { said = e.reason; draw(); } });

  function Pick({ c }) {
    const w = W(c.id), M = MANNERS[c.manner], G = GRADES[c.grade];
    return html`<div class="card">
      <div class="pick">${PICK[c.pick] || ''}</div>
      <h3>${w && html`<span class="banner" style=${`background: linear-gradient(${w.banner[0]} 55%, ${w.banner[1]} 55%)`} title=${w.banner[2]}></span>`}${nameOf(c.id)}</h3>
      <div class="line">${M.name}, ${G.name.toLowerCase()} · rating ${c.rating}${w ? ` · from ${w.home}` : ''}</div>
      ${w && html`<div class="nums">${w.members.map((m) => `${m.name} (${(CLASSES[m.cls] || CLASSES.fighter).label})`).join(' · ')}</div>`}
      <div class="line">${M.text}</div>
      ${w && html`<div class="quote">“${w.in}”</div>`}
      <div class="row">
        <button class="go" onClick=${() => fight({ type: 'bowlBout', id: c.id })}>Fight</button>
        <button class="alt" onClick=${() => fight({ type: 'bowlBout', id: c.id, alone: true })}>Fight alone</button>
      </div>
    </div>`;
  }
  function Ladder() {
    const picks = picksOf(sim.state), b = sim.state.bowl;
    return html`
      ${picks.map((c) => html`<${Pick} key=${c.id} c=${c} />`)}
      ${!picks.length && html`<div class="note">You’ve fought every company on today’s board. Ma Gorrie chalks up a new one tomorrow.</div>`}
      <div class="note">A win pays marks of the Bowl by the company’s grade (2 to 6), a loss or a draw 1, for the first ${BOWL.paid} bouts a day (${Math.max(0, BOWL.paid - b.paid)} left today). No XP, no gold. Nobody is Fallen on the sand: you leave as you came in. Fight alone: your hero against their first.</div>`;
  }
  function Tourney() {
    const b = sim.state.bowl, T = b.tourney, day = Math.floor(sim.state.t / 3600);
    if (!T) {
      const had = b.tday === day, last = b.lastTourney;
      return html`<div class="card">
        <h3>The day’s tourney</h3>
        <div class="line">Eight companies, your rating’s nearest; three rounds, single elimination. Your company is locked from entry to the end: field the same members every round.</div>
        <div class="nums">Purse: quarter-final ${BOWL.purse[0]} · semi-final ${BOWL.purse[1]} · final ${BOWL.purse[2]} · champion ${BOWL.purse[3]} marks</div>
        ${last && html`<div class="line">Last: ${last.how === 'champion' ? 'champions' : `out in the ${(ROUND[last.round] || 'final').toLowerCase()}`}, ${last.purse} marks.</div>`}
        <div class="row"><button class="go" disabled=${had} onClick=${() => { sim.commands.push({ type: 'tourneyEnter' }); said = ''; setTimeout(draw, 80); }}>${had ? 'Entered today' : 'Enter today’s tourney'}</button></div>
      </div>`;
    }
    const foe = tourneyFoe(T), c = foe ? companyOn(foe, bracketOf(sim.state.party[0].level), T.day) : null;
    return html`<div class="card">
      <div class="pick">${ROUND[T.round] || 'Final'}</div>
      <h3>${foe ? `You meet ${nameOf(foe)}` : 'Waiting'}</h3>
      ${c && html`<div class="line">${MANNERS[c.manner].name}, ${GRADES[c.grade].name.toLowerCase()} · rating ${T.ratings[foe]}</div>`}
      <div class="slots">${T.slots.map((id) => html`<div class=${id === 'you' ? 'you' : ''}>${nameOf(id)}</div>`)}</div>
      <div class="note">Locked: ${T.company.map((id) => (sim.state.party.find((m) => m.id === id) || { name: id }).name).join(', ')}.</div>
      <div class="row"><button class="go" disabled=${!foe} onClick=${() => fight({ type: 'tourneyBout' })}>Fight the ${(ROUND[T.round] || 'final').toLowerCase()}</button></div>
    </div>`;
  }
  function Result() {
    const r = result, w = W(r.id), C = words ? words.crier : null;
    const head = r.champion ? 'Champions' : r.how === 'won' ? 'Won' : r.how === 'draw' ? 'A draw' : 'Lost';
    const line = C ? (r.champion ? C.champion : r.why === 'time' ? `${C.time} ${C[r.how === 'won' ? 'won' : r.how === 'draw' ? 'draw' : 'lost']}` : C[r.how === 'won' ? 'won' : r.how === 'draw' ? 'draw' : 'lost']) : '';
    return html`<div class="card">
      <div class="pick">${r.kind === 'tourney' ? `The tourney · ${ROUND[r.round] || 'Final'}` : 'The ladder'}${r.alone ? ' · alone' : ''}</div>
      <h3>${head} · ${nameOf(r.id)}</h3>
      ${line && html`<div class="quote">The Crier: “${line}”</div>`}
      ${r.how === 'won' && w && html`<div class="quote">“${w.out}”</div>`}
      <div class="nums">${r.marks ? `+${r.marks} marks` : r.kind === 'ladder' ? 'unpaid (five a day)' : ''}${r.purse ? `${r.marks ? ' · ' : ''}purse +${r.purse} marks` : ''} · rating ${Math.round(r.r)} (${r.dr >= 0 ? '+' : ''}${r.dr}) · ${TIER_NAME[r.tier]}</div>
      <div class="row">
        <button class="alt" onClick=${() => { result = null; draw(); }}>The board</button>
        <button class="go" onClick=${() => { result = null; sim.commands.push({ type: 'bowlLeave' }); close(); }}>Back to where you were</button>
      </div>
    </div>`;
  }
  function Board() {
    const S = sim.state, h = S.party[0], b = S.bowl, inBowl = sim.world.site === 'bowl', [lo, hi] = BRACKETS[bracketOf(h.level)];
    return html`<div id="bowl">
      <div class="kind">Solmere · the Circus of the Sun</div>
      <h2>The Bowl</h2>
      <div class="who">Rating <b>${Math.round(b.r)}</b> · ${TIER_NAME[tierOf(b.r).id]} · bracket ${lo}–${hi}<br />Marks <b>${b.marks}</b> · won ${b.won}, lost ${b.lost}, drawn ${b.drawn} · paid today ${b.paid}/${BOWL.paid}</div>
      ${result ? html`<${Result} />` : html`
        <div class="tabs">
          <button class=${tab === 'ladder' ? 'on' : ''} onClick=${() => { tab = 'ladder'; said = ''; draw(); }}>Ma Gorrie’s board</button>
          <button class=${tab === 'tourney' ? 'on' : ''} onClick=${() => { tab = 'tourney'; said = ''; draw(); }}>The tourney</button>
        </div>
        ${tab === 'ladder' ? html`<${Ladder} />` : html`<${Tourney} />`}`}
      <div class="said">${said}</div>
      <div class="row">
        ${inBowl && !result && html`<button class="alt" onClick=${() => { sim.commands.push({ type: 'bowlLeave' }); close(); }}>Back to where you were</button>`}
        <button class="alt" onClick=${close}>${inBowl ? 'Stay on the sand' : 'Close'}</button>
      </div>
    </div>`;
  }
  const draw = () => render(html`<${Board} />`, wrap);
  function fight(cmd) { said = ''; sim.commands.push(cmd); setTimeout(() => { if (sim.battle && sim.battle.bout) close(); else draw(); }, 120); }
  function open() { wrap.classList.add('on'); onOpen(); said = ''; draw(); }
  function close() { wrap.classList.remove('on'); render(null, wrap); onClose(); }

  // on the sand: the Crier's call, the clock, each side's share of HP
  sim.bus.on('bout', (e) => {
    const C = words ? words.crier : null;
    if (e.t === 'call') { const w = W(e.id); crier = w ? `${w.name}! ${w.in}` : ''; }
    if (e.t === 'go') crier = C ? C.call : '';
    if (e.t === 'over') crier = '';
  });
  sim.bus.on('bowlResult', (r) => { result = r; setTimeout(open, 600); });
  const share = (list) => { let a = 0, t = 0; for (const m of list) { const mx = statsFor(m).maxHp; t += mx; a += m.down ? 0 : Math.max(0, m.hp); } return t ? a / t : 0; };
  let lastKey = '';
  function tick() {
    const B = sim.battle && sim.battle.bout;
    if (!B) { if (bar.classList.contains('on')) bar.classList.remove('on'); lastKey = ''; return; }
    const left = Math.max(0, Math.ceil(B.call > 0 ? B.call : B.secs - B.t)), a = share(B.ours), r = share(B.rivals);
    const key = `${left}|${Math.round(a * 50)}|${Math.round(r * 50)}|${crier}|${B.call > 0}`; if (key === lastKey) return; lastKey = key;
    bar.classList.add('on');
    const t = B.call > 0 ? `${left}…` : `${Math.floor(left / 60)}:${String(left % 60).padStart(2, '0')}`;
    bar.innerHTML = '';
    const tt = document.createElement('div'); tt.className = 't'; tt.textContent = t; bar.append(tt);
    const hp = document.createElement('div'); hp.className = 'hp';
    const meter = (f, col) => { const m = document.createElement('span'); m.className = 'meter'; const i = document.createElement('i'); i.style.width = `${Math.round(f * 100)}%`; i.style.background = col; m.append(i); return m; };
    hp.append('You', meter(a, '#d6b05c'), meter(r, '#c4483a'), nameOf(B.id).replace(/^The /, '')); bar.append(hp);
    if (crier) { const c = document.createElement('div'); c.className = 'crier'; c.textContent = crier; bar.append(c); }
  }
  setInterval(tick, 200);
  return { open, close, get isOpen() { return wrap.classList.contains('on'); } };
}
