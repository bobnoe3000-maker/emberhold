// hud.js — DOM overlay. Reads sim events, never sim internals.

import { SKILLS } from '../sim/skills.js';
import { CLASSES } from '../sim/party.js';
import { perkWord } from './sellswords.js';
import { wageOf } from '../sim/companions.js';
import { DAY_S } from '../sim/heroes.js';
import { PART_S, partOf } from '../sim/npcs.js';
import { weatherNow } from '../render/weatherfx.js';
import { weatherLeft, weatherName, skyAt } from '../sim/weather.js';
import { weatherIcon, skyWord } from './weathericon.js';
import { PART_NAMES } from '../render/daylight.js';
import { SHRINES } from '../sim/shrines.js';

export function createHud(sim) {
  // the top bar's bottom edge (the phone's safe area included) as --hud-b, for what stacks under it, and its line 1's
  // as --hud-l1: the minimap hangs 6 px under line 1, and the compass and Journal buttons under the minimap (the
  // renderer measures the same edges; docs/hud-mockup.html)
  const hudEl = document.getElementById('hud'), l1El = document.getElementById('hudL1');
  const syncTop = () => {
    if (hudEl) document.documentElement.style.setProperty('--hud-b', `${Math.round(Math.max(40, hudEl.getBoundingClientRect().bottom))}px`);
    if (l1El) document.documentElement.style.setProperty('--hud-l1', `${Math.round(Math.max(24, l1El.getBoundingClientRect().bottom))}px`);
  };
  syncTop(); window.addEventListener('resize', syncTop); setInterval(syncTop, 1000);
  const wood = document.getElementById('hudWood');
  const stone = document.getElementById('hudStone');
  const depth = document.getElementById('hudDepth');
  const toast = document.getElementById('hudToast');

  // dungeon: "depth N"; town / overland: the place's name
  const setDepth = (d) => {
    if (!depth) return;
    const out = sim.world.kind !== 'dungeon';
    depth.parentElement.firstChild.textContent = out ? '' : 'depth ';
    depth.textContent = out ? sim.world.name : d + 1;
  };
  setDepth(sim.state.depth);

  const gold = document.getElementById('hudGold'), embers = document.getElementById('hudEmbers');
  const paintCounters = (c) => { wood.textContent = c.wood; stone.textContent = c.stone; if (gold) gold.textContent = c.gold || 0; if (embers) embers.textContent = c.embers || 0; };
  sim.bus.on('countersChanged', paintCounters); paintCounters(sim.state.counters);
  sim.bus.on('harvested', ({ kind }) => show(kind === 'tree' ? '+3 wood' : '+2 stone'));
  // a shrine says what it did (GDD §3.6): raised one of the slain, mended everyone, lit a boon (v1.30), or kept its light
  sim.bus.on('shrine', (e) => show(e.did === 'might' ? 'Shrine of Might · the whole party strikes harder, +25 % ATK for 2 minutes · its light is spent'
    : e.did === 'ward' ? 'Shrine of Warding · the whole party stands firmer, +25 % DEF for 2 minutes · its light is spent'
    : e.did === 'none' && e.kind && e.kind !== 'mend' ? 'Shrine · nobody is standing to take it · it keeps its light'
    : e.did === 'raised' ? `Shrine · ${e.name} rises, at half health · its light is spent`
    : e.did === 'mended' ? 'Shrine · everyone standing is mended, HP and MP · its light is spent'
      : 'Shrine · nobody needs mending · it keeps its light for when someone is hurt or slain', e.did === 'none' ? 3200 : 2800));
  // a chest says what it held, every time, and says so when that was no gear (GDD §8, 2026-10-01); the
  // item's own card (sheet.js) follows a find
  const RW = { common: 'Common', fine: 'Fine', rare: 'Rare', heirloom: 'Heirloom' };
  sim.bus.on('chestOpened', (c) => show(c.item ? `Chest · ${c.gold} gold · and ${c.item.name} (${RW[c.item.r] || c.item.r})!` : `Chest · ${c.gold} gold · no gear this time`, c.item ? 3200 : 2600));
  sim.bus.on('levelChanged', ({ depth: d, theme, up }) => { setDepth(d); if (sim.world.kind === 'dungeon') show((up ? 'climbed · depth ' + (d + 1) + ' · ' : 'descended · ') + (sim.world.level.th.name || theme)); });
  sim.bus.on('outOfReach', () => show('too far'));
  sim.bus.on('refused', (r) => show(r.reason, 1800));                   // a command the rules turned down (heroes.js)
  sim.bus.on('resurrected', (r) => { if (r.how !== 'shrine') show(`Raised · ${r.name} · ${r.cost ? `${r.cost} gold` : 'free today'}`, 3000); });   // (a shrine says its own: above)
  // expeditions (sim expeditions.js): off on the road, and back with what it paid
  const EXP_NAME = { short: 'a watch on the road', day: 'a day for the Guild', long: 'the long round' }, RW2 = { common: 'Common', fine: 'Fine', rare: 'Rare', heirloom: 'Heirloom' };
  sim.bus.on('expeditionSent', (e) => show(`${e.name} sets out on ${EXP_NAME[e.kind] || 'the road'}`, 2400));
  sim.bus.on('expeditionBack', (e) => show(`${e.name} is back from the road · +${e.xp} XP${e.levels ? ` (level ${e.levels > 1 ? '+' + e.levels : 'up'})` : ''} · +${e.gold} gold${e.item ? ` · ${e.item.name} (${RW2[e.item.r] || e.item.r})${e.salvaged ? `, salvaged ✦${e.salvaged}: the bag was full` : ''}` : ''}`, 4200));
  // the Mere Tower (sim tower.js): Wenna won't take a company under 12; out of the hall mid-climb, the satchel's lost
  sim.bus.on('siteLevel', (e) => show(e.site === 'mere_tower' ? `Wenna Pike won’t row a company under level ${e.need} out to the Mere Tower` : `Come back at level ${e.need}`, 3200));
  sim.bus.on('towerOut', (e) => { if (e.lost && (e.lost.gold || e.lost.cinders)) show(`Out of the Tower mid-climb · the satchel is lost: ${e.lost.gold} gold, ${e.lost.cinders} cinders`, 3600); });
  sim.bus.on('cageDropped', () => show('A full cage falls · the company will break it when the fighting stops', 2600, 'cage'));   // (lamps.js: or tap it)
  sim.bus.on('cageBroken', (e) => { const c = sim.state.count; show(`${e && e.auto && e.by ? `${e.by} breaks the cage` : 'The cage breaks'} · a soul goes free · ${c.souls} freed`, 2600, 'cage'); });
  sim.bus.on('fallen', (f) => show(`${f.name} is slain: out of the fight until raised · at the temple in town, or a shrine below`, 3200));
  sim.bus.on('benched', (b) => show(`${b.name} waits on the bench at the inn`, 2200));
  // the dead on the barrows road (sim road.js): a line as you come near, and when a rank goes (content/road/)
  let road = null; fetch('./content/road/vale.json').then((r) => r.json()).then((d) => { road = d; }).catch(() => {});
  sim.bus.on('roadNear', (e) => { const t = road && road.near[String(e.ranks)]; if (t) show(t, 4200); });
  sim.bus.on('roadThinned', (e) => { const t = road && road.thinned[String(e.ranks)]; if (t) show(t, 4200); });
  sim.bus.on('trialDone', (e) => { const A = (SKILLS[e.cls] || []).find((q) => q.trial), l = (CLASSES[e.cls] || { label: e.cls }).label.toLowerCase(); if (A) show(`New skill learned · ${A.name} · every ${l} in your company knows it`, 3600); });
  sim.bus.on('companionJoined', (b) => show(`${b.name} joins your company · tap his card to talk`, 2800));
  // the Lantern Guild's sellswords (GDD §6.2)
  sim.bus.on('hired', (h) => show(`${h.name} signs on · ${h.fee} gold to the Guild`, 2200));
  sim.bus.on('wages', (w) => show(w.unpaid.length ? `Dawn · couldn't pay ${w.unpaid.join(', ')} · their perks are dark until you settle up at a tavern` : `Dawn · wages paid, ${w.paid} gold`, w.unpaid.length ? 4200 : 2400));
  sim.bus.on('wagesSettled', () => show('Wages settled · everyone is square with you', 2200));
  sim.bus.on('perkRevealed', (e) => show(`${e.name} trusts you now · ${perkWord(e.perk).name}: ${perkWord(e.perk).text}`, 4200));
  sim.bus.on('sworn', (e) => show(`${e.name} is Sworn to your company · a quarter off the wage, and they get up once a room`, 4200));
  sim.bus.on('retrained', (e) => show(`${e.name} learns ${perkWord(e.perk).name} · forgets ${perkWord(e.was).name}`, 2600));

  // the company's wages (GDD §6.2), on a line under the gold: what's due at the next dawn and when, amber
  // with ⚠ when the gold won't cover it, red with "owed" when anyone already is (never colour alone).
  // Tap it: the tavern's Hire view in town (main.js), else a one-line summary. Two minutes before a dawn
  // you can't pay, one warning.
  const line2 = document.getElementById('hudLine2'), line3 = document.getElementById('hudLine3');
  const wageEl = document.createElement('span'); wageEl.id = 'hudWage'; wageEl.setAttribute('role', 'button');
  if (line2) line2.appendChild(wageEl);
  const css = document.createElement('style');
  // (each piece of lines 2 and 3 is its own tap, 44 px tall: the sky dial's by padding given back as negative margin, the
  // wages' and the chips' by an invisible ::after, so where the wages wrap under the dial on a narrow phone nothing shows over it)
  css.textContent = `#hudWage { display: none; font: 11px/16px ui-monospace, Menlo, monospace; color: #b8ac98; letter-spacing: .3px; white-space: nowrap; pointer-events: auto; cursor: pointer; position: relative; }
    #hudWage::after { content: ''; position: absolute; left: -4px; right: -4px; top: -14px; bottom: -14px; }
    #hudWage.on { display: block; } #hudWage.short { color: #ffc060; } #hudWage.owed { color: #ff8a7a; font-weight: 700; }
    #hudSky ~ #hudWage.on::before { content: '·'; color: #6a6478; margin-right: 8px; font-weight: 400; }`;
  document.head.appendChild(css);
  const bill = () => sim.state.party.reduce((n, m) => n + wageOf(m, false), 0) + sim.state.bench.reduce((n, m) => n + wageOf(m, true), 0);
  const owedAll = () => [...sim.state.party, ...sim.state.bench].reduce((n, m) => n + (m.owed || 0), 0);
  const toDawn = () => DAY_S - (sim.state.t % DAY_S);
  let onWage = null, warnedDay = -1, wageText = '';
  function paintWage() {
    const b = bill(), o = owedAll(), g = sim.state.counters.gold || 0;
    const t = !b && !o ? '' : o ? `owed ${o} ⚠` : `−${b} · dawn ${Math.max(1, Math.ceil(toDawn() / 60))}m${g < b ? ' ⚠' : ''}`;
    if (t !== wageText) { wageText = t; wageEl.textContent = t; wageEl.className = t ? `on${o ? ' owed' : g < b ? ' short' : ''}` : ''; wageEl.setAttribute('aria-label', o ? `Your company is owed ${o} gold` : `Wages of ${b} gold due at dawn`); }
    const day = Math.floor(sim.state.t / DAY_S);
    if (b > g && toDawn() <= 120 && warnedDay !== day) { warnedDay = day; show(`Dawn in ${Math.max(1, Math.ceil(toDawn() / 60))} min · wages ${b} gold · you have ${g}`, 4200); }
  }
  /** a line of who costs what, for a tap away from a tavern */
  const wageSummary = () => {
    const S = sim.state, who = [...S.party.map((m) => [m, false]), ...S.bench.map((m) => [m, true])].filter(([m]) => wageOf(m, false) > 0);
    return `Wages at dawn: ${who.map(([m, b]) => `${m.name} ${wageOf(m, b)}${b ? ' (bench)' : ''}${m.owed > 0 ? `, owed ${m.owed}` : ''}`).join(' · ')} · you have ${S.counters.gold || 0}`;
  };
  wageEl.addEventListener('pointerdown', (e) => e.stopPropagation());
  wageEl.addEventListener('click', (e) => { e.stopPropagation(); if (!(onWage && onWage())) show(wageSummary(), 4200); });
  for (const ev of ['partyChanged', 'countersChanged', 'wages', 'wagesSettled', 'hired']) sim.bus.on(ev, paintWage);
  setInterval(paintWage, 1000); paintWage();

  // The time of day (GDD §10.1): a small sky dial under the embers. A half arc with the sun on it from dawn
  // to the end of dusk, the moon on it through the night, and always the part's word (never the colour
  // alone). It reads the sim's own parts (npcs.js partOf), so it turns with the townsfolk and the light.
  // Tap it: when the next part comes, and the dawn and its wages. It sits in the HUD row, so everything
  // laid out under the row (minimap, compass, Journal, room pill) moves down with it.
  const skyEl = document.createElement('span'); skyEl.id = 'hudSky'; skyEl.setAttribute('role', 'button');
  if (line2) line2.prepend(skyEl);
  const SKY_COL = ['#f4b0a0', '#f0d478', '#ffa060', '#a8c0ff'];
  css.textContent += `#hudSky { display: flex; align-items: center; gap: 4px; height: 16px; font: 11px/16px ui-monospace, Menlo, monospace; letter-spacing: .3px; margin: -14px -4px; padding: 14px 4px; box-sizing: content-box; pointer-events: auto; cursor: pointer; white-space: nowrap; position: relative; z-index: 1; }   /* (over the wages' pad when they wrap under it, on a narrow phone) */
    #hudSky svg { flex: none; overflow: visible; }
    #hudLine3 .chip { font: 11px/16px ui-monospace, Menlo, monospace; padding: 1px 6px; border-radius: 6px; background: rgba(16,12,22,.78); border: 1px solid; white-space: nowrap; text-shadow: none; pointer-events: auto; cursor: pointer; position: relative; }
    #hudLine3 .chip::after { content: ''; position: absolute; left: -3px; right: -3px; top: -12px; bottom: -12px; }
    #hudLine3 .chip.atk { color: #ff9a84; border-color: rgba(255,154,132,.45); } #hudLine3 .chip.def { color: #9fd4f4; border-color: rgba(159,212,244,.45); }
    #hudLine3 .chip.weak { color: #e0a060; border-color: rgba(224,160,96,.45); }`;
  let skyKey = '';
  /** the sky's icon state, or null underground (a dev hold of the weather wins, as it does on screen) */
  const skyNow = () => {
    if (!sim.world || sim.world.kind === 'dungeon') return null;
    const w = weatherNow(sim);
    return w.sky || (w.kind !== 'clear' ? (w.k > 0.15 ? w.kind : 'partly') : skyAt(sim.seed >>> 0, sim.state.t || 0, sim.world.region || 'vale'));
  };
  function paintSky() {
    const t = sim.state.t, part = partOf(t), f = (((t % DAY_S) + DAY_S) % DAY_S) / DAY_S;
    const up = part < 3, k = up ? f / 0.75 : (f - 0.75) / 0.25, a = Math.PI * (1 - k);   // left to right along the arc
    const sky = skyNow(), word = sky ? skyWord(sky, part === 3) : '';   // (the weather's icon, outdoors: sim/weather.js skyAt)
    const x = 11 + 9 * Math.cos(a), y = 11 - 9 * Math.sin(a), key = `${part}${Math.round(x * 2)}${Math.round(y * 2)}${sky}`;
    if (key === skyKey) return; skyKey = key;
    const col = SKY_COL[part], next = (part + 1) % 4, mins = Math.max(1, Math.ceil((PART_S - (t % PART_S)) / 60));
    skyEl.innerHTML = `<svg width="22" height="13" viewBox="0 0 22 13" aria-hidden="true"><path d="M2 11.5 A9 9 0 0 1 20 11.5" fill="none" stroke="rgba(214,190,150,.45)" stroke-width="1.2"/>`
      + `<line x1="0" y1="11.8" x2="22" y2="11.8" stroke="rgba(214,190,150,.6)" stroke-width="1"/>`
      + (up ? `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="2.8" fill="${col}"/>` : `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="2.8" fill="${col}"/><circle cx="${(x + 1.3).toFixed(1)}" cy="${(y - 0.9).toFixed(1)}" r="2.3" fill="#141020"/>`)
      + `</svg>` + (sky ? weatherIcon(sky, part === 3) : '') + `<span style="color:${col}">${PART_NAMES[part]}</span>`;
    skyEl.setAttribute('aria-label', `Time of day: ${PART_NAMES[part]}${word ? `, ${word}` : ''}. ${PART_NAMES[next]} in ${mins} minutes.`);
  }
  const skyLine = () => {
    const t = sim.state.t, part = partOf(t), next = (part + 1) % 4, b = bill(), dawn = Math.max(1, Math.ceil(toDawn() / 60));
    const mins = Math.max(1, Math.ceil((PART_S - (t % PART_S)) / 60));
    const w = weatherNow(sim), wName = w.k > 0.15 ? weatherName(w.kind) : '', left = Math.max(1, Math.ceil(weatherLeft(sim.seed >>> 0, t, sim.world.region || 'vale') / 60));
    const ends = { fog: 'lifting', rain: 'clearing', snow: 'easing', wind: 'dropping' }[w.kind], sky = skyNow();
    const said = wName ? ` · ${wName.toLowerCase()}, ${ends} in ${left} min` : sky ? ` · ${skyWord(sky, part === 3)}` : '';
    return `${PART_NAMES[part]} · ${PART_NAMES[next].toLowerCase()} in ${mins} min` + said + (next === 0 ? '' : ` · dawn in ${dawn} min`) + (b ? ` · wages ${b} gold at dawn` : '');
  };
  skyEl.addEventListener('pointerdown', (e) => e.stopPropagation());
  skyEl.addEventListener('click', (e) => { e.stopPropagation(); show(skyLine(), 3600); });
  setInterval(paintSky, 1000); paintSky(); sim.bus.on('levelChanged', paintSky);
  syncTop();

  // Line 3 of the top bar, only while something's lit (docs/hud-mockup.html; the owner, 2026-10-05: "account for the
  // shrine buff text"): Weakened after a wipe, and a red or blue shrine's boon, each a chip with its word, its amount
  // and the time left (never the colour alone), wrapping in the left column, clear of the minimap. Each is a tap: what
  // it is, in a line. (They had shared line 1, where two boons squeezed the place name to nothing and ran off screen.)
  const chip = (cls, say) => {
    const el = document.createElement('span'); el.className = `chip ${cls}`; el.setAttribute('role', 'button'); el.style.display = 'none';
    el.addEventListener('pointerdown', (e) => e.stopPropagation());
    el.addEventListener('click', (e) => { e.stopPropagation(); show(say(), 3200); });
    if (line3) line3.appendChild(el); return el;
  };
  const clock = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
  const pct = (stat) => Math.round(100 * (Object.values(SHRINES).find((q) => q.stat === stat) || { k: 0.25 }).k);
  const weakLeft = () => Math.max(0, ...sim.state.party.map((m) => (m.weakUntil > 0 ? m.weakUntil - sim.state.t : 0)));
  const boonLeft = (stat) => Math.max(0, ((sim.state.boons || {})[stat] || 0) - sim.state.t);
  const weak = chip('weak', () => `Weakened · ${Math.max(1, Math.ceil(weakLeft() / 60))} min more · it wears off after 10 minutes of play, or at the inn`);
  const atk = chip('atk', () => `Shrine of Might · the whole party strikes harder, +${pct('atk')} % ATK · ${clock(boonLeft('atk'))} left`);
  const def = chip('def', () => `Shrine of Warding · the whole party stands firmer, +${pct('def')} % DEF · ${clock(boonLeft('def'))} left`);
  let line3Text = '';
  const set = (el, t, label) => { el.textContent = t; el.style.display = t ? '' : 'none'; el.setAttribute('aria-label', t ? label : ''); };
  const paintLine3 = () => {
    const w = weakLeft(), a = boonLeft('atk'), d = boonLeft('def');
    const tw = w > 0 ? `weakened · ${Math.max(1, Math.ceil(w / 60))} min` : '', ta = a > 0 ? `ATK +${pct('atk')}% ${clock(a)}` : '', td = d > 0 ? `DEF +${pct('def')}% ${clock(d)}` : '';
    const key = `${tw}|${ta}|${td}`; if (key === line3Text) return; line3Text = key;
    set(atk, ta, `Shrine of Might: plus ${pct('atk')} percent attack, ${Math.ceil(a)} seconds left`);
    set(def, td, `Shrine of Warding: plus ${pct('def')} percent defence, ${Math.ceil(d)} seconds left`);
    set(weak, tw, `Weakened for ${Math.ceil(w / 60)} more minutes`);
    if (line3) line3.style.display = tw || ta || td ? '' : 'none';
    syncTop();
  };
  for (const ev of ['weakened', 'partyChanged', 'boonsChanged']) sim.bus.on(ev, paintLine3);
  setInterval(paintLine3, 500); paintLine3();

  // Toasts stack (the owner, 2026-10-04: a quest's count was bare orange text, and the next message, a chest, a skill
  // or a hire, replaced it at once): each line is its own backed pill with its own timer, newest on top, at most
  // TOAST_MAX. A line given a key (a quest objective's count) updates in place rather than stacking. The stack sits
  // under the loot card while that's up (sheet.js #lootToast), so neither covers the other.
  const TOAST_MAX = 3;
  /** @type {Map<HTMLElement, { key: string | null, timer: any }>} */
  const lines = new Map();
  const place = () => {
    const loot = document.getElementById('lootToast'), lr = loot && loot.classList.contains('on') ? loot.getBoundingClientRect() : null;
    toast.style.top = lr ? `${Math.round(lr.bottom + 8)}px` : '';
  };
  const drop = (el) => { const l = lines.get(el); if (!l) return; clearTimeout(l.timer); lines.delete(el); el.remove(); if (!lines.size) toast.classList.remove('on'); };
  /** @param {string} msg @param {number} [ms] @param {string} [key] a line to update in place (the same objective's count) */
  function show(msg, ms = 1000, key) {
    let el = null;
    for (const [e, l] of lines) if ((key && l.key === key) || e.textContent === msg) { el = e; break; }
    if (!el) { el = document.createElement('div'); el.className = 't'; lines.set(el, { key: key || null, timer: null }); }
    el.textContent = msg; toast.prepend(el);
    const l = lines.get(el); clearTimeout(l.timer); l.timer = setTimeout(() => drop(el), ms);
    while (lines.size > TOAST_MAX) drop(/** @type {HTMLElement} */ (toast.lastElementChild));
    place(); toast.classList.add('on');
  }
  setInterval(() => { if (lines.size) place(); }, 250);   // the loot card comes and goes on its own
  /** fn() → true if it handled a tap on the wage line (main.js: the tavern, in town) */
  return { show, onWage: (fn) => { onWage = fn; } };
}
