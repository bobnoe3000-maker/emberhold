// @ts-check
// away.js — offline progress (GDD §12 v1.32; the owner, 2026-10-04): "While you were away…". When a game comes back
// after a minute or more (loaded from its slot, or the tab shown again), the page tells the sim how long it was away
// (`away`, at most four hours counted: sim core.js AWAY_MAX) and plays that time through on the same sim, exactly, as
// fast as the machine allows: slices of ~30 ms between frames, with a bar and the time played so far. The bus is quiet
// meanwhile (sim bus.js: the renderer, HUD and sound sit out the hours; only the sim's own listeners and this collector
// hear), the autosave is held (so a page closed half-way plays the whole window again next time, from the old save),
// and the loop doesn't tick. Stop here ends it early (`awayStop`): the rest isn't counted. Then a summary of what
// happened, read from the collector and the state before and after, and the game carries on where the time left it.
// Nothing is given here: every coin, point and item came out of the sim's rules.

import { AWAY_MAX, AWAY_MIN, TICK_HZ } from '../sim/core.js';
import { SITES } from '../sim/sites.js';
import { swallow } from './actorart.js';

const CSS = `
#awayWrap { position: fixed; inset: 0; z-index: 40; display: none; align-items: center; justify-content: center; padding: 16px;
  background: rgba(8,6,12,.92); font-family: Georgia, serif; color: #efe4cf; }
#awayWrap.on { display: flex; }
#away { width: min(420px, 100%); background: rgba(18,14,24,.98); border: 1px solid rgba(214,170,98,.45); border-radius: 14px; padding: 16px 16px 14px;
  box-shadow: 0 10px 40px rgba(0,0,0,.7); max-height: calc(100vh - 32px); overflow-y: auto; }
#away .kind { font: 11px ui-monospace, Menlo, monospace; letter-spacing: 2px; color: #a08a6a; text-transform: uppercase; }
#away h2 { font: 600 20px Georgia, serif; color: #f0c880; margin: 3px 0 6px; }
#away p { font-size: 14px; line-height: 1.45; margin: 0 0 10px; color: #d8ccb8; }
#away .bar { height: 10px; border-radius: 5px; background: #241e2e; border: 1px solid #3a3346; overflow: hidden; margin: 6px 0 6px; }
#away .bar i { display: block; height: 100%; width: 0; background: linear-gradient(90deg, #8a5a20, #f0b860); }
#away .time { font: 12px ui-monospace, Menlo, monospace; color: #b8ac98; margin-bottom: 12px; }
#away ul { list-style: none; padding: 0; margin: 0 0 12px; font: 12.5px ui-monospace, Menlo, monospace; line-height: 1.7; color: #cbbfae; }
#away ul b { color: #efe4cf; font-weight: 600; }
#away .bad { color: #ff9a84; }
#away button { width: 100%; min-height: 46px; border-radius: 10px; font: 600 15px Georgia, serif; }
#away .go { background: linear-gradient(#f0c880, #b07a30); color: #1a1006; border: 1px solid #f6dca8; }
#away .stop { background: none; color: #d8a040; border: 1px solid rgba(214,170,98,.5); }
`;
const RARITY = { common: 'Common', fine: 'Fine', rare: 'Rare', heirloom: 'Heirloom' };
/** "3 h 12 min" @param {number} s */
const hm = (s) => { const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60); return h ? `${h} h ${m} min` : m ? `${m} min` : `${Math.round(s)} s`; };

/** Make it before the presentation layers subscribe to the bus (main.js seals the bus after it), so its collector
 * hears even when the bus is quiet. @param {{ sim: any, hold: (on: boolean) => void, refresh: () => void }} o */
export function createAway({ sim, hold, refresh }) {
  // the collector: only while a catch-up runs
  /** @type {any} */ let rec = null;
  const on = (k, f) => sim.bus.on(k, (e) => { if (rec) f(e); });
  on('wave', (e) => { if (e.cleared) rec.waves++; });
  on('slain', () => { rec.kills++; });
  on('loot', (e) => { rec.loot.push({ name: e.item.name, r: e.item.r, salvaged: e.salvaged || 0 }); });
  on('defeat', (e) => { rec.defeat = e; });
  on('wages', (e) => { rec.wages += e.paid; if (e.unpaid && e.unpaid.length) rec.unpaid = e.unpaid; });
  on('towerLanding', () => { rec.landings++; });
  on('bossDown', (e) => { rec.bosses.push(e.name); });
  on('fallen', (e) => { rec.fallen.push(e.name); });

  const style = document.createElement('style'); style.textContent = CSS; document.head.appendChild(style);
  const wrap = document.createElement('div'); wrap.id = 'awayWrap'; wrap.setAttribute('role', 'dialog'); wrap.setAttribute('aria-label', 'While you were away');
  wrap.innerHTML = '<div id="away"></div>'; document.body.appendChild(wrap); swallow(wrap);
  const box = /** @type {HTMLElement} */ (wrap.querySelector('#away'));
  let running = false, stopAsked = false;

  const el = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text !== undefined) e.textContent = text; return e; };
  function progressView(total) {
    box.textContent = '';
    box.append(el('div', 'kind', 'Offline'), el('h2', '', 'While you were away…'),
      el('p', '', 'The company carried on where you left it. Playing the time through on the same rules, exactly as it would have gone.'));
    const bar = el('div', 'bar'), fill = el('i'); bar.append(fill);
    const time = el('div', 'time', `0 min of ${hm(total)}`), stop = el('button', 'stop', 'Stop here');
    stop.addEventListener('click', () => { stopAsked = true; stop.textContent = 'Stopping…'; });
    box.append(bar, time, stop);
    return (done) => { fill.style.width = `${Math.min(100, (100 * done) / total).toFixed(1)}%`; time.textContent = `${hm(done)} of ${hm(total)}`; };
  }
  /** @param {any} b before @param {any} r the collector @param {number} played @param {number} asked */
  function summaryView(b, r, played, asked) {
    const S = sim.state, a = { gold: S.counters.gold || 0, embers: S.counters.embers || 0 };
    box.textContent = '';
    box.append(el('div', 'kind', 'Offline'), el('h2', '', `You were away ${hm(asked)}`));
    const note = played < asked - 1 ? (r.stopped ? `You stopped it after ${hm(played)}; the rest isn't counted.` : `The first ${hm(AWAY_MAX)} count; the rest isn't.`) : '';
    box.append(el('p', '', `${b.where}. ${note}`.trim()));
    const ul = el('ul'), li = (label, value, cls) => { const x = el('li', cls); x.append(`${label} `); const v = el('b', '', value); x.append(v); ul.append(x); };
    if (r.waves) li('Held', `${r.waves} wave${r.waves > 1 ? 's' : ''} · ${r.kills} foes down`);
    else if (b.town) li('In town', S.party.length > 1 || S.bench.length ? 'resting · the company on retainer at half wages' : 'resting');
    else li('Waited', 'nothing came');
    if (r.landings) li('The Mere Tower', `${r.landings} landing${r.landings > 1 ? 's' : ''} banked`);
    if (r.bosses.length) li('Put down', r.bosses.join(', '));
    const dg = a.gold - b.gold, de = a.embers - b.embers;
    li('Gold', `${dg >= 0 ? '+' : '−'}${Math.abs(dg)}${r.wages ? ` (wages paid ${r.wages})` : ''}`);
    if (de) li('Cinders', `${de > 0 ? '+' : '−'}${Math.abs(de)}`);
    for (const m of S.party) {
      const was = b.party.get(m.id); if (!was) continue;
      const gained = m.level > was.level ? `level ${was.level} → ${m.level}` : m.xp > was.xp ? `+${m.xp - was.xp} XP` : '';
      if (gained) li(m.name, gained);
    }
    const kept = r.loot.filter((l) => !l.salvaged), salv = r.loot.filter((l) => l.salvaged);
    if (kept.length) li('Found', kept.slice(0, 5).map((l) => `${l.name} (${RARITY[l.r] || l.r})`).join(', ') + (kept.length > 5 ? ` and ${kept.length - 5} more` : ''));
    if (salv.length) li('Bag full', `${salv.length} salvaged for ✦${salv.reduce((n, l) => n + l.salvaged, 0)}`);
    if (r.fallen.length) li('Slain', `${r.fallen.join(', ')}: raise them at a temple or a shrine`, 'bad');
    if (r.defeat) li('Beaten', `the room won; you woke at the temple${r.defeat.lost ? `, ${r.defeat.lost} gold lighter` : ''}, Weakened`, 'bad');
    if (r.unpaid) li('Owed', `couldn't pay ${r.unpaid.join(', ')} at dawn`, 'bad');
    box.append(ul);
    const go = el('button', 'go', 'Carry on'); box.append(go);
    return new Promise((res) => go.addEventListener('click', () => { wrap.classList.remove('on'); res(true); }, { once: true }));
  }
  const where = () => {
    const w = sim.world, b = sim.battle;
    if (w.kind === 'dungeon') { const S = SITES[w.site] || { name: 'a dungeon' }; return b ? `Left fighting in ${S.name}${w.site === 'mere_tower' ? `, wave ${b.wave}` : `, a level ${b.level} room`}` : `Left in ${S.name}, out of the fight`; }
    return w.kind === 'town' ? `Left in ${w.name || 'town'}` : `Left on the road (${w.name || 'the overland'})`;
  };

  /** play `secs` away through, then show what happened @param {number} secs @returns {Promise<boolean>} whether it ran */
  async function run(secs) {
    if (running || !sim.state.created || !(secs >= AWAY_MIN)) return false;
    const S = sim.state, asked = Math.floor(secs);
    const b = { gold: S.counters.gold || 0, embers: S.counters.embers || 0, party: new Map(S.party.map((m) => [m.id, { level: m.level, xp: m.xp }])), where: '', town: sim.world.kind === 'town' };
    running = true; stopAsked = false;
    rec = { waves: 0, kills: 0, loot: [], defeat: null, wages: 0, unpaid: null, landings: 0, bosses: [], fallen: [], stopped: false };
    hold(true); sim.bus.quiet = true;
    sim.commands.push({ type: 'away', secs: asked }); sim.tick();
    b.where = where();                                           // (after its first tick: a room's fight starts on a tick)
    const total = S.away ? S.away.secs : 0;
    wrap.classList.add('on'); const paint = progressView(total || asked);
    let played = 0;
    while (S.away) {
      played = total - S.away.left / TICK_HZ;
      if (stopAsked) { sim.commands.push({ type: 'awayStop' }); sim.tick(); rec.stopped = true; break; }
      const t0 = performance.now();
      while (S.away && performance.now() - t0 < 30) sim.tick();
      if (S.away) paint(total - S.away.left / TICK_HZ);
      await new Promise((r) => setTimeout(r, 0));
    }
    if (!rec.stopped) played = total;
    sim.bus.quiet = false; refresh(); hold(false);
    const r = rec; rec = null; running = false;
    await summaryView(b, r, played, asked);
    return true;
  }
  return { run, get running() { return running; } };
}
