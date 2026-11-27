// grace.mjs — the Grace in the game (GDD v1.157; docs/art-critic-pass-tidemark.md): on the Tidemark's overland in her
// window (?dev&ring=grace holds it open), off the wreckers' beach, on the manual clock. A dev picture, never saved: the
// hero's save is given Low Water as done (her window's gate, core.js ringHeld) before the window is told. Four things,
// each in the game's phone frame (390 × 844):
//   · stand-<tag>.png: the beach before you walk in, her master on his ground and the ship hove to in the bay;
//   · fight-<tag>.png: the fight, the right party at 45 walked in, a few seconds on;
//   · broadside-<tag>.png: a strip from her first broadside, as it's told, winding, landing and after (+ the s to its landing);
//   · boarders-<tag>.png: a strip as her first boarders come up out of the surf.
//   node tools/capture/grace.mjs [--tod dusk|day|night] [--at 6] [--times 0,1.2,1.9,2.1,2.5,3.2,4.2] [--tag name] [--base url] [--out dir] [--dpr 1]
// Needs ?dev, so localhost. A before: --base a checkout from before served elsewhere.
import { createServer } from 'node:http';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { join, extname, normalize, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const ROOT = fileURLToPath(new URL('../..', import.meta.url));
const args = process.argv.slice(2), opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const OUT = resolve(opt('--out', join(ROOT, 'tools/capture/out/grace'))), DPR = +opt('--dpr', 1), TOD = opt('--tod', 'dusk'), AT = +opt('--at', 6), TAG = opt('--tag', TOD);
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.css': 'text/css', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.mp3': 'audio/mpeg', '.glb': 'model/gltf-binary', '.wasm': 'application/wasm' };
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

/** the frame drawn (advancing the clock `advance` ms) and every full-window canvas copied onto one */
const SHOT = ([advance]) => {
  globalThis.__frame(advance);
  const d = devicePixelRatio, c = document.createElement('canvas'); c.width = innerWidth * d; c.height = innerHeight * d; const g = c.getContext('2d'); g.fillStyle = '#000'; g.fillRect(0, 0, c.width, c.height);
  for (const cv of document.querySelectorAll('canvas')) { const st = getComputedStyle(cv), r = cv.getBoundingClientRect(); if (cv === c || st.display === 'none' || st.visibility === 'hidden' || r.width * r.height < innerWidth * innerHeight * 0.5) continue; g.drawImage(cv, r.left * d, r.top * d, r.width * d, r.height * d); }
  return c.toDataURL('image/png');
};
const strip = ([fr, labels]) => (async () => {
  const ims = await Promise.all(fr.map(async (u) => { const i = new Image(); i.src = u; await i.decode(); return i; }));
  const c = document.createElement('canvas'); c.width = ims[0].width * ims.length; c.height = ims[0].height + 18; const g = c.getContext('2d'); g.fillStyle = '#14121a'; g.fillRect(0, 0, c.width, c.height);
  ims.forEach((im, i) => { g.drawImage(im, i * im.width, 18); g.fillStyle = '#ddd'; g.font = '12px sans-serif'; g.fillText(labels[i], i * im.width + 6, 13); }); return c.toDataURL('image/png');
})();
const png = (u) => Buffer.from(u.split(',')[1], 'base64');
const step = (ms) => { globalThis.__lumDraw = false; for (let t = 0; t < ms - 33; t += 33) globalThis.__frame(33); globalThis.__lumDraw = true; };

const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const p = await b.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: DPR }), errs = [];
p.on('pageerror', (e) => errs.push(String(e)));
await p.goto(`${base}/index.html?dev&manual&notitle&scene=overland&region=tidemark&ring=grace&tod=${TOD}`);
await p.waitForFunction(() => typeof globalThis.__frame === 'function' && globalThis.__sim, null, { timeout: 120000 });
const info = await p.evaluate(async (at) => {
  const ok = () => { const H3 = globalThis.__world3d; return H3 && H3.world && !globalThis.__renderer.transiting && H3.world.stats.level >= 1 && H3.world.stats.level >= H3.state.loads; };
  const wait = async (f, ms) => { const end = performance.now() + ms; globalThis.__lumDraw = false; while (!f() && performance.now() < end) { for (let i = 0; i < 4; i++) globalThis.__frame(16); await new Promise((r) => setTimeout(r, 0)); } globalThis.__lumDraw = true; };
  await wait(ok, 180000);
  const sim = globalThis.__sim, n = new Date(), z = (v) => String(v).padStart(2, '0');
  // (her gate: Low Water done, in a dev save made for the picture: restored with it)
  const snap = JSON.parse(JSON.stringify(sim.snapshot())); snap.quests = snap.quests || {}; snap.quests.ch4_low_water = [3, 0]; snap.created = true;
  const loads = globalThis.__world3d.state.loads; sim.restore(snap); await wait(() => ok() && globalThis.__world3d.state.loads > loads, 180000);
  const s = sim.state; s.created = true; for (const m of s.party) m.level = Math.max(m.level, 45);
  sim.commands.push({ type: 'ringOpen', window: `${n.getFullYear()}-${z(n.getMonth() + 1)}-${z(n.getDate())}T${z(n.getHours())}:00g`, left: 800 });
  for (let i = 0; i < 4; i++) globalThis.__frame(33);
  const e = sim.world.enemies.find((q) => q.kind === 'the_grace'); if (!e) throw new Error('the Grace is not on the wreckers\' beach (status ' + sim.quests.status('ch4_low_water') + ')');
  s.player.x = s.player.px = e.x - 2.5; s.player.y = s.player.py = e.y - 24 - at;
  await wait(() => (globalThis.__world3d.world.stats.modelNames || []).includes('boss_grace'), 120000);
  globalThis.__lumDraw = false; for (let t = 0; t < 2000; t += 33) globalThis.__frame(33); globalThis.__lumDraw = true;
  return { boss: [e.x, e.y], models: (globalThis.__world3d.world.stats.modelNames || []).includes('boss_grace') };
}, AT);
await writeFile(join(OUT, `stand-${TAG}.png`), png(await p.evaluate(SHOT, [16])));
// the fight: walked in; on until her first broadside is told
await p.evaluate(() => {
  const sim = globalThis.__sim, s = sim.state, e = sim.world.enemies.find((q) => q.kind === 'the_grace');
  globalThis.__shots = 0; globalThis.__boarders = 0;
  sim.bus.on('ring', (r) => { if (r.t === 'broadside') globalThis.__shots++; if (r.t === 'boarders') globalThis.__boarders++; });
  s.player.x = s.player.px = e.x - 1.5; s.player.y = s.player.py = e.y - 9;
  globalThis.__lumDraw = false; for (let i = 0; i < 60; i++) globalThis.__frame(33); globalThis.__lumDraw = true;
});
await writeFile(join(OUT, `fight-${TAG}.png`), png(await p.evaluate(SHOT, [16])));
const told = await p.evaluate(() => { globalThis.__lumDraw = false; for (let i = 0; i < 900 && !globalThis.__shots; i++) globalThis.__frame(33); globalThis.__lumDraw = true; return globalThis.__shots; });
const fr = [], labels = [], TIMES = opt('--times', '0,1.2,1.9,2.1,2.5,3.2,4.2').split(',').map(Number);
let tNow = 0;
if (told) for (const t of TIMES) {
  await p.evaluate(step, Math.max(16, Math.round((t - tNow) * 1000))); tNow = t;
  fr.push(await p.evaluate(SHOT, [16]));
  labels.push(`+${t.toFixed(2)} s (${await p.evaluate(() => { const bt = globalThis.__sim.battle, g = bt && bt.tells.find((q) => q.kind === 'gaze' && q.sea); return g ? (globalThis.__sim.state.t - g.at).toFixed(2) : '-'; })} from landing)`);
}
if (fr.length) await writeFile(join(OUT, `broadside-${TAG}.png`), png(await p.evaluate(strip, [fr, labels])));
// her first boarders: on until they're told, then three moments
const came = await p.evaluate(() => { globalThis.__lumDraw = false; for (let i = 0; i < 900 && !globalThis.__boarders; i++) globalThis.__frame(33); globalThis.__lumDraw = true; return globalThis.__boarders; });
const bf = [], bl = [];
if (came) for (const [ms, lab] of [[16, '+0 s'], [250, '+0.25 s'], [500, '+0.75 s']]) { await p.evaluate(step, ms); bf.push(await p.evaluate(SHOT, [16])); bl.push(lab); }
if (bf.length) await writeFile(join(OUT, `boarders-${TAG}.png`), png(await p.evaluate(strip, [bf, bl])));
await b.close(); if (srv) srv.close();
console.log(JSON.stringify({ ...info, broadsides: told, boarders: came, errs: errs.slice(0, 5) }));
