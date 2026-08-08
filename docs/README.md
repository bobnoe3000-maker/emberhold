# Emberhold — Design Docs

Reference artifacts for the game. Living documents: update them here as decisions
change, and add new ones alongside. Newest planning always supersedes older — see
the header of each status doc for what it replaces.

| Document | What it is | Status |
|---|---|---|
| [emberhold-design.md](./emberhold-design.md) | Full game design + architecture + roadmap (v0.1) | Foundational; roadmap superseded by the status doc below |
| [emberhold-status-v0.2.md](./emberhold-status-v0.2.md) | Project status & re-baselined plan (v0.2) | **Current** plan of record |
| [assetforge-v0.html](./assetforge-v0.html) | Interactive proof of the procedural art pipeline (palettes, blob-47 autotiler, paper-doll) | Reference; open in a browser |

## Conventions

- **Status docs are versioned** (`-v0.2`, …). Bump the version on a re-baseline
  rather than editing history; state what the new version supersedes in its header.
- **The design doc is the "why."** Amend it in place when a locked decision changes,
  and note the change in the next status doc's decision log.
- Implementation lives at the repo root (`index.html`, `src/`); these docs describe
  intent, not the running build. Keep the two in sync when a phase ships.

## Build progress (quick pointer)

Phase 0 (walkable procedural world, portrait, one thumb) is complete and at the repo
root. Save/load v0 (seed + diffs → localStorage, versioned, autosave) has since landed.
See `emberhold-status-v0.2.md` §4 for the phase plan and open items.
