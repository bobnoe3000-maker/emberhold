// @ts-check
// The memory a walk between scenes costs (the owner, 2026-11-17: "Every now and again the game will crash and relaunch.
// Usually when in a map transition and im looking at inventory"): a phone's browser drops a page that holds too much, and
// a scene change is when the game holds most (the scene left, set aside to come back to; the one next door built ahead;
// the new one built; the character window's own WebGL context if it's open). This walks Thornwick → the Vale → the Old
// Barrows → the Vale → Thornwick, `--cycles` times, optionally with the character window open through every change, and
// samples the browser's memory as it goes (--sheet: open as each change begins, and again while the new scene loads): the resident memory of every process of this browser (its GPU's textures and
// buffers are in its GPU process: SwiftShader here, which holds them in RAM, the nearest a desktop gets to a phone's
// shared memory), the JS heap, and Luminati's counts (geometries, textures, levels set aside, one built ahead).
// Prints a row per change (the peak during it, what it settled at) and the walk's peak and growth.
//   node tools/capture/memwalk.mjs [--cycles 3] [--sheet] [--base url] [--query a=b] [--json out.json]
import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFile, writeFile } from 'node:fs/promises';
import { readFileSync, readdirSync } from 'node:fs';
import { extname, join, normalize } from 'node:path';

const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const CYCLES = +arg('--cycles', 3), SHEET = process.argv.includes('--sheet'), QUERY = arg('--query', ''), OUT = arg('--json', '');
const ROOT = new URL('../..', import.meta.url).pathname;
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.css': 'text/css', '.mp3': 'audio/mpeg', '.glb': 'model/gltf-binary', '.bin': 'application/octet-stream', '.wasm': 'application/wasm', '.webp': 'image/webp', '.ktx2': 'image/ktx2' };
let base = arg('--base', ''), srv = null;
if (!base) {
  srv = createServer(async (req, res) => {
    const p = normalize(decodeURIComponent((req.url || '/').split('?')[0])).replace(/^(\.\.[/\\])+/, '');
    try { const b = await readFile(join(ROOT, p === '/' ? 'index.html' : p)); res.writeHead(200, { 'content-type': MIME[extname(p)] || 'application/octet-stream' }); res.end(b); } catch { res.writeHead(404); res.end(); }
  });
  await new Promise((r) => srv.listen(0, '127.0.0.1', () => r(null)));
  base = `http://127.0.0.1:${/** @type {any} */ (srv.address()).port}`;
}

/** every process under pid (this browser's: its GPU, renderers, utilities) */
function tree(pid) {
  const kids = new Map();
  for (const d of readdirSync('/proc')) { if (!/^\d+$/.test(d)) continue; try { const pp = +readFileSync(`/proc/${d}/stat`, 'utf8').split(') ')[1].split(' ')[1]; if (!kids.has(pp)) kids.set(pp, []); kids.get(pp).push(+d); } catch { /* gone */ } }
  const out = [pid]; for (let i = 0; i < out.length; i++) out.push(...(kids.get(out[i]) || [])); return out.slice(1);
}
/** the resident MB of this browser, all its processes (PSS where the kernel gives it: shared pages counted once) */
function rss(pids) {
  let kb = 0;
  for (const p of pids) { try { const s = readFileSync(`/proc/${p}/smaps_rollup`, 'utf8'); const m = /Pss:\s+(\d+)/.exec(s); if (m) { kb += +m[1]; continue; } } catch { /* fall through */ }
    try { const m = /VmRSS:\s+(\d+)/.exec(readFileSync(`/proc/${p}/status`, 'utf8')); if (m) kb += +m[1]; } catch { /* gone */ } }
  return Math.round(kb / 1024);
}

const b = await chromium.launch({ args: ['--enable-precise-memory-info', '--js-flags=--expose-gc'] });
const pid = process.pid;   // (Playwright drives the browser in this process: its processes are ours, node's own left out below)
const ctx = await b.newContext({ viewport: { width: 390, height: 760 }, deviceScaleFactor: 3 }), p = await ctx.newPage(), errs = [];
p.on('pageerror', (e) => errs.push(e.message));
await p.goto(`${base}/index.html?dev&notitle&world=on&tod=day&scene=town&region=vale${QUERY ? '&' + QUERY : ''}`, { waitUntil: 'commit' });
await p.waitForFunction(() => !!globalThis.__sim && !!globalThis.__world3d && globalThis.__world3d.state.loads >= 1 && !globalThis.__renderer.transiting, null, { timeout: 240000 });

let pids = tree(pid), peak = 0, sampling = true;
const samples = [];
(async () => { while (sampling) { const v = rss(pids); samples.push(v); if (v > peak) peak = v; await new Promise((r) => setTimeout(r, 100)); } })();
const page = () => p.evaluate(() => { const h = globalThis.__world3d, st = h.world.loadStats(), m = /** @type {any} */ (performance).memory; return { heap: m ? Math.round(m.usedJSHeapSize / 1048576) : 0, geo: st.geometries, tex: st.textures, kept: st.kept, ahead: st.ahead, last: st.last, kind: globalThis.__sim.world.kind, site: globalThis.__sim.world.site || '' }; });
const gc = () => p.evaluate(() => { try { /** @type {any} */ (globalThis).gc?.(); } catch { /* none */ } });

/** a scene change: the hero onto the way out (the sheet open through it if asked), until the new scene is drawn and settled */
async function change(label, where) {
  pids = tree(pid); const from = samples.length;
  if (SHEET) await p.evaluate(() => globalThis.__gear.open(0));
  const n = await p.evaluate(() => globalThis.__world3d.state.loads);
  await p.evaluate(where);
  if (SHEET) { await p.waitForTimeout(300); await p.evaluate(() => globalThis.__gear.open(0)); }   // (opened again while the new scene loads: the sheet closes as a change starts)
  await p.waitForFunction((n) => globalThis.__world3d.state.loads > n && !globalThis.__renderer.transiting, n, { timeout: 240000 });
  await p.waitForTimeout(2500);   // (the next door built ahead, the figures stood)
  const top = Math.max(...samples.slice(from)); if (SHEET) await p.evaluate(() => globalThis.__gear.close());
  await gc(); await p.waitForTimeout(800); pids = tree(pid);
  const now = rss(pids), st = await page();
  const row = { label, peak: top, settled: now, ...st };
  console.log(`${label.padEnd(28)} peak ${String(top).padStart(5)} MB  settled ${String(now).padStart(5)} MB  heap ${String(st.heap).padStart(4)}  geo ${String(st.geo).padStart(5)}  tex ${String(st.tex).padStart(4)}  kept ${st.kept}  ahead ${st.ahead || '-'}  (${st.last})`);
  return row;
}
const toOverland = () => { const s = globalThis.__sim, e = s.world.exits.find((q) => q.to === 'overland'), P = s.state.player; P.x = P.px = (e.x0 + e.x1) / 2; P.y = P.py = (e.y0 + e.y1) / 2; };
const toTown = () => { const s = globalThis.__sim, e = s.world.exits.find((q) => q.to === 'town' && !q.closed), P = s.state.player; P.x = P.px = (e.x0 + e.x1) / 2; P.y = P.py = (e.y0 + e.y1) / 2; };
const toBarrows = () => { const s = globalThis.__sim, e = s.world.exits.find((q) => q.to === 'dungeon' && q.site === 'barrows'), P = s.state.player; P.x = P.px = (e.x0 + e.x1) / 2; P.y = P.py = (e.y0 + e.y1) / 2; };
const outOfDungeon = () => { const s = globalThis.__sim, a = s.world.exitAt, P = s.state.player; for (const e of s.world.enemies || []) e.hp = 0; P.x = P.px = a.x; P.y = P.py = a.y; };

await gc(); await p.waitForTimeout(1500); pids = tree(pid);
const start = { label: 'Thornwick (start)', peak: rss(pids), settled: rss(pids), ...(await page()) };
console.log(`memwalk${SHEET ? ' (the character window open through every change)' : ''}${QUERY ? ' · ' + QUERY : ''}`);
console.log(`${start.label.padEnd(28)} settled ${start.settled} MB  heap ${start.heap}  geo ${start.geo}  tex ${start.tex}`);
const rows = [start];
for (let c = 1; c <= CYCLES; c++) {
  rows.push(await change(`${c}: Thornwick → Vale`, toOverland));
  rows.push(await change(`${c}: Vale → Old Barrows`, toBarrows));
  rows.push(await change(`${c}: Old Barrows → Vale`, outOfDungeon));
  rows.push(await change(`${c}: Vale → Thornwick`, toTown));
}
sampling = false;
const last = rows.at(-1), firstCycleEnd = rows[4];
const sum = { peak, startSettled: start.settled, endSettled: last.settled, growthPerCycle: CYCLES > 1 ? Math.round((last.settled - firstCycleEnd.settled) / (CYCLES - 1)) : null, errors: errs };
console.log(`walk peak ${peak} MB · settled ${start.settled} → ${last.settled} MB · growth a cycle after the first ${sum.growthPerCycle ?? '-'} MB${errs.length ? ' · errors: ' + errs.join(' | ') : ''}`);
if (OUT) await writeFile(OUT, JSON.stringify({ sheet: SHEET, query: QUERY, rows, ...sum }, null, 1));
await ctx.close(); await b.close(); srv?.close();
