// The Guild's coach (sim/coach.js; docs/worldmap-travel-proposal.md; GDD §10 v1.43, v1.142): from anywhere above ground, to a town
// you've walked to, in an open land, for 10 gold a day of road. Every refusal leaves the game as it was; a trip takes
// exactly the fare; the towns reached are saved (v28), and an older save works them out.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createSim } from '../src/sim/core.js';
import { QS } from '../src/sim/quests.js';
import { COACH, ROADS, days, fare, townOf, reachedOf, FARE_DAY, PICKUP_TILES, trip } from '../src/sim/coach.js';
import { SITES } from '../src/sim/sites.js';
import { migrate, reachedFor } from '../src/persist/save.js';

const SEED = 20260807;
const actIDone = (sim) => { sim.state.quests.ch1_ember_in_the_fist = { st: QS.DONE, step: 0, n: [] }; };
const onSquare = (sim) => { const h = sim.world.hub, p = sim.state.player; p.x = p.px = h.x + 0.5; p.y = p.py = h.y + 4.5; };
const standAt = (sim, e) => { const p = sim.state.player; p.x = p.px = (e.x0 + e.x1) / 2; p.y = p.py = (e.y0 + e.y1) / 2; };
const said = (sim) => { const out = []; sim.bus.on('refused', (e) => out.push(e.reason)); return out; };
const push = (sim, cmd) => { sim.commands.push(cmd); sim.tick(); };
// a company that has walked to Saltmere and back to Thornwick's square, with gold
function walked() {
  const sim = createSim(SEED, undefined, { scene: 'overland', region: 'fens' }); sim.tick(); actIDone(sim);
  standAt(sim, sim.world.exits.find((x) => x.to === 'town')); sim.tick();
  assert.equal(sim.world.name, 'Saltmere');
  standAt(sim, sim.world.exits.find((x) => x.to === 'overland')); sim.tick();
  standAt(sim, sim.world.exits.find((x) => x.region === 'vale')); sim.tick();
  standAt(sim, sim.world.exits.find((x) => x.to === 'town')); sim.tick();
  assert.equal(sim.world.name, 'Thornwick');
  onSquare(sim); sim.state.counters.gold = 100;
  return sim;
}

test('the coach roads: days are symmetric and 10 gold a day', () => {
  assert.deepEqual(Object.keys(COACH), ['thornwick', 'saltmere', 'ashgate', 'tollhaven', 'frosthold'], 'one town a land (GDD v1.132: Kell\'s Rest is no stop; v1.148 Frosthold; v1.150 Tollhaven)');
  for (const [a, b, n] of ROADS) { assert.equal(days(a, b), n); assert.equal(days(b, a), n); assert.equal(fare(a, b), n * FARE_DAY); }
  assert.equal(days('thornwick', 'thornwick'), 0);
  assert.equal(days('thornwick', 'lamphall'), null, 'not a stop yet');
  assert.equal(townOf('vale'), 'thornwick'); assert.equal(townOf('fens'), 'saltmere'); assert.equal(townOf('reach'), 'ashgate');
  assert.equal(days('saltmere', 'ashgate'), 3, 'by Thornwick');
  assert.equal(townOf('heights'), 'frosthold'); assert.equal(days('thornwick', 'frosthold'), 5, 'by Ashgate');
});

test('the towns reached: you stand in one, the coach stops there', () => {
  const sim = createSim(SEED, undefined, { scene: 'town' });
  assert.deepEqual([...sim.state.reached], ['thornwick']);
  const got = []; sim.bus.on('townReached', (e) => got.push(e.town));
  const w = walked();
  assert.deepEqual([...w.state.reached].sort(), ['saltmere', 'thornwick']);
  const s2 = createSim(SEED, undefined, { scene: 'overland', region: 'fens' }), heard = []; s2.bus.on('townReached', (e) => heard.push(e.town)); s2.tick();
  standAt(s2, s2.world.exits.find((x) => x.to === 'town')); s2.tick();
  assert.deepEqual(heard, ['saltmere'], 'said once, the first time');
  standAt(s2, s2.world.exits.find((x) => x.to === 'overland')); s2.tick(); standAt(s2, s2.world.exits.find((x) => x.to === 'town')); s2.tick();
  assert.deepEqual(heard, ['saltmere']);
  assert.deepEqual(got, []);
});

test('a trip from Thornwick\'s square to Saltmere: the fare, the event, the square at the other end', () => {
  const sim = walked(), ev = []; sim.bus.on('coach', (e) => ev.push(e));
  push(sim, { type: 'coach', to: 'saltmere' });
  assert.deepEqual(ev, [{ from: 'thornwick', to: 'saltmere', days: 1, fare: 10 }]);
  assert.equal(sim.state.counters.gold, 90);
  assert.equal(sim.world.kind, 'town'); assert.equal(sim.world.name, 'Saltmere'); assert.equal(sim.state.region, 'fens');
  const h = sim.world.hub, p = sim.state.player; assert.ok(Math.hypot(p.x - h.x, p.y - h.y) < h.r, 'on the square');
  onSquare(sim); push(sim, { type: 'coach', to: 'thornwick' });
  assert.equal(sim.world.name, 'Thornwick'); assert.equal(sim.state.counters.gold, 80); assert.equal(sim.state.region, 'vale');
});

test('every refusal: no trip, no gold taken, and the reason said', () => {
  const same = (sim, cmd) => {
    const heard = said(sim), ev = []; sim.bus.on('coach', (e) => ev.push(e));
    sim.commands.push(cmd); sim.tick();
    assert.equal(ev.length, 0, `${JSON.stringify(cmd)}: no trip`);
    return { heard };
  };
  // nonsense
  for (const to of [undefined, 'lamphall', 'toString', '__proto__', 7]) { const s = walked(); same(s, { type: 'coach', to }); assert.equal(s.world.name, 'Thornwick'); assert.equal(s.state.counters.gold, 100); }
  // to where you are
  { const s = walked(); same(s, { type: 'coach', to: 'thornwick' }); assert.equal(s.state.counters.gold, 100); }
  // down a dungeon (v1.142: anywhere above ground, never below it)
  { const s = createSim(SEED, undefined, { scene: 'dungeon', site: 'barrows' }); s.tick(); actIDone(s); s.state.reached.add('saltmere'); s.state.counters.gold = 100; const r = same(s, { type: 'coach', to: 'saltmere' });
    assert.deepEqual(r.heard, ['Climb out first: the coach waits above ground']); assert.equal(s.world.kind, 'dungeon'); assert.equal(s.state.counters.gold, 100); }
  // short of a fare that the pickup has raised: out on the Vale's far corner, the road's 10 isn't enough
  { const s = createSim(SEED, undefined, { scene: 'overland' }); s.tick(); actIDone(s); s.state.reached.add('saltmere'); const p = s.state.player, g = s.world.exits.find((e) => e.to === 'town');
    p.x = p.px = (g.x0 + g.x1) / 2 + 60; p.y = p.py = (g.y0 + g.y1) / 2; s.state.counters.gold = 12; const t = trip(s.state, s.world, 'saltmere');
    assert.equal(t.fare, 10 + 6); const r = same(s, { type: 'coach', to: 'saltmere' }); assert.deepEqual(r.heard, ['The fare is 16 gold']); assert.equal(s.state.counters.gold, 12); }
  // a town not reached yet
  { const s = createSim(SEED, undefined, { scene: 'town' }); s.tick(); actIDone(s); onSquare(s); s.state.counters.gold = 100; const r = same(s, { type: 'coach', to: 'saltmere' });
    assert.deepEqual(r.heard, ['You haven’t been there yet']); assert.equal(s.world.name, 'Thornwick'); assert.equal(s.state.counters.gold, 100); }
  // the land shut (reached, then the chapter undone: a hand-edited state)
  { const s = walked(); delete s.state.quests.ch1_ember_in_the_fist; const r = same(s, { type: 'coach', to: 'saltmere' });
    assert.deepEqual(r.heard, ['The road there is shut']); assert.equal(s.world.name, 'Thornwick'); }
  // not enough gold
  { const s = walked(); s.state.counters.gold = 9; const r = same(s, { type: 'coach', to: 'saltmere' });
    assert.deepEqual(r.heard, ['The fare is 10 gold']); assert.equal(s.world.name, 'Thornwick'); assert.equal(s.state.counters.gold, 9); }
  // the hero down or Fallen
  for (const k of ['down', 'fallen']) { const s = walked(); s.state.party[0][k] = true; same(s, { type: 'coach', to: 'saltmere' }); assert.equal(s.world.name, 'Thornwick'); assert.equal(s.state.counters.gold, 100); }
});

test('the towns reached are saved (v28); an older save works them out', () => {
  const sim = walked(), snap = JSON.parse(JSON.stringify(sim.snapshot()));
  assert.deepEqual(snap.reached.sort(), ['saltmere', 'thornwick']);
  const r = createSim(SEED); r.restore(snap); assert.deepEqual([...r.state.reached].sort(), ['saltmere', 'thornwick']);
  // junk in the list is dropped; Thornwick is always there
  const r2 = createSim(SEED); r2.restore({ ...snap, reached: ['saltmere', 'nowhere', 3] }); assert.deepEqual([...r2.state.reached], ['thornwick', 'saltmere']);
  // v27: a Vale save has Thornwick; a save in the Fens, or that has been in a Fens site, has Saltmere too
  const old = { ...createSim(SEED, undefined, { scene: 'town' }).snapshot() }; delete old.reached;
  assert.deepEqual(migrate({ version: 27, savedAt: 1, data: old }).data.reached, ['thornwick']);
  assert.deepEqual(migrate({ version: 27, savedAt: 1, data: { ...old, region: 'fens' } }).data.reached, ['thornwick', 'saltmere']);
  const fensSite = Object.keys(SITES).find((k) => SITES[k].region === 'fens');
  assert.deepEqual(reachedFor({ ...old, sitesEntered: ['barrows', fensSite] }).reached, ['thornwick', 'saltmere']);
  assert.deepEqual(reachedOf({ sitesEntered: ['barrows'] }, SITES), ['thornwick']);
  // and a migrated save restores to the same set
  const m = createSim(SEED); m.restore(migrate({ version: 27, savedAt: 1, data: { ...old, region: 'fens' } }).data); assert.deepEqual([...m.state.reached], ['thornwick', 'saltmere']);
});

test('a coach trip replays to the same state', async () => {
  const { startSession, verifySession } = await import('../src/sim/replay.js');
  const sim = walked(), ss = startSession(sim, { scene: 'town' });
  for (let i = 0; i < 40; i++) { if (i === 10) sim.commands.push({ type: 'coach', to: 'saltmere' }); sim.tick(); }
  assert.equal(sim.world.name, 'Saltmere');
  const claim = ss.claim(), v = verifySession(claim, { verified: ss.startHash, elapsedMs: 1e9 });
  assert.ok(v.ok, 'the honest trip verifies');
});

// (v1.142, the owner: "Fast travel via coach should work anywhere, just scale the gold cost based on how far from common
// points and distances")
test('the coach from anywhere in a town: the road\'s fare alone, off the square too', () => {
  const s = walked(), p = s.state.player, a = s.world.arrivals.overland; p.x = p.px = a.x; p.y = p.py = a.y;
  assert.deepEqual(trip(s.state, s.world, 'saltmere'), { from: 'thornwick', days: 1, fare: 10, pickup: 0 });
  push(s, { type: 'coach', to: 'saltmere' });
  assert.equal(s.world.name, 'Saltmere'); assert.equal(s.state.counters.gold, 90);
});

test('the coach from the overland: the road\'s fare and a gold for every ten tiles to the land\'s town gate', () => {
  const at = (dx) => { const s = createSim(SEED, undefined, { scene: 'overland' }); s.tick(); actIDone(s); s.state.reached.add('saltmere'); s.state.counters.gold = 100;
    const g = s.world.exits.find((e) => e.to === 'town'), p = s.state.player; p.x = p.px = (g.x0 + g.x1) / 2 + dx; p.y = p.py = (g.y0 + g.y1) / 2; return s; };
  const near = trip(at(3).state, at(3).world, 'saltmere'), mid = trip(at(40).state, at(40).world, 'saltmere'), far = trip(at(120).state, at(120).world, 'saltmere');
  assert.equal(near.pickup, 1, 'at the gate: one gold, at least'); assert.equal(mid.pickup, 40 / PICKUP_TILES); assert.equal(far.pickup, 120 / PICKUP_TILES);
  assert.ok(near.fare < mid.fare && mid.fare < far.fare, 'the further out, the dearer');
  for (const t of [near, mid, far]) assert.equal(t.fare, t.days * FARE_DAY + t.pickup);
  const s = at(40), ev = []; s.bus.on('coach', (e) => ev.push(e)); push(s, { type: 'coach', to: 'saltmere' });
  assert.deepEqual(ev, [{ from: 'thornwick', to: 'saltmere', days: 1, fare: 14 }]);
  assert.equal(s.world.kind, 'town'); assert.equal(s.world.name, 'Saltmere'); assert.equal(s.state.counters.gold, 86);
  // and in to the land's own town, for the pickup alone
  const h = at(80); push(h, { type: 'coach', to: 'thornwick' });
  assert.equal(h.world.kind, 'town'); assert.equal(h.world.name, 'Thornwick'); assert.equal(h.state.counters.gold, 100 - 8);
});

test('a coach from the overland replays to the same state', async () => {
  const { startSession, verifySession } = await import('../src/sim/replay.js');
  const sim = createSim(SEED, undefined, { scene: 'overland', region: 'fens' }); sim.tick(); actIDone(sim);
  standAt(sim, sim.world.exits.find((x) => x.to === 'town')); sim.tick(); standAt(sim, sim.world.exits.find((x) => x.to === 'overland')); sim.tick();
  sim.state.counters.gold = 100; const p = sim.state.player; p.x = p.px = p.x + 30;
  const ss = startSession(sim, { scene: 'overland', region: 'fens' });
  for (let i = 0; i < 40; i++) { if (i === 10) sim.commands.push({ type: 'coach', to: 'thornwick' }); sim.tick(); }
  assert.equal(sim.world.name, 'Thornwick');
  const v = verifySession(ss.claim(), { verified: ss.startHash, elapsedMs: 1e9 });
  assert.ok(v.ok, 'the honest trip verifies');
});
