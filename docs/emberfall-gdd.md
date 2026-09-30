# Emberfall — Game Design Document

**v1.7 · 2026-09-30 · Plan of record for game design.** v1.7 triples the XP a level takes (§7):
300 × L^1.6, so each level is three times the play.

v1.6 caps the tide (§3.3): waves climb to a
top, then fall back and climb again, so a party strong enough for the top can farm a room as long
as it likes.

v1.5 rebalances fights (§7.1): the room sets
the wave, not the party; waves rise with a tide; lulls are a breath, not a full recovery; gear
carries a real share of your power; companions share XP. A lone hero beats level-1 foes but can't
farm them, and same-level rooms from level 4 want the right party in gear at your level.

v1.4 puts the Lantern Guild's board up
(§9): five templates, a new board each in-game day, three jobs held at once.

v1.3 gives every dungeon floor a stair up, one floor at a time, and a site remembers its floors
for the visit (§3.1).

v1.2 adds:
- attributes and stat points (§4.1);
- skills and stances (§5.1);
- character creation and origins (§6.1);
- death and resurrection (§3.6);
- special loot sources (§8);
- hero quests, discovery and the Journal (§9);
- the multiplayer phases (§12).

The build order moved to [development-plan.md](./development-plan.md) and the tech stack to
[architecture.md](./architecture.md). All narrative text is pre-written: there is no
runtime text generation. v1.1 added room-based battles with respawning waves (§3). This supersedes the *game design*
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
| **Room** | 30 s – many min | Enter a room with NPCs → autobattle → wave cleared → a breath → the next wave, a little tougher (the tide) → walk out to recover, or the room wins (§3, §7.1). |
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
fights there. The **entrance room** is a safe sanctuary. On **every floor**, a stone stair
against its back wall leads back up, one floor at a time: on a site's first floor it leads out
to the surface; deeper, it climbs to the floor above, arriving in the corridor just outside that
floor's descent room (never inside it). The **descent room** holds the floor's boss and the
stairs down, which go one floor deeper, arriving at the foot of that floor's stair up. The stairs
down are a stone stairwell 6 tiles by 6 cut into the descent room's floor, a brazier either side
of its top step, the flight going down to an arch lit violet (2026-09-30; before, a small marker
on one tile: `docs/stairs-down-before-after.png`). Nothing walks over it; any tile of it takes
you down from its rim. No stair
skips a floor. A site remembers every floor you've been on for the visit (chests opened, growths
cut, the map uncovered), so going up and down can't refill them; leaving the site ends the visit.

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
  screen. Each wave of a visit rises with the tide (§3.3) up to a cap, then falls back and climbs
  again. A visit ends when you walk out through a doorway (corridors restore you) or when the
  room wins. A party that can hold the top can farm a room for as long as it likes.
- **Enemies are leashed to their room.** They never follow into corridors. When the party
  leaves, the room's survivors fade out and the room resets. It repopulates next time you enter.
- **Rooms show their threat** before you commit: level, enemy family and a skull rating appear
  on the minimap and over the doorway.

### 3.3 Room levels and waves (risk vs reward)
**Every room has a fixed level.** Within one visit the waves rise with the **tide**: each wave is
6 % tougher (HP and ATK) than the one before, up to a **cap** (v1.6). The wave after the top is
back at the start ("the room falls back"), and the climb begins again. So the top is what a party
must hold to farm a room indefinitely; anything weaker is worn down on the climb.

| Room | Step | Cap | Waves to the top |
|---|---|---|---|
| Ordinary room | +6 % a wave | +100 % | 18 (wave 18 at +100 %, wave 19 back at +0 %) |
| Special: a floor's stairs-down hall | +6 % a wave | +150 % | 26 |

The profiles are data (`TIDES` in `sim/battle.js`); a room can name one with `tide`, and the
stairs-down hall uses `hall` by default. The steps are fixed, not rolled.

Levels rise as you **advance deeper**:

- **Deeper rooms are harder.** Rooms are ranked by walking distance from the entrance, and
  every two rooms further in is one level harder. The descent room is always the hardest on
  its floor.
- **Deeper floors are harder.** Each floor down starts where the one above left off:

  room level = 1 + 3 × floor + ⌊rank ÷ 2⌋

  So floor 1 runs from level 1 to 4, floor 2 from 4 to 7, and so on. The entrance room is a
  safe sanctuary (level 0).
- **Every site has its own band (M5, `src/sim/sites.js`):** room level = the site's base + its
  levels a floor × floor + ⌊rank ÷ 2⌋. The Tithe Mill runs 1–3 on one floor, Wickham Keep 3–6 on
  two, the Sunken Chapel 5–8 on two, the Ninth Milestone is 8 throughout; the Old Barrows keep
  the formula above and go on down. A site's last floor ends in its hall, with no stairs down.
- **Bosses (M5):** a floor's stairs-down hall can hold its site's boss (`sites.js`), who opens
  the fight with an escort; once it falls, the hall goes quiet for the visit. Each has one
  signature mechanic: Captain Garrow (Wickham Keep) calls two of his men at 2/3 and 1/3 HP and takes
  half damage while they stand; the Robed Stranger (the Sunken Chapel) raises the last foe slain
  every 12 s; the Standard of the Third Legion (the Old Barrows' third floor, optional and
  repeatable) halves the damage taken by the Ashbound within 4 tiles of it. A story boss falls
  once; a boss's first fall leaves its heirloom, and every fall a Fine or better item. The HUD shows
  a boss's name and health under the room pill, with a shield while it's guarded.
- **Who fights** is the site's family (M5, `battle.js` FAMILIES): the Ashbound in the barrows; the
  Redhand Company (cutthroat, brute, crossbowman; their elite a Sergeant) in the Tithe Mill and
  Wickham Keep, with the Ashbound they dug up on the Keep's second floor; the Ashbound and Cinder
  acolytes in the Sunken Chapel. Each Redhand archetype mirrors an Ashbound role's strength, so a
  room's difficulty is its level whoever fills it; bandits carry more coin. Turn Undead reaches only
  the Ashbound.
- **Enemy stats** = archetype base × (1 + 0.14 × (level − 1)) for HP and DEF, and
  × (1 + 0.12 × (level − 1)) for ATK; above level 3, × (1 + 0.05 × (level − 3)) more (the
  premium for the party and gear a same-level room expects, §7.1); × the tide. XP and gold per
  kill scale with the room's level, so deeper rooms pay more.
- **The room sets the wave size, not the party (v1.5):** 2 foes to room level 3, then
  1 + ⌊level ÷ 2⌋ (3 at 4–5, 4 at 6–7, 5 at 8–9 …), up to 7. Archers and skeleton mages
  make up to a third of a wave, and at least one in every second wave. Every fifth wave an
  **elite** takes one slot.
- **The lull is 4 s,** a breath: regen runs at 1.5× (5× in corridors and towns). Downed
  companions get back up at 25 % HP when a wave is cleared.
- **Rooms show their threat** before you commit. Each discovered room's level is on the
  minimap, coloured against your level:

  | Room vs your level | Colour | Reads as |
  |---|---|---|
  | at or below | gold | even match |
  | +1 | amber | a step up |
  | +2 | orange | dangerous |
  | +3 or more | red | deadly |

  Entering a room shows its level.
- **Bosses don't respawn with waves.** A floor's boss spawns once per visit to the site (or
  once per day in the post-game Undervaults).

The grind decision is **how deep to push**. Farm a room at your level safely and
indefinitely, or step into a deeper room for better XP and gold at real risk.

### 3.4 What the player controls (one thumb)
- **Position** (stick or tap): move the leader within the room. The party re-forms around
  them, so you can pull enemies, dodge a hazard pool, or reach a chest. Stop steering and the
  leader **autobattles** after half a second: it chases and strikes on its own, routing
  around pillars and pools. It never walks out of the room by itself.
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
front (fighter), mid (rogue) and back (mage): foes reach for the front line first, counting
the rogue 1 tile and the mage 2.5 tiles further away than they are (shipped at M3). The mage
backs off from anything within 3.2 tiles (melee foes reach 2.8–3). A full party of three
faces the same wave a lone hero would (v1.5): companions are added strength. The lull is only a
breath (§3.3), so healing and sustain decide how long a party can stay.

### 3.6 Death, resurrection and defeat
**States:** Healthy → **Downed** (0 HP in battle) → **Fallen** (dead) → resurrected.

- **Downed:** if the wave is cleared, Downed members rise in the lull at 20 % HP.
- **Downed → Fallen** happens when a member is downed a **second time in the same room
  visit** — counted in waves back to back: standing through one cleared wave forgets the
  earlier down — or when the party **leaves the
  room** with them still Downed.
- **Fallen:**
  - the member follows as a ghost: no fighting, no XP;
  - they can be resurrected at a **Temple** (25 gold × level; free once a day for heroes at
    level 5 or lower), at a site **Shrine** (one use each), or with a rare **Phoenix Ember**.
    A level-20 Cleric's *Lifeline* keeps one ally a room visit from going down at all.
- **The hero** stays Downed, never Fallen, while any companion stands.
- **The lull** is 4 s at 1.5× regen, and the room doesn't wait (v1.5; it had waited until
  everyone was back over 60 %, which let a room be held forever).
- **Temple:** an in-game day is 24 minutes of play. **Shrine:** with nobody Fallen it
  restores the party instead. **Inn rest:** 5 gold × your level; full HP and MP, and lifts
  Weakened.
- **Wipe:** if everyone is down, the party wakes at the region town's **Temple**:
  - everyone is restored to 30 % HP and Fallen status is cleared;
  - you lose **25 % of carried gold** (gold banks when you visit a town);
  - everyone is **Weakened** (−10 % stats) until they rest at the inn or 10 minutes pass;
  - you keep your XP and gear.
- There is no permadeath; *Hardcore* is an opt-in at creation (later).

Details are in [development-plan.md §2.10](./development-plan.md).

### 3.7 Readability
At the current zoom (25 tiles across) figures are about 54 pt tall. Each unit shows HP/MP pips
overhead, floating damage numbers, a crit flash and a dodge "miss". A small room banner shows
the room's level and the wave number. Hazard pools (lava, poison, ice, water) are impassable, so terrain
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
| **HP regen** | HP per second | As listed at level 1, growing in step with max HP. **×5 out of battle** (corridors, the overland, towns), ×1.5 in a room's lulls; full heal at shrines and inns. |
| **MP regen** | MP per second | Same rules as HP regen. |

Damage per hit = max(1, ATK × power × (1 − mitigation)) × (crit ? 1.75 : 1), unless dodged.
Everything rolls from the seeded sim RNG, so a battle is reproducible from its inputs (this
enables offline results, replays and multiplayer validation).

### 4.1 Attributes and stat points
Four attributes feed the derived stats above:

| Attribute | Feeds | Per point (starting values, tuned by the balance harness) |
|---|---|---|
| **Might** | ATK | +0.4 ATK |
| **Grit** | HP, DEF | +3.5 HP, +0.3 DEF |
| **Finesse** | CRIT, DODGE | +0.25 % CRIT, +0.2 % DODGE |
| **Focus** | MP, MP regen, ability power | +2.5 MP, +0.03 MP/s, +0.5 % ability power |

- **Points:** each level-up grants **3 points**. Class growth per level stays automatic: the
  class-table growth minus what the recommended build adds (fighter 7 HP, 2 MP, 1.6 ATK,
  1.4 DEF; rogue 6.5 / 3 / 1.8 / 0.9; mage 8 / 3 / 2.0 / 0.8).
- **Recommended build** (one level's points): fighter Grit, Might, Grit; rogue Might,
  Finesse, Grit; mage Focus, Might, Focus. It reproduces the class-table HP, MP, ATK and DEF
  exactly; its CRIT, DODGE, MP regen and ability power are the build's own edge. Choice adds
  variety, not power creep. Unspent points aren't stored: they follow from your level.
- **Companions** auto-allocate by class template, or you manage them yourself.
- **Respec** at the temple: the first is free, then 20 gold × level.
- **Gear** adds on top (§8). A fresh character in the class kit has exactly the class-table
  numbers.

---

## 5. Classes

Four launch classes. Each has **base stats at level 1**, **growth per level**, three abilities
(unlocked at levels 1, 6 and 12) and a passive at level 20. The Cleric joined at M3 (sourced
from the Grey Sisters, world doc §4): playable at creation and hireable at every tavern.

| | **Fighter** | **Rogue** | **Mage** | **Cleric** |
|---|---|---|---|---|
| Role | Front line, tank | Burst, crits, evasion | Ranged spells, area damage, shields | Support: heals, blessings, the bane of the dead |
| HP | 140 (+14/lvl) | 100 (+10) | 80 (+8) | 125 (+12) |
| MP | 20 (+2) | 30 (+3) | 80 (+8) | 50 (+5) |
| ATK | 12 (+2.0) | 13 (+2.2) | 14 (+2.4) | 11 (+1.8) |
| DEF | 14 (+2.0) | 8 (+1.2) | 6 (+0.8) | 12 (+1.8) |
| CRIT | 5 % | **15 %** | 8 % | 5 % |
| DODGE | 5 % | **15 %** | 5 % | 5 % |
| HP regen | **2.0 /s** | 1.2 /s | 0.8 /s | 1.6 /s |
| MP regen | 0.5 /s | 0.8 /s | **2.0 /s** | 1.5 /s |
| Class bonus | +10 % DEF while carrying a shield | Crits from behind the target deal +25 % | Spells deal +20 % to a foe with two or more others within 2 tiles | Heals are +20 % stronger |
| Abilities | **Cleave** (10 MP: 1.3× to target and adjacent) · **Shield Wall** (20 MP: +50 % DEF for 6 s, taunt) · **Second Wind** (25 MP: heal 25 % HP) | **Backstab** (10 MP: 1.6×, +25 % crit) · **Smoke Step** (15 MP: +30 % dodge for 5 s, drop aggro) · **Venom** (20 MP: poison over time) | **Firebolt** (12 MP: 1.8×) · **Frost Nova** (30 MP: 0.8× area, slow) · **Arcane Ward** (25 MP: shield an ally for 30 % of their max HP) | **Mend** (12 MP: heal the most hurt ally 22 % of max HP) · **Bless** (25 MP: the party +15 % ATK and DEF for 8 s) · **Turn Undead** (30 MP: 1.6× to every Ashbound within 3 tiles) |
| Passive (20) | *Iron Hide*: +10 % DEF, double HP regen below 30 % HP | *Opportunist*: crits restore 5 MP | *Kindled Mind*: +25 % MP regen | *Lifeline*: once a room visit, an ally who would be Downed holds on at 1 HP |
| Model (KayKit) | Knight / Barbarian | Rogue / Rogue Hooded | Mage | Mage, bareheaded, in off-white vestments with a grey stole, a flanged mace (our own model) and a chained psalter |

The class bonuses sit on top of the class table: a fighter in the class kit (with its round
shield) has 15.4 DEF. The cleric's kit is a mace, a chained psalter, vestments and pilgrim boots.
It carries the same stats as the fighter-style kit it replaced (sword, kite shield, plate and
sabatons), so the class's numbers are unchanged; only its look is different. The cleric can also
wear the fighter's sword, shields, great helm, plate and sabatons, and has two more items of its
own (Chapel Sword, Book of Hours). Recommended build: Grit, Focus, Grit.

**Future class** (sourced from the Grey Sisters in the world doc):
- **Healer**: pure support. *Renew* (heal over time), *Purge* (cleanse poison and slow), and
  *Sanctuary* (a party-wide heal). *Lifeline* became the Cleric's passive.

Both slot in with the same stat block and ability format. No system changes are needed.

### 5.1 Skills, ranks and stances
- **Unlocks:**
  - the level-1 ability comes at creation;
  - the level-6 and level-12 abilities unlock through **class trials**, short quests (§9).
    (M5) The level-6 trials are the company's, not the hero's: a trial is offered when anyone of
    that class in the party or on the bench is level 6+, and once done every member of the class
    knows the ability, companions hired later included. Teachers: Osric (fighter), Nell Tolley
    (rogue), Hedda (mage), Sister Ilse (cleric). The level-12 abilities unlock by level until the
    M8 trials;
  - the passive comes at level 20.
- **Skill points:** 1 at every even level. Ranks 1–5; each rank adds +10 % power, and ranks
  3 and 5 also cost 1 MP less.
- **Auto-cast:** each ability has an auto-cast toggle and a priority order, set in the
  **Skills** tab of the character window.
- **Stance** per member (§3.4) is set in the same tab:
  - *Aggressive*: +10 % ATK, −10 % DEF; spends MP freely, heals and guards only below 30 %
    HP, and a fighter companion picks its own targets.
  - *Balanced*: no modifiers; strikes freely, and holds back MP for a guard or heal once
    anyone is below half HP.
  - *Defensive*: −10 % ATK, +15 % DEF; keeps half its MP for guards and heals (below 65 %
    HP), and melee companions fight only what comes within 5 tiles of the leader.
- **Casting order:** on its turn a member casts the first ability, top down in its priority
  order, that is unlocked, on auto-cast, affordable and worth it (a guard when threatened, a
  heal when hurt, a ward on the most hurt ally, a nova on two or more foes close by);
  otherwise a strike replaces the basic attack.
- **Rare gear modifiers** (§8) stack with ranks.

---

## 6. The party

- **You plus two companions.** The main character is chosen at the start (fighter, rogue or
  mage) and can't be dismissed.
- **Hire** at a town tavern. The roster shows 2–3 hirelings, refreshed daily. Each is within
  ±2 of your level, of an unlocked class, and has one **trait** (e.g. *Stubborn*: +10 % DEF;
  *Greedy*: +5 % gold found, costs more). Price is 50 gold × level, one-time.
- **Find** story companions in dungeons: rescued captives and quest rewards such as Brannoc
  (fighter) and Wren (rogue). They are free and have a unique trait and a personal quest.
  (M5) Brannoc waits chained in Wickham Keep's second-floor hall and joins once Captain Garrow has
  fallen. You talk to a found companion from their party card; they can be benched, never released.
- **Bench.** Recruited companions wait at the Thornwick inn and can be swapped in any town.
  Active members share XP equally; the bench earns 50 %. The bench holds six; a hire with the
  party full goes straight to it.
- **Visible gear.** Weapons, shields, helmets and capes are toggleable meshes on the KayKit
  models, so a loot upgrade changes the silhouette.

### 6.1 Heroes: creation, origins and slots
- **Game slots:** up to **3 game slots**. Each is its own game: its own world seed, main
  character, party and save.
- **Hero slots:** within a game, the party has **three**: your **main character** plus **two
  companions**.
  - The main character is created once, at New Game.
  - The two companion slots are filled from everyone you've hired or found, and swapped with
    the bench at the inn.
- **Attribute points:** 3 per level for every member (§4.1).
- **Creation:**
  - **class:** fighter, rogue or mage;
  - **look:** a base model per class plus accent palettes;
  - **origin;**
  - **name:** with naming-guide suggestions.
- **Origins** tie the hero to a faction (world doc §4) and change dialogue:

  | Origin | Faction | Edge |
  |---|---|---|
  | *Thornwick-born* | Maudry Fenn | +1 tavern hireling option |
  | *Redhand deserter* | The Redhand Company | +1 ATK at level 1; bandits may parley |
  | *Ward of the Grey Sisters* | The Grey Sisters | +20 % XP from lore |
  | *Deepdelver-fostered* | The Deepdelvers | −10 % smith upgrade cost |

- The first new game plays the intro, *The Chronicle of the Fall*.
- Details are in [development-plan.md §2.1–§2.3](./development-plan.md).

---

## 7. Progression and the grind

- **Levels 1–30** at launch. XP to next level = 300 × L^1.6 (L1→2: 300; L10→11: ~12,000;
  L29→30: ~66,000). (v1.7: tripled from 100 × L^1.6, so each level takes three times the play.)
  Stats grow per the class tables.
- **Enemy scaling.** Enemy level = the room's level (§3.3), offset by the region base and the
  site tier (+0 to +3). Stats = archetype base × (1 + 0.14 × (level − 1)) (ATK 0.12).
  *Elite*: ×2.5 HP, ×1.3 ATK. *Boss*: ×8 HP plus a signature mechanic.
- **The grind gate.** Progress needs levels, gear and the right party (§7.1). The **renown**
  needed to unlock the next act roughly matches reaching that region's level cap, so progress
  means grinding plus gear, not just story.
### 7.1 Difficulty: levels, gear and the right party (v1.5)

**The contract** (gated by `smoke-test.mjs`; measurements in
[difficulty-pass-1.md](./difficulty-pass-1.md)). Every visit here is one you never walk out of:

| Who | Same-level room | Notes |
|---|---|---|
| A lone hero, levels 1–3, kit at level | Wins the first 3+ waves, goes down by wave 12 | You beat level-1 foes alone but can't farm them. Walk out to recover and go back in. |
| A lone hero, level 4+ | Down within 2 waves | Same-level rooms want company. Rooms well below you are for solo. |
| The right party (tank, damage, healer) in gear at level | Holds 10+ waves, nobody Fallen in the first five | The tide climbs to +100 %, then falls back. Holding the top means farming as long as you like. |
| A party with no healer, level 6+ | Worn down within 5 minutes | Composition matters. |
| Any party, a room 3 levels up | Defeated | |

**Why companions help:**
- The wave is the room's, the same for a lone hero and a party of three (it had grown with the
  party, so each member faced more foes).
- A kill's XP goes to each living member at 100 % alone, 65 % each for two, 50 % each for three.
  A party clears faster, so each member earns 80 %+ of a lone hero's XP a minute in the same
  room, and can take rooms a lone hero can't.

**Why gear matters:**
- Items grow twice as fast with item level: a + b × ilv + b × (ilv − 1).
- The classes grow that much less per level themselves. A hero in the class kit at their level
  has the stats they had before, and one in gear five levels old is visibly behind.
- An item's stats are re-derived from (base, ilv, rarity) on load, so old loot follows the formula.
- Measured: the right party at level 6 holds a room two up for 9 waves in Fine gear at level,
  6 in its level-1 kit.

**Leaving is the way to farm** (implemented 2026-09-30):
- In a fight the room pill reads *ROOM LV 4 · WAVE 6 · FOES +30%*: the tide, in the open. When it
  falls back from the top, a banner says *The room falls back*.
- A **Step out** button sits above the party cards on the right (`src/ui/stepout.js`). It walks
  the hero to the nearest corridor tile past a doorway (the compass row `step-out`,
  `sim/travel.js`), where the fight ends and the corridor restores the party at 5×.
- The button pulses under 45 % party HP ("the party is low"). If a companion is Downed, it warns
  that leaving makes them Fallen.
- Going back in is a fresh visit, with the tide back at the start. Measured: a lone level-1 hero
  who steps out when low clears more waves over four visits than one stubborn visit, and never
  wipes (`test/stepout.test.mjs`).
- **The board says when a job wants company:** a Warden's hall or a Delve floor of room level 4+
  that's no more than a level under yours (`companyFor`, `sim/board.js`). The card shows
  *⚑ Bring company*, and the Journal says *bring company*.

**Class notes:**
- A lone mage lasts longest of the damage classes (8–15 waves at level 1): it kites.
- A lone cleric outlasts everyone (13–21 waves) but earns the least XP a minute.
- Neither farms forever.

- **Renown** per region is earned from quests and bosses, and unlocks chapter quests, the next
  region's road, better tavern hirelings and the smith's upgrade tiers.
- **Endless depth.** Post-game, the Undervaults below the Ember Throne keep descending: +1
  level every two floors and a leaderboard (§12). The current build's descent system *is*
  this feature.

---

## 8. Loot

**Rare but valuable.** Every kill drops a little gold, XP and sometimes materials. Gear
drops are events. Deeper rooms raise the gear-drop chance (§3.3).

| Slot | Fighter | Rogue | Mage |
|---|---|---|---|
| Weapon | swords, axes, greatswords, great-axes | daggers, hand and heavy crossbows | wands, staves |
| Off-hand | shields | off-hand dagger | tomes |
| Helm | great helm, bear hood | hood | witch hat |
| Armor | plate, fur mail | leathers | robes |
| Boots | sabatons, fur boots | soft boots | slippers |
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
- **Salvage** off-class or outgrown items into **Embers** (the upgrade currency). The Ember
  count sits in the top bar, next to gold.
- **The party bag** has 20 slots. Identical plain items stack in one slot, up to 10: the same
  base, rarity, item level and name, and no affixes, Rare modifier or flavour. A full bag still
  takes an item that fits an existing stack; anything else that drops is salvaged at once.
  Low-level Common metal is *Battered* (it was *Worn*, which read as "equipped").
- **Special sources** (v1.2):
  - **Ember Rifts** (timed weekly dungeons) drop *Kindled* items: Fine or better with a
    Rift-only affix.
  - **Region bosses** (weekly lockout) have heirloom tables and give a guaranteed Rare on
    the first kill each week.
  - **Hidden sites**, revealed by completing a Chronicle set, give a guaranteed Heirloom.
  - **Chapter quests** give a guaranteed Fine.
- **Drop rates:** loot v1 ships generous drop rates so the loop is felt early
  (`gear-and-loot-plan.md`). M5 tunes toward the targets above with a headless farm run:
  about 3 Common, about 1 Fine, and about 1 Rare per 5 hours of active play. Rare and above
  always fits the party's classes.
  (M5, done) Measured with `tools/balance/loot.mjs` over 27 h at levels 3 / 6 / 9: 3.4 Common,
  0.92 Fine and 0.17 Rare an hour. A boss's first fall always drops Fine or better; later falls roll
  for it (15 %), so a repeatable boss like the Standard can't be farmed for Rares.

---

## 9. Quests (generated from the narrative)

**The quest board** in each town offers 3–5 mini-quests, refreshed at dawn (real time) or when
three are completed. **Chapter quests** (the main arc) are pinned on top and gated by renown.

**Implemented (v1.4, M4 slice 3).** Thornwick's board hangs in the Tired Mule (Tavern → Quest
board); `src/sim/board.js`, words in `content/board/`.
- **When it refreshes:** at in-game dawn, every 24 minutes of play, the first time you're in town
  that day. Not "when three are completed" yet.
- **How many jobs:** 3 jobs, or 4 from level 4. The jobs are fixed for the day at the level you
  had when the board went up.
- **Holding jobs:** at most **3** open at once. They're taken and handed in only at the board.
- **Templates:**
  - **Hold** N waves (3–6);
  - **Retrieve**: open N chests (1–3);
  - **Bounty**: slay N elites (1–2);
  - **Delve**: reach floor F;
  - **Warden**: hold N waves (2–3) in the stairs-down hall of floor F or deeper.

  All five are in the Old Barrows until M5 adds sites. Rescue, Escort and Investigate wait for
  captives, escorts and fragments.
- **No job asks for a place more than two levels above you:** three above defeats you (§ balance).
- **Skulls:** 1 when the place is at or below your level, 2 at one to two levels above.
- **Pay** is on top of the fighting: about half its XP again (12 × level per wave of work) and
  a little more than its gold ((3 + 2 × level) per wave of work), +25 % per skull above one.

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
- **Beyond the board** (v1.2), the Hero component:
  - **Hero quests:** chapters (the main arc), companion chains and class trials.
  - **NPC errands:** random side quests offered by quest-giver NPCs, from the same templates
    and pre-written hook pools.
  - **Bounties:** from the watch.
  - **Discovery:** places, NPCs met, bosses beaten and **lore fragments** into the Chronicle.
  - **Gating:** by region, town, level window, renown, act, class, origin and flags.
  - **The Journal** (quest log) tracks everything. The tracked quest drives the compass.
  - Full spec: [quest-lore-system.md](./quest-lore-system.md).

---

## 10. World and travel

- **Overland map.** A fogged node map per region: towns, sites, landmarks and crossroads
  joined by roads and trails. The region skeleton is hand-authored (world doc §3). Minor
  sites and landmarks are procedural from the seed.
- **Travel** between nodes takes in-game time. Roads carry a 15 % encounter chance (ambushes,
  merchants, shrines, lore) and trails 30 %, but trails are faster. You can camp to regen.
- **Towns are hubs, one per region** (Thornwick, Saltmere, Ashgate, Frosthold). Each is the
  same place in a different region.
  - **Approach road:** it passes the cosmetic buildings (houses, farms and fields), which stand
    well away from the square, out past the stream, so the square stays clear.
  - **The square is the home screen.** It is laid out **exactly the same in every town**, so it
    stays familiar like a menu:

    | Position | Left | Right |
    |---|---|---|
    | Back row | Temple | Inn |
    | Middle row | Shop | Tavern |
    | Front | Smithy (forge open to the square) | Well |

  - **Using services:**
    - When the hero nears the square, the camera settles on that fixed framing and a bar of the
      five services slides up. Tapping a building or its button opens that service's menu.
    - Away from the square, tapping a service building walks you to the square instead.
    - Buildings aren't enterable.
  - **Same shapes, regional tones.** The five service buildings have identical silhouettes and
    positions in every town, so they read like menu icons. Only materials, colour and names
    change with the region:
    - Vale: warm oak and slate.
    - Fens: damp grey-green.
    - Reach: soot and rust tile.
    - Heights: pale limestone and blue slate.

    The ground takes the region's tone too.
  - **The services:**

    | Building | Menu |
    |---|---|
    | **Shop** (provisioner / outfitter) | Buy potions, supplies and common gear · Sell |
    | **Smith** (the forge) | Upgrade (+1…+5) · Reforge a trait · Salvage → Embers |
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

**Fair play (v1.2).** Progress that counts anywhere shared is **verified**:
- The server replays each play session's command log in the same deterministic sim, and only
  that result is stored.
- Edited memory, edited saves, forged items and sped-up clocks don't survive the replay.
- Offline play is unverified until it syncs.

See [development-plan.md §2.13](./development-plan.md).

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

**Expanded in v1.2:**
- **Shared instances:** town presence and co-op sites.
- **Group raids:** 4–6 players against *Heroic* region bosses.
- **Live PvP arena:** 1v1 and 3v3 party autobattles with seasons.

The servers are authoritative and run the same sim. There's no player trading at first.
Phases and tech are in [development-plan.md §2.12](./development-plan.md) and
[architecture.md §6](./architecture.md).

The fixed-tick, seeded, command-driven sim is exactly what 1–3 need. Command logs plus a seed
reproduce any battle for validation.

---

## 13. UX (portrait, one thumb)

| Screen | Content |
|---|---|
| **Site (iso)** | The current view: virtual stick or tap to move, tap to interact, minimap with room threat. In a room battle: overhead pips, a room-level and wave banner, stance toggle and potion toggle (bottom). Doorways glow as exits. |
| **Party cards** (always) | Bottom of every screen: **you in the centre, up to two companions either side**. Each card has a portrait, level badge, name, class, HP bar, ATK / DEF / CRT / DDG, and level with an XP bar. Empty slots say *hire at a town tavern*. |
| **Town square** | The home screen: the same fixed framing in every town (temple, inn, shop, tavern, smithy) with name plaques; a bottom bar of the five services, shown once you're near the square; each opens a bottom-sheet menu. No minimap here. |
| **Quest board** | Cards: giver portrait, hook line, skulls, rewards. |
| **Party** | Three figures with live 3D previews, gear slots, stats and abilities; drag to reorder formation. |
| **Overland** | A scrolling fogged map with the party token; tap a node to travel. |
| **Chronicle** | Lore fragments by region, and set completion. |
| **Title** (v1.2) | A live dusk vignette of Thornwick; Continue / Party / Settings / Account. |
| **Game slots, Party and Creator** (v1.2) | Up to three games. Each game has three hero slots (main plus two companions), with a bench swap. Creation is a live preview plus steps: class, look, origin, name. |
| **Character window** (v1.2) | Tap a party card. Tabs: Gear · Stats (spend points) · Skills (ranks, auto-cast, stance) · Bag · Info. |
| **Dialogue** (v1.2) | Bottom sheet: portrait, lines, up to 4 choices, quest offer cards. |
| **Journal** (v1.2) | Active · Available · Completed · Chronicle · Discoveries; Track pins the compass. |

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

> **v1.2:** the build order is now kept in
> [development-plan.md §3](./development-plan.md). It adds M2.5 Foundations, M3 Heroes,
> M4 Story engine, M5 The Hollow Vale, M6 Accounts and ship, M7 Endgame loops, M8–M9 the
> remaining regions, and M10–M12 multiplayer. The table below is the original v1.1 plan,
> kept for history.

| Milestone | Scope | Exit test |
|---|---|---|
| **M1: Battle core** | Stats and formulas, three classes, room battles with respawning waves at fixed room levels, leashing, tap-to-move, abilities, defeat, XP and levels | A solo fighter holds a room of their level indefinitely and can walk out of a bad one |
| **M2: Party and town** | Two companions, Thornwick hub, tavern, smith, shrine, quest board (Hold/Bounty/Rescue/Retrieve), loot v1 | A 15-minute session loop feels complete |
| **M3: The Hollow Vale** | Overland region 1, four sites, Act I, Chronicle v1, balance pass | Levels 1–8 playable end to end |
| **M4: Idle and depth** | Expeditions, upgrades, salvage, Rare/Heirloom, bad-luck protection | A day of play-plus-idle feels rewarding |
| **M5: Fens and Reach** | Acts II–III, new enemies (Cult, beasts), Delve/Escort/Investigate | Levels 8–22 |
| **M6: Heights and Throne** | Act IV, finale, post-game Undervaults | Campaign complete |
| **M7: Multiplayer** | Async (leaderboards, hire friends' heroes), then co-op | — |

**M1 status (battle core, first pass — `src/sim/battle.js`, room levels in `world.js`):**

- **Starting a battle:** stepping into any dungeon room other than the entrance starts one.
- **Waves:** they spawn on reachable tiles at least 9 tiles away and follow §3.3.
- **Your hero** strikes whatever is in reach while you steer, and autobattles when you let go.
- **Companions** hold formation and choose their own targets: the fighter protects you, the
  rogue hunts the weakest foe and the mage keeps its distance.
- **Abilities:** each class has one auto-cast ability: Cleave, Backstab and Firebolt.
- **Movement:** units path around obstacles with a flow field over the room.
- **Focus:** tapping an enemy sets a focus target.
- **Compass travel** (`docs/compass-mockup.html`): a compass under the minimap lists places
  that depend on where you are. Picking one makes the party walk there on its own, along
  corridors where it can. A chip above the party cards shows the destination and steps left;
  it cancels the walk, and so does the stick.

  | Where | Destinations |
  |---|---|
  | Dungeon | Next unexplored room, room at your level, nearest unopened chest or shrine, stairs down (greyed until found), exit |
  | Overland | Town, nearest dungeon, nearest unexplored dungeon, landmarks |
  | Town | Square, nearest dungeon (by the road out), road out |

  A walk that runs into a fight stops so the party can fight. Unless that room is the
  destination, the chip's Resume carries on through it.

  **Journeys** (2026-09-30): a walk only stops for a fight or where it was going, never at a
  scene change. The tracked quest's row, *Nearest dungeon* (in town or on the Vale) and the
  stairs down walk on after each scene change: out of town, across the Vale, into the barrows
  or a floor down, and on to the next unexplored room (or the quest's next place). The road
  out, the town and the exit still end where they say. The stick, a tap and ✕ end a journey
  (`sim/core.js`, `test/journey.test.mjs`).
- **Tap to move** (§3.1): tapping the ground walks the hero there along an A* path (the
  route shown as a gold ring and trail). Tapping a chest, shrine, stairs or growth out of
  reach walks up to it and uses it. The stick cancels the walk at once.
- **Leaving and defeat:** enemies are leashed to their room, so walking out ends the fight.
  A total wipe costs 25 % of your gold and sends you back to town.
- **Regen** grows with the pool (base rate × max ÷ level-1 max), so a lull restores the same
  share of HP at every level.

**Balance:** superseded by the difficulty contract in §7.1 (v1.5, 2026-09-30). The old contract
was "a solo L1 fighter holds a level-1 room for 10 minutes": every room could be farmed forever,
alone, at any level. The before and after numbers are in
[difficulty-pass-1.md](./difficulty-pass-1.md).

**Still to come:** loot drops, bosses, stances, ability slots and hazard terrain.

---

## 16. Open questions

> **v1.2 decisions** ([development-plan.md §6](./development-plan.md)):
> - **#2 Defeat cost:** revised in §3.6.
> - **#3 Quest refresh:** in-game dawn, plus an optional real-time daily bonus.
> - **#4 Hardcore:** opt-in, later.
> - **#6 Rename:** at M2.5.

1. **Manual moment?** Keep battles fully auto, or add one "rally" button per room visit (a charged
   party ability) for a small skill expression?
2. **Defeat cost.** Is 25 % of carried gold plus Wounded companions the right sting for a
   grind game where you choose how long to stay?
3. **Quest refresh.** Real-time dawn refresh (encourages daily return) vs play-based refresh
   only?
4. **Hardcore mode** with permadeath, as an opt-in?
5. **Monetization** (if any): cosmetics and expedition slots only. Never sell power or loot.
6. **Rename timing:** switch the build from EMBERHOLD to EMBERFALL now, or at M2?
7. **Room-level pacing.** Is +1 level every two rooms and +3 per floor the right slope, and
   should a floor's rooms hold a fixed range regardless of layout?
