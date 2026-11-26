// No quest waits on a companion in the party (v1.154; the owner, 2026-11-26: "I dont want this for any quest nor should
// any companion be required for a quest to complete"). Chapters, trials and errands are given and taken in by people
// who stand in the world; only a companion's own chain is theirs, and they're talked to from the bench as from the party.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { createSim } from '../src/sim/core.js';
import { QUESTS } from '../src/sim/quests.js';
import { FOUND } from '../src/sim/heroes.js';

const found = new Set(Object.keys(FOUND));

test('no chapter, trial or errand is given or taken in by a companion; a companion gives only their own chain', () => {
  for (const [id, q] of Object.entries(QUESTS)) {
    const taker = q.turnin || q.giver;
    if (q.kind === 'companion') { assert.equal(q.giver, q.companion, `${id}: their own chain`); continue; }
    assert.ok(!found.has(q.giver), `${id}: given by ${q.giver}, a companion`);
    assert.ok(!found.has(taker), `${id}: taken in by ${taker}, a companion`);
    assert.ok(!q.companion, `${id}: waits on ${q.companion} with the company`);
  }
  for (const f of readdirSync(new URL('../content/quests/', import.meta.url)).filter((f) => f.endsWith('.json'))) {
    const q = JSON.parse(readFileSync(new URL('../content/quests/' + f, import.meta.url), 'utf8'));
    if (q.kind === 'companion') continue;
    assert.ok(!found.has(q.giver) && !found.has(q.turnin), `${f}: a companion's`);
  }
});

test('a companion on the bench is talked to as one in the party (their own errands never need them in it)', () => {
  const sim = createSim(20260807, undefined, { scene: 'town', region: 'reach' }); sim.tick();
  const H = sim.state.party[0];
  (sim.state.bench ||= []).push({ ...JSON.parse(JSON.stringify(H)), id: 'tamsin', name: 'Tamsin', cls: 'mage', main: false, rank: 'found' });
  const talks = []; sim.bus.on('dialogue', (e) => talks.push(e));
  sim.commands.push({ type: 'talk', npc: 'tamsin' }); sim.tick();
  assert.equal(talks.length, 1, 'the conversation opens from the bench'); assert.equal(talks[0].npc, 'tamsin');
  assert.equal(talks[0].vars.joined, 1, 'she\'s with the company');
});
