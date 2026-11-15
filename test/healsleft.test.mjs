// The party's endurance gauge (the owner, 2026-11-15, mana's step 2: the fight's room pill reads ♥ ×N): how many more of
// its cheapest heal in play and on auto-use a member can pay for with the MP it has; -1 with none in play.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { makeMember } from '../src/sim/party.js';
import { healsLeft, SKILLS } from '../src/sim/skills.js';

const T = { fighter: 1, rogue: 1, mage: 1, cleric: 1, shaman: 1 };
test('heals left: the MP over the cheapest heal in play; -1 without one', () => {
  const c = makeMember('c', 'Ilse', 'cleric', 6), mend = SKILLS.cleric.find((a) => a.id === 'mend').mp;
  c.mp = mend * 3 + 1; assert.equal(healsLeft(c, T), 3);
  c.mp = mend - 1; assert.equal(healsLeft(c, T), 0);
  c.off = ['mend', 'sanctuary']; assert.equal(healsLeft(c, T), -1, 'a heal off auto-use isn\'t counted');
  const f = makeMember('f', 'Pike', 'fighter', 6); f.mp = 99; assert.equal(healsLeft(f, T), -1, 'no heal in play');
  c.off = []; c.mp = mend * 2; assert.equal(healsLeft(c, T, () => 2), Math.floor((mend * 2) / (mend - 2)), 'a Rare\'s cheaper Mend counts more');
});
