# The Root Granary: a forest dungeon under the great oaks

*2026-11-27 · **Prototype, in progress**: art critic rounds under way (§4). The site is parked: it is on no land, and you
reach it with `?scene=dungeon&site=root_granary`.*

[dungeon-looks-plan.md](./dungeon-looks-plan.md) item 12 (the forest track), from the owner's two references (kept out
of the repo):
- **forest-1, the arcade:** tall straight trunks, pale green dappled light and mist, a ruined arcade of pointed arches in
  dark grey stone with tracery and metal cresting along its top, boulders and roots swathed in moss, ferns, a waterfall
  behind.
- **forest-2, the gateway:** ancient twisted trees heavy with moss, god-rays down through the canopy, a broken stone
  gateway with steps up into darkness, fallen ashlar and broken pillars, a cracked flagstone path, a green gloom.

## 1. What it is

A new dungeon type, the `greenwood` kit: fighting rooms as glades in the wood, open air under the canopy, no walls. It is
built as the docks and the ramparts are ([docks-dungeon.md](./docks-dungeon.md), [ramparts-dungeon.md](./ramparts-dungeon.md)):
what bounds a room is the world round it, here trunks, root-banks and mossed boulders, and past them the wood going
into the mist.

Canon (world doc §3.8, the Greenwood):
- the empire tithed this wood in grain and in people; the ruins in it are the empire's, and the metal on them is its
  bronze gone green (the Reach's forge kit's bronze bands);
- the **Tithe Road** runs "ruled straight through the oaks, half swallowed": the floor's cracked flags, west to east
  through three glades and on into the mist at both ends;
- the **Root Granary**, under the great oaks, is where the Unpaid lie. Its door is forest-2's gateway, steps up into the
  dark. No elves' ruins: Lirien only visits.

The site:
- **`root_granary`** (src/sim/sites.js): *The Root Granary*, region `greenwood`, base 56 (dungeon-catalog.md §4.5 puts
  it at 56–60; this is its first floor, the way in under the oaks; the `rootvault` floor below comes later), one authored
  floor, flat, parked.
  - **The region:** `greenwood` is the wall map's id; the sim has no Greenwood (regions.js). A dungeon's region is taken
    as it is (core.js keeps an unknown region, as a town preview does), so the floor is in the Greenwood; its stair up
    comes out on the Vale's overland, as any land the sim doesn't know. `content/schema/sites.schema.json` takes
    `greenwood` for it.
  - **Its foes:** the Ashbound, a placeholder family that exists. Fitting for now: the tithe's dead were Ashbound (§3.8).
    No story, no quest, no boss.
- **The plan** (src/sim/plans.js `root_granary`), the one-floor template (dungeon-catalog.md §1):

  | Room | Role | Size | What it is |
  |---|---|---|---|
  | The Tithe Road | entrance | 32 × 30 | the road comes in under the oaks; the stair up the bank |
  | The Great Oaks | room | 50 × 40 | the big fight, the road across its middle, the oldest oaks round it |
  | The Falls | offshoot | 26 × 20 | a glade under the falls, ferns to the knee |
  | The Arcade | room | 30 × 30 | the empire's arcade along its back, the road out east |
  | The Granary Door | end | 48 × 40 | the gateway on its west side, steps up into the dark; the chest |

  The end's door is on its **west** side: at its north edge the gateway stood between the camera and the Great Oaks'
  south strip.
- **Its dressing** (src/sim/world.js, `dressPlanned`), every piece at an edge, the middles open:
  - `wood_lamps`: a waymark lamp at a back corner and one by the near edge;
  - `ruin_blocks`: the empire's fallen blocks (`fallen_block`, a new `DRESS_PIECES` entry, `DRESS_CAP` 4) and a broken
    pillar in the corners' thirds;
  - `mossy_boulders`: two boulders at the edges.
  - The doorways' lights are `lantern` (`DOOR_LIGHT.greenwood`); the floors stand no obstacle (`PLAN_OB.greenwood: []`).
  - `tithe_road`, `arcade`, `falls` and `granary_door` are the renderer's: they put nothing in the sim.
- Every fighting glade's middle 80 % is open, its stone under 10 % of the floor, on five seeds; keep-clear is clean
  (test/greenwood.test.mjs); no room over a cap (`dress-audit.mjs root_granary`).

## 2. How it is drawn

The converter is src/render3d/convert.js (`KIT_LOOK.greenwood`, `woodGround`, `woodDress`, `WOOD_3D`); the builder is
tools/render3d/world.js (`buildTavern`'s greenwood pieces, the greenwood's textures, `greenwoodAir`, `WOOD_KEYFRAMES`).

- **Open air.** The level is Luminati's outdoor kind (`interior: false`), its air ours (`greenwood: true`): the same green
  gloom at every hour of the sim's clock (`WOOD_KEYFRAMES`), an olive fill with a warm earth bounce (`WOOD_FILL`), the sun
  a little through the canopy for the trunks' shadows, warm only at a lamp. The backdrop and the fog an olive gloom
  (`#3a4230`), so the far trunks stand dark against it.
- **The ground** (`woodGround`): the glades at the floor's level in moss and fern with stones in it (`ᚠ`, `wood_moss`),
  leaf litter in drifts a few units across (`ᚢ`, `wood_litter`: a soft noise, not a scatter by the tile); the Tithe
  Road's flags in an eight-tile band (`ᚦ`, `tithe_flag`, moss in every joint), a third swallowed by the moss. Off the
  glades the wood's own ground a step up (`ᚨ`, `wood_ground`, its bank `wood_bank`, earth and roots), the root-bank round
  every glade, its lip in the glades' moss. The road runs on through the wood, sunk in its bank. Past 12.5 units from a
  glade nothing is built (`ground`). The glades are a clear step lighter than the wood: lit clearings.
- **The stair up** in the empire's grey steps, flagged, in ashlar (`ᚪ ᚫ ᚬ ᚭ`, the shared stair tiles swapped for them),
  under the kit's arch.
- **The trunks** (`woodDress`): first the great trunks along every glade's back edges (north and west) every four units
  or so: tall and straight (0.9–1.4 units through) or old twisted oaks (1.8–2.4) with their limbs, green moss on their
  lower halves, the bark going into the gloom toward the top (the canopy is out of the frame), buttress roots, and roots
  down the bank, over its lip and onto the glade's edge. Where another glade lies behind on the camera's line, an old
  bole broken off at what the ground allows, its girth kept, or a great fallen trunk along the edge. Then a jittered
  grid fills the wood: slimmer trunks into the mist.
- **The edges:** moss-heaped root-banks along every glade's lip (`wbank`) with boulders among them, knee-high at most
  where the camera looks across them at a fight, heaped up at the back.
- **The camera's rule.** The camera looks north-west at 30°: anything south-east of a glade stands between it and the
  fight. Each trunk is as tall as the ground it stands before allows (`reach`: how far along the camera's line to the
  nearest glade, × tan 30°, a figure's feet kept in view), an oak's limbs counted. Where a trunk may not stand tall, a
  mossed boulder, a root-mound, a broken snag or a fallen log. So the tall wood stands at the glades' backs, and the
  near side is low and dark, as forest-2's foreground is. The test checks every trunk against it; `visibility.mjs
  granary-f1` finds no subject under half in view.
- **The mist:** two sheets a little over the ground, clear over the glades and thickening into the wood, and a dark
  third where the wood's ground stops, near opaque, so the level's edge goes into shadow, not a cliff or a fog bank.
- **The shafts:** pale light down through the canopy, one a glade onto its back third (never its middle), each its own
  width, slant and place, one soft beam and a faint thin one, the light in a pool where it lands, motes in it (Luminati's
  `dust` emitter). The Granary Door's falls on its steps.
- **The ruins:**
  - **the arcade** (`warcade`) along the Arcade's back: pointed arches on clustered piers, two lancets and a roundel in
    each head, solid spandrels, an entablature, ivy, one bay fallen with its stones in the moss (the bronze cresting went in
    round 10: it never read at a phone's size);
  - **the granary's door** (`wgate`) on the Granary Door's west side, half again as big as first built: five pale steps
    up, a round-headed opening black to its face (a black face just inside the ring, so it reads from any angle) with the
    tithe-lamp a glint in its dark, a jamb's top broken away, a great oak behind it with its roots over
    the top and down the sides, a broken pillar by the steps, a light from the shaft on its stone;
  - **the falls** (`wfalls`) past the Falls' back corner, straight up the screen from it: a face of dark rock stepping up
    under moss, the water curling over the lip and falling as a sheet in two falls, wider at its foot, its edges soft and
    torn, white water streaming down it; foam heaped at its foot, a dark pool with its rings and a mossy lip, the spray
    (Luminati's `mist`);
  - **the fallen blocks and broken pillars** in the glades (`wblock`, `wpillar`), the waymarks' lamps on stone posts
    with bronze arms (`waylamp`).
- Everything is ours (the textures in `world.js` at Luminati's density, the pieces in `buildTavern`) but the emitters.

## 3. The numbers

- **Legend letters:** `ᚠ ᚢ ᚦ ᚨ` (U+16A0, U+16A2, U+16A6, U+16A8) and the stair's `ᚪ ᚫ ᚬ ᚭ` (U+16AA–U+16AD): runic, clear of
  every other kit's.
- **Textures:** `wood_moss`, `wood_ground`, `wood_litter`, `tithe_flag`, `wood_bank`, `wood_ashlar`, `wood_verdigris`,
  `wood_mossbark`.
- **Pieces:** sim `fallen_block`; trim `wtrunk`, `wsnag`, `wroots`, `wbank`, `wboulder`, `wlog`, `wfern`, `woodmist`, `wshaft`,
  `waylamp`, `wblock`, `wpillar`, `warcade`, `wgate`, `wfalls`.
- **Perf:** draws and triangles a drawn frame, counted at the WebGL context over 20 s with the hero at the floor's way in
  (the same count for all three, on one machine; `figperf.mjs` on the shared box, under a load of 32, returned medians
  of 0 draws for the wharf and one frame for this floor, so the count was taken in the page by Luminati's own steps):

  | Floor | Draws | Triangles |
  |---|---|---|
  | the Root Granary, round 9 | 86 | 280 k |
  | the Root Granary, round 12 | 88 | 296 k |
  | the Old Eel Wharf (docks) | 86–88 | 284–286 k |
  | the High Ramparts | 89 | 212 k |

  Round 4 stood at 92 draws and 293 k with the wood's ground run to the level's edge (the terrain was 346 k of its own
  triangles in the scene); the ground stops 12.5 units from a glade since (`ground`), the mist and the gloom past it.
- **Lights:** the waymarks' lamps, the tithe-lamp and the gate's light, within Luminati's shared twelve (the pool takes
  the nearest).
- **Balance:** no boss hall (the floor has no boss); the smoke contract is unchanged (`npm run check`).

## 4. The art critic's rounds

Captured with `node tools/capture/rig.mjs <shots.json>` at 390 × 844 at dusk, the game's camera: a shot a room at
`part:<room>`, and two framed on the set pieces (the arcade, the granary's door). Each round scored against the two
references, as the earlier kits were.

| Round | Identity | Building | Dressing | Battle | Light | Materials | Polish | **Overall** |
|---|---|---|---|---|---|---|---|---|
| 1: glades, trunks, shafts, mist, the ruins; Luminati's outer woods past the edge | 4 | 4 | 4 | 7 | 5 | 4 | 3 | **4.5** |
| 2: the mist the wood's dark green, the backdrop ours, an oak's limbs counted against the fight | 5.5 | 5 | 5 | 7.5 | 6 | 5 | 4.5 | **5.5** |
| 3–4: the falls up the screen from their glade, a mid-green gloom, fallen logs before the camera, the stone a step paler, the arcade taller, a shaft on the door | 6.5 | 6.5 | 6 | 8 | 7 | 6 | 5.5 | **6.5** |
| 5–7: the wood's ground stops 12.5 units out, a dark sheet over its end (no cliff, no fog bank) | 7 | 6.5 | 6.5 | 8 | 7 | 6.5 | 6 | **6.5** |
| 8–9: the road's flags paler, our own boulders swathed in moss | 7.5 | 6.5 | 7 | 8 | 7 | 7 | 6 | **7** |
| 10: one soft shaft a glade, varied; trunks two to three times the girth, moss on their lower halves; root-banks along every lip; olive and warm earth; the door half again as big with a black opening; the falls a falling sheet; stone steps; the cresting gone | 7.5 | 7.5 | 7 | 8 | 7.5 | 7 | 6.5 | **7.5** |
| 11–12: the great trunks along every back edge first, broken boles and fallen trunks where a glade lies behind; the wood a step darker than the glades; the banks' roots a tangle (they read as a fence's rails), the moss quieter | 8.5 | 8 | 8 | 8 | 8 | 7.5 | 7.5 | **8** |

Round 9's verdict (kept for the record; round 12's below). It reads as forest-2's green gloom at play scale: the shafts slanting down onto the glades' backs, the
moss floor with the road's flags across it, lamps warm only at the waymarks, the wood's foot going into the dark, the
falls and the arcade where the eye goes. The fights read: rings and figures clear on the floor, nothing in the middles,
nothing tall before a glade. What holds it under 8:

- **The granary's door** is a dark block with a shaft on it at a phone's size: its round-headed opening and steps don't
  read as forest-2's gateway. It wants a paler face to the opening, the steps lit, the arch's ring picked out.
- **The falls** are one flat white card. They want a taper, broken edges and a second tone.
- **The trunks**: the tall straight ones are dark poles into the gloom (right for forest-2, thinner than forest-1's), and
  the old oaks lack the references' mass of moss. Bigger boles with moss hanging off them at the glades' back corners.
- **The stair up** (the floor's way in, `stairs()` on the kit's arch stone) reads as a wooden pallet under its glowing
  arch.
- **The bronze cresting** is lost at play scale; it shows only in a close view.

Round 12's verdict (the coordinator's seven notes on round 9, 2026-11-27: the shafts searchlights, the wood a teal wash
of thin poles, the colour, the door, the falls, the stair, the cresting). Beside the references it now reads as their
wood at play scale: an olive gloom with lit clearings in it, great mossy trunks at the glades' backs (the Tithe Road and
the Falls the best of them, the falls between two of them as forest-1's), forest-2's gateway as a broken arch with pale
steps up into the black, one soft shaft a glade landing in a pool. Fights read: rings and figures clear on the floor,
nothing in the middles, nothing tall before a glade (`visibility.mjs granary-f1`: 8 subjects, none under half in view).
What's left:

- **The Great Oaks has few tall trunks of its own.** The one-floor template stacks a glade behind each of its back edges
  (the Falls north, the Tithe Road west), so the camera's rule keeps them broken boles and fallen trunks. A floor laid
  out for the wood (the glades staggered so each back edge opens onto wood) would give every glade its wall of oaks.
- **The near edges' root-banks** are a busy field of green humps at some angles; fewer and larger would be calmer.
- **The leaf litter's drifts** read as dark patches more than leaves at a phone's size.
- The lattices beside the halls are the game's own gates (the floor's `GATE 0/10` bars), the same in every kit.
