# The skill trees: a proposal (2026-11-08)

**Status: Implemented** (2026-11-08): the owner marked all twenty **yes** on the review page ("Updated, proceed"). GDD
v1.55 §5.1 (the tiers' table, as built), §5.2 (crowd control), §17; `src/sim/skills.js` (`TIERS`, `pickOf`),
`src/sim/battle.js` (`TIER`, the CC block, `battle.planted`), `src/sim/heroes.js` (`pickSkill`), save v35 (`picks`),
`src/ui/sheet.js` (*The choices*), `src/render/skillfx.js` (their moments, the statuses' auras, a cut wind-up's warning
gone), `src/audio/cues.js` (a sound each), `test/tiers.test.mjs`. **What the build changed, and what it measured: §7.**
The Luminati pieces (§5) are built and the owner chose fifteen (combat-fx.md); the trials (§1) are still to come. The proposal as it was reviewed follows.

The owner, on the skills review page (2026-11-08), marked **Add it** on:
- every Luminati move offered (Tempest Edge, Dragonfang Wave, Skyfall Judgement, Earthshatter, Flare, Glacial Tomb,
  Blizzard, Sanctuary, Revive, resonance marks, a totem);
- crowd control (stun, freeze, knockdown, pull);
- a leap, something planted, a raise in a fight;
- "add more skills available to learn for each class".

This proposal places all of them in each class's tree, with numbers, and with the effects to review on the page.

## 1. Where the new skills go

The GDD's plan of record (§17, v1.23) already sets the shape: **one new active per class per region, at levels 18,
33, 48 and 63, the company choosing one of two at a trial**; a second passive at 40; a loadout of four actives from
the fifth; a free respec at any temple.

Content runs to level 18 today (the Vale 1–9, the Fens 10–18; the Reach opens at 19). So the proposal:

| Tier | Level | When | Choice |
|---|---|---|---|
| (now) | 1 | at creation | – |
| (now) | 6 | the class's trial (Vale) | – |
| (now) | 12 | the class's second trial (Fens) | – |
| **I (new)** | **15** | the Canal Locks' band (13–15) | **one of two** |
| **II** | **18** | the Drowned Abbey's band (16–18), as §17 has it | **one of two** |
| (now) | 20 | passive | – |
| III–V | 33, 48, 63 | the Reach, the Heights, the lands past them | one of two, designed with those lands |
| (plan) | 40 | second passive | – |

- **One of two, swapped for free at a temple.** Both are "available to learn"; the company carries one per tier.
- **The loadout of four** starts with the fifth active, which is now at 18, not 33.
- **How they're learned.** §17 wants a trial with a named teacher. Writing ten trials is content work of its own. To
  begin with, tiers I and II unlock at their level; the trials come in a content pass (one teacher a class, set in
  the Fens), and the level unlock then waits for them, as the level-6 and level-12 skills do.
- **Skill points** (one every even level, ranks 1–5) spread over more skills. That's intended: a choice of what to rank.

## 2. Crowd control: new sim rules

Today the only control is Frost Nova's slow. Six statuses, each a sim rule with a test:

| Status | What it does | On a boss |
|---|---|---|
| **Stun** | can't move, strike or cast; **a wind-up in progress is cut** (the warning's blow never lands) | half the time |
| **Freeze** | a stun, with the ice look; breaks for 1.0× when it ends (Glacial Tomb) | half the time |
| **Knockdown** | a stun of the given time, and the foe slides a step back | half the time, no slide |
| **Root** | can't move; still strikes what's in reach, still shoots | half the time |
| **Pull** | moved toward a point, a tile or more | not moved |
| **Knockback** | moved away from a point | not moved |

- **Immunity:** after a stun, freeze or knockdown ends, the foe can't be stunned again for 2 s, so an autobattle
  party can't hold a boss down forever.
- **Elites** take the full time.
- **Deterministic:** no draws; durations in the sim's ticks; moves blocked by walls as every move is.
- The interrupt is the useful part: with the attack warnings in, a stun cast while a ring is filling cancels that blow.

## 3. The trees

Numbers follow the current skills' scale: Cleave 1.3× and 10 MP, Frost Nova 0.8× over 3.5 tiles and 30 MP, Turn Undead
1.6× and 30 MP. Each skill states its **autocast test** (§17). All of it is a first pass, to be held to the balance
contract (§4) before it ships.

### Fighter: warm steel and amber

| Lv | Skill | What it does | MP | Autocast test | From |
|---|---|---|---|---|---|
| 1 | Cleave | 1.3×, 0.65× to those beside the target | 10 | (as now) | ours |
| 6 | Shield Wall | +50 % DEF 6 s, taunt 7 tiles | 20 | (as now) | ours |
| 12 | Second Wind | heal 25 % max HP | 25 | (as now) | ours |
| **15 A** | **Vault** | leaps to a foe 3–8 tiles off; lands 1.5× on it and 0.6× within 1.8 tiles; knockdown 0.8 s | 22 | a foe 3+ tiles off is striking a party member, or a shooter is | Skyfall Judgement |
| **15 B** | **Cutting Wave** | a wave along a lane 6 tiles long, 1 wide: 1.4× to every foe in it | 18 | 2+ foes in the lane | Dragonfang Wave |
| **18 A** | **Earthshatter** | slam: 1.2× within 3 tiles, knockdown 1.2 s; then a ring of rock spikes, 0.5× | 30 | 3+ foes within 3 tiles | Earthshatter |
| **18 B** | **Whirling Blades** | three spectral swords circle him for 5 s, cutting every foe within 2.2 tiles for 0.45× every 0.6 s | 32 | 2+ foes within 2.2 tiles | Tempest Edge |
| 20 | Iron Hide | (as now) | | | |

### Rogue: verdant, and a crimson cut

| Lv | Skill | What it does | MP | Autocast test | From |
|---|---|---|---|---|---|
| 1 | Backstab | (as now) | 10 | | ours |
| 6 | Smoke Step | (as now) | 15 | | ours |
| 12 | Venom | (as now) | 20 | | ours |
| **15 A** | **Kidney Shot** | 1.0× and a 1.5 s stun | 14 | an elite or boss is winding up a heavy blow, or a foe is casting | stun (crowd control) |
| **15 B** | **Fan of Knives** | five knives in a 40° fan, 6 tiles: 0.8× to each foe hit | 16 | 2+ foes in the fan | a line attack |
| **18 A** | **Shadowstep** | vanishes, reappears behind the most hurt shooter or caster within 8 tiles, and stabs: 1.4×, a sure crit; foes lose her | 18 | a shooter or caster within 8 tiles | a dash |
| **18 B** | **Caltrops** | a field 1.6 tiles across on the knot for 6 s: foes in it slowed 50 % and take 0.25× a second | 20 | 3+ foes in a knot | something planted |
| 20 | Opportunist | (as now) | | | |

### Mage: arcane blue, fire and frost

| Lv | Skill | What it does | MP | Autocast test | From |
|---|---|---|---|---|---|
| 1 | Firebolt | (as now) | 12 | | ours |
| 6 | Frost Nova | (as now) | 30 | | ours |
| 12 | Arcane Ward | (as now) | 25 | | ours |
| **15 A** | **Flare** | marks the knot's middle; 0.7 s later a pillar of fire bursts there, 2.0× within 1.8 tiles | 20 | 2+ foes in a knot | Flare |
| **15 B** | **Gather** | pulls every foe within 4 tiles of the knot 1.5 tiles in, 0.3×, slowed 1 s (sets up Frost Nova) | 18 | 3+ foes spread within 4 tiles of a knot | pull (crowd control) |
| **18 A** | **Glacial Tomb** | freezes the knot (2.4 tiles) for 2.5 s; 1.0× as it breaks | 34 | 3+ foes in a knot, or an elite or boss winding up | Glacial Tomb |
| **18 B** | **Blizzard** | a storm 3 tiles across on the knot for 6 s: 0.3× a second, chilled (slowed 30 %) | 36 | 3+ foes in a knot | Blizzard |
| 20 | Kindled Mind | (as now) | | | |

### Cleric: gold

| Lv | Skill | What it does | MP | Autocast test | From |
|---|---|---|---|---|---|
| 1 | Mend | (as now) | 12 | | ours |
| 6 | Bless | (as now) | 25 | | ours |
| 12 | Turn Undead | (as now) | 30 | | ours |
| **15 A** | **Sanctuary** | a circle 2.5 tiles across under the most hurt for 4 s: 8 ticks of 4 % max HP to allies in it, and a ward of 10 % max HP as they enter | 28 | 2+ allies under 70 % HP close together | Sanctuary |
| **15 B** | **Consecrate** | holy ground 2 tiles across on the knot for 8 s: undead in it take 0.4× a second, the living 0.15×; allies in it +10 % DEF | 26 | 2+ foes in a knot | something planted |
| **18 A** | **Revive** | kneels (1.2 s; cut if she's Downed) and raises a Downed member at 40 % HP; once a room visit. The Slain are still the temple's. | 40 | a member is Downed and the room isn't won | Revive (a raise in a fight) |
| **18 B** | **Judgement** | her glyph, six pillars round the target (0.5× each within 3 tiles), then the great pillar on it (2.2×); undead take ×1.5 | 38 | an elite or boss, or 3+ foes in a knot | Judgement |
| 20 | Lifeline | (as now) | | | |

Revive and the GDD: §6 has a Downed member rise when the wave is cleared, and the Slain raised at a temple. Revive
only brings a Downed member back sooner; nothing raises the Slain in a fight.

### Shaman: spirit teal, hex green and violet

| Lv | Skill | What it does | MP | Autocast test | From |
|---|---|---|---|---|---|
| 1 | Spirit Drain | (as now) | 9 | | ours |
| 6 | Ancestors' Breath | (as now) | 22 | | ours |
| 12 | Hex | (as now) | 22 | | ours |
| **15 A** | **Binding Roots** | roots the knot (2.5 tiles) for 2.5 s, 0.4× | 20 | 2+ melee foes closing on the party | root (crowd control) |
| **15 B** | **Old Marks** | a strike, 0.8×, that leaves a mark (up to 3); the third breaks them all: 1.6× and a 1 s stun | 12 | (a strike: replaces the basic attack) | resonance marks |
| **18 A** | **Spirit Totem** | plants a spirit post near the party for 8 s: every 1.5 s it pulls foes within 4 tiles a tile in; the party within 2.5 tiles take 20 % less | 30 | 3+ foes within 6 tiles | Toll (something planted) |
| **18 B** | **Thunder Drum** | knocks back every foe within 2.5 tiles by 2 tiles, 0.6×, dazed (stunned) 1 s | 24 | 2+ foes within 2.5 tiles of a party member under half HP | knockback (crowd control) |
| 20 | Old Ways | (as now) | | | |

## 4. Balance

The contract (GDD §7.1) holds rooms at levels 3–15, the right party 10+ waves at 15. Tier I lands at 15, so:
- **Before any tier ships:** the room-level harness at 12, 15 and 18, solo and party, with `--src` at the commit
  before, for each class's two choices.
- **Target:** a tier I skill adds 4–8 % to the party's waves at 15; neither choice of a tier outdoes the other by more
  than 10 % in its own role (damage, control, healing).
- **Crowd control** is measured on its own: boss halls at 15–18 (`tools/balance/boss.mjs`), holding the boss down no
  more than a quarter of the fight.
- If the contract moves, the numbers here move, not the contract.

## 5. The looks

Every new skill gets a moment of its own in `skillfx.js` (both renderers), and the statuses get auras (stun stars,
a frozen shell, roots, a knocked-down figure, a field's ground). They play live on the review page, as the game draws
them, for the owner to confirm before anything else is built. On Luminati, the Luminati moves keep their own pieces
where they exist (the swordmaster's swords for Whirling Blades and Vault, the Tomb's crystals, Sanctuary's circle, the
bellwarden's bell for the totem).

## 6. The build, once confirmed

1. **GDD** §5.1 and §17: the tiers, the statuses, the trees (v1.55).
2. **Statuses** in `battle.js` (stun, freeze, knockdown, root, pull, knockback), with tests and the boss rules.
3. **Tier I** (15): ten skills, their autocast tests, the choice in the Skills tab, the temple respec of it, save
   v35 (the chosen skill per tier), balance runs, the looks.
4. **Tier II** (18): the same.
5. **Luminati** pieces for them, captures, the browser suite.
6. **The trials** for tiers I and II, in a content pass.

## 7. As built (2026-11-08): what changed, and the numbers

Fought out in the sim, the first pass needed changes. All of them are in GDD v1.55 §5.1's table.

**Foes don't bunch.** They stand 2.8 tiles apart, round whoever they fight (GDD v1.53, Frost Nova). In a level-15 room
the thickest knot held two foes within 3 tiles in 38 % of samples, and three in 6 %. So:
- **Two foes, not three:** an area ability wants two in it. Radii went from 1.6–2.4 tiles to 2.5–3 (Gather 5).
- **MP to spare:** with 70 % of its MP or more, a member casts an area ability on one foe too (`SPARE_MP`). Fan of
  Knives and Binding Roots still want two (`pair`): on one they do less than the strike they replace.
- **Re-aimed as they land:** Cutting Wave and Fan of Knives re-aim at landing, because foes move in the wind-up.
- **Flare** marks the foe at the knot's heart and bursts where that foe stands, or on the nearest foe left in the knot.
  On the spot itself it took nobody: foes cross 2–3 tiles in 0.7 s.

**The MP economy.** A melee member's strike spent its MP every swing: Cleave's 10 kept a level-18 fighter, with 54 MP,
under every tier ability all fight. So:
- **Strikes hold MP back** for the dearest tier ability the member carries (`tierKeep`).
- **Costs cut by about a third,** so a tier ability does at least what its MP would do as strikes. Dearer, they cost the
  party 8 % of its damage on the Drowned Choir.
- **Kidney Shot** went to 1.4×. In her turn it's cast only on an elite or a boss: on any foe it took 37 of her swings
  at 1.0× each, and the Choir outlasted the party (seed 2).
- **Vault** answers a foe on foot that's striking an ally, or any foe when nothing's in reach. It never leaves a boss or
  an elite: he had left the Choir for her cantors.
- **Fan of Knives** went to 1.0× a knife, **Cutting Wave** to 1.6×, and **Consecrate** to 0.2× on the living with
  +15 % DEF. The second picks had come out 13 % under the first.

**Measured.** The right party (fighter, rogue, cleric) at its level, 300 s; six seeds for rooms, eight for halls.
Before: the commit before (`--src`). First: the first of each tier's two (`roomlv.mjs`, `boss.mjs`, `--pick a`).
Second: the second (`--pick b`).

| | Before | First | Second |
|---|---|---|---|
| Room at 15: waves | 12.0 (5 of 6 lost by 300 s, 2 Fallen) | 13.0 (**+8 %**; 2 lost, none Fallen) | 12.3 (**+3 %**; 3 lost, 1 Fallen) |
| Room at 18: waves | 12.5 | 13.0 (**+4 %**) | 12.8 (**+3 %**) |
| A room 3 up (party 15 in an 18) | lost | lost | lost |
| The Vatwarden (15) | 65 s | 70 s · held ≤ 15 % | 63 s |
| Brother Teague (16) | 62 s | 67 s · held ≤ 15 % | 65 s |
| The Drowned Choir (17) | 115 s (95–156) | 116 s (89–134) · held ≤ 14 % | 121 s (86–165) |
| The Abbess Below (18) | 103 s (66–278) | 78 s · held ≤ 19 % | 70 s (one wipe in eight) |

- The first picks land in the target (+4–8 % at 15).
- The second come in under it (+3 %), 5 % behind the first, within the 10 % asked.
- No boss is held more than a fifth of his fight; the target was a quarter.
- The contract's other gates hold (`npm run check`: SMOKE_OK).

**Still to come.**
- The trials for the two tiers: a teacher a class, set in the Fens (§1).
- ~~The Luminati pieces (§5)~~: built (2026-11-08), and the owner chose fifteen of them, the rest kept in Emberlit's light
  ([combat-fx.md](combat-fx.md), "The tiers' skills on Luminati").
- The loadout of four (§17): every carried ability is cast until it comes.

