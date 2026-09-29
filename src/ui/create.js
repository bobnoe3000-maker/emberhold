// @ts-check
// create.js — character creation (development plan §2.3, GDD §6.1): one screen, a live figure
// preview on top and the steps in a bottom sheet — Class → Look → Origin → Name → Begin.
// Class blurbs, locked classes and name suggestions are content (content/creation.json);
// origins are content/origins.json. Numbers come from the sim's own tables, so what the card
// says is what you get.
//
// Begin sends one command, createHero; the sim validates it (class, look, origin, a cleaned
// name) and answers with 'heroCreated' or 'refused'. Nothing here writes game state.

import { html, render } from 'htm/preact';
import { useEffect, useRef, useState } from 'preact/hooks';
import { CLASSES, LOOKS, LOOK_LABEL, NAME_MAX, cleanName, makeMember, statsFor } from '../sim/party.js';
import { SKILLS, PASSIVES } from '../sim/skills.js';
import { drawFigure, swallow } from './actorart.js';

const CSS = `
#createWrap { position: fixed; inset: 0; z-index: 11; display: none; background: #0b0910; }
#createWrap.on { display: block; }
#create { position: absolute; inset: 0; max-width: 480px; margin: 0 auto; display: flex; flex-direction: column; font-family: ui-monospace, Menlo, monospace; color: #efe4cf; }
#create .stage { position: relative; flex: 0 0 34%; min-height: 170px; background: radial-gradient(ellipse at 50% 88%, rgba(216,160,64,.28), rgba(0,0,0,0) 55%), radial-gradient(ellipse at 50% 40%, #1d1726, #0b0910 72%); }
#create .stage canvas { position: absolute; left: 50%; bottom: 6px; height: 92%; aspect-ratio: 88 / 102; transform: translateX(-50%); image-rendering: pixelated; }
#create .stage .cap { position: absolute; left: 14px; top: calc(env(safe-area-inset-top, 0px) + 12px); font: 600 12px Georgia, serif; letter-spacing: 3px; color: #a08a6a; text-transform: uppercase; }
#create .sheet { flex: 1; min-height: 0; display: flex; flex-direction: column; background: rgba(16,12,22,.98); border-top: 1px solid rgba(214,170,98,.45); border-radius: 16px 16px 0 0; margin-top: -14px; position: relative; }
#create .dots { display: flex; justify-content: center; gap: 6px; padding: 10px 0 2px; }
#create .dots i { width: 22px; height: 3px; border-radius: 2px; background: #3a3346; } #create .dots i.on { background: #d8a040; }
#create h2 { font: 600 20px Georgia, serif; color: #f0c880; margin: 6px 16px 2px; }
#create .sub { font-size: 11px; color: #978c80; margin: 0 16px 8px; line-height: 1.4; }
#create .body { flex: 1; min-height: 0; overflow-y: auto; padding: 2px 14px 8px; }
#create .opt { display: block; width: 100%; text-align: left; margin-bottom: 8px; padding: 11px 12px; border-radius: 10px; border: 1px solid #2c2838; background: rgba(255,255,255,.025); color: #efe4cf; font: inherit; min-height: 48px; }
#create .opt.on { border-color: #d8a040; background: rgba(216,160,64,.10); box-shadow: inset 0 0 0 1px rgba(216,160,64,.35); }
#create .opt:disabled { opacity: .5; }
#create .opt b { font: 600 16px Georgia, serif; } #create .opt .r { float: right; font-size: 10px; color: #c09a50; letter-spacing: 1px; text-transform: uppercase; margin-top: 3px; }
#create .opt p { font-size: 11.5px; color: #c8bca8; margin-top: 4px; line-height: 1.4; font-family: Georgia, serif; }
#create .opt .st { font-size: 10.5px; color: #978c80; margin-top: 6px; letter-spacing: .5px; line-height: 1.5; }
#create .opt .st b { font: 600 10.5px ui-monospace, Menlo, monospace; color: #efe4cf; }
#create .opt .edge { font-size: 11px; color: #8fe07a; margin-top: 5px; }
#create input { width: 100%; font: 600 20px Georgia, serif; color: #efe4cf; background: #120e18; border: 1px solid rgba(214,170,98,.5); border-radius: 10px; padding: 12px; min-height: 50px; }
#create .names { display: flex; flex-wrap: wrap; gap: 7px; margin-top: 12px; }
#create .names button { min-height: 40px; padding: 0 13px; border-radius: 20px; border: 1px solid #3a3346; background: none; color: #d8ccb8; font: 14px Georgia, serif; }
#create .dice { margin-top: 10px; min-height: 44px; width: 100%; border-radius: 10px; border: 1px dashed rgba(214,170,98,.5); background: none; color: #f0c880; font: 12px ui-monospace, Menlo, monospace; letter-spacing: 1px; }
#create .err { color: #ff8a7a; font-size: 11.5px; margin-top: 8px; }
#create .nav { display: flex; gap: 10px; padding: 10px 14px calc(env(safe-area-inset-bottom, 0px) + 14px); border-top: 1px solid #221c2c; }
#create .nav button { flex: 1; min-height: 50px; border-radius: 10px; font: 600 15px Georgia, serif; border: 1px solid rgba(214,170,98,.5); background: none; color: #f0c880; }
#create .nav button.pri { flex: 2; background: linear-gradient(#e0a84a, #b67c2a); color: #1a1208; border-color: #f0c880; }
#create .nav button:disabled { opacity: .45; }
#create .sum { padding: 12px; border: 1px solid rgba(214,170,98,.45); border-radius: 12px; background: rgba(216,160,64,.06); font-size: 12px; line-height: 1.7; color: #c8bca8; }
#create .sum b { font: 600 22px Georgia, serif; color: #f0c880; display: block; margin-bottom: 2px; }
`;
const STEPS = ['class', 'look', 'origin', 'name', 'begin'];
const TITLES = { class: ['Class', 'How you fight. Companions fill the other roles.'], look: ['Look', 'How you look on the road. More looks come later.'],
  origin: ['Origin', 'Where you come from. People will remember it, and it gives you a small edge.'], name: ['Name', 'Short and plain wears best in Emberfall.'],
  begin: ['Ready', 'This hero is yours for this game slot.'] };

function Preview({ look }) {
  const cv = useRef(/** @type {HTMLCanvasElement|null} */ (null));
  useEffect(() => { if (cv.current) drawFigure(cv.current, look); }, [look]);
  return html`<canvas ref=${cv} width="88" height="102"></canvas>`;
}

function Create({ data, onBegin, error }) {
  const [step, setStep] = useState(0), [cls, setCls] = useState('fighter'), [look, setLook] = useState(LOOKS.fighter[0]);
  const [origin, setOrigin] = useState(data.origins[0].id), [name, setName] = useState('');
  const k = STEPS[step], clean = cleanName(name), O = data.origins.find((o) => o.id === origin);
  const pickCls = (c) => { setCls(c); setLook(LOOKS[c][0]); };
  const dice = () => { const list = data.creation.names[origin] || []; let n = name; for (let i = 0; i < 6 && n === name; i++) n = list[Math.floor(Math.random() * list.length)]; setName(n); };
  const canNext = k !== 'name' || !!clean;
  let body;
  if (k === 'class') body = html`${Object.keys(CLASSES).map((c) => {
    const C = CLASSES[c], blurb = data.creation.classes.find((q) => q.id === c) || {}, s = statsFor(makeMember('p', 'p', c));
    return html`<button key=${c} class=${'opt' + (c === cls ? ' on' : '')} onClick=${() => pickCls(c)}>
      <b>${C.label}</b><span class="r">${blurb.difficulty}</span><p>${blurb.role}</p>
      <div class="st">HP <b>${s.maxHp}</b> · MP <b>${s.maxMp}</b> · ATK <b>${s.atk}</b> · DEF <b>${s.def}</b> · CRIT <b>${s.crit}%</b> · DODGE <b>${s.dodge}%</b><br />
        ${SKILLS[c].map((a) => `${a.name} (${a.lv})`).join(' · ')} · ${PASSIVES[c].name} (${PASSIVES[c].lv})</div></button>`; })}
    ${data.creation.locked.map((l) => html`<button key=${l.id} class="opt" disabled><b>${l.name}</b><span class="r">locked</span><p>${l.hint}.</p></button>`)}`;
  else if (k === 'look') body = LOOKS[cls].map((l) => html`<button key=${l} class=${'opt' + (l === look ? ' on' : '')} onClick=${() => setLook(l)}><b>${LOOK_LABEL[l] || l}</b></button>`);
  else if (k === 'origin') body = data.origins.map((o) => html`<button key=${o.id} class=${'opt' + (o.id === origin ? ' on' : '')} onClick=${() => setOrigin(o.id)}>
      <b>${o.name}</b><p>${o.background}</p><div class="edge">${o.edge.text}</div></button>`);
  else if (k === 'name') body = html`<input value=${name} maxLength=${NAME_MAX} placeholder="Your name" autocomplete="off" autocapitalize="words" spellcheck=${false}
      onInput=${(e) => setName(e.currentTarget.value)} />
    ${name && clean !== name.trim() ? html`<div class="err">It will read: ${clean || '(nothing yet)'}</div>` : ''}
    <button class="dice" onClick=${dice}>⚄ Suggest a name</button>
    <div class="names">${(data.creation.names[origin] || []).map((n) => html`<button key=${n} onClick=${() => setName(n)}>${n}</button>`)}</div>`;
  else body = html`<div class="sum"><b>${clean}</b>${CLASSES[cls].label} · ${LOOK_LABEL[look] || look}<br />${O.name}: ${O.edge.text}<br /><i>${O.background}</i></div>
    ${error ? html`<div class="err">${error}</div>` : ''}`;
  return html`<div id="create"><div class="stage"><div class="cap">New hero</div><${Preview} look=${look} /></div>
    <div class="sheet"><div class="dots">${STEPS.map((s, i) => html`<i key=${s} class=${i <= step ? 'on' : ''}></i>`)}</div>
      <h2>${TITLES[k][0]}</h2><div class="sub">${TITLES[k][1]}</div>
      <div class="body">${body}</div>
      <div class="nav">${step > 0 ? html`<button onClick=${() => setStep(step - 1)}>Back</button>` : ''}
        ${k === 'begin'
          ? html`<button class="pri" onClick=${() => onBegin({ cls, look, origin, name: clean })}>Begin</button>`
          : html`<button class="pri" disabled=${!canNext} onClick=${() => setStep(step + 1)}>Next</button>`}</div></div></div>`;
}

/** @param {{ sim: any, onDone: () => void, onCancel?: () => void }} o */
export function createCreation({ sim, onDone }) {
  const style = document.createElement('style'); style.textContent = CSS; document.head.appendChild(style);
  const wrap = document.createElement('div'); wrap.id = 'createWrap'; document.body.appendChild(wrap);
  swallow(wrap);
  /** @type {any} */ let data = null, error = '';
  const load = () => data ? Promise.resolve(data) : Promise.all(['creation', 'origins'].map((f) => fetch(`./content/${f}.json`).then((r) => r.json())))
    .then(([creation, o]) => (data = { creation, origins: o.origins }));
  const draw = () => render(html`<${Create} data=${data} error=${error} onBegin=${begin} />`, wrap);
  function begin(pick) { error = ''; sim.commands.push({ type: 'createHero', ...pick }); }
  sim.bus.on('heroCreated', () => { if (!wrap.classList.contains('on')) return; wrap.classList.remove('on'); render(null, wrap); onDone(); });
  sim.bus.on('refused', (r) => { if (!wrap.classList.contains('on')) return; error = r.reason; draw(); });
  async function open() { wrap.classList.add('on'); await load(); draw(); }
  return { open, get isOpen() { return wrap.classList.contains('on'); } };
}
