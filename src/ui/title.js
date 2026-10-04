// @ts-check
// title.js — the Title screen, which doubles as the pause menu (development plan §2.1–§2.3).
// On launch (after the boot's loading screen, src/cutscene/player.js) it covers the (paused)
// world: the wordmark, this slot's hero, and Continue — or Begin, for a slot with no hero yet,
// which plays the intro and then opens character creation. ☰ in the HUD brings it back
// mid-game as a pause menu (Resume). From here: Game slots, Party, The Chronicle (the intro
// again), Sound (the volume, and a slider each for the music, ambience, attacks and spells, footsteps and foes' cries:
// kept per device, audio/settings.js), Account (cloud saves arrive at M6) and Copy debug report (debugreport.js: the game's
// state as text on the clipboard, to paste into a bug report; read only).
//
// The sim doesn't tick while the title is up (main.js pauses the loop), so a battle behind
// it waits. Preact + htm, like every M3 window.

import { html, render } from 'htm/preact';
import { CLASSES } from '../sim/party.js';
import { swallow } from './actorart.js';
import { debugReport } from './debugreport.js';

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
#title .snd { text-align: left; margin: 0 0 12px; max-height: calc(100vh - 150px); overflow-y: auto; }
#title .snd label { display: flex; align-items: center; justify-content: space-between; gap: 12px; min-height: 48px; padding: 0 12px; margin: 0 0 8px;
  border-radius: 10px; border: 1px solid rgba(214,170,98,0.35); background: rgba(16,12,22,.8); font: 600 15px Georgia, serif; color: #efe4cf; }
#title .snd label small { display: block; font: 10.5px ui-monospace, Menlo, monospace; color: #b8aca0; margin-top: 2px; letter-spacing: .3px; }
#title .snd label > span { min-width: 0; }
#title .snd small b { font-weight: 600; color: #f0c880; }
#title .snd input[type=range] { width: 46%; height: 40px; accent-color: #e0a84a; flex: none; }
`;

/**
 * @param {{ sim: any, slot: number, audio?: any, setPaused: (on: boolean) => void, openSlots: () => void, openParty: () => void, openCreate: () => void,
 *   openChronicle: (mode: string) => void, onOpen?: () => void, onPlay?: () => void }} o  onPlay: the title closes into play
 */
export function createTitle({ sim, slot, audio = null, setPaused, openSlots, openParty, openCreate, openChronicle, onOpen = () => {}, onPlay = () => {} }) {
  const style = document.createElement('style'); style.textContent = CSS; document.head.appendChild(style);
  const wrap = document.createElement('div'); wrap.id = 'titleWrap'; document.body.appendChild(wrap);
  swallow(wrap);
  let mode = 'title', panel = '';

  // Sound: the player's settings, applied as they change (audio/settings.js keeps them): the volume, then a slider for
  // each kind of sound (the owner: "instead of on or off for each effect add a volume slider", and one for the music)
  const SOUND_ROWS = [['music', 'Music', 'the Chronicle’s score, under the title'], ['ambient', 'Ambient sound', 'the creek, wind, rain, drips, birds and owls'],
    ['combat', 'Attacks and spells', 'blows, bows, spells, loot and level-ups'], ['steps', 'Footsteps', 'on grass, cobbles and stone'],
    ['voices', 'Foes arriving and falling', 'goblins’ screeches, the dead rising, death cries']];
  const slider = (k, label, what, v) => { const pct = Math.round(v * 100);
    return html`<label key=${k}><span>${label}<small>${what ? html`${what} · ` : ''}<b>${pct === 0 ? 'off' : `${pct} %`}</b></small></span>
      <input type="range" min="0" max="100" step="5" value=${pct} aria-label=${label} aria-valuetext=${pct === 0 ? 'off' : `${pct} percent`}
        onInput=${(e) => { audio.set({ [k]: +e.currentTarget.value / 100 }); draw(); }} /></label>`; };
  function Sound() {
    const st = audio.settings;
    return html`<div id="title">
      <div class="mark" style="font-size:32px">SOUND</div>
      <div class="snd">
        ${slider('volume', 'Volume', '', st.volume)}
        ${SOUND_ROWS.map(([k, label, what]) => slider(k, label, what, st[k]))}
      </div>
      <button class="pri" onClick=${() => { panel = ''; draw(); }}>Back</button>
    </div>`;
  }

  function Title() {
    if (panel === 'sound' && audio) return html`<${Sound} />`;
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
      ${audio && html`<button onClick=${() => { panel = 'sound'; draw(); }}>Sound<small>volume · music · ambient · attacks and spells · footsteps · foes</small></button>`}
      <button onClick=${copyReport}>${copied || 'Copy debug report'}<small>stats, state and quests, for a bug report</small></button>
    </div>`;
  }
  const draw = () => render(html`<${Title} />`, wrap);
  // the report to the clipboard; the label says how it went (a HUD toast would sit under this menu)
  let copied = '';
  async function copyReport() {
    const text = debugReport(sim, { slot, when: new Date().toISOString(), ua: navigator.userAgent, view: `${innerWidth}×${innerHeight} @${devicePixelRatio}x` });
    let ok;
    try { await navigator.clipboard.writeText(text); ok = true; } catch {
      const ta = document.createElement('textarea'); ta.value = text; ta.setAttribute('readonly', ''); ta.style.cssText = 'position:fixed;left:-9999px;top:0';
      document.body.appendChild(ta); ta.select(); try { ok = document.execCommand('copy'); } catch { ok = false; } ta.remove();
    }
    copied = ok ? `Copied ✓ (${Math.round(text.length / 1024)} KB)` : 'Copy failed: no clipboard here'; draw();
    setTimeout(() => { copied = ''; if (wrap.classList.contains('on')) draw(); }, 2500);
  }
  function open(m = 'title') { mode = m; panel = ''; onOpen(); wrap.classList.add('on'); setPaused(true); draw(); }
  function hide() { wrap.classList.remove('on'); render(null, wrap); }
  function close() { hide(); setPaused(false); onPlay(); }
  const btn = document.getElementById('menuBtn');
  if (btn) { btn.setAttribute('aria-label', 'Menu'); btn.addEventListener('click', () => open('pause')); swallow(btn); }
  return { open, close, get isOpen() { return wrap.classList.contains('on'); } };
}
