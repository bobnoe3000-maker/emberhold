// @ts-check
// road.js — the barrows road (world doc §3.1 v1.9, *The road*): why the Vale fights its dead, on the
// map. The Third Legion stands across the barrows road in ranks, facing north, the way the relief
// would have come, and a stopped wagon lies tipped on the verge. Walkers get through (the dead stand
// a pace apart: solid figures with gaps), wagons don't.
//
// The ranks are derived, never saved: each goes when its part of the legion is put down (RANKS, from
// quest states and bosses, which the save already keeps). With the last one gone the road is open
// and the wagon's gone with them. Events: 'roadNear' { ranks } once a visit to the Vale, when you come
// within NEAR tiles of the line while it holds; 'roadThinned' { ranks } when a rank goes (0: open).

import { hypot } from './detmath.js';
import { oBlock, oPut } from './outdoor.js';

// who stands in each rank (front, nearest the crossroads, first) and what relieves it
/** @type {{ id: string, gone: { quest?: string, boss?: string }, kinds: string[] }[]} */
export const RANKS = [
  { id: 'front', gone: { quest: 'vale_long_way_round' }, kinds: ['minion', 'minion', 'minion', 'minion'] },   // the walking kind (Maudry's errand)
  { id: 'officers', gone: { quest: 'vale_captains_ledger' }, kinds: ['warrior', 'rogue', 'rogue', 'warrior'] },   // the bright-eyed ones (Osric's bounty)
  { id: 'standard', gone: { boss: 'standard' }, kinds: ['warrior', 'mage', 'standard', 'warrior'] },           // around the Standard (the barrows' third-floor hall)
];
// The line on the overland's barrows road (outdoor.js: the stretch from (132, 186) to (129, 199), past
// the lumber camp's turn and before the chapel's): a rank every 5 tiles, four abreast, 3 tiles apart (closer, they melt into one crowd on screen).
const LINE = { x0: 132, y0: 186, x1: 129, y1: 199 }, RANK_Y = [186, 191, 196], ABREAST = [-4.5, -1.5, 1.5, 4.5];
const WAGON = { id: 'wagon_0', x: 128.5, y: 181 };   // tipped on the west verge, north of the line
export const NEAR = 12;
const lineX = (y) => LINE.x0 + ((LINE.x1 - LINE.x0) * (y - LINE.y0)) / (LINE.y1 - LINE.y0);
// where the road's centre crosses row y, nearest the line (critic pass 10: the roads are filleted now, so the stretch
// bends into the turn below it; the ranks stand on the road as it's drawn) @param {any} world @param {number} y
const xAt = (world, y) => {
  const L = lineX(y); let best = L, bd = 4;
  for (const r of world.roads || []) for (let i = 0; i + 1 < r.pts.length; i++) {
    const [ax, ay] = r.pts[i], [bx, by] = r.pts[i + 1]; if ((ay - y) * (by - y) > 0 || ay === by) continue;
    const x = ax + ((bx - ax) * (y - ay)) / (by - ay); if (Math.abs(x - L) < bd) { bd = Math.abs(x - L); best = x; }
  }
  return best;
};

/** is this rank still on the road? @param {any} state @param {typeof RANKS[number]} r */
const holds = (state, r) => (r.gone.quest ? !(state.quests && state.quests[r.gone.quest] && state.quests[r.gone.quest].st === 3) : !(state.bosses || {})[r.gone.boss || '']);
/** the ranks still standing, front first @param {any} state */
export const ranksHeld = (state) => RANKS.filter((r) => holds(state, r));

/** put the line (and its wagon) on the Vale's overland as the state has it: world.pickets, solid
 * tiles, world.road = { x, y, ranks } @param {any} world @param {any} state */
export function placeRoad(world, state) {
  world.pickets = [];
  if (world.kind !== 'overland' || !state) return world;
  const held = ranksHeld(state);
  world.road = { x: xAt(world, 191) + 0.5, y: 191.5, ranks: held.length };
  if (!held.length) return world;
  oPut(world, WAGON.id, WAGON.x, WAGON.y, 'rect', 0.2);
  RANKS.forEach((r, i) => {
    if (!holds(state, r)) return;
    const y = RANK_Y[i], xc = xAt(world, y);
    r.kinds.forEach((kind, k) => {
      const x = Math.floor(xc + ABREAST[k]) + 0.5, py = y + 0.5;
      world.pickets.push({ x, y: py, kind, rank: r.id });
      oBlock(world, x, py);
    });
  });
  return world;
}

/** @param {{ state: any, bus: any, getWorld: () => any }} o */
export function createRoad({ state, bus, getWorld }) {
  let near = false, last = ranksHeld(state).length;   // runtime: told this visit · the ranks last counted
  const recount = () => { const n = ranksHeld(state).length; if (last >= 0 && n < last) bus.emit('roadThinned', { ranks: n }); last = n; };
  bus.on('questChanged', recount);
  bus.on('bossDown', recount);
  bus.on('levelChanged', (e) => { if ('scene' in e) near = false; last = ranksHeld(state).length; });   // a new scene (or a load): tell again, count afresh
  function tick() {
    const w = getWorld(), r = w.road; if (!r || !r.ranks || near) return;
    const p = state.player; if (hypot(p.x - r.x, p.y - r.y) < NEAR) { near = true; bus.emit('roadNear', { ranks: r.ranks }); }
  }
  return { tick, held: () => ranksHeld(state).length };
}
