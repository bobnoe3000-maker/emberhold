# EMBERHOLD — Project Status & Plan v0.3
**August 2026 · supersedes emberhold-status-v0.2.md**

Two things changed since v0.2: **save/load v0 shipped**, and the **art direction pivoted to
isometric fine tiles**. The iso pivot is speced in full in `emberhold-iso-pivot-tdp.md` (the
implementation handoff); this doc is the plan of record that folds it into the roadmap and
records the decision.

---

## 1. Where we are

**Phase 0 — COMPLETE and deployed.** Playable, zero-build, on `main` (repo root, Netlify-ready).
Headless deterministic sim (fixed 20 Hz, commands in / events out, per-system RNG), infinite
chunk streaming, paper-doll characters, floating joystick + tap-to-harvest. Smoke-test verifies
determinism in node.

**Save/load v0 — SHIPPED** (was the top Phase 1a item in v0.2). Sessions persist to localStorage
and restore: a save is `seed + diffs` only (player, counters, harvested-resource overlay incl.
partial-harvest HP). Versioned schema (`SAVE_VERSION`) with a migration hook; autosave every 15s
and on tab-hide/close. `snapshot()`/`restore()` live in the sim (headless); storage lives in
`src/persist/save.js`. Round-trip covered by `smoke-test.mjs`.

**Art direction — PIVOTING to isometric (NEW).** Flat top-down is being replaced by a 2:1 dimetric
**isometric** presentation at fine **16×8** diamond tiles: an elevation field (basins, ground,
plateaus), auto-generated cliff faces, and per-tile **quantized** torch lighting (banded pools).
Validated by two mockup rounds (`iso-mockup-fine.html`). **Presentation only** — the sim, saves,
determinism, and the paper-doll characters are untouched; dolls billboard upright at 1×. Full spec
and work order: `emberhold-iso-pivot-tdp.md`.

## 2. Locked decisions (additions since v0.2)

| Decision | Rationale |
|---|---|
| **Isometric 2:1 presentation, fine 16×8 tiles** | More readable depth + world detail density than flat top-down; matches the studio's proven Torchfall visual language. Tile geometry (TW/TH/ZH) is parameterized, so density is config, not a rewrite |
| **Pivot is render-layer only; sim/saves/determinism frozen** | The `/sim` seam holds: elevation is a pure `heightAt(coords,seed)`, walkability adds a height-equality check, `core.js` needs zero changes. The whole point of the headless architecture, paying off |
| **Dolls stay 1×, billboarded upright** | No character-art rework; existing paper-doll system drops in. (See open item — the pivot buys *world* detail, not *character* detail) |
| **Lighting is render-time, quantized to 6 steps** | Never touches the sim → determinism and saves unaffected; the banded look is the aesthetic, not a limitation |
| Blob-47 autotiler parked, not deleted | May serve cave-floor material transitions later; diamond floor/face generators replace it for the overworld |

Prior v0.2 decisions (original-IP, zero-build ES modules, headless sim, everything=f(coords,seed),
dark dusk mood, Netlify deploy, "Emberhold" placeholder name) all still stand.

## 3. Synthesis — my read on the TDP (what I'd adjust or watch)

The TDP is strong and implementation-ready: clean goals/non-goals, a locked visual-spec table, an
honest performance plan (bake unlit chunks + a 7-sprite quantized shadow overlay, not the mockup's
naive per-pixel paint), and a work order where every step leaves the game runnable. The
sim-untouched framing is exactly right. Four things I'd flag before/while building:

1. **Ramp contract — clamp, don't force.** The render-halt bug came from a 3-shade WATER ramp
   indexed at 4 shades. The robust fix is **index-clamping in the drawers** (the mockup already does
   `ramp[Math.min(i, len-1)]`) — keep that as the contract. Making *floor material* ramps 4 shades
   is good, but do **not** force every token ramp to 4: `TRUNK` (2) and `CANOPY` (3) are indexed
   deliberately by the tree drawer. "All ramps are 4 shades" as written would break those.
2. **The pivot buys world detail, not character detail.** Finer tiles + iso depth make the *world*
   read richer, but dolls are unchanged 16×20 billboards (~2.5 tile-heights). If "more detail" is
   also meant for characters, that's a separate doll rework (larger canvas / iso-facing frames) and
   should be its own decision — see open items. Recommendation: ship the world pivot first, judge
   character detail on-device before committing to a doll rework.
3. **Plateau content stays decorative until ramps land.** With height-equality walkability and ramps
   deferred to Phase 1b, plateaus are unreachable. Fine as a visual tease — just don't gate any
   required content (chests with real loot, POIs) onto a plateau until ramps exist. The mockup's
   plateau chest should read as "come back later," not a dead end.
4. **Perf: bake static light into distant chunks.** The per-frame shadow overlay is only needed near
   moving lights (the player torch). Chunks with only static torches can bake their quantized shadow
   into the chunk canvas and skip the per-frame overlay — cheaper than re-lighting the whole view
   every frame. The TDP's 2×2-grid fallback is a fine safety net regardless.

None of these block the work order; items 1 and 3 are "do it this way," 2 and 4 are decisions/opts.

## 4. Updated implementation plan

Phase 0 ✅. Phase 1a re-sequenced so the **iso pivot is item #1** (it blocks feel-tuning — you can't
tune scale/joystick/tap feel against a presentation you're about to replace).

### Phase 1a — Iso pivot, feel & persistence *(in progress)*
1. **Iso pivot (fine tiles)** — per `emberhold-iso-pivot-tdp.md` §6 work order: `iso.js` projection +
   input mapping → port unlit diamond/face/prop generators + chunk bake → quantized light overlay +
   emissives → `world.js` elevation + water basins + walk rule + spawn guard → waypost/path POIs →
   on-device tune. Exit: walkable iso overworld with plateaus, a water basin, correct cliff faces at
   all four chunk-border orientations, tap-harvest works at 16×8. **Blocks the rest of 1a.**
2. ✅ **Save/load v0** — done.
3. **On-device pass** — 60fps across a chunk border near a cliff + 2 torches; tune scale, joystick,
   ambient, and the tap fat-finger snap radius at the new tile size.
4. **Tap-to-move auto-path** — A* on a local window; now routes through `iso.unproject` + height trial.
5. **Biome #2** — now an iso palette **and** height-profile remap (e.g. marsh = low/wet, few plateaus).
6. **Audio v0** — footsteps, chop/crack, harvest chime.
- Exit: strangers play at the Netlify URL in the iso language, close the tab, come back to their world.

### Phase 1b — Combat & crafting *(unchanged in intent)*
Combat v0 (auto-attack, dodge-dash, 4 archetypes, drops, death→respawn), inventory bottom sheet +
hotbar, crafting v0 (workbench + furnace, ~25 items), tool-in-hand at the doll's handR socket, enemy
generator family #1. **Iso add-on:** height-level ramps land here (so plateaus hold reachable content),
plus the first iso-facing enemy billboards. Exit: the 30-second loop is genuinely fun.

### Phase 2 — First cave, first boss *(unchanged)*
Cave sub-maps (CA caverns + room grammar) — void pits and cave floors are where the iso generators'
negative-height faces finally get used. Torch-lit darkness via the light-mask system. Cave enemies +
miniboss, chest loot, Boss #1 (summon item, 2-phase arena, tier-2 unlock). Vertical-slice gate: a
stranger plays 45 minutes to a boss kill.

### Phases 3–6 *(unchanged from v0.2)*
Settlement & offline layer (the retention engine) · breadth & tier 2 · endgame & ship (deferred infra:
Phaser swap if justified, Capacitor wrap, cloud save) · post-launch by data (co-op via Colyseus).

## 5. Open items
1. **Iso pivot build** — Phase 1a item #1; on-device 60fps gate is the acceptance bar.
2. **Character detail decision** — does the "finer detail" goal extend to dolls (a separate rework),
   or is the world-detail gain enough? Judge on-device after the pivot (§3.2).
3. **Height ramps** — Phase 1b; needed before plateaus hold required content (§3.3).
4. **Day/night cycle** — cheap now (mood configs are a dusk↔night ambient lerp); land with 1a tuning.
5. **Name** — Emberhold still a placeholder; decide before store assets.
6. Biome #2 identity (iso height profile + palette); death penalty; these carry over from v0.2.
