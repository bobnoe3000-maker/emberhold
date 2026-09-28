// path.js — tile pathfinding for tap-to-move (GDD §3.1). Pure and deterministic.
//
// A* over tile centres, 8-way with no corner cutting (a diagonal needs both orthogonal
// neighbours open), octile heuristic, a node budget so a tap across a whole region can't
// stall a tick. `passable(x, y, fromX, fromY)` is the caller's walk test (it knows about
// climb limits and actor radius). If the goal tile itself can't be stood on (a wall, a
// chest, a tree), the path ends at the nearest reachable tile within `near` of it.

const SQ2 = Math.SQRT2, OFF = 4096;
const key = (x, y) => (x + OFF) * 8192 + (y + OFF);

export function findPath(sx, sy, gx, gy, passable, { near = 0, maxNodes = 60000 } = {}) {
  sx = Math.floor(sx); sy = Math.floor(sy); gx = Math.floor(gx); gy = Math.floor(gy);
  const h = (x, y) => { const dx = Math.abs(x - gx), dy = Math.abs(y - gy); return Math.max(dx, dy) + (SQ2 - 1) * Math.min(dx, dy); };
  const done = (x, y) => (near > 0 ? Math.max(Math.abs(x - gx), Math.abs(y - gy)) <= near : x === gx && y === gy);
  // binary min-heap of [f, g, x, y]
  const heap = [], push = (n) => { heap.push(n); let i = heap.length - 1; while (i > 0) { const p = (i - 1) >> 1; if (heap[p][0] <= n[0]) break; heap[i] = heap[p]; i = p; } heap[i] = n; };
  const pop = () => {
    const top = heap[0], last = heap.pop();
    if (heap.length) {
      heap[0] = last;
      for (let i = 0; ;) {
        const l = 2 * i + 1, r = l + 1; let m = i;
        if (l < heap.length && heap[l][0] < heap[m][0]) m = l;
        if (r < heap.length && heap[r][0] < heap[m][0]) m = r;
        if (m === i) break;
        const t = heap[i]; heap[i] = heap[m]; heap[m] = t; i = m;
      }
    }
    return top;
  };
  const g = new Map(), from = new Map();
  g.set(key(sx, sy), 0); push([h(sx, sy), 0, sx, sy]);
  let best = null, bestH = Infinity, n = 0;
  while (heap.length && n++ < maxNodes) {
    const [, cg, x, y] = pop(), k = key(x, y);
    if (cg > g.get(k)) continue;
    const hh = h(x, y); if (hh < bestH) { bestH = hh; best = [x, y]; }
    if (done(x, y)) { best = [x, y]; bestH = 0; break; }
    for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
      if (!dx && !dy) continue;
      const nx = x + dx, ny = y + dy;
      if (!passable(nx, ny, x, y)) continue;
      if (dx && dy && (!passable(x + dx, y, x, y) || !passable(x, y + dy, x, y))) continue;
      const ng = cg + (dx && dy ? SQ2 : 1), nk = key(nx, ny);
      if (ng >= (g.get(nk) ?? Infinity)) continue;
      g.set(nk, ng); from.set(nk, k); push([ng + h(nx, ny), ng, nx, ny]);
    }
  }
  if (!best || (bestH > 0 && !(near > 0 && bestH <= near + 1.5))) return null;   // unreachable: don't wander off toward it
  const out = []; let k = key(best[0], best[1]);
  while (k !== undefined) { const x = Math.floor(k / 8192) - OFF, y = (k % 8192) - OFF; out.push([x + 0.5, y + 0.5]); k = from.get(k); }
  return out.reverse();
}
