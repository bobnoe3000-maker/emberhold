// Sound (docs/sound-plan.md; the owner, 2026-10-03): what the game sounds like is a pure mapping (audio/cues.js),
// the player's settings are kept whole and per device (audio/settings.js), every cue names a file that exists, and the
// animator flags a footfall on the foot (twice a cycle, at the contact) and a swing once, as it starts.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, statSync } from 'node:fs';
import { voiceOf, familyOf, swingOf, stepOf, eventCue, ambienceFor, RIVER_REACH } from '../src/audio/cues.js';
import { cleanSettings, loadSettings, saveSettings, DEFAULTS, SOUND_KEY } from '../src/audio/settings.js';
import { masterGain } from '../src/audio/engine.js';
import { createAnimator } from '../src/render/anim.js';

const bank = JSON.parse(readFileSync(new URL('../assets/audio/bank.json', import.meta.url), 'utf8'));
const has = (c) => c && Array.isArray(bank.shots[c.cue]) && bank.shots[c.cue].length > 0;

test('settings start moderate with everything on, and come back whole whatever was stored', () => {
  assert.deepEqual(cleanSettings(null), { ...DEFAULTS });
  assert.equal(DEFAULTS.volume, 0.6);
  assert.deepEqual(cleanSettings({ volume: 3, ambient: false, combat: 'yes', steps: 0 }), { volume: 1, ambient: false, combat: true, steps: true, voices: true });
  assert.equal(cleanSettings({ volume: -1 }).volume, 0);
  const box = new Map(), store = { getItem: (k) => box.get(k) ?? null, setItem: (k, v) => box.set(k, v) };
  saveSettings({ ...DEFAULTS, ambient: false, volume: 0.25 }, store);
  assert.deepEqual(loadSettings(store), { volume: 0.25, ambient: false, combat: true, steps: true, voices: true });
  box.set(SOUND_KEY, '{not json'); assert.deepEqual(loadSettings(store), { ...DEFAULTS });
  assert.ok(masterGain(0.6) > 0.3 && masterGain(0.6) < 0.6, 'the default volume is moderate'); assert.equal(masterGain(0), 0); assert.equal(masterGain(1), 1);
});

test('every foe cries on arrival, flinches and dies in its family’s voice, pitched to its size; every cue exists', () => {
  const kinds = ['goblin', 'archer', 'bruiser', 'hexer', 'goblin_chief', 'minion', 'warrior', 'rogue', 'mage', 'standard', 'cutthroat', 'brute', 'crossbow', 'redhand_captain', 'acolyte', 'robed_stranger'];
  for (const k of kinds) for (const w of ['cry', 'hurt', 'die']) { const c = voiceOf(k, w); assert.ok(has(c), `${k} ${w}: ${c.cue}`); assert.equal(c.bus, 'voices'); }
  assert.equal(voiceOf('goblin', 'cry').cue, 'gob_cry'); assert.equal(voiceOf('minion', 'cry').cue, 'bone_rise'); assert.equal(voiceOf('cutthroat', 'cry').cue, 'man_cry');
  assert.ok(voiceOf('bruiser', 'cry').rate < voiceOf('goblin', 'cry').rate, 'the bruiser’s “hah!” is lower than the skirmisher’s screech');
  assert.ok(voiceOf('goblin_chief', 'cry').rate < voiceOf('bruiser', 'cry').rate, 'Old Skarn is lower still');
  assert.equal(familyOf('archer'), 'gob'); assert.equal(familyOf('rogue'), 'bone');
});

test('swings by weapon and school, steps by ground and weight, events by kind: all on their buses, all present', () => {
  assert.equal(swingOf('hero_rogue_bow').cue, 'bow'); assert.equal(swingOf('redhand_crossbow').cue, 'bow'); assert.ok(swingOf('redhand_crossbow').rate < 1);
  assert.equal(swingOf('hero_mage').cue, 'fire'); assert.equal(swingOf('hero_shaman').cue, 'spirit'); assert.equal(swingOf('goblin_hexer').cue, 'hex');
  assert.equal(swingOf('hero_knight').cue, 'swing'); assert.ok(swingOf('goblin_bruiser').rate < swingOf('hero_knight').rate);
  for (const a of ['hero_knight', 'hero_rogue_bow', 'hero_mage', 'hero_shaman', 'goblin_hexer', 'goblin_skirmisher', 'skeleton_mage', 'cinder_acolyte']) { assert.ok(has(swingOf(a)), a); assert.equal(swingOf(a).bus, 'combat'); }
  assert.equal(stepOf('grass', false).cue, 'step_cloth'); assert.equal(stepOf('dirt', false).cue, 'step_leather'); assert.equal(stepOf('soil', true).cue, 'step_echo');
  assert.ok(stepOf('grass', false, 'goblin_skirmisher').rate > stepOf('grass', false, 'hero_knight').rate, 'goblins patter');
  for (const [m, d] of [['grass', false], ['dirt', false], ['cobble', false], ['bank', false], ['field', false], ['soil', true], ['bone', true], ['flesh', true], ['basalt', true]]) { assert.ok(has(stepOf(m, d)), m); assert.equal(stepOf(m, d).bus, 'steps'); }
  for (const [n, ev] of [['combat', { t: 'heal' }], ['combat', { t: 'ward' }], ['combat', { t: 'guard' }], ['combat', { t: 'ability' }], ['combat', { t: 'hex' }], ['levelUp', {}], ['loot', {}], ['chestOpened', {}], ['descend', {}], ['traded', {}]]) {
    const c = eventCue(n, ev); assert.ok(has(c), `${n} ${ev.t || ''}`); assert.equal(c.bus, 'combat'); }
  assert.equal(eventCue('combat', { t: 'hit' }), null, 'a hit is the listener’s: it needs who was hit');
});

test('ambience: the creek louder the nearer it runs, silent out of reach; birds by day, owls by night; the dungeons drip', () => {
  const at = (d, part = 1, kind = 'overland') => ambienceFor({ kind, part, waterD: d });
  assert.ok(at(1).amb_river > at(6).amb_river && at(6).amb_river > at(12).amb_river && at(12).amb_river > 0);
  assert.equal(at(RIVER_REACH).amb_river, 0); assert.equal(at(Infinity).amb_river, 0);
  assert.ok(at(Infinity, 1).amb_birds > 0 && at(Infinity, 1).amb_owl === 0); assert.ok(at(Infinity, 3).amb_owl > 0 && at(Infinity, 3).amb_birds === 0);
  const warren = ambienceFor({ kind: 'dungeon', theme: 'warren', part: 1, waterD: Infinity }), mill = ambienceFor({ kind: 'dungeon', theme: 'desert', part: 1, waterD: Infinity });
  assert.ok(warren.amb_drips > mill.amb_drips && warren.amb_fire > 0 && warren.amb_birds === 0 && warren.amb_river === 0);
  for (const k of Object.keys(warren)) assert.ok(bank.loops[k], k);
});

test('the sound fits its budget: every file in the bank is there, ≤ 750 KB in all', () => {
  let bytes = 0;
  for (const list of Object.values(bank.shots)) for (const v of list) bytes += statSync(new URL(`../assets/audio/${v.f}`, import.meta.url)).size;
  for (const v of Object.values(bank.loops)) bytes += statSync(new URL(`../assets/audio/${v.f}`, import.meta.url)).size;
  assert.ok(bytes < 750 * 1024, `${(bytes / 1024).toFixed(0)} KB`);
});

test('the animator flags a foot coming down twice a cycle, at the contacts, and a swing once, as it begins', () => {
  const pick = createAnimator(), clips = { idle: { start: 0, len: 8, fps: 7 }, walk: { start: 8, len: 10, fps: 10 }, attack: { start: 18, len: 7, fps: 16, impact: 3 } };
  const atlas = { meta: { clips } }, u = { atkN: 0 }, stride = 2, v = 0.05;   // 0.05 tiles a frame: 40 frames a cycle
  let x = 0, steps = 0; const frames = [];
  pick(u, atlas, { now: 0, x, y: 0, moving: true, stride });
  for (let i = 1; i <= 400; i++) { x += v; const a = pick(u, atlas, { now: i * 16, x, y: 0, moving: true, stride }); if (a.step) { steps++; frames.push(a.frame - clips.walk.start); } }
  assert.equal(steps, 20, '10 cycles, 2 steps each');
  for (const f of frames) assert.ok(f === 4 || f === 9, `a step lands on frame ${f} (the contacts are 4 and 9)`);
  u.atkN = 1; const s1 = pick(u, atlas, { now: 7000, x, y: 0, moving: false, stride }), s2 = pick(u, atlas, { now: 7016, x, y: 0, moving: false, stride });
  assert.ok(s1.swing && !s2.swing);
});
