#!/bin/sh
# fetch-assets.sh — pull the KayKit CC0 character packs into ./models (gitignored).
# ~40 MB of glTF; nothing here is committed, only baked outputs ever ship.
set -e
cd "$(dirname "$0")" && mkdir -p models && cd models
ADV="https://raw.githubusercontent.com/KayKit-Game-Assets/KayKit-Character-Pack-Adventures-1.0/main/addons/kaykit_character_pack_adventures"
SKL="https://raw.githubusercontent.com/KayKit-Game-Assets/KayKit-Character-Pack-Skeletons-1.0/main/addons/kaykit_character_pack_skeletons"
get() { [ -s "$2" ] || { echo "  $2"; curl -fsSL -o "$2" "$1/$2"; }; }
echo "heroes:";  for f in Knight Barbarian Rogue Rogue_Hooded Mage; do get "$ADV/Characters/gltf" "$f.glb"; done
echo "undead:";  for f in Skeleton_Warrior Skeleton_Minion Skeleton_Rogue Skeleton_Mage; do get "$SKL/Characters/gltf" "$f.glb"; done
echo "undead weapons:"
for f in Skeleton_Blade Skeleton_Shield_Small_A Skeleton_Staff Skeleton_Axe Skeleton_Crossbow; do get "$SKL/Assets/gltf" "$f.gltf"; get "$SKL/Assets/gltf" "$f.bin"; done
get "$SKL/Assets/gltf" skeleton_texture.png
echo "done → $(pwd)"
