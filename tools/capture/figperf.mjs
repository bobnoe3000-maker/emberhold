// figperf.mjs — what the figures cost in play (the character engine's measure; the owner, 2026-11-10: "evaluate
// performance as well - optimize without any visual quality degradation - especially in gameplay"). Before and after
// each step of docs/character-look-plan.md, the same numbers:
//   · draws and triangles a frame: every WebGL draw call counted at the context (drawElements / drawArrays and their
//     instanced forms), so every pass Luminati makes is in it, shadows and post included;
//   · frame time: the page's own requestAnimationFrame intervals, the median and the 95th percentile (real frames: the
//     game's loop, not the manual clock);
//   · the figures: how many stand as models, their meshes after compact and before, the JS heap.
// Scenes: the town square (the most figures at once) and a fight (the party and a wave in a Barrows room).
//   node tools/capture/figperf.mjs [--base url] [--secs 8] [--json out.json] [--query a=b]
// Software GL on a cloud box: compare runs on the same machine (a before and an after), not against a phone.
import { createServer } from 'node:http';
import { readFile, writeFile } from 'node:fs/promises';
import { join, extname, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const ROOT = fileURLToPath(new URL('../..', import.meta.url));
const args = process.argv.slice(2), opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const SECS = +opt('--secs', 8), OUT = opt('--json', null), QUERY = opt('--query', '');
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.css': 'text/css', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.mp3': 'audio/mpeg', '.glb': 'model/gltf-binary', '.wasm': 'application/wasm' };
let srv = null, base = opt('--base');
if (!base) {
  srv = createServer(async (req, res) => {
    const p = normalize(decodeURIComponent(new URL(req.url, 'http://x').pathname)).replace(/^([/\\])+/, '');
    try { const b = await readFile(join(ROOT, p || 'index.html')); res.writeHead(200, { 'content-type': MIME[extname(p)] || 'application/octet-stream' }); res.end(b); } catch { res.writeHead(404); res.end(); }
  });
  await new Promise((r) => srv.listen(0, r)); base = `http://localhost:${srv.address().port}`;
}

// counted at the context, before any script of the page's runs
const COUNT = () => {
  const c = { draws: 0, tris: 0 }; globalThis.__glCount = c;
  const tri = (mode, n, inst = 1) => { if (mode === 4) c.tris += (n / 3) * inst; else if (mode === 5 || mode === 6) c.tris += Math.max(0, n - 2) * inst; };
  for (const P of [globalThis.WebGL2RenderingContext, globalThis.WebGLRenderingContext].filter(Boolean).map((K) => K.prototype)) {
    for (const [name, f] of [['drawElements', (a) => tri(a[0], a[1])], ['drawArrays', (a) => tri(a[0], a[2])], ['drawElementsInstanced', (a) => tri(a[0], a[1], a[4])], ['drawArraysInstanced', (a) => tri(a[0], a[2], a[3])]]) {
      const o = P[name]; if (!o) continue;
      P[name] = function (...a) { c.draws++; f(a); return o.apply(this, a); };
    }
  }
};
const SCENES = [
  { name: 'town square', q: 'scene=town' },
  { name: 'barrows fight', q: 'scene=dungeon&site=barrows', fight: true },
];
const b = await chromium.launch();
const out = [];
for (const S of SCENES) {
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 }), p = await ctx.newPage();
  await p.addInitScript(COUNT); p.setDefaultTimeout(240000);
  await p.goto(`${base}/index.html?dev&notitle&world=on&${S.q}${QUERY ? '&' + QUERY : ''}`);
  await p.waitForFunction(() => globalThis.__world3d?.world?.stats?.level, null, { timeout: 240000 });
  if (S.fight) await p.evaluate(() => {   // the party into the middle of the floor's first room past the entrance: the fight starts
    const sim = globalThis.__sim, L = sim.world.level, r = L.rooms.find((q) => q !== L.entrance), pl = sim.state.player;
    let best = null, bd = 1e9; for (const [k, c] of L.cells) { if (c.kind !== 'floor' || c.room !== r.id) continue; const [x, y] = k.split(',').map(Number), d = Math.hypot(x - r.cx, y - r.cy); if (d < bd) { bd = d; best = [x, y]; } }
    pl.x = pl.px = best[0] + 0.5; pl.y = pl.py = best[1] + 0.5;
    for (const m of sim.state.party) m.hp = 1e6;                                  // (standing all through the measure)
  });
  // every figure in view stood as a model (or a minute): what's measured is the models, not the sprites they replace
  await p.waitForFunction(() => { const s = globalThis.__world3d?.world?.stats; return s && s.actors > 0 && s.models >= s.actors; }, null, { timeout: 120000 }).catch(() => null);
  await p.waitForTimeout(1500);
  const m = await p.evaluate((secs) => new Promise((done) => {
    const c = globalThis.__glCount, frames = []; let last = performance.now(), d0 = c.draws, t0 = c.tris;
    const t1 = performance.now() + secs * 1000;
    const tick = (now) => {
      frames.push({ dt: now - last, draws: c.draws - d0, tris: c.tris - t0 }); last = now; d0 = c.draws; t0 = c.tris;
      if (now < t1) requestAnimationFrame(tick); else {
        const f = frames.slice(2), q = (a, k) => { const s = a.map((x) => x[k]).sort((x, y) => x - y); return s[Math.floor(s.length * 0.5)]; }, p95 = (a) => { const s = a.map((x) => x.dt).sort((x, y) => x - y); return s[Math.floor(s.length * 0.95)]; };
        const st = globalThis.__world3d.world.stats;
        done({ frames: f.length, msMedian: Math.round(q(f, 'dt') * 10) / 10, ms95: Math.round(p95(f) * 10) / 10, draws: q(f, 'draws'), tris: Math.round(q(f, 'tris')),
          actors: st.actors, models: st.models, meshes: st.modelMeshes, meshesBefore: st.modelMeshesBefore, names: st.modelNames,
          heapMB: performance.memory ? Math.round(performance.memory.usedJSHeapSize / 1048576) : null, figErr: st.figErr || null, fight: !!globalThis.__sim.battle });
      }
    };
    requestAnimationFrame(tick);
  }), SECS);
  out.push({ scene: S.name, ...m }); console.log(S.name.padEnd(14), JSON.stringify(m));
  await ctx.close();
}
await b.close(); if (srv) srv.close();
if (OUT) await writeFile(OUT, JSON.stringify(out, null, 2));
