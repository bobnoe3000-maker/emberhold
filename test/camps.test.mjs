// Spawn points on the overland (GDD §10.3 v1.63, src/sim/camps.js): the Spit's band idles at its fire until the party is
// in reach, then fights as one wave in its arena; cleared, it's empty for its respawn and comes back; walked away from,
// it's back whole; one fill in four has an elite; a nest's one or two come out when you're near; when each is full again
// is saved (v37); Col's and Jory's errands count a clear; the compass lists them; the quests match their JSON and Ink.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createSim } from '../src/sim/core.js';
import { CAMPS, CAMP_BY, bandOf, campsFrom } from '../src/sim/camps.js';
import { QUESTS, QS } from '../src/sim/quests.js';
import { isWalkable } from '../src/sim/world.js';
import { hypot } from '../src/sim/detmath.js';

const SEED = 20260807;
const land = () => { const sim = createSim(SEED, undefined, { scene: 'overland', region: 'vale' }); sim.tick(); return sim; };
const stand = (sim, x, y) => { const p = sim.state.player; p.x = p.px = x; p.y = p.py = y; sim.state.party.forEach((m, i) => { if (i) { m.x = m.px = x + (i === 1 ? -0.9 : 0.9); m.y = m.py = y + 0.9; } }); };
const living = (sim) => (sim.world.enemies || []).filter((e) => !e.idle && !e.dead && e.hp > 0);
const SPIT = CAMP_BY.vale_spit, DITCH = CAMP_BY.vale_ditch;
/** the fight's foes knocked to 1 HP, then ticks until the camp is cleared (or the limit) */

test('the spawn points stand on open ground, their posts and holes walkable, each arena clear of the others', () => {
  const sim = land(), w = sim.world;
  for (const c of CAMPS.filter((q) => q.region === 'vale')) {
    assert.ok(isWalkable(w, c.x, c.y) || c.kind === 'camp', `${c.id}: its middle is open ground`);
    for (const [dx, dy] of c.posts || []) assert.ok(isWalkable(w, c.x + dx, c.y + dy), `${c.id}: a post at ${dx},${dy} is open`);
    if (c.hole) assert.ok(isWalkable(w, c.x + c.hole[0], c.y + c.hole[1]), `${c.id}: its hole is open`);
    assert.ok(c.reach < c.arena, `${c.id}: its reach inside its arena`);
    for (const o of CAMPS) if (o !== c && o.region === c.region) assert.ok(hypot(o.x - c.x, o.y - c.y) > o.arena + c.arena, `${c.id} and ${o.id} apart`);
  }
});

test('the Spit: three goblins idle at the fire, a fight of level 2 in reach, cleared and quiet, back after its respawn', () => {
  const sim = land(), ev = [];
  for (const k of ['battle', 'campCleared', 'wave']) sim.bus.on(k, (d) => ev.push({ k, ...d }));
  stand(sim, SPIT.x + SPIT.arena + 4, SPIT.y); sim.tick();
  const idle = sim.world.enemies.filter((e) => e.idle === 'vale_spit');
  assert.equal(idle.length, 3, 'three round the fire'); assert.ok(idle.every((e) => e.kind === 'gob'), 'goblins');
  assert.equal(sim.battle, null, 'no fight before it sees you');
  stand(sim, SPIT.x + SPIT.reach - 0.5, SPIT.y); sim.tick();
  assert.ok(sim.battle && sim.battle.camp === SPIT, 'in reach: the fight is on');
  assert.equal(living(sim).length, 3); assert.ok(living(sim).every((e) => e.lvl === 2), 'level 2');
  assert.equal(sim.world.enemies.filter((e) => e.idle).length, 0, 'the idle band gave way to the fighting one');
  for (let i = 0; i < 20 * 60 && !ev.some((e) => e.k === 'campCleared'); i++) { for (const e of living(sim)) e.hp = Math.min(e.hp, 1); for (const m of sim.state.party) m.hp = 9999; sim.tick(); }
  const c = ev.find((e) => e.k === 'campCleared'); assert.ok(c, 'cleared'); assert.equal(c.id, 'vale_spit'); assert.equal(c.n, 1);
  assert.equal(ev.filter((e) => e.k === 'wave' && !e.cleared).length, 1, 'one wave, no more');
  assert.ok(Math.abs(sim.state.camps.vale_spit.at - (sim.state.t + SPIT.respawn)) < 2, 'empty for its respawn');
  stand(sim, SPIT.x + SPIT.arena + 4, SPIT.y); sim.tick();
  assert.equal(sim.battle, null, 'walked out: over'); assert.equal(sim.world.enemies.filter((e) => e.idle === 'vale_spit' || !e.idle).length, 0, 'nobody at the fire');
  stand(sim, SPIT.x + 1, SPIT.y + 3); sim.tick(); assert.equal(sim.battle, null, 'nothing to fight while it is empty');
  stand(sim, SPIT.x + SPIT.arena + 4, SPIT.y); sim.state.t = sim.state.camps.vale_spit.at + 1; sim.tick();
  assert.equal(sim.world.enemies.filter((e) => e.idle === 'vale_spit').length, 3, 'back after its respawn');
});

test('walked away from mid-fight, the band is back whole at its posts', () => {
  const sim = land();
  stand(sim, SPIT.x + SPIT.reach - 0.5, SPIT.y); sim.tick();
  living(sim)[0].hp = 1; sim.tick();
  stand(sim, SPIT.x + SPIT.arena + 4, SPIT.y); sim.tick(); sim.tick();
  assert.equal(sim.battle, null); assert.equal(sim.state.camps.vale_spit, undefined, 'not cleared');
  const idle = sim.world.enemies.filter((e) => e.idle === 'vale_spit'); assert.equal(idle.length, 3, 'all three back');
});

test('one fill in four has an elite; a nest sends one or two; both drawn from the seed and the clears', () => {
  let elites = 0; const counts = new Set();
  for (let n = 0; n < 400; n++) { if (bandOf(SEED, SPIT, n).elite) elites++; counts.add(bandOf(SEED, DITCH, n).kinds.length); }
  assert.ok(elites > 70 && elites < 130, `about a quarter: ${elites} of 400`);
  assert.deepEqual([...counts].sort(), [1, 2], 'the burrow: one or two');
  assert.deepEqual(bandOf(SEED, SPIT, 7), bandOf(SEED, SPIT, 7), 'the same fill, the same band');
  const n = [...Array(40).keys()].find((k) => bandOf(SEED, SPIT, k).elite), sim = land();
  sim.state.camps = { vale_spit: { at: 0, n } };
  stand(sim, SPIT.x + SPIT.reach - 0.5, SPIT.y); sim.tick();
  const el = living(sim).filter((e) => e.elite); assert.equal(el.length, 1, 'the elite in its fill'); assert.ok(el[0].maxHp > living(sim).find((e) => !e.elite).maxHp * 2, '×2.5 HP');
});

test('the ditch burrow: nobody to see, rats out of the hole in reach, level 1', () => {
  const sim = land();
  stand(sim, DITCH.x, DITCH.y - DITCH.arena - 3); sim.tick();
  assert.equal(sim.world.enemies.filter((e) => e.idle === "vale_ditch").length, 0, "a nest shows nothing");
  stand(sim, DITCH.x, DITCH.y - DITCH.reach + 0.5); sim.tick();
  const f = living(sim); assert.ok(f.length >= 1 && f.length <= 2, 'one or two'); assert.ok(f.every((e) => ['rat', 'gutter'].includes(e.kind) && e.lvl === 1));
  assert.ok(f.every((e) => e.spawn > 0), 'coming up out of it');
});

test('when each is full again is saved (v37), and a bad entry is dropped', () => {
  const sim = land(); sim.state.camps = { vale_spit: { at: 1234.5, n: 3 } };
  const snap = JSON.parse(JSON.stringify(sim.snapshot())); assert.deepEqual(snap.camps, { vale_spit: { at: 1234.5, n: 3 } });
  const b = land(); b.restore(snap); assert.deepEqual(b.state.camps, { vale_spit: { at: 1234.5, n: 3 } });
  assert.deepEqual(campsFrom({ nowhere: { at: 1, n: 1 }, vale_ditch: { at: 'x', n: 1 }, vale_spit: { at: 5, n: -1 } }), {});
  const old = land(); const s2 = JSON.parse(JSON.stringify(old.snapshot())); delete s2.camps; old.restore(s2); assert.deepEqual(old.state.camps, {}, 'absent: every spawn point full');
});

test("Col's errand counts a clear of the Spit; Jory's the burrow; the compass leads there", () => {
  const sim = land(), ev = []; sim.bus.on('questChanged', (d) => ev.push(d));
  sim.state.party[0].level = 3;
  for (const id of ['vale_bramble', 'vale_the_ditch']) sim.state.quests[id] = { st: QS.ACTIVE, step: 0, n: [0] };
  sim.state.tracked = 'vale_bramble';
  const rows = sim.destinations ? sim.destinations() : null;
  if (rows) { const r = rows.find((q) => q.id === 'quest'); assert.ok(r && r.tx !== undefined, 'the compass has a way'); assert.ok(rows.some((q) => q.id === 'camp:vale_spit'), 'the Spit on the compass'); }
  stand(sim, SPIT.x + SPIT.reach - 0.5, SPIT.y); sim.tick();
  for (let i = 0; i < 20 * 60 && sim.state.quests.vale_bramble.st !== QS.READY; i++) { for (const e of living(sim)) e.hp = Math.min(e.hp, 1); for (const m of sim.state.party) m.hp = 9999; sim.tick(); }
  assert.equal(sim.state.quests.vale_bramble.st, QS.READY, 'the Spit cleared: back to Col');
  assert.equal(sim.state.quests.vale_the_ditch.st, QS.ACTIVE, 'the burrow is its own');
});

test('the errands match their JSON and their Ink knots', () => {
  for (const id of ['vale_bramble', 'vale_the_ditch']) {
    const j = JSON.parse(readFileSync(new URL(`../content/quests/${id}.json`, import.meta.url), 'utf8')), q = QUESTS[id];
    assert.equal(j.giver, q.giver); assert.deepEqual(j.level, q.level); assert.deepEqual(j.rewards, q.rewards);
    assert.deepEqual(j.steps.map((s) => s.objectives.map(({ label: _l, ...o }) => o)), q.steps.map((s) => s.objectives));
    for (const o of q.steps[0].objectives) assert.ok(CAMP_BY[o.camp], `${id}: ${o.camp} is a spawn point`);
    const ink = readFileSync(new URL(`../content/dialogue/${j.dialogue.file}.ink`, import.meta.url), 'utf8');
    for (const k of [j.dialogue.offer, j.dialogue.turnin]) assert.ok(ink.includes(`== ${k} ==`), `${id}: knot ${k}`);
    assert.ok(ink.includes(`# quest: accept ${id}`) && ink.includes(`# quest: turnin ${id}`));
  }
});
