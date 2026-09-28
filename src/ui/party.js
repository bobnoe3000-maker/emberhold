// party.js (UI) — the party's stat cards along the bottom of the screen: you in the
// centre, up to two hired companions either side. Each card: portrait (cut from the
// character's own baked atlas), level badge, name, class, HP bar, ATK / DEF / CRT / DDG,
// and level + XP bar. Empty companion slots point you at a tavern. DOM only.

import { CLASSES, statsFor, xpToNext } from '../sim/party.js';

const CSS = `
#party { position: fixed; left: 0; right: 0; bottom: 0; z-index: 4; display: grid; grid-template-columns: 1fr 1.08fr 1fr; gap: 6px;
  padding: 6px 8px calc(env(safe-area-inset-bottom, 0px) + 8px); background: linear-gradient(rgba(10,8,14,0), rgba(10,8,14,0.92) 22%);
  font-family: ui-monospace, 'SF Mono', Menlo, Consolas, monospace; color: #d8d2c6; pointer-events: none; }
#party .card { background: rgba(14,12,20,0.94); border: 1px solid #2c2838; border-radius: 3px; padding: 6px 7px 7px; min-width: 0; }
#party .card.main { border-color: #a07a3c; box-shadow: inset 0 0 0 1px rgba(160,122,60,0.25); }
#party .card.empty { border: 1px dashed #3a3448; background: rgba(14,12,20,0.6); display: flex; align-items: center; justify-content: center;
  text-align: center; font-size: 9.5px; color: #6f6880; letter-spacing: .5px; line-height: 1.35; }
#party .top { display: flex; gap: 6px; align-items: center; margin-bottom: 5px; }
#party .pf { position: relative; width: 34px; height: 40px; flex: none; background: #0c0a12; border: 1px solid #2c2838; }
#party .pf canvas { width: 100%; height: 100%; image-rendering: pixelated; }
#party .lv { position: absolute; left: -1px; bottom: -1px; background: #b8862e; color: #1a1208; font-size: 8px; font-weight: 700; padding: 0 2px; }
#party .nm { font-size: 11px; letter-spacing: 1.5px; font-weight: 700; color: #ece6da; text-transform: uppercase; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
#party .cl { font-size: 9px; letter-spacing: 1.5px; color: #8a8498; margin-top: 2px; }
#party .hp { position: relative; height: 11px; background: #1c1a22; border: 1px solid #2c2838; margin-bottom: 5px; }
#party .hp i { position: absolute; left: 0; top: 0; bottom: 0; background: #5aa35c; }
#party .hp span { position: absolute; right: 3px; top: -1px; font-size: 8.5px; color: #f2f0ea; text-shadow: 0 1px 0 #000; }
#party .st { display: grid; grid-template-columns: auto 1fr auto 1fr; gap: 2px 4px; font-size: 9px; color: #8a8498; letter-spacing: 1px; }
#party .st b { color: #e8e2d4; font-weight: 600; text-align: right; }
#party .st b.hi { color: #8fd0ff; }
#party .xp { display: flex; align-items: center; gap: 5px; margin-top: 5px; font-size: 9px; color: #c09a50; letter-spacing: 1px; }
#party .xp div { flex: 1; height: 3px; background: #26222e; position: relative; }
#party .xp div i { position: absolute; left: 0; top: 0; bottom: 0; background: #d8a040; }
`;

const portraitCache = new Map();
function portrait(actor) {
  if (portraitCache.has(actor)) return portraitCache.get(actor);
  const c = document.createElement('canvas'); c.width = 44; c.height = 52;
  const img = new Image(); img.src = `./assets/actors/${actor}.alb.png`;
  img.onload = () => {                                       // facing-camera idle frame (row 2, frame 0), head + torso
    const x = c.getContext('2d'); x.imageSmoothingEnabled = false; x.filter = 'brightness(1.9) saturate(1.1)';
    x.drawImage(img, 22, 2 * 102 + 26, 44, 52, 0, 0, 44, 52);
    for (const el of document.querySelectorAll(`canvas[data-actor="${actor}"]`)) { const y = el.getContext('2d'); y.imageSmoothingEnabled = false; y.clearRect(0, 0, 44, 52); y.drawImage(c, 0, 0); }
  };
  portraitCache.set(actor, c);
  return c;
}

export function createPartyPanel(sim) {
  const style = document.createElement('style'); style.textContent = CSS; document.head.appendChild(style);
  const el = document.createElement('div'); el.id = 'party'; document.body.appendChild(el);
  const hint = document.getElementById('hint'); if (hint) hint.style.display = 'none';

  const card = (m) => {
    if (!m) return `<div class="card empty">empty slot<br>hire at a<br>town tavern</div>`;
    const c = CLASSES[m.cls], s = statsFor(m), need = xpToNext(m.level), actor = m.actor || c.actor;
    return `<div class="card${m.main ? ' main' : ''}">
      <div class="top"><div class="pf"><canvas width="44" height="52" data-actor="${actor}"></canvas><div class="lv">L${m.level}</div></div>
        <div style="min-width:0"><div class="nm">${m.name}</div><div class="cl">${c.abbr}</div></div></div>
      <div class="hp"><i style="width:${Math.round((100 * m.hp) / s.maxHp)}%"></i><span>${m.hp}/${s.maxHp}</span></div>
      <div class="st"><span>ATK</span><b class="${m.cls === 'mage' ? 'hi' : ''}">${s.atk}</b><span>DEF</span><b>${s.def}</b>
        <span>CRT</span><b>${s.crit}%</b><span>DDG</span><b>${s.dodge}%</b></div>
      <div class="xp">LV ${m.level}<div><i style="width:${Math.round((100 * m.xp) / need)}%"></i></div></div></div>`;
  };
  function draw() {
    const [you, a, b] = sim.state.party;
    el.innerHTML = card(a) + card(you) + card(b);
    for (const cv of el.querySelectorAll('canvas[data-actor]')) { const src = portrait(cv.dataset.actor); const x = cv.getContext('2d'); x.imageSmoothingEnabled = false; x.drawImage(src, 0, 0); }
  }
  sim.bus.on('partyChanged', draw);
  draw();
  return { el, height: () => el.getBoundingClientRect().height };
}
