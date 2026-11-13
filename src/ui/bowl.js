// @ts-check
// bowl.js (ui) — the Bowl (GDD §17 v1.85; sim/bowl.js; docs/bowl-arena-proposal.md, its mockup docs/bowl-arena-mockup.html):
//   · the board, from ☰ → The Bowl (from level 6): your rating, tier and place among the hundred, marks, today's bouts (ten
//     a day); three tabs: the board (five teams near your rating, each with Fight and Fight alone, and five new faces
//     three times a day: GDD v1.86), the Tourney (enter today's, its bracket, your next bout) and the Standings (the
//     hundred's league: its top ten and the teams round your rating);
//   · on the sand: a bar at the top, the Crier's call, the clock and each company's share of HP standing;
//   · the result: won, lost or drawn, the Crier's line, the marks and the rating; The board, or Back to where you were.
// Every word is content/arena.json's or written here. It pushes commands (bowlBout, tourneyEnter, tourneyBout, bowlLeave)
// and reads state; the sim checks every one. Preact + htm, as every window.

import { html, render } from 'htm/preact';
import { swallow } from './actorart.js';
import { CLASSES } from '../sim/party.js';
import { statsFor } from '../sim/party.js';
import { BOWL, picksOf, tierOf, bracketOf, BRACKETS, tourneyFoe, companyOn, fieldOn, rankOf, dayOf } from '../sim/bowl.js';
import { GRADES, MANNERS } from '../sim/rivals.js';

const TIER_NAME = { sweepers: 'Sweepers', sand: 'the Sand', lower: 'the Lower Tiers', upper: 'the Upper Tiers', box: 'the Sun’s Box' };
const ROUND = ['Quarter-final', 'Semi-final', 'Final'];
const PICK = { easier: 'Easier', even: 'Even', harder: 'Harder' };

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
#bowl .card.small { padding: 9px 11px; gap: 4px; }
#bowl .card.small h3 { font-size: 15.5px; }
#bowl .card .top { display: flex; justify-content: space-between; align-items: baseline; gap: 8px; }
#bowl .card .rank { font: 11px ui-monospace, Menlo, monospace; color: #b9a27a; white-space: nowrap; }
#bowl .bar { display: flex; justify-content: space-between; align-items: center; gap: 8px; font: 12px ui-monospace, Menlo, monospace; color: #cbbfae; }
#bowl .bar button { min-height: 44px; padding: 0 12px; border-radius: 10px; background: none; color: #e6c47a; border: 1px solid rgba(216,176,96,.55); font: 600 13px Georgia, serif; }
#bowl table { width: 100%; border-collapse: collapse; font: 12px ui-monospace, Menlo, monospace; color: #dccfb8; }
#bowl td { padding: 5px 4px; border-bottom: 1px solid rgba(216,176,96,.12); }
#bowl td.n { text-align: right; color: #b9a27a; width: 2.5em; }
#bowl td.r { text-align: right; }
#bowl tr.you td { color: #f5d78a; font-weight: 600; }
#bowl tr.gap td { color: #6f6556; text-align: center; }
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

  const lineIn = (id, manner) => { const w = W(id); return (w && w.in) || (words && words.crier.manners ? words.crier.manners[manner].in : ''); };
  const lineOut = (id, manner) => { const w = W(id); return (w && w.out) || (words && words.crier.manners ? words.crier.manners[manner].out : ''); };
  function Pick({ c, left }) {
    const w = W(c.id), M = MANNERS[c.manner], G = GRADES[c.grade], q = lineIn(c.id, c.manner);
    return html`<div class="card small">
      <div class="top"><div class="pick">${PICK[c.pick] || ''} · ${M.name}, ${G.name.toLowerCase()}</div><div class="rank">#${c.rank} of 100</div></div>
      <h3>${w && html`<span class="banner" style=${`background: linear-gradient(${w.banner[0]} 55%, ${w.banner[1]} 55%)`} title=${w.banner[2]}></span>`}${nameOf(c.id)}</h3>
      <div class="nums">rating ${c.rating} · ${c.won}–${c.lost}${c.drawn ? `–${c.drawn}` : ''}${w ? ` · ${w.home}` : ''}<br />${w ? w.members.map((m) => `${m.name} (${(CLASSES[m.cls] || CLASSES.fighter).label})`).join(' · ') : ''}</div>
      ${q && html`<div class="quote">“${q}”</div>`}
      <div class="row">
        <button class="go" disabled=${!left} onClick=${() => fight({ type: 'bowlBout', id: c.id })}>Fight</button>
        <button class="alt" disabled=${!left} onClick=${() => fight({ type: 'bowlBout', id: c.id, alone: true })}>Fight alone</button>
      </div>
    </div>`;
  }
  function Ladder() {
    const picks = picksOf(sim.state), b = sim.state.bowl, left = Math.max(0, BOWL.fights - b.paid), fresh = Math.max(0, BOWL.refreshes - b.refresh);
    return html`
      <div class="bar"><span>Bouts today ${b.paid}/${BOWL.fights}</span>
        <button disabled=${!fresh} onClick=${() => { said = ''; sim.commands.push({ type: 'bowlRefresh' }); setTimeout(draw, 120); }}>New faces (${fresh} left)</button></div>
      ${picks.map((c) => html`<${Pick} key=${c.id} c=${c} left=${left > 0} />`)}
      ${!picks.length && html`<div class="note">${fresh ? 'You’ve fought everyone on the board. Ask Ma Gorrie for new faces.' : 'You’ve fought everyone on the board. She chalks up five more tomorrow.'}</div>`}
      <div class="note">Five teams near your rating; three times a day, five new. ${BOWL.fights} bouts a day, each paid in marks of the Bowl: a win 2 to 6 by the team’s grade, a loss or a draw 1. No XP, no gold. Nobody is Fallen on the sand: you leave as you came in. Fight alone: your hero against their first.</div>`;
  }
  function Standings() {
    const d = dayOf(sim.state), all = fieldOn(d), b = sim.state.bowl, me = rankOf(sim.state);
    const rows = /** @type {any[]} */ (all.map((c) => ({ ...c, you: false }))); rows.splice(me - 1, 0, { id: 'you', rating: Math.round(b.r), won: b.won, lost: b.lost, you: true });   // (you where rankOf puts you: the league's own order)
    const at = rows.findIndex((r) => r.you), show = new Set([...rows.slice(0, 10).map((r) => r.id), ...rows.slice(Math.max(0, at - 3), at + 4).map((r) => r.id)]);
    const out = []; let gap = false;
    rows.forEach((r, i) => { if (show.has(r.id)) { out.push(html`<tr class=${r.you ? 'you' : ''}><td class="n">${i + 1}</td><td>${nameOf(r.id)}</td><td class="r">${r.rating}</td><td class="r">${r.won}–${r.lost}</td></tr>`); gap = false; } else if (!gap) { out.push(html`<tr class="gap"><td colspan="4">⋯</td></tr>`); gap = true; } });
    return html`<div class="card">
      <h3>The hundred</h3>
      <div class="note">The Bowl’s league: a hundred companies, ten bouts a day each, on the rules you fight by. You stand ${me} of ${all.length + 1}.</div>
      <table>${out}</table>
    </div>`;
  }
  function Tourney() {
    const b = sim.state.bowl, T = b.tourney, day = dayOf(sim.state);
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
    const foe = tourneyFoe(T), c = foe ? companyOn(foe, T.day) : null;
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
    const r = result, C = words ? words.crier : null, out = r.how === 'won' ? lineOut(r.id, companyOn(r.id, dayOf(sim.state)).manner) : '';
    const head = r.champion ? 'Champions' : r.how === 'won' ? 'Won' : r.how === 'draw' ? 'A draw' : 'Lost';
    const line = C ? (r.champion ? C.champion : r.why === 'time' ? `${C.time} ${C[r.how === 'won' ? 'won' : r.how === 'draw' ? 'draw' : 'lost']}` : C[r.how === 'won' ? 'won' : r.how === 'draw' ? 'draw' : 'lost']) : '';
    return html`<div class="card">
      <div class="pick">${r.kind === 'tourney' ? `The tourney · ${ROUND[r.round] || 'Final'}` : 'The ladder'}${r.alone ? ' · alone' : ''}</div>
      <h3>${head} · ${nameOf(r.id)}</h3>
      ${line && html`<div class="quote">The Crier: “${line}”</div>`}
      ${out && html`<div class="quote">“${out}”</div>`}
      <div class="nums">${r.marks ? `+${r.marks} marks` : ''}${r.purse ? `${r.marks ? ' · ' : ''}purse +${r.purse} marks` : ''} · rating ${Math.round(r.r)} (${r.dr >= 0 ? '+' : ''}${r.dr}) · ${TIER_NAME[r.tier]}</div>
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
      <div class="who">Rating <b>${Math.round(b.r)}</b> · ${TIER_NAME[tierOf(b.r).id]} · #${rankOf(S)} of 101 · bracket ${lo}–${hi}<br />Marks <b>${b.marks}</b> · won ${b.won}, lost ${b.lost}, drawn ${b.drawn}</div>
      ${result ? html`<${Result} />` : html`
        <div class="tabs">
          <button class=${tab === 'ladder' ? 'on' : ''} onClick=${() => { tab = 'ladder'; said = ''; draw(); }}>The board</button>
          <button class=${tab === 'tourney' ? 'on' : ''} onClick=${() => { tab = 'tourney'; said = ''; draw(); }}>The tourney</button>
          <button class=${tab === 'table' ? 'on' : ''} onClick=${() => { tab = 'table'; said = ''; draw(); }}>Standings</button>
        </div>
        ${tab === 'ladder' ? html`<${Ladder} />` : tab === 'tourney' ? html`<${Tourney} />` : html`<${Standings} />`}`}
      <div class="said">${said}</div>
      <div class="row">
        ${inBowl && !result && html`<button class="alt" onClick=${() => { sim.commands.push({ type: 'bowlLeave' }); close(); }}>Back to where you were</button>`}
        <button class="alt" onClick=${close}>${inBowl ? 'Stay on the sand' : 'Close'}</button>
      </div>
    </div>`;
  }
  const draw = () => render(html`<${Board} />`, wrap);
  function fight(cmd) { said = ''; sim.commands.push(cmd); setTimeout(() => { if (sim.battle && sim.battle.bout) close(); else draw(); }, 120); }
  function open() { wrap.classList.add('on'); onOpen(); said = ''; sim.commands.push({ type: 'bowlOpen' }); draw(); setTimeout(draw, 150); }   // (the sim rolls the day and draws its five)
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
