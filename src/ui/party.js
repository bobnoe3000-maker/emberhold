// party.js (UI) — the party's stat cards along the bottom of the screen: you in the
// centre, up to two hired companions either side. Each card: portrait (cut from the
// character's own baked atlas), level badge, name, class, HP bar, ATK / DEF / CRT / DDG,
// and level + XP bar. Empty companion slots point you at a tavern. Tapping a card opens that
// member's character sheet (sheet.js); a green badge flags an upgrade waiting in the bag, a
// "+N" one points to spend. A Fallen member's card greys out and says so; Weakened shows in
// amber. DOM only.

import { CLASSES, statsFor, xpToNext } from '../sim/party.js';
import { pendingPoints } from '../sim/attributes.js';
import { pendingSkillPoints } from '../sim/skills.js';
import { esc, drawPortrait, PORTRAIT_W, PORTRAIT_H } from './actorart.js';
import { wageOf, hired } from '../sim/companions.js';
import { RANK_COL } from './sellswords.js';

const CSS = `
#party { position: fixed; left: 0; right: 0; bottom: 0; z-index: 4; display: grid; grid-template-columns: 1fr 1.08fr 1fr; gap: 6px;
  padding: 6px 8px max(calc(env(safe-area-inset-bottom, 0px) - 14px), 8px);   /* was inset + 8px: 22 px lower on a phone with a home bar, still above it */ background: linear-gradient(rgba(10,8,14,0), rgba(10,8,14,0.92) 22%);
  font-family: ui-monospace, 'SF Mono', Menlo, Consolas, monospace; color: #d8d2c6; pointer-events: none; }
#party .card { position: relative; background: rgba(14,12,20,0.94); border: 1px solid #2c2838; border-radius: 3px; padding: 6px 7px 7px; min-width: 0; }
#party .card.main { border-color: #a07a3c; box-shadow: inset 0 0 0 1px rgba(160,122,60,0.25); }
#party .card.down { opacity: .55; filter: grayscale(.8); }
#party .card.down .hp span { color: #ff8a7a; }
#party .card.fallen { opacity: .6; filter: grayscale(1); border-color: #4a5468; }
#party .card.fallen .hp span { color: #c8d4e8; }
#party .card.weak .hp i { background: #b08040; }
#party .card .ptb { position: absolute; top: -7px; left: -4px; background: #8fe07a; color: #10200c; font-size: 8px; font-weight: 700; border-radius: 7px; padding: 1px 5px; }
#party .card.empty { border: 1px dashed #3a3448; background: rgba(14,12,20,0.6); display: flex; align-items: center; justify-content: center;
  text-align: center; font-size: 9.5px; color: #6f6880; letter-spacing: .5px; line-height: 1.35; }
#party .top { display: flex; gap: 6px; align-items: center; margin-bottom: 5px; }
#party .pf { position: relative; width: 34px; height: 40px; flex: none; background: #0c0a12; border: 1px solid #2c2838; }
#party .pf canvas { width: 100%; height: 100%; }
#party .lv { position: absolute; left: -1px; bottom: -1px; background: #b8862e; color: #1a1208; font-size: 8px; font-weight: 700; padding: 0 2px; }
#party .nm { font-size: 11px; letter-spacing: 1.5px; font-weight: 700; color: #ece6da; text-transform: uppercase; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
#party .cl { font-size: 9px; letter-spacing: 1px; color: #8a8498; margin-top: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
#party .hp { position: relative; height: 11px; background: #1c1a22; border: 1px solid #2c2838; margin-bottom: 5px; }
#party .hp i { position: absolute; left: 0; top: 0; bottom: 0; background: #5aa35c; }
#party .hp span { position: absolute; right: 3px; top: -1px; font-size: 8.5px; color: #f2f0ea; text-shadow: 0 1px 0 #000; }
#party .st { display: grid; grid-template-columns: auto 1fr auto 1fr; gap: 2px 4px; font-size: 9px; color: #8a8498; letter-spacing: 1px; }
#party .st b { color: #e8e2d4; font-weight: 600; text-align: right; }
#party .st b.hi { color: #8fd0ff; }
#party .wg { flex: none; border: 1px solid; border-radius: 6px; font-size: 9px; font-weight: 700; letter-spacing: .2px; padding: 0 4px; line-height: 12px; }
#party .wg.owed { background: #4a1612; color: #ffb0a0 !important; border-color: #ff8a7a !important; }
#party .xp { display: flex; align-items: center; gap: 5px; margin-top: 5px; font-size: 9px; color: #c09a50; letter-spacing: 1px; }
#party .xp div { flex: 1; height: 3px; background: #26222e; position: relative; }
#party .xp div i { position: absolute; left: 0; top: 0; bottom: 0; background: #d8a040; }
/* A phone on its side (the owner, 2026-10-03): the cards stack in a column on the left, under the HUD row, and the
   rest of the screen keeps its portrait places. You on top, compact: a smaller portrait, the four stats in one row.
   --party-side (set below) tells the bars, the tracker, the walk chip and the camera how wide the column is. */
@media (orientation: landscape) and (max-height: 540px) {
  /* --pl: the notch's inset when it's on this side (ui/safearea.js), else 16 px, clear of the screen's rounded corner */
  #party { --pl: max(16px, calc(var(--safe-l, env(safe-area-inset-left, 0px)) + 6px));
    right: auto; top: calc(env(safe-area-inset-top, 0px) + 54px); width: calc(214px + var(--pl)); box-sizing: border-box;
    grid-template-columns: 1fr; grid-auto-rows: min-content; align-content: end; gap: 5px;
    padding: 0 8px max(calc(env(safe-area-inset-bottom, 0px) - 14px), 12px) var(--pl);
    background: none; }   /* the cards are opaque; a shade behind the column read as a dark box round the HUD corner */
  #party .card { padding: 5px 7px 6px; }
  #party .card.main { order: -1; }
  #party .card.empty { padding: 7px; font-size: 9px; }
  #party .card.empty br { display: none; }
  #party .top { margin-bottom: 4px; }
  #party .pf { width: 28px; height: 33px; }
  #party .hp { margin-bottom: 4px; }
  /* one row: each label beside its value, the four pairs spread across (DDG 18.6% had run out of the card, and in
     eight even columns a value sat nearer the next label than its own) */
  #party .st { grid-template-columns: max-content max-content 1fr max-content max-content 1fr max-content max-content 1fr max-content max-content; gap: 2px 0; letter-spacing: 0; font-size: 8.5px; }
  #party .st b { padding-left: 3px; }
  #party .st > :nth-child(3) { grid-column: 4; } #party .st > :nth-child(4) { grid-column: 5; }
  #party .st > :nth-child(5) { grid-column: 7; } #party .st > :nth-child(6) { grid-column: 8; }
  #party .st > :nth-child(7) { grid-column: 10; } #party .st > :nth-child(8) { grid-column: 11; }
  #party .xp { margin-top: 4px; }
}
`;
const LANDSCAPE = '(orientation: landscape) and (max-height: 540px)';

// one painted portrait per actor (actorart.js), copied into every card that shows it: cards re-render
// often, and a copy is instant where a fresh paint would flash
const portraitCache = new Map();
function portrait(actor) {
  if (portraitCache.has(actor)) return portraitCache.get(actor);
  const c = document.createElement('canvas'); c.width = PORTRAIT_W; c.height = PORTRAIT_H;
  drawPortrait(c, actor, () => { for (const el of document.querySelectorAll(`canvas[data-actor="${actor}"]`)) { const y = el.getContext('2d'); y.clearRect(0, 0, el.width, el.height); y.drawImage(c, 0, 0); } });
  portraitCache.set(actor, c);
  return c;
}

export function createPartyPanel(sim) {
  const style = document.createElement('style'); style.textContent = CSS; document.head.appendChild(style);
  const el = document.createElement('div'); el.id = 'party'; document.body.appendChild(el);
  const hint = document.getElementById('hint'); if (hint) hint.style.display = 'none';

  let onCard = null, badge = () => false;                  // set by the character sheet (sheet.js)
  const card = (m, idx) => {
    if (!m) return `<div class="card empty">empty slot<br> hire at a<br> town tavern</div>`;
    const c = CLASSES[m.cls], s = statsFor(m), need = xpToNext(m.level), actor = m.actor || c.actor;
    const hp = Math.max(0, Math.round(m.hp));
    const pts = pendingPoints(m) + pendingSkillPoints(m);
    // a companion's rank and wage (GDD §6.2): ◆ 72/d, ◆ OWED, or ◆ free for a found one; the word, not just the colour
    const col = RANK_COL[m.rank] || '#c8bcae', wg = m.main || !m.rank ? '' : m.owed > 0 ? '<span class="wg owed">◆ OWED</span>'
      : `<span class="wg" style="color:${col};border-color:${col}">◆ ${hired(m) ? `${wageOf(m, false)}/d` : 'free'}</span>`;
    return `<div class="card${m.main ? ' main' : ''}${m.down ? ' down' : ''}${m.fallen ? ' fallen' : ''}${m.weakUntil > 0 ? ' weak' : ''}" data-idx="${idx}">${badge(m) ? '<span class="upb">▲ UPGRADE</span>' : ''}${pts ? `<span class="ptb">+${pts}</span>` : ''}
      <div class="top"><div class="pf"><canvas width="${PORTRAIT_W}" height="${PORTRAIT_H}" data-actor="${actor}"></canvas><div class="lv">L${m.level}</div></div>
        <div style="min-width:0"><div class="nm">${esc(m.name)}</div><div class="cl">${c.label.toUpperCase()}${m.weakUntil > 0 ? ' · WEAK' : ''}</div></div></div>
      <div class="hp"><i style="width:${Math.round((100 * hp) / s.maxHp)}%"></i><span>${m.fallen ? 'SLAIN' : m.down ? 'DOWN' : hp + '/' + s.maxHp}</span></div>
      <div class="st"><span>ATK</span><b class="${m.cls === 'mage' ? 'hi' : ''}">${s.atk}</b><span>DEF</span><b>${s.def}</b>
        <span>CRT</span><b>${s.crit}%</b><span>DDG</span><b>${s.dodge}%</b></div>
      <div class="xp">LV ${m.level}<div><i style="width:${Math.round((100 * m.xp) / need)}%"></i></div>${wg}</div></div>`;
  };
  function draw() {
    const [you, a, b] = sim.state.party;
    el.innerHTML = card(a, 1) + card(you, 0) + card(b, 2);
    for (const cv of el.querySelectorAll('canvas[data-actor]')) { const src = portrait(cv.dataset.actor); const x = cv.getContext('2d'); x.clearRect(0, 0, cv.width, cv.height); x.drawImage(src, 0, 0); }
  }
  sim.bus.on('partyChanged', draw);
  // live: HP / XP / level move in battle — redraw a few times a second when anything changed
  let sig = '';
  const gearSig = () => (sim.state.bag || []).length + ':' + sim.state.party.map((m) => Object.values(m.gear || {}).map((it) => (it ? it.uid : '-')).join('.')).join('/');
  setInterval(() => { const n = sim.state.party.map((m) => `${Math.round(m.hp)}|${m.xp}|${m.level}|${m.down ? 1 : 0}|${m.fallen ? 1 : 0}|${m.weakUntil > 0 ? 1 : 0}|${pendingPoints(m) + pendingSkillPoints(m)}|${m.actor}|${m.name}|${m.rank || ''}|${m.owed || 0}|${hired(m) ? wageOf(m, false) : 0}`).join(',') + gearSig(); if (n !== sig) { sig = n; draw(); } }, 180);
  draw();
  // tap a card: that member's character sheet. The cards re-render several times a second
  // in battle (HP ticks), so the press and the release can land on two copies of the same
  // card — match them by index rather than relying on 'click'.
  let press = null;
  const idxOf = (e) => { const c = e.target.closest && e.target.closest('.card[data-idx]'); return c ? +c.dataset.idx : -1; };
  el.addEventListener('pointerdown', (e) => { const i = idxOf(e); if (i < 0) return; e.stopPropagation(); press = { i, x: e.clientX, y: e.clientY }; });
  el.addEventListener('pointerup', (e) => { const i = idxOf(e); if (press && i === press.i && Math.hypot(e.clientX - press.x, e.clientY - press.y) < 14 && onCard) onCard(i); press = null; });
  for (const ev of ['touchstart', 'mousedown']) el.addEventListener(ev, (e) => { if (idxOf(e) >= 0) e.stopPropagation(); });
  // the column's width for everything that lays out round it (CSS reads --party-side, the renderer too); in the
  // column the cards take no height off the bottom
  const land = window.matchMedia ? window.matchMedia(LANDSCAPE) : null, isLand = () => !!(land && land.matches);
  const side = () => (isLand() ? Math.round(el.getBoundingClientRect().right) : 0);
  const mark = () => document.documentElement.style.setProperty('--party-side', `${side()}px`);
  mark(); window.addEventListener('resize', mark); if (land && land.addEventListener) land.addEventListener('change', mark);
  return { el, height: () => (isLand() ? 0 : el.getBoundingClientRect().height), side, refresh: () => { sig = ''; draw(); },
    onCard: (fn) => { onCard = fn; }, badge: (fn) => { badge = fn; draw(); } };
}
