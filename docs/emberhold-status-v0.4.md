# EMBERHOLD — Project Status & Plan v0.4
**August 2026 · supersedes emberhold-status-v0.3.md**

The art direction pivots again — this time all the way. **Dreadforge is now the primary
visual identity**: the whole game is a cold procedural nightmare (ashen violet ground,
spreading poison corruption, bone / flesh / obsidian, voxel props, CA creatures, and a live
glow + flicker + fog post stack). The warm dusk **Emberwood** mood is retired as the base.
Full spec: `dreadforge-tdd.md`. Confirmed look: `dreadforge-mockup.html`.

This is a **presentation-layer** pivot on the **same geometry** — the isometric grid, the
headless sim, saves, and determinism are unchanged.

---

## 1. Where we are

- **Phase 0 ✅ + Save/load v0 ✅** — deployed on `main`.
- **Iso pivot (step 1) ✅** — the build renders isometric: `render/iso.js` geometry source,
  diamond floor tiles, detailed 24×36 character, iso camera + tap. Proportions tuned and
  verified in headless Chromium.
- **Art direction → Dreadforge (NEW, decided).** The nightmare replaces Emberwood as the
  game-wide identity. Evaluated and mocked up from the TDD (the referenced `dreadforge.html`
  prototype wasn't in the handoff, so the mockup is a from-spec implementation — it renders the
  real generators: terrain classification, voxel bake, CA creatures, and the post stack).

## 2. Locked decisions (additions since v0.3)

| Decision | Rationale |
|---|---|
| **Dreadforge is the primary art direction (game-wide nightmare)** | Strongest, most distinctive identity; the corruption/nightmare mood is a genuine differentiator. Emberwood warm dusk retired as the base mood. |
| **Pivot is presentation-only on the existing iso geometry** | Dreadforge targets the exact locked grid (TW16/TH8/ZH6) already in the build; elevation + cliff faces were already our next iso step. Sim, saves, determinism untouched. |
| **The player survives as a `SheetActor`** | The hybrid-actor `getFrame` contract (TDD §8) lets the detailed 24×36 doll live as a sprite-sheet actor beside voxel NPCs — but it must be quantized to the master ramps (§8.4) so it stops reading warm against the cold palette. |
| **Master palette + classification model** | Materials are ramp tables + classification rules (soil/flesh/bone/poison/water/obsidian). New biomes = new ramps + rules, not new render code — corruption already proves it. |
| **Post stack = the day/night + biome system** | Fog/glow/flicker over composited output doubles as day/night (time-of-day ramp bias) and biome identity, per TDD §11. |

Everything from v0.3 that isn't about the warm palette still stands (original-IP, zero-build ES
modules, headless sim, everything = f(coords, seed), Netlify deploy, iso geometry, detailed
character sprite, "Emberhold" placeholder name).

## 3. What carries over / changes / retires

**Carries over (unchanged):** `/sim` (core, world coords, rng, bus), saves/persistence,
determinism, `render/iso.js` geometry + projection, the diamond-tile *approach*, the detailed
24×36 character (becomes a `SheetActor`), the iso camera + tap + input mapping, the
render-smoke test discipline.

**Changes:** `render/palette.js` → master ramp table (soil/flesh/bone/poison/water/obsidian +
glow accents + universal `#08050e` outline). `assetforge/tiles.js` → nightmare material tiles
+ cliff faces (elevation-aware). `sim/world.js` → gains `heightAt` (z∈[0,7]) + corruption field
+ material classification (pure functions of coords+seed; no save change). `render/renderer.js`
→ the `world.js` painter with the post stack.

**New modules** (per TDD §8.5): `gen/voxbake.js` (voxel→sprite), `gen/props.js` (spire /
monolith / eye-totem builders), `gen/creatures.js` (CA), `actors/*` (the actor contract +
VoxelActor / SheetActor / AdditiveSheetActor + validate), `render/post.js` (glow / flicker /
fog). `assetforge/props.js` (Emberwood trees/rocks) retires with the meadow.

**Retires:** Emberwood warm palette + trees/rocks/decor; `renderer-flat.js` (already parked) can
be deleted once Dreadforge lands; blob-47 stays parked for possible cave-floor transitions.

## 4. Synthesis — my read on adopting the TDD

The TDD is unusually implementation-ready and its architecture is a clean superset of what we
built. Notes for the port:

1. **This is the elevation step we already owed.** The iso pivot deferred `heightAt` + cliff
   faces; Dreadforge *requires* them and specifies them fully. Doing them now with the nightmare
   materials is one job, not two.
2. **Perf discipline is the whole game.** The gen/present split (expensive per-seed, cheap
   per-frame) must be honored: chunk-bake the base + faces + static props once; per frame only
   composite base + glow fillRects + flicker disc + 8 Hz fog. The mockup paints a whole chunk
   per frame and is fine for a static vista — production must chunk-cache (this also finally
   fixes the iso renderer's per-tile-per-frame cost).
3. **Quantize the hero to the ramps early.** A warm 24×36 doll in the cold world breaks §8.4
   invariant #2. Add the palette-quantize + outline pass to the `SheetActor` load path in the
   same step it's introduced, or it will look wrong in every screenshot.
4. **Dithering is heavy — keep a density dial.** The look is busy by design; expose the fog and
   speckle densities as tunables so we can pull it back on-device without touching generators.
5. **Seed-space partitioning is a hard rule.** Every new subsystem allocates a fresh
   multiplier/offset; never reuse a stream (the corruption slider must not move props).

## 5. Build order (each step verified in headless Chromium before push)

Adapted from TDD §11, sequenced onto our current iso build:

1. **Master palette + material classification + elevation.** `palette.js` ramp table;
   `world.js` `heightAt` + corruption field + material classification; `tiles.js` nightmare
   diamond + cliff faces. Renderer draws the classified, elevated nightmare terrain. **This is
   the single biggest visual step — the game becomes Dreadforge.**
2. **Chunk-cache render path + post stack.** Bake per-chunk; `render/post.js` glow / flicker /
   fog. Locks 60fps and the mood. Retire the per-tile-per-frame path.
3. **Voxel bake + props.** `voxbake.js` + spire / monolith / eye-totem, placed by rejection
   sampling at corruption heart.
4. **Actor contract + the player as `SheetActor`** (palette-quantized), CA creatures as
   `VoxelActor`-style 2-frame bob actors.
5. **AdditiveSheetActor (ramp-shift NPC variants)** + promote corruption spread to game state
   (biome-as-progression, TDD §11).

## 6. Open items
1. **Start the port** — build order step 1 (palette + elevation + classification) is the next
   implementation, and it's where the game *becomes* Dreadforge on-screen.
2. **Hero quantization** — decide the master-ramp mapping for the paper-doll (skin/cloth →
   nearest ramp) so the character reads native (§8.4).
3. **Name** — "Emberhold" was an ember/hearth placeholder; the ember motif is now gone. A
   nightmare-appropriate name is newly relevant (Dreadforge is the *pipeline* name, not
   necessarily the game's).
4. Day/night via the post stack; death-site corruption feedback (TDD §11) — both cheap once the
   post stack lands.
5. Carry-overs from v0.3: on-device perf gate, tap-to-move auto-path, audio v0.
