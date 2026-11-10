// creatures-sheet.cjs — the creatures' model sheet (docs/creatures-proposal.md): node tools/actor-lab/creatures-sheet.cjs [out.jpg] [--only rat,golem,…]
// → each creature beside the knight and through its clips, from the game's camera, one row a kind, and its triangles,
// draws, bones and clips. Serves this folder and drives the bake's Chromium (render.cjs).
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright-core');
const { serve, CHROME, GL } = require('./render.cjs');
const arg = (k) => { const i = process.argv.indexOf('--' + k); return i > 0 ? process.argv[i + 1] : null; };
const OUT = arg('out') || (process.argv[2] && !process.argv[2].startsWith('--') ? process.argv[2] : path.join(__dirname, 'out', 'creatures.jpg'));
const SHOTS = [['Idle', [0.3]], ['Walk', [0, 0.25, 0.5, 0.75]], ['Attack', [0.45]], ['Heavy', [0.55]], ['Cast', [0.5]], ['Hit', [0.25]], ['Death', [0.99]]];
// height: as the game stands it (the variant's, in men; a boss's ×1.3, as the renderer draws a boss); cy, half: the
// camera's aim and half-height, in men
const ROWS = [
  { name: 'Stone golem · front', key: 'golemf', spec: { kind: 'golem' }, height: 2.0, cy: 1.0, half: 1.1, yaw: 0.55, shots: [['Idle', [0.3]], ['Heavy', [0.42]], ['Death', [0.99]]] },
  { name: 'Giant rat · front', key: 'ratf', spec: { kind: 'rat' }, height: 0.47, cy: 0.22, half: 0.34, yaw: 0.4, shots: [['Idle', [0.3]], ['Attack', [0.4]], ['Cast', [0.5]]] },
  { name: 'Graveyard wraith · front', key: 'wraithf', spec: { kind: 'wraith' }, height: 1.5, cy: 0.8, half: 0.85, yaw: 0.78, shots: [['Idle', [0.3]], ['Attack', [0.45]], ['Heavy', [0.4]]] },
  { name: 'Giant rat', key: 'rat', spec: { kind: 'rat' }, height: 0.47, cy: 0.2, half: 0.42, yaw: -0.7, shots: SHOTS.filter(([c]) => c !== 'Cast') },
  { name: 'Giant spider', key: 'spider', spec: { kind: 'spider' }, height: 0.54, cy: 0.25, half: 0.55, yaw: -0.6, shots: SHOTS },
  { name: 'Spinner', key: 'spinner', spec: { kind: 'spider', seed: 29, body: '#3a302a', band: '#7a6650', mark: '#d8ccb0', eyes: '#c8f070' }, height: 0.41, cy: 0.2, half: 0.45, yaw: -0.6, shots: SHOTS },
  { name: 'Old Gutter', key: 'gutter', spec: { kind: 'rat', seed: 13, fur: '#4a4640', belly: '#625c54', furTop: '#6c675e', eyes: '#ff6a30' }, height: 0.61, cy: 0.26, half: 0.5, yaw: -0.7, shots: SHOTS.filter(([c]) => c !== 'Cast') },
  { name: 'Red fire beetle', key: 'beetle', spec: { kind: 'beetle' }, height: 0.42, cy: 0.2, half: 0.42, yaw: -0.6, shots: SHOTS },
  { name: 'Goblin', key: 'goblin', spec: { kind: 'goblin' }, height: 0.72, cy: 0.38, half: 0.5, yaw: -0.5, shots: SHOTS },
  { name: 'Graveyard wraith', key: 'wraith', spec: { kind: 'wraith' }, height: 1.5, cy: 0.8, half: 0.95, yaw: -0.5, shots: SHOTS },
  { name: 'Stone golem', key: 'golem', spec: { kind: 'golem' }, height: 2.0, cy: 1.0, half: 1.2, yaw: -0.5, shots: SHOTS },
  { name: 'The Rat King (boss)', key: 'ratking', spec: { kind: 'ratking' }, height: 0.75 * 1.3, cy: 0.42, half: 1.05, yaw: -1.0, shots: SHOTS },
  { name: 'The Spider Queen (boss)', key: 'spiderqueen', spec: { kind: 'spiderqueen' }, height: 0.8 * 1.3, cy: 0.45, half: 1.15, yaw: -0.6, shots: SHOTS },
].filter((r) => !arg('only') || arg('only').split(',').includes(r.key));
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
