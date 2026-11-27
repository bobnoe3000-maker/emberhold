// Water indoors (docs/water-indoors.md): deep water blocks, its bridges and the shin-deep water are walked; the same
// every build; the renderer sinks the channels, banks them, decks the bridges and lays the sheet over the pools.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createWorld, isWalkable, DRESS_PIECES } from '../src/sim/world.js';
import { dressingFaults } from '../src/sim/keepclear.js';
import { convertWorld } from '../src/render3d/convert.js';

const SEED = 20260807, DEEP = new Set(['channel', 'lockgate', 'sluice']);
const deepOf = (w) => [...w.props].filter(([, k]) => DEEP.has(k)).map(([k]) => k);

test('a channel blocks, its bridges and a flood are walked, and the floor is the same every build', () => {
  for (const [site, d] of [['canal_locks', 0], ['canal_locks', 1], ['drowned_abbey', 0]]) {
    const w = createWorld(SEED, undefined, d, site), again = createWorld(SEED, undefined, d, site), deep = deepOf(w);
    assert.ok(deep.length > 0, `${site} ${d}: deep water`);
    assert.deepEqual(deep, deepOf(again)); assert.deepEqual([...w.bridges], [...again.bridges]); assert.deepEqual([...w.pools], [...again.pools]);
    for (const k of deep) { const [x, y] = k.split(',').map(Number); assert.ok(!isWalkable(w, x + 0.5, y + 0.5), `${site} ${d}: ${k} walkable`); }
    // (a doorway's lantern may stand at a bridge's corner, by the wall: the rest of it walked)
    const free = [...w.bridges].filter((k) => !w.props.has(k));
    assert.ok(free.length >= w.bridges.size - 2, `${site} ${d}: a bridge cluttered`);
    for (const k of free) { const [x, y] = k.split(',').map(Number); assert.ok(isWalkable(w, x + 0.5, y + 0.5), `${site} ${d}: bridge ${k} blocked`); assert.ok(!w.pools.has(k)); }
    assert.equal(dressingFaults(w).length, 0, `${site} ${d}: keep-clear`);
    for (const k of deep) assert.ok(DRESS_PIECES.has(w.props.get(k)));
  }
  // the Lock Chamber's channel crosses the way into the Tally House: a bridge there
  const w = createWorld(SEED, undefined, 0, 'canal_locks'), r = w.level.rooms.find((q) => q.part === 'the_lock_chamber');
  assert.ok([...w.bridges].some((k) => w.level.cells.get(k)?.room === r.id), 'a bridge in the Lock Chamber');
  // a flooded room's floor is all water, walked; a dry one's none
  const ab = createWorld(SEED, undefined, 0, 'drowned_abbey'), walk = ab.level.rooms.find((q) => q.part === 'the_cloister_walk'), cell = ab.level.rooms.find((q) => q.part === 'teagues_cell');
  let wet = 0, dry = 0; for (const [k, c] of ab.level.cells) { if (c.room === walk.id && ab.pools.has(k)) wet++; if (c.room === cell.id && ab.pools.has(k)) dry++; }
  assert.ok(wet > 1000, `the cloister walk flooded: ${wet}`); assert.equal(dry, 0, 'Teague\'s cell kept dry');
});

test('the renderer sinks the channels under Luminati\'s water, banks and decks them, and lays the sheet over the pools', () => {
  const w = createWorld(SEED, undefined, 0, 'canal_locks'), { level, sprites, stats } = convertWorld(w, { region: 'fens' }), t = level.tiles.join('');
  assert.ok(t.includes('γ') && level.legend['γ'].water, 'sunk channel tiles, water'); assert.ok(t.includes('ε'), 'the banks'); assert.ok(t.includes('_'), 'the bridges');
  assert.ok(stats.deep > 0 && stats.deepPartial === 0, `whole tiles only: ${stats.deep} deep, ${stats.deepPartial} partial`);
  assert.ok(level.waterLevel < 1 && level.waterLevel > 0, 'under the floor'); assert.equal(level.environment.wet, 'canal');
  const trim = sprites.filter((q) => q.wet).flatMap((q) => q.wet.pieces);
  for (const k of ['wkerb', 'wrail', 'wrefl', 'lockgate', 'sluice']) assert.ok(trim.some((p) => p.k === k), k);
  assert.ok(sprites.some((q) => q.shallows && q.shallows.look === 'canal' && q.shallows.cells.length > 400 && q.shallows.lamps.length > 0), 'the basin\'s and the sluice\'s flood');
  // the Sunken Chapel's nave: shin-deep, no channels, its sandstone kept
  const ch = convertWorld(createWorld(SEED, undefined, 0, 'sunken_chapel'), { region: 'vale' });
  assert.ok(ch.sprites.some((q) => q.shallows && q.shallows.look === 'chapel'), 'the nave under water');
  assert.ok(!ch.level.tiles.join('').includes('γ') && ch.level.tiles.join('').includes('C'));
  // the Abbey: its own stone, the garth's turf and its sky
  const ab = convertWorld(createWorld(SEED, undefined, 0, 'drowned_abbey'), { region: 'fens' });
  assert.ok(ab.level.tiles.join('').includes('β') && ab.level.tiles.join('').includes('θ'));
  assert.ok(ab.sprites.some((q) => q.shallows && q.shallows.cells.some((v, i) => i % 4 === 2 && v & 1)), 'the garth open to the sky');
  assert.ok(ab.level.objects.some((o) => o.type === 'emitter' && o.preset === 'rain'), 'rain into the garth');
});
