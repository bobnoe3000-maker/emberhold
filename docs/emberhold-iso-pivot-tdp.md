# EMBERHOLD — Design Change Plan: Iso Pivot (Fine Tiles)
**TDP v1.0 · August 2026 · scoped for implementation handoff**

Converts the Phase 0 flat top-down presentation to the Torchfall-style isometric language
validated by the two mockup rounds, at the fine tile scale (16×8). Amends Phase 1a in
`emberhold-status-v0.2.md`; this work is Phase 1a item #1 and blocks feel-tuning.

---

## 1. Goals & non-goals

**Goals**
1. Overworld renders as 2:1 dimetric diamonds with an elevation field: plateaus, water basins, auto-generated cliff faces.
2. Per-tile quantized lighting (the banded torch pools) driven by light sources: player torch + world torch props.
3. Existing paper-dolls billboarded upright at 1× — no doll changes.
4. 60fps on-device at the same entity budget as Phase 0.
5. Sim, saves, and determinism untouched.

**Non-goals (explicitly out of scope)**
- Sim tick, command/event contracts, movement speeds, harvest rules — unchanged.
- Ramps/climbing between height levels (deferred; see §5 walk rules).
- Void pits (that's cave content, Phase 2 — generators support it, worldgen won't emit it yet).
- Day/night cycle, combat, biome #2 (remaining Phase 1a/1b items, sequenced after this).
- Any change to `mods` save format.

## 2. Locked visual spec (from mockups, do not re-litigate)

| Parameter | Value |
|---|---|
| Tile diamond | **TW=16, TH=8** native px (2:1), parameterized as consts in one place |
| Elevation step | **ZH=6** px per height level |
| Height levels (overworld v1) | h ∈ {0 basin, 1 ground, 2 plateau} |
| Character billboard | dolls at **1×** (16×20), feet anchored at diamond center → ~2.5 tile-heights |
| Floor treatment | 3-shade dither + **checkerboard value step** on (x+y) parity + dark seam on the two lower diamond edges |
| Cliff faces | right (SE) face full value, left (SW) face ×0.72, 2px vertical rib pattern, depth fade to 0.12 |
| Lighting | per-tile, **quantized to 6 steps**, warm push `L²`; ambient: dusk 0.14 / night 0.045; hero torch r≈5.6 tiles, waypost torch r≈4.4 |
| Actors | lit at `max(tileL, 0.85)` (own torch); HP bar 12×3 with 10px green fill |
| Minimap | corner box, 2px/tile, kind-colored, cyan player dot, gold companion dot |

Palette tokens: adopt mockup additions into `palette.js` — `WALLG`, `WALLS`, `FLAME`, 4-shade `WATER` (the 3-shade ramp caused the render-halt bug; **all ramps are 4 shades by contract, and drawers clamp indices** regardless).

## 3. Architecture impact summary

```
UNCHANGED:  src/sim/core.js · src/sim/bus.js · src/sim/rng.js · src/assetforge/doll.js · src/ui/hud.js
EXTENDED:   src/sim/world.js (heightAt, water basins, waypost POIs, height-aware walkability)
            src/render/palette.js (wall/flame tokens, mood configs)
            src/ui/input.js (iso tap inverse + joystick axis mapping)
REPLACED:   src/render/renderer.js (iso painter + bake-unlit chunks + light overlay)
            src/assetforge/tiles.js (diamond floor/face generators; blob-47 parked, not deleted)
            src/assetforge/props.js (fine-scale set: tree, torch, pillar, chest, glint)
NEW:        src/render/iso.js (projection + inverse, geometry consts)
            render-smoke-test.mjs (stub-canvas harness in CI habit)
```

## 4. Module change specs

### 4.1 `src/render/iso.js` (new)
Single source of geometry truth: `TW, TH, HW, HH, ZH`.
- `project(x, y, h) → {sx, sy}`: `sx = (x−y)·HW`, `sy = (x+y)·HH − h·ZH` (camera subtracts separately).
- `unproject(sx, sy, hGuess) → {x, y}` (float world coords): inverse of the above for a given h.
- **Tap resolution:** try `h = 2, 1, 0` in order; for each, unproject and test the landed tile's actual height — first match wins. Then apply **fat-finger snap**: if the resolved tile has no resource but a resource exists within 0.75 tiles, snap to it (16×8 diamonds are small under a thumb).

### 4.2 `src/sim/world.js` (extend)
- `heightAt(world, x, y)`: pure function of coords+seed. v1: base 1; plateau noise field > threshold → 2 (biome-tunable coverage ~8%); basin field > threshold → 0. Basins at h0 with high moisture become `water` kind; dry basins stay dirt (natural hollows).
- `tileType` gains the height interplay but keeps its signature; water = basin+moisture, not a raw band.
- **Walk rule:** movement allowed only between tiles of equal h; water and h-mismatch block. This is the exact Phase 0 collision semantic (blocked cells), so `core.js` needs zero changes — `isWalkable` just adds the height equality check against the player's current tile height.
- **Waypost POI pass:** sparse torch props along generated dirt paths (path pass: low-frequency ridge noise → dirt ribbons; torches every ~10–14 path tiles). Wayposts register as light sources and as non-walkable props.
- Connectivity guard: spawn search already scans for walkable; add a rule that plateau/basin thresholds never apply within r=6 of origin so spawn is always open ground.

### 4.3 `src/assetforge/tiles.js` (replace)
Port the mockup drawers, parameterized by iso.js consts:
- `drawFloorDiamond(ctx, ox, oy, wx, wy, materialRamp, checkerParity, seed)` — **unlit** (full-bright); lighting is applied at composite time, not bake time.
- `drawCliffFaces(ctx, ...)` — right/left faces from neighbor height deltas, unlit.
- Blob-47 stays in the file behind an export, unused (cave interiors may want it for floor-material transitions later; decision deferred).
- Material transition on diamonds (grass↔dirt edge dither) — v1: hard edges + seam, transition dither is a fast-follow tweak.

### 4.4 `src/assetforge/props.js` (replace)
Fine-scale set from the mockup: `tree (16×26), torch (post+flame+halo), pillar, chest, glint`. Contract: every prop drawer takes a **ground-anchor point** (diamond center) and draws unlit except the torch flame/halo, which is emissive (never darkened). Trees keep seeded lean/mote variation.

### 4.5 `src/render/renderer.js` (replace) — the performance plan
Naive per-frame per-pixel painting (mockup approach) is fine for a static scene and hopeless at 60fps (~4–5k visible diamonds). Production approach:

1. **Bake unlit geometry per chunk.** Chunk = 32×32 tiles → iso footprint baked into a padded rectangular canvas (padding = max cliff depth + tallest prop, so overhangs never clip). Bake includes floor, faces, and static props (trees/pillars/chests — they're world-static). LRU cache as Phase 0; rebake on `harvested`.
2. **Composite per frame:** draw visible chunk canvases (a handful of drawImage calls) → then **light overlay**: for each visible tile, draw a pre-baked diamond-shaped shadow sprite at alpha for its quantized darkness level (7 tiny sprites total, one per level; tiles adjacent to a drop use a taller variant that covers the face). ~4–5k drawImages of a 16×8 sprite is cheap; fallback if it isn't on low-end devices: compute light on a 2×2-tile grid (quarter the sprites, banding barely changes).
3. **Emissives after shadow:** torch flames + halos + glints redrawn on top so light never darkens them.
4. **Dynamic pass:** y-sorted actors (player interp → `project()`), hit-flash, joystick UI. Dolls remain runtime-drawn from the cached frame canvases (unchanged mechanism).
5. Warm glow: single radial per light source, `lighter` composite, capped count on screen.

Draw order per frame: chunks → shadow overlay → emissives → actors (actors get their tile's L via canvas filter? No — actors pre-shaded like mockup via `shade()` per frame is fine at ≤20 sprites).

### 4.6 `src/ui/input.js` (extend)
- **Joystick mapping:** thumb drag stays screen-space; convert to world axes before the move command: `wx = (sx/HW + sy/HH)/2`, `wy = (sy/HH − sx/HW)/2`, normalize. Result: dragging screen-up-right walks along +x (up-right in iso), which is what thumbs expect.
- **Tap:** route through `iso.unproject` + height trial + fat-finger snap (§4.1), then emit the same `harvest` command. `core.js` reach check is unchanged.

### 4.7 `src/render/palette.js` (extend)
Add `WALLG, WALLS, FLAME`, 4-shade `WATER`, `MOODS {dusk, night}` (ambient + hero radius), and the emissive list (colors exempt from shading). Token contract note added: *ramps are always [highlight, base, shade, deep]*.

## 5. Deferred decisions (tracked, not blocking)
1. **Ramps between height levels** — needed before plateaus hold content (chests currently unreachable = intentional tease or add ramps in Phase 1b). Recommend: carve 1–2 ramp tiles per plateau in worldgen, Phase 1b.
2. **Day/night cycle** — mood configs make it a lerp between dusk/night ambients; land with Phase 1a feel-tuning.
3. Blob-47's future (cave floors vs full retirement).
4. Mixed-resolution props: locked at shared 1× grid for props, dolls 1× — revisit only if on-device says otherwise.

## 6. Work order (each step leaves the game runnable)
1. `iso.js` + consts; renderer draws current flat world through `project()` (no elevation yet) — proves projection + input mapping in isolation.
2. Port tile/prop generators (unlit); chunk bake in iso space with padding.
3. Light overlay system + emissives; delete the old radial torch.
4. `world.js` elevation + water basins + walk rule + spawn guard.
5. Waypost/path POI pass.
6. Tune pass on-device: scale, radii, ambient, tap snap radius.

## 7. Test plan
- **Extend `smoke-test.mjs`:** height determinism (two runs identical), walk rule (h-mismatch blocks, equal-h passes), spawn-guard (origin r=6 is h=1 land), waypost placement determinism.
- **New `render-smoke-test.mjs`:** the stub-canvas harness (proven on the mockups — it caught the WATER ramp crash). Runs: one chunk bake, one full frame composite, asserts zero exceptions and zero NaN/undefined styles. Run both tests before every push.
- **On-device gate:** 60fps sustained while walking across a chunk border near a cliff + 2 torches; tap-harvest success rate feels right at 16×8 (subjective, tune snap radius).

## 8. Acceptance criteria
1. Walkable iso overworld with plateaus, at least one water basin visible within 30s of walking, cliff faces correct at all 4 chunk-border orientations.
2. Torch pools band (quantized), player carries light, emissives never darken.
3. Harvest loop works by tap at the new scale (with snap), counters/toasts unchanged.
4. `node smoke-test.mjs` and `node render-smoke-test.mjs` pass; two boots of the same seed are pixel-identical.
5. 60fps on your device; no visual popping at chunk borders (padding correct).

## 9. Risks
| Risk | Mitigation |
|---|---|
| Chunk-border cliff/tree overdraw clipping | Bake padding = max(face depth, prop height); harness asserts padded bounds |
| Shadow-overlay drawImage count on low-end | 2×2-tile light grid fallback, config-switchable |
| Tap precision at 16×8 | 0.75-tile resource snap; widen if playtest says so |
| Scope creep into ramps/caves | §5 keeps them named and parked; plateaus ship decorative |
