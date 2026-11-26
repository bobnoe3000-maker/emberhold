# Critic pass: the Seventh's Palace and Highmarch's fight looks

**Implemented** (2026-11-26). Highmarch, Tidemark step 6 ([tidemark-plan.md](./tidemark-plan.md) "The build sheet:
Highmarch"), GDD v1.154, world doc v1.72 §3.7. Two things were asked for:
- the `palace` kit's first look (floor 2, the Seventh's Palace);
- the looks for the new fight mechanics (the engineers' pitch, the tower shields' glance, the Champion's wall, Lucan's
  Canticle and his sitting down).

The brief: *a march-kingdom's seat dressed for a coronation that never came*. It takes the crypt kit's dressed stone and
arcade, but warmer and grander, not a tomb. It takes the tavern kit's furniture for the study. It adds the household's
banners, a throne on a stepped dais and the chapel's empty reliquary. Every room's middle stays open for the fight
([level-design-rules.md](./level-design-rules.md) §4.2).

Code:
- `src/render3d/convert.js`:
  - `KIT_LOOK.palace` and its legend tiles `( ) / | ?`;
  - `palaceRun` (the back walls);
  - `PALACE_3D` (the throne, the reliquary, banners, standards, candelabra, columns, the study's desks, the courtyard's
    lights);
  - `palaceRunners`;
  - the floor's checker and the yard;
  - the rooms' warm pools (`pools`).
- `tools/render3d/world.js`:
  - the palace's textures;
  - its pieces in `buildTavern`;
  - the windows' glass turned by the hour (`palaceSkyAt`);
  - the Canticle's ring;
  - burning pitch (`placePitch`) and the pot in flight (`placeSpells` `pitch_fly`).
- `src/render3d/hybrid.js`:
  - `tellsOf`: the song's end, and whether it broke;
  - the pitch hazards;
  - the pots matched to their bolts;
  - the new bus events handed to the fights' light.
- `src/render/skillfx.js`: `fightMoment`, and the moments `glance`, `boss_wall`, `boss_sing`, `boss_song_broken`,
  `boss_song_sung` and `boss_spared`; the auras for Lucan singing and the Champion's wall holding.
- The bundle is rebuilt (`node tools/render3d/build.mjs`).

Captures, at 390 × 844 and dpr 2, from the game's camera:
- the rooms: `node tools/capture/rig.mjs <shots.json> --dpr 2 --sheet` → `tools/capture/out/palace/{before,wip1,round2}/`
  (every palace room at dusk and at day, and the walls' five);
- the effects: a staged real fight per moment, as `tools/capture/bosses.mjs` does, → `tools/capture/out/palace/fx/` and
  `fx2/` (`<name>.png` strips, `frames/`, `sheet.jpg`).

## What it is

**The stone.**
- The back walls are a blind arcade, as the crypt's, but in warm honey limestone (`palace_wall`).
- Every four tiles there is a marble pilaster on a porphyry base, a gilt capital where the arches spring, and a gilt
  keystone.
- A marble cornice with a gilt fillet runs along the top. A dark porphyry dado runs along the foot, so the floor's edge
  reads.
- Each bay's back is smooth warm plaster.
- The near walls are sills in a honey stone a step under the walls (`palace_sill`).

**The floor.**
- Polished marble, one slab a tile, laid in a checker of honey and rose-grey (`checker`: by the tile, not a scatter).
- The joints are hairlines and the two tones are kept close, so figures and their rings hold on it.
- The courtyard is in yard flags (`yard`).
- A runner in the household's blue runs down the hall of banners and up from the throne's steps to the near wall. It is
  split round anything the sim stood on its line (a column).

**What hangs in the bays** (by the room the bay looks into, its plan id):

| Room | Bays |
|---|---|
| The Courtyard | the house's front: windows lit warm from inside, the household's banners ("still out for the day in the capital") |
| The Hall of Banners | every bay a legion's colours (crimson, ochre, green, black, purple: "every one the empire raised, and some it never did"), each with a gilt eagle over its tablet; the sim's two banners are the household's |
| The Study | bookcases (Luminati's shelf of books, at the inn's scale), a window |
| The Chapel | saints in their niches (the crypt's), a window |
| The Throne Room | the household's banners and windows; behind the throne, its cloth of estate |
| Any other | banner, window, the household's arms (a marble cartouche, a blue shield, a gilt crown) |

- A long north wall's middle bay is a window.
- Every other pilaster carries a gilt sconce, and every other sconce casts light.

**The household's colours: blue and gold.**
- Canon doesn't name them. The build sheet says only "Highmarch's colours".
- Blue reads against the foes' red rings and the warnings' red-orange; gold is the Champion's Laurel and the crown that
  waits.
- *For the owner:* if Highmarch's colours are to be canon, they belong in the world doc first. The legionaries' bake could
  then wear them too.

**The windows** (round-headed, leaded, between tied-back blue drapes).
- Their glass is the hour's sky, from the sim's clock (`palaceSkyAt`): dawn rose, a pale gold day, an amber dusk, a deep
  blue night.
- A patch of the same light lies on the floor before each one, barred by its leading.
- Underground the fill doesn't change with the hour, so the windows are what tells a day from a dusk in the palace.

**The pieces:**
- **The throne.**
  - It sits on the sim's footprint of five tiles by three, against the back wall.
  - Three marble steps, gilt at their nosings, with the runner up their middle.
  - The throne is gilt, its seat and back in the household's blue, a crown on its crest. The crown itself waits on a red
    cushion on the seat.
  - Behind it hangs the cloth of estate with its gilt laurel, under a fringed tester.
  - It has its own warm light. A candelabrum stands either side (the sim's).
  - Lucan sits on these steps at the end of his fight. The steps' front edge is the footprint's front row, two tiles out
    from the wall.
- **The reliquary.**
  - A marble stand on a step, a gilt tray, and an oxblood cushion with the box's print in it and nothing on it.
  - The box's gabled lid lies askew on the floor beside it.
  - Over it is an empty arched niche rimmed in gilt, with two candles left burning at its foot.
- **The study.**
  - Two writing tables at the inn's scale, each with a chair, a candle and its own small light.
  - The west table holds the Kindler's four letters, their red seals whole, under a gilt paperweight.
  - The east table holds an inkstand, a quill and an open book.
  - Papers have fallen to the floor.
- **Standards and columns.**
  - The legions' standards stand free a step out from the wall: a weighted foot, phalerae on the pole, the colours on a
    crossbar with a fringe and an eagle.
  - The sim's columns (its obstacles) are stout marble on porphyry plinths, with a lidded gilt urn on top.
- **Candelabra:** the crypt's, in gilt, with a knop on the stem.

**Counts** (the palace floor, seed 20260807, convert.js):
- 226 trim pieces built in one batch, merged a material at a time.
- 58 lights in the level. Luminati shares twelve among those in view, as everywhere.
- The level is 86 × 50.
- The only card left is the chest.

## The effects

| Sim event | What's drawn | Where |
|---|---|---|
| projectile `pitch` | a dark clay pot tumbling on its arc from the engineer's hand to where it breaks, its rag alight (a flame quad before it), black smoke left behind; it lights the floor under it. Emberlit's grey bolt for it isn't drawn: hybrid.js matches each bolt to its pot | world.js `placeSpells` `pitch_fly`, hybrid.js `potAt` |
| hazard `pitch` | a tar-black pool at the size it slows (`PITCH_R`, what's drawn is what's hit), a breathing ember glow in it, a faint rim, five flames licking up across it, glowing embers, a smoke wisp; a splash of fire as it lands; the brightest patch lights the floor round it | world.js frame (the pool), `placePitch` (flames, splash, light) |
| tell `canticle` | a pale gold band going out from where Lucan stands to `CANT_R` over `CANT_T`, with a warm dark line under it; a thin gold line at its full reach (the time left); the song's waves (rings scalloped like a sound wave, counter-turning) running out from his feet to the front; the floor it has passed washed faint gold. Never the warnings' red: nothing lands where it goes | world.js tells (`THIN`, `BAND`, `WAVE`) |
| `bossCanticle` broken | the front and the reach's line crack into arcs thrown out and turning, gone in 0.7 s; a dull crack of gold off him, shards falling | world.js (`SHARD`), skillfx `boss_song_broken` |
| `bossCanticle` sung | a near-white flash out at the reach; a pale gold column and ring at each of the risen, a wavering thread of song from him to each | world.js, skillfx `boss_song_sung` |
| `bossSing` | a thin column of song up from him, five notes rising, a ring breathing out; while he sings (`e.singing`), notes keep rising off him and a slow pulse goes out at his feet | skillfx `boss_sing`, bossAuras |
| combat `glance` | a white spark off the shield's face, four glints thrown off, a ring of struck metal; 0.26 s, at most six at once (the oldest goes) | skillfx `glance` |
| `bossWall` | two gilt rings off the Champion; the line drawn on the floor out from its middle through the places; at each place a tower shield's outline standing up in steel, one after another, with a ring at its foot; while two or more of his wall stand unheld, a gilt thread from each to him and a shield over him (his front covered) | skillfx `boss_wall`, bossAuras |
| `bossSpared` | quiet: a few motes of the song's light drifting down round him, a faint ring drawing in to his feet. No flash, no burst | skillfx `boss_spared` |

The events reach the fights' light without touching renderer.js:
- hybrid.js listens on the bus;
- it hands each event to skillfx.js `fightMoment`;
- that queues a moment on the renderer's skill effects, its clock starting at the next frame drawn.

The renderer's own banners for these events are the lead's (renderer.js).

## Room rounds

| Round | What read wrong (as an art critic would) | Change |
|---|---|---|
| before | The palace had no look: `DEFAULT_LOOK`'s blue rubble, a dungeon's ragged walls, no throne (the sim's `throne` and `reliquary` fell back to a spire card), banners and standards as flat cards. Nothing said palace | the kit, as above (`wip1/`) |
| 1 | **Floor:** a thick black grid every four tiles over the checker. A 64 px texture spans four of Luminati's tiles, so one slab to a texture drew its joint every four, "grout", louder than the fight's rings | sixteen slabs to the texture, one a tile, a hairline mid-tone joint, the two tones closer |
| 1 | **Bay backs:** the ashlar turned round each arch's head read as a barrel's end or a cartwheel | smooth warm plaster (`palace_top`) |
| 1 | **Near sills:** dark red-brown blocks read as a fort's wall, heavier than the back walls | a honey stone a step under the walls |
| 1 | **Windows** at dusk were the brightest thing in the room, over the candles | the glass a third down (0.4 + 1.1 × the hour's strength) |
| 1 | **Runner:** gilt lozenges down it read as coins on the floor (the crypt's ledger crosses learned this, its round 7) | a darker blue band down its middle instead |
| 1 | **Standards** read as street signs: a small dark square on a pole | taller (3.5), the colours 1.2 × 1.35 with an eagle on the cloth |
| 1 | **Columns:** thin, a bright pointed urn, read as a candle on a post | stouter, the urn lidded and a duller gilt |
| 1 | **Courtyard:** two hot squares of light on the yard's flags by the near sill (the cellar's low door pool) | a broad soft warmth hung higher |
| 2 | One standard drew in the legions' black: on its pole it was still a sign | standards never black (crimson, ochre, green, purple) |
| 2 | **Read well:** the checker under the fight (the legionaries' red shields and the hero hold their outline); the throne as the room's focus, framed by its candelabra and the cloth of estate; the hall of banners' colours; the study's books and tables; the day's pale gold glass against the dusk's amber | — |

## Effect rounds

| Round | What read wrong | Change |
|---|---|---|
| 1 | **Pitch pool:** its hard ember rim read as an elite foe's orange foot-ring | the rim faint, a soft glow in the tar, the flames half again as big |
| 1 | **The song broken:** only the front cracked, and early in the song it lay under the melee at Lucan's feet, unseen | the reach's line breaks too, and both are thrown out past where they were |
| 1 | **The song going out:** gold on the honey marble was thin | the band wider (0.88–1) and stronger, the reach's line up a step |
| 1 | **The wall's line** on the floor, gilt on the lit cobbles, was lost | heavier, full strength |
| 2 | **The pot** read as a pale acorn; its flame was lost behind it | the pot near black, the flame before it, bigger and hotter, the smoke darker |
| 2 | **Read well:** the song sung out (a white flash at the reach, the risen in their columns); the broken song's arcs; the glance's spark at the shield's face, small and quick; the burning pitch, flames over a tar pool | — |

## The walls (floor 1)

The walls use the ramparts kit as built (docs/ramparts-dungeon.md), and the shots there are good:
- the terraces under the houses' backs;
- the parapet over the mist;
- the torches.

Open for a later pass, not changed here (the kit is the Lamp Fort's too):
- **No siege.** Nothing says the walls are under siege or breached: no fallen masonry at the breach, no fires, no engine.
  A `siege` flavour of the ramparts' dressing would carry it.
- **Legionaries at the parapet.** One at a terrace's near edge stands with his legs behind the parapet's merlons. He's
  still over half in view, as the rule (§1.1) asks.

## Left for others

- **renderer.js** (the lead's):
  - Emberlit's emissive trail for a `pitch` bolt is the plain bolt's steel at a flat height, under the arcing pot. Skip it
    for `pitch`, or give `fx.js` `BOLT_RGB.pitch` a dull ember.
  - On `bossDown` with `spared`, the renderer still jolts the camera and sends up the foe's soul (`fx.soul`), and Lucan's
    figure dissolves as the dead do. That is a death flourish where the brief wants none; skip them for `spared`.
  - The banners for `bossSing`, `bossCanticle`, `bossWall` and `bossSpared` are the lead's.
- **The sim** (the lead's): Lucan is put where he fell (battle.js), not on his steps. The steps' front edge is the throne
  footprint's front row, `(-L × 0.5, -Wd + 3)` in the room's frame, if he's to sit there.
- **The bake** (the other agent's): the shots show the legionary and the engineer as they stand today.
