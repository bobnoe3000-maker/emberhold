// The marker over a quest-giver's head (sim quests.js marks, drawn by renderer.js): '!' where someone has a
// quest you can take now, '?' where someone takes one in, by the same gates as their conversation.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createSim } from '../src/sim/core.js';
import { QS } from '../src/sim/quests.js';

const town = (lv = 1) => { const s = createSim(20260807, undefined, { scene: 'town' }); s.state.party[0].level = lv; s.tick(); return s; };

test('a new game: Maudry, Sister Ilse and Jory (the ditch burrow, v1.63) have something; Osric\'s bounty and Col\'s cow wait for level 2', () => {
  assert.deepEqual(town(1).quests.marks(), { maudry_fenn: 'new', sister_ilse: 'new', jory: 'new' });
  assert.equal(town(2).quests.marks().osric_hale, 'new'); assert.equal(town(2).quests.marks().col, 'new');
});

test('a quest to hand in shows on whoever takes it in, and wins over a new one', () => {
  const s = town(3);
  s.quests.begin('ch1_smoke_over_the_vale'); s.state.quests.ch1_smoke_over_the_vale.st = QS.READY;   // (Maudry gives it; Osric takes it in)
  const m = s.quests.marks();
  assert.equal(m.osric_hale, 'ready');
  assert.equal(m.maudry_fenn, 'new', 'her errand is still hers to give');
  s.quests.begin('vale_long_way_round'); s.state.quests.vale_long_way_round.st = QS.READY;
  assert.equal(s.quests.marks().maudry_fenn, 'ready');
  s.state.quests.vale_long_way_round.st = QS.DONE; s.state.quests.ch1_smoke_over_the_vale.st = QS.DONE;
  assert.equal(s.quests.marks().maudry_fenn, undefined, 'nothing left with her');
});

// the markers' kinds (quests.js markKinds; the owner, 2026-11-11: "stay yellow for non main quests. Change to blue for
// open or in progress main quests. Keep the green color for any type of completed quests"): the main story's a chapter
// quest, offered or under way; a side quest only when offered; any quest to hand in
test('main or side: Maudry offers the main story (blue), Ilse and Jory side quests (gold); under way it shows at who takes it in; ready, any kind (green)', () => {
  const s = town(1);
  assert.deepEqual(s.quests.markKinds(), { maudry_fenn: { mark: 'new', main: true }, sister_ilse: { mark: 'new', main: false }, jory: { mark: 'new', main: false } });
  s.quests.begin('ch1_smoke_over_the_vale');                                  // (Maudry gives it; Osric takes it in)
  let m = s.quests.markKinds();
  assert.deepEqual(m.osric_hale, { mark: 'going', main: true }, 'under way: at Osric, who takes it in');
  assert.deepEqual(m.maudry_fenn, { mark: 'new', main: false }, 'her own errand still hers to give, a side quest');
  s.state.quests.ch1_smoke_over_the_vale.st = QS.READY;
  assert.deepEqual(s.quests.markKinds().osric_hale, { mark: 'ready', main: true });
  s.quests.begin('vale_the_ditch'); s.state.quests.vale_the_ditch.st = QS.ACTIVE;
  assert.equal(s.quests.markKinds().jory, undefined, 'a side quest under way: no marker');
  s.state.quests.vale_the_ditch.st = QS.READY;
  assert.deepEqual(s.quests.markKinds().jory, { mark: 'ready', main: false }, 'any kind, green when it can be handed in');
  s.state.quests.ch1_smoke_over_the_vale.st = QS.DONE;
  assert.equal(s.quests.markKinds().osric_hale, undefined, 'handed in: gone');
});
