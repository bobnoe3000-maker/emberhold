// furnace-smoke.mjs — Furnace Nine's stack smoke (docs/art-critic-pass-reach-fx.md), in one of two places:
//   · the Stage (default): the region boss stood alone in a dungeon room (src/dev/stage.js show=cast), its idle looping on
//     the manual clock, and what a frame costs: every WebGL draw call and triangle counted at the context (as figperf.mjs
//     counts them), the median of FRAMES frames, with the furnace in view and with the Stage empty (the furnace's share);
//     --site / --floor / --room: which room (the Old Barrows' biggest by default: underground's violet fill);
//   · --where mouth: where it stands, the Vault's mouth on the Cinder Reach's overland (camps.js reach_mouth), in its
//     window (?ring=furnace holds it open) with its lamp broken (state.lampsBroken), the hero (level 1: it doesn't stir for
//     him, so it stands) --at tiles south of it, the hour held at --tod (dusk by default); and the whole phone frame
//     (390 × 844, the game's zoom) at +2.5 s → <out>/play-<tag>.png.
// Either way a strip of the furnace at +0 … 2.5 s (the smoke over its stack, as it drifts or doesn't) → <out>/strip-<tag>.png,
// and the smoke measured at +2.5 s → <out>/numbers-<tag>.json: the frame drawn with Luminati's particles and without, and
// the pixels that differ in the box over its stack (the crop's top half: the smoke and its sparks, not the works'
// chimneys at the mouth): their mean colour, its saturation and how violet it is (red and blue over green); what the smoke
// adds to each channel there (with − without, `add`, and how violet that is); how far right of the furnace they lie (dx,
// CSS px); the wind as Luminati has it; and the smoke's own colour as the particle shader lights it (its spawn colour × the
// sky's tint, `lit`).
//   node tools/capture/furnace-smoke.mjs [--where stage|mouth] [--site barrows --floor 0 --room big] [--tod dusk] [--at 5]
//                                        [--tag name] [--base url] [--out dir] [--frames 30] [--dpr 1]
// Needs ?dev, so localhost. A before: --base a checkout from before served elsewhere.
import { createServer } from 'node:http';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { join, extname, normalize, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const ROOT = fileURLToPath(new URL('../..', import.meta.url));
const args = process.argv.slice(2), opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const OUT = resolve(opt('--out', join(ROOT, 'tools/capture/out/furnace-smoke'))), FRAMES = +opt('--frames', 30), DPR = +opt('--dpr', 1);
const WHERE = opt('--where', 'stage'), SITE = opt('--site', 'barrows'), FLOOR = +opt('--floor', 0), ROOM = opt('--room', 'big');
const TOD = opt('--tod', WHERE === 'mouth' ? 'dusk' : ''), AT = +opt('--at', 5), TAG = opt('--tag', WHERE === 'mouth' ? `mouth-${TOD || 'live'}` : `${SITE}-f${FLOOR}`);
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.css': 'text/css', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.mp3': 'audio/mpeg', '.glb': 'model/gltf-binary' };
let srv = null, base = opt('--base');
if (!base) {
  srv = createServer(async (req, res) => {
    const p = normalize(join(ROOT, decodeURIComponent(req.url.split('?')[0])));
    if (!p.startsWith(ROOT)) { res.writeHead(403); return res.end(); }
    try { const b = await readFile(p); res.writeHead(200, { 'Content-Type': MIME[extname(p)] || 'application/octet-stream' }); res.end(b); } catch { res.writeHead(404); res.end(); }
  });
  await new Promise((r) => srv.listen(0, '127.0.0.1', r));
  base = `http://127.0.0.1:${srv.address().port}`;
}
await mkdir(OUT, { recursive: true });
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

// ── in the page ─────────────────────────────────────────────────────────────────────────────────────────────────────
/** where the furnace stands on screen (CSS px), the Stage's figure or the overland's boss */
const AT_FN = `(() => { const R = globalThis.__renderer, S = globalThis.__stage;
  if (S && S.figures && S.figures[0]) return R.screenAt(S.figures[0].x, S.figures[0].y);
  const e = globalThis.__sim.world.enemies.find((q) => q.kind === 'furnace_nine'); return e ? R.screenAt(e.x, e.y) : [innerWidth / 2, innerHeight / 2]; })()`;
/** the frame drawn and every full-window canvas copied onto one, cropped round the furnace (crop) or whole; with
 *  particles false, Luminati's particles hidden for the frame (drawn without advancing the clock) */
const SHOT = ([crop, particles, advance, atFn]) => {
  const P = globalThis.__world3d?.world?.game?.particles;
  if (P && !particles) P.object.visible = false;
  globalThis.__frame(advance);
  if (P) P.object.visible = true;
  const d = devicePixelRatio, [sx, sy] = (0, eval)(atFn), [W, H] = crop || [innerWidth, innerHeight], x0 = crop ? sx - W / 2 : 0, y0 = crop ? sy - H + 40 : 0;
  const c = document.createElement('canvas'); c.width = W * d; c.height = H * d; const g = c.getContext('2d'); g.fillStyle = '#000'; g.fillRect(0, 0, c.width, c.height);
  for (const cv of document.querySelectorAll('canvas')) { const st = getComputedStyle(cv), r = cv.getBoundingClientRect(); if (cv === c || st.display === 'none' || st.visibility === 'hidden' || r.width * r.height < innerWidth * innerHeight * 0.5) continue; g.drawImage(cv, (r.left - x0) * d, (r.top - y0) * d, r.width * d, r.height * d); }
  return { url: c.toDataURL('image/png'), x0, y0, sx, sy };
};
/** the smoke: what particles add to the frame (with − without), and the shader's own colour of the last puff let go */
const SMOKE = async ([a, b, sx, x0]) => {
  const ld = async (u) => { const i = new Image(); i.src = u; await i.decode(); const c = document.createElement('canvas'); c.width = i.width; c.height = i.height; const g = c.getContext('2d'); g.drawImage(i, 0, 0); return g.getImageData(0, 0, i.width, i.height).data; };
  const A = await ld(a), B = await ld(b), d = devicePixelRatio, W = Math.round(220 * d);
  let n = 0, r = 0, g = 0, bl = 0, xs = 0, ar = 0, ag = 0, ab = 0;
  for (let i = 0; i < A.length; i += 4) {
    const px = ((i / 4) % W) / d, py = Math.floor(i / 4 / W) / d; if (py > 150 || Math.abs(px - 110) > 90) continue;   // (the box over its stack: not the works' chimneys at the mouth)
    if (Math.max(Math.abs(A[i] - B[i]), Math.abs(A[i + 1] - B[i + 1]), Math.abs(A[i + 2] - B[i + 2])) < 10) continue;
    n++; r += A[i]; g += A[i + 1]; bl += A[i + 2]; xs += px; ar += A[i] - B[i]; ag += A[i + 1] - B[i + 1]; ab += A[i + 2] - B[i + 2];
  }
  const mean = n ? [r / n, g / n, bl / n] : [0, 0, 0], mx = Math.max(...mean), mn = Math.min(...mean), L = (mx + mn) / 510;
  const sat = mx === mn ? 0 : (mx - mn) / 255 / (1 - Math.abs(2 * L - 1));
  // the shader's (Particles.js, a lit burst): colour × mix(1, amb + sun × 0.75, lit), amb by the night
  const P = globalThis.__world3d?.world?.game?.particles, pool = P && [...P._pools.entries()].find(([k]) => k.startsWith('smoke|') && k.includes('|normal|1|'));
  let lit = null;
  if (pool) {
    const q = pool[1], u = q.uniforms, j = ((q.head - 1 + q.capacity) % q.capacity) * 4, c = q.aColor.array, nt = u.uNight.value, s = u.uSunColor.value;
    const amb = [0.42 + (0.06 - 0.42) * nt, 0.45 + (0.08 - 0.45) * nt, 0.52 + (0.15 - 0.52) * nt], tint = [amb[0] + s.r * 0.75, amb[1] + s.g * 0.75, amb[2] + s.b * 0.75];
    const srgb = (v) => Math.round(255 * Math.min(1, v <= 0.0031308 ? v * 12.92 : 1.055 * Math.pow(v, 1 / 2.4) - 0.055));
    const out = [c[j] * tint[0], c[j + 1] * tint[1], c[j + 2] * tint[2]].map(srgb), hx = (v) => '#' + v.map((x) => x.toString(16).padStart(2, '0')).join('');
    lit = { spawn: hx([c[j], c[j + 1], c[j + 2]].map(srgb)), tint: tint.map((x) => +x.toFixed(3)), lit: hx(out), wind: [+u.uWind.value.x.toFixed(3), +u.uWind.value.y.toFixed(3)], windStrength: +u.uWindStrength.value.toFixed(3) };
  }
  const add = n ? [ar / n, ag / n, ab / n] : [0, 0, 0];
  return { px: n, mean: mean.map((v) => Math.round(v)), sat: +sat.toFixed(3), violet: +((mean[0] + mean[2]) / 2 - mean[1]).toFixed(1), add: add.map((v) => +v.toFixed(1)), addViolet: +((add[0] + add[2]) / 2 - add[1]).toFixed(1), dx: n ? +(xs / n + x0 - sx).toFixed(1) : null, ...lit };
};

const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const settle = async (p, mouth) => p.evaluate(async ([mouth, at]) => {
  const end = performance.now() + 180000, S = globalThis.__stage; globalThis.__lumDraw = false;
  const ok = () => { const H3 = globalThis.__world3d; if (!H3 || !H3.world || globalThis.__renderer.transiting) return false; const st = H3.world.stats; return st.level >= 1 && (mouth || S.names.every((n) => st.modelNames.includes(n))); };
  while (!ok() && performance.now() < end) { for (let i = 0; i < 4; i++) globalThis.__frame(16); await new Promise((r) => setTimeout(r, 0)); }
  if (mouth) {
    // its window and its lamp broken (the test's way, test/furnace.test.mjs: state set, ringOpen told), the hero south of it
    const sim = globalThis.__sim, s = sim.state, n = new Date(), z = (v) => String(v).padStart(2, '0');
    s.created = true; s.lampsBroken = ['furnace_nine'];
    sim.commands.push({ type: 'ringOpen', window: `${n.getFullYear()}-${z(n.getMonth() + 1)}-${z(n.getDate())}T${z(n.getHours())}:30`, left: 800 });
    for (let i = 0; i < 4; i++) globalThis.__frame(33);
    const e = sim.world.enemies.find((q) => q.kind === 'furnace_nine'); if (!e) throw new Error('Furnace Nine is not standing at the mouth');
    s.player.x = s.player.px = e.x + 0.5; s.player.y = s.player.py = e.y + at;
    const end2 = performance.now() + 120000;
    while (!(globalThis.__world3d.world.stats.modelNames || []).includes('boss_furnace_nine') && performance.now() < end2) { for (let i = 0; i < 4; i++) globalThis.__frame(16); await new Promise((r) => setTimeout(r, 0)); }
  }
  for (let i = 0; i < 90; i++) globalThis.__frame(33);         // (3 s of the clock: a plume up to its height)
  globalThis.__lumDraw = true;
}, [mouth, AT]);
const measure = async (cast) => {
  const mouth = WHERE === 'mouth';
  const p = await b.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: DPR }), errs = []; p.on('pageerror', (e) => errs.push(String(e)));
  await p.addInitScript(COUNT);
  const tod = TOD ? `&tod=${TOD}` : '';
  await p.goto(mouth ? `${base}/index.html?dev&manual&notitle&scene=overland&region=reach&ring=furnace${tod}`
    : `${base}/index.html?dev&manual&notitle&scene=stage&show=cast&cast=${cast}&per=1&cols=1&labels=0&clip=idle&dir=2&site=${SITE}&floor=${FLOOR}&room=${ROOM}${tod}`);
  await p.waitForFunction((mouth) => typeof globalThis.__frame === 'function' && (mouth ? globalThis.__sim : globalThis.__stage && globalThis.__stage.ready), mouth, { timeout: 120000 });
  await settle(p, mouth);
  let per = [];
  if (!mouth) per = await p.evaluate((n) => { const c = globalThis.__glCount, o = []; for (let i = 0; i < n; i++) { c.draws = 0; c.tris = 0; globalThis.__frame(33); o.push([c.draws, c.tris]); } return o; }, FRAMES);
  const med = (k) => (per.length ? per.map((q) => q[k]).sort((x, y) => x - y)[per.length >> 1] : null);
  let strip = null, smoke = null, play = null;
  if (cast !== 'none') {
    const frames = [];
    for (let i = 0; i < 6; i++) {
      const last = i === 5, a = await p.evaluate(SHOT, [[220, 300], true, 16, AT_FN]);
      frames.push(a.url);
      if (last) {
        const bb = await p.evaluate(SHOT, [[220, 300], false, 0, AT_FN]);
        smoke = await p.evaluate(SMOKE, [a.url, bb.url, a.sx, a.x0]);
        if (mouth) play = (await p.evaluate(SHOT, [null, true, 0, AT_FN])).url;
      } else await p.evaluate(() => { globalThis.__lumDraw = false; for (let t = 0; t < 500; t += 33) globalThis.__frame(33); globalThis.__lumDraw = true; });
    }
    strip = await p.evaluate(async (fr) => { const ims = await Promise.all(fr.map(async (u) => { const i = new Image(); i.src = u; await i.decode(); return i; }));
      const c = document.createElement('canvas'); c.width = ims[0].width * ims.length; c.height = ims[0].height + 18; const g = c.getContext('2d'); g.fillStyle = '#14121a'; g.fillRect(0, 0, c.width, c.height);
      ims.forEach((im, i) => { g.drawImage(im, i * im.width, 18); g.fillStyle = '#ddd'; g.font = '12px sans-serif'; g.fillText(`+${(i * 0.5).toFixed(1)} s`, i * im.width + 6, 13); }); return c.toDataURL('image/png'); }, frames);
  }
  const st = await p.evaluate(() => { const s = globalThis.__world3d.world.stats; return { models: s.models, modelNames: s.modelNames }; });
  await p.close();
  return { draws: med(0), tris: med(1) == null ? null : Math.round(med(1)), st, strip, smoke, play, errs };
};
const withF = await measure('boss_furnace_nine'), none = WHERE === 'mouth' ? null : await measure('none');
if (withF.strip) await writeFile(join(OUT, `strip-${TAG}.png`), Buffer.from(withF.strip.split(',')[1], 'base64'));
if (withF.play) await writeFile(join(OUT, `play-${TAG}.png`), Buffer.from(withF.play.split(',')[1], 'base64'));
const res = { where: WHERE, tag: TAG, smoke: withF.smoke, ...(none ? { furnace: { draws: withF.draws, tris: withF.tris, models: withF.st.modelNames }, empty: { draws: none.draws, tris: none.tris }, share: { draws: withF.draws - none.draws, tris: withF.tris - none.tris } } : { models: withF.st.modelNames }) };
await writeFile(join(OUT, `numbers-${TAG}.json`), JSON.stringify(res, null, 1) + '\n');
console.log(JSON.stringify(res), [...withF.errs, ...(none ? none.errs : [])].slice(0, 3).join(' | '));
console.log(`strip: ${join(OUT, `strip-${TAG}.png`)}`);
await b.close(); srv?.close();
