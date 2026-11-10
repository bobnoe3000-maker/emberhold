// visibility.mjs — can the player see who and what they need to (docs/level-design-rules.md §5.1)? The game in a browser
// on Luminati, at the default zoom, map by map: the hero is walked to each subject and the world asked, through
// Luminati's camera, how much of a person standing there it hides (hybrid.js `sees`: six points up a man's height, a ray
// from each toward the camera against the houses, walls, trees, rocks, the kit and the world's cards).
//   subjects: a town's spawn, each of its people where they stand and the step before each service's door; an
//   overland's spawn, each way in (its middle) and each arrival; a dungeon floor's way in, each room's middle and
//   the stairs both ways.
// A subject passes when at least SEEN of it is in view (the rules: 0.5; a person half behind a corner still reads). Prints
// each map's subjects, the hidden ones with what hid them, and the totals; exit 1 if any is under the bar (--warn: 0).
//   node tools/capture/visibility.mjs [vale-town fens-town vale fens reach heights barrows-f1 … | all] [--seen 0.5] [--warn] [--json out.json] [--shots dir]
import { createServer } from 'node:http';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { join, extname, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const ROOT = fileURLToPath(new URL('../..', import.meta.url));
const args = process.argv.slice(2), opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args.splice(i, 2)[1] : d; };
const SEEN = +opt('--seen', 0.5), JSON_OUT = opt('--json', ''), SHOTS = opt('--shots', ''), WARN = args.includes('--warn');
// the maps: a scene, its land, and for a dungeon its site and floor (0 the first)
export const MAPS = {
  'vale-town': { scene: 'town', region: 'vale' }, 'fens-town': { scene: 'town', region: 'fens' },
  vale: { scene: 'overland', region: 'vale' }, fens: { scene: 'overland', region: 'fens' }, reach: { scene: 'overland', region: 'reach' }, heights: { scene: 'overland', region: 'heights' },
  'barrows-f1': { scene: 'dungeon', site: 'barrows', floor: 0 }, 'barrows-f2': { scene: 'dungeon', site: 'barrows', floor: 1 },
  'keep-f1': { scene: 'dungeon', site: 'wickham_keep', floor: 0 }, 'keep-f2': { scene: 'dungeon', site: 'wickham_keep', floor: 1 },
  'chapel-f1': { scene: 'dungeon', site: 'sunken_chapel', floor: 0 }, 'chapel-f2': { scene: 'dungeon', site: 'sunken_chapel', floor: 1 },
  'pens-f1': { scene: 'dungeon', site: 'proving_pens', floor: 0 }, 'pens-f2': { scene: 'dungeon', site: 'proving_pens', floor: 1 },
  'mound-f1': { scene: 'dungeon', site: 'toadking_mound', floor: 0 }, 'locks-f1': { scene: 'dungeon', site: 'canal_locks', floor: 0 }, 'abbey-f1': { scene: 'dungeon', site: 'drowned_abbey', floor: 0 },
};
const want = args.filter((a) => !a.startsWith('--')), names = !want.length || want.includes('all') ? Object.keys(MAPS) : want;

const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.css': 'text/css', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.mp3': 'audio/mpeg' };
const srv = createServer(async (req, res) => { const p = normalize(join(ROOT, decodeURIComponent(req.url.split('?')[0]))); if (!p.startsWith(ROOT)) { res.writeHead(403); return res.end(); } try { const b = await readFile(p); res.writeHead(200, { 'Content-Type': MIME[extname(p)] || 'application/octet-stream' }); res.end(b); } catch { res.writeHead(404); res.end(); } });
await new Promise((r) => srv.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${srv.address().port}`;
const GL = ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'];
const b = await chromium.launch({ args: GL });

/** survey one map: its subjects and how much of each is in view @param {string} name */
export async function survey(page, name) {
  const m = MAPS[name], q = new URLSearchParams({ scene: m.scene, ...(m.region ? { region: m.region } : {}), ...(m.site ? { site: m.site } : {}) });
  await page.goto(`${base}/index.html?dev&manual&notitle&world=on&tod=day&${q}`);
  await page.waitForFunction(() => typeof globalThis.__frame === 'function' && !!globalThis.__sim, null, { timeout: 120000 });
  const built = async (n) => { for (let i = 0; i < 1600; i++) { if (await page.evaluate((n) => { globalThis.__frame(16); const h = globalThis.__world3d; return !!h && h.state.loads >= n && h.world?.stats.level >= n && !globalThis.__renderer.transiting; }, n)) return true; await page.waitForTimeout(120); } return false; };
  if (!(await built(1))) return { name, error: 'the world never built' };
  if (m.floor) { await page.evaluate((d) => { const s = globalThis.__sim; s.restore({ ...JSON.parse(JSON.stringify(s.snapshot())), depth: d, floors: [] }); }, m.floor); if (!(await built(2))) return { name, error: 'the floor never built' }; }
  return page.evaluate(async () => {
    const s = globalThis.__sim, w = s.world, h = globalThis.__world3d, P = s.state.player, subj = [];
    const add = (id, x, y) => { if (Number.isFinite(x) && Number.isFinite(y)) subj.push({ id, x, y }); };
    add('spawn', P.x, P.y);
    if (w.kind === 'town') {
      const { ENV_FOOT } = await import('/src/sim/envfoot.js'), TOWN = await (await fetch('/tools/actor-lab/town.json')).json();
      const st = (w.structs || []);
      for (const n of w.npcs || []) add(`npc:${n.id}`, n.x, n.y);
      for (const sv of w.services || []) {   // (the step before the door: the middle of its +x or +y face, a tile and a half out)
        const e = (TOWN[w.region] || []).find((q) => q.id === sv.id), sct = st.find((q) => q.id === sv.id) || sv, f = ENV_FOOT[sv.id];
        if (!f) continue;
        const r = [sct.x + f[0], sct.y + f[1], sct.x + f[2], sct.y + f[3]];
        if (e && e.faceX) add(`door:${sv.kind}`, r[2] + 1.5, (r[1] + r[3]) / 2); else add(`door:${sv.kind}`, (r[0] + r[2]) / 2, r[3] + 1.5);
      }
      for (const e of w.exits || []) add(`way:${e.to}${e.region ? ':' + e.region : ''}`, (e.x0 + e.x1) / 2, (e.y0 + e.y1) / 2);
    } else if (w.kind === 'overland') {
      for (const e of w.exits || []) add(`way:${e.site || e.to}${e.region ? ':' + e.region : ''}`, (e.x0 + e.x1) / 2, (e.y0 + e.y1) / 2);   // (in the way itself: a gate faces east, a road leaves off the map's edge)
      for (const [k, a] of Object.entries(w.arrivals || {})) if (k !== 'default') add(`arrive:${k}`, a.x, a.y);
    } else {
      const L = w.level;
      if (w.exitAt) add('stair up', w.exitAt.x, w.exitAt.y + 1);
      if (w.stairsAt) add('stair down', w.stairsAt.x + 0.5, w.stairsAt.y + 1.5);
      for (const r of L.rooms) if (r !== L.entrance) add(`room:${r.part || r.id}`, r.cx + 0.5, r.cy + 0.5);
    }
    const out = [];
    for (const q of subj) {
      P.x = P.px = q.x; P.y = P.py = q.y;
      for (let i = 0; i < 6; i++) globalThis.__frame(16);
      const v = h.sees(q.x, q.y);
      out.push({ ...q, x: Math.round(q.x * 10) / 10, y: Math.round(q.y * 10) / 10, seen: v ? v.seen : null, by: v ? v.by : [] });
    }
    return { subjects: out };
  }).then((r) => ({ name, ...r }));
}

const all = [];
for (const name of names) {
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 } }), page = await ctx.newPage(), errs = [];
  page.on('pageerror', (e) => errs.push(e.message));
  const r = await survey(page, name).catch((e) => ({ name, error: String(e.message || e).split('\n')[0] }));
  if (SHOTS && r.subjects) {   // (--shots dir: a picture of each subject under the bar, the hero stood there)
    await mkdir(SHOTS, { recursive: true });
    for (const q of r.subjects.filter((q) => q.seen !== null && q.seen < SEEN)) {
      await page.evaluate(({ x, y }) => { const P = globalThis.__sim.state.player; P.x = P.px = x; P.y = P.py = y; for (let i = 0; i < 8; i++) globalThis.__frame(16); }, q);
      await page.screenshot({ path: join(SHOTS, `${name}-${q.id.replace(/[^a-z0-9_-]+/gi, '_')}.png`), timeout: 240000 }).catch(() => {});
    }
  }
  await ctx.close();
  if (errs.length) r.errors = errs;
  all.push(r);
  if (r.error) { console.log(`${name}: ${r.error}`); continue; }
  const bad = r.subjects.filter((q) => q.seen !== null && q.seen < SEEN);
  console.log(`${name}: ${r.subjects.length} subjects, ${bad.length} under ${SEEN}` + bad.map((q) => `\n  ${q.id} at ${q.x},${q.y}: ${Math.round(q.seen * 100)} % in view, hidden by ${q.by.join(', ')}`).join(''));
}
if (JSON_OUT) await writeFile(JSON_OUT, JSON.stringify(all, null, 1));
const total = all.flatMap((r) => r.subjects || []), under = total.filter((q) => q.seen !== null && q.seen < SEEN).length, failed = all.filter((r) => r.error).length;
console.log(`all: ${total.length} subjects on ${all.length} maps, ${under} under ${SEEN}, ${failed} maps that didn't build`);
await b.close(); srv.close();
if ((under || failed) && !WARN) process.exit(1);
