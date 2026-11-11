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
  let near = 0, n = 0; for (let y = 0; y < o.H; y += 4) for (let x = 0; x < o.W; x += 4) { n++; if (trees.some((s) => Math.hypot(s.x - x, s.y - y) < 8)) near++; }
  return { o, trees, ug, cover: near / n, on: (s) => groundAt(o, s.x, s.y).g }; };
const water = (o, x, y, r) => { for (let a = 0; a < 8; a++) { const g = groundAt(o, x + Math.cos(a * Math.PI / 4) * r, y + Math.sin(a * Math.PI / 4) * r).g; if (g === G.POOL || g === G.WATER || g === G.BANK) return true; } return false; };
const V = land('vale');

test('the Vale: meadow and mixed wood, no marsh trees, everything on grass', () => {
  assert.ok(!V.trees.some((s) => /alder|willow|carr/.test(s.id)), 'no marsh trees');
  assert.ok([...V.trees, ...V.ug].every((s) => V.on(s) === G.GRASS || V.on(s) === G.FIELD), 'on grass');
});

test("the Fens: alder and carr thickets, willows and the dead at the water's edge and never out on the open marsh, less wooded than the Vale", () => {
  const F = land('fens');
  assert.ok(!F.trees.some((s) => /birch|autumn|grove|oak/.test(s.id)), 'none of the Vale’s round, cheerful trees (fens critic pass 2)');
  const edge = F.trees.filter((s) => /willow|dead/.test(s.id));
  assert.ok(edge.length >= 8, `willows and the dead: ${edge.length}`);
  assert.equal(edge.filter((s) => F.on(s) === G.MARSH && !water(F.o, s.x, s.y, 3)).length, 0, 'none out on the open marsh (on it only at the water’s lip, 3 tiles)');
  assert.ok(edge.every((s) => water(F.o, s.x, s.y, 9)), "each by the water's edge");
  assert.ok(F.cover >= 0.15 && F.cover <= 0.25 && F.cover < V.cover, `cover ${(F.cover * 100).toFixed(1)} % (the Vale ${(V.cover * 100).toFixed(1)} %)`);
});

test('the Reach: dead trees and red rock, no pine on scree, no leafy growth, barely wooded', () => {
  const R = land('reach');
  assert.equal(R.trees.filter((s) => /pine/.test(s.id) && R.on(s) === G.SCREE).length, 0, 'no pine on scree');
  assert.ok(!R.trees.some((s) => /oak|birch|autumn|grove|alder|willow|carr/.test(s.id)), 'no leafy trees');
  assert.ok(!R.ug.some((s) => /flowers|fern|clover|mushroom/.test(s.id)), 'dry grass and stones only');
  assert.ok(R.cover <= 0.12, `cover ${(R.cover * 100).toFixed(1)} %`);
});

test('the Heights: living pines below the snow line only, nothing green on snow or scree', () => {
  const H = land('heights');
  assert.equal(H.trees.filter((s) => /pine/.test(s.id) && (H.on(s) === G.SNOW || H.on(s) === G.SCREE)).length, 0, 'no living pine on snow or scree');
  assert.equal(H.ug.filter((s) => [G.SNOW, G.SCREE, G.MARSH].includes(H.on(s))).length, 0, 'no undergrowth on snow, scree or marsh');
  assert.ok(!H.trees.some((s) => /oak|birch|autumn|grove|alder|willow|carr/.test(s.id)), 'no leafy trees');
  assert.ok(H.trees.some((s) => /pine/.test(s.id)), 'pines below the line');
});
