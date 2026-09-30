# Difficulty pass 1: levels, gear and the right party

**2026-09-30 · Implemented.** The measurements behind GDD v1.5 §7.1 and AGENTS.md rule 6.

**Code:**
- `src/sim/battle.js`: `waveSize`, `TIDE`, `PREMIUM`, `XP_SHARE`, `LULL_REGEN`, and the hero's
  pathing probe with `HERO_R`.
- `src/sim/items.js`: `GEAR_GROWTH`, `kitGrowth`, `refreshItem`.
- `src/sim/party.js`: `statsFor`.
- Gates: `smoke-test.mjs`.

**The ask:**
- A player can beat level-1 foes alone, but not farm them.
- Fighting at your own level should take levels, gear and the right party.
- Companions should be worth having.

## What was wrong (before)

Every row below is a visit the party never walks out of, lasting 5 minutes. The party is on the
recommended builds, in its class kit at its level, on seed 20260807 unless noted. "Cost" is the HP
lost per wave, averaged over the first 10 waves. The script is
`tools/balance/roomlv.mjs`-style, in the pass's scratch runs.

| Row | Before |
|---|---|
| Solo level 1, each class, room 1 | All four held 10 minutes. Fighter 17 %/wave, rogue 20 %, mage **2 %**, cleric 30 %. |
| Solo, same level, levels 3 / 6 / 9 | Held: 19 % / 20 % / 17 % per wave. |
| Solo, 3 levels up | Held at levels 3 and 9. Wiped at levels 1 and 6, in about 3 minutes. |
| Fighter + rogue + cleric, level 6, same level | Held, 20 %/wave, 15 waves (a lone hero managed 19). |
| Hero XP a minute, level 6 same level: solo / duo / trio | 593 / 596 / 534. Companions made each wave bigger and slower. |
| Level 6 trio, level-1 kit vs level-6 kit, room 6 | 21 % vs 20 % per wave. Gear barely mattered. |
| Level 9 trio, room 12 (3 up) | Held, 27 %/wave. |

**Causes:**
1. **Waves grew with the party:** 2 foes for one, 5 for two, 7 for three, with +25 % HP. Each
   member faced more foes the more companions they had.
2. **The lull was a full recovery.** It waited, at 5× regen, until everyone was back over 60 %.
   Every wave started fresh, so a room could be held forever.
3. **Enemies grew in lock-step with the hero**, and gear was about 13 % of a level-6 fighter's
   ATK.
4. **The rules required it.** The old contract was "a solo fighter holds a level-1 room for
   10 minutes".

## What changed

- **The room sets the wave.** 2 foes to room level 3, then 1 + ⌊level ÷ 2⌋, up to 7. It's the
  same for a lone hero and a party. Archers and mages are up to a third of a wave, and at least
  one in every second wave: two melee foes alone never touched a kiting mage.
- **The tide:** each wave of one visit is +6 % HP and ATK.
- **The premium:** foes above level 3 are +5 % a level (HP, ATK, and DEF via HP scaling).
- **The lull is a 4 s breath** at 1.5× regen, and the room doesn't wait. Corridors and towns
  still restore you at 5×.
- **Party XP:** a kill's XP goes to each living member at 100 % alone, 65 % each for two, 50 %
  each for three.
- **Gear growth doubled.** Items grow at a + b × ilv + b × (ilv − 1), and the classes grow the
  kit's extra that much less. A hero in their kit at level has the old stats; old gear falls
  behind. Items re-derive their stats on load, so old loot follows the formula.
- **Bug fixed along the way.** The hero's autobattle probe was a point, while the hero has a
  0.32-tile body. Near a pillar corner the probe's path was clear and the real move wasn't: the
  hero stood pressed against it for good while an enemy mage shot it down (seed 4242, solo L1,
  down on wave 2). The probe now carries the hero's radius, and that run lasts 8 waves.

**Tuning (5 variants tried):**

| Variant | Result |
|---|---|
| Waves 2 + ⌊(L − 1) ÷ 3⌋, no premium | Parties too easy: a same-level trio took 4–9 %/wave and never ended a visit. |
| The same with premium 0.10 to 0.15 | Level 9 on target, level 6 still easy, +2 at level 9 too harsh. |
| **Waves 1 + ⌊L ÷ 2⌋ from level 4, premium 0.05** | **Chosen.** |
| A lull with no regen | Solo L1 swung between 1 and 9 waves by seed. |
| A lull at ×2.5 | A no-healer trio held level 6. |
| A lull at ×1.5 | Chosen: solo L1 4–8 waves for fighter and rogue on 10 seeds; no-healer trios worn down on every seed. |

## After

| Row | After |
|---|---|
| Solo level 1, room 1 (10 seeds) | Fighter 4–8 waves, rogue 4–8, mage 8–15 (kites), cleric 11–21 (self-heals, slowest XP). Down by wave 21 at the very latest. |
| Solo, same level, level 3 / 6 / 9 | Down after 4 waves / 1 / 0. |
| Solo, a room 2 below (level 6, room 4) | 4 waves, then down (walk out to recover). |
| Fighter + cleric, level 6, same level | Held, 18 %/wave, 13 waves. At level 9: down after 6. |
| Fighter + rogue + cleric, same level, level 3 / 6 / 9 | Held: 24 / 18 / 14 waves, 6 / 11 / 18 % per wave. |
| No healer (F + R + M), same level, level 3 / 6 / 9 | Held at level 3 (5 %/wave), worn down at level 6 (222 s) and level 9 (125 s). |
| Trio, 2 up, level 6 / 9 | Down after 10 / 5 waves. |
| Trio, 3 up, level 6 / 9 | Down after 5 / 1 waves. |
| Hero XP a minute, level 6, room 4: solo / trio | 396 / 331. A party member earns 84 % of a lone hero's XP a minute, and can take rooms a lone hero can't. |
| Level 6 trio, room 8: level-1 kit / level-6 common / Fine / Rare | 6 / 10 / 9 / 13 waves. At room 6, the level-1 kit costs 3 downs and the level-6 kit none. |

**The room-level harness** (`node tools/balance/roomlv.mjs 300 L L [1,3]`, seed 20260807, kit at
level; before = `--src` of the previous commit):

| Level | Solo before | Solo after | Fighter + rogue + cleric before | Fighter + rogue + cleric after |
|---|---|---|---|---|
| 3 | held, 17 waves, 19 % | down at 91 s, 4 waves | held, 13 waves, 22 % | held, 24 waves, 5 % |
| 6 | held, 19 waves, 20 % | down at 42 s, 1 wave | held, 15 waves, 21 % | held, 17 waves, 11 % |
| 9 | held, 19 waves, 17 % | down at 15 s, 0 waves | held, 15 waves, 20 % | held, 15 waves, 15 % |

Gold in 5 minutes for the party fell from 516 / 1,170 / 1,791 to 285 / 780 / 1,197, since there
are fewer foes a wave. XP ended at the same levels (4 / 7 / 10). Gold is an open item for the M5
economy pass.

## The contract (smoke gates)

Seeds 20260807, 777 and 4242 as marked; all visits are never walked out of.

1. A lone level-1 hero wins 3+ waves and is down by wave 12 (3 seeds). Measured: 6, 5, 4.
2. A lone level-6 hero in a level-6 room is down within 2 waves (2 seeds). Measured: 1, 1.
3. Fighter + rogue + cleric at levels 3 / 6 / 9, same level: 10+ waves, nobody Fallen in the
   first five (2 seeds). Measured: 24, 18, 14 and 23, 16, 13.
4. Fighter + rogue + mage at level 6 is worn down within 5 minutes (2 seeds). Measured: 222 s,
   214 s.
5. Three levels up defeats fighter + rogue + cleric at levels 6 and 9. Measured: 5 waves, 1 wave.
6. Level 6 in room 4: the same first wave solo and as a trio (3 and 3), and the trio earns 80 %+
   of the XP a minute. Measured: 84 %.
7. Level-6 trio in room 8: Fine gear at level lasts longer than the level-1 kit. Measured: 9
   waves vs 6.

## Open

- **Gold income** is lower for parties. Tune it with the M5 economy (shop, smith, hires).
- **The board's Warden jobs** at levels 2–3 send you to a hall two levels up. Now that means
  "bring company", so the board's skulls could say so. The golden path test takes a party.
- **Class outliers:** the mage kites (8–15 solo waves at level 1) and the cleric self-heals
  (11–21). Neither farms forever and the cleric earns the least XP a minute, so both are left as
  class identity. Revisit with the M5 class trials.
- **Potions** (GDD §3.2's toggle) would be the next lever for how long a visit lasts.
