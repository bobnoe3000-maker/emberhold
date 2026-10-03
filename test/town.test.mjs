// The town's layout (docs/town-layout-proposal.md): a walled town you enter only by its gate, five services round the
// square with every entrance on a face the camera sees and toward the well, room between them, every door in the
// square's home-screen frame, the camera leading to the gate on the approach; Thornwick's circuit timber, walled on
// the overland too. Every region's town is the same layout.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createOutdoor, REGIONS } from '../src/sim/outdoor.js';
import { ENV_FOOT } from '../src/sim/envfoot.js';
import { isWalkable } from '../src/sim/world.js';

const TOWN = JSON.parse(readFileSync('tools/actor-lab/town.json', 'utf8'));
const rect = (s) => { const f = ENV_FOOT[s.id]; return [s.x + f[0], s.y + f[1], s.x + f[2], s.y + f[3]]; };
const gap = (a, b) => Math.hypot(Math.max(a[0] - b[2], b[0] - a[2], 0), Math.max(a[1] - b[3], b[1] - a[3], 0));
// the door: the middle of the +x face (faceX in town.json) or the +y face, the only two the camera sees
const door = (s, faceX) => { const r = rect(s); return faceX ? { x: r[2], y: (r[1] + r[3]) / 2, n: [1, 0] } : { x: (r[0] + r[2]) / 2, y: r[3], n: [0, 1] }; };

for (const region of Object.keys(REGIONS)) {
  const o = createOutdoor(1, 'town', region), entry = (id) => TOWN[region].find((e) => e.id === id);
  const well = o.structs.find((s) => s.id === `${region}_well_1`), gate = o.structs.find((s) => s.id === `${region}_gatehousey_1`);

  test(`${region}: every entrance faces the well, on a face the camera sees`, () => {
    assert.equal(o.services.length, 5);
    for (const sv of o.services) {
      const d = door(sv, !!entry(sv.id).faceX), vx = well.x - d.x, vy = well.y - d.y;
      const deg = Math.acos((vx * d.n[0] + vy * d.n[1]) / Math.hypot(vx, vy)) * 180 / Math.PI;
      assert.ok(deg <= 45, `${sv.kind}'s door is ${Math.round(deg)}° off the well`);
    }
  });

  test(`${region}: the services stand 8+ tiles apart, with every door in the square's frame`, () => {
    for (const a of o.services) for (const b of o.services) if (a !== b) assert.ok(gap(rect(a), rect(b)) >= 8, `${a.kind}–${b.kind}: ${gap(rect(a), rect(b)).toFixed(1)}`);
    // the frame the camera settles on (o.hub.focus): 25 tiles of (x − y) either side, from 93 above to 60 below in (x + y)
    // — between the HUD and the menu bar on a phone (DPR 2+, 390 × 844)
    const F = o.hub.focus;
    for (const sv of o.services) {
      const d = door(sv, !!entry(sv.id).faceX), dd = (d.x - d.y) - (F.x - F.y), ds = (d.x + d.y) - (F.x + F.y);
      assert.ok(Math.abs(dd) < 22 && ds > -93 && ds < 50, `${sv.kind}'s door is out of the frame (${dd.toFixed(1)}, ${ds.toFixed(1)})`);
    }
  });

  test(`${region}: the walls are closed — the way out is only through the gate`, () => {
    const exit = o.exits.find((e) => e.to === 'overland');
    const reach = (shut) => {                                   // flood the walkable tiles from the well; shut = the gate's way through
      const seen = new Set(), q = [[Math.floor(well.x), Math.floor(well.y) + 4]];
      while (q.length) {
        const [x, y] = q.pop(), k = x + ',' + y;
        if (seen.has(k) || x < -40 || y < -40 || x > 200 || y > 180 || !isWalkable(o, x + 0.5, y + 0.5)) continue;
        if (shut && Math.abs(x + 0.5 - gate.x) < 4 && Math.abs(y + 0.5 - gate.y) < 4) continue;
        if (x >= exit.x0 && x < exit.x1 && y >= exit.y0 && y < exit.y1) return true;
        seen.add(k); q.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
      }
      return false;
    };
    assert.ok(reach(false), 'the square should reach the way out through the gate');
    assert.ok(!reach(true), 'with the gate shut the square still reaches the way out: a gap in the walls');
  });

  test(`${region}: you wake in the square (the services bar up, the camera settled), at the temple too after a wipe`, () => {
    for (const k of ['default', 'temple']) { const a = o.arrivals[k]; assert.ok(Math.hypot(a.x - o.hub.x, a.y - o.hub.y) < o.hub.r - 6, `${k} arrival is off the square`); }
  });

  test(`${region}: on the approach road the camera leads to the gate`, () => {
    const a = o.arrivals.overland, L = o.lead;
    assert.ok(a.x > L.x0 && a.x < L.x1 && a.y > L.y0 && a.y < L.y1, 'the arrival is off the approach road');
    assert.deepEqual([L.x, L.y], [gate.x, gate.y]); assert.ok(L.k > 0 && L.k < 1);
  });
}

test("Thornwick's circuit is timber; the other towns' stone", () => {
  for (const [region, list] of Object.entries(TOWN)) {
    const build = (n) => list.find((e) => e.id === `${region}_${n}_1`).build;
    assert.deepEqual(['curtain', 'tower', 'gatehousey'].map(build), region === 'vale' ? ['palisade', 'watchtower', 'timbergate'] : ['curtain', 'tower', 'gatehouse']);
  }
});

test('Thornwick on the overland is walled, its gate on its road, the road west through it gone', () => {
  const o = createOutdoor(1, 'overland'), ids = o.structs.map((s) => s.id);
  assert.ok(ids.includes('vale_gatehousey_1') && ids.filter((i) => i === 'vale_tower_1').length >= 4 && ids.includes('vale_curtain_1'));
  assert.ok(!ids.includes('vale_wally_1'));
  assert.ok(!o.roads.some((r) => r.pts.some(([x]) => x < 0)), 'a road still runs off the map to the west');
  const label = o.labels.find((l) => l.text === 'Thornwick'), into = o.exits.find((e) => e.to === 'town');
  assert.ok(Math.abs(label.x - (into.x0 + into.x1) / 2) < 8 && label.y > into.y0 && label.y < into.y1, 'the way into Thornwick is at its gate');
});
