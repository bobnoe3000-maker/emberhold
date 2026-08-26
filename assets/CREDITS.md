# Art asset credits

## Skeleton enemy — `assets/enemy/skeleton.png`
Derived from **FLARE — Empyrean Campaign** (flareteam/flare-game),
`mods/fantasycore/images/enemies/skeleton.png` and its animation definition
`mods/fantasycore/animations/enemies/skeleton.txt`.

- Original art: © the Flare Team / Clint Bellanger and contributors.
- License: **CC BY-SA 3.0** — https://creativecommons.org/licenses/by-sa/3.0/
- Source: https://github.com/flareteam/flare-game

This file is a **derivative** (frames sliced per the Flare animation def, scaled to
game resolution, re-packed into a compact direction×frame atlas). As a CC-BY-SA
derivative it is licensed **CC BY-SA 3.0** and must retain this attribution.

## Hero — `assets/hero/knight.png`
Baked from the user-provided `isometric_hero` sprite pack (steel armor + head +
longsword + shield composited across 8 directions). **License to be confirmed by
the project owner** before distribution; if it derives from Flare/OpenGameArt
CC-BY-SA lineage, the same share-alike + attribution terms apply.

## Baking
Both atlases are produced by `tools/bake_actors.py` (offline); only the compact,
cropped atlases are committed — not the multi-megabyte source sheets.
