// A quest handed in (or taken) in a conversation shows at once in the topics the story comes back
// to: the story waits after a line with effects and carries on with the sim's variables
// ('talkVars'), instead of the ones it opened with (story/adapter.js). The bug: Osric's "hand in"
// stayed on offer after handing in, until you walked off and talked to him again.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createStoryBook } from '../src/story/adapter.js';
import { createSim } from '../src/sim/core.js';

const book = () => createStoryBook(async (f) => JSON.parse(fs.readFileSync(new URL(`../content/dialogue/${f}.json`, import.meta.url), 'utf8')));

// drive a conversation like the dialogue window does: each waiting beat resumes with the vars given
async function talk(file, knot, vars, picks, varsAfter) {
  const sent = [], seen = [];
  const c = await book().open(file, knot, vars, (cmd) => sent.push(cmd));
  let beat = c.first;
  const settle = () => { while (beat.waiting) beat = c.resume(varsAfter(sent)); };
  settle();
  for (const want of picks) {
    const i = beat.choices.findIndex((ch) => ch.text.startsWith(want)); assert.ok(i >= 0, `no choice "${want}" in ${beat.choices.map((ch) => ch.text)}`);
    beat = c.choose(beat.choices[i].index); settle();
    seen.push(beat.choices.map((ch) => ch.text));
  }
  return { sent, seen };
}

test('after handing in the ledger, Osric no longer offers the hand-in', async () => {
  const base = { hero_name: 'Wren', hero_level: 6, party_size: 3, fallen_name: '', q_vale_captains_ledger: 2, frag_vale_count: 0, flag_met_osric: 1 };
  const { sent, seen } = await talk('osric', 'osric_greet_back', base, ['Three of the bright-eyed ones.'], () => ({ q_vale_captains_ledger: 3 }));
  assert.deepEqual(sent.find((c) => c.tag === 'quest'), { type: 'dialogueEffect', tag: 'quest', args: ['turnin', 'vale_captains_ledger'] });
  assert.ok(!seen[0].some((t) => t.startsWith('Three of the bright-eyed ones.')), `still offered: ${seen[0]}`);
});

test('after taking the ledger, Osric asks after it instead of offering it again', async () => {
  const base = { hero_name: 'Wren', hero_level: 6, party_size: 3, fallen_name: '', q_vale_captains_ledger: 0, frag_vale_count: 0, flag_met_osric: 1 };
  const { seen } = await talk('osric', 'osric_greet_back', base, ['Any bounties posted?', "I'll see to it."], () => ({ q_vale_captains_ledger: 1 }));
  assert.ok(!seen[1].some((t) => t.startsWith('Any bounties posted?')), `still offered: ${seen[1]}`);
  assert.ok(seen[1].some((t) => t.startsWith('About the bounty')));
});

test('the sim answers every dialogueEffect with the talking NPC\'s variables', () => {
  const sim = createSim(20260807, undefined, { scene: 'town' });
  const n = sim.world.npcs.find((q) => q.id === 'osric_hale'); assert.ok(n, 'Osric is in town');
  sim.state.player.x = n.x + 0.6; sim.state.player.y = n.y;
  const got = []; sim.bus.on('talkVars', (e) => got.push(e));
  sim.commands.push({ type: 'talk', npc: 'osric_hale' }); sim.tick();
  sim.commands.push({ type: 'dialogueEffect', tag: 'nonsense', args: ['x'] }); sim.tick();
  assert.equal(got.length, 1); assert.equal(got[0].npc, 'osric_hale'); assert.equal(got[0].vars.q_vale_captains_ledger, sim.quests.status('vale_captains_ledger'));
});
