// Sites as data (M5, docs/m5-plan.md): every dungeon site builds its floors from the seed, its rooms
// sit in its level band, its last floor ends in its hall (no stairs down), and its words in
// content/sites/ match the sim's table. The Old Barrows come out as they always have.
// (v1.48, one dungeon a level: GDD §3, docs/dungeons-per-map-proposal.md) a banded dungeon's floor n is base + n − 1,
// the two rooms ranked before its hall a level up (capped at the band's top), the hall at its floor's level.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { createSim } from '../src/sim/core.js';
import { createWorld } from '../src/sim/world.js';
import { SITES, SITE_IDS, levelBand, hasFloorBelow, roomLevelAt, themeAt, familyAt, bossAt, siteOpen } from '../src/sim/sites.js';

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
      if (themeAt(id, d)) assert.equal(w.theme, themeAt(id, d), `${id} floor ${d + 1} keeps its look`);
      if (S.rooms) assert.ok(w.level.rooms.length >= S.rooms[0] && w.level.rooms.length <= S.rooms[1], `${id}: ${w.level.rooms.length} rooms`);
      const lv = [...w.roomLevels.entries()].filter(([r]) => r !== w.level.entrance.id).map(([, v]) => v);
      if (S.band) {
        // the floor's level everywhere, the hall too; the two rooms ranked before the hall one up, to the band's top
        const lo = S.base + d, top = Math.min(S.base + S.floors - 1, lo + 1), hall = w.roomLevels.get(w.level.descentRoom.id);
        assert.equal(hall, lo, `${id} floor ${d + 1}: its hall at the floor's level`);
        assert.ok(lv.every((v) => v === lo || v === top), `${id} floor ${d + 1}: levels ${lv}`);
        assert.equal(lv.filter((v) => v === top && top > lo).length, top > lo ? 2 : 0, `${id} floor ${d + 1}: two rooms before the hall a level up: ${lv}`);
      } else {
        const lo = S.flat ? S.base : S.base + S.perFloor * d;
        const top = S.flat ? lo : lo + Math.floor((w.level.rooms.length - 2) / 2);   // the hall is the last ranked room
        assert.ok(lv.every((v) => v >= lo && v <= top) && lv.includes(top), `${id} floor ${d + 1}: levels ${lv}`);
      }
      assert.equal(stairsOf(w), hasFloorBelow(id, d), `${id} floor ${d + 1}: stairs down only if there's a floor below`);
    }
  }
});

test('one dungeon a level: the open bands run 1–18 in six, each level in exactly one; the room rule by rank', () => {
  const bands = SITE_IDS.filter((id) => SITES[id].band);
  assert.deepEqual(bands, ['barrows', 'wickham_keep', 'sunken_chapel', 'toadking_mound', 'canal_locks', 'drowned_abbey']);
  for (const id of bands) assert.equal(SITES[id].floors, 3, `${id}: three floors`);
  for (let lv = 1; lv <= 18; lv++) {
    const at = bands.filter((id) => SITES[id].base <= lv && lv <= SITES[id].base + SITES[id].floors - 1);
    assert.equal(at.length, 1, `level ${lv}: ${at}`);
    assert.ok(!SITES[at[0]].hidden && !SITES[at[0]].parked, `level ${lv}: ${at[0]} is open`);
  }
  for (const id of SITE_IDS) assert.ok(SITES[id].floors > 0, `${id}: a bottom (the Old Barrows are no longer endless)`);
  // a floor of six (five ranked rooms, the hall last): the floor's level, the two before the hall one up, capped at the top
  assert.deepEqual([0, 1, 2, 3, 4].map((r) => roomLevelAt('wickham_keep', 0, r, 5)), [4, 4, 5, 5, 4]);
  assert.deepEqual([0, 1, 2, 3, 4].map((r) => roomLevelAt('wickham_keep', 1, r, 5)), [5, 5, 6, 6, 5]);
  assert.deepEqual([0, 1, 2, 3, 4].map((r) => roomLevelAt('wickham_keep', 2, r, 5)), [6, 6, 6, 6, 6]);
  assert.deepEqual([0, 1, 2].map((r) => roomLevelAt('drowned_abbey', 0, r, 3)), [17, 17, 16]);   // the Abbey's three ranked rooms
  assert.deepEqual([0, 1].map((r) => roomLevelAt('barrows', 0, r, 2)), [1, 1]);                  // under three: no room before the hall is raised
  // the flat ones: the secrets at their land's top, the Tower at 12
  for (const [id, lv] of [['ninth_milestone', 9], ['reedholm_undercroft', 18], ['mere_tower', 12]]) for (const r of [0, 1, 3]) assert.equal(roomLevelAt(id, 0, r, 4), lv, id);
  for (const id of ['ninth_milestone', 'reedholm_undercroft']) assert.ok(SITES[id].secret && SITES[id].hidden && SITES[id].flat, `${id}: its land's secret`);
});

test('the parked sites (the Mill, the Warren) are out of play: the Reach\'s, shut, on no land; the Sickpools are gone', async () => {
  const { createOutdoor } = await import('../src/sim/outdoor.js');
  for (const id of ['tithe_mill', 'scrag_warren']) {
    assert.ok(SITES[id].parked, id); assert.equal(SITES[id].region, 'reach', id);
    assert.equal(siteOpen(id, [id]), false, `${id}: shut, even if revealed`);
    for (const region of ['vale', 'fens']) assert.ok(!createOutdoor(20260807, 'overland', region).exits.some((e) => e.site === id), `${id}: no way in on the ${region}`);
  }
  const vale = createOutdoor(20260807, 'overland', 'vale');
  assert.ok(vale.labels.some((l) => l.text === 'The Tithe Mill' && !l.site), 'the mill stands on the Vale as a landmark, no site');
  assert.equal(SITES.sickpools, undefined, 'the Sickpools are no site of their own');
  // they are the Canal Locks' third floor, Vat Seven: its own look, foes and warden
  assert.equal(themeAt('canal_locks', 2), 'poison'); assert.equal(familyAt('canal_locks', 2), 'harvest'); assert.equal(bossAt('canal_locks', 2), 'vatwarden');
  assert.deepEqual([0, 1, 2].map((d) => themeAt('canal_locks', d)), ['sluice', 'sluice', 'poison']);
  assert.deepEqual([0, 1, 2].map((d) => familyAt('canal_locks', d)), ['ashbound', 'lockcult', 'harvest']);
});

test('the Old Barrows come out as they did before sites: same seed, same floor', () => {
  const a = createSim(20260807), w = a.world;                          // (the default site)
  assert.equal(w.site, 'barrows');
  const b = createWorld(w.seed, undefined, 0, 'barrows');
  assert.equal(b.theme, w.theme); assert.equal(b.level.rooms.length, w.level.rooms.length);
  assert.deepEqual([...b.roomLevels.values()], [...w.roomLevels.values()]);
});

test('into a site and back out: the stair up leads to that site\'s door on the Vale', () => {
  for (const site of ['wickham_keep', 'ninth_milestone']) {
    const sim = createSim(20260807, undefined, { scene: 'dungeon', site }); sim.tick();
    assert.equal(sim.world.site, site); assert.equal(stairsOf(sim.world), hasFloorBelow(site, 0), `${site}: a way down only if there's a floor below`);
    const p = sim.state.player; p.x = p.px = sim.world.exitAt.x; p.y = p.py = sim.world.exitAt.y; sim.tick();
    assert.equal(sim.world.kind, 'overland'); assert.equal(sim.world.region, 'vale', site);
    const a = sim.world.arrivals[site]; assert.ok(Math.abs(p.x - a.x) < 2 && Math.abs(p.y - a.y) < 2, `out at ${site}`);
  }
});

// the Greywater Fens (M8 slice 3): every site's way in is on its own land's overland, with an arrival in front of it;
// going in puts you in the site's land, and its stair up brings you out at its door; the Undercroft stays shut
test('every site has its way in on its own land, and only there', async () => {
  const { createOutdoor } = await import('../src/sim/outdoor.js');
  const { isWalkable } = await import('../src/sim/world.js');
  for (const region of ['vale', 'fens']) {
    const o = createOutdoor(20260807, 'overland', region), ins = o.exits.filter((e) => e.to === 'dungeon').map((e) => e.site);
    assert.deepEqual(ins.sort(), SITE_IDS.filter((id) => SITES[id].region === region && !SITES[id].parked).sort(), region);
    for (const id of ins) { const a = o.arrivals[id]; assert.ok(a && isWalkable(o, a.x, a.y), `${id}: an arrival on open ground`); }
  }
});
// a land names its dungeons over their doors (outdoor.js labels; the renderer and the land map draw them): every way in
// but the Undercroft's (a low door in Reedholm's chapel front, under Reedholm's own name)
test('every way in on a land has its site\'s name over it', async () => {
  const { createOutdoor } = await import('../src/sim/outdoor.js');
  for (const region of ['vale', 'fens']) {
    const o = createOutdoor(20260807, 'overland', region);
    const ins = o.exits.filter((e) => e.to === 'dungeon' && e.site !== 'reedholm_undercroft').map((e) => e.site).sort();
    const named = o.labels.filter((l) => l.site).map((l) => l.site).sort();
    assert.deepEqual(named, ins, `${region}: the named sites`);
    for (const l of o.labels.filter((x) => x.site)) assert.ok(l.text.startsWith(SITES[l.site].name), `${l.site}: "${l.text}"`);   // (the Tower's plaque adds Wenna's punt)
  }
});
test('into a Fens site and back out: you are in the Fens, out at its door; the Undercroft is shut until revealed', () => {
  for (const site of ['toadking_mound', 'canal_locks', 'drowned_abbey']) {
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
test('the Drowned Abbey: three floors of four rooms, 16–18; every site\'s band', () => {
  assert.equal(SITES.drowned_abbey.floors, 3); assert.deepEqual(SITES.drowned_abbey.rooms, [4, 4]);
  assert.deepEqual(Object.fromEntries(SITE_IDS.filter((id) => !SITES[id].parked).map((id) => [id, levelBand(id)])), {
    barrows: '1–3', wickham_keep: '4–6', sunken_chapel: '7–9', ninth_milestone: '9',
    toadking_mound: '10–12', canal_locks: '13–15', drowned_abbey: '16–18', mere_tower: '12', reedholm_undercroft: '18' });
});
