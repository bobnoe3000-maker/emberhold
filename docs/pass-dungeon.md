# The Pilgrims' Stair and the Praetory: a mountain pass, and a fort frozen through

*2026-11-27 · **Prototype**: eight critic rounds on the pass, seven on the frostkeep (§4). Both sites are parked: they
are on no land. Reach them with `?scene=dungeon&region=heights&site=pilgrims_stair` (or `site=praetory`).*

These are [dungeon-looks-plan.md](./dungeon-looks-plan.md) items 13 and 10, track 6, "the ice". Item 13 came from the
owner's three references (2026-11-27, kept out of the repo). Each is a painted, inked top-down battle map:

- **ice-1:** a snowfield with a frozen pool among big blocks of dark rock;
- **ice-2:** ledges over a drop into cloud, with a rope bridge across a crevasse;
- **ice-3:** a canyon of brown rock, with a frozen river and broken bridges.

The catalogue ([dungeon-catalog.md](./dungeon-catalog.md) §4.6) had planned the Stair as the ramparts kit under snow.
The plan replaces that with a kit of its own.

## 1. What it is

### The pass (item 13)

The `pass` kit is fighting ledges in the open air, with no walls. It is built the way the docks and the ramparts are: the
world past a ledge's edge is the backdrop. The `gully` kit is the same pass with brown rock.

- **The site:** `pilgrims_stair` (src/sim/sites.js), in the Heights, at 62, flat, parked. It has one authored floor on
  the one-floor template ([dungeon-catalog.md](./dungeon-catalog.md) §1).
  - **Its foes:** the Redhand (`redhand`), a placeholder. The catalogue's beat is "with the Redhand turning to hold it
    behind you"; the Stair's frost revenants aren't built yet.
- **The plan** (src/sim/plans.js `pilgrims_stair`) has five spaces:
  - the Stair Foot (the way in);
  - the First Turn;
  - the Wayside Shrine (the offshoot);
  - the Red Gully (the canyon room, `gully`);
  - the Cloud Ledge (the end).

  Two halls are bridges (`bridge: 'river' | 'cloud'`). To the sim a bridge is a hall like any other; the renderer draws
  it. One crosses the frozen river into the gully, and one crosses the cloud to the last ledge.
- **Its dressing** (src/sim/world.js, `dressPlanned`) stands every piece by the rock or the drop and leaves the middle
  open:
  - `prayer_posts`: the pilgrims' posts, cloth strips and a bell, two at the back and one at the front;
  - `cairns`;
  - `pines`: snow-laden, at the back only;
  - `ice_crystals`: the blue ice, glowing;
  - `frozen_pool`: a pool frozen in a back corner. Its `pass_ice` tiles are flat (`FLAT_PROPS`), so the fight walks
    over them;
  - `frozen_fall`: the gully's fall, frozen down the back rock, with a pool at its foot;
  - `wayside_shrine`;
  - `pass_cargo`: the packs the pilgrims left.
- **The checks:** every fighting room's middle 80 % is open on five seeds, every room is under its caps
  (`dress-audit.mjs`), and keep-clear (`dressingFaults`) is clean (test/pass.test.mjs).

### The frostkeep (item 10)

The `frostkeep` kit is the barracks kit's fortress rooms, frozen.

- **The site:** a second parked site, `praetory`, in the Heights, at 70.
  - **Its foes:** Highmarch's legionaries (`siege`), standing in for the Praetorians.
- **The plan:** the same template, with five rooms:
  - the Watch Gate;
  - the Guard Hall;
  - the Armoury;
  - the Mess;
  - the Praetor's Door.
- **The piece:** `frozen_guard`, the Empress's bound guard frozen at his post. It stands in a file along each long wall
  and by each door. Its floors stand nothing else out on them (`PLAN_OB.frostkeep: []`).

## 2. How the pass is drawn

The converter is src/render3d/convert.js (`KIT_LOOK.pass`, `.gully`, `passBridges`, `passGround`, `passDress`,
`PASS_3D`). The builder is tools/render3d/world.js (`buildPass`, the pass's textures, `PASS_KEYFRAMES`).

- **The ground** (`passGround`) sorts every tile that isn't a ledge:
  - **Behind a ledge** (north or west of it, within four tiles): the rock. It is a low plinth, a little higher the
    further back it goes. Tile `ø`, or `å` for the gully's brown.
  - **In front of a ledge** (a ledge within six tiles to its north-west, so the camera looks over it): the drop. No rock
    stands there, whatever lies behind it, as with the ramparts' houses.
  - **Beside a bridge:** the drop again. The crevasse is kept open.
- **The rock** is our own faceted blocks: Luminati's `rockGeom` icosahedron, with snow (`pass_cap`) on the faces that
  look up.
  - Big blocks stand along each ledge's back, on its snow, against the plinth.
  - Smaller blocks stand over the plinth's top and break its steps.
  - Snow pines (Luminati's `snowpine`) stand here and there on the rock.
- **The drop:** each ledge's south and east edges (the faces the camera sees) carry a rock face down to −11.
  - Chunks of rock jut from the face, and a lip of snow runs along its top: the references' inked edge.
  - A veil of cloud hangs over the face's foot.
  - Below that the cloud has form (round 5 on). Banks of it stand in the drop, wide flat lumps (`cloudbank`) lit by the
    sun from above and the blue fill from below, so their undersides fall into shadow. Under them is a deep blue-grey
    floor of billowed cloud, and one thin veil over the drop, clear at the edges.
  - The backdrop is a blue-grey, `#8ea3c8`, and the grade's vignette (`PASS_GRADE`) darkens the frame toward its edges.
  - Six mountains stand far off, their tops out of the cloud and under the ledges.
- **The bridges:**
  - The planks are tile `æ`: `pass_plank` over `pass_truss`, weathered dark, with snow in the seams.
  - `buildPass` adds a timber post at each corner and every 2.4 units, a hand rope and a lower one sagging between
    them, ties down to an edge log, and rope wound round the end posts.
  - Under the river bridge, the frozen river is lit icy blue at the crevasse's foot, between the two ledges' faces.
- **Ice:**
  - **The pools:** `pass_ice` tiles become one sheet of `pass_ice`, deep blue with white cracks and glowing (its
    emissive mask). Its open edges are lit pale blue and banked with snow.
  - **The frozen fall:** a sheet and thirteen columns of the same ice, backed by three tall blocks of brown rock, with
    one cool light.
  - **The crystals** (round 5): ours, six to eight faceted prisms leaning out from a root, vivid blue and lit from
    inside, with a halo on the snow and a cool light for every other cluster. Luminati's own ice glowed at 0.15 and read
    as grey-blue slabs.
  - **The pools' rim** (round 5): a bright cyan line, with its light laid out over the snow bank in a strip that fades
    from the rim. The ice's body is a deep blue.
- **The light:** a cold, high day held whatever the clock says.
  - `held: 10.6` is passed through `hybrid.js` as the converter's `hour`.
  - `PASS_KEYFRAMES` is Luminati's day with a whiter, weaker sun, a blue shade, and the cloud's colour for the air.
  - The fill is `PASS_FILL`, with the sun out (`fill.sun`, which `ambientOf` now reads).
  - The level is open (`interior: false`): Luminati's sun and shadows, and the outdoor tilt-shift.
  - The fighters' rings are drawn at 0.9 alpha on the snow, as on the Bowl's sand.
  - The hero's ember-wisp is off.
- **The falling snow** (round 6): our own, 1,400 points in one draw, each falling on the shared clock (`uTime`) and
  wrapping, drifting a little sideways, 2.6 px a flake times the screen's density. Luminati's `snow` preset never
  showed in this level.
- **The palette** (round 5): the snow pale blues with deeper blue shadows and the lit tops near white; the rock
  slate-navy with a cyan-lit edge along each facet's upper left; the fill and the shade bluer, the sun whiter
  (`PASS_FILL`, `PASS_KEYFRAMES`); the picture's saturation up a seventh (`PASS_GRADE`).
- **The pilgrims' things** (`buildPass`):
  - **Prayer posts:** a 2.9-unit pole and crossbar, strips of faded cloth in five colours, a bell, a snow cap and stones
    at the foot. At a doorway the post carries the doorway's lantern and its light.
  - **Cairns:** five to seven stacked flat stones in the dark rock. Only the top one is dusted with snow.
  - **The shrine:** a stele on a step under a slate gable, a lamp in its niche, offerings on the step. It is built a
    third bigger.

## 3. How the frostkeep is drawn

The converter is `KIT_LOOK.frostkeep`, `frostDress` and `FROST_3D`. The builder is the same `buildPass`.

- **The walls:** the barracks' walls, ragged tops and all (`ruinWalls`), in `frost_wall`. That is grey-blue ashlar with
  rime along each block's top and in patches over its face. Tile `é`.
- **The floor:** `frost_flag` (tile `ê`), grey flags with rime in their joints.
  - **The snow drifted across it** (round 7): a tile of snow (`ë`) against every wall's foot, and over the floor our
    own drifts, low soft lumps in broad patches by value noise, thinnest under the fight. Snow by the tile in the open
    read as square blocks.
  - Round 2 had Luminati's `frost_cobble` (`R`), as the plan asked. Its blue read navy under the fort's cold fill.
- **Icicles:** along every back wall's top, in runs of one height (`icicles`). Since round 5 they are big enough to
  read on a phone: up to half a figure long, thick, fewer.
- **The glaze** (round 5): a blue ice glaze, translucent and faintly lit, down the back walls' lower courses.
- **The doors:** where a hall meets a room, the tiles are trodden snow (`h`), with a drift (Luminati's `snow` rock) to
  one side.
- **The guard:** each `frozen_guard` is our `bound` legionary (gsprite.js) inside a faceted block of clear ice. The ice is
  a mesh of its own, drawn through, with rime at its foot. Since round 5 it glows faintly blue, with a halo on the floor.
- **The fill:** `FROST_FILL` is cold, a step lighter than underground's violet: the barracks' dungeon ambient through a
  blue tint read navy. The braziers and torches stay warm against it.

## 4. The art critic's rounds

All captures are from the rig (`tools/capture/rig.mjs`), at the 390 × 844 phone frame, dpr 1. Each shot stands the
hero at a room's middle.

The scores are against the references. The before is the kit the catalogue had planned: the High Ramparts' rooms for
the Stair (the same template, room for room), and Wickham Keep's barracks floor for the Praetory.

### The pass

| Round | Identity | Building | Dressing | Battle | Light | Materials | Polish | **Overall** |
|---|---|---|---|---|---|---|---|---|
| before: the ramparts, as the catalogue planned (a walled town at night) | 2 | 6 | 6 | 7.5 | 4 | 6 | 6 | **5** |
| 1: ledges, rock columns, cliffs, the cloud, pines, crystals | 6 | 5 | 5.5 | 7 | 4.5 | 5 | 4 | **5.5** |
| 2: the snow a step down and bluer, the rock a low plinth under faceted blocks, the scour in the texture | 7 | 6.5 | 6 | 8 | 6 | 6.5 | 5.5 | **6.5** |
| 3: the veils joined, the blocks kept off the fall, the shrine and the stair's arch, the fall bigger, the cairns dark | 7.5 | 7 | 7 | 8 | 6.5 | 7 | 6.5 | **7** |
| 4: shadows off the drop and the peaks, fewer pines (the perf pass), the flakes bigger | 7.5 | 7 | 7 | 8 | 6.5 | 7 | 6.5 | **7** |
| 5 (the coordinator's notes): the saturated palette, our glowing crystals and pools, the cloud's banks, the vignette | 8 | 7.5 | 7.5 | 8 | 7.5 | 7.5 | 6.5 | **7.5** |
| 6: our own falling snow, the banks darker | 8 | 7.5 | 7.5 | 8 | 7.5 | 7.5 | 7 | **7.5** |
| 7–8: the banks wide and flat, blue-grey, fewer, the dark floor between; the flakes scattered | 8.5 | 7.5 | 7.5 | 8 | 8 | 8 | 7 | **8** |

What each round fixed:

- **Round 1:**
  - The snow blew out to white.
  - The ledges' scoured snow, laid by the tile, read as a grid of square blocks.
  - The rock, in columns a step each, read as stacked cubes.
  - A mountain stood close in at the north-west and read as a rock floating in the sky.
- **Round 2:**
  - The cloud's veils were split every twelve tiles and overlapped, which stood a pale pillar in the drop.
  - The new blocks covered the gully's fall, the shrine and the stair's arch. They are kept off those now.
  - Every stone of a cairn under snow read as a snowman.

The fights read, judged on the Stage's live effects in the First Turn ([fx sheets](#5-the-numbers)):

- The foes' red rings and the party's gold rings read on the snow at 0.9.
- The crossbows' red lanes are clear.
- Frost Nova's burst, Glacial Tomb and Arcane Ward read.
- Flare's faint warm ring is as faint here as it is on stone.

Round 4's verdict: the Stair Foot and the First Turn were the references' snowfield, but the palette was grey and
white, the ice small grey-blue slabs, and the cloud below the far ledges a pale blank across half the frame.

Rounds 5–8 (the coordinator's four notes):

- **Round 5** found the cloud floor's tiling commented out by a merged comment since round 2: its billows had been
  stretched to one across the whole sheet, which was half of the blank.
- **Round 6:** the banks at near white read as more snow, a field of boulders below the ledges.
- **Round 7:** a flake attenuated by the camera's distance was under a pixel; in pixels now.
- **Round 8:** the flakes' positions came from consecutive draws of one hash and fell on a line; a stream now.

Round 8's verdict. Every room reads as the references' pass at a phone's size: blue snow under white tops, navy rock in
blocks with cyan edges and snow on them, pools frozen deep blue inside a cyan rim, crystals glowing blue. Below the ledges
is cloud with form. What still holds it from more:

- **The cloud** is still the palest thing in the gully's and the Cloud Ledge's lower halves: the bank lumps are
  faceted (twenty-face icosahedra) and the fog lays the backdrop over them.
- **The falling snow** reads only against the cloud and the rock.
- **The frozen river** under the river bridge is seen only from the First Turn. Ice-3's broken bridges and spray are
  not built.

### The frostkeep

| Round | Identity | Building | Dressing | Battle | Light | Materials | Polish | **Overall** |
|---|---|---|---|---|---|---|---|---|
| before: Wickham Keep's barracks | 3 | 6.5 | 6 | 7.5 | 6 | 6 | 6 | **5.5** |
| 1: rime walls, frost cobbles, icicles, guards in ice | 5 | 6 | 5 | 7 | 3.5 | 4.5 | 4.5 | **5** |
| 2: a cold fill of its own, the ice shells bigger and clearer, no pillars | 6 | 6.5 | 6 | 7.5 | 6 | 5.5 | 5.5 | **6** |
| 3: our frosted flags in place of the blue cobble | 6.5 | 6.5 | 6.5 | 7.5 | 6 | 6.5 | 6 | **6.5** |
| 4 (the coordinator's notes): the glaze, big icicles, the guard's ice glowing, snow by the tile across the floor | 7 | 7 | 7 | 7.5 | 6.5 | 6.5 | 6 | **7** |
| 5: the snow at the walls' feet only (the tiles read as square blocks), Luminati's drifts | 6.5 | 7 | 6.5 | 7.5 | 6.5 | 7 | 6.5 | **6.5** |
| 6–7: our soft drifts over the floor (round 6 in the cap's texture, camouflage; 7 plain snow), thinnest under the fight | 7.5 | 7 | 7.5 | 7.5 | 7 | 7.5 | 7 | **7.5** |

Round 7's verdict. The fort reads as frozen, not just cold: snow drifted over the flags and banked at the walls, the
lower courses glazed blue, icicles along every top, the guard in faintly glowing ice. The torches are warm against it.
What holds it under 8:

- **The candle piers** on the walls' tops (`ruinWalls`) aren't a frozen fort's.
- **The walls' rime** reads a warm grey against the torches; it could be bluer.
- **The world past the walls** is underground's black. A fort in the open would want the pass's sky.

## 5. The numbers

- **Draws and triangles** were counted at the WebGL context, one frame on the manual clock. The hero stood at the
  room's middle, and every pass is counted, shadows and post included (scratch `glframe.mjs`, the method of figperf.mjs
  on a still frame):

  | Floor | Room | Draws | Triangles |
  |---|---|---|---|
  | High Ramparts (the kit it replaces) | Market Terrace | 83 | 215,977 |
  | Pilgrims' Stair, round 4 | First Turn | 92 (+11 %) | 174,824 (−19 %) |
  | Pilgrims' Stair, round 8 | First Turn | 95 (+14.5 %) | 187,080 (−13 %) |
  | Pilgrims' Stair, round 8 | Red Gully | 96 | 188,370 |
  | Wickham Keep (floor 1) | the bailey's second room | 122 | 198,055 |
  | Praetory, round 3 | Guard Hall | 117 (−4 %) | 198,355 (±0) |
  | Praetory, round 7 | Guard Hall | 121 (−1 %) | 207,613 (+5 %) |

  Round 8's cost is the cloud's banks (about 100 lumps, no shadows), the snow (one draw) and the halos. The drifts at
  80 faces took the Praetory to +20 % triangles; at 20 faces it is +5 %.

  - **The perf pass:** the cliffs' faces, the veils, the river and the mountains cast no shadow (`buildPass`'s second
    batch), the rock's blocks are 20 faces each, and at most eight pines stand on the rock.
  - **Lights:** 13 descriptors on the Stair (the lanterns, half the crystals, the fall). Luminati keeps the twelve
    nearest.
- **Balance:** no boss hall is touched; both sites are parked and bossless.
- **`npm run check`** is green (typecheck, lint, content, the tests, smoke and render smoke).
- **Sheets** (scratch, out of the repo):
  - `scratchpad/looks/ice/sheet-refs.jpg`: the references beside every room;
  - `sheet-before-after.jpg`: the ramparts and the barracks against the pass and the frostkeep;
  - `fx2/sheet.jpg` and `fx3/sheet.jpg`: the fights on the snow;
  - `sheet-refs-r8.jpg` and `sheet-r4-r8.jpg`: round 8 beside the references, and against round 4;
  - `fx4/sheet.jpg` and `fx5/sheet.jpg`: the fights on round 8's blue snow and on the Praetory's drifts. The rings,
    the crossbows' lanes, Frost Nova and Glacial Tomb all read.

## 6. Left for when the Heights are built

- **The Stair:** its own foes (the frost revenants, the glass-touched), a boss at the Cloud Ledge, and the way in from
  the Frozen Hospice with Sister Hild at its foot ([dungeon-catalog.md](./dungeon-catalog.md) §4.6).
- **The Praetory:** its two floors (the frostkeep, then the Glass Keep), with Brother Cobb's keys.
- **The three items under §4's verdicts:** the cloud's depth, the falling snow, and longer icicles.
