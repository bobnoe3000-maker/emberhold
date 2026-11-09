# The Vale's landmarks: the dungeon doors to the new art standard (a proposal)

**Status: Proposed (2026-11-10), with a spike** (`?landmarks=3d`; the game is unchanged without it). The owner: *"phone
performance and looks are good. Let's continue to focus on the MVP with the Thornwick map, so we can extend the same
standards and criteria (world assets like trees, relative placements, dungeon entrances/art, etc.) to other maps. First,
the entrances to the dungeons dont look good and are not up to the new art standards (old barrow, keep, sunken chapel) -
propose updated art for these buildings."* Then, seeing the spike: *"the old design for the Keep actually looks OK - can
we keep this, and are those tile assets re-usable for our overall asset catalogue?"*

![Before and after, day and dusk](img/landmarks/entrances-before-after.jpg)

*Left: the game as it is. Right: the spike. The Keep is our own kit's model stood in 3D. The Barrows and the Chapel are
first passes at new designs. Captured in the game on the manual clock (`tools/capture/rig.mjs … --query landmarks=3d`).*

## 1. What's wrong now

All three doors are **our baked sprites stood up as flat cards** in Luminati's 3D world (`convert.js` keeps what Luminati
has no match for as a sprite). Next to Thornwick's houses, which Luminati builds in 3D, they show four problems:

- **No light.** The world's sun and lamps don't touch them: no warm side and shaded side at dusk, and no shadow on the ground.
- **The wrong grain.** Their pixels are Emberlit's, at another scale from the textures round them.
- **The Old Barrows reads as a hut:** a green dome with a plank shed for a door.
- **The Sunken Chapel reads as a dark lump.** It isn't sunken or half swallowed: just two puddles.

The Keep's design is right (the owner); what's wrong with it is only that it's a card.

## 2. The finding: the catalogue is already code, and it stands in 3D

Every piece the converter keeps as a sprite is a model built in code by our own building kit,
**`tools/actor-lab/buildkit.js`** (three.js, the same library Luminati draws with), and baked to a sprite by
`bake-env.cjs`. In the Vale that means:
- the Keep;
- the Barrows (`barrow`) and the Chapel ruin (`chapelruin`);
- the mine, the lumber mill, the Tithe Mill and the milestone;
- Thornwick's palisade, towers and gatehouse.

Every other region's town set is the same kind of model, in its own style (`town.json`: `vale`, `fens`, `reach`, `heights`).

**So the same model can stand in Luminati's world as itself.** The spike does this for the Keep:
`makeBuilding('keep', 'vale')` is scaled to Luminati's units (one kit unit is ten of our tiles, five of Luminati's) and
added to the scene with shadows on. That gives the same design (turrets, conical caps, crenels, banner, door, lit
windows) lit by the dusk sun, with its shadow on the grass: **952 triangles** (its 65 meshes merge to about 8 draws).

**To the owner's question: yes, the assets are reusable, as one catalogue.**
- **One model per piece**, in code, in one place (`buildkit.js`).
- **Many uses:** the 3D piece in the world, its baked sprite for anything 2D, every region's variant by style, and any
  map that places the id (`convert.js`).
- **Better for the standard:** a fix to a model fixes it everywhere. A new map's landmark is a new kit model, not a new
  drawing.

## 3. The landmark standard (for the Vale first, then every map)

1. **Built in 3D, never a card.** It takes the world's sun, lamps and shadows. It is a kit model (`buildkit.js`) stood
   in the world. Luminati's own builders (houses, trees, wells, bridges) stay where they're used.
2. **At the people's scale.** A figure stands 1.75 units. A door is 1.2–1.4× a figure. A landmark reads as itself at
   the game's camera on a phone (390 × 844).
3. **The door reads as a way down:** a dark opening with depth, on the side the sim's exit is. A lit marker (a lantern
   or torch) shows it at dusk and by night.
4. **The lore in the silhouette** (the world doc): the Legion's crypt, the Redhand's keep, the drowned chapel. The
   people who use it now show in the dressing: the dig, the camp, Tobin's lantern, Hester's bees.
5. **On the sim's footprint.** `envfoot.js` and the exits don't move, so nothing the sim walks, fights in or replays
   changes (no balance or save impact).
6. **The Vale's palette:** dusky, mossed, weathered stone and dark timber, graded as the bake grades it (gain,
   desaturation, tint from `town.json` / `env.json`).
7. **On a phone's budget:** under about 1,500 triangles and about 10 draw calls a landmark (merged by material). The
   spike's three are 774–981 triangles.
8. **Checked at dawn, day, dusk and night**, on a contact sheet before and after, with a critic pass (the art critic
   docs' format).

## 4. The three doors

### Wickham Keep: keep the design (the owner)
- **Spike:** the kit's own keep model, stood in 3D in place of its sprite.
- **To do:**
  - merge its meshes by material;
  - grade it as its bake is (gain 0.7, desaturation 0.12, the warm tint);
  - lit torches at the door (Luminati's wall torch, so it lights the ground at dusk);
  - optionally the Redhand's touches: fallen stones at a broken corner, their cloth.

### The Old Barrows: a new design, a long barrow
- **The design:**
  - a long, low barrow of the Third Legion's dead, turfed over, with kerbstones round its foot;
  - a portal of three rough megaliths (two uprights and a lintel), the Legion's shield cut in the lintel;
  - a dry-stone forecourt curving back into the mound;
  - the passage going down, dark;
  - the Redhand's dig at the door (shoring, a spoil heap, planks over the mud, their tent and fire);
  - Tobin's lantern on its post, lit at dusk.
- **Spike:** `tools/render3d/landmarks.js` `barrow` (774 triangles). The mound, kerb, portal, shoring, spoil and
  lantern are there.
- **To do:**
  - rough stone for the megaliths (the spike's well stone reads as brick);
  - the mound longer and lower;
  - the shield on the lintel;
  - the Redhand's tent;
  - author it **in `buildkit.js`** as the barrow's new model, so its sprite and its 3D piece are one model.

### The Sunken Chapel: a new design, half swallowed
- **The design:**
  - an imperial chapel standing in black marsh water to its sills and leaning;
  - the near end roofed in slate with an empty bell-cote, the far end fallen in to its rafters;
  - pale stone under a green water line of slime;
  - the dry porch up out of the water on its steps, Hester's skeps on a bench there and her lantern;
  - the robed men's cut: spoil and planks to a breach in the side wall.
- **Spike:** `landmarks.js` `chapel` (981 triangles). The nave, lean, sink, slate, rafters, bell-cote, porch, skeps,
  reeds and lantern are there.
- **To do:**
  - **the marsh as Luminati's own water.** The converter marks the tiles round the chapel as water (`~`), so the
    world draws real water with its shore, as the river is drawn. The spike's water disc reads as shadow.
  - paler stone;
  - the cut;
  - author it in `buildkit.js` as the chapel ruin's new model.

## 5. The work, if approved

1. **The kit in the world:** `world.js` stands every kit piece the converter keeps as a sprite as its 3D model (the
   spike's `KIT_PIECES`, for every kept id), merged by material and graded as baked. The Vale's sprite cards go: the
   Keep, Thornwick's palisade, towers and gatehouse, the mills, the mine, the milestone.
2. **The Barrows and the Chapel redesigned in `buildkit.js`** (§4). Re-bake `env.json`, so the minimap and anything 2D
   match. The chapel's marsh becomes water tiles in `convert.js`.
3. **Checks:**
   - a browser check that the Vale's landmarks stand as meshes, not cards, under the triangle and draw budget;
   - a capture sheet of the three doors at four hours;
   - the browser suite and `npm run check`.
4. **Docs:** this proposal Implemented; a short `docs/world-asset-standard.md` holding §3 for every map.

Cost: the kit-in-the-world step is small (the spike works). The two redesigns are a day's modelling each in
`buildkit.js`, including captures and a critic pass.

## 6. Questions for the owner

1. **One catalogue:** stand our kit's models in 3D everywhere a sprite card stands today, the Keep first (recommended),
   rather than building landmarks a second way?
2. **The Barrows and the Chapel:** go with the designs in §4, as the spike shows them, with the to-dos?
3. **The rest of the Vale's cards** (Thornwick's palisade, towers and gatehouse, the mills, the mine, the milestone)
   in the same pass (recommended), or the three doors only first?
4. **The chapel's marsh as real water tiles** (recommended)?

## The spike, in the code

- `tools/render3d/landmarks.js`: the Barrows and the Chapel, built with Luminati's mesh builder and its base textures.
  The Vale doesn't load Luminati's optional texture kits; the spike sticks to the base set.
- `tools/render3d/world.js`: `KIT_PIECES` (the Keep from `buildkit.js`), `LANDMARK_OF`. Both only with
  `?landmarks=3d` (`hybrid.js` passes it).
- `tools/render3d/build.mjs` stages `landmarks.js` and `buildkit.js` into the vendor build; `luminati.js` is
  108 → 132 KB gzipped with the kit in it.
- `tools/capture/rig.mjs --query landmarks=3d` takes the shots.
