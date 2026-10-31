// cards.js — Emberfall's player cards in Luminati's fights (docs/lumina-prototype.md §9). The owner: "keep the old
// player tiles HUD in the same locations both portrait and landscape" (the Luminati prototype: our cards instead of
// Luminati's frames). The game's party cards (src/ui/party.js) along the bottom of the screen: you in the middle, your
// companions either side, each with a portrait, the level, the name and class, an HP bar, four numbers and a level bar.
// Here they are in the same place whether the phone is upright or on its side (the game's landscape column is not
// carried over), a row as wide as the screen, at most 760 px, centred.
//   · on a combat level only (Luminati shows its vitals only there); its vitals (top left) and party frames give way;
//   · the numbers are Luminati's (CombatSystem state, MemberCombat.info): HP, ATK, DEF, MP and SP for you, ATK, DEF, MP
//     and kills for a companion; the portrait is the face of whoever the sprite is drawn as (sheets.js: our atlases);
//   · Luminati's own bottom pieces (its skill bar, the loot feed, the folded controls' tab) and our Talk and Auto buttons
//     step up by the cards' height (--ember-cards-h), so nothing sits under them.
// Read a few times a second; a card is rebuilt only when what it shows has changed (no re-render under a finger, A3).
const ACTORS = new URL('../assets/actors/', document.baseURI).href;
const HERO_NAMES = { hero_knight: 'Knight', hero_barbarian: 'Barbarian', hero_rogue: 'Rogue', hero_mage: 'Mage', hero_cleric: 'Cleric', hero_shaman: 'Shaman', hero_wren: 'Wren', hero_brannoc: 'Brannoc' };
const CLASS_NAMES = { warden: 'Warden', ranger: 'Ranger', mystic: 'Mystic', cleric: 'Cleric', icemage: 'Ice Mage', greatshield: 'Greatshield' };

const CSS = `
#ember-party { position: fixed; left: 0; right: 0; bottom: 0; z-index: 45; display: none; pointer-events: none;
  padding: 6px max(8px, env(safe-area-inset-right, 0px)) max(calc(env(safe-area-inset-bottom, 0px) - 14px), 8px) max(8px, env(safe-area-inset-left, 0px));
  background: linear-gradient(rgba(10,8,14,0), rgba(10,8,14,0.92) 22%); font-family: ui-monospace, 'SF Mono', Menlo, Consolas, monospace; color: #d8d2c6; }
#ember-party .row { display: grid; grid-template-columns: 1fr 1.08fr 1fr; gap: 6px; max-width: 760px; margin: 0 auto; }
body.ember-cards #ember-party { display: block; }
#ember-party .card { position: relative; background: rgba(14,12,20,0.94); border: 1px solid #2c2838; border-radius: 3px; padding: 6px 7px 7px; min-width: 0; }
#ember-party .card.main { border-color: #a07a3c; box-shadow: inset 0 0 0 1px rgba(160,122,60,0.25); }
#ember-party .card.down { opacity: .55; filter: grayscale(.8); }
#ember-party .card.down .hp span { color: #ff8a7a; }
#ember-party .card.empty { border: 1px dashed #3a3448; background: rgba(14,12,20,0.6); display: flex; align-items: center; justify-content: center;
  text-align: center; font-size: 9.5px; color: #6f6880; letter-spacing: .5px; line-height: 1.35; }
#ember-party .top { display: flex; gap: 6px; align-items: center; margin-bottom: 5px; }
#ember-party .pf { position: relative; width: 34px; height: 40px; flex: none; background: #0c0a12; border: 1px solid #2c2838; overflow: hidden; }
#ember-party .pf img { width: 100%; height: 100%; object-fit: cover; image-rendering: pixelated; }
#ember-party .lv { position: absolute; left: -1px; bottom: -1px; background: #b8862e; color: #1a1208; font-size: 8px; font-weight: 700; padding: 0 2px; }
#ember-party .nm { font-size: 11px; letter-spacing: 1.5px; font-weight: 700; color: #ece6da; text-transform: uppercase; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
#ember-party .cl { font-size: 9px; letter-spacing: 1px; color: #8a8498; margin-top: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
#ember-party .hp { position: relative; height: 11px; background: #1c1a22; border: 1px solid #2c2838; margin-bottom: 5px; }
#ember-party .hp i { position: absolute; left: 0; top: 0; bottom: 0; background: #5aa35c; }
#ember-party .hp span { position: absolute; right: 3px; top: -1px; font-size: 8.5px; color: #f2f0ea; text-shadow: 0 1px 0 #000; }
#ember-party .st { display: grid; grid-template-columns: auto 1fr auto 1fr; gap: 2px 4px; font-size: 9px; color: #8a8498; letter-spacing: 1px; }
#ember-party .st b { color: #e8e2d4; font-weight: 600; text-align: right; }
#ember-party .xp { display: flex; align-items: center; gap: 5px; margin-top: 5px; font-size: 9px; color: #c09a50; letter-spacing: 1px; }
#ember-party .xp div { flex: 1; height: 3px; background: #26222e; position: relative; }
#ember-party .xp div i { position: absolute; left: 0; top: 0; bottom: 0; background: #d8a040; }
/* Luminati's vitals and party frames give way; its bottom pieces and our buttons step up over the cards */
body.ember-cards .lu-root .lu-vitals, body.ember-cards .lu-root .lu-pframes { display: none !important; }
body.ember-cards .lu-root .lu-skills, body.ember-cards .lu-root .lu-loot, body.ember-cards .lu-root .lu-help-tab { translate: 0 calc(-1 * var(--ember-cards-h, 0px)); }
body.ember-cards #ember-talk { bottom: calc(var(--ember-cards-h, 0px) + 96px) !important; }
body.ember-cards #ember-auto { bottom: calc(var(--ember-cards-h, 0px) + 172px) !important; }
/* a short screen (a phone on its side): Auto beside Talk, not over it, clear of the clock */
@media (max-height: 520px) { body.ember-cards #ember-auto { bottom: calc(var(--ember-cards-h, 0px) + 104px) !important; right: calc(90px + env(safe-area-inset-right, 0px)) !important; } }`;

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const actorOf = (sprite) => /^ember:([a-z0-9_]+)/.exec(sprite?.sheet?.texture?.name || '')?.[1] ?? null;
const pct = (a, b) => (b > 0 ? Math.max(0, Math.min(100, Math.round((100 * a) / b))) : 0);
const r = (v) => Math.round(v);

/** a card's HTML from what it shows (a plain object: compared as JSON before anything is rebuilt) */
function cardHtml(c) {
  if (!c) return '<div class="card empty">empty slot</div>';
  const face = c.actor ? `<img alt="" src="${ACTORS}${c.actor}.face.png" onerror="this.style.visibility='hidden'">` : '';
  return `<div class="card${c.main ? ' main' : ''}${c.down ? ' down' : ''}" data-id="${esc(c.id)}">
    <div class="top"><div class="pf">${face}<div class="lv">L${c.level}</div></div>
      <div style="min-width:0"><div class="nm">${esc(c.name)}</div><div class="cl">${esc(c.cls)}</div></div></div>
    <div class="hp"><i style="width:${pct(c.hp, c.hpMax)}%"></i><span>${c.down ? 'DOWN' : `${c.hp}/${c.hpMax}`}</span></div>
    <div class="st">${c.stats.map(([k, v]) => `<span>${k}</span><b>${esc(v)}</b>`).join('')}</div>
    <div class="xp">LV ${c.level}<div><i style="width:${c.xp ?? 0}%"></i></div></div></div>`;
}

let root = null, row = null, slots = [], shown = ['', '', ''];
function mount() {
  const style = document.createElement('style'); style.textContent = CSS; document.head.append(style);
  root = document.createElement('div'); root.id = 'ember-party';
  root.innerHTML = '<div class="row"><div></div><div></div><div></div></div>';
  row = root.firstElementChild; slots = [...row.children];
  document.body.append(root);
  new ResizeObserver(() => document.documentElement.style.setProperty('--ember-cards-h', `${root.offsetHeight}px`)).observe(root);
}

function tick() {
  const G = /** @type {any} */ (window).__game, C = G?.combat;
  document.body.classList.toggle('ember-cards', !!C);
  if (!C || !root) return;
  const p = C.state().player, actor = actorOf(G.player?.sprite);
  const you = { id: 'you', main: true, actor, level: p.level, name: HERO_NAMES[actor] || 'You', cls: 'Hero', hp: r(p.hp), hpMax: r(p.hpMax), down: p.hp <= 0,
    stats: [['ATK', r(p.atk)], ['DEF', r(p.def)], ['MP', `${r(p.mp)}`], ['SP', `${r(p.sp)}`]], xp: pct(p.xp, p.xpNext) };
  const allies = C.system.allies.map((a) => { const i = a.info(); return { id: i.id, main: false, actor: actorOf(a.member?.sprite), level: i.level, name: i.name || i.id,
    cls: CLASS_NAMES[i.cls] || i.cls, hp: r(i.hp), hpMax: r(i.hpMax), down: !!i.down, stats: [['ATK', r(i.atk)], ['DEF', r(i.def)], ['MP', `${r(i.mp)}`], ['KO', `${i.kills}`]], xp: null }; });
  // (the game's order: a companion, you in the middle, a companion)
  const cards = [allies[0] ?? null, you, allies[1] ?? null];
  cards.forEach((c, k) => { const h = cardHtml(c); if (h !== shown[k]) { slots[k].outerHTML = h; slots[k] = row.children[k]; shown[k] = h; } });
}

if (document.body) mount(); else addEventListener('DOMContentLoaded', mount);
setInterval(tick, 200);
/** (for checks) */
Object.assign(globalThis, { __emberCards: { tick, get shown() { return root ? [...row.children].map((el) => el.dataset.id ?? 'empty') : []; } } });
