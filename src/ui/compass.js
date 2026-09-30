// compass.js — compass travel (docs/compass-mockup.html). A small compass under the
// minimap opens a context-sensitive pick list (sim.destinations(): dungeon / overland /
// town). Picking a row makes the party auto-walk there; a chip above the party cards
// names the destination with the steps left and cancels it (so does the stick). A walk a
// fight interrupts can be resumed from the chip — straight on through the room, or once it's quiet. It stays up in
// a town square too, beside the service bar: the road out is one tap away. DOM only; talks to
// the sim through commands.

import { esc } from './actorart.js';

const ICONS = {
  next: '<path d="M4 12h12M12 6l6 6-6 6"/>',
  farm: '<path d="M5 19V9l7-5 7 5v10zM9 19v-6h6v6"/>',
  chest: '<path d="M4 7h16v4H4zM6 11v8h12v-8M11 7v12"/>',
  shrine: '<path d="M12 3c2 3 5 5 5 9a5 5 0 0 1-10 0c0-2 1-3 2-4 0 2 1 3 2 3 0-3-1-5 1-8z"/>',
  down: '<path d="M5 19h4v-4h4v-4h4V7h3"/>',
  exit: '<path d="M19 5h-4v4h-4v4H7v4H4M14 3l5 2-2 5"/>',
  town: '<path d="M3 20V10l4-3 4 3v10M11 20v-7l5-4 5 4v7M3 20h18"/>',
  dungeon: '<path d="M4 18c2-6 5-9 8-9s6 3 8 9zM10 18v-4h4v4"/>',
  unexplored: '<circle cx="12" cy="12" r="8"/><path d="M12 8v5M12 16h.01"/>',
  landmark: '<path d="M6 20V8h12v12M6 8l2-4h8l2 4M10 20v-5h4v5"/>',
  square: '<path d="M4 20h16M6 20v-8l6-5 6 5v8M10 20v-4h4v4"/>',
  quest: '<path d="M12 3l7 9-7 9-7-9z"/><path d="M12 8v5M12 16h.01"/>',
};
const NEEDLE = '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9.5" fill="none" stroke="#e0a85a" stroke-width="1.5"/><path d="M12 4.5l2.6 7.5L12 19.5 9.4 12z" fill="#f0c880" stroke="#1a1208" stroke-width=".6"/><path d="M12 12L14.6 12 12 19.5 9.4 12z" fill="#6b4a24"/><circle cx="12" cy="12" r="1.2" fill="#1a1208"/></svg>';

const CSS = `
/* z 5: over the party cards (4), under the town menu (6) and the character sheet (8) — it stays up in
   the town square now, and at 7 it sat over the town menu's close button */
#compassBtn { position: fixed; right: 12px; top: 170px; z-index: 5; width: 44px; height: 44px; border-radius: 22px; padding: 0;
  background: rgba(16,12,22,0.92); border: 1px solid rgba(214,170,98,0.45); display: grid; place-items: center; box-shadow: 0 2px 10px rgba(0,0,0,.5);
  transition: opacity .2s ease; }
#compassBtn svg { width: 26px; height: 26px; }
#compassBtn.on { background: rgba(60,40,24,0.95); border-color: #d8a040; box-shadow: 0 0 0 3px rgba(216,160,64,.25), 0 2px 10px rgba(0,0,0,.5); }
#compassMenu { position: fixed; right: 12px; top: 222px; z-index: 5; width: 292px; max-width: calc(100vw - 24px); background: rgba(16,12,22,0.96);
  border: 1px solid rgba(214,170,98,0.45); border-radius: 12px; padding: 8px; box-shadow: 0 10px 30px rgba(0,0,0,.6); font-family: Georgia, serif; display: none; }
#compassMenu.on { display: block; }
#compassMenu:before { content: ''; position: absolute; right: 16px; top: -7px; width: 12px; height: 12px; background: rgba(16,12,22,0.96);
  border-left: 1px solid rgba(214,170,98,0.45); border-top: 1px solid rgba(214,170,98,0.45); transform: rotate(45deg); }
#compassMenu .hd { font: 10.5px ui-monospace, Menlo, monospace; letter-spacing: 2px; color: #a08a6a; text-transform: uppercase; padding: 4px 6px 8px; }
#compassMenu .opt { display: flex; align-items: center; gap: 10px; padding: 9px 8px; border-radius: 8px; border: 1px solid transparent; cursor: pointer; }
#compassMenu .opt:active { background: rgba(214,170,98,0.16); border-color: rgba(214,170,98,0.35); }
#compassMenu .opt.off { opacity: .42; cursor: default; }
#compassMenu .ic { width: 30px; height: 30px; flex: none; border-radius: 8px; background: rgba(255,255,255,0.04); display: grid; place-items: center; }
#compassMenu .ic svg { width: 19px; height: 19px; fill: none; stroke: #e0a85a; stroke-width: 1.6; stroke-linejoin: round; stroke-linecap: round; }
#compassMenu .tx { flex: 1; min-width: 0; }
#compassMenu b { display: block; font-size: 14.5px; color: #efe4cf; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
#compassMenu .tx span { display: block; font: 10.5px ui-monospace, Menlo, monospace; color: #978c80; margin-top: 2px; }
#compassMenu .lv { font: 700 10px ui-monospace, Menlo, monospace; padding: 2px 5px; border-radius: 4px; flex: none; font-style: normal; }
#compassMenu .lv.g { background: #3a3014; color: #f0c880; } #compassMenu .lv.a { background: #3f2a10; color: #ffc060; }
#compassMenu .lv.o { background: #452010; color: #ff9a50; } #compassMenu .lv.r { background: #481512; color: #ff6a5a; }
#compassMenu .go { color: #d8a040; font-size: 16px; flex: none; }
#compassMenu .sep { height: 1px; background: rgba(214,170,98,0.18); margin: 6px 4px; }
#compassMenu .empty { font: 11px ui-monospace, Menlo, monospace; color: #978c80; padding: 6px 8px 8px; }
#walkChip { position: fixed; left: 50%; transform: translateX(-50%); z-index: 6; display: none; align-items: center; gap: 8px; padding: 6px 8px 6px 12px; max-width: calc(100vw - 24px);
  background: rgba(16,12,22,0.95); border: 1px solid #d8a040; border-radius: 18px; font: 12px ui-monospace, Menlo, monospace; color: #f0c880; white-space: nowrap; box-shadow: 0 4px 14px rgba(0,0,0,.5); }
#walkChip.on { display: flex; }
#walkChip .lbl { overflow: hidden; text-overflow: ellipsis; }
#walkChip.paused { border-color: rgba(214,170,98,0.45); color: #b8a080; }
#walkChip .x { width: 24px; height: 24px; border-radius: 12px; border: 1px solid rgba(214,170,98,0.45); display: grid; place-items: center; color: #d8a040; font-size: 13px; flex: none; }
`;

export function createCompass(sim, { partyPanel, inSquare, questTitle = () => '' }) {
  const style = document.createElement('style'); style.textContent = CSS; document.head.appendChild(style);
  const btn = document.createElement('button'); btn.id = 'compassBtn'; btn.setAttribute('aria-label', 'Travel'); btn.innerHTML = NEEDLE;
  const menu = document.createElement('div'); menu.id = 'compassMenu';
  const chip = document.createElement('div'); chip.id = 'walkChip';
  document.body.append(btn, menu, chip);
  const stop = (e) => { e.stopPropagation(); };
  for (const el of [btn, menu, chip]) for (const ev of ['pointerdown', 'touchstart', 'mousedown']) el.addEventListener(ev, stop);

  const heroLv = () => sim.state.party[0].level;
  const lvClass = (lv) => { const d = lv - heroLv(); return d <= 0 ? 'g' : d === 1 ? 'a' : d === 2 ? 'o' : 'r'; };
  const place = () => {
    const w = sim.world;
    if (w.kind === 'dungeon') return `${w.siteName || 'Dungeon'} · depth ${(w.depth || 0) + 1}`;
    return w.name || '';
  };
  let rows = [];
  function openMenu() {
    rows = sim.destinations({ inSquare: inSquare() })     // the tracked quest's row (quests.js) is named by its title
      .map((o) => (o.id === 'quest' ? { ...o, label: esc(questTitle(o.quest) || 'Quest'), sub: `quest · ${o.sub || 'next step'}` } : o));
    menu.innerHTML = `<div class="hd">${place()}</div>` + (rows.length ? rows.map((o, i) => `${o.sep ? '<div class="sep"></div>' : ''}
      <div class="opt${o.off ? ' off' : ''}" data-i="${i}"><div class="ic"><svg viewBox="0 0 24 24">${ICONS[o.icon] || ICONS.next}</svg></div>
        <div class="tx"><b>${o.label}</b><span>${o.sub}</span></div>
        ${o.level ? `<em class="lv ${lvClass(o.level)}">LV ${o.level}</em>` : o.levelRange ? `<em class="lv g">LV ${o.levelRange}</em>` : o.off ? '' : '<span class="go">›</span>'}</div>`).join('')
      : '<div class="empty">nowhere to go from here</div>');
    menu.classList.add('on'); btn.classList.add('on');
  }
  function closeMenu() { menu.classList.remove('on'); btn.classList.remove('on'); }
  btn.addEventListener('click', () => (menu.classList.contains('on') ? closeMenu() : openMenu()));
  menu.addEventListener('click', (e) => {
    const el = e.target.closest('.opt'); if (!el || el.classList.contains('off')) return;
    const o = rows[+el.dataset.i]; if (!o) return;
    const label = o.chip || (o.id === 'next-room' || o.id === 'farm-room' ? `${o.label} (LV ${o.level})` : o.id === 'quest' ? questTitle(o.quest) || 'Quest' : o.label.startsWith('Nearest') ? o.sub.split(' · ')[0] : o.label);
    sim.commands.push({ type: 'goto', tx: o.tx, ty: o.ty, near: o.near, then: o.then || null, label, room: o.room, journey: o.journey || null, site: o.site || null });   // a journey walks on through scene changes (sim/core.js)
    closeMenu();
  });
  chip.addEventListener('click', (e) => {
    const p = sim.state.player;
    if (e.target.closest('.x')) { sim.commands.push({ type: 'cancelWalk' }); return; }
    if (!p.path && p.resume) sim.commands.push({ type: 'resume' });           // carry on (through / out of the fight)
  });
  // tapping the world or touching the stick closes the list
  document.addEventListener('pointerdown', (e) => { if (menu.classList.contains('on') && !menu.contains(e.target) && e.target !== btn && !btn.contains(e.target)) closeMenu(); });
  sim.bus.on('levelChanged', closeMenu);

  // keep the button, list and chip in step with the world
  let last = '';
  (function watch() {
    const p = sim.state.player;                                   // (it stays in the town square too: the quickest way back out)
    if (!p.path && p.moving && menu.classList.contains('on')) closeMenu();                    // the stick took over
    let html = '', mode = '';
    if (p.path && p.dest) {
      let d = 0, x = p.x, y = p.y; for (const [wx, wy] of p.path) { d += Math.hypot(wx - x, wy - y); x = wx; y = wy; }   // distance left along the path
      html = `<span class="lbl">→ ${esc(p.dest.label)} · ${Math.round(d)} steps</span><span class="x">✕</span>`; mode = 'walk';
    }
    else if (p.resume) {
      if (sim.battle) { html = `<span class="lbl">⚔ Resume → ${esc(p.resume.label)}</span><span class="x">✕</span>`; mode = 'paused'; }
      else { html = `<span class="lbl">Resume → ${esc(p.resume.label)}</span><span class="x">✕</span>`; mode = 'resume'; }
    }
    if (html !== last) { chip.innerHTML = html; last = html; }
    chip.classList.toggle('on', !!html); chip.classList.toggle('paused', mode === 'paused');
    const bar = document.getElementById('hubBar');
    const barH = bar && bar.classList.contains('on') ? bar.getBoundingClientRect().height + 8 : 0;
    const qt = document.getElementById('questTrack'), qtH = qt && qt.classList.contains('on') ? qt.getBoundingClientRect().height + 8 : 0;   // over the quest tracker (journal.js)
    chip.style.bottom = `${Math.round((partyPanel ? partyPanel.height() : 0) + barH + qtH + 12)}px`;
    requestAnimationFrame(watch);
  })();
  return { open: openMenu, close: closeMenu };
}
