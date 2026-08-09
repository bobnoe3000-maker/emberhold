// gsprite.js — the Emberlit asset format. A G-sprite carries albedo + normal +
// emissive PER PIXEL, so the deferred lighting pass relights it like any other
// surface (unlike the flat pre-lit RGBA sprites of the Canvas2D path). Baked once
// at load; the renderer STAMPS them into the G-buffer window each frame.
//
//   sprite = { w, h, mask:Uint8(w*h), alb:Uint8(w*h*3), nrm:Uint8(w*h*3),
//              emi:Uint8(w*h), ax, ay }        ax/ay = ground anchor (foot center)
//
// normal encode: (n*0.5+0.5)*254 → shader decodes vec3(N.xy*2-1, max(N.z,.02)).
// emissive id: 0 none · 1 poison · 2 violet · 3 ember · 4 water → EGLOW rgb (HDR).

import { hash2, fbm, mulberry32 } from '../sim/rng.js';
import { ELIT, EGLOW } from './palette.js';

export const GLOW_ID = { 1: EGLOW.poison, 2: EGLOW.violet, 3: EGLOW.ember, 4: EGLOW.water, 5: EGLOW.lava, 6: EGLOW.soul };
const OUTLINE_RGB = [8, 5, 14];
const clampi = (v, a, b) => (v < a ? a : v > b ? b : v);
export function norm3(x, y, z) { const l = Math.hypot(x, y, z) || 1; return [x / l, y / l, z / l]; }

export function newSprite(w, h) {
  return { w, h, mask: new Uint8Array(w * h), alb: new Uint8Array(w * h * 3),
    nrm: new Uint8Array(w * h * 3), emi: new Uint8Array(w * h), ax: w >> 1, ay: h - 1 };
}
export function spSet(sp, x, y, c, n, e) {
  if (x < 0 || y < 0 || x >= sp.w || y >= sp.h) return;
  const i = y * sp.w + x; sp.mask[i] = 1;
  sp.alb[i * 3] = c[0]; sp.alb[i * 3 + 1] = c[1]; sp.alb[i * 3 + 2] = c[2];
  sp.nrm[i * 3] = (n[0] * 0.5 + 0.5) * 254; sp.nrm[i * 3 + 1] = (n[1] * 0.5 + 0.5) * 254; sp.nrm[i * 3 + 2] = n[2] * 254;
  sp.emi[i] = e || 0;
}
export function spOutline(sp) {
  const solid = (x, y) => x >= 0 && y >= 0 && x < sp.w && y < sp.h && sp.mask[y * sp.w + x];
  const add = [];
  for (let y = 0; y < sp.h; y++) for (let x = 0; x < sp.w; x++)
    if (!solid(x, y) && (solid(x + 1, y) || solid(x - 1, y) || solid(x, y + 1) || solid(x, y - 1))) add.push([x, y]);
  for (const [x, y] of add) spSet(sp, x, y, OUTLINE_RGB, [0, 0, 0.25], 0);
}

// ---- voxel bake with per-face normals (vox: 0 empty · 1 solid · 2 emissive) ----
function bakeVox(vox, SX, SY, SZ, ramp, emiId) {
  const V = (x, y, z) => (x < 0 || y < 0 || z < 0 || x >= SX || y >= SY || z >= SZ) ? 0 : vox[(z * SY + y) * SX + x];
  const w = SX + SY + 4, h = ((SX + SY) >> 1) + SZ + 4;
  const sp = newSprite(w, h), offX = SY + 1, offY = SZ + 1;
  const NT = norm3(0, 0.35, 0.93), NL = norm3(-0.75, 0.30, 0.55), NR = norm3(0.75, 0.30, 0.55);
  for (let s = 0; s <= SX + SY - 2; s++) for (let x = Math.max(0, s - SY + 1); x <= Math.min(SX - 1, s); x++) {
    const y = s - x;
    for (let z = 0; z < SZ; z++) {
      const m = V(x, y, z); if (!m) continue;
      const topE = !V(x, y, z + 1), leftE = !V(x, y + 1, z), rightE = !V(x + 1, y, z);
      if (!topE && !leftE && !rightE) continue;                 // enclosed
      const n = topE ? NT : leftE ? NL : NR;
      const nz = fbm(x * 0.5 + z * 0.3, y * 0.5, 4242);
      const idx = clampi(Math.floor(nz * 3 + (topE ? 2.2 : leftE ? 1.4 : 0.8)) - 1, 0, ramp.length - 1);
      const X = (x - y) + offX, Y = ((x + y) >> 1) - z + offY;
      for (let a = 0; a < 2; a++) for (let b = 0; b < 2; b++) spSet(sp, X + a, Y + b, ramp[idx], n, m === 2 ? emiId : 0);
    }
  }
  spOutline(sp);
  sp.ax = w >> 1; sp.ay = h - 3;                                // foot ≈ bottom of the diamond footprint
  return sp;
}
export function voxSpire(rng) {
  const S = 14, H = 26, vox = new Uint8Array(S * S * H), ph = rng() * 6.28;
  for (let z = 0; z < H; z++) {
    const r = 3.4 * (1 - z / H) + 1.1, cx = S / 2 + Math.sin(z * 0.38 + ph) * 2.2, cy = S / 2 + Math.cos(z * 0.31 + ph) * 2.2;
    for (let y = 0; y < S; y++) for (let x = 0; x < S; x++)
      if (Math.hypot(x - cx, y - cy) < r + fbm(x * 0.5, y * 0.5 + z, 77) * 1.4 - 0.7)
        vox[(z * S + y) * S + x] = (z > H - 4 && rng() < 0.3) ? 2 : 1;
  }
  return bakeVox(vox, S, S, H, ELIT.obsid, 2);
}
export function voxRibArch(rng) {
  const S = 16, H = 18, vox = new Uint8Array(S * S * H);
  for (let a = 0; a < 4; a++) { const yy = 2 + a * 4;
    for (let t = 0; t <= 1; t += 0.02) {
      const x = 1 + t * 13, z = Math.sin(t * Math.PI) * (13 - a * 0.8);
      for (let dz = -1; dz <= 1; dz++) for (let dx = -1; dx <= 1; dx++) {
        const X = Math.round(x + dx * 0.5), Zz = Math.round(z + dz * 0.5);
        if (X >= 0 && X < S && Zz >= 0 && Zz < H) vox[(Zz * S + yy) * S + X] = 1;
      } } }
  return bakeVox(vox, S, S, H, ELIT.bone, 1);
}
export function voxMonolith(rng) {
  const S = 10, H = 20, vox = new Uint8Array(S * S * H);
  for (let z = 0; z < H; z++) for (let y = 3; y < 6; y++) for (let x = 2; x < 7; x++) {
    if (z > 13 && fbm(x * 0.6, z * 0.6, (rng() * 99) | 0) > 0.55) continue;
    vox[(z * S + y) * S + x] = (x === 6 && z > 2 && z < 14 && hash2(x * 7, z * 3, 55) > 0.72) ? 2 : 1;
  }
  return bakeVox(vox, S, S, H, ELIT.obsid, 2);
}
export function voxEyeTotem(rng) {
  const S = 12, H = 16, vox = new Uint8Array(S * S * H), cx = S / 2, cy = S / 2;
  for (let z = 0; z < 7; z++) { const r = 2.8 - z * 0.15;
    for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) if (Math.hypot(x - cx, y - cy) < r) vox[(z * S + y) * S + x] = 1; }
  for (let z = 6; z < 14; z++) for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
    const dd = Math.hypot(x - cx, y - cy, (z - 10) * 1.1);
    if (dd < 3.6) vox[(z * S + y) * S + x] = dd < 1.6 ? 2 : 1;
  }
  return bakeVox(vox, S, S, H, ELIT.flesh, 1);
}

// ---- functional props (interactive / light-casting) ----------------------
// Descent gate: a standing ring with a glowing threshold — the way down.
export function voxPortal() {
  const S = 11, H = 16, vox = new Uint8Array(S * S * H), y = S >> 1;
  const cx = S / 2, cz = 8.5, rx = 3.6, rz = 6.2;
  for (let z = 0; z < H; z++) for (let x = 0; x < S; x++) {
    const d = Math.hypot((x - cx) / rx, (z - cz) / rz);
    if (d > 1.25) continue;
    vox[(z * S + y) * S + x] = d > 0.78 ? 1 : 2;         // frame : glowing gate
  }
  return bakeVox(vox, S, S, H, ELIT.obsid, 6);
}
// Loot chest: a low box with a glowing latch.
export function voxChest() {
  const SX = 7, SY = 5, SZ = 5, vox = new Uint8Array(SX * SY * SZ);
  for (let z = 0; z < SZ; z++) for (let y = 0; y < SY; y++) for (let x = 0; x < SX; x++) {
    if (z === SZ - 1 && (x === 0 || x === SX - 1)) continue;   // rounded lid
    vox[(z * SY + y) * SX + x] = (z === 2 && x === SX - 1 && y === (SY >> 1)) ? 2 : 1;
  }
  return bakeVox(vox, SX, SY, SZ, ELIT.bone, 3);
}
// Shrine: a pedestal under a floating orb.
export function voxShrine() {
  const S = 9, H = 16, vox = new Uint8Array(S * S * H), c = S / 2;
  for (let z = 0; z < 9; z++) { const r = 1.4 + (z < 7 ? (7 - z) * 0.16 : 0); for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) if (Math.hypot(x - c, y - c) < r) vox[(z * S + y) * S + x] = 1; }
  for (let z = 10; z < 15; z++) for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) if (Math.hypot(x - c, y - c, z - 12) < 2.4) vox[(z * S + y) * S + x] = 2;
  return bakeVox(vox, S, S, H, ELIT.basalt, 4);
}
// Brazier: a bowl of coals on a stem — a doorway light.
export function voxBrazier() {
  const S = 7, H = 12, vox = new Uint8Array(S * S * H), c = S / 2;
  for (let z = 0; z < 8; z++) for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) if (Math.abs(x - c) < 1.2 && Math.abs(y - c) < 1.2) vox[(z * S + y) * S + x] = 1;
  for (let z = 8; z < 11; z++) for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) { const d = Math.hypot(x - c, y - c); if (d < 2.6 && d > 1.3) vox[(z * S + y) * S + x] = 1; }
  for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) if (Math.hypot(x - c, y - c) < 1.8) vox[(10 * S + y) * S + x] = 2;
  return bakeVox(vox, S, S, H, ELIT.obsid, 3);
}

// ---- deterministic prop set, keyed by world seed (same variant per tile) ----
export function buildProps(seed) {
  return {
    spire: [0, 1, 2, 3].map((v) => voxSpire(mulberry32((seed * 13 + v * 97 + 1) >>> 0))),
    monolith: [0, 1, 2, 3].map((v) => voxMonolith(mulberry32((seed * 29 + v * 131 + 7) >>> 0))),
    totem: [voxEyeTotem(mulberry32((seed * 7 + 3) >>> 0))],
    stairs: [voxPortal()],
    chest: [voxChest()],
    shrine: [voxShrine()],
    brazier: [voxBrazier()],
  };
}
// Which prop kinds cast a point light, and the tint they cast.
export const PROP_LIGHT = { stairs: [0.7, 0.5, 1.7], shrine: [0.4, 0.9, 1.6], brazier: [1.7, 0.9, 0.35] };

// ---- billboard from an already-quantized character canvas (albedo) ----
// Normal is a soft vertical cylinder: pixels bow toward their row's horizontal
// center so the torch rakes a body shape onto the flat doll. Emissive: none.
export function spriteFromCanvasData(data, w, h, ax, ay) {
  const sp = newSprite(w, h); sp.ax = ax; sp.ay = ay;
  for (let y = 0; y < h; y++) {
    let lo = w, hi = -1;
    for (let x = 0; x < w; x++) if (data[(y * w + x) * 4 + 3] > 0) { if (x < lo) lo = x; if (x > hi) hi = x; }
    if (hi < lo) continue;
    const mid = (lo + hi) / 2, half = Math.max(1, (hi - lo) / 2);
    for (let x = lo; x <= hi; x++) {
      const i = (y * w + x) * 4; if (data[i + 3] === 0) continue;
      const nx = ((x - mid) / half) * 0.55;
      spSet(sp, x, y, [data[i], data[i + 1], data[i + 2]], norm3(nx, -0.28, 0.9), 0);
    }
  }
  return sp;
}

// ---- creature G-sprite from one frame of an RGBA sheet. Mask = opaque pixels;
// normal rounded from an inward-distance transform (§7 path b); albedo straight
// from the sheet (already quantized). Emissive: none (eyes are baked in). ----
export function spriteFromSheetFrame(data, sw, fx, fw, fh, ax, ay) {
  const sp = newSprite(fw, fh); sp.ax = ax; sp.ay = ay;
  const at = (x, y) => data[(y * sw + (fx + x)) * 4 + 3] > 0;
  const dist = new Float32Array(fw * fh);
  for (let y = 0; y < fh; y++) for (let x = 0; x < fw; x++) {
    if (!at(x, y)) continue;
    let d = 4;
    for (let r = 1; r <= 3; r++) {
      let edge = false;
      for (let dy = -r; dy <= r && !edge; dy++) for (let dx = -r; dx <= r && !edge; dx++) {
        const X = x + dx, Y = y + dy;
        if (X < 0 || Y < 0 || X >= fw || Y >= fh || !at(X, Y)) edge = true;
      }
      if (edge) { d = r; break; }
    }
    dist[y * fw + x] = d;
  }
  for (let y = 0; y < fh; y++) for (let x = 0; x < fw; x++) {
    if (!at(x, y)) continue;
    const i = (y * sw + (fx + x)) * 4;
    const gx = (x > 0 ? dist[y * fw + x - 1] : 0) - (x < fw - 1 ? dist[y * fw + x + 1] : 0);
    const gy = (y > 0 ? dist[(y - 1) * fw + x] : 0) - (y < fh - 1 ? dist[(y + 1) * fw + x] : 0);
    const zz = Math.min(1, dist[y * fw + x] / 3);
    spSet(sp, x, y, [data[i], data[i + 1], data[i + 2]], norm3(-gx * 0.5, 0.2 - gy * 0.5, 0.45 + zz * 0.5), 0);
  }
  return sp;
}
