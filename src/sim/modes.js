// @ts-check
// modes.js — the rules of each kind of play, in one table (docs/shared-play-rules.md §6, §9; the owner, 2026-11-14,
// decision 6: "the refactor in §6 now, before live raids"). Before, each kind passed its own rules into battle.js (BOUT
// for the Bowl, raidRun().rules for a raid, the Tower's and a spawn point's by `battle.tower` / `battle.camp`) and the
// story was guarded by `if (!raidRun())`, `w.raid` and `!battle.bout` in a dozen places. Now each of those reads a row
// here, so a new kind of play (a live raid, a region boss event) is a row filled in, and what it does to the story,
// the count, a wipe and the loot can be read off the table rather than found.
//
// A row's fields (every row has every field):
//   story     the slot's story is written: a boss's fall counted (state.bosses, his time away), quests' and the board's
//             counts, the Chronicle's finds (lore.js). A raid's are its own.
//   count     lamps and souls (lamps.js credit; decision 3: never in a raid or an event)
//   death     what a wipe costs: 'wipe' (the temple: a quarter of the gold, Weakened), 'satchel' (the Tower's: the climb's
//             satchel, not the purse), 'none' (home, nothing lost: a raid, the owner's "no penalty for loss"),
//             'bout' (the Crier calls it: bowl.js)
//   fallen    a companion down twice in a visit is Fallen
//   boon      a shrine's boon carries into the fight
//   heal, dmg the share of a heal received, of a blow between companies (the Bowl's)
//   bossHome  a hall's boss is always there (else he's away BOSS_BACK after he falls)
//   xp, gold  a kill's XP and coin, × (the Tower pays by the wave instead: tower.js)
//   waves     a room is won after this many waves held (0: the room's own way, a gate's or none)
//   tide      a room's climb, { step, cap } a wave (null: the room's own, tideOf)
//   foeHp, foeAtk  every foe's HP and attack × (a raid's: GDD §18 v1.108), its boss and his escort too
//   loot      'slot' (loot.js DROP at the slot's odds), 'raid' (DROP raid*, for the hero's class: core.js dropHere) or
//             'none' (an event: nothing drops in the fight, its pay is the tier's at the end, ring.js)
// Pure data and nothing imported: battle.js, core.js, quests.js, lore.js and raid.js read it, and nothing here reads them.

// a bout in the Bowl (GDD §17.2 v1.85, docs/bowl-arena-proposal.md §3): crowd control half as long on a company's member;
// healing received × heal; blows between companies × dmg; each member a moment's reaction (react s) at the call; the
// Crier's call (s) before it starts; at secs he calls it on the share of HP standing (a draw within `draw`); the
// companies `gap` tiles apart at their marks; `rest` s after the end before the sand is cleared (battle.js re-exports it)
export const BOUT = { cc: 0.5, heal: 0.75, dmg: 0.5, react: 0.8, secs: 120, draw: 0.02, call: 3, gap: 16, rest: 2.5 };

/** @typedef {{ kind: 'slot' | 'camp' | 'tower' | 'bout' | 'raid' | 'event', story: boolean, count: boolean, death: 'wipe' | 'satchel' | 'none' | 'bout' | 'respawn',
 *   fallen: boolean, boon: boolean, heal: number, dmg: number, bossHome: boolean, xp: number, gold: number, waves: number, foeHp: number, foeAtk: number,
 *   tide: { step: number, cap: number } | null, loot: 'slot' | 'raid' | 'none' }} Mode */

const SLOT = { story: true, count: true, death: 'wipe', fallen: true, boon: true, heal: 1, dmg: 1, bossHome: false, xp: 1, gold: 1, waves: 0, foeHp: 1, foeAtk: 1, tide: null, loot: 'slot' };
/** @type {Readonly<Record<Mode['kind'], Readonly<Mode>>>} */
export const MODES = Object.freeze({
  // single play: everything on (a dungeon's rooms, the overland's fights)
  slot: Object.freeze(/** @type {Mode} */ ({ kind: 'slot', ...SLOT })),
  // a spawn point's fight (camps.js): as the slot's; its band, its level and its respawn are camps.js's
  camp: Object.freeze(/** @type {Mode} */ ({ kind: 'camp', ...SLOT })),
  // the Mere Tower (tower.js): its waves and its pay are its own (by the wave, banked at a landing); a wipe takes the satchel
  tower: Object.freeze(/** @type {Mode} */ ({ kind: 'tower', ...SLOT, death: 'satchel' })),
  // a bout in the Bowl (bowl.js): nobody Fallen, no boon carried in, heals and blows between companies at BOUT's shares
  // (heal and dmg read BOUT as it stands: tools/balance/bowl.mjs tunes them, --heal, --dmg)
  bout: Object.freeze(/** @type {Mode} */ ({ kind: 'bout', ...SLOT, death: 'bout', fallen: false, boon: false, get heal() { return BOUT.heal; }, get dmg() { return BOUT.dmg; } })),
  // a raid (raid.js, GDD §18 v1.97): not the story's and not the count's, no cost to a wipe, nobody Fallen, the boss always
  // home; a room won after ten waves (six before GDD v1.108, the owner: "now 6 waves to drop a gate it should be 10") on
  // +1/9 a wave, +100 % at the tenth (GDD v1.109, the owner: "should also go up to 100% npc increase difficulty, not tap out
  // below 100%": v1.108's +5 % a wave stopped at +45 %), as a slot's room climbs to +100 % over its twenty; every foe twice the HP and 15 % harder (v1.108, the owner: "double the hp of all enemies, and they attack
  // 15% harder"); a kill pays 1.25×; the loot at a raid's odds
  raid: Object.freeze(/** @type {Mode} */ ({ kind: 'raid', ...SLOT, story: false, count: false, death: 'none', fallen: false, bossHome: true, xp: 1.25, gold: 1.25, waves: 10, foeHp: 2, foeAtk: 1.15, tide: Object.freeze({ step: 1 / 9, cap: 1.0 }), loot: 'raid' })),
  // a region boss's event (ring.js, GDD §19 v1.105; shared-play-rules decisions 3–5): not the story's or the count's, no
  // wipe (a Downed member gets up at the edge, RING.respawn), nobody Fallen, no boon carried in, the boss always home, no
  // XP, coin or loot in the fight (the pay is the tier's at the end)
  event: Object.freeze(/** @type {Mode} */ ({ kind: 'event', ...SLOT, story: false, count: false, death: 'respawn', fallen: false, boon: false, bossHome: true, xp: 0, gold: 0, loot: 'none' })),
});

/** the rules of the fight going on: a bout, a raid (raidRun: core.js's run, between rooms too), the Tower, a spawn
 *  point's, or the slot's @param {any} battle battle.js's fight (or null) @param {any} raid the raid being run (or null) @returns {Readonly<Mode>} */
export const modeOf = (battle, raid) => (battle && battle.ring ? MODES.event : battle && battle.bout ? MODES.bout : raid ? MODES.raid : battle && battle.tower ? MODES.tower : battle && battle.camp ? MODES.camp : MODES.slot);
/** the rules of a world you're in, from the world alone (quests.js, lore.js: they see the world, not the fight; a raid's
 *  floor is marked: core.js raidFloor) @param {any} w @returns {Readonly<Mode>} */
export const modeOfWorld = (w) => (w && w.raid ? MODES.raid : MODES.slot);
