// @ts-check
// dialogue.js — the conversation window (development plan §2.8, quest-lore-system §6): a bottom
// sheet with the speaker's portrait and name, one line at a time (tap to go on), then the choices.
// Opens on the sim's 'dialogue' event (you tapped someone and were in reach); the words come from
// Ink through story/adapter.js, and anything a line changes goes back to the sim as a command.
// Closing sends `endTalk`; walking off ends it from the sim's side ('talkEnded').
//
// Lines render as text, never HTML. A line in quotes is speech; anything else is narration, set
// in italics. Choices are full-width buttons (≥ 44 px) in the lower third, under the thumb.

import { html, render } from 'htm/preact';
import { useEffect, useRef, useState } from 'preact/hooks';
import { createStoryBook } from '../story/adapter.js';
import { drawPortrait, swallow } from './actorart.js';

const CSS = `
#talkWrap { position: fixed; left: 0; right: 0; bottom: 0; z-index: 11; display: none; pointer-events: none; }
#talkWrap.on { display: block; }
#talk { pointer-events: auto; position: relative; max-width: 480px; margin: 0 auto; background: #100c16; border-top: 1px solid rgba(214,170,98,0.5);
  border-radius: 16px 16px 0 0; padding: 12px 14px calc(env(safe-area-inset-bottom, 0px) + 14px); color: #efe4cf; font-family: Georgia, 'Times New Roman', serif;
  box-shadow: 0 -10px 30px rgba(0,0,0,.45); -webkit-tap-highlight-color: transparent; user-select: none; }
#talk .who { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; }
#talk canvas { width: 48px; height: 57px; border-radius: 8px; border: 1px solid rgba(214,170,98,0.4); background: radial-gradient(#3a2c22, #17111c); image-rendering: pixelated; flex: none; }
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
`;

function Portrait({ look }) {
  const ref = useRef(/** @type {HTMLCanvasElement|null} */ (null));
  useEffect(() => { if (ref.current && look) drawPortrait(ref.current, look); }, [look]);
  return html`<canvas ref=${ref} width="44" height="52"></canvas>`;
}

/** @param {{ def: any, place: string, beat: any, onChoose: (i: number) => void, onClose: () => void }} p */
function Talk({ def, place, beat, onChoose, onClose }) {
  const [at, setAt] = useState(0);                            // (keyed per beat: a new beat starts at its first line)
  const lines = beat.lines, line = lines[Math.min(at, lines.length - 1)] || '', last = at >= lines.length - 1;
  const next = () => { if (!last) setAt(at + 1); else if (beat.ended) onClose(); };
  return html`<div id="talk" onClick=${(e) => { if (!e.target.closest('button')) next(); }}>
    <button class="x" aria-label="Leave" onClick=${onClose}>✕</button>
    <div class="who"><${Portrait} look=${def.portrait || def.look} /><div class="nm"><b>${def.name}</b><span>${place}</span></div></div>
    <div class=${'line' + (/^["“]/.test(line) ? '' : ' nar')}>${line}</div>
    ${!last ? html`<button class="more" onClick=${next}>Go on ▸</button>`
      : beat.ended ? html`<button class="more" onClick=${onClose}>Leave ▸</button>`
      : beat.choices.map((c) => html`<button class="ch" key=${c.index + ':' + c.text} onClick=${() => onChoose(c.index)}>${c.text}</button>`)}
  </div>`;
}

/** @param {{ sim: any, cast: () => Record<string, any>, openService: (kind: string) => void }} o */
export function createDialogue({ sim, cast, openService }) {
  const style = document.createElement('style'); style.textContent = CSS; document.head.appendChild(style);
  const wrap = document.createElement('div'); wrap.id = 'talkWrap'; document.body.appendChild(wrap); swallow(wrap);
  const book = createStoryBook((file) => fetch(`./content/dialogue/${file}.json`).then((r) => r.json()));
  const push = (cmd) => sim.commands.push(cmd);
  let convo = null, def = null, pending = [], open = false, beatN = 0;

  const place = (d) => { const sv = (sim.world.services || []).find((s) => s.kind === 'tavern'); return d.role && d.role.includes('innkeeper') && sv ? sv.name : sim.world.name || ''; };
  const show = (beat) => {
    pending.push(...beat.windows);
    render(html`<${Talk} key=${++beatN} def=${def} place=${place(def)} beat=${beat} onChoose=${(i) => show(convo.choose(i))} onClose=${close} />`, wrap);
  };
  function close() {
    if (!open) return;
    open = false; wrap.classList.remove('on'); render(null, wrap); push({ type: 'endTalk' });
    const w = pending; pending = []; convo = null;
    for (const t of w) if (t.tag === 'service' && t.args[0]) openService(t.args[0]);   // the window a line asked for, once the talk is done
  }
  sim.bus.on('dialogue', async ({ npc, knot, vars }) => {
    const d = cast()[npc]; if (!d) { push({ type: 'endTalk' }); return; }
    try {
      const c = await book.open(d.dialogue, knot, vars, push);
      def = d; convo = c; pending = []; open = true; wrap.classList.add('on'); show(c.first);
    } catch (e) { console.warn('dialogue', npc, e); push({ type: 'endTalk' }); }
  });
  sim.bus.on('talkEnded', () => { if (open) { open = false; wrap.classList.remove('on'); render(null, wrap); pending = []; convo = null; } });
  sim.bus.on('levelChanged', () => { if (open) close(); });
  return { get open() { return open; }, close };
}
