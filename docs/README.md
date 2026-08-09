# Emberhold — Design Docs

Reference artifacts for the game. Living documents: update them here as decisions
change, and add new ones alongside. Newest planning always supersedes older — see
the header of each status doc for what it replaces.

| Document | What it is | Status |
|---|---|---|
| [emberhold-status-v0.4.md](./emberhold-status-v0.4.md) | Project status & plan (v0.4) — art direction pivots to Dreadforge (nightmare) | **Current** plan of record |
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

Phase 0, save/load v0, and iso pivot step 1 (isometric renderer, detailed character) are shipped
on `main`. The art direction has since pivoted to **Dreadforge** — a game-wide procedural
nightmare. The next build is the Dreadforge port: **step 1 = master palette + material
classification + elevation/cliff faces**, where the game becomes the nightmare on-screen. See
`emberhold-status-v0.4.md` §5 for the build order and `dreadforge-tdd.md` for the full spec.
