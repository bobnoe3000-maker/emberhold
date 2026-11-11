// The tide (GDD §7.1): each wave of a room visit is a step tougher than the last up to a top (+100 %
// in an ordinary room, at wave 20: a nineteenth a wave; a hall 6 %), and the wave after the top is back at the start, so a room cycles and a
// party strong enough for its top can farm it as long as it likes. A floor's stairs-down hall climbs
// to +150 %. Leaving ends the visit; the next one starts at the bottom.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createSim } from '../src/sim/core.js';
import { isWalkable } from '../src/sim/world.js';
import { statsFor } from '../src/sim/party.js';
import { TIDES } from '../src/sim/battle.js';

// a visit that never ends: the party is kept standing, so the tide can be read wave by wave
function tides(pickRoom, waves) {
  const sim = createSim(20260807, undefined, { scene: 'dungeon' }), L = sim.world.level, r = pickRoom(L, sim.world), p = sim.state.player;
  let best = null, bd = 1e9;
  for (const [k, c] of L.cells) { if (c.kind !== 'floor' || c.room !== r.id) continue; const [x, y] = k.split(',').map(Number); const d = Math.hypot(x - r.cx, y - r.cy); if (d < bd && isWalkable(sim.world, x + 0.5, y + 0.5)) { bd = d; best = [x, y]; } }
  p.x = p.px = best[0] + 0.5; p.y = p.py = best[1] + 0.5;
  const out = [], turned = []; sim.bus.on('wave', (e) => { if (!e.cleared) out.push(Math.round(e.tide * 100)); }); sim.bus.on('tideTurned', () => turned.push(out.length + 1));
  const h = sim.state.party[0]; h.level = 12;
  for (let i = 0; i < 20 * 60 * 30 && out.length < waves; i++) { h.hp = statsFor(h).maxHp; h.down = false; sim.tick(); }
  return { out, turned, sim };
}
const climb = (cap, n, step) => { const a = []; let t = 0; for (let i = 0; i < n; i++) { if (i) t = t >= cap - 1e-9 ? 0 : Math.min(cap, t + step); a.push(Math.round(t * 100)); } return a; };

test('an ordinary room: a nineteenth a wave up to +100 % at wave 20, then back to the start, and again', () => {
  assert.deepEqual(TIDES.room, { step: 1 / 19, cap: 1.0 });
  const { out, turned } = tides((L, w) => L.rooms.find((q) => w.roomLevels.get(q.id) === 1), 44);
  assert.deepEqual(out, climb(1.0, 44, 1 / 19));
  assert.equal(Math.max(...out), 100, 'never above the top');
  assert.deepEqual(out.slice(18, 22), [95, 100, 0, 5], 'wave 20 is the top, wave 21 starts over');
  assert.deepEqual(turned, [21, 41]);
});

test('a floor\'s stairs-down hall is a special room: it climbs to +150 %', () => {
  const { out } = tides((L) => L.descentRoom, 30);
  assert.deepEqual(out, climb(1.5, 30, 0.06));
  assert.equal(Math.max(...out), 150);
});
