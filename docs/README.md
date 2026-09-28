# Emberhold — Design Docs

Reference artifacts for the game. Living documents: update them here as decisions
change, and add new ones alongside. Newest planning always supersedes older — see
the header of each status doc for what it replaces.

| Document | What it is | Status |
|---|---|---|
| [tile-styles.md](./tile-styles.md) | Six structured floor/wall tile styles (clean, low-noise), live via `?tiles=` | **Proposal** — pick pending (2026-09-28) |
| [character-direction.md](./character-direction.md) | Character art decision — KayKit CC0 3D, heroic proportions, 'grim' pass; roster + integration plan | **Current** character direction (2026-09-27) |
| [emberlit-tdd.md](./emberlit-tdd.md) | Technical design for the Emberlit WebGL2 deferred renderer (G-buffers, point lights, HDR bloom) | **Active** render spec (shipped) |
| [emberlit-demo.html](./emberlit-demo.html) | The Emberlit reference demo the renderer was ported from (open in a browser) | Reference |
| [emberhold-status-v0.4.md](./emberhold-status-v0.4.md) | Project status & plan (v0.4) — art direction pivots to Dreadforge (nightmare) | Plan of record (build has moved past it — see pointer below) |
| [dreadforge-tdd.md](./dreadforge-tdd.md) | Technical design doc for the Dreadforge nightmare pipeline (materials, voxel bake, CA creatures, post stack, hybrid actors) | **Active** art-direction + render spec |
| [dreadforge-mockup.html](./dreadforge-mockup.html) | Confirmed nightmare-biome look — from-spec, live generators (open in a browser) | **Current** visual reference |
| [emberhold-iso-pivot-tdp.md](./emberhold-iso-pivot-tdp.md) | Technical design plan for the isometric fine-tile pivot | Landed (iso geometry); superseded on mood by Dreadforge |
| [emberhold-status-v0.3.md](./emberhold-status-v0.3.md) | Project status & plan (v0.3) — save/load + iso pivot | Superseded by v0.4 |
| [emberhold-design.md](./emberhold-design.md) | Full game design + architecture + roadmap (v0.1, v0.3-amended) | Foundational; presentation amended to iso, roadmap superseded by the status doc |
| [art-style-iso.html](./art-style-iso.html) | Iso field guide — terrain, cliffs, props, detailed 24×36 characters | Geometry/proportion reference; **Emberwood mood retired** by Dreadforge |
| [iso-mockup-fine.html](./iso-mockup-fine.html) | The original iso visual-spec proof — 16×8 diamonds, elevation, quantized lighting | Reference the pivot spec was locked from (pre-detailed-doll) |
| [assetforge-v0.html](./assetforge-v0.html) | Original procedural art-pipeline proof (palettes, blob-47, paper-doll) | Historical — flat top-down; blob-47 now parked |
| [emberhold-status-v0.2.md](./emberhold-status-v0.2.md) | Prior status (v0.2) | Superseded by v0.3 |

## Conventions

- **Status docs are versioned** (`-v0.2`, `-v0.3`, …). Bump the version on a re-baseline
  rather than editing history; state what the new version supersedes in its header.
- **The design doc is the "why."** Amend it in place when a locked decision changes
  (see its v0.3 iso banner), and note the change in the current status doc's decision log.
- Implementation lives at the repo root (`index.html`, `src/`); these docs describe
  intent, not the running build. Keep the two in sync when a phase ships.

## Build progress (quick pointer)

Shipped on `main`: Phase 0, save/load, the iso pivot, the Dreadforge port, and the
**Emberlit** WebGL2 deferred renderer. On top of those: **themed dungeon levels** (rooms,
wide corridors, weathered walls over the abyss, six emissive biomes), the **descent**
(stairs → a deeper, harder level), room contents (chests, shrines, braziers), a fog-of-war
**minimap**, and a 3D-sprite hero + skeleton POC. Characters are moving to
[`character-direction.md`](./character-direction.md) (Option C): the next build bakes KayKit
G-buffer atlases into the existing actor path, then combat. `emberhold-status-v0.4.md`
predates all of this and needs a v0.5 re-baseline.
