// render3d.test.mjs — the trial of Luminati as the world's renderer (docs/luminati-port-plan.md, phase 0): the sim's
// worlds converted to Luminati levels (src/render3d/convert.js), and the sim's clock on Luminati's hours (hybrid.js).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createSim } from '../src/sim/core.js';
import { convertWorld, MAX_TILES } from '../src/render3d/convert.js';
import { DAY_S } from '../src/sim/heroes.js';
import { PART_S } from '../src/sim/npcs.js';

// (hybrid.js touches the DOM only when it's attached: its hour mapping imports under node)
const { hourOf, brightAt, BRIGHT } = await import('../src/render3d/hybrid.js');

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
    for (const s of sprites) assert.ok(s.x >= 0 && s.x <= level.width && s.z >= 0 && s.z <= level.depth && (typeof s.id === 'string' || typeof s.prop === 'string'));
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

test('convert: a dungeon floor has its ways up and down as Luminati\'s stairs, not lampposts', () => {
  for (const site of ['barrows', 'wickham_keep', 'toadking_mound', 'drowned_abbey']) {
    const w = createSim(SEED, undefined, { scene: 'dungeon', site }).world;
    const { level, origin } = convertWorld(w, { region: 'vale' });
    const at = (x, y) => { const i = Math.floor((x - origin.x) / 2), j = Math.floor((y - origin.y) / 2); return { ch: level.tiles[j][i], h: parseInt(level.heights[j][i], 36), stairs: level.legend[level.tiles[j][i]].stairs }; };
    // the way up: a flight climbing from the floor toward the wall it stands against (one level a tile)
    const up = w.structs.find((s) => s.id.startsWith('stairsup')); assert.ok(up, `${site}: a way up`);
    const flight = level.tiles.flatMap((r, j) => [...r].map((ch, i) => ({ ch, h: parseInt(level.heights[j][i], 36) })).filter((t) => level.legend[t.ch].stairs));
    const rising = flight.filter((t) => level.legend[t.ch].stairs === (up.id === 'stairsup_0' ? 'N' : 'W'));
    assert.ok(rising.length >= 3 && Math.max(...rising.map((t) => t.h)) === 4 && Math.min(...rising.map((t) => t.h)) === 2, `${site}: the flight up climbs 2 → 5 (${JSON.stringify(rising)})`);
    // the way down: the well sunk two levels, its top step at the open edge
    const wl = w.stairwell; assert.ok(wl, `${site}: a stairwell`);
    const top = at(wl.x0 + 3, wl.y1 - 2), bottom = at(wl.x0 + 3, wl.y0 + 1);   // (inside the well whichever way our 2 × 2 falls)
    assert.ok(top.stairs === 'S' && top.h === 1 && bottom.h === 0, `${site}: the well steps down from the floor (${JSON.stringify({ top, bottom })})`);
    assert.equal(at(wl.x0 + 3, wl.y1 + 1).h, 2, `${site}: the floor in front of the well`);
    const exits = [...w.props.values()].filter((k) => k === 'exit').length;
    assert.equal(level.objects.filter((o) => o.type === 'lamppost').length, exits, `${site}: no lampposts in the well`);
  }
});

test('convert: each Vale dungeon floor is dressed in its kit: its stone, its hour, its furniture in 3D or as our props, its lights', () => {
  const seen = new Map();
  for (const [site, floors] of [['barrows', 2], ['wickham_keep', 2], ['sunken_chapel', 2]]) for (let d = 0; d < floors; d++) {   // (2026-11-02: two floors each, authored)
    const s0 = createSim(SEED, undefined, { scene: 'dungeon', site }); if (d) s0.restore({ ...JSON.parse(JSON.stringify(s0.snapshot())), depth: d });
    const w = s0.world, { level, sprites } = convertWorld(w, { region: 'vale' }), kinds = new Map();
    for (const [, k] of w.props) kinds.set(k, (kinds.get(k) || 0) + 1);
    const types = new Set(level.objects.map((o) => o.type)), ours = new Set(sprites.map((q) => q.prop));
    // every brazier a stone brazier with real fire; no lamppost but an exit's
    assert.equal(level.objects.filter((o) => o.type === 'fire' && o.opts.kind === 'brazier').length, kinds.get('brazier') || 0, `${w.kit}: braziers`);
    // each piece of its kit stood as one or the other
    for (const [k, n] of kinds) if (!/^stair|^exit$|^brazier$/.test(k)) assert.ok(ours.has(k) || n === 0 || [...types].length > 0, `${w.kit}: ${k}`);
    for (const k of ['standard', 'banner', 'saint', 'bound', 'font', 'sarcophagus', 'urnshelf', 'tent', 'bunk', 'altar']) if (kinds.has(k)) assert.ok(ours.has(k), `${w.kit}: ${k} is our prop`);
    for (const [k, t] of [['crates', 'crateStack'], ['barrels', 'barrel'], ['sacks', 'sacks'], ['boulder', 'rock'], ['stalagmite', 'crag'], ['pew', 'bench']]) if (kinds.has(k)) assert.ok(types.has(t), `${w.kit}: ${k} as ${t}`);
    // a light at each prop Emberlit lights
    const lit = ['lantern', 'candles', 'altar', 'circle', 'font'].reduce((n, k) => n + (kinds.get(k) || 0), 0);
    assert.ok(level.objects.filter((o) => o.type === 'light').length >= lit, `${w.kit}: lights`);
    const all = level.tiles.flatMap((r) => [...r]);
    seen.set(w.kit, { hour: level.environment.timeOfDay, wall: all.includes('B') ? 'B' : 'x', rock: all.includes('x'), dressed: all.includes('B') });
  }
  assert.deepEqual([...seen.keys()], ['dig', 'gallery', 'bailey', 'barracks', 'nave', 'binding'], 'six floors, each its kit');
  assert.ok(seen.get('gallery').hour > seen.get('dig').hour && seen.get('bailey').hour < seen.get('binding').hour, 'warm and cold kits at their hours');
  assert.equal(seen.get('nave').wall, 'B', 'the nave in dressed stone');   // (its Chancel in the cult's rock: the cut goes down under the altar)
  // a floor dressed room by room: the Keep's barracks in dressed stone and the cave under its cellars in rock; the Chapel's
  // cut dug rough, its crypts built
  assert.ok(seen.get('barracks').dressed && seen.get('barracks').rock, 'the Keep\'s second floor: stone and rock');
  assert.ok(seen.get('binding').dressed && seen.get('binding').rock, 'the Chapel\'s second floor: the cut and the crypt');
});

test('convert: a town keeps its services as named houses, its walls raised (the Vale\'s a palisade on a bank) and its gate open', () => {
  const w = createSim(SEED, undefined, { scene: 'town', region: 'vale' }).world;
  const { level } = convertWorld(w);
  const named = level.objects.filter((o) => o.type === 'house' && o.name).map((o) => o.name).sort();
  assert.deepEqual(named, w.services.map((s) => s.name).sort());
  assert.ok(level.heights.some((r) => /3/.test(r)), 'the curtain wall\'s bank is raised');
  // (the owner, 2026-11-02: "bring back the wooden walls to thornwick? Save stone walls for another town") Thornwick's
  // curtain, towers and gate are its timber palisade on an earth bank (world doc §3.1): our own baked pieces stood on a
  // bank a step high, not raised stone; another land's town keeps its stone
  const raised = (lv) => { const t = new Map(); lv.heights.forEach((r, j) => [...r].forEach((h, i) => { const n = parseInt(h, 36); if (n >= 3 && lv.tiles[j][i] !== 'T') t.set(lv.tiles[j][i] + n, (t.get(lv.tiles[j][i] + n) || 0) + 1); })); return t; };
  const v = convertWorld(w, { region: 'vale' }), vale = raised(v.level), pieces = v.sprites.filter((q) => /^vale_(curtainy?|tower|gatehousey?)_\d/.test(q.id));
  assert.ok(vale.get('E3') > 50 && ![...vale.keys()].some((k) => /^k/.test(k)), `Thornwick's bank of earth, no stone: ${JSON.stringify([...vale])}`);
  assert.ok(pieces.some((q) => /curtain/.test(q.id)) && pieces.some((q) => /tower/.test(q.id)) && pieces.some((q) => /gatehouse/.test(q.id)), `its palisade, towers and gatehouse stood: ${pieces.length}`);
  const fens = createSim(SEED, undefined, { scene: 'town', region: 'fens' }).world, f = convertWorld(fens, { region: 'fens' });
  assert.ok(!f.sprites.some((q) => /_(curtainy?|tower|gatehousey?)_\d/.test(q.id)), 'another land\'s walls are not ours stood up');
});

test('hour: the sim\'s four parts of the day land on Luminati\'s dawn, day, dusk and night', () => {
  assert.equal(hourOf(0), 5);                       // dawn breaking
  assert.equal(hourOf(PART_S), 7.5);                // day
  assert.equal(hourOf(2 * PART_S), 17);             // dusk: Luminati's golden hour and sunset (Emberlit's dusk is a warm low sun)
  assert.equal(hourOf(3 * PART_S), 19.6);           // night: from its blue hour
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
  assert.ok(!vale.env.climate && !vale.env.season && vale.t.G > vale.t.g && vale.t.g > 0 && !vale.t.n && !vale.t.a, JSON.stringify(vale.t));   // (the Vale mostly dark grass: Emberlit's is olive)
  for (const x of [reach, heights, vale]) for (const ch of Object.keys(x.t)) assert.ok(x.level.legend[ch], `'${ch}' in the legend`);
});

test('brightness: the Vale\'s parts of the day at the owner\'s levels, eased from one to the next', () => {
  // (the owner, 2026-11-02: "Day 75, dusk 55 and night 40", fitted by captures: docs/luminati-port-plan.md §13)
  for (const k of [BRIGHT.town, BRIGHT.overland]) {
    for (let p = 0; p < 4; p++) assert.ok(Math.abs(brightAt(k, (p + 0.5) * PART_S) - k[p]) < 1e-9);   // each part's middle: its own
    assert.ok(k[2] > k[1], 'dusk lifted above day (Luminati\'s dusk sat a fifth under Emberlit\'s)');
    let last = brightAt(k, 0);
    for (let t = 1; t <= DAY_S; t += 1) {                           // no jump at a part's edge: a second moves it under 0.3 %
      const b = brightAt(k, t); assert.ok(b > 0 && Math.abs(Math.log(b / last)) < 0.003, `t ${t}: ${last} → ${b}`); last = b;
    }
  }
  assert.ok(BRIGHT.overland[3] > BRIGHT.town[3], 'the overland\'s night has no windows and lamps: it takes the larger multiply');
});
