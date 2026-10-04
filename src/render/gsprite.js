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

export const GLOW_ID = { 1: EGLOW.poison, 2: EGLOW.violet, 3: EGLOW.ember, 4: EGLOW.water, 5: EGLOW.lava, 6: EGLOW.soul, 7: EGLOW.frost, 8: EGLOW.aqua, 9: EGLOW.window, 10: EGLOW.marsh };
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

// ---- voxel bake with per-face normals (vox: 0 empty · 1 solid · 2 emissive · 3 trim, in ramp2) ----
function bakeVox(vox, SX, SY, SZ, ramp, emiId, ramp2 = ramp) {
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
      const r = m === 3 ? ramp2 : ramp, idx = clampi(Math.floor(nz * 3 + (topE ? 2.2 : leftE ? 1.4 : 0.8)) - 1, 0, r.length - 1);
      const X = (x - y) + offX, Y = ((x + y) >> 1) - z + offY;
      for (let a = 0; a < 2; a++) for (let b = 0; b < 2; b++) spSet(sp, X + a, Y + b, r[idx], n, m === 2 ? emiId : 0);
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
// Loot chest: an oak box under a barrel lid, two iron bands, and a glowing lock on the long side
// that faces the camera (+y). Sized to read at a glance beside a hero: the old 7×5×5 bone box sat
// at ankle height and passed for a rock; at 13×9×10 it still read as small furniture, so it's drawn
// at CHEST_K× (2026-10-01: a find should look like one). Once opened it stays where it was, lid thrown
// back, hollow and dark (voxChestOpen): you can see a room's chest has been had.
const CHEST_K = 2;
function chestVox(open) {
  const SX = 13, SY = 9, SZ = open ? 14 : 10, vox = new Uint8Array(SX * SY * SZ), BODY = 6, cy = (SY - 1) / 2;
  for (let z = 0; z < SZ; z++) for (let y = 0; y < SY; y++) for (let x = 0; x < SX; x++) {
    let m = 0;
    if (!open) {
      const lid = z >= BODY, off = Math.abs(y - cy);
      if (lid && off > (SZ - 1 - z) * 1.6 + 1.2) continue;              // the barrel lid's curve
      const band = x === 2 || x === SX - 3 || z === BODY - 1 || (!lid && z === 0);   // iron straps, lid rim, foot
      const lock = y === SY - 1 && x >= 5 && x <= 7 && z >= BODY - 3 && z <= BODY - 1;   // the hasp, across the rim
      m = lock ? 2 : band ? 3 : 1;
    } else if (z < BODY) {                                              // the box: walls and a floor, nothing in it
      const wall = x === 0 || x === SX - 1 || y === 0 || y === SY - 1 || z === 0;
      if (!wall) continue;
      m = x === 2 || x === SX - 3 || z === BODY - 1 || z === 0 ? 3 : 1;
    } else if (y <= 1 && z < BODY + 8) {                                // the lid, thrown back against the far side
      m = x === 2 || x === SX - 3 || z === BODY + 7 ? 3 : 1;
    }
    if (m) vox[(z * SY + y) * SX + x] = m;
  }
  // up to CHEST_K×: each voxel a K×K×K block, the same chest twice the size
  const K = CHEST_K, X = SX * K, Y = SY * K, Z = SZ * K, big = new Uint8Array(X * Y * Z);
  for (let z = 0; z < Z; z++) for (let y = 0; y < Y; y++) for (let x = 0; x < X; x++) big[(z * Y + y) * X + x] = vox[(((z / K) | 0) * SY + ((y / K) | 0)) * SX + ((x / K) | 0)];
  return bakeVox(big, X, Y, Z, ELIT.wood, 3, ELIT.stone);
}
export const voxChest = () => chestVox(false);
export const voxChestOpen = () => chestVox(true);
// Shrine (GDD §3.6): a stepped plinth, a pillar and a cradle holding a big aqua orb, the light that mends
// the company once. The old 9×9×16 basalt pedestal stood at ankle height against the dark floor and read
// as a speck of violet (2026-10-01); at 19×19×36, banded in bone, it stands as tall as a hero.
// A used shrine stays where it was, its orb gone to dark stone (voxShrineSpent), so you can see it's spent.
function shrineVox(spent) {
  const S = 19, H = 36, vox = new Uint8Array(S * S * H), c = (S - 1) / 2;
  const put = (x, y, z, m) => { if (x >= 0 && y >= 0 && z >= 0 && x < S && y < S && z < H) vox[(z * S + y) * S + x] = m; };
  for (let z = 0; z < H; z++) for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
    const ax = Math.abs(x - c), ay = Math.abs(y - c), r = Math.hypot(x - c, y - c);
    if (z < 2 && ax <= 9 && ay <= 9) put(x, y, z, z === 1 && (ax === 9 || ay === 9) ? 3 : 1);          // the broad step
    else if (z >= 2 && z < 5 && ax <= 6 && ay <= 6) put(x, y, z, z === 4 && (ax === 6 || ay === 6) ? 3 : 1);   // the second step
    else if (z >= 5 && z < 18 && ax <= 2 && ay <= 2) put(x, y, z, z === 5 || z === 17 || z === 11 ? 3 : 1);   // the pillar, banded
    else if (z >= 18 && z < 21 && r <= 4.6 && (z === 18 || r >= 3.2)) put(x, y, z, 3);                 // the cradle's rim
  }
  for (let z = 19; z < H; z++) for (let y = 0; y < S; y++) for (let x = 0; x < S; x++)
    if (Math.hypot(x - c, y - c, (z - 27) * 1.05) < 5.6) put(x, y, z, spent ? 1 : 2);                 // the orb
  return bakeVox(vox, S, S, H, ELIT.stone, 8, ELIT.bone);
}
export const voxShrine = () => shrineVox(false);
export const voxShrineSpent = () => shrineVox(true);
// A Cult harvester's lantern-cage, dropped where it fell (M8, sim lamps.js): six iron bars on a ring under a hood, the
// caught soul a violet light inside. Broken: two bars gone, the hood knocked askew, nothing inside.
function cageVox(open) {
  const S = 15, H = 23, vox = new Uint8Array(S * S * H), c = (S - 1) / 2, R = 5.3;   // (critic pass: at 11 × 17 it stood knee-high and read as a speck)
  const put = (x, y, z, m) => { if (x >= 0 && y >= 0 && z >= 0 && x < S && y < S && z < H) vox[(z * S + y) * S + x] = m; };
  for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) { const r = Math.hypot(x - c, y - c); if (r <= R + 0.9 && r >= R - 1) { put(x, y, 0, 1); put(x, y, 1, 1); } }   // the floor ring
  for (let k = 0; k < 6; k++) {
    if (open && (k === 1 || k === 4)) continue;
    const a = (k / 6) * Math.PI * 2, bx = Math.round(c + Math.cos(a) * R), by = Math.round(c + Math.sin(a) * R);
    for (let z = 2; z < 16; z++) put(bx, by, z, 1);
  }
  for (let z = 16; z < 20; z++) for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) { const r = Math.hypot(x - c - (open ? 1 : 0), y - c); if (r <= R + 0.9 - (z - 16) * 1.6) put(x, y, z - (open ? 1 : 0), 3); }   // the hood
  if (!open) for (let z = 3; z < 15; z++) for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) if (Math.hypot(x - c, y - c, (z - 9) * 1.1) < 3.2) put(x, y, z, 2);   // the soul
  return bakeVox(vox, S, S, H, ELIT.obsid, 6, ELIT.basalt);
}
export const voxCage = () => cageVox(false);
export const voxCageOpen = () => cageVox(true);
// A gibbet: an empty iron cage hung from a timber post's arm, taller than the walls (a standing obstacle out on a
// room's floor, sim world.js; the owner, 2026-10-04). Nothing inside, no light: the Cult took what it held.
export function voxGibbet() {
  const S = 13, H = 40, vox = new Uint8Array(S * S * H);
  const put = (x, y, z, m) => { if (x >= 0 && y >= 0 && z >= 0 && x < S && y < S && z < H) vox[(z * S + y) * S + x] = m; };
  for (let z = 0; z < 3; z++) for (let y = 4; y <= 9; y++) for (let x = 0; x <= 5; x++) put(x, y, z, 3);       // the footing
  for (let z = 3; z < 39; z++) for (let y = 6; y <= 7; y++) for (let x = 2; x <= 3; x++) put(x, y, z, 1);      // the post
  for (let z = 36; z < 38; z++) for (let x = 2; x <= 11; x++) for (let y = 6; y <= 7; y++) put(x, y, z, 1);    // the arm
  for (let z = 31; z < 36; z++) put(9, 6, z, 3);                                                               // the chain
  const c = 9, cy = 6.5, R = 2.8;
  for (let z = 14; z < 31; z++) for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
    const r = Math.hypot(x - c, y - cy), ring = z === 14 || z === 15 || z === 22 || z >= 29;
    if (r <= R + 0.6 && r >= R - 0.6 && (ring || (x + y) % 2 === 0)) put(x, y, z, 3);                          // bars and hoops
    if (z === 14 && r < R) put(x, y, z, 3);                                                                     // the floor plate
  }
  return bakeVox(vox, S, S, H, ELIT.wood, 0, ELIT.obsid);
}
// Brazier: a bowl of coals on a stem — a doorway light.
export function voxBrazier() {
  const S = 7, H = 12, vox = new Uint8Array(S * S * H), c = S / 2;
  for (let z = 0; z < 8; z++) for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) if (Math.abs(x - c) < 1.2 && Math.abs(y - c) < 1.2) vox[(z * S + y) * S + x] = 1;
  for (let z = 8; z < 11; z++) for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) { const d = Math.hypot(x - c, y - c); if (d < 2.6 && d > 1.3) vox[(z * S + y) * S + x] = 1; }
  for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) if (Math.hypot(x - c, y - c) < 1.8) vox[(10 * S + y) * S + x] = 2;
  return bakeVox(vox, S, S, H, ELIT.obsid, 3);
}

// ---- room furniture (critic pass 2: rooms were identical cobble fields) -----
// Dressed-stone pillar: plinth, square shaft, capital; broken ones end in a jagged stump
// with fallen drums at the foot.
export function voxPillar(rng, broken = false) {
  const S = 10, H = broken ? 18 : 34, vox = new Uint8Array(S * S * H), top = broken ? 9 + ((rng() * 6) | 0) : H;
  for (let z = 0; z < H; z++) for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
    const plinth = z < 3, cap = !broken && z >= H - 3, r = plinth || cap ? 4.5 : 2.7;
    if (Math.abs(x - 4.5) > r || Math.abs(y - 4.5) > r) continue;
    if (broken && z >= top - 2 && hash2(x * 3 + z, y * 5, 91) < (z - top + 3) * 0.33) continue;
    if (broken && z >= top) continue;
    vox[(z * S + y) * S + x] = 1;
  }
  if (broken) for (const [bx, by] of [[1, 7], [7, 1]]) for (let z = 0; z < 2; z++) for (let y = by - 1; y <= by; y++) for (let x = bx - 1; x <= bx + 1; x++) if (x >= 0 && y >= 0 && x < S && y < S) vox[(z * S + y) * S + x] = 1;
  return bakeVox(vox, S, S, H, ELIT.stone, 0);
}
// Sarcophagus: a long stone box on a step, the lid carved with a recumbent effigy.
export function voxSarcophagus() {
  const SX = 7, SY = 13, SZ = 7, vox = new Uint8Array(SX * SY * SZ);
  for (let z = 0; z < SZ; z++) for (let y = 0; y < SY; y++) for (let x = 0; x < SX; x++) {
    const step = z === 0, box = z >= 1 && z <= 4 && x >= 1 && x <= 5 && y >= 1 && y <= 11, lid = z === 5 && x >= 1 && x <= 5 && y >= 1 && y <= 11;
    const effigy = z === 6 && x >= 2 && x <= 4 && y >= 2 && y <= 10 && !(y === 3 && x !== 3);
    if (step || box || lid || effigy) vox[(z * SY + y) * SX + x] = 1;
  }
  return bakeVox(vox, SX, SY, SZ, ELIT.stone, 0);
}
// Bone pile: a low heap of long bones with a skull or two.
export function voxBones(rng) {
  const S = 10, H = 5, vox = new Uint8Array(S * S * H), c = S / 2;
  for (let z = 0; z < H; z++) for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
    const d = Math.hypot(x - c, y - c) + z * 1.2;
    if (d < 4.2 && hash2(x * 7 + z * 13, y * 11, 17 + ((rng() * 3) | 0)) > 0.35) vox[(z * S + y) * S + x] = 1;
  }
  for (const [sx, sy, sz] of [[c + 1, c, 3], [c - 2, c + 1, 2]]) for (let z = sz; z < sz + 2; z++) for (let y = sy; y < sy + 2; y++) for (let x = sx; x < sx + 2; x++) vox[(z * S + y) * S + x] = 1;
  return bakeVox(vox, S, S, H, ELIT.bone, 0);
}

// ---- the living's furniture (M5: the Redhand's mill and keep, the Sunken Chapel) ----
// Crate stack: one or two plank crates with dark edge battens (trim), sometimes a smaller one on top.
export function voxCrates(rng) {
  const S = 11, H = 12, vox = new Uint8Array(S * S * H), two = rng() < 0.6;
  const box = (x0, y0, z0, n) => { for (let z = z0; z < z0 + n; z++) for (let y = y0; y < y0 + n; y++) for (let x = x0; x < x0 + n; x++) {
    const ex = (x === x0 || x === x0 + n - 1) + (y === y0 || y === y0 + n - 1) + (z === z0 || z === z0 + n - 1);
    vox[(z * S + y) * S + x] = ex >= 2 ? 3 : 1; } };
  box(1, 1, 0, 7); if (two) box(3, 3, 7, 5);
  return bakeVox(vox, S, S, H, ELIT.wood, 0, ELIT.obsid);
}
// Barrels: two or three bellied staves-and-hoops barrels, standing together.
export function voxBarrels(rng) {
  const S = 12, H = 9, vox = new Uint8Array(S * S * H), n = 2 + (rng() < 0.5 ? 1 : 0);
  for (const [cx, cy] of [[3.5, 3.5], [8, 4], [5, 8.5]].slice(0, n)) for (let z = 0; z < 8; z++) {
    const r = 2.4 + Math.sin((z / 7) * Math.PI) * 0.6, hoop = z === 1 || z === 6;
    for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) if (Math.hypot(x - cx, y - cy) < r) vox[(z * S + y) * S + x] = hoop ? 3 : 1;
  }
  return bakeVox(vox, S, S, H, ELIT.wood, 0, ELIT.obsid);
}
// Grain sacks: a slumped heap of tied sacks (the tithe).
export function voxSacks(rng) {
  const S = 12, H = 7, vox = new Uint8Array(S * S * H);
  for (const [cx, cy, cz] of [[4, 4, 0], [8, 5, 0], [5, 8, 0], [6, 5.5, 3]]) for (let z = cz; z < cz + 4; z++) for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
    if (Math.hypot((x - cx) * 0.9, (y - cy) * 1.1, (z - cz - 1.5) * 1.3) < 2.6 + (rng() - 0.5) * 0.3) vox[(z * S + y) * S + x] = 1;
  }
  return bakeVox(vox, S, S, H, ELIT.sand, 0);
}
// A bedroll by the wall: a flat rolled blanket and a pack.
export function voxBedroll() {
  const SX = 6, SY = 12, H = 4, vox = new Uint8Array(SX * SY * H);
  for (let y = 1; y < 11; y++) for (let x = 1; x < 5; x++) vox[y * SX + x] = 1;
  for (let z = 1; z < 3; z++) for (let y = 1; y < 3; y++) for (let x = 1; x < 5; x++) vox[(z * SY + y) * SX + x] = 3;   // the rolled end
  for (let z = 1; z < 4; z++) for (let y = 8; y < 11; y++) for (let x = 2; x < 5; x++) vox[(z * SY + y) * SX + x] = 1;   // the pack
  return bakeVox(vox, SX, SY, H, ELIT.flesh, 0, ELIT.wood);
}
// A chapel pew: a long bench with a back, dark with damp.
export function voxPew() {
  const SX = 5, SY = 14, H = 8, vox = new Uint8Array(SX * SY * H);
  for (let z = 0; z < H; z++) for (let y = 0; y < SY; y++) for (let x = 0; x < SX; x++) {
    const leg = z < 3 && (y === 1 || y === SY - 2) && x >= 1 && x <= 3, seat = z === 3 && x >= 1 && x <= 3 && y >= 1 && y <= SY - 2, back = z >= 3 && x === 4 && y >= 1 && y <= SY - 2;
    if (leg || seat || back) vox[(z * SY + y) * SX + x] = back && z === H - 1 ? 3 : 1;
  }
  return bakeVox(vox, SX, SY, H, ELIT.wood, 0, ELIT.obsid);
}

// ---- deterministic prop set, keyed by world seed (same variant per tile) ----
export function buildProps(seed) {
  return {
    spire: [0, 1, 2, 3].map((v) => voxSpire(mulberry32((seed * 13 + v * 97 + 1) >>> 0))),
    monolith: [0, 1, 2, 3].map((v) => voxMonolith(mulberry32((seed * 29 + v * 131 + 7) >>> 0))),
    totem: [voxEyeTotem(mulberry32((seed * 7 + 3) >>> 0))],
    stairs: [voxPortal()],
    chest: [voxChest()],
    chestOpen: [voxChestOpen()],
    shrine: [voxShrine()],
    shrineSpent: [voxShrineSpent()],
    cage: [voxCage()],
    cageOpen: [voxCageOpen()],
    gibbet: [voxGibbet()],
    brazier: [voxBrazier()],
    pillar: [0, 1].map((v) => voxPillar(mulberry32((seed * 17 + v * 53 + 5) >>> 0))),
    brokenpillar: [0, 1, 2].map((v) => voxPillar(mulberry32((seed * 19 + v * 71 + 9) >>> 0), true)),
    sarcophagus: [voxSarcophagus()],
    bones: [0, 1, 2].map((v) => voxBones(mulberry32((seed * 23 + v * 37 + 3) >>> 0))),
    crates: [0, 1, 2].map((v) => voxCrates(mulberry32((seed * 31 + v * 41 + 11) >>> 0))),
    barrels: [0, 1].map((v) => voxBarrels(mulberry32((seed * 37 + v * 43 + 13) >>> 0))),
    sacks: [0, 1].map((v) => voxSacks(mulberry32((seed * 41 + v * 47 + 17) >>> 0))),
    bedroll: [voxBedroll()],
    pew: [voxPew()],
  };
}
// Which prop kinds cast a point light, and the tint they cast.
export const PROP_LIGHT = { stairs: [0.7, 0.5, 1.7], shrine: [0.5, 1.2, 1.9], brazier: [1.7, 0.9, 0.35], cage: [0.9, 0.7, 1.9] };

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
