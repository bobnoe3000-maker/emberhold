# AGENTS.md — working in Emberfall

Guidance for coding agents and people working in this repo. It's short on purpose; the
detail lives in the docs it points to. If something here conflicts with a doc, the doc
listed as plan of record in [`docs/README.md`](docs/README.md) wins. Fix this file when
that happens.

## Read first

| Order | Doc | What it is |
|---|---|---|
| 1 | [`docs/architecture.md`](docs/architecture.md) | Layers, module map, stack decisions (A1–A11) |
| 2 | [`docs/development-plan.md`](docs/development-plan.md) | What we're building, and in what order |
| 3 | [`docs/emberfall-gdd.md`](docs/emberfall-gdd.md) | The rules and numbers |
| 3 | [`docs/emberfall-world.md`](docs/emberfall-world.md) | Canon: names, history, factions |
| 4 | [`docs/quest-lore-system.md`](docs/quest-lore-system.md) | Quests, lore, NPCs, dialogue |
| 4 | [`docs/emberlit-tdd.md`](docs/emberlit-tdd.md) | The renderer |
| 4 | [`tools/actor-lab/README.md`](tools/actor-lab/README.md) | Bakes |

## Commands

```bash
npm ci                                    # once: dev tooling only (the game itself has no build)
npm run serve                             # open http://localhost:8080 (ES modules need a server)
#   ?slot=1|2|3 (game slot)  ?scene=town|overland|dungeon (preview: starts fresh, never saves)
#   ?notitle (skip the splash, loading screen and title and play at once; tests and captures)
#   ?region=vale|fens|reach|heights  ?dev (localhost only: globalThis.__sim)
#   ?dev&slow=8 (slow motion) · ?dev&manual (you drive frames: globalThis.__frame(ms))
npm run check                             # everything CI runs except browsers:
#   typecheck (tsc, JSDoc; files opt in with // @ts-check) · lint (incl. sim determinism rules)
#   content (JSON Schema + Ink compile) · test (node:test) · smoke (SMOKE_OK + RENDER_SMOKE_OK)
npm run test:browser                      # replay parity Chromium/WebKit vs Node, game slots, M3 create→Fallen→temple→wipe, intro, fights, talk to Maudry (WebKit: CI)
node tools/balance/roomlv.mjs 300 6 6 0,2 [seed] [--src dir]   # balance: secs roomLv heroLv hires; --src = a before checkout
node tools/content/ink.mjs                # compile content/dialogue/*.ink → .json (commit both; --check = CI)
cd tools/actor-lab && npm i && sh fetch-assets.sh    # once, for bakes
node tools/actor-lab/bake.cjs [actor…]    # actor atlases (+ weapon anchors, + <actor>.face.png portraits); --anchors / --portraits refresh only those
node tools/actor-lab/faces.cjs            # the face board: every faces.json preset and every face part → tools/actor-lab/out/faces_board.png
node tools/actor-lab/icons.cjs [ids]      # item icons
node tools/actor-lab/bake-env.cjs         # buildings / trees / rocks
```

CI (`.github/workflows/ci.yml`) runs all of the above on every push. Add a new command here
in the same change that introduces it.

## Golden rules

1. **The sim is headless and deterministic.** In `src/sim/`:
   - **No imports from render, UI, story, net or the DOM.** It must run under plain
     `node`.
   - **No hidden time or chance.** No `Math.random`, `Date`, `performance.now`, timers,
     `await`, or reading the clock.
   - **Random draws** go through `mulberry32(streamSeed(seed, stream))` in `rng.js`, one
     stream per purpose. Never share a stream across systems: a new draw in one system must
     not shift another system's results.
   - **Iteration order:** only `Map`/`Set` insertion order and arrays.
   - **Math:** use `sim/detmath.js` (`hypot`, `sin`, `cos`, `atan2`, `exp`), never the
     engine-approximated `Math.sin` / `cos` / `atan2` / `exp` / `pow` / `hypot` or `**`.
     Tables replace curves (see `XP_TABLE`). `+ − × ÷`, `Math.sqrt`, `floor`, `round`,
     `abs`, `min` and `max` are fine. The server replays sessions on another engine, and one
     differing bit forks the replay.
2. **Commands in, events out.**
   - The UI and story layers never mutate sim state. They push a command (`sim.commands.push`,
     one command per call) and the sim validates it.
   - Presentation reacts to `sim.bus` events and reads state; it never writes it.
3. **Fair play: the client is never trusted** (architecture §10, development plan §2.13).
   - **Progress comes only from the sim.** Every level, XP point, coin and item comes out of
     simulated play (commands → sim rules). Never add a command or UI path that grants
     rewards, sets stats or creates items directly. A reward is always a sim rule the server
     can replay.
   - **Validate every new command** in the sim: ownership, reach, class, bag room, cooldowns,
     location. Invalid commands must do nothing.
   - **Dev hooks** (`?dev`, globals, cheats for testing) stay localhost-only.
   - **Keep replays exact:** `smoke-test.mjs` must still replay a recorded session to the same
     hash and reject every tamper case.
4. **The sim owns the save shape.** Anything that must survive a reload goes through
   `snapshot()` / `restore()`, with a `SAVE_VERSION` bump and a migration in
   `persist/save.js` if the shape changes. Old saves must load or be refused cleanly, never
   half-read.
   - The snapshot holds **durable fields only**. A party member's are listed in
     `MEMBER_KEYS` in `core.js`. Runtime links (targets, stations, velocities) made it
     circular before.
   - Add a new durable member field to `MEMBER_KEYS`.
5. **Content is data; text is pre-written.**
   - Quests, NPCs, lore and loot tables live in `content/` (JSON plus schema). Dialogue lives
     in Ink.
   - **No runtime text generation of any kind.** Every line a player reads is authored,
     reviewed and versioned.
   - Names and facts come from [`docs/emberfall-world.md`](docs/emberfall-world.md): change
     canon there first.
6. **Balance is a contract.** The smoke test gates the design targets:
   - a solo fighter holds a level-1 room for 10 minutes;
   - same-level rooms cost 20–30 % HP per wave;
   - a room three levels above you defeats you (solo);
   - a same-level party visit leaves nobody Fallen.

   If a change moves numbers, run the room-level harness (`tools/balance/roomlv.mjs`, with
   `--src` pointing at a checkout of the previous commit) and report before/after.
7. **Measure, don't guess.** For feel, performance or art changes, capture before and after:
   - motion traces on the manual clock;
   - burst frames;
   - contact sheets;
   - balance runs.

   Put the numbers in the commit or doc. The critic docs (`docs/art-critic-pass-*.md`) show
   the format.

## Best practices by area

### JavaScript and modules (A1)

- **Plain ES modules:**
  - relative imports with a `.js` extension;
  - no bare specifiers in `src/` unless mapped in the import map;
  - no bundler-only syntax (JSX, TS syntax, `import.meta.glob`).
- **Types:** add JSDoc types to exported functions and to command, event and save shapes;
  put shared typedefs in `src/types.d.ts`. `// @ts-check` new files.
- **Style:**
  - Match the surrounding style: dense but readable, with a module header comment
    explaining *why* the module exists and its contracts.
  - Comments explain intent and non-obvious constraints, not what the next line does.
- **Dependencies:** none without an architecture decision-log row.
  - Prefer tiny, zero-dependency libraries that load as ES modules.
  - Pin exact versions.
  - Vendor into `src/vendor/` or map from a CDN with SRI; decide per package in its decision
    row.

### Rendering, Emberlit (A2)

- **Presentation-only state:** the renderer reads sim state and interpolates (`p.px → p.x`
  by alpha). Presentation-only state (animation phase, effects, particles) lives in the
  renderer or animator, keyed by unit (`WeakMap`), never on sim objects.
- **Hot loops:**
  - No allocation per frame in stamping and lighting loops.
  - Reuse typed arrays.
  - Upload with `texSubImage2D`.
  - Bake once and replay (tile recordings, atlases).
- **G-buffer conventions** ([`docs/emberlit-tdd.md`](docs/emberlit-tdd.md)):
  - EMI alpha < 255 = steady glow (actors, rings, effects); 255 = flickering embers.
  - NRM alpha = height.
  - DEP = depth key.
  - Actors are stamped at `Math.round`.
  - The camera is sub-pixel: ints for the window, `lastCam.rx/ry` for overlays and
    hit-tests.
- **Effects:** draw into the emissive plane through `fx.js` primitives, depth-tested against
  their owner. New skill or spell effects reuse the primitives rather than adding new
  passes.
- **Context loss:** handle WebGL context loss when touching GL setup. Test on a real phone
  before calling a renderer change done.

### UI and windows (A3)

- **Thumb reach:** portrait, one thumb. Everything important sits in the lower two-thirds.
  Touch targets are ≥ 44 CSS px. Respect `env(safe-area-inset-*)`.
- **No full re-renders under a finger.** A card or button that re-renders several times a
  second loses taps. Use keyed Preact components, or match press and release by stable
  identity (see `src/ui/party.js`).
- **Overlays swallow pointer input** so the world doesn't also get the tap: stop propagation
  on `pointerdown`, `touchstart` and `mousedown`.
- **Dialogue and lore text** render as text, never as HTML.
- **Accessibility:** text ≥ 11 px on phones, contrast ≥ 4.5:1 for body copy, no information
  by colour alone. For rarity, pair the colour with the word.

### Narrative content (A4, A5)

- **Ink** (`content/dialogue/*.ink`):
  - one file per NPC or quest;
  - knots named `npc_quest_beat`;
  - effects only through tags (`# quest: accept id`, `# give: gold 20`, `# flag: set x`);
  - conditions read bound variables (`quest_mill_state`, `hero_level`, `region`,
    `renown_vale`).
  - Never compute rewards in Ink.
- **Stable ids:** quest ids, NPC ids, knot names and lore ids are API. Rename only with a
  save migration.
- **Voice:** follow the tone rules and naming guide in the world doc (small stakes, wry,
  history found not told, no chosen ones).
- **CI** compiles every Ink file and validates every JSON file against its schema. A broken
  story is a failing build.

### Persistence and online (A6–A9)

- **Saves are small and reproducible.**
  - Store the seed, diffs and ids, never derived data or content text.
  - IndexedDB calls are async: keep them out of the tick.
  - Autosave on interval and on `visibilitychange` / Capacitor pause.
- **Supabase:**
  - RLS on every table, with policies written in `supabase/migrations/*.sql`.
  - The client uses the anon key only; the service-role key never ships.
  - Leaderboards are written only by the validator.
- **Colyseus:**
  - Server-authoritative: clients send commands, never positions or results.
  - The room ticks the same `/sim` at 20 Hz; send state deltas and let clients interpolate.
  - Handle reconnection tokens and idle timeouts.
- **Capacitor:**
  - Sign in with Apple whenever any social login exists.
  - Pause the loop and autosave on `pause`, resume on `resume`.
  - Keep native plugins behind `src/net/` or `src/app/` adapters, so the web build runs
    without them.

### Art pipeline

- **Never hand-edit baked outputs** (`assets/actors`, `assets/items`, `assets/env`). Change
  the bake config (`tools/actor-lab/*.json`) or the lab code and re-bake.
- **Actors** are KayKit CC0 (credits in `assets/CREDITS.md`). A per-actor grade, gain or clip
  change goes in `bake.json`. `node bake.cjs <actor>` re-bakes one actor.
- **Look-dev:** use the `?dev&slow` / `?dev&manual` captures and contact sheets. Compare at
  in-game scale (56 px figures, 3 CSS px per native px).

### Testing

- **Test types:**
  - **Sim:** a pure function of seed plus commands, so assert outcomes, not implementation.
  - **Render:** smoke tests for pure pieces, plus Playwright captures on the manual clock
    for anything visual or timing-related.
- **Balance** changes run the room-level harness at levels 3 / 6 / 9, solo and party.
- **Rules:**
  - Every new sim system gets smoke or `node:test` coverage for its rules and save
    round-trip.
  - A bug fix gets a test that fails without it where practical.

### Docs

- **Index:** every doc is listed in `docs/README.md` with a status (Plan of record,
  Current, Implemented, Superseded, and so on).
- **Order of change:**
  - Design changes land in the GDD.
  - Canon changes land in the world doc first.
  - Architecture changes get a decision-log row.
- **Mockups and plans:** mark them **Implemented** with file pointers when they ship.

### Git

- Keep commits small and scoped, with a message body that says *what changed and why*,
  with measured numbers where relevant.
- Follow the repository owner's branch and attribution conventions. Currently commits go to
  `main`.
- Never commit secrets, `.env` files, `node_modules` or bake scratch output.
