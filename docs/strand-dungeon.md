# The coast's kits: the strand, the sea cave, the sea fort

*2026-11-27 · **Implemented** (track 3 of [dungeon-looks-plan.md](./dungeon-looks-plan.md), item 7). The critic's rounds
are in [art-critic-pass-tidemark-coast.md](./art-critic-pass-tidemark-coast.md).*

The owner, 2026-11-27:

> "Tidemark needs to be more beachy, including the dungeons.. sea caves and docks like you have now"

## 1. What it is

Three looks for the Tidemark's dungeons, built as the docks and the ramparts are: our own textures in
`tools/render3d/world.js`, our own trim built in one batch (`buildTavern`'s coast pieces, `coastPiece`), Luminati's
water, rocks and lamps where it has them. A floor with any of them in it is a **coast floor**: it is laid out room by
room, each room's ground round it in its own kind, and the sea past it all at the harbour's level (`DOCK_WL`), out into
the mist past the level's edges.

| Kit (sim id) | What it is | Where |
|---|---|---|
| `strand` (new) | The shore itself, open air, no walls. Dry sand, wet sand in a band toward the sea, the tide line's wrack and driftwood; dunes with marram and rock outcrops behind (north and west, the side the camera looks across to); the sea in front with the surf a hand off the sand, two tiles of shallows over a sand bed, then the deep. Rock pools by the outcrops. Boats drawn up on the sand. | The Gull Isles' boat landing and careening beach; the Sister's Cabin's reef |
| `seacave` (its look new) | Wet black rock walls (the ruin pass breaks the near side down, so the sea shows past a low rim), barnacles and weed in a band at the tide line, kelp heaped and wreck timbers washed up at their feet; a floor of shingle with wet sand in broad drifts; tide pools in the hollows along the back walls; a shaft of cold light down a blowhole in each fighting cave; the isle's rock over it with turf and marram on its crown; lanterns on posts, warm against a cold sea fill. | The Gull Isles' stores, strongroom and long gallery; the Lamp Fort's sea cave and magazine |
| `fortwall` (new) | A sea fort's walk: the fort's grey ashlar walls standing whole behind it, a crenellated parapet at its front, a band of rocks under the parapet with the surf on them, the sea. Torches on poles, the ramparts' cargo; the lamp room's lamp a granite drum with an iron cage, lit. | The Lamp Fort's curtain walk and lamp room |
| `docks` (kept) | The wharf's decks over the sea, as the Drowned Mole's; on a coast floor its edges, piles and rails where they meet the sea. | The Lamp Fort's water gate |

A hall takes the kind of the room nearest it along the floor (a cave mouth opens onto the beach).

## 2. The sim

- `src/sim/world.js`: `strand` and `fortwall` in `DRESS`, `PLAN_OB`, `DOOR_LIGHT` and `PLAN_THEME`. The strand is the sea
  cave's in every rule but its one piece out on the floor (a boulder, where the cave stood a stalagmite); the sea fort is
  the ramparts' in every rule, so its rooms fight as they did. No new pieces, no new caps.
- `src/sim/plans.js`:
  - **the Gull Isles**, floor 1: the boat landing and the careening beach on `strand`, the three rooms between them
    `seacave`;
  - **the Lamp Fort**: down off its headland and up from the sea. The fleet holds the land gate, so Gannet takes the
    company down the cliff stair from the tower's foot to **the Water Gate** (`the_fort_gate`, the entrance, `docks`: the
    fort's landing stage), then **the Sea Cave** (`the_sea_cave`, new: the yard is gone into it) and **the Magazine** cut
    into its rock (`seacave`), then **the Curtain Walk** and **the Lamp Room** (`fortwall`), the lamp room still its end
    and its vault;
  - **the Sister's Cabin**: its entrance, the reef (`the_reef_ladder`), on `strand`; the hull's four rooms `hulk`.
  - Every site keeps its level band, bosses, chests and keepsakes, and its entrance is still where the person who sends
    you stands (Gannet at the Lamp Fort's). `checkPlan` passes.
- `src/sim/outdoor.js` `SHORE`: the Tidemark's overland gains three fishing huts (one on Gullwick's strand by the ferry
  jetty, two down the east beach), four boats drawn up and two net racks. A fixed list, no draw: each stands only where its
  whole footprint is open sand, clear of a spawn point's arena, every way in and every arrival, and holds its tiles as a
  building does (`o.shore`, the renderer's to draw).

## 3. How it is drawn

The converter is `src/render3d/convert.js`; the builder `tools/render3d/world.js`.

- **Looks:** `KIT_LOOK.seacave`, `.strand`, `.fortwall` (`coast`: 'cave', 'strand', 'fort'; a cold sea fill, `SEA_FILL`,
  the strand's warmer, `STRAND_FILL`; `ambientOf` takes a coast kit's `fill` as an inside kit's).
- **The ground:** `coastGround` (the halls' looks by the nearest room; each tile off the floor by its distance and the room
  it's nearest: dunes and outcrops, the isle's rock and turf, the fort's walls and parapet, the sea; the shallows; the
  strand's wet and dry sand, the cave's shingle and drifts, the tide pools). A coast floor's level runs 8 of ours past its
  rooms, and past that the level's own water goes on as a sheet in its material (world.js `harbourmist` with `coast`, as
  the overland's `seaAir` sheet: at a 2-tile margin the camera saw a flat plane of mist where the sea stopped; at 28 the
  sea in tiles cost a third of the floor's triangles). Its water `COAST_WATER` (no glints: they read as a field of stars).
- **The dressing:** `coastDress` (the mist, the decks' edges through `docksDress`'s new `only`, the surf, the fort's
  merlons, marram, boulders, the wrack and driftwood, the tide line, kelp, wreck timbers, the blowholes' light and dust);
  `coastProp` (each of the sim's pieces by the room it stands in: the decks' as the wharf's, the fort's as the ramparts',
  the strand's and the cave's lamps on posts, cargo, rope and nets as the wharf's, boats drawn up on the sand).
- **The pieces** (world.js `coastPiece`): `surf`, `marram`, `wrack`, `driftwood`, `tideline`, `kelp`, `wreckwood`,
  `blowhole`, `beachboat`, `rockpool`, `beacon`, `netrack`. `coastAir` sets the sea's colours (a cold slate-green, foam
  at the shore).
- **The legend** (ours, painted in world.js): `'Σ'` the sea cave's wall (`sea_rock` under `sea_rock_top`), `'Ξ'` an
  outcrop or the isle's rock, `'Π'` shingle (`sea_shingle`), `'Δ'` dry sand (`strand_sand`), `'Λ'` wet sand (`wet_sand`),
  `'Φ'` a dune (`dune_sand`), `'Ψ'` a dune you walk on (the overland's), `'Ω'` a rock pool (`pool_bed` under a skin of
  water, walked through at the floor's height: `waterDepth` 0.05), `'Γ'` the sea over wet sand.
- **The overland** (`shoreLand`): the sim's huts (Luminati's house, tarred planks under thatch), boats and nets; over the
  sand the renderer's own wet sand where the sea washes it, dunes where the shore meets the grass with marram on them,
  wrack and driftwood on the tide line, a rock pool by a rock down the east beach, the surf a hand off every beach. None of
  it within reach of a way in, an arrival or a spawn point's ground.

## 4. Water inside walls

The sea cave's tide pools are the water track's (`docs/water-indoors.md`): the sim's `pools` in its fighting caves (the
Gull Isles' stores and long gallery, the Lamp Fort's sea cave), drawn as its sheet a hand over the floor, the kit's
`wet: 'sea'` (world.js `WET_LOOKS.sea`: the sea's cold slate-green, a pale line at its edge; `coastAir` sets the sea round
the floor after the sheet's `wetAir`). The strand's rock pools by its outcrops are still `'Ω'` (Luminati water 0.05 deep
over a rock-pool bed, walked through at the floor's height), and its `puddle` pieces (the `weed` and `drips` recipes) a
flat `rockpool` trim.
