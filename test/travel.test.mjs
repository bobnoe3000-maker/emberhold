// Walking the overland: a tap or compass walk keeps out of exit zones it isn't heading for.
// Leaving the barrows for town used to walk straight back through the barrows' mouth (the path
// north crossed it) and back into the dungeon.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createSim } from '../src/sim/core.js';

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
test('a walk that ends in an exit still goes through it (every site open from the start)', () => {
  for (const site of ['barrows', 'tithe_mill', 'sunken_chapel']) {
    const sim = createSim(20260807, undefined, { scene: 'overland' });   // from the Thornwick road
    assert.equal(walk(sim, 'site:' + site), 'dungeon'); assert.equal(sim.state.site, site); assert.equal(sim.world.site, site);
  }
});
test('a hidden site is shut, off the compass and unnamed until revealed; then it opens', () => {
  const sim = createSim(20260807, undefined, { scene: 'overland' }); sim.tick();
  assert.ok(!sim.destinations().some((d) => d.id === 'site:wickham_keep'), 'not on the compass');
  const e = sim.world.exits.find((x) => x.site === 'wickham_keep'), p = sim.state.player; let shut = 0; sim.bus.on('siteShut', () => shut++);
  p.x = p.px = (e.x0 + e.x1) / 2; p.y = p.py = (e.y0 + e.y1) / 2; for (let i = 0; i < 5; i++) sim.tick();
  assert.equal(sim.world.kind, 'overland', 'its way in stays shut'); assert.equal(shut, 1, 'said once');
  sim.reveal('wickham_keep'); sim.tick();
  assert.equal(sim.world.kind, 'dungeon'); assert.equal(sim.world.site, 'wickham_keep');
  const back = createSim(1); back.restore(JSON.parse(JSON.stringify(sim.snapshot())));
  assert.equal(back.world.site, 'wickham_keep', 'the save keeps the site'); assert.ok(back.state.revealed.has('wickham_keep'), 'and what was revealed');
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
  for (const site of ['tithe_mill', 'ninth_milestone', 'wickham_keep', 'sunken_chapel', 'scrag_warren', 'toadking_mound', 'drowned_abbey']) {
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
