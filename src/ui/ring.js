// @ts-check
// ring.js (ui) — the Kingstone's screens (GDD §19 v1.105, sim/ring.js; docs/region-boss-proposal.md §1). The sim keeps no
// clock, so this reads the device's and says when a window is on (the top of every hour, the owner: "world boss at the
// top of each hour for now (24x)"), and what a player needs round it:
//   - a line under the top bar from ten minutes before the hour (*The Kingstone stands in 7:12*) and through the window
//     (*The Kingstone stands · 11:03 left*), for a hero of the Fens' band; a toast as it starts to stir;
//   - **Enter the Ring** while a window's open and the company is at the old stones (`ringEnter`, with the window's id and
//     the seconds it has left; the sim checks the rest and says why not);
//   - in the Ring, a bar: its HP, cracked or not, the window's time, the companies in it (n / 5), and the hero's getting up;
//     toasts as companies come in, as it cracks, as stones fall;
//   - the end card from `ringResult`: how it ended, the tier (its word beside its colour), the pay, the companies' parts
//     ranked, and **Leave** (`ringLeave`).
// A dev query (localhost) holds a window open: ?dev&ring=on. DOM only: reads sim state and events, pushes commands. Every
// word is written here; names are content/arena.json's (a company by its player's, as the Bowl's board shows them).

import { swallow } from './actorart.js';
import { RING, windowAt, paidFor } from '../sim/ring.js';
import { CAMP_BY } from '../sim/camps.js';

const CSS = `
#ringLine { position: fixed; left: calc(10px + env(safe-area-inset-left, 0px)); top: calc(var(--hud-b, 44px) + 6px); z-index: 4; display: none; pointer-events: none; max-width: calc(100vw - 150px);
  background: rgba(18,14,10,.9); border: 1px solid rgba(255,150,80,.5); border-radius: 12px; padding: 4px 10px; color: #ffd8b0;
  font: 12px/1.35 ui-monospace, Menlo, monospace; box-shadow: 0 2px 10px rgba(0,0,0,.45); }
#ringLine.on { display: block; }
#ringLine b { color: #ffb070; font-weight: 600; }
#ringBar { position: fixed; left: 12px; right: 12px; top: calc(var(--hud-b, 44px) + 6px); z-index: 4; display: none; max-width: 440px; margin: 0 auto; pointer-events: none;
  background: rgba(16,12,10,.92); border: 1px solid rgba(255,140,70,.55); border-radius: 12px; padding: 6px 10px 7px; color: #efe4cf; box-shadow: 0 2px 12px rgba(0,0,0,.5); }
#ringBar.on { display: block; }
#ringBar .top { display: flex; justify-content: space-between; align-items: baseline; gap: 8px; font: 600 13px Georgia, serif; color: #ffcf9a; }
#ringBar .top small { font: 11.5px ui-monospace, Menlo, monospace; color: #e6d6c0; font-weight: 400; }
#ringBar .hp { position: relative; height: 10px; margin-top: 5px; border-radius: 5px; background: rgba(255,255,255,.1); overflow: hidden; }
#ringBar .hp i { position: absolute; left: 0; top: 0; bottom: 0; background: linear-gradient(90deg, #c8461e, #ff9a3a); }
#ringBar .hp em { position: absolute; left: 50%; top: 0; bottom: 0; width: 1px; background: rgba(255,240,220,.6); }
#ringBar .sub { margin-top: 4px; font: 11.5px ui-monospace, Menlo, monospace; color: #cbbfae; }
#ringBar .sub b { color: #ffd0a0; font-weight: 600; }
#ringToast { position: fixed; left: 50%; transform: translateX(-50%); top: calc(var(--hud-b, 44px) + 74px); z-index: 4; display: none; pointer-events: none; max-width: 92vw;
  background: rgba(30,14,8,.92); border: 1px solid rgba(255,140,70,.6); border-radius: 10px; padding: 6px 12px; color: #ffe4c8; font: 13px Georgia, serif; text-align: center; }
#ringToast.on { display: block; }
#ringEnter { position: fixed; left: 50%; transform: translateX(-50%); bottom: calc(env(safe-area-inset-bottom, 0px) + 150px); z-index: 5; display: none; min-height: 52px; min-width: 240px; max-width: 86vw;
  border-radius: 26px; border: 1px solid #ffc890; background: linear-gradient(#ff9a50, #b4461c); color: #1a0c06; box-shadow: 0 4px 18px rgba(0,0,0,.55), 0 0 18px rgba(255,140,60,.35);
  font: 600 16px Georgia, serif; padding: 6px 18px; }
#ringEnter.on { display: block; }
#ringEnter small { display: block; font: 11px ui-monospace, Menlo, monospace; color: #3a1a0a; margin-top: 1px; }
#ringCard { position: fixed; left: 12px; right: 12px; bottom: calc(env(safe-area-inset-bottom, 0px) + 150px); z-index: 7; max-width: 440px; margin: 0 auto; display: none;
  background: rgba(16,11,8,.97); border: 1px solid rgba(255,150,80,.55); border-radius: 14px; padding: 13px 14px 12px; color: #efe4cf;
  box-shadow: 0 6px 28px rgba(0,0,0,.6), 0 0 22px rgba(255,140,60,.14); font-family: Georgia, serif; max-height: 70vh; overflow: auto; }
#ringCard.on { display: block; }
#ringCard .kind { font: 11px ui-monospace, Menlo, monospace; letter-spacing: 2px; color: #ffb070; text-transform: uppercase; }
#ringCard h2 { font: 600 19px Georgia, serif; color: #ffd8b0; margin: 2px 0 6px; }
#ringCard p { font-size: 14px; line-height: 1.4; margin: 0 0 8px; }
#ringCard .tier { display: inline-block; font: 600 13px ui-monospace, Menlo, monospace; padding: 2px 8px; border-radius: 8px; border: 1px solid currentColor; margin-bottom: 6px; }
#ringCard .tier.gold { color: #ffd060; } #ringCard .tier.silver { color: #d8dde6; } #ringCard .tier.bronze { color: #e0965a; } #ringCard .tier.none { color: #a89c8c; }
#ringCard .nums { font: 12px ui-monospace, Menlo, monospace; color: #cbbfae; line-height: 1.6; margin: 0 0 8px; }
#ringCard .nums b { color: #efe4cf; font-weight: 600; }
#ringCard ol { margin: 0 0 10px; padding-left: 22px; font: 12px ui-monospace, Menlo, monospace; color: #d8ccb8; line-height: 1.55; }
#ringCard ol li.you { color: #ffd8a0; font-weight: 600; }
#ringCard button { width: 100%; min-height: 46px; border-radius: 10px; font: 600 15px Georgia, serif; background: linear-gradient(#ff9a50, #b4461c); color: #1a0c06; border: 1px solid #ffc890; }
`;
const TIER = { gold: 'Gold', silver: 'Silver', bronze: 'Bronze' }, RW = { common: 'Common', fine: 'Fine', rare: 'Rare', heirloom: 'Heirloom' };
const mmss = (s) => { s = Math.max(0, Math.ceil(s)); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`; };

/** @param {{ sim: any, params?: URLSearchParams, dev?: boolean }} o */
export function createRing({ sim, params, dev = false }) {
  const style = document.createElement('style'); style.textContent = CSS; document.head.appendChild(style);
  const mk = (tag, id) => { const e = document.createElement(tag); e.id = id; document.body.appendChild(e); return e; };
  const line = mk('div', 'ringLine'), bar = mk('div', 'ringBar'), toast = mk('div', 'ringToast');
  const enter = /** @type {HTMLButtonElement} */ (mk('button', 'ringEnter')); swallow(enter);
  const card = mk('div', 'ringCard'); card.setAttribute('role', 'dialog'); card.setAttribute('aria-label', 'The Kingstone: the end'); swallow(card);
  bar.innerHTML = '<div class="top"><span>The Kingstone</span><small></small></div><div class="hp"><i></i><em></em></div><div class="sub"></div>';
  const barTop = /** @type {HTMLElement} */ (bar.querySelector('.top small')), barHp = /** @type {HTMLElement} */ (bar.querySelector('.hp i')), barSub = /** @type {HTMLElement} */ (bar.querySelector('.sub'));
  const held = dev && params && params.get('ring') === 'on';      // (localhost: a window held open, for tests and captures)
  /** @type {Record<string, any>} */ let by = {};
  fetch('./content/arena.json').then((r) => r.json()).then((d) => { by = Object.fromEntries(d.companies.map((c) => [c.id, c])); }).catch(() => {});
  const who = (id) => (by[id] && (by[id].player || by[id].name)) || 'A company';

  /** the hour as the device has it (sim/ring.js windowAt) */
  function clock() {
    const n = new Date(), c = { y: n.getFullYear(), mo: n.getMonth() + 1, d: n.getDate(), h: n.getHours(), m: n.getMinutes(), s: n.getSeconds() };
    const w = windowAt(held ? { ...c, m: 0, s: 0 } : c), nx = new Date(n.getTime() + w.until * 1000);
    return { ...w, at: `${String(nx.getHours()).padStart(2, '0')}:00` };   // (the next hour's, the Date's own: past midnight too)
  }
  let toastT = 0;
  const say = (text, ms = 2800) => { toast.textContent = text; toast.classList.add('on'); clearTimeout(toastT); toastT = setTimeout(() => toast.classList.remove('on'), ms); };

  enter.addEventListener('click', () => { const w = clock(); if (w.open) sim.commands.push({ type: 'ringEnter', window: w.id, left: Math.floor(w.left) }); });
  card.querySelector && card.addEventListener('click', (e) => { if (/** @type {HTMLElement} */ (e.target).closest('button')) { sim.commands.push({ type: 'ringLeave' }); card.classList.remove('on'); } });

  // what the Ring says as it goes (sim battle.js 'ring')
  let names = /** @type {string[]} */ ([]);
  sim.bus.on('ringStarted', () => { names = []; card.classList.remove('on'); });   // (its banner says it stands: renderer.js bossLine)
  sim.bus.on('ring', (e) => {
    if (e.t === 'arrive') { names.push(who(e.company)); say(`${who(e.company)}'s company comes in · it stirs harder (${e.n} of ${RING.maxParties})`); }
    else if (e.t === 'cracked') say('The Kingstone cracks · its blows come faster', 3000);
    else if (e.t === 'stones') say('Stones fall · find the clear', 2000);
  });
  sim.bus.on('ringLeft', () => { card.classList.remove('on'); });

  sim.bus.on('ringResult', (r) => {
    const won = r.how === 'won', left = r.how === 'left';
    const co = new Map(); for (const q of r.parts) co.set(q.company, (co.get(q.company) || 0) + q.score);
    const total = [...co.values()].reduce((a, b) => a + b, 0) || 1, ranked = [...co.entries()].sort((a, b) => b[1] - a[1]);
    const me = r.parts.find((q) => q.id === r.you) || null;
    card.textContent = '';
    const add = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; card.appendChild(e); return e; };
    add('div', 'kind', 'The Kingstone');
    add('h2', '', won ? 'It falls back into the ring' : left ? 'You left the Ring' : 'The window shuts');
    add('p', '', won ? `It went down in ${mmss(r.secs)}, ${r.parties} companies round it. It stands again at the next hour.`
      : left ? 'Walked out before the end: nothing paid for this hour.' : `It was still standing when the hour's quarter ran out. A minute there pays Bronze.`);
    add('div', `tier ${r.tier || 'none'}`, r.tier ? `${TIER[r.tier]} tier` : 'No tier');
    const nums = add('div', 'nums', null);
    const kv = (k, v) => { const d = document.createElement('div'); d.append(`${k} `); const b = document.createElement('b'); b.textContent = v; d.append(b); nums.appendChild(d); };
    if (r.pay) {
      kv('XP', `+${r.pay.xp} each`); kv('Gold', `+${r.pay.gold}`); kv('Cinders', `+${r.pay.cinders}`);
      if (r.pay.item) kv('Found', `${r.pay.item.name} (${RW[r.pay.item.r] || r.pay.item.r})`);
    }
    if (me) kv('Your hero', `${Math.round(me.dmg)} dealt · ${Math.round(me.heal)} healed · down ${me.downs}×`);
    const ol = add('ol', '', null);
    ranked.forEach(([c, s]) => { const li = document.createElement('li'); li.textContent = `${c === 0 ? 'Your company' : names[c - 1] || `Company ${c + 1}`} · ${Math.round((s / total) * 100)} %`; if (c === 0) li.className = 'you'; ol.appendChild(li); });
    add('button', '', 'Leave');
    card.classList.add('on');
  });

  let lastLine = '', lastSub = '', announced = '';
  (function watch() {
    const S = sim.state, H = S.party[0], b = sim.battle, R = b && b.ring, w = sim.world;
    const inRing = !!(w && w.site === RING.site);
    // the fight's bar
    if (R && !R.over) {
      const k = (w.enemies || []).find((/** @type {any} */ e) => e.id === R.boss), share = k ? Math.max(0, k.hp / k.maxHp) : 0;
      barHp.style.width = `${(share * 100).toFixed(1)}%`;
      const top = `${Math.ceil(share * 100)} %${R.cracked ? ' · cracked' : ''} · ${mmss(R.secs - R.t)}`;
      if (barTop.textContent !== top) barTop.textContent = top;
      const p = S.party[0], up = p.down ? Math.max(0, RING.respawn - (p.downT || 0)) : 0;
      const sub = `${R.parties} of ${RING.maxParties} companies${p.down ? ` · <b>down: up at the edge in ${Math.ceil(up)} s</b>` : ''}`;
      if (sub !== lastSub) { barSub.innerHTML = sub; lastSub = sub; }
      bar.classList.add('on');
    } else bar.classList.remove('on');
    // the hour's line and the way in
    const c = clock(), band = H && H.level >= RING.minLevel && S.created;
    let txt = '';
    if (band && !inRing) {
      if (c.open) txt = paidFor(S, c.id) ? `The Kingstone stands · <b>stood against this hour</b>` : `The Kingstone stands · <b>${mmss(c.left)}</b> left`;
      else if (c.soon) txt = `The Kingstone stands at ${c.at} · <b>${mmss(c.until)}</b>`;
      if (c.soon && announced !== c.id) { announced = c.id; say(`The old stones are stirring · the Kingstone stands at ${c.at}`, 3600); }
    }
    if (txt !== lastLine) { line.innerHTML = txt; lastLine = txt; }
    line.classList.toggle('on', !!txt && !(R && !R.over));
    const C = CAMP_BY.fens_stones, P = S.player;
    const at = w && w.kind === 'overland' && w.region === RING.region && Math.hypot(P.x - C.x, P.y - C.y) <= RING.near;
    const can = at && c.open && !paidFor(S, c.id) && !b && !S.away;
    if (can) {
      const h = `Enter the Ring<small>${H.level < RING.minLevel ? `from level ${RING.minLevel}` : `${mmss(c.left)} left · at level ${RING.level}`}</small>`;
      if (enter.innerHTML !== h) enter.innerHTML = h;
    }
    enter.classList.toggle('on', !!can);
    requestAnimationFrame(watch);
  })();
  return { clock, get cardOpen() { return card.classList.contains('on'); } };
}
