# The Haddow Crypt: a crypt's inside as a dungeon

*2026-11-23 · **Implemented**: scored 8/10 by the art critic after eighteen rounds (§3), and placed in the Vale at 6
(§4): the Haddows' chantry east of the lumber camp. `?scene=dungeon&site=haddow_crypt` goes straight
in.*

The owner, 2026-11-22, after the Shuttered Inn (docs/tavern-dungeon.md):

> "This looks good, do a similar dungeon style as the inside of a crypt.."

## 1. What it is

**Two new kits, `crypt` and `ossuary`.** This is the second dungeon inside a building, after the inn. Its walls stand
whole, as the inn's do, and its rooms are dressed at their edges with the middle left open for the fight.

**The site.** `haddow_crypt` (src/sim/sites.js) is a Vale site at level 6: flat, one floor, the Ashbound in it.
- It is parked: on no land, no way in, no band.
- Canon: world doc v1.60, "a trial, not canon". The Haddows were a Vale wool family who dug a burial vault under their
  chantry and built it grander than the chantry over it.

**The plan** (src/sim/plans.js) passes `checkPlan`. It has five rooms, joined by halls 10 wide:

| Room | Role | Size | What's in it |
|---|---|---|---|
| The Stair Hall | entrance | medium | the offering table against the back wall, candelabra at the end walls, urns and bones in the corners |
| The Hall of Tombs | the fighting hall | large | four tombs with their likenesses, two along the back wall and two along the near one, candelabra between them |
| The Chantry Chapel | an offshoot | small | the altar (a red frontal, a gilt reliquary, candlesticks), two pews either side, a pricket of candles either side of the altar |
| The Ossuary | a fighting room (`ossuary`) | medium | walls of stacked skulls and long bones, niches heaped with skulls, shelves of skulls, a chest |
| The Founder's Vault | the end | large | old Godwin Haddow's tomb under a columned canopy, two stone mourners, two tombs on the near side, a chest |

**Open floor.** Each tomb, the altar, the offering table and the pews block the floor they cover. A piece is placed with
its footprint as one (world.js `unit`), so a doorway's mouth that turns a piece away never leaves its footprint standing
there unseen. test/crypt.test.mjs holds every fighting room's middle 80 % clear and under a fifth furniture on five seeds.

While writing it, the inn's test of the same rule turned out to check no room at all: it filtered rooms by `foes`,
which a built room doesn't carry. It now filters by `family`, and the inn passes.

## 2. How it is drawn

The converter is src/render3d/convert.js (`KIT_LOOK.crypt`, `cryptRun`, `ossuaryRun`, the crypt's entries in
`TAVERN_3D`). The builder is tools/render3d/world.js (`buildTavern`'s crypt pieces and the crypt's textures).

- **Walls:** whole, as the inn's (`tavernWalls`), in pale ashlar (`crypt_wall`). Along every back wall is a blind
  arcade: a pier at each end and every four tiles, a cornice and a plinth, a depressed arch in each bay, and a damp band
  at the foot.
- **The bays:** each holds one thing, in turn:
  - burial shelves, three across and two high, most sealed with an inscribed slab, a few open on a shroud or a skull;
  - a memorial tablet with a skull and an hourglass;
  - a saint in a niche.
- **Sconces and light-wells:** a candle sconce on every other pier, each with its light. A long wall's middle bay is a
  light-well: a barred grate, a cold shaft of light and dust in it.
- **The ossuary's walls:** painted in stacked skulls and the long bones' ends (`ossuary_wall`). Along them are niches
  heaped with skulls, each with a candle, and stone shelves lined with skulls.
- **The floor:** dark warm flags (`crypt_flag`), with the family's ledger stones among them (`crypt_ledger`, about one
  in fourteen).
- **The light:** a cold fill (`CRYPT_FILL`), with the candles warm against it.

## 3. The art critic's rounds

An independent art-director critic scored each round, seven areas out of 10, and gave at most ten fixes, most impactful
first. The captures are phone frames, 390 × 844, the game's camera, a fight on: every room from its middle, and the hall,
the vault, the ossuary, the chantry and the stair hall again at 1.33× (`?zoom`).

| Round | Identity | Building | Dressing | Battle | Light | Materials | Polish | **Overall** |
|---|---|---|---|---|---|---|---|---|
| 1: first look (whole walls under an arcade, the bays' stories, the tombs, a cold fill) | 6 | 6 | 6 | 7 | 5 | 5 | 5 | **6** |
| 2: walls four units tall so a round arch stands, limestone, fewer and stronger lights | 6 | 6 | 6 | 7 | 6 | 5 | 5 | **6** |
| 3: the founder centred on the vault's north wall, ledgers down each axis, the wall-foot strip | 7 | 7 | 6 | 8 | 6 | 6 | 6 | **7** |
| 4: brighter arch rings and a coping, a tomb on each of the vault's side walls, hatchments | 8 | 7 | 7 | 8 | 6 | 7 | 6 | **7** |
| 5: one clean likeness a tomb, ledger slabs, the ossuary in panels, darker near sills | 8 | 8 | 7 | 8 | 7 | 7 | 7 | **7** |
| 6: the canopy 1.3×, gold that reads in the dark, bones kept to the back walls | 8 | 8 | 7 | 8 | 7 | 7 | 7 | **7** |
| 7: lidded urns, rebuilt mourners, the vault's pool pushed out before the founder | 8 | 8 | 8 | 8 | 7 | 7 | 7 | **7.5** |
| 8: the hour from night to evening (Luminati graded the night blue), a warmer floor | 8 | 8 | 8 | 8 | 6.5 | 7 | 7 | **7.5** |
| 9: a warm pool at each fighting room's middle, a warm bounce in the fill, the shaft dropped | 8.5 | 8 | 8 | 8 | 7 | 7.5 | 7 | **7.5** |
| 10: walls a tenth paler, the ossuary's shelves of skulls, a wash on the vault's west wall | 8.5 | 8 | 8 | 8 | 7.5 | 7.5 | 7.5 | **8** |
| 11: a pool toward each near sill, the carving stone a warm limestone, the ledger cross recut | 8.5 | 8 | 8 | 8.5 | 7.5 | 7.5 | 7.5 | **8** |
| 12: the canopy in stone, pale mourners, halos flat on the niche, the ossuary's disc as paving | 8.5 | 8.5 | 8 | 8.5 | 7.5 | 7.5 | 7.5 | **8** |
| 13: crosses dull brass with no glow, the light-well's patch feathered, the near pools wider | 8.5 | 8.5 | 8 | 8.5 | 7.5 | 7.5 | 7.5 | **8** |
| 14: loculi sealed with near-full slabs, ledgers with a narrow border, a seamed lead roof | 8.5 | 8.5 | 8 | 8.5 | 7.5 | 7.5 | 7.5 | **8** |
| 15: ledgers, saints, mourners, the light-well and the ossuary's heap read (round 14's list) | 8.5 | 8.5 | 8 | 8.5 | 7.5 | 7.5 | 8 | **8** |
| 16: tablets with text-like lines, the reliquary and cross in brass that reads, the canopy opened (taken back) | 8.5 | 7.5 | 8 | 8.5 | 7.5 | 7.5 | 7.5 | **8** |

Round 16's verdict on the chantry: *"the best spot in the crypt"*. Opening the founder's canopy (four beams, no lid, so
the camera above could see his likeness) read as a timber pergola and cost the building half a point, so the roofed
canopy was put back after it; the rest of round 16's fixes stayed, and the ledger crosses took the reliquary's brass.

The owner, 2026-11-23: *"Do the remaining suggested passes, then put it in the vale."* Two more rounds took the
critic's remaining asks:

| Round | Identity | Building | Dressing | Battle | Light | Materials | Polish | **Overall** |
|---|---|---|---|---|---|---|---|---|
| 17: an open stone canopy (arches on every face, ribs to a gilt boss, the pediment a reredos), wedge paving, sconce washes, cooler chests | 8.5 | 7.5 | 8 | 8 | 7.5 | 7.5 | 7.5 | **8** |
| 18: the ossuary's middle a square panel of flags in a kerb, the canopy's front opened and its stone cooled, the chests' panels mid-grey | 8.5 | 7.5 | 8.5 | 8 | 7.5 | 8 | 7.5 | **8** |

Round 18's verdict: the ossuary's middle *"reads as a grave and not a ritual"*, the chests *"as stone sarcophagi, not
crates"*. Round 17's wedge flags ringed by upright bone ends read as a summoning circle beside the foes' red rings and
were taken out the same day.

**Where it stopped: 8/10.** From round 10 the overall held at 8 while the areas under it rose (dressing to 8.5,
materials to 8, battle 8 to 8.5 and back). The critic's asks for a later pass:
- the canopy's top: a low stepped or gabled cap with corner pinnacles in place of the flat entablature, and the
  founder's face and hands lit from inside it;
- the ossuary panel's kerb a step darker, with joints, and the nearest ledger moved off its corner;
- the tomb chests a chamfered overhanging lid on a wider plinth, a different likeness on each;
- each flag a slightly different tone, worn along the walking lines, and small warm pools under the candelabra.

**Kept out of scope.** These are shared across the game, so the critic was told and they stay: the room gates' bars,
the loot chest's gold look, the figures, the near sills' height and the walls at the rooms' corners, the pews' wood (an
engine piece).

## 4. In the Vale, at 6

The owner, 2026-11-23: *"put it in the vale"*.

**Where.** The Haddows' chantry stands in the meadow east of the lumber camp, with the Sunken Chapel's marsh beyond it
(src/sim/outdoor.js `buildOverland`, `crypt` at 214, 190). It is the Vale's temple piece, with a brazier at its step
and its door south onto a track off the camp road.
- It is named on the land ("The Haddow Crypt") and pinned on the region map (assets/maps/minimap-vale.json).
- Its door is 168 tiles from Thornwick's gate, between the Keep (4–6, 154) and the Sunken Chapel (7–9, 183): the Vale's
  sites lie further out as they get harder (test/overland.test.mjs). You come out where you went in, on the track.
- First tried north of the east road past the crossroads (178, 116): 127 tiles out, nearer than the Proving Pens at 4.
- The woods, the meadow clumps and the undergrowth keep clear of it and of its line from the camera, as every site's.
  The Vale's woods are at their floor (30 groves, v1.71's thinning), so the spot is one where no grove has to go.
- The visibility check (`node tools/capture/visibility.mjs vale`) has nothing under half in view (21 subjects).

**The foes.** The Ashbound, as the plan always had them, every fighting room at 6 and the stair hall a sanctuary.
`node tools/balance/roomlv.mjs 300 6 6 1,3 <seed> --site haddow_crypt`, the right party at 6:

| Seed | Waves in 300 s | Lowest health | Downs | Fallen |
|---|---|---|---|---|
| 1 | 17 | 64 % | 0 | 0 |
| 2 | 18 | 47 % | 1 | 0 |
| 3 | 18 | 54 % | 0 | 0 |
| 4 | 17 | 62 % | 0 | 0 |
| (the Old Barrows' second floor, the same Ashbound at 6) | 17 | 49 % | 0 | 0 |

So the crypt meets the contract (10+ waves, nobody fallen in the first five) on every seed, as hard as the barrows.

**Tests.** test/crypt.test.mjs: in the Vale at 6 and open; the chantry, its door, its arrival and its name on the land,
walked to from Thornwick's gate, in and down. test/sites.test.mjs: its band, 6.

## The Reedholm Undercroft on the kit (v1.145; the critic, 2026-11-24)

The Fens' secret is the crypt kit's second place (plans.js `reedholm_undercroft`), on the Haddow Crypt's floor:

- the Key Stair;
- the Copy Room, with the copyists' desks and rolls along its walls;
- the Clergy's Chapel;
- the Bone Room, an ossuary;
- the Fair Copy, the copyists' tombs either side and the vault's chest in the middle.

**In the game (captures in the session): 8 / 10.** The shelves of rolls under the vaults read as a scriptorium of the
dead, not the Haddows' tomb again. The vault's gold chest is the room's one light. Still wanting: the Copy Room's
floor plaques, the tomb lids' gilt crosses, repeat too evenly across the open floor. A scatter of loose papers there
would break it up.

**Cost (figperf, 2026-11-24, SwiftShader, 390 × 844):** the Undercroft's fight draws 271 calls and 486 k triangles a frame.
The town square draws 429 and 725 k, the Barrows' fight 116–125 and 244–255 k. So the crypt kit costs about two
thirds of the town, the game's heaviest scene. The Haddow Crypt's own floor is the same, but the probe's counter read
none for it (its fight began before the world was drawn), so it is taken from the Undercroft's.
