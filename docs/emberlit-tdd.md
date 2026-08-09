# Emberlit — Technical Design Document

**Hi-bit 2.5D rendering pipeline for Emberhold: pixel-art G-buffers + dynamic GPU lighting**
Version 1.0 · Extends the Dreadforge TDD v1.0 (procedural bake layer) · Reference implementation: `emberlit2.html` · Grid constants unchanged: TW=16 / TH=8 / ZH=6 · Zero-build ES modules target, WebGL2, mobile-first, Netlify-deployable.

This document is the implementation handoff for the hi-bit direction: the world remains authored/generated as crisp isometric pixel art on the locked fine-tile grid, but instead of baking final colors, the CPU bake emits **G-buffers** (albedo, normal, emissive, height) that a WebGL2 lighting pass relights every frame with real dynamic point lights, HDR emissives, and a bloom/tonemap post chain. This is the Dead Cells / Graveyard Keeper model. Everything in the Dreadforge TDD's generation stack (determinism, terrain, materials, voxel bake, CA creatures, actor contract) carries forward; this document specifies what changes and what is added. Measured baseline on target hardware: 61 fps at 464×312 native with an HDR render target on a current iPhone.

---

## 1. Architecture

Two phases, same philosophy as Dreadforge but with the presentation phase promoted to the GPU:

```
BAKE (CPU, on seed / rebuild-param change, ~one-shot)
  seed ─► genTerrain ─► zmap, corrmap
             ├─► props (voxel bake w/ per-face normals)
             ├─► creatures (CA + inward-distance normals)
             └─► renderWorld ─► ALB, NRM, EMI  (three RGBA8 CPU arrays, native res)
                                   │
                                   ▼ texImage2D ×3 (NEAREST)

FRAME (GPU, every frame)
  PASS A  fullscreen tri @ native res ─► HDR FBO (RGBA16F, mipmapped)
          albedo × (ambient + Σ point lights via normal map) + emissive·pulse
          + analytic wisp orb + smooth drifting fog
  PASS B  fullscreen tri @ display res ─► screen
          nearest-sampled integer upscale (crisp pixels)
          + trilinear mip-tap bloom (smooth glow)  + ACES + grade + vignette + grain
```

The two-sampler trick in Pass B is the visual signature of the whole approach: the **same lit HDR texture** is bound twice, once through a NEAREST sampler (base image — hard pixel edges survive) and once through a LINEAR_MIPMAP_LINEAR sampler (bloom taps — light bleeds smoothly across pixel boundaries). WebGL2 sampler objects make this a two-line configuration; do not emulate it with texture copies.

Rebuild-class parameters (seed, corruption) re-run the bake and re-upload via `texImage2D`/`texSubImage2D`, debounced ~140 ms. Presentation-class parameters (ambient, light intensity, bloom) are plain uniforms with zero rebuild cost — this asymmetry is what makes the ambient slider a free day/night system (§9).

## 2. G-buffer formats

Three parallel `Uint8ClampedArray(W*H*4)` buffers at native resolution, uploaded as RGBA8 textures with NEAREST filtering and CLAMP_TO_EDGE. All bake-side writes go through one `plot(x, y, alb, n, h, emi)` function so the channel encodings live in exactly one place.

**ALB (albedo).** RGB is the *unlit* material color: palette-ramp index chosen by material noise only. Compared to Dreadforge's baked render, the directional form shading and rim light are **removed** (the dynamic lights now produce them, better), while a mild one-step ambient-occlusion darken at edges adjacent to higher neighbors is **retained** — baked contact AO under dynamic light is a large part of why the result reads as expensive. A is 255.

**NRM (normal + height).** R,G = normal.xy encoded `*0.5+0.5`; B = normal.z in [0,1]; **A = elevation height** in screen pixels, stored as `min(255, h*4)` and decoded in-shader as `a*64` (net ≈ identity for h up to ~63 px, covering z 0–7 ground plus sprite tops). Height rides in the normal alpha specifically so the lighting shader gets position and orientation in a single fetch.

**EMI (emissive).** RGB = HDR emissive color divided by 3 at bake time, decoded `*3.2` in-shader, giving super-white values that survive the RGBA8 store and drive bloom. Per-pixel pulse phase is *not* stored — it is derived in-shader from a hash of the pixel coordinate, so corruption fields shimmer asynchronously for free.

## 3. Normal-space convention (normative)

All normals live in a screen-aligned pseudo-3D space: **+X = screen right, +Y = toward the camera (down-screen), +Z = up out of the ground plane.** Every asset source must encode into this space; this is the invariant that lets tiles, voxel bakes, CA creatures, and future sprite sheets sit under one light without seams. Canonical values used by the reference implementation (all normalized before encode):

```
tile top          ( gx,  0.30+gy, 0.95 )   gx,gy = material-noise gradient ×2.6 (×0.6 water)
cliff SW face     (-0.70, 0.45, 0.52 )     + per-pixel x-wobble ±0.25 from strata noise
cliff SE face     ( 0.70, 0.45, 0.52 )
voxel top face    ( 0,    0.35, 0.93 )
voxel left face   (-0.75, 0.30, 0.55 )
voxel right face  ( 0.75, 0.30, 0.55 )
creature body     norm(-gx·0.5, 0.25-gy·0.5, 0.45+0.5·depth)   from inward-distance gradient
outline pixels    ( 0, 0, 0.25 )           deliberately low-z: outlines stay dark under light
```

Two of these deserve emphasis. The **material-gradient perturbation** on tile tops (finite-difference of the same fbm that picks the albedo ramp index) is what makes individual ground pixels glint as a light passes — without it the terrain lights as flat plates and the technique loses most of its effect. The **inward-distance normals** on creatures (per-pixel distance to silhouette edge via a 3-ring scan, gradient → xy, depth → z) turn CA blobs into rounded volumes; this same routine is the default normal generator for any sprite that arrives without an authored normal map (§7).

The voxel baker emits per-face normals at zero extra cost because face exposure (top/left/right) is already computed for shading — this fulfills the "normals for free" claim in the Dreadforge TDD and is the strongest reason to keep voxel-baked NPCs in the mix.

## 4. Lighting model (Pass A)

One fullscreen triangle at native resolution, single fragment shader, writing to the HDR FBO. Per pixel: fetch ALB/NRM/EMI, decode normal `n = normalize(vec3(N.xy*2-1, max(N.z, 0.02)))` and height `h = N.a*64`, then:

**Ambient.** `amb = mix(nightViolet(0.10,0.07,0.17), dusk(0.55,0.48,0.62), uAmbient)`, applied as `albedo * amb * (0.72 + 0.28*n.z)` — the n.z term keeps a whisper of top-vs-side separation even in flat ambience.

**Point lights** (array of 3 in the demo; 4–8 is fine in production, uniform-array driven):

```glsl
vec3 d   = vec3(p.x - lp.x, (lp.y - p.y) * 1.8, lp.z - h);
vec3 L   = normalize(d);
float ndl = max(dot(n, vec3(L.x, -L.y * 0.55, L.z)), 0.0);
float att = 1.0 / (1.0 + dot(d,d) * 0.0016);
col += albedo * lightColor * ndl * att;
col += lightColor * att * 0.05;              // faint air glow
```

The two magic constants are iso-compensation, not arbitrary: **1.8** stretches screen-y distances back toward ground-plane distances (the 2:1 projection compresses depth into half the pixels), and the **−0.55 y-remap** in the N·L converts "light is down-screen of the pixel" into the correct sign for normals encoded with +Y toward camera. Tune them only as a pair, and only while orbiting a light around a cliff corner. The additive air-glow term (0.05·att) sells volumetric presence for one MAD per light.

Light positions are `(screenX, screenY, heightPx)` in native art coordinates. In JS, the wisp light is smoothed toward its target in tile space, converted through `tileScreen`, with `h = tileZ*ZH + 14`; flare lights sit at the two strongest corruption spots with value-noise flicker (noise-driven flicker reads as fire; sine reads as electronics — same rule as Abyssal).

**Emissive + extras.** `col += EMI*3.2 * (0.55 + 0.45*sin(t*2.6 + hashPhase))`. The wisp orb itself is analytic in this shader (two gaussian falloffs, tight core + wide halo) rather than a sprite, so it stays perfectly centered on the light and feeds bloom naturally. A smooth low-frequency fog (value noise drifting, mixed at ≤0.16 alpha, stronger toward frame top) sits *over* the crisp pixels — smooth atmospherics over hard pixels is the hi-bit register; never dither this fog.

## 5. Post pass (Pass B)

Display-resolution fullscreen triangle. Screen coordinates map to native art coordinates through `np = (screenFromTopLeft - uOff) / uScale`; outside the world rect, output the letterbox color and return. Base color is the NEAREST sample of the lit texture at that native texel. Bloom sums trilinear `textureLod` taps of the same texture at mips 2/3/4 (weights 0.34/0.30/0.22), thresholded at 0.14, scaled ×1.8×bloomParam. Then ACES tonemap (input ×1.12), the grade (per-channel gamma 1.03/1.0/0.95 for warm highs, additive violet shadow lift (0.010, 0.002, 0.020)·(1−col), saturation ×1.12 via luma mix), quadratic vignette ×0.85, and ±0.02 hash grain. **No chromatic aberration and no heat shimmer in this pipeline** — both smear pixel edges and fight the aesthetic; they belong to the illustrative Abyssal chain only.

Debug views are part of the production build, not scaffolding: a `uView` int switches the output to raw ALB / NRM / EMI, which is the fastest way to diagnose any asset that lights wrong (nine times out of ten the answer is visible immediately in the NORMALS view).

## 6. View system: zoom, pan, input

The camera is entirely a Pass B affair — `uScale` (float) and `uOff` (vec2, top-left-origin device pixels) — so **scrolling and zooming cost zero rebake and zero relight** beyond the per-frame passes already running. Rules proven in the demo: zoom range 1–10; fractional scale is permitted *during* an active pinch for smooth feel, then **snapped to the nearest integer on gesture end** so resting pixels are always uniform; zoom-about-focal-point via `newOff = f - ((f - off)/oldScale) * newScale`; pan clamped so the world edge never passes mid-screen (centered when smaller than the viewport); device-pixel-ratio capped at 2; default fit ≈ `round(fitScale*1.9)` so phones land at a readable 2–3x rather than a fit-floor of 1x.

Input contract: one pointer = gameplay (in the demo, carry the light; in Emberhold, tap-to-move / interact), two pointers = pinch zoom + pan simultaneously, wheel = integer zoom step at cursor, +/− buttons for one-handed mobile. The inverse mapping `screen → native → tile` (ignore z; error is ≤1 tile and acceptable for pointer targeting) is the picking function for all of this.

## 7. Actor system deltas (vs Dreadforge TDD §8)

The `getFrame(dir, t)` contract stands; the frame descriptor's payload widens from one canvas to a **G-sprite**: `{w, h, mask, alb, nrm, emiId}` per pixel (the reference stores parallel typed arrays; a 3-canvas form is equivalent). `plot`/blit writes all three world buffers, with per-pixel height assigned as `standingTileZ*ZH + (spriteH - localY)*0.55` — a linear vertical ramp that is crude but sufficient for light falloff across a 24–44 px sprite.

Per actor class:

**VoxelActor** — already fully served: face-exposure → normals, emissive voxels → EMI, per §3. Direction bakes and pose re-bakes per the Dreadforge TDD produce G-sprites instead of flat sprites; no other change.

**SheetActor (paper-doll player)** — sheets need a normal layer. Three acceptable sources, in order of preference: (a) authored normal-map sheets on the same frame grid (best; author against the §3 space and canonical values); (b) generated at load from the flattened composite via the creature routine — inward-distance gradient for rounded body volume, optionally modulated by a luminance gradient for surface detail; (c) flat `(0, 0.25, 0.95)` as a legal fallback that simply lights evenly. Emissive regions (enchant glows, eyes) are authored as a third sheet layer or metadata coordinates and land in EMI — never pre-brightened into albedo, same rule as before. The composite-then-outline order from the Dreadforge TDD applies to the normal layer too: generate normals from the *flattened* composite so equipment reads as one body.

**AdditiveSheetActor** — `normal`-blend overlays composite into both albedo and normal layers (equipment has its own surface orientation); `lighter` aura overlays write EMI only; `ramp-shift` variants remap albedo only and leave normals untouched (a corrupted variant is the same shape under the same light — exactly right).

**Validation additions** (extend `validateActorAsset`): normal texel magnitudes plausible (decoded length within 0.8–1.2), z ≥ 0 everywhere, outline pixels low-z, emissive stored ≤ the /3 encoding range, height layer monotone-ish down the sprite. Add "NORMALS debug view spot-check" to the asset acceptance checklist — it catches inverted-Y authoring mistakes (the most common sheet error) instantly.

## 8. World scaling: chunks

The demo bakes one 28×28-tile world (464×312 native). Production Emberhold scrolls; the chunk plan: bake G-buffer triplets per 16×16-tile chunk into a **texture atlas** (one triplet of, e.g., 2048² atlas textures holds ~24 chunks), maintain a 3×3 live ring around the camera, and bake ahead on idle frames (a chunk bake is a fraction of the demo's full-world ~80–150 ms). Pass A then either renders per-chunk quads into the lit FBO or, simpler and recommended first, renders one native-res viewport-sized lit buffer by sampling the atlas with a per-pixel chunk lookup folded into the uv math. Lights are world-anchored; cull to the ~6 nearest and pass ≤8 per frame. Nothing in Pass B changes at all.

## 9. Emberhold integration

**Day/night is done.** `uAmbient` driven by a time-of-day curve, plus a slow lerp of the ambient color endpoints (e.g., toward a deep red at dusk), is the entire system; at low ambient the world becomes pools of light, which is where this pipeline looks most expensive — design night gameplay around carried/placed lights. **Light sources are gameplay objects**: torches, braziers, the wisp-companion, spell effects are all just entries in the light array with flicker profiles; the demo's drag-the-light interaction is, almost verbatim, a wisp-companion mechanic. **Corruption** remains the palette/threshold system and now also owns the green flare lights and emissive speck density — corruption spread literally makes the world glow differently, at zero added cost. **Death sites** (per the Dreadforge TDD Phase 1a note) gain an ember-colored point light plus an EMI patch — now visible across half a screen in the dark, which is good game design for a corpse-run mechanic.

## 10. Performance budget

Bake: full 28×28 world with props and creatures, triple-buffer, ≈80–150 ms on mid mobile (hide behind the rebuild debounce; per-chunk in production is ~10–20 ms). Frame: Pass A is ~145k fragments with 3 texture fetches and 3 lights (trivial ALU), mipmap generation on a 464×312 HDR texture, Pass B at display res with 5 taps + grade — measured **61 fps with HDR on target hardware**, i.e., roughly half a frame of headroom at 60. The budget rules carried forward: no CPU per-pixel work per frame, ever; bakes only on state change; native resolution is the lever if a low-end device struggles (shrink the native buffer, never the post pass). HDR target requires `EXT_color_buffer_float`; the RGBA8 fallback path (already implemented) loses some bloom richness but nothing structural — keep it.

## 11. Module layout (extends Dreadforge TDD §8.5)

```
/src
  core/     rng.js  noise.js  palette.js  iso.js  normals.js(§3 constants+encode/decode)
  gen/      terrain.js  gbuffer.js(tile/face rasterizer → ALB/NRM/EMI)
            voxbake.js(per-face normals)  props.js  creatures.js(distance-normals)
  actors/   actor.js  voxelActor.js  sheetActor.js  additiveSheetActor.js  validate.js
  render/   gl.js(context, samplers, FBO)  lightpass.js  postpass.js
            view.js(zoom/pan/picking)  lights.js(array mgmt, flicker, culling)
  data/     ramps.js  animations.js  sheets/*.png + *.nrm.png + *.meta.js
```

## 12. Build order

(1) Port the reference implementation into the module layout with the world bake unchanged — parity checkpoint is the demo's four debug views matching. (2) Chunked atlas bake + scrolling camera through `uOff` (§8). (3) Actor contract with G-sprite payload; convert creatures to 2-frame-bob VoxelActors; wisp light becomes an entity. (4) SheetActor with generated normals (§7 path b), then authored-normal support and validation; swap in the paper-doll player. (5) Lights-as-entities with culling; torches/braziers content pass. (6) Day/night curve on ambient + corruption-progression hookup. Ship checkpoint after (4): a walkable, lit, scrolling world with the player character — everything after is content systems on a finished renderer.
