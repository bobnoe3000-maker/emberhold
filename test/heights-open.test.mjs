// The Pale Heights open (GDD v1.148; the owner: "Open the Heights so we can fight him in play"): a land once Act III is
// done (Quota), the Solmere road east out of the Reach and up the Sol to the Frozen Hospice and home again, Frosthold on
// the coach, the Heights' four spawn points (the First Pilgrim's at the Lip among them), the XP table to 75, and the
// Developer panel's levels to 75 and its Open every land.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createSim } from '../src/sim/core.js';
import { QS } from '../src/sim/quests.js';
import { LANDS } from '../src/sim/regions.js';
import { CAMPS } from '../src/sim/camps.js';
import { days, townOf, COACH } from '../src/sim/coach.js';
import { xpToNext } from '../src/sim/party.js';
import { DEV_LEVEL_MAX, DEV_LANDS } from '../src/sim/dev.js';
import { isWalkable } from '../src/sim/world.js';

const standIn = (sim, e) => { const p = sim.state.player; p.x = p.px = (e.x0 + e.x1) / 2; p.y = p.py = (e.y0 + e.y1) / 2; };
const actIIIDone = (sim) => { for (const id of ['ch2_the_last_office', 'ch3_quota']) sim.state.quests[id] = { st: QS.DONE, step: 0, n: [] }; };

test('the Solmere road: shut until Act III is done, then east to the Heights and home again; Frosthold on the coach', () => {
  assert.equal(LANDS.heights.opens, 'ch3_quota'); assert.equal(LANDS.heights.town, 'Frosthold');
  const sim = createSim(11, undefined, { scene: 'overland', region: 'reach' }); sim.tick();
  sim.state.quests.ch2_the_last_office = { st: QS.DONE, step: 0, n: [] };
  const said = []; sim.bus.on('landShut', (e) => said.push(e));
  const east = sim.world.exits.find((e) => e.region === 'heights');
  standIn(sim, east); for (let i = 0; i < 5; i++) sim.tick();
  assert.equal(sim.state.region, 'reach', 'you stay'); assert.equal(said.length, 1); assert.match(said[0].line, /Solmere road/);
  actIIIDone(sim); standIn(sim, east); for (let i = 0; i < 5; i++) sim.tick();
  assert.equal(sim.state.region, 'heights'); assert.equal(sim.world.name, 'The Pale Heights');
  assert.ok(isWalkable(sim.world, sim.state.player.x, sim.state.player.y), 'you arrive on open ground, on the Sol road');
  const home = sim.world.exits.find((e) => e.region === 'reach' && !e.closed);
  standIn(sim, home); for (let i = 0; i < 5; i++) sim.tick();
  assert.equal(sim.state.region, 'reach'); assert.ok(isWalkable(sim.world, sim.state.player.x, sim.state.player.y), 'back on the Reach\'s east edge');
  assert.ok(Math.abs(sim.state.player.x - sim.world.arrivals.heights.x) < 2);
  assert.equal(COACH.frosthold.land, 'heights'); assert.equal(townOf('heights'), 'frosthold'); assert.equal(days('ashgate', 'frosthold'), 3);
});

test('a save on the Heights comes back on the Heights', () => {
  const sim = createSim(9, undefined, { scene: 'overland', region: 'heights' }); sim.tick(); actIIIDone(sim);
  const snap = JSON.parse(JSON.stringify(sim.snapshot())), back = createSim(9, undefined, { scene: 'town' }); back.restore(snap); back.tick();
  assert.equal(back.state.region, 'heights'); assert.equal(back.world.name, 'The Pale Heights');
});

test('the Heights\' four spawn points: levels in its band, each on open ground, no two arenas overlapping', () => {
  const H = CAMPS.filter((c) => c.region === 'heights'), sim = createSim(3, undefined, { scene: 'overland', region: 'heights' });
  assert.deepEqual(H.map((c) => c.id), ['heights_cracks', 'heights_praetory', 'heights_glass', 'heights_lip']);
  for (const c of H) {
    assert.ok(c.level >= 61 && c.level <= 75, `${c.id} at ${c.level}`);
    let o = 0, a = 0;
    for (let dy = -c.reach; dy <= c.reach; dy++) for (let dx = -c.reach; dx <= c.reach; dx++) { if (dx * dx + dy * dy > c.reach * c.reach) continue; a++; if (isWalkable(sim.world, c.x + dx + 0.5, c.y + dy + 0.5)) o++; }
    assert.ok(o / a > 0.75, `${c.id}: ${Math.round((o / a) * 100)} % open`);
    for (const d of H) if (d !== c) assert.ok(Math.hypot(c.x - d.x, c.y - d.y) >= c.arena + d.arena, `${c.id} and ${d.id} apart`);
  }
});

test('the XP table runs to 75, the levels under 61 as they were; the Developer panel levels to 75', () => {
  assert.equal(xpToNext(60), 649000000, 'level 60 costs what it did');
  assert.ok(xpToNext(61) > xpToNext(60) && xpToNext(75) > xpToNext(74), 'each level of the Heights costs more than the last');
  assert.equal(xpToNext(80), xpToNext(75)); assert.equal(DEV_LEVEL_MAX, 75);
});

test('Open every land (the Developer panel): every road open at once on a new slot, the slot a dev game', () => {
  const sim = createSim(5, undefined, { scene: 'overland', region: 'reach' }); sim.tick();
  assert.ok(!sim.landOpen('heights'));
  sim.commands.push({ type: 'devOpenLands' }); sim.tick();
  assert.ok(!sim.landOpen('heights'), 'no hero yet: refused');
  sim.state.created = true; sim.commands.push({ type: 'devOpenLands' }); sim.tick();
  assert.ok(sim.state.flags[DEV_LANDS] && sim.state.dev, 'flagged, a dev game');
  for (const r of Object.keys(LANDS)) assert.ok(sim.landOpen(r), r);
  const east = sim.world.exits.find((e) => e.region === 'heights'); standIn(sim, east); for (let i = 0; i < 5; i++) sim.tick();
  assert.equal(sim.state.region, 'heights', 'the Solmere road walked');
});
