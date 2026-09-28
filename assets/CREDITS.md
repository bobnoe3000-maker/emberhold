# Art asset credits

## Actors — `assets/actors/`
Baked from **KayKit Character Pack: Adventurers 1.0** and **KayKit Character Pack:
Skeletons 1.0** by Kay Lousberg (https://kaylousberg.com) — **CC0 1.0**. No
attribution is required; it is given here as a courtesy.

Each actor is rendered in Emberhold's camera at 56 px with the "heroic" proportion
pass and the "grim" colour pass, then packed into albedo / normal / emissive atlases
(8 screen directions × idle + walk frames) by `tools/actor-lab/bake.cjs`. The
source models are downloaded by `tools/actor-lab/fetch-assets.sh` and are never
committed.

The earlier POC atlases (a Flare CC BY-SA 3.0 skeleton and the `isometric_hero`
knight) have been removed.

## Environment — `assets/env/`
The buildings, trees, bridge, rocks and mountains are **our own**: low-poly models
authored in code (`tools/actor-lab/buildkit.js`). The ruin, the mine, the lumber mill
and small props (barrels, crates, sacks, fences) still come from the **KayKit Medieval
Hexagon Pack** by Kay Lousberg (**CC0 1.0**). Everything is baked by `tools/actor-lab/bake-env.cjs`. The source
models are downloaded by `tools/actor-lab/fetch-env.sh` and never committed.
