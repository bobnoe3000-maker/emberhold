# EMBERHOLD — Phase 0

Mobile-first, portrait-mode sandbox survival RPG. Dark dusk mood, torchlight, procedural everything.
Zero build step: plain ES modules, deploys as static files.

**Phase 0 exit criteria (met):** character walks an infinite chunked world on-device, portrait, one thumb.
Bonus: tap-to-harvest trees/rocks with counters, torch lighting, hit-flash feedback.

## Run locally

ES modules need a server (any static server works):

```bash
cd emberhold
python3 -m http.server 8080     # or: npx serve
# open http://localhost:8080 — use phone via your LAN IP for the real feel
```

## Deploy (git + Netlify)

```bash
git init && git add -A && git commit -m "phase 0"
git remote add origin <your-repo-url>
git push -u origin main
```

In Netlify: **Add new site → Import from Git** → pick the repo. `netlify.toml` sets
publish dir to `.` with no build command. Every push deploys. (Drag-and-dropping the
folder onto Netlify also works for one-off deploys.)

## Controls

- **Drag anywhere** — floating joystick, analog speed
- **Tap a tree or rock** — harvest (3 hits); "too far" toast outside reach

## Saves

Your session persists automatically to `localStorage` (autosave every 15s and on
tab-hide/close) and restores on load. A save is just the world seed + what you changed:
player position, counters, and the harvested-resource overlay (including partial-harvest
progress) — the world is re-derived from the seed. Schema is versioned (`SAVE_VERSION`)
with a migration hook from day one. Persistence lives in `src/persist/save.js`; the sim
owns the serialized shape via `snapshot()` / `restore()` in `core.js`, so `/sim` stays
headless (the round-trip is covered by `smoke-test.mjs`).

## Architecture

```
src/
  sim/          HEADLESS. Zero DOM imports. node smoke-test.mjs runs it.
    rng.js        mulberry32 streams + position-stable hash2 + fbm noise
    bus.js        events out / commands in — the only seam between layers
    world.js      terrain = f(x, y, seed); mods Map stores only player changes
    core.js       fixed 20 Hz tick, movement + collision, harvest
  assetforge/   art as code, deterministic
    tiles.js      iso floor diamonds (drawFloorDiamond) + parked blob-47 autotiler
    doll.js       paper-doll: recipe → sprite; drawDoll (16×20) + drawDollDetailed (24×36 iso)
    props.js      trees + rocks, seeded per-tile variation
  render/       swappable presentation (Phaser can replace this wholesale)
    iso.js        geometry source of truth: project / unproject / resolveTap (pure, tested)
    palette.js    dark token system (Emberwood biome) + character tokens
    renderer.js   iso painter: diamond floors, depth-sort, detailed doll, torch light
    renderer-flat.js  PARKED original top-down renderer (rollback)
  ui/
    input.js      floating joystick + tap, feeds command queue
    hud.js        DOM overlay bound to sim events
  persist/      browser-only. Never imported by /sim.
    save.js       versioned localStorage saves + lifecycle autosave
  main.js       boot + fixed-timestep loop with render interpolation
```

**Design invariants (don't break these):**
1. `/sim` never imports from `/render`, `/ui`, or the DOM. It must keep running in node.
2. Terrain and art are pure functions of `(coords, seed)`. Saves are seed + diffs, nothing else.
3. Input → commands → sim → events → render. No layer skips the bus.
4. Same seed = same world = same hero, on every device, forever.

**Verify headlessly (run both before every push):**
```bash
node smoke-test.mjs         # sim determinism, saves, iso geometry round-trips
node render-smoke-test.mjs  # iso renderer boots + paints with no NaN/undefined draws
```

## Renderer note

Phase 0 ships a lean hand-rolled canvas renderer — at 16px tiles it's comfortably 60fps and
keeps the repo zero-build. The Phaser recommendation from the design doc stands for when we
want its tilemap culling, particles, and audio: the swap is contained to `/render` because
the sim never touches it. Capacitor wrap (Phase 5) points at this same folder.

## Art direction — isometric (pivot in progress)

The build now renders in a **2:1 isometric** language: fine 16×8 diamond tiles and a detailed
24×36 character sprite (`src/render/iso.js` is the geometry source; `renderer.js` is the iso
painter). This is **presentation only** — the headless sim, saves, determinism, and the
paper-doll *recipe* system are unchanged. The previous flat top-down renderer is parked in
`src/render/renderer-flat.js` for rollback (flip the import in `main.js`).

**Landed (pivot step 1):** iso projection + input mapping, diamond floor tiles, detailed
billboarded character, iso tap + fat-finger snap — at **flat** elevation.
**Next steps** (per [`docs/emberhold-iso-pivot-tdp.md`](docs/emberhold-iso-pivot-tdp.md) §6):
chunk-baked geometry for 60fps, then `world.js` elevation (basins/plateaus/cliff faces) +
walk rule, quantized per-tile lighting, and the character's **iso-facing walk frames**.
Visual spec proof: [`docs/art-style-iso.html`](docs/art-style-iso.html).

## Next (Phase 1a — finish the iso pivot, then the moment loop)

- Chunk-bake iso geometry (60fps) · on-device feel pass (scale, joystick, tap snap)
- `world.js` elevation + water basins + walk rule; quantized per-tile lighting
- Iso-facing walk frames for the 24×36 character
- Second biome (iso palette + height-profile remap) · auto-path on tap-to-move · audio v0
- Then Phase 1b: combat, inventory + crafting bottom sheets, tool-in-hand, height ramps
