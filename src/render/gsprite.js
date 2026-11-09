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

export const GLOW_ID = { 1: EGLOW.poison, 2: EGLOW.violet, 3: EGLOW.ember, 4: EGLOW.water, 5: EGLOW.lava, 6: EGLOW.soul, 7: EGLOW.frost, 8: EGLOW.aqua, 9: EGLOW.window, 10: EGLOW.marsh, 11: EGLOW.mend, 12: EGLOW.might };
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
// (v1.30, sim shrines.js) Three kinds, by the orb: green mends or raises, red lifts ATK, blue lifts DEF.
function shrineVox(spent, glow = 8) {
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
  return bakeVox(vox, S, S, H, ELIT.stone, glow, ELIT.bone);
}
export const voxShrine = (glow = 8) => shrineVox(false, glow);
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

// ---- the dungeons' own furniture (v1.48, the dressing kits: sim world.js DRESS) ----------------------------------
// Each dungeon floor is dressed for its place: the Redhand's dig at the barrow mouth, the legion's galleries and
// muster, the Company's bailey and barracks, the cave under the Keep, the drowned chapel and the Cult's cut, the Fens'
// mound, locks and vats. Built here in code, as voxels, like the rest. Colours stay in the dusk: dark wood, cold
// stone, dull iron, and light only where something burns.
const RED = [[34, 10, 9], [62, 16, 13], [92, 24, 18], [122, 34, 24], [150, 48, 32]];          // the Redhand's red, dyed and dirty
const LEGION = [[16, 20, 34], [26, 32, 52], [38, 46, 72], [52, 62, 92], [70, 80, 110]];      // the Third Legion's faded blue
const CLAY = [[38, 22, 14], [62, 38, 24], [88, 56, 36], [112, 74, 48], [136, 94, 62]];
const WAX = [[70, 64, 52], [110, 102, 84], [150, 140, 116], [184, 174, 146], [210, 200, 172]];
const vgrid = (SX, SY, SZ) => { const vox = new Uint8Array(SX * SY * SZ); return { vox, put: (x, y, z, m) => { x = Math.round(x); y = Math.round(y); z = Math.round(z); if (x >= 0 && y >= 0 && z >= 0 && x < SX && y < SY && z < SZ) vox[(z * SY + y) * SX + x] = m; } }; };
// (Sizes: a voxel is about a pixel, and a hero stands about 56 tall, so furniture is built to a hero's scale in height
// and kept to about a tile's footprint, the one tile it blocks: a tent is as tall as a man, a shelf of niches taller.)
// A spoil heap: the dig's thrown-up earth, a pick stuck in its top.
export function voxSpoil(rng) {
  const S = 16, H = 22, { vox, put } = vgrid(S, S, H), c = S / 2, ph = rng() * 6.28;
  for (let z = 0; z < 11; z++) for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
    const r = Math.hypot((x - c) * 0.9, (y - c) * 1.1) + z * 0.72 + Math.sin(Math.atan2(y - c, x - c) * 3 + ph) * 0.7;
    if (r < 7.4 && hash2(x * 5 + z, y * 3, 41) > 0.08) put(x, y, z, z > 7 && hash2(x, y + z, 43) > 0.7 ? 3 : 1);
  }
  for (let k = 0; k < 12; k++) put(c + 1 + k * 0.3, c - 0.5, 7 + k, 3);                      // the pick's haft
  for (let k = -3; k <= 3; k++) put(c + 4.6, c - 0.5 + k, 19 - Math.abs(k) * 0.4, 3);          // its head
  return bakeVox(vox, S, S, H, ELIT.sand, 0, ELIT.wood);   // (fresh-dug, paler than the floor it's thrown on)
}
// A digger's lantern on a post: a light at the dig and in the cellars.
export function voxLantern() {
  const S = 8, H = 34, { vox, put } = vgrid(S, S, H);
  for (let z = 0; z < 31; z++) for (const [x, y] of [[3, 3], [4, 3], [3, 4], [4, 4]]) put(x, y, z, 1);
  for (let x = 3; x <= 7; x++) put(x, 3, 31, 1);
  for (let z = 22; z < 29; z++) for (let y = 2; y <= 4; y++) for (let x = 5; x <= 7; x++) put(x, y, z, z === 22 || z === 28 ? 3 : 2);
  return bakeVox(vox, S, S, H, ELIT.wood, 3, ELIT.obsid);
}
// A burial niche shelf: a dry-stone shelf against the wall, taller than a man, three tiers of recesses, an urn or a
// skull in each, pale against the dark of the recess.
export function voxUrnShelf(rng, T = false) {
  const SX = 18, SY = 6, SZ = 38, g = ogrid(SX, SY, SZ, T), put = g.put;
  for (let z = 0; z < SZ; z++) for (let y = 0; y < SY; y++) for (let x = 0; x < SX; x++) {
    const shelf = z % 12 < 2 || z >= SZ - 2 || x < 2 || x > SX - 3 || y < 2;                     // the frame, the tiers and the back
    const post = x === 8 || x === 9;
    if (shelf || post) put(x, y, z, 1);
  }
  for (const z0 of [2, 14, 26]) for (const x0 of [2, 10]) {
    const skull = rng() < 0.5, cx = x0 + 3, cy = 3.6;
    for (let z = 0; z < 9; z++) for (let y = 2; y < SY; y++) for (let x = x0; x < x0 + 6; x++) {
      const d = skull ? Math.hypot(x - cx + 0.5, y - cy, (z - 3) * 0.9) : Math.hypot(x - cx + 0.5, y - cy) - (z < 6 ? Math.sin((z / 6) * Math.PI) * 1.2 : -0.6);
      if (skull ? d < 2.6 && z < 6 : d < 1.6 && z < 8) put(x, y, z0 + z, 3);
    }
  }
  return g.bake(ELIT.stone, 0, ELIT.bone);
}
// Grave urns: two or three clay jars with lids, standing together, knee to waist high.
export function voxUrns(rng) {
  const S = 14, H = 20, { vox, put } = vgrid(S, S, H), n = 2 + (rng() < 0.6 ? 1 : 0);
  for (const [cx, cy, h] of [[4.5, 4.5, 19], [9.5, 6, 14], [5.5, 10, 16]].slice(0, n)) for (let z = 0; z < h; z++) {
    const t = z / (h - 1), r = 1.4 + Math.sin(t * Math.PI * 0.9) * 2.1 - (t > 0.85 ? 0.8 : 0);
    for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) if (Math.hypot(x - cx, y - cy) < r) put(x, y, z, z >= h - 2 || z === 0 || z === ((h * 0.55) | 0) ? 3 : 1);
  }
  return bakeVox(vox, S, S, H, CLAY, 0, ELIT.obsid);
}
// A cluster of candles on the floor, wax run down over the stone: the galleries' and the chapel's light.
export function voxCandles(rng) {
  const S = 12, H = 14, { vox, put } = vgrid(S, S, H);
  for (let y = 2; y < 10; y++) for (let x = 2; x < 10; x++) if (Math.hypot(x - 6, y - 6) < 3.8) put(x, y, 0, 1);   // the pooled wax
  for (const [x, y] of [[4, 5], [6, 3], [7, 7], [5, 7], [8, 5]]) {
    const h = 4 + ((rng() * 7) | 0);
    for (let z = 1; z <= h; z++) for (const [dx, dy] of [[0, 0], [1, 0]]) put(x + dx, y + dy, z, 1);
    put(x, y, h + 1, 2); put(x, y, h + 2, 2);
  }
  return bakeVox(vox, S, S, H, WAX, 3);
}
// A weapon rack: the legion's spears and round shields in a timber frame, as tall as a man.
export function voxRack(T = false) {
  const SX = 16, SY = 5, SZ = 40, g = ogrid(SX, SY, SZ, T), put = g.put;
  for (let z = 0; z < 30; z++) { put(1, 2, z, 3); put(2, 2, z, 3); put(13, 2, z, 3); put(14, 2, z, 3); }
  for (let x = 1; x <= 14; x++) { put(x, 2, 6, 3); put(x, 2, 26, 3); }
  for (const x of [4, 6, 8, 10]) for (let z = 1; z < 39; z++) put(x, 3, z, z > 33 ? 1 : 3);    // spears, iron heads
  for (let z = 8; z < 22; z++) for (let x = 8; x <= 16; x++) if (Math.hypot(x - 12, z - 15) < 4.6) put(x, 4, z, Math.hypot(x - 12, z - 15) < 1.4 ? 3 : 1);   // a round shield hung on the end, its boss
  return g.bake(ELIT.stone, 0, ELIT.wood);
}
// A legion standard: a tall pole and crossbar, a faded banner hanging from it, rotted at the hem.
// (or the Redhand's: their red, and a hand on it)
function standardVox(ramp, rng, T = false) {
  const SX = 14, SY = 4, SZ = 48, g = ogrid(SX, SY, SZ, T), put = g.put;
  for (let z = 0; z < 48; z++) { put(2, 2, z, 3); put(2, 3, z, 3); }
  for (let x = 2; x <= 12; x++) put(x, 2, 43, 3);
  for (let z = 20; z < 43; z++) for (let x = 3; x <= 12; x++) {
    if (z < 25 && hash2(x * 3, z, ((rng() * 9) | 0) + 1) < (25 - z) * 0.2) continue;          // the ragged hem
    put(x, 1, z, (x === 7 || x === 8) && z > 28 && z < 37 ? 2 : (x === 6 || x === 9) && z > 30 && z < 35 ? 2 : 1);
  }
  return g.bake(ramp, 0, ELIT.wood);
}
export const voxStandard = (rng, T = false) => standardVox(LEGION, rng, T);
export const voxBanner = (rng, T = false) => standardVox(RED, rng, T);
// A Company bell tent: round dirty canvas on a centre pole, as tall as a man, its door flap open toward the camera.
// (An A-frame's voxel slope stair-stepped into stripes, a ladder; a cone shades as one surface, like the stalagmites.)
export function voxTent() {
  const S = 20, H = 34, { vox, put } = vgrid(S, S, H), c = (S - 1) / 2;
  for (let z = 0; z < 30; z++) {
    const t = z / 29, r = 9.2 * (1 - t) * (0.55 + 0.45 * (1 - t)) + 0.9 + (z < 4 ? 0.3 : 0);   // a bell: steep at the foot, a long taper
    for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
      const d = Math.hypot(x - c, y - c); if (d > r) continue;
      const a = Math.atan2(y - c, x - c), door = z < 14 && Math.abs(a - Math.PI / 4) < 0.32;   // the flap, on the camera's side
      if (door && d > r - 1.2) { put(x, y, z, 3); continue; }
      if (door) continue;
      put(x, y, z, z === 3 || z === 4 ? 3 : 1);                                                 // a dark band of mud and wet at the hem
    }
  }
  for (let z = 28; z < 34; z++) put(c, c, z, 3);                                                // the pole's top
  return bakeVox(vox, S, S, H, ELIT.sand, 0, ELIT.wood);
}
// A barracks bunk: two tiers of timber and straw ticks, chest high and head high.
export function voxBunk() {
  const SX = 8, SY = 16, SZ = 30, { vox, put } = vgrid(SX, SY, SZ);
  for (const [x, y] of [[1, 1], [6, 1], [1, 14], [6, 14]]) for (let z = 0; z < 30; z++) put(x, y, z, 3);
  for (const z0 of [6, 20]) for (let y = 1; y <= 14; y++) for (let x = 1; x <= 6; x++) { put(x, y, z0, 3); if (y > 1 && y < 14 && x > 1 && x < 6) { put(x, y, z0 + 1, 1); put(x, y, z0 + 2, y < 4 ? 1 : 0); } }
  return bakeVox(vox, SX, SY, SZ, ELIT.sand, 0, ELIT.wood);
}
// Scaffolding: the diggers' timber props against the cellar wall, a plank walk halfway up.
export function voxScaffold(T = false) {
  const SX = 16, SY = 6, SZ = 44, g = ogrid(SX, SY, SZ, T), put = g.put;
  for (const x of [1, 8, 14]) for (const y of [1, 4]) for (let z = 0; z < 44; z++) put(x, y, z, 1);
  for (const z of [20, 41]) for (let x = 0; x < SX; x++) for (let y = 1; y <= 4; y++) put(x, y, z, 3);
  for (let k = 0; k < 19; k++) { put(1 + k * 0.38, 1, 1 + k, 1); put(14 - k * 0.32, 4, 21 + k, 1); }   // the braces
  return g.bake(ELIT.wood, 0, ELIT.loam);
}
// A stalagmite: a crooked tooth of wet rock up out of the cave floor, sometimes a smaller one beside it.
export function voxStalagmite(rng) {
  const S = 12, H = 40, { vox, put } = vgrid(S, S, H), h = 24 + ((rng() * 15) | 0), ph = rng() * 6.28, two = rng() < 0.5;
  for (const [cx, cy, hh, r0] of [[5, 6, h, 3.8], ...(two ? [[9, 3.5, h * 0.45, 2.2]] : [])]) for (let z = 0; z < hh; z++) {
    const r = r0 * (1 - z / hh) + 0.5, ox = Math.sin(z * 0.2 + ph) * 0.8;
    for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) if (Math.hypot(x - cx - ox, y - cy) < r + (fbm(x * 0.6, z * 0.4 + y, 33) - 0.5)) put(x, y, z, z > hh - 4 || z % 9 === 4 ? 3 : 1);
  }
  return bakeVox(vox, S, S, H, ELIT.rock, 0, ELIT.slate);
}
// A boulder: a rounded lump of fallen rock, half sunk in the floor.
export function voxBoulder(rng) {
  const S = 16, H = 14, { vox, put } = vgrid(S, S, H), sx = 1 + rng() * 0.3, sy = 1.25 - rng() * 0.3;
  for (let z = 0; z < H; z++) for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) if (Math.hypot((x - 8) * sx, (y - 8) * sy, (z + 1.5) * 0.95) < 7.6 + (fbm(x * 0.5, y * 0.5 + z, 61) - 0.5) * 1.6) put(x, y, z, 1);
  return bakeVox(vox, S, S, H, ELIT.crag, 0);
}
// An altar: a stone table under a dark cloth, two tall candles burning on it.
export function voxAltar() {
  const SX = 16, SY = 8, SZ = 26, { vox, put } = vgrid(SX, SY, SZ);
  for (let z = 0; z < 16; z++) for (let y = 1; y < 7; y++) for (let x = 0; x < SX; x++) put(x, y, z, (z === 15 && x > 2 && x < SX - 3) || (y === 6 && z > 8 && x > 4 && x < SX - 5) ? 3 : 1);
  for (const x of [2, 13]) { for (let z = 16; z < 23; z++) put(x, 3, z, 1); put(x, 3, 23, 2); put(x, 3, 24, 2); }
  return bakeVox(vox, SX, SY, SZ, ELIT.bone, 3, LEGION);   // (pale stone, the cloth dark on it: a blue box otherwise)
}
// A fallen saint: a statue off its plinth, face down in the silt, its head broken off beside it.
export function voxSaint() {
  const SX = 10, SY = 20, SZ = 10, { vox, put } = vgrid(SX, SY, SZ);
  for (let y = 4; y < 18; y++) for (let x = 1; x < 9; x++) for (let z = 0; z < 6; z++) if (Math.hypot((x - 4.5) * 0.75, z - 2) < 3.4 - (y > 14 ? (y - 14) * 0.3 : 0)) put(x, y, z, 1);
  for (let z = 0; z < 4; z++) for (let y = 0; y < 4; y++) for (let x = 5; x < 9; x++) if (Math.hypot(x - 6.5, y - 1.5, z - 1.5) < 2.2) put(x, y, z, 1);   // the head
  for (let z = 0; z < 3; z++) for (let y = 15; y < 20; y++) for (let x = 0; x < SX; x++) put(x, y, z, 3);   // the broken plinth
  return bakeVox(vox, SX, SY, SZ, ELIT.stone, 0, ELIT.basalt);
}
// A chain post: an iron-bound stake, chains hanging in loops to the floor (the Cult binds here).
export function voxChains() {
  const S = 12, H = 38, { vox, put } = vgrid(S, S, H);
  for (let z = 0; z < 36; z++) for (const [x, y] of [[5, 5], [6, 5], [5, 6], [6, 6]]) put(x, y, z, z % 9 === 0 ? 3 : 1);
  for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1]]) for (let k = 0; k < 26; k++) { const t = k / 25, sag = Math.sin(t * Math.PI) * 8, z = 30 - sag - t * 22; put(5.5 + dx * (1 + t * 5), 5.5 + dy * (1 + t * 5), z, 3); put(5.5 + dx * (1 + t * 5) + dy, 5.5 + dy * (1 + t * 5) + dx, z, 3); }
  for (let z = 0; z < 2; z++) for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) if (Math.hypot(x - 5.5, y - 5.5) < 5.5 && Math.hypot(x - 5.5, y - 5.5) > 4.2 && hash2(x, y, 17) > 0.5) put(x, y, z, 3);   // the slack on the floor
  return bakeVox(vox, S, S, H, ELIT.wood, 0, ELIT.stone);   // (iron chains in grey, so they read against the dark)
}
// A binding circle in the cinders: a ring of embers laid out on the floor, flat (walked over: sim world.js FLAT_PROPS).
export function voxCircle() {
  const S = 22, H = 2, { vox, put } = vgrid(S, S, H), c = (S - 1) / 2;
  for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
    const r = Math.hypot(x - c, y - c), a = Math.atan2(y - c, x - c);
    if (r > 8.6 && r < 10.2) put(x, y, 0, hash2(x, y, 29) > 0.55 ? 2 : 1);
    else if (r < 8.6 && Math.abs(Math.sin(a * 2.5) * r) < 0.6 && r > 2) put(x, y, 0, 1);       // the spokes
  }
  return bakeVox(vox, S, S, H, ELIT.obsid, 3);
}
// One of the bound: a legionary standing as he was bound, chained, the Cult's still work (not a foe).
export function voxBound(rng) {
  const S = 12, H = 46, { vox, put } = vgrid(S, S, H), lean = (rng() - 0.5) * 0.04;
  for (let z = 0; z < 44; z++) {
    const head = z >= 36, r = head ? 2.6 : z < 18 ? 1.8 : 3.4 - (z > 32 ? (z - 32) * 0.3 : 0);
    for (const off of head || z >= 18 ? [0] : [-1.8, 1.8]) for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) if (Math.hypot(x - 5.5 - off - z * lean * 10, y - 5.5) < r) put(x, y, z, (z === 22 || z === 27 || z === 13 || z === 6) ? 3 : 1);
  }
  return bakeVox(vox, S, S, H, ELIT.bone, 0, ELIT.obsid);
}
// The binding font: a stone basin on a stem, the water in it lit violet from below.
export function voxFont() {
  const S = 16, H = 22, { vox, put } = vgrid(S, S, H), c = (S - 1) / 2;
  for (let z = 0; z < 21; z++) for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
    const r = Math.hypot(x - c, y - c);
    if (z < 3 ? r < 6 : z < 13 ? r < 2.4 : r < 7.4 && (r > 5.8 || z === 13)) put(x, y, z, z === 20 || z === 2 ? 3 : 1);
    if (z === 19 && r <= 5.8) put(x, y, z, 2);
  }
  return bakeVox(vox, S, S, H, ELIT.stone, 6, ELIT.basalt);
}
// An upturned boat on the Toadking's mound: a punt's hull, keel up, tarred.
export function voxBoat() {
  const SX = 10, SY = 22, SZ = 10, { vox, put } = vgrid(SX, SY, SZ);
  for (let y = 0; y < SY; y++) { const t = Math.abs(y - 10.5) / 10.5, half = 4.6 * Math.sqrt(1 - t * t * 0.85);
    for (let x = 0; x < SX; x++) for (let z = 0; z < SZ; z++) { const d = Math.hypot((x - 4.5) / Math.max(0.5, half), z / 8.5); if (d < 1 && d > 0.74) put(x, y, z, z >= 7 && Math.abs(x - 4.5) < 1 ? 3 : 1); } }
  return bakeVox(vox, SX, SY, SZ, ELIT.wood, 0, ELIT.obsid);
}
// Reeds: a stand of them, grown up through the floor where the water comes in.
export function voxReeds(rng) {
  const S = 12, H = 32, { vox, put } = vgrid(S, S, H);
  for (let k = 0; k < 20; k++) { const x0 = 1 + rng() * 10, y0 = 1 + rng() * 10, h = 14 + rng() * 17, bx = (rng() - 0.5) * 0.22; for (let z = 0; z < h; z++) put(x0 + z * bx, y0, z, z > h - 4 ? 3 : 1); }
  return bakeVox(vox, S, S, H, ELIT.reed, 0, ELIT.wheat);
}
// A lock windlass: a timber drum on a frame, its crank handle out, rope wound on.
export function voxWindlass() {
  const SX = 14, SY = 9, SZ = 24, { vox, put } = vgrid(SX, SY, SZ);
  for (const x of [0, 1, 12, 13]) for (let z = 0; z < 15; z++) for (const y of [1, 2, 6, 7]) put(x, y, z, 1);   // the stout A-frames
  for (let x = 2; x <= 11; x++) for (let y = 0; y < SY; y++) for (let z = 0; z < SZ; z++) { const r = Math.hypot(y - 4, z - 15); if (r < 5.2) put(x, y, z, r > 3.8 || x === 2 || x === 11 ? 1 : 3); }   // the drum, rope wound on it
  for (let z = 15; z < 22; z++) put(13, 4, z, 1); for (let y = 4; y <= 7; y++) put(13, y, 21, 1);
  return bakeVox(vox, SX, SY, SZ, ELIT.wood, 0, ELIT.reed);
}
// A vat: one of the Cult's great tubs at Vat Seven, iron-hooped, the sick water in it giving off its light.
export function voxVat() {
  const S = 18, H = 24, { vox, put } = vgrid(S, S, H), c = (S - 1) / 2;
  for (let z = 0; z < 23; z++) for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
    const r = Math.hypot(x - c, y - c);
    if (r < 8.2 && (r > 6.9 || z === 0)) put(x, y, z, z === 3 || z === 12 || z === 22 ? 3 : 1);
    if (z === 20 && r <= 6.9) put(x, y, z, 2);
  }
  return bakeVox(vox, S, S, H, ELIT.wood, 1, ELIT.obsid);
}

// ---- the dressing pass (docs/vale-dungeon-dressing.md): the pieces the Vale's authored rooms name -------------------
// Each built to a hero's scale (a hero ~56 voxels tall, a tile ~16 across), dark and dusky like the rest, with light only
// where something burns or the sky gets in. A piece that runs along a wall is built along x (a north wall's run) and
// comes transposed as `<kind>_y` for a west wall (world.js dressPlanned picks by the room's axis): before, a west wall's
// racks and niche shelves stood out from it end-on, and read as posts.
const IRON = [[14, 14, 18], [24, 24, 30], [36, 36, 44], [52, 52, 62], [72, 72, 84]];
const STRAW = [[40, 32, 14], [62, 50, 22], [88, 72, 32], [116, 96, 44], [146, 122, 58]];
const PAPER = [[56, 50, 38], [92, 84, 64], [128, 118, 92], [162, 150, 118], [190, 178, 142]];
/** a voxel grid that can be built along x and stored transposed (along y) @param {boolean} T */
function ogrid(SX, SY, SZ, T) {
  const X = T ? SY : SX, Y = T ? SX : SY, vox = new Uint8Array(X * Y * SZ);
  const put = (x, y, z, m) => { x = Math.round(x); y = Math.round(y); z = Math.round(z); if (T) [x, y] = [y, x]; if (x >= 0 && y >= 0 && z >= 0 && x < X && y < Y && z < SZ) vox[(z * Y + y) * X + x] = m; };
  return { vox, put, bake: (ramp, emi, ramp2) => bakeVox(vox, X, Y, SZ, ramp, emi, ramp2) };
}
const box3 = (put, x0, x1, y0, y1, z0, z1, m) => { for (let z = z0; z <= z1; z++) for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) put(x, y, z, m); };
// A horse stall: two posts, a top rail, half-height boarding, against the wall (built along x: the wall's run). Low
// enough at the front to see the fight over, as tall as a horse at the back.
export function voxStall(T = false) {
  const g = ogrid(18, 14, 30, T);
  for (const x of [0, 17]) for (const y of [0, 12]) box3(g.put, x, x, y, y + 1, 0, 28, 3);      // the partitions' posts
  for (const x of [0, 17]) for (let y = 2; y < 12; y++) for (let z = 0; z < 22 - y * 0.9; z++) if (z % 4 !== 3) g.put(x, y, z, 1);   // their slatted boards, stepping down to the front
  for (let x = 0; x <= 17; x++) { g.put(x, 0, 28, 3); g.put(x, 0, 14, 3); }                      // the rails along the wall (no boarding: the wall's behind)
  for (let x = 6; x <= 11; x++) for (let z = 18; z <= 22; z++) if (x === 6 || x === 11 || z === 18) g.put(x, 1, z, 1);   // the hay rack
  for (let x = 3; x <= 14; x++) for (let y = 3; y <= 11; y++) if (hash2(x, y, 7) > 0.35) g.put(x, y, 0, 1);   // the litter
  return g.bake(ELIT.wood, 0, ELIT.loam);
}
// Hay: a loose heap and a tied bale, pale against the dark floor.
export function voxHay(rng) {
  const S = 16, H = 14, { vox, put } = vgrid(S, S, H), ph = rng() * 6;
  for (let z = 0; z < 10; z++) for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) if (Math.hypot(x - 6, y - 8) + z * 0.75 + Math.sin(Math.atan2(y - 8, x - 6) * 5 + ph) * 0.6 < 6.4 && hash2(x + z, y, 51) > 0.12) put(x, y, z, 1);
  box3(put, 9, 15, 2, 7, 0, 5, 1); for (let x = 9; x <= 15; x++) for (const y of [2, 7]) put(x, y, 6, 3);
  for (const x of [11, 14]) for (let y = 2; y <= 7; y++) put(x, y, 5, 3);                           // the bale's cords
  return bakeVox(vox, S, S, H, STRAW, 0, ELIT.wood);
}
// A trough: a long timber box on legs, black water in it.
export function voxTrough(T = false) {
  const g = ogrid(18, 7, 9, T);
  box3(g.put, 0, 17, 0, 6, 2, 8, 1);
  for (let x = 1; x <= 16; x++) for (let y = 1; y <= 5; y++) { g.put(x, y, 8, 0); g.put(x, y, 7, 3); }   // the water
  for (const x of [1, 16]) for (const y of [0, 6]) box3(g.put, x, x, y, y, 0, 1, 1);
  return g.bake(ELIT.wood, 0, ELIT.tide);
}
// Old Skarn's cart: two big wheels, a bed piled with wicker coops, a hen's comb showing through (the goblins' prize).
export function voxHenCart() {
  const SX = 26, SY = 14, SZ = 26, { vox, put } = vgrid(SX, SY, SZ);
  box3(put, 3, 22, 2, 11, 8, 9, 1);                                                               // the bed
  for (let x = 3; x <= 22; x++) for (const y of [2, 11]) box3(put, x, x, y, y, 10, 12, 1);        // its sides
  for (let k = 0; k < 10; k++) { put(22 + k * 0.4, 6.5, 8 - k * 0.6, 1); put(22 + k * 0.4, 7.5, 8 - k * 0.6, 1); }   // the shafts down to the floor
  for (const y of [0, 13]) for (let x = 0; x < SX; x++) for (let z = 0; z < SZ; z++) { const r = Math.hypot(x - 11, z - 7); if (r < 7.2 && (r > 5.8 || Math.abs(x - 11) < 0.8 || Math.abs(z - 7) < 0.8)) put(x, y, z, 1); }   // the wheels
  for (const [x0, y0, z0] of [[5, 3, 10], [12, 3, 10], [8, 7, 10], [15, 6, 10], [9, 4, 17]]) for (let z = 0; z < 7; z++) for (let y = 0; y < 5; y++) for (let x = 0; x < 6; x++) {
    const shell = x === 0 || x === 5 || y === 0 || y === 4 || z === 6 || z === 0;
    if (shell && (x + z) % 2 === 0) put(x0 + x, y0 + y, z0 + z, 3);                                // the coops' wicker
    else if (!shell && z < 4 && hash2(x0 + x, y0 + y, z) > 0.4) put(x0 + x, y0 + y, z0 + z, 2);    // a hen inside
  }
  return bakeVox(vox, SX, SY, SZ, ELIT.wood, 3, STRAW);
}
// A yard well: a round stone curb, a timber frame and a windlass over it, a bucket on the rope.
export function voxWell() {
  const S = 22, H = 40, { vox, put } = vgrid(S, S, H), c = (S - 1) / 2;
  for (let z = 0; z < 10; z++) for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) { const r = Math.hypot(x - c, y - c); if (r < 9 && (r > 6.4 || z === 0)) put(x, y, z, z === 9 || (z % 3 === 0 && hash2(x, y, z) > 0.5) ? 3 : 1); }
  for (let x = 0; x < S; x++) for (let y = 0; y < S; y++) if (Math.hypot(x - c, y - c) < 6.4) put(x, y, 1, 0);
  for (const x of [2, 19]) box3(put, x, x + 1, 10, 11, 0, 32, 3);                                 // the posts
  for (let x = 2; x <= 20; x++) { put(x, 10, 33, 3); put(x, 11, 33, 3); }                         // the beam
  for (let x = 6; x <= 15; x++) for (let y = 8; y <= 13; y++) for (let z = 27; z <= 32; z++) if (Math.hypot(y - 10.5, z - 29.5) < 2.6) put(x, y, z, 3);   // the drum
  for (let z = 14; z < 27; z++) put(c, 10.5, z, 3); box3(put, c - 1.5, c + 1.5, 9, 12, 11, 14, 3); // the rope, the bucket
  return bakeVox(vox, S, S, H, ELIT.stone, 0, ELIT.wood);
}
// A handcart: a tipped barrow of sacks and a broken wheel (the Redhand's loot, the yard's clutter).
export function voxCart() {
  const SX = 20, SY = 12, SZ = 18, { vox, put } = vgrid(SX, SY, SZ);
  box3(put, 2, 15, 1, 10, 5, 6, 1); for (let x = 2; x <= 15; x++) for (const y of [1, 10]) box3(put, x, x, y, y, 7, 9, 1);
  for (const y of [0, 11]) for (let x = 0; x < SX; x++) for (let z = 0; z < SZ; z++) { const r = Math.hypot(x - 8, z - 5); if (r < 5.4 && (r > 4.2 || Math.abs(x - 8) < 0.7)) put(x, y, z, 1); }
  for (let k = 0; k < 8; k++) { put(15 + k * 0.6, 4, 6 - k * 0.7, 1); put(15 + k * 0.6, 7, 6 - k * 0.7, 1); }
  for (const [cx, cy] of [[6, 5], [11, 6], [8, 4]]) for (let z = 7; z < 15; z++) for (let y = 0; y < SY; y++) for (let x = 0; x < SX; x++) if (Math.hypot(x - cx, y - cy, (z - 10) * 0.8) < 3) put(x, y, z, 3);
  return bakeVox(vox, SX, SY, SZ, ELIT.wood, 0, ELIT.sand);
}
// The gate's portcullis, raised and rusted fast: an iron grid in its stone slot, against the wall.
export function voxPortcullis(T = false) {
  const g = ogrid(24, 5, 52, T);
  for (const x of [0, 1, 22, 23]) box3(g.put, x, x, 0, 4, 0, 51, 1);                              // the slot's jambs
  box3(g.put, 0, 23, 0, 4, 46, 51, 1);                                                            // the lintel
  for (let x = 3; x <= 20; x += 3) for (let z = 18; z < 46; z++) g.put(x, 2, z, z < 21 ? 2 : 3);  // the bars, their points (rust)
  for (let z = 22; z < 46; z += 5) for (let x = 2; x <= 21; x++) g.put(x, 2, z, 3);
  return g.bake(ELIT.stone, 3, IRON);
}
// The strongroom's iron door, hung open: a studded slab on two strap hinges, standing out from the wall.
export function voxIronDoor(T = false) {
  const g = ogrid(10, 16, 44, T);
  box3(g.put, 0, 1, 0, 15, 0, 43, 1);                                                             // the jamb on the wall
  for (let y = 2; y <= 14; y++) for (let z = 0; z < 40; z++) g.put(2, y, z, (y % 4 === 0 && z % 6 === 3) || z === 8 || z === 30 ? 1 : 3);   // the slab, its studs and straps
  return g.bake(ELIT.stone, 0, IRON);
}
// A clerk's desk: a sloped writing top on a frame, an open roll, an inkpot and a candle burned to a stub.
export function voxDesk(T = false) {
  const g = ogrid(16, 9, 22, T);
  for (const [x, y] of [[1, 1], [14, 1], [1, 7], [14, 7]]) box3(g.put, x, x, y, y, 0, 12, 1);
  for (let x = 0; x <= 15; x++) for (let y = 0; y <= 8; y++) g.put(x, y, 13 + Math.round((8 - y) * 0.25), 1);
  for (let x = 3; x <= 10; x++) for (let y = 2; y <= 6; y++) g.put(x, y, 15 + Math.round((8 - y) * 0.25), 3);   // the roll, open
  box3(g.put, 12, 13, 3, 4, 15, 16, 1); g.put(13, 6, 16, 3); g.put(13, 6, 17, 3); g.put(13, 6, 18, 2); g.put(13, 6, 19, 2);
  return g.bake(ELIT.wood, 3, PAPER);
}
// Pigeonholes of rolls against the wall: the legion's orders, filed, taller than a man.
export function voxShelf(T = false) {
  const g = ogrid(20, 6, 44, T);
  for (let z = 0; z < 44; z++) for (let y = 0; y < 6; y++) for (let x = 0; x < 20; x++) {
    const frame = x === 0 || x === 19 || z % 9 === 0 || y === 0 || z === 43 || x % 5 === 0;
    if (frame) g.put(x, y, z, 1);
    else if (y >= 2 && (z % 9) >= 2 && (z % 9) <= 6 && hash2(x * 3, z, 71) > 0.25) g.put(x, y, z, 3);   // the rolls' ends
  }
  return g.bake(ELIT.wood, 0, PAPER);
}
// The broken floor: the flags gone into a black hole, their edges cracked and tilted, the dig's timber across it.
export function voxPit(rng) {
  const S = 18, H = 6, { vox, put } = vgrid(S, S, H), c = (S - 1) / 2, ph = rng() * 6;
  for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
    const a = Math.atan2(y - c, x - c), r = Math.hypot(x - c, y - c), rim = 6 + Math.sin(a * 4 + ph) * 1.2;
    if (r < rim) put(x, y, 0, 3);                                                                 // the dark below
    else if (r < rim + 2.4 && hash2(x, y, 13) > 0.25) put(x, y, Math.round(hash2(x, y, 17) * 2), 1);   // the tilted flags
  }
  return bakeVox(vox, S, S, H, ELIT.stone, 0, ELIT.pit);
}
// A ladder: two rails and rungs, leaning on the wall or standing up out of the broken floor.
export function voxLadder() {
  const SX = 7, SY = 6, SZ = 46, { vox, put } = vgrid(SX, SY, SZ);
  for (let z = 0; z < 46; z++) { const y = 1 + z * 0.08; put(0, y, z, 1); put(6, y, z, 1); if (z % 5 === 2) for (let x = 1; x <= 5; x++) put(x, y, z, 3); }
  return bakeVox(vox, SX, SY, SZ, ELIT.wood, 0, ELIT.loam);
}
// Shoring: the diggers' timber frame against an earth wall, two posts and a cap, wedged.
export function voxShoring(T = false) {
  const g = ogrid(16, 5, 44, T);
  for (const x of [1, 2, 13, 14]) box3(g.put, x, x, 1, 3, 0, 40, 1);
  box3(g.put, 0, 15, 1, 3, 40, 43, 1);
  for (let k = 0; k < 9; k++) { g.put(3 + k, 2, 39 - k, 3); g.put(12 - k, 2, 39 - k, 3); }          // the knee braces
  return g.bake(ELIT.wood, 0, ELIT.loam);
}
// Hester Lowe's hives: three straw skeps on a plank bench by the porch wall.
export function voxHives(T = false) {
  const g = ogrid(22, 8, 22, T);
  box3(g.put, 0, 21, 1, 6, 6, 7, 3); for (const x of [1, 20]) box3(g.put, x, x, 2, 5, 0, 5, 3);
  for (const cx of [4, 11, 18]) for (let z = 0; z < 12; z++) for (let y = 0; y < 8; y++) for (let x = cx - 4; x <= cx + 4; x++) {
    const r = Math.hypot(x - cx, y - 3.5) / (3.6 * Math.sqrt(1 - Math.pow(z / 12, 1.6)));
    if (r < 1) g.put(x, y, 8 + z, z % 3 === 0 ? 3 : (z === 1 && Math.abs(x - cx) < 1.2 && y > 5) ? 0 : 1);   // coiled straw; the little door
  }
  return g.bake(STRAW, 0, ELIT.wood);
}
// A plain bench (the warden's chapel, the guardroom): a plank on two trestles.
export function voxBench(T = false) {
  const g = ogrid(16, 5, 10, T);
  box3(g.put, 0, 15, 0, 4, 8, 9, 1); for (const x of [1, 14]) box3(g.put, x, x + 1, 0, 4, 0, 7, 3);
  return g.bake(ELIT.wood, 0, ELIT.loam);
}
// A chapel door, off its hinges and propped on the wall: planks, three iron straps.
export function voxFallenDoor(T = false) {
  const g = ogrid(14, 8, 40, T);
  for (let z = 0; z < 38; z++) { const y = 1 + z * 0.14; for (let x = 0; x < 14; x++) g.put(x, y, z, z === 6 || z === 18 || z === 30 ? 3 : (x % 4 === 0 ? 3 : 1)); }
  return g.bake(ELIT.wood, 0, IRON);
}
// Daylight down the fallen tower's shaft: a pale pool on the flags, dust in it (flat: walked over; its light is the
// renderer's, PROP_LIGHT, and Luminati's a cold beam from above).
export function voxShaft() {
  const S = 26, H = 2, { vox, put } = vgrid(S, S, H), c = (S - 1) / 2;
  for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) { const r = Math.hypot(x - c, (y - c) * 1.1); if (r < 11 && hash2(x, y, 81) < 1.05 - r / 11) put(x, y, 0, r < 7 ? 2 : 1); }
  return bakeVox(vox, S, S, H, ELIT.chasm, 7);
}
// Iron bars across an alcove: the Long Vault's, each with its empty strongbox behind.
export function voxBars(T = false) {
  const g = ogrid(18, 4, 40, T);
  box3(g.put, 0, 17, 0, 3, 36, 39, 1); for (const x of [0, 17]) box3(g.put, x, x, 0, 3, 0, 39, 1);
  for (let x = 2; x <= 15; x += 2) box3(g.put, x, x, 2, 2, 0, 35, 3);
  for (const z of [10, 26]) for (let x = 1; x <= 16; x++) g.put(x, 2, z, 3);
  return g.bake(ELIT.stone, 0, IRON);
}
// A legion strongbox, its lid up and nothing in it: iron-bound oak, smaller than a find's chest.
export function voxStrongbox() {
  const SX = 12, SY = 8, SZ = 14, { vox, put } = vgrid(SX, SY, SZ);
  for (let z = 0; z < 7; z++) for (let y = 0; y < SY; y++) for (let x = 0; x < SX; x++) { const wall = x === 0 || x === SX - 1 || y === 0 || y === SY - 1 || z === 0; if (wall) put(x, y, z, x % 4 === 1 || z === 6 ? 3 : 1); }
  for (let z = 7; z < 14; z++) for (let x = 0; x < SX; x++) put(x, 0, z, x % 4 === 1 || z === 13 ? 3 : 1);   // the lid, back
  return bakeVox(vox, SX, SY, SZ, ELIT.wood, 0, IRON);
}
// Captain Garrow's table in the cave: a trestle board, the map of the dig spread on it, a lamp, his stool.
export function voxMapTable() {
  const SX = 22, SY = 20, SZ = 22, { vox, put } = vgrid(SX, SY, SZ);
  for (const x of [2, 19]) for (let k = 0; k < 12; k++) { put(x, 2 + k * 0.4, k, 1); put(x, 11 - k * 0.4, k, 1); }   // the trestles
  box3(put, 0, 21, 1, 12, 12, 13, 1);
  box3(put, 3, 16, 3, 10, 14, 14, 3);                                                             // the map
  for (const [x, y] of [[6, 5], [11, 8], [14, 4]]) put(x, y, 15, 1);                              // its weights
  box3(put, 18, 19, 4, 5, 14, 17, 1); put(18, 4, 18, 2); put(18, 4, 19, 2);                       // the lamp
  box3(put, 8, 12, 15, 18, 0, 7, 1);                                                              // the stool (off the board's end)
  return bakeVox(vox, SX, SY, SZ, ELIT.wood, 3, PAPER);
}
// The robed men's ledgers: account books stacked on a crate, one open, a candle.
export function voxLedgers() {
  const S = 12, H = 20, { vox, put } = vgrid(S, S, H);
  box3(put, 1, 10, 1, 10, 0, 9, 1);
  for (const [z, x0] of [[10, 2], [12, 3], [14, 2]]) box3(put, x0, x0 + 6, 3, 8, z, z + 1, 3);
  box3(put, 1, 8, 2, 9, 16, 16, 3); put(9, 3, 10, 1); put(9, 3, 11, 2); put(9, 3, 12, 2);
  return bakeVox(vox, S, S, H, ELIT.wood, 3, PAPER);
}
// Ned Fallow's cage at the camp's end, broken open: a timber stockade, its door hanging (he's at the gate now).
export function voxStockade() {
  const S = 18, H = 34, { vox, put } = vgrid(S, S + 6, H);
  for (let z = 0; z < 32; z++) for (let k = 0; k < 18; k += 3) { put(k, 0, z, 1); put(0, k, z, 1); put(17, k, z, 1); if (k < 6 || k > 12) put(k, 17, z, 1); }
  for (const z of [1, 31]) for (let k = 0; k < 18; k++) { put(k, 0, z, 3); put(0, k, z, 3); put(17, k, z, 3); }
  for (let z = 2; z < 30; z++) for (let k = 0; k < 6; k++) if (k % 2 === 0 || z % 9 === 0) put(6 + k * 0.4, 17 + k, z, 1);   // the door, swung out
  return bakeVox(vox, S, S + 6, H, ELIT.wood, 0, ELIT.loam);
}
// A guardian of the barrow door: a legionary in stone twice a man's height on a plinth, spear grounded, shield up.
export function voxGuardian() {
  const S = 20, H = 96, { vox, put } = vgrid(S, S, H), c = 9.5;
  box3(put, 1, 18, 1, 18, 0, 9, 3);                                                               // the plinth
  for (let z = 10; z < 86; z++) {
    const t = (z - 10) / 76, head = z >= 74, r = head ? 4.4 : t < 0.36 ? 2.6 : 5.8 - (t > 0.75 ? (t - 0.75) * 14 : 0);
    for (const off of head || t >= 0.36 ? [0] : [-3, 3]) for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) if (Math.hypot(x - c - off, y - c) < r) put(x, y, z, 1);
  }
  for (let z = 82; z < 89; z++) for (let x = 6; x <= 13; x++) put(x, c, z, 1);                    // the helm's crest
  for (let z = 10; z < 95; z++) { put(16, 14, z, 3); put(17, 14, z, 3); }                          // the spear
  for (let z = 34; z < 64; z++) for (let x = 2; x <= 9; x++) if (Math.hypot(x - 5.5, (z - 49) * 0.45) < 6) put(x, 17, z, 3);   // the shield
  return bakeVox(vox, S, S, H, ELIT.bone, 0, ELIT.stone);
}
// A sarcophagus with its lid off, the lid leaning on its side, the effigy's face upward.
export function voxSarcophagusOpen() {
  const SX = 14, SY = 26, SZ = 16, { vox, put } = vgrid(SX, SY, SZ);
  for (let z = 0; z < 10; z++) for (let y = 2; y < 24; y++) for (let x = 1; x < 9; x++) { const wall = x === 1 || x === 8 || y === 2 || y === 23 || z === 0; if (wall) put(x, y, z, z === 9 ? 3 : 1); }
  for (let y = 4; y < 22; y++) for (let z = 0; z < 12; z++) put(10 + Math.round(z * 0.25), y, z, 1);   // the lid, propped on the side
  for (let y = 6; y < 12; y++) put(13, y, 11, 3);                                                 // its carved hands
  return bakeVox(vox, SX, SY, SZ, ELIT.stone, 0, ELIT.bone);
}
// A cask rack: three casks on a timber cradle, one on top (the imperial cellars' wine, long gone sour).
export function voxCaskRack(T = false) {
  const g = ogrid(24, 10, 24, T);
  for (const x of [1, 22]) box3(g.put, x, x + 1, 0, 9, 0, 3, 3);
  for (const [cx, cz] of [[5, 8], [12, 8], [19, 8], [8.5, 17], [15.5, 17]]) for (let x = cx - 3; x <= cx + 3; x++) for (let y = 0; y < 10; y++) for (let z = cz - 5; z <= cz + 5; z++) {
    const r = Math.hypot(x - cx, z - cz) - Math.sin((y / 9) * Math.PI) * 0.9;
    if (r < 3.4) g.put(x, y, z, y === 2 || y === 7 ? 3 : 1);
  }
  return g.bake(ELIT.wood, 0, IRON);
}
// A standing torch: a cresset on an iron pole, burning (the keep's, the barracks', the vault's door lights).
export function voxTorch() {
  const S = 7, H = 36, { vox, put } = vgrid(S, S, H);
  for (let z = 0; z < 29; z++) put(3, 3, z, 1); box3(put, 2, 4, 2, 4, 0, 0, 1);
  for (let z = 28; z < 32; z++) for (let y = 1; y <= 5; y++) for (let x = 1; x <= 5; x++) if ((x === 1 || x === 5 || y === 1 || y === 5) && (x + y + z) % 2 === 0) put(x, y, z, 1);
  for (let z = 30; z < 35; z++) for (let y = 2; y <= 4; y++) for (let x = 2; x <= 4; x++) if (z < 33 || (x === 3 && y === 3)) put(x, y, z, 2);
  return bakeVox(vox, S, S, H, IRON, 3);
}
// A candelabrum: a tall iron stand, five candles on its arms (the chapel's door lights: not floor candles, the river took those).
export function voxCandelabra() {
  const S = 12, H = 40, { vox, put } = vgrid(S, S, H);
  box3(put, 4, 7, 4, 7, 0, 1, 1); for (let z = 0; z < 30; z++) { put(5, 5, z, 1); put(6, 6, z, 1); }
  for (let x = 1; x <= 10; x++) put(x, 5.5, 28 + Math.round(Math.abs(x - 5.5) * 0.4), 1);
  for (const x of [1, 3, 5.5, 8, 10]) { const z0 = 29 + Math.round(Math.abs(x - 5.5) * 0.4); put(x, 5.5, z0 + 1, 3); put(x, 5.5, z0 + 2, 3); put(x, 5.5, z0 + 3, 2); put(x, 5.5, z0 + 4, 2); }
  return bakeVox(vox, S, S, H, IRON, 3, WAX);
}
// A cookfire: a ring of stones, the embers, a pot on a tripod over them.
export function voxCookfire() {
  const S = 16, H = 20, { vox, put } = vgrid(S, S, H), c = 7.5;
  for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) { const r = Math.hypot(x - c, y - c); if (r > 4.6 && r < 6.4 && hash2(x, y, 3) > 0.2) put(x, y, Math.round(hash2(x, y, 5)), 3); else if (r < 4.4) put(x, y, 0, 2); }
  for (const [dx, dy] of [[-5, -3], [5, -3], [0, 5]]) for (let z = 0; z < 18; z++) put(c + dx * (1 - z / 18), c + dy * (1 - z / 18), z, 1);
  for (let z = 7; z < 12; z++) for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) if (Math.hypot(x - c, y - c) < 2.8 - (z === 11 ? 0.8 : 0)) put(x, y, z, 1);
  for (let z = 12; z < 17; z++) put(c, c, z, 1);
  return bakeVox(vox, S, S, H, IRON, 3, ELIT.rock);
}
// Floor dressing, walked over (sim world.js FLAT_PROPS): straw, a rug, a fire's scorch, cracked flags, spilled coin,
// papers, a puddle under the drip. Each a voxel thick: depth and story without a thing in the way.
function flatVox(S, ramp, emi, ramp2, fill) { const { vox, put } = vgrid(S, S, 1); for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) { const m = fill(x, y); if (m) put(x, y, 0, m); } return bakeVox(vox, S, S, 1, ramp, emi, ramp2); }
export const voxStraw = (rng) => { const ph = rng() * 9; return flatVox(20, STRAW, 0, STRAW, (x, y) => Math.hypot(x - 9.5, y - 9.5) < 9 + Math.sin(Math.atan2(y - 9.5, x - 9.5) * 5 + ph) * 1.4 && hash2(x, y, 91 + ph) > 0.42 ? (hash2(x, y, 3) > 0.8 ? 3 : 1) : 0); };
export const voxRug = () => flatVox(22, RED, 0, ELIT.wheat, (x, y) => x > 2 && x < 19 && y > 5 && y < 16 ? (x === 3 || x === 18 || y === 6 || y === 15 || (x + y) % 6 === 0 ? 3 : 1) : 0);
export const voxScorch = (rng) => { const ph = rng() * 9; return flatVox(18, ELIT.pit, 0, ELIT.ember, (x, y) => { const r = Math.hypot(x - 8.5, y - 8.5) + Math.sin(Math.atan2(y - 8.5, x - 8.5) * 6 + ph); return r < 7.5 && hash2(x, y, 7 + ph) > r / 9 ? (r < 2.5 ? 3 : 1) : 0; }); };
export const voxCracks = (rng) => { const ph = rng() * 9, S = 22, { vox, put } = vgrid(S, S, 1); for (let k = 0; k < 4; k++) { let x = 11, y = 11, a = ph + k * 1.6; for (let s = 0; s < 14; s++) { put(x, y, 0, 1); a += (hash2(k, s, 33) - 0.5) * 1.2; x += Math.cos(a); y += Math.sin(a); } } return bakeVox(vox, S, S, 1, ELIT.pit, 0); };
export const voxCoins = () => flatVox(14, [[60, 44, 14], [100, 76, 24], [140, 108, 36], [180, 140, 52], [220, 176, 70]], 0, CLAY, (x, y) => (Math.hypot(x - 7, y - 7) < 6 && hash2(x, y, 61) > 0.72 ? 1 : 0));
export const voxPapers = () => flatVox(18, PAPER, 0, PAPER, (x, y) => { for (const [cx, cy, a] of [[6, 7, 0.4], [11, 10, -0.3], [8, 13, 1.1]]) { const u = (x - cx) * Math.cos(a) + (y - cy) * Math.sin(a), v = -(x - cx) * Math.sin(a) + (y - cy) * Math.cos(a); if (Math.abs(u) < 3 && Math.abs(v) < 2) return 1; } return 0; });
export const voxPuddle = (rng) => { const ph = rng() * 9; return flatVox(16, ELIT.tide, 4, ELIT.tide, (x, y) => (Math.hypot(x - 7.5, (y - 7.5) * 1.2) < 6 + Math.sin(Math.atan2(y - 7.5, x - 7.5) * 3 + ph) ? (hash2(x, y, 5) > 0.9 ? 2 : 1) : 0)); };

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
    shrine_mend: [voxShrine(11)], shrine_might: [voxShrine(12)], shrine_ward: [voxShrine(8)],
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
    // (v1.48) the dressing kits' furniture
    spoil: [0, 1].map((v) => voxSpoil(mulberry32((seed * 43 + v * 59 + 19) >>> 0))),
    lantern: [voxLantern()],
    urnshelf: [0, 1].map((v) => voxUrnShelf(mulberry32((seed * 47 + v * 61 + 23) >>> 0))),
    urns: [0, 1].map((v) => voxUrns(mulberry32((seed * 53 + v * 67 + 29) >>> 0))),
    candles: [0, 1].map((v) => voxCandles(mulberry32((seed * 59 + v * 71 + 31) >>> 0))),
    rack: [voxRack()],
    standard: [0, 1].map((v) => voxStandard(mulberry32((seed * 61 + v * 73 + 37) >>> 0))),
    banner: [0, 1].map((v) => voxBanner(mulberry32((seed * 67 + v * 79 + 41) >>> 0))),
    tent: [voxTent()],
    bunk: [voxBunk()],
    scaffold: [voxScaffold()],
    stalagmite: [0, 1, 2].map((v) => voxStalagmite(mulberry32((seed * 71 + v * 83 + 43) >>> 0))),
    boulder: [0, 1].map((v) => voxBoulder(mulberry32((seed * 73 + v * 89 + 47) >>> 0))),
    altar: [voxAltar()],
    saint: [voxSaint()],
    chains: [voxChains()],
    circle: [voxCircle()],
    bound: [0, 1].map((v) => voxBound(mulberry32((seed * 79 + v * 97 + 53) >>> 0))),
    font: [voxFont()],
    boat: [voxBoat()],
    reeds: [0, 1].map((v) => voxReeds(mulberry32((seed * 83 + v * 101 + 59) >>> 0))),
    windlass: [voxWindlass()],
    vat: [voxVat()],
    // (the dressing pass: docs/vale-dungeon-dressing.md) a piece run along a west wall comes as <kind>_y
    urnshelf_y: [0, 1].map((v) => voxUrnShelf(mulberry32((seed * 47 + v * 61 + 23) >>> 0), true)),
    rack_y: [voxRack(true)],
    standard_y: [0, 1].map((v) => voxStandard(mulberry32((seed * 61 + v * 73 + 37) >>> 0), true)),
    banner_y: [0, 1].map((v) => voxBanner(mulberry32((seed * 67 + v * 79 + 41) >>> 0), true)),
    scaffold_y: [voxScaffold(true)],
    stall: [voxStall()], stall_y: [voxStall(true)],
    hay: [0, 1].map((v) => voxHay(mulberry32((seed * 89 + v * 103 + 61) >>> 0))),
    trough: [voxTrough()], trough_y: [voxTrough(true)],
    hen_cart: [voxHenCart()], well: [voxWell()], cart: [voxCart()],
    portcullis: [voxPortcullis()], portcullis_y: [voxPortcullis(true)],
    iron_door: [voxIronDoor()], iron_door_y: [voxIronDoor(true)],
    desk: [voxDesk()], desk_y: [voxDesk(true)],
    shelf: [voxShelf()], shelf_y: [voxShelf(true)],
    pit: [0, 1].map((v) => voxPit(mulberry32((seed * 97 + v * 107 + 67) >>> 0))),
    ladder: [voxLadder()],
    shoring: [voxShoring()], shoring_y: [voxShoring(true)],
    hives: [voxHives()], hives_y: [voxHives(true)],
    bench: [voxBench()], bench_y: [voxBench(true)],
    fallen_door: [voxFallenDoor()], fallen_door_y: [voxFallenDoor(true)],
    shaft: [voxShaft()],
    bars: [voxBars()], bars_y: [voxBars(true)],
    strongbox: [voxStrongbox()], map_table: [voxMapTable()], ledgers: [voxLedgers()], stockade: [voxStockade()],
    guardian: [voxGuardian()], sarcophagus_open: [voxSarcophagusOpen()],
    cask_rack: [voxCaskRack()], cask_rack_y: [voxCaskRack(true)],
    torch: [voxTorch()], candelabra: [voxCandelabra()], cookfire: [voxCookfire()],
    straw: [0, 1].map((v) => voxStraw(mulberry32((seed * 101 + v * 109 + 71) >>> 0))), rug: [voxRug()],
    scorch: [0, 1].map((v) => voxScorch(mulberry32((seed * 103 + v * 113 + 73) >>> 0))),
    cracks: [0, 1].map((v) => voxCracks(mulberry32((seed * 107 + v * 127 + 79) >>> 0))),
    coins: [voxCoins()], papers: [voxPapers()],
    puddle: [0, 1].map((v) => voxPuddle(mulberry32((seed * 109 + v * 131 + 83) >>> 0))),
    block: [newSprite(1, 1)],                                    // (a piece's footprint past its own tile: blocks, draws nothing)
  };
}
// Which prop kinds cast a point light, and the tint they cast.
export const PROP_LIGHT = { stairs: [0.7, 0.5, 1.7], shrine: [0.5, 1.2, 1.9], shrine_mend: [0.5, 1.7, 0.7], shrine_might: [1.9, 0.5, 0.4], shrine_ward: [0.5, 1.2, 1.9], brazier: [1.7, 0.9, 0.35], cage: [0.9, 0.7, 1.9],
  lantern: [1.5, 0.95, 0.4], candles: [1.3, 0.85, 0.4], altar: [1.2, 0.8, 0.4], circle: [1.6, 0.6, 0.2], font: [0.8, 0.5, 1.6], vat: [0.6, 1.3, 0.35],
  torch: [1.7, 0.95, 0.4], candelabra: [1.4, 0.95, 0.55], cookfire: [1.7, 0.85, 0.3], shaft: [1.5, 1.7, 2.1], desk: [1.1, 0.8, 0.4], desk_y: [1.1, 0.8, 0.4], map_table: [1.3, 0.85, 0.4], ledgers: [1.1, 0.8, 0.4] };


