// battle.js — room battles with respawning waves (GDD §3). Headless, deterministic,
// stepped by core.js at 20 Hz.
//
// Enter any dungeon room but the entrance (a sanctuary) and its battle starts: a wave
// spawns away from the party, the party fights on its own, a lull follows each cleared
// wave, then the next wave comes — for as long as you stay. Every room has a fixed
// level (world.roomLevels: deeper from the entrance and deeper floors are harder), and
// its waves never escalate: wave 40 is as hard as wave 1. Enemies are leashed to their
// room. Walk out of the room to end it (the room resets). If the whole party falls,
// you're carried to town.
//
// Control (GDD §3.4): steer the hero and it goes where you say, striking whatever is
// in reach when you stop; let go of the stick for a moment and it fights on its own
// (chasing within the room — it never walks out by itself). Companions always act on
// their own (fighter guards you, rogue hunts the weakest, mage keeps distance and
// casts). Tap an enemy to focus the party on it.
//
// Abilities (skills.js): on its turn a member casts the first ability in its priority order
// that is unlocked, on auto-cast, affordable and worth it under its stance — a guard, heal,
// ward or nova first, else a strike in place of the basic attack. Stances also move the AI:
// Defensive keeps companions near the leader and half the MP in reserve for guards and
// heals; Aggressive lets them chase anything and heals late.
//
// Death (GDD §3.6): 0 HP is Downed; the Downed rise in the lull when the wave is cleared.
// Downed a second time in one room visit, or still Downed when the party walks out, a
// companion is Fallen: a ghost that follows, doesn't fight and earns nothing until a temple
// or a shrine raises it (heroes.js, core.js). The main character is never Fallen. If nobody stands, it's a wipe: the party wakes at the town temple at 30 % HP,
// Fallen cleared, a quarter of the gold gone, and everyone Weakened for 10 minutes.

import { mulberry32, streamSeed } from './rng.js';
import { statsFor, gainXp } from './party.js';
import { boonK } from './shrines.js';
import { TOWER, WARDENS, towerTough, blockFamily, wardenWave, wardenAt, waveGold, towerOf } from './tower.js';
import { abilityMods, shotOf } from './items.js';
import { has, companyMods, healMod, goldMod, sworn, FIGHT, SWORN_RISE } from './companions.js';
import { DAY_S } from './heroes.js';
import { priorityOf, unlocked, autocastOn, rankOf, skillMult, rankCost, stanceOf, hasPassive, HEAL_BONUS, DRAIN_MEND, OLD_WAYS_STACKS } from './skills.js';
import { WEAK_S } from './heroes.js';
import { hypot, sin, cos, exp } from './detmath.js';
import { siteOf, bossAt } from './sites.js';
import { LAMPS, lampOf, CAGE_KINDS, CAGE_PICKUP_S, CAGE_REACH, countOf, credit } from './lamps.js';

// class combat traits (stats are in party.js / the GDD tables; abilities in skills.js)
const CLASS_FIGHT = {
  fighter: { interval: 1.3, range: 3.0, speed: 6.8 },
  rogue:   { interval: 0.9, range: 2.8, speed: 7.5 },
  mage:    { interval: 1.6, range: 7.0,  speed: 6.4, bolt: 'fire' },
  cleric:  { interval: 1.3, range: 3.0, speed: 6.6 },
  shaman:  { interval: 1.5, range: 6.0, speed: 6.5, bolt: 'spirit' },   // (v1.19) a spirit bolt at range; stands off like the mage
};
// A rogue with a bow or crossbow (items.js `shot`) shoots instead of closing in, and backs off what
// comes at them as the mage does. Bows are quick, crossbows hit hard and slow; the longer the reach,
// the slower the shot. Their ATK is the weapon's, so the trade is the reach and the off-hand.
const SHOT = {
  bow:      { interval: 0.95, range: 5.0, bolt: 'arrow', speed: 6.4 },
  longbow:  { interval: 1.1,  range: 6.5, bolt: 'arrow', speed: 6.4 },
  crossbow: { interval: 1.05, range: 5.0, bolt: 'bolt',  keepAway: 2.8, speed: 6.4 },   // the hand crossbow: one hand, the parrying dagger stays
  heavy:    { interval: 1.35, range: 6.0, bolt: 'bolt',  keepAway: 3.2, speed: 6.4 },
};
/** how a party member fights: its class's traits, or its bow's @param {any} m */
export const fightOf = (m) => { const F = CLASS_FIGHT[m.cls], k = m.cls === 'rogue' && shotOf(m); return k ? { ...F, ...SHOT[k] } : F; };
// class bonuses fought out here (GDD §5; the fighter's shield DEF is in party.js):
// the rogue's crits from behind hit BACKSTAB_CRIT harder; the mage's spells deal CLUSTER_ATK
// more to a foe with two or more others within CLUSTER_R; the cleric's heals are HEAL_BONUS stronger
const BACKSTAB_CRIT = 1.25, CLUSTER_ATK = 1.2, CLUSTER_R = 2;
export const ELITE_CINDERS = 1, BOSS_CINDERS = 5;
/** is the attacker in the target's rear half? (a foe faces whoever it's fighting) */
export const behind = (att, tgt) => ((tgt.fx || 0) * (att.x - tgt.x) + (tgt.fy || 0) * (att.y - tgt.y)) < 0;
/** does the target stand in a cluster: two or more other live foes within CLUSTER_R? */
export const clustered = (tgt, foes) => foes.filter((o) => o !== tgt && !o.dead && o.hp > 0 && hypot(o.x - tgt.x, o.y - tgt.y) < CLUSTER_R).length >= 2;
// stance: the HP fraction under which heals / guards go up, and whether MP is held back for them
const STANCE_AI = { aggressive: { low: 0.3, reserve: 0 }, balanced: { low: 0.5, reserve: 0 }, defensive: { low: 0.65, reserve: 0.5 } };
const BENCH_XP = 0.5, WIPE_HP = 0.3, DEF_LEASH = 5;
// a room holds for as long as you stay, so "downed twice in one visit" is measured over a
// stretch: stand through WIND waves in a row and a member's downs are forgotten
const WIND = 1;
// Difficulty (GDD §7.1, 2026-09-30). The ROOM sets the wave, not the party: 2 foes to room level 3,
// then 1 + level / 2 (3 at 4–5, 4 at 6–7, 5 at 8–9 …), up to 7. (Waves had grown with the party,
// 2 / 5 / 7 for one / two / three: each member faced more foes the more companions they had, and
// companions added nothing.) So a lone hero beats level-1 foes, and from level 4 a same-level room
// wants company. Nothing is free inside a room: the waves of one visit rise with a TIDE and the lull
// between them is a short breath, not a full recovery, so a visit ends when you choose to walk out
// (corridors and towns restore you) or when the room wins. Above level 3 foes carry PREMIUM a level
// more, for the party and the gear a same-level room now expects.
export const waveSize = (lvl) => (lvl <= 3 ? 2 : Math.min(7, 1 + Math.floor(lvl / 2)));
export const PREMIUM = 0.05;
// The tide (GDD §7.1): each wave of a visit is `step` tougher than the last (HP and ATK), up to a
// top (`cap`: +100 % in an ordinary room). A wave at the top is followed by one back at the start,
// and the climb begins again: a room cycles, so a party strong enough for its top can farm it for as
// long as it likes, and one that isn't is worn down by the first climb. Special rooms keep their own
// profile: a floor's stairs-down hall (its boss room) climbs higher.
/** @type {Record<string, { step: number, cap: number }>} */
export const TIDES = {
  room: { step: 0.06, cap: 1.0 },
  hall: { step: 0.06, cap: 1.5 },
};
/** which tide a room keeps: a room may name its own profile (room.tide), a floor's stairs-down hall is a hall @param {any} w @param {number} room */
export const tideOf = (w, room) => { const L = w.level, r = L && L.rooms.find((q) => q.id === room); return TIDES[(r && r.tide) || (L && L.descentRoom && L.descentRoom.id === room ? 'hall' : 'room')] || TIDES.room; };
// a kill's XP to each living member: whole alone, 65 % each for two, 50 % each for three (a party
// clears faster, so each member earns about what they would alone, and the room they can take is higher)
const XP_SHARE = [1, 1, 0.65, 0.5];
// Ashbound archetypes at level 1 (GDD §7: × (1 + 0.14 × (level − 1)); elites on top)
const ENEMIES = {
  minion:  { hp: 36, atk: 7,   def: 4, crit: 5, dodge: 5,  interval: 1.2, range: 2.8, speed: 3.3, xp: 10, gold: 1 },
  warrior: { hp: 54, atk: 9.5, def: 6, crit: 5, dodge: 3,  interval: 1.4, range: 3.0, speed: 2.9, xp: 14, gold: 2 },
  rogue:   { hp: 36, atk: 8,   def: 3, crit: 10, dodge: 10, interval: 1.6, range: 6.0, speed: 3.5, xp: 12, gold: 2, bolt: 'bolt' },
  mage:    { hp: 34, atk: 10.5, def: 2, crit: 5, dodge: 5,  interval: 2.0, range: 7.0, speed: 2.7, xp: 14, gold: 3, bolt: 'soul' },
};
// The Redhand Company (world doc §8, M5): deserters turned bandits, baked from recoloured hero models.
// Each mirrors an Ashbound role's strength (the difficulty contract holds whoever fills the wave):
// the cutthroat a minion's, quicker and lighter; the brute a warrior's (and their elite, a Sergeant);
// the crossbowman a rogue's. The Cinder Cult's acolyte stands in for the mage in the Sunken Chapel.
Object.assign(ENEMIES, {
  cutthroat: { hp: 33, atk: 7.5, def: 3, crit: 9, dodge: 8, interval: 1.1, range: 2.8, speed: 3.6, xp: 10, gold: 2 },
  brute:     { hp: 58, atk: 9.5, def: 5, crit: 5, dodge: 2,  interval: 1.5, range: 3.0, speed: 2.8, xp: 14, gold: 3 },
  crossbow:  { hp: 36, atk: 9.3, def: 3, crit: 10, dodge: 6, interval: 1.7, range: 6.5, speed: 3.3, xp: 12, gold: 3, bolt: 'bolt' },
  acolyte:   { hp: 34, atk: 10.5, def: 2, crit: 5, dodge: 5, interval: 2.0, range: 7.0, speed: 2.8, xp: 15, gold: 4, bolt: 'fire' },
});
// The hill goblins of the Scrag Warren (world doc §8, v1.19): small, quick and many. The same mirror: the skirmisher
// a minion's strength (lighter, quicker, more dodge), the bruiser a warrior's (their elite), the archer a rogue's
// with a poacher's bow, the hexer a mage's, casting a green hex.
Object.assign(ENEMIES, {
  goblin:  { hp: 31, atk: 7.2, def: 3, crit: 8, dodge: 12, interval: 1.0, range: 2.6, speed: 3.9, xp: 10, gold: 2 },
  bruiser: { hp: 56, atk: 9.5, def: 6, crit: 5, dodge: 3,  interval: 1.5, range: 3.0, speed: 2.9, xp: 14, gold: 3 },
  archer:  { hp: 34, atk: 8.2, def: 3, crit: 10, dodge: 11, interval: 1.6, range: 6.5, speed: 3.6, xp: 12, gold: 2, bolt: 'arrow' },
  hexer:   { hp: 32, atk: 10.5, def: 2, crit: 5, dodge: 6, interval: 2.0, range: 7.0, speed: 2.8, xp: 14, gold: 3, bolt: 'hex' },
});
// The Greywater Fens' own (M8 slice 4; world doc §8 v1.20), the same mirror. The fen ghoul a minion's strength (a
// long-armed scavenger: quick, a long reach, more dodge), the Toadking's reed-cutter a warrior's (a bill-hook: the
// longest reach of the melee), his fowler a rogue's (a fowling crossbow), the bog-witch a mage's (a marsh-light, cast).
// The Cult's harvester carries a lantern-cage on a pole, a warrior's strength (and the Fens' elite). The drowned clergy
// are Ashbound: the brother a minion's, the cantor a mage's, singing a soul-bolt.
Object.assign(ENEMIES, {
  fenghoul:   { hp: 34, atk: 7.4, def: 3, crit: 7, dodge: 9, interval: 1.1, range: 3.0, speed: 3.7, xp: 10, gold: 1 },
  reedcutter: { hp: 56, atk: 9.4, def: 5, crit: 6, dodge: 3, interval: 1.5, range: 3.3, speed: 2.9, xp: 14, gold: 3 },
  fowler:     { hp: 35, atk: 9.0, def: 3, crit: 10, dodge: 7, interval: 1.7, range: 6.5, speed: 3.3, xp: 12, gold: 3, bolt: 'bolt' },
  bogwitch:   { hp: 33, atk: 10.5, def: 2, crit: 5, dodge: 6, interval: 2.0, range: 7.0, speed: 2.7, xp: 15, gold: 3, bolt: 'marsh' },
  harvester:  { hp: 57, atk: 9.5, def: 5, crit: 5, dodge: 3, interval: 1.5, range: 3.4, speed: 2.8, xp: 15, gold: 4 },
  drowned:    { hp: 37, atk: 7, def: 4, crit: 5, dodge: 4, interval: 1.2, range: 2.8, speed: 3.1, xp: 10, gold: 1 },
  cantor:     { hp: 34, atk: 10.5, def: 2, crit: 5, dodge: 5, interval: 2.0, range: 7.0, speed: 2.7, xp: 14, gold: 3, bolt: 'soul' },
});
export const ENEMY_KINDS = Object.keys(ENEMIES);
// Who fills a site's waves (sites.js `family`): the melee pair and the ranged pair a wave draws from
// (the same draws for every family, so the Old Barrows' waves are as they were), the elite's kind,
// and whether they're Ashbound (Turn Undead reaches only those). Wickham Keep's second floor is the
// diggers': Redhand and the Ashbound they dug up. `families`: per floor, where a site's differ.
/** @type {Record<string, { melee: [string, string], ranged: [string, string], elite: string, undead: (k: string) => boolean }>} */
export const FAMILIES = {
  ashbound: { melee: ['minion', 'warrior'], ranged: ['rogue', 'mage'], elite: 'warrior', undead: () => true },
  redhand: { melee: ['cutthroat', 'brute'], ranged: ['crossbow', 'crossbow'], elite: 'brute', undead: () => false },
  diggers: { melee: ['cutthroat', 'minion'], ranged: ['crossbow', 'rogue'], elite: 'brute', undead: (k) => k === 'minion' || k === 'rogue' },
  chapel: { melee: ['minion', 'warrior'], ranged: ['rogue', 'acolyte'], elite: 'warrior', undead: (k) => k !== 'acolyte' },
  goblin: { melee: ['goblin', 'bruiser'], ranged: ['archer', 'hexer'], elite: 'bruiser', undead: () => false },
  // the Fens (M8, sites.js): the Toadking's men and the ghouls they keep off; the Cult's harvest with the bound lock-men
  // under it, at the Sickpools with the ghouls and the witches, and among the drowned clergy at the Abbey
  reedmen: { melee: ['fenghoul', 'reedcutter'], ranged: ['fowler', 'bogwitch'], elite: 'reedcutter', undead: () => false },
  lockcult: { melee: ['minion', 'harvester'], ranged: ['rogue', 'acolyte'], elite: 'harvester', undead: (k) => k === 'minion' || k === 'rogue' },
  harvest: { melee: ['fenghoul', 'harvester'], ranged: ['rogue', 'bogwitch'], elite: 'harvester', undead: (k) => k === 'rogue' },
  drowned: { melee: ['drowned', 'harvester'], ranged: ['rogue', 'cantor'], elite: 'harvester', undead: (k) => k === 'drowned' || k === 'cantor' || k === 'rogue' },
};
// Bosses (M5, docs/m5-plan.md §3): a floor's stairs-down hall (sites.js `bosses`) opens with its boss and
// an escort; once the boss falls the room goes quiet for the visit. A boss is its `like` archetype's
// stats × its own (HP, ATK, DEF) at the hall's level, and has one signature mechanic:
//   call   (Captain Garrow) at 2/3 and 1/3 HP two of his men join him, and he takes half damage while they stand
//   kindle (the Robed Stranger) every KINDLE_S s the last foe slain rises again as an Ashbound minion
//   line   (the Standard of the Third Legion) Ashbound within LINE_R of it take half damage
//   swarm  (Old Skarn, the Scrag Warren) while he stands he drums, and every SWARM_S s two goblins come out of the
//          tunnels at the hall's far side, while fewer than SWARM_MAX of them are up: put him down and the drum stops
// `once`: a story boss falls for good (state.bosses counts kills; his hall then fights as any other).
// Events: 'bossWave' { id, name } · 'bossCall' { id } · 'bossKindle' { id, x, y } · 'bossSwarm' { id, x, y, n } · 'bossDown' { id, name, first, x, y, lvl }.
// Gold that drops, from a kill or a chest (core.js), is cut to 70 % (2026-10-03, GDD §8): quest and board rewards,
// which are paid, are not.
export const GOLD_DROP = 0.7;
/** @type {Record<string, { name: string, like: string, hp: number, atk: number, def: number, speed?: number, xp: number, gold: number, mech: 'call' | 'kindle' | 'line' | 'swarm', escort: string[], once?: boolean, undead?: boolean, heirloom?: string }>} */
export const BOSSES = {
  redhand_captain: { name: 'Captain Garrow', like: 'brute', hp: 22, atk: 2.3, def: 1.6, speed: 3.0, xp: 12, gold: 30, mech: 'call', escort: ['cutthroat', 'crossbow'], once: true, heirloom: 'garrows_due' },
  robed_stranger: { name: 'The Robed Stranger', like: 'acolyte', hp: 38, atk: 2.8, def: 2.5, xp: 12, gold: 25, mech: 'kindle', escort: ['minion', 'minion'], once: true },
  goblin_chief: { name: 'Old Skarn', like: 'bruiser', hp: 26, atk: 2.1, def: 1.5, speed: 2.8, xp: 12, gold: 28, mech: 'swarm', escort: ['goblin', 'archer'], heirloom: 'skarns_drum' },
  standard: { name: 'The Standard of the Third Legion', like: 'warrior', hp: 34, atk: 2.2, def: 1.8, speed: 2.3, xp: 14, gold: 30, mech: 'line', escort: ['warrior', 'minion', 'rogue'], undead: true, heirloom: 'the_relief' },
  ...WARDENS,   // the Mere Tower's (tower.js): a warden every tenth wave
};
export const KINDLE_S = 12, LINE_R = 4, SWARM_S = 10, SWARM_MAX = 4;
/** does a blow on this foe land at half? A boss whose called men still stand; an Ashbound (not a boss)
 * within LINE_R of a standing Standard @param {any} tgt @param {any[]} foes */
export function halved(tgt, foes) {
  const up = (o) => o.hp > 0 && !o.dead;
  if (tgt.boss && tgt.guards && tgt.guards.length && foes.some((o) => tgt.guards.includes(o.id) && up(o))) return true;
  if (tgt.undead && !tgt.boss) return foes.some((o) => o.boss === 'standard' && up(o) && hypot(o.x - tgt.x, o.y - tgt.y) < LINE_R);
  return false;
}
/** the foes a nova reaches from `m`: within its radius, standing (not rising), and Ashbound only for
 * Turn Undead (`undead`) @param {any} A @param {any[]} foes @param {any} m */
export const novaTargets = (A, foes, m) => foes.filter((o) => !o.dead && o.hp > 0 && !(o.spawn > 0) && (!A.undead || o.undead) && hypot(o.x - m.x, o.y - m.y) < A.radius);
/** the family filling this floor's waves @param {any} w */
export const familyOf = (w) => { const S = siteOf(w.site); return FAMILIES[(S.families && S.families[w.depth || 0]) || S.family] || FAMILIES.ashbound; };
const LULL = 4, OUT_OF_BATTLE_REGEN = 5, LULL_REGEN = 1.5, BOLT_SPEED = 13, AUTO_DELAY = 0.5;
// Animation timing the sim honours so hits land on the swing: a blow (or a bolt's release)
// comes WINDUP s after the attack starts (the baked attack clip's impact frame); a slain
// skeleton lies DEATH_T s (death clip, then a fade) before it's cleared.
export const WINDUP = 0.18, WINDUP_HEAVY = 0.38, DEATH_T = 1.1;
// Swings: light attacks alternate two baked clips (A / B); abilities (Cleave, Backstab,
// Firebolt) and every elite blow are HEAVY — a bigger clip whose impact frame comes later,
// so the blow lands WINDUP_HEAVY into it. atkKind tells the renderer which clip to play.
const MAX_SHOVE = 0.3;   // tiles per tick a personal-space push may move a unit
const SEP_XB = 32, SEP_YB = 16, SEP_X = SEP_XB, SEP_Y = SEP_YB;   // personal space on screen (px): a 56 px figure with shield and blade spans ~32 px
// Melee stations around a target, as SCREEN directions (x right, y down): a 56 px figure is
// far taller than a tile is deep, so fighters stacked along the screen's vertical overlap
// badly while side-by-side ones don't. Attackers take the left/right stations first, then
// the four diagonals; a second ring waits further out when all six are held.
const STATIONS = [[1, 0], [-1, 0], [0.8, 0.6], [-0.8, 0.6], [0.8, -0.6], [-0.8, -0.6]].map(([a, b]) => {
  const wx = (a / 8 + b / 4) / 2, wy = (b / 4 - a / 8) / 2, l = hypot(wx, wy); return [wx / l, wy / l];   // screen → world unit vector
});
// The lull is 4 s at 1.5× regen, a breath (it had waited, at 5× regen, until everyone was back over
// 60 %: every wave started fresh and a room could be held forever). Companions who fell during a
// wave get back up at 25 % HP when it's cleared.
const REVIVE = 0.25, HERO_R = 0.32;   // HERO_R: the hero's collision radius (core.js PLAYER_RADIUS)

export function createBattle({ state, bus, getWorld, seed, isWalkable, onDefeat, onDrop = () => {}, moveHero }) {
  let rng = mulberry32(streamSeed(seed, 0xb477));
  let battle = null, nextId = 1, focusId = 0, pending = [], calmT = 0;   // calmT: seconds with no foe standing (pickCages)   // pending: blows and releases waiting on their wind-up

  // a room tile keeps its room id even where a corridor was carved through it
  const roomAt = (w, x, y) => { const c = w.level && w.level.cells.get(Math.floor(x) + ',' + Math.floor(y)); return c && c.kind === 'floor' && c.room >= 0 ? c.room : -1; };
  const hero = () => state.party[0];
  // whose this fight's waves are: the floor's, or in the Mere Tower the block of ten the climb is in (tower.js)
  const fam = (w) => (battle && battle.tower ? FAMILIES[blockFamily(battle.wave || 1)] : familyOf(w));
  const towerK = () => towerTough(Math.max(1, battle ? battle.wave : 1)) * (1 + PREMIUM * Math.max(0, TOWER.level - 3));
  const alive = (u) => u && !u.down && !u.fallen && u.hp > 0;
  // stats in the fight: statsFor plus the guards up right now (Shield Wall, Smoke Step)
  // the company a member keeps (companions.js: auras, bonds, a Drinker's dry spell), in a fight
  const company = (m) => companyMods(m, state.party, { depth: state.depth, innDay: state.innDay, day: Math.floor(state.t / DAY_S) });
  const combatStats = (m) => {
    const s = statsFor(m), b = m.buff, k = company(m);
    s.atk *= k.atk * boonK(state, 'atk'); s.def *= k.def * boonK(state, 'def');   // (a red / blue shrine's boon, shrines.js)
    if (b) { if (b.wall > 0) s.def = s.def * (1 + b.wallK); if (b.smoke > 0) s.dodge += b.smokeK; if (b.bless > 0) { s.atk = s.atk * (1 + b.blessK); s.def = s.def * (1 + b.blessK); } if (b.breath > 0) s.atk = s.atk * (1 + b.breathAtk); }
    return s;
  };

  // runtime fields on party members (positions for companions; the hero is the player)
  function ensureRuntime(w, dt) {
    const p = state.player;
    state.party.forEach((m, i) => {
      if (m.mp === undefined) m.mp = statsFor(m).maxMp;
      if (i === 0) { m.x = p.x; m.y = p.y; }
      // catch up after a jump (travel, stairs, a load) — never mid-fight: a companion chasing
      // across a big room popped back to the hero in one tick (~14 tiles)
      else if (m.x === undefined || (!battle && hypot(m.x - p.x, m.y - p.y) > 14)) [m.x, m.y] = besideHero(w, p.x - 0.8 * i, p.y + 0.8);
      else unstick(m, w, p, dt);
      m.cd = m.cd || 0; m.act = m.act || 0;
    });
  }
  function placeCompanions() { const p = state.player, w = getWorld(); state.party.forEach((m, i) => { if (i) { [m.x, m.y] = besideHero(w, p.x + (i === 1 ? -1 : 1) * 0.9, p.y + 0.9); } }); }

  // Auto-unstick (the owner, 2026-10-04: "companions get stuck in a wall, especially when they flash forward to
  // catch up"). The catch-up and a placement put a companion at a fixed offset from the hero, wall or not, and one
  // inside a wall can't take a step (every step from it lands in the wall too). So: a placement takes the open floor
  // nearest the wanted spot that the hero can see (besideHero); each tick a companion found inside a wall moves to
  // the nearest open floor; and out of a fight, one that hasn't moved for STUCK_S while a wall stands between it and
  // the hero, more than STUCK_D tiles off, comes round to the hero's side. (stuckT is runtime, never saved.)
  const STUCK_S = 2, STUCK_D = 3;
  /** (x, y) if it's open floor, else the open floor nearest it that the hero can see, tile centres out to 3 tiles from the hero, else the hero's own spot */
  function besideHero(w, x, y) {
    const p = state.player;
    if (isWalkable(w, x, y)) return [x, y];                          // (the wanted spot is under a tile from the hero: no wall fits between)
    const hx = Math.floor(p.x), hy = Math.floor(p.y); let best = null, bd = Infinity;
    for (let dy = -3; dy <= 3; dy++) for (let dx = -3; dx <= 3; dx++) {
      const cx = hx + dx + 0.5, cy = hy + dy + 0.5, d = hypot(cx - x, cy - y);
      if (d < bd && (dx || dy) && isWalkable(w, cx, cy) && lineOpen(w, p.x, p.y, cx, cy)) { bd = d; best = [cx, cy]; }
    }
    return best || [p.x, p.y];
  }
  /** the open floor nearest (x, y): tile centres in rings out to 3 tiles, else beside the hero */
  function openNear(w, x, y) {
    const tx = Math.floor(x), ty = Math.floor(y);
    for (let r = 1; r <= 3; r++) {
      let best = null, bd = Infinity;
      for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) {
        if (Math.max(Math.abs(dx), Math.abs(dy)) !== r) continue;
        const cx = tx + dx + 0.5, cy = ty + dy + 0.5, d = hypot(cx - x, cy - y);
        if (d < bd && isWalkable(w, cx, cy)) { bd = d; best = [cx, cy]; }
      }
      if (best) return best;
    }
    return besideHero(w, x, y);
  }
  function unstick(m, w, p, dt) {
    if (m.fallen) return;
    if (!isWalkable(w, m.x, m.y)) { [m.x, m.y] = openNear(w, m.x, m.y); m.vx = m.vy = 0; m.stuckT = 0; bus.emit('unstuck', { id: m.id, x: m.x, y: m.y }); return; }
    const still = m.px === undefined || hypot(m.x - m.px, m.y - m.py) < 0.02;
    if (battle || m.down || !still || hypot(m.x - p.x, m.y - p.y) <= STUCK_D || lineOpen(w, p.x, p.y, m.x, m.y)) { m.stuckT = 0; return; }
    m.stuckT = (m.stuckT || 0) + dt;
    if (m.stuckT >= STUCK_S) { [m.x, m.y] = besideHero(w, p.x - 0.8, p.y + 0.8); m.vx = m.vy = 0; m.stuckT = 0; bus.emit('unstuck', { id: m.id, x: m.x, y: m.y }); }
  }

  // ── spawning ────────────────────────────────────────────────────────────────
  function spawnWave(w) {
    const b = battle, lvl = b.level;
    // the room's level sets the size, stats and mix (at most a third archers and mages); every fifth
    // wave an elite takes one slot; each wave of the visit rises with the tide
    const eliteWave = (b.wave + 1) % 5 === 0;
    const n = Math.max(1, waveSize(lvl) - (eliteWave ? 1 : 0));
    // the tide: a step up from the last wave, to the top; after the top, back to the start
    if (b.wave > 0) {
      const T = tideOf(w, b.room);
      if (b.tide >= T.cap - 1e-9) { b.tide = 0; bus.emit('tideTurned', { room: b.room }); }
      else b.tide = Math.min(T.cap, b.tide + T.step);
    }
    const tough = (1 + b.tide) * (1 + PREMIUM * Math.max(0, lvl - 3));
    const ranged = Math.max(b.wave % 2, Math.floor(n / 3));   // one in every second wave at least: two melee foes alone never touched a kiting mage
    const F = familyOf(w);
    const kinds = Array.from({ length: n }, (_, i) => i < ranged ? F.ranged[rng() < 0.5 ? 0 : 1] : F.melee[rng() < 0.55 ? 0 : 1]);
    const cells = b.cells, p = state.player, g = b.grid, reach = field(p.x, p.y);
    const reachable = (c) => reach[(c[1] - g.y0) * g.gw + (c[0] - g.x0)] < 65535;       // never behind a pool or pillar ring
    // a spawn point 9+ tiles off that the party can reach. The draws are as they always were; when none of
    // the 60 fits, the first reachable miss, else the first reachable cell. (It used to keep the
    // last draw, which could be a pool: a foe stood in it for good and the wave never ended; the M5 farm.)
    const spot = () => {
      let fall = null;
      for (let t = 0; t < 60; t++) { const c = cells[(rng() * cells.length) | 0], x = c[0] + 0.5, y = c[1] + 0.5; if (!reachable(c)) continue; if (hypot(x - p.x, y - p.y) > 9) return [x, y]; if (!fall) fall = [x, y]; }
      if (fall) return fall;
      const c = cells.find(reachable) || [Math.floor(p.x), Math.floor(p.y)]; return [c[0] + 0.5, c[1] + 0.5];
    };
    if (b.tower) { spawnTower(w, b, spot); return; }            // the Mere Tower's own waves (below)
    if (b.boss && !b.bossUp) {                                   // the hall opens with its boss and an escort (no tide yet)
      const B = BOSSES[b.boss], [bx, by] = spot();
      foe(w, b.boss, lvl, bx, by, 1 + PREMIUM * Math.max(0, lvl - 3), false, F, B);
      B.escort.forEach((k, i) => { const [ex, ey] = onFloor(w, bx + (i % 2 ? 1.4 : -1.4), by + 1 + i * 0.4, bx, by); foe(w, k, lvl, ex, ey, 1 + PREMIUM * Math.max(0, lvl - 3), false, F); });
      b.bossUp = true; b.wave += 1;
      bus.emit('bossWave', { id: b.boss, name: B.name });
      bus.emit('wave', { wave: b.wave, level: lvl, tide: b.tide });
      return;
    }
    for (let i = 0; i < n; i++) {
      const [x, y] = spot(), elite = eliteWave && i === n - 1;
      foe(w, elite ? F.elite : kinds[i], lvl, x, y, tough, elite, F);
    }
    b.wave += 1;
    bus.emit('wave', { wave: b.wave, level: lvl, tide: b.tide });
  }
  // the Mere Tower's next wave (tower.js): a level-12 room's, TOUGH[n] strong, of its block's kind; every tenth a warden
  // and an escort of the block's. Its strength shows on the room pill as a tide would (b.tide).
  function spawnTower(w, b, spot) {
    const next = b.wave + 1, F = FAMILIES[blockFamily(next)], prem = 1 + PREMIUM * Math.max(0, b.level - 3), tough = towerTough(next) * prem;
    b.tide = towerTough(next) - 1;
    if (wardenWave(next)) {
      const id = wardenAt(next), B = BOSSES[id], [bx, by] = spot();
      const u = foe(w, id, b.level, bx, by, tough, false, F, B); u.escort = [F.melee[0], F.ranged[0]];
      u.escort.forEach((k, i) => { const [ex, ey] = onFloor(w, bx + (i % 2 ? 1.4 : -1.4), by + 1 + i * 0.4, bx, by); foe(w, k, b.level, ex, ey, tough, false, F); });
      b.wave = next; b.bossUp = true; b.boss = id;
      bus.emit('bossWave', { id, name: B.name, tower: true });
      bus.emit('wave', { wave: b.wave, level: b.level, tide: b.tide, tower: true });
      return;
    }
    const eliteWave = next % 5 === 0, n = Math.max(1, waveSize(b.level) - (eliteWave ? 1 : 0)), ranged = Math.max(next % 2, Math.floor(n / 3));
    for (let i = 0; i < n; i++) {
      const [x, y] = spot(), elite = eliteWave && i === n - 1;
      foe(w, elite ? F.elite : i < ranged ? F.ranged[rng() < 0.5 ? 0 : 1] : F.melee[rng() < 0.55 ? 0 : 1], b.level, x, y, tough, elite, F);
    }
    b.wave = next;
    bus.emit('wave', { wave: b.wave, level: b.level, tide: b.tide, tower: true });
  }
  /** one foe into the fight: a kind's stats at the room's level × tough (tide and premium); an elite is
   * ×2.5 HP, ×1.3 ATK; a boss (B) its own multiples @param {any} w @param {string} k @param {number} lvl
   * @param {number} x @param {number} y @param {number} tough @param {boolean} elite @param {any} F @param {any} [B] */
  function foe(w, k, lvl, x, y, tough, elite, F, B = null) {
    const scale = 1 + 0.14 * (lvl - 1), atkScale = 1 + 0.12 * (lvl - 1), E = ENEMIES[B ? B.like : k];
    const hp = Math.round(E.hp * scale * tough * (elite ? 2.5 : 1) * (B ? B.hp : 1));
    const u = { id: nextId++, kind: k, undead: B ? !!B.undead : F.undead(k), elite: elite || !!B, lvl, x, y, hp, maxHp: hp,
      atk: E.atk * atkScale * tough * (elite ? 1.3 : 1) * (B ? B.atk : 1), def: E.def * scale * (B ? B.def : 1),
      crit: E.crit, dodge: E.dodge, interval: E.interval, range: E.range, speed: B && B.speed ? B.speed : E.speed, bolt: E.bolt,
      xp: E.xp * (elite ? 3 : 1) * (B ? B.xp : 1), gold: E.gold * (elite ? 4 : 1) * (B ? B.gold : 1), cd: 0.6 + rng() * 0.8, act: 0, flash: 0, dead: 0, dir: 2, moving: false, spawn: 0.5 };
    if (B) { u.boss = k; u.called = 0; u.guards = []; u.kindleT = 0; u.swarmT = 0; }
    w.enemies.push(u);
    return u;
  }

  const hallHere = (w, room) => !!w.level.descentRoom && w.level.descentRoom.id === room;
  function startBattle(w, room) {
    const cells = [];
    for (const [k, c] of w.level.cells) if (c.kind === 'floor' && c.room === room) { const [x, y] = k.split(',').map(Number); cells.push([x, y]); }
    // walkable room grid for the flow fields that route units around pillars and pools
    let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
    for (const [x, y] of cells) { x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y); }
    const gw = x1 - x0 + 1, gh = y1 - y0 + 1, walk = new Uint8Array(gw * gh);
    for (const [x, y] of cells) if (isWalkable(w, x + 0.5, y + 0.5)) walk[(y - y0) * gw + (x - x0)] = 1;
    pending = [];
    for (const m of state.party) { m.downs = 0; m.stood = 0; m.buff = null; m.ward = 0; }   // a new room visit
    const hall = w.level.descentRoom && w.level.descentRoom.id === room, bid = hall ? bossAt(w.site, w.depth || 0) : null;
    battle = { room, t0: state.t, lastBlow: null, level: (w.roomLevels && w.roomLevels.get(room)) || 1 + (w.depth || 0), wave: 0, lull: 1.2, cells, grid: { x0, y0, gw, gh, walk }, fields: new Map(),
      tide: 0, boss: bid && !(BOSSES[bid].once && (state.bosses || {})[bid]) ? bid : null, bossUp: false, quiet: false, lastSlain: null };
    if (w.site === TOWER.site) {                                 // the Mere Tower's stair hall: its own climb, carried on where it was (tower.js)
      const T = towerOf(state); Object.assign(battle, { tower: true, level: TOWER.level, wave: T.wave, boss: null, quiet: T.atLanding, between: T.wave > 0, tide: towerTough(Math.max(1, T.wave)) - 1 });   // (between: the last wave was paid for already)
    }
    w.enemies = []; w.projectiles = [];
    rng = mulberry32(streamSeed(seed ^ (room * 7919 + (w.depth || 0) * 104729), 0xb477));
    bus.emit('battle', { on: true, room, level: battle.level });
  }
  function endBattle(w, why) {
    if (battle && battle.tower && why !== 'defeat') towerOut();
    battle = null; focusId = 0; pending = [];
    if (w) { w.enemies = []; w.projectiles = []; }
    downedOut(why === 'left');
    bus.emit('battle', { on: false, why });
    bus.emit('partyChanged', state.party);
  }
  // out of the Mere Tower's hall (walked out, read a scroll, took Wenna home): the climb ends. At a landing the satchel
  // is already banked; mid-climb what's in it is lost (tower.js). Beaten: the same, and no gold besides (defeat).
  function towerOut() {
    const T = towerOf(state), lost = T.atLanding ? null : { ...T.satchel };
    T.wave = 0; T.atLanding = false; T.satchel = { gold: 0, cinders: 0 };
    bus.emit('towerOut', { lost });
  }
  // the fight is over with members still Downed: walked out on, a companion is Fallen (the
  // main character gets up); otherwise they rise at 20 %
  function downedOut(leftThem) {
    for (const m of state.party) {
      m.buff = null; m.ward = 0;
      if (!m.down) continue;
      if (leftThem && !m.main) fall(m);
      else { m.down = false; m.hp = Math.max(1, Math.round(statsFor(m).maxHp * 0.2)); }
    }
  }
  function fall(m) {
    m.down = false; m.fallen = true; m.hp = 0; m.buff = null; m.ward = 0; m.moving = false;
    bus.emit('combat', { t: 'fallen', x: m.x, y: m.y, name: m.name });
    bus.emit('fallen', { id: m.id, name: m.name });
  }

  // ── combat ──────────────────────────────────────────────────────────────────
  // a Hexed foe (the shaman's Hex): its ATK when it swings and its DEF when it's struck, cut while the hex lasts
  const hexed = (o) => o.hex && o.hex.t > 0;
  const hexAtk = (e) => (hexed(e) ? { ...e, atk: e.atk * (1 - e.hex.k) } : e);
  const hexDef = (e) => (hexed(e) ? { ...e, def: e.def * (1 - e.hex.k) } : e);
  function resolve(att, def, power, bonusCrit = 0, critMul = 1) {
    const w = getWorld();
    if (rng() * 100 < Math.min(50, def.dodge)) return { miss: true };
    const lvl = att.lvl || att.level || 1, mit = def.def / (def.def + 25 + 5 * lvl);
    let dmg = Math.max(1, att.atk * power * (1 - mit));
    const crit = rng() * 100 < Math.min(60, att.crit + bonusCrit);
    if (crit) dmg *= 1.75 * critMul;
    return { dmg: Math.round(dmg), crit };
  }
  function applyHit(att, tgt, r, isParty, w, heavy = false) {
    if (r.miss) { bus.emit('combat', { t: 'miss', x: tgt.x, y: tgt.y, party: isParty }); return; }
    let dmg = r.dmg;
    if (!isParty && battle && guardedHalf(tgt, w)) dmg = Math.max(1, Math.ceil(dmg / 2));   // Garrow's men stand / the Standard holds the line
    if (isParty && tgt.ward > 0) { const a = Math.min(tgt.ward, dmg); tgt.ward -= a; dmg -= a; if (!dmg) { bus.emit('combat', { t: 'warded', x: tgt.x, y: tgt.y }); return; } }   // Arcane Ward soaks it first
    if (isParty && tgt.main && dmg > 1) {                       // a Bodyguard close by takes a share of what's aimed at the hero
      const g = state.party.find((q) => q !== tgt && alive(q) && has(q, 'bodyguard') && hypot(q.x - tgt.x, q.y - tgt.y) <= FIGHT.bodyguardR);
      if (g) { const share = Math.max(1, Math.round(dmg * FIGHT.bodyguard)); dmg -= share; g.hp = Math.max(1, g.hp - share); g.flash = 0.12; }
    }
    tgt.hp = Math.max(0, tgt.hp - dmg); tgt.flash = 0.12; tgt.hitN = (tgt.hitN || 0) + 1;
    const by = att.src || att;                                  // the striker (party stats are a copy): where the blow came from, who struck it — hit sparks
    bus.emit('combat', { t: 'hit', x: tgt.x, y: tgt.y, amount: dmg, crit: r.crit, party: isParty, ax: by.x, ay: by.y, src: by.actor || by.cls || by.kind, heavy });
    if (tgt.hp <= 0 && isParty && battle && !battle.lifeline && state.party.some((q) => q.cls === 'cleric' && alive(q) && hasPassive(q))) {
      tgt.hp = 1; battle.lifeline = true;                       // Lifeline: once a room visit, the blow that would down an ally doesn't
      bus.emit('combat', { t: 'lifeline', x: tgt.x, y: tgt.y, name: tgt.name });
    }
    if (tgt.hp <= 0 && isParty && battle && sworn(tgt) && !(battle.sworn || []).includes(tgt.id)) {
      tgt.hp = Math.max(1, Math.round(statsFor(tgt).maxHp * SWORN_RISE)); (battle.sworn ||= []).push(tgt.id);   // Sworn: once a room visit, gets up from it
      bus.emit('combat', { t: 'rise', x: tgt.x, y: tgt.y, name: tgt.name });
    }
    if (tgt.hp > 0) return;
    if (isParty) {
      if (battle) battle.lastBlow = { kind: by.kind || '', elite: !!by.elite, boss: by.boss || '', on: tgt.name || '' };   // (the defeat recap: who brought them down)
      tgt.down = true; tgt.downs = (tgt.downs || 0) + 1; tgt.stood = 0; tgt.buff = null; tgt.ward = 0;
      bus.emit('combat', { t: 'down', x: tgt.x, y: tgt.y, name: tgt.name });
      if (tgt.downs >= 2 && !tgt.main) fall(tgt);               // twice in one room visit (the main character stays Downed)
      if (!state.party.some(alive)) defeat(w);
    }
    else { tgt.dead = DEATH_T; reward(tgt); if (focusId === tgt.id) focusId = 0; }
  }
  const guardedHalf = (tgt, w) => halved(tgt, w.enemies);
  function reward(e) {
    if (battle && battle.tower) { towerReward(e); return; }
    const living = state.party.filter(alive);
    const xp = Math.round(e.xp * e.lvl), share = Math.max(1, Math.round(xp * XP_SHARE[Math.min(3, living.length)]));
    const lv = (m) => bus.emit('levelUp', { id: m.id, name: m.name, level: m.level });
    for (const m of living) gainXp(m, share, lv);
    for (const m of state.bench || []) gainXp(m, Math.round(share * BENCH_XP), lv);   // the bench earns half
    state.counters.gold = (state.counters.gold || 0) + Math.round(e.gold * e.lvl * goldMod(state.party) * GOLD_DROP);   // (a Scavenger's or a Greedy sellsword's eye)
    // cinders (✦) from the strong (GDD §8 v1.13): an elite gives ELITE_CINDERS, a boss BOSS_CINDERS, for the smith
    const ci = e.boss ? BOSS_CINDERS : e.elite ? ELITE_CINDERS : 0;
    if (ci) { state.counters.embers = (state.counters.embers || 0) + ci; bus.emit('combat', { t: 'cinders', x: e.x, y: e.y, amount: ci }); }
    bus.emit('countersChanged', { ...state.counters });
    bus.emit('combat', { t: 'xp', x: e.x, y: e.y, amount: share });
    if (e.boss) { const first = !(state.bosses || {})[e.boss]; (state.bosses ||= {})[e.boss] = ((state.bosses || {})[e.boss] || 0) + 1; if (battle) battle.quiet = true;
      bus.emit('bossDown', { id: e.boss, name: BOSSES[e.boss].name, first, x: e.x, y: e.y, lvl: e.lvl }); }   // (core.js pays its heirloom / loot; the room goes quiet)
    else if (battle) battle.lastSlain = { x: e.x, y: e.y };
    if (e.elite && !e.boss) onDrop('elite', e.lvl, e.x, e.y);           // elites often carry gear
    bus.emit('slain', { kind: e.kind, elite: !!e.elite, lvl: e.lvl });   // (quests count elites)
    freeing(e);
  }
  // a foe down in the Mere Tower: no XP and no coin (the satchel pays by the wave), a warden's cinders into the satchel,
  // its fall a boss's (state.bosses, core.js pays its drop), and the count as anywhere
  function towerReward(e) {
    if (e.boss) {
      const T = towerOf(state), first = !(state.bosses || {})[e.boss]; T.satchel.cinders += TOWER.wardenCinders;
      (state.bosses ||= {})[e.boss] = ((state.bosses || {})[e.boss] || 0) + 1; battle.quiet = true;
      bus.emit('bossDown', { id: e.boss, name: BOSSES[e.boss].name, first, x: e.x, y: e.y, lvl: e.lvl, tower: true });
    } else battle.lastSlain = { x: e.x, y: e.y };
    bus.emit('slain', { kind: e.kind, elite: !!e.elite, lvl: e.lvl });
    freeing(e);
  }
  function towerCleared() {
    const T = towerOf(state), n = battle.wave;
    T.wave = n; T.best = Math.max(T.best, n); T.satchel.gold += waveGold(n); T.satchel.cinders += TOWER.cinders;
    bus.emit('towerWave', { wave: n, satchel: { ...T.satchel } });
    if (!wardenWave(n)) return;
    const banked = { ...T.satchel };                                // a landing: the satchel is yours, and the hall waits
    state.counters.gold = (state.counters.gold || 0) + banked.gold; state.counters.embers = (state.counters.embers || 0) + banked.cinders;
    T.satchel = { gold: 0, cinders: 0 }; T.atLanding = true; T.landing = Math.max(T.landing, n / TOWER.landing); battle.quiet = true;
    bus.emit('countersChanged', { ...state.counters });
    bus.emit('towerLanding', { wave: n, landing: n / TOWER.landing, banked });
  }
  /** climb on from a landing (the `towerClimb` command; core.js checks you're there) @returns {boolean} */
  function towerClimb() {
    if (!battle || !battle.tower || !towerOf(state).atLanding) return false;
    towerOf(state).atLanding = false; battle.quiet = false; battle.boss = null; battle.bossUp = false; battle.between = true; battle.lull = LULL;
    bus.emit('towerClimb', { wave: battle.wave + 1 }); return true;
  }
  // The count (lamps.js): an Ashbound put down frees its soul; a lamp's keeper falling breaks the lamp, and every bound foe
  // still standing in the room lies down (freed, not beaten: no XP, no coin); a harvester drops its cage where it falls.
  function freeing(e) {
    const w = getWorld();
    if (e.undead) credit(state, bus, { souls: 1 });
    const lamp = e.boss ? lampOf(e.boss) : null;
    if (lamp) {
      const bound = (w.enemies || []).filter((o) => o !== e && o.undead && o.hp > 0 && !o.dead);
      for (const o of bound) { o.hp = 0; o.dead = DEATH_T; if (focusId === o.id) focusId = 0; bus.emit('combat', { t: 'freed', x: o.x, y: o.y }); }
      const broken = countOf(state) && state.lampsBroken, first = !broken.includes(lamp);
      if (first) broken.push(lamp);
      credit(state, bus, { lamps: first ? 1 : 0, souls: bound.length + (first ? LAMPS[lamp].souls : 0) });
      bus.emit('lampBroken', { id: lamp, name: LAMPS[lamp].name, first, freed: bound.length, held: first ? LAMPS[lamp].souls : 0, x: e.x, y: e.y });
    }
    if (CAGE_KINDS.has(e.kind) && e.elite && w.kind === 'dungeon') {   // the band's elite: its cage, on the floor where it fell (or the nearest free tile)
      const fx = Math.floor(e.x), fy = Math.floor(e.y);
      for (const [dx, dy] of [[0, 0], [1, 0], [0, 1], [-1, 0], [0, -1], [1, 1], [-1, 1], [1, -1], [-1, -1]]) {
        const tx = fx + dx, ty = fy + dy, k = tx + ',' + ty;
        if (w.props.has(k) || w.mods.has(k) || !isWalkable(w, tx + 0.5, ty + 0.5)) continue;
        w.mods.set(k, { cage: true }); bus.emit('cageDropped', { tx, ty }); break;
      }
    }
  }
  // A caged soul the party walks past (lamps.js, GDD v1.35): a few seconds with no foe standing and the member nearest
  // each cage near the hero breaks it, as a tap would (mods in insertion order: the same every replay)
  function pickCages(w, p) {
    for (const [k, m] of w.mods) {
      if (!m || !m.cage || m.opened) continue;
      const c = k.indexOf(','), tx = +k.slice(0, c), ty = +k.slice(c + 1), x = tx + 0.5, y = ty + 0.5;
      if (hypot(x - p.x, y - p.y) > CAGE_REACH) continue;
      let by = null, bd = 1e9;
      state.party.forEach((q, i) => { if (!alive(q)) return; const qx = i ? q.x : p.x, qy = i ? q.y : p.y, d = hypot(x - qx, y - qy); if (d < bd) { bd = d; by = q; } });
      w.mods.set(k, { opened: true });
      credit(state, bus, { lamps: 1, souls: 1 });
      bus.emit('cageBroken', { tx, ty, x, y, by: by ? by.name : '', auto: true });
    }
  }
  // a wipe: wake at the temple — 30 % HP, Fallen cleared, Weakened, a quarter of the gold gone. The
  // 'defeat' event carries a recap for the defeat screen (ui/defeat.js): where, how far in, who struck
  // the last blow, what's left standing. Presentation reads it; nothing in it feeds back into the sim.
  function defeat(w) {
    const b = battle, recap = b ? { site: w.site || 'barrows', siteName: siteOf(w.site).name, floor: (w.depth || 0) + 1, level: b.level, wave: b.wave,
      secs: Math.round(state.t - (b.t0 ?? state.t)), foesLeft: w.enemies.filter((e) => !e.dead && e.hp > 0).length,
      killer: b.lastBlow ? { ...b.lastBlow, bossName: b.lastBlow.boss && BOSSES[b.lastBlow.boss] ? BOSSES[b.lastBlow.boss].name : '' } : null,
      party: state.party.map((m) => m.name) } : null;
    const tower = !!(b && b.tower); if (tower) towerOut();         // (the Tower takes the satchel, not a quarter of your gold)
    const lost = tower ? 0 : Math.floor((state.counters.gold || 0) * 0.25);
    state.counters.gold = (state.counters.gold || 0) - lost;
    endBattle(w, 'defeat');
    for (const m of state.party) {
      m.down = false; m.fallen = false; m.weakUntil = state.t + WEAK_S;
      const s = statsFor(m); m.hp = Math.max(1, Math.round(s.maxHp * WIPE_HP)); m.mp = Math.min(m.mp ?? s.maxMp, s.maxMp);
    }
    bus.emit('defeat', { lost, weakS: WEAK_S, recap });
    bus.emit('weakened', { on: true, until: state.t + WEAK_S });
    onDefeat();
  }
  // ── abilities ───────────────────────────────────────────────────────────────
  // an ability's cast: its rank, the Rare gear on the caster and Focus set cost and strength
  function cast(m, A) {
    const r = rankOf(m, A.id), am = abilityMods(m, A.name);
    return { A, cost: Math.max(0, rankCost(A, r) - am.cost), mult: skillMult(r, am.power, statsFor(m).power || 0) };
  }
  // MP a member holds back for its guards, heals, wards and novas (only if it has any):
  // Aggressive nothing; Balanced strikes freely until someone is badly hurt, then keeps enough
  // for the cheapest; Defensive always keeps half the pool
  function reserve(m, s) {
    const stance = stanceOf(m); if (stance === 'aggressive') return 0;
    let low = 1e9; for (const A of priorityOf(m)) if (A.kind !== 'strike' && unlocked(m, A, state.trials) && autocastOn(m, A.id)) low = Math.min(low, cast(m, A).cost);
    if (low === 1e9) return 0;
    if (stance === 'balanced') return state.party.some((q) => alive(q) && q.hp < statsFor(q).maxHp * STANCE_AI.balanced.low) ? low : 0;
    return Math.max(low, s.maxMp * STANCE_AI[stance].reserve);
  }
  const drainCap = (m, A) => A.dmax + (hasPassive(m) ? OLD_WAYS_STACKS : 0);
  // the knot a Hex goes on: the foe with the most others (not yet hexed) within its radius, or a lone boss or elite
  function hexCentre(A, foes) {
    let best = null, bn = 0;
    for (const o of foes) { if (o.spawn > 0) continue; const n = foes.filter((q) => !q.dead && q.hp > 0 && !hexed(q) && hypot(q.x - o.x, q.y - o.y) < A.radius).length; if (n > bn || (n === bn && o.boss)) { bn = n; best = o; } }   // (a boss breaks a tie)
    if (best && bn >= 2) return best;
    return foes.find((o) => (o.boss || o.elite) && !hexed(o) && !(o.spawn > 0)) || null;
  }
  // the strike to swing with (paid for here), or null for a basic attack
  function pickStrike(m, tgt) {
    const s = statsFor(m), keep = reserve(m, s);
    for (const A of priorityOf(m)) {
      if (A.kind !== 'strike' || !unlocked(m, A, state.trials) || !autocastOn(m, A.id)) continue;
      if (A.poison && tgt.poison && tgt.poison.t > 1) continue;                    // Venom: already poisoned
      if (A.drain && tgt.drain && tgt.drain.n >= drainCap(m, A) && tgt.drain.t > 2) continue;   // Spirit Drain: stacked full, still running
      const c = cast(m, A); if (m.mp < c.cost + keep) continue;
      m.mp -= c.cost; return c;
    }
    return null;
  }
  // a guard, heal, ward or nova worth casting now (it takes the member's turn)
  function tryUtility(m, i, foes, w, F) {
    const s = statsFor(m), ai = STANCE_AI[stanceOf(m)], hpf = m.hp / s.maxHp;
    for (const A of priorityOf(m)) {
      if (A.kind === 'strike' || !unlocked(m, A, state.trials) || !autocastOn(m, A.id)) continue;
      const c = cast(m, A); if (m.mp < c.cost) continue;
      let target = m;
      if (A.kind === 'guard') {
        const b = m.buff || {}; if ((A.taunt ? b.wall : b.smoke) > 0) continue;
        const near = foes.filter((e) => hypot(e.x - m.x, e.y - m.y) < 3.2).length;
        const guards = A.taunt && state.party.some((q) => q !== m && alive(q));        // taunting only helps with someone to shield
        if (!(hpf < ai.low || (guards && near >= (stanceOf(m) === 'aggressive' ? 3 : 2)))) continue;
      } else if (A.kind === 'heal') { if (hpf >= ai.low) continue; }
      else if (A.kind === 'ward') {
        target = null; let lo = ai.low + 0.1;
        for (const q of state.party) if (alive(q) && !(q.ward > 0)) { const f = q.hp / statsFor(q).maxHp; if (f < lo) { lo = f; target = q; } }
        if (!target) continue;
      } else if (A.kind === 'mend') {                         // the most hurt ally (the healer heals earlier than others guard)
        target = null; let lo = Math.min(0.9, ai.low + 0.15);
        for (const q of state.party) if (alive(q)) { const f = q.hp / statsFor(q).maxHp; if (f < lo) { lo = f; target = q; } }
        if (!target) continue;
      } else if (A.kind === 'bless') {
        if (foes.length < 2 || state.party.some((q) => q.buff && q.buff.bless > 0)) continue;
      } else if (A.kind === 'nova') { if (novaTargets(A, foes, m).length < 2) continue; }
      else if (A.kind === 'breath') {                          // the party's hurt, and nobody's breathing it already
        if (state.party.some((q) => q.buff && q.buff.breath > 0)) continue;
        const hurt = state.party.filter((q) => alive(q) && q.hp < statsFor(q).maxHp * Math.min(0.85, ai.low + 0.25));
        if (!(hurt.length >= 2 || hurt.some((q) => q.hp < statsFor(q).maxHp * ai.low))) continue;
      } else if (A.kind === 'hex') { target = hexCentre(A, foes); if (!target) continue; }
      m.mp -= c.cost; m.act = 0.55; m.cd = F.interval; m.atkN = (m.atkN || 0) + 1; m.atkKind = 'heavy'; m.moving = false;
      bus.emit('combat', { t: 'ability', x: m.x, y: m.y, name: A.name });
      const tg = target;
      pending.push({ t: WINDUP_HEAVY, fn: () => { if (alive(m)) utility(m, c, tg, w); } });
      return true;
    }
    return false;
  }
  function utility(m, { A, mult }, tgt, w) {
    if (A.kind === 'guard') {
      const b = m.buff || (m.buff = {});
      if (A.taunt) { b.wall = A.dur + (has(m, 'long_watch') ? FIGHT.wall : 0); b.wallK = A.def * mult; } else { b.smoke = A.dur + (has(m, 'smoke_artist') ? FIGHT.smoke : 0); b.smokeK = A.dodge * mult; }
      bus.emit('combat', { t: 'guard', x: m.x, y: m.y, name: A.name });
    } else if (A.kind === 'heal') {
      const s = statsFor(m), n = Math.round(s.maxHp * A.heal * mult * healMod(m, state.party)); m.hp = Math.min(s.maxHp, m.hp + n);
      bus.emit('combat', { t: 'heal', x: m.x, y: m.y, amount: n });
    } else if (A.kind === 'mend') {
      if (!alive(tgt)) return;
      const s = statsFor(tgt), n = Math.round(s.maxHp * A.heal * mult * (m.cls === 'cleric' ? HEAL_BONUS : 1) * healMod(m, state.party)); tgt.hp = Math.min(s.maxHp, tgt.hp + n);
      bus.emit('combat', { t: 'heal', x: tgt.x, y: tgt.y, amount: n });
    } else if (A.kind === 'bless') {
      for (const q of state.party) if (alive(q)) { const b = q.buff || (q.buff = {}); b.bless = A.dur; b.blessK = A.buff * mult; }
      bus.emit('combat', { t: 'guard', x: m.x, y: m.y, name: A.name });
    } else if (A.kind === 'ward') {
      if (!alive(tgt)) return;
      tgt.ward = Math.round(statsFor(tgt).maxHp * A.ward * mult);
      bus.emit('combat', { t: 'ward', x: tgt.x, y: tgt.y, amount: tgt.ward });
    } else if (A.kind === 'breath') {
      const k = A.hot * mult * healMod(m, state.party);
      for (const q of state.party) if (alive(q)) { const b = q.buff || (q.buff = {}); b.breath = A.dur; b.breathK = k; b.breathAtk = A.buff * mult; }
      bus.emit('combat', { t: 'guard', x: m.x, y: m.y, name: A.name });
    } else if (A.kind === 'hex') {
      if (!tgt) return;
      const k = Math.min(0.4, A.debuff * mult);
      for (const o of w.enemies) if (!o.dead && o.hp > 0 && hypot(o.x - tgt.x, o.y - tgt.y) < A.radius) o.hex = { t: A.dur, k };
      bus.emit('combat', { t: 'hex', x: tgt.x, y: tgt.y, party: false });
    } else if (A.kind === 'nova') {
      const aS = { ...statsFor(m), lvl: m.level, src: m };
      for (const o of novaTargets(A, w.enemies, m)) { applyHit(aS, o, resolve(aS, o, A.power * mult), false, w, true); o.slow = A.slow; }
      bus.emit('combat', { t: 'heavy', x: m.x, y: m.y, party: false });
    }
  }
  function attack(att, tgt, isPartyAtt, w, fight, c = null) {
    let power = 1, bonus = 0;
    const ab = c ? c.A : null;
    if (c) { power = ab.power * c.mult; bonus = ab.crit || 0; }
    const heavy = !!ab || (!isPartyAtt && att.elite);
    att.act = heavy ? 0.55 : 0.35; att.cd = fight.interval * (isPartyAtt ? company(att).pace : 1); att.atkN = (att.atkN || 0) + 1;   // atkN: the renderer starts the attack clip (a Drillmaster's pace)
    att.atkKind = heavy ? 'heavy' : att.atkN % 2 ? 'a' : 'b';
    const aStats = isPartyAtt ? { ...combatStats(att), lvl: att.level, src: att } : att;   // Bless counts on the swing
    const hit = () => {
      if (!(isPartyAtt ? tgt.hp > 0 && !tgt.dead : alive(tgt))) return;
      let pw = power, critMul = 1;
      if (isPartyAtt && att.cls === 'mage' && clustered(tgt, w.enemies)) pw *= CLUSTER_ATK;
      if (isPartyAtt && att.cls === 'rogue' && behind(att, tgt)) critMul = BACKSTAB_CRIT;
      if (isPartyAtt) {                                           // a sellsword's way of fighting (companions.js)
        if (has(att, 'skirmisher') && tgt.aim !== att) pw *= FIGHT.skirmisher;
        if (has(att, 'finisher') && tgt.hp < tgt.maxHp / 2) pw *= FIGHT.finisher;
        if (has(att, 'last_stand') && att.hp < statsFor(att).maxHp / 4) pw *= FIGHT.last_stand;
        const dead = fam(w).undead(tgt.kind);
        if ((has(att, 'grave_warden') && dead) || (has(att, 'redhand_breaker') && !dead)) pw *= FIGHT.warden;
      }
      const r = resolve(isPartyAtt ? aStats : hexAtk(aStats), isPartyAtt ? hexDef(tgt) : combatStats(tgt), pw, bonus, critMul);   // the defender's guards count when the blow lands (a Hex: both ways)
      applyHit(aStats, tgt, r, !isPartyAtt, w, heavy);
      if (r.crit && isPartyAtt && att.cls === 'rogue' && hasPassive(att)) att.mp = Math.min(statsFor(att).maxMp, att.mp + 5);   // Opportunist
      if (heavy) bus.emit('combat', { t: 'heavy', x: tgt.x, y: tgt.y, party: !isPartyAtt });   // the renderer's impact (shake + flash)
      const splash = ab ? ab.splash || (ab.id === 'firebolt' && has(att, 'kindler') ? FIGHT.kindle : 0) : 0;   // (a Kindler's Firebolt splashes)
      if (splash) for (const o of w.enemies) if (o !== tgt && !o.dead && o.hp > 0 && hypot(o.x - tgt.x, o.y - tgt.y) < 1.8) applyHit(aStats, o, resolve(aStats, o, splash * c.mult), false, w);
      if (ab && ab.poison && tgt.hp > 0) tgt.poison = { t: ab.pdur + (has(att, 'venomous') ? FIGHT.venom : 0), dps: aStats.atk * ab.poison * c.mult, acc: 0, by: att };
      if (ab && ab.drain && tgt.hp > 0) {                          // Spirit Drain: one more stack, and they all run again
        const d = tgt.drain || (tgt.drain = { n: 0, t: 0, acc: 0, dps: 0, by: att });
        d.n = Math.min(drainCap(att, ab), d.n + 1); d.t = ab.ddur + (has(att, 'deep_drinker') ? FIGHT.drink : 0); d.dps = aStats.atk * ab.drain * c.mult; d.by = att;
      }
    };
    if (ab) bus.emit('combat', { t: 'ability', x: att.x, y: att.y, name: ab.name });
    const bolt = isPartyAtt ? fight.bolt : att.bolt;
    const standing = () => (isPartyAtt ? !att.down : att.hp > 0 && !att.dead);
    pending.push({ t: heavy ? WINDUP_HEAVY : WINDUP, fn: () => {
      if (!standing()) return;                               // cut down mid-swing
      if (bolt) { const d = hypot(tgt.x - att.x, tgt.y - att.y); w.projectiles.push({ x: att.x, y: att.y, px: att.x, py: att.y, sx: att.x, sy: att.y, tgt, t: 0, dur: d / BOLT_SPEED, kind: ab && att.cls === 'mage' ? 'fire' : bolt, hit }); }
      else hit();
    } });
  }

  // ── movement ────────────────────────────────────────────────────────────────
  // Units ease into and out of their stride (critic pass 3: instant starts and stops): the
  // speed along the step ramps at STEP_ACC; a unit that hasn't stepped for a couple of ticks
  // starts again from rest.
  const STEP_ACC = 40;
  let stepN = 0;
  function stepToward(u, tx, ty, speed, dt, w, room) {
    const dx = tx - u.x, dy = ty - u.y, d = hypot(dx, dy); if (d < 0.05) { u.moving = false; u.spd = 0; return; }
    if ((u.stepAt ?? -9) < stepN - 2) u.spd = 0;
    u.stepAt = stepN; u.spd = Math.min(speed, (u.spd || 0) + STEP_ACC * dt);
    const s = Math.min(d, u.spd * dt), nx = u.x + (dx / d) * s, ny = u.y + (dy / d) * s;
    const r = u.rad || 0, ok = (x, y) => fits(w, x, y, r) && (room === undefined || roomAt(w, x, y) === room);
    if (ok(nx, ny)) { u.x = nx; u.y = ny; } else if (ok(nx, u.y)) u.x = nx; else if (ok(u.x, ny)) u.y = ny;
    u.moving = true; u.fx = dx; u.fy = dy;
  }
  // Distance field (BFS, 8-way, no corner cutting) to a target cell over the room grid.
  function field(tx, ty) {
    const b = battle, g = b.grid, cx = Math.floor(tx) - g.x0, cy = Math.floor(ty) - g.y0, key = cy * g.gw + cx;
    let f = b.fields.get(key); if (f) return f;
    if (b.fields.size > 48) b.fields.clear();
    f = new Uint16Array(g.gw * g.gh).fill(65535);
    if (cx < 0 || cy < 0 || cx >= g.gw || cy >= g.gh) { b.fields.set(key, f); return f; }
    const q = new Int32Array(g.gw * g.gh); let h = 0, t = 0; f[key] = 0; q[t++] = key;
    while (h < t) {
      const i = q[h++], x = i % g.gw, y = (i / g.gw) | 0, d = f[i] + 1;
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
        if (!dx && !dy) continue;
        const nx = x + dx, ny = y + dy; if (nx < 0 || ny < 0 || nx >= g.gw || ny >= g.gh) continue;
        const j = ny * g.gw + nx; if (!g.walk[j] || f[j] !== 65535) continue;
        if (dx && dy && (!g.walk[y * g.gw + nx] || !g.walk[ny * g.gw + x])) continue;
        f[j] = d; q[t++] = j;
      }
    }
    b.fields.set(key, f); return f;
  }
  // a body of radius r fits at (x, y): its four corners stand on walkable ground (the hero's
  // collision in core.js; other units are points, r = 0)
  const fits = (w, x, y, r) => (r ? isWalkable(w, x - r, y - r) && isWalkable(w, x + r, y - r) && isWalkable(w, x - r, y + r) && isWalkable(w, x + r, y + r) : isWalkable(w, x, y));
  const clearLine = (w, ax, ay, bx, by, room, r = 0) => {
    const d = hypot(bx - ax, by - ay), n = Math.ceil(d / 0.4);
    for (let k = 1; k < n; k++) { const x = ax + ((bx - ax) * k) / n, y = ay + ((by - ay) * k) / n; if (!fits(w, x, y, r) || roomAt(w, x, y) !== room) return false; }
    return true;
  };
  // Move toward (tx, ty) inside the battle room: straight when the way is clear, else down the flow field.
  function chase(u, tx, ty, speed, dt, w) {
    const b = battle, room = b.room;
    if (roomAt(w, u.x, u.y) !== room) return stepToward(u, tx, ty, speed, dt, w);   // still in the doorway: walk in
    if (clearLine(w, u.x, u.y, tx, ty, room, u.rad || 0)) return stepToward(u, tx, ty, speed, dt, w, room);
    const g = b.grid, f = field(tx, ty), cx = Math.floor(u.x) - g.x0, cy = Math.floor(u.y) - g.y0;
    let best = -1, bd = cx >= 0 && cy >= 0 && cx < g.gw && cy < g.gh ? f[cy * g.gw + cx] : 65535;
    for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
      const nx = cx + dx, ny = cy + dy; if ((!dx && !dy) || nx < 0 || ny < 0 || nx >= g.gw || ny >= g.gh) continue;
      if (dx && dy && (!g.walk[cy * g.gw + nx] || !g.walk[ny * g.gw + cx])) continue;
      const j = ny * g.gw + nx; if (f[j] < bd) { bd = f[j]; best = j; }
    }
    if (best < 0) return stepToward(u, tx, ty, speed, dt, w, room);
    stepToward(u, g.x0 + (best % g.gw) + 0.5, g.y0 + ((best / g.gw) | 0) + 0.5, speed, dt, w, room);
  }
  // Personal space, measured ON SCREEN: an ellipse SEP_X px wide × SEP_Y px deep (half
  // extents). World-round spacing leaves figures stacked on the screen's vertical (a tile
  // front-to-back is only 4 px), so the push runs in screen space and maps back to the world.
  function separate(units, w, SEP_X = SEP_XB, SEP_Y = SEP_YB, stiff = 1) {   // stiff < 1: a gentle nudge per tick (walking), not a shove
    for (let i = 0; i < units.length; i++) for (let j = i + 1; j < units.length; j++) {
      const a = units[i], b = units[j], dx = b.x - a.x, dy = b.y - a.y;
      let u = ((dx - dy) * 8) / SEP_X, v = ((dx + dy) * 4) / SEP_Y, e = hypot(u, v);
      if (e >= 1) continue;
      if (e < 1e-3) { u = (a.id || i) < (b.id || j) ? -1 : 1; v = 0; e = 1; }       // coincident: part sideways
      const k = ((1 - Math.min(1, e)) * (a.isHero || b.isHero ? 1 : 0.5) * stiff) / e, pu = u * k * SEP_X, pv = v * k * SEP_Y;   // half the gap each, in px
      let px = (pu / 8 + pv / 4) / 2, py = (pv / 4 - pu / 8) / 2;                     // screen px → world tiles
      // ease it: a screen px of height is a quarter tile of depth, so a small overlap on screen
      // shoved a unit ~1.2 tiles in one tick (a visible pop); overlaps now part over a few ticks
      const pl = hypot(px, py); if (pl > MAX_SHOVE) { px *= MAX_SHOVE / pl; py *= MAX_SHOVE / pl; }
      if (!a.isHero && isWalkable(w, a.x - px, a.y - py)) { a.x -= px; a.y -= py; }
      if (!b.isHero && isWalkable(w, b.x + px, b.y + py)) { b.x += px; b.y += py; }
    }
  }
  const nearest = (u, list, pred = () => true, bias = null) => { let best = null, bd = 1e9; for (const o of list) { if (!pred(o)) continue; const d = hypot(o.x - u.x, o.y - u.y) + (bias ? bias(o) : 0); if (d < bd) { bd = d; best = o; } } return best; };
  // formation (GDD §3.5: front fighter, mid rogue, back mage): foes reach for the front line
  // first — the back line counts as this many tiles further away
  const BACKLINE = { fighter: 0, cleric: 1, rogue: 1, mage: 2.5, shaman: 2.5 }, reach = (q) => BACKLINE[q.cls] || 0;

  // Claim (or keep) a melee station around tgt for u this tick; returns its world point.
  let claims = new Map();
  function station(u, tgt, range, w) {
    const r = range - 0.25, taken = claims.get(tgt) || claims.set(tgt, new Set()).get(tgt);
    let best = -1, bd = 1e9;
    // the outer ring is a queue for when all six inner stations are HELD (claimed by attackers); an inner
    // one that's only crowded (someone standing by) sends the unit straight at its target instead. (Both
    // sides had waited on outer rings, out of reach of each other, for good: Garrow and a companion, the
    // hero Downed between them, 2026-09-30.)
    const innerHeld = taken.size >= STATIONS.length;
    for (let k = 0; k < STATIONS.length * 2; k++) {
      if (taken.has(k) || (k >= STATIONS.length && !innerHeld)) continue;
      const ring = k < STATIONS.length ? 1 : 1.75, [ux, uy] = STATIONS[k % STATIONS.length];
      const x = tgt.x + ux * r * ring, y = tgt.y + uy * r * ring;
      if (!isWalkable(w, x, y) || roomAt(w, x, y) !== battle.room) continue;
      if (crowded(x, y, u, tgt)) continue;                                   // someone else already stands there (on screen)
      const cost = hypot(x - u.x, y - u.y) + (k % STATIONS.length < 2 ? 0 : 0.8) + (ring > 1 ? 6 : 0) - (u.slotTgt === tgt && u.slotK === k ? 1.5 : 0);
      if (cost < bd) { bd = cost; best = k; }
    }
    if (best < 0) return null;
    taken.add(best); u.slotTgt = tgt; u.slotK = best;
    const ring = best < STATIONS.length ? 1 : 1.75, [ux, uy] = STATIONS[best % STATIONS.length];
    return { x: tgt.x + ux * r * ring, y: tgt.y + uy * r * ring, inner: ring === 1 };
  }
  // is (x, y) inside another live unit's on-screen personal space? (u and its target excepted)
  let bodies = [];
  const crowded = (x, y, u, tgt) => bodies.some((o) => o !== u && o !== tgt && o.src !== u && o.src !== tgt && hypot(((o.x - x - (o.y - y)) * 8) / SEP_X, ((o.x - x + (o.y - y)) * 4) / SEP_Y) < 0.9);
  const freeStations = (tgt) => STATIONS.length - ((claims.get(tgt) || { size: 0 }).size);
  // Melee: hold a station beside the target and swing when in reach; never slide mid-swing.
  function melee(u, tgt, F, dt, w, isParty, move) {
    const d = hypot(tgt.x - u.x, tgt.y - u.y), st = station(u, tgt, F.range, w);
    const inReach = d <= F.range + 0.25;
    if (inReach && u.cd <= 0) { u.moving = false; attack(u, tgt, isParty, w, F, isParty ? pickStrike(u, tgt) : null); return; }
    if (u.act > 0.12) { u.moving = false; return; }                     // finishing the swing
    const goal = st || tgt;
    if (hypot(goal.x - u.x, goal.y - u.y) > 0.4 && !(inReach && !st)) move(goal.x, goal.y);
    else u.moving = false;
  }

  // Ranged: hold a stand-off (2026-10-03: a bow rogue spent 26–29 % of a level-6 fight within 3.5 tiles of a foe, a
  // mage companion 18 %; they backed off only once a foe was within keepAway, 3.0–3.2, and melee reaches 2.8–3).
  // Keep min(KEEP_CLEAR, range − 0.5) tiles from EVERY foe: inside it, step away from the press (each foe pushing by
  // its nearness), round a wall if one's behind; shoot when ready unless a foe is nearly on you, and from wherever you
  // stand when there's nowhere left to go. Otherwise close to the range and shoot.
  const KEEP_CLEAR = 5, FLEE_TURNS = [0, 0.7, -0.7, 1.4, -1.4];
  function ranged(u, tgt, F, foes, w, isParty, move, flee) {
    const d = hypot(tgt.x - u.x, tgt.y - u.y), keep = Math.min(KEEP_CLEAR, F.range - 0.5);
    let px = 0, py = 0, near = Infinity;
    for (const e of foes) { const ex = u.x - e.x, ey = u.y - e.y, de = hypot(ex, ey) || 0.01; near = Math.min(near, de); if (de < keep) { const k = (keep - de) / keep; px += (ex / de) * k; py += (ey / de) * k; } }
    if (u.act > 0.12) { u.moving = false; return; }                     // finishing the shot
    const shoot = () => { u.moving = false; if (u.cd <= 0) attack(u, tgt, isParty, w, F, isParty ? pickStrike(u, tgt) : null); };
    if (near < keep) {
      if (d <= F.range && u.cd <= 0 && near > 3.4) { shoot(); return; }   // a shot first, while nothing's in reach of you
      const L = hypot(px, py) || 1, ux = px / L, uy = py / L;
      for (const a of FLEE_TURNS) {                                      // away, or round the wall that's behind you
        const c = cos(a), sn = sin(a), gx = u.x + (ux * c - uy * sn) * 2.5, gy = u.y + (ux * sn + uy * c) * 2.5;
        if (isWalkable(w, gx, gy) && roomAt(w, gx, gy) === battle.room) { const x0 = u.x, y0 = u.y; flee(gx, gy); if (u.x !== x0 || u.y !== y0) return; }
      }
      if (d <= F.range) { shoot(); return; }                             // cornered: stand and shoot
    }
    if (d > F.range) move(tgt.x, tgt.y); else shoot();
  }

  // ── companions at ease (critic: they huddled on the hero) ────────────────────
  // Formation: a station behind the hero on each side — FORM_BACK tiles back along its heading,
  // FORM_SIDE out to the side, plus a personal offset so the two never mirror each other.
  // Once the hero has stood still a moment they loosen up: each strolls to a spot of its own
  // near its station every few seconds, glances about or fidgets (clips the renderer plays
  // from lookN / fidgetN), and after a longer wait sits down; the hero moving brings them up.
  // The hero fidgets too. Screen-space personal space keeps everyone apart throughout.
  // Stations are laid out in SCREEN pixels (behind the hero's on-screen heading, one to each
  // side) and mapped back to the world: world-space stations put one companion straight
  // above the hero on screen whenever it walked along a world axis.
  const FORM_BACK = 26, FORM_SIDE = 38, EASE_AFTER = 1.5, SIT_AFTER = 15, STROLL = 2.1;
  // on the move (critic pass 3: they stopped and started, and swung across at every turn): each
  // companion matches the hero's velocity plus a spring toward its station (FOLLOW_K per second),
  // eased by FOLLOW_ACC, capped at FOLLOW_MAX; the formation's heading turns over ~FORM_TURN s
  const FOLLOW_K = 2.4, FOLLOW_ACC = 45, FOLLOW_MAX = 12, FORM_TURN = 0.35;
  const formHead = { x: 0.6, y: 0.8 };
  // the hero's breadcrumbs: a companion whose station is round a corner follows these instead
  // of pressing into the wall (and being teleported once it fell far behind)
  const trail = [];
  const lineOpen = (w, ax, ay, bx, by) => { const n = Math.ceil(hypot(bx - ax, by - ay) / 0.3);
    for (let i = 1; i <= n; i++) { const x = ax + ((bx - ax) * i) / n, y = ay + ((by - ay) * i) / n; if (!isWalkable(w, x - 0.25, y - 0.25) || !isWalkable(w, x + 0.25, y + 0.25) || !isWalkable(w, x - 0.25, y + 0.25) || !isWalkable(w, x + 0.25, y - 0.25)) return false; }
    return true; };
  function moveVel(u, vx, vy, dt, w) {                               // ease u's velocity toward (vx, vy), then move with wall sliding
    const dvx = vx - (u.vx || 0), dvy = vy - (u.vy || 0), dv = hypot(dvx, dvy), a = FOLLOW_ACC * dt;
    if (dv <= a) { u.vx = vx; u.vy = vy; } else { u.vx = (u.vx || 0) + (dvx / dv) * a; u.vy = (u.vy || 0) + (dvy / dv) * a; }
    const sp = hypot(u.vx, u.vy); if (sp < 0.05) { u.vx = u.vy = 0; u.moving = false; return; }
    const nx = u.x + u.vx * dt, ny = u.y + u.vy * dt;
    if (isWalkable(w, nx, ny)) { u.x = nx; u.y = ny; } else if (isWalkable(w, nx, u.y)) { u.x = nx; u.vy = 0; } else if (isWalkable(w, u.x, ny)) { u.y = ny; u.vx = 0; } else { u.vx = u.vy = 0; }
    u.moving = sp > 0.6; if (u.moving) { u.fx = u.vx; u.fy = u.vy; }
  }
  const scr2w = (sx, sy) => [(sx / 8 + sy / 4) / 2, (sy / 4 - sx / 8) / 2];      // screen px → world tiles
  const idleRng = mulberry32(streamSeed(seed, 0x1d1e));
  let heroStill = 0, clock = 0;
  function atEase(dt, w, p, H) {
    clock += dt;
    heroStill = p.moving ? 0 : heroStill + dt;
    const last = trail[trail.length - 1];
    if (!last || hypot(p.x - last[0], p.y - last[1]) > 0.5) { trail.push([p.x, p.y]); if (trail.length > 60) trail.shift(); }
    if (last && hypot(p.x - last[0], p.y - last[1]) > 6) trail.length = 0;   // a jump (travel, stairs): start over
    const wx0 = p.fx ?? 0.7, wy0 = p.fy ?? 0.7;                          // heading, on screen
    let hx = (wx0 - wy0) * 8, hy = (wx0 + wy0) * 4; let hl = hypot(hx, hy) || 1; hx /= hl; hy /= hl;
    if (p.moving) { const k = 1 - exp(-dt / FORM_TURN); formHead.x += (hx - formHead.x) * k; formHead.y += (hy - formHead.y) * k; }
    hl = hypot(formHead.x, formHead.y); if (hl > 0.2) { hx = formHead.x / hl; hy = formHead.y / hl; } else { formHead.x = hx; formHead.y = hy; }
    const px_ = -hy, py_ = hx;
    state.party.forEach((m, i) => {
      if (i === 0) {                                                     // the hero: an occasional fidget or glance when idle
        if (heroStill > 4 && clock >= (H.nextFidget ?? 0)) { H.nextFidget = clock + 7 + idleRng() * 8; if (heroStill > 5) (idleRng() < 0.5 ? (H.fidgetN = (H.fidgetN || 0) + 1) : (H.lookN = (H.lookN || 0) + 1)); }
        if (p.moving) H.nextFidget = clock + 5;
        return;
      }
      if (m.down) return;
      const side = i === 1 ? -1 : 1, j = ((m.id || '').length * 7 + i * 13) % 10 / 10 - 0.5;   // a personal offset, stable per companion
      const [ox, oy] = scr2w(-hx * (FORM_BACK + j * 8) + px_ * side * (FORM_SIDE + j * 6), -hy * (FORM_BACK + j * 8) + py_ * side * (FORM_SIDE + j * 6));
      let sx = p.x + ox, sy = p.y + oy;
      // a station inside a wall (a corridor): pull it in toward the hero until it's open floor, so
      // they fall in behind rather than scraping along the wall
      const open = (x, y) => isWalkable(w, x, y) && isWalkable(w, x - 0.3, y - 0.3) && isWalkable(w, x + 0.3, y + 0.3) && isWalkable(w, x - 0.3, y + 0.3) && isWalkable(w, x + 0.3, y - 0.3);
      if (!open(sx, sy)) for (const t of [0.8, 0.6, 0.4, 0.2]) { const qx = p.x + ox * t, qy = p.y + oy * t; if (open(qx, qy)) { sx = qx; sy = qy; break; } }
      if (heroStill < EASE_AFTER) {                                      // on the move: keep station
        m.sitting = false; m.ease = null;
        let ex = sx - m.x, ey = sy - m.y, d = hypot(ex, ey);
        let vx = (p.vx || 0) + ex * FOLLOW_K, vy = (p.vy || 0) + ey * FOLLOW_K;
        if (d > 0.8 && !lineOpen(w, m.x, m.y, sx, sy)) {                 // station round a corner: follow the hero's trail
          let c = null; for (let t = trail.length - 1; t >= 0; t--) if (lineOpen(w, m.x, m.y, trail[t][0], trail[t][1])) { c = trail[t]; break; }
          if (c) { ex = c[0] - m.x; ey = c[1] - m.y; const dc = hypot(ex, ey) || 1, sp = hypot(p.vx || 0, p.vy || 0) + 2.5; vx = (ex / dc) * sp; vy = (ey / dc) * sp; }
        }
        const v = hypot(vx, vy); if (v > FOLLOW_MAX) { vx *= FOLLOW_MAX / v; vy *= FOLLOW_MAX / v; }
        if (!p.moving && d < 0.35) { vx = 0; vy = 0; }                   // settled on station
        moveVel(m, vx, vy, dt, w);
        return;
      }
      m.vx = m.vy = 0;
      if (m.sitting) { m.moving = false; return; }
      const e = m.ease || (m.ease = { next: clock + idleRng() * 2, gx: m.x, gy: m.y });
      if (clock >= e.next) {                                             // a new spot, and maybe a gesture
        const [dx, dy] = scr2w((idleRng() - 0.5) * 30, (idleRng() - 0.5) * 16);   // a spot near the station, mostly sideways on screen
        const gx = sx + dx, gy = sy + dy;
        if (isWalkable(w, gx, gy)) { e.gx = gx; e.gy = gy; }
        e.next = clock + 4 + idleRng() * 6;
        const k = idleRng();
        if (k < 0.3) m.fidgetN = (m.fidgetN || 0) + 1;
        else if (k < 0.6) { m.lookN = (m.lookN || 0) + 1; const la = idleRng() * Math.PI * 2; m.fx = cos(la); m.fy = sin(la); }
        else { m.fx = p.x - m.x; m.fy = p.y - m.y; }                    // turn to the hero
      }
      const d = hypot(e.gx - m.x, e.gy - m.y);
      if (d > 0.3) stepToward(m, e.gx, e.gy, STROLL, dt, w); else m.moving = false;
      if (heroStill > SIT_AFTER + i * 2.5 && !m.moving) { m.sitting = true; m.fx = p.x - m.x; m.fy = p.y - m.y; }   // settle down, facing the hero
    });
    separate([{ ...H, x: p.x, y: p.y, isHero: true }, ...state.party.slice(1).filter((m) => !m.down)], w, 36, 24, heroStill < EASE_AFTER ? 0.3 : 1);   // roomier than in a melee
  }

  // a boss's signature mechanic, each tick it stands
  /** a spot beside someone, on the floor: (x, y) if it's walkable, else the nearest walkable tile within 3,
   * else where they stand (an escort put at a fixed offset could land in a pool, or a wall) */
  function onFloor(w, x, y, fx, fy) {
    if (isWalkable(w, x, y)) return [x, y];
    const tx = Math.floor(x), ty = Math.floor(y);
    for (let d = 1; d <= 3; d++) for (let dy = -d; dy <= d; dy++) for (let dx = -d; dx <= d; dx++) {
      if (Math.max(Math.abs(dx), Math.abs(dy)) !== d) continue;
      if (isWalkable(w, tx + dx + 0.5, ty + dy + 0.5)) return [tx + dx + 0.5, ty + dy + 0.5];
    }
    return [fx, fy];
  }
  function bossMech(e, w, dt) {
    const B = BOSSES[e.boss], F = fam(w), tough = battle && battle.tower ? towerK() : 1 + PREMIUM * Math.max(0, e.lvl - 3), esc = e.escort || B.escort;
    if (B.mech === 'call' && e.called < 2 && e.hp < e.maxHp * (2 - e.called) / 3) {
      e.called++;
      e.guards = esc.map((k, i) => { const [cx, cy] = onFloor(w, e.x + (i ? 1.3 : -1.3), e.y + 0.8, e.x, e.y); return foe(w, k, e.lvl, cx, cy, tough, false, F).id; });
      bus.emit('bossCall', { id: e.boss, x: e.x, y: e.y });
    } else if (B.mech === 'kindle' && (e.kindleT += dt) >= KINDLE_S) {
      e.kindleT = 0;
      const at = battle && battle.lastSlain;
      if (at) { const u = foe(w, 'minion', e.lvl, at.x, at.y, tough, false, FAMILIES.ashbound); u.undead = true; battle.lastSlain = null; bus.emit('bossKindle', { id: e.boss, x: at.x, y: at.y }); }
    } else if (B.mech === 'swarm' && (e.swarmT += dt) >= SWARM_S) {
      // out of the tunnels: two of the escort's kinds at the hall cells furthest from him among four draws (the
      // battle's own stream; only this hall draws it), never more than SWARM_MAX of his up at once
      e.swarmT = 0;
      const up = (w.enemies || []).filter((o) => o.swarm === e.id && o.hp > 0 && !o.dead).length, n = Math.min(2, SWARM_MAX - up), cells = battle ? battle.cells : [];
      for (let i = 0; i < n && cells.length; i++) {
        let best = null, bd = -1;
        for (let t = 0; t < 4; t++) { const c = cells[(rng() * cells.length) | 0], d = hypot(c[0] + 0.5 - e.x, c[1] + 0.5 - e.y); if (d > bd && isWalkable(w, c[0] + 0.5, c[1] + 0.5)) { bd = d; best = c; } }
        if (!best) continue;
        const u = foe(w, esc[i % esc.length], e.lvl, best[0] + 0.5, best[1] + 0.5, tough, false, F); u.swarm = e.id;
      }
      if (n > 0) bus.emit('bossSwarm', { id: e.boss, x: e.x, y: e.y, n });
    }
  }

  // ── the step ────────────────────────────────────────────────────────────────
  function step(dt) {
    stepN++;
    const w = getWorld(), p = state.player, H = hero();
    p.steer = (p.steer ?? 1e9) + dt;
    ensureRuntime(w, dt);
    // last tick's positions, so the renderer can interpolate every unit between 20 Hz steps
    for (const m of state.party) { m.px = m.x; m.py = m.y; }
    for (const e of w.enemies || []) { e.px = e.x; e.py = e.y; }
    for (const b of w.projectiles || []) { b.px = b.x; b.py = b.y; }
    const inDungeon = w.kind === 'dungeon';
    const room = inDungeon ? roomAt(w, p.x, p.y) : -1;
    if (battle && room !== battle.room) endBattle(w, 'left');
    // (a hall where a found companion still waits, his captor fallen, is quiet: the Company left him there
    // (npcs.js placeFound); and for the rest of the visit once he's walked out of it with you)
    const waiting = hallHere(w, room) && (w.freedHall === room || (w.npcs || []).some((n) => n.found && (state.bosses || {})[n.boss]));
    if (!battle && inDungeon && room >= 0 && w.level.entrance && room !== w.level.entrance.id && alive(H) && !waiting) startBattle(w, room);

    // regen: ×5 out of a fight (corridors, the overland, towns); a room's lulls are a breath (×1.5 for 4 s)
    const calm = !battle, lull = !!battle && battle.between;
    for (const m of state.party) {
      if (m.down || m.fallen) continue;
      const s = statsFor(m), k = calm ? OUT_OF_BATTLE_REGEN : lull ? LULL_REGEN : 1;
      const iron = m.cls === 'fighter' && m.hp < s.maxHp * 0.3 && hasPassive(m) ? 2 : 1;             // Iron Hide
      m.hp = Math.min(s.maxHp, m.hp + s.hpr * k * iron * (battle ? company(m).hpr : 1) * dt);       // (an Old Campaigner's regen, in a fight)
      if (battle && has(m, 'field_medic') && (m.medicT = (m.medicT || 0) + dt) >= FIGHT.medicEvery) {   // a Field Medic sees to the most hurt
        m.medicT = 0; let low = null, lo = 1;
        for (const q of state.party) if (alive(q)) { const f = q.hp / statsFor(q).maxHp; if (f < lo) { lo = f; low = q; } }
        if (low) { const qs = statsFor(low), n = Math.round(qs.maxHp * FIGHT.medicHeal); low.hp = Math.min(qs.maxHp, low.hp + n); bus.emit('combat', { t: 'heal', x: low.x, y: low.y, amount: n }); }
      } m.mp = Math.min(s.maxMp, m.mp + s.mpr * k * dt);   // regen grows with the pool, plus gear regen
      if (m.buff && m.buff.breath > 0) m.hp = Math.min(s.maxHp, m.hp + s.maxHp * m.buff.breathK * dt);   // Ancestors' Breath
      if (m.buff) { m.buff.wall = Math.max(0, (m.buff.wall || 0) - dt); m.buff.smoke = Math.max(0, (m.buff.smoke || 0) - dt); m.buff.bless = Math.max(0, (m.buff.bless || 0) - dt); m.buff.breath = Math.max(0, (m.buff.breath || 0) - dt); }
      m.cd = Math.max(0, m.cd - dt); m.act = Math.max(0, m.act - dt); m.flash = Math.max(0, (m.flash || 0) - dt);
    }
    // companions out of battle: follow in formation, loosen up when the hero stands still
    const foes = battle ? w.enemies.filter((e) => !e.dead && e.hp > 0 && e.spawn <= 0) : [];
    if (!foes.length) atEase(dt, w, p, H);
    calmT = foes.length || (battle && !battle.between && battle.wave > 0) ? 0 : calmT + dt;   // (a wave between its last fall and its lull isn't calm yet)
    if (calmT >= CAGE_PICKUP_S && inDungeon && alive(H)) pickCages(w, p);
    if (battle) {
      // waves
      if (!foes.length && !w.enemies.some((e) => e.dead > 0 || e.spawn > 0)) {
        if (battle.wave > 0 && !battle.between) {               // a wave just fell: start the lull
          battle.between = true; battle.lull = LULL;
          bus.emit('wave', { wave: battle.wave, level: battle.level, cleared: true, room: battle.room, tower: !!battle.tower });
          if (battle.tower) towerCleared();                        // the Mere Tower pays by the wave, and banks at a landing
          else onDrop('wave', battle.level, p.x, p.y);             // now and then a fallen wave leaves something behind
          for (const m of state.party) if (alive(m) && m.downs && (m.stood = (m.stood || 0) + 1) >= WIND) { m.downs = 0; m.stood = 0; }
          for (const m of state.party) if (m.down) {                // the fallen get back up in the lull
            m.down = false; m.hp = Math.max(1, Math.round(statsFor(m).maxHp * REVIVE));
            bus.emit('combat', { t: 'rise', x: m.x, y: m.y, name: m.name });
          }
        }
        battle.lull -= dt;
        if (battle.lull <= 0 && !battle.quiet) { battle.between = false; spawnWave(w); }   // the room doesn't wait for you (but a hall whose boss fell is quiet)
      }
      claims = new Map();
      bodies = [...(alive(H) ? [{ x: p.x, y: p.y, src: H }] : []), ...state.party.slice(1).filter(alive), ...w.enemies.filter((e) => e.hp > 0 && !e.dead && !(e.spawn > 0))];   // (the Downed take up no room)
      const focus = focusId && foes.find((e) => e.id === focusId);
      // party AI
      state.party.forEach((m, i) => {
        if (!alive(m) || !foes.length) return;
        const F = fightOf(m), stance = stanceOf(m);
        // Defensive companions fight only what comes near the leader, and fall back to it otherwise
        const near = i > 0 && stance === 'defensive' && !F.bolt ? foes.filter((e) => hypot(e.x - p.x, e.y - p.y) < DEF_LEASH) : foes;
        if (!near.length) { if (hypot(p.x - m.x, p.y - m.y) > 2.5) chase(m, p.x, p.y, F.speed, dt, w); else m.moving = false; return; }
        // a fighter guards the leader — while it stands: guarding a Downed hero, one stood idle 45 s
        // on a far station beside two foes hitting it
        const guard = m.cls === 'fighter' && i > 0 && stance !== 'aggressive' && alive(H);
        let tgt = (focus && near.includes(focus) ? focus : null) || (m.cls === 'rogue' ? near.reduce((a, b) => (b.hp < a.hp ? b : a)) : guard ? nearest(H, near) : nearest(m, near));
        if (!tgt) return;

        const d = hypot(tgt.x - m.x, tgt.y - m.y);
        m.fx = tgt.x - m.x; m.fy = tgt.y - m.y;
        if (i === 0 && p.moving) return;                        // the hero is yours while you steer
        if (m.cd <= 0 && m.act <= 0.12 && tryUtility(m, i, foes, w, F)) return;
        if (i === 0) {                                          // …and autobattles when you let go
          if ((p.steer ?? 1e9) < AUTO_DELAY || !moveHero) { if (d <= F.range + 0.25 && m.cd <= 0) attack(m, tgt, true, w, F, pickStrike(m, tgt)); return; }
          // autobattle: take a station, leashed to the room (a ranged hero holds its stand-off instead)
          // a probe steps first (the hero's collision decides the real move); it carries the stride
          // ramp (spd, stepAt) across ticks — a fresh probe restarted it every tick, pinning the
          // hero at the first step: 2 tiles/s instead of the fighter's 6.8
          // (with the hero's body: a point probe cut a pillar's corner the real hero couldn't, and the
          // hero stood pressed against it for good while a mage behind it shot it down, seed 4242)
          const heroMove = (step) => (gx, gy) => {
            const q = { x: p.x, y: p.y, spd: m.spd, stepAt: m.stepAt, rad: HERO_R }; step(q, gx, gy);
            m.spd = q.spd; m.stepAt = q.stepAt;
            if (q.x !== p.x || q.y !== p.y) { moveHero(q.x - p.x, q.y - p.y); m.x = p.x; m.y = p.y; }
          };
          const go = heroMove((q, gx, gy) => chase(q, gx, gy, F.speed, dt, w));
          if (F.bolt) ranged(m, tgt, F, foes, w, true, go, heroMove((q, gx, gy) => stepToward(q, gx, gy, F.speed, dt, w, battle.room)));
          else melee(m, tgt, F, dt, w, true, go);
          return;
        }
        if (F.bolt) ranged(m, tgt, F, foes, w, true, (gx, gy) => chase(m, gx, gy, F.speed, dt, w), (gx, gy) => stepToward(m, gx, gy, F.speed, dt, w, battle.room));
        else melee(m, tgt, F, dt, w, true, (gx, gy) => chase(m, gx, gy, F.speed, dt, w));
      });
      // enemy AI (leashed to the room)
      const living = state.party.filter(alive);
      const hidden = living.filter((q) => !(q.buff && q.buff.smoke > 0)), targets = hidden.length ? hidden : living;   // Smoke Step: foes lose you
      const taunts = targets.filter((q) => q.buff && q.buff.wall > 0);                                                // Shield Wall: foes turn on you
      for (const e of [...w.enemies]) {
        e.act = Math.max(0, e.act - dt); e.flash = Math.max(0, e.flash - dt);
        if (e.spawn > 0) { e.spawn -= dt; continue; }
        if (e.dead > 0 || e.hp <= 0) { e.moving = false; continue; }
        if (e.boss) bossMech(e, w, dt);
        if (e.poison) {                                                     // Venom ticks once a second
          e.poison.t -= dt; e.poison.acc += dt;
          while (e.poison && e.poison.acc >= 1 && e.hp > 0) { e.poison.acc -= 1; applyHit(e.poison.by, e, { dmg: Math.max(1, Math.round(e.poison.dps)), crit: false }, false, w); }
          if (e.poison && e.poison.t <= 0) e.poison = null;
          if (e.hp <= 0) continue;
        }
        if (e.drain) {                                                      // Spirit Drain ticks once a second, a stack's worth each
          const d = e.drain; d.t -= dt; d.acc += dt;
          while (e.drain && d.acc >= 1 && e.hp > 0) {
            d.acc -= 1; const n = Math.max(1, Math.round(d.dps * d.n)); applyHit(d.by, e, { dmg: n, crit: false }, false, w);
            let low = null, lo = 1; for (const q of state.party) if (alive(q)) { const f = q.hp / statsFor(q).maxHp; if (f < lo) { lo = f; low = q; } }
            if (low) { const back = Math.max(1, Math.round(n * DRAIN_MEND)); low.hp = Math.min(statsFor(low).maxHp, low.hp + back); }
            if (hasPassive(d.by) && !d.by.down) d.by.mp = Math.min(statsFor(d.by).maxMp, d.by.mp + 1);   // Old Ways
          }
          if (e.drain && e.drain.t <= 0) e.drain = null;
          if (e.hp <= 0) continue;
        }
        if (e.hex) { e.hex.t -= dt; if (e.hex.t <= 0) e.hex = null; }
        const slow = e.slow > 0 ? 0.5 : 1; if (e.slow > 0) e.slow -= dt;     // Frost Nova
        e.cd = Math.max(0, e.cd - dt * slow);
        const taunt = nearest(e, taunts, (q) => hypot(q.x - e.x, q.y - e.y) < 7);
        // melee skeletons pick the nearest party member with a free station (else the nearest)
        const t = taunt || (e.bolt ? nearest(e, targets, undefined, reach) : nearest(e, targets, (q) => freeStations(q) > 0 || e.slotTgt === q, reach) || nearest(e, targets, undefined, reach));
        if (!t) { e.moving = false; continue; }
        const d = hypot(t.x - e.x, t.y - e.y); e.fx = t.x - e.x; e.fy = t.y - e.y; e.aim = t;   // (who it's fighting: a Skirmisher's opening)
        if (e.bolt) { if (d > e.range) chase(e, t.x, t.y, e.speed * slow, dt, w); else { e.moving = false; if (e.cd <= 0) attack(e, t, false, w, e); } }
        else melee(e, t, e, dt, w, false, (gx, gy) => chase(e, gx, gy, e.speed * slow, dt, w));
      }
      separate([...(alive(H) ? [{ ...H, x: p.x, y: p.y, isHero: true }] : []), ...state.party.slice(1).filter(alive), ...w.enemies.filter((e) => !e.dead && e.spawn <= 0)], w);   // (a Downed hero shoves nobody: it had held a boss and the last companion apart for good)
    }
    // wind-ups: blows land and bolts leave on the attack clip's impact frame
    if (pending.length) { const due = []; pending = pending.filter((q) => ((q.t -= dt) > 0 ? true : (due.push(q), false))); if (battle) for (const q of due) q.fn(); }
    // projectiles
    if (w.projectiles) for (const b of w.projectiles) { b.t += dt; const k = Math.min(1, b.t / b.dur); b.x = b.sx + (b.tgt.x - b.sx) * k; b.y = b.sy + (b.tgt.y - b.sy) * k; if (k >= 1 && !b.done) { b.done = true; b.hit(); } }
    if (w.projectiles) w.projectiles = w.projectiles.filter((b) => !b.done);
    // the dead fade, then go
    if (w.enemies && battle) for (const e of w.enemies) if (e.dead > 0) e.dead -= dt;
    if (w.enemies && battle) w.enemies = w.enemies.filter((e) => !(e.hp <= 0 && e.dead <= 0));
  }

  return {
    step,
    get battle() { return battle; },
    focus(id) { focusId = id; },
    reset() { const was = !!battle; if (battle && battle.tower) towerOut(); battle = null; focusId = 0; pending = []; calmT = 0; if (was) downedOut(true); placeCompanions(); },   // travel mid-fight = walking out
    placeCompanions,
    towerClimb,
  };
}
