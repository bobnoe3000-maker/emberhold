// run.mjs — `npm run test:browser`: browser tests over a local static server.
//   1. replay parity: the scripted session's end-state hash in Chromium and WebKit equals Node's
//      (the sim must be bit-identical on V8 and JavaScriptCore — AGENTS.md rule 1, dev plan §2.13)
//   2. game slots (Chromium): v3 save → slot 1, new game in slot 2 with its own seed,
//      persistence, switching back, deleting
//   3. M3 exit test (Chromium): create → play → a Fallen companion → temple → resurrect →
//      wipe → wake at the temple, Weakened → inn rest → reload keeps the hero
//   4. boot and intro (Chromium): splash → loading → tap to begin → title → Begin → the six
//      cards in order, with their music → creation; The Chronicle replays it from the title
// Local runs skip an engine that isn't installed; CI (CI=true) requires both.
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, extname, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium, webkit } from 'playwright';
import { scriptedSession } from '../fixtures/session.mjs';

const ROOT = fileURLToPath(new URL('../..', import.meta.url));
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.png': 'image/png', '.css': 'text/css' };
const srv = createServer(async (req, res) => {
  const p = normalize(join(ROOT, decodeURIComponent(req.url.split('?')[0])));
  if (!p.startsWith(ROOT)) { res.writeHead(403); return res.end(); }
  try { const b = await readFile(p); res.writeHead(200, { 'Content-Type': MIME[extname(p)] || 'application/octet-stream' }); res.end(b); } catch (e) { res.writeHead(404); res.end(); }
});
await new Promise((r) => srv.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${srv.address().port}`;
const CI = !!process.env.CI, GL = ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'];
async function launch(type, name) {
  try { return await type.launch(type === chromium ? { args: GL } : {}); } catch (e) {
    if (type === chromium && existsSync('/opt/pw-browsers/chromium')) return chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: GL });
    if (CI) throw e;
    console.log(`SKIP ${name}: not installed here (CI runs it)`); return null;
  }
}
const results = [];
// a game page is up: the sim exists and, unless it's a preview, the boot (splash → loading) has
// been tapped through to the title
async function booted(p) {
  await p.waitForFunction(() => !!globalThis.__sim && !window.__old, null, { timeout: 60000 });
  if (await p.locator('#cine.on, #bootSplash').count()) {
    await p.waitForSelector('#cine .begin:not([hidden])', { timeout: 60000 }); await p.tap('#cine'); await p.waitForSelector('#titleWrap.on', { timeout: 10000 });
  }
  await p.waitForTimeout(500);
}
const check = (name, ok, detail) => { results.push(ok); console.log(`${ok ? 'PASS' : 'FAIL'} ${name}${detail ? ' · ' + detail : ''}`); };

// 1. replay parity
const node = scriptedSession();
check('node: session replays to its own hash', node.endHash === node.replayHash, `${node.endHash} (L${node.level} ${node.xp}xp ${node.gold}g)`);
for (const [type, name] of [[chromium, 'chromium'], [webkit, 'webkit']]) {
  const b = await launch(type, name); if (!b) continue;
  const p = await b.newPage();
  await p.goto(`${base}/test/browser/replay.html`); await p.waitForFunction(() => window.__result, null, { timeout: 120000 });
  const r = await p.evaluate(() => window.__result);
  check(`${name}: same end state as node`, !r.error && r.endHash === node.endHash && r.replayHash === node.endHash, r.error || r.endHash);
  await b.close();
}

// 2. game slots (needs WebGL2 for the game page: chromium + SwiftShader)
{
  const b = await launch(chromium, 'chromium');
  if (b) {
    const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true }), p = await ctx.newPage();
    const errs = []; p.on('pageerror', (e) => errs.push(e.message));
    const game = `${base}/index.html`;
    const ready = () => booted(p);
    const reloadVia = async (fn) => { await p.evaluate(() => (window.__old = 1)); await fn(); await ready(); };
    const menu = async () => { if (!(await p.locator('#titleWrap.on').count())) { await p.tap('#menuBtn'); await p.waitForTimeout(300); } await p.locator('#title button', { hasText: 'Game slots' }).tap(); await p.waitForTimeout(300); };
    await p.goto(game + '?scene=town&dev'); await ready();            // a preview page never autosaves: seed a v3 player's save
    await p.evaluate(() => { const s = globalThis.__sim.snapshot(); s.party[0].name = 'Legacy'; s.counters.gold = 123; localStorage.clear();
      for (const k of ['created', 'bench', 'temple']) delete s[k];                  // a v3 save predates these
      localStorage.setItem('emberhold.save', JSON.stringify({ version: 3, savedAt: Date.now(), data: s })); });
    await p.goto(game + '?dev'); await ready();
    const m1 = await p.evaluate(() => ({ name: globalThis.__sim.state.party[0].name, gold: globalThis.__sim.state.counters.gold, seed: globalThis.__sim.seed }));
    check('slots: v3 save migrates into slot 1', m1.name === 'Legacy' && m1.gold === 123);
    check('slots: an old save opens on the title with Continue', await p.locator('#title button.pri', { hasText: 'Continue' }).isVisible());
    await menu();
    await reloadVia(() => p.locator('.slot.empty button').first().tap());
    const s2 = await p.evaluate(() => ({ seed: globalThis.__sim.seed, gold: globalThis.__sim.state.counters.gold, created: globalThis.__sim.state.created }));
    check('slots: slot 2 is a new game with its own seed, waiting for its hero', s2.seed !== m1.seed && s2.gold === 0 && !s2.created);
    await p.evaluate(() => { const s = globalThis.__sim; s.commands.push({ type: 'createHero', cls: 'rogue', look: 'hero_rogue', origin: 'thornwick_born', name: 'Wick' }); for (let i = 0; i < 3; i++) s.tick(); });
    await p.evaluate(() => { globalThis.__sim.state.counters.gold = 77; window.dispatchEvent(new Event('pagehide')); });
    await p.waitForTimeout(200); await reloadVia(() => p.reload());
    check('slots: slot 2 progress persists', (await p.evaluate(() => globalThis.__sim.state.counters.gold)) === 77);
    await menu();
    await reloadVia(() => p.locator('.slot button.pri').first().tap());
    const back = await p.evaluate(() => ({ name: globalThis.__sim.state.party[0].name, gold: globalThis.__sim.state.counters.gold }));
    check('slots: slot 1 intact after switching', back.name === 'Legacy' && back.gold === 123);
    await menu();
    await p.locator('.slot button.del').first().tap(); await p.locator('.slot button.del').first().tap(); await p.waitForTimeout(400);
    check('slots: slot 2 deleted', (await p.locator('.slot.empty').count()) === 2);
    check('slots: no page errors', errs.length === 0, errs.join(' | '));
    await b.close();
  }
}
// 3. M3 exit test: create → play → Fallen → temple → resurrect → wipe → temple → inn → reload
{
  const b = await launch(chromium, 'chromium');
  if (b) {
    const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true }), p = await ctx.newPage();
    const errs = []; p.on('pageerror', (e) => errs.push(e.message));
    const game = `${base}/index.html`;
    const ready = () => booted(p);
    const S = (fn, arg) => p.evaluate(fn, arg);
    await p.goto(game + '?dev&slot=1'); await S(() => { localStorage.clear(); indexedDB.deleteDatabase('emberfall'); });
    await p.goto(game + '?dev&slot=1'); await ready();
    // create, through the screens
    await p.locator('#title button.pri', { hasText: 'Begin' }).tap(); await p.waitForSelector('#cine .skip:not([hidden])');
    await p.tap('#cine .skip'); await p.waitForSelector('#createWrap.on'); await p.waitForTimeout(300);   // the intro (section 4 plays it through)
    await p.locator('#create .opt', { hasText: 'Fighter' }).tap(); await p.locator('#create .nav .pri').tap();
    await p.locator('#create .opt', { hasText: 'Barbarian' }).tap(); await p.locator('#create .nav .pri').tap();
    await p.locator('#create .opt', { hasText: 'Redhand deserter' }).tap(); await p.locator('#create .nav .pri').tap();
    await p.fill('#create input', 'Brann<script>'); await p.locator('#create .nav .pri').tap();
    await p.locator('#create .nav .pri', { hasText: 'Begin' }).tap(); await p.waitForTimeout(600);
    const h = await S(() => { const q = globalThis.__sim.state.party[0]; return { name: q.name, cls: q.cls, actor: q.actor, origin: q.origin, created: globalThis.__sim.state.created }; });
    check('m3: created through the screens (name cleaned)', h.created && h.name === 'Brannscript' && h.cls === 'fighter' && h.actor === 'hero_barbarian' && h.origin === 'redhand_deserter', JSON.stringify(h));
    // hire at the tavern (the square's service bar)
    await S(() => { globalThis.__sim.state.counters.gold = 200; });
    await p.locator('#hubBar button[data-k=tavern]').tap(); await p.waitForTimeout(400);
    await p.locator('#hubSheet [data-go=hire]').tap(); await p.waitForTimeout(300);
    await p.locator('#hubSheet [data-hire="1"]').tap(); await p.waitForTimeout(300); await p.locator('#hubSheet .close').tap();
    check('m3: hired a companion at the tavern', (await S(() => globalThis.__sim.state.party.length)) === 2);
    // play: into a dungeon room; the companion is Downed and left behind → Fallen (a ghost)
    const room = async (hp) => S(async (hp) => {
      const s = globalThis.__sim, { isWalkable } = await import('/src/sim/world.js'), snap = s.snapshot(); snap.scene = 'dungeon'; snap.depth = 0; s.restore(snap);
      const L = s.world.level, r = L.rooms.find((q) => q !== L.entrance); let best = null, bd = 1e9;
      for (const [k, c] of L.cells) { if (c.kind !== 'floor' || c.room !== r.id) continue; const [x, y] = k.split(',').map(Number); const d = Math.hypot(x - r.cx, y - r.cy); if (d < bd && isWalkable(s.world, x + 0.5, y + 0.5)) { bd = d; best = [x, y]; } }
      s.state.player.x = best[0] + 0.5; s.state.player.y = best[1] + 0.5; for (const [i, v] of hp.entries()) if (v !== null) s.state.party[i].hp = v;
    }, hp);
    await room([null, 1]);
    await p.waitForFunction(() => { const c = globalThis.__sim.state.party[1]; c.hp = Math.min(c.hp, 1); return c.down; }, null, { timeout: 60000, polling: 50 });
    await S(() => { const s = globalThis.__sim, E = s.world.level.entrance; s.state.player.x = E.cx + 0.5; s.state.player.y = E.cy + 0.5; });
    await p.waitForTimeout(400);
    check('m3: left behind while Downed → Fallen, shown as FALLEN', (await S(() => globalThis.__sim.state.party[1].fallen)) === true && (await p.locator('#party .card.fallen').count()) === 1);
    // back to town (dev shortcut for the walk), the temple raises them
    await S(() => { const s = globalThis.__sim, snap = s.snapshot(); snap.scene = 'town'; s.restore(snap); const a = s.world.arrivals.temple; s.state.player.x = a.x; s.state.player.y = a.y; });
    await p.waitForTimeout(800);
    await p.locator('#hubBar button[data-k=temple]').tap(); await p.waitForTimeout(400);
    await p.locator('#hubSheet [data-go=raise]').tap(); await p.waitForTimeout(300);
    const g0 = await S(() => globalThis.__sim.state.counters.gold);
    await p.locator('#hubSheet [data-raise]').tap(); await p.waitForTimeout(400);
    const raised = await S(() => { const c = globalThis.__sim.state.party[1]; return !c.fallen && c.hp > 0; });
    check('m3: the temple raises the Fallen (free: hero level 5 or lower, once a day)', raised && (await S(() => globalThis.__sim.state.counters.gold)) === g0);
    await p.locator('#hubSheet .close').tap();
    // a wipe: everyone at 1 HP in a room → wake at the temple, Weakened, a quarter of the gold gone
    await S(() => globalThis.__sim.bus.on('defeat', (d) => (window.__lost = d.lost)));
    await room([1, 1]);
    await p.waitForFunction(() => globalThis.__sim.state.scene === 'town', null, { timeout: 60000 });
    const w = await S(() => { const s = globalThis.__sim, a = s.world.arrivals.temple, p = s.state.player; return { near: Math.hypot(p.x - a.x, p.y - a.y) < 1.5, weak: s.state.party.every((m) => m.weakUntil > 0), fallen: s.state.party.some((m) => m.fallen), gold: s.state.counters.gold, lost: window.__lost }; });
    check('m3: a wipe wakes the party at the temple, Weakened, a quarter of the gold gone', w.near && w.weak && !w.fallen && w.lost > 0 && w.lost === Math.floor((w.gold + w.lost) * 0.25), JSON.stringify(w));
    // the inn lifts Weakened
    await p.waitForTimeout(600);
    await p.locator('#hubBar button[data-k=inn]').tap(); await p.waitForTimeout(400);
    await p.locator('#hubSheet [data-go=rest]').tap(); await p.waitForTimeout(300); await p.locator('#hubSheet [data-rest]').tap(); await p.waitForTimeout(400);
    check('m3: resting at the inn lifts Weakened', (await S(() => globalThis.__sim.state.party.every((m) => !m.weakUntil))) === true);
    // it all saved
    await S(() => window.dispatchEvent(new Event('pagehide'))); await p.evaluate(() => (window.__old = 1)); await p.reload(); await ready();
    const r = await S(() => { const s = globalThis.__sim.state; return { name: s.party[0].name, actor: s.party[0].actor, n: s.party.length, created: s.created }; });
    check('m3: the hero and party survive a reload; the title offers Continue', r.created && r.name === 'Brannscript' && r.actor === 'hero_barbarian' && r.n === 2 && await p.locator('#title button.pri', { hasText: 'Continue' }).isVisible(), JSON.stringify(r));
    check('m3: no page errors', errs.length === 0, errs.join(' | '));
    await b.close();
  }
}
// 4. boot and intro: splash → loading → tap to begin → title → Begin → six cards → creation
{
  const b = await launch(chromium, 'chromium');
  if (b) {
    const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true }), p = await ctx.newPage();
    const errs = []; p.on('pageerror', (e) => errs.push(e.message));
    const game = `${base}/index.html?dev&slot=1`, C = (fn) => p.evaluate(fn);
    await p.goto(game); await C(() => { localStorage.clear(); indexedDB.deleteDatabase('emberfall'); });
    await p.goto(game);
    check('boot: the studio splash is up before any script', (await p.locator('#bootSplash, #cine .splash:not([hidden])').first().textContent()).includes('No Game Studios'));
    await p.waitForSelector('#cine .load:not([hidden])', { timeout: 60000 });
    const tip = await p.locator('#cine .tip').textContent();
    await p.waitForSelector('#cine .begin:not([hidden])', { timeout: 60000 });
    const t0 = await C(() => globalThis.__sim.state.tick);
    await p.waitForTimeout(600);
    check('boot: the loading screen shows a tip, and the sim waits', tip.length > 0 && (await C(() => globalThis.__sim.state.tick)) === t0, tip);
    await p.tap('#cine'); await p.waitForSelector('#titleWrap.on');
    check("boot: tap to begin → the title, Thornwick's music under it", (await C(() => globalThis.__ui.cinema.music)) === 'thornwick' && (await p.locator('#title .tag').textContent()).includes('Looks like it is up to you.'));
    await p.locator('#title button.pri', { hasText: 'Begin' }).tap();
    const seen = [];
    for (let k = 0; k < 6; k++) {
      await p.waitForFunction((k) => globalThis.__ui.cinema.card === k, k, { timeout: 10000 }); await p.waitForTimeout(500);
      seen.push([await p.locator('#cine .age').textContent(), await C(() => globalThis.__ui.cinema.music)]);
      await p.tap('#cine'); await p.waitForTimeout(300);                                // every line at once
      if (k === 5) seen.push(await p.locator('#cine .say span.last').textContent());
      await p.tap('#cine');                                                             // the next card
    }
    await p.waitForSelector('#createWrap.on', { timeout: 10000 });
    check('intro: six cards in order, the Fall\'s music unbroken through cards 3–5', JSON.stringify(seen.slice(0, 6)) === JSON.stringify([['The Kindling', 'kindling'], ['The Solmere Empire', 'empire'], ['The Fall', 'fall'], ['The Long Dim', 'fall'], ['Year 301 of the Dim', 'fall'], ['Thornwick', 'thornwick']]), JSON.stringify(seen));
    check('intro: it closes on "Looks like it is up to you." and hands over to creation', seen[6].trim() === 'Looks like it is up to you.' && (await C(() => globalThis.__ui.cinema.playing)) === false);
    await p.locator('#create .opt', { hasText: 'Rogue' }).first().tap(); await p.locator('#create .nav .pri').tap();
    await p.locator('#create .nav .pri').tap();                                                                       // the look
    await p.locator('#create .opt', { hasText: 'Thornwick' }).first().tap(); await p.locator('#create .nav .pri').tap();
    await p.fill('#create input', 'Wick'); await p.locator('#create .nav .pri').tap();
    await p.locator('#create .nav .pri', { hasText: 'Begin' }).tap(); await p.waitForTimeout(3000);
    check('intro: the music fades out into play', (await C(() => globalThis.__sim.state.created)) && (await C(() => globalThis.__ui.cinema.music)) === null);
    await p.tap('#menuBtn'); await p.locator('#title button', { hasText: 'The Chronicle' }).tap(); await p.waitForSelector('#cine .skip:not([hidden])');
    const replay = await C(() => globalThis.__ui.cinema.card);
    await p.tap('#cine .skip'); await p.waitForSelector('#titleWrap.on');
    check('the Chronicle replays the intro from the title, and Skip returns to it', replay === 0 && (await p.locator('#title button.pri', { hasText: 'Resume' }).count()) === 1);
    check('intro: no page errors', errs.length === 0, errs.join(' | '));
    await b.close();
  }
}
srv.close();
const ok = results.length > 0 && results.every(Boolean);
console.log(ok ? 'BROWSER_OK' : 'BROWSER_FAIL');
process.exit(ok ? 0 : 1);
