// Sound (docs/sound-plan.md; the owner, 2026-10-03): what the game sounds like is a pure mapping (audio/cues.js),
// the player's settings are kept whole and per device (audio/settings.js), every cue names a file that exists, and the
// animator flags a footfall on the foot (twice a cycle, at the contact) and a swing once, as it starts.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, statSync } from 'node:fs';
import { voiceOf, familyOf, swingOf, stepOf, eventCue, ambienceFor, dripGap, dripOf, DRIP_MIN, callsFor, callGap, callOf, CALL_MIN, RIVER_REACH } from '../src/audio/cues.js';
import { cleanSettings, loadSettings, saveSettings, soundSettings, setSoundSettings, onSoundSettings, DEFAULTS, SOUND_KEY } from '../src/audio/settings.js';
import { masterGain, musicLevel } from '../src/audio/engine.js';
import { createAnimator } from '../src/render/anim.js';

const bank = JSON.parse(readFileSync(new URL('../assets/audio/bank.json', import.meta.url), 'utf8'));
const has = (c) => c && Array.isArray(bank.shots[c.cue]) && bank.shots[c.cue].length > 0;

test('settings start moderate, footsteps at a quarter, a level for each kind of sound and the music; old switches and garbage come back whole', () => {
  assert.deepEqual(cleanSettings(null), { ...DEFAULTS });
  assert.equal(DEFAULTS.volume, 0.6); assert.equal(DEFAULTS.steps, 0.25, 'footsteps at 25 % of their level before the sliders (the owner)');
  for (const k of ['music', 'ambient', 'combat', 'voices']) assert.equal(DEFAULTS[k], 1, `${k} as mixed`);
  assert.deepEqual(cleanSettings({ volume: 3, music: -2, ambient: 0.4, combat: 'yes', steps: NaN }), { volume: 1, music: 0, ambient: 0.4, combat: 1, steps: 0.25, voices: 1 });
  // the switches before the sliders: on is the default level (so footsteps that were on are now a quarter), off is 0
  assert.deepEqual(cleanSettings({ volume: 0.5, ambient: false, combat: true, steps: true, voices: false }), { volume: 0.5, music: 1, ambient: 0, combat: 1, steps: 0.25, voices: 0 });
  const box = new Map(), store = { getItem: (k) => box.get(k) ?? null, setItem: (k, v) => box.set(k, v) };
  saveSettings({ ...DEFAULTS, ambient: 0.3, volume: 0.25 }, store);
  assert.deepEqual(loadSettings(store), { ...DEFAULTS, ambient: 0.3, volume: 0.25 });
  box.set(SOUND_KEY, '{not json'); assert.deepEqual(loadSettings(store), { ...DEFAULTS });
  box.set(SOUND_KEY, JSON.stringify({ volume: 0.6, ambient: true })); box.set('emberfall.music', 'off'); assert.equal(loadSettings(store).music, 0, 'the intro’s old ♪ off carries over');
  assert.ok(masterGain(0.6) > 0.3 && masterGain(0.6) < 0.6, 'the default volume is moderate'); assert.equal(masterGain(0), 0); assert.equal(masterGain(1), 1);
  assert.equal(musicLevel({ ...DEFAULTS }), 1, 'the music as it was made, at the defaults');
  assert.ok(musicLevel({ ...DEFAULTS, volume: 0.3 }) < 0.5 && musicLevel({ ...DEFAULTS, music: 0.5 }) === 0.5 && musicLevel({ ...DEFAULTS, volume: 1 }) === 1, 'under the volume, never over its own level');
});

test('one copy of the settings for the page: a change is kept and every reader hears it', () => {
  const heard = []; const stop = onSoundSettings((st) => heard.push(st.music));
  const before = soundSettings().music; setSoundSettings({ music: 0.4 }); setSoundSettings({ music: before }); stop(); setSoundSettings({ music: 0.7 });
  assert.deepEqual(heard, [0.4, before]); assert.equal(soundSettings().music, 0.7);
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

test('ambience: the creek louder the nearer it runs, silent out of reach; rain and wind by the weather; the dungeons’ draught', () => {
  const at = (d, kind = 'overland') => ambienceFor({ kind, part: 1, waterD: d });
  assert.ok(at(1).amb_river > at(6).amb_river && at(6).amb_river > at(12).amb_river && at(12).amb_river > 0);
  assert.equal(at(RIVER_REACH).amb_river, 0); assert.equal(at(Infinity).amb_river, 0);
  const warren = ambienceFor({ kind: 'dungeon', theme: 'warren', part: 1, waterD: Infinity }), mill = ambienceFor({ kind: 'dungeon', theme: 'desert', part: 1, waterD: Infinity });
  assert.ok(warren.amb_cave > mill.amb_cave && warren.amb_fire > 0 && warren.amb_river === 0);
  for (const k of Object.keys(warren)) assert.ok(bank.loops[k] || k.startsWith('syn_'), k);   // (syn_: made by the engine)
  assert.ok(ambienceFor({ kind: 'overland', waterD: Infinity, weather: { kind: 'rain', k: 1 } }).syn_rain > 0, 'rain hisses');
  assert.ok(ambienceFor({ kind: 'overland', waterD: Infinity, weather: { kind: 'snow', k: 1 } }).amb_wind > 0, 'a soft wind over the snow');
  assert.ok(ambienceFor({ kind: 'overland', waterD: Infinity, weather: { kind: 'wind', k: 1 } }).amb_wind > 0.5, 'a windy day blows');
  assert.equal(ambienceFor({ kind: 'dungeon', theme: 'warren', waterD: Infinity, weather: { kind: 'rain', k: 1 } }).syn_rain, 0, 'no rain underground');
  assert.ok(!('amb_birds' in at(Infinity)) && !bank.loops.amb_birds && !bank.loops.amb_owl && !bank.loops.amb_drips, 'the birds, the owl and the drips are calls now, not loops');
});

test('calls: a drip, a bird, an owl, each single and never closer than 10 s (the owner), fewer where it’s quieter', () => {
  assert.ok(CALL_MIN >= 10 && DRIP_MIN === CALL_MIN);
  // the drips: wetter places nearer the minimum, the mill seldom
  for (const th of [null, 'warren', 'poison', 'desert', 'dread', 'chasm']) for (let r = 0; r <= 1; r += 0.05) assert.ok(dripGap(th, r) >= CALL_MIN, `${th} ${r}`);
  assert.ok(dripGap('desert', 0) > dripGap('warren', 1) - 1 && dripGap('warren', 0.5) < dripGap(null, 0.5));
  // birds by day, the owl by night; in the dungeons only the drips
  const c = (part, o = {}) => callsFor({ kind: 'overland', part, ...o });
  assert.ok(c(1).bird > 0 && c(1).owl === 0 && c(1).drip === 0); assert.ok(c(3).owl > 0 && c(3).bird === 0); assert.ok(c(2).bird > 0 && c(2).owl > 0, 'dusk has both');
  assert.deepEqual(callsFor({ kind: 'dungeon', part: 1 }), { drip: 1, bird: 0, owl: 0 });
  assert.ok(c(1, { weather: { kind: 'rain', k: 1 } }).bird < c(1).bird * 0.3, 'the birds go quiet in the rain');
  assert.ok(c(1, { weather: { kind: 'wind', k: 1 } }).bird < c(1).bird && c(1, { weather: { kind: 'wind', k: 1 } }).bird > 0, 'and fewer in the wind');
  assert.ok(callsFor({ kind: 'town', part: 1 }).bird < c(1).bird, 'fewer in town');
  for (const name of ['bird', 'owl', 'drip']) for (const lv of [0.03, 0.1, 0.3, 0.55, 1]) for (let r = 0; r <= 1; r += 0.1) assert.ok(callGap(name, lv, null, r) >= CALL_MIN, `${name} ${lv} ${r}`);
  assert.ok(callGap('bird', 0.1, null, 0.5) > callGap('bird', 0.55, null, 0.5), 'a hushed bird calls seldom');
  for (const name of ['bird', 'owl', 'drip']) { const q = callOf(name, 0.5, 0.3); assert.ok(has(q), name); assert.equal(q.bus, 'ambient'); }
  assert.ok(has(dripOf(0.3)));
});

test('the sound fits its budget: every file in the bank is there, ≤ 800 KB in all (750 until the wind came; 622 since the birds, the owl and the drips became single calls)', () => {
  let bytes = 0;
  for (const list of Object.values(bank.shots)) for (const v of list) bytes += statSync(new URL(`../assets/audio/${v.f}`, import.meta.url)).size;
  for (const v of Object.values(bank.loops)) bytes += statSync(new URL(`../assets/audio/${v.f}`, import.meta.url)).size;
  assert.ok(bytes < 800 * 1024, `${(bytes / 1024).toFixed(0)} KB`);
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
