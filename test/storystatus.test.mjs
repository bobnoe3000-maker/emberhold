// Where the main story stands (src/ui/storystatus.js; the owner, 2026-10-03: "it's not clear where I find the next
// step in the main quest line"). The Journal says it whenever no chapter is in hand: the next chapter and who gives
// it, the level it waits for, or that the act is done; and then what's still open in the Vale.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createSim } from '../src/sim/core.js';
import { storyStatus, openLeads, CHAPTERS } from '../src/ui/storystatus.js';

const SEED = 20260807;
const status = (sim) => (id) => sim.quests.status(id);
const town = () => { const s = createSim(SEED, undefined, { scene: 'town' }); s.tick(); return s; };

test('a new game: the next chapter is Maudry\'s', () => {
  const sim = town();
  assert.deepEqual(CHAPTERS, ['ch1_smoke_over_the_vale', 'ch1_the_diggers', 'ch1_ember_in_the_fist']);
  assert.deepEqual(storyStatus(sim.state, status(sim)), { kind: 'next', id: 'ch1_smoke_over_the_vale', giver: 'maudry_fenn' });
});

test('a chapter in hand: no status (its own card says what to do); handed in, the next one is named', () => {
  const sim = town();
  sim.quests.begin('ch1_smoke_over_the_vale');
  assert.equal(storyStatus(sim.state, status(sim)), null);
  sim.state.quests.ch1_smoke_over_the_vale.st = 3;
  const st = storyStatus(sim.state, status(sim));
  assert.ok(st.kind === 'next' || st.kind === 'level'); assert.equal(st.id, 'ch1_the_diggers');
});

test('the owner\'s save (Act I done, level 11): the act is over, and the Vale\'s open leads are listed', () => {
  const sim = town();
  const S = sim.state;
  for (const id of ['vale_long_way_round', 'ch1_smoke_over_the_vale', 'ch1_the_diggers', 'ch1_ember_in_the_fist', 'vale_first_page', 'vale_captains_ledger', 'trial_last_rites', 'trial_quiet_feet', 'trial_cold_weather']) S.quests[id] = { st: 3, step: 0, n: [] };
  S.party[0].level = 11; S.party[0].cls = 'cleric'; S.bosses = { redhand_captain: 1, robed_stranger: 1 }; S.trials = { cleric: 1, mage: 1, rogue: 1 };
  S.fragments = ['frag_vale_standing_order', 'frag_vale_last_dispatch', 'frag_vale_chaplains_prayer', 'frag_vale_chaplains_last_page', 'frag_vale_centurion_tablet'];
  assert.deepEqual(storyStatus(S, status(sim)), { kind: 'end' });
  const leads = openLeads(S, status(sim)).map((l) => l.id);
  assert.deepEqual(leads, ['brannoc', 'standard', 'warren', 'chronicle', 'board']);
  assert.deepEqual(openLeads(S, status(sim)).find((l) => l.id === 'chronicle'), { id: 'chronicle', n: 5, of: 10 });
  // every lead and status has its words
  const C = JSON.parse(readFileSync(new URL('../content/story.json', import.meta.url), 'utf8'));
  for (const id of ['brannoc', 'standard', 'warren', 'chronicle', 'milestone', 'trial', 'board']) assert.ok(C.leads[id], id);
  assert.ok(C.end.vale.title && C.next && C.level);
});
