// run.mjs — `npm run test:browser`: browser tests over a local static server.
//   1. replay parity: the scripted session's end-state hash in Chromium and WebKit equals Node's
//      (the sim must be bit-identical on V8 and JavaScriptCore — AGENTS.md rule 1, dev plan §2.13)
//   2. game slots (Chromium): v3 save → slot 1, new game in slot 2 with its own seed,
//      persistence, switching back, deleting
//   3. M3 exit test (Chromium): create → play → a Fallen companion → temple → resurrect →
//      wipe → wake at the temple, Weakened → inn rest → reload keeps the hero
//   4. boot and intro (Chromium): splash → loading → tap to begin → title → Begin → the six
//      cards in order, with their music → creation; The Chronicle replays it from the title
//   5. every class in a fight (Chromium): a party of each class walks into a room; the fight
//      runs (the sim keeps ticking) with no page errors — a renderer table without the cleric
//      once threw at the first HP bar and froze the game
//   6. talk to Maudry (Chromium, manual clock): tap her across the square → the hero walks over →
//      the dialogue window → lines → choices → her flag set in the sim → Show me the board opens
//      the tavern's hiring board
//   7. Maudry's errand (Chromium, manual clock): "Anything I can do?" → accept → the toast, the
//      tracker line, the Journal card with its counters, Track / untrack, the compass's quest row
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
    // the defeat screen stands between the fight and the town: where, the last blow, the cost; OK to wake
    await p.waitForSelector('#defeat.on', { timeout: 5000 }).catch(() => null);
    const recap = await p.locator('#defeat').innerText().catch(() => '');
    check('m3: the defeat screen says where the party fell, who struck the last blow, and what it cost', /The party has fallen/.test(recap) && /floor 1 · a level \d+ room · wave \d+/i.test(recap) && /went down last, to (an? |one of )/.test(recap) && /Weakened for 10 minutes/.test(recap) && new RegExp(`−${w.lost} gold`).test(recap), recap.replace(/\n/g, ' · ').slice(0, 220));
    await p.locator('#defeat button').tap(); await p.waitForTimeout(700);
    check('m3: "Wake at the Shrine" closes it, and the town is there', !(await p.locator('#defeat.on').count()));
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
    check("boot: tap to begin → the title, Thornwick's music under it", (await C(() => globalThis.__ui.cinema.music)) === 'thornwick' && (await p.locator('#title .tag').textContent()).includes('The heroes of this age are not available… Looks like it is up to you.'));
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
// 5. every class in a fight: the room's battle overlay and effects draw for each class
{
  const b = await launch(chromium, 'chromium');
  if (b) {
    for (const cls of ['fighter', 'rogue', 'mage', 'cleric']) {
      const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true }), p = await ctx.newPage();
      const errs = []; p.on('pageerror', (e) => errs.push(e.message));
      await p.goto(`${base}/index.html?dev&notitle&scene=dungeon`); await p.waitForFunction(() => !!globalThis.__sim, null, { timeout: 60000 }); await p.waitForTimeout(1500);
      await p.evaluate(async (cls) => {                                   // (a preview scene: set the party up directly, dev only)
        const s = globalThis.__sim, { makeHero, makeMember } = await import('/src/sim/party.js');
        s.state.party[0] = makeHero({ cls, name: 'Test' }); s.state.party.push(makeMember('t1', 'Maren', cls === 'cleric' ? 'fighter' : 'cleric', 1));
        const r = s.destinations().find((o) => o.id === 'next-room'); s.commands.push({ type: 'goto', tx: r.tx, ty: r.ty, near: r.near, label: r.label, room: r.room });
      }, cls);
      const fought = await p.waitForFunction(() => !!globalThis.__sim.battle && globalThis.__sim.world.enemies.length > 0, null, { timeout: 60000 }).then(() => true, () => false);   // a frozen loop never gets here
      const t0 = await p.evaluate(() => globalThis.__sim.state.tick); await p.waitForTimeout(3000); const t1 = fought ? await p.evaluate(() => globalThis.__sim.state.tick) : t0;
      check(`fight: a ${cls} and a ${cls === 'cleric' ? 'fighter' : 'cleric'} fight a room, the game keeps running`, t1 - t0 > 40 && errs.length === 0, `${t1 - t0} ticks in 3 s${errs.length ? ' · ' + [...new Set(errs)].join(' | ') : ''}`);
      await ctx.close();
    }
    await b.close();
  }
}
// 6. talk to Maudry: tap → walk over → dialogue → choices → flag → the hiring board
{
  const b = await launch(chromium, 'chromium');
  if (b) {
    const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true }), p = await ctx.newPage();
    const errs = []; p.on('pageerror', (e) => errs.push(e.message));
    // the manual clock: a busy software-GL frame can outlast a tap's 220 ms window
    await p.goto(`${base}/index.html?dev&manual&notitle&scene=town`); await p.waitForFunction(() => !!globalThis.__sim && !!globalThis.__frame, null, { timeout: 60000 });
    const run = (n) => p.evaluate((n) => { for (let i = 0; i < n; i++) globalThis.__frame(1000 / 30); }, n);
    let at = null;
    for (let k = 0; k < 20 && !at; k++) {                                 // until her atlas and the cast have loaded and she's drawn
      await p.waitForTimeout(300); await run(3);
      at = await p.evaluate(() => { for (let y = 120; y < 800; y += 4) for (let x = 8; x < 390; x += 4) if (globalThis.__renderer.npcAt(x, y)?.id === 'maudry_fenn' && document.elementFromPoint(x, y)?.id === 'game') return { x, y }; return null; });   // (on her, not on another of the town's people, and not under a button)
    }
    check('talk: Maudry stands in Thornwick', !!at, at ? `at ${at.x},${at.y}` : 'not found on screen');
    if (at) {
      await p.touchscreen.tap(at.x, at.y); await run(150);
      const open = await p.waitForSelector('#talkWrap.on #talk .line', { timeout: 10000 }).then(() => true, () => false);
      const first = open ? await p.textContent('#talk .line') : '';
      check('talk: tap her → the hero walks over → the dialogue window', open && /Mule/.test(first), first.slice(0, 60));
      // (meeting her is an effect: a command that lands on the next tick, and the talk waits for it before going on)
      for (let i = 0; i < 12 && !(await p.locator('#talk .ch').count()); i++) { await run(2); if (await p.locator('#talk .more').count()) await p.locator('#talk .more').tap(); }
      const choices = await p.locator('#talk .ch').allTextContents(), flags = await p.evaluate(() => globalThis.__sim.state.flags);
      const quest = await p.locator('#talk .ch.quest').allTextContents();       // her errand's choice is marked: a diamond, a QUEST label, its own colour
      check('talk: her lines, then choices, the quest ones marked (her errand, Act I); meeting her set met_maudry (a command the sim checked)', choices.length === 7 && quest.length === 2 && quest.some((q) => /^Anything I can do\?\s*Quest$/.test(q)) && quest.some((q) => /^You said something about smoke\?\s*Quest$/.test(q)) && flags.met_maudry === 1, `${choices.length} choices · quest ${JSON.stringify(quest)} · flags ${JSON.stringify(flags)}`);
      await p.locator('#talk .ch', { hasText: 'hire' }).tap();
      for (let i = 0; i < 6 && (await p.locator('#talk .more').count()) && !(await p.locator('#talk .ch').count()); i++) await p.locator('#talk .more').tap();
      await p.locator('#talk .ch', { hasText: 'board' }).tap(); await p.locator('#talk .more').tap(); await run(5);
      const board = await p.evaluate(() => [...document.querySelectorAll('.on h2, .on h3')].map((e) => e.textContent).join(' | '));
      check('talk: "Show me the board" closes the talk and opens the Tired Mule', !(await p.locator('#talkWrap.on').count()) && /Tired Mule/.test(board) && errs.length === 0, board + (errs.length ? ' · ' + errs.join(' | ') : ''));
    }
    await ctx.close(); await b.close();
  }
}
// 7. Maudry's errand: accept in conversation → tracker, Journal, compass
{
  const b = await launch(chromium, 'chromium');
  if (b) {
    const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true }), p = await ctx.newPage();
    const errs = []; p.on('pageerror', (e) => errs.push(e.message));
    await p.goto(`${base}/index.html?dev&manual&notitle&scene=town`); await p.waitForFunction(() => !!globalThis.__sim && !!globalThis.__frame, null, { timeout: 60000 });
    const run = (n) => p.evaluate((n) => { for (let i = 0; i < n; i++) globalThis.__frame(1000 / 30); }, n);
    await p.waitForTimeout(800); await run(5);
    await p.evaluate(() => { const s = globalThis.__sim, n = s.world.npcs[0], q = s.state.player; q.x = q.px = n.x - 1; q.y = q.py = n.y + 1; s.commands.push({ type: 'talk', npc: n.id }); });
    await run(3);
    const talking = await p.waitForSelector('#talkWrap.on', { timeout: 10000 }).then(() => true, () => false);
    const more = async () => { for (let i = 0; i < 12 && !(await p.locator('#talk .ch').count()); i++) { await run(2); if (await p.locator('#talk .more').count()) await p.locator('#talk .more').tap(); } };   // (a line with effects waits a tick for the sim)
    await more(); await p.locator('#talk .ch', { hasText: 'Anything I can do' }).tap(); await more();
    await p.locator('#talk .ch', { hasText: "I'll see to it" }).tap(); await run(3); await more();
    const st = await p.evaluate(() => ({ q: globalThis.__sim.state.quests.vale_long_way_round, tracked: globalThis.__sim.state.tracked }));
    check('quest: "Anything I can do?" → accepted in conversation, and tracked', talking && st.q && st.q.st === 1 && st.tracked === 'vale_long_way_round', JSON.stringify(st));
    // the topics the talk comes back to read the quest as the sim now has it (it had offered it again until you walked off)
    const after = await p.locator('#talk .ch').allTextContents();
    check('quest: back at her topics, the offer is gone and she asks after it', after.length > 0 && !after.some((t) => /Anything I can do/.test(t)) && after.some((t) => /Quest$/.test(t)), JSON.stringify(after));
    if (await p.locator('#talk .x').count()) await p.locator('#talk .x').tap();
    await run(3);
    const tracker = await p.locator('#questTrack.on').innerText().catch(() => '');
    check('quest: the tracker line names it, with its counts', /The Long Way Round/.test(tracker) && /Waves 0\/4/.test(tracker), tracker.replace(/\n/g, ' · '));
    await p.locator('#journalBtn').tap();
    const card = await p.locator('#journal .q').first().innerText().catch(() => '');
    check('quest: the Journal shows it (step text, both objectives, the reward)', /Win four fights/.test(card) && /0\/4/.test(card) && /0\/1/.test(card) && /150 XP/.test(card), card.split('\n').slice(0, 3).join(' · '));
    await p.locator('#journal .acts button', { hasText: 'Tracked' }).tap(); await run(2);
    const untracked = await p.evaluate(() => globalThis.__sim.state.tracked);
    await p.locator('#journal .acts button', { hasText: 'Track' }).first().tap(); await run(2);
    check('quest: Track / untrack are commands the sim takes', untracked === null && (await p.evaluate(() => globalThis.__sim.state.tracked)) === 'vale_long_way_round');
    await p.locator('#journal .x').tap(); await p.locator('#compassBtn').tap();
    const rows = await p.locator('#compassMenu .opt b').allTextContents();
    check('quest: the compass leads with it, and no page errors', rows[0] === 'The Long Way Round' && errs.length === 0, rows.join(' | ') + (errs.length ? ' · ' + errs.join(' | ') : ''));
    // pick it: the walk leaves town and carries on across the Vale without another tap (a journey, sim/core.js)
    await p.locator('#compassMenu .opt').first().tap();
    const walked = await p.evaluate(() => { const s = globalThis.__sim; for (let i = 0; i < 1500 && s.world.kind === 'town'; i++) globalThis.__frame(100); for (let i = 0; i < 20; i++) globalThis.__frame(100); return { kind: s.world.kind, path: !!s.state.player.path, journey: s.state.player.journey && s.state.player.journey.kind }; });
    await run(2);
    const chip = await p.locator('#walkChip.on').innerText().catch(() => '');
    check('journey: the quest\'s row walks out of town and on across the Vale, the chip still naming it', walked.kind === 'overland' && walked.path && walked.journey === 'quest' && /The Long Way Round/.test(chip), JSON.stringify(walked) + ' · ' + chip);
    await ctx.close(); await b.close();
  }
}
// 7b. Act I, chapter 1 (M5): Maudry's smoke → the compass leads to the Tithe Mill → four waves there →
// handed in to Osric → Wickham Keep is on the map. (The fight runs on the sim's own tick: the chapter is
// the test, not the frames.)
{
  const b = await launch(chromium, 'chromium');
  if (b) {
    const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true }), p = await ctx.newPage();
    const errs = []; p.on('pageerror', (e) => errs.push(e.message));
    await p.goto(`${base}/index.html?dev&manual&notitle&scene=town`); await p.waitForFunction(() => !!globalThis.__sim && !!globalThis.__frame, null, { timeout: 60000 });
    const run = (n) => p.evaluate((n) => { for (let i = 0; i < n; i++) globalThis.__frame(1000 / 30); }, n);
    const more = async () => { for (let i = 0; i < 12 && !(await p.locator('#talk .ch').count()); i++) { await run(2); if (await p.locator('#talk .more').count()) await p.locator('#talk .more').tap(); } };
    const talkTo = async (id) => { await p.evaluate((id) => { const s = globalThis.__sim, n = s.world.npcs.find((q) => q.id === id), q = s.state.player; s.commands.push({ type: 'endTalk' }); q.x = q.px = n.x - 1; q.y = q.py = n.y + 1; s.commands.push({ type: 'talk', npc: id }); }, id); await run(3); await p.waitForSelector('#talkWrap.on', { timeout: 10000 }).catch(() => null); await more(); };
    await p.waitForTimeout(800); await run(5);
    await talkTo('maudry_fenn');
    await p.locator('#talk .ch', { hasText: 'You said something about smoke' }).tap(); await more();
    await p.locator('#talk .ch', { hasText: "I'll shift them" }).tap(); await run(3); await more();
    if (await p.locator('#talk .x').count()) await p.locator('#talk .x').tap();
    await run(3);
    const st = await p.evaluate(() => ({ q: globalThis.__sim.state.quests.ch1_smoke_over_the_vale, tracked: globalThis.__sim.state.tracked }));
    const tracker = await p.locator('#questTrack.on').innerText().catch(() => '');
    check('act I: Maudry gives Smoke over the Vale in conversation; the tracker names it', st.q && st.q.st === 1 && st.tracked === 'ch1_smoke_over_the_vale' && /Smoke over the Vale/.test(tracker), tracker.replace(/\n/g, ' · '));
    const row = await p.evaluate(() => { const s = globalThis.__sim; s.restore({ ...JSON.parse(JSON.stringify(s.snapshot())), scene: 'overland', depth: 0 }); const r = s.destinations()[0]; return { id: r.id, site: r.id === 'quest' ? r.journey : null }; });
    const site = await p.evaluate(() => { const s = globalThis.__sim, r = s.destinations()[0]; return s.destinations().find((q) => q.id === 'site:tithe_mill' && q.tx === r.tx && q.ty === r.ty) ? 'tithe_mill' : ''; });
    check('act I: on the Vale, the compass leads with it, to the Tithe Mill', row.id === 'quest' && site === 'tithe_mill', JSON.stringify({ ...row, site }));
    // the mill: a strong company holds a room four waves (sim ticks, not frames)
    const held = await p.evaluate(() => {
      const s = globalThis.__sim; s.restore({ ...JSON.parse(JSON.stringify(s.snapshot())), scene: 'dungeon', site: 'tithe_mill', depth: 0 });
      for (const m of s.state.party) { m.level = 12; m.hp = 9999; }
      const L = s.world.level, r = L.rooms.find((q) => q !== L.entrance), pl = s.state.player; let best = null, bd = 1e9;
      for (const [k, c] of L.cells) { if (c.room !== r.id || c.kind !== 'floor') continue; const [x, y] = k.split(',').map(Number), d = Math.hypot(x - r.cx, y - r.cy); if (d < bd) { bd = d; best = [x, y]; } }
      pl.x = pl.px = best[0] + 0.5; pl.y = pl.py = best[1] + 0.5;
      for (let i = 0; i < 20 * 400 && s.state.quests.ch1_smoke_over_the_vale.st !== 2; i++) { for (const m of s.state.party) m.hp = Math.max(m.hp, 400); s.tick(); }
      return s.state.quests.ch1_smoke_over_the_vale;
    });
    await run(5);
    check('act I: four waves held in the Tithe Mill: ready', held.st === 2, JSON.stringify(held));
    await p.evaluate(() => { const s = globalThis.__sim; s.restore({ ...JSON.parse(JSON.stringify(s.snapshot())), scene: 'town', depth: 0, player: { x: 0, y: 0 } }); });
    await p.waitForTimeout(300); await run(5);
    await talkTo('osric_hale');
    await p.locator('#talk .ch', { hasText: 'The Redhand are out of the mill' }).tap(); await run(3); await more();
    await run(10);
    const done = await p.evaluate(() => ({ st: globalThis.__sim.state.quests.ch1_smoke_over_the_vale.st, keep: globalThis.__sim.state.revealed.has('wickham_keep') }));
    const offers = await p.locator('#talk .ch').allTextContents();
    check('act I: handed in to Osric; Wickham Keep is revealed, and he offers the next chapter; no page errors', done.st === 3 && done.keep && offers.some((t) => /Where did the Redhand go/.test(t)) && errs.length === 0, JSON.stringify(done) + ' · ' + JSON.stringify(offers) + (errs.length ? ' · ' + errs.join(' | ') : ''));
    await ctx.close(); await b.close();
  }
}
// 8. The Lantern Guild's board: Tavern → Quest board → take a job → the Journal; hand it in when done
{
  const b = await launch(chromium, 'chromium');
  if (b) {
    const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true }), p = await ctx.newPage();
    const errs = []; p.on('pageerror', (e) => errs.push(e.message));
    await p.goto(`${base}/index.html?dev&manual&notitle&scene=town`); await p.waitForFunction(() => !!globalThis.__sim && !!globalThis.__frame, null, { timeout: 60000 });
    const run = (n) => p.evaluate((n) => { for (let i = 0; i < n; i++) globalThis.__frame(1000 / 30); }, n);
    await p.waitForTimeout(800); await run(5);
    await p.locator('#hubBar button[data-k="tavern"]').tap(); await p.locator('#hubSheet [data-go="board"]').tap();
    await p.waitForSelector('#hubSheet .job', { timeout: 10000 }).catch(() => null);
    const jobs = await p.locator('#hubSheet .job').count(), first = await p.locator('#hubSheet .job').first().innerText().catch(() => '');
    check('board: the Tavern\'s quest board shows today\'s jobs (title, poster, hook, what it asks, skulls with a word, pay)', jobs === 3 && /Posted · /.test(first) && /Easy|Fair|Hard/.test(first) && /Pays \d+ XP · \d+ gold/.test(first), `${jobs} jobs · ${first.split('\n').slice(0, 2).join(' · ')}`);
    await p.locator('#hubSheet [data-take]').first().tap(); await run(2);
    const st = await p.evaluate(() => ({ q: globalThis.__sim.state.quests, tracked: globalThis.__sim.state.tracked }));
    const id = Object.keys(st.q)[0];
    check('board: "Take the job" is a command the sim takes; the job is tracked', !!id && /^board_0_1_0$/.test(id) && st.tracked === id && (await p.locator('#hubSheet .job.taken').count()) === 1, JSON.stringify(st));
    await p.locator('#hubSheet .close').tap(); await run(2);
    await p.locator('#journalBtn').tap();
    const card = await p.locator('#journal .q').first().innerText().catch(() => '');
    check('board: the Journal shows the job (Board, its poster and skulls, the objective)', /BOARD|Board/.test(card) && /Easy|Fair|Hard/.test(card) && /0\/\d/.test(card), card.split('\n').slice(0, 3).join(' · '));
    await p.locator('#journal .x').tap();
    await p.evaluate((id) => { globalThis.__sim.state.quests[id].st = 2; }, id);     // (done: the sim tests walk it for real)
    await p.locator('#hubBar button[data-k="tavern"]').tap(); await p.locator('#hubSheet [data-go="board"]').tap();
    const gold = await p.evaluate(() => globalThis.__sim.state.counters.gold);
    await p.locator('#hubSheet [data-handin]').first().tap(); await run(2);
    const after = await p.evaluate((id) => ({ st: globalThis.__sim.state.quests[id].st, gold: globalThis.__sim.state.counters.gold }), id);
    check('board: "Hand in" pays once, and no page errors', after.st === 3 && after.gold > gold && errs.length === 0, JSON.stringify(after) + (errs.length ? ' · ' + errs.join(' | ') : ''));
    await ctx.close(); await b.close();
  }
}
// 9. The way out of a fight: the room pill shows the tide, "Step out" pulses when low, a tap walks out
{
  const b = await launch(chromium, 'chromium');
  if (b) {
    const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true }), p = await ctx.newPage();
    const errs = []; p.on('pageerror', (e) => errs.push(e.message));
    await p.goto(`${base}/index.html?dev&manual&notitle&scene=dungeon`); await p.waitForFunction(() => !!globalThis.__sim && !!globalThis.__frame, null, { timeout: 60000 });
    const run = (n) => p.evaluate((n) => { for (let i = 0; i < n; i++) globalThis.__frame(1000 / 30); }, n);
    await p.waitForTimeout(800); await run(5);
    await p.evaluate(() => { const s = globalThis.__sim, L = s.world.level, r = L.rooms.find((q) => s.world.roomLevels.get(q.id) === 1), pl = s.state.player; pl.x = pl.px = r.cx + 0.5; pl.y = pl.py = r.cy + 0.5; });
    await run(90);
    await p.waitForSelector('#stepOut.on', { timeout: 5000 }).catch(() => null);
    const inFight = await p.evaluate(() => !!globalThis.__sim.battle);
    const shown = await p.locator('#stepOut.on').count();
    await p.evaluate(() => { const h = globalThis.__sim.state.party[0]; h.hp = Math.max(1, h.hp * 0.3); });
    await run(3);
    await p.waitForSelector('#stepOut.on.low', { timeout: 5000 }).catch(() => null);   // (the button follows on animation frames: slow in headless)
    const low = await p.locator('#stepOut.on.low').count(), label = await p.locator('#stepOut').innerText().catch(() => '');
    check('step out: in a fight the button shows, and pulses with a word when the party is low', inFight && shown === 1 && low === 1 && /Step out/.test(label) && /low/.test(label), label.replace(/\n/g, ' · '));
    await p.locator('#stepOut').tap();
    for (let i = 0; i < 20 && (await p.evaluate(() => !!globalThis.__sim.battle)); i++) await run(15);
    const after = await p.evaluate(() => ({ battle: !!globalThis.__sim.battle, room: (() => { const s = globalThis.__sim, pl = s.state.player, c = s.world.level.cells.get(Math.floor(pl.x) + ',' + Math.floor(pl.y)); return c ? c.room : null; })() }));
    await p.waitForSelector('#stepOut.on', { state: 'hidden', timeout: 5000 }).catch(() => null);
    check('step out: a tap walks the hero out; the fight ends; no page errors', !after.battle && after.room < 0 && (await p.locator('#stepOut.on').count()) === 0 && errs.length === 0, JSON.stringify(after) + (errs.length ? ' · ' + errs.join(' | ') : ''));
    await ctx.close(); await b.close();
  }
}
// 10. The Chronicle: open the chest that holds Standing Order 14 → it's in the Journal's Chronicle tab
{
  const b = await launch(chromium, 'chromium');
  if (b) {
    const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true }), p = await ctx.newPage();
    const errs = []; p.on('pageerror', (e) => errs.push(e.message));
    await p.goto(`${base}/index.html?dev&manual&notitle&scene=dungeon`); await p.waitForFunction(() => !!globalThis.__sim && !!globalThis.__frame, null, { timeout: 60000 });
    const run = (n) => p.evaluate((n) => { for (let i = 0; i < n; i++) globalThis.__frame(1000 / 30); }, n);
    await p.waitForTimeout(800); await run(5);
    await p.evaluate(() => { const s = globalThis.__sim, h = s.lore.holder('frag_vale_standing_order'), [x, y] = h.key.split(',').map(Number), pl = s.state.player; pl.x = pl.px = x + 1.5; pl.y = pl.py = y + 0.5; s.commands.push({ type: 'harvest', tx: x, ty: y }); });
    await run(5);
    const frags = await p.evaluate(() => globalThis.__sim.state.fragments);
    await p.locator('#journalBtn').tap(); await p.locator('#journal .tabs button', { hasText: 'Chronicle' }).tap();
    const text = await p.locator('#journal .frag').first().innerText().catch(() => ''), missing = await p.locator('#journal .frag.missing').count();
    check('chronicle: its chest gives Standing Order 14, and the Chronicle shows it (and the nine still missing), no page errors', frags.length === 1 && /Standing Order 14/.test(text) && /Third Legion/.test(text) && missing === 9 && errs.length === 0, text.split('\n')[0] + (errs.length ? ' · ' + errs.join(' | ') : ''));
    await ctx.close(); await b.close();
  }
}
srv.close();
const ok = results.length > 0 && results.every(Boolean);
console.log(ok ? 'BROWSER_OK' : 'BROWSER_FAIL');
process.exit(ok ? 0 : 1);
