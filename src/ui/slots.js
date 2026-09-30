// @ts-check
// slots.js — the Game Slots window: up to three games, each its own main character, party
// and world (GDD §6.1). The first Preact + htm window (architecture A3): keyed components,
// so nothing is rebuilt under the player's finger. Opened from the Title / pause menu
// (title.js, ☰ in the HUD).
//
// Switching or starting a slot saves the current one, sets the active slot and reloads —
// a whole-page reset is the simplest way to guarantee a clean sim, renderer and world.

import { siteOf } from '../sim/sites.js';
import { html, render } from 'htm/preact';
import { useEffect, useState } from 'preact/hooks';
import { CLASSES } from '../sim/party.js';
import { listSlots, deleteSlot, setActiveSlot } from '../persist/save.js';

const CSS = `
#slotsWrap { position: fixed; inset: 0; z-index: 12; background: rgba(6,4,10,.62); display: none; }
#slotsWrap.on { display: block; }
#slots { position: absolute; left: 0; right: 0; bottom: 0; max-width: 480px; margin: 0 auto; background: rgba(16,12,22,0.98); border-top: 1px solid rgba(214,170,98,0.45);
  border-radius: 16px 16px 0 0; padding: 14px 14px calc(env(safe-area-inset-bottom, 0px) + 16px); font-family: ui-monospace, Menlo, monospace; color: #efe4cf; }
#slots h2 { font: 600 19px Georgia, serif; color: #f0c880; margin: 2px 0 2px; }
#slots .sub { font-size: 10.5px; color: #978c80; letter-spacing: .5px; margin-bottom: 12px; }
#slots .x { position: absolute; right: 12px; top: 12px; width: 32px; height: 32px; border-radius: 16px; border: 1px solid rgba(214,170,98,0.45); color: #d8a040; background: none; font-size: 14px; }
.slot { display: flex; gap: 12px; align-items: center; padding: 11px 11px; margin-bottom: 9px; border: 1px solid #2c2838; border-radius: 10px; background: rgba(255,255,255,.02); min-height: 76px; }
.slot.on { border-color: #d8a040; background: rgba(216,160,64,.08); }
.slot .n { width: 26px; height: 26px; border-radius: 13px; flex: none; display: grid; place-items: center; font-size: 12px; font-weight: 700; color: #1a1208; background: #b8862e; }
.slot.empty .n { background: #3a3346; color: #978c80; }
.slot .tx { flex: 1; min-width: 0; }
.slot b { display: block; font: 600 15px Georgia, serif; color: #efe4cf; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.slot span { display: block; font-size: 10.5px; color: #978c80; margin-top: 3px; line-height: 1.45; }
.slot .tag { display: inline-block; font-size: 9px; letter-spacing: 1px; color: #1a1208; background: #d8a040; border-radius: 3px; padding: 1px 5px; margin-left: 6px; vertical-align: 2px; }
.slot .acts { display: flex; flex-direction: column; gap: 6px; flex: none; }
.slot button { min-width: 88px; min-height: 36px; border-radius: 8px; font: 11px ui-monospace, Menlo, monospace; letter-spacing: 1px; text-transform: uppercase; border: 1px solid rgba(214,170,98,0.45); color: #f0c880; background: none; }
.slot button.pri { background: linear-gradient(#e0a84a, #b67c2a); color: #1a1208; font-weight: 700; border-color: #f0c880; }
.slot button.del { color: #ff8a7a; border-color: rgba(255,122,102,0.4); }
.slot button.del.arm { background: #5a1c16; color: #ffd0c8; }
`;

const where = (m) => (m.scene === 'dungeon' ? `${siteOf(m.site).name.replace(/^The /, '')} · depth ${m.depth + 1}` : m.scene === 'overland' ? 'The Hollow Vale' : 'Thornwick');
const hours = (s) => (s < 3600 ? `${Math.max(1, Math.round(s / 60))} min` : `${(s / 3600).toFixed(1)} h`);
const ago = (t) => { const d = (Date.now() - t) / 1000; return d < 90 ? 'just now' : d < 5400 ? `${Math.round(d / 60)} min ago` : d < 172800 ? `${Math.round(d / 3600)} h ago` : `${Math.round(d / 86400)} days ago`; };

function Slot({ i, meta, active, onPlay, onDelete }) {
  const [arm, setArm] = useState(false);
  useEffect(() => { if (!arm) return; const t = setTimeout(() => setArm(false), 3000); return () => clearTimeout(t); }, [arm]);
  if (!meta) return html`<div class="slot empty"><div class="n">${i}</div>
    <div class="tx"><b style="color:#978c80">Empty slot</b><span>A new hero, a new party, a fresh Emberfall.</span></div>
    <div class="acts"><button class="pri" onClick=${() => onPlay(i)}>New game</button></div></div>`;
  const cls = (CLASSES[meta.cls] || CLASSES.fighter).label;
  return html`<div class=${'slot' + (active ? ' on' : '')}><div class="n">${i}</div>
    <div class="tx"><b>${meta.name}${active ? html`<em class="tag">PLAYING</em>` : ''}</b>
      <span>${cls} · level ${meta.level} · party of ${meta.party}<br />${where(meta)} · ${hours(meta.playtime)} played · ${ago(meta.savedAt)}</span></div>
    <div class="acts">${active ? '' : html`<button class="pri" onClick=${() => onPlay(i)}>Play</button>`}
      ${active ? '' : html`<button class=${'del' + (arm ? ' arm' : '')} onClick=${() => (arm ? onDelete(i) : setArm(true))}>${arm ? 'Sure?' : 'Delete'}</button>`}</div></div>`;
}

function SlotsWindow({ active, onClose, onPlay }) {
  const [metas, setMetas] = useState(/** @type {any[]|null} */ (null));
  const refresh = () => listSlots().then(setMetas);
  useEffect(() => { refresh(); }, []);
  return html`<div id="slots" onPointerDown=${(e) => e.stopPropagation()}>
    <button class="x" onClick=${onClose}>✕</button>
    <h2>Game slots</h2>
    <div class="sub">Each slot is its own hero, party and world. Progress saves automatically.</div>
    ${metas ? metas.map((m, k) => html`<${Slot} key=${k + 1} i=${k + 1} meta=${m} active=${k + 1 === active}
      onPlay=${onPlay} onDelete=${(i) => deleteSlot(i).then(refresh)} />`) : html`<div class="sub">Reading saves…</div>`}
  </div>`;
}

/** @param {{ active: number, saveNow: () => Promise<any> }} opts */
export function createSlotsWindow({ active, saveNow }) {
  const style = document.createElement('style'); style.textContent = CSS; document.head.appendChild(style);
  const wrap = document.createElement('div'); wrap.id = 'slotsWrap'; document.body.appendChild(wrap);
  for (const ev of ['pointerdown', 'touchstart', 'mousedown']) wrap.addEventListener(ev, (e) => e.stopPropagation());
  const close = () => { wrap.classList.remove('on'); render(null, wrap); };
  const play = async (/** @type {number} */ i) => { await saveNow(); setActiveSlot(i); location.replace(location.pathname + (location.search.includes('dev') ? '?dev' : '')); };
  const open = () => { wrap.classList.add('on'); render(html`<${SlotsWindow} active=${active} onClose=${close} onPlay=${play} />`, wrap); };
  wrap.addEventListener('click', (e) => { if (e.target === wrap) close(); });
  return { open, close };
}
