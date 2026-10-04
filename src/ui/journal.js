// @ts-check
// journal.js — the Journal (quest-lore-system §8): a bottom sheet with the quests you're on
// (Active) and the ones you've finished (Completed), a tracked-quest line above the party cards, and
// the quest toasts. The words (titles, step text, objective labels) come from content/quests/;
// the state from the sim (state.quests, state.tracked), which it only reads. Board jobs (the
// Lantern Guild's, sim/board.js) are built by the sim from their ids; their words come from
// content/board/ through boardwords.js. Track and Abandon
// are commands the sim checks. Opened from the book button under the compass, or by tapping the
// tracker line. Text renders as text.

import { html, render } from 'htm/preact';
import { useState } from 'preact/hooks';
import { QUESTS, QS } from '../sim/quests.js';
import { SITE_IDS } from '../sim/sites.js';
import { swallow } from './actorart.js';
import { boardWords, boardReady, SKULLS } from './boardwords.js';
import { FRAGMENTS, SETS } from '../sim/lore.js';
import { CLASSES } from '../sim/party.js';
import { storyStatus, openLeads } from './storystatus.js';

const CSS = `
#journalBtn { position: fixed; right: calc(12px + var(--safe-r, env(safe-area-inset-right, 0px))); top: calc(var(--hud-b, 50px) + 172px); z-index: 5; width: 44px; height: 44px; border-radius: 22px; padding: 0;
  background: rgba(16,12,22,0.92); border: 1px solid rgba(214,170,98,0.45); display: grid; place-items: center; box-shadow: 0 2px 10px rgba(0,0,0,.5); }
#journalBtn svg { width: 22px; height: 22px; fill: none; stroke: #e0a85a; stroke-width: 1.6; stroke-linejoin: round; stroke-linecap: round; }
#journalBtn .dot { position: absolute; top: 3px; right: 3px; width: 10px; height: 10px; border-radius: 5px; background: #8fe07a; box-shadow: 0 0 8px rgba(143,224,122,.7); display: none; }
#journalBtn.due .dot { display: block; }
/* just above the party cards (and the town's service bar), clear of the minimap; placed by place() */
#questTrack { position: fixed; left: calc(var(--party-side, 0px) + 12px); bottom: 140px; z-index: 5; max-width: calc(100vw - var(--party-side, 0px) - 150px);   /* (the Step-out button shares the row in a fight) */ display: none;
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
#journal .top { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 10px; }
#journal h2 { font: 600 19px Georgia, serif; color: #f0c880; margin: 0; }
#journal .x { flex: none; width: 44px; height: 44px; border-radius: 22px; border: 1px solid rgba(214,170,98,0.45); color: #d8a040; background: none; font-size: 15px; }
#journal .tabs { display: flex; gap: 8px; margin-bottom: 12px; }
#journal .tabs button { flex: 1; min-width: 0; min-height: 44px; padding: 0 4px; border-radius: 10px; border: 1px solid #2c2838; background: none; color: #978c80; font: 11px ui-monospace, Menlo, monospace; letter-spacing: .8px; text-transform: uppercase; white-space: nowrap; }
#journal .tabs button.on { background: linear-gradient(#e0a84a, #b67c2a); color: #1a1208; font-weight: 700; border-color: #f0c880; }
#journal .q { border: 1px solid #2c2838; border-radius: 12px; padding: 12px; margin-bottom: 10px; background: rgba(255,255,255,.02); }
#journal .q.tracked { border-color: #d8a040; background: rgba(216,160,64,.07); }
#journal .kind { display: inline-block; font-size: 9.5px; letter-spacing: 1.5px; text-transform: uppercase; color: #d8ccb8; background: #3a3446; border-radius: 3px; padding: 1px 6px; }
#journal .kind.main { color: #1a1208; background: linear-gradient(#f0c060, #c8902e); font-weight: 700; }
#journal .q.main { border-left: 3px solid #e0a84a; }
#journal .grp { font: 11px ui-monospace, Menlo, monospace; letter-spacing: 1.5px; text-transform: uppercase; color: #978c80; margin: 4px 0 8px; }
#journal .grp.main { color: #f0c880; }
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
#journal .set { font: 11px ui-monospace, Menlo, monospace; letter-spacing: 1.5px; color: #a08a6a; text-transform: uppercase; margin: 2px 0 10px; }
#journal .count { border: 1px solid #3a3024; border-radius: 8px; padding: 10px 12px; margin: 2px 0 16px; background: rgba(40,30,22,0.35); }
#journal .count .nums { display: flex; gap: 18px; font-size: 14px; color: #d8cfc0; margin: -2px 0 6px; }
#journal .count .nums b { color: #e8c88a; font-size: 18px; font-weight: 600; margin-right: 3px; }
#journal .count .nt { font-size: 12px; color: #9a9080; line-height: 1.4; }
#journal .frag { border-left: 3px solid #c09a50; padding: 8px 10px 9px 12px; margin-bottom: 10px; background: rgba(240,224,190,.04); border-radius: 0 10px 10px 0; }
#journal .frag h3 { font: 600 15px Georgia, serif; color: #f0c880; margin: 0 0 4px; }
#journal .frag q { display: block; font: italic 14px/1.45 Georgia, serif; color: #e2d6c0; quotes: none; }
#journal .frag .nt { font: 12.5px/1.4 Georgia, serif; color: #978c80; margin-top: 6px; }
#journal .frag.missing { border-left-color: #3a3444; background: none; }
#journal .frag.missing h3 { color: #7c748a; }
#journal .summary { font: 13px/1.45 Georgia, serif; color: #b8ac98; margin-top: 4px; }
#journal .summary.why { margin: 0 0 8px; font-style: italic; }
#journal .q.story h3 { margin-top: 4px; }
#journal .leads { margin: 0 0 14px; padding: 0; list-style: none; }
#journal .leads li { font: 13.5px/1.45 Georgia, serif; color: #cfc2ac; padding: 7px 0 7px 18px; border-bottom: 1px solid rgba(214,170,98,0.12); position: relative; }
#journal .leads li::before { content: '◆'; position: absolute; left: 2px; top: 7px; font-size: 10px; color: #a08a6a; }
#journal .step .now { font: 700 10.5px ui-monospace, Menlo, monospace; letter-spacing: 1px; text-transform: uppercase; color: #d8a040; }
`;
const BOOK = '<svg viewBox="0 0 24 24"><path d="M4 5.5C6.5 4.5 9.5 4.5 12 6c2.5-1.5 5.5-1.5 8-.5V19c-2.5-1-5.5-1-8 .5-2.5-1.5-5.5-1.5-8-.5z"/><path d="M12 6v13.5"/></svg><i class="dot"></i>';
const KIND = { chapter: 'Chapter', companion: 'Companion', trial: 'Trial', board: 'Board', errand: 'Errand', bounty: 'Bounty' };
// main story or side quest (the owner, 2026-10-03: the two must read apart at a glance): chapter quests are the main
// story; everything else (errands, bounties, trials, companions' chains, board jobs) is a side quest
export const isMain = (def) => !!def && def.kind === 'chapter';
const kindTag = (def) => (isMain(def) ? html`<span class="kind main">★ Main story · ${KIND.chapter}</span>` : html`<span class="kind">Side quest · ${KIND[def.kind] || def.kind}</span>`);

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
  return html`<div class=${'q' + (tracked ? ' tracked' : '') + (isMain(def) ? ' main' : '')}>
    ${kindTag(def)}
    <h3>${def.title}</h3>
    <div class="giver">${def.giverName || npcName(def.giver)} · level ${def.level[0]}${def.level[1] !== def.level[0] ? '–' + def.level[1] : ''}${def.skulls ? ' · ' + '☠'.repeat(def.skulls) + ' ' + SKULLS[def.skulls] : ''}${def.company ? ' · bring company' : ''}</div>
    <div class="summary why">${def.summary}</div>
    <div class=${'step' + (now.ready ? ' ready' : '')}>${now.ready ? '' : html`<b class="now">Now: </b>`}${now.text}</div>
    ${now.objectives.map((o) => html`<div key=${o.label} class=${'obj' + (o.n >= o.of ? ' done' : '')}><span>${o.label}</span><span class="bar"><i style=${`width:${Math.round((100 * o.n) / o.of)}%`}></i></span><span class="n">${o.n}/${o.of}</span></div>`)}
    <div class="rew">Reward · ${def.rewards.xp} XP · ${def.rewards.gold} gold</div>
    <div class="acts">
      <button class=${tracked ? 'on' : ''} onClick=${() => onTrack(tracked ? null : id)}>${tracked ? 'Tracked' : 'Track'}</button>
      ${def.kind !== 'chapter' ? html`<button class=${'del' + (arm ? ' arm' : '')} onClick=${() => (arm ? onAbandon(id) : setArm(true))}>${arm ? 'Sure?' : 'Abandon'}</button>` : ''}
    </div>
  </div>`;
}

// the words in content/story.json with the sim's own values in their {slots}
const fill = (t, v) => String(t || '').replace(/\{(\w+)\}/g, (_, k) => (v[k] ?? ''));
/** where the main story stands when no chapter is in hand, and what's still open (storystatus.js; content/story.json) */
function StoryStatus({ sim, story, defOf, npcName }) {
  if (!story) return null;
  const st = storyStatus(sim.state, (id) => sim.quests.status(id)); if (!st) return null;
  const end = st.kind === 'end' ? story.end[(sim.world && sim.world.region) || 'vale'] || story.end.vale : null, d = st.id ? defOf(st.id) : null;
  const leads = st.kind === 'next' ? [] : openLeads(sim.state, (id) => sim.quests.status(id));
  const vars = (l) => ({ ...l, cls: l.cls ? `${CLASSES[l.cls].label.toLowerCase()}s` : '', giver: l.giver ? npcName(l.giver) : '' });
  return html`<div class="grp main">Main story</div>
    <div class="q main story"><span class="kind main">★ Main story${end ? '' : ' · next chapter'}</span>
      <h3>${end ? end.title : d ? d.title : ''}</h3>
      <div class="summary">${end ? end.text : fill(story[st.kind], { title: d ? d.title : '', giver: st.giver ? npcName(st.giver) : '', level: st.level })}</div></div>
    ${leads.length ? html`<div class="grp side">${story.leadsTitle} · ${leads.length}</div><ul class="leads">${leads.map((l) => html`<li key=${l.id + (l.cls || '')}>${fill(story.leads[l.id], vars(l))}</li>`)}</ul>` : ''}`;
}

const SET_NAME = { vale: 'The Hollow Vale', fens: 'The Greywater Fens' };
/** the Chronicle (world doc §7): each set in reading order; found fragments in full, missing ones as a place */
function Chronicle({ sim, lore }) {
  const found = new Set(sim.state.fragments || []), c = sim.state.count || { lamps: 0, souls: 0 };
  // the count (world doc §7, sim lamps.js): the company's two numbers, at the Chronicle's head
  return html`<div class="count"><div class="set">The count · kept by Sister Ilse</div>
    <div class="nums"><span><b>${c.lamps}</b> ${c.lamps === 1 ? 'lamp' : 'lamps'} broken</span><span><b>${c.souls}</b> ${c.souls === 1 ? 'soul' : 'souls'} freed</span></div>
    <div class="nt">A soul for each of the bound put down and each cage broken, and every soul a broken lamp held. The living never count: they were never bound.</div></div>
  ${Object.entries(SETS).map(([set, ids]) => html`<div key=${set}>
    <div class="set">${SET_NAME[set] || set} · ${ids.filter((id) => found.has(id)).length} of ${ids.length} found · kept by Sister Ilse</div>
    ${ids.map((id) => { const w = lore[id]; if (!w) return null;
      return found.has(id)
        ? html`<div key=${id} class="frag"><h3>${w.title}</h3><q>${w.text}</q><div class="nt">${w.note}</div></div>`
        : html`<div key=${id} class="frag missing"><h3>Missing</h3><div class="nt">${w.where}</div></div>`; })}
  </div>`)}`;
}

function Journal({ sim, defOf, npcName, onClose, lore, story }) {
  const [tab, setTab] = useState('active');
  const push = (cmd) => sim.commands.push(cmd);
  const all = Object.entries(sim.state.quests || {}).filter(([id]) => defOf(id));
  const active = all.filter(([, q]) => q.st === QS.ACTIVE || q.st === QS.READY), done = all.filter(([, q]) => q.st === QS.DONE);
  /** @type {[string, string, [string, any][]][]} the active ones: the main story first, then the side quests */
  const groups = [['main', 'Main story', active.filter(([id]) => isMain(defOf(id)))], ['side', 'Side quests', active.filter(([id]) => !isMain(defOf(id)))]];
  for (let i = groups.length - 1; i >= 0; i--) if (!groups[i][2].length) groups.splice(i, 1);
  return html`<div id="journal">
    <div class="top"><h2>Journal</h2><button class="x" aria-label="Close" onClick=${onClose}>✕</button></div>
    <div class="tabs">
      <button class=${tab === 'active' ? 'on' : ''} onClick=${() => setTab('active')}>Active · ${active.length}</button>
      <button class=${tab === 'done' ? 'on' : ''} onClick=${() => setTab('done')}>Done · ${done.length}</button>
      <button class=${tab === 'chron' ? 'on' : ''} onClick=${() => setTab('chron')}>Chronicle · ${(sim.state.fragments || []).length}</button>
    </div>
    ${tab === 'chron' ? html`<${Chronicle} sim=${sim} lore=${lore} />` : tab === 'active'
      ? (active.length || story ? html`${groups.some(([k]) => k === 'main') ? '' : html`<${StoryStatus} sim=${sim} story=${story} defOf=${defOf} npcName=${npcName} />`}${groups.map(([k, label, list]) => html`<div key=${k}><div class=${'grp ' + k}>${label} · ${list.length}</div>${list.map(([id, q]) => html`<${Card} key=${id} id=${id} def=${defOf(id)} q=${q} tracked=${sim.state.tracked === id} npcName=${npcName}
          onTrack=${(t) => push({ type: 'track', id: t })} onAbandon=${(t) => push({ type: 'questAbandon', id: t })} />`)}</div>`)}`
        : html`<div class="empty">No quests yet. People in town ask for help when they know you. Maudry Fenn at the Tired Mule usually has something, and the Lantern Guild's board by her door always does.</div>`)
      : (done.length ? done.slice().reverse().map(([id]) => { const d = defOf(id); return html`<div key=${id} class=${'q' + (isMain(d) ? ' main' : '')}>${kindTag(d)}<h3>${d.title}</h3>
          <div class="giver">${d.giverName || npcName(d.giver)}</div><div class="summary">${d.done}</div><div class="rew">Earned · ${d.rewards.xp} XP · ${d.rewards.gold} gold</div></div>`; })
        : html`<div class="empty">Nothing finished yet.</div>`)}
  </div>`;
}

/** @param {{ sim: any, npcName: (id: string) => string, toast: (msg: string, ms?: number, key?: string) => void, partyPanel?: { height: () => number } }} o */
export function createJournal({ sim, npcName, toast, partyPanel }) {
  const style = document.createElement('style'); style.textContent = CSS; document.head.appendChild(style);
  const btn = document.createElement('button'); btn.id = 'journalBtn'; btn.setAttribute('aria-label', 'Journal'); btn.innerHTML = BOOK;
  const track = document.createElement('div'); track.id = 'questTrack'; track.setAttribute('role', 'button');
  const wrap = document.createElement('div'); wrap.id = 'journalWrap';
  document.body.append(btn, track, wrap);
  for (const el of [btn, track, wrap]) swallow(el);
  /** @type {Record<string, any>} */
  const defs = {};
  let story = null;                             // content/story.json: where the main story stands (storystatus.js)
  fetch('./content/story.json').then((r) => r.json()).then((d) => { story = d; }).catch(() => {});
  /** @type {Map<string, any>} */
  const jobs = new Map();                       // board jobs' words, once per id
  /** a quest's words: written (content/quests) or a board job's (content/board) @param {string} id */
  const defOf = (id) => {
    if (defs[id]) return defs[id];
    if (jobs.has(id)) return jobs.get(id);
    const j = sim.quests.def(id), d = j && j.kind === 'board' ? boardWords(j) : null;
    if (d) jobs.set(id, d);
    return d;
  };
  let open = false;
  /** @type {Record<string, any>} */
  const lore = {};                              // content/lore/<id>.json: the fragments' words
  const paint = () => { if (open) render(html`<${Journal} sim=${sim} defOf=${defOf} npcName=${npcName} onClose=${close} lore=${lore} story=${story} />`, wrap); };
  function close() { open = false; wrap.classList.remove('on'); render(null, wrap); }
  function show() { open = true; wrap.classList.add('on'); btn.classList.remove('due'); paint(); }
  btn.addEventListener('click', show); track.addEventListener('click', show);
  wrap.addEventListener('click', (e) => { if (e.target === wrap) close(); });

  // the tracked quest, just above the party cards: its title and where it stands. It sat under the
  // top HUD and covered the minimap; down here it's in thumb reach too (the compass's walk chip
  // stacks above it, compass.js).
  (function place() {
    if (track.classList.contains('on')) {
      const bar = document.getElementById('hubBar'), barH = bar && bar.classList.contains('on') ? bar.getBoundingClientRect().height + 8 : 0;
      const b = `${Math.round((partyPanel ? partyPanel.height() : 0) + barH + 8)}px`;
      if (track.style.bottom !== b) track.style.bottom = b;
    }
    requestAnimationFrame(place);
  })();
  function paintTracker() {
    const id = sim.state.tracked, q = id && sim.state.quests[id], def = id && defOf(id);
    if (!q || !def || q.st === QS.DONE) { track.classList.remove('on'); return; }
    const now = questNow(def, q);
    track.textContent = '';
    const b = document.createElement('b'), line = document.createElement('span');
    b.textContent = (isMain(def) ? '★ ' : '◆ ') + def.title;          // ★ the main story, ◆ a side quest
    line.textContent = now.ready ? def.ready : now.objectives.map((o) => `${o.label.split(' ')[0]} ${o.n}/${o.of}`).join(' · ');
    track.append(b, line);
    track.classList.toggle('ready', now.ready); track.classList.add('on');
  }
  // toasts: accepted, progress, done — go back, rewarded
  /** @type {Map<string, { st: number, step: number, n: number[] }>} */
  const seen = new Map();                       // id → the state and counts last seen (so a repaint never repeats a toast)
  sim.bus.on('questChanged', (e) => {
    const def = e.id && defOf(e.id), was = e.id && seen.get(e.id), n = e.progress || [];
    if (def && e.state === QS.ACTIVE && !was) { toast(`Quest accepted · ${def.title}`, 2200); btn.classList.add('due'); }
    else if (def && e.state === QS.ACTIVE && was && was.step === e.step) {
      const i = n.findIndex((v, k) => v > (was.n[k] || 0)), o = i >= 0 && def.steps[e.step].objectives[i];
      if (o) toast(`${o.label} ${n[i]}/${o.count}`, 2200, `q:${e.id}:${i}`);   // one line per objective, its count updated in place
    } else if (def && e.state === QS.READY && (!was || was.st !== QS.READY)) toast(`Quest complete · ${def.ready}`, 2600);
    if (e.id) seen.set(e.id, { st: e.state, step: e.step, n: n.slice() });
    paintTracker(); paint();
  });
  sim.bus.on('questReward', (r) => { const d = defOf(r.id); if (d) toast(`${d.title} · +${r.xp} XP · +${r.gold} gold`, 2600); });
  sim.bus.on('questTracked', () => { paintTracker(); paint(); });
  // (a fragment comes out of a chest or a hall's last wave: the HUD's "chest opened" says so first, then this)
  sim.bus.on('fragmentFound', (f) => { const w = lore[f.id]; setTimeout(() => toast(`Fragment found · ${w ? w.title : 'the Chronicle'} (${f.found} of ${f.of}) · +${f.xp} XP`, 3000), 1400); btn.classList.add('due'); paint(); });
  sim.bus.on('setComplete', (e) => toast(`${SET_NAME[e.set] || e.set}: the set is whole. Sister Ilse will want to read it.`, 3200));
  // sites (sim/sites.js): a hidden one found, or its way in still shut (its words: content/sites)
  const sites = {};
  sim.bus.on('siteRevealed', (e) => toast(`${(sites[e.site] || e).name} is open to you. It's on the compass now.`, 3200));
  sim.bus.on('siteShut', (e) => { const w = sites[e.site]; if (w && w.shut) toast(w.shut, 2800); });
  sim.bus.on('landShut', (e) => { if (e.line) toast(e.line, 3200); });   // the road to a land not yet open (regions.js; outdoor.js has its words)

  // the words: one file per quest the sim knows, and the board's templates
  const ready = Promise.all([boardReady, ...SITE_IDS.map((id) => fetch(`./content/sites/${id}.json`).then((r) => r.json()).then((d) => { sites[id] = d; }).catch(() => {})), ...Object.keys(FRAGMENTS).map((id) => fetch(`./content/lore/${id}.json`).then((r) => r.json()).then((d) => { lore[id] = d; }).catch(() => {})), ...Object.keys(QUESTS).map((id) => fetch(`./content/quests/${id}.json`).then((r) => r.json()).then((d) => { defs[id] = d; }).catch(() => {}))])
    .then(() => { for (const [id, q] of Object.entries(sim.state.quests || {})) seen.set(id, { st: q.st, step: q.step, n: q.n.slice() }); paintTracker(); });
  return { open: show, close, ready, def: defOf, title: (/** @type {string} */ id) => (defOf(id) ? defOf(id).title : ''), get isOpen() { return open; } };
}
