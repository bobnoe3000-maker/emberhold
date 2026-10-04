// Auto-unstick (the owner, 2026-10-04: "Sometimes companions get stuck in a wall, especially when they flash forward to
// catch up"). The catch-up put a companion at a fixed offset from the hero, wall or not, and one inside a wall can't
// take a step. Now a placement lands on open floor the hero can see, a companion inside a wall moves to the nearest
// open floor, and out of a fight one cut off from the hero behind a wall comes round to them.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createSim } from '../src/sim/core.js';
import { makeMember } from '../src/sim/party.js';
import { isWalkable } from '../src/sim/world.js';

const SEED = 20260807;
const open = (w, x, y) => isWalkable(w, x, y);
// a dungeon visit in its entrance (a sanctuary: no fight), with one companion
function visit() {
  const sim = createSim(SEED, undefined, { scene: 'dungeon' });
  sim.state.party.push(makeMember('c1', 'Osk', 'rogue', 6));
  sim.tick();
  return sim;
}
// the entrance's floor tiles where the old catch-up offset (x − 0.8, y + 0.8) lands in a wall
function byAWall(sim) {
  const w = sim.world, L = w.level, out = [];
  for (const [k, c] of L.cells) {
    if (c.kind !== 'floor' || c.room !== L.entrance.id) continue;
    const [x, y] = k.split(',').map(Number), cx = x + 0.5, cy = y + 0.5;
    if (open(w, cx, cy) && !open(w, cx - 0.8, cy + 0.8)) out.push([cx, cy]);
  }
  return out;
}
const put = (sim, x, y) => { const p = sim.state.player; p.x = p.px = x; p.y = p.py = y; sim.state.party[0].x = x; sim.state.party[0].y = y; };

test('a companion catching up lands on open floor beside the hero, never in the wall next to them', () => {
  const sim = visit(), spots = byAWall(sim);
  assert.ok(spots.length > 0, 'the entrance has a floor tile against a wall');
  for (const [x, y] of spots.slice(0, 8)) {
    put(sim, x, y);
    const m = sim.state.party[1]; m.x = x + 30; m.y = y; m.px = m.x; m.py = m.y;   // far behind: the catch-up
    sim.tick();
    assert.ok(open(sim.world, m.x, m.y), `caught up into a wall at ${m.x},${m.y} (hero ${x},${y})`);
    assert.ok(Math.hypot(m.x - x, m.y - y) < 4.5, 'beside the hero');
  }
});

test('a companion found inside a wall moves to the nearest open floor that tick, and says so', () => {
  const sim = visit(), [[x, y]] = byAWall(sim), ev = [];
  sim.bus.on('unstuck', (e) => ev.push(e));
  put(sim, x, y);
  const m = sim.state.party[1]; m.x = m.px = x - 0.8; m.y = m.py = y + 0.8;   // in the wall
  sim.tick();
  assert.ok(open(sim.world, m.x, m.y), `still in the wall at ${m.x},${m.y}`);
  assert.equal(ev.length, 1); assert.equal(ev[0].id, 'c1');
});

test('the catch-up and the unstick are deterministic, and nothing they keep is saved', () => {
  const a = visit(), b = visit(), [[x, y]] = byAWall(a);
  for (const s of [a, b]) { put(s, x, y); const m = s.state.party[1]; m.x = m.px = x - 0.8; m.y = m.py = y + 0.8; for (let i = 0; i < 60; i++) s.tick(); }
  assert.deepEqual([a.state.party[1].x, a.state.party[1].y], [b.state.party[1].x, b.state.party[1].y]);
  const saved = a.snapshot().party[1];
  assert.equal(saved.stuckT, undefined); assert.equal(saved.x, undefined);
});

test('out of a fight, a companion cut off behind a wall, not moving, comes round to the hero within a few seconds', () => {
  const sim = visit(), w = sim.world, L = w.level;
  // the hero in the entrance; open floor 4–8 tiles off with a wall between (no straight line of floor to the hero)
  const seen = (ax, ay, bx, by) => { const n = Math.ceil(Math.hypot(bx - ax, by - ay) / 0.3); for (let i = 1; i <= n; i++) if (!open(w, ax + ((bx - ax) * i) / n, ay + ((by - ay) * i) / n)) return false; return true; };
  const floor = [...L.cells].filter(([, c]) => c.kind === 'floor').map(([k, c]) => { const [tx, ty] = k.split(',').map(Number); return [tx + 0.5, ty + 0.5, c.room]; }).filter(([x, y]) => open(w, x, y));
  let pair = null;
  for (const [x, y, r] of floor) {
    if (r !== L.entrance.id) continue;
    const f = floor.find(([cx, cy]) => { const d = Math.hypot(cx - x, cy - y); return d > 4 && d < 8 && !seen(x, y, cx, cy); });
    if (f) { pair = [x, y, f[0], f[1]]; break; }
  }
  assert.ok(pair, 'a tile behind a wall from the entrance');
  const [x, y, fx, fy] = pair; put(sim, x, y);
  const m = sim.state.party[1]; m.x = m.px = fx; m.y = m.py = fy;
  for (let i = 0; i < 20 * 4; i++) sim.tick();
  assert.ok(open(w, m.x, m.y) && Math.hypot(m.x - x, m.y - y) < 4.5, `still cut off at ${m.x.toFixed(1)},${m.y.toFixed(1)} (hero ${x},${y})`);
});
