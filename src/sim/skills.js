// @ts-check
// skills.js — class abilities, ranks, auto-cast and stances (GDD §5, §5.1). Pure data and
// formulas; battle.js casts them, heroes.js owns the commands.
//
// The ladder (GDD §5.1 v1.56; the owner, 2026-11-09: "One new skill every 3 levels… every 3rd skill is a passive… up to
// 4 active skills for play"): the class's first ability at 1, then a new skill every 3 levels, every third of them a
// passive: abilities at 1, 3, 6, 12, 15, 21, 24, passives at 9, 18, 27 (laid out to 27; the ladder goes on with the
// lands past the Fens). Nothing is chosen between: every skill is learned in its turn. A skill opens at its level; the
// level-6 abilities (`trial`) also want that class's trial done by the company (state.trials, quests.js; M5,
// docs/m5-plan.md §6): done once, every member of the class knows it. (M8, slice 9) The level-12 ones want the class's
// second trial, taught in the Fens: state.trials[cls + '12']. A member takes LOADOUT (4) abilities into a fight
// (`loadout`, heroes.js setLoadout; until it sets them, the first four of its order: inPlay); its passives always work.
// Skill points: one at every even level, derived (never stored), like attribute points; into abilities or passives.
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

// The twenty from the skill trees (GDD v1.55, docs/skill-trees-proposal.md; the owner confirmed them, 2026-11-08), placed on
// the ladder at 3, 15, 21 and 24 (v1.56). Their kinds (battle.js TIER decides when each is worth it and what it does; the
// crowd control they bring, stun, freeze, knockdown, root, pull and knockback, is battle.js's too):
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
// Their MP (GDD v1.55, measured): one of them spends what a strike would, at least as well (damage a point of MP),
// with its area, its control or its reach on top; dearer, it cost the party 8 % of its damage on the Drowned Choir, the
// strikes it took the place of (Cleave +0.3× for 10, Backstab +0.6× for 10) doing more with the MP.
export const SKILLS = {
  fighter: [
    { id: 'cleave', name: 'Cleave', lv: 1, mp: 10, kind: 'strike', power: 1.3, splash: 0.65, text: '1.3× to the target and those beside it' },
    { id: 'cutting_wave', name: 'Cutting Wave', lv: 3, mp: 12, kind: 'wave', power: 1.6, len: 6, half: 1.0, text: 'a wave along a lane 6 tiles long: 1.6× to every foe in it' },
    { id: 'shield_wall', name: 'Shield Wall', lv: 6, trial: true, mp: 20, kind: 'guard', dur: 6, def: 0.5, taunt: true, text: '+50 % DEF for 6 s; foes turn on you' },
    { id: 'second_wind', name: 'Second Wind', lv: 12, trial: true, mp: 25, kind: 'heal', heal: 0.25, text: 'heal 25 % of max HP' },
    { id: 'vault', name: 'Vault', lv: 15, mp: 14, kind: 'leap', power: 1.5, splash: 0.6, sr: 1.8, knock: 0.8, min: 3, max: 8, text: 'leap to a foe 3–8 tiles off that is striking an ally (or any, with none in reach; never off a boss): 1.5× on it, 0.6× round it, knocked down 0.8 s' },
    { id: 'earthshatter', name: 'Earthshatter', lv: 21, mp: 22, kind: 'slam', power: 1.2, radius: 3, knock: 1.2, spikes: 0.5, min: 2, text: 'two or more foes round you: 1.2× to every foe within 3 tiles, knocked down 1.2 s; then spikes of rock, 0.5×' },
    { id: 'whirling_blades', name: 'Whirling Blades', lv: 24, mp: 24, kind: 'blades', power: 0.45, radius: 3, every: 0.6, dur: 5, text: 'three swords circle you for 5 s: 0.45× to every foe within 3 tiles every 0.6 s' },
  ],
  rogue: [
    { id: 'backstab', name: 'Backstab', lv: 1, mp: 10, kind: 'strike', power: 1.6, crit: 25, text: '1.6×, +25 % crit chance' },
    { id: 'kidney_shot', name: 'Kidney Shot', lv: 3, mp: 10, kind: 'kidney', power: 1.4, stun: 1.5, text: '1.4× and a 1.5 s stun on a foe winding up a heavy blow or a shot (the blow never lands), or on an elite or a boss' },
    { id: 'smoke_step', name: 'Smoke Step', lv: 6, trial: true, mp: 15, kind: 'guard', dur: 5, dodge: 30, text: '+30 % DODGE for 5 s; foes lose you' },
    { id: 'venom', name: 'Venom', lv: 12, trial: true, mp: 20, kind: 'strike', power: 0.8, poison: 0.35, pdur: 6, text: '0.8×, then poison: 0.35× ATK a second for 6 s' },
    { id: 'fan_of_knives', name: 'Fan of Knives', lv: 15, mp: 12, kind: 'fan', power: 1.0, len: 6, arc: 60, pair: true, text: 'five knives in a 60° fan, 6 tiles: 1.0× to every foe they find (two or more)' },
    { id: 'shadowstep', name: 'Shadowstep', lv: 21, mp: 18, kind: 'step', power: 1.4, reach: 8, hide: 1.5, text: 'behind the most hurt shooter within 8 tiles: 1.4×, a sure crit; foes lose you 1.5 s' },
    { id: 'caltrops', name: 'Caltrops', lv: 24, mp: 16, kind: 'field', field: 'caltrops', radius: 2.5, dur: 6, power: 0.25, slowK: 0.5, reach: 10, min: 2, text: 'a field on a knot of foes for 6 s: slowed by half, 0.25× a second' },
  ],
  mage: [
    { id: 'firebolt', name: 'Firebolt', lv: 1, mp: 12, kind: 'strike', power: 1.8, text: '1.8× at range' },
    { id: 'flare', name: 'Flare', lv: 3, mp: 18, kind: 'flare', power: 1.5, radius: 2.5, delay: 0.7, pair: true, text: 'a mark on the foe at the heart of a knot; 0.7 s later a pillar of fire where it stands, 1.5× within 2.5 tiles (two foes or more)' },   // (v1.56: the mage's level-3; 2.0× for 16 MP, and on one foe with MP to spare, it outdid her Firebolt: the party with no healer held a level-6 room, the contract's gate)
    { id: 'frost_nova', name: 'Frost Nova', lv: 6, trial: true, mp: 30, kind: 'nova', power: 0.8, radius: 3.5, slow: 3, thrown: true, text: '0.8× to every foe in the thickest knot within reach; slows them for 3 s' },   // (v1.53 thrown, 3.5 tiles: round the mage, who keeps her distance, it never went off, and at 2.8 it could take no two foes: they stand 2.8 apart, their melee reach round whoever they fight)
    { id: 'arcane_ward', name: 'Arcane Ward', lv: 12, trial: true, mp: 25, kind: 'ward', ward: 0.3, text: 'shield the most hurt ally for 30 % of their max HP' },
    { id: 'gather', name: 'Gather', lv: 15, mp: 14, kind: 'gather', power: 0.3, radius: 5, pull: 1.5, slow: 1, text: 'every foe within 5 tiles of a knot pulled 1.5 tiles in: 0.3×, slowed 1 s' },
    { id: 'glacial_tomb', name: 'Glacial Tomb', lv: 21, mp: 26, kind: 'tomb', power: 1.0, radius: 3, freeze: 2.5, text: 'a knot of foes frozen 2.5 s (or a boss or elite winding up); 1.0× as the ice breaks' },
    { id: 'blizzard', name: 'Blizzard', lv: 24, mp: 28, kind: 'field', field: 'blizzard', radius: 2.5, dur: 6, power: 0.3, slowK: 0.7, reach: 14, min: 2, text: 'a storm on a knot of foes for 6 s: 0.3× a second, slowed 30 %' },
  ],
  cleric: [
    { id: 'mend', name: 'Mend', lv: 1, mp: 12, kind: 'mend', heal: 0.22, text: 'heal the most hurt ally for 22 % of their max HP' },
    { id: 'consecrate', name: 'Consecrate', lv: 3, mp: 20, kind: 'field', field: 'consecrate', radius: 2.5, dur: 8, power: 0.2, undeadK: 0.4, defK: 0.15, reach: 8, min: 2, text: 'holy ground on a knot of foes for 8 s: the Ashbound in it take 0.4× a second, the living 0.2×; allies in it +15 % DEF' },
    { id: 'bless', name: 'Bless', lv: 6, trial: true, mp: 25, kind: 'bless', buff: 0.15, dur: 8, text: 'the whole party: +15 % ATK and DEF for 8 s' },
    { id: 'turn_undead', name: 'Turn Undead', lv: 12, trial: true, mp: 30, kind: 'nova', power: 1.6, radius: 3, slow: 0, undead: true, text: '1.6× to every Ashbound within 3 tiles (not the living)' },
    { id: 'sanctuary', name: 'Sanctuary', lv: 15, mp: 22, kind: 'field', field: 'sanctuary', radius: 3, dur: 4, heal: 0.04, every: 0.5, ward: 0.1, text: 'a circle under the hurt for 4 s: 4 % of max HP back every 0.5 s, and a ward of 10 % as they step in' },
    { id: 'judgement', name: 'Judgement', lv: 21, mp: 28, kind: 'judge', ring: 0.5, power: 2.2, radius: 3, delay: 0.8, undeadK: 1.5, reach: 8, text: 'six pillars round a foe, 0.5× within 3 tiles, then the great pillar on it: 2.2×; the Ashbound ×1.5' },
    { id: 'revive', name: 'Revive', lv: 24, mp: 30, kind: 'revive', kneel: 1.2, hp: 0.4, text: 'kneels 1.2 s and raises a Downed member at 40 % HP; once a room visit (never the Slain)' },
  ],
  shaman: [
    { id: 'spirit_drain', name: 'Spirit Drain', lv: 1, mp: 9, kind: 'strike', power: 0.7, drain: 0.12, ddur: 8, dmax: 5, text: '0.7× at range, then a stacking drain: 0.12× ATK a second for 8 s, up to 5 stacks; it mends the most hurt ally' },
    { id: 'old_marks', name: 'Old Marks', lv: 3, mp: 9, kind: 'strike', power: 0.8, marks: 3, burst: 1.6, stun: 1, text: '0.8× at range and a mark; the third breaks them all: 1.6× and a 1 s stun' },
    { id: 'ancestors_breath', name: "Ancestors' Breath", lv: 6, trial: true, mp: 22, kind: 'breath', hot: 0.05, buff: 0.1, dur: 6, text: 'the whole party: 5 % of max HP back a second and +10 % ATK for 6 s' },
    { id: 'hex', name: 'Hex', lv: 12, trial: true, mp: 22, kind: 'hex', debuff: 0.2, radius: 3.5, dur: 8, text: 'the foes in a knot (or a boss or elite alone): −20 % ATK and DEF for 8 s' },
    { id: 'binding_roots', name: 'Binding Roots', lv: 15, mp: 14, kind: 'roots', power: 0.4, radius: 3, root: 2.5, pair: true, text: 'a knot of foes on foot closing on the party: rooted 2.5 s, 0.4×' },
    { id: 'thunder_drum', name: 'Thunder Drum', lv: 21, mp: 18, kind: 'drum', power: 0.6, radius: 3, push: 2, stun: 1, text: 'round an ally under half HP: foes within 3 tiles knocked back 2 tiles, 0.6×, dazed 1 s' },
    { id: 'spirit_totem', name: 'Spirit Totem', lv: 24, mp: 22, kind: 'field', field: 'totem', radius: 4, dur: 8, every: 1.5, pull: 1, guard: 2.5, guardK: 0.2, text: 'a spirit post by the party for 8 s: every 1.5 s it draws the foes within 4 tiles a tile in; the party within 2.5 take 20 % less' },
  ],
};
// The passives (GDD §5.1 v1.56): every third skill on the ladder, at 9, 18 and 27; always at work, no MP, no turn. Like an
// ability, ranks 1–5 bought with skill points: `val` [at rank 1, more a rank]; `fmt` how the Skills tab says it ('pct' a
// share, 'pts' crit points, 'n' a count); `{v}` in `text` is its value at the rank. passiveVal() reads it (0 until its
// level). Where each acts: party.js statsFor (Iron Hide's DEF, Keen Edge's crit, Kindled Mind's regen, Arcane Focus's
// power), battle.js (the rest).
export const PASSIVES = {
  fighter: [
    { id: 'iron_hide', name: 'Iron Hide', lv: 9, passive: true, val: [0.08, 0.02], fmt: 'pct', text: '+{v} DEF; HP regen doubles below 30 % HP' },
    { id: 'hold_the_line', name: 'Hold the Line', lv: 18, passive: true, val: [0.05, 0.01], fmt: 'pct', text: 'allies within 3 tiles of you take {v} less damage' },
    { id: 'heavy_hand', name: 'Heavy Hand', lv: 27, passive: true, val: [0.2, 0.05], fmt: 'pct', text: 'your plain blows also strike the foes beside your target, for {v} of the blow' },
  ],
  rogue: [
    { id: 'opportunist', name: 'Opportunist', lv: 9, passive: true, val: [3, 1], fmt: 'n', text: 'critical hits give back {v} MP' },
    { id: 'keen_edge', name: 'Keen Edge', lv: 18, passive: true, val: [4, 1], fmt: 'pts', text: '+{v} crit chance' },
    { id: 'exploit', name: 'Exploit', lv: 27, passive: true, val: [0.15, 0.05], fmt: 'pct', text: '{v} more damage to a foe that is stunned, frozen, knocked down or rooted' },
  ],
  mage: [
    { id: 'kindled_mind', name: 'Kindled Mind', lv: 9, passive: true, val: [0.15, 0.05], fmt: 'pct', text: '+{v} MP regen' },
    { id: 'arcane_focus', name: 'Arcane Focus', lv: 18, passive: true, val: [0.06, 0.02], fmt: 'pct', text: 'your abilities are {v} stronger' },
    { id: 'frostbite', name: 'Frostbite', lv: 27, passive: true, val: [0.12, 0.03], fmt: 'pct', text: '{v} more damage to a foe that is slowed, chilled or frozen' },
  ],
  cleric: [
    { id: 'lifeline', name: 'Lifeline', lv: 9, passive: true, val: [0.05, 0.03], fmt: 'pct', text: 'once a room visit, an ally who would be Downed holds on at {v} of max HP' },
    { id: 'devotion', name: 'Devotion', lv: 18, passive: true, val: [0.06, 0.02], fmt: 'pct', text: 'your heals are {v} stronger' },
    { id: 'radiance', name: 'Radiance', lv: 27, passive: true, val: [0.004, 0.001], fmt: 'pct', text: 'in a fight, allies within 3 tiles of you mend {v} of max HP a second' },
  ],
  shaman: [
    { id: 'old_ways', name: 'Old Ways', lv: 9, passive: true, val: [1, 1], fmt: 'n', text: 'Spirit Drain stacks {v} higher, and every tick of it gives back 1 MP' },
    { id: 'ancestral_guard', name: 'Ancestral Guard', lv: 18, passive: true, val: [0.08, 0.02], fmt: 'pct', text: 'allies under 30 % HP take {v} less damage' },
    { id: 'deep_hex', name: 'Deep Hex', lv: 27, passive: true, val: [0.08, 0.02], fmt: 'pct', text: 'foes you hex take {v} more damage' },
  ],
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

/** a class's active abilities, in the ladder's order @param {string} cls */
export const skillsOf = (cls) => SKILLS[cls] || [];
/** a class's passives @param {string} cls */
export const passivesOf = (cls) => PASSIVES[cls] || [];
/** every skill a class learns, actives and passives, in the ladder's order (by level) @param {string} cls */
export const ladderOf = (cls) => [...skillsOf(cls), ...passivesOf(cls)].sort((a, b) => a.lv - b.lv);
/** an ability or a passive of the class @param {string} cls @param {string} id @returns {any} */
export const skillDef = (cls, id) => skillsOf(cls).find((s) => s.id === id) || passivesOf(cls).find((s) => s.id === id) || null;
/** the state.trials key of a class's trial at an ability's level: `cleric` (the 6), `cleric12` @param {string} cls @param {number} lv */
export const trialKey = (cls, lv) => (lv >= 12 ? cls + '12' : cls);
/** can m use s? its level, and for a trial ability, the class's trial at that level done (state.trials)
 * @param {any} m @param {{lv:number, trial?: boolean}} s @param {Record<string, number> | null | undefined} trials */
export const unlocked = (m, s, trials) => (m.level || 1) >= s.lv && (!s.trial || !!(trials && trials[trialKey(m.cls, s.lv)]));
/** the classes that have trials (one level-6 ability each) */
export const TRIAL_CLASSES = Object.keys(SKILLS).filter((c) => SKILLS[c].some((s) => s.trial));
/** @param {any} m @param {string} id */
export const rankOf = (m, id) => Math.max(1, Math.min(MAX_RANK, (m.skills && m.skills[id]) || 1));
/** a passive's value for m at its rank (`val`), 0 before its level or for another class's @param {any} m @param {string} id */
export function passiveVal(m, id) {
  const P = passivesOf(m.cls).find((q) => q.id === id); if (!P || (m.level || 1) < P.lv) return 0;
  return P.val[0] + P.val[1] * (rankOf(m, id) - 1);
}
/** @param {any} m */
export const skillPointsEarned = (m) => Math.floor((m.level || 1) / 2);
/** (passives' ranks count, as abilities' do) @param {any} m */
export const skillPointsSpent = (m) => [...skillsOf(m.cls), ...passivesOf(m.cls)].reduce((a, s) => a + rankOf(m, s.id) - 1, 0);
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
/** of what a Spirit Drain tick takes, the most hurt ally gets this much back */
export const DRAIN_MEND = 0.5;
/** MP cost at a rank @param {{mp:number}} s @param {number} rank */
export const rankCost = (s, rank) => s.mp - (rank >= 3 ? 1 : 0) - (rank >= 5 ? 1 : 0);
/** @param {any} m */
export const stanceOf = (m) => (STANCES.includes(m.stance) ? m.stance : 'balanced');
/** the member's abilities in priority order: its order (`prio`), then any it hasn't placed, in the ladder's @param {any} m */
export function priorityOf(m) {
  const all = skillsOf(m.cls), ids = all.map((s) => s.id);
  const placed = Array.isArray(m.prio) ? m.prio.filter((id, i) => ids.includes(id) && m.prio.indexOf(id) === i) : [];
  return [...placed, ...ids.filter((id) => !placed.includes(id))].map((id) => /** @type {any} */ (all.find((s) => s.id === id)));
}
/** how many abilities a member takes into a fight (GDD §5.1 v1.56) */
export const LOADOUT = 4;
/** the abilities a member takes into a fight, in its priority order: those it set (`loadout`, up to LOADOUT) that it
 * can use, or, until it sets them, the first LOADOUT it can use @param {any} m @param {Record<string, number> | null | undefined} trials */
export function inPlay(m, trials) {
  const can = priorityOf(m).filter((s) => unlocked(m, s, trials));
  return (Array.isArray(m.loadout) ? can.filter((s) => m.loadout.includes(s.id)) : can).slice(0, LOADOUT);
}
/** @param {any} m @param {string} id */
export const autocastOn = (m, id) => !(Array.isArray(m.off) && m.off.includes(id));
