// bake.cjs — bake the game's actor atlases from bake.json into assets/actors/:
// <out>.json (cell size, foot anchor, clips, glow id) + <out>.alb.png (grim albedo,
// alpha = mask) + <out>.nrm.png (screen-space normals) + <out>.emi.png (glow mask,
// only when the figure has glowing parts), and for actors with `portrait: true` a lit head-and-
// shoulders <out>.face.png (96 × 112) for the windows; with `figure: { pose }` the whole lit figure
// <out>.fig.png (352 × 408) for the character window. Needs `npm i` + `sh fetch-assets.sh`.
//   node bake.cjs [actor…] [--anchors | --portraits]   (--anchors also refreshes each atlas's measured walk `stride`)
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright-core');
const { serve, CHROME, GL } = require('./render.cjs');
const DIR = __dirname, OUT = process.env.BAKE_OUT || path.join(DIR, '..', '..', 'assets', 'actors');   // BAKE_OUT: a scratch tree (prototypes; the Stage's cmp shows them)
(async () => {
  if (!fs.existsSync(path.join(DIR, 'models', 'Knight.glb'))) throw new Error('models missing — run: sh fetch-assets.sh');
  const spec = JSON.parse(fs.readFileSync(path.join(DIR, 'bake.json')));
  const vars = Object.fromEntries(JSON.parse(fs.readFileSync(path.join(DIR, 'variants.json'))).map((v) => [v.id, v]));
  const srv = await serve(DIR), port = srv.address().port;
  const b = await chromium.launch({ executablePath: CHROME, args: GL });
  const p = await (await b.newContext({ viewport: { width: 300, height: 300 } })).newPage();
  p.on('pageerror', (e) => console.log('PAGEERR', e.message));
  // the lab bakes at one figure height a page: an actor with its own `px` (art pass 9: the bosses, 73 = 56 × 1.3,
  // baked tall rather than nearest-upscaled at load) reopens it at that height; BAKE_PX scales everyone alike
  let open = 0;
  const pxOf = (a) => Math.round((a.px || spec.px) * (process.env.BAKE_PX ? +process.env.BAKE_PX / spec.px : 1));
  const lab = async (px) => {
    if (open === px) return; open = px;
    await p.goto(`http://127.0.0.1:${port}/lab.html?px=${px}${process.env.BAKE_PROTO ? '&proto=' + process.env.BAKE_PROTO : ''}${process.env.BAKE_HEAD ? '&head=' + process.env.BAKE_HEAD : ''}`);
    await p.waitForFunction(() => window.ready === true, { timeout: 60000 });   // (BAKE_PROTO / BAKE_HEAD / BAKE_PX: art pass 7 prototypes)
  };
  fs.mkdirSync(OUT, { recursive: true });
  const png = (f, url) => fs.writeFileSync(path.join(OUT, f), Buffer.from(url.split(',')[1], 'base64'));
  const only = process.argv.includes('--anchors');       // refresh the weapon anchors in the JSON only (fast, no raster)
  const portraitsOnly = process.argv.includes('--portraits');   // bake only the portraits and figures (seconds)
  const pick = process.argv.slice(2).filter((x) => !x.startsWith('--'));   // node bake.cjs hero_knight … bakes just those
  for (const a of spec.actors) {
    if (pick.length && !pick.includes(a.out)) continue;
    await lab(pxOf(a));
    if (a.portrait) {                                      // head-and-shoulders portrait for the windows (lab.js renderPortrait)
      const v = vars[a.variant];
      png(`${a.out}.face.png`, await p.evaluate(async (v) => await window.renderPortrait(v), v));
      console.log(`${a.out}: portrait ${a.out}.face.png`);
    }
    if (a.figure) {                                        // the whole figure for the character window (lab.js renderFigure)
      png(`${a.out}.fig.png`, await p.evaluate(async ([v, o]) => await window.renderFigure(v, o), [vars[a.variant], a.figure]));
      console.log(`${a.out}: figure ${a.out}.fig.png (${a.figure.pose.join(' ')})`);
    }
    if (portraitsOnly) continue;
    if (only) {
      const v = vars[a.variant], f = path.join(OUT, `${a.out}.json`), meta = JSON.parse(fs.readFileSync(f));
      const r = await p.evaluate(async ([v, clips]) => await window.bakeAnchors(v, clips), [v, a.clips]);
      if (r.frames !== meta.frames) throw new Error(`${a.out}: clips changed since the last full bake`);
      delete meta.anchors; if (Object.keys(r.anchors).length) meta.anchors = r.anchors;
      delete meta.stride; const { source, clips, ...rest } = meta;
      fs.writeFileSync(f, JSON.stringify({ ...rest, ...(r.stride ? { stride: r.stride } : {}), clips, source }) + '\n');
      console.log(`${a.out}: anchors ${Object.keys(r.anchors).join('+') || 'none'}, stride ${r.stride} ${JSON.stringify(r.info)}`); continue;
    }
    const v = { ...vars[a.variant], eyes: vars[a.variant].eyes ? parseInt(vars[a.variant].eyes) : undefined };
    const t0 = Date.now(), r = await p.evaluate(async ([v, clips, g]) => await window.bakeAtlas(v, clips, g), [{ ...v, ...(a.grade || {}) }, a.clips, a.gain ?? spec.albedoGain ?? 1]);   // per-actor gain / grade overrides
    // img: the images' own hash. The game fetches them at a version of this JSON's text (renderer atlasMeta), and a
    // re-bake that changes only pixels (2026-10-03: Old Skarn's ears) left the JSON, and so the cached images, as they were
    const img = require('crypto').createHash('sha1').update(r.alb).update(r.nrm).update(r.emi || '').digest('hex').slice(0, 10);
    const meta = { ...r.meta, glow: r.emi ? a.glow : 0, img, source: `KayKit CC0 · ${v.label} · heroic + grim · ${pxOf(a)}px` };
    fs.writeFileSync(path.join(OUT, `${a.out}.json`), JSON.stringify(meta) + '\n');
    png(`${a.out}.alb.png`, r.alb); png(`${a.out}.nrm.png`, r.nrm);
    const emi = path.join(OUT, `${a.out}.emi.png`); if (r.emi) png(`${a.out}.emi.png`, r.emi); else if (fs.existsSync(emi)) fs.unlinkSync(emi);
    console.log(`${a.out}: ${meta.frames} frames × 8 dirs, ${meta.cw}×${meta.ch} cells, glow ${meta.glow} (${((Date.now() - t0) / 1000).toFixed(1)}s)`);
    if (r.faceStats) console.log(`${a.out}: face ${JSON.stringify(r.faceStats)}`);   // (BAKE_PROTO=…,stats: the front idle cell's head box and feature pixels)
  }
  await b.close(); srv.close();
})().catch((e) => { console.error('FAIL', e.message); process.exit(1); });
