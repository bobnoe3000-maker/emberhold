// detmath: accurate to far below anything the game can see, and exact at the edges
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sin, cos, atan2, exp, hypot } from '../src/sim/detmath.js';

test('sin / cos / atan2 / exp / hypot track Math within 1e-10', () => {
  for (let i = 0; i < 20000; i++) {
    const x = (i / 20000 - 0.5) * 40, y = ((i * 7919) % 20000) / 1000 - 10;
    assert.ok(Math.abs(sin(x) - Math.sin(x)) < 1e-10);
    assert.ok(Math.abs(cos(x) - Math.cos(x)) < 1e-10);
    assert.ok(Math.abs(atan2(y, x) - Math.atan2(y, x)) < 1e-10);
    assert.ok(Math.abs(hypot(x, y) - Math.hypot(x, y)) < 1e-10);
    const z = (i / 20000 - 0.5) * 20; assert.ok(Math.abs(exp(z) / Math.exp(z) - 1) < 1e-12);
  }
});
test('edge cases', () => {
  assert.equal(atan2(0, 0), 0);
  assert.equal(atan2(0, -1), Math.PI);
  assert.equal(atan2(1, 0), Math.PI / 2);
  assert.equal(exp(0), 1);
  assert.equal(sin(0), 0);
});
