// The barrows road (world doc §3.1 v1.9, *The road*): why the Vale fights its dead, on the map. The Third
// Legion stands across the barrows road in three ranks, facing north, with a stopped wagon beside it;
// walkers get through, wagons don't. Each rank goes when its part of the legion is put down (Maudry's
// errand, Osric's bounty, the Standard); then the road is open. Derived from the save, never saved.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createSim } from '../src/sim/core.js';
import { RANKS, ranksHeld, NEAR } from '../src/sim/road.js';
import { isWalkable } from '../src/sim/world.js';
import { findPath } from '../src/sim/path.js';
import { createStoryBook } from '../src/story/adapter.js';

const SEED = 20260807;
const snap = (sim) => JSON.parse(JSON.stringify(sim.snapshot()));
const vale = (data = {}) => { const s = createSim(SEED, undefined, { scene: 'town' }); s.restore({ ...snap(s), scene: 'overland', ...data }); return s; };
const DONE = (n) => [3, 0, ...Array(n).fill(9)];
const path = (w, a, b) => findPath(a[0], a[1], b[0], b[1], (x, y) => isWalkable(w, x + 0.5, y + 0.5), { maxNodes: 300000 });

test('three ranks hold the road until their parts of the legion are put down, front first', () => {
  const st = (quests, bosses = {}) => ranksHeld({ quests, bosses }).map((r) => r.id);
  assert.deepEqual(st({}), ['front', 'officers', 'standard']);
  assert.deepEqual(st({ vale_long_way_round: { st: 1 } }), ['front', 'officers', 'standard'], 'taken is not done');
  assert.deepEqual(st({ vale_long_way_round: { st: 3 } }), ['officers', 'standard']);
  assert.deepEqual(st({ vale_long_way_round: { st: 3 }, vale_captains_ledger: { st: 3 } }), ['standard']);
  assert.deepEqual(st({ vale_long_way_round: { st: 3 }, vale_captains_ledger: { st: 3 } }, { standard: 1 }), []);
  assert.deepEqual(st({}, { standard: 2 }), ['front', 'officers'], 'each rank on its own count');
});

test('on the Vale: twelve of the dead across the road and a wagon on its side; walkers get through, and every site is still reachable', () => {
  const sim = vale(), w = sim.world;
  assert.equal(w.pickets.length, 12); assert.equal(w.road.ranks, 3);
  assert.ok(w.structs.some((s) => s.id === 'wagon_0'), 'the stopped wagon');
  for (const q of w.pickets) assert.ok(!isWalkable(w, q.x, q.y), `${q.kind} at ${q.x},${q.y} stands solid`);
  assert.ok(path(w, [131, 180], [130, 202]), 'a walker threads the ranks, north to south');
  for (const id of ['barrows', 'sunken_chapel', 'tithe_mill', 'wickham_keep']) { const a = w.arrivals[id]; assert.ok(path(w, [150, 132], [Math.floor(a.x), Math.floor(a.y)]), `the crossroads to ${id}`); }
  assert.equal(createSim(SEED, undefined, { scene: 'town' }).world.pickets.length, 0, 'not in town');
  assert.equal(createSim(SEED, undefined, { scene: 'dungeon' }).world.pickets.length, 0, 'nor below');
});

test('the line thins as the save says; the road opens and the wagon goes with the last rank', () => {
  const two = vale({ quests: { vale_long_way_round: DONE(2) } });
  assert.equal(two.world.pickets.length, 8); assert.ok(!two.world.pickets.some((q) => q.rank === 'front'));
  const one = vale({ quests: { vale_long_way_round: DONE(2), vale_captains_ledger: DONE(1) } });
  assert.deepEqual([...new Set(one.world.pickets.map((q) => q.rank))], ['standard']); assert.ok(one.world.pickets.some((q) => q.kind === 'standard'));
  const open = vale({ quests: { vale_long_way_round: DONE(2), vale_captains_ledger: DONE(1) }, bosses: { standard: 1 } });
  assert.equal(open.world.pickets.length, 0); assert.equal(open.world.road.ranks, 0);
  assert.ok(!open.world.structs.some((s) => s.id === 'wagon_0'), 'the wagon is gone');
  assert.ok(isWalkable(open.world, 131.5, 191.5), 'the road is clear');
});

test('coming near tells you, once a visit; a rank going is news wherever you are', () => {
  const sim = vale(), ev = []; for (const n of ['roadNear', 'roadThinned']) sim.bus.on(n, (e) => ev.push({ n, ...e }));
  const p = sim.state.player, r = sim.world.road;
  p.x = p.px = r.x; p.y = p.py = r.y - NEAR - 4; sim.tick(); assert.equal(ev.length, 0, 'not from afar');
  p.y = p.py = r.y - NEAR + 2; sim.tick(); sim.tick(); p.y = p.py = r.y - NEAR - 4; sim.tick(); p.y = p.py = r.y - NEAR + 2; sim.tick();
  assert.deepEqual(ev, [{ n: 'roadNear', ranks: 3 }], 'once');
  sim.restore({ ...snap(sim), scene: 'overland' }); p.x = p.px = r.x; p.y = p.py = r.y - NEAR + 2; sim.tick();
  assert.equal(ev.filter((e) => e.n === 'roadNear').length, 2, 'again on the next visit');
  // Maudry's errand, handed in: the front rank goes
  const town = createSim(SEED, undefined, { scene: 'town' }); town.tick(); const tev = []; town.bus.on('roadThinned', (e) => tev.push(e.ranks));
  town.state.quests.vale_long_way_round = { st: 2, step: 0, n: [4, 1] };
  const m = town.world.npcs.find((q) => q.id === 'maudry_fenn'), tp = town.state.player; tp.x = tp.px = m.x + 1; tp.y = tp.py = m.y - 1;
  town.commands.push({ type: 'talk', npc: 'maudry_fenn' }); town.tick();
  town.commands.push({ type: 'dialogueEffect', tag: 'quest', args: ['turnin', 'vale_long_way_round'] }); town.tick();
  assert.deepEqual(tev, [2]);
  town.state.quests.vale_captains_ledger = { st: 3, step: 0, n: [3] }; town.bus.emit('questChanged', { id: 'vale_captains_ledger' });
  town.state.bosses.standard = 1; town.bus.emit('bossDown', { id: 'standard', first: true, x: 0, y: 0, lvl: 10 });
  assert.deepEqual(tev, [2, 1, 0], 'and the road opens');
});

test('the words: a line for every state of the road; Ink reads road_ranks (Maudry names it at once; Col and Osric see it open)', async () => {
  const d = JSON.parse(readFileSync('content/road/vale.json', 'utf8'));
  assert.deepEqual(Object.keys(d.near).sort(), RANKS.map((_, i) => String(i + 1)));
  assert.deepEqual(Object.keys(d.thinned).sort(), RANKS.map((_, i) => String(i)));
  const sim = createSim(SEED, undefined, { scene: 'town' }); sim.tick(); let vars = null; sim.bus.on('dialogue', (e) => { vars = e.vars; });
  const m = sim.world.npcs.find((q) => q.id === 'col'), p = sim.state.player; p.x = p.px = m.x + 1; p.y = p.py = m.y - 1;
  sim.commands.push({ type: 'talk', npc: 'col' }); sim.tick(); assert.equal(vars.road_ranks, 3);
  const book = createStoryBook(async (f) => JSON.parse(readFileSync(`content/dialogue/${f}.json`, 'utf8')));
  const say = async (file, knot, v) => { const c = await book.open(file, knot, v, () => {}); let b = c.first, lines = [...b.lines]; while (b.waiting) { b = c.resume(v); lines.push(...b.lines); } return lines.join(' '); };
  assert.match(await say('maudry', 'maudry_hub', { hero_name: 'Tam', flag_met_maudry: 0, road_ranks: 3 }), /standing across the barrows road/);
  assert.doesNotMatch(await say('maudry', 'maudry_hub', { hero_name: 'Tam', flag_met_maudry: 0, road_ranks: 0 }), /standing across/);
  assert.match(await say('townsfolk', 'col_hub', { flag_met_col: 1, road_ranks: 0 }), /Barrows road's open|my old wagon/);
  assert.match(await say('townsfolk', 'col_hub', { flag_met_col: 1, road_ranks: 1 }), /fewer of them/);
  assert.match(await say('osric', 'osric_hub', { hero_name: 'Tam', flag_met_osric: 1, fallen_name: '', road_ranks: 0 }), /barrows road's open/);
  const intro = readFileSync('content/cutscenes/intro.json', 'utf8');
  assert.match(intro, /went back to its post on the road/); assert.doesNotMatch(intro, /turned toward Thornwick/);
});
