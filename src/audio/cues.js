// @ts-check
// cues.js — what the game sounds like, as pure functions of what happened (docs/sound-plan.md §4). No WebAudio here:
// node:test checks the mapping (test/audio.test.mjs), and engine.js plays what these return. A cue is a name in
// assets/audio/bank.json (tools/audio/sounds.json), with a playback rate (the same goblin's cry, pitched, is a bruiser's
// "hah!" or Old Skarn's), a gain and a bus. Buses are what the player turns on and off (audio/settings.js):
//   ambient · combat (attacks, spells, blows and the effects of play) · steps · voices (foes arriving and falling)

/** @typedef {{ cue: string, bus: 'ambient' | 'combat' | 'steps' | 'voices', rate?: number, gain?: number }} Cue */

// ── voices: who cries out when they arrive, flinch and fall ──────────────────────────────────────────────────────────
// family: gob (the hill goblins), bone (the Ashbound: they rise rattling and moaning), man (the Redhand, Garrow),
// cult (the Cinder Cult: a rasp, not a shout). rate pitches a family's samples to the figure: small is high.
/** @type {Record<string, { fam: string, rate: number, cry?: string }>} */
const VOICE = {
  goblin: { fam: 'gob', rate: 1.18 }, archer: { fam: 'gob', rate: 1.24 }, bruiser: { fam: 'gob', rate: 0.86 }, hexer: { fam: 'gob', rate: 1.1, cry: 'cult_cry' },
  goblin_chief: { fam: 'gob', rate: 0.72 },
  minion: { fam: 'bone', rate: 1.08 }, warrior: { fam: 'bone', rate: 0.9 }, rogue: { fam: 'bone', rate: 1.04 }, mage: { fam: 'bone', rate: 1.12 }, standard: { fam: 'bone', rate: 0.7 },
  cutthroat: { fam: 'man', rate: 1.06 }, brute: { fam: 'man', rate: 0.86 }, crossbow: { fam: 'man', rate: 1 }, redhand_captain: { fam: 'man', rate: 0.8 },
  acolyte: { fam: 'cult', rate: 1.1 }, robed_stranger: { fam: 'cult', rate: 0.8 },
  fenghoul: { fam: 'gob', rate: 0.7 }, reedcutter: { fam: 'man', rate: 0.9 }, fowler: { fam: 'man', rate: 1.04 }, bogwitch: { fam: 'cult', rate: 1.3 },   // (M8) the Fens'
  harvester: { fam: 'cult', rate: 0.92 }, drowned: { fam: 'bone', rate: 0.96 }, cantor: { fam: 'bone', rate: 1.02, cry: 'cult_cry' },
  toadking: { fam: 'man', rate: 0.7 }, teague: { fam: 'cult', rate: 0.86 }, drowned_choir: { fam: 'bone', rate: 0.9, cry: 'cult_cry' }, abbess_below: { fam: 'bone', rate: 0.74, cry: 'cult_cry' },   // (M8.6) the Fens' bosses
  // the Mere Tower's wardens (sim tower.js): pitched low, as the bosses are
  warden_doorward: { fam: 'man', rate: 0.78 }, warden_mudlark: { fam: 'gob', rate: 0.66 }, warden_bellringer: { fam: 'bone', rate: 0.8, cry: 'cult_cry' }, warden_lensman: { fam: 'man', rate: 0.9 },
  warden_hush: { fam: 'bone', rate: 0.84 }, warden_twins: { fam: 'man', rate: 0.82 }, warden_hound: { fam: 'gob', rate: 0.6 }, warden_gatherer: { fam: 'cult', rate: 0.8 },
  warden_watcher: { fam: 'bone', rate: 0.86 }, warden_starroom: { fam: 'bone', rate: 0.68 },
};
const FAM = { gob: { cry: 'gob_cry', hurt: 'gob_hurt', die: 'gob_die' }, bone: { cry: 'bone_rise', hurt: 'bone_hurt', die: 'bone_die' },
  man: { cry: 'man_cry', hurt: 'man_hurt', die: 'man_die' }, cult: { cry: 'cult_cry', hurt: 'man_hurt', die: 'man_die' } };

/** a foe's cry as it arrives, its flinch, its death, by its kind (battle.js ENEMIES and the bosses)
 * @param {string} kind @param {'cry' | 'hurt' | 'die'} what @returns {Cue} */
export function voiceOf(kind, what) {
  const v = VOICE[kind] || VOICE.minion, f = FAM[v.fam];
  const cue = what === 'cry' && v.cry ? v.cry : f[what];
  return { cue, bus: 'voices', rate: v.rate, gain: what === 'hurt' ? 0.55 : what === 'cry' && VOICE[kind] && /chief|captain|stranger|standard|warden_|toadking|teague|choir|abbess/.test(kind) ? 1.15 : 1 };
}
/** the family a kind belongs to (one cry per family per wave) @param {string} kind */
export const familyOf = (kind) => (VOICE[kind] || VOICE.minion).fam;

// ── swings: by what's drawn swinging (the atlas name says the weapon or the school) ──────────────────────────────────
/** @param {string} atlas the actor atlas (hero_mage, goblin_archer, skeleton_rogue, …) @returns {Cue} */
export function swingOf(atlas) {
  const a = atlas || '';
  if (/crossbow|fowler/.test(a)) return { cue: 'bow', bus: 'combat', rate: 0.8, gain: 0.8 };
  if (/_bow|archer|skeleton_rogue/.test(a)) return { cue: 'bow', bus: 'combat', rate: 1, gain: 0.75 };
  if (/hero_mage|skeleton_mage|acolyte|boss_stranger|cantor|boss_choir|boss_abbess/.test(a)) return { cue: 'fire', bus: 'combat', rate: 1, gain: 0.7 };
  if (/shaman|bog_witch/.test(a)) return { cue: 'spirit', bus: 'combat', rate: 1.1, gain: 0.6 };
  if (/hexer/.test(a)) return { cue: 'hex', bus: 'combat', rate: 1.2, gain: 0.6 };
  const heavy = /brute|bruiser|garrow|skarn|warrior|barbarian|standard|reed_cutter|harvester|toadking|teague/.test(a);
  return { cue: 'swing', bus: 'combat', rate: heavy ? 0.82 : /goblin/.test(a) ? 1.2 : 1, gain: heavy ? 0.85 : 0.7 };
}

// ── footsteps: by the ground under the foot, and the figure's weight ────────────────────────────────────────────────
// outdoors (outdoor.js G_MAT): grass, dirt, cobble, water, bank, field. In a dungeon every floor rings in the rock:
// the echo step, brittle on bone, soft on flesh and in the poison.
/** @param {string} material @param {boolean} dungeon @param {string} [atlas] @returns {Cue} */
export function stepOf(material, dungeon, atlas = '') {
  let cue = 'step_cloth', rate = 1, gain = 0.8;
  if (dungeon) { cue = 'step_echo'; if (material === 'bone') rate = 1.2; else if (material === 'flesh' || material === 'poison') rate = 0.82; }
  else if (material === 'dirt') cue = 'step_leather';
  else if (material === 'cobble') { cue = 'step_leather'; rate = 1.16; gain = 0.9; }
  else if (material === 'bank' || material === 'water') { rate = 0.85; gain = 0.9; }
  if (/goblin/.test(atlas)) { rate *= 1.25; gain *= 0.6; }
  else if (/brute|bruiser|garrow|skarn|standard|barbarian/.test(atlas)) { rate *= 0.82; gain *= 1.1; }
  else if (/^skeleton/.test(atlas)) { cue = dungeon ? 'step_echo' : 'step_leather'; rate *= 1.3; gain *= 0.7; }
  return { cue, bus: 'steps', rate, gain };
}

// ── what the sim says happened (sim.bus) ─────────────────────────────────────────────────────────────────────────────
/** a cue for a sim event, or null (`hit`s are the listener's: they need the target's kind)
 * @param {string} name the bus event @param {any} ev its payload @returns {Cue | null} */
export function eventCue(name, ev) {
  if (name === 'combat') {
    switch (ev && ev.t) {
      case 'heal': return { cue: 'heal', bus: 'combat', gain: 0.55 };
      case 'ward': case 'warded': case 'lifeline': return { cue: 'ward', bus: 'combat', gain: 0.6 };
      case 'guard': return { cue: 'guard', bus: 'combat', gain: 0.7 };
      case 'ability': return { cue: 'warcry', bus: 'combat', gain: 0.55 };
      case 'heavy': return { cue: 'swing', bus: 'combat', rate: 0.75, gain: 0.9 };
      case 'hex': return { cue: 'hex', bus: 'combat', gain: 0.6 };
      default: return null;
    }
  }
  if (name === 'levelUp') return { cue: 'levelup', bus: 'combat', gain: 0.8 };
  if (name === 'loot') return { cue: 'loot', bus: 'combat', gain: 0.6 };
  if (name === 'chestOpened') return { cue: 'chest', bus: 'combat', gain: 0.8 };
  if (name === 'descend') return { cue: 'stairs', bus: 'combat', gain: 0.7 };
  if (name === 'traded') return { cue: 'coins', bus: 'combat', gain: 0.7 };
  return null;
}

// ── calls: the sparse sounds, single and never closer than CALL_MIN s apart (the owner, 2026-10-03: "Drip sound should
// have at least 10 sec between each drop", then "same with birds and owls"; the loops they replace dripped 12 times in
// 10 s, and the birds and the owl never stopped). A drip in the dungeons; outdoors a bird by day, an owl at dusk and by
// night, fewer under weather. Wetter places drip nearer the minimum, the mill's dry cellars seldom; a hushed bird calls
// seldom. r: 0..1, the listener's own chance.
export const CALL_MIN = 10, DRIP_MIN = CALL_MIN;
/** seconds until the next drop @param {string | null} theme @param {number} r */
export function dripGap(theme, r) {
  const span = theme === 'desert' ? 20 : theme === 'poison' || theme === 'warren' ? 6 : 12;   // the mill · the chapel's pools, the old mine · the rest
  return DRIP_MIN + (theme === 'desert' ? 6 : 0) + Math.max(0, Math.min(1, r)) * span;
}
/** a drop: one of the cut drips, now nearer, now farther off in the dark @param {number} r @returns {Cue} */
export const dripOf = (r) => ({ cue: 'drip', bus: 'ambient', rate: 0.9 + 0.2 * r, gain: 0.45 + 0.4 * r });

// how lively each call is here and now, 0..1 (0: none). part: the time of day (0 dawn · 1 day · 2 dusk · 3 night).
const BIRDS = [0.55, 0.5, 0.22, 0], OWLS = [0, 0, 0.18, 0.5], FULL = { bird: 0.55, owl: 0.5 }, SPAN = { bird: 10, owl: 14 };
/** @param {{ kind: string, part: number, weather?: { kind: string, k: number } }} w @returns {{ drip: number, bird: number, owl: number }} */
export function callsFor({ kind, part, weather = { kind: 'clear', k: 0 } }) {
  if (kind === 'dungeon') return { drip: 1, bird: 0, owl: 0 };
  let bird = BIRDS[part] ?? 0, owl = OWLS[part] ?? 0;
  if (kind === 'town') { bird *= 0.6; owl *= 0.6; }
  const wk = weather.k || 0, hush = ({ rain: 0.85, snow: 0.7, fog: 0.5, wind: 0.4 })[weather.kind] ?? 0;   // they go quiet under weather
  bird *= 1 - hush * wk; owl *= 1 - hush * 0.6 * wk;
  return { drip: 0, bird: bird < 0.03 ? 0 : bird, owl: owl < 0.03 ? 0 : owl };
}
/** seconds until the next call: the minimum, and longer the quieter its place @param {'drip' | 'bird' | 'owl'} name
 * @param {number} level (callsFor) @param {string | null} theme @param {number} r */
export function callGap(name, level, theme, r) {
  if (name === 'drip') return dripGap(theme, r);
  const q = Math.min(1, Math.max(0.08, level / FULL[name]));
  return CALL_MIN + (Math.max(0, Math.min(1, r)) * SPAN[name]) / q;
}
/** a call: one of its cut variants, a little nearer or farther (and a different bird) each time
 * @param {'drip' | 'bird' | 'owl'} name @param {number} level @param {number} r @returns {Cue} */
export function callOf(name, level, r) {
  if (name === 'drip') return dripOf(r);
  const near = 0.5 + 0.5 * Math.min(1, level / FULL[name]);
  return name === 'bird' ? { cue: 'bird', bus: 'ambient', rate: 0.92 + 0.18 * r, gain: (0.18 + 0.2 * r) * near } : { cue: 'owl', bus: 'ambient', rate: 0.95 + 0.08 * r, gain: (0.16 + 0.14 * r) * near };
}

// ── ambience: the level each loop should sit at, here and now ───────────────────────────────────────────────────────
// waterD: tiles from the view's centre to the nearest river or mill-race tile (Infinity: none near). theme: the dungeon's
// (sites.js), null for the barrows. (The time of day is callsFor's: the birds and the owl.)
export const RIVER_REACH = 14;
// weather: sim/weather.js (outdoors): rain hisses; wind blows; snow brings a soft wind (the birds' and owls' hush under
// it is callsFor's).
/** @param {{ kind: string, theme?: string | null, part?: number, waterD: number, weather?: { kind: string, k: number } }} w @returns {Record<string, number>} */
export function ambienceFor({ kind, theme = null, waterD, weather = { kind: 'clear', k: 0 } }) {
  const out = { amb_river: 0, amb_cave: 0, amb_fire: 0, amb_wind: 0, syn_rain: 0 };
  if (kind === 'dungeon') {
    out.amb_cave = theme === 'desert' ? 0.3 : 0.5;                                                  // the mill's cellars are dry
    if (theme === 'warren') out.amb_fire = 0.3;                                                     // goblin fires down the tunnels
    return out;
  }
  if (waterD < RIVER_REACH) { const k = 1 - waterD / RIVER_REACH; out.amb_river = Math.min(1, k * k * 1.15); }
  const wk = weather.k || 0;
  if (weather.kind === 'rain') out.syn_rain = 0.75 * wk;
  if (weather.kind === 'wind') out.amb_wind = 0.85 * wk;
  if (weather.kind === 'snow') out.amb_wind = 0.35 * wk;                                 // a soft wind over the snow
  return out;
}
