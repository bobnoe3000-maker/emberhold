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
Every environment model but the undergrowth and the scatter's rocks (below) is **our own**:
buildings, trees, the bridge, the barrows' stones, mountains, the overland sites and all small
props are low-poly models authored in code
(`tools/actor-lab/buildkit.js`) and baked by `tools/actor-lab/bake-env.cjs`. No other third-party
environment assets remain. (Earlier prototypes used the CC0 KayKit Medieval Hexagon Pack;
it has been fully replaced.)

**The exception: the undergrowth and the rocks.** The undergrowth (`ug_*`: a flowering bush, a fern, a
plant, flowers, grasses, clover, a shelf fungus) and the scatter's rocks (`rock_F`, `rock_G`, `rock_H`) are
baked from **Stylized Nature MegaKit** by Quaternius (https://quaternius.com) — **CC0 1.0**. They're scaled
and colour-graded in the bake (`tools/actor-lab/env.json`).

## Fonts — `assets/fonts/`
**IM Fell English** (roman and italic) and **IM Fell English SC** by Igino Marini
(https://iginomarini.com) — **SIL Open Font License 1.1** (`assets/fonts/OFL.txt`). The Latin
subsets, as woff2, are vendored so the game loads no fonts from a CDN (architecture A12). Used by
the loading screen, the intro and the title.

## Sound — `assets/audio/`
The game's sound effects and ambient loops come from **Flare** (https://flarerpg.org,
https://github.com/flareteam/flare-game, `mods/fantasycore/soundfx`), by the Flare team: Clint Bellanger,
Justin Jacobs, Stefan Beller and the contributors in Flare's `CREDITS.txt`, with sounds drawn from OpenGameArt
artists including rubberduck, Iwan "qubodup" Gabovitch and Ljudbank. They are licensed **CC-BY-SA 3.0**
(https://creativecommons.org/licenses/by-sa/3.0/).
- **What's used:**
  - goblin, skeleton, zombie, minotaur, wyvern and antlion cries;
  - male and female hurt and death sounds;
  - melee swings;
  - the shoot, fireball, freeze, shock, heal, shield, block, warcry and quake powers;
  - footsteps (cloth, leather, metal, echo);
  - level up, flying loot, coins, the wood door, stairs;
  - the river, cave droplets, cave wind, wind, bird, owl and open-fire loops.
- **Changes:**
  - trimmed, folded to mono and level-normalised;
  - the cave wind cut to 10 s, the wind to 8 s;
  - re-encoded as MP3 by `tools/audio/prep.mjs` (sources listed in `tools/audio/sounds.json`).
- **Licence of the copies:** the adapted files in `assets/audio/` are shared under the same licence, CC-BY-SA 3.0.
  The share-alike covers the sound files, not the game's code.
- **Synthesised in code** (`src/audio/engine.js`): the blows (filtered noise) and the crit's crack. These are ours.
