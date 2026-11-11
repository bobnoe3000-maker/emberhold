// The floor's gate (GDD §3.4 v1.70; the owner, 2026-11-11: "A gate prevents a player from moving to the next room until
// they have survived 20 waves. Then the gate drops down into the ground and disappears. Once open, always open for that
// game slot"): across every way into a floor's last hall; the twentieth wave held in one visit of the room before it
// drops it; open for good in that slot.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createSim } from '../src/sim/core.js';
import { SITES } from '../src/sim/sites.js';
import { isWalkable, GATE_WAVES } from '../src/sim/world.js';
import { statsFor } from '../src/sim/party.js';
import { gatesFor41 } from '../src/persist/save.js';

const K = (x, y) => `${x},${y}`;
/** can the hall be walked to from the entrance? (4-way over walkable tiles) */
function hallReached(w) {
  const L = w.level, s = [Math.floor(L.entrance.cx), Math.floor(L.entrance.cy)], seen = new Set([K(...s)]), Q = [s];
  while (Q.length) { const [x, y] = Q.shift(); const c = L.cells.get(K(x, y)); if (c && c.room === L.descentRoom.id) return true;
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const q = K(x + dx, y + dy); if (seen.has(q) || !isWalkable(w, x + dx + 0.5, y + dy + 0.5)) continue; seen.add(q); Q.push([x + dx, y + dy]); } }
  return false;
}
/** stand the hero in a gate room and keep him up until the gate's down or n waves are held */
function holdWaves(sim, n) {
  const w = sim.world, L = w.level, r = L.rooms.find((q) => q.id === w.gate.rooms[0]), p = sim.state.player, h = sim.state.party[0];
  let best = null, bd = 1e9;
  for (const [k, c] of L.cells) { if (c.kind !== 'floor' || c.room !== r.id) continue; const [x, y] = k.split(',').map(Number); const d = Math.hypot(x - r.cx, y - r.cy); if (d < bd && isWalkable(w, x + 0.5, y + 0.5)) { bd = d; best = [x, y]; } }
  p.x = p.px = best[0] + 0.5; p.y = p.py = best[1] + 0.5; h.level = 30;
  let held = 0; const opened = []; sim.bus.on('wave', (e) => { if (e.cleared) held = e.wave; }); sim.bus.on('gateOpened', (e) => opened.push(e));
  for (let i = 0; i < 20 * 60 * 30 && held < n; i++) { h.hp = statsFor(h).maxHp; h.down = false; sim.tick(); }
  return { held, opened };
}

test('every floor of every site has its gate across the ways into its last hall (but the Mere Tower, whose landings are its waves); shut, the hall can\'t be walked to', () => {
  let n = 0;
  for (const site of Object.keys(SITES)) for (const seed of [1, 20260807]) {
    const sim = createSim(seed, undefined, { scene: 'dungeon', site });
    for (let d = 0; d < 3; d++) {
      if (d) { sim.restore({ ...JSON.parse(JSON.stringify(sim.snapshot())), depth: d, floors: [] }); if (sim.state.depth !== d) break; }
      const w = sim.world;
      if (site === 'mere_tower') { assert.equal(w.gate, null, 'the tower: no gate'); continue; }
      assert.ok(w.gate && w.gate.cells.length && w.gate.rooms.length, `${site} floor ${d + 1}: a gate`);
      assert.equal(w.gate.id, `${site}:${d}`); assert.equal(w.gate.waves, GATE_WAVES); assert.equal(GATE_WAVES, 20);
      assert.ok(w.gateShut && w.gateShut.size === w.gate.cells.length, 'shut in a new slot');
      assert.ok(!hallReached(w), `${site} floor ${d + 1}: the hall behind it`);
      w.gateShut = null; assert.ok(hallReached(w), `${site} floor ${d + 1}: open, the hall's there`);
      n++;
    }
  }
  assert.ok(n >= 40, `${n} floors gated`);
});

test('the twentieth wave held in the room before it drops it (the nineteenth doesn\'t); open for good: a save, a load, the floor left and come back to', () => {
  const sim = createSim(20260807, undefined, { scene: 'dungeon', site: 'barrows' });
  const w = sim.world, id = w.gate.id;
  const a = holdWaves(sim, 19);
  assert.equal(a.held, 19); assert.equal(a.opened.length, 0, 'not at 19'); assert.ok(sim.world.gateShut, 'still up');
  const b = holdWaves(sim, 20);
  assert.ok(b.held >= 20 && b.opened.length === 1, `held ${b.held}`);
  assert.equal(b.opened[0].id, id); assert.ok(sim.state.gates.has(id)); assert.equal(sim.world.gateShut, null, 'down');
  assert.ok(sim.world.gate.cells.every((k) => { const [x, y] = k.split(',').map(Number); return isWalkable(sim.world, x + 0.5, y + 0.5); }), 'its tiles walked on');
  // a save and a load (another sim from the snapshot): open
  const snap = JSON.parse(JSON.stringify(sim.snapshot()));
  assert.ok(snap.gates.includes(id));
  const back = createSim(20260807, undefined, { scene: 'dungeon', site: 'barrows' }); back.restore(snap);
  assert.equal(back.world.gateShut, null, 'open after a load'); assert.ok(hallReached(back.world));
  // the floor left and come back to: open
  back.restore({ ...JSON.parse(JSON.stringify(back.snapshot())), depth: 1, floors: [] }); back.restore({ ...JSON.parse(JSON.stringify(back.snapshot())), depth: 0, floors: [] });
  assert.equal(back.world.gateShut, null, 'open when you come back');
  // another slot: its own gates, shut
  assert.ok(createSim(20260807, undefined, { scene: 'dungeon', site: 'barrows' }).world.gateShut, 'a new slot: shut');
});

test('the compass: shut, "The gate" leads to the room its waves are won in; down, the stairs', () => {
  const sim = createSim(20260807, undefined, { scene: 'dungeon', site: 'barrows' });
  const ids = () => sim.compass ? sim.compass().map((d) => d.id) : sim.destinations().map((d) => d.id);
  const rows = (sim.destinations ? sim.destinations() : sim.compass());
  const g = rows.find((d) => d.id === 'gate');
  assert.ok(g && g.room === sim.world.gate.rooms[0] && /20 waves/.test(g.sub), JSON.stringify(g));
  assert.ok(!ids().includes('stairs-down'));
  sim.state.gates.add(sim.world.gate.id); sim.world.gateShut = null; sim.world._openCache = null; sim.world.discovered.add(sim.world.level.descentRoom.id);   // (as battle.js opens it)
  assert.ok(!ids().includes('gate')); assert.ok(ids().includes('stairs-down'));
});

test('an old save (v40) comes back with the gates it has been through open: where its hall\'s boss is down, and above the floor it was made on', () => {
  const d = gatesFor41({ bosses: { quartermaster: 1, goblin_chief: 2 }, scene: 'dungeon', site: 'sunken_chapel', depth: 2 });
  assert.deepEqual(new Set(d.gates), new Set(['barrows:1', 'wickham_keep:0', 'sunken_chapel:0', 'sunken_chapel:1']));
  assert.deepEqual(gatesFor41({ bosses: {}, scene: 'town' }).gates, [], 'none passed: none open');
  assert.deepEqual(gatesFor41({ gates: ['barrows:0'] }).gates, ['barrows:0'], 'a v41 save as it is');
});
