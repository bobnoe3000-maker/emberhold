# Art critic pass 11 — toward the reference: plan and scores

**Status: Plan (2026-10-03), iterating.** Each iteration below adds its numbers here when it ships.

The owner gave a reference to score against: a frame of a commercial mobile builder's art, a hand-finished 3D
village in autumn. It's another studio's work, so it stays out of the repo: it's kept in the scratch tree, used
only to measure and to look at, and described here in words. The aim is not to copy it but to score close to it
on the things it does well: buildings, vegetation, ground, light and characters.

## What the reference does

- **Light:** a warm low sun from the upper left. Lit tops are near white-gold, there are deep contact shadows
  at every base, and the scene is high-key. There's no murk, and no vignette swallowing the frame.
- **Palette:**
  - an autumn harmony: ochre-green grass, gold and orange foliage, terracotta roofs, cream plaster;
  - small saturated **blue** accents (shutters, banners, a tent) against the warm mass;
  - every material has three or four tones, lit to shadow.
- **Buildings:**
  - big readable silhouettes: round stone towers under conical roofs, a steep main roof, dormers, an
    overhanging timbered storey;
  - every roof shows its individual tiles or shingles, each a slightly different tone;
  - stone walls show their courses;
  - window frames and shutters are picked out;
  - every base is dressed: vines, barrels, crates, flowers.
- **Vegetation:**
  - **Crowns:** made of many leaf clusters, each lit on top and dark beneath, with white **birch** trunks.
  - **Wheat:** fields as volumes of stalks, not flat stripes.
  - **Small plants:** hay, pumpkins, bushes, and flower dots (purple, white) everywhere.
- **Ground:** almost none is left bare. Grass is softly varied, paths are warm dirt with soft edges, and low
  stone walls and fences run between them.
- **Characters:**
  - small beside the buildings: a figure is about an eighth of a house's height (ours: about a third);
  - chunky, with big heads and bright clothes;
  - busy at work: carrying, tending, talking;
  - with **animals** among them (cows).
- **Density:** something on almost every tile, layered in depth.

## Measured (the same pixel metrics on both)

`metrics.py` (scratch): each frame scaled to 600 px wide; the reference's crop is its playfield between the
logo and the ad card; ours is the playfield between the HUD and the party cards.

| | Reference | Our town (4 frames) | Our Vale (4 frames) |
|---|---|---|---|
| Mean luminance | **0.40** | 0.26–0.29 | 0.24–0.28 |
| Highlights (95th percentile) | **0.72** | 0.46–0.54 | 0.44–0.46 |
| Contrast (luminance s.d.) | **0.18** | 0.12–0.16 | 0.11–0.13 |
| Mean saturation | **0.49** | 0.29–0.39 | 0.33–0.42 |
| Colourfulness (Hasler–Süsstrunk) | **0.23** | 0.10–0.14 | 0.09–0.16 |
| Warmth (mean R − B) | **0.25** | 0.03–0.06 | 0.00–0.06 |
| Edge density (detail) | **4.6** | 3.1–5.4 | 2.2–2.7 |

Read plainly:
- Our town has the reference's **detail** already, in the square.
- Both of our scenes are about a third **darker**, with highlights that never get above mid-grey.
- They're **half as colourful**, and **neutral where the reference is warm**.
- The Vale has half the reference's detail.

## The rubric (1–10; the reference anchors the top)

| Area | Reference | Us, now |
|---|---|---|
| Light and colour | 9 | 3 |
| Shadow and depth (contact shadows, lit tops) | 9 | 4 |
| Buildings (silhouette, materials, dressing) | 9 | 5.5 |
| Trees and plants | 9 | 4.5 |
| Ground | 8 | 5 |
| Characters | 8 | 5 |
| Life and density | 9 | 4 |
| **Overall** | **8.7** | **4.4** |

**Target: 7.5 or better overall, no area under 6.** Measured targets on the Vale and the town:
- luminance ≥ 0.36;
- highlights ≥ 0.65;
- saturation ≥ 0.45;
- colourfulness ≥ 0.18;
- warmth ≥ 0.15;
- edge density ≥ 4 on the Vale.

## What stays

- **The pipeline:** baked sprites in a pixel-art deferred renderer at our native scale. We can match the
  reference's light, palette, materials and density, but not the pixel count of a hand-finished 3D render.
- **Figure size** (56 px): the game is played with a thumb on a phone, and the party has to read in a fight. A
  smaller crowd of townsfolk is a later question.

## The iterations (each measured, scored, committed)

1. **Pass 11a: light and colour.**
   - A brighter, warmer **day** (sun up and golden, ambient warmer, with a sky-blue fill).
   - A lighter vignette.
   - Grass and dirt palettes warmer and brighter, with the hard-edged camouflage blotches softened.
   - Bake gains up and desaturation off for trees, rocks and buildings.
   - Thornwick's roofs warm terracotta and its plaster cream, with blue shutter accents.
   - Expected: luminance, warmth, colourfulness and saturation to target.
2. **Pass 11b: shadow and depth.**
   - Contact darkening at every base (sprites and actors).
   - Day shadows less lifted.
   - A lit-top highlight from the normals in the light pass.
3. **Pass 11c: buildings.**
   - Tiled and shingled roofs, procedural in `buildkit.js`: rows of tiles, each its own tone.
   - Coursed stone, lighter window frames, shutters, banners.
   - A round tower with a conical shingle roof on the temple.
   - Base dressing: barrels, crates, flower boxes, vines.
4. **Pass 11d: trees, plants and ground.**
   - Leaf-cluster crowns with stepped light per cluster.
   - A birch, and more autumn gold and orange in the Vale's mix.
   - Wheat fields as stalk volumes.
   - Hay, pumpkins and denser flowers.
   - Grass as soft noise with warm sunlit patches.
5. **Pass 11e: life.**
   - Townsfolk at work with things in hand.
   - **Animals** (cows, sheep, chickens). These need a CC0 animal pack, Quaternius' animated animals, like
     the nature pack: the owner fetches it.

After each iteration: the town and Vale frames re-captured at the same spots, the metrics re-run, the rubric
re-scored, and a before/after sheet added below.

## Iteration 11a: light and colour (shipped 2026-10-03)

![11a, before and after: the square, the high street, the crossroads, the north-west](img/art11/a-light.jpg)

**What changed** (`src/render/daylight.js`, `renderer.js`, `outdoorpaint.js`):
- **Day:** a warm high sun, from [1.02, 0.94, 0.80] to [1.62, 1.38, 1.02], and a warm ambient, from
  [0.44, 0.45, 0.50] to [0.62, 0.57, 0.50]. Shadows lift less (0.45 → 0.3), so they read.
- **The grade is the sky's:** the vignette (`vig`), the drifting violet haze (`haze`) and a new saturation
  grade (`sat`) now come with the time of day:
  - day: 0.32 / 0 / 1.28;
  - dawn: 0.5 / 0.5 / 1.12;
  - dusk: 0.6 / 0.6 / 1.1, keeping its old fixed light;
  - night, and the dungeons: 0.85 / 1 / 1.
- **Grass:** its three tones blend smoothly by the noise, with a little dither. Hard thresholds drew camouflage
  blotches, and in the brighter day they read before anything placed on them.

**Measured** (the same four frames):

| | Reference | Before | 11a |
|---|---|---|---|
| Luminance | 0.40 | 0.24–0.29 | **0.37–0.44** |
| Highlights (p95) | 0.72 | 0.46–0.54 | 0.62–0.69 |
| Contrast (s.d.) | 0.18 | 0.11–0.16 | 0.14–0.19 |
| Saturation | 0.49 | 0.29–0.42 | **0.46–0.60** |
| Colourfulness | 0.23 | 0.09–0.16 | **0.19–0.25** |
| Warmth | 0.25 | 0.00–0.06 | **0.21–0.25** |
| Edge density, Vale / town | 4.6 | 2.4–2.6 / 3.8–5.4 | 2.8–3.3 / 4.3–5.7 |

**Score:**
- Light and colour, 3 → **7**: the lit tops still stop short of the reference's near-white gold.
- Ground, 5 → **5.5**: the blotches are gone; the grass is still a touch lime against the reference's ochre.
- Shadow, 4 → **4.5**: tree shadows now read on the brighter grass.
- **Overall, 4.4 → 5.1.**

**Next:** 11b, shadow and depth.
