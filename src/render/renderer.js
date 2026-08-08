// renderer.js — isometric canvas renderer (art direction v0.3). The sim doesn't
// know this file exists; swapping it touches nothing in /sim. Flat elevation for
// now (all tiles at h0) — heightAt / cliff faces land in a later pivot step.
// The previous flat top-down renderer is parked in renderer-flat.js for rollback.

import { T, tileType, resourceAt } from '../sim/world.js';
import { drawFloorDiamond } from '../assetforge/tiles.js';
import { drawTree, drawRock, TREE_W, TREE_H, ROCK_W, ROCK_H } from '../assetforge/props.js';
import { drawDollDetailed, DETAIL_W, DETAIL_H } from '../assetforge/doll.js';
import { EMBERWOOD, LIGHT, INK } from './palette.js';
import { hash2 } from '../sim/rng.js';
import { TW, TH, HW, ZH, project, unproject, resolveTap } from './iso.js';

const PROP_VARIANTS = 8;
const FLOOR_VARIANTS = 6;
const TREE_AX = 8, TREE_AY = 25;    // sprite ground anchors
const ROCK_AX = 8, ROCK_AY = 13;
const DOLL_AX = 12, DOLL_AY = 34;   // feet within the 24×36 sprite

export function createRenderer(canvas, sim, input) {
  const ctx = canvas.getContext('2d');
  const pal = EMBERWOOD;
  let S = 3, vw = 0, vh = 0;

  function resize() {
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    vw = Math.floor(window.innerWidth * dpr);
    vh = Math.floor(window.innerHeight * dpr);
    canvas.width = vw; canvas.height = vh;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    S = Math.max(2, Math.round(vw / (18 * TW)));   // ~18 tiles across, integer scale
    ctx.imageSmoothingEnabled = false;
  }
  window.addEventListener('resize', resize);
  resize();

  // ---- baked floor diamonds: floorCache[material][parity][variant] (unlit) ----
  const floorCache = {};
  (function bakeFloors() {
    const seed = sim.world.ws;
    for (const [mat, ramp] of [['grass', pal.GRASS], ['dirt', pal.DIRT], ['water', pal.WATER]]) {
      floorCache[mat] = [[], []];
      for (let parity = 0; parity < 2; parity++) for (let v = 0; v < FLOOR_VARIANTS; v++) {
        const cv = document.createElement('canvas'); cv.width = TW; cv.height = TH;
        drawFloorDiamond(cv.getContext('2d'), 0, 0, ramp, parity, (seed ^ (v * 131 + mat.length * 7)) >>> 0);
        floorCache[mat][parity].push(cv);
      }
    }
  })();

  // ---- prop sprite variants (baked once) ----
  const treeCache = [], rockCache = [];
  for (let i = 0; i < PROP_VARIANTS; i++) {
    const t = document.createElement('canvas'); t.width = TREE_W; t.height = TREE_H;
    drawTree(t.getContext('2d'), pal, i * 7, i * 13, sim.world.ws); treeCache.push(t);
    const r = document.createElement('canvas'); r.width = ROCK_W; r.height = ROCK_H;
    drawRock(r.getContext('2d'), pal, i * 11, i * 5, sim.world.ws); rockCache.push(r);
  }

  // ---- player doll frames (detailed 24×36, baked from the hero recipe) ----
  const dollCache = new Map();
  let heroRecipe = null;
  function setHero(recipe) { heroRecipe = recipe; dollCache.clear(); }
  function dollFrame(frame, mirror) {
    const key = frame + '|' + mirror;
    let cv = dollCache.get(key);
    if (!cv) {
      cv = document.createElement('canvas'); cv.width = DETAIL_W; cv.height = DETAIL_H;
      drawDollDetailed(cv.getContext('2d'), heroRecipe, frame, mirror);
      dollCache.set(key, cv);
    }
    return cv;
  }

  // ---- hit flash ----
  let flash = null;
  sim.bus.on('hit', ({ tx, ty }) => { flash = { tx, ty, until: performance.now() + 90 }; });

  function render(alpha, now) {
    const p = sim.state.player;
    const ix = p.px + (p.x - p.px) * alpha;
    const iy = p.py + (p.y - p.py) * alpha;
    const pc = project(ix, iy, 0);
    const originX = Math.round(vw / 2 - pc.sx * S);
    const originY = Math.round(vh * 0.56 - pc.sy * S);
    const toScreen = (wx, wy, h) => { const q = project(wx, wy, h || 0); return { x: originX + q.sx * S, y: originY + q.sy * S }; };

    ctx.fillStyle = INK;
    ctx.fillRect(0, 0, vw, vh);

    // visible tile AABB by unprojecting the four screen corners (flat, h0)
    const seed = sim.world.ws;
    let minX = 1e9, minY = 1e9, maxX = -1e9, maxY = -1e9;
    for (const [sx, sy] of [[0, 0], [vw, 0], [0, vh], [vw, vh]]) {
      const w = unproject((sx - originX) / S, (sy - originY) / S, 0);
      minX = Math.min(minX, w.x); maxX = Math.max(maxX, w.x);
      minY = Math.min(minY, w.y); maxY = Math.max(maxY, w.y);
    }
    minX = Math.floor(minX) - 1; minY = Math.floor(minY) - 1;
    maxX = Math.ceil(maxX) + 1; maxY = Math.ceil(maxY) + 1;

    // floors
    const TWs = TW * S, THs = TH * S;
    for (let ty = minY; ty <= maxY; ty++) for (let tx = minX; tx <= maxX; tx++) {
      const s = toScreen(tx, ty, 0);
      if (s.x < -TWs || s.x > vw + TWs || s.y < -THs || s.y > vh + THs) continue;   // rhombus cull
      const t = tileType(sim.world, tx, ty);
      const mat = t === T.WATER ? 'water' : t === T.DIRT ? 'dirt' : 'grass';
      const parity = (tx + ty) & 1;
      const v = (hash2(tx, ty, seed) * FLOOR_VARIANTS) | 0;
      ctx.drawImage(floorCache[mat][parity][v], Math.round(s.x - HW * S), Math.round(s.y), TWs, THs);
    }

    // props + player, depth-sorted by (x + y)
    const drawables = [];
    for (let ty = minY; ty <= maxY; ty++) for (let tx = minX; tx <= maxX; tx++) {
      const kind = resourceAt(sim.world, tx, ty);
      if (!kind) continue;
      drawables.push({ d: tx + ty, kind, tx, ty, v: (hash2(tx, ty, 7777) * PROP_VARIANTS) | 0 });
    }
    drawables.push({ d: ix + iy + 0.01, kind: 'player' });
    drawables.sort((a, b) => a.d - b.d);

    const flashing = flash && now < flash.until ? flash : null;
    for (const dr of drawables) {
      if (dr.kind === 'player') {
        const g = toScreen(ix, iy, 0);
        ctx.fillStyle = 'rgba(8,6,12,0.30)';                 // ground shadow
        for (let r = -2; r <= 2; r++) {
          const ww = Math.max(0, Math.round(6 * (1 - Math.abs(r) / 3))) * S;
          ctx.fillRect(Math.round(g.x - ww), Math.round(g.y + (r + 1) * S), ww * 2, S);
        }
        const cv = dollFrame(p.moving ? p.frame : 0, p.mirror);
        ctx.drawImage(cv, Math.round(g.x - DOLL_AX * S), Math.round(g.y - DOLL_AY * S), DETAIL_W * S, DETAIL_H * S);
        continue;
      }
      const isTree = dr.kind === 'tree';
      const cv = isTree ? treeCache[dr.v] : rockCache[dr.v];
      const w = isTree ? TREE_W : ROCK_W, h = isTree ? TREE_H : ROCK_H;
      const ax = isTree ? TREE_AX : ROCK_AX, ay = isTree ? TREE_AY : ROCK_AY;
      const g = toScreen(dr.tx + 0.5, dr.ty + 0.5, 0);
      const jx = flashing && flashing.tx === dr.tx && flashing.ty === dr.ty ? (hash2((now / 40) | 0, dr.tx, dr.ty) < 0.5 ? -1 : 1) * S : 0;
      ctx.drawImage(cv, Math.round(g.x - ax * S) + jx, Math.round(g.y - ay * S), w * S, h * S);
    }

    // torch light: dark veil with a warm hole punched at the player (unchanged model)
    const g = toScreen(ix, iy, 0);
    const light = document.__ehLight || (document.__ehLight = document.createElement('canvas'));
    if (light.width !== vw || light.height !== vh) { light.width = vw; light.height = vh; }
    const lc = light.getContext('2d');
    lc.globalCompositeOperation = 'source-over';
    lc.fillStyle = LIGHT.ambient;
    lc.fillRect(0, 0, vw, vh);
    const pxx = g.x, pyy = g.y - 14 * S;
    const flick = 1 + (hash2((now / 90) | 0, 3, 9) - 0.5) * LIGHT.flicker;
    const rad = LIGHT.torchRadius * TW * S * flick;
    const grad = lc.createRadialGradient(pxx, pyy, rad * 0.2, pxx, pyy, rad);
    grad.addColorStop(0, 'rgba(0,0,0,1)');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    lc.globalCompositeOperation = 'destination-out';
    lc.fillStyle = grad;
    lc.beginPath(); lc.arc(pxx, pyy, rad, 0, Math.PI * 2); lc.fill();
    ctx.drawImage(light, 0, 0);
    const wg = ctx.createRadialGradient(pxx, pyy, 0, pxx, pyy, rad * 0.6);
    wg.addColorStop(0, LIGHT.torchInner);
    wg.addColorStop(1, 'rgba(255,176,102,0)');
    ctx.fillStyle = wg;
    ctx.beginPath(); ctx.arc(pxx, pyy, rad * 0.6, 0, Math.PI * 2); ctx.fill();

    // joystick
    const j = input.joystick();
    if (j) {
      const k = vw / window.innerWidth;
      ctx.strokeStyle = 'rgba(232,228,218,0.25)';
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(j.bx, j.by, 46 * k, 0, Math.PI * 2); ctx.stroke();
      ctx.fillStyle = 'rgba(255,148,64,0.5)';
      ctx.beginPath(); ctx.arc(j.kx, j.ky, 18 * k, 0, Math.PI * 2); ctx.fill();
    }
  }

  return {
    render, setHero, resize,
    // Screen (CSS px) → tile, via iso inverse at flat height with fat-finger snap.
    screenToTile(sxPx, syPx, alpha) {
      const p = sim.state.player;
      const ix = p.px + (p.x - p.px) * alpha, iy = p.py + (p.y - p.py) * alpha;
      const pc = project(ix, iy, 0);
      const originX = Math.round(vw / 2 - pc.sx * S), originY = Math.round(vh * 0.56 - pc.sy * S);
      const dpr = vw / window.innerWidth;
      return resolveTap((sxPx * dpr - originX) / S, (syPx * dpr - originY) / S, {
        heightAt: () => 0,                                   // flat for now
        hasResource: (tx, ty) => !!resourceAt(sim.world, tx, ty),
      });
    },
  };
}
