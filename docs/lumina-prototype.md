# Another world: Luminati's dioramas, Emberfall's people (prototype)

**Status: Prototype** (2026-10-31). The owner: *"Let's create an alternative game world using this repo for the world and
environment. Let's keep our player and NPC character assets AS IS. https://gitlab.com/stubborn-hug/lumina. Create a
prototype."*

**Play it:**
- from the game's menu (☰), *Another world*, which saves the slot first;
- or open `/lumina/` directly.

Pick a hero, then a world. It's a sandbox: no save is read or written, and nothing reaches a game slot.

![Six worlds, six of Emberfall's heroes](./img/lumina/worlds.jpg)

*Emberfall's Knight in Luminati's Emberfall village at golden hour; the Mage in Starfall Vale; the Cleric on Gildhaven's
road; the Rogue at Brightwater Crossing; Wren on Willowmere's green; the Barbarian at Cinderwatch Pass's Waystone Camp.
Every villager in them is drawn from Emberfall's cast too.*

## 1. What it is

[Luminati](https://gitlab.com/stubborn-hug/lumina) is an MIT-licensed HD-2D engine on three.js r186. Pixel-art sprites
stand in a lit, shadowed 3D diorama, with tilt-shift depth of field, an hour of the day with weather, water and god
rays. Its worlds are generated at runtime from level JSON, and there are no image files.

**Luminati's (pinned at `80e1aa6`):**
- the worlds: the terrain, buildings, props, water, foliage;
- the light, weather, camera and UI;
- the dialogue's lines and its foes.

**Emberfall's, as they are:**
- the player;
- the party;
- every villager, and anyone a story brings on.

These are drawn from our baked actor atlases, read from the game's own `assets/actors/` at runtime. Nothing is copied,
re-baked or edited. In dialogue each speaker's portrait is their own `<actor>.face.png`.

**The worlds shipped:**

| World | Size | Character |
|---|---|---|
| Emberfall | 48 × 40 | Luminati's demo village, by chance the same name as ours |
| Willowmere | 28 × 22 | a hamlet by a pond |
| Brightwater Crossing | 36 × 28 | a river hamlet |
| Gildhaven | 128 × 128 | a walled river town with 68 villagers |
| Starfall Vale | 128 × 128 | a festival vale |
| Cinderwatch Pass | 96 × 120 | a fight, with a party to recruit; its goblins drawn as ours, its other foes Luminati's |

And Emberfall's own (§3), written by `tools/lumina/levels.mjs` when it builds:

| Level | Size | What it is |
|---|---|---|
| Thornwick | 90 × 72 | our town converted from the game's own sim, its nine townsfolk with their own words |
| The Scrag Warren | 56 × 60 | an autobattle encounter: Brannoc, Wren and a Guild cleric with you against the hill goblins |
| The Catalogue | 112 × 119 | every world asset the engine builds, one of each and named, and Emberfall's whole cast |

## 2. How our people get into their world

Luminati paints every character with one function, `createCharacterSheet(spec)` in `engine/pixel/CharacterSprites.js`:
32 × 32 frames in four directions. The prototype's build (`tools/lumina/vite.config.mjs`) changes what the import of that
module means, and doesn't touch Luminati's files:

- **Imports of `CharacterSprites.js` go to `tools/lumina/ember/sheets.js`.** It passes everything through except
  `createCharacterSheet`, which returns a sheet cut from one of our atlases.
  - The monsters (`MonsterSprites.js`) come too. Its humanoids (goblin, archer, shaman) are painted with the same
    function, so they're our goblins; its other kinds are painted another way and keep Luminati's look.
  - Imports of `FestivalPoses.js` go to `festival.js` the same way: a cheer, a dance, a bow are our attack, walk and
    idle frames.
- **Three call sites are tagged at build time**, so a sheet knows whose it is: the player (`Player.js`), a party member
  (`PartyMember.js`) and a villager (`Npc.js`, with its id). The build stops if Luminati's code at those lines has moved.
- **Who's who:**

  | Who | Drawn as |
  |---|---|
  | The player | the hero picked on the front page (`?hero=`, the Knight by default) |
  | A party member | by class: swordsman → the Barbarian, cleric → the Cleric, scholar → the Mage, hunter → the Rogue with a bow, bard → the Shaman |
  | A villager | by preset, picked by the villager's own seed and id among Emberfall's people (below); a level can name the look (`spec.emberActor`, any baked actor) |
  | Luminati's goblin, archer and shaman | our goblin skirmisher, goblin archer and goblin hexer, in every level (its slimes, bats, boars and golem stay Luminati's) |

  | Villager preset | Emberfall's people |
  |---|---|
  | innkeeper | Maudry, Dace, Nell |
  | merchant | Wendel, Pim, Hedda |
  | cleric | Ilse, Orla, Agnes |
  | guard | Jory, Osric |
  | farmer | Ned, Hedda, Tobin |
  | elder | Osric, Agnes, Hester |
  | villager | the four villagers, Hester, Tobin, Bess and Ned |

- **The sheet.**
  - **All eight octant rows** of our atlases. Luminati's animations name its four directions; the row drawn is the
    octant of the sprite's heading within that direction's quarter (`ember/view.js`, §6).
  - **The columns** are our idle, walk, attack, hit and death clips. Luminati's poses by name (`slash`, `hurt`,
    `cheer0`, `kneel` …) point into them.
  - **Scale:** 32 native pixels to a world unit. Our 56-px figure stands 1.75 units, about a Luminati villager's height
    on the screen.
  - **Loading:** only the atlases' JSON is fetched at boot. An atlas's image is fetched when its sheet is first asked
    for. Sprite3D clones a sheet's texture per sprite, so the sheet keeps its clones and re-uploads each when the pixels
    arrive.
- **Light.** Our albedo takes Luminati's sprite lighting (its wrap-lit material, sun-facing shadow cards, its warm fill).
  Our normal maps aren't used.

**On a phone** (`ember/touch.js`; Luminati has no touch input):
- **Walk:** drag on the world for a floating stick that feeds Luminati's move vector. Drag to the edge to run.
- **Talk:** speak and turn a page (Luminati's `confirm`).
- **Zoom:** pinch, which drives the camera's wheel.
- **Worlds:** back to the front page.
- Luminati's keyboard chart is put away on a phone.
- The game's own windows, buttons and dialogue still take their taps: only touches on the world drive the stick.

## 3. Emberfall's own: Thornwick, the catalogue, a fight

The owner: *"Can we create an existing map into the new engine? Do we have a catalogue of all the game world assets
built in the new engine? Can we also create an npc autobattle encounter."*

`tools/lumina/levels.mjs` writes three levels into the build: nothing generated is committed except `lumina/`. They
head the front page, under *Emberfall's own, in Luminati's light*.

![Thornwick in Luminati, the catalogue, the encounter](./img/lumina/ours.jpg)

*Thornwick at dusk: the square with Hale & Daughter's forge, the Crossed Keys and the well; a farm, the mill and the
wall. The Scrag Warren with Auto lit, the party in the HUD, our skirmishers and hexer at the door. The catalogue:
houses and belfries, the boats, trees and crags, Emberfall's cast and its foes. (Captured on software WebGL.)*

### 3.1 Thornwick, converted from the game

The converter builds the town with the game's own code: `createSim(seed, …, { scene: 'town', region: 'vale' })`, the
same world the game plays. It reads:
- every tile's ground (`world.tmat`);
- every placed piece and its footprint (`world.structs`, `sim/envfoot.js`);
- the services and their names, the townsfolk's posts, the square, the roads.

**Scale.** Our tile is half a Luminati unit. A 56-px figure stands 3.5 of our tiles and 1.75 of their units (at
`EMBER_PPU` 32), so the town keeps its proportions. The crop is the walled town and the farms east of it, out to the
Vale road: our tiles −12…168 by −16…128, 90 × 72 of theirs.

| Ours | In Luminati |
|---|---|
| Ground: grass, dirt, cobble, field | `g` (some `G` and `f`), `.`, `c`, `F`. Each of their tiles is four of ours; the most of them wins, and a road or a field wins a tie with grass. The undergrowth's flowers become `f` tiles |
| The curtain wall, its eight towers, the east gatehouse | raised stone terrain (`k`): the wall 2 units over the ground, the towers 3. A cliff nobody climbs. The Vale road is kept open through the gate, which is a gap in the wall (Luminati has no gatehouse) |
| The 17 buildings | `house`. The five services carry their names. Walls and roofs follow the piece: stone and slate for the Shrine and the forge; stone and timber for the Crossed Keys; timber and thatch for the Tired Mule; plaster for Wendel's; timber, plaster, log and planks under thatch for the homes, workshops and farms |
| The forge out front | two `smithy` pieces, the forge and the anvil |
| Trees, rocks, fences | `tree` (oak, autumn, birch, pine; dead as `deadwood`), `rock`, `fence` lines: 17, 11 and 5 |
| Props | the two wells, two lampposts, the windmill, the food stand (`marketStall`), the carts, handcart and wheelbarrow (`debris` cart), the lumber and woodpile (timbers), barrels, crates, sacks, the table, the bench, three haystacks, the hens (`critters`) |
| The nine townsfolk | `npc` at their posts, each in their own look (`spec.emberActor`). Their lines are read from their compiled Ink (`inkjs` at build time): a first meeting, then a later one. A line that names the hero is left out, because Luminati has no hero name |
| Places | regions: *Thornwick* (the Hollow Vale), *The Square*, and each service by name |

**Left out:**
- the sheep: Luminati's critters are chickens, cats, birds and dogs;
- the pumpkins and the wheat: the fields are farmland tiles;
- the grove ring round the town, which falls outside the crop. Luminati's forest border stands in.
- No hiring board, shop or quest: Luminati has none of our rules (§5).

### 3.2 The catalogue

There was no catalogue. Luminati's level editor has an object palette, but nothing shows the assets standing in the
world. The level *The Catalogue* now does. It's generated from Luminati's own `ObjectCatalog.js`, so a type or a kind
added at a new pin shows up in its row.
- Every exhibit has a signpost in front naming it as the level format writes it (`house · wall stone_brick · roof
  roof_red`, `tree · kind juniper`), so a level can be written by hand from what you see.
- Each row is a region, and its plate names the row as you walk in.

| Row | Exhibits |
|---|---|
| Houses: the walls | 11, one for each wall texture (the roofs in turn) |
| Houses: the roofs and the forms | 10: each of the 6 roofs; two storeys, the gable to the front, a flat roof, a ruin |
| Buildings | 11: the windmill, 2 wells, 2 market stalls, 6 belfries |
| Trees | 13 kinds |
| Stone | 13: 6 rocks, 6 crags, the haystack |
| Light and fire | 15: 2 lampposts, the wall torch, the campfire, a point light, 4 fires, 6 monuments |
| Props | 15: bench, barrel (standing, lying), crate, crate stack, flower box, signpost, sacks, 7 kinds of debris |
| Indoors | 15: bed, tables, chair and stool, shelves, hearth, counters, rug, staircase, wardrobe and drawers, window |
| The smithy | 6 |
| Fences, bridges and boats | the fence, a bridge over a channel, 3 garlands, 3 ships on a pool, a waterfall off a stone step |
| Life in the air and underfoot | 4 critters, 10 emitters |
| The ground | every tile type in the legend, water and stairs included |
| Emberfall's cast | all 72 baked actors as Luminati draws them: 33 heroes and townsfolk, 19 foes, 20 bosses. Talk to one for its id |

The combat pieces (enemies, chests, waystones, the sky dragon) are left out, because an enemy turns a level into a
fight. They're in the encounter and in Cinderwatch.

### 3.3 The encounter, and the autobattle

**The Scrag Warren** (world doc §3): the hill goblins' door at the foot of the range, an old adit with a horse skull on
its cap, in the Reach since v1.32.
- **The party** is GDD §7.1's right one, fighter, rogue and cleric:
  - Brannoc (Luminati's greatshield, *guardian*);
  - Wren (ranger, *hunter*);
  - a Lantern Guild cleric (cleric, *support*).
- **How they join:** as the level opens (an `arrive` event: `party join …`). They fight by Luminati's party AI.
- **Their lines:** Brannoc's and Wren's come from their Ink, as once joined. The cleric's is the Lamp rank's line in
  `content/companions.json`.
- **The goblins:** 13 in four bands. 4 skirmishers (level 4) on the spoil heap, 3 archers (5) on the shelf, and 4
  skirmishers (5) and 2 hexers (6) at the door, all drawn as ours.

**The autobattle** (`ember/autobattle.js`) is the hero's side. It drives the player through Luminati's own combat hooks
(`window.__game.combat`: `move`, `aim`, `press`, `path`), so it keeps to the same paths, cooldowns and guards a thumb
would:
- the target is the nearest foe, one already fighting first, kept while it lives;
- out of reach, it walks there, along the walk grid when a cliff is in the way;
- in reach, it swings, with a skill in turn every 2.6 s;
- it drinks a draught under 40 % HP, and dodges away from a burst of damage.

The **Auto** button turns it on and off. The front page's link starts it on (`&auto=1`). Touching the world takes the
hero back. It works in any fight, Cinderwatch's too.

**Measured** with the Knight, on the manual clock: the engine stopped and stepped at 1/60 s without rendering, the
autobattle ticked every 6 frames.

| Run | Cleared | Lowest HP (sampled every 5 s) | Draughts | Hero level |
|---|---|---|---|---|
| Auto on, goblins at levels 2–3 (9 goblins) | all, in 35 s | the hero 96/112, Brannoc 99/120 | 0 | 1 → 3 |
| Auto on, levels 3–4 (13) | all, in 45 s | the hero 98/124, Brannoc 101/120 | 0 | 1 → 3 |
| Auto on, levels 4–6 (13, shipped) | all, in 45 s | the hero 91/100, Brannoc 91/120 | 0 | 1 → 4 |
| Auto off, the hero idle at camp | nothing: the party keeps to its leader, out of the goblins' reach | full | 0 | 1 |

It's an easy fight at any of these levels. Luminati's party heals and levels up fast, and a level-up refills HP. The
difficulty is Luminati's numbers, not ours. Raise the levels in `levels.mjs` for a harder one.

## 4. Build and deploy

- **Build:** `node tools/lumina/build.mjs`.
  - It checks out Luminati at its pin into `tools/lumina/.work/` (ignored by git) and runs `npm ci` there.
  - It stages `tools/lumina/ember/` (our files, the six levels, Luminati's licence), writes our three levels
    (`levels.mjs`) and the list of baked actors (`actors.js`), runs Vite, and writes `lumina/`.
  - `node tools/lumina/levels.mjs [id]` prints what each of our levels holds, without building.
- **Size:** 4.0 MB in all. The Japanese and Chinese font slices, 15 MB of Luminati's own build, are left out: they're
  fallbacks behind Google Fonts for pages in those languages, and the prototype is in English.
- **Deploy:** `lumina/` is committed: the site has no build step (`netlify.toml` publishes the repo as it is). Never edit
  it; rebuild. `lumina/BUILD.txt` names the pin.
- **Dependencies:** three.js, Luminati and Vite live only inside that build (architecture A16). The game's own pages
  don't load three.js, and A2 (Emberlit) stands for the game.

## 5. What's rough, and what would come next

- **The facing is ours, the turning is Luminati's.** Our eight octants are drawn (§6), but the four-way facing that
  bounds them is still Luminati's choice, with its own hysteresis. Our animator also steps a turn through the octants in
  between (`render/anim.js`, 55 ms a step); here a turn cuts straight to the new row.
- **Emberfall's view on Luminati's worlds.** Their levels were laid out for a camera looking north: the forest border's
  open south edge, the facades facing +Z, the roofs the north camera sees past (their level checks). Seen from the
  south-east, a border's east side can stand between the camera and the play. Our own levels are laid out for it.
- **Pixel scale.** Our figures are baked at 56 px against Luminati's 28-px people and painted props. Up close they're
  finer-grained than the world round them. Two fixes: re-bake our actors at Luminati's density for this look, or draw
  the world at twice Luminati's.
- **Our normal maps** could feed Luminati's sprite lighting for the same rim light and shading as in Emberlit.
- **Our rules aren't in it.** No waves, quests or saves of ours. The fights (Cinderwatch, the Scrag Warren) are
  Luminati's combat system and party AI with our faces. Its numbers aren't ours either: the encounter is easy (§3.3). A real port would put Luminati's renderer under Emberfall's sim, and that is the larger decision (the
  game's renderer is Emberlit, A2).
- **Speed.** This sandbox has no GPU (software WebGL), so it measured nothing useful: about 1.5 frames a second at
  390 × 844 × 2. Luminati's own resolution governor scales its render. Try it on a phone before deciding anything.

## 6. The main game's view

The owner: *"What about matching the camera and isometric rotation in the main game?"*

Emberfall is 2:1 isometric (`src/render/iso.js`). Its diamonds and its actors are baked by an orthographic camera at
30° pitch and 45° yaw (`tools/actor-lab/lab.js`): seen from the south-east, one world axis runs down-right and the
other down-left. Luminati's camera looks north (yaw 0, from +Z) through a 28° lens. The prototype now opens every world
in **Emberfall's view**. The front page's *Seen as* switches to Luminati's (`?view=luminati`).

![The same corner of Thornwick's square: the game, Emberfall's view, Luminati's view](./img/lumina/views.jpg)

*The square from the hub, on a phone. Left, the game (Emberlit). Middle, Luminati in Emberfall's view: the same
corner, the well and the table below the hero, Wendel's and the Crossed Keys to the right, the smithy to the left.
Right, Luminati's own view, looking north.*

| | The game | Emberfall's view | Luminati's view |
|---|---|---|---|
| Yaw | 45° | 45° | 0° (north) |
| Pitch | 30° | 30° | 32° |
| Lens | orthographic | 14° (near-orthographic) | 28° |
| Distance | — | 99 u | 30 u |
| A figure, of a phone's height | 1/16 (52 of 844 CSS px) | 1/17 | 1/10.5 |
| Depth of field | none | the band 62 % of the screen, 16 u deep | the band 30 %, 6 u deep |

**The camera** (`ember/view.js`; the build tags Luminati's `Game.js` and `DebugControls.js` to take it):
- **Yaw 45°.** Screen right is then world +X −Z and screen down +X +Z, exactly as `iso.js` projects our x and y.
  Thornwick is laid out on X = our x, Z = our y (`levels.mjs`), so the town sits on the screen as it does in the game.
- **Pitch 30°**, the bake's.
- **A 14° lens**, near-orthographic like the bake. The distance frames a figure as the game does on a phone: 1.75 units
  seen a cos 30° shorter, a sixteenth of the height, so 99 units for Luminati's default 30. A level's own distance keeps
  its ratio, so the encounter (24) stays closer.
- **The depth of field** is opened out to match: our game has none, and the near-orthographic view spans two to three
  times the depth on the screen that Luminati's does. The square is sharp; the far roofs and the near hedges soften a
  little.
- **Unchanged:** the stick and the keys walk screen-true at any yaw (Luminati's move basis follows the camera), Q / E
  still turn it within Luminati's ±60° arc, and the wheel and pinch zoom.

**The eight facings.** Our atlases have a row for each screen octant (0 E, 1 SE, 2 S … 7 NE); Luminati's sheets have
four (down, left, right, up), chosen by every system it has: walking, talking, combat, the party.
- The four stay Luminati's state.
- When one of our sheets shows a frame, the row drawn is the octant of the sprite's heading on the ground since its last
  frame. It's measured as our animator measures it (`render/anim.js`: screen right and screen down at the camera's yaw,
  a hysteresis of 0.62 of an octant).
- The octant is kept within the quarter of Luminati's own facing, so a turn to talk or to swing wins. A sprite standing
  keeps its octant.
- It works in both views. Luminati's own monsters keep their four.

**Measured** on the manual clock (the engine stopped, stepped 1/60 s unrendered): from the square, each of the stick's
eight directions for 0.75 s draws that screen octant's row, 8 of 8, in both views. The browser suite checks the camera
and the eight rows.
- With the hero teleported between directions on the real clock in this sandbox (about 1 frame a second), only one or
  two frames were drawn after each jump, too few to see a turn. That is why the check steps the clock instead.
- The encounter in Emberfall's view: all 13 goblins cleared in 40 game seconds, nobody down.
