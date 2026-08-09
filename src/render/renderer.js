// renderer.js — Dreadforge isometric renderer (art direction v0.4). The sim
// doesn't know this file exists. Terrain (materials + elevation + cliff faces) is
// painted at NATIVE resolution into an ImageData, then integer-scaled to the
// display — the crisp path (fractional scaling shears moiré into pixel art).
// The glow/flicker/fog post stack + chunk cache are the next port step.

import { materialAt, heightAt, resourceAt } from '../sim/world.js';
import { DREAD, DGLOW, INK_RGB } from './palette.js';
import { drawDollDetailed, DETAIL_W, DETAIL_H } from '../assetforge/doll.js';
import { hash2, fbm } from '../sim/rng.js';
import { TW, TH, HW, HH, ZH, ROWW, project, unproject, resolveTap } from './iso.js';

const DOLL_AX = 12, DOLL_AY = 34;
const BAYER = [[0, 8, 2, 10], [12, 4, 14, 6], [3, 11, 1, 9], [15, 7, 13, 5]];

export function createRenderer(canvas, sim, input) {
  const ctx = canvas.getContext('2d');
  const nativeCv = document.createElement('canvas');
  const nctx = nativeCv.getContext('2d');
  let S = 3, vw = 0, vh = 0, nvw = 0, nvh = 0, img = null, D = null;

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
    img = nctx.createImageData(nvw, nvh); D = img.data;
    ctx.imageSmoothingEnabled = false; nctx.imageSmoothingEnabled = false;
  }
  window.addEventListener('resize', resize); resize();

  const put = (px, py, rgb) => {
    px |= 0; py |= 0;
    if (px < 0 || py < 0 || px >= nvw || py >= nvh) return;
    const i = (py * nvw + px) * 4; D[i] = rgb[0]; D[i + 1] = rgb[1]; D[i + 2] = rgb[2]; D[i + 3] = 255;
  };

  // ---- player doll frames (detailed 24×36) ----
  const dollCache = new Map();
  let heroRecipe = null;
  function setHero(r) { heroRecipe = r; dollCache.clear(); }
  function dollFrame(frame, mirror) {
    const k = frame + '|' + mirror;
    let cv = dollCache.get(k);
    if (!cv) { cv = document.createElement('canvas'); cv.width = DETAIL_W; cv.height = DETAIL_H; drawDollDetailed(cv.getContext('2d'), heroRecipe, frame, mirror); dollCache.set(k, cv); }
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
      if (kind === 'tree') {                    // bonegrowth — pale shards jutting up
        for (let i = 0; i < 3; i++) { const bx = 4 + i * 3, top = 4 + ((i * 7) % 5); for (let y = top; y < 16; y++) { px(bx, y, ramp[2]); px(bx + 1, y, ramp[1]); } px(bx, top - 1, ramp[4]); px(bx + 1, top, ramp[3]); }
      } else {                                  // obsidian shard cluster (violet, lit tip)
        for (let y = 8; y < 16; y++) for (let x = 4; x < 10; x++) if (Math.abs(x - 7) + Math.abs(y - 13) < 5) px(x, y, ramp[x < 7 ? 2 : 1]);
        px(6, 6, ramp[4]); px(8, 7, ramp[3]); px(7, 5, DGLOW.violet);
      }
      outlineSprite(c, w, h);
      harvestCache[kind] = { cv, ax: (w / 2) | 0, ay: h - 1 };
    }
  })();

  let flash = null;
  sim.bus.on('hit', ({ tx, ty }) => { flash = { tx, ty, until: performance.now() + 90 }; });

  // Paint one tile's cliff faces + top diamond into the native buffer. Returns glow.
  function drawTile(ox, oy, x, y, glowOut) {
    const world = sim.world;
    const z = heightAt(world, x, y), m = materialAt(world, x, y);
    const sx = ox + (x - y) * HW, sy = oy + (x + y) * HH - z * ZH;
    if (sx < -TW || sx > nvw + TW || sy < -64 || sy > nvh + 20) return;
    if (m === 'water') {
      const ramp = DREAD.water;
      for (let i = 0; i < 8; i++) { const half = ROWW[i] / 2; for (let k = 0; k < ROWW[i]; k++) { const dx = k - half, r = hash2(x * 16 + k, y * 8 + i, world.ws + 500); let c = r < 0.85 ? ramp[1] : ramp[2]; if (r > 0.984) c = ramp[3]; put(sx + dx, sy + i, c); if (r > 0.986) glowOut.push([sx + dx, sy + i, DGLOW.water, hash2(sx + dx | 0, sy + i | 0, 3) * 6]); } }
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
        if ((k / wid) + (i / 8) > 1.15) idx -= 1;                                   // SE form falloff
        if (i < 4 && (k < 2 || k > wid - 3)) { if (nwLower || neLower) idx += 1; else if (nwHigher || neHigher) idx -= 1; }  // rim / AO
        idx = idx < 0 ? 0 : idx >= ramp.length ? ramp.length - 1 : idx;
        put(sx + dx, sy + i, ramp[idx]);
        if (corr && hash2(x * 16 + k, y * 8 + i, world.cs + 555) > 0.972) glowOut.push([sx + dx, sy + i, DGLOW.poison, hash2(sx + dx | 0, sy + i | 0, 5) * 6]);
      }
    }
  }

  function render(alpha, now) {
    const p = sim.state.player;
    const ix = p.px + (p.x - p.px) * alpha, iy = p.py + (p.y - p.py) * alpha;
    const pz = heightAt(sim.world, Math.floor(p.x), Math.floor(p.y));
    const P = project(ix, iy, pz);
    const ox = Math.round(nvw / 2 - P.sx), oy = Math.round(nvh * 0.56 - P.sy);

    for (let i = 0; i < D.length; i += 4) { D[i] = INK_RGB[0]; D[i + 1] = INK_RGB[1]; D[i + 2] = INK_RGB[2]; D[i + 3] = 255; }
    const glowOut = [];

    let minX = 1e9, minY = 1e9, maxX = -1e9, maxY = -1e9;
    for (const [cx, cy] of [[0, 0], [nvw, 0], [0, nvh], [nvw, nvh]]) for (const zz of [0, 7]) {
      const w = unproject(cx - ox, cy - oy, zz);
      minX = Math.min(minX, w.x); maxX = Math.max(maxX, w.x); minY = Math.min(minY, w.y); maxY = Math.max(maxY, w.y);
    }
    minX = Math.floor(minX) - 1; minY = Math.floor(minY) - 1; maxX = Math.ceil(maxX) + 1; maxY = Math.ceil(maxY) + 1;

    const tiles = [];
    for (let ty = minY; ty <= maxY; ty++) for (let tx = minX; tx <= maxX; tx++) tiles.push([tx, ty]);
    tiles.sort((a, b) => (a[0] + a[1]) - (b[0] + b[1]));
    for (const [tx, ty] of tiles) drawTile(ox, oy, tx, ty, glowOut);

    nctx.putImageData(img, 0, 0);

    // props + player, depth-sorted by (x+y), drawn onto the native canvas
    const draws = [];
    for (let ty = minY; ty <= maxY; ty++) for (let tx = minX; tx <= maxX; tx++) { const kind = resourceAt(sim.world, tx, ty); if (kind) draws.push({ d: tx + ty, kind, tx, ty }); }
    draws.push({ d: ix + iy + 0.01, kind: 'player' });
    draws.sort((a, b) => a.d - b.d);
    const flashing = flash && now < flash.until ? flash : null;
    for (const dr of draws) {
      if (dr.kind === 'player') {
        const gx = ox + P.sx, gy = oy + P.sy;
        nctx.fillStyle = 'rgba(6,4,10,0.4)';
        for (let r = -2; r <= 2; r++) { const ww = Math.max(0, Math.round(5 * (1 - Math.abs(r) / 3))); nctx.fillRect(Math.round(gx - ww), Math.round(gy + r + 1), ww * 2, 1); }
        nctx.drawImage(dollFrame(p.moving ? p.frame : 0, p.mirror), Math.round(gx - DOLL_AX), Math.round(gy - DOLL_AY));
        continue;
      }
      const z = heightAt(sim.world, dr.tx, dr.ty), spr = harvestCache[dr.kind];
      const gx = ox + (dr.tx - dr.ty) * HW, gy = oy + (dr.tx + dr.ty) * HH - z * ZH + HH;
      const jx = flashing && flashing.tx === dr.tx && flashing.ty === dr.ty ? (hash2((now / 40) | 0, dr.tx, dr.ty) < 0.5 ? -1 : 1) : 0;
      nctx.drawImage(spr.cv, Math.round(gx - spr.ax) + jx, Math.round(gy - spr.ay));
    }

    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(nativeCv, 0, 0, nvw, nvh, 0, 0, nvw * S, nvh * S);

    // glow pulse (display space)
    const tt = now / 1000;
    for (const [gx, gy, c, ph] of glowOut) { const a = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(2.6 * tt + ph)); ctx.fillStyle = `rgba(${c[0]},${c[1]},${c[2]},${a})`; ctx.fillRect(gx * S, gy * S, S, S); }

    // player torch — cold veil, warm hole (placeholder until the post stack, step 2)
    const lx = (ox + P.sx) * S, ly = (oy + P.sy - 14) * S;
    const light = document.__ehLight || (document.__ehLight = document.createElement('canvas'));
    if (light.width !== vw || light.height !== vh) { light.width = vw; light.height = vh; }
    const lc = light.getContext('2d');
    lc.globalCompositeOperation = 'source-over'; lc.fillStyle = 'rgba(6,4,12,0.32)'; lc.fillRect(0, 0, vw, vh);
    const rad = 7 * TW * S * (1 + (hash2((now / 90) | 0, 3, 9) - 0.5) * 0.2);
    const grad = lc.createRadialGradient(lx, ly, rad * 0.2, lx, ly, rad);
    grad.addColorStop(0, 'rgba(0,0,0,1)'); grad.addColorStop(1, 'rgba(0,0,0,0)');
    lc.globalCompositeOperation = 'destination-out'; lc.fillStyle = grad;
    lc.beginPath(); lc.arc(lx, ly, rad, 0, Math.PI * 2); lc.fill();
    ctx.drawImage(light, 0, 0);
    const wg = ctx.createRadialGradient(lx, ly, 0, lx, ly, rad * 0.55);
    wg.addColorStop(0, 'rgba(255,150,90,0.10)'); wg.addColorStop(1, 'rgba(255,150,90,0)');
    ctx.fillStyle = wg; ctx.beginPath(); ctx.arc(lx, ly, rad * 0.55, 0, Math.PI * 2); ctx.fill();

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
