# Art critic pass 1 — before / after

This is a critique of the prototype as it stood before the four-track art loop in
`docs/prompts/art-eval-loop.md`. Every scene was captured headless in the phone gameplay view
(390×844 @ dpr 3):
- the town square in three regions, plus the vale approach road;
- three overland views;
- the dungeon entrance, a level-2 room, and a party battle.

Figures were also checked in close crops and 12-frame battle bursts.

**Scoring:**

| Score | Meaning |
|---|---|
| 10 | indistinguishable from a shipped premium isometric game |
| 8.5 | shippable with nits |
| 7 | good indie |
| 5 | programmer art |

The scores are one critic's judgement from screenshots. No blind comparison has been run yet.

## Scores

| Track | Before | After | Gate (8.5) |
|---|---|---|---|
| Characters & animation | 4.5 | 6.5 | not met |
| Art assets | 6.0 | 6.2 | not met |
| Town design | 6.0 | 6.3 | not met |
| Overland layout | 5.5 | 6.5 | not met |
| Dungeon design | 5.0 | 6.0 | not met |

## What was wrong, and what changed

### Characters & animation (4.5 → 6.5)

**Before**
- **Motion:**
  - Walk frames advanced with wall-clock time, so feet skated at every speed.
  - Enemies drew at raw 20 Hz sim positions and visibly stepped.
  - Companions trailed on an exponential smoother.
  - Facing snapped between the 8 directions and flickered on diagonals.
- **Combat:**
  - There was no attack, hit or death animation, only a 3 px lunge.
  - A hit whitened the whole figure into a glowing ghost.
  - The dead sank and darkened.
- **Readability:**
  - The hero's wisp was a large bloom disc over the figure.
  - Figures had no contact shadow, so they floated on the ground.
  - In a melee, friend and foe were an indistinguishable grey clump.

**After**
- **New clips:** the actor lab bakes attack, hit and death clips for every figure, and a rise
  from the ground for skeletons. They come from the models' own animations:
  - attacks: chop, slice, dual stab, spellcast and crossbow;
  - hits: Hit_A;
  - deaths: Death_A for heroes, Death_C_Skeletons (collapsing into bones) for skeletons;
  - skeleton spawn: Spawn_Ground_Skeletons.

  Idle is now 8 frames and walk 10.
- **`src/render/anim.js`:**
  - Walk frames advance with distance travelled. Stride lengths are measured from the baked
    feet: hero 4.5 tiles and skeleton 3.2 tiles per cycle.
  - Facing turns through the octants in between, with hysteresis.
  - Attack and hit clips are triggered by sim counters (`atkN` / `hitN`); death plays once and
    holds its last frame.
- **Sim timing:**
  - Blows land, and bolts leave, 0.18 s into the swing, on the clip's impact frame.
  - A slain skeleton lies for 1.1 s.
  - Every unit keeps its last-tick position, so enemies, companions and bolts interpolate
    between steps.
  - Units keep 1.15 tiles apart.
- **Grounding:** every figure has a contact shadow. In battle, a thin steady ring marks the
  party in gold, the Ashbound in red and elites in orange.
- **Effects:**
  - A hit is a brief warm tint.
  - The slain crumble away with a dither dissolve.
  - The wisp is a small mote above the shoulder.
  - Damage numbers fan out instead of stacking.

**Still wrong**
- **Palette:** figures are low-contrast grey-violet, and a lot of detail is lost at 56 px in
  the dark.
- **Silhouettes:** the knight's visor slit reads as a white grin. Companion silhouettes are
  close to the hero's.
- **Missing content:** there are no townsfolk or service NPCs, no ability-specific clips or
  cast effects (Cleave looks like a plain swing), and no clip for a downed party member
  getting back up.
- **Outdoor tint:** outdoors, the purple dusk ambient tints the hero pink.

### Art assets (6.0 → 6.2)

**Before**
- **Strengths:** the half-timbered buildings with lit windows and the dungeon cobble and walls
  are the strongest work in the game.
- **Problems:**
  - Faceted low-poly tree crowns and pale lilac rocks clash with the grim direction.
  - About 1 % of all floor tiles carried a violet "obsidian shard", a leftover from the old
    gathering prototype. They littered every arena.

**After:** shards grow only at the base of room walls.

**Still wrong**
- **Trees and rocks:** they need a rework to match the buildings (the art-asset track).
- **Service buildings:** the temple ("Shrine of the Ember") reads as a barn, and the tavern,
  inn and shop share one silhouette.

### Town design (6.0 → 6.3)

**Before:** scattered trees could stand in front of houses and the bridge on the approach
road.

**After:** sightline wedges keep houses and the bridge readable.

**Still wrong**
- **Framing:** in portrait, the square is cramped at the top; the temple and inn are cut by
  the frame.
- **Lifeless:** the square has no NPC life.
- **Regions:** they differ only in tone.

### Overland layout (5.5 → 6.5)

**Before**
- Trees were fit-checked with a negative margin, so they overlapped each other and stood on
  the roads.
- A grove hid the Old Barrows door, and the hero at the door drew as an x-ray silhouette.

**After**
- Trees keep a tile of verge from roads and never overlap.
- A clear wedge in front of every landmark (Barrows door, keep, mine, camp, crossroads,
  Thornwick gate) is sized for the wide, tall groves.

**Still wrong**
- Large empty meadow patches.
- Thornwick's gate is a lone wall section.
- Forest density is uniform.

### Dungeon design (5.0 → 6.0)

**Before**
- **Props:**
  - The so-called "doorway braziers" actually stood in the middle of the room.
  - Decor was dropped at random into the fighting floor.
  - The shard noise was everywhere.
- **Rooms:** arenas were vast, identical cobble fields with no landmarks.

**After**
- Braziers flank each real doorway (where a corridor enters), one step inside.
- Spires, monoliths and totems stand against the walls, 12+ tiles apart.
- Chests and shrines sit against a wall, away from the doorways.
- The arena floor stays open.

**Still wrong**
- Rooms are still big and samey: no centrepiece variety (pillars, sarcophagi, collapsed
  vaults, rugs, bone piles) and no per-room identity.
- The low weathered walls read as rubble.
- Skeletons spawning far from any light are hard to see.

## Verification

- Tests: `node smoke-test.mjs` and `node render-smoke-test.mjs` pass. The solo room-hold and
  room-level checks are unchanged.
- Balance: re-run after the wind-up and spacing changes, and still within the room-level
  targets.
- Captures: 10-scene before/after set and battle frame bursts, with no page errors. The one
  404 (a missing favicon) is fixed.

## Next (per the art-eval loop)

1. **Characters:** lift figure value and contrast; fix the knight visor; add townsfolk and
   keepers; add ability clips and effects; give companions distinct silhouettes.
2. **Art assets:** replace the faceted tree crowns and lilac rocks; give each service building
   its own silhouette.
3. **Dungeon:** add room archetypes with centrepieces and taller, intact wall stretches; light
   the spawn points.
4. **Town:** reframe the square for portrait; add NPC life.
