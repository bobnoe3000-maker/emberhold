# EMBERHOLD — Project Status & Plan v0.2
**August 2026 · supersedes the roadmap in emberhold-design.md v0.1**

---

## 1. Where we are

Three artifacts exist, in order of creation:

**Design doc (emberhold-design.md).** Full game design for a Necesse-inspired, original-IP sandbox survival RPG: boss-gated 3-tier progression, colony/settler system, and the mobile-first differentiator — settler expeditions as a real offline progression layer. Portrait one-thumb UX spec, sim/render architecture, procedural art pipeline, monetization stance (premium, no timer monetization), 6-phase roadmap.

**Assetforge v0 (assetforge-v0.html).** Interactive proof of the art pipeline: palette token system with 4 tier metal ramps (demoed via generated swords), blob-47 autotiler with biome-as-palette-remap (Meadow/Snow/Desert from one generator), and the paper-doll character system — recipe → deterministic sprite, SOCKETS contract, WALK animation as data, 4 directions, tools drawn at the handR socket.

**Phase 0 build (emberhold-phase0.zip) — COMPLETE.** Playable repo, zero-build, git+Netlify ready:
- Dark **Emberwood** mood: dusk palette, ambient veil, flickering torch radius, vignette
- Headless deterministic sim core: fixed 20 Hz tick, commands in / events out, per-system RNG streams — **verified in node** (`smoke-test.mjs`: spawn, collision, harvest events, run-to-run determinism, stable hero recipe)
- Infinite chunk streaming with baked 512px chunk canvases, LRU cache, rebake-on-modify
- Same character models as Assetforge v0; hero rolled deterministically from the world seed
- Floating analog joystick + tap-to-harvest (3-hit resources, counters, toasts, hit-flash)
- y-sorted procedural trees/rocks; `netlify.toml` + README with deploy steps

**Phase 0 exit criteria met** (walkable generated world, on-device, portrait, one thumb) — pending your on-device confirmation, which is the one thing I can't verify from here.

## 2. Locked decisions (the "why" log)

| Decision | Rationale |
|---|---|
| Original IP genre-alike, not a clone | Mechanics are free to build on; names/art/content are not — and the offline-expedition layer is a genuine differentiator anyway |
| Zero-build ES modules, hand-rolled canvas renderer for now | Netlify deploys straight from git with no pipeline; 16px-tile workload doesn't need Phaser yet; swap is contained to `/render` because `/sim` never touches it |
| Phaser deferred to when we want particles/audio/tilemap culling | Same recommendation as the design doc, just later on the timeline |
| Headless sim, bus-only seams, fixed timestep | Node-testable now; Colyseus-portable later; offline fast-forward possible |
| Everything = f(coords, seed); saves = seed + diffs | Tiny saves, reproducible worlds, no asset storage |
| Dark dusk mood (Torchfall tone), torchlight carries warmth | Locked per your call; palette tokens make future biomes remaps of this mood |
| Deploy target: git → Netlify; Capacitor wrap later | Instant playtest URL on every push |
| Working title "Emberhold" | Placeholder — naming pass still open |

## 3. Design snapshot (unchanged since v0.1)

**Pillars:** one-handed portrait play → the world works while you're away → boss-gated depth → everything procedural & data-driven → readable pixel art at arm's length.

**Loops:** Moment (tap-drag-fight-gather, positioning + cooldowns, not aim) · Session (collect → decide → venture one 5–10 min sortie → assign settlers) · Meta (gear tier → boss → new tier/biome/jobs; camp → town).

**v1 content targets:** 6 biomes, ~150 items, ~24 enemy archetypes + elite affixes, 8 bosses in 3 tiers, 11 settler jobs, elder quest spine.

## 4. Updated implementation plan

Re-baselined: Phase 0 ✅. Two changes from v0.1 — **saves move up into Phase 1** (a public Netlify URL means real sessions immediately; losing progress kills playtest value), and **Phase 1 splits into two deploys** so each push is a testable increment.

### Phase 1a — Feel & persistence (next)
- **On-device pass:** verify 60fps on your phone; tune scale, joystick radius, torch radius, chunk cache size
- **Save/load v0:** seed + mods + player + counters → localStorage; autosave on background/interval; versioned schema from day one
- **Tap-to-move auto-path:** tap open ground → walk there (A* on a local window); reduces joystick fatigue, sets up tap-context verbs
- **Second biome** (dark pine/marsh — an Emberwood palette remap + new decor/props) with noise-driven biome blending
- **Audio v0:** footsteps, chop/crack, harvest chime (tiny procedural/chip toolkit)
- Exit: strangers can play at the Netlify URL, close the tab, come back to their world.

### Phase 1b — Combat & crafting (the moment loop, complete)
- Combat v0: auto-attack nearest in range, dodge-dash button, 4 enemy archetypes (chaser, kiter, swarm, tank), HP/damage, drops, death → respawn at spawn
- Inventory bottom sheet (4-wide grid, tap-context, auto-stack) + hotbar
- Crafting v0: workbench + furnace, ~25 items, vicinity crafting, craft-queue
- **Tool in hand:** crafted tool renders at the doll's handR socket (already wired); tool tier gates harvest speed
- Enemy generator family #1 (blob/beast) in assetforge
- Exit: the 30-second loop is genuinely fun — this is the original Phase 1 exit.

### Phase 2 — First cave, first boss *(unchanged)*
Cave sub-maps (CA caverns + room grammar), torch-lit darkness done properly (light masks), cave enemies + miniboss, chest loot, Boss #1 (summon item, 2-phase arena, unique drops, tier-2 unlock). **Vertical-slice playtest gate:** a stranger plays 45 minutes to a boss kill.

### Phase 3 — Settlement & offline layer *(unchanged, the retention engine)*
Hearthstone claim, build mode, first 5 settlers + needs/happiness, farming + cooking buffs, expeditions v1 + production queues + offline fast-forward + "while you were away" summary, elder quest chapters 1–3.

### Phase 4 — Breadth & tier 2 *(unchanged)*
Biomes 3–5, deep caves + key gating, bosses #2–5, gear tiers 2–3 × 4 weapon classes, fishing, alchemy, trader, raids v1, remaining jobs. Soft-launch candidate.

### Phase 5 — Endgame & ship *(unchanged, plus deferred infra)*
Rift sites + bosses #6–8 + final boss, elite affixes, pets/dyes, codex, world rules, balance, onboarding. **Deferred infra lands here:** Phaser swap if particle/audio needs justify it, Capacitor wrap, IndexedDB/native-FS saves + cloud save, battery pass. App Store submission.

### Phase 6 — Post-launch by data
Co-op via Colyseus (sim core drops in), mounts, circuits/traps, seasonal content.

## 5. Open items
1. **On-device verification** of the Phase 0 renderer (fps, input feel) — blocks Phase 1a tuning
2. **Name** — Emberhold is a placeholder; decide before store assets exist
3. **Netlify URL + repo up** — the moment it's live, every phase ends in a deployed playtest
4. Phase 1a design choices to make together: death penalty (none / drop-on-death?), day/night cycle now or with combat, biome #2 identity
