// icons.cjs — bake the item icons in icons.json → ../../assets/items/<id>.png (see iconlab.js).
// node icons.cjs [--sheet out/icons_sheet.png]   Needs `npm i` + `sh fetch-assets.sh`.
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright-core');
const { serve, CHROME, GL } = require('./render.cjs');
const DIR = __dirname, OUT = path.join(DIR, '..', '..', 'assets', 'items');
(async () => {
  const spec = JSON.parse(fs.readFileSync(path.join(DIR, 'icons.json'))), only = process.argv[2] && !process.argv[2].startsWith('--') ? process.argv[2].split(',') : null;
  const srv = await serve(DIR), port = srv.address().port, b = await chromium.launch({ executablePath: CHROME, args: GL });
  const p = await (await b.newContext({ viewport: { width: 400, height: 400 } })).newPage();
  p.on('pageerror', (e) => console.log('PAGEERR', e.message));
  await p.goto(`http://127.0.0.1:${port}/iconlab.html`); await p.waitForFunction(() => window.ready === true, { timeout: 60000 });
  fs.mkdirSync(OUT, { recursive: true });
  const variants = Object.fromEntries(JSON.parse(fs.readFileSync(path.join(DIR, 'variants.json'))).map((v) => [v.id, v]));
  for (const ic of spec.icons) {
    if (only && !only.includes(ic.id)) continue;
    const s = typeof ic.swatches === 'string' ? { ...ic, swatches: variants[ic.swatches].swatches } : ic;   // "swatches": "C1" = that variant's repaint
    const url = await p.evaluate(async ([s, n]) => await window.bakeIcon(s, n), [s, spec.size]);
    fs.writeFileSync(path.join(OUT, `${ic.id}.png`), Buffer.from(url.split(',')[1], 'base64')); console.log(ic.id);
  }
  await b.close(); srv.close();
})().catch((e) => { console.error('FAIL', e.message); process.exit(1); });
