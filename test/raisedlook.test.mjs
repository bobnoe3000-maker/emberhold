// A raised companion's look (owner report: "Companions have a bright outline"). The just-raised rim fades off in
// 1.6 s; a member never raised read their time as 1 s and wore the warm rim forever.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { raisedLook } from '../src/render/fx.js';

test('a member never raised wears no rim; one just raised goes ghost, warm rim, then nothing', () => {
  assert.equal(raisedLook(undefined), null);
  assert.equal(raisedLook(0), 'ghost');
  assert.equal(raisedLook(0.2), 'ghost');
  const a = raisedLook(0.5), b = raisedLook(1.4);
  assert.ok(typeof a === 'number' && typeof b === 'number' && a > b && b > 0, 'the rim fades');
  assert.equal(raisedLook(1.6), null);
  assert.equal(raisedLook(60), null);
});

test('the renderer asks raisedLook with undefined for one never raised (not a made-up time)', () => {
  const src = readFileSync('src/render/renderer.js', 'utf8');
  assert.match(src, /raisedLook\(up === undefined \? undefined :/);
});
