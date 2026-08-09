# Dreadforge — Technical Design Document

**Procedural nightmare biome rendering pipeline for Emberhold**
Version 1.0 · Targets the locked isometric fine-tile grid TW=16 / TH=8 / ZH=6 · Zero-build ES modules, canvas2D, mobile-first portrait, Netlify-deployable. Written for agent handoff: an implementing agent should be able to build or extend the system from this document alone, using the Dreadforge v0 prototype (`dreadforge.html`) as the reference implementation.

---

## 1. Purpose and scope

Dreadforge is the procedural art and rendering layer for Emberhold's nightmare biome. Every visual asset — terrain tiles, cliff faces, props, creatures, lighting, and atmosphere — is generated at runtime from a single integer seed. There are no source images in v0. The pipeline is designed so that hand-authored sprite sheets can be introduced later without architectural change: the player character will be swapped to a paper-doll sprite-sheet actor, and NPCs will be a mixed population of sprite-sheet actors and voxel-baked actors rendered through one common contract (Section 8).

The document covers the coordinate system, deterministic generation stack, tile and cliff rasterization, the voxel-to-sprite bake, cellular-automata creatures, the post-processing stack, the frame loop and layering model, and the hybrid actor architecture that is the main forward-looking design decision. Performance budgets and the Phase 1a integration path close the document.

## 2. Architecture overview

The system is organized as a one-shot **generation phase** followed by a cheap **presentation phase**. Generation runs on seed change or on rebuild-class parameter change (corruption, relief) and produces immutable artifacts: a base world canvas, a set of baked sprite canvases, and a glow-pixel list. Presentation runs every frame and only composites: base canvas, pulsing emissive pixels, additive flicker light, and a dithered fog/vignette overlay refreshed at ~8 Hz. This split is what keeps runtime cost near-zero on mobile — the expensive per-pixel work happens once per seed, not per frame.

```
seed ──► genTerrain() ──► zmap, corrmap, lightPos
              │
              ├─► buildProps()      ──► voxel models ──► bakeVoxels() ──► sprite canvases + glow
              ├─► buildCreatures()  ──► CA grids     ──► shaded/outlined sprite canvases + glow
              │
              └─► renderWorld()     ──► baseCv (ImageData, painter order) + glowPix[]
                                          ▲ sprites blitted in-order during the same pass

frame(t): drawImage(baseCv) → glow pulse → additive light disc → drawImage(fogCv @8Hz)
```

Rebuild-class parameters (`corruption`, `relief`, `seed`) trigger the full generation phase, debounced at 120 ms. Presentation-class parameters (`fog`, `glowPulse`) are read live in the frame loop and cost nothing to change.

## 3. Coordinate system and projection

World space is a tile grid `(x, y)` with integer elevation `z ∈ [0, 7]`. Screen projection is the standard 2:1 isometric transform on the locked constants:

```js
const TW = 16, TH = 8, ZH = 6;
sx = OX + (x - y) * TW/2;
sy = OY + (x + y) * TH/2 - z * ZH;
```

`OX = MAPH·TW/2 + TW/2` centers the diamond; `OY` is a fixed top margin. The prototype chunk is 22×22 tiles on a 352×232 native canvas, integer-scaled 2× for display with `image-rendering: pixelated`. For Emberhold production, the same math applies to a camera-scrolled chunk window; the native virtual resolution should stay in the 216×384 to 270×480 portrait band with integer scaling to device pixels — never fractional scaling, which destroys pixel-art crispness.

The tile top surface is a 16×8 diamond with row widths `[4, 8, 12, 16, 16, 12, 8, 4]`, each row horizontally centered on `sx`. This row table is the single source of truth for diamond masking, edge detection, and cliff-face attachment, and must not be re-derived independently anywhere else in the codebase.

Painter order is diagonal-major: iterate `s = x + y` ascending, drawing all tiles on each diagonal, then all actors anchored on that diagonal. Because `s` strictly increases toward the camera, later draws correctly occlude earlier ones with no depth buffer. Within one diagonal, tile draw order is irrelevant (tiles on a diagonal never overlap horizontally); actors on the same diagonal should be sub-sorted by `y` ascending if they can overlap.

## 4. Determinism stack

All randomness flows from two primitives. `mulberry32(seed)` produces sequential streams for anything generated in a loop (prop placement, creature bodies, voxel carving). `hash2(ix, iy, seed)` produces coordinate-stable values for anything addressed spatially (per-pixel speckles, rune placement), which guarantees the same pixel gets the same value regardless of iteration order. On top of `hash2` sits smoothstep-interpolated value noise `vnoise(x, y, seed)` and 2–4 octave `fbm`. Perlin/simplex is unnecessary at this resolution; value-noise fbm is cheaper and visually indistinguishable at 16px tile scale.

The critical discipline is **seed-space partitioning**: every subsystem derives its stream from the master seed with a distinct multiplier and offset (`seed*7919+3` terrain, `seed*131+9` props, `seed*577+41` creatures, `seed+7` tile material, `seed+555` corruption field, etc.). This ensures adjusting one subsystem never reshuffles another — corruption slider changes must not move props. An implementing agent adding a new subsystem must allocate a fresh multiplier, never reuse an existing stream.

## 5. Terrain and materials

Elevation comes from a 4-octave fbm at frequency 0.09/tile, recentered and scaled by the relief parameter, plus 25% of a ridge term `|fbm − 0.5|·2` at frequency 0.05 for spines and crags, quantized to `z ∈ [0, 7]`. Tiles with `z ≤ 1` are void water. The corruption field is an independent fbm at 0.13/tile plus a radial falloff from a seeded epicenter; the corruption slider moves the classification threshold rather than regenerating the field, so spread grows organically outward from the same heart. The highest-corruption land tile becomes `lightPos`, the anchor for the eye-totem prop and the flickering light.

Material assignment is elevation- and field-driven: water at `z ≤ 1`; bone shale at `z ≥ 5`; below that, ashen soil with flesh-growth patches where a low-frequency selector noise exceeds 0.62; corruption overrides everything to the poison ramp. Each material is a 4–5 step palette ramp stored as RGB triples (Section 5.1). This "classification over composition" model is deliberately simple and extends cleanly: biome #2 is a new ramp set plus new classification rules, not new rendering code — the corruption system already demonstrates a full palette-swap biome identity living inside the same terrain.

### 5.1 Palette ramps

```
soil    #120e1c #1f1830 #2f2444 #413156 #554165   ashen violet-gray ground
flesh   #260e16 #421a24 #622834 #843a44 #a2545c   organic growth patches
bone    #332f28 #524c40 #756e5e #9c9482 #c4bba6   high shale / rib props
poison  #0c2010 #1a3c1e #2c6229 #4c9438 #84d44c   corruption override
water   #060410 #0c091c #130e2a #1c1440           void water (flat)
obsid   #0e0a16 #1c1526 #2c2138 #3e2f4e #554270   spires / monoliths
glow    poison c8ff7a · violet be96ff · ember ff785a · water 5a46b4
outline #08050e (universal 1px sprite outline)
```

The nightmare mood lives almost entirely here: desaturated cold bases, one poison accent, warm ember reserved for creature eyes. All future assets — including imported sprite sheets — must resolve to these ramps or extend the table formally (Section 8.4).

## 6. Tile rasterization

The world renders into a single `ImageData` buffer with a bounds-checked `put(px, py, r, g, b)`; per-pixel canvas API calls are never used in the generation phase. Each tile draws cliff faces first, then its top diamond.

**Top surface.** For each diamond pixel, sample material fbm at ~2.3 cycles/tile in continuous world coordinates (`u = x + dx/16`, `v = y + py/8`) so texture is seamless across tile boundaries, and quantize to a ramp index. Three adjustments then shape the form, in order: a form-shading step that darkens one index where `dx/w + py/8 > 1.25` (soft SE falloff implying top-left light); a rim-light step that brightens one index on the outer two columns of the upper four rows when the NW neighbor `(x−1, y)` or NE neighbor `(x, y−1)` is lower (catching light on exposed edges); and an ambient-occlusion step that darkens one index on the corresponding upper half when those neighbors are higher. All lighting is thus expressed as ramp-index arithmetic, never RGB math — this is what keeps the output looking hand-placed rather than filtered.

**Cliff faces.** A tile exposes its SW face when `z > Z(x, y+1)` and its SE face when `z > Z(x+1, y)`, each an 8-column parallelogram descending `drop·ZH` pixels from the diamond's lower edges (edge y-offsets follow the row table: `+4 + ⌊i/2⌋ + 1` for SW, `+8 − ⌊i/2⌋` for SE at column offset `i ∈ [0,8)`). Faces sample a horizontally-stretched strata noise mapped to the darkest three ramp steps, with the SE face one index darker than SW to keep the light direction consistent, and a Bayer-thresholded darkening that increases with depth so tall cliffs fade toward black. Because painter order runs `s` ascending, the tile in front on the next diagonal naturally overwrites the face bottom — faces can safely overdraw.

**Water.** Water tiles render flat (no faces) from the 4-step water ramp with coordinate-stable sparkle pixels (`hash2 > 0.985`) registered into the glow list at low intensity. Corrupted land tiles similarly register poison speck glow pixels at `hash2 > 0.975`.

## 7. Baked sprite generation

### 7.1 Voxel-to-sprite bake

`bakeVoxels(vox, SX, SY, SZ, ramp, rng, emissive)` converts a `Uint8Array` voxel volume (0 empty, 1 solid, 2 emissive) into a shaded, outlined sprite canvas plus a glow-pixel list. Projection: `px = (vx − vy) + offX`, `py = ((vx + vy) >> 1) − vz + offY`, each voxel stamped as a 2×2 pixel block (adjacent voxels intentionally overlap, which reads as chunky solidity at this scale). Draw order is `vx + vy` ascending — the only pair of voxels that collide on the same screen pixel is `(x, y, z)` vs `(x+1, y+1, z+1)`, and diagonal-sum order resolves it correctly; `z` order within a diagonal is irrelevant since `z` shifts `py`.

Shading is face-exposure based: brightness 1.0 if no voxel above (top face), 0.72 if the `+y` neighbor is empty (screen-left face), 0.5 if the `+x` neighbor is empty (screen-right face); fully enclosed voxels are skipped. Brightness is further scaled by a height gradient (0.8 → 1.0 bottom to top) and ±10% coordinate-stable jitter, then combined with a material fbm into a ramp index. Top faces get a small additive RG lift for a lit-surface pop. Emissive voxels bypass shading, render in the glow color, and register into the sprite's glow list with a random phase.

After rasterization, an outline pass stamps `#08050e` on every transparent pixel 4-adjacent to a solid one. This 1px dark outline is the universal sprite convention — it is what visually unifies voxel bakes, CA creatures, and future sprite sheets against the busy tile background, and imported art must ship with (or be processed to have) the same outline.

Prototype prop builders and their construction rules: **spire** — 26-tall stack of shrinking noise-carved discs whose center drifts on offset sinusoids (the twist), obsidian ramp, 30% emissive chance in the top 4 layers; **rib arch** — four parallel semicircular bone arcs in the x–z plane at decreasing heights, swept with a 3×3 brush; **monolith** — 5×3×20 obsidian slab with a noise-broken crown above z=13 and coordinate-stable emissive rune pits on the SE face; **eye totem** — tapered flesh pedestal under a radius-3.6 orb with an emissive core, always placed at `lightPos`. Placement uses rejection sampling: land tiles only, Manhattan spacing ≥ 5, ≤ 300 attempts, 4–6 props per chunk.

### 7.2 CA creatures

Creature bodies are the mirrored cellular-automata silhouette technique: a 6×11 half-grid seeded at 48% density, two smoothing passes (cell survives with ≥ 4 alive in its 3×3 neighborhood), mirrored to 12×11, scaled 2× to a ~26×24 sprite. Body pixels shade by a vertical ramp gradient (lighter toward the head) modulated by fbm, from the flesh ramp normally or the poison ramp when spawned on corrupted ground. The outline pass runs identically to voxel bakes. Two symmetric glow pixels in the upper third become eyes — ember `#ff785a` on clean ground, poison on corrupted — and are the single strongest "creature, not rock" signal at this size. Mirror symmetry is what makes random blobs read as living things; asymmetric variants should be reserved for deliberately wrong elite enemies.

### 7.3 Sprite anchoring and world blit

Every baked sprite blits during the painter pass at its anchor diagonal: bottom-center of the sprite canvas lands at the tile diamond center `(sx, sy + TH/2)` of its standing tile at that tile's elevation, minus a 2px sink so feet visually settle into the ground. Sprite-local glow coordinates translate to world space at blit time and merge into the global glow list. This anchor contract is shared verbatim by the future actor system.

## 8. Hybrid actor architecture (sprite sheets + voxel NPCs)

This section is the forward design. The requirement: the player character will be replaced by a paper-doll sprite-sheet actor; NPCs will be a mixed population where hand-authored (or Assetforge-generated) sprite-sheet NPCs live alongside voxel-baked NPCs in the same world, same lighting language, same draw pass. The design principle is that **the renderer never knows which kind of actor it is drawing** — all three actor types resolve, per frame, to the same frame descriptor:

```js
// The one contract every actor type implements.
// getFrame() must be allocation-free on the hot path (return cached descriptors).
actor.getFrame(dir, t) => {
  cv,            // canvas (or canvas region via sx/sy/sw/sh) — pre-shaded, pre-outlined
  ax, ay,        // anchor offset: pixel in cv that lands on the tile diamond center
  glow: [[gx, gy, color, phase], ...]   // frame-local emissive pixels
}
// World placement/order comes from actor.tx, actor.ty (and future sub-tile fx, fy).
```

The painter pass sorts actors by `(tx + ty)` (sub-sorted by `ty`), calls `getFrame`, and blits — identical to how static props blit today. Glow, fog, vignette, and the flicker light already operate on composited output and glow lists, so every post effect applies uniformly to all actor types with zero additional work.

### 8.1 `VoxelActor` (procedural NPCs)

Wraps the existing bake. At load, the voxel model is baked **once per facing** — the 4-direction set falls out free by rotating the volume 90° about z before baking (`(x, y) → (SY−1−y, x)`), which is the single biggest content-cost advantage of the voxel path. Animation options, in ascending cost: static (props, sentinels); **2-frame bob** — bake twice with a 1-voxel z offset on the upper half of the volume, which reads surprisingly alive at this scale; **procedural part transforms** — tag voxel spans as parts (arm, head, orb) and re-bake per pose at load into a small frame set (e.g., 4 dirs × 3 walk frames × ~40×48px ≈ trivial memory). Never re-bake per frame at runtime; bakes are load-time only.

### 8.2 `SheetActor` (main character, paper-doll)

The paper-doll composite pipeline carried forward from Torchfall's Character Forge: at load (and on any equipment change), layer sockets composite base body + equipment layers per animation frame into a single flattened per-frame canvas strip, then run the shared post chain — palette quantization to the master ramps if the source isn't ramp-native (8.4), then the 1px `#08050e` outline pass on the flattened result (outlining the composite, not each layer, so equipment doesn't double-outline). `getFrame` indexes the strip by `(dir, animState, frameIndex(t))`. Frame timing is data-driven per animation (`{walk: {frames: 4, ms: 130}, ...}`) per the established data-driven animation convention. Glow pixels (enchanted gear, eyes) are authored per frame in the sheet metadata as coordinates, not baked into the image, so they pulse through the global glow system like everything else.

### 8.3 `AdditiveSheetActor` (NPC overlays)

The "additive sprite sheet" NPC concept: a base sheet actor plus zero or more **overlay sheets** composited at `getFrame` time from cached flattened frames. Overlays share the base sheet's frame grid and anchor, and each declares a blend mode: `normal` (armor, clothing — standard paper-doll layering), `lighter` (auras, spectral shrouds, corruption wisps — composited additively *after* the outline pass so glows bleed past the silhouette), or `ramp-shift` (a palette remap of base pixels, e.g. flesh→poison for a corrupted variant of the same NPC — this is the cheapest way to double the NPC roster and mirrors the terrain corruption system exactly). Composite results are cached keyed by `(baseId, overlayIds, dir, animState)`; cache invalidates only on overlay set change. This gives one authored NPC sheet many world variants at near-zero art cost, which is the same leverage the voxel path gets from rotation.

### 8.4 Unification rules (what makes mixed populations look coherent)

Mixed sprite-sheet and voxel-baked actors will look like they belong to the same game if and only if these invariants hold, so they are hard requirements enforced by a load-time validation pass, not suggestions: (1) **light from screen top-left** — sheets must be authored with the same light direction the baker shades with; (2) **master palette** — imported pixels quantize to the ramp table (nearest-in-ramp per material tag, or nearest-overall fallback), with new ramps added to the table formally rather than ad-hoc colors; (3) **universal outline** — 1px `#08050e` applied to the final flattened silhouette of every actor frame; (4) **shared scale** — humanoids 24–32px tall (1.5–2 tiles), hero props up to ~44px, matching the voxel bake output range; (5) **glow through the global system only** — no emissive pixels baked as bright static colors into sheets, so pulse and flicker stay coherent scene-wide; (6) **shared anchor convention** — bottom-center on diamond center, 2px sink. A `validateActorAsset()` dev-mode function should check outline presence, palette compliance, and dimension bounds on load and console-warn violations.

### 8.5 Suggested module layout

```
/src
  core/     rng.js  noise.js  palette.js  iso.js(projection+row table)
  gen/      terrain.js  tiles.js(rasterizer)  voxbake.js  props.js  creatures.js
  actors/   actor.js(contract+sort)  voxelActor.js  sheetActor.js
            additiveSheetActor.js  validate.js
  render/   world.js(painter pass)  post.js(fog/vignette/light)  loop.js
  data/     ramps.js  animations.js  sheets/*.png + *.meta.js
```

Zero-build ES modules throughout, per project convention; `dreadforge.html` v0 maps onto this layout mechanically (it is the same code in one file).

## 9. Post-processing stack

Composited per frame in fixed order over the base canvas. **Glow pulse**: each glow pixel draws as a 1×1 fillRect at alpha `0.35 + 0.65·(0.5 + 0.5·sin(2.6t + phase))`, scaled by the pulse parameter — phases are per-pixel so corruption shimmers rather than blinking in unison. **Flicker light**: a precomputed 84px Bayer-dithered radial disc in poison-green draws with `globalCompositeOperation = 'lighter'` at the light anchor, with alpha driven by `vnoise(6t)` plus an 11 Hz sine component — noise-driven flicker reads as fire/energy where pure sine reads as electronics. **Fog + vignette**: a full-frame ImageData overlay regenerated at ~8 Hz (deliberately choppy — it reads as roiling mist and costs 1/8th of per-frame): fog density scales with the fog parameter, increases toward the top of the frame (distance), and is modulated by a slow-drifting band noise; both fog and the corner vignette resolve through a 4×4 Bayer threshold matrix to full-opacity pixels, never alpha gradients, preserving the pixel-art register. All three effects are resolution-independent of world content and apply identically over future actors.

## 10. Performance budget

Generation phase on the 22×22 prototype: terrain ~0.5 ms, world rasterization 30–60 ms, prop bakes 2–5 ms each, creatures < 1 ms each — comfortably under 150 ms total on mid-range mobile, hidden behind the 120 ms slider debounce. Frame loop: one 352×232 drawImage, 200–600 fillRects for glow, one additive drawImage, one overlay drawImage — well under 2 ms/frame; the 8 Hz fog rebuild (~82k pixel ImageData) is ~3–4 ms on its own cadence. Scaling to a scrolling world, the same phase split holds: rasterize per 16×16-tile chunk to cached canvases on a background cadence, keep a 3×3 chunk ring live, and re-run only glow/fog at full framerate. Memory for actor frames is negligible (a 4-dir × 4-frame × 40×48 voxel NPC is ~120 KB of canvas). The two rules that protect the budget: no per-pixel work in the frame loop, ever; and all bakes/composites happen at load or on state change, cached.

## 11. Phase 1a integration notes

Three direct hooks into the open Emberhold decisions. **Biome #2 identity**: the corruption system is a working proof that a full biome identity can be a ramp table + classification rules + a prop/creature variant set over shared geometry — if biome #2 is "the corruption" itself, the threshold slider becomes world-progression state (corruption advancing per in-game day) at zero new rendering cost. **Day/night timing**: the post stack is already the day/night system — a time-of-day curve driving fog color/density, vignette radius, and global ramp-index bias (night = all materials sampled one step darker) gives a convincing cycle without any new pipeline; the flicker-light machinery becomes placeable player light sources at night. **Death penalty**: no rendering dependency, but the glow/corruption language offers free feedback vocabulary (death site marked by a corrupted tile patch + ember glow pixels at the corpse, reclaimable — the pipeline can already draw all of it).

Recommended build order: (1) port v0 into the module layout with the chunk-cache render path; (2) implement the actor contract and `VoxelActor` with 4-dir rotation bakes, converting the CA creatures to 2-frame bob actors; (3) implement `SheetActor` + the validation pass and swap in the paper-doll player; (4) add `AdditiveSheetActor` with the ramp-shift overlay as the first NPC variant mechanism; (5) promote corruption spread to game state.
