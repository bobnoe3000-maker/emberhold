#!/bin/sh
# fetch-env.sh — pull the KayKit Medieval Hexagon Pack (CC0) models used by the
# town / overland bake into ./models/env (gitignored). Only baked outputs ship.
set -e
cd "$(dirname "$0")" && mkdir -p models/env && cd models/env
HEX="https://raw.githubusercontent.com/KayKit-Game-Assets/KayKit-Medieval-Hexagon-Pack-1.0/main/addons/kaykit_medieval_hexagon_pack/Assets/gltf"
get() { [ -s "$2" ] || { curl -fsSL -o "$2" "$1/$2"; }; }
m() { get "$1" "$2.gltf"; get "$1" "$2.bin"; }
echo "buildings:"
for f in home_A home_B tavern blacksmith church market well windmill watermill barracks lumbermill tower_A tower_B tower_base castle mine archeryrange; do m "$HEX/buildings/red" "building_${f}_red"; done
get "$HEX/buildings/red" hexagons_medieval.png
for f in building_bridge_A building_bridge_B building_destroyed building_grain building_scaffolding building_dirt fence_wood_straight fence_wood_straight_gate fence_stone_straight fence_stone_straight_gate wall_straight wall_straight_gate wall_corner_A_outside wall_corner_A_gate; do m "$HEX/buildings/neutral" "$f"; done
echo "nature:"
for f in tree_single_A tree_single_B tree_single_A_cut trees_A_small trees_A_medium trees_A_large trees_B_small trees_B_medium trees_B_large rock_single_A rock_single_B rock_single_C rock_single_D rock_single_E hill_single_A hill_single_B hills_A_trees hills_B_trees hills_C_trees mountain_A_grass_trees mountain_B_grass_trees mountain_C_grass_trees mountain_A mountain_B waterlily_A waterlily_B waterplant_A waterplant_B; do m "$HEX/decoration/nature" "$f"; done
echo "props:"
for f in barrel crate_A_big crate_A_small crate_B_big crate_long_A sack tent wheelbarrow weaponrack bucket_water resource_lumber resource_stone pallet flag_red target ladder; do m "$HEX/decoration/props" "$f"; done
echo "done → $(pwd)"
