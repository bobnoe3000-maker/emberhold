// props.js — procedural resource sprites. Seeded per world tile so every tree
// leans a little differently, forever.

import { hash2 } from '../sim/rng.js';
import { outlineBuffer } from './doll.js';

// Sprite sizes + ground anchors (the pixel that sits on the tile center).
// Trees stand ~1.3× the 24×36 character so they read as canopy overhead, not scrub.
export const TREE_W = 22, TREE_H = 46, TREE_AX = 11, TREE_AY = 45;
export const ROCK_W = 16, ROCK_H = 14, ROCK_AX = 8, ROCK_AY = 13;

// Draw into a transparent ctx of TREE_W x TREE_H. Anchor: trunk base at (11, 45).
export function drawTree(ctx, pal, wx, wy, seed) {
  ctx.clearRect(0, 0, TREE_W, TREE_H);
  const px = (x, y, c) => { if (x < 0 || x > TREE_W - 1) return; ctx.fillStyle = c; ctx.fillRect(x, y, 1, 1); };
  const h = (a, b) => hash2(wx * 31 + a, wy * 31 + b, seed + 4242);
  const lean = h(1, 1) < 0.5 ? 0 : (h(1, 1) < 0.75 ? -1 : 1);
  const C = pal.CANOPY, T = pal.TRUNK, cx = 11;

  // trunk (12 tall) + root flare
  for (let y = 32; y <= 44; y++) { px(cx - 1, y, T[0]); px(cx, y, T[1]); px(cx + 1, y, T[1]); }
  px(cx - 2, 43, T[1]); px(cx + 2, 43, T[1]);
  px(cx - 2, 44, T[1]); px(cx + 2, 44, T[1]);

  // canopy: a lens-profile blob (narrow top, widest ~⅓ down, tapering), dithered
  for (let y = 3; y <= 34; y++) {
    const t = (y - 3) / 31;
    const half = Math.round(10 * Math.sin(Math.PI * Math.min(1, t * 1.08)));
    if (half <= 0) continue;
    const lc = cx + Math.round(lean * t * 2);              // lean grows toward the crown
    for (let x = lc - half; x <= lc + half; x++) {
      const r = h(x, y);
      const edge = (x === lc - half || x === lc + half);
      if (edge && r < 0.4) continue;                        // ragged silhouette
      let c = r < 0.16 ? C[0] : r < 0.7 ? C[1] : C[2];
      if (y >= 22) c = r < 0.5 ? C[1] : C[2];               // underside darker
      px(x, y, c);
    }
  }
  // crown highlights + a rare ember mote
  px(cx - 3, 7, C[0]); px(cx + 2, 6, C[0]);
  if (h(3, 3) < 0.3) px(cx + 5, 17, pal.ACCENT2);
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
