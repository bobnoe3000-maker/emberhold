// Brannoc, the first found companion (M5, docs/m5-plan.md §5; world doc §5 v1.7): chained at the back of
// Wickham Keep's second-floor hall; once Captain Garrow has fallen, `# companion: join` in his own talk
// brings him to the party (the bench when it's full). He can be benched, never released; you talk to him
// from his card. His chain, Chains of the Redhand, is his to give and take in, and pays The Broken Chain.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createSim } from '../src/sim/core.js';
import { QS } from '../src/sim/quests.js';
import { statsFor, hireLevel } from '../src/sim/party.js';
import { isWalkable } from '../src/sim/world.js';
import { createStoryBook } from '../src/story/adapter.js';
import { NPCS } from '../src/sim/npcs.js';
import { FOUND } from '../src/sim/heroes.js';
import { hire } from './fixtures/hire.mjs';

const SEED = 20260807;
const snap = (sim) => JSON.parse(JSON.stringify(sim.snapshot()));
const goTo = (sim, scene, site = 'barrows', depth = 0) => sim.restore({ ...snap(sim), scene, site, depth, floors: [] });
const events = (sim, names) => { const out = []; for (const n of names) sim.bus.on(n, (e) => out.push({ n, ...e })); return out; };
const him = (sim) => (sim.world.npcs || []).find((n) => n.id === 'brannoc');
function talkInHall(sim) {
  const n = him(sim), p = sim.state.player;
  sim.commands.push({ type: 'endTalk' }); sim.tick();
  p.x = p.px = n.x + 1; p.y = p.py = n.y; sim.commands.push({ type: 'talk', npc: 'brannoc' }); sim.tick();
}
const effect = (sim, tag, ...args) => { sim.commands.push({ type: 'dialogueEffect', tag, args }); sim.tick(); };
const withUs = (sim) => [...sim.state.party, ...sim.state.bench].filter((m) => m.id === 'brannoc');

test('he waits at the back of the Keep\'s second-floor hall, and nowhere else', () => {
  const sim = createSim(SEED, undefined, { scene: 'town' }); sim.tick();
  assert.equal(him(sim), undefined, 'not in Thornwick');
  goTo(sim, 'dungeon', 'wickham_keep', 0); assert.equal(him(sim), undefined, 'not on the first floor');
  goTo(sim, 'dungeon', 'barrows', 1); assert.equal(him(sim), undefined, 'not in the Old Barrows');
  goTo(sim, 'dungeon', 'wickham_keep', 1);
  const n = him(sim), L = sim.world.level, c = L.cells.get(Math.floor(n.x) + ',' + Math.floor(n.y));
  assert.ok(n && c && c.room === L.descentRoom.id, 'in the hall');
  assert.ok(isWalkable(sim.world, n.x, n.y) && isWalkable(sim.world, n.x + 1, n.y), 'and you can walk up beside him');
  assert.equal(NPCS.brannoc.found.boss, FOUND.brannoc.freedBy, 'his captor, the same in both tables');
  const again = createSim(SEED, undefined, { scene: 'town' }); goTo(again, 'dungeon', 'wickham_keep', 1);
  assert.deepEqual([him(again).x, him(again).y], [n.x, n.y], 'the same spot every time');
});

test('he joins only once Garrow has fallen; then he leaves the hall with you, and never comes back to it', () => {
  const sim = createSim(SEED, undefined, { scene: 'town' }); sim.tick();
  const ev = events(sim, ['dialogue', 'companionJoined', 'talkEnded']);
  goTo(sim, 'dungeon', 'wickham_keep', 1);
  talkInHall(sim); assert.equal(ev.at(-1).n, 'dialogue'); assert.equal(ev.at(-1).knot, 'brannoc_hub'); assert.equal(ev.at(-1).vars.boss_redhand_captain, 0); assert.equal(ev.at(-1).vars.joined, 0);
  effect(sim, 'companion', 'join'); assert.equal(withUs(sim).length, 0, 'Garrow still has the key');
  sim.state.bosses.redhand_captain = 1; sim.state.party[0].level = 7;   // (he joins at half the hero's level, rounded up: world doc §5 v1.12)
  talkInHall(sim); assert.equal(ev.filter((e) => e.n === 'dialogue').at(-1).vars.boss_redhand_captain, 1);
  effect(sim, 'companion', 'join');
  const [m] = withUs(sim); assert.ok(m && sim.state.party.includes(m), 'into the party (it had room)');
  assert.deepEqual([m.name, m.cls, m.actor, m.level], ['Brannoc', 'fighter', 'hero_brannoc', 4]); assert.equal(hireLevel(7), 4);
  assert.equal(ev.filter((e) => e.n === 'companionJoined').length, 1);
  assert.ok(him(sim), 'he stands there while the talk is open');
  effect(sim, 'companion', 'join'); assert.equal(withUs(sim).length, 1, 'once');
  sim.commands.push({ type: 'endTalk' }); sim.tick(); sim.tick();
  assert.equal(him(sim), undefined, 'the talk over, he walks with you');
  goTo(sim, 'dungeon', 'wickham_keep', 1); assert.equal(him(sim), undefined, 'the hall is empty of him');
  // a stranger's tag from someone else's talk does nothing
  const other = createSim(SEED, undefined, { scene: 'town' }); other.tick(); other.state.bosses.redhand_captain = 1;
  const osric = other.world.npcs.find((q) => q.id === 'osric_hale'), p = other.state.player; p.x = p.px = osric.x + 1; p.y = p.py = osric.y - 1;
  other.commands.push({ type: 'talk', npc: 'osric_hale' }); other.tick(); effect(other, 'companion', 'join');
  assert.equal(withUs(other).length, 0, 'only in his own talk, where he stands');
});

test('while he waits, his captor fallen, the hall is quiet: you can walk up and talk; before, it\'s Garrow\'s fight', () => {
  const sim = createSim(SEED, undefined, { scene: 'town' }); sim.tick();
  goTo(sim, 'dungeon', 'wickham_keep', 1);
  const n = him(sim), p = sim.state.player; p.x = p.px = n.x + 1; p.y = p.py = n.y; for (let i = 0; i < 10; i++) sim.tick();
  assert.ok(sim.battle && sim.battle.boss === 'redhand_captain', 'Garrow holds the hall');
  sim.state.bosses.redhand_captain = 1; goTo(sim, 'dungeon', 'wickham_keep', 1);
  p.x = p.px = him(sim).x + 1; p.y = p.py = him(sim).y; for (let i = 0; i < 40; i++) sim.tick();
  assert.equal(sim.battle, null, 'quiet');
  talkInHall(sim); effect(sim, 'companion', 'join'); sim.commands.push({ type: 'endTalk' }); for (let i = 0; i < 40; i++) sim.tick();
  assert.equal(sim.battle, null, 'and stays quiet the rest of the visit, once he\'s walked out of it with you');
  goTo(sim, 'dungeon', 'wickham_keep', 1); p.x = p.px = n.x + 1; p.y = p.py = n.y; for (let i = 0; i < 40; i++) sim.tick();
  assert.ok(sim.battle, 'the next visit, with him gone, the hall fights like any other');
});

test('a full party puts him on the bench; he can be benched and swapped, never released; he round-trips a save', () => {
  const sim = createSim(SEED, undefined, { scene: 'town' }); sim.tick();
  hire(sim, [0, 1]);
  assert.equal(sim.state.party.length, 3);
  const ev = events(sim, ['benched', 'refused']);
  sim.state.bosses.redhand_captain = 1; goTo(sim, 'dungeon', 'wickham_keep', 1); talkInHall(sim); effect(sim, 'companion', 'join');
  assert.equal(sim.state.bench.at(-1).id, 'brannoc'); assert.ok(ev.some((e) => e.n === 'benched' && e.name === 'Brannoc'));
  goTo(sim, 'town');
  sim.commands.push({ type: 'release', id: 'brannoc' }); sim.tick();
  assert.equal(withUs(sim).length, 1, 'not released'); assert.match(ev.at(-1).reason, /Brannoc/);
  sim.commands.push({ type: 'swap', slot: 1, id: 'brannoc' }); sim.tick(); assert.equal(sim.state.party[1].id, 'brannoc');
  sim.commands.push({ type: 'dismiss', id: 'brannoc' }); sim.tick(); assert.equal(sim.state.bench.at(-1).id, 'brannoc', 'benched again');
  const back = createSim(SEED, undefined, { scene: 'town' }); back.restore(snap(sim));
  const b = back.state.bench.find((m) => m.id === 'brannoc'); assert.ok(b); assert.equal(b.actor, 'hero_brannoc');
  goTo(back, 'dungeon', 'wickham_keep', 1); assert.equal(him(back), undefined, 'a loaded game doesn\'t put him back in the hall');
});

test('from his card: talk to him wherever you are while he\'s in the party and up; not from the bench, not while you\'re Downed', () => {
  const sim = createSim(SEED, undefined, { scene: 'town' }); sim.tick();
  sim.state.bosses.redhand_captain = 1; goTo(sim, 'dungeon', 'wickham_keep', 1); talkInHall(sim); effect(sim, 'companion', 'join');
  sim.commands.push({ type: 'endTalk' }); sim.tick();
  const ev = events(sim, ['dialogue', 'talkEnded']);
  goTo(sim, 'overland');
  sim.commands.push({ type: 'talk', npc: 'brannoc' }); sim.tick();
  assert.equal(ev.at(-1).n, 'dialogue'); assert.equal(ev.at(-1).vars.joined, 1); assert.equal(ev.at(-1).vars.in_party, 1);
  for (let i = 0; i < 40; i++) { sim.commands.push({ type: 'move', x: 1, y: 0 }); sim.tick(); }
  assert.equal(ev.filter((e) => e.n === 'talkEnded').length, 0, 'he walks with you: walking on doesn\'t end it');
  sim.commands.push({ type: 'endTalk' }); sim.tick();
  const n = ev.length; sim.state.party[0].down = true; sim.commands.push({ type: 'talk', npc: 'brannoc' }); sim.tick(); sim.state.party[0].down = false;
  assert.equal(ev.length, n + 0, 'not while you\'re Downed');
  goTo(sim, 'town'); sim.commands.push({ type: 'dismiss', id: 'brannoc' }); sim.tick();
  sim.commands.push({ type: 'talk', npc: 'brannoc' }); sim.tick(); assert.equal(ev.length, n, 'not from the bench');
});

test('Chains of the Redhand: his to give and take in, in order, only while he\'s with you; The Broken Chain paid once', () => {
  const sim = createSim(SEED, undefined, { scene: 'town' }); sim.tick();
  const st = (id) => sim.quests.status(id), paid = events(sim, ['questReward', 'loot']);
  assert.equal(st('brannoc_old_debts'), QS.LOCKED, 'not before he joins');
  sim.state.bosses.redhand_captain = 1; goTo(sim, 'dungeon', 'wickham_keep', 1); talkInHall(sim); effect(sim, 'companion', 'join');
  assert.equal(st('brannoc_old_debts'), QS.AVAILABLE); assert.equal(st('brannoc_paymasters_box'), QS.LOCKED);
  sim.commands.push({ type: 'endTalk' }); sim.tick();
  const card = () => { sim.commands.push({ type: 'endTalk' }); sim.tick(); sim.commands.push({ type: 'talk', npc: 'brannoc' }); sim.tick(); };
  card(); effect(sim, 'quest', 'accept', 'brannoc_old_debts'); assert.equal(st('brannoc_old_debts'), QS.ACTIVE);
  // 3 sergeants in the Keep (elites), counted from the sim's own 'slain' events
  goTo(sim, 'dungeon', 'wickham_keep', 0);
  for (let i = 0; i < 3; i++) sim.bus.emit('slain', { elite: true });
  assert.equal(st('brannoc_old_debts'), QS.READY);
  card(); effect(sim, 'quest', 'turnin', 'brannoc_old_debts'); assert.equal(st('brannoc_old_debts'), QS.DONE);
  card(); effect(sim, 'quest', 'accept', 'brannoc_paymasters_box');
  goTo(sim, 'dungeon', 'tithe_mill', 0); for (let i = 0; i < 2; i++) sim.bus.emit('looted', { kind: 'chest' });
  card(); effect(sim, 'quest', 'turnin', 'brannoc_paymasters_box'); assert.equal(st('brannoc_paymasters_box'), QS.DONE);
  card(); effect(sim, 'quest', 'accept', 'brannoc_standing_down');
  // the Barrows' second-floor hall: a wave on the first floor, or in another room, doesn't count
  goTo(sim, 'dungeon', 'barrows', 0); sim.bus.emit('wave', { cleared: true, room: sim.world.level.descentRoom.id });
  goTo(sim, 'dungeon', 'barrows', 1); sim.bus.emit('wave', { cleared: true, room: sim.world.level.entrance.id });
  assert.deepEqual(sim.state.quests.brannoc_standing_down.n, [0]);
  for (let i = 0; i < 5; i++) sim.bus.emit('wave', { cleared: true, room: sim.world.level.descentRoom.id });
  assert.equal(st('brannoc_standing_down'), QS.READY);
  assert.deepEqual(sim.destinations().filter((r) => r.id === 'quest'), [], 'no compass row: hand it in from his card');
  const bag = sim.state.bag.length;
  card(); effect(sim, 'quest', 'turnin', 'brannoc_standing_down'); effect(sim, 'quest', 'turnin', 'brannoc_standing_down');
  assert.equal(st('brannoc_standing_down'), QS.DONE);
  const chain = sim.state.bag.filter((it) => it.name === 'The Broken Chain');
  assert.equal(chain.length, 1, 'the heirloom, once'); assert.equal(chain[0].r, 'heirloom'); assert.equal(sim.state.bag.length, bag + 1);
  assert.deepEqual(paid.filter((e) => e.n === 'questReward').map((e) => e.id), ['brannoc_old_debts', 'brannoc_paymasters_box', 'brannoc_standing_down']);
  assert.equal(paid.find((e) => e.n === 'questReward' && e.id === 'brannoc_standing_down').item, 'broken_chain');
});

test('his quests can\'t be taken from anyone else, or from him while he\'s on the bench', () => {
  const sim = createSim(SEED, undefined, { scene: 'town' }); sim.tick();
  hire(sim, [0, 1]);
  sim.state.bosses.redhand_captain = 1; goTo(sim, 'dungeon', 'wickham_keep', 1); talkInHall(sim); effect(sim, 'companion', 'join');
  sim.commands.push({ type: 'endTalk' }); sim.tick(); goTo(sim, 'town');
  assert.equal(sim.state.bench.at(-1).id, 'brannoc');
  const osric = sim.world.npcs.find((q) => q.id === 'osric_hale'), p = sim.state.player; p.x = p.px = osric.x + 1; p.y = p.py = osric.y - 1;
  sim.commands.push({ type: 'talk', npc: 'osric_hale' }); sim.tick(); effect(sim, 'quest', 'accept', 'brannoc_old_debts');
  assert.equal(sim.quests.status('brannoc_old_debts'), QS.AVAILABLE, 'Osric can\'t give it');
  sim.commands.push({ type: 'talk', npc: 'brannoc' }); sim.tick(); effect(sim, 'quest', 'accept', 'brannoc_old_debts');
  assert.equal(sim.quests.status('brannoc_old_debts'), QS.AVAILABLE, 'benched: no talk, no quest');
  for (const m of sim.state.party) m.hp = statsFor(m).maxHp;
});

// the words (story adapter): chained before Garrow falls; after, he asks to come; with you, his chain
const book = () => createStoryBook(async (f) => JSON.parse(readFileSync(`content/dialogue/${f}.json`, 'utf8')));
async function play(knot, vars, picks) {
  const sent = [], c = await book().open('brannoc', knot, vars, (cmd) => sent.push(cmd));
  let b = c.first; const lines = [...b.lines]; const settle = () => { while (b.waiting) { b = c.resume(vars); lines.push(...b.lines); } }; settle();
  for (const want of picks) { const ch = b.choices.find((x) => x.text.startsWith(want)); assert.ok(ch, `no "${want}" in ${b.choices.map((x) => x.text)}`); b = c.choose(ch.index); lines.push(...b.lines); settle(); }
  return { sent: sent.map((x) => `${x.tag} ${x.args.join(' ')}`), lines, choices: b.choices.map((x) => x.text) };
}
const base = { hero_name: 'Tam', hero_level: 6, party_size: 2, fallen_name: '', flag_met_brannoc: 0, joined: 0, in_party: 0, boss_redhand_captain: 0 };
test('the Ink: chained and short while Garrow lives; asks to come once he\'s fallen; with you, his chain in order', async () => {
  const early = await play('brannoc_hub', base, []);
  assert.deepEqual(early.sent, ['flag set met_brannoc']); assert.deepEqual(early.choices, []); assert.match(early.lines.join(' '), /Garrow has the key/);
  const ask = await play('brannoc_hub', { ...base, boss_redhand_captain: 1 }, ['Come with us.']);
  assert.deepEqual(ask.sent, ['flag set met_brannoc', 'companion join']);
  assert.deepEqual((await play('brannoc_hub', { ...base, boss_redhand_captain: 1, flag_met_brannoc: 1 }, ['Not yet.'])).sent, []);
  const w = { ...base, flag_met_brannoc: 1, joined: 1, in_party: 1, boss_redhand_captain: 1 };
  assert.deepEqual((await play('brannoc_hub', { ...w, q_brannoc_old_debts: 0 }, ['Is there anything you need to settle?', "We'll settle it."])).sent, ['quest accept brannoc_old_debts']);
  assert.deepEqual((await play('brannoc_hub', { ...w, q_brannoc_old_debts: 2 }, ["That's Garrow's three sergeants down."])).sent, ['quest turnin brannoc_old_debts']);
  assert.deepEqual((await play('brannoc_hub', { ...w, q_brannoc_old_debts: 3, q_brannoc_paymasters_box: 0 }, ["Where did the robes' coin go?", "We'll find the boxes."])).sent, ['quest accept brannoc_paymasters_box']);
  assert.deepEqual((await play('brannoc_hub', { ...w, q_brannoc_paymasters_box: 2 }, ["We found the paymaster's boxes at the mill."])).sent, ['quest turnin brannoc_paymasters_box']);
  assert.deepEqual((await play('brannoc_hub', { ...w, q_brannoc_paymasters_box: 3, q_brannoc_standing_down: 0 }, ['What do you want now?', "We'll stand with them."])).sent, ['quest accept brannoc_standing_down']);
  assert.deepEqual((await play('brannoc_hub', { ...w, q_brannoc_standing_down: 2 }, ['We stood with the legion. Five waves.'])).sent, ['quest turnin brannoc_standing_down']);
  const topics = (await play('brannoc_hub', { ...w, q_brannoc_old_debts: -1 }, [])).choices;
  assert.ok(!topics.some((t) => /settle/.test(t)), 'nothing offered that the sim would refuse');
});
