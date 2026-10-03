// @ts-check
// debugreport.js — the menu's "Copy debug report" (2026-10-03, asked for by the owner: play on a phone, paste the
// game's state into a bug report). Read only: it reads the sim and its snapshot and never writes either, so it is no
// cheat and is offered outside ?dev. Text, not HTML: a readable summary first (where, who, what quests), then the
// whole save-shaped snapshot as JSON, so a report can be replayed into a slot when that helps.
//
// Pure: it takes the sim and a few facts from the page (slot, viewport, user agent, the time) and returns a string,
// so node tests can read it.

import { CLASSES, statsFor, xpToNext } from '../sim/party.js';
import { BASES } from '../sim/items.js';
import { QUESTS, QS } from '../sim/quests.js';
import { SAVE_VERSION } from '../persist/save.js';

const QS_NAME = Object.fromEntries(Object.entries(QS).map(([k, v]) => [v, k.toLowerCase()]));
const DAY_S = 3600, PARTS = ['dawn', 'day', 'dusk', 'night'];
const r1 = (v) => Math.round(v * 10) / 10;

/** @param {any} it */
function itemLine(it) {
  if (!it) return '—';
  const B = BASES[it.base], up = it.up ? ` +${it.up}` : '';
  return `${it.name || (B && B.name) || it.base}${up} (${it.r}, ilv ${it.ilv}${B ? ', ' + B.slot : ''})`;
}

/** @param {any} m */
function memberLines(m, i) {
  let st = {}; try { st = statsFor(m); } catch { /* a half-made member: show what there is */ }
  const S = /** @type {any} */ (st), cls = (CLASSES[m.cls] || { label: m.cls }).label;
  const out = [`${i}. ${m.name} — ${cls}, level ${m.level}, XP ${m.xp ?? 0}/${xpToNext(m.level)}, HP ${Math.round(m.hp ?? 0)}/${S.maxHp ?? '?'}` +
    (m.down ? ', DOWN' : '') + (m.fallen ? ', SLAIN' : '') + (m.hired ? `, hired (rank ${m.rank ?? '?'})` : '')];
  if (S.atk !== undefined) out.push(`   ATK ${r1(S.atk)} DEF ${r1(S.def ?? 0)} CRT ${S.crit ?? 0}% DDG ${S.dodge ?? 0}%`);
  if (m.perks && m.perks.length) out.push(`   perks: ${m.perks.join(', ')}`);
  for (const [slot, it] of Object.entries(m.gear || {})) out.push(`   ${slot}: ${itemLine(it)}`);
  return out;
}

/**
 * @param {any} sim the running sim (core.js createSim)
 * @param {{ slot?: number, when?: string, ua?: string, view?: string }} [page]
 * @returns {string}
 */
export function debugReport(sim, page = {}) {
  const S = sim.state, W = sim.world, snap = sim.snapshot();
  const t = S.t || 0, day = Math.floor(t / DAY_S) + 1, part = PARTS[Math.floor((t % DAY_S) / (DAY_S / 4))] || '?';
  const where = W.kind === 'dungeon' ? `${W.siteName || W.site || 'a dungeon'}, depth ${(S.depth || 0) + 1}` : W.name || W.kind;
  const p = S.player || {};
  const L = [];
  L.push('EMBERFALL DEBUG REPORT');
  L.push(`save v${SAVE_VERSION} · slot ${page.slot ?? '?'} · seed ${sim.seed} · ${page.when || ''}`.trim());
  if (page.ua) L.push(`device: ${page.ua}${page.view ? ' · ' + page.view : ''}`);
  L.push('');
  L.push(`WHERE: ${W.kind} · ${where}${W.region ? ' · region ' + W.region : ''} · at ${r1(p.x ?? 0)}, ${r1(p.y ?? 0)}`);
  L.push(`TIME: day ${day}, ${part} (t ${Math.round(t)} s) · tick ${S.tick}`);
  const C = S.counters || {};
  L.push(`PURSE: gold ${C.gold ?? 0} · cinders ${C.embers ?? 0} · wood ${C.wood ?? 0} · stone ${C.stone ?? 0}`);
  L.push(`BATTLE: ${sim.battle && sim.battle.battle ? 'in a fight' : 'none'} · foes alive ${(W.enemies || []).filter((e) => e.hp > 0 && !e.dead).length}`);
  L.push('');
  L.push('PARTY');
  (S.party || []).forEach((m, i) => L.push(...memberLines(m, i + 1)));
  if (S.bench && S.bench.length) { L.push('BENCH'); S.bench.forEach((m, i) => L.push(...memberLines(m, i + 1))); }
  L.push('');
  L.push(`BAG (${(S.bag || []).length})`);
  for (const it of S.bag || []) L.push(`   ${it.uid} ${itemLine(it)}`);
  L.push('');
  L.push('QUESTS');
  const qs = (snap && snap.quests) || {};
  if (!Object.keys(qs).length) L.push('   none taken yet');
  for (const [id, v] of Object.entries(qs)) {
    const [st, step, ...rest] = /** @type {any[]} */ (v), d = /** @type {any} */ (QUESTS)[id] || (sim.quests.def && sim.quests.def(id));
    L.push(`   ${id}${d && d.kind ? ' (' + d.kind + ')' : ''}: ${QS_NAME[st] || st}, step ${step}${rest.length ? ' [' + rest.join(', ') + ']' : ''}${snap.tracked === id ? ' (tracked)' : ''}`);
  }
  L.push('');
  const set = (s) => (s instanceof Set ? [...s] : s || []);
  L.push(`SITES ENTERED: ${set(S.sitesEntered).join(', ') || '—'} · REVEALED: ${set(S.revealed).join(', ') || '—'}`);
  L.push(`BOSSES: ${JSON.stringify(S.bosses || {})} · TRIALS: ${JSON.stringify(S.trials || {})}`);
  L.push(`FLAGS: ${Object.keys(S.flags || {}).filter((k) => S.flags[k]).join(', ') || '—'}`);
  L.push('');
  L.push('SNAPSHOT (save-shaped JSON)');
  L.push(JSON.stringify(snap));
  return L.join('\n');
}
