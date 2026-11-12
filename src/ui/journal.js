// @ts-check
// journal.js — the Journal (quest-lore-system §8): a bottom sheet, Main · Side · Chronicle across the top and Active ·
// Done under each (the owner, 2026-11-12; quest-lore-system §8), a tracked-quest line above the party cards, and
// the quest toasts. The words (titles, step text, objective labels) come from content/quests/;
// the state from the sim (state.quests, state.tracked), which it only reads. Board jobs (the
// Lantern Guild's, sim/board.js) are built by the sim from their ids; their words come from
// content/board/ through boardwords.js. Track and Abandon
// are commands the sim checks. Opened from the book button under the compass, or by tapping the
// tracker line. Text renders as text.

import { html, render } from 'htm/preact';
import { useState } from 'preact/hooks';
import { QUESTS, QS, questXp } from '../sim/quests.js';
import { SITE_IDS } from '../sim/sites.js';
import { swallow } from './actorart.js';
import { boardWords, boardReady, SKULLS } from './boardwords.js';
import { FRAGMENTS, SETS } from '../sim/lore.js';
import { CLASSES } from '../sim/party.js';
import { storyStatus, openLeads, CHAPTERS, sideOrder } from './storystatus.js';

const CSS = `
#journalBtn { position: fixed; right: calc(12px + var(--safe-r, env(safe-area-inset-right, 0px))); top: calc(var(--hud-l1, 30px) + 174px); z-index: 5; width: 44px; height: 44px; border-radius: 22px; padding: 0;
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
/* one height whatever it holds (the owner, 2026-11-12: the size and top moving between tabs was jarring) */
#journal { position: absolute; left: 0; right: 0; bottom: 0; max-width: 480px; height: 82vh; height: 82dvh; overflow-y: auto; scrollbar-gutter: stable; margin: 0 auto; background: #100c16;
  border-top: 1px solid rgba(214,170,98,0.45); border-radius: 16px 16px 0 0; padding: 0 12px calc(env(safe-area-inset-bottom, 0px) + 16px); color: #efe4cf; font-family: ui-monospace, Menlo, monospace; }
/* the head stays put while the list scrolls: the title, the kinds, the states, the chips */
#journal .head { position: sticky; top: 0; z-index: 1; background: #100c16; padding-top: 12px; }
#journal .top { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 10px; }
#journal h2 { font: 600 19px Georgia, serif; color: #f0c880; margin: 0; }
#journal .x { flex: none; width: 44px; height: 44px; border-radius: 22px; border: 1px solid rgba(214,170,98,0.45); color: #d8a040; background: none; font-size: 15px; }
/* level 1: what kind of thing (Main · Side · Chronicle) */
#journal .tabs { display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; }
#journal .tabs button { min-width: 0; min-height: 50px; padding: 0 4px; border-radius: 10px; border: 1px solid #2c2838; background: none; color: #978c80; font: 700 11.5px ui-monospace, Menlo, monospace; letter-spacing: 1px; text-transform: uppercase; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2px; }
#journal .tabs button small { font: 600 10.5px ui-monospace, Menlo, monospace; letter-spacing: .3px; text-transform: none; opacity: .9; white-space: nowrap; }
#journal .tabs button.on { background: linear-gradient(#e0a84a, #b67c2a); color: #1a1208; border-color: #f0c880; }
/* level 2: which state (Active · Done), lighter, under it */
#journal .states { display: flex; gap: 20px; border-bottom: 1px solid #2c2838; padding: 0 4px; margin-top: 6px; }
#journal .states button { min-height: 44px; padding: 0; background: none; border: 0; border-bottom: 2px solid transparent; color: #978c80; font: 700 11.5px ui-monospace, Menlo, monospace; letter-spacing: 1px; text-transform: uppercase; }
#journal .states button.on { color: #efe4cf; border-bottom-color: #d8a040; }
#journal .states .lbl { min-height: 44px; display: flex; align-items: center; color: #efe4cf; font: 700 11.5px ui-monospace, Menlo, monospace; letter-spacing: 1px; text-transform: uppercase; border-bottom: 2px solid #d8a040; }
/* level 3 (Side, once there are a few): what sort of side quest */
#journal .kinds { display: flex; gap: 6px; overflow-x: auto; padding: 10px 0 2px; scrollbar-width: none; }
#journal .kinds::-webkit-scrollbar { display: none; }
#journal .kinds button { flex: none; min-height: 34px; padding: 0 12px; border-radius: 17px; border: 1px solid #2c2838; background: none; color: #978c80; font: 600 11.5px ui-monospace, Menlo, monospace; }
#journal .kinds button.on { border-color: #d8a040; color: #f0c880; background: rgba(216,160,64,.12); }
#journal .list { display: flex; flex-direction: column; gap: 8px; padding-top: 12px; }
#journal .grp { font: 11px ui-monospace, Menlo, monospace; letter-spacing: 1.5px; text-transform: uppercase; color: #978c80; margin: 6px 2px 0; }
#journal .grp.act { color: #8fb4ec; }
/* a quest: a compact row; tap it open */
#journal .q { border: 1px solid #2c2838; border-radius: 10px; background: rgba(255,255,255,.025); }
#journal .q.tracked { border-color: #d8a040; box-shadow: inset 3px 0 0 #d8a040; }
#journal .q .row { display: grid; grid-template-columns: minmax(0, 1fr) 44px; gap: 6px; align-items: center; padding: 9px 6px 9px 12px; cursor: pointer; }
#journal .q h3 { font: 600 16px/1.25 Georgia, serif; color: #efe4cf; margin: 0; }
#journal .q.past h3 { color: #b8ac98; }
#journal .giver { font-size: 10.5px; color: #978c80; margin-top: 2px; }
#journal .badge { display: inline-block; font: 700 9.5px ui-monospace, Menlo, monospace; letter-spacing: 1px; text-transform: uppercase; padding: 1px 6px; border-radius: 3px; margin-right: 6px; vertical-align: 2px; }
#journal .badge.ready { background: rgba(143,224,122,.16); color: #8fe07a; }
#journal .badge.tr { background: rgba(216,160,64,.16); color: #f0c880; }
#journal .prog { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 8px; align-items: center; margin-top: 6px; font-size: 11px; color: #cbbfae; font-variant-numeric: tabular-nums; }
#journal .bar { height: 4px; background: #26222e; border-radius: 2px; position: relative; overflow: hidden; }
#journal .bar i { position: absolute; left: 0; top: 0; bottom: 0; background: #d8a040; }
#journal .q.ready .bar i, #journal .obj.done .bar i { background: #8fe07a; }
#journal .pin { width: 44px; height: 44px; border-radius: 10px; border: 1px solid transparent; background: none; color: #7c748a; display: grid; place-items: center; padding: 0; }
#journal .pin svg { width: 20px; height: 20px; fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
#journal .pin.on { color: #f0c880; border-color: rgba(216,160,64,.4); background: rgba(216,160,64,.12); }
#journal .more { border-top: 1px dashed #2c2838; margin: 0 12px; padding: 10px 0 12px; }
#journal .step { font: 14px/1.45 Georgia, serif; color: #d8ccb8; margin: 6px 0 8px; }
#journal .step.ready { color: #8fe07a; }
#journal .step .now { font: 700 10.5px ui-monospace, Menlo, monospace; letter-spacing: 1px; text-transform: uppercase; color: #d8a040; }
#journal .obj { display: grid; grid-template-columns: minmax(0, 1fr) 70px 38px; gap: 8px; align-items: center; font-size: 11px; color: #cbbfae; margin: 5px 0; }
#journal .obj.done { color: #8fe07a; }
#journal .obj .n { text-align: right; font-variant-numeric: tabular-nums; }
#journal .rew { font-size: 10.5px; color: #c09a50; margin-top: 8px; letter-spacing: .5px; }
#journal .acts { display: flex; gap: 8px; margin-top: 10px; align-items: center; }
#journal .acts button { min-height: 44px; border-radius: 8px; font: 11px ui-monospace, Menlo, monospace; letter-spacing: 1px; text-transform: uppercase; border: 1px solid rgba(214,170,98,0.45); color: #f0c880; background: none; }
#journal .acts button.trk { flex: 1; }
#journal .acts button.trk.on { background: rgba(216,160,64,.18); }
#journal .acts button.del { border: 0; color: #978c80; text-decoration: underline; padding: 0 10px; }
#journal .acts .sure { flex: 1; font: 12px/1.4 Georgia, serif; color: #efe4cf; }
#journal .acts button.yes { color: #ff8a7a; border-color: rgba(255,122,102,0.5); padding: 0 12px; }
#journal .acts button.no { color: #efe4cf; border-color: #3a3446; padding: 0 12px; }
#journal .summary { font: 13px/1.45 Georgia, serif; color: #b8ac98; }
#journal .summary.why { margin: 0 0 6px; font-style: italic; }
/* the main story: its chapters as a track */
#journal .ch { display: grid; grid-template-columns: 22px minmax(0, 1fr); gap: 8px; }
#journal .ch .dot { display: flex; flex-direction: column; align-items: center; }
#journal .ch .dot i { width: 12px; height: 12px; border-radius: 6px; border: 2px solid #3a3446; margin-top: 15px; flex: none; }
#journal .ch .dot u { flex: 1; width: 2px; background: #2c2838; margin-top: 2px; }
#journal .ch.past .dot i { background: #7c748a; border-color: #7c748a; }
#journal .ch.now .dot i { background: #d8a040; border-color: #d8a040; box-shadow: 0 0 0 4px rgba(216,160,64,.18); }
#journal .ch > div:last-child { padding-bottom: 8px; min-width: 0; }
#journal .told { min-height: 44px; text-align: left; background: none; border: 0; border-left: 2px solid #3a3446; margin-left: 10px; padding: 0 0 0 20px; color: #978c80; font: 11.5px ui-monospace, Menlo, monospace; }
#journal .lock { font-size: 11px; color: #978c80; padding: 11px 12px; border: 1px dashed #3a3446; border-radius: 10px; }
#journal .lock b { font: 600 14px Georgia, serif; color: #b8ac98; display: block; margin-bottom: 2px; }
#journal .q.story .row { cursor: default; grid-template-columns: minmax(0, 1fr); padding-right: 12px; }
#journal .leads { margin: 0; padding: 0; list-style: none; }
#journal .leads li { font: 13.5px/1.45 Georgia, serif; color: #cfc2ac; padding: 7px 0 7px 18px; border-bottom: 1px solid rgba(214,170,98,0.12); position: relative; }
#journal .leads li::before { content: '◆'; position: absolute; left: 2px; top: 7px; font-size: 10px; color: #a08a6a; }
#journal .empty { font: 14px/1.5 Georgia, serif; color: #978c80; padding: 10px 2px 16px; }
/* the Chronicle */
#journal .count { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
#journal .count div { border: 1px solid #3a3024; border-radius: 10px; padding: 9px 12px; background: rgba(40,30,22,0.35); font-size: 11px; color: #9a9080; }
#journal .count b { display: block; color: #e8c88a; font: 600 20px Georgia, serif; font-variant-numeric: tabular-nums; }
#journal .count .nt { grid-column: 1 / -1; border: 0; background: none; padding: 0 2px; font: 12px/1.4 Georgia, serif; }
#journal .set { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 8px; align-items: baseline; margin: 8px 2px 0; font: 600 15px Georgia, serif; color: #efe4cf; }
#journal .set span { font: 11px ui-monospace, Menlo, monospace; color: #978c80; font-variant-numeric: tabular-nums; }
#journal .frag { border-left: 3px solid #c09a50; padding: 8px 10px 9px 12px; background: rgba(240,224,190,.04); border-radius: 0 10px 10px 0; }
#journal .frag h3 { font: 600 15px Georgia, serif; color: #f0c880; margin: 0 0 4px; }
#journal .frag q { display: block; font: italic 14px/1.45 Georgia, serif; color: #e2d6c0; quotes: none; }
#journal .frag .nt { font: 12.5px/1.4 Georgia, serif; color: #978c80; margin-top: 6px; }
#journal .frag.missing { border-left-color: #3a3444; background: none; padding-top: 6px; padding-bottom: 6px; }
#journal .frag.missing h3 { color: #7c748a; font-weight: 400; font-style: italic; margin: 0; }
#journal .frag.missing .nt { margin-top: 2px; }
`;
const BOOK = '<svg viewBox="0 0 24 24"><path d="M4 5.5C6.5 4.5 9.5 4.5 12 6c2.5-1.5 5.5-1.5 8-.5V19c-2.5-1-5.5-1-8 .5-2.5-1.5-5.5-1.5-8-.5z"/><path d="M12 6v13.5"/></svg><i class="dot"></i>';
const KIND = { chapter: 'Chapter', companion: 'Companion', trial: 'Trial', board: 'Board', errand: 'Errand', bounty: 'Bounty' };
// main story or side quest (the owner, 2026-10-03: the two must read apart at a glance): chapter quests are the main
// story; everything else (errands, bounties, trials, companions' chains, board jobs) is a side quest
export const isMain = (def) => !!def && def.kind === 'chapter';
const SIDE_KINDS = ['errand', 'bounty', 'trial', 'companion', 'board'];
const PLURAL = { errand: 'Errands', bounty: 'Bounties', trial: 'Trials', companion: 'Companions', board: 'Board' };
/** the acts by the region their chapters are told in (Act I the Vale, Act II the Fens: storystatus.js) */
const ACT = { vale: 'Act I · The Hollow Vale', fens: 'Act II · The Greywater Fens' };
const KIND_CHIPS_AT = 5;                         // the side quests' kind chips show once there are this many to sort

/** the lines a quest shows now: its step text (or its "go back" text) and its objectives with counts
 * @param {any} def content/quests/<id>.json @param {{ st: number, step: number, n: number[] }} q */
export function questNow(def, q) {
  if (q.st === QS.READY) return { text: def.ready, objectives: [], ready: true };
  const step = def.steps[q.step] || def.steps[0];
  return { text: step.journal, ready: false, objectives: step.objectives.map((o, i) => ({ label: o.label, n: q.n[i] || 0, of: o.count })) };
}


// a quest's XP for the hero (sim quests.js questXp: a share of a level); a board job's is a number (GDD §9 v1.39)
const xpOf = (def, lv) => (def.rewards.xp !== undefined ? def.rewards.xp : questXp(def.rewards, lv)).toLocaleString('en');
const levelOf = (def) => `level ${def.level[0]}${def.level[1] !== def.level[0] ? '–' + def.level[1] : ''}`;
const PIN = html`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 17v5"/><path d="M9 10.8V6h6v4.8a2 2 0 0 0 .6 1.4L17 13.5V16H7v-2.5l1.4-1.3A2 2 0 0 0 9 10.8z"/><path d="M8 3h8"/></svg>`;

/** a quest as a row: its title, who gave it and its level, the objective it's on; tapped open, the story, the step,
 * every objective, the reward, Track and Abandon (asked twice, inline). Done, it opens on what came of it. */
function Quest({ id, def, q, tracked, open, onOpen, onTrack, onAbandon, npcName, lv, meta }) {
  const [arm, setArm] = useState(false);
  const done = q.st === QS.DONE, now = done ? null : questNow(def, q), ready = !!(now && now.ready);
  const ob = now && (now.objectives.find((o) => o.n < o.of) || now.objectives[0]);
  const who = def.giverName || npcName(def.giver);
  const line = meta || `${isMain(def) ? KIND.chapter : KIND[def.kind] || def.kind} · ${who} · ${levelOf(def)}${def.skulls ? ' · ' + '☠'.repeat(def.skulls) + ' ' + SKULLS[def.skulls] : ''}${def.company ? ' · bring company' : ''}`;
  return html`<div class=${'q' + (tracked && !done ? ' tracked' : '') + (ready ? ' ready' : '') + (done ? ' past' : '') + (open ? ' open' : '')}>
    <div class="row" role="button" tabindex="0" aria-expanded=${open ? 'true' : 'false'} onClick=${onOpen}>
      <div><h3>${ready ? html`<span class="badge ready">Ready</span>` : tracked && !done ? html`<span class="badge tr">Tracked</span>` : ''}${def.title}</h3>
        <div class="giver">${line}</div>
        ${ob ? html`<div class="prog"><span class="bar"><i style=${`width:${Math.round((100 * ob.n) / ob.of)}%`}></i></span><span>${ob.n}/${ob.of}</span></div>` : ready ? html`<div class="giver" style="color:#8fe07a">Go back: it's done</div>` : ''}</div>
      ${done ? html`<span></span>` : html`<button class=${'pin' + (tracked ? ' on' : '')} aria-pressed=${tracked ? 'true' : 'false'} aria-label=${(tracked ? 'Untrack ' : 'Track ') + def.title}
        onClick=${(e) => { e.stopPropagation(); onTrack(tracked ? null : id); }}>${PIN}</button>`}
    </div>
    ${!open ? '' : done ? html`<div class="more"><div class="summary">${def.done}</div></div>`
      : html`<div class="more">
        <div class="summary why">${def.summary}</div>
        <div class=${'step' + (ready ? ' ready' : '')}>${ready ? '' : html`<b class="now">Now: </b>`}${now.text}</div>
        ${now.objectives.map((o) => html`<div key=${o.label} class=${'obj' + (o.n >= o.of ? ' done' : '')}><span>${o.label}</span><span class="bar"><i style=${`width:${Math.round((100 * o.n) / o.of)}%`}></i></span><span class="n">${o.n}/${o.of}</span></div>`)}
        <div class="rew">Reward · ${xpOf(def, lv)} XP · ${def.rewards.gold} gold</div>
        <div class="acts">${arm
          ? html`<span class="sure">Abandon ${def.title}?</span><button class="yes" onClick=${() => onAbandon(id)}>Abandon</button><button class="no" onClick=${() => setArm(false)}>Keep it</button>`
          : html`<button class=${'trk' + (tracked ? ' on' : '')} onClick=${() => onTrack(tracked ? null : id)}>${tracked ? 'Tracked' : 'Track'}</button>
            ${isMain(def) ? '' : html`<button class="del" onClick=${() => setArm(true)}>Abandon</button>`}`}</div>
      </div>`}
  </div>`;
}

// the words in content/story.json with the sim's own values in their {slots}
const fill = (t, v) => String(t || '').replace(/\{(\w+)\}/g, (_, k) => (v[k] ?? ''));

/** the main story as a track (the owner, 2026-11-12, the Journal proposal: "I agree with your recommendations"): each
 * act's chapters in order, those behind you ticked and shut, the one in hand open (or what to do to be given it),
 * the next shown locked with the level it opens at; then what's still open where the company stands. Done: the
 * chapters told, the last first. */
function MainTab({ sim, defOf, npcName, story, view, row, repaint }) {
  const status = (id) => sim.quests.status(id);
  if (view.filter.main === 'done') {
    const told = CHAPTERS.filter((id) => status(id) === QS.DONE && defOf(id)).reverse();
    return told.length ? told.map((id) => row(id, { meta: `Chapter ${CHAPTERS.indexOf(id) + 1} · ${defOf(id).giverName || npcName(defOf(id).giver)}` }))
      : html`<div class="empty">No chapter told yet. Maudry Fenn at the Tired Mule knows where it starts.</div>`;
  }
  const cur = CHAPTERS.findIndex((id) => status(id) !== QS.DONE), out = [];
  let act = '';
  const end = cur < 0, upto = end ? CHAPTERS.length - 1 : Math.min(CHAPTERS.length - 1, cur + 1);
  // the chapters told before the last are folded into a line (the Done filter has them all)
  const from = Math.max(0, (end ? CHAPTERS.length : cur) - 1);
  if (from > 0) out.push(html`<button key="told" class="told" onClick=${() => { view.filter.main = 'done'; view.open = null; const el = document.getElementById('journal'); if (el) el.scrollTop = 0; repaint(); }}>${from === 1 ? 'Chapter 1 told' : `Chapters 1–${from} told`} · see Done</button>`);
  for (let i = from; i <= upto; i++) {
    const id = CHAPTERS[i], d = defOf(id), region = QUESTS[id].region || 'vale'; if (!d) continue;
    if (region !== act) { act = region; out.push(html`<div key=${'act' + region} class="grp act">${ACT[region] || region}</div>`); }
    const last = i === upto, st = status(id), dot = html`<div class="dot"><i></i>${last ? '' : html`<u></u>`}</div>`;
    if (st === QS.DONE) out.push(html`<div key=${id} class="ch past">${dot}<div>${row(id, { meta: `Chapter ${i + 1} · told` })}</div></div>`);
    else if (st === QS.ACTIVE || st === QS.READY) out.push(html`<div key=${id} class="ch now">${dot}<div>${row(id, { meta: `Chapter ${i + 1} · ${d.giverName || npcName(d.giver)} · level ${d.level[0]}` })}</div></div>`);
    else if (i === cur) {   // in hand next, not yet given: who gives it, or the level it waits for (storystatus.js; content/story.json)
      const ss = story && storyStatus(sim.state, status);
      const text = ss && ss.id === id ? fill(story[ss.kind], { title: d.title, giver: ss.giver ? npcName(ss.giver) : '', town: ss.town || '', level: ss.level }) : `Opens at level ${d.level[0]}.`;
      out.push(html`<div key=${id} class="ch now">${dot}<div><div class="q story"><div class="row"><div><h3>${d.title}</h3><div class="giver">Chapter ${i + 1} · next</div><div class="summary" style="margin-top:6px">${text}</div></div></div></div></div></div>`);
    } else out.push(html`<div key=${id} class="ch">${dot}<div><div class="lock"><b>${d.title}</b>Chapter ${i + 1} · opens at level ${d.level[0]}, after ${defOf(CHAPTERS[i - 1]) ? defOf(CHAPTERS[i - 1]).title : 'the last'}</div></div></div>`);
  }
  if (end && story) { const e = story.end[QUESTS[CHAPTERS[CHAPTERS.length - 1]].region || 'fens'] || story.end.fens; if (e) out.push(html`<div key="end" class="q story"><div class="row"><div><h3>${e.title}</h3><div class="summary" style="margin-top:6px">${e.text}</div></div></div></div>`); }
  else if (!end && CHAPTERS.length - 1 > upto) out.push(html`<div key="more" class="giver" style="padding-left:30px">and ${CHAPTERS.length - 1 - upto} more chapter${CHAPTERS.length - 1 - upto === 1 ? '' : 's'} after it</div>`);
  // what's still open where the company stands (the leads: storystatus.js)
  const region = (sim.world && sim.world.region) || sim.state.region || 'vale';
  const ss = story && storyStatus(sim.state, status);   // null while a chapter's in hand: the leads wait till it's done
  const leads = ss && ss.kind !== 'next' ? openLeads(sim.state, status, region) : [];
  const vars = (l) => ({ ...l, cls: l.cls ? `${CLASSES[l.cls].label.toLowerCase()}s` : '', giver: l.giver ? npcName(l.giver) : '' });
  if (leads.length) out.push(html`<div key="leads"><div class="grp">${story.leadsTitle[region] || story.leadsTitle.vale} · ${leads.length}</div><ul class="leads">${leads.map((l) => html`<li key=${l.id + (l.cls || '')}>${fill(story.leads[l.id], vars(l))}</li>`)}</ul></div>`);
  return out;
}

const SET_NAME = { vale: 'The Hollow Vale', fens: 'The Greywater Fens' };
/** the Chronicle (world doc §7): the count, then each set with its tally, found fragments in full, missing ones as a place */
function Chronicle({ sim, lore }) {
  const found = new Set(sim.state.fragments || []), c = sim.state.count || { lamps: 0, souls: 0 };
  return html`<div class="count"><div><b>${c.lamps}</b>${c.lamps === 1 ? 'lamp' : 'lamps'} broken</div><div><b>${c.souls}</b>${c.souls === 1 ? 'soul' : 'souls'} freed</div>
    <div class="nt">Kept by Sister Ilse. A soul for each of the bound put down and each cage broken, and every soul a broken lamp held. The living never count: they were never bound.</div></div>
  ${Object.entries(SETS).map(([set, ids]) => { const n = ids.filter((id) => found.has(id)).length; return html`<div key=${set} class="list" style="padding-top:4px">
    <div class="set">${SET_NAME[set] || set}<span>${n} of ${ids.length} found</span></div>
    <div class="prog" style="margin:0 2px"><span class="bar"><i style=${`width:${Math.round((100 * n) / ids.length)}%`}></i></span><span>${Math.round((100 * n) / ids.length)}%</span></div>
    ${ids.map((id) => { const w = lore[id]; if (!w) return null;
      return found.has(id)
        ? html`<div key=${id} class="frag"><h3>${w.title}</h3><q>${w.text}</q><div class="nt">${w.note}</div></div>`
        : html`<div key=${id} class="frag missing"><h3>Missing</h3><div class="nt">${w.where}</div></div>`; })}
  </div>`; })}`;
}

/** the Journal (the owner, 2026-11-12: "at the top tabs - Main, Secondary, and Chronicle - clicking on each then displays
 * the additional tabs/filters - active, done"; built from the proposal he agreed, Side for Secondary): what kind of thing
 * first, then which state, never mixed; quests as compact rows, the one that wants you first. `view` is kept between
 * openings (createJournal): each tab its own filter. */
function Journal({ sim, defOf, npcName, onClose, lore, story, view, repaint }) {
  const push = (cmd) => sim.commands.push(cmd);
  const all = Object.entries(sim.state.quests || {}).filter(([id]) => defOf(id));
  const live = (q) => q.st === QS.ACTIVE || q.st === QS.READY, lv = sim.state.party[0].level, tracked = sim.state.tracked;
  const side = all.filter(([id]) => !isMain(defOf(id))), sideLive = side.filter(([, q]) => live(q)), sideDone = side.filter(([, q]) => q.st === QS.DONE);
  const readyN = sideLive.filter(([, q]) => q.st === QS.READY).length;
  const status = (id) => sim.quests.status(id), cur = CHAPTERS.findIndex((id) => status(id) !== QS.DONE);
  const fragN = (sim.state.fragments || []).length, fragOf = Object.values(SETS).reduce((n, s) => n + s.length, 0);
  // a new list starts at its top (the sheet keeps its height: it never moves under the thumb)
  const top = () => { const el = document.getElementById('journal'); if (el) el.scrollTop = 0; };
  const set = (k, v) => { view[k] = v; if (k === 'kind') top(); repaint(); };
  const row = (id, o = {}) => { const q = sim.state.quests[id] || { st: QS.DONE, step: 0, n: [] }; return html`<${Quest} key=${id} id=${id} def=${defOf(id)} q=${q} tracked=${tracked === id} open=${view.open === id} meta=${o.meta}
    onOpen=${() => set('open', view.open === id ? null : id)} onTrack=${(t) => push({ type: 'track', id: t })} onAbandon=${(t) => { push({ type: 'questAbandon', id: t }); view.open = null; }} npcName=${npcName} lv=${lv} />`; };
  // side quests: the ones to hand in first, then the tracked one, then by level; done, the last first
  let list = sideOrder(view.filter.side === 'done' ? sideDone : sideLive, view.filter.side, tracked, (id) => defOf(id).level[0]);
  const kinds = SIDE_KINDS.filter((k) => list.some(([id]) => defOf(id).kind === k));
  const chips = view.tab === 'side' && list.length >= KIND_CHIPS_AT && kinds.length > 1;
  if (chips && view.kind !== 'all') list = list.filter(([id]) => defOf(id).kind === view.kind);
  const tab = (k, label, sub) => html`<button class=${view.tab === k ? 'on' : ''} role="tab" aria-selected=${view.tab === k ? 'true' : 'false'} onClick=${() => { view.tab = k; view.kind = 'all'; top(); repaint(); }}>${label}<small>${sub}</small></button>`;
  const state = (k, label) => html`<button class=${view.filter[view.tab] === k ? 'on' : ''} role="tab" aria-selected=${view.filter[view.tab] === k ? 'true' : 'false'} onClick=${() => { view.filter[view.tab] = k; view.kind = 'all'; top(); repaint(); }}>${label}</button>`;
  const mainDone = CHAPTERS.filter((id) => status(id) === QS.DONE).length, inHand = CHAPTERS.some((id) => status(id) === QS.ACTIVE || status(id) === QS.READY) ? 1 : 0;
  return html`<div id="journal">
    <div class="head">
      <div class="top"><h2>Journal</h2><button class="x" aria-label="Close" onClick=${onClose}>✕</button></div>
      <div class="tabs" role="tablist">
        ${tab('main', 'Main', cur < 0 ? 'all told' : `chapter ${cur + 1}`)}
        ${tab('side', 'Side', readyN ? `${sideLive.length} · ${readyN} ready` : `${sideLive.length} active`)}
        ${tab('chron', 'Chronicle', `${fragN} of ${fragOf}`)}
      </div>
      <div class="states" role="tablist">${view.tab === 'chron' ? html`<span class="lbl">Found</span>`
        : view.tab === 'main' ? html`${state('active', `Active · ${inHand}`)}${state('done', `Done · ${mainDone}`)}`
        : html`${state('active', `Active · ${sideLive.length}`)}${state('done', `Done · ${sideDone.length}`)}`}</div>
      ${chips ? html`<div class="kinds">${['all', ...kinds].map((k) => html`<button key=${k} class=${view.kind === k ? 'on' : ''} aria-pressed=${view.kind === k ? 'true' : 'false'} onClick=${() => set('kind', k)}>${k === 'all' ? 'All' : PLURAL[k]}</button>`)}</div>` : ''}
    </div>
    <div class="list">
    ${view.tab === 'chron' ? html`<${Chronicle} sim=${sim} lore=${lore} />`
      : view.tab === 'main' ? html`<${MainTab} sim=${sim} defOf=${defOf} npcName=${npcName} story=${story} view=${view} row=${row} repaint=${repaint} />`
      : list.length ? list.map(([id]) => row(id))
      : view.filter.side === 'done' ? html`<div class="empty">Nothing finished yet.</div>`
      : html`<div class="empty">No side quests on the go. People in town ask for help when they know you. Maudry Fenn at the Tired Mule usually has something, and the Lantern Guild's board by her door always does.</div>`}
    </div>
  </div>`;
}

/** @param {{ sim: any, npcName: (id: string) => string, toast: (msg: string, ms?: number, key?: string, o?: { keep?: boolean }) => void, partyPanel?: { height: () => number } }} o */
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
  // what the Journal shows, kept between openings: the tab, each tab's filter (active or done), a side kind, the quest open
  const view = { tab: '', filter: { main: 'active', side: 'active' }, kind: 'all', open: /** @type {string | null} */ (null) };
  const paint = () => { if (open) render(html`<${Journal} sim=${sim} defOf=${defOf} npcName=${npcName} onClose=${close} lore=${lore} story=${story} view=${view} repaint=${paint} />`, wrap); };
  function close() { open = false; wrap.classList.remove('on'); render(null, wrap); }
  /** open it; on a quest (the tracker line's tap, or the first opening: the tracked one), its tab with it open @param {string | null} [at] */
  function show(at = null) {
    const id = at || (!view.tab ? sim.state.tracked : null), def = id && defOf(id), q = id && sim.state.quests[id];
    if (def && q && q.st !== QS.DONE) { view.tab = isMain(def) ? 'main' : 'side'; view.filter[view.tab] = 'active'; view.kind = 'all'; view.open = id; }
    if (!view.tab) view.tab = 'main';
    open = true; wrap.classList.add('on'); btn.classList.remove('due'); paint();
  }
  btn.addEventListener('click', () => show()); track.addEventListener('click', () => show(sim.state.tracked));
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
    if (def && e.state === QS.ACTIVE && !was) { toast(`Quest accepted · ${def.title}`, 2200, undefined, { keep: true }); btn.classList.add('due'); }
    else if (def && e.state === QS.ACTIVE && was && was.step === e.step) {
      const i = n.findIndex((v, k) => v > (was.n[k] || 0)), o = i >= 0 && def.steps[e.step].objectives[i];
      if (o) toast(`${o.label} ${n[i]}/${o.count}`, 2200, `q:${e.id}:${i}`);   // one line per objective, its count updated in place
    } else if (def && e.state === QS.READY && (!was || was.st !== QS.READY)) toast(`Quest complete · ${def.ready}`, 2600, undefined, { keep: true });
    if (e.id) seen.set(e.id, { st: e.state, step: e.step, n: n.slice() });
    paintTracker(); paint();
  });
  sim.bus.on('questReward', (r) => { const d = defOf(r.id); if (d) toast(`${d.title} · +${r.xp} XP · +${r.gold} gold`, 2600, undefined, { keep: true }); });
  sim.bus.on('questTracked', () => { paintTracker(); paint(); });
  // (a fragment comes out of a chest or a hall's last wave: the HUD's "chest opened" says so first, then this)
  sim.bus.on('fragmentFound', (f) => { const w = lore[f.id]; setTimeout(() => toast(`Fragment found · ${w ? w.title : 'the Chronicle'} (${f.found} of ${f.of}) · +${f.xp} XP`, 3000, undefined, { keep: true }), 1400); btn.classList.add('due'); paint(); });
  sim.bus.on('setComplete', (e) => toast(`${SET_NAME[e.set] || e.set}: the set is whole. Sister Ilse will want to read it.`, 3200, undefined, { keep: true }));
  // sites (sim/sites.js): a hidden one found, or its way in still shut (its words: content/sites)
  const sites = {};
  sim.bus.on('siteRevealed', (e) => toast(`${(sites[e.site] || e).name} is open to you. It's on the compass now.`, 3200, undefined, { keep: true }));
  sim.bus.on('siteShut', (e) => { const w = sites[e.site]; if (w && w.shut) toast(w.shut, 2800); });
  // (v1.48) a secret site rests after it was cleared, then can be walked again (sim core.js state.secrets)
  sim.bus.on('secretSealed', (e) => toast(`${(sites[e.site] || { name: 'It' }).name} seals itself behind you. It will open again in two hours.`, 3600));
  sim.bus.on('siteSealed', (e) => toast(`${(sites[e.site] || { name: 'It' }).name} is sealed. It opens again in ${e.mins} minute${e.mins === 1 ? '' : 's'}.`, 3000));
  sim.bus.on('landShut', (e) => { if (e.line) toast(e.line, 3200); });   // the road to a land not yet open (regions.js; outdoor.js has its words)

  // the words: one file per quest the sim knows, and the board's templates
  const ready = Promise.all([boardReady, ...SITE_IDS.map((id) => fetch(`./content/sites/${id}.json`).then((r) => r.json()).then((d) => { sites[id] = d; }).catch(() => {})), ...Object.keys(FRAGMENTS).map((id) => fetch(`./content/lore/${id}.json`).then((r) => r.json()).then((d) => { lore[id] = d; }).catch(() => {})), ...Object.keys(QUESTS).map((id) => fetch(`./content/quests/${id}.json`).then((r) => r.json()).then((d) => { defs[id] = d; }).catch(() => {}))])
    .then(() => { for (const [id, q] of Object.entries(sim.state.quests || {})) seen.set(id, { st: q.st, step: q.step, n: q.n.slice() }); paintTracker(); });
  return { open: show, close, ready, def: defOf, title: (/** @type {string} */ id) => (defOf(id) ? defOf(id).title : ''), get isOpen() { return open; } };
}
