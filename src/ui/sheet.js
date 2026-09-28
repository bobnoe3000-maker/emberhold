// sheet.js — the character sheet (docs/gear-mockup.html). Tap a party card: that member's
// six gear slots around their figure, their stats with the gear's share in green, and the
// shared party bag. Tap an item — worn or in the bag — for its card: stats, affixes, a
// Rare's ability modifier, flavour, a comparison with what's worn, and Equip / Give /
// Unequip / Salvage. Drops raise a loot toast with a one-tap "Equip on …". DOM only; talks
// to the sim through commands (loot.js) and reads its state.

import { CLASSES, statsFor, xpToNext } from '../sim/party.js';
import { BASES, SLOT_LABEL, STAT_LABEL, SALVAGE, itemStats, canWear, isTwoHanded, upgradeScore, modText, ABILITY_OF } from '../sim/items.js';
import { BAG_SIZE } from '../sim/loot.js';

const RC = { common: '#b9b2a4', fine: '#72d06c', rare: '#5aa8ff', heirloom: '#f2a33c' };
const CSS = `
#gearSheet { position: fixed; left: 0; right: 0; bottom: 0; top: 56px; z-index: 8; max-width: 480px; margin: 0 auto; transform: translateY(105%); transition: transform .28s ease;
  background: rgba(16,12,22,0.97); border-top: 1px solid rgba(214,170,98,0.45); border-radius: 16px 16px 0 0; box-shadow: 0 -12px 40px rgba(0,0,0,.6);
  padding: 0 12px calc(env(safe-area-inset-bottom, 0px) + 12px); font-family: ui-monospace, 'SF Mono', Menlo, monospace; color: #efe4cf; overflow-y: auto; }
#gearSheet.on { transform: none; }
#gearSheet .grab { width: 38px; height: 4px; border-radius: 2px; background: #3a3346; margin: 7px auto 4px; }
#gearSheet .x { position: absolute; right: 12px; top: 10px; width: 30px; height: 30px; border-radius: 15px; border: 1px solid rgba(214,170,98,0.45); color: #d8a040; display: grid; place-items: center; font-size: 14px; background: none; }
#gearSheet .tabs { display: flex; gap: 6px; margin-top: 26px; }
#gearSheet .tab { flex: 1; display: flex; gap: 7px; align-items: center; padding: 5px 7px; border: 1px solid #2c2838; border-radius: 6px; background: rgba(255,255,255,.02); min-width: 0; cursor: pointer; }
#gearSheet .tab.on { border-color: #d8a040; background: rgba(216,160,64,.10); box-shadow: inset 0 -2px 0 #d8a040; }
#gearSheet .tab canvas { width: 30px; height: 35px; flex: none; image-rendering: pixelated; background: #0c0a12; border: 1px solid #2c2838; }
#gearSheet .tab b { display: block; font-size: 10.5px; letter-spacing: 1.2px; text-transform: uppercase; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
#gearSheet .tab span { display: block; font-size: 9px; color: #978c80; letter-spacing: 1px; margin-top: 1px; white-space: nowrap; }
#gearSheet .tab .dot { width: 7px; height: 7px; border-radius: 4px; background: #8fe07a; box-shadow: 0 0 6px #8fe07a; flex: none; margin-left: auto; align-self: flex-start; }
#gearSheet .doll { display: grid; grid-template-columns: 70px 1fr 70px; gap: 6px; margin-top: 10px; align-items: center; }
#gearSheet .col { display: flex; flex-direction: column; gap: 17px; align-items: center; }
#gearSheet .fig { position: relative; height: 236px; border-radius: 10px; border: 1px solid #2c2838; overflow: hidden;
  background: radial-gradient(ellipse at 50% 86%, rgba(216,160,64,.22), rgba(0,0,0,0) 55%), radial-gradient(ellipse at 50% 40%, #1b1624, #0e0b14 70%); }
#gearSheet .fig canvas { position: absolute; left: 50%; top: 8px; width: 176px; height: 204px; margin-left: -88px; image-rendering: pixelated; }
#gearSheet .fig .nm { position: absolute; left: 0; right: 0; bottom: 10px; text-align: center; font-size: 10px; color: #f0c880; letter-spacing: 1.5px; }
#gearSheet .fig .xpb { position: absolute; left: 22px; right: 22px; bottom: 5px; height: 2px; background: #26222e; }
#gearSheet .fig .xpb i { position: absolute; left: 0; top: 0; bottom: 0; background: #d8a040; }
.gslot { position: relative; width: 58px; height: 58px; border-radius: 8px; background: radial-gradient(circle at 50% 40%, #221c2c, #120e18); border: 1.5px solid #2c2838; display: grid; place-items: center; cursor: pointer; padding: 0; }
.gslot img { width: 48px; height: 48px; pointer-events: none; }
.gslot.common { border-color: #5a5448; } .gslot.fine { border-color: #72d06c; box-shadow: inset 0 0 12px rgba(114,208,108,.22); }
.gslot.rare { border-color: #5aa8ff; box-shadow: inset 0 0 14px rgba(90,168,255,.28); } .gslot.heirloom { border-color: #f2a33c; box-shadow: inset 0 0 16px rgba(242,163,60,.32); }
.gslot.sel { outline: 2px solid #f0c880; outline-offset: 2px; }
.gslot.empty { border-style: dashed; cursor: default; }
.gslot .lbl { position: absolute; bottom: -14px; left: -10px; right: -10px; text-align: center; font-size: 8px; letter-spacing: 1.2px; color: #7c748a; text-transform: uppercase; }
.gslot .new { position: absolute; top: -4px; right: -4px; font-size: 7.5px; font-weight: 700; color: #10200c; background: #8fe07a; border-radius: 3px; padding: 1px 3px; }
.gslot .up { position: absolute; bottom: 1px; right: 3px; color: #8fe07a; font-size: 11px; font-weight: 700; text-shadow: 0 1px 0 #000; }
.gslot.off img { filter: grayscale(.85) brightness(.6); }
.gslot .cls { position: absolute; top: 2px; left: 3px; font-size: 7.5px; color: #9a92aa; background: rgba(0,0,0,.55); border-radius: 2px; padding: 0 2px; }
#gearSheet .stats { display: grid; grid-template-columns: 1fr 1fr; gap: 3px 16px; margin-top: 14px; padding: 8px 10px; border: 1px solid #2c2838; border-radius: 8px; background: rgba(255,255,255,.015); }
#gearSheet .stat { display: flex; align-items: baseline; font-size: 10.5px; color: #8a8498; letter-spacing: 1px; }
#gearSheet .stat b { margin-left: auto; color: #efe4cf; font-weight: 600; }
#gearSheet .stat u { text-decoration: none; color: #8fe07a; font-size: 9.5px; width: 36px; text-align: right; }
#gearSheet .stat u.z { color: #4a4458; }
#gearSheet .bagh { display: flex; align-items: baseline; margin: 12px 2px 8px; font-size: 10px; letter-spacing: 2px; color: #a08a6a; text-transform: uppercase; }
#gearSheet .bagh .cur { margin-left: auto; letter-spacing: 1px; text-transform: none; color: #f0c880; font-size: 10.5px; }
#gearSheet .bagh .cur i { font-style: normal; color: #ff9a50; margin-left: 10px; }
#gearSheet .bag { display: grid; grid-template-columns: repeat(5, 58px); gap: 9px; justify-content: space-between; padding-bottom: 8px; }
#gearCard { position: fixed; left: 50%; bottom: calc(env(safe-area-inset-bottom, 0px) + 10px); width: min(460px, calc(100vw - 20px)); transform: translateX(-50%); z-index: 9; display: none;
  background: rgba(20,15,26,.99); border: 1px solid rgba(214,170,98,0.45); border-radius: 12px; padding: 12px; box-shadow: 0 -8px 40px rgba(0,0,0,.75); font-family: ui-monospace, Menlo, monospace; color: #efe4cf; }
#gearCard.on { display: block; }
#gearCard .hd { display: flex; gap: 12px; align-items: center; }
#gearCard .big { width: 72px; height: 72px; border-radius: 10px; flex: none; display: grid; place-items: center; background: radial-gradient(circle at 50% 40%, #2a2234, #120e18); border: 1.5px solid; }
#gearCard .big img { width: 64px; height: 64px; }
#gearCard h3 { font-family: Georgia, serif; font-size: 17px; font-weight: 600; line-height: 1.15; }
#gearCard .meta { font-size: 10px; color: #978c80; letter-spacing: 1px; margin-top: 4px; line-height: 1.5; }
#gearCard .meta em { font-style: normal; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; }
#gearCard .cmphd { display: flex; font-size: 9px; letter-spacing: 1.5px; color: #7c748a; text-transform: uppercase; margin-top: 10px; }
#gearCard .cmphd span:last-child { margin-left: auto; }
#gearCard .lines { margin-top: 4px; border-top: 1px solid #2c2838; padding-top: 7px; }
#gearCard .ln { display: flex; font-size: 11.5px; padding: 2px 0; }
#gearCard .ln .k { color: #8a8498; letter-spacing: 1px; width: 76px; }
#gearCard .ln.aff { color: #72d06c; } #gearCard .ln.aff .k { color: inherit; } #gearCard .ln.mod { color: #5aa8ff; } #gearCard .ln.mod.dim { color: #53708f; }
#gearCard .ln .cmp { margin-left: auto; font-size: 10.5px; } #gearCard .ln .cmp.u { color: #8fe07a; } #gearCard .ln .cmp.d { color: #ff7a66; } #gearCard .ln .cmp.z { color: #5d566a; }
#gearCard .note { font-size: 10px; color: #c89a60; margin-top: 6px; }
#gearCard .note.bad { color: #ff7a66; }
#gearCard .flav { font-family: Georgia, serif; font-style: italic; font-size: 12.5px; color: #9f9484; margin-top: 8px; line-height: 1.35; }
.gbtns { display: flex; gap: 8px; margin-top: 12px; }
.gbtn { flex: 1; text-align: center; padding: 10px 6px; border-radius: 8px; font: 11.5px ui-monospace, Menlo, monospace; letter-spacing: 1.5px; text-transform: uppercase; border: 1px solid rgba(214,170,98,0.45); color: #f0c880; background: none; }
.gbtn.pri { background: linear-gradient(#e0a84a, #b67c2a); color: #1a1208; font-weight: 700; border-color: #f0c880; }
.gbtn.ghost { flex: .7; color: #978c80; border-color: #2c2838; }
#lootToast { position: fixed; left: 50%; top: 96px; width: min(380px, calc(100vw - 32px)); transform: translate(-50%, -12px); opacity: 0; pointer-events: none; transition: opacity .2s ease, transform .2s ease; z-index: 7;
  background: rgba(18,14,24,.97); border: 1px solid; border-radius: 12px; padding: 10px; box-shadow: 0 10px 30px rgba(0,0,0,.7); font-family: ui-monospace, Menlo, monospace; color: #efe4cf; }
#lootToast.on { opacity: 1; transform: translate(-50%, 0); pointer-events: auto; }
#lootToast .t { font-size: 9.5px; letter-spacing: 2px; color: #a08a6a; text-transform: uppercase; margin-bottom: 7px; }
#lootToast .hd { display: flex; gap: 10px; align-items: center; }
#lootToast .big { width: 54px; height: 54px; border-radius: 9px; border: 1.5px solid; display: grid; place-items: center; background: radial-gradient(circle at 50% 40%, #2a2234, #120e18); flex: none; }
#lootToast .big img { width: 48px; height: 48px; }
#lootToast h3 { font-family: Georgia, serif; font-size: 15.5px; font-weight: 600; }
#lootToast .s { font-size: 10px; color: #978c80; margin-top: 3px; }
#lootToast .s b { color: #8fe07a; font-weight: 600; }
#lootToast .gbtns { margin-top: 9px; } #lootToast .gbtn { padding: 8px 6px; }
#party .card { pointer-events: auto; cursor: pointer; }
#party .card.empty { pointer-events: none; }
#party .card .upb { position: absolute; top: -7px; right: -4px; background: #8fe07a; color: #10200c; font-size: 8px; font-weight: 700; border-radius: 7px; padding: 1px 5px; letter-spacing: .5px; box-shadow: 0 0 8px rgba(143,224,122,.6); }
`;

// portrait / figure canvases cut from the baked atlas (facing camera, idle frame 0)
const atlasImgs = new Map();
function drawActor(cv, actor, sx, sy, sw, sh, bright = 1.9) {
  let img = atlasImgs.get(actor);
  if (!img) { img = new Image(); img.src = `./assets/actors/${actor}.alb.png`; atlasImgs.set(actor, img); }
  const paint = () => { const x = cv.getContext('2d'); x.imageSmoothingEnabled = false; x.clearRect(0, 0, cv.width, cv.height); x.filter = `brightness(${bright}) saturate(1.12)`; x.drawImage(img, sx, 2 * 102 + sy, sw, sh, 0, 0, cv.width, cv.height); };
  if (img.complete && img.naturalWidth) paint(); else img.addEventListener('load', paint, { once: true });
}
const actorOf = (m) => m.actor || CLASSES[m.cls].actor;
const icon = (it) => `./assets/items/${BASES[it.base].icon}.png`;
const fmt = (k, v) => (k === 'crit' || k === 'dodge' ? `${v > 0 ? '+' : ''}${v}%` : k === 'hpr' || k === 'mpr' ? `${v > 0 ? '+' : ''}${v}/s` : `${v > 0 ? '+' : ''}${v}`);
const CLS_ABBR = { fighter: 'FTR', rogue: 'ROG', mage: 'MAG' };

export function createGearSheet(sim, { partyPanel }) {
  const style = document.createElement('style'); style.textContent = CSS; document.head.appendChild(style);
  const sheet = document.createElement('div'); sheet.id = 'gearSheet';
  const card = document.createElement('div'); card.id = 'gearCard';
  const toast = document.createElement('div'); toast.id = 'lootToast';
  document.body.append(sheet, card, toast);
  const stop = (e) => e.stopPropagation();
  for (const el of [sheet, card, toast]) for (const ev of ['pointerdown', 'touchstart', 'mousedown']) el.addEventListener(ev, stop);

  const S = sim.state;
  let open = false, who = 0, sel = null;                     // sel: { uid, worn: slot | null }
  let pendingSel = null;                                     // an equip in flight: follow the item to its new slot
  const fresh = new Set();                                   // uids dropped since you last looked
  let note = null;                                           // { text, bad } under the card

  const member = () => S.party[Math.min(who, S.party.length - 1)];
  const isUp = (m, it) => upgradeScore(m, it) > 0.05;
  const hasUpgrade = (m) => S.bag.some((it) => isUp(m, it));

  // ── the sheet ──────────────────────────────────────────────────────────────
  const slotHtml = (it, { slot, lbl, m }) => {
    if (!it) return `<div class="gslot empty">${lbl ? `<span class="lbl">${lbl}</span>` : ''}</div>`;
    const wear = !m || canWear(m, it), sl = sel && sel.uid === it.uid;
    const tag = !wear ? S.party.find((q) => canWear(q, it)) : null;
    return `<button class="gslot ${it.r}${sl ? ' sel' : ''}${wear ? '' : ' off'}" data-uid="${it.uid}" ${slot ? `data-slot="${slot}"` : ''}><img src="${icon(it)}" alt="">`
      + `${!wear ? `<span class="cls">${tag ? tag.name.slice(0, 3).toUpperCase() : CLS_ABBR[BASES[it.base].cls] || ''}</span>` : ''}${fresh.has(it.uid) ? '<span class="new">NEW</span>' : ''}`
      + `${!slot && m && isUp(m, it) ? '<span class="up">▲</span>' : ''}${lbl ? `<span class="lbl">${lbl}</span>` : ''}</button>`;
  };
  function render() {
    if (!open) return;
    const m = member(), s = statsFor(m), g = m.gear || {}, c = CLASSES[m.cls];
    const tabs = S.party.map((p, i) => `<div class="tab${i === who ? ' on' : ''}" data-who="${i}"><canvas width="44" height="52" data-actor="${actorOf(p)}"></canvas>`
      + `<div style="min-width:0"><b>${p.name}</b><span>${CLS_ABBR[p.cls]} · L${p.level}</span></div>${hasUpgrade(p) ? '<span class="dot"></span>' : ''}</div>`).join('');
    const col = (slots) => slots.map((sl) => slotHtml(g[sl], { slot: sl, lbl: SLOT_LABEL[sl] })).join('');
    const G = s.gear, stat = (k, v, gv) => `<div class="stat">${STAT_LABEL[k].toUpperCase()}<b>${v}</b><u class="${gv ? '' : 'z'}">${gv ? fmt(k, gv) : '—'}</u></div>`;
    const need = xpToNext(m.level);
    sheet.innerHTML = `<div class="grab"></div><button class="x" data-close>✕</button><div class="tabs">${tabs}</div>
      <div class="doll"><div class="col">${col(['weapon', 'off', 'trinket'])}</div>
        <div class="fig"><canvas width="88" height="102" data-fig="${actorOf(m)}"></canvas><div class="nm">${m.name.toUpperCase()} · ${c.label.toUpperCase()} · LV ${m.level}</div><div class="xpb"><i style="width:${Math.min(100, Math.round(100 * m.xp / need))}%"></i></div></div>
        <div class="col">${col(['helm', 'armor', 'boots'])}</div></div>
      <div class="stats">${stat('hp', s.maxHp, G.hp)}${stat('mp', s.maxMp, G.mp)}${stat('atk', s.atk, G.atk)}${stat('def', s.def, G.def)}${stat('crit', s.crit + '%', G.crit)}${stat('dodge', s.dodge + '%', G.dodge)}${stat('hpr', s.hpr + '/s', G.hpr)}${stat('mpr', s.mpr + '/s', G.mpr)}</div>
      <div class="bagh">Party bag · ${S.bag.length}/${BAG_SIZE}<span class="cur">${S.counters.gold || 0} gold<i>✦ ${S.counters.embers || 0} embers</i></span></div>
      <div class="bag">${S.bag.map((it) => slotHtml(it, { m })).join('')}${Array.from({ length: Math.max(0, BAG_SIZE - S.bag.length) }, () => '<div class="gslot empty"></div>').join('')}</div>`;
    for (const cv of sheet.querySelectorAll('canvas[data-actor]')) drawActor(cv, cv.dataset.actor, 22, 26, 44, 52);
    const fc = sheet.querySelector('canvas[data-fig]'); if (fc) drawActor(fc, fc.dataset.fig, 0, 0, 88, 102, 2.1);
    renderCard();
  }

  // ── the item card ─────────────────────────────────────────────────────────
  function findSel() {
    if (!sel) return null;
    if (sel.worn) { const it = member().gear[sel.worn]; return it && it.uid === sel.uid ? it : null; }
    return S.bag.find((it) => it.uid === sel.uid) || null;
  }
  function renderCard() {
    const it = findSel(); if (!it) { card.classList.remove('on'); sel = null; return; }
    const m = member(), B = BASES[it.base], worn = !!sel.worn, st = itemStats(it);
    const wearer = canWear(m, it) ? m : S.party.find((q) => canWear(q, it));
    // comparison with what the member who'd wear it has on (bag items only)
    let cmp = null;
    if (!worn && wearer) {
      const g = wearer.gear || {}, cur = g[B.slot] && itemStats(g[B.slot]), off = isTwoHanded(it) && g.off ? itemStats(g.off) : null;
      cmp = {}; for (const k of new Set([...Object.keys(st), ...Object.keys(cur || {}), ...Object.keys(off || {})])) cmp[k] = Math.round(((st[k] || 0) - (cur?.[k] || 0) - (off?.[k] || 0)) * 10) / 10;
    }
    const cmpCell = (k) => { if (!cmp) return ''; const d = cmp[k] || 0; return `<span class="cmp ${d > 0 ? 'u' : d < 0 ? 'd' : 'z'}">${d > 0 ? '▲ ' : d < 0 ? '▼ ' : ''}${d ? fmt(k, d) : '='}</span>`; };
    const lines = [...Object.entries(it.st).map(([k, v]) => `<div class="ln"><span class="k">${STAT_LABEL[k]}</span><b>${fmt(k, v)}</b>${cmpCell(k)}</div>`),
      ...(it.aff || []).map(([k, v]) => `<div class="ln aff"><span class="k">${STAT_LABEL[k]}</span><b>${fmt(k, v)}</b>${cmp && !(k in it.st) ? cmpCell(k) : ''}</div>`)];
    if (cmp) for (const k of Object.keys(cmp)) if (!(k in it.st) && !(it.aff || []).some((a) => a[0] === k) && cmp[k]) lines.push(`<div class="ln"><span class="k">${STAT_LABEL[k]}</span><b style="color:#5d566a">—</b>${cmpCell(k)}</div>`);
    if (it.mod) { const mine = wearer && it.mod.ab === ABILITY_OF[wearer.cls]; lines.push(`<div class="ln mod${mine ? '' : ' dim'}">◆ ${modText(it.mod)}${mine ? '' : ' (not this class)'}</div>`); }
    const clsName = B.cls === 'any' ? 'Any class' : CLASSES[B.cls].label;
    let warn = '';
    if (!worn && wearer && isTwoHanded(it) && wearer.gear.off) warn = `⚠ Two-handed: ${wearer.gear.off.name} goes to the bag`;
    if (!worn && wearer && B.slot === 'off' && isTwoHanded(wearer.gear.weapon)) warn = `⚠ ${wearer.gear.weapon.name} needs both hands`;
    let btns;
    if (worn) btns = `<button class="gbtn" data-act="unequip">Unequip</button><button class="gbtn ghost" data-act="close">Close</button>`;
    else {
      const eq = wearer ? `<button class="gbtn pri" data-act="equip" data-to="${wearer.id}">${wearer === m ? 'Equip' : `Give to ${wearer.name}`}</button>` : '';
      btns = `${eq}<button class="gbtn" data-act="salvage">Salvage ✦${SALVAGE[it.r]}</button><button class="gbtn ghost" data-act="close">Close</button>`;
    }
    card.innerHTML = `<div class="hd"><div class="big" style="border-color:${RC[it.r]}"><img src="${icon(it)}" alt=""></div>
      <div><h3 style="color:${RC[it.r]}">${it.name}</h3><div class="meta"><em style="color:${RC[it.r]}">${it.r}</em> · item level ${it.ilv}<br>${SLOT_LABEL[B.slot]} · ${B.hands === 2 ? 'two-handed ' : ''}${B.kind} · ${clsName}</div></div></div>
      ${cmp ? `<div class="cmphd"><span>this item</span><span>vs ${wearer === m ? 'worn' : wearer.name + "'s"}</span></div>` : ''}
      <div class="lines">${lines.join('')}</div>
      ${warn ? `<div class="note">${warn}</div>` : ''}${note ? `<div class="note${note.bad ? ' bad' : ''}">${note.text}</div>` : ''}
      ${it.flav ? `<div class="flav">${it.flav}</div>` : ''}<div class="gbtns">${btns}</div>`;
    card.classList.add('on');
  }

  // ── input ──────────────────────────────────────────────────────────────────
  sheet.addEventListener('click', (e) => {
    if (e.target.closest('[data-close]')) { close(); return; }
    const tab = e.target.closest('.tab'); if (tab) { who = +tab.dataset.who; sel = null; note = null; render(); return; }
    const b = e.target.closest('.gslot[data-uid]'); if (!b) return;
    sel = { uid: b.dataset.uid, worn: b.dataset.slot || null }; fresh.delete(b.dataset.uid); note = null; render();
  });
  card.addEventListener('click', (e) => {
    const b = e.target.closest('[data-act]'); if (!b) return;
    const it = findSel(), m = member(), act = b.dataset.act; note = null;
    if (act === 'close' || !it) { sel = null; render(); return; }
    if (act === 'equip') { sim.commands.push({ type: 'equip', member: b.dataset.to, uid: it.uid }); pendingSel = { uid: it.uid, to: b.dataset.to }; }
    if (act === 'unequip') sim.commands.push({ type: 'unequip', member: m.id, slot: sel.worn });
    if (act === 'salvage') { sim.commands.push({ type: 'salvage', uid: it.uid }); sel = null; }
  });
  // after an equip lands, keep showing the item where it went (the worn slot); refusals show on the card
  sim.bus.on('gearChanged', () => {
    if (pendingSel) { const i = S.party.findIndex((q) => q.id === pendingSel.to); const w = S.party[i]; const slot = w && Object.keys(w.gear).find((k) => w.gear[k] && w.gear[k].uid === pendingSel.uid);
      if (slot) { who = i; sel = { uid: pendingSel.uid, worn: slot }; } pendingSel = null; }
    else if (sel && sel.worn) sel = null;
    render(); partyPanel.refresh && partyPanel.refresh();
  });
  sim.bus.on('gearRefused', ({ reason }) => { pendingSel = null; note = { text: reason, bad: true }; if (open) renderCard(); else showToastText(reason); });
  sim.bus.on('partyChanged', () => { if (who >= S.party.length) who = 0; render(); });
  sim.bus.on('levelUp', render);

  function openSheet(i = 0) { who = i; sel = null; note = null; open = true; sheet.classList.add('on'); hideToast(); render(); }
  function close() { open = false; sel = null; note = null; sheet.classList.remove('on'); card.classList.remove('on'); fresh.clear(); partyPanel.refresh && partyPanel.refresh(); }

  // ── loot toast ─────────────────────────────────────────────────────────────
  let toastTimer = null, toastItem = null;
  function hideToast() { toast.classList.remove('on'); toastItem = null; }
  function showToastText(text) {
    toast.style.borderColor = 'rgba(214,170,98,0.45)'; toast.innerHTML = `<div class="s" style="margin:0;color:#efe4cf">${text}</div>`;
    toast.classList.add('on'); clearTimeout(toastTimer); toastTimer = setTimeout(hideToast, 2200);
  }
  sim.bus.on('loot', ({ item, src, best, salvaged }) => {
    if (salvaged) { showToastText(`Bag full · ${item.name} salvaged for ✦${salvaged}`); return; }
    fresh.add(item.uid);
    if (open) { render(); return; }
    const m = best && S.party.find((q) => q.id === best), B = BASES[item.base];
    let up = '';
    if (m) {
      const cur = m.gear[B.slot] ? itemStats(m.gear[B.slot]) : {}, st = itemStats(item), off = isTwoHanded(item) && m.gear.off ? itemStats(m.gear.off) : {};
      const d = Object.keys({ ...st, ...cur }).map((k) => [k, Math.round(((st[k] || 0) - (cur[k] || 0) - (off[k] || 0)) * 10) / 10]).filter(([, v]) => v > 0).sort((a, b) => b[1] - a[1]).slice(0, 2);
      up = `<div class="s">Upgrade for <span style="color:#efe4cf">${m.name}</span>${d.length ? ': <b>' + d.map(([k, v]) => `▲ ${STAT_LABEL[k]} ${fmt(k, v)}`).join(' · ') + '</b>' : ''}</div>`;
    }
    toastItem = item;
    toast.style.borderColor = RC[item.r];
    toast.innerHTML = `<div class="t">✦ Found ${src === 'chest' ? 'in a chest' : src === 'elite' ? 'on an elite' : 'after the wave'}</div>
      <div class="hd"><div class="big" style="border-color:${RC[item.r]}"><img src="${icon(item)}" alt=""></div><div style="min-width:0"><h3 style="color:${RC[item.r]}">${item.name}</h3>
      <div class="s">${item.r[0].toUpperCase() + item.r.slice(1)} · ${SLOT_LABEL[B.slot]} · ${B.cls === 'any' ? 'any class' : CLASSES[B.cls].label} · ilv ${item.ilv}</div>${up}</div></div>
      <div class="gbtns">${m ? `<button class="gbtn pri" data-to="${m.id}">Equip on ${m.name}</button>` : `<button class="gbtn pri" data-look>Look</button>`}<button class="gbtn" data-bag>Bag</button></div>`;
    toast.classList.add('on'); clearTimeout(toastTimer); toastTimer = setTimeout(hideToast, 6000);
  });
  toast.addEventListener('click', (e) => {
    const b = e.target.closest('button'); if (!b || !toastItem) return;
    if (b.dataset.to) { sim.commands.push({ type: 'equip', member: b.dataset.to, uid: toastItem.uid }); fresh.delete(toastItem.uid); }
    if (b.dataset.look) { const it = toastItem; openSheet(0); sel = { uid: it.uid, worn: null }; render(); }
    hideToast();
  });
  sim.bus.on('levelChanged', () => { if (open) close(); });

  // the party cards open the sheet and show an upgrade badge
  partyPanel.onCard((i) => openSheet(i));
  partyPanel.badge((m) => hasUpgrade(m));
  return { open: openSheet, close, get isOpen() { return open; } };
}
