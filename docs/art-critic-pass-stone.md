# Critic pass: stone and mine (the dungeons' looks, track 4)

**Implemented** (2026-11-27). Items 6, 8, 9 and 11 of [dungeon-looks-plan.md](./dungeon-looks-plan.md), built on our own
assets as the plan's §2 asks: textures painted in `tools/render3d/world.js` at Luminati's density, pieces built in its
`buildTavern` batch, Luminati's own objects where it has the thing. Nothing about a fight changed (below).

| # | What | Kits |
|---|---|---|
| 6 | The Reedholm Undercroft its own: the reed town's brick vaults on the Haddow Crypt's plan | new `fenbrick`, `fenbones` |
| 8 | The Cold Seam a worked mine: the pithead the Deepdelvers', the warren the goblins' robbed dig | `pithead`, `warren` |
| 9 | The quota office a counting house, as a look other kits can point at | `quota` (the look `counting`) |
| 11 | Generated floors draw their own land's looks | `THEME_LOOK` → `LAND_LOOKS` |

## Code

- `src/sim/world.js`:
  - `DRESS`, `PLAN_OB`, `DOOR_LIGHT`, `PLAN_THEME`: `fenbrick` and `fenbones` the crypt's and the ossuary's, aliased;
  - recipes `rails`, `robbed_shoring`, `tipped_cart` (the Cold Seam), `desk_rows`, `strongbox` (the quota office);
  - pieces `rail` (flat, walked over), `cart_tipped`, `shoring_broken` (ORIENT), `clerk_desk` (ORIENT); `DRESS_CAP`
    `cart_tipped` 1, `clerk_desk` 8;
  - a flat dress piece no longer stands for a room's obstacle (the rails are no boulder).
- `src/sim/plans.js`: the Undercroft's rooms on `fenbrick` / `fenbones`; the new recipes in the Cold Seam's and the quota
  floor's rooms.
- `src/render3d/convert.js`:
  - legend `ж` (fen paviors), `б` (fen brick wall), `п` (the bone room's wall), `т` (the peat sill), `с` / `ч`
    (the counting house's wall and sill), `к` / `л` (its flags, clean and scuffed);
  - `KIT_LOOK.fenbrick`, `fenbones`, `counting` (and `quota` pointing at it), `FEN_FILL`, `COUNT_FILL`;
  - `WALL_STYLE` `fencrypt`, `fenossuary`, `counting`; `cryptRun` takes a story (`FEN_STORY`: eel traps and nets among
    the shelves); `countingRun`; `fenMats`;
  - `MINE_3D` (shoring sets, carts, hook lamps, ladders, spoil, the roof's fall) and `railRuns`; `COUNT_3D` (the clerks'
    desks and their chains, the cool lamps, the strongbox, the dressed piers);
  - `LAND_LOOKS`, `landLook`, `plainLook` (item 11);
  - `AMB_TINT` pithead and warren a step up.
- `tools/render3d/world.js`: textures `fen_brick`, `fen_lime`, `fen_top`, `fen_paver`, `fen_peat`, `fen_peat_top`,
  `fen_bones`, `reed_mat`, `count_wall`, `count_sill`, `count_top`, `count_flag`, `count_flag_worn`; pieces `eeltraps`,
  `nets`, `reedmat`, `shoringset`, `rails`, `orecart`, `hooklamp`, `mladder`, `minerock`, `fallenprop`, `ccornice`,
  `wainscot`, `cpillar`, `cpilaster`, `clamp`, `clampstand`, `tally`, `quotaboard`, `cbook`, `chainring`, `strongbox`;
  the crypt's arcade pieces built in fen brick through a renaming builder (`fenB`, `FEN_MAT`).
- `src/main.js`: `?dev&seed=N` (localhost, with a preview's `?scene=`): a fresh world on that seed, for the Mere Tower's
  other draws.
- `tools/capture/visibility.mjs`: maps `seam-f1`, `seam-f2`, `assay-f2`, `undercroft`.
- `test/stone.test.mjs`; `test/sidevaults.test.mjs`, `test/render3d.test.mjs` updated.

## Captures

Every room the kits touch, at dusk, 390 × 844, dpr 1, from the game's camera (`tools/capture/rig.mjs` with a shots file;
the before from a checkout of `ed8a263`), and three Mere Tower draws (`?seed=11, 12, 22`, its landing and its hall).
Sheets (`tools/capture/pairs.mjs`, kept out of the repo): `sheet-undercroft.jpg`, `sheet-coldseam.jpg`,
`sheet-quota.jpg`, `sheet-tower.jpg`.

## Critic rounds

Scored as an art director would, 1 to 10, for how the room reads as *its place* at play scale on a phone.

### The Reedholm Undercroft (`fenbrick`, `fenbones`)

Brief: the reed town's brick vaults, narrow dark-red fen brick lime-washed in patches, peat-cut walls, reed matting,
eel traps and nets hung in the bays, the ledger stones kept, candles warm against a damp cold fill.

| Round | Score | Note | Fix |
|---|---|---|---|
| before | 3 | The Haddow Crypt room for room: pale limestone, a Vale wool family's vault. Well made, the wrong town. | |
| 1 | 6 | The brick arcade and its lime dressings read at once, and so does the herringbone. But the floor is dark red, and the cult's maroon robes are lost on it. The reed mats run the room's length as two yellow roads. | Paviors a step lighter and browner; mats a few units long, gaps between, dimmer, each its own tone. |
| 2 | 7 | Figures hold their outline. The bays still read empty: the traps and nets hang at the bay's foot, behind the candles. | Traps and nets hung from the arch's spring; wicker lifted. |
| 4 | 8 | Three wicker bottles in a bay, a tarred net with its corks, loculi and tablets between. The near sills in peat frame the cutaway darkly. The bone room's skulls are packed in peat, not the crypt's mortar. Reads as an undercroft in a fen town. | |

### The Cold Seam (`pithead`, `warren`)

Brief: timber shoring sets along the galleries, rails with ore carts, ladders, lamps on hooks, spoil heaps. The pithead
is the Deepdelvers' worked mine; the warren is the goblins' raw dig, its shoring broken and robbed, a cart on its side.

| Round | Score | Note | Fix |
|---|---|---|---|
| before | 3 | Plain dirt and crag under lamps: a cave, not a mine. | |
| 1 | 4 | The rails read at once, iron on sleepers down the gallery. The shoring sets stand black on black rock: their lagging reads as an iron fence. | Timber lit; a lamp on the cap of every other set, with its light. |
| 3 | 5 | The shaft head and the winding room read as timbered (props, cap, lagging, lamps). The warren's robbed sets are lost. Its char patches are a checker of black holes. | The Seam's fill a step up; the warren's char fewer (mix 9); the knocked-out prop left lying against its neighbour. |
| 5 | 6.5 | The timber is weathered pale. The sets now stand along the back walls of every gallery, the burrow hall's broken. Rails, a cart on them, hook lamps. The warren is still dark: it is the goblins' hole, lit by their fires. | |

### The quota office (`quota`, the look `counting`)

Brief: dressed pale stone walls lined with ledger shelves, the clerks' desks in rows chained to rings in the floor, tally
boards on the walls, a strongbox, the clerk's cool lamp. A look other kits reuse.

| Round | Score | Note | Fix |
|---|---|---|---|
| before | 2 | The Barrows' gallery stone under navy: nothing says *office*. | |
| 1 | 5 | It is a counting house: shelves of ledgers, desks, a tally board. But at the crypt's fill it is a lit ward, flat grey. The second book on the Weighmaster's desk glows violet. | Fill two steps down; flags darker and warmer; the cool lamp a whiter white; the book oxblood. |
| 2 | 6.5 | The lamps' pools lead now. The cellars are dug, so their walls come in short runs, and half of them stand bare. The office's pillars are the dungeons' black basalt. | A short run takes a press of ledgers or a tally board; the pillars dressed piers of its own stone. |
| 4 | 7.5 | The walls are lined floor to cornice; there are rows of chained desks and cool lamps on stands. Reads as the Assay's books kept underground. The visibility rule found a pier hiding the cage store's middle: the piers are now a man's height and slim. | |

### Generated floors (item 11)

| Round | Score | Note | Fix |
|---|---|---|---|
| before | 3 | The Mere Tower is in the Fens and drew Wickham Keep's barracks: cobbles and Vale brick. | |
| 1 | 5 | Its land's looks now, the locks' wet blue-grey flags or the abbey's pale cloister stone. Vat Seven's sick green came up for a third of the seeds, and a tower in it read as a cesspit. FNV's low bit followed the seed's last digit, so neighbouring seeds alternated. | Vats only where the theme is poison; the pick from the hash's high bits. |
| 2 | 5.5 | Locks or abbey, picked by the floor's seed and stepped on by its depth. The locks' walls are still the Vale's stone brick. When the water track gives the locks their own stone, the tower follows (it takes the kit's stone, `plainLook`). | |

## Perf

Draws and triangles in one drawn frame, counted at the WebGL context in the rig's frame (every pass), the same room,
before (`ed8a263`) and after:

| Room | Draws | Triangles |
|---|---|---|
| Undercroft, copy room | 111 → 84 | 268 k → 269 k |
| Undercroft, bone room | 104 → 108 | 278 k → 282 k |
| Undercroft, fair copy | 122 → 128 | 320 k → 333 k |
| Cold Seam, shaft head | 116 → 94 | 224 k → 234 k |
| Cold Seam, long gallery | 107 → 88 | 224 k → 233 k |
| Cold Seam, burrow hall | 108 → 113 | 262 k → 267 k |
| Cold Seam, tally cave | 130 → 128 | 245 k → 223 k |
| Assay, ledger room | 101 → 96 | 204 k → 208 k |
| Assay, quota office | 95 → 98 | 220 k → 223 k |

Every room is within 5 % more draws, most fewer. A first build drew a third more in the burrow hall (108 → 142) and the
quota office (95 → 131): a Luminati rock for each spoil heap, and the office's own leather, plank and brass materials.
The heaps' rock is now in the mine's batch, and the office's pieces use the batch's oak and iron, tinted.

Lights stay within Luminati's shared twelve:
- the shoring lamps are on every other set;
- the clerks' cool lamps are on every other pilaster, every other one lit.

## Balance

`node tools/balance/boss.mjs`, three seeds each, before (`--src` `ed8a263`) and after: identical to the second and the
percent.

| Fight | Time (s) | Lowest HP | Downs |
|---|---|---|---|
| The Foreman (the tally cave), party L21 | 76 / 76 / 80 | 68 / 58 / 51 % | 0 |
| The Foreman, party L22 | 68 / 69 / 78 | 66 / 61 / 56 % | 0 |
| The Weighmaster (the quota office), party L25 | 77 / 81 / 80 | 57 / 65 / 54 % | 0 |
| The Weighmaster, party L26 | 74 / 71 / 70 | 69 / 59 / 63 % | 0 |

The Undercroft's floor, props and pools are identical to `ed8a263` on every seed tried (`createWorld` diffed). The
Undercroft's dressing is the crypt's, aliased.

The rules:
- `dress-audit.mjs` (cold_seam, assay_yards, reedholm_undercroft): 25 rooms, 0 over a cap.
- `--clear`: 25 floors, 0 pieces where §4.4 says no.
- `visibility.mjs seam-f1 seam-f2 assay-f2 undercroft`: 31 subjects, 0 under half in view.

## Left for later

- The Cold Seam's warren stays the darkest place in the Reach by design (the goblins' fires light it). Its robbed timber
  reads at the burrow hall's back wall but little in the tally cave, whose walls are far from its middle.
- Generated floors take a kit's stone and light, not its set pieces. An endless descent through every land's looks needs
  a site whose region changes with depth, which no site has yet.
