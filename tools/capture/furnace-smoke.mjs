// furnace-smoke.mjs — Furnace Nine's stack smoke (docs/art-critic-pass-reach-fx.md): the region boss stood alone on the
// Stage (src/dev/stage.js show=cast), its idle looping on the manual clock, and
//   · what a frame costs: every WebGL draw call and triangle counted at the context (as figperf.mjs counts them), the
//     median of FRAMES frames, with the furnace in view and with the Stage empty (the furnace's share: the difference);
//   · a strip of the furnace at +0 … 2.5 s (the smoke over its stack, as it drifts or doesn't) → <out>/strip.png
//   node tools/capture/furnace-smoke.mjs [--base url] [--out dir] [--frames 30]
// Needs ?dev, so localhost. A before: --base a checkout from before served elsewhere.
import { createServer } from 'node:http';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { join, extname, normalize, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const ROOT = fileURLToPath(new URL('../..', import.meta.url));
const args = process.argv.slice(2), opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const OUT = resolve(opt('--out', join(ROOT, 'tools/capture/out/furnace-smoke'))), FRAMES = +opt('--frames', 30);
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.css': 'text/css', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.mp3': 'audio/mpeg', '.glb': 'model/gltf-binary' };
let srv = null, base = opt('--base');
if (!base) {
  srv = createServer(async (req, res) => {
    const p = normalize(join(ROOT, decodeURIComponent(req.url.split('?')[0])));
    if (!p.startsWith(ROOT)) { res.writeHead(403); return res.end(); }
    try { const b = await readFile(p); res.writeHead(200, { 'Content-Type': MIME[extname(p)] || 'application/octet-stream' }); res.end(b); } catch { res.writeHead(404); res.end(); }
  });
  await new Promise((r) => srv.listen(0, '127.0.0.1', r));
  base = `http://127.0.0.1:${srv.address().port}`;
}
await mkdir(OUT, { recursive: true });
const COUNT = () => {
  const c = { draws: 0, tris: 0 }; globalThis.__glCount = c;
  const tri = (mode, n, inst = 1) => { if (mode === 4) c.tris += (n / 3) * inst; else if (mode === 5 || mode === 6) c.tris += Math.max(0, n - 2) * inst; };
  for (const P of [globalThis.WebGL2RenderingContext, globalThis.WebGLRenderingContext].filter(Boolean).map((K) => K.prototype)) {
    for (const [name, f] of [['drawElements', (a) => tri(a[0], a[1])], ['drawArrays', (a) => tri(a[0], a[2])], ['drawElementsInstanced', (a) => tri(a[0], a[1], a[4])], ['drawArraysInstanced', (a) => tri(a[0], a[2], a[3])]]) {
      const o = P[name]; if (!o) continue;
      P[name] = function (...a) { c.draws++; f(a); return o.apply(this, a); };
    }
  }
};
const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const measure = async (cast) => {
  const p = await b.newPage({ viewport: { width: 390, height: 844 } }), errs = []; p.on('pageerror', (e) => errs.push(String(e)));
  await p.addInitScript(COUNT);
  await p.goto(`${base}/index.html?dev&manual&notitle&scene=stage&show=cast&cast=${cast}&per=1&cols=1&labels=0&clip=idle&dir=2&site=barrows&floor=0&room=big`);
  await p.waitForFunction(() => typeof globalThis.__frame === 'function' && globalThis.__stage && globalThis.__stage.ready, null, { timeout: 120000 });
  await p.evaluate(async () => {
    const end = performance.now() + 180000, S = globalThis.__stage; globalThis.__lumDraw = false;
    const ok = () => { const H3 = globalThis.__world3d; if (!H3 || !H3.world || globalThis.__renderer.transiting) return false; const st = H3.world.stats; return st.level >= 1 && S.names.every((n) => st.modelNames.includes(n)); };
    while (!ok() && performance.now() < end) { for (let i = 0; i < 4; i++) globalThis.__frame(16); await new Promise((r) => setTimeout(r, 0)); }
    for (let i = 0; i < 90; i++) globalThis.__frame(33);         // (3 s of the clock: a plume up to its height)
    globalThis.__lumDraw = true;
  });
  const per = await p.evaluate((n) => { const c = globalThis.__glCount, o = []; for (let i = 0; i < n; i++) { c.draws = 0; c.tris = 0; globalThis.__frame(33); o.push([c.draws, c.tris]); } return o; }, FRAMES);
  const med = (k) => per.map((q) => q[k]).sort((x, y) => x - y)[per.length >> 1];
  let strip = null;
  if (cast !== 'none') {
    const frames = [];
    for (let i = 0; i < 6; i++) {
      frames.push(await p.evaluate(() => {
        const S = globalThis.__stage, f = S.figures[0], R = globalThis.__renderer, [sx, sy] = R.screenAt(f.x, f.y), W = 220, H = 300, d = devicePixelRatio;
        globalThis.__frame(16);
        const c = document.createElement('canvas'); c.width = W * d; c.height = H * d; const g = c.getContext('2d'); g.fillStyle = '#000'; g.fillRect(0, 0, c.width, c.height);
        for (const cv of document.querySelectorAll('canvas')) { const st = getComputedStyle(cv), r = cv.getBoundingClientRect(); if (cv === c || st.display === 'none' || r.width * r.height < innerWidth * innerHeight * 0.5) continue; g.drawImage(cv, (r.left - (sx - W / 2)) * d, (r.top - (sy - H + 40)) * d, r.width * d, r.height * d); }
        return c.toDataURL('image/png');
      }));
      await p.evaluate(() => { globalThis.__lumDraw = false; for (let t = 0; t < 500; t += 33) globalThis.__frame(33); globalThis.__lumDraw = true; });
    }
    strip = await p.evaluate(async (fr) => { const ims = await Promise.all(fr.map(async (u) => { const i = new Image(); i.src = u; await i.decode(); return i; }));
      const c = document.createElement('canvas'); c.width = ims[0].width * ims.length; c.height = ims[0].height + 18; const g = c.getContext('2d'); g.fillStyle = '#14121a'; g.fillRect(0, 0, c.width, c.height);
      ims.forEach((im, i) => { g.drawImage(im, i * im.width, 18); g.fillStyle = '#ddd'; g.font = '12px sans-serif'; g.fillText(`+${(i * 0.5).toFixed(1)} s`, i * im.width + 6, 13); }); return c.toDataURL('image/png'); }, frames);
  }
  const st = await p.evaluate(() => { const s = globalThis.__world3d.world.stats; return { models: s.models, modelNames: s.modelNames }; });
  await p.close();
  return { draws: med(0), tris: Math.round(med(1)), st, strip, errs };
};
const withF = await measure('boss_furnace_nine'), none = await measure('none');
if (withF.strip) await writeFile(join(OUT, 'strip.png'), Buffer.from(withF.strip.split(',')[1], 'base64'));
const res = { furnace: { draws: withF.draws, tris: withF.tris, models: withF.st.modelNames }, empty: { draws: none.draws, tris: none.tris }, share: { draws: withF.draws - none.draws, tris: withF.tris - none.tris } };
await writeFile(join(OUT, 'numbers.json'), JSON.stringify(res, null, 1) + '\n');
console.log(JSON.stringify(res), [...withF.errs, ...none.errs].slice(0, 3).join(' | '));
console.log(`strip: ${join(OUT, 'strip.png')}`);
await b.close(); srv?.close();
