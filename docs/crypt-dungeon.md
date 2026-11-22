# The Haddow Crypt: a crypt's inside as a dungeon

*2026-11-22 · **Prototype, in progress**: art critic rounds under way (§3). The site is parked: it is on no land, and you
reach it with `?scene=dungeon&site=haddow_crypt`.*

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

In progress.
