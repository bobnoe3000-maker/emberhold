# Luminati only: what to remove and clean up (a proposal, 2026-11-09)

**Status: Accepted; step 1 done (2026-11-09).** The owner (2026-11-09): "we are going to stick with the Luminati version
and fx/asset combos in the current code, so what code/assets and game options should we remove or clean up?", then, on
§4's four questions: "Go with your recommendations on all four, start step 1". Also decided the same day: the dungeons
keep their walls and floors (no KayKit kit: [dungeon-kit-proposal.md](./dungeon-kit-proposal.md)). Decision row A21
([architecture.md](./architecture.md)).

This proposal is from an audit of the code as it stands (every claim below has a file and line behind it). Steps 2–5 are
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
| 2 | **The prototype and the spikes out** (`lumina/`, `tools/lumina/` but `ground.js`, `tools/kit/`, kit-cast; Compare worlds and Another world) | Low: links and its own tests only |
| 3 | **The atlases' lighting channels out**: loaders first, then the files, then the bakers | Low once the loaders are changed; a figure that fails to load is caught by the browser suite |
| 4 | **renderer.js's world painting out**, `tilestyles.js`, `outdoorpaint.js`, the GL stub, the dead skill moments, `?tiles` and `?tierlooks` | Medium: a big file; the overlay and taps must not move (the suite's tap and HUD checks) |
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
