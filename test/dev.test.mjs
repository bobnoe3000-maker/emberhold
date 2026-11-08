// dev.test.mjs — the menu's Developer tools (sim/dev.js; the owner, 2026-11-08: "Add a developer option in the menu to
// unlock skills, and add a level which includes appropriate skill points and stats"): a level comes as one fought for
// does, every skill opens at its level, both are commands a replay sees, and they mark the game a dev game, which is
// never verified.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createSim } from '../src/sim/core.js';
import { makeHero, makeMember, statsFor, xpToNext, gainXp } from '../src/sim/party.js';
import { pendingPoints } from '../src/sim/attributes.js';
import { pendingSkillPoints, skillsOf, unlocked } from '../src/sim/skills.js';
import { DEV_LEVEL_MAX } from '../src/sim/dev.js';
import { startSession, verifySession, replaySession, isDevGame } from '../src/sim/replay.js';

function game() {
  const sim = createSim(4242, undefined, { scene: 'town' });
  sim.state.party[0] = makeHero({ cls: 'cleric', name: 'Ada' }); sim.state.created = true;
  sim.state.party.push(makeMember('c1', 'Tam', 'fighter', 1));
  sim.tick();
  return sim;
}
const run = (sim, cmds) => { for (const c of cmds) sim.commands.push(c); sim.tick(); };

test('a dev level is a level fought for: its stat points, its skill point, its HP, its event', () => {
  const sim = game(), h = sim.state.party[0], hp0 = statsFor(h).maxHp, ev = [];
  sim.bus.on('levelUp', (e) => ev.push(e));
  assert.equal(h.level, 1); assert.equal(pendingPoints(h), 0); assert.equal(pendingSkillPoints(h), 0);
  run(sim, [{ type: 'devLevel', id: h.id }]);
  assert.equal(h.level, 2); assert.equal(h.xp, 0, 'exactly the XP the level wants: none over');
  assert.equal(pendingPoints(h), 3, 'three stat points to spend'); assert.equal(pendingSkillPoints(h), 1, 'a skill point at an even level');
  assert.ok(statsFor(h).maxHp > hp0 && h.hp === statsFor(h).maxHp, 'the new max HP arrives filled');
  assert.deepEqual(ev.map((e) => [e.id, e.level]), [[h.id, 2]]);
  // the same as gaining that XP in play
  const twin = makeHero({ cls: 'cleric', name: 'Ada' }); gainXp(twin, xpToNext(1));
  assert.equal(twin.level, h.level); assert.deepEqual(statsFor(twin), statsFor(h));
  run(sim, [{ type: 'devLevel', id: h.id }]);
  assert.equal(pendingPoints(h), 6); assert.equal(pendingSkillPoints(h), 1, 'level 3: no new skill point (odd)');
  // a companion on Auto spends its points on the class build, as a level-up in play does
  const c = sim.state.party[1]; run(sim, Array.from({ length: 5 }, () => ({ type: 'devLevel', id: c.id })));
  assert.equal(c.level, 6); assert.equal(pendingPoints(c), 0, 'Auto spent them'); assert.equal(pendingSkillPoints(c), 3);
});

test('every skill unlocked: each class\'s level-6 and level-12 abilities open at their level, not before', () => {
  const sim = game(), h = sim.state.party[0], [, six, twelve] = skillsOf('cleric');
  run(sim, Array.from({ length: 11 }, () => ({ type: 'devLevel', id: h.id })));
  assert.equal(h.level, 12);
  assert.ok(!unlocked(h, six, sim.state.trials) && !unlocked(h, twelve, sim.state.trials), 'before: the trials not done');
  run(sim, [{ type: 'devUnlockSkills' }]);
  assert.ok(unlocked(h, six, sim.state.trials) && unlocked(h, twelve, sim.state.trials), 'after: both open at level 12');
  const lone = makeMember('c9', 'Low', 'rogue', 3);
  for (const s of skillsOf('rogue').slice(1)) assert.ok(!unlocked(lone, s, sim.state.trials), `${s.id} still wants its level`);
  for (const c of ['fighter', 'rogue', 'mage', 'cleric', 'shaman']) assert.ok(sim.state.trials[c] && sim.state.trials[c + '12'], c);
});

test('they mark the game a dev game: kept in the save, refused by the verifier; an untouched game\'s save is as it was', () => {
  const plain = game(), before = plain.snapshot();
  assert.ok(!('dev' in before), 'no dev key unless used'); assert.equal(isDevGame(before), false);
  const sim = game();
  run(sim, [{ type: 'devUnlockSkills' }]);
  assert.equal(sim.state.dev, true); const snap = sim.snapshot(); assert.equal(snap.dev, true);
  const back = createSim(4242, undefined, { scene: 'town' }); back.restore(JSON.parse(JSON.stringify(snap)));
  assert.equal(back.state.dev, true, 'a reload keeps it'); assert.equal(back.snapshot().dev, true);
  // a session that uses them replays to the same state (they're commands), and is refused all the same
  const s2 = game(), sess = startSession(s2);
  run(s2, [{ type: 'devLevel', id: s2.state.party[0].id }]); for (let i = 0; i < 10; i++) s2.tick();
  const claim = sess.stop();
  assert.equal(replaySession(claim).hash, claim.endHash, 'the replay sees the dev level');
  const v = verifySession(claim); assert.equal(v.ok, false); assert.match(v.reason, /dev game/);
  // and an ordinary session still verifies
  const s3 = game(), sess3 = startSession(s3); for (let i = 0; i < 10; i++) s3.tick();
  assert.equal(verifySession(sess3.stop()).ok, true);
});

test('validated: an unknown member does nothing; the end of the XP table is the end', () => {
  const sim = game(), h = sim.state.party[0], ref = [];
  sim.bus.on('refused', (e) => ref.push(e.reason));
  sim.commands.push({ type: 'devLevel', id: 'nobody' }); sim.tick();
  assert.ok(!sim.state.dev, 'nothing done, nothing marked');
  h.level = DEV_LEVEL_MAX; run(sim, [{ type: 'devLevel', id: h.id }]);
  assert.equal(h.level, DEV_LEVEL_MAX); assert.ok(ref.some((r) => /level 60/.test(r)));
});
