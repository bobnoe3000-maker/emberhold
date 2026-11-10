// gear.mjs — the gear sheet (docs/character-look-plan.md §6–8): every piece of gear worn on its class's figure in the
// game's own preview, a figure a piece, the rest of the class's kit as it sets out. For making and judging the pieces
// (props.js, gear.js) at the size they're seen in the character window; a back view for what hangs behind (a quiver).
//   node tools/capture/gear.mjs [--cls fighter,cleric|all] [--slot helm,weapon,…] [--only base,base] [--rarity heirloom] [--back] [--big] [--per 12] [--out dir]
// → tools/capture/out/gear/sheet-<n>.png (needs the bundle built: node tools/render3d/build.mjs)
import { createServer } from 'node:http';
import { readFile, mkdir } from 'node:fs/promises';
import { join, extname, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { BASES, STARTER, STARTER_LOOK } from '../../src/sim/items.js';

const ROOT = fileURLToPath(new URL('../..', import.meta.url));
const args = process.argv.slice(2), opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const CLS = opt('--cls', 'all'), SLOTS = opt('--slot', null), ONLY = opt('--only', null), R = opt('--rarity', 'common'), PER = +opt('--per', 12);
const OUT = opt('--out', join(ROOT, 'tools/capture/out/gear')), BACK = args.includes('--back'), BIG = args.includes('--big');
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.glb': 'model/gltf-binary', '.gltf': 'model/gltf+json', '.bin': 'application/octet-stream' };
const srv = createServer(async (req, res) => {
  const p = normalize(decodeURIComponent(new URL(req.url, 'http://x').pathname)).replace(/^([/\\])+/, '');
  try { const b = await readFile(join(ROOT, p)); res.writeHead(200, { 'content-type': MIME[extname(p)] || 'application/octet-stream' }); res.end(b); } catch { res.writeHead(404); res.end(); }
});
await new Promise((r) => srv.listen(0, r));
const base = `http://localhost:${srv.address().port}`;

const ACTOR = { fighter: 'hero_knight', rogue: 'hero_rogue', mage: 'hero_mage', cleric: 'hero_cleric', shaman: 'hero_shaman' };
const it = (b) => (b ? { base: b, r: R, up: 0 } : null);
const kitOf = (cls) => { const k = STARTER_LOOK[ACTOR[cls]] || STARTER[cls]; return { weapon: it(k.weapon), off: it(k.off), helm: it(k.helm), armor: it(k.armor), boots: it(k.boots), trinket: null }; };
const cases = [];
for (const cls of (CLS === 'all' ? Object.keys(ACTOR) : CLS.split(','))) {
  cases.push({ actor: ACTOR[cls], gear: kitOf(cls), label: `${cls}: as it sets out`, yaw: BACK ? 3.4 : undefined });
  for (const [b, B] of Object.entries(BASES)) {
    if (B.slot === 'use' || (B.cls !== cls && B.cls !== 'any' && !(B.also || []).includes(cls))) continue;
    if (SLOTS && !SLOTS.split(',').includes(B.slot)) continue; if (ONLY && !ONLY.split(',').includes(b)) continue;
    const g = kitOf(cls); g[B.slot] = it(b); if (B.hands === 2) g.off = null;
    cases.push({ actor: ACTOR[cls], gear: g, label: `${cls}: ${B.name}`, yaw: BACK ? 3.4 : undefined });
  }
}
const b = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--max-active-webgl-contexts=32'] });
const page = await b.newPage({ viewport: { width: 1260, height: 900 }, deviceScaleFactor: 1 });
page.on('console', (m) => { if (/gear|rror/.test(m.text())) console.log('[page]', m.text()); });
await page.goto(`${base}/tools/capture/gear.html`);
if (BIG) await page.addStyleTag({ content: '.c{width:300px}.c canvas{width:300px;height:380px}' });   // (--big: a closer look, four a row)
await mkdir(OUT, { recursive: true });
for (let i = 0, n = 0; i < cases.length; i += PER, n++) {
  const part = cases.slice(i, i + PER);
  await page.evaluate((c) => window.__show(c), part);
  await page.waitForTimeout(1500);
  const h = await page.evaluate(() => document.getElementById('g').scrollHeight + 12);
  await page.setViewportSize({ width: 1260, height: h });
  await page.screenshot({ path: join(OUT, `sheet-${n}.png`), timeout: 120000 });
  await page.evaluate(() => window.__close());
  console.log(`sheet-${n}.png: ${part.map((c) => c.label).join(' · ')}`);
}
await b.close(); srv.close();
