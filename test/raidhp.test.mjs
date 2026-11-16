// A raid's foes carry twice the HP (GDD §18 v1.108), easing from 15 up (v1.128, the owner: "yes ease raid foe HP from 15
// up"): 0.1 a foe level past 14, never under ×1.2. Nothing else carries it: a slot's foes are as they were.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { MODES, foeHpOf } from '../src/sim/modes.js';

test('raid foes: ×2 to 14, then 0.1 less a level to ×1.2 from 22; every other mode ×1', () => {
  const R = MODES.raid, at = (lv) => Math.round(foeHpOf(R, lv) * 100) / 100;
  assert.deepEqual([1, 6, 14].map(at), [2, 2, 2]);
  assert.deepEqual([15, 17, 18, 21, 22, 30, 60].map(at), [1.9, 1.7, 1.6, 1.3, 1.2, 1.2, 1.2]);
  for (const k of Object.keys(MODES)) if (k !== 'raid') for (const lv of [1, 15, 30]) assert.equal(foeHpOf(MODES[k], lv), MODES[k].foeHp, `${k} ${lv}`);
});
