// capture-backdrop.cjs — screenshot a furnished room from the real game with the
// actors hidden (dev-only globalThis.__noactors hook in renderer.js), so boards
// composite candidates over true Emberlit lighting at true pixel scale.
// dpr 2 ⇒ screenshot px == canvas px (the renderer caps dpr at 2); S = 3.
const path = require('path'), fs = require('fs');
const { chromium } = require('playwright-core');
const { serve, CHROME, GL } = require('./render.cjs');
(async () => {
  const srv = await serve(path.resolve(__dirname, '..', '..')), port = srv.address().port;
  const b = await chromium.launch({ executablePath: CHROME, args: GL });
  const p = await (await b.newContext({ viewport: { width: 402, height: 874 }, deviceScaleFactor: 2 })).newPage();
  await p.goto(`http://127.0.0.1:${port}/index.html?theme=${process.argv[2] || 'poison'}&dev=1`, { waitUntil: 'load' });
  await p.waitForTimeout(2500);
  await p.evaluate(() => { globalThis.__noactors = true; const s = globalThis.__sim, pl = s.state.player, es = s.world.enemies;
    let best = es[0], bd = 1e9; for (const e of es) { const d = Math.hypot(e.x - pl.x, e.y - pl.y); if (d < bd) { bd = d; best = e; } }
    pl.x = pl.px = best.x - 2.5; pl.y = pl.py = best.y - 0.5; });
  await p.waitForTimeout(900);
  fs.mkdirSync(path.join(__dirname, 'out'), { recursive: true });
  await p.screenshot({ path: path.join(__dirname, 'out', 'backdrop.png') });
  console.log('backdrop → out/backdrop.png'); await b.close(); srv.close();
})().catch((e) => { console.error('FAIL', e.message); process.exit(1); });
