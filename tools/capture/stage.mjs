// stage.mjs — the art review's sheets (src/dev/review.js, docs/art-review.md): every item icon, or every portrait and
// character-window figure, as the UI shows them, the whole grid in one tall still.
//
//   node tools/capture/stage.mjs [--show icons|faces] [--match s] [--size 1280x900] [--out dir]
//
// Writes <out>/sheet.png (default tools/capture/out/<show>[-<match>]/). The Stage's cast lineup and its env, props and fx
// views drew through Emberlit's painting, and went with it (docs/luminati-only-cleanup.md step 4).
// Needs Chromium (playwright's, or /opt/pw-browsers/chromium where `playwright install` can't run).
import { createServer } from 'node:http';
import { readFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, extname, normalize, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i > 0 ? process.argv[i + 1] : d; };
const show = arg('show', 'icons') === 'faces' ? 'faces' : 'icons', match = arg('match', ''), [W, H] = arg('size', '1280x900').split('x').map(Number);
const out = resolve(arg('out', join(ROOT, 'tools/capture/out', `${show}${match ? '-' + match : ''}`)));
await mkdir(out, { recursive: true });

const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.png': 'image/png', '.css': 'text/css', '.woff2': 'font/woff2' };
const srv = createServer(async (req, res) => {
  const p = normalize(join(ROOT, decodeURIComponent(req.url.split('?')[0])));
  if (!p.startsWith(ROOT)) { res.writeHead(403); res.end(); return; }
  try { const b = await readFile(p); res.writeHead(200, { 'Content-Type': MIME[extname(p)] || 'application/octet-stream' }); res.end(b); } catch { res.writeHead(404); res.end(); }
});
await new Promise((r) => srv.listen(0, '127.0.0.1', r));
const exe = ['/opt/pw-browsers/chromium'].find((p) => existsSync(p));
const b = await chromium.launch({ ...(exe ? { executablePath: exe } : {}) });
const page = await b.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: +arg('dpr', '1') });
page.setDefaultTimeout(120000);
const errs = []; page.on('pageerror', (e) => errs.push(e.message));
await page.goto(`http://localhost:${srv.address().port}/index.html?dev&scene=stage&${new URLSearchParams({ show, match, panel: '0' })}`);
await page.waitForFunction(() => !!globalThis.__stage && globalThis.__stage.ready);
await page.waitForFunction(() => [...document.querySelectorAll('#reviewGrid img')].every((im) => im.complete));
// the grid scrolls inside a fixed box (the game's page never scrolls): grow the window to the grid's height
const tall = await page.evaluate(() => { const g = document.getElementById('reviewGrid'); g.style.inset = '8px 8px auto'; g.style.overflow = 'visible'; return Math.ceil(g.scrollHeight) + 16; });
await page.setViewportSize({ width: W, height: tall });
await page.waitForTimeout(800);
await page.screenshot({ path: join(out, 'sheet.png') });
console.log(`${show}: ${out}/sheet.png${errs.length ? ' · ERRORS ' + errs.join(' | ') : ''}`);
await b.close(); srv.close();
