// The Mere Tower (GDD §17 v1.31, sim/tower.js; world doc v1.23; the owner, 2026-10-04: "Lets do the mere tower"):
// Wenna Pike's punt from Saltmere's jetty, from level 12; waves +6 % a wave compounding from a table, a new kind every
// tenth wave and a warden on it, no XP, gold and cinders into a satchel banked at each landing; climb on or go home;
// walking out or being beaten loses the satchel (no gold cut besides); the climb is saved and carries on.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createSim } from '../src/sim/core.js';
import { makeMember, statsFor } from '../src/sim/party.js';
import { TOWER, towerTough, blockFamily, wardenWave, wardenAt, waveGold, restoreTower, WARDENS } from '../src/sim/tower.js';
import { BOSSES } from '../src/sim/battle.js';

const SEED = 20260807;
// a party in the tower's stair hall: strong (to climb) or not
function inHall(level = 20) {
  const sim = createSim(SEED, undefined, { scene: 'dungeon', site: 'mere_tower' });
  sim.state.party = [sim.state.party[0], makeMember('c1', 'Osk', 'rogue', level), makeMember('c2', 'Manic', 'cleric', level)];
  for (const m of sim.state.party) { m.level = level; m.hp = statsFor(m).maxHp; m.mp = statsFor(m).maxMp; }
  const L = sim.world.level, r = L.rooms.find((q) => q !== L.entrance), p = sim.state.player; p.x = p.px = r.cx + 0.5; p.y = p.py = r.cy + 0.5;
  const ev = []; for (const k of ['towerWave', 'towerLanding', 'towerOut', 'bossWave', 'bossDown', 'defeat', 'wave']) sim.bus.on(k, (e) => ev.push([k, e]));
  return { sim, ev };
}
const strong = (sim) => { for (const m of sim.state.party) { const s = statsFor(m); m.hp = Math.max(m.hp, s.maxHp * 0.9); m.down = false; } };
function toLanding(sim, ev, max = 20 * 900) { for (let i = 0; i < max && !ev.some(([k]) => k === 'towerLanding'); i++) { strong(sim); sim.tick(); } }

test('the table: +6 % a wave, compounding, the same every time; a new kind every tenth wave; a warden on it', () => {
  assert.equal(towerTough(1), 1); assert.ok(Math.abs(towerTough(11) - 1.7908476965428546) < 1e-12, String(towerTough(11)));
  for (let n = 2; n < 200; n++) assert.ok(Math.abs(towerTough(n) / towerTough(n - 1) - 1.06) < 1e-12);
  assert.deepEqual([1, 10, 11, 20, 21, 91].map(blockFamily), ['ashbound', 'ashbound', 'redhand', 'redhand', 'goblin', 'ashbound']);
  assert.deepEqual([9, 10, 11, 20].map(wardenWave), [false, true, false, true]);
  assert.equal(wardenAt(10), 'warden_doorward'); assert.equal(wardenAt(20), 'warden_mudlark'); assert.equal(wardenAt(110), 'warden_doorward');
  for (const id of Object.keys(WARDENS)) assert.ok(BOSSES[id] && BOSSES[id].tower, `${id} fights as a boss`);
  assert.ok(waveGold(20) > waveGold(1));
});

test('Wenna\'s punt at Saltmere\'s jetty: under level 12 she won\'t take you; at 12 it\'s out to the Tower, and its stair brings you back', () => {
  const sim = createSim(SEED, undefined, { scene: 'overland', region: 'fens' }), ev = [];
  sim.bus.on('siteLevel', (e) => ev.push(e));
  const ex = sim.world.exits.find((e) => e.site === 'mere_tower'); assert.ok(ex, 'a way in on the Fens');
  const p = sim.state.player, at = () => { p.x = p.px = (ex.x0 + ex.x1) / 2; p.y = p.py = (ex.y0 + ex.y1) / 2; };
  sim.state.party[0].level = 11; at(); sim.tick();
  assert.equal(sim.world.kind, 'overland'); assert.deepEqual(ev, [{ site: 'mere_tower', need: 12 }]);
  sim.state.party[0].level = 12; p.x = p.px = sim.world.arrivals.mere_tower.x; p.y = p.py = sim.world.arrivals.mere_tower.y; sim.tick(); at(); sim.tick();
  assert.equal(sim.world.kind, 'dungeon'); assert.equal(sim.world.site, 'mere_tower'); assert.equal(sim.state.region, 'fens');
  p.x = p.px = sim.world.exitAt.x; p.y = p.py = sim.world.exitAt.y; sim.tick();
  const a = sim.world.arrivals.mere_tower; assert.equal(sim.world.kind, 'overland'); assert.ok(Math.hypot(p.x - a.x, p.y - a.y) < 2, 'back on the jetty');
});

test('the climb: no XP; each wave into the satchel; the tenth a warden; at the landing the satchel is banked and the hall waits', () => {
  const { sim, ev } = inHall(), xp0 = sim.state.party.map((m) => m.xp), g0 = sim.state.counters.gold || 0;
  toLanding(sim, ev);
  const T = sim.state.tower, land = ev.find(([k]) => k === 'towerLanding')[1];
  assert.equal(land.wave, 10); assert.equal(land.landing, 1);
  const paid = [...Array(10)].reduce((n, _, i) => n + waveGold(i + 1), 0);
  assert.equal(land.banked.gold, paid); assert.equal(land.banked.cinders, 10 * TOWER.cinders + TOWER.wardenCinders);
  assert.equal(sim.state.counters.gold - g0, paid, 'banked: the satchel is yours');
  assert.deepEqual(sim.state.party.map((m) => m.xp), xp0, 'no XP');
  assert.deepEqual(ev.filter(([k]) => k === 'bossWave').map(([, e]) => e.name), ['The Doorward']);
  assert.ok(T.atLanding && T.wave === 10 && T.best === 10 && T.landing === 1); assert.deepEqual(T.satchel, { gold: 0, cinders: 0 });
  for (let i = 0; i < 20 * 20; i++) sim.tick();
  assert.equal(ev.filter(([k, e]) => k === 'wave' && !e.cleared).length, 10, 'the hall waits at a landing');
  sim.commands.push({ type: 'towerClimb' }); for (let i = 0; i < 20 * 8; i++) sim.tick();
  const w11 = ev.filter(([k, e]) => k === 'wave' && !e.cleared).pop()[1]; assert.equal(w11.wave, 11);
  assert.ok(sim.world.enemies.some((e) => e.kind === 'cutthroat' || e.kind === 'brute' || e.kind === 'crossbow'), 'the second ten are the Redhand');
});

test('at a landing, home with Wenna keeps everything; walked out mid-climb, the satchel is lost; a bad command does nothing', () => {
  const { sim, ev } = inHall();
  sim.commands.push({ type: 'towerLeave' }); sim.tick(); assert.equal(sim.world.site, 'mere_tower', 'not at a landing: nothing');
  sim.commands.push({ type: 'towerClimb' }); sim.tick();
  toLanding(sim, ev);
  const g = sim.state.counters.gold;
  sim.commands.push({ type: 'towerLeave' }); sim.tick();
  assert.equal(sim.world.kind, 'overland'); assert.equal(sim.state.counters.gold, g, 'kept'); assert.equal(sim.state.tower.wave, 0); assert.equal(sim.state.tower.best, 10);
  assert.deepEqual(ev.find(([k]) => k === 'towerOut')[1], { lost: null });
  // mid-climb, walked out: the satchel's lost, the bank stands
  const b = inHall(); for (let i = 0; i < 20 * 60; i++) { strong(b.sim); b.sim.tick(); }
  const sat = { ...b.sim.state.tower.satchel }, gb = b.sim.state.counters.gold || 0; assert.ok(sat.gold > 0, 'something in the satchel');
  const L = b.sim.world.level, e = L.entrance, p = b.sim.state.player; p.x = p.px = e.cx + 0.5; p.y = p.py = e.cy + 0.5; b.sim.tick();
  assert.deepEqual(b.ev.find(([k]) => k === 'towerOut')[1].lost, sat); assert.equal(b.sim.state.counters.gold || 0, gb);
  assert.deepEqual(b.sim.state.tower.satchel, { gold: 0, cinders: 0 }); assert.equal(b.sim.state.tower.wave, 0);
});

test('beaten in the Tower: the satchel is lost, and no quarter of your gold besides', () => {
  const { sim, ev } = inHall(9); sim.state.counters.gold = 1000;
  for (let i = 0; i < 20 * 900 && !ev.some(([k]) => k === 'defeat'); i++) sim.tick();
  const d = ev.find(([k]) => k === 'defeat'); assert.ok(d, 'a level-9 company is beaten up there'); assert.equal(d[1].lost, 0);
  assert.equal(sim.state.counters.gold, 1000); assert.equal(sim.state.tower.wave, 0); assert.ok(sim.state.tower.best > 0);
});

test('a climb is saved and carries on at its wave, paid once; a bad save reads as no climb', () => {
  const { sim } = inHall();
  for (let i = 0; i < 20 * 70; i++) { strong(sim); sim.tick(); }
  const snap = JSON.parse(JSON.stringify(sim.snapshot())), T = snap.tower; assert.ok(T.wave > 0, `wave ${T.wave}`);
  const r = createSim(SEED); r.restore(snap); assert.deepEqual(r.state.tower, sim.state.tower);
  const paid = []; r.bus.on('towerWave', (e) => paid.push(e.wave)); r.bus.on('wave', (e) => { if (!e.cleared) paid.push('w' + e.wave); });
  for (let i = 0; i < 20 * 30; i++) { strong(r); r.tick(); }
  assert.equal(paid[0], 'w' + (T.wave + 1), `carries on at ${T.wave + 1}, nothing paid twice: ${paid.slice(0, 3)}`);
  assert.deepEqual(restoreTower({ tower: { wave: -2, best: 'x', satchel: { gold: 1.5 } } }), { wave: 0, best: 0, landing: 0, atLanding: false, satchel: { gold: 0, cinders: 0 } });
  assert.equal(restoreTower({ tower: { wave: 7, atLanding: true } }).atLanding, false, 'a landing is every tenth wave');
});
