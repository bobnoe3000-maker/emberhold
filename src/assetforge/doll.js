// doll.js — paper-doll settlers. Recipe → deterministic sprite.
// Same models as Assetforge v0: SOCKETS contract, WALK anim as data, outline post-pass.

import { INK, SKINS, HAIRC, CLOTH, LEATHER, WOODC, METAL } from '../render/palette.js';

export const DOLL_W = 16, DOLL_H = 20;

export const SOCKETS = {
  down: { head: { x: 8, y: 2 }, handL: { x: 4, y: 12 }, handR: { x: 11, y: 12 }, back: { x: 8, y: 10 } },
  up:   { head: { x: 8, y: 2 }, handL: { x: 11, y: 12 }, handR: { x: 4, y: 12 }, back: { x: 8, y: 9 } },
  side: { head: { x: 8, y: 2 }, handL: { x: 7, y: 12 },  handR: { x: 9, y: 12 }, back: { x: 6, y: 10 } },
};

export const WALK = {
  fps: 8,
  frames: [
    { bob: 0,  legL: -1, legR: 0,  armL: 1,  armR: -1, stride: 1 },
    { bob: -1, legL: 0,  legR: 0,  armL: 0,  armR: 0,  stride: 0 },
    { bob: 0,  legL: 0,  legR: -1, armL: -1, armR: 1,  stride: -1 },
    { bob: -1, legL: 0,  legR: 0,  armL: 0,  armR: 0,  stride: 0 },
  ],
};
export const IDLE = { fps: 8, frames: [{ bob: 0, legL: 0, legR: 0, armL: 0, armR: 0, stride: 0 }] };

export const HAIR_STYLES = ['bald', 'short', 'spiky', 'long', 'bun', 'hood'];
export const OUTFITS = ['tunic', 'apron', 'vest', 'robe', 'guard'];
export const TOOLS = ['pick', 'hoe', 'hammer'];

export function rollRecipe(rng) {
  return {
    skin: (rng() * SKINS.length) | 0,
    hair: { style: HAIR_STYLES[(rng() * HAIR_STYLES.length) | 0], color: HAIRC[(rng() * HAIRC.length) | 0] },
    outfit: OUTFITS[(rng() * OUTFITS.length) | 0],
    c1: CLOTH[(rng() * CLOTH.length) | 0],
    c2: CLOTH[(rng() * CLOTH.length) | 0],
    tier: 'T' + (1 + ((rng() * 4) | 0)),
    tool: rng() < 0.35 ? TOOLS[(rng() * TOOLS.length) | 0] : null,
  };
}

function shade(hex) {
  const n = parseInt(hex.slice(1), 16);
  const d = (v) => Math.max(0, v - 36);
  return '#' + ((d(n >> 16) << 16) | (d((n >> 8) & 255) << 8) | d(n & 255)).toString(16).padStart(6, '0');
}

export function outlineBuffer(ctx, w, h) {
  const img = ctx.getImageData(0, 0, w, h), d = img.data;
  const filled = (x, y) => x >= 0 && y >= 0 && x < w && y < h && d[(y * w + x) * 4 + 3] > 0;
  const marks = [];
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    if (d[(y * w + x) * 4 + 3] === 0 &&
        (filled(x - 1, y) || filled(x + 1, y) || filled(x, y - 1) || filled(x, y + 1))) marks.push([x, y]);
  }
  ctx.fillStyle = INK;
  for (const [x, y] of marks) ctx.fillRect(x, y, 1, 1);
}

export function drawDoll(ctx, R, dir, anim, f, mirror) {
  ctx.clearRect(0, 0, DOLL_W, DOLL_H);
  const A = anim.frames[f % anim.frames.length];
  const skin = SKINS[R.skin], hairC = R.hair.color;
  const robe = R.outfit === 'robe';
  const guard = R.outfit === 'guard';
  const bodyC = guard ? METAL[R.tier][1] : R.c1;
  const trimC = guard ? METAL[R.tier][0] : (R.outfit === 'apron' ? '#d8ccb4' : R.c2);
  const legC = robe ? R.c1 : (guard ? '#3c3c4c' : R.c2);
  const px = (x, y, c) => {
    if (y < 0 || y > DOLL_H - 1) return;
    ctx.fillStyle = c;
    ctx.fillRect(mirror ? DOLL_W - 1 - x : x, y, 1, 1);
  };
  const rect = (x0, y0, x1, y1, c) => { for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) px(x, y, c); };
  const bob = A.bob;
  const side = dir === 'side';

  // legs & boots
  const sL = side ? A.stride : 0, sR = side ? -A.stride : 0;
  const drawLeg = (x0, lift, sh) => {
    const bootY = 18 + lift;
    rect(x0 + sh, 15, x0 + 1 + sh, bootY - 1, legC);
    rect(x0 + sh, bootY, x0 + 1 + sh, bootY, LEATHER);
  };
  drawLeg(6, A.legL, sL);
  drawLeg(8, A.legR, sR);

  // torso
  const bodyBot = robe ? 17 : 14;
  rect(5, 9 + bob, 10, bodyBot + (robe ? 0 : bob), bodyC);
  if (robe) rect(5, 17, 10, 17, trimC);
  else if (R.outfit === 'tunic') rect(5, 13 + bob, 10, 13 + bob, LEATHER);
  else if (R.outfit === 'apron') rect(6, 10 + bob, 9, 14 + bob, trimC);
  else if (R.outfit === 'vest') { rect(5, 9 + bob, 5, 14 + bob, R.c2); rect(10, 9 + bob, 10, 14 + bob, R.c2); }
  else if (guard) rect(5, 9 + bob, 10, 9 + bob, trimC);
  rect(10, 10 + bob, 10, bodyBot - 1 + (robe ? 0 : bob), shade(bodyC));

  // arms
  const arm = (x, off) => {
    rect(x, 10 + bob + off, x, 11 + bob + off, guard ? METAL[R.tier][2] : bodyC);
    rect(x, 12 + bob + off, x, 13 + bob + off, skin[1]);
  };
  if (side) arm(9 + A.stride, A.armR);
  else { arm(4, A.armL); arm(11, A.armR); }

  // head
  rect(5, 3 + bob, 10, 8 + bob, skin[1]);
  rect(5, 8 + bob, 10, 8 + bob, skin[2]);
  rect(5, 3 + bob, 10, 3 + bob, skin[0]);
  if (dir === 'down') { px(6, 6 + bob, INK); px(9, 6 + bob, INK); }
  if (side) { px(9, 6 + bob, INK); px(11, 6 + bob, skin[1]); px(11, 7 + bob, skin[2]); }

  // hair
  drawHair(R.hair.style, dir, bob, hairC, skin, px, rect);

  // tool at handR socket
  if (R.tool && dir !== 'up') drawTool(R.tool, METAL[R.tier], SOCKETS[side ? 'side' : dir].handR, bob + A.armR, px);

  outlineBuffer(ctx, DOLL_W, DOLL_H);
}

function drawHair(style, dir, bob, c, skin, px, rect) {
  const dark = shade(c);
  const back = dir === 'up';
  if (style === 'bald') {
    if (!back) rect(5, 2 + bob, 10, 2 + bob, skin[0]);
    else rect(5, 2 + bob, 10, 5 + bob, skin[1]);
    return;
  }
  rect(5, 1 + bob, 10, 2 + bob, c);
  px(5, 3 + bob, c); px(10, 3 + bob, dark);
  if (back) rect(5, 3 + bob, 10, 6 + bob, c);
  if (style === 'spiky') { px(5, 0 + bob, c); px(7, 0 + bob, c); px(9, 0 + bob, c); }
  if (style === 'bun') { px(7, 0 + bob, c); px(8, 0 + bob, dark); }
  if (style === 'long') {
    rect(4, 2 + bob, 4, 8 + bob, c); rect(11, 2 + bob, 11, 8 + bob, dark);
    if (back) rect(5, 3 + bob, 10, 9 + bob, c);
  }
  if (style === 'hood') {
    rect(4, 0 + bob, 11, 2 + bob, c);
    rect(4, 3 + bob, 4, 8 + bob, c); rect(11, 3 + bob, 11, 8 + bob, dark);
    px(5, 3 + bob, dark); px(10, 3 + bob, dark);
    if (back) rect(5, 3 + bob, 10, 8 + bob, c);
  }
}

function drawTool(kind, ramp, sock, yOff, px) {
  const x = sock.x + 1, y = sock.y + yOff;
  for (let i = 0; i < 4; i++) px(x, y + 3 - i, i % 2 ? WOODC[0] : WOODC[1]);
  if (kind === 'pick') { px(x - 1, y - 2, ramp[1]); px(x, y - 2, ramp[0]); px(x + 1, y - 2, ramp[1]); px(x - 1, y - 1, ramp[2]); px(x + 1, y - 1, ramp[2]); }
  if (kind === 'hoe') { px(x, y - 2, ramp[0]); px(x + 1, y - 2, ramp[1]); px(x + 1, y - 1, ramp[2]); }
  if (kind === 'hammer') { px(x - 1, y - 2, ramp[1]); px(x, y - 2, ramp[0]); px(x - 1, y - 1, ramp[2]); px(x, y - 1, ramp[2]); }
}

// ---- detailed doll (24×36) — the iso art direction (v0.3). Larger + more
// detail than the 16×20 above, decoupled from tile scale so characters keep
// presence. Front-facing billboard with a walk bob + left mirror; drawn unlit
// (lighting is a composite-time overlay). Same recipe tokens as rollRecipe().
export const DETAIL_W = 24, DETAIL_H = 36;
const BUCKLE = '#c9a14e';
function lighten(hex, amt) {
  const n = parseInt(hex.slice(1), 16), u = (v) => Math.min(255, v + amt);
  return '#' + ((u(n >> 16) << 16) | (u((n >> 8) & 255) << 8) | u(n & 255)).toString(16).padStart(6, '0');
}
export function drawDollDetailed(ctx, R, frame, mirror) {
  ctx.clearRect(0, 0, DETAIL_W, DETAIL_H);
  const b = [0, -1, 0, -1][frame & 3];          // walk bob on the upper body
  const skin = SKINS[R.skin] || SKINS[0];
  const hairC = (R.hair && R.hair.color) || HAIRC[0];
  const style = (R.hair && R.hair.style) || 'short';
  const body = R.c1 || CLOTH[0], bodyD = shade(body), bodyL = lighten(body, 26);
  const pants = R.c2 || CLOTH[1], pantsD = shade(pants);
  const hairD = shade(hairC), hairL = lighten(hairC, 26);
  const hood = style === 'hood', bald = style === 'bald';
  const px = (x, y, c) => { if (y < 0 || y > DETAIL_H - 1) return; ctx.fillStyle = c; ctx.fillRect(mirror ? DETAIL_W - 1 - x : x, y, 1, 1); };
  const rect = (x0, y0, x1, y1, c) => { for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) px(x, y, c); };
  // legs + boots (not bobbed)
  rect(8, 25, 10, 31, pants); rect(13, 25, 15, 31, pants);
  rect(8, 25, 8, 31, pantsD); rect(15, 25, 15, 31, pantsD); rect(11, 25, 12, 31, pantsD);
  rect(8, 32, 10, 34, LEATHER); rect(13, 32, 15, 34, LEATHER); px(7, 34, LEATHER); px(16, 34, LEATHER);
  px(8, 32, lighten(LEATHER, 22)); px(13, 32, lighten(LEATHER, 22));
  // torso
  rect(6, 14 + b, 17, 24 + b, body); rect(6, 14 + b, 7, 24 + b, bodyL); rect(16, 14 + b, 17, 24 + b, bodyD); rect(6, 14 + b, 17, 14 + b, bodyL);
  rect(10, 13 + b, 13, 13 + b, bodyD); rect(11, 15 + b, 11, 21 + b, bodyD);
  rect(6, 22 + b, 17, 22 + b, LEATHER); px(11, 22 + b, BUCKLE); px(12, 22 + b, BUCKLE);
  rect(6, 24 + b, 17, 24 + b, bodyD);
  // arms
  rect(4, 15 + b, 5, 20 + b, body); rect(4, 15 + b, 4, 20 + b, bodyL); rect(4, 21 + b, 5, 23 + b, skin[1]); px(4, 23 + b, skin[2]);
  rect(18, 15 + b, 19, 20 + b, bodyD); rect(18, 21 + b, 19, 23 + b, skin[1]); px(19, 23 + b, skin[2]);
  // neck + head
  rect(11, 12 + b, 12, 12 + b, skin[2]);
  rect(9, 4 + b, 14, 4 + b, skin[1]); rect(8, 5 + b, 15, 10 + b, skin[1]); rect(9, 11 + b, 14, 11 + b, skin[1]);
  rect(8, 5 + b, 8, 10 + b, skin[0]); px(9, 4 + b, skin[0]);
  rect(15, 5 + b, 15, 10 + b, skin[2]); px(14, 11 + b, skin[2]); rect(9, 11 + b, 14, 11 + b, skin[2]);
  px(10, 7 + b, INK); px(13, 7 + b, INK); px(11, 8 + b, skin[2]); px(12, 8 + b, skin[2]); px(11, 10 + b, skin[2]); px(12, 10 + b, skin[2]);
  // hair / hood
  if (hood) {
    rect(7, 1 + b, 16, 3 + b, body); rect(7, 3 + b, 8, 10 + b, body); rect(15, 3 + b, 16, 10 + b, bodyD); rect(8, 1 + b, 12, 1 + b, bodyL); rect(9, 4 + b, 14, 5 + b, bodyD);
  } else if (!bald) {
    rect(9, 1 + b, 14, 1 + b, hairC); rect(8, 2 + b, 15, 3 + b, hairC); rect(9, 4 + b, 14, 4 + b, hairC);
    rect(8, 4 + b, 8, 6 + b, hairC); rect(15, 4 + b, 15, 6 + b, hairD);
    rect(9, 1 + b, 12, 1 + b, hairL); px(14, 2 + b, hairD); px(15, 3 + b, hairD);
    if (style === 'long') { rect(8, 7 + b, 8, 10 + b, hairC); rect(15, 7 + b, 15, 10 + b, hairD); }
  }
  outlineBuffer(ctx, DETAIL_W, DETAIL_H);
}
