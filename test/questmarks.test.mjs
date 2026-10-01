// The marker over a quest-giver's head (sim quests.js marks, drawn by renderer.js): '!' where someone has a
// quest you can take now, '?' where someone takes one in, by the same gates as their conversation.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createSim } from '../src/sim/core.js';
import { QS } from '../src/sim/quests.js';

const town = (lv = 1) => { const s = createSim(20260807, undefined, { scene: 'town' }); s.state.party[0].level = lv; s.tick(); return s; };

test('a new game: Maudry and Sister Ilse have something; Osric\'s bounty waits for level 2', () => {
  assert.deepEqual(town(1).quests.marks(), { maudry_fenn: 'new', sister_ilse: 'new' });
  assert.equal(town(2).quests.marks().osric_hale, 'new');
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
