// townmenu.js — the town square as a home screen. In a town's square (world.hub) a bar
// of the four services slides up — Shop, Tavern, Inn, Temple — and tapping one (or its
// building) opens that service's menu as a bottom sheet. The actions are the GDD's
// (emberfall-gdd.md §10): they're placeholders until each system lands.
// DOM only; reads sim state, never writes it.

const SERVICES = {
  shop: {
    label: 'Shop', blurb: 'Buy and sell gear, upgrade it at the forge, salvage what you can’t use.',
    actions: [['Buy', 'common arms, armour and potions'], ['Sell', 'gold for what you carry'], ['Upgrade', '+1 to +5 at the forge · gold, Embers, wood, stone'], ['Salvage', 'turn off-class gear into Embers']],
    icon: '<path d="M3 9h11l3-3h4v3l-3 2v2H9l-2 3H5l1-3H3z"/>',
  },
  tavern: {
    label: 'Tavern', blurb: 'The Lantern Guild’s quest board, sellswords for hire, and rumours over a pint.',
    actions: [['Quest board', 'the Lantern Guild’s mini-quests for this region'], ['Hire companions', 'two party slots · today’s sellswords'], ['Rumours', 'hooks, lore and where the dead are stirring']],
    icon: '<path d="M5 6h10v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2zM15 9h2a2 2 0 0 1 0 6h-2M6 3c1 1 2 1 3 0 1 1 2 1 3 0 1 1 2 1 3 0v3H6z"/>',
  },
  inn: {
    label: 'Inn', blurb: 'Rest, lodge the companions you’re not taking, and send parties out while you’re away.',
    actions: [['Rest', 'restore HP and MP · heal the tired'], ['Lodge companions', 'your bench of recruited companions'], ['Expeditions', 'send a party to farm a room while you’re offline']],
    icon: '<path d="M3 18V7M3 13h18v5M21 18v-3M6 13v-2a2 2 0 0 1 2-2h3v4M12 9h6a3 3 0 0 1 3 3v1"/>',
  },
  temple: {
    label: 'Temple', blurb: 'Heal the Wounded, take a blessing before the road, and read the Chronicle of the Fall.',
    actions: [['Heal the Wounded', 'companions who fell, back on their feet'], ['Blessings', 'a boon for your next expedition'], ['The Chronicle', 'lore fragments you’ve found, by region']],
    icon: '<path d="M12 3c2 3 5 5 5 9a5 5 0 0 1-10 0c0-2 1-3 2-4 0 2 1 3 2 3 0-3-1-5 1-8z"/>',
  },
};
const ORDER = ['shop', 'tavern', 'inn', 'temple'];

const CSS = `
#hubBar { position: fixed; left: 0; right: 0; bottom: calc(env(safe-area-inset-bottom, 0px) + 10px);
  display: flex; justify-content: center; gap: 8px; padding: 0 10px; transform: translateY(140%); transition: transform .28s ease; z-index: 5; }
#hubBar.on { transform: none; }
#hubBar button { flex: 1; max-width: 88px; background: rgba(16,12,22,0.86); border: 1px solid rgba(214,170,98,0.45); border-radius: 10px;
  color: #eadcc0; font: 600 11px Georgia, 'Times New Roman', serif; letter-spacing: .5px; padding: 8px 4px 7px; display: flex; flex-direction: column; align-items: center; gap: 4px; }
#hubBar button svg { width: 22px; height: 22px; fill: none; stroke: #e0a85a; stroke-width: 1.6; stroke-linejoin: round; stroke-linecap: round; }
#hubBar button:active { background: rgba(60,40,30,0.9); }
#hubSheet { position: fixed; left: 0; right: 0; bottom: 0; z-index: 6; transform: translateY(105%); transition: transform .3s ease;
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
#hubSheet .close { position: absolute; right: 12px; top: 10px; width: 34px; height: 34px; border-radius: 17px; border: 1px solid rgba(214,170,98,0.35);
  background: transparent; color: #e0c8a0; font-size: 18px; line-height: 30px; }
`;

export function createTownMenu(sim) {
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
  sheet.addEventListener('click', (e) => { if (e.target.closest('.close')) close(); });

  function open(kind) {
    const w = sim.world, sv = (w.services || []).find((s) => s.kind === kind), S = SERVICES[kind];
    if (!S) return;
    sheet.innerHTML = `<button class="close" aria-label="close">×</button>
      <div class="kind">${S.label} · ${w.name || ''}</div><h2>${sv ? sv.name : S.label}</h2><p>${S.blurb}</p>
      ${S.actions.map(([t, d]) => `<div class="row"><div><b>${t}</b><span>${d}</span></div><div class="soon">soon</div></div>`).join('')}`;
    sheet.classList.add('on');
  }
  function close() { sheet.classList.remove('on'); }

  // show the service bar while the hero is in a town square
  let wasIn = false;
  (function watch() {
    const w = sim.world, p = sim.state.player, h = w.hub;
    const inHub = !!h && Math.hypot(p.x - h.x, p.y - h.y) < h.r - 2;
    if (inHub !== wasIn) { bar.classList.toggle('on', inHub); if (hint) hint.style.opacity = inHub ? '0' : ''; if (!inHub) close(); wasIn = inHub; }
    requestAnimationFrame(watch);
  })();

  return { open: (sv) => open(sv.kind || sv), close, isOpen: () => sheet.classList.contains('on') };
}
