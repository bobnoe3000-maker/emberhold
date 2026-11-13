// @ts-check
// bowl.js (ui) — the Bowl (GDD §17 v1.85, v1.88; sim/bowl.js; docs/bowl-arena-proposal.md §13, the owner's approved mockup
// tools/arena-spike/board-mockup.html):
//   · the board, from ☰ → The Bowl (from level 6): your rating and tier, your rank of the 101 and your marks; Team or
//     Individual (the company, or the hero alone: a ladder each), then Challenge (the five on the board, each a player's
//     name, rank, rating and company as classes and levels, one Fight button; five new faces for 100, 250, 500 gold) or
//     Rankings (the top five and the players round you, overall or in today's tourney). A bout enters you in the day's
//     tourney: the strip over the board shows your place;
//   · on the sand: a bar at the top, the Crier's call, the clock and each side's share of HP standing; and the bout's
//     speed, 1×, 2× or 4× (the owner, 2026-11-13: "Add a 2 and 4x speed up button option to the arena"): main.js runs
//     the sim's ticks and the render's clock that much faster while a bout is on, nothing else. The sim is the same
//     tick for tick at any speed (a replay doesn't know), so it's the viewer's to choose; remembered on this device;
//   · the result: won, lost or drawn, the Crier's line, the marks, the rating and the tourney place; Challenge, or Back.
// Every word is content/arena.json's or written here (a rival is shown by its player's name, made up for now). It pushes
// commands (bowlOpen, bowlRefresh, bowlBout, bowlLeave) and reads state; the sim checks every one. Preact + htm.

import { html, render } from 'htm/preact';
import { swallow } from './actorart.js';
import { CLASSES } from '../sim/party.js';
import { statsFor } from '../sim/party.js';
import { DAY_S } from '../sim/heroes.js';
import { BOWL, tierOf, companyOn, fieldOn, rankOf, dayOf, tourneyOf, tourneyTable, refreshCostOf, purseFor } from '../sim/bowl.js';
import { makeCompany } from '../sim/rivals.js';

const TIER_NAME = { sweepers: 'Sweepers', sand: 'the Sand', lower: 'Lower Tiers', upper: 'Upper Tiers', box: 'the Sun’s Box' };
/** a class's mark on its chip's edge (its name written beside it: never by colour alone) */
const CLS_COL = { fighter: '#b8463a', rogue: '#6a8a4a', cleric: '#e6d6a0', mage: '#5a7ab8', shaman: '#8a5a8a' };

const CSS = `
#bowlWrap { position: fixed; inset: 0; z-index: 12; display: none; background: rgba(10,8,6,.97); color: #efe4cf; font-family: Georgia, serif; overflow-y: auto;
  padding: calc(env(safe-area-inset-top, 0px) + 14px) max(16px, env(safe-area-inset-right, 0px)) calc(env(safe-area-inset-bottom, 0px) + 18px) max(16px, env(safe-area-inset-left, 0px)); }
#bowlWrap.on { display: block; }
#bowl { max-width: 460px; margin: 0 auto; display: flex; flex-direction: column; gap: 10px; }
#bowl .kind { font: 11px ui-monospace, Menlo, monospace; letter-spacing: 2px; color: #d8b060; text-transform: uppercase; }
#bowl .head { display: flex; justify-content: space-between; align-items: flex-end; }
#bowl h2 { font: 600 24px Georgia, serif; color: #f5d78a; margin: 0; }
#bowl .x { width: 44px; height: 44px; border-radius: 10px; border: 1px solid rgba(216,176,96,.4); background: none; color: #cbbfae; font-size: 18px; }
#bowl .me { display: flex; gap: 8px; }
#bowl .stat { flex: 1; background: rgba(255,255,255,.04); border: 1px solid rgba(216,176,96,.22); border-radius: 10px; padding: 6px 8px; min-width: 0; }
#bowl .stat .k { font: 10.5px ui-monospace, Menlo, monospace; letter-spacing: 1.5px; text-transform: uppercase; color: #b9a27a; }
#bowl .stat .v { font: 600 17px Georgia, serif; color: #efe4cf; }
#bowl .stat .t { font: 11px ui-monospace, Menlo, monospace; color: #b9a98e; }
#bowl .seg { display: flex; background: rgba(255,255,255,.04); border: 1px solid rgba(216,176,96,.35); border-radius: 12px; padding: 3px; gap: 3px; }
#bowl .seg button { flex: 1; min-height: 44px; border-radius: 9px; border: 0; background: none; font: 600 15px Georgia, serif; color: #cbbfae; }
#bowl .seg button.on { background: linear-gradient(#e6c47a, #a07a2e); color: #1a1208; }
#bowl .subt { display: flex; gap: 22px; border-bottom: 1px solid rgba(216,176,96,.2); padding: 0 4px; }
#bowl .subt button { min-height: 44px; padding: 0; border: 0; border-bottom: 2px solid transparent; margin-bottom: -1px; background: none; font: 600 14px Georgia, serif; color: #a8987e; }
#bowl .subt button.on { color: #f5d78a; border-bottom-color: #e6c47a; }
#bowl .tour { display: flex; align-items: center; gap: 10px; background: rgba(216,176,96,.1); border: 1px solid rgba(216,176,96,.4); border-radius: 10px; padding: 8px 10px; font-size: 13px; color: #e8d8b8; }
#bowl .tour .dot { width: 9px; height: 9px; border-radius: 50%; background: #8fc06a; flex: none; }
#bowl .tour .dot.off { background: rgba(255,255,255,.25); }
#bowl .tour b { color: #f5d78a; font-weight: 600; }
#bowl .tour .r { margin-left: auto; font: 11px ui-monospace, Menlo, monospace; color: #b9a98e; white-space: nowrap; }
#bowl .bar { display: flex; justify-content: space-between; align-items: center; gap: 8px; font: 12px ui-monospace, Menlo, monospace; color: #cbbfae; }
#bowl .bar b { color: #efe4cf; }
#bowl .bar button { min-height: 44px; padding: 2px 12px; border-radius: 10px; background: none; color: #e6c47a; border: 1px solid rgba(216,176,96,.55); font: 600 13px Georgia, serif; display: flex; flex-direction: column; justify-content: center; align-items: center; }
#bowl .bar button small { font: 11px ui-monospace, Menlo, monospace; color: #c8b896; font-weight: 400; }
#bowl .card { display: flex; align-items: center; gap: 8px; background: rgba(26,20,14,.92); border: 1px solid rgba(216,176,96,.3); border-radius: 12px; padding: 10px 10px 10px 12px; }
#bowl .card .who { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 5px; }
#bowl .card .top { display: flex; align-items: baseline; gap: 8px; }
#bowl .card .prk { font: 600 12px ui-monospace, Menlo, monospace; color: #d8b060; min-width: 30px; }
#bowl .card .nm { font: 600 16px Georgia, serif; color: #efe4cf; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
#bowl .card .rt { margin-left: auto; font: 12px ui-monospace, Menlo, monospace; color: #cbbfae; white-space: nowrap; }
#bowl .chips { display: flex; gap: 4px; flex-wrap: wrap; }
#bowl .chip { font: 11px ui-monospace, Menlo, monospace; padding: 2px 5px; border-radius: 6px; background: rgba(255,255,255,.05); border: 1px solid rgba(255,255,255,.1); border-left-width: 3px; color: #dccfb8; white-space: nowrap; }
#bowl .chip b { color: #f0e6d2; font-weight: 600; }
#bowl button.fight { min-width: 66px; min-height: 46px; border-radius: 10px; font: 600 14px Georgia, serif; background: linear-gradient(#e6c47a, #a07a2e); color: #1a1208; border: 1px solid #f5d78a; }
#bowl button.fight.done { background: none; color: #8a7a62; border-color: rgba(216,176,96,.25); font-weight: 400; font-size: 13px; }
#bowl .row { display: flex; gap: 8px; }
#bowl button.go { flex: 1; min-height: 46px; border-radius: 10px; font: 600 14px Georgia, serif; background: linear-gradient(#e6c47a, #a07a2e); color: #1a1208; border: 1px solid #f5d78a; }
#bowl button.alt { flex: 1; min-height: 46px; border-radius: 10px; font: 600 14px Georgia, serif; background: none; color: #e6c47a; border: 1px solid rgba(216,176,96,.55); }
#bowl button:disabled { opacity: .45; }
#bowl .note { font-size: 12.5px; color: #a8987e; line-height: 1.45; }
#bowl .said { font-size: 13px; color: #ff9a7a; min-height: 1em; }
#bowl .res { background: rgba(26,20,14,.92); border: 1px solid rgba(216,176,96,.35); border-radius: 12px; padding: 12px; display: flex; flex-direction: column; gap: 8px; }
#bowl .res h3 { margin: 0; font: 600 19px Georgia, serif; color: #f5d78a; }
#bowl .res .quote { font-style: italic; font-size: 13.5px; color: #c8b896; }
#bowl .res .nums { font: 12px ui-monospace, Menlo, monospace; color: #dccfb8; line-height: 1.7; }
#bowl .filters { display: flex; gap: 6px; flex-wrap: wrap; }
#bowl .filters button { min-height: 36px; font: 12px ui-monospace, Menlo, monospace; padding: 0 12px; border-radius: 999px; border: 1px solid rgba(216,176,96,.3); background: none; color: #cbbfae; }
#bowl .filters button.on { background: rgba(216,176,96,.18); color: #f5d78a; border-color: rgba(216,176,96,.7); }
#bowl table { width: 100%; border-collapse: collapse; font: 12.5px ui-monospace, Menlo, monospace; color: #dccfb8; }
#bowl th { text-align: left; font-weight: 400; color: #b9a27a; font-size: 11px; letter-spacing: 1.5px; text-transform: uppercase; padding: 4px; }
#bowl td { padding: 8px 4px; border-bottom: 1px solid rgba(216,176,96,.12); }
#bowl td.n { font-family: Georgia, serif; font-size: 14px; color: #efe4cf; }
#bowl td.r, #bowl th.r { text-align: right; }
#bowl tr.you td { color: #f5d78a; font-weight: 600; background: rgba(216,176,96,.08); }
#bowl tr.gap td { text-align: center; color: #7a6c58; padding: 3px; border: 0; }
#boutBar { position: fixed; left: 50%; transform: translateX(-50%); top: calc(env(safe-area-inset-top, 0px) + 54px); z-index: 6; display: none; min-width: 240px; max-width: 92vw;
  background: rgba(14,10,8,.88); border: 1px solid rgba(216,176,96,.5); border-radius: 12px; padding: 6px 12px; color: #efe4cf; font: 12px ui-monospace, Menlo, monospace; text-align: center; pointer-events: none; }
#boutBar.on { display: block; }
#boutBar .t { font: 600 18px Georgia, serif; color: #f5d78a; }
#boutBar .hp { display: flex; gap: 8px; align-items: center; justify-content: center; margin-top: 3px; }
#boutBar .meter { width: 90px; height: 6px; background: rgba(255,255,255,.12); border-radius: 3px; overflow: hidden; }
#boutBar .meter i { display: block; height: 100%; }
#boutBar .crier { font: italic 13px Georgia, serif; color: #e8d8b8; margin-top: 3px; }
#boutSpeed { position: fixed; left: calc(12px + env(safe-area-inset-left, 0px)); bottom: 140px; z-index: 5; display: none; gap: 4px; padding: 3px;
  background: rgba(14,10,8,.88); border: 1px solid rgba(216,176,96,.5); border-radius: 12px; }
#boutSpeed.on { display: flex; }
#boutSpeed button { min-width: 44px; min-height: 44px; border-radius: 9px; border: 0; background: none; color: #cbbfae; font: 600 14px Georgia, serif; }
#boutSpeed button.on { background: linear-gradient(#e6c47a, #a07a2e); color: #1a1208; }
`;

/** @param {{ sim: any, onOpen?: () => void, onClose?: () => void }} o */
export function createBowl({ sim, onOpen = () => {}, onClose = () => {} }) {
  const style = document.createElement('style'); style.textContent = CSS; document.head.appendChild(style);
  const wrap = document.createElement('div'); wrap.id = 'bowlWrap'; wrap.setAttribute('role', 'dialog'); wrap.setAttribute('aria-label', 'The Bowl');
  document.body.appendChild(wrap); swallow(wrap);
  const bar = document.createElement('div'); bar.id = 'boutBar'; bar.setAttribute('aria-live', 'polite'); document.body.appendChild(bar);
  // the bout's speed: buttons of their own (the bar above is rebuilt as the clock runs, and would lose a tap)
  const SPEEDS = [1, 2, 4], KEY = 'emberfall.boutSpeed';
  let speed = 1; try { const v = +localStorage.getItem(KEY); if (SPEEDS.includes(v)) speed = v; } catch { /* (no storage: 1×) */ }
  const pace = document.createElement('div'); pace.id = 'boutSpeed'; pace.setAttribute('role', 'group'); pace.setAttribute('aria-label', 'Bout speed');
  document.body.appendChild(pace); swallow(pace);
  const paceBtns = SPEEDS.map((v) => {
    const b = document.createElement('button'); b.textContent = `${v}×`; b.setAttribute('aria-label', `Speed ${v} times`);
    b.addEventListener('click', () => { speed = v; try { localStorage.setItem(KEY, String(v)); } catch { /* (kept for the session) */ } showPace(); });
    pace.append(b); return b;
  });
  const showPace = () => paceBtns.forEach((b, i) => { const on = SPEEDS[i] === speed; b.classList.toggle('on', on); b.setAttribute('aria-pressed', on ? 'true' : 'false'); });
  showPace();
  /** @type {any} */ let words = null;
  fetch('./content/arena.json').then((r) => r.json()).then((d) => { words = { crier: d.crier, by: Object.fromEntries(d.companies.map((c) => [c.id, c])) }; if (wrap.classList.contains('on')) draw(); }).catch(() => {});
  /** @type {'team' | 'solo'} */ let mode = 'team';
  let sub = 'challenge', table = 'overall', said = '', result = /** @type {any} */ (null), crier = '';
  const playerOf = (id) => (words && words.by[id] && words.by[id].player) || '…';
  sim.bus.on('refused', (e) => { if (wrap.classList.contains('on')) { said = e.reason; draw(); } });

  // a player's company as the board shows it: each member's class and level (rivals.js makes it as the bout will)
  const lineups = new Map();
  const lineupOf = (id, level, grade) => {
    const k = `${id}|${level}|${grade}`; let L = lineups.get(k);
    if (!L) { L = makeCompany(id, level, grade).map((m) => ({ cls: m.cls, level: m.level })); lineups.set(k, L); if (lineups.size > 400) lineups.clear(); }
    return L;
  };
  const Chip = ({ m }) => html`<span class="chip" style=${`border-left-color: ${CLS_COL[m.cls] || '#888'}`}>${(CLASSES[m.cls] || CLASSES.fighter).label} <b>${m.level}</b></span>`;

  function Card({ c, open, left }) {
    const L = lineupOf(c.id, sim.state.party[0].level, c.grade), who = mode === 'solo' ? L.slice(0, 1) : L;
    return html`<div class="card">
      <div class="who">
        <div class="top"><span class="prk">#${c.rank}</span><span class="nm">${playerOf(c.id)}</span><span class="rt">${c.rating}</span></div>
        <div class="chips">${who.map((m, i) => html`<${Chip} key=${i} m=${m} />`)}</div>
      </div>
      ${open ? html`<button class="fight" disabled=${!left} onClick=${() => fight({ type: 'bowlBout', id: c.id, mode })}>Fight</button>` : html`<button class="fight done" disabled>Fought</button>`}
    </div>`;
  }
  function Strip() {
    const b = sim.state.bowl, T = tourneyOf(b, mode), last = b.lastTourney, left = Math.ceil((DAY_S - (((sim.state.t % DAY_S) + DAY_S) % DAY_S)) / 60);
    const y = last && last.day === b.day - 1 ? last[mode] : null;
    return html`<div class="tour"><span class=${T.in ? 'dot' : 'dot off'}></span>
      <span>${T.in ? html`Today’s tourney: <b>entered</b> · ${T.w}–${T.l}${T.d ? `–${T.d}` : ''} · place #${T.place}` : y ? html`Yesterday: #${y.place}${y.purse ? `, +${y.purse} marks` : ''}. A bout enters today’s` : 'Today’s tourney: your first bout enters you'}</span>
      <span class="r">ends in ${left} m</span></div>`;
  }
  function Challenge() {
    const S = sim.state, b = S.bowl, L = b[mode], d = dayOf(S), board = (L.shown || []).slice(-BOWL.picks), left = Math.max(0, BOWL.fights - b.paid);
    const cost = refreshCostOf(b), gold = S.counters.gold || 0, more = Math.max(0, BOWL.refreshCost.length - b.refresh);
    return html`
      <${Strip} />
      <div class="bar"><span>Bouts today <b>${b.paid}</b>/${BOWL.fights}</span>
        <button disabled=${cost === null || gold < cost} onClick=${() => { said = ''; sim.commands.push({ type: 'bowlRefresh', mode }); setTimeout(draw, 120); }}>
          ${cost === null ? 'No new faces' : `New faces · ${cost} gold`}<small>${cost === null ? 'until tomorrow' : gold < cost ? `you have ${gold} gold` : `${more} left today`}</small></button></div>
      ${board.map((id) => html`<${Card} key=${id} c=${companyOn(id, d, mode)} open=${L.picks.includes(id)} left=${left > 0} />`)}
      <div class="note">${mode === 'team' ? 'Easiest first. A win 2–6 marks, a loss or draw 1. One try a player a day.' : 'Your hero alone against theirs; your companions watch from the fence. The ten bouts a day are shared with Team.'}</div>`;
  }
  function Rankings() {
    const S = sim.state, b = S.bowl, L = b[mode], d = dayOf(S), you = S.party[0].name || 'You';
    let rows;
    if (table === 'overall') {
      const me = rankOf(S, mode);
      rows = /** @type {any[]} */ (fieldOn(d, mode).map((c) => ({ id: c.id, a: c.rating, b: `${c.won}–${c.lost}` })));
      rows.splice(me - 1, 0, { id: 'you', a: Math.round(L.r), b: `${L.won}–${L.lost}` });
    } else rows = tourneyTable(b, mode).map((t) => ({ id: t.id, a: t.w, g: t.g }));
    const at = rows.findIndex((r) => r.id === 'you'), show = new Set([...rows.slice(0, 5).map((r) => r.id), ...rows.slice(Math.max(0, at - 2), at + 4).map((r) => r.id)]);
    const out = []; let gap = false;
    rows.forEach((r, i) => {
      if (!show.has(r.id)) { if (!gap) out.push(html`<tr class="gap"><td colspan="4">⋯</td></tr>`); gap = true; return; }
      gap = false;
      out.push(html`<tr class=${r.id === 'you' ? 'you' : ''}><td>#${i + 1}</td><td class="n">${r.id === 'you' ? `You (${you})` : playerOf(r.id)}</td><td class="r">${r.a}</td><td class="r">${table === 'overall' ? r.b : `${r.g >= 0 ? '+' : ''}${r.g}`}</td></tr>`);
    });
    return html`
      <div class="filters">
        <button class=${table === 'overall' ? 'on' : ''} onClick=${() => { table = 'overall'; draw(); }}>Overall</button>
        <button class=${table === 'today' ? 'on' : ''} onClick=${() => { table = 'today'; draw(); }}>Today’s tourney</button>
      </div>
      <table><tr><th>Rank</th><th>Player</th><th class="r">${table === 'overall' ? 'Rating' : 'Wins'}</th><th class="r">${table === 'overall' ? 'W–L' : 'Gained'}</th></tr>${out}</table>
      <div class="note">${table === 'overall' ? `The Bowl’s ${mode === 'team' ? 'Team' : 'Individual'} ladder: a hundred players, ten bouts a day each, on the rules you fight by.` : `Today’s tourney: everyone who fights today is in it, by the day’s wins, then the rating gained. At the day’s end the top places are paid: 1st ${purseFor(1)}, to 3rd ${purseFor(3)}, to 8th ${purseFor(8)}, to 16th ${purseFor(16)} marks.`}</div>`;
  }
  function Result() {
    const r = result, C = words ? words.crier : null, k = r.how === 'won' ? 'won' : r.how === 'draw' ? 'draw' : 'lost';
    const head = r.how === 'won' ? 'Won' : r.how === 'draw' ? 'A draw' : 'Lost', line = C ? (r.why === 'time' ? `${C.time} ${C[k]}` : C[k]) : '';
    return html`<div class="res">
      <div class="kind">${r.mode === 'solo' ? 'Individual' : 'Team'}</div>
      <h3>${head} · ${playerOf(r.id)}</h3>
      ${line && html`<div class="quote">The Crier: “${line}”</div>`}
      <div class="nums">+${r.marks} marks · rating ${Math.round(r.r)} (${r.dr >= 0 ? '+' : ''}${r.dr}) · ${TIER_NAME[r.tier]}<br />Today’s tourney: place #${r.place} of ${r.of}</div>
      <div class="row">
        <button class="alt" onClick=${() => { result = null; mode = r.mode === 'solo' ? 'solo' : 'team'; sub = 'challenge'; draw(); }}>Challenge</button>
        <button class="go" onClick=${() => { result = null; sim.commands.push({ type: 'bowlLeave' }); close(); }}>Back to where you were</button>
      </div>
    </div>`;
  }
  function Board() {
    const S = sim.state, b = S.bowl, L = b[mode], inBowl = sim.world.site === 'bowl';
    const tab = (v, on, label, set) => html`<button class=${on ? 'on' : ''} aria-pressed=${on ? 'true' : 'false'} onClick=${() => { set(v); said = ''; draw(); }}>${label}</button>`;
    return html`<div id="bowl">
      <div class="kind">Solmere · the Quarry Ring</div>
      <div class="head"><h2>The Bowl</h2><button class="x" aria-label="Close" onClick=${close}>✕</button></div>
      <div class="me">
        <div class="stat"><div class="k">Rating</div><div class="v">${Math.round(L.r)}</div><div class="t">${TIER_NAME[tierOf(L.r).id]}</div></div>
        <div class="stat"><div class="k">Rank</div><div class="v">#${rankOf(S, mode)}</div><div class="t">of 101</div></div>
        <div class="stat"><div class="k">Marks</div><div class="v">${b.marks}</div><div class="t">of the Bowl</div></div>
      </div>
      ${result ? html`<${Result} />` : html`
        <div class="seg" role="tablist">${tab('team', mode === 'team', 'Team', (v) => { mode = v; })}${tab('solo', mode === 'solo', 'Individual', (v) => { mode = v; })}</div>
        <div class="subt" role="tablist">${tab('challenge', sub === 'challenge', 'Challenge', (v) => { sub = v; })}${tab('rankings', sub === 'rankings', 'Rankings', (v) => { sub = v; })}</div>
        ${sub === 'challenge' ? html`<${Challenge} />` : html`<${Rankings} />`}`}
      <div class="said">${said}</div>
      ${inBowl && !result && html`<div class="row"><button class="alt" onClick=${() => { sim.commands.push({ type: 'bowlLeave' }); close(); }}>Back to where you were</button><button class="alt" onClick=${close}>Stay on the sand</button></div>`}
    </div>`;
  }
  const draw = () => { if (sim.state.bowl && sim.state.bowl.team) render(html`<${Board} />`, wrap); };
  function fight(cmd) { said = ''; sim.commands.push(cmd); setTimeout(() => { if (sim.battle && sim.battle.bout) close(); else draw(); }, 120); }
  function open() { wrap.classList.add('on'); onOpen(); said = ''; sim.commands.push({ type: 'bowlOpen' }); draw(); setTimeout(draw, 150); }   // (the sim rolls the day and draws its fives)
  function close() { wrap.classList.remove('on'); render(null, wrap); onClose(); }

  // on the sand: the Crier's call, the clock, each side's share of HP
  sim.bus.on('bout', (e) => {
    const C = words ? words.crier : null;
    if (e.t === 'call') crier = words && words.by[e.id] ? `${playerOf(e.id)}${sim.battle && sim.battle.bout && sim.battle.bout.alone ? '' : '’s company'}!` : '';
    if (e.t === 'go') crier = C ? C.call : '';
    if (e.t === 'over') crier = '';
  });
  sim.bus.on('bowlResult', (r) => { result = r; setTimeout(open, 600); });
  const share = (list) => { let a = 0, t = 0; for (const m of list) { const mx = statsFor(m).maxHp; t += mx; a += m.down ? 0 : Math.max(0, m.hp); } return t ? a / t : 0; };
  let lastKey = '';
  function tick() {
    const B = sim.battle && sim.battle.bout;
    if (!B) { if (bar.classList.contains('on')) { bar.classList.remove('on'); pace.classList.remove('on'); } lastKey = ''; return; }
    if (!pace.classList.contains('on')) pace.classList.add('on');
    const left = Math.max(0, Math.ceil(B.call > 0 ? B.call : B.secs - B.t)), a = share(B.ours), r = share(B.rivals);
    const key = `${left}|${Math.round(a * 50)}|${Math.round(r * 50)}|${crier}|${B.call > 0}`; if (key === lastKey) return; lastKey = key;
    bar.classList.add('on');
    const t = B.call > 0 ? `${left}…` : `${Math.floor(left / 60)}:${String(left % 60).padStart(2, '0')}`;
    bar.innerHTML = '';
    const tt = document.createElement('div'); tt.className = 't'; tt.textContent = t; bar.append(tt);
    const hp = document.createElement('div'); hp.className = 'hp';
    const meter = (f, col) => { const m = document.createElement('span'); m.className = 'meter'; const i = document.createElement('i'); i.style.width = `${Math.round(f * 100)}%`; i.style.background = col; m.append(i); return m; };
    hp.append('You', meter(a, '#d6b05c'), meter(r, '#c4483a'), playerOf(B.id)); bar.append(hp);
    if (crier) { const c = document.createElement('div'); c.className = 'crier'; c.textContent = crier; bar.append(c); }
  }
  setInterval(tick, 200);
  return { open, close, get isOpen() { return wrap.classList.contains('on'); },
    /** how many times faster the game runs now: the chosen speed while a bout is on, else 1 (main.js frame) */
    get speed() { return sim.battle && sim.battle.bout ? speed : 1; } };
}
