// The floors' gates (GDD §3.4 v1.70, v1.118; the owner, 2026-11-11: "A gate prevents a player from moving to the next room
// until they have survived 20 waves. Then the gate drops down into the ground and disappears. Once open, always open for
// that game slot"; and 2026-11-15: "There should be a gate between every dungeon room not just the final room, 10 waves to
// open. Once opened always open for that game slot"): every room past the first ring off the entrance has a gate across
// every way into it; the tenth wave held in one visit of a room before it drops it; open for good in that slot.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createSim } from '../src/sim/core.js';
import { SITES } from '../src/sim/sites.js';
import { createWorld, isWalkable, GATE_WAVES, gateShutOf, gateUp, hallGate } from '../src/sim/world.js';
import { statsFor } from '../src/sim/party.js';
import { gatesFor41 } from '../src/persist/save.js';

const K = (x, y) => `${x},${y}`;
/** the rooms that can be walked to from the entrance (4-way over walkable tiles) */
function roomsReached(w) {
  const L = w.level, s = [Math.floor(L.entrance.cx), Math.floor(L.entrance.cy)], seen = new Set([K(...s)]), Q = [s], rooms = new Set();
  while (Q.length) { const [x, y] = Q.shift(); const c = L.cells.get(K(x, y)); if (c && c.room >= 0) rooms.add(c.room);
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const q = K(x + dx, y + dy); if (seen.has(q) || !isWalkable(w, x + dx + 0.5, y + dy + 0.5)) continue; seen.add(q); Q.push([x + dx, y + dy]); } }
  return rooms;
}
const hallReached = (w) => roomsReached(w).has(w.level.descentRoom.id);
/** stand the hero in a room and keep him up until n waves are held there */
function holdWaves(sim, room, n) {
  const w = sim.world, L = w.level, r = L.rooms.find((q) => q.id === room), p = sim.state.player, h = sim.state.party[0];
  let best = null, bd = 1e9;
  for (const [k, c] of L.cells) { if (c.kind !== 'floor' || c.room !== r.id) continue; const [x, y] = k.split(',').map(Number); const d = Math.hypot(x - r.cx, y - r.cy); if (d < bd && isWalkable(w, x + 0.5, y + 0.5)) { bd = d; best = [x, y]; } }
  p.x = p.px = best[0] + 0.5; p.y = p.py = best[1] + 0.5; h.level = 30;
  let held = 0; const opened = []; const a = (e) => { if (e.cleared) held = e.wave; }, b = (e) => opened.push(e);
  sim.bus.on('wave', a); sim.bus.on('gateOpened', b);
  for (let i = 0; i < 20 * 60 * 30 && held < n; i++) { h.hp = statsFor(h).maxHp; h.down = false; sim.tick(); }
  sim.bus.off?.('wave', a); sim.bus.off?.('gateOpened', b);
  return { held, opened };
}

test('every room past the first ring has a gate, 10 waves to open; every floor of every site walks gate by gate to its last hall, and no gate shut lets its room be reached', () => {
  assert.equal(GATE_WAVES, 10);
  let floors = 0, gates = 0;
  for (const [site, S] of Object.entries(SITES)) for (const seed of [1, 20260807, 4242]) for (let d = 0; d < (S.floors || 3); d++) {
    const w = createWorld((seed ^ Math.imul(d + 1, 2654435761)) >>> 0, undefined, d, site);
    if (site === 'mere_tower' || S.arena) { assert.ok(!w.gates.some((g) => !g.hall) && w.gates.length <= (S.arena ? 0 : 1), `${site}: no room gates (the tower's landings are its waves, the Bowl's sand its bouts)`); continue; }
    if (!w.level || !w.level.entrance) continue;
    floors++; gates += w.gates.length;
    const where = `${site} floor ${d + 1} (seed ${seed})`;
    assert.ok(w.gates.length >= 1, `${where}: a gate`);
    assert.equal(w.gates.filter((g) => g.hall).length, 1, `${where}: its last hall's`);
    assert.ok(hallGate(w).id === `${site}:${d}` && w.gates.every((g) => g.hall || g.id === `${site}:${d}:${g.room}`), `${where}: the ids`);
    assert.ok(w.gates.every((g) => g.waves === GATE_WAVES && g.cells.length && g.rooms.length && !g.rooms.includes(g.room)), `${where}: each won in another room`);
    // the rooms in the first ring are open; walk on gate by gate, opening each one a reached room wins
    const all = (() => { w.gateShut = null; return roomsReached(w); })(), open = new Set();
    for (;;) {
      w.gateShut = gateShutOf(w.gates, (id) => open.has(id));
      const got = roomsReached(w);
      for (const g of w.gates) if (!open.has(g.id) && w.gateShut) assert.ok(!got.has(g.room), `${where}: room ${g.room} behind a gate still up`);
      const more = w.gates.filter((g) => !open.has(g.id) && g.rooms.some((r) => got.has(r)));
      if (!more.length) { assert.deepEqual([...got].sort(), [...all].sort(), `${where}: every room reached in the end`); break; }
      for (const g of more) open.add(g.id);
    }
  }
  assert.ok(floors >= 50 && gates >= 2.5 * floors, `${floors} floors, ${gates} gates`);
});

test('in the game: a new slot\'s floor has its gates shut; the tenth wave held in a room before one drops it (the ninth doesn\'t), and every gate that room wins; open for good: a save, a load, the floor left and come back to', () => {
  const sim = createSim(20260807, undefined, { scene: 'dungeon', site: 'barrows' });
  const w = sim.world, first = w.gates.find((g) => !g.hall) || w.gates[0];
  assert.ok(w.gateShut && w.gates.every((g) => gateUp(w, g)), 'all shut in a new slot');
  assert.ok(!roomsReached(w).has(first.room), 'its room behind it');
  const room = first.rooms[0], wins = w.gates.filter((g) => g.rooms.includes(room));
  const a = holdWaves(sim, room, 9);
  assert.equal(a.held, 9); assert.equal(a.opened.length, 0, 'not at 9'); assert.ok(gateUp(sim.world, first), 'still up');
  const b = holdWaves(sim, room, 10);
  assert.ok(b.held >= 10, `held ${b.held}`);
  assert.deepEqual(b.opened.map((e) => e.id).sort(), wins.map((g) => g.id).sort(), 'every gate that room wins, and only those');
  assert.ok(wins.every((g) => sim.state.gates.has(g.id) && !gateUp(sim.world, g)), 'down, and in the slot');
  assert.ok(first.cells.every((k) => { const [x, y] = k.split(',').map(Number); return isWalkable(sim.world, x + 0.5, y + 0.5); }), 'its tiles walked on');
  assert.ok(roomsReached(sim.world).has(first.room), 'its room reached');
  // a save and a load (another sim from the snapshot): open; the rest still shut
  const snap = JSON.parse(JSON.stringify(sim.snapshot()));
  assert.ok(snap.gates.includes(first.id));
  const back = createSim(20260807, undefined, { scene: 'dungeon', site: 'barrows' }); back.restore(snap);
  const bg = back.world.gates.find((g) => g.id === first.id);
  assert.ok(bg && !gateUp(back.world, bg), 'open after a load');
  if (back.world.gates.some((g) => !wins.some((q) => q.id === g.id))) assert.ok(back.world.gateShut, 'the others still up');
  // the floor left and come back to: open
  back.restore({ ...JSON.parse(JSON.stringify(back.snapshot())), depth: 1, floors: [] }); back.restore({ ...JSON.parse(JSON.stringify(back.snapshot())), depth: 0, floors: [] });
  assert.ok(!gateUp(back.world, back.world.gates.find((g) => g.id === first.id)), 'open when you come back');
  // another slot: its own gates, shut
  assert.ok(createSim(20260807, undefined, { scene: 'dungeon', site: 'barrows' }).world.gates.every((g) => gateUp(createSim(20260807, undefined, { scene: 'dungeon', site: 'barrows' }).world, g)), 'a new slot: shut');
});

test('the last hall\'s gate open (an old save\'s, or the floor walked to its end) opens the whole floor', () => {
  const sim = createSim(20260807, undefined, { scene: 'dungeon', site: 'barrows' });
  const snap = JSON.parse(JSON.stringify(sim.snapshot())); snap.gates = ['barrows:0'];
  const back = createSim(20260807, undefined, { scene: 'dungeon', site: 'barrows' }); back.restore(snap);
  assert.equal(back.world.gateShut, null, 'every gate of the floor down'); assert.ok(hallReached(back.world));
  // a room's own id comes back from a save; nonsense is dropped
  snap.gates = ['barrows:0:3', 'barrows:x', 'nowhere']; back.restore(snap);
  assert.deepEqual([...back.state.gates], ['barrows:0:3']);
});

test('the compass: a gate up, "The gate" leads to the nearest room it\'s won in; the floor\'s gates down, the stairs', () => {
  const sim = createSim(20260807, undefined, { scene: 'dungeon', site: 'barrows' });
  const ids = () => sim.destinations().map((d) => d.id);
  const g = sim.destinations().find((d) => d.id === 'gate');
  const w = sim.world, reach = roomsReached(w);
  assert.ok(g && w.gates.some((G) => G.rooms.includes(g.room)) && reach.has(g.room) && /10 waves/.test(g.sub), JSON.stringify(g));
  assert.ok(!ids().includes('stairs-down'));
  for (const G of w.gates) sim.state.gates.add(G.id);
  w.gateShut = null; w._openCache = null; w.discovered.add(w.level.descentRoom.id);   // (as battle.js opens them)
  assert.ok(!ids().includes('gate')); assert.ok(ids().includes('stairs-down'));
});

test('an old save (v40) comes back with the gates it has been through open: where its hall\'s boss is down, and above the floor it was made on', () => {
  const d = gatesFor41({ bosses: { quartermaster: 1, goblin_chief: 2 }, scene: 'dungeon', site: 'sunken_chapel', depth: 2 });
  assert.deepEqual(new Set(d.gates), new Set(['barrows:1', 'wickham_keep:0', 'sunken_chapel:0', 'sunken_chapel:1']));
  assert.deepEqual(gatesFor41({ bosses: {}, scene: 'town' }).gates, [], 'none passed: none open');
  assert.deepEqual(gatesFor41({ gates: ['barrows:0'] }).gates, ['barrows:0'], 'a v41 save as it is');
});
