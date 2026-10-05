// Regions as state (M8 slice 1, sim/regions.js): the land you're in is saved; the canal road south out of the Vale is
// shut, with a word, until Act I is done; then it takes you to the Fens and back; a save from before M8 is in the Vale.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createSim } from '../src/sim/core.js';
import { QS } from '../src/sim/quests.js';
import { LANDS, landId } from '../src/sim/regions.js';
import { migrate } from '../src/persist/save.js';

const standAt = (sim, e) => { const p = sim.state.player; p.x = p.px = (e.x0 + e.x1) / 2; p.y = p.py = (e.y0 + e.y1) / 2; };
const actIDone = (sim) => { sim.state.quests.ch1_ember_in_the_fist = { st: QS.DONE, step: 0, n: [] }; };

test('two lands; anything else is the Vale', () => {
  assert.deepEqual(Object.keys(LANDS), ['vale', 'fens']);
  assert.equal(landId('fens'), 'fens'); assert.equal(landId('toString'), 'vale'); assert.equal(landId(undefined), 'vale');
});

test('the canal road is shut until Act I is done: said once, and you stay in the Vale', () => {
  const sim = createSim(20260807, undefined, { scene: 'overland' }); sim.tick();
  const e = sim.world.exits.find((x) => x.region === 'fens'), said = []; sim.bus.on('landShut', (ev) => said.push(ev));
  assert.ok(e, 'the Vale has a way to the Fens');
  assert.equal(sim.landOpen('fens'), false);
  standAt(sim, e); for (let i = 0; i < 5; i++) sim.tick();
  assert.equal(sim.state.region, 'vale'); assert.equal(sim.world.region, 'vale');
  assert.equal(said.length, 1, 'said once'); assert.equal(said[0].region, 'fens'); assert.match(said[0].line, /Sister Ilse/);
});

test('once Act I is done the road takes you to the Fens and back, arriving on the road each way', () => {
  const sim = createSim(20260807, undefined, { scene: 'overland' }); sim.tick(); actIDone(sim);
  assert.equal(sim.landOpen('fens'), true);
  standAt(sim, sim.world.exits.find((x) => x.region === 'fens')); sim.tick();
  assert.equal(sim.state.region, 'fens'); assert.equal(sim.world.kind, 'overland'); assert.equal(sim.world.name, 'The Greywater Fens');
  const p = sim.state.player, a = sim.world.arrivals.vale_road; assert.ok(Math.hypot(p.x - a.x, p.y - a.y) < 1, 'on the canal road at the Fens\' north edge');
  // into Saltmere and out again
  standAt(sim, sim.world.exits.find((x) => x.to === 'town')); sim.tick();
  assert.equal(sim.world.kind, 'town'); assert.equal(sim.world.name, 'Saltmere'); assert.equal(sim.state.region, 'fens');
  assert.deepEqual(sim.world.services.map((s) => s.kind).sort(), ['inn', 'tavern', 'temple'], 'a waystation: the tavern, the inn and the chapel');
  standAt(sim, sim.world.exits.find((x) => x.to === 'overland')); sim.tick();
  assert.equal(sim.world.kind, 'overland'); assert.equal(sim.state.region, 'fens');
  // back north to the Vale
  standAt(sim, sim.world.exits.find((x) => x.region === 'vale')); sim.tick();
  assert.equal(sim.state.region, 'vale'); assert.equal(sim.world.region, 'vale');
  const b = sim.world.arrivals.fens; assert.ok(Math.hypot(p.x - b.x, p.y - b.y) < 1, 'back on the canal road at the Vale\'s south edge');
});

test('Saltmere refuses what it has no house for: no forge, no shop', () => {
  const sim = createSim(20260807, undefined, { scene: 'town', region: 'fens' }); sim.tick();
  const why = []; sim.bus.on('refused', (e) => why.push(e.reason));
  for (const c of [{ type: 'upgrade', uid: 1 }, { type: 'buy', id: 'x' }]) { sim.commands.push(c); sim.tick(); }
  assert.deepEqual(why, ['Saltmere has no forge', 'Saltmere has no shop']);
});

// (2026-10-05, the owner: "Saltmere needs an inn for party mgt") the Stilt House: a night's rest, the bench, swaps
test('Saltmere\'s inn, the Stilt House: rest there, bench a companion and swap them back', () => {
  const sim = createSim(20260807, undefined, { scene: 'town', region: 'fens' }); sim.state.counters.gold = 1e6; sim.tick();
  const inn = sim.world.services.find((s) => s.kind === 'inn'); assert.equal(inn.name, 'The Stilt House');
  const why = []; sim.bus.on('refused', (e) => why.push(e.reason));
  for (const idx of [0, 1, 2]) { sim.commands.push({ type: 'hire', idx }); sim.tick(); }
  assert.equal(sim.state.party.length, 3); assert.equal(sim.state.bench.length, 1);
  const out = sim.state.party[1], waiting = sim.state.bench[0];
  sim.state.party[0].hp = 1; sim.commands.push({ type: 'rest' }); sim.tick(); assert.ok(sim.state.party[0].hp > 1, 'rested');
  sim.commands.push({ type: 'swap', slot: 1, id: waiting.id }); sim.tick();
  assert.equal(sim.state.party[1], waiting); assert.ok(sim.state.bench.includes(out), 'swapped at the inn');
  sim.commands.push({ type: 'dismiss', id: waiting.id }); sim.tick(); assert.ok(sim.state.bench.includes(waiting), 'benched at the inn');
  assert.deepEqual(why, []);
});

test('the land round-trips through a save, and a save from before M8 loads in the Vale', () => {
  const sim = createSim(20260807, undefined, { scene: 'town', region: 'fens' }); sim.tick();
  const snap = JSON.parse(JSON.stringify(sim.snapshot())); assert.equal(snap.region, 'fens');
  const back = createSim(1); back.restore(snap);
  assert.equal(back.state.region, 'fens'); assert.equal(back.world.name, 'Saltmere');
  const old = JSON.parse(JSON.stringify(createSim(20260807, undefined, { scene: 'town' }).snapshot())); delete old.region;
  const m = migrate({ version: 17, savedAt: 1, data: old }); assert.ok(m);
  const r = createSim(1); r.restore(m.data);
  assert.equal(r.state.region, 'vale'); assert.equal(r.world.name, 'Thornwick');
});
