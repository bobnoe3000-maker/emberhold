// A phone held sideways keeps the safe-area inset only on the notch's side (ui/safearea.js; the owner, 2026-10-03:
// the party cards stood a thumb's width off the left edge, and the minimap ran under a notch on the right).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { notchSide, safeVars } from '../src/ui/safearea.js';

test('the notch is on the side the top of the phone turned to; the other side drops the inset', () => {
  assert.equal(notchSide(90), 'left'); assert.equal(notchSide(-90), 'right'); assert.equal(notchSide(270), 'right');
  for (const a of [0, 180, null, undefined]) assert.equal(notchSide(a), '');
  assert.deepEqual(safeVars('right'), { l: '0px', r: 'env(safe-area-inset-right, 0px)' });
  assert.deepEqual(safeVars('left'), { l: 'env(safe-area-inset-left, 0px)', r: '0px' });
  assert.deepEqual(safeVars(''), { l: 'env(safe-area-inset-left, 0px)', r: 'env(safe-area-inset-right, 0px)' });   // not known: keep both
});
