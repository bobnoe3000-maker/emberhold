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

import { mulberry32, streamSeed } from './rng.js';
import { exp } from './detmath.js';
import { DAY_S } from './heroes.js';
import { GRADES, GRADE_IDS, ROSTER, ROSTER_IDS } from './rivals.js';

export const BOWL = {
  minLevel: 6, picks: 5, refreshes: 3, fights: 10, loss: 1, draw: 1,  // five to choose from, three new draws, ten bouts a day (all paid); a loss or a draw pays 1
  start: 1200, rd0: 250, rdMin: 60, rdRival: 80, near: 15, band: 60, // the rating (Glicko): where everyone starts, how sure; picks from the 15 nearest; within 60 is "even"
  spread: 80, field: 8, purse: [3, 6, 10, 16],                        // a team's talent either side of its grade; the tourney's field; its purse by round reached
  preseason: 20, drawP: 0.04,                                         // the league's days before the first (so day 0's ratings mean something); a draw's chance
  seed: 0xb0e1b0e1,                                                   // (the league's draws: the same for everyone)
};
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

/** a fresh record @returns {any} */
export const freshBowl = () => ({ r: BOWL.start, rd: BOWL.rd0, won: 0, lost: 0, drawn: 0, marks: 0, day: -1, fought: [], paid: 0, picks: [], shown: [], refresh: 0, tday: -1, tourney: null, champion: -1 });
/** the record as of today (sim only: it rolls the day over, and draws the day's first five) @param {any} state */
export function bowlOf(state) {
  if (!state.bowl) state.bowl = freshBowl();
  const b = state.bowl, d = dayOf(state);
  if (b.day !== d) { b.day = d; b.fought = []; b.paid = 0; b.refresh = 0; b.shown = []; b.picks = drawPicks(b, d); }   // a new day: five new faces, ten bouts again
  if (b.tourney && b.tourney.day !== d) settleTourney(state, null);   // yesterday's tourney closes as it stood
  return b;
}

const idHash = (s) => { let h = 0x811c9dc5; for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 0x01000193); return h >>> 0; };

// ── the hundred: each team's own strength, and the league they play every day ────────────────────────────────────
/** @type {Map<string, { id: string, manner: string, grade: string, strength: number }>} */
const TEAMS = new Map();
/** a team as it is for good: its grade (how it's built, rivals.js), and its strength in the league (its grade's
 *  rating, its manner's edge and a talent of its own), hidden: what its rating finds out */
export function teamOf(id) {
  let t = TEAMS.get(id); if (t) return t;
  const r = mulberry32(streamSeed(BOWL.seed, idHash(id)));
  let n = r() * GRADE_IDS.reduce((a, g) => a + GRADE_W[g], 0), grade = GRADE_IDS[0];
  for (const g of GRADE_IDS) { n -= GRADE_W[g]; if (n < 0) { grade = g; break; } }
  const manner = ROSTER[id][0];
  t = { id, manner, grade, strength: GRADES[grade].rating + (MANNER_EDGE[manner] || 0) + (r() * 2 - 1) * BOWL.spread };
  TEAMS.set(id, t); return t;
}
/**
 * The league (the owner, 2026-11-13: "The game simulates similar rules for ai opponents. Lets assume 100 teams for now"):
 * every team fights BOWL.fights bouts a day, each against a team near its rating (the hundred ordered by rating with a
 * draw of jitter, paired off: what picking from the five nearest comes to), the result drawn on the two strengths'
 * expected score, a few drawn, and both ratings moved as the player's is. Its days run from BOWL.preseason before the
 * first, so day 0's ratings already tell the teams apart. The same for every player and every replay; the player's own
 * bouts don't move it (a shared league, as the server's will be). Kept as each day's start, built on as days are asked.
 * @type {{ r: Float64Array, rd: Float64Array, w: Int32Array, l: Int32Array, d: Int32Array }[]}
 */
const DAYS = [];
function leagueDay(day) {
  const N = ROSTER_IDS.length, k = Math.max(0, Math.floor(day) + BOWL.preseason);
  if (!DAYS.length) DAYS.push({ r: new Float64Array(N).fill(BOWL.start), rd: new Float64Array(N).fill(BOWL.rd0), w: new Int32Array(N), l: new Int32Array(N), d: new Int32Array(N) });
  const S = ROSTER_IDS.map((id) => teamOf(id).strength), order = ROSTER_IDS.map((_, i) => i), jit = new Float64Array(N);
  while (DAYS.length <= k) {
    const p = DAYS[DAYS.length - 1], q = { r: p.r.slice(), rd: p.rd.slice(), w: p.w.slice(), l: p.l.slice(), d: p.d.slice() };
    const rng = mulberry32(streamSeed((BOWL.seed ^ Math.imul(DAYS.length, 0x2545f491)) >>> 0, 0x1ea9));
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
    DAYS.push(q);
  }
  return DAYS[k];
}
/** a team on a day (its league standing at the day's start) @returns {{ id: string, manner: string, grade: string, rating: number, rd: number, rank: number, won: number, lost: number, drawn: number }} */
export function companyOn(id, day) {
  const L = leagueDay(day), i = ROSTER_IDS.indexOf(id), t = teamOf(id), r = L.r[i];
  let rank = 1; for (let j = 0; j < L.r.length; j++) if (L.r[j] > r || (L.r[j] === r && j < i)) rank++;
  return { id, manner: t.manner, grade: t.grade, rating: Math.round(r), rd: Math.round(L.rd[i]), rank, won: L.w[i], lost: L.l[i], drawn: L.d[i] };
}
/** the hundred on a day, best first */
export const fieldOn = (day) => ROSTER_IDS.map((id) => companyOn(id, day)).sort((a, b) => a.rank - b.rank);

/** five to choose from: the BOWL.near nearest your rating today that haven't been on the board today, five of them
 *  drawn (its own draw a refresh), easiest first; they're added to the day's shown @param {any} b the record @param {number} d the day @returns {string[]} */
function drawPicks(b, d) {
  const not = new Set([...(b.fought || []), ...(b.picks || []), ...(b.shown || [])]);
  const near = fieldOn(d).filter((c) => !not.has(c.id)).sort((x, y) => Math.abs(x.rating - b.r) - Math.abs(y.rating - b.r) || x.rank - y.rank).slice(0, BOWL.near);
  const rng = mulberry32(streamSeed((BOWL.seed ^ Math.imul(d + 1, 0x9e3779b1)) >>> 0, 0x91c + (b.refresh || 0)));
  for (let i = near.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [near[i], near[j]] = [near[j], near[i]]; }
  const five = near.slice(0, BOWL.picks).sort((x, y) => x.rating - y.rating || x.rank - y.rank).map((c) => c.id);
  b.shown = [...(b.shown || []), ...five];
  return five;
}
/** a new five (sim only: the `bowlRefresh` command): three a day @param {any} state @returns {boolean} */
export function refreshPicks(state) {
  const b = bowlOf(state); if (b.refresh >= BOWL.refreshes) return false;
  b.refresh++; b.picks = drawPicks(b, b.day); return true;
}
/** the board as it stands (read only: the UI's): the five still to fight today, each as the league has it today, and
 *  whether it's an easier, an even or a harder bout by your rating
 *  @param {any} state @returns {any[]} */
export function picksOf(state) {
  const b = state.bowl, d = dayOf(state); if (!b || b.day !== d) return [];
  return (b.picks || []).map((id) => { const c = companyOn(id, d); return { ...c, pick: c.rating < b.r - BOWL.band ? 'easier' : c.rating > b.r + BOWL.band ? 'harder' : 'even' }; });
}
/** your place among the hundred today (the rank you'd hold) @param {any} state */
export function rankOf(state) { const r = (state.bowl || freshBowl()).r, L = leagueDay(dayOf(state)); let n = 1; for (const x of L.r) if (x > r) n++; return n; }

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
 * the bout's result settled (core.js, on battle.js's boutEnd): rating, marks, the day's tally; a tourney's round on
 * @param {any} state @param {{ kind: 'ladder' | 'tourney', id: string, grade: string, rating: number, rd?: number, alone?: boolean }} on the bout as it was started
 * @param {{ how: string, why: string }} res @returns {any} what the result card shows
 */
export function settleBout(state, on, res) {
  const b = bowlOf(state), how = res.how === 'won' || res.how === 'draw' ? res.how : 'lost', s = how === 'won' ? 1 : how === 'draw' ? 0.5 : 0;
  const before = b.r, nr = rate(b.r, b.rd, on.rating, s, on.rd ?? BOWL.rdRival); b.r = nr.r; b.rd = nr.rd;
  if (how === 'won') b.won++; else if (how === 'draw') b.drawn++; else b.lost++;
  let marks = 0;
  if (on.kind === 'ladder') { marks = marksFor(b, how, on.grade); if (!b.fought.includes(on.id)) b.fought.push(on.id); }
  const out = { kind: on.kind, id: on.id, how, why: res.why, marks, r: b.r, dr: Math.round((b.r - before) * 10) / 10, tier: tierOf(b.r).id, alone: !!on.alone, round: 0, purse: 0, champion: false };
  if (on.kind === 'tourney' && b.tourney) {
    const T = b.tourney; out.round = T.round;
    if (how === 'won') { advance(T); if (T.round >= 3) { out.champion = true; out.purse = settleTourney(state, 'champion'); } }
    else out.purse = settleTourney(state, 'out');
  }
  b.marks += marks;
  return out;
}

// ── the tourney: eight companies, single elimination, three rounds, a day's ───────────────────────────────────────
/** the bracket's pairings by seed (1 v 8, 4 v 5, 2 v 7, 3 v 6): the favourite meets the outsider first */
const SEEDING = [0, 7, 3, 4, 1, 6, 2, 5];
/** enter today's tourney: you and the seven companies nearest your rating, the company you field locked
 *  @param {any} state @param {string[]} company the member ids entered @returns {any} the tourney, or null if not today */
export function enterTourney(state, company) {
  const b = bowlOf(state), d = dayOf(state);
  if (b.tday === d || b.tourney) return null;
  const field = fieldOn(d).sort((x, y) => Math.abs(x.rating - b.r) - Math.abs(y.rating - b.r) || (x.id < y.id ? -1 : 1)).slice(0, BOWL.field - 1);
  const all = [...field, { id: 'you', rating: b.r }].sort((x, y) => y.rating - x.rating || (x.id < y.id ? -1 : 1));
  b.tday = d;
  b.tourney = { day: d, round: 0, company: [...company], slots: SEEDING.map((k) => all[k].id), ratings: Object.fromEntries(all.map((c) => [c.id, Math.round(c.rating)])), done: false };
  return b.tourney;
}
/** the company you meet in the tourney's round now, or null when you're out */
export function tourneyFoe(T) {
  if (!T || T.done) return null;
  const i = T.slots.indexOf('you'); if (i < 0) return null;
  return T.slots[i ^ 1] || null;
}
/** you won your bout: every other pairing of the round is decided by the ratings, on a draw of its own (the bouts you
 *  don't fight aren't fought for now: watching one waits), and the field halves */
function advance(T) {
  const r = mulberry32(streamSeed((BOWL.seed ^ Math.imul(T.day + 1, 0x27d4eb2d)) >>> 0, 0x70 + T.round)), next = [];
  for (let i = 0; i < T.slots.length; i += 2) {
    const a = T.slots[i], c = T.slots[i + 1];
    if (a === 'you' || c === 'you') { next.push('you'); continue; }
    const pa = expected(T.ratings[a], T.ratings[c], BOWL.rdRival);
    next.push(r() < pa ? a : c);
  }
  (T.past ||= []).push([...T.slots]);
  T.slots = next; T.round++;
}
/** the tourney closes: its purse for the round reached (Quarter-final 3 … Champion 16), banner for a champion; 'out' or
 *  'champion', or null for one left unfinished at the day's end (paid as it stood) @returns {number} the purse */
function settleTourney(state, how) {
  const b = state.bowl, T = b.tourney; if (!T) return 0;
  const purse = BOWL.purse[Math.min(3, how === 'champion' ? 3 : T.round)];
  b.marks += purse; if (how === 'champion') b.champion = T.day;
  T.done = true; T.how = how || 'closed'; T.purse = purse;
  b.tourney = null; b.lastTourney = { day: T.day, round: T.round, how: T.how, purse };
  return purse;
}

/** a saved record, cleaned: numbers in range, ids kept only if they're the roster's (or 'you') @param {any} v */
export function restoreBowl(v) {
  const o = freshBowl(); if (!v || typeof v !== 'object') return o;
  const num = (x, d, lo = -1e9, hi = 1e9) => (Number.isFinite(x) ? Math.max(lo, Math.min(hi, x)) : d);
  o.r = num(v.r, o.r, 100, 4000); o.rd = num(v.rd, o.rd, BOWL.rdMin, 350);
  for (const k of ['won', 'lost', 'drawn', 'marks', 'paid']) o[k] = Math.floor(num(v[k], 0, 0));
  o.day = Math.floor(num(v.day, -1)); o.tday = Math.floor(num(v.tday, -1)); o.champion = Math.floor(num(v.champion, -1));
  o.fought = Array.isArray(v.fought) ? v.fought.filter((id) => ROSTER[id]) : [];
  o.picks = Array.isArray(v.picks) ? v.picks.filter((id) => ROSTER[id]).slice(0, BOWL.picks) : [];   // (v45 and older: none, so the day's are drawn at the next look)
  o.shown = Array.isArray(v.shown) ? v.shown.filter((id) => ROSTER[id]) : [];
  o.refresh = Math.floor(num(v.refresh, 0, 0, BOWL.refreshes));
  if (!Array.isArray(v.picks)) o.day = -1;
  const T = v.tourney;
  if (T && Array.isArray(T.slots) && T.slots.every((id) => id === 'you' || ROSTER[id]) && Array.isArray(T.company) && T.ratings && typeof T.ratings === 'object')
    o.tourney = { day: Math.floor(num(T.day, -1)), round: Math.floor(num(T.round, 0, 0, 3)), company: T.company.filter((x) => typeof x === 'string'), slots: [...T.slots], ratings: { ...T.ratings }, done: false, past: Array.isArray(T.past) ? T.past : [] };
  if (v.lastTourney && typeof v.lastTourney === 'object') o.lastTourney = { ...v.lastTourney };
  return o;
}
