# Critic pass: the Tidemark's coast (the sea cave, the strand, the sea fort, the shore)

**Implemented** (2026-11-27). Track 3 of [dungeon-looks-plan.md](./dungeon-looks-plan.md), item 7; the kits are in
[strand-dungeon.md](./strand-dungeon.md). The owner, 2026-11-27: *"Tidemark needs to be more beachy, including the
dungeons.. sea caves and docks like you have now."* The docks (the Drowned Mole's floor 1) and the mole (floor 2) are
kept as they are.

Captures: 390 × 844 at dpr 1, the game's camera and zoom, at dusk for the rooms and by day (and the ferry at dusk) for the
overland (`node tools/capture/rig.mjs <shots.json> --stats`): every Tidemark dungeon room (40) and the overland's places
(Tollhaven's gate, the ferry, the wreckers' beach, the reef, the Lamp Fort's door, the Isles' boats, Gullwick, the east
beach) before (`ed8a263`) and after. Sheets (`tools/capture/pairs.mjs`): the Gull Isles' floor 1, the Lamp Fort, the
Sister's Cabin, the overland, and four untouched rooms (the Mole's two floors, the great cabin, Highmarch's walk) to show
nothing else moved.

## Scores

Out of 10, as the earlier passes score: **identity** (does it read as the place at a phone's size), **building**,
**dressing**, **battle** (the fight readable on it), **light**, **materials**, **polish**.

| Room or place | Identity | Building | Dressing | Battle | Light | Materials | Polish | **Overall** |
|---|---|---|---|---|---|---|---|---|
| *Before:* the Gull Isles' sea cave (the Cold Seam's dirt and crag) | 3 | 5 | 4 | 7.5 | 4.5 | 4 | 4.5 | **4.5** |
| *Before:* the Lamp Fort (Highmarch's ramparts, a town's houses behind its walk) | 4 | 6.5 | 6 | 8.5 | 6.5 | 6.5 | 6 | **6** |
| *Before:* the Sister's Cabin's reef ladder (inside the hull) | 5 | 6.5 | 6 | 8.5 | 6.5 | 6 | 6 | **6** |
| *Before:* the overland's beaches (flat sand to a step into the sea) | 5.5 | 6 | 4.5 | — | 7 | 6 | 5.5 | **5.5** |
| Round 1: the coast's ground laid room by room, the new textures, a first trim | 6 | 5 | 5 | 7.5 | 4.5 | 5 | 3.5 | **5** |
| Round 2: the sea run far past the rooms (the mist sheet's hard edge gone), the blowhole's shaft a fifth as bright, the cave's floor in drifts not a checker, the sand warmed | 7 | 6 | 5.5 | 8 | 6 | 6 | 5 | **6** |
| Round 3: marram seen (pale linen tinted, thicker, taller), dunes rising and falling, two tiles of shallows off a strand, smaller pebbles | 7.5 | 6.5 | 6.5 | 8 | 6 | 6 | 5.5 | **6.5** |
| Round 4: no glints on the coast's sea (they read as a field of stars), the far sea its body's colour, no mist past the edge | 7.5 | 6.5 | 6.5 | 8.5 | 6.5 | 6.5 | 6 | **6.5** |
| Round 5 (shipped): the tide line knee-high and pale (weed under a barnacle crust), the rock a step lighter with fewer wet flecks, the isle's crown in turf and marram; the overland's wet sand a cool step under the dry | | | | | | | | |
| · the strand (the boat landing, the careening beach, the reef) | 8 | 6.5 | 7 | 8.5 | 6.5 | 6.5 | 6.5 | **7** |
| · the sea cave (the stores, the strongroom, the long gallery; the Lamp Fort's cave and magazine) | 7.5 | 6.5 | 7 | 8 | 7 | 6.5 | 6 | **7** |
| · the sea fort (the curtain walk, the lamp room) | 7.5 | 7 | 6.5 | 8.5 | 6.5 | 7 | 6.5 | **7** |
| · the Lamp Fort's water gate (the wharf's decks) | 7.5 | 7 | 6.5 | 8.5 | 7 | 6.5 | 6.5 | **7** |
| · the overland's beaches | 7 | 6.5 | 6.5 | — | 7 | 6.5 | 6.5 | **6.5** |

Round 5's verdict. In a capture the Gull Isles' floor 1 can no longer be taken for the Cold Seam: a beach under a cliff
with boats drawn up, a cave of black rock with the tide's mark on it and the sea outside its low near wall, then the cove
open to the sky. The Lamp Fort reads as a fort on the sea, not a town's wall. What still holds them under 8:

- **The dunes are blocks.** Luminati's ground is a tile a step: the dunes rise and fall a step at a time, and only the
  marram says *dune*. A dune piece of our own (a mound of sand over the tiles, its marram on it) would round them.
- **The fort has no height.** Its walk stands a step over the sea (the coast's one sea level, the landing stage's), so it
  reads as a sea wall rather than a fort on a headland. A drop under the parapet (the ramparts' `walldrop` into a sea far
  below) would read higher, at the cost of two sea levels in one frame.
- **The overland's sand meets the sea in a vertical step** (the sea's level is the level's own); the wet band and the surf
  soften it but it's still a kerb.
- **The level's far corner** shows past the coast's sea at the bottom of a frame from the floor's corner rooms: darker,
  read as deep water, not an edge.

Round 6 (the perf pass, below): the sea past 8 of ours a sheet of the level's own water, not tiles (a first try, void
tiles under the old flat plane, showed a line of foam and a brighter blue where the tiles stopped; not kept); the wet
band brought back (round 3's shallows had stopped the sand counting as by the sea, so the strand had lost its wet sand
and its wrack), the surf at the sand's edge, not the deep's. Scores as round 5.

## Performance

Draws and triangles a frame, counted at the WebGL context (every pass, the shadows' too) as `figperf.mjs` counts them,
the hero stood in the room at dusk, the median of seven frames, one machine
(`/tmp/…/looks/tidemark/perf.mjs`; `figperf.mjs --sites` loaded no Tidemark floor: its numbers were the same for every
site and are not used):

| Room | Before (`ed8a263`) | Round 5 | Shipped (the deep sea, merged with main) |
|---|---|---|---|
| the Gull Isles' boat landing | 106 draws · 191 k | 104 · 315 k | 110 · 247 k |
| the Gull Isles' smugglers' stores | 98 · 224 k | 114 · 355 k | 115 · 276 k |
| the Lamp Fort's curtain walk | 83 · 250 k | 109 · 313 k | 106 · 258 k (+3 %) |
| the Lamp Fort's lamp room | 77 · 189 k | 103 · 311 k | 120 · 221 k |
| the Sister's Cabin's reef | 87 · 161 k | 93 · 218 k | 101 · 183 k (+14 %) |
| *the Drowned Mole's fish market (the docks kit, untouched)* | *81 · 288 k* | *81 · 288 k* | *81 · 288 k* |

The bar for this track: within 15 % of a room's before, or at most level with the docks kit's fish market, whichever is
higher. Every coast room is under 288 k; the reef and the curtain walk are within 15 % of their before as well.

- **The deep sea without a bed** (the largest step): Luminati lays every tile's top as 4 × 4 quads for its baked shade,
  and the sea's bed, which nobody sees through, was most of a coast floor's triangles. The sea three tiles or more off
  any floor is `'Θ'`, water over no bed of its own; its depth, so its colour, is the same, and so are the captures.
- **Before that:** marram eleven blades a clump, the tide line's fringe a third as dense, the surf in longer runs, a
  third of the outcrops' boulders; the surf, weed, wrack, kelp, pools and marram out of the shadow pass (`COAST_FLAT`,
  their own batch); the sea past 8 of ours a sheet of the level's own water (the first try, void tiles under a flat
  plane, showed a line of foam and a brighter blue where the tiles stopped).
- **Draws** rose by 4 to 43 a frame (the lamp room most: its sea cave's tide pools, the water track's sheet, and the
  fort's walls and the dock's edges in their own materials).
- **Lights** within the twelve: a lantern a doorway and the plan's lamps, as before, and one cold blowhole light in each
  fighting cave.


## Balance and the rules

Measured on one machine, three seeds each, the clean checkout at `ed8a263` (`--src`) against this tree (the track
alone; then merged with main, which brought the water track's pools to the sea caves and main's own changes):

| | Before | The track | Merged with main |
|---|---|---|---|
| `boss.mjs gull_isles 40` (Hesk, the floor this pass doesn't touch) | down in 78 / 77 / 69 s, lowest 72 / 56 / 68 %, 0 downs | the same to the second | the same to the second |
| `pace.mjs lamp_fort` | median 4.1 min, 15 waves, 0 wipes | 4.0 min, 15 waves, 0 wipes | 4.2 min, 15 waves, 0 wipes |
| `pace.mjs gull_isles` | median 10.0 min, 35 waves, 0 wipes | 10.0 min, 35 waves, 0 wipes | 9.0 min, 31 waves, 0 wipes |
| `pace.mjs sisters_cabin` | median 5.4 min, 21 waves, 0 wipes | 5.4 min, 21 waves, 0 wipes | 5.4 min, 21 waves, 0 wipes |

No boss hall's dressing changed (the touched floors have none but Hesk's floor, left as it was). The sea caves' pools are
shallow and walked in (the sim's `pools`, drawn only). `dress-audit.mjs`: 20 rooms, none over a cap; `--clear`: 20 floors,
nothing where §4.4 says no. `npm run check` green.

## The overland's way into Tollhaven

`visibility.mjs tidemark` had Tollhaven's way in at 0 % in view after main's pathing fix (33 % at `ed8a263`): homes are
drawn on exactly the tiles the sim walls now, and the inn just inside the west gate and the house past it, both south-east
of the way in, each hid it whole (found by taking them out one at a time). The inn now stands east by the wall (201.5,
109), the house north of the gate (184, 92). `visibility.mjs tidemark tidemark-town`: 26 subjects, none under half;
`pathing.mjs tidemark`: cut 0, grid diff 0, on drawn solid 2.31 % (2.49 % before).
