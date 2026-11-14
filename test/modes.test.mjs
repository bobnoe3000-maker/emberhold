// The kinds of play's rules in one table (src/sim/modes.js, docs/shared-play-rules.md §6, §9): every row whole, the
// right row for the fight going on, and the owner's decisions (§8) written into it.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { MODES, BOUT, modeOf, modeOfWorld } from '../src/sim/modes.js';
import { BOUT as BATTLE_BOUT } from '../src/sim/battle.js';
import { RAID } from '../src/sim/raid.js';

test('every row has every field, and a row is read-only', () => {
  const keys = Object.keys(MODES.slot).sort();
  for (const [k, M] of Object.entries(MODES)) { assert.deepEqual(Object.keys(M).sort(), keys, k); assert.equal(M.kind, k); assert.ok(Object.isFrozen(M), `${k} frozen`); }
});
test('the fight going on picks its row: a bout, a raid (between rooms too), the Tower, a spawn point, else the slot', () => {
  assert.equal(modeOf(null, null), MODES.slot);
  assert.equal(modeOf({ camp: {} }, null), MODES.camp);
  assert.equal(modeOf({ tower: true }, null), MODES.tower);
  assert.equal(modeOf({ bout: {} }, null), MODES.bout);
  assert.equal(modeOf(null, { site: 'barrows' }), MODES.raid, 'a raid between rooms');
  assert.equal(modeOf({ room: 3 }, { site: 'barrows' }), MODES.raid);
  assert.equal(modeOfWorld({ raid: true }), MODES.raid); assert.equal(modeOfWorld({}), MODES.slot); assert.equal(modeOfWorld(null), MODES.slot);
});
test('a raid: not the story\'s nor the count\'s (decision 3), no cost to a wipe, nobody Fallen, the boss home, its own waves, tide and pay', () => {
  const R = MODES.raid;
  assert.equal(R.story, false); assert.equal(R.count, false); assert.equal(R.death, 'none'); assert.equal(R.fallen, false); assert.equal(R.bossHome, true);
  assert.equal(R.loot, 'raid');
  for (const k of ['waves', 'tide', 'xp', 'gold']) assert.deepEqual(RAID[k], R[k], `raid.js RAID.${k} is the row's`);
});
test('the slot\'s own play has everything on; the Bowl\'s bout reads BOUT as it stands (the harness tunes it)', () => {
  const S = MODES.slot; assert.ok(S.story && S.count && S.fallen && S.boon); assert.equal(S.death, 'wipe'); assert.equal(S.xp, 1); assert.equal(S.tide, null);
  assert.equal(MODES.tower.death, 'satchel');
  assert.equal(BATTLE_BOUT, BOUT, 'battle.js re-exports the one BOUT');
  const was = BOUT.heal; BOUT.heal = 0.6; try { assert.equal(MODES.bout.heal, 0.6); } finally { BOUT.heal = was; }
  assert.equal(MODES.bout.fallen, false); assert.equal(MODES.bout.boon, false); assert.equal(MODES.bout.dmg, BOUT.dmg);
});
