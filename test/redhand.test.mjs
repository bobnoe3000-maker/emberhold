// The Redhand Company (M5, world doc §8): each site's waves come from its family (battle.js FAMILIES).
// Bandits in the Tithe Mill and Wickham Keep, the diggers (bandits and the dead they dug up) on the
// Keep's second floor, the Ashbound and the Cinder Cult's acolytes in the Sunken Chapel; the Old
// Barrows as before. Turn Undead reaches only the Ashbound.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createSim } from '../src/sim/core.js';
import { createWorld, isWalkable } from '../src/sim/world.js';
import { familyOf, FAMILIES, novaTargets } from '../src/sim/battle.js';
import { skillDef } from '../src/sim/skills.js';

// fight in a room for a while and collect every kind that spawned
function kindsIn(site, depth = 0, secs = 90) {
  const sim = createSim(20260807, undefined, { scene: 'dungeon', site }), seen = new Map();
  if (depth) { const w = createWorld(sim.world.seed, undefined, depth, site); assert.ok(w); }
  const L = sim.world.level, r = L.rooms.find((q) => q !== L.entrance), p = sim.state.player;
  let best = null, bd = 1e9;
  for (const [k, c] of L.cells) { if (c.kind !== 'floor' || c.room !== r.id) continue; const [x, y] = k.split(',').map(Number); const d = Math.hypot(x - r.cx, y - r.cy); if (d < bd && isWalkable(sim.world, x + 0.5, y + 0.5)) { bd = d; best = [x, y]; } }
  p.x = p.px = best[0] + 0.5; p.y = p.py = best[1] + 0.5;
  for (const m of sim.state.party) m.level = 12;
  for (let i = 0; i < secs * 20; i++) { const h = sim.state.party[0]; h.hp = 9999; sim.tick(); for (const e of sim.world.enemies || []) seen.set(e.kind, e.undead); }
  return seen;
}

test('each site fills its waves from its own family', () => {
  const mill = kindsIn('tithe_mill');
  assert.ok([...mill.keys()].every((k) => ['cutthroat', 'brute', 'crossbow'].includes(k)), `the mill: ${[...mill.keys()]}`);
  assert.ok([...mill.values()].every((u) => u === false), 'the living');
  const barrows = kindsIn('barrows');
  assert.ok([...barrows.keys()].every((k) => ['minion', 'warrior', 'rogue', 'mage'].includes(k)), `the barrows: ${[...barrows.keys()]}`);
  assert.ok([...barrows.values()].every((u) => u === true), 'the dead');
  const chapel = kindsIn('sunken_chapel', 0, 160);
  assert.ok([...chapel.keys()].every((k) => ['minion', 'warrior', 'rogue', 'acolyte'].includes(k)), `the chapel: ${[...chapel.keys()]}`);
});

test('the Keep\'s second floor is the diggers\'; a floor picks its family', () => {
  assert.equal(familyOf({ site: 'wickham_keep', depth: 0 }), FAMILIES.redhand);
  assert.equal(familyOf({ site: 'wickham_keep', depth: 1 }), FAMILIES.diggers);
  assert.equal(familyOf({ site: 'barrows', depth: 5 }), FAMILIES.ashbound);
  assert.ok(FAMILIES.diggers.undead('minion') && !FAMILIES.diggers.undead('cutthroat'));
});

test('Turn Undead reaches only the Ashbound; Frost Nova reaches anyone', () => {
  const m = { x: 10, y: 10 }, foe = (kind, undead, dx) => ({ kind, undead, x: 10 + dx, y: 10, hp: 50 });
  const foes = [foe('minion', true, 1), foe('acolyte', false, 1.5), foe('warrior', true, -2), foe('cutthroat', false, 0.5), foe('minion', true, 9)];
  const turn = skillDef('cleric', 'turn_undead'), frost = skillDef('mage', 'frost_nova');
  assert.deepEqual(novaTargets(turn, foes, m).map((f) => f.kind), ['minion', 'warrior']);
  assert.deepEqual(novaTargets(frost, foes, m).map((f) => f.kind), ['minion', 'acolyte', 'warrior', 'cutthroat']);
});
