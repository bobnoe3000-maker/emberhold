# Performance: options on the shelf

**Status: Current** (2026-11-12). The owner: *"Keep a document of potential performance improvement options if we need to
revisit."* What we measure with, where the frame stands, what has been done, and the options not yet taken, each with
what it should buy, what it costs and what it risks. Measured numbers say so; the rest are estimates and say that too.
Add to it whenever a performance question is answered.

## How to measure

- **The phone is the measure.** This box draws with software GL (SwiftShader): its frame times swing ± 7 % between
  identical runs, more than most single changes move them. Here, count what the GPU is asked to do (draws, triangles,
  corners shaded) and leave the frame rate to a real phone.
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
with it as first shipped, **45 fps** on Wickham Keep's second floor after the fix below (a dungeon floor; the town square,
the busiest scene, still to read).

## Done

- **The painted head built for play** (`tools/actor-lab/faces.js` `LOD`; `world.js` builds every figure in the world with
  `lod: 'play'`, portraits and previews with the full head). The first ship was a triangle soup: the skull kept unwelded
  so the hair shells could be cut from it, the shells unwelded too, so the GPU shaded 17,000–24,000 corners a head against
  KayKit's 3,600–4,000. For play: a coarser skull (36 × 26) and face mask (22 × 18), the face still the finer for the
  angles packed toward it; skull and hair welded (each corner shaded once); the ears without their rim; a lighter nose.
  A head now shades 2,400–3,000 corners (fewer than KayKit's) for 3,500–4,300 triangles. At play's size it can't be told
  from the full head (in-play captures, docs/painted-faces-spike.md).
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
| 10 | **A pixel-density cap on phones** (the Graphics panel shows `drawn at N×`): 1.5× in place of 2× | fragment work by ~44 % ☆ (2.25 vs 4 pixels per point) | small; a softer picture: a Graphics choice, not a default |
| 11 | **Depth of field off by default on phones** (Graphics → Depth of field: soft or off) | a full-screen blur pass ☆ | none to build; the look's softness is the owner's choice |

## Learned on the way

- **Corners shaded, not triangles, is what a phone feels** from a mesh: an unwelded soup costs three corners a triangle.
  `headCost` counts both; check new procedural geometry (`clipTris`, `filterTris`, `toNonIndexed`) for welding before it
  goes in play.
- **The shadow pass doubles a figure's geometry**: anything small on a figure (heads, props) can usually stay out of it.
- **Full detail where it's seen big** (portraits, the creation and temple previews, the boards) and a play build for the
  world: the same parts at two levels of detail, chosen where the figure is built (`lod`), never two looks.
- **A build is a hitch, the frame is the frame**: time a figure's build (once a look) apart from the steady frame
  (every frame), and fix whichever the phone shows.
