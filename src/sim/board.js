// @ts-check
// board.js — the Lantern Guild's quest board (GDD §9, quest-lore-system §3, §4.2): a few jobs a
// day on the board by the tavern door, built from templates. The sim owns what a job counts and
// what it pays; the words (titles, hooks, who posted it, journal lines) live in
// content/board/<template>.json, and a test keeps the two in step.
//
// Two postings a day (2026-10-01, GDD §9 v1.12): at dawn and at dusk, half an hour of play apart, since
// the day became an hour (it had been one a day, every 24 minutes). Pure offers: a posting's jobs are a
// function of (world seed, in-game day, dawn or dusk, the hero's level when it went up), so a job's id,
// board_<day>_<lv>_<slot> at dawn or board_<day>d_<lv>_<slot> at dusk, is enough to rebuild it (a dawn
// posting draws exactly as the one-a-day board did, so jobs held in older saves rebuild unchanged). The save keeps
// the id and the counters (quests.js), never a job's shape or rewards, and an id the save couldn't
// have earned (a later day, a level above the hero's) rebuilds to nothing.
//
// A posting goes up when you're in a town after it's due: state.board = { day, lv, half } (half 1 =
// dusk; older saves have no half: dawn). Taking and handing in happen at the board, in town:
//   boardAccept { id }   one of today's jobs, not already taken, at most MAX_JOBS open at once
//   boardTurnIn { id }   a job whose objectives are done: paid once (quests.js)
// Events: 'boardChanged' { day, lv }; 'refused' { reason } for the window; quest events from quests.js.

import { mulberry32, streamSeed, STREAM } from './rng.js';
import { DAY_S } from './heroes.js';
import { QS } from './quests.js';
import { ROOM_LEVELS_PER_FLOOR } from './world.js';

export const MAX_JOBS = 3;                 // board jobs open (active or ready) at once
export const KEEP_DONE = 12;               // finished board jobs kept for the Journal's Completed tab
const SITE = 'barrows';                    // the Vale's one site so far; more with M5
const floorLv = (f) => 1 + ROOM_LEVELS_PER_FLOOR * (f - 1);     // a floor's first rooms (world.js rankRooms)
const hallLv = (f) => floorLv(f) + 3;                           // its stairs-down hall comes last: 2–3 higher (measured, 4 seeds × 4 floors)
// No job asks for a place more than two levels above the hero: three above defeats you (GDD balance).

/** A template: which objective it sets, how its sizes are drawn and how much work it is (in
 * same-level waves, the unit rewards are measured in).
 * @typedef {{ n: number, floor: number }} Size
 * @type {Record<string, { min: (lv: number) => boolean, size: (rng: () => number, lv: number) => Size, objective: (s: Size) => any, effort: (s: Size) => number, target: (s: Size, lv: number) => number }>} */
export const BOARD = {
  hold: {                                  // hold N waves in any room of the site
    min: () => true,
    size: (rng) => ({ n: 3 + ((rng() * 4) | 0), floor: 0 }),
    objective: (s) => ({ type: 'waves', site: SITE, count: s.n }),
    effort: (s) => s.n, target: (s, lv) => lv,
  },
  retrieve: {                              // open N of its chests
    min: () => true,
    size: (rng) => ({ n: 1 + ((rng() * 3) | 0), floor: 0 }),
    objective: (s) => ({ type: 'loot', site: SITE, count: s.n }),
    effort: (s) => 2 * s.n, target: (s, lv) => lv,
  },
  bounty: {                                // slay N elites (one comes every fifth wave)
    min: () => true,
    size: (rng) => ({ n: 1 + ((rng() * 2) | 0), floor: 0 }),
    objective: (s) => ({ type: 'elites', site: SITE, count: s.n }),
    effort: (s) => 5 * s.n, target: (s, lv) => lv,
  },
  delve: {                                 // reach floor F
    min: (lv) => floorLv(2) <= lv + 2,
    size: (rng, lv) => { let top = 2; while (floorLv(top + 1) <= lv + 2 && top < 6) top++; return { n: 0, floor: 2 + ((rng() * (top - 1)) | 0) }; },
    objective: (s) => ({ type: 'reach', site: SITE, count: s.floor }),
    effort: (s) => 3 * (s.floor - 1) + 1, target: (s) => floorLv(s.floor),
  },
  warden: {                                // hold N waves in the stairs-down hall of floor F or deeper
    min: (lv) => hallLv(1) <= lv + 2,
    size: (rng, lv) => { let top = 1; while (hallLv(top + 1) <= lv + 2 && top < 6) top++; return { n: 2 + ((rng() * 2) | 0), floor: 1 + ((rng() * top) | 0) }; },
    objective: (s) => ({ type: 'waves', site: SITE, count: s.n, hall: true, floor: s.floor }),
    effort: (s) => s.n + 2 * (s.floor - 1) + 1, target: (s) => hallLv(s.floor),
  },
};
export const TEMPLATES = Object.keys(BOARD);
/** a job that sends you into a room a lone hero can't hold (GDD §7.1: from room level 4 a room at
 * your level or near it wants company; well below you, you're fine alone): a Warden's hall or a Delve
 * floor of level 4+ that's no more than a level under yours */
export const companyFor = (tpl, target, lv) => (tpl === 'warden' || tpl === 'delve') && target >= 4 && target >= lv - 1;
/** 1 easy · 2 fair · 3 hard: the job's own level against the hero's (GDD §9) */
export const skullsFor = (target, lv) => (target - lv <= 0 ? 1 : target - lv <= 2 ? 2 : 3);
const round5 = (v) => Math.max(5, Math.round(v / 5) * 5);
// A job pays on top of what its fighting earns. Measured (solo, same-level room, 5 waves): a wave
// gives about 23 XP × level (L1 24, L3 68) and 2.6 gold × level (L1 3, L3 8). The job adds half the
// XP again and a little more than the gold again, more for skulls. (XP as a share of a level falls
// with level, as it does for the fights: the XP table is steeper than the enemies' XP.)
export const rewardFor = (effort, lv, skulls) => {
  const k = 1 + 0.25 * (skulls - 1);
  return { xp: round5(12 * lv * effort * k), gold: round5(effort * (3 + 2 * lv) * k) };
};

/** @typedef {{ id: string, tpl: string, day: number, half: number, lv: number, slot: number, n: number, floor: number, skulls: number, company: boolean, pick: [number, number], kind: 'board', giver: string, region: string, level: [number, number], steps: { id: string, objectives: any[] }[], rewards: { xp: number, gold: number } }} Job */
const cache = new Map();
/** A posting's jobs. @param {number} seed @param {number} day @param {number} lv @param {number} [half] 0 dawn · 1 dusk @returns {Job[]} */
export function boardOffers(seed, day, lv, half = 0) {
  const key = `${seed}_${day}_${lv}_${half}`; if (cache.has(key)) return cache.get(key);
  const rng = mulberry32(streamSeed(seed ^ Math.imul(day + 1, 0x9e3779b1) ^ (half ? 0x5d0c4e17 : 0), STREAM.BOARD));
  const pool = TEMPLATES.filter((t) => BOARD[t].min(lv));
  for (let i = pool.length - 1; i > 0; i--) { const j = (rng() * (i + 1)) | 0; [pool[i], pool[j]] = [pool[j], pool[i]]; }
  const jobs = pool.slice(0, lv >= 4 ? 4 : 3).map((tpl, slot) => {
    const T = BOARD[tpl], s = T.size(rng, lv), target = T.target(s, lv), skulls = skullsFor(target, lv), company = companyFor(tpl, target, lv);
    /** @type {[number, number]} */ const pick = [rng(), rng()];              // the words: a title / hook and a poster (content/board)
    return { id: `board_${day}${half ? 'd' : ''}_${lv}_${slot}`, tpl, day, half, lv, slot, n: s.n, floor: s.floor, skulls, company, pick,
      kind: /** @type {'board'} */ ('board'), giver: 'lantern_guild', region: 'vale', level: /** @type {[number, number]} */ ([lv, lv]),
      steps: [{ id: 'job', objectives: [T.objective(s)] }], rewards: rewardFor(T.effort(s), lv, skulls) };
  });
  if (cache.size > 64) cache.clear();
  cache.set(key, jobs);
  return jobs;
}
const ID = /^board_(\d+)(d?)_(\d+)_(\d)$/;
/** a job from its id alone (null if it isn't one) @param {number} seed @param {string} id */
export function jobOf(seed, id) {
  const m = ID.exec(String(id)); if (!m) return null;
  return boardOffers(seed, +m[1], +m[3], m[2] ? 1 : 0)[+m[4]] || null;
}

/** @param {{ state: any, bus: any, getWorld: () => any, seed: number, quests: any }} o */
export function createBoard({ state, bus, getWorld, seed, quests }) {
  if (!state.board) state.board = { day: -1, lv: 1, half: 0 };
  const day = () => Math.floor(state.t / DAY_S);
  const half = () => ((state.t % DAY_S) >= DAY_S / 2 ? 1 : 0);                 // dusk starts the day's second half
  const inTown = () => getWorld().kind === 'town' && (getWorld().services || []).some((v) => v.kind === 'tavern');   // (the board hangs in the tavern: a waystation's too, M8)
  const refuse = (reason) => { bus.emit('refused', { reason }); return true; };
  const today = () => (state.board.day >= 0 ? boardOffers(seed, state.board.day, state.board.lv, state.board.half || 0) : []);
  const open = () => Object.keys(state.quests).filter((k) => ID.test(k) && (state.quests[k].st === QS.ACTIVE || state.quests[k].st === QS.READY)).length;
  /** a job the save could have earned: not from a posting to come, not above the hero's level @param {string} id */
  const def = (id) => { const j = jobOf(seed, id); return j && (j.day < day() || (j.day === day() && j.half <= half())) && j.lv <= state.party[0].level ? j : null; };

  // a new posting goes up the first time you're in a town after it's due (dawn and dusk)
  function tick() {
    if ((state.board.day === day() && (state.board.half || 0) === half()) || !inTown()) return;
    state.board = { day: day(), lv: state.party[0].level, half: half() };
    bus.emit('boardChanged', { ...state.board });
  }
  function command(cmd) {
    if (cmd.type === 'boardAccept') {
      if (!inTown()) return refuse('Jobs are taken at the board in town');
      const j = today().find((x) => x.id === cmd.id); if (!j) return true;
      if (state.quests[j.id]) return true;                                   // taken already (or done)
      if (open() >= MAX_JOBS) return refuse(`You can hold ${MAX_JOBS} jobs at a time`);
      quests.begin(j.id);
      return true;
    }
    if (cmd.type === 'boardTurnIn') {
      if (!inTown()) return refuse('Hand jobs in at the board in town');
      if (!ID.test(String(cmd.id)) || quests.status(cmd.id) !== QS.READY) return true;
      quests.finish(cmd.id);
      const done = Object.keys(state.quests).filter((k) => ID.test(k) && state.quests[k].st === QS.DONE);
      for (const k of done.slice(0, Math.max(0, done.length - KEEP_DONE))) delete state.quests[k];   // the oldest go first
      return true;
    }
    return false;
  }
  /** today's jobs, each with its status (available, or its quest state) */
  const offers = () => today().map((j) => ({ ...j, status: state.quests[j.id] ? state.quests[j.id].st : QS.AVAILABLE }));
  const snapshot = () => ({ board: { ...state.board } });
  function restore(data) {
    const b = data?.board, d = b && Number.isInteger(b.day) ? b.day : -1, lv = b && Number.isInteger(b.lv) ? b.lv : 1, h = b && b.half === 1 ? 1 : 0;   // v15 and older: no half (dawn)
    const due = d >= 0 && (d < day() || (d === day() && h <= half()));
    state.board = due && lv >= 1 && lv <= state.party[0].level ? { day: d, lv, half: h } : { day: -1, lv: 1, half: 0 };   // v8 and older: none yet
  }
  const nextDawn = () => DAY_S - (state.t % DAY_S);                          // seconds of play until the next dawn (the wage)
  /** the next posting: 'dawn' or 'dusk', and the seconds of play until it */
  const nextPosting = () => { const s = state.t % DAY_S; return s < DAY_S / 2 ? { at: 'dusk', secs: DAY_S / 2 - s } : { at: 'dawn', secs: DAY_S - s }; };
  return { tick, command, offers, def, open, snapshot, restore, nextDawn, nextPosting };
}
