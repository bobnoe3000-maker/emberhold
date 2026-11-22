# The Shuttered Inn: a building's inside as a dungeon

*2026-11-22 · **Implemented**, scored 9/10 by the art critic against the reference (§3). The site is placed on the Reach at
level 20, across the Kell road from Ashgate's north wall (§4; GDD v1.138). For a preview, `?scene=dungeon&site=shuttered_inn`.*

The owner, 2026-11-22, with a reference picture (a top-down cutaway of a stone tavern: block walls under dark timber, a
notice board, a hearth, long tables, lanterns, shields, cobwebs, iron fire baskets, flagstones, warm firelight):

> "Prototype a dungeon level that looks like the inside of a building.. a tavern. Needs more open floor to accommodate
> NPC battle but the walls are up and set dressing looks great. Use this as a reference image. This is a new dungeon
> type. Set and art critic and keep going until high scores."

## 1. What it is

**Two new kits, `tavern` and `tavern_cellar`.** It is the first dungeon kit that is a building's inside rather than a ruin or a cave. Every
other kit stands its walls ragged and broken down: the walls' ruined tops, GDD v1.98. This one stands them whole.

**The site.** `shuttered_inn` (src/sim/sites.js) is a Reach site at level 20, flat, one floor, no boss, a crew of the
Redhand drinking it dry (the `taproom` family, §4).
- It was a parked trial at 6 in the Vale (world doc v1.58). Since v1.59 it is canon and on the land: §4.

**The plan.** It is in src/sim/plans.js and passes `checkPlan`. It has five rooms, joined by halls 10 wide:

| Room | Role | Size | What's in it |
|---|---|---|---|
| The Front Room | entrance (the way in, the stairs up under their arch) | medium | the bar and the keeper's shelf of bottles, a rug, barrels |
| The Common Room | the fighting hall, the Redhand's crew | large | the hearth in its stone surround, the notice board, three long tables with their benches, firewood, two fire baskets in the back corners |
| The Kitchen | an offshoot | small | the kitchen hearth with the cauldron on its crane, the cook's table, cask racks, the shrine by the west wall, a chest |
| The Snug | a fighting room | medium | two tables by the back wall, the rug in the middle, a chest |
| The Cellar Hall | the end (`tavern_cellar`) | large | rough rubble walls, candles in niches, hams and onions on hooks, cask racks, barrels, crates, a fire basket |

Every room's corners hold a cluster of stores (barrels, sacks, crates), where a doorway allows. The common room and
the snug have a blue rug in their open middles, so red-clad foes keep their outline on it.

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

**What hangs on the walls.**
- A lantern hangs on an iron arm and chain in every other bay, each with its own light.
- The other bays each hold one thing, built big enough to read at a phone's size:
  - a shield (crossed blades behind one in three);
  - a plate shelf with jugs;
  - antlers on a walnut plaque;
  - a peg rail with a green cloak and a hat;
  - the slate of chalked tallies;
  - herbs drying from a pole.
- No item repeats twice running along a wall.
- A long wall's middle bay is a shuttered window:
  - a pale stone surround and a sill board with a candle;
  - one shutter barred shut;
  - the other swung open on the night, a dark hole with two stars, a dim moonlight pool below.
- Now and then a corner bay has a cobweb, and there are bigger webs where two back walls meet.
- A band of grime runs along every back wall's foot.
- A bay where stores stand against the wall gives up its lantern (and the lantern's light).

**The hearth.** The common room's hearth is Luminati's (its fire and light) at its widest, in our stone surround:
- piers and an oak mantel with jugs and pots;
- a lighter chimney breast up through the beam, and a soot-dark stack with a lit cap course;
- a log and embers spilled on the hearthstones.

It is the room's tallest mass and its brightest light. The notice board beside it is 3.4 wide: a lantern either side,
a carved header, notices with red seals, a wanted poster with a charcoal face, and a note pinned by a knife.

**The cellar.** Its own kit, `tavern_cellar`: rough rubble walls in big stones and light mortar, no timber frame,
candles in stone niches, hams and strings of onions on hooks, mostly the worn flag underfoot. The frame follows the
walls' own stone, so a timber run ends at a post where the rubble starts.

**Stone and floor.** The inn's own textures:
- `tavern_wall`: big dressed blocks a course three-quarters of a unit high, in grey-buff stone with dark mortar, one
  in six two courses tall, a few darker, warmer or cooler;
- `tavern_rubble`: the cellar's big rough stones in a light mortar;
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
| The inn's common room | 119 | 192k |
| The inn's front room | 100 | 191k |
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
| 4: hearth surround and apron pool, candles and tankards, the board as centrepiece, the kitchen's pot and table, fewer webs | 8 | 7 | 8 | 7 | 7 | 7 | 7 | **7.5** |
| 5: candles that light tables not figures, a clear apron, embers, dull blades, warm oak wall tops | 8.5 | 7.5 | 8 | 8 | 7.5 | 7 | 8 | **8** |
| 6: chimney breast, shuttered windows, a story in each bay, the cellar's own kit, umber warmth, the board widened | 8.5 | 8 | 8 | 8 | 7.5 | 7 | 7.5 | **8** |
| 7: big-stone rubble, the frame following the stone, a hierarchy of light, the cauldron silhouetted, a blue rug | 8.5 | 8 | 8 | 8.5 | 8 | 7.5 | 8.5 | **8.5** |
| 8: packed corners, the bay items at twice the size, the bar lit, grime at the walls' foot | 9 | 8 | 8.5 | 8.5 | 8 | 7.5 | 8 | **8.5** |
| 9: one shutter open, two-course and darker blocks, the corners clearing their bays, no smoke | 9 | 8 | 8.5 | 8.5 | 8 | 8 | 8 | **8.5** |
| 10: the night a dark hole with stars, the open shutter warm in the candlelight, moonlight dimmed | 9 | 9 | 8.5 | 9 | 9 | 8 | 9 | **9** |

Round 10's verdict: *"Measured against the reference's intent, this is a stone tavern with heavy timber, a hearth as
the anchor, a notice board, long tables with mugs and candles, stocked corners, webs, and warm firelight against cool
shadow. It delivers all of that while keeping the middle of every fighting room open."* Its optional polish was applied
after: a honey-oak shutter face, dimmer moonlight, a warm or cool tint on one block in four. The kitchen's rushes were
dropped, as they couldn't be seen. Tried and taken out: a wisp of chimney smoke, which read as a grey ball.

**Kept out of scope.** These are shared across the game, so the critic was told and they stay:
- the room gates' seal (magenta), a mechanic;
- the loot chest's gold look;
- the Shrine of Might.

## 4. On the Reach, at 20

The owner, 2026-11-22: *"Add it as a location in game with lvl 20 NPCs.. close to town in the overworld near ashgate"*.

**Where.** The inn stands across the Kell road from Ashgate's north wall (src/sim/outdoor.js `REACH.inn`, at 122, 88).
- It is the Reach's own inn piece (`reach_inn_1`), its door facing south.
- A short track runs from the Kell road to its door, with a barrel and a crate at the step.
- It is named on the land ("The Shuttered Inn") and pinned on the region map (assets/maps/minimap-reach.json).
- Its door is about 46 tiles from Ashgate's gate. You come out where you went in, on the track before the door.

The first place tried was east of the gate, on the rise (168, 124 and then 170, 110). From the camera there, the
Forgehall's keep stood in front of the inn and the keep's name sat over its door, so the inn moved across the road. The
visibility check (`node tools/capture/visibility.mjs reach`) has nothing under half in view.

**The foes: the taproom.** Every fighting room is at 20, and the front room is a sanctuary, as every way in is. The
family is its own (src/sim/battle.js `taproom`):
- melee: cutthroats and brutes;
- ranged: a crossbow, or a cutthroat, half and half;
- elite: a brute.

The Redhand's own mix has two crossbows in its ranged slots. At 20, in the inn's open rooms, it wore the right party down
early. The right party here is fighter, rogue and cleric at 20, in gear: `node tools/balance/roomlv.mjs 300 20 20 1,3
<seed> --site shuttered_inn`, waves held before the wipe, or 300 s held:

| Foes | Seeds | Waves | Under 10 | Held 300 s |
|---|---|---|---|---|
| The Redhand (two crossbows) | 8 | 7–13, median 10.5 | 3 | 1 |
| The Assay's `yards` | 3 | 9–12 | 1 | 0 |
| **The taproom** (shipped) | 9 | **11–14, median 12** | **0** | 3 |
| The Cold Seam's goblins, in the inn | 2 | 13–14 | 0 | 2 |
| The Cold Seam itself, at 20 | 9 | 12–14, median 13 | 0 | 8 |

The taproom meets the contract (10+ waves) on every seed. It sits a step harder than the Cold Seam (19–21) beside it,
which suits a house full of armed men. Goblins would have been easier, but no goblin drinks at an inn.

**Tests.** test/tavern.test.mjs:
- the site is on the Reach at 20 and open;
- every room past the way in is at 20, and a wave is the taproom's;
- the door is on the overland under 60 tiles from the gate, the arrival is open ground, and the walk from the town's
  arrival reaches it.

test/worldmap.test.mjs holds the map's pin to the door.

## 5. To review

- The kit used for other buildings' insides.
- The inn at other hours: it holds its evening light whatever the hour, as a dungeon does.
