// saves: v3 single saves and v4 slots migrate to v5; unknown versions are refused, never half-read
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { migrate, metaOf, SAVE_VERSION, SLOTS } from '../src/persist/save.js';
import { createSim } from '../src/sim/core.js';

test('three game slots, save v5', () => { assert.equal(SLOTS, 3); assert.equal(SAVE_VERSION, 5); });
test('a v3 save migrates with its meta; junk is refused', () => {
  const data = createSim(7).snapshot();
  const m = migrate({ version: 3, savedAt: 5, data });
  assert.equal(m.version, 5); assert.equal(migrate({ version: 4, savedAt: 6, data }).version, 5);
  assert.equal(m.version, 5); assert.equal(m.savedAt, 5); assert.deepEqual(m.meta, metaOf(data));
  assert.equal(migrate({ version: 1, data }), null);
  assert.equal(migrate({ version: 99, data }), null);
  assert.equal(migrate(null), null);
});
test('a snapshot round-trips through JSON (no cycles, even mid-battle)', () => {
  const sim = createSim(20260807, undefined, { scene: 'dungeon' });
  const d = sim.destinations().find((o) => o.id === 'next-room'); sim.commands.push({ type: 'goto', ...d });
  for (let i = 0; i < 900; i++) sim.tick();
  const snap = JSON.parse(JSON.stringify(sim.snapshot()));
  const r = createSim(20260807, undefined, { scene: 'dungeon' }); r.restore(snap);
  assert.equal(r.state.party[0].level, sim.state.party[0].level);
});
