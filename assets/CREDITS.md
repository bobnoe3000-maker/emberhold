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

The cleric (`hero_cleric`) is the KayKit Mage with its robe, trim, stole and book swatches
repainted (off-white vestments) and a flanged mace that is **our own**, built in code
(`tools/actor-lab/props.js`); the same mace is the item icon `assets/items/mace.png`.

Maudry Fenn (`npc_maudry`, the Tired Mule's keeper) is the KayKit Rogue with its dress and
collar swatches repainted mustard-brown, holding a pewter ale mug that is **our own**, built in
code (`tools/actor-lab/props.js`, variant `N1`).

**Faces** (art critic pass 4). The human heads are rebuilt by our face kit
(`tools/actor-lab/faces.js`): a bald skull stitched from the KayKit Knight's and Barbarian's head
meshes, KayKit's own hair and beard meshes where a face uses them, and eyes, brows, noses, mouths,
hair shells and marks that are **our own**, built in code. The window portraits
(`<actor>.face.png`) are lit renders of the same figures.

The earlier POC atlases (a Flare CC BY-SA 3.0 skeleton and the `isometric_hero`
knight) have been removed.

## Environment — `assets/env/`
Every environment model is **our own**: buildings, trees, the bridge, rocks, mountains, the
overland sites and all small props are low-poly models authored in code
(`tools/actor-lab/buildkit.js`) and baked by `tools/actor-lab/bake-env.cjs`. No third-party
environment assets remain. (Earlier prototypes used the CC0 KayKit Medieval Hexagon Pack;
it has been fully replaced.)

## Fonts — `assets/fonts/`
**IM Fell English** (roman and italic) and **IM Fell English SC** by Igino Marini
(https://iginomarini.com) — **SIL Open Font License 1.1** (`assets/fonts/OFL.txt`). The Latin
subsets, as woff2, are vendored so the game loads no fonts from a CDN (architecture A12). Used by
the loading screen, the intro and the title.
