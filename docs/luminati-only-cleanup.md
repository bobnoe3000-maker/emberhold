# Luminati only: what to remove and clean up (a proposal, 2026-11-09)

**Status: Accepted; steps 1–4 done (2026-11-09).** The owner (2026-11-09): "we are going to stick with the Luminati version
and fx/asset combos in the current code, so what code/assets and game options should we remove or clean up?", then, on
§4's four questions: "Go with your recommendations on all four, start step 1". Also decided the same day: the dungeons
keep their walls and floors (no KayKit kit: [dungeon-kit-proposal.md](./dungeon-kit-proposal.md)). Decision row A21
([architecture.md](./architecture.md)).

This proposal is from an audit of the code as it stands (every claim below has a file and line behind it). Step 5 (the rest of the docs) is
decided and not started.

**In short:**
- **Luminati is the default and the only choice (step 1, done).** Graphics has no renderer row; a stored Emberlit choice
  is ignored; a failed start says so over the world with a Retry (§3).
- **Emberlit can't simply be deleted.** In Luminati mode it is still the game's eye: the camera, the animator that times
  every figure's clip, every tap, the minimap and labels, the joystick, and the light of the blows and spells.
- **What can go:** about 37 % of `renderer.js` (≈ 780 lines that paint the world), two whole modules (≈ 560 lines), the
  Luminati prototype (4.5 MB), a declined spike, and **≈ 119 MB of normal, emissive and key atlases** that only Emberlit's
  lighting reads.

---

## 1. What stays: Emberlit's parts that Luminati mode runs on

| Piece | Why it stays |
|---|---|
| `src/render/iso.js` | The camera, every tap (`resolveTap`), the stick's direction (`screenDirToWorld`) |
| `src/render/anim.js` | The animator: clip, frame and facing for every figure Luminati poses (the models follow it) |
| `renderer.js`: camera, draws list, overlay, hit-tests | The minimap, labels, shrine and stair signs, goal ring, battle bars and numbers, banners, joystick; `npcAt`, `enemyAt`, `doorAt`, `propAt`, `serviceAt`; hit-stop and jolt; the spells', warnings' and blast state handed to Luminati |
| `fx.js`, most of `skillfx.js` | The fights' light, laid over Luminati's world (`hybrid.js`), and every skill not drawn in Luminati's own looks; `WARN_R` |
| `gsprite.js` `buildProps`, `PROP_LIGHT` | Chest, shrine and stair taps; the props hybrid draws; the converter's lights |
| `palette.js` `ELIT`, `KIT_TINT` | The dungeon minimap; the converter's kit tints |
| `daylight.js` (part), `weatherfx.js`, `beasts.js` | The held sky and the hour handed to Luminati; fog and wind on the overlay; the beasts' frames |
| `assets/actors/*.alb.png`, `*.json` | The sprite fallback while a model loads (and `?figures=sprites`); the clips' columns the models are posed from |
| `assets/actors/*.face.png`, `*.fig.png` | Portraits and the character window: not the renderer's |
| `assets/env/*.alb.png`, `*.json` | The sprites the converter keeps (mills, ruins, the keep), the beasts, the outdoor minimap and label heights |
| `assets/models`, `assets/items`, `assets/maps` | The people, the item icons, the maps |
| `tools/lumina/ember/ground.js`, `tools/lumina/.work/` | The vendor build copies the ground cover and builds from Luminati's checkout (it would move to `tools/render3d/`) |

## 2. What can go

### 2.1 Options players see

| Option | Where | Proposal |
|---|---|---|
| Graphics → "The world is drawn by: Emberlit / Luminati" | `title.js` Graphics | **Remove.** Luminati always; the "(with Luminati)" suffixes go |
| Compare worlds → "This game, drawn by" | `title.js` Compare worlds | **Remove** (with the panel, if the prototype goes: 2.3) |
| Compare worlds → the prototype's maps, "Another world" | `title.js` | **Remove** with the prototype (2.3) |
| `?renderer=emberlit` / `luminati` | `settings.js`, `main.js` | **Remove** (or keep `?renderer=emberlit` for a while as a developer escape) |
| `?tiles=`, `?tv=` (Emberlit's tile styles) | `renderer.js` | **Remove** |
| `?tierlooks=luminati\|now` (the tiers' looks review) | `renderer.js` `TIER_LUM` | **Remove the switch** once the looks are final; **`TIER_LUM` itself stays** (it says which skills Luminati draws) |
| `?figures=sprites` | `hybrid.js` | Keep: a Luminati option, useful for comparing on the phone |
| Depth of field, Brightness, Hit feel, Frame rate | Graphics | Keep |

### 2.2 Code

| What | Size | Notes |
|---|---|---|
| `renderer.js`: world painting | ≈ 780 of 2,100 lines | Shaders and GL setup, bake buffers, shadows and sprite stamping, tile painting and baking, hazards' ground tint, the passes A and B, `buildHarvest`, Emberlit's light setup, `?tiles` styles. Every `if (!X)` / `if (!ext)` branch is dead with Luminati only. |
| `src/render/tilestyles.js`, `outdoorpaint.js` | 266 + 291 lines | Only `renderer.js`'s painting imports them; no tests |
| `skillfx.js`: the 20 skills Luminati draws | ≈ 200 lines | `cleave`, `frost_nova`, `mend`, `bless`, `turn_undead` and the fifteen tier skills' Emberlit moments; dead under the default looks (live only with `?tierlooks=now`) |
| The 1 × 1 WebGL stub | | External mode still makes a WebGL2 context and compiles both shaders, and throws if WebGL2 is missing |
| `external` option + `setExternal` | | Merge into one: Luminati is always the painter |
| `loadActorAtlas` / `envSprite` normal, emissive and key slicing | | Read only by Emberlit's lighting (see 2.4: change before deleting the files) |

### 2.3 The Luminati prototype and the spikes

| What | Size | Proposal |
|---|---|---|
| `lumina/` (the prototype build: Luminati's worlds with our people as sprites) | 4.5 MB, 106 files | **Remove**: it predates the game's own Luminati, still draws sprites, and is reached only from Compare worlds and "Another world" |
| `tools/lumina/` (`build.mjs`, `levels.mjs`, its vite config) | ≈ 70 KB | Remove with it; move `ember/ground.js` to `tools/render3d/` (the vendor build uses it) |
| `tools/kit/` and `tools/actor-lab/kit-cast.html` (the declined dungeon kit spike, the cast comparison) | ≈ 24 KB + gitignored models | **Remove** (the proposal keeps its pictures) |

### 2.4 Assets

| What | Size | Proposal |
|---|---|---|
| `assets/actors/*.nrm.png` (76) | 111 MB | **Remove**, after the loaders stop fetching them: today a missing normal map makes the figure fail to load, so it would never reach Luminati |
| `assets/actors/*.emi.png` (25) | 2.9 MB | **Remove**, same order |
| `assets/env/*.nrm.png`, `*.key.png` | 5.1 MB | **Remove**, same order (a missing one loses the env atlas: no structures on the outdoor minimap, no beasts) |
| The bakers' normal, emissive and key outputs | | `bake.cjs`, `bake-env.cjs` stop writing them |

≈ 119 MB out of the repo and the deploy. Emberlit's loaders fetch these files in Luminati mode too, so removing them
also saves the phone's download and memory.

### 2.5 Developer tools and tests

| What | Proposal |
|---|---|
| The Stage and the art review (`?dev&scene=stage`, `src/dev/stage.js`, `review.js`) | Emberlit-only (main.js forces Emberlit there). **Decide:** retire the figure lineup and the env/props/fx views, or port them to Luminati. The icons and faces views are plain HTML and can stay |
| `tools/capture/stage.mjs`; `feel.mjs` (defaults to Emberlit); `--renderer both` in `rig`, `skills`, `bosses` | Drop Emberlit from the choices |
| `test/browser/run.mjs` | About 60 checks pass no `?renderer` and so test Emberlit painting today; with Luminati the default they move onto it, and Luminati runs at a few frames a second on CI's software GL. The suite needs a budget: a light Luminati for flow tests (`?figures=sprites`, pixel ratio 1), the both-renderer loop at line 136 down to one, the Emberlit-only checks (atlas versions with normal maps, the x-ray share, the Stage) retired |
| `render-smoke-test.mjs` | Keep the props checks; drop the two dead sprite helpers' checks |

### 2.6 Docs

- **Superseded:**
  - `emberlit-tdd.md`, `emberlit-demo.html`, `tile-styles.md`;
  - `character-stage-proposal.md` and `art-review.md`, if the Stage goes;
  - `lumina-prototype.md`, if the prototype goes.
- **AGENTS.md:** "Rendering, Emberlit (A2)" rewritten for what remains (the overlay, taps, the effects' light); the flags
  list trimmed; the Read-first table's renderer row pointed at the port plan.
- **architecture.md:** a decision row, Luminati only (it supersedes A2 for the world; A17 becomes the plan of record).

## 3. Order of work

Each step ships on its own, with the browser suite green before the next.

| Step | What | Risk |
|---|---|---|
| 1 ✓ | **Luminati the default and only choice**: the renderer row and `?renderer` out; a clear message if Luminati can't start (today a failed start leaves a black world and only logs) | The browser suite's ≈ 60 checks move onto Luminati: CI time (it took 48 of its 75 minutes before this) |
| 2 ✓ | **The prototype and the spikes out** (`lumina/`, `tools/lumina/` but `ground.js`, `tools/kit/`, kit-cast; Compare worlds and Another world) | Low: links and its own tests only |
| 3 ✓ | **The atlases' lighting channels out**: loaders first, then the files, then the bakers | Low once the loaders are changed; a figure that fails to load is caught by the browser suite |
| 4 ✓ | **renderer.js's world painting out**, `tilestyles.js`, `outdoorpaint.js`, the GL stub, the dead skill moments, `?tiles` and `?tierlooks` | Medium: a big file; the overlay and taps must not move (the suite's tap and HUD checks) |
| 5 | **Tools, tests and docs** to match | Low |

### 3.1 Step 1 as built (2026-11-09)

- **`src/render3d/settings.js`:** the Graphics settings hold no renderer; `rendererFor()` answers Luminati, but for a
  developer's `?renderer=emberlit`, kept for that tab in `sessionStorage` (`?renderer=luminati` ends it). An old stored
  `renderer` is ignored and dropped at the next write. The escape goes with Emberlit's painting in step 4.
- **`src/ui/title.js`:** Graphics' renderer row and Compare worlds' "This game, drawn by" row are gone; the People line
  (what Luminati draws the people as) stays.
- **`src/ui/worldfail.js`, `main.js`:** if Luminati's module doesn't load, it throws starting, or it can't build a level
  (`state.failed`), a full-screen message: "The world couldn't be drawn on this device. Your game is safe…", the error
  in small print for a bug report, and **Retry** (140 × 48 px), which saves the slot and reloads. It takes the taps.
- **The browser suite** (`test/browser/run.mjs`): to keep CI's time where it was, the checks that name no renderer still
  test Emberlit's painting, through the escape (an init script in every context); they move onto Luminati, with a budget,
  in step 4. A new check refuses Luminati's module and finds the message, its Retry reloading the page and no tap
  reaching the world. The Graphics check finds no renderer to choose. `test/render3d.test.mjs`: the default, the old
  stored choice ignored, the escape and its end.
- **The capture tools** (`rig`, `skills`, `bosses`, `feel`, `tools/dungeon/capture.mjs`) pass `&renderer=emberlit` for an
  Emberlit run, now that the default is Luminati.

### 3.2 Step 2 as built (2026-11-09; the owner: "start step 2")

- **Removed:** `lumina/` (4.5 MB, 106 files), `tools/lumina/` (`build.mjs`, `levels.mjs`, its vite config, `ember/`), the
  kit spike `tools/kit/` and `tools/actor-lab/kit-cast.html`, and `lab.js`'s `labActor`, which only they used: 124
  tracked files. Its pictures in `docs/img/dungeon/` stay with the proposal.
- **Moved:** the ground cover `tools/lumina/ember/ground.js` → `tools/render3d/ground.js`; Luminati's checkout
  `tools/lumina/.work/` → `tools/render3d/.work/` (gitignored). `node tools/render3d/build.mjs` rebuilds
  `src/vendor/luminati-80e1aa6/` byte for byte the same from the new places.
- **The menu:** Compare worlds and Another world are gone; the Frontier keeps its button.
- **Tests:** the prototype's browser section (six checks) is gone; its ground check (a quarter-size ground cover, no
  floating dots) now runs on the game's own Luminati Thornwick. The menu check finds the Frontier and no prototype.
- **Docs:** `lumina-prototype.md` Superseded; A16 Superseded; CREDITS credit Luminati as the game's renderer; AGENTS.md's
  prototype and spike commands and URLs out.

### 3.3 Step 3 as built (2026-11-09; the owner: "Ok go ahead")

- **The loaders first** (`src/render/renderer.js`): `loadActorAtlas` and the env atlases fetch the albedo only. Luminati
  never read the rest (its sprite figures and kept env sprites load `*.alb.png` themselves, `tools/render3d/world.js`);
  Emberlit's painting, the developer's `?renderer=emberlit` until step 4, now lights every figure and structure with
  one normal (`FLAT_NRM`), no glow, and stands a structure as a flat card (no depth key, no baked shadow, no lit windows).
- **Then the files:** `assets/actors/*.nrm.png` (76), `*.emi.png` (25), `assets/env/*.nrm.png` and `*.key.png` (5 + 5):
  111 files, **118.0 MB**, out of the repo and the deploy (`assets/actors` and `assets/env` are 84.6 MB now). A phone
  in the game no longer downloads them either. Measured on Luminati, the art a boot fetches from `assets/actors` and
  `assets/env` (`?renderer=luminati`, settled), before (677dcba) → after:

  | Scene | Before | After |
  |---|---|---|
  | Thornwick | 51 files, 37.0 MB (albedo 16.8, normals 18.3, keys 1.5, glow 0.4) | 24 files, 16.9 MB (−54 %) |
  | The Old Barrows, floor 1 | 25 files, 26.5 MB (albedo 12.0, normals 13.1, keys 1.1, glow 0.3) | 11 files, 12.0 MB (−55 %) |

  Nothing failed to load either way. The browser suite: 113 checks, all pass (the Emberlit-painted ones too, lit flat).
- **Then the bakers:** `bake.cjs` writes the albedo only (the JSON's `img` hash from it) and removes a stale normal or
  glow map; `bake-env.cjs` the albedo only. The lab still draws the passes; nothing is re-baked by this step.
- **Tests:** the browser suite's atlas check also fails if a normal, glow or depth-key atlas is asked for;
  `fens-foes.test.mjs` no longer requires a normal map.

### 3.4 Step 4 as built (2026-11-09; the owner: "start step 4")

- **`src/render/renderer.js`: 2,099 → about 1,250 lines.** Gone: the shaders and all WebGL (the 1 × 1 stub too: a phone
  without WebGL2 no longer fails here, before the can't-start message), the G-buffer bake and its double buffers, tile
  painting and recording, the ground shadows, figure stamping and the x-ray, the hazards' ground tint, passes A and B,
  the lights' setup, `?tiles`/`?tv`, the harvest sprites and the Stage's hooks. What stays: the camera, the draws list,
  the effects' emissive plane, the overlay and every tap. The actor and env atlases are read as JSON only now: the
  painter loads the albedo itself, so nothing here decodes a sheet into per-frame sprites (it did, every atlas, at boot).
- **`src/render/tilestyles.js`, `outdoorpaint.js`** deleted.
- **The developer escape** (`?renderer=emberlit`, `settings.js` `rendererFor`) is gone; the renderer has no `external`
  option: Luminati is always the painter.
- **`?tierlooks`** is gone (the owner's decision 4). Which skills Luminati draws in its own looks is one list,
  `skillfx.js` `LUM_LOOKS` (with `LUM_HOLDS`, a stun's stars), read by the renderer; those twenty skills' Emberlit
  moments and the stun and knockdown holds were deleted (`skillfx.js` 781 → 588 lines). `tools/capture/tiers.mjs`,
  which staged the review, is retired.
- **The Stage** (decision 3): its cast lineup and the env, props and fx views drew through Emberlit's painting and are
  retired (`src/dev/stage.js` deleted); the icons and faces views stay, plain HTML (`src/dev/review.js`, same URL),
  and `tools/capture/stage.mjs` takes their sheets.
- **The browser suite on Luminati, with a budget.** Luminati drawing in software costs ~50 s a page load on this
  machine (the slots checks took 207 s on it, before the budget). The flow checks (slots, menus, dialogue, quests, the
  HUD's layout) run with no world drawn: `?world=off` (localhost only, kept for the tab) stands an empty painter in
  Luminati's place, so the camera, the figures' frames, the overlay and the taps run as in the game. The checks about
  the world ask for it with `&world=on`: the M3 loop (now one run, on Luminati), Luminati's can't-start message and the
  render3d section. Retired with Emberlit's painting: the Stage lineup check, the art review's env/props/fx, and the
  x-ray shares (Thornwick's townsfolk behind buildings; Saltmere's keeps its "everyone in view and tappable" half).
- **The capture tools** (`rig`, `skills`, `bosses`, `feel`, `tools/dungeon/capture.mjs`) draw on Luminati only; they
  still pass `&renderer=luminati`, so a `--base` checkout from before draws on it too.

## 4. Questions for the owner (answered 2026-11-09: the recommendations, all four)

The owner: "Go with your recommendations on all four". So: (1) a message and a Retry, no hidden fallback (step 1, built);
(2) the prototype goes (step 2); (3) the Stage's env, props and fx views and the art review's are retired, the icons and
faces views stay (step 5); (4) the tiers' looks are final: `?tierlooks` goes, `TIER_LUM` stays (step 4).


1. **A fallback if Luminati can't start** (no WebGL2, a phone out of memory): a message and a Retry button (recommended,
   and what step 1 does), or keep Emberlit's painting as a hidden fallback (it keeps 780 lines and the 119 MB)?
2. **The Luminati prototype** (`lumina/`, Compare worlds, "Another world"): remove it (recommended)?
3. **The Stage and the art review** (developer tools for the sprites): retire them (recommended for the env, props and
   fx views; the icons and faces views stay), or port them to Luminati?
4. **The tiers' looks review switch** (`?tierlooks`): are the looks final (remove it), or keep it for another review?
