# Emberfall — Architecture

**v1.0 · 2026-09-28 · Plan of record for the technical architecture.** This doc describes:
- how the app is built today and how it grows to cover the features in
  [development-plan.md](./development-plan.md);
- the evaluated tech stack, with a decision record for each choice.

It supersedes the stack recommendation in [emberhold-design.md §8](./emberhold-design.md)
(Phaser + TypeScript + Vite). The build went a different way: zero-build ES modules and a
custom WebGL2 deferred renderer. This doc evaluates that path honestly. The layering rules
of [emberhold-design.md §7](./emberhold-design.md) still stand, and are restated in §2.

**Related:**

| Doc | What it holds |
|---|---|
| [emberfall-gdd.md](./emberfall-gdd.md) | Game design: rules, numbers, loops |
| [emberfall-world.md](./emberfall-world.md) | Narrative canon: history, regions, factions, characters |
| [development-plan.md](./development-plan.md) | Feature plan and milestones |
| [quest-lore-system.md](./quest-lore-system.md) | Quests, lore, discovery, dialogue and NPCs (the Hero component) |
| [emberlit-tdd.md](./emberlit-tdd.md) | Renderer spec: G-buffers, lighting, post |
| [dreadforge-tdd.md](./dreadforge-tdd.md) | Materials and actor pipeline background |
| [character-direction.md](./character-direction.md) | Character art |
| [`tools/actor-lab/README.md`](../tools/actor-lab/README.md) | Bake pipeline |
| [AGENTS.md](../AGENTS.md) | How to work in this codebase |

---

## 1. Constraints that shape everything

1. **A phone, portrait, one thumb.** Mobile Safari and Chrome are the primary targets.
   Desktop is secondary.
2. **Offline-first.** The whole single-player game runs with no server. Accounts, cloud
   saves and multiplayer are additive.
3. **Deterministic, headless simulation.** A fixed 20 Hz tick, seeded RNG streams, and
   commands in / events out. This one property pays for four features:
   - saves that are a seed plus diffs;
   - offline expeditions (fast-forwarding the same sim);
   - leaderboard validation (replaying command logs);
   - server-authoritative multiplayer (the same sim in Node).
4. **No generative AI at runtime.** Every line of story, quest, lore and dialogue text is
   pre-written, branching and versioned in the repo. "NPC AI" means *behaviour*: schedules,
   wandering, combat roles and target choice. It never means generated text. Procedural
   content (quest assembly, loot rolls, dungeon layout) is rule-based and seeded.
5. **Small team, AI-assisted development.** The code must stay:
   - readable in one sitting;
   - testable from the command line;
   - buildable without a toolchain that fights automation.

---

## 2. Layers

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ SHELL        PWA (service worker) on the web · Capacitor for iOS / Android    │
├──────────────────────────────────────────────────────────────────────────────┤
│ APP          main.js: boot, the screen flow (title → select → create → game), │
│              the fixed-tick loop, input → commands                            │
├───────────────────────────┬──────────────────────────────┬───────────────────┤
│ PRESENTATION              │ NARRATIVE RUNTIME            │ SERVICES (online) │
│ render/  Emberlit WebGL2  │ story/  Ink runtime adapter: │ net/  Supabase    │
│ ui/      DOM windows      │ dialogue text + choices;     │   (auth, profile, │
│ audio/   Howler           │ effects become sim commands  │   cloud saves,    │
│ cutscene/ timelines       │                              │   leaderboards)   │
│                           │                              │ Colyseus (rooms)  │
├───────────────────────────┴──────────────────────────────┴───────────────────┤
│ SIM (headless, deterministic; zero DOM, zero render imports; runs in Node)    │
│ core · battle · world / outdoor / level · party · items / loot · travel ·     │
│ path · quest/ (engine, generator, discovery, chronicle) · npc/ (registry,     │
│ schedules, behaviour) · rng · bus                                            │
├──────────────────────────────────────────────────────────────────────────────┤
│ CONTENT (data, versioned)  content/: quests, npcs, lore, loot tables, rifts,  │
│ bosses, cutscenes (JSON + JSON Schema); dialogue/*.ink → compiled .json       │
├──────────────────────────────────────────────────────────────────────────────┤
│ PERSISTENCE  persist/: save slots (IndexedDB), versioned migrations,          │
│ cloud sync adapter                                                           │
└──────────────────────────────────────────────────────────────────────────────┘
  TOOLS (offline): tools/actor-lab (three.js + Playwright bakes: actors, icons,
  environment); tools/content (Ink compile + schema validation)
  SERVER (M10+): server/ Colyseus rooms running /sim; replay validator;
  supabase/ migrations and RLS policies
```

**Rules (non-negotiable):**
- **`sim/` imports nothing** from `render/`, `ui/`, `story/`, `net/` or the DOM. It must run
  under `node`, and the smoke test proves it.
- **The only seams are commands in and events out** (`sim/bus.js`). The UI never mutates sim
  state. It pushes commands such as `{ type: 'equip', member, uid }`, and the sim validates
  them.
- **The sim owns the save shape** (`snapshot()` / `restore()`). Persistence only stores and
  migrates it.
- **Dialogue text never changes game state directly.** An Ink choice can carry effect tags,
  and the story adapter turns them into sim commands, which the sim validates. Examples:
  `# quest: start mill_bandits`, `# give: gold 20`.
- **Content is data.** Quests, NPCs, lore, loot tables, rift and boss definitions live in
  `content/` as JSON and are validated by schema in CI. Code interprets content; it doesn't
  embed it.

---

## 3. Module map

**Today (about 6.2k lines of JS):**

| Area | Files | Notes |
|---|---|---|
| Sim | `core.js` (tick, movement, commands, saves), `battle.js` (waves, AI, formation, abilities, Downed / Slain (`fallen` in code), damage), `world.js` / `level.js` / `outdoor.js`, `party.js` (stats, creation), **`heroes.js`** (hero, party, bench, temple and inn commands; the tavern's hire, Ask around, Retrain and the dawn wage), **`companions.js`** (the Lantern Guild's sellswords: ranks, perks, wages, loyalty; GDD §6.2), **`attributes.js`**, **`skills.js`**, `items.js`, `loot.js`, `travel.js`, `path.js`, `rng.js`, `bus.js`, **`detmath.js`** (engine-independent math), **`replay.js`** (session recorder, state hash, replay verifier) | Headless, 20 Hz, bit-identical across engines |
| Render | `renderer.js` (Emberlit: CPU-baked G-buffer, WebGL2 lighting and post, sub-pixel camera), `daylight.js` (the outdoor light by the time of day: uniforms only), `anim.js`, `fx.js`, `gsprite.js`, `iso.js`, `outdoorpaint.js`, `tilestyles.js`, `palette.js` | The legacy Canvas2D and flat renderers were deleted at M2.5 |
| UI | `hud.js`, `party.js` (cards), `sheet.js` (character window: Gear / Stats / Skills), `compass.js`, `townmenu.js` (temple, inn, tavern), `input.js`, `actorart.js` (portraits, escaping); Preact + htm: **`slots.js`** (Game slots), **`title.js`** (Title / pause menu), **`create.js`** (character creation), **`partyscreen.js`** (Party screen and bench) | Vanilla DOM and template strings for the older windows; Preact for new ones |
| Persist | `persist/save.js` (three game slots, save v5, migrations), `persist/idb.js` | IndexedDB, with a localStorage backup on page hide |
| Vendor | `src/vendor/` (Preact, htm) | Pinned ESM builds, mapped in `index.html` |
| Assetforge | `assetforge/doll.js`, `palette.js` | The paper-doll fallback hero; the rest was retired with the legacy renderers at M2.5 |
| Dev tooling | `package.json` (dev only), `tsconfig.json`, `eslint.config.js`, `test/`, `tools/content/`, `.github/workflows/ci.yml` | Types, lint (with the sim determinism rules), `node:test`, content schemas, browser tests, CI |
| Tools | `tools/actor-lab/`, `tools/balance/roomlv.mjs` | three.js 0.169 + playwright-core bakes: actor atlases with weapon anchors, item icons, environment atlas; the room-level balance harness (with `--src` for before/after runs) |

**Planned additions** (the milestones are in [development-plan.md](./development-plan.md)):

| Module | Purpose |
|---|---|
| `src/app/` | The screen state machine: Boot → Title → Intro → Account → Select → Create → Game. It owns lifecycle (pause/resume → autosave). |
| `src/sim/quest/` | Quest engine (state machines driven by sim events), the side-quest generator, discovery triggers and the Chronicle |
| `src/sim/npc/` | The NPC registry (named and townsfolk), day schedules, wander and work behaviour, and quest-giver hooks |
| `src/sim/rift.js` | Timed Ember Rifts: seeded weekly layout, run timer, score |
| `src/story/` | The inkjs adapter: bind sim state into Ink variables, map tags to commands, persist Ink state |
| `src/cutscene/` | The boot screens and the intro (implemented: `player.js`, `scenes.js`, `score.js`); later, a timeline player for camera moves, letterboxing, text cards, stills and fades |
| `src/audio/` | Howler: music beds, sound-effect sprites, mobile unlock |
| `src/net/` | The Supabase client (auth, profile, saves, leaderboards) and the Colyseus client |
| `content/` | JSON content, compiled Ink and schemas |
| `server/` | Colyseus rooms and the replay validator (Node) |
| `supabase/` | SQL migrations, RLS policies and edge functions |

---

## 4. Runtime flow

- **Loop** (`main.js`):
  - `requestAnimationFrame` accumulates real time, then runs `sim.tick()` at a fixed 20 Hz
    (commands drained first).
  - `renderer.render(alpha, now)` interpolates between ticks.
  - The UI reads state and listens to bus events.
  - The dev hooks `?dev&slow=N` and `?dev&manual` slow or step the clock for captures (see
    AGENTS.md).
- **Screens** (planned `app/`):
  - First launch: `Splash → Loading → Title → Intro cutscene → Character Create → Game`
    (implemented in `main.js` with `cutscene/player.js`; the `app/` state machine comes later).
  - Later launches: `Title → Character Select → Game`.
  - The account screen is reachable from Title and Settings, never forced.
  - Each hero is a save slot: seed, sim snapshot, Ink state, settings.
- **Dialogue:**
  1. Tapping an NPC sends `talk { npc }`.
  2. The sim resolves who it is and emits `dialogue { npc, knot, vars }`.
  3. The story adapter runs the Ink knot with the variables bound, and the dialogue window
     shows the lines and choices.
  4. A chosen line's tags become commands. For example `# quest: accept mill_bandits` becomes
     `{ type: 'questAccept', id: 'mill_bandits' }`.
  5. The sim validates each command and emits events such as `questChanged`.
- **Cutscenes** are data: a JSON timeline of steps (`camera`, `wait`, `card`, `still`,
  `dialogue`, `fade`, `music`). The sim pauses (no ticks) while one plays, except for
  in-world scripted walks, which are sim commands.

---

## 5. Data and persistence

- **Game slots** (shipped at M2.5, `persist/save.js`, save v5 since M3): up to **three**. Each slot is a
  whole game: its own world seed, main character, party (three hero slots: the main
  character plus two companions) and progress.

  ```
  { version: 4, savedAt, meta: { name, cls, level, party, scene, depth, playtime, gold },
    data: sim.snapshot() }          // M4+ adds story: inkState; M6 adds verifiedHash
  ```

  The active slot index lives in localStorage. `?slot=N` picks a slot. Switching slots saves,
  sets the active slot and reloads the page for a clean sim and renderer.

  The sim snapshot is small by design: the seed plus diffs plus party, bag, quest state and
  counters. Every schema change bumps `SAVE_VERSION` with a migration step
  (`persist/save.js`).
- **Storage:**
  - IndexedDB (`persist/idb.js`, a tiny in-house wrapper) holds the slots, with
    localStorage as a fallback.
  - On page hide, a **synchronous localStorage backup** of the active slot is also written,
    because a phone can kill the page before an async write lands. Reads take the newer of
    the two.
  - The v3 single save (`emberhold.save`) migrates into slot 1 on first boot.
  - `?scene=` preview links never write a slot.
- **Cloud (M6):**
  - A `saves` table keyed by `(user_id, slot)` holds each slot's latest **verified**
    snapshot, its hash and `updated_at`. Only the validator writes it (§10).
  - There are no sync conflicts to resolve: a device uploads sessions, not saves, and the
    server's replay is the save.
- **Content** is loaded with `fetch` at boot and hashed. Saves store content **ids**, never
  copies of content text, so a rewrite of a line doesn't break old saves. Quest ids and knot
  names are stable API.

---

## 6. Online services (M6 onward)

- **Accounts:**
  - Guest by default: a local profile with no sign-up.
  - "Save to cloud" links an account through Supabase Auth: anonymous sign-in first, upgraded
    later to Apple, Google or an email one-time code.
  - Sign in with Apple is mandatory on iOS whenever any third-party login is offered.
- **Tables** (Postgres, with RLS on every table):
  - `profiles` (display name, created_at);
  - `saves` (verified state, validator-written);
  - `sessions` (claims awaiting or past validation: start hash, log, ticks, end hash,
    verdict);
  - `leaderboards` (rift times, Undervault depth), written only by the validator;
  - `hireling_snapshots` (async hire-a-friend);
  - `arena_snapshots`.
- **Validation:** every progression session and every leaderboard entry arrives as a claim:
  seed, start state, command log, tick count and end hash. A Node worker (or edge function)
  replays it with `sim/replay.js`. Only a matching result is written (§7, §10).
- **Realtime (M10+):** Colyseus rooms run `/sim` server-side, one per shared instance:
  - town presence;
  - co-op site;
  - raid;
  - arena match.

  Clients send commands; the room ticks at 20 Hz and broadcasts state deltas; clients
  interpolate, as the renderer already does between ticks.

---

## 7. Determinism, stated precisely

- **Inside `sim/`:**
  - no `Math.random`, `Date`, `performance.now`, DOM, timers or `await`;
  - every random draw comes from `mulberry32(streamSeed(seed, stream))`, with one stream per
    purpose (loot has its own counter; battle and idle have their own streams);
  - `Map` and `Set` are iterated in insertion order only;
  - no object-key order tricks.
- **Floating point:**
  - `+ − × ÷` and `Math.sqrt` are IEEE-exact on every engine.
  - `Math.sin`, `cos`, `atan2`, `exp`, `pow` and `hypot` are **not** guaranteed identical
    across engines (V8 vs JavaScriptCore). A replay on the same engine is exact. A replay
    across engines needs `sim/detmath.js`: polynomial and table versions, used for anything
    that feeds positions or outcomes.
  - **Done:** every such call in the sim now goes through `sim/detmath.js`, built only from
    `+ − × ÷` and `sqrt` (accuracy ~1e-11). The XP curve is an integer table, and there is
    no `**` in the sim. A CI job will replay recorded sessions on Chromium, WebKit and Node
    to hold that line (M6).
  - Realtime multiplayer doesn't need cross-engine determinism, because the server is
    authoritative.
- **What determinism buys:** saves (seed + diffs), expeditions (fast-forward), bug
  reproduction (seed + command log), leaderboard validation and server rooms.

---

## 8. Tech stack: evaluated

Each choice lists the options weighed and why one won. **Language: JavaScript (ES2022
modules), type-checked with TypeScript through JSDoc; server code in the same language on
Node.**

### 8.1 Language and build

| Option | For | Against |
|---|---|---|
| **JS ES modules + JSDoc types, checked by `tsc --noEmit --checkJs` (chosen)** | Keeps zero-build dev: edit, reload, and push-to-deploy on Netlify. Node runs the same files for tests and the server. Types catch errors without a compile step. Easiest loop for AI-assisted editing. | JSDoc is wordier than TS syntax. Some advanced types are awkward. |
| Full TypeScript + Vite | Best typing ergonomics and the standard ecosystem path | Adds a compile step to every run, test and tool script. Would convert about 6k working lines for little player-facing gain now. |
| Stay untyped JS | No change | Content, save and command shapes are growing (quests, NPCs, net). Shape bugs will cost more than JSDoc. |

**Decision:**
- JSDoc typedefs for commands, events, the save, items and content go into
  `src/types.d.ts`, with `// @ts-check` per file.
- **Vite joins at M6** as a *packager only*: minified, hashed bundles for the PWA and
  Capacitor. Dev stays zero-build: sources stay plain ES modules, and `vite build` bundles
  them untouched.
- Revisit full TypeScript if the team grows past about three engineers.

### 8.2 Rendering

| Option | Verdict |
|---|---|
| **Emberlit: custom WebGL2 deferred renderer (chosen, shipped)** | This is the art identity: albedo, normal, emissive and depth G-buffers with point lights, bloom, a sub-pixel camera and emissive weapon effects. See [emberlit-tdd.md](./emberlit-tdd.md). It is already tuned for mobile. |
| Phaser 3/4 | Great 2D engine, but no deferred normal-mapped lighting: we'd rebuild Emberlit inside a custom pipeline and fight its scene graph. It pays off only if we lacked a renderer. |
| PixiJS 8 | A good 2D batcher with filters. Same lighting gap. |
| three.js at runtime | Real 3D, but the look depends on baked 56 px pixel sprites with normals. Runtime 3D is heavier on phones and changes the art style. It stays a *tool* dependency for bakes. |
| Godot 4 (web export) / Unity WebGL / Defold | Real engines with editors, but large WASM downloads and slow mobile-web start. They drop the zero-build, AI-editable loop and break the "same sim in Node" server path. |

**Decision:** keep Emberlit. Handle WebGL context loss (rebuild textures on
`webglcontextrestored`). Keep a Canvas2D fallback out of scope.

### 8.3 UI (windows, sheets, dialogue, quest log, character creator)

| Option | Verdict |
|---|---|
| Vanilla template strings + `innerHTML` (today) | Fine for small cards, but full re-renders detach elements under the finger. This already broke taps on the party cards (fixed with a pointer-index workaround). It won't scale to inventory drag, the quest log and the creator. |
| **Preact + htm (chosen; vendored in `src/vendor/`, pinned, via the import map)** | About 4 KB, and `htm` gives JSX-like templates with **no build step**. Keyed diffing keeps elements stable under the finger. It loads as ES modules. `@preact/signals` joins when a window needs live sim bindings. The first window, Game slots, shipped at M2.5. |
| lit | Web components with a good template engine. Heavier mental model for app-style state; weaker component ecosystem for lists and drag. |
| Svelte / Solid | Excellent, but they need a compile step. Conflicts with §8.1. |
| React | Heavier than needed, and JSX needs a build. |

**Decision:**
- Adopt Preact + htm for new windows from M3: character creator, select, dialogue, quest
  log and skills.
- Port `sheet.js` and `party.js` when they're next touched.
- Keep the HUD vanilla.
- CSS stays hand-written with custom properties and one shared token file.

### 8.4 Narrative authoring (pre-written, branching)

| Option | Verdict |
|---|---|
| **Ink + inkjs (chosen)** | A proven branching-narrative language (inkle; used in shipped games), and inkjs is the official JS runtime. It has variables, conditionals, visit counts, tags, external functions and seeded shuffles. The story state serializes to JSON for saves. Writers work in plain text files with diffable reviews. |
| Yarn Spinner | Strong in Unity. The JS runtimes are community-maintained and less complete. |
| Twine / Twee | Great for prototyping, but a weak fit as an embedded runtime with a game state bridge |
| Custom JSON dialogue trees | Full control, but we would re-invent conditions, variables, visit counts and a writer-hostile format |
| articy:draft | A commercial tool with an editor and export. Overkill and closed. |

**Decision:**
- `content/dialogue/*.ink`, compiled to JSON by the inkjs compiler in `tools/content`, runs
  in CI. `RANDOM` and shuffle are seeded from the save seed.
- Ink holds **text and branching only**. Game effects go out as tags that become validated
  commands.
- Localization later: one Ink project per locale, or string ids with a lookup (decide at
  M5).
- **Implemented (M4 slice 1, A13):** `tools/content/ink.mjs` compiles; `src/story/adapter.js`
  runs a story (binds the sim's variables, turns tags into `dialogueEffect` commands, hands
  window tags back); `src/ui/dialogue.js` is the window; `src/sim/npcs.js` owns who stands
  where, the `talk` command and which flags each NPC may set. What a conversation must remember
  lives in sim flags, not in saved Ink state.

### 8.5 Content data

- **JSON + JSON Schema, validated with Ajv in CI (chosen).** No runtime dependency; schemas
  document the shapes.
- YAML reads nicer but adds a parser and whitespace bugs.
- TS or JS object literals would put content in code (reviews mix logic and prose).
- Zod gives runtime validation we don't need on the client.

### 8.6 Persistence

- **IndexedDB through a tiny in-house wrapper (`persist/idb.js`, the idb-keyval pattern in
  about 50 lines)** for the three game slots, with localStorage as a fallback (chosen).
  - Writing it ourselves avoids a vendored dependency for three functions.
- Dexie is richer than we need.
- The Capacitor Preferences and Filesystem plugins apply only on native. IndexedDB works
  inside the Capacitor WebView too, and one code path wins.

### 8.7 Backend: accounts, cloud saves, leaderboards

| Option | Verdict |
|---|---|
| **Supabase (chosen)** | Auth (anonymous → Apple, Google, email OTP), Postgres with row-level security, edge functions, and storage. SQL suits leaderboards and snapshots. Open source and self-hostable if needed. It was the stack already named in the original plan. |
| Firebase | Mature auth, but a NoSQL model that's awkward for leaderboards and relational snapshots, and deeper lock-in |
| Nakama (Heroic Labs) | All-in-one: accounts, leaderboards, tournaments, matches. Its JS runtime is goja (not Node or ES modules), so our sim wouldn't run unchanged, and it's heavier to operate. The strongest alternative if we ever want social features we'd rather not build. |
| PlayFab | Capable, but console-and-enterprise oriented, with more lock-in |
| Custom Node + Postgres | Maximum control and maximum ops burden |

### 8.8 Realtime multiplayer

| Option | Verdict |
|---|---|
| **Colyseus on Node (chosen, M10+)** | Authoritative rooms with state sync and reconnection, in JS/TS. `/sim` runs inside a room unchanged. Hosted on Railway or Fly.io. It was already the planned stack. |
| Nakama authoritative matches | See §8.7: the goja runtime can't run our sim unchanged |
| Raw `ws` / uWebSockets.js | Minimal and fast, but we'd rebuild rooms, matchmaking and reconnection |
| WebRTC (geckos.io) | Lower latency for action games. An autobattler at 20 Hz doesn't need it, and NAT traversal adds ops. |
| Photon | Excellent but C#-centric. Wrong language. |

**Model:**
- **Server-authoritative** for co-op, raids and live PvP.
- **Async snapshots** (Supabase rows) for hire-a-friend and the async arena.
- **Replay validation** for single-player leaderboards.

### 8.9 Shell, distribution, audio, quality

| Area | Choice | Alternatives weighed |
|---|---|---|
| Web | **PWA**: web app manifest plus a Workbox service worker (via `vite-plugin-pwa` at M6), on Netlify static hosting (today) | — |
| Native | **Capacitor** (iOS / Android WebView shells; plugins for Apple sign-in, haptics, status bar, app lifecycle) | Cordova (legacy), Tauri Mobile (young), React Native (a different UI stack) |
| Audio | **Howler.js** (mobile unlock, audio sprites, HTML5 fallback) | Raw WebAudio (reinvents unlock and pooling) |
| Sim / unit tests | **`node:test` + `node:assert`**, keeping `smoke-test.mjs` and the balance harness | Vitest or Jest: nicer output, but a dependency and config for little gain in a zero-build repo |
| Browser / e2e / visual | **Playwright** (already used): manual-clock captures, flow tests, screenshot diffs | Cypress (heavier, weaker WebGL) |
| Types | **TypeScript `tsc --noEmit --checkJs`** | — |
| Lint | **ESLint 9 flat config**: correctness rules only, no formatter | Prettier would reflow the dense house style and churn every diff. Biome is fine but less mature for our rules. |
| CI | **GitHub Actions**: typecheck, lint, node tests, content validation, Playwright smoke. Netlify deploy previews per branch. | — |
| Errors / telemetry | **Sentry** browser SDK at M6. Privacy-first product analytics (e.g. self-hosted PostHog) only if needed. | — |
| Art tools | **three.js 0.169 + playwright-core** (actor, icon and environment bakes), **Pillow** for contact sheets | — |

---

## 9. Performance budgets (phone)

| Budget | Target |
|---|---|
| Frame rate | 60 fps target, with a 30 fps battery saver |
| Frame time | Sim tick < 2 ms. CPU G-buffer stamping < 6 ms (see [emberlit-tdd.md](./emberlit-tdd.md) for render budgets). |
| Hot loops | No allocation in per-frame loops. Reuse typed arrays and `texSubImage2D`. |
| First load | < 2.5 MB before the title screen (atlases lazy-load per region). Ink JSON per region is loaded on entry. |
| Save size | Save slot < 64 KB |

---

## 10. Security and fair play

**The client is never trusted.** Memory, saves and the clock are all in the player's hands.
Progress is therefore **verified by re-simulation**: the server replays each session's
commands in the same deterministic sim and stores only that result (development plan
§2.13).

| Threat | Defence |
|---|---|
| Edited level, XP, gold or items (memory or devtools) | The replay's end-state hash doesn't match the claim → rejected; the hero rolls back to its last verified state |
| Edited or copied save | A session must start from the hero's **verified** state hash |
| Sped-up client ("rapid levels") | Claimed ticks × 50 ms must fit the wall-clock time since the server issued the session token (5 % slack) |
| Forged or out-of-range commands | The sim validates every command. It clamps move vectors, checks reach, class, bag room and 2H rules, and single-use chests. Invalid commands do nothing. |
| Loot re-rolling by reloading | Drops use the world seed plus a saved drop counter, so reloading gives the same result |
| Dev hooks as a cheat console | `?dev` hooks exist only on localhost |
| Multiplayer cheating | The server is authoritative; clients send only commands; per-tick command rate limits |
| Stolen keys | The client ships only the Supabase URL and anon key; RLS on every row; the service-role key only in the validator or server |
| Content injection | Content comes from our own origin; there's no user-generated content in v1; dialogue renders as text, never HTML |

**Trust tiers:**
- **Guest / offline:** unverified, and single-player only. You can only cheat yourself.
- **Verified heroes** are required for leaderboards, hire-a-friend, co-op, raids and PvP.

**Status:**
- **Shipped:** `sim/replay.js` and `sim/detmath.js`, with smoke tests for replay and every
  tamper case.
- **M6:** the upload, validator and rollback pipeline.

## 11. Decision log

| # | Date | Decision |
|---|---|---|
| A1 | 2026-09-28 | JS ES modules + JSDoc + `tsc --checkJs`; Vite only as the M6 packager |
| A2 | 2026-09-28 | Keep Emberlit (custom WebGL2); three.js stays tools-only |
| A3 | 2026-09-28 | Preact 10.29.8 + htm 3.1.1, vendored and import-mapped; first window: Game slots (M2.5); signals when needed |
| A4 | 2026-09-28 | Ink + inkjs for all dialogue; no runtime text generation |
| A5 | 2026-09-28 | JSON content + JSON Schema (Ajv in CI) |
| A6 | 2026-09-28 | Three game slots in IndexedDB (in-house `persist/idb.js`), with a localStorage backup on page hide; save v4 |
| A7 | 2026-09-28 | Supabase for accounts, cloud saves and leaderboards; guest-first |
| A8 | 2026-09-28 | Colyseus for realtime rooms (server-authoritative); async snapshots in Supabase |
| A9 | 2026-09-28 | Capacitor for native; PWA on the web |
| A10 | 2026-09-28 | `node:test` + Playwright; ESLint without Prettier |
| A11 | 2026-09-28 | Verified progression: the server replays session command logs (`sim/replay.js`) and stores only the replayed state; `detmath.js` for cross-engine determinism; dev hooks localhost-only; server saves keyed per game slot |
| A12 | 2026-09-29 | The intro's score is live WebAudio synthesis (`cutscene/score.js`): no audio files, and Howler isn't needed for it. The intro and title use IM Fell English (Igino Marini, OFL 1.1), vendored as woff2 in `assets/fonts/` rather than loaded from a CDN |

| A13 | 2026-09-29 | inkjs 2.4.0: the runtime (`ink.mjs`) vendored and import-mapped as `inkjs`; the compiler only in `tools/content/ink.mjs` (devDependency, same version), and the compiled `content/dialogue/*.json` committed and checked stale-free in CI. Durable conversation state is **sim flags** (`state.flags`, set only by validated `dialogueEffect` commands, save v6), not the Ink story state: Ink state is per session (its cycles move on between visits) and never saved |

Changing any of these needs a new row here, plus a note in the development plan.

**Proposed, not decided:** A15 — `src/audio/` on raw WebAudio, sharing the intro score's context: synthesised effects plus one CC0 sample sprite, instead of Howler (§8.9). See [sound-plan.md](./sound-plan.md) §3.

**Proposed, not decided:** A14 — three.js (lazy-loaded) for the windows only, to assemble
characters live from appearance and gear, while Emberlit keeps the world. This would reverse
A2 for windows. See
[character-customization-proposal.md](./character-customization-proposal.md); parked
2026-09-29.
