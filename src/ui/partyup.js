// @ts-check
// partyup.js (ui) — Party Up and raids (GDD §18 v1.97; sim/raid.js; docs/party-up-raids-proposal.md, the owner's
// mockup docs/party-up-mockup.html and decisions 2026-11-14), stage 1: offline, the two other seats filled by stand-ins.
//   · from ☰ → Party Up: raids left today (three a hero), you, raids won; Make a group: the dungeon (the band dungeons,
//     each with its band, floors, last boss, and why not when it can't be raided yet), what each open seat wants (Any or a
//     class), then Find two: the lobby, the seats filling with the players the Guild finds (raid.js standIns: the same two
//     the sim will field), and Set out (raidOut: a raid spent). Find a group and friends wait for online play (stage 2–3);
//     the screen says so;
//   · on a raid: the board says so, with Leave the raid (walking out, the same: raidLeave);
//   · the end: won (the coffer: gold, cinders and the piece, its rarity in words), lost (no cost: the owner) or left;
//     a won raid's card takes you back (raidLeave), the others have already brought you home.
// Every word is written here; it pushes commands (raidOut, raidLeave) and reads state; the sim checks every one.

import { html, render } from 'htm/preact';
import { swallow } from './actorart.js';
import { CLASSES } from '../sim/party.js';
import { RAID, RAID_CLASSES, raidOf, standIns } from '../sim/raid.js';

/** a class's mark on its chip's edge (its name written beside it: never by colour alone) */
const CLS_COL = { fighter: '#b8463a', rogue: '#6a8a4a', cleric: '#e6d6a0', mage: '#5a7ab8', shaman: '#8a5a8a' };
const RARITY = { common: 'Common', fine: 'Fine', rare: 'Rare', heirloom: 'Heirloom' };
const WHY = { level: (r) => `from level ${r.base}`, land: () => 'its land isn’t open to you yet', shut: () => 'the way in isn’t found yet' };

const CSS = `
#raidWrap { position: fixed; inset: 0; z-index: 12; display: none; background: rgba(10,8,6,.97); color: #efe4cf; font-family: Georgia, serif; overflow-y: auto;
  padding: calc(env(safe-area-inset-top, 0px) + 14px) max(16px, env(safe-area-inset-right, 0px)) calc(env(safe-area-inset-bottom, 0px) + 18px) max(16px, env(safe-area-inset-left, 0px)); }
#raidWrap.on { display: block; }
#raid { max-width: 460px; margin: 0 auto; display: flex; flex-direction: column; gap: 10px; }
#raid .kind { font: 11px ui-monospace, Menlo, monospace; letter-spacing: 2px; color: #d8b060; text-transform: uppercase; }
#raid .head { display: flex; justify-content: space-between; align-items: flex-end; }
#raid h2 { font: 600 24px Georgia, serif; color: #f5d78a; margin: 0; }
#raid h3 { font: 11px ui-monospace, Menlo, monospace; letter-spacing: 2px; color: #b9a27a; text-transform: uppercase; margin: 4px 0 0; font-weight: 400; }
#raid .x { width: 44px; height: 44px; border-radius: 10px; border: 1px solid rgba(216,176,96,.4); background: none; color: #cbbfae; font-size: 18px; }
#raid .me { display: flex; gap: 8px; }
#raid .stat { flex: 1; background: rgba(255,255,255,.04); border: 1px solid rgba(216,176,96,.22); border-radius: 10px; padding: 6px 8px; min-width: 0; }
#raid .stat .k { font: 10.5px ui-monospace, Menlo, monospace; letter-spacing: 1.5px; text-transform: uppercase; color: #b9a27a; }
#raid .stat .v { font: 600 17px Georgia, serif; color: #efe4cf; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
#raid .stat .t { font: 11px ui-monospace, Menlo, monospace; color: #b9a98e; }
#raid .opt { display: flex; align-items: center; gap: 10px; background: rgba(26,20,14,.92); border: 1px solid rgba(216,176,96,.25); border-radius: 12px; padding: 9px 12px; min-height: 52px; text-align: left; color: inherit; font: inherit; width: 100%; }
#raid .opt .rad { width: 16px; height: 16px; border-radius: 50%; border: 2px solid rgba(216,176,96,.6); flex: none; box-sizing: border-box; }
#raid .opt.on { border-color: #e6c47a; background: rgba(216,176,96,.1); }
#raid .opt.on .rad { background: radial-gradient(#e6c47a 45%, transparent 50%); border-color: #e6c47a; }
#raid .opt:disabled { opacity: .5; }
#raid .opt .t1 { font: 600 15px Georgia, serif; color: #efe4cf; }
#raid .opt .t2 { font: 11.5px ui-monospace, Menlo, monospace; color: #b9a98e; }
#raid .opt .lv { margin-left: auto; font: 12px ui-monospace, Menlo, monospace; color: #d8b060; white-space: nowrap; }
#raid .filters { display: flex; gap: 6px; flex-wrap: wrap; }
#raid .filters button { min-height: 40px; font: 12.5px ui-monospace, Menlo, monospace; padding: 0 12px; border-radius: 999px; border: 1px solid rgba(216,176,96,.3); background: none; color: #cbbfae; }
#raid .filters button.on { background: rgba(216,176,96,.18); color: #f5d78a; border-color: rgba(216,176,96,.7); }
#raid .seat { display: flex; align-items: center; gap: 10px; background: rgba(26,20,14,.92); border: 1px solid rgba(216,176,96,.3); border-radius: 12px; padding: 10px 12px; min-height: 64px; box-sizing: border-box; }
#raid .seat.empty { border-style: dashed; background: none; }
#raid .pt { width: 42px; height: 42px; border-radius: 10px; flex: none; display: grid; place-items: center; font: 600 16px Georgia, serif; color: #1a1208; }
#raid .seat .who { flex: 1; min-width: 0; }
#raid .seat .n1 { font: 600 16px Georgia, serif; color: #efe4cf; }
#raid .seat .n2 { font: 12px ui-monospace, Menlo, monospace; color: #b9a98e; }
#raid .tag { font: 600 11.5px ui-monospace, Menlo, monospace; padding: 4px 7px; border-radius: 6px; white-space: nowrap; }
#raid .tag.ok { background: rgba(143,192,106,.18); color: #bfe0a0; border: 1px solid rgba(143,192,106,.6); }
#raid .tag.wait { background: rgba(216,176,96,.12); color: #e6c47a; border: 1px solid rgba(216,176,96,.5); }
#raid button.go { width: 100%; min-height: 48px; border-radius: 10px; font: 600 15px Georgia, serif; background: linear-gradient(#e6c47a, #a07a2e); color: #1a1208; border: 1px solid #f5d78a; display: flex; flex-direction: column; align-items: center; justify-content: center; }
#raid button.go small { font: 11px ui-monospace, Menlo, monospace; font-weight: 400; }
#raid button.alt { width: 100%; min-height: 46px; border-radius: 10px; font: 600 14px Georgia, serif; background: none; color: #e6c47a; border: 1px solid rgba(216,176,96,.55); }
#raid button:disabled { opacity: .45; }
#raid .note { font-size: 12.5px; color: #a8987e; line-height: 1.45; }
#raid .said { font-size: 13px; color: #ff9a7a; min-height: 1em; }
#raid .loot { display: flex; align-items: center; gap: 10px; background: rgba(26,20,14,.92); border: 1px solid rgba(216,176,96,.3); border-radius: 12px; padding: 10px 12px; }
#raid .loot .t1 { font: 600 15px Georgia, serif; color: #efe4cf; }
#raid .loot .t2 { font: 12px ui-monospace, Menlo, monospace; color: #b9a98e; }
#raid .loot.rare { border-color: #5a8ad8; } #raid .loot.fine { border-color: #6ca24a; } #raid .loot.heirloom { border-color: #d89a3a; }
#raid .rw { color: #9cc0ff; font-weight: 600; } #raid .fw { color: #a6d68a; font-weight: 600; } #raid .hw { color: #f0b860; font-weight: 600; }
`;

/** @param {{ sim: any, onOpen?: () => void, onClose?: () => void }} o */
export function createPartyUp({ sim, onOpen = () => {}, onClose = () => {} }) {
  const style = document.createElement('style'); style.textContent = CSS; document.head.appendChild(style);
  const wrap = document.createElement('div'); wrap.id = 'raidWrap'; wrap.setAttribute('role', 'dialog'); wrap.setAttribute('aria-label', 'Party Up');
  document.body.appendChild(wrap); swallow(wrap);
  /** @type {'make' | 'lobby' | 'end'} */ let view = 'make';
  let site = '', seats = ['any', 'any'], found = 0, said = '', end = /** @type {any} */ (null);
  /** @type {any} */ let timer = 0;
  sim.bus.on('refused', (e) => { if (wrap.classList.contains('on')) { said = e.reason; draw(); } });
  sim.bus.on('raidEnd', (e) => { end = e; view = 'end'; setTimeout(open, e.won ? 1400 : 300); });
  sim.bus.on('raidStarted', () => { view = 'make'; if (wrap.classList.contains('on')) close(); });

  const label = (c) => (CLASSES[c] || CLASSES.fighter).label;
  const where = () => { const k = sim.raid ? sim.raid.from : sim.world.kind; return k === 'town' ? 'town' : k === 'overland' ? 'the road' : 'where you were'; };   // (where the raid set out from)

  function Head({ kind }) {
    const S = sim.state, H = S.party[0], r = raidOf(S);
    return html`
      <div class="kind">${kind}</div>
      <div class="head"><h2>Party Up</h2><button class="x" aria-label="Close" onClick=${close}>✕</button></div>
      <div class="me">
        <div class="stat"><div class="k">Raids today</div><div class="v">${RAID.perDay - r.used} of ${RAID.perDay}</div><div class="t">new each day</div></div>
        <div class="stat"><div class="k">You</div><div class="v">${H.name}</div><div class="t">${label(H.cls)} ${H.level}</div></div>
        <div class="stat"><div class="k">Raids won</div><div class="v">${r.won}</div><div class="t">${r.dry ? `${r.dry} coffer${r.dry > 1 ? 's' : ''} since a Rare` : 'coffers'}</div></div>
      </div>`;
  }
  function Make() {
    const rows = sim.raidSites(), pick = rows.find((q) => q.id === site && q.ok) || rows.slice().reverse().find((q) => q.ok);
    if (pick) site = pick.id;
    const left = RAID.perDay - raidOf(sim.state).used;
    const Seat = ({ i }) => html`<div class="filters" role="radiogroup" aria-label=${`Seat ${i + 2} wants`}>${['any', ...RAID_CLASSES].map((c) => html`
      <button class=${seats[i] === c ? 'on' : ''} aria-pressed=${seats[i] === c ? 'true' : 'false'} onClick=${() => { seats = seats.map((v, j) => (j === i ? c : v)); draw(); }}>${c === 'any' ? 'Any' : label(c)}</button>`)}</div>`;
    return html`
      <h3>The dungeon</h3>
      ${rows.map((r) => html`<button class=${`opt${r.id === site ? ' on' : ''}`} disabled=${!r.ok} aria-pressed=${r.id === site ? 'true' : 'false'} onClick=${() => { site = r.id; draw(); }}>
        <span class="rad"></span><div><div class="t1">${r.name}</div><div class="t2">${r.ok ? `${r.floors} floors · ${r.bossName || 'its hall'}` : WHY[r.why](r)}</div></div><span class="lv">lv ${r.base}–${r.top}</span></button>`)}
      <h3>Seat 2 wants</h3><${Seat} i=${0} />
      <h3>Seat 3 wants</h3><${Seat} i=${1} />
      <button class="go" disabled=${!pick || left <= 0} onClick=${() => { said = ''; view = 'lobby'; found = 0; fill(); draw(); }}>Find two<small>${left > 0 ? 'the Guild finds who’s free' : 'no raids left today'}</small></button>
      <div class="note">You lead. Just your hero goes; your companions wait where you left them. Each room holds ${RAID.waves} waves, the last hall’s boss ends it, and what you find is for your class alone. A loss costs nothing. Finding a group of other players, and friends, come with online play.</div>`;
  }
  // the lobby: the two the sim will field (raid.js standIns, the raid's number next), shown as they're found
  const pending = () => standIns(sim.seed, raidOf(sim.state).n + 1, sim.state.party[0], seats);
  function fill() { clearTimeout(timer); const step = () => { if (view !== 'lobby' || found >= 2) return; found++; draw(); timer = setTimeout(step, 700); }; timer = setTimeout(step, 600); }
  function Lobby() {
    const S = sim.state, H = S.party[0], two = pending(), row = sim.raidSites().find((q) => q.id === site);
    const Seat = ({ m, i }) => (i < found
      ? html`<div class="seat"><div class="pt" style=${`background:${CLS_COL[m.cls]}`}>${label(m.cls)[0]}</div><div class="who"><div class="n1">${m.name}</div><div class="n2">${label(m.cls)} · level ${m.level}</div></div><span class="tag ok">Ready ✓</span></div>`
      : html`<div class="seat empty"><div class="pt" style="background:rgba(255,255,255,.06);color:#b9a98e">?</div><div class="who"><div class="n1" style="color:#e6c47a">Looking for ${seats[i] === 'any' ? 'anyone' : `a ${label(seats[i])}`}…</div><div class="n2">the Guild asks around</div></div><span class="tag wait">open</span></div>`);
    return html`
      <div class="kind">${row ? `${row.name} · lv ${row.base}–${row.top} · a raid` : 'a raid'}</div>
      <div class="head"><h2>Your group</h2><button class="x" aria-label="Close" onClick=${close}>✕</button></div>
      <div class="seat"><div class="pt" style=${`background:${CLS_COL[H.cls]}`}>${label(H.cls)[0]}</div><div class="who"><div class="n1">♛ ${H.name} (you)</div><div class="n2">${label(H.cls)} · level ${H.level} · you lead</div></div><span class="tag ok">Ready ✓</span></div>
      ${two.map((m, i) => html`<${Seat} key=${i} m=${m} i=${i} />`)}
      <button class="go" disabled=${found < 2} onClick=${setOut}>Set out<small>${found < 2 ? 'when all three are ready' : `spends one of today’s ${RAID.perDay} raids`}</small></button>
      <button class="alt" onClick=${() => { clearTimeout(timer); view = 'make'; said = ''; draw(); }}>Back</button>
      <div class="note">They follow you and fight on their own; what they find is theirs, what you find is yours.</div>`;
  }
  function setOut() { said = ''; sim.commands.push({ type: 'raidOut', site, seats }); }   // (the board closes when the raid has started: raidStarted; a refusal says why)
  function On() {
    const R = sim.raid;
    return html`
      <div class="loot"><div><div class="t1">You’re on a raid: ${R.name}</div><div class="t2">floor ${R.depth + 1} of ${R.floors} · ${R.rooms} room${R.rooms === 1 ? '' : 's'} won</div></div></div>
      <button class="alt" disabled=${!!sim.battle && !sim.battle.quiet} onClick=${() => { sim.commands.push({ type: 'raidLeave' }); close(); }}>${R.done ? `Back to ${where()}` : 'Leave the raid'}</button>
      <div class="note">${R.done ? 'The raid is won.' : 'Leaving ends the raid; it’s still spent. Not in the middle of a fight.'}</div>`;
  }
  function End() {
    const e = end, c = e.coffer, it = c && c.item, mins = Math.max(1, Math.round(e.secs / 60));
    const head = e.won ? 'Raid won' : e.why === 'wipe' ? 'The raid is lost' : 'You left the raid';
    return html`
      <div class="kind">${e.name} · ${e.won ? `won in ${mins} min` : `${e.rooms} room${e.rooms === 1 ? '' : 's'} won`}</div>
      <div class="head"><h2>${e.won ? 'Your coffer' : head}</h2><button class="x" aria-label="Close" onClick=${finish}>✕</button></div>
      ${e.won ? html`
        <div class="note" style="font-size:13.5px;color:#cbbfae">The last hall’s boss is down. Your coffer is rolled for your class alone.</div>
        ${it && html`<div class=${`loot ${it.r}`}><div><div class="t1">${it.name}</div><div class="t2"><span class=${it.r === 'rare' ? 'rw' : it.r === 'heirloom' ? 'hw' : 'fw'}>${RARITY[it.r] || it.r}</span> · item level ${it.ilv}</div></div></div>`}
        <div class="loot"><div><div class="t1">${c.gold} gold · ${c.cinders} cinders</div><div class="t2">the coffer’s own</div></div></div>
        <button class="go" onClick=${finish}>Back to ${where()}</button>`
      : html`
        <div class="note" style="font-size:13.5px;color:#cbbfae">${e.why === 'wipe' ? 'Your group was beaten. It costs nothing: you’re back where you set out, as you were, and you keep what you found.' : 'You’re back where you set out, and you keep what you found. The raid is still spent.'}</div>
        <button class="go" onClick=${finish}>Continue</button>`}`;
  }
  function finish() { if (sim.raid) sim.commands.push({ type: 'raidLeave' }); end = null; view = 'make'; close(); }
  function Board() {
    const kind = `${sim.world.kind === 'town' ? 'the Guild’s board' : 'the Guild'} · raids`;
    return html`<div id="raid">
      ${view === 'end' && end ? html`<${End} />` : view === 'lobby' ? html`<${Lobby} />` : html`<${Head} kind=${kind} />${sim.raid ? html`<${On} />` : html`<${Make} />`}`}
      <div class="said">${said}</div>
    </div>`;
  }
  const draw = () => render(html`<${Board} />`, wrap);
  function open() { wrap.classList.add('on'); onOpen(); if (view !== 'end') { said = ''; if (view !== 'lobby') view = 'make'; } draw(); }
  function close() { clearTimeout(timer); if (view === 'lobby') view = 'make'; wrap.classList.remove('on'); render(null, wrap); onClose(); }
  return { open, close, get isOpen() { return wrap.classList.contains('on'); } };
}
