# The High Ramparts: a walled town's high streets as a dungeon

*2026-11-23 · **Prototype, in progress**: art critic rounds under way (§3). The site is parked: it is on no land, and you
reach it with `?scene=dungeon&site=high_ramparts`.*

The owner, 2026-11-23, with a reference (a hooded archer and a woman with a basket in a walled town's high street at
dusk: cobbles, half-timbered houses with slate roofs, stone balustrades over a drop into fog, castle towers rising out
of it, torches on posts):

> "Then start two new level dressing types, docks and harbor and second the reaches, high up on the ramparts. See
> reference art"

## 1. What it is

A new dungeon type, the `ramparts` kit: fighting rooms on cobbled terraces along a walled town's ramparts, its houses
at their backs and a parapet over the drop at their fronts. It's a trial for the Reach's walled towns, set in the Reach
at 22.

- **The site:** `high_ramparts` (src/sim/sites.js), the Reach, base 22, one authored floor, the Assay's guards and
  crossbowmen (`yards`), parked.
- **The plan** (src/sim/plans.js `high_ramparts`): five terraces joined by short streets. The Stair Head (the way in),
  the Market Terrace, the Watch Walk, the Bakers' Row, the Bastion.
- **Its dressing** (src/sim/world.js, `dressPlanned`), every piece by the houses or the parapet and the middle open:
  - `rampart_torches`: torches on poles at the corners;
  - `rampart_cargo`: barrels, crates and sacks in the back corners;
  - `market_stalls`: stalls against the houses, their awnings over the street;
  - `oven`: the bakers' oven, built out from a house's front;
  - `rampart_well`: the Bastion's well.
- Every fighting terrace's middle 80 % is open, on five seeds; keep-clear is clean.

## 2. How it is drawn

The converter is src/render3d/convert.js (`KIT_LOOK.ramparts`, `rampartGround`, `rampartsDress`, `RAMP_3D`); the
builder is tools/render3d/world.js (`buildTavern`'s rampart pieces).

- **The ground** (`rampartGround`): behind a terrace (north or west of it) up to four tiles of the town's street, a step
  down; in front (south, east) a parapet a step over the floor; past that the drop. A tile with a terrace within five
  tiles to its north or west is in front of it, so no house stands there whatever lies behind it: a house between the
  camera and a fight would hide it.
- **The houses** (`rampartsDress`): Luminati's own, two storeys, half-timbered or plastered, slate or red roofs, doors to
  the street, four to six tiles wide and shoulder to shoulder along each terrace's back.
- **The parapet:** grey ashlar (`rampart_wall`, `rampart_top`) with low merlons, so a figure at the parapet is never hidden.
- **The towers:** four round towers of the wall standing up out of the drop round the level, crenellated, slate cones.
- Its torches on iron poles, the oven, the parapet and the towers are ours; the houses, stalls, the well, barrels and
  crate stacks are Luminati's.

## 3. The art critic's rounds

| Round | Identity | Building | Dressing | Battle | Light | Materials | Polish | **Overall** |
|---|---|---|---|---|---|---|---|---|
| 1: terraces, the town's houses behind, the parapet, towers, torches, a stall, the oven | 6 | 6 | 5 | 7 | 5 | 6 | 5 | **5.5** |
| 2: the wall's face down into the mist, buttresses, towers behind only, quieter cobbles, a rebuilt oven, signs, more cargo | 6 | 6.5 | 5.5 | 7.5 | 5 | 6 | 5.5 | **6** |

Further rounds are next.
