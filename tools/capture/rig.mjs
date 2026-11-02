// rig.mjs — many shots of the game fast: one page a renderer, every scene, floor and hour reached inside it.
//
// The owner (2026-11-01): "Can you rig up something to speed up the time so you can take shots faster?" Measured on the
// cloud box (4 cores, software GL), a shot by tools/dungeon/capture.mjs cost minutes. A frame is only 5–7 ms. The time
// went on:
//   · a page load and a level built from nothing for every shot: 15–25 s (Luminati boots its whole game);
//   · Playwright's screenshot: 6–7 s, and it timed out at 3 min when the box was busy;
//   · a round trip from node into the page for every frame (~160 ms), hundreds of them while a level built.
// So the rig keeps one page open for each renderer and moves the sim between worlds with restore (a floor or a town in
// about 3 s). It holds each hour with the dev hook __tod, with no reload. It drives every frame inside the page,
// yielding to the page's own tasks so its fetches and builds go on. It takes the picture by drawing the page's canvases
// onto one, in the frame's own task (Luminati's canvas keeps no buffer). Both renderers run side by side, a browser
// each. A shot with `hud` is a Playwright screenshot after all, with the top bar and cards.
//
//   node tools/capture/rig.mjs [preset|shots.json] [--renderer both|luminati|emberlit] [--out dir] [--dpr 1|2]
//                              [--base http://localhost:8080] [--sheet] [--settle 40]
//
// presets: vale (the Hollow Vale for art critic pass 19: Thornwick and the Vale at each hour, a fighting room on six
// dungeon floors), vale-hours, vale-dungeons, smoke (one of each). A shots file is a JSON array of
//   { "name": "barrows-f1", "scene": "dungeon", "site": "barrows", "floor": 1, "region": "vale",
//     "tod": "dusk", "at": "room" | "medium" | "entrance" | "spawn" | [x, y], "hud": false, "bright": 1.2 }
// (bright: Luminati's brightness on top of the Vale's grade, world.js settings({ bright }); 1 when left out. set: any
// other world.js settings for the shot, e.g. { "figLit": 1.2 }. --stats: each shot's world.js stats in the log)
// Out: <out>/<renderer>/<name>.png, and with --sheet <out>/sheet.jpg (a row a shot, a column a renderer). With no
// --base it serves the repo itself. Needs ?dev, so localhost only, as every dev hook.
import { createServer } from 'node:http';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { readFileSync } from 'node:fs';
import { join, extname, normalize, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const ROOT = fileURLToPath(new URL('../..', import.meta.url));
const args = process.argv.slice(2), opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const flag = (k) => args.includes(k);
const WHAT = args[0] && !args[0].startsWith('--') ? args[0] : 'smoke';
const RENDERERS = (opt('--renderer', 'both') === 'both' ? 'emberlit,luminati' : opt('--renderer')).split(',');
const OUT = resolve(opt('--out', join(ROOT, 'tools/capture/out/rig'))), DPR = +opt('--dpr', 1), SETTLE = +opt('--settle', 40);
const HOURS = ['dawn', 'day', 'dusk', 'night'];
const FLOORS = [['barrows', 0], ['barrows', 1], ['wickham_keep', 0], ['wickham_keep', 1], ['sunken_chapel', 0], ['sunken_chapel', 1]];   // (the Vale's six floors, two a dungeon: plans.js)
const PRESETS = {
  'vale-hours': ['town', 'overland'].flatMap((scene) => HOURS.map((tod) => ({ name: `${scene}-${tod}`, scene, region: 'vale', tod, at: 'spawn' }))),
  'vale-dungeons': FLOORS.map(([site, floor]) => ({ name: `${site}-f${floor}`, scene: 'dungeon', site, floor, region: 'vale', tod: 'dusk', at: 'room' })),
  smoke: [{ name: 'town-day', scene: 'town', region: 'vale', tod: 'day', at: 'spawn' }, { name: 'barrows-f0', scene: 'dungeon', site: 'barrows', floor: 0, tod: 'dusk', at: 'room' }],
};
PRESETS.vale = [...PRESETS['vale-hours'], ...PRESETS['vale-dungeons']];
const SHOTS = PRESETS[WHAT] || JSON.parse(readFileSync(WHAT, 'utf8'));

// the repo served, as the browser suite serves it (ES modules need a server)
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
const t0 = Date.now(), log = (r, m) => console.log(`${((Date.now() - t0) / 1000).toFixed(1).padStart(6)}s ${r.padEnd(8)} ${m}`);

// ── in the page ─────────────────────────────────────────────────────────────────────────────────────────────────────
// frames run here, in the page, a few at a time between yields (its fetches and level builds go on in between)
const PAGE = {
  /** move the sim to a world (a restore of its own save with another scene, region, site or floor), then frame until it's
   *  built: Emberlit's bake done and, with Luminati, its level */
  async goTo(s) {
    const sim = globalThis.__sim, w = sim.world, want = { scene: s.scene, region: s.region || w.region || 'vale', site: s.site || w.site, depth: s.floor ?? 0 };
    const here = sim.state.scene === want.scene && (want.scene === 'dungeon' ? w.site === want.site && w.depth === want.depth : (w.region || 'vale') === want.region);
    const loads = globalThis.__world3d ? globalThis.__world3d.state.loads : 0;
    if (!here) sim.restore({ ...JSON.parse(JSON.stringify(sim.snapshot())), ...want });
    const done = () => !globalThis.__renderer.transiting && (!globalThis.__world3d || (globalThis.__world3d.state.loads > (here ? loads - 1 : loads) && globalThis.__world3d.world?.stats.level >= globalThis.__world3d.state.loads));
    const end = performance.now() + 120000;
    globalThis.__lumDraw = false;                              // (built, not drawn: the shot's own frames draw it)
    while (!done() && performance.now() < end) { for (let i = 0; i < 4; i++) globalThis.__frame(16); await new Promise((r) => setTimeout(r, 0)); }
    globalThis.__lumDraw = true;
    return done();
  },
  /** the hour held, the party stood (the spawn, or found as tools/dungeon/capture.mjs finds them: the first fighting room,
   *  a medium room), then a few frames to settle (a page function: each is sent to the page on its own) */
  prep([tod, at, n, bright, set]) {
    globalThis.__tod(tod);
    globalThis.__world3d?.world?.settings({ bright: bright || 1, ...set });
    const sim = globalThis.__sim, w = sim.world, P = sim.state.player;
    let x = P.x, y = P.y;
    if (Array.isArray(at)) [x, y] = at;
    else if (w.kind === 'dungeon' && at !== 'spawn') {
      const L = w.level, lv = w.roomLevels;
      const pick = at === 'entrance' ? L.entrance : at === 'medium' ? L.rooms.find((r) => r.size === 'medium' && r !== L.entrance && r !== L.descentRoom)
        : L.rooms.filter((r) => r !== L.entrance).sort((a, b) => (lv.get(a.id) - lv.get(b.id)) || (Math.hypot(a.cx - L.entrance.cx, a.cy - L.entrance.cy) - Math.hypot(b.cx - L.entrance.cx, b.cy - L.entrance.cy)))[0];
      if (pick) { x = pick.cx + 0.5; y = pick.cy + 2.5; }
    }
    P.x = P.px = x; P.y = P.py = y;
    sim.state.party.forEach((m, i) => { if (m !== P) { m.x = m.px = x + 1.2 * i; m.y = m.py = y + 1; } });
    // (Luminati stepped but not drawn while it settles: in software GL its frame takes over a second to draw; the last two drawn)
    for (let i = 0; i < n; i++) { globalThis.__lumDraw = i >= n - 2; globalThis.__frame(33); }
    globalThis.__lumDraw = true;
    return [x, y];
  },
  /** the frame drawn and taken in one task: every canvas on the page, in the page's order, onto one */
  take() {
    globalThis.__frame(33);
    const c = document.createElement('canvas'); c.width = innerWidth * devicePixelRatio; c.height = innerHeight * devicePixelRatio;
    const g = c.getContext('2d');
    g.fillStyle = '#000'; g.fillRect(0, 0, c.width, c.height);
    for (const cv of document.querySelectorAll('canvas')) {
      const st = getComputedStyle(cv), r = cv.getBoundingClientRect();
      // (the world's and the overlay's: full-screen; the party cards' small figures are the HUD's, left to `hud` shots)
      if (cv === c || st.display === 'none' || st.visibility === 'hidden' || +st.opacity === 0 || r.width * r.height < innerWidth * innerHeight * 0.5) continue;
      g.drawImage(cv, r.left * devicePixelRatio, r.top * devicePixelRatio, r.width * devicePixelRatio, r.height * devicePixelRatio);
    }
    return c.toDataURL('image/png');
  },
};

async function run(renderer) {
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const p = await b.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: DPR });
  const errs = []; p.on('pageerror', (e) => errs.push(String(e)));
  const first = SHOTS[0];
  await p.goto(`${base}/index.html?dev&manual&notitle&scene=${first.scene}&region=${first.region || 'vale'}${first.site ? '&site=' + first.site : ''}${renderer === 'luminati' ? '&renderer=luminati' : ''}`);
  await p.waitForFunction(() => typeof globalThis.__frame === 'function' && globalThis.__sim, null, { timeout: 120000 });
  log(renderer, 'page up');
  await mkdir(join(OUT, renderer), { recursive: true });
  for (const s of SHOTS) {
    const ok = await p.evaluate(PAGE.goTo, s).catch((e) => (errs.push(String(e)), false));
    await p.evaluate(PAGE.prep, [s.tod || null, s.at || 'spawn', SETTLE, s.bright || 1, s.set || {}]);
    const file = join(OUT, renderer, `${s.name}.png`);
    if (s.hud) await p.screenshot({ path: file, timeout: 300000 });
    else await writeFile(file, Buffer.from((await p.evaluate(PAGE.take)).split(',')[1], 'base64'));
    const st = flag('--stats') ? await p.evaluate(() => globalThis.__world3d?.world?.stats ?? null) : null;
    log(renderer, `${s.name}${ok ? '' : ' (not built in 2 min)'}${st ? ' ' + JSON.stringify(st) : ''}`);
  }
  if (errs.length) log(renderer, 'page errors: ' + errs.slice(0, 3).join(' | '));
  await b.close();
}

await Promise.all(RENDERERS.map(run));
if (flag('--sheet')) {
  // a row a shot, a column a renderer, drawn in a page (no image library in the repo)
  const b = await chromium.launch(), p = await b.newPage();
  const cells = SHOTS.map((s) => RENDERERS.map((r) => ({ label: `${s.name} · ${r}`, src: 'data:image/png;base64,' + readFileSync(join(OUT, r, `${s.name}.png`)).toString('base64') })));
  const jpg = await p.evaluate(async (cells) => {
    const ims = await Promise.all(cells.flat().map(async (q) => { const im = new Image(); im.src = q.src; await im.decode(); return im; }));
    const cols = cells[0].length, w = 300, h = Math.round((w * ims[0].height) / ims[0].width), lab = 20;
    const c = document.createElement('canvas'); c.width = cols * w; c.height = cells.length * (h + lab);
    const g = c.getContext('2d'); g.fillStyle = '#111'; g.fillRect(0, 0, c.width, c.height); g.font = '13px sans-serif';
    cells.flat().forEach((q, i) => { const x = (i % cols) * w, y = Math.floor(i / cols) * (h + lab); g.drawImage(ims[i], x, y + lab, w, h); g.fillStyle = '#ddd'; g.fillText(q.label, x + 6, y + 14); });
    return c.toDataURL('image/jpeg', 0.85);
  }, cells);
  await writeFile(join(OUT, 'sheet.jpg'), Buffer.from(jpg.split(',')[1], 'base64'));
  await b.close();
  log('sheet', join(OUT, 'sheet.jpg'));
}
srv?.close();
log('done', `${SHOTS.length} shots × ${RENDERERS.length} renderers → ${OUT}`);
