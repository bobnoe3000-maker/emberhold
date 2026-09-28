// bake.cjs — bake the game's actor atlases from bake.json into assets/actors/:
// <out>.json (cell size, foot anchor, clips, glow id) + <out>.alb.png (grim albedo,
// alpha = mask) + <out>.nrm.png (screen-space normals) + <out>.emi.png (glow mask,
// only when the figure has glowing parts). Needs `npm i` + `sh fetch-assets.sh`.
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright-core');
const { serve, CHROME, GL } = require('./render.cjs');
const DIR = __dirname, OUT = path.join(DIR, '..', '..', 'assets', 'actors');
(async () => {
  if (!fs.existsSync(path.join(DIR, 'models', 'Knight.glb'))) throw new Error('models missing — run: sh fetch-assets.sh');
  const spec = JSON.parse(fs.readFileSync(path.join(DIR, 'bake.json')));
  const vars = Object.fromEntries(JSON.parse(fs.readFileSync(path.join(DIR, 'variants.json'))).map((v) => [v.id, v]));
  const srv = await serve(DIR), port = srv.address().port;
  const b = await chromium.launch({ executablePath: CHROME, args: GL });
  const p = await (await b.newContext({ viewport: { width: 300, height: 300 } })).newPage();
  p.on('pageerror', (e) => console.log('PAGEERR', e.message));
  await p.goto(`http://127.0.0.1:${port}/lab.html?px=${spec.px}`); await p.waitForFunction(() => window.ready === true, { timeout: 60000 });
  fs.mkdirSync(OUT, { recursive: true });
  const png = (f, url) => fs.writeFileSync(path.join(OUT, f), Buffer.from(url.split(',')[1], 'base64'));
  for (const a of spec.actors) {
    const v = { ...vars[a.variant], eyes: vars[a.variant].eyes ? parseInt(vars[a.variant].eyes) : undefined };
    const t0 = Date.now(), r = await p.evaluate(async ([v, clips, g]) => await window.bakeAtlas(v, clips, g), [{ ...v, ...(a.grade || {}) }, a.clips, a.gain ?? spec.albedoGain ?? 1]);   // per-actor gain / grade overrides
    const meta = { ...r.meta, glow: r.emi ? a.glow : 0, source: `KayKit CC0 · ${v.label} · heroic + grim · ${spec.px}px` };
    fs.writeFileSync(path.join(OUT, `${a.out}.json`), JSON.stringify(meta) + '\n');
    png(`${a.out}.alb.png`, r.alb); png(`${a.out}.nrm.png`, r.nrm);
    const emi = path.join(OUT, `${a.out}.emi.png`); if (r.emi) png(`${a.out}.emi.png`, r.emi); else if (fs.existsSync(emi)) fs.unlinkSync(emi);
    console.log(`${a.out}: ${meta.frames} frames × 8 dirs, ${meta.cw}×${meta.ch} cells, glow ${meta.glow} (${((Date.now() - t0) / 1000).toFixed(1)}s)`);
  }
  await b.close(); srv.close();
})().catch((e) => { console.error('FAIL', e.message); process.exit(1); });
