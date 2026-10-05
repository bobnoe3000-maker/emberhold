// Act II, The Drowned Abbey (M8 slices 7–8; world doc v1.29 §3.2, §5, §6; the owner, 2026-10-05: "proceed as
// recommended": Act II with Wren). Six chapters from Ilse in Thornwick down to Saltmere and back; Saltmere's people;
// Wren, found in the Toadking's Boat Hall, and her chain; the Kindler, met once at the Canal Locks and gone. Two new
// objectives (a word with someone, full cages broken) and a chest objective that wants a floor; the compass across
// lands. The golden path walks chapter 1 on the compass alone: Thornwick → the canal road → Saltmere → Dace → the
// Toadking's Mound → Wren → back to Dace.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createSim } from '../src/sim/core.js';
import { QUESTS, QS, questXp } from '../src/sim/quests.js';
import { NPCS } from '../src/sim/npcs.js';
import { FOUND } from '../src/sim/heroes.js';
import { HEIRLOOMS } from '../src/sim/items.js';
import { autoAllocate } from '../src/sim/attributes.js';
import { storyStatus } from '../src/ui/storystatus.js';
import { hire } from './fixtures/hire.mjs';

const SEED = 20260807;
const ACT1 = ['ch1_smoke_over_the_vale', 'ch1_the_diggers', 'ch1_ember_in_the_fist'];
const snap = (sim) => JSON.parse(JSON.stringify(sim.snapshot()));
const goTo = (sim, scene, site = 'barrows', depth = 0, region) => sim.restore({ ...snap(sim), scene, site, depth, floors: [], ...(region ? { region } : {}) });
const events = (sim, names) => { const out = []; for (const n of names) sim.bus.on(n, (e) => out.push({ n, ...e })); return out; };
const npc = (sim, id) => (sim.world.npcs || []).find((n) => n.id === id);
const effect = (sim, tag, ...args) => { sim.commands.push({ type: 'dialogueEffect', tag, args }); sim.tick(); };
function talk(sim, id) {
  sim.commands.push({ type: 'endTalk' }); sim.tick();
  const n = npc(sim, id), p = sim.state.player;
  if (n) { p.x = p.px = n.x + 1; p.y = p.py = n.y; }
  sim.commands.push({ type: 'talk', npc: id }); sim.tick();
}
/** a company that has done Act I, at a level, in a scene */
function after1(level = 9, scene = 'town', region = 'vale') {
  const sim = createSim(SEED, undefined, { scene, region }); sim.tick();
  for (const id of ACT1) sim.state.quests[id] = { st: QS.DONE, step: 0, n: [] };
  const h = sim.state.party[0]; h.level = level; h.xp = 0; autoAllocate(h);
  return sim;
}
const st = (sim, id) => sim.quests.status(id);

test('Saltmere\'s people stand in Saltmere; Wren waits in the Boat Hall; the Kindler by the Locks\' way in, once', () => {
  const sim = after1(9, 'town', 'fens');
  assert.deepEqual(sim.world.npcs.map((n) => n.id).sort(), ['dace_pike', 'mother_agnes', 'pim_rushlight', 'sister_orla']);
  goTo(sim, 'dungeon', 'toadking_mound', 0); assert.equal(npc(sim, 'wren'), undefined, 'not on the Mound\'s first floor');
  goTo(sim, 'dungeon', 'toadking_mound', 1);
  const w = npc(sim, 'wren'), L = sim.world.level; assert.ok(w, 'in the Boat Hall');
  assert.equal(L.cells.get(Math.floor(w.x) + ',' + Math.floor(w.y)).room, L.descentRoom.id);
  assert.equal(NPCS.wren.found.boss, FOUND.wren.freedBy);
  goTo(sim, 'dungeon', 'canal_locks', 1); assert.equal(npc(sim, 'kindler'), undefined, 'only the first floor');
  goTo(sim, 'dungeon', 'canal_locks', 0);
  const k = npc(sim, 'kindler'), E = sim.world.level.entrance; assert.ok(k && k.visitor, 'by the way in');
  assert.equal(sim.world.level.cells.get(Math.floor(k.x) + ',' + Math.floor(k.y)).room, E.id);
  talk(sim, 'kindler'); effect(sim, 'flag', 'set', 'met_kindler');
  sim.tick(); assert.ok(npc(sim, 'kindler'), 'he stays while he\'s talking');
  sim.commands.push({ type: 'endTalk' }); sim.tick(); sim.tick();
  assert.equal(npc(sim, 'kindler'), undefined, 'said his piece, he\'s gone on the boat');
  goTo(sim, 'dungeon', 'canal_locks', 0); assert.equal(npc(sim, 'kindler'), undefined, 'and doesn\'t come back');
  sim.commands.push({ type: 'talk', npc: 'kindler' }); sim.tick(); effect(sim, 'companion', 'join');
  assert.ok(![...sim.state.party, ...sim.state.bench].some((m) => m.id === 'kindler'), 'a visitor never joins');
});

test('Fog on the Canal: Ilse gives it at 8 after Act I; a word with Dace counts (and the Ink reads the step before it does)', () => {
  const sim = after1(7);
  assert.equal(st(sim, 'ch2_fog_on_the_canal'), QS.LOCKED, 'level 7');
  sim.state.party[0].level = 8;
  assert.equal(st(sim, 'ch2_fog_on_the_canal'), QS.AVAILABLE);
  const ev = events(sim, ['dialogue', 'questChanged']);
  talk(sim, 'sister_ilse'); assert.equal(ev.at(-1).vars.q_ch2_fog_on_the_canal, QS.AVAILABLE);
  effect(sim, 'quest', 'accept', 'ch2_fog_on_the_canal'); assert.equal(st(sim, 'ch2_fog_on_the_canal'), QS.ACTIVE);
  talk(sim, 'maudry_fenn'); assert.equal(sim.state.quests.ch2_fog_on_the_canal.step, 0, 'somebody else: no');
  goTo(sim, 'town', 'barrows', 0, 'fens');
  talk(sim, 'dace_pike');
  const d = ev.filter((e) => e.n === 'dialogue').at(-1);
  assert.equal(d.npc, 'dace_pike'); assert.equal(d.vars.q_ch2_fog_on_the_canal, QS.ACTIVE); assert.equal(d.vars.s_ch2_fog_on_the_canal, 0, 'the Ink sees the meeting still to have');
  assert.equal(sim.state.quests.ch2_fog_on_the_canal.step, 1, 'then it counts: on to the Toadking');
  talk(sim, 'dace_pike'); assert.equal(sim.state.quests.ch2_fog_on_the_canal.step, 1, 'once');
});

test('Wren: joins once the Toadking has fallen, as a rogue named Wren; a hireling who had her name takes another; her word counts', () => {
  const sim = after1(10);
  hire(sim, [1]); const hid = sim.state.party[1].id; sim.state.party[1].name = 'Wren';   // (the tavern's rolls had a Wren once)
  sim.state.quests.ch2_fog_on_the_canal = { st: QS.ACTIVE, step: 1, n: [0] };
  goTo(sim, 'dungeon', 'toadking_mound', 1);
  const ev = events(sim, ['dialogue', 'companionJoined']);
  talk(sim, 'wren'); assert.equal(ev.at(-1).vars.boss_toadking, 0); effect(sim, 'companion', 'join');
  assert.ok(![...sim.state.party, ...sim.state.bench].some((m) => m.id === 'wren'), 'the Toadking still holds her');
  sim.state.bosses.toadking = 1; sim.quests.settleAll();
  assert.equal(sim.state.quests.ch2_fog_on_the_canal.step, 2, 'the boss who already fell counts');
  goTo(sim, 'dungeon', 'toadking_mound', 1); talk(sim, 'wren');
  assert.equal(ev.filter((e) => e.n === 'dialogue').at(-1).vars.s_ch2_fog_on_the_canal, 2, 'the Ink reads the berth-book beat');
  assert.equal(st(sim, 'ch2_fog_on_the_canal'), QS.READY, 'her word counts');
  effect(sim, 'companion', 'join');
  const w = sim.state.party.find((m) => m.id === 'wren');
  assert.ok(w); assert.deepEqual([w.name, w.cls, w.actor, w.rank], ['Wren', 'rogue', 'hero_wren', 'found']);
  const hired = sim.state.party.find((m) => m.id === hid); assert.ok(hired.name && hired.name !== 'Wren', 'no two of a company share a name');
  assert.ok(w.perks.length > 0);
  // her chain: hers to give, only while she's with you
  assert.equal(st(sim, 'wren_the_marker'), QS.AVAILABLE);
  const lone = after1(10); assert.equal(lone.quests.status('wren_the_marker'), QS.LOCKED);
});

test('freed before the chapter asked, Wren\'s word is already had; the Kindler heard before the Locks counts too', () => {
  const sim = after1(10);
  sim.state.bosses.toadking = 1; goTo(sim, 'dungeon', 'toadking_mound', 1); talk(sim, 'wren'); effect(sim, 'companion', 'join');
  sim.state.quests.ch2_fog_on_the_canal = { st: QS.ACTIVE, step: 0, n: [0] };
  goTo(sim, 'town', 'barrows', 0, 'fens'); talk(sim, 'dace_pike');
  assert.equal(st(sim, 'ch2_fog_on_the_canal'), QS.READY, 'Dace, then the Toadking (down), then Wren (with you): all had');
  effect(sim, 'quest', 'turnin', 'ch2_fog_on_the_canal'); assert.equal(st(sim, 'ch2_fog_on_the_canal'), QS.DONE);
  goTo(sim, 'dungeon', 'canal_locks', 0); talk(sim, 'kindler'); effect(sim, 'flag', 'set', 'met_kindler'); sim.commands.push({ type: 'endTalk' }); sim.tick();
  goTo(sim, 'town', 'barrows', 0, 'fens'); talk(sim, 'dace_pike');
  assert.equal(st(sim, 'ch2_the_locks'), QS.AVAILABLE); effect(sim, 'quest', 'accept', 'ch2_the_locks');
  assert.equal(sim.state.quests.ch2_the_locks.step, 1, 'he won\'t be back to be heard: on to the Sluice');
});

test('the new objectives: full cages broken in the Sickpools; chests on the Abbey\'s third floor, not its first', () => {
  const sim = after1(12);
  sim.state.quests.ch2_the_sickpools = { st: QS.ACTIVE, step: 0, n: [0] };
  sim.state.quests.ch2_the_rolls = { st: QS.ACTIVE, step: 1, n: [0] };
  goTo(sim, 'dungeon', 'canal_locks', 0); sim.bus.emit('cageBroken', { tx: 0, ty: 0, x: 0, y: 0 });
  assert.deepEqual(sim.state.quests.ch2_the_sickpools.n, [0], 'not in the Locks');
  goTo(sim, 'dungeon', 'sickpools', 0); for (let i = 0; i < 3; i++) sim.bus.emit('cageBroken', { tx: 0, ty: 0, x: 0, y: 0 });
  assert.equal(st(sim, 'ch2_the_sickpools'), QS.READY);
  goTo(sim, 'dungeon', 'drowned_abbey', 0); sim.bus.emit('looted', { kind: 'chest' });
  assert.deepEqual(sim.state.quests.ch2_the_rolls.n, [0], 'the first floor\'s chests aren\'t the rolls');
  goTo(sim, 'dungeon', 'drowned_abbey', 2); sim.bus.emit('looted', { kind: 'chest' }); sim.bus.emit('looted', { kind: 'chest' });
  assert.equal(st(sim, 'ch2_the_rolls'), QS.READY);
});

test('the chapters run in order, each from its giver to its taker; the last goes back to Ilse, and Act II is over', () => {
  const sim = after1(14), ev = events(sim, ['questReward']);
  const chain = [['ch2_fog_on_the_canal', 'sister_ilse', 'dace_pike'], ['ch2_the_locks', 'dace_pike', 'dace_pike'], ['ch2_the_sickpools', 'pim_rushlight', 'pim_rushlight'],
    ['ch2_the_bells', 'sister_orla', 'sister_orla'], ['ch2_the_rolls', 'sister_orla', 'mother_agnes'], ['ch2_the_last_office', 'mother_agnes', 'sister_ilse']];
  for (const [id, giver, taker] of chain) {
    assert.equal(QUESTS[id].giver, giver); assert.equal(QUESTS[id].turnin || giver, taker);
    const region = NPCS[giver].region; goTo(sim, 'town', 'barrows', 0, region);
    assert.equal(st(sim, id), QS.AVAILABLE, id);
    talk(sim, giver); effect(sim, 'quest', 'accept', id);
    sim.state.quests[id].st = QS.READY;                                            // (each objective is walked in the tests above)
    goTo(sim, 'town', 'barrows', 0, NPCS[taker].region);
    if (taker !== giver) { talk(sim, giver); effect(sim, 'quest', 'turnin', id); assert.equal(st(sim, id), QS.READY, `${id}: not ${giver}'s to take in`); }
    const lv = sim.state.party[0].level;
    talk(sim, taker); effect(sim, 'quest', 'turnin', id); assert.equal(st(sim, id), QS.DONE, id);
    assert.equal(ev.at(-1).xp, questXp(QUESTS[id].rewards, lv), `${id}: a share of a level, at the hero's (or the level it's written for)`);
  }
  assert.deepEqual(storyStatus(sim.state, (id) => sim.quests.status(id)), { kind: 'end', region: 'fens' });
  assert.deepEqual(ev.map((e) => e.gold), [220, 260, 280, 300, 320, 400]);
});

test('Settled pays The Receipt, once', () => {
  assert.ok(HEIRLOOMS.the_receipt); assert.equal(QUESTS.wren_settled.rewards.item, 'the_receipt');
  const sim = after1(12);
  sim.state.bosses.toadking = 1; goTo(sim, 'dungeon', 'toadking_mound', 1); talk(sim, 'wren'); effect(sim, 'companion', 'join');
  for (const id of ['wren_the_marker', 'wren_night_boats']) sim.state.quests[id] = { st: QS.DONE, step: 0, n: [] };
  sim.state.quests.wren_settled = { st: QS.READY, step: 0, n: [5] };
  const ev = events(sim, ['questReward', 'loot']);
  talk(sim, 'wren'); effect(sim, 'quest', 'turnin', 'wren_settled'); effect(sim, 'quest', 'turnin', 'wren_settled');
  assert.deepEqual(ev.filter((e) => e.n === 'questReward').map((e) => e.item), ['the_receipt']);
  const got = ev.filter((e) => e.n === 'loot' && e.heirloom === 'the_receipt'); assert.equal(got.length, 1);
  assert.deepEqual([got[0].item.name, got[0].item.base], ['The Receipt', 'ring']);
});

test('the golden path: chapter 1 on the compass alone, Thornwick to Saltmere to the Boat Hall and back to Dace', () => {
  const sim = after1(14), ID = 'ch2_fog_on_the_canal';
  hire(sim, [0, 2]); for (const m of sim.state.party) { m.level = 14; m.attrs = null; autoAllocate(m); }
  sim.state.bosses.toadking = 1;                                                    // (the fight is tested in fens-bosses: this walks the story)
  const ev = events(sim, ['dialogue', 'questReward', 'companionJoined']);
  talk(sim, 'sister_ilse'); effect(sim, 'quest', 'accept', ID); sim.commands.push({ type: 'endTalk' }); sim.tick();
  const seen = new Set(); let went = 0, last = '';
  for (let t = 0; t < 20 * 60 * 30 && st(sim, ID) !== QS.DONE; t++) {
    const p = sim.state.player, d = ev.filter((e) => e.n === 'dialogue').at(-1);
    if (d && !d.done) {
      d.done = true;
      if (d.npc === 'wren') effect(sim, 'companion', 'join');
      if (d.npc === 'dace_pike' && st(sim, ID) === QS.READY) effect(sim, 'quest', 'turnin', ID);
      sim.commands.push({ type: 'endTalk' }); sim.tick();
    }
    if (!p.path && t % 10 === 0) {
      const row = sim.destinations().find((r) => r.id === 'quest');
      if (row) { sim.commands.push({ type: 'goto', tx: row.tx, ty: row.ty, near: row.near, then: row.then || null, label: 'quest', room: row.room }); went++; last = `${sim.world.kind}:${sim.world.region}:${row.label}`; }
    }
    seen.add(`${sim.world.kind}:${sim.world.kind === 'dungeon' ? sim.world.site : sim.world.region}`);
    if (sim.battle && t % 100 === 0) for (const m of sim.state.party) m.hp = Math.max(m.hp, 1);
    sim.tick();
  }
  assert.equal(st(sim, ID), QS.DONE, `not done (${JSON.stringify(sim.state.quests[ID])}, last row ${last}, scene ${sim.world.kind}:${sim.world.region})`);
  for (const s of ['town:vale', 'overland:vale', 'overland:fens', 'town:fens', 'dungeon:toadking_mound']) assert.ok(seen.has(s), `never in ${s}: ${[...seen]}`);
  assert.ok(went > 5, 'the compass led the way');
  assert.equal(ev.filter((e) => e.n === 'companionJoined').length, 1, 'Wren came along');
  assert.deepEqual(ev.filter((e) => e.n === 'questReward').map((e) => e.gold), [220]);
});
