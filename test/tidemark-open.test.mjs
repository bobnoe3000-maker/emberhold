// The Tidemark opens (GDD v1.150; docs/tidemark-plan.md, steps 1 and 2): a land once Act III is done (Quota), reached by
// the Reach's Solmere road through Solmere's crossroads (regions.js SOLMERE), its overland the east coast: Brine Cross on
// the Brine, Highmarch walled to the north-west, Tollhaven's sea gate (its east one) round its south wall on the coast road, its harbour north-east,
// Gullwick on the sand; Tollhaven a town with the five services and a coach stop. The Heights move to Act IV's end, kept
// by a company that has stood in Frosthold.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createSim } from '../src/sim/core.js';
import { QS } from '../src/sim/quests.js';
import { LANDS, SOLMERE } from '../src/sim/regions.js';
import { days, townOf, COACH } from '../src/sim/coach.js';
import { isWalkable } from '../src/sim/world.js';
import { createOutdoor, TIDEMARK, TOLL_GATE, oMaterialAt } from '../src/sim/outdoor.js';

const standIn = (sim, e) => { const p = sim.state.player; p.x = p.px = (e.x0 + e.x1) / 2; p.y = p.py = (e.y0 + e.y1) / 2; };
const done = (sim, ...ids) => { for (const id of ids) sim.state.quests[id] = { st: QS.DONE, step: 0, n: [] }; };

test('the Tidemark: shut until Act III is done, then through Solmere from the Reach and back; Tollhaven on the coach', () => {
  assert.equal(LANDS.tidemark.opens, 'ch3_quota'); assert.equal(LANDS.tidemark.town, 'Tollhaven');
  assert.deepEqual(SOLMERE.map((r) => r.land), ['reach', 'tidemark', 'heights']);
  const sim = createSim(13, undefined, { scene: 'overland', region: 'reach' }); sim.tick(); done(sim, 'ch2_the_last_office');
  const asked = []; sim.bus.on('crossroads', (e) => asked.push(e));
  const east = sim.world.exits.find((e) => e.to === 'solmere');
  sim.commands.push({ type: 'solmere', land: 'tidemark' }); sim.tick();
  assert.equal(sim.state.region, 'reach', 'not standing in the road: refused');
  done(sim, 'ch3_quota'); standIn(sim, east); for (let i = 0; i < 5; i++) sim.tick();
  assert.equal(asked.length, 1); assert.deepEqual(asked[0].lands.map((l) => l.land), ['tidemark'], 'the Heights wait for Act IV');
  sim.commands.push({ type: 'solmere', land: 'heights' }); sim.tick(); assert.equal(sim.state.region, 'reach', 'a shut land: refused');
  sim.commands.push({ type: 'solmere', land: 'reach' }); sim.tick(); assert.equal(sim.state.region, 'reach', 'the land you\'re in: refused');
  sim.commands.push({ type: 'solmere', land: 'tidemark' }); sim.tick();
  assert.equal(sim.state.region, 'tidemark'); assert.equal(sim.world.name, 'The Tidemark');
  const p = sim.state.player; assert.ok(isWalkable(sim.world, p.x, p.y), 'in on the imperial road'); assert.ok(p.x < 12, 'at the land\'s west edge');
  const back = sim.world.exits.find((e) => e.to === 'solmere'); standIn(sim, back); for (let i = 0; i < 5; i++) sim.tick();
  assert.deepEqual(asked[1].lands.map((l) => l.land), ['reach']);
  sim.commands.push({ type: 'solmere', land: 'reach' }); sim.tick(); assert.equal(sim.state.region, 'reach');
  assert.equal(COACH.tollhaven.land, 'tidemark'); assert.equal(townOf('tidemark'), 'tollhaven'); assert.equal(days('ashgate', 'tollhaven'), 3); assert.equal(days('thornwick', 'tollhaven'), 5);
});

test('the Heights open at Act IV\'s end, and stay open to a company that has stood in Frosthold', () => {
  const sim = createSim(4, undefined, { scene: 'overland', region: 'reach' }); sim.tick(); done(sim, 'ch2_the_last_office', 'ch3_quota');
  assert.ok(sim.landOpen('tidemark')); assert.ok(!sim.landOpen('heights'));
  sim.state.reached.add('frosthold'); assert.ok(sim.landOpen('heights'), 'kept');
  const b = createSim(4, undefined, { scene: 'overland', region: 'reach' }); b.tick(); done(b, 'ch2_the_last_office', 'ch3_quota', 'ch4_seventh_voice');
  assert.ok(b.landOpen('heights'), 'Act IV done');
});

test('the overland: the places on open ground, the sea and its sand, the town gate into Tollhaven and out again', () => {
  const o = createOutdoor(7, 'overland', 'tidemark');
  for (const [k, a] of Object.entries(o.arrivals)) assert.ok(isWalkable(o, a.x, a.y), `${k} on open ground`);
  assert.equal(oMaterialAt(o, 250, 200), 'pool', 'the sea off the east coast'); assert.ok(!isWalkable(o, 250, 200));
  assert.equal(oMaterialAt(o, 246, 148), 'grass', 'the Lamp Fort\'s headland, dry');
  let sand = 0; for (let y = 60; y < 220; y += 4) if (oMaterialAt(o, 226, y) === 'sand' || oMaterialAt(o, 224, y) === 'sand') sand++;
  assert.ok(sand > 20, `a beach along the east coast (${sand})`);
  const sim = createSim(7, undefined, { scene: 'overland', region: 'tidemark' }); sim.tick();
  // the gate is the east one, as the town's own (the owner, 2026-11-28: "The overworld entrance to tollhaven is on the
  // wrong side"): in at the sea gate, and out of the town's east gate onto the beach east of the walls
  const gate = sim.world.exits.find((e) => e.to === 'town'); assert.ok(gate.x1 < TOLL_GATE[0] && gate.x0 > TOLL_GATE[0] - 10, 'inside the east gate');
  assert.ok(o.arrivals.tollhaven.x > TOLL_GATE[0], 'out on the beach east of the walls');
  // the gate reached on foot from the junction (the coast road round the south wall)
  { const seen = new Set(), q = [[Math.floor(o.arrivals.tollhaven.x), Math.floor(o.arrivals.tollhaven.y)]]; let found = false;
    while (q.length && !found) { const [x, y] = q.shift(); const k = x * 1000 + y; if (seen.has(k) || !isWalkable(o, x + 0.5, y + 0.5)) continue; seen.add(k);
      if (Math.abs(x - TIDEMARK.join[0]) < 3 && Math.abs(y - TIDEMARK.join[1]) < 3) found = true; else q.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]); }
    assert.ok(found, 'a way on foot from the gate to the junction'); }
  standIn(sim, gate); for (let i = 0; i < 5; i++) sim.tick();
  assert.equal(sim.world.kind, 'town'); assert.equal(sim.world.name, 'Tollhaven'); assert.ok(sim.state.reached.has('tollhaven'));
  assert.deepEqual(sim.world.services.map((s) => s.name).sort(), ['The Bonded Stores', 'The Chain Locker', 'The Paid Toll', 'The Quay Chapel', 'The Quay Forge']);
  assert.ok(sim.world.pools.some((q) => q.sea), 'the harbour outside the walls');
  const out = sim.world.exits.find((e) => e.to === 'overland'); standIn(sim, out); for (let i = 0; i < 5; i++) sim.tick();
  assert.equal(sim.world.kind, 'overland'); assert.equal(sim.state.region, 'tidemark'); assert.ok(isWalkable(sim.world, sim.state.player.x, sim.state.player.y));
});

test('a save in Tollhaven comes back in Tollhaven', () => {
  const sim = createSim(9, undefined, { scene: 'town', region: 'tidemark' }); sim.tick(); done(sim, 'ch2_the_last_office', 'ch3_quota');
  const snap = JSON.parse(JSON.stringify(sim.snapshot())), back = createSim(9, undefined, { scene: 'town' }); back.restore(snap); back.tick();
  assert.equal(back.state.region, 'tidemark'); assert.equal(back.world.name, 'Tollhaven');
});
