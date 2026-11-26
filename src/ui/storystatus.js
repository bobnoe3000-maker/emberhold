// @ts-check
// storystatus.js — where the main story stands, and what's still open in the region (the owner, 2026-10-03: "it's
// not clear where I find the next step in the main quest line"). The Journal showed the main story only while a
// chapter was in hand: once one was handed in, or the act was over, it said nothing. This reads the sim (never writes
// it) and says which of three things is true, then lists the region's open leads. The words are content
// (content/story.json); this only picks which ones apply.
//   next   the next chapter is offered: who gives it
//   level  the next chapter waits for a level
//   end    the last chapter told is done and the next isn't written yet (v1.124: Act III's first two, the rest of it a
//          later update); `region` says whose words
// Every chapter names its region (Act I the Vale, Act II the Fens, Act III the Reach), and its giver stands in a town:
// 'next' names the giver's (Acts II and III open with Ilse, in Thornwick). The leads listed are the ones open where the
// company stands.
// (no status while a chapter is active or ready: its own card in the Journal says what to do)

import { QUESTS, QS } from '../sim/quests.js';
import { SETS } from '../sim/lore.js';
import { FOUND } from '../sim/heroes.js';
import { LANDS } from '../sim/regions.js';
import { NPCS } from '../sim/npcs.js';

/** the main story's chapters, in the order they're told */
export const CHAPTERS = Object.keys(QUESTS).filter((id) => QUESTS[id].kind === 'chapter');

/** @param {any} state @param {(id: string) => number} status the sim's quest status (quests.js)
 * @returns {{ kind: 'next' | 'level' | 'end', id?: string, giver?: string, town?: string, level?: number, region?: string, found?: boolean, at?: string } | null}
 * (found: the giver is a found companion, Dagny for Quota (v1.154; Tamsin's before), talked to from her card rather than in a town: content/story.json `nextFound`) */
export function storyStatus(state, status) {
  for (const id of CHAPTERS) {
    const st = status(id);
    if (st === QS.DONE) continue;
    if (st === QS.ACTIVE || st === QS.READY) return null;
    const d = QUESTS[id];
    if (st === QS.AVAILABLE) { const N = NPCS[d.giver]; return { kind: 'next', id, giver: d.giver, town: LANDS[(N || d).region || 'vale'].town, ...(N && N.found && FOUND[d.giver] ? { found: true } : N && N.found ? { at: N.found.site } : {}) }; }   // (at: a giver met at a site, not a companion: Gannet at the Lamp Fort's gate, v1.151)
    if ((d.after || []).every((a) => status(a) === QS.DONE)) return { kind: 'level', id, level: d.level[0] };
    return null;
  }
  return { kind: 'end', region: QUESTS[CHAPTERS[CHAPTERS.length - 1]].region || 'vale' };
}

/** what's still open in a region, by lead id (content/story.json `leads`), with the numbers its words take
 * @param {any} state @param {(id: string) => number} status @param {string} [region] where the company stands
 * @returns {{ id: string, n?: number, of?: number, cls?: string, giver?: string, town?: string }[]} */
export function openLeads(state, status, region = 'vale') {
  if (region === 'fens') return fensLeads(state, status);
  if (region === 'reach') return reachLeads(state, status);
  if (region === 'tidemark') return tidemarkLeads(state, status);
  const out = [], has = (s, k) => (s instanceof Set ? s.has(k) : Array.isArray(s) ? s.includes(k) : !!(s && s[k]));
  const bosses = state.bosses || {}, entered = state.sitesEntered, revealed = state.revealed, company = [...state.party, ...(state.bench || [])];
  if (bosses.redhand_captain && FOUND.brannoc && !company.some((m) => m.id === 'brannoc')) out.push({ id: 'brannoc' });
  if (!bosses.standard && status('ch1_the_standard') === QS.LOCKED) out.push({ id: 'standard' });   // (v1.49: once its chapter's offered, the Journal's main story says so)
  if (status('vale_hens_under_the_hill') !== QS.DONE && status('vale_hens_under_the_hill') !== QS.LOCKED) out.push({ id: 'warren' });
  const vale = SETS.vale || [], found = vale.filter((f) => has(state.fragments, f)).length;
  if (!has(revealed, 'ninth_milestone') && found < vale.length) out.push({ id: 'chronicle', n: found, of: vale.length });
  if (has(revealed, 'ninth_milestone') && !has(entered, 'ninth_milestone')) out.push({ id: 'milestone' });
  out.push(...trialLeads(status, 6));
  out.push({ id: 'board' });
  return out;
}

// the Fens (world doc v1.29 §5, §6, v1.30 §7): Wren, the Choir, her chain, the Chronicle and the Undercroft, the trials, the Tower, the board
function fensLeads(state, status) {
  const out = [], bosses = state.bosses || {}, company = [...state.party, ...(state.bench || [])];
  if (!bosses.toadking) out.push({ id: 'toadking' });
  else if (!company.some((m) => m.id === 'wren')) out.push({ id: 'wren' });
  if (!bosses.drowned_choir) out.push({ id: 'choir' });
  const owed = ['wren_the_marker', 'wren_night_boats', 'wren_settled'].find((q) => status(q) === QS.AVAILABLE);
  if (owed) out.push({ id: 'owed' });
  const has = (x, k) => (x instanceof Set ? x.has(k) : Array.isArray(x) ? x.includes(k) : !!(x && x[k]));
  const fens = SETS.fens || [], found = fens.filter((f) => has(state.fragments, f)).length;   // (the Fens set, v1.30: the last reveals the Undercroft)
  if (!has(state.revealed, 'reedholm_undercroft') && found < fens.length) out.push({ id: 'fenschronicle', n: found, of: fens.length });
  if (has(state.revealed, 'reedholm_undercroft') && !has(state.sitesEntered, 'reedholm_undercroft')) out.push({ id: 'undercroft' });
  out.push(...trialLeads(status, 12), { id: 'tower' }, { id: 'fensboard' });
  return out;
}

// the Reach (world doc v1.53 §3.3; the first slice, v1.124): the Foreman and Tamsin at the Cold Seam, the board
// (v1.54) and Tamsin's chain, the Reach's Chronicle and the Ninth Vault, the trials at 24
function reachLeads(state, status) {
  const out = [], bosses = state.bosses || {}, company = [...state.party, ...(state.bench || [])];
  const has = (x, k) => (x instanceof Set ? x.has(k) : Array.isArray(x) ? x.includes(k) : !!(x && x[k]));
  if (!bosses.foreman) out.push({ id: 'foreman' });
  else if (FOUND.tamsin && !company.some((m) => m.id === 'tamsin')) out.push({ id: 'tamsin' });
  if (['tamsin_the_stamp', 'tamsin_the_patterns', 'tamsin_spoiled_casting'].some((q) => status(q) === QS.AVAILABLE)) out.push({ id: 'showingoff' });
  const reach = SETS.reach || [], found = reach.filter((f) => has(state.fragments, f)).length;
  if (!has(state.revealed, 'ninth_vault') && found < reach.length) out.push({ id: 'reachchronicle', n: found, of: reach.length });
  if (has(state.revealed, 'ninth_vault') && !has(state.sitesEntered, 'ninth_vault')) out.push({ id: 'ninthvault' });
  out.push(...trialLeads(status, 24), { id: 'reachboard' });
  return out;
}

// the Tidemark (world doc v1.69 §3.7; the first band, GDD v1.150): the Harbourmaster on the Drowned Mole, then Maren in
// his office; (v1.151) Hesk, and Gannet's light. (No trials here: the owner, no class trial at 36; no board yet.)
function tidemarkLeads(state, status) {
  const out = [], bosses = state.bosses || {}, company = [...state.party, ...(state.bench || [])];
  if (!bosses.harbourmaster) out.push({ id: 'harbourmaster' });
  else if (FOUND.maren && !company.some((m) => m.id === 'maren')) out.push({ id: 'maren' });
  // (v1.151) once Low Water's done: Hesk on the Gull Isles, and Old Gannet's light at the Lamp Fort (until his chapter's taken)
  if (bosses.harbourmaster && !bosses.hesk) out.push({ id: 'hesk' });
  if (bosses.harbourmaster && status('ch4_keepers_light') <= QS.AVAILABLE) out.push({ id: 'lampfort' });
  if (status('ch4_brine_cross') === QS.ACTIVE) out.push({ id: 'brinecross' });   // (v1.151: the east barricade, while it's in hand)
  // (v1.154) once Brine Cross is held: Highmarch, the Champion on its walls, then Lucan in his palace
  if ((state.flags || {}).brine_held && !bosses.champion) out.push({ id: 'champion' });
  else if ((state.flags || {}).brine_held && !bosses.lucan) out.push({ id: 'lucan' });
  return out;
}

// a class trial on offer (someone of the class at its level, the one before it done: quests.js), the 6s in the Vale,
// the 12s in the Fens and the 24s in the Reach; who teaches it, and in which town they stand
function trialLeads(status, lv) {
  return Object.keys(QUESTS).filter((id) => QUESTS[id].trial && (QUESTS[id].trialLv || 6) === lv && status(id) === QS.AVAILABLE)
    .map((id) => { const d = QUESTS[id]; return { id: 'trial', cls: d.trial, giver: d.giver, town: LANDS[(NPCS[d.giver] || d).region || 'vale'].town }; });
}

/** the side quests in the order the Journal lists them: active, the ones to hand in first, then the tracked one, then
 * by level (the lowest first); done, the last finished first (the Journal, quest-lore-system §8; state.quests keeps the order they were taken in)
 * @template {[string, { st: number }]} E @param {E[]} list @param {'active' | 'done'} filter @param {string | null} tracked
 * @param {(id: string) => number} level @returns {E[]} */
export function sideOrder(list, filter, tracked, level) {
  if (filter === 'done') return list.slice().reverse();
  return list.slice().sort(([a, qa], [b, qb]) => (Number(qb.st === QS.READY) - Number(qa.st === QS.READY)) || (Number(b === tracked) - Number(a === tracked)) || (level(a) - level(b)));
}
