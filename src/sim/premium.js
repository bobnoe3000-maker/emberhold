// @ts-check
// A foe's toughness for its level (GDD §7.1), on its own so the party's lift (party.js liftOf) reads the same curve
// battle.js does without the two importing each other. PREMIUM a level over 3; PREMIUM_HIGH more a level from 18 to
// PREMIUM_HIGH_TO (v1.124, v1.126); (v1.150) on past 30, the heroes lifted with it from there; (v1.151) and past
// PREMIUM_PAST each level PREMIUM_STEEP times the last on top, so three levels up stays a wall as the levels grow: run on
// in a straight line, a fixed step a level, three up was 12 % a stat at 39 against 41 % at 6, and the right party at 39
// held a level-42 room 11 waves standing (the contract wants it beaten). At 1.06 a level the smoke contract's three-up
// rooms beat the right party at 33, 36 and 39 (178, 236, 252 s); at 1.04 the 36 room held, at 1.05 the 39 one. The heroes' lift is premiumOf(L) / premiumOf(30),
// so a same-level room is as hard at 45 as at 30 whatever the curve's shape. Compounded by multiplying (no pow: detmath).
export const PREMIUM = 0.05;
export const PREMIUM_HIGH = 0.06, PREMIUM_HIGH_TO = 22;
export const PREMIUM_PAST = 30, PREMIUM_STEEP = 1.06;
// (v1.154) and steeper still past PREMIUM_STEEPER_FROM: three up stayed 1.25 a stat while the heroes went on gaining skills,
// so the contract's three-up room took longer each band to beat the right party (178 s at 33, 236 at 36, 252 at 39, 262 at
// 42) and at 45 it held (a level-48 room, 300 s, the lowest 34 %). Same-level rooms don't move (the lift reads this curve).
export const PREMIUM_STEEPER_FROM = 40, PREMIUM_STEEPER = 1.10;
const STEEP = [1];
for (let i = 1; i <= 120; i++) STEEP.push(STEEP[i - 1] * (PREMIUM_PAST + i > PREMIUM_STEEPER_FROM ? PREMIUM_STEEPER : PREMIUM_STEEP));
/** @param {number} lv */
export const premiumOf = (lv) => (1 + PREMIUM * Math.max(0, lv - 3) + PREMIUM_HIGH * Math.min(PREMIUM_HIGH_TO - 18, Math.max(0, lv - 18)))
  * STEEP[Math.min(STEEP.length - 1, Math.max(0, Math.floor(lv) - PREMIUM_PAST))];
