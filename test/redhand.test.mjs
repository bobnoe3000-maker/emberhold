// The Redhand Company (M5, world doc §8): each site's waves come from its family (battle.js FAMILIES).
// (v1.48, one dungeon a level) Bandits on Wickham Keep's first two floors, the diggers (bandits and the dead they dug
// up) in its Old Cellars, its third floor, and at the Old Barrows' mouth, their first; the Ashbound below that; the
// Ashbound and the Cinder Cult's acolytes in the Sunken Chapel. Turn Undead reaches only the Ashbound.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createSim } from '../src/sim/core.js';
import { createWorld, isWalkable } from '../src/sim/world.js';
import { familyOf, FAMILIES, novaTargets } from '../src/sim/battle.js';
import { skillDef } from '../src/sim/skills.js';

// fight in a room for a while and collect every kind that spawned
function kindsIn(site, depth = 0, secs = 90) {
  const sim = createSim(20260807, undefined, { scene: 'dungeon', site }), seen = new Map();
  if (depth) { sim.restore({ ...JSON.parse(JSON.stringify(sim.snapshot())), depth, floors: [] }); assert.equal(sim.world.depth, depth); assert.ok(createWorld(sim.world.seed, undefined, depth, site)); }
  const L = sim.world.level, r = L.rooms.find((q) => q !== L.entrance), p = sim.state.player;
  let best = null, bd = 1e9;
  for (const [k, c] of L.cells) { if (c.kind !== 'floor' || c.room !== r.id) continue; const [x, y] = k.split(',').map(Number); const d = Math.hypot(x - r.cx, y - r.cy); if (d < bd && isWalkable(sim.world, x + 0.5, y + 0.5)) { bd = d; best = [x, y]; } }
  p.x = p.px = best[0] + 0.5; p.y = p.py = best[1] + 0.5;
  for (const m of sim.state.party) m.level = 12;
  for (let i = 0; i < secs * 20; i++) { const h = sim.state.party[0]; h.hp = 9999; sim.tick(); for (const e of sim.world.enemies || []) seen.set(e.kind, e.undead); }
  return seen;
}

test('each site fills its waves from its own family, floor by floor', () => {
  const keep = kindsIn('wickham_keep');
  assert.ok(keep.size && [...keep.keys()].every((k) => ['cutthroat', 'brute', 'crossbow'].includes(k)), `the Keep's bailey: ${[...keep.keys()]}`);
  assert.ok([...keep.values()].every((u) => u === false), 'the living');
  const mouth = kindsIn('barrows');                                   // the Redhand's dig at the barrow mouth: the diggers
  assert.ok(mouth.size && [...mouth.keys()].every((k) => ['cutthroat', 'minion', 'crossbow', 'rogue', 'brute'].includes(k)), `the barrow mouth: ${[...mouth.keys()]}`);
  for (const [k, u] of mouth) assert.equal(u, FAMILIES.diggers.undead(k), `${k}: the diggers' dead and living`);
  const barrows = kindsIn('barrows', 1);
  assert.ok(barrows.size && [...barrows.keys()].every((k) => ['minion', 'warrior', 'rogue', 'mage'].includes(k)), `the barrows' second floor: ${[...barrows.keys()]}`);
  assert.ok([...barrows.values()].every((u) => u === true), 'the dead');
  const chapel = kindsIn('sunken_chapel', 0, 160);
  assert.ok(chapel.size && [...chapel.keys()].every((k) => ['minion', 'warrior', 'rogue', 'acolyte'].includes(k)), `the chapel: ${[...chapel.keys()]}`);
});

test('the Keep\'s third floor (the Old Cellars) and the Barrows\' first are the diggers\'; a floor picks its family', () => {
  assert.equal(familyOf({ site: 'wickham_keep', depth: 0 }), FAMILIES.redhand);
  assert.equal(familyOf({ site: 'wickham_keep', depth: 1 }), FAMILIES.redhand);
  assert.equal(familyOf({ site: 'wickham_keep', depth: 2 }), FAMILIES.diggers);
  assert.equal(familyOf({ site: 'barrows', depth: 0 }), FAMILIES.diggers);
  assert.equal(familyOf({ site: 'barrows', depth: 1 }), FAMILIES.ashbound);
  assert.equal(familyOf({ site: 'barrows', depth: 2 }), FAMILIES.ashbound);
  assert.ok(FAMILIES.diggers.undead('minion') && !FAMILIES.diggers.undead('cutthroat'));
});

test('Turn Undead reaches only the Ashbound; Frost Nova reaches anyone', () => {
  const m = { x: 10, y: 10 }, foe = (kind, undead, dx) => ({ kind, undead, x: 10 + dx, y: 10, hp: 50 });
  const foes = [foe('minion', true, 1), foe('acolyte', false, 1.5), foe('warrior', true, -2), foe('cutthroat', false, 0.5), foe('minion', true, 9)];
  const turn = skillDef('cleric', 'turn_undead'), frost = skillDef('mage', 'frost_nova');
  assert.deepEqual(novaTargets(turn, foes, m).map((f) => f.kind), ['minion', 'warrior']);
  assert.deepEqual(novaTargets(frost, foes, m).map((f) => f.kind), ['minion', 'acolyte', 'warrior', 'cutthroat']);
});
