// @ts-check
// storystatus.js — where the main story stands, and what's still open in the region (the owner, 2026-10-03: "it's
// not clear where I find the next step in the main quest line"). The Journal showed the main story only while a
// chapter was in hand: once one was handed in, or the act was over, it said nothing. This reads the sim (never writes
// it) and says which of three things is true, then lists the region's open leads. The words are content
// (content/story.json); this only picks which ones apply.
//   next   the next chapter is offered: who gives it
//   level  the next chapter waits for a level
//   end    the last act told is over and the next isn't open yet (Act III: a later update); `region` says whose words
// Every chapter names its region (Act I the Vale, Act II the Fens), and its giver stands in a town: 'next' names the
// giver's (Act II opens with Ilse, in Thornwick). The leads listed are the ones open where the company stands.
// (no status while a chapter is active or ready: its own card in the Journal says what to do)

import { QUESTS, QS } from '../sim/quests.js';
import { SETS } from '../sim/lore.js';
import { FOUND } from '../sim/heroes.js';
import { LANDS } from '../sim/regions.js';
import { NPCS } from '../sim/npcs.js';

/** the main story's chapters, in the order they're told */
export const CHAPTERS = Object.keys(QUESTS).filter((id) => QUESTS[id].kind === 'chapter');

/** @param {any} state @param {(id: string) => number} status the sim's quest status (quests.js)
 * @returns {{ kind: 'next' | 'level' | 'end', id?: string, giver?: string, town?: string, level?: number, region?: string } | null} */
export function storyStatus(state, status) {
  for (const id of CHAPTERS) {
    const st = status(id);
    if (st === QS.DONE) continue;
    if (st === QS.ACTIVE || st === QS.READY) return null;
    const d = QUESTS[id];
    if (st === QS.AVAILABLE) return { kind: 'next', id, giver: d.giver, town: LANDS[(NPCS[d.giver] || d).region || 'vale'].town };
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
  const out = [], has = (s, k) => (s instanceof Set ? s.has(k) : Array.isArray(s) ? s.includes(k) : !!(s && s[k]));
  const bosses = state.bosses || {}, entered = state.sitesEntered, revealed = state.revealed, company = [...state.party, ...(state.bench || [])];
  if (bosses.redhand_captain && FOUND.brannoc && !company.some((m) => m.id === 'brannoc')) out.push({ id: 'brannoc' });
  if (!bosses.standard) out.push({ id: 'standard' });
  if (status('vale_hens_under_the_hill') !== QS.DONE && status('vale_hens_under_the_hill') !== QS.LOCKED) out.push({ id: 'warren' });
  const vale = SETS.vale || [], found = vale.filter((f) => has(state.fragments, f)).length;
  if (!has(revealed, 'ninth_milestone') && found < vale.length) out.push({ id: 'chronicle', n: found, of: vale.length });
  if (has(revealed, 'ninth_milestone') && !has(entered, 'ninth_milestone')) out.push({ id: 'milestone' });
  out.push(...trialLeads(status, 6));
  out.push({ id: 'board' });
  return out;
}

// the Fens (world doc v1.29 §5, §6): Wren, the Choir, her chain, the Tower, the board
function fensLeads(state, status) {
  const out = [], bosses = state.bosses || {}, company = [...state.party, ...(state.bench || [])];
  if (!bosses.toadking) out.push({ id: 'toadking' });
  else if (!company.some((m) => m.id === 'wren')) out.push({ id: 'wren' });
  if (!bosses.drowned_choir) out.push({ id: 'choir' });
  const owed = ['wren_the_marker', 'wren_night_boats', 'wren_settled'].find((q) => status(q) === QS.AVAILABLE);
  if (owed) out.push({ id: 'owed' });
  out.push(...trialLeads(status, 12), { id: 'tower' }, { id: 'fensboard' });
  return out;
}

// a class trial on offer (someone of the class at its level, the one before it done: quests.js), the 6s in the Vale and
// the 12s in the Fens; who teaches it, and in which town they stand
function trialLeads(status, lv) {
  return Object.keys(QUESTS).filter((id) => QUESTS[id].trial && (QUESTS[id].trialLv || 6) === lv && status(id) === QS.AVAILABLE)
    .map((id) => { const d = QUESTS[id]; return { id: 'trial', cls: d.trial, giver: d.giver, town: LANDS[(NPCS[d.giver] || d).region || 'vale'].town }; });
}

