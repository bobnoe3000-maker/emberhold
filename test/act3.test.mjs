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

// ── the rest of Act III (v1.54; world doc §6 "As told") ──────────────────────
import { unlocked, SKILLS } from '../src/sim/skills.js';
import { SETS } from '../src/sim/lore.js';
import { storyStatus } from '../src/ui/storystatus.js';
const CH3 = ['ch3_the_wickham_road', 'ch3_short_shift', 'ch3_paid_by_weight', 'ch3_gone_back_to_work', 'ch3_night_shift', 'ch3_quota'];
const doneTo = (sim, id) => { for (const q of CH3.slice(0, CH3.indexOf(id))) sim.state.quests[q] = { st: QS.DONE, step: 0, n: [] }; };
/** Tamsin freed and with the company (the Foreman down, her word in the tally cave) */
function withTamsin(sim) {
  sim.state.bosses.foreman = 1; goTo(sim, 'dungeon', 'cold_seam', 1); talk(sim, 'tamsin'); effect(sim, 'companion', 'join');
  sim.commands.push({ type: 'endTalk' }); sim.tick();
  assert.ok(sim.state.party.some((m) => m.id === 'tamsin'), 'Tamsin with you');
}

test('Kell\'s Rest\'s two wait at the Assay Yards\' gate (GDD v1.132: the depot is no town), apart, and answer; Davy Pruett\'s word is Paid by Weight\'s first step', () => {
  const sim = after2(23, 'town', 'reach'); doneTo(sim, 'ch3_paid_by_weight');
  goTo(sim, 'dungeon', 'assay_yards', 1); assert.ok(!npc(sim, 'nan_ruddock') && !npc(sim, 'assay_clerk'), 'not under the Yards');
  goTo(sim, 'dungeon', 'assay_yards', 0);
  const nan = npc(sim, 'nan_ruddock'), clerk = npc(sim, 'assay_clerk'), E = sim.world.level.entrance;
  assert.ok(nan && clerk, 'both by the way in');
  for (const n of [nan, clerk]) assert.equal(sim.world.level.cells.get(Math.floor(n.x) + ',' + Math.floor(n.y)).room, E.id);
  assert.ok(Math.hypot(nan.x - clerk.x, nan.y - clerk.y) >= 3, 'apart: a tap picks one');
  const ev = events(sim, ['dialogue']);
  talk(sim, 'nan_ruddock'); assert.equal(ev.at(-1).npc, 'nan_ruddock');
  effect(sim, 'companion', 'join'); assert.ok(!sim.state.party.some((m) => m.id === 'nan_ruddock'), 'nobody\'s companion');
  goTo(sim, 'town', 'barrows', 0, 'reach'); talk(sim, 'hob'); effect(sim, 'quest', 'accept', 'ch3_paid_by_weight');
  assert.equal(st(sim, 'ch3_paid_by_weight'), QS.ACTIVE);
  goTo(sim, 'dungeon', 'assay_yards', 0); talk(sim, 'assay_clerk');
  assert.equal(ev.at(-1).vars.s_ch3_paid_by_weight, 0, 'the Ink reads the pass still to have');
  assert.equal(sim.state.quests.ch3_paid_by_weight.step, 1, 'then on to the Weighmaster');
});

test('Act III played on: Paid by Weight (Hob → Dagny), Gone Back to Work (Mother Coke), Night Shift (Vane runs, and it counts), Quota (Tamsin → Dagny); then it\'s over', () => {
  const sim = after2(30, 'town', 'reach'); doneTo(sim, 'ch3_paid_by_weight');
  withTamsin(sim);
  const ev = events(sim, ['questReward', 'dialogue']);
  const play = (id, giver, taker, fall, site, depth) => {
    goTo(sim, 'town', 'barrows', 0, 'reach');
    assert.equal(st(sim, id), QS.AVAILABLE, id);
    talk(sim, giver); effect(sim, 'quest', 'accept', id); assert.equal(st(sim, id), QS.ACTIVE, `${id}: ${giver} gives it`);
    if (id === 'ch3_paid_by_weight') sim.state.quests[id] = { st: QS.ACTIVE, step: 1, n: [0] };   // (the clerk's word: the test above)
    goTo(sim, 'dungeon', site, depth); sim.state.bosses[fall.id] = 1; sim.bus.emit('bossDown', fall);
    assert.equal(st(sim, id), QS.READY, `${id}: ${fall.id} down`);
    goTo(sim, 'town', 'barrows', 0, 'reach');
    if (taker !== giver) { talk(sim, giver); effect(sim, 'quest', 'turnin', id); assert.equal(st(sim, id), QS.READY, `${id}: not ${giver}'s to take in`); }
    talk(sim, taker); effect(sim, 'quest', 'turnin', id); assert.equal(st(sim, id), QS.DONE, id);
  };
  play('ch3_paid_by_weight', 'hob', 'dagny_coalbrook', { id: 'weighmaster' }, 'assay_yards', 1);
  play('ch3_gone_back_to_work', 'mother_coke', 'mother_coke', { id: 'oruth' }, 'cinderworks', 0);   // (v1.144: the Forgehall, the Cinderworks' first floor)
  play('ch3_night_shift', 'dagny_coalbrook', 'dagny_coalbrook', { id: 'morrow_vane', fled: true }, 'cinderworks', 1);   // (his furnace hall, the second floor)
  play('ch3_quota', 'tamsin', 'dagny_coalbrook', { id: 'stoker' }, 'cinderworks', 1);
  assert.deepEqual(ev.filter((e) => e.n === 'questReward').map((e) => e.gold), [520, 580, 620, 700]);
  assert.deepEqual(storyStatus(sim.state, (id) => sim.quests.status(id)), { kind: 'end', region: 'reach' }, 'Act III is done');
});

test('the chapters wait for their bands, and Quota is Tamsin\'s: from her card, while she\'s with you', () => {
  const sim = after2(24, 'town', 'reach'); doneTo(sim, 'ch3_gone_back_to_work');
  assert.equal(st(sim, 'ch3_gone_back_to_work'), QS.LOCKED, '25');
  for (const [id, lv] of [['ch3_paid_by_weight', 23], ['ch3_gone_back_to_work', 27], ['ch3_night_shift', 29], ['ch3_quota', 30]]) assert.equal(QUESTS[id].level[0], lv, id);   // (v1.144: bands of four)
  doneTo(sim, 'ch3_quota'); sim.state.party[0].level = 30;
  sim.commands.push({ type: 'talk', npc: 'tamsin' }); sim.tick(); effect(sim, 'quest', 'accept', 'ch3_quota');
  assert.equal(st(sim, 'ch3_quota'), QS.AVAILABLE, 'she\'s still in the Seam: no talk, no quest');
  withTamsin(sim); goTo(sim, 'overland', 'barrows', 0, 'reach');
  sim.commands.push({ type: 'talk', npc: 'tamsin' }); sim.tick(); effect(sim, 'quest', 'accept', 'ch3_quota');
  assert.equal(st(sim, 'ch3_quota'), QS.ACTIVE, 'from her card, out on the land');
});

test('the side work: Tamsin\'s chain while she\'s with you, in order; Gunnar\'s and Old Brannagh\'s, counted where they ask', () => {
  const sim = after2(29, 'town', 'reach');
  assert.equal(st(sim, 'tamsin_the_stamp'), QS.LOCKED, 'not without her');
  withTamsin(sim);
  assert.equal(st(sim, 'tamsin_the_stamp'), QS.AVAILABLE); assert.equal(st(sim, 'tamsin_the_patterns'), QS.LOCKED, 'in order');
  const run = (id, giver, site, depth, fire) => {
    if (giver !== 'tamsin') goTo(sim, 'town', 'barrows', 0, 'reach');
    talk(sim, giver); effect(sim, 'quest', 'accept', id); assert.equal(st(sim, id), QS.ACTIVE, id);
    goTo(sim, 'dungeon', site, depth); fire();
    assert.equal(st(sim, id), QS.READY, id);
    if (giver !== 'tamsin') goTo(sim, 'town', 'barrows', 0, 'reach');
    talk(sim, giver); effect(sim, 'quest', 'turnin', id); assert.equal(st(sim, id), QS.DONE, id);
  };
  const elites = (n) => () => { for (let i = 0; i < n; i++) sim.bus.emit('slain', { elite: true }); };
  const chests = (n) => () => { for (let i = 0; i < n; i++) sim.bus.emit('looted', { kind: 'chest' }); };
  const waves = (n) => () => { for (let i = 0; i < n; i++) sim.bus.emit('wave', { cleared: true, room: -1 }); };
  run('tamsin_the_stamp', 'tamsin', 'assay_yards', 0, elites(3));
  run('tamsin_the_patterns', 'tamsin', 'cinderworks', 0, chests(2));
  run('tamsin_spoiled_casting', 'tamsin', 'cinderworks', 1, waves(5));
  run('gunnar_the_lease', 'gunnar_slagg', 'assay_yards', 0, chests(2));
  run('gunnar_the_row', 'gunnar_slagg', 'cinderworks', 0, elites(3));
  run('brannagh_last_wages', 'old_brannagh', 'cold_seam', 0, chests(2));
  doneTo(sim, 'ch3_quota');
  run('brannagh_counted_in', 'old_brannagh', 'cinderworks', 0, waves(6));
});

test('the trials at 24: offered once someone of the class is 24 and its 12 is done; handed in, the class\'s level-24 ability opens', () => {
  const sim = after2(24, 'town', 'reach'), h = sim.state.party[0];
  h.cls = 'fighter'; sim.state.trials = { fighter: 1 };
  const blades = SKILLS.fighter.find((s) => s.lv === 24);
  assert.equal(st(sim, 'trial24_fighter'), QS.LOCKED, 'the 12 not done');
  assert.ok(!unlocked(h, blades, sim.state.trials), `${blades.name}: not yet`);
  sim.state.trials.fighter12 = 1; h.level = 23; assert.equal(st(sim, 'trial24_fighter'), QS.LOCKED, 'nobody at 24');
  h.level = 24; assert.equal(st(sim, 'trial24_fighter'), QS.AVAILABLE);
  assert.ok(!unlocked(h, blades, sim.state.trials), 'level 24, the 12 done: still not without the 24\'s trial');
  const ev = events(sim, ['trialDone']);
  talk(sim, 'haldor'); effect(sim, 'quest', 'accept', 'trial24_fighter');
  goTo(sim, 'dungeon', 'assay_yards', 0); const hall = sim.world.level.descentRoom.id;
  for (let i = 0; i < 10; i++) sim.bus.emit('wave', { cleared: true, room: hall });
  assert.equal(st(sim, 'trial24_fighter'), QS.READY, 'ten waves in the counting house');
  goTo(sim, 'town', 'barrows', 0, 'reach'); talk(sim, 'haldor'); effect(sim, 'quest', 'turnin', 'trial24_fighter');
  assert.equal(sim.state.trials.fighter24, 1); assert.deepEqual(ev.map((e) => [e.cls, e.lv]), [['fighter', 24]]);
  assert.ok(unlocked(sim.state.party[0], blades, sim.state.trials), `${blades.name}: open`);
  // kept in a save; Tamsin teaches the mages' only while she's with you
  const back = createSim(1); back.restore(snap(sim)); assert.equal(back.state.trials.fighter24, 1, 'the 24 survives a save');
  sim.state.party[0].cls = 'mage'; sim.state.trials = { mage: 1, mage12: 1 }; assert.equal(st(sim, 'trial24_mage'), QS.LOCKED, 'not without Tamsin');   // (the hero as the save now has him: a restore makes him anew)
  withTamsin(sim); assert.equal(st(sim, 'trial24_mage'), QS.AVAILABLE);
});

test('the Reach\'s Chronicle: twelve, in its three dungeons (v1.144); the last one reveals the Ninth Vault; Oruth\'s apron plate is his when he lies down', () => {
  assert.equal(SETS.reach.length, 12);
  const sim = after2(30, 'town', 'reach'), ev = events(sim, ['fragmentFound', 'setComplete']);
  goTo(sim, 'dungeon', 'cinderworks', 0); sim.bus.emit('bossDown', { id: 'oruth' });
  assert.deepEqual(ev.filter((e) => e.n === 'fragmentFound').map((e) => e.id), ['frag_reach_apron_plate']);
  sim.state.fragments.push(...SETS.reach.filter((id) => !sim.state.fragments.includes(id) && id !== 'frag_reach_renewal'));
  goTo(sim, 'dungeon', 'cinderworks', 1); sim.bus.emit('bossDown', { id: 'stoker' });
  assert.ok(ev.some((e) => e.n === 'setComplete' && e.set === 'reach'));
  assert.ok(sim.state.revealed.has('ninth_vault'), 'the Ninth Vault revealed');
});

test('the Ink for the rest of the act: each offer takes its quest, each hand-in hands it in, and Pruett\'s pass reads its step', async () => {
  const tag = (r, verb, id) => r.sent.some((c) => c.tag === 'quest' && c.args.join(' ') === `${verb} ${id}`);
  const cases = [
    ['ashgate', 'hob_hub', { flag_met_hob: 1, q_ch3_paid_by_weight: 0 }, ['We need to get into the Assay Yards.', "What's your price?"], 'accept', 'ch3_paid_by_weight'],
    ['dagny', 'dagny_hub', { flag_met_dagny: 1, q_ch3_the_wickham_road: 3, q_ch3_paid_by_weight: 2 }, ["The night shift's rolls."], 'turnin', 'ch3_paid_by_weight'],
    ['ashgate', 'coke_hub', { flag_met_coke: 1, q_ch3_gone_back_to_work: 0 }, ["The Forgehall's lit.", "We'll put him to bed."], 'accept', 'ch3_gone_back_to_work'],
    ['ashgate', 'coke_hub', { flag_met_coke: 1, q_ch3_gone_back_to_work: 2 }, ["Oruth's asleep."], 'turnin', 'ch3_gone_back_to_work'],
    ['dagny', 'dagny_hub', { flag_met_dagny: 1, q_ch3_the_wickham_road: 3, q_ch3_night_shift: 0 }, ['The rolls name the Cinderworks.', "We'll open the pens."], 'accept', 'ch3_night_shift'],
    ['dagny', 'dagny_hub', { flag_met_dagny: 1, q_ch3_the_wickham_road: 3, q_ch3_night_shift: 2 }, ['Morrow Vane ran.'], 'turnin', 'ch3_night_shift'],
    ['tamsin', 'tamsin_hub', { joined: 1, in_party: 1, q_ch3_quota: 0 }, ['The night shift went down.', "We'll go down."], 'accept', 'ch3_quota'],
    ['dagny', 'dagny_hub', { flag_met_dagny: 1, q_ch3_the_wickham_road: 3, q_ch3_quota: 2 }, ["Furnace Nine's lamp is broken."], 'turnin', 'ch3_quota'],
    ['ashgate', 'haldor_hub', { flag_met_haldor: 1, q_trial24_fighter: 2 }, ['The counting house held.'], 'turnin', 'trial24_fighter'],
    ['ashgate', 'gunnar_hub', { flag_met_gunnar: 1, q_gunnar_the_lease: 0 }, ['What did you sign?', "We'll fetch it."], 'accept', 'gunnar_the_lease'],
    ['ashgate', 'brannagh_hub', { flag_met_brannagh: 1, q_brannagh_last_wages: 2 }, ["The Seam's last wages."], 'turnin', 'brannagh_last_wages'],
  ];
  for (const [file, knot, vars, picks, verb, id] of cases) {
    const r = await play(file, knot, { hero_name: 'Tam', ...vars }, picks, () => ({ ['q_' + id]: verb === 'accept' ? 1 : 3 }));
    assert.ok(tag(r, verb, id), `${file} ${knot}: ${verb} ${id}`);
  }
  const pass = await play('kellsrest', 'clerk_hub', { flag_met_clerk: 0, q_ch3_paid_by_weight: 1, s_ch3_paid_by_weight: 0 }, [], () => ({ flag_met_clerk: 1, s_ch3_paid_by_weight: 1 }));
  assert.ok(pass.lines.some((l) => /Hob sent you/.test(l)) && pass.lines.some((l) => /quota office/.test(l)), 'the pass, said whole');
  const nan = await play('kellsrest', 'nan_hub', { flag_met_nan: 0, hero_origin: 'redhand_deserter' }, [], () => ({ flag_met_nan: 1 }));
  assert.ok(nan.lines.some((l) => /You walked/.test(l)), 'Nan knows a deserter');
});
