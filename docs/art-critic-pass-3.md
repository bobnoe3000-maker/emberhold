# Art critic pass 3 — characters, NPCs and movement

This pass had three goals:
- review the characters and NPCs (the Ashbound);
- make movement and travel **much more fluid**;
- make walking **10 % faster**.

It follows `art-critic-pass-2.md`.

## How it was measured

Fluidity was measured, not judged by eye. Two new dev tools made that possible:
- **Manual clock** (`?dev&manual`): the page stops driving its own frames. A capture script
  calls `globalThis.__frame()` at exact 60 fps steps, so traces don't depend on how fast the
  machine renders.
- **Motion trace** (`globalThis.__trace`): the renderer logs each frame:
  - the snapped camera and the exact camera;
  - the hero's position and walking flag;
  - each party member's screen position, animation frame and facing.

Two walks were traced for 6 s each, with two companions:
- a **compass walk on the overland road**;
- a **dungeon walk through a corridor to the next room**, which has corners.

Walk GIFs were also taken at 30 fps on the same clock for a visual comparison.

## Before → after

| Measure | Before | After |
|---|---|---|
| Hero walk speed | 8.0 tiles/s | **8.8 tiles/s** (+10 %) |
| World judder on screen (mean frame-to-frame change of the camera's rounding error, native px) | 0.38 road · 0.17 dungeon | **0** |
| Frames where the world froze while the hero moved (dungeon) | 29 / 307 | **0** (the world moves every frame) |
| Hero stall mid-walk (dungeon) | a 1.2 tiles/s dip at a waypoint | **none** (only braking into the goal) |
| Companion walk↔idle flicker (per second walking, worst companion) | 2.3 | **0.2** |
| Companion screen jerk (mean second difference, native px, worst) | 0.61 | **0.04** |
| Companion stuck behind a corner, then teleported | yes (an 83 px jump) | **no** |

The hero's own on-screen shimmer is ±½ native px, the same before and after. A pixel-art
sprite can only land on the world's pixel grid, so either the world or the hero carries
that rounding. The world now scrolls smoothly and the hero keeps the unavoidable half
pixel. Before, both jittered.

## What changed

### Movement (sim)

- **Faster, with a velocity.** Previously the hero started and stopped instantly and turned
  on the spot. Now:
  - the hero walks at 8.8 tiles/s and reaches full speed in about 0.15 s (`ACCEL` 60);
  - it stops in about 0.1 s (`BRAKE` 85);
  - the heading turns at 14 rad/s, so a stick flick or a path corner becomes a short curve;
  - a hard reversal brakes through the turn;
  - walls kill the blocked axis of the velocity, so the hero slides along them.
- **Tap and compass walks.**
  - **Before:** the hero stopped for a whole tick at every waypoint and shortened the step
    before it.
  - **After:** paths are string-pulled as before, then steered by *pure pursuit*. The hero
    heads for a point 1.1 tiles ahead along the path, so corners are arcs. It brakes
    smoothly into the goal.
- **Companions follow with a velocity.**
  - **Before:** each companion ran to its station, stopped within 0.8 tiles, then set off
    again. The station swung across instantly whenever the hero turned.
  - **After:** each matches the hero's velocity plus a spring toward its station, eased and
    capped. The formation's heading turns over about 0.35 s.
  - **Corners:** a station inside a wall is pulled in toward the hero. A companion whose
    station is round a corner follows the hero's breadcrumb trail instead of pressing into
    the wall. Separation is a gentle nudge while walking, not a shove.
- **Battle stepping eases too.** Party and Ashbound speed ramps up over about 0.1–0.2 s
  instead of starting at full. Party battle speeds are also +10 %.
- **Balance re-checked:**
  - same-level rooms still cost 23–28 % HP per wave, including a party of three;
  - a room three levels above you still defeats you;
  - a solo fighter still holds a level-1 room for 10 minutes.

### Camera (renderer)

- **Sub-pixel scrolling.** The game renders at native resolution, where one pixel is
  3 CSS px, and upscales.
  - **Before:** the camera snapped to whole native pixels, so the world stepped in an
    uneven 1-1-2 cadence (about 9 device px at a time on a modern phone).
  - **After:** the window is rendered at the camera rounded up. The upscale pass then
    shifts the image back by the fraction, so the world glides. Figures land on the
    nearest pixel.
- **Overlays follow the exact camera.** Place labels, the goal ring, pips and floating
  numbers stay glued to the gliding world. Tap hit-testing uses the exact camera too.

### Animation

- **Stops finish the stride.** Stopping used to pop from mid-stride straight to idle. Now
  the walk plays on, faster, to the next frame where the legs pass under the body (20 % and
  70 % of the cycle, measured from the atlases), for at most 180 ms.
- **Walks start on a passing pose.** A walk from a standstill used to resume mid-stride
  from wherever the last one stopped. It now starts on a passing pose, alternating legs.

### Characters and NPCs

- **The knight read as a pale pink-white ghost.** The hero's carry light sat at chest
  height, inside his own figure. Warm light over lavender ambient on light-grey steel
  flattened him out.
  - The light now rides with the ember wisp above the shoulder.
  - Figures take the hero's own light at 55 %; the floor keeps the full pool.
  - The knight has his own grade: gain 0.47, contrast 1.3.

  His steel now reads grey, with plate and visor detail.
- **Struck skeletons flashed a pink haze.** The hit tint washed the whole sprite. A hit is
  now a hot rim on the silhouette (also written to the emissive plane, so it glows) with
  only a light warm tint inside. It reads as an impact, not a colour change.

## Scores (characters and animation track)

Scores are one critic's judgement from captures; no blind comparison has been run.

| Track | Pass 2 | Pass 3 | Gate (8.5) |
|---|---|---|---|
| Characters & animation | 7.2 | **7.8** | not met |

## Still wrong (ranked)

1. **The hero shimmers ±½ native px while the camera glides.** This is inherent to
   pixel-snapped sprites. A higher native resolution for figures only, or sub-pixel
   sprite sampling, would remove it at some cost to crispness.
2. **The run cycle is used for walking.** At 56 px, the front view barely separates the
   legs. A dedicated walk bake (`Walking_A`) with a stronger stride would read better at
   this speed.
3. **Skeletons have no idle variety or glances,** unlike the party. Waiting Ashbound stand
   frozen between swings.
4. **There are no townsfolk or service keepers,** as in pass 2.
5. **Tap arrival.** A tap walk now brakes into the goal, but a chest or shrine use still
   triggers on arrival with no reach or turn gesture.

## Verification

- **Tests:** `node smoke-test.mjs` and `node render-smoke-test.mjs` pass.
- **Balance:** checked with the room-level harness (`scratchpad/roomlv.mjs`); results are
  above.
- **Traces:** before and after, on the manual clock, with the numbers in the table above.
- **Captures:** walk GIFs before and after (dungeon corridor, party of three), a knight
  close-up, and slow-motion battle bursts for the hit rim. No page errors.
