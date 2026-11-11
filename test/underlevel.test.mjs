// Under a foe's level (GDD §7, v1.69; the owner, 2026-11-11: "A 10% attack and defense penalty to player and party
// companions for each level under the main player only is under vs their targets NPC foes level"): every member strikes
// a foe above the hero's level at 10 % less ATK a level of the gap, and takes its blows at 10 % less DEF; the hero's level
// alone sets the gap.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createSim } from '../src/sim/core.js';
import { underBy, UNDER_K } from '../src/sim/battle.js';
import { isWalkable } from '../src/sim/world.js';

test('10 % a level of the gap, nothing at or under the hero, nothing left ten up', () => {
  assert.equal(UNDER_K, 0.1);
  assert.equal(underBy(5, 5), 1); assert.equal(underBy(5, 3), 1, 'a foe under the hero: no penalty, no bonus');
  assert.ok(Math.abs(underBy(5, 6) - 0.9) < 1e-12); assert.ok(Math.abs(underBy(5, 8) - 0.7) < 1e-12);
  assert.equal(underBy(1, 11), 0); assert.equal(underBy(1, 20), 0, 'never below nothing');
});

// a room visit at a hero level, the hero kept standing: what each side's blows did on average
function blows(heroLvl, roomLvl, relabel = 0) {
  const sim = createSim(20260807, undefined, { scene: 'dungeon' }), L = sim.world.level, p = sim.state.player;
  const r = L.rooms.find((q) => q !== L.entrance && sim.world.roomLevels.get(q.id) === 1);
  sim.world.roomLevels.set(r.id, roomLvl);
  let best = null, bd = 1e9;
  for (const [k, c] of L.cells) { if (c.kind !== 'floor' || c.room !== r.id) continue; const [x, y] = k.split(',').map(Number); const d = Math.hypot(x - r.cx, y - r.cy); if (d < bd && isWalkable(sim.world, x + 0.5, y + 0.5)) { bd = d; best = [x, y]; } }
  p.x = p.px = best[0] + 0.5; p.y = p.py = best[1] + 0.5;
  const h = sim.state.party[0]; h.level = heroLvl;
  const dealt = [], taken = [];
  sim.bus.on('combat', (e) => { if (e.t === 'hit' && !e.crit) (e.party ? taken : dealt).push(e.amount); });
  for (let i = 0; i < 20 * 40; i++) { h.hp = 9999; h.down = false; if (relabel) for (const e of sim.world.enemies) e.lvl = relabel; sim.tick(); }
  const avg = (a) => a.reduce((s, x) => s + x, 0) / Math.max(1, a.length);
  return { dealt: avg(dealt), taken: avg(taken), n: dealt.length + taken.length };
}

test('in a fight: the same hero and the same foes three levels up, struck at 70 % (the gap alone)', () => {
  // the same room (level 9) and the same hero (level 6) twice: once as it is, once with its foes' level read as the hero's
  // (their stats the same: only the gap differs). A party blow's damage scales with its ATK, so it lands at 0.7.
  const up = blows(6, 9), same = blows(6, 9, 6);
  assert.ok(up.n > 20 && same.n > 20, 'both fought');
  const k = up.dealt / same.dealt;
  assert.ok(k > 0.62 && k < 0.78, `dealt ${up.dealt.toFixed(1)} vs ${same.dealt.toFixed(1)}: ${k.toFixed(2)} (0.7 expected)`);
  assert.ok(up.taken > same.taken, `taken ${up.taken.toFixed(1)} vs ${same.taken.toFixed(1)}: his DEF the less`);
});
