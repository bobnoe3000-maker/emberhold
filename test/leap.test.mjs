// The Vault's leap as it's drawn (src/render/leap.js, GDD v1.99): the crouch, the arc, the chop over the jump's legs
// striking as he lands, the landing's crouch; and every clip it poses is one the fighters' models carry.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { leapAt, apexOf, LEAP_CLIPS } from '../src/render/leap.js';
import { SKILLS } from '../src/sim/skills.js';
import { LEAP_SETTLE } from '../src/sim/battle.js';

const A = SKILLS.fighter.find((q) => q.id === 'vault'), L = (o) => ({ wind: A.crouch, air: A.air, crouchT: null, airT: null, ...o });

test('the crouch: down into the jump\'s spring through the wind-up, on the floor where he stands', () => {
  const a = leapAt(L({ crouchT: 0 }), 4), b = leapAt(L({ crouchT: A.crouch }), 4);
  assert.equal(a.phase, 'crouch'); assert.equal(a.lift, 0); assert.equal(a.g, 0); assert.equal(a.pose.clip, 'Jump_Start');
  assert.ok(b.pose.t > a.pose.t, 'lower as it goes'); assert.equal(leapAt(L({ crouchT: A.crouch + 1 }), 4), null, 'a takeoff that never came: over');
});
test('the flight: off the floor and back, highest in the middle, the ground covered and the top hung over', () => {
  const at = (p) => leapAt(L({ airT: p * A.air }), 5);
  assert.ok(at(0).lift < 0.01 && at(0.999).lift < 0.05, 'from the floor to the floor');
  const top = at(0.5); assert.ok(Math.abs(top.lift - apexOf(5)) < 1e-9, 'the apex at the middle'); assert.ok(apexOf(5) > apexOf(3), 'higher the further');
  let g0 = -1; for (let p = 0; p < 1; p += 0.05) { const g = at(p).g; assert.ok(g >= g0, 'always on toward it'); g0 = g; }
  const slow = at(0.55).g - at(0.45).g, fast = at(0.1).g - at(0).g; assert.ok(slow < fast, `slower over the top (${slow.toFixed(3)} against ${fast.toFixed(3)})`);
});
test('the blow: the sword up over his head in the air, coming down to strike as he lands, the legs from the jump', () => {
  const at = (p) => leapAt(L({ airT: p * A.air }), 5).pose;
  assert.equal(at(0.05).clip, 'Jump_Start', 'the spring');
  const up = at(0.6); assert.equal(up.clip, '2H_Melee_Attack_Chop'); assert.equal(up.legs.clip, 'Jump_Idle');
  assert.ok(at(0.99).t > up.t, 'coming down'); assert.equal(at(0.99).legs.clip, 'Jump_Land', 'the legs taking the floor');
  const land = leapAt(L({ airT: A.air }), 5); assert.equal(land.phase, 'land'); assert.equal(land.lift, 0); assert.ok(Math.abs(land.pose.t - 0.44) < 1e-9, 'the chop at its strike as he touches down');
  assert.equal(leapAt(L({ airT: A.air + LEAP_SETTLE + 0.25 }), 5), null, 'over once he\'s back on his feet');
});
test('every clip it poses, the fighters\' models carry (cast.json moves)', () => {
  const cast = JSON.parse(readFileSync(new URL('../assets/models/cast.json', import.meta.url), 'utf8'));
  for (const a of ['hero_knight', 'hero_barbarian']) assert.deepEqual(cast.actors[a].moves, LEAP_CLIPS, a);
  const seen = new Set(); for (let s = 0; s < A.crouch; s += 0.05) seen.add(leapAt(L({ crouchT: s }), 4).pose.clip);
  for (let s = 0; s < A.air + LEAP_SETTLE; s += 0.02) { const q = leapAt(L({ airT: s }), 4).pose; seen.add(q.clip); if (q.legs) seen.add(q.legs.clip); }
  for (const c of seen) assert.ok(LEAP_CLIPS.includes(c), c);
});
