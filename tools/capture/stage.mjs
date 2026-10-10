// stage.mjs — captures of the Stage (src/dev/stage.js; docs/character-stage-proposal.md): the cast lined up
// and animated in place through the real renderer, on the manual clock, so a capture is the same pixels
// every run.
//
//   node tools/capture/stage.mjs [--group party|town|foes|bosses|wardens|all|id,id] [--clip idle|walk|attack|…]
//        [--dir 0-7|turn|all] [--tod dawn|day|dusk|night] [--floor grass|cobble] [--zoom 1|2|3]
//        [--cmp <checkout dir>] [--frames N] [--fps 12] [--size 390x844] [--out dir]
//   node tools/capture/stage.mjs --show env|props|fx|icons|faces [--set env|town-vale|…|all] [--page N|all] [--match s]
//        (the art review's other views, src/dev/review.js, docs/art-review.md: env and props a still a page, every
//        page with --page all; fx a loop of frames, and strips.png, each effect's cell through the frames, a row an
//        effect; icons and faces the whole grid in one tall still)
//
// Writes into --out (default tools/capture/out/<group>-<clip>-<dir>/):
//   frame-00.png …   one still per frame (device pixels, DPR 2)
//   sheet.png        the frames in a grid, numbered
//   loop.html        a flipbook that plays the frames at --fps (open it in a browser)
// --cmp serves another checkout (a `git worktree add` of the previous commit) under /before/, so each
// figure stands beside its twin from there: before · after.
// Needs Chromium (playwright's, or /opt/pw-browsers/chromium where `playwright install` can't run).
import { createServer } from 'node:http';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, extname, normalize, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i > 0 ? process.argv[i + 1] : d; };
const group = arg('group', 'party'), clip = arg('clip', 'idle'), dir = arg('dir', '1'), tod = arg('tod', 'dusk'), floor = arg('floor', 'grass');
const show = arg('show', 'cast'), set = arg('set', 'env'), pageArg = arg('page', '1'), match = arg('match', '');
const zoom = arg('zoom', '1'), cmp = arg('cmp', ''), fps = +arg('fps', '12'), [W, H] = arg('size', show === 'cast' ? '390x844' : '1280x900').split('x').map(Number);
const out = resolve(arg('out', join(ROOT, 'tools/capture/out', show === 'cast' ? `${group.replace(/,/g, '+')}-${clip}-${dir}` : `${show}${show === 'env' ? '-' + set : ''}${match ? '-' + match : ''}`)));
await mkdir(out, { recursive: true });

const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.png': 'image/png', '.css': 'text/css', '.woff2': 'font/woff2' };
const BEFORE = cmp ? resolve(cmp) : null;
const srv = createServer(async (req, res) => {
  let url = decodeURIComponent(req.url.split('?')[0]), base = ROOT;
  if (BEFORE && url.startsWith('/before/')) { base = BEFORE; url = url.slice('/before'.length); }
  const p = normalize(join(base, url));
  if (!p.startsWith(base)) { res.writeHead(403); res.end(); return; }
  try { const b = await readFile(p); res.writeHead(200, { 'Content-Type': MIME[extname(p)] || 'application/octet-stream' }); res.end(b); } catch { res.writeHead(404); res.end(); }
});
await new Promise((r) => srv.listen(0, '127.0.0.1', r));
const exe = ['/opt/pw-browsers/chromium'].find((p) => existsSync(p));
const b = await chromium.launch({ ...(exe ? { executablePath: exe } : {}), args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const page = await b.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: +arg('dpr', show === 'cast' ? '2' : '1') });   // (the review's wide views at 1: a software GPU at 2 timed out)
page.setDefaultTimeout(120000);
const errs = []; page.on('pageerror', (e) => errs.push(e.message));
const q = new URLSearchParams({ group, clip, dir, tod, floor, zoom, panel: '0', ...(cmp ? { cmp: '/before/' } : {}), ...(show !== 'cast' ? { show, set, match } : {}) });
const open = async (n) => {
  await page.goto(`http://localhost:${srv.address().port}/index.html?dev&manual&scene=stage&${q}${n ? '&page=' + n : ''}`);
  await page.waitForFunction(() => !!globalThis.__frame && !!globalThis.__stage, null, { timeout: 60000 });
};
await open(show === 'env' || show === 'props' ? (pageArg === 'all' ? 1 : +pageArg) : 0);
// ── the review's other views (src/dev/review.js) ──
if (show !== 'cast') {
  const settle = async () => { for (let i = 0; i < 120 && !(await page.evaluate(() => globalThis.__stage.ready)); i++) { await page.waitForTimeout(250); await page.evaluate(() => globalThis.__frame(16)); } await page.waitForTimeout(400); await page.evaluate(() => { for (let i = 0; i < 40; i++) globalThis.__frame(1000 / 60); }); };
  await settle();
  const need = await page.evaluate(() => globalThis.__stage.need || 0);
  if (need > H) { await page.setViewportSize({ width: W, height: need }); await open(0); await settle(); }   // (the effects' grid at zoom 2–3 runs past the window)
  if (show === 'icons' || show === 'faces') {           // the whole grid, in one tall still
    // the grid scrolls inside a fixed box (the game's page never scrolls): grow the window to the grid's height
    const tall = await page.evaluate(() => { const g = document.getElementById('reviewGrid'); g.style.inset = '8px 8px auto'; g.style.overflow = 'visible'; document.querySelector('canvas').style.display = 'none'; return Math.ceil(g.scrollHeight) + 16; });
    await page.setViewportSize({ width: W, height: tall });
    await page.waitForTimeout(800);
    await page.screenshot({ path: join(out, 'sheet.png') });
    console.log(`${show}: ${out}/sheet.png${errs.length ? ' · ERRORS ' + errs.join(' | ') : ''}`);
  } else if (show === 'fx') {                           // a loop: every cell has fired at least twice
    const frames = +arg('frames', '30'), step = 1000 / fps, shots = [];
    await page.evaluate(() => { for (let t = 0; t < 3000; t += 1000 / 60) globalThis.__frame(1000 / 60); });
    for (let i = 0; i < frames; i++) { await page.evaluate((ms) => { for (let t = 0; t < ms; t += 1000 / 60) globalThis.__frame(Math.min(1000 / 60, ms - t)); }, step); const png = await page.screenshot(); shots.push(png); await writeFile(join(out, `frame-${String(i).padStart(2, '0')}.png`), png); }
    // strips.png: each effect's cell through the frames, a row an effect (one frame of the page catches most effects
    // between firings; a row shows the whole life of one)
    const cells = await page.evaluate(() => { const st = globalThis.__stage; return { cw: st.cell[0], ch: st.cell[1], list: st.items.filter((i) => i.css).map((i) => ({ label: i.label, css: i.css, span: i.span || 1 })) }; });
    const strips = await page.evaluate(async ({ imgs, cells, dpr }) => {
      const els = await Promise.all(imgs.map((u) => new Promise((r) => { const i = new Image(); i.onload = () => r(i); i.src = u; })));
      const k = cells.list[0].css[2], tw = Math.round(cells.cw * k * dpr), th = Math.round((cells.ch * 1.6 * k + 18) * dpr), lw = 150;
      const cv = document.createElement('canvas'); cv.width = lw + els.length * tw; cv.height = cells.list.length * th;
      const x = cv.getContext('2d'); x.fillStyle = '#100c16'; x.fillRect(0, 0, cv.width, cv.height); x.font = '13px ui-monospace, Menlo, monospace';
      cells.list.forEach((c, r) => {
        const w = tw * c.span, sx = Math.round(c.css[0] * dpr - w / 2), sy = Math.round((c.css[1] - cells.ch * 1.6 * c.css[2]) * dpr), sw = Math.min(w, tw);
        els.forEach((im, f) => x.drawImage(im, sx + (w - sw) / 2, sy, sw, th, lw + f * tw, r * th, sw, th));
        x.fillStyle = '#f0c880'; x.fillText(c.label, 8, r * th + th / 2); x.fillStyle = '#2a2333'; x.fillRect(0, (r + 1) * th - 1, cv.width, 1);
      });
      return cv.toDataURL('image/png');
    }, { imgs: shots.map((q) => 'data:image/png;base64,' + q.toString('base64')), cells, dpr: +arg('dpr', '1') });
    await writeFile(join(out, 'strips.png'), Buffer.from(strips.split(',')[1], 'base64'));
    await writeFile(join(out, 'loop.html'), `<!doctype html><meta charset="utf-8"><title>FX loop</title><body style="margin:0;background:#100c16"><img id="f" style="width:${W}px">
<script>const n=${frames},f=document.getElementById('f');let i=0;setInterval(()=>{f.src='frame-'+String(i).padStart(2,'0')+'.png';i=(i+1)%n},${Math.round(step)});</script>`);
    console.log(`fx: ${frames} frames · ${out}${errs.length ? ' · ERRORS ' + errs.join(' | ') : ''}`);
  } else {                                              // env, props: a still a page
    const pages = await page.evaluate(() => globalThis.__stage.pages), list = pageArg === 'all' ? Array.from({ length: pages }, (_, i) => i + 1) : [Math.min(pages, +pageArg)];
    for (const n of list) {
      if (n !== list[0] || (pageArg === 'all' && n !== 1)) { await open(n); await settle(); }
      await page.screenshot({ path: join(out, `page-${String(n).padStart(2, '0')}.png`) });
    }
    console.log(`${show}: ${list.length} of ${pages} page(s) · ${out}${errs.length ? ' · ERRORS ' + errs.join(' | ') : ''}`);
  }
  await b.close(); srv.close();
  process.exit(errs.length ? 1 : 0);
}
for (let i = 0; i < 80 && !(await page.evaluate(() => globalThis.__renderer.stageReady)); i++) { await page.waitForTimeout(250); await page.evaluate(() => globalThis.__frame(16)); }
await page.evaluate(() => { for (let i = 0; i < 30; i++) globalThis.__frame(1000 / 60); });   // settle (facings turn in)

// one loop of the clip: the longest figure's (a one-shot plus its pause), or a second for idle / walk
const loopMs = await page.evaluate((clip) => {
  const lens = globalThis.__stage.actors.map((a) => { const m = a.meta; return m && m.clips[clip] ? (m.clips[clip].len / m.clips[clip].fps) * 1000 : 0; });
  return Math.max(1000, ...lens) + (['idle', 'walk', 'sit'].includes(clip) ? 0 : 700);
}, clip);
const frames = +arg('frames', String(Math.max(4, Math.round((loopMs / 1000) * fps)))), step = 1000 / fps;
const shots = [];
// every frame is cropped to the lineup (its figures' drawn boxes and their names), the same box each frame
const cut = await page.evaluate(() => { const v = globalThis.__renderer.view; return globalThis.__stage.actors.filter((a) => !a.box || a.box[0] < 0 || a.box[1] < 0 || a.box[2] > v.w || a.box[3] > v.h).map((a) => a.atlas); });
if (cut.length) console.warn(`warning: ${cut.length} figure(s) don't fit the window (${cut.slice(0, 4).join(', ')}${cut.length > 4 ? ', …' : ''}): a larger --size, a lower --zoom or a smaller --group`);
const bb = await page.evaluate(() => globalThis.__renderer.stageBounds()), crop = bb ? { x: Math.floor(bb.x), y: Math.floor(bb.y), width: Math.ceil(bb.x1 - bb.x), height: Math.ceil(bb.y1 - bb.y) } : undefined;
for (let i = 0; i < frames; i++) {
  await page.evaluate((ms) => { for (let t = 0; t < ms; t += 1000 / 60) globalThis.__frame(Math.min(1000 / 60, ms - t)); }, step);
  const png = await page.screenshot(crop ? { clip: crop } : {}); shots.push(png); await writeFile(join(out, `frame-${String(i).padStart(2, '0')}.png`), png);
}
// the contact sheet, drawn by the browser (no image library needed)
const sheet = await page.evaluate(async ({ imgs, cols }) => {
  const els = await Promise.all(imgs.map((u) => new Promise((r) => { const i = new Image(); i.onload = () => r(i); i.src = u; })));
  const w = els[0].width / 2, h = els[0].height / 2, rows = Math.ceil(els.length / cols), cv = document.createElement('canvas');
  cv.width = cols * w; cv.height = rows * h; const x = cv.getContext('2d'); x.fillStyle = '#100c16'; x.fillRect(0, 0, cv.width, cv.height);
  els.forEach((im, k) => { const cx = (k % cols) * w, cy = Math.floor(k / cols) * h; x.drawImage(im, cx, cy, w, h); x.fillStyle = '#f0c880'; x.font = '600 16px Georgia, serif'; x.fillText(String(k), cx + 8, cy + 20); });
  return cv.toDataURL('image/png');
}, { imgs: shots.map((s) => 'data:image/png;base64,' + s.toString('base64')), cols: Math.min(6, frames) });
await writeFile(join(out, 'sheet.png'), Buffer.from(sheet.split(',')[1], 'base64'));
await writeFile(join(out, 'loop.html'), `<!doctype html><meta charset="utf-8"><title>Stage loop</title><body style="margin:0;background:#100c16"><img id="f" style="width:${crop ? crop.width : W}px;image-rendering:pixelated">
<script>const n=${frames},f=document.getElementById('f');let i=0;setInterval(()=>{f.src='frame-'+String(i).padStart(2,'0')+'.png';i=(i+1)%n},${Math.round(step)});</script>`);
console.log(`${frames} frames · ${(loopMs / 1000).toFixed(2)} s loop · ${out}${errs.length ? ' · ERRORS ' + errs.join(' | ') : ''}`);
await b.close(); srv.close();
process.exit(errs.length ? 1 : 0);
