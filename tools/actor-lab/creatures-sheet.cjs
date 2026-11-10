// creatures-sheet.cjs — the creatures' model sheet (docs/creatures-proposal.md): node tools/actor-lab/creatures-sheet.cjs [out.jpg]
// → each creature beside the knight and through its clips, from the game's camera, one row a kind, and its triangles,
// draws, bones and clips. Serves this folder and drives the bake's Chromium (render.cjs).
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright-core');
const { serve, CHROME, GL } = require('./render.cjs');
const OUT = process.argv[2] || path.join(__dirname, 'out', 'creatures.jpg');
const SHOTS = [['Idle', [0.3]], ['Walk', [0, 0.25, 0.5, 0.75]], ['Attack', [0.45]], ['Heavy', [0.55]], ['Cast', [0.5]], ['Hit', [0.25]], ['Death', [0.99]]];
const ROWS = [
  { name: 'Giant rat', spec: { kind: 'rat' }, cy: 0.17, half: 0.36, yaw: -0.7, shots: SHOTS.filter(([c]) => c !== 'Cast') },
  { name: 'Giant spider', spec: { kind: 'spider' }, cy: 0.2, half: 0.48, yaw: -0.6, shots: SHOTS },
];
(async () => {
  const srv = await serve(__dirname), port = srv.address().port;
  const b = await chromium.launch({ executablePath: CHROME, args: GL }), p = await b.newPage({ viewport: { width: 440, height: 400 } });
  p.on('pageerror', (e) => console.log('PAGEERR', e.message)); p.on('console', (m) => { if (m.type() === 'error') console.log('ERR', m.text()); });
  await p.goto(`http://127.0.0.1:${port}/creatures.html`); await p.waitForFunction(() => window.ready === true, { timeout: 60000 });
  const rows = await p.evaluate(async (r) => await window.sheet(r), ROWS);
  for (const r of rows) console.log(`${r.name}: ${r.tris} triangles, ${r.draws} draws, ${r.bones} bones; ${r.clips.join(', ')}`);
  const url = await p.evaluate(async (rows) => {
    const cw = 440, ch = 400, n = Math.max(...rows.map((r) => r.frames.length)), pad = 10, head = 26, lab = 18;
    const c = document.createElement('canvas'); c.width = n * (cw + pad) + pad; c.height = rows.length * (ch + head + lab + pad) + pad; const g = c.getContext('2d');
    g.fillStyle = '#15121b'; g.fillRect(0, 0, c.width, c.height);
    let y = pad;
    for (const r of rows) {
      g.fillStyle = '#f0c880'; g.font = '600 20px Georgia'; g.fillText(`${r.name} · ${r.tris} triangles, ${r.draws} draws, ${r.bones} bones`, pad, y + 19);
      for (let i = 0; i < r.frames.length; i++) {
        const im = new Image(); im.src = r.frames[i].img; await im.decode();
        g.drawImage(im, pad + i * (cw + pad), y + head, cw, ch);
        g.fillStyle = '#cbbfae'; g.font = '14px ui-monospace, monospace'; g.fillText(r.frames[i].label, pad + i * (cw + pad) + 4, y + head + ch + 14);
      }
      y += ch + head + lab + pad;
    }
    return c.toDataURL('image/jpeg', 0.86);
  }, rows);
  fs.mkdirSync(path.dirname(OUT), { recursive: true }); fs.writeFileSync(OUT, Buffer.from(url.split(',')[1], 'base64'));
  console.log('→', path.relative(process.cwd(), OUT));
  await b.close(); srv.close();
})().catch((e) => { console.error('FAIL', e.message); process.exit(1); });
