// No two in a company share a name (the owner, 2026-10-05: "Also ensure companions dont have the same name. I have 2
// Tobins"). The tavern's hirelings each have a name nobody in the company has, nor anyone earlier on the day's list;
// one already hired keeps the name they joined with; and save v24 renames a later duplicate in an older company.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createSim } from '../src/sim/core.js';
import { tavernRoster, distinctNames, dedupeNames, freeName, makeMember } from '../src/sim/party.js';
import { migrate, SAVE_VERSION } from '../src/persist/save.js';

const SEED = 20260807;
const names = (ms) => ms.map((m) => m.name);
test('a name taken goes to the next free one in its class\'s list, then any class\'s, then "the Younger"', () => {
  assert.equal(freeName('shaman', 'Tobin', new Set()), 'Tobin');
  assert.equal(freeName('shaman', 'Tobin', new Set(['Tobin'])), 'Hesk');
  assert.equal(freeName('shaman', 'Sedge', new Set(['Sedge', 'Gammer Rook'])), 'Tobin', 'round the list');
  const all = new Set(['Gammer Rook', 'Tobin', 'Hesk', 'Old Mab', 'Wilber', 'Sedge']);
  assert.ok(!all.has(freeName('shaman', 'Tobin', all)));
});

test('the tavern never offers a name the company has, nor one twice; the hired keep theirs', () => {
  for (let day = 0; day < 40; day++) {
    const list = tavernRoster(SEED, 'vale', day, 12, 3, day % 3);
    const company = [makeMember('you', 'Aldric', 'fighter'), makeMember('c1', list[4].name, 'cleric'), makeMember('c2', list[5].name, 'shaman')];
    const out = distinctNames(tavernRoster(SEED, 'vale', day, 12, 3, day % 3), company), seen = new Set(names(company));
    for (const c of out) { assert.ok(!seen.has(c.name), `day ${day}: ${c.name} twice`); seen.add(c.name); }
  }
  const sim = createSim(SEED, undefined, { scene: 'town' }); sim.state.counters.gold = 1e9;
  for (let day = 0; day < 6; day++) {                                                              // hire the whole list, day after day
    sim.state.t = day * 3600 + 10;
    for (let i = 0; i < 6; i++) { sim.commands.push({ type: 'hire', idx: i }); sim.tick(); }
    for (const m of sim.state.bench.splice(0)) void m;                                             // (room on the bench for the next day)
  }
  const all = names([...sim.state.party, ...sim.state.bench]);
  assert.equal(new Set(all).size, all.length, all.join(', '));
});

test('save v24: an older company\'s second Tobin is renamed; the first and the hero keep theirs', () => {
  const sim = createSim(SEED, undefined, { scene: 'town' }), data = JSON.parse(JSON.stringify(sim.snapshot()));
  data.party = [data.party[0], { ...makeMember('a', 'Tobin', 'shaman') }, { ...makeMember('b', 'Osk', 'rogue') }];
  data.bench = [{ ...makeMember('c', 'Tobin', 'shaman') }, { ...makeMember('d', 'Hesk', 'shaman') }];
  const m = migrate({ version: 23, savedAt: 1, data });
  assert.equal(m.version, SAVE_VERSION);
  const got = names([...m.data.party, ...m.data.bench]);
  assert.deepEqual(got.slice(0, 3), [data.party[0].name, 'Tobin', 'Osk']); assert.equal(got[4], 'Hesk');
  assert.equal(new Set(got).size, got.length, got.join(', ')); assert.ok(!['Tobin', 'Hesk'].includes(got[3]), `the second Tobin is now ${got[3]}`);
  assert.deepEqual(dedupeNames([{ name: 'X', main: true }, { name: 'X', cls: 'mage', main: false }]).map((q) => q.name)[0], 'X');
});
