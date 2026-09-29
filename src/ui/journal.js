// @ts-check
// journal.js — the Journal (quest-lore-system §8): a bottom sheet with the quests you're on
// (Active) and the ones you've finished (Completed), a tracked-quest line under the top HUD, and
// the quest toasts. The words (titles, step text, objective labels) come from content/quests/;
// the state from the sim (state.quests, state.tracked), which it only reads. Track and Abandon
// are commands the sim checks. Opened from the book button under the compass, or by tapping the
// tracker line. Text renders as text.

import { html, render } from 'htm/preact';
import { useState } from 'preact/hooks';
import { QUESTS, QS } from '../sim/quests.js';
import { swallow } from './actorart.js';

const CSS = `
#journalBtn { position: fixed; right: 12px; top: 222px; z-index: 5; width: 44px; height: 44px; border-radius: 22px; padding: 0;
  background: rgba(16,12,22,0.92); border: 1px solid rgba(214,170,98,0.45); display: grid; place-items: center; box-shadow: 0 2px 10px rgba(0,0,0,.5); }
#journalBtn svg { width: 22px; height: 22px; fill: none; stroke: #e0a85a; stroke-width: 1.6; stroke-linejoin: round; stroke-linecap: round; }
#journalBtn .dot { position: absolute; top: 3px; right: 3px; width: 10px; height: 10px; border-radius: 5px; background: #8fe07a; box-shadow: 0 0 8px rgba(143,224,122,.7); display: none; }
#journalBtn.due .dot { display: block; }
#questTrack { position: fixed; left: 14px; top: calc(env(safe-area-inset-top, 0px) + 42px); z-index: 4; max-width: calc(100vw - 90px); display: none;
  padding: 5px 10px; border-radius: 12px; background: rgba(16,12,22,0.94); border: 1px solid rgba(214,170,98,0.35);
  font: 11.5px ui-monospace, Menlo, monospace; color: #e8dcc4; }
#questTrack.on { display: block; }
#questTrack b, #questTrack span { display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
#questTrack b { color: #f0c880; font: 600 13px Georgia, serif; }
#questTrack span { margin-top: 1px; color: #cbbfae; }
#questTrack.ready b { color: #8fe07a; }
#journalWrap { position: fixed; inset: 0; z-index: 12; background: rgba(6,4,10,.62); display: none; }
#journalWrap.on { display: block; }
#journal { position: absolute; left: 0; right: 0; bottom: 0; max-width: 480px; max-height: 78vh; overflow-y: auto; margin: 0 auto; background: #100c16;
  border-top: 1px solid rgba(214,170,98,0.45); border-radius: 16px 16px 0 0; padding: 14px 14px calc(env(safe-area-inset-bottom, 0px) + 16px); color: #efe4cf; font-family: ui-monospace, Menlo, monospace; }
#journal h2 { font: 600 19px Georgia, serif; color: #f0c880; margin: 2px 0 10px; }
#journal .x { position: absolute; right: 12px; top: 10px; width: 44px; height: 44px; border-radius: 22px; border: 1px solid rgba(214,170,98,0.45); color: #d8a040; background: none; font-size: 15px; }
#journal .tabs { display: flex; gap: 8px; margin-bottom: 12px; }
#journal .tabs button { flex: 1; min-height: 44px; border-radius: 10px; border: 1px solid #2c2838; background: none; color: #978c80; font: 11px ui-monospace, Menlo, monospace; letter-spacing: 1.5px; text-transform: uppercase; }
#journal .tabs button.on { background: linear-gradient(#e0a84a, #b67c2a); color: #1a1208; font-weight: 700; border-color: #f0c880; }
#journal .q { border: 1px solid #2c2838; border-radius: 12px; padding: 12px; margin-bottom: 10px; background: rgba(255,255,255,.02); }
#journal .q.tracked { border-color: #d8a040; background: rgba(216,160,64,.07); }
#journal .kind { display: inline-block; font-size: 9.5px; letter-spacing: 1.5px; text-transform: uppercase; color: #1a1208; background: #b8a080; border-radius: 3px; padding: 1px 6px; }
#journal .q h3 { font: 600 16px Georgia, serif; color: #efe4cf; margin: 6px 0 2px; }
#journal .giver { font-size: 10.5px; color: #978c80; margin-bottom: 8px; }
#journal .step { font: 14px/1.45 Georgia, serif; color: #d8ccb8; margin: 6px 0 8px; }
#journal .step.ready { color: #8fe07a; }
#journal .obj { display: flex; align-items: center; gap: 8px; font-size: 11px; color: #cbbfae; margin: 5px 0; }
#journal .obj .bar { flex: 1; height: 4px; background: #26222e; border-radius: 2px; position: relative; overflow: hidden; }
#journal .obj .bar i { position: absolute; left: 0; top: 0; bottom: 0; background: #d8a040; }
#journal .obj.done { color: #8fe07a; } #journal .obj.done .bar i { background: #8fe07a; }
#journal .obj .n { flex: none; min-width: 38px; text-align: right; }
#journal .rew { font-size: 10.5px; color: #c09a50; margin-top: 8px; letter-spacing: .5px; }
#journal .acts { display: flex; gap: 8px; margin-top: 10px; }
#journal .acts button { min-height: 44px; flex: 1; border-radius: 8px; font: 11px ui-monospace, Menlo, monospace; letter-spacing: 1px; text-transform: uppercase; border: 1px solid rgba(214,170,98,0.45); color: #f0c880; background: none; }
#journal .acts button.on { background: rgba(216,160,64,.18); }
#journal .acts button.del { color: #ff8a7a; border-color: rgba(255,122,102,0.4); flex: 0 0 auto; padding: 0 14px; }
#journal .acts button.del.arm { background: #5a1c16; color: #ffd0c8; }
#journal .empty { font: 14px/1.5 Georgia, serif; color: #978c80; padding: 10px 2px 16px; }
#journal .summary { font: 13px/1.45 Georgia, serif; color: #b8ac98; margin-top: 4px; }
`;
const BOOK = '<svg viewBox="0 0 24 24"><path d="M4 5.5C6.5 4.5 9.5 4.5 12 6c2.5-1.5 5.5-1.5 8-.5V19c-2.5-1-5.5-1-8 .5-2.5-1.5-5.5-1.5-8-.5z"/><path d="M12 6v13.5"/></svg><i class="dot"></i>';
const KIND = { chapter: 'Chapter', companion: 'Companion', trial: 'Trial', board: 'Board', errand: 'Errand', bounty: 'Bounty' };

/** the lines a quest shows now: its step text (or its "go back" text) and its objectives with counts
 * @param {any} def content/quests/<id>.json @param {{ st: number, step: number, n: number[] }} q */
export function questNow(def, q) {
  if (q.st === QS.READY) return { text: def.ready, objectives: [], ready: true };
  const step = def.steps[q.step] || def.steps[0];
  return { text: step.journal, ready: false, objectives: step.objectives.map((o, i) => ({ label: o.label, n: q.n[i] || 0, of: o.count })) };
}

function Card({ id, def, q, tracked, onTrack, onAbandon, npcName }) {
  const [arm, setArm] = useState(false);
  const now = questNow(def, q);
  return html`<div class=${'q' + (tracked ? ' tracked' : '')}>
    <span class="kind">${KIND[def.kind] || def.kind}</span>
    <h3>${def.title}</h3>
    <div class="giver">${npcName(def.giver)} · level ${def.level[0]}–${def.level[1]}</div>
    <div class=${'step' + (now.ready ? ' ready' : '')}>${now.text}</div>
    ${now.objectives.map((o) => html`<div key=${o.label} class=${'obj' + (o.n >= o.of ? ' done' : '')}><span>${o.label}</span><span class="bar"><i style=${`width:${Math.round((100 * o.n) / o.of)}%`}></i></span><span class="n">${o.n}/${o.of}</span></div>`)}
    <div class="rew">Reward · ${def.rewards.xp} XP · ${def.rewards.gold} gold</div>
    <div class="acts">
      <button class=${tracked ? 'on' : ''} onClick=${() => onTrack(tracked ? null : id)}>${tracked ? 'Tracked' : 'Track'}</button>
      ${def.kind !== 'chapter' ? html`<button class=${'del' + (arm ? ' arm' : '')} onClick=${() => (arm ? onAbandon(id) : setArm(true))}>${arm ? 'Sure?' : 'Abandon'}</button>` : ''}
    </div>
  </div>`;
}

function Journal({ sim, defs, npcName, onClose }) {
  const [tab, setTab] = useState('active');
  const push = (cmd) => sim.commands.push(cmd);
  const all = Object.entries(sim.state.quests || {}).filter(([id]) => defs[id]);
  const active = all.filter(([, q]) => q.st === QS.ACTIVE || q.st === QS.READY), done = all.filter(([, q]) => q.st === QS.DONE);
  return html`<div id="journal">
    <button class="x" aria-label="Close" onClick=${onClose}>✕</button>
    <h2>Journal</h2>
    <div class="tabs">
      <button class=${tab === 'active' ? 'on' : ''} onClick=${() => setTab('active')}>Active · ${active.length}</button>
      <button class=${tab === 'done' ? 'on' : ''} onClick=${() => setTab('done')}>Completed · ${done.length}</button>
    </div>
    ${tab === 'active'
      ? (active.length ? active.map(([id, q]) => html`<${Card} key=${id} id=${id} def=${defs[id]} q=${q} tracked=${sim.state.tracked === id} npcName=${npcName}
          onTrack=${(t) => push({ type: 'track', id: t })} onAbandon=${(t) => push({ type: 'questAbandon', id: t })} />`)
        : html`<div class="empty">No quests yet. People in town ask for help when they know you. Maudry Fenn at the Tired Mule usually has something.</div>`)
      : (done.length ? done.map(([id]) => html`<div key=${id} class="q"><span class="kind">${KIND[defs[id].kind]}</span><h3>${defs[id].title}</h3>
          <div class="summary">${defs[id].done}</div><div class="rew">Earned · ${defs[id].rewards.xp} XP · ${defs[id].rewards.gold} gold</div></div>`)
        : html`<div class="empty">Nothing finished yet.</div>`)}
  </div>`;
}

/** @param {{ sim: any, npcName: (id: string) => string, toast: (msg: string, ms?: number) => void }} o */
export function createJournal({ sim, npcName, toast }) {
  const style = document.createElement('style'); style.textContent = CSS; document.head.appendChild(style);
  const btn = document.createElement('button'); btn.id = 'journalBtn'; btn.setAttribute('aria-label', 'Journal'); btn.innerHTML = BOOK;
  const track = document.createElement('div'); track.id = 'questTrack'; track.setAttribute('role', 'button');
  const wrap = document.createElement('div'); wrap.id = 'journalWrap';
  document.body.append(btn, track, wrap);
  for (const el of [btn, track, wrap]) swallow(el);
  /** @type {Record<string, any>} */
  const defs = {};
  let open = false;
  const paint = () => { if (open) render(html`<${Journal} sim=${sim} defs=${defs} npcName=${npcName} onClose=${close} />`, wrap); };
  function close() { open = false; wrap.classList.remove('on'); render(null, wrap); }
  function show() { open = true; wrap.classList.add('on'); btn.classList.remove('due'); paint(); }
  btn.addEventListener('click', show); track.addEventListener('click', show);
  wrap.addEventListener('click', (e) => { if (e.target === wrap) close(); });

  // the tracked quest, under the top HUD: its title and where it stands
  function paintTracker() {
    const id = sim.state.tracked, q = id && sim.state.quests[id], def = id && defs[id];
    if (!q || !def || q.st === QS.DONE) { track.classList.remove('on'); return; }
    const now = questNow(def, q);
    track.textContent = '';
    const b = document.createElement('b'), line = document.createElement('span');
    b.textContent = '◆ ' + def.title;
    line.textContent = now.ready ? def.ready : now.objectives.map((o) => `${o.label.split(' ')[0]} ${o.n}/${o.of}`).join(' · ');
    track.append(b, line);
    track.classList.toggle('ready', now.ready); track.classList.add('on');
  }
  // toasts: accepted, progress, done — go back, rewarded
  /** @type {Map<string, { st: number, step: number, n: number[] }>} */
  const seen = new Map();                       // id → the state and counts last seen (so a repaint never repeats a toast)
  sim.bus.on('questChanged', (e) => {
    const def = e.id && defs[e.id], was = e.id && seen.get(e.id), n = e.progress || [];
    if (def && e.state === QS.ACTIVE && !was) { toast(`Quest accepted · ${def.title}`, 2200); btn.classList.add('due'); }
    else if (def && e.state === QS.ACTIVE && was && was.step === e.step) {
      const i = n.findIndex((v, k) => v > (was.n[k] || 0)), o = i >= 0 && def.steps[e.step].objectives[i];
      if (o) toast(`${o.label} ${n[i]}/${o.count}`, 1600);
    } else if (def && e.state === QS.READY && (!was || was.st !== QS.READY)) toast(`Quest complete · ${def.ready}`, 2600);
    if (e.id) seen.set(e.id, { st: e.state, step: e.step, n: n.slice() });
    paintTracker(); paint();
  });
  sim.bus.on('questReward', (r) => { if (defs[r.id]) toast(`${defs[r.id].title} · +${r.xp} XP · +${r.gold} gold`, 2600); });
  sim.bus.on('questTracked', () => { paintTracker(); paint(); });

  // the words: one file per quest the sim knows
  const ready = Promise.all(Object.keys(QUESTS).map((id) => fetch(`./content/quests/${id}.json`).then((r) => r.json()).then((d) => { defs[id] = d; }).catch(() => {})))
    .then(() => { for (const [id, q] of Object.entries(sim.state.quests || {})) seen.set(id, { st: q.st, step: q.step, n: q.n.slice() }); paintTracker(); });
  return { open: show, close, ready, title: (/** @type {string} */ id) => (defs[id] ? defs[id].title : ''), get isOpen() { return open; } };
}
