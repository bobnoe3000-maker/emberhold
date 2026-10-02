# The town: layout, walls and gates — review and replan (proposal)

**Proposal, 2026-10-02. Nothing is shipped.** This review looks at the town scene and at Thornwick on the
overland the way an art critic would: the square, the way in, and the town's edge. It proposes a replan
that keeps the square as the menu and gives it more room.

Everything marked *blockout* was built and captured in the real renderer, in a scratch checkout:
- `buildTown` and the overland's Thornwick re-laid;
- three rough wall pieces made in the buildkit (a curtain run, a drum tower, a gatehouse) and baked.

The pieces are stand-ins for the art, not the art. The layout's numbers are the part to judge.

## How it was measured

- **Plans:** every structure's footprint from `src/sim/envfoot.js`, drawn in screen orientation (iso,
  the camera's way round) for the town and for the overland around Thornwick.
- **Walk-ins:** in-game captures on the manual clock at 390 × 844, DPR 2. The overland road up to the gate,
  then the town scene from the arrival to the square.
- **The square at the menu:** the hub framing with the HUD and the services bar on, by day and by night.
- **Numbers:** these come from the layout, not from the pictures.
  - **The gaps between services:** the nearest distance from one footprint to another.
  - **Paving under buildings:** how much of the square's paving the footprints cover.
  - **Open paving in the hub frame:** the paved tiles inside the part of the frame you can see, between
    the HUD and the menu bar. That's ±25 tiles of *x − y* across, and from 93 above to 60 below the focus
    in *x + y*.
  - **Each service's screen offset** from the focus.

## What's wrong (ranked)

![The town's plan now, and the proposed plan](img/town/plan.jpg)

*Plans in screen orientation (the top of the image is the top of the screen). Red: the five services.
Grey: wall pieces and rocks. Yellow dots: arrivals. Orange box: the way out to the overland.*

1. **The town starts nowhere.** There is no edge, no wall and no gate in the town scene: 0 wall pieces.
   You arrive among five houses and two farms, cross a bridge, and walk **86 tiles of open road** to the
   square. Nothing on the way says you've entered a town. The houses (all six of them) stand *outside*
   the place they belong to, in a clump by the bridge. The farms and fields are mixed in among them,
   in front of the square.
2. **The square is crammed into one corner.**
   - The five services stand in the north-west half of a round plaza. The nearest gaps are 4.4 tiles
     (temple to inn), 6.9 (shop to tavern) and 9.0 (inn to tavern), where a building is about 13 tiles
     across.
   - The temple and the inn aren't on the square at all: they stand behind the shop and the tavern,
     **35 tiles from the well**.
   - Buildings cover 19 % of the paving. The round plaza is about as wide as the portrait frame, so it
     reads as a disc of paving the buildings sit on, not a square they face.
3. **On the overland, Thornwick is a gatehouse standing in a field.**
   - It's one gate piece with two stubs of wall, enclosing nothing, with the temple and a tall keep tower
     just behind it and houses on either side.
   - It says "walled town" from far off and "no walls" when you arrive, because the town scene has none.
     The two scenes contradict each other.
4. **There's no axis.** The road, the bridge, the square and the temple don't line up, so the eye has
   nowhere to go. On a phone, a single way in that ends on a landmark is the strongest composition
   available: it tells you where the heart of the town is before you reach it.

![The way in now, and in the blockout](img/town/approach.jpg)

## The replan

### Rules for a town seen this way

1. **The frame is narrow and deep.** The portrait frame shows about 50 units of *x − y* across (25 tiles
   of a square's side) but about 150 units of *x + y* between the HUD and the menu bar.
   - So extra spacing has to go into **depth**, not width.
   - The services stagger left and right as they go down the frame.
   - Each sits within ±17 units of the centre, so its plaque fits on screen.
2. **Tall at the back, low at the front.** The camera looks from +x+y.
   - The town's back walls (north and west) show their inner faces as a backdrop behind the town.
   - The front walls (east and south) stand in front of it and occlude, so they're kept far from the
     square, where the menu bar covers them.
   - The houses sit at the back, with gardens and orchards at the front.
3. **A town has an edge, and the country stays outside it.** A wall circuit, one gate on the road, and
   the farms and fields outside the wall.
4. **One axis:** bridge → gate → high street → market → temple.

### The plan (blockout)

| What | Where (tiles) | Note |
|---|---|---|
| **Wall circuit** | x 10–112, y 8–108 | 8 drum towers (the corners and mid-runs), curtain between, one gatehouse. 28 pieces |
| **Gate** | east wall, y 75 | Faces the road. The moat-stream runs under the east wall, and the bridge lands straight at the gate |
| **High street** | cobbled, x 112 → 80 along y 75 | One house on its north side. The shop stands at its head, on the market's corner |
| **Market** | centre (65, 64), 30 × 42 cobbled | The well and the Watch table in the middle |
| **Temple** | (35, 35), the head of the market | A small forecourt, open to the market; the churchyard's trees behind it |
| **Tavern / Inn** | (48, 64) left / (58, 42) right | The upper pair |
| **Smithy / Shop** | (70, 86) left / (81, 65) right | The lower pair, at the foot where the high street comes in |
| **Houses** | the north-east and west quarters, against the back walls | Backdrop, out of the services' way |
| **Outside** | farms, fields and the stream east of the wall | The country |

The services keep the GDD's rule: **the same five buildings in the same places in every town**. Their
places change once, here:

| | Left | Centre | Right |
|---|---|---|---|
| Head | | Temple | |
| Upper | Tavern | | Inn |
| Middle | | Well (the Watch) | |
| Foot | Smithy | (the high street comes in) | Shop |

### The way in (blockout)

From the overland you arrive east of the stream.
1. **The arrival.** The wall and its towers fill the top of the frame. The gate is at the left edge, and
   one step brings it in.
2. **The bridge.** It lands at the gate, between two drum towers with their lanterns lit.
3. **The gate.** You pass under the arch.
4. **Inside.** The high street runs up to the market, with the shop's red awning at its head.
5. **The market.** The camera settles on the square, and the temple closes the view.

That's 30 tiles from the arrival to the gate and 32 tiles of street, where there were 86 tiles of open
road.

![The gate by day and by night (blockout pieces)](img/town/gate.jpg)

*The prototype gatehouse at in-game size: two drum towers on the outer face, an arched way through with
the portcullis up, a lantern each side, the town's banner. The curtain wall runs off either side.*

### The square at the menu (blockout)

![The square at the menu: now, the blockout, the blockout at night](img/town/square.jpg)

The square at the menu now has room: a cobbled market, the well in the middle, and every service
standing at its edge with clear ground between them. The temple stands where the eye ends, at the head
of the market, in its churchyard trees. The south wall sits under the menu bar.

### Thornwick on the overland (blockout)

![Thornwick on the overland, now and in the blockout](img/town/overland.jpg)

![Thornwick on the overland, plans](img/town/overland-plan.jpg)

The same pieces make the same town in miniature: a box of curtain and drum towers (38 × 44 tiles), the
gatehouse on the east wall facing its road, the temple's spire and four roofs inside. It stands where
the old gate stood, so the road, the exit and the arrival don't move.
- **The tall keep tower is gone.** It wasn't Thornwick's: Wickham Keep is its own site.
- **The road west through the town is gone.** It led off the map. If it should stay, it can skirt the
  south wall instead.

### All four towns

Every region's town is built by the same `buildTown`, so Saltmere, Ashgate and Frosthold get the same
circuit and square. The wall pieces are baked in each region's tones, like every other town building.
Stone walls in every region are the simplest choice. A timber palisade for Saltmere (the buildkit
already has a palisade look) is a possible variant.

## Before → after

| Measure | Now | Blockout |
|---|---|---|
| Nearest gap between two services | 4.4 tiles (temple–inn) | 8.1 (temple–inn) |
| Pairs of services closer than 8 tiles | 2 | 0 |
| Open paving in the hub frame | 939 tiles | 1050 (+12 %) |
| Paving under buildings | 19 % | 18 % |
| Inn: distance from the well to its nearest edge | 35.5 tiles (off the square) | 16.9 (on it) |
| Temple: distance from the well to its nearest edge | 34.7 (behind the shop) | 31.4 (at the head of the market, its forecourt joined) |
| Service plaques inside the hub frame | 5 of 5 | 5 of 5 |
| Wall, tower and gate pieces in the town scene | 0 | 28 |
| Open road between the arrival and the town | 86 tiles, no edge | 30 tiles to the gate, then 32 of street |
| Thornwick on the overland | a gatehouse in a field | a closed circuit, the gate on its road |

## Still wrong in the blockout

1. **The inn's plaque sits under the compass and journal buttons.** They stand on the right edge, at the
   plaque's height.
   - **Options:** clamp plaques clear of the HUD's buttons, or swap the upper pair (inn left, tavern
     right): the left edge has no buttons there.
2. **The smithy's plaque lies on Hedda's name.** The townsfolk's spots move with the services, but they
   need re-authoring against browser test 15d (≤ 5 % hidden).
3. **At the arrival, the gate is at the frame's left edge.** One step brings it in. A camera lead while
   on the approach road would frame the gate on arrival, the way the hub's focus eases onto the square.
4. **The pieces are stand-ins.** The final pieces need work:
   - the curtain is long and plain (it wants buttresses, a weathered course, a patch or two);
   - the arch is small and dark;
   - the gatehouse's inner face is bare.
5. **The high street's south side is empty grass and garden.** That's on purpose: anything tall there
   would stand in front of the street. But it wants low dressing (a fence, a cart, a stall).

## What it would take

1. **Canon (the world doc first):** whether Thornwick is walled. Today canon only calls **Greyholt** "the
   walled market town" (§3.1); Thornwick isn't described either way. See the decisions below.
2. **Art (buildkit + `town.json`):**
   - **New pieces:** curtain, curtain turned (y), drum tower, gatehouse, gatehouse turned (y), for four
     regions: 20 sprites.
   - **Bake:** `node tools/actor-lab/bake-env.cjs` regenerates the atlases and `src/sim/envfoot.js`.
   - **Measured cost:** each region's town atlases grow from 0.68 to 0.91 MB (+34 %), +0.92 MB for all
     four. The old `wally` piece can go once the overland stops using it.
3. **Sim (`src/sim/outdoor.js`):**
   - `buildTown`: positions, the circuit, the cobbled high street, the market;
   - `o.hub`, `o.arrivals`, `o.exits`;
   - the overland's Thornwick;
   - the tree scatter: nothing on the walls' verge, orchards inside, woods beyond the back walls.
   - **Saves:** no save change. The layout is a pure function of the seed. A town position saved in the
     old layout that falls inside a wall or building already moves to the spawn on load
     (`core.js:581`), and anywhere else outside the walls is simply outside them.
4. **People (`src/sim/npcs.js`):** re-author the spots, then run test 15d and the town tests (`act1`,
   `bag`, `battle`, `npcs`, `travel`).
5. **Camera and UI:**
   - the hub focus;
   - plaques kept clear of the HUD buttons;
   - optionally, the approach lead.
6. **Tests (new):**
   - the circuit is closed: a flood fill from the market reaches the way out only through the gate;
   - every service's plaque sits inside the hub frame;
   - no two services are closer than 8 tiles.
7. **Docs:**
   - the GDD's town section (§10): the square's new table, and the approach (houses inside the walls,
     farms outside);
   - an art critic pass with the shipped before and after;
   - this proposal marked Implemented.

## Decisions for you

1. **The layout:** the walled circuit, the bridge into the gate, the high street, the market with the
   temple at its head. **Recommended.**
2. **Thornwick's wall in canon:**
   - **(a) A stone circuit, as blocked out.** *Recommended*, with one line in the world doc that the
     wall is older than the town: an imperial waystation's wall that Thornwick grew inside and patches
     when it can. That's "history found, not told", and it fits the Vale's legion ruins. Greyholt stays
     the *market* town with the lord in it.
   - **(b) A lesser edge:** a ditch and a timber palisade, with only the gatehouse in stone. It keeps
     stone walls for Greyholt, but it reads less as "town" from the overland.
3. **Every region the same, or a Saltmere palisade.** Stone everywhere is simpler.
4. **The upper pair's sides:** keep the tavern left and the inn right (and clamp the plaques), or swap
   them (no clamp needed).
5. **The camera lead on the approach:** yes or no.
6. **The overland road west through Thornwick:** drop it (the blockout), or route it round the south wall.
