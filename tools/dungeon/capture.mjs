// capture.mjs — a dungeon site's first floor in the game, at four places (docs/dungeon-halls-proposal.md): the
// entrance (where you arrive, the stair up), the first corridor or hall out of it, the first fighting room (the party
// just inside, the fight on), the descent room; then the first small and medium rooms (level.js ROOM_SIZES), the fight
// on. 390 × 844 @2, the manual clock, held at day. Needs a server.
//
//   node tools/dungeon/capture.mjs [site=wickham_keep] [out=docs/img/dungeon] [tag=site] [base=http://localhost:8080]
//
// (base: another checkout served elsewhere, for a before; files come out <out>/<tag>-<n>-<place>.png)
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const [SITE = 'wickham_keep', OUT = 'docs/img/dungeon', TAG = SITE, BASE = 'http://localhost:8080'] = process.argv.slice(2);
mkdirSync(OUT, { recursive: true });
const b = await chromium.launch({ executablePath: process.env.CHROME || '/opt/pw-browsers/chromium', args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true });
const p = await ctx.newPage(), errs = []; p.on('pageerror', (e) => errs.push(String(e)));
const run = (n) => p.evaluate((n) => { for (let i = 0; i < n; i++) globalThis.__frame(1000 / 30); }, n);
await p.goto(`${BASE}/?dev&manual&notitle&scene=dungeon&site=${SITE}&tod=day`); await p.waitForFunction(() => globalThis.__sim && globalThis.__frame);
for (let i = 0; i < 40; i++) { await p.waitForTimeout(100); await run(3); if (i > 12 && !(await p.evaluate(() => globalThis.__renderer.transiting))) break; }
await run(40); await p.waitForTimeout(200); await run(2);
// the four places, found on this floor: the walk from the entrance to the first fighting room crosses a corridor
const spots = await p.evaluate(() => {
  const w = globalThis.__sim.world, L = w.level, K = (x, y) => x + ',' + y, lv = w.roomLevels;
  const first = L.rooms.filter((r) => r !== L.entrance).sort((a, b) => (lv.get(a.id) - lv.get(b.id)) || (Math.hypot(a.cx - L.entrance.cx, a.cy - L.entrance.cy) - Math.hypot(b.cx - L.entrance.cx, b.cy - L.entrance.cy)))[0];
  const s = K(Math.floor(L.spawn.x), Math.floor(L.spawn.y)), prev = new Map([[s, null]]), q = [s];
  for (let h = 0; h < q.length; h++) { const [x, y] = q[h].split(',').map(Number); if (x === first.cx && y === first.cy) break; for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const n = K(x + dx, y + dy), c = L.cells.get(n); if (c && c.kind === 'floor' && !prev.has(n)) { prev.set(n, q[h]); q.push(n); } } }
  const path = []; for (let k = K(first.cx, first.cy); k; k = prev.get(k)) path.unshift(k.split(',').map(Number));
  const corr = path.filter(([x, y]) => L.cells.get(K(x, y)).room < 0), mid = corr[Math.floor(corr.length / 2)] || path[Math.floor(path.length / 2)];
  const door = path.find(([x, y]) => L.cells.get(K(x, y)).room === first.id), inside = path[Math.min(path.length - 1, path.indexOf(door) + 6)];
  const of = (z) => { const r = L.rooms.find((q) => q.size === z && q !== L.entrance && q !== L.descentRoom); return r ? [r.cx, r.cy + 2] : null; };
  return { corridor: mid, room: inside, descent: [L.descentRoom.cx, L.descentRoom.cy + 4], small: of('small'), medium: of('medium'), walk: path.length, corrTiles: corr.length, layout: L.layout || 'caverns', sizes: L.rooms.map((r) => r.size || 'large').join(' ') };
});
console.log(TAG, JSON.stringify(spots));
await p.screenshot({ path: `${OUT}/${TAG}-1-entrance.png` });
for (const [i, name] of [[2, 'corridor'], [3, 'room'], [4, 'descent'], [5, 'small'], [6, 'medium']]) {
  if (!spots[name]) continue;
  const [x, y] = spots[name];
  await p.evaluate(([x, y]) => { const s = globalThis.__sim, pl = s.state.player; pl.x = pl.px = x + 0.5; pl.y = pl.py = y + 0.5; for (const m of s.state.party.slice(1)) { m.x = m.px = x + 0.5 - 1; m.y = m.py = y + 0.5 - 1; } }, [x, y]);
  await run(name === 'room' || name === 'small' || name === 'medium' ? 90 : 30); await p.waitForTimeout(200); await run(2);
  await p.screenshot({ path: `${OUT}/${TAG}-${i}-${name}.png` });
}
if (errs.length) console.log(TAG, 'errors', errs);
await b.close();
