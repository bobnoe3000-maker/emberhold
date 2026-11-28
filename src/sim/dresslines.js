// @ts-check
// dresslines.js — the no-lined-up rule (docs/level-design-rules.md §4.6; the owner, 2026-11-28, of the Gull Isles' gun
// deck: "dressing should have rules to not repeat and line up the same dressing"). A run is the same piece set down
// again and again along one straight line at one spacing: sixteen hammocks in two files, a cask rack every eight tiles,
// a lantern in every other bay of a seventy-tile wall. The eye reads it as a pattern stamped out, not a place someone
// furnished. This finds them. Pure, no imports: the sim's dressing (world.js props) and the renderer's set pieces
// (convert.js trims) are both held to it, by test/dresslines.test.mjs and tools/dungeon/dress-audit.mjs --lines.
//
// A run: MAX_RUN + 1 or more of one kind in a line (along x or along y, within TOL of it), each the same distance from
// the last (within SLACK of their mean), no farther apart than GAP. Pieces of other kinds between them don't break it
// (the eye skips them); a step wider than the others does.

/** the most of one kind a line may hold at one even spacing */
export const MAX_RUN = 3;
/** what's built, not set down: a place's architecture keeps its rhythm (a colonnade's pillars, a wall's piers and posts,
 * a gallery's shoring sets, the rails, a channel's run of tiles, the wall niches the stone was cut with). The renderer's
 * pieces by their trim's `k`, the sim's by their kind. */
export const BUILT = new Set(['pillar', 'pier', 'post', 'arcade', 'bpost', 'cpilaster', 'kbutt', 'shoring', 'shoringset',
  'bshore', 'shoring_broken', 'bars', 'rail', 'block', 'stairwell', 'channel', 'magma', 'sluice', 'lockgate', 'pile',
  'niche', 'bniche', 'urnshelf', 'menhir', 'obj:crag:pillar']);
/** the rows a place is made of (§4.2): pews down a nave, two blocks either side of its aisle */
export const ROWS = new Set(['pew']);
/** ground cover strewn by its tile's hash (a dune's marram), held to the foliage rules (§3.6), not these */
export const GROUND = new Set(['marram']);
/** in tiles (the sim's; the renderer's units are two tiles): how far off a line a piece may stand and still be on it;
 * how far an even spacing may wander; the widest step still read as one run (a lantern every other bay of a wall) */
export const TOL = 0.7, SLACK = 1.2, GAP = 24;

/**
 * Lined-up runs of one kind among points.
 * @param {{ kind: string, x: number, y: number }[]} pts
 * @param {{ max?: number, tol?: number, slack?: number, gap?: number, all?: boolean }} [o]   (all: the built and the rows too)
 * @returns {{ kind: string, axis: 'x' | 'y', at: number, n: number, step: number, from: number, to: number }[]}
 */
export function lineRuns(pts, o = {}) {
  const max = o.max ?? MAX_RUN, tol = o.tol ?? TOL, slack = o.slack ?? SLACK, gap = o.gap ?? GAP, all = !!o.all;
  /** @type {Map<string, { x: number, y: number }[]>} */
  const by = new Map();
  for (const p of pts) { if (!all && (BUILT.has(p.kind) || ROWS.has(p.kind) || GROUND.has(p.kind))) continue; const l = by.get(p.kind); if (l) l.push(p); else by.set(p.kind, [p]); }
  const out = [];
  for (const [kind, ps] of by) {
    if (ps.length <= max) continue;
    for (const axis of /** @type {const} */ (['x', 'y'])) {
      const across = axis === 'x' ? 'y' : 'x';
      // lines: the pieces grouped by where they stand across the axis (a line within tol of its first)
      const sorted = ps.slice().sort((a, b) => a[across] - b[across] || a[axis] - b[axis]);
      /** @type {{ x: number, y: number }[][]} */
      const lines = [];
      for (const p of sorted) { const l = lines[lines.length - 1]; if (l && Math.abs(p[across] - l[0][across]) <= tol) l.push(p); else lines.push([p]); }
      for (const l of lines) {
        if (l.length <= max) continue;
        const t = l.map((p) => p[axis]).sort((a, b) => a - b);
        // walk the line: a run grows while each step is within slack of the run's first step and no wider than gap
        for (let i = 0; i < t.length - 1;) {
          const step = t[i + 1] - t[i];
          if (step < 2 || step > gap) { i++; continue; }
          let j = i + 1;
          while (j + 1 < t.length && Math.abs(t[j + 1] - t[j] - step) <= slack) j++;
          const n = j - i + 1;
          if (n > max) out.push({ kind, axis, at: Math.round(l[0][across] * 100) / 100, n, step: Math.round(((t[j] - t[i]) / (n - 1)) * 100) / 100, from: t[i], to: t[j] });
          i = j;
        }
      }
    }
  }
  return out;
}
