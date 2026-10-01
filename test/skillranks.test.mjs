// What a skill rank does, in numbers (GDD §5.1): +10 % strength a rank, × the Rare gear's power mod for
// the ability, × the member's power stat. battle.js casts with skillMult and the Skills tab shows it, so
// the screen and the fight can't disagree; ranks 3 and 5 take 1 MP each off the cost.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { skillMult, rankPower, rankCost, skillDef, MAX_RANK, HEAL_BONUS } from '../src/sim/skills.js';

test('a rank is +10 % strength; gear and the power stat multiply it', () => {
  assert.deepEqual([1, 2, 3, 4, 5].map((r) => +skillMult(r).toFixed(3)), [1, 1.1, 1.2, 1.3, 1.4]);
  assert.equal(+skillMult(3, 0.15, 0.1).toFixed(4), +(1.2 * 1.15 * 1.1).toFixed(4));
  for (let r = 1; r <= MAX_RANK; r++) assert.equal(skillMult(r), rankPower(r));
  assert.equal(HEAL_BONUS, 1.2);
});

test('Firebolt by rank: its multiplier and MP, as the Skills tab lists them', () => {
  const A = skillDef('mage', 'firebolt');
  assert.deepEqual([1, 2, 3, 4, 5].map((r) => [+(A.power * skillMult(r)).toFixed(2), rankCost(A, r)]), [[1.8, 12], [1.98, 12], [2.16, 11], [2.34, 11], [2.52, 10]]);
});
