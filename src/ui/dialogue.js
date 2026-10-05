// @ts-check
// dialogue.js — the conversation window (development plan §2.8, quest-lore-system §6): a bottom
// sheet with the speaker's portrait and name, one line at a time (tap to go on), then the choices.
// Opens on the sim's 'dialogue' event (you tapped someone and were in reach); the words come from
// Ink through story/adapter.js, and anything a line changes goes back to the sim as a command.
// Closing sends `endTalk`; walking off ends it from the sim's side ('talkEnded'). A line with
// effects (taking or handing in a quest) holds the beat until the sim has applied them and sent
// its variables back ('talkVars', a tick later), so the choices after it read the quest as it now
// stands.
//
// Lines render as text, never HTML. A line in quotes is speech; anything else is narration, set
// in italics. Choices are full-width buttons (≥ 44 px) in the lower third, under the thumb; quest
// ones (Ink `#mark: quest`) are set apart with a diamond, a label and their own colour, by the
// quest's state: `quest` an offer (New), `quest active` one you've taken (Taken, quieter, a hollow
// diamond), `quest ready` one to hand in here (Hand in, green). Taking or handing in a quest puts a
// note at the top of the window ('questAccepted' / 'questReward'), with its title, until your next pick.
// A skill learned from the one you're talking to (a class trial handed in: 'trialDone') adds its own
// row under it, the way the quest's reward does: the skill's name, who in the company knows it now,
// and what it does.

import { html, render } from 'htm/preact';
import { useEffect, useRef, useState } from 'preact/hooks';
import { createStoryBook } from '../story/adapter.js';
import { drawPortrait, swallow, PORTRAIT_W, PORTRAIT_H } from './actorart.js';
import { SKILLS } from '../sim/skills.js';
import { CLASSES } from '../sim/party.js';

const CSS = `
#talkWrap { position: fixed; left: 0; right: 0; bottom: 0; z-index: 11; display: none; pointer-events: none; }
#talkWrap.on { display: block; }
#talk { pointer-events: auto; position: relative; max-width: 480px; margin: 0 auto; background: #100c16; border-top: 1px solid rgba(214,170,98,0.5);
  border-radius: 16px 16px 0 0; padding: 12px 14px calc(env(safe-area-inset-bottom, 0px) + 14px); color: #efe4cf; font-family: Georgia, 'Times New Roman', serif;
  box-shadow: 0 -10px 30px rgba(0,0,0,.45); -webkit-tap-highlight-color: transparent; user-select: none; }
#talk .who { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; }
#talk canvas { width: 48px; height: 57px; border-radius: 8px; border: 1px solid rgba(214,170,98,0.4); background: radial-gradient(#3a2c22, #17111c); flex: none; }
#talk .nm b { display: block; font-size: 17px; color: #f0c880; font-weight: 600; }
#talk .nm span { display: block; font: 10.5px ui-monospace, Menlo, monospace; color: #978c80; letter-spacing: .5px; margin-top: 2px; }
#talk .x { position: absolute; right: 10px; top: 10px; width: 44px; height: 44px; border-radius: 22px; border: 1px solid rgba(214,170,98,0.45); color: #d8a040; background: none; font-size: 15px; }
#talk .line { min-height: 66px; font-size: 16px; line-height: 1.45; padding: 4px 2px 8px; }
#talk .line.nar { font-style: italic; color: #cbbfae; }
#talk .more { display: block; width: 100%; min-height: 44px; margin-top: 2px; border: none; background: none; color: #d8a040; font: 11px ui-monospace, Menlo, monospace; letter-spacing: 1.5px; text-transform: uppercase; text-align: right; }
#talk .ch { display: block; width: 100%; min-height: 44px; margin-top: 6px; padding: 9px 12px; text-align: left; border-radius: 10px; border: 1px solid rgba(214,170,98,0.4);
  background: rgba(255,255,255,.03); color: #efe4cf; font: 15px Georgia, serif; }
#talk .ch:active { background: rgba(216,160,64,.16); }
#talk .ch::before { content: '›'; color: #d8a040; margin-right: 8px; }
/* quest choices (Ink: #mark: quest): taking, asking after and handing in a quest. Set apart by a
   diamond and a QUEST label as well as the colour; handing in (ready) is green, as in the Journal */
#talk .ch.quest { display: flex; align-items: center; gap: 8px; border-color: #e0a84a; background: rgba(216,160,64,.13); color: #f7d890; box-shadow: inset 3px 0 0 #e0a84a; }
#talk .ch.quest::before { content: '◆'; margin-right: 0; color: #f0c060; }
#talk .ch.quest .t { flex: 1; min-width: 0; }
#talk .ch.quest em { flex: none; font: 700 9.5px ui-monospace, Menlo, monospace; font-style: normal; letter-spacing: 1.5px; color: #1a1208; background: #e0a84a; border-radius: 4px; padding: 2px 6px; }
/* taken: the quest is yours already; asking after it is quieter than an offer */
#talk .ch.quest.active { border-color: rgba(224,168,74,.55); background: rgba(216,160,64,.05); color: #e8d6b0; box-shadow: inset 3px 0 0 rgba(224,168,74,.55); }
#talk .ch.quest.active::before { content: '◇'; color: #e0a84a; }
#talk .ch.quest.active em { background: none; color: #e0b860; border: 1px solid rgba(224,184,96,.7); }
#talk .note { display: flex; align-items: center; gap: 8px; margin: 0 0 8px; padding: 8px 10px; border-radius: 8px; border: 1px solid #e0a84a; background: rgba(216,160,64,.14);
  font: 12px/1.35 ui-monospace, Menlo, monospace; color: #f7d890; }
#talk .note::before { content: '◆'; color: #f0c060; font-size: 13px; }
#talk .note.done { border-color: #8fe07a; background: rgba(143,224,122,.1); color: #c8f4b8; }
#talk .note.done::before { color: #8fe07a; }
#talk .note b { font-weight: 700; }
#talk .note.skill { border-color: #b8a0ff; background: rgba(184,160,255,.12); color: #e0d6ff; flex-direction: column; align-items: flex-start; gap: 2px; }
#talk .note.skill::before { content: none; }
#talk .note.skill .h::before { content: '✦ '; color: #c8b4ff; }
#talk .note.skill small { font-size: 12.5px; color: #c8bfe8; }
#talk .ch.quest.ready { border-color: #8fe07a; background: rgba(143,224,122,.11); color: #c8f4b8; box-shadow: inset 3px 0 0 #8fe07a; }
#talk .ch.quest.ready::before { color: #8fe07a; }
#talk .ch.quest.ready em { background: #8fe07a; }
`;

function Portrait({ look }) {
  const ref = useRef(/** @type {HTMLCanvasElement|null} */ (null));
  useEffect(() => { if (ref.current && look) drawPortrait(ref.current, look); }, [look]);
  return html`<canvas ref=${ref} width=${PORTRAIT_W} height=${PORTRAIT_H}></canvas>`;
}

const CHIP = { ready: 'Hand in', active: 'Taken' };
/** @param {{ def: any, place: string, beat: any, note: { kind: string, title: string, sub: string, skill?: { name: string, who: string, text: string } } | null, onChoose: (i: number) => void, onClose: () => void }} p */
function Talk({ def, place, beat, note, onChoose, onClose }) {
  const [at, setAt] = useState(0);                            // (keyed per beat: a new beat starts at its first line)
  const lines = beat.lines, line = lines[Math.min(at, lines.length - 1)] || '', last = at >= lines.length - 1;
  const next = () => { if (!last) setAt(at + 1); else if (beat.ended) onClose(); };
  return html`<div id="talk" onClick=${(e) => { if (!e.target.closest('button')) next(); }}>
    <button class="x" aria-label="Leave" onClick=${onClose}>✕</button>
    <div class="who"><${Portrait} look=${def.portrait || def.look} /><div class="nm"><b>${def.name}</b><span>${place}</span></div></div>
    ${note ? html`<div class=${'note' + (note.kind === 'done' ? ' done' : '')} role="status"><span>${note.kind === 'done' ? 'Handed in: ' : 'Quest taken: '}<b>${note.title}</b>${note.sub ? ' · ' + note.sub : ''}</span></div>` : null}
    ${note && note.skill ? html`<div class="note skill" role="status"><span class="h">New skill learned: <b>${note.skill.name}</b> · ${note.skill.who}</span><small>${note.skill.text}</small></div>` : null}
    <div class=${'line' + (/^["“]/.test(line) ? '' : ' nar')}>${line}</div>
    ${!last ? html`<button class="more" onClick=${next}>Go on ▸</button>`
      : beat.ended ? html`<button class="more" onClick=${onClose}>Leave ▸</button>`
      : beat.choices.map((c) => (c.mark && c.mark[0] === 'quest'
        ? html`<button class=${'ch quest' + (CHIP[c.mark[1]] ? ' ' + c.mark[1] : '')} key=${c.index + ':' + c.text} onClick=${() => onChoose(c.index)}><span class="t">${c.text}</span><em>${CHIP[c.mark[1]] || 'New'}</em></button>`
        : html`<button class="ch" key=${c.index + ':' + c.text} onClick=${() => onChoose(c.index)}>${c.text}</button>`))}
  </div>`;
}

/** @param {{ sim: any, cast: () => Record<string, any>, openService: (kind: string) => void, questTitle?: (id: string) => string }} o */
export function createDialogue({ sim, cast, openService, questTitle = (id) => id }) {
  const style = document.createElement('style'); style.textContent = CSS; document.head.appendChild(style);
  const wrap = document.createElement('div'); wrap.id = 'talkWrap'; document.body.appendChild(wrap); swallow(wrap);
  const book = createStoryBook((file) => fetch(`./content/dialogue/${file}.json`).then((r) => r.json()));
  const push = (cmd) => sim.commands.push(cmd);
  let convo = null, def = null, pending = [], open = false, beatN = 0;
  let held = null, waitN = 0;                                 // a beat waiting on the sim's variables, and for how many effects
  let shown = null, note = null;                              // the beat on screen; the quest just taken or handed in (until your next pick)

  const place = (d) => { const sv = (sim.world.services || []).find((s) => s.kind === 'tavern'); return d.role && d.role.includes('innkeeper') && sv ? sv.name : sim.world.name || ''; };
  // `fresh`: a new beat starts at its first line; a resumed one keeps the line you're on
  const show = (beat, fresh = true) => {
    pending.push(...beat.windows);
    held = beat.waiting ? beat : null; waitN = beat.waiting || 0;
    shown = beat;
    render(html`<${Talk} key=${fresh ? ++beatN : beatN} def=${def} place=${place(def)} beat=${beat} note=${note} onChoose=${(i) => { note = null; show(convo.choose(i)); }} onClose=${close} />`, wrap);
  };
  const tell = (n) => { if (!open || !shown) return; note = n; show(shown, false); };
  sim.bus.on('questAccepted', ({ id }) => tell({ kind: 'taken', title: questTitle(id) || 'a new quest', sub: "it's in your Journal" }));
  sim.bus.on('questReward', ({ id, xp, gold }) => tell({ kind: 'done', title: questTitle(id) || 'the quest', sub: [xp ? `+${xp} XP` : '', gold ? `+${gold} gold` : ''].filter(Boolean).join(' · ') }));
  // (the sim hands the trial in first, then says the skill is learned: the row joins the quest's note)
  sim.bus.on('trialDone', ({ cls, id, lv = 6 }) => {
    const A = (SKILLS[cls] || []).find((q) => q.trial && q.lv === lv); if (!A) return;   // (lv: the 6 or the 12, M8)
    const l = (CLASSES[cls] || { label: cls }).label.toLowerCase();
    tell({ ...(note || { kind: 'done', title: questTitle(id) || 'the trial', sub: '' }), skill: { name: A.name, who: `every ${l} in your company knows it`, text: A.text } });
  });
  function close() {
    if (!open) return;
    open = false; held = null; wrap.classList.remove('on'); render(null, wrap); push({ type: 'endTalk' });
    const w = pending; pending = []; convo = null;
    for (const t of w) if (t.tag === 'service' && t.args[0]) openService(t.args[0]);   // the window a line asked for, once the talk is done
  }
  sim.bus.on('dialogue', async ({ npc, knot, vars }) => {
    const d = cast()[npc]; if (!d) { push({ type: 'endTalk' }); return; }
    try {
      const c = await book.open(d.dialogue, knot, vars, push);
      def = d; convo = c; pending = []; note = null; open = true; wrap.classList.add('on'); show(c.first);
    } catch (e) { console.warn('dialogue', npc, e); push({ type: 'endTalk' }); }
  });
  sim.bus.on('talkVars', ({ vars }) => {
    if (!open || !held || --waitN > 0) return;
    const b = held, next = convo.resume(vars);
    show({ ...next, lines: b.lines.concat(next.lines) }, false);
  });
  sim.bus.on('talkEnded', () => { if (open) { open = false; held = null; wrap.classList.remove('on'); render(null, wrap); pending = []; convo = null; } });
  sim.bus.on('levelChanged', () => { if (open) close(); });
  return { get open() { return open; }, close };
}
