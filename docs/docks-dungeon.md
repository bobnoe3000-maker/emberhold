# The Old Eel Wharf: a harbour's wharf as a dungeon

*2026-11-23 · **Prototype, in progress**: art critic rounds under way (§3). The site is parked: it is on no land, and you
reach it with `?scene=dungeon&site=old_eel_wharf`.*

The owner, 2026-11-23, with a reference (a skeleton angler on a plank pier at night, fog, lanterns on posts, barrels,
rope and nets):

> "Then start two new level dressing types, docks and harbor and second the reaches, high up on the ramparts. See
> reference art"

## 1. What it is

A new dungeon type, the `docks` kit: fighting rooms on a wharf's plank decks over open water, no walls. It's a trial
for Tollhaven's quays (world doc §3.7: "the quay, three jetties, two moles and the chain"), set for now in the Fens at 12.

- **The site:** `old_eel_wharf` (src/sim/sites.js), the Fens, base 12, one authored floor, the drowned (the Abbey's
  family: the drowned, harvesters, cantors), parked.
- **The plan** (src/sim/plans.js `old_eel_wharf`): five decks joined by boardwalks. The Landing (the way in), the Fish
  Market, the Net Stage, the Long Jetty, the Harbour End.
- **Its dressing** (src/sim/world.js, `dressPlanned`), every piece at a deck's edge and the middle open:
  - `dock_lamps`: lamps on posts at the back corners and one at the front;
  - `dock_cargo`: barrels, crates and sacks in the back corners;
  - `dock_ropes`: rope coils and drying nets, which lie flat (`FLAT_PROPS`: walked over);
  - `fish_market`: the morning's catch in crates along the back;
  - `moorings`: a boat tied up off the back edge, in the water;
  - `crane`: the Harbour End's derrick, a load swung out over the water.
- Every fighting deck's middle 80 % is open, its cargo under 15 % of the floor, on five seeds; keep-clear is clean.

## 2. How it is drawn

The converter is src/render3d/convert.js (`KIT_LOOK.docks`, `docksDress`, `DOCK_3D`); the builder is
tools/render3d/world.js (`buildTavern`'s dock pieces, `harbourAir`).

- **The harbour:** every tile off the decks is still water (`o`), its surface at 0.84 (`DOCK_WL`), so only the decks'
  fascia shows over it. `harbourAir` tints it slate and near black and sets the weather's water base, so it has no
  glints or crests (the weather sets them every frame from that base).
- **The decks:** our own tile (`_`): weathered grey-brown planks (`dock_deck`), and under them the dark with piles and
  weed (`dock_side`).
- **The edges** (`docksDress`): the back edges (the ones the camera looks across) railed on round piles; the near edges
  only pile heads with turns of rope and an iron bollard now and then, so a fight is never behind a rail; reed clumps
  against the back piles.
- **The mist:** one sheet over the water, clear at the decks' edges and thick from six tiles out, by each tile's
  distance from a deck.
- **The lamps:** on dark posts with an arm and a hanging lantern, their light warm, and warm streaks on the water off a
  near edge. The night fill is cold (`DOCK_FILL`), the distance blue-grey.
- Its barrels and crate stacks are Luminati's; the lamps, rope, nets, crates of fish, rowboats and crane are ours.

## 3. The art critic's rounds

| Round | Identity | Building | Dressing | Battle | Light | Materials | Polish | **Overall** |
|---|---|---|---|---|---|---|---|---|
| 1: decks over water, rails and piles, lamps, cargo | 6 | 5 | 4.5 | 8.5 | 5 | 5 | 4 | **5.5** |
| 2: grey planks, dark deck sides, one mist sheet, tan rope, reeds | 6.5 | 5.5 | 5 | 8.5 | 6 | 6 | 4.5 | **6** |
| 3: the harbour up under the decks, the glints off for good, the rope raised | 7 | 6.5 | 5.5 | 8.5 | 6 | 6 | 5.5 | **6.5** |
| 4: the crane in frame, the boat where it's seen, the planks warmer by the lamps | 7 | 6.5 | 6 | 8.5 | 6 | 6 | 5.5 | **6.5** |

Further rounds are next.
