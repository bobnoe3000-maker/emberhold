// render.cjs — render every variant in variants.json (stock + heroic, 3 facings)
// to out/<id>__<stock|heroic>__<dir>.png. Serves this folder itself, drives
// headless Chromium (SwiftShader WebGL). Needs `npm i` + `sh fetch-assets.sh`.
const http = require('http'), fs = require('fs'), path = require('path');
const { chromium } = require('playwright-core');
const DIR = __dirname, PXI = process.argv.indexOf('--px'), PX = PXI > 0 ? +process.argv[PXI + 1] : 46;
const OUT = path.join(DIR, 'out', PX === 46 ? '' : `px${PX}`);   // 46 stays in out/ (compose.py's default)
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.glb': 'model/gltf-binary',
  '.gltf': 'model/gltf+json', '.bin': 'application/octet-stream', '.png': 'image/png' };
function serve(root) {
  const srv = http.createServer((req, res) => {
    const f = path.join(root, decodeURIComponent(req.url.split('?')[0]));
    if (!f.startsWith(root) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); return res.end(); }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(res);
  });
  return new Promise((r) => srv.listen(0, '127.0.0.1', () => r(srv)));
}
const CHROME = process.env.CHROME_PATH || ['/opt/pw-browsers/chromium-1194/chrome-linux/chrome'].find((p) => fs.existsSync(p));
const GL = ['--no-sandbox', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--enable-webgl'];
module.exports = { serve, CHROME, GL };
if (require.main === module) (async () => {
  if (!fs.existsSync(path.join(DIR, 'models', 'Knight.glb'))) throw new Error('models missing — run: sh fetch-assets.sh');
  const srv = await serve(DIR), port = srv.address().port;
  const b = await chromium.launch({ executablePath: CHROME, args: GL });
  const p = await (await b.newContext({ viewport: { width: 300, height: 300 } })).newPage();
  p.on('pageerror', (e) => console.log('PAGEERR', e.message));
  await p.goto(`http://127.0.0.1:${port}/lab.html?px=${PX}`); await p.waitForFunction(() => window.ready === true, { timeout: 60000 });
  const vs = JSON.parse(fs.readFileSync(path.join(DIR, 'variants.json'))).map((v) => ({ ...v,
    eyes: v.eyes ? parseInt(v.eyes) : undefined, props: [false, true], dirs: [0, 1, 2] }));
  const t0 = Date.now(), all = await p.evaluate(async (vs) => await window.renderVariants(vs), vs);
  fs.mkdirSync(OUT, { recursive: true });
  for (const [k, v] of Object.entries(all)) fs.writeFileSync(path.join(OUT, k.replace(/\|/g, '__') + '.png'), Buffer.from(v.split(',')[1], 'base64'));
  console.log(`rendered ${Object.keys(all).length} frames in ${((Date.now() - t0) / 1000).toFixed(1)}s → ${path.relative(DIR, OUT)}/ (${PX}px)`);
  await b.close(); srv.close();
})().catch((e) => { console.error('FAIL', e.message); process.exit(1); });
