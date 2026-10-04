// The Lantern Guild's board (GDD §9, quest-lore-system §4.2): a day's jobs are a pure function of
// (seed, day, level); the board goes up in town on a new day; jobs are taken and handed in only at
// the board, in town, at most three open; each objective type counts from the sim's own events;
// rewards are paid once; the save keeps ids and refuses ones it couldn't have earned; the words in
// content/board/ match the sim's templates and name only canon posters. The golden path takes a job
// and walks it on the compass alone.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createSim } from '../src/sim/core.js';
import { boardOffers, jobOf, BOARD, TEMPLATES, MAX_JOBS, KEEP_DONE } from '../src/sim/board.js';
import { QS } from '../src/sim/quests.js';
import { DAY_S } from '../src/sim/heroes.js';
import { autoAllocate } from '../src/sim/attributes.js';
import { hire } from './fixtures/hire.mjs';

const SEED = 20260807;
const setLv = (sim, lv) => { const h = sim.state.party[0]; h.level = lv; h.xp = 0; autoAllocate(h); };
const town = (lv = 1, seed = SEED) => { const s = createSim(seed, undefined, { scene: 'town' }); setLv(s, lv); s.tick(); return s; };   // the board goes up on the first tick in town
const push = (sim, cmd) => { sim.commands.push(cmd); sim.tick(); };
const events = (sim, names) => { const ev = []; for (const e of names) sim.bus.on(e, (d) => ev.push({ e, ...d })); return ev; };
/** the first job of a template at this level, from day 0 on @returns {any} */
const findJob = (lv, tpl, ok = () => true, seed = SEED) => { for (let d = 0; d < 400; d++) { const j = boardOffers(seed, d, lv).find((x) => x.tpl === tpl && ok(x)); if (j) return j; } return null; };

test('a day\'s jobs are pure, differ by day, and never ask for a place more than two levels up', () => {
  assert.deepEqual(boardOffers(SEED, 3, 5), boardOffers(SEED, 3, 5));
  assert.notDeepEqual([0, 1, 2, 3, 4].map((d) => boardOffers(SEED, d, 5).map((j) => j.tpl + j.n + j.floor)), Array(5).fill(boardOffers(SEED, 0, 5).map((j) => j.tpl + j.n + j.floor)));
  for (let lv = 1; lv <= 12; lv++) for (let d = 0; d < 30; d++) {
    const jobs = boardOffers(SEED, d, lv);
    assert.equal(jobs.length, lv >= 4 ? 4 : 3, `L${lv}`);
    assert.equal(new Set(jobs.map((j) => j.tpl)).size, jobs.length, 'no template twice');
    for (const j of jobs) {
      const T = BOARD[j.tpl];
      assert.ok(T.target({ n: j.n, floor: j.floor }, lv) <= lv + 2, `${j.id} ${j.tpl} floor ${j.floor}: too deep for L${lv}`);
      assert.ok(j.skulls >= 1 && j.skulls <= 3 && j.rewards.xp > 0 && j.rewards.gold > 0);
      assert.deepEqual(jobOf(SEED, j.id), j, 'the id rebuilds the job');
    }
    if (lv < 2) assert.ok(!jobs.some((j) => j.tpl === 'delve' || j.tpl === 'warden'), 'nothing below the first floor\'s halls at level 1');
  }
  assert.equal(jobOf(SEED, 'board_x'), null); assert.equal(jobOf(SEED, 'board_0_1_7'), null);
});

test('the board goes up in town at dawn and again at dusk (half an hour of play apart), at the level you had then', () => {
  const dun = createSim(SEED, undefined, { scene: 'dungeon' }); for (let i = 0; i < 5; i++) dun.tick();
  assert.equal(dun.state.board.day, -1, 'not in a dungeon');
  const sim = town(3), ev = events(sim, ['boardChanged']);
  assert.deepEqual(sim.state.board, { day: 0, lv: 3, half: 0, region: 'vale' });
  assert.deepEqual(sim.board.nextPosting(), { at: 'dusk', secs: DAY_S / 2 - sim.state.t });
  setLv(sim, 5); sim.tick(); assert.deepEqual(sim.state.board, { day: 0, lv: 3, half: 0, region: 'vale' }, 'the same board until dusk');
  const dawnIds = sim.board.offers().map((j) => j.id);
  sim.state.t = DAY_S / 2 + 1; sim.tick(); assert.deepEqual(sim.state.board, { day: 0, lv: 5, half: 1, region: 'vale' }); assert.equal(ev.length, 1);
  const duskIds = sim.board.offers().map((j) => j.id);
  assert.ok(duskIds.every((id) => /^board_0d_5_\d$/.test(id)) && dawnIds.every((id) => /^board_0_3_\d$/.test(id)), `${dawnIds} / ${duskIds}`);
  assert.equal(sim.board.nextPosting().at, 'dawn');
  sim.state.t = DAY_S + 1; sim.tick(); assert.deepEqual(sim.state.board, { day: 1, lv: 5, half: 0, region: 'vale' }); assert.equal(ev.length, 2);
  assert.equal(sim.board.offers().length, 4);
  // a dawn posting draws as the one-a-day board always did: jobs held in older saves rebuild unchanged
  assert.deepEqual(boardOffers(SEED, 7, 4, 0).map((j) => [j.tpl, j.n, j.floor]), boardOffers(SEED, 7, 4).map((j) => [j.tpl, j.n, j.floor]));
  assert.ok(jobOf(SEED, 'board_7d_4_0') && jobOf(SEED, 'board_7d_4_0').half === 1);
});

test('jobs are taken at the board, in town, once each, three at a time', () => {
  const sim = town(5), ev = events(sim, ['refused', 'questChanged']), jobs = sim.board.offers();
  push(sim, { type: 'boardAccept', id: 'board_3_5_0' }); assert.deepEqual(sim.state.quests, {}, 'not today\'s');
  push(sim, { type: 'boardAccept', id: 'vale_long_way_round' }); assert.deepEqual(sim.state.quests, {}, 'not a board job');
  for (const j of jobs) push(sim, { type: 'boardAccept', id: j.id });
  assert.equal(Object.keys(sim.state.quests).length, MAX_JOBS); assert.equal(sim.board.open(), MAX_JOBS);
  assert.match(ev.find((e) => e.e === 'refused').reason, /3 jobs at a time/);
  push(sim, { type: 'boardAccept', id: jobs[0].id }); assert.equal(Object.keys(sim.state.quests).length, MAX_JOBS, 'not twice');
  assert.equal(sim.state.tracked, jobs[0].id, 'the first is tracked');
  push(sim, { type: 'questAbandon', id: jobs[1].id }); assert.equal(sim.board.offers()[1].status, QS.AVAILABLE, 'abandoned: back on the board');
  const dun = createSim(SEED, undefined, { scene: 'dungeon' }), dev = events(dun, ['refused']);
  push(dun, { type: 'boardAccept', id: jobs[0].id }); assert.deepEqual(dun.state.quests, {}); assert.match(dev[0].reason, /in town/);
});

test('each kind of job counts from the sim\'s own events, in its site', async () => {
  const { isWalkable } = await import('../src/sim/world.js');
  const dungeon = (job) => { const s = createSim(SEED, undefined, { scene: 'dungeon' }); setLv(s, job.lv); s.state.t = job.day * DAY_S; s.quests.begin(job.id); assert.ok(s.state.quests[job.id], job.id); return s; };
  const n = (s, job) => s.state.quests[job.id].n[0], st = (s, job) => s.state.quests[job.id].st;
  const goDown = (s) => { let t; for (const [k, v] of s.world.props) if (v === 'stairs') t = k.split(',').map(Number); const p = s.state.player; p.x = p.px = t[0] + 1.5; p.y = p.py = t[1] + 0.5; push(s, { type: 'harvest', tx: t[0], ty: t[1] }); };
  // hold: any cleared wave in the Barrows
  const hold = findJob(5, 'hold'), a = dungeon(hold), room = a.world.level.rooms[1].id;
  for (let i = 0; i < hold.n; i++) a.bus.emit('wave', { cleared: true, room }); a.bus.emit('wave', { wave: 9 });
  assert.equal(st(a, hold), QS.READY);
  // retrieve: chests opened (a real one)
  const ret = findJob(3, 'retrieve', (j) => j.n === 1), b = dungeon(ret);
  const [ck] = [...b.world.props].find(([, v]) => v === 'chest'), [cx, cy] = ck.split(',').map(Number), p = b.state.player;
  p.x = p.px = cx + 1.5; p.y = p.py = cy + 0.5; push(b, { type: 'harvest', tx: cx, ty: cy }); assert.equal(st(b, ret), QS.READY);
  // bounty: elites only
  const bty = findJob(3, 'bounty', (j) => j.n === 2), c = dungeon(bty);
  c.bus.emit('slain', { elite: false }); assert.equal(n(c, bty), 0);
  c.bus.emit('slain', { elite: true }); c.bus.emit('slain', { elite: true }); assert.equal(st(c, bty), QS.READY);
  // delve: going down counts the floor you reach; loading a save or arriving from outside doesn't
  const dlv = findJob(8, 'delve', (j) => j.floor === 3), d = dungeon(dlv);
  goDown(d); assert.equal(n(d, dlv), 2); goDown(d); assert.equal(st(d, dlv), QS.READY);
  const d2 = dungeon(dlv); d2.bus.emit('levelChanged', { depth: 5, scene: 'dungeon' }); assert.equal(n(d2, dlv), 0);
  // warden: only in a stairs-down hall, on its floor or deeper
  const wdn = findJob(8, 'warden', (j) => j.floor === 2), e = dungeon(wdn), hall = () => e.world.level.descentRoom.id;
  e.bus.emit('wave', { cleared: true, room: hall() }); assert.equal(n(e, wdn), 0, 'too shallow');
  goDown(e); e.bus.emit('wave', { cleared: true, room: e.world.level.rooms.find((r) => r !== e.world.level.descentRoom && r !== e.world.level.entrance).id }); assert.equal(n(e, wdn), 0, 'not the hall');
  for (let i = 0; i < wdn.n; i++) e.bus.emit('wave', { cleared: true, room: hall() });
  assert.equal(st(e, wdn), QS.READY);
  assert.ok(isWalkable);
});

test('handed in at the board in town, when done, paid once; old jobs are let go', () => {
  const sim = town(3), ev = events(sim, ['questReward']), j = sim.board.offers()[0];
  push(sim, { type: 'boardAccept', id: j.id });
  push(sim, { type: 'boardTurnIn', id: j.id }); assert.equal(sim.state.quests[j.id].st, QS.ACTIVE, 'not done yet');
  sim.state.quests[j.id].st = QS.READY;
  const gold = sim.state.counters.gold, xp = sim.state.party[0].xp;
  push(sim, { type: 'boardTurnIn', id: j.id }); push(sim, { type: 'boardTurnIn', id: j.id });
  assert.equal(sim.state.quests[j.id].st, QS.DONE); assert.deepEqual(ev.map((e) => [e.xp, e.gold]), [[j.rewards.xp, j.rewards.gold]]);
  assert.equal(sim.state.counters.gold, gold + j.rewards.gold); assert.ok(sim.state.party[0].xp > xp || sim.state.party[0].level > 3);
  assert.equal(sim.state.tracked, null);
  for (let d = 1; d <= KEEP_DONE + 3; d++) {                 // a job a day for a fortnight
    sim.state.t = d * DAY_S; sim.tick();
    const k = sim.board.offers()[0].id; push(sim, { type: 'boardAccept', id: k }); sim.state.quests[k].st = QS.READY; push(sim, { type: 'boardTurnIn', id: k });
  }
  const done = Object.keys(sim.state.quests).filter((k) => sim.state.quests[k].st === QS.DONE);
  assert.equal(done.length, KEEP_DONE); assert.ok(done.includes(`board_${KEEP_DONE + 3}_${sim.state.board.lv}_0`), 'the newest kept'); assert.ok(!done.includes(j.id), 'the oldest let go');
});

test('the save keeps the board and its jobs by id; it refuses what it couldn\'t have earned', () => {
  const sim = town(4), j = sim.board.offers()[1];
  push(sim, { type: 'boardAccept', id: j.id }); sim.state.quests[j.id].n = [1];
  const data = JSON.parse(JSON.stringify(sim.snapshot()));
  assert.deepEqual(data.board, { day: 0, lv: 4, half: 0, region: 'vale' }); assert.deepEqual(data.quests[j.id], [QS.ACTIVE, 0, 1]);
  const b = town(1); b.restore(data); assert.deepEqual(b.state.board, { day: 0, lv: 4, half: 0, region: 'vale' }); assert.deepEqual(b.state.quests[j.id], { st: QS.ACTIVE, step: 0, n: [1] });
  assert.equal(b.board.offers()[1].status, QS.ACTIVE);
  b.restore({ ...data, quests: { ...data.quests, board_0_60_0: [1, 0, 0], board_9_4_0: [1, 0, 0], board_0d_4_0: [1, 0, 0] }, board: { day: 0, lv: 60 } });
  assert.deepEqual(Object.keys(b.state.quests), [j.id], 'a level above the hero, a day to come, a dusk not yet come: dropped'); assert.deepEqual(b.state.board, { day: -1, lv: 1, half: 0, region: 'vale' });
  b.restore({ ...data, board: { day: 0, lv: 4 } }); assert.deepEqual(b.state.board, { day: 0, lv: 4, half: 0, region: 'vale' }, 'v15: no half is dawn');
  const old = { ...data }; delete old.board; b.restore(old); assert.equal(b.state.board.day, -1); b.tick(); assert.deepEqual(b.state.board, { day: 0, lv: 4, half: 0, region: 'vale' }, 'v8: it goes up in town');
});

// ── the words ─────────────────────────────────────────────────────────────────
const world = readFileSync('docs/emberfall-world.md', 'utf8');
const CANON = ['Maudry Fenn', 'carters', 'Wendel', 'Hale & Daughter', 'Shrine of the Ember', 'Osric Hale', 'Lantern Guild'];
const CANON_FENS = ['Pim Rushlight', 'Drowned Eel', 'Grey Sisters', 'eel-men', 'ferryman', 'Lantern Guild'];
test('content/board has the words for every template the sim makes, with canon posters and only safe slots', () => {
  for (const t of TEMPLATES) {
    const w = JSON.parse(readFileSync(`content/board/${t}.json`, 'utf8'));
    assert.equal(w.id, t);
    const usesN = ['hold', 'retrieve', 'bounty', 'warden'].includes(t), usesFloor = ['delve', 'warden'].includes(t);
    assert.equal(w.brief.many.includes('{n}'), usesN, `${t}: {n}`);
    assert.equal(w.brief.many.includes('{floor}'), usesFloor, `${t}: {floor}`); assert.equal(!!w.ordinals, usesFloor, `${t}: ordinals`);
    for (const s of [w.brief.one, w.brief.many, w.journal, w.label, w.ready, w.done, ...w.titles, ...w.hooks.map((h) => h.text)]) assert.ok(!/\{(?!n\}|floor\})/.test(s), `${t}: unknown slot in "${s}"`);
    for (const h of w.hooks) { const c = CANON.find((n) => h.by.includes(n)); assert.ok(c && world.includes(c), `${t}: "${h.by}" isn't canon`); }
    const f = w.fens;                                                     // Saltmere's (M8): {site} too, the Fens' posters
    for (const s of [f.brief.one, f.brief.many, f.journal, f.label, f.ready, f.done, ...f.titles, ...f.hooks.map((h) => h.text)]) assert.ok(!/\{(?!n\}|floor\}|site\})/.test(s), `${t} (fens): unknown slot in "${s}"`);
    for (const h of f.hooks) { const c = CANON_FENS.find((n) => h.by.includes(n)); assert.ok(c && world.includes(c), `${t} (fens): "${h.by}" isn't canon`); }
    assert.ok(w.label.split(' ')[0].length <= 8, 'the tracker shows the label\'s first word');
  }
});

// on the compass alone, no health top-ups: every kind of job, there and back. Solo where a lone hero
// is meant to manage (GDD §7.1); a stairs-down hall two levels up takes company (the tavern's rogue
// and cleric, hired at the hero's level)
for (const [tpl, lv, hires] of [['hold', 1, []], ['retrieve', 6, []], ['bounty', 2, []], ['delve', 8, []], ['warden', 3, [1, 3]]]) test(`the golden path (${tpl}, level ${lv}${hires.length ? ', a party of three' : ', solo'}): take it at the board, the compass leads, back to town, hand it in`, () => {
  const j = findJob(lv, tpl), sim = town(lv), ev = events(sim, ['questReward', 'defeat']);
  hire(sim, hires);
  assert.equal(sim.state.party.length, 1 + hires.length);
  sim.state.t = j.day * DAY_S; sim.tick();
  push(sim, { type: 'boardAccept', id: j.id }); assert.equal(sim.state.tracked, j.id);
  let went = 0;
  for (let t = 0; t < 20 * 60 * 20 && sim.quests.status(j.id) !== QS.DONE; t++) {
    const p = sim.state.player;
    if (!p.path && t % 10 === 0) {
      const row = sim.destinations().find((r) => r.id === 'quest');
      if (row) { sim.commands.push({ type: 'goto', tx: row.tx, ty: row.ty, near: row.near, then: row.then || null, label: 'quest', room: row.room }); went++; }
    }
    if (sim.world.kind === 'town' && sim.quests.status(j.id) === QS.READY && !p.path) sim.commands.push({ type: 'boardTurnIn', id: j.id });
    sim.tick();
  }
  assert.equal(sim.quests.status(j.id), QS.DONE, `${j.tpl} not done: ${JSON.stringify(sim.state.quests[j.id])} in ${sim.world.kind}`);
  assert.ok(went > 3); assert.equal(ev.filter((e) => e.e === 'questReward').length, 1); assert.equal(ev.filter((e) => e.e === 'defeat').length, 0, 'no wipe');
});

// Saltmere's board (M8): each town's board posts its own land's jobs. Saltmere's send you to the Fens' open sites
// (never one whose first rooms are more than two levels up), its ids end _fens and rebuild alone, and a job counts
// in its own site. Thornwick's are as they were.
test('Saltmere\'s board posts the Fens\' jobs; Thornwick\'s the Old Barrows\'', async () => {
  const { offersIn } = await import('../src/sim/board.js');
  const { SITES } = await import('../src/sim/sites.js');
  for (let lv = 8; lv <= 15; lv++) for (let d = 0; d < 20; d++) for (const h of [0, 1]) {
    const jobs = offersIn(SEED, d, lv, h, 'fens');
    assert.ok(jobs.length >= 3, `L${lv} day ${d}`);
    for (const j of jobs) {
      assert.match(j.id, /_fens$/); assert.equal(j.region, 'fens'); assert.deepEqual(jobOf(SEED, j.id), j, 'the id rebuilds the job');
      const S = SITES[j.site]; assert.equal(S.region, 'fens'); assert.ok(!S.hidden, `${j.site} is open`);
      assert.ok(S.base <= lv + 2 || j.site === 'toadking_mound', `${j.site} (${S.base}) for L${lv}`);
      assert.equal(j.steps[0].objectives[0].site, j.site);
      if (j.floor) assert.ok(j.floor <= S.floors, `${j.id}: floor ${j.floor} of ${S.floors}`);
    }
  }
  assert.deepEqual(offersIn(SEED, 3, 10, 0, 'vale'), boardOffers(SEED, 3, 10, 0), 'the Vale\'s posting is the same as it was');
  // in Saltmere, the posting that goes up is the Fens'; a job taken there counts waves held in its own site
  const sim = createSim(SEED, undefined, { scene: 'town', region: 'fens' }); setLv(sim, 10); sim.tick();
  const offers = sim.board.offers(); assert.ok(offers.length && offers.every((j) => j.region === 'fens'), 'Saltmere\'s board is the Fens\'');
  assert.equal(sim.state.board.region, 'fens');
  const back = createSim(1); back.restore(JSON.parse(JSON.stringify(sim.snapshot()))); assert.equal(back.state.board.region, 'fens', 'the posting\'s land survives a save');
  const words = Object.fromEntries(TEMPLATES.map((t) => [t, JSON.parse(readFileSync(`content/board/${t}.json`, 'utf8'))]));
  for (const t of TEMPLATES) { const f = words[t].fens; assert.ok(f, `${t} has the Fens' words`); assert.ok(/\{site\}/.test(f.journal) && /Drowned Eel/.test(f.ready), t); }
});
