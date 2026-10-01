// hud.js — DOM overlay. Reads sim events, never sim internals.

import { SKILLS } from '../sim/skills.js';
import { CLASSES } from '../sim/party.js';
import { perkWord } from './sellswords.js';
import { wageOf } from '../sim/companions.js';
import { DAY_S } from '../sim/heroes.js';
import { PART_S, partOf } from '../sim/npcs.js';
import { PART_NAMES } from '../render/daylight.js';

export function createHud(sim) {
  // the HUD row's bottom edge (the phone's safe area included) as --hud-b, for what stacks under it: the
  // compass and Journal buttons follow the minimap down (the renderer measures the same edge)
  const hudEl = document.getElementById('hud');
  const syncTop = () => { if (hudEl) document.documentElement.style.setProperty('--hud-b', `${Math.round(Math.max(40, hudEl.getBoundingClientRect().bottom))}px`); };
  syncTop(); window.addEventListener('resize', syncTop); setInterval(syncTop, 1000);
  const wood = document.getElementById('hudWood');
  const stone = document.getElementById('hudStone');
  const depth = document.getElementById('hudDepth');
  const toast = document.getElementById('hudToast');
  let toastTimer = null;

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
  // a shrine says what it did (GDD §3.6): raised one of the Fallen, mended everyone, or kept its light
  sim.bus.on('shrine', (e) => show(e.did === 'raised' ? `Shrine · ${e.name} rises, at half health · its light is spent`
    : e.did === 'mended' ? 'Shrine · everyone standing is mended, HP and MP · its light is spent'
      : 'Shrine · nobody needs mending · it keeps its light for when someone is hurt or Fallen', e.did === 'none' ? 3200 : 2800));
  // a chest says what it held, every time, and says so when that was no gear (GDD §8, 2026-10-01); the
  // item's own card (sheet.js) follows a find
  const RW = { common: 'Common', fine: 'Fine', rare: 'Rare', heirloom: 'Heirloom' };
  sim.bus.on('chestOpened', (c) => show(c.item ? `Chest · ${c.gold} gold · and ${c.item.name} (${RW[c.item.r] || c.item.r})!` : `Chest · ${c.gold} gold · no gear this time`, c.item ? 3200 : 2600));
  sim.bus.on('levelChanged', ({ depth: d, theme, up }) => { setDepth(d); if (sim.world.kind === 'dungeon') show((up ? 'climbed · depth ' + (d + 1) + ' · ' : 'descended · ') + (sim.world.level.th.name || theme)); });
  sim.bus.on('outOfReach', () => show('too far'));
  sim.bus.on('refused', (r) => show(r.reason, 1800));                   // a command the rules turned down (heroes.js)
  sim.bus.on('fallen', (f) => show(`${f.name} is Fallen · raise them at a temple or shrine`, 2600));
  sim.bus.on('benched', (b) => show(`${b.name} waits on the bench at the inn`, 2200));
  // the dead on the barrows road (sim road.js): a line as you come near, and when a rank goes (content/road/)
  let road = null; fetch('./content/road/vale.json').then((r) => r.json()).then((d) => { road = d; }).catch(() => {});
  sim.bus.on('roadNear', (e) => { const t = road && road.near[String(e.ranks)]; if (t) show(t, 4200); });
  sim.bus.on('roadThinned', (e) => { const t = road && road.thinned[String(e.ranks)]; if (t) show(t, 4200); });
  sim.bus.on('trialDone', (e) => { const A = (SKILLS[e.cls] || []).find((q) => q.trial), l = (CLASSES[e.cls] || { label: e.cls }).label.toLowerCase(); if (A) show(`The ${l}'s trial is done · every ${l} in your company knows ${A.name}`, 3200); });
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
  const wageEl = document.createElement('span'); wageEl.id = 'hudWage'; wageEl.setAttribute('role', 'button');
  if (gold) gold.parentElement.appendChild(wageEl);
  const css = document.createElement('style');
  css.textContent = `#hud .stat #hudWage { display: none; font: 11px ui-monospace, Menlo, monospace; color: #b8ac98; letter-spacing: .3px; margin-top: 1px; pointer-events: auto; padding: 4px 0 12px; margin-bottom: -12px; cursor: pointer; }
    #hud .stat #hudWage.on { display: block; } #hud .stat #hudWage.short { color: #ffc060; } #hud .stat #hudWage.owed { color: #ff8a7a; font-weight: 700; }`;
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
  if (embers) embers.parentElement.appendChild(skyEl);
  const SKY_COL = ['#f4b0a0', '#f0d478', '#ffa060', '#a8c0ff'];
  css.textContent += `#hud .stat #hudSky { display: flex; align-items: center; gap: 4px; font: 11px ui-monospace, Menlo, monospace; letter-spacing: .3px; margin: -11px -10px -19px; padding: 12px 10px 19px; pointer-events: auto; cursor: pointer; white-space: nowrap; }
    #hud .stat #hudSky svg { flex: none; overflow: visible; }`;
  let skyKey = '';
  function paintSky() {
    const t = sim.state.t, part = partOf(t), f = (((t % DAY_S) + DAY_S) % DAY_S) / DAY_S;
    const up = part < 3, k = up ? f / 0.75 : (f - 0.75) / 0.25, a = Math.PI * (1 - k);   // left to right along the arc
    const x = 11 + 9 * Math.cos(a), y = 11 - 9 * Math.sin(a), key = `${part}${Math.round(x * 2)}${Math.round(y * 2)}`;
    if (key === skyKey) return; skyKey = key;
    const col = SKY_COL[part], next = (part + 1) % 4, mins = Math.max(1, Math.ceil((PART_S - (t % PART_S)) / 60));
    skyEl.innerHTML = `<svg width="22" height="13" viewBox="0 0 22 13" aria-hidden="true"><path d="M2 11.5 A9 9 0 0 1 20 11.5" fill="none" stroke="rgba(214,190,150,.45)" stroke-width="1.2"/>`
      + `<line x1="0" y1="11.8" x2="22" y2="11.8" stroke="rgba(214,190,150,.6)" stroke-width="1"/>`
      + (up ? `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="2.8" fill="${col}"/>` : `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="2.8" fill="${col}"/><circle cx="${(x + 1.3).toFixed(1)}" cy="${(y - 0.9).toFixed(1)}" r="2.3" fill="#141020"/>`)
      + `</svg><span style="color:${col}">${PART_NAMES[part]}</span>`;
    skyEl.setAttribute('aria-label', `Time of day: ${PART_NAMES[part]}. ${PART_NAMES[next]} in ${mins} minutes.`);
  }
  const skyLine = () => {
    const t = sim.state.t, part = partOf(t), next = (part + 1) % 4, b = bill(), dawn = Math.max(1, Math.ceil(toDawn() / 60));
    const mins = Math.max(1, Math.ceil((PART_S - (t % PART_S)) / 60));
    return `${PART_NAMES[part]} · ${PART_NAMES[next].toLowerCase()} in ${mins} min` + (next === 0 ? '' : ` · dawn in ${dawn} min`) + (b ? ` · wages ${b} gold at dawn` : '');
  };
  skyEl.addEventListener('pointerdown', (e) => e.stopPropagation());
  skyEl.addEventListener('click', (e) => { e.stopPropagation(); show(skyLine(), 3600); });
  setInterval(paintSky, 1000); paintSky(); sim.bus.on('levelChanged', paintSky);
  syncTop();

  // Weakened (after a wipe): an amber chip in the HUD while it lasts
  const weak = document.createElement('div'); weak.className = 'stat'; weak.style.cssText = 'color:#e0a060;display:none'; weak.textContent = 'weakened';
  if (depth) depth.parentElement.parentElement.appendChild(weak);
  const paintWeak = () => { weak.style.display = sim.state.party.some((m) => m.weakUntil > 0) ? '' : 'none'; };
  sim.bus.on('weakened', paintWeak); sim.bus.on('partyChanged', paintWeak); paintWeak();

  function show(msg, ms = 1000) {
    toast.textContent = msg;
    toast.classList.add('on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('on'), ms);
  }
  /** fn() → true if it handled a tap on the wage line (main.js: the tavern, in town) */
  return { show, onWage: (fn) => { onWage = fn; } };
}
