# Critic pass: the Magma Vault's dressing

**Implemented** (2026-11-26). The owner: *"The magma vault dungeon needs more dressing.. flowing magma and a few
furnaces, anvils, and other appropriate dressing"*. The sim places four new kinds on the Cinderworks' second floor
(`src/sim/world.js` `DRESS_PIECES`; the recipes `magma_channel`, `magma_pool`, `furnaces`, `anvils` in `plans.js`):
- `magma`: one tile each, impassable, in runs along a back wall's foot and a 7-tile pool in a near corner;
- `furnace`: a big piece, 3 wide × 2 deep of `block` behind it, against the back wall;
- `crucible`: one beside each furnace;
- `anvil`: low, in the floor's thirds.

The rooms are the Stair into the Heat (`vault`), the Furnace Hall (`works`), the Casting Floor and Furnace Nine
(`vault`). What the sim places, by room:
- the stair: 18 magma;
- the furnace hall: 2 furnaces, 2 crucibles, 3 anvils;
- the casting floor: 27 magma, 2 furnaces, 2 crucibles, 3 anvils;
- Furnace Nine: 15 magma (an 8-tile channel and the pool), 2 furnaces, 2 crucibles, 3 anvils.

Code:
- `src/render3d/convert.js`: `MAGMA_3D` (furnace, crucible, anvil), `magmaFlow`, `MAGMA_LIGHT`.
- `tools/render3d/world.js`: `buildMagma` (placeEnv `magma`), `magmaMats` and `magmaT`, the frame's clock.
- `tools/actor-lab/buildkit.js`: `magmafurnace`, `magmacrucible`, `magmaanvil`.
- `town.json` (reach): `reach_furnace`, `reach_furnacex`, `reach_crucible`, `reach_anvil`, `reach_anvilx`, all
  `nofoot`, baked as cards (`bake-env.cjs --sets town-reach`; `src/sim/envfoot.js` byte for byte the same).
- The bundle is rebuilt.

Captures, under `tools/capture/out/magma-vault/`:
- `before-after.png`: the rig at dpr 1 from the game's camera, in a fight, before and after;
- `rooms-stage.png`: each room whole on the Stage, the sim held still, dpr 2;
- `details.png`: the furnaces, crucibles and channel, the pool, and the anvils.

## Before

None of the four kinds had a drawer, so the floor drew nothing for them: the Stair and Furnace Nine were the vault's
cracked basalt, the Furnace Hall a dark cobbled hall with two braziers.

## What it is

**The magma** (`buildMagma`):
- Every magma tile of the floor is one mesh, laid just over the floor. Luminati's floor is a solid block two of our tiles
  a side, so a channel one of ours wide can't be cut into it.
- Each tile is a 4 × 4 grid. Every vertex knows how far it is from an open side, so the crust gathers at the banks and
  a run of tiles is one channel, not a row of squares.
- The surface is unlit: it is the light. Two layers of value noise in world space drift different ways over the frame's
  clock, banded into black crust, dark red, orange and a yellow-white only in the cracks between the plates.
- A low kerb of black rock stands along every open side.
- One draw for the surface and one for the kerb, whatever the count.
- In the converter a hot light stands every 12 tiles of a run, with embers off it on alternate lights.

**A furnace** (`magmafurnace`, over the sim's 3 × 2 footprint, facing the way its back row says, +z or +x):
- a squat smelting furnace of dark firebrick bound in iron, its arched mouth glowing white-orange from inside;
- a slag-crusted sill, a hood of rusted sheet iron narrowing into a brick flue that climbs the wall, a pair of bellows
  at its side;
- at its mouth Luminati's embers, one orange light, and sparks going up into the hood.

**A crucible** (`magmacrucible`): a fireclay crucible tipped in an iron cradle, the melt red-orange with a skin of
slag over half of it, a ladle's shank across, a spill gone dull on the floor.

**An anvil** (`magmaanvil`): a dark anvil with its horn on an elm stump, a bar of iron hot on its face (unlit: what
reads it in the dark), tongs on it, a hammer stood by.

## Findings and fixes

1. **The magma was hidden** (round 1): sunk a tenth under the floor, it lay inside the floor's solid block, and its
   cells were half a tile off. Fixed: laid on the floor at their tiles' middles, with a kerb.
2. **A neon tube** (round 2): one flat yellow-white band down the wall, bloomed, with no surface in it. Fixed: cooler
   bands, plates of crust drifting on it, the bright only in the cracks, and the noise finer (3.2 a unit).
3. **The anvils were unseen**: Luminati's smith's anvil (The Bells of Evermere's) stood unlit at the floor's thirds,
   dark iron on dark basalt. Fixed: our own anvil, with a hot bar on its face. It needs no light of its own and no
   season kit downloaded.
4. **The crucible read as a lamp** (rounds 1 and 2): a small pot on a post, a pale disc of melt like a lampshade.
   Fixed: a big pot tipped in a low cradle, the melt red-orange and half crusted.
5. **The furnaces read as ovens** in the big caves (round 3): a figure's height, their black iron hood lost on the black
   wall. Fixed: half a figure taller, the hood rusted sheet against the wall, the flue up it.

## The light budget

The rooms already have their braziers (5 to 6 each) and wall torches (2 to 3). Added point lights, by room:
- the stair: 2 (the channel);
- the furnace hall: 2 (a furnace each);
- the casting floor: 4 (2 furnaces, 2 along the channel);
- Furnace Nine: 4 (2 furnaces, the channel, the pool).

Before `MAGMA_LIGHT` went from 9 to 12, the casting floor had 5. Luminati keeps the dozen nearest the camera, so in any
frame a room's own furnaces and braziers lead. The magma and the crucibles' melt are unlit and cost no lights, and
neither do the anvils' bars. Frame cost was not measured on a phone.

## Left

- The channel is one tile wide, as the sim lays it. From the camera it is a narrow bright seam at the wall's foot, not
  a river. A wider flow would need the sim to lay two tiles.
- The Furnace Hall (`works`) stays dark between its two furnaces, which stand at its ends. Its look is the works kit's.
