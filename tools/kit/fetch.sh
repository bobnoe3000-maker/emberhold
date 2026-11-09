#!/bin/sh
# fetch.sh — pull the pieces of KayKit Dungeon Remastered (CC0, Kay Lousberg, the author of our cast) that the kit
# spike uses into ./models (gitignored; docs/dungeon-kit-proposal.md). ~2 MB of glTF binaries, the texture embedded.
set -e
cd "$(dirname "$0")" && mkdir -p models && cd models
B="https://raw.githubusercontent.com/KayKit-Game-Assets/KayKit-Dungeon-Remastered-1.0/main"
G="$B/addons/kaykit_dungeon_remastered/Assets/gltf"
get() { [ -s "$2" ] || { echo "  $2"; curl -fsSL -o "$2" "$1/$2"; }; }
get "$B" LICENSE.txt
for f in wall wall_corner wall_gated wall_pillar wall_half wall_arched wall_cracked wall_broken wall_endcap \
  floor_tile_large floor_tile_small floor_tile_small_broken_A floor_tile_small_broken_B floor_tile_small_weeds_A \
  floor_tile_small_decorated floor_tile_large_rocks barrier barrier_column barrier_corner pillar pillar_decorated \
  barrel_large barrel_small_stack keg rubble_large rubble_half torch_mounted candle_triple banner_patternA_red \
  box_stacked crates_stacked shelf_small_candles table_medium_broken sword_shield_broken; do get "$G" "$f.gltf.glb"; done
for f in wall_doorway chest; do get "$G" "$f.glb"; done
echo "done → $(pwd)  (the cast for scale: tools/actor-lab/fetch-assets.sh)"
