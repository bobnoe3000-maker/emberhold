// renderer.js — Dreadforge isometric renderer (art direction v0.4). The sim
// doesn't know this file exists. Terrain (materials + elevation + cliff faces) is
// painted at NATIVE resolution into a MARGIN-CACHED buffer — baked once and re-
// blitted per frame, re-baked only when the camera crosses the margin — then
// integer-scaled to the display (the crisp path). Dynamic actors, glow pulse,
// torch, and fog composite on top each frame.

import { materialAt, heightAt, resourceAt, propAt, creatureAt } from '../sim/world.js';
import { DREAD, DGLOW, INK_RGB } from './palette.js';
import { drawDollDetailed, DETAIL_W, DETAIL_H } from '../assetforge/doll.js';
import { buildSpire, buildMonolith, buildEyeTotem } from '../assetforge/voxprops.js';
import { STAIN } from '../assetforge/stain.js';
import { hash2, fbm } from '../sim/rng.js';
import { TW, TH, HW, HH, ZH, ROWW, project, unproject, resolveTap } from './iso.js';

const clampf = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);

const DOLL_AX = 12, DOLL_AY = 34;
const MARGIN = 64;                 // native-px slack before a re-bake
const BAYER = [[0, 8, 2, 10], [12, 4, 14, 6], [3, 11, 1, 9], [15, 7, 13, 5]];

// Master-ramp quantization (TDD §8.4): map the warm paper-doll into the cold
// world by snapping every pixel to the nearest Dreadforge material color.
const QUANT = DREAD.soil.concat(DREAD.bone, DREAD.flesh, DREAD.obsid);
function quantizeToRamps(c, w, h) {
  const id = c.getImageData(0, 0, w, h), d = id.data;
  for (let i = 0; i < d.length; i += 4) {
    if (d[i + 3] === 0) continue;
    const r = d[i], g = d[i + 1], b = d[i + 2];
    let bj = 0, bd = 1e18;
    for (let j = 0; j < QUANT.length; j++) { const q = QUANT[j], dd = (r - q[0]) * (r - q[0]) + (g - q[1]) * (g - q[1]) + (b - q[2]) * (b - q[2]); if (dd < bd) { bd = dd; bj = j; } }
    d[i] = QUANT[bj][0]; d[i + 1] = QUANT[bj][1]; d[i + 2] = QUANT[bj][2];
  }
  c.putImageData(id, 0, 0);
}

export function createRenderer(canvas, sim, input) {
  const ctx = canvas.getContext('2d');
  const nativeCv = document.createElement('canvas');
  const nctx = nativeCv.getContext('2d');
  const terrCv = document.createElement('canvas');       // margin-cached terrain
  const terrCtx = terrCv.getContext('2d');
  let S = 3, vw = 0, vh = 0, nvw = 0, nvh = 0, tbw = 0, tbh = 0;
  let terrImg = null, terrData = null;
  let bakeOx = 0, bakeOy = 0, terrValid = false;
  let terrGlow = [];

  function resize() {
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    vw = Math.floor(window.innerWidth * dpr);
    vh = Math.floor(window.innerHeight * dpr);
    canvas.width = vw; canvas.height = vh;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    S = Math.max(2, Math.round(vw / (16 * TW)));   // ~16 tiles across, integer scale
    nvw = Math.ceil(vw / S) + 2; nvh = Math.ceil(vh / S) + 2;
    nativeCv.width = nvw; nativeCv.height = nvh;
    tbw = nvw + 2 * MARGIN; tbh = nvh + 2 * MARGIN;
    terrCv.width = tbw; terrCv.height = tbh;
    terrImg = terrCtx.createImageData(tbw, tbh); terrData = terrImg.data;
    terrValid = false;
    ctx.imageSmoothingEnabled = false; nctx.imageSmoothingEnabled = false; terrCtx.imageSmoothingEnabled = false;
  }
  window.addEventListener('resize', resize); resize();

  // ---- player doll frames (detailed 24×36, quantized to the master ramps) ----
  const dollCache = new Map();
  let heroRecipe = null;
  function setHero(r) { heroRecipe = r; dollCache.clear(); }
  function dollFrame(frame, mirror) {
    const k = frame + '|' + mirror;
    let cv = dollCache.get(k);
    if (!cv) {
      cv = document.createElement('canvas'); cv.width = DETAIL_W; cv.height = DETAIL_H;
      const dc = cv.getContext('2d');
      drawDollDetailed(dc, heroRecipe, frame, mirror);
      quantizeToRamps(dc, DETAIL_W, DETAIL_H);
      dollCache.set(k, cv);
    }
    return cv;
  }

  // ---- harvestable sprites (bonegrowth / obsidian shard) baked once ----
  const harvestCache = {};
  function outlineSprite(c, w, h) {
    const id = c.getImageData(0, 0, w, h), d = id.data;
    const A = (x, y) => x >= 0 && y >= 0 && x < w && y < h && d[(y * w + x) * 4 + 3] > 0;
    const m = [];
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) if (d[(y * w + x) * 4 + 3] === 0 && (A(x - 1, y) || A(x + 1, y) || A(x, y - 1) || A(x, y + 1))) m.push([x, y]);
    c.fillStyle = 'rgb(8,5,14)'; for (const [x, y] of m) c.fillRect(x, y, 1, 1);
  }
  (function bakeHarvest() {
    const rgb = (a) => `rgb(${a[0]},${a[1]},${a[2]})`;
    for (const kind of ['tree', 'rock']) {
      const w = 14, h = 18, cv = document.createElement('canvas'); cv.width = w; cv.height = h;
      const c = cv.getContext('2d'), ramp = kind === 'tree' ? DREAD.bone : DREAD.obsid;
      const px = (x, y, a) => { c.fillStyle = rgb(a); c.fillRect(x, y, 1, 1); };
      if (kind === 'tree') {
        for (let i = 0; i < 3; i++) { const bx = 4 + i * 3, top = 4 + ((i * 7) % 5); for (let y = top; y < 16; y++) { px(bx, y, ramp[2]); px(bx + 1, y, ramp[1]); } px(bx, top - 1, ramp[4]); px(bx + 1, top, ramp[3]); }
      } else {
        for (let y = 8; y < 16; y++) for (let x = 4; x < 10; x++) if (Math.abs(x - 7) + Math.abs(y - 13) < 5) px(x, y, ramp[x < 7 ? 2 : 1]);
        px(6, 6, ramp[4]); px(8, 7, ramp[3]); px(7, 5, DGLOW.violet);
      }
      outlineSprite(c, w, h);
      harvestCache[kind] = { cv, ax: (w / 2) | 0, ay: h - 1 };
    }
  })();

  // ---- voxel props (spires / monolith / eye-totem) baked once per variant ----
  const PROP_VARIANTS = 4;
  const propCache = { spire: [], monolith: [], totem: [] };
  (function bakeProps() {
    const seed = sim.world.seed;
    for (let v = 0; v < PROP_VARIANTS; v++) {
      propCache.spire.push(buildSpire(seed * 13 + v * 97 + 1));
      propCache.monolith.push(buildMonolith(seed * 29 + v * 131 + 7));
    }
    propCache.totem.push(buildEyeTotem(seed * 7 + 3));
  })();

  // ---- Stain creature sprite sheet (25-frame side walk) ----
  const stainImg = new Image(); let stainReady = false;
  stainImg.onload = () => { stainReady = true; };
  stainImg.src = STAIN.sheet;

  let flash = null;
  sim.bus.on('hit', ({ tx, ty }) => { flash = { tx, ty, until: performance.now() + 90 }; });

  // Paint one tile's cliff faces + top diamond via `put` into a target buffer.
  function drawTile(put, ox, oy, x, y, glowOut, W, H) {
    const world = sim.world;
    const z = heightAt(world, x, y), m = materialAt(world, x, y);
    const sx = ox + (x - y) * HW, sy = oy + (x + y) * HH - z * ZH;
    if (sx < -TW || sx > W + TW || sy < -64 || sy > H + 20) return;
    if (m === 'water') {
      const ramp = DREAD.water;
      for (let i = 0; i < 8; i++) { const half = ROWW[i] / 2; for (let k = 0; k < ROWW[i]; k++) { const dx = k - half, r = hash2(x * 16 + k, y * 8 + i, world.ws + 500); let c = r < 0.85 ? ramp[1] : ramp[2]; if (r > 0.984) c = ramp[3]; put(sx + dx, sy + i, c); if (r > 0.986) glowOut.push([(sx + dx) | 0, (sy + i) | 0, DGLOW.water, hash2(x * 16 + k, y * 8 + i, 3) * 6]); } }
      return;
    }
    const ramp = DREAD[m];
    const zN = heightAt(world, x, y - 1), zW = heightAt(world, x - 1, y);
    const dropSW = z - heightAt(world, x, y + 1), dropSE = z - heightAt(world, x + 1, y);
    if (dropSW > 0 || dropSE > 0) {
      for (let dx = -8; dx < 8; dx++) {
        let brow = -1; for (let i = 7; i >= 0; i--) if (Math.abs(dx + 0.5) <= ROWW[i] / 2) { brow = i; break; }
        if (brow < 4) continue;
        const se = dx >= 0, drop = se ? dropSE : dropSW; if (drop <= 0) continue;
        const depth = Math.min(drop * ZH, 30);
        for (let d = 1; d <= depth; d++) {
          const strat = fbm((x * 8 + dx) * 0.5, (z * ZH + d) * 0.35, world.hs + 9, 2);
          let idx = strat < 0.4 ? 0 : strat < 0.8 ? 1 : 2; if (se) idx = Math.max(0, idx - 1);
          const dk = d / depth, th = BAYER[(dx + 64) & 3][d & 3] / 16;
          const col = th < dk * 0.85 ? [(ramp[idx][0] * 0.4) | 0, (ramp[idx][1] * 0.4) | 0, (ramp[idx][2] * 0.4) | 0] : ramp[idx];
          put(sx + dx, sy + brow + d, col);
        }
      }
    }
    const nwLower = zW < z, neLower = zN < z, nwHigher = zW > z, neHigher = zN > z, corr = m === 'poison';
    for (let i = 0; i < 8; i++) {
      const wid = ROWW[i], half = wid / 2;
      for (let k = 0; k < wid; k++) {
        const dx = k - half, u = x + k / 16, v = y + i / 8;
        let idx = Math.floor((0.38 + 0.42 * fbm(u * 1.7, v * 1.7, world.ss + 3, 2)) * ramp.length);
        if ((k / wid) + (i / 8) > 1.15) idx -= 1;
        if (i < 4 && (k < 2 || k > wid - 3)) { if (nwLower || neLower) idx += 1; else if (nwHigher || neHigher) idx -= 1; }
        idx = idx < 0 ? 0 : idx >= ramp.length ? ramp.length - 1 : idx;
        put(sx + dx, sy + i, ramp[idx]);
        if (corr && hash2(x * 16 + k, y * 8 + i, world.cs + 555) > 0.972) glowOut.push([(sx + dx) | 0, (sy + i) | 0, DGLOW.poison, hash2(x * 16 + k, y * 8 + i, 5) * 6]);
      }
    }
  }

  // Bake the terrain (viewport + margin) into terrCv, keyed to camera (ox, oy).
  function bakeTerrain(ox, oy) {
    bakeOx = ox; bakeOy = oy; terrGlow = [];
    for (let i = 0; i < terrData.length; i += 4) { terrData[i] = INK_RGB[0]; terrData[i + 1] = INK_RGB[1]; terrData[i + 2] = INK_RGB[2]; terrData[i + 3] = 255; }
    const putT = (px, py, rgb) => { px |= 0; py |= 0; if (px < 0 || py < 0 || px >= tbw || py >= tbh) return; const i = (py * tbw + px) * 4; terrData[i] = rgb[0]; terrData[i + 1] = rgb[1]; terrData[i + 2] = rgb[2]; terrData[i + 3] = 255; };
    const bx = MARGIN + ox, by = MARGIN + oy;            // bake origin (display + margin)
    let minX = 1e9, minY = 1e9, maxX = -1e9, maxY = -1e9;
    for (const cx of [-MARGIN, nvw + MARGIN]) for (const cy of [-MARGIN, nvh + MARGIN]) for (const zz of [0, 7]) {
      const w = unproject(cx - ox, cy - oy, zz);
      minX = Math.min(minX, w.x); maxX = Math.max(maxX, w.x); minY = Math.min(minY, w.y); maxY = Math.max(maxY, w.y);
    }
    minX = Math.floor(minX) - 1; minY = Math.floor(minY) - 1; maxX = Math.ceil(maxX) + 1; maxY = Math.ceil(maxY) + 1;
    const tiles = [];
    for (let ty = minY; ty <= maxY; ty++) for (let tx = minX; tx <= maxX; tx++) tiles.push([tx, ty]);
    tiles.sort((a, b) => (a[0] + a[1]) - (b[0] + b[1]));
    for (const [tx, ty] of tiles) drawTile(putT, bx, by, tx, ty, terrGlow, tbw, tbh);
    terrCtx.putImageData(terrImg, 0, 0);
    terrValid = true;
  }

  function render(alpha, now) {
    const p = sim.state.player;
    const ix = p.px + (p.x - p.px) * alpha, iy = p.py + (p.y - p.py) * alpha;
    const pz = heightAt(sim.world, Math.floor(p.x), Math.floor(p.y));
    const P = project(ix, iy, pz);
    const ox = Math.round(nvw / 2 - P.sx), oy = Math.round(nvh * 0.56 - P.sy);

    if (!terrValid || Math.abs(bakeOx - ox) > MARGIN - 8 || Math.abs(bakeOy - oy) > MARGIN - 8) bakeTerrain(ox, oy);

    // terrain: blit the cached buffer at the current camera offset
    const srcX = MARGIN + (bakeOx - ox), srcY = MARGIN + (bakeOy - oy);
    nctx.drawImage(terrCv, srcX, srcY, nvw, nvh, 0, 0, nvw, nvh);

    // dynamic props + player, depth-sorted by (x+y)
    let minX = 1e9, minY = 1e9, maxX = -1e9, maxY = -1e9;
    for (const [cx, cy] of [[0, 0], [nvw, 0], [0, nvh], [nvw, nvh]]) for (const zz of [0, 7]) {
      const w = unproject(cx - ox, cy - oy, zz);
      minX = Math.min(minX, w.x); maxX = Math.max(maxX, w.x); minY = Math.min(minY, w.y); maxY = Math.max(maxY, w.y);
    }
    minX = Math.floor(minX) - 1; minY = Math.floor(minY) - 1; maxX = Math.ceil(maxX) + 1; maxY = Math.ceil(maxY) + 1;
    const draws = [];
    for (let ty = minY; ty <= maxY; ty++) for (let tx = minX; tx <= maxX; tx++) {
      const rk = resourceAt(sim.world, tx, ty); if (rk) draws.push({ d: tx + ty, kind: 'harvest', rk, tx, ty });
      const pk = propAt(sim.world, tx, ty); if (pk) draws.push({ d: tx + ty + 0.02, kind: 'prop', pk, tx, ty });
      if (stainReady && creatureAt(sim.world, tx, ty)) draws.push({ d: tx + ty + 0.04, kind: 'creature', tx, ty });
    }
    draws.push({ d: ix + iy + 0.01, kind: 'player' });
    draws.sort((a, b) => a.d - b.d);
    const flashing = flash && now < flash.until ? flash : null;
    const propGlow = [];
    let totemScreen = null;
    for (const dr of draws) {
      if (dr.kind === 'player') {
        const gx = ox + P.sx, gy = oy + P.sy;
        nctx.fillStyle = 'rgba(6,4,10,0.4)';
        for (let r = -2; r <= 2; r++) { const ww = Math.max(0, Math.round(5 * (1 - Math.abs(r) / 3))); nctx.fillRect(Math.round(gx - ww), Math.round(gy + r + 1), ww * 2, 1); }
        nctx.drawImage(dollFrame(p.moving ? p.frame : 0, p.mirror), Math.round(gx - DOLL_AX), Math.round(gy - DOLL_AY));
        continue;
      }
      if (dr.kind === 'creature') {
        // patrol wander + walk-cycle, purely visual (no sim entity yet)
        const phase = hash2(dr.tx, dr.ty, 9), t = now / 1000;
        const wob = Math.sin(t * 0.6 + phase * 6.283) * 1.6;
        const cwx = dr.tx + 0.5 + wob, cwy = dr.ty + 0.5;
        const cz = heightAt(sim.world, Math.floor(cwx), Math.floor(cwy));
        const cp = project(cwx, cwy, cz), csx = ox + cp.sx, csy = oy + cp.sy;
        const mirror = Math.cos(t * 0.6 + phase * 6.283) < 0;
        const fr = Math.floor(t * STAIN.fps + phase * 25) % 25, dw = STAIN.fw, dh = STAIN.fh;
        const dx0 = Math.round(csx - STAIN.ax), dy0 = Math.round(csy - STAIN.ay);
        if (mirror) { nctx.save(); nctx.translate(dx0 + dw, dy0); nctx.scale(-1, 1); nctx.drawImage(stainImg, fr * dw, 0, dw, dh, 0, 0, dw, dh); nctx.restore(); }
        else nctx.drawImage(stainImg, fr * dw, 0, dw, dh, dx0, dy0, dw, dh);
        continue;
      }
      const z = heightAt(sim.world, dr.tx, dr.ty);
      const gx = ox + (dr.tx - dr.ty) * HW, gy = oy + (dr.tx + dr.ty) * HH - z * ZH + HH;
      if (dr.kind === 'harvest') {
        const spr = harvestCache[dr.rk];
        const jx = flashing && flashing.tx === dr.tx && flashing.ty === dr.ty ? (hash2((now / 40) | 0, dr.tx, dr.ty) < 0.5 ? -1 : 1) : 0;
        nctx.drawImage(spr.cv, Math.round(gx - spr.ax) + jx, Math.round(gy - spr.ay));
        continue;
      }
      // prop (voxel bake) — deterministic variant, 2px ground sink
      const arr = propCache[dr.pk], spr = dr.pk === 'totem' ? arr[0] : arr[(hash2(dr.tx, dr.ty, 5) * arr.length) | 0];
      const drawX = Math.round(gx - spr.ax), drawY = Math.round(gy - spr.ay - 2);
      nctx.drawImage(spr.cv, drawX, drawY);
      for (const [gpx, gpy, c, ph] of spr.glow) propGlow.push([drawX + gpx, drawY + gpy, c, ph]);
      if (dr.pk === 'totem') totemScreen = { x: gx, y: drawY + 6 };
    }

    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(nativeCv, 0, 0, nvw, nvh, 0, 0, nvw * S, nvh * S);

    // glow pulse (from the cached terrain glow list, transformed to current view)
    const tt = now / 1000, gdx = -MARGIN - (bakeOx - ox), gdy = -MARGIN - (bakeOy - oy);
    for (const [bx, by, c, ph] of terrGlow) {
      const a = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(2.6 * tt + ph));
      ctx.fillStyle = `rgba(${c[0]},${c[1]},${c[2]},${a})`;
      ctx.fillRect((bx + gdx) * S, (by + gdy) * S, S, S);
    }
    for (const [gx, gy, c, ph] of propGlow) {
      const a = 0.4 + 0.6 * (0.5 + 0.5 * Math.sin(2.6 * tt + ph));
      ctx.fillStyle = `rgba(${c[0]},${c[1]},${c[2]},${a})`;
      ctx.fillRect(gx * S, gy * S, S, S);
    }

    // eye-totem flicker light — the corruption heart's poison lantern (TDD §9)
    if (totemScreen) {
      const cxs = totemScreen.x * S, cys = totemScreen.y * S, rad2 = 5 * TW * S;
      const fl = clampf(0.35 + 0.5 * fbm(tt * 6, 0, 55, 2) + 0.15 * Math.sin(tt * 11));
      ctx.globalCompositeOperation = 'lighter';
      const g2 = ctx.createRadialGradient(cxs, cys, 0, cxs, cys, rad2);
      g2.addColorStop(0, `rgba(132,212,76,${0.32 * fl})`); g2.addColorStop(1, 'rgba(132,212,76,0)');
      ctx.fillStyle = g2; ctx.beginPath(); ctx.arc(cxs, cys, rad2, 0, Math.PI * 2); ctx.fill();
      ctx.globalCompositeOperation = 'source-over';
    }

    const j = input.joystick();
    if (j) {
      const k = vw / window.innerWidth;
      ctx.strokeStyle = 'rgba(200,220,180,0.25)'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(j.bx, j.by, 46 * k, 0, Math.PI * 2); ctx.stroke();
      ctx.fillStyle = 'rgba(132,212,76,0.5)'; ctx.beginPath(); ctx.arc(j.kx, j.ky, 18 * k, 0, Math.PI * 2); ctx.fill();
    }
  }

  return {
    render, setHero, resize,
    screenToTile(sxPx, syPx, alpha) {
      const p = sim.state.player;
      const ix = p.px + (p.x - p.px) * alpha, iy = p.py + (p.y - p.py) * alpha;
      const pz = heightAt(sim.world, Math.floor(p.x), Math.floor(p.y));
      const P = project(ix, iy, pz);
      const ox = Math.round(nvw / 2 - P.sx), oy = Math.round(nvh * 0.56 - P.sy);
      const dpr = vw / window.innerWidth;
      return resolveTap((sxPx * dpr) / S - ox, (syPx * dpr) / S - oy, {
        heightAt: (tx, ty) => heightAt(sim.world, tx, ty),
        hasResource: (tx, ty) => !!resourceAt(sim.world, tx, ty),
        heights: [7, 6, 5, 4, 3, 2, 1, 0],
      });
    },
  };
}
