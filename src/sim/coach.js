// @ts-check
// coach.js — the Guild's coach between the towns (docs/worldmap-travel-proposal.md; GDD §10 v1.43). The Lantern Guild
// keeps a tavern in every town and waystation, and a seat on its cart goes between them: to a town you've already
// walked to, in a land that's open, for 10 gold a day of road. (v1.142, the owner: "Fast travel via coach should work
// anywhere, just scale the gold cost based on how far from common points and distances".) It picks you up anywhere
// above ground: in a town for the road's fare alone, out on a land's overland for that and a gold for every ten tiles
// between you and the land's town gate (PICKUP_TILES), so the far corners cost more; out there it will also take you
// in to the land's own town. Never down a dungeon (the Homeward Scroll is the way out of one). It only moves you and costs gold,
// so a replay is the same with or without it (fair play: nothing is granted). The first visit to a town is always on
// foot, so a land's road and its trouble are never skipped.
//
// The towns you've reached are `state.reached` (core.js, saved since v28): a Set of COACH ids, added to whenever you
// stand in a town. ROADS is the coach's graph in days; a trip is the shortest path on it.

import { LANDS, landId } from './regions.js';

/** the coach's stops: each a land's town (regions.js LANDS[land].town), by id
 * @type {Record<string, { name: string, land: import('./regions.js').LandId }>} */
export const COACH = {
  thornwick: { name: 'Thornwick', land: 'vale' },
  saltmere: { name: 'Saltmere', land: 'fens' },
  ashgate: { name: 'Ashgate', land: 'reach' },     // (v1.124: the Cinder Reach, over the range by the Wickham road)
};
// the coach roads, [a, b, days] both ways. Each region's milestone adds its own (world-map proposal; the Lamphall is the
// hub: Thornwick 3, Ashgate 2, Brine Cross 2, Hollin Ford 1, the Frozen Hospice 2).
/** @type {Array<[string, string, number]>} */
export const ROADS = [['thornwick', 'saltmere', 1], ['thornwick', 'ashgate', 2]];
export const FARE_DAY = 10;                                // gold a day of road
export const PICKUP_TILES = 10;                            // out on a land: a gold for every this many tiles from its town gate

/** what the coach adds for coming to fetch you: nothing in a town; out on a land's overland the way from you to its
 * town gate (where the coach roads meet the land), a gold for every PICKUP_TILES tiles of it, at least one
 * @param {any} state @param {any} w the world you're in @returns {number} */
export function pickup(state, w) {
  if (!w || w.kind !== 'overland') return 0;
  const g = (w.exits || []).find((/** @type {any} */ e) => e.to === 'town'), a = w.arrivals && w.arrivals.default, p = state.player;
  const gx = g ? (g.x0 + g.x1) / 2 : a ? a.x : p.x, gy = g ? (g.y0 + g.y1) / 2 : a ? a.y : p.y, dx = p.x - gx, dy = p.y - gy;
  return Math.max(1, Math.round(Math.sqrt(dx * dx + dy * dy) / PICKUP_TILES));
}
/** a trip from where you stand: the town it counts from, the days of road, the fare (the road's and the pickup's), or
 * null when no coach goes there from here (in a dungeon, to the town you're in, no road) @param {any} state @param {any} w
 * @param {string} to @returns {{ from: string, days: number, fare: number, pickup: number } | null} */
export function trip(state, w, to) {
  if (!w || (w.kind !== 'town' && w.kind !== 'overland') || !COACH[to] || !LANDS[state.region]) return null;
  const from = townOf(state.region);
  if (w.kind === 'town' && from === to) return null;
  const n = days(from, to); if (n === null) return null;
  const up = pickup(state, w);
  return { from, days: n, fare: n * FARE_DAY + up, pickup: up };
}

/** the coach stop for a land's town @param {string} land @returns {string} */
export const townOf = (land) => { const L = LANDS[landId(land)]; return Object.keys(COACH).find((k) => COACH[k].name === L.town) || 'thornwick'; };

/** days on the coach between two stops: the shortest path over ROADS (integer days; relaxed in array order, so the
 * answer is the same on every engine), or null when no road joins them @param {string} a @param {string} b */
export function days(a, b) {
  if (!COACH[a] || !COACH[b]) return null;
  /** @type {Record<string, number>} */ const d = { [a]: 0 };
  for (let pass = 0, ch = true; ch && pass < ROADS.length + 1; pass++) {
    ch = false;
    for (const [x, y, n] of ROADS) for (const [u, v] of [[x, y], [y, x]]) if (d[u] !== undefined && (d[v] === undefined || d[u] + n < d[v])) { d[v] = d[u] + n; ch = true; }
  }
  return d[b] === undefined ? null : d[b];
}
/** @param {string} a @param {string} b */
export const fare = (a, b) => { const n = days(a, b); return n === null ? null : n * FARE_DAY; };

/** the towns a save has reached, from its snapshot: its own list (v28), else worked out (v27 and older; persist/save.js
 * reachedFor): Thornwick always, and Saltmere when the save is in the Fens or has been in a Fens site, since the
 * canal road passes its boardwalk @param {any} data @param {Record<string, any>} sites @returns {string[]} */
export function reachedOf(data, sites) {
  if (Array.isArray(data.reached)) return ['thornwick', ...data.reached.filter((k) => typeof k === 'string' && COACH[k] && k !== 'thornwick')];
  const out = ['thornwick'];
  const fens = data.region === 'fens' || (Array.isArray(data.sitesEntered) && data.sitesEntered.some((k) => sites[k] && sites[k].region === 'fens'));
  if (fens) out.push('saltmere');
  return out;
}

/**
 * The coach command. `{ type: 'coach', to }`: from anywhere in a town (not the one you're going to) or on a land's
 * overland, with nobody fighting, no raid or Ring under way and the hero standing, to a town reached in an open land,
 * for its fare (trip). Refusals say why ('refused'); nonsense is ignored. Goes: the fare off the gold, 'coach'
 * { from, to, days, fare }, then the trip (core.js travel).
 * @param {{ state: any, bus: any, getWorld: () => any, landOpen: (id: string) => boolean, inBattle: () => boolean,
 *   busy?: () => boolean, go: (land: string) => void }} ctx
 */
export function createCoach({ state, bus, getWorld, landOpen, inBattle, busy = () => false, go }) {
  /** @param {any} cmd */
  function command(cmd) {
    if (cmd.type !== 'coach') return false;
    const to = typeof cmd.to === 'string' && Object.prototype.hasOwnProperty.call(COACH, cmd.to) ? cmd.to : null, w = getWorld();
    if (!to || !LANDS[state.region]) return true;
    const refuse = (/** @type {string} */ reason) => { bus.emit('refused', { reason }); return true; };
    if (w.kind !== 'town' && w.kind !== 'overland') return refuse('Climb out first: the coach waits above ground');
    const from = townOf(state.region);
    if ((w.kind === 'town' && from === to) || inBattle() || busy() || state.party[0].down || state.party[0].fallen) return true;
    if (!landOpen(COACH[to].land)) return refuse('The road there is shut');
    if (!state.reached.has(to)) return refuse('You haven’t been there yet');
    const t = trip(state, w, to);
    if (!t) return refuse('No coach goes there');
    const n = t.days, f = t.fare;
    if ((state.counters.gold || 0) < f) return refuse(`The fare is ${f} gold`);
    state.counters.gold -= f;
    bus.emit('coach', { from, to, days: n, fare: f });
    bus.emit('countersChanged', { ...state.counters });
    go(COACH[to].land);
    return true;
  }
  return { command };
}
