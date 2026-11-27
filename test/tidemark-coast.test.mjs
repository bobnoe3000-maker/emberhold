// The Tidemark's coast (docs/dungeon-looks-plan.md item 7, docs/strand-dungeon.md): the coast floors' kits, the Lamp
// Fort up from the sea with Gannet still at its way in, the overland's shore pieces where they may stand, and the
// converter laying a coast floor out with the sea round it.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { PLANS, checkPlan } from '../src/sim/plans.js';
import { createOutdoor, oIsWalkable } from '../src/sim/outdoor.js';
import { createWorld } from '../src/sim/world.js';
import { campsOf } from '../src/sim/camps.js';
import { NPCS } from '../src/sim/npcs.js';
import { convertWorld } from '../src/render3d/convert.js';

test('the coast floors: the Lamp Fort from its water gate through its sea cave to its walk and lamp room, Gannet at the way in', () => {
  const P = PLANS.lamp_fort, f = P.floors[0];
  assert.deepEqual(checkPlan(P), []);
  assert.deepEqual(f.spaces.map((s) => [s.id, s.role, s.kit]), [['the_fort_gate', 'entrance', 'docks'], ['the_sea_cave', 'room', 'seacave'], ['the_magazine', 'offshoot', 'seacave'],
    ['the_curtain_walk', 'room', 'fortwall'], ['the_lamp_room', 'end', 'fortwall']]);
  assert.deepEqual(NPCS.old_gannet.found, { site: 'lamp_fort', depth: 0, entrance: true });
  assert.ok(f.spaces.find((s) => s.role === 'end').dress.includes('lamp_stand'), 'the lamp in its room');
  assert.deepEqual(PLANS.sisters_cabin.floors[0].spaces.map((s) => s.kit), ['strand', 'hulk', 'hulk', 'hulk', 'hulk']);
});

test('the shore on the overland: each piece on open sand, its tiles held, clear of the spawn points and the ways in', () => {
  const o = createOutdoor(20260807, 'overland', 'tidemark');
  assert.ok(o.shore.filter((s) => s.kind === 'hut').length >= 3 && o.shore.some((s) => s.kind === 'boat') && o.shore.some((s) => s.kind === 'nets'));
  for (const s of o.shore) {
    assert.equal(oIsWalkable(o, s.x, s.y - 0.5), false, `${s.kind} at ${s.x},${s.y} holds its ground`);
    for (const c of campsOf('tidemark')) assert.ok(Math.hypot(s.x - c.x, s.y - c.y) > c.arena, `${s.kind} clear of ${c.id}`);
    for (const e of o.exits) assert.ok(Math.hypot(s.x - (e.x0 + e.x1) / 2, s.y - (e.y0 + e.y1) / 2) > 8, `${s.kind} clear of a way in`);
  }
  assert.deepEqual(createOutdoor(20260807, 'overland', 'tidemark').shore, o.shore, 'the same every time');
});

test('a coast floor converts with the sea round it, its strand and its sea cave in their own ground', () => {
  const r = convertWorld(createWorld(20260807, null, 0, 'gull_isles'), { region: 'tidemark' });
  const n = {}; for (const row of r.level.tiles) for (const c of row) n[c] = (n[c] || 0) + 1;
  assert.ok((n['Γ'] || 0) + (n['Θ'] || 0) > 300 && n['Δ'] > 100 && n['Π'] > 100 && n['Φ'] > 0 && n['Σ'] > 0, JSON.stringify(n));
  assert.equal(r.level.waterLevel, 0.84); assert.equal(r.level.environment.coast, true);
  const pieces = r.sprites.filter((s) => s.tavern).flatMap((s) => s.tavern.pieces).map((p) => p.k);
  for (const k of ['surf', 'marram', 'wrack', 'tideline', 'blowhole', 'beachboat']) assert.ok(pieces.includes(k), k);
});
