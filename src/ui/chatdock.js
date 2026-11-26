// @ts-check
// chatdock.js — the chat dock (the owner, 2026-11-15: "I want to swipe left on the player tiles to show the chat window.
// The chat window can be expanded to cover most of the screen. Battle still happens behind the window. World events can
// show up here", and on its mockup, docs/chat-dock-mockup.html: "event buttons act at once, build as is").
//
// The party cards (party.js) and the chat share the bottom of the screen as two pages: a swipe left on the cards slides
// them out and the chat in, a swipe right on the chat brings them back. The chat's handle drags it up over most of the
// screen (it stops under the HUD's wave pill and the minimap), translucent, so the fight goes on behind it; opened wide it
// shows the company's health in a strip at its top. ◐ sets how much of the fight shows through.
//
// Four channels: All; World (the world's own news: the Kingstone's hour, a boss back in his hall); Chat (other players:
// net/chat.js, offline until online play, and it says so); Company (the company's moments: a level, a boss down, a gate,
// a lamp, a cage, a find, a quest done). Every line here is written below and filled with names; a player's words come
// only through the Chat channel and are drawn as text. A world event's button acts at once (no card first): "Walk there"
// walks the company to the old stones, as the World map's card would, or says in the line why it can't.
// DOM only: reads sim state and events, pushes commands.

import { RING, paidFor } from '../sim/ring.js';
import { LANDS } from '../sim/regions.js';
/** where each region boss stands, for the news (v1.126: Furnace Nine's at the Vault's mouth) */
const WHERE = { kingstone: { place: 'the old stones', land: 'the Greywater Fens', dir: 'north-east of Saltmere', stir: 'The old stones are stirring', verb: 'stands' },
  furnace_nine: { place: 'the Vault’s mouth', land: 'the Cinder Reach', dir: 'up the track north of the Cinderworks', stir: 'The Vault’s mouth glows', verb: 'burns' },
  first_pilgrim: { place: 'the Lip', land: 'the Pale Heights', dir: 'at the head of the Pilgrims’ Stair', stir: 'Something at the Lip is looking down', verb: 'stands' },   // (v1.147)
  the_grace: { place: 'the wreckers’ beach', land: 'the Tidemark', dir: 'south-west of Gullwick', stir: 'A ship stands in to the wreckers’ beach', verb: 'stands in' } };   // (v1.157)
import { CAMP_BY } from '../sim/camps.js';
import { BOSSES } from '../sim/battle.js';
import { SITES } from '../sim/sites.js';
import { statsFor } from '../sim/party.js';
import { swallow } from './actorart.js';
import { cleanLine, MAX_LINE } from '../net/chat.js';

const CSS = `
#party { transition: transform .28s cubic-bezier(.2,.8,.2,1); }
#party.away { transform: translateX(-110vw); }
#party.drag { transition: none; }
#party .card { touch-action: none; }
#party .card.empty { pointer-events: auto; cursor: default; }
#chatDock { position: fixed; z-index: 5; left: 0; right: 0; display: flex; flex-direction: column; box-sizing: border-box;
  font-family: ui-monospace, 'SF Mono', Menlo, Consolas, monospace; color: #e4dccb; background: rgba(14,11,24,.66);
  -webkit-backdrop-filter: blur(1.5px); backdrop-filter: blur(1.5px); border-top: 1px solid #8a7448; border-radius: 8px 8px 0 0;
  padding-bottom: max(calc(env(safe-area-inset-bottom, 0px) - 14px), 6px); transform: translateX(110vw); touch-action: pan-y;
  transition: transform .28s cubic-bezier(.2,.8,.2,1), top .3s cubic-bezier(.2,.8,.2,1), width .3s ease; }
#chatDock.on { transform: none; }
#chatDock.drag { transition: none; }
#chatDock.clear { background: rgba(14,11,24,.38); -webkit-backdrop-filter: none; backdrop-filter: none; }
#chatDock.solid { background: rgba(14,11,24,.96); }
#chatDock .grab { height: 24px; flex: none; display: grid; place-items: center; cursor: ns-resize; touch-action: none; }
#chatDock .grab::before { content: ""; width: 42px; height: 4px; border-radius: 2px; background: #8a7448; }
#chatDock .head { display: flex; align-items: center; gap: 4px; padding: 0 6px 4px; flex: none; }
#chatDock .back { flex: none; width: 44px; height: 32px; border: 1px solid #3a3550; border-radius: 8px; background: none; color: #b8ac98; font: 600 12px ui-monospace, Menlo, monospace; cursor: pointer; }
#chatDock .tabs { display: flex; gap: 2px; flex: 1; min-width: 0; overflow-x: auto; scrollbar-width: none; }
#chatDock .tab { flex: none; height: 32px; padding: 0 9px; border: 1px solid transparent; border-radius: 16px; background: none; color: #9a93a6; font: 600 10px ui-monospace, Menlo, monospace; letter-spacing: 1px; text-transform: uppercase; cursor: pointer; }
#chatDock .tab.on { color: #e7c27a; border-color: #8a7448; background: rgba(231,194,122,.08); }
#chatDock .see { flex: none; width: 36px; height: 32px; border: 1px solid #3a3550; border-radius: 8px; background: none; color: #9a93a6; font: 13px ui-monospace, Menlo, monospace; cursor: pointer; }
#chatDock .glance { display: none; gap: 8px; padding: 0 10px 6px; flex: none; }
#chatDock.big .glance { display: flex; }
#chatDock .gl { flex: 1; min-width: 0; font-size: 9.5px; color: #9a93a6; letter-spacing: .5px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
#chatDock .gl b { color: #e4dccb; font-weight: 600; letter-spacing: 1px; }
#chatDock .gl div { height: 5px; margin-top: 3px; background: #262238; position: relative; }
#chatDock .gl div i { position: absolute; inset: 0 auto 0 0; background: #5aa35c; }
#chatDock .gl.low div i { background: #d24a3c; }
#chatDock .log { flex: 1; min-height: 0; overflow-y: auto; padding: 0 10px 4px; display: flex; flex-direction: column; gap: 4px; touch-action: pan-y; overscroll-behavior: contain; scrollbar-width: thin; }
#chatDock .log > :first-child { margin-top: auto; }
#chatDock .msg { font-size: 12px; line-height: 1.4; overflow-wrap: anywhere; }
#chatDock .msg .who { color: #b9b1ff; font-weight: 600; }
#chatDock .msg.me .who { color: #7fd17f; }
#chatDock .ev { border-left: 2px solid #f0c880; padding: 3px 0 3px 8px; color: #f0c880; font-size: 11.5px; line-height: 1.4; display: flex; gap: 8px; align-items: center; }
#chatDock .ev.co { border-color: #7fd1b4; color: #bfe8d8; }
#chatDock .ev.loot { border-color: #ffb070; color: #ffcc98; }
#chatDock .ev.note { border-color: #5f5876; color: #9a93a6; }
#chatDock .ev .t { flex: 1; min-width: 0; }
#chatDock .ev small { display: block; color: #9a93a6; font-size: 10px; }
#chatDock .ev small.why { color: #ffb0a0; }
#chatDock .act { flex: none; min-height: 32px; padding: 0 10px; border-radius: 16px; border: 1px solid currentColor; background: none; color: inherit; font: 600 10.5px ui-monospace, Menlo, monospace; cursor: pointer; }
#chatDock .ts { color: #6a6382; font-size: 9.5px; margin-right: 5px; }
#chatDock .newer { position: absolute; left: 50%; transform: translateX(-50%); bottom: 54px; height: 28px; padding: 0 12px; border-radius: 14px; border: 1px solid #8a7448; background: rgba(16,13,26,.95); color: #e7c27a; font: 600 10.5px ui-monospace, Menlo, monospace; display: none; cursor: pointer; }
#chatDock .newer.on { display: block; }
#chatDock form { display: flex; gap: 6px; padding: 4px 6px 2px; flex: none; }
#chatDock input { flex: 1; min-width: 0; height: 38px; border-radius: 10px; border: 1px solid #3a3550; background: rgba(8,7,14,.85); color: #e4dccb; padding: 0 10px; font: 16px ui-monospace, Menlo, monospace; }
#chatDock input:disabled { opacity: .55; }
#chatDock input::placeholder { font-size: 11.5px; }
#chatDock .send { height: 38px; padding: 0 12px; border-radius: 10px; border: 1px solid #8a7448; background: rgba(231,194,122,.1); color: #e7c27a; font: 700 11px ui-monospace, Menlo, monospace; letter-spacing: 1px; cursor: pointer; }
#chatDock .send:disabled { opacity: .45; }
#chatDock button:focus-visible { outline: 2px solid #e7c27a; outline-offset: 2px; }
#dockDots { position: fixed; z-index: 5; height: 14px; display: flex; align-items: center; gap: 5px; pointer-events: none; transform: translateX(-50%); }
#dockDots i { width: 5px; height: 5px; border-radius: 50%; background: #4b4560; }
#dockDots i.on { background: #e7c27a; }
#dockDots b { min-width: 14px; height: 14px; border-radius: 7px; background: #c8402c; color: #fff; font: 700 9px/14px ui-monospace, Menlo, monospace; text-align: center; padding: 0 3px; display: none; }
#dockDots b.on { display: block; }
#dockDots.off { display: none; }
body.chatWide #walkChip { display: none !important; }   /* (opened wide: the walk chip steps aside, the walk going on) */
@media (prefers-reduced-motion: reduce) { #party, #chatDock { transition: none; } }
`;
const KEEP = 150;   // lines kept
const LOW = 196;    // the chat's least height (px): three lines and the box to type in, a little over the cards

/**
 * @param {{ sim: any, partyPanel: any, ring: { clock: (f?: (G: any) => boolean) => any }, chat: import('../net/chat.js').Chat, questTitle?: (id: string) => string }} o
 */
export function createChatDock({ sim, partyPanel, ring, chat, questTitle = (id) => id }) {
  const style = document.createElement('style'); style.textContent = CSS; document.head.appendChild(style);
  const party = /** @type {HTMLElement} */ (partyPanel.el);
  const dock = document.createElement('div'); dock.id = 'chatDock'; dock.setAttribute('aria-label', 'Chat');
  dock.innerHTML = `<div class="grab" role="button" tabindex="0" aria-label="Open the chat wide, or close it"></div>
    <div class="head"><button class="back" aria-label="Back to the party">‹</button><div class="tabs" role="tablist">
      <button class="tab on" data-ch="all">All</button><button class="tab" data-ch="world">World</button><button class="tab" data-ch="chat">Chat</button><button class="tab" data-ch="company">Company</button></div>
      <button class="see" aria-label="How much of the fight shows through">◐</button></div>
    <div class="glance" aria-label="The company"></div>
    <div class="log" aria-live="polite"></div><button class="newer">↓ newer</button>
    <form autocomplete="off"><input maxlength="${MAX_LINE}" aria-label="Say something"><button class="send" type="submit">SAY</button></form>`;
  document.body.appendChild(dock);
  const dots = document.createElement('div'); dots.id = 'dockDots'; dots.innerHTML = '<i class="on"></i><i></i><b></b>'; document.body.appendChild(dots);
  swallow(dock);
  const $ = (/** @type {string} */ s) => /** @type {HTMLElement} */ (dock.querySelector(s));
  const log = $('.log'), grab = $('.grab'), glance = $('.glance'), input = /** @type {HTMLInputElement} */ ($('input')), send = /** @type {HTMLButtonElement} */ ($('.send'));
  input.disabled = !chat.online; send.disabled = !chat.online; input.placeholder = chat.online ? 'Say something…' : 'Chat comes with online play';

  // ── where it stands: the party's own place, or, opened wide, up to under the HUD's pill and the minimap ─────────────
  let shown = false, big = false;
  const isLand = () => partyPanel.side() > 0;
  const topWide = () => { const hb = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--hud-b')) || 44; return Math.round(hb + 136); };
  function layout() {
    const r = party.getBoundingClientRect(), H = window.innerHeight;
    if (!r.height) return;
    const top = big ? Math.min(topWide(), r.top) : isLand() ? r.top : Math.min(r.top, r.bottom - LOW);
    dock.style.top = `${Math.round(top)}px`; dock.style.bottom = `${Math.max(0, Math.round(H - r.bottom))}px`;
    if (isLand()) { dock.style.left = `${Math.round(r.left)}px`; dock.style.right = 'auto'; dock.style.width = `${Math.round(big ? Math.max(r.width, window.innerWidth * 0.5) : r.width)}px`; }
    else { dock.style.left = '0'; dock.style.right = '0'; dock.style.width = ''; }
    dots.style.left = `${Math.round(r.left + r.width / 2)}px`; dots.style.top = `${Math.round(r.top - 14)}px`;
    dots.classList.toggle('off', shown);
    dock.classList.toggle('big', big); document.body.classList.toggle('chatWide', big && shown);
  }
  addEventListener('resize', layout); setInterval(layout, 600); layout();
  // showing, the cards' height is the chat's (collapsed): the walk chip, Step out and the quest tracker stand over it
  partyPanel.reserveFor(() => (shown ? LOW : 0));

  // ── the two pages: a swipe on the cards, a swipe on the chat; the back button; the dots say which ──────────────────
  let unread = 0;
  function badge() { const b = /** @type {HTMLElement} */ (dots.querySelector('b')); b.textContent = String(Math.min(unread, 99)); b.classList.toggle('on', unread > 0); }
  function show(on) {
    shown = on; party.classList.toggle('away', on); dock.classList.toggle('on', on);
    party.style.transform = ''; dock.style.transform = '';
    const [a, b] = dots.querySelectorAll('i'); a.classList.toggle('on', !on); b.classList.toggle('on', on);
    if (on) { unread = 0; badge(); toEnd(); } else big = false;
    layout();
  }
  $('.back').addEventListener('click', () => show(false));
  /** a sideways drag from either page @type {{ x: number, y: number, id: number, on: boolean, t: number, from: boolean } | null} */
  let sw = null;
  const startSwipe = (/** @type {PointerEvent} */ e, from) => { sw = { x: e.clientX, y: e.clientY, id: e.pointerId, on: false, t: performance.now(), from }; };
  party.addEventListener('pointerdown', (e) => { if (!shown) startSwipe(e, false); });
  dock.addEventListener('pointerdown', (e) => { const t = /** @type {HTMLElement} */ (e.target); if (shown && !t.closest('.grab, input, button')) startSwipe(e, true); });
  addEventListener('pointermove', (e) => {
    if (!sw || e.pointerId !== sw.id) return;
    const dx = e.clientX - sw.x, dy = e.clientY - sw.y;
    if (!sw.on) {
      if (Math.abs(dx) > 12 && Math.abs(dx) > Math.abs(dy) * 1.3 && (sw.from ? dx > 0 : dx < 0)) { sw.on = true; party.classList.add('drag'); dock.classList.add('drag'); }
      else { if (Math.abs(dy) > 14) sw = null; return; }
    }
    const W = window.innerWidth, d = sw.from ? Math.max(0, dx) : Math.min(0, dx);
    party.style.transform = `translateX(${sw.from ? -W + d : d}px)`; dock.style.transform = `translateX(${sw.from ? d : W + d}px)`;
  });
  const endSwipe = (/** @type {PointerEvent} */ e) => {
    if (!sw || e.pointerId !== sw.id) return; const s = sw; sw = null;
    if (!s.on) return;
    party.classList.remove('drag'); dock.classList.remove('drag');
    const dx = e.clientX - s.x, v = dx / Math.max(1, performance.now() - s.t);
    if (!s.from) show(dx < -70 || v < -0.45); else show(!(dx > 70 || v > 0.45));
  };
  addEventListener('pointerup', endSwipe); addEventListener('pointercancel', endSwipe);

  // ── its height: the handle dragged, or tapped ────────────────────────────────────────────────────────────────────
  /** @type {{ y: number, top: number, id: number, moved: boolean } | null} */ let gd = null;
  grab.addEventListener('pointerdown', (e) => { e.stopPropagation(); gd = { y: e.clientY, top: dock.getBoundingClientRect().top, id: e.pointerId, moved: false }; try { grab.setPointerCapture(e.pointerId); } catch { /* (a test's synthetic pointer) */ } dock.classList.add('drag'); });
  grab.addEventListener('pointermove', (e) => {
    if (!gd || e.pointerId !== gd.id) return; const d = e.clientY - gd.y; if (Math.abs(d) > 4) gd.moved = true;
    const r = party.getBoundingClientRect(), low = isLand() ? r.top : Math.min(r.top, r.bottom - LOW); dock.style.top = `${Math.round(Math.max(topWide(), Math.min(low, gd.top + d)))}px`;
  });
  const endGrab = (/** @type {PointerEvent} */ e) => {
    if (!gd || e.pointerId !== gd.id) return; const g = gd; gd = null; dock.classList.remove('drag');
    const r = party.getBoundingClientRect(), now = dock.getBoundingClientRect().top, mid = (topWide() + r.top) / 2;
    // (a tap toggles; a drag of 90 px or more up opens it, down closes it; less leaves it as it was)
    if (!g.moved) big = !big; else if (now - g.top <= -90) big = true; else if (now - g.top >= 90) big = false; else big = g.top < mid;
    layout(); toEnd();
  };
  grab.addEventListener('pointerup', endGrab); grab.addEventListener('pointercancel', endGrab);
  grab.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); big = !big; layout(); toEnd(); } });
  const LOOKS = ['', 'clear', 'solid'], MARKS = ['◐', '○', '●']; let look = 0;
  $('.see').addEventListener('click', () => { if (LOOKS[look]) dock.classList.remove(LOOKS[look]); look = (look + 1) % 3; if (LOOKS[look]) dock.classList.add(LOOKS[look]); $('.see').textContent = MARKS[look]; });

  // ── the company at a glance (opened wide) ─────────────────────────────────────────────────────────────────────────
  setInterval(() => {
    if (!big || !shown) return;
    const ms = sim.state.party.filter(Boolean);
    if (glance.childElementCount !== ms.length) glance.innerHTML = ms.map(() => '<div class="gl"><b></b> <span></span><div><i></i></div></div>').join('');
    ms.forEach((m, i) => {
      const g = /** @type {HTMLElement} */ (glance.children[i]), f = m.fallen || m.down ? 0 : Math.max(0, Math.min(1, m.hp / statsFor(m).maxHp));
      /** @type {HTMLElement} */ (g.querySelector('b')).textContent = m.name.toUpperCase();
      /** @type {HTMLElement} */ (g.querySelector('span')).textContent = m.fallen ? 'slain' : m.down ? 'down' : `${Math.round(f * 100)}%`;
      /** @type {HTMLElement} */ (g.querySelector('i')).style.width = `${(f * 100).toFixed(1)}%`;
      g.classList.toggle('low', f < 0.35);
    });
  }, 250);

  // ── the log ────────────────────────────────────────────────────────────────────────────────────────────────────────
  let ch = 'all';
  const atEnd = () => log.scrollHeight - log.scrollTop - log.clientHeight < 30;
  function toEnd() { requestAnimationFrame(() => { log.scrollTop = log.scrollHeight; $('.newer').classList.remove('on'); }); }
  log.addEventListener('scroll', () => { if (atEnd()) $('.newer').classList.remove('on'); });
  $('.newer').addEventListener('click', toEnd);
  const vis = (/** @type {HTMLElement} */ el) => { el.hidden = !(ch === 'all' || el.dataset.ch === ch); };
  const stamp = () => { const d = new Date(); return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`; };
  function add(/** @type {HTMLElement} */ el, /** @type {string} */ chn, /** @type {boolean} */ count) {
    el.dataset.ch = chn; const stick = atEnd(); vis(el); log.appendChild(el);
    while (log.childElementCount > KEEP) /** @type {Element} */ (log.firstElementChild).remove();
    if (stick) toEnd(); else if (!el.hidden) $('.newer').classList.add('on');
    if (count && !shown) { unread++; badge(); }
  }
  /** an authored line (the game's), with a button that acts at once
   * @param {'world' | 'company'} chn @param {string} text @param {{ sub?: string, kind?: string, act?: string, run?: () => string }} [o] */
  function event(chn, text, o = {}) {
    const d = document.createElement('div'); d.className = `ev ${o.kind || (chn === 'company' ? 'co' : '')}`;
    const t = document.createElement('div'); t.className = 't';
    const ts = document.createElement('span'); ts.className = 'ts'; ts.textContent = stamp(); t.append(ts, text);
    const sub = document.createElement('small'); if (o.sub) { sub.textContent = o.sub; t.appendChild(sub); }
    d.appendChild(t);
    if (o.act && o.run) {
      const b = document.createElement('button'); b.className = 'act'; b.textContent = o.act;
      b.addEventListener('click', () => { const why = /** @type {() => string} */ (o.run)(); if (why) { sub.textContent = why; sub.className = 'why'; if (!sub.parentNode) t.appendChild(sub); } else { b.textContent = 'On the way'; b.disabled = true; } });
      d.appendChild(b);
    }
    add(d, chn, chn === 'world');
  }
  /** a player's words, as text @param {import('../net/chat.js').ChatLine} l */
  function line(l) {
    const d = document.createElement('div'); d.className = 'msg' + (l.me ? ' me' : '');
    const ts = document.createElement('span'); ts.className = 'ts'; ts.textContent = stamp();
    const w = document.createElement('span'); w.className = 'who'; w.textContent = l.who + (l.lv ? ` L${l.lv}` : '');
    d.append(ts, w, `: ${l.text}`);
    add(d, 'chat', !l.me);
  }
  for (const b of dock.querySelectorAll('.tab')) b.addEventListener('click', () => {
    for (const q of dock.querySelectorAll('.tab')) q.classList.toggle('on', q === b);
    ch = /** @type {HTMLElement} */ (b).dataset.ch || 'all'; for (const el of log.children) vis(/** @type {HTMLElement} */ (el)); toEnd();
  });
  chat.onLine(line);
  $('form').addEventListener('submit', (e) => {
    e.preventDefault(); const v = cleanLine(input.value); if (!v) return;
    const r = chat.send(v); if (r.ok) { line({ who: 'You', text: v, at: Date.now(), me: true }); input.value = ''; } else event('company', r.why || 'Not sent.', { kind: 'note' });
  });
  if (!chat.online) { const d = document.createElement('div'); d.className = 'ev note'; const t = document.createElement('div'); t.className = 't'; t.textContent = chat.why; d.appendChild(t); add(d, 'chat', false); }

  // ── the world's news ───────────────────────────────────────────────────────────────────────────────────────────────
  const S = () => sim.state;
  // "Walk there", at once: to just outside the boss's ground on your side (the World map's walk), or why not
  /** @param {typeof RING} G */
  function toStones(G = RING) {
    const w = sim.world, H = S().party[0], C = CAMP_BY[G.camp], W = WHERE[G.id] || WHERE.kingstone;
    if (!H || H.level < G.minLevel) return `${G.name} takes a company from level ${G.minLevel}.`;
    if (sim.battle && sim.battle.ring) return `You’re at ${W.place}.`;
    if (w.kind !== 'overland' || w.region !== G.region) return w.kind === 'dungeon' ? `Climb out first: ${W.place} are in ${W.land}.`.replace('mouth are', 'mouth is') : (w.region || S().region) !== G.region ? `${W.place[0].toUpperCase()}${W.place.slice(1)} ${G.id === 'kingstone' ? 'are' : 'is'} in ${W.land}, ${W.dir}.` : 'Take the road out first.';
    const P = S().player, dx = P.x - C.x, dy = P.y - C.y, dd = Math.hypot(dx, dy) || 1, k = Math.min(dd, C.reach + 3) / dd, s = sim.spotNear(C.x + dx * k, C.y + dy * k);
    if (!s) return 'No way there from here.';
    sim.commands.push({ type: 'goto', tx: s.tx, ty: s.ty, near: 0, then: null, label: W.place[0].toUpperCase() + W.place.slice(1) });
    return '';
  }
  const mmss = (/** @type {number} */ t) => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, '0')}`;
  let soonFor = '', openFor = '';
  const away = new Map();   // bosses away (state.bossBack), to say when each is back
  const siteOfBoss = (/** @type {string} */ id) => { for (const s of Object.values(SITES)) if (Object.values(s.bosses || {}).includes(id)) return s.name; return ''; };
  setInterval(() => {
    if (!S().created) return;
    // (a boss the hero could fight: of its band, and Furnace Nine only once broken)
    const H = S().party[0], mine = (/** @type {typeof RING} */ G) => !!(H && H.level >= G.minLevel && (!G.lamp || (S().lampsBroken || []).includes(G.lamp)) && LANDS[G.region]);   // (v1.147: a land of the game's: not yet the Heights)
    const c = ring.clock(mine), G = (c && c.G) || RING, W = WHERE[G.id] || WHERE.kingstone;
    if (c && mine(G) && c.soon && soonFor !== c.id) { soonFor = c.id; event('world', `${W.stir} · ${G.name} ${W.verb} at ${c.at}`, { sub: `${W.land} · from level ${G.minLevel} · fought at ${G.level}`, act: 'Walk there', run: () => toStones(G) }); }
    if (c && mine(G) && c.open && openFor !== c.id) { openFor = c.id; if (!paidFor(S(), c.id)) event('world', `${G.name} ${W.verb} at ${W.place}`, { sub: `${mmss(c.left)} left · up to five companies`, act: 'Walk there', run: () => toStones(G) }); }
    const back = S().bossBack || {}, t = S().t;
    for (const [id, at] of Object.entries(back)) if (at > t) away.set(id, at);
    for (const [id, at] of away) if (at <= t) { away.delete(id); if (BOSSES[id]) event('world', `${BOSSES[id].name} holds the hall again`, { sub: siteOfBoss(id) }); }
  }, 1000);

  // ── the company's moments ──────────────────────────────────────────────────────────────────────────────────────────
  const RW = { rare: 'Rare', heirloom: 'Heirloom' };
  const on = (/** @type {string} */ k, /** @type {(e: any) => void} */ f) => sim.bus.on(k, f);
  on('levelUp', (e) => event('company', `${e.name} reaches level ${e.level}`));
  on('bossDown', (e) => { if (e.spared) { event('company', `${e.name} sits down`, { sub: 'on his own steps: beaten, not killed' }); return; }   // (Lucan, v1.154)
    if (!e.raid && !e.tower) event('company', `${e.name} falls`, { sub: e.first ? 'something was left behind · back in 30 min' : 'back in 30 min · the room fights on' }); else event('company', `${e.name} falls`); });
  on('gateOpened', (e) => event('company', 'A gate is down', { sub: e.hall ? 'the way to the hall is open' : 'the way on is open' }));
  on('lampBroken', (e) => event('company', `${e.name} breaks`, { sub: e.first ? `${e.held} souls go free` : 'its line lies down' }));
  on('cageBroken', (e) => event('company', `${e && e.by ? `${e.by} breaks a cage` : 'A cage breaks'} · a soul goes free`));
  on('loot', (e) => { const it = e.item; if (it && RW[it.r]) event('company', `Found: ${it.name}`, { sub: RW[it.r], kind: 'loot' }); });
  on('questReward', (e) => event('company', `Done: ${questTitle(e.id)}`, { sub: [e.xp ? `+${e.xp} XP` : '', e.gold ? `+${e.gold} gold` : ''].filter(Boolean).join(' · ') }));
  on('resurrected', (e) => event('company', `${e.name} is raised`));
  on('defeat', () => event('company', 'The company is beaten', { sub: 'you wake at the temple' }));

  return { show, get shown() { return shown; }, get big() { return big; }, open: (/** @type {boolean} */ wide) => { show(true); big = wide; layout(); toEnd(); } };
}
