// @ts-check
// skills.js — class abilities, ranks, auto-cast and stances (GDD §5, §5.1). Pure data and
// formulas; battle.js casts them, heroes.js owns the commands.
//
// Each class has three abilities (levels 1, 6, 12), a choice of two at 15 and at 18 (the tiers, below) and a passive
// (level 20). An ability unlocks when its level is reached; the level-6 ones (`trial`) also want that class's trial done by the company
// (state.trials, quests.js; M5, docs/m5-plan.md §6): done once, every member of the class knows it.
// (M8, slice 9) The level-12 ones want the class's second trial, taught in the Fens: state.trials[cls + '12'].
// Skill points: one at every even level, derived (never stored), like attribute points.
// Ranks 1–5: +10 % power per rank; ranks 3 and 5 each take 1 MP off the cost.
//
// Kinds (battle.js decides when each is worth casting, by stance):
//   strike — replaces a basic attack: power × ATK (+ splash / crit / poison)
//   guard  — a self buff for `dur` s (Shield Wall: DEF + taunt; Smoke Step: DODGE, drop aggro)
//   heal   — restore `heal` × max HP to self
//   ward   — shield the most hurt ally for `ward` × their max HP
//   nova   — power × ATK to every foe within `radius`, slowed for `slow` s
//   mend   — heal the most hurt ally for `heal` × their max HP (the cleric's heals are +20 %)
//   bless  — the whole party: +`buff` ATK and DEF for `dur` s
//   breath — the whole party: `hot` × max HP back every second and +`buff` ATK for `dur` s (a heal over time)
//   hex    — every foe within `radius` of the thickest knot of them (or a boss or elite alone): −`debuff` ATK and DEF for `dur` s
// A strike may also drain (Spirit Drain): a stack of `drain` × ATK a second for `ddur` s, up to `dmax` stacks (each
// hit adds one and renews them all); every tick mends the most hurt ally for DRAIN_MEND of it. A long fight (a boss)
// is where the stacks pay.

// The tiers (GDD §5.1 v1.55, docs/skill-trees-proposal.md; the owner confirmed all twenty, 2026-11-08): at 15 and 18
// each class has two abilities, `tier` set, and a member carries one of each (its `picks`, by tier; the first, `a`,
// until it chooses: pickOf). The first choice can be made anywhere; changing it after is free at a temple (heroes.js
// pickSkill). Their kinds (battle.js TIER_KINDS decides when each is worth it and what it does; the crowd control
// they bring, stun, freeze, knockdown, root, pull and knockback, is battle.js's too):
//   leap   — Vault: to a foe `min`–`max` tiles off that's striking an ally (or a shooter); `power` on it, `splash` round it, knocked down
//   wave   — Cutting Wave: `power` to every foe in a lane `len` long, `half` either side of it
//   slam   — Earthshatter: `power` round the caster within `radius`, knocked down, then the spikes: `spikes`
//   blades — Whirling Blades: `power` to every foe within `radius` every `every` s for `dur` s
//   kidney — Kidney Shot: quick (WINDUP): `power` and a stun on a foe winding up a heavy blow or a shot, cutting it
//   fan    — Fan of Knives: `power` to every foe in a fan of `arc`° out to `len`
//   step   — Shadowstep: behind the most hurt shooter within `reach`, `power` and a sure crit; foes lose her for `hide` s
//   field  — something planted for `dur` s (Caltrops, Blizzard, Consecrate, Sanctuary, Spirit Totem): see battle.js FIELDS
//   flare  — Flare: a mark on a knot, `power` within `radius` `delay` s later
//   gather — Gather: every foe within `radius` of a knot pulled `pull` tiles in, `power`, slowed `slow` s
//   tomb   — Glacial Tomb: the knot frozen `freeze` s, `power` as it breaks
//   revive — Revive: kneels `kneel` s, then a Downed member up at `hp` of max HP; once a room visit
//   judge  — Judgement: `ring` to every foe within `radius` of the target, then `power` on it `delay` s later; Ashbound ×`undeadK`
//   roots  — Binding Roots: the foes closing on the party rooted `root` s, `power`
//   drum   — Thunder Drum: round a hurt ally, foes knocked back `push` tiles, `power`, stunned `stun` s
// and one strike: Old Marks (`marks`: the third breaks them all, `burst` and a `stun`).
// An area's ability wants two foes in it (`min`), or one while its caster has MP to spare (battle.js SPARE_MP); `pair`: two
// always (a fan's 0.8× or a root's 0.4× on one is less than the strike it takes the place of).
// Their MP (GDD v1.55, measured): a tier's ability spends what a strike would, at least as well (damage a point of MP),
// with its area, its control or its reach on top; dearer, it cost the party 8 % of its damage on the Drowned Choir, the
// strikes it took the place of (Cleave +0.3× for 10, Backstab +0.6× for 10) doing more with the MP.
export const TIERS = /** @type {const} */ ([15, 18]);
export const SKILLS = {
  fighter: [
    { id: 'cleave', name: 'Cleave', lv: 1, mp: 10, kind: 'strike', power: 1.3, splash: 0.65, text: '1.3× to the target and those beside it' },
    { id: 'shield_wall', name: 'Shield Wall', lv: 6, trial: true, mp: 20, kind: 'guard', dur: 6, def: 0.5, taunt: true, text: '+50 % DEF for 6 s; foes turn on you' },
    { id: 'second_wind', name: 'Second Wind', lv: 12, trial: true, mp: 25, kind: 'heal', heal: 0.25, text: 'heal 25 % of max HP' },
    { id: 'vault', name: 'Vault', lv: 15, tier: 15, mp: 14, kind: 'leap', power: 1.5, splash: 0.6, sr: 1.8, knock: 0.8, min: 3, max: 8, text: 'leap to a foe 3–8 tiles off that is striking an ally (or any, with none in reach; never off a boss): 1.5× on it, 0.6× round it, knocked down 0.8 s' },
    { id: 'cutting_wave', name: 'Cutting Wave', lv: 15, tier: 15, mp: 12, kind: 'wave', power: 1.6, len: 6, half: 1.0, text: 'a wave along a lane 6 tiles long: 1.6× to every foe in it' },
    { id: 'earthshatter', name: 'Earthshatter', lv: 18, tier: 18, mp: 22, kind: 'slam', power: 1.2, radius: 3, knock: 1.2, spikes: 0.5, min: 2, text: 'two or more foes round you: 1.2× to every foe within 3 tiles, knocked down 1.2 s; then spikes of rock, 0.5×' },
    { id: 'whirling_blades', name: 'Whirling Blades', lv: 18, tier: 18, mp: 24, kind: 'blades', power: 0.45, radius: 3, every: 0.6, dur: 5, text: 'three swords circle you for 5 s: 0.45× to every foe within 3 tiles every 0.6 s' },
  ],
  rogue: [
    { id: 'backstab', name: 'Backstab', lv: 1, mp: 10, kind: 'strike', power: 1.6, crit: 25, text: '1.6×, +25 % crit chance' },
    { id: 'smoke_step', name: 'Smoke Step', lv: 6, trial: true, mp: 15, kind: 'guard', dur: 5, dodge: 30, text: '+30 % DODGE for 5 s; foes lose you' },
    { id: 'venom', name: 'Venom', lv: 12, trial: true, mp: 20, kind: 'strike', power: 0.8, poison: 0.35, pdur: 6, text: '0.8×, then poison: 0.35× ATK a second for 6 s' },
    { id: 'kidney_shot', name: 'Kidney Shot', lv: 15, tier: 15, mp: 10, kind: 'kidney', power: 1.4, stun: 1.5, text: '1.4× and a 1.5 s stun on a foe winding up a heavy blow or a shot (the blow never lands), or on an elite or a boss' },
    { id: 'fan_of_knives', name: 'Fan of Knives', lv: 15, tier: 15, mp: 12, kind: 'fan', power: 1.0, len: 6, arc: 60, pair: true, text: 'five knives in a 60° fan, 6 tiles: 1.0× to every foe they find (two or more)' },
    { id: 'shadowstep', name: 'Shadowstep', lv: 18, tier: 18, mp: 18, kind: 'step', power: 1.4, reach: 8, hide: 1.5, text: 'behind the most hurt shooter within 8 tiles: 1.4×, a sure crit; foes lose you 1.5 s' },
    { id: 'caltrops', name: 'Caltrops', lv: 18, tier: 18, mp: 16, kind: 'field', field: 'caltrops', radius: 2.5, dur: 6, power: 0.25, slowK: 0.5, reach: 10, min: 2, text: 'a field on a knot of foes for 6 s: slowed by half, 0.25× a second' },
  ],
  mage: [
    { id: 'firebolt', name: 'Firebolt', lv: 1, mp: 12, kind: 'strike', power: 1.8, text: '1.8× at range' },
    { id: 'frost_nova', name: 'Frost Nova', lv: 6, trial: true, mp: 30, kind: 'nova', power: 0.8, radius: 3.5, slow: 3, thrown: true, text: '0.8× to every foe in the thickest knot within reach; slows them for 3 s' },   // (v1.53 thrown, 3.5 tiles: round the mage, who keeps her distance, it never went off, and at 2.8 it could take no two foes: they stand 2.8 apart, their melee reach round whoever they fight)
    { id: 'arcane_ward', name: 'Arcane Ward', lv: 12, trial: true, mp: 25, kind: 'ward', ward: 0.3, text: 'shield the most hurt ally for 30 % of their max HP' },
    { id: 'flare', name: 'Flare', lv: 15, tier: 15, mp: 16, kind: 'flare', power: 2.0, radius: 2.5, delay: 0.7, text: 'a mark on the foe at the heart of a knot; 0.7 s later a pillar of fire where it stands, 2.0× within 2.5 tiles' },
    { id: 'gather', name: 'Gather', lv: 15, tier: 15, mp: 14, kind: 'gather', power: 0.3, radius: 5, pull: 1.5, slow: 1, text: 'every foe within 5 tiles of a knot pulled 1.5 tiles in: 0.3×, slowed 1 s' },
    { id: 'glacial_tomb', name: 'Glacial Tomb', lv: 18, tier: 18, mp: 26, kind: 'tomb', power: 1.0, radius: 3, freeze: 2.5, text: 'a knot of foes frozen 2.5 s (or a boss or elite winding up); 1.0× as the ice breaks' },
    { id: 'blizzard', name: 'Blizzard', lv: 18, tier: 18, mp: 28, kind: 'field', field: 'blizzard', radius: 2.5, dur: 6, power: 0.3, slowK: 0.7, reach: 14, min: 2, text: 'a storm on a knot of foes for 6 s: 0.3× a second, slowed 30 %' },
  ],
  cleric: [
    { id: 'mend', name: 'Mend', lv: 1, mp: 12, kind: 'mend', heal: 0.22, text: 'heal the most hurt ally for 22 % of their max HP' },
    { id: 'bless', name: 'Bless', lv: 6, trial: true, mp: 25, kind: 'bless', buff: 0.15, dur: 8, text: 'the whole party: +15 % ATK and DEF for 8 s' },
    { id: 'turn_undead', name: 'Turn Undead', lv: 12, trial: true, mp: 30, kind: 'nova', power: 1.6, radius: 3, slow: 0, undead: true, text: '1.6× to every Ashbound within 3 tiles (not the living)' },
    { id: 'sanctuary', name: 'Sanctuary', lv: 15, tier: 15, mp: 22, kind: 'field', field: 'sanctuary', radius: 3, dur: 4, heal: 0.04, every: 0.5, ward: 0.1, text: 'a circle under the hurt for 4 s: 4 % of max HP back every 0.5 s, and a ward of 10 % as they step in' },
    { id: 'consecrate', name: 'Consecrate', lv: 15, tier: 15, mp: 20, kind: 'field', field: 'consecrate', radius: 2.5, dur: 8, power: 0.2, undeadK: 0.4, defK: 0.15, reach: 8, min: 2, text: 'holy ground on a knot of foes for 8 s: the Ashbound in it take 0.4× a second, the living 0.2×; allies in it +15 % DEF' },
    { id: 'revive', name: 'Revive', lv: 18, tier: 18, mp: 30, kind: 'revive', kneel: 1.2, hp: 0.4, text: 'kneels 1.2 s and raises a Downed member at 40 % HP; once a room visit (never the Slain)' },
    { id: 'judgement', name: 'Judgement', lv: 18, tier: 18, mp: 28, kind: 'judge', ring: 0.5, power: 2.2, radius: 3, delay: 0.8, undeadK: 1.5, reach: 8, text: 'six pillars round a foe, 0.5× within 3 tiles, then the great pillar on it: 2.2×; the Ashbound ×1.5' },
  ],
  shaman: [
    { id: 'spirit_drain', name: 'Spirit Drain', lv: 1, mp: 9, kind: 'strike', power: 0.7, drain: 0.12, ddur: 8, dmax: 5, text: '0.7× at range, then a stacking drain: 0.12× ATK a second for 8 s, up to 5 stacks; it mends the most hurt ally' },
    { id: 'ancestors_breath', name: "Ancestors' Breath", lv: 6, trial: true, mp: 22, kind: 'breath', hot: 0.05, buff: 0.1, dur: 6, text: 'the whole party: 5 % of max HP back a second and +10 % ATK for 6 s' },
    { id: 'hex', name: 'Hex', lv: 12, trial: true, mp: 22, kind: 'hex', debuff: 0.2, radius: 3.5, dur: 8, text: 'the foes in a knot (or a boss or elite alone): −20 % ATK and DEF for 8 s' },
    { id: 'binding_roots', name: 'Binding Roots', lv: 15, tier: 15, mp: 14, kind: 'roots', power: 0.4, radius: 3, root: 2.5, pair: true, text: 'a knot of foes on foot closing on the party: rooted 2.5 s, 0.4×' },
    { id: 'old_marks', name: 'Old Marks', lv: 15, tier: 15, mp: 9, kind: 'strike', power: 0.8, marks: 3, burst: 1.6, stun: 1, text: '0.8× at range and a mark; the third breaks them all: 1.6× and a 1 s stun' },
    { id: 'spirit_totem', name: 'Spirit Totem', lv: 18, tier: 18, mp: 22, kind: 'field', field: 'totem', radius: 4, dur: 8, every: 1.5, pull: 1, guard: 2.5, guardK: 0.2, text: 'a spirit post by the party for 8 s: every 1.5 s it draws the foes within 4 tiles a tile in; the party within 2.5 take 20 % less' },
    { id: 'thunder_drum', name: 'Thunder Drum', lv: 18, tier: 18, mp: 18, kind: 'drum', power: 0.6, radius: 3, push: 2, stun: 1, text: 'round an ally under half HP: foes within 3 tiles knocked back 2 tiles, 0.6×, dazed 1 s' },
  ],
};
export const PASSIVES = {
  fighter: { id: 'iron_hide', name: 'Iron Hide', lv: 20, text: '+10 % DEF; HP regen doubles below 30 % HP' },
  rogue: { id: 'opportunist', name: 'Opportunist', lv: 20, text: 'critical hits restore 5 MP' },
  mage: { id: 'kindled_mind', name: 'Kindled Mind', lv: 20, text: '+25 % MP regen' },
  cleric: { id: 'lifeline', name: 'Lifeline', lv: 20, text: 'once a room visit, an ally who would be Downed holds on at 1 HP' },
  shaman: { id: 'old_ways', name: 'Old Ways', lv: 20, text: 'Spirit Drain stacks to 8, and every tick of it gives back 1 MP' },
};
export const MAX_RANK = 5;
export const STANCES = /** @type {const} */ (['aggressive', 'balanced', 'defensive']);
export const STANCE_LABEL = { aggressive: 'Aggressive', balanced: 'Balanced', defensive: 'Defensive' };
export const STANCE_TEXT = {
  aggressive: '+10 % ATK, −10 % DEF · chase anything, spend MP freely, heal late',
  balanced: 'no modifiers · abilities as they come',
  defensive: '−10 % ATK, +15 % DEF · stay near the leader, keep half the MP for heals and shields',
};
/** stance stat multipliers */
export const STANCE_MOD = { aggressive: { atk: 1.1, def: 0.9 }, balanced: { atk: 1, def: 1 }, defensive: { atk: 0.9, def: 1.15 } };

/** @param {string} cls */
export const skillsOf = (cls) => SKILLS[cls] || [];
/** @param {string} cls @param {string} id */
export const skillDef = (cls, id) => skillsOf(cls).find((s) => s.id === id) || null;
/** the state.trials key of a class's trial at an ability's level: `cleric` (the 6), `cleric12` @param {string} cls @param {number} lv */
export const trialKey = (cls, lv) => (lv >= 12 ? cls + '12' : cls);
/** a class's two abilities at a tier (15 or 18) @param {string} cls @param {number} tier */
export const tierSkills = (cls, tier) => skillsOf(cls).filter((s) => s.tier === tier);
/** the ability a member carries at a tier: its pick, or the first of the two until it chooses @param {any} m @param {number} tier */
export const pickOf = (m, tier) => { const two = tierSkills(m.cls, tier), id = m.picks && m.picks[tier]; return (two.find((s) => s.id === id) || two[0] || { id: null }).id; };
/** does m carry s? every ability but a tier's, and of a tier's the one it picked @param {any} m @param {{id: string, tier?: number}} s */
export const carries = (m, s) => !s.tier || pickOf(m, s.tier) === s.id;
/** can m use s? it carries it, its level, and for a trial ability, the class's trial at that level done (state.trials)
 * @param {any} m @param {{id: string, lv:number, trial?: boolean, tier?: number}} s @param {Record<string, number> | null | undefined} trials */
export const unlocked = (m, s, trials) => carries(m, s) && (m.level || 1) >= s.lv && (!s.trial || !!(trials && trials[trialKey(m.cls, s.lv)]));
/** the classes that have trials (one level-6 ability each) */
export const TRIAL_CLASSES = Object.keys(SKILLS).filter((c) => SKILLS[c].some((s) => s.trial));
/** @param {any} m @param {string} id */
export const rankOf = (m, id) => Math.max(1, Math.min(MAX_RANK, (m.skills && m.skills[id]) || 1));
/** @param {any} m */
export const hasPassive = (m) => !!PASSIVES[m.cls] && (m.level || 1) >= PASSIVES[m.cls].lv;
/** @param {any} m */
export const skillPointsEarned = (m) => Math.floor((m.level || 1) / 2);
/** @param {any} m */
export const skillPointsSpent = (m) => skillsOf(m.cls).reduce((a, s) => a + rankOf(m, s.id) - 1, 0);
/** @param {any} m */
export const pendingSkillPoints = (m) => Math.max(0, skillPointsEarned(m) - skillPointsSpent(m));
/** power multiplier at a rank @param {number} rank */
export const rankPower = (rank) => 1 + 0.1 * (rank - 1);
/** an ability's strength at a rank: the rank's power × the Rare gear's power mod for it × the member's
 * `power` stat. battle.js casts with it and the Skills tab shows it, so the two can't disagree.
 * @param {number} rank @param {number} [gearPower] @param {number} [statPower] */
export const skillMult = (rank, gearPower = 0, statPower = 0) => rankPower(rank) * (1 + gearPower) * (1 + statPower);
/** the cleric's heals are this much stronger */
export const HEAL_BONUS = 1.2;
/** of what a Spirit Drain tick takes, the most hurt ally gets this much back; Old Ways adds stacks */
export const DRAIN_MEND = 0.5, OLD_WAYS_STACKS = 3;
/** MP cost at a rank @param {{mp:number}} s @param {number} rank */
export const rankCost = (s, rank) => s.mp - (rank >= 3 ? 1 : 0) - (rank >= 5 ? 1 : 0);
/** @param {any} m */
export const stanceOf = (m) => (STANCES.includes(m.stance) ? m.stance : 'balanced');
/** the member's abilities in priority order: the ones it carries, in its order (`prio`), then any it hasn't placed in
 * the class order (a tier's pick, new at 15 or 18, goes last until it's moved) @param {any} m */
export function priorityOf(m) {
  const all = skillsOf(m.cls).filter((s) => carries(m, s)), ids = all.map((s) => s.id);
  const placed = Array.isArray(m.prio) ? m.prio.filter((id, i) => ids.includes(id) && m.prio.indexOf(id) === i) : [];
  return [...placed, ...ids.filter((id) => !placed.includes(id))].map((id) => /** @type {any} */ (all.find((s) => s.id === id)));
}
/** @param {any} m @param {string} id */
export const autocastOn = (m, id) => !(Array.isArray(m.off) && m.off.includes(id));
