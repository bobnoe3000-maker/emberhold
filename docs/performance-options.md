# Performance: options on the shelf

**Status: Current** (2026-11-12). The owner: *"Keep a document of potential performance improvement options if we need to
revisit."* What we measure with, where the frame stands, what has been done, and the options not yet taken, each with
what it should buy, what it costs and what it risks. Measured numbers say so; the rest are estimates and say that too.
Add to it whenever a performance question is answered.

## How to measure

- **The phone is the measure.** This box draws with software GL (SwiftShader): its frame times swing ± 7 % between
  identical runs, more than most single changes move them. Here, count what the GPU is asked to do (draws, triangles,
  corners shaded) and leave the frame rate to a real phone.
- **The Frame test** (Graphics → *Frame test*; `src/render3d/frametest.js`, `src/ui/frametest.js`): on the device, in
  whatever scene is in view, the world as it is and then each piece of its picture off or down in turn (depth of field,
  bloom, the grade's extras, every post pass, antialiasing, the shadow map at 1024 and off, the lamp lights at 8 and none,
  the grass and flowers, the ground's edges, the trees and land round the map, the people, Balanced and Fast), each timed
  over at least four seconds and twelve frames after it settles (a shader compile is the first frame, not the cost), the
  world put back after each; the world as it is timed first and last, so a warming phone shows. A table of median frame
  times and what each saved, with Copy. This box's software GL can't time a phone's frame (a frame at 3× takes minutes
  here); the phone's table is the measure for what to change.
- **The frame rate on the phone:** Graphics → *the frame rate on screen* (the `fps · ms` chip under the HUD); the Graphics
  panel's status line says how the people are drawn (models or sprites) and at what pixel density (`drawn at N×`).
- **`node tools/capture/figperf.mjs`** (docs/character-look-plan.md §11): draws and triangles a frame counted at the WebGL
  context (every pass, the shadow pass too), the frame time, the models and their meshes, the JS heap, in the town square
  (17 people) and a Barrows fight. `--query a=b` for a switch; a before and an after on one machine.
- **`lab.js` `headCost(face, lod)`** (in the actor lab page): one head's meshes, triangles and corners shaded.
- **Switches for a side-by-side on the phone:** `?faces=mesh` (the KayKit 3D face parts, as before the painted head),
  `?headshadow=1` (the heads in the shadow pass), `?figures=sprites` (the people as baked sprites, not models).
- **The heap** (figperf's `heapMB`) is noisy run to run (± 40 MB in the square): compare several runs, not one.

## Where it stands (2026-11-12)

| the town square, 17 people | draws | triangles a frame |
|---|---|---|
| KayKit's faces (`?faces=mesh`) | 463 | 740,000 |
| the painted head as it first shipped | 463 | 1,000,000 (1,330,000 before its first trim) |
| **the painted head for play, out of the shadow pass (now)** | **429** | **725,000** |

A Barrows fight: 210,000 triangles (KayKit's faces 210,000). The owner's phone: mid 30s fps before the painted head, 15
with it as first shipped, **45 fps** on Wickham Keep's second floor after the fix below, and **22 fps (59 ms) in
Thornwick's square at dusk** (the busiest scene, 17 people).

**What the square's frame is made of** (one frame at dusk, its draws split by render target at the WebGL context, a 390 ×
844 phone at 2×; the scratch probe split the main view's triangles by shader):

| | main view: draws · triangles | shadow map (2048²): draws · triangles |
|---|---|---|
| the people as models (now) | 281 · 595,000 | 151 · 132,000 |
| KayKit's faces (`?faces=mesh`) | 281 · 567,000 | 151 · 132,000 |
| the people as sprites (`?figures=sprites`) | 206 · 464,000 | 76 · 72,000 |

The world is most of it: the grass ground 156,000 triangles, the cliffs 49,000, trees (bark, pines, leaves) 100,000, the
grass decals and dark grass 81,000, the ground cover 36,000 (18,056 instances). All 17 people are about 130,000; the
painted heads 28,000 more than KayKit's. And the pixels: Luminati draws the main view at the screen's density within a
**2.1-million-pixel budget** (2.53× on a 390-wide phone at 3×), and its dynamic resolution, which steps the render scale
down when the GPU's timer says a frame is slow, **never acts on iOS** (no timer queries in Safari): the phone draws every
frame at the whole budget, then the shadow map and the post passes (bloom's chain, the depth of field) over it.

## Done

- **The painted head built for play** (`tools/actor-lab/faces.js` `LOD`; `world.js` builds every figure in the world with
  `lod: 'play'`, portraits and previews with the full head). The first ship was a triangle soup: the skull kept unwelded
  so the hair shells could be cut from it, the shells unwelded too, so the GPU shaded 17,000–24,000 corners a head against
  KayKit's 3,600–4,000. For play: a coarser skull (36 × 26) and face mask (22 × 18), the face still the finer for the
  angles packed toward it; skull and hair welded (each corner shaded once); the ears without their rim; a lighter nose.
  A head now shades 2,400–3,000 corners (fewer than KayKit's) for 3,500–4,300 triangles. At play's size it can't be told
  from the full head (in-play captures, docs/painted-faces-spike.md).
- **The merge keeps the weld** (`figure.js compact` `geoFor`): merging a figure's rigid parts into one mesh a bone used
  to un-index them (`toNonIndexed`), which threw the play head's weld away again: the merged head shaded 11,400 corners
  (the knight) and 10,600 (the cleric) in play, not the ~2,500 measured on the head alone. Kept indexed (a soup given a
  plain index): the knight's merged head 11,403 → 3,168 corners, the cleric's 10,596 → 1,995, the cleric's weapon hand
  1,872 → 831 ★. Same triangles, same draws, same look.
- **A Resolution choice in Graphics** (the owner's 22 fps in the square; option 10 below, taken as a choice): Sharp (as
  it was: the whole budget, the engine's own controller free), Balanced (at most 2×) and Fast (at most 1.5×), by the
  engine's render scale with its controller held off so it can't step back (`world.js` settings `res`,
  `render3d/settings.js`, `ui/title.js`). On a 390 × 844 phone at 3× ★: the main view 985 × 2131 (2.10M pixels), 780 ×
  1688 (1.32M, 63 %), 585 × 1266 (0.74M, 35 %); the overlay and taps on the world within 1.64 px at all three (the
  browser suite allows 2). At the phone's own pixels Balanced can hardly be told from Sharp; Fast is a little softer on
  the cobbles and the figures' edges ([the square at each, 1:1](img/perf/resolution-square.jpg)). Default Sharp: the
  look is the owner's to change.
- **The heads out of the shadow pass** (`world.js`, `figure.js compact` keeps a merged head tagged): −34 draws and
  −70,000 triangles in the square; the body's shadow is the figure's. `?headshadow=1` puts them back.

## Options not taken yet

Ranked by what they should buy for what they cost. ★ = measured; ☆ = an estimate.

| # | option | what it buys | cost · risk |
|---|---|---|---|
| 1 | **Cache a head's build**: the radial grids that carry KayKit's hair cuts onto the skull (`radialMap`, a ray grid of the skull per head) and the painted picture, by head shape and cut | a figure's first build 389 ms ★ (KayKit's faces 188 ★) → ~200 ms ☆: a shorter hitch when someone first appears (a scene change, a hire), not the steady frame rate | small; a cache keyed by the face's parts, memory for the cached grids (a few KB each) |
| 2 | **The face's picture smaller for play**: 256² with mipmaps in place of 512² unmipped | GPU memory for faces ~17 MB → ~6 MB ☆ in the square (one picture a distinct face); steadier sampling at 20 px | small; check the eyes still read at play's size (they're drawn ×2 coarser) |
| 3 | **Share geometry between heads alike**: every figure whose head, shape and nose match uses one skull, mask and ear geometry (templates already share a look's copies) | build time and memory for the townsfolk, most of whom share the default head ☆ | small–medium; the mask's UVs are per head shape, fine to share |
| 4 | **A lighter play skull still** (28 × 20) | ~600 triangles a head ☆, ~10,000 a frame in the square | small; capture at play's size first: the jaw and nose bridge are what's lost |
| 5 | **Hoods lighter in play**: the cloth shell (`props.js hoodShell`) is 40 × 22 + 32 × 12 + an inside 36 × 18 sphere segment | ~3,000 triangles a hooded figure ☆ → ~1,200 | small; the oval's silhouette at 20 px is all that matters |
| 6 | **Animate far figures less often**: a mixer update at half rate for people more than ~12 tiles from the hero | CPU: skinning and mixer time for the square's townsfolk ☆ (not yet measured: add a CPU split to figperf first) | medium; a stutter in far walk cycles if overdone |
| 7 | **Fewer shadow casters**: the party and the nearest N people cast; the rest don't | the shadow pass's draws and triangles for crowded scenes ☆ | small; townsfolk without shadows can look pasted on: try N = 6 |
| 8 | **Figure culling**: figures are `frustumCulled = false` (a skinned figure's bounds go stale as it animates); a bounding sphere of our own from its root would let off-screen people skip | everything a figure costs, for those out of view ☆ (the square is mostly on screen; the overland and big dungeon floors gain more) | medium; a sphere big enough for every clip (a raised staff) |
| 9 | **Far people as sprites**: the baked atlases exist (`?figures=sprites` draws everyone so); a hybrid: models near, sprites beyond a distance | large on crowded scenes ☆ | medium–large; the switch between them must not pop; sprites have the old faces until re-baked |
| 10 | ~~A pixel-density cap on phones~~ **taken as a choice** (Graphics → Resolution, above); still open: Balanced as the phones' default | on a 3× phone 37 % of the pixels ★ (Balanced), 65 % (Fast) | the owner's call: the frame rate it buys on the phone first |
| 11 | **Depth of field off by default on phones** (Graphics → Depth of field: soft or off) | a full-screen blur pass ☆ | none to build; the look's softness is the owner's choice |

## Learned on the way

- **Look at the whole frame before the newest thing in it.** The square's 22 fps came after the painted heads, but the
  heads are 28,000 of the frame's 780,000 triangles; the world and the pixel budget are the frame. Split it by pass and
  by shader first (draws counted at the context, per framebuffer).
- **What the engine adapts on one machine it may not on another**: Luminati's dynamic resolution needs GPU timer
  queries, which iOS Safari doesn't have; on the phone it never moved.

- **Corners shaded, not triangles, is what a phone feels** from a mesh: an unwelded soup costs three corners a triangle.
  `headCost` counts both; check new procedural geometry (`clipTris`, `filterTris`, `toNonIndexed`) for welding before it
  goes in play, and measure it as the game holds it (after `compact`), not only as built: the merge undid the weld once.
- **The shadow pass doubles a figure's geometry**: anything small on a figure (heads, props) can usually stay out of it.
- **Full detail where it's seen big** (portraits, the creation and temple previews, the boards) and a play build for the
  world: the same parts at two levels of detail, chosen where the figure is built (`lod`), never two looks.
- **A build is a hitch, the frame is the frame**: time a figure's build (once a look) apart from the steady frame
  (every frame), and fix whichever the phone shows.
