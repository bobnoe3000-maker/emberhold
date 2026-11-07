// bosses.mjs — burst frames of every boss's mechanic as the game draws it in a real fight (docs/combat-fx.md, the
// boss pass): each boss's own hall, on its own floor, a party of the contract's (fighter, rogue, cleric) at the hall's
// level, with every skill learned, on Emberlit and on Luminati. The sim is deterministic, so the same mechanic fires at
// the same moment on every checkout: a before and an after line up frame for frame.
//
//   node tools/capture/bosses.mjs [--renderer both|emberlit|luminati] [--out dir] [--base url] [--secs 90] [--only id,id]
//
// For each boss, the first time its mechanic fires (its bus event: bossIssue, bossCall, …; for the ones that hold on
// through the fight, the Standard's line, Teague's cage and the Choir's singing, a moment 4 s into the fight) it shoots
// frames at +0, +0.2, +0.4, +0.7, +1.0, +1.4 s, cropped round the spot, and writes <out>/<renderer>/<boss>.png strips and
// <out>/sheet.jpg (a row a boss, a column a moment; the renderers side by side). Needs ?dev, so localhost.
import { createServer } from 'node:http';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { join, extname, normalize, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const ROOT = fileURLToPath(new URL('../..', import.meta.url));
const args = process.argv.slice(2), opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const RENDERERS = (opt('--renderer', 'both') === 'both' ? 'emberlit,luminati' : opt('--renderer')).split(',');
const OUT = resolve(opt('--out', join(ROOT, 'tools/capture/out/bosses'))), SECS = +opt('--secs', 90), ONLY = opt('--only', '');
const AT = [0, 200, 400, 700, 1000, 1400];
// each boss: its site and floor (sites.js bosses: floor n is depth n − 1), the event its mechanic fires, or a moment of
// the fight for one that holds (`hold`, ms after the boss's wave)
const CASES = [
  { boss: 'quartermaster', site: 'barrows', depth: 1, ev: 'bossIssue', stage: true },   // (staged, below: his issue never fires)
  { boss: 'goblin_chief', site: 'wickham_keep', depth: 0, ev: 'bossSwarm' },
  { boss: 'redhand_captain', site: 'wickham_keep', depth: 1, ev: 'bossCall' },
  { boss: 'robed_stranger', site: 'sunken_chapel', depth: 0, ev: 'bossKindle' },
  { boss: 'standard', site: 'sunken_chapel', depth: 1, hold: 4000 },
  { boss: 'teague', site: 'drowned_abbey', depth: 0, hold: 4000 },
  { boss: 'drowned_choir', site: 'drowned_abbey', depth: 1, hold: 4000 },
  { boss: 'abbess_below', site: 'drowned_abbey', depth: 2, ev: 'bossFlood' },
].filter((c) => !ONLY || ONLY.split(',').includes(c.boss));
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
// to the boss's floor, the party (fighter, rogue, cleric) at the hall's level with every trial, at the hall's door
async function stagePage({ site, depth, ev }) {
  const sim = globalThis.__sim, { makeHero, makeMember, statsFor } = await import('/src/sim/party.js'), { autoAllocate } = await import('/src/sim/attributes.js'), { starterKit } = await import('/src/sim/items.js');
  if (depth) sim.restore({ ...JSON.parse(JSON.stringify(sim.snapshot())), scene: 'dungeon', site, depth });
  for (let i = 0; i < 4; i++) globalThis.__frame(16);
  const L = sim.world.level, hall = L.descentRoom, lv = Math.max(1, (sim.world.roomLevels && sim.world.roomLevels.get(hall.id)) || 1);
  sim.state.trials = { fighter: 1, rogue: 1, mage: 1, cleric: 1, shaman: 1, fighter12: 1, rogue12: 1, mage12: 1, cleric12: 1, shaman12: 1 };
  sim.state.party = ['fighter', 'rogue', 'cleric'].map((c, i) => { const m = i ? makeMember('c' + i, ['Wren', 'Tam'][i - 1], c, lv) : makeHero({ cls: c }); m.level = lv; m.attrs = null; m.autoAttrs = true; autoAllocate(m); m.gear = starterKit(m); m.hp = statsFor(m).maxHp; m.mp = statsFor(m).maxMp; return m; });
  const P = sim.state.player; P.x = P.px = hall.cx + 0.5; P.y = P.py = hall.cy + 0.5;
  sim.state.party.forEach((m, i) => { if (m !== P) { m.x = m.px = P.x + (i === 1 ? 1.2 : -1.2); m.y = m.py = P.y + 1; } });
  globalThis.__bossEv = null; globalThis.__waveAt = null;
  sim.bus.on('bossWave', () => { if (globalThis.__waveAt == null) globalThis.__waveAt = sim.state.t; });
  if (ev) sim.bus.on(ev, (e) => { if (!globalThis.__bossEv && (ev !== 'bossFlood' || e.level > 0)) globalThis.__bossEv = { t: sim.state.t, x: e.x ?? P.x, y: e.y ?? P.y }; });
  return { lv, hall: hall.id };
}
function advance(ms) { globalThis.__lumDraw = false; for (let t = 0; t < ms; t += 33) globalThis.__frame(33); globalThis.__lumDraw = true; }
// a 300 × 300 crop round a screen point (CSS px), from every full-window canvas
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
  for (const C of CASES) {
    const p = await b.newPage({ viewport: { width: 390, height: 844 } });
    const errs = []; p.on('pageerror', (e) => errs.push(String(e)));
    await p.goto(`${base}/index.html?dev&manual&notitle&scene=dungeon&site=${C.site}${renderer === 'luminati' ? '&renderer=luminati' : ''}`);
    await p.waitForFunction(() => typeof globalThis.__frame === 'function' && globalThis.__sim, null, { timeout: 120000 });
    await p.evaluate(`globalThis.__take = ${take.toString()}; globalThis.__advance = ${advance.toString()};`);
    const settle = async () => { for (let i = 0; i < 600; i++) { if (await p.evaluate(() => { for (let k = 0; k < 4; k++) globalThis.__frame(16); return !globalThis.__renderer.transiting && (!globalThis.__world3d || globalThis.__world3d.world?.stats.level >= 1); })) return; await p.waitForTimeout(100); } };
    await settle();
    const info = await p.evaluate(stagePage, C);
    await settle();
    let got = null;
    for (let t = 0; t < SECS * 1000 && !got; t += 250) {
      await p.evaluate((ms) => globalThis.__advance(ms), 250);
      got = await p.evaluate((C) => {
        const s = globalThis.__sim, P = s.state.player;
        if (C.ev) return globalThis.__bossEv;
        const w = globalThis.__waveAt; if (w == null || (s.state.t - w) * 1000 < C.hold) return null;
        const boss = (s.world.enemies || []).find((e) => e.boss === C.boss && e.hp > 0); return boss ? { t: s.state.t, x: boss.x, y: boss.y } : { t: s.state.t, x: P.x, y: P.y };
      }, C);
      // The Quartermaster's issue never fires in his hall (his escort is down by 9 s, his first issue due at 10 s): past 6 s
      // it's staged, the sim's own event for the most hurt of his ranks then (the effect as the game draws it; named so)
      if (C.stage && !got && t >= 6000) got = await p.evaluate(() => { const s = globalThis.__sim, qm = (s.world.enemies || []).find((e) => e.boss === 'quartermaster' && e.hp > 0);
        const rank = (s.world.enemies || []).filter((o) => o !== qm && !o.boss && o.hp > 0 && !o.dead).sort((a, b) => a.hp / a.maxHp - b.hp / b.maxHp)[0];
        if (!qm || !rank) return null; s.bus.emit('bossIssue', { id: 'quartermaster', by: qm.id, tid: rank.id, x: rank.x, y: rank.y }); return { t: s.state.t, x: rank.x, y: rank.y, staged: true }; });
      if (await p.evaluate(() => globalThis.__sim.state.party.every((m) => m.down || m.fallen))) break;
    }
    if (!got) { console.log(`${renderer} ${C.boss}: no ${C.ev || 'hold'} in ${SECS} s (lv ${info.lv})`); await p.close(); continue; }
    const frames = []; let last = 0;
    for (const at of AT) {
      await p.evaluate((ms) => globalThis.__advance(ms), at - last); last = at;
      frames.push(await p.evaluate(({ x, y }) => { const [sx, sy] = globalThis.__renderer.screenAt(x, y); return globalThis.__take(sx, sy - 20); }, got));
    }
    rows.push({ name: C.boss + (got.staged ? ' (staged)' : ''), frames });
    const strip = await p.evaluate(async (fr) => { const ims = await Promise.all(fr.map(async (u) => { const i = new Image(); i.src = u; await i.decode(); return i; }));
      const c = document.createElement('canvas'); c.width = ims[0].width * ims.length; c.height = ims[0].height; const g = c.getContext('2d'); ims.forEach((im, i) => g.drawImage(im, i * im.width, 0)); return c.toDataURL('image/png'); }, frames);
    await writeFile(join(OUT, renderer, `${C.boss}.png`), Buffer.from(strip.split(',')[1], 'base64'));
    console.log(`${renderer} ${C.boss}: ${C.ev || 'hold'} at ${got.t.toFixed(1)} s (lv ${info.lv})${errs.length ? ' · page errors ' + errs.slice(0, 2).join(' | ') : ''}`);
    await p.close();
  }
  await b.close();
  return rows;
}

const all = {};
await Promise.all(RENDERERS.map(async (r) => { all[r] = await run(r).catch((e) => { console.log(r, e.message); return []; }); }));
const b = await chromium.launch(), p = await b.newPage();
const names = [...new Set(RENDERERS.flatMap((r) => all[r].map((q) => q.name)))];
const jpg = await p.evaluate(async ({ names, all, rs, at }) => {
  const W = 300, H = 300, k = 0.5, cw = W * k, ch = H * k, lab = 120, gap = 12;
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
console.log(`done: ${names.length} bosses · ${join(OUT, 'sheet.jpg')}`);
