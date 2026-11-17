// pairs.mjs — a before / after contact sheet from two folders of shots of the same names (docs/art-critic-pass-reach-fx.md):
// a row a shot, the before and the after side by side, each cropped to its middle (--crop w,h, CSS px of a 390-wide shot).
//   node tools/capture/pairs.mjs <before dir> <after dir> <out.jpg> [name,name,…] [--crop 390,520] [--labels before,after]
import { readFile, writeFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { chromium } from 'playwright';

const args = process.argv.slice(2), opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const [A, B, OUT, list] = args.filter((a, i) => !a.startsWith('--') && !(i > 0 && args[i - 1].startsWith('--')));
const names = list ? list.split(',') : (await readdir(A)).filter((f) => f.endsWith('.png')).map((f) => f.slice(0, -4));
const [cw, ch] = opt('--crop', '390,520').split(',').map(Number), labels = opt('--labels', 'before,after').split(',');
const url = async (p) => 'data:image/png;base64,' + (await readFile(p)).toString('base64');
const rows = []; for (const n of names) rows.push({ n, a: await url(join(A, n + '.png')), b: await url(join(B, n + '.png')) });
const b = await chromium.launch(), p = await b.newPage();
const jpg = await p.evaluate(async ({ rows, cw, ch, labels }) => {
  const lab = 22, gap = 6, load = async (u) => { const i = new Image(); i.src = u; await i.decode(); return i; };
  const first = await load(rows[0].a), k = first.width / 390, W = cw * k, H = ch * k;
  const c = document.createElement('canvas'); c.width = 2 * W + gap; c.height = rows.length * (H + lab); const g = c.getContext('2d');
  g.fillStyle = '#14121a'; g.fillRect(0, 0, c.width, c.height); g.font = `${Math.round(13 * k)}px sans-serif`;
  for (const [r, row] of rows.entries()) {
    const y = r * (H + lab);
    for (const [j, u] of [row.a, row.b].entries()) {
      const im = await load(u), sx = (im.width - W) / 2, sy = (im.height - H) / 2;
      g.drawImage(im, sx, sy, W, H, j * (W + gap), y + lab, W, H);
      g.fillStyle = '#ddd'; g.fillText(`${row.n} · ${labels[j]}`, j * (W + gap) + 6, y + lab - 6);
    }
  }
  return c.toDataURL('image/jpeg', 0.88);
}, { rows, cw, ch, labels });
await writeFile(OUT, Buffer.from(jpg.split(',')[1], 'base64'));
await b.close();
console.log(OUT);
