// The intro, "The Chronicle of the Fall" (development plan §2.1): its content agrees with the code
// that plays it (scenes, cues, chimes), keeps the approved shape (six cards; the Fall's music
// unbroken through the Long Dim and Year 301; the closing line), and the voice-leading helper
// resolves the way the score depends on. The player itself is covered by test/browser/run.mjs.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { SCENE_IDS } from '../src/cutscene/scenes.js';
import { CUES, CHIMES, nearest } from '../src/cutscene/score.js';

const json = (f) => JSON.parse(readFileSync(new URL(`../content/${f}`, import.meta.url), 'utf8'));
const intro = json('cutscenes/intro.json'), schema = json('schema/cutscenes.schema.json'), tips = json('tips.json').tips;
const card = schema.properties.cards.items.properties;

test('the schema lists exactly the scenes and cues the code has', () => {
  assert.deepEqual([...card.scene.enum].sort(), [...SCENE_IDS].sort());
  assert.deepEqual([...card.music.enum].sort(), CUES.filter((c) => c !== 'loading').sort());
});

test('the intro: six cards, a scene and a cue each, every chime on a real card', () => {
  assert.equal(intro.cards.length, 6);
  for (const c of intro.cards) { assert.ok(SCENE_IDS.includes(c.scene), c.id); assert.ok(CUES.includes(c.music), c.id); }
  const ids = intro.cards.map((c) => c.id);
  for (const k of Object.keys(CHIMES)) assert.ok(ids.includes(k), `chime for unknown card ${k}`);
  assert.ok(!CHIMES.fall, 'the Fall has no chime: the gong is its transition');
});

test("the Fall's music carries through the Long Dim and Year 301; Thornwick closes on the new lines", () => {
  assert.deepEqual(intro.cards.map((c) => c.music), ['kindling', 'empire', 'fall', 'fall', 'fall', 'thornwick']);
  const last = intro.cards.at(-1);
  assert.equal(last.body.at(-1), 'The heroes of this age are not available…');
  assert.equal(last.lead, 'Looks like it is up to you.');
  assert.ok(!/You got Emberfall|off saving kingdoms/.test(JSON.stringify(intro)));
});

test('loading tips: lore lines carry a source, one-liners do not claim one', () => {
  assert.ok(tips.length >= 4);
  assert.ok(tips.some((t) => t.source) && tips.some((t) => !t.source), 'lore and one-liners alternate');
});

test('voice-leading: each voice moves to the nearest note of the next chord', () => {
  const D = [38, 45, 54, 57, 62];                             // D major, as Thornwick enters
  assert.equal(nearest(51, D), 50);                           // the Fall's E♭ falls to D
  assert.equal(nearest(50, D), 50);                           // a shared note stays
  assert.equal(nearest(57, D), 57);
  assert.equal(nearest(53, [34, 46, 53, 58, 62]), 53);        // D minor's F is in B♭
  assert.equal(nearest(56, [50, 54, 57]), 57);                // G♯ to A (one up) before F♯ (two down)
  assert.equal(nearest(52, [48, 56]), 52 - 4);                // equidistant (C and G♯, four each way): the lower
});
