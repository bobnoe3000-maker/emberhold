// Foliage by biome (docs/level-design-rules.md §3.6; the owner: "it should be different based on the type of biome the
// map is based on"): each land's overland grows its own species, on the ground its biome grows them on, at its own
// cover. Cover is the share of the map within 8 tiles of a tree, as the Vale's own test (overland.test.mjs) measures it.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createSim } from '../src/sim/core.js';
import { groundAt, G } from '../src/sim/outdoor.js';

const SEED = 20260807, TREE = /^(pine|oak|autumn|dead|grove|birch|alder|willow|carr)/;
const land = (region) => { const o = createSim(SEED, undefined, { scene: 'overland', region }).world, inMap = (s) => s.x >= 0 && s.y >= 0 && s.x < o.W && s.y < o.H;
  const trees = o.structs.filter((s) => TREE.test(s.id) && inMap(s)), ug = o.structs.filter((s) => /^ug_/.test(s.id) && inMap(s));
  // (a clearing kept bare on purpose isn't the land's cover: o.clear, the Fens' old stones, outdoor.js STONES_CLEAR)
  const cleared = (x, y) => (o.clear || []).some(([cx, cy, r]) => Math.hypot(x - cx, y - cy) < r);
  let near = 0, n = 0; for (let y = 0; y < o.H; y += 4) for (let x = 0; x < o.W; x += 4) { if (cleared(x, y)) continue; n++; if (trees.some((s) => Math.hypot(s.x - x, s.y - y) < 8)) near++; }
  return { o, trees, ug, cover: near / n, on: (s) => groundAt(o, s.x, s.y).g }; };
const water = (o, x, y, r) => { for (let a = 0; a < 8; a++) { const g = groundAt(o, x + Math.cos(a * Math.PI / 4) * r, y + Math.sin(a * Math.PI / 4) * r).g; if (g === G.POOL || g === G.WATER || g === G.BANK) return true; } return false; };
const V = land('vale');

test('the Vale: meadow and mixed wood, no marsh trees, everything on grass', () => {
  assert.ok(!V.trees.some((s) => /alder|willow|carr/.test(s.id)), 'no marsh trees');
  assert.ok([...V.trees, ...V.ug].every((s) => V.on(s) === G.GRASS || V.on(s) === G.FIELD), 'on grass');
});

test("the Fens: alder and carr thickets, willows and the dead at the water's edge and never out on the open marsh", () => {
  const F = land('fens');
  assert.ok(!F.trees.some((s) => /birch|autumn|grove|oak/.test(s.id)), 'none of the Vale’s round, cheerful trees (fens critic pass 2)');
  const edge = F.trees.filter((s) => /willow|dead/.test(s.id));
  assert.ok(edge.length >= 8, `willows and the dead: ${edge.length}`);
  assert.equal(edge.filter((s) => F.on(s) === G.MARSH && !water(F.o, s.x, s.y, 3)).length, 0, 'none out on the open marsh (on it only at the water’s lip, 3 tiles)');
  assert.ok(edge.every((s) => water(F.o, s.x, s.y, 9)), "each by the water's edge");
  // (it was also "less wooded than the Vale" until v1.71 thinned the Vale's trees by a quarter at the owner's word; 16.0 %
  // until 2026-11-15, when the old stones' clearing took the north-east's carr and dried its meres: 13.4 %, the rest tree for tree as it was)
  assert.ok(F.cover >= 0.13 && F.cover <= 0.25, `cover ${(F.cover * 100).toFixed(1)} % (the Vale ${(V.cover * 100).toFixed(1)} %)`);
});

test('the Reach: dead trees and red rock, no pine on scree, no leafy growth, barely wooded', () => {
  const R = land('reach');
  assert.equal(R.trees.filter((s) => /pine/.test(s.id) && R.on(s) === G.SCREE).length, 0, 'no pine on scree');
  assert.ok(!R.trees.some((s) => /oak|birch|autumn|grove|alder|willow|carr/.test(s.id)), 'no leafy trees');
  assert.ok(!R.ug.some((s) => /flowers|fern|clover|mushroom/.test(s.id)), 'dry grass and stones only');
  // (12.2 % since v1.126: the spawn points' ground kept clear of the hills moved the scatter's draws, the same land a tree or two different)
  assert.ok(R.cover <= 0.125, `cover ${(R.cover * 100).toFixed(1)} %`);
});

test('the Heights: living pines below the snow line only, nothing green on snow or scree', () => {
  const H = land('heights');
  assert.equal(H.trees.filter((s) => /pine/.test(s.id) && (H.on(s) === G.SNOW || H.on(s) === G.SCREE)).length, 0, 'no living pine on snow or scree');
  assert.equal(H.ug.filter((s) => [G.SNOW, G.SCREE, G.MARSH].includes(H.on(s))).length, 0, 'no undergrowth on snow, scree or marsh');
  assert.ok(!H.trees.some((s) => /oak|birch|autumn|grove|alder|willow|carr/.test(s.id)), 'no leafy trees');
  assert.ok(H.trees.some((s) => /pine/.test(s.id)), 'pines below the line');
});

// The Kingstone's ground (GDD §19; the owner, 2026-11-15: "move the region boss further to the NE corner, and make sure the
// ground area is clear of trees - and no water or mini islands for players to get stuck on"): the old stones in the Fens'
// north-east, inside STONES_CLEAR no mere, marsh or blocked tile and nothing standing to be caught on, on any seed.
test("the Fens: the old stones' clearing is dry, open ground in the north-east", async () => {
  const { CAMPS } = await import('../src/sim/camps.js');
  const { FENS, STONES_CLEAR } = await import('../src/sim/outdoor.js');
  const c = CAMPS.find((k) => k.id === 'fens_stones');
  assert.deepEqual([c.x, c.y], FENS.stones); assert.ok(c.x > 180 && c.y < 60, `north-east: ${c.x}, ${c.y}`);
  for (const seed of [SEED, 7, 20261115]) {
    const o = createSim(seed, undefined, { scene: 'overland', region: 'fens' }).world, bad = [];
    for (let y = c.y - STONES_CLEAR; y <= c.y + STONES_CLEAR; y++) for (let x = c.x - STONES_CLEAR; x <= c.x + STONES_CLEAR; x++) {
      if (Math.hypot(x + 0.5 - c.x, y + 0.5 - c.y) >= STONES_CLEAR - 5) continue;   // (its edge wanders 4 tiles either way: outdoor.js CLEAR_WOB)
      const g = groundAt(o, x + 0.5, y + 0.5).g, i = (y + o.PAD) * o.GW + x + o.PAD;
      if (g === G.POOL || g === G.WATER || g === G.MARSH || g === G.BANK) bad.push(`${x},${y} ground ${g}`);
      else if (o.blocked[i] && Math.hypot(x + 0.5 - c.x, y + 0.5 - c.y) > 7) bad.push(`${x},${y} blocked`);   // (the stones' own pillars inside 7)
    }
    const standing = o.structs.filter((s) => /^(pine|oak|autumn|dead|grove|birch|alder|willow|carr|rock_|ug_bush)/.test(s.id) && Math.hypot(s.x - c.x, s.y - c.y) < STONES_CLEAR);
    assert.deepEqual(bad, [], `seed ${seed}: wet or blocked ground in the clearing`);
    assert.deepEqual(standing.map((s) => s.id), [], `seed ${seed}: nothing standing to be caught on`);
  }
});
