// Quests (M4): Maudry's errand, The Long Way Round. Accepting and turning in only through her
// conversation; objectives counted from the sim's own events; rewards paid once; the tracked
// quest's compass row; the save; the sim's table against content/quests and the Ink. The golden
// path walks it end to end on the compass alone: town → the Old Barrows → 4 waves and the first
// chest → back to Maudry.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { createSim } from '../src/sim/core.js';
import { QUESTS, QS } from '../src/sim/quests.js';
import { autoAllocate } from '../src/sim/attributes.js';

const ID = 'vale_long_way_round';
const town = (seed = 20260807) => createSim(seed, undefined, { scene: 'town' });
const events = (sim, names) => { const ev = []; for (const e of names) sim.bus.on(e, (d) => ev.push({ e, ...d })); return ev; };
const talkNow = (sim) => { const n = sim.world.npcs[0], p = sim.state.player; p.x = p.px = n.x + 1; p.y = p.py = n.y - 1; sim.commands.push({ type: 'talk', npc: n.id }); sim.tick(); };
const say = (sim, verb) => { sim.commands.push({ type: 'dialogueEffect', tag: 'quest', args: [verb, ID] }); sim.tick(); };
const status = (sim) => sim.quests.status(ID);

test('accepted only in conversation with Maudry, once, and only at the right level', () => {
  const sim = town();
  say(sim, 'accept'); assert.equal(status(sim), QS.AVAILABLE, 'no conversation open');
  talkNow(sim);
  sim.commands.push({ type: 'dialogueEffect', tag: 'quest', args: ['accept', 'no_such_quest'] }); sim.tick();
  say(sim, 'turnin'); assert.equal(status(sim), QS.AVAILABLE, 'nothing to turn in yet');
  say(sim, 'accept'); assert.equal(status(sim), QS.ACTIVE); assert.equal(sim.state.tracked, ID);
  say(sim, 'accept'); assert.deepEqual(sim.state.quests[ID], { st: QS.ACTIVE, step: 0, n: [0, 0] });
  say(sim, 'turnin'); assert.equal(status(sim), QS.ACTIVE, 'not done yet');
  const old = town(); old.state.party[0].level = 9; assert.equal(old.quests.status(ID), QS.LOCKED);
  talkNow(old); assert.equal(old.state.quests[ID], undefined);
  const ev = events(old, ['dialogue']); old.commands.push({ type: 'endTalk' }); old.tick(); talkNow(old);
  assert.equal(ev[0].vars['q_' + ID], QS.LOCKED, 'Ink reads the status');
});

test('Ink reads q_<id>; track and abandon are checked', () => {
  const sim = town(), ev = events(sim, ['dialogue']);
  talkNow(sim); assert.equal(ev[0].vars['q_' + ID], QS.AVAILABLE);
  say(sim, 'accept');
  sim.commands.push({ type: 'track', id: null }); sim.tick(); assert.equal(sim.state.tracked, null);
  sim.commands.push({ type: 'track', id: 'nope' }); sim.tick(); assert.equal(sim.state.tracked, null);
  sim.commands.push({ type: 'track', id: ID }); sim.tick(); assert.equal(sim.state.tracked, ID);
  sim.commands.push({ type: 'questAbandon', id: ID }); sim.tick();
  assert.equal(status(sim), QS.AVAILABLE); assert.equal(sim.state.tracked, null);
});

test('quests survive a save; unknown or broken entries are dropped; older saves have none', () => {
  const sim = town(); talkNow(sim); say(sim, 'accept');
  sim.state.quests[ID].n = [3, 1];
  const data = JSON.parse(JSON.stringify(sim.snapshot()));
  assert.deepEqual(data.quests, { [ID]: [QS.ACTIVE, 0, 3, 1] }); assert.equal(data.tracked, ID);
  const b = town(); b.restore(data); assert.deepEqual(b.state.quests[ID], { st: QS.ACTIVE, step: 0, n: [3, 1] }); assert.equal(b.state.tracked, ID);
  b.restore({ ...data, quests: { [ID]: [QS.ACTIVE, 0, 99, -4], bogus: [1, 0, 0] }, tracked: 'bogus' });
  assert.deepEqual(b.state.quests, { [ID]: { st: QS.ACTIVE, step: 0, n: [4, 0] } }); assert.equal(b.state.tracked, null);
  b.restore({ ...data, quests: { [ID]: [7, 0] } }); assert.deepEqual(b.state.quests, {});
  const old = { ...data }; delete old.quests; delete old.tracked; b.restore(old); assert.deepEqual(b.state.quests, {});
});

test('the golden path: accept, the Old Barrows on the compass, 4 waves and a chest, back to Maudry, paid once', () => {
  const sim = town(), ev = events(sim, ['questChanged', 'questReward', 'dialogue']);
  const h = sim.state.party[0]; h.level = 6; h.xp = 0; autoAllocate(h);          // strong enough to walk the barrows alone
  talkNow(sim); say(sim, 'accept'); sim.commands.push({ type: 'endTalk' }); sim.tick();
  const gold0 = sim.state.counters.gold, xp0 = h.xp, lv0 = h.level;
  let went = 0, last = '';
  for (let t = 0; t < 20 * 60 * 25 && status(sim) !== QS.DONE; t++) {
    const p = sim.state.player;
    if (!p.path && t % 10 === 0) {                                               // (a room is endless waves: walk on when the quest says so, as a player would)
      const row = sim.destinations().find((r) => r.id === 'quest');
      if (row) { sim.commands.push({ type: 'goto', tx: row.tx, ty: row.ty, near: row.near, then: row.then || null, label: 'quest', room: row.room }); went++; last = `${sim.world.kind}:${row.icon}`; }
    }
    if (ev.some((e) => e.e === 'dialogue') && status(sim) === QS.READY) say(sim, 'turnin');
    if (sim.battle && t % 200 === 0) { for (const m of sim.state.party) m.hp = Math.max(m.hp, 1); }   // (never a wipe: this tests the quest, not the fight)
    sim.tick();
  }
  assert.equal(status(sim), QS.DONE, `not done (${JSON.stringify(sim.state.quests[ID])}, last row ${last}, scene ${sim.world.kind})`);
  assert.ok(went > 3, 'the compass led the way');
  assert.deepEqual(ev.filter((e) => e.e === 'questReward').map((e) => [e.xp, e.gold]), [[150, 40]]);
  assert.ok(sim.state.counters.gold >= gold0 + 40);
  assert.ok(h.level > lv0 || h.xp >= xp0 + 150);
  assert.equal(sim.state.tracked, null);
  say(sim, 'turnin'); assert.equal(ev.filter((e) => e.e === 'questReward').length, 1, 'paid once');
});

// ── the sim's table against the content and the Ink ─────────────────────────
const defs = readdirSync('content/quests').filter((f) => f.endsWith('.json')).map((f) => JSON.parse(readFileSync(`content/quests/${f}`, 'utf8')));
test('content/quests matches the sim table; the giver says the right tags', () => {
  assert.deepEqual(defs.map((d) => d.id).sort(), Object.keys(QUESTS).sort());
  for (const d of defs) {
    const q = QUESTS[d.id];
    assert.deepEqual({ kind: d.kind, giver: d.giver, region: d.region, level: d.level, rewards: d.rewards }, { kind: q.kind, giver: q.giver, region: q.region, level: q.level, rewards: q.rewards }, d.id);
    assert.deepEqual(d.steps.map((s) => ({ id: s.id, objectives: s.objectives.map(({ label, ...o }) => o) })), q.steps, d.id);
    const ink = readFileSync(`content/dialogue/${d.dialogue.file}.ink`, 'utf8');
    for (const verb of ['accept', 'turnin']) assert.match(ink, new RegExp(`# quest: ${verb} ${d.id}\\b`), `${d.id}: no ${verb} tag`);
    for (const k of [d.dialogue.offer, d.dialogue.turnin]) assert.match(ink, new RegExp(`== ${k} ==`), `${d.id}: no knot ${k}`);
    assert.match(ink, new RegExp(`VAR q_${d.id} =`));
  }
});
