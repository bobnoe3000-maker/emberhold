// @ts-check
// hazards.js — the ground hazard (GDD §17 v1.36, M8.6): ground you can walk, at a cost. One rule for every kind: a
// party member standing in one moves at HAZARD.slow and recovers from a blow at HAZARD.recover, and the party's AI
// steps out to the nearest open ground before anything else: always out of a patch (it's short, and the foe follows);
// into the flood only to reach what it's fighting, fighting there where it stands. Foes walk through it. Two shapes, kept on the battle (runtime: a hazard lasts the fight):
//   - a patch: { kind, x, y, r, until } (until: the sim's clock), e.g. the Toadking's mud;
//   - a hall's flooded edge: battle.flood = N, every floor tile of the hall within N × battle.floodStep of its walls
//     (battle.edge, the tiles' distances to the walls, worked out once a fight), e.g. the Abbess Below's water.
// Deterministic: arrays and a fixed table of directions (detmath), no draws.
import { hypot, sin, cos } from './detmath.js';

export const HAZARD = { slow: 0.5, recover: 0.7 };
const DIRS = Array.from({ length: 16 }, (_, i) => [cos((i * Math.PI) / 8), sin((i * Math.PI) / 8)]);
const RINGS = [1.2, 1.9, 2.6, 3.4, 4.3, 5.4];

/** each of a hall's floor tiles' distance to its walls (1 = against one, 8-way), once a fight @param {[number, number][]} cells */
export function edgeDistances(cells) {
  const inRoom = new Set(cells.map(([x, y]) => x + ',' + y)), dist = new Map(), q = [];
  for (const [x, y] of cells) {
    let edge = false;
    for (let dy = -1; dy <= 1 && !edge; dy++) for (let dx = -1; dx <= 1; dx++) if ((dx || dy) && !inRoom.has((x + dx) + ',' + (y + dy))) { edge = true; break; }
    if (edge) { dist.set(x + ',' + y, 1); q.push([x, y]); }
  }
  for (let h = 0; h < q.length; h++) {
    const [x, y] = q[h], d = dist.get(x + ',' + y);
    for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
      const k = (x + dx) + ',' + (y + dy); if (!inRoom.has(k) || dist.has(k)) continue;
      dist.set(k, d + 1); q.push([x + dx, y + dy]);
    }
  }
  return dist;
}
/** the hazard at (x, y) on a battle, or null @param {any} b @param {number} x @param {number} y @returns {string | null} */
export function hazardAt(b, x, y) {
  if (!b) return null;
  if (b.hazards) for (const h of b.hazards) if (hypot(x - h.x, y - h.y) < h.r) return h.kind;
  if (b.flood > 0 && b.edge) { const d = b.edge.get(Math.floor(x) + ',' + Math.floor(y)); if (d !== undefined && d <= b.flood * (b.floodStep || 1)) return 'water'; }
  return null;
}
/** the nearest open ground to (x, y): the smallest ring of 16 directions with a spot that's walkable (`ok`) and out of
 * every hazard, the one nearest (px, py) there (where the fight is) @returns {[number, number] | null} */
export function openGround(b, x, y, px, py, ok) {
  for (const r of RINGS) {
    let best = null, bd = 1e9;
    for (const [dx, dy] of DIRS) {
      const gx = x + dx * r, gy = y + dy * r;
      if (!ok(gx, gy) || hazardAt(b, gx, gy)) continue;
      const d = hypot(gx - px, gy - py); if (d < bd) { bd = d; best = [gx, gy]; }
    }
    if (best) return best;
  }
  return null;
}
/** drop the patches that have run out @param {any} b @param {number} t the sim's clock */
export function ageHazards(b, t) { if (b && b.hazards && b.hazards.length && b.hazards.some((h) => h.until <= t)) b.hazards = b.hazards.filter((h) => h.until > t); }
