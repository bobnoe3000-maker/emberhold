// @ts-check
// bowl.js — the Bowl's rules (GDD §17 v1.85; docs/bowl-arena-proposal.md §5): the ladder, the rating, the marks, the
// day's picks and the day's tourney. The bout itself is battle.js's (startBout: one brain for both sides); the rival
// companies are rivals.js's. Everything here is a pure function of the state, the day and the roster, so a replay pays
// the same marks.
//
// The owner's calls (2026-11-13: "Menu fine at min level 6, in brackets, … for marks only, company locked for the
// tournament, yes a hero only option. Tournament are daily reset for now"):
//   - reached from the menu from level 6 (BOWL.minLevel); a company's bracket is its hero's level's (BRACKETS);
//   - it pays marks of the Bowl and nothing else: no XP, no gold, no loot;
//   - a bout is the company as it stands, or the hero alone against a rival company's first;
//   - the tourney is a day's: one entry a day, eight companies, the company you enter with locked till it's out;
//   - a "day" is the game's (heroes.js DAY_S, an hour of play): the sim keeps no wall clock, so a calendar day waits for
//     the server.
// (v1.86; the owner: "When i enter the tournament arena i want to be able to choose from 5 opponents, refresh 3x per day.
// I can have up to 10 fights per day. The game simulates similar rules for ai opponents. Lets assume 100 teams for now"):
//   - the board shows five teams near your rating; three times a day you may draw five new; ten bouts a day, each paid;
//   - the hundred teams play a league of their own on the same rules (leagueDay), from a fixed seed: the same for every
//     player, as a server's would be once other players' companies are in it.
// (v1.88; the owner, on the board's mockup, docs/bowl-arena-proposal.md §13: "At the top - first tab choices - are Team vs
// Individual … Entering a fight automatically registers you for the Tourney … New faces - cost is gold to refresh - 100,
// 250 and 500 for refresh 1-3", then "mockup looks good - implement"):
//   - two ladders, MODES: Team (the company) and Individual (the hero alone against a player's hero), each its own rating,
//     record, board and league; the day's ten bouts and three new draws are shared between them;
//   - new faces cost gold: 100, 250, 500 (BOWL.refreshCost); the day's first five are free;
//   - the tourney is the day's, one a ladder: your first bout of the day on a ladder enters you, and you're placed among
//     the hundred by the day's wins, then the rating gained; at the day's end the places are paid marks (BOWL.purse). The
//     eight-company bracket and the locked company are gone.

import { mulberry32, streamSeed } from './rng.js';
import { exp } from './detmath.js';
import { DAY_S } from './heroes.js';
import { GRADES, GRADE_IDS, ROSTER, ROSTER_IDS } from './rivals.js';

export const BOWL = {
  minLevel: 6, picks: 5, fights: 10, loss: 1, draw: 1,                 // five to choose from, ten bouts a day (both ladders, all paid); a loss or a draw pays 1
  refreshCost: [100, 250, 500], refreshes: 3,                         // five new faces: gold, by the day's draw (the first five free)
  start: 1200, rd0: 250, rdMin: 60, rdRival: 80, near: 15, band: 60, // the rating (Glicko): where everyone starts, how sure; picks from the 15 nearest; within 60 is "even"
  spread: 80,                                                         // a team's talent either side of its grade
  purse: [[1, 16], [3, 10], [8, 6], [16, 3]],                         // the day's tourney: [down to place, marks]; past 16th, nothing
  preseason: 20, drawP: 0.04,                                         // the league's days before the first (so day 0's ratings mean something); a draw's chance
  seed: 0xb0e1b0e1,                                                   // (the league's draws: the same for everyone)
};
/** the two ladders: the company, and the hero alone */
export const MODES = /** @type {const} */ (['team', 'solo']);
/** @typedef {'team' | 'solo'} Mode */
const STREAM = { team: 0x1ea9, solo: 0x5010 };
/** the Bowl's brackets, by the hero's level (the Mere Tower's from 15 on, tower.js) */
export const BRACKETS = [[6, 11], [12, 14], [15, 29], [30, 44], [45, 59], [60, 75]];
export const bracketOf = (level) => { const i = BRACKETS.findIndex(([a, b]) => level >= a && level <= b); return i >= 0 ? i : level < 6 ? 0 : BRACKETS.length - 1; };
/** where the Bowl sits you, by rating (proposal §5) */
export const TIERS = [{ id: 'sweepers', at: -1e9 }, { id: 'sand', at: 1000 }, { id: 'lower', at: 1200 }, { id: 'upper', at: 1400 }, { id: 'box', at: 1600 }];
export const tierOf = (r) => [...TIERS].reverse().find((t) => r >= t.at) || TIERS[0];
/** a manner's measured edge, as rating (tools/balance/bowl.mjs --all at level 6, steady against steady, 2026-11-13: the
 *  stalkers won 60–100 % of their pairings, the spellbinders 0–55 %): part of a team's strength in the league */
export const MANNER_EDGE = { stalkers: 120, brawlers: 60, balanced: 0, wall: 0, spellbinders: -150 };
/** how many of each grade the hundred hold, by weight */
const GRADE_W = { green: 2, steady: 3, seasoned: 3, hardened: 2, champion: 1 };

export const dayOf = (state) => Math.floor(state.t / DAY_S);

/** a ladder's record: its rating, its record, the day's board and the day's tourney (tw tl td: its bouts today; tg: the
 *  rating gained today) @returns {any} */
export const freshLadder = () => ({ r: BOWL.start, rd: BOWL.rd0, won: 0, lost: 0, drawn: 0, fought: [], picks: [], shown: [], tw: 0, tl: 0, td: 0, tg: 0 });
/** a fresh record @returns {any} */
export const freshBowl = () => ({ marks: 0, day: -1, paid: 0, refresh: 0, team: freshLadder(), solo: freshLadder(), champion: -1, lastTourney: null });
/** the mode a command or a bout names (anything else is the company's) @returns {Mode} */
export const modeOf = (m) => (m === 'solo' ? 'solo' : 'team');
/** the record as of today (sim only: it pays yesterday's tourneys, rolls the day over, and draws each board's first five)
 *  @param {any} state */
export function bowlOf(state) {
  if (!state.bowl) state.bowl = freshBowl();
  const b = state.bowl, d = dayOf(state);
  if (b.day !== d) {
    if (b.day >= 0) payTourneys(b);
    b.day = d; b.paid = 0; b.refresh = 0;
    for (const m of MODES) { const L = b[m]; L.fought = []; L.shown = []; L.picks = []; L.tw = L.tl = L.td = 0; L.tg = 0; L.picks = drawPicks(L, d, m, 0); }   // a new day: five new faces each, ten bouts again
  }
  return b;
}

const idHash = (s) => { let h = 0x811c9dc5; for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 0x01000193); return h >>> 0; };

// ── the hundred: each team's own strength, and the league they play every day ────────────────────────────────────
/** @type {Map<string, { id: string, manner: string, grade: string, strength: number, solo: number }>} */
const TEAMS = new Map();
/** a team as it is for good: its grade (how it's built, rivals.js), and its strength in the league (its grade's
 *  rating, its manner's edge and a talent of its own), hidden: what its rating finds out; `solo` its hero's alone (the
 *  grade's rating and a talent of the hero's own: no manner, one fighter) */
export function teamOf(id) {
  let t = TEAMS.get(id); if (t) return t;
  const r = mulberry32(streamSeed(BOWL.seed, idHash(id)));
  let n = r() * GRADE_IDS.reduce((a, g) => a + GRADE_W[g], 0), grade = GRADE_IDS[0];
  for (const g of GRADE_IDS) { n -= GRADE_W[g]; if (n < 0) { grade = g; break; } }
  const manner = ROSTER[id][0];
  t = { id, manner, grade, strength: GRADES[grade].rating + (MANNER_EDGE[manner] || 0) + (r() * 2 - 1) * BOWL.spread, solo: 0 };
  t.solo = GRADES[grade].rating + (mulberry32(streamSeed(BOWL.seed, idHash(id) ^ STREAM.solo))() * 2 - 1) * BOWL.spread;
  TEAMS.set(id, t); return t;
}
/**
 * The league (the owner, 2026-11-13: "The game simulates similar rules for ai opponents. Lets assume 100 teams for now"):
 * every team fights BOWL.fights bouts a day on each ladder, each against a team near its rating (the hundred ordered by
 * rating with a draw of jitter, paired off: what picking from the five nearest comes to), the result drawn on the two
 * strengths' expected score, a few drawn, and both ratings moved as the player's is. Its days run from BOWL.preseason
 * before the first, so day 0's ratings already tell the teams apart. The same for every player and every replay; the
 * player's own bouts don't move it (a shared league, as the server's will be). Kept as each day's start, built on as days
 * are asked, a list a ladder.
 * @type {Record<string, { r: Float64Array, rd: Float64Array, w: Int32Array, l: Int32Array, d: Int32Array }[]>}
 */
const DAYS = { team: [], solo: [] };
/** @param {number} day @param {Mode} [mode] */
function leagueDay(day, mode = 'team') {
  const N = ROSTER_IDS.length, k = Math.max(0, Math.floor(day) + BOWL.preseason), D = DAYS[mode];
  if (!D.length) D.push({ r: new Float64Array(N).fill(BOWL.start), rd: new Float64Array(N).fill(BOWL.rd0), w: new Int32Array(N), l: new Int32Array(N), d: new Int32Array(N) });
  const S = ROSTER_IDS.map((id) => (mode === 'solo' ? teamOf(id).solo : teamOf(id).strength)), order = ROSTER_IDS.map((_, i) => i), jit = new Float64Array(N);
  while (D.length <= k) {
    const p = D[D.length - 1], q = { r: p.r.slice(), rd: p.rd.slice(), w: p.w.slice(), l: p.l.slice(), d: p.d.slice() };
    const rng = mulberry32(streamSeed((BOWL.seed ^ Math.imul(D.length, 0x2545f491)) >>> 0, STREAM[mode]));
    for (let round = 0; round < BOWL.fights; round++) {
      for (let i = 0; i < N; i++) jit[i] = q.r[i] + (rng() * 2 - 1) * BOWL.band * 2;
      order.sort((a, b) => jit[a] - jit[b] || a - b);
      for (let i = 0; i + 1 < N; i += 2) {
        const a = order[i], b = order[i + 1], u = rng(), pa = expected(S[a], S[b], 0);
        const sa = u < BOWL.drawP ? 0.5 : rng() < pa ? 1 : 0;
        const na = rate(q.r[a], q.rd[a], q.r[b], sa, q.rd[b]), nb = rate(q.r[b], q.rd[b], q.r[a], 1 - sa, q.rd[a]);
        q.r[a] = na.r; q.rd[a] = na.rd; q.r[b] = nb.r; q.rd[b] = nb.rd;
        if (sa === 1) { q.w[a]++; q.l[b]++; } else if (sa === 0) { q.w[b]++; q.l[a]++; } else { q.d[a]++; q.d[b]++; }
      }
    }
    D.push(q);
  }
  return D[k];
}
/** a team on a day on a ladder (its standing at the day's start) @param {string} id @param {number} day @param {Mode} [mode]
 *  @returns {{ id: string, manner: string, grade: string, rating: number, rd: number, rank: number, won: number, lost: number, drawn: number }} */
export function companyOn(id, day, mode = 'team') {
  const L = leagueDay(day, mode), i = ROSTER_IDS.indexOf(id), t = teamOf(id), r = L.r[i];
  let rank = 1; for (let j = 0; j < L.r.length; j++) if (L.r[j] > r || (L.r[j] === r && j < i)) rank++;
  return { id, manner: t.manner, grade: t.grade, rating: Math.round(r), rd: Math.round(L.rd[i]), rank, won: L.w[i], lost: L.l[i], drawn: L.d[i] };
}
/** the hundred on a day, best first @param {number} day @param {Mode} [mode] */
export const fieldOn = (day, mode = 'team') => ROSTER_IDS.map((id) => companyOn(id, day, mode)).sort((a, b) => a.rank - b.rank);

/** five to choose from: the BOWL.near nearest the ladder's rating today that haven't been on its board today, five of
 *  them drawn (its own draw a refresh), easiest first; they're added to the day's shown
 *  @param {any} L the ladder's record @param {number} d the day @param {Mode} mode @param {number} n the day's draw @returns {string[]} */
function drawPicks(L, d, mode, n) {
  const not = new Set([...(L.fought || []), ...(L.picks || []), ...(L.shown || [])]);
  const near = fieldOn(d, mode).filter((c) => !not.has(c.id)).sort((x, y) => Math.abs(x.rating - L.r) - Math.abs(y.rating - L.r) || x.rank - y.rank).slice(0, BOWL.near);
  const rng = mulberry32(streamSeed((BOWL.seed ^ Math.imul(d + 1, 0x9e3779b1)) >>> 0, 0x91c + n + (mode === 'solo' ? 0x100 : 0)));
  for (let i = near.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [near[i], near[j]] = [near[j], near[i]]; }
  const five = near.slice(0, BOWL.picks).sort((x, y) => x.rating - y.rating || x.rank - y.rank).map((c) => c.id);
  L.shown = [...(L.shown || []), ...five];
  return five;
}
/** the next new five's price, or null when the day's draws are spent @param {any} b the record */
export const refreshCostOf = (b) => (b && (b.refresh || 0) < BOWL.refreshCost.length ? BOWL.refreshCost[b.refresh || 0] : null);
/** five new faces on a ladder's board (sim only: the `bowlRefresh` command), for gold: 'none' when the day's three are
 *  spent, 'gold' when it can't be paid, else the gold paid @param {any} state @param {Mode} mode @returns {number | 'none' | 'gold'} */
export function refreshPicks(state, mode) {
  const b = bowlOf(state), cost = refreshCostOf(b);
  if (cost === null) return 'none';
  if ((state.counters.gold || 0) < cost) return 'gold';
  state.counters.gold -= cost; b.refresh++;
  const L = b[modeOf(mode)]; L.picks = drawPicks(L, b.day, modeOf(mode), b.refresh);
  return cost;
}
/** a ladder's board as it stands (read only: the UI's): the five still to fight today, each as the league has it today
 *  @param {any} state @param {Mode} [mode] @returns {any[]} */
export function picksOf(state, mode = 'team') {
  const b = state.bowl, d = dayOf(state); if (!b || b.day !== d || !b[mode]) return [];
  return (b[mode].picks || []).map((id) => companyOn(id, d, mode));
}
/** your place among the hundred today on a ladder (the rank you'd hold) @param {any} state @param {Mode} [mode] */
export function rankOf(state, mode = 'team') { const r = ((state.bowl || freshBowl())[mode] || freshLadder()).r, L = leagueDay(dayOf(state), mode); let n = 1; for (const x of L.r) if (x > r) n++; return n; }

// ── the day's tourney: everyone who fights that day, by the day's wins, then the rating gained ─────────────────────
/** the hundred's day on a ladder: each one's wins and rating gained that day (the league's day, played out) */
function dayTable(day, mode) {
  const a = leagueDay(day, mode), z = leagueDay(day + 1, mode);
  return ROSTER_IDS.map((_, i) => ({ w: z.w[i] - a.w[i], g: z.r[i] - a.r[i] }));
}
/** a ladder's tourney today: entered (a bout fought today), its record, and your place among the 101 (the hundred's day
 *  as it finishes, yours as it stands) @param {any} b the record @param {Mode} mode @param {number} [day] */
export function tourneyOf(b, mode, day = b ? b.day : 0) {
  const L = (b && b[mode]) || freshLadder(), n = L.tw + L.tl + L.td;
  let place = 1; for (const t of dayTable(day, mode)) if (t.w > L.tw || (t.w === L.tw && t.g > L.tg)) place++;
  return { in: n > 0, w: L.tw, l: L.tl, d: L.td, place, of: ROSTER_IDS.length + 1 };
}
/** the day's tourney as a table (the UI's Rankings): the hundred by the day's wins and rating gained, you among them
 *  @param {any} b the record @param {Mode} mode @param {number} [day] @returns {{ id: string, w: number, g: number }[]} */
export function tourneyTable(b, mode, day = b ? b.day : 0) {
  const L = (b && b[mode]) || freshLadder(), rows = dayTable(day, mode).map((t, i) => ({ id: ROSTER_IDS[i], w: t.w, g: t.g }));
  rows.sort((x, y) => y.w - x.w || y.g - x.g || (x.id < y.id ? -1 : 1));
  const me = { id: 'you', w: L.tw, g: L.tg }, at = rows.findIndex((t) => t.w < me.w || (t.w === me.w && t.g <= me.g));   // (ties yours: tourneyOf's place)
  rows.splice(at < 0 ? rows.length : at, 0, me);
  return rows.map((t) => ({ ...t, g: Math.round(t.g) }));
}
/** the marks a place is paid */
export const purseFor = (place) => { const p = BOWL.purse.find(([at]) => place <= at); return p ? p[1] : 0; };
/** the day's tourneys close (the day rolled over): each ladder you fought on paid by its place */
function payTourneys(b) {
  const out = { day: b.day };
  for (const m of MODES) {
    const T = tourneyOf(b, m); if (!T.in) { out[m] = null; continue; }
    const purse = purseFor(T.place); b.marks += purse; if (T.place === 1) b.champion = b.day;
    out[m] = { place: T.place, w: T.w, l: T.l, d: T.d, purse };
  }
  b.lastTourney = out;
}

// ── the rating: Glicko (one bout a period, the rival's own deviation fixed), tables of exp only (detmath) ─────────
const Q = 0.0057565, PI2 = 9.8696044;                                    // ln 10 / 400; π²
const gOf = (rd) => 1 / Math.sqrt(1 + (3 * Q * Q * rd * rd) / PI2);
/** the expected score of a rating against another (its deviation rd) */
export const expected = (r, rj, rdj) => 1 / (1 + exp(-gOf(rdj) * (r - rj) * Q));
/** the rating after one bout (s: 1 won, 0.5 drawn, 0 lost) @returns {{ r: number, rd: number }} */
export function rate(r, rd, rj, s, rdj = BOWL.rdRival) {
  const g = gOf(rdj), E = expected(r, rj, rdj), d2 = 1 / (Q * Q * g * g * E * (1 - E));
  const k = 1 / (1 / (rd * rd) + 1 / d2), nr = r + Q * k * g * (s - E);
  return { r: Math.round(nr * 10) / 10, rd: Math.max(BOWL.rdMin, Math.round(Math.sqrt(k) * 10) / 10) };
}

/** marks a bout pays: a win by the rival's grade, a loss or a draw one (every one of the day's ten: core.js counts it in at its start) @param {any} b @param {string} how @param {string} grade */
const marksFor = (b, how, grade) => (b.paid > BOWL.fights ? 0 : how === 'won' ? GRADES[grade].marks : how === 'draw' ? BOWL.draw : BOWL.loss);

/**
 * the bout's result settled (core.js, on battle.js's boutEnd): the ladder's rating and record, marks, the day's tourney
 * @param {any} state @param {{ mode: Mode, id: string, grade: string, rating: number, rd?: number }} on the bout as it was started
 * @param {{ how: string, why: string }} res @returns {any} what the result card shows
 */
export function settleBout(state, on, res) {
  const b = bowlOf(state), mode = modeOf(on.mode), L = b[mode], how = res.how === 'won' || res.how === 'draw' ? res.how : 'lost', s = how === 'won' ? 1 : how === 'draw' ? 0.5 : 0;
  const before = L.r, nr = rate(L.r, L.rd, on.rating, s, on.rd ?? BOWL.rdRival); L.r = nr.r; L.rd = nr.rd;
  if (how === 'won') { L.won++; L.tw++; } else if (how === 'draw') { L.drawn++; L.td++; } else { L.lost++; L.tl++; }
  L.tg = Math.round((L.tg + L.r - before) * 10) / 10;
  if (!L.fought.includes(on.id)) L.fought.push(on.id);
  const marks = marksFor(b, how, on.grade); b.marks += marks;
  const T = tourneyOf(b, mode);
  return { mode, id: on.id, how, why: res.why, marks, r: L.r, dr: Math.round((L.r - before) * 10) / 10, tier: tierOf(L.r).id, alone: mode === 'solo', place: T.place, of: T.of };
}

/** a saved ladder, cleaned @param {any} v */
function restoreLadder(v) {
  const o = freshLadder(); if (!v || typeof v !== 'object') return o;
  const num = (x, d, lo = -1e9, hi = 1e9) => (Number.isFinite(x) ? Math.max(lo, Math.min(hi, x)) : d);
  o.r = num(v.r, o.r, 100, 4000); o.rd = num(v.rd, o.rd, BOWL.rdMin, 350);
  for (const k of ['won', 'lost', 'drawn', 'tw', 'tl', 'td']) o[k] = Math.floor(num(v[k], 0, 0));
  o.tg = num(v.tg, 0, -4000, 4000);
  const ids = (a, n = 1e9) => (Array.isArray(a) ? a.filter((id) => ROSTER[id]).slice(0, n) : []);
  o.fought = ids(v.fought); o.picks = ids(v.picks, BOWL.picks); o.shown = ids(v.shown);
  return o;
}
/** a saved record, cleaned: numbers in range, ids kept only if they're the roster's. v46 and older (one ladder, the
 *  bracket tourney): its rating and record are the Team ladder's, Individual starts fresh, the day redrawn; a tourney left
 *  open is paid as it stood (its old purse by round reached) @param {any} v */
export function restoreBowl(v) {
  const o = freshBowl(); if (!v || typeof v !== 'object') return o;
  const num = (x, d, lo = -1e9, hi = 1e9) => (Number.isFinite(x) ? Math.max(lo, Math.min(hi, x)) : d);
  o.marks = Math.floor(num(v.marks, 0, 0)); o.paid = Math.floor(num(v.paid, 0, 0, BOWL.fights));
  o.day = Math.floor(num(v.day, -1)); o.champion = Math.floor(num(v.champion, -1));
  o.refresh = Math.floor(num(v.refresh, 0, 0, BOWL.refreshCost.length));
  if (v.team && typeof v.team === 'object') { o.team = restoreLadder(v.team); o.solo = restoreLadder(v.solo); }
  else {                                                     // (v46 and older)
    o.team = restoreLadder({ r: v.r, rd: v.rd, won: v.won, lost: v.lost, drawn: v.drawn });
    if (v.tourney && typeof v.tourney === 'object') o.marks += [3, 6, 10, 16][Math.floor(num(v.tourney.round, 0, 0, 3))];
    o.day = -1;                                              // (the day's boards drawn afresh at the next look)
  }
  if (v.lastTourney && typeof v.lastTourney === 'object' && 'team' in v.lastTourney) o.lastTourney = JSON.parse(JSON.stringify(v.lastTourney));
  return o;
}
