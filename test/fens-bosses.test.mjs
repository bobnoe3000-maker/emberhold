// The Fens' bosses and the ground hazard (M8.6; GDD §17 v1.36; world doc v1.27; the owner, 2026-10-05: "do the Fens
// bosses"). One a hall, each with one mechanic: the Toadking's mud (a patch under each of the party), Brother Teague's
// lantern-cage (it mends him and halves his hurts until it's broken; its soul goes free), the Drowned Choir's Vespers
// (its cantors' song mends the drowned; another stands up when they're down), the Abbess Below's bells (the hall floods
// in from its walls; her choir-lamp breaks with her). In a hazard the party moves at half speed and recovers slower,
// and steps out of it; each boss falls to the right party at its hall's level.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createSim } from '../src/sim/core.js';
import { statsFor } from '../src/sim/party.js';
import { autoAllocate } from '../src/sim/attributes.js';
import { starterKit, HEIRLOOMS } from '../src/sim/items.js';
import { BOSSES, MUD_S, MUD_T, BELL_S, FLOOD_MAX, VESPERS_S, halved } from '../src/sim/battle.js';
import { bossAt } from '../src/sim/sites.js';
import { isWalkable } from '../src/sim/world.js';
import { LAMPS } from '../src/sim/lamps.js';
import { HAZARD, hazardAt, edgeDistances, openGround } from '../src/sim/hazards.js';

const SEED = 20260807;
// the right party (fighter, rogue, cleric) at a level, walked into a site's hall on floor `floor`
function inHall(site, level, floor, seed = SEED) {
  const sim = createSim(seed, undefined, { scene: 'dungeon', site });
  sim.state.trials = { fighter: 1, rogue: 1, mage: 1, cleric: 1, shaman: 1, fighter12: 1, rogue12: 1, mage12: 1, cleric12: 1, shaman12: 1 };
  const t = createSim(seed, undefined, { scene: 'town' }); for (const i of [0, 2]) { t.state.counters.gold = 1e9; t.commands.push({ type: 'hire', idx: i }); t.tick(); }
  sim.state.party.push(...t.state.party.slice(1).map((m) => ({ ...m, perks: [], hidden: null })));
  ['fighter', 'rogue', 'cleric'].forEach((c, i) => { const m = sim.state.party[i]; m.cls = c; m.level = level; m.attrs = null; autoAllocate(m); m.gear = starterKit(m); m.hp = statsFor(m).maxHp; m.mp = undefined; });
  sim.tick();
  while (sim.world.stairsAt && sim.state.depth < floor - 1) { const s = sim.world.stairsAt, p = sim.state.player; p.x = p.px = s.x + 0.5; p.y = p.py = s.y + 1.5; sim.commands.push({ type: 'harvest', tx: s.x, ty: s.y }); sim.tick(); }
  const L = sim.world.level, r = L.descentRoom, p = sim.state.player; let best = null, bd = 1e9;
  for (const [k, c] of L.cells) { if (c.kind !== 'floor' || c.room !== r.id) continue; const [x, y] = k.split(',').map(Number); const d = Math.hypot(x - r.cx, y - r.cy); if (d < bd && isWalkable(sim.world, x + 0.5, y + 0.5)) { bd = d; best = [x, y]; } }   // (open ground: not the stairwell)
  p.x = p.px = best[0] + 0.5; p.y = p.py = best[1] + 0.5; sim.state.party.forEach((m, i) => { if (i) { m.x = m.px = p.x + (i === 1 ? -0.9 : 0.9); m.y = m.py = p.y + 0.9; } });
  const ev = []; for (const k of ['bossWave', 'bossDown', 'bossMud', 'bossCage', 'bossVespers', 'bossFlood', 'lampBroken', 'loot', 'defeat']) sim.bus.on(k, (e) => ev.push([k, e]));
  return { sim, ev };
}
const until = (sim, secs, done) => { for (let i = 0; i < secs * 20 && !done(); i++) sim.tick(); };
const boss = (sim) => (sim.world.enemies || []).find((e) => e.boss && e.hp > 0);
const pos = (sim, i) => (i ? sim.state.party[i] : sim.state.player);

test('the halls: the Toadking on the Mound\'s second floor; Teague, the Choir and the Abbess on the Abbey\'s three', () => {
  assert.equal(bossAt('toadking_mound', 1), 'toadking');
  assert.deepEqual([0, 1, 2].map((d) => bossAt('drowned_abbey', d)), ['teague', 'drowned_choir', 'abbess_below']);
  for (const id of ['toadking', 'teague', 'drowned_choir', 'abbess_below']) assert.ok(HEIRLOOMS[BOSSES[id].heirloom], `${id}'s heirloom`);
  assert.deepEqual([BOSSES.teague.once, BOSSES.toadking.once], [true, undefined], 'Teague falls once; the others come back');
  assert.deepEqual(LAMPS.choir_lamp, { name: "The Abbey's choir-lamp", keeper: 'abbess_below', souls: 312 });
});

test('the hazard: a hall\'s edge, a patch, the ground out of it', () => {
  const cells = []; for (let y = 0; y < 7; y++) for (let x = 0; x < 7; x++) cells.push([x, y]);
  const E = edgeDistances(cells);
  assert.deepEqual([E.get('0,0'), E.get('1,1'), E.get('2,3'), E.get('3,3')], [1, 2, 3, 4]);
  const b = { hazards: [{ kind: 'mud', x: 3.5, y: 3.5, r: 1.8, until: 9 }], flood: 1, edge: E };
  assert.equal(hazardAt(b, 3.5, 4.5), 'mud'); assert.equal(hazardAt(b, 0.5, 3.5), 'water'); assert.equal(hazardAt(b, 1.5, 1.5), null);
  const o = openGround(b, 3.5, 3.5, 3.5, 0, (x, y) => x >= 0 && y >= 0 && x < 7 && y < 7);
  assert.ok(o && !hazardAt(b, o[0], o[1]) && Math.hypot(o[0] - 3.5, o[1] - 3.5) < 3, `out to ${o}`);
});

test('the Toadking: mud under each of the party every 9 s; in it, half speed and slower to recover; they step out; it goes with him', () => {
  const { sim, ev } = inHall('toadking_mound', 11, 2);
  until(sim, 30, () => ev.some(([k]) => k === 'bossMud'));
  const mud = ev.find(([k]) => k === 'bossMud'); assert.ok(mud, 'he stamped'); assert.equal(ev.find(([k]) => k === 'bossWave')[1].id, 'toadking');
  const B = sim.battle; assert.equal(B.hazards.length, mud[1].n); assert.ok(mud[1].n >= 2);
  for (const h of B.hazards) assert.ok(Math.abs(h.until - sim.state.t - MUD_T) < 0.1);
  until(sim, 2.5, () => false);
  const standing = sim.state.party.map((m, i) => (!m.down && hazardAt(sim.battle, pos(sim, i).x, pos(sim, i).y) ? m.cls : null)).filter(Boolean);
  assert.ok(standing.length < mud[1].n, `stepped out of the mud (still in it: ${standing.join(', ') || 'nobody'})`);
  until(sim, MUD_S * 2, () => false); assert.ok(ev.filter(([k]) => k === 'bossMud').length >= 2, 'again 9 s on');
  until(sim, 240, () => ev.some(([k]) => k === 'bossDown' || k === 'defeat'));
  assert.ok(ev.some(([k]) => k === 'bossDown'), 'he falls to the right party at his hall\'s level');
  assert.equal(sim.battle ? sim.battle.hazards.length : 0, 0, 'the mud goes with him');
  assert.ok(ev.some(([k, e]) => k === 'loot' && e.heirloom === 'the_last_tooth'), 'The Last Tooth, the first time');
});

test('in the mud: the hero you steer goes at half speed, and a blow takes longer to recover from', () => {
  const { sim } = inHall('toadking_mound', 11, 2);
  until(sim, 4, () => !!(sim.battle && sim.battle.bossUp));
  const p = sim.state.player, run = (mud) => {
    sim.battle.hazards = mud ? [{ kind: 'mud', x: p.x, y: p.y, r: 30, until: sim.state.t + 60 }] : [];
    const x0 = p.x, y0 = p.y; for (let i = 0; i < 20; i++) { sim.commands.push({ type: 'move', x: 1, y: 0 }); sim.tick(); }
    const d = Math.hypot(p.x - x0, p.y - y0); for (let i = 0; i < 10; i++) { sim.commands.push({ type: 'move', x: -1, y: 0 }); sim.tick(); } return d;
  };
  const dry = run(false), wet = run(true);
  assert.ok(wet < dry * 0.7, `steered a second: ${dry.toFixed(2)} tiles dry, ${wet.toFixed(2)} in the mud`);
  const m = sim.state.party[1]; sim.battle.hazards = [{ kind: 'mud', x: m.x, y: m.y, r: 30, until: sim.state.t + 60 }]; m.cd = 1; sim.tick();
  assert.ok(Math.abs(m.cd - (1 - 0.05 * HAZARD.recover)) < 1e-9, `recovers at ${HAZARD.recover} the rate: cd ${m.cd}`);
});

test('Brother Teague: his lit cage mends him and halves his hurts; broken, its soul goes free and he\'s only a man; once', () => {
  const { sim, ev } = inHall('drowned_abbey', 13, 1);
  until(sim, 10, () => !!boss(sim));
  const T = boss(sim); assert.equal(T.boss, 'teague');
  const cage = sim.world.enemies.find((e) => e.kind === 'lantern'); assert.ok(cage && cage.inert && cage.owner === T.id && cage.id === T.cage);
  assert.ok(Math.abs(cage.maxHp - Math.round(T.maxHp * 0.35)) <= 1, 'a third of his strength, about');
  assert.ok(halved(T, sim.world.enemies), 'blows slide off him while it\'s lit');
  T.hp = Math.round(T.maxHp * 0.5); const h0 = T.hp; for (let i = 0; i < 20; i++) sim.tick();
  assert.ok(T.hp > h0, `it mends him (${h0} → ${T.hp})`);
  assert.ok(Math.hypot(cage.x - T.x, cage.y - T.y) < 1.2, `carried at his side (${Math.hypot(cage.x - T.x, cage.y - T.y).toFixed(2)}: ${cage.x.toFixed(2)},${cage.y.toFixed(2)} spawn ${cage.spawn} vs ${T.x.toFixed(2)},${T.y.toFixed(2)} spawn ${T.spawn} hp ${cage.hp})`);
  const n0 = { ...sim.state.count };
  until(sim, 120, () => ev.some(([k]) => k === 'bossCage'));
  assert.ok(ev.some(([k]) => k === 'bossCage'), 'the party breaks it');
  assert.equal(sim.state.count.lamps, n0.lamps + 1); assert.ok(sim.state.count.souls >= n0.souls + 1);
  assert.ok(!halved(T, sim.world.enemies), 'and he takes his blows whole');
  until(sim, 240, () => ev.some(([k]) => k === 'bossDown' || k === 'defeat'));
  assert.ok(ev.some(([k]) => k === 'bossDown'));
  assert.ok(ev.some(([k, e]) => k === 'loot' && e.heirloom === 'teagues_name'));
  assert.equal(sim.state.bosses.teague, 1);
});

// (M8 slice 11, the boss harness) seed 4242 at the hall's level never ended: Teague was shoved out of his hall into the
// corridor below it, the fighter after him, where the rest of the party (leashed to the room) couldn't follow; and his
// cage, carried at his side with his back to a wall, sat in the wall where no blow could reach it
test('Teague can\'t be shoved out of his hall, nor his cage carried into a wall: the right party at 12 puts him down, every seed', () => {
  for (const seed of [4242, 3, 20260807]) {
    const { sim, ev } = inHall('drowned_abbey', 12, 1, seed);
    let outside = 0, inWall = 0;
    const roomAt = (w, x, y) => { const c = w.level.cells.get(Math.floor(x) + ',' + Math.floor(y)); return c && c.kind === 'floor' ? c.room : -1; };
    for (let i = 0; i < 20 * 150 && !ev.some(([k]) => k === 'bossDown' || k === 'defeat'); i++) {
      sim.tick();
      const T = boss(sim), cage = sim.world.enemies.find((e) => e.kind === 'lantern' && e.hp > 0), b = sim.battle;
      if (T && b && roomAt(sim.world, T.x, T.y) !== b.room && T.spawn <= 0) outside++;
      if (cage && cage.spawn <= 0 && !isWalkable(sim.world, cage.x, cage.y)) inWall++;   // (once it's up: a spawning foe can't be struck)
    }
    assert.ok(ev.some(([k]) => k === 'bossDown'), `seed ${seed}: he falls in 150 s`);
    assert.equal(inWall, 0, `seed ${seed}: his cage stayed where blows could reach it`);
    assert.ok(outside < 20, `seed ${seed}: he stayed in his hall (${outside} ticks out)`);
  }
});

test('the Drowned Choir: while a cantor sings the drowned mend; with the singers down, another stands up out of the stalls', () => {
  const { sim, ev } = inHall('drowned_abbey', 14, 2);
  until(sim, 10, () => !!boss(sim));
  const C = boss(sim); assert.equal(C.boss, 'drowned_choir');
  const singers = () => sim.world.enemies.filter((e) => e.singer === C.id && e.hp > 0 && !e.dead);
  assert.equal(singers().length, 2, 'two cantors sing with it');
  const hold = () => { for (const m of sim.state.party) m.cd = 99; };                                  // (the party holds its blows while we listen)
  C.hp = Math.round(C.maxHp * 0.5); const h0 = C.hp; for (let i = 0; i < 20; i++) { hold(); sim.tick(); }
  assert.ok(C.hp > h0 || !singers().length, `the song mends it (${h0} → ${C.hp})`);
  for (const s of singers()) { s.hp = 0; s.dead = 1; }
  const n = ev.filter(([k]) => k === 'bossVespers').length, h1 = C.hp; for (let i = 0; i < 10; i++) { hold(); sim.tick(); }
  for (const m of sim.state.party) m.cd = 0;
  assert.ok(C.hp <= h1, 'no singer, no mending');
  until(sim, VESPERS_S + 1, () => ev.filter(([k]) => k === 'bossVespers').length > n);
  assert.ok(ev.filter(([k]) => k === 'bossVespers').length > n, 'another stands up');
  until(sim, 240, () => ev.some(([k]) => k === 'bossDown' || k === 'defeat'));
  assert.ok(ev.some(([k]) => k === 'bossDown'), 'it falls to the right party at its hall\'s level');
});

test('the Abbess Below: each bell floods the hall a tile further in, to 3; she falls, the water goes, her choir-lamp breaks once', () => {
  const { sim, ev } = inHall('drowned_abbey', 15, 3);
  until(sim, 10, () => !!boss(sim)); assert.equal(boss(sim).boss, 'abbess_below');
  until(sim, BELL_S + 1, () => ev.some(([k]) => k === 'bossFlood'));
  assert.equal(sim.battle.flood, 1); const E = sim.battle.edge; assert.ok(E && E.size > 10);
  const wall = [...E].find(([, d]) => d === 1)[0].split(',').map(Number); assert.equal(hazardAt(sim.battle, wall[0] + 0.5, wall[1] + 0.5), 'water');
  boss(sim).hp = boss(sim).maxHp * 10;                                                         // (hold her up to watch the water rise)
  until(sim, BELL_S * 4, () => false); assert.equal(sim.battle.flood, FLOOD_MAX, 'to 3, no further');
  boss(sim).hp = boss(sim).maxHp;
  until(sim, 240, () => ev.some(([k]) => k === 'bossDown' || k === 'defeat'));
  assert.ok(ev.some(([k]) => k === 'bossDown'), 'she falls');
  assert.equal(sim.battle ? sim.battle.flood : 0, 0, 'the water goes down');
  const lb = ev.find(([k]) => k === 'lampBroken'); assert.ok(lb && lb[1].id === 'choir_lamp' && lb[1].first && lb[1].held === 312);
  assert.ok(sim.state.lampsBroken.includes('choir_lamp'));
  assert.ok(ev.some(([k, e]) => k === 'loot' && e.heirloom === 'the_last_office'));
});
