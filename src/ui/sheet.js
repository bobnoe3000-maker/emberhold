// sheet.js — the character window (docs/gear-mockup.html; development plan §2.4). Tap a party
// card: that member's window, in three tabs.
//   Gear   — six gear slots around their figure, their stats with the gear's share in green,
//            and the shared party bag.
//   Stats  — the four attributes with the point-spend buttons and Auto; derived stats.
//   Skills — the class abilities in priority order: ranks, auto-cast, the passive, the stance.
// On the Gear tab: Tap an item — worn or in the bag — for its card: stats, affixes, a
// Rare's ability modifier, flavour, a comparison with what's worn, and Equip / Give /
// Unequip / Salvage. Drops raise a loot toast with a one-tap "Equip on …". DOM only; talks
// to the sim through commands (loot.js) and reads its state.

import { CLASSES, statsFor, xpToNext } from '../sim/party.js';
import { ATTRS, ATTR_LABEL, ATTR_TEXT, attrsOf, pendingPoints } from '../sim/attributes.js';
import { PASSIVES, STANCES, STANCE_LABEL, STANCE_TEXT, MAX_RANK, priorityOf, unlocked, rankOf, rankCost, autocastOn, pendingSkillPoints, stanceOf, hasPassive, skillMult, HEAL_BONUS, DRAIN_MEND, OLD_WAYS_STACKS } from '../sim/skills.js';
import { esc, drawPortrait, drawCharacter, PORTRAIT_W, PORTRAIT_H, FIGURE_W, FIGURE_H } from './actorart.js';
import { BASES, classesOf, SLOT_LABEL, STAT_LABEL, SALVAGE, itemStats, canWear, isTwoHanded, upgradeScore, modText, ABILITY_OF, abilityMods, isUsable } from '../sim/items.js';
import { BAG_SIZE, bagStacks } from '../sim/loot.js';
import { classIcon, classColor } from './classicons.js';
import { NPCS } from '../sim/npcs.js';
import { perkWord, rankMark, rankLine, perkLines, loyaltyWord, SW_CSS } from './sellswords.js';
import { hired, wageOf, loyaltyOf, sworn, LOYALTY, REVEAL_AT, SWORN_AT, RETRAIN_COST, healMod } from '../sim/companions.js';

const RC = { common: '#b9b2a4', fine: '#72d06c', rare: '#5aa8ff', heirloom: '#f2a33c' };
const CSS = SW_CSS + `
/* the Contract tab (GDD §6.2): a companion's terms with the Guild */
#gearSheet .ct { margin-top: 10px; font-family: Georgia, serif; }
#gearSheet .ct .rl { font: italic 12.5px Georgia, serif; color: #a8a090; margin: 4px 0 10px; }
#gearSheet .ct h4 { font: 10.5px ui-monospace, Menlo, monospace; letter-spacing: 2px; color: #a08a6a; text-transform: uppercase; margin: 14px 0 5px; font-weight: 400; }
#gearSheet .ct .ln { font: 12.5px/1.45 Georgia, serif; color: #d8ccb8; }
#gearSheet .ct .ln small { font: 11px ui-monospace, Menlo, monospace; color: #a8987e; }
#gearSheet .ct .owed { font: 700 12px ui-monospace, Menlo, monospace; color: #ff9a8a; margin-top: 6px; }
#gearSheet .ct .track { display: flex; gap: 4px; margin: 6px 0 4px; }
#gearSheet .ct .track span { flex: 1; text-align: center; font: 10px ui-monospace, Menlo, monospace; color: #6f6880; border: 1px solid #3a3346; border-radius: 4px; padding: 3px 0; }
#gearSheet .ct .track span.on { color: #1a1208; background: #d8a040; border-color: #f0c880; font-weight: 700; }
#gearSheet .ct .track span.mark { border-color: rgba(214,170,98,.7); }
#gearSheet .ct .terms { display: block; width: 100%; min-height: 44px; margin-top: 16px; border-radius: 9px; border: 1px solid rgba(214,170,98,.5); background: none; color: #f0c880; font: 600 14px Georgia, serif; }
#gearSheet { position: fixed; left: 0; right: 0; bottom: 0; top: 56px; z-index: 8; max-width: 480px; margin: 0 auto; transform: translateY(105%); transition: transform .28s ease;
  background: rgba(16,12,22,0.97); border-top: 1px solid rgba(214,170,98,0.45); border-radius: 16px 16px 0 0; box-shadow: 0 -12px 40px rgba(0,0,0,.6);
  padding: 0 12px calc(env(safe-area-inset-bottom, 0px) + 12px); font-family: ui-monospace, 'SF Mono', Menlo, monospace; color: #efe4cf; overflow-y: auto; }
#gearSheet.on { transform: none; }
#gearSheet .grab { width: 38px; height: 4px; border-radius: 2px; background: #3a3346; margin: 7px auto 4px; }
#gearSheet .x { position: absolute; right: 12px; top: 6px; width: 44px; height: 44px; border-radius: 22px; border: 1px solid rgba(214,170,98,0.45); color: #d8a040; display: grid; place-items: center; font-size: 14px; background: none; }
#gearSheet .tabs { display: flex; gap: 6px; margin-top: 44px; }   /* clear of the ✕ (it overlapped the last tab by 3 px: owner, 2026-10-04) */
#gearSheet .tab { flex: 1; display: flex; gap: 7px; align-items: center; padding: 5px 7px; border: 1px solid #2c2838; border-radius: 6px; background: rgba(255,255,255,.02); min-width: 0; cursor: pointer; }
#gearSheet .tab.on { border-color: #d8a040; background: rgba(216,160,64,.10); box-shadow: inset 0 -2px 0 #d8a040; }
#gearSheet .tab canvas { width: 30px; height: 35px; flex: none; background: #0c0a12; border: 1px solid #2c2838; }
#gearSheet .tab b { display: block; font-size: 10.5px; letter-spacing: 1.2px; text-transform: uppercase; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
#gearSheet .tab span { display: block; font-size: 9px; color: #978c80; letter-spacing: 1px; margin-top: 1px; white-space: nowrap; }
#gearSheet .tab .dot { width: 7px; height: 7px; border-radius: 4px; background: #8fe07a; box-shadow: 0 0 6px #8fe07a; flex: none; margin-left: auto; align-self: flex-start; }
#gearSheet .doll { display: grid; grid-template-columns: 70px 1fr 70px; gap: 6px; margin-top: 10px; align-items: center; }
#gearSheet .col { display: flex; flex-direction: column; gap: 17px; align-items: center; }
/* the figure on a small stage: a warm spotlight from above, the class's colour glowing behind, a
   pool of light on the floor, a contact shadow under the feet and a vignette at the edges */
#gearSheet .fig { position: relative; height: 236px; border-radius: 10px; border: 1px solid #2c2838; overflow: hidden; box-shadow: inset 0 0 34px rgba(0,0,0,.7);
  background: radial-gradient(ellipse 58% 62% at 50% -4%, rgba(255,214,150,.16), rgba(0,0,0,0) 72%),
    radial-gradient(circle at 50% 46%, var(--glow, rgba(201,210,224,.14)), rgba(0,0,0,0) 44%),
    radial-gradient(ellipse 52% 16% at 50% 84%, rgba(216,160,64,.26), rgba(0,0,0,0) 100%), radial-gradient(ellipse at 50% 40%, #1b1624, #0c0a12 72%); }
#gearSheet .fig .gnd { position: absolute; left: 50%; top: 188px; width: 108px; height: 20px; margin-left: -54px; border-radius: 50%; background: radial-gradient(closest-side, rgba(4,2,8,.72), rgba(4,2,8,0)); }
#gearSheet .fig canvas { position: absolute; left: 50%; top: 8px; width: 176px; height: 204px; margin-left: -88px; }
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
.gslot .who { position: absolute; top: 2px; left: 2px; width: 15px; height: 15px; border-radius: 4px; background: rgba(0,0,0,.72); display: grid; place-items: center; }
.gslot .who svg { width: 12px; height: 12px; display: block; }
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
.gbtn.arm { background: #5a1c16; color: #ffd0c8; border-color: rgba(255,122,102,.6); }
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
#gearSheet .views { display: flex; gap: 6px; margin-top: 8px; }
#gearSheet .talkb { display: block; width: 100%; min-height: 44px; margin-top: 8px; border-radius: 8px; border: 1px solid rgba(214,170,98,.55); background: rgba(216,160,64,.1); color: #f0c880; font: 600 14px Georgia, serif; }
#gearSheet .views button { flex: 1; position: relative; min-height: 40px; border-radius: 8px; border: 1px solid #2c2838; background: none; color: #b8aca0; font: 11px ui-monospace, Menlo, monospace; letter-spacing: 2px; text-transform: uppercase; }
#gearSheet .views button.on { color: #1a1208; background: #d8a040; border-color: #f0c880; font-weight: 700; }
#gearSheet .views button .dot { position: absolute; top: 5px; right: 6px; width: 7px; height: 7px; border-radius: 4px; background: #8fe07a; box-shadow: 0 0 6px #8fe07a; }
.gslot .qty { position: absolute; bottom: 1px; left: 3px; font-size: 9px; font-weight: 700; color: #f2ece0; text-shadow: 0 1px 0 #000, 0 0 3px #000; }
#gearCard h3 small { font-size: 12px; color: #b8aca0; font-weight: 600; }
#gearSheet .ptsh { display: flex; align-items: center; gap: 8px; margin: 12px 2px 8px; font-size: 11px; color: #c8bca8; letter-spacing: 1px; }
#gearSheet .ptsh b { color: #8fe07a; font-size: 14px; } #gearSheet .ptsh .sp { margin-left: auto; }
#gearSheet .tog { min-height: 36px; min-width: 76px; border-radius: 18px; border: 1px solid #3a3346; background: none; color: #978c80; font: 10.5px ui-monospace, Menlo, monospace; letter-spacing: 1px; }
#gearSheet .tog.on { color: #10200c; background: #8fe07a; border-color: #8fe07a; font-weight: 700; }
#gearSheet .arow { display: flex; align-items: center; gap: 10px; padding: 9px 10px; margin-bottom: 7px; border: 1px solid #2c2838; border-radius: 9px; background: rgba(255,255,255,.02); min-height: 56px; }
#gearSheet .arow .nm2 { flex: 1; min-width: 0; } #gearSheet .arow .nm2 b { font: 600 15px Georgia, serif; color: #efe4cf; }
#gearSheet .arow .nm2 span { display: block; font-size: 11px; color: #978c80; margin-top: 3px; line-height: 1.4; }
#gearSheet .arow .nm2 span.eff { color: #c8bca8; }
#gearSheet .arow .nm2 span.nx { color: #8fb8e0; margin-top: 2px; }
#gearSheet .arow .val { font-size: 18px; font-weight: 700; color: #f0c880; min-width: 26px; text-align: right; }
#gearSheet .plus { width: 46px; height: 46px; border-radius: 10px; border: 1px solid #8fe07a; background: rgba(143,224,122,.12); color: #8fe07a; font-size: 22px; flex: none; }
#gearSheet .plus:disabled { border-color: #2c2838; color: #3a3346; background: none; }
#gearSheet .arow.locked { opacity: .5; }
#gearSheet .pips { letter-spacing: 2px; color: #d8a040; font-size: 11px; }
#gearSheet .pips s { text-decoration: none; color: #3a3346; }
#gearSheet .sbtns { display: flex; flex-direction: column; gap: 5px; flex: none; }
#gearSheet .sbtns button { min-width: 64px; min-height: 34px; border-radius: 7px; border: 1px solid rgba(214,170,98,.45); background: none; color: #f0c880; font: 10px ui-monospace, Menlo, monospace; letter-spacing: 1px; }
#gearSheet .sbtns button:disabled { border-color: #2c2838; color: #3a3346; }
#gearSheet .sbtns button.auto { font: 700 12px ui-monospace, Menlo, monospace; letter-spacing: 1px; line-height: 1.15; border-color: rgba(143,224,122,.55); color: #8fe07a; text-transform: uppercase; }
#gearSheet .sbtns button.auto small { display: block; font-size: 8px; font-weight: 400; letter-spacing: .5px; color: #978c80; text-transform: none; }
#gearSheet .sbtns button.auto.off { border-color: #3a3346; color: #8a8498; }
#gearSheet .sbtns button.auto:disabled { border-color: #2c2838; color: #3a3346; }
#gearSheet .stance { display: flex; gap: 6px; margin: 4px 0 6px; }
#gearSheet .stance button { flex: 1; min-height: 44px; border-radius: 8px; border: 1px solid #2c2838; background: none; color: #b8aca0; font: 600 13px Georgia, serif; }
#gearSheet .stance button.on { border-color: #d8a040; color: #f0c880; background: rgba(216,160,64,.12); }
#gearSheet .hint { font-size: 10.5px; color: #978c80; line-height: 1.45; margin: 4px 2px 10px; }
#gearSheet .hint.warn { color: #e0a060; }
#party .card .upb { position: absolute; top: -7px; right: -4px; background: #8fe07a; color: #10200c; font-size: 8px; font-weight: 700; border-radius: 7px; padding: 1px 5px; letter-spacing: .5px; box-shadow: 0 0 8px rgba(143,224,122,.6); }
`;

const actorOf = (m) => m.actor || CLASSES[m.cls].actor;
const icon = (it) => `./assets/items/${BASES[it.base].icon}.png`;
const fmt = (k, v) => (k === 'crit' || k === 'dodge' ? `${v > 0 ? '+' : ''}${v}%` : k === 'hpr' || k === 'mpr' ? `${v > 0 ? '+' : ''}${v}/s` : `${v > 0 ? '+' : ''}${v}`);
const classNames = (B, lower) => { const l = classesOf(B).map((c) => CLASSES[c].label).join(' / ') || 'Any class'; return lower ? l.replace('Any class', 'any class') : l; };

export function createGearSheet(sim, { partyPanel, openTerms = () => {} }) {
  const style = document.createElement('style'); style.textContent = CSS; document.head.appendChild(style);
  const sheet = document.createElement('div'); sheet.id = 'gearSheet';
  const card = document.createElement('div'); card.id = 'gearCard';
  const toast = document.createElement('div'); toast.id = 'lootToast';
  document.body.append(sheet, card, toast);
  const stop = (e) => e.stopPropagation();
  for (const el of [sheet, card, toast]) for (const ev of ['pointerdown', 'touchstart', 'mousedown']) el.addEventListener(ev, stop);

  const S = sim.state;
  let open = false, who = 0, sel = null, view = 'gear';      // sel: { uid, worn: slot | null }; view: gear | stats | skills
  let pendingSel = null;                                     // an equip in flight: follow the item to its new slot
  const fresh = new Set();                                   // uids dropped since you last looked
  let note = null;                                           // { text, bad } under the card
  let armSalvage = null, armTimer = 0;                       // uid of a Fine+ item whose Salvage was tapped once

  const member = () => S.party[Math.min(who, S.party.length - 1)];
  const isUp = (m, it) => upgradeScore(m, it) > 0.05;
  const hasUpgrade = (m) => S.bag.some((it) => isUp(m, it));

  // ── the sheet ──────────────────────────────────────────────────────────────
  const slotHtml = (it, { slot, lbl, m, n = 1, isNew = fresh.has(it && it.uid) }) => {
    if (!it) return `<div class="gslot empty">${lbl ? `<span class="lbl">${lbl}</span>` : ''}</div>`;
    const wear = !m || canWear(m, it), sl = sel && sel.uid === it.uid;
    // not for this character: a small icon of the class it's for (the class of whoever in the party
    // can wear it, else the item's own). It was the first three letters of a name ("WRE", "SIG"),
    // which read as a code or as "equipped"; the icons are in classicons.js.
    const who = !wear ? S.party.find((q) => canWear(q, it)) : null, tag = !wear ? classIcon(who ? who.cls : BASES[it.base].cls) : '';
    return `<button class="gslot ${it.r}${sl ? ' sel' : ''}${wear ? '' : ' off'}" data-uid="${it.uid}" ${slot ? `data-slot="${slot}"` : ''}><img src="${icon(it)}" alt="">`
      + `${tag ? `<span class="who">${tag}</span>` : ''}${isNew ? '<span class="new">NEW</span>' : ''}${n > 1 ? `<span class="qty">×${n}</span>` : ''}`
      + `${!slot && m && isUp(m, it) ? '<span class="up">▲</span>' : ''}${lbl ? `<span class="lbl">${lbl}</span>` : ''}</button>`;
  };
  function render() {
    if (!open) return;
    const m = member(), s = statsFor(m), g = m.gear || {}, c = CLASSES[m.cls];
    const tabs = S.party.map((p, i) => `<div class="tab${i === who ? ' on' : ''}" data-who="${i}"><canvas width="${PORTRAIT_W}" height="${PORTRAIT_H}" data-actor="${actorOf(p)}"></canvas>`
      + `<div style="min-width:0"><b>${esc(p.name)}</b><span>${(CLASSES[p.cls] || CLASSES.fighter).label.toUpperCase()} · L${p.level}${p.fallen ? ' · SLAIN' : ''}</span></div>${hasUpgrade(p) || pendingPoints(p) || pendingSkillPoints(p) ? '<span class="dot"></span>' : ''}</div>`).join('');
    const col = (slots) => slots.map((sl) => slotHtml(g[sl], { slot: sl, lbl: SLOT_LABEL[sl] })).join('');
    const G = s.gear, stat = (k, v, gv) => `<div class="stat">${STAT_LABEL[k].toUpperCase()}<b>${v}</b><u class="${gv ? '' : 'z'}">${gv ? fmt(k, gv) : '—'}</u></div>`;
    const need = xpToNext(m.level), pa = pendingPoints(m), ps = pendingSkillPoints(m), stacks = bagStacks(S.bag);
    // the same green dot as the character tab, on whichever sub-tab needs you: an upgrade in the
    // bag (Gear), attribute points (Stats), skill points (Skills); it goes when that's resolved
    if (view === 'contract' && m.main) view = 'gear';
    const views = `<div class="views">${[['gear', 'Gear', hasUpgrade(m)], ['stats', 'Stats', pa > 0], ['skills', 'Skills', ps > 0], ...(m.main ? [] : [['contract', 'Contract', m.owed > 0]])].map(([k, l, due]) => `<button data-view="${k}" class="${view === k ? 'on' : ''}">${l}${due ? '<span class="dot"></span>' : ''}</button>`).join('')}</div>`;
    // a found companion (Brannoc) has more to say than a hire: talk to him from here (npcs.js)
    const talk = NPCS[m.id] && NPCS[m.id].found && !m.main ? `<button class="talkb" data-talk="${esc(m.id)}"${m.down || m.fallen ? ' disabled' : ''}>Talk to ${esc(m.name)}</button>` : '';
    const head = `<div class="grab"></div><button class="x" data-close>✕</button><div class="tabs">${tabs}</div>${views}${talk}`;
    if (view === 'stats') { sheet.innerHTML = head + statsView(m, s); card.classList.remove('on'); sel = null; paintTabs(); return; }
    if (view === 'skills') { sheet.innerHTML = head + skillsView(m); card.classList.remove('on'); sel = null; paintTabs(); return; }
    if (view === 'contract') { sheet.innerHTML = head + contractView(m); card.classList.remove('on'); sel = null; paintTabs(); return; }
    sheet.innerHTML = `${head}
      <div class="doll"><div class="col">${col(['weapon', 'off', 'trinket'])}</div>
        <div class="fig" style="--glow:${classColor(m.cls, 0.16)}"><div class="gnd"></div><canvas width="${FIGURE_W}" height="${FIGURE_H}" data-fig="${actorOf(m)}"></canvas><div class="nm">${esc(m.name.toUpperCase())} · ${c.label.toUpperCase()} · LV ${m.level}</div><div class="xpb"><i style="width:${Math.min(100, Math.round(100 * m.xp / need))}%"></i></div></div>
        <div class="col">${col(['helm', 'armor', 'boots'])}</div></div>
      <div class="stats">${stat('hp', s.maxHp, G.hp)}${stat('mp', s.maxMp, G.mp)}${stat('atk', s.atk, G.atk)}${stat('def', s.def, G.def)}${stat('crit', s.crit + '%', G.crit)}${stat('dodge', s.dodge + '%', G.dodge)}${stat('hpr', s.hpr + '/s', G.hpr)}${stat('mpr', s.mpr + '/s', G.mpr)}</div>
      <div class="bagh">Party bag · ${stacks.length}/${BAG_SIZE}<span class="cur">${S.counters.gold || 0} gold<i>✦ ${S.counters.embers || 0} cinders</i></span></div>
      <div class="bag">${stacks.map((st) => slotHtml(st.find((x) => sel && x.uid === sel.uid) || st[0], { m, n: st.length, isNew: st.some((x) => fresh.has(x.uid)) })).join('')}${Array.from({ length: Math.max(0, BAG_SIZE - stacks.length) }, () => '<div class="gslot empty"></div>').join('')}</div>`;
    paintTabs();
    const fc = sheet.querySelector('canvas[data-fig]'); if (fc) drawCharacter(fc, fc.dataset.fig);
    renderCard();
  }
  function paintTabs() { for (const cv of sheet.querySelectorAll('canvas[data-actor]')) drawPortrait(cv, cv.dataset.actor); }

  // ── the Stats tab: attributes and points (GDD §4.1) ─────────────────────────
  function statsView(m, s) {
    const a = attrsOf(m), n = pendingPoints(m), auto = !!m.autoAttrs, A = s.attr;
    const rows = ATTRS.map((k) => `<div class="arow"><div class="nm2"><b>${ATTR_LABEL[k]}</b><span>${ATTR_TEXT[k]} a point</span></div>
      <div class="val">${a[k]}</div><button class="plus" data-attr="${k}" aria-label="add a point to ${ATTR_LABEL[k]}" ${n && !auto ? '' : 'disabled'}>+</button></div>`).join('');
    const share = [['hp', A.hp, ''], ['mp', A.mp, ''], ['atk', A.atk, ''], ['def', A.def, ''], ['crit', A.crit, '%'], ['dodge', A.dodge, '%']]
      .filter(([, v]) => v).map(([k, v, u]) => `${STAT_LABEL[k]} +${Math.round(v * 10) / 10}${u}`).join(' · ');
    const G = s.gear, stat = (k, v, gv) => `<div class="stat">${STAT_LABEL[k].toUpperCase()}<b>${v}</b><u class="${gv ? '' : 'z'}">${gv ? fmt(k, gv) : '—'}</u></div>`;
    const weak = m.weakUntil > 0 ? `<div class="hint warn">Weakened: −10 % HP, MP, ATK and DEF for ${Math.max(1, Math.ceil((m.weakUntil - S.t) / 60))} more min, or until a rest at an inn.</div>` : '';
    return `<div class="ptsh">Points to spend <b>${n}</b><span class="sp"></span><button class="tog${auto ? ' on' : ''}" data-auto>${auto ? 'Auto · on' : 'Auto · off'}</button></div>
      <div class="hint">${auto ? `Auto spends each level’s 3 points on the ${CLASSES[m.cls].label.toLowerCase()} build. Turn it off to choose.` : 'Each level brings 3 points. Respec at a town temple: the first is free, then 20 gold × level.'}</div>
      ${weak}${rows}
      <div class="hint">From attributes: ${share || 'nothing yet'}${s.power ? ` · ability power +${Math.round(s.power * 1000) / 10}%` : ''}</div>
      <div class="stats">${stat('hp', s.maxHp, G.hp)}${stat('mp', s.maxMp, G.mp)}${stat('atk', s.atk, G.atk)}${stat('def', s.def, G.def)}${stat('crit', s.crit + '%', G.crit)}${stat('dodge', s.dodge + '%', G.dodge)}${stat('hpr', s.hpr + '/s', G.hpr)}${stat('mpr', s.mpr + '/s', G.mpr)}</div>
      <div class="hint" style="margin-top:10px">${m.origin ? `Origin: ${esc(originName(m.origin))} · ` : ''}${Array.isArray(m.perks) && m.perks.length ? `${esc(m.perks.map((id) => perkWord(id).name).join(', '))} · ` : ''}stance: ${STANCE_LABEL[stanceOf(m)]} (green: what gear adds)</div>`;
  }
  // ── the Contract tab: a companion's terms with the Lantern Guild (GDD §6.2) ────
  function contractView(m) {
    const terms = '<button class="terms" data-terms>How the Guild’s terms work ›</button>';
    if (!hired(m)) return `<div class="ct"><div>${rankMark(m)}</div><div class="rl">${esc(rankLine(m.rank || 'found'))}</div><h4>Perks</h4>${perkLines(m)}${terms}</div>`;
    const benched = !S.party.includes(m), w = wageOf(m, false), mods = [];
    if (m.perks.includes('thrifty')) mods.push('Thrifty −30 %'); if (m.perks.includes('greedy')) mods.push('Greedy ×1.5'); if (sworn(m)) mods.push('Sworn −25 %');
    const L = loyaltyOf(m), next = L < SWORN_AT ? LOYALTY[L + 1] - (m.bond || 0) : 0;
    const track = Array.from({ length: SWORN_AT }, (_, i) => `<span class="${i < L ? 'on' : ''}${i + 1 === REVEAL_AT || i + 1 === SWORN_AT ? ' mark' : ''}">${i + 1 === REVEAL_AT ? '3 · reveal' : i + 1 === SWORN_AT ? '5 · Sworn' : i + 1}</span>`).join('');
    return `<div class="ct"><div>${rankMark(m)}</div><div class="rl">${esc(rankLine(m.rank))}</div>
      <h4>Wage</h4><div class="ln">${w} gold a dawn in the party, ${wageOf(m, true)} on the bench${benched ? ' (where they are now)' : ''}${mods.length ? `<br><small>${esc(mods.join(' · '))}</small>` : ''}</div>
      ${m.owed > 0 ? `<div class="owed">Owed ${m.owed} gold · their perks are dark until you settle up at a tavern</div>` : ''}
      <h4>Perks</h4>${perkLines(m)}
      <h4>Loyalty · ${esc(loyaltyWord(m))}</h4><div class="track">${track}</div>
      <div class="ln"><small>${L >= SWORN_AT ? 'Sworn: a quarter off the wage, and once a room they get up from a blow that would have Downed them.' : `${next} more to loyalty ${L + 1}${L + 1 === REVEAL_AT && m.hidden ? ' (shows the perk they kept back)' : L + 1 === SWORN_AT ? ' (Sworn)' : ''}. +1 for every dawn they’re paid in your party, +1 for every boss you put down together, −2 for every dawn they’re not paid.`}</small></div>
      <h4>Retrain</h4><div class="ln"><small>${m.retrains ? `Retrained ${m.retrains} time${m.retrains > 1 ? 's' : ''}. ` : ''}The next one costs ${RETRAIN_COST * m.level * ((m.retrains || 0) + 1)} gold at a tavern.</small></div>
      ${terms}</div>`;
  }
  // where a drop came from (loot.js sources; quests.js / core.js heirlooms)
const FOUND_AT = { chest: 'in a chest', elite: 'on an elite', wave: 'after the wave', boss: 'on the boss', bossAgain: 'on the boss', quest: 'as a reward', chapter: 'as a reward', vault: 'in the vault', expedition: 'on the road, by a companion' };
// who teaches each class's trial, and where (world doc §5 v1.7, v1.30: the 12s; sim/quests.js trial_*)
const TRIAL_GIVER = { fighter: 'Osric Hale in Thornwick', rogue: 'Nell Tolley in Thornwick', mage: 'Hedda in Thornwick', cleric: 'Sister Ilse in Thornwick', shaman: 'Col the carter in Thornwick' };
const TRIAL_GIVER_12 = { fighter: 'Osric Hale in Thornwick', rogue: 'Wren, once she\'s with you', mage: 'Pim Rushlight in Saltmere', cleric: 'Mother Agnes in Saltmere', shaman: 'Col the carter in Thornwick' };
const originName = (id) => ({ thornwick_born: 'Thornwick-born', redhand_deserter: 'Redhand deserter', grey_sisters_ward: 'Ward of the Grey Sisters', deepdelver_fostered: 'Deepdelver-fostered' })[id] || id;

  // What an ability does at a rank, in this member's own numbers (GDD §5.1): the multiplier battle.js
  // casts with (skills.js skillMult: rank, Rare gear, the power stat) applied to the ability's base, and
  // for damage the ATK it comes to, before the foe's armour. The MP is the rank's, less any gear.
  const X = (v) => `${Math.round(v * 100) / 100}×`, pct = (v) => `${Math.round(v * 1000) / 10} %`;
  function effectAt(m, A, rank) {
    const s = statsFor(m), am = abilityMods(m, A.name), k = skillMult(rank, am.power, s.power || 0), dmg = (v) => `${X(v)} ATK (${Math.round(s.atk * v)})`;
    const mp = Math.max(0, rankCost(A, rank) - am.cost);
    // e: the whole effect; v: only what a rank changes (for the next-rank line)
    let e, v;
    if (A.kind === 'strike') {
      v = dmg(A.power * k); e = v + (m.cls === 'mage' || m.cls === 'shaman' ? ' at range' : '');
      if (A.splash) { e += ` to the target, ${dmg(A.splash * k)} to those beside it`; v += `, ${dmg(A.splash * k)} beside`; }
      if (A.crit) e += `, +${A.crit} % crit chance`;
      if (A.poison) { e += `, then poison: ${dmg(A.poison * k)} a second for ${A.pdur} s`; v += `, poison ${dmg(A.poison * k)} a second`; }
      if (A.drain) { const cap = A.dmax + (hasPassive(m) ? OLD_WAYS_STACKS : 0); e += `, then a drain of ${dmg(A.drain * k)} a second a stack for ${A.ddur} s, up to ${cap} stacks; ${Math.round(DRAIN_MEND * 100)} % of it mends the most hurt ally`; v += `, drain ${dmg(A.drain * k)} a stack`; }
    } else if (A.kind === 'guard') { v = A.taunt ? `+${pct(A.def * k)} DEF` : `+${Math.round(A.dodge * k * 10) / 10} % DODGE`; e = `${v} for ${A.dur} s; ${A.taunt ? 'foes turn on you' : 'foes lose you'}`; }
    else if (A.kind === 'heal') { const h = A.heal * k * healMod(m, S.party); v = `heal ${pct(h)} of max HP (${Math.round(s.maxHp * h)} HP)`; e = v; }
    else if (A.kind === 'mend') { v = `heal ${pct(A.heal * k * (m.cls === 'cleric' ? HEAL_BONUS : 1) * healMod(m, S.party))} of their max HP`; e = `the most hurt ally: ${v}`; }
    else if (A.kind === 'ward') { v = `shield ${pct(A.ward * k)} of their max HP`; e = `the most hurt ally: ${v}`; }
    else if (A.kind === 'nova') { v = dmg(A.power * k); e = `${v} to every ${A.undead ? 'Ashbound' : 'foe'} within ${A.radius} tiles${A.undead ? ' (not the living)' : ''}${A.slow ? `; slows them for ${A.slow} s` : ''}`; }
    else if (A.kind === 'bless') { v = `+${pct(A.buff * k)} ATK and DEF`; e = `the whole party: ${v} for ${A.dur} s`; }
    else if (A.kind === 'breath') { v = `${pct(A.hot * k * healMod(m, S.party))} of max HP a second, +${pct(A.buff * k)} ATK`; e = `the whole party: ${v} for ${A.dur} s`; }
    else if (A.kind === 'hex') { v = `−${pct(Math.min(0.4, A.debuff * k))} ATK and DEF`; e = `the foes within ${A.radius} tiles of a knot of them (or a boss or elite alone): ${v} for ${A.dur} s`; }
    else { e = A.text; v = ''; }
    return { mp, e, v };
  }

  // ── the Skills tab: ranks, auto-cast, priority, the passive, the stance (GDD §5.1) ──
  function skillsView(m) {
    const c = CLASSES[m.cls], n = pendingSkillPoints(m), order = priorityOf(m), P = PASSIVES[m.cls], st = stanceOf(m);
    const rows = order.map((A, i) => {
      const r = rankOf(m, A.id), open = unlocked(m, A, S.trials), on = autocastOn(m, A.id);
      const pips = '●'.repeat(r) + `<s>${'●'.repeat(MAX_RANK - r)}</s>`;
      return `<div class="arow${open ? '' : ' locked'}"><div class="nm2"><b>${A.name}</b> <span class="pips">${pips}</span>
          ${(() => { const now = effectAt(m, A, r), nx = open && r < MAX_RANK ? effectAt(m, A, r + 1) : null;
            const lock = open ? '' : `<span>${m.level < A.lv ? `unlocks at level ${A.lv}${A.trial ? `, with the ${c.label.toLowerCase()}'s ${A.lv >= 12 ? 'second ' : ''}trial` : ''}` : `the ${c.label.toLowerCase()}'s ${A.lv >= 12 ? 'second ' : ''}trial teaches it: ask ${(A.lv >= 12 ? TRIAL_GIVER_12 : TRIAL_GIVER)[m.cls]}`}</span>`;
            return `${lock}<span class="eff">Rank ${r}: ${now.mp} MP · ${now.e}</span>${nx ? `<span class="nx">Rank ${r + 1} → ${nx.mp !== now.mp ? `${nx.mp} MP · ` : ''}${nx.v}</span>` : open ? '<span class="nx">Top rank</span>' : ''}`; })()}</div>
        <div class="sbtns"><button data-rank="${A.id}" ${open && n && r < MAX_RANK ? '' : 'disabled'}>${r >= MAX_RANK ? 'Max' : 'Rank +'}</button>
          <button class="auto${on ? '' : ' off'}" data-cast="${A.id}" aria-label="use ${A.name} automatically in combat: ${on ? 'on' : 'off'}" ${open ? '' : 'disabled'}><small>Auto-use</small>${on ? 'On' : 'Off'}</button></div>
        <div class="sbtns"><button data-up="${A.id}" aria-label="cast ${A.name} earlier" ${i ? '' : 'disabled'}>▲</button></div></div>`;
    }).join('');
    return `<div class="ptsh">Skill points <b>${n}</b><span class="sp">one at every even level</span></div>
      <div class="hint">In battle each turn goes to the first ability, top down, that is ready, affordable and worth it. ▲ moves one earlier. Auto-use On: the hero casts it in combat by themselves; Off: never. Each rank adds 10 % to an ability's strength; damage is shown before the foe's armour.</div>
      ${rows}
      <div class="arow${hasPassive(m) ? '' : ' locked'}"><div class="nm2"><b>${P.name}</b> <span class="pips">passive</span><span>${hasPassive(m) ? P.text : `level ${P.lv}: ${P.text}`}</span></div></div>
      <div class="bagh" style="margin-top:14px">Stance</div>
      <div class="stance">${STANCES.map((k) => `<button data-stance="${k}" class="${k === st ? 'on' : ''}">${STANCE_LABEL[k]}</button>`).join('')}</div>
      <div class="hint">${STANCE_TEXT[st]}</div>`;
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
    const stackN = worn ? 1 : (bagStacks(S.bag).find((q) => q.includes(it)) || [it]).length;
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
    const clsName = classNames(B);
    let warn = '';
    if (!worn && wearer && isTwoHanded(it) && wearer.gear.off) warn = `⚠ Two-handed: ${wearer.gear.off.name} goes to the bag`;
    if (!worn && wearer && B.slot === 'off' && isTwoHanded(wearer.gear.weapon)) warn = `⚠ ${wearer.gear.weapon.name} needs both hands`;
    let btns;
    if (isUsable(it)) {                                    // a scroll: read it, not wear it (core.js useItem)
      const town = sim.world.kind === 'town';
      lines.push(`<div class="ln">Read it and the party is on the town square at once. It works once.${town ? ' <em>You are in town.</em>' : ''}</div>`);
      btns = `<button class="gbtn pri" data-act="use" ${town ? 'disabled' : ''}>Read it · home</button><button class="gbtn ghost" data-act="close">Close</button>`;
    } else if (worn) btns = `<button class="gbtn" data-act="unequip">Unequip</button><button class="gbtn ghost" data-act="close">Close</button>`;
    else {
      const eq = wearer ? `<button class="gbtn pri" data-act="equip" data-to="${wearer.id}">${wearer === m ? 'Equip' : `Give to ${esc(wearer.name)}`}</button>` : '';
      const armed = armSalvage === it.uid;
      btns = `${eq}<button class="gbtn${armed ? ' arm' : ''}" data-act="salvage">${armed ? `Sure? ✦${SALVAGE[it.r]}` : `Salvage ✦${SALVAGE[it.r]}`}</button><button class="gbtn ghost" data-act="close">Close</button>`;
    }
    card.innerHTML = `<div class="hd"><div class="big" style="border-color:${RC[it.r]}"><img src="${icon(it)}" alt=""></div>
      <div><h3 style="color:${RC[it.r]}">${it.name}${stackN > 1 ? ` <small>×${stackN}</small>` : ''}</h3><div class="meta"><em style="color:${RC[it.r]}">${it.r}</em> · item level ${it.ilv}<br>${SLOT_LABEL[B.slot]} · ${B.hands === 2 ? 'two-handed ' : ''}${B.kind} · ${clsName}</div></div></div>
      ${cmp ? `<div class="cmphd"><span>this item</span><span>vs ${wearer === m ? 'equipped' : esc(wearer.name) + "'s"}</span></div>` : ''}
      <div class="lines">${lines.join('')}</div>
      ${warn ? `<div class="note">${warn}</div>` : ''}${note ? `<div class="note${note.bad ? ' bad' : ''}">${note.text}</div>` : ''}
      ${it.flav ? `<div class="flav">${it.flav}</div>` : ''}<div class="gbtns">${btns}</div>`;
    card.classList.add('on');
  }

  // ── input ──────────────────────────────────────────────────────────────────
  sheet.addEventListener('click', (e) => {
    if (e.target.closest('[data-close]')) { close(); return; }
    const tk = e.target.closest('[data-talk]'); if (tk) { close(); sim.commands.push({ type: 'talk', npc: tk.dataset.talk }); return; }
    const v = e.target.closest('[data-view]'); if (v) { view = v.dataset.view; sel = null; note = null; render(); return; }
    if (e.target.closest('[data-terms]')) { openTerms(); return; }
    const m = member(), q = (sel2) => e.target.closest(sel2);
    let t;
    if ((t = q('[data-attr]'))) { sim.commands.push({ type: 'spendPoint', id: m.id, attr: t.dataset.attr }); return; }
    if (q('[data-auto]')) { sim.commands.push({ type: 'setAutoAttrs', id: m.id, on: !m.autoAttrs }); return; }
    if ((t = q('[data-rank]'))) { sim.commands.push({ type: 'rankSkill', id: m.id, skill: t.dataset.rank }); return; }
    if ((t = q('[data-cast]'))) { sim.commands.push({ type: 'setAutocast', id: m.id, skill: t.dataset.cast, on: !autocastOn(m, t.dataset.cast) }); return; }
    if ((t = q('[data-stance]'))) { sim.commands.push({ type: 'setStance', id: m.id, stance: t.dataset.stance }); return; }
    if ((t = q('[data-up]'))) {
      const ids = priorityOf(m).map((A) => A.id), i = ids.indexOf(t.dataset.up);
      if (i > 0) { [ids[i - 1], ids[i]] = [ids[i], ids[i - 1]]; sim.commands.push({ type: 'setPriority', id: m.id, order: ids }); }
      return;
    }
    const tab = e.target.closest('.tab'); if (tab) { who = +tab.dataset.who; sel = null; note = null; render(); return; }
    const b = e.target.closest('.gslot[data-uid]'); if (!b) return;
    sel = { uid: b.dataset.uid, worn: b.dataset.slot || null }; fresh.delete(b.dataset.uid); note = null; render();
  });
  card.addEventListener('click', (e) => {
    const b = e.target.closest('[data-act]'); if (!b) return;
    const it = findSel(), m = member(), act = b.dataset.act; note = null;
    if (act === 'close' || !it) { sel = null; render(); return; }
    if (act === 'use') { sim.commands.push({ type: 'useItem', uid: it.uid }); sel = null; close(); return; }
    if (act === 'equip') { sim.commands.push({ type: 'equip', member: b.dataset.to, uid: it.uid }); pendingSel = { uid: it.uid, to: b.dataset.to }; }
    if (act === 'unequip') sim.commands.push({ type: 'unequip', member: m.id, slot: sel.worn });
    if (act === 'salvage') {
      // Fine and better ask twice (salvage can't be undone); the second tap within 3 s confirms
      if (it.r !== 'common' && armSalvage !== it.uid) {
        armSalvage = it.uid; clearTimeout(armTimer); armTimer = setTimeout(() => { armSalvage = null; if (open) renderCard(); }, 3000);
        renderCard(); return;
      }
      const rest = (bagStacks(S.bag).find((q) => q.includes(it)) || []).filter((x) => x !== it);   // a stack: the next one stays selected
      armSalvage = null; clearTimeout(armTimer); sim.commands.push({ type: 'salvage', uid: it.uid }); sel = rest.length ? { uid: rest[0].uid, worn: null } : null;
    }
  });
  // after an equip lands the item card closes, on the tab of whoever now wears it; a refusal
  // (bag full, two hands…) keeps the card open with the reason
  sim.bus.on('gearChanged', () => {
    if (pendingSel) { const i = S.party.findIndex((q) => q.id === pendingSel.to); const w = S.party[i]; const slot = w && Object.keys(w.gear).find((k) => w.gear[k] && w.gear[k].uid === pendingSel.uid);
      if (slot) { who = i; sel = null; } pendingSel = null; }
    else if (sel && sel.worn) sel = null;
    render(); partyPanel.refresh && partyPanel.refresh();
  });
  sim.bus.on('gearRefused', ({ reason }) => { pendingSel = null; note = { text: reason, bad: true }; if (open) renderCard(); else showToastText(reason); });
  sim.bus.on('partyChanged', () => { if (who >= S.party.length) who = 0; render(); });
  sim.bus.on('levelUp', render);

  function openSheet(i = 0, v = 'gear') { who = i; view = v; sel = null; note = null; open = true; sheet.classList.add('on'); hideToast(); render(); }
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
      up = `<div class="s">Upgrade for <span style="color:#efe4cf">${esc(m.name)}</span>${d.length ? ': <b>' + d.map(([k, v]) => `▲ ${STAT_LABEL[k]} ${fmt(k, v)}`).join(' · ') + '</b>' : ''}</div>`;
    }
    toastItem = item;
    toast.style.borderColor = RC[item.r];
    toast.innerHTML = `<div class="t">✦ Found ${FOUND_AT[src] || 'after the wave'}</div>
      <div class="hd"><div class="big" style="border-color:${RC[item.r]}"><img src="${icon(item)}" alt=""></div><div style="min-width:0"><h3 style="color:${RC[item.r]}">${item.name}</h3>
      <div class="s">${item.r[0].toUpperCase() + item.r.slice(1)} · ${SLOT_LABEL[B.slot]} · ${classNames(B, true)} · ilv ${item.ilv}</div>${up}</div></div>
      <div class="gbtns">${m ? `<button class="gbtn pri" data-to="${m.id}">Equip on ${esc(m.name)}</button>` : `<button class="gbtn pri" data-look>Compare gear</button>`}<button class="gbtn" data-bag>Keep in bag</button></div>`;
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
