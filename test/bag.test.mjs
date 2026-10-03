// The party bag: identical plain items stack in one slot (up to STACK_MAX), so the bag's 50 slots
// hold more; items with affixes, a Rare modifier or flavour never stack. The save keeps every item.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createSim } from '../src/sim/core.js';
import { makeItem } from '../src/sim/items.js';
import { BAG_SIZE, STACK_MAX, bagStacks } from '../src/sim/loot.js';

const town = () => createSim(20260807, undefined, { scene: 'town' });
const plain = (base, i, ilv = 2) => makeItem(base, ilv, 'common', { uid: `${base}${i}` });

test('identical commons share a slot, up to STACK_MAX; different ones do not', () => {
  const bag = [...Array.from({ length: STACK_MAX + 2 }, (_, i) => plain('sword', i)), plain('dagger', 0), plain('sword', 99, 3)];
  const st = bagStacks(bag);
  assert.deepEqual(st.map((s) => s.length), [STACK_MAX, 2, 1, 1]);   // a full stack, its overflow, another base, another item level
});
test('affixes, a Rare modifier or flavour keep an item on its own', () => {
  const fine = (i) => makeItem('sword', 2, 'fine', { uid: 'f' + i, aff: [['crit', 2]], name: 'Tempered Sword', flav: 'x' });
  assert.equal(bagStacks([fine(1), fine(2), plain('sword', 1), plain('sword', 2)]).length, 3);
});
test('"Battered", not "Worn": low-level common metal no longer reads as equipped', () => {
  assert.equal(plain('sword', 0, 1).name, 'Battered Sword');
});
test('a bag full of slots still takes an item that stacks, and refuses one that would need a slot', () => {
  const sim = town(), hero = sim.state.party[0], refused = []; sim.bus.on('gearRefused', (r) => refused.push(r.reason));
  const worn = hero.gear.weapon;                                         // what the hero holds: stacks with a copy of itself
  sim.state.bag = [makeItem(worn.base, worn.ilv, 'common', { uid: 'copy' }), ...Array.from({ length: BAG_SIZE - 1 }, (_, i) => makeItem('ring', 1, 'fine', { uid: 'r' + i, aff: [['atk', 1]] }))];
  assert.equal(bagStacks(sim.state.bag).length, BAG_SIZE);
  sim.commands.push({ type: 'unequip', member: hero.id, slot: 'weapon' }); sim.tick();
  assert.equal(hero.gear.weapon, null, 'the sword went onto its twin in the full bag');
  assert.equal(bagStacks(sim.state.bag).length, BAG_SIZE);
  sim.commands.push({ type: 'unequip', member: hero.id, slot: 'armor' }); sim.tick();
  assert.ok(hero.gear.armor, 'plate needs a slot of its own: refused');
  assert.deepEqual(refused, ['The bag is full']);
});
test('stacks survive a save: every item comes back', () => {
  const sim = town(); sim.state.bag = Array.from({ length: 5 }, (_, i) => plain('sword', i));
  const b = createSim(20260807, undefined, { scene: 'town' }); b.restore(JSON.parse(JSON.stringify(sim.snapshot())));
  assert.equal(b.state.bag.length, 5); assert.equal(bagStacks(b.state.bag).length, 1);
});
