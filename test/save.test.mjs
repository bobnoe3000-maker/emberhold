// saves: v3 single saves and v4 slots migrate to v8; unknown versions are refused, never half-read
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { migrate, metaOf, SAVE_VERSION, SLOTS } from '../src/persist/save.js';
import { createSim } from '../src/sim/core.js';

test('three game slots, save v31', () => { assert.equal(SLOTS, 3); assert.equal(SAVE_VERSION, 31); });
test('a v3 save migrates with its meta; junk is refused', () => {
  const data = createSim(7).snapshot();
  const m = migrate({ version: 3, savedAt: 5, data });
  assert.equal(m.version, SAVE_VERSION); for (const v of [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24]) assert.equal(migrate({ version: v, savedAt: 6, data }).version, SAVE_VERSION);
  assert.equal(m.version, SAVE_VERSION); assert.equal(m.savedAt, 5); assert.deepEqual(m.meta, metaOf(data));
  assert.equal(migrate({ version: 1, data }), null);
  assert.equal(migrate({ version: 99, data }), null);
  assert.equal(migrate(null), null);
});
test('a snapshot round-trips through JSON (no cycles, even mid-battle)', () => {
  const sim = createSim(20260807, undefined, { scene: 'dungeon' });
  const d = sim.destinations().find((o) => o.id === 'next-room'); sim.commands.push({ type: 'goto', ...d });
  for (let i = 0; i < 900; i++) sim.tick();
  const snap = JSON.parse(JSON.stringify(sim.snapshot()));
  const r = createSim(20260807, undefined, { scene: 'dungeon' }); r.restore(snap);
  assert.equal(r.state.party[0].level, sim.state.party[0].level);
});

// v20 (the owner, 2026-10-04: "Grant every player one return scroll in their inventory"): every company carries one
// Homeward Scroll. A new hero sets out with one (createHero); an older save is given one, once, as it's read.
const scrolls = (bag) => (bag || []).filter((it) => it.base === 'homeward').length;
test('a new hero sets out with one Homeward Scroll in the bag', () => {
  const sim = createSim(20260807, undefined, { scene: 'town' });
  sim.commands.push({ type: 'createHero', cls: 'fighter', look: 'hero_knight', origin: 'thornwick_born', name: 'Aldric' }); sim.tick();
  assert.equal(sim.state.created, true); assert.equal(scrolls(sim.state.bag), 1);
  const uids = sim.state.bag.map((it) => it.uid); assert.equal(new Set(uids).size, uids.length);
});
test('a v19 save is given one Homeward Scroll as it migrates, once; a v20 save is left as it is', () => {
  const sim = createSim(20260807); sim.state.created = true;
  const data = JSON.parse(JSON.stringify(sim.snapshot())), had = scrolls(data.bag), n = data.counters.uidN || 0;
  const m = migrate({ version: 19, savedAt: 1, data });
  assert.equal(scrolls(m.data.bag), had + 1); assert.equal(m.data.counters.uidN, n + 1);
  assert.equal(scrolls(migrate(m).data.bag), had + 1, 'once: v20 is current');
  const r = createSim(20260807); r.restore(m.data); assert.equal(scrolls(r.state.bag), had + 1, 'and the sim reads it');
  const full = { ...data, bag: Array.from({ length: 50 }, (_, i) => ({ base: 'sword', uid: 'x' + i, ilv: i + 1, r: 'common' })) };
  assert.equal(scrolls(migrate({ version: 19, savedAt: 1, data: full }).data.bag), 0, 'a full bag with none to stack on: left out');
});

// (save v25, GDD §7 v1.38: the slower curve) a level-17 cleric 22,182 / 27,915 of the way (the owner's debug report) keeps
// level 17 and the same share of the new table's level: about 79 %
test('save v25: levels kept; the XP toward the next level carried over as the same share of the new curve', async () => {
  const { xpToNext } = await import('../src/sim/party.js');
  const { createSim } = await import('../src/sim/core.js');
  const data = JSON.parse(JSON.stringify(createSim(1, undefined, { scene: 'town' }).snapshot()));
  data.party[0] = { ...data.party[0], level: 17, xp: 22182 }; data.bench = [{ ...data.party[0], id: 'b', name: 'B', main: false, level: 10, xp: 0 }];
  const m = migrate({ version: 24, savedAt: 1, data }).data;
  assert.equal(m.party[0].level, 17); assert.ok(Math.abs(m.party[0].xp / xpToNext(17) - 22182 / 27915) < 0.001, String(m.party[0].xp));
  assert.equal(m.bench[0].xp, 0); assert.equal(migrate({ version: 27, savedAt: 1, data: m }).data.party[0].xp, m.party[0].xp, 'once');
});

// (save v26, the level-12 trials) the 12s were unlocked by level: a class anyone had at 12 keeps its ability
test('save v26: a class someone had at 12 counts its level-12 trial done; the others wait for theirs', async () => {
  const { createSim } = await import('../src/sim/core.js');
  const { unlocked, SKILLS } = await import('../src/sim/skills.js');
  const data = JSON.parse(JSON.stringify(createSim(1, undefined, { scene: 'town' }).snapshot()));
  data.party[0] = { ...data.party[0], cls: 'cleric', level: 14 }; data.bench = [{ ...data.party[0], id: 'b', name: 'B', main: false, cls: 'rogue', level: 11 }];
  data.trials = ['cleric', 'rogue'];
  const m = migrate({ version: 25, savedAt: 1, data }).data;
  assert.deepEqual(m.trials, ['cleric', 'rogue', 'cleric12']);
  assert.deepEqual(migrate({ version: 25, savedAt: 1, data: { ...data, trials: undefined } }).data.trials, ['cleric', 'rogue', 'cleric12'], 'from before any trials: the 6s too');
  const sim = createSim(1, undefined, { scene: 'town' }); sim.restore(m);
  const turn = SKILLS.cleric.find((s) => s.lv === 12), venom = SKILLS.rogue.find((s) => s.lv === 12);
  assert.ok(unlocked(sim.state.party[0], turn, sim.state.trials), 'the cleric keeps Turn Undead');
  assert.ok(!unlocked({ cls: 'rogue', level: 12 }, venom, sim.state.trials), 'a rogue reaching 12 now wants Wren\'s trial');
  assert.deepEqual(migrate({ version: 26, savedAt: 1, data: m }).data.trials, m.trials, 'once');
});

// (save v27, GDD §7.1 v1.42) the wave stops growing at 5 foes, XP a minute from 10 fell with it, and so did the table:
// the share of the way to the next level is kept; under 10 nothing changes
test('save v27: from level 10, the XP toward the next level is the same share of the smaller table', async () => {
  const { xpToNext } = await import('../src/sim/party.js');
  const { createSim } = await import('../src/sim/core.js');
  const data = JSON.parse(JSON.stringify(createSim(1, undefined, { scene: 'town' }).snapshot()));
  data.party[0] = { ...data.party[0], level: 12, xp: 57000 }; data.bench = [{ ...data.party[0], id: 'b', name: 'B', main: false, level: 9, xp: 40000 }];
  const m = migrate({ version: 26, savedAt: 1, data }).data;
  assert.equal(m.party[0].level, 12); assert.ok(Math.abs(m.party[0].xp / xpToNext(12) - 57000 / 114000) < 0.001, String(m.party[0].xp));
  assert.equal(m.bench[0].xp, 40000, 'level 9: the table is as it was');
  assert.ok(xpToNext(12) < 114000 && xpToNext(9) === 53700);
  assert.equal(migrate({ version: 27, savedAt: 1, data: m }).data.party[0].xp, m.party[0].xp, 'once');
});


// v29 (GDD §10 v1.44): every town and waystation keeps its own shop shelves; an older save's one shop was Thornwick's
test('v28 → v29: the one shop becomes Thornwick\'s shelves, and restores as them', async () => {
  const { shopsFor } = await import('../src/persist/save.js');
  const old = { ...createSim(7, undefined, { scene: 'town' }).snapshot() }; delete old.shops; old.shop = { day: 0, lv: 1, bought: [1, 3] };
  const m = migrate({ version: 28, savedAt: 1, data: old });
  assert.deepEqual(m.data.shops, { thornwick: { day: 0, lv: 1, bought: [1, 3] } }); assert.equal(m.data.shop, undefined);
  assert.deepEqual(shopsFor(m.data), m.data, 'once');
  const r = createSim(7, undefined, { scene: 'town' }); r.restore(m.data); assert.deepEqual(r.state.shop.bought, [1, 3]);
});

test('v29 → v30: a visit under way starts again at the site\'s first floor, in its entrance; a save outside keeps its place', async () => {
  const { visitFor } = await import('../src/persist/save.js');
  const sim = createSim(20260807, undefined, { scene: 'dungeon', site: 'wickham_keep' }), L = sim.world.level, far = L.rooms[L.rooms.length - 1];
  sim.state.player.x = sim.state.player.px = far.cx + 0.5; sim.state.player.y = sim.state.player.py = far.cy + 0.5;
  const old = JSON.parse(JSON.stringify(sim.snapshot())); old.depth = 1; old.mods = [['10,10', { opened: true }]]; old.discovered = [0, 1, 2]; old.floors = [[0, { mods: [], hp: [], discovered: [0], visited: [] }]];
  const v30 = visitFor(old);                                            // the v30 step alone
  assert.equal(v30.depth, 0); assert.deepEqual([v30.mods, v30.discovered, v30.floors], [[], [], []]); assert.equal(v30.site, 'wickham_keep');
  const m = migrate({ version: 29, savedAt: 1, data: old });            // and on through v31 (a site still in play keeps its place)
  assert.equal(m.version, SAVE_VERSION); assert.equal(m.data.site, 'wickham_keep'); assert.equal(m.data.depth, 0); assert.deepEqual([m.data.mods, m.data.discovered, m.data.floors], [[], [], []]);
  for (const data of [v30, m.data]) {
    const r = createSim(20260807, undefined, { scene: 'town' }); r.restore(data);
    const e = r.world.level.entrance, p = r.state.player;
    assert.equal(r.world.site, 'wickham_keep'); assert.equal(r.world.depth, 0); assert.equal(r.world.level.layout, 'halls');
    assert.ok(Math.abs(p.x - r.world.level.spawn.x) < 3 && Math.abs(p.y - r.world.level.spawn.y) < 3 && r.world.level.cells.get(Math.floor(p.x) + ',' + Math.floor(p.y)).room === e.id, 'not in the entrance');
  }
  const town = createSim(7, undefined, { scene: 'town' }).snapshot(), t = migrate({ version: 29, savedAt: 1, data: JSON.parse(JSON.stringify(town)) });
  assert.deepEqual(t.data.player, town.player, 'a save in town keeps its place');
});

// v31 (GDD §3 v1.48, one dungeon a level): the Tithe Mill and the Scrag Warren are parked and the Sickpools are the Canal
// Locks' third floor, so a save in one stands in what took its place (the Old Barrows, Wickham Keep, the Canal Locks), and
// the sites entered follow; every banded dungeon's floors are new, so a visit starts again at its first floor (the Old
// Barrows' fifth floor is no more); secret sites keep a seal ({} to start); a board job under way is let go (its posting
// is drawn anew from the new dungeons), a finished one kept for the Journal
test('v30 → v31: a save in a gone site stands in what took its place, at its first floor; sites entered follow; board jobs under way let go', async () => {
  const { bandsFor, GONE_SITES } = await import('../src/persist/save.js');
  assert.deepEqual(GONE_SITES, { tithe_mill: 'barrows', scrag_warren: 'wickham_keep', sickpools: 'canal_locks' });
  const base = JSON.parse(JSON.stringify(createSim(20260807, undefined, { scene: 'dungeon' }).snapshot())); delete base.secrets;
  const quests = { board_3_5_0: [1, 0, 2], board_3_5_1: [2, 0, 3], board_2d_5_2: [3, 0, 1], board_4_12_0_fens: [1, 0, 0], board_1_12_3_fens: [3, 0, 2], vale_long_way_round: [1, 0, 2, 0] };
  for (const [site, depth, to, region] of [['tithe_mill', 0, 'barrows', 'vale'], ['scrag_warren', 1, 'wickham_keep', 'vale'], ['sickpools', 0, 'canal_locks', 'fens'], ['barrows', 4, 'barrows', 'vale']]) {
    const old = { ...base, scene: 'dungeon', site, region: site === 'sickpools' ? 'fens' : 'vale', depth, mods: [['10,10', { opened: true }]], discovered: [0, 1], floors: [[0, { mods: [], hp: [], discovered: [0], visited: [] }]],
      player: { ...base.player, x: 140.5, y: 120.5 }, sitesEntered: ['barrows', 'tithe_mill', 'scrag_warren', 'sickpools', 'canal_locks'], quests };
    const m = migrate({ version: 30, savedAt: 1, data: old });
    assert.equal(m.version, SAVE_VERSION); assert.deepEqual(m.meta, metaOf(m.data));
    assert.equal(m.data.site, to, site); assert.equal(m.data.region, region, `${site}: its land`); assert.equal(m.data.depth, 0, `${site}: its first floor`);
    assert.deepEqual([m.data.mods, m.data.discovered, m.data.floors], [[], [], []], `${site}: a new visit`);
    assert.deepEqual(m.data.sitesEntered, ['barrows', 'wickham_keep', 'canal_locks'], 'the sites entered follow (once each)');
    assert.deepEqual(m.data.secrets, {});
    assert.deepEqual(Object.keys(m.data.quests).sort(), ['board_1_12_3_fens', 'board_2d_5_2', 'vale_long_way_round'], 'board jobs under way let go; done ones and quests kept');
    assert.deepEqual(m.data.quests.vale_long_way_round, quests.vale_long_way_round);
    assert.deepEqual(bandsFor(m.data), m.data, 'once');
    // the sim reads it: in the site that took its place, at its first floor's entrance, in its land
    const r = createSim(20260807, undefined, { scene: 'town' }); r.restore(m.data);
    assert.equal(r.world.kind, 'dungeon'); assert.equal(r.world.site, to); assert.equal(r.world.depth, 0); assert.equal(r.state.region, region);
    const p = r.state.player, e = r.world.level.entrance;
    assert.equal(r.world.level.cells.get(Math.floor(p.x) + ',' + Math.floor(p.y)).room, e.id, `${site}: in the entrance`);
    assert.deepEqual([...r.state.sitesEntered], ['barrows', 'wickham_keep', 'canal_locks']); assert.deepEqual(r.state.secrets, {});
  }
  // a save outside keeps its place and its land; a secret's seal is kept; the current version is left as it is
  const town = JSON.parse(JSON.stringify(createSim(7, undefined, { scene: 'town' }).snapshot())); delete town.secrets;
  const t = migrate({ version: 30, savedAt: 1, data: { ...town, sitesEntered: ['sickpools'], secrets: { ninth_milestone: 900 } } });
  assert.deepEqual(t.data.player, town.player, 'a save in town keeps its place'); assert.equal(t.data.region, town.region); assert.equal(t.data.scene, 'town');
  assert.deepEqual(t.data.sitesEntered, ['canal_locks']); assert.deepEqual(t.data.secrets, { ninth_milestone: 900 });
  const r = createSim(7, undefined, { scene: 'town' }); r.restore(t.data); assert.deepEqual(r.state.secrets, { ninth_milestone: 900 });
  assert.equal(migrate(t), t, 'v31 is current');
});
