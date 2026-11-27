# Water indoors: a kit doc

*2026-11-27 · **Implemented** ([dungeon-looks-plan.md](./dungeon-looks-plan.md) track 2, items 3–5). The critic rounds
and the numbers: [art-critic-pass-water.md](./art-critic-pass-water.md).*

One way of drawing water inside a dungeon's walls, for any kit. The docks kit ([docks-dungeon.md](./docks-dungeon.md))
draws open water past its decks, in the open air; this is water standing on a floor and running in channels cut through
it, under walls. It's used in three places: the Canal Locks, the Drowned Abbey and the Sunken Chapel's nave. The
Tidemark's sea cave is next.

## 1. Two kinds of water

| | Shin-deep water | A deep channel |
|---|---|---|
| In the sim | the floor's pools (`world.pools`), walked in | `channel` tiles (`DRESS_PIECES`), blocked as the magma is |
| Authored by (a room's `dress` in `plans.js`) | `pools` (a few pools, as before), `sickpools` (the same draws, each pool twice the size) or `flood` (the room's whole floor); `windows` (drawn only: cold window light high on the back wall, caught on the water) | `canal` (back wall, 4 wide), `canal_near` (near wall, 4 wide), `drain` (near wall, 2 wide), `pond` (a 6 × 4 pool in a back corner) |
| Its set pieces | | `lock_gates` (two `lockgate` bands across the channel, a windlass on the bank by each), `sluices` (two `sluice` bands, the same) |
| Where a way crosses it | | the channel stops; the floor between two runs is a bridge (`world.bridges`: plain floor to the sim) |
| Drawn (convert.js `wetGround`, world.js) | a sheet a hand (`WET_SHEET`, 0.075) over the floor: `buildShallows` | the tile sunk to the bed, Luminati's own water over it at `WET_WL` (0.62, the floor's top at 1) |

**Everything in the sim is deterministic and draws nothing from a stream.** `waterway` (sim/world.js) lays a channel by
the room's box and its doorways only. `flood` adds the room's floor to `world.pools` after the pools' own draws, so no
other room's pools move. Its rules:
- A channel lies on even tiles in whole pairs. convert.js lays one Luminati tile over two of ours each way, from an
  even tile, so every channel tile of ours is a whole sunk tile of Luminati's (`stats.deepPartial` counts any that
  aren't; the test holds it at 0).
- A doorway's reach (the 6.5 tiles `putAt` keeps clear) keeps its columns dry. A dry stretch between two runs is a
  bridge.
- A channel is never in a doorway's mouth or on the stairs. The keep-clear rules hold (`dress-audit.mjs --clear`), and
  `keepTheWaysOpen` drains one that shuts a way, as it would any piece.
- A room with deep water keeps its picks (a chest, a shrine) off the channel. A room without it picks exactly as
  before.
- There are no shards (`resourceAt`) on a bridge.

## 2. The look (`KIT_LOOK`)

A kit opts in with flags, set in one place (convert.js, after the Fens' kits):

| Flag | What it does |
|---|---|
| `wet: 'canal' \| 'sick' \| 'abbey' \| 'chapel'` | names the water (world.js `WET_LOOKS`): the sheet's tint, opacity, ripple, gloss and scum, the sky in a garth, and the channels' four bands of deep water (`wetAir`) |
| `bank: '<letter>'` | the letter a floor tile takes beside a channel: its kit's floor over walling down into the water |
| `garth: '<letter>'` | the floor of a room whose `dress` has `garth`: open to the sky (the drowned turf, a cold light from high up, a drizzle falling into it alone, the sky in its water) |

Today's kits:

```js
Object.assign(KIT_LOOK.locks, { wall: 'α', cave: 'α', wet: 'canal', bank: 'ε' });
Object.assign(KIT_LOOK.vats,  { wall: 'α', cave: 'α', wet: 'sick',  bank: 'ζ' });
Object.assign(KIT_LOOK.abbey, { wall: 'β', cave: 'β', wet: 'abbey', bank: 'η', garth: 'θ' });
Object.assign(KIT_LOOK.nave,  { wet: 'chapel' });
```

**Legend letters** (convert.js `LEGEND`): `α` the Fens' lock ashlar walls (`fen_wall`), `β` the abbey's (`abbey_wall`),
`γ` a channel's deep water (sunk, `water: true`), `ε` `ζ` `η` the banks (wet flags, sick flags, abbey flags over their
walling), `θ` the garth's drowned turf. A bridge is the wharf's deck, `_`.

**Textures** (world.js, painted in the dungeons' hand):
- `fen_wall`, `abbey_wall`: ashlar six units high (px 48 × 96), so that on Luminati's world-aligned side faces
  (`v = y / units`) the waterline falls at one world height on every wall. The Locks' line is at 1.7, the Abbey's at
  1.95 (the floor's top at 1). Over the line is a crust of lime, then the mark itself, then wet green stone with weed
  hanging in strands that thicken below the floor's top. That part shows only in a channel. (`waterlined`, `FEN_WL`,
  `ABBEY_WL`.)
- `fen_cap`: the channel's coping.
- `drowned_turf`: the garth.

## 3. How it's drawn

- **The sheet** (`buildShallows`) is one mesh and one draw for each look on a floor. It has a quad for every wet tile of
  ours. It's a `MeshStandardMaterial`, transparent, softly glossy (roughness about 0.3), with no depth write, at
  `renderOrder` 1:
  - **Its tint**: a clear blue-green (Vat Seven's a sickly yellow-green), part of it its own light (`self`), so the floor
    is plainly under water even in a dark room.
  - **The lamps' reflections**: under each lamp near the water (convert.js `wetLamps`, up to 24) a long soft warm streak.
    It sits where the lamp's reflection falls: the lamp mirrored in the water's plane, the line from the eye to it, found
    each fragment from the camera. It is drawn toward the eye and shaken along its length by the ripples.
  - **Ripples**: the normal is perturbed by two drifting layers of value noise. The specular is capped (`min 0.4`).
  - **The walls behind it**, away from the camera, are reflected as a faint cool pallor along their feet. convert.js
    gives each cell how near that wall is.
  - **Its waterline** is a soft bright line where it meets a wall or dry floor (bits of each cell's corners). Against dry
    floor its edge fades out; against a wall, a channel or a piece the water runs right up.
  - **Scum** (Vat Seven's, and the garth's duckweed) drifts in matt patches.
  - **Figures and fights**: the figures' feet go 0.075 under the sheet. The rings, the warnings, the hazards and the
    Abbess's flood are at `renderOrder` 2 and write no depth, so they draw over it unchanged.
- **The channels** are Luminati's water (`Water.js`) over the sunk tiles, at the level's `waterLevel` (0.62, 0.38 under
  the floor). `wetAir` gives it its look's dark colours, still, with no glint or foam, and a low `reflect` (the backdrop
  it would reflect is black). The far side, the wall or the bank to its north or west, is reflected in it: a pale strip
  fading toward the camera (`wrefl`, `renderOrder` 11, over Luminati's water at 10).
- **The trim** (`buildWetTrim`) is in two materials, the stone and the timber, the iron tinted on the stone. None of it
  casts a shadow (that pass was half its draws):
  - `wkerb`: a pale coping proud of the floor along a bank, its wet face down to the water, weed at the waterline;
  - `wrail`: a bridge's posts, rails and edge board along each side open to the water;
  - `lockgate`: two big oak leaves a metre over the floor, mitred across the channel, with uprights and iron straps, a
    walk and a rail on top, a winch wheel on each leaf, and a balance beam out over each bank (`ends`: the sides that
    meet a bank, not a wall);
  - `sluice`: two stone piers, a lintel, the board raised a little, a big spoked winch wheel on top.
- **A near wall** (south or east of the water, with no room on its camera side) is cut flush with the floor, a quay's
  edge, so the water and its gates are seen over it.

## 4. Using it for a new kit

1. In convert.js, give the kit `wet` (add a `WET_LOOKS` entry in world.js if its water is new) and a `bank` letter if
   it has channels.
2. In plans.js, give the rooms `flood` or `pools` for shin-deep water, and `canal` / `canal_near` / `drain` / `pond`
   (with `lock_gates` / `sluices`) for deep water. List the deep water first in a room's `dress`, so the channel claims
   its tiles before the furniture does.
3. Run `node tools/dungeon/dress-audit.mjs <site>` and `--clear`, and `node --test test/water.test.mjs`. Measure any
   boss hall the channel touches with `tools/balance/boss.mjs`.
4. Capture it (`tools/capture/rig.mjs` with `at: 'part:<room>'`) and look at it at play's size.

Lights: the sheet adds none (it shows the room's). A garth adds one cold light and a drizzle emitter.
