// items.js — gear (GDD §8): six slots, class items, rarities, seeded rolls. Pure data and
// formulas; loot.js owns the bag, the drops and the equip commands.
//
// An item is plain JSON, rolled once and stored whole:
//   { uid, base, r, ilv, name, st: { atk: 4, … }, aff: [['crit', 2]], mod?, flav?, up?, rf? }
// up = the smith's upgrade, +1 to +5 (smith.js): each step is UP_STEP more on the base stats (st),
// not on the affixes; rf = how many times the smith has reforged it (the next costs double).
// st = the base's stats at that item level and rarity, a pure function of (base, ilv, r): a load
// re-derives it (refreshItem), so a formula change reaches old loot the same as new. What was
// rolled (aff, mod, name, flav) is kept as it fell. aff = rolled affixes (Fine 1, Rare 2);
// mod = a Rare's ability modifier ({ ab, k: 'cost' | 'power', v }).
//
// Gear carries a real share of a hero's power (GDD §7.1, 2026-09-30): an item's stats grow
// GEAR_GROWTH × its base's per-level rate, and the classes grow that much less per level
// themselves (kitGrowth), so a hero in gear at their level has the stats they had before, and
// one in gear five levels old is visibly behind.
// Stat keys: hp, mp, atk, def, crit, dodge (%), hpr, mpr (per second).
// A base belongs to one class (cls), or 'any'; `also` lists other classes that can wear it
// (the cleric can also wear the fighter's shields, plate and sword).

export const SLOTS = ['weapon', 'off', 'helm', 'armor', 'boots', 'trinket'];
export const SLOT_LABEL = { weapon: 'Weapon', off: 'Off-hand', helm: 'Helm', armor: 'Armor', boots: 'Boots', trinket: 'Trinket' };
export const STAT_LABEL = { hp: 'HP', mp: 'MP', atk: 'ATK', def: 'DEF', crit: 'CRIT', dodge: 'DODGE', hpr: 'HP regen', mpr: 'MP regen' };
export const RARITIES = ['common', 'fine', 'rare', 'heirloom'];
const RMULT = { common: 1, fine: 1.15, rare: 1.3, heirloom: 1.45 };
export const SALVAGE = { common: 1, fine: 2, rare: 5, heirloom: 12 };        // cinders (✦; counters.embers in the save)
export const UP_MAX = 5, UP_STEP = 0.08;                                     // the smith's +1…+5: +8 % base stats a step (GDD §8)
// what each step costs at the smith (smith.js): gold × item level, cinders, and from +3 wood and stone each
export const UP_GOLD = [30, 60, 120, 240, 480], UP_CINDERS = [1, 2, 4, 6, 10], UP_MATS = [0, 0, 8, 12, 16];
/** the cinders an item's upgrades took @param {any} it */
export const cindersIn = (it) => UP_CINDERS.slice(0, Math.max(0, Math.min(UP_MAX, it.up || 0))).reduce((x, y) => x + y, 0);
/** what salvaging it gives: its rarity's cinders and half of what its upgrades took @param {any} it */
export const salvageOf = (it) => SALVAGE[it.r] + Math.floor(cindersIn(it) / 2);

// stat value at item level: a + b × ilv + (GEAR_GROWTH − 1) × b × (ilv − 1), × rarity (item level 1
// is as it was: a fresh character in their kit has exactly the GDD numbers)
export const GEAR_GROWTH = 2;
// kind: the line in the item card ("Weapon · two-handed", "Armor · plate")
export const BASES = {
  // ── fighter
  sword:       { name: 'Sword', slot: 'weapon', cls: 'fighter', also: ['cleric'], hands: 1, icon: 'sword_1h', kind: 'sword', st: { atk: [1, 0.35], crit: [1, 0.03] }, metal: true },
  axe:         { name: 'Axe', slot: 'weapon', cls: 'fighter', hands: 1, icon: 'axe_1h', kind: 'axe', st: { atk: [1.2, 0.4] }, metal: true },
  greatsword:  { name: 'Greatsword', slot: 'weapon', cls: 'fighter', hands: 2, icon: 'sword_2h', kind: 'greatsword', st: { atk: [1.8, 0.6], crit: [1, 0.05] }, metal: true },
  greataxe:    { name: 'Great-axe', slot: 'weapon', cls: 'fighter', hands: 2, icon: 'axe_2h', kind: 'great-axe', st: { atk: [2, 0.65] }, metal: true },
  falx:        { name: 'Ashbound Falx', slot: 'weapon', cls: 'fighter', hands: 1, icon: 'skel_blade', kind: 'sword', st: { atk: [1, 0.35], crit: [2, 0.06] } },
  cleaver:     { name: 'Ashbound Cleaver', slot: 'weapon', cls: 'fighter', hands: 2, icon: 'skel_axe', kind: 'great-axe', st: { atk: [2.1, 0.7] } },
  roundshield: { name: 'Round Shield', slot: 'off', cls: 'fighter', also: ['cleric'], icon: 'shield_round', kind: 'shield', st: { def: [1, 0.3] } },
  kite:        { name: 'Kite Shield', slot: 'off', cls: 'fighter', also: ['cleric'], icon: 'shield_badge', kind: 'shield', st: { def: [1.2, 0.32] }, metal: true },
  tower:       { name: 'Tower Shield', slot: 'off', cls: 'fighter', also: ['cleric'], icon: 'shield_rect', kind: 'shield', st: { def: [1.5, 0.4], dodge: [-1, 0] }, metal: true },
  spiked:      { name: 'Spiked Shield', slot: 'off', cls: 'fighter', icon: 'shield_spike', kind: 'shield', st: { def: [0.8, 0.25], atk: [0.5, 0.12] }, metal: true },
  targe:       { name: 'Targe', slot: 'off', cls: 'fighter', icon: 'shield_barb', kind: 'shield', st: { def: [0.9, 0.28], dodge: [1, 0.03] } },
  bonebuckler: { name: 'Ashbound Buckler', slot: 'off', cls: 'fighter', icon: 'skel_shield', kind: 'shield', st: { def: [1, 0.3], hp: [3, 0.8] } },
  greathelm:   { name: 'Great Helm', slot: 'helm', cls: 'fighter', also: ['cleric'], icon: 'helm_plate', kind: 'plate', st: { def: [0.5, 0.15], hp: [3, 1.2] }, metal: true },
  furhood:     { name: 'Bear Hood', slot: 'helm', cls: 'fighter', icon: 'hat_barb', kind: 'fur', st: { def: [0.4, 0.12], hp: [4, 1.5] } },
  plate:       { name: 'Plate Harness', slot: 'armor', cls: 'fighter', also: ['cleric'], icon: 'armor_plate', kind: 'plate', st: { def: [1, 0.35], hp: [5, 2] }, metal: true },
  furmail:     { name: 'Fur Mail', slot: 'armor', cls: 'fighter', icon: 'armor_fur', kind: 'fur', st: { def: [0.8, 0.3], hp: [6, 2.4] } },
  sabatons:    { name: 'Sabatons', slot: 'boots', cls: 'fighter', also: ['cleric'], icon: 'boots_plate', kind: 'plate', st: { def: [0.5, 0.15] }, metal: true },
  furboots:    { name: 'Fur Boots', slot: 'boots', cls: 'fighter', icon: 'boots_fur', kind: 'fur', st: { def: [0.4, 0.1], hp: [2, 0.8] } },
  // ── rogue
  dagger:      { name: 'Dagger', slot: 'weapon', cls: 'rogue', hands: 1, icon: 'knife', kind: 'dagger', st: { atk: [0.9, 0.32], crit: [1, 0.05] }, metal: true },
  // the rogue's bows and crossbows shoot (battle.js SHOT: their range and pace by `shot`)
  handbow:     { name: 'Hand Crossbow', slot: 'weapon', cls: 'rogue', hands: 1, icon: 'crossbow_1h', kind: 'crossbow', shot: 'crossbow', st: { atk: [1.1, 0.36] } },
  heavybow:    { name: 'Heavy Crossbow', slot: 'weapon', cls: 'rogue', hands: 2, icon: 'crossbow_2h', kind: 'heavy crossbow', shot: 'heavy', st: { atk: [1.8, 0.62], crit: [1, 0.04] } },
  bonebow:     { name: 'Ashbound Arbalest', slot: 'weapon', cls: 'rogue', hands: 2, icon: 'skel_crossbow', kind: 'heavy crossbow', shot: 'heavy', st: { atk: [1.7, 0.6], crit: [2, 0.06] } },
  huntbow:     { name: 'Hunting Bow', slot: 'weapon', cls: 'rogue', hands: 2, icon: 'bow_hunting', kind: 'bow', shot: 'bow', st: { atk: [1.4, 0.5], crit: [1, 0.04] } },
  longbow:     { name: 'Yew Longbow', slot: 'weapon', cls: 'rogue', hands: 2, icon: 'bow_long', kind: 'longbow', shot: 'longbow', st: { atk: [1.8, 0.6], crit: [1, 0.05] } },
  offdagger:   { name: 'Parrying Dagger', slot: 'off', cls: 'rogue', icon: 'knife_off', kind: 'off-hand dagger', st: { atk: [0.5, 0.15], dodge: [1, 0.04] }, metal: true },
  hood:        { name: 'Hood', slot: 'helm', cls: 'rogue', icon: 'hood_rogue', kind: 'leather', st: { def: [0.3, 0.1], dodge: [1, 0.04] } },
  leathers:    { name: 'Leathers', slot: 'armor', cls: 'rogue', icon: 'armor_leather', kind: 'leather', st: { def: [0.6, 0.22], dodge: [1, 0.05] } },
  softboots:   { name: 'Soft Boots', slot: 'boots', cls: 'rogue', icon: 'boots_leather', kind: 'leather', st: { def: [0.3, 0.08], dodge: [1, 0.05] } },
  // ── mage
  wand:        { name: 'Wand', slot: 'weapon', cls: 'mage', hands: 1, icon: 'wand', kind: 'wand', st: { atk: [1, 0.36], mp: [3, 1] } },
  staff:       { name: 'Staff', slot: 'weapon', cls: 'mage', hands: 2, icon: 'staff', kind: 'staff', st: { atk: [1.7, 0.6], mp: [5, 1.6] } },
  bonestaff:   { name: 'Ashbound Staff', slot: 'weapon', cls: 'mage', hands: 2, icon: 'skel_staff', kind: 'staff', st: { atk: [1.8, 0.62], mpr: [0.1, 0.02] } },
  tome:        { name: 'Tome', slot: 'off', cls: 'mage', icon: 'tome', kind: 'tome', st: { mp: [4, 1.4], atk: [0.3, 0.1] } },
  witchhat:    { name: 'Witch Hat', slot: 'helm', cls: 'mage', icon: 'hat_mage', kind: 'robes', st: { def: [0.3, 0.08], mp: [3, 1.1] } },
  robes:       { name: 'Robes', slot: 'armor', cls: 'mage', icon: 'armor_robe', kind: 'robes', st: { def: [0.5, 0.18], mp: [4, 1.6] } },
  slippers:    { name: 'Slippers', slot: 'boots', cls: 'mage', icon: 'boots_mage', kind: 'robes', st: { def: [0.2, 0.06], mpr: [0.1, 0.02] } },
  // ── cleric (plus the fighter's sword, shields, great helm, plate and sabatons). The kit the
  // model wears (mace, psalter, vestments, pilgrim boots) carries the same stats the old
  // sword-and-plate kit did, so the class's numbers didn't move when its look changed.
  mace:        { name: 'Mace', slot: 'weapon', cls: 'cleric', hands: 1, icon: 'mace', kind: 'mace', st: { atk: [0.9, 0.32], mp: [2, 0.8] }, metal: true },
  psalter:     { name: 'Chained Psalter', slot: 'off', cls: 'cleric', icon: 'psalter', kind: 'prayer book', st: { def: [1.2, 0.32] } },
  vestments:   { name: 'Vestments', slot: 'armor', cls: 'cleric', icon: 'armor_vestments', kind: 'robes', st: { def: [1, 0.35], hp: [5, 2] } },
  pilgrimboots: { name: 'Pilgrim Boots', slot: 'boots', cls: 'cleric', icon: 'boots_mage', kind: 'leather', st: { def: [0.5, 0.15] } },
  chapelsword: { name: 'Chapel Sword', slot: 'weapon', cls: 'cleric', hands: 1, icon: 'sword_1h', kind: 'sword', st: { atk: [0.9, 0.32], mp: [2, 0.8] }, metal: true },
  hours:       { name: 'Book of Hours', slot: 'off', cls: 'cleric', icon: 'tome', kind: 'prayer book', st: { mp: [4, 1.4], def: [0.3, 0.1] } },
  // ── trinkets (any class)
  ring:        { name: 'Ring', slot: 'trinket', cls: 'any', icon: 'ring', kind: 'ring', st: { atk: [0.5, 0.15] } },
  amulet:      { name: 'Amulet', slot: 'trinket', cls: 'any', icon: 'amulet', kind: 'amulet', st: { hp: [3, 1.5] } },
  charm:       { name: 'Charm', slot: 'trinket', cls: 'any', icon: 'charm', kind: 'charm', st: { crit: [1, 0.08] } },
};
// what each class starts in (Common, item level = the member's level) — the kit the model wears
export const STARTER = {
  fighter: { weapon: 'sword', off: 'roundshield', helm: 'greathelm', armor: 'plate', boots: 'sabatons' },
  rogue: { weapon: 'dagger', off: 'offdagger', helm: 'hood', armor: 'leathers', boots: 'softboots' },
  mage: { weapon: 'staff', helm: 'witchhat', armor: 'robes', boots: 'slippers' },
  cleric: { weapon: 'mace', off: 'psalter', armor: 'vestments', boots: 'pilgrimboots' },   // bareheaded, off-white vestments (a Grey Sister's cleric)
};
export const CLASS_IDS = ['fighter', 'rogue', 'mage', 'cleric'];
/** the classes that can wear a base ([] = any) @param {any} B */
export const classesOf = (B) => (B.cls === 'any' ? [] : [B.cls, ...(B.also || [])]);
export const AFFIX = { atk: [0.5, 0.2], def: [0.5, 0.22], hp: [3, 1.6], mp: [3, 1.2], crit: [1, 0.08], dodge: [1, 0.06], hpr: [0.1, 0.02], mpr: [0.1, 0.02] };
// Rare ability modifiers: each class's ability costs less or hits harder (battle.js applies them)
export const ABILITY_OF = { fighter: 'Cleave', rogue: 'Backstab', mage: 'Firebolt', cleric: 'Mend' };
const FINE_WORDS = ['Tempered', 'Ashwarden', 'Emberforged', 'Grim', 'Barrow-hewn', 'Oakheart', 'Tallowmere', 'Cinderbrand', 'Hollow', 'Gravewatch', 'Black-iron', 'Moss-bound', 'Wickham', 'Pilgrim\'s', 'Lantern-lit'];
const RARE_WORDS = ['the Last Hearth', 'Embers', 'the Barrows', 'Ash', 'the Long Dark', 'Saint Ilse', 'the Drowned Bell', 'Cinders', 'the Hollow King', 'Thornwick', 'Kindling', 'the Pale Road'];
const FLAVOUR = [
  'Forged in Thornwick the winter the wells went black.', 'Heavier than it looks. It was meant to be.', 'Someone scratched a tally of eleven into it.',
  'Still smells of pitch and old smoke.', 'Taken from a barrow. The barrow did not object.', 'The stitching is careful. The bloodstains are not.',
  '"Kept lit through the Long Dark." The metal is still warm.', 'Blessed once. Nobody remembers by whom.', 'It hums when the Ashbound are near.',
  'Bought for a song; the singer never came back for it.', 'The last owner fell holding it. It did not fall.', 'A pilgrim\'s mark is pressed into the leather.',
];

const round = (k, v) => (k === 'hpr' || k === 'mpr' ? Math.max(0.1, Math.round(v * 10) / 10) : v < 0 ? Math.round(v) : Math.max(1, Math.round(v)));
const pick = (rng, a) => a[Math.floor(rng() * a.length)];

// (Low-level common metal was "Worn …", which read as "the one you're wearing" in the bag.)
export function makeItem(base, ilv, r = 'common', { uid, aff = [], mod = null, name, flav } = {}) {
  const B = BASES[base], st = {};
  for (const [k, [a, b]] of Object.entries(B.st)) st[k] = round(k, (a + b * ilv + (GEAR_GROWTH - 1) * b * Math.max(0, ilv - 1)) * (a < 0 ? 1 : RMULT[r]));
  const it = { uid, base, r, ilv, name: name || (r === 'common' && B.metal && ilv <= 2 ? 'Battered ' + B.name : B.name), st, aff };
  if (mod) it.mod = mod;
  if (flav) it.flav = flav;
  return it;
}

// roll a drop: classes = the party's classes (80 % of drops are for one of them)
export function rollItem(rng, { ilv, rarity, classes, uid }) {
  const slot = pick(rng, SLOTS);
  const cls = slot === 'trinket' ? 'any' : rng() < 0.8 && classes.length ? pick(rng, classes) : pick(rng, CLASS_IDS);
  const pool = Object.keys(BASES).filter((k) => BASES[k].slot === slot && (BASES[k].cls === cls || (BASES[k].also || []).includes(cls)));
  const base = pick(rng, pool.length ? pool : Object.keys(BASES).filter((k) => BASES[k].slot === slot));
  const n = rarity === 'rare' ? 2 : rarity === 'fine' ? 1 : 0, aff = [], keys = Object.keys(AFFIX);
  for (let i = 0; i < n; i++) {
    let k = pick(rng, keys); if (aff.some((a) => a[0] === k)) k = pick(rng, keys.filter((q) => !aff.some((a) => a[0] === q)));
    const [a, b] = AFFIX[k]; aff.push([k, round(k, (a + b * ilv) * (0.8 + rng() * 0.4))]);
  }
  let mod = null;
  if (rarity === 'rare') {
    const c = cls === 'any' ? pick(rng, CLASS_IDS) : cls;
    mod = rng() < 0.5 ? { ab: ABILITY_OF[c], k: 'cost', v: 3 } : { ab: ABILITY_OF[c], k: 'power', v: 0.15 };
  }
  const B = BASES[base];
  const name = rarity === 'rare' ? `${B.name} of ${pick(rng, RARE_WORDS)}` : rarity === 'fine' ? `${pick(rng, FINE_WORDS)} ${B.name.replace(/^Ashbound /, '')}` : undefined;
  const flav = rarity !== 'common' ? pick(rng, FLAVOUR) : undefined;
  return makeItem(base, ilv, rarity, { uid, aff, mod, name, flav });
}

// Heirlooms (world doc §9–10): named, with a line of history, found once — a boss's first fall, a
// companion's chain, a hidden vault. Fixed affixes (a Rare's two and one more), rolled at their item
// level like any affix (no dice: an heirloom is the same for everyone).
/** @type {Record<string, { base: string, name: string, flav: string, aff: string[] }>} */
export const HEIRLOOMS = {
  garrows_due: { base: 'ring', name: "Garrow's Due", flav: 'He collected. Everyone paid.', aff: ['crit', 'atk', 'hp'] },
  the_relief: { base: 'amulet', name: 'The Relief', flav: 'Somebody finally came.', aff: ['def', 'hpr', 'hp'] },
  broken_chain: { base: 'charm', name: 'The Broken Chain', flav: 'He kept one link.', aff: ['def', 'hp', 'atk'] },
  last_order: { base: 'amulet', name: 'The Last Order', flav: "It says: hold. It doesn't say for how long.", aff: ['atk', 'def', 'mpr'] },
};
/** an heirloom at an item level @param {string} id @param {number} ilv @param {string} uid */
export function makeHeirloom(id, ilv, uid) {
  const H = HEIRLOOMS[id];
  return makeItem(H.base, ilv, 'heirloom', { uid, name: H.name, flav: H.flav, aff: H.aff.map((k) => { const [a, b] = AFFIX[k]; return [k, round(k, (a + b * ilv) * 1.1)]; }) });
}

export const modText = (m) => (m.k === 'cost' ? `${m.ab} costs ${m.v} less MP` : `${m.ab} hits ${Math.round(m.v * 100)}% harder`);

/** a fresh roll of one affix at an item level, not one of `taken` (the smith's reforge: smith.js)
 * @param {() => number} rng @param {number} ilv @param {string[]} taken @returns {[string, number]} */
export function rollAffix(rng, ilv, taken) {
  const keys = Object.keys(AFFIX).filter((k) => !taken.includes(k)), k = pick(rng, keys), [a, b] = AFFIX[k];
  return [k, round(k, (a + b * ilv) * (0.8 + rng() * 0.4))];
}

// an item's stats: base (+ the smith's upgrade on it) + affixes
export function itemStats(it) {
  const up = Math.max(0, Math.min(UP_MAX, it.up || 0)), s = { ...it.st };
  // (rounded: on a small piece a step's gain can round away. Rounding up instead let a +5 level-3 kit hold
  // a room three levels up for 300 s, against the balance contract; the forge says when a gain won't show)
  if (up) for (const k of Object.keys(s)) if (s[k] > 0) s[k] = round(k, s[k] * (1 + UP_STEP * up));
  for (const [k, v] of it.aff || []) s[k] = Math.round(((s[k] || 0) + v) * 10) / 10;
  return s;
}
export const canWear = (m, it) => { const B = BASES[it.base]; return B.cls === 'any' || B.cls === m.cls || (B.also || []).includes(m.cls); };
export const isTwoHanded = (it) => !!it && BASES[it.base].hands === 2;
/** how the member's weapon shoots ('bow', 'longbow', 'crossbow', 'heavy'), or null for one that doesn't @param {any} m */
export const shotOf = (m) => { const w = m && m.gear && m.gear.weapon; return (w && BASES[w.base] && BASES[w.base].shot) || null; };

// what the member's gear adds, summed
export function gearStats(m) {
  const s = { hp: 0, mp: 0, atk: 0, def: 0, crit: 0, dodge: 0, hpr: 0, mpr: 0 };
  for (const it of Object.values(m.gear || {})) if (it) for (const [k, v] of Object.entries(itemStats(it))) s[k] += v;
  s.hpr = Math.round(s.hpr * 10) / 10; s.mpr = Math.round(s.mpr * 10) / 10;
  return s;
}
// the Rare ability modifiers a member wears, for their own ability
export function abilityMods(m, ab) {
  const out = { cost: 0, power: 0 };
  for (const it of Object.values(m.gear || {})) if (it && it.mod && it.mod.ab === ab) out[it.mod.k] += it.mod.v;
  return out;
}

/** an item's st re-derived from what it is (a load: saves before a formula change) @param {any} it */
export function refreshItem(it) { if (it && BASES[it.base] && Number.isFinite(it.ilv)) it.st = makeItem(it.base, it.ilv, it.r in RMULT ? it.r : 'common').st; return it; }
/** per level, what the class's starting kit adds beyond the one-× rate (the class grows that much
 * less itself: statsFor) @param {string} cls @returns {{ hp: number, mp: number, atk: number, def: number }} */
export function kitGrowth(cls) {
  const g = { hp: 0, mp: 0, atk: 0, def: 0 };
  for (const base of Object.values(STARTER[cls] || {})) for (const [k, [a, b]] of Object.entries(BASES[base].st)) if (k in g && a >= 0) g[k] += (GEAR_GROWTH - 1) * b;
  return g;
}
export function starterKit(m) {
  const g = {}, kit = STARTER[m.cls] || {};
  for (const s of SLOTS) g[s] = kit[s] ? makeItem(kit[s], Math.max(1, m.level), 'common', { uid: `${m.id}:${s}` }) : null;
  return g;
}

// how much better an item is for this member than what they wear (stat-weighted; > 0 = upgrade)
const WEIGHT = {
  fighter: { atk: 1, def: 0.8, hp: 0.08, mp: 0.02, crit: 0.45, dodge: 0.4, hpr: 1.2, mpr: 0.3 },
  rogue: { atk: 1, def: 0.55, hp: 0.07, mp: 0.02, crit: 0.6, dodge: 0.6, hpr: 1, mpr: 0.3 },
  mage: { atk: 1.1, def: 0.45, hp: 0.06, mp: 0.08, crit: 0.4, dodge: 0.35, hpr: 0.8, mpr: 2 },
  cleric: { atk: 0.8, def: 0.9, hp: 0.08, mp: 0.06, crit: 0.3, dodge: 0.3, hpr: 1.2, mpr: 1.6 },
};
const score = (cls, it) => { if (!it) return 0; const w = WEIGHT[cls], s = itemStats(it); let v = 0; for (const k in s) v += (w[k] || 0) * s[k]; return v + (it.mod && it.mod.ab === ABILITY_OF[cls] ? 1.5 : 0); };
export function upgradeScore(m, it) {
  if (!canWear(m, it)) return -Infinity;
  const slot = BASES[it.base].slot, g = m.gear || {};
  let worn = score(m.cls, g[slot]);
  if (isTwoHanded(it)) worn += score(m.cls, g.off);                                  // a 2H weapon also frees the off-hand
  if (slot === 'off' && isTwoHanded(g.weapon)) return -Infinity;                     // can't hold it with a 2H weapon
  return score(m.cls, it) - worn;
}
