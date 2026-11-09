// feel.mjs — the feel of a hit measured (docs/combat-fx.md, the feel pass): a motion trace on the manual clock through the
// first heavy blow of a boss on the party in a real fight in his hall, frame by frame at 60 fps: the sim's time (it stands
// still while the world holds: hit-stop), where a fixed point of the floor is on screen (the camera's jolt, CSS px; its
// follow of the hero too) and the foes glowing as they wind up;
// and burst frames of the blow. The sim is deterministic, so a before (--base: another checkout served elsewhere) lines up.
//
//   node tools/capture/feel.mjs [--site wickham_keep] [--depth 0] [--base url] [--out dir] [--feel full|light|off]
//
// Out: <out>/<renderer>-trace.json (one row a frame: ms, sim t, camera x/y, shaking, glowing foes, holds) and
// <out>/<renderer>-strip.png (the blow at +0 … 0.6 s). Needs ?dev, so localhost.
import { createServer } from 'node:http';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { join, extname, normalize, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const ROOT = fileURLToPath(new URL('../..', import.meta.url));
const args = process.argv.slice(2), opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const R = 'luminati',   // (Luminati only, docs/luminati-only-cleanup.md; &renderer=luminati below for a --base from before)
   SITE = opt('--site', 'wickham_keep'), DEPTH = +opt('--depth', 0), FEEL = opt('--feel', 'full');
const OUT = resolve(opt('--out', join(ROOT, 'tools/capture/out/feel')));
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.css': 'text/css', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.mp3': 'audio/mpeg' };
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
const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const p = await b.newPage({ viewport: { width: 390, height: 844 } });
const errs = []; p.on('pageerror', (e) => errs.push(String(e)));
await p.addInitScript((f) => { try { localStorage.setItem('emberfall.graphics', JSON.stringify({ feel: f })); } catch { /* */ } }, FEEL);
await p.goto(`${base}/index.html?dev&manual&notitle&scene=dungeon&site=${SITE}&renderer=luminati`);
await p.waitForFunction(() => typeof globalThis.__frame === 'function' && globalThis.__sim, null, { timeout: 120000 });
const settle = async () => { for (let i = 0; i < 600; i++) { if (await p.evaluate(() => { for (let k = 0; k < 4; k++) globalThis.__frame(16); return !globalThis.__renderer.transiting && (!globalThis.__world3d || globalThis.__world3d.world?.stats.level >= 1); })) return; await p.waitForTimeout(100); } };
await settle();
// the party of the contract (fighter, rogue, cleric) at the hall's level, at its door (as tools/capture/bosses.mjs)
await p.evaluate(async ({ site, depth }) => {
  const sim = globalThis.__sim, { makeHero, makeMember, statsFor } = await import('/src/sim/party.js'), { autoAllocate } = await import('/src/sim/attributes.js'), { starterKit } = await import('/src/sim/items.js');
  if (depth) sim.restore({ ...JSON.parse(JSON.stringify(sim.snapshot())), scene: 'dungeon', site, depth });
  for (let i = 0; i < 4; i++) globalThis.__frame(16);
  const hall = sim.world.level.descentRoom, lv = Math.max(1, sim.world.roomLevels.get(hall.id) || 1);
  sim.state.trials = { fighter: 1, rogue: 1, mage: 1, cleric: 1, shaman: 1, fighter12: 1, rogue12: 1, mage12: 1, cleric12: 1, shaman12: 1 };
  sim.state.party = ['fighter', 'rogue', 'cleric'].map((c, i) => { const m = i ? makeMember('c' + i, ['Wren', 'Tam'][i - 1], c, lv) : makeHero({ cls: c }); m.level = lv; m.attrs = null; m.autoAttrs = true; autoAllocate(m); m.gear = starterKit(m); m.hp = statsFor(m).maxHp; m.mp = statsFor(m).maxMp; return m; });
  const P = sim.state.player; P.x = P.px = hall.cx + 0.5; P.y = P.py = hall.cy + 0.5;
  sim.state.party.forEach((m, i) => { if (m !== P) { m.x = m.px = P.x + (i === 1 ? 1.2 : -1.2); m.y = m.py = P.y + 1; } });
}, { site: SITE, depth: DEPTH });
await settle();
// on to the boss's first heavy blow (his attack starting: the sim's atkN / atkKind, there on any checkout)
const at = await p.evaluate(() => {
  const s = globalThis.__sim; let seen = -1;
  for (let f = 0; f < 60 * 90; f++) {
    globalThis.__frame(1000 / 60);
    const boss = (s.world.enemies || []).find((e) => e.boss && e.hp > 0);
    if (!boss) continue;
    if (seen < 0) seen = boss.atkN || 0;
    if ((boss.atkN || 0) > seen && boss.atkKind === 'heavy' && boss.aim) return { t: s.state.t, x: boss.aim.x, y: boss.aim.y };
    seen = boss.atkN || 0;
  }
  return null;
});
if (!at) { console.log('no heavy blow from the boss in 90 s'); process.exit(1); }
const rows = [], shots = [], SHOTS = [0, 100, 200, 300, 400, 600];
const take = () => p.evaluate(({ x, y }) => { globalThis.__frame(0);   // (drawn in this task, so the canvases still hold it: a frame of no time)
  const [cx, cy] = globalThis.__renderer.screenAt(x, y), W = 300, H = 300, d = devicePixelRatio, c = document.createElement('canvas'); c.width = W * d; c.height = H * d;
  const g = c.getContext('2d'); g.fillStyle = '#000'; g.fillRect(0, 0, c.width, c.height);
  for (const cv of document.querySelectorAll('canvas')) { const st = getComputedStyle(cv), r = cv.getBoundingClientRect(); if (cv === c || st.display === 'none' || r.width * r.height < innerWidth * innerHeight * 0.5) continue; g.drawImage(cv, (r.left - (cx - W / 2)) * d, (r.top - (cy - 20 - H / 2)) * d, r.width * d, r.height * d); }
  return c.toDataURL('image/png'); }, at);
for (let f = 0; f <= 54; f++) {
  const ms = Math.round(f * 1000 / 60);
  if (f) await p.evaluate(() => globalThis.__frame(1000 / 60));
  rows.push(await p.evaluate(({ ms, at }) => { const s = globalThis.__sim, F = globalThis.__renderer.feel || {}, H = globalThis.__holds || { n: 0, ms: 0 }, [cx, cy] = globalThis.__renderer.screenAt(at.x, at.y);   // (a fixed point of the floor on screen: the camera's moves, on any checkout)
    return { ms, t: Math.round(s.state.t * 1000) / 1000, camX: Math.round(cx * 100) / 100, camY: Math.round(cy * 100) / 100, rx: F.jx !== undefined ? Math.round(F.jx * 100) / 100 : null, shaking: !!F.shaking, glow: F.glow || 0, holds: H.n }; }, { ms, at }));
  if (SHOTS.some((m) => Math.abs(m - ms) < 9)) shots.push(await take());
}
await writeFile(join(OUT, `${R}-trace.json`), JSON.stringify({ site: SITE, depth: DEPTH, feel: FEEL, blowAt: at.t, rows }, null, 1));
const strip = await p.evaluate(async (fr) => { const ims = await Promise.all(fr.map(async (u) => { const i = new Image(); i.src = u; await i.decode(); return i; }));
  const c = document.createElement('canvas'); c.width = ims[0].width * ims.length; c.height = ims[0].height; const g = c.getContext('2d'); ims.forEach((im, i) => g.drawImage(im, i * im.width, 0)); return c.toDataURL('image/png'); }, shots);
await writeFile(join(OUT, `${R}-strip.png`), Buffer.from(strip.split(',')[1], 'base64'));
const t0 = rows[0].t, t1 = rows[rows.length - 1].t, cams = rows.map((r) => [r.camX, r.camY]), moved = Math.max(...cams.map(([x, y]) => Math.hypot(x - cams[0][0], y - cams[0][1])));
console.log(`${R} · blow at ${at.t.toFixed(2)} s · 0.9 s of frames: sim ${(t1 - t0).toFixed(3)} s · holds ${rows[rows.length - 1].holds} · camera moved up to ${moved.toFixed(2)} px · frames glowing ${rows.filter((r) => r.glow).length}${errs.length ? ' · page errors ' + errs.slice(0, 2).join(' | ') : ''}`);
await b.close(); srv?.close();
