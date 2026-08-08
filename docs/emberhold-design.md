# EMBERHOLD (working title)
### A mobile-first, portrait-mode sandbox survival RPG inspired by Necesse
**Game Design + Architecture + Implementation Plan — v0.1**

> Scope note: this is an original game that borrows Necesse's *genre systems and loop structure* (top-down survival sandbox + boss-gated progression + colony sim). All names, art, characters, world lore, and content are original. Game mechanics are fair game; assets and IP are not — so nothing here copies Necesse's art, names, or specific content.

> **v0.3 amendment (Aug 2026) — isometric presentation.** The renderer has pivoted from flat top-down to a **2:1 dimetric isometric** language at fine **16×8** tiles: an elevation field (basins / ground / plateaus), auto-generated cliff faces, and per-tile **quantized** torch lighting. This changes *presentation only* — the headless sim, saves, and determinism are unchanged. Characters keep the same paper-doll **recipe system** but render at a larger, more detailed sprite (24×36), decoupled from tile resolution so they keep presence at the fine tile scale. Where this doc describes flat top-down terrain — **§5 Portrait-First UX** screen zones and **§6.2 Terrain** (blob-47 autotiling) — read them through the iso lens: blob-47 is parked in favor of diamond floor/face generators, and the world view is isometric. The authoritative art + render spec is **emberhold-iso-pivot-tdp.md**; the current plan of record is **emberhold-status-v0.3.md**.

---

## 1. Vision & Design Pillars

**One-liner:** Terraria-style boss-gated progression meets a colony that works while you're away — rebuilt from the ground up for one thumb and a vertical screen.

**Pillars (in priority order):**

1. **One-handed portrait play.** Every core action — move, fight, mine, craft, build — must be doable with the right thumb only. Two-handed is an enhancement, never a requirement.
2. **The world works while you don't.** Settlement production, settler expeditions, and crafting queues progress in real time (offline). Mobile sessions are 3–15 minutes; the meta-game respects that.
3. **Boss-gated depth.** Clear tiered progression (surface → deep → endgame) where each boss unlocks a crafting tier, new biome access, and new settler capabilities.
4. **Everything procedural, everything data-driven.** World, dungeons, loot, and *all art* are generated from code + data (palettes, part libraries, recipes). No hand-drawn asset dependency.
5. **Readable pixel art at arm's length.** Chunky sprites, high-contrast palettes, strong silhouettes — designed for a 6" screen, not a 27" monitor.

**Anti-goals (v1):** real-time multiplayer, landscape mode, PC-parity content volume, wiring/logic systems, PvP.

---

## 2. Reference Feature Capture (what makes the genre work)

Systems the reference game nails, and whether we keep, adapt, or cut them for mobile v1:

| System | Reference behavior | Emberhold v1 |
|---|---|---|
| Seamless procedural world | Infinite connected overworld, biomes, cave systems, dungeons | **Adapt**: chunked infinite overworld; caves as generated sub-maps (portal transition) — cheaper on mobile than seamless Z-levels |
| Mining/gathering | Trees, ores, herbs, monster drops; "smart mining" QoL | **Keep**, with tap-to-harvest and auto-pathing |
| Crafting tiers | Hundreds of items; stations (workbench, anvil, furnace, alchemy); vicinity crafting | **Keep**: ~150 items v1; vicinity crafting from day one |
| Boss-gated progression | ~3 tiers of bosses (surface caves, deep caves, endgame incursions); summon items; each boss unlocks a gear tier | **Keep**: 3 tiers, 3+3+2 bosses in v1 |
| Settlement/colony | Flag claims territory; recruit settlers with jobs (farmer, fisher, miner, blacksmith, elder); happiness; equipment for settlers | **Keep** — this is the mobile retention engine |
| Settler expeditions | Send miner/explorer/fisher on timed away-missions | **Keep & elevate**: expeditions become the core *offline* loop |
| Elder quest line | Elder NPC issues quests in boss order; guides progression | **Keep**: quest chain = tutorialization + progression spine |
| Raids/invasions | Enemies attack settlement; defenses matter | **Adapt**: scheduled/telegraphed raids (never punish offline players without warning); optional toggle |
| Farming/fishing/cooking | Food & potion buffs are major power levers | **Keep**, simplified: plots, growth timers, buff foods |
| World rules customization | Difficulty, raid toggle, day length sliders | **Keep** (cheap, high goodwill) |
| Circuits/traps | Logic networks, defenses | **Cut v1** → v2 |
| Cosmetics/pets/mounts | Cosmetic layer, mounts for speed | **Partial**: pets + outfit dyes v1 (procedural palette swaps are nearly free); mounts v2 |
| Multiplayer/co-op | Solo, co-op, dedicated servers | **Cut v1**; architecture must not preclude it (see §8) |

---

## 3. Core Game Loops

### 3.1 Moment loop (5–30 seconds)
Move → spot resource/enemy → tap → auto-path + auto-swing → collect drops (auto-pickup) → inventory fills → craft or bank.

Combat moment loop: enemy aggro → auto-attack nearest in range → player choices are *positioning* (drag to move/dodge) and *ability taps* (2–3 cooldown buttons). This is deliberately closer to an action-autobattler than a twin-stick shooter: skill lives in movement, target priority, and cooldown timing, not aim.

### 3.2 Session loop (3–15 minutes)
1. **Collect** — resolve what happened while away: expedition returns, crop harvests, crafting queue output, settler-gathered stockpiles.
2. **Decide** — spend the haul: craft next gear piece, start new station, queue potions/food.
3. **Venture** — one "sortie": a cave floor, a dungeon room-set, a biome expedition, or a boss attempt. Sorties are designed as 5–10 minute chunks with mid-points that safely suspend (auto-save on backgrounding, resume exactly in place).
4. **Assign** — before leaving: set settler jobs, launch expeditions, queue production. This is what makes the *next* session's "Collect" satisfying.

### 3.3 Meta loop (days → weeks)
Gear tier N → beat tier-N boss → unlock tier N+1 materials, biomes, stations, settler jobs → build up → next boss. In parallel: settlement grows from camp → hamlet → fortified town; settler roster expands; raid difficulty scales; elder quest chain marks the spine.

### 3.4 The mobile twist: expedition-driven offline progression
The single biggest adaptation. In the reference game, settlers reduce tedium; here, they *are* the idle layer:
- **Expeditions** (miner, forager, fisher, explorer): pick destination + duration (15m / 1h / 4h / 8h) → returns yield tables scaled by settler gear, skill, and destination tier. Explorer expeditions can discover new map POIs (dungeons, ruins) — content discovery while offline.
- **Production queues** (blacksmith, alchemist, cook): queue up to N crafts; consume stockpile; finish in real time.
- **Risk knob:** longer/deeper expeditions can fail or injure settlers (recover over time) — creates gear-your-settlers demand, which soaks up obsolete player gear (natural item sink).
- **No timers-for-money.** This is a premium-friendly idle layer, not a monetization lever (see §10).

---

## 4. Systems Specification

### 4.1 World generation
- **Overworld:** infinite 2D tile plane, chunked (32×32 tiles). Layered noise → continents/coastlines → temperature/moisture fields → biomes: Meadow, Forest, Swamp, Snow, Desert, Volcanic Coast (v1 six biomes). Rivers via downhill tracing; roads/ruins as post-pass POI scatter.
- **Distance = difficulty:** danger scales with distance from world origin, with biome-based tier gating (Snow/Desert are tier-2 material sources, Volcanic tier-3).
- **Caves:** entrances scattered per-biome. Each cave = generated sub-map (cellular automata caverns + room grammar for dungeon wings), 1–3 floors. Three cave classes: **Surface caves** (tier 1), **Deep caves** (tier 2, unlocked by key item from tier-1 boss), **Rift sites** (endgame, unlocked late).
- **Dungeons:** grammar-based room-and-corridor sets with locked doors, minibosses, secret rooms, and guaranteed loot rooms — handcrafted room *templates*, procedural *arrangement*.
- All generation is **seeded and deterministic** (see §7): chunk (cx, cy) + world seed → identical output forever; only player modifications are saved as diffs.

### 4.2 Character & combat
- **Stats:** HP, armor, damage class bonuses (melee/ranged/magic/summon — 4 build archetypes, matching genre convention), move speed, crit.
- **Gear slots:** weapon, helmet, chest, boots, 2 trinkets. Set bonuses per armor family.
- **Control model (portrait, one thumb):**
  - Drag anywhere = virtual floating joystick (move).
  - Tap entity = smart context action (attack / harvest / talk / open).
  - Auto-attack nearest hostile in range when weapon drawn.
  - 2–3 ability buttons (dodge-dash + weapon skill + consumable) in the bottom-right thumb arc.
- **Enemies:** ~24 archetypes v1 across biomes/caves; behaviors data-driven (chaser, ranged kiter, spawner, tank, swarm, elite modifiers). Elite affix system (fast, shielded, venomous…) multiplies variety cheaply.
- **Bosses (v1 roster — 8):**
  - *Tier 1 (surface caves):* 3 bosses — arena fights with 2-phase patterns; summon items crafted from surface materials.
  - *Tier 2 (deep caves):* 3 bosses — mechanics-forward (adds, arena hazards, enrage).
  - *Tier 3 (endgame rifts):* 2 bosses incl. final boss; unlocked by completing the elder chain.
  - Boss fights are the "appointment content" — designed for 3–6 minute fights, phone held with both hands allowed/expected here.

### 4.3 Crafting & economy
- Stations: Campfire → Workbench → Furnace → Anvil → Alchemy Table → Loom → tier-2/3 upgrades of each. **Vicinity crafting** (all nearby station inventories available) from day one.
- ~150 items v1: tools ×4 tiers, weapons (4 classes × 4 tiers + boss uniques), armor (4 families × 3 tiers), potions/food (~25), furniture/building (~40), materials (~35).
- **Sinks:** settler equipment, raid defense structures, recycling old gear into materials.
- **Trader NPC** visits settlement on a cadence; coin economy is deliberately thin in v1 (barter/materials-first).

### 4.4 Settlement
- **Claim:** place Hearthstone (settlement flag) → claims radius; upgradable.
- **Settlers:** found in world (rescues, wanderers, quest rewards). v1 jobs: **Elder** (quests), **Farmer**, **Fisher**, **Miner**, **Forager**, **Blacksmith**, **Alchemist**, **Cook**, **Guard**, **Explorer**, **Trader** (visiting).
- **Needs:** bed + assigned room, food quality, safety, decoration score → **happiness** → work speed & expedition yield multipliers.
- **Zoning (mobile-friendly build mode):** drag-rectangle rooms; auto-wall/auto-door assist; stamp-based furniture placement on a grid with generous snapping. Build mode is a distinct full-screen mode with its own bottom toolbar — never overloaded onto the adventure HUD.
- **Raids:** telegraphed 12–24h in advance ("Raiders sighted — arriving tonight"), resolve only while player is online *or* auto-resolve via defense score if the player misses it (never destroy — steal stockpile percentage, capped). Toggleable off.

### 4.5 Quest spine
Elder issues chapter quests in boss order: settle → first cave → first boss → recruit X → deep key → … → final rift. Each grants a unique reward item. Side content: rescue quests (new settlers), settler personal requests (small buffs + happiness), discovery journal (codex completion).

### 4.6 Difficulty & world rules
New-world options: combat difficulty, raid frequency (incl. off), day length, expedition speed, permadeath toggle. Per-world, set at creation, some adjustable later.

---

## 5. Portrait-First UX

**Screen zones (portrait):**
```
┌──────────────────────┐
│  status strip (HP,   │  top 10%: glanceable, never interactive-critical
│  buffs, clock, ping) │
│                      │
│                      │
│     WORLD VIEW       │  middle ~62%: camera slightly biased upward so
│   (player at ~58%    │  the action ahead of upward movement is visible
│    screen height)    │
│                      │
├──────────────────────┤
│ hotbar (4 slots) ✚   │  bottom 28%: thumb arc. Left: hotbar/backpack
│ [joystick zone] [🗡][💨]│  button. Right: abilities. Center-drag: move.
└──────────────────────┘
```
- **All menus are bottom sheets** (inventory, crafting, settler panel, map) — half-height by default, drag to full. World stays visible above; game pauses (single-player luxury — use it).
- **Inventory:** 4-wide grid, big cells, tap = context menu (equip/use/drop), long-press = drag. Auto-sort, auto-stack, one-tap "deposit all to nearby" — QoL is a headline feature, not a patch.
- **Crafting UI:** vertical recipe list, filterable by station/category; shows "craftable now / missing X" with tap-to-queue.
- **Map:** full-screen sheet; fog-of-war chunk reveal; tap discovered POI → set auto-walk marker (player auto-paths on roads/open ground — crucial for reducing joystick fatigue).
- **Text size ≥ 14sp equivalent; touch targets ≥ 48dp.** Sprite scale: world tiles rendered at 3×–4× native pixels (16px art → 48–64px on screen).

---

## 6. Procedural Art Pipeline (Claude-generated assets)

Everything visual is authored as *generator code + data*, baked to sprite atlases. This is the same philosophy as the Torchfall paper-doll system, generalized.

### 6.1 Palette system
- Global palette tokens (`STONE_1..4`, `FOLIAGE_A..C`, `SKIN_1..6`, `METAL_T1..T4`…) defined once; every generator references tokens, never raw hex.
- Biome palettes = token remaps (Snow remaps FOLIAGE→ice-blues). Day/night & cave lighting via palette-aware tint ramps, not per-sprite variants.
- Gear tiers get signature metal ramps (copper→iron→mythic→rift) so progression is readable at a glance.

### 6.2 Terrain
- 16×16 tiles, **blob-47 autotiling** for every terrain pair (grass/dirt, dirt/water, cave floor/wall…). Generator emits the full 47-form sheet from a small rule set (base fill + edge treatment + corner treatment + noise dither between ramp shades).
- Decor scatter (grass tufts, pebbles, flowers) generated as small stamp libraries with per-biome palette remaps.

### 6.3 Characters — paper-doll recipe system (proven pattern)
- **Socket contract:** BODY defines anchor points (head, handL, handR, back, feet). Parts (hair ×N, head shapes, torso outfits, weapons) are generated separately and composed at bake time or runtime.
- **Recipe = data:** `{ body: 'human_a', skin: SKIN_3, hair: {style: 7, color: HAIR_B}, outfit: 'tunic', palette: {...} }` → deterministic sprite. Settlers, the player, and NPCs all come from one system → outfit dyes and cosmetics are nearly free.
- **Animation:** data-driven (`ANIM` objects: frame timings, per-part offsets/rotations per frame) — walk (4-dir), swing, cast, carry, sit, sleep. 4-direction sprites, N/S/E with E mirrored for W.
- **Enemies:** parametric generators per archetype family (blob, beast, humanoid, construct, flier) with size/palette/feature parameters → dozens of visually distinct enemies from ~5 generator families. Elite affixes add generated overlays (glow, spikes, shields).
- **Bosses:** hand-tuned generator instances (bespoke parameter sets + unique parts) — the 20% of art effort reserved for the fights that deserve it.

### 6.4 Bake pipeline
- `assetforge/` Node scripts run generators → write PNG atlases + JSON frame maps at build time. Runtime only loads atlases (fast startup, low memory). Dev mode can regenerate live for iteration.
- Deterministic: same generator version + params = identical atlas → clean diffs, reproducible builds.

---

## 7. Technical Architecture

### 7.1 Layering (the non-negotiable)
```
┌────────────────────────────────────────────┐
│ shell: Capacitor (iOS/Android) / PWA (web)│
├────────────────────────────────────────────┤
│ presentation: Phaser 3 scenes, sprites,    │
│ UI (DOM overlay for sheets/menus), audio   │
├────────────────────────────────────────────┤
│ SIM CORE (pure TS, zero Phaser imports):   │
│ fixed-timestep deterministic simulation,   │
│ ECS-lite entities, seeded RNG streams,     │
│ event bus out / command queue in           │
├────────────────────────────────────────────┤
│ data: JSON content defs (items, recipes,   │
│ enemies, biomes, quests, anims, palettes)  │
├────────────────────────────────────────────┤
│ persistence: chunk-diff saves, IndexedDB / │
│ native FS, cloud save (later)              │
└────────────────────────────────────────────┘
```
- **Sim core is headless and deterministic** (fixed 20 Hz tick, integer/fixed-point positions, per-system seeded RNG streams). Rendering interpolates at display rate. Why: (a) offline progression = fast-forward the *settlement subset* of the sim deterministically, (b) replayable bug reports, (c) the same core runs inside a Colyseus room later with zero rewrite — the multiplayer door stays open without paying for it now.
- **Command pattern:** input layer emits commands (`Move`, `Interact`, `Craft`, `AssignJob`); sim consumes; sim emits events (`ItemDropped`, `EnemyDied`); presentation reacts. Clean seam for tests, replays, and future networking.

### 7.2 World & performance
- **Chunk streaming:** keep 3×5 chunk window live (portrait = taller than wide); generate on a **Web Worker** (worldgen never blocks the main thread); LRU-evict with diff persistence.
- **Entity budget:** ~150 active entities on screen worst case (raid). Sprite pooling, spatial hash for collision/aggro queries, off-window settlers simulate in "abstract mode" (job progress numbers, not pathfinding).
- **Offline fast-forward:** on resume, settlement systems (crops, queues, expeditions, needs) advance analytically (closed-form: elapsed × rate, with event samples for expedition outcomes) — never tick-simulate hours.
- **Battery budget:** cap 60fps with 30fps saver mode; pause sim entirely when backgrounded (offline math covers the gap); no rAF churn in menus.

### 7.3 Save system
- Save = world seed + settings + chunk diffs (RLE tile edits + entity snapshots) + player + settlement state + quest flags + clock. Autosave on background/interval; versioned schema with migrations from day one (learned lesson from every long-lived sandbox).

### 7.4 Module layout (ES modules)
```
/sim        core loop, ecs, rng, commands, events
/sim/systems  movement, combat, ai, farming, settlers,
              expeditions, raids, crafting, needs
/world      gen (worker), chunks, autotile, pois, dungeons
/data       *.json content + schema validators
/render     phaser scenes, sprite sync, vfx, lighting
/ui         bottom sheets, hud, build mode, virtual stick
/assetforge generators (palettes, tiles, paperdoll, enemies), bake scripts
/persist    saves, migrations, cloud adapter
/shell      capacitor glue, lifecycle, haptics, IAP (later)
```

---

## 8. Engine Recommendation

**Recommendation: Phaser 3 (WebGL) + TypeScript + Capacitor**, with the headless sim core in plain TS.

Why this beats the alternatives *for this specific project*:

1. **The procedural art pipeline is the deciding factor.** The requirement is art/characters generated by an AI collaborator writing code. Canvas/WebGL + JS is the environment where that workflow is strongest: generators are plain functions drawing to offscreen canvases, bakeable in Node, iterable in the browser in seconds. In Unity/Godot the same idea means fighting importers, texture pipelines, and editor round-trips.
2. **It's your existing muscle.** Torchfall and Adrift are vanilla JS + Capacitor with paper-doll/socket systems and data-driven anim objects already proven. Phaser adds the things vanilla canvas makes expensive (WebGL batching, camera, tilemap culling, atlas management, tweens, audio) while keeping everything else identical. Near-zero retooling cost.
3. **Performance is sufficient for this genre.** A 16px-tile, ~150-entity, 2D top-down game is comfortably within Phaser-on-mobile territory with pooling + culling. This is not a bullet-hell or 3D workload.
4. **Multiplayer path is uniquely clean:** headless TS sim core drops into Colyseus (your already-chosen stack: Colyseus + Railway + Supabase) unchanged. No other engine gives you shared client/server simulation code in one language.
5. **Distribution flexibility:** same build ships as PWA (instant playtesting, itch.io) and via Capacitor to the App Store / Play Store.

**Honest trade-offs & mitigations:**
- *Lighting/shader polish* is weaker out-of-box than Godot. Mitigation: Phaser supports custom WebGL pipelines; day/night + cave lighting via palette tint ramps + a simple light-mask render texture gets 90% of the look.
- *No editor tooling.* Mitigation: you're data-driven anyway; build tiny in-game debug/inspector panels (you've done this pattern with the Adrift admin dashboard).
- *If v2 outgrows it* (huge seamless Z-level worlds, hundreds of pathfinding settlers), **Godot 4** is the fallback — best-in-class 2D renderer and real threads. But porting the sim core's *design* is easy precisely because it's engine-free, and I'd bet you never need to.
- Unity: overkill + licensing + worst fit for code-generated pixel art. Defold: technically excellent for mobile 2D but Lua and a much smaller ecosystem — weakest fit for your stack.

**Concrete stack:** Phaser 3.87+, TypeScript, Vite, Capacitor 6, Web Worker worldgen, IndexedDB (web) / native FS (Capacitor) saves, Node asset-bake scripts. Later: Colyseus + Railway + Supabase for co-op.

---

## 9. Implementation Roadmap

### Phase 0 — Foundations (1–2 weeks equivalent)
- Repo, Vite + TS + Phaser + Capacitor scaffold; fixed-timestep sim core skeleton; seeded RNG streams; command/event bus; virtual joystick + tap-interact input layer.
- Assetforge v0: palette tokens, one terrain pair autotile sheet, paper-doll body + 1 outfit + walk anim, 2 enemy generator families.
- **Exit:** character walks around one generated chunk on-device at 60fps, portrait.

### Phase 1 — The moment loop (2–3 weeks)
- Chunk streaming + worker worldgen (2 biomes), trees/rocks/ore nodes, harvesting, inventory + bottom-sheet UI, auto-pickup, day/night tint.
- Combat v0: auto-attack, dodge button, 4 enemies, drops, death/respawn.
- Crafting v0: workbench + furnace, ~25 items, vicinity crafting, hotbar.
- **Exit:** the 30-second loop is fun on a phone: wander, fight, gather, craft better gear.

### Phase 2 — First cave, first boss (2–3 weeks)
- Cave sub-maps (CA caverns + room grammar), cave entrances, torch lighting mask, 4 cave enemies + 1 miniboss, chest loot tables.
- Boss #1: summon item, arena, 2-phase fight, unique drops, tier-2 crafting unlock.
- Save/load with chunk diffs; autosave on background.
- **Exit:** vertical slice — a stranger can play 45 minutes to a boss kill. **This is the playtest gate.**

### Phase 3 — Settlement & offline layer (3–4 weeks)
- Hearthstone claim, build mode (walls/doors/furniture, room detection), 5 settlers (Elder, Farmer, Miner, Cook, Guard), needs/happiness, farming plots, cooking buffs.
- Expeditions v1 (miner/forager, 2 durations) + production queues + offline fast-forward + "while you were away" summary screen.
- Elder quest chain chapters 1–3.
- **Exit:** the session loop (collect → decide → venture → assign) is complete; retention testable.

### Phase 4 — Breadth & tier 2 (3–4 weeks)
- Biomes 3–5 (Snow, Desert, Swamp) + their materials/enemies; deep caves + key gating; bosses #2–#5; gear tiers 2–3 across all 4 weapon classes; fishing; alchemy/potions; trader; raids v1; rescue-a-settler content; remaining jobs (Fisher, Blacksmith, Alchemist, Explorer).
- **Exit:** 8–12 hours of content; soft-launch candidate.

### Phase 5 — Endgame & polish (3–4 weeks)
- Volcanic biome, rift sites, bosses #6–#8 + final boss; elite affixes; pets + outfit dyes; codex/journal; world rules screen; difficulty balancing pass; haptics, SFX/music pass (procedural/chip toolkit), onboarding polish; performance/battery pass; cloud save.
- **Exit:** 1.0 App Store submission.

### Phase 6 (post-launch) — chosen by data
Co-op via Colyseus (sim core reuse) · mounts · circuits/traps · seasonal events · new biome/tier.

---

## 10. Monetization & Risks

**Model:** premium (~$6.99) or free-demo-island + one-time unlock. Cosmetic DLC (palette packs, pets) only. **Hard rule:** no timer skips, no gacha — the offline layer must feel like a gift, not a meter.

| Risk | Mitigation |
|---|---|
| Scope: this genre is a content treadmill | Procedural art + data-driven content makes each item/enemy cheap; ruthless v1 cuts (§2 table); vertical-slice gate at Phase 2 |
| Portrait combat feels cramped | Camera bias + auto-attack + short aggro ranges; boss arenas sized for portrait aspect; playtest at Phase 2, not Phase 5 |
| Offline layer trivializes play | Expedition yields capped per real-day; best materials remain venture-only (boss/dungeon drops) |
| JS perf ceiling | Headless sim + pooling + worker gen; abstract-mode settlers; Godot fallback documented but unlikely to be needed |
| Save corruption on mobile lifecycle | Versioned schema, atomic writes, rolling backup slots, migration tests in CI |
| Genre-alike perception | Original theme, names, art, bosses, and the offline-expedition twist as a genuine differentiator |

---

## 11. Immediate Next Steps
1. Pick the real name + theme skin (the "ember/hearth" motif is a placeholder).
2. I generate Assetforge v0: palette tokens, one blob-47 terrain generator, and the paper-doll body/outfit/walk-cycle generator — as runnable code.
3. Phase 0 scaffold: sim core + input layer + one chunk rendering in Phaser, on-device.
