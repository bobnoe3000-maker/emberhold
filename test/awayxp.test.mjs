// Time away pays half XP a kill (GDD §12 v1.74; the owner, 2026-11-12: two hours away in a level-3 room took a level-4
// party from 4 to 6, "I would like them to only increase 1 level"). Live play is untouched. Two runs of the same room on
// the same seed, one played as time away: the same fight blow for blow (XP changes nothing in it), half the XP.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createSim } from '../src/sim/core.js';
import { isWalkable } from '../src/sim/world.js';
import { statsFor } from '../src/sim/party.js';
import { AWAY_XP } from '../src/sim/battle.js';

function run(away) {
  const sim = createSim(20260807, undefined, { scene: 'dungeon', site: 'barrows' }); sim.tick();
  sim.state.created = true;
  const L = sim.world.level, r = L.rooms.find((q) => q !== L.entrance && q.id !== L.descentRoom.id);
  let best = null, bd = 1e9; for (const [k, c] of L.cells) { if (c.kind !== 'floor' || c.room !== r.id) continue; const [x, y] = k.split(',').map(Number); const d = Math.hypot(x - r.cx, y - r.cy); if (d < bd && isWalkable(sim.world, x + 0.5, y + 0.5)) { bd = d; best = [x, y]; } }
  const p = sim.state.player, h = sim.state.party[0]; p.x = p.px = best[0] + 0.5; p.y = p.py = best[1] + 0.5;
  h.level = 30; h.xp = 0;                                         // (level 30: no level-up in the run, so the fight is the same)
  if (away) { sim.commands.push({ type: 'away', secs: 3600 }); }
  const slain = []; sim.bus.on('slain', () => slain.push(sim.state.t));
  for (let i = 0; i < 20 * 120; i++) { h.hp = statsFor(h).maxHp; h.down = false; sim.tick(); }
  return { xp: h.xp, slain, away: !!sim.state.away };
}

test('time away: a kill pays half its XP; the fight itself is the same', () => {
  assert.equal(AWAY_XP, 0.5);
  const live = run(false), away = run(true);
  assert.ok(away.away, 'still away (an hour of it)');
  assert.ok(live.slain.length >= 10, `a fight: ${live.slain.length} slain`);
  assert.deepEqual(away.slain, live.slain, 'the same foes fall at the same moments');
  const k = away.xp / live.xp;
  assert.ok(k > 0.47 && k < 0.53, `half the XP: ${away.xp} of ${live.xp} (${k.toFixed(3)})`);
});
