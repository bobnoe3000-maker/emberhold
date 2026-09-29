// faces.cjs — the face board: every preset in faces.json, then every option of each part (faces.js)
// on one plain figure, rendered as the game's portraits are → out/faces_board.png.
//   node faces.cjs [--scale 2]
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright-core');
const { serve, CHROME, GL } = require('./render.cjs');
const DIR = __dirname, SI = process.argv.indexOf('--scale'), scale = SI > 0 ? +process.argv[SI + 1] : 2;
(async () => {
  if (!fs.existsSync(path.join(DIR, 'models', 'Knight.glb'))) throw new Error('models missing — run: sh fetch-assets.sh');
  const srv = await serve(DIR), port = srv.address().port;
  const b = await chromium.launch({ executablePath: CHROME, args: GL });
  const p = await (await b.newContext({ viewport: { width: 300, height: 300 } })).newPage();
  p.on('pageerror', (e) => console.log('PAGEERR', e.message));
  await p.goto(`http://127.0.0.1:${port}/lab.html?px=56`); await p.waitForFunction(() => window.ready === true, { timeout: 60000 });
  const t0 = Date.now(), url = await p.evaluate(async (scale) => await window.renderFaceBoard({ scale }), scale);
  fs.mkdirSync(path.join(DIR, 'out'), { recursive: true });
  const f = path.join(DIR, 'out', 'faces_board.png'); fs.writeFileSync(f, Buffer.from(url.split(',')[1], 'base64'));
  console.log(`faces board → ${path.relative(DIR, f)} (${((Date.now() - t0) / 1000).toFixed(1)}s)`);
  await b.close(); srv.close();
})().catch((e) => { console.error('FAIL', e.message); process.exit(1); });
