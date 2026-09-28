// run.mjs — `npm run test:browser`: browser tests over a local static server.
//   1. replay parity: the scripted session's end-state hash in Chromium and WebKit equals Node's
//      (the sim must be bit-identical on V8 and JavaScriptCore — AGENTS.md rule 1, dev plan §2.13)
//   2. game slots (Chromium): v3 save → slot 1, new game in slot 2 with its own seed,
//      persistence, switching back, deleting
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
    const ready = async () => { await p.waitForFunction(() => !!globalThis.__sim && !window.__old, null, { timeout: 60000 }); await p.waitForTimeout(500); };
    const reloadVia = async (fn) => { await p.evaluate(() => (window.__old = 1)); await fn(); await ready(); };
    await p.goto(game + '?scene=town&dev'); await ready();            // a preview page never autosaves: seed a v3 player's save
    await p.evaluate(() => { const s = globalThis.__sim.snapshot(); s.party[0].name = 'Legacy'; s.counters.gold = 123; localStorage.clear();
      localStorage.setItem('emberhold.save', JSON.stringify({ version: 3, savedAt: Date.now(), data: s })); });
    await p.goto(game + '?dev'); await ready();
    const m1 = await p.evaluate(() => ({ name: globalThis.__sim.state.party[0].name, gold: globalThis.__sim.state.counters.gold, seed: globalThis.__sim.seed }));
    check('slots: v3 save migrates into slot 1', m1.name === 'Legacy' && m1.gold === 123);
    await p.tap('#menuBtn'); await p.waitForTimeout(300);
    await reloadVia(() => p.locator('.slot.empty button').first().tap());
    const s2 = await p.evaluate(() => ({ seed: globalThis.__sim.seed, gold: globalThis.__sim.state.counters.gold }));
    check('slots: slot 2 is a new game with its own seed', s2.seed !== m1.seed && s2.gold === 0);
    await p.evaluate(() => { globalThis.__sim.state.counters.gold = 77; window.dispatchEvent(new Event('pagehide')); });
    await p.waitForTimeout(200); await reloadVia(() => p.reload());
    check('slots: slot 2 progress persists', (await p.evaluate(() => globalThis.__sim.state.counters.gold)) === 77);
    await p.tap('#menuBtn'); await p.waitForTimeout(300);
    await reloadVia(() => p.locator('.slot button.pri').first().tap());
    const back = await p.evaluate(() => ({ name: globalThis.__sim.state.party[0].name, gold: globalThis.__sim.state.counters.gold }));
    check('slots: slot 1 intact after switching', back.name === 'Legacy' && back.gold === 123);
    await p.tap('#menuBtn'); await p.waitForTimeout(300);
    await p.locator('.slot button.del').first().tap(); await p.locator('.slot button.del').first().tap(); await p.waitForTimeout(400);
    check('slots: slot 2 deleted', (await p.locator('.slot.empty').count()) === 2);
    check('slots: no page errors', errs.length === 0, errs.join(' | '));
    await b.close();
  }
}
srv.close();
const ok = results.length > 0 && results.every(Boolean);
console.log(ok ? 'BROWSER_OK' : 'BROWSER_FAIL');
process.exit(ok ? 0 : 1);
