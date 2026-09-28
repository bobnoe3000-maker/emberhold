# Emberfall — Game Design Document

**v1.0 · 2026-09-28 · Plan of record for game design.** This supersedes the *game design*
sections of [emberhold-design.md](./emberhold-design.md) (the Necesse-style survival/colony
sandbox is retired). It does **not** supersede the technical architecture (headless
deterministic sim, seed-plus-diff saves, iso renderer), which this design is built on. The
world, story and factions are in [emberfall-world.md](./emberfall-world.md). The art
prototype of record is the current build: Emberlit renderer, cobble tiles with material
variants, and 56 px KayKit actors (see [character-direction.md](./character-direction.md) and
[tile-styles.md](./tile-styles.md)).

> **Working title change:** *Emberhold* → **Emberfall**. The build still says EMBERHOLD; the
> rename is a separate small change.

---

## 1. Vision

**One-liner:** a classic D&D-paperback adventure in a forgotten backwater. You lead a party of
three through towns, overland roads, keeps and dungeons. Battles fight themselves; you choose
the quests, the party, the gear and the tactics.

**Pillars**
1. **Explore.** A fogged overland of small towns and dangerous sites; every dungeon floor
   reveals itself room by room.
2. **Battle, automatically.** Real-time autobattles you steer (stance, focus, position,
   retreat) but never micro. Readable on a phone at arm's length.
3. **Grow by grinding.** Enemies scale region by region. Progress comes from repeat quests,
   deeper floors and slowly earned gear. The grind is the game, so it must feel good.
4. **Loot is rare and matters.** Few drops, all class-specific, each a visible upgrade on the
   figure itself.
5. **The world holds together.** Every quest, place and enemy comes from one narrative. History
   is discovered in fragments, never lectured.
6. **Plays anywhere.** One thumb, portrait, fully offline. The party keeps adventuring while
   you're away. Multiplayer comes later, on the same deterministic sim.

**Audience and session:** mobile players who like D&D flavour, autobattlers and idle
progression. Sessions of 3–15 minutes: one quest, a town visit, or a single dungeon floor.

---

## 2. Core loops

| Loop | Length | Beats |
|---|---|---|
| **Battle** | 15–45 s | Enter room → enemies aggro → autobattle → loot and XP → regen while walking on. |
| **Quest** | 3–15 min | Town board → pick a mini-quest → travel overland → site (1–5 floors) → objective → return and turn in. |
| **Growth** | days–weeks | Level up, upgrade gear at the smith, hire or find better companions, raise regional renown → unlock the next act and region → harder enemies → grind again. |
| **Offline** | hours | Send the party on an expedition to a cleared site; results are computed on return (§12). |

---

## 3. Autobattle combat

**Flow.** You explore a site by dragging to move (the current build's controls). The party
follows in formation. When enemies notice the party, the room **locks into a battle**. Every
unit then acts on its own through a deterministic AI running in the 20 Hz sim. The battle ends
when one side falls or the party retreats.

**What the player controls (one thumb):**
- **Stance** (toggle): *Aggressive* (chase, use MP freely), *Balanced*, or *Defensive* (hold
  formation, save MP for heals and shields).
- **Focus** (tap an enemy): the party prioritises that target until it dies.
- **Position** (drag): move the leader. The party re-forms around them to pull enemies or
  escape a hazard pool.
- **Retreat** (hold): the party falls back to the room's entrance. The room resets, and you
  lose nothing but time.
- **Potions** (auto toggle): drink at < 30 % HP.

**AI.** Each unit picks a target by role (front line → nearest threat, rogue → lowest HP or
back line, mage → clusters) and casts abilities when MP and conditions allow (§5). Attack
intervals are class-fixed: fighter 1.3 s, rogue 0.9 s, mage 1.6 s. Enemies use archetype AI.
Ashbound mages raise and buff; Choir necromancers resurrect.

**Formation.** Front (fighter), mid (rogue) and back (mage) are auto-assigned by class and can
be reordered in the party screen.

**Defeat.** If the whole party falls, it is carried back to the last town. You keep XP and
gear, lose **25 % of carried gold**, and fallen companions are **Wounded** until a shrine heals
them (gold or time). There's no permadeath. A *Hardcore* mode is an open question.

**Readability.** At the current zoom (25 tiles across) figures are about 54 pt tall. Each unit
shows HP/MP pips overhead, floating damage numbers, a crit flash and a dodge "miss". Hazard
pools (lava, poison, ice, water) are impassable, so terrain shapes the fight.

---

## 4. Stats

| Stat | Meaning | Rule |
|---|---|---|
| **HP** | Hit points | 0 = the unit falls. |
| **MP** | Mana | Spent on abilities. Basic attacks are free. |
| **ATK** | Attack power | Raw damage = ATK × ability power (basic attack = 1.0). Covers weapons and spells. |
| **DEF** | Defence | Mitigation = DEF ÷ (DEF + 25 + 5 × attacker level). About 30 % at even gear; better armour pushes it up. |
| **CRIT** | Critical-hit chance % | A crit deals ×1.75 damage. Cap 60 %. |
| **DODGE** | Dodge chance % | Avoids a hit entirely. Rolled before crit. Cap 50 %. |
| **HP regen** | HP per second | In battle as listed; **×5 out of battle**; full heal at shrines and inns. |
| **MP regen** | MP per second | Same rules as HP regen. |

Damage per hit = max(1, ATK × power × (1 − mitigation)) × (crit ? 1.75 : 1), unless dodged.
Everything rolls from the seeded sim RNG, so a battle is reproducible from its inputs (this
enables offline results, replays and multiplayer validation).

---

## 5. Classes

Three launch classes. Each has **base stats at level 1**, **growth per level**, three abilities
(unlocked at levels 1, 6 and 12) and a passive at level 20.

| | **Fighter** | **Rogue** | **Mage** |
|---|---|---|---|
| Role | Front line, tank | Burst, crits, evasion | Ranged spells, area damage, shields |
| HP | 140 (+14/lvl) | 100 (+10) | 80 (+8) |
| MP | 20 (+2) | 30 (+3) | 80 (+8) |
| ATK | 12 (+2.0) | 13 (+2.2) | 14 (+2.4) |
| DEF | 14 (+2.0) | 8 (+1.2) | 6 (+0.8) |
| CRIT | 5 % | **15 %** | 8 % |
| DODGE | 5 % | **15 %** | 5 % |
| HP regen | **2.0 /s** | 1.2 /s | 0.8 /s |
| MP regen | 0.5 /s | 0.8 /s | **2.0 /s** |
| Class bonus | +10 % DEF from shields | +25 % crit damage from behind | +20 % ATK on spells vs clustered foes |
| Abilities | **Cleave** (10 MP: 1.3× to target and adjacent) · **Shield Wall** (20 MP: +50 % DEF for 6 s, taunt) · **Second Wind** (25 MP: heal 25 % HP) | **Backstab** (10 MP: 1.6×, +25 % crit) · **Smoke Step** (15 MP: +30 % dodge for 5 s, drop aggro) · **Venom** (20 MP: poison over time) | **Firebolt** (12 MP: 1.8×) · **Frost Nova** (30 MP: 0.8× area, slow) · **Arcane Ward** (25 MP: shield an ally for 30 % of their max HP) |
| Passive (20) | *Iron Hide*: +10 % DEF, double HP regen below 30 % HP | *Opportunist*: crits restore 5 MP | *Kindled Mind*: +25 % MP regen |
| Model (KayKit) | Knight / Barbarian | Rogue / Rogue Hooded | Mage |

**Future classes** (sourced from the Grey Sisters in the world doc):
- **Cleric**: DEF- and HP-leaning support. *Mend* (heal), *Bless* (party ATK and DEF), and
  *Turn Undead* (heavy damage to the Ashbound, the main enemy family).
- **Healer**: pure support. *Renew* (heal over time), *Purge* (cleanse poison and slow), and
  *Lifeline* (prevent one death per battle).

Both slot in with the same stat block and ability format. No system changes are needed.

---

## 6. The party

- **You plus two companions.** The main character is chosen at the start (fighter, rogue or
  mage) and can't be dismissed.
- **Hire** at a town tavern. The roster shows 2–3 hirelings, refreshed daily. Each is within
  ±2 of your level, of an unlocked class, and has one **trait** (e.g. *Stubborn*: +10 % DEF;
  *Greedy*: +5 % gold found, costs more). Price is 50 gold × level, one-time.
- **Find** story companions in dungeons: rescued captives and quest rewards such as Brannoc
  (fighter) and Wren (rogue). They are free and have a unique trait and a personal quest.
- **Bench.** Recruited companions wait at the Thornwick inn and can be swapped in any town.
  Active members share XP equally; the bench earns 50 %.
- **Visible gear.** Weapons, shields, helmets and capes are toggleable meshes on the KayKit
  models, so a loot upgrade changes the silhouette.

---

## 7. Progression and the grind

- **Levels 1–30** at launch. XP to next level = 100 × L^1.6 (L1→2: 100; L10→11: ~4,000;
  L29→30: ~22,000). Stats grow per the class tables.
- **Enemy scaling.** Enemy level = region base + site tier (+0 to +3) + ⌊floor ÷ 2⌋. Enemy
  stats = archetype base × (1 + 0.14 × (level − 1)). *Elite*: ×2.5 HP, ×1.3 ATK. *Boss*:
  ×8 HP plus a signature mechanic.
- **The grind gate.** Tuning target: a party at the region's level wins a normal room with
  about 60–70 % HP left. At three levels under, it's a coin-flip. The **renown** needed to
  unlock the next act roughly matches reaching that region's level cap, so progress means
  grinding plus gear, not just story.
- **Renown** per region is earned from quests and bosses, and unlocks chapter quests, the next
  region's road, better tavern hirelings and the smith's upgrade tiers.
- **Endless depth.** Post-game, the Undervaults below the Ember Throne keep descending: +1
  level every two floors and a leaderboard (§12). The current build's descent system *is*
  this feature.

---

## 8. Loot

**Rare but valuable.** Most battles drop gold and materials. Gear drops are events.

| Slot | Fighter | Rogue | Mage |
|---|---|---|---|
| Weapon | swords, axes, greatswords | daggers, crossbows | staves, wands |
| Off-hand | shields | off-hand dagger | tomes |
| Armour | plate, mail | leather, cloaks | robes |
| Trinket | any class: rings, amulets, charms |||

| Rarity | Source | What it is |
|---|---|---|
| **Common** | shops only | Base stats. |
| **Fine** | 1 % per battle · 10 % per chest | Base + 1 random stat affix (from the eight stats). |
| **Rare** | 2 % per chest · 15 % per boss | Base + 2 affixes + one ability modifier (e.g. *Firebolt pierces*). |
| **Heirloom** | 1 % per boss · guaranteed from hidden sites | Named, fixed stats and a unique effect, plus a line of history (world doc §9). |

- **Class-based.** Every item except trinkets has a class. Drops roll 80 % towards classes in
  the active party.
- **Bad-luck protection.** Each boss kill without a Rare adds +3 % to the next roll.
- **Smith upgrades** go from +1 to +5. Each step gives +8 % base stats and costs gold, Embers
  and, from +3, wood and stone (the existing counters).
- **Salvage** off-class or outgrown items into **Embers** (the upgrade currency).

---

## 9. Quests (generated from the narrative)

**The quest board** in each town offers 3–5 mini-quests, refreshed at dawn (real time) or when
three are completed. **Chapter quests** (the main arc) are pinned on top and gated by renown.

A mini-quest is assembled deterministically from (world seed, region, day, guild rank, act
progress):

`giver (faction) + template + target (site / enemy / NPC) + hook (a line from the act tables) + reward`

| Template | Objective | Example |
|---|---|---|
| **Clear** | Clear a site or floor | *Warden Hale: "The Redhand have the Tithe Mill again. Burn them out."* |
| **Bounty** | Kill a named elite | *"Old Gutter, a grave rat the size of a dog, is eating the dead in the Barrows."* |
| **Rescue** | Free a captive (sometimes a found companion) | *"My brother went to Wickham Keep with a shovel and a bad idea."* |
| **Retrieve** | Bring back an item or lore fragment | *Sister Ilse: "A ledger from the Sickpools. Don't read it."* |
| **Delve** | Reach floor N of a site | *"Map the Cinderworks down to the fourth level."* |
| **Escort** | An NPC follows you; keep them alive | *"Get this surveyor to the Canal Locks and back."* |
| **Investigate** | Explore X rooms; guaranteed lore fragment | *"Something's lit in the Sunken Chapel at night."* |

- **Narrative coherence.** Hooks, givers and targets come from the current act and region
  tables in the world doc. Act I boards talk about bandits and opened barrows; Act III boards
  talk about the forges.
- **Difficulty** is shown as 1–3 skulls relative to the party's level.
- **Rewards:** gold, XP, renown, and sometimes a guaranteed Fine item or a companion.

---

## 10. World and travel

- **Overland map.** A fogged node map per region: towns, sites, landmarks and crossroads
  joined by roads and trails. The region skeleton is hand-authored (world doc §3). Minor
  sites and landmarks are procedural from the seed.
- **Travel** between nodes takes in-game time. Roads carry a 15 % encounter chance (ambushes,
  merchants, shrines, lore) and trails 30 %, but trails are faster. You can camp to regen.
- **Towns** are single-screen iso hubs with four buildings: **tavern** (hire, rumours),
  **smith** (sell, upgrade, salvage), **shrine** (heal, cure Wounded, bless) and the
  **Lantern Guild board** (quests).
- **Sites** are the current dungeon levels. Each site has 1–5 floors, a theme and tile variant
  from its region, and a boss in the descent room. Kinds:
  - *Keeps*: flagstone, fewer, larger rooms, human enemies.
  - *Crypts / barrows*: cobble, Ashbound.
  - *Caves*: cavern style.
  - *Imperial works*: rune plates.

---

## 11. Economy

| Currency | From | For |
|---|---|---|
| **Gold** | Quests, bounties, selling, chests | Hiring, healing, shop gear, upgrades |
| **Embers** | Salvage, bosses | Smith upgrades, rerolling an affix |
| **Wood / Stone** | Chests, rocks (existing counters) | High-tier upgrades; future camp or town improvements |
| **Renown** (per region) | Quests, bosses | Unlocks; not spendable |

Shops never sell above Common, so the best gear is always found.

---

## 12. Offline and multiplayer

**Offline-first.** The whole game runs locally with local saves (seed + diffs, as today). No
server is needed to play.

**Expeditions (idle).** Send the party, or a benched trio, to a cleared site for up to eight
hours. On return, the *same* battle sim fast-forwards the runs headless and pays out XP, gold,
materials and Embers. Gear-drop rates are halved on expeditions so active play stays the best
source of loot. Deterministic replay means an expedition's result is exact and cheat-checkable.

**Multiplayer (future), in order:**
1. **Async.** Undervault depth leaderboards. **Hire a friend's hero:** your main can be posted
   as a hireling snapshot in other players' taverns and earns you gold when hired.
2. **Co-op.** Two or three players each bring their main as the party, in a lockstep
   deterministic sim with the host authoritative.
3. **Arena.** Async party-vs-party autobattles against snapshots.

The fixed-tick, seeded, command-driven sim is exactly what 1–3 need. Command logs plus a seed
reproduce any battle for validation.

---

## 13. UX (portrait, one thumb)

| Screen | Content |
|---|---|
| **Site (iso)** | The current view: drag to move, tap to interact, minimap. The battle overlay adds overhead pips, a stance toggle (bottom), retreat (hold) and a potion toggle. |
| **Town** | An iso hub; tap a building. |
| **Quest board** | Cards: giver portrait, hook line, skulls, rewards. |
| **Party** | Three figures with live 3D previews, gear slots, stats and abilities; drag to reorder formation. |
| **Overland** | A scrolling fogged map with the party token; tap a node to travel. |
| **Chronicle** | Lore fragments by region, and set completion. |

Everything that matters sits in the lower two-thirds of the screen, within thumb reach.

---

## 14. What the prototype already provides

| In the build today | Becomes |
|---|---|
| Headless 20 Hz deterministic sim, seed + diff saves | The battle sim, offline expeditions and the multiplayer basis |
| Themed dungeon levels: rooms, corridors, weathered walls, descent, minimap | Sites and floors; post-game Undervaults |
| Six biomes; five tile styles × seven variants (plain, earth, rock, lava, poison, ice, water) | Region looks (world doc §3) |
| Chests, shrines, braziers, stairs | Loot, heals and lore; floor exits |
| Emberlit lighting; hazard pools | Battle readability; terrain tactics |
| 56 px KayKit actors, baked with real normals (knight hero; four Ashbound skeletons) | The class models and enemy families; the lab bakes rogue, mage and human enemies next |

**Needs building:** the combat sim and AI, the stats/class/loot data model, party and UI
screens, towns, the overland map, the quest generator, the Chronicle, expeditions and the
Emberfall rename.

---

## 15. Roadmap

| Milestone | Scope | Exit test |
|---|---|---|
| **M1: Battle core** | Stats and formulas, three classes, autobattle against the Ashbound in existing rooms, abilities, defeat, XP and levels | A solo fighter clears a floor at the tuning target (60–70 % HP left) |
| **M2: Party and town** | Two companions, Thornwick hub, tavern, smith, shrine, quest board (Clear/Bounty/Rescue/Retrieve), loot v1 | A 15-minute session loop feels complete |
| **M3: The Hollow Marches** | Overland region 1, four sites, Act I, Chronicle v1, balance pass | Levels 1–8 playable end to end |
| **M4: Idle and depth** | Expeditions, upgrades, salvage, Rare/Heirloom, bad-luck protection | A day of play-plus-idle feels rewarding |
| **M5: Fens and Reach** | Acts II–III, new enemies (Choir, beasts), Delve/Escort/Investigate | Levels 8–22 |
| **M6: Heights and Throne** | Act IV, finale, post-game Undervaults | Campaign complete |
| **M7: Multiplayer** | Async (leaderboards, hire friends' heroes), then co-op | — |

---

## 16. Open questions

1. **Manual moment?** Keep battles fully auto, or add one "rally" button per battle (a charged
   party ability) for a small skill expression?
2. **Retreat and defeat cost.** Is 25 % of carried gold plus Wounded companions the right
   sting for a grind game?
3. **Quest refresh.** Real-time dawn refresh (encourages daily return) vs play-based refresh
   only?
4. **Hardcore mode** with permadeath, as an opt-in?
5. **Monetization** (if any): cosmetics and expedition slots only. Never sell power or loot.
6. **Rename timing:** switch the build from EMBERHOLD to EMBERFALL now, or at M2?
