# Critic pass: the Tidemark (step 9)

**Implemented** (2026-11-27). This pass draws the Tidemark's region boss, the Grace (GDD v1.157, `sim/ring.js`
`GRACE`): her master, her ship, her broadside and her boarders. It also adds the sea past the overland's edges and
the wreckage on the wreckers' beach. Then it reviews the region's kits, Tollhaven, the overland and the people at play
scale, and fixes what the review found. Step 7's pieces (the Cabin, the wreck, the boats at the jetties) are in
[art-critic-pass-tidemark-step7.md](./art-critic-pass-tidemark-step7.md).

Code:
- `tools/actor-lab/`:
  - `variants.json` TB5 `boss_grace`, `bake.json`;
  - `props.js` `gracehat`, `gracecoat`, `sternlantern`, and `coatSkirts` takes a `metal`;
  - `buildkit.js` `graceship`, `wreckage`;
  - `town.json` (tidemark) `tidemark_graceship`, `tidemark_wreckage`, both `nofoot`.
- `src/render/renderer.js`: `the_grace: 'boss_grace'` in `ENEMY_ACTOR`, and a `ringClock` getter.
- `src/render/fx.js`: `boss_grace`'s weapon style (`FX_STYLES`: a cutlass's arc and stab, sea-green sparks).
- `src/render3d/hybrid.js`:
  - `ringOn`: the window that's open, or the fight that's on;
  - `tellsOf` passes a sea tell on, with its key and landing;
  - the boarders' surf.
- `src/render3d/convert.js`:
  - `GRACE_SHIP`, `WRECKAGE`, `MOORED`;
  - the overland's `seaMask`;
  - Tollhaven's crop widened by its deck roads;
  - the deck wins its cell on the Tidemark;
  - the mole kit's floor (`'µ'`).
- `tools/render3d/world.js`:
  - a piece tagged `ring` shows only in its window;
  - `broadside` and `shotFrame`;
  - the `emberSurf` and `emberSurfDrops` presets;
  - `seaAir` (the sea sheet);
  - the `mole_flag` texture.
- `tools/capture/grace.mjs` (new) and `visibility.mjs` (the `tidemark` and `tidemark-town` maps).
- Cards baked (`bake-env.cjs --sets town-tidemark`; `src/sim/envfoot.js` byte for byte the same), the cast rebuilt
  (`models.mjs`), the bundle rebuilt.

Captures, under `tools/capture/out/tidemark-art/`:
- `grace/`: `stand`, `fight`, `broadside` and `boarders`, each at day and at dusk (`node tools/capture/grace.mjs
  --tod day|dusk`);
- `grace-cast/`: the master on the Stage, idle, attack and heavy;
- `sea/`, `wreckers/`: the rig at the ferry, the harbour, the reef and the wreckers' beach;
- `crit/`: the kits' entrances and rooms (the Drowned Mole, the Gull Isles, Highmarch), the overland's places, and
  Tollhaven's square, quay and jetties;
- `mole-after/`, `town-after/`: the same shots after the fixes;
- `people/`: the Tidemark's people on the Stage at play scale;
- `vis/`: the visibility check's JSON and its shots of the subjects under the bar.

## The Grace

**Her master** (`boss_grace`):
- the skeleton warrior, the drowned's sea-green bone;
- a sodden naval coat with tarnished lace, weed off its hem and off his cocked hat;
- a cutlass, and the ship's stern lantern on his belt, lit sea-green.

Round 1 was a dark shape on dark sand at dusk. The coat swatch and lace went lighter, then the hat's felt.

**Her ship** (`graceship`):
- a three-master with rag sails, her gallery and stern lantern ghost-green;
- hove to in the bay south-east of the wreckers' beach at (192, 259), at 0.8 scale, standing on the sea floor (`y: 0`);
- tagged `ring: 'the_grace'`, so it is drawn only while her window is open (`ringOn`, the clock's window, gated on Low
  Water done as the sim gates it) or while her fight is on.

Round 1 put her at (186, 252), too close, aground on the beach. Then she sank: past the level's edge the ground under
her middle was the floor's. Both are fixed.

**The broadside** (a `gaze` tell with `sea: true`):
- Unlike the First Pilgrim's eye-beams, it is drawn as lanes of shot from the sea: a grey-blue lane with a pale edge
  while it winds, a white flash along it on landing.
- At the lane's sea end while it winds: embers glowing, smoke building.
- On landing: a cannonade flash (Luminati's `dragonBlast`) and three smoke puffs rolling out and up for 2.6 s. Then
  three iron balls skip up the lane, a hop every 1.6 units, each lower; each hop throws a splash on the sea or a kick of
  sand on the beach.
- Each broadside is kept by its key for up to 3.2 s after the sim drops the tell, so the smoke and shot play out.

Round 1 (`broadside-day.png` before the fix) showed the lanes, but nothing else: the flash at 1.3 scale, the smoke
at 55 %, the balls 0.11 units across. Fixed:
- the flash at 2.4 with a halo;
- the smoke at 1.6 to 4.2 scale and 80 %;
- the balls at 0.17, a lighter iron, hops 1.4× higher;
- the splashes and kicks nearly twice the size, at 90 %.

At play scale (390 × 844, dpr 1) the flash now reads at the ship's side at +2.0 s and the smoke at +2.15 s. The balls
are still specks, but their splashes along the lane read.

**The boarders** (`sailor` with `boarder: true`): each bursts up out of the surf once, the first frame it's seen
(`emberSurf` white water about the knees falling back, `emberSurfDrops` thrown higher).
- Round 1: unseen. 14 puffs at 0.25 to 0.45, nearly white, at the water's edge against white sand.
- Now: 20 puffs at 0.45 to 0.8 that go blue-grey as they fall, 16 drops, a longer life. At +0.3 s and +0.75 s the
  boarders come up the beach in their own spray (`boarders-day.png`).

**The ring UI:** the Grace's window has a calendar and a Ring panel like the others (`ui/ring.js`, `RINGS`). Nothing
visual was missing, so nothing was added.

## The sea past the edges

**Before:** east and south of the Tidemark's overland stood Luminati's outer scenery: grass and woods to the
horizon, right behind the beach.

**Now** (`seaAir`, for the Tidemark only):
- The sim's sea, sand and pool cells, passed as a mask (`seaMask`), decide which edges are the sea's.
- Past those edges the outer ground is flattened under the water line and the outer trees are dropped (by vertex,
  from their centres).
- A sheet of the deep-water material (its uniforms shared, so it moves with the level's water) runs out 170 units.

Findings on the way:
1. Trunks stood in the sea: whole outer pieces were hidden first, but the merged meshes hold many trees. Fixed by
   collapsing each tree's vertices.
2. A green band south of the ferry: outer ground over the edge's sand and grass tiles, not flattened. Fixed with the
   mask, sand counting as the sea's.
3. A white sheet past the sand: the level's water material reads its shore texture, clamped. Fixed with a copy given a
   one-pixel deep shore.
4. A seam at the level's edge. Fixed with `<=`/`>=` at the bounds.

Left: one lone trunk can show at the north-east corner, where the mask says land.

## The wreckers' beach

`wreckage` (renderer only, `nofoot`, at 1.3 scale, at (173, 257) in the water off the beach, where nobody walks):
- a broken keel, a raking stem;
- straight V ribs standing out of the water;
- a run of planking aft;
- a raft of planks and a cask.

Round 1 was a flat hull that read as a jetty, with its ribs as tori lying flat. Fixed. Round 2 had its stack on the
sand; it moved into the water. Nothing needs a sim footprint: it is all past the sand.

## The kits

**The mole** (the Drowned Mole):
- Finding: its floor was Luminati's blue tile grid, a bathroom's, not a sea wall's.
- Fixed: a new `mole_flag` floor (`'µ'`), worn granite flags in a warm grey (`mole-after/`).

**The hulk** (the Gull Isles; the Cabin in step 7) is fine: ship's walls, hammocks, rope and nets read as a ship's
insides.

**The palace** (Highmarch) is fine: its stone and banners read as the League's hall.

## Tollhaven

Findings:
1. **Its jetties weren't drawn.** They lie in the grid's margin, past the town map's crop, and the 2 × 2 ground vote
   gave their cells to the water. Fixed: the crop widened by the deck roads, and the deck wins its cell on the
   Tidemark (`town-after/town-jetties-*`).
2. **An empty harbour.** Fixed: three skiffs moored along the quay (`MOORED`, the ferry skiff).

The square and the quay read as before.

## The people

At play scale on the Stage (`people/sheet.jpg`), each of the Tidemark's people reads as who they are:
- Hester Quaile, Maren, old Gannet;
- Mistress Fane, Josse Wether;
- the ferryman, the fleet boatman;
- Lucan, Hesk;
- the Grace's master.

Nothing changed in this pass.

## Visibility (docs/level-design-rules.md §1.1)

`node tools/capture/visibility.mjs tidemark tidemark-town --warn`:
- **tidemark-town:** 10 subjects, all in view.
- **tidemark (the overland):** 16 subjects, 3 under the bar. All three are the sim's layout, not the renderer's.
  - `way:lamp_fort` (236.5, 147.5) is 0 % in view and `arrive:lamp_fort` (230.5, 150.5) is 0 %. The fort's wall
    (`outdoor.js` 1320, `put(o, B('wall'), lampfort[0] - 4, lampfort[1] + 4)`, three tiles deep at y 151–153) stands
    between the camera and both. Moving it north of the door, or the door and arrival south of it, would fix both.
  - `way:town` (180.5, 104) is 33 % in view. The middle of Tollhaven's exit box is past the gatehouse, five tiles
    north of the inn (186, 112), which hides it. The hero switches scene at the box's west edge (x 177), so in play
    he isn't seen there. Still, the box's middle could move west, or the subject could be the box's mouth.
