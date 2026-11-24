# The Tidemark: a plan

**Plan of record (2026-11-24).** The owner's decisions are in [the last section](#decisions-for-the-owner). The owner, after the Heights were opened: *"Lets work on the next
level region"*. The Reach ends at 30. The Pale Heights are open for their region boss, but they have no dungeons yet,
so a company at 31 has nowhere to climb. The next land in the climb is the **Tidemark**: levels **31–45**, Act IV,
*The Seventh Voice* (world doc §3.7, §6).

This plan is shaped like [reach-plan.md](./reach-plan.md), which built the Reach. It covers:
- the dungeons;
- the town and its two waystations;
- the overland and how the land opens;
- the story;
- the foes;
- the spawn points;
- the region boss;
- the build order.

The questions for you are in [the last section](#decisions-for-the-owner). Once they're answered, a build sheet fixes
every id, as the Reach's did, and the build starts.

Unlike the Reach, nothing of the Tidemark exists in the game yet. There's no overland, no town scene and no preview. It
exists as:
- canon;
- the wall map's places (`wallmap.js` `PLACES`: Tollhaven, Highmarch, Brine Cross, Gullwick);
- drawings: [town-streets-proposal.md](./town-streets-proposal.md) (Tollhaven's streets, Brine Cross, Gullwick, the
  overland's sketch);
- the catalogue's proposed dungeons ([dungeon-catalog.md §4.4](./dungeon-catalog.md));
- two parked kits made as trials for it: the **docks** (the Old Eel Wharf) and the **ramparts** (the High Ramparts).

## What the canon already fixes

- **Levels 31–45**, Act IV, the town **Tollhaven**, the waystations **Brine Cross** and **Gullwick** (world doc §3.7).
  - Tollhaven is large and walled in grey stone on its landward sides, with its gate west on the Highmarch road. The
    harbour is on the north-east: the quay, three jetties, two moles and the chain. Its tavern is *The Paid Toll*.
  - Brine Cross is a bridge-town, the only crossing of the Brine on the Highmarch road. Gullwick is the beach road's
    fishing village, and its ferryman's post is the only way out to the Drowned Mole.
- **The story, *The Seventh Voice*.**
  - **Lucan Varro of Highmarch** comes down from the Lady Livia's household. He opened her sealed box and spent four
    years learning the Canticle. He signs himself *Lucanus, the Seventh Voice*.
  - He raises the drowned imperial fleet and marches on the capital to be crowned in it.
  - The League holds at Brine Cross. There, **Old Gannet breaks his own lamp and the drowned lie down**.
  - The company storms Highmarch. Lucan is **beaten, not killed**. He finds the Kindler's letters on his own table and
    walks north to the Heights himself: *"I wanted the empire, not its kitchen fire. It seems they were the same
    room."*
- **The sites:**
  - the Lamp Fort (Old Gannet's coast light);
  - the Gull Isles;
  - the Drowned Mole (the sunken imperial harbour);
  - the Highmarch Road;
  - Brine Cross;
  - the Seventh's Palace;
  - the hidden **Sister's Cabin**, the wreck of *Aurelle's Grace*.
- **The bosses** (world doc §8): **Admiral Hesk**, **the Harbourmaster**, **the Seventh's Champion** and **Lucan**.
  The region boss is **the Grace** (§10.2): the flagship's bound crew, holding station off the Mole *"until recalled"*.
  Its heirloom is *Until Recalled*: *"Nobody did."*
- **The people:**
  - **Hester Quaile**, Speaker of the League and harbourmistress of Tollhaven;
  - **Sister Maren**, a Grey Sister, chaplain on the quays, and the Tidemark's found companion (a cleric);
  - **Old Gannet**, keeper of the Lamp Fort and the Guild's oldest member;
  - **Admiral Grell Hesk** of the Gull Fleet, a corsair with a commission;
  - **Mistress Fane**, the harbour mage;
  - Lucan Varro;
  - the Lady Livia, heard only in letters.
- **The foes:**
  - Highmarch legionaries (a shield wall);
  - Redhand crossbowmen (hired);
  - Gull Fleet corsairs;
  - war-hounds;
  - siege engineers;
  - the drowned sailors under Lucan's orders.
- **The Chronicle set:** Aurelle's letters to Livia, from girlhood to the year before the Fall. The last is *"Take the
  Grace. Take the children. Take the box from my chapel, and never open it."*
- **The rules every dungeon keeps** (`vale-dungeons-plan.md`, `level-design-rules.md`):
  - two floors at most, five spaces a floor;
  - halls 10 wide;
  - the same layout every visit (`plans.js`, `checkPlan`);
  - a gate before every room past the first ring (10 waves);
  - three bands and a secret a land (catalogue §3).

## The dungeons: three bands of five and a secret

The catalogue proposed three bands of five, as the Reach became three of four. Each band dungeon has two floors: the
first holds the band's first three levels, the second its last two, with the boss in the second floor's hall.

| Band | Dungeon | Where | Its two floors (kits) | Foes | Bosses |
|---|---|---|---|---|---|
| **31–35** | **The Drowned Mole** | off the beach, by Gullwick's ferry | the old wharf over the water (**docks**, reused), then the stone moles at low tide, weed on the stone and wrecks on their sides (**new `mole`**) | the drowned sailors, Gull Fleet corsairs picking the wrecks | **the Harbourmaster** (floor 2's hall) |
| **36–40** | **The Gull Isles** | out on the isles off the north shore, past the salt marsh | the sea cave where the fleet hides its boats (the `cellar` cave with the docks' water), then the hulks moored in its lagoon (**new `hulk`**: a ship's inside, its decks and ribs, hammocks, the hold) | corsairs, Redhand crossbowmen on the fleet's pay, war-hounds | **Admiral Hesk** (floor 2's hall) |
| **41–45** | **Highmarch** | at the head of the Highmarch road, north | the walls under siege (**ramparts**, reused), then the Seventh's Palace (**new `palace`**: the crypt kit's stone and arcade, the tavern kit's furniture, banners, a throne room) | legionaries in their shield wall, siege engineers, war-hounds, the drowned | **the Seventh's Champion** (floor 1's hall), **Lucan** (floor 2's) |
| **secret, 45** | **The Sister's Cabin** | the wreck of *Aurelle's Grace* on its reef | one floor: the wreck (`hulk`, with the crypt kit's reliquary pieces) | the Grace's crew below decks | its vault, Livia's cabin, the Tidemark's Chronicle set whole |

**Not dungeons:**
- **Brine Cross** is a set piece on the overland, not a dungeon. The drowned fleet's crews come up the Highmarch road
  against the bridge's east barricade, and the company holds it with the League (decision 6). At the end, Old Gannet
  breaks his lamp and the drowned lie down.
- **The Lamp Fort** is the land's **side vault**: one floor on the ramparts kit, at 38, inside the Isles' band, sent
  to by an errand (*The Keeper's Light*, below). It's a coast fort on its headland with the Gull Fleet at its door, as
  the catalogue suggested.

### Each dungeon in a few lines

- **The Drowned Mole (31–35).**
  - *Floor 1, the wharf:* the ferry stage (entrance), the fish market, the net stage, the customs shed (offshoot), and
    the long jetty (hall). This is the docks kit's real home: the Old Eel Wharf's rooms, as the catalogue said.
  - *Floor 2, the moles at low tide:* the stair down the old sea wall (entrance), the inner mole, the wreck yard (hulls
    on their sides, the drowned climbing out of them), the harbour office (offshoot), and the outer mole's end (hall:
    **the Harbourmaster**).
  - **Sister Maren** is found on the second floor, in the harbour office, holding its door against the drowned with a
    boathook. She's freed when the Harbourmaster falls, as Tamsin is by the Foreman. She's the Tidemark's found
    companion, as Tamsin and Wren were.
  - *The Harbourmaster's mechanic (proposal): the tide.* Every so often the water comes in over the mole's low
    stretches, marked first on the ground. Anyone standing in it is slowed, and the drowned in it are healed.
  - *The beat:* at the floor's end the company sees Lucan out on the outer mole's lamp-stand, singing. The drowned
    fleet's hulls rise out of the harbour, and he goes.
- **The Gull Isles (36–40).**
  - *Floor 1, the sea cave:* the boat landing (entrance), the smugglers' stores, the cave's long gallery, the fleet's
    strongroom (offshoot), and the careening beach (hall).
  - *Floor 2, the hulks:* the gangway (entrance), the gun deck, the hold, the officers' wardroom (offshoot: Hesk's
    commission, the act's thread), and the flagship's great cabin (hall: **Admiral Hesk**).
  - *Hesk's mechanic (proposal): boarding.* He calls a boarding party and grapples fly into the hall: a line of
    corsairs swings in along a lane that's marked first. Cut a grapple's lane short by standing at its end.
- **Highmarch (41–45).**
  - *Floor 1, the walls:* the breach the League's engines made (entrance), the rampart walk (the drop and the mist
    below, as the High Ramparts were built), the gatehouse, the engine tower (offshoot), and the wall's great bastion
    (hall: **the Seventh's Champion**).
  - *Floor 2, the Seventh's Palace:* the courtyard (entrance), the hall of banners, the chapel (where Livia's box
    stood), the study (offshoot: the Kindler's letters on the table), and the throne room (hall: **Lucan**).
  - *The Champion's mechanic (proposal): the shield wall.* His legionaries lock shields in a line in front of him. Blows
    from the front glance off the wall, so the company goes round it, or breaks it with a stun or a knockdown.
  - *Lucan's mechanic (proposal): the Canticle.* He sings, and the hall's fallen stand back up as his. The song is
    told on the ground, a ring growing out from him. Enough damage before it ends breaks his breath and the song. At a
    tenth of his life he stops and sits down on his own steps: beaten, not killed, as the canon has it. That counts as
    his fall, as Morrow Vane's running does.
- **The Sister's Cabin (secret, 45).**
  - One floor: the wreck on its reef, the Grace's crew below decks, and Livia's cabin at the stern.
  - Its door opens when the Tidemark's Chronicle set is whole, as the Ninth Vault's and the Ninth Milestone's do.

The floors are drawn to scale once the list is agreed. They're data in `plans.js`, checked by `checkPlan` and drawn by
`tools/dungeon/vale-plans.mjs`, as the Reach's were.

## Tollhaven, Brine Cross and Gullwick

- **Tollhaven** is the land's one town (GDD v1.132: one town a land). It's the dock city of
  [town-streets-proposal.md](./town-streets-proposal.md):
  - the square on the walled hub every town shares;
  - Quay Street down to the quay, with the Speaker's counting-house at its foot;
  - the merchants' grid;
  - the ropewalk;
  - the three jetties with boats moored along them, and the two moles with the chain between their towers.

  Its five houses:
  - *The Paid Toll* (tavern: hire, the board);
  - an inn;
  - a shop;
  - a shrine;
  - a forge.

  Their names come from the world doc's waystations table and are settled in step 1. The Guild's coach stops here.

  It's the first town with the sea in it. The quay, the jetties and the moored boats are new to a town scene, but the
  docks kit already has the jetty's pieces in Luminati.
- **Brine Cross** and **Gullwick** are **places on the land, not towns**, as Kell's Rest is (world doc v1.57):
  - their houses stand, their people are met, and their names are on the map;
  - there's no square, no service and no coach stop.
  - Brine Cross's street is its bridge, with the tollhouse at mid-span and the east barricade where Act IV's siege
    comes.
  - Gullwick has the Strand, its boats drawn up, its net racks, and the ferryman's post out to the Mole.
  - The world doc's waystations table already names their five houses each. These stay the houses' names, without
    the services.

## The overland

The overland would be built new, at the size the others are (256 tiles a side, as Luminati draws). It follows the
sketch in [town-streets-proposal.md](./town-streets-proposal.md):
- **In from Solmere at the west**, on the imperial road, to **Brine Cross** on the Brine.
- **North up the Highmarch road** to Highmarch's walls, at the land's north-west.
- **East along the coast road** to **Tollhaven**, at the north-east, with its harbour and the salt marsh on the north
  shore.
- **South-east down the beach road** to **Gullwick**. The Drowned Mole lies offshore, past the ferry.
- Along the coast:
  - the **Lamp Fort** on its headland;
  - the **Gull Isles** off the north shore;
  - the **Sister's Cabin's** reef, hidden until the set is whole.
- The **Grace** stands off the Mole at its hour.

Ground: beach sand, wet sand, dune grass, the salt marsh, and grey field-walls and sheep-grazing inland toward
Highmarch. The sea is a new thing on an overland too. The Fens' open water and the docks' sea are the pieces to build it
from.

## Getting there

- **The Tidemark opens at Act III's end** (`regions.js` `LANDS.tidemark`, opened by `ch3_quota`). That's where the
  Heights open today (decision 3).
- **The way in is the imperial road from Solmere to Brine Cross**, the road the wall map already draws (Solmere →
  Brine Cross → Highmarch → Tollhaven). From the Reach it's the Solmere road, which today leads only to the Heights.
  - Solmere is walked through, not stopped in: it isn't a land you play.
  - So a road into Solmere needs a way to say where you're going on to. Decision 2.
- **The Guild's coach** runs Ashgate ⇄ Tollhaven once Tollhaven is reached.
- **On the World map**, the Tidemark's land is built (`CLIMB` `built: true`) and gets:
  - its square on the wall map (`LAND_AREA`, round Highmarch, Brine Cross, Tollhaven and Gullwick);
  - its transform (`EMBERFALL.tidemark`);
  - its fog words;
  - its land tab (`tools/worldmap/minimap.mjs`).

## The story: Act IV, *The Seventh Voice*

Six chapters, as Acts II and III have, each sending the company to a dungeon or a place. They're written in Ink,
with the Journal in the owner's plain voice ([copy-voice.md](./copy-voice.md)). The chapter names are working titles.

| Chapter | Giver | What happens | Where |
|---|---|---|---|
| ch4 *Consigned* (31) | Sister Ilse | Morrow Vane's ledger, the one he left in the furnace hall, has a last page: the vessel was consigned by the Solmere road to Brine Cross, "freight paid at Tollhaven". On to Tollhaven. Hester Quaile tells you the Mole's drowned have been walking up the quays at night, and a Grey Sister has gone out to them. | Brine Cross, Tollhaven |
| ch4 *Low Water* (31–35) | Hester Quaile | Out by Gullwick's ferry to the Drowned Mole. Maren is found on the wharf. The Harbourmaster holds the outer mole, and Lucan sings the fleet up. | the Drowned Mole: Maren found |
| ch4 *Letters of Marque* (36–40) | Hester Quaile | The Gull Fleet is taking League ships under a commission. Hesk's commission in his wardroom is signed *Lucanus*, and it was paid in coal-red wax with a thumbprint in it: the Cult's coin. | the Gull Isles |
| ch4 *The Keeper's Light* (38, the side vault) | Old Gannet | The Gull Fleet is at the Lamp Fort's door. Gannet asks for help keeping the light, as he has for three hundred years, "because nobody told me to stop". He knows what his lamp holds. | the Lamp Fort |
| ch4 *Brine Cross* (40) | Hester Quaile | The drowned fleet's crews march on the bridge, and the League holds it. Old Gannet brings his lamp up the road and breaks it on the barricade. The drowned lie down. | Brine Cross (the set piece) |
| ch4 *The Seventh Voice* (41–45) | Sister Maren | The company storms Highmarch: first the Champion on the walls, then Lucan in his palace. He's beaten, not killed. He finds the Kindler's letters on his own table and walks north. The vessel left with the Kindler days ago. Act IV ends a step behind, as Act III did. | Highmarch |

Gannet's lamp is the one the canon has him break. His coast light was the Guild's beacon for the fleet's signal corps,
and the drowned sailors are bound to it. That's why they'd answer a Voice, and why breaking it lets them lie down. It's
a canon addition for step 1, in how the lamps work (world doc §2.1).

**Side work**, by the content budget (8 named NPCs, about 150 barks, 12 lore fragments):
- Maren's own chain, as Tamsin's and Wren's;
- Mistress Fane's errands (the harbour mage keeps the chain's ward);
- the board's jobs;
- **the Tidemark's Chronicle set of 12**: Aurelle's letters to Livia, found through the land, which open the Sister's
  Cabin.

**Class trials:** the ladder's tiers open at 6, 12 and 24. A fourth rung in the Tidemark (at 36?) is decision 7.

## The foes

| Family | Where | Built from | New art? |
|---|---|---|---|
| **The drowned sailors** | the Mole, Brine Cross, Highmarch's palace | the Abbey's `drowned`, in sailcloth and tar, a boarding axe | recolour |
| **Gull Fleet corsairs** | the Mole's wrecks, the Isles | the KayKit rogue: a cutlass, a sash, a headscarf | recolour |
| **Redhand crossbowmen** | the Isles, Highmarch | as the Vale's `crossbow`, in the fleet's pay | none |
| **Highmarch legionaries** | Highmarch | the KayKit knight in Highmarch's colours, with a **tower shield**: a line of them locks shields and turns blows from the front | **new silhouette 1** |
| **War-hounds** | the Isles, Highmarch, a spawn point | the shared quadruped rig: a mastiff in a spiked collar and barding | **new silhouette 2** |
| **Siege engineers** | Highmarch's walls | the KayKit barbarian in a leather apron, throwing pots of pitch that burn where they land | recolour |

## Spawn points (four, one a band and one more)

- **The wreckers' beach** (31), south of Gullwick: corsairs stripping a wreck the drowned climb out of.
- **The salt marsh** (35), on the north shore: the drowned walking up out of the creeks at the tide line.
- **The kennels** (39), Highmarch's outriders' camp on the road: war-hounds and their handlers.
- **The siege lines** (43), under Highmarch's walls: siege engineers round an engine and legionaries guarding it.

## The region boss: the Grace

This is in the pattern of the Kingstone, Furnace Nine and the First Pilgrim (`ring.js` `RINGS`).
- **When and where:** at **the top of every hour** (decision 4), off the outer mole's end on the overland, from
  level 40, once *Low Water* is done.
- **The fiction:** the Grace's bound crew, holding station *"until recalled"*. Lucan could recall them and won't
  (*"Livia's crew. Let them rest."*). At the hour the tide brings her in, and her crew comes up the mole.
- **The fight:** her master and his crew, on the mole's end.
- **Its mechanics (proposal):**
  - **Broadside:** the ship lying off fires, and lanes of shot cross the mole from the sea side. They're told on the
    ground first, as the Pilgrim's gaze is, and the lane tells are reused.
  - **Boarders:** every so often a boat's worth of her crew climbs onto the mole.
- **The rest, as the others:** up to five companies, a tier by each company's share of the fight, and the heirloom
  *Until Recalled* at Gold.
- **Art:** her master as a model, and the Grace offshore as a ship standing in the water, a set piece like the
  Kingstone's ring.

## What else changes

- **Levels to 45.**
  - The XP table already runs to 75 (v1.148).
  - The smoke contract adds 33, 36, 39, 42 and 45: the right party holds a same-level room, and the solo and
    no-healer checks.
  - Gear, loot and the smith's tables extend to item level 45.
  - The skill ladder's next passive (36, if the ladder goes on in threes) needs checking against `skills.js`.
- **Saves:** a save bump for the Tidemark as a land: its sites, gates, bosses, Tollhaven reached, Maren.
- **The raids** (Party Up): each band dungeon is a raid once its boss is down (v1.149).
- **The pacing walk** (`tools/balance/pace.mjs`) and the raid harness run on the new sites.
- **Art:**
  - the two new silhouettes and the bosses' models;
  - the Tidemark's people as their own models;
  - the new kits in Luminati (`mole`, `hulk`, `palace`);
  - Tollhaven's quay and jetties;
  - the overland's sea;
  - critic passes, as every land has had.

## Build order

Each step ends playable and checked: `npm run check`, the browser suite, and the pacing walk.

1. **Canon first:** the world doc (the cut list, Gannet's lamp, the bosses' mechanics, Brine Cross as a set piece,
   the Lamp Fort as the side vault, the houses' names), then the GDD.
2. **The land opens:** `LANDS.tidemark`, the overland and the way in (decision 2), Tollhaven's town scene and services,
   Brine Cross and Gullwick as places, the coach, the World map, the save bump. It's walkable, with nothing to fight
   yet. **Built (GDD v1.150):** `regions.js` `LANDS.tidemark` and `SOLMERE` (the crossroads: an exit `to: 'solmere'` on
   the Reach's, the Heights' and the Tidemark's overlands, the `crossroads` event and the `solmere` command in
   `core.js`, the card in `ui/crossroads.js`); `outdoor.js` `buildTidemark` (the sea as `sea` pools with sand
   fringes, `G.SAND`), Tollhaven's town with its harbour, the Tidemark's town set (`buildkit.js` style `tidemark`,
   `town.json`, `assets/env/town-tidemark`); `coach.js` Tollhaven, three days from Ashgate; the wall map
   (`wallmap.js` `EMBERFALL.tidemark`, `LAND_AREA`, the coast in `draw.mjs`), the land tab
   (`assets/maps/land-tidemark.jpg`); the Heights after Act IV, `kept` by Frosthold reached. No save bump was needed:
   the shape is unchanged. Tests: `test/tidemark-open.test.mjs`.
3. **The Drowned Mole (31–35):** its floors in `plans.js`, the `mole` kit, the Harbourmaster, Maren found, *Consigned*
   and *Low Water*, and the smoke contract at 33.
4. **The Gull Isles (36–40):** the `hulk` kit, Hesk, *Letters of Marque*, the Lamp Fort and *The Keeper's Light*,
   war-hounds, and the contract at 36 and 39.
5. **Brine Cross:** the set piece, Gannet's lamp, *Brine Cross*.
6. **Highmarch (41–45):** the walls on the ramparts kit, the `palace` kit, the legionaries' shield wall, the
   Champion, Lucan, *The Seventh Voice*, Act IV's end, and the contract at 42 and 45.
7. **The Sister's Cabin**, the Chronicle set, the side work, the spawn points.
8. **The Grace** as the region boss.
9. **Art pass:** the kits and the town in 3D, the models, critic passes, captures.

Steps 3 to 6 each come with their chapters, so the story can be played as far as it's built.

## The build sheet: the Drowned Mole (step 3)

Every id step 3 is built against, so the sim, the story, the models and the looks meet. Canon is world doc §3.7 (v1.69).

**The site** (`sim/sites.js`; its door at the end of Gullwick's ferry jetty, `outdoor.js` `TIDEMARK.ferry`):

| id | name | levels | floors (plan kits) | families | boss |
|---|---|---|---|---|---|
| `drowned_mole` | The Drowned Mole | 31–35 (`span` 5, plan `step` 3) | 2: the Wharf (`docks`), the Moles at Low Water (`mole`, new) | `wharf`, `mole` | floor 2 `harbourmaster` |

A band of five puts three levels on its first floor (31–33) and two on its second (34–35). `checkPlan` allows a
non-last floor `step − 1` levels above its first (one, as before, for a band of three or four).

**Foe kinds** (`battle.js` ENEMIES; art: `renderer.js` ENEMY_ACTOR → the actor in brackets):
- `sailor`: melee, undead. A drowned sailor of the imperial fleet, in sailcloth and tar, a boarding axe. A minion's
  strength. The Abbey's `drowned` in a sailor's rig: `enemy_sailor`.
- `corsair`: melee. A Gull Fleet corsair, a cutlass, a sash and a headscarf. A cutthroat's strength. The KayKit rogue
  recoloured: `enemy_corsair`.
- `bosun`: melee, undead, the elite. The fleet's bosun, drowned, with his chain. A warrior's strength. `enemy_bosun`.
- `gunner`: ranged, the Gull Fleet's. A pistol-crossbow. A crossbowman's strength. `enemy_gunner`.
- Kept: the `drowned`, the `cantor` (a drowned chaplain's soul-bolt).

**Families:** `wharf` (corsair, sailor · gunner, cantor · elite bosun: the corsairs picking the wreck, the drowned
rising), `mole` (sailor, drowned · cantor, gunner · elite bosun).

**The boss** (`battle.js` BOSSES; art `boss_harbourmaster`): `harbourmaster`, the Harbourmaster (mech `tide`). The
imperial harbour's master, drowned at his post with his berths' book under his arm. Every so often the tide comes in
over the mole: the hall's edge floods (the hazards' flooded edge, told first), the company standing in it slowed, and
the drowned standing in it mending. It goes out again. Heirloom `the_berths_book`: *"Every ship that came in. None that
left."*

**People** (`content/npcs`; art `npc_<id>`):
- `hester_quaile`: Tollhaven's square, by the tavern. She gives *Low Water*.
- `sister_maren`: found in the Mole's harbour office (`npcs.js` `found`: the site, floor 2, freed by the Harbourmaster).
  `heroes.js` `maren`, a cleric, as Tamsin is found.

**Story** (`quests.js`, `content/quests`, Ink):
- `ch4_consigned`: Sister Ilse, from Act III's end. She reads Morrow Vane's ledger, and the company meets Hester Quaile
  in Tollhaven. Levels 30–31.
- `ch4_low_water`: Hester. The Harbourmaster, and Maren found. Levels 31–35.
- Maren's own chain, `maren_*`: later.

**Balance:** the smoke contract at 33. The right party holds a same-level room 10+ waves at 33, and the solo and
no-healer checks hold too. `roomlv.mjs` at 33 and 36.

## Decisions for the owner

**Taken (2026-11-24),** the owner: *"Three bands of 5. … The Brine Cross is fine. No Class trial at 36. Otherwise go
with your recommendations"*.
1. Three bands of five.
2. The Solmere crossroads card.
3. The Heights open after Act IV. Saves that have walked into them keep them.
4. The Grace at the top of the hour, from 40.
5. The legionary and the war-hound new, everything else recoloured; the Tidemark's people as their own models.
6. Brine Cross as a held position.
7. No class trial in the Tidemark.
8. Steps 1 to 3 first, then shown.

**Asked by the owner:** what the secret dungeon and the side vault give beyond the story.
- **The secret** (as built): opened by the land's twelve Chronicle fragments, each paying XP. Its vault gives a
  guaranteed heirloom once. It then seals for two hours of play (`SECRET_REST`) and opens again with an ordinary find.
  It has stars like any dungeon.
- **A side vault** gives nothing extra today: it's an errand's step, paid by the errand.
- **Proposed** (open, wanted by step 4): a side vault's end room gives a guaranteed keepsake once, from its errand's
  giver (the Lamp Fort's from Old Gannet). It then seals for two hours, as a secret does, and opens again with one
  chest at its band's level. It would apply to the Haddow Crypt and the Shuttered Inn too.

The questions as they were put:


1. **Three bands of five** (the Mole 31–35, the Isles 36–40, Highmarch 41–45), with two floors each, the secret at 45
   and the Lamp Fort as the side vault at 38? The other cut is five bands of three, which needs two more dungeons than
   the canon names. I recommend **three of five**: it matches the catalogue and the Reach's shape, and every site is
   already canon.
2. **The way in through Solmere.** Solmere isn't a land you play, but every land's road meets there: the Reach's,
   the Fens' road north, the Tidemark's, the Greenwood's later, and the Heights'.
   - **(a) A crossroads:** walking into Solmere on any road shows a card, *On through Solmere*, listing the open lands'
     roads. Pick one and arrive at that land's Solmere road. It works for every land to come.
   - **(b) A fixed chain:** the Reach's Solmere road goes to the Tidemark, and the Heights are reached from the
     Tidemark's north (the way Lucan walks).

   I recommend **(a)**: one small card, and it never needs re-pointing as lands are added.
3. **When the Heights open.** Today they open after Act III, which skips Acts IV and V (the Heights are Act VI, 61–75).
   I recommend they **open after Act IV** for now, and after Act V once the Greenwood is built. Saves that have
   already walked into the Heights keep them. The Developer panel's *Open every land* still opens everything for
   testing.
4. **The Grace's hour.** The Kingstone has the top of the hour (Fens), and Furnace Nine and the First Pilgrim have
   half past (the Reach and the Heights). I recommend **the top of the hour**, from level 40, so the climb alternates.
   A player is only ever in one land, so two lands sharing an hour don't clash.
5. **Art: the two new silhouettes**, the Highmarch legionary with his tower shield and the war-hound, with everything
   else recoloured? And the Tidemark's people (Hester, Maren, Gannet, Hesk, Fane, Lucan) as their own models, as
   Ashgate's were?
6. **Brine Cross as a held position on the overland.** The chapter's fight would be waves at the bridge's barricade,
   the League's people fighting beside you, ending when Gannet breaks his lamp. It would be built from the spawn-point
   camps and the gate rooms' wave count. Or keep it a story beat told in dialogue, with no fight? I recommend **the
   held position**: it's the act's set piece.
7. **A class trial rung in the Tidemark** (at 36), or not?
8. **Where to start.** I recommend **steps 1 to 3 first**: the land, Tollhaven and the Drowned Mole, dressed and
   critiqued, so you can play into level 35. Then I show you before going on.
