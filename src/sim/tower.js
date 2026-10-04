// @ts-check
// tower.js — the Mere Tower (GDD §17 v1.31; world doc v1.23 §3.9, §12): the endless tower, reached for now by Wenna
// Pike's punt from Saltmere's landing (outdoor.js), open from level 12. Its first floor is a landing and the stair hall
// above it; in the hall the waves never stop and never turn back (battle.js reads the rules here):
//   - every wave is a level-9 room's (the gate is 12: at 12 a company in its kit was beaten by wave 6, as in any room of
//     12 before the 9–15 tuning; at 9 it makes the first landing and is held near wave 18), TOUGH[n] times as strong in HP
//     and ATK: +6 % a wave, compounding, from a table built by multiplication (no pow: the same bits on every engine);
//   - a new kind of foe every tenth wave (BLOCKS: whose the waves 1–10, 11–20, … are);
//   - every tenth wave is a warden's (WARDENS, in the world doc's order, then round again), and past it is a landing;
//   - no XP; each wave cleared puts gold and a cinder in the company's satchel, a warden five cinders more;
//   - at a landing the satchel is banked (it's yours), and the hall waits: climb on (`towerClimb`) or go home with
//     Wenna (`towerLeave`); walking out mid-climb, or being beaten, loses what's in the satchel (what was banked at
//     the last landing stays), and a beating in the Tower costs no gold besides;
//   - the climb is durable (save v21): state.tower { wave, best, landing, atLanding, satchel { gold, cinders } }, so
//     a reload mid-climb carries on at the wave it was on. best / landing are the company's own Wall for now (the
//     verified Wall, brackets and the flame clock wait for the validator, M10).
// A warden falls like any boss (state.bosses counts it; its first fall pays a boss's drop, later ones a bossAgain).

export const TOWER = { site: 'mere_tower', level: 9, step: 0.06, landing: 10, gate: 12, gold: 120, cinders: 1, wardenCinders: 5 };
/** whose waves each block of ten is, round and round (battle.js FAMILIES) */
export const BLOCKS = ['ashbound', 'redhand', 'goblin', 'reedmen', 'chapel', 'lockcult', 'diggers', 'harvest', 'drowned'];
// the wardens (world doc §12), shaped as battle.js BOSSES: a `like` kind's stats × their own, one mechanic each, no
// XP and no coin of their own (the satchel pays). Their called men are their block's (battle.js gives them `escort`).
/** @type {Record<string, { name: string, like: string, hp: number, atk: number, def: number, speed?: number, xp: number, gold: number, mech: 'call' | 'kindle' | 'swarm', escort: string[], tower: true, heirloom: string }>} */
export const WARDENS = {
  warden_doorward:   { name: 'The Doorward',    like: 'warrior',   hp: 24, atk: 2.1, def: 1.7, speed: 2.6, xp: 0, gold: 0, mech: 'call',   escort: ['minion', 'rogue'], tower: true, heirloom: 'doorwards_visor' },
  warden_mudlark:    { name: 'The Mudlark',     like: 'fenghoul',  hp: 22, atk: 2.2, def: 1.4, speed: 3.4, xp: 0, gold: 0, mech: 'swarm',  escort: ['minion', 'rogue'], tower: true, heirloom: 'mudlarks_boots' },
  warden_bellringer: { name: 'The Bellringer',  like: 'acolyte',   hp: 30, atk: 2.4, def: 2.0, xp: 0, gold: 0, mech: 'kindle', escort: ['minion', 'rogue'], tower: true, heirloom: 'bell_tongue' },
  warden_lensman:    { name: 'The Lensman',     like: 'crossbow',  hp: 26, atk: 2.5, def: 1.6, xp: 0, gold: 0, mech: 'call',   escort: ['minion', 'rogue'], tower: true, heirloom: 'lensmans_eye' },
  warden_hush:       { name: 'The Hush',        like: 'rogue',     hp: 24, atk: 2.4, def: 1.5, speed: 3.6, xp: 0, gold: 0, mech: 'swarm',  escort: ['minion', 'rogue'], tower: true, heirloom: 'the_hush' },
  warden_twins:      { name: 'The Twins',       like: 'brute',     hp: 28, atk: 2.2, def: 1.8, speed: 2.8, xp: 0, gold: 0, mech: 'call',   escort: ['minion', 'rogue'], tower: true, heirloom: 'twins_ring' },
  warden_hound:      { name: 'The Tower Hound', like: 'goblin',    hp: 24, atk: 2.3, def: 1.5, speed: 4.0, xp: 0, gold: 0, mech: 'swarm',  escort: ['minion', 'rogue'], tower: true, heirloom: 'hounds_collar' },
  warden_gatherer:   { name: 'The Gatherer',    like: 'harvester', hp: 30, atk: 2.3, def: 1.9, xp: 0, gold: 0, mech: 'kindle', escort: ['minion', 'rogue'], tower: true, heirloom: 'gatherers_hook' },
  warden_watcher:    { name: 'The Watcher',     like: 'mage',      hp: 26, atk: 2.6, def: 1.6, xp: 0, gold: 0, mech: 'call',   escort: ['minion', 'rogue'], tower: true, heirloom: 'watchers_hood' },
  warden_starroom:   { name: 'The Star Room',   like: 'warrior',   hp: 34, atk: 2.4, def: 2.0, speed: 2.4, xp: 0, gold: 0, mech: 'kindle', escort: ['minion', 'rogue'], tower: true, heirloom: 'the_star_cut' },
};
const WARDEN_IDS = Object.keys(WARDENS);

// TOUGH[n]: wave n's strength (TOUGH[1] = 1), grown by multiplication as far as a climb has gone
const TOUGH = [1, 1];
/** wave n's HP and ATK multiple: (1 + step)^(n − 1) @param {number} n (1-based) */
export function towerTough(n) {
  const i = Math.max(1, Math.floor(n));
  while (TOUGH.length <= i) TOUGH.push(TOUGH[TOUGH.length - 1] * (1 + TOWER.step));
  return TOUGH[i];
}
/** whose wave n is (a new kind every tenth) @param {number} n */
export const blockFamily = (n) => BLOCKS[Math.floor((Math.max(1, n) - 1) / TOWER.landing) % BLOCKS.length];
/** is wave n a warden's? @param {number} n */
export const wardenWave = (n) => n > 0 && n % TOWER.landing === 0;
/** the warden on wave n (a tenth wave) @param {number} n */
export const wardenAt = (n) => WARDEN_IDS[(Math.floor(n / TOWER.landing) - 1) % WARDEN_IDS.length];
/** the gold wave n puts in the satchel: a room's worth, grown as the foes are @param {number} n */
export const waveGold = (n) => Math.round(TOWER.gold * towerTough(n));
/** @param {any} w a world */
export const inTower = (w) => !!w && w.kind === 'dungeon' && w.site === TOWER.site;

/** @param {any} state */
export function towerOf(state) {
  if (!state.tower) state.tower = fresh();
  if (!state.tower.won) state.tower.won = {};
  return state.tower;
}
const fresh = () => ({ wave: 0, best: 0, landing: 0, atLanding: false, satchel: { gold: 0, cinders: 0 }, won: {} });
// A warden's heirloom (items.js; world doc v1.25 §12) drops the first time the company puts it down in a bracket of the
// hero's level (GDD §17: 15–29, 30–44, 45–59, 60–75; the Tower opens at 12, so 12–14 is a bracket of its own), at the
// bracket's top item level, made for a class in the party. tower.won { [warden]: [bracket indexes won] } (save v23).
export const BRACKETS = [[12, 14], [15, 29], [30, 44], [45, 59], [60, 75]];
/** the bracket a level is in (its index) @param {number} level */
export const bracketOf = (level) => { const i = BRACKETS.findIndex(([a, b]) => level >= a && level <= b); return i >= 0 ? i : level < 12 ? 0 : BRACKETS.length - 1; };
/** a save's climb, read back whole or not at all: non-negative integers @param {any} data */
export function restoreTower(data) {
  const t = data && data.tower, n = (v) => (Number.isInteger(v) && v >= 0 ? v : 0);
  if (!t || typeof t !== 'object') return fresh();
  const s = t.satchel || {}, wave = n(t.wave);
  const won = {}; for (const id of Object.keys(WARDENS)) { const v = t.won && t.won[id]; if (Array.isArray(v)) won[id] = [...new Set(v.filter((b) => Number.isInteger(b) && b >= 0 && b < BRACKETS.length))]; }
  return { wave, best: Math.max(n(t.best), wave), landing: n(t.landing), atLanding: !!t.atLanding && wardenWave(wave), satchel: { gold: n(s.gold), cinders: n(s.cinders) }, won };
}
