// Act III, Quota: its first two chapters, as the Reach's first slice is built (GDD v1.124; world doc v1.53 §3.3, §6;
// docs/reach-plan.md "The story: Act III"). Ashgate's people; Ilse sends the company north by the Wickham road to
// Dagny Coalbrook, who takes it in from a word; Dagny's Short Shift, done when the Foreman falls in the Cold Seam's
// tally cave; Tamsin Coalbrook, found at his anvil there, who joins once he's down; and the Ink that tells it.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createSim as createSim0 } from '../src/sim/core.js';
import { openAllGates } from './gates.mjs';
const createSim = (...a) => openAllGates(createSim0(...a));   // (the floors' gates open: this file tests the story, test/gate.test.mjs the gates)
import { QUESTS, QS, questXp } from '../src/sim/quests.js';
import { NPCS } from '../src/sim/npcs.js';
import { FOUND } from '../src/sim/heroes.js';
import { FOUND_PERKS, PERKS } from '../src/sim/companions.js';
import { SHOPKEEP } from '../src/sim/smith.js';
import { autoAllocate } from '../src/sim/attributes.js';
import { createStoryBook } from '../src/story/adapter.js';

const SEED = 20260807;
const ACTS = ['ch1_smoke_over_the_vale', 'ch1_the_diggers', 'ch1_ember_in_the_fist', 'ch1_the_standard',
  'ch2_fog_on_the_canal', 'ch2_the_locks', 'ch2_the_sickpools', 'ch2_the_bells', 'ch2_the_rolls', 'ch2_the_last_office'];
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
/** a company that has done Acts I and II, at a level, in a scene */
function after2(level = 18, scene = 'town', region = 'vale') {
  const sim = createSim(SEED, undefined, { scene, region }); sim.tick();
  for (const id of ACTS) sim.state.quests[id] = { st: QS.DONE, step: 0, n: [] };
  const h = sim.state.party[0]; h.level = level; h.xp = 0; autoAllocate(h);
  return sim;
}
const st = (sim, id) => sim.quests.status(id);
const ASHGATE = ['bel_ruddle', 'dagny_coalbrook', 'gunnar_slagg', 'haldor', 'hob', 'mother_coke', 'old_brannagh', 'widow_pellam', 'wynn_sallow'];

test('Ashgate\'s people stand in Ashgate; Tamsin waits at the anvil in the Cold Seam\'s tally cave, and nowhere else', () => {
  const sim = after2(19, 'town', 'reach');
  assert.deepEqual(sim.world.npcs.map((n) => n.id).sort(), ASHGATE);
  for (const id of ['dagny_coalbrook', 'hob', 'old_brannagh']) assert.ok(!npc(sim, id).folk, `${id} keeps one spot`);
  assert.equal(SHOPKEEP.ashgate, 'Wynn');
  goTo(sim, 'dungeon', 'cold_seam', 0); assert.equal(npc(sim, 'tamsin'), undefined, 'not on the old pithead');
  goTo(sim, 'dungeon', 'cold_seam', 1);
  const t = npc(sim, 'tamsin'), L = sim.world.level; assert.ok(t, 'in the tally cave');
  assert.equal(L.cells.get(Math.floor(t.x) + ',' + Math.floor(t.y)).room, L.descentRoom.id);
  assert.equal(NPCS.tamsin.found.boss, FOUND.tamsin.freedBy);
  goTo(sim, 'town', 'barrows', 0, 'vale'); assert.ok(!sim.world.npcs.some((n) => ASHGATE.includes(n.id)), 'none of them in Thornwick');
});

test('The Wickham Road: Ilse gives it at 18 once Act II is done; a word with Dagny in Ashgate makes it ready, and she takes it in', () => {
  const sim = after2(17);
  assert.equal(st(sim, 'ch3_the_wickham_road'), QS.LOCKED, 'level 17');
  sim.state.party[0].level = 18;
  assert.equal(st(sim, 'ch3_the_wickham_road'), QS.AVAILABLE);
  const ev = events(sim, ['dialogue', 'questReward']);
  talk(sim, 'sister_ilse'); assert.equal(ev.at(-1).vars.q_ch3_the_wickham_road, QS.AVAILABLE);
  effect(sim, 'quest', 'accept', 'ch3_the_wickham_road'); assert.equal(st(sim, 'ch3_the_wickham_road'), QS.ACTIVE);
  effect(sim, 'quest', 'turnin', 'ch3_the_wickham_road'); assert.equal(st(sim, 'ch3_the_wickham_road'), QS.ACTIVE, 'not Ilse\'s to take in');
  goTo(sim, 'town', 'barrows', 0, 'reach');
  talk(sim, 'dagny_coalbrook');
  const d = ev.filter((e) => e.n === 'dialogue').at(-1);
  assert.equal(d.npc, 'dagny_coalbrook'); assert.equal(d.vars.q_ch3_the_wickham_road, QS.ACTIVE, 'the Ink sees the meeting still to have');
  assert.equal(st(sim, 'ch3_the_wickham_road'), QS.READY, 'then it counts');
  assert.equal(st(sim, 'ch3_short_shift'), QS.LOCKED, 'Short Shift waits for the road');
  effect(sim, 'quest', 'turnin', 'ch3_the_wickham_road'); assert.equal(st(sim, 'ch3_the_wickham_road'), QS.DONE);
  assert.deepEqual(ev.filter((e) => e.n === 'questReward').map((e) => [e.xp, e.gold]), [[questXp(QUESTS.ch3_the_wickham_road.rewards, 18), 420]]);
  assert.equal(st(sim, 'ch3_short_shift'), QS.LOCKED, 'Short Shift opens at 19');
  sim.state.party[0].level = 19; assert.equal(st(sim, 'ch3_short_shift'), QS.AVAILABLE);
});

test('Short Shift: Dagny\'s, done when the Foreman falls in the Cold Seam; Tamsin joins once he\'s down, a mage-smith; Dagny reads her with you', () => {
  const sim = after2(20);
  sim.state.quests.ch3_the_wickham_road = { st: QS.DONE, step: 0, n: [] };
  goTo(sim, 'town', 'barrows', 0, 'reach');
  const ev = events(sim, ['dialogue', 'questReward', 'companionJoined']);
  talk(sim, 'dagny_coalbrook'); assert.equal(ev.at(-1).vars.q_ch3_short_shift, QS.AVAILABLE); assert.equal(ev.at(-1).vars.with_tamsin, 0);
  effect(sim, 'quest', 'accept', 'ch3_short_shift'); assert.equal(st(sim, 'ch3_short_shift'), QS.ACTIVE);
  // another boss, or the Foreman's name somewhere else, doesn't count
  goTo(sim, 'dungeon', 'cold_seam', 1); sim.bus.emit('bossDown', { id: 'toadking' }); assert.equal(st(sim, 'ch3_short_shift'), QS.ACTIVE);
  goTo(sim, 'dungeon', 'toadking_mound', 1); sim.bus.emit('bossDown', { id: 'foreman' }); assert.equal(st(sim, 'ch3_short_shift'), QS.ACTIVE, 'not in another dungeon');
  // Tamsin, still held: she talks, but won't go
  goTo(sim, 'dungeon', 'cold_seam', 1);
  talk(sim, 'tamsin'); assert.equal(ev.at(-1).npc, 'tamsin'); assert.equal(ev.at(-1).vars.boss_foreman, 0);
  effect(sim, 'companion', 'join'); assert.ok(![...sim.state.party, ...sim.state.bench].some((m) => m.id === 'tamsin'), 'the Foreman still holds her');
  // he falls in his hall (battle.js marks him down and says so)
  sim.state.bosses.foreman = 1; sim.bus.emit('bossDown', { id: 'foreman' });
  assert.equal(st(sim, 'ch3_short_shift'), QS.READY, 'the Foreman down: back to Dagny');
  talk(sim, 'tamsin'); assert.equal(ev.filter((e) => e.n === 'dialogue').at(-1).vars.boss_foreman, 1);
  effect(sim, 'companion', 'join');
  const t = sim.state.party.find((m) => m.id === 'tamsin');
  assert.ok(t, 'she joins'); assert.deepEqual([t.name, t.cls, t.actor, t.rank], ['Tamsin', 'mage', 'hero_tamsin', 'found']);
  assert.deepEqual(t.perks, FOUND_PERKS.tamsin); for (const p of t.perks) assert.ok(PERKS[p] && (!PERKS[p].cls || PERKS[p].cls.includes('mage')), p);
  assert.equal(ev.filter((e) => e.n === 'companionJoined').length, 1);
  sim.commands.push({ type: 'endTalk' }); sim.tick(); sim.tick(); assert.equal(npc(sim, 'tamsin'), undefined, 'she leaves the cave with you');
  // back to Dagny, who sees her niece with you
  goTo(sim, 'town', 'barrows', 0, 'reach');
  talk(sim, 'dagny_coalbrook'); const d = ev.filter((e) => e.n === 'dialogue').at(-1);
  assert.equal(d.vars.q_ch3_short_shift, QS.READY); assert.equal(d.vars.with_tamsin, 1);
  talk(sim, 'hob'); effect(sim, 'quest', 'turnin', 'ch3_short_shift'); assert.equal(st(sim, 'ch3_short_shift'), QS.READY, 'not Hob\'s');
  talk(sim, 'dagny_coalbrook'); effect(sim, 'quest', 'turnin', 'ch3_short_shift'); effect(sim, 'quest', 'turnin', 'ch3_short_shift');
  assert.equal(st(sim, 'ch3_short_shift'), QS.DONE);
  assert.deepEqual(ev.filter((e) => e.n === 'questReward').map((e) => e.gold), [480], 'paid once');
  // and talked to from her card, wherever the company is
  goTo(sim, 'overland', 'barrows', 0, 'reach'); sim.commands.push({ type: 'talk', npc: 'tamsin' }); sim.tick();
  assert.equal(ev.filter((e) => e.n === 'dialogue').at(-1).npc, 'tamsin');
});

test('a Foreman who fell before the chapter was taken counts at once; Tamsin can\'t be released, only benched', () => {
  const sim = after2(19);
  sim.state.quests.ch3_the_wickham_road = { st: QS.DONE, step: 0, n: [] };
  sim.state.bosses.foreman = 1;
  goTo(sim, 'dungeon', 'cold_seam', 1); talk(sim, 'tamsin'); effect(sim, 'companion', 'join');
  goTo(sim, 'town', 'barrows', 0, 'reach'); talk(sim, 'dagny_coalbrook'); effect(sim, 'quest', 'accept', 'ch3_short_shift');
  assert.equal(st(sim, 'ch3_short_shift'), QS.READY);
  sim.commands.push({ type: 'dismiss', id: 'tamsin' }); sim.tick();
  assert.ok(sim.state.bench.some((m) => m.id === 'tamsin'), 'benched');
  sim.commands.push({ type: 'release', id: 'tamsin' }); sim.tick();
  assert.ok(sim.state.bench.some((m) => m.id === 'tamsin'), 'a found companion isn\'t going anywhere');
});

// ── the Ink ─────────────────────────────────────────────────────────────────
const book = () => createStoryBook(async (f) => readFileSync(`content/dialogue/${f}.json`, 'utf8'));
async function play(file, knot, vars, picks = [], after = () => ({})) {
  const sent = [], c = await book().open(file, knot, vars, (cmd) => sent.push(cmd)), lines = [];
  let b = c.first; const settle = () => { lines.push(...b.lines); while (b.waiting) { b = c.resume({ ...vars, ...after(sent) }); lines.push(...b.lines); } };
  settle();
  for (const want of picks) { const i = b.choices.findIndex((ch) => ch.text.startsWith(want)); assert.ok(i >= 0, `no "${want}" in ${b.choices.map((ch) => ch.text)}`); b = c.choose(b.choices[i].index); settle(); }
  return { sent, lines, choices: b.choices.map((ch) => ch.text), ended: b.ended };
}

test('the Ink: Ilse offers the road; Dagny takes it in on the word, then offers Short Shift; Tamsin\'s join is hers to say', async () => {
  const ilse = await play('ilse', 'ilse_hub', { hero_name: 'Tam', flag_met_ilse: 1, q_ch2_the_last_office: 3, q_ch3_the_wickham_road: 0 }, ['Where is the Kell Assay?', "We'll go north."]);
  assert.ok(ilse.sent.some((c) => c.tag === 'quest' && c.args.join(' ') === 'accept ch3_the_wickham_road'));
  const dagny = await play('dagny', 'dagny_hub', { hero_name: 'Tam', flag_met_dagny: 0, q_ch3_the_wickham_road: 1, q_ch3_short_shift: -1 }, [], () => ({ flag_met_dagny: 1, q_ch3_the_wickham_road: 3, q_ch3_short_shift: 0 }));
  assert.deepEqual(dagny.sent.filter((c) => c.tag === 'quest'), [{ type: 'dialogueEffect', tag: 'quest', args: ['turnin', 'ch3_the_wickham_road'] }]);
  assert.ok(dagny.sent.some((c) => c.tag === 'flag' && c.args.join(' ') === 'set met_dagny'));
  assert.ok(dagny.choices.some((t) => t.startsWith("What's wrong at the Cold Seam?")), `then the Seam's on offer: ${dagny.choices}`);
  const offer = await play('dagny', 'dagny_hub', { hero_name: 'Tam', flag_met_dagny: 1, q_ch3_the_wickham_road: 3, q_ch3_short_shift: 0 }, ["What's wrong at the Cold Seam?", "We'll bring her up."]);
  assert.ok(offer.sent.some((c) => c.tag === 'quest' && c.args.join(' ') === 'accept ch3_short_shift'));
  for (const with_tamsin of [0, 1]) {
    const t = await play('dagny', 'dagny_hub', { hero_name: 'Tam', flag_met_dagny: 1, q_ch3_the_wickham_road: 3, q_ch3_short_shift: 2, with_tamsin, boss_foreman: 1 }, ["The Foreman's down."], () => ({ q_ch3_short_shift: 3 }));
    assert.ok(t.sent.some((c) => c.tag === 'quest' && c.args.join(' ') === 'turnin ch3_short_shift'), `with_tamsin ${with_tamsin}`);
    assert.ok(!t.choices.some((x) => x.startsWith("The Foreman's down.")), 'handed in, not offered again');
  }
  const early = await play('tamsin', 'tamsin_hub', { boss_foreman: 0, joined: 0 });
  assert.ok(!early.sent.some((c) => c.tag === 'companion'), 'held: no join on offer');
  const freed = await play('tamsin', 'tamsin_hub', { boss_foreman: 1, joined: 0, flag_met_tamsin: 1 }, ['Come with us.'], () => ({ joined: 1, in_party: 1 }));
  assert.deepEqual(freed.sent.find((c) => c.tag === 'companion'), { type: 'dialogueEffect', tag: 'companion', args: ['join'] });
  // the keepers open their windows from a word, and every origin has its own first word from Dagny
  const bel = await play('ashgate', 'bel_hub', { flag_met_bel: 1, day_part: 1 }, ["Who's looking for work?"]);
  assert.ok(bel.ended);
  const first = new Set();
  for (const o of ['thornwick_born', 'redhand_deserter', 'grey_sisters_ward', 'deepdelver_fostered', '']) first.add((await play('dagny', 'dagny_hub', { hero_origin: o, flag_met_dagny: 0, q_ch3_the_wickham_road: -1 }, [], () => ({ flag_met_dagny: 1 }))).lines.at(-1));
  assert.equal(first.size, 5, 'a line per origin');
});

test('the golden path: The Wickham Road on the compass alone, Ilse in Thornwick, north over the range to Ashgate, Dagny', () => {
  const sim = after2(18), ID = 'ch3_the_wickham_road', ev = events(sim, ['dialogue', 'questReward']);
  talk(sim, 'sister_ilse'); effect(sim, 'quest', 'accept', ID); sim.commands.push({ type: 'endTalk' }); sim.tick();
  const seen = new Set(); let went = 0;
  for (let t = 0; t < 20 * 60 * 30 && st(sim, ID) !== QS.DONE; t++) {
    const d = ev.filter((e) => e.n === 'dialogue').at(-1);
    if (d && !d.done) {
      d.done = true;
      if (d.npc === 'dagny_coalbrook' && st(sim, ID) === QS.READY) effect(sim, 'quest', 'turnin', ID);
      sim.commands.push({ type: 'endTalk' }); sim.tick();
    }
    if (!sim.state.player.path && t % 10 === 0) {
      const row = sim.destinations().find((r) => r.id === 'quest');
      if (row) { sim.commands.push({ type: 'goto', tx: row.tx, ty: row.ty, near: row.near, then: row.then || null, label: 'quest', room: row.room }); went++; }
    }
    seen.add(`${sim.world.kind}:${sim.world.region}`);
    sim.tick();
  }
  assert.equal(st(sim, ID), QS.DONE, `not done (${JSON.stringify(sim.state.quests[ID])}, scene ${sim.world.kind}:${sim.world.region})`);
  for (const s of ['town:vale', 'overland:vale', 'overland:reach', 'town:reach']) assert.ok(seen.has(s), `never in ${s}: ${[...seen]}`);
  assert.ok(went > 3, 'the compass led the way');
  assert.deepEqual(ev.filter((e) => e.n === 'questReward').map((e) => e.gold), [420]);
});
