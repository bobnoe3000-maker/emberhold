// @ts-check
// stars.js — a dungeon's stars (GDD §10 v1.143; the owner, 2026-11-23: "Lets also track dungeon completion.. one star
// completed, two stars if under a reasonable time and 3 stars if completed quickly including the boss without dying.
// Show stars in the map next to the dungeons"). A record, never a reward: it pays nothing and grants nothing, so a
// replay is the same with or without it (fair play), and it is all sim time and sim events (deterministic).
//
// A run: from walking in at a site's door (core.js travel, a fresh visit, floor 1) to its end without leaving: the last
// floor's boss down, or for a secret its vault opened, or for a site with no boss its end room's chest opened. Leaving
// any other way (stepping out, a scroll, the coach, a wipe to the temple) ends the run unfinished. The stairs between
// floors keep it going. A run on a raid doesn't count (raid.js keeps its own), nor the Mere Tower (it has no end), nor
// the Bowl.
//   ★    the end reached;
//   ★★   in no more than the site's reasonable time (PAR[site][1] minutes of play);
//   ★★★  in no more than its quick time (PAR[site][0]), and nobody in the company went down on the way.
// The record keeps each site's best: the most stars, the fastest time and whether that was clean
// (`state.stars[site] = { n, best, clean, runs }`, saved since v57). The run under way is `state.starRun` ({ site, t0,
// downs }, saved too, so a reload mid-dungeon keeps it).

import { SITES } from './sites.js';

/** each site's [quick, reasonable] minutes. From tools/balance/pace.mjs (the right company at each floor's level, played
 * as a player plays it, from a new slot with every gate shut; 3 seeds, 2026-11-23): quick is the median walk-through
 * rounded up, reasonable half as long again (the median × 1.5, rounded up). A first walk-through, gates and all, makes two stars at a steady pace;
 * three wants the gates already down (a second visit) or a sharp first one. Sites with no end (the Mere Tower, the
 * Bowl) have no row and no stars. @type {Record<string, [number, number]>} */
export const PAR = {
  barrows: [9, 14], wickham_keep: [12, 18], sunken_chapel: [14, 20],   // (medians 8.8, 11.6, 13.2 min; the Proving Pens are a trial: no stars)
  toadking_mound: [14, 20], canal_locks: [14, 21], drowned_abbey: [15, 22],   // (13.2, 13.5, 14.5)
  cold_seam: [14, 21], assay_yards: [15, 23], cinderworks: [16, 23],   // (14.0, 15.0, 15.3: re-measured for v1.144's Reach in three, two levels a floor)
  // one floor, no boss, and the secrets: pace.mjs walked to their end as the stars do (v1.146: the end room's chest, or the
  // vault), 3 seeds: medians 3.9, 5.0 (the inn, once its cellar hall had its chest), 6.6, 3.9, 7.5 min
  haddow_crypt: [4, 6], shuttered_inn: [5, 8],
  ninth_milestone: [7, 10], reedholm_undercroft: [4, 6], ninth_vault: [8, 12],
};

/** the stars a finished run earns @param {string} site @param {number} secs @param {number} downs @returns {number} */
export function starsFor(site, secs, downs) {
  const p = PAR[site]; if (!p) return 0;
  if (secs <= p[0] * 60 && downs === 0) return 3;
  return secs <= p[1] * 60 ? 2 : 1;
}

/** what ends a run at a site: its last floor's boss, or (no boss there) its vault for a secret, or the chest in its
 * last floor's end room @param {string} site @returns {{ boss: string | null, secret: boolean }} */
export function endOf(site) {
  const S = SITES[site]; if (!S) return { boss: null, secret: false };
  const b = S.bosses && S.bosses[String(S.floors)];
  return { boss: b || null, secret: !!S.secret };
}

/**
 * The stars' bookkeeping, wired to the sim's events by core.js. `begin(site)` on every fresh visit (or `null` for any
 * other scene); the rest comes off the bus.
 * @param {{ state: any, bus: any, site: () => string, depth: () => number, counts: () => boolean, endRoom: (tx: number, ty: number) => boolean }} ctx
 */
export function createStars({ state, bus, site, depth, counts, endRoom }) {
  /** @param {string | null} s */
  function begin(s) { state.starRun = s && PAR[s] ? { site: s, t0: state.t, downs: 0 } : null; }
  function finish() {
    const r = state.starRun; if (!r || r.site !== site() || !counts()) return;
    const secs = Math.round(state.t - r.t0), n = starsFor(r.site, secs, r.downs), prev = state.stars[r.site] || null;
    const rec = prev ? { ...prev } : { n: 0, best: null, clean: false, runs: 0 };
    rec.runs += 1;
    if (n > rec.n) rec.n = n;
    if (rec.best === null || secs < rec.best) { rec.best = secs; rec.clean = r.downs === 0; }
    state.stars[r.site] = rec; state.starRun = null;
    bus.emit('dungeonStars', { site: r.site, n, secs, downs: r.downs, best: rec.best, record: rec.n, was: prev ? prev.n : 0 });
  }
  bus.on('combat', (/** @type {any} */ e) => { if (e.t === 'down' && !e.rival && state.starRun && counts()) state.starRun.downs += 1; });
  bus.on('bossDown', (/** @type {any} */ e) => {
    const r = state.starRun; if (!r || e.raid || e.tower) return;
    const end = endOf(r.site), S = SITES[r.site];
    if (end.boss && e.id === end.boss && depth() === S.floors - 1) finish();
  });
  bus.on('secretSealed', (/** @type {any} */ e) => { const r = state.starRun; if (r && e.site === r.site && !endOf(r.site).boss) finish(); });
  bus.on('looted', (/** @type {any} */ e) => {
    const r = state.starRun; if (!r || e.kind !== 'chest') return;
    const end = endOf(r.site); if (end.boss || end.secret) return;
    if (depth() === SITES[r.site].floors - 1 && endRoom(e.tx, e.ty)) finish();
  });
  return { begin };
}

/** a save's stars, read back: known sites only, n 0..3, a finite best or null @param {any} data */
export function starsOf(data) {
  /** @type {Record<string, { n: number, best: number | null, clean: boolean, runs: number }>} */ const out = {};
  for (const [k, v] of Object.entries((data && data.stars) || {})) {
    if (!PAR[k] || !v || typeof v !== 'object') continue;
    const n = Math.max(0, Math.min(3, Math.floor(+v.n || 0)));
    out[k] = { n, best: Number.isFinite(v.best) ? +v.best : null, clean: !!v.clean, runs: Math.max(0, Math.floor(+v.runs || 0)) };
  }
  return out;
}
/** the run under way, read back @param {any} data */
export function starRunOf(data) {
  const r = data && data.starRun;
  return r && typeof r === 'object' && PAR[r.site] && Number.isFinite(r.t0) ? { site: r.site, t0: +r.t0, downs: Math.max(0, Math.floor(+r.downs || 0)) } : null;
}
