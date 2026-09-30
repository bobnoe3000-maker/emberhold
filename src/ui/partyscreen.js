// @ts-check
// partyscreen.js — the Party screen (development plan §2.3): the three hero slots — your main
// character and two companions — and the bench of everyone else you've recruited, who wait
// at the inn and earn half XP. Opened from the Title / pause menu and from the inn.
//
// Slot 1 (you) opens your character window. A companion slot can be Swapped for someone on
// the bench, or Dismissed to it; a bench member can be Released (asks twice). Swaps and
// dismissals happen in towns — the sim refuses them elsewhere and the screen says why.
// Preact + htm with keyed rows, so the live HP ticks never rebuild a button under a finger.

import { html, render } from 'htm/preact';
import { useEffect, useRef, useState } from 'preact/hooks';
import { CLASSES, statsFor } from '../sim/party.js';
import { pendingPoints } from '../sim/attributes.js';
import { pendingSkillPoints } from '../sim/skills.js';
import { FOUND } from '../sim/heroes.js';
import { drawPortrait, swallow, PORTRAIT_W, PORTRAIT_H } from './actorart.js';

const CSS = `
#pscrWrap { position: fixed; inset: 0; z-index: 10; background: rgba(6,4,10,.62); display: none; }
#pscrWrap.on { display: block; }
#pscr { position: absolute; left: 0; right: 0; bottom: 0; max-height: 88vh; overflow-y: auto; max-width: 480px; margin: 0 auto; background: rgba(16,12,22,.98);
  border-top: 1px solid rgba(214,170,98,.45); border-radius: 16px 16px 0 0; padding: 14px 14px calc(env(safe-area-inset-bottom, 0px) + 16px); font-family: ui-monospace, Menlo, monospace; color: #efe4cf; }
#pscr h2 { font: 600 19px Georgia, serif; color: #f0c880; margin: 2px 0 2px; }
#pscr .sub { font-size: 10.5px; color: #978c80; margin-bottom: 12px; line-height: 1.45; }
#pscr .x { position: absolute; right: 12px; top: 12px; width: 36px; height: 36px; border-radius: 18px; border: 1px solid rgba(214,170,98,.45); color: #d8a040; background: none; font-size: 14px; }
#pscr h3 { font-size: 10px; letter-spacing: 2px; color: #a08a6a; text-transform: uppercase; margin: 14px 2px 8px; }
.pslot { display: flex; gap: 11px; align-items: center; padding: 10px; margin-bottom: 9px; border: 1px solid #2c2838; border-radius: 10px; background: rgba(255,255,255,.02); min-height: 72px; }
.pslot.main { border-color: rgba(214,170,98,.6); }
.pslot.fallen { background: rgba(120,140,170,.06); border-color: #4a5468; }
.pslot canvas { width: 44px; height: 52px; flex: none; background: #0c0a12; border: 1px solid #2c2838; }
.pslot.fallen canvas { filter: grayscale(1) brightness(.8); opacity: .7; }
.pslot .n { width: 22px; flex: none; text-align: center; font-size: 11px; color: #978c80; }
.pslot .tx { flex: 1; min-width: 0; }
.pslot b { display: block; font: 600 15px Georgia, serif; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.pslot span { display: block; font-size: 10.5px; color: #978c80; margin-top: 3px; line-height: 1.45; }
.pslot .tag { display: inline-block; font-size: 9px; letter-spacing: 1px; border-radius: 3px; padding: 1px 5px; margin-left: 6px; vertical-align: 2px; font-weight: 700; }
.pslot .tag.f { color: #0e1420; background: #b8c4d8; } .pslot .tag.w { color: #2a1206; background: #e0a060; } .pslot .tag.p { color: #10200c; background: #8fe07a; }
.pslot .acts { display: flex; flex-direction: column; gap: 6px; flex: none; }
.pslot button { min-width: 84px; min-height: 40px; border-radius: 8px; font: 11px ui-monospace, Menlo, monospace; letter-spacing: 1px; text-transform: uppercase; border: 1px solid rgba(214,170,98,.45); color: #f0c880; background: none; }
.pslot button.pri { background: linear-gradient(#e0a84a, #b67c2a); color: #1a1208; font-weight: 700; border-color: #f0c880; }
.pslot button.del { color: #ff8a7a; border-color: rgba(255,122,102,.4); } .pslot button.del.arm { background: #5a1c16; color: #ffd0c8; }
.pslot.empty { border-style: dashed; color: #6f6880; font-size: 11px; justify-content: center; }
#pscr .note { font-size: 11px; color: #ff8a7a; margin: 4px 2px 8px; min-height: 14px; }
`;

function Portrait({ actor }) {
  const cv = useRef(/** @type {HTMLCanvasElement|null} */ (null));
  useEffect(() => { if (cv.current) drawPortrait(cv.current, actor); }, [actor]);
  return html`<canvas ref=${cv} width=${PORTRAIT_W} height=${PORTRAIT_H}></canvas>`;
}
const actorOf = (m) => m.actor || CLASSES[m.cls].actor;
function line(m) {
  const s = statsFor(m), C = CLASSES[m.cls] || CLASSES.fighter;
  return `${C.label} · level ${m.level} · ${m.fallen ? 'Fallen' : `HP ${Math.max(0, Math.round(m.hp))}/${s.maxHp}`} · ATK ${s.atk} · DEF ${s.def}`;
}
function Tags({ m }) {
  const pts = pendingPoints(m) + pendingSkillPoints(m);
  return html`${m.fallen ? html`<em class="tag f">FALLEN</em>` : ''}${m.weakUntil > 0 ? html`<em class="tag w">WEAKENED</em>` : ''}${pts ? html`<em class="tag p">+${pts}</em>` : ''}`;
}

function Member({ m, i, slot, bench, onSheet, send }) {
  const [arm, setArm] = useState(false);
  useEffect(() => { if (!arm) return; const t = setTimeout(() => setArm(false), 3000); return () => clearTimeout(t); }, [arm]);
  const cls = 'pslot' + (m.main ? ' main' : '') + (m.fallen ? ' fallen' : '');
  return html`<div class=${cls}>${slot ? html`<div class="n">${slot}</div>` : ''}<${Portrait} actor=${actorOf(m)} />
    <div class="tx"><b>${m.name}<${Tags} m=${m} /></b><span>${line(m)}${m.trait ? html`<br />${m.trait[0]} · ${m.trait[1]}` : ''}</span></div>
    <div class="acts">
      ${!bench ? html`<button class="pri" onClick=${() => onSheet(i)}>Details</button>` : ''}
      ${!bench && !m.main ? html`<button onClick=${() => send({ type: 'dismiss', id: m.id })}>To bench</button>` : ''}
      ${bench ? bench.map((t) => html`<button key=${t.slot} class="pri" onClick=${() => send({ type: 'swap', slot: t.slot, id: m.id })}>${t.label}</button>`) : ''}
      ${bench && !FOUND[m.id] ? html`<button class=${'del' + (arm ? ' arm' : '')} onClick=${() => (arm ? send({ type: 'release', id: m.id }) : setArm(true))}>${arm ? 'Sure?' : 'Release'}</button>` : ''}
    </div></div>`;
}

function PartyScreen({ sim, onClose, onSheet, note, send }) {
  const S = sim.state, [you, a, b] = S.party;
  // where a bench member can go: the first empty companion slot, or either companion's place
  const bench = S.party.length < 3 ? [{ slot: S.party.length, label: 'Join' }] : [{ slot: 1, label: `↔ ${a.name}` }, { slot: 2, label: `↔ ${b.name}` }];
  const inTown = sim.world.kind === 'town';
  return html`<div id="pscr">
    <button class="x" onClick=${onClose}>✕</button>
    <h2>Party</h2>
    <div class="sub">You and two companions take the road. Everyone else waits on the bench at the inn and earns half XP.${inTown ? '' : ' Swaps happen in town.'}</div>
    <div class="note">${note}</div>
    <${Member} key=${you.id} m=${you} i=${0} slot=${1} onSheet=${onSheet} send=${send} />
    ${a ? html`<${Member} key=${a.id} m=${a} i=${1} slot=${2} onSheet=${onSheet} send=${send} />` : html`<div class="pslot empty">slot 2 · hire at a tavern, or bring someone from the bench</div>`}
    ${b ? html`<${Member} key=${b.id} m=${b} i=${2} slot=${3} onSheet=${onSheet} send=${send} />` : html`<div class="pslot empty">slot 3 · hire at a tavern, or bring someone from the bench</div>`}
    <h3>The bench · ${S.bench.length}</h3>
    ${S.bench.length ? S.bench.map((m) => html`<${Member} key=${m.id} m=${m} bench=${bench} onSheet=${onSheet} send=${send} />`)
      : html`<div class="sub">Nobody yet. Hire when your party is full and they wait here.</div>`}
  </div>`;
}

/** @param {{ sim: any, openSheet: (i: number) => void }} o */
export function createPartyScreen({ sim, openSheet }) {
  const style = document.createElement('style'); style.textContent = CSS; document.head.appendChild(style);
  const wrap = document.createElement('div'); wrap.id = 'pscrWrap'; document.body.appendChild(wrap);
  swallow(wrap);
  let note = '';
  const isOpen = () => wrap.classList.contains('on');
  const send = (cmd) => { note = ''; sim.commands.push(cmd); };
  const draw = () => { if (isOpen()) render(html`<${PartyScreen} sim=${sim} note=${note} send=${send} onClose=${close} onSheet=${(i) => { close(); openSheet(i); }} />`, wrap); };
  function open() { note = ''; wrap.classList.add('on'); draw(); }
  function close() { wrap.classList.remove('on'); render(null, wrap); }
  wrap.addEventListener('click', (e) => { if (e.target === wrap) close(); });
  sim.bus.on('partyChanged', draw);
  sim.bus.on('refused', (r) => { if (!isOpen()) return; note = r.reason; draw(); });
  let sig = '';
  setInterval(() => { if (!isOpen()) return; const n = sim.state.party.map((m) => `${Math.round(m.hp)}|${m.level}|${m.fallen ? 1 : 0}`).join(','); if (n !== sig) { sig = n; draw(); } }, 300);
  return { open, close, get isOpen() { return isOpen(); } };
}
