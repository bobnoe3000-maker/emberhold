// What's drawn stands where the sim walls (docs/pathing-audit.md; the owner, 2026-11-26: "Ashgate.. characters often auto
// path and walk over or through walls.. eval all pathing and make sure it makes sense"). The converter (render3d/convert.js)
// draws the sim's world as a Luminati level; these hold the pieces it draws from the sim's own walls to them, headless:
// a stone circuit raised on exactly the cells the sim walls, a home on exactly the tiles it walls, a bare tree walled at its
// trunk, a mountain above a step only where it's walled; and companions at ease keep their bodies off the walls.
// (tools/capture/pathing.mjs measures the whole drawn scene in a browser against the sim's grid.)
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createOutdoor, homeWalls, isHome, bareTree, wallCells } from '../src/sim/outdoor.js';
import { convertWorld, BIOMES, BIOME_OF } from '../src/render3d/convert.js';
import { createSim } from '../src/sim/core.js';
import { isWalkable } from '../src/sim/world.js';

const SEED = 20260807;
const MAPS = [['town', 'reach'], ['town', 'heights'], ['town', 'tidemark'], ['town', 'vale'], ['overland', 'reach'], ['overland', 'heights'], ['overland', 'tidemark'], ['overland', 'vale']];
const built = new Map();
const build = (kind, region) => {
  const k = `${kind}:${region}`;
  if (!built.has(k)) { const w = createOutdoor(SEED, kind, region); built.set(k, { w, c: convertWorld(w, { region }) }); }
  return built.get(k);
};
const blocked = (w, x, y) => !isWalkable(w, x + 0.5, y + 0.5);

for (const [kind, region] of MAPS) {
  test(`${region} ${kind}: a stone wall is raised on exactly the cells the sim walls`, () => {
    const { w, c } = build(kind, region), { x: X0, y: Y0 } = c.origin, L = c.level;
    let cells = 0;
    for (const s of w.structs) {
      if (!s.cells) continue;
      const [a, b, cc, d] = wallCells(s.id, s.x, s.y);
      for (let ty = b; ty <= d; ty += 2) for (let tx = a; tx <= cc; tx += 2) {
        const i = (tx - X0) / 2, j = (ty - Y0) / 2; if (i < 0 || j < 0 || i >= L.width || j >= L.depth) continue;
        const all = [[0, 0], [1, 0], [0, 1], [1, 1]].every(([dx, dy]) => blocked(w, tx + dx, ty + dy)), up = parseInt(L.heights[j][i], 36) > 3;
        if (up) assert.ok(all, `${s.id} at ${s.x},${s.y}: the cell at ${tx},${ty} is raised but the sim walks some of it`);
        if (up) cells++;
      }
    }
    if (region !== 'vale' && kind === 'town') assert.ok(cells > 100, `the circuit raised: ${cells} cells`);
  });

  test(`${region} ${kind}: a home is drawn on exactly the tiles the sim walls for it`, () => {
    const { w, c } = build(kind, region), { x: X0, y: Y0 } = c.origin, houses = c.level.objects.filter((o) => o.type === 'house');
    let n = 0;
    for (const s of w.structs) {
      if (!isHome(w, s)) continue;
      const [a, b, cc, d] = homeWalls(s.id, s.x, s.y), cx = ((a + cc) / 2 - X0) / 2, cz = ((b + d) / 2 - Y0) / 2;
      const h = houses.find((o) => Math.abs(o.x - cx) < 0.01 && Math.abs(o.z - cz) < 0.01);
      if (!h) continue;                                          // (outside the level's crop)
      n++;
      assert.ok(Math.abs((h.opts.width + 0.2) * 2 - (cc - a)) < 0.03 && Math.abs((h.opts.depth + 0.2) * 2 - (d - b)) < 0.03, `${s.id}: drawn ${h.opts.width} × ${h.opts.depth} on ${cc - a} × ${d - b} tiles`);
      for (let y = b; y < d; y++) for (let x = a; x < cc; x++) assert.ok(blocked(w, x, y), `${s.id}: the sim walks ${x},${y} inside its walls`);
      for (const [x, y] of [[a - 1, (b + d) >> 1], [cc, (b + d) >> 1], [(a + cc) >> 1, b - 1], [(a + cc) >> 1, d]]) {   // (its wall stops at the walls drawn: what's past them is whatever else stands there)
        if (!blocked(w, x, y)) continue;
        assert.ok(w.structs.some((q) => q !== s && q.id !== s.id && Math.abs(q.x - x) < 25 && Math.abs(q.y - y) < 25), `${s.id}: walled past its walls at ${x},${y}`);
      }
    }
    if (kind === 'town') assert.ok(n >= 10, `${n} homes drawn`);
  });
}

test('a tree the converter draws bare is walled at its trunk; one it draws in leaf by its crown', () => {
  const TREES = { oak: 'oak', autumn: 'autumn', birch: 'birch', pine: 'pine', dead: 'deadwood', alder: 'oak', willow: 'birch', carr: 'oak' };
  const BARE = new Set(['deadwood', 'bare']);
  for (const region of Object.keys(BIOME_OF)) {
    const B = BIOMES[BIOME_OF[region]];
    for (const [kind, drawn] of Object.entries(TREES)) {
      const tk = B.trees[drawn] || drawn;
      assert.equal(bareTree(region, `${kind}_1`), BARE.has(tk), `${region}: ${kind} is drawn as ${tk}`);
    }
  }
  const o = createOutdoor(SEED, 'town', 'reach'), t = o.structs.find((s) => /^oak_/.test(s.id));
  let n = 0; for (let y = Math.floor(t.y) - 8; y <= t.y + 8; y++) for (let x = Math.floor(t.x) - 8; x <= t.x + 8; x++) if (Math.hypot(x + 0.5 - t.x, y + 0.5 - t.y) < 6 && blocked(o, x, y)) n++;
  assert.ok(n <= 8, `Ashgate's dead oak walls ${n} tiles round it`);
});

test('a mountain is raised above a step only where the sim walls the whole cell', () => {
  for (const region of ['reach', 'heights']) {
    const { w, c } = build('overland', region), { x: X0, y: Y0 } = c.origin, L = c.level;
    let up = 0;
    for (let j = 0; j < L.depth; j++) for (let i = 0; i < L.width; i++) {
      if (parseInt(L.heights[j][i], 36) <= 3 || L.tiles[j][i] !== BIOMES[BIOME_OF[region]].mountain) continue;
      up++;
      const tx = X0 + 2 * i, ty = Y0 + 2 * j;
      for (const [dx, dy] of [[0, 0], [1, 0], [0, 1], [1, 1]]) assert.ok(blocked(w, tx + dx, ty + dy), `${region}: a mountain's cell at ${tx},${ty} is raised but the sim walks ${tx + dx},${ty + dy}`);
    }
    assert.ok(up > 200, `${region}: ${up} cells of mountain`);
  }
});

test('companions at ease keep their bodies off the walls (Ashgate, walked about with two hired)', () => {
  const sim = createSim(SEED, undefined, { scene: 'town', region: 'reach' });
  sim.state.counters.gold = 1e6; sim.state.party[0].level = 6; sim.tick();
  for (const idx of [0, 1]) { sim.commands.push({ type: 'hire', idx }); sim.tick(); }
  const w = sim.world, R = 0.25, onWall = (u) => [[-R, -R], [R, -R], [-R, R], [R, R]].some(([dx, dy]) => !isWalkable(w, u.x + dx, u.y + dy));
  let samples = 0, bad = 0;
  for (const [tx, ty] of [[40, 60], [100, 30], [30, 95], [95, 95], [66, 66], [130, 40], [24, 40], [88, 50]]) {
    sim.commands.push({ type: 'tap', tx, ty });
    for (let t = 0; t < 20 * 40; t++) {
      sim.tick(); if (sim.world !== w) break;
      for (const m of sim.state.party.slice(1)) { samples++; if (onWall(m)) bad++; }
      if (!sim.state.player.path && t > 60) break;
    }
  }
  assert.ok(samples > 1000, `${samples} samples`);
  assert.equal(bad, 0, `${bad} of ${samples} companion samples with a body on a wall's tile`);
});
