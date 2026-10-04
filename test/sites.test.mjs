// Sites as data (M5, docs/m5-plan.md): every dungeon site builds its floors from the seed, its rooms
// sit in its level band, its last floor ends in its hall (no stairs down), and its words in
// content/sites/ match the sim's table. The Old Barrows come out as they always have.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { createSim } from '../src/sim/core.js';
import { createWorld } from '../src/sim/world.js';
import { SITES, SITE_IDS, levelBand, hasFloorBelow } from '../src/sim/sites.js';

const words = Object.fromEntries(readdirSync('content/sites').map((f) => { const j = JSON.parse(readFileSync(`content/sites/${f}`, 'utf8')); return [j.id, j]; }));
const stairsOf = (w) => [...w.props.values()].includes('stairs');

test('content/sites and the sim keep the same sites, names, levels and floors', () => {
  assert.deepEqual(Object.keys(words).sort(), [...SITE_IDS].sort());
  for (const id of SITE_IDS) {
    const s = SITES[id], j = words[id];
    assert.equal(j.name, s.name, id); assert.equal(j.levels, levelBand(id), id); assert.equal(j.floors, s.floors, id); assert.equal(!!j.hidden, !!s.hidden, id);
    if (s.hidden) assert.ok(j.shut, `${id}: what its shut way in says`);
  }
});

test('every site builds each floor in its band; the last floor has no stairs down', () => {
  for (const id of SITE_IDS) for (const seed of [20260807, 777]) {
    const S = SITES[id], floors = S.floors || 3;
    for (let d = 0; d < floors; d++) {
      const w = createWorld((seed ^ d * 7919) >>> 0, undefined, d, id);
      assert.equal(w.site, id); assert.equal(w.siteName, S.name);
      if (S.theme) assert.equal(w.theme, S.theme, `${id} keeps its look`);
      if (S.rooms) assert.ok(w.level.rooms.length >= S.rooms[0] && w.level.rooms.length <= S.rooms[1], `${id}: ${w.level.rooms.length} rooms`);
      const lv = [...w.roomLevels.entries()].filter(([r]) => r !== w.level.entrance.id).map(([, v]) => v);
      const lo = S.flat ? S.base : S.base + S.perFloor * d;
      const top = S.flat ? lo : lo + Math.floor((w.level.rooms.length - 2) / 2);   // the hall is the last ranked room
      assert.ok(lv.every((v) => v >= lo && v <= top) && lv.includes(top), `${id} floor ${d + 1}: levels ${lv}`);
      assert.equal(stairsOf(w), hasFloorBelow(id, d), `${id} floor ${d + 1}: stairs down only if there's a floor below`);
    }
  }
});

test('the Old Barrows come out as they did before sites: same seed, same floor', () => {
  const a = createSim(20260807), w = a.world;                          // (the default site)
  assert.equal(w.site, 'barrows');
  const b = createWorld(w.seed, undefined, 0, 'barrows');
  assert.equal(b.theme, w.theme); assert.equal(b.level.rooms.length, w.level.rooms.length);
  assert.deepEqual([...b.roomLevels.values()], [...w.roomLevels.values()]);
});

test('into a site and back out: the stair up leads to that site\'s door on the Vale', () => {
  const sim = createSim(20260807, undefined, { scene: 'dungeon', site: 'tithe_mill' }); sim.tick();
  assert.equal(sim.world.site, 'tithe_mill'); assert.ok(!stairsOf(sim.world), 'one floor: no way down');
  const p = sim.state.player; p.x = p.px = sim.world.exitAt.x; p.y = p.py = sim.world.exitAt.y; sim.tick();
  assert.equal(sim.world.kind, 'overland');
  const a = sim.world.arrivals.tithe_mill; assert.ok(Math.abs(p.x - a.x) < 2 && Math.abs(p.y - a.y) < 2, 'out at the mill');
});

// the Greywater Fens (M8 slice 3): every site's way in is on its own land's overland, with an arrival in front of it;
// going in puts you in the site's land, and its stair up brings you out at its door; the Undercroft stays shut
test('every site has its way in on its own land, and only there', async () => {
  const { createOutdoor } = await import('../src/sim/outdoor.js');
  const { isWalkable } = await import('../src/sim/world.js');
  for (const region of ['vale', 'fens']) {
    const o = createOutdoor(20260807, 'overland', region), ins = o.exits.filter((e) => e.to === 'dungeon').map((e) => e.site);
    assert.deepEqual(ins.sort(), SITE_IDS.filter((id) => SITES[id].region === region).sort(), region);
    for (const id of ins) { const a = o.arrivals[id]; assert.ok(a && isWalkable(o, a.x, a.y), `${id}: an arrival on open ground`); }
  }
});
test('into a Fens site and back out: you are in the Fens, out at its door; the Undercroft is shut until revealed', () => {
  for (const site of ['toadking_mound', 'canal_locks', 'sickpools', 'drowned_abbey']) {
    const sim = createSim(20260807, undefined, { scene: 'dungeon', site }); sim.tick();
    assert.equal(sim.state.region, 'fens', site);
    const p = sim.state.player; p.x = p.px = sim.world.exitAt.x; p.y = p.py = sim.world.exitAt.y; sim.tick();
    assert.equal(sim.world.kind, 'overland'); assert.equal(sim.world.region, 'fens');
    const a = sim.world.arrivals[site]; assert.ok(Math.abs(p.x - a.x) < 2 && Math.abs(p.y - a.y) < 2, `out at ${site}`);
  }
  const sim = createSim(20260807, undefined, { scene: 'overland', region: 'fens' }); sim.tick();
  const e = sim.world.exits.find((x) => x.site === 'reedholm_undercroft'), p = sim.state.player;
  p.x = p.px = (e.x0 + e.x1) / 2; p.y = p.py = (e.y0 + e.y1) / 2; for (let i = 0; i < 3; i++) sim.tick();
  assert.equal(sim.world.kind, 'overland', 'the Undercroft is locked');
  sim.reveal('reedholm_undercroft'); sim.tick();
  assert.equal(sim.world.site, 'reedholm_undercroft');
});
test('the Drowned Abbey: three floors of four rooms, 12–15', () => {
  assert.equal(levelBand('drowned_abbey'), '12–15'); assert.equal(levelBand('toadking_mound'), '8–11'); assert.equal(levelBand('reedholm_undercroft'), '15');
});
