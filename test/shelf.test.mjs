// The levels set aside (tools/render3d/shelf.js, world.js load): a quick run of scene changes once filed the High
// Ramparts' kept world under Wickham Keep's key, and the next trip to the Keep showed the Ramparts' houses under the
// Keep's HUD (tools/capture/rig.mjs, 2026-11-27: a restore while the Ashgate level was still building). These hold a
// mock of Luminati's swapLevel (each swap detaches whatever world is current, whenever it runs; its build takes as long
// as the test says) to the shelf's rules: one swap at a time, each level filed under its own key, nothing let go twice
// or left unreleased.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createShelf } from '../tools/render3d/shelf.js';

/** a mock game: worlds made by key, swapLevel as Luminati's (detach the current one, then build or re-attach) */
function rig(max = 2) {
  let n = 0, current = null, running = 0, overlapped = 0;
  const made = [], released = [], gates = [];
  const shelf = createShelf({ max, release: (e) => { assert.ok(!released.includes(e.world), `released twice: ${e.world.key}`); released.push(e.world); } });
  /** a load as world.js's: the swap's build waits on a gate the test opens (or opens at once) */
  const load = (key, { hold = false } = {}) => shelf.swap(key, async ({ back, keep }) => {
    running++; if (running > 1) overlapped++;
    const old = current;                                         // (Luminati's _detachLevel: whatever's current now)
    if (hold) await new Promise((r) => gates.push(r)); else await null;
    current = back ? back.world : { key, id: ++n };
    if (!back) made.push(current);
    running--;
    if (old && keep) return { world: old };                      // (swapLevel `keep`: the level left, set aside)
    if (old) released.push(old);                                 // (else Luminati releases it)
    return null;
  });
  const open = () => gates.shift()?.();
  const tick = () => new Promise((r) => setImmediate(r));
  return { shelf, load, open, tick, made, released, get current() { return current; }, get overlapped() { return overlapped; } };
}

test('each level is filed under its own key, and comes back as itself', async () => {
  const R = rig();
  for (const k of ['ramparts', 'keep', 'barrows']) await R.load(k);
  assert.deepEqual(R.shelf.keys(), ['ramparts', 'keep']);
  const r = await R.load('keep');
  assert.equal(r.back.world.key, 'keep');
  assert.equal(R.current.key, 'keep');
  assert.equal(R.shelf.current, 'keep');
});

test('a load asked for while another builds waits its turn (the rig.mjs sequence)', async () => {
  // the Ramparts; the hero walks out to Ashgate (its level building, held); the Keep asked for meanwhile; the Barrows; the Keep
  const R = rig();
  await R.load('ramparts');
  const town = R.load('ashgate', { hold: true });
  await R.tick();
  const keep = R.load('keep');                                 // (asked while Ashgate's swap is out; its own build quick)
  await R.tick();
  R.open(); await town; await keep;
  await R.load('barrows');
  const back = await R.load('keep');
  assert.equal(back.back?.world.key, 'keep', 'the Keep came back as another level\'s world');
  assert.equal(R.current.key, 'keep');
  assert.equal(R.overlapped, 0, 'the Keep\'s swap must not start while Ashgate\'s builds');
});

test('every entry on the shelf holds its own key\'s world, whatever order the builds end in', async () => {
  const R = rig(3);
  await R.load('a');
  const p = [R.load('b', { hold: true })];
  await R.tick();
  p.push(R.load('c', { hold: true }));                          // (queued behind b)
  await R.tick();
  R.open(); await R.tick(); R.open();
  await Promise.all(p);
  p.length = 0;
  for (const k of ['d', 'b', 'e', 'a']) await R.load(k);
  for (const k of R.shelf.keys()) assert.ok(R.shelf.has(k));
  // (re-attach each: it must be its own)
  for (const k of [...R.shelf.keys()]) { const r = await R.load(k); assert.equal(r.back.world.key, k); }
});

test('a load overtaken while it waited never runs', async () => {
  const R = rig();
  await R.load('a');
  const held = R.load('b', { hold: true });
  await R.tick();
  const skipped = R.load('c'), last = R.load('d');
  R.open();
  assert.deepEqual(await skipped, { ran: false, back: null });
  await held; await last;
  assert.equal(R.current.key, 'd');
  assert.ok(!R.made.some((w) => w.key === 'c'), 'c was built though d had been asked for');
});

test('the same level built twice: the older copy let go, never dropped unreleased', async () => {
  const R = rig();
  await R.load('ramparts'); await R.load('ramparts');         // (a restore to the scene already shown: built again)
  await R.load('keep'); await R.load('barrows'); await R.load('town');
  // every world made is the current one, on the shelf, or released: none lost
  assert.equal(R.made.length, R.released.length + R.shelf.size + 1, `made ${R.made.length}, released ${R.released.length}, on the shelf ${R.shelf.size}`);
});

test('a swap that fails leaves no level current, and the queue goes on', async () => {
  const shelf = createShelf({ max: 2, release: () => {} });
  await shelf.swap('a', async () => null);
  await assert.rejects(shelf.swap('b', async () => { throw new Error('no build'); }));
  assert.equal(shelf.current, '');
  assert.equal(shelf.busy, false);
  const r = await shelf.swap('c', async ({ keep }) => { assert.equal(keep, false, 'nothing current to keep'); return null; });
  assert.equal(r.ran, true);
  assert.equal(shelf.current, 'c');
});

test('world.js loads through the shelf, never filing a level itself', () => {
  const src = readFileSync(new URL('../tools/render3d/world.js', import.meta.url), 'utf8');
  const at = src.indexOf('  async load(level'), body = src.slice(at, src.indexOf('\n  },', at));
  assert.ok(at > 0 && /shelf\.swap\(key,/.test(body), 'load() goes through shelf.swap');
  assert.ok(!/aside\.set\(|curKey/.test(src), 'no aside map or curKey of its own');
  const build = readFileSync(new URL('../tools/render3d/build.mjs', import.meta.url), 'utf8');
  assert.match(build, /'shelf\.js'/, 'build.mjs stages shelf.js beside world.js');
});
