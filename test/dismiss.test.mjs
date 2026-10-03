// Dismiss for good (the owner, 2026-10-03): a sellsword on the bench can be let go, in town. Their wage stops (the
// bench drew half), what they're owed is written off, and their gear above Common (Fine, Rare, heirloom) goes into the
// party bag; Commons go with them. Refused, keeping everything, when the bag can't take it. The bag holds 50.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createSim } from '../src/sim/core.js';
import { makeItem } from '../src/sim/items.js';
import { BAG_SIZE, bagStacks } from '../src/sim/loot.js';
import { wageOf } from '../src/sim/companions.js';
import { hire } from './fixtures/hire.mjs';

const SEED = 20260807;
function benched() {
  const sim = createSim(SEED, undefined, { scene: 'town' }); sim.tick();
  hire(sim, [0, 1, 2]);                                              // two in the party, the third waits on the bench
  const b = sim.state.bench[0]; assert.ok(b, 'someone on the bench');
  b.gear.weapon = makeItem(b.gear.weapon.base, 5, 'fine', { uid: 'keepF', aff: [['atk', 2]] });
  b.gear.trinket = makeItem('ring', 5, 'rare', { uid: 'keepR', aff: [['atk', 2], ['crit', 1]], mod: { ab: 'Cleave', k: 'power', v: 0.15 } });
  b.owed = 40;
  return { sim, b };
}
const ev = (sim, k) => { const out = []; sim.bus.on(k, (e) => out.push(e)); return out; };

test('the bag holds 50', () => assert.equal(BAG_SIZE, 50));

test('dismissed for good: gone from the bench, the wage and the debt with them, Fine and better gear into the bag', () => {
  const { sim, b } = benched(), commons = Object.values(b.gear).filter((it) => it && it.r === 'common').map((it) => it.uid);
  const half = wageOf(b, true); assert.ok(half > 0, 'the bench drew a wage');
  const rel = ev(sim, 'released');
  sim.commands.push({ type: 'release', id: b.id }); sim.tick();
  assert.equal(sim.state.bench.length, 0);
  assert.ok(!sim.state.party.some((m) => m.id === b.id));
  assert.equal(sim.heroes.owed(), 0, 'nothing owed to anyone now');
  const uids = sim.state.bag.map((it) => it.uid);
  assert.ok(uids.includes('keepF') && uids.includes('keepR'), 'the Fine and the Rare are in the bag');
  for (const u of commons) assert.ok(!uids.includes(u), 'the Commons went with them');
  assert.deepEqual(rel[0].items.sort(), ['keepF', 'keepR']);
});

test('refused when the bag has no room for their gear, and nothing moves; let go once there is', () => {
  const { sim, b } = benched(), ref = ev(sim, 'refused');
  sim.state.bag = Array.from({ length: BAG_SIZE - 1 }, (_, i) => makeItem('ring', 1, 'fine', { uid: 'f' + i, aff: [['atk', 1 + (i % 9)]] }));
  assert.equal(bagStacks(sim.state.bag).length, BAG_SIZE - 1);
  sim.commands.push({ type: 'release', id: b.id }); sim.tick();
  assert.equal(sim.state.bench.length, 1, 'still there'); assert.match(ref.at(-1).reason, /No room in the bag/);
  assert.equal(b.gear.weapon.uid, 'keepF', 'their gear untouched');
  sim.state.bag.pop(); sim.state.bag.pop();                          // room for two
  sim.commands.push({ type: 'release', id: b.id }); sim.tick();
  assert.equal(sim.state.bench.length, 0);
});
