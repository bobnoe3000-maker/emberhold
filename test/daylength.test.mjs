// The hour-long day (GDD §10.1 v1.10): an in-game day is an hour of play, in four 15-minute parts
// (dawn · day · dusk · night); the Lantern Guild's wage is paid once a dawn, the same amount as before.
// A save kept on the old 24-minute day (v14 and older: no dayS) is retimed onto the same day number and
// the same time of that day, so nothing stored by the day (wages, a board job, the tavern) is lost or paid
// twice, and Weakened keeps the seconds it had left.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createSim } from '../src/sim/core.js';
import { DAY_S } from '../src/sim/heroes.js';
import { PART_S, partOf } from '../src/sim/npcs.js';
import { wageOf } from '../src/sim/companions.js';
import { boardOffers } from '../src/sim/board.js';
import { metaOf } from '../src/persist/save.js';
import { hire } from './fixtures/hire.mjs';

const SEED = 20260807;
const bill = (s) => s.state.party.reduce((n, m) => n + wageOf(m, false), 0) + s.state.bench.reduce((n, m) => n + wageOf(m, true), 0);

test('a day is an hour of play, in four parts of 15 minutes', () => {
  assert.equal(DAY_S, 3600); assert.equal(PART_S, 900);
  assert.deepEqual([0, 899, 900, 1799, 1800, 2700, 3599, 3600].map(partOf), [0, 0, 1, 1, 2, 3, 3, 0]);
});

test('wages come once a dawn, an hour apart, and the amount is the rank\'s, as it was', () => {
  const s = createSim(SEED, undefined, { scene: 'town' }); s.state.party[0].level = 4; s.tick(); hire(s, [0, 1]);
  const due = bill(s), ev = []; s.bus.on('wages', (w) => ev.push(w));
  assert.equal(due, s.state.party.filter((m) => !m.main).reduce((n, m) => n + wageOf(m, false), 0));
  s.state.counters.gold = 1e6;
  for (let t = 60; t <= 2 * DAY_S + 60; t += 60) { s.state.t = t; s.tick(); }   // two hours, a minute at a time
  assert.equal(ev.length, 2, 'two dawns in two hours');
  assert.deepEqual(ev.map((w) => w.paid), [due, due]);
  assert.deepEqual(ev.map((w) => w.day), [1, 2]);
});

test('a v14 save (a 24-minute day) keeps its day number, its time of day, a board job and Weakened\'s seconds', () => {
  const s = createSim(SEED, undefined, { scene: 'town' }); s.state.party[0].level = 4; s.tick(); hire(s, [0]);
  s.state.t = 3 * DAY_S + 5; s.tick();                                      // day 3: its wage settled, its board up
  const job = boardOffers(SEED, 3, 4)[0]; s.commands.push({ type: 'boardAccept', id: job.id }); s.tick();
  assert.ok(s.state.quests[job.id], 'the job is taken');
  const v14 = JSON.parse(JSON.stringify(s.snapshot())); delete v14.dayS;
  v14.t = 3 * 1440 + 700;                                                     // day 3 of the old clock, 700 s in: part 1 (day)
  v14.party[0].weakUntil = v14.t + 300;
  const r = createSim(SEED, undefined, { scene: 'town' }); r.restore(v14);
  assert.equal(r.state.t, 3 * DAY_S + 700 * 2.5);
  assert.equal(Math.floor(r.state.t / DAY_S), 3); assert.equal(partOf(r.state.t), 1);
  assert.equal(r.state.party[0].weakUntil - r.state.t, 300, 'Weakened keeps its 300 s');
  assert.deepEqual(r.state.board, { day: 3, lv: 4, half: 0 }); assert.ok(r.board.def(job.id), 'the board job still stands');
  assert.equal(r.state.wageDay, 3);
  const ev = []; r.bus.on('wages', (w) => ev.push(w)); r.tick();
  assert.equal(ev.length, 0, 'no wage twice for a dawn already paid');
  r.state.t = 4 * DAY_S; r.tick(); assert.equal(ev.length, 1, 'and the next dawn pays');
  // a current save isn't retimed, and the slot card's playtime counts ticks, not the retimed clock
  const again = createSim(SEED, undefined, { scene: 'town' }); again.restore(JSON.parse(JSON.stringify(r.snapshot())));
  assert.equal(again.state.t, r.state.t);
  assert.equal(metaOf({ ...v14, tick: 7200 }).playtime, 360);
});
