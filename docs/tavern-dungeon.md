# The Shuttered Inn: a building's inside as a dungeon

*2026-11-22 · **Prototype, for the owner's review.** The site is parked: it is on no land, and you reach it with
`?scene=dungeon&site=shuttered_inn`.*

The owner, 2026-11-22, with a reference picture (a top-down cutaway of a stone tavern: block walls under dark timber, a
notice board, a hearth, long tables, lanterns, shields, cobwebs, iron fire baskets, flagstones, warm firelight):

> "Prototype a dungeon level that looks like the inside of a building.. a tavern. Needs more open floor to accommodate
> NPC battle but the walls are up and set dressing looks great. Use this as a reference image. This is a new dungeon
> type. Set and art critic and keep going until high scores."

## 1. What it is

**A new kit, `tavern`.** It is the first dungeon kit that is a building's inside rather than a ruin or a cave. Every
other kit stands its walls ragged and broken down: the walls' ruined tops, GDD v1.98. This one stands them whole.

**The site.** `shuttered_inn` (src/sim/sites.js) is a Vale site at level 6, flat, one floor, the Redhand drinking it dry.
- It is parked, the way the Proving Pens' trial was: on no land, no way in, no band.
- Canon: world doc v1.58, "a trial, not canon".

**The plan.** It is in src/sim/plans.js and passes `checkPlan`. It has five rooms, joined by halls 10 wide:

| Room | Role | Size | What's in it |
|---|---|---|---|
| The Front Room | entrance (the way in, the stairs up under their arch) | medium | the bar and the keeper's shelf of bottles, a rug, barrels |
| The Common Room | the fighting hall, the Redhand | large | the hearth in its stone surround, the notice board, three long tables with their benches, firewood, two fire baskets in the back corners |
| The Kitchen | an offshoot | small | the kitchen hearth with the pot on, the cook's table, cask racks, sacks, the shrine, a chest |
| The Snug | a fighting room | medium | two tables by the back wall, the rug in the middle, a chest |
| The Cellar Hall | the end | large | cask racks along the back wall, barrels, crates, a fire basket |

**Open floor for the fights (the owner's first ask).** Every piece stands to a wall or in a corner, and the fighting
rooms' middles stay open:
- The test (test/tavern.test.mjs) holds every fighting room to no blocking piece in its middle 80 % on every seed.
- It also holds each room to under a fifth of its floor in furniture.
- Each piece blocks the floor it covers at the inn's scale (below), so a foe never walks through a hearth's back or a
  table's end.
- Keep-clear (src/sim/keepclear.js) holds as everywhere: nothing on the stairs or in a doorway, and a light only by a
  wall.

## 2. How it is drawn

The converter is src/render3d/convert.js (`KIT_LOOK.tavern`, `tavernWalls`, `tavernDress`, `TAVERN_3D`). The builder is
tools/render3d/world.js (`buildTavern`, the inn's textures). Both are built into src/vendor/luminati-80e1aa6/.

**Walls up.**
- `tavernWalls` replaces the ruin for a kit marked `inside`.
- The back walls (the faces the camera sees) stand whole at level 8: three units over the floor, a storey and a half,
  square-topped and capped in dark oak.
- The near walls (between the camera and the room) are cut to a clean sill at level 3. That is the cutaway of a doll's
  house, so a fight is never behind one.
- A wall with floor on its camera side too stays low.

**The timber frame.** Along every run of back wall:
- an oak post at each end and every four tiles;
- a beam along the top and a rail at the dado;
- knee braces up to the beam on the inner posts;
- a joist's end jutting into the room at each post (the floor above).

**What hangs on the walls.** Between the posts, by a hash of the bay:
- shields, round, painted, rimmed and bossed, with crossed blades behind every other one;
- lanterns on iron arms and chains, each with its own small light;
- now and then, near a corner, a cobweb.

There are bigger webs in the high corners where two back walls meet.

**Stone and floor.** The inn's own textures:
- `tavern_wall`: big dressed blocks a course three-quarters of a unit high, in grey-buff stone with dark mortar;
- `tavern_flag`: cut slabs in running courses, two depths of course, each slab its own length and shade, chipped
  corners, the odd crack;
- `tavern_flag_worn`: a sooted second flag, about one tile in seven, in the same layout so the joints meet;
- `tavern_cap`: the dark oak of the wall tops.

**The furniture.** It is Luminati's own interiors (the table, bench, counter, shelf, barrel), built at the inn's scale.
- Luminati builds them for its own folk, and our figures stand half again as tall (the 3× models). At Luminati's size a
  long table read smaller than a figure's ring (critic, round 1).
- So the tables and benches are built at 1.6×, and the bar and its shelf at 1.45×. The sim's footprints are sized to
  match.
- They are merged with the frame a material at a time.
- Ours on top: tankards in wood and pewter, a candle in its dish on each table, the notice board (a timber frame and
  header, notices pinned askew, red seals), the log stacks, the cask racks (two casks on a cradle, a third laid on
  them), and the common room's hearth surround (stone piers to the beam, an oak mantel with jugs and pots).
- Luminati's own objects: the hearth (its fire and light), the rug, the fire baskets (a pedestal and an iron bowl), the
  wall torches, barrels, crates and sacks.

**The light.**
- A building's inside has its own fill (`ambientOf`: `INSIDE_FILL`). It is a lit room's warm grey rather than a cellar's
  violet, and readable from wall to wall.
- The lamps are ×1.9: the light pools against a cooler fill (critic, round 1).
- Pools come from the hearth's apron, the corner baskets, each lantern, each table's candle, and the two lanterns
  flanking the notice board.
- A doorway's lamp by a sill is its light alone. A flame on a pole there read as floating.

**Cost.** One draw a material for the whole inn's dressing, however many tables. Counted at the WebGL context, a frame
in the fighting room on the manual clock:

| Room | Draws | Triangles |
|---|---|---|
| The inn's common room | 117 | 178k |
| The inn's front room | 92 | 177k |
| The Old Barrows' largest room | 102 | 230k |
| Wickham Keep's largest room | 116 | 211k |

## 3. The art critic's rounds

An independent art-director critic scored each round against the reference. It scored seven areas out of 10 and gave
at most ten fixes, most impactful first. The captures are phone frames, 390 × 844, the game's camera, a fight on.

| Round | Identity | Building | Dressing | Battle | Light | Materials | Polish | **Overall** |
|---|---|---|---|---|---|---|---|---|
| 1: first look (walls, frame, Luminati's furniture at its own size) | 5 | 6 | 4 | 6 | 4 | 5 | 5 | **5** |
| 2: furniture at the inn's scale, big flags, cooler fill and stronger lamps, braces and joists | 7 | 6.5 | 6.5 | 7 | 5.5 | 5 | 6 | **6** |
| 3: cut slabs, baskets in the back corners, lantern lights, a clear hearth apron, the snug's tables to the wall, cask racks | 7.5 | 7 | 7 | 7.5 | 6.5 | 7 | 6.5 | **7** |
| 4: hearth surround and apron pool, candles and tankards, the board as centrepiece, the kitchen's pot and table, fewer webs | (below) | | | | | | | |

**Kept out of scope.** These are shared across the game, so the critic was told and they stay:
- the room gates' seal (magenta), a mechanic;
- the loot chest's gold look;
- the Shrine of Might.

## 4. To review

- Whether the owner wants the inn placed on a land, given a road and a story, or the kit used for other buildings'
  insides.
- The inn at other hours: it holds its evening light whatever the hour, as a dungeon does.
