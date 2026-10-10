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
//   6. talk to Maudry (Chromium, manual clock): tap her across the square → the hero walks over (and turns to her) →
//      the dialogue window → lines → choices → her flag set in the sim → Show me who's looking opens
//      the tavern's hiring board
//   7. Maudry's errand (Chromium, manual clock): "Anything I can do?" → accept → the toast, the
//      tracker line, the Journal card with its counters, Track / untrack, the compass's quest row
// Local runs skip an engine that isn't installed; CI (CI=true) requires both.
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { existsSync, readFileSync } from 'node:fs';
import { join, extname, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium, webkit } from 'playwright';
import { scriptedSession } from '../fixtures/session.mjs';
import { PLACES } from '../../src/ui/wallmap.js';

const ROOT = fileURLToPath(new URL('../..', import.meta.url));
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.css': 'text/css' };
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
    // (the Lantern Guild's sellswords, GDD §6.2: each card shows its rank word, perks and fee; hiring pays it)
    await S(() => { globalThis.__sim.state.counters.gold = 2000; });
    await p.locator('#hubBar button[data-k=tavern]').tap(); await p.waitForTimeout(400);
    await p.locator('#hubSheet [data-go=hire]').tap(); await p.waitForTimeout(300);
    const card = await p.locator('#hubSheet .merc.sw').filter({ has: p.locator('[data-hire="1"]') }).innerText();
    const want = await S(() => { const c = globalThis.__sim.heroes.roster()[1]; return { rank: c.rank, n: c.perks.length, fee: c.rank === 'wick' ? 30 * c.level : c.rank === 'lamp' ? 90 * c.level : c.rank === 'lantern' ? 250 * c.level : 600 * c.level }; });
    await p.locator('#hubSheet [data-hire="1"]').tap(); await p.waitForTimeout(300); await p.locator('#hubSheet .close').tap();
    const paid = 2000 - (await S(() => globalThis.__sim.state.counters.gold));
    check('m3: hired a companion at the tavern: its card showed rank, perks and fee, and the Guild took the fee', (await S(() => globalThis.__sim.state.party.length)) === 2
      && new RegExp(want.rank, 'i').test(card) && new RegExp(`Fee ${want.fee} gold`).test(card) && paid === want.fee, `${want.rank} · fee ${want.fee} · paid ${paid}`);
    // wages on screen (GDD §6.2): the line under the gold, the card's tag, the Contract tab, and the Guild's terms
    await p.waitForTimeout(1200);
    const wageLine = await p.locator('#hudWage').innerText().catch(() => ''), tag = await p.locator('#party .card[data-idx="1"] .wg').innerText().catch(() => '');
    await p.locator('#hubBar button[data-k=tavern]').tap(); await p.waitForTimeout(300); await p.locator('#hubSheet [data-go=hire]').tap(); await p.waitForTimeout(300);
    await p.locator('#hubSheet [data-terms]').tap(); await p.waitForTimeout(300);
    const terms = await p.locator('#gterms.on').innerText().catch(() => ''), rows = await p.locator('#gterms tr').count();
    await p.locator('#gterms .x').tap(); await p.locator('#hubSheet .close').tap(); await p.waitForTimeout(200);
    await p.locator('#party .card[data-idx="1"]').tap(); await p.waitForTimeout(400);
    await p.locator('#gearSheet [data-view=contract]').tap(); await p.waitForTimeout(300);
    const contract = await p.locator('#gearSheet .ct').innerText().catch(() => '');
    // the ✕ is a thumb's size and clear of the member tabs (the owner, 2026-10-04: it overlapped the last tab by 3 px)
    const xb = await p.evaluate(() => { const x = document.querySelector('#gearSheet .x').getBoundingClientRect(), t = document.querySelector('#gearSheet .tabs').getBoundingClientRect(); return { w: x.width, h: x.height, gap: t.top - x.bottom }; });
    check('character window: the close button is 44 px and clear of the member tabs', xb.w >= 44 && xb.h >= 44 && xb.gap >= 0, JSON.stringify(xb));
    await p.locator('#gearSheet [data-close]').tap(); await p.waitForTimeout(300);
    check('m3: wages on screen: the gold line, the card tag, the Contract tab, the Guild\'s terms', /−\d+ · dawn \d+m/.test(wageLine) && /◆ \d+\/D/i.test(tag)
      && /The Guild.s terms/i.test(terms) && rows === 5 && /Loyalty/i.test(contract) && /gold a dawn/i.test(contract), `${wageLine} | ${tag} | rows ${rows} | ${contract.split('\n').slice(0, 3).join(' / ')}`);
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
    check('m3: left behind while Downed → slain, shown as SLAIN', (await S(() => globalThis.__sim.state.party[1].fallen)) === true && (await p.locator('#party .card.fallen').count()) === 1 && /SLAIN/.test(await p.locator('#party .card.fallen').innerText()));
    // back to town (dev shortcut for the walk), the temple raises them
    await S(() => { const s = globalThis.__sim, snap = s.snapshot(); snap.scene = 'town'; s.restore(snap); const a = s.world.arrivals.temple; s.state.player.x = a.x; s.state.player.y = a.y; });
    await p.waitForTimeout(800);
    await p.locator('#hubBar button[data-k=temple]').tap(); await p.waitForTimeout(400);
    await p.locator('#hubSheet [data-go=raise]').tap(); await p.waitForTimeout(300);
    const g0 = await S(() => globalThis.__sim.state.counters.gold);
    await p.locator('#hubSheet [data-raise]').tap(); await p.waitForTimeout(400);
    const raised = await S(() => { const c = globalThis.__sim.state.party[1]; return !c.fallen && c.hp > 0; });
    check('m3: the temple raises the slain (free: hero level 5 or lower, once a day)', raised && (await S(() => globalThis.__sim.state.counters.gold)) === g0);
    await p.locator('#hubSheet .close').tap();
    // a wipe: everyone at 1 HP in a room → wake at the temple, Weakened, a quarter of the gold gone
    await S(() => globalThis.__sim.bus.on('defeat', (d) => (window.__lost = d.lost)));
    await room([1, 1]);
    // (held at 1 HP while we wait: on a slow real-time clock the lull's regen could outlast the timeout)
    await p.waitForFunction(() => { const s = globalThis.__sim; if (s.state.scene === 'town') return true; for (const m of s.state.party) if (!m.down) m.hp = Math.min(m.hp, 1); return false; }, null, { timeout: 60000, polling: 50 });
    const w = await S(() => { const s = globalThis.__sim, a = s.world.arrivals.temple, p = s.state.player; return { near: Math.hypot(p.x - a.x, p.y - a.y) < 1.5, weak: s.state.party.every((m) => m.weakUntil > 0), fallen: s.state.party.some((m) => m.fallen), gold: s.state.counters.gold, lost: window.__lost }; });
    check('m3: a wipe wakes the party at the temple, Weakened, a quarter of the gold gone', w.near && w.weak && !w.fallen && w.lost > 0 && w.lost === Math.floor((w.gold + w.lost) * 0.25), JSON.stringify(w));
    // the defeat screen stands between the fight and the town: where, the last blow, the cost; OK to wake
    await p.waitForSelector('#defeat.on', { timeout: 5000 }).catch(() => null);
    const recap = await p.locator('#defeat').innerText().catch(() => '');
    check('m3: the defeat screen says where the party fell, who struck the last blow, and what it cost', /The party is beaten/.test(recap) && /floor 1 · a level \d+ room · wave \d+/i.test(recap) && /went down last, to (an? |one of )/.test(recap) && /Weakened for 10 minutes/.test(recap) && new RegExp(`−${w.lost} gold`).test(recap), recap.replace(/\n/g, ' · ').slice(0, 220));
    await p.locator('#defeat button').tap(); await p.waitForTimeout(700);
    check('m3: "Wake at the temple" closes it, and the town is there', !(await p.locator('#defeat.on').count()));
    await p.waitForTimeout(1100);
    const chip = await p.locator('#hudLine3 .chip', { hasText: 'weakened' }).innerText().catch(() => '');
    check('m3: the HUD says Weakened, with the minutes it has left', /^weakened · (10|9) min$/.test(chip.trim()), chip);
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
      check('talk: her lines, then choices, the quest ones marked (her errand, Act I); meeting her set met_maudry (a command the sim checked)', choices.length === 8 && quest.length === 2 && choices.some((c) => /How does the Guild hire/.test(c)) && quest.some((q) => /^Anything I can do\?\s*New$/.test(q)) && quest.some((q) => /^You said something about smoke\?\s*New$/.test(q)) && flags.met_maudry === 1, `${choices.length} choices · quest ${JSON.stringify(quest)} · flags ${JSON.stringify(flags)}`);
      // (art pass 6) in a conversation the hero turns to face her: the drawn octant is the one toward her
      const face = await p.evaluate(() => {
        globalThis.__trace = []; for (let i = 0; i < 20; i++) globalThis.__frame(1000 / 30);
        const t = globalThis.__trace.at(-1), s = globalThis.__sim, h = s.state.player, n = s.world.npcs.find((q) => q.id === 'maudry_fenn'); globalThis.__trace = null;
        const hx = n.x - h.x, hy = n.y - h.y, a = Math.atan2(hx + hy, hx - hy) / (Math.PI / 4), dir = t.party[0][3];
        let d = a - dir; d -= 8 * Math.round(d / 8); return { dir, want: +a.toFixed(2), off: +Math.abs(d).toFixed(2) };
      });
      check('talk: the hero turns to face her while they talk', face.off <= 0.62, JSON.stringify(face));
      // …and when the talk starts with no walk (he's already beside her, facing away), he still turns to her
      await p.locator('#talk .x, #talk .close').first().tap().catch(() => null);
      await p.evaluate(() => { const s = globalThis.__sim; s.commands.push({ type: 'endTalk' }); s.tick(); });
      const turn = await p.evaluate(() => {
        const s = globalThis.__sim, h = s.state.player, n = s.world.npcs.find((q) => q.id === 'maudry_fenn');
        h.x = h.px = n.x + 1.0; h.y = h.py = n.y + 0.4;                                    // beside her (a walk away from her first, so he faces off)
        for (let i = 0; i < 12; i++) { s.commands.push({ type: 'move', x: 1, y: 1 }); globalThis.__frame(1000 / 30); }
        for (let i = 0; i < 20; i++) globalThis.__frame(1000 / 30);
        h.x = h.px = n.x + 1.0; h.y = h.py = n.y + 0.4;
        globalThis.__trace = []; globalThis.__frame(1000 / 30); const before = globalThis.__trace.at(-1).party[0][3];
        s.commands.push({ type: 'talk', npc: 'maudry_fenn' });
        for (let i = 0; i < 30; i++) globalThis.__frame(1000 / 30);
        const t = globalThis.__trace.at(-1); globalThis.__trace = null;
        const hx = n.x - h.x, hy = n.y - h.y, a = Math.atan2(hx + hy, hx - hy) / (Math.PI / 4);
        let d = a - t.party[0][3]; d -= 8 * Math.round(d / 8);
        return { before, dir: t.party[0][3], want: +a.toFixed(2), off: +Math.abs(d).toFixed(2), talking: s.talk ? s.talk.talking : '?' };
      });
      check('talk: already beside her and facing away, the hero turns to her as the talk opens', turn.before !== turn.dir && turn.off <= 0.62, JSON.stringify(turn));
      await p.waitForSelector('#talkWrap.on #talk .line', { timeout: 10000 }).catch(() => null);
      for (let i = 0; i < 12 && !(await p.locator('#talk .ch').count()); i++) { await run(2); if (await p.locator('#talk .more').count()) await p.locator('#talk .more').tap(); }
      await p.locator('#talk .ch', { hasText: 'Anyone for hire' }).tap();
      for (let i = 0; i < 6 && (await p.locator('#talk .more').count()) && !(await p.locator('#talk .ch').count()); i++) await p.locator('#talk .more').tap();
      await p.locator('#talk .ch', { hasText: "Show me who's looking" }).tap(); await p.locator('#talk .more').tap(); await run(5);
      const board = await p.evaluate(() => [...document.querySelectorAll('.on h2, .on h3')].map((e) => e.textContent).join(' | '));
      check('talk: "Show me who\'s looking" closes the talk and opens the Tired Mule', !(await p.locator('#talkWrap.on').count()) && /Tired Mule/.test(board) && errs.length === 0, board + (errs.length ? ' · ' + errs.join(' | ') : ''));
    }
    await ctx.close(); await b.close();
  }
}

// 6b. Act II in Saltmere (M8; world doc v1.29 §6): Ilse's letter in hand (Fog on the Canal, its first step), Dace Pike stands
// on the Drowned Eel's boards; tap him, his window opens under his name and the Eel's, the Ink reads the meeting still to
// have, and having it moves the chapter on to the Toadking (a word counts: quests.js `meet`)
{
  const b = await launch(chromium, 'chromium');
  if (b) {
    const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true }), p = await ctx.newPage();
    const errs = []; p.on('pageerror', (e) => errs.push(e.message));
    await p.goto(`${base}/index.html?dev&manual&notitle&scene=town&region=fens`); await p.waitForFunction(() => !!globalThis.__sim && !!globalThis.__frame, null, { timeout: 60000 });
    await p.evaluate(() => { const S = globalThis.__sim.state; for (const id of ['ch1_smoke_over_the_vale', 'ch1_the_diggers', 'ch1_ember_in_the_fist']) S.quests[id] = { st: 3, step: 0, n: [] }; S.party[0].level = 9; S.quests.ch2_fog_on_the_canal = { st: 1, step: 0, n: [0] }; S.tracked = 'ch2_fog_on_the_canal'; });
    const run = (n) => p.evaluate((n) => { for (let i = 0; i < n; i++) globalThis.__frame(1000 / 30); }, n);
    let at = null;
    for (let k = 0; k < 20 && !at; k++) {
      await p.waitForTimeout(300); await run(3);
      at = await p.evaluate(() => { for (let y = 120; y < 800; y += 4) for (let x = 8; x < 390; x += 4) if (globalThis.__renderer.npcAt(x, y)?.id === 'dace_pike' && document.elementFromPoint(x, y)?.id === 'game') return { x, y }; return null; });
    }
    check('act II: Dace Pike stands in Saltmere', !!at, at ? `at ${at.x},${at.y}` : 'not found on screen');
    if (at) {
      await p.touchscreen.tap(at.x, at.y); await run(150);
      const open = await p.waitForSelector('#talkWrap.on #talk .line', { timeout: 10000 }).then(() => true, () => false);
      const who = open ? await p.textContent('#talk .who .nm') : '', first = open ? await p.textContent('#talk .line') : '';
      await p.waitForTimeout(600);
      const face = await p.evaluate(() => { const c = document.querySelector('#talk .who canvas'); if (!c) return 0; const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 3; i < d.length; i += 4) if (d[i] > 0) n++; return n; });   // (drawn pixels: his portrait loaded)
      const q = await p.evaluate(() => globalThis.__sim.state.quests.ch2_fog_on_the_canal);
      check('act II: tap him → his window, under his name and the Drowned Eel\'s, his portrait drawn, his first words; the meeting counts (on to the Toadking)',
        open && /Dace Pike/.test(who) && /Drowned Eel/.test(who) && face > 0 && /Eel's counter/.test(first) && q.step === 1 && errs.length === 0,
        JSON.stringify({ who, first: first.slice(0, 60), face, q }) + (errs.length ? ' · ' + errs.join(' | ') : ''));
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
    // (the clock is manual: the wait runs frames, since a scene's bake holds the sim for as many frames as the machine needs)
    const talking = await (async () => { for (let i = 0; i < 150 && !(await p.locator('#talkWrap.on').count()); i++) { await run(2); await p.waitForTimeout(20); } return (await p.locator('#talkWrap.on').count()) > 0; })();
    const more = async () => { for (let i = 0; i < 12 && !(await p.locator('#talk .ch').count()); i++) { await run(2); if (await p.locator('#talk .more').count()) await p.locator('#talk .more').tap(); } };   // (a line with effects waits a tick for the sim)
    await more(); await p.locator('#talk .ch', { hasText: 'Anything I can do' }).tap(); await more();
    await p.locator('#talk .ch', { hasText: "I'll see to it" }).tap(); await run(3); await more();
    const st = await p.evaluate(() => ({ q: globalThis.__sim.state.quests.vale_long_way_round, tracked: globalThis.__sim.state.tracked }));
    check('quest: "Anything I can do?" → accepted in conversation, and tracked', talking && st.q && st.q.st === 1 && st.tracked === 'vale_long_way_round', JSON.stringify(st));
    // the topics the talk comes back to read the quest as the sim now has it (it had offered it again until you walked off)
    const after = await p.locator('#talk .ch').allTextContents();
    const note = await p.locator('#talk .note').innerText().catch(() => '');
    check('quest: the window says it\'s taken (title, the Journal), and her topic about it reads Taken, not New', after.length > 0 && !after.some((t) => /Anything I can do/.test(t)) && after.some((t) => /^About the barrows road…\s*Taken$/.test(t)) && /Quest taken: The Long Way Round/.test(note) && /Journal/.test(note), JSON.stringify(after) + ' · ' + note);
    if (await p.locator('#talk .x').count()) await p.locator('#talk .x').tap();
    await run(3);
    const tracker = await p.locator('#questTrack.on').innerText().catch(() => '');
    check('quest: the tracker line names it, with its counts', /The Long Way Round/.test(tracker) && /Waves 0\/4/.test(tracker), tracker.replace(/\n/g, ' · '));
    await p.locator('#journalBtn').tap();
    const card = await p.locator('#journal .q:not(.story)').first().innerText().catch(() => '');
    check('quest: the Journal shows it (who wants it and why, the step, both objectives, the reward)', /Hold four waves there/.test(card) && /Maudry Fenn keeps the Tired Mule/.test(card) && /0\/4/.test(card) && /0\/1/.test(card) && /433 XP/.test(card), card.split('\n').slice(0, 3).join(' · '));
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
    const talkTo = async (id) => { await p.evaluate((id) => { const s = globalThis.__sim, n = s.world.npcs.find((q) => q.id === id), q = s.state.player; s.commands.push({ type: 'endTalk' }); q.x = q.px = n.x - 1; q.y = q.py = n.y + 1; s.commands.push({ type: 'talk', npc: id }); }, id); await (async () => { for (let i = 0; i < 150 && !(await p.locator('#talkWrap.on').count()); i++) { await run(2); await p.waitForTimeout(20); } return (await p.locator('#talkWrap.on').count()) > 0; })(); await more(); };   // (frames until it opens: a 3-frame wait then real time was flaky after a scene change)
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
    const card = await p.locator('#journal .q:not(.story)').first().innerText().catch(() => '');
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
    // the compass list stays open through the fight (the battle walking the hero isn't the stick); the stick closes it
    await p.locator('#compassBtn').tap(); await run(2);
    let movedInFight = 0; for (let i = 0; i < 16; i++) { await run(10); if (await p.evaluate(() => globalThis.__sim.state.player.moving)) movedInFight++; }
    const stillOpen = await p.locator('#compassMenu.on').count();
    await p.evaluate(() => { for (let i = 0; i < 3; i++) { globalThis.__sim.commands.push({ type: 'move', x: 1, y: 0 }); globalThis.__frame(1000 / 30); } });
    await p.waitForSelector('#compassMenu.on', { state: 'hidden', timeout: 3000 }).catch(() => null);
    check('compass: the list stays open while the fight walks the hero, and the stick still closes it', stillOpen === 1 && (await p.locator('#compassMenu.on').count()) === 0, `open through ${movedInFight}/16 moving samples: ${stillOpen} · after the stick: ${await p.locator('#compassMenu.on').count()}`);
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
    check('chronicle: its chest gives Standing Order 14, and the Chronicle shows it (and the Vale\'s nine still missing, and the Fens\' ten), no page errors', frags.length === 1 && /Standing Order 14/.test(text) && /Third Legion/.test(text) && missing === 19 && errs.length === 0, `${text.split('\n')[0]} · missing ${missing}` + (errs.length ? ' · ' + errs.join(' | ') : ''));
    await ctx.close(); await b.close();
  }
}
// 11. Atlas versions: every atlas image is asked for at the version of its rects (renderer.js atlasMeta).
// A re-bake moved the stairwell's rect (3494747) and a browser holding the old PNG drew it blank.
{
  const b = await launch(chromium, 'chromium');
  if (b) {
    const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true }), p = await ctx.newPage();
    const pngs = []; p.on('request', (r) => { const m = /\/assets\/(env|actors)\/([^/.]+)\.(alb|nrm|key|emi)\.png(\?v=(\w+))?$/.exec(r.url()); if (m) pngs.push({ dir: m[1], name: m[2], v: m[5] }); });
    await p.goto(`${base}/index.html?dev&notitle&scene=dungeon`); await p.waitForFunction(() => !!globalThis.__sim, null, { timeout: 60000 }); await p.waitForTimeout(1500);
    const fnv = (t) => { let h = 0x811c9dc5; for (let i = 0; i < t.length; i++) h = Math.imul(h ^ t.charCodeAt(i), 0x01000193); return (h >>> 0).toString(36); };
    const bad = pngs.filter((q) => q.v !== fnv(readFileSync(`assets/${q.dir}/${q.name}.json`, 'utf8')));
    check('atlases: every atlas image is fetched at its JSON\'s version', pngs.some((q) => q.name === 'env') && bad.length === 0, `${pngs.length} images` + (bad.length ? ' · stale: ' + bad.map((q) => q.name).join(', ') : ''));
    await ctx.close(); await b.close();
  }
}
// 12. The sky dial (GDD §10.1): under the embers, it overlaps nothing on screen — not the HUD row's wage line
// or Weakened chip, not a toast (its own included), the quest tracker, the compass, the Journal, the minimap,
// the room pill or anything else — at phone and tablet widths, in town, on the Vale and in a fight, with a
// wage owed soon, big numbers and a tracked quest; the canvas-drawn pieces are laid out under the HUD row,
// so the dial must end inside it. A tap says when the next part comes.
{
  const b = await launch(chromium, 'chromium');
  if (b) {
    const bad = [], seen = [];
    for (const W of [360, 390, 430, 768]) for (const scene of ['town', 'overland', 'dungeon']) {
      const ctx = await b.newContext({ viewport: { width: W, height: W > 500 ? 1024 : 800 }, isMobile: true, hasTouch: true }), p = await ctx.newPage();
      const errs = []; p.on('pageerror', (e) => errs.push(e.message));
      await p.goto(`${base}/index.html?dev&manual&notitle&scene=${scene}`); await p.waitForFunction(() => !!globalThis.__sim && !!globalThis.__frame, null, { timeout: 60000 });
      const run = (n) => p.evaluate((n) => { for (let i = 0; i < n; i++) globalThis.__frame(1000 / 30); }, n);
      await p.waitForTimeout(600); await run(5);
      await p.evaluate((fight) => {
        const s = globalThis.__sim, C = s.state.counters;
        s.state.party.push({ ...s.state.party[0], id: 'sky1', name: 'Tam', main: false, rank: 'lantern', perks: [], level: 9 });   // a wage due (more than the purse)
        C.gold = 12; C.embers = 99999; s.bus.emit('countersChanged', { ...C }); s.bus.emit('partyChanged', s.state.party);
        s.state.party[0].weakUntil = s.state.t + 600; s.bus.emit('weakened', { on: true });                                       // the Weakened chip in the row
        s.quests.begin('vale_long_way_round');                                                                                     // the tracker line
        s.state.t = 4 * 900 - 100;                                                                                                 // night, dawn (and its wages) close
        if (fight) { const L = s.world.level, r = L.rooms.find((q) => s.world.roomLevels.get(q.id) === 1), pl = s.state.player; pl.x = pl.px = r.cx + 0.5; pl.y = pl.py = r.cy + 0.5; }
      }, scene === 'dungeon');
      await run(60); await p.waitForTimeout(1300); await run(3);
      await p.locator('#hudSky').tap(); await run(2); await p.waitForTimeout(250);
      const r = await p.evaluate(() => {
        const sky = document.getElementById('hudSky'), parts = [...sky.querySelectorAll('svg, span')].map((e) => e.getBoundingClientRect());   // the dial, the weather's icon, the word
        const box = { l: Math.min(...parts.map((q) => q.left)), t: Math.min(...parts.map((q) => q.top)), r: Math.max(...parts.map((q) => q.right)), b: Math.max(...parts.map((q) => q.bottom)) };
        const vw = innerWidth, vh = innerHeight, hits = [];
        for (const e of document.querySelectorAll('body *')) {
          if (e === sky || sky.contains(e) || e.contains(sky) || e.tagName === 'CANVAS' || e.closest('svg') && !sky.contains(e)) continue;
          const cs = getComputedStyle(e); if (cs.display === 'none' || cs.visibility === 'hidden' || +cs.opacity === 0) continue;
          let hidden = false; for (let a = e.parentElement; a; a = a.parentElement) { const c = getComputedStyle(a); if (c.display === 'none' || c.visibility === 'hidden' || +c.opacity === 0) { hidden = true; break; } } if (hidden) continue;
          const q = e.getBoundingClientRect(); if (q.width < 1 || q.height < 1 || q.width * q.height > 0.5 * vw * vh) continue;   // (full-screen layers: the vignette, a window's backdrop)
          if (!(e.textContent || '').trim() && !['BUTTON', 'IMG'].includes(e.tagName) && cs.backgroundColor === 'rgba(0, 0, 0, 0)' && cs.borderStyle === 'none') continue;   // an empty box draws nothing
          const ix = Math.min(box.r, q.right) - Math.max(box.l, q.left), iy = Math.min(box.b, q.bottom) - Math.max(box.t, q.top);
          if (ix > 0.5 && iy > 0.5) hits.push(`${e.tagName.toLowerCase()}${e.id ? '#' + e.id : ''}${typeof e.className === 'string' && e.className ? '.' + e.className.split(' ').join('.') : ''} "${(e.textContent || '').trim().slice(0, 24)}"`);
        }
        const hud = document.getElementById('hud').getBoundingClientRect(), tap = sky.getBoundingClientRect(), toast = document.getElementById('hudToast');
        return { box, hits, hudB: hud.bottom, vw, tapH: tap.height, tapW: tap.width, word: sky.querySelector('span').textContent, icon: !!sky.querySelector('svg.wx'), toast: toast.classList.contains('on') && toast.firstElementChild ? toast.firstElementChild.textContent : '', battle: !!globalThis.__sim.battle, tracker: !!document.querySelector('#questTrack') && getComputedStyle(document.querySelector('#questTrack')).display !== 'none', menuW: document.getElementById('menuBtn').getBoundingClientRect().width };
      });
      const where = `${W}px ${scene}`, probs = [];
      if (r.hits.length) probs.push('overlaps ' + r.hits.join(', '));
      if (r.box.b > r.hudB + 0.5) probs.push(`ends at ${r.box.b.toFixed(0)} under the HUD row (${r.hudB.toFixed(0)}): the minimap and room pill sit there`);
      if (r.box.l < 0 || r.box.r > r.vw) probs.push('off screen');
      if (r.tapH < 44 || r.tapW < 44) probs.push(`tap area ${r.tapW.toFixed(0)}×${r.tapH.toFixed(0)}`);
      if (r.menuW < 34) probs.push(`the menu button squeezed to ${r.menuW.toFixed(0)} px`);
      if (r.word !== 'Night' || !/^Night · dawn in \d+ min( · [a-z ]+(, [a-z]+ in \d+ min)?)? · wages \d+ gold at dawn$/.test(r.toast)) probs.push(`says ${r.word} / "${r.toast}"`);
      if (scene !== 'dungeon' && !r.icon) probs.push('no weather icon outdoors'); if (scene === 'dungeon' && r.icon) probs.push('a weather icon underground');
      if (scene === 'dungeon' && !r.battle) probs.push('no fight to check against');
      if (errs.length) probs.push(errs.join(' | '));
      if (probs.length) bad.push(`${where}: ${probs.join('; ')}`); else seen.push(where);
      await ctx.close();
    }
    check('sky dial: overlaps nothing (wage line, Weakened, toasts, tracker, compass, Journal, minimap, room pill) at 360/390/430/768 px in town, on the Vale and in a fight; a tap tells the time', bad.length === 0, bad.length ? bad.join(' · ') : `${seen.length} layouts`);
    await b.close();
  }
}
// 13. Tap a chest anywhere on it to open it (2026-10-01): the lid of a chest drawn at twice its old size stands
// up the screen from its floor tile, and a tap there resolved to the tile behind — the hero walked, and the
// chest stayed shut. The tap is matched against the chest as drawn (renderer.propAt), lid and all.
{
  const b = await launch(chromium, 'chromium');
  if (b) {
    const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true }), p = await ctx.newPage();
    const errs = []; p.on('pageerror', (e) => errs.push(e.message));
    await p.goto(`${base}/index.html?dev&manual&notitle&scene=dungeon&site=tithe_mill`); await p.waitForFunction(() => !!globalThis.__sim && !!globalThis.__frame, null, { timeout: 60000 });
    const run = (n) => p.evaluate((n) => { for (let i = 0; i < n; i++) globalThis.__frame(1000 / 30); }, n);
    await p.waitForTimeout(800); await run(5);
    const key = await p.evaluate(() => { const s = globalThis.__sim, k = [...s.world.props].find(([, v]) => v === 'chest')[0], [x, y] = k.split(',').map(Number), pl = s.state.player; pl.x = pl.px = x + 1.5; pl.y = pl.py = y + 0.5; return k; });
    await run(40);
    // the highest point on screen that is this chest (its lid), and where a floor-tile tap there used to go
    const top = await p.evaluate((key) => {
      const R = globalThis.__renderer;
      for (let y = 80; y < innerHeight - 200; y += 2) for (let x = 0; x < innerWidth; x += 2) { const h = R.propAt(x, y); if (h && `${h.tx},${h.ty}` === key) { const t = R.screenToTile(x, y + 3, 1); return { x, y: y + 3, floor: `${t.tx},${t.ty}` }; } }
      return null;
    }, key);
    if (top) { await p.touchscreen.tap(top.x, top.y); await run(40); }
    const opened = await p.evaluate((key) => !!(globalThis.__sim.world.mods.get(key) || {}).opened, key);
    check('chest: a tap on its lid opens it (the floor tile there was another, and only walked)', !!top && top.floor !== key && opened && errs.length === 0, JSON.stringify({ key, top, opened }) + (errs.length ? ' · ' + errs.join(' | ') : ''));
    await ctx.close(); await b.close();
  }
}
// 14. A skill learned from someone you talk to says so, the way a quest's reward does: hand Nell her trial
// and the conversation window shows "New skill learned: Smoke Step", who knows it now and what it does.
{
  const b = await launch(chromium, 'chromium');
  if (b) {
    const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true }), p = await ctx.newPage();
    const errs = []; p.on('pageerror', (e) => errs.push(e.message));
    await p.goto(`${base}/index.html?dev&manual&notitle&scene=town`); await p.waitForFunction(() => !!globalThis.__sim && !!globalThis.__frame, null, { timeout: 60000 });
    const run = (n) => p.evaluate((n) => { for (let i = 0; i < n; i++) globalThis.__frame(1000 / 30); }, n);
    const more = async () => { for (let i = 0; i < 12 && !(await p.locator('#talk .ch').count()); i++) { await run(2); if (await p.locator('#talk .more').count()) await p.locator('#talk .more').tap(); } };
    await p.waitForTimeout(800); await run(5);
    await p.evaluate(() => {
      const s = globalThis.__sim, h = s.state.party[0]; h.cls = 'rogue'; h.level = 6; s.state.trials = {};
      s.quests.begin('trial_quiet_feet'); s.state.quests.trial_quiet_feet.st = 2;                // three sergeants down: ready to hand in
      const n = s.world.npcs.find((q) => q.id === 'nell_tolley'), q = s.state.player; q.x = q.px = n.x - 1; q.y = q.py = n.y + 1; s.commands.push({ type: 'talk', npc: 'nell_tolley' });
    });
    await (async () => { for (let i = 0; i < 150 && !(await p.locator('#talkWrap.on').count()); i++) { await run(2); await p.waitForTimeout(20); } return (await p.locator('#talkWrap.on').count()) > 0; })(); await more();
    await p.locator('#talk .ch', { hasText: 'Three sergeants' }).tap().catch(() => null); await run(4); await more();
    const done = await p.locator('#talk .note.done').first().innerText().catch(() => ''), skill = await p.locator('#talk .note.skill').innerText().catch(() => '');
    check('skill: handing in a trial says a new skill is learned (name, who knows it, what it does), under the quest\'s own note', /Handed in/.test(done) && /New skill learned: Smoke Step/.test(skill) && /every rogue in your company knows it/.test(skill) && /DODGE/.test(skill) && errs.length === 0, `${done} || ${skill.replace(/\n/g, ' · ')}` + (errs.length ? ' · ' + errs.join(' | ') : ''));
    await ctx.close(); await b.close();
  }
}
// 15. The tavern's Hire view in two sub-tabs (docs/tavern-hire-mockup.html): opened from the wage line it
// shows Your company; the Hire tab's buttons read "Add to roster · fee" with the party full, and a hire
// goes to the bench; a bench member swaps into the party from Your company.
{
  const b = await launch(chromium, 'chromium');
  if (b) {
    const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true }), p = await ctx.newPage();
    const errs = []; p.on('pageerror', (e) => errs.push(e.message));
    await p.goto(`${base}/index.html?dev&manual&notitle&scene=town`); await p.waitForFunction(() => !!globalThis.__sim && !!globalThis.__frame, null, { timeout: 60000 });
    const run = (n) => p.evaluate((n) => { for (let i = 0; i < n; i++) globalThis.__frame(1000 / 30); }, n);
    await p.waitForTimeout(800); await run(5);
    await p.evaluate(() => { const s = globalThis.__sim; s.state.party[0].level = 8; s.state.counters.gold = 100000; for (const idx of [0, 1]) { s.commands.push({ type: 'hire', idx }); s.tick(); } s.bus.emit('countersChanged', { ...s.state.counters }); });
    await run(5); await p.waitForTimeout(1200);
    await p.locator('#hudWage').tap(); await run(3);
    const tabs = await p.locator('#hubSheet .subtabs button').allInnerTexts(), on1 = await p.locator('#hubSheet .subtabs button.on').innerText();
    await p.locator('#hubSheet [data-htab="hire"]').tap(); await run(2);
    const labels = await p.locator('#hubSheet [data-hire]').allInnerTexts(), fullNote = await p.locator('#hubSheet .full').innerText().catch(() => '');
    const free = p.locator('#hubSheet [data-hire]:not([disabled])').first(); await free.tap(); await run(3);
    const after = await p.evaluate(() => ({ party: globalThis.__sim.state.party.length, bench: globalThis.__sim.state.bench.map((m) => m.id) }));
    await p.locator('#hubSheet [data-htab="company"]').tap(); await run(2);
    const swaps = await p.locator('#hubSheet [data-swap]').allInnerTexts();
    await p.locator('#hubSheet [data-swap]').first().tap(); await run(3);
    const swapped = await p.evaluate((id) => globalThis.__sim.state.party.some((m) => m.id === id), after.bench[0]);
    check('tavern: the Hire view has Your company and Hire tabs; with the party full a hire reads "Add to roster" and goes to the bench; a bench member swaps in',
      /Your company/.test(tabs[0]) && /party 3\/3/.test(tabs[0]) && /Hire/.test(tabs[1]) && /Your company/.test(on1) && labels.some((t) => /^Add to roster · \d+/.test(t)) && /party is full/.test(fullNote)
      && after.party === 3 && after.bench.length === 1 && swaps.length === 2 && swaps.every((t) => /^Swap for /.test(t)) && swapped && errs.length === 0,
      JSON.stringify({ tabs, on1, labels: labels.slice(0, 2), after, swaps, swapped }) + (errs.length ? ' · ' + errs.join(' | ') : ''));
    await ctx.close(); await b.close();
  }
}
// 15b. A dungeon shrine offers its blessing (GDD §3.6 v1.14): a touch opens the card, Close keeps its light,
// Use spends it and mends the party.
{
  const b = await launch(chromium, 'chromium');
  if (b) {
    const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true }), p = await ctx.newPage();
    const errs = []; p.on('pageerror', (e) => errs.push(e.message));
    await p.goto(`${base}/index.html?dev&manual&notitle&scene=dungeon`); await p.waitForFunction(() => !!globalThis.__sim && !!globalThis.__frame, null, { timeout: 60000 });
    const run = (n) => p.evaluate((n) => { for (let i = 0; i < n; i++) globalThis.__frame(1000 / 30); }, n);
    await p.waitForTimeout(800); await run(5);
    const at = await p.evaluate(async () => {
      const { shrineKind } = await import('./src/sim/shrines.js');   // (v1.30: a green one, the kind that mends)
      const s = globalThis.__sim, find = () => [...s.world.props].find(([k, v]) => v === 'shrine' && shrineKind(s.world, ...k.split(',').map(Number)) === 'mend');
      for (let d = 1; d < 6 && !find(); d++) s.restore({ ...JSON.parse(JSON.stringify(s.snapshot())), depth: d, floors: [] });   // (a floor with a shrine)
      const k = find(); if (!k) return null; const [x, y] = k[0].split(',').map(Number), q = s.state.player;
      q.x = q.px = x + 1.5; q.y = q.py = y + 0.5; s.state.party[0].hp = 5;
      s.commands.push({ type: 'harvest', tx: x, ty: y }); return { x, y };
    });
    await run(4);
    const on1 = await p.locator('#shrineCard.on').count(), text = await p.locator('#shrineCard').innerText().catch(() => ''), useOn = await p.locator('#shrineCard .use:not([disabled])').count();
    await p.locator('#shrineCard .close').tap(); await run(3);
    const kept = await p.evaluate((a) => { const s = globalThis.__sim; return !s.world.mods.get(a.x + ',' + a.y) && s.state.party[0].hp < 20; }, at);
    const on2 = await p.locator('#shrineCard.on').count();
    await p.evaluate((a) => globalThis.__sim.commands.push({ type: 'harvest', tx: a.x, ty: a.y }), at); await run(4);
    await p.locator('#shrineCard .use').tap(); await run(4);
    const used = await p.evaluate((a) => { const s = globalThis.__sim; return { spent: !!s.world.mods.get(a.x + ',' + a.y), hp: Math.round(s.state.party[0].hp) }; }, at);
    const on3 = await p.locator('#shrineCard.on').count();
    check('shrine: a touch opens its card (what it does, Use · Close); Close keeps its light; Use spends it and mends',
      !!at && on1 === 1 && /mends everyone standing/.test(text) && /One use/.test(text) && useOn === 1 && kept && on2 === 0 && used.spent && used.hp > 20 && on3 === 0 && errs.length === 0,
      JSON.stringify({ at, on1, useOn, kept, on2, used, on3, text: text.split('\n').slice(0, 3).join(' · ') }) + (errs.length ? ' · ' + errs.join(' | ') : ''));
    await ctx.close(); await b.close();
  }
}
// 15c. The Stage (dev: docs/character-stage-proposal.md): the whole cast in a lineup at a phone's width (390 × 1400), every
// atlas loaded, no two figures overlapping and none off the screen; walking in place, their frames change and
// their spots don't.
{
  const b = await launch(chromium, 'chromium');
  if (b) {
    const ctx = await b.newContext({ viewport: { width: 390, height: 1400 }, deviceScaleFactor: 2 }), p = await ctx.newPage();   // (a phone's width: 25 tiles across at DPR 2; a wide window is no taller in game pixels, and DPR 1 clamps the scale. 1180 tall since the Mere Tower's ten boss-sized wardens joined: 53 don't fit 844; 1300 with the Fens' four bosses; 1400 with Act II's six)
    const errs = []; p.on('pageerror', (e) => errs.push(e.message));
    await p.goto(`${base}/index.html?dev&manual&scene=stage&group=all&clip=walk&dir=1`);
    await p.waitForFunction(() => !!globalThis.__frame && !!globalThis.__stage, null, { timeout: 60000 });
    for (let i = 0; i < 80 && !(await p.evaluate(() => globalThis.__renderer.stageReady)); i++) { await p.waitForTimeout(250); await p.evaluate(() => globalThis.__frame(16)); }
    const snap = () => p.evaluate(() => { for (let i = 0; i < 10; i++) globalThis.__frame(1000 / 60); return globalThis.__stage.actors.map((a) => ({ id: a.atlas, box: a.box, x: a.x, y: a.y })); });
    const s1 = await snap(), s2 = await snap(), v = await p.evaluate(() => globalThis.__renderer.view);
    const meet = (a, c) => a[0] < c[2] && c[0] < a[2] && a[1] < c[3] && c[1] < a[3];
    const overlaps = []; for (let i = 0; i < s1.length; i++) for (let j = i + 1; j < s1.length; j++) if (s1[i].box && s1[j].box && meet(s1[i].box, s1[j].box)) overlaps.push(`${s1[i].id}×${s1[j].id}`);
    const off = s1.filter((a) => !a.box || a.box[0] < 0 || a.box[1] < 0 || a.box[2] > v.w || a.box[3] > v.h).map((a) => a.id);
    const moved = s1.filter((a, i) => a.x !== s2[i].x || a.y !== s2[i].y).length, animating = s1.filter((a, i) => JSON.stringify(a.box) !== JSON.stringify(s2[i].box)).length;
    const hud = await p.evaluate(() => [...document.body.children].filter((e) => e.tagName !== 'CANVAS' && e.id !== 'stagePanel' && e.tagName !== 'SCRIPT' && getComputedStyle(e).display !== 'none').map((e) => e.id || e.tagName));
    check('stage: the whole cast lined up (63: M8 adds the Fens\' seven, the Mere Tower\'s ten wardens, the Fens\' four bosses and Act II\'s six), all loaded, none overlapping or off screen; walking in place (frames change, spots don\'t); no HUD',
      s1.length === 63 && overlaps.length === 0 && off.length === 0 && moved === 0 && animating > 10 && hud.length === 0 && errs.length === 0,
      JSON.stringify({ n: s1.length, overlaps: overlaps.slice(0, 3), off: off.slice(0, 3), moved, animating, hud }) + (errs.length ? ' · ' + errs.join(' | ') : ''));
    await ctx.close(); await b.close();
  }
}
// 15d. Thornwick's people stand in view (art critic pass 8): at each part of the day, with everyone on that
// part's spot and the hero aside, no named person is drawn more than 5 % behind a building, the well or a roof
// (the renderer's x-ray share, dev __xray). Nell stood 44 % behind the Mule, Jory 38 % and Ilse 26 % behind
// Wendel's roof, and the well's roof cut across Osric's face.
{
  const b = await launch(chromium, 'chromium');
  if (b) {
    const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 }), p = await ctx.newPage();
    const errs = []; p.on('pageerror', (e) => errs.push(e.message));
    await p.goto(`${base}/index.html?dev&manual&notitle&scene=town&tod=day`);
    await p.waitForFunction(() => !!globalThis.__sim && !!globalThis.__frame, null, { timeout: 60000 });
    for (let i = 0; i < 40; i++) { await p.waitForTimeout(100); await p.evaluate(() => globalThis.__frame(16)); }   // (atlases load in real time)
    const hidden = await p.evaluate(async () => {
      const s = globalThis.__sim, w = s.world, { NPCS, PART_S } = await import('/src/sim/npcs.js'), out = {};
      for (let part = 0; part < 4; part++) {
        s.state.t = part * PART_S + 5;
        for (const n of w.npcs) if (n.folk) { const k = NPCS[n.id].day[part] || 0, g = n.spots[k]; n.at = k; n.path = null; n.x = n.px = g.x; n.y = n.py = g.y; n.rest = 1e9; }
        for (const n of w.npcs) {
          const q = s.state.player; q.x = q.px = n.x + 4; q.y = q.py = n.y - 4;                  // aside: level with them on screen, to the right
          for (const m of s.state.party.slice(1)) { m.x = m.px = q.x; m.y = m.py = q.y; }
          for (let i = 0; i < 40; i++) globalThis.__frame(16);
          globalThis.__xray = {}; globalThis.__frame(16);
          const v = globalThis.__xray[n.id]; out[n.id] = Math.max(out[n.id] || 0, v == null ? 1 : v);
        }
      }
      globalThis.__xray = null; return out;
    });
    const worst = Object.entries(hidden).filter(([, v]) => v > 0.05);
    check('town: nobody stands behind a building, the well or a roof at any part of the day (≤ 5 % of their figure drawn as x-ray)',
      Object.keys(hidden).length === 9 && worst.length === 0 && errs.length === 0,
      JSON.stringify(Object.fromEntries(Object.entries(hidden).map(([k, v]) => [k, Math.round(v * 100)]))) + (errs.length ? ' · ' + errs.join(' | ') : ''));
    await ctx.close(); await b.close();
  }
}
// 15d1. Saltmere's square (its critic pass): on the home screen, as you wake, nobody of Saltmere's stands behind a building
// (Mother Agnes stood in the Stilt House's footprint, drawn through it as a ghost), and every one of them is in view
{
  const b = await launch(chromium, 'chromium');
  if (b) {
    const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true }), p = await ctx.newPage();
    const errs = []; p.on('pageerror', (e) => errs.push(e.message));
    await p.goto(`${base}/index.html?dev&manual&notitle&scene=town&region=fens&tod=day`); await p.waitForFunction(() => !!globalThis.__sim && !!globalThis.__frame, null, { timeout: 60000 });
    for (let i = 0; i < 50; i++) { await p.waitForTimeout(100); await p.evaluate(() => { for (let j = 0; j < 3; j++) globalThis.__frame(1000 / 30); }); if (i > 20 && !(await p.evaluate(() => globalThis.__renderer.transiting))) break; }
    const seen = await p.evaluate(() => {
      for (let j = 0; j < 60; j++) globalThis.__frame(1000 / 30);
      globalThis.__xray = {}; globalThis.__frame(16); const x = globalThis.__xray; globalThis.__xray = null;
      const w = globalThis.__sim.world, out = {};
      for (const n of w.npcs) { let on = false; for (let y = 60; y < 640 && !on; y += 4) for (let sx = 4; sx < 390 && !on; sx += 4) on = globalThis.__renderer.npcAt(sx, y)?.id === n.id; out[n.id] = { xray: x[n.id] == null ? 1 : Math.round(x[n.id] * 100) / 100, on }; }
      return out;
    });
    const bad = Object.entries(seen).filter(([, v]) => v.xray > 0.05 || !v.on);
    check('Saltmere: on the home screen nobody stands behind a building (≤ 5 % drawn as x-ray), and everyone is in view',
      Object.keys(seen).length >= 4 && bad.length === 0 && errs.length === 0, JSON.stringify(seen) + (errs.length ? ' · ' + errs.join(' | ') : ''));
    await ctx.close(); await b.close();
  }
}
// 15d2. The square's menu is the same in every town (2026-10-10, the owner: "Make sure the town square menu layout stays
// for each town"): in Thornwick, Ashgate and Frosthold the bar holds the five services in one order, and each service's
// plaque is drawn in the same place (±1 px), whole on screen, clear of the others and of the right-hand buttons. The
// plaques hang at set heights (sim outdoor.js SIGN_TOP), so a roof that changes (art critic pass 14) moves none of them.
// Saltmere's four are on screen and clear too.
{
  const b = await launch(chromium, 'chromium');
  if (b) {
    const seen = {};
    for (const region of ['vale', 'reach', 'heights', 'fens']) {
      const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true }), p = await ctx.newPage();
      const errs = []; p.on('pageerror', (e) => errs.push(e.message));
      await p.goto(`${base}/index.html?dev&manual&notitle&scene=town&region=${region}`); await p.waitForFunction(() => !!globalThis.__sim && !!globalThis.__frame, null, { timeout: 60000 });
      for (let i = 0; i < 60; i++) { await p.waitForTimeout(100); await p.evaluate(() => { for (let j = 0; j < 3; j++) globalThis.__frame(1000 / 30); }); if (i > 20 && !(await p.evaluate(() => globalThis.__renderer.transiting))) break; }   // (atlases load in real time; the camera settles on the square)
      await p.evaluate(() => { for (let j = 0; j < 60; j++) globalThis.__frame(1000 / 30); });
      seen[region] = await p.evaluate(() => {
        const box = (id) => { const e = document.getElementById(id), r = e && e.getBoundingClientRect(); return r && r.width ? { l: r.left, t: r.top, r: r.right, b: r.bottom } : null; };
        return { plaques: globalThis.__renderer.plaques, bar: [...document.querySelectorAll('#hubBar.on button')].map((x) => x.dataset.k), buttons: ['compassBtn', 'journalBtn', 'mapBtn'].map(box).filter(Boolean) };
      });
      seen[region].errs = errs; await ctx.close();
    }
    const hit = (a, c) => a.l < c.r && c.l < a.r && a.t < c.b && c.t < a.b;
    const fine = (v, n) => v.plaques.length === n && v.errs.length === 0 && v.plaques.every((q, i) => q.l >= 0 && q.r <= 390 && q.t >= 0 && q.b <= 844 && !v.buttons.some((x) => hit(q, x)) && v.plaques.every((o, j) => j === i || !hit(q, o)));
    const at = (v) => Object.fromEntries(v.plaques.map((q) => [q.kind, [Math.round(q.l), Math.round(q.t)]]));
    const same = ['reach', 'heights'].every((r) => seen[r].plaques.length === seen.vale.plaques.length && seen.vale.plaques.every((q) => { const o = seen[r].plaques.find((x) => x.kind === q.kind); return o && Math.abs(o.t - q.t) <= 1 && Math.abs(o.ax - q.ax) <= 1; }));   // (ax: where it hangs; a long name is then kept on screen and off the buttons)
    check('town square: the same menu in every town: the bar\'s five services in order, each plaque in the same place in Thornwick, Ashgate and Frosthold, whole, clear of each other and the buttons; Saltmere\'s four too',
      ['vale', 'reach', 'heights'].every((r) => seen[r].bar.join() === 'shop,smith,tavern,inn,temple' && fine(seen[r], 5)) && same && seen.fens.bar.join() === 'shop,tavern,inn,temple' && fine(seen.fens, 4),
      JSON.stringify({ vale: at(seen.vale), reach: at(seen.reach), heights: at(seen.heights), fens: at(seen.fens), bars: Object.fromEntries(Object.entries(seen).map(([k, v]) => [k, v.bar.length])), errs: Object.values(seen).flatMap((v) => v.errs) }));
    await b.close();
  }
}
// 15e. Raising the slain (the owner, 2026-10-04: "Resurrection should have some sort of animated flash and a message that the
// companion was raised"). Through the temple's own menu: a companion slain in town, the Temple's Raise the slain, its button.
// They're raised; the toast names them on one line, over the open sheet, inside the screen; the banner says it; no errors.
{
  const b = await launch(chromium, 'chromium');
  if (b) {
    const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true }), p = await ctx.newPage();
    const errs = []; p.on('pageerror', (e) => errs.push(e.message));
    await p.goto(`${base}/index.html?dev&manual&notitle&scene=town`); await p.waitForFunction(() => !!globalThis.__sim && !!globalThis.__frame, null, { timeout: 60000 });
    const run = (n) => p.evaluate((n) => { for (let i = 0; i < n; i++) globalThis.__frame(1000 / 30); }, n);
    await p.waitForTimeout(800);
    const name = await p.evaluate(() => { const s = globalThis.__sim; s.state.counters.gold = 5000; s.commands.push({ type: 'hire', idx: 0 }); for (let i = 0; i < 4; i++) globalThis.__frame(50);   // (a tick or two: the hire is a command)
      const m = s.state.party[1]; if (!m) return null; m.fallen = true; m.hp = 0; return m.name; });
    await run(20);
    await p.locator('[data-k="temple"]').tap(); await run(3);
    await p.locator('[data-go^="raise"]').tap(); await run(3);
    await p.locator('[data-raise]').first().tap(); await run(6);
    const r = await p.evaluate(() => { const s = globalThis.__sim, box = document.getElementById('hudToast'), t = box.firstElementChild || box, q = t.getBoundingClientRect(), cs = getComputedStyle(t);   // (the newest line of the stack)
      return { fallen: s.state.party[1].fallen, text: t.textContent, on: box.classList.contains('on'), left: q.left, right: q.right, h: t.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom), line: parseFloat(cs.lineHeight) || 18, z: +getComputedStyle(box).zIndex, sheetZ: +getComputedStyle(document.getElementById('hubSheet') || document.body).zIndex || 0 }; });
    check('raise: the temple raises a slain companion; the toast names them on one line, over the open sheet, on screen; no page errors',
      !!name && r.fallen === false && r.on && r.text.includes(name) && /^Raised/.test(r.text) && r.left >= 0 && r.right <= 390 && r.h < r.line * 1.6 && r.z > r.sheetZ && errs.length === 0,
      JSON.stringify(r) + (errs.length ? ' · ' + errs.join(' | ') : ''));
    await ctx.close(); await b.close();
  }
}
// 15f. The pink stand-in (fens critic pass 1): the renderer was made before the save was restored, so its `ready` (what the
// loading screen waits for) held only the default knight's atlas. A created hero (a cleric) showed the old paper doll,
// pink, until theirs came in. Now `ready`, read after the restore, waits for every member's own look.
{
  const b = await launch(chromium, 'chromium');
  if (b) {
    const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true }), p = await ctx.newPage();
    const errs = []; p.on('pageerror', (e) => errs.push(e.message));
    const got = {}; p.on('response', (r) => { const m = r.url().match(/assets\/actors\/(hero_\w+)\.alb\.png/); if (m) got[m[1]] = Date.now(); });
    await p.goto(`${base}/index.html?dev&manual&notitle&scene=town`); await p.waitForFunction(() => !!globalThis.__sim && !!globalThis.__renderer, null, { timeout: 60000 });
    const t = await p.evaluate(async () => { const H = globalThis.__sim.state.party[0]; H.actor = 'hero_cleric'; H.cls = 'cleric'; await globalThis.__renderer.ready; return Date.now(); });
    check('ready: the loading screen waits for the hero\'s own look (a cleric), not only the knight; no page errors',
      !!got.hero_cleric && got.hero_cleric <= t && errs.length === 0, JSON.stringify({ cleric: got.hero_cleric ? got.hero_cleric - t : null }) + (errs.length ? ' · ' + errs.join(' | ') : ''));
    await ctx.close(); await b.close();
  }
}
// 16. The forge and the shop (GDD §8): an upgrade from the Smith's Upgrade tab takes the gold and cinders
// and shows the next step; a level-1 piece too small to gain says so; the shop buys and sells.
{
  const b = await launch(chromium, 'chromium');
  if (b) {
    const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true }), p = await ctx.newPage();
    const errs = []; p.on('pageerror', (e) => errs.push(e.message));
    await p.goto(`${base}/index.html?dev&manual&notitle&scene=town`); await p.waitForFunction(() => !!globalThis.__sim && !!globalThis.__frame, null, { timeout: 60000 });
    const run = (n) => p.evaluate((n) => { for (let i = 0; i < n; i++) globalThis.__frame(1000 / 30); }, n);
    await p.waitForTimeout(800); await run(5);
    await p.evaluate(async () => {
      const s = globalThis.__sim, { makeItem } = await import('/src/sim/items.js');
      s.state.party[0].level = 6; Object.assign(s.state.counters, { gold: 5000, embers: 10, wood: 0, stone: 0 });
      s.state.bag.push(makeItem('kite', 6, 'common', { uid: 'k6' }));
      s.bus.emit('countersChanged', { ...s.state.counters });
    });
    await run(5); await p.waitForTimeout(600);
    await p.locator('button', { hasText: 'Smith' }).first().tap(); await run(2);
    await p.locator('#hubSheet [data-go="smith:upgrade"]').tap(); await run(2);
    const small = await p.locator('#hubSheet .merc', { hasText: 'Round Shield' }).innerText().catch(() => '');
    await p.locator('#hubSheet [data-upgrade="k6"]').tap(); await run(3);
    const up = await p.evaluate(() => { const s = globalThis.__sim, it = s.state.bag.find((q) => q.uid === 'k6'); return { up: it.up, gold: s.state.counters.gold, cinders: s.state.counters.embers }; });
    const next = await p.locator('#hubSheet [data-upgrade="k6"]').innerText().catch(() => '');
    await p.locator('#hubSheet .close').tap(); await run(2);
    await p.locator('button', { hasText: 'Shop' }).first().tap(); await run(2);
    await p.locator('#hubSheet [data-go="shop:buy"]').tap(); await run(2);
    const buys = await p.locator('#hubSheet [data-buy]').allInnerTexts();
    await p.locator('#hubSheet [data-buy]').first().tap(); await run(3);
    await p.locator('#hubSheet [data-ptab="sell"]').tap(); await run(2);
    await p.locator('#hubSheet [data-sell="k6"]').tap(); await run(3);
    const shop = await p.evaluate(() => { const s = globalThis.__sim; return { bag: s.state.bag.map((q) => q.uid), buyback: s.state.buyback.map((q) => q.uid), gold: s.state.counters.gold }; });
    const back = await p.locator('#hubSheet [data-buyback="k6"]').innerText().catch(() => '');
    check('forge and shop: an upgrade takes 180 gold and ✦ 1 and offers the next; a too-small piece says No gain; buy from the day\'s four, sell the +1 piece, and it waits to be bought back',
      up.up === 1 && up.gold === 5000 - 180 && up.cinders === 9 && /Upgrade to \+2/.test(next) && /No gain/.test(small)
      && buys.length === 4 && buys.every((t) => /^Buy · \d+/.test(t)) && shop.bag.length === 1 && !shop.bag.includes('k6') && shop.buyback[0] === 'k6' && /\d/.test(back) && errs.length === 0,
      JSON.stringify({ up, next, small: small.slice(-40), buys: buys.slice(0, 1), shop, back }) + (errs.length ? ' · ' + errs.join(' | ') : ''));
    await ctx.close(); await b.close();
  }
}
// 17. A phone on its side (the owner, 2026-10-03): the party cards stack in a column on the left, you on top, under
// the HUD row; the town's service bar and the tracker sit right of it, nothing of theirs under a card, and the camera
// keeps the hero in the open part of the screen. Upright, the cards are a row along the bottom as before.
{
  const b = await launch(chromium, 'chromium');
  if (b) {
    const out = {};
    for (const [W, H, scene] of [[844, 390, 'town'], [390, 844, 'town'], [844, 390, 'overland']]) {
      const ctx = await b.newContext({ viewport: { width: W, height: H }, isMobile: true, hasTouch: true }), p = await ctx.newPage();
      const errs = []; p.on('pageerror', (e) => errs.push(e.message));
      await p.goto(`${base}/index.html?dev&manual&notitle&scene=${scene}`); await p.waitForFunction(() => !!globalThis.__sim && !!globalThis.__frame, null, { timeout: 60000 });
      const run = (n) => p.evaluate((n) => { for (let i = 0; i < n; i++) globalThis.__frame(1000 / 30); }, n);
      await p.evaluate(() => globalThis.__sim.quests.begin('vale_long_way_round'));
      await p.waitForTimeout(1300); await run(60);
      out[`${W}x${H}${scene}`] = await p.evaluate(() => {
        const R = (id) => { const e = document.getElementById(id); if (!e) return null; const q = e.getBoundingClientRect(); return { l: q.left, r: q.right, t: q.top, b: q.bottom }; };
        const cards = [...document.querySelectorAll('#party .card')].map((e) => { const q = e.getBoundingClientRect(); return { main: e.classList.contains('main'), l: q.left, r: q.right, t: q.top, b: q.bottom }; })
          .sort((a, b) => a.t - b.t || a.l - b.l);   // as laid out (CSS order moves you up the column)
        // the tile under the middle of the open part of the screen, against where the hero stands
        const pl = globalThis.__sim.state.player, lx = Math.max(0, ...cards.map((c) => (cards[0].l === c.l && cards.length > 1 && cards[1].l === c.l ? c.r : 0)));
        const t = globalThis.__renderer.screenToTile((lx + innerWidth) / 2, innerHeight / 2, 0);
        return { cards, hud: R('hud'), bar: R('hubBar'), track: R('questTrack'), side: getComputedStyle(document.documentElement).getPropertyValue('--party-side').trim(), off: Math.hypot(t.tx + 0.5 - pl.x, t.ty + 0.5 - pl.y), vw: innerWidth, vh: innerHeight };
      });
      out[`${W}x${H}${scene}`].errs = errs;
      await ctx.close();
    }
    // a notch on the right, as iOS reports it sideways (47 px) once ui/safearea.js has read the rotation: the
    // cards hug the left edge, and the minimap, compass, Journal and Step-out keep clear of the notch
    {
      const ctx = await b.newContext({ viewport: { width: 844, height: 390 }, isMobile: true, hasTouch: true }), p = await ctx.newPage();
      await p.goto(`${base}/index.html?dev&manual&notitle&scene=dungeon`); await p.waitForFunction(() => !!globalThis.__sim && !!globalThis.__frame, null, { timeout: 60000 });
      await p.evaluate(() => { const r = document.documentElement; r.style.setProperty('--safe-l', '0px'); r.style.setProperty('--safe-r', '47px'); });
      await p.waitForTimeout(1300); await p.evaluate(() => { for (let i = 0; i < 30; i++) globalThis.__frame(1000 / 30); });
      out.notch = await p.evaluate(() => { const R = (s) => document.querySelector(s).getBoundingClientRect(); return { card: R('#party .card').left, compass: R('#compassBtn').right, journal: R('#journalBtn').right, vw: innerWidth }; });
      await ctx.close();
    }
    const L = out['844x390town'], P = out['390x844town'], V = out['844x390overland'], N = out.notch, col = L.cards, probs = [];
    if (!(N.card <= 20 && N.compass <= N.vw - 47 && N.journal <= N.vw - 47)) probs.push(`with a notch on the right: ${JSON.stringify(N)}`);
    const lx = Math.max(...col.map((c) => c.r));
    if (!(col.length === 3 && col.every((c) => c.l === col[0].l) && col[0].main && col.every((c, i) => !i || c.t >= col[i - 1].b))) probs.push('landscape: not a column with you on top');
    if (lx > 230 || col[0].t < L.hud.b - 0.5 || Math.max(...col.map((c) => c.b)) > L.vh) probs.push(`landscape: column ${JSON.stringify(col.map((c) => [c.l, c.t, c.r, c.b].map(Math.round)))}`);
    if (L.bar && L.bar.l < lx - 0.5) probs.push('the service bar runs under the cards');
    if (L.track && L.track.l < lx) probs.push('the tracker sits under the cards');
    if (!(V.off < 3)) probs.push(`on the Vale the hero is ${V.off.toFixed(1)} tiles off the open screen's middle`);   // (the square frames itself)
    if (!(P.cards.length === 3 && P.cards.every((c) => Math.abs(c.t - P.cards[0].t) < 1) && P.side === '0px')) probs.push('upright: not a row along the bottom');
    if (L.errs.length || P.errs.length || V.errs.length) probs.push([...L.errs, ...P.errs, ...V.errs].join(' | '));
    check('landscape: the party cards stack on the left, you on top; the service bar, tracker and hero stay right of them; a notch on the right moves the right-hand buttons off it and the cards to the edge; upright is a row as before', probs.length === 0, probs.length ? probs.join(' · ') : `column to ${Math.round(lx)} px, --party-side ${L.side}, hero ${V.off.toFixed(1)} tiles from the open middle`);
    await b.close();
  }
}
// 18. Sound (docs/sound-plan.md; the owner, 2026-10-03: "sound should start moderate, with a game menu of settings…",
// then "instead of on or off for each effect add a volume slider. Include a slider option for any background music" and
// "default foot steps should be 25% of current volume"): the first tap starts it at the moderate default; the menu's
// Sound panel has the volume and a slider each for music, ambience, attacks and spells, footsteps (at 25) and foes (each
// row a thumb's height); turning the ambience down to 0 takes at once and survives a reload; nothing errors
{
  const b = await launch(chromium, 'chromium');
  if (b) {
    const ctx = await b.newContext({ viewport: { width: 390, height: 844 } }), p = await ctx.newPage();
    const errs = []; p.on('pageerror', (e) => errs.push(e.message));
    await p.goto(`${base}/index.html?dev&notitle&scene=dungeon&site=scrag_warren`); await p.waitForFunction(() => !!globalThis.__sim && !!globalThis.__audio, null, { timeout: 60000 });
    await p.mouse.click(200, 300);
    const started = await p.waitForFunction(() => globalThis.__audio.running && globalThis.__audio.ready, null, { timeout: 15000 }).then(() => true, () => false);
    await p.click('#menuBtn'); await p.click('#title button:has-text("Sound")');
    const panel = await p.evaluate(() => ({ sliders: Object.fromEntries([...document.querySelectorAll('#title .snd input[type=range]')].map((i) => [i.getAttribute('aria-label'), +i.value])),
      boxes: document.querySelectorAll('#title .snd input[type=checkbox]').length,
      rowH: Math.min(...[...document.querySelectorAll('#title .snd label')].map((l) => l.getBoundingClientRect().height)),
      fits: [...document.querySelectorAll('#title .snd label, #title button')].every((el) => { const r = el.getBoundingClientRect(); return r.top >= 0 && r.bottom <= innerHeight; }) }));
    await p.evaluate(() => { const i = document.querySelector('#title .snd input[aria-label="Ambient sound"]'); i.value = '0'; i.dispatchEvent(new Event('input', { bubbles: true })); });
    const after = await p.evaluate(() => ({ ...globalThis.__audio.settings, shown: document.querySelector('#title .snd input[aria-label="Ambient sound"]').closest('label').textContent }));
    await p.reload(); await p.waitForFunction(() => !!globalThis.__audio, null, { timeout: 60000 });
    const kept = await p.evaluate(() => globalThis.__audio.settings);
    const S = panel.sliders;
    check('sound: the first tap starts it, moderate; Sound in the menu has a slider each (music, ambient, attacks, footsteps at 25, foes), each row ≥ 44 px, all on screen; the ambience down to 0 takes at once and stays after a reload; no page errors',
      started && panel.boxes === 0 && S.Volume === 60 && S.Music === 100 && S['Ambient sound'] === 100 && S['Attacks and spells'] === 100 && S.Footsteps === 25 && S['Foes arriving and falling'] === 100
        && panel.rowH >= 44 && panel.fits && after.ambient === 0 && /off/.test(after.shown) && kept.ambient === 0 && kept.combat === 1 && kept.steps === 0.25 && kept.music === 1 && errs.length === 0,
      JSON.stringify({ started, panel, after, kept, errs }));
    await ctx.close(); await b.close();
  }
}
// 19. Zoom (the owner, 2026-10-03 "too zoomed in" on desktop; again 2026-10-04 on a 1× screen): CSS px per native px is
// the phone's upright fit (390 / 400) on a phone either way up, and a quarter more with a mouse whatever the window or
// the screen's pixel ratio. A floor on device px per native px (1.5) had overridden the desktop cap on 1× screens.
{
  const b = await launch(chromium, 'chromium');
  if (b) {
    const cases = [
      ['desktop 568x800 @1x', { viewport: { width: 568, height: 800 }, deviceScaleFactor: 1 }, 1.22],
      ['desktop 568x800 @2x', { viewport: { width: 568, height: 800 }, deviceScaleFactor: 2 }, 1.22],
      ['desktop 1440x900 @1x', { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 }, 1.22],
      ['phone 390x844 @3x', { viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true }, 0.975],
      ['phone sideways 844x390 @3x', { viewport: { width: 844, height: 390 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true }, 0.975],
    ];
    const got = {};
    for (const [name, opts] of cases) {
      const ctx = await b.newContext(opts), p = await ctx.newPage();
      await p.goto(`${base}/index.html?dev&manual&notitle&scene=town`); await p.waitForFunction(() => !!globalThis.__renderer, null, { timeout: 60000 });
      got[name] = await p.evaluate(() => Math.round((globalThis.__renderer.view.S / Math.min(3, devicePixelRatio)) * 1000) / 1000);
      await ctx.close();
    }
    check('zoom: things are the phone\'s size on a phone either way up, a quarter larger with a mouse, at 1× and 2× alike',
      cases.every(([name, , want]) => Math.abs(got[name] - want) < 0.01), JSON.stringify(got));
    await b.close();
  }
}
// 20. Offline progress (GDD §12 v1.32; the owner, 2026-10-04): a slot saved a while ago picks the time up as play starts:
// "While you were away…" plays it through, then says what happened; the save is written at once, so a reload doesn't play it
// again. In a fight, Stop here ends it early and says so; the bus is loud again after, and the game ticks on.
{
  const b = await launch(chromium, 'chromium');
  if (b) {
    const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true }); let p = await ctx.newPage();
    const errs = []; p.on('pageerror', (e) => errs.push(e.message));
    await p.goto(`${base}/index.html?slot=3&dev&notitle`); await p.waitForFunction(() => !!globalThis.__sim && !!globalThis.__away, null, { timeout: 60000 });
    await p.evaluate(() => { const s = globalThis.__sim; s.commands.push({ type: 'createHero', cls: 'fighter', look: 'hero_knight', origin: 'thornwick_born', name: 'Away' }); for (let i = 0; i < 3; i++) s.tick(); window.dispatchEvent(new Event('pagehide')); });
    await p.waitForTimeout(400); await p.close();                      // (closing fires the autosave: its savedAt is now)
    // saved half an hour ago: set from a page of the same origin that isn't the game, so no autosave writes over it
    const q = await ctx.newPage(); await q.goto(`${base}/content/sites/barrows.json`);
    await q.evaluate(async () => { const idb = await import('/src/persist/idb.js'), v = await idb.get('slot3'), ago = Date.now() - 1800 * 1000; v.savedAt = ago; await idb.set('slot3', v);
      const k = 'emberfall.backup.slot3', bk = JSON.parse(localStorage.getItem(k) || 'null'); if (bk) { bk.savedAt = ago; localStorage.setItem(k, JSON.stringify(bk)); } });   // (and its backup)
    await q.close(); p = await ctx.newPage(); p.on('pageerror', (e) => errs.push(e.message));
    await p.goto(`${base}/index.html?slot=3&dev&notitle`);
    await p.waitForFunction(() => !!globalThis.__sim && !!globalThis.__away, null, { timeout: 60000 });
    const ran = await p.waitForSelector('#away .go', { timeout: 300000 }).then(() => true, () => false);
    const said = ran ? await p.locator('#away').innerText() : '', t1 = await p.evaluate(() => globalThis.__sim.state.t);
    if (ran) await p.locator('#away .go').tap();
    await p.waitForTimeout(600);
    const savedAt = await p.evaluate(async () => (await (await import('./src/persist/idb.js')).get('slot3')).savedAt);
    await p.evaluate(() => (window.__old = 1)); await p.reload();
    await p.waitForFunction(() => !!globalThis.__sim && !window.__old, null, { timeout: 60000 }); await p.waitForTimeout(1500);
    const again = await p.evaluate(() => document.getElementById('awayWrap').classList.contains('on'));
    check('away: a slot saved half an hour ago plays the time through as it loads, says so, saves at once, and a reload doesn\'t play it again',
      ran && /You were away 30 min/.test(said) && /In town/.test(said) && t1 >= 1790 && Date.now() - savedAt < 60000 && !again, JSON.stringify({ ran, t1, savedAge: Date.now() - savedAt, again, said: said.replace(/\n/g, ' · ') }));
    await p.evaluate(async () => { const { deleteSlot } = await import('./src/persist/save.js'); await deleteSlot(3); });
    // a fight, stopped early
    await p.goto(`${base}/index.html?dev&notitle&scene=dungeon&site=barrows`); await p.waitForFunction(() => !!globalThis.__away && !!globalThis.__renderer, null, { timeout: 60000 });
    await p.evaluate(async () => {
      const s = globalThis.__sim, P = await import('./src/sim/party.js'); s.state.created = true;
      s.state.party = [s.state.party[0], P.makeMember('c1', 'Osk', 'rogue', 6), P.makeMember('c2', 'Manic', 'cleric', 6)];
      for (const m of s.state.party) { m.level = 6; m.hp = P.statsFor(m).maxHp; m.mp = P.statsFor(m).maxMp; }
      const L = s.world.level, r = L.rooms.find((q) => q !== L.entrance && q !== L.descentRoom), pl = s.state.player; pl.x = pl.px = r.cx + 0.5; pl.y = pl.py = r.cy + 0.5;
      globalThis.__t0 = s.state.t; globalThis.__away.run(4 * 3600);
    });
    await p.waitForTimeout(2500); await p.locator('#away .stop').tap();
    await p.waitForSelector('#away .go', { timeout: 60000 });
    const f = await p.evaluate(() => ({ text: document.getElementById('away').innerText, played: globalThis.__sim.state.t - globalThis.__t0, quiet: globalThis.__sim.bus.quiet, away: globalThis.__sim.state.away }));
    await p.locator('#away .go').tap(); await p.waitForTimeout(1500);
    const ticking = await p.evaluate(() => globalThis.__sim.state.t - globalThis.__t0) > f.played;
    check('away: in a fight, waves are held and paid on the way; Stop here ends it early and says so; the bus is loud again and the game ticks on; no page errors',
      /Held \d+ waves/.test(f.text) && /You stopped it after/.test(f.text) && f.played > 60 && f.played < 4 * 3600 - 60 && !f.quiet && f.away === null && ticking && errs.length === 0,
      JSON.stringify({ played: Math.round(f.played), quiet: f.quiet, ticking, errs, text: f.text.replace(/\n/g, ' · ').slice(0, 300) }));
    await ctx.close(); await b.close();
  }
}
// 21. The way to the Mere Tower (the owner, 2026-10-05: "Its not obvious what to click on to get to the mere tower"):
// from Saltmere's boardwalk at night the ferry stage's sign is a plaque with a ›, on screen; a tap on it walks the party
// down the jetty, and at level 12 Wenna takes them out to the Tower.
{
  const b = await launch(chromium, 'chromium');
  if (b) {
    const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true }), p = await ctx.newPage();
    const errs = []; p.on('pageerror', (e) => errs.push(e.message));
    await p.goto(`${base}/index.html?dev&manual&notitle&scene=overland&region=fens&tod=night`);
    await p.waitForFunction(() => !!globalThis.__sim && !!globalThis.__frame, null, { timeout: 60000 });
    await p.evaluate(() => { const s = globalThis.__sim; s.state.created = true; s.state.party[0].level = 12; });
    for (let i = 0; i < 300; i++) { await p.evaluate(() => globalThis.__frame(1000 / 60)); if (i % 50 === 0) await p.waitForTimeout(30); }
    const at = await p.evaluate(() => { for (let y = 60; y < 800; y += 4) for (let x = 4; x < 386; x += 4) { const L = globalThis.__renderer.doorAt(x, y); if (L) return { x, y, site: L.site }; } return null; });
    if (at) await p.touchscreen.tap(at.x + 24, at.y + 2);
    let kind = 'overland';
    for (let i = 0; i < 80 && kind === 'overland'; i++) kind = await p.evaluate(() => { for (let k = 0; k < 30; k++) globalThis.__frame(1000 / 60); return globalThis.__sim.world.kind; });
    const site = await p.evaluate(() => globalThis.__sim.world.site);
    check('the Mere Tower: from Saltmere\'s boardwalk its sign is a plaque on screen; a tap walks you down the jetty and Wenna takes you out',
      !!at && at.site === 'mere_tower' && kind === 'dungeon' && site === 'mere_tower' && errs.length === 0, JSON.stringify({ at, kind, site, errs }));
    await ctx.close(); await b.close();
  }
}
// 22. The top bar (docs/hud-mockup.html; the owner, 2026-10-05: "The weather icons line can move left, making room to
// shift the mini map and buttons below up" and "account for the shrine buff text"): line 1 the place and the purse, the
// purse ending on the minimap's right edge; line 2 the sky dial and wages, line 3 (only while lit) the boons and
// Weakened, both stopping short of the minimap; the minimap 6 px under line 1, the compass and Journal 8 and 60 px
// under it, the World map's globe 22 px under the Journal, every right edge at 12 px. Checked at 360/390/430 on the Fens with six-figure gold and wages owed, with
// both boons and Weakened lit, and in a fight underground: nothing of the bar under the minimap or off screen, no tap
// pad on it, and the place name keeps its room (two boons had squeezed it to nothing).
{
  const b = await launch(chromium, 'chromium');
  if (b) {
    const bad = [], seen = []; let shot = null;
    for (const W of [360, 390, 430]) for (const [scene, lit] of [['overland', false], ['overland', true], ['dungeon', true]]) {
      const ctx = await b.newContext({ viewport: { width: W, height: 844 }, isMobile: true, hasTouch: true }), p = await ctx.newPage();
      const errs = []; p.on('pageerror', (e) => errs.push(e.message));
      await p.goto(`${base}/index.html?dev&manual&notitle&scene=${scene}${scene === 'overland' ? '&region=fens' : ''}&tod=night`); await p.waitForFunction(() => !!globalThis.__sim && !!globalThis.__frame, null, { timeout: 60000 });
      const run = (n) => p.evaluate((n) => { for (let i = 0; i < n; i++) globalThis.__frame(1000 / 30); }, n);
      await p.waitForTimeout(600); await run(5);
      await p.evaluate(({ lit, fight }) => {
        const s = globalThis.__sim, C = s.state.counters; s.state.t = 4 * 900 - 100;
        s.state.party.push({ ...s.state.party[0], id: 'tb1', name: 'Tam', main: false, rank: 'lantern', perks: [], level: 9, owed: 120 });   // wages owed
        C.gold = 123456; C.embers = 1204; s.bus.emit('countersChanged', { ...C }); s.bus.emit('partyChanged', s.state.party);
        if (lit) { s.state.party[0].weakUntil = s.state.t + 600; s.bus.emit('weakened', { on: true }); s.state.boons = { atk: s.state.t + 112, def: s.state.t + 100 }; s.bus.emit('boonsChanged', {}); }
        if (fight) { const L = s.world.level, r = L.rooms.find((q) => s.world.roomLevels.get(q.id) === 1), pl = s.state.player; pl.x = pl.px = r.cx + 0.5; pl.y = pl.py = r.cy + 0.5; }
      }, { lit, fight: scene === 'dungeon' });
      await run(60); await p.waitForTimeout(1300); await run(3);
      const r = await p.evaluate(() => {
        const R = (e) => { const q = e.getBoundingClientRect(); return { l: q.left, t: q.top, r: q.right, b: q.bottom }; }, vis = (e) => e && getComputedStyle(e).display !== 'none' && e.getBoundingClientRect().width > 0;
        const mm = globalThis.__renderer.minimapRect, place = document.querySelector('#hud .stat.place'), money = document.querySelector('#hudL1 .money');
        const texts = [...document.querySelectorAll('#hudLine2 svg, #hudLine2 span:not(#hudSky):not(#hudWage), #hudWage, #hudLine3 .chip, #hud .stat.place')].filter(vis);
        const pads = [...document.querySelectorAll('#hudSky')].filter(vis).map(R).concat([...document.querySelectorAll('#hudWage')].filter(vis).map((e) => { const q = R(e); return { l: q.l - 4, t: q.t - 14, r: q.r + 4, b: q.b + 14 }; })).concat([...document.querySelectorAll('#hudLine3 .chip')].filter(vis).map((e) => { const q = R(e); return { l: q.l - 3, t: q.t - 12, r: q.r + 3, b: q.b + 12 }; }));
        return { mm, vw: innerWidth, place: R(place), placeFull: place.scrollWidth <= place.clientWidth + 1, money: R(money), texts: texts.map(R), pads, chips: [...document.querySelectorAll('#hudLine3 .chip')].filter(vis).map((e) => e.textContent),
          compass: R(document.getElementById('compassBtn')), journal: R(document.getElementById('journalBtn')), globe: R(document.getElementById('mapBtn')), menu: R(document.getElementById('menuBtn')), l1: R(document.getElementById('hudL1')) };
      });
      const where = `${W}px ${scene}${lit ? ' lit' : ''}`, probs = [], hit = (a, q) => Math.min(a.r, q.r) - Math.max(a.l, q.l) > 0.5 && Math.min(a.b, q.b) - Math.max(a.t, q.t) > 0.5;
      if (!r.mm) probs.push('no minimap');
      else {
        if (r.texts.some((q) => hit(q, r.mm))) probs.push('bar text under the minimap');
        if (r.pads.some((q) => hit(q, r.mm))) probs.push('a tap pad over the minimap');
        if (Math.abs(r.mm.t - (r.l1.b + 6)) > 1) probs.push(`minimap at ${r.mm.t} (line 1 ends ${r.l1.b})`);
        if (Math.abs(r.money.r - r.mm.r) > 1 || Math.abs(r.compass.r - r.mm.r) > 1 || Math.abs(r.journal.r - r.mm.r) > 1) probs.push(`right edges ${r.money.r}/${r.mm.r}/${r.compass.r}/${r.journal.r}`);
        if (Math.abs(r.compass.t - (r.mm.b + 8)) > 1 || Math.abs(r.journal.t - (r.mm.b + 60)) > 1) probs.push(`buttons at ${r.compass.t}/${r.journal.t} under a minimap ending ${r.mm.b}`);
        if (Math.abs(r.globe.r - r.mm.r) > 1 || Math.abs(r.globe.t - (r.journal.b + 22)) > 1 || r.globe.r - r.globe.l < 44 || r.globe.b - r.globe.t < 44) probs.push(`the globe at ${JSON.stringify(r.globe)}, the Journal ending ${r.journal.b}`);   // (22 px under the Journal: the owner, "too close")
      }
      if (r.texts.some((q) => q.l < 0 || q.r > r.vw)) probs.push('off screen');
      if (hit(r.place, r.money)) probs.push('the place name runs into the purse');
      if (!r.placeFull && r.place.r - r.place.l < 60) probs.push(`the place name squeezed to ${(r.place.r - r.place.l).toFixed(0)} px`);   // (shortened with an ellipsis it may be, but not to nothing)
      if (lit && r.chips.length !== 3) probs.push(`chips: ${r.chips.join(', ')}`);
      if (!lit && r.chips.length) probs.push('chips with nothing lit');
      if (Math.abs(r.menu.t - r.l1.t) > 2) probs.push(`☰ at ${r.menu.t}, line 1 at ${r.l1.t}`);
      if (errs.length) probs.push(errs.join(' | '));
      if (probs.length) bad.push(`${where}: ${probs.join('; ')}`); else seen.push(where);
      if (W === 390 && lit && scene === 'overland') shot = r;
      await ctx.close();
    }
    check('top bar: line 1 the place and the purse, lines 2–3 short of the minimap; the minimap under line 1, the buttons under it, one right edge; boons and Weakened as chips, the place name kept (360/390/430, the Fens, lit, a fight)',
      bad.length === 0, bad.length ? bad.join(' · ') : `${seen.length} layouts · at 390 lit: minimap ${shot && JSON.stringify(shot.mm)}, chips ${shot && shot.chips.join(' / ')}, place ${shot && Math.round(shot.place.r - shot.place.l)} px${shot && shot.placeFull ? ' (whole)' : ' (shortened)'}`);
    await b.close();
  }
}
// 23. The World map and the Guild's coach (docs/worldmap-travel-proposal.md): with Act I done and Saltmere reached, the
// tavern's coach row opens the map on the Old Provinces; Saltmere's pin, its card, Travel → the coach card, then
// Saltmere's square, 10 gold lighter; out on the Fens the land tab's Toadking's Mound walks you there. Tap targets 44 px.
{
  const b = await launch(chromium, 'chromium');
  if (b) {
    const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true }), p = await ctx.newPage();
    const errs = []; p.on('pageerror', (e) => errs.push(e.message));
    await p.goto(`${base}/index.html?dev&manual&notitle&scene=town`); await p.waitForFunction(() => !!globalThis.__sim && !!globalThis.__frame, null, { timeout: 60000 });
    const run = (n) => p.evaluate((n) => { for (let i = 0; i < n; i++) globalThis.__frame(1000 / 30); }, n);
    await p.waitForTimeout(800); await run(30);
    await p.evaluate(() => { const s = globalThis.__sim; s.state.quests.ch1_ember_in_the_fist = { st: 3, step: 0, n: [] }; s.state.reached.add('saltmere'); s.state.counters.gold = 120; });
    await run(3);
    await p.locator('#hubBar button[data-k="tavern"]').tap(); await p.locator('#hubSheet [data-go="coach"]').tap();
    await p.waitForSelector('#mapWrap.on #worldmap .map img', { timeout: 10000 }); await p.waitForTimeout(600);
    const tabs = await p.evaluate(() => [...document.querySelectorAll('#worldmap .tabs button')].map((e) => ({ t: e.textContent, on: e.classList.contains('on'), h: e.getBoundingClientRect().height })));
    const pin = await p.evaluate(([px, py]) => { const m = document.querySelector('#worldmap .map'), r = m.getBoundingClientRect(), k = m.clientWidth / 1200; return { x: r.left + px * k, y: r.top + py * k }; }, PLACES.saltmere);
    await p.touchscreen.tap(pin.x, pin.y); await p.waitForTimeout(500);
    const cardText = await p.evaluate(() => document.querySelector('#worldmap .card.on')?.innerText || '');
    const go = await p.evaluate(() => { const q = document.querySelector('#worldmap .card .go'); const r = q.getBoundingClientRect(); return { w: r.width, h: r.height, off: q.disabled }; });
    check('world map: the tavern\'s coach row opens the Old Provinces; Saltmere\'s card offers the coach, a day and 10 gold',
      tabs[0].on && /Old Provinces/i.test(tabs[0].t) && tabs.every((t) => t.h >= 44) && /Saltmere/.test(cardText) && /a day on the road · 10 gold/.test(cardText) && go.w >= 44 && go.h >= 44 && !go.off,
      JSON.stringify({ tabs, cardText: cardText.replace(/\n/g, ' | '), go }));
    await p.locator('#worldmap .card .go').tap(); await run(3);
    const card = await p.evaluate(() => document.querySelector('#coachCard.on')?.innerText || '');
    await p.waitForTimeout(800); await run(20);
    const after = await p.evaluate(() => { const s = globalThis.__sim, h = s.world.hub, pl = s.state.player; return { where: s.world.name, gold: s.state.counters.gold, onSquare: Math.hypot(pl.x - h.x, pl.y - h.y) < h.r }; });
    check('world map: Travel → the coach card, then Saltmere\'s square, 10 gold lighter', /Thornwick to Saltmere/.test(card) && after.where === 'Saltmere' && after.gold === 110 && after.onSquare,
      JSON.stringify({ card: card.replace(/\n/g, ' | '), after }));
    await p.evaluate(() => { const s = globalThis.__sim, e = s.world.exits.find((x) => x.to === 'overland'), pl = s.state.player; pl.x = pl.px = (e.x0 + e.x1) / 2; pl.y = pl.py = (e.y0 + e.y1) / 2; });
    await run(20); await p.waitForTimeout(1200); await run(20);
    for (let i = 0; i < 60 && await p.evaluate(() => globalThis.__renderer.transiting); i++) { await run(5); await p.waitForTimeout(250); }   // (the Fens baked, on the manual clock: until then the sim holds still, and a walk can't start)
    await p.locator('#mapBtn').tap(); await p.waitForSelector('#worldmap .view.land .map img', { timeout: 10000 }); await p.waitForTimeout(600);
    const toad = await p.evaluate(async () => { const L = await (await fetch('./assets/maps/minimap-fens.json')).json(), q = L.pins.find((x) => x.id === 'toadking_mound'), m = document.querySelector('#worldmap .map'), r = m.getBoundingClientRect(), k = m.clientWidth / L.w; return { x: r.left + (q.x - L.x0) * k, y: r.top + (q.y - L.y0) * k }; });
    await p.touchscreen.tap(toad.x, toad.y); await p.waitForTimeout(300);
    const land = await p.evaluate(() => ({ title: document.querySelector('#worldmap h2').textContent, card: document.querySelector('#worldmap .card.on')?.innerText || '' }));
    await p.locator('#worldmap .card .go').tap();
    let walk = null;
    for (let i = 0; i < 20 && !(walk && walk.dest); i++) { await run(3); walk = await p.evaluate(() => { const pl = globalThis.__sim.state.player; return { dest: pl.dest && pl.dest.label, open: document.querySelector('#mapWrap').classList.contains('on') }; }); }
    check('world map: on the Fens, the land tab\'s Toadking\'s Mound (levels, floors, its boss) → Walk there walks you to it',
      land.title === 'The Greywater Fens' && /Toadking's Mound/.test(land.card) && /levels 8–11/.test(land.card) && /The Toadking/.test(land.card) && walk.dest === "Toadking's Mound" && !walk.open && errs.length === 0,
      JSON.stringify({ land: { ...land, card: land.card.replace(/\n/g, ' | ') }, walk }) + (errs.length ? ' · ' + errs.join(' | ') : ''));
    await ctx.close(); await b.close();
  }
}
srv.close();
const ok = results.length > 0 && results.every(Boolean);
console.log(ok ? 'BROWSER_OK' : 'BROWSER_FAIL');
process.exit(ok ? 0 : 1);
