// Bows and crossbows (world doc §3.1 v1.10, GDD §8): a rogue holding one shoots from range instead
// of closing in (battle.js SHOT); arrows from bows, bolts from crossbows. Only rogues can use them,
// and a two-handed one puts the parrying dagger back in the bag. The dagger rogue is as it was.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createSim } from '../src/sim/core.js';
import { isWalkable } from '../src/sim/world.js';
import { makeItem, BASES, shotOf } from '../src/sim/items.js';
import { fightOf } from '../src/sim/battle.js';
import { existsSync } from 'node:fs';
import { hire } from './fixtures/hire.mjs';

const SEED = 20260807;
// the right party (fighter, rogue, cleric) in a level-1 room
function party() {
  const t = createSim(SEED, undefined, { scene: 'town' }); hire(t, [1, 3]);
  const sim = createSim(SEED, undefined, { scene: 'dungeon' }); sim.state.party.push(...t.state.party.slice(1).map((m) => ({ ...m, gear: JSON.parse(JSON.stringify(m.gear)) })));
  const L = sim.world.level, r = L.rooms.find((q) => q !== L.entrance), p = sim.state.player; sim.world.roomLevels.set(r.id, 1);
  let best = null, bd = 1e9;
  for (const [k, c] of L.cells) { if (c.kind !== 'floor' || c.room !== r.id) continue; const [x, y] = k.split(',').map(Number); const d = Math.hypot(x - r.cx, y - r.cy); if (d < bd && isWalkable(sim.world, x + 0.5, y + 0.5)) { bd = d; best = [x, y]; } }
  p.x = p.px = best[0] + 0.5; p.y = p.py = best[1] + 0.5;
  return sim;
}
// arm a member through the equip command (the bag is where loot lands)
function arm(sim, m, base) {
  const it = makeItem(base, m.level, 'common', { uid: 'test:' + base }); sim.state.bag.push(it);
  sim.commands.push({ type: 'equip', member: m.id, uid: it.uid }); sim.tick();
  return it;
}
// fight a minute; every shot the rogue lets fly: its kind and how far it flew
function shots(sim) {
  const rogue = sim.state.party.find((m) => m.cls === 'rogue'), out = [], seen = new Set();
  for (let i = 0; i < 20 * 60; i++) {
    sim.tick();
    for (const b of sim.world.projectiles || []) if (!seen.has(b)) { seen.add(b); if (Math.abs(b.sx - rogue.x) < 0.6 && Math.abs(b.sy - rogue.y) < 0.6) out.push({ kind: b.kind, d: Math.hypot(b.tgt.x - b.sx, b.tgt.y - b.sy) }); }
  }
  return out;
}

test('a rogue with a hunting bow shoots arrows from beyond a dagger\'s reach', () => {
  const sim = party(), rogue = sim.state.party.find((m) => m.cls === 'rogue');
  arm(sim, rogue, 'huntbow');
  assert.equal(shotOf(rogue), 'bow'); assert.equal(fightOf(rogue).bolt, 'arrow');
  const s = shots(sim);
  assert.ok(s.length >= 10, `${s.length} arrows`);
  assert.ok(s.every((q) => q.kind === 'arrow'));
  assert.ok(s.filter((q) => q.d > 3).length >= s.length / 2, 'most shots from beyond melee reach: ' + s.map((q) => q.d.toFixed(1)).join(' '));
});

test('crossbows shoot bolts; the dagger rogue still closes in and shoots nothing', () => {
  const a = party(); arm(a, a.state.party.find((m) => m.cls === 'rogue'), 'heavybow');
  const s = shots(a); assert.ok(s.length >= 5 && s.every((q) => q.kind === 'bolt'), `${s.length} bolts`);
  const b = party(), rogue = b.state.party.find((m) => m.cls === 'rogue');
  assert.equal(shotOf(rogue), null); assert.equal(fightOf(rogue).range, 2.8);
  assert.equal(shots(b).length, 0);
});

test('only a rogue can use them; a two-handed one puts the parrying dagger back in the bag', () => {
  const sim = party(), [fighter, rogue] = [sim.state.party[0], sim.state.party.find((m) => m.cls === 'rogue')];
  arm(sim, fighter, 'longbow');
  assert.notEqual(fighter.gear.weapon.base, 'longbow'); assert.ok(sim.state.bag.some((q) => q.base === 'longbow'), 'refused: still in the bag');
  assert.equal(rogue.gear.off.base, 'offdagger');
  arm(sim, rogue, 'longbow');
  assert.equal(rogue.gear.weapon.base, 'longbow'); assert.equal(rogue.gear.off, null);
  assert.ok(sim.state.bag.some((q) => q.base === 'offdagger') && sim.state.bag.some((q) => q.base === 'dagger'));
  for (const b of ['huntbow', 'longbow', 'handbow', 'heavybow', 'bonebow']) assert.equal(BASES[b].cls, 'rogue', b);
});

test('every item base has its icon baked (assets/items)', () => {
  for (const [id, B] of Object.entries(BASES)) assert.ok(existsSync(`assets/items/${B.icon}.png`), `${id}: ${B.icon}.png`);
});
