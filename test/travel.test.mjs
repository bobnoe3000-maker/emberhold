// Walking the overland: a tap or compass walk keeps out of exit zones it isn't heading for.
// Leaving the barrows for town used to walk straight back through the barrows' mouth (the path
// north crossed it) and back into the dungeon.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createSim as createSim0 } from '../src/sim/core.js';
import { openAllGates } from './gates.mjs';
const createSim = (...a) => openAllGates(createSim0(...a));   // (the floors' gates open: this file tests something else, test/gate.test.mjs the gates)

const outFromBarrows = (seed) => { const sim = createSim(seed, undefined, { scene: 'overland' }), a = sim.world.arrivals.barrows, p = sim.state.player; p.x = p.px = a.x; p.y = p.py = a.y; return sim; };
const walk = (sim, id) => {
  const o = sim.destinations().find((d) => d.id === id); assert.ok(o, `no "${id}" in the compass`);
  sim.commands.push({ type: 'goto', tx: o.tx, ty: o.ty, near: o.near, label: o.label });
  let went = null; sim.bus.on('levelChanged', () => { went = went || sim.world.kind; });
  for (let t = 0; t < 20 * 120 && !went; t++) sim.tick();
  return went;
};

for (const seed of [20260807, 7, 99991]) test(`the compass walk to town from the barrows reaches town, seed ${seed}`, () => {
  assert.equal(walk(outFromBarrows(seed), 'town'), 'town');
});
test('a walk that ends in an exit still goes through it (every site open from the start); the parked ones are on no compass', () => {
  const rows = createSim(20260807, undefined, { scene: 'overland' }).destinations();
  for (const site of ['tithe_mill', 'scrag_warren']) assert.ok(!rows.some((d) => d.id === 'site:' + site), `${site}: parked (v1.48), no way in`);
  for (const site of ['barrows', 'wickham_keep', 'sunken_chapel']) {
    const sim = createSim(20260807, undefined, { scene: 'overland' });   // from the Thornwick road
    assert.equal(walk(sim, 'site:' + site), 'dungeon'); assert.equal(sim.state.site, site); assert.equal(sim.world.site, site);
  }
});
test('a hidden site is shut, off the compass and unnamed until revealed; then it opens', () => {
  const sim = createSim(20260807, undefined, { scene: 'overland' }); sim.tick();
  // (v1.48: Wickham Keep is open from the start, a band of its own; the Vale's hidden site is its secret, the Ninth Milestone)
  assert.ok(!sim.destinations().some((d) => d.id === 'site:ninth_milestone'), 'not on the compass');
  const e = sim.world.exits.find((x) => x.site === 'ninth_milestone'), p = sim.state.player; let shut = 0; sim.bus.on('siteShut', () => shut++);
  p.x = p.px = (e.x0 + e.x1) / 2; p.y = p.py = (e.y0 + e.y1) / 2; for (let i = 0; i < 5; i++) sim.tick();
  assert.equal(sim.world.kind, 'overland', 'its way in stays shut'); assert.equal(shut, 1, 'said once');
  sim.reveal('ninth_milestone'); sim.tick();
  assert.equal(sim.world.kind, 'dungeon'); assert.equal(sim.world.site, 'ninth_milestone');
  const back = createSim(1); back.restore(JSON.parse(JSON.stringify(sim.snapshot())));
  assert.equal(back.world.site, 'ninth_milestone', 'the save keeps the site'); assert.ok(back.state.revealed.has('ninth_milestone'), 'and what was revealed');
});
test('the stick still takes you through any exit', () => {
  const sim = outFromBarrows(20260807);
  for (let t = 0; t < 20 * 10 && sim.world.kind === 'overland'; t++) { sim.commands.push({ type: 'move', x: 0, y: -1 }); sim.tick(); }   // north, back into the barrows' mouth
  assert.equal(sim.world.kind, 'dungeon');
});

// a site's last floor ends in its hall, with no stairs down (sites.js): the compass says so ("The last hall"), and never
// offers stairs that aren't there. The owner, in the Tithe Mill (one floor): "There are no stairs down here", with the
// compass reading "Stairs down · to depth 2" (2026-10-04)
test('no "Stairs down" on a last floor: the compass offers the last hall instead', async () => {
  const { SITES, hasFloorBelow } = await import('../src/sim/sites.js');
  // (the Mill and the Warren are parked, v1.48, but still build: ?site= previews them)
  for (const site of ['tithe_mill', 'barrows', 'ninth_milestone', 'wickham_keep', 'sunken_chapel', 'scrag_warren', 'toadking_mound', 'canal_locks', 'drowned_abbey']) {
    const sim = createSim(20260807, undefined, { scene: 'dungeon', site }); sim.tick();
    for (let d = 0; d < (SITES[site].floors || 1); d++) {
      if (d) { const t = sim.world.stairsAt, p = sim.state.player; p.x = p.px = t.x + 0.5; p.y = p.py = t.y + 1.5; sim.commands.push({ type: 'harvest', tx: t.x, ty: t.y }); sim.tick(); }
      for (const r of sim.world.level.rooms) sim.world.discovered.add(r.id);
      const rows = sim.destinations(), down = rows.find((r) => r.id === 'stairs-down'), last = rows.find((r) => r.id === 'last-hall');
      if (hasFloorBelow(site, d)) { assert.ok(down && !last, `${site} floor ${d + 1}: stairs down`); }
      else { assert.ok(!down, `${site} floor ${d + 1}: no stairs down on its last floor`); assert.ok(last && /no way down/.test(last.sub), `${site} floor ${d + 1}: the last hall`); }
    }
  }
});

// the owner, 2026-11-10: "manually walking towards thorn wick and through the gates from the main map, did not take me to
// the thorn wick map. I had to select the compass". A tap inside the walls, on the gate, at its mouth or on a house
// inside walked the overland's model of the town: the way in lay 3 tiles inside the gate, and a walk that had to pass
// through a way in passed it by. Now each goes in.
test("walking up to Thornwick's gate, or tapping anywhere inside its walls, goes into town", async () => {
  const { createSim: mk } = await import('../src/sim/core.js');
  for (const [tx, ty, what] of [[40, 150, 'inside the walls'], [56, 150, 'the gate'], [58, 149, 'the gate mouth'], [30, 160, 'a house inside']]) {
    const sim = mk(20260807, undefined, { scene: 'overland', region: 'vale' }); sim.tick();
    sim.commands.push({ type: 'goto', tx, ty });
    for (let i = 0; i < 20 * 20 && sim.world.kind === 'overland'; i++) sim.tick();
    assert.equal(sim.world.kind, 'town', `a tap at ${what} takes you into Thornwick`);
  }
  const sim = mk(20260807, undefined, { scene: 'overland', region: 'vale' }); sim.tick();
  for (let i = 0; i < 20 * 20 && sim.world.kind === 'overland'; i++) { sim.commands.push({ type: 'move', x: -1, y: 0 }); sim.tick(); }
  assert.equal(sim.world.kind, 'town', 'the stick, west up the road and through the gate');
});

// v1.72 (the World map's land tab: a tap on open ground walks there): sim.spotNear snaps the tap to the nearest tile
// you can stand on and prices the walk; nothing off the land or underground; the walk is a plain goto that gets there
test('spotNear: the World map\'s tap on open ground, snapped to a spot you can stand on, and the goto there arrives', async () => {
  const { isWalkable } = await import('../src/sim/world.js');
  const sim = createSim(20260807, undefined, { scene: 'overland', region: 'vale' }); sim.tick();
  const w = sim.world, p = sim.state.player;
  // the river: some water tile on the land, snapped out of it onto the bank
  let wet = null; for (let y = 40; y < 220 && !wet; y += 2) for (let x = 40; x < 220 && !wet; x += 2) if (!isWalkable(w, x + 0.5, y + 0.5) && !(w.props && w.props.get(`${x},${y}`))) wet = [x, y];
  const s = sim.spotNear(wet[0], wet[1]);
  assert.ok(s, 'a spot near it'); assert.ok(isWalkable(w, s.tx + 0.5, s.ty + 0.5), 'one you can stand on');
  assert.ok(Math.max(Math.abs(s.tx - wet[0]), Math.abs(s.ty - wet[1])) <= 8, 'near where you tapped'); assert.ok(s.steps > 0, 'the walk priced');
  assert.equal(sim.spotNear(-60, -60), null, 'past the edge: nowhere');
  sim.commands.push({ type: 'goto', tx: s.tx, ty: s.ty, near: 0, then: null, label: 'Walk here' });
  for (let i = 0; i < 20 * 120 && (p.path || i === 0); i++) sim.tick();
  assert.ok(Math.hypot(p.x - (s.tx + 0.5), p.y - (s.ty + 0.5)) < 1.5, `arrived (${p.x.toFixed(1)}, ${p.y.toFixed(1)} for ${s.tx}, ${s.ty})`);
  const dun = createSim(20260807, undefined, { scene: 'dungeon' }); dun.tick();
  assert.equal(dun.spotNear(10, 10), null, 'underground: the land map walks nowhere');
});
