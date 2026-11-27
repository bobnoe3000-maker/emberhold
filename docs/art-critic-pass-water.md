# Art critic pass: the water (the Canal Locks, the Drowned Abbey, the Sunken Chapel)

**Implemented** (2026-11-27): [dungeon-looks-plan.md](./dungeon-looks-plan.md) track 2, items 3–5. The technique is in
[water-indoors.md](./water-indoors.md). Code:
- `src/sim/world.js`: `waterway`, `flood`, `world.bridges`, the `channel` / `lockgate` / `sluice` pieces;
- `src/sim/plans.js`: the three dungeons' `dress`;
- `src/render3d/convert.js`: `wetGround`, the `KIT_LOOK` flags, the legend's `α β γ ε ζ η θ`;
- `tools/render3d/world.js`: `buildShallows`, `wetAir`, `waterlined`, the textures, the trim;
- `test/water.test.mjs`.

**The finding** (the plan's review). The Fens are the water land, and none of their dungeons had water. The Canal Locks
and the Drowned Abbey were the Vale's stone with a floor re-tinted. The Abbey's walls were the Vale nave's own
sandstone. The Sunken Chapel's nave was dry.

## What each place has now

| Place | Shin-deep water | Deep water | Walls |
|---|---|---|---|
| The Lock Gate (Locks, the way in) | | a canal along the near wall, two lock gates, their windlasses; the near wall a quay's edge | the Fens' ashlar, a waterline at 1.7 |
| The Lock Chamber | its pools | a canal along the back wall, a gate at each end, a plank bridge where the way to the Tally House crosses | 〃 |
| The Tally House | dry | | 〃 |
| The Basin | flooded | a canal along the back wall, two sluice boards with their winch wheels | 〃 |
| The Sluice | flooded | a canal along the back wall, two sluices, a bridge at the door from the Basin | 〃 |
| The Vat Stair, the Cage Store | sick pools | | 〃 |
| The Vat Row | sick pools | a drain along the near wall, a bridge at the Drain Office's door | 〃 |
| The Drain Office | dry | | 〃 |
| Vat Seven (the Vatwarden), the Cage Store | sick pools twice the size (`sickpools`), sickly yellow-green with scum | a canal along the near wall, two sluices | 〃 |
| The Abbey's West Door, Cloister Walk, Choir, Night Stair, Dorter, Lay Crypt, Chapter-House | flooded, black-green | | the abbey's pale stone, its flood line at 1.95, weed under it |
| The Garth | flooded over drowned turf, duckweed, the sky in it | a pond in the back corner | 〃; open to the sky: a cold light from high up and a drizzle falling into it alone |
| Teague's Cell, the Scriptorium | dry (the plan: "kept dry", "up a step from the water") | | 〃 |
| The Sunken Chapel's Nave and Crossing | flooded, peat-brown, the pews standing in it | | its sandstone kept (the Vale's) |
| The Dry Porch, the Lady Chapel, the Chancel | dry | | |

## Rounds

Captures: the rig at dusk from the game's camera on a 390 × 844 phone frame, one shot per room of the three dungeons'
touched floors (25 shots), before (`ed8a263`) and after each round. They're kept outside the repo, in the session
scratchpad `looks/water/` (`before/`, `r1/` … `r15/`; round 4 is `r9/`, round 6 `r15/`; `sheet-r6.jpg`).

| Round | What changed | What the critic said |
|---|---|---|
| 1 | The sheet over the pools and floods; channels sunk under Luminati's water; the Fens' and the Abbey's walls; kerbs, bridges, gates, sluices | The channels read as black slots. The sheet read as "a darker floor": its specular went with its alpha, and in a dark room nothing lit it. The kerbs were unseen. |
| 2 | Specular counted toward the sheet's alpha; the deep water's bands lifted about three times; the channel's water up to 0.8 (from 0.72, a dark band of wall above it); Luminati's pixel-stepped ripple dashes, a meniscus and a sheen as the sheet's own faint light; the chapel's water lighter | The nave reads flooded, the pews in it. The channels read as green water with a pale coping. The wall's waterline read as a shadow. |
| 3 | The waterline a lime crust and a dark mark, each two texels; the dashes thinner and of varied strength; the garth's drizzle and sky light | The Abbey reads drowned. The garth reads open to the sky. The Crossing's shaft of daylight came back off the water as two white blots. The Lock Gate's canal was a sliver behind the ruin's near wall. |
| 4 | The direct specular capped (0.55); a near wall beside a channel cut flush, a quay's edge; the gates' leaves taller (0.62 over the floor) and lighter; Vat Seven's pools a dark rim, thicker water, more scum | The Lock Gate's canal and its gates read at play's size. The Crossing's light is a broad sheen. Vat Seven's pools read as scummed puddles, the weakest of the set (below). |

| 5 (the coordinator's review of the round-4 sheet: "at phone size the water doesn't read as water yet: dark stone with glitter"; the canals and gates barely show) | The ripple dashes gone. A clear blue-green tint, part its own light. A long soft warm streak under each lamp, where its reflection falls (the lamp mirrored in the water's plane from the camera). The walls behind the water reflected along their feet. A soft bright waterline at walls and dry floor. The channels' water 0.38 under the floor, darker; a pale coping proud of the floor; the far side reflected. Lock gates a metre high in oak with beams and winch wheels; bigger sluice wheels. The trim in two materials, casting no shadow. Window light in the Abbey's dorter, lay crypt and chapter-house. Vat Seven's and the Cage Store's pools twice the size, sickly yellow-green | Every flooded floor reads as water at a glance, the lamps standing in it. The far-side reflection didn't show: a comment had swallowed the line that added it. Then it bloomed into a white light tube. The waterline at small pools read as a selection outline. A high window's streak zigzagged. |
| 6 | The reflection strip added and dimmed to a pale stone tone; the waterline softer and wider; the streaks shaken along their length | The canals read as dark water a step down, with a pale coping, the far wall pale in them, and gates with wheels at each end. The Basin, the Sluice, the Nave, the Choir, the Dorter and the Chapter-House read as flooded halls with the lamps in the water. Vat Seven's pools read at a glance. |

### Scores (out of 10; before → after round 4 → after round 6)

| Place | Identity | Building | Dressing | Battle | Light | Materials | Polish | **Overall** |
|---|---|---|---|---|---|---|---|---|
| The Canal Locks, floor 1 | 3 → 7 → 8 | 5 → 6.5 → 7 | 4 → 6.5 → 7 | 8 → 8 → 8 | 5 → 6 → 7 | 4 → 6.5 → 7 | 5 → 6 → 6.5 | **4.5 → 6.5 → 7.5** |
| Vat Seven, floor 2 | 5 → 6 → 7.5 | 5 → 6 → 6.5 | 5 → 6 → 7 | 8 → 8 → 8 | 5.5 → 5.5 → 6 | 5 → 6 → 7 | 5 → 5.5 → 6.5 | **5 → 6 → 7** |
| The Drowned Abbey | 3.5 → 7.5 → 8 | 5 → 6.5 → 7 | 4.5 → 6 → 6.5 | 8 → 8 → 8 | 5 → 6.5 → 7.5 | 4 → 7 → 7.5 | 5 → 6.5 → 7 | **4.5 → 7 → 7.5** |
| The Sunken Chapel's nave | 4.5 → 7 → 8 | 5.5 → 5.5 → 5.5 | 5 → 6.5 → 7 | 8 → 8 → 8 | 5 → 6.5 → 7.5 | 5 → 6.5 → 7.5 | 5.5 → 6.5 → 7 | **5 → 6.5 → 7.5** |

The coordinator's verdict on round 4 overrode the critic's: at play scale the round-4 sheet read as dark stone with
glitter, so its "after round 4" scores were generous. Round 6 is scored against that reading.

"Battle" holds:
- The rings, the warnings, the hazards and the Abbess's flood are drawn over the water unchanged (`renderOrder` 2, no
  depth written by the sheet).
- The figures' feet go a hand under the sheet and their outlines hold.
- No fight's middle is cut: every channel runs along a wall.

## Measured

- **Balance** (`tools/balance/boss.mjs`, the right party at the hall's level, six seeds), before → after, identical. The
  floods are drawn only, the Abbey's halls have no deep water, and Vat Seven's channel lies along its near wall, where
  the fight never goes:

| Hall | Before | After |
|---|---|---|
| Vat Seven, the Vatwarden, 15 | down in 54–61 s, lowest 71–78 %, no downs | the same, seed for seed |
| The Choir, the Drowned Choir, 17 | 90–124 s, lowest 65–75 %, no downs | the same |
| The Chapter-House, the Abbess Below, 18 | 56–67 s, lowest 65–78 %, no downs | the same |

- **The sim**: every floor's chests and shrines are unchanged on two seeds (the Locks 1+1 / 2+1, the Abbey 2+1 / 1+1, the
  Chapel 1+1).
- **Dressing**: `dress-audit.mjs` on 30 rooms, 0 over a cap; `--clear` on 30 floors, 0 breaks.
- **Visibility** (`visibility.mjs`): locks-f1, locks-f2, abbey-f1, abbey-f2, chapel-f1, 40 subjects, 0 under half.
- **Draws and triangles a frame** (`figperf.mjs`, a fight in each dungeon, the same box, before → after; software GL
  with five other tracks running, so the frame times aren't comparable). The sheet is one draw a
  look; the trim is one draw a material (two); the channels are Luminati's one water mesh.

| Fight | Before | Round 4 | Round 6 |
|---|---|---|---|
| The Canal Locks | 136 / 268 k (\*) | 158 / 269 k (+16 %) | 149 / 267 k (+9.6 %: the trim in two materials, no shadow) |
| The Drowned Abbey | 133 / 267 k | 130 / 270 k | 135 / 270 k (+1.5 %: the windows' lights) |
| The Sunken Chapel | 112–116 / 223 k | 117 / 229 k | 116 / 229 k |

(\*) On this box the before tree's Locks fight never drew in `figperf` (0 draws, three runs). Its figure is the Fens
pass's own count for that floor ([art-critic-pass-fens-dungeons.md](./art-critic-pass-fens-dungeons.md), 136 / 268 k).
In round 4 the Locks were just over the plan's ~15 % line, from their trim's four materials and their shadows. Round 6
merged the trim into two materials and took it out of the shadow pass.

- Lights added: the garth's one sky light, and two cold window lights in each of the Abbey's dorter, lay crypt and
  chapter-house. The streaks are the room's own lamps', drawn by the sheet, not lit.
- `npm run check` is green.

## Not done

- **The bridges' planks** run east–west whichever way the bridge crosses. Luminati never turns `dock_deck`, a directional
  texture.
- **Wading ripples** round a figure's feet were not tried. The sheet's ripples are the room's, not the figures'.
- **The halls** between two flooded rooms stay dry. The water's soft edge sits at the doorway.
