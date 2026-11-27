# The Vale's stone: the Old Barrows a barrow, Wickham Keep a keep

*2026-11-27 · **Implemented**, track 1 of [dungeon-looks-plan.md](./dungeon-looks-plan.md) (items 1 and 2). Our own
assets throughout: new textures painted in `tools/render3d/world.js`, our own pieces built in its one batch, Luminati's
own objects where it has the thing.*

## 1. What changed

**The Old Barrows** (`dig`, `gallery`, `muster`): a barrow, not a castle.

- **Drystone under turf.** The walls are flat stones laid dry in thin courses, no mortar, the gaps deep shadow
  (`barrow_drystone`). Their tops are turf (`grass_dark`), and a band of turf (`barrow_turf`, the face's top unit) hangs
  its grass over the top course. The back walls keep their ragged tops (GDD v1.98), a step taller (`LIFT_OF`).
- **The mouth cut earth** (`barrow_cut`, `barrow_cutturf`): topsoil, loam and chalk in strata, spade cuts, roots under the
  turf. The Redhand's shoring along it: a post and a cap board every three tiles (`bpost`), the Cutting's own timber sets
  (`bshore`, the sim's `shoring`).
- **Timber over the openings.** Each passage's mouth in a back wall has an oak post either side and a lintel across it,
  drystone packed over (`bdoor`).
- **Grave goods in the niches.** Each of the sim's niches (`urnshelf`) is a dark recess in the drystone on a slab ledge,
  an oak post either side and a heavy lintel (`bniche`). In it, by turns: lidded pots and a skull; a round shield and two
  spears; a drinking horn and a pot; a shield and pots.
- **The dead on biers.** The Long Gallery's sarcophagi are oak biers with the body under its shroud, a round shield on
  the chest and the spear laid beside it (`bier`). The Robbed Tomb's is torn open on the bones, its shield thrown down.
- **Standing stones.** Every column in the barrow's rooms is a standing stone, broader than deep, leaning a little
  (`menhir`). The Muster Hall's two colonnades are an avenue of them. A broken column is a stump with its top lying by.
- **Underfoot** packed earth (`barrow_earth`) and big worn slabs set in it, a third worn away to the earth
  (`barrow_slab`).
- **The light.** An earth-warm fill of its own (`BARROW_FILL`), not underground's violet. Each built fighting room has a
  broad warm pool at its middle.

**Wickham Keep** (`bailey`, `barracks`).

- **The bailey a yard under curtain walls.** It is cobbled (`keep_cobble`) with trodden mud (`keep_mud`). The curtain
  walls are honey-grey ashlar in lime mortar (`keep_ashlar`) and stand whole, four units high, rather than ruined
  (`tavernWalls`, room by room: `WHOLE_WALLS`). Along their tops runs the crenellated parapet (`kparapet`), with a
  buttress every six tiles (`kbutt`) and an arrow slit between (`kslit`). Their near runs are cut to a breast-high
  parapet with its merlons, the ramparts kit's in the keep's stone (`kmerlons`). The yard's columns are square ashlar
  piers (`kpier`). It is lit as a yard at the day's end: a fill of its own and a low sun (`KEEP_FILL`), and the dusk sky's
  slate past the walls.
- **The barracks a great hall.** Limewashed plaster (`keep_plaster`) in the inn's oak frame, with posts, beam, braces and
  joists. The bays carry the garrison's shields, a peg rail, the duty slate and antlers (`HALL_STORY`), with lanterns
  between. The floor is worn flags strewn with rushes (`keep_flag`, `keep_rushes`), and the near sills sit on an ashlar
  footing.
  - **A sim change** (plans.js, world.js): the inn's hearth on the back wall, three trestle tables with their benches
    (`trestles`), and the armoury's racks at the back wall's west end (`armoury`). These replace the bunks.
  - Its fire baskets stand out on the floor, and its middle has a pool of light.
- **The cellars** stay the cave the Redhand broke into. A hall takes the look of the room it leads from, so the cellars'
  rough way down is rock, not plaster.

**The kits' other sites.**

- **The Proving Pens** share the kits and read with them:
  - the adit and the beetle pen are cut earth shored with timber, as the old lead level is in canon;
  - the wraith pen is a barrow niche room;
  - the goblin pen is a yard under curtain walls;
  - the lower pens are the great hall's plaster and timber.
- **The Ninth Milestone** (`muster` in the sim) keeps its own look (`SITE_KIT`): the legion's strongroom, cut square and
  dry. It has the keep's ashlar walls (ruined tops, letter `Ƿ`), flags underfoot and a cool fill of its own
  (`MILESTONE_FILL`), not the Barrows' turf. Its halls are its own stone, not the chasm's.

## 2. The critic's rounds

The rounds were scored as an art director scores a room, against the plan's description, at play scale. Each capture is
a phone frame (390 × 844) at the game's camera, at dusk, the party in the room's middle (`tools/capture/rig.mjs`, every
room of the four sites, 35 shots a round).

| Round | What it found | What changed |
|---|---|---|
| 1 | The barrow reads as earth and turf, but black: the muster hall's mean was ~14, the standing stones were black spikes, and the slab floor read as cobbles | its own earth-warm fill; the drystone, earth and slabs a step lighter |
| 2 | The slabs at a tile's size read as crazy paving; the standing stones read as carved posts in the cliff texture | big slabs set in earth, a third worn away; the stones broader, in pale grey stone |
| 3 | The muster hall was still the darkest room; the Milestone was black under the chasm's violet; the great hall's sill faces read as a pale band under the room | a pool at each fighting room's middle; the Milestone's own look and fill; the hall's sills on an ashlar footing |
| 4 | Long grass strands on the low near walls read as iron bars; the great hall's floor was a violet slate | the turf's strands short and in tufts; the hall's pool stronger; its baskets seen whole |
| 5 | The perf pass: the turf's brim on every near wall and on the cave's ragged faces cost a sixth more triangles | the brim kept on the drystone's back walls only |

The scores, out of 10 (before → after):

| Room(s) | Identity | Materials | Light | Battle | **Overall** |
|---|---|---|---|---|---|
| The Barrow Mouth, the Cutting | 4 → 8 | 4 → 7 | 6 → 7 | 7 → 7.5 | **5 → 7.5** |
| The Breach, the Robbed Tomb, the Barrow Door | 3 → 7.5 | 4 → 7 | 5 → 6.5 | 7 → 7.5 | **4 → 7** |
| The Stair Foot, the Long Gallery | 3 → 8 | 4 → 7.5 | 5 → 7 | 7 → 7.5 | **4 → 7.5** |
| The Clerk's Room, the Issue Room, the Muster Hall | 3 → 7.5 | 4 → 7 | 4 → 6 | 7 → 7.5 | **4 → 7** |
| The bailey (five rooms) | 3 → 8.5 | 4 → 8 | 4 → 8 | 7 → 8 | **4 → 8** |
| The Undercroft Stair, the Barracks, the Strongroom | 3 → 8 | 4 → 7.5 | 5 → 6.5 | 7 → 7.5 | **4 → 7.5** |
| The Old Cellars, the Cave (unchanged: still the cave) | 6 | 5 | 5 | 7 | **5.5** |
| The Ninth Milestone (five rooms) | 3 → 6.5 | 4 → 7 | 4 → 7 | 7 → 7.5 | **4 → 7** |
| The Proving Pens (ten rooms) | 3 → 6.5 | 4 → 7 | 5 → 6.5 | 7 → 7.5 | **4 → 6.5** |

What still holds the barrow under 8:
- Its inner rooms are dim between their pools.
- The Barrow Door's two guardians are the old voxel statues.
- The Muster Hall's racks and standards are the legion's cards against the drystone.

**Brightness**, the mean of the world band (y 150–700) over the 35 shots: **23.4 → 30.9**.
- The Barrows: 21–29 → 25–35.
- The bailey: 22–29 → 50–61, a yard under the sky.
- The barracks floor: unchanged (20–27), the hall lit by its own lamps and its cellars kept dark.
- The floors' first shots (each floor's way in) carry the title card's fade, in both columns.

**The rules.**
- `node tools/capture/visibility.mjs barrows-f1 barrows-f2 keep-f1 keep-f2 pens-f1 pens-f2`: 47 subjects, 0 under half
  in view.
- dress-audit: Wickham Keep's 10 rooms, 0 over a cap; `--clear`: 0 pieces where §4.4 says no.

## 3. Performance

Measured with `tools/capture/figperf.mjs --sites wickham_keep,proving_pens,ninth_milestone`: draws and triangles a
frame, counted at the WebGL context, in a fight, on the same machine before and after.

| Fight | Draws | Triangles |
|---|---|---|
| The Barrows (the Cutting) | 125 → 129 (+3 %) | 255k → 288k (+12.7 %) |
| Wickham Keep (the bailey) | 152 → 147 | 231k → 222k |
| The Proving Pens | 136 → 144 (+6 %) | 225k → 239k (+6 %) |
| The Ninth Milestone | 213 → 213 | 535k → 535k |
| The town square (unchanged) | 429 | 725k |

- The batch of our pieces is one draw a material, as the inn's.
- The turf's brim (Luminati's grass overhang) was the cost. On every wall it took the Barrows to +17 % triangles; it is
  kept on the drystone's back walls alone. The near walls (`Ȝ`) and the cut earth go without it, their turf in their lip
  band.
- Lights: one pool a fighting room, within Luminati's shared twelve.

## 4. Balance

The changes are renderer-only, except the great hall's furniture (a non-boss room). `tools/balance/boss.mjs`, before →
after, three seeds each:

| Hall | Before | After |
|---|---|---|
| The Quartermaster (`barrows 3`) | 63, 61, 62 s, lowest 72–76 % | identical |
| Old Skarn (`wickham_keep 5 --floor 1`) | 73, 68, 64 s, lowest 60–69 % | identical |
| Captain Garrow (`wickham_keep 6`) | 54, 53, 57 s, lowest 66–75 % | identical |
| The Rat King (`proving_pens 4 --floor 1`) | 77, 71, 76 s | identical |
| The Spider Queen (`proving_pens 4`) | 58, 60, 61 s | identical |

The Barracks itself (`roomlv.mjs 300 5 5 1,3 --site wickham_keep --part barracks`, seeds 1–3) holds 300 s and 21 waves
before and after. `npm run check` is green.

## 5. Where it lives

- **`src/render3d/convert.js`:**
  - the legend's new letters (Þ Ð þ ð Ȝ ȝ, Æ æ œ, Ø ø Œ Ǿ, Ƿ);
  - `KIT_LOOK` dig, gallery, muster, bailey, barracks and milestone; `SITE_KIT`, `VALE_STONE`;
  - `barrowDress`, `BARROW_3D`, `curtainRun`, `curtainSills`, `KEEP_3D`, `HALL_STORY`;
  - `tavernWalls(…, only)` for whole walls room by room; `ruinWalls(…, lift)`;
  - the halls' looks by their nearer room.
- **`tools/render3d/world.js`:**
  - the textures `drystone`, `cutEarth`, `barrowSlabs` (a texture set of their own);
  - the pieces `valeBarrow` and `valeKeep`.
- **`src/sim/plans.js`, `src/sim/world.js`:** the Barracks' `hearth`, `trestles` and `armoury`.
- **Tests:** `test/render3d.test.mjs` ("the Vale's stone").

Captures (outside the repo): the before and after sheets per site, `pairs-<site>.jpg`.
