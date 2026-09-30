// @ts-check
// boardwords.js — the words for the Lantern Guild's board jobs (content/board/<template>.json),
// put together with a job the sim built (sim/board.js). A job's shape and rewards are the sim's;
// its title, hook, poster and journal lines are chosen here by the job's own draws (job.pick), so
// the same job always reads the same. Slots take a number ({n}) or a word from the same file
// ({floor} → ordinals), never free text. Shared by the board (townmenu.js) and the Journal.

import { TEMPLATES } from '../sim/board.js';

/** @type {Record<string, any>} */
const words = {};
export const boardReady = Promise.all(TEMPLATES.map((t) => fetch(`./content/board/${t}.json`).then((r) => r.json()).then((d) => { words[t] = d; }).catch(() => {})));
export const SKULLS = ['', 'Easy', 'Fair', 'Hard'];
const at = (arr, u) => arr[Math.max(0, Math.min(arr.length - 1, Math.floor(u * arr.length)))];

/** a quest def the Journal can show, from a sim job (null until the words have loaded) @param {any} job */
export function boardWords(job) {
  const w = job && words[job.tpl]; if (!w) return null;
  const fill = (/** @type {string} */ s) => s.replace('{n}', String(job.n)).replace('{floor}', w.ordinals ? w.ordinals[Math.max(0, Math.min(w.ordinals.length - 1, job.floor - 1))] : String(job.floor));
  const hook = at(w.hooks, job.pick[1]), o = job.steps[0].objectives[0];
  return {
    id: job.id, kind: 'board', giver: 'lantern_guild', giverName: hook.by, level: job.level, skulls: job.skulls, company: !!job.company, rewards: job.rewards,
    title: at(w.titles, job.pick[0]), hook: hook.text, summary: hook.text, brief: fill(job.n === 1 ? w.brief.one : w.brief.many),
    steps: [{ id: 'job', journal: fill(w.journal), objectives: [{ ...o, label: w.label }] }], ready: w.ready, done: w.done,
  };
}
