// pilgrim.mjs — the First Pilgrim in the game (GDD v1.147 §19.11; docs/art-critic-pass-pilgrim.md): on the Pale Heights'
// overland in his window (?dev&ring=pilgrim holds it open), at the head of the Pilgrims' Stair under the Lip, on the
// manual clock. Three things, each a picture in the game's phone frame (390 × 844):
//   · stand-<tag>.png: him standing at the Lip before you walk in, the hero --at tiles south of his ground's edge;
//   · fight-<tag>.png: the fight, the right party at 75 walked in, a few seconds on;
//   · gaze-<tag>.png: a strip from his first gaze, the moment it's told and +0.45 s … to its landing and after, cropped
//     round him and his beams.
//   node tools/capture/pilgrim.mjs [--tod dusk|day|night] [--at 6] [--times 0,0.9,1.5,1.85,2.0,2.25] [--tag name] [--base url] [--out dir] [--dpr 1]
// Needs ?dev, so localhost. A before: --base a checkout from before served elsewhere.
import { createServer } from 'node:http';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { join, extname, normalize, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const ROOT = fileURLToPath(new URL('../..', import.meta.url));
const args = process.argv.slice(2), opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const OUT = resolve(opt('--out', join(ROOT, 'tools/capture/out/pilgrim'))), DPR = +opt('--dpr', 1), TOD = opt('--tod', 'dusk'), AT = +opt('--at', 6), TAG = opt('--tag', TOD);
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.css': 'text/css', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.mp3': 'audio/mpeg', '.glb': 'model/gltf-binary', '.gltf': 'model/gltf+json', '.bin': 'application/octet-stream' };
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

/** the frame drawn (advancing the clock `advance` ms) and every full-window canvas copied onto one, cropped round him or whole */
const SHOT = ([crop, advance]) => {
  globalThis.__frame(advance);
  const R = globalThis.__renderer, e = globalThis.__sim.world.enemies.find((q) => q.kind === 'first_pilgrim');
  const d = devicePixelRatio, [sx, sy] = e ? R.screenAt(e.x, e.y) : [innerWidth / 2, innerHeight / 2], [W, H] = crop || [innerWidth, innerHeight];
  const x0 = crop ? Math.max(0, Math.min(innerWidth - W, sx - W / 2)) : 0, y0 = crop ? Math.max(0, Math.min(innerHeight - H, sy - H * 0.55)) : 0;
  const c = document.createElement('canvas'); c.width = W * d; c.height = H * d; const g = c.getContext('2d'); g.fillStyle = '#000'; g.fillRect(0, 0, c.width, c.height);
  for (const cv of document.querySelectorAll('canvas')) { const st = getComputedStyle(cv), r = cv.getBoundingClientRect(); if (cv === c || st.display === 'none' || st.visibility === 'hidden' || r.width * r.height < innerWidth * innerHeight * 0.5) continue; g.drawImage(cv, (r.left - x0) * d, (r.top - y0) * d, r.width * d, r.height * d); }
  return c.toDataURL('image/png');
};
const strip = ([fr, labels]) => {
  return (async () => { const ims = await Promise.all(fr.map(async (u) => { const i = new Image(); i.src = u; await i.decode(); return i; }));
    const c = document.createElement('canvas'); c.width = ims[0].width * ims.length; c.height = ims[0].height + 18; const g = c.getContext('2d'); g.fillStyle = '#14121a'; g.fillRect(0, 0, c.width, c.height);
    ims.forEach((im, i) => { g.drawImage(im, i * im.width, 18); g.fillStyle = '#ddd'; g.font = '12px sans-serif'; g.fillText(labels[i], i * im.width + 6, 13); }); return c.toDataURL('image/png'); })();
};
const png = (u) => Buffer.from(u.split(',')[1], 'base64');

const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: DPR }), errs = [];
p.on('pageerror', (e) => errs.push(String(e)));
await p.goto(`${base}/index.html?dev&manual&notitle&scene=overland&region=heights&ring=pilgrim&tod=${TOD}`);
await p.waitForFunction(() => typeof globalThis.__frame === 'function' && globalThis.__sim, null, { timeout: 120000 });
// settle: the world built, his window told (as the UI tells it), the hero south of his ground, his model in
const info = await p.evaluate(async (at) => {
  const end = performance.now() + 180000, ok = () => { const H3 = globalThis.__world3d; return H3 && H3.world && !globalThis.__renderer.transiting && H3.world.stats.level >= 1; };
  globalThis.__lumDraw = false;
  while (!ok() && performance.now() < end) { for (let i = 0; i < 4; i++) globalThis.__frame(16); await new Promise((r) => setTimeout(r, 0)); }
  const sim = globalThis.__sim, s = sim.state, n = new Date(), z = (v) => String(v).padStart(2, '0');
  s.created = true;
  sim.commands.push({ type: 'ringOpen', window: `${n.getFullYear()}-${z(n.getMonth() + 1)}-${z(n.getDate())}T${z(n.getHours())}:30p`, left: 800 });
  for (let i = 0; i < 4; i++) globalThis.__frame(33);
  const e = sim.world.enemies.find((q) => q.kind === 'first_pilgrim'); if (!e) throw new Error('the First Pilgrim is not standing at the Lip');
  s.player.x = s.player.px = e.x + 0.5; s.player.y = s.player.py = e.y + 21 + at;
  const end2 = performance.now() + 120000;
  while (!(globalThis.__world3d.world.stats.modelNames || []).includes('boss_first_pilgrim') && performance.now() < end2) { for (let i = 0; i < 4; i++) globalThis.__frame(16); await new Promise((r) => setTimeout(r, 0)); }
  for (let i = 0; i < 60; i++) globalThis.__frame(33);
  globalThis.__lumDraw = true;
  return { boss: [e.x, e.y], models: globalThis.__world3d.world.stats.modelNames.includes('boss_first_pilgrim') };
}, AT);
await writeFile(join(OUT, `stand-${TAG}.png`), png(await p.evaluate(SHOT, [null, 16])));
// the fight: the party at 75 (a dev picture, never saved), walked in; on until his first gaze is told
await p.evaluate(() => {
  const sim = globalThis.__sim, s = sim.state, e = sim.world.enemies.find((q) => q.kind === 'first_pilgrim');
  for (const m of s.party) m.level = 75;
  globalThis.__gazes = []; sim.bus.on('tell', (t) => { if (t.kind === 'gaze') globalThis.__gazes.push(t); });
  s.player.x = s.player.px = e.x + 0.5; s.player.y = s.player.py = e.y + 14;
  globalThis.__lumDraw = false; for (let i = 0; i < 40; i++) globalThis.__frame(33); globalThis.__lumDraw = true;
});
await writeFile(join(OUT, `fight-${TAG}.png`), png(await p.evaluate(SHOT, [null, 16])));
const told = await p.evaluate(() => { globalThis.__lumDraw = false; for (let i = 0; i < 600 && !globalThis.__gazes.length; i++) globalThis.__frame(33); globalThis.__lumDraw = true; return globalThis.__gazes.length; });
const fr = [], labels = [];
const TIMES = opt('--times', '0,0.9,1.5,1.85,2.0,2.25').split(',').map(Number);
let tNow = 0;
// (the clock stepped a frame at a time between shots: one long step is clamped; each label says how far from its landing)
if (told) for (const t of TIMES) { const ms = Math.max(16, Math.round((t - tNow) * 1000)); tNow = t; await p.evaluate((ms) => { globalThis.__lumDraw = false; for (let t = 0; t < ms - 33; t += 33) globalThis.__frame(33); globalThis.__lumDraw = true; }, ms); fr.push(await p.evaluate(SHOT, [[390, 560], 33]));
  labels.push(`+${t.toFixed(2)} s (${(await p.evaluate(() => { const b = globalThis.__sim.battle, g = b && b.tells.find((q) => q.kind === 'gaze'); return g ? (globalThis.__sim.state.t - g.at).toFixed(2) : '-'; }))} to land)`); }
if (fr.length) await writeFile(join(OUT, `gaze-${TAG}.png`), png(await p.evaluate(strip, [fr, labels])));
await b.close(); if (srv) srv.close();
console.log(JSON.stringify({ ...info, gazes: told, errs: errs.slice(0, 5) }));
