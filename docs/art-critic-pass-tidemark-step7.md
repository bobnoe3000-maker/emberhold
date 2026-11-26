# Critic pass: the Tidemark's step 7 (the Grace, Fane and Josse, the Cabin, the camps, the boats)

**Implemented** (2026-11-26). The art side of the Tidemark's step 7 ([tidemark-plan.md](./tidemark-plan.md), "The build
sheet: the Sister's Cabin, the Chronicle, the side work and the spawn points (step 7)"), world doc v1.74 §3.7. What
was asked for:
- Tollhaven's two new townsfolk, **Mistress Fane** (`npc_fane`) and **Josse Wether** (`npc_josse_wether`), baked as
  Hester's and Ashgate's people are;
- the **Sister's Cabin's way in** on the overland: a set piece, the wreck of *Aurelle's Grace* on her reef;
- a check that the **Cabin's five rooms** and the **Tidemark's four spawn points** draw right (the `reliquary` and the
  `vault_chest` on the hulk kit; the camps' dressing on the Tidemark);
- and, asked for during the pass (the owner: the jetties to the Drowned Mole and the Gull Isles "just stop at a dead
  end"): **a boat waiting** at each, with a boatman in it.

Code:
- `tools/actor-lab/variants.json` N32 (Fane), N33 (Josse), N34 (Gullwick's ferryman), N35 (a Gull Fleet boatman);
  `faces.json` `fane`, `josse_wether`; `bake.json` `npc_fane`, `npc_josse_wether`, `npc_ferryman`,
  `npc_fleet_boatman`; `props.js` `saltbrush`, `saltpot`, `namebook`, `namebookheld`, `handbell`, `sextoncoat`,
  `ferrypole`, `fleetoar` (and `coatSkirts` takes `metal`). Baked with `bake.cjs`; `models.mjs` puts them in
  `assets/models/cast.json`.
- `tools/actor-lab/buildkit.js` `gracewreck`, `ferryboat`, `fleetboat` (and `skiff`); `town.json` `tidemark_wreck`,
  `tidemark_ferry`, `tidemark_fleetboat` (all `nofoot`), baked as cards with `bake-env.cjs --sets town-tidemark`
  (`src/sim/envfoot.js` comes out byte for byte the same).
- `src/render3d/convert.js`: the wreck (`GRACE_OFF`) and the boats (`BOATS`, `BOAT_FLOOR`, a lantern light each, the
  boatmen as `figures`); the reliquary on any inside kit; `HULK_LENT` (the palace's desks and papers in a hulk's cabins);
  the hulk's hammocks and its rope and nets; `SHIP_STORY` (a ship's walls); `cart` and `chains` on the overland; the
  Tidemark's oxblood tent.
- `src/render3d/hybrid.js`: the boatmen stood in their boats each frame (`decor`), idle, keyed, never the sim's.
- `tools/render3d/world.js`: `hammock` in `buildTavern`; a kit piece with `here` sits on the ground under its middle.
- `src/render/gsprite.js` `tent_tidemark`, `src/render/palette.js` `oxblood`.
- The bundle is rebuilt (`node tools/render3d/build.mjs`).

Captures, 390 × 844 at dpr 1 (the rooms at dpr 2), from the game's camera
(`node tools/capture/rig.mjs <shots.json>`, `node tools/capture/stage.mjs --show cast …`), under
`tools/capture/out/tidemark-step7/`:
- `wreck-sheet.png`: the Grace from the door and wide, at day, dusk and night, and as a baked card;
- `cast/sheet.jpg`: Fane, Josse and the two boatmen beside Hester and Old Gannet on the Stage, at play size;
- `cabin-sheet.png`: the Cabin's five rooms (and the Gull Isles' gun deck, the same kit);
- `boats-sheet.png`: both jetties before and after, by day, dusk and night;
- `camps-sheet.png`: the four spawn points, and the Reach's haulers' road before and after;
- `sand-sheet.png`: the drifted sand as shipped, and a margin tried and rejected.

## The people

Scores out of 10, at play size on the Stage beside Hester (`cast/sheet.jpg`): **silhouette** (does it read in shape
alone at 56 px), **palette** (does it sit in Tollhaven's slate, sea-blue and tar and stand off its neighbours) and
**story**.

**Mistress Fane** (N32, the Mage): a mage's tall hat pushed back, the robe in sea-grey, sea-green at the hat's band and
her belt, the robe's hem and cuffs gone white with salt, dark working boots; a paste-brush caked white in her right
hand and a clay pot of wet salt hung from her left. Her face: olive, a hazel eye, freckles, a straight brow, a dry
half-smile.
- Silhouette 8: the only pointed hat in Tollhaven. Hester is bare-headed in a long coat, Gannet stooped under a
  sou'wester, Josse bald.
- Palette 7: grey-green against Hester's harbour blue, Josse's black and Gannet's bottle-green and ochre.
- Story 7: the brush and the pot read at play size as "she paints something", which is her ward. The salt on her hem is
  only a lighter edge at play size; the portrait carries it.

**Josse Wether** (N33, the Rogue): older and a little bent (spine 0.16), cropped grey hair, heavy grey brows and a grey
moustache; a plain black coat to below the knee over a grey linen shirt; the chapel's book of names clutched to his
chest, black boards and pewter corners, its ribbons hanging out of its foot; the chapel's bronze hand-bell in his right
hand.
- Silhouette 8: the book against his chest and the bell at his side.
- Palette 8: the only black figure in the square, the book's white leaves and the bell's bronze its two lights.
- Story 8.

**The boatmen** (decor, not townsfolk). Gullwick's ferryman (N34): an old fisherman, a knitted cap, an ochre oilskin
smock over a blue jersey, a white beard, his quant-pole stood upright. A Gull Fleet boatman (N35): the corsairs'
sea-grey shirt, gull-yellow headscarf and sash, his oar tossed upright, its blade tipped yellow. Each reads as his own
boat's at a glance: an old man of the shore, and the fleet.

### Findings and fixes (the people)

1. **Josse held his book out like Hester's ledger** (round 1): the two read as one silhouette, a figure with a box held
   out on the right. Fixed: the book is worn on his chest (`namebookheld`) and the bell is in his hand.
2. **Fane's hat band read as green eyebrows** (round 1): the Mage's hat sits low on the painted head, and its inner band
   (`[2, 1]`), painted sea-green, lay across her brow. Fixed: that band is the hat's dark grey.
3. **Her head came through the hat** (round 2): the `oblong` head shape is taller than the Mage's hat allows when it is
   pushed back (gear.js `HAT_SET`), and a tan wedge showed above the band. Fixed: the `thin` head, as Hester's.
4. **A salt band at the hem read as a ring on the ground** (Stage round 1). A white band of salt-crust at the very foot
   of her robe was, at play size, a white circle round her feet, like a selection ring. A second try, patches higher on
   the cloth, floated at her boots (the robe's foot is higher than the hips' space suggests). Fixed: no geometry.
   The robe's own hem trim and cuffs (swatch `[4, 0]`, found by painting it red) are a muted salt-white.
5. **Fane's boots read orange** at play size (the Mage's stock tan). Fixed: dark leather (`[3, 2]`).
6. **Josse's crown**: the painted head's crop of grey hair reads as a bald pate with a dot at the crown in the
   portrait. Left: at play size it reads as an old man's thin grey hair, which he is.

## The Grace

Her place: the Cabin's way in is on the east beach at the reef (outdoor.js `TIDEMARK.reef`, the exit 229–233 × 200–206);
the sea begins five tiles east of it, and **the level ends at x 258** (convert.js `MAX_TILES`). So she can't lie out to
sea bow-on: there are only 20 tiles of water.

What she is (buildkit.js `gracewreck`, 26 tiles long, about 7 across): she lies **broadside along the shore**, her
middle 13 tiles east of the reef, her stern and Livia's cabin to the north and her bow to the south. She is heeled over
to seaward (0.44 rad), so her deck faces the camera and her low side is awash, and down a little by the head. Her hull
is weathered brown above the tide line and black-green weed below it (split per triangle at the waterline, in the
sea's frame). Her deck is bleached oak, broken through at the waist where the mainmast came down. The fore and main are
splintered stumps; the main lies over her low side into the sea with its yard and a rag of sail afloat; the mizzen is
snapped and leaning on its stays. Her sterncastle has its own deck and rail, and a gilt band with three dark windows
down her quarter (Livia's cabin), with the stern gallery across her transom. Black weeded rocks run from the beach out
to her landward side, and a ladder hangs down it. She stands whether her door is shut or open, as the Ninth Vault's does.

### Findings and fixes (the Grace)

1. **Round 1, along x, bow to the beach**: at the door she read as **a rowing boat**, short and wide, sitting upright.
   Her bow lay over the beach's edge. Her stern ran off the level (the level's edge at 258 was not known until then).
   Fixed: turned along the shore (round 2), 2.6 kit units long, heeled toward the camera, sunk to her wale on the low side.
2. **Round 2: her deck read as a slate roof**, a cold grey under the sky light, and her sterncastle's dark lid read as
   **a house's roof**. Her gallery windows were lost in the hull's shade. Fixed: the deck is honey oak, bleached
   (`#ae9270`); the sterncastle's top is a deck with a rail; and the quarter windows sit in a gilt band, larger.
3. **At dusk she is a dark shape** with the deck a step lighter (`wreck-sheet.png`). Left as it is: she is a dead ship
   and has no lights. The world's dusk does the same to every kit piece on the water.
4. **The sail's rag barely shows** from the camera. Left: the fallen mast and the yard carry "masts down".
5. **The land past the level's edge is forest** (Luminati's outer scenery: `World.js` scatters trees on an outer ground
   that continues the edge's height and rises into wooded hills: "a cove, never an open sea"). From the reef, and at
   Gullwick's ferry, a band of autumn trees stands across the water where the open sea should be. **Not fixed here**:
   it is Luminati's, for every coast. A follow-up for the art pass (step 9): on the Tidemark's overland, a sea sheet past
   the east and south edges (as `world.js` already lays past a harbour's), and the outer trees dropped there.

## The Cabin's rooms

Shot at each authored space (`at: "part:<id>"`, dpr 2, dusk; `cabin-sheet.png`). The sim's dressing on the floor:
the entrance has braziers, rope, nets and lanterns; the waist has cask racks, barrels and chains; the chapel locker has
the reliquary, a shrine and a chest; the children's deck has bunks, straw, cask racks and barrels; Livia's cabin has
desks, papers, a rug and the vault's chest.

1. **The reliquary drew nothing on the hulk**: it is the palace's piece, and `PALACE_3D` ran on the palace kit alone.
   Fixed: the reliquary draws on any inside kit. In the chapel locker it is the marble stand, the empty cushion, the
   box's lid on the floor and the empty gilt niche. It is lit.
2. **The chests**: the locker's chest and Livia's vault chest both draw, the owner's gold chest look, beside the rug.
3. **Livia's desks were two white-hot blobs**: the clerk's voxel desk card, with its own light, burned out in the lit
   hulk. Fixed: a hulk's cabins borrow the palace's writing tables and chairs, each with its candle and papers on the
   floor (`HULK_LENT`). The west one has the bundle of letters under a paperweight, which in Livia's cabin are Aurelle's.
4. **The children's deck had barracks bunks**, dark two-tier frames, where the world doc has "rows of small hammocks".
   Fixed: on the hulk the sim's `bunk` hangs as a hammock (`hammock` in `buildTavern`): two stanchions, a sailcloth sling
   sagging low on its lanyards, a blanket rolled in it.
5. **Antlers and drying herbs on a ship's side**: the hulk takes the inn's wall stories. Fixed: a hulk's bays carry
   oilskins on pegs, tally slates, plate shelves and the odd shield (`SHIP_STORY`).
6. **Three dark hooded shapes at the reef ladder**, read as foes waiting by the stairs: the wharf's `rope` and `net`
   have no drawer outside the docks' kit, and fell through to nothing better. Fixed: the hulk borrows the wharf's rope
   coils and nets.

Fixes 3 to 6 are the hulk kit's, so the Gull Isles' second floor (the gangway, the gun deck's hammocks "slung between
the guns", the wardroom and the great cabin) has them too. That floor was shot again, and it holds.

**For the sim (not changed here):** the Cabin's five spaces have the same rectangles as the Gull Isles' second floor
(`plans.js`: the gangway 30 × 26 at 0, 0, the gun deck 70 × 22 at 40, 2, and so on). Drawn in the one kit, the two read
as one ship twice. A different footprint for the Grace (narrower and longer, Livia's cabin across the stern) would let
her be her own.

## The spawn points

Shot from 24 tiles off (outside `REACH_WIDE`, 21: inside it a level-1 party is drawn into the fight and falls back to
Tollhaven before the frame), the camp above the hero (`camps-sheet.png`).

1. **`cart` and `chains` stood nowhere outdoors.** Neither was in `OVERLAND_3D` nor in `OVERLAND_OURS`. So the
   wreckers', the marsh's and the kennels' chains and the siege lines' cart were missing. So were the Reach's haulers'
   carts and chains, the Vault's mouth's chains and the Praetory's watch's chains, since v1.68. Fixed: the cart is
   Luminati's (as underground), and the chains are ours, a chained stake. Before and after: the haulers' road.
2. **The outriders' tent was the Vale's** brown cone in Highmarch's fields. Fixed: on the Tidemark a tent is
   `tent_tidemark`, the march's oxblood canvas (only the kennels pitch one).
3. The rest reads:
   - the wreckers' beach: a fire, crates, sacks, bones and a stake on the sand;
   - the salt marsh: two ribcages, a stake and the urns by the water;
   - the kennels: on the field's furrows, as "in the fields" has them;
   - the siege lines at dusk: two braziers under the wall, the cart, spoil and crates.
4. **Left**: nothing at the wreckers' camp says *wreck*. A stripped hull on the sand would have to stand inside the
   camp's arena, where the fight walks through it. That needs a footprint, which is the sim's.

## The drifted sand (v1.156)

Asked by the coordinator: do the sand patches read badly? `sand-sheet.png`:
- As shipped, the drifts are Luminati's sand tile, pale cream, stepped at its two-tile grain like every road and
  field edge. Read from the camera, they look like dune drifts over the turf. They hold at dusk.
- **Tried and rejected**: a margin of Luminati's dry grass where an inland drift meets the turf, the beaches left
  clean. Each drift came out outlined in orange, which was worse. Reverted.

Nothing to change in the ground data.

## The boats (the owner's dead ends)

Before (`boats-sheet.png`), both jetties ended in open water: nothing said "a boat takes you on from here".

After, a boat is moored alongside each jetty's end, placed by the converter from the exits' own coordinates, with no
sim change (`BOATS`):
- **Gullwick's ferry**, off the ferry jetty (her middle at 207.4, 254.5): tarred black-brown, a cream sheer strake,
  red-brown thwarts, her bow south toward the Mole.
- **A Gull Fleet boat**, off the landing jetty (177, 8.8): sea-grey, the fleet's yellow along her sheer and on her
  oars' blades, a yellow pennant at her stern.

Each has its painter made fast to a post on the jetty's edge, and a lantern on a pole with an arm, hung out over her
(it lights at night: a warm pool on the boatman). Her boatman stands in her stern on her floorboards (`air`
`BOAT_FLOOR`), idling, turned toward the jetty and the camera. He is drawn as a figure each frame (hybrid.js `decor`)
and is never a unit of the sim's.

Read at play zoom: by day, a boat with a man standing in her at the jetty's end, which is "a boat is waiting here". At
dusk the boat and man read and the lantern is dark (Luminati lights `nightOnly` lamps after dusk). At night the
lantern's pool marks the spot from across the beach. With the coordinator's labels over them ("The ferry to the Drowned
Mole", "Boats to the Gull Isles"), both read.

## Not done here

- The visibility rule (`tools/capture/visibility.mjs`, level-design-rules.md §1.1) has no `tidemark` map, so it could
  not be run on the Tidemark's ways in. Read by eye instead: the hero stays in full view at the door, at the ferry's end
  and at the Isles' landing in every shot.
