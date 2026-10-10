// The dressing kits (v1.48, the owner: "each dungeon should be custom designed for its location in terms of decorations
// and art, NPCs ... a crypt should look visually like a crypt or a cave should look like a cave (pools, stalactites,
// some boulders)"): every band floor has its kit (sites.js `dress`), furnished with that kit's own things, its pools
// shallow and walkable; the Vale's three dungeons each have someone by the way in.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createWorld, isWalkable, DRESS, FLAT_PROPS } from '../src/sim/world.js';
import { SITES, dressAt } from '../src/sim/sites.js';
import { createSim } from '../src/sim/core.js';
import { NPCS } from '../src/sim/npcs.js';
import { buildProps, PROP_LIGHT } from '../src/render/gsprite.js';

const BANDS = ['barrows', 'wickham_keep', 'sunken_chapel', 'toadking_mound', 'canal_locks', 'drowned_abbey'];
// what only that kit brings (its rooms' own furniture), one of which every floor of it shows
const SIGN = { dig: ['spoil', 'lantern'], gallery: ['urnshelf', 'urns'], muster: ['rack', 'standard', 'urnshelf'], bailey: ['tent', 'banner'], barracks: ['bunk', 'rack'],
  cellar: ['stalagmite', 'scaffold', 'boulder'], nave: ['pew', 'altar', 'saint'], cultcut: ['circle', 'chains'], binding: ['bound', 'font'], mound: ['boat', 'reeds'],
  locks: ['windlass'], vats: ['vat'], abbey: ['altar', 'pew', 'saint', 'candles'] };

test('every band floor has a kit, and is furnished with its own things', () => {
  for (const site of BANDS) for (let d = 0; d < SITES[site].floors; d++) for (const seed of [104729, 209458]) {
    const kit = dressAt(site, d), w = createWorld(seed, undefined, d, site);
    assert.ok(kit && DRESS[kit], `${site} floor ${d + 1}: no kit`); assert.equal(w.kit, kit);
    const kinds = new Set(w.props.values());
    assert.ok(SIGN[kit].some((k) => kinds.has(k)), `${site} floor ${d + 1} (${kit}, seed ${seed}): none of ${SIGN[kit]} in ${[...kinds]}`);
  }
});

test('a floor with no kit is dressed by its family, as before; every kit prop is built and drawn', () => {
  const w = createWorld(104729, undefined, 0, 'mere_tower'); assert.equal(w.kit, null); assert.equal(w.pools.size, 0);
  const props = buildProps(7), used = new Set(Object.values(DRESS).flatMap((k) => [...k.decor, ...k.obstacles]));
  for (const k of used) assert.ok(props[k] && props[k].length && props[k][0].w > 0, `no sprite for ${k}`);
  for (const k of ['lantern', 'candles', 'altar', 'font', 'vat']) assert.ok(PROP_LIGHT[k], `${k} gives no light`);
});

test('a kit\'s pools are shallow: every pool tile you can stand on is walkable; the same every build', () => {
  let n = 0;
  for (const site of BANDS) for (let d = 0; d < SITES[site].floors; d++) {
    const w = createWorld(209458, undefined, d, site), again = createWorld(209458, undefined, d, site);
    assert.deepEqual([...w.pools], [...again.pools], `${site} ${d + 1}: pools not deterministic`);
    for (const k of w.pools) {
      const [x, y] = k.split(',').map(Number); n++;
      if (!w.props.has(k) || FLAT_PROPS.has(w.props.get(k))) assert.ok(isWalkable(w, x + 0.5, y + 0.5), `${site} ${d + 1}: pool at ${k} not walkable`);
    }
  }
  assert.ok(n > 100, `pools drawn: ${n}`);
});

test('a binding circle is underfoot: it never blocks', () => {
  const w = createWorld(104729, undefined, 1, 'sunken_chapel'), c = [...w.props].find(([, k]) => k === 'circle');
  assert.ok(c, 'the Cult\'s cut has a circle'); const [x, y] = c[0].split(',').map(Number);
  assert.ok(isWalkable(w, x + 0.5, y + 0.5));
});

test('by each of the Vale\'s dungeons\' ways in stands its keeper, and talks: Tobin Hask, Ned Fallow, Hester Lowe', () => {
  for (const [site, id, flag] of [['barrows', 'tobin_hask', 'met_tobin'], ['wickham_keep', 'ned_fallow', 'met_ned'], ['sunken_chapel', 'hester_lowe', 'met_hester']]) {
    const sim = createSim(20260807, undefined, { scene: 'dungeon', site }); sim.restore(JSON.parse(JSON.stringify(sim.snapshot())));   // (the scene as you walk in: the very first one is built before the state it asks)
    const L = sim.world.level, n = (sim.world.npcs || []).find((q) => q.id === id);
    assert.ok(n, `${id} not at ${site}`); assert.equal(L.cells.get(`${Math.floor(n.x)},${Math.floor(n.y)}`).room, L.entrance.id, `${id}: in the entrance room`);
    assert.equal(NPCS[id].found.depth, 0);
    assert.ok(Math.hypot(n.x - L.spawn.x, n.y - L.spawn.y) >= 3, `${id}: not where you arrive`);
    const said = []; sim.bus.on('dialogue', (e) => said.push(e));
    const p = sim.state.player; p.x = p.px = n.x + 1; p.y = p.py = n.y - 1;
    sim.commands.push({ type: 'talk', npc: id }); sim.tick();
    assert.equal(said.length, 1, `${id} answers`); assert.equal(said[0].knot, NPCS[id].knot);
    assert.equal(said[0].vars['flag_' + flag], 0);
  }
  const deeper = createSim(20260807, undefined, { scene: 'dungeon', site: 'wickham_keep' }); deeper.restore(JSON.parse(JSON.stringify(deeper.snapshot())));
  assert.ok(!(deeper.world.npcs || []).some((q) => q.id === 'tobin_hask' || q.id === 'hester_lowe'), 'each at his own dungeon only');
});
