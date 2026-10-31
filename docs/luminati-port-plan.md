# Luminati as Emberfall's renderer: a plan

**Status: Plan of record, phase 0 built** (2026-10-31): the owner is staying with Luminati (§13). The owner's choices are in §11. Phase 0, the trial build, is
in the game behind the menu's Graphics setting (§12); the owner played it, and §13 orders what comes next. The prototype it builds on is
[lumina-prototype.md](./lumina-prototype.md) (`/lumina/`, architecture A16). Its decision row, A17, is proposed in
[architecture.md §11](./architecture.md#11-decision-log).

The owner asked to replace the current game with the Luminati engine, seen through Emberfall's iso camera, and:

- keep the UI: the navigation, the quest log, the day and night cycle, and the rest;
- keep both Luminati's assets and Emberfall's in reserve, so the original Emberfall art can come back later;
- recreate every Emberfall map in Luminati.

This plan says how. In short:

> **Luminati replaces Emberlit, and nothing else.** The game keeps its own sim, UI, story, sound and saves. Luminati
> becomes the thing that draws the world (light, shadow, water, weather, the hour), seen from our camera, and it never
> decides anything. Every map is built at runtime from the sim's own world, so what you see is what the sim walks.

---

## 1. The principle: swap the renderer, not the game

The prototype ran Luminati's whole game: its `Game.js`, combat, party AI, waystones, HUD and dialogue, with our people
painted in. The port does not.

Our game already owns those things, and they are what make it Emberfall:

- the deterministic sim with replayed, verified progression (A11);
- the balance contract (AGENTS.md rule 6);
- Fallen, the temple and the wipe;
- the sellswords, the board, the coach, quests from Ink, and the save shape.

A second combat or quest system would fork the rules from what the server replays.

The port therefore takes only Luminati's **engine and world-building layers**: the WebGL pipeline, the post chain,
lighting and climate, the terrain, water, the object builders and the set-piece kits. It drives them from our sim, the
way `src/render/renderer.js` drives Emberlit today.

What follows from that:

| Layer | Change |
|---|---|
| `src/sim/` | **None.** Replays, hashes, the smoke test's tamper cases and every balance gate stay as they are. This is the plan's biggest safety margin: the port can't move a number |
| `src/ui/` | Kept. The overlays, cards, journal, compass, world map, minimap, sky dial and menus stay DOM. Three imports move (§4) |
| `src/story/`, `src/audio/`, `src/persist/` | None. Audio's `onFrame` hook is honoured by the new renderer too |
| `src/render/` (Emberlit) | **Kept whole, in reserve** behind `?renderer=emberlit`, and the default until the cutover (phase 9) |
| `src/render3d/` (new) | The Luminati adapter: the same `createRenderer(canvas, sim, input)` contract (§3) |
| `src/vendor/luminati-80e1aa6/` (new) | Luminati's engine and world layers plus three.js r186, built once by a tool and committed (§2) |

Luminati's `Game.js`, `combat/`, `party/`, `story/`, `campaign/`, `siege/` and HUD are not loaded. Nor is its own
dialogue: ours stays.

---

## 2. Build and loading

The game has no build step (A1), and that holds. Luminati is source we pin, so:

- **A tool builds a vendored bundle.** `tools/render3d/build.mjs` checks Luminati out at its pin (as
  `tools/lumina/build.mjs` does now) and Vite-builds a **library**, not a page:
  - the engine and world modules the adapter imports;
  - three.js r186;
  - the build-time tags the prototype already proved (`vite.config.mjs`).

  The output is ES modules in `src/vendor/luminati-80e1aa6/`, mapped in the import map as `luminati`. It is committed
  and never edited, like `lumina/`. CI checks it is fresh, as it does compiled Ink.
- **A17** (proposed): Luminati MIT at `80e1aa6`, three.js r186, vendored as a prebuilt bundle; Vite a devDependency of
  the tool only. It supersedes A2's Emberlit-only rendering once the cutover lands.
- **First load.** The budget is under 2.5 MB before the title (architecture §9). The engine chunks Luminati's game
  would need measured, gzipped, in today's `lumina/` build:

  | Chunk | Gzipped |
  |---|---|
  | engine | 90 KB |
  | three.core | 51 KB |
  | Palette | 85 KB |
  | Props | 34 KB |
  | SetPieceKitParts | 33 KB |
  | SeasonKitParts | 38 KB |

  That's about 330 KB. The 193 KB CombatSystem chunk, the 96 KB Evermere and the 38 KB StoryRunner are not needed.

  The renderer loads behind the title screen (the title is DOM and the intro is its own canvas), so it costs no time
  to the first paint. Target: **≤ 450 KB gzipped for the renderer**, measured each phase.

---

## 3. The renderer contract

`main.js` and the dev pages call these. The adapter implements each one, or the UI stays as it is:

| Call | Today (Emberlit) | In Luminati |
|---|---|---|
| `render(alpha, now)` | stamp the G-buffer, light, composite | interpolate actors (`p.px → p.x` by alpha), update sprites and FX, `engine.step` with our clock (the prototype's manual stepping), render |
| `resize()` | canvas, zoom check | renderer size; the camera distance from the window's height (`view.js` `distanceFor`), so a figure stays 52 CSS px either way up |
| `holdSky(tod)` | hold the light at an hour (title at dusk, `?dev&tod`) | the same hour fed to Luminati's lighting instead of the sim's clock |
| `transiting` | a scene baking | a level building (§5): input held, as now |
| `refresh()` / `ready` | rebuild after a load; first bake done | rebuild the level from the sim's world; first level built and shaders compiled |
| `setCast(cast)` | actor atlases for the party | the same atlases cut into Sprite3D sheets (§6) |
| `enemyAt`, `npcAt`, `propAt`, `serviceAt`, `doorAt` | screen hit-boxes from the last frame | the same idea: each sprite's projected screen rectangle from the last frame, with a 44 px minimum target. Buildings and doors by a ray against the converter's footprint boxes |
| `screenToTile(sx, sy, z)` | `iso.js` `unproject` | a ray from the camera against the terrain's heightfield, then world `(X, Z) × 2` back to sim `(x, y)` |
| `minimapRect`, `plaques` | rectangles and labels for the DOM overlays | the same, from `Vector3.project` |
| `onFrame` (audio) | per frame | per frame |

**`iso.js` keeps working for directions.** Our view keeps the 45° yaw. At a 30° pitch the ground's vertical squash
is sin 30° = 0.5, which is exactly the 2:1 of `iso.js`. So `screenDirToWorld`, which main.js uses for the stick, gives
the same answer in both renderers. Only the position calls (`project`, `unproject`) move to the camera. The dev pages
(`dev/stage.js`, `dev/review.js`) stay on Emberlit: they review Emberfall's own art (§7).

---

## 4. What the UI keeps, and the three imports that move

Everything in the owner's screenshots is DOM in `src/ui/`, reading sim state and the calls above:

- the top bar: the place, the sky dial ("Night · −36 · dawn 3m"), gold;
- the minimap, the compass and its list of destinations, the journal and world-map buttons;
- the quest tracker;
- the party cards: along the bottom upright, stacked on the left sideways;
- the town menu, dialogue, the character sheet, the shrine, the tower, the sellswords, defeat, the step-out, and the
  title and intro.

None of it changes. The checks that guard it (the sky dial overlaps nothing, the square's menu is the same in every
town, the tap targets, the landscape cards) run against both renderers.

Three imports reach into `src/render/` from outside it. They move to a neutral module both renderers use:

- `weatherNow` and `holdWeather` (`render/weatherfx.js`, used by `ui/hud.js`, `audio/listen.js`, `main.js`);
- `PART_NAMES` (`render/daylight.js`, used by `ui/hud.js`).

They go to `src/world/` (`weather.js`, `daylight.js`), which reads the sim's clock and the season. Emberlit re-exports
them, so nothing it does changes.

**The day and night cycle stays the sim's.** The sim's clock is the hour. The sky dial reads it as now. The new renderer
maps the same 0..1 to Luminati's time of day (sun, moon, sky, fog, the lamps' night switch), using `daylight.js`'s
parts as the keyframes so dawn begins when the dial says it does. Weather the same: `weatherNow` to Luminati's
`Climate`/`Weather` (rain, snow, fog, wind). Dungeons hold their fixed hour, as the Old Barrows does.

---

## 5. Recreating every map

Every map in the game is built by the sim (`createSim`: `outdoor.js`, `regions.js`, `sites.js`, `road.js`), and the
dungeons differ per save seed and per floor. So the maps can't be authored once in Luminati's editor. Instead,
**converters** build a Luminati level from the sim's world at runtime: pure functions in `src/render3d/levels/`, the
grown-up form of the prototype's `levels.mjs`. That also keeps the two in step: a wall the sim walks round is a wall you
see.

Scale: one sim tile is half a Luminati unit (X = x/2, Z = y/2), as the prototype set.

| Map | Sim size (tiles) | Luminati (units) | Notes |
|---|---|---|---|
| Thornwick (the Vale's town) | 140 × 120 | 70 × 60 | the prototype's conversion, extended to every struct |
| Saltmere (the Fens) | 130 × 116 | 65 × 58 | water and stilts: Luminati's water planes |
| Ashgate (the Reach) | 140 × 120 | 70 × 60 | |
| Frosthold (the Heights) | 140 × 120 | 70 × 60 | Luminati's snow cover |
| The waystations | town-shaped, smaller | | the same town converter |
| The Vale overland | 260 × 260 | 130 × 130 | over the 128 limit (below) |
| The Fens overland | 240 × 240 | 120 × 120 | |
| The Reach and Heights overlands | 260 × 260 | 130 × 130 | **today they build the Hollow Vale's** (same name and counts). The port draws what the sim builds; giving them their own land is a design change for the GDD first, not part of this plan |
| The 11 dungeon sites | 95 × 108 (the Reedholm undercroft) to 266 × 272 (the Toadking's Mound) | 48 × 54 to 133 × 136 | per seed and floor; the Mound and the Scrag Warren (253 × 190) over the limit |
| The Mere Tower | 123 × 64 | 62 × 32 | its landings, waves and the punt |

**The 128 limit.** Luminati clamps a level to 128 units a side (`LevelFormat.js` `MAX_SIZE`). The clamp exists for
its editor and its `Nav` grid (1–2 ms for 128²); we use neither, since the sim does our pathing. Two remedies, decided
in the spike:

1. Crop the unwalkable margin (`PAD`) the sim builds round every outdoor map. Most overlands then fit.
2. Tag the clamp up to 160 at build time and measure terrain, shadows and draw calls at that size.

If neither holds on a phone, the converter splits a big map into chunks and builds them round the hero. That part is
ours: Luminati's `SpatialSplit` only kd-splits one level's terrain and props for culling, which helps at any size.

**How a struct becomes a thing** (one table per region, data in `src/render3d/levels/<region>.json`):

| From the sim | Luminati form |
|---|---|
| ground (grass, road, cobble, mud, water, snow) | terrain colour and height; water planes; Luminati's ground detail at a **quarter of its size** (the prototype's `GROUND_COVER`), no floating dots |
| walls, cliffs, dungeon walls | raised terrain (`k` heights) or wall objects; dungeon cells to floor and wall |
| houses and service buildings | Luminati's house and set-piece builders, styled by region from the world doc (canon first if a style is new). The building's door and service footprint are kept for `serviceAt` and `doorAt` |
| trees, rocks, fences, lamps, wells, signs | the nearest catalog object by kind, from the catalogue already built |
| chests, shrines, stairs, the punt | catalog objects, picked by `propAt` |
| lights | lamps and torches, within Luminati's 12-lamp budget; big maps share them through `LightPool` |

**Each level is checked against the sim** by a `node:test` per map and a sample of seeds per site:

- every walkable tile has no solid object standing on it;
- every blocked tile looks blocked;
- every door, service and prop the sim knows has a pickable footprint.

The Frontier (`/frontier.html`) is its own sandbox with its own sim and renderer. It is **out of scope**; it can follow
once the game is across.

---

## 6. Actors, animation and effects

- **Actors** come from our atlases, as in the prototype (`sheets.js`): eight screen-octant rows, 32 px to a unit,
  their foot on the ground, lit by Luminati's sprite lighting.
  - `anim.js` keeps deciding the clip and frame from sim state. The adapter shows that frame instead of Luminati's
    animator. The facing is our octant directly, with no Luminati quarter to clamp to.
  - **Memory is a gate.** The prototype crashed iOS Safari at about 900 MB of cut canvases. The cut sets brought
    that down to 28 MB (full for combatants, plain for walkers, still for the standing).
  - The port goes further: one texture per atlas, with each frame a UV rectangle, so nothing is copied at all. Atlases
    load per region (architecture §9). The budget is under 64 MB of textures for actors on a phone, measured each
    phase (`__sheets` style counters).
- **Effects.** `fx.js`'s primitives (rings, arcs, bolts, bursts, hits, telegraphs, the Fallen glow) map to Luminati's
  FX quads and particles, depth-tested in the scene. Damage numbers and plaques stay DOM, placed by projection. Every
  `sim.bus` event that `fx.js` reacts to today is listed in phase 6, and each gets its Luminati effect. None is
  dropped silently.
- **Combat reads the same.** Telegraphs, hit flashes and the party's focus ring are presentation of sim events and
  are kept. Luminati's own combat UI is not loaded.

---

## 7. Both asset sets in reserve

Nothing is deleted, and either art can be used for any map:

- **Emberfall's art stays as it is.**
  - The art and its tools stay: `assets/actors`, `assets/env`, `assets/items`, the bakes, the faces and the icons.
  - Emberlit stays in `src/render/`, selectable with `?renderer=emberlit`.
  - The art review (`?dev&scene=stage&show=…`) and the character stage keep working on Emberlit.
- **Luminati's art stays whole.** The vendored bundle carries the full object catalog and the kits, not only what the
  first maps use, so a builder is one table row away.
- **The switch is data.** Each region's struct table (§5) can name either a Luminati object or an Emberfall sprite.
  The prototype's `props.js` already stands our baked art in Luminati's world; it moves into the adapter. Bringing
  the original art back for a building, a tree or a whole town is a table change, not code.
- **The catalogue stays as the shelf.** `/lumina/`'s two wings (Luminati's builders, and our 290 pieces of art and
  icons) remain the place to look before choosing.

---

## 8. Gates

Each phase ships behind the flag and must meet these before the next one starts. The numbers go in the commits
(AGENTS.md rule 7).

| Gate | Target |
|---|---|
| Frame rate | 60 fps in Thornwick's square at dusk on an iPhone 12-class phone, 30 fps on the battery saver; the slowest map measured on the phone too |
| Memory | under 64 MB of actor textures; no Safari reload in a 20-minute session across town, overland and two dungeon floors |
| Load | the renderer at or under 450 KB gzipped, loaded behind the title; a level built in under 400 ms on the phone |
| Context loss | a lost WebGL context rebuilds the level and carries on (the A2 rule) |
| Parity | `npm run check` unchanged; replay hashes unchanged (the sim is untouched); the browser checks pass on both renderers |
| Taps | every pick target 44 px or more; a tap on a foe, an NPC, a prop, a service and the ground lands on the same thing in both renderers (a scripted tap table per map) |

---

## 9. Phases

| # | Phase | Delivers | Exit |
|---|---|---|---|
| 0 | **Spike and decision** | The vendored bundle builds; a bare scene under our sim; the 128 limit tested (crop vs. raise); one atlas as UV frames; first-load size | A17 accepted or the plan re-scoped |
| 1 | **Thornwick, a vertical slice** | `?renderer=luminati` in the real game: the town converter, the camera (`view.js`), actors through `anim.js`, `screenToTile` and the pickers, the hour from the sim | walk, talk to Maudry, open a service, all UI in place, upright and sideways |
| 2 | **UI and input** | `weather` / `daylight` moved to `src/world/`; the minimap rect and plaques; the stick; the zoom check; `transiting` | the UI browser checks pass on both renderers |
| 3 | **All towns and waystations** | Saltmere, Ashgate, Frosthold and the waystations; region style tables | the sim-vs-level checks pass; the square menu check |
| 4 | **The overlands** | the converter with the size remedy; roads, the coach's stops, foes' camps | the Vale and Fens overlands at frame-rate gate; the Reach and Heights as the sim builds them (§5) |
| 5 | **Dungeons and the Mere Tower** | the site converter for all 11 sites, every floor, per seed; torches through `LightPool`; the tower's landings | a sample of seeds per site checked; boss halls readable |
| 6 | **Combat presentation** | every `fx.js` effect mapped; telegraphs, hits, Fallen, the temple's raise | the M3 create→Fallen→temple→wipe check passes on Luminati |
| 7 | **Performance and memory** | the gates in §8 on real phones; the battery saver; context loss | all gates met |
| 8 | **Tests and tools** | the browser checks parameterised by renderer; capture tools (`tools/capture`, `tools/dungeon/capture.mjs`) able to shoot either | CI runs both |
| 9 | **Cutover** | the default flips to Luminati; Emberlit stays behind `?renderer=emberlit` | the owner's play-test on the phone |

Phases 3–5 can run side by side once phase 2 is done; each is one converter and its checks.

---

## 10. Risks

| Risk | Mitigation |
|---|---|
| Phone performance: Luminati's diorama (shadows, depth of field, bloom) is heavier than a 2D G-buffer | Its own `ResolutionGovernor`; a phone profile (smaller shadow maps, DOF off or eased as `view.js` does); the frame-rate gate decides before the cutover |
| Memory on iOS Safari | UV frames instead of cut canvases; per-region atlases; the 64 MB gate; a 20-minute soak |
| Coupling to Luminati's internals | One pin, build-time tags only (never edits), the adapter the only importer. A Luminati update is a deliberate re-pin with the checks run |
| Maps over 128 units | Crop the margin, raise the clamp, or chunk (§5); decided in the spike |
| Our baked art is flat in a lit 3D world | Luminati builders for the world by default; our art per row where it reads (the second wing shows which) |
| Picking feels different from Emberlit's | Projected rectangles with a 44 px floor, and the scripted tap table compared across renderers |
| Visual and rule drift (a tree on a walkable tile) | Levels only from the sim's world, and the sim-vs-level checks per map |

---

## 11. The owner's choices (2026-10-31)

The owner: *"Depth of field Blur is a new menu setting, design reach and heights now, leave out the Frontier for now,
lets stop at the trial build so i can play test before continuing."*

1. **Depth of field** is a setting in the menu's new **Graphics** panel, per device: *Soft blur* (the prototype's eased
   blur, the default) or *Off*. It applies at once (`src/render3d/settings.js`, `src/ui/title.js`).
2. **The Reach and Heights overlands** are designed and built as their own lands, not the Vale's copied, as separate
   work from this plan: the world doc (v1.34) and the GDD first, then the sim
   ([reach-heights-overlands.md](./reach-heights-overlands.md)). They're previews (`?scene=overland&region=reach|heights`)
   until their acts are built. The converter draws them.
3. **The Frontier** stays out of the port, on its own renderer.
5. **The prototype's maps stay playable as they are** (the owner: *"keep what you had from that prev build - the map and
   assets so i can play them"*): Thornwick, the Scrag Warren, the Old Barrows and both catalogues, with Luminati's own
   play, from the menu (*Another world*, *Compare worlds*). The port never rebuilds them (`tools/lumina/build.mjs` keeps
   the committed levels; `--levels` only on purpose).
4. **Stop after phase 0**: the trial build (§12), for the owner to play on the phone. Phases 1–9 wait for that
   play-test, and the default stays Emberlit.

---

## 12. Phase 0: the trial build

**How to play it.** Menu → **Graphics** → *Luminati* (the game saves the slot and reloads), or add `?renderer=luminati`
to the address. *Emberlit* goes back. It's the same game: the same slot, sim, HUD, menus and taps.

![The trial build: Thornwick at dusk, the Hollow Vale by day, the Old Barrows, Thornwick sideways](img/lumina/trial.jpg)

**How it's built, and how it differs from §2–§3.** The fastest honest way to put Luminati under the real game, so the
owner can judge the look and the feel before the big work:

- **Emberlit stays the game's eye.** It keeps its camera, its animator's choice of clip, octant and frame for every
  figure, everything drawn over the world (the minimap, names, service plaques, bars and numbers, the banner, the
  stick), and every tap test (`npcAt`, `enemyAt`, `serviceAt`, `doorAt`, `propAt`, `screenToTile`).
  - With another painter set (`renderer.setExternal`, `src/render/renderer.js`), it skips its bake, its stamping and
    its two light passes.
  - It hands that painter each frame's figures and camera.
- **Luminati draws the world in a frame.** `lumina/world.html` (`tools/lumina/ember/world.js`, built with the
  prototype by `tools/lumina/build.mjs`) sits over Emberlit's world canvas and under its overlay.
  - It takes no pointer and never has focus, so taps and keys reach the game as before.
  - It boots Luminati's `Game` with none of Luminati's play: no title, no HUD, its player hidden, its loop stopped.
  - The game steps it once a frame (`src/render3d/hybrid.js`).
  - This stands in for §2's vendored module bundle. That bundle is phase 1, and the frame goes then.
- **The camera is Emberlit's, exactly.**
  - `hybrid.js` turns Emberlit's camera into the ground point at the middle of the screen, and the CSS px a unit.
    It uses `iso.js`: a tile is 16 × 8 px, so a unit is 16√2 native px.
  - `world.js` places a 45° / 30° camera on a 1° lens at the distance that gives that scale. That's near enough
    orthographic that Emberlit's overlay and taps land on Luminati's ground.
  - Measured with `hybrid.probe`, at five points round the hero: within **0.4 px** in the Old Barrows, **0.37 px** in
    the Vale and **1.4 px** in Thornwick's square (whose camera eases onto the square).
- **The figures are ours, drawn by Luminati.**
  - Each figure is a sprite facing the camera, cut from its atlas by UV (one texture an atlas, nothing copied).
  - Each stands at Emberlit's anchor, lit by Luminati's sun and lamps, with its shadow.
  - Faded when Emberlit fades it (the Fallen, the dying).
- **The hour and the weather are the sim's.**
  - The sim's four parts of the day map onto Luminati's clock: dawn at 5:00, day 7:30, dusk 17:30, night 20:30. So
    the dial's word and the sky agree.
  - The title's held dusk holds Luminati's too.
  - The sim's rain and snow are Luminati's. Its fog and wind aren't drawn yet.
- **Every map is converted at runtime** from the sim's world (`src/render3d/convert.js`), as §5 says:
  - towns and the waystation, with each region's walls and roofs;
  - the overlands, with mountains raised as rock and the walls raised as terrain;
  - every dungeon floor, per seed, its walls raised, its braziers lit and a torch to each room.
  - Pieces with no Luminati match (mills, ruins, the keep, the Fens' stilt houses, animals, carts) stand as our own
    baked art. This is §7's "both sets in reserve" working from day one.
  - Over 128 units the map is cropped round its middle (§5's first remedy).

**Measured** (headless Chromium on software WebGL, so times are a slow floor; a phone's GPU is what phase 7 measures):

| | Thornwick | The Hollow Vale | The Old Barrows |
|---|---|---|---|
| Level (Luminati units) | 88 × 68 | 128 × 128 (cropped from 130) | 68 × 80 |
| Luminati objects · our sprites | 72 · 137 | 133 · 99 | 75 · 0 |
| Converting it (Node) | 0.13–0.19 s | 0.53 s | 0.66 s |
| Built, first boot / a travel | 17–25 s / – | – / 11.5 s | 15 s / – |
| Shader programs | 53 | 83 (after the travel) | 42 |
| Off Emberlit's overlay | 1.4 px | 0.37 px | 0.4 px |

The other levels convert inside Luminati's limits too: Saltmere 81 × 66, Ashgate 88 × 68, the Fens 128 × 128, the
Toadking's Mound 128 × 128 (cropped), the Scrag Warren 128 × 97 (`test/render3d.test.mjs`).

**Checks.**
- `test/render3d.test.mjs` (node:test): every sample world converts to a valid level within the limit, the hero on a
  walkable tile, the same world to the same level, a town's services as named houses, and the hours.
- The browser suite's `render3d` check: the game with `?renderer=luminati` builds Thornwick, then the Vale after walking
  out of the gate, the ground within 2 px of Emberlit's overlay, the frame taking no pointer, and Graphics turning the
  depth of field off.
- The sim is untouched: `npm run check` (replays, smoke, balance gates) as before.

**What's rough** (for the play-test; each is a later phase's work):
- **Effects.** No weapon or spell effects, hit sparks, floor rings or telegraphs yet: they were Emberlit's G-buffer
  work (phase 6). The numbers, bars and names are there.
- **Light.** No carry light round the hero in a dungeon, and the dungeon's fog is blue (Luminati's evening light).
- **Day.** Luminati's day is brighter and greener than Emberlit's dusky one. The owner's direction (keep the gloom)
  wants a pass on its keyframes.
- **Placement.**
  - Buildings are Luminati's houses sized to our footprints, so a door may sit off our service's spot. The tap still
    goes by Emberlit's sprite.
  - Our own art stands as flat cut-outs.
- **Waits.** A first boot and each travel wait behind black while the level builds, longer on a slow phone.
- **Memory and speed on a phone are unmeasured** (the gates in §8; phase 7).
  - Each actor atlas is one texture of about 24 MB.
  - The frame runs a second WebGL context beside Emberlit's idle one.
- **The Reach and Heights overlands** are their own lands now ([reach-heights-overlands.md](./reach-heights-overlands.md)),
  and the converter draws them. In Luminati they still read green: its grass is green, its snow belongs to its season
  kit, and the Heights' snow stands as pale sand. They need a ground pass of their own in phase 3.

---

## 13. Committed to Luminati: what's next (2026-10-31)

The owner, after the trial: *"assuming we are going to stick with the Luminati engine (keep the compare and other maps in
the menu). Whats next on the main game to implement the Luminati engine."*

So the port goes ahead. **Compare worlds**, *Another world* and the prototype's maps stay in the menu, and the
prototype's maps are kept as they are (§11 point 5). The order below puts first what the owner sees most: the fights.
Each step lands on main behind the Graphics switch, so the game stays playable in Emberlit all the way to the cutover.

| # | Step | What it delivers | Done when |
|---|---|---|---|
| 1 | **The engine in the page** (§2's phase 1) | `tools/render3d/build.mjs` builds Luminati's engine and world layers and three.js as ES modules into `src/vendor/luminati-80e1aa6/` (import-mapped as `luminati`). `src/render3d/` imports it, and the frame goes. One WebGL context: Emberlit's world canvas isn't made when Luminati draws | the trial's checks pass without the frame; the renderer loads behind the title at ≤ 450 KB gzipped (§2); no second context |
| 2 | **Fights** (§6, phase 6, brought forward) | <ul><li>Every `fx.js` effect in Luminati's FX quads, particles and ground markers: weapon trails, spells, hit sparks, the Fallen.</li><li>The floor rings, the telegraphs and the party's focus ring.</li><li>Hit flashes on the sprites (`combatFx`).</li><li>The hero's carry light (a combat VFX light, not a lamp).</li></ul> | a Scrag Warren and an Old Barrows fight in the game read as well as the prototype's; the M3 create → Fallen → temple → wipe check passes on Luminati |
| 3 | **Dungeons dressed** | <ul><li>Each site's dressing kit (`world.js` DRESS: dig, gallery, muster, bailey, nave, mound, locks, vats, abbey) as Luminati props: racks, bones, braziers, banners, cages, as the prototype's Old Barrows has them.</li><li>Walls at their height in each site's stone.</li><li>Darker fog, and a fixed hour per kit.</li><li>The Mere Tower's landings.</li></ul> | a sample of seeds per site captured and judged against the prototype's Barrows |
| 4 | **Towns and the waystation** | <ul><li>Buildings placed on our services' doors, not only sized to our footprints.</li><li>Saltmere's stilts and punts in 3D (until then our art stands in).</li><li>Each region's walls and roofs checked against the world doc.</li><li>The service plaques over Luminati's houses.</li></ul> | the square-menu and x-ray checks pass on Luminati |
| 5 | **The light and the look** | <ul><li>Luminati's day keyframes moved toward Emberlit's dusky ones (the owner's standing direction: keep the gloom).</li><li>Fog and wind weather.</li><li>The biomes' light: the Reach's arid day, the Heights' winter (done in the converter, §14).</li><li>A depth-of-field pass at the phone's size.</li></ul> | a contact sheet at dawn, day, dusk and night in each region, before and after |
| 6 | **The phone** (phase 7) | the gates in §8 on the owner's iPhone: frame rate, memory (atlas textures cut to the frames used, as the prototype's sheets were), level build time, context loss | the gates met, the numbers in the commit |
| 7 | **Tests and tools** (phase 8) | the browser suite run on both renderers; capture tools able to shoot either | CI runs both |
| 8 | **The cutover** (phase 9) | the default flips to Luminati; Emberlit stays in the menu (Graphics, Compare worlds) | the owner's play-test |

After step 1, Emberlit is still the game's eye for the overlay and taps. Moving the overlay itself (the minimap, names,
plaques, bars) onto Luminati's camera is part of step 7. It's needed before Emberlit's code can ever be retired, and
that isn't planned: Emberlit stays in reserve.

---

## 14. The biomes: grassland, desert, snow and ice (2026-10-31)

The owner: *"Can we also create assets/tiles in the new engine to cover desert/grassland, and icy/snowy areas?"*

Luminati already paints all three, so nothing new is drawn by hand:

- **Grassland:** its default set (grass, dark grass, flowers, farmland, dirt paths, cobbles).
- **Desert:** its arid set, from its set-piece kit:
  - ground: dry earth, dry grass, cracked earth, red sand, scree, sandstone;
  - rock: red rock with its cliffs;
  - trees and crags: junipers, palms, cypresses, dead trees, red-rock and sandstone crags (mesas, hoodoos, spires);
  - houses: adobe walls, terracotta and flat roofs;
  - light: an arid day (`climate: arid`).
- **Snow and ice:** its winter set, from its season kit:
  - ground: snow, trodden snow paths, frosted cobbles;
  - ice: ice to walk on, frozen water;
  - trees and stone: snow pines, bare trees, snow and ice stones and crags;
  - season: `season: winter`.

Each kit loads only for a level that uses it.

What's built:
- **In the game** (`src/render3d/convert.js` `BIOMES`, `BIOME_OF`), each region draws in its biome:
  - **The Vale and the Fens** stay grassland.
  - **The Cinder Reach** is desert. Its grass becomes dry earth, scrub, cracked pans and red sand; its paths cracked
    earth; its cobbles sandstone; its mountains red rock; its trees junipers and the dead; its stones red rock. It takes
    the arid light.
  - **The Pale Heights** are snow and ice. Its open ground is snow with trodden patches and scree; its paths are snow
    paths; its cobbles frosted; its water frozen to ice; its mountains snow; its trees snow pines and bare; its stones
    snow. It takes the winter season.
  - The town walls stay stone.
- **In the prototype:** a seventh map, **The Biomes** (`levels.mjs` `biomes`).
  - Grassland, desert, and snow and ice stand side by side, west to east. Each has its ground tiles in bands with a
    signpost naming each tile, a pond (an oasis, a frozen tarn), its trees, stones, crags and a house, and a path.
  - One level holds one light, so the three share an afternoon.
  - It's in the menu's *Compare worlds* and on the prototype's front page.

![The Biomes map, then the Reach and the Heights in the game](img/lumina/biomes.jpg)

Checks: `test/render3d.test.mjs` asserts:
- the Reach converts in the desert's tiles and trees with the arid light, and no grass;
- the Heights convert in snow, ice and frozen water with the winter season, and its trees are snow pines and bare;
- the Vale stays grassland;
- every tile is in the legend.

The browser suite checks the front page lists the Biomes.

Rough: the town walls take no snow or sand, and the Heights' scree reads warm (it's the arid set's).
