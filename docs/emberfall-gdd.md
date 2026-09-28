# Emberfall — Game Design Document

**v1.1 · 2026-09-28 · Plan of record for game design.** v1.1: room-based battles with respawning waves (§3). This supersedes the *game design*
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
2. **Battle, automatically.** Walk into a room with enemies and the party fights on its own.
   Enemies keep respawning until you leave or fall. You steer (position, focus, stance, when
   to leave) but never micro. Readable on a phone at arm's length.
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
| **Room** | 30 s – many min | Enter a room with NPCs → autobattle → wave cleared → lull → next wave (Heat rises) → stay and farm, or walk out to end it (§3). |
| **Quest** | 3–15 min | Town board → pick a mini-quest → travel overland → site (1–5 floors) → objective → return and turn in. |
| **Growth** | days–weeks | Level up, upgrade gear at the smith, hire or find better companions, raise regional renown → unlock the next act and region → harder enemies → grind again. |
| **Offline** | hours | Leave the party farming a room you've held; results are computed on return (§12). |

---

## 3. Rooms and autobattle

### 3.1 Moving through a map
Every site map (the current dungeon levels) is a set of **defined rooms** linked by
**corridors**. You move in two ways:
- **Virtual stick:** touch anywhere and drag (the floating joystick in the build today).
- **Tap to move:** tap a spot, a doorway or a room on the minimap, and the party walks there by
  the shortest path. Tapping a chest, shrine or the stairs walks there and uses it.

The party follows the leader in formation. **Corridors are always safe**: nothing spawns or
fights there. The **entrance room** is a safe sanctuary. On a site's first floor, a stone
stair against its back wall leads back up to the surface; walk up it to leave. The
**descent room** holds the floor's boss and the stairs down.

**Room size.** Rooms are arenas: 40–62 tiles across (about 1.6–2.5 screens wide at the
current zoom), with open shapes (rect, oval, diamond, L) so a party of three can spread out,
kite and retreat against waves. Corridors are 6 tiles wide, so the party walks abreast.
A level has 6–8 rooms.

### 3.2 The room battle
- **Entering a room with NPCs starts an autobattle** as soon as the party crosses the doorway.
  Every unit acts on its own through a deterministic AI in the 20 Hz sim.
- **NPCs keep respawning.** When a wave is down there's a short lull (about 4 s), then the next
  wave spawns at the room's spawn points, away from the party. Waves come from the room's spawn
  table (enemy family, level and size).
- **The battle continues until the party leaves the room or dies.** There's no victory
  screen: staying is farming. To stop, walk out through any doorway into a corridor.
- **Enemies are leashed to their room.** They never follow into corridors. When the party
  leaves, the room's survivors fade out and the room resets. It repopulates next time you enter.
- **Rooms show their threat** before you commit: level, enemy family and a skull rating appear
  on the minimap and over the doorway.

### 3.3 Waves and Heat (risk vs reward)
Each wave survived in a row raises the room's **Heat** by one, up to 10. Heat adds +4 % enemy
stats *and* +10 % gold, XP and gear-drop chance per step. Leaving the room resets Heat. The
grind decision is *how long to stay*: the rewards climb, and so does the danger. Every fifth
wave may include an **elite**. Bosses don't respawn with waves: a floor's boss spawns once
per visit to the site (or once per day in the post-game Undervaults).

### 3.4 What the player controls (one thumb)
- **Position** (stick or tap): move the leader within the room. The party re-forms around
  them, so you can pull enemies, dodge a hazard pool, or reach a chest.
- **Leave** (walk out a doorway): the only way to end a battle alive. Getting out *is* the
  retreat, so movement matters most when things go wrong.
- **Focus** (tap an enemy): the party prioritises that target until it dies.
- **Stance** (toggle): *Aggressive* (chase, spend MP freely), *Balanced*, or *Defensive*
  (hold formation, save MP for heals and shields).
- **Potions** (auto toggle): drink at < 30 % HP.

### 3.5 AI and formation
Each unit picks a target by role: the front line takes the nearest threat, the rogue the
lowest HP or the back line, and the mage clusters. Abilities cast when MP and conditions allow
(§5). Attack intervals are class-fixed: fighter 1.3 s, rogue 0.9 s, mage 1.6 s. Enemies use
archetype AI: Ashbound mages raise and buff, and Cult necromancers resurrect. Formation is
front (fighter), mid (rogue) and back (mage), auto-assigned and reorderable in the party screen.
The lull between waves counts as *out of battle* for regen (§4), so sustain decides how long a
party can hold a room.

### 3.6 Defeat
If the whole party falls, it is carried back to the last town. You keep XP and gear, lose
**25 % of carried gold** (gold banks when you visit a town), and fallen companions are
**Wounded** until a shrine heals them (gold or time). There's no permadeath. A *Hardcore* mode
is an open question.

### 3.7 Readability
At the current zoom (25 tiles across) figures are about 54 pt tall. Each unit shows HP/MP pips
overhead, floating damage numbers, a crit flash and a dodge "miss". A small room banner shows
the wave number and Heat. Hazard pools (lava, poison, ice, water) are impassable, so terrain
shapes the fight.

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
  *Lifeline* (prevent one death per room visit).

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
- **The grind gate.** Tuning target: a party at the region's level holds a normal room at
  Heat 0 indefinitely, with each wave costing about 30–40 % HP that the lull partly restores.
  Holding Heat 5+ needs gear or levels above the region. At three levels under, it's a coin-flip. The **renown** needed to
  unlock the next act roughly matches reaching that region's level cap, so progress means
  grinding plus gear, not just story.
- **Renown** per region is earned from quests and bosses, and unlocks chapter quests, the next
  region's road, better tavern hirelings and the smith's upgrade tiers.
- **Endless depth.** Post-game, the Undervaults below the Ember Throne keep descending: +1
  level every two floors and a leaderboard (§12). The current build's descent system *is*
  this feature.

---

## 8. Loot

**Rare but valuable.** Every kill drops a little gold, XP and sometimes materials. Gear
drops are events. Room Heat raises the gear-drop chance (§3.3).

| Slot | Fighter | Rogue | Mage |
|---|---|---|---|
| Weapon | swords, axes, greatswords | daggers, crossbows | staves, wands |
| Off-hand | shields | off-hand dagger | tomes |
| Armour | plate, mail | leather, cloaks | robes |
| Trinket | any class: rings, amulets, charms |||

| Rarity | Source | What it is |
|---|---|---|
| **Common** | shops only | Base stats. |
| **Fine** | 1 % per wave · 10 % per chest | Base + 1 random stat affix (from the eight stats). |
| **Rare** | 0.2 % per wave · 2 % per chest · 15 % per boss | Base + 2 affixes + one ability modifier (e.g. *Firebolt pierces*). |
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
| **Hold** | Survive N waves in a named room | *Warden Hale: "The Redhand have the Tithe Mill again. Burn them out."* |
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
- **Towns are hubs, one per region** (Thornwick, Saltmere, Ashgate, Frosthold). Each is the
  same place in a different region. A short **approach road** passes houses, farms and fields,
  then opens onto the **town square**, which works as the game's **home screen**. The camera
  settles on a fixed framing, a bar of four services slides up, and tapping a building or
  its button opens that service's menu. Buildings aren't enterable.
  - **Same shapes, regional tones.** The four service buildings have identical silhouettes and
    positions in every town, so they read like menu icons. Only materials and colour change
    with the region: warm oak and slate; damp grey-green; soot and rust tile; pale limestone
    and blue slate. The ground takes the region's tone too.
  - **The services:**

    | Building | Menu |
    |---|---|
    | **Shop** (smithy and outfitter) | Buy common gear and potions · Sell · Upgrade (+1…+5) · Salvage → Embers |
    | **Tavern** | The Lantern Guild's **quest board** (mini-quests) · Hire companions · Rumours |
    | **Inn** | Rest (restore HP/MP) · Lodge companions (the bench) · Expeditions (idle) |
    | **Temple** | Heal the Wounded · Blessings · The Chronicle (lore) |
- **Sites** are the current dungeon levels. Each site has 1–5 floors, a theme and tile variant
  from its region. Each room has a spawn table and a level; corridors and the entrance room
  are safe, and the floor's boss waits in the descent room. Kinds:
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

**Expeditions (idle).** Leave the party, or a benched trio, farming any room it has held for
10+ waves, for up to eight hours. The party always leaves on a wipe risk: if the sim says it
would fall, it walks out instead and the expedition ends early. On return, the *same* battle sim fast-forwards the runs headless and pays out XP, gold,
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
| **Site (iso)** | The current view: virtual stick or tap to move, tap to interact, minimap with room threat. In a room battle: overhead pips, a wave and Heat banner, stance toggle and potion toggle (bottom). Doorways glow as exits. |
| **Party cards** (always) | Bottom of every screen: **you in the centre, up to two companions either side**. Each card has a portrait, level badge, name, class, HP bar, ATK / DEF / CRT / DDG, and level with an XP bar. Empty slots say *hire at a town tavern*. |
| **Town square** | The home screen: a fixed framing of shop, tavern, inn and temple with name plaques; a bottom bar of the four services; each opens a bottom-sheet menu. No minimap here. |
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
| Themed dungeon levels: rooms, corridors, weathered walls, descent, minimap | Sites and floors; rooms are the battle arenas, corridors the safe paths; post-game Undervaults |
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
| **M1: Battle core** | Stats and formulas, three classes, room battles with respawning waves and Heat, leashing, tap-to-move, abilities, defeat, XP and levels | A solo fighter holds a Heat-0 room indefinitely and can walk out of a bad one |
| **M2: Party and town** | Two companions, Thornwick hub, tavern, smith, shrine, quest board (Hold/Bounty/Rescue/Retrieve), loot v1 | A 15-minute session loop feels complete |
| **M3: The Hollow Vale** | Overland region 1, four sites, Act I, Chronicle v1, balance pass | Levels 1–8 playable end to end |
| **M4: Idle and depth** | Expeditions, upgrades, salvage, Rare/Heirloom, bad-luck protection | A day of play-plus-idle feels rewarding |
| **M5: Fens and Reach** | Acts II–III, new enemies (Cult, beasts), Delve/Escort/Investigate | Levels 8–22 |
| **M6: Heights and Throne** | Act IV, finale, post-game Undervaults | Campaign complete |
| **M7: Multiplayer** | Async (leaderboards, hire friends' heroes), then co-op | — |

---

## 16. Open questions

1. **Manual moment?** Keep battles fully auto, or add one "rally" button per room visit (a charged
   party ability) for a small skill expression?
2. **Defeat cost.** Is 25 % of carried gold plus Wounded companions the right sting for a
   grind game where you choose how long to stay?
3. **Quest refresh.** Real-time dawn refresh (encourages daily return) vs play-based refresh
   only?
4. **Hardcore mode** with permadeath, as an opt-in?
5. **Monetization** (if any): cosmetics and expedition slots only. Never sell power or loot.
6. **Rename timing:** switch the build from EMBERHOLD to EMBERFALL now, or at M2?
7. **Heat tuning.** Is +4 % enemy stats and +10 % rewards per wave the right curve, and should
   Heat cap at 10?
