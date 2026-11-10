// stage.mjs — the Stage's sheets (docs/art-review.md).
//   --show icons|faces (src/dev/review.js): every item icon, or every portrait and character-window figure, as the UI shows
//     them, the whole grid in one tall still → <out>/sheet.png
//   --show cast (src/dev/stage.js, the owner 2026-11-10): the cast lined up in a real dungeon room on Luminati, drawn by
//     the game's own path (renderer.js setStage → hybrid.js → world.js's figures), each clip held at a moment, every page
//     → <out>/p<page>-<clip>.png and <out>/sheet.jpg (a row a clip, a column a page, cropped to the lineup)
//
//   node tools/capture/stage.mjs [--show icons|faces] [--match s] [--size 1280x900] [--out dir]
//   node tools/capture/stage.mjs --show cast [--cast vermin,party|town|foes|bosses|all|<actor>,…] [--match s]
//        [--clips idle,walk,attack,attack2,heavy,hit,death] [--at 0.5] [--frames N] [--per 8] [--cols 4] [--gap 4.5] [--dir 2]
//        [--site barrows] [--floor 0] [--room big|entrance|<part>] [--size 900x700] [--dpr 2] [--labels 0]
//     --at: how far through each clip it's held (0–1; default 0.5); --frames N: one clip (the first of --clips) at N
//     moments through it instead, a column each
//   --show fx (src/dev/stage.js show=fx): the live effects, a real fight with only the chosen skills in play; for each
//     skill, from its first cast in view, frames at +0, 0.15, 0.3, 0.5, 0.8, 1.2 s cropped round it
//     → <out>/<skill>.png strips and <out>/sheet.jpg (a row a skill)
//   node tools/capture/stage.mjs --show fx [--skills all|<id>,…] [--cls mage] [--lv 15] [--with fighter,cleric] [--wait 40]
//        [--site barrows] [--floor 0] [--room big] [--size 600x700] [--dpr 1]
//     --wait: the most sim seconds given a skill to fire before it's skipped (noted on the sheet)
//   --show fx --foes firebeetle,golem,…  a row a kind: a room of that kind alone against a plain party, from its first
//     heavy blow or shot (else a blow) · --bosses rat_king,spider_queen: a row a boss in a hall, from his mechanic (else
//     a heavy blow). A page a row (the room's family is set as the page starts)
//
// Needs Chromium (playwright's, or /opt/pw-browsers/chromium where `playwright install` can't run).
import { createServer } from 'node:http';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, extname, normalize, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i > 0 ? process.argv[i + 1] : d; };
const show = ['faces', 'cast', 'fx'].includes(arg('show', 'icons')) ? arg('show', 'icons') : 'icons', match = arg('match', '');
const [W, H] = arg('size', show === 'cast' ? '900x700' : show === 'fx' ? '600x700' : '1280x900').split('x').map(Number), DPR = +arg('dpr', show === 'cast' ? '2' : '1');
const out = resolve(arg('out', join(ROOT, 'tools/capture/out', `${show}${match ? '-' + match : ''}`)));
await mkdir(out, { recursive: true });
const t0 = Date.now(), secs = () => ((Date.now() - t0) / 1000).toFixed(1) + ' s';

const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.css': 'text/css', '.woff2': 'font/woff2', '.glb': 'model/gltf-binary', '.mp3': 'audio/mpeg' };
const srv = createServer(async (req, res) => {
  const p = normalize(join(ROOT, decodeURIComponent(req.url.split('?')[0])));
  if (!p.startsWith(ROOT)) { res.writeHead(403); res.end(); return; }
  try { const b = await readFile(p); res.writeHead(200, { 'Content-Type': MIME[extname(p)] || 'application/octet-stream' }); res.end(b); } catch { res.writeHead(404); res.end(); }
});
await new Promise((r) => srv.listen(0, '127.0.0.1', r));
const base = `http://localhost:${srv.address().port}`;
const exe = ['/opt/pw-browsers/chromium'].find((p) => existsSync(p));
// (the cast is drawn by Luminati: WebGL in software where there's no GPU)
const b = await chromium.launch({ ...(exe ? { executablePath: exe } : {}), ...(show === 'cast' || show === 'fx' ? { args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] } : {}) });
const page = await b.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: DPR });
page.setDefaultTimeout(180000);
const errs = []; page.on('pageerror', (e) => errs.push(e.message));

if (show === 'fx') {
  const { SKILLS } = await import('../../src/sim/skills.js');
  const cls = arg('cls', ''), wanted = arg('skills', 'all'), FOES = arg('foes', ''), BOSSES = arg('bosses', '');
  const ids = FOES ? FOES.split(',') : BOSSES ? BOSSES.split(',') : cls ? SKILLS[cls].map((q) => q.id) : wanted === 'all' ? Object.values(SKILLS).flat().map((q) => q.id) : wanted.split(',');
  const rowQuery = (id) => FOES ? { foes: id } : BOSSES ? { boss: id } : null;   // (a page a row: its own room)
  // which of a row's moments to shoot: a creature's heavy blow or shot before a plain one; a boss's mechanic first
  const pickOf = (id) => (FOES ? (L) => L.find((q) => q.id === id + ':heavy' || q.id === id + ':shot') || L.find((q) => q.id.startsWith(id + ':'))
    : BOSSES ? (L) => L.find((q) => q.id === id + ':swarm' || q.id === id + ':call') || L.find((q) => q.id === id + ':heavy')
      : (L) => L.find((q) => q.id === id && q.at === 'cast') || L.find((q) => q.id === id));
  const AT = [0, 150, 300, 500, 800, 1200], WAIT = +arg('wait', '40'), CW = 300, CH = 260;
  const open = async (extra) => {
    const q = new URLSearchParams({ ...(extra ? {} : { skill: ids[0], with: arg('with', 'fighter,cleric') }), lv: arg('lv', extra ? '6' : '15'), site: arg('site', 'barrows'), ...(arg('floor') ? { floor: arg('floor') } : extra && extra.boss ? {} : { floor: '0' }), room: arg('room', 'big'), ...(extra || {}) });
    await page.goto(`${base}/index.html?dev&manual&notitle&scene=stage&show=fx&${q}`);
    await page.waitForFunction(() => typeof globalThis.__frame === 'function' && globalThis.__stage && globalThis.__stage.ready);
    await page.evaluate(async () => { const end = performance.now() + 180000; globalThis.__lumDraw = false;
      while (!(globalThis.__world3d?.world && !globalThis.__renderer.transiting && globalThis.__world3d.world.stats.level >= 1) && performance.now() < end) { for (let i = 0; i < 4; i++) globalThis.__frame(16); await new Promise((r) => setTimeout(r, 0)); } });
  };
  if (!FOES && !BOSSES) await open(null);
  // (stepped, not drawn, between shots; a shot's frame drawn and taken in one task, cropped round the effect)
  const advance = (ms) => page.evaluate((ms) => { globalThis.__lumDraw = false; for (let t = 0; t < ms; t += 33) globalThis.__frame(33); globalThis.__lumDraw = true; }, ms);
  const take = (c) => page.evaluate(([c, CW, CH]) => {
    globalThis.__frame(16);
    const R = globalThis.__renderer, a = R.screenAt(c.x, c.y), b = R.screenAt(c.tx, c.ty), f = c.id.endsWith(':shot') ? 0.55 : c.id.includes(':') ? 0.3 : 0.5, cx = a[0] + (b[0] - a[0]) * f, cy = a[1] + (b[1] - a[1]) * f - (c.id.includes(':') ? 40 : 20), d = devicePixelRatio;   // (a creature's: round the striker, it's what's being looked at)
    const cv0 = document.createElement('canvas'); cv0.width = CW * d; cv0.height = CH * d; const g = cv0.getContext('2d'); g.fillStyle = '#000'; g.fillRect(0, 0, cv0.width, cv0.height);
    for (const cv of document.querySelectorAll('canvas')) { const st = getComputedStyle(cv), r = cv.getBoundingClientRect(); if (cv === cv0 || st.display === 'none' || r.width * r.height < innerWidth * innerHeight * 0.5) continue; g.drawImage(cv, (r.left - (cx - CW / 2)) * d, (r.top - (cy - CH / 2)) * d, r.width * d, r.height * d); }
    return cv0.toDataURL('image/png');
  }, [c, CW, CH]);
  const inView = (c) => page.evaluate((c) => { const [sx, sy] = globalThis.__renderer.screenAt(c.x, c.y); return sx > 60 && sx < innerWidth - 60 && sy > 80 && sy < innerHeight - 60; }, c);
  const rows = [];
  for (const id of ids) {
    if (rowQuery(id)) await open(rowQuery(id)); else await page.evaluate((id) => globalThis.__stage.set({ skill: id }), id);
    let c = null; const pick = pickOf(id);
    for (let t = 0; t < WAIT * 1000 && !c; t += 250) {
      await advance(250);
      const L = await page.evaluate(() => globalThis.__stage.casts), late = t > WAIT * 700;   // (a creature's heavy blow or shot, waited for; a plain blow only late)
      const got = (FOES || BOSSES) && !late ? L.find((q) => q.id === id + (BOSSES ? ':swarm' : ':heavy') || q.id === id + (BOSSES ? ':call' : ':shot')) : pick(L.slice().reverse());   // (late: the latest, where they are now)
      if (got && await inView(got)) c = got;
    }
    if (!c) { console.log(`${secs().padStart(8)}  ${id}: didn't fire in ${WAIT} s`); rows.push({ id, frames: [] }); continue; }
    const frames = []; let last = 0;
    for (const at of AT) { await advance(at - last); last = at; frames.push(await take(c)); }
    const strip = await page.evaluate(async (fr) => { const ims = await Promise.all(fr.map(async (u) => { const i = new Image(); i.src = u; await i.decode(); return i; }));
      const c = document.createElement('canvas'); c.width = ims[0].width * ims.length; c.height = ims[0].height; const g = c.getContext('2d'); ims.forEach((im, i) => g.drawImage(im, i * im.width, 0)); return c.toDataURL('image/png'); }, frames);
    await writeFile(join(out, `${id}.png`), Buffer.from(strip.split(',')[1], 'base64'));
    rows.push({ id: FOES || BOSSES ? c.id : id, frames });
    console.log(`${secs().padStart(8)}  ${FOES || BOSSES ? c.id : id}: at ${c.t.toFixed(1)} s (sim)`);
  }
  const jpg = await page.evaluate(async ([rows, AT]) => {
    const lab = 150, d = devicePixelRatio, w = 300 * d, h = 260 * d, c = document.createElement('canvas'); c.width = lab + AT.length * w; c.height = 24 + rows.length * h;
    const g = c.getContext('2d'); g.fillStyle = '#14121a'; g.fillRect(0, 0, c.width, c.height); g.font = '14px sans-serif'; g.fillStyle = '#ddd';
    AT.forEach((a, i) => g.fillText(`+${(a / 1000).toFixed(2)} s`, lab + i * w + 6, 17));
    for (const [r, row] of rows.entries()) { g.fillStyle = '#ddd'; g.fillText(row.id, 6, 24 + r * h + h / 2); if (!row.frames.length) { g.fillStyle = '#887'; g.fillText("didn't fire", lab + 6, 24 + r * h + h / 2); }
      for (const [i, u] of row.frames.entries()) { const im = new Image(); im.src = u; await im.decode(); g.drawImage(im, lab + i * w, 24 + r * h); } }
    return c.toDataURL('image/jpeg', 0.85);
  }, [rows, AT]);
  await writeFile(join(out, 'sheet.jpg'), Buffer.from(jpg.split(',')[1], 'base64'));
  console.log(`fx: ${out}/sheet.jpg (${rows.filter((r) => r.frames.length).length} of ${ids.length} skills) in ${secs()}${errs.length ? ' · ERRORS ' + errs.join(' | ') : ''}`);
} else if (show !== 'cast') {
  await page.goto(`${base}/index.html?dev&scene=stage&${new URLSearchParams({ show, match, panel: '0' })}`);
  await page.waitForFunction(() => !!globalThis.__stage && globalThis.__stage.ready);
  await page.waitForFunction(() => [...document.querySelectorAll('#reviewGrid img')].every((im) => im.complete));
  // the grid scrolls inside a fixed box (the game's page never scrolls): grow the window to the grid's height
  const tall = await page.evaluate(() => { const g = document.getElementById('reviewGrid'); g.style.inset = '8px 8px auto'; g.style.overflow = 'visible'; return Math.ceil(g.scrollHeight) + 16; });
  await page.setViewportSize({ width: W, height: tall });
  await page.waitForTimeout(800);
  await page.screenshot({ path: join(out, 'sheet.png') });
  console.log(`${show}: ${out}/sheet.png${errs.length ? ' · ERRORS ' + errs.join(' | ') : ''}`);
} else {
  const clips = arg('clips', 'idle,walk,attack,attack2,heavy,hit,death').split(','), frames = +arg('frames', 0), at = +arg('at', 0.5);
  // the columns: each clip held at --at, or one clip at --frames moments through it
  const cols = frames ? Array.from({ length: frames }, (_, i) => ({ clip: clips[0], at: frames === 1 ? at : i / (frames - 1) * 0.999, label: `${clips[0]} ${Math.round((i / Math.max(1, frames - 1)) * 100)} %` })) : clips.map((c) => ({ clip: c, at, label: c }));
  const q = new URLSearchParams({ cast: arg('cast', 'vermin,party'), match, per: arg('per', '8'), cols: arg('cols', '4'), gap: arg('gap', '4.5'), dir: arg('dir', '2'), site: arg('site', 'barrows'), floor: arg('floor', '0'), room: arg('room', 'big'), labels: arg('labels', '1') });
  await page.goto(`${base}/index.html?dev&manual&notitle&scene=stage&show=cast&${q}`);
  await page.waitForFunction(() => typeof globalThis.__frame === 'function' && globalThis.__stage && globalThis.__stage.ready);
  // frames until the floor is built and every figure on the page stands as its model (stepped, not drawn: a software
  // frame takes a second to draw)
  const settle = () => page.evaluate(async () => {
    const end = performance.now() + 180000, S = globalThis.__stage; globalThis.__lumDraw = false;
    const ok = () => { const H3 = globalThis.__world3d; if (!H3 || !H3.world || globalThis.__renderer.transiting) return false; const st = H3.world.stats; return S.names.every((n) => st.modelNames.includes(n)) || st.figures === 'sprites'; };
    while (!ok() && performance.now() < end) { for (let i = 0; i < 4; i++) globalThis.__frame(16); await new Promise((r) => setTimeout(r, 0)); }
    globalThis.__lumDraw = true; return ok();
  });
  // the frame drawn and taken in one task: the world's canvas and the overlay, then the labels (HTML) written over
  const take = () => page.evaluate(() => {
    globalThis.__frame(33); globalThis.__frame(33);
    const k = devicePixelRatio, c = document.createElement('canvas'); c.width = innerWidth * k; c.height = innerHeight * k;
    const g = c.getContext('2d'); g.fillStyle = '#000'; g.fillRect(0, 0, c.width, c.height);
    for (const cv of document.querySelectorAll('canvas')) { const st = getComputedStyle(cv), r = cv.getBoundingClientRect(); if (cv === c || st.display === 'none' || r.width * r.height < innerWidth * innerHeight * 0.5) continue; g.drawImage(cv, r.left * k, r.top * k, r.width * k, r.height * k); }
    g.font = `600 ${11 * k}px system-ui, sans-serif`; g.textAlign = 'center'; g.lineWidth = 3 * k; g.strokeStyle = '#0d0913'; g.fillStyle = '#e8e2f0';
    // (the lineup's box: round the figures' feet, from the labels' places, which stand under them; a figure's height up)
    let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
    for (const f of globalThis.__stage.figures) { const q = globalThis.__world3d.probe(f.x, f.y); if (!q || !q.luminati) continue; x0 = Math.min(x0, q.luminati[0]); x1 = Math.max(x1, q.luminati[0]); y0 = Math.min(y0, q.luminati[1]); y1 = Math.max(y1, q.luminati[1]); }
    const box = [Math.max(0, x0 - 60) * k, Math.max(0, y0 - 80) * k, Math.min(innerWidth, x1 + 60) * k, Math.min(innerHeight, y1 + 26) * k];
    if (globalThis.__stageLabelsOn !== false) for (const el of document.querySelectorAll('#stageLabels > div')) { const x = parseFloat(el.style.left) * k, y = (parseFloat(el.style.top) + 11) * k; g.strokeText(el.textContent, x, y); g.fillText(el.textContent, x, y); }
    return { png: c.toDataURL('image/png'), box };
  });
  const pages = await page.evaluate(() => globalThis.__stage.pages), sheet = [];
  for (let pg = 1; pg <= pages; pg++) {
    const row = [];
    for (const col of cols) {
      await page.evaluate(([pg, col]) => globalThis.__stage.set({ page: pg, clip: col.clip, at: col.at }), [pg, col]);
      const built = await settle();
      const { png, box } = await take(), file = join(out, `p${pg}-${col.label.replace(/[ %]+/g, '')}.png`);
      await writeFile(file, Buffer.from(png.split(',')[1], 'base64'));
      row.push({ src: png, box, label: `${col.label}${pages > 1 ? ' · page ' + pg : ''}` });
      console.log(`${secs().padStart(8)}  page ${pg}/${pages} ${col.label}${built ? '' : ' (not every model in)'}`);
    }
    sheet.push(row);
  }
  // the sheet: a row a clip (or a moment), a column a page, each shot cropped to its page's lineup
  const jpg = await page.evaluate(async (pagesRows) => {
    const rows = pagesRows[0].map((_, ci) => pagesRows.map((r) => r[ci]));
    const ims = await Promise.all(rows.flat().map(async (q) => { const im = new Image(); im.src = q.src; await im.decode(); return im; }));
    const B = pagesRows.map((r) => r[0].box), cw = Math.max(...B.map((b) => b[2] - b[0])), ch = Math.max(...B.map((b) => b[3] - b[1])), lab = 22;
    const c = document.createElement('canvas'); c.width = rows[0].length * cw; c.height = rows.length * (ch + lab);
    const g = c.getContext('2d'); g.fillStyle = '#14121a'; g.fillRect(0, 0, c.width, c.height); g.font = '15px sans-serif';
    rows.flat().forEach((q, i) => { const x = (i % rows[0].length) * cw, y = Math.floor(i / rows[0].length) * (ch + lab), b = q.box; g.drawImage(ims[i], b[0], b[1], b[2] - b[0], b[3] - b[1], x, y + lab, b[2] - b[0], b[3] - b[1]); g.fillStyle = '#ddd'; g.fillText(q.label, x + 6, y + 16); });
    return c.toDataURL('image/jpeg', 0.88);
  }, sheet);
  await writeFile(join(out, 'sheet.jpg'), Buffer.from(jpg.split(',')[1], 'base64'));
  console.log(`cast: ${out}/sheet.jpg (${pages} page${pages > 1 ? 's' : ''} × ${cols.length}) in ${secs()}${errs.length ? ' · ERRORS ' + errs.join(' | ') : ''}`);
}
await b.close(); srv.close();
