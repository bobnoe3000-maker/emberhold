// skills.mjs — burst frames of every class skill as the game draws it in a real fight (docs/combat-fx.md): two parties
// of level 15 (fighter, rogue, mage; cleric, shaman, fighter) with every skill learned, in a level-15 room of the Old
// Barrows, on Emberlit and on Luminati. The sim is deterministic, so the same skills fire at the same moments on
// every checkout: a before and an after line up frame for frame.
//
//   node tools/capture/skills.mjs [--out dir] [--base url] [--secs 150] [--party 1|2|3] [--land]
//
// --land: each skill's first landing on the screen instead (its 'skill' event, at: 'land'), cropped round where it lands, at +0, 0.08,
// 0.16, 0.25, 0.35, 0.5, 0.7 and 1.0 s (an explosion is over in a second; a cast's crop round the middle of the screen
// can miss where it lands)
//
// For each skill's first cast (its 'ability' event; a heal's or a guard's 'combat' event follows) it shoots frames at
// +0, +0.2, +0.4, +0.6, +0.8, +1.1 and +1.6 s, cropped round the caster, and writes <out>/<renderer>/<skill>.png
// strips and <out>/sheet.jpg (a row a skill, a column a moment; the renderers side by side). Needs ?dev, so localhost.
import { createServer } from 'node:http';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { join, extname, normalize, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const ROOT = fileURLToPath(new URL('../..', import.meta.url));
const args = process.argv.slice(2), opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
// (Luminati only since 2026-11-09, docs/luminati-only-cleanup.md: --renderer is gone. The URL still says
// &renderer=luminati, so a --base checkout from before draws on Luminati too, for a before and an after)
const RENDERERS = ['luminati'];
const OUT = resolve(opt('--out', join(ROOT, 'tools/capture/out/skills'))), SECS = +opt('--secs', 150);
const LAND = args.includes('--land'), AT = LAND ? [0, 80, 160, 250, 350, 500, 700, 1000] : [0, 200, 400, 600, 800, 1100, 1600];
// (the third: the mage first, where the foes come, for Frost Nova; the rogue's Backstab off, for Venom; the fighter
// starting hurt, for Second Wind)
const PARTIES = [['fighter', 'rogue', 'mage'], ['cleric', 'shaman', 'fighter'], ['mage', 'rogue', 'fighter']].filter((_, i) => !opt('--party') || +opt('--party') === i + 1);   // (--party N: only that one)
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.css': 'text/css', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.mp3': 'audio/mpeg' };
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

// ── in the page ─────────────────────────────────────────────────────────────────────────────────────────────────────
// the party at 15, every trial done, in the Breach at level 15; the first cast of each skill noted
async function stagePage(classes) {
  const sim = globalThis.__sim, { makeHero, makeMember, statsFor } = await import('/src/sim/party.js'), { autoAllocate } = await import('/src/sim/attributes.js'), { starterKit } = await import('/src/sim/items.js');
  sim.state.trials = { fighter: 1, rogue: 1, mage: 1, cleric: 1, shaman: 1, fighter12: 1, rogue12: 1, mage12: 1, cleric12: 1, shaman12: 1 };
  const third = classes[0] === 'mage';
  sim.state.party = classes.map((c, i) => { const m = i ? makeMember('c' + i, ['Wren', 'Tam'][i - 1], c, 15) : makeHero({ cls: c }); m.level = 15; m.attrs = null; m.autoAttrs = true; autoAllocate(m); m.gear = starterKit(m); m.hp = statsFor(m).maxHp; m.mp = statsFor(m).maxMp;
    if (third && c === 'rogue') m.off = ['backstab']; if (third && c === 'fighter') m.hp = Math.round(m.hp * 0.3); return m; });
  const L = sim.world.level, r = L.rooms.find((q) => q !== L.entrance && q !== L.descentRoom && q.size === 'large'), P = sim.state.player;
  sim.world.roomLevels.set(r.id, 15);
  P.x = P.px = r.cx + 0.5; P.y = P.py = r.cy + 0.5;
  sim.state.party.forEach((m, i) => { if (m !== P) { m.x = m.px = P.x + (i === 1 ? 1.2 : -1.2) - (third ? 4 : 0); m.y = m.py = P.y + 1 + (third ? 3 : 0); } });   // (the third: the mage alone in front, the foes on them)
  globalThis.__casts = []; const seen = new Set();
  // (--land: the first landing on the screen: a mage's first Firebolt can land 14 tiles off, out of a phone's view)
  const inView = (x, y) => { const [sx, sy] = globalThis.__renderer.screenAt(x, y); return sx > 90 && sx < innerWidth - 90 && sy > 120 && sy < innerHeight - 90; };
  if (globalThis.__land) sim.bus.on('skill', (e) => { if (e.at === 'land' && !seen.has(e.id) && inView(e.tx, e.ty)) { seen.add(e.id); globalThis.__casts.push({ name: e.id + ' lands', t: sim.state.t, x: e.tx, y: e.ty }); } });
  else sim.bus.on('combat', (c) => { if (c.t === 'ability' && !seen.has(c.name)) { seen.add(c.name); globalThis.__casts.push({ name: c.name, t: sim.state.t, x: c.x, y: c.y }); } });
  globalThis.__skillsLog = [];
  return true;
}
// frames until the next uncaptured cast (Luminati stepped, not drawn), then the burst
function advance(ms) { globalThis.__lumDraw = false; for (let t = 0; t < ms; t += 33) globalThis.__frame(33); globalThis.__lumDraw = true; }
function take(cx, cy) {
  globalThis.__frame(16);
  const W = 300, H = 300, d = devicePixelRatio, c = document.createElement('canvas'); c.width = W * d; c.height = H * d;
  const g = c.getContext('2d'); g.fillStyle = '#000'; g.fillRect(0, 0, c.width, c.height);
  for (const cv of document.querySelectorAll('canvas')) {
    const st = getComputedStyle(cv), r = cv.getBoundingClientRect();
    if (cv === c || st.display === 'none' || st.visibility === 'hidden' || r.width * r.height < innerWidth * innerHeight * 0.5) continue;
    g.drawImage(cv, (r.left - (cx - W / 2)) * d, (r.top - (cy - H / 2)) * d, r.width * d, r.height * d);
  }
  return c.toDataURL('image/png');
}

async function run(renderer) {
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  await mkdir(join(OUT, renderer), { recursive: true });
  const rows = [];
  for (const classes of PARTIES) {
    const p = await b.newPage({ viewport: { width: 390, height: 844 } });
    const errs = []; p.on('pageerror', (e) => errs.push(String(e)));
    await p.goto(`${base}/index.html?dev&manual&notitle&scene=dungeon&site=barrows&renderer=luminati`);
    await p.waitForFunction(() => typeof globalThis.__frame === 'function' && globalThis.__sim, null, { timeout: 120000 });
    for (let i = 0; i < 600; i++) { if (await p.evaluate(() => { for (let k = 0; k < 4; k++) globalThis.__frame(16); return !globalThis.__renderer.transiting && (!globalThis.__world3d || globalThis.__world3d.world?.stats.level >= 1); })) break; await p.waitForTimeout(100); }
    await p.evaluate(`globalThis.__take = ${take.toString()}; globalThis.__advance = ${advance.toString()};`);
    if (LAND) await p.evaluate(() => { globalThis.__land = true; });
    await p.evaluate(stagePage, classes);
    let done = 0;
    for (let t = 0; t < SECS * 1000; t += 250) {
      await p.evaluate((ms) => globalThis.__advance(ms), 250);
      const casts = await p.evaluate(() => globalThis.__casts);
      while (done < casts.length) {
        const c = casts[done++], frames = [];
        let last = 0;
        for (const at of AT) {
          await p.evaluate((ms) => globalThis.__advance(ms), at - last); last = at;
          frames.push(await p.evaluate((c) => { if (globalThis.__land) { const [sx, sy] = globalThis.__renderer.screenAt(c.x, c.y); return globalThis.__take(sx, sy - 20); } return globalThis.__take(innerWidth / 2, innerHeight * 0.47); }, c));   // (the camera holds the party: the casters stand round the middle; --land: round where it lands)
        }
        t += last;
        rows.push({ party: classes.join('+'), name: c.name, frames });
        const strip = await p.evaluate(async (fr) => { const ims = await Promise.all(fr.map(async (u) => { const i = new Image(); i.src = u; await i.decode(); return i; }));
          const c = document.createElement('canvas'); c.width = ims[0].width * ims.length; c.height = ims[0].height; const g = c.getContext('2d'); ims.forEach((im, i) => g.drawImage(im, i * im.width, 0)); return c.toDataURL('image/png'); }, frames);
        await writeFile(join(OUT, renderer, `${c.name.toLowerCase().replace(/[^a-z]+/g, '_')}.png`), Buffer.from(strip.split(',')[1], 'base64'));
        console.log(`${renderer} ${classes.join('+')}: ${c.name} at ${c.t.toFixed(1)} s`);
      }
      // Frost Nova wants two foes within 2.8 tiles of the mage, which no fight here sets up: past 20 s it's staged, the
      // sim's own event sent with the foes nearest the mage (the effect as the game draws it, in the real scene; named so)
      if (classes[0] === 'mage' && t >= 20000 && !(await p.evaluate(() => globalThis.__casts.some((c) => c.name.startsWith('Frost Nova'))))) {
        await p.evaluate(() => { const s = globalThis.__sim, m = s.state.player, near = s.world.enemies.filter((e) => !e.dead && e.hp > 0).sort((a, b) => Math.hypot(a.x - m.x, a.y - m.y) - Math.hypot(b.x - m.x, b.y - m.y)).slice(0, 3);
          globalThis.__casts.push({ name: 'Frost Nova (staged)', t: s.state.t, x: m.x, y: m.y });
          s.bus.emit('skill', { id: 'frost_nova', at: 'land', cls: 'mage', by: m.id, x: m.x, y: m.y, tid: m.id, ally: true, tx: m.x, ty: m.y, r: 2.8, reached: near.map((e) => ({ id: e.id, x: e.x, y: e.y })), crit: false }); });
      }
      if (await p.evaluate(() => globalThis.__sim.state.party.every((m) => m.down || m.fallen))) break;
    }
    if (errs.length) console.log(`${renderer}: page errors ${errs.slice(0, 2).join(' | ')}`);
    await p.close();
  }
  await b.close();
  return rows;
}

const all = {};
await Promise.all(RENDERERS.map(async (r) => { all[r] = await run(r).catch((e) => { console.log(r, e.message); return []; }); }));
// the sheet: a row a skill (in the order first cast), the renderers' strips side by side
const b = await chromium.launch(), p = await b.newPage();
const names = [...new Set(RENDERERS.flatMap((r) => all[r].map((q) => q.name)))];
const jpg = await p.evaluate(async ({ names, all, rs, at }) => {
  const W = 300, H = 300, k = 0.5, cw = W * k, ch = H * k, lab = 110, gap = 12;
  const c = document.createElement('canvas'); c.width = lab + rs.length * (at.length * cw + gap); c.height = 24 + names.length * (ch + 4);
  const g = c.getContext('2d'); g.fillStyle = '#100c16'; g.fillRect(0, 0, c.width, c.height); g.font = '12px ui-monospace, Menlo, monospace';
  rs.forEach((r, ri) => { g.fillStyle = '#c8baa2'; g.fillText(`${r} · +${at.map((a) => a / 1000).join(' · ')} s`, lab + ri * (at.length * cw + gap), 15); });
  for (const [ni, n] of names.entries()) {
    const y = 24 + ni * (ch + 4); g.fillStyle = '#f0c880'; g.fillText(n, 6, y + ch / 2);
    for (const [ri, r] of rs.entries()) { const row = all[r].find((q) => q.name === n); if (!row) continue;
      for (const [fi, u] of row.frames.entries()) { const im = new Image(); im.src = u; await im.decode(); g.drawImage(im, lab + ri * (at.length * cw + gap) + fi * cw, y, cw, ch); } }
  }
  return c.toDataURL('image/jpeg', 0.86);
}, { names, all, rs: RENDERERS, at: AT });
await writeFile(join(OUT, 'sheet.jpg'), Buffer.from(jpg.split(',')[1], 'base64'));
await b.close(); srv?.close();
console.log(`done: ${names.length} skills · ${join(OUT, 'sheet.jpg')}`);
