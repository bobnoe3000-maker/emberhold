// Class trials at level 6 (M5, docs/m5-plan.md §6; world doc §5 v1.7): each class's level-6 ability wants
// its trial done by the company (state.trials). A trial is offered while someone of that class in the
// company is level 6+, by its teacher only; done, every member of the class knows the ability, hires
// included. Saves carry it (v13); older saves keep what the company already had at level 6.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createSim } from '../src/sim/core.js';
import { QS, QUESTS } from '../src/sim/quests.js';
import { makeMember, statsFor } from '../src/sim/party.js';
import { SKILLS, unlocked, TRIAL_CLASSES } from '../src/sim/skills.js';
import { createStoryBook } from '../src/story/adapter.js';

const SEED = 20260807;
const TRIALS = { fighter: ['trial_hold_the_keep_gate', 'osric_hale'], rogue: ['trial_quiet_feet', 'nell_tolley'], mage: ['trial_cold_weather', 'hedda'], cleric: ['trial_last_rites', 'sister_ilse'] };
const town = () => { const s = createSim(SEED, undefined, { scene: 'town' }); s.tick(); return s; };
function talk(sim, npc) {
  const n = sim.world.npcs.find((q) => q.id === npc), p = sim.state.player;
  sim.commands.push({ type: 'endTalk' }); sim.tick();
  p.x = p.px = n.x + 1; p.y = p.py = n.y - 1; sim.commands.push({ type: 'talk', npc }); sim.tick();
}
const say = (sim, verb, id) => { sim.commands.push({ type: 'dialogueEffect', tag: 'quest', args: [verb, id] }); sim.tick(); };
const trialSkill = (cls) => SKILLS[cls].find((s) => s.trial);

test('one trial ability per class, the level-6 one; level 12 still unlocks by level', () => {
  assert.deepEqual(TRIAL_CLASSES, ['fighter', 'rogue', 'mage', 'cleric']);
  for (const cls of TRIAL_CLASSES) {
    const A = trialSkill(cls), m = makeMember('x', 'X', cls, 12);
    assert.equal(A.lv, 6); assert.equal(SKILLS[cls].filter((s) => s.trial).length, 1);
    assert.ok(!unlocked(m, A, {}), `${A.name}: not without the trial`); assert.ok(unlocked(m, A, { [cls]: 1 }));
    assert.ok(!unlocked({ ...m, level: 5 }, A, { [cls]: 1 }), 'nor before level 6');
    assert.ok(unlocked(m, SKILLS[cls].find((s) => s.lv === 12), {}), 'the level-12 one by level');
    assert.equal(QUESTS[TRIALS[cls][0]].trial, cls); assert.equal(QUESTS[TRIALS[cls][0]].giver, TRIALS[cls][1]);
  }
});

test('a trial is offered while someone of its class in the company is level 6+, by its teacher only; done, the whole class knows it', () => {
  const sim = town(), [id, giver] = TRIALS.fighter, st = () => sim.quests.status(id), ev = [];
  sim.bus.on('trialDone', (e) => ev.push(e));
  assert.equal(sim.state.party[0].cls, 'fighter'); assert.equal(st(), QS.LOCKED, 'level 1: not yet');
  sim.state.party[0].level = 6;
  const refused = []; sim.bus.on('refused', (r) => refused.push(r.reason));
  sim.commands.push({ type: 'rankSkill', id: 'you', skill: 'shield_wall' }); sim.tick();
  assert.match(refused.at(-1), /Shield Wall comes with the fighter's trial/);
  assert.equal(st(), QS.AVAILABLE);
  talk(sim, 'hedda'); say(sim, 'accept', id); assert.equal(st(), QS.AVAILABLE, 'not from Hedda');
  talk(sim, giver); say(sim, 'accept', id); assert.equal(st(), QS.ACTIVE);
  sim.restore({ ...JSON.parse(JSON.stringify(sim.snapshot())), scene: 'dungeon', site: 'wickham_keep', depth: 0 });
  for (let i = 0; i < 8; i++) sim.bus.emit('wave', { cleared: true, room: 1 });
  assert.equal(st(), QS.READY);
  sim.restore({ ...JSON.parse(JSON.stringify(sim.snapshot())), scene: 'town', depth: 0 });
  talk(sim, giver); say(sim, 'turnin', id); say(sim, 'turnin', id);
  assert.equal(st(), QS.DONE); assert.deepEqual(ev, [{ cls: 'fighter', id }], 'once');
  assert.deepEqual(sim.state.trials, { fighter: 1 });
  sim.commands.push({ type: 'rankSkill', id: 'you', skill: 'shield_wall' }); sim.tick();
  assert.equal(sim.state.party[0].skills.shield_wall, 2, 'now it takes points');
  const hire = makeMember('h', 'H', 'fighter', 7);
  assert.ok(unlocked(hire, trialSkill('fighter'), sim.state.trials), 'a fighter hired later knows it too');
  assert.ok(!unlocked(makeMember('r', 'R', 'rogue', 7), trialSkill('rogue'), sim.state.trials), 'the rogues still need theirs');
});

test('a companion of the class counts, on the bench too; nobody of it at 6, no trial', () => {
  const sim = town();
  for (const cls of ['rogue', 'mage', 'cleric']) assert.equal(sim.quests.status(TRIALS[cls][0]), QS.LOCKED);
  sim.state.bench.push(makeMember('b1', 'Wenna', 'cleric', 6));
  assert.equal(sim.quests.status('trial_last_rites'), QS.AVAILABLE, 'a benched cleric at 6');
  sim.state.party.push(makeMember('p1', 'Lark', 'rogue', 5));
  assert.equal(sim.quests.status('trial_quiet_feet'), QS.LOCKED, 'a rogue at 5: not yet');
  sim.state.party[1].level = 6; assert.equal(sim.quests.status('trial_quiet_feet'), QS.AVAILABLE);
  assert.equal(sim.quests.status('trial_cold_weather'), QS.LOCKED);
});

test('in battle: no Shield Wall before the trial, and it comes after', () => {
  const run = (trials) => {
    const sim = createSim(SEED, undefined, { scene: 'dungeon' }), h = sim.state.party[0]; h.level = 8; h.hp = 400; h.off = ['cleave']; sim.state.trials = trials;   // (Cleave off: the MP is for the wall)
    sim.state.party.push(makeMember('c', 'C', 'cleric', 8));   // (Shield Wall draws foes off someone: it wants company)
    const L = sim.world.level, r = L.rooms.find((q) => q !== L.entrance && q !== L.descentRoom), p = sim.state.player; p.x = p.px = r.cx + 0.5; p.y = p.py = r.cy + 0.5;
    const guards = []; sim.bus.on('combat', (g) => { if (g.t === 'guard') guards.push(g.name); });
    for (let i = 0; i < 20 * 40; i++) { for (const m of sim.state.party) m.hp = Math.max(m.hp, 150); h.hp = statsFor(h).maxHp * 0.3; sim.tick(); }   // (held low: a guard is worth it)
    return guards;
  };
  assert.ok(!run({}).includes('Shield Wall')); assert.ok(run({ fighter: 1 }).includes('Shield Wall'));
});

test('saves carry the trials (v13); an older save keeps every class the company had at level 6', () => {
  const sim = town(); sim.state.trials = { mage: 1 };
  const back = town(); back.restore(JSON.parse(JSON.stringify(sim.snapshot())));
  assert.deepEqual(back.state.trials, { mage: 1 });
  const old = JSON.parse(JSON.stringify(sim.snapshot())); delete old.trials;
  old.party[0].level = 7; old.bench = [{ ...makeMember('b', 'B', 'cleric', 6) }, { ...makeMember('c', 'C', 'rogue', 5) }];
  const v12 = town(); v12.restore(old);
  assert.deepEqual(v12.state.trials, { fighter: 1, cleric: 1 }, 'the level-7 fighter and the benched level-6 cleric; not the level-5 rogue');
  const junk = JSON.parse(JSON.stringify(sim.snapshot())); junk.trials = ['mage', 'bard', 3];
  const j = town(); j.restore(junk); assert.deepEqual(j.state.trials, { mage: 1 }, 'only real classes');
});

// the words: each teacher offers their trial and takes it in (story adapter)
const book = () => createStoryBook(async (f) => JSON.parse(readFileSync(`content/dialogue/${f}.json`, 'utf8')));
async function play(file, knot, vars, picks) {
  const sent = [], c = await book().open(file, knot, vars, (cmd) => sent.push(cmd));
  let b = c.first; const settle = () => { while (b.waiting) b = c.resume(vars); }; settle();
  for (const want of picks) { const ch = b.choices.find((x) => x.text.startsWith(want)); assert.ok(ch, `${file}: no "${want}" in ${b.choices.map((x) => x.text)}`); b = c.choose(ch.index); settle(); }
  return { quest: sent.filter((x) => x.tag === 'quest').map((x) => x.args.join(' ')), choices: b.choices.map((x) => x.text), ended: b.ended };
}
const met = { hero_name: 'Tam', hero_level: 6, fallen_name: '', day_part: 1, flag_met_osric: 1, flag_met_ilse: 1, flag_met_nell: 1, flag_met_hedda: 1 };
test('the Ink: Osric, Nell, Hedda and Ilse each offer their trial and take it in; Nell and Hedda are brief without one', async () => {
  const cases = [['osric', 'osric_hub', 'trial_hold_the_keep_gate', ['Can you teach a fighter anything?', "We'll hold it."], ['We held the Keep.']],
    ['townsfolk', 'nell_hub', 'trial_quiet_feet', ['You walk very quietly for an innkeeper.', 'Done.'], ['Three sergeants, and they never heard us.']],
    ['townsfolk', 'hedda_hub', 'trial_cold_weather', ['Does the weather really listen to you?', "We'll go."], ['It listened.']],
    ['ilse', 'ilse_hub', 'trial_last_rites', ["Is there anything you'd teach a cleric?", "We'll say them."], ['The rites are said.']]];
  for (const [file, knot, id, offer, turnin] of cases) {
    assert.deepEqual((await play(file, knot, { ...met, ['q_' + id]: 0 }, offer)).quest, [`accept ${id}`], id);
    assert.deepEqual((await play(file, knot, { ...met, ['q_' + id]: 2 }, turnin)).quest, [`turnin ${id}`], id);
  }
  for (const knot of ['nell_hub', 'hedda_hub']) for (const q of [-1, 3]) {
    const r = await play('townsfolk', knot, { ...met, q_trial_quiet_feet: q, q_trial_cold_weather: q }, []);
    assert.ok(r.ended && !r.choices.length, `${knot} with the trial ${q}: a line and done, as before`);
  }
});
