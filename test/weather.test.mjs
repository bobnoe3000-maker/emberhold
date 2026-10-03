// Weather (sim/weather.js; the owner, 2026-10-03: "rain, fog, snow… on longer cycles", "not overly visually
// intrusive"): a pure function of the seed, the clock and the region. The same sky for the same moment; spells of
// 20 minutes or more, mostly fair in the Vale and snowier in the heights; strength that eases, never jumps; and
// nothing underground.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { weatherAt, spellOf, weatherLeft, SPELL_S, RAMP_S } from '../src/sim/weather.js';
import { weatherNow, holdWeather, weatherLight } from '../src/render/weatherfx.js';
import { makeSky, LOOKS, mixSky } from '../src/render/daylight.js';

const SEED = 20260807;

test('the same seed and moment give the same weather; another seed another sky', () => {
  for (const t of [0, 777, 5000, 123456]) assert.deepEqual(weatherAt(SEED, t), weatherAt(SEED, t));
  let differ = 0; for (let n = 0; n < 50; n++) if (spellOf(SEED, n).kind !== spellOf(SEED + 1, n).kind) differ++;
  assert.ok(differ > 10, `${differ} of 50 spells differ`);
});

test('the Vale is mostly fair; the heights snowier and windier; fog, rain and wind all come', () => {
  const count = (region) => { const c = { clear: 0, fog: 0, rain: 0, snow: 0, wind: 0 }; for (let n = 0; n < 3000; n++) c[spellOf(SEED, n, region).kind]++; return c; };
  const vale = count('vale'), heights = count('heights');
  assert.ok(vale.clear / 3000 > 0.38 && vale.clear / 3000 < 0.52, JSON.stringify(vale));
  assert.ok(vale.rain > 500 && vale.fog > 400 && vale.snow > 150 && vale.wind > 150, JSON.stringify(vale));
  assert.ok(heights.snow > vale.snow * 2.5, `heights ${heights.snow} vs vale ${vale.snow}`);
  assert.ok(heights.wind > vale.wind * 1.2 && count('reach').wind > vale.wind * 1.5, 'the open country is windier');
});

test('long cycles: a weather lasts a spell (20 min) or more, and its strength eases in and out, never jumps', () => {
  let run = 0, kind = 'clear', shortest = Infinity, maxStep = 0, prevK = weatherAt(SEED, 0).k;
  for (let t = 0; t < 40 * 3600; t += 1) {
    const w = weatherAt(SEED, t);
    maxStep = Math.max(maxStep, Math.abs(w.k - prevK)); prevK = w.k;
    if (t % 60) continue;
    const k = spellOf(SEED, Math.floor(t / SPELL_S)).kind;
    if (k !== kind) { if (kind !== 'clear' && run) shortest = Math.min(shortest, run); kind = k; run = 0; }
    run += 60;
  }
  assert.ok(shortest >= SPELL_S, `shortest weather ${shortest} s`);
  assert.ok(maxStep < 0.01, `strength moved ${maxStep.toFixed(4)} in a second (a ${RAMP_S} s ease)`);
  for (let t = 0; t < 10 * 3600; t += 97) { const w = weatherAt(SEED, t), left = weatherLeft(SEED, t); assert.equal(left > 0, w.kind !== 'clear'); if (left) assert.ok(left <= 13 * SPELL_S); }
});

test('nothing underground; a dev hold wins; the light loses at most a third at full strength', () => {
  const sim = (kind, t) => ({ seed: SEED, state: { t }, world: { kind, region: 'vale' } });
  let wet = -1; for (let t = 0; t < 20 * 3600 && wet < 0; t += 600) if (weatherAt(SEED, t).k > 0.5) wet = t;
  assert.ok(wet >= 0);
  assert.equal(weatherNow(sim('dungeon', wet)).k, 0); assert.ok(weatherNow(sim('overland', wet)).k > 0.5);
  holdWeather('fog:0.4'); assert.deepEqual(weatherNow(sim('dungeon', 0)), { kind: 'fog', k: 0.4 }); holdWeather(null);
  for (const kind of ['rain', 'fog', 'snow']) {
    const sky = mixSky(makeSky(), LOOKS.day, LOOKS.day, 0), sun0 = sky.sun[0]; weatherLight(sky, { kind, k: 1 });
    assert.ok(sky.sun[0] >= sun0 * 0.66 && sky.sun[0] < sun0, `${kind}: sun ${sun0} → ${sky.sun[0].toFixed(2)}`);
  }
  const windy = mixSky(makeSky(), LOOKS.day, LOOKS.day, 0), haze0 = windy.haze, sun0 = windy.sun[0]; weatherLight(windy, { kind: 'wind', k: 1 });
  assert.ok(windy.haze < haze0 && windy.sun[0] === sun0, 'the wind clears the air and keeps the sun');
});
