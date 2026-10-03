// @ts-check
// skills.js — class abilities, ranks, auto-cast and stances (GDD §5, §5.1). Pure data and
// formulas; battle.js casts them, heroes.js owns the commands.
//
// Each class has three abilities (levels 1, 6, 12) and a passive (level 20). An ability unlocks when
// its level is reached; the level-6 ones (`trial`) also want that class's trial done by the company
// (state.trials, quests.js; M5, docs/m5-plan.md §6): done once, every member of the class knows it.
// The level-12 ones stay unlocked by level until the M8 trials.
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

export const SKILLS = {
  fighter: [
    { id: 'cleave', name: 'Cleave', lv: 1, mp: 10, kind: 'strike', power: 1.3, splash: 0.65, text: '1.3× to the target and those beside it' },
    { id: 'shield_wall', name: 'Shield Wall', lv: 6, trial: true, mp: 20, kind: 'guard', dur: 6, def: 0.5, taunt: true, text: '+50 % DEF for 6 s; foes turn on you' },
    { id: 'second_wind', name: 'Second Wind', lv: 12, mp: 25, kind: 'heal', heal: 0.25, text: 'heal 25 % of max HP' },
  ],
  rogue: [
    { id: 'backstab', name: 'Backstab', lv: 1, mp: 10, kind: 'strike', power: 1.6, crit: 25, text: '1.6×, +25 % crit chance' },
    { id: 'smoke_step', name: 'Smoke Step', lv: 6, trial: true, mp: 15, kind: 'guard', dur: 5, dodge: 30, text: '+30 % DODGE for 5 s; foes lose you' },
    { id: 'venom', name: 'Venom', lv: 12, mp: 20, kind: 'strike', power: 0.8, poison: 0.35, pdur: 6, text: '0.8×, then poison: 0.35× ATK a second for 6 s' },
  ],
  mage: [
    { id: 'firebolt', name: 'Firebolt', lv: 1, mp: 12, kind: 'strike', power: 1.8, text: '1.8× at range' },
    { id: 'frost_nova', name: 'Frost Nova', lv: 6, trial: true, mp: 30, kind: 'nova', power: 0.8, radius: 2.8, slow: 3, text: '0.8× to every foe close by; slows them for 3 s' },
    { id: 'arcane_ward', name: 'Arcane Ward', lv: 12, mp: 25, kind: 'ward', ward: 0.3, text: 'shield the most hurt ally for 30 % of their max HP' },
  ],
  cleric: [
    { id: 'mend', name: 'Mend', lv: 1, mp: 12, kind: 'mend', heal: 0.22, text: 'heal the most hurt ally for 22 % of their max HP' },
    { id: 'bless', name: 'Bless', lv: 6, trial: true, mp: 25, kind: 'bless', buff: 0.15, dur: 8, text: 'the whole party: +15 % ATK and DEF for 8 s' },
    { id: 'turn_undead', name: 'Turn Undead', lv: 12, mp: 30, kind: 'nova', power: 1.6, radius: 3, slow: 0, undead: true, text: '1.6× to every Ashbound within 3 tiles (not the living)' },
  ],
  shaman: [
    { id: 'spirit_drain', name: 'Spirit Drain', lv: 1, mp: 9, kind: 'strike', power: 0.7, drain: 0.12, ddur: 8, dmax: 5, text: '0.7× at range, then a stacking drain: 0.12× ATK a second for 8 s, up to 5 stacks; it mends the most hurt ally' },
    { id: 'ancestors_breath', name: "Ancestors' Breath", lv: 6, trial: true, mp: 22, kind: 'breath', hot: 0.05, buff: 0.1, dur: 6, text: 'the whole party: 5 % of max HP back a second and +10 % ATK for 6 s' },
    { id: 'hex', name: 'Hex', lv: 12, mp: 22, kind: 'hex', debuff: 0.2, radius: 3.5, dur: 8, text: 'the foes in a knot (or a boss or elite alone): −20 % ATK and DEF for 8 s' },
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
/** can m use s? its level, and for a trial ability, the class's trial done (state.trials)
 * @param {any} m @param {{lv:number, trial?: boolean}} s @param {Record<string, number> | null | undefined} trials */
export const unlocked = (m, s, trials) => (m.level || 1) >= s.lv && (!s.trial || !!(trials && trials[m.cls]));
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
/** the member's abilities in priority order (default: the class order) @param {any} m */
export function priorityOf(m) {
  const all = skillsOf(m.cls), ids = all.map((s) => s.id);
  const order = Array.isArray(m.prio) && m.prio.length === ids.length && ids.every((id) => m.prio.includes(id)) ? m.prio : ids;
  return order.map((id) => /** @type {any} */ (all.find((s) => s.id === id)));
}
/** @param {any} m @param {string} id */
export const autocastOn = (m, id) => !(Array.isArray(m.off) && m.off.includes(id));
