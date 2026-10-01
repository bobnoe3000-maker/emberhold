// @ts-check
// defeat.js — the defeat screen. A wipe used to cut straight to the temple in town; now the sim's
// 'defeat' event (battle.js: the party wakes at the Shrine, Weakened, a quarter of the gold gone) opens
// this screen first, over everything: where the party fell, how far it got, who struck the last blow,
// what it costs. "Wake at the temple" closes it, and you're in Thornwick at the temple. A Fallen
// companion is raised by the wipe itself.
// DOM only: it reads the event's recap and never touches sim state. Foe names come from
// content/foes.json; a boss is named by the sim (battle.js BOSSES).

import { swallow } from './actorart.js';

const CSS = `
#defeat { position: fixed; inset: 0; z-index: 30; display: none; flex-direction: column; justify-content: flex-end; align-items: center;
  background: radial-gradient(ellipse at 50% 35%, #3c0e0a, #08060a 70%) #08060a; color: #d8d2c6; opacity: 0; transition: opacity .5s ease;
  padding: 0 16px max(env(safe-area-inset-bottom, 0px), 18px); font-family: ui-monospace, 'SF Mono', Menlo, Consolas, monospace; }
#defeat.on { display: flex; }
#defeat.shown { opacity: 1; }
#defeat .box { width: 100%; max-width: 420px; margin-bottom: 4vh; }
#defeat h2 { font: 600 28px Georgia, serif; color: #f0c0a0; margin: 0 0 6px; letter-spacing: .5px; text-shadow: 0 2px 12px rgba(0,0,0,.8); }
#defeat .where { font-size: 12px; letter-spacing: 1.5px; color: #c9a882; text-transform: uppercase; margin-bottom: 16px; }
#defeat .how { font: 16px/1.45 Georgia, serif; color: #ece6da; margin: 0 0 8px; }
#defeat .held { font-size: 12.5px; color: #b8aca0; margin: 0 0 18px; }
#defeat .cost { border-top: 1px solid rgba(214,170,98,.25); padding-top: 12px; margin-bottom: 18px; }
#defeat .cost div { font-size: 12.5px; line-height: 1.5; color: #d8d2c6; padding-left: 14px; position: relative; margin-bottom: 4px; }
#defeat .cost div::before { content: '·'; position: absolute; left: 3px; color: #e0a060; }
#defeat .cost b { color: #f0c880; font-weight: 600; }
#defeat .tip { font: italic 13px Georgia, serif; color: #a89c8c; margin-bottom: 18px; }
#defeat button { width: 100%; min-height: 52px; border-radius: 10px; border: 1px solid rgba(240,200,128,.7); background: rgba(216,160,64,.16); color: #f8dca0;
  font: 600 17px Georgia, serif; letter-spacing: .5px; }
#defeat button:active { background: rgba(216,160,64,.3); }
`;

/** "1 min 42 s" @param {number} s */
const dur = (s) => (s >= 60 ? `${Math.floor(s / 60)} min ${s % 60} s` : `${s} s`);

/** @param {{ sim: any }} o */
export function createDefeat({ sim }) {
  const style = document.createElement('style'); style.textContent = CSS; document.head.appendChild(style);
  const el = document.createElement('div'); el.id = 'defeat'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true');
  document.body.appendChild(el); swallow(el);
  /** @type {Record<string, { a: string, elite?: string }>} */
  let foes = {};
  fetch('./content/foes.json').then((r) => r.json()).then((d) => { foes = d.foes || {}; }).catch(() => {});

  /** who struck the last blow, as the player would say it */
  const killerName = (k) => { if (!k) return ''; if (k.bossName) return k.bossName; const f = foes[k.kind]; return f ? (k.elite && f.elite ? f.elite : f.a) : ''; };
  const line = (t) => { const d = document.createElement('div'); d.textContent = t; return d; };

  function open(e) {
    const r = e.recap, k = r && r.killer;
    el.textContent = '';
    const box = document.createElement('div'); box.className = 'box';
    const h = document.createElement('h2'); h.textContent = 'The party has fallen';
    const where = document.createElement('div'); where.className = 'where';
    where.textContent = r ? `${r.siteName} · floor ${r.floor} · a level ${r.level} room · wave ${r.wave}` : '';
    const how = document.createElement('p'); how.className = 'how';
    const who = killerName(k), last = (k && k.on) || (r && r.party[0]) || 'The last of you';
    how.textContent = who ? `${last} went down last, to ${who}.` : `${last} went down last.`;
    const held = document.createElement('p'); held.className = 'held';
    held.textContent = r ? `You held the room ${dur(r.secs)}. ${r.foesLeft === 1 ? 'One foe was' : `${r.foesLeft} foes were`} still standing.` : '';
    const cost = document.createElement('div'); cost.className = 'cost';
    cost.append(line('You wake at the temple in Thornwick, the Shrine of the Ember, everyone on their feet.'));
    const weak = document.createElement('div'); weak.append('Weakened for ', Object.assign(document.createElement('b'), { textContent: `${Math.round((e.weakS || 600) / 60)} minutes` }), ': −10 % HP, MP, ATK and DEF. A night at the inn lifts it.');
    cost.append(weak);
    if (e.lost > 0) { const g = document.createElement('div'); g.append(Object.assign(document.createElement('b'), { textContent: `−${e.lost} gold` }), ', a quarter of your purse, gone with you.'); cost.append(g); }
    const tip = document.createElement('div'); tip.className = 'tip'; tip.textContent = '"And step out when you\'re low. A room doesn\'t care how brave you were." — Osric Hale';
    const ok = document.createElement('button'); ok.type = 'button'; ok.textContent = 'Wake at the temple';
    ok.addEventListener('click', close);
    box.append(h, where, how, held, cost, tip, ok);
    el.append(box);
    el.classList.add('on'); void el.offsetWidth; el.classList.add('shown');   // (a style flush, so the fade runs from 0)
    setTimeout(() => ok.focus(), 50);
  }
  function close() { el.classList.remove('shown'); setTimeout(() => el.classList.remove('on'), 500); }
  sim.bus.on('defeat', open);
  return { open, close, get on() { return el.classList.contains('on'); } };
}
