// props.js — procedural resource sprites. Seeded per world tile so every tree
// leans a little differently, forever.

import { hash2 } from '../sim/rng.js';
import { outlineBuffer } from './doll.js';

export const TREE_W = 16, TREE_H = 26;   // canopy overhangs the tile above
export const ROCK_W = 16, ROCK_H = 14;

// Draw into a transparent ctx of TREE_W x TREE_H. Anchor: trunk base at (8, 25).
export function drawTree(ctx, pal, wx, wy, seed) {
  ctx.clearRect(0, 0, TREE_W, TREE_H);
  const px = (x, y, c) => { ctx.fillStyle = c; ctx.fillRect(x, y, 1, 1); };
  const h = (a, b) => hash2(wx * 31 + a, wy * 31 + b, seed + 4242);
  const lean = h(1, 1) < 0.5 ? 0 : (h(1, 1) < 0.75 ? -1 : 1);
  const C = pal.CANOPY, T = pal.TRUNK;

  // trunk
  for (let y = 17; y <= 25; y++) { px(7 + lean, y, T[0]); px(8 + lean, y, T[1]); }
  px(6 + lean, 24, T[1]); px(9 + lean, 24, T[1]);          // root flare

  // canopy: stacked ellipse rows, widest mid, dithered three shades
  const rows = [
    [6, 3], [4, 5], [3, 7], [2, 7], [2, 7], [3, 7], [4, 6], [5, 4], [7, 2],
  ];
  rows.forEach(([x0, halfW], i) => {
    const y = 3 + i;
    const cx0 = 8 + lean * ((i / rows.length) | 0);
    for (let x = cx0 - halfW - (8 - x0 - halfW); x <= cx0 + halfW; x++) {
      const xx = x;
      if (xx < 0 || xx > 15) continue;
      const r = h(xx, y);
      let c = r < 0.16 ? C[0] : r < 0.72 ? C[1] : C[2];
      if (y >= 9) c = r < 0.5 ? C[1] : C[2];               // underside darker
      px(xx, y, c);
    }
  });
  // crown highlight + hanging tips
  px(6, 2, C[0]); px(9, 2, C[0]);
  px(4, 12, C[2]); px(11, 12, C[2]);
  if (h(3, 3) < 0.35) px(12, 8, pal.ACCENT2);              // rare ember mote
  outlineBuffer(ctx, TREE_W, TREE_H);
}

// Anchor: base at (8, 13).
export function drawRock(ctx, pal, wx, wy, seed) {
  ctx.clearRect(0, 0, ROCK_W, ROCK_H);
  const px = (x, y, c) => { ctx.fillStyle = c; ctx.fillRect(x, y, 1, 1); };
  const h = (a, b) => hash2(wx * 37 + a, wy * 37 + b, seed + 5252);
  const R = pal.ROCK;
  const lumps = [
    { cx: 7, cy: 9, rw: 5, rh: 4 },
    { cx: 11, cy: 10, rw: 3, rh: 3 },
    { cx: 4, cy: 11, rw: 3, rh: 2 },
  ];
  if (h(9, 9) < 0.4) lumps.pop();
  for (const L of lumps) {
    for (let y = L.cy - L.rh; y <= L.cy + L.rh; y++) for (let x = L.cx - L.rw; x <= L.cx + L.rw; x++) {
      if (x < 0 || x > 15 || y < 0 || y > 13) continue;
      const dx = (x - L.cx) / L.rw, dy = (y - L.cy) / L.rh;
      if (dx * dx + dy * dy > 1) continue;
      const r = h(x, y);
      let c = r < 0.6 ? R[1] : R[2];
      if (y < L.cy - L.rh / 2 && x < L.cx) c = r < 0.7 ? R[0] : R[1];   // top-left light
      if (y > L.cy + L.rh / 2) c = R[3];                                 // ground shadow
      px(x, y, c);
    }
  }
  px(6, 8, R[0]); px(10, 9, R[3]);                          // facet accents
  outlineBuffer(ctx, ROCK_W, ROCK_H);
}
