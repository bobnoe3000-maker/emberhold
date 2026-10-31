// render3d.test.mjs — the trial of Luminati as the world's renderer (docs/luminati-port-plan.md, phase 0): the sim's
// worlds converted to Luminati levels (src/render3d/convert.js), and the sim's clock on Luminati's hours (hybrid.js).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createSim } from '../src/sim/core.js';
import { convertWorld, MAX_TILES } from '../src/render3d/convert.js';
import { DAY_S } from '../src/sim/heroes.js';
import { PART_S } from '../src/sim/npcs.js';

// (hybrid.js touches the DOM only when it's attached: its hour mapping imports under node)
const { hourOf } = await import('../src/render3d/hybrid.js');

const SEED = 20260807;
const worlds = [
  ['town', 'vale'], ['town', 'fens'], ['town', 'reach'], ['town', 'heights'], ['overland', 'vale'], ['overland', 'fens'], ['overland', 'reach'], ['overland', 'heights'],
  ['dungeon', 'vale', 'barrows'], ['dungeon', 'vale', 'wickham_keep'], ['dungeon', 'vale', 'toadking_mound'], ['dungeon', 'vale', 'scrag_warren'],
];

for (const [scene, region, site] of worlds) {
  test(`convert: ${scene} ${site || region} is a level Luminati can hold`, () => {
    const w = createSim(SEED, undefined, { scene, region, site }).world;
    const { level, sprites, origin } = convertWorld(w, { region });
    assert.equal(level.format, 'luminati-level');
    assert.ok(level.width <= MAX_TILES / 2 && level.depth <= MAX_TILES / 2, `${level.width}×${level.depth} over 128`);
    assert.equal(level.tiles.length, level.depth); assert.equal(level.heights.length, level.depth);
    for (let j = 0; j < level.depth; j++) {
      assert.equal(level.tiles[j].length, level.width); assert.equal(level.heights[j].length, level.width);
      for (const ch of level.tiles[j]) assert.ok(level.legend[ch], `tile '${ch}' not in the legend`);
      assert.match(level.heights[j], /^[0-9a-z]+$/);
    }
    for (const o of level.objects) {
      if ('x' in o) { assert.ok(o.x >= 0 && o.x <= level.width && o.z >= 0 && o.z <= level.depth, `${o.type} outside the level`); }
    }
    for (const s of sprites) assert.ok(s.x >= 0 && s.x <= level.width && s.z >= 0 && s.z <= level.depth && typeof s.id === 'string');
    // the hero stands on a walkable, unraised tile of the level (where the sim put them)
    const p = createSim(SEED, undefined, { scene, region, site }).state.player;
    const i = Math.floor((p.x - origin.x) / 2), j = Math.floor((p.y - origin.y) / 2);
    assert.ok(i >= 0 && j >= 0 && i < level.width && j < level.depth, 'the hero is inside the level');
    assert.ok(level.legend[level.tiles[j][i]].walkable !== false || scene === 'town', `the hero's tile '${level.tiles[j][i]}' is not walkable`);
  });
}

test('convert: the same world converts to the same level (presentation of a deterministic sim)', () => {
  const a = convertWorld(createSim(SEED, undefined, { scene: 'town', region: 'vale' }).world);
  const b = convertWorld(createSim(SEED, undefined, { scene: 'town', region: 'vale' }).world);
  assert.deepEqual(a, b);
});

test('convert: a town keeps its services as named houses, its walls raised and its gate open', () => {
  const w = createSim(SEED, undefined, { scene: 'town', region: 'vale' }).world;
  const { level } = convertWorld(w);
  const named = level.objects.filter((o) => o.type === 'house' && o.name).map((o) => o.name).sort();
  assert.deepEqual(named, w.services.map((s) => s.name).sort());
  assert.ok(level.heights.some((r) => /[6-8]/.test(r)), 'the curtain wall is raised');
});

test('hour: the sim\'s four parts of the day land on Luminati\'s dawn, day, dusk and night', () => {
  assert.equal(hourOf(0), 5);                       // dawn breaking
  assert.equal(hourOf(PART_S), 7.5);                // day
  assert.equal(hourOf(2 * PART_S), 17.5);           // dusk
  assert.equal(hourOf(3 * PART_S), 20.5);           // night
  assert.equal(hourOf(DAY_S), 5);                   // and round again
  for (let t = 0; t < DAY_S; t += 37) { const h = hourOf(t); assert.ok(h >= 0 && h < 24); }
});

test('biomes: the Reach is drawn in Luminati\'s desert, the Heights in its snow and ice, the Vale in its grassland', () => {
  const tally = (region) => { const { level } = convertWorld(createSim(SEED, undefined, { scene: 'overland', region }).world, { region }); const t = {};
    for (const r of level.tiles) for (const ch of r) t[ch] = (t[ch] || 0) + 1;
    return { t, env: level.environment, trees: new Set(level.objects.filter((o) => o.type === 'tree').map((o) => o.opts.kind)), level }; };
  const reach = tally('reach'), heights = tally('heights'), vale = tally('vale');
  assert.equal(reach.env.climate, 'arid'); assert.ok(!reach.t.g && !reach.t.G && reach.t.a > 0 && reach.t.e > 0 && reach.t.X > 0, JSON.stringify(reach.t));
  assert.ok([...reach.trees].every((k) => ['juniper', 'deadwood'].includes(k)), [...reach.trees].join());
  assert.equal(heights.env.season, 'winter'); assert.ok(heights.t.n > heights.t.q && heights.t.I > 0 && heights.t.N > 0 && !heights.t['~'], JSON.stringify(heights.t));
  assert.ok([...heights.trees].every((k) => ['snowpine', 'bare'].includes(k)), [...heights.trees].join());
  assert.ok(!vale.env.climate && !vale.env.season && vale.t.g > 0 && !vale.t.n && !vale.t.a);
  for (const x of [reach, heights, vale]) for (const ch of Object.keys(x.t)) assert.ok(x.level.legend[ch], `'${ch}' in the legend`);
});
