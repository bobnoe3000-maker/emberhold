// voxprops.js — voxel-to-sprite bake + Dreadforge prop builders (TDD §7.1).
// A Uint8Array volume (0 empty, 1 solid, 2 emissive) → a shaded, outlined sprite
// canvas + a glow-pixel list. Browser-only (creates canvases); ported from the
// verified Dreadforge mockup. bakes are load-time; never call per frame.

import { mulberry32, hash2, fbm } from '../sim/rng.js';
import { DREAD, DGLOW } from '../render/palette.js';

const OUTLINE = [8, 5, 14];
const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);

// vox indexed [(z*SY + y)*SX + x]. Projection stamps each voxel as a 2×2 block.
export function bakeVoxels(vox, SX, SY, SZ, ramp, rng, emissive) {
  const pxOf = (vx, vy) => vx - vy, pyOf = (vx, vy, vz) => ((vx + vy) >> 1) - vz;
  let minx = 1e9, maxx = -1e9, miny = 1e9, maxy = -1e9;
  for (let vz = 0; vz < SZ; vz++) for (let vy = 0; vy < SY; vy++) for (let vx = 0; vx < SX; vx++) {
    if (!vox[(vz * SY + vy) * SX + vx]) continue;
    const p = pxOf(vx, vy), q = pyOf(vx, vy, vz);
    minx = Math.min(minx, p); maxx = Math.max(maxx, p + 2); miny = Math.min(miny, q); maxy = Math.max(maxy, q + 2);
  }
  if (minx > maxx) return { cv: document.createElement('canvas'), ax: 0, ay: 0, glow: [] };
  const W = maxx - minx + 2, H = maxy - miny + 2, offX = -minx + 1, offY = -miny + 1;
  const cv = document.createElement('canvas'); cv.width = W; cv.height = H;
  const g = cv.getContext('2d');
  const solid = (x, y, z) => x >= 0 && y >= 0 && z >= 0 && x < SX && y < SY && z < SZ && vox[(z * SY + y) * SX + x];
  const glow = [], order = [];
  for (let vz = 0; vz < SZ; vz++) for (let vy = 0; vy < SY; vy++) for (let vx = 0; vx < SX; vx++) if (vox[(vz * SY + vy) * SX + vx]) order.push([vx, vy, vz]);
  order.sort((a, b) => (a[0] + a[1]) - (b[0] + b[1]));
  for (const [vx, vy, vz] of order) {
    const val = vox[(vz * SY + vy) * SX + vx];
    const px = pxOf(vx, vy) + offX, py = pyOf(vx, vy, vz) + offY;
    if (val === 2) { g.fillStyle = `rgb(${emissive[0]},${emissive[1]},${emissive[2]})`; g.fillRect(px, py, 2, 2); glow.push([px, py, emissive, rng() * 6]); glow.push([px + 1, py + 1, emissive, rng() * 6]); continue; }
    let b;
    if (!solid(vx, vy, vz + 1)) b = 1.0; else if (!solid(vx, vy + 1, vz)) b = 0.72; else if (!solid(vx + 1, vy, vz)) b = 0.5; else continue;   // enclosed
    b *= 0.8 + 0.2 * (vz / SZ); b *= 0.9 + 0.2 * hash2(vx, vy * 7 + vz, 3);
    let idx = clamp(Math.floor((fbm(vx * 0.4, vy * 0.4 + vz * 0.3, 7, 2) * 0.6 + 0.2 + (b - 0.6)) * ramp.length), 0, ramp.length - 1);
    let c = ramp[idx];
    if (b >= 1.0) c = [Math.min(255, c[0] + 18), Math.min(255, c[1] + 14), c[2]];    // top-face lit pop
    g.fillStyle = `rgb(${c[0] | 0},${c[1] | 0},${c[2] | 0})`; g.fillRect(px, py, 2, 2);
  }
  // 1px universal outline
  const id = g.getImageData(0, 0, W, H), d = id.data;
  const A = (x, y) => x >= 0 && y >= 0 && x < W && y < H && d[(y * W + x) * 4 + 3] > 0;
  const marks = [];
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (d[(y * W + x) * 4 + 3] === 0 && (A(x - 1, y) || A(x + 1, y) || A(x, y - 1) || A(x, y + 1))) marks.push([x, y]);
  g.fillStyle = `rgb(${OUTLINE[0]},${OUTLINE[1]},${OUTLINE[2]})`; for (const [x, y] of marks) g.fillRect(x, y, 1, 1);
  return { cv, ax: offX, ay: H - 1, glow };
}

// obsidian spire — shrinking noise-carved discs whose center drifts (the twist)
export function buildSpire(seed) {
  const rng = mulberry32(seed >>> 0), SX = 13, SY = 13, SZ = 26, vox = new Uint8Array(SX * SY * SZ);
  const set = (x, y, z, v) => { if (x >= 0 && y >= 0 && z >= 0 && x < SX && y < SY && z < SZ) vox[(z * SY + y) * SX + x] = v; };
  for (let z = 0; z < SZ; z++) {
    const t = z / SZ, rad = (1 - t) * 5 + 1.2, cx = 6 + Math.sin(z * 0.5) * 2.2 * t, cy = 6 + Math.cos(z * 0.42) * 2.2 * t;
    for (let y = 0; y < SY; y++) for (let x = 0; x < SX; x++) if (Math.hypot(x - cx, y - cy) < rad - hash2(x, y + z, 9) * 0.9) set(x, y, z, (z > SZ - 5 && rng() < 0.3) ? 2 : 1);
  }
  return bakeVoxels(vox, SX, SY, SZ, DREAD.obsid, rng, DGLOW.violet);
}

// broken obsidian monolith with emissive rune pits on the SE face
export function buildMonolith(seed) {
  const rng = mulberry32(seed >>> 0), SX = 6, SY = 4, SZ = 21, vox = new Uint8Array(SX * SY * SZ);
  const set = (x, y, z, v) => { vox[(z * SY + y) * SX + x] = v; };
  for (let z = 0; z < SZ; z++) for (let y = 0; y < SY; y++) for (let x = 0; x < SX; x++) {
    if (z > 13 && hash2(x, y + z, 4) < 0.35) continue;                       // broken crown
    set(x, y, z, (x === SX - 1 && z < 14 && z > 2 && hash2(x * 3, z, 6) > 0.72) ? 2 : 1);
  }
  return bakeVoxels(vox, SX, SY, SZ, DREAD.obsid, rng, DGLOW.poison);
}

// flesh pedestal under an emissive orb — the corruption heart's eye totem
export function buildEyeTotem(seed) {
  const rng = mulberry32(seed >>> 0), SX = 9, SY = 9, SZ = 17, vox = new Uint8Array(SX * SY * SZ);
  const set = (x, y, z, v) => { if (x >= 0 && y >= 0 && z >= 0 && x < SX && y < SY && z < SZ) vox[(z * SY + y) * SX + x] = v; };
  for (let z = 0; z < 10; z++) { const rad = 1.4 + (z < 8 ? (8 - z) * 0.18 : 0); for (let y = 0; y < SY; y++) for (let x = 0; x < SX; x++) if (Math.hypot(x - 4, y - 4) < rad) set(x, y, z, 1); }
  const cz = 13, cr = 3.6;
  for (let z = 10; z < SZ; z++) for (let y = 0; y < SY; y++) for (let x = 0; x < SX; x++) { const d = Math.hypot(x - 4, y - 4, z - cz); if (d < cr) set(x, y, z, Math.hypot(x - 4, y - 4, z - cz) < 1.4 ? 2 : 1); }
  return bakeVoxels(vox, SX, SY, SZ, DREAD.flesh, rng, DGLOW.poison);
}
