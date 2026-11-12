// The Journal's side-quest order (src/ui/journal.js sideOrder; quest-lore-system §8, the owner 2026-11-12): active ones
// to hand in first, then the tracked one, then by level; done ones the last finished first.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sideOrder } from '../src/ui/storystatus.js';
import { QS } from '../src/sim/quests.js';

const lv = { a: 5, b: 1, c: 3, d: 2 };
test('active side quests: ready first, then the tracked one, then the lowest level', () => {
  const list = [['a', { st: QS.ACTIVE }], ['b', { st: QS.ACTIVE }], ['c', { st: QS.READY }], ['d', { st: QS.ACTIVE }]];
  assert.deepEqual(sideOrder(list, 'active', 'a', (id) => lv[id]).map(([id]) => id), ['c', 'a', 'b', 'd']);
  assert.deepEqual(sideOrder(list, 'active', null, (id) => lv[id]).map(([id]) => id), ['c', 'b', 'd', 'a']);
  assert.deepEqual(list.map(([id]) => id), ['a', 'b', 'c', 'd'], 'the list it was given is left as it was');
});
test('done side quests: the last finished first', () => {
  const list = [['a', { st: QS.DONE }], ['b', { st: QS.DONE }], ['c', { st: QS.DONE }]];
  assert.deepEqual(sideOrder(list, 'done', null, (id) => lv[id]).map(([id]) => id), ['c', 'b', 'a']);
});
