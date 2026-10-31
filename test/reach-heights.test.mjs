// The Cinder Reach's and the Pale Heights' overlands (docs/reach-heights-overlands.md; world doc v1.34 §3.3, §3.4):
// each its own builder and streams, not the Vale's; deterministic; every exit and arrival on walkable ground; the town
// gate, every landmark and every road out reachable from where you arrive; no struct on a road; the roads out shut with
// their words; the town scene's gate and the overland's agree. Not playable lands: the preview only.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createOutdoor, oIsWalkable, G } from '../src/sim/outdoor.js';
import { createSim } from '../src/sim/core.js';
import { LANDS } from '../src/sim/regions.js';
import { SITES } from '../src/sim/sites.js';

const LANDS_NEW = { reach: { name: 'The Cinder Reach', town: 'Ashgate' }, heights: { name: 'The Pale Heights', town: 'Frosthold' } };
const shape = (o) => JSON.stringify({ name: o.name, region: o.region, structs: o.structs, exits: o.exits, arrivals: o.arrivals, labels: o.labels, roads: o.roads, rivers: o.rivers, pools: o.pools });
const cache = new Map();
const build = (seed, region) => { const k = seed + region; if (!cache.has(k)) cache.set(k, createOutdoor(seed, 'overland', region)); return cache.get(k); };

// every walkable tile reachable from (x, y), 4-connected over oIsWalkable (tile centres)
function reach(o, x, y) {
  const seen = new Uint8Array(o.GW * o.GH), key = (tx, ty) => (ty + o.PAD) * o.GW + tx + o.PAD, q = [[Math.floor(x), Math.floor(y)]];
  seen[key(q[0][0], q[0][1])] = 1;
  while (q.length) {
    const [tx, ty] = q.pop();
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nx = tx + dx, ny = ty + dy; if (nx < -o.PAD || ny < -o.PAD || nx >= o.W + o.PAD || ny >= o.H + o.PAD) continue;
      const k = key(nx, ny); if (seen[k] || !oIsWalkable(o, nx + 0.5, ny + 0.5)) continue;
      seen[k] = 1; q.push([nx, ny]);
    }
  }
  return (tx, ty) => { const X = Math.floor(tx) + o.PAD, Y = Math.floor(ty) + o.PAD; return X >= 0 && Y >= 0 && X < o.GW && Y < o.GH && !!seen[Y * o.GW + X]; };
}
const boxHas = (e, fn) => { for (let y = Math.floor(e.y0); y < e.y1; y++) for (let x = Math.floor(e.x0); x < e.x1; x++) if (fn(x + 0.5, y + 0.5)) return true; return false; };

for (const [region, L] of Object.entries(LANDS_NEW)) {
  test(`${region}: its own overland, the same on the same seed, not the Vale's`, () => {
    for (const seed of [20260807, 7]) {
      const a = build(seed, region), b = createOutdoor(seed, 'overland', region);
      assert.equal(shape(a), shape(b), `seed ${seed}: built twice, the same`);
      assert.deepEqual([...a.tmat], [...b.tmat]); assert.deepEqual([...a.blocked], [...b.blocked]);
      assert.equal(a.name, L.name); assert.equal(a.region, region); assert.equal(a.kind, 'overland');
      const vale = createOutdoor(seed, 'overland', 'vale');
      assert.notEqual(a.name, vale.name);
      assert.ok(!a.structs.some((s) => /^(vale|fens)_/.test(s.id)), "none of the Vale's or the Fens' buildings (their atlases aren't loaded here)");
      assert.ok(a.structs.some((s) => s.id.startsWith(region + '_')), "its own region's set");
    }
    assert.notEqual(shape(build(20260807, region)), shape(build(7, region)), 'the scatter follows the seed');
    assert.deepEqual(build(20260807, region).exits, build(7, region).exits, 'the ways in and out do not');
  });

  test(`${region}: every exit and arrival on walkable ground, the gate and every landmark reachable from where you arrive`, () => {
    for (const seed of [20260807, 7]) {
      const o = build(seed, region), walk = (x, y) => oIsWalkable(o, x, y);
      for (const [k, a] of Object.entries(o.arrivals)) assert.ok(walk(a.x, a.y), `${seed}: arrival ${k} at ${a.x},${a.y}`);
      for (const e of o.exits) assert.ok(boxHas(e, walk), `${seed}: exit to ${e.to} at ${e.x0},${e.y0}`);
      const can = reach(o, o.arrivals.default.x, o.arrivals.default.y);
      for (const e of o.exits) assert.ok(boxHas(e, can), `${seed}: exit to ${e.to}${e.closed ? ' (shut)' : ''} at ${e.x0},${e.y0} reachable`);
      for (const a of Object.values(o.arrivals)) assert.ok(can(a.x, a.y), `${seed}: arrival at ${a.x},${a.y} reachable`);
      const gate = o.exits.find((e) => e.to === 'town');
      assert.ok(gate && boxHas(gate, can), `${seed}: ${L.town}'s gate reachable`);
      for (const l of o.labels) {
        if (l.text === 'The Ember Throne') continue;             // (half-sunk in the crater's glass: looked at from the Lip)
        let near = false; for (let dy = -14; dy <= 14 && !near; dy++) for (let dx = -14; dx <= 14 && !near; dx++) near = Math.hypot(dx, dy) <= 14 && can(l.x + dx, l.y + dy);
        assert.ok(near, `${seed}: ${l.text} reachable`);
      }
    }
  });

  test(`${region}: no struct stands on a road; the roads run inside the map clear to the edge`, () => {
    for (const seed of [20260807, 7]) {
      const o = build(seed, region);
      for (const r of o.roads) for (let i = 0; i + 1 < r.pts.length; i++) {
        const [ax, ay] = r.pts[i], [bx, by] = r.pts[i + 1], n = Math.ceil(Math.hypot(bx - ax, by - ay) * 2);
        for (let k = 0; k <= n; k++) {
          const x = ax + (bx - ax) * k / n, y = ay + (by - ay) * k / n;
          if (x < 2 || y < 2 || x > 258 || y > 258) continue;
          if (o.exits.some((e) => e.to === 'town' && x < e.x1 + 1 && x > e.x0 - 8 && Math.abs(y - (e.y0 + e.y1) / 2) < 6)) continue;   // (inside the town's walls: the town scene)
          assert.ok(oIsWalkable(o, x, y), `${seed}: ${r.surface} road blocked at ${x.toFixed(1)},${y.toFixed(1)}`);
        }
      }
      const g = (x, y) => o.tmat[(Math.floor(y) + o.PAD) * o.GW + Math.floor(x) + o.PAD];
      assert.ok(o.roads.some((r) => r.imperial), 'an imperial road');
      assert.ok([...o.tmat].includes(G.SCREE), 'its scree');
      if (region === 'heights') assert.ok([...o.tmat].includes(G.SNOW), 'its snow');
      assert.ok(o.structs.some((s) => s.id === 'bridge_90') && o.rivers.length >= 1, 'its river and the bridge over it');
      assert.equal(g(o.arrivals.default.x, o.arrivals.default.y), G.DIRT, 'you arrive on the road');
    }
  });

  test(`${region}: the preview builds it, the roads out are shut with their words, and the town's gate and the overland's agree`, () => {
    assert.ok(!(region in LANDS), 'not a land you can walk to yet');
    assert.ok(!Object.values(SITES).some((s) => s.region === region && !s.parked), 'no open site of its own');
    const sim = createSim(20260807, undefined, { scene: 'overland', region }); sim.tick();
    assert.equal(sim.world.name, L.name); assert.equal(sim.state.region, region);
    const said = []; sim.bus.on('landShut', (e) => said.push(e));
    const shut = sim.world.exits.filter((e) => e.closed);
    assert.ok(shut.length >= 1 && shut.every((e) => typeof e.shut === 'string' && e.shut.length > 20), 'every road out has its word');
    assert.ok(!sim.world.exits.some((e) => e.to === 'dungeon'), 'no site has a door yet');
    for (const e of shut) {
      const p = sim.state.player; p.x = p.px = (e.x0 + e.x1) / 2; p.y = p.py = (e.y0 + e.y1) / 2;
      for (let i = 0; i < 5; i++) sim.tick();
      assert.equal(sim.world.name, L.name, 'you stay'); assert.equal(sim.state.scene, 'overland');
    }
    assert.deepEqual(said.map((e) => e.line), shut.map((e) => e.shut), 'each said once');
    // into the town by its gate, and out again at the overland's gate
    const gate = sim.world.exits.find((e) => e.to === 'town'), p = sim.state.player;
    p.x = p.px = (gate.x0 + gate.x1) / 2; p.y = p.py = (gate.y0 + gate.y1) / 2; sim.tick();
    assert.equal(sim.state.scene, 'town'); assert.equal(sim.world.name, L.town);
    const out = sim.world.exits.find((e) => e.to === 'overland');
    assert.equal(out.arrive, L.town.toLowerCase());
    p.x = p.px = (out.x0 + out.x1) / 2; p.y = p.py = (out.y0 + out.y1) / 2; sim.tick();
    assert.equal(sim.state.scene, 'overland'); assert.equal(sim.world.name, L.name);
    const a = sim.world.arrivals[L.town.toLowerCase()];
    assert.ok(a && Math.hypot(p.x - a.x, p.y - a.y) < 0.5, 'arrived at the gate');
  });
}

test("Thornwick's gate still lets out at the Vale's 'thornwick', and the Vale's overland is still the Vale's", () => {
  const t = createOutdoor(20260807, 'town', 'vale');
  assert.equal(t.exits.find((e) => e.to === 'overland').arrive, 'thornwick');
  assert.equal(createOutdoor(20260807, 'overland', 'vale').name, 'The Hollow Vale');
  assert.equal(createOutdoor(20260807, 'overland', 'fens').name, 'The Greywater Fens');
});
