// Dungeon layouts and room sizes (docs/dungeon-halls-proposal.md, decided 2026-10-10; GDD §3.1 v1.46): the caverns and
// the halls, rooms in three sizes with the descent room large, every room joined, the halls straight and short, the
// walls toward the camera cut down, the same floor from the same seed, and each site on its layout.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { generateLevel, ROOM_SIZES, FLOOR_Z, WALL_Z } from '../src/sim/level.js';
import { WALL_REACH, HALL_W } from '../src/sim/halls.js';
import { SITES } from '../src/sim/sites.js';
import { createSim } from '../src/sim/core.js';

const K = (x, y) => x + ',' + y;
const CASES = [[6, 6], [4, 4], [2, 2], undefined];
const floors = (layout, n = 40) => CASES.flatMap((rooms) => Array.from({ length: n }, (_, i) => generateLevel((i + 1) * 7919, 'dread', { rooms, layout })));
const reached = (L) => {
  const st = K(Math.floor(L.spawn.x), Math.floor(L.spawn.y)), seen = new Set([st]), q = [st], got = new Set();
  while (q.length) { const t = q.pop(), c = L.cells.get(t); if (c.room >= 0) got.add(c.room); const [x, y] = t.split(',').map(Number); for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const n = K(x + dx, y + dy), cc = L.cells.get(n); if (cc && cc.kind === 'floor' && !seen.has(n)) { seen.add(n); q.push(n); } } }
  return got;
};

for (const layout of ['caverns', 'halls']) {
  test(`${layout}: rooms in three sizes, the descent room large, a floor of four or more has all three`, () => {
    for (const L of floors(layout)) {
      assert.equal(L.layout, layout);
      assert.equal(L.descentRoom.size, 'large', 'the descent room (the boss\'s hall) is large');
      for (const r of L.rooms) {
        const [lo, hi] = ROOM_SIZES[r.size], w = layout === 'halls' ? r.x1 - r.x0 + 1 : 2 * r.rw + 1, h = layout === 'halls' ? r.y1 - r.y0 + 1 : 2 * r.rh + 1;
        assert.ok(w <= hi + 1 && h <= hi + 1, `${r.size} room ${w} × ${h} is over ${hi}`);
        if (layout === 'halls') assert.ok(w >= lo && h >= lo, `${r.size} room ${w} × ${h} is under ${lo}`);
      }
      if (L.rooms.length >= 4) assert.deepEqual(new Set(L.rooms.map((r) => r.size)), new Set(['small', 'medium', 'large']));
      if (layout === 'caverns') assert.notEqual(L.entrance.size, 'small', 'a cavern entrance is never small (the stair up wants its back wall)');
    }
  });
  test(`${layout}: every room is joined to the entrance, and the same seed builds the same floor`, () => {
    for (const L of floors(layout, 25)) assert.equal(reached(L).size, L.rooms.length);
    const a = generateLevel(4242, 'mire', { rooms: [6, 6], layout }), b = generateLevel(4242, 'mire', { rooms: [6, 6], layout });
    assert.deepEqual([...a.cells], [...b.cells]);
  });
}

test('caverns: sizes shrink rooms where they stand; a large room and every corridor are where they were', () => {
  // (the sizes are their own stream: a floor's rooms keep their places and shapes, and its large rooms their extents)
  for (let s = 1; s <= 20; s++) {
    const L = generateLevel(s * 7919, 'dread', { layout: 'caverns' });
    for (const r of L.rooms) assert.ok(r.rw >= 9 && r.rh >= 9 && r.rw <= 31 && r.rh <= 31);
    for (const r of L.rooms.filter((q) => q.size === 'large')) assert.ok(r.rw >= 20 && r.rh >= 20, 'a large room is the size it always was');
  }
});

test('halls: every room a rectangle; the halls straight, 6 wide and short; nothing but halls between rooms', () => {
  const lens = [];
  for (const L of floors('halls')) {
    for (const r of L.rooms) for (let y = r.y0; y <= r.y1; y++) for (let x = r.x0; x <= r.x1; x++) { const c = L.cells.get(K(x, y)); assert.ok(c && c.kind === 'floor' && c.room === r.id, 'a room is a whole rectangle'); }
    const seen = new Set();
    for (const [k, c] of L.cells) {
      if (c.kind !== 'floor' || c.room >= 0 || seen.has(k)) continue;
      const q = [k], comp = []; seen.add(k);
      while (q.length) { const t = q.pop(); comp.push(t); const [x, y] = t.split(',').map(Number); for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const n = K(x + dx, y + dy), cc = L.cells.get(n); if (cc && cc.kind === 'floor' && cc.room < 0 && !seen.has(n)) { seen.add(n); q.push(n); } } }
      const xs = comp.map((t) => +t.split(',')[0]), ys = comp.map((t) => +t.split(',')[1]), w = Math.max(...xs) - Math.min(...xs) + 1, h = Math.max(...ys) - Math.min(...ys) + 1;
      assert.equal(comp.length, w * h, 'a hall is a straight run (a rectangle)'); assert.equal(Math.min(w, h), HALL_W);
      lens.push(Math.max(w, h));
    }
  }
  lens.sort((a, b) => a - b);
  assert.ok(lens[0] >= 8, `a hall shorter than 8: ${lens[0]}`);
  assert.ok(lens[Math.floor(lens.length * 0.95)] <= 14, `95 % of halls are 14 tiles or less (${lens[Math.floor(lens.length * 0.95)]})`);
});

test('halls: a wall that would hide floor from the camera is a stub, every other wall stands; nothing walks over either', () => {
  for (const L of floors('halls', 10)) for (const [k, c] of L.cells) {
    if (c.kind !== 'wall') continue;
    const [x, y] = k.split(',').map(Number);
    let hides = false;
    for (let s = 1; s <= WALL_REACH && !hides; s++) for (let i = 0; i <= s && !hides; i++) { const f = L.cells.get(K(x - i, y - (s - i))); if (f && f.kind === 'floor' && Math.abs(i - (s - i)) <= 2) hides = true; }
    assert.equal(c.wz, hides ? FLOOR_Z + 2 : WALL_Z);
    assert.ok(c.wz - FLOOR_Z >= 2, 'a stub still stands above the climb rule');
  }
});

test('each site is on its layout: halls for what was built (the Old Barrows\' crypts too, v1.48), caverns for what was dug or grew', () => {
  const halls = ['barrows', 'tithe_mill', 'wickham_keep', 'sunken_chapel', 'ninth_milestone', 'canal_locks', 'drowned_abbey', 'mere_tower', 'reedholm_undercroft'];
  for (const [id, S] of Object.entries(SITES)) assert.equal(S.layout || 'caverns', halls.includes(id) ? 'halls' : 'caverns', id);
  for (const id of ['wickham_keep', 'barrows', 'toadking_mound']) {
    const w = createSim(20260807, undefined, { scene: 'dungeon', site: id }).world;
    assert.equal(w.level.layout, halls.includes(id) ? 'halls' : 'caverns');
    assert.ok(w.exitAt && w.stairArrive, `${id}: the stair up stands`);
  }
});

test('a small room holds four foes at once at most; a large one takes the full wave of five (battle.js SIZE_CAP)', () => {
  const most = (size) => {
    const sim = createSim(20260807, undefined, { scene: 'dungeon', site: 'wickham_keep' }), L = sim.world.level, r = L.rooms.find((q) => q.size === size && q !== L.entrance && q !== L.descentRoom), p = sim.state.player;
    sim.world.roomLevels.set(r.id, 12); p.x = p.px = r.cx + 0.5; p.y = p.py = r.cy + 0.5;
    let n = 0; sim.bus.on('wave', () => { n = Math.max(n, sim.world.enemies.filter((e) => !e.dead && e.hp > 0).length); });
    for (let i = 0; i < 40; i++) sim.tick();
    return n;
  };
  assert.equal(most('small'), 4); assert.equal(most('large'), 5);
});
