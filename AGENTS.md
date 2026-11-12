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
| 4 | [`docs/luminati-port-plan.md`](docs/luminati-port-plan.md), [`docs/luminati-only-cleanup.md`](docs/luminati-only-cleanup.md) | The renderer: Luminati draws the world (A21); [`docs/emberlit-tdd.md`](docs/emberlit-tdd.md) for the overlay, taps and the effects' light it still runs on |
| 4 | [`tools/actor-lab/README.md`](tools/actor-lab/README.md) | Bakes |

## Commands

```bash
npm ci                                    # once: dev tooling only (the game itself has no build)
npm run serve                             # open http://localhost:8080 (ES modules need a server)
#   ?slot=1|2|3 (game slot)  ?scene=town|overland|dungeon (preview: starts fresh, never saves)
#   ?world=off|on (localhost only, kept for the tab: no world drawn, an empty painter in Luminati's place; the browser suite's flow checks run so, its world checks ask for &world=on: docs/luminati-only-cleanup.md step 4)
#   ?landmarks=doors|all|sprites (which of the Vale's kit pieces, tools/actor-lab/buildkit.js, stand in 3D; default: the owner's choice, every one but Thornwick's palisade seen from inside the town, docs/vale-landmarks-proposal.md §8; doors the three dungeon doors alone; all every piece; sprites all as baked cards, as before)
#   ?stairs=plain (a dungeon floor's stairs as they were before their arches; the default since GDD v1.57: the way up three tiles wide, an arch over each way, its inner edge glowing: docs/dungeon-stairs-proposal.md)
#   ?figures=sprites (the people as their atlas sprites, as before they were models: docs/dungeon-kit-proposal.md §9.6)
#   ?notitle (skip the splash, loading screen and title and play at once; tests and captures)
#   ?region=vale|fens|reach|heights  ?site=barrows|wickham_keep|sunken_chapel|proving_pens|ninth_milestone|toadking_mound|canal_locks|drowned_abbey|… (with ?scene=dungeon; sim/sites.js)
#   ?dev (localhost only: globalThis.__sim)
#   ?dev&slow=8 (slow motion) · ?dev&manual (you drive frames: globalThis.__frame(ms)) · ?dev&tod=dawn|day|dusk|night|0..1 (hold the light)
#   ?dev&scene=stage&show=icons|faces[&match=…]: the art review, every item icon and every portrait and window figure as the UI shows them (docs/art-review.md)
#   ?dev&scene=stage&show=cast[&cast=party,town,foes,bosses,vermin,all|<actor>,…&clip=idle|walk|attack|…&t=s|at=0..1&dir=0..7&per=12&page=N&site=…&floor=N&room=big|entrance|<part>]: the Stage on Luminati, the cast lined up in a real dungeon room, each at a clip, the sim held still (src/dev/stage.js, docs/art-review.md)
#   ?dev&scene=stage&show=fx[&skill=id,…|cls=mage&lv=15&with=fighter,cleric&site=…&floor=N&room=…]: the Stage's live effects, a real fight with only those skills in play, the party kept standing, MP full (no skill: a plain fight)
#     …&foes=firebeetle,golem (a room of those kinds alone) · &boss=rat_king (that boss in the floor's hall) · &quiet=1 (the party's skills off: the default with foes/boss)
npm run check                             # everything CI runs except browsers:
#   typecheck (tsc, JSDoc; files opt in with // @ts-check) · lint (incl. sim determinism rules)
#   content (JSON Schema + Ink compile) · test (node:test) · smoke (SMOKE_OK + RENDER_SMOKE_OK)
npm run test:browser                      # replay parity Chromium/WebKit vs Node, game slots, M3 create→Fallen→temple→wipe, intro, fights, talk to Maudry, her errand in the Journal, the sky dial overlaps nothing, the World map and the Guild's coach, the square's menu the same in every town, nobody in Saltmere's square behind a building, the art review's icons and faces list everything, the first-open cards (once each), Luminati lined up with the HUD, and its message and Retry when it can't start (WebKit: CI)
node tools/balance/roomlv.mjs 300 6 6 0,2 [seed] [--src dir] [--site id] [--no-trials] [--hero cls] [--rogue base] [--perks keep|a,b/c,d] [--fresh] [--up N] [--size small|medium|large] [--floor N] [--part id] [--off id,id] [--born m,g,f,fo] [--trait id,id] [--look actor]   # balance: secs roomLv heroLv hires (1,3 = fighter rogue cleric); --src = a before checkout; --off: those abilities' auto-use off for everyone; SKILLS=1: each ability's casts and reach; --fresh = hires at their hire level (half the hero's), not levelled up; --rogue huntbow = the rogue's weapon; --perks: the hires' sellsword perks (default none, as the contract measures); --up N = every kit piece at the smith's +N; --size: fight in a room of that size (default large, the contract's arena); --floor N: on that floor (the Old Barrows' default 2, the Ashbound's, as the contract); --part id: in that authored room (plans.js: old_cellars, the_cutting), its own family; --born / --trait: the hero born with that roll (GDD §6.1 v1.64: six attribute points, perks), the class table without; --look hero_barbarian: the hero in that look and its own kit (GDD v1.65); DMG=1: damage by member
node tools/balance/boss.mjs wickham_keep 6 [seeds] [--src dir] [--healer shaman] [--floor N] [--off id,id] [--boss id]   # a boss hall vs fighter + rogue + cleric (or shaman) at a level (TRACE=1: a timeline); --floor: the hall on floor N (the Drowned Abbey has three); --boss: that boss in the hall in place of its own (one not yet placed); 'held N %': the share of the boss's fight he stood held (stun, freeze, knockdown)
node tools/balance/loot.mjs 6 1 [seed] [--src dir]            # the headless farm: drops an hour of play at a level, in the dungeon whose band holds it (dev plan §2.7 targets)
node tools/balance/tower.mjs 12 900 1,3 [--src dir]           # the Mere Tower headless: a party at a level climbs on at every landing; best wave, landings, what it banked
node tools/balance/camps.mjs [--camp id,id] [--n 8] [--dl -1,0,1] [--src dir]   # the spawn points' fights (GDD §10.3, sim/camps.js): each fought N times by a lone fighter and the right party at its level (± dl), from the edge of its reach; won, how long, the lowest health went
node tools/capture/stage.mjs [--show icons|faces] [--match m] [--size 1280x900]   # the art review's sheets (docs/art-review.md): the whole grid in one tall still → tools/capture/out/<show>/sheet.png
node tools/capture/stage.mjs --show cast [--cast vermin,party|…] [--clips idle,walk,attack,…] [--at 0.5 | --frames N] [--per 8] [--dir 2] [--site s --floor N --room r] [--dpr 2]   # the Stage's cast sheet on Luminati: each clip held at a moment (or one clip through N moments), every page → tools/capture/out/cast/sheet.jpg (a row a clip)
node tools/capture/stage.mjs --show fx [--skills all|id,…] [--cls mage] [--lv 15] [--with fighter,cleric] [--floor N] [--wait 40]   # the Stage's live effects: each skill from its first cast, +0…1.2 s, a strip a skill → tools/capture/out/fx/sheet.jpg (a row a skill)
node tools/capture/stage.mjs --show fx --foes firebeetle,gob,wraith,golem | --bosses rat_king,spider_queen [--wait 40]   # a creature's heavy blow or shot (else a blow), a boss's mechanic, in a real fight against a quiet party, a row each
node tools/content/ink.mjs                # compile content/dialogue/*.ink → .json (commit both; --check = CI)
FFMPEG=… FLARE=… node tools/audio/prep.mjs [--only cue,cue]   # sound: tools/audio/sounds.json → assets/audio/*.mp3 + bank.json (ffmpeg with libmp3lame, e.g. pip imageio-ffmpeg; FLARE = a flare-game checkout); --only: just those cues into the bank as it stands (a synth cue, tools/audio/synth.mjs, needs no FLARE)
cd tools/actor-lab && npm i && sh fetch-assets.sh    # once, for bakes
node tools/actor-lab/bake.cjs [actor…]    # actor atlases (+ weapon anchors, + <actor>.face.png portraits and .fig.png character-window figures); --anchors (+ walk stride) / --portraits refresh only those
BAKE_OUT=dir BAKE_PROTO=features|eyes1|eyes2,grade[,stats]|off BAKE_HEAD=0.74 BAKE_PX=72 node tools/actor-lab/bake.cjs [actor…]   # face knobs and prototype bakes into a scratch tree (docs/face-fidelity-proposal.md, art-critic-pass-7.md); the shipped faces are eyes2,grade
node tools/actor-lab/models.mjs           # the people as models for the Luminati renderer (docs/dungeon-kit-proposal.md §9.6): the KayKit models in tools/actor-lab/models/ pruned to the clips bake.json plays, the skeletons' weapons, cast.json (every actor's variant, height and clips; the faces) → assets/models/ (committed; never edit, rerun with the bake; test/models.test.mjs checks it's current)
node tools/actor-lab/creatures-sheet.cjs [out.jpg] [--only rat,beetle,golem,…] [--clips Attack,Heavy [--frames N]]   # the creatures built in code (tools/actor-lab/creatures.js: the vermin and the bestiary, the Rat King and the Spider Queen; docs/creatures-proposal.md), each at its height in the game beside the knight and through its clips from the game's camera, with its triangles, draws and bones (--clips: through those clips, N moments each) → tools/actor-lab/out/creatures.jpg
node tools/actor-lab/faces.cjs            # the face board: every faces.json preset and every face part → tools/actor-lab/out/faces_board.png
node tools/actor-lab/faces-spike.cjs [--heads | --looks]   # (--heads: the head shapes, bald front / three-quarter / turned and with hair at play's size → tools/actor-lab/out/faces_heads.png; --looks: twenty looks, men and women, bare three-quarter and side on and in a game helm → out/faces_looks.png) the painted head's board (docs/painted-faces-spike.md): looks as today's 3D parts and painted, the expressions, marks, and both at play's size → tools/actor-lab/out/faces_spike.png; in the game: ?faces=painted
node tools/actor-lab/icons.cjs [ids]      # item icons
node tools/actor-lab/bake-env.cjs [--keep-missing]   # buildings / trees / rocks (the undergrowth needs the nature pack's glTF in tools/actor-lab/models/nature/: actor-lab README); --keep-missing: without it, bake the rest and carry the undergrowth over as baked
node tools/render3d/build.mjs            # Luminati as the game's world renderer (docs/luminati-port-plan.md §13): tools/render3d/world.js + Luminati's engine and world layers + three.js → src/vendor/luminati-80e1aa6/ (ES modules, committed; never edit, rebuild), imported by src/render3d/hybrid.js
node tools/worldmap/draw.mjs              # the Old Provinces' wall map (docs/world-map-proposal.md; its places: src/ui/wallmap.js) → docs/img/world/old-provinces.jpg + .svg, and the game's copy in assets/maps/ (with its coast, old-provinces.json, for the World map's fog)
node tools/worldmap/towns.mjs             # the region towns at one scale (docs/region-towns-proposal.md) → docs/img/towns/town-plans.jpg
node tools/worldmap/streets.mjs [--waystations]   # the region towns' and waystations' street plans, top-down at one scale (docs/town-streets-proposal.md) → docs/img/towns/streets-<town>.jpg
node tools/worldmap/overlands.mjs         # each region's overland at the game's scale (docs/town-streets-proposal.md) → docs/img/world/overland-<region>.jpg
node tools/worldmap/minimap.mjs           # the shipped scenes drawn from the sim itself: Thornwick's map + bare minimap backgrounds (4 px a tile, .json with the origin and an overland's pins) → docs/img/towns/map-thornwick.jpg, minimap-<scene>.png, and each overland illustrated in the wall map's hand (land-<region>.jpg); those and the .json copied to assets/maps/ (the World map's land tab)
node tools/dungeon/plans.mjs [seeds] [--src dir]   # the dungeon layouts top-down at one scale, the caverns beside the halls, rooms marked by size (docs/dungeon-halls-proposal.md) → docs/img/dungeon/plans.png, and the numbers
node tools/dungeon/asbuilt.mjs [site…] [--seed N] [--out dir]   # the Vale's authored floors as the sim builds them, top-down: every prop by kind, each room's open floor and largest open square (docs/vale-dungeon-dressing.md) → tools/capture/out/asbuilt-<site>.png
node tools/dungeon/vale-plans.mjs [site…]   # the Hollow Vale's authored dungeon plans (src/sim/plans.js, docs/vale-dungeons-plan.md), each floor top-down at one scale with its levels, bosses and dressing, held to the plan's rules (checkPlan) → docs/img/dungeon/vale-<site>.png + .svg
node tools/capture/rig.mjs [vale|vale-hours|vale-dungeons|vale-rooms|smoke|shots.json] [--sheet] [--out dir] [--dpr 1|2] [--query a=b&c=d] [--base url] [--settle 40]   # many shots fast: a page kept open, worlds reached by restore (vale-rooms: every authored space, a shot's at "part:<id>"; a dungeon shot's at "stairsup" | "stairsdown": a floor's ways), hours by the dev hook __tod, frames driven in the page (Luminati stepped, not drawn, while it settles), the canvases copied in the frame's task; serves the repo itself; out tools/capture/out/rig/luminati/<name>.png (+ sheet.jpg)
node tools/capture/skills.mjs [--out dir] [--base url] [--secs 150] [--party 1|2|3] [--land]   # (--land: each skill's first landing, cropped round where it lands, +0…1.0 s) burst frames of every class skill in a real fight (docs/combat-fx.md): three parties of 15 with every skill, a level-15 room; each skill's first cast at +0…1.6 s, a strip a skill and sheet.jpg (deterministic: a before and an after line up)
node tools/capture/bosses.mjs [--out dir] [--base url] [--secs 90] [--only id,id] [--warn]   # burst frames of every boss's mechanic in a real fight in his own hall (docs/combat-fx.md, the boss pass): the contract's party at the hall's level; the first time it fires (or 4 s in, for one that holds) at +0…1.4 s, a strip a boss and sheet.jpg (deterministic: a before and an after line up) · --warn: the foes' warnings instead (a heavy blow's ring, a shot's lane: the first heavy blow, shot and heavy shot in three halls, +0…0.54 s; out tools/capture/out/warn/)
node tools/capture/feel.mjs [--site wickham_keep] [--depth 0] [--base url] [--out dir] [--feel full|light|off]   # the feel of a hit (docs/combat-fx.md): a motion trace on the manual clock through a boss's first heavy blow (sim time, the camera, holds, foes glowing) and burst frames; --base: a before
node tools/capture/visibility.mjs [vale-town fens-town vale fens reach heights barrows-f1 … | all] [--seen 0.5] [--warn] [--json out.json] [--shots dir]   # the visibility rule (docs/level-design-rules.md §1.1): the hero walked to each subject (a town's people and service doors, an overland's ways in and arrivals, a floor's rooms and stairs), how much of a person there the world hides from the camera, and what; exit 1 if any is under half in view (--warn: report only; --shots: a picture of each one under)
node tools/capture/figperf.mjs [--base url] [--secs 8] [--query a=b] [--json out.json]   # what the figures cost in play (docs/character-look-plan.md §11): draws and triangles a frame counted at the WebGL context (every pass), frame times (median, 95th), the models and their meshes, the JS heap, in the town square and a Barrows fight; --query figures=sprites for the figures' share; a before and an after on one machine
node tools/capture/gear.mjs [--cls fighter,cleric|all] [--slot helm,weapon,…] [--only base,…] [--rarity r] [--back] [--big] [--per 12]   # the gear sheet (docs/character-look-plan.md §6–8): every piece worn on its class's figure in the game's own preview, the rest of the kit as it sets out; --back for what hangs behind → tools/capture/out/gear/sheet-<n>.png (rebuild the bundle first)
node tools/dungeon/dress-audit.mjs [site…] [--seed N] [--over]   # every authored room's dressing counted by kind against its size's caps (src/sim/dresscaps.js, docs/level-design-rules.md §4.3); --over: only the rooms over a cap
node tools/dungeon/dress-audit.mjs --clear [site…] [--seeds N] [--list]   # every site's floors (authored or generated) over N seeds against §4.4 (src/sim/keepclear.js): what stands on the stairs or their approach, in a doorway, or a light out in the open; the count by rule (--list: each floor's)
[FLOOR=N] [PLACES=entrance,room,…] [TOD=dusk] node tools/dungeon/capture.mjs [site] [out] [tag] [base]   # a site's floor in the game (needs npm run serve; base: another checkout served elsewhere, for a before): entrance, hall, room, descent, a small and a medium room
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
   - **Dev hooks** (`?dev`, globals, cheats for testing) stay localhost-only. The one exception
     is the menu's **Developer** panel (the owner, 2026-11-08: on the site too, for phone
     testing): its tools are sim commands (`sim/dev.js`: every skill unlocked, a level with its
     points) that mark the slot a **dev game** (`state.dev`, save v34), and `replay.js`
     `verifySession` refuses a dev game. Any new progress-granting tool goes there, never
     around it.
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
6. **Balance is a contract.** The smoke test gates the design targets (GDD §7.1), for a visit
   you never walk out of:
   - a lone level-1 hero beats level-1 foes (3+ waves) but can't farm them (down by wave 12);
   - from level 4 a same-level room wants company (a lone level-6 hero is down within 2 waves);
   - the right party (fighter, rogue, cleric) in gear at level holds a same-level room 10+
     waves at levels 3, 6, 9, 12 and 15, with nobody Fallen in the first five;
   - a party with no healer is worn down at level 6;
   - a room three levels up defeats even the right party (and at 12 and 15 a lone hero is down within 2 waves);
   - companions add strength: the same wave as a lone hero, and 80 %+ of its XP a minute;
   - gear matters: gear at level holds a room two up longer than a level-1 kit.

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

### Rendering: Luminati's world, our eye (A17, A21)

- **Who draws what:** Luminati draws the world and the people (`src/render3d/hybrid.js` hands it each frame;
  `tools/render3d/world.js` is built into `src/vendor/luminati-80e1aa6/`: rebuild, never edit). `src/render/renderer.js`
  is the game's eye: the camera, the figures' clips (`anim.js`), the overlay (minimaps, names, bars, numbers, the
  stick), every tap, and the fights' light. Emberlit's own painting is gone (docs/luminati-only-cleanup.md).
- **Presentation-only state:** the renderer reads sim state and interpolates (`p.px → p.x`
  by alpha). Presentation-only state (animation phase, effects, particles) lives in the
  renderer or animator, keyed by unit (`WeakMap`), never on sim objects.
- **Hot loops:** no allocation per frame in the effects' and the painter's per-frame loops; reuse typed arrays and
  pooled sprites.
- **The camera** is sub-pixel: ints for the window, `lastCam.rx/ry` for overlays and hit-tests; Luminati's camera is
  set from it, so its ground lands where the overlay and taps expect (the browser suite checks ≤ 2 px).
- **Effects:** a skill's light draws into the emissive plane through `fx.js` primitives (EMI alpha < 255 a steady
  glow, 255 flickering), which the painter lays over its world; or, for the skills in `skillfx.js` `LUM_LOOKS`, in
  Luminati's own looks (`world.js` placeSpells). New effects reuse one or the other rather than adding passes.
- **A world that can't be drawn** says so (`ui/worldfail.js`: a message and Retry), never a black screen or a hidden
  fallback. Test on a real phone before calling a renderer change done.

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

- **Never hand-edit baked outputs** (`assets/actors`, `assets/items`, `assets/env`, `assets/models`). Change
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
