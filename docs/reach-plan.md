# The Cinder Reach: a plan

**Plan of record (2026-11-16).** The owner, on what's next: *"do 2 then start the Reach plan"*; then, on this plan:
*"Act 3, go with your recommendation. Furnace Nine at 30 after on the hour, Morrow Vane escapes. Be sure to dress the
overworld and dungeons to the theme, run critic passes in the area and new NPC models."* The decisions as taken are in
[the last section](#decisions-for-the-owner); canon in world doc v1.53. Building in the order below, steps 1 to 3 first.

The Fens end at level 18, and a company at 20 has nowhere to go. The Reach is levels **19–30** and Act III, *Quota*
(world doc §3.3, §6). Its overland and Ashgate's town scene exist as previews (`reach-heights-overlands.md`): the roads,
the sites as landmarks without doors, and the town's walled hub. This plan makes it a land you play, the way the Fens
were made: the dungeons, the town and waystation, the foes, the bosses, the story, the spawn points and the region boss.

## What the canon already fixes

- **Levels 19–30**, Act III, the town **Ashgate**, the waystation **Kell's Rest** (world doc §3.3).
- **The story, *Quota*.** The Kell Assay has bought the Slagborn's lease and relit the Cinderworks. Its factor,
  **Morrow Vane**, sells the night shift to the Cult's furnace-priests, who feed them to **Furnace Nine**, a furnace-lamp
  hot enough to melt pale iron. They're casting **the vessel**. The company breaks Furnace Nine and frees the night
  shift, but the vessel leaves on the Solmere road a day ahead. Act III ends in a loss.
- **The sites:** the Cold Seam, the Slag Tunnels, the Assay Yards (Kell's Rest), the Cinderworks, the Forgehall of
  Oruth, the Magma Vault, and the hidden Ninth Vault. **One dungeon a band of three levels, none overlapping, and one
  secret** (v1.32): the list is to be cut to fit. A dungeon may widen to four levels if a land wants fewer.
- **The bosses** (world doc §8): **the Foreman**, **Oruth the Forgemaster** and **Morrow Vane**. The region boss is
  **Furnace Nine** (§10.2): *"It learned to feed itself"*; heirloom *Quota — "It always asked for more."*
- **The people:** Charter-Reeve **Dagny Coalbrook**; **Tamsin Coalbrook**, her niece, a mage-smith and the Reach's
  found companion; **Gunnar Slagg**, the Slagborn headman who sold the lease; **Hob**, a fixer; **Old Brannagh**,
  Ashgate's shrine-keeper; **Mother Coke**, the Slagborn's wise-woman; Oruth; Morrow Vane.
- **The foes:** Ashbound warriors and the new-made, forge-wights, Cult furnace-priests, cinder hounds, Assay guards,
  Slagborn renegades, slag haulers, and Nan Ruddock's Redhand on the yards' gates. At most two new silhouettes a region.
- **The rules every dungeon keeps** (`vale-dungeons-plan.md`, `level-design-rules.md`): two floors at most, five spaces a
  floor (an entrance, rooms, an offshoot, the hall), halls 10 wide, the same layout every visit (`plans.js`), a gate
  before every room past the first ring (10 waves, v1.118), a boss's room fighting on while he's away (v1.117).

## The dungeons: four bands and a secret

Twelve levels make four bands of three. The canon has three bosses for them, so one band needs a boss of its own
(decision 1). This is the cut I propose, in the order the story walks them, each on its own road out of Ashgate:

| Band | Dungeon | Where | Its two floors | Foes | The hall's boss |
|---|---|---|---|---|---|
| **19–21** | **The Cold Seam** | south, off the Wickham road: the first thing you pass | a played-out Deepdelver pithead (galleries, props, the winding room), then the goblins' new warren beyond it | Hill goblins (the Scrag Warren's, who dug through the range), slag haulers | **the Foreman** |
| **22–24** | **The Assay Yards** | west, at Kell's Rest under the dead volcano | the yards and the counting house (a keep's look), then the ore cellars and the quota office | Assay guards, Nan Ruddock's Redhand on the gates, slag haulers | **the Weighmaster** (new: decision 1) |
| **25–27** | **The Forgehall of Oruth** | east, on the Ashwater below the Solmere road | the imperial forge-hall, cold for three centuries and lit again; then the deep forges | forge-wights, the Ashbound and the new-made, Slagborn renegades | **Oruth the Forgemaster** |
| **28–30** | **The Cinderworks** | north, up the track among the slag heaps | the furnace hall and the night shift's pens; then **the Magma Vault** below it, where Furnace Nine stands | Cult furnace-priests, cinder hounds, the Ashbound | **Morrow Vane** on the first floor's hall; **Furnace Nine**'s lamp breaks on the second (as the Standard's does) |
| **secret, 30** | **The Ninth Vault** | the old track up the volcano's flank: the quota office's strongroom | one floor, a strongroom | the Ashbound clerks who kept the books | its vault, the Reach's Chronicle set whole |

**Cut:** the **Slag Tunnels** become a spawn point (the cinder hounds' den, below). The **Magma Vault** is the
Cinderworks' second floor, as the canon already has it ("Furnace Nine and the Magma Vault under it").

### Each dungeon in a few lines

- **The Cold Seam (19–21).** *Floor 1, the old pithead:* the shaft head (entrance), the lamp room, the long gallery
  (props, rails, a collapsed stretch you go round), the pay office (offshoot: the Seam's last wages in a strongbox,
  never paid), and the winding room (hall: the Foreman, the winding-wheel overhead). *Floor 2, the goblins' warren:* the
  breakthrough (entrance, raw rock against cut stone), two burrow halls, a goblin larder (offshoot), the tally cave
  (hall). **Tamsin Coalbrook** is found here, held by the goblins for the forge-work she can do (Act III's found
  companion, as Brannoc and Wren were). *The Foreman's mechanic (proposal):* he whistles a shift change, and every 20
  seconds a slag hauler comes down the shaft with a load that lands where it's marked on the floor.
- **The Assay Yards (22–24).** *Floor 1:* the yard gate (entrance; the Redhand on it), the weigh-house, the ore sheds,
  the guard room (offshoot), the counting house (hall). *Floor 2:* the cellars, the cage store (the night shift's
  chains on the walls), the assay furnace, the ledger room (offshoot: the rolls of the night shift, the company's
  proof), the quota office (hall). *The Weighmaster's mechanic (proposal):* the scales. He weighs the company: the
  member with the most health left takes the heaviest blow, so the company is rewarded for spreading the damage.
- **The Forgehall of Oruth (25–27).** *Floor 1:* the great doors, the anvil hall, the quench pools (a hazard floor:
  steam), the pattern store (offshoot), the bellows hall (hall). *Floor 2:* the deep forges, the bound smiths' benches,
  the ore lift, the masterwork vault (offshoot), Oruth's forge (hall). *Oruth's mechanic (proposal):* he works. Every
  so often he turns to his anvil and forges a weapon for one of his forge-wights, which comes back from it stronger; a
  blow that staggers him while he's at the anvil spoils the piece. Oruth is the clans' own ancestor: beaten, he lies
  down and goes back to sleep rather than dying (his fall is the Slagborn's to mourn, Mother Coke's quest).
- **The Cinderworks (28–30).** *Floor 1:* the works gate, the ore floor, the night shift's pens (where they're held),
  the priests' vestry (offshoot), the furnace hall (hall: **Morrow Vane**, who fights with the Assay's men and runs
  when he's down to a quarter, as the canon has him escape to sell another day: decision 4). *Floor 2, the Magma
  Vault:* the stair down into the heat, the slag channels (lava lanes as a hazard), the casting floor (the vessel's
  empty mould: it's already gone), the priests' cells (offshoot), **Furnace Nine** (hall: its keeper falls and the
  lamp breaks, the night shift's souls go free, the count).
- **The Ninth Vault (secret, 30).** One floor: the strongroom where the quota office kept its books, its door opened by
  the Reach's Chronicle set whole, as the Ninth Milestone's and the Reedholm Undercroft's are.

The floors themselves, drawn to scale like the Vale's and the Fens', come once you've agreed the list: they're data in
`plans.js` that `checkPlan` holds to the rules, drawn by `tools/dungeon/vale-plans.mjs`.

## Ashgate and Kell's Rest

- **Ashgate** (the town scene exists as the walled hub every town shares): the services named in canon, *The Slag &
  Bellows* (tavern: hire, the board), *Deepdelver's Rest* (inn), *The Ashgate Forge* (the smith: the Reach's is the
  Deepdelvers', the best upgrades in the game so far), the *Shrine of the Last Flame* (temple: Old Brannagh). The
  pithead wheel over its gate wants its own art (the previews list it as missing).
- **Kell's Rest**, the waystation at the Assay Yards: a square built as Saltmere's is, its services the Assay's (an
  inn and a store, the Assay's prices; a shrine). The plan is already in `town-streets-proposal.md`.
  **No town (GDD v1.132, world doc v1.57; the owner, 2026-11-18: "Shouldnt kells rest just be a regular overworld
  area?"): one town a land.** Kell's Rest is the depot on the Reach's overland again: its houses, its standards and its
  well by the Kell road, its name on the land, no way in, no services, no coach stop; Nan Ruddock and Davy Pruett at the
  Yards' gate; a save from its square loads by the depot (save v55). What follows is how it was built for a day (v1.130).
  *(Superseded:)* **Built (GDD v1.130, world doc v1.55; the owner: "Kell's Rest as a real second town"):** no longer a landmark only. The
  Kell road's end on the overland walks you in (`src/sim/outdoor.js` `buildKellsRest`; the exit's `town: 'kells_rest'`),
  Depot Street lets you out at the overland's `kells_rest` arrival. Its square is Ashgate's to the tile, in the Reach's
  own houses: *The Short Weight*, *The Company Store* (its own shelves), *The Bunkhouse*, the Ash Shrine, *The Depot
  Forge*. The Guild's coach stops there, a day from Ashgate (`sim/coach.js`); the town you're in is saved (save v54,
  `town`). Nan Ruddock and Davy Pruett stand in its square.

## Getting there

- **The Reach opens at Act II's end** (`regions.js` `LANDS.reach`, opened by `ch2_the_last_office`): Ilse reads the
  Abbey's ledger, the buyer's mark is the Kell Assay's, and the road goes south. A save past Act II has it open at once.
- **The way in is the Wickham road**, out of the Vale's south (canon: "the Wickham road, up from the Vale in the
  south"). The Reach's shut roads say their lines until then; the Solmere road stays shut (Solmere is from ☰).
- The Guild's coach runs Thornwick ⇄ Ashgate once Ashgate is reached, as Saltmere's does.

## The story: Act III, *Quota*

Six chapters, as Act II has, each sending the company to a dungeon or a place, written in Ink as the others are:

| Chapter | Giver | What happens | Where |
|---|---|---|---|
| ch3 *The Wickham Road* | Ilse (Thornwick) | the Assay's mark; south to Ashgate; Dagny Coalbrook and the miners who don't come home | the road, Ashgate |
| ch3 *Short Shift* | Dagny | the Cold Seam's goblins have the old workings; her niece went in after the Seam's records and didn't come out | the Cold Seam (19–21): Tamsin found |
| ch3 *Paid by Weight* | Hob | a fixer sells you the way into the Assay's yards; the night shift's rolls are in the quota office | the Assay Yards (22–24) |
| ch3 *Gone Back to Work* | Mother Coke | the clans' ancestor is awake in the Forgehall, forging for whoever lit it; put him back to sleep | the Forgehall of Oruth (25–27) |
| ch3 *Night Shift* | Dagny | the rolls name the Cinderworks; free the pens | the Cinderworks, floor 1 (28–29): Morrow Vane |
| ch3 *Quota* | Tamsin | down into the Magma Vault; break Furnace Nine; the vessel's mould is empty. Act III ends | the Magma Vault (30) |

Side quests (the content budget's 8 named NPCs, +150 barks, +12 lore fragments): Gunnar Slagg's shame (he sold the
lease), Hob's errands, Old Brannagh's shrine, Tamsin's own chain (as Brannoc's and Wren's), the board's jobs, and the
Reach's Chronicle set of 12 (the quota office's ledgers, leading to the Ninth Vault). The class trials' next rung, if
there's one at 24 (decision 6).

## The foes

| Family | Where | Built from | New art? |
|---|---|---|---|
| **Cinder hounds** | the Cinderworks, the Slag Tunnels' den | the shared quadruped (the rats', creatures.js), bigger, ember-cracked | **new silhouette 1** |
| **Forge-wights** | the Forgehall | the Ashbound skeletons in forge leathers, a hammer, the eyes and the cracks in them lit | **new silhouette 2** (or a recolour, decision 5) |
| **Slag haulers** | the Cold Seam, the Yards | the KayKit barbarian, big, a hod of slag on the back | recolour |
| **Assay guards** | the Yards, the Cinderworks | the KayKit knight and crossbowman, the Assay's grey and brass | recolour |
| **Slagborn renegades** | the Forgehall | the KayKit barbarian, short (the clans are dwarf-folk), braids, soot | recolour |
| **Cult furnace-priests** | the Cinderworks | the acolyte (the Cult's), leather apron, a lit censer | recolour |
| **Hill goblins** | the Cold Seam | as the Vale's (creatures.js) | none |
| **The Redhand** | the Yards' gates | as the Vale's | none |
| **The Ashbound** | the Forgehall, the Cinderworks | as everywhere | none |

## Spawn points (3–4, as every land has)

- **The Slag Tunnels' den** (south-west): cinder hounds, a nest that refills (as the rat nest does).
- **The renegades' camp** (the black slag hills, west): Slagborn renegades round a fire.
- **The haulers' road** (the Cinderworks' track): slag haulers and Assay guards on a cart.
- **The Assay's wagon** (the Kell road): Redhand guarding an ore wagon.

## The region boss: Furnace Nine

**Built (GDD v1.126):** at half past every hour, at the Vault's mouth (camps.js `reach_mouth`, the furnace yard west of the ruin), from level 25 once broken; it feeds on the fallen (2 % a fallen member who isn't raised); heirloom *Quota*; 2–5 companies win in 5.0–6.4 min (tools/balance/regionboss.mjs --boss furnace_nine).

As the Kingstone is the Fens': once the story has broken Furnace Nine, it **relights on its own** (*"It learned to
feed itself"*). The first 15 minutes of every hour it burns in the Magma Vault's hall, and companies from level 25
can go down and break it again. Its mechanic (the development plan's region-boss table): it vents lava where it's marked, and it **feeds on
the fallen**: a member who goes down near it and isn't raised in time makes it stronger. Up to five companies, a tier
by the share of the fight, the heirloom *Quota*. Whether it runs on the hour like the Kingstone or is simply always
there to fight is decision 3.

## What else changes

- **Levels to 30:** the XP table already runs to 60. The smoke contract adds 18, 21, 24, 27 and 30 (the right party
  holds a same-level room; the solo and no-healer checks). Gear, loot and the smith's tables extend to item level 30.
  The skill ladder's passives at 27 already exist.
- **Saves:** a save bump for the Reach as a land (its sites, gates, bosses away, Kell's Rest reached).
- **The World map:** the Reach's land tab drawn by `tools/worldmap/minimap.mjs`, as the Fens' is.
- **Art:** the two new silhouettes; the Reach's kit in Luminati (slag-brick, the Cinderworks' stacks, the Forgehall's
  doors) as the Fens' buildings pass did; the dungeons' looks from `lava`, `ember`, `chasm` and `dread`; the pithead
  wheel; the ore rails.
- **The raids** (Party Up): each new band dungeon is a raid too, as every band dungeon is.

## Build order

Each step ends playable and checked (`npm run check`, the browser suite, the pacing walk `tools/balance/pace.mjs`):

1. **Canon first:** the world doc (the cut list, the Weighmaster, the Foreman as a person, the mechanics, Furnace
   Nine relighting), then the GDD.
2. **The land opens:** `LANDS.reach`, the Wickham road from the Vale, Ashgate's services, the coach, the save bump.
   Walkable, nothing to fight yet.
3. **The Cold Seam (19–21)**, its floors in `plans.js`, the Foreman, Tamsin found; the smoke contract at 18 and 21.
4. **The Assay Yards (22–24)** and Kell's Rest's square.
5. **The Forgehall of Oruth (25–27)**: the forge-wights.
6. **The Cinderworks and the Magma Vault (28–30)**: the cinder hounds, Vane, Furnace Nine's lamp; Act III's end.
7. **The Ninth Vault**, the Chronicle set, the side quests, the spawn points.
8. **Furnace Nine as the region boss.**
9. **Art pass**: the Reach's kit in 3D, the critic passes, captures.

Steps 3 to 6 each come with their act chapters, so the story can be played as far as it's built.

## The build sheet (2026-11-16, the owner: "Ok do all of this. Yes a class trial at 24 in the reach")

Every id the rest of Act III is built against, fixed before the work is split, so the sim, the story, the models and the
looks meet. Canon for the names is world doc §3.3 (v1.53, and v1.54 for what this adds).

**Sites** (sim/sites.js; doors on the Reach's overland, outdoor.js `REACH`):

| id | name | levels | floors (plan kits) | families | bosses |
|---|---|---|---|---|---|
| `assay_yards` | The Assay Yards | 22–24 | 2 (`yards`, `quota`) | `yards`, `quota` | floor 2 `weighmaster` |
| `forgehall` | The Forgehall of Oruth | 25–27 | 2 (`forge`, `deepforge`) | `forge`, `deepforge` | floor 2 `oruth` |
| `cinderworks` | The Cinderworks | 28–30 | 2 (`works`, `vault`: the Magma Vault) | `works`, `vault` | floor 1 `morrow_vane`, floor 2 `stoker` |
| `ninth_vault` | The Ninth Vault | 30 (secret) | 1 (`strongroom`) | `ashbound` | its vault, `the_quota_ledgers` |

**Foe kinds** (battle.js ENEMIES; art: renderer.js ENEMY_ACTOR → the actor in brackets):
`assay_guard` (melee; the KayKit knight in the Assay's grey and brass: `enemy_assay_guard`), `assay_xbow` (a crossbow;
the KayKit rogue/crossbowman in grey and brass: `enemy_assay_xbow`), `renegade` (melee; a Slagborn, the barbarian
short and broad, braids and soot: `enemy_renegade`), `forgewight` (melee, undead; an Ashbound skeleton in forge leathers
and a hammer, its eyes and cracks lit: `enemy_forgewight`, new silhouette 2), `cinderhound` (melee, fast; the shared
quadruped, big, ember-cracked: `creature_cinderhound`, new silhouette 1), `furnacepriest` (a caster; the Cult acolyte in
a leather apron with a lit censer: `enemy_furnacepriest`). Kept: `hauler`, `gob`, the Redhand's `cutthroat` / `brute` /
`crossbow`, the Ashbound's `warrior` / `minion` / `rogue` / `mage`.

**Families:** `yards` (assay_guard, cutthroat · assay_xbow, crossbow · elite brute: Nan Ruddock's Redhand on the gate),
`quota` (assay_guard, hauler · assay_xbow · elite hauler), `forge` (forgewight, renegade · mage · elite forgewight),
`deepforge` (forgewight, warrior · mage · elite forgewight), `works` (assay_guard, cinderhound · furnacepriest,
assay_xbow · elite cinderhound), `vault` (cinderhound, warrior · furnacepriest · elite cinderhound).

**Bosses** (battle.js BOSSES; art `boss_<id>`):
- `weighmaster`, the Weighmaster (mech `scales`): every so often he weighs the company, and the one with the most life
  left takes his hardest blow, told on the ground first. Heirloom `short_weight`.
- `oruth`, Oruth the Forgemaster (mech `anvil`): he goes to his anvil and forges; unspoiled, the piece goes to his
  wights (one of them rises re-armed and stronger); enough damage while he works spoils it. Heirloom `oruths_last_commission`.
- `morrow_vane`, Morrow Vane (mech `flee`): fights with the Assay's men; at a quarter of his life he runs and is gone,
  which counts as his fall for the story. No heirloom; he leaves his ledger (a Chronicle fragment).
- `stoker`, the Stoker, Furnace Nine's keeper, a Cult furnace-priest (mech `vents`): slag vents where the floor glows
  first. Furnace Nine's lamp (lamps.js `furnace_nine`) breaks with him and the night shift goes free.
- `furnace_nine`, Furnace Nine, the region boss (ring.js, its window at half past every hour, from level 25), at the
  Magma Vault's mouth on the overland: vents, and it feeds on the fallen. Heirloom `quota`.

**Kell's Rest:** a landmark village on the overland with its people standing in it (no services yet: a second town in a
land is a bigger change, noted for later). *(GDD v1.130 made it a town of its own; GDD v1.132 made it a place on the land again: see "Ashgate and Kell's Rest" above.)* **Spawn points** (camps.js, one a band): `reach_den` the cinder hounds' den
(the old Slag Tunnels' adit, a nest, 20), `reach_renegades` the renegades' camp in the black slag hills (23),
`reach_haulers` the haulers' road on the Cinderworks' track (26), `reach_wagon` the Assay's ore wagon on the Kell road,
the Redhand guarding it (29).

**People** (content/npcs; art `npc_<id>`): Kell's Rest's `nan_ruddock` (the Redhand's sergeant on the Yards' gate, met
outside it), `assay_clerk` (`npc_clerk`, a nervous Assay clerk at Kell's Rest who sells nothing and says too much).
(Both met at the Yards' gate, `npcs.js` `found`: GDD v1.132; v1.130–v1.131 they stood in Kell's Rest's square.)

**Story** (quests.js + content/quests + Ink): `ch3_paid_by_weight` (Hob; the Weighmaster), `ch3_gone_back_to_work`
(Mother Coke; Oruth), `ch3_night_shift` (Dagny; Morrow Vane), `ch3_quota` (Tamsin; the Stoker, Furnace Nine's lamp: Act
III ends). Tamsin's chain: `tamsin_*`. Side quests: `gunnar_*` (his shame), `brannagh_*` (the shrine). The Reach's
Chronicle set: twelve fragments `frag_reach_*`, the set revealing `ninth_vault`. **The class trials at 24** (the owner):
one a class in the Reach, each teaching that class's level-24 ability (skills.js `trialKey` → `<cls>24`):
`trial24_fighter` (Haldor), `trial24_rogue` (Hob), `trial24_mage` (Tamsin), `trial24_cleric` (Old Brannagh),
`trial24_shaman` (Mother Coke).

## Decisions for the owner

**Taken (2026-11-16):** 1, four bands. 2, the cut as proposed. 3, **Furnace Nine at half past every hour** (the
Kingstone keeps the top of it). 4, **Morrow Vane escapes** at a quarter of his life. 5, the cinder hound and the
forge-wight new, the rest recolours, and Ashgate's people as their own models. 6, still open: no trial rung in the first
slice. 7, steps 1 to 3 first (the land, Ashgate and the Cold Seam), dressed and critiqued, then shown.

The questions as they were put:


1. **The four bands.** Four dungeons of three levels (as above, with a new boss for the Assay Yards, *the
   Weighmaster*), or three dungeons of four levels each (the Cold Seam 19–22, the Forgehall 23–26, the Cinderworks
   27–30: exactly the canon's three bosses, the Assay Yards a story place and a spawn point only)? I recommend
   **four**: 19 to 30 is over a hundred hours of fighting at the XP curve, and four places to do it in keeps it fresh.
2. **The cut.** The Slag Tunnels a spawn point (the hounds' den) and the Magma Vault the Cinderworks' second floor: yes?
3. **Furnace Nine as the region boss:** on the hour like the Kingstone, or always there to fight once the story's done?
4. **Morrow Vane:** does he die in the furnace hall, or get away (my proposal: he runs at a quarter health and the
   company never catches him, which suits an act that ends a day behind)?
5. **Art:** the cinder hound and the forge-wight as the region's two new silhouettes, everything else recolours?
6. **Class trials:** a third rung at 24, or not in the Reach?
7. **Where to start:** the whole plan in order, or the land and the Cold Seam first so you can play into level 21
   sooner (my recommendation: steps 1 to 3 first, then show you)?
