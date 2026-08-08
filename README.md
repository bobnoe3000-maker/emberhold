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
    tiles.js      blob-47 autotiler (any terrain-over-terrain pair)
    doll.js       paper-doll: recipe → sprite, SOCKETS contract, WALK anim data
    props.js      trees + rocks, seeded per-tile variation
  render/       swappable presentation (Phaser can replace this wholesale)
    palette.js    dark token system (Emberwood biome) + character tokens
    renderer.js   chunk bake cache (512px offscreens), y-sort, torch light
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

**Verify the sim headlessly:**
```bash
node smoke-test.mjs
```

## Renderer note

Phase 0 ships a lean hand-rolled canvas renderer — at 16px tiles it's comfortably 60fps and
keeps the repo zero-build. The Phaser recommendation from the design doc stands for when we
want its tilemap culling, particles, and audio: the swap is contained to `/render` because
the sim never touches it. Capacitor wrap (Phase 5) points at this same folder.

## Next (Phase 1 — the moment loop)

- Second biome + biome blending
- Combat v0: auto-attack, dodge, 4 enemies, drops
- Inventory + crafting bottom sheets (workbench, furnace, ~25 items)
- Tool in hand from crafting (the doll's handR socket is already wired)
- Auto-path on tap-to-move
