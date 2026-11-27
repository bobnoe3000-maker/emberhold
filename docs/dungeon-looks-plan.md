# The dungeons' looks: every land its own

*2026-11-27 · **Plan of record**, the owner's go-ahead. The owner, of the dungeon looks review: "Do an art design review on
all current and proposed dungeons, do we have any gaps in alternative dressed dungeons across regions? The common ones
are the cave or basic stone..", then "Dont use the high res proposal from Nov 15, continue to build on our own assets.
Continue otherwise with your recommendations.. ill look for a reference for the forest".*

## 1. What the review found

Every room of every authored floor (`src/sim/plans.js`), counted by the textures its kit draws
(`src/render3d/convert.js` `KIT_LOOK`). Parked sites are left out.

| Land | Plain stone | Plain cave | Its own palette | Its own kit | Plain in all |
|---|---|---|---|---|---|
| The Hollow Vale | 61 % | 30 % | | 10 % (the Haddow Crypt) | **90 %** |
| The Fens | 56 % | | | 44 % (the Mound; the Undercroft, a copy of the Haddow Crypt) | **56 %** |
| The Cinder Reach | 13 % | 26 % | 49 % (basalt, slag, magma) | 12 % (the Shuttered Inn) | **40 %** |
| The Tidemark | | 12 % (the Gull Isles' sea cave) | | 88 % | **12 %** |

- **"Plain stone"** is eleven kits (`gallery`, `muster`, `bailey`, `barracks`, `nave`, `binding`, `quota`, `locks`,
  `vats`, `abbey`, and the Barrows' `dig` floor) on two wall textures, `stone_brick` and `stone_wall`. Their floors differ
  by a tint, and the walls fill most of the frame.
- **"Plain cave"** is six kits (`dig`, `cellar`, `cultcut`, `pithead`, `warren`, `seacave`) of dirt and crag under cliff
  or earth.
- **They read alike in play** (one capture per kit, at dusk, from the play camera):
  - the Gull Isles' sea cave (36) and the Cold Seam (19);
  - the Drowned Abbey and the Sunken Chapel's nave;
  - the Canal Locks and Wickham Keep's barracks;
  - the Assay Yards' quota office and the Barrows' gallery;
  - the Reedholm Undercroft, which is the Haddow Crypt.
- **Kinds of place the story calls for and no dungeon has:**
  - water inside a dungeon (the Fens, the Sunken Chapel);
  - a worked mine;
  - a sea cave;
  - a forest;
  - ice.
- **Generated floors** draw only the plain kits (`THEME_LOOK`).

## 2. The rule

**Our own assets.** The high-res spike ([dungeon-look-spike.md](./dungeon-look-spike.md)) is declined and its code
retired. A new look is built the way the tavern, crypt, docks, ramparts, palace and hulk kits were:

- its own textures, drawn in `tools/render3d/world.js` as theirs are;
- Luminati's own objects where it has the thing;
- our voxel props (`render/gsprite.js`, `tools/actor-lab/`) where it doesn't;
- critic rounds against the kit's description, scored, until it reads.

A kit keeps its sim id, so its rooms, foes, bosses and the balance contract stand. A new id is added only where two
sites share a kit and must look different (the Undercroft). New sim pieces follow the Magma Vault's:

- `DRESS_PIECES`, `DRESS_CAP`, a recipe;
- `dress-audit.mjs` clean;
- the keep-clear rules (§4.4 of [level-design-rules.md](./level-design-rules.md));
- the visibility rule.

## 3. The work

| # | Land | What | Kits | Size |
|---|---|---|---|---|
| 1 | Vale | **The Old Barrows a barrow:** drystone walls under turf, timber lintels over the niches, grave goods (urns, a bier, shields and spears laid by the dead), standing stones in the muster hall. The mouth cut earth shored with timber. | `dig`, `gallery`, `muster` (also the Ninth Milestone, the Proving Pens) | M |
| 2 | Vale | **Wickham Keep a keep:** the bailey a cobbled yard under curtain walls with the ramparts' parapet along their tops; the barracks a great hall of plaster and timber (the tavern kit's walls), trestle tables, arms racks, a hearth. The cellars stay cave, a spiders' hole under the keep. | `bailey`, `barracks` | S |
| 3 | Vale | **The Sunken Chapel sunken:** shin-deep standing water in the nave among the pews, the docks kit's water under the walls, reflections of the candles. | `nave` | M |
| 4 | Fens | **The Canal Locks wet:** channels of water across the floors with lock gates, winch wheels, sluice boards and plank bridges; the vats' pools sick green. Fen stone of its own, not the Vale's brick. | `locks`, `vats` | M |
| 5 | Fens | **The Drowned Abbey drowned:** a cloister garth open to the sky and standing in water, the pale abbey stone above a waterline, weed below it; its walls no longer the Vale nave's sandstone. | `abbey` | M |
| 6 | Fens | **The Reedholm Undercroft its own:** the reed town's brick vaults, peat-cut walls, reed matting, eel traps, the crypt kit's plan and set pieces kept. | new `fenbrick`, `fenbones` | S |
| 7 | Tidemark | **The Tidemark a coast, dungeons and all** (the owner, 2026-11-27: "Tidemark needs to be more beachy, including the dungeons.. sea caves and docks like you have now"). (a) **A sea cave of its own** for the Gull Isles: wet black rock, a shingle floor, tide pools in the hollows (the docks kit's water), kelp, barnacled walls, wreck timbers, light down through blowholes. (b) **A new open-air `strand` kit**, the shore itself: sand and wet sand in bands, the tideline's wrack and driftwood, rock outcrops and boulders as the walls, rock pools, the sea and its surf past the edges (the docks' water with a foam line). (c) **More of each in the Tidemark's dungeons:** the Gull Isles' first floor part beach and part cave; the Lamp Fort down off its headland, a sea cave in the rock and a landing stage below the walls, the lamp room still its end, its ramparts over the sea; the Sister's Cabin reached across the reef at low water; Highmarch's walls over the sea if canon puts the city on the coast. (d) **The overland beachier still:** dunes and marram grass, driftwood and wrack along the tideline, rock pools, beached boats, nets drying on poles, fishing huts. | `seacave`, new `strand`, the Tidemark's plans | M+ |
| 8 | Reach | **The Cold Seam a worked mine:** timber shoring sets along the galleries, rails with ore carts, ladders, lamps on hooks, spoil heaps. | `pithead`, `warren` | S |
| 9 | Reach | **The quota office a counting house:** ledger walls, chained clerks' desks, tally boards, the clerk's cool lamp. Built here first, then reused for the Greenwood's Tally-House and the Archive's wing. | `quota` (the look `counting`) | S |
| 10 | Heights | **A frozen fortress** for the Praetory, ahead of the Heights' dungeons: frost cobbles, rime on the walls, icicles, the bound guard frozen at their posts. It uses the overland's snow and ice textures. It's built on a parked prototype floor until the Praetory is. **Prototype, 2026-11-27:** the parked site `praetory` at 70, critic 6.5 ([pass-dungeon.md](./pass-dungeon.md) §3–4). | new `frostkeep` | S |
| 13 | Heights | **A mountain pass**, open air, for the Pilgrims' Stair (in place of the ramparts with snow): from the owner's three references (2026-11-27, kept out of the repo). Snowfields as the floors, wind-scoured and flecked with grit; dark blue-grey rock in big angular blocks as the walls, snow on their tops; ledges over a drop into cloud and falling snow (the ramparts' and docks' backdrop past the edge); a plank-and-rope bridge across a crevasse (a hall as a bridge between two ledges); frozen pools and a frozen fall, their edges lit pale blue; clusters of blue ice crystal that glow; snow-laden pines from above; one canyon of brown rock under snow. On a parked prototype floor until the Heights' dungeons are built. **Prototype, 2026-11-27:** the parked site `pilgrims_stair` at 62, kits `pass` and `gully`, critic 7 ([pass-dungeon.md](./pass-dungeon.md)). | new `pass` | M |
| 11 | all | **Generated floors draw every land's kits:** a generated floor's theme picks a built kit of its land (the Mere Tower in Fens stone, the Undervaults descending through every land's). | `THEME_LOOK` | S |
| 12 | Greenwood | **A forest dungeon**, open air under the canopy, built as the docks and ramparts are (no walls: trunks, root-banks and mossed boulders bound the rooms, the wood and its mist past the level's edges). From the owner's two references (2026-11-27, kept out of the repo): tall straight trunks and old twisted ones swathed in moss; shafts of pale green light down through the canopy; a moss-and-fern floor with stones in it and a cracked flagstone path (the Tithe Road, "ruled straight through the oaks, half swallowed", world doc §3.8); a ruined arcade of pointed arches in dark stone with bronze cresting gone green, the empire's; a broken gateway with steps up into the dark (the Root Granary's door); fallen blocks and broken pillars; a waterfall beyond. On a parked prototype floor of the Root Granary until the Greenwood is built. | new `greenwood` | M |

## 4. Order

Six tracks, built side by side:

1. **The Vale's stone** (items 1, 2).
2. **The water** (items 3, 4, 5: one way of drawing water inside walls, three places).
3. **The Tidemark's coast** (item 7: the sea cave, the strand, the dungeons and the overland).
4. **Stone and mine** (items 6, 8, 9, 11).
5. **The forest** (item 12).
6. **The ice** (items 10, 13: the pass first, the frozen fortress after it, sharing its snow, rock and ice).

Each track ends with:

- captures before and after, one per room;
- a critic doc (`docs/art-critic-pass-*.md`);
- `npm run check`;
- the boss halls it touches measured with `tools/balance/boss.mjs`.
