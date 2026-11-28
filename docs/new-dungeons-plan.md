# The new dungeons: the Greenwood and the Heights

*2026-11-28 · **Proposed**, waiting on the owner's go-ahead and the questions in §8. The owner, after "Where should the
forest and ice floors go in game?": "Document the plan for the new dungeons".*

This plan places the three parked prototypes from [dungeon-looks-plan.md](./dungeon-looks-plan.md) (items 10, 12 and
13) in the game, and sets out the dungeons around them, so the whole of 46–75 can be seen at once:

- the **forest** (`greenwood`, [greenwood-dungeon.md](./greenwood-dungeon.md));
- the **pass** (`pass` and `gully`, [pass-dungeon.md](./pass-dungeon.md));
- the **frozen fort** (`frostkeep`, [pass-dungeon.md](./pass-dungeon.md)).

It's shaped like [tidemark-plan.md](./tidemark-plan.md) and [reach-plan.md](./reach-plan.md). Its sources are:

- the catalogue ([dungeon-catalog.md](./dungeon-catalog.md) §4.5, §4.6, §5);
- canon ([emberfall-world.md](./emberfall-world.md) §3.4, §3.5, §3.8, §6, §8, §10.2);
- the Greenwood's and the Heights' acts in [world-map-proposal.md](./world-map-proposal.md) §3.4–3.5;
- the sim as it stands (`sites.js`, `plans.js`, `regions.js`, `camps.js`, `ring.js`).

Anything canon doesn't fix is marked **(proposal)**. Proposals go to the world doc first, once agreed.

## 1. Where the three kits go

| Kit | Built as | Goes to | Floor | Levels |
|---|---|---|---|---|
| `greenwood` | the parked `root_granary`, 56, one floor (prototype) | **the Root Granary**: the walk in along the Tithe Road under the great oaks, to the broken gateway | floor 1; `rootvault` (new) below it | 56–58 |
| `greenwood` (optional, with the water's `pools`) | the same kit | **Hollin Ford Barn**: the ford and the alder carr on the way to the barn (§8, Q3) | floor 1; `granary` (new) below it | 46–48 |
| `pass`, `gully` | the parked `pilgrims_stair`, 62, one floor (prototype) | **the Pilgrims' Stair**, the Heights' first dungeon: the lower Stair, then the upper | both floors | 61–64 |
| `frostkeep` | the parked `praetory`, 70, one floor (prototype) | **the Praetory**: the Empress's guard house, frozen through | floor 1; the parked `glass_keep` (the palace kit, frozen) below it | 69–70 |

These replace two lines of the catalogue:

- The Stair as "ramparts (reused) with snow" (§4.6) gives way to the `pass` kit.
- The Praetory as "the `barracks` kit with ice" gives way to `frostkeep`.

The rest of the catalogue's kit list stands.

## 2. Why the order matters: the climb has a gap

- **What's open:**
  - The Tidemark ends at 45 (Highmarch, Act IV's end).
  - Its end (`ch4_seventh_voice`) opens **the Heights** (`regions.js` `LANDS.heights`).
  - The Heights' overland, Frosthold, four camps (64, 67, 70, 72) and the First Pilgrim (from 61, at 75) are built.
    It has no dungeon.
- **What's missing:**
  - **The Greenwood (46–60) isn't a land in the sim at all.** Nothing exists for it but canon, the wall map's places
    and the parked forest floor.
  - So a company that finishes the Tidemark at 45 has fifteen levels with no dungeon of its band.
  - **A Pilgrims' Stair built now would stand 16 levels above the last band dungeon.** Nobody could play it at its
    level until the Greenwood is in.
- **The earlier answer** said "the Stair first, since the Heights are open". That is right about effort: the Stair is
  the cheapest dungeon here, with its kit built and its land open. It is wrong about the climb.
- **The recommendation (§8, Q1):** build in the climb's order, **the Greenwood first** (its land, then its three bands),
  then the Heights. The forest kit is then used first, not last.
  - If the owner wants the ice in the game soonest, the Stair can go first, as order B in §7.

## 3. The whole map, 46–75

The Greenwood is in three bands of five, as the Tidemark is: two floors, three levels on the first and two on the
second (`perFloor: 3`, plan `step: 3`). The Heights are in three bands of four, as the Reach is: two floors of two
levels (`perFloor: 2`, `step: 2`). The finale follows them.

| Levels | Dungeon | Floor 1 (kit) | Floor 2 (kit) | Boss | Kits still to build |
|---|---|---|---|---|---|
| 46–50 | **Hollin Ford Barn** | Hollin Ford (`greenwood` + pools, Q3), or the barn's yard (`granary`) | the Barn (`granary`) | **the Reeve's Clerk** | `granary` (S) |
| 51–55 | **The Tally-House** | the Counting-House (`counting`) | the Abacus Floor (`counting`, its beads) | **the Tally** | the Tally-House's dressing (S): the look is built (`KIT_LOOK.counting`) |
| 56–60 | **The Root Granary** | the Tithe Road (`greenwood`, built) | the Root Vault (`rootvault`) | **the Green Warden** (floor 1, Q4), **the Tithe-Reeve** (floor 2) | `rootvault` (M) |
| secret, 60 | **The First Barn** | one floor (`granary`, oldest and plainest) | | none: its vault | (with `granary`) |
| region boss | **The Unpaid** | the Root Granary's host as one, repeatable (world doc §10.2) | | | (§6) |
| 61–64 | **The Pilgrims' Stair** | the Lower Stair (`pass`, `gully`, built) | the Upper Stair (`pass`, `gully`) | **the Stair's boss** (proposal, Q5) | none |
| 65–68 | **The Soulcracks** | the Split (`glasscrack`) | the Deep Crack (`glasscrack`) | **the Soulcracks' boss** (proposal) | `glasscrack` (M) |
| 69–72 | **The Praetory**, then **the Glass Keep** | the Guard House (`frostkeep`, built) | the Glass Keep (`palace`, frozen) | **the guard-lamp's fight** (floor 1, proposal, Q6), **the Glass Legate** (floor 2) | `glasskeep` (M) |
| 73–75 | **The Ember Throne** (finale) | its own plan | | **the Kindler** | `runeplate` (L): a plan of its own |
| secret, 75 | **The Hospice Charnel** | one floor (`ossuary` with snow and ice) | | none: its vault | none |
| region boss | **The First Pilgrim** | built (`ring.js`, at the head of the Stair, half past the hour) | | | |

**Not dungeons** (the catalogue's rule):

- The Greenwood's **Charcoal Clearing**, **Antler Stones** and **Thornway** are overland places and spawn points.
- The Heights' **Frozen Hospice** is a waystation, and **the Lip** is the First Pilgrim's ground.

## 4. The dungeons in detail

Every floor is held to the plan rules (`plans.js` `PLAN_RULES`):

- five spaces at most;
- halls 10 wide;
- the boss's hall large.

The room names below are proposals: they're player-facing and go through the owner's voice
([copy-voice.md](./copy-voice.md)) and the world doc first. Names canon already gives are kept.

### 4.1 The Pilgrims' Stair (61–64): the ice, first of the Heights

- **Where:** the Frozen Hospice's north-east gate (`outdoor.js` `HEIGHTS.hospice`). The Stair climbs north to the Lip
  (world doc §3.4).
- **The beat** (canon §6, Act VI): "Up the Pilgrims' Stair after Lucan, with the Redhand turning to hold it behind
  you."
  - The chapters are *The Frozen Hospice* (60–62), on the overland round the Hospice, the Cult's camp and the vessel's
    dray in the yard, and *The Pilgrims' Stair* (62–64) (world-map-proposal §3.5).
  - **Sister Hild**, the Hospice's infirmarian, is at the Stair's foot.
- **Floor 1, the Lower Stair (61–62).** The parked prototype as it stands, made a band floor: its five spaces, its two
  bridges and its dressing (`prayer_posts`, `cairns`, `pines`, `ice_crystals`, `frozen_pool`, `frozen_fall`,
  `wayside_shrine`, `pass_cargo`).

  | Space | Role | Lv | Kit | What changes from the prototype |
  |---|---|---|---|---|
  | the Stair Foot | entrance | 61 | `pass` | none |
  | the First Turn | room | 61 | `pass` | its foes: the Stair's own, not the Redhand |
  | the Wayside Shrine | offshoot | 62 | `pass` | a level up |
  | the Red Gully | room | 61 | `gully` | none |
  | the Cloud Ledge | descent | 62 | `pass` | `end` becomes `descent`; its way on is **up**, cut steps into the rock (Q7) |

- **Floor 2, the Upper Stair (63–64)** (proposal):

  | Space | Role | Lv | Kit | What it is |
  |---|---|---|---|---|
  | the Switchbacks | entrance | 63 | `pass` | the cut stair turning on itself up the rock face, the way down behind |
  | the Bell Ledge | room | 63 | `pass` | the pilgrims' bell on its post; **here the Redhand turn and hold the Stair behind you** (allies, as the League at Brine Cross: Nan Ruddock's crossbows, Brannoc with them if he's in the party) |
  | the Pilgrims' Cache | offshoot | 64 | `gully` | a cleft of brown rock where the pilgrims left their stores; the chest |
  | the Long Bridge | room | 63 | `pass` | across the crevasse on rope and plank (`bridge: 'cloud'`), the fight on the far ledge |
  | the Last Ledge | end | 64 | `pass` | under the Lip, the drop all round; **the boss** |

- **Foes** (canon §3.4: frost revenants, the glass-touched, the Cult's inner circle):

  | Kind | What | Art |
  |---|---|---|
  | frost revenant | melee, undead, the Ashbound in rime | a recolour (frost on the skeletons) |
  | the Cult's inner circle | a ranged priest | a recolour of the furnace-priest |
  | snow-wolf | melee, fast, in packs | the quadruped (the hounds' rig), a new coat |
  | elite | a Cult zealot (proposal) | a recolour |

  - **Families:** `stair` (revenant, wolf · priest · elite zealot) and `upper` (revenant, zealot · priest).
  - The glass-touched wait for the Soulcracks, the Heights' one new silhouette.
- **The boss (proposal, Q5).** Canon gives the Stair no boss.
  - **Who:** the Cult's rearguard on the Last Ledge, an inner-circle priest holding the Stair while Lucan is taken on
    up to the Throne. His name goes to the world doc.
  - **His mechanic, "the cornice":** stretches of the ledge's edge are marked, then give way. Anyone standing on one
    is knocked down, and the snow comes down over the drop.
  - It's the tide's shape (a hazard told first, then struck), which the renderer already draws.
  - **His heirloom line:** to the world doc.
- **Hooks:**
  - a gate before the Last Ledge (20 waves, GDD v1.70);
  - stars with a par measured by `pace.mjs`;
  - its raid opens once the boss falls (`raid.js`);
  - Brannoc's line on the Bell Ledge, if he's in the party.
- **Contract:** the smoke contract at **63** (the right party holds a same-level room 10+ waves, the solo and no-healer
  checks hold); `roomlv.mjs` at 63 and 66.
- **New art:**
  - the revenant, priest and zealot recolours;
  - the snow-wolf's coat;
  - the boss model;
  - the floor-2 pieces: a bell post, and the cut stair as a set piece.
  - No new kit.

### 4.2 The Praetory and the Glass Keep (69–72): the frozen fort

- **Where:**
  - The Praetory stands east of the Lip (`HEIGHTS.praetory`, the camp "The Praetory's watch" at 67).
  - The Glass Keep stands north-east, beyond the rim (`HEIGHTS.glass`, the camp "The Glass Keep's gate" at 70).
- **The beat:**
  - The Praetorians are the Empress's bound guard, still at their posts. They obey only a Voice (world-map-proposal).
  - Their **guard-lamp** hangs in the barracks chapel. **Brother Cobb**, a Praetorian's grandson, has the key, and
    lets the company break it.
  - At the Glass Keep **the Glass Legate** (canon) guards Aurelle's last letter. It is the reveal (canon §6), and it
    ends the Heights' Chronicle set.
- **Floor 1, the Guard House (69–70).** The parked prototype, with one room turned into the chapel:

  | Space | Role | Lv | Kit | What changes |
  |---|---|---|---|---|
  | the Watch Gate | entrance | 69 | `frostkeep` | none |
  | the Guard Hall | room | 69 | `frostkeep` | its foes: the Praetorians, not Highmarch's legion |
  | the Armoury | offshoot | 70 | `frostkeep` | a level up |
  | the Barracks Chapel | room | 69 | `frostkeep` | was the Mess: the guard-lamp on its chain over the altar; the floor's fight (Q6) |
  | the Praetor's Door | descent | 70 | `frostkeep` | `end` becomes `descent`: the inner door, open now, onto the Glass Keep's way |

- **Floor 2, the Glass Keep (71–72)**, on the `palace` kit, frozen (the owner, 2026-11-28: "the glass keep is the right
  place"; [highmarch-floor2-proposal.md](./highmarch-floor2-proposal.md) §3). The palace that was Highmarch's second floor
  is parked as `glass_keep` (plans.js, sites.js: the Heights, a prototype, warm and gilt as it was built). The Heights'
  build freezes it: rime on the gilt, snow drifted in at the windows, the banners stiff, the Soulcracks' glass grown out
  of the stone and over the chequer, a colder light. Its rooms map one to one: the Courtyard the Frozen Court, the Hall of
  Banners the Hall of Plaques, the Study the Empress's Study, the Chapel the Long Gallery of Glass, the Throne Room the
  Legate's Hall. (Was: a new `glasskeep` kit, the crypt's vault and piers in black glass.)

  | Space | Role | Lv | What it is |
  |---|---|---|---|
  | the Frozen Court | entrance | 71 | the court under the glass, snow on the flags, the stair back up |
  | the Hall of Plaques | room | 71 | the empire's honours set in the glass walls |
  | the Empress's Study | offshoot | 72 | her writing table, the Chronicle's last fragments |
  | the Long Gallery of Glass | room | 71 | the glass-touched along its walls, fused where they stood |
  | the Legate's Hall | end | 72 | **the Glass Legate**, before the letter |

- **Foes:**
  - **Praetorians:** Ashbound elites recoloured, the guard's armour rimed.
  - **Frost revenants.**
  - **Ashbound mages** (canon).
  - **The glass-touched**, on floor 2: the new silhouette, built for the Soulcracks.
  - **Families:** `praetory` (praetorian, revenant · mage · elite praetorian) and `glasskeep` (glass-touched,
    praetorian · mage).
- **The bosses:**
  - **Floor 1, the guard-lamp (proposal, Q6).** While the lamp burns, the Praetorians stand up again where they fall.
    - The lamp hangs out of reach until Brother Cobb's key brings it down.
    - Once it's down, it is struck as a boss with a shield of the guard round it.
    - Broken, the guard lie down.
    - It's the Kingstone's and the Tithe-Reeve's shape (break what shields him), on a lamp.
  - **Floor 2, the Glass Legate** (canon, world doc §8: "the Ashbound officer Aurelle left to guard her last letter …
    It still obeys an order nobody alive remembers giving").
    - **Its mechanic (proposal), "the standing order":** at intervals it calls the hall to attention. Every foe
      standing on its marked ground holds its post, rooted, and takes no damage until the call ends.
    - The company spends that time on the Legate itself.
- **Hooks:**
  - a gate before each boss's hall;
  - stars;
  - the raid once the Legate falls;
  - **the Heights' Chronicle set** finishes here, and opens the Hospice Charnel (§4.5).
- **Contract:** **69** and **72**; `boss.mjs praetory 70` and `boss.mjs praetory 72 --floor 2`.
- **New art:**
  - the palace kit frozen and glassed (S: a retint and one dressing family, glass growths; critic rounds against a reference from the owner);
  - the Praetorian recolour;
  - the Glass Legate's model;
  - the guard-lamp as a prop and a boss.

### 4.3 The Root Granary (56–60): the forest, the Greenwood's last band

- **Where:** "under the oldest oak", at the Tithe Road's end (world doc §3.8; world-map-proposal §3.4).
- **The beat:** two chapters, then Act V's end (world-map-proposal, chapters 5–6):
  - ***The Thornway*** (55–57): the Tithe Road through the deep wood, and the wardens who won't let it be used again.
    **The forest floor is the Thornway's last mile.** This is the case for placing the Green Warden here (Q4).
  - ***Paid in Full*** (57–60): the Reeve keeps the granary's great tithe-lamp lit with a shard he took from a Cult
    buyer. Beaten, his light goes out, and the company breaks the lamp. **The Unpaid lie down** in their rows, and the
    clans bury their grandparents.
  - **Grandmother Yew** gives the chapters. **Moth's** great-great-grandmother is in the Granary.
- **Floor 1, the Tithe Road (56–58).** The parked prototype, made a band floor:

  | Space | Role | Lv | Kit | What changes |
  |---|---|---|---|---|
  | the Tithe Road | entrance | 56 | `greenwood` | none |
  | the Great Oaks | room | 56 | `greenwood` | its foes: thorn-wardens and wolves, not the Ashbound |
  | the Falls | offshoot | 57 | `greenwood` | a level up |
  | the Arcade | room | 57 | `greenwood` | none |
  | the Granary Door | descent | 58 | `greenwood` | `end` becomes `descent`: the gateway's steps down into the dark are the way on; **the Green Warden** (Q4) |

- **Floor 2, the Root Vault (59–60)** (proposal), on the `rootvault` kit: the crypt kit's vault and arcade, oak roots
  grown through its walls and floor, root curtains, earth falls (catalogue §5).

  | Space | Role | Lv | What it is |
  |---|---|---|---|
  | Under the Oak | entrance | 59 | the steps come down among the roots; the stair back up |
  | the Sheaf Rows | room | 59 | the Unpaid laid "in rows like sheaves" (canon); the barn-wights rise off them |
  | the Reeve's Desk | offshoot | 60 | his ledger, three hundred years of arrears; the chest |
  | the Root Arcade | room | 59 | the vault's arcade, the roots through every arch |
  | the Lamp Hall | end | 60 | the great tithe-lamp; **the Tithe-Reeve** |

- **Foes** (canon §3.8):

  | Kind | What | Art |
  |---|---|---|
  | thorn-warden | the wood's own | the Greenwood's one new silhouette |
  | wolf, boar | beasts | the quadruped |
  | barn-wight | the stirred tithe | the ghost look the Fallen already have |
  | tallyman | Ashbound clerks in chains | a recolour |

  - **Families:** `thornway` (thorn-warden, wolf, boar · elite thorn-warden) and `rootvault` (barn-wight, tallyman ·
    elite barn-wight).
- **The bosses:**
  - **Floor 1, the Green Warden** (canon name; its mechanic from world-map-proposal): *roots that hold a member in
    place*. Marked ground, then roots: anyone on it is rooted for a few seconds.
    - The sim's root status (the crowd-control statuses, GDD v1.55) already exists.
  - **Floor 2, the Tithe-Reeve** (canon; mechanic from world-map-proposal): *break what shields him*.
    - Each soul he has collected is a shield, and each cage the company opens strips one.
    - The cages stand round the hall's edge.
    - Beaten, his light goes out; the lamp breaks and the Unpaid lie down.
    - That is **Act V's end** (`story.json` `end.greenwood`).
- **Hooks:**
  - a gate before each boss;
  - stars;
  - the raid;
  - the Unpaid as the region boss (§6), unlocked by *Paid in Full*.
- **Contract:** **57** and **60**; `boss.mjs root_granary 58` and `boss.mjs root_granary 60 --floor 2`.
- **New art:**
  - the `rootvault` kit (M);
  - the thorn-warden;
  - wolves and boars on the quadruped;
  - the Green Warden;
  - the Tithe-Reeve;
  - the tithe-lamp as a set piece.

### 4.4 Hollin Ford Barn (46–50) and the Tally-House (51–55)

- **Hollin Ford Barn** (catalogue §4.5; world-map-proposal: its room to remember, ***the Threshing Floor***, "laid
  with sheaves that aren't grain").
  - **Floor 1 (46–48):**
    - **Option A (the catalogue):** the barn's yard and outbuildings on the new `granary` kit.
    - **Option B (Q3):** the ford itself on the `greenwood` kit, with the water's `pools` (Hollin Ford is "a ford where
      the slow river spreads into fen", canon). Its spaces would be the Ford, the Alder Carr, the Reeve's Waymark
      (offshoot), the Cart Track and the Barn Doors (descent).
      - B puts the forest kit in front of the player at 46, not 56.
      - It costs a second dressing of the same kit, with more water.
  - **Floor 2 (49–50), the Barn, on `granary`:**
    - the Threshing Floor (room);
    - the Sheaf Bays (room);
    - the Reeve's Desk (offshoot);
    - the Tithe-Lamp's loft (end: **the Reeve's Clerk**, who marks a target, and the marked member takes more).
  - **Moth**, the Greenwood's found companion (shaman), is found here, freed by the Clerk's fall, as Tamsin and Maren
    were.
  - **Chapters:** *Arrears* (45–48) and *Charcoal and Coin* (48–50). The Charcoal Clearing's beat (Nan Ruddock lifts
    the sacking off a cart) happens on the overland.
  - **Foes:** barn-wights, the Cult's buyers (a cultist recolour), their Redhand carters (built), wolves.
  - **Contract:** **48**.
- **The Tally-House** (catalogue §4.5; its room to remember, ***the Abacus Floor***: "the count kept in stone beads the
  size of fists, still moving").
  - **Floor 1 (51–53), the Counting-House:** the Tally Gate, the Counting Hall, the Ledger Store (offshoot), the
    Scriveners' Room, and the stair down (descent).
  - **Floor 2 (54–55), the Abacus Floor:**
    - its beads as the set piece (new pieces on the `counting` look);
    - the end: **the Tally**, which brings adds, a clerk per bead.
  - **Thane Ivo** "would burn the Tally-House with the tallymen in it".
  - **Chapters:** *The Moot of Antlers* (50–53, at the Antler Stones on the overland) and *The Tally* (53–55).
  - **Foes:** tallymen, the Cult's buyers counted as arrears, barn-wights.
  - **Contract:** **51** and **54**.

### 4.5 The rest of the Heights, briefly

- **The Soulcracks (65–68):** "the canyon the Fall split open. What the Ember burned is down there, as light in the
  rock".
  - **Kit:** the `chasm` theme with the new `glasscrack` (glass shelves and spires, pilgrims fused into it).
  - **Foes:** the glass-touched (the Heights' one new silhouette), frost revenants, Ashbound mages.
  - **Boss:** a proposal, to the world doc.
  - **Prior Anselm** gives the chapter.
  - **Contract:** 66.
  - The `pass` kit's ledges and cloud could stand along its rim on floor 1, so it reads as of a piece with the Stair.
- **The Hospice Charnel (secret, 75):** under the Frozen Hospice's Long Dormitory, on the `ossuary` kit with snow at the
  door and ice on the bones (canon v1.65). The Heights' Chronicle set opens it. It has no boss: its vault.
- **The Ember Throne (73–75):** the finale. Its `runeplate` kit, the Kindler's phases and Lucan's last verse want a plan
  of their own.
- **The Glass Keep's door (Q2):** see §8.

## 5. The Greenwood as a land (before its dungeons)

The Tidemark's step 2 is the model.

- **`LANDS.greenwood`:** Rookstead as its town, opened by Act IV's end. The Heights would then open on Act V's end
  (`ch5_paid_in_full`, proposal; Q1).
- **The overland:**
  - the Tithe Road ruled straight through the oaks;
  - Hollin Ford as the waystation;
  - the Charcoal Clearing, the Antler Stones and the Thornway;
  - the doors of the Barn, the Tally-House and the Root Granary;
  - the First Barn hidden;
  - three or four spawn points (wolves, boars, thorn-wardens, the Cult's carts).
- **Rookstead:** a clan steading inside a ring of standing stones, with no wall: turf-roofed longhouses, the great
  oak, the moot-stone, and *The Antler* for the tavern (canon). It wants a town set (`buildkit.js` style).
- **The crossroads:** a row in `SOLMERE` for the Greenwood's road, the coach, the wall map's area and the land tab.

## 6. The two region bosses

| Region boss | State | What's left |
|---|---|---|
| **The Unpaid** (the Greenwood) | canon only (world doc §10.2: "The Root Granary's host as one. Beaten, not killed: it lies down") | `ring.js` config, at an hour slot not taken (the Kingstone :00, Furnace Nine :30, the Grace :00g, the First Pilgrim :30), from 55 after *Paid in Full*; its tell and model; the heirloom *Paid in Full* |
| **The First Pilgrim** (the Heights) | built (`ring.js`, 75, from 61) | none; his ground is the Stair's head, so the Stair's floor 2 ends just under it |

## 7. Build order

Every step ends playable and checked:

- `npm run check`;
- the browser suite;
- `pace.mjs` on the site;
- `boss.mjs` on each hall;
- `roomlv.mjs` at the contract's levels, before and after;
- captures (`rig.mjs`, one a room, at dusk);
- `visibility.mjs` on the floors;
- `dress-audit.mjs` and `--clear`.

Canon goes to the world doc first, then the GDD, as AGENTS.md has it. Each band comes with its chapters, so the story
can be played as far as it's built.

**Order A (recommended): the climb's order.**

| Step | What | Deliverables | Size |
|---|---|---|---|
| G1 | **Canon + GDD** for Act V | world doc: the bosses' mechanics, the Green Warden's place, the room names, the foes' looks, how the Greenwood opens; the GDD's row; a build sheet fixing every id (as the Reach's and the Tidemark's) | S |
| G2 | **The Greenwood opens** | `LANDS.greenwood`, the overland, Rookstead and its services, Hollin Ford, the coach, the crossroads, the wall map and land tab, the Heights' gate moved to Act V's end; `test/greenwood-open.test.mjs` | L |
| G3 | **Hollin Ford Barn (46–50)** | the `granary` kit (S), the plan (two floors), the families, the Reeve's Clerk, Moth found, *Arrears* and *Charcoal and Coin*; the contract at 48 | M |
| G4 | **The Tally-House (51–55)** | the Tally-House's dressing on `counting`, the Abacus Floor's beads, the Tally, Thane Ivo, *The Moot of Antlers* and *The Tally*; the contract at 51, 54 | M |
| G5 | **The Root Granary (56–60)** | the forest floor un-parked and made a band floor, the `rootvault` kit (M), the Green Warden, the Tithe-Reeve and his cages, *The Thornway* and *Paid in Full*, Act V's end; the contract at 57, 60 | L |
| G6 | **The First Barn**, the Greenwood's Chronicle set, the side work, the spawn points | as the Tidemark's step 7 | M |
| G7 | **The Unpaid** | the region boss (§6) | M |
| G8 | **The Greenwood's art pass** | the models (thorn-warden, wolves, boars, the four bosses, Moth, the clans), the town in 3D, critic passes | L |
| H1 | **Canon + GDD** for Act VI's dungeons | the Stair's, the Soulcracks' and the Praetory's bosses, the foes' looks, the Glass Keep's door (Q2); a build sheet | S |
| H2 | **The Pilgrims' Stair (61–64)** | the prototype un-parked as floor 1, floor 2, the families, the boss and the cornice, the Redhand's held ledge, Sister Hild, *The Frozen Hospice* and *The Pilgrims' Stair*; the contract at 63 | M |
| H3 | **The Soulcracks (65–68)** | the `glasscrack` kit (M), the glass-touched, its boss, Prior Anselm's chapter; the contract at 66 | L |
| H4 | **The Praetory and the Glass Keep (69–72)** | the prototype un-parked as floor 1, the parked `glass_keep` (the palace) frozen as floor 2 (S), the Praetorians, the guard-lamp, Brother Cobb, the Glass Legate, Aurelle's letter, the Chronicle set; the contract at 69, 72 | L |
| H5 | **The Hospice Charnel** | the secret on `ossuary` | S |
| H6 | **The Heights' art pass** | the models, critic passes | M |
| — | **The Ember Throne** | a plan of its own | L |

**Order B: the ice first.** H1–H2, then G1–G8, then H3–H6. The Stair is playable at once by the dev panel's levels
and by nobody else until the Greenwood is in. Its contract at 63 is set before the curve between 45 and 60 is (see
§9).

**Order C: the forest's look first.** G1, then G5's floor 1 only, as the Root Granary's way in, played from the dev
panel. Not recommended: a floor with no land to stand on is what the prototype already is.

## 8. Questions for the owner

1. **Order:** A (the Greenwood first, the climb's order: recommended), or B (the Pilgrims' Stair first, as said
   before, out of reach at its level until the Greenwood is in)?
2. **The Glass Keep's door:** the catalogue makes the Glass Keep the Praetory's second floor. The world-map proposal's
   rumour says "The Glass Keep has no door. (True: you go in through the Soulcracks.)" The overland has a camp at "the
   Glass Keep's gate". Which is it?
   - **Recommended:** the Praetory's floor 2, as the catalogue has it, with the rumour dropped. The Soulcracks would
     otherwise need a third floor, past the rule of two.
3. **Hollin Ford Barn's first floor:** the ford in the forest kit (B), or the barn's yard on `granary` (A, the
   catalogue's)? B shows the forest at 46.
4. **The Green Warden:** the Root Granary's floor-1 boss (the forest floor as the Thornway's last mile), or a boss on
   the overland at the Thornway, which the catalogue keeps as an overland place?
   - **Recommended:** the Root Granary.
5. **The Stair's boss:** canon gives none. Is the proposal right, the Cult's rearguard with "the cornice"? Or is it the
   Redhand's turning, played as a held ledge with no boss, Brine Cross's shape?
6. **The Praetory's floor 1:** the guard-lamp as its fight (with Brother Cobb's key), or no boss on floor 1 and the
   lamp a plain beat?
7. **The way on up:** the Stair climbs, so its "descent" is a stair *up* the rock. Should it be drawn as cut steps up,
   with the floor's name and the map going up rather than down?

## 9. Risks and open items

- **Balance past 45 is uncharted.**
  - The heroes' lift stops gaining its extra at 45 (`party.js` `LIFT_EXTRA_TO`: +30 % at 45).
  - The foes' premium compounds 1.10 a level past 40 (`premium.js`).
  - The contract has only been held to 45. Each band from 48 on is measured before it's built on, and the curve may
    want a step at 45 (as at 30 and 40).
  - The First Pilgrim (75) was tuned before any of this.
- **The quadruped carries every new beast:** the wolves, boars and snow-wolves. Its walk is now a trot
  with measured strides ([art-critic-pass-dogs.md](./art-critic-pass-dogs.md), 2026-11-28), and the new coats go on
  that rig. The trot's paws need `paw±1` / `foot±1` bones for the bake to measure their stride.
- **Two new silhouettes, one a land** (canon §8): the thorn-warden and the glass-touched. Everything else is a recolour
  or the quadruped. Keep to it.
- **Three new M kits** (`rootvault`, `glasskeep`, `glasscrack`) each want a reference from the owner, as the forest's
  and the ice's had.
- **The parked prototypes un-parked:**
  - their `parked` flags and stand-in families (`redhand`, `siege`, `ashbound`) come off;
  - their `end` rooms become `descent`;
  - their bases move: the Stair from 62 to 61, the Praetory from 70 to 69;
  - the tests that pin them (`test/pass.test.mjs`, `test/greenwood.test.mjs`) move with them.
- **The Root Granary's region** is `greenwood` today, a region the sim doesn't know: its stair up comes out on the
  Vale's overland. G2 fixes that.
