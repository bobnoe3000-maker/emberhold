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
};
const FAM = { gob: { cry: 'gob_cry', hurt: 'gob_hurt', die: 'gob_die' }, bone: { cry: 'bone_rise', hurt: 'bone_hurt', die: 'bone_die' },
  man: { cry: 'man_cry', hurt: 'man_hurt', die: 'man_die' }, cult: { cry: 'cult_cry', hurt: 'man_hurt', die: 'man_die' } };

/** a foe's cry as it arrives, its flinch, its death, by its kind (battle.js ENEMIES and the bosses)
 * @param {string} kind @param {'cry' | 'hurt' | 'die'} what @returns {Cue} */
export function voiceOf(kind, what) {
  const v = VOICE[kind] || VOICE.minion, f = FAM[v.fam];
  const cue = what === 'cry' && v.cry ? v.cry : f[what];
  return { cue, bus: 'voices', rate: v.rate, gain: what === 'hurt' ? 0.55 : what === 'cry' && VOICE[kind] && /chief|captain|stranger|standard/.test(kind) ? 1.15 : 1 };
}
/** the family a kind belongs to (one cry per family per wave) @param {string} kind */
export const familyOf = (kind) => (VOICE[kind] || VOICE.minion).fam;

// ── swings: by what's drawn swinging (the atlas name says the weapon or the school) ──────────────────────────────────
/** @param {string} atlas the actor atlas (hero_mage, goblin_archer, skeleton_rogue, …) @returns {Cue} */
export function swingOf(atlas) {
  const a = atlas || '';
  if (/crossbow/.test(a)) return { cue: 'bow', bus: 'combat', rate: 0.8, gain: 0.8 };
  if (/_bow|archer|skeleton_rogue/.test(a)) return { cue: 'bow', bus: 'combat', rate: 1, gain: 0.75 };
  if (/hero_mage|skeleton_mage|acolyte|boss_stranger/.test(a)) return { cue: 'fire', bus: 'combat', rate: 1, gain: 0.7 };
  if (/shaman/.test(a)) return { cue: 'spirit', bus: 'combat', rate: 1.1, gain: 0.6 };
  if (/hexer/.test(a)) return { cue: 'hex', bus: 'combat', rate: 1.2, gain: 0.6 };
  const heavy = /brute|bruiser|garrow|skarn|warrior|barbarian|standard/.test(a);
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

// ── ambience: the level each loop should sit at, here and now ───────────────────────────────────────────────────────
// waterD: tiles from the view's centre to the nearest river or mill-race tile (Infinity: none near). part: the time of
// day (npcs.js partOf: 0 dawn · 1 day · 2 dusk · 3 night). theme: the dungeon's (sites.js), null for the barrows.
export const RIVER_REACH = 14;
/** @param {{ kind: string, theme?: string | null, part: number, waterD: number }} w @returns {Record<string, number>} */
export function ambienceFor({ kind, theme = null, part, waterD }) {
  const out = { amb_river: 0, amb_birds: 0, amb_owl: 0, amb_drips: 0, amb_cave: 0, amb_fire: 0 };
  if (kind === 'dungeon') {
    out.amb_cave = theme === 'desert' ? 0.3 : 0.5;                                                  // the mill's cellars are dry
    out.amb_drips = theme === 'desert' ? 0.25 : theme === 'poison' ? 0.95 : theme === 'warren' ? 0.85 : 0.7;   // the chapel's pools, the old mine
    if (theme === 'warren') out.amb_fire = 0.3;                                                     // goblin fires down the tunnels
    return out;
  }
  if (waterD < RIVER_REACH) { const k = 1 - waterD / RIVER_REACH; out.amb_river = Math.min(1, k * k * 1.15); }
  out.amb_birds = [0.55, 0.5, 0.22, 0][part] ?? 0;
  out.amb_owl = [0, 0, 0.18, 0.5][part] ?? 0;
  if (kind === 'town') { out.amb_birds *= 0.6; out.amb_owl *= 0.6; }
  return out;
}
