# Solmere, the city where companies meet (a proposal)

**Status:** Proposal (2026-11-27), for the owner. Design only: nothing here is built. The mockups are
[solmere-mockups.html](https://claude.ai/) (published by the owner; the file was written outside the repo, see the end
of this doc), drawn on the game's own HUD and two real frames of Tollhaven and Ashgate as they are today.

**The owner, 2026-11-27:** *"Solmere the capital should be designed as a more traditional MMO city location. In this
location companions are hidden and just the main char is visible. Add indicators for what types of companions are with
the main char. This is a central multiplayer area for the game. Create a proposal and mock ups. I do want some fake real
players running around in this version"*

Read with: world doc §3.9 and §12 (canon), GDD §1 pillar 7 ("later, a large city where players gather"), §12, §17, §18;
[world-map-proposal.md](./world-map-proposal.md) §4; [town-streets-proposal.md](./town-streets-proposal.md) (the
Lamphall's grid); [region-towns-proposal.md](./region-towns-proposal.md); [party-up-raids-proposal.md](./party-up-raids-proposal.md);
[shared-play-rules.md](./shared-play-rules.md); [level-design-rules.md](./level-design-rules.md) §1.1 and §2;
architecture §6, §8.8, §9, §10.

Places this doc adds are marked **(proposal)**. Every line a player would read is a **draft** for the Script Desk
(copy-voice.md), not final copy.

---

## 0. In short

1. **Solmere becomes a walkable city**, the game's one shared hub, in place of the crossroads card the imperial roads
   meet at today (`ui/crossroads.js`). It is the Lamphall's square in the dead capital, with **districts round it, each
   one job**: the Lamphall (the Guild, the board, hiring), the Muster Yard (raids), the Exchange, the Bowl's road, Wenna
   Pike's quay to the Mere Tower, the Old Treasury (storage), the Mint Forge (the smith), the Signal Office (letters),
   the Grand Archive (lore), the coach stand to every land. Nothing is more than **about 12 seconds' walk** from the Dry
   Basin in the middle; Wenna's quay, at 15, is the one long walk.
2. **Only heroes are shown in the city.** Your companions stay in your party, in state and in the save, and are drawn
   nowhere between the gates. They're back at your side, in formation, the moment you leave by any road, the coach, a
   Scroll, the Bowl or the punt. **The city has no fights.** Nothing about the save's party changes; the scene gains a
   value, so the save goes to v59 with no migration.
3. **Companion indicators:** a small chip under every hero's name holding **one class sigil per companion** (the game's
   own class icons, the shape carrying the meaning), a double rim for a found companion. The same chip over your own
   hero. Levels and names are in the inspect sheet, not over heads. In the HUD your companions' cards **collapse to two
   44 px chips** beside your card. Four designs were compared (§4); this one reads at a glance in a crowd and costs no
   draws.
4. **Other heroes** get a nameplate (name, level, the chip), an optional earned title, emotes, a **Here** channel in the
   chat dock, and a tap opens an inspect sheet: class, level, company, worn gear by rarity, with **Invite**, **Whisper**,
   **Wave**. Nameplates show for the nearest eight; past 24 tiles a hero is a dot on the minimap.
5. **The fake players are "stand-ins"**, the word the raids already use for AI heroes standing in for players
   (`sim/raid.js`). About **24 in the city**, made as the raid's and the Bowl's AI heroes are made (`rivals.js`
   `makeRival`: class, level, look, gear grade), with their companions as indicator data only. They walk **seeded
   routines** (the board, the smith, the Muster Yard, the Basin's rim, the coach), emote, and now and then say a
   **pre-written line** from `content/standins.json`. They never grant, trade or change anything; their positions are
   runtime, like townsfolk's.
6. **Honesty: tell players.** The recommendation is to label stand-ins where you'd interact with one (the inspect sheet
   and the chat line say *stand-in*) and to say so once on the first visit, but not to stamp every nameplate. Inviting one
   seats it in your raid as a stand-in, exactly as Party Up does today. The owner decides (§10, question 1).
7. **Online,** the city is a Colyseus `CityRoom` per shard of up to 40 heroes: presence, movement, emotes and local chat
   only, server-authoritative. Stand-ins top up a shard to 24 and leave by the coach as real players arrive. Offline, the
   city is the same scene with stand-ins alone.
8. **Built in seven steps** (§8): the city scene (M), hiding companions (S), the indicators and the collapsed party (S),
   stand-ins (M), other heroes' nameplates, inspect and emotes (M), the online room (L), the districts' own systems
   (each its own proposal).

---

## 1. Solmere today

- **Canon** (world doc §3.9, world-map proposal §4): the dead capital on the Mere, built for half a million and lived in
  by twenty thousand. The Lantern Guild keeps it in fact and the Peace Wardens in name. The Lamphall, the Guild's
  mother-house, stands at the foot of the Great Beacon, walled in the empire's pale stone, with a breach nobody has
  mended. The Grand Archive is half burned and half lived in; the Exchange says *Reopening* and has for 260 years; the
  quays stand over mud since the Mere dropped twenty feet; the Bowl is the Quarry Ring west of the city; Wenna Pike
  punts companies out to the Mere Tower. *"The square where every company meets."* From level 15.
- **In the game:** Solmere isn't a place you stand in. Every land's imperial road meets there (`regions.js` `SOLMERE`);
  walking into a road's mouth `to: 'solmere'` shows a card asking which road on (`ui/crossroads.js`), and the `solmere`
  command takes you out on that land's overland. The Bowl is reached from ☰ (from level 6), the Mere Tower from
  Saltmere's jetty, Party Up from ☰ or a tavern's board.
- **Drawn already:** the Lamphall's street plan ([streets-lamphall.jpg](img/towns/streets-lamphall.jpg), the empire's
  grid, the Via Lucerna, the Cardo, four embassy quarters, the breach); the town as "the largest, broken imperial walls"
  (region-towns proposal: 204 × 190 tiles painted, +57 % on Thornwick).
- **What's there to build on:** the town hub (`outdoor.js` `buildTown`: the square, five services with plaques, the
  walls, the gate), townsfolk on routines (`npcs.js`: runtime positions, never saved, their own stream), AI heroes
  (`rivals.js` `makeRival`, `raid.js` `standIns`), other people drawn as heroes (`renderer.js` draws the Kingstone's AI
  companies from `world.allies`), the hero alone in a bout (`renderer.js` `benched`: the companions not drawn while the
  sim keeps them), the chat dock (`ui/chatdock.js`, a Chat channel that says it waits for online play), the coach
  (`coach.js`), auto-walk (`travel.js` rows the compass walks you along).

So the city is mostly a new scene built from parts that exist, and one new sim module (the stand-ins).

---

## 2. The city as a hub

### 2.1 The plan

North up; the camera looks from the south-east (as in every scene: `outdoor.js`), so up the screen is north-west. The
Mere is north, behind the breach; the Great Beacon stands north-west of the square, so from the square it stands
straight up the screen, over everything. Tall at the back, low at the front (level-design-rules §2).

| # | District | Its job | Canon or proposal | From the Dry Basin |
|---|---|---|---|---|
| 1 | **The Lamphall's square** and **the Dry Basin** (proposal) | Gathering. The empire's great fountain, dry since the aqueduct broke: people sit on its rim. The five services face it, as in every town | the square: canon · the Basin: proposal | — |
| 2 | **The Lamphall** | The tavern of the square's five: the Guild's board (city-wide), hiring, rumours, Aldo Pennick and the Roll, Mabry Cole's hammer over the board | canon | 3 s |
| 3 | **The Great Beacon** | The landmark. Its door is the Lamphall's back stair (the Guild's finite tower, world doc §12, later) | canon | — |
| 4 | **The Grey Sisters' Hospice** | The temple: raise the slain, respec | canon | 4 s |
| 5 | **The Guild's chandlery** | The shop | canon (on the Via in the streets plan; moved to the square) | 3 s |
| 6 | **The Palace Rooms** (proposal) | The inn: rest, the party and bench, expeditions. Lodgings in the Solmeres' town palace, *"a tenement with very good ceilings"* | the palace: canon · the inn in it: proposal | 4 s |
| 7 | **The Mint Forge** (proposal) | The smith: upgrade, reforge, salvage. The empire's mint, where they struck the sun on the coin | proposal | 4 s |
| 8 | **The Muster Yard** (proposal) | Party Up's raids in person: groups gather at numbered posts, the lobby a place as well as a screen. The old parade ground, named for the signal corps' one order, *muster at the lamp* | proposal | 7 s |
| 9 | **The Exchange** | Today: the city's notices: the Bowl's slate, the Wall's standings, the raid groups posted. Its sign still says *Reopening*. Trading, if ever, is the owner's call (§10, question 3) | canon | 9 s |
| 10 | **The Old Treasury** (proposal) | Storage: a strongbox shared by your hero slots, if wanted (§10, question 4). Where the treasury counted | the treasury: canon · storage: proposal | 6 s |
| 11 | **The Signal Office** (proposal) | The mailbox: letters (Maudry's to the Guild, a friend's note when online). The Beacon's old signal room | proposal | 6 s |
| 12 | **The Grand Archive** | Lore: the Chronicle's fragments read and re-read (lore.js); later, the Archive's lost wing (side quests) | canon | 9 s |
| 13 | **Aqueduct Street** | Crafting's place, held for when there is crafting (there is none beyond the smith today). Where the aqueduct runs into a street, canon | canon street · crafting: proposal | 9 s |
| 14 | **The coach stand** | The Guild's coach to every land you've reached (coach.js), inside the imperial arch | proposal | 11 s |
| 15 | **The breach and the quay** | Wenna Pike's punt to the Mere Tower, at the quay's end over the mud | canon | 15 s |
| 16 | **The Quarry road** | The west gate, the Ashgate road and the way out to the Bowl (the Quarry Ring), its own scene as now | canon road · the gate's name: proposal | 11 s |
| 17 | **The embassy quarters** | The Charter's, Highmarch's, the League's, the Clans' Close: each opens with its land's renown (world-map proposal §4) | canon | 10–12 s |
| 18 | **The empty quarters** | Roofless shells and rubble behind closed lanes: the gangs' side quests later. Scenery now | canon | — |

The gates: **west** (the Ashgate road, the Quarry Ring), **the imperial arch east** (the Brine Cross road), **north-west**
along the shore (up the frozen Sol to the Heights), **south** (the canal road to Saltmere: shut, *another day*, as
Saltmere's overland already says), **south-west** (the Tithe Road to the Greenwood: shut until the Greenwood is built).
The breach in the north wall goes only to the quay.

### 2.2 Size, against our towns

| | Walls | Scene painted | Walled area | Square to farthest door |
|---|---|---|---|---|
| Thornwick (every town today) | 102 × 100 | 140 × 120 (+90 pad) | 10,200 tiles² | 46 tiles, the gate: ~6 s |
| The Lamphall in the streets plan | — | 204 × 190 | — | — |
| **Solmere (proposed)** | **176 × 160** | **220 × 210** | **28,160 tiles² (2.8×)** | **~95 tiles, the coach and the gates: ~11 s; the quay's end ~15 s** |

Walk times are at the hero's 8.8 tiles a second (`core.js` `PLAYER_SPEED`), the straight line × 1.15 for the streets.
Bigger than this and the city is a chore on a phone; smaller and it can't hold eighteen places and a crowd.

### 2.3 Getting about

- **Walking is the default:** nothing that matters is more than about 12 seconds away.
- **The signpost:** the Basin's signpost (a tap, or the compass's list, as in every scene: `travel.js` rows) lists the
  districts with their walk in seconds; a tap walks you there along the streets (the auto-walk the compass already
  does). Screen 5 in the mockups.
- **The coach:** from the coach stand to any town you've walked to (coach.js), and from any town to Solmere once you've
  walked in once (the first visit is on foot, as for every town). Solmere joins `COACH` as a stop; `ROADS` gains its
  roads (the world-map proposal's: Thornwick 3 days, Ashgate 2, Tollhaven by Brine Cross 2, Frosthold 2).
- **No teleport inside the city.** Walking past people is the point of a hub.

### 2.4 Landmarks that read from the camera

- **The Great Beacon,** dark, ten storeys, north-west of the square: straight up the screen from the Basin, always
  cut off by the top of the phone, the tallest thing in any scene. At night its lamp-room is the one window that never
  lights.
- **The Lamphall** at its foot: pale imperial stone, a portico of columns, Mabry Cole's hammer over the door in the
  plaque.
- **The Dry Basin:** a stepped octagon, the people on its rim the first crowd you see.
- **The colonnade** of broken columns down the Via Lucerna to the arch (presentation only, never in the way).
- **The breach:** the gap in the north wall and the Mere's grey water beyond, the Mere Tower a black stump far out.
- The look is the streets plan's: pale flagstones with weeds in the joints, four-storey tenements of grand stone below
  and patched timber above, roofless shells, braziers in the ruins at night, pigeons.

### 2.5 When it opens

Canon says "from 15", but today the Solmere road from Ashgate is shut until Act III ends (`outdoor.js`: *"Not yet: the
night shift is still down under the Cinderworks"*), so the earliest a hero walks through is about level 30. For a hub
that is late. **Proposed:** the Solmere road opens **as far as the city** when the Reach opens (the end of Act II, about
18); the roads **on** out of the city keep their story gates exactly as the crossroads has them now. Question 2 (§10).

---

## 3. Companions hidden, only the hero shown

### 3.1 The rules

| When | What happens to the companions |
|---|---|
| **Walking in** (any road's gate, the coach arriving, back from a raid or the Bowl to the city) | Not drawn from the gate on. The hero walks in alone. |
| **In the city** | They're in the party: their cards (collapsed, §4.3) open their sheets; wages, the inn's rest, hire, bench, dismiss and retrain work as in any town. A found companion's talk (`talk` from his card) still reaches him. |
| **Hiring at the Lamphall** | The hire joins the party, its chip appears; nobody new walks beside you. |
| **Leaving** (a road, the coach, a Homeward Scroll, Wenna's punt, the Bowl, Party Up setting out) | Placed in formation round the hero at the arrival, as every `travel` places them now. In a raid they wait, as today (they're already hidden). In the Bowl's Team bout they're on the sand; in an Individual bout they're off it, as today. |
| **A fight in the city** | There are none. The city has no spawn points, no camps and no events inside its walls; a `city` row in `modes.js` says so. A later event in the square (a world event, shared-play-rules §4) would show heroes only, as raids do. |
| **Away (offline)** | Left in the city, the party is on retainer at the bench rate, as in any town (GDD §12). |

### 3.2 The sim's side

- **Nothing about the party changes.** `state.party` keeps every member; `MEMBER_KEYS` and the snapshot are as they are.
- **The world says it:** the city's world carries `solo: true`. In `battle.js` `atEase`, a `solo` world holds each
  companion on the hero's tile, still (`moving` false), and skips the formation and the stroll. Anything that reads a
  member's `x`/`y` still finds a number.
- **Commands:** what moves or aims a companion (focus, a companion's stance in a fight) has nothing to act on, so it does
  nothing (there's no fight). Everything a town allows is allowed: `world.services` are the five, by the same plaques.
  The extra places (the Muster Yard, the Exchange, the Treasury, the Signal Office, the Archive) are menus reached as
  services are, each command validated where it lands, as now.
- **The save:** the scene gains a value, `city` (`core.js` `curScene`, saved as `scene`). **SAVE_VERSION 58 → 59 with no
  migration:** no old field changes and an old save loads as it is, but an older build refuses a save made standing in
  the city instead of half-reading it (AGENTS.md rule 4). `state.reached` gains `solmere` as a coach stop: a string in
  the Set it already is.
- **The crossroads:** an exit `to: 'solmere'` now leads into the city at that road's gate; each of the city's gates is
  the exit to its land, validated as the `solmere` command is now (the land open, not the one you came from is no
  longer a rule: you may go back the way you came).

### 3.3 The renderer's side

- `renderer.js` already skips the companions while the hero fights an Individual bout (`benched`). The city widens that
  to `benched = bout.alone || world.solo`, in the figures' pass, the overlay's bars and the shadows' casters.
- **Fewer figures is cheaper:** in the city each hero is one figure, not three (§5.5).
- The indicator chip over the hero is drawn in the overlay (names, bars and numbers are already the overlay's), not in
  the world, so it costs no draws.

---

## 4. Companion indicators

### 4.1 What the indicator must say

At a glance: **how many** companions (zero, one or two: `MAX_COMPANIONS` is 2) and **what kind** (fighter, rogue, mage,
cleric, shaman). On a closer look (the inspect sheet): their levels, their ranks (Wick, Lamp, Lantern, Beacon) and
whether one is a found companion (Brannoc, Wren, Tamsin, Maren). Never by colour alone (AGENTS.md, accessibility): the
class icons in `ui/classicons.js` are filled silhouettes chosen so the shape carries the meaning (the healer's is a
sprig, not a cross), and every one has its label.

### 4.2 Four designs, compared (mockups: screen 4)

| | **A. Sigil chip** (recommended) | B. Marks at the feet | C. Text tag | D. Ghosts |
|---|---|---|---|---|
| What | A dark rounded chip under the name, one 13 px class sigil per companion; a found companion's sigil has a double rim | Two flat sigil discs on the ground behind the hero, where the formation's stations would be | `+2 · FTR CLR` under the name, the classes' three-letter abbreviations (`CLASSES.abbr`) | The companions drawn as faint silhouettes at the stations, 35 % |
| Reads in a crowd | Yes: it rides with the name, every hero's in the same place | Poorly: feet overlap in a crowd, and other heroes stand on them | Yes, but it's text to read, not a shape to see | No: three figures a hero again, which is what the owner asked to remove |
| Not by colour alone | Shape | Shape | Words | Silhouette |
| Size and crowding | 34 × 17 px for two | 2 × 16 px discs, on the ground | ~70 px wide | as figures |
| Cost | Overlay only | Overlay or decals | Overlay only | Figures: ~11 draws and 12,000 triangles each (character-look plan §11) |
| On your own hero | The same chip | Natural (it's where they'd stand) | Fine | Confusing |
| Day and night | Dark chip, light sigils: the same on any ground | Lost on pale flagstones by day | Needs its own shade | Lost at night |

**Recommended: A**, with C's abbreviations used where there's text room (the inspect sheet, the chat's line heads).
A chip with no sigil isn't drawn: a hero alone shows nothing.

### 4.3 Your own

- **Over your hero:** the same chip, under no name (your name isn't over your head, as in every town).
- **In the HUD:** the three party cards collapse. Your card stays as it is, in the middle; the two companions' cards
  become **two chips, each 44 px tall**: portrait, sigil, `FTR 31` and the name, a rank diamond (◆ with its word on the
  sheet). A tap opens that member's sheet, as a card does now. The space saved goes to the city's service bar and the
  chat dock's swipe, which stay where they are. (Mockup: screens 1 and 4.)
- **The alternative** (screen 4): the cards left as they are, a line *In the city · your company is with you* over them.
  It changes less, but the HUD then shows three figures' worth of cards for one figure on screen.

### 4.4 Accessibility

- Text ≥ 11 px (nameplates 11 px, the inspect sheet 12–17 px); the chip's sigils are 13 px, read as shapes.
- Touch targets ≥ 44 px: the chip itself isn't a target; **the hero (figure and nameplate together, at least 44 × 56)
  is.** The HUD chips are 44 px tall; the sheet's buttons 48.
- Contrast: cream on the chip's dark ground (#efe4cf on rgba(14,12,20,.86): 13:1).

---

## 5. Other heroes

### 5.1 The nameplate

- **Name** (the hero's name: Party Up's rule, players see hero names), **level**, and the **sigil chip** under it.
  Serif, 11 px, cream with a dark edge, as the game's names over townsfolk are today (the Ashgate still in the
  mockups shows them).
- **A title, if chosen:** one line under the name, smaller, from things the sim has recorded and the server has
  verified: the Bowl's tier (*the Sun's Box*), the Wall's best landing (*Landing 30*), a region boss's fall (*Furnace
  Nine, down*). Nothing bought (premium is time and room, never power or show: GDD §1 pillar 8).
- **No guild tag:** there are no player guilds. A Bowl company name, if the Bowl ever gives one, could ride there later.
- **Friends** (Party Up stage 2) get a small mark beside the name; your Party Up group's a gold edge on the chip.

### 5.2 Emotes

Wave, Bow, Cheer, Sit, Point, Shrug, from the figures' own clips (`bake.json`; a missing one baked from KayKit's). An
emote plays on the figure, and a one-word chip (*waves*) floats over the name for two seconds, so it reads at a glance
and without sound. Offline it's yours alone; online it's a room message (§7). Emotes are presentation: no command, no
state.

### 5.3 The chat dock: a Here channel

The dock gains **Here**: lines from heroes within the city's shard (online) and the stand-ins' lines (offline and
online), each headed by the name, level and the sigil chip's abbreviations, a stand-in's marked *stand-in* (§6.6). The
Chat channel stays the world's players; nothing else in the dock changes.

### 5.4 Tapping a hero

A tap on a hero opens the **inspect sheet** (screen 3): name, title, class and level; their company (each companion's
class, level and rank, a found one by name); their worn gear by slot, as **rarity words** (Common, Fine, Rare,
Heirloom) with the colour beside the word and the smith's +N; the Bowl's tier and the Wall's landing. Buttons:
**Invite** (to your Party Up group), **Whisper** (online only; a stand-in can't), **Wave**. Nothing about their bag,
gold or traits. Online, the sheet comes from the server's copy of their verified save; a stand-in's from its record.

### 5.5 Crowding and the frame budget

What's measured: Thornwick's square with **17 people** is the game's busiest scene: **429 draws, 725,000 triangles a
frame**, about **11 draws and 12,000 triangles a figure**, and **22 fps on the owner's phone at dusk**; the GPU is the
limit and its cost is spread over the whole picture (performance-options.md). So:

| Distance from you | What's drawn |
|---|---|
| 0–14 tiles | the figure, its shadow, its nameplate (the nearest **8** nameplates only; the rest on a tap) |
| 14–24 tiles | the figure, no shadow (performance option 7), no nameplate |
| past 24 | not drawn; a dot on the minimap |
| a hard cap | **20 other heroes drawn** at once, the nearest first; past that, dots |

With companions hidden, 20 heroes cost what 20 townsfolk do, about Thornwick's square plus a few. The step measures it
before it ships (§9): figperf in the city at 8, 16 and 24 stand-ins, and the Frame test on the owner's phone, held to
**not worse than Thornwick's square**. If it is, the far band goes to sprites (performance option 9), then the cap
comes down.

---

## 6. The stand-ins ("some fake real players running around")

### 6.1 What they are

AI heroes that stand in for players until there are players, as the raid's stand-ins do in Party Up's stage 1 and the
Bowl's companies do in its ladder. One word for one thing (copy-review §8, rule 7): **stand-in** is already what the raid
calls them.

### 6.2 How one is made

- **A roster** in `content/standins.json` (schema'd): 42 names to start (§11), each with a class, a home land (for its
  lines), a level band (15–75, more of them where most players will be: 18–35), a manner of play (an early bird, a
  Bowl regular, a raider, a sitter) and the routine that goes with it.
- **Its hero** is made as `makeRival` makes the Bowl's: class, level, a look (`drawAppearance`), gear at a grade (worn
  pieces at rarities the level would carry: mostly Fine, a Rare or two, an Heirloom on a few), so it looks like a
  player's hero and wears what a player at that level would.
- **Its company** is data for the indicator only: two classes (or one, or none for some), levels near its own, ranks,
  sometimes a found companion. Never built as members: nothing to fight, nothing drawn.
- **Names** never reuse canon (copy-review §8, rule 1): §11's list was checked against every NPC, boss, the hire pool,
  the raid's stand-in names, the Bowl's 400, the creation suggestions and the world doc's names. Most are hero names, a
  few are handles (*saltcod*, *slow_heron*), as players' are. The raid's own `STANDIN_NAMES` (with its canon clashes:
  copy-review §4) is replaced by this one pool, so the raid and the city share it.

### 6.3 How they move

- **Stations:** the Lamphall's board, the Mint Forge's door, the Muster Yard's posts, the Basin's rim (sit), the
  Exchange's notices, the coach stand, the quay's end, the Palace Rooms' steps. A routine is a seeded list of stations
  and how long at each (20 s to 4 min), walked along the streets (`path.js`) at a hero's pace with a little drift.
- **Who's in town** changes with the day's four parts (`npcs.js` `partOf`): some arrive by the coach and some leave by a
  gate, so the crowd turns over and a regular face comes back at its hour.
- **Emotes** on a seeded timer, more of them near another hero (a wave when you walk past, now and then).
- **Lines**: every few minutes one of them says a line in the Here channel and over its head for four seconds, picked
  from the pre-written lines for where it stands and what's on (the Muster Yard: a seat wanted; the Bowl's road: the
  slate; the Kingstone's hour announced: the old stones). **No runtime text of any kind** (AGENTS.md rule 5): the lines
  are in content, reviewed in the Script Desk, and a name is the only thing filled in.
- **Walkers, not walls:** you pass through them, as through townsfolk; they never block a door or a tap on a service
  (they keep apart from the doors and from each other on screen, `npcs.js` `apart`).

### 6.4 Where it runs, and the fair-play line

- **In the sim, as townsfolk are:** `src/sim/standins.js`, pure, with its own stream (a new `STREAM` in `rng.js`), so a
  draw there shifts nothing else. The city's world carries `world.standins`, runtime only, **never in the snapshot**,
  rebuilt from (the roster seed, the slot's clock) when the city is built, as townsfolk are placed for the hour.
- **They never grant anything and never take a command.** No trade, no gift, no item, no gold; they can't join your
  party; their positions decide nothing. A test holds it: a session in the city replays to the **same end hash with the
  stand-ins on and off** (§8).
- **Invite** seats one in your raid as Party Up does with any stand-in (`raid.js` `standIns`, at `RAID.grade`, your
  level): the same strength as the stand-in the Guild would have found you, only with that face and name. Nothing new is
  granted.
- **Whisper** is refused (*stand-ins don't read their letters*, a draft). **Wave** gets a wave back.

### 6.5 How many, and the seed

- **24 in the city at once** (14 of them round the square at a busy hour, 6 at night), within §5.5's cap of 20 drawn.
- **The roster's seed is the game's, not the slot's:** a fixed constant in `standins.js`, so every player meets the same
  Tess Ovington at the board at dawn, as everyone meets the same Bowl companies. Which of them is in town, and where, is
  a pure function of that seed and the slot's clock (`state.t`). Reproducible in a test and in a capture.

### 6.6 Labelled or not: the honesty question

The owner wants *fake real players*: a city that feels full before it is. Whether to tell players some of the crowd is
simulated is a real choice:

| | Unlabelled | **Labelled where you meet them** (recommended) | Labelled everywhere |
|---|---|---|---|
| How | Stand-ins pass as players | Nameplates look like anyone's; the inspect sheet and their chat lines say *stand-in*; a first-visit card says so once | A mark on every stand-in's nameplate |
| The city's feel | Full | Full | Reads as a demo |
| When a player finds out (a whisper never answered, the same Tess at dawn every day) | Feels lied to; for a game that sells trust in its replays (*the client is never trusted*), that cuts the wrong way | Already knew | Already knew |
| App stores, consumer rules | The risk sits with us: presenting bots as people to sell a "live" game draws complaints and reviews | Safe | Safe |
| Online | Stand-ins and real players indistinguishable, so a real player's whisper seems ignored too | A player can always tell who will answer | The same |

**Recommendation: labelled where you meet them.** The crowd looks real at a glance, which is what the owner asked for;
nobody is ever told a stand-in is a person, and a tap or a line tells the truth. The first-visit card (a draft):
*"Solmere's crowd is part stand-ins: heroes the Guild walks round the square until more companies come. Tap anyone to
see who they are."* The owner decides (question 1).

### 6.7 Handing over to real players

When the `CityRoom` exists (§7), each shard **tops up** to 24 with stand-ins only while it has fewer real heroes. As
real heroes arrive, stand-ins finish their station and leave by the coach stand or a gate (never vanish in sight). At 12
real heroes or more in a shard, none are added. A shard's stand-ins come from the room (the server runs `standins.js`
with the room's seed), so everyone in it sees the same ones. Offline, it's stand-ins alone, always.

---

## 7. The multiplayer fit

### 7.1 The room

- **`CityRoom`** (Colyseus, architecture A8 and §6's *town presence*): one per **shard of up to 40 heroes** (the frame
  cap of 20 drawn, with room for the far ones), more opened as they fill, a player kept in their friends' or group's
  shard where possible. Named for the player plainly (*Solmere · 2*), only where it matters (a friend in another
  shard: *Join their square*).
- **Server-authoritative**, as every room: clients send commands (`walk {x, y}`, `emote {id}`, `say {text}`,
  `inspect {hero}`), never positions or results. The room runs the city's `/sim` world (walkability, paths, the
  stand-ins) at the architecture's 20 Hz and sends deltas at 10 Hz, interest-managed to ~40 tiles round each player.
- **What's synced** per hero: id, name, class, level, look (appearance, worn bases and rarities, +N), the company summary
  (classes, levels, ranks, found ids), title, position and heading, the current emote. Not synced: bags, gold, stats,
  traits, the story.
- **Your slot isn't in the room.** Using a service in the city (the smith, the inn, the Lamphall's board) is your own
  slot's command, played and verified as now (§10 of the architecture); the room only knows where you stand. So the
  city adds no new way to cheat progress.
- **Who may enter the shared city:** a verified hero (architecture §10's trust tiers), because the inspect sheet shows
  gear and level others will judge. A guest or a dev game walks the offline city, with stand-ins (question 9).
- **Chat:** the Here channel is the shard's, carried as the Chat channel will be (`net/chat.js`: Supabase Realtime, or
  the room), filtered and reportable before anyone sees a player's words.

### 7.2 The steps from today

1. The city offline: the scene, hidden companions, the indicators, the stand-ins (§8, steps 1–5). Shippable alone.
2. Accounts and the validator (online-setup.md, M6) and Party Up's stage 2 (friends).
3. `CityRoom` and `net/city.js` behind `src/net/` (the web build runs without it): presence, emotes, Here chat, inspect
   from verified cards, shards, the stand-ins' hand-over.
4. Party Up's stage 3 (live raids) mustering from the Muster Yard.

---

## 8. The build, in steps

| Step | What | Sim | UI | Renderer | Save | Tests | Size |
|---|---|---|---|---|---|---|---|
| 1 | **The city scene** | `outdoor.js` `buildCity` (or `city.js`): the walls, the gates as exits per land, the square and its five services on the town's rules, the districts as services, the breach and the quay; scene `city`; `coach.js` `solmere` stop and roads; the crossroads' exits lead in; `modes.js` `city` row (no fights) | the city's service bar (the five, as every town), the districts' menus (stubs where a system waits), the signpost | the kit's pieces for the Lamphall's set (tenements, shells, columns, the Beacon, the Basin): `town.json`, baked (`bake-env.cjs`) | **v59**, no migration | `city.test.mjs`: every door reachable, walk times ≤ 12 s (the quay ≤ 16), the town rules for the square (`town.test.mjs`'s), `visibility.mjs` on the city | **M** |
| 2 | **Companions hidden** | `world.solo`; `atEase` holds them on the hero | — | `benched` widened (figures, bars, shadows) | — | members still in state and the snapshot; back in formation at every way out; hire in the city; save round-trip | **S** |
| 3 | **Indicators and the collapsed party** | — | `party.js` collapsed chips in the city; the chip over your hero | the overlay's chip (classicons.js paths) | — | browser: the chips 44 px, the sheet opens from one | **S** |
| 4 | **Stand-ins** | `standins.js`: the roster, routines, emotes, line picks; its own stream; `world.standins` runtime | `content/standins.json` + schema; their lines in the Here channel | drawn as `world.allies` are, with nameplates | — | determinism (same seed and clock, same crowd); **the end hash the same with stand-ins on and off**; never in a battle, never blocking a door; names against canon (`copylint`'s names rule when it exists) | **M** |
| 5 | **Other heroes: nameplates, inspect, emotes** | — | the inspect sheet, Invite (Party Up seats a stand-in), Wave, the Here channel | LOD bands and the cap; emote clips | — | figperf at 8, 16, 24 stand-ins; the owner's phone Frame test; the browser suite: a tap on a stand-in opens its sheet | **M** |
| 6 | **The online room** | the city's world in `CityRoom` | `net/city.js`, shards, whisper | other players drawn from deltas | — | a shard of 40 on phones, a drop and reconnect, the hand-over | **L** |
| 7 | **The districts' systems** | each its own: the Exchange's notices, the Treasury's strongbox, the Signal Office's letters, crafting | — | — | the strongbox, if built: v60 | each its own | own proposals |

Doc changes with step 1: the GDD (Solmere as a scene, the city's rules), the world doc for the places named here (canon
first, AGENTS.md), architecture (a decision row for the `CityRoom` when step 6 starts), and this doc marked
**Implemented** step by step.

---

## 9. Measuring it

- **The frame:** figperf in the square with 8, 16 and 24 stand-ins; the owner's phone, the Frame test, at dusk; held
  to Thornwick's square (22 fps on the owner's phone, 429 draws, 725,000 triangles).
- **The walk:** each district's door from the Basin, timed by the sim's auto-walk (`city.test.mjs`).
- **The visibility rule:** every door, every stand-in's station and the step before each gate at least half in view
  (`tools/capture/visibility.mjs`, level-design-rules §1.1).
- **The crowd's feel:** a 10-minute capture at each part of the day (rig.mjs, a sheet): how many in view, how many
  moving, lines a minute (target: one every 30–60 s in the square, never two at once).
- **Nothing granted:** the replay test in step 4; the smoke test's replay hash unchanged.

---

## 10. Questions for the owner

1. **Tell players about the stand-ins?** Proposed: yes, where you meet them (the inspect sheet, their chat lines, a
   first-visit card), not on every nameplate. Or unlabelled, or labelled everywhere (§6.6).
2. **When does the city open?** Proposed: the Solmere road open as far as the city when the Reach opens (about 18),
   the roads on as now. Or as canon's "from 15", or as now (after Act III, about 30).
3. **The Exchange:** a notice hall now (proposed: the Bowl's slate, the Wall, the raid groups posted, the sign still
   *Reopening*), or a trade board? Trading goes against "no player trading at first" (GDD §12) and the raid's
   *nothing is split or traded*: a decision of its own.
4. **Storage:** a strongbox at the Old Treasury, shared by your hero slots? A new sim system (moving items between a
   slot's bag and an account's box) and a save field. Proposed: later, its own proposal.
5. **No fights in the city?** Proposed: none. A square event later shows heroes only, as raids do.
6. **The indicator:** A, the sigil chip (proposed), or B, C, D (screen 4). And the HUD: the collapsed chips (proposed)
   or the cards as they are with a line.
7. **Stand-ins' talk:** like players (lowercase, terse, about seats and queues; no levels, no internet shorthand:
   copy-voice's *no modern idiom*), as proposed, or in the world's voice like townsfolk?
8. **How many stand-ins,** and online: top up a shard to 24 and stop at 12 real heroes (proposed), or none once the
   server is up?
9. **Guests in the shared city:** verified heroes only (proposed), guests offline with stand-ins?
10. **The Homeward Scroll:** home to your land's town as now (proposed), or to Solmere once you've reached it?
11. **Found companions on nameplates:** a double-rimmed sigil, the name only on the sheet (proposed; there'll be a lot
    of Brannocs), or the name in the chip?
12. **The names this doc adds:** the Dry Basin, the Palace Rooms, the Mint Forge, the Muster Yard, the Old Treasury,
    the Signal Office, the Quarry road, Aqueduct Street. And the word **stand-in** for the fake players.

---

## 11. For the Script Desk: names and draft lines

**The stand-ins' names** (42; checked against `content/npcs/*.json`, `battle.js` bosses, `party.js` `NAMES`,
`raid.js` `STANDIN_NAMES`, `content/arena.json`'s 400, `content/creation.json` and the world doc: no shared first name
or surname, nothing from another work, no Ember, Ash, Cinder or Kindle):

Sidonie Marchbank · Tess Ovington · Garnet Selby · Ewan Stockdale · Hamon Vosk · Halcy Dunmore · Cedd Wyndham ·
Agathe Rimmer · Thom Ellery · Isaura Tey · Aylwin Saye · Nim Calloway · Brisa Lisk · Oona Grieve · Hubert Fanshaw ·
Avice Stroud · Crispin Orme · Juliana Varley · Edwy Mellor · Elspeth Gale · Fabian Tull · Amice Rendle · Jago Penrose ·
Ermengard Orcutt · Matthias Brede · Philippa Keel · Ottilie Spurr · Barnaby Quint · Prudence Dawe · Ansgar Whitlock ·
saltcod · thistledown · lowtide_ollie · sixpence · candlestub · oatcake · crowfoot · tinpot · slow_heron · gooseberry ·
mossback · hayseed

**Draft lines** (one punchline at most; no levels, XP or dice; in-world words; to be reworked in the Script Desk):

| Where or when | Line |
|---|---|
| the Muster Yard | seat open for a cleric. Toadking's Mound. we go when the third turns up. |
| the Muster Yard | two for the Canal Locks, want a third. any class that stays standing. |
| the Bowl's road | Ma Gorrie's slate has us third from the bottom. moving up, she says. she's being kind. |
| the Bowl's road | the Crier called my name wrong again. I've stopped correcting him. |
| the quay | Wenna goes when Wenna goes. I've been on this quay since dawn. |
| the quay | scratched our mark on the Wall at last. spelt right, this time. |
| the Mint Forge | the queue at the Mint is worse than the Bowl's. |
| the Exchange | the Exchange still says Reopening. I asked. they said soon. |
| the Kingstone's hour announced | the old stones are stirring. anyone walking up to the Fens? |
| the Basin | the Basin was a fountain once. now it's where we sit. |
| the Basin | back from the Abbey. kept my boots, lost my hat. |
| the Archive | which half of the Archive has the maps? the half that didn't burn, I'm told. |
| anywhere, dusk | who feeds these pigeons? they're bigger than the Barrows' rats. |
| a wave returned | (waves) |
| a whisper to a stand-in (the UI's) | Stand-ins don't read their letters. |
| the first-visit card (the UI's) | Solmere's crowd is part stand-ins: heroes the Guild walks round the square until more companies come. Tap anyone to see who they are. |

---

## 12. The mockups

One page, drawn on the game's HUD (`party.js`'s cards, `chatdock.js`'s dock, `townmenu.js`'s service bar, the plaques'
style), at a 390 × 844 phone:

- **The city plan,** top-down in the wall map's hand (`tools/worldmap/streets.mjs`'s paper, ink and IM Fell), the
  districts numbered as §2.1, walk times from the Basin.
- **Screen 1, arriving:** the square, the Beacon over it, the hero alone with its chip, the party collapsed.
- **Screen 2, a crowded square:** eleven stand-ins with nameplates and chips, one waving, one line over a head and in
  the Here channel.
- **Screen 3, a tap:** the inspect sheet with Invite, Whisper (refused for a stand-in) and Wave.
- **Screen 4, the indicator options:** A–D at real size on a day and a night ground, and the HUD's two ways.
- **Screen 5, the signpost:** the districts with their walks, and the coach.
- **The game today:** Tollhaven's square by day and Ashgate's at dusk, rendered in the engine for this doc
  (`tools/capture/rig.mjs`), for the look the drawings follow.

The page is a published artifact (the owner publishes it); its source was written to the session's scratchpad, not the
repo, at the owner's request.
