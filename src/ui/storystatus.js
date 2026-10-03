// @ts-check
// storystatus.js — where the main story stands, and what's still open in the region (the owner, 2026-10-03: "it's
// not clear where I find the next step in the main quest line"). The Journal showed the main story only while a
// chapter was in hand: once one was handed in, or the act was over, it said nothing. This reads the sim (never writes
// it) and says which of three things is true, then lists the region's open leads. The words are content
// (content/story.json); this only picks which ones apply.
//   next   the next chapter is offered: who gives it
//   level  the next chapter waits for a level
//   end    the act is over and the next isn't open yet (Act II: development plan M8)
// (no status while a chapter is active or ready: its own card in the Journal says what to do)

import { QUESTS, QS } from '../sim/quests.js';
import { SETS } from '../sim/lore.js';
import { FOUND } from '../sim/heroes.js';
import { SKILLS } from '../sim/skills.js';

/** the main story's chapters, in the order they're told */
export const CHAPTERS = Object.keys(QUESTS).filter((id) => QUESTS[id].kind === 'chapter');
const TRIAL_OF = Object.fromEntries(Object.entries(QUESTS).filter(([, d]) => d.trial).map(([id, d]) => [d.trial, id]));

/** @param {any} state @param {(id: string) => number} status the sim's quest status (quests.js)
 * @returns {{ kind: 'next' | 'level' | 'end', id?: string, giver?: string, level?: number } | null} */
export function storyStatus(state, status) {
  for (const id of CHAPTERS) {
    const st = status(id);
    if (st === QS.DONE) continue;
    if (st === QS.ACTIVE || st === QS.READY) return null;
    const d = QUESTS[id];
    if (st === QS.AVAILABLE) return { kind: 'next', id, giver: d.giver };
    if ((d.after || []).every((a) => status(a) === QS.DONE)) return { kind: 'level', id, level: d.level[0] };
    return null;
  }
  return { kind: 'end' };
}

/** what's still open in the Vale, by lead id (content/story.json `leads`), with the numbers its words take
 * @param {any} state @param {(id: string) => number} status @returns {{ id: string, n?: number, of?: number, cls?: string, giver?: string }[]} */
export function openLeads(state, status) {
  const out = [], has = (s, k) => (s instanceof Set ? s.has(k) : Array.isArray(s) ? s.includes(k) : !!(s && s[k]));
  const bosses = state.bosses || {}, entered = state.sitesEntered, revealed = state.revealed, company = [...state.party, ...(state.bench || [])];
  if (bosses.redhand_captain && Object.keys(FOUND).some((id) => !company.some((m) => m.id === id))) out.push({ id: 'brannoc' });
  if (!bosses.standard) out.push({ id: 'standard' });
  if (status('vale_hens_under_the_hill') !== QS.DONE && status('vale_hens_under_the_hill') !== QS.LOCKED) out.push({ id: 'warren' });
  const vale = SETS.vale || [], found = vale.filter((f) => has(state.fragments, f)).length;
  if (!has(revealed, 'ninth_milestone') && found < vale.length) out.push({ id: 'chronicle', n: found, of: vale.length });
  if (has(revealed, 'ninth_milestone') && !has(entered, 'ninth_milestone')) out.push({ id: 'milestone' });
  // a class trial waiting: someone of the class at 6+, its trial not taken up yet
  for (const cls of Object.keys(SKILLS)) {
    const q = TRIAL_OF[cls]; if (!q || has(state.trials, cls)) continue;
    const st = status(q); if (st === QS.AVAILABLE) out.push({ id: 'trial', cls, giver: QUESTS[q].giver });
  }
  out.push({ id: 'board' });
  return out;
}
