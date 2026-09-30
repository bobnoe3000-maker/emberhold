// @ts-check
// title.js — the Title screen, which doubles as the pause menu (development plan §2.1–§2.3).
// On launch (after the boot's loading screen, src/cutscene/player.js) it covers the (paused)
// world: the wordmark, this slot's hero, and Continue — or Begin, for a slot with no hero yet,
// which plays the intro and then opens character creation. ☰ in the HUD brings it back
// mid-game as a pause menu (Resume). From here: Game slots, Party, The Chronicle (the intro
// again) and Account (cloud saves arrive at M6).
//
// The sim doesn't tick while the title is up (main.js pauses the loop), so a battle behind
// it waits. Preact + htm, like every M3 window.

import { html, render } from 'htm/preact';
import { CLASSES } from '../sim/party.js';
import { swallow } from './actorart.js';

const CSS = `
#titleWrap { position: fixed; inset: 0; z-index: 11; display: none; background: linear-gradient(rgba(8,6,12,.35), rgba(8,6,12,.55) 40%, rgba(8,6,12,.94) 72%); }
#titleWrap.on { display: block; }
#title { position: absolute; left: 0; right: 0; bottom: 0; max-width: 480px; margin: 0 auto; padding: 0 22px calc(env(safe-area-inset-bottom, 0px) + 22px);
  font-family: Georgia, 'Times New Roman', serif; color: #efe4cf; text-align: center; }
#title .mark { font: 400 46px 'IM Fell English SC', Georgia, serif; letter-spacing: 6px; color: #f0c880; text-shadow: 0 2px 0 #000, 0 0 24px rgba(224,168,90,.45); margin-bottom: 6px; }
#title .mark em { font-style: normal; color: #ff9a50; }
#title .tag { font: italic 15px 'IM Fell English', Georgia, serif; color: #c8baa2; line-height: 1.4; margin: 0 auto 26px; max-width: 320px; }
#title .who { font: 12px ui-monospace, Menlo, monospace; letter-spacing: 1px; color: #b8aca0; margin-bottom: 14px; line-height: 1.5; }
#title .who b { color: #efe4cf; font: 600 16px Georgia, serif; letter-spacing: 0; }
#title button { display: block; width: 100%; min-height: 48px; margin: 0 0 10px; border-radius: 10px; font: 600 15px Georgia, serif; letter-spacing: 1px;
  border: 1px solid rgba(214,170,98,0.5); color: #f0c880; background: rgba(16,12,22,.8); }
#title button.pri { background: linear-gradient(#e0a84a, #b67c2a); color: #1a1208; border-color: #f0c880; font-size: 17px; }
#title button:disabled { color: #6f6880; border-color: #3a3346; background: rgba(16,12,22,.6); }
#title button small { display: block; font: 10.5px ui-monospace, Menlo, monospace; letter-spacing: .5px; color: inherit; opacity: .75; margin-top: 2px; }
#title .row { display: flex; gap: 10px; } #title .row button { flex: 1; }
`;

/**
 * @param {{ sim: any, slot: number, setPaused: (on: boolean) => void, openSlots: () => void, openParty: () => void, openCreate: () => void,
 *   openChronicle: (mode: string) => void, onOpen?: () => void, onPlay?: () => void }} o  onPlay: the title closes into play
 */
export function createTitle({ sim, slot, setPaused, openSlots, openParty, openCreate, openChronicle, onOpen = () => {}, onPlay = () => {} }) {
  const style = document.createElement('style'); style.textContent = CSS; document.head.appendChild(style);
  const wrap = document.createElement('div'); wrap.id = 'titleWrap'; document.body.appendChild(wrap);
  swallow(wrap);
  let mode = 'title';

  function Title() {
    const S = sim.state, h = S.party[0], made = S.created;
    const where = sim.world.kind === 'dungeon' ? `${(sim.world.siteName || 'The Old Barrows').replace(/^The /, 'the ')} · depth ${S.depth + 1}` : sim.world.name || 'Emberfall';
    return html`<div id="title">
      <div class="mark">EMBER<em>FALL</em></div>
      <div class="tag">The heroes of this age are not available… Looks like it is up to you.</div>
      <div class="who">${made
        ? html`Slot ${slot} · <b>${h.name}</b><br />${(CLASSES[h.cls] || CLASSES.fighter).label} · level ${h.level} · ${where}`
        : html`Slot ${slot} · <b>no hero yet</b><br />a new party, a fresh Emberfall`}</div>
      ${made
        ? html`<button class="pri" onClick=${close}>${mode === 'pause' ? 'Resume' : 'Continue'}</button>`
        : html`<button class="pri" onClick=${() => { hide(); openCreate(); }}>Begin</button>`}
      <div class="row">
        <button onClick=${() => openSlots()}>Game slots</button>
        <button disabled=${!made} onClick=${() => { close(); openParty(); }}>Party</button>
      </div>
      <div class="row">
        <button onClick=${() => { hide(); openChronicle(mode); }}>The Chronicle<small>watch the intro</small></button>
        <button disabled>Account<small>cloud saves with M6</small></button>
      </div>
    </div>`;
  }
  const draw = () => render(html`<${Title} />`, wrap);
  function open(m = 'title') { mode = m; onOpen(); wrap.classList.add('on'); setPaused(true); draw(); }
  function hide() { wrap.classList.remove('on'); render(null, wrap); }
  function close() { hide(); setPaused(false); onPlay(); }
  const btn = document.getElementById('menuBtn');
  if (btn) { btn.setAttribute('aria-label', 'Menu'); btn.addEventListener('click', () => open('pause')); swallow(btn); }
  return { open, close, get isOpen() { return wrap.classList.contains('on'); } };
}
