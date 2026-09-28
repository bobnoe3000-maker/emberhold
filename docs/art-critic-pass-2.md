# Art critic pass 2 — before / after

This pass continues the loop from `art-critic-pass-1.md`, working through that report's
"still wrong" list plus one direct request: characters and skeletons fought too close
together.

The capture set is the same as pass 1: the phone gameplay view at 390×844, dpr 3, across town,
overland and dungeon, plus battle frame bursts. The scale is also the same (10 = shipped
premium iso, 8.5 = shippable, 7 = good indie, 5 = programmer art). Scores are one critic's
judgement from screenshots; no blind comparison has been run.

## Scores

| Track | Pass 0 | Pass 1 | Pass 2 | Gate (8.5) |
|---|---|---|---|---|
| Characters & animation | 4.5 | 6.5 | 7.2 | not met |
| Art assets | 6.0 | 6.2 | 7.0 | not met |
| Town design | 6.0 | 6.3 | 7.0 | not met |
| Overland layout | 5.5 | 6.5 | 6.9 | not met |
| Dungeon design | 5.0 | 6.0 | 6.8 | not met |

## What changed

### Spacing in battle (requested)

**The problem.** A 56 px figure is far taller than a tile is deep: one tile front-to-back is
only 4 px on screen. Round world-space spacing therefore left fighters stacked into one blob.

**The fix:**
- **Melee stations:** attackers take stations beside their target, in this order:
  1. screen left and right;
  2. the four diagonals;
  3. an outer ring if all six are taken.

  Stations already occupied on screen by another unit are skipped. Skeletons prefer the
  nearest party member who still has a free station.
- **Screen-space personal space:** each unit keeps a 32 × 16 px ellipse on screen, and the
  push is mapped back into the world. The hero never moves, so others take the full
  correction.
- **Longer reach to match:** fighter and skeleton warrior 3.0 tiles, rogue and minion 2.8.
- **Result:** in a 3-minute headless party battle, heavy on-screen overlaps fall from 45.5 % to
  7.3 % of nearby pairs.
- **Balance:** unchanged within the room-level targets.

### Characters (6.5 → 7.2)

- **Knight's white grin:** the bake painted every eye mesh flat white, which showed through
  the visor as a grin. Heroes now keep their painted eyes; only glowing-eyed skeletons paint
  them.
- **Pink tint:** the grim pass cut green hardest, which gave every figure a magenta cast that
  dusk light turned pink. It now uses a cool neutral tint and a gentle contrast curve.
- **White speckles:** bright texture pixels (fur trim, bone) used to pass through as pure
  white. They are graded now, and only the emissive eye pixels stay hot.
- **Brightness:** albedo gain rose from 0.5 to 0.56. Skeletons get their own grade (gain 0.62,
  less desaturation) so bone stays the brightest read in the dark.

### Town (6.3 → 7.0)

- **Temple rebuilt:**
  - dressed stone;
  - bell tower moved to the front-left, where the camera sees it (it was hidden behind the
    nave);
  - an arched door with steps and lanterns, under a lit rose window;
  - lit lancets between buttresses.

  It reads as a church in every region.
- **Shop:** gains a forge lean-to with a glowing hearth and an anvil.
- **Tavern:** gains a covered porch with trestle tables and lanterns.

  The shop, tavern and inn no longer read as twins.
- **Labels:** they no longer slide under the top HUD. All four services and their labels fit
  in the portrait frame above the service bar.

### Art assets (6.2 → 7.0)

- **Foliage:**
  - crowns are welded before the jitter (the old per-face jitter cracked them into shards);
  - smooth-shaded, with a dark underside and a lit top;
  - broadleaf trees are broad clouds of clumps with visible limbs;
  - pines are overlapping boughs.
- **Rocks:** warm dark field-stone with moss. The old pale grey read lilac under dusk.
- **Dungeon furniture:** new pillars, broken pillars, sarcophagi and bone heaps.

### Overland (6.5 → 6.9)

The clear wedge in front of each landmark now scales with what's placed:
- groves: 80
- trees: 62
- rocks: 30

A grove's crowns reach about 30 tiles up-screen and had covered the Barrows door again after
the footprint change.

### Dungeon (6.0 → 6.8)

- **Room themes:** every fighting room draws one, with furniture kept to the thirds so the
  middle of the arena and the corridors stay open:
  - **colonnade:** two rows of pillars, a few fallen;
  - **crypt:** sarcophagi down both sides, bones at the walls;
  - **ossuary:** bone heaps around broken pillars.
- **Special rooms:** the descent room rings its gate with four pillars; the entrance stays
  bare.

## Still wrong (ranked)

1. **Characters:**
   - no townsfolk or service keepers;
   - no ability-specific clips or effects (Cleave, Backstab and Firebolt share generic
     swings);
   - companions' silhouettes are still close to the hero's;
   - fine detail is lost at 56 px.
2. **Dungeon:**
   - the low weathered walls read as rubble;
   - skeletons spawning far from any light are hard to see;
   - the room themes share one tileset.
3. **Town:**
   - there is no life in the square;
   - regions differ only in tone.
4. **Overland:**
   - large empty meadows;
   - Thornwick's gate is a lone wall section;
   - uniform forest density.
5. **Art assets:**
   - pines are still dark cone stacks;
   - mountains are faceted;
   - there are no dungeon floor decals (rugs, grates, blood, cracks) to break up the cobble.

## Verification

- **Tests:** `node smoke-test.mjs` and `node render-smoke-test.mjs` pass.
- **Balance:** re-checked after the spacing and obstacle changes. At-level rooms hold at a
  20–30 % HP cost per wave, and three levels under falls.
- **Captures:** no page errors.

## Pass 2b — roads, bridges and streams

This pass started from a player screenshot of the Barrows road, where the bridge lay in the
river.

| Found | Fix |
|---|---|
| The **south bridge** (Barrows road) used the `bridge_0` sprite, which spans y, where the river also runs ~+y, so it lay *along* the river. The road met it at an angle and ran into the water. | Bridges are axis-aligned, so each road now crosses its bridge on a **straight run along the bridge axis**, reaching past both ramps. Both overland bridges are `bridge_90` (spanning x), placed where the river runs ~+y, across them. |
| The **north bridge** spanned the river but the road met both ends at an angle. | The road runs straight through it: town → (104,142) → (136,142) → the crossroads. |
| The **town bridge** was hidden behind the houses south of the road, which stood in front of it on screen. | All houses stand north of the road (behind it on screen), bar one far to the south-east. |
| **Wheel ruts curled into rings** at every bend, join and road end: the first road segment found painted the pixel, and near a segment's end the lateral offset is radial. | The **nearest** segment paints the pixel. Where its nearest point is a segment end, the road is packed dirt with no ruts. |

**Checks:**
- Every point where a road passes over water now lies on a bridge deck (18 of 18 samples).
- Headless walks cross both overland bridges.
- The smoke tests pass.

**Open issues:**
- Bridges only come in two orientations, so roads must bend to meet them. A diagonal bridge,
  or a ford for small streams, would free up road layouts.
- The river banks are a single uniform outline, with no reeds, stones or eroded patches.
- Road ends at sites are plain dirt caps. They could fade into trampled grass.

## Pass 2c — grainy characters

This pass followed a player report that character and NPC art looked grainy. It had three
causes:

| Cause | Fix |
|---|---|
| **Texture aliasing in the bake.** Figures were rendered at 1× with no antialiasing, so each 56 px sprite pixel took one arbitrary texel of a detailed texture. That read as salt-and-pepper speckle on armour, cloth and bone. | The actor lab renders every pass at **4× and area-averages down**. Colour is averaged in ~linear light so edges don't darken, normals are averaged and renormalised, and coverage must reach 50 %. A **despeckle** pass then replaces any pixel unlike all 8 neighbours with the mean of its three closest, so detail spanning 2 px or more survives. |
| **Blotchy shading.** The per-pixel normals were single raster samples of faceted meshes. | The supersampled normals average the surface under each pixel, giving smooth light across plates and folds. |
| **Shimmer.** Actors' faint self-light went through the shader's per-pixel random-phase ember flicker. Animated film grain also crawled over the small figures. | Actor self-light is flagged **steady** (the EMI alpha channel). The film grain is static, at a lower amount. |

All eight atlases were rebaked. The bake takes 104 s, up from 35 s.
