# Art critic pass: the Cinder Reach

**Implemented** (2026-11-16): `src/render3d/convert.js` (the `ash` biome, the Reach's legend, its houses, works and
dungeon looks), `tools/render3d/world.js` (the Reach's textures, sky, grade, water, outer ground, dust and its kit
pieces) and the rebuilt `src/vendor/luminati-80e1aa6/`, `tools/actor-lab/buildkit.js` (the gate wheel, the stack, the
furnace hall, the pithead), `src/render3d/hybrid.js` (the Reach's brightness by the hour), `test/render3d.test.mjs`.

The owner, on the Reach plan ([reach-plan.md](./reach-plan.md)): *"Be sure to dress the overworld and dungeons to the
theme, run critic passes in the area."* The canon is [emberfall-world.md](./emberfall-world.md) §3.3:

> Black hills of slag west of the capital, and the imperial foundries in them. Someone has lit the furnaces again.

Ashgate is a hard mining town, walled in black slag brick, with a pithead wheel over its gate. The open ground is
ash-dusted scrub, cracked earth and red rock. There is the Ashwater, the Cinderworks' stacks among slag heaps, rust-red
tailings ponds, and a dead volcano over Kell's Rest.

## How it was measured

- **Shots at the game's camera, on a phone's frame** (390 × 844, DPR 1, `?dev&manual&world=on`, the hero placed at each
  place, 160 frames settled). The places: Ashgate's gate, the Cinderworks, the tailings, the Cold Seam, Kell's Rest,
  Ashgate's square. Each was shot by day, by dusk and by night, through the Cold Seam's two floors, and in a Fens
  dungeon for comparison. **Before** is the lead's set from this morning and a `git archive HEAD` copy served beside the
  working tree.
- **Mean luminance, saturation and colour** of the world band: y 70–540 and x 0–330, under the top bar, over the
  cards, and clear of the buttons.
- **Draws and triangles a frame**, counted at the WebGL context (every pass, shadows and post included; figperf.mjs's
  counter), averaged over four frames at each shot.
- **The textures** were painted headless (Luminati's `TextureLibrary` under node) into swatch sheets before they went in.

Six rounds of shots in all: before, round 1, then four more. The critique below is ranked.

## Before: what was wrong (ranked)

![Before (top) and after (bottom), by day: Ashgate's gate, the Cinderworks, the Cold Seam, Kell's Rest, Ashgate's square](img/reach/day-before-after.jpg)

1. **The ground was the Sahara.** The Reach drew in Luminati's `desert` biome: arid dirt, dry grass, cracked earth and
   red sand, all orange-yellow. The world band's mean colour was rgb 174,134,90 at the Cinderworks, saturation 0.48.
   Nothing said slag, ash or char.
2. **Every building was the same blue-slate cottage.** That covered Ashgate's square, Kell's Rest, the Assay Yards, and
   the Cinderworks as two cottages.
   - **Why the kit's `reach` style never showed:** convert.js sends every house-like piece (`_house_`, `_smith_`,
     `_tavern_` …) to Luminati's own house builder (`HOUSES`, `REGION_LOOK.reach`: stone brick and blue slate). It
     raises the walls, towers and gatehouses as stone terrain. The buildkit's `reach` pieces (town.json) are only ever
     the baked cards, and those show under `?landmarks=sprites` alone.
   - **The Cinderworks' "stacks"** were two `reach_tower_1` raised as 4 × 4-tile blocks.
   - **The Cold Seam was the Vale's mine**, `mine_0`: a mossy green outcrop.
   - **There was no wheel over the gate.**
3. **The Ashwater was a clear mountain blue,** Luminati's default water.
4. **The plants were wrong for the place.** Junipers stood green, rocks were orange `redrock` boulders, and the hills
   were red rock.
5. **Nothing was alive.** There was no smoke, no glow, no ash in the air. By night the Cinderworks was a blue scene
   (luminance 39, rgb 39,37,56).
6. **Dusk went deep red.** The tailings shot was rgb 107,37,49 at saturation 0.67, and the pond read purple. Ashgate's
   square at dusk was rgb 85,38,56.

## What changed

### The ground: the `ash` biome (convert.js `BIOMES.ash`, `BIOME_OF.reach`)

- **The open ground** is laid in broad patches of smooth value noise, not tile by tile. The patches run in order of
  value, light to dark: ash, scrub, cracked dark earth, char, cracked earth again, basalt. Each patch meets the next a
  step darker.
- **The scree patches** (`G.SCREE`) are cracked earth with iron-dark red rock in a third of them.
- **Roads** are cracked dark earth. The town's cobbles are charcoal. Banks are rust-stained mud.
- **The hills** are basalt, with basalt cliff sides.
- **Trees** are all dead wood.
- **Rocks** are black, and red only where the ground is red rock.
- **Six textures of our own** are registered in world.js and painted when a level names them:
  - `slag_brick`: black glassy brick in ash-grey mortar, with rust weeping and flecks of slag glass;
  - `roof_rust`: rust tile under soot;
  - `cinder_earth`, `cinder_cobble`, `rust_rock`, `ash_scrub` and `ash_drift`: Luminati's cracked earth, cobblestone,
    red rock, dry grass and ash repainted. Their relief is kept and their colour runs through a ramp by luminance.
- **Luminati's arid climate stays.** It brings its set-piece kit, the `ash`, `scorched` and `basalt` textures and the
  dust. Its sky, water, outer ground and dust are graded per level (below).

### Buildings and works

- **Ashgate's houses** (`REGION_LOOK.reach`) are slag brick under rust tile. One roof in four has gone to soot
  (`roof_charred`, its faint ember cracks). Some two-storey houses have a dark timber upper storey. The shrine and the
  forge are in soot-black stone (`charred_wall`).
- **The walls and towers** are raised in slag brick, topped with charcoal cobbles.
- **Four kit pieces of our own** (buildkit.js) stand in 3D on the sim's own footprints. They are registered in
  world.js `KIT`, not town.json, so no card is baked and `envfoot.js` is unchanged.
  - **`gatewheel`:** the pithead wheel over Ashgate's gate. A timber A-frame stands on the gatehouse's two towers, with
    the iron wheel over the way in, its rope, and a lantern. It shows in both the town and the overland.
  - **`stack`:** a furnace stack, 9.3 units high. It has a slag-brick plinth, a square taper with three iron bands, and
    the fire showing in its mouth and stoke-hole. Three stand: the Cinderworks' two and Furnace Nine's over the Magma
    Vault. Each has heavy soot smoke and sparks from its lip, and a nightly glow on every other stack.
  - **`works`:** the Cinderworks' furnace hall, in place of the smithy at `REACH.works`. A slag-brick hall under rust
    tile is open to its yard, where the furnace's mouth glows. It has its own stack, smoking, coal and an anvil, and an
    ember bed burning in the yard with its light.
  - **`pithead`:** the Cold Seam, in place of `mine_0`. A timber headframe over the shaft has the winding wheel at its
    top. Beside it stands the engine house, with its stack and a rope to the wheel. Black spoil is heaped behind. The
    shaft-house door is on +z, where the Vale mine's adit was. Rails and an ore cart run out of it.
- **The dead beacon towers** on the roads (round 2) are the kit's drum tower stood on the ground, not a raised slab.
- **Ember vents:** up to 24 small ember beds smoulder in the char, out in the open and off the roads. A third of them
  smoke. None has a light of its own.

### Air, water and light (world.js)

- **`ASH_KEYFRAMES`:** Luminati's arid 24 hours, greyed toward ash.
  - The sky is grey, its horizon a dirty ochre.
  - The sun is a little weaker and whiter.
  - The air is thicker: 1.1 × the arid fog.
  - At dusk the sun is a smoky amber, not `#ff7040`, and the shade is grey, not violet.
  - By night the fill and the moon are slate, not the arid sky's saturated blue.
- **`REACH_GRADE`:** saturation 0.86, contrast 1.05.
- **Brightness:** the Reach's exposure follows the game's brightness by the hour (`gradeByHour`). Before, only the
  Vale's did. `hybrid.js` `REACH_BRIGHT`: on the overland dusk ×1.08 and night ×2.3; in the town dusk ×1.05 and night
  ×1.35.
- **The Ashwater is murky.** Rust silt in the shallows, slate in the deep, the crests and foam grey-brown.
- **The land past the map's edge** is cracked dark earth, not orange dirt.
- **The camera's dust motes** are ash grey, not the desert's gold.

### Dungeons (convert.js `KIT_LOOK`, `THEME_LOOK`, `AMB_TINT`)

| Kit / theme | Floor | Walls | Fill |
|---|---|---|---|
| `pithead` (the Cold Seam, floor 1) | packed earth, rock | the Deepdelvers' cut stone (`W`); dug rooms raw earth | warm lamplight |
| `warren` (floor 2; also the Scrag Warren's theme) | dirt, cracked dark earth | raw earth | warm |
| `ember` (the Cinderworks) | rock, char | slag brick | hot |
| `lava` (the Magma Vault) | rock, basalt | basalt | hotter |

Before, the Cold Seam fell to `THEME_LOOK.cave`, the Wickham cellar's mossy stone.

![By dusk and by night, before (top) and after (bottom): the tailings, Ashgate's square at dusk, the Cinderworks by night, Ashgate's square by night](img/reach/dusk-night-before-after.jpg)

## The rounds

![The Cinderworks and the Cold Seam: round 1, round 2 and final](img/reach/rounds.jpg)

### Round 1

The `desert` biome was swapped for `ash`, with the houses, the four kit pieces, the sky, the water and the dust.

**Critique:**
- The idea read at once: a soot-dark land with rust roofs and a wheel on the gate.
- Two things were the loudest in the frame:
  - Luminati's red rock, orange and in blocky mosaics, in the scree patches;
  - its dry grass, bright yellow.
- The turf was chosen tile by tile with jitter, so white ash and black char met in a checkerboard.
- A road's beacon tower was a black 4 × 4 slab in front of the Cold Seam.
- Dusk was still red. Night was a saturated blue (luminance 23, saturation 0.78).

### Round 2

- `rust_rock` and `ash_scrub` (repainted dark).
- The red rock cut to a third of the scree, and rocks red only on it.
- The noise lattice widened, the jitter cut, and the patches set in order of value.
- Beacons became the kit's drum tower.
- The dusk sun amber, the night fill toward slate.

**Critique:**
- The ground is a land now: cracked dark earth, ash drifts, rust banks along a grey Ashwater. The hero reads on all of
  it (silver and red on charcoal).
- The tailings at dusk are a warm grey-brown (rgb 65,52,60), not red.
- Still wrong:
  - The ash drifts, near white, read as pale tiles.
  - The top of a day frame was milky with fog.
  - Night was still blue and dark (23).

### Round 3

- The fog 1.25 → 1.1.
- The night moon greyer.
- `REACH_BRIGHT`.
- The pithead's look.

**Critique:**
- The brightness did nothing, because world.js only applied the game's brightness on the Vale's grade. Fixed:
  `gradedReach`.
- The pithead in cinder earth under basalt walls went to black underground: luminance 15, rgb 8,15,38, its floor lost.
  Underground's dim violet fill needs mid-value stone, so the floor is now packed earth and rock and the walls cut
  stone (26, rgb 28,24,40, warm under its lanterns).

### Round 4

- `ash_drift`: the ash a step darker.
- Night 1.6 → 2.3 on the overland.

**Critique:**
- The ash patches blend now, with no mosaic.
- The day sits at 79–88, a little over the Vale's 75: the Reach is dark ground under a pale sky.
- The Cinderworks by night is 37 (the Vale overland's 48, the owner's 40), its furnace mouth and stacks the brightest
  things in the frame.

![The Cinderworks' stacks smoking; the Cold Seam: pithead before the round-3 fix, after, the warren; and a Fens dungeon (the Canal Locks) in the default look](img/reach/works-and-dungeons.jpg)

## Measured

**The world band:**

| Shot | Before: lum / sat / rgb | After: lum / sat / rgb |
|---|---|---|
| Ashgate's gate, day | 122 / 0.38 / 141,119,98 | 79 / 0.23 / 77,79,86 |
| The Cinderworks, day | 139 / 0.48 / 174,134,90 | 88 / 0.17 / 93,86,88 |
| The Cold Seam, day | 136 / 0.41 / 165,131,95 | 87 / 0.17 / 88,87,89 |
| Ashgate's square, day | 118 / 0.31 / 129,116,102 | 72 / 0.33 / 74,71,78 |
| The tailings, dusk | 53 / 0.67 / 107,37,49 | 53 / 0.40 / 62,49,58 |
| Ashgate's square, dusk | 50 / 0.62 / 85,38,56 | 47 / 0.44 / 56,44,52 |
| The Cinderworks, night | 39 / 0.53 / 39,37,56 | 37 / 0.64 / 49,32,50 |
| The Cold Seam's pithead, underground | (round 3) 15 / 0.93 / 8,15,38 | 26 / 0.70 / 28,24,40 |

**Draws and triangles a frame:** the phone budget, against the Fens (counted at the context).

| Shot | Before | After |
|---|---|---|
| Ashgate's gate | 240 / 454 k | 224 / 427 k |
| The Cinderworks | 161 / 711 k | 207 / 602 k |
| The Cinderworks, night | 176 / 725 k | 222 / 623 k |
| Ashgate's square (day / dusk) | 279 / 510 k | 400 / 602 k (dusk 417 / 597 k) |
| The Cold Seam's pithead (floor 1) | — | 136 / 289 k |
| *The Fens' overland* | *297 / 808 k* | |
| *Saltmere's square* | *493 / 622 k* | |

- **The Cinderworks** gains 46 draws: three stacks, the hall, their smoke and sparks, the vents. Its triangles fall, as
  the junipers and boulders go.
- **Ashgate's square** varies with who is in the square at the moment shot: 276 / 494 k in round 1's daytime shot, 400
  in the final one. It stays under Saltmere's 493.
- No Reach shot is over the Fens' numbers.

## Not done, and asked of others

- **The sim's Ashgate town scene** is the generic town's outskirts: oaks, groves, a farm, sheep, hens, wheat,
  pumpkins, hay.
  - The trees draw as dead wood. Wheat and pumpkins are not drawn in the Reach.
  - The farm, the sheep, the hens and the haystacks remain. They are the lead's (`outdoor.js`).
- **`buildReach`** could name its stacks (`reach_stack_N`): convert.js already takes any `_stack_` id as a stack. Today
  they are found as towers within 16 tiles of `REACH.works` or `REACH.vault`. It could also give the works more slag
  heaps. These are listed in the report to the lead.
- **No baked cards** for the four new pieces: `?landmarks=sprites` leaves them out.
- **The Fens' dungeons are unstyled.** Their kits (`mound`, `locks`, `vats`, `abbey`) and themes (`mire`, `sluice`,
  `water`, `poison`) have no `KIT_LOOK` or `THEME_LOOK`. Every Fens floor draws in `DEFAULT_LOOK`: stone tiles with a
  moss scatter, `moss_stone` / cliff walls, hour 19.4. Only the ambient fill differs, through palette.js `KIT_TINT`.
  Confirmed in play (the Canal Locks, above). Fixed since: [art-critic-pass-fens-dungeons.md](./art-critic-pass-fens-dungeons.md).
- **Night** is still a slate-blue scene with orange points, as every land's is.

## Round 5: the light by the hour (the owner, from the phone)

> "Cinder reach is too dark at dawn.. check other times too"

The rounds before measured each part of the day at its middle only, and two of their gate shots were taken during the
fade-in after a trip (the arrival banner over a dimmed frame). Measured again across the whole day, sixteen points from
dawn breaking, after another shot on the same land (tools/capture/rig.mjs, `tod` 0 … 15⁄16, world-band luminance):
the open land outside Ashgate's gate sat at 24–28 through dawn and 10–18 from dusk to the small hours, against the
Vale's 39–68 and 42–53. Two causes: the ground's ramps were near charcoal (the cinder earth's lightest #6c5f53, most of
it #2x–#3x, a third of the Vale's grass), and the hour's brightness lifted only the Reach's night.

- **The ground lifted toward a mid ash** (world.js `LIFT`: ×1.55 and a fifth of the way to #8e877c), the slag brick left
  dark so the town still stands black on it; the sun and the ground's bounce less taken away in the ash sky.
- **The hour's brightness** (hybrid.js `REACH_BRIGHT`, dawn · day · dusk · night): overland 1 · 1 · 1.08 · 2.3 →
  1.2 · 0.68 · 1.12 · 2.6 (noon 0.78 → 0.68 after the Cold Seam's shots: the open ash went milky at 100; now 65–92); Ashgate 1 · 1 · 1.05 · 1.35 → 1.2 · 0.9 · 1.25 · 1.35.

| sample (of 16) | 0 dawn breaking | 2 | 5 noon | 9 dusk | 13 night |
|---|---|---|---|---|---|
| the Vale | 39 | 63 | 84 | 53 | 48 |
| outside Ashgate's gate | 31 | 60 | 76 | 41 | 35 |
| the Cinderworks | 39 | 76 | 95 | 62 | 44 |
| the Cold Seam's pithead | 32 | 77 | 100 | 66 | 37 |
| Ashgate's square | 47 | 67 | 84 | 50 | 49 |

![The Reach by the hour, after](img/reach/hours-after.jpg)

## Part 2: the rest of the Reach (the build sheet, docs/reach-plan.md)

The owner, on the build sheet: *"do all of this"*. The Reach's other three bands and its secret have plan kits:
- `yards` and `quota` (the Assay Yards);
- `forge` and `deepforge` (the Forgehall of Oruth);
- `works` and `vault` (the Cinderworks and its Magma Vault);
- `strongroom` (the Ninth Vault).

They had no looks: each fell to the default's grey tiles and moss, or to a theme's (`ember`, `desert`, `chasm`). Their
doors on the overland were other lands' pieces:
- the Yards a generic longhouse;
- the Forgehall a castle keep (`reach_keep_1`);
- the Ninth Vault the Vale's chapel ruin;
- the Magma Vault's mouth the Old Barrows' mound.

Measured as before: phone frame, the first fighting room of each floor, world-band luminance, draws at the context.
**Before** is a copy of the working tree served beside it, taken before this part's changes. Three rounds.

### What changed

**Dungeon looks** (convert.js `KIT_LOOK`, `AMB_TINT`; textures in world.js). A `mix` is the share of the second tile.
`vents` are ember beds along the walls, a glow and a wisp each, with no light of their own.

| Kit | Floor | Walls | Fill |
|---|---|---|---|
| `yards` | mid warm-grey cobbles (`dun_cobble`), cracked earth | slag brick | a day's work light |
| `quota` | dressed flags, cobbles | the Deepdelvers' cut stone | a clerk's cool lamp |
| `forge` | the empire's flags, bronze in their joints (`forge_flag`) | black dressed stone banded in bronze (`forge_stone`) | warm |
| `deepforge` | rock, broken black rock with fire in its cracks (`magma_floor`, an emissive mask), 10 vents | basalt | hot |
| `works` | cobbles, char | slag brick | furnace |
| `vault` (the `lava` look) | rock and `magma_floor`, 14 vents | basalt | hotter |
| `strongroom` | the empire's flags, dressed (`mix` 12 %) | black and bronze | candle-warm |

- **The Ninth Vault has no kit of its own** (`dress`), so in the Reach a plan's one room kit stands in for it. The
  Vale's Ninth Milestone keeps the chasm's halls it was approved in.

**The doors on the overland** (buildkit.js, stood in 3D on the sim's own footprints). convert.js `SITE_DOORS` finds
each by its piece and its `REACH` place. Each door is on its +z face, where the sim's other doors are.
- **`assayhouse`:** the Assay Yards' counting house in place of the longhouse. Two storeys: slag brick under a
  soot-dark timber upper floor and rust tile. Its great door has the Assay's scale-and-pick on a board over it,
  lanterns either side, the weigh-beam on its post with a bronze pan, and ore crates.
- **`forgedoor`:** the Forgehall's great doors in place of the keep. Bronze leaves stand ajar in a portal of dark
  dressed stone with a bronze band and the empire's seal. The forge's light shows in the gap, braziers stand on
  plinths, and the black hill rises over and round the portal.
- **`ninthdoor`:** the Ninth Vault's strongroom door in the volcano's flank, in place of the chapel ruin. A face of
  black and rust rock holds a dressed stone frame with IX over it, the iron door banded with a bronze wheel, a chain
  across it on two posts, and a lantern.
- **`vaultmouth`:** the Magma Vault's mouth in place of the barrow. A slag mound is split open, the way down glowing,
  with timber shoring and a lantern.

**Furnace Nine's yard** (camps.js `reach_mouth`, `[148, 12]`):
- The ground inside its reach is char and cracked earth.
- Slag heaps (`slagheap`, a crack in each glowing) ring it just past its cleared arena, with a gap to the south, the
  way in.
- Ten vents stand inside.
- Only the yard's south half is inside the level's crop, so five heaps stand.

**Also:**
- The cinder hounds' den's `burrow` (the Vale's turf) is a slag heap in the Reach.
- The lane well's roof is rust.
- The slag hills are topped in char (`&`).

### The rounds

![Before and after: the Yards, the Quota Office, the Forgehall, the Deep Forges](img/reach/reach-dungeons-1.jpg)

![Before and after: the Cinderworks, the Magma Vault, the Ninth Vault](img/reach/reach-dungeons-2.jpg)

![Before and after on the overland: the Assay Yards, the Forgehall's doors, the Ninth Vault's door, Furnace Nine's yard (at dusk; before, the Vault's mouth)](img/reach/reach-doors.jpg)

**Round 1.** Every floor its own look.

*Critique:*
- The floors are seven places now, not one:
  - the yards' cobbles and slag brick;
  - the Forgehall's black-and-bronze;
  - fire in the Vault's cracks;
  - the strongroom's warm flags.
- But they read darker than the grey tiles they replaced. The charcoal cobbles (`cinder_cobble`, Ashgate's square's)
  went black underground: the yards' world band 25.7 → 18.7, the works' 26.9 → 17.4. The new foes in Assay grey were
  lost on them.
- On the overland:
  - the Forgehall's portal stood alone like a box before a low grey cone, its bronze cornice a slab seen from above;
  - the Ninth Vault's flank read grey-blue;
  - the basalt hills (part 1) stood as black stepped blobs.

**Round 2:**
- The dungeons' cobbles became a mid warm grey (`dun_cobble`), and the forge's flags and the Fens' flags were lifted.
- The Forgehall's hill went higher and darker, with crags hugging the jambs and the cornice a thin band.
- The flank became black and rust.
- The hills were ash-topped.

*Critique:*
- Yards 22, works 20. The cobbles read as a yard, and the hero and the Assay's men read on them.
- But the ash-topped hills stepped pale terrace by terrace into ziggurats.

**Round 3:**
- The hills are char-topped (`scorched`, a step lighter than their basalt sides), one form.
- The new kits' fill went up a step (+12 %).

*Critique:*
- The yards are at 23 and the works at 21. The forge-hall's are 24, the strongroom's 25, and the hot floors' 18–19,
  their cracks and vents doing the lighting.
- They sit a few points under the grey tiles they replaced (26–29), as the Fens' Mound sits under them: the Reach's
  stone is darker than the Vale's.

### Measured

Draws and triangles a frame, counted at the context:

| Place | Before | After |
|---|---|---|
| The Yards (floor 1) | 149 / 286 k | 167 / 300 k |
| The Quota Office (floor 2) | 124 / 235 k | 146 / 253 k |
| The Forgehall (floor 1) | 163 / 282 k | 192 / 286 k |
| The Deep Forges (floor 2) | 121 / 209 k | 159 / 209 k |
| The Cinderworks (floor 1) | 160 / 284 k | 182 / 292 k |
| The Magma Vault (floor 2) | 122 / 239 k | 129 / 237 k |
| The Ninth Vault | 154 / 190 k | 151 / 192 k |
| Overland: the Assay Yards | 166 / 645 k | 213 / 722 k |
| Overland: the Forgehall's doors | 159 / 613 k | 165 / 701 k |
| Overland: the Ninth Vault's door | 150 / 628 k | 157 / 637 k |
| *The Fens' overland (part 1)* | *297 / 808 k* | |

- **Textures add no draws.** Each new kit piece adds one or two draws a material.
- **The vents** add most of the Deep Forges' +38: ten ember beds and their wisps.
- **The rest** is the room's figures at the moment shot: the before copy's foes were the older models.
- **The Assay Yards' overland frame** includes the Redhand's camp (its tent and its men) by the yards.
- Every frame stays under the Fens' overland.

### Not done, and asked of others

- **Kell's Rest's houses** were already in the Reach's style (part 1: slag brick, rust tile, `REGION_LOOK.reach`).
- **The four doors have no baked cards**: `?landmarks=sprites` leaves them out, as it does part 1's pieces. (Done since: [art-critic-pass-reach-fx.md](./art-critic-pass-reach-fx.md) D2.)
- **The camps' tents** are our green canvas, a Vale piece (gsprite.js, not this pass's files). (Done since: ash-grey, [art-critic-pass-reach-fx.md](./art-critic-pass-reach-fx.md) D1.)
- **Sim asks:**
  - give `ninth_vault` `dress: ['strongroom']`;
  - put each site's door exit at its struct's +y face, where the new pieces' doors stand;
  - should Furnace Nine's yard want its north half seen, move `reach_mouth` 8–10 tiles south. The level's crop cuts the
    land's top rows.
