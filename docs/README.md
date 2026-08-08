# Emberhold — Design Docs

Reference artifacts for the game. Living documents: update them here as decisions
change, and add new ones alongside. Newest planning always supersedes older — see
the header of each status doc for what it replaces.

| Document | What it is | Status |
|---|---|---|
| [emberhold-status-v0.3.md](./emberhold-status-v0.3.md) | Project status & plan (v0.3) — folds in save/load + the iso pivot | **Current** plan of record |
| [emberhold-iso-pivot-tdp.md](./emberhold-iso-pivot-tdp.md) | Technical design plan for the isometric fine-tile pivot | **Active** implementation spec (Phase 1a #1) |
| [emberhold-design.md](./emberhold-design.md) | Full game design + architecture + roadmap (v0.1, v0.3-amended) | Foundational; presentation amended to iso, roadmap superseded by the status doc |
| [art-style-iso.html](./art-style-iso.html) | Confirmed iso art-direction field guide — terrain, cliffs, props, and the **detailed 24×36 characters** (open in a browser) | **Current** visual reference (matches the locked decision) |
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

Phase 0 (walkable procedural world, portrait, one thumb) is complete and deployed to `main`.
Save/load v0 (seed + diffs → localStorage, versioned, autosave) has shipped. The next build is
the **isometric pivot** — Phase 1a item #1, which blocks feel-tuning. See
`emberhold-status-v0.3.md` §4 for the phase plan and `emberhold-iso-pivot-tdp.md` §6 for the
step-by-step work order.
