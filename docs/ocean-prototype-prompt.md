# Ocean — World Look Prototype: prompt evaluation and recommended prompt

Date: 2026-09-04. Branch: `claude/ocean-pirate-game-prototype-q326tv`.

This document does two things:

1. Evaluates the supplied prompt (a Cities: Skylines II style city-builder
   orchestration prompt) against the stated goal: a mobile-first, portrait-first,
   open-world pirate-captain exploration game whose **first prototype must nail an
   AAA look** (Sea of Conquest / Dredge quality, more top-down).
2. Provides a replacement prompt that is built around that goal.

---

## Part 1 — Evaluation of the supplied prompt

### What is worth keeping

| Kept idea | Why it survives |
|---|---|
| Architecture before feature code | Still right. A world renderer with 10+ subsystems needs a shared data model and API contracts up front. |
| Verification loop before the game (headless screenshot tool, PNG + JSON) | The single best idea in the prompt. "No agent may claim what it hasn't screenshotted" is the rule that keeps quality honest. |
| Per-module showcase modes | Lets the critic judge the ocean, sky, or port in isolation. |
| Independent critic that writes no code, scores against real references | Correct mechanism. The reference set and rubric just need to change. |
| Blind A/B judging at the end | Good final gate. |
| Seeded determinism, metres, +Y up | Matches this repo's existing invariant ("same seed = same world, on every device, forever"). |
| CC0-only asset policy (Poly Haven, ambientCG, procedural) | Necessary. Poly Haven HDRIs and PBR sets are the fastest path to photographic materials. |
| STATUS.json persistence, /loop, "never inflate scores", "do not ask questions" | Keep verbatim. |
| Integrator as the only agent that touches core | Keep. |

### What is wrong for this goal

1. **Wrong domain.** Every named subsystem (roads, zoning, buildings, traffic,
   demo city) and every reference (Cities: Skylines II) is a city builder. None of
   the subsystems that make or break an ocean world are named: ocean surface,
   shoreline, sky/atmosphere, sun and moon, volumetric-feeling fog, weather, ships,
   wakes, port lighting at night. A builder given this prompt will spend its first
   wave building roads.

2. **Wrong platform and budget.** "≥50 fps at 1080p, ≤1500 draw calls" is a desktop
   budget. A mid-range phone in portrait needs roughly 60 fps at a device-pixel
   resolution around 1170×2532 with a render-scale knob, on the order of 150–300
   draw calls, compressed (KTX2) textures, and a thermal budget. The prompt never
   mentions portrait, touch, safe areas, or a phone. Nothing in it would stop an
   agent from delivering a mouse-driven desktop app.

3. **Wrong order for a "look first" goal.** The prompt fans out to 13 modules in
   wave 1, including simulation, UI, audio, and traffic. The stated goal is to
   validate the world's look. That is best proven by one vertical slice, a single
   "hero vista" that hits the bar, before any breadth. Fanning out before the look
   is proven multiplies the number of agents producing programmer art in parallel.

4. **"AAA" and "programmer art" are not defined.** The critic scale (10 / 8.5 / 7 / 5)
   is fine, but a score with no rubric drifts. The new prompt spells out the
   attributes of the look (materials, light, atmosphere, water, scale, motion)
   and gives a concrete programmer-art checklist that fails a module automatically.

5. **Headless Chrome is the wrong perf oracle.** Headless Chrome on a server runs
   SwiftShader (software GL). It is fine for screenshots and console errors, but
   its fps and draw-call numbers say nothing about a phone. The prompt treats them
   as the perf gate. The new prompt separates "look" verification (headless is fine)
   from "perf" verification (real device via remote debugging, or a GPU-backed
   headless run, with headless numbers labelled as smoke only).

6. **No mention of the existing repo.** This repository is a zero-build canvas
   isometric pixel-art game. Its renderer cannot be bent into photographic PBR. The
   new prompt says explicitly: new renderer stack in a new folder, keep the
   headless-sim and seed-determinism discipline, do not touch the existing game.

7. **Reference material is hand-waved.** Blind judges need actual Sea of Conquest
   and Dredge frames at matching time of day and camera. The prompt never says who
   collects them or where they live. (They are copyrighted: they must live in a
   gitignored folder for comparison only and never ship.)

8. **Camera is unspecified.** "More top-down" is the one framing constraint the
   goal gives, and it drives everything (LOD distances, what surfaces need detail,
   how much sky is visible, how much shoreline matters). The new prompt fixes the
   camera model first.

### Verdict

Keep the process skeleton (architecture → verification loop → build → critic →
blind judges → loop). Replace the domain, platform, budgets, ordering, rubric, and
reference set. The replacement prompt follows.

---

## Part 2 — Recommended prompt

Copy everything below this line into the agent.

---

# Ocean — AAA World Look Prototype (mobile, portrait-first)

## Goal

Build the world of an open-world pirate-captain exploration game, mobile-first and
portrait-first, viewed from a tilted top-down camera. Quality target: Sea of
Conquest and Dredge, more top-down. **This prototype exists to nail the look and
feel of the world.** No combat, economy, quests, or progression. A player ship
that can be steered with one thumb is in scope only because it proves wakes,
spray, hull-water interaction, and camera follow.

The bar is AAA and it is non-negotiable:

- Photographic PBR materials with real roughness/normal/AO maps. Sand, wet sand,
  rock, weathered timber, tarred hull planks, canvas, rope, rusted iron, terracotta
  and lime-washed walls. Never a flat colour where a material should be.
- Physically plausible sun and sky: atmospheric scattering, a real sun disc, aerial
  perspective that desaturates and blues distant islands, correct shadow direction
  and colour at every hour, a night sky with stars and a moon that actually lights
  the water.
- A living ocean: directional swell plus wind chop, sub-surface colour in shallows,
  crest and shore foam, wet-sand shoreline transition, sun glitter, reflections of
  the sky and of port lights at night, ship wakes and bow spray.
- Islands and ports that read as places: cliffs, beaches, vegetation that moves in
  the wind, docks, lanterns, smoke, gulls, laundry, sails. Warm artificial light
  against cool night.
- Believable weather: clear, overcast, rain, squall, fog, and the transitions between
  them, driven by a wind field the ocean and sails respond to.
- Never programmer art. The checklist under "Definition of programmer art" fails
  a module automatically.

## Platform, camera, and budgets

- **Device**: mid-range phone (reference: a 2023 Android with an Adreno 6xx-class
  GPU, and an iPhone 12). Portrait first; landscape must also work. Safe-area aware.
- **Input**: one thumb. Drag to steer. Pinch to zoom within a fixed range. No
  keyboard or mouse in the shipped UI (a debug panel may use them).
- **Camera**: tilted top-down follow camera. Pitch between 50° and 65° from the
  horizontal, yaw free but damped, zoom range roughly 40 m to 400 m of visible
  water width in portrait. Horizon is visible only at the flattest pitch and widest
  zoom. Fix this model in week one; every LOD and detail decision depends on it.
- **Budgets on the reference device** (measured, not estimated):
  - 60 fps sustained, 30 fps hard floor during weather transitions
  - ≤ 300 draw calls per frame, ≤ 1.5 M triangles per frame
  - ≤ 256 MB GPU texture memory, all colour/normal/ORM textures KTX2 (Basis/ASTC)
  - ≤ 25 MB initial download to first interactive frame, streaming after
  - no visible thermal throttling over a 10-minute sail
- **Render scale** knob (0.6–1.0 of device pixels) with the post stack always at
  native resolution so UI and bloom stay crisp.

## Stack (decided, do not revisit)

- Three.js (current release), WebGL2 baseline, WebGPU path optional and behind a flag.
- Vite + TypeScript. This is a new app in a new folder `ocean/` at the repo root.
  The existing Emberhold game at the repo root is not touched and keeps deploying.
- Assets: glTF 2.0 with meshopt or Draco compression, KTX2 textures, HDRIs from
  Poly Haven. Sources allowed: Poly Haven, ambientCG, Sketchfab CC0 filter, or
  procedural. Record every asset in `ocean/assets/CREDITS.md` with source URL and
  licence. Nothing else ships.
- Ships: if no CC0 hull of sufficient quality exists, build a procedural brig
  (hull loft from stations, planking normal map, rigging as instanced tubes,
  cloth-sim sails or vertex-animated sails). A stylised low-poly kit is not acceptable.
- Carry over from the existing repo: the headless simulation discipline (`ocean/src/sim`
  never imports DOM or Three.js and runs under `node`), seeded RNG only, and
  "same seed = same world on every device".

## How to work

### 0. Look bible and reference board first

Before any code, write `ocean/LOOK.md`:

- Ten named reference frames (Sea of Conquest, Dredge, plus real photographs of
  Caribbean and Mediterranean harbours at dawn, noon, golden hour, blue hour, night,
  rain). For each: what the light is doing, what the water is doing, what the
  material story is, what the palette is. Copyrighted frames go in `refs/`
  (gitignored) for comparison only and never ship. Photographs used as reference
  are described in words in LOOK.md so the document stands alone.
- The **hero vista**: one island port at golden hour, sun 12° above the horizon,
  camera at 58° pitch, 120 m visible width, the player's brig approaching the
  harbour mouth, wind 6 m/s from the port quarter. This one shot is the first
  thing built and the first thing judged.
- A time-of-day sheet: what the sky, sun, shadows, water, and artificial lights
  look like at 05:30, 08:00, 12:00, 17:30, 19:00, 22:00, 02:00.
- A weather sheet: clear, overcast, rain, squall, fog, and what each does to
  visibility, water colour, sky, sails, and sound.
- A materials list with the specific Poly Haven / ambientCG sets to use.

### 1. Architecture

Write `ocean/ARCHITECTURE.md` before feature code:

- One folder per subsystem under `ocean/src/`:
  `core` (renderer, frame scheduler, camera rig, time-of-day clock, quality tiers),
  `sky` (atmosphere, sun/moon/stars, clouds),
  `ocean` (surface, shore blending, foam, wakes, spray, buoyancy queries),
  `terrain` (island heightfields, cliffs, beaches, materials, LOD),
  `vegetation` (palms, scrub, grass, wind response, instancing),
  `port` (docks, buildings, props, lanterns, smoke, decals),
  `ships` (hull, sails, rigging, flags, wake emitters, buoyancy),
  `weather` (state machine, wind field, rain, fog, lightning, transitions),
  `lighting` (cascaded shadow maps, exposure, IBL from the sky, local lights),
  `post` (tone mapping, bloom, colour grade, vignette, film grain, optional DoF),
  `sim` (headless world state, seed, ship physics, no DOM),
  `input` (touch steering, pinch zoom, safe areas),
  `ui` (minimal HUD, debug panel, time and weather sliders),
  `verify` (screenshot harness and perf probes),
  `world` (the demo archipelago that assembles everything),
  `audio` (deferred to a later wave, but the folder and API exist).
- Shared world data model: metres, +Y up, seeded RNG only, a single `WorldTime`
  (day fraction plus date) and a single `Wind` (vector field sampled at a point)
  that every module reads from the same source.
- For every module: its public API, the events it emits, what it reads from the
  world model, its showcase scene, its performance share of the frame budget.
- Module isolation: a throwing module is disabled and logged; the world keeps
  rendering. No module may import another module's internals; only its public API.
- Quality tiers (low/medium/high) declared per module so the integrator can hit
  the budget on the reference device without redesign.

### 2. Verification loop before the world

Build `ocean/src/verify` and `ocean/tools/shoot.mjs` before any visual module:

- Headless Chromium (already installed in this environment) loads the app, waits
  for a `window.__ready` promise, applies a JSON scene spec (camera preset,
  time-of-day, weather, wind, seed, quality tier, device preset), waits for
  textures and shaders to settle, and writes `PNG + JSON`.
- Device presets emulate real viewports and DPR: portrait phone (390×844 @3),
  landscape phone, and a 1080p desktop for critic zoom-ins.
- The JSON log records console errors and warnings, draw calls, triangles,
  texture memory, shader compile count, frame time percentiles over 120 frames,
  and the resolved scene spec.
- Headless fps is **smoke only** and is labelled as such in the JSON. Perf gates
  use a real device through Chrome remote debugging when one is reachable, and
  otherwise a GPU-backed run; if neither exists, the perf gate is reported as
  "not measured", never as passing.
- A contact-sheet command renders the same camera at the seven times of day and
  five weathers into one image, so a critic sees the whole cycle at a glance.
- Every module ships a showcase scene, reachable by `?showcase=<module>`.
- Rule: **no agent may claim any visual result it has not screenshotted and
  looked at.** The screenshot path goes in the report.

### 3. Vertical slice: the hero vista, before any fan-out

One builder (or at most three: sky+lighting+post, ocean, terrain+port) builds
the hero vista from LOOK.md. It is judged by the critic (step 5) until it
scores ≥ 8.5. Only a passing hero vista unlocks the fan-out. If it has not
passed after 4 rounds, stop and write down what is missing; do not fan out
around an unproven look.

### 4. Fan out ("ultracode")

Multi-agent orchestration, one builder per module, each owning only its folder,
waves ordered by dependency:

1. `sky`, `ocean`, `terrain`, `lighting`, `post`, `sim`, `verify` (extending it)
2. `vegetation`, `port`, `ships`, `weather`, `input`, `ui`
3. `world`: the demo archipelago (three islands, two ports, a reef, a sea stack,
   a sail between ports of 4–6 minutes), day/night cycle, weather transitions,
   the ship you steer.

Between waves, one integrator agent (the only one allowed to touch `core`, the
shared data model, and the build) applies builders' core-change requests, fixes
seams (shore blending, shadow cascades across water and land, fog across
everything, exposure consistency between modules), and holds the frame budget.

### 5. Critic gauntlet

After each builder round a separate critic agent, a brutal AAA art director who
writes no code, takes its own screenshots (its own scene specs, several times of
day, three weathers, three zoom levels, portrait and landscape) and scores
0–10 against the reference board. 10 = indistinguishable from the references,
8.5 = AAA with nits, 7 = good indie, 5 = programmer art. Pass = ≥ 8.5, zero
console errors, budget met or explicitly "not measured".

The critic scores against this rubric and reports each line:

1. **Materials**: real roughness variation, wear where hands and water touch,
   no tiling visible at any of the three zooms, normal maps read under raking light.
2. **Light**: sun colour and shadow length match the hour; shadow edges soften
   with distance; bounce light warms shaded sand; night is lit by moon and lanterns,
   not by an ambient floor.
3. **Atmosphere**: distant islands lose contrast and shift blue; fog has depth;
   the sky gradient near the horizon is right for the hour; sun glare and bloom
   are restrained.
4. **Water**: swell direction matches wind; shallows show the seabed; foam sits
   on crests and along shore, not painted flat; reflections are broken by the
   surface; the wake is attached to the hull.
5. **Scale**: the ship, the dock, the buildings, and the people-sized props agree;
   the camera height feels like a gull, not a satellite.
6. **Motion**: sails fill, flags stream, palms sway, gulls circle, smoke drifts
   downwind, lanterns flicker. Nothing is static that would move in life.
7. **Composition**: the hero vista reads as a painting; the eye goes to the port.
8. **Silhouette / squint test**: at thumbnail size the frame still reads.
9. **Consistency**: every module lives under the same sun and fog; no seam at the
   shoreline, no exposure jump when the camera crosses land.
10. **Mobile fit**: portrait framing works; HUD respects safe areas; text is legible.
11. **Errors and budget**: console clean; draw calls, triangles, texture memory
    within budget; measured device fps or an honest "not measured".
12. **Programmer-art checklist**: any hit is an automatic fail (see below).

Below 8.5, the builder gets the ranked issue list with the critic's screenshot
paths and goes again, up to 4 rounds per wave.

### 6. Final gate

A whole-world critic scores the demo archipelago on the full rubric across the
contact sheet and a 4-minute sail. Then blind judges receive pairs of frames
labelled only A and B (ours against Sea of Conquest or Dredge at a matching hour
and camera, order shuffled) and say which looks better and why. Report the raw
verdicts.

### 7. Loop

`/loop` until every critic passes. Persist scores, screenshot paths, open issues,
and measured budgets to `ocean/docs/STATUS.json` after every round so each
iteration resumes from the weakest module, never from scratch.

## Definition of programmer art (automatic fail)

- Untextured or flat-colour surfaces; default Three.js materials; a single albedo
  with no roughness or normal map on any surface larger than a hand.
- Visible texture tiling, texture seams, or stretched UVs at any critic zoom.
- Hard shadow acne, peter-panning, or missing shadows on ships or buildings.
- An ambient floor instead of sky lighting; nights that are grey rather than dark.
- Uniform "blue plane" water, foam painted as white stripes, a wake that is not
  attached to the hull, water that intersects the beach with a hard line.
- Billboard vegetation that does not move; instances with identical rotation.
- Popping LODs or vegetation fade-in inside the visible range.
- Fog as a single colour with no depth; sky as a gradient with no sun.
- Placeholder cubes, capsules, planes, or text labels in any critic screenshot.
- Anything the critic can identify as a well-known low-poly asset kit.

## Rules

- Never inflate scores. Report real numbers, failed rounds, and what is still
  missing. A "not measured" is always better than a guessed pass.
- Never edit another module's folder. Core and shared-model changes go through
  the integrator.
- Keep the dev server running and the app loadable at all times; other agents are
  screenshotting it. A change that breaks boot is reverted first and fixed second.
- Every visual claim comes with a screenshot path.
- Do not touch the existing Emberhold app at the repo root.
- Commit on every green round with a message naming the module and the score.
- Do not ask me questions. Make routine decisions yourself, state assumptions in
  `ocean/docs/DECISIONS.md`, and keep going.

## Done means

- `ocean/LOOK.md`, `ocean/ARCHITECTURE.md`, `ocean/docs/STATUS.json`,
  `ocean/docs/DECISIONS.md`, `ocean/assets/CREDITS.md` exist and are current.
- The hero vista and every module showcase score ≥ 8.5 with zero console errors.
- The demo archipelago runs on the reference device within budget, or the report
  states exactly which budget line is unmeasured or failed and why.
- The blind A/B results are reported raw, wins and losses.
