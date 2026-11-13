// shoot.mjs — the Bowl's three outdoor looks (tools/arena-spike/arena.js), each from the game's camera: the whole ring
// (1200 × 800) and a phone's frame at the game's zoom (430 × 900), then one sheet of all three.
// Needs the repo served (npm run serve) and the actor lab's three (tools/actor-lab: npm i).
//   node tools/arena-spike/shoot.mjs [--base http://localhost:8080] [--out tools/arena-spike/out]
import { chromium } from 'playwright';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
const arg = (k, d) => { const i = process.argv.indexOf(k); return i >= 0 ? process.argv[i + 1] : d; };
const BASE = arg('--base', 'http://localhost:8080'), OUT = arg('--out', 'tools/arena-spike/out');
mkdirSync(OUT, { recursive: true });
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1200, height: 900 } });
p.on('pageerror', (e) => console.log('PAGEERR', e.message));
for (const opt of ['a', 'b', 'c']) for (const [view, w, h] of [['wide', 1200, 800], ['play', 430, 900]]) {
  await p.setViewportSize({ width: w, height: h });
  await p.goto(`${BASE}/tools/arena-spike/index.html?opt=${opt}&view=${view}&w=${w}&h=${h}`);
  await p.waitForFunction(() => document.title === 'done', null, { timeout: 120000 });
  await p.locator('#c').screenshot({ path: `${OUT}/${opt}-${view}.png` });
  console.log(opt, view);
}
// the sheet: a row an option, the whole ring beside the phone's frame
const img = (f) => 'data:image/png;base64,' + readFileSync(`${OUT}/${f}.png`).toString('base64');
const NAME = { a: 'A · The Sun Bowl: a classical amphitheatre', b: 'B · The Quarry Ring: cut into banded sandstone', c: 'C · The Broken Circus: a two-storey arcade, its near half fallen' };
const rows = ['a', 'b', 'c'].map((o) => `<div style="display:flex;gap:14px;align-items:flex-start;margin-bottom:22px"><div><div style="font:600 22px Georgia;color:#5a3c1c;margin:0 0 8px">${NAME[o]}</div><img src="${img(o + '-wide')}" width="1200" height="800" style="border-radius:8px;display:block"></div><div><div style="font:14px Georgia;color:#7a5a34;margin:8px 0 10px">in play, a phone at the game's zoom</div><img src="${img(o + '-play')}" width="430" height="900" style="border-radius:8px;display:block;height:800px;width:auto"></div></div>`).join('');
await p.setViewportSize({ width: 1640, height: 900 });
await p.setContent(`<body style="margin:0;padding:20px;background:#f3e9d6">${rows}</body>`);
await p.screenshot({ path: `${OUT}/sheet.jpg`, type: 'jpeg', quality: 82, fullPage: true });
writeFileSync(`${OUT}/.done`, '');
await b.close();
