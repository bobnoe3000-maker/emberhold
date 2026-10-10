// The World map's data (src/ui/wallmap.js, assets/maps/): the copies the game loads stay in step with the sim. Each
// overland's pins are its exits as outdoor.js builds them (on any seed); every coach stop has a place on the wall map,
// inside its own land's area; the lands' areas don't overlap (the fog cuts them out even-odd).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { createOutdoor } from '../src/sim/outdoor.js';
import { LANDS } from '../src/sim/regions.js';
import { COACH } from '../src/sim/coach.js';
import { WALL, PLACES, LAND_AREA } from '../src/ui/wallmap.js';

const ROOT = new URL('..', import.meta.url);
const inside = (pt, poly) => { let c = false; for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) { const [xi, yi] = poly[i], [xj, yj] = poly[j]; if (((yi > pt[1]) !== (yj > pt[1])) && pt[0] < ((xj - xi) * (pt[1] - yi)) / (yj - yi) + xi) c = !c; } return c; };

test('each land\'s map is in assets/maps, and its pins are the overland\'s exits on any seed', () => {
  for (const r of Object.keys(LANDS)) {
    for (const ext of ['png', 'json']) assert.ok(existsSync(new URL(`assets/maps/minimap-${r}.${ext}`, ROOT)), `minimap-${r}.${ext}`);
    const L = JSON.parse(readFileSync(new URL(`assets/maps/minimap-${r}.json`, ROOT), 'utf8'));
    for (const seed of [20260807, 1, 0xdeadbeef]) {
      const o = createOutdoor(seed, 'overland', r);
      const want = o.exits.map((e) => ({ kind: e.to === 'dungeon' ? 'site' : e.to === 'town' ? 'town' : 'land', id: e.site || e.region || r, x: Math.round((e.x0 + e.x1) * 5) / 10, y: Math.round((e.y0 + e.y1) * 5) / 10 }));
      assert.deepEqual(L.pins, want, `${r} on seed ${seed}: rerun node tools/worldmap/minimap.mjs`);
    }
    assert.ok(L.w > 0 && L.h > 0 && L.px === 4);
  }
  assert.ok(existsSync(new URL(WALL.src.replace('./', ''), ROOT)), 'the wall map');
});

test('every coach stop is on the wall map, inside its land; the lands don\'t overlap', () => {
  for (const [id, c] of Object.entries(COACH)) {
    assert.ok(PLACES[id], id);
    assert.ok(LAND_AREA[c.land] && inside(PLACES[id], LAND_AREA[c.land]), `${id} inside ${c.land}`);
    for (const [r, poly] of Object.entries(LAND_AREA)) if (r !== c.land) assert.ok(!inside(PLACES[id], poly), `${id} not in ${r}`);
  }
  // a grid of points: none inside two lands at once
  for (let y = 0; y <= WALL.h; y += 10) for (let x = 0; x <= WALL.w; x += 10) {
    const n = Object.values(LAND_AREA).filter((poly) => inside([x + 0.5, y + 0.5], poly)).length;
    assert.ok(n <= 1, `${x},${y} in ${n} lands`);
  }
});

test('Emberfall on the wall map is the game\'s: each town stands where its overland puts it (art critic pass 12)', async () => {
  const { EMBERFALL } = await import('../src/ui/wallmap.js');
  for (const [land, town] of [['vale', 'thornwick'], ['fens', 'saltmere']]) {
    const e = createOutdoor(1, 'overland', land).exits.find((x) => x.to === 'town'), [x, y] = EMBERFALL[land]((e.x0 + e.x1) / 2, (e.y0 + e.y1) / 2);
    assert.ok(Math.hypot(x - PLACES[town][0], y - PLACES[town][1]) < 24, `${town}: ${x.toFixed(0)},${y.toFixed(0)} vs ${PLACES[town]}`);
  }
  // the roads between the two lands meet
  const out = createOutdoor(1, 'overland', 'vale').exits.find((x) => x.region === 'fens'), back = createOutdoor(1, 'overland', 'fens').exits.find((x) => x.region === 'vale');
  const a = EMBERFALL.vale((out.x0 + out.x1) / 2, (out.y0 + out.y1) / 2), b = EMBERFALL.fens((back.x0 + back.x1) / 2, (back.y0 + back.y1) / 2);
  assert.ok(Math.hypot(a[0] - b[0], a[1] - b[1]) < 12, `${a} vs ${b}`);
});
