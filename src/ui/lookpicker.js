// @ts-check
// lookpicker.js — choosing a character's look (GDD §6.1 v1.65): a row a part (build, height, skin, face, hair and its
// colour, eyes and theirs, brows, nose, mouth, ears, beard) with ‹ and › through its choices, the marks as toggles (two at
// most), and a Random face. Every choice is the sim's own (sim/appearance.js PARTS), every word content/looks.json's.
// Used by creation (create.js) and the temple (townmenu.js); it only hands the look up (onChange), the screens send it
// in a command, and the sim checks it.

import { html } from 'htm/preact';
import { useEffect, useRef, useState } from 'preact/hooks';
import { drawFigure } from './actorart.js';
import { openPreview } from '../render3d/preview.js';
import { PARTS, MARKS, MARKS_MAX, drawAppearance } from '../sim/appearance.js';

export const LOOK_CSS = `
.lookp { display: flex; flex-direction: column; gap: 6px; }
.lookp .lrow { display: flex; align-items: center; gap: 6px; padding: 2px 4px 2px 10px; border-radius: 10px; border: 1px solid #2c2838; background: rgba(255,255,255,.025); min-height: 46px; }
.lookp .lrow small { flex: 0 0 92px; font: 10.5px ui-monospace, Menlo, monospace; letter-spacing: 1px; color: #978c80; text-transform: uppercase; }
.lookp .lrow b { flex: 1; text-align: center; font: 600 15px Georgia, serif; color: #efe4cf; }
.lookp .lrow button { flex: none; width: 44px; height: 44px; border-radius: 9px; border: 1px solid #3a3346; background: none; color: #f0c880; font: 18px Georgia, serif; }
.lookp .marks { display: flex; flex-wrap: wrap; gap: 6px; padding: 4px 0 2px; }
.lookp .marks button { min-height: 40px; padding: 0 12px; border-radius: 20px; border: 1px solid #3a3346; background: none; color: #d8ccb8; font: 13px Georgia, serif; }
.lookp .marks button.on { border-color: #d8a040; background: rgba(216,160,64,.12); color: #f0c880; }
.lookp .rand { min-height: 44px; border-radius: 10px; border: 1px dashed rgba(214,170,98,.5); background: none; color: #f0c880; font: 12px ui-monospace, Menlo, monospace; letter-spacing: 1px; }
`;
/** a look to start from: drawn at random, as a sellsword's are (the screen's chance, not the sim's: it's only offered) */
export const anyLook = () => drawAppearance(Math.floor(Math.random() * 2 ** 31), 'look:' + Math.floor(Math.random() * 1e9));

/** @param {{ words: any, value: any, onChange: (a: any) => void }} p */
export function LookPicker({ words, value, onChange }) {
  const W = words || { order: Object.keys(PARTS).concat('marks'), parts: {}, marks: { names: {} } };
  const name = (k, v) => W.parts?.[k]?.names?.[String(v)] || String(v);
  const step = (k, d) => { const list = PARTS[k], i = list.indexOf(value[k]); onChange({ ...value, [k]: list[(i + d + list.length) % list.length] }); };
  const toggle = (m) => {
    const has = value.marks.includes(m);
    let next = has ? value.marks.filter((x) => x !== m) : [...value.marks, m];
    if (next.length > MARKS_MAX) next = next.slice(next.length - MARKS_MAX);       // (two at most: the oldest let go)
    onChange({ ...value, marks: next });
  };
  return html`<div class="lookp">
    ${W.order.filter((k) => PARTS[k]).map((k) => html`<div key=${k} class="lrow"><small>${W.parts?.[k]?.label || k}</small>
      <button aria-label=${`previous ${W.parts?.[k]?.label || k}`} onClick=${() => step(k, -1)}>‹</button><b>${name(k, value[k])}</b>
      <button aria-label=${`next ${W.parts?.[k]?.label || k}`} onClick=${() => step(k, 1)}>›</button></div>`)}
    <div class="lrow" style="flex-wrap:wrap"><small>${W.marks?.label || 'Marks'}</small>
      <div class="marks">${MARKS.map((m) => html`<button key=${m} class=${value.marks.includes(m) ? 'on' : ''} aria-pressed=${value.marks.includes(m)} onClick=${() => toggle(m)}>${W.marks?.names?.[m] || m}</button>`)}</div></div>
    <button class="rand" onClick=${() => onChange(anyLook())}>⚄ A face at random</button>
  </div>`;
}

// The figure as the model you'll play (render3d/preview.js, Luminati's own builder), wearing the look as it's chosen: the
// atlas's still under it until the model stands, and wherever one can't be had (no WebGL, ?world=off, ?figures=sprites).
// A new look is built while the last one stands, then swapped, so a ‹ › never blanks it. A drag turns them, a tap swings.
/** @param {{ actor: string, appearance?: any, models: boolean, bare?: boolean }} p  bare: the helm off (a face being chosen) */
export function FigurePreview({ actor, appearance = null, models, bare = false }) {
  const cv = useRef(/** @type {HTMLCanvasElement|null} */ (null)), gl = useRef(/** @type {HTMLCanvasElement|null} */ (null));
  const pv = useRef(/** @type {any} */ (null)), [live, setLive] = useState(false), want = useRef(0);
  const show = () => { const p = pv.current; if (!p) return; const n = ++want.current; p.show(actor, appearance, { bare }).then((ok) => { if (n === want.current) setLive(ok); }); };
  useEffect(() => { if (cv.current) drawFigure(cv.current, actor); }, [actor]);
  useEffect(() => {
    if (!models || !gl.current) return undefined;
    let gone = false;
    openPreview(gl.current, (e) => { console.warn('[look] the preview:', e); if (!gone) setLive(false); }).then((p) => { if (gone) { p?.close(); return; } pv.current = p; show(); });
    return () => { gone = true; pv.current?.close(); pv.current = null; };
  }, [models]);
  useEffect(() => { const t = setTimeout(show, 120); return () => clearTimeout(t); }, [actor, JSON.stringify(appearance), bare]);   // (a quick run of ‹ › builds the last)
  return html`<canvas ref=${cv} width="88" height="102" style=${live ? 'visibility:hidden' : ''}></canvas>
    ${models ? html`<canvas ref=${gl} class="gl" style=${live ? '' : 'visibility:hidden'} aria-label="your hero: drag to turn, tap to swing"></canvas>` : ''}`;
}
