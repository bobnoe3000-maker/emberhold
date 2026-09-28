# Goal

Raise the Emberfall prototype (this repo) to a premium-indie art bar. It is a portrait,
mobile-first isometric D&D autobattler. The work runs as four tracks, each improved and
judged on its own:

1. **Characters & NPCs:** sprites and animation.
2. **Art assets:** environment models, props, buildings, trees, tiles, ground and palette.
3. **Town design:** the four regional hub towns, their approach roads, and the overland as
   it frames them.
4. **Dungeon design:** site layout, rooms as battle arenas, dressing and readability.

**The bar.** It should look like a shipped premium isometric game on a phone:
- every figure reads at a glance, even in the dark;
- every surface looks authored;
- every place has an obvious purpose.

**The direction is fixed:**
- classic D&D-novel medieval, grim and warm;
- the Emberlit dusk and torchlight look;
- not cartoony and not low-poly;
- never programmer art.

Start from the current build and keep what works. Don't replace the engine, the sim or the
art direction.

# The prototype (read before working)

**Code and runtime**
- Plain ES modules with no build step; a static site deployed to Netlify from `main`. There
  is no bundler and no runtime three.js.
- **Renderer** (`src/render/renderer.js`): WebGL2 "Emberlit" deferred lighting over a
  CPU-baked G-buffer (albedo, normal, emissive and a per-pixel depth key). The view is
  25 tiles across, portrait 390×844 at dpr 3.

**Characters**
- KayKit CC0 models, baked by `tools/actor-lab` (three.js plus headless Chromium) into
  56 px atlases in `assets/actors/`:
  - 8 screen directions, with an idle clip (6 frames) and a walk clip (8 frames);
  - albedo, normal and emissive maps.
- Combat motion is faked in the renderer today (lunge, flash, sink and fade).

**Environment**
- Our own procedural models live in `tools/actor-lab/buildkit.js`.
- `envlab.js` and `bake-env.cjs` bake them into:
  - the `env` and `town-<region>` atlases;
  - the footprints in `src/sim/envfoot.js`.
- Tile styles are in `src/render/tilestyles.js` and colour ramps in `src/render/palette.js`.
- Outdoor ground is painted by `src/render/outdoorpaint.js`.

**Towns and overland** (`src/sim/outdoor.js`)
- Four regions: vale, fens, reach and heights.
- Each hub's square is the home screen, with the tavern, inn, shop and temple.

**Dungeons** (`src/sim/level.js` and `src/sim/world.js`)
- 6–8 rooms per floor, each 40–62 tiles across, joined by 6-wide corridors.
- Room levels are fixed and rise with distance from the entrance and with floor depth.
- There is a stair up in the entrance room and a descent room.

**Battles** (`src/sim/battle.js`)
- A deterministic 20 Hz sim; each room is an arena.
- Waves of Ashbound skeletons respawn there: warrior, minion, archer, mage and elite.

**Reference and tools**
- **Design truth:** `docs/emberfall-gdd.md`, `docs/emberfall-world.md` and
  `docs/town-art-options.md`.
- **URL parameters:**
  - `?scene=town|overland|dungeon` and `?region=` pick where you start;
  - `?dev=1` exposes `globalThis.__sim` and `globalThis.__rstats`.
- **Tests:** `node smoke-test.mjs` and `node render-smoke-test.mjs` must stay green.

# How to work

1. **Plan first.** Before touching art, write `docs/ART-PLAN.md`. It must cover:
   - **Per track:** the files it owns, its current baseline (screenshots and a round-0
     score) and its target.
   - **Asset policy:** CC0 only (KayKit, Kenney, Quaternius, Poly Haven, ambientCG, or our
     own procedural work). Record every source in `assets/CREDITS.md`.
   - **Budgets**, measured in the headless perf run:
     - median frame ≤ 8 ms and worst frame ≤ 16 ms;
     - no synchronous bake over 5 ms;
     - each actor atlas ≤ 2048²;
     - total asset payload grows by no more than 3 MB.
   - **The contract no track may break:** sim determinism, the save format, the atlas and
     sprite formats the renderer reads, and the tests.

2. **Build the verification loop before changing art.**
   - Grow the headless harness (`tools/actor-lab/render.cjs`) into one screenshot tool.
     Chromium is at `/opt/pw-browsers`; never download browsers. The tool:
     1. loads a URL;
     2. waits until it is ready (atlases loaded, no bake pending);
     3. applies a preset: scene, region, dungeon theme, depth, room, camera position, battle
        state and wave, seed;
     4. writes a PNG plus a JSON log (console errors, frame times from `__rstats`, atlas
        count).
   - Add a showcase mode per track, each lit by the real renderer:
     - `?showcase=actors`: every character and NPC × 8 directions × every clip, on dungeon
       floor and on town ground.
     - `?showcase=assets`: all props, buildings and tiles, under dusk and under torchlight.
     - `?showcase=town&region=…`
     - `?showcase=dungeon&theme=…`: a fixed-seed tour of the entrance, a mid-level room in
       battle, and the descent room.
   - Always capture the phone gameplay view at native zoom as well, not only close-ups.
   - Nobody claims an improvement they haven't screenshotted and looked at.

3. **Four tracks, kept separate.** One builder agent per track, each owning only its files:

   - **Characters**
     - *Owns:* the `tools/actor-lab` bake pipeline (`bake.cjs`, `bake.json`, the lab pages),
       `assets/actors/`, and the portrait crop in `src/ui/party.js`.
     - *Delivers:*
       - real clips: an attack per class, cast, hit and death, plus idle and walk polish;
       - town NPCs (townsfolk and the service keepers);
       - companions that look distinct from the hero;
       - skeleton types that differ by silhouette;
       - all of it readable at 56 px in the dark.
   - **Art assets**
     - *Owns:* `buildkit.js`, `envlab.js`, `bake-env.cjs`, `assets/env/`,
       `src/sim/envfoot.js`, `palette.js`, `tilestyles.js`, `outdoorpaint.js` and
       `gsprite.js`.
     - *Delivers:*
       - materials, props, buildings, trees, rocks, tiles and ground at a consistent scale
         and texel density;
       - one palette;
       - a correct response to dusk and torchlight.
   - **Town design**
     - *Owns:* the `src/sim/outdoor.js` layout (hubs, approach roads, river, fields, prop
       placement, overland framing) and `src/ui/townmenu.js`.
     - *Rule:* uses the art track's assets and requests new ones rather than making them.
   - **Dungeon design**
     - *Owns:* `src/sim/level.js` and `src/sim/world.js` (layout, room shapes, landmarks,
       braziers, chests, shrines, stairs, hazards).
     - *Rule:* rooms must stay good battle arenas (GDD §3).

   **Order:** art assets and characters run first, in parallel. Town and dungeon design
   follow, because they use those assets.

   **Shared files:** `src/render/renderer.js`, `src/sim/core.js`, `src/sim/battle.js`,
   `src/main.js` and `index.html` belong to one integrator agent. Between rounds it applies
   the builders' change requests and fixes the seams.

4. **Gauntlet each track.** After each builder round, a separate critic agent reviews it.
   The critic is a brutal art director who writes no code.
   - **What the critic captures** with the tool, its own screenshots of:
     - the showcase and the gameplay view;
     - several seeds, dungeon themes and regions;
     - different zoom levels;
     - live battles.
   - **What it checks:** console errors, the budgets and the contract.
   - **Scoring, 0–10:**

     | Score | Meaning |
     |---|---|
     | 10 | indistinguishable from a shipped premium isometric game |
     | 8.5 | shippable with nits |
     | 7 | good indie |
     | 5 | programmer art |

   - **Rubrics:**
     - **Characters:**
       - silhouette and class read at gameplay zoom;
       - consistency across the 8 directions;
       - animation timing and arcs, with no foot sliding;
       - attack anticipation and impact;
       - normal and lighting quality;
       - fit with the palette;
       - NPC variety.
     - **Art assets:**
       - how well materials read;
       - consistent scale and texel density;
       - grim-medieval shape language, not cartoony;
       - light response and contact shadows;
       - variety without noise.
     - **Town:**
       - the square reads as a home screen, with every service found in one glance;
       - each region has its own identity;
       - the approach is believable;
       - the composition works in the portrait frame;
       - everywhere is walkable.
     - **Dungeon:**
       - each room has an identity and landmarks;
       - the arena stays readable in battle, with units never lost in clutter or darkness;
       - the way to exits and stairs is clear;
       - dressing density is right;
       - dungeon themes vary;
       - the minimap agrees with the map.
   - **Pass** requires all of: a score of 8.5 or more, zero console errors, budgets met,
     tests green.
   - **Below that:** the builder gets the ranked issue list and goes again, up to 4 rounds.
     If it still fails, record the blocker in the status file.

5. **Final gate.**
   1. A whole-game critic plays the loop and scores it: town square → overland → Old Barrows
      → a room battle → back to town.
   2. Blind judges then get pairs of screenshots labelled only A and B, in shuffled order.
      Each pair is ours against the reference images in `docs/reference/<track>/`, which I
      supply. Never scrape them, and never route around blocked hosts. Where a track has no
      reference, pair the round-0 baseline against the latest build.
   3. The judges say which image looks better and why.

6. **`/loop` until all four tracks and the final gate pass.** After every round, save
   scores, screenshot paths and open issues to `docs/ART-STATUS.json`. Each iteration then
   resumes from the weakest track, not from scratch.

# Rules

- Never inflate scores. Report real numbers, failed rounds and what is still missing.
- Never edit another track's files. Changes to shared files go through the integrator.
- Keep the app loadable at all times, with a local static server always running; other
  agents are screenshotting it.
- Don't change gameplay, balance or the GDD. The exception is a layout rule the town or
  dungeon track needs; record it in the GDD.
- CC0 assets only, all credited. Don't route around blocked network hosts.
- After each passing round, with tests green, commit and push to `main`.
- Don't ask me questions. Make routine decisions yourself, state your assumptions and keep
  going.

Start now.
