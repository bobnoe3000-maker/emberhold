// The time of day's light (GDD §10.1, render/daylight.js): one look per part of the sim's day, blended
// across each boundary with no jump; dusk is exactly the old fixed outdoor look; night is darker than
// day but keeps some light; the curve allocates nothing a frame; a hold (the title, ?dev&tod=) is a time.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { skyAt, makeSky, LOOKS, PART_IDS, PART_NAMES, BLEND_S, holdT } from '../src/render/daylight.js';
import { DAY_S } from '../src/sim/heroes.js';
import { PART_S, PARTS, partOf } from '../src/sim/npcs.js';

const flat = (s) => [...s.sun, ...s.amb, s.win, s.lamp, s.wisp, s.bloom, s.lift, s.vig, s.haze, s.sat];
const lum = (s) => (s.sun[0] + s.sun[1] + s.sun[2]) * 0.5 + (s.amb[0] + s.amb[1] + s.amb[2]);   // the sun lights a lit face about half the time

test('each part holds its own look, in the sim\'s order (partOf: dawn, day, dusk, night)', () => {
  assert.equal(PARTS, 4); assert.deepEqual(PART_IDS, ['dawn', 'day', 'dusk', 'night']); assert.deepEqual(PART_NAMES, ['Dawn', 'Day', 'Dusk', 'Night']);
  for (let p = 0; p < 4; p++) {
    const mid = (p + 0.5) * PART_S; assert.equal(partOf(mid), p);
    assert.deepEqual(flat(skyAt(mid)).map((v) => +v.toFixed(6)), flat(LOOKS[PART_IDS[p]]));
    assert.deepEqual(flat(skyAt(mid + 3 * DAY_S)).map((v) => +v.toFixed(6)), flat(LOOKS[PART_IDS[p]]), 'the same every day');
  }
});

test('the light never jumps: one second moves no value more than a blend step allows, across a whole day', () => {
  const a = makeSky(), b = makeSky();
  let worst = 0;
  for (let t = 0; t < DAY_S; t += 1) {
    skyAt(t, a); skyAt(t + 1, b);
    const fa = flat(a), fb = flat(b); for (let i = 0; i < fa.length; i++) worst = Math.max(worst, Math.abs(fa[i] - fb[i]));
  }
  // the largest swing between two looks is the window glow (0.12 → 1.3); smoothstep's steepest slope is 1.5 / BLEND_S
  assert.ok(worst <= 1.3 * 1.5 / BLEND_S + 1e-9, `worst step ${worst.toFixed(4)} a second`);
  const edge = PART_S, half = flat(skyAt(edge)), want = flat(LOOKS.dawn).map((v, i) => (v + flat(LOOKS.day)[i]) / 2);
  assert.deepEqual(half.map((v) => +v.toFixed(6)), want.map((v) => +v.toFixed(6)), 'halfway between dawn and day as day begins');
});

test('dusk is the old fixed outdoor look; night is darker than day but not black; windows burn at night, not by day', () => {
  assert.deepEqual(LOOKS.dusk.sun, [0.78, 0.55, 0.40]); assert.deepEqual(LOOKS.dusk.amb, [0.31, 0.29, 0.44]);
  assert.deepEqual([LOOKS.dusk.win, LOOKS.dusk.lamp, LOOKS.dusk.wisp, LOOKS.dusk.bloom, LOOKS.dusk.lift], [1, 1, 1, 1, 0]);
  const r = lum(LOOKS.night) / lum(LOOKS.day);
  assert.ok(r > 0.35 && r < 0.6, `night at ${(100 * r).toFixed(0)} % of day`);
  assert.ok(lum(LOOKS.dawn) > lum(LOOKS.dusk) && lum(LOOKS.dawn) < lum(LOOKS.day), 'dawn between dusk and day');
  assert.ok(LOOKS.day.win < 0.25 && LOOKS.night.win > 1 && LOOKS.night.wisp > 1 && LOOKS.day.lift > LOOKS.night.lift);
});

test('skyAt writes into the Sky it is given (nothing allocated a frame); a hold is a time of day', () => {
  const s = makeSky(); assert.equal(skyAt(1234, s), s);
  assert.equal(holdT('dusk'), 2.5 * PART_S); assert.equal(holdT('night'), 3.5 * PART_S); assert.equal(holdT(0.5), DAY_S / 2);
  assert.equal(holdT(null), null); assert.equal(holdT(''), null); assert.equal(holdT('noon'), null);
});
