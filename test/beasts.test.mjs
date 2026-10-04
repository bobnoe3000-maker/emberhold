// Farm beasts at their ease (render/beasts.js; the owner, 2026-10-04: "cows need an idle movement"): each cow keeps a
// timeline of its own, mostly standing, now and then a swish of the tail or a move of the head, never in step with
// the herd, and only ever the frames the bake made.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { beastOf, beastFrame, BEAST_FRAMES } from '../src/render/beasts.js';

test('a cow mostly stands, swishes its tail now and then, moves its head now and then; the herd out of step', () => {
  const herd = [0, 1, 2, 3].map((i) => beastOf({ id: 'cow_' + (1 + (i % 3)), x: 100 + i * 1.7, y: 130 + i * 0.9 }));
  const seen = herd.map(() => ({ '': 0, '~tl': 0, '~tr': 0, '~hd': 0 }));
  for (let ms = 0; ms < 600000; ms += 100) herd.forEach((b, i) => { const f = beastFrame(b, ms); assert.ok(BEAST_FRAMES.includes(/** @type {any} */ (f)), f); seen[i][f]++; });
  for (const c of seen) {
    const all = 6000, still = c[''] / all;
    assert.ok(still > 0.6 && still < 0.95, `standing ${(still * 100).toFixed(0)} % of the time`);
    assert.ok(c['~tl'] > 0 && c['~tr'] > 0 && c['~hd'] > 0, JSON.stringify(c));
  }
  const at = (ms) => herd.map((b) => beastFrame(b, ms)).join('|');
  let differ = 0; for (let ms = 0; ms < 60000; ms += 500) if (new Set(herd.map((b) => beastFrame(b, ms))).size > 1) differ++;
  assert.ok(differ > 20, `the herd moved out of step in ${differ} of 120 moments`);
  assert.equal(at(12345), at(12345), 'the same moment, the same frames');
});

test('every cow in the bake has its three idle frames, and they never reach the sim\'s footprints', () => {
  const env = JSON.parse(readFileSync(new URL('../assets/env/env.json', import.meta.url), 'utf8')).sprites;
  const foot = readFileSync(new URL('../src/sim/envfoot.js', import.meta.url), 'utf8');
  for (const c of ['cow_1', 'cow_2', 'cow_3']) for (const f of BEAST_FRAMES) assert.ok(env[c + f], c + f);
  assert.ok(!foot.includes('~'), 'no idle frame in envfoot.js');
});
