// townmenu.js — the town square as a home screen. The square is laid out the same in every
// town (outdoor.js). Once the hero is near it (world.hub), a bar of the five services slides
// up — Shop, Smith, Tavern, Inn, Temple — and tapping one (or its building) opens that
// service's menu as a bottom sheet. Away from the square the services aren't reachable. The actions are the GDD's
// (emberfall-gdd.md §10); the live ones today: the tavern's quest board (the Lantern Guild's
// jobs, sim/board.js) and hiring board, the temple (raise the slain, respec) and the inn (rest,
// the party and bench). The rest are placeholders until
// each system lands. DOM only; reads sim state and sends commands, never writes state.

const SERVICES = {
  shop: {
    label: 'Shop', blurb: 'Wendel’s: plain arms and armour at your level, new each dawn, and a fair price for what you carry.',
    actions: [['Buy', 'plain arms and armour for your company, new each dawn'], ['Sell', 'gold for what you carry · buy back what you sold']],
    icon: '<path d="M4 9h16l-1 11H5zM8 9V7a4 4 0 0 1 8 0v2"/>',
  },
  smith: {
    label: 'Smith', blurb: 'The forge: upgrade your gear, reforge its traits, and salvage what you can’t use.',
    actions: [['Upgrade', '+1 to +5 at the forge · gold, cinders, wood, stone'], ['Reforge', 'reroll one trait on a Fine or better piece'], ['Salvage', 'turn gear you won’t use into cinders']],
    icon: '<path d="M3 9h11l3-3h4v3l-3 2v2H9l-2 3H5l1-3H3z"/>',
  },
  tavern: {
    label: 'Tavern', blurb: 'The Lantern Guild’s quest board, sellswords for hire, and rumours over a pint.',
    actions: [['Quest board', 'the Lantern Guild’s mini-quests for this region'], ['Hire companions', 'two party slots · today’s sellswords'], ['Rumours', 'hooks, lore and where the dead are stirring']],
    icon: '<path d="M5 6h10v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2zM15 9h2a2 2 0 0 1 0 6h-2M6 3c1 1 2 1 3 0 1 1 2 1 3 0 1 1 2 1 3 0v3H6z"/>',
  },
  inn: {
    label: 'Inn', blurb: 'Rest, lodge the companions you’re not taking, and send parties out while you’re away.',
    actions: [['Rest', 'restore HP and MP · lifts Weakened'], ['Party & bench', 'your three hero slots and the companions who wait here'], ['Expeditions', 'send a party to farm a room while you’re offline']],
    icon: '<path d="M3 18V7M3 13h18v5M21 18v-3M6 13v-2a2 2 0 0 1 2-2h3v4M12 9h6a3 3 0 0 1 3 3v1"/>',
  },
  temple: {
    label: 'Temple', blurb: 'Raise the slain, set a body and mind back to how they began, take a blessing before the road, and read the Chronicle of the Fall.',
    actions: [['Raise the slain', 'companions who were slain, back on their feet'], ['Respec', 'unlearn your attribute points and spend them again'], ['Blessings', 'a boon for your next expedition'], ['The Chronicle', 'lore fragments you’ve found, by region']],
    icon: '<path d="M12 3c2 3 5 5 5 9a5 5 0 0 1-10 0c0-2 1-3 2-4 0 2 1 3 2 3 0-3-1-5 1-8z"/>',
  },
};
const ORDER = ['shop', 'smith', 'tavern', 'inn', 'temple'];
import { CLASSES, statsFor, MAX_COMPANIONS, hireLevel } from '../sim/party.js';
import { BENCH_MAX, FREE_RES_LEVEL } from '../sim/heroes.js';
import { pointsSpent } from '../sim/attributes.js';
import { esc } from './actorart.js';
import { MAX_JOBS } from '../sim/board.js';
import { QS } from '../sim/quests.js';
import { boardWords, boardReady, SKULLS } from './boardwords.js';
import { feeOf, wageOf, hired, PERKS } from '../sim/companions.js';
import { rankMark, perkLines, loyaltyWord, wageLine, perkWord, rankLine, wordsReady, SW_CSS } from './sellswords.js';
import { BASES, SLOT_LABEL, STAT_LABEL, UP_MAX, itemStats, classesOf } from '../sim/items.js';
import { upgradeCost, reforgeCost, salvageOf, sellPrice, buyPrice } from '../sim/smith.js';
import { isUsable, SCROLL_PRICE } from '../sim/items.js';

const CSS = SW_CSS + `
#hubBar { position: fixed; left: var(--party-side, 0px); right: 0; bottom: calc(env(safe-area-inset-bottom, 0px) + 10px);
  display: flex; justify-content: center; gap: 8px; padding: 0 10px; transform: translateY(24px); opacity: 0; visibility: hidden; pointer-events: none;
  transition: transform .28s ease, opacity .2s ease, visibility 0s linear .28s; z-index: 5; }
#hubBar.on { transform: none; opacity: 1; visibility: visible; pointer-events: auto; transition: transform .28s ease, opacity .2s ease; }
#hubBar button { flex: 1; min-width: 0; max-width: 76px; background: rgba(16,12,22,0.86); border: 1px solid rgba(214,170,98,0.45); border-radius: 10px;
  color: #eadcc0; font: 600 11px Georgia, 'Times New Roman', serif; letter-spacing: .5px; padding: 8px 4px 7px; display: flex; flex-direction: column; align-items: center; gap: 4px; }
#hubBar button svg { width: 22px; height: 22px; fill: none; stroke: #e0a85a; stroke-width: 1.6; stroke-linejoin: round; stroke-linecap: round; }
#hubBar button:active { background: rgba(60,40,30,0.9); }
#hubSheet { position: fixed; left: 0; right: 0; bottom: 0; z-index: 6; max-height: 82vh; overflow-y: auto; transform: translateY(105%); transition: transform .3s ease;
  background: linear-gradient(#1a1422, #120e18); border-top: 1px solid rgba(214,170,98,0.5); border-radius: 16px 16px 0 0;
  padding: 16px 18px calc(env(safe-area-inset-bottom, 0px) + 18px); color: #e8e0d0; font-family: Georgia, 'Times New Roman', serif; box-shadow: 0 -10px 30px rgba(0,0,0,.5); }
#hubSheet.on { transform: none; }
#hubSheet .kind { font: 11px ui-monospace, Menlo, monospace; letter-spacing: 2px; color: #a08a6a; text-transform: uppercase; }
#hubSheet h2 { font-size: 21px; color: #f0c880; margin: 2px 0 6px; font-weight: 600; }
#hubSheet p { font-size: 13px; color: #b8aca0; line-height: 1.35; margin-bottom: 12px; }
#hubSheet .row { display: flex; align-items: center; justify-content: space-between; padding: 11px 12px; margin-bottom: 7px;
  background: rgba(255,255,255,0.035); border: 1px solid rgba(214,170,98,0.18); border-radius: 9px; }
#hubSheet .row b { font-size: 15px; color: #efe4cf; font-weight: 600; display: block; }
#hubSheet .row span { font-size: 11.5px; color: #978c80; }
#hubSheet .soon { font: 10px ui-monospace, Menlo, monospace; color: #7c6e88; border: 1px solid #4a3f58; border-radius: 6px; padding: 2px 6px; flex: none; margin-left: 10px; }
#hubSheet .row.go { cursor: pointer; border-color: rgba(214,170,98,0.45); }
#hubSheet .go-arrow { color: #e0a85a; font-size: 18px; margin-left: 10px; }
#hubSheet h3 { font: 11px ui-monospace, Menlo, monospace; letter-spacing: 2px; color: #a08a6a; text-transform: uppercase; margin: 14px 0 7px; }
#hubSheet .merc { display: flex; align-items: center; gap: 10px; padding: 10px 12px; margin-bottom: 7px; background: rgba(255,255,255,0.035); border: 1px solid rgba(214,170,98,0.18); border-radius: 9px; }
#hubSheet .merc .who { flex: 1; min-width: 0; }
#hubSheet .merc .who b { font-size: 15px; color: #efe4cf; font-weight: 600; }
#hubSheet .merc .who em { font-style: normal; font: 10.5px ui-monospace, Menlo, monospace; color: #c09a50; margin-left: 6px; }
#hubSheet .merc .who span { display: block; font: 10.5px ui-monospace, Menlo, monospace; color: #978c80; margin-top: 3px; }
#hubSheet .btn { flex: none; font: 600 12px Georgia, serif; color: #1a1208; background: #d8a040; border: 0; border-radius: 7px; padding: 8px 12px; }
#hubSheet .btn.ghost { background: transparent; color: #d8a040; border: 1px solid rgba(214,170,98,0.5); }
#hubSheet .btn:disabled { background: #3a3444; color: #7a7088; }
#hubSheet .back { font: 12px Georgia, serif; color: #d8a040; background: none; border: 0; padding: 0; margin-bottom: 6px; }
#hubSheet .note { font-size: 12px; color: #ff8a7a; margin: -4px 0 10px; min-height: 0; }
/* the Lantern Guild's board: one card per job, pinned paper on the tavern wall */
#hubSheet .jobs-top { font: 11px ui-monospace, Menlo, monospace; color: #b8aca0; letter-spacing: .5px; margin: -4px 0 8px; }
#hubSheet .job { padding: 11px 12px 12px; margin-bottom: 9px; border-radius: 10px; background: rgba(240,224,190,0.05); border: 1px solid rgba(214,170,98,0.28); }
#hubSheet .job.ready { border-color: #8fe07a; background: rgba(143,224,122,.07); }
#hubSheet .job.taken { opacity: .72; }
#hubSheet .job .jt { display: flex; align-items: baseline; gap: 8px; }
#hubSheet .job .jt b { flex: 1; min-width: 0; font-size: 16px; color: #f0c880; font-weight: 600; }
#hubSheet .job .sk { flex: none; font: 700 10.5px ui-monospace, Menlo, monospace; font-style: normal; letter-spacing: .5px; padding: 2px 6px; border-radius: 4px; }
#hubSheet .job .sk.s1 { background: #26351f; color: #b8e0a0; } #hubSheet .job .sk.s2 { background: #3f2a10; color: #ffc060; } #hubSheet .job .sk.s3 { background: #481512; color: #ff8a7a; }
#hubSheet .job .co { font: 700 10.5px ui-monospace, Menlo, monospace; color: #ffc060; margin-top: 3px; }
#hubSheet .job .by { font: 10.5px ui-monospace, Menlo, monospace; color: #978c80; margin: 2px 0 6px; }
#hubSheet .job .hook { font-size: 14px; line-height: 1.4; color: #d8ccb8; font-style: italic; }
#hubSheet .job .brief { font-size: 13.5px; color: #efe4cf; margin-top: 8px; }
#hubSheet .job .brief:before { content: '◆ '; color: #e0a84a; }
#hubSheet .job .rw { font: 11px ui-monospace, Menlo, monospace; color: #c09a50; margin-top: 4px; }
#hubSheet .job .btn { display: block; width: 100%; min-height: 44px; margin-top: 10px; font-size: 14px; }
#hubSheet .job .btn.in { background: #8fe07a; }
#hubSheet .merc.fallen .who b { color: #b8c4d8; }
#hubSheet .merc .btn { min-height: 44px; }
#hubSheet .merc.sw { align-items: flex-start; }
#hubSheet .merc .who .sub { display: block; font: 10.5px ui-monospace, Menlo, monospace; color: #c0b090; margin-top: 6px; }
#hubSheet .merc .who .owed { display: block; font: 700 11px ui-monospace, Menlo, monospace; color: #ff9a8a; margin-top: 5px; }
#hubSheet .merc .who .rl { display: block; font: italic 11.5px Georgia, serif; color: #a8a090; margin-top: 3px; }
#hubSheet .purse { font: 11.5px ui-monospace, Menlo, monospace; color: #c8bca8; margin: -4px 0 10px; line-height: 1.5; }
#hubSheet .purse b { color: #ffd890; }
#hubSheet .row.warn { border-color: rgba(255,138,122,.6); background: rgba(255,120,100,.07); }
#hubSheet .row.warn b { color: #ffb0a0; }
#hubSheet .subtabs { display: flex; gap: 6px; margin: 2px 0 10px; }
#hubSheet .subtabs button { flex: 1; min-height: 46px; border-radius: 10px; border: 1px solid rgba(214,170,98,.4); background: rgba(255,255,255,.03); color: #c8b896; font: 600 13px Georgia, serif; padding: 4px 6px; }
#hubSheet .subtabs button.on { background: linear-gradient(#e0a84a, #b67c2a); color: #1a1208; border-color: #f0c880; }
#hubSheet .subtabs small { display: block; font: 10.5px ui-monospace, Menlo, monospace; font-weight: 400; opacity: .85; margin-top: 1px; }
#hubSheet .full { font: 11px ui-monospace, Menlo, monospace; color: #e0c080; background: rgba(216,160,64,.1); border: 1px solid rgba(216,160,64,.35); border-radius: 8px; padding: 7px 10px; margin: 0 0 9px; line-height: 1.45; }
#hubSheet .merc.bench { border-style: dashed; }
#hubSheet .btn small { display: block; font: 10px ui-monospace, Menlo, monospace; font-weight: 400; }
#hubSheet .btn.warnb { background: #c0584a; color: #fff; }
#hubSheet .hint2 { font-size: 12px; color: #a89c88; margin: -2px 0 10px; }
#hubSheet .merc .who .nx { display: block; font: 11px ui-monospace, Menlo, monospace; color: #8fb8e0; margin-top: 3px; }
#hubSheet .aff { display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-top: 6px; font: 12px ui-monospace, Menlo, monospace; color: #d8ccb8; }
#hubSheet .aff .btn { min-height: 36px; }
#hubSheet .close { position: absolute; right: 12px; top: 10px; width: 34px; height: 34px; border-radius: 17px; border: 1px solid rgba(214,170,98,0.35);
  background: transparent; color: #e0c8a0; font-size: 18px; line-height: 30px; }
`;

export function createTownMenu(sim, partyPanel, { openParty = () => {}, openTerms = () => {} } = {}) {
  const style = document.createElement('style'); style.textContent = CSS; document.head.appendChild(style);
  const bar = document.createElement('div'); bar.id = 'hubBar';
  const sheet = document.createElement('div'); sheet.id = 'hubSheet';
  document.body.append(bar, sheet);
  const hint = document.getElementById('hint');
  const svg = (p) => `<svg viewBox="0 0 24 24">${p}</svg>`;
  bar.innerHTML = ORDER.map((k) => `<button data-k="${k}">${svg(SERVICES[k].icon)}${SERVICES[k].label}</button>`).join('');
  const block = (e) => e.stopPropagation();
  for (const el of [bar, sheet]) for (const ev of ['pointerdown', 'touchstart', 'mousedown']) el.addEventListener(ev, block);
  bar.addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) open(b.dataset.k); });
  sheet.addEventListener('click', (e) => {
    if (e.target.closest('.close')) return close();
    if (e.target.closest('.back')) { note = ''; return view === 'retrain' ? hire() : open(current); }
    const go = e.target.closest('[data-go]');
    if (go) { const [v, t] = go.dataset.go.split(':'); note = ''; if (v === 'party') { close(); openParty(); return; } return VIEWS[v](t); }
    const send = (cmd) => { note = ''; sim.commands.push(cmd); };
    const h = e.target.closest('[data-hire]'); if (h) return send({ type: 'hire', idx: +h.dataset.hire });
    if (e.target.closest('[data-ask]')) return send({ type: 'askAround' });
    if (e.target.closest('[data-terms]')) return openTerms();
    if (e.target.closest('[data-settle]')) return send({ type: 'payWages' });
    const rt = e.target.closest('[data-retrainview]'); if (rt) { note = ''; retrainId = rt.dataset.retrainview; return retrain(); }
    const rp = e.target.closest('[data-retrain]'); if (rp) return send({ type: 'retrain', id: retrainId, idx: +rp.dataset.retrain });
    const d = e.target.closest('[data-dismiss]'); if (d) return send({ type: 'dismiss', id: d.dataset.dismiss });
    const sw = e.target.closest('[data-swap]'); if (sw) return send({ type: 'swap', slot: +sw.dataset.swap, id: sw.dataset.who });
    const ht = e.target.closest('[data-htab]'); if (ht) { note = ''; return hire(ht.dataset.htab); }
    const ft = e.target.closest('[data-ftab]'); if (ft) { note = ''; armUid = null; return smith(ft.dataset.ftab); }
    const pt = e.target.closest('[data-ptab]'); if (pt) { note = ''; return shop(pt.dataset.ptab); }
    const up = e.target.closest('[data-upgrade]'); if (up) return send({ type: 'upgrade', uid: up.dataset.upgrade });
    const rf = e.target.closest('[data-reforge]'); if (rf) return send({ type: 'reforge', uid: rf.dataset.reforge, aff: +rf.dataset.aff });
    const sv = e.target.closest('[data-salvage]'); if (sv) { const it = sim.state.bag.find((q) => q.uid === sv.dataset.salvage);   // a Fine or better: tap twice
      if (it && it.r !== 'common' && armUid !== it.uid) { armUid = it.uid; return smith(); } armUid = null; return send({ type: 'salvage', uid: sv.dataset.salvage }); }
    if (e.target.closest('[data-salvagecommons]')) return send({ type: 'salvageCommons' });
    if (e.target.closest('[data-buyscroll]')) return send({ type: 'buyScroll' });
    const by = e.target.closest('[data-buy]'); if (by) return send({ type: 'buy', idx: +by.dataset.buy });
    const sl = e.target.closest('[data-sell]'); if (sl) return send({ type: 'sell', uid: sl.dataset.sell });
    const bb = e.target.closest('[data-buyback]'); if (bb) return send({ type: 'buyBack', uid: bb.dataset.buyback });
    const r = e.target.closest('[data-raise]'); if (r) return send({ type: 'resurrect', id: r.dataset.raise });
    const q = e.target.closest('[data-respec]'); if (q) return send({ type: 'respec', id: q.dataset.respec });
    const tk = e.target.closest('[data-take]'); if (tk) return send({ type: 'boardAccept', id: tk.dataset.take });
    const hi = e.target.closest('[data-handin]'); if (hi) return send({ type: 'boardTurnIn', id: hi.dataset.handin });
    if (e.target.closest('[data-rest]')) send({ type: 'rest' });
  });
  const redraw = () => { if (sheet.classList.contains('on') && VIEWS[view]) VIEWS[view](); };
  sim.bus.on('partyChanged', redraw); sim.bus.on('countersChanged', redraw);
  sim.bus.on('questChanged', redraw); sim.bus.on('boardChanged', redraw); boardReady.then(redraw); wordsReady.then(redraw);
  for (const ev of ['rosterChanged', 'wages', 'retrained', 'wagesSettled', 'perkRevealed', 'forged', 'traded', 'gearChanged']) sim.bus.on(ev, redraw);
  sim.bus.on('rested', () => { note = ''; restDone = true; redraw(); });
  sim.bus.on('refused', (r) => { if (!sheet.classList.contains('on')) return; note = r.reason; redraw(); });
  let current = null, view = null, note = '', restDone = false, retrainId = null, hireTab = null, forgeTab = 'upgrade', shopTab = 'buy', armUid = null;

  const LIVE = { 'Quest board': 'board', 'Hire companions': 'hire', 'Raise the slain': 'raise', Respec: 'respec', Rest: 'rest', 'Party & bench': 'party',
    Upgrade: 'smith:upgrade', Reforge: 'smith:reforge', Salvage: 'smith:salvage', Buy: 'shop:buy', Sell: 'shop:sell' };   // actions that work today
  function open(kind) {
    const w = sim.world, sv = (w.services || []).find((s) => s.kind === kind), S = SERVICES[kind];
    if (!S) return;
    current = kind; view = kind; note = '';
    sheet.innerHTML = `<button class="close" aria-label="close">×</button>
      <div class="kind">${S.label} · ${w.name || ''}</div><h2>${sv ? sv.name : S.label}</h2><p>${S.blurb}</p>
      ${S.actions.map(([t, d]) => LIVE[t]
        ? `<div class="row go" data-go="${LIVE[t]}"><div><b>${t}</b><span>${d}</span></div><div class="go-arrow">›</div></div>`
        : `<div class="row"><div><b>${t}</b><span>${d}</span></div><div class="soon">soon</div></div>`).join('')}`;
    sheet.classList.add('on');
  }
  const line = (m) => { const s = statsFor(m); return `HP ${s.maxHp} · ATK ${s.atk} · DEF ${s.def} · CRT ${s.crit}% · DDG ${s.dodge}%`; };
  const head = (kind, title, blurb) => `<button class="close" aria-label="close">×</button><button class="back">‹ back</button>
      <div class="kind">${kind} · ${esc(sim.world.name || '')}</div><h2>${title}</h2><p>${blurb}</p>${note ? `<div class="note">${esc(note)}</div>` : ''}`;
  const gold = () => sim.state.counters.gold || 0;
  // The Lantern Guild's board (GDD §9): today's jobs, each with who pinned it, its hook, what it asks,
  // how hard (skulls, with the word) and what it pays; and every finished job you're holding, from
  // any day, to hand in. Up to MAX_JOBS open at once; the sim checks every take and hand-in.
  function board() {
    view = 'board';
    const S = sim.state, offers = sim.world.kind === 'town' ? sim.board.offers() : [], open = sim.board.open();
    const nx = sim.board.nextPosting(), mins = Math.max(1, Math.ceil(nx.secs / 60));
    const card = (job, st) => {
      const d = boardWords(job); if (!d) return '';
      const btn = st === QS.READY ? `<button class="btn in" data-handin="${job.id}">Hand in · ${d.rewards.xp} XP · ${d.rewards.gold} gold</button>`
        : st === QS.ACTIVE ? '<button class="btn" disabled>Taken · in your Journal</button>'
        : st === QS.DONE ? '<button class="btn" disabled>Done</button>'
        : `<button class="btn" data-take="${job.id}" ${open >= MAX_JOBS ? 'disabled' : ''}>Take the job</button>`;
      return `<div class="job${st === QS.READY ? ' ready' : st === QS.ACTIVE || st === QS.DONE ? ' taken' : ''}">
        <div class="jt"><b>${esc(d.title)}</b><em class="sk s${d.skulls}">${'☠'.repeat(d.skulls)} ${SKULLS[d.skulls]}</em></div>
        ${d.company ? '<div class="co">⚑ Bring company: a lone hero won’t hold this room</div>' : ''}
        <div class="by">Posted · ${esc(d.giverName)}</div><div class="hook">${esc(d.hook)}</div>
        <div class="brief">${esc(d.brief)}</div><div class="rw">Pays ${d.rewards.xp} XP · ${d.rewards.gold} gold</div>${btn}</div>`;
    };
    const today = new Set(offers.map((j) => j.id));
    const readyOld = Object.keys(S.quests).filter((id) => !today.has(id) && S.quests[id].st === QS.READY && sim.quests.def(id)?.kind === 'board').map((id) => sim.quests.def(id));
    sheet.innerHTML = `${head('Tavern', 'The Lantern Guild board', 'Jobs pinned up by the door. Anyone can post one; the Guild takes a cut. Hand them in here when they’re done.')}
      <div class="jobs-top">Jobs held ${open}/${MAX_JOBS} · new jobs at ${nx.at}, in ${mins} min · posted at dawn and dusk</div>
      ${readyOld.length ? `<h3>Done · hand in</h3>${readyOld.map((j) => card(j, QS.READY)).join('')}` : ''}
      <h3>${S.board && S.board.half ? 'Posted at dusk' : 'Posted at dawn'}</h3>${offers.map((j) => card(j, j.status)).join('') || `<p>The board is bare. New jobs go up at ${nx.at}, in ${mins} min.</p>`}`;
  }
  // The tavern's hiring board (GDD §6.2): today's Lantern Guild sellswords, each with its rank (the
  // word and its colour), perks, fee and dawn wage; your company with what it's owed, its loyalty and a
  // way to Retrain; Ask around for new faces. Hires beyond the party of three wait on the bench.
  const owedLine = (m) => (m.owed > 0 ? `<span class="owed">Owed ${m.owed} gold · its perks are dark until paid</span>` : '');
  // Two sub-tabs under the Guild's terms and the purse (docs/tavern-hire-mockup.html, 2026-10-01):
  // Your company (the party, with To bench and Retrain; the bench, with Into the party) and Hire
  // (Ask around and today's sellswords). With the party full a hire reads "Add to roster": the
  // sellsword joins the company on the bench at the inn.
  function hire(tab) {
    view = 'hire';
    const w = sim.world, S = sim.state, party = S.party, full = party.length > MAX_COMPANIONS, benchFull = S.bench.length >= BENCH_MAX;
    const roster = w.kind === 'town' ? sim.heroes.roster() : [], mins = Math.max(1, Math.ceil(sim.board.nextDawn() / 60));
    const wages = party.reduce((n, m) => n + wageOf(m, false), 0) + S.bench.reduce((n, m) => n + wageOf(m, true), 0), owed = sim.heroes.owed();
    const first = ![...party, ...S.bench].some(hired);       // nobody of the Guild's yet: say how it works, once it matters
    if (tab) hireTab = tab; else if (!hireTab) hireTab = party.length > 1 || S.bench.length ? 'company' : 'hire';
    const comp = hireTab === 'company', mates = party.slice(1);
    const card = (m, benched, acts) => `<div class="merc sw${benched ? ' bench' : ''}"><div class="who"><b>${esc(m.name)}</b><em>L${m.level} ${CLASSES[m.cls].label}</em>${rankMark(m)}
        <span class="sub">${benched ? 'On the bench · ' : ''}${esc(loyaltyWord(m) || 'Your companion')} · ${esc(wageLine(m, benched))}</span>${owedLine(m)}
        ${perkLines(m)}<span>${line(m)}</span></div><div style="display:flex;flex-direction:column;gap:6px">${acts}</div></div>`;
    const retrainBtn = (m) => (hired(m) && m.perks.some((id) => PERKS[id].fam !== 'quirk') ? `<button class="btn ghost" data-retrainview="${m.id}">Retrain</button>` : '');
    // a bench member into the party: the free place if there is one, else in place of each companion in turn
    const intoParty = (m) => (party.length <= MAX_COMPANIONS ? `<button class="btn" data-swap="${party.length}" data-who="${m.id}">Into the party</button>`
      : mates.map((o, i) => `<button class="btn" data-swap="${i + 1}" data-who="${m.id}">Swap for ${esc(o.name)}</button>`).join(''));
    const company = `<h3>In the party · with you</h3>
      ${mates.map((m) => card(m, false, `<button class="btn ghost" data-dismiss="${m.id}">To bench</button>${retrainBtn(m)}`)).join('') || '<p style="margin:0 0 4px">No companions with you yet. Hire one on the Hire tab.</p>'}
      <h3>On the bench · at the inn · ${S.bench.length}/${BENCH_MAX}</h3>
      ${S.bench.map((m) => card(m, true, `${intoParty(m)}${retrainBtn(m)}`)).join('') || '<p style="margin:0 0 4px">Nobody on the bench.</p>'}`;
    const hiring = `<div class="row go" data-ask><div><b>Ask around · ${sim.heroes.askCost()} gold</b><span>New faces at the tavern today. Dearer each time you ask the same day.</span></div><div class="go-arrow">›</div></div>
      ${full ? `<div class="full">${benchFull ? 'Your party and the bench are both full. Release someone from the bench at the inn first.' : 'Your party is full. A new hire joins your roster on the bench at the inn; swap them in from Your company.'}</div>` : ''}
      <h3>Today's sellswords · new faces at dawn</h3>
      ${roster.map((m, i) => { const have = party.some((p) => p.id === m.id) || S.bench.some((p) => p.id === m.id), fee = feeOf(m), poor = fee > gold();
        return `<div class="merc sw"><div class="who"><b>${esc(m.name)}</b><em>L${m.level} ${CLASSES[m.cls].label}</em>${rankMark(m)}
        <span class="rl">${esc(rankLine(m.rank))}</span>${perkLines(m)}<span>${line(m)}</span>
        <span class="sub">Fee ${fee} gold · then ${wageOf(m, false)} gold a dawn</span></div>
        <button class="btn" data-hire="${i}" ${have || (full && benchFull) || poor ? 'disabled' : ''}>${have ? 'Hired' : `${full ? 'Add to roster' : 'Hire'} · ${fee}`}${!have && poor ? '<small>not enough gold</small>' : ''}</button></div>`; }).join('')}`;
    sheet.innerHTML = `${head('Tavern', 'Hire companions', `The Lantern Guild hires out its own. A fee to sign, then a wage every dawn: the party in full, the bench at the inn on half. A new hire comes at half your level (L${hireLevel(S.party[0].level)} today) and learns the rest at your side.`)}
      <div class="row go" data-terms><div><b>The Guild’s terms</b><span>${first ? 'Wages are paid every dawn, wherever you are. Read this before you sign anyone on.' : 'Ranks, wages, loyalty, Ask around and Retrain'}</span></div><div class="go-arrow">›</div></div>
      <div class="purse">You have <b>${gold()}</b> gold · wages at dawn (in ${mins} min): <b>${wages}</b> gold</div>
      ${owed ? `<div class="row go warn" data-settle><div><b>Settle wages · ${owed} gold</b><span>What the company is owed. Their perks come back when they're paid.</span></div><div class="go-arrow">›</div></div>` : ''}
      <div class="subtabs" role="tablist"><button role="tab" aria-selected="${comp}" data-htab="company" class="${comp ? 'on' : ''}">Your company<small>party ${party.length}/3 · bench ${S.bench.length}/${BENCH_MAX}</small></button><button role="tab" aria-selected="${!comp}" data-htab="hire" class="${comp ? '' : 'on'}">Hire<small>${roster.length} today</small></button></div>
      ${comp ? company : hiring}`;
  }
  // ── the forge and the shop (GDD §8 v1.13; sim/smith.js) ──
  const RC = { common: '#b9b2a4', fine: '#72d06c', rare: '#5aa8ff', heirloom: '#f2a33c' };
  const RW = { common: 'Common', fine: 'Fine', rare: 'Rare', heirloom: 'Heirloom' };
  const statLine = (it) => Object.entries(itemStats(it)).map(([k, v]) => `${STAT_LABEL[k] || k} ${v > 0 ? '+' : ''}${v}${k === 'crit' || k === 'dodge' ? ' %' : ''}`).join(' · ');
  const upName = (it) => `${esc(it.name)}${it.up ? ` +${it.up}` : ''}`;
  // name (in its rarity's colour, with the word), slot, who wears it or that it's in the bag
  const itemHead = (it, where) => `<b style="color:${RC[it.r]}">${upName(it)}</b><em>${RW[it.r]} · ${SLOT_LABEL[BASES[it.base].slot]} · item level ${it.ilv}</em><span class="sub">${where}</span>`;
  const purse = () => { const C = sim.state.counters; return `<div class="purse">You have <b>${C.gold || 0}</b> gold · <b>✦ ${C.embers || 0}</b> cinders · <b>${C.wood || 0}</b> wood · <b>${C.stone || 0}</b> stone</div>`; };
  const costWords = (c) => [`${c.gold} gold`, c.cinders ? `✦ ${c.cinders}` : '', c.wood ? `${c.wood} wood` : '', c.stone ? `${c.stone} stone` : ''].filter(Boolean).join(' · ');
  const affords = (c) => { const C = sim.state.counters; return (C.gold || 0) >= c.gold && (C.embers || 0) >= (c.cinders || 0) && (C.wood || 0) >= (c.wood || 0) && (C.stone || 0) >= (c.stone || 0); };
  const tabs = (attr, cur, list) => `<div class="subtabs" role="tablist">${list.map(([k, l, n]) => `<button role="tab" aria-selected="${cur === k}" data-${attr}="${k}" class="${cur === k ? 'on' : ''}">${l}${n !== undefined ? `<small>${n}</small>` : ''}</button>`).join('')}</div>`;
  // what the next step does; a small piece's gain can round away for a step, so say when it next shows
  const gainsAt = (it) => { const now = statLine(it); let m = (it.up || 0) + 1; while (m <= UP_MAX && statLine({ ...it, up: m }) === now) m++; return m; };
  const nextStep = (it) => { const n = (it.up || 0) + 1, m = gainsAt(it);
    return m === n ? `+${n} → ${statLine({ ...it, up: n })}` : `+${n} → no change yet on a piece this small (the gain shows at +${m})`; };
  /** everything the company holds: worn by the party, then the bag */
  const holdings = () => { const out = [];
    for (const m of sim.state.party) for (const k of Object.keys(m.gear || {})) { const it = m.gear[k]; if (it) out.push([it, `worn by ${esc(m.name)}`]); }
    for (const it of sim.state.bag) if (!isUsable(it)) out.push([it, 'in the bag']); return out; };   // (a scroll isn't the forge's)

  // Hale & Daughter's forge: Upgrade (+1…+5), Reforge (one affix of a Fine or better), Salvage (the bag)
  function smith(tab) {
    view = 'smith'; if (tab) forgeTab = tab;
    const H = holdings(), sv = (sim.world.services || []).find((q) => q.kind === 'smith');
    const body = forgeTab === 'upgrade' ? `<p class="hint2">Each step adds 8 % to an item's base stats (not its traits). From +3 it takes wood and stone too.</p>
      ${H.map(([it, where]) => { const c = upgradeCost(it, sim.state.party[0].origin);
        if (!c) return `<div class="merc"><div class="who">${itemHead(it, where)}<span>${statLine(it)}</span></div><button class="btn" disabled>+${UP_MAX} · done</button></div>`;
        if (gainsAt(it) > UP_MAX) return `<div class="merc"><div class="who">${itemHead(it, where)}<span>${statLine(it)}</span><span class="sub">Too small a piece to gain from the forge: 8 % of its stats rounds away even at +${UP_MAX}.</span></div><button class="btn" disabled>No gain</button></div>`;
        const ok = affords(c); return `<div class="merc"><div class="who">${itemHead(it, where)}<span>${statLine(it)}</span><span class="nx">${nextStep(it)}</span><span class="sub">${costWords(c)}</span></div>
        <button class="btn" data-upgrade="${it.uid}" ${ok ? '' : 'disabled'}>Upgrade to +${(it.up || 0) + 1}${ok ? '' : '<small>not enough</small>'}</button></div>`; }).join('') || '<p>Nothing to upgrade.</p>'}`
      : forgeTab === 'reforge' ? `<p class="hint2">Bess rerolls one trait into a different one, at the item's level. Each reforge of the same piece costs double.</p>
      ${H.filter(([it]) => it.aff && it.aff.length).map(([it, where]) => { const c = reforgeCost(it), ok = affords(c);
        return `<div class="merc sw"><div class="who">${itemHead(it, where)}<span class="sub">${costWords(c)} a reroll</span>
          ${it.aff.map(([k, v], i) => `<div class="aff"><span>${STAT_LABEL[k] || k} ${v > 0 ? '+' : ''}${v}${k === 'crit' || k === 'dodge' ? ' %' : ''}</span><button class="btn ghost" data-reforge="${it.uid}" data-aff="${i}" ${ok ? '' : 'disabled'}>Reroll</button></div>`).join('')}</div></div>`; }).join('') || '<p>Only Fine, Rare and heirloom pieces have traits to reforge.</p>'}`
      : (() => { const commons = sim.state.bag.filter((it) => it.r === 'common' && !(it.up > 0));
        return `<p class="hint2">Gear in the bag becomes cinders for the forge: more for finer pieces, and half of what any upgrades took. Worn gear stays worn.</p>
        ${commons.length ? `<div class="row go" data-salvagecommons><div><b>Salvage every plain Common · ✦ ${commons.length}</b><span>${commons.length} in the bag (upgraded pieces are kept)</span></div><div class="go-arrow">›</div></div>` : ''}
        ${sim.state.bag.filter((it) => !isUsable(it)).map((it) => `<div class="merc"><div class="who">${itemHead(it, 'in the bag')}<span>${statLine(it)}</span></div>
          <button class="btn${armUid === it.uid ? ' warnb' : ' ghost'}" data-salvage="${it.uid}">${armUid === it.uid ? `Sure? ✦ ${salvageOf(it)}` : `Salvage · ✦ ${salvageOf(it)}`}</button></div>`).join('') || '<p>The bag is empty.</p>'}`; })();
    sheet.innerHTML = `${head('Smith', sv ? esc(sv.name) : 'The forge', 'Bess Hale’s forge. Upgrade what you wear and carry, reforge a trait, or melt down what you won’t use into cinders.')}
      ${purse()}${tabs('ftab', forgeTab, [['upgrade', 'Upgrade'], ['reforge', 'Reforge'], ['salvage', 'Salvage', `${sim.state.bag.length} in the bag`]])}${body}`;
  }

  // Wendel's: Buy (the day's plain gear at your level) · Sell (and buy back what you sold)
  function shop(tab) {
    view = 'shop'; if (tab) shopTab = tab;
    const S = sim.state, st = sim.world.kind === 'town' ? sim.smith.stock() : [], mins = Math.max(1, Math.ceil(sim.board.nextDawn() / 60)), sv = (sim.world.services || []).find((q) => q.kind === 'shop');
    const who = (it) => { const c = classesOf(BASES[it.base]); return c.length ? c.map((k) => CLASSES[k].label).join(', ') : 'anyone'; };
    const scrollRow = `<div class="merc"><div class="who"><b>Homeward Scroll</b><em>always on the shelf · ${S.bag.filter(isUsable).length} in the bag</em><span>Read it anywhere out of town and you're on ${esc(sim.world.name || 'the town')}'s square. Once.</span></div>
      <button class="btn" data-buyscroll ${SCROLL_PRICE > gold() ? 'disabled' : ''}>Buy · ${SCROLL_PRICE}${SCROLL_PRICE > gold() ? '<small>not enough gold</small>' : ''}</button></div>`;
    const body = shopTab === 'buy' ? `${scrollRow}<h3>Today's stock · new at dawn, in ${mins} min</h3>
      ${st.map((it, i) => { const done = S.shop.bought.includes(i), p = buyPrice(it), poor = p > gold();
        return `<div class="merc"><div class="who">${itemHead(it, `for ${who(it)}`)}<span>${statLine(it)}</span></div>
        <button class="btn" data-buy="${i}" ${done || poor ? 'disabled' : ''}>${done ? 'Bought' : `Buy · ${p}`}${!done && poor ? '<small>not enough gold</small>' : ''}</button></div>`; }).join('') || '<p>Wendel’s shelves go up at dawn.</p>'}`
      : `${S.bag.map((it) => { const p = sellPrice(it);
        return `<div class="merc"><div class="who">${itemHead(it, 'in the bag')}<span>${statLine(it)}</span></div>
        <button class="btn${p === null ? '' : ' ghost'}" data-sell="${it.uid}" ${p === null ? 'disabled' : ''}>${p === null ? 'Not for sale' : `Sell · ${p}`}</button></div>`; }).join('') || '<p>The bag is empty.</p>'}
      ${S.buyback.length ? `<h3>Sold here · buy back</h3>${S.buyback.map((it) => `<div class="merc"><div class="who">${itemHead(it, 'sold')}<span>${statLine(it)}</span></div>
        <button class="btn" data-buyback="${it.uid}" ${it.sold > gold() ? 'disabled' : ''}>Buy back · ${it.sold}</button></div>`).join('')}` : ''}`;
    sheet.innerHTML = `${head('Shop', sv ? esc(sv.name) : 'The shop', 'Plain arms and armour for your company, new each dawn, and a fair price for what you carry. Wendel won’t take heirlooms.')}
      <div class="purse">You have <b>${gold()}</b> gold · the bag ${S.bag.length} items</div>
      ${tabs('ptab', shopTab, [['buy', 'Buy', `${st.length - S.shop.bought.length} today`], ['sell', 'Sell', `${S.bag.length} in the bag`]])}${body}`;
  }

  // Retrain (GDD §6.2): one of a sellsword's perks for another of its family, dearer each time
  function retrain() {
    view = 'retrain';
    const S = sim.state, m = [...S.party, ...S.bench].find((q) => q.id === retrainId);
    if (!m) return hire();
    const c = sim.heroes.retrainCost(m);
    sheet.innerHTML = `${head('Tavern', `Retrain ${esc(m.name)}`, `A Guild drillmaster swaps one perk for another of its kind, for ${c} gold (each retrain costs more). A quirk is who they are: no training takes it out.`)}
      ${m.perks.map((id, i) => { const w = perkWord(id), q = PERKS[id].fam === 'quirk'; return `<div class="merc sw"><div class="who">${perkLines({ perks: [id], owed: 0 })}</div>
        <button class="btn${q ? ' ghost' : ''}" data-retrain="${i}" ${q || c > gold() ? 'disabled' : ''} aria-label="Retrain ${esc(w.name)}">${q ? 'Quirk' : `Retrain · ${c}`}</button></div>`; }).join('')}`;
  }
  // The temple: raise the slain (GDD §3.6) — free once a day while your hero is level 5 or
  // lower, else 25 gold × their level.
  function raise() {
    view = 'raise';
    const S = sim.state, fallen = [...S.party, ...S.bench].filter((m) => m.fallen);
    sheet.innerHTML = `${head('Temple', 'Raise the slain', `The sisters ask 25 gold a level, and raise one a day for nothing while you are level ${FREE_RES_LEVEL} or under. You have ${gold()} gold.`)}
      ${fallen.map((m) => { const c = sim.heroes.resurrectCost(m); return `<div class="merc fallen"><div class="who"><b>${esc(m.name)}</b><em>L${m.level} ${CLASSES[m.cls].label}</em><span>Slain · ${S.party.includes(m) ? 'with you, a ghost' : 'on the bench'}</span></div>
        <button class="btn" data-raise="${m.id}" ${c > gold() ? 'disabled' : ''}>${c ? c + ' gold' : 'Free'}</button></div>`; }).join('') || '<p>Nobody in your company is slain.</p>'}`;
  }
  // The temple: respec (GDD §4.1) — the first for each member is free, then 20 gold × level.
  function respec() {
    view = 'respec';
    const S = sim.state, all = [...S.party, ...S.bench];
    sheet.innerHTML = `${head('Temple', 'Respec', 'Unlearn a member’s attribute points to spend them again. The first time is free; after that, 20 gold × level.')}
      ${all.map((m) => { const c = sim.heroes.respecCost(m), n = pointsSpent(m); return `<div class="merc"><div class="who"><b>${esc(m.name)}</b><em>L${m.level} ${CLASSES[m.cls].label}</em><span>${n} points spent${m.autoAttrs ? ' · on Auto' : ''}</span></div>
        <button class="btn${c ? '' : ' ghost'}" data-respec="${m.id}" ${!n || c > gold() ? 'disabled' : ''}>${c ? c + ' gold' : 'Free'}</button></div>`; }).join('')}`;
  }
  // The inn: rest — full HP and MP, and Weakened lifted (5 gold × your level)
  function rest() {
    view = 'rest';
    const S = sim.state, c = sim.heroes.restCost(), weak = S.party.some((m) => m.weakUntil > 0);
    sheet.innerHTML = `${head('Inn', 'Rest', `A bed, a meal and a night’s sleep: everyone standing wakes at full HP and MP${weak ? ', and no longer Weakened' : ''}. The slain need the temple.`)}
      ${S.party.map((m) => { const s = statsFor(m); return `<div class="merc${m.fallen ? ' fallen' : ''}"><div class="who"><b>${esc(m.name)}</b><em>L${m.level} ${CLASSES[m.cls].label}</em><span>${m.fallen ? 'Slain' : `HP ${Math.round(m.hp)}/${s.maxHp}`}${m.weakUntil > 0 ? ' · Weakened' : ''}</span></div></div>`; }).join('')}
      <div class="row go" data-rest><div><b>${restDone ? 'Rested' : 'Rest the night'}</b><span>${c} gold · you have ${gold()}</span></div><div class="go-arrow">›</div></div>`;
    restDone = false;
  }
  const VIEWS = { board, hire, raise, respec, rest, retrain, smith, shop };
  function close() { sheet.classList.remove('on'); }

  // show the service bar while the hero is in a town square
  let wasIn = false;
  (function watch() {
    const w = sim.world, p = sim.state.player, h = w.hub;
    const inHub = !!h && Math.hypot(p.x - h.x, p.y - h.y) < h.r - 2;
    if (inHub !== wasIn) { bar.classList.toggle('on', inHub); if (hint) hint.style.opacity = inHub ? '0' : ''; if (!inHub) close(); wasIn = inHub; }
    if (partyPanel) bar.style.bottom = `${Math.round(partyPanel.height()) + 6}px`;     // the service bar sits above the party cards
    requestAnimationFrame(watch);
  })();

  /** straight to the Hire view (the HUD's wage line, in town) */
  function openHire() { open('tavern'); hire('company'); }   // (from the wage line: who's costing what)
  return { open: (sv) => open(sv.kind || sv), openHire, close, isOpen: () => sheet.classList.contains('on'), inSquare: () => wasIn };
}
