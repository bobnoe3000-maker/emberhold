// @ts-check
// create.js — character creation (development plan §2.3, GDD §6.1 v1.64): one screen, a live figure
// preview on top and the steps in a bottom sheet — Class → Look → Born → Origin → Name → Begin.
// Class blurbs, locked classes and name suggestions are content (content/creation.json);
// origins are content/origins.json; a trait's name and line are the sellswords' (content/companions.json).
// Numbers come from the sim's own tables and its own roll (party.js rollHero, from the game's seed),
// so what the card says is what you get.
//
// Born: the roll, attributes and a trait together, re-rolled as often as you like; the screen only
// chooses which roll (its number), and Begin sends that number. Name: five suggestions at a time from
// the origin's list, and the sim's own name rule (names.js) said as you type.
//
// Begin sends one command, createHero; the sim validates it (class, look, origin, the roll, a cleaned
// name it will take) and answers with 'heroCreated' or 'refused'. Nothing here writes game state.

import { html, render } from 'htm/preact';
import { useState } from 'preact/hooks';
import { CLASSES, LOOKS, LOOK_LABEL, NAME_MAX, ROLL_MAX, cleanName, makeHero, rollHero, statsFor } from '../sim/party.js';
import { ATTRS, ATTR_LABEL } from '../sim/attributes.js';
import { PERKS } from '../sim/companions.js';
import { nameRefusal } from '../sim/names.js';
import { ladderOf } from '../sim/skills.js';
import { swallow } from './actorart.js';
import { LookPicker, FigurePreview, LOOK_CSS, anyLook } from './lookpicker.js';

const CSS = LOOK_CSS + `
#createWrap { position: fixed; inset: 0; z-index: 11; display: none; background: #0b0910; }
#createWrap.on { display: block; }
#create { position: absolute; inset: 0; max-width: 480px; margin: 0 auto; display: flex; flex-direction: column; font-family: ui-monospace, Menlo, monospace; color: #efe4cf; }
#create .stage { position: relative; flex: 0 0 24%; min-height: 136px; background: radial-gradient(ellipse at 50% 88%, rgba(216,160,64,.28), rgba(0,0,0,0) 55%), radial-gradient(ellipse at 50% 40%, #1d1726, #0b0910 72%); }
#create .stage canvas { position: absolute; left: 50%; bottom: 6px; height: 92%; aspect-ratio: 88 / 102; transform: translateX(-50%); image-rendering: pixelated; }
#create .stage canvas.gl { bottom: 0; height: 100%; width: 100%; aspect-ratio: auto; image-rendering: auto; touch-action: none; }
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
#create .roll { display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; }
#create .roll div { padding: 8px 6px; border-radius: 9px; border: 1px solid #2c2838; background: rgba(255,255,255,.025); text-align: center; }
#create .roll small { display: block; font-size: 10px; letter-spacing: 1px; color: #978c80; }
#create .roll b { font: 600 17px Georgia, serif; color: #efe4cf; }
#create .roll i { display: block; font: 10.5px ui-monospace, Menlo, monospace; font-style: normal; color: #978c80; min-height: 13px; }
#create .roll i.up { color: #8fe07a; } #create .roll i.dn { color: #ff9a8a; }
#create .born { margin: 10px 0 4px; font-size: 11.5px; color: #c8bca8; line-height: 1.6; }
#create .born b { color: #efe4cf; font-weight: 600; }
#create .trait { margin-top: 8px; padding: 10px 12px; border-radius: 10px; border: 1px solid rgba(214,170,98,.45); background: rgba(216,160,64,.06); }
#create .trait b { font: 600 15px Georgia, serif; color: #f0c880; } #create .trait span { float: right; font-size: 10px; letter-spacing: 1px; color: #c09a50; text-transform: uppercase; margin-top: 3px; }
#create .trait p { font: 12px Georgia, serif; color: #c8bca8; margin-top: 3px; }
#create .nav { display: flex; gap: 10px; padding: 10px 14px calc(env(safe-area-inset-bottom, 0px) + 14px); border-top: 1px solid #221c2c; }
#create .nav button { flex: 1; min-height: 50px; border-radius: 10px; font: 600 15px Georgia, serif; border: 1px solid rgba(214,170,98,.5); background: none; color: #f0c880; }
#create .nav button.pri { flex: 2; background: linear-gradient(#e0a84a, #b67c2a); color: #1a1208; border-color: #f0c880; }
#create .nav button:disabled { opacity: .45; }
#create .nav button.roll { flex: 2; border-style: dashed; font: 600 14px Georgia, serif; white-space: nowrap; padding: 0 6px; display: flex; align-items: center; justify-content: center; gap: 6px; }
#create .sum { padding: 12px; border: 1px solid rgba(214,170,98,.45); border-radius: 12px; background: rgba(216,160,64,.06); font-size: 12px; line-height: 1.7; color: #c8bca8; }
#create .sum b { font: 600 22px Georgia, serif; color: #f0c880; display: block; margin-bottom: 2px; }
`;
const STEPS = ['class', 'look', 'born', 'origin', 'name', 'begin'];
const TITLES = { class: ['Class', 'How you fight. Companions fill the other roles.'], look: ['Look', 'Your face and build, a part at a time. The temple can change it later, for a fee.'],
  born: ['Born', 'What you were born with: six points over the four, and a trait. Roll again as often as you like.'],
  origin: ['Origin', 'Where you come from. People will remember it, and it gives you a small edge.'], name: ['Name', 'Short and plain wears best in Emberfall.'],
  begin: ['Ready', 'This hero is yours for this game slot.'] };

// (the UI's own chance, not the sim's: which roll to show first and which names to suggest are the screen's choice;
// what a roll holds is the sim's, from the seed)
const anyRoll = () => Math.floor(Math.random() * ROLL_MAX);
/** five of the origin's names, not those shown now @param {string[]} list @param {string[]} [not] */
function fiveOf(list, not = []) {
  const pool = list.filter((n) => !not.includes(n)), out = [];
  while (out.length < 5 && pool.length) out.push(pool.splice(Math.floor(Math.random() * pool.length), 1)[0]);
  return out;
}
const perkName = (data, id) => data.words?.perks?.[id]?.name || id, perkText = (data, id) => data.words?.perks?.[id]?.text || '';
const STATS = [['maxHp', 'HP'], ['maxMp', 'MP'], ['atk', 'ATK'], ['def', 'DEF'], ['crit', 'CRIT', '%'], ['dodge', 'DODGE', '%']];

/** the roll: the numbers it makes against the class table, what it was born with, its trait */
function Roll({ data, cls, look, roll, n }) {
  const base = statsFor(makeHero({ cls, look })), s = statsFor(makeHero({ cls, look, ...roll }));
  const d = (k) => Math.round((s[k] - base[k]) * 10) / 10;
  return html`<div class="roll">${STATS.map(([k, label, u]) => { const v = d(k); return html`<div key=${k}><small>${label}</small><b>${s[k]}${u || ''}</b>
      <i class=${v > 0 ? 'up' : v < 0 ? 'dn' : ''}>${v > 0 ? `+${v}` : v < 0 ? `−${-v}` : '='}</i></div>`; })}</div>
    <div class="born">Born with: ${ATTRS.map((a, i) => html`<span key=${a}>${i ? ' · ' : ''}${ATTR_LABEL[a]} <b>${roll.born[a]}</b></span>`)}</div>
    ${roll.perks.map((p) => html`<div key=${p} class="trait"><b>${perkName(data, p)}</b><span>${PERKS[p]?.fam === 'quirk' ? 'quirk' : 'trait'}</span><p>${perkText(data, p)}</p></div>`)}
    <div class="sub" style="margin:8px 0 0">Roll ${n}. Under each number: against the class's own (= the same). Levels bring their points on top.</div>`;
}

function Create({ data, seed, models, onBegin, error }) {
  const [step, setStep] = useState(0), [cls, setCls] = useState('fighter'), [look, setLook] = useState(LOOKS.fighter[0]);
  const [origin, setOrigin] = useState(data.origins[0].id), [name, setName] = useState('');
  const [rollN, setRollN] = useState(anyRoll), [rolls, setRolls] = useState(1), [face, setFace] = useState(anyLook);
  const [shown, setShown] = useState(() => fiveOf(data.creation.names[data.origins[0].id] || []));
  const k = STEPS[step], clean = cleanName(name), O = data.origins.find((o) => o.id === origin), roll = rollHero(seed, cls, rollN);
  const refusal = clean ? nameRefusal(clean) : null;
  const pickCls = (c) => { setCls(c); setLook(LOOKS[c][0]); };
  const pickOrigin = (o) => { setOrigin(o); setShown(fiveOf(data.creation.names[o] || [])); };
  const reroll = () => { setRollN(anyRoll()); setRolls(rolls + 1); };
  const dice = () => setShown(fiveOf(data.creation.names[origin] || [], shown));
  const canNext = k !== 'name' || (!!clean && !refusal);
  let body;
  if (k === 'class') body = html`${Object.keys(CLASSES).map((c) => {
    const C = CLASSES[c], blurb = data.creation.classes.find((q) => q.id === c) || {}, s = statsFor(makeHero({ cls: c }));
    return html`<button key=${c} class=${'opt' + (c === cls ? ' on' : '')} onClick=${() => pickCls(c)}>
      <b>${C.label}</b><span class="r">${blurb.difficulty}</span><p>${blurb.role}</p>
      <div class="st">HP <b>${s.maxHp}</b> · MP <b>${s.maxMp}</b> · ATK <b>${s.atk}</b> · DEF <b>${s.def}</b> · CRIT <b>${s.crit}%</b> · DODGE <b>${s.dodge}%</b><br />
        ${ladderOf(c).filter((a) => a.lv <= 12).map((a) => `${a.name} (${a.lv}${a.passive ? ', passive' : ''})`).join(' · ')} · a new skill every 3 levels</div></button>`; })}
    ${data.creation.locked.map((l) => html`<button key=${l.id} class="opt" disabled><b>${l.name}</b><span class="r">locked</span><p>${l.hint}.</p></button>`)}`;
  else if (k === 'look') body = html`${LOOKS[cls].length > 1 ? LOOKS[cls].map((l) => html`<button key=${l} class=${'opt' + (l === look ? ' on' : '')} onClick=${() => setLook(l)}><b>${LOOK_LABEL[l] || l}</b></button>`) : ''}
    <${LookPicker} words=${data.looks} value=${face} onChange=${setFace} />`;
  else if (k === 'born') body = html`<${Roll} data=${data} cls=${cls} look=${look} roll=${roll} n=${rolls} />`;   // (Roll again: in the nav, where it stays put whatever the roll holds)
  else if (k === 'origin') body = data.origins.map((o) => html`<button key=${o.id} class=${'opt' + (o.id === origin ? ' on' : '')} onClick=${() => pickOrigin(o.id)}>
      <b>${o.name}</b><p>${o.background}</p><div class="edge">${o.edge.text}</div></button>`);
  else if (k === 'name') body = html`<input value=${name} maxLength=${NAME_MAX} placeholder="Your name" autocomplete="off" autocapitalize="words" spellcheck=${false}
      onInput=${(e) => setName(e.currentTarget.value)} />
    ${name && clean !== name.trim() ? html`<div class="err">It will read: ${clean || '(nothing yet)'}</div>` : ''}
    ${refusal ? html`<div class="err">${refusal}.</div>` : ''}
    <div class="names">${shown.map((n) => html`<button key=${n} onClick=${() => setName(n)}>${n}</button>`)}</div>
    <button class="dice" onClick=${dice}>⚄ Five more names</button>`;
  else body = html`<div class="sum"><b>${clean}</b>${CLASSES[cls].label} · ${LOOK_LABEL[look] || look}<br />
      Born with ${ATTRS.map((a) => `${ATTR_LABEL[a]} ${roll.born[a]}`).join(', ')}; ${roll.perks.map((p) => perkName(data, p)).join(' and ')}<br />
      ${O.name}: ${O.edge.text}<br /><i>${O.background}</i></div>
    ${error ? html`<div class="err">${error}</div>` : ''}`;
  return html`<div id="create"><div class="stage"><div class="cap">New hero</div><${FigurePreview} actor=${look} appearance=${face} models=${models} bare=${k === 'look'} /></div>
    <div class="sheet"><div class="dots">${STEPS.map((s, i) => html`<i key=${s} class=${i <= step ? 'on' : ''}></i>`)}</div>
      <h2>${TITLES[k][0]}</h2><div class="sub">${TITLES[k][1]}</div>
      <div class="body">${body}</div>
      <div class="nav">${step > 0 ? html`<button onClick=${() => setStep(step - 1)}>Back</button>` : ''}
        ${k === 'born' ? html`<button class="roll" onClick=${reroll}>⚄ Roll again</button>` : ''}
        ${k === 'begin'
          ? html`<button class="pri" onClick=${() => onBegin({ cls, look, origin, name: clean, roll: rollN, appearance: face })}>Begin</button>`
          : html`<button class="pri" disabled=${!canNext} onClick=${() => setStep(step + 1)}>Next</button>`}</div></div></div>`;
}

/** @param {{ sim: any, onDone: () => void, onCancel?: () => void, models?: boolean }} o  models: the look as its 3D model (off: the still alone) */
export function createCreation({ sim, onDone, models = true }) {
  const style = document.createElement('style'); style.textContent = CSS; document.head.appendChild(style);
  const wrap = document.createElement('div'); wrap.id = 'createWrap'; document.body.appendChild(wrap);
  swallow(wrap);
  /** @type {any} */ let data = null, error = '';
  const load = () => data ? Promise.resolve(data) : Promise.all(['creation', 'origins', 'companions', 'looks'].map((f) => fetch(`./content/${f}.json`).then((r) => r.json())))
    .then(([creation, o, words, looks]) => (data = { creation, origins: o.origins, words, looks }));
  const draw = () => render(html`<${Create} data=${data} seed=${sim.seed} models=${models} error=${error} onBegin=${begin} />`, wrap);
  function begin(pick) { error = ''; sim.commands.push({ type: 'createHero', ...pick }); }
  sim.bus.on('heroCreated', () => { if (!wrap.classList.contains('on')) return; wrap.classList.remove('on'); render(null, wrap); onDone(); });
  sim.bus.on('refused', (r) => { if (!wrap.classList.contains('on')) return; error = r.reason; draw(); });
  async function open() { wrap.classList.add('on'); await load(); draw(); }
  return { open, get isOpen() { return wrap.classList.contains('on'); } };
}
