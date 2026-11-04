// @ts-check
// brightness.js — the Brightness tray (the owner, 2026-11-04: "In game add a setting for me to dial in brightness for day,
// dusk, dawn and night so i can better test and confirm settings"). Opened from the menu's Graphics, it sits along the
// bottom with the world in view above it:
//   · a tab a part of the day (Dawn, Day, Dusk, Night). The chosen one holds the light at that part's middle while the tray
//     is open (as the title holds dusk; main.js previewPart), so each part is seen as it's set; the sim's clock runs on;
//   · − and + step that part's brightness by 5 % (25–300 %, 100 the shipped look), applied at once and kept per device
//     (render3d/settings.js `bright`);
//   · the numbers: each part's percentage, and the multiply it comes to in this scene (render3d/bright.js), to read off and
//     pass on, so the shipped look can be set to match.
// The dial is the Luminati renderer's, outdoors (the per-hour tune is its own; Emberlit keeps its looks). Presentation
// only: nothing here reaches the sim or a save. Swallows its own touches, so the world doesn't take them.

import { html, render } from 'htm/preact';
import { swallow } from './actorart.js';
import { PARTS, brightFor } from '../render3d/bright.js';
import { BRIGHT_MIN, BRIGHT_MAX, BRIGHT_STEP } from '../render3d/settings.js';

const CSS = `
#brightWrap { position: fixed; left: 0; right: 0; bottom: 0; z-index: 12; display: none; }
#brightWrap.on { display: block; }
#bright { max-width: 480px; margin: 0 auto; padding: 12px 14px calc(env(safe-area-inset-bottom, 0px) + 12px); border-radius: 14px 14px 0 0;
  background: rgba(12,9,18,.98); border: 1px solid rgba(214,170,98,.45); border-bottom: none; font-family: Georgia, 'Times New Roman', serif; color: #efe4cf; }
#bright .hd { display: flex; justify-content: space-between; align-items: baseline; margin: 0 2px 10px; }
#bright .hd b { font: 400 17px 'IM Fell English SC', Georgia, serif; letter-spacing: 3px; color: #f0c880; }
#bright .hd span { font: 11px ui-monospace, Menlo, monospace; color: #b8aca0; }
#bright .row { display: flex; gap: 8px; margin-bottom: 10px; }
#bright button { flex: 1; min-height: 46px; border-radius: 10px; font: 600 15px Georgia, serif; border: 1px solid rgba(214,170,98,.5); color: #f0c880; background: rgba(16,12,22,.85); }
#bright button.on { background: linear-gradient(#e0a84a, #b67c2a); color: #1a1208; border-color: #f0c880; }
#bright button.step { flex: 0 0 64px; font-size: 26px; line-height: 1; }
#bright button:disabled { color: #6f6880; border-color: #3a3346; }
#bright .val { flex: 1; display: flex; flex-direction: column; justify-content: center; align-items: center; min-height: 46px; }
#bright .val b { font: 600 22px Georgia, serif; color: #f6ecd6; }
#bright .val small, #bright .sum { font: 11px ui-monospace, Menlo, monospace; color: #c8baa2; letter-spacing: .3px; }
#bright .sum { text-align: center; margin: 0 0 10px; line-height: 1.5; }
#bright .note { font: italic 13px Georgia, serif; color: #e0c090; text-align: center; margin: 0 0 10px; }
`;
const NAME = { dawn: 'Dawn', day: 'Day', dusk: 'Dusk', night: 'Night' };

/**
 * @param {{ sim: any, graphics: { read: () => any, set: (patch: any) => Promise<any>, current: () => string }, onHold: (part: string | null) => void }} o
 *   onHold: the part whose light to hold while the tray is open (null: back to the clock)
 */
export function createBrightness({ sim, graphics, onHold }) {
  const style = document.createElement('style'); style.textContent = CSS; document.head.appendChild(style);
  const wrap = document.createElement('div'); wrap.id = 'brightWrap'; document.body.appendChild(wrap);
  swallow(wrap);
  let open = false, part = 'day';
  const close = () => { open = false; wrap.classList.remove('on'); onHold(null); render(null, wrap); };
  const pick = (p) => { part = p; onHold(p); draw(); };
  const step = async (d) => {
    const b = graphics.read().bright, v = Math.min(BRIGHT_MAX, Math.max(BRIGHT_MIN, b[part] + d * BRIGHT_STEP));
    await graphics.set({ bright: { [part]: v } }); draw();
  };
  const reset = async () => { await graphics.set({ bright: { dawn: 100, day: 100, dusk: 100, night: 100 } }); draw(); };
  function Tray() {
    const g = graphics.read(), b = g.bright, w = sim.world, lum = graphics.current() === 'luminati', outdoors = w.kind !== 'dungeon';
    const k = brightFor(w.region || 'vale', sim.state.scene, b), ship = brightFor(w.region || 'vale', sim.state.scene, null), i = PARTS.indexOf(/** @type {any} */ (part));
    const where = w.kind === 'dungeon' ? 'underground' : w.name || (sim.state.scene === 'town' ? 'the town' : 'the land');
    return html`<div id="bright">
      <div class="hd"><b>BRIGHTNESS</b><span>${where} · ${NAME[part].toLowerCase()} held</span></div>
      ${!lum ? html`<div class="note">The dial is the Luminati renderer’s: choose Luminati in Graphics to see it.</div>` : !outdoors ? html`<div class="note">The dial is for outdoors: the town and the land. Step outside to see it.</div>` : null}
      <div class="row" role="tablist">
        ${PARTS.map((p) => html`<button key=${p} role="tab" class=${p === part ? 'on' : ''} aria-selected=${p === part ? 'true' : 'false'} onClick=${() => pick(p)}>${NAME[p]}</button>`)}
      </div>
      <div class="row">
        <button class="step" aria-label=${`${NAME[part]} darker`} disabled=${b[part] <= BRIGHT_MIN} onClick=${() => step(-1)}>−</button>
        <div class="val" aria-live="polite"><b>${NAME[part]} ${b[part]} %</b><small>×${k[i].toFixed(2)} here · as shipped ×${ship[i].toFixed(2)}</small></div>
        <button class="step" aria-label=${`${NAME[part]} brighter`} disabled=${b[part] >= BRIGHT_MAX} onClick=${() => step(1)}>+</button>
      </div>
      <div class="sum">${PARTS.map((p) => `${NAME[p]} ${b[p]} %`).join(' · ')}</div>
      <div class="row">
        <button onClick=${reset}>Reset all<small style="display:block;font:10.5px ui-monospace,Menlo,monospace;opacity:.75">100 % · as shipped</small></button>
        <button class="on" onClick=${close}>Done</button>
      </div>
    </div>`;
  }
  function draw() { if (open) render(html`<${Tray} />`, wrap); }
  return {
    /** open the tray, holding the light at the part last chosen (day at first) */
    open() { open = true; wrap.classList.add('on'); onHold(part); draw(); },
    close,
    get isOpen() { return open; },
    /** (for checks) the part held */
    get part() { return part; },
  };
}
