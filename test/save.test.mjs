// saves: v3 single saves and v4 slots migrate to v8; unknown versions are refused, never half-read
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { migrate, metaOf, SAVE_VERSION, SLOTS } from '../src/persist/save.js';
import { createSim } from '../src/sim/core.js';

test('three game slots, save v21', () => { assert.equal(SLOTS, 3); assert.equal(SAVE_VERSION, 21); });
test('a v3 save migrates with its meta; junk is refused', () => {
  const data = createSim(7).snapshot();
  const m = migrate({ version: 3, savedAt: 5, data });
  assert.equal(m.version, SAVE_VERSION); for (const v of [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]) assert.equal(migrate({ version: v, savedAt: 6, data }).version, SAVE_VERSION);
  assert.equal(m.version, SAVE_VERSION); assert.equal(m.savedAt, 5); assert.deepEqual(m.meta, metaOf(data));
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

// v20 (the owner, 2026-10-04: "Grant every player one return scroll in their inventory"): every company carries one
// Homeward Scroll. A new hero sets out with one (createHero); an older save is given one, once, as it's read.
const scrolls = (bag) => (bag || []).filter((it) => it.base === 'homeward').length;
test('a new hero sets out with one Homeward Scroll in the bag', () => {
  const sim = createSim(20260807, undefined, { scene: 'town' });
  sim.commands.push({ type: 'createHero', cls: 'fighter', look: 'hero_knight', origin: 'thornwick_born', name: 'Aldric' }); sim.tick();
  assert.equal(sim.state.created, true); assert.equal(scrolls(sim.state.bag), 1);
  const uids = sim.state.bag.map((it) => it.uid); assert.equal(new Set(uids).size, uids.length);
});
test('a v19 save is given one Homeward Scroll as it migrates, once; a v20 save is left as it is', () => {
  const sim = createSim(20260807); sim.state.created = true;
  const data = JSON.parse(JSON.stringify(sim.snapshot())), had = scrolls(data.bag), n = data.counters.uidN || 0;
  const m = migrate({ version: 19, savedAt: 1, data });
  assert.equal(scrolls(m.data.bag), had + 1); assert.equal(m.data.counters.uidN, n + 1);
  assert.equal(scrolls(migrate(m).data.bag), had + 1, 'once: v20 is current');
  const r = createSim(20260807); r.restore(m.data); assert.equal(scrolls(r.state.bag), had + 1, 'and the sim reads it');
  const full = { ...data, bag: Array.from({ length: 50 }, (_, i) => ({ base: 'sword', uid: 'x' + i, ilv: i + 1, r: 'common' })) };
  assert.equal(scrolls(migrate({ version: 19, savedAt: 1, data: full }).data.bag), 0, 'a full bag with none to stack on: left out');
});
