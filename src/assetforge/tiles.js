// tiles.js — blob-47 autotiler. One generator for any terrain-over-terrain pair.
// Mask bits: 1=N 2=NE 4=E 8=SE 16=S 32=SW 64=W 128=NW (set = same terrain).

import { hash2 } from '../sim/rng.js';

export function canonical(m) {
  if (!((m & 1) && (m & 4)))  m &= ~2;
  if (!((m & 4) && (m & 16))) m &= ~8;
  if (!((m & 16) && (m & 64))) m &= ~32;
  if (!((m & 1) && (m & 64))) m &= ~128;
  return m;
}

function ditherPick(r, ramp) {
  return r < 0.10 ? ramp[0] : r < 0.78 ? ramp[1] : r < 0.95 ? ramp[2] : ramp[3];
}

// Draw one 16px blob tile at world tile (wx, wy) into ctx at pixel (ox, oy).
// World coords drive the dither hash so chunks never shimmer at seams.
export function drawBlobTile(ctx, ox, oy, wx, wy, mask, top, under, seed) {
  const m = canonical(mask);
  const g = [];
  for (let y = 0; y < 16; y++) {
    g[y] = [];
    for (let x = 0; x < 16; x++)
      g[y][x] = ditherPick(hash2(wx * 16 + x, wy * 16 + y, seed), top);
  }
  const uPick = (x, y) => ditherPick(hash2(wx * 16 + x, wy * 16 + y, seed + 99), under);
  const n = !(m & 1), e = !(m & 4), s = !(m & 16), w = !(m & 64);

  for (let x = 0; x < 16; x++) {
    if (n) { g[0][x] = uPick(x, 0); g[1][x] = uPick(x, 1); g[2][x] = top[3]; }
    if (s) { g[15][x] = uPick(x, 15); g[14][x] = uPick(x, 14); g[13][x] = top[3]; }
  }
  for (let y = 0; y < 16; y++) {
    if (w) { g[y][0] = uPick(0, y); g[y][1] = uPick(1, y); if (!((n && y <= 1) || (s && y >= 14))) g[y][2] = top[3]; }
    if (e) { g[y][15] = uPick(15, y); g[y][14] = uPick(14, y); if (!((n && y <= 1) || (s && y >= 14))) g[y][13] = top[3]; }
  }
  if (n && w) g[2][2] = uPick(2, 2);
  if (n && e) g[2][13] = uPick(13, 2);
  if (s && w) g[13][2] = uPick(2, 13);
  if (s && e) g[13][13] = uPick(13, 13);
  if (!(m & 128) && (m & 1) && (m & 64)) { g[0][0] = uPick(0, 0); g[0][1] = uPick(1, 0); g[1][0] = uPick(0, 1); g[1][1] = top[3]; }
  if (!(m & 2)   && (m & 1) && (m & 4))  { g[0][15] = uPick(15, 0); g[0][14] = uPick(14, 0); g[1][15] = uPick(15, 1); g[1][14] = top[3]; }
  if (!(m & 32)  && (m & 16) && (m & 64)) { g[15][0] = uPick(0, 15); g[14][0] = uPick(0, 14); g[15][1] = uPick(1, 15); g[14][1] = top[3]; }
  if (!(m & 8)   && (m & 16) && (m & 4))  { g[15][15] = uPick(15, 15); g[15][14] = uPick(14, 15); g[14][15] = uPick(15, 14); g[14][14] = top[3]; }

  for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) {
    ctx.fillStyle = g[y][x];
    ctx.fillRect(ox + x, oy + y, 1, 1);
  }
}

export function drawWaterTile(ctx, ox, oy, wx, wy, ramp, seed) {
  for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) {
    const r = hash2(wx * 16 + x, wy * 16 + y, seed + 500);
    let c = r < 0.86 ? ramp[1] : ramp[2];
    if (r > 0.978 && hash2(wx * 16 + x + 1, wy * 16 + y, seed + 500) > 0.85) c = ramp[0];
    ctx.fillStyle = c;
    ctx.fillRect(ox + x, oy + y, 1, 1);
  }
}
