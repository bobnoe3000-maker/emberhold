// The town's layout (docs/town-layout-proposal.md): a walled town you enter only by its gate, five services round the
// square with every entrance on a face the camera sees and toward the well, room between them, every door in the
// square's home-screen frame, the camera leading to the gate on the approach; Thornwick's circuit timber, walled on
// the overland too. Every region's town is the same layout.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createOutdoor, REGIONS, groundAt, G } from '../src/sim/outdoor.js';
import { ENV_FOOT } from '../src/sim/envfoot.js';
import { isWalkable } from '../src/sim/world.js';

const TOWN = JSON.parse(readFileSync('tools/actor-lab/town.json', 'utf8'));
const rect = (s) => { const f = ENV_FOOT[s.id]; return [s.x + f[0], s.y + f[1], s.x + f[2], s.y + f[3]]; };
const gap = (a, b) => Math.hypot(Math.max(a[0] - b[2], b[0] - a[2], 0), Math.max(a[1] - b[3], b[1] - a[3], 0));
// the door: the middle of the +x face (faceX in town.json) or the +y face, the only two the camera sees
const door = (s, faceX) => { const r = rect(s); return faceX ? { x: r[2], y: (r[1] + r[3]) / 2, n: [1, 0] } : { x: (r[0] + r[2]) / 2, y: r[3], n: [0, 1] }; };

for (const region of Object.keys(REGIONS)) {
  const o = createOutdoor(1, 'town', region), entry = (id) => TOWN[region].find((e) => e.id === id);
  const well = o.structs.find((s) => s.id === `${region}_well_1` || s.id === `${region}_cistern_1`), gate = o.structs.find((s) => s.id === `${region}_gatehousey_1`);

  const way = !!o.waystation;                                   // (M8: a waystation such as Saltmere: its tavern, shop, inn and temple, no forge, no wall)
  test(`${region}: every entrance faces the well, on a face the camera sees`, () => {
    assert.equal(o.services.length, way ? 4 : 5);
    if (way) assert.deepEqual(o.services.map((v) => v.kind).sort(), ['inn', 'shop', 'tavern', 'temple']);   // (Saltmere's inn: 2026-10-05; its shop, v1.44)
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

  if (!way) test(`${region}: the walls are closed — the way out is only through the gate`, () => {
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

  if (way) test(`${region}: a waystation has no wall: the square reaches the way out, and the camera leads in along the boardwalk`, () => {
    const exit = o.exits.find((e) => e.to === 'overland'), seen = new Set(), q = [[Math.floor(well.x), Math.floor(well.y) + 4]]; let out = false;
    while (q.length && !out) { const [x, y] = q.pop(), k = x + ',' + y; if (seen.has(k) || !isWalkable(o, x + 0.5, y + 0.5)) continue; if (x >= exit.x0 && x < exit.x1 && y >= exit.y0 && y < exit.y1) out = true; seen.add(k); q.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]); }
    assert.ok(out, 'the square should reach the way out');
    const a = o.arrivals.overland, L = o.lead; assert.ok(a.x > L.x0 && a.x < L.x1 && a.y > L.y0 && a.y < L.y1, 'the arrival is off the approach'); assert.ok(L.k > 0 && L.k < 1);
  });
  if (!way) test(`${region}: on the approach road the camera leads to the gate`, () => {
    const a = o.arrivals.overland, L = o.lead;
    assert.ok(a.x > L.x0 && a.x < L.x1 && a.y > L.y0 && a.y < L.y1, 'the arrival is off the approach road');
    assert.deepEqual([L.x, L.y], [gate.x, gate.y]); assert.ok(L.k > 0 && L.k < 1);
  });
}

test("Thornwick's circuit is timber; the other towns' stone", () => {
  for (const [region, list] of Object.entries(TOWN)) {
    if (createOutdoor(1, 'town', region).waystation) continue;   // (Saltmere has no wall; its walled pieces stay baked for a preview)
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

// the nature pack (docs/nature-pack-proposal.md): undergrowth dresses the town and the Vale, but never the square or a
// site's way in, and it's placed last, on its own stream, so it can't move a tree, a rock or a house
for (const [kind, region] of [['town', 'vale'], ['town', 'fens'], ['overland', 'vale']]) test(`${kind} (${region}): undergrowth grows, placed last, off the square and the sites`, () => {
  const o = createOutdoor(1, kind, region), ug = (s) => s.id.startsWith('ug_'), first = o.structs.findIndex(ug);
  assert.ok(o.structs.filter(ug).length >= 30, 'too little undergrowth');
  assert.ok(o.structs.slice(first).every((s) => ug(s) || /^rock_[FGH]$/.test(s.id)), 'something was placed after the undergrowth');
  if (o.hub) for (const s of o.structs.filter(ug)) assert.ok(Math.hypot(s.x - o.hub.x, s.y - o.hub.y) >= o.hub.r + 4, `${s.id} in the square at ${s.x.toFixed(1)},${s.y.toFixed(1)}`);
  for (const e of o.exits.filter((x) => x.to === 'dungeon' || x.to === 'town')) {
    const cx = (e.x0 + e.x1) / 2, cy = (e.y0 + e.y1) / 2;
    for (const s of o.structs.filter(ug)) assert.ok(Math.hypot(s.x - cx, s.y - cy) >= 6, `${s.id} at a way in (${e.site || e.to})`);
  }
});

// Nothing placed stands on a road (2026-10-04, the owner: a stilt house sat on the canal road): every road tile a
// building, rock or prop blocks is one of a road's own ends, at the thing it leads to (a gate, the camp, the barrow)
test('no house, rock or prop stands on a road, in either land', () => {
  const ok = /gatehouse|lumbermill|^ruin$/;
  for (const region of ['vale', 'fens']) for (const seed of [20260807, 7, 3096714577]) {
    const o = createOutdoor(seed, 'overland', region);
    for (let y = 0; y < o.H; y++) for (let x = 0; x < o.W; x++) {
      const g = groundAt(o, x + 0.5, y + 0.5).g; if (g !== G.DIRT && g !== G.COBBLE && g !== G.DECK) continue;
      if (!o.blocked[(y + o.PAD) * o.GW + x + o.PAD]) continue;
      const by = o.structs.filter((s) => { const f = ENV_FOOT[s.id]; return f && x + 0.5 >= s.x + f[0] && x + 0.5 <= s.x + f[2] && y + 0.5 >= s.y + f[1] && y + 0.5 <= s.y + f[3]; });
      assert.ok(by.some((s) => ok.test(s.id)), `${region} ${seed}: the road at ${x},${y} is blocked by ${by.map((s) => s.id).join(', ') || 'nothing placed'}`);
    }
  }
});

test('Saltmere on the Fens: the boardwalk runs in off the canal road, through the landing gate, under its name', () => {
  const o = createOutdoor(20260807, 'overland', 'fens'), gate = o.structs.find((s) => s.id === 'fens_landing_1'), into = o.exits.find((e) => e.to === 'town');
  const label = o.labels.find((l) => l.text === 'Saltmere'), a = o.arrivals.saltmere;
  assert.ok(gate && Math.abs(label.x - gate.x) < 1 && Math.abs(label.y - gate.y) < 1, 'the name is over the gate');
  assert.ok(into.x1 >= gate.x - 0.5 && into.x0 < gate.x && gate.y > into.y0 && gate.y < into.y1, 'the way in is through the gate');
  assert.ok(a.x > gate.x && Math.abs(a.y - gate.y) < 1, 'you arrive on the boardwalk, facing the gate');
  for (let x = Math.floor(gate.x); x <= a.x; x++) assert.ok(isWalkable(o, x + 0.5, gate.y), `the boardwalk is open at ${x}`);
});

// The town set (art critic pass 14; 2026-10-10, the owner: "add them to the town layouts.. make sure placement makes
// sense and is not in the way"): the one-storey homes and the common things are in every town, none stands on a road
// or in the walk from where you wake to a door, and every door, the homes' too, can still be walked to.
const SET = /_(cottagex?|longhousex?|workshopx?|foodstandx?|standard|lanewell)_\d$|^(windmill|cart|handcart|table|boxes|lamppost|bench|trough|woodpile)_\d+$/;
const HOME = /_(housex?|cottagex?|longhousex?|workshopx?)_\d$/;
const segDist = (px, py, [ax, ay], [bx, by]) => { const vx = bx - ax, vy = by - ay, t = Math.max(0, Math.min(1, ((px - ax) * vx + (py - ay) * vy) / (vx * vx + vy * vy || 1))); return Math.hypot(px - ax - t * vx, py - ay - t * vy); };
const rectDist = (r, x, y) => Math.hypot(Math.max(r[0] - x, x - r[2], 0), Math.max(r[1] - y, y - r[3], 0));
for (const region of Object.keys(REGIONS)) test(`${region}: the town set is placed, off the roads, out of the way, every door still walked to`, () => {
  const o = createOutdoor(1, 'town', region), entry = (id) => TOWN[region].find((e) => e.id === id), set = o.structs.filter((s) => SET.test(s.id));
  const kinds = new Set(set.map((s) => s.id.replace(`${region}_`, '').replace(/x?_\d+$/, '')));
  for (const k of ['cottage', 'longhouse', 'workshop', 'foodstand', 'standard', 'lamppost', 'table', 'boxes', 'handcart']) assert.ok(kinds.has(k), `no ${k} in ${region}`);
  if (!o.waystation) for (const k of ['lanewell', 'cart', 'trough', 'woodpile', 'bench']) assert.ok(kinds.has(k), `no ${k} in ${region}`);
  assert.equal(kinds.has('windmill'), region === 'vale', 'the windmill is the Vale\'s');
  // off every road: no footprint tile within the road's half-width of its line
  for (const s of set) { const r = rect(s);
    for (let y = Math.floor(r[1]); y <= Math.floor(r[3]); y++) for (let x = Math.floor(r[0]); x <= Math.floor(r[2]); x++)
      for (const rd of o.roads) for (let i = 0; i + 1 < rd.pts.length; i++) assert.ok(segDist(x + 0.5, y + 0.5, rd.pts[i], rd.pts[i + 1]) > rd.w / 2, `${s.id} at ${s.x},${s.y} is on a road`); }
  // out of the way: 2 tiles clear of the straight walk from each arrival in the square to each service's door
  const doorOf = (s) => door(s, !!(entry(s.id) || {}).faceX);
  for (const a of [o.arrivals.default, o.arrivals.temple]) for (const sv of o.services) {
    const d = doorOf(sv), b = [d.x + d.n[0], d.y + d.n[1]];
    for (const s of set) for (let t = 0; t <= 1; t += 0.02) { const x = a.x + (b[0] - a.x) * t, y = a.y + (b[1] - a.y) * t;
      assert.ok(rectDist(rect(s), x, y) >= 2, `${s.id} at ${s.x},${s.y} is in the way to the ${sv.kind}`); }
  }
  // every door walked to from where you wake: the tile a step out of the door's face, somewhere along its middle
  const seen = new Set(), q = [[Math.floor(o.arrivals.default.x), Math.floor(o.arrivals.default.y)]];
  while (q.length) { const [x, y] = q.pop(), k = x + ',' + y; if (seen.has(k) || x < -20 || y < -20 || x > o.W + 20 || y > o.H + 20 || !isWalkable(o, x + 0.5, y + 0.5)) continue; seen.add(k); q.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]); }
  for (const s of [...o.services, ...o.structs.filter((t) => HOME.test(t.id))]) {
    const r = rect(s), fx = !!(entry(s.id) || {}).faceX, span = fx ? [r[1], r[3]] : [r[0], r[2]], m = (span[1] - span[0]) * 0.2;
    let ok = false; for (let u = Math.floor(span[0] + m); u <= span[1] - m && !ok; u++) ok = seen.has(fx ? `${Math.floor(r[2] + 0.6)},${u}` : `${u},${Math.floor(r[3] + 0.6)}`);
    assert.ok(ok, `${s.id} at ${s.x},${s.y}: its door can't be walked to`);
  }
});

// The square is the home screen and its plaques are its menu (2026-10-10, the owner: "Make sure the town square menu
// layout stays for each town"): every walled town has the same five services in the same places, each plaque at the
// same spot and at a set height, not its roof's, so a building's art can't move the menu
test('the square\'s menu is the same in every town: services, doors and plaques in the same places, plaques at set heights', () => {
  const towns = Object.keys(REGIONS).map((r) => createOutdoor(1, 'town', r)).filter((o) => !o.waystation);
  const menu = (o) => o.services.map((sv) => { const L = o.labels.find((l) => l.service === sv.kind); return { kind: sv.kind, x: sv.x, y: sv.y, at: [L.x, L.y], top: L.top }; });
  assert.ok(towns.length >= 3);
  for (const o of towns) {
    assert.deepEqual(menu(o), menu(towns[0]), `${o.name}'s square differs from ${towns[0].name}'s`);
    assert.ok(menu(o).every((m) => m.top > 0), `${o.name}: a plaque hangs at its roof's height, not a set one`);
  }
  assert.deepEqual(Object.fromEntries(menu(towns[0]).map((m) => [m.kind, m.top])), { temple: 23.5, tavern: 15.1, shop: 13.4, smith: 11.1, inn: 18.7 });
  const salt = createOutdoor(1, 'town', 'fens');
  assert.ok(salt.labels.filter((l) => l.service).every((l) => l.top > 0), 'Saltmere: a plaque hangs at its roof\'s height');
});
