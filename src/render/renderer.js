// renderer.js — lean canvas renderer. The sim doesn't know this file exists.
// Chunks bake once to offscreen canvases (512px), rebake only on modification.
// Swapping this layer for Phaser later touches nothing in /sim.

import { CHUNK, TILE, T, tileType, resourceAt, neighborMask, chunkOf } from '../sim/world.js';
import { drawBlobTile, drawWaterTile } from '../assetforge/tiles.js';
import { drawTree, drawRock, TREE_W, TREE_H, ROCK_W, ROCK_H } from '../assetforge/props.js';
import { drawDoll, WALK, IDLE, DOLL_W, DOLL_H } from '../assetforge/doll.js';
import { EMBERWOOD, LIGHT, INK } from './palette.js';
import { hash2 } from '../sim/rng.js';

const CHUNK_PX = CHUNK * TILE;
const MAX_CACHED_CHUNKS = 24;
const PROP_VARIANTS = 8;          // pre-baked sprite variants per prop kind

export function createRenderer(canvas, sim, input) {
  const ctx = canvas.getContext('2d');
  const pal = EMBERWOOD;
  let scale = 3, vw = 0, vh = 0;

  function resize() {
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    vw = Math.floor(window.innerWidth * dpr);
    vh = Math.floor(window.innerHeight * dpr);
    canvas.width = vw; canvas.height = vh;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    // aim for ~9 tiles across in portrait, integer scale
    scale = Math.max(2, Math.round(vw / (9.5 * TILE)));
    ctx.imageSmoothingEnabled = false;
  }
  window.addEventListener('resize', resize);
  resize();

  // ---- chunk cache ----
  const chunks = new Map();       // "cx,cy" -> { cv, at }
  function bakeChunk(cx, cy) {
    const cv = document.createElement('canvas');
    cv.width = CHUNK_PX; cv.height = CHUNK_PX;
    const c = cv.getContext('2d');
    const world = sim.world, seed = world.ws;
    for (let ty = 0; ty < CHUNK; ty++) for (let tx = 0; tx < CHUNK; tx++) {
      const wx = cx * CHUNK + tx, wy = cy * CHUNK + ty;
      const t = tileType(world, wx, wy);
      drawWaterTile(c, tx * TILE, ty * TILE, wx, wy, pal.WATER, seed);
      if (t >= T.DIRT)
        drawBlobTile(c, tx * TILE, ty * TILE, wx, wy,
          neighborMask(world, wx, wy, (v) => v >= T.DIRT), pal.DIRT, pal.WATER, seed);
      if (t === T.GRASS)
        drawBlobTile(c, tx * TILE, ty * TILE, wx, wy,
          neighborMask(world, wx, wy, (v) => v === T.GRASS), pal.GRASS, pal.DIRT, seed);
    }
    // decor pass (interior grass only)
    for (let ty = 0; ty < CHUNK; ty++) for (let tx = 0; tx < CHUNK; tx++) {
      const wx = cx * CHUNK + tx, wy = cy * CHUNK + ty;
      if (tileType(world, wx, wy) !== T.GRASS) continue;
      if (neighborMask(world, wx, wy, (v) => v === T.GRASS) !== 255) continue;
      const r = hash2(wx, wy, seed + 1234);
      if (r > 0.30) continue;
      const dx = 4 + Math.floor(hash2(wx, wy, seed + 55) * 8);
      const dy = 4 + Math.floor(hash2(wx, wy, seed + 66) * 8);
      const px = (ox, oy, col) => { c.fillStyle = col; c.fillRect(tx * TILE + dx + ox, ty * TILE + dy + oy, 1, 1); };
      if (r < 0.07) { px(0, 0, pal.ACCENT); px(1, 0, pal.ACCENT2); px(0, 1, pal.GRASS[3]); }
      else if (r < 0.20) { px(0, 0, pal.GRASS[0]); px(2, 1, pal.GRASS[0]); px(1, -1, pal.GRASS[0]); }
      else { px(0, 0, pal.DIRT[1]); px(1, 0, pal.DIRT[2]); }
    }
    return cv;
  }
  function getChunk(cx, cy) {
    const key = cx + ',' + cy;
    let e = chunks.get(key);
    if (!e) {
      e = { cv: bakeChunk(cx, cy), at: 0 };
      chunks.set(key, e);
      if (chunks.size > MAX_CACHED_CHUNKS) {          // LRU evict
        let oldK = null, oldAt = Infinity;
        for (const [k, v] of chunks) if (v.at < oldAt) { oldAt = v.at; oldK = k; }
        chunks.delete(oldK);
      }
    }
    e.at = performance.now();
    return e.cv;
  }
  sim.bus.on('harvested', ({ tx, ty }) => {
    chunks.delete(chunkOf(tx) + ',' + chunkOf(ty));   // rebake on next draw
  });

  // ---- prop sprite variants (baked once) ----
  const treeCache = [], rockCache = [];
  for (let i = 0; i < PROP_VARIANTS; i++) {
    const tcv = document.createElement('canvas'); tcv.width = TREE_W; tcv.height = TREE_H;
    drawTree(tcv.getContext('2d'), pal, i * 7, i * 13, sim.world.ws);
    treeCache.push(tcv);
    const rcv = document.createElement('canvas'); rcv.width = ROCK_W; rcv.height = ROCK_H;
    drawRock(rcv.getContext('2d'), pal, i * 11, i * 5, sim.world.ws);
    rockCache.push(rcv);
  }

  // ---- player doll frames (baked once from the hero recipe) ----
  const dollCache = new Map();    // "dir|frame|mirror|moving" -> canvas
  function dollFrame(recipe, dir, frame, mirror, moving) {
    const key = dir + '|' + frame + '|' + mirror + '|' + moving;
    let cv = dollCache.get(key);
    if (!cv) {
      cv = document.createElement('canvas');
      cv.width = DOLL_W; cv.height = DOLL_H;
      drawDoll(cv.getContext('2d'), recipe, dir, moving ? WALK : IDLE, frame, mirror);
      dollCache.set(key, cv);
    }
    return cv;
  }

  let heroRecipe = null;
  function setHero(recipe) { heroRecipe = recipe; dollCache.clear(); }

  // ---- hit flash ----
  let flash = null;               // { tx, ty, until }
  sim.bus.on('hit', ({ tx, ty }) => { flash = { tx, ty, until: performance.now() + 90 }; });

  function render(alpha, now) {
    const p = sim.state.player;
    const ix = p.px + (p.x - p.px) * alpha;
    const iy = p.py + (p.y - p.py) * alpha;
    const s = TILE * scale;
    // camera: player slightly below vertical center (see ahead when moving up)
    const camX = ix * s - vw / 2;
    const camY = iy * s - vh * 0.56;

    ctx.fillStyle = INK;
    ctx.fillRect(0, 0, vw, vh);

    // visible chunk window
    const cx0 = Math.floor(camX / (CHUNK_PX * scale)), cy0 = Math.floor(camY / (CHUNK_PX * scale));
    const cx1 = Math.floor((camX + vw) / (CHUNK_PX * scale)), cy1 = Math.floor((camY + vh) / (CHUNK_PX * scale));
    for (let cy = cy0; cy <= cy1; cy++) for (let cx = cx0; cx <= cx1; cx++) {
      ctx.drawImage(getChunk(cx, cy),
        Math.round(cx * CHUNK_PX * scale - camX), Math.round(cy * CHUNK_PX * scale - camY),
        CHUNK_PX * scale, CHUNK_PX * scale);
    }

    // props + player, y-sorted
    const tx0 = Math.floor(camX / s) - 1, ty0 = Math.floor(camY / s) - 2;
    const tx1 = Math.floor((camX + vw) / s) + 1, ty1 = Math.floor((camY + vh) / s) + 1;
    const drawables = [];
    for (let ty = ty0; ty <= ty1; ty++) for (let tx = tx0; tx <= tx1; tx++) {
      const kind = resourceAt(sim.world, tx, ty);
      if (!kind) continue;
      const v = Math.floor(hash2(tx, ty, 7777) * PROP_VARIANTS);
      drawables.push({ y: ty + 1, kind, tx, ty, v });
    }
    drawables.push({ y: iy + 0.2, kind: 'player' });
    drawables.sort((a, b) => a.y - b.y);

    const flashing = flash && now < flash.until ? flash : null;
    for (const d of drawables) {
      if (d.kind === 'player') {
        const cv = dollFrame(heroRecipe, p.dir === 'side' ? 'side' : p.dir, p.frame, p.mirror, p.moving);
        ctx.drawImage(cv,
          Math.round(ix * s - camX) - (DOLL_W / 2) * scale,
          Math.round(iy * s - camY) - (DOLL_H - 2) * scale,   // feet anchored at player pos
          DOLL_W * scale, DOLL_H * scale);
        continue;
      }
      const isTree = d.kind === 'tree';
      const cv = isTree ? treeCache[d.v] : rockCache[d.v];
      const w = isTree ? TREE_W : ROCK_W, h = isTree ? TREE_H : ROCK_H;
      const jx = flashing && flashing.tx === d.tx && flashing.ty === d.ty ? (Math.random() < 0.5 ? -1 : 1) * scale : 0;
      ctx.drawImage(cv,
        Math.round(d.tx * s - camX) + jx,
        Math.round((d.ty + 1) * s - h * scale - camY),
        w * scale, h * scale);
    }

    // torch light: dark veil with a warm hole punched at the player
    const light = document.__lightCv || (document.__lightCv = document.createElement('canvas'));
    if (light.width !== vw || light.height !== vh) { light.width = vw; light.height = vh; }
    const lc = light.getContext('2d');
    lc.globalCompositeOperation = 'source-over';
    lc.fillStyle = LIGHT.ambient;
    lc.fillRect(0, 0, vw, vh);
    const pxx = ix * s - camX, pyy = iy * s - camY - 6 * scale;
    const flick = 1 + (hash2((now / 90) | 0, 3, 9) - 0.5) * LIGHT.flicker;
    const rad = LIGHT.torchRadius * s * flick;
    const grad = lc.createRadialGradient(pxx, pyy, rad * 0.2, pxx, pyy, rad);
    grad.addColorStop(0, 'rgba(0,0,0,1)');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    lc.globalCompositeOperation = 'destination-out';
    lc.fillStyle = grad;
    lc.beginPath(); lc.arc(pxx, pyy, rad, 0, Math.PI * 2); lc.fill();
    ctx.drawImage(light, 0, 0);
    // warm inner glow
    const wg = ctx.createRadialGradient(pxx, pyy, 0, pxx, pyy, rad * 0.6);
    wg.addColorStop(0, LIGHT.torchInner);
    wg.addColorStop(1, 'rgba(255,176,102,0)');
    ctx.fillStyle = wg;
    ctx.beginPath(); ctx.arc(pxx, pyy, rad * 0.6, 0, Math.PI * 2); ctx.fill();

    // joystick
    const j = input.joystick();
    if (j) {
      ctx.strokeStyle = 'rgba(232,228,218,0.25)';
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(j.bx, j.by, 46 * (vw / window.innerWidth), 0, Math.PI * 2); ctx.stroke();
      ctx.fillStyle = 'rgba(255,148,64,0.5)';
      ctx.beginPath(); ctx.arc(j.kx, j.ky, 18 * (vw / window.innerWidth), 0, Math.PI * 2); ctx.fill();
    }
  }

  return {
    render, setHero, resize,
    screenToTile(sxPx, syPx, alpha) {
      const p = sim.state.player;
      const ix = p.px + (p.x - p.px) * alpha, iy = p.py + (p.y - p.py) * alpha;
      const s = TILE * scale;
      const dpr = vw / window.innerWidth;
      const wx = (sxPx * dpr + ix * s - vw / 2) / s;
      const wy = (syPx * dpr + iy * s - vh * 0.56) / s;
      return { tx: Math.floor(wx), ty: Math.floor(wy) };
    },
  };
}
