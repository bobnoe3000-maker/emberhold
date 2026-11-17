// Kell's Rest, the Reach's second town (GDD v1.130; world doc v1.55 §3.3; outdoor.js buildKellsRest): a waystation you
// walk into off the end of the Kell road, its square every town's (test/town.test.mjs holds its menu to Ashgate's), its
// people its own (Nan Ruddock and Davy Pruett, out of the Yards' way in), the Guild's coach a day from Ashgate, and the
// town you're in saved (v54) with older saves in their land's own town.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createSim } from '../src/sim/core.js';
import { createOutdoor, oIsWalkable, groundAt, G, TOWNS } from '../src/sim/outdoor.js';
import { QS } from '../src/sim/quests.js';
import { COACH, days, fare, townIn } from '../src/sim/coach.js';
import { NPCS } from '../src/sim/npcs.js';
import { migrate, townFor54, metaOf, SAVE_VERSION } from '../src/persist/save.js';
import { startSession, verifySession } from '../src/sim/replay.js';
import { makeItem } from '../src/sim/items.js';
import { SHOPKEEP } from '../src/sim/smith.js';

const SEED = 20260807;
const ACTS = ['ch1_smoke_over_the_vale', 'ch1_the_diggers', 'ch1_ember_in_the_fist', 'ch1_the_standard',
  'ch2_fog_on_the_canal', 'ch2_the_locks', 'ch2_the_sickpools', 'ch2_the_bells', 'ch2_the_rolls', 'ch2_the_last_office'];
const snap = (sim) => JSON.parse(JSON.stringify(sim.snapshot()));
const standAt = (sim, e) => { const p = sim.state.player; p.x = p.px = (e.x0 + e.x1) / 2; p.y = p.py = (e.y0 + e.y1) / 2; };
const onSquare = (sim) => { const h = sim.world.hub, p = sim.state.player; p.x = p.px = h.x + 0.5; p.y = p.py = h.y + 4.5; };
const events = (sim, names) => { const out = []; for (const n of names) sim.bus.on(n, (e) => out.push({ n, ...e })); return out; };
const kellsGate = (w) => w.exits.find((e) => e.to === 'town' && e.town === 'kells_rest');
/** a company past Act II on the Reach's overland */
function onReach() {
  const sim = createSim(SEED, undefined, { scene: 'overland', region: 'reach' }); sim.tick();
  for (const id of ACTS) sim.state.quests[id] = { st: QS.DONE, step: 0, n: [] };
  return sim;
}
/** walked in off the Kell road */
function walkedIn() { const sim = onReach(); standAt(sim, kellsGate(sim.world)); sim.tick(); return sim; }

test("Kell's Rest is built: the same on the same seed, the Reach's own houses, nothing green, nothing on its street", () => {
  const a = createOutdoor(SEED, 'town', 'reach', 'kells_rest'), b = createOutdoor(SEED, 'town', 'reach', 'kells_rest');
  assert.equal(JSON.stringify(a.structs), JSON.stringify(b.structs)); assert.deepEqual(a.exits, b.exits);
  assert.equal(a.name, "Kell's Rest"); assert.equal(a.region, 'reach'); assert.equal(a.town, 'kells_rest'); assert.ok(a.waystation && a.second);
  assert.equal(a.name, TOWNS.kells_rest.name); assert.equal(COACH.kells_rest.name, a.name);
  assert.ok(!a.structs.some((s) => /^(vale|fens|heights)_/.test(s.id)), "none of another land's buildings (their atlases aren't loaded here)");
  assert.ok(!a.structs.some((s) => /^(wheat|cow|sheep|hens|pumpkins|hay|planter|oak|birch|autumn|grove|pine|willow|alder|carr|ug_(flowers|fern|clover|plant|mushroom|bush))/.test(s.id)), 'nothing green, no farm');
  assert.equal(a.fields.length, 0);
  let field = 0; for (let y = -20; y < 136; y += 2) for (let x = -20; x < 150; x += 2) if (groundAt(a, x, y).g === G.FIELD) field++;
  assert.equal(field, 0);
  // its street: no struct's middle on a road; the square reaches the way out; the way out and every arrival walkable
  for (const r of a.roads) for (let i = 0; i + 1 < r.pts.length; i++) for (let t = 0; t <= 1; t += 0.05) {
    const x = r.pts[i][0] + (r.pts[i + 1][0] - r.pts[i][0]) * t, y = r.pts[i][1] + (r.pts[i + 1][1] - r.pts[i][1]) * t;
    if (x < -10 || y < -10 || x > a.W + 10 || y > a.H + 10) continue;
    assert.ok(oIsWalkable(a, x, y), `the road at ${x.toFixed(1)},${y.toFixed(1)} is blocked`);
  }
  for (const [k, q] of Object.entries(a.arrivals)) assert.ok(oIsWalkable(a, q.x, q.y), `arrival ${k}`);
  const out = a.exits.find((e) => e.to === 'overland'); assert.equal(out.arrive, 'kells_rest'); assert.ok(oIsWalkable(a, (out.x0 + out.x1) / 2, (out.y0 + out.y1) / 2));
  // the Reach's own town is still Ashgate, walled, its people its own
  const ash = createOutdoor(SEED, 'town', 'reach'); assert.equal(ash.name, 'Ashgate'); assert.equal(ash.town, 'ashgate'); assert.ok(!ash.waystation && !ash.second);
  // a second town is only its own land's: elsewhere the land's own
  assert.equal(createOutdoor(SEED, 'town', 'vale', 'kells_rest').name, 'Thornwick');
});

test("the way in: the Kell road's end on the Reach takes you into Kell's Rest; its street takes you back out where you came in", () => {
  const sim = onReach(), heard = events(sim, ['townReached']), w = sim.world;
  const gate = kellsGate(w), arr = w.arrivals.kells_rest;
  assert.ok(gate, 'a way in at Kell\'s Rest'); assert.equal(gate.arrive, 'overland');
  assert.ok(!(arr.x >= gate.x0 && arr.x < gate.x1 && arr.y >= gate.y0 && arr.y < gate.y1), 'you come out beside it, not in it');
  assert.ok(Math.hypot((gate.x0 + gate.x1) / 2 - arr.x, (gate.y0 + gate.y1) / 2 - arr.y) < 8, 'you come out where you went in');
  // (the overland's own way into Ashgate is unchanged)
  assert.ok(w.exits.some((e) => e.to === 'town' && !e.town && e.x0 === 124));
  standAt(sim, gate); sim.tick();
  assert.equal(sim.world.kind, 'town'); assert.equal(sim.world.name, "Kell's Rest"); assert.equal(sim.state.town, 'kells_rest'); assert.equal(sim.state.region, 'reach');
  const p = sim.state.player, a = sim.world.arrivals.overland; assert.ok(Math.hypot(p.x - a.x, p.y - a.y) < 1, 'on Depot Street, coming in');
  assert.ok(sim.state.reached.has('kells_rest')); assert.deepEqual(heard.map((e) => [e.town, e.name]), [['kells_rest', "Kell's Rest"]], 'said once, the first time');
  // the compass: the square, and the road out to the Reach
  const rows = sim.destinations().map((r) => r.id); assert.ok(rows.includes('square') && rows.includes('road-out'), rows.join());
  // out by Depot Street: on the Kell road, by the depot
  standAt(sim, sim.world.exits.find((e) => e.to === 'overland')); sim.tick();
  assert.equal(sim.world.kind, 'overland'); assert.equal(sim.world.region, 'reach');
  const q = sim.world.arrivals.kells_rest; assert.ok(Math.hypot(sim.state.player.x - q.x, sim.state.player.y - q.y) < 1, 'at the kells_rest arrival');
  // in again: said no more; and on the land the compass has both towns, Kell's Rest by its own row
  const land = sim.destinations(); assert.ok(land.some((r) => r.id === 'town' && r.label === 'Ashgate') && land.some((r) => r.id === 'town:kells_rest' && r.label === "Kell's Rest"), land.map((r) => r.id + ':' + r.label).join());
  standAt(sim, kellsGate(sim.world)); sim.tick(); assert.equal(sim.world.name, "Kell's Rest"); assert.equal(heard.length, 1);
  // Ashgate's gate still takes you to Ashgate
  standAt(sim, sim.world.exits.find((e) => e.to === 'overland')); sim.tick();
  standAt(sim, sim.world.exits.find((e) => e.to === 'town' && !e.town)); sim.tick();
  assert.equal(sim.world.name, 'Ashgate'); assert.equal(sim.state.town, 'ashgate');
});

test("Kell's Rest's people: Nan Ruddock and Davy Pruett in its square, apart and solid, and they answer; nobody else's", () => {
  const sim = walkedIn(), w = sim.world, ids = w.npcs.map((n) => n.id).sort();
  assert.deepEqual(ids, ['assay_clerk', 'nan_ruddock']);
  assert.deepEqual(Object.keys(NPCS).filter((k) => NPCS[k].town === 'kells_rest').sort(), ids);
  const [a, b] = w.npcs; assert.ok(Math.hypot(a.x - b.x, a.y - b.y) >= 3, 'apart: a tap picks one');
  for (const n of w.npcs) { assert.ok(!oIsWalkable(w, n.x, n.y), `${n.id} is solid`); assert.ok(Math.hypot(n.x - w.hub.x, n.y - w.hub.y) < w.hub.r, `${n.id} on the square`); }
  const clerk = w.npcs.find((n) => n.id === 'assay_clerk'), tavern = w.services.find((s) => s.kind === 'tavern');
  assert.ok(Math.hypot(clerk.x - tavern.x, clerk.y - tavern.y) < 14, 'Davy by the Short Weight');
  const ev = events(sim, ['dialogue']);
  for (const id of ['nan_ruddock', 'assay_clerk']) {
    const n = sim.world.npcs.find((x) => x.id === id), p = sim.state.player; p.x = p.px = n.x + 1; p.y = p.py = n.y;
    sim.commands.push({ type: 'endTalk' }); sim.commands.push({ type: 'talk', npc: id }); sim.tick();
    assert.equal(ev.at(-1).npc, id); assert.equal(ev.at(-1).knot, NPCS[id].knot);
  }
  // not in Ashgate, not at the Yards' way in any more
  const r = createSim(SEED, undefined, { scene: 'town', region: 'reach' }); assert.ok(!r.world.npcs.some((n) => n.town || NPCS[n.id].town));
  const d = createSim(SEED, undefined, { scene: 'dungeon', site: 'assay_yards' }); assert.ok(!d.world.npcs.some((n) => n.id === 'nan_ruddock' || n.id === 'assay_clerk'));
});

test("Paid by Weight's first step: the compass walks you to Davy Pruett, out of Ashgate, along the Kell road, into Kell's Rest", () => {
  const sim = createSim(SEED, undefined, { scene: 'town', region: 'reach' }); sim.tick();
  for (const id of [...ACTS, 'ch3_the_wickham_road', 'ch3_short_shift']) sim.state.quests[id] = { st: QS.DONE, step: 0, n: [] };
  sim.state.quests.ch3_paid_by_weight = { st: QS.ACTIVE, step: 0, n: [0] }; sim.state.tracked = 'ch3_paid_by_weight';
  const quest = () => sim.destinations().find((r) => r.id === 'quest');
  const out = sim.destinations().find((r) => r.id === 'road-out'), q0 = quest();
  assert.ok(q0 && out && q0.tx === out.tx && q0.ty === out.ty, 'in Ashgate: the road out');
  standAt(sim, sim.world.exits.find((e) => e.to === 'overland')); sim.tick();
  const q1 = quest(), kells = sim.destinations().find((r) => r.id === 'town:kells_rest');
  assert.ok(q1 && kells && q1.tx === kells.tx && q1.ty === kells.ty, "on the land: to Kell's Rest, not Ashgate");
  standAt(sim, kellsGate(sim.world)); sim.tick();
  const q2 = quest(), davy = sim.world.npcs.find((n) => n.id === 'assay_clerk');
  assert.ok(q2 && q2.then && q2.then.type === 'talk' && q2.then.npc === 'assay_clerk' && q2.tx === Math.floor(davy.x), "in Kell's Rest: to him");
  const p = sim.state.player; p.x = p.px = davy.x + 1; p.y = p.py = davy.y;
  sim.commands.push({ type: 'talk', npc: 'assay_clerk' }); sim.tick();
  assert.equal(sim.state.quests.ch3_paid_by_weight.step, 1, 'a word with him: on to the Weighmaster');
});

test("the Guild's coach: Kell's Rest is a stop, a day from Ashgate, once you've stood in it", () => {
  assert.equal(COACH.kells_rest.land, 'reach'); assert.equal(days('ashgate', 'kells_rest'), 1); assert.equal(fare('ashgate', 'kells_rest'), 10);
  assert.equal(days('kells_rest', 'saltmere'), 4, 'by Ashgate and Thornwick');
  // not reached: refused, nothing taken
  const s0 = createSim(SEED, undefined, { scene: 'town', region: 'reach' }); s0.tick(); for (const id of ACTS) s0.state.quests[id] = { st: QS.DONE, step: 0, n: [] };
  onSquare(s0); s0.state.counters.gold = 100; const no = events(s0, ['refused']);
  s0.commands.push({ type: 'coach', to: 'kells_rest' }); s0.tick();
  assert.deepEqual(no.map((e) => e.reason), ['You haven’t been there yet']); assert.equal(s0.world.name, 'Ashgate'); assert.equal(s0.state.counters.gold, 100);
  // walked in, then out to Ashgate's square: the coach there and back
  const sim = walkedIn(); standAt(sim, sim.world.exits.find((e) => e.to === 'overland')); sim.tick();
  standAt(sim, sim.world.exits.find((e) => e.to === 'town' && !e.town)); sim.tick(); assert.equal(sim.world.name, 'Ashgate');
  onSquare(sim); sim.state.counters.gold = 100; const ev = events(sim, ['coach']);
  sim.commands.push({ type: 'coach', to: 'kells_rest' }); sim.tick();
  assert.deepEqual(ev.at(-1), { n: 'coach', from: 'ashgate', to: 'kells_rest', days: 1, fare: 10 });
  assert.equal(sim.world.name, "Kell's Rest"); assert.equal(sim.state.town, 'kells_rest'); assert.equal(sim.state.counters.gold, 90);
  const h = sim.world.hub, p = sim.state.player; assert.ok(Math.hypot(p.x - h.x, p.y - h.y) < h.r, 'on its square');
  // from Kell's Rest's square: to Thornwick by Ashgate, three days
  onSquare(sim); sim.commands.push({ type: 'coach', to: 'thornwick' }); sim.tick();
  assert.deepEqual(ev.at(-1), { n: 'coach', from: 'kells_rest', to: 'thornwick', days: 3, fare: 30 });
  assert.equal(sim.world.name, 'Thornwick'); assert.equal(sim.state.town, 'thornwick'); assert.equal(sim.state.counters.gold, 60);
  // and back, to where you were
  onSquare(sim); sim.commands.push({ type: 'coach', to: 'kells_rest' }); sim.tick();
  assert.equal(sim.world.name, "Kell's Rest"); assert.equal(sim.state.region, 'reach'); assert.equal(sim.state.counters.gold, 30);
});

test("Kell's Rest's shop keeps its own shelves, not Ashgate's", () => {
  const sim = walkedIn(); sim.tick();
  assert.ok(sim.state.shops.kells_rest && sim.state.shops.kells_rest.day >= 0, 'its shelves put up');
  assert.ok(!sim.state.shops.ashgate || sim.state.shops.ashgate.day < 0, "Ashgate's not put up: you've never been in it");
  const r = createSim(SEED); r.restore(snap(sim)); assert.deepEqual(r.state.shops.kells_rest, sim.state.shops.kells_rest);
});

test('the town you\'re in is saved (v54): a save in Kell\'s Rest loads there; an older save, or a stale town, is the land\'s own', () => {
  assert.equal(SAVE_VERSION, 54);
  const sim = walkedIn(), data = snap(sim);
  assert.equal(data.town, 'kells_rest'); assert.equal(data.region, 'reach'); assert.equal(data.scene, 'town');
  const r = createSim(SEED); r.restore(JSON.parse(JSON.stringify(data)));
  assert.equal(r.world.name, "Kell's Rest"); assert.equal(r.state.town, 'kells_rest');
  assert.deepEqual(r.world.npcs.map((n) => n.id).sort(), ['assay_clerk', 'nan_ruddock']);
  { const back = snap(r); for (const k of ['scene', 'region', 'town', 'site', 'depth', 'player', 'reached', 'shops']) assert.deepEqual(back[k], data[k], `${k} round-trips`); }
  assert.equal(metaOf(data).town, 'kells_rest');
  // out on the land: still the town you last stood in
  standAt(r, r.world.exits.find((e) => e.to === 'overland')); r.tick(); assert.equal(snap(r).town, 'kells_rest');
  // v53 and older: the land's own town, every scene where it was
  const old = { ...data }; delete old.town;
  const m = migrate({ version: 53, savedAt: 1, data: old });
  assert.equal(m.version, SAVE_VERSION); assert.equal(m.data.town, 'ashgate');
  const r2 = createSim(SEED); r2.restore(m.data); assert.equal(r2.world.name, 'Ashgate'); assert.equal(r2.state.town, 'ashgate');
  assert.equal(townFor54({ region: 'fens' }).town, 'saltmere'); assert.equal(townFor54({}).town, 'thornwick');
  for (const v of [27, 40, 52]) assert.equal(migrate({ version: v, savedAt: 1, data: { ...old, region: 'vale' } }).data.town, 'thornwick');
  // absent, junk or another land's: the land's own (coach.js townIn)
  for (const t of [undefined, null, 'nowhere', 'saltmere', 7, '__proto__', 'toString']) {
    const q = createSim(SEED); q.restore({ ...data, town: t }); assert.equal(q.world.name, 'Ashgate', String(t)); assert.equal(q.state.town, 'ashgate');
  }
  const v = createSim(SEED); v.restore({ ...data, region: 'vale' }); assert.equal(v.world.name, 'Thornwick', "Kell's Rest is the Reach's"); assert.equal(v.state.town, 'thornwick');
  assert.equal(townIn('kells_rest', 'reach'), 'kells_rest'); assert.equal(townIn('kells_rest', 'fens'), 'saltmere');
});

test("a walk into Kell's Rest and a coach trip out of it replay to the same state", () => {
  const sim = walkedIn(); sim.state.counters.gold = 100; onSquare(sim);
  const ss = startSession(sim, { scene: 'town' });
  for (let i = 0; i < 40; i++) { if (i === 10) sim.commands.push({ type: 'coach', to: 'thornwick' }); sim.tick(); }
  assert.equal(sim.world.name, 'Thornwick');
  const v = verifySession(ss.claim(), { verified: ss.startHash, elapsedMs: 1e9 }); assert.ok(v.ok, v.reason);
  const back = createSim(SEED); back.restore(ss.start); assert.equal(back.world.name, "Kell's Rest", 'the session starts in Kell\'s Rest');
});

// v1.131 (the owner: "Kell's Rest as a real second town"): home is the town of this land you last stood in. A Homeward
// Scroll and a wipe's wake took you to the land's own (Ashgate) even from Kell's Rest's dungeon next door.
const read = (sim) => { const it = makeItem('homeward', 1, 'common', { uid: 'hw' + sim.state.tick }); sim.state.bag.push(it); sim.commands.push({ type: 'useItem', uid: it.uid }); sim.tick(); };
const outOfTown = (sim) => { standAt(sim, sim.world.exits.find((e) => e.to === 'overland')); sim.tick(); };

test("home is the land's town you last stood in: a Homeward Scroll out of Kell's Rest's land takes you back to Kell's Rest, out of Ashgate's to Ashgate", () => {
  const sim = walkedIn(); assert.equal(sim.state.town, 'kells_rest');
  outOfTown(sim); assert.equal(sim.state.scene, 'overland'); assert.equal(sim.state.town, 'kells_rest', 'still the town last stood in');
  read(sim); assert.equal(sim.state.scene, 'town'); assert.equal(sim.world.name, "Kell's Rest", 'the scroll: back to Kell\'s Rest');
  // into the Yards next door and a scroll from its floor
  outOfTown(sim); standAt(sim, sim.world.exits.find((e) => e.to === 'dungeon' && e.site === 'assay_yards')); sim.tick();
  assert.equal(sim.state.scene, 'dungeon'); read(sim); assert.equal(sim.world.name, "Kell's Rest");
  // in Ashgate, Ashgate's
  const a = onReach(); standAt(a, a.world.exits.find((e) => e.to === 'town' && !e.town && !e.closed)); a.tick(); assert.equal(a.world.name, 'Ashgate');
  outOfTown(a); read(a); assert.equal(a.world.name, 'Ashgate');
  // into another land: its own town (Kell's Rest is only the Reach's)
  const v = walkedIn(); outOfTown(v); v.restore({ ...snap(v), region: 'vale', scene: 'overland' }); v.tick(); read(v); assert.equal(v.world.name, 'Thornwick');
});

test("a wipe out of Kell's Rest wakes at Kell's Rest's shrine", () => {
  const sim = walkedIn(); outOfTown(sim);
  standAt(sim, sim.world.exits.find((e) => e.to === 'dungeon' && e.site === 'assay_yards')); sim.tick(); assert.equal(sim.state.site, 'assay_yards');
  const L = sim.world.level, r = L.rooms.find((q) => q !== L.entrance), p = sim.state.player; p.x = p.px = r.cx + 0.5; p.y = p.py = r.cy + 0.5;
  let got = null; sim.bus.on('defeat', (e) => { got = e; });
  for (let i = 0; i < 20 * 180 && !got; i++) { for (const m of sim.state.party) if (!m.down) m.hp = Math.min(m.hp, 3); sim.tick(); }
  assert.ok(got, 'the party fell'); assert.equal(sim.state.scene, 'town'); assert.equal(sim.world.name, "Kell's Rest");
  const t = sim.world.arrivals.temple; assert.ok(Math.hypot(sim.state.player.x - t.x, sim.state.player.y - t.y) < 3, 'at its shrine');
});

test("Kell's Rest's shop has its own keeper", () => { assert.equal(SHOPKEEP.kells_rest, 'Prosser'); for (const k of Object.keys(COACH)) assert.ok(SHOPKEEP[k], `${k}'s shopkeeper`); });
