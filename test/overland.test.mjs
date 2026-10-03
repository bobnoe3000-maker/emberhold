// The Vale's landscape (docs/art-critic-pass-10.md): ranges past the map's edge, woods where you walk, filleted
// roads with aprons at their joins, a river that meanders and breathes and still runs under both bridges, the Tithe
// Mill's wheel on its race; and every site still reachable from the town's gate.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createOutdoor, groundAt, G } from '../src/sim/outdoor.js';
import { ENV_FOOT } from '../src/sim/envfoot.js';
import { isWalkable } from '../src/sim/world.js';

const o = createOutdoor(20260807, 'overland');
const inMap = (s) => s.x >= 0 && s.x <= 260 && s.y >= 0 && s.y <= 260;

test('the roads have no elbows: every turn under 25°, and each join has its apron', () => {
  for (const r of o.roads) for (let i = 1; i + 1 < r.pts.length; i++) {
    const [a, b, c] = [r.pts[i - 1], r.pts[i], r.pts[i + 1]], u = [b[0] - a[0], b[1] - a[1]], v = [c[0] - b[0], c[1] - b[1]];
    const deg = Math.acos(Math.max(-1, Math.min(1, (u[0] * v[0] + u[1] * v[1]) / Math.hypot(...u) / Math.hypot(...v)))) * 180 / Math.PI;
    assert.ok(deg < 25, `a ${Math.round(deg)}° turn at ${b.map((q) => q.toFixed(1))}`);
  }
  assert.ok(o.aprons.length >= 5, `${o.aprons.length} aprons`);   // the crossroads (four roads), the mine, camp, mill and chapel forks
  assert.equal(o.roads.filter((r) => r.surface === 'track').length, 4, 'the mill, chapel, camp and warren spurs are tracks');
});

test('no mountain on the walked map; the north range stands twice the keep', () => {
  const m = o.structs.filter((s) => /mountain/.test(s.id));
  for (const s of m) { const f = ENV_FOOT[s.id]; assert.ok(!(s.x + f[2] > 0 && s.x + f[0] < 260 && s.y + f[3] > 0 && s.y + f[1] < 260), `${s.id} at ${s.x.toFixed(0)},${s.y.toFixed(0)}`); }
  assert.ok(m.some((s) => s.id === 'mountain_massif_A'), 'a great massif in the range');
});

test('woods where you walk: 25–35 % of the map within 8 tiles of a tree, 40+ groves on it', () => {
  const tr = o.structs.filter((s) => /^(pine|oak|autumn|dead|grove)/.test(s.id));
  let near = 0, n = 0; for (let y = 0; y < 260; y += 4) for (let x = 0; x < 260; x += 4) { n++; if (tr.some((s) => Math.hypot(s.x - x, s.y - y) < 8)) near++; }
  assert.ok(near / n >= 0.25 && near / n <= 0.35, `cover ${(near / n * 100).toFixed(1)} %`);
  assert.ok(tr.filter((s) => inMap(s) && /grove/.test(s.id)).length >= 40);
  assert.ok(o.structs.filter((s) => /^rock_[FGH]$/.test(s.id) && inMap(s)).length <= 30, 'rocks mostly off the meadow');
});

test('the farms keep their fields, and wheat stands on them (pass 10 lost the fields; 11d restored them)', () => {
  assert.equal(o.fields.length, 3);
  assert.ok(o.structs.filter((s) => /^wheat_/.test(s.id)).length >= 40, 'wheat on the fields');
});

test('the river runs under both bridges (both ramps on land) and the mill wheel turns in its race', () => {
  for (const b of o.structs.filter((s) => s.id === 'bridge_90')) {
    assert.equal(groundAt(o, b.x, b.y).g, G.WATER, `water under the bridge at ${b.x},${b.y}`);
    for (const dx of [-9.2, 9.2]) assert.notEqual(groundAt(o, b.x + dx, b.y).g, G.WATER, `the ramp at ${b.x + dx} is in the water`);
  }
  const mill = o.structs.find((s) => s.id === 'watermill_0'), f = ENV_FOOT.watermill_0;
  let d = Infinity; for (let y = mill.y - 2; y <= mill.y + 2; y += 0.25) for (let x = mill.x + f[2] - 1; x < mill.x + f[2] + 3; x += 0.25) if (groundAt(o, x, y).g === G.WATER) d = Math.min(d, x - (mill.x + f[2]));
  assert.ok(d <= 1, `the wheel is ${d} tiles from water`);
  const w = []; for (let s = 0; s < o.rivers[0].pts.length; s++) w.push(o.rivers[0].pts[s][2]);
  assert.ok(Math.max(...w) - Math.min(...w) > 4, 'the width breathes');
});

test('no road under the river but at a bridge; every site reachable from the gate', () => {
  const bridges = o.structs.filter((s) => s.id === 'bridge_90');
  for (const r of o.roads) for (let i = 0; i + 1 < r.pts.length; i++) for (let t = 0; t <= 1; t += 0.25) {
    const x = r.pts[i][0] + (r.pts[i + 1][0] - r.pts[i][0]) * t, y = r.pts[i][1] + (r.pts[i + 1][1] - r.pts[i][1]) * t;
    if (groundAt(o, x, y).g === G.WATER) assert.ok(bridges.some((b) => Math.abs(x - b.x) < 10 && Math.abs(y - b.y) < 4), `a road in the river at ${x.toFixed(1)},${y.toFixed(1)}`);
  }
  const a = o.arrivals.default, seen = new Set(), q = [[Math.floor(a.x), Math.floor(a.y)]];
  while (q.length) { const [x, y] = q.pop(), k = x + ',' + y; if (seen.has(k) || x < -20 || y < -20 || x > 280 || y > 280 || !isWalkable(o, x + 0.5, y + 0.5)) continue; seen.add(k); q.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]); }
  for (const [id, v] of Object.entries(o.arrivals)) assert.ok(seen.has(Math.floor(v.x) + ',' + Math.floor(v.y)), `${id} can't be reached`);
});

test('the fields are walled and fenced on their back edges, never across a road or the water (pass 11g)', () => {
  const t = createOutdoor(20260807, 'town', 'vale');
  for (const [w, min] of [[t, 3], [o, 2]]) {
    const runs = w.structs.filter((s) => /^(fence|drywall)_(0|90)$/.test(s.id));
    assert.ok(runs.length >= min, `${w.kind}: ${runs.length} runs`);
    for (const s of runs) {
      const f = ENV_FOOT[s.id];
      for (let y = Math.floor(s.y + f[1] + 0.2); y <= Math.floor(s.y + f[3] - 0.2); y++) for (let x = Math.floor(s.x + f[0] + 0.2); x <= Math.floor(s.x + f[2] - 0.2); x++) {
        const g = groundAt(w, x + 0.5, y + 0.5).g; assert.ok(g === G.GRASS || g === G.FIELD, `${w.kind}: ${s.id} at ${s.x.toFixed(0)},${s.y.toFixed(0)} on ground ${g}`);
      }
    }
  }
  assert.ok(o.structs.some((s) => s.id.startsWith('drywall_')), 'a dry-stone wall in the Vale');
});

test('no tree on a road: no crown over a road or plaza, in any seed (the owner, 2026-10-03)', () => {
  const TREE = /^(pine|oak|autumn|birch|dead|grove)_/, ROAD = new Set([G.DIRT, G.COBBLE]);
  for (const seed of [20260807, 1, 42, 777, 31337, 191056]) for (const [kind, region] of [['overland', 'vale'], ['town', 'vale']]) {
    const w = createOutdoor(seed, kind, region);
    for (const s of w.structs) if (TREE.test(s.id) && s.x > -20 && s.y > -20) {
      const f = ENV_FOOT[s.id];
      const cx = s.x + (f[0] + f[2]) / 2, cy = s.y + (f[1] + f[3]) / 2, rx = (f[2] - f[0]) / 2, ry = (f[3] - f[1]) / 2;   // the crown: the ellipse in the footprint
      for (let y = Math.floor(s.y + f[1]); y <= Math.floor(s.y + f[3]); y++) for (let x = Math.floor(s.x + f[0]); x <= Math.floor(s.x + f[2]); x++) if (((x + 0.5 - cx) / rx) ** 2 + ((y + 0.5 - cy) / ry) ** 2 <= 1)
        assert.ok(!ROAD.has(groundAt(w, x + 0.5, y + 0.5).g), `${kind} seed ${seed}: ${s.id} at ${s.x.toFixed(0)},${s.y.toFixed(0)} over ${x},${y}`);
    }
  }
});

test('the easy sites lie near Thornwick, the hard ones far out (the owner, 2026-10-03)', async () => {
  const { levelBand } = await import('../src/sim/sites.js');
  const gate = o.labels.find((l) => l.text === 'Thornwick'), rows = o.labels.filter((l) => l.site).map((l) => ({ id: l.site, d: Math.hypot(l.x - gate.x, l.y - gate.y), lv: String(levelBand(l.site)).split('–').map(Number) }));
  for (const r of rows) if (r.lv.length === 1) r.lv.push(r.lv[0]);
  rows.sort((a, b) => a.d - b.d);
  for (let i = 1; i < rows.length; i++) {
    const a = rows[i - 1], b = rows[i];
    assert.ok(a.lv[1] <= b.lv[1] && a.lv[0] <= b.lv[0], `${a.id} (${a.lv.join('–')}, ${a.d.toFixed(0)} tiles) is nearer than ${b.id} (${b.lv.join('–')}, ${b.d.toFixed(0)} tiles)`);
  }
});
