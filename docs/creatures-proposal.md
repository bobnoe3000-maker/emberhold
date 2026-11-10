# New creatures: giant rats and giant spiders (a proposal)

**Status: Implemented (2026-11-10)** (GDD v1.58–v1.59, world doc v1.36–v1.37; the bestiary below). The owner: *"Design the best way to model and create
new NPC types - giant spiders and giant rats."* Then: *"Go with your recommendations, spiders in Wickham Keep's cellars..
rats should be 20% bigger."*

## The bestiary (2026-11-10)

The owner: *Create new creatures, red fire beetle, goblin, and a graveyard wraith (1.5x size of humanoid), stone golem (2x size of a humanoid)… Also a rat king and spider queen as boss archetypes. We can worry about where they go location wise and lore later."* And: *"Run art and fx critic rounds in these and the new rat and spiders. AAA quality fitting with the aesthetic we have now."*

![The six new: beside a man, idle, attack, heavy, death](img/creatures/bestiary-sheet.jpg)

*The model sheet (`node tools/actor-lab/creatures-sheet.cjs`), each at its height in the game beside the knight: the red
fire beetle, the goblin, the graveyard wraith (1.5×), the stone golem (2×), the Rat King and the Spider Queen.*

![All ten in the game on the Stage, idle and attacking, at the game's scale](img/creatures/bestiary-in-game.jpg)

*In the game (`stage.mjs --show cast`): the knight for scale, the vermin, the four new foes and the two bosses.*

- **Built in code** (`tools/actor-lab/creatures.js`), in the kit's style (faceted, vertex-coloured, flat-shaded, the
  KayKit cast's proportions and light), four new body plans and two bosses:

  | | Body plan | Triangles · bones | Its look |
  |---|---|---|---|
  | Red fire beetle | the hexapod (tripod gait) | 2,428 · 28 | a lacquered crimson dome going black at the tips, fire-glands over the eyes and at the tail; the cases fly wide on a glowing belly to spit; dies flipped, legs kicking |
  | Goblin | the small biped | 2,184 · 18 | a quarter of its height head, ears past its shoulders, a hooked nose, a pauldron, a rusted cleaver (extruded: a blade, not a block) |
  | Graveyard wraith | the floating shroud | 2,080 · 27 | 1.5 men; a deep cowl with two cold lights, a body that narrows and trails off behind like smoke in four bones, rags and loose motes, a soul burning behind its ribs, a manacle and chain; dies into a heap of rags |
  | Stone golem | the heavy biped | 1,144 · 16 | 2 men; mossed boulders, a head sunk between the shoulders, an ember core with cracks of light, runes in its forearms; falls apart when it dies |
  | The Rat King | the rat, crowned | 4,404 · 22 | a crown of bent nails, a ruff, a purple cape over the back, long incisors, and the knot: six rats grown together by their tails, riding the tail's last bones |
  | The Spider Queen | the spider, a brood-mother | 2,552 · 31 | an egg-sac abdomen ringed in bone with a bone hourglass, green eggs glowing under its skin, a crown of spines, long raised forelegs, sickle fangs |

- **The kit grew for them:** scale tracks (the wraith fading, the heap); `hull()`, one lathed body skinned across
  bones with blended weights (the rat's body, critic round 4); `rock()` (hashed icosahedra: the golem); glow strength a
  creature (over ~1.6 it burned out white); `lab.js` `?tall=` for a cell taller than a man's (bake.json `tall`: the
  golem 2.1, the wraith 1.6), so the atlas holds them.

### Art critic rounds

![Before and after: the rat, the beetle, the wraith, the golem, the Rat King](img/creatures/critic-before-after.jpg)

| Round | Seen | Done |
|---|---|---|
| 1 (sheet) | The beetle two flat pancakes on stilts. The goblin's cleaver a block, its green lime. The wraith a straight cone, its hem fangs, its arms rakes, its death a toppled log. The golem's core and cracks white scribbles, its head lost. The Rat King a banded grub in a beret. Every glow burnt out white | One high dome, short legs close in, a duskier red. An extruded blade, olive-grey skin, hair. Darker highlights. A bigger orange core, four thick cracks, the head low and forward. Glow per creature (1.15–1.6) |
| 2 (sheet) | The wraith a barrel; its hood read as cat's ears. The Rat King's cape strips a comb of red spikes. The Queen's eggs still white | The shroud a smoke-trail in four bones; a deep cowl. A draped blanket with a ragged hem. A sick green, and a bone hourglass on the sac |
| 3–4 (sheet) | The wraith's hood a pale mushroom. The rat a long banded loaf with a dinosaur's ridge; then a bottle with a flat rump | Darker hood. One lathed hull, pear-shaped, its rump round, skinned across four bones; a raked ridge; bigger pink ears |
| 5 (in the game) | The golem near-white under the game's figure light. Old Gutter white. The spiders' legs lost on the dark floor | The golem's stone darker (twice). Gutter grey, not pale. The spiders' legs a shade lighter than their bodies |

### Effects critic rounds

![The Rat King's swarm and the Spider Queen's call, in a hall, from the moment it fires](img/creatures/bestiary-bosses-fx.jpg)

- **Round 1** (`stage.mjs --show fx --foes …`): the party's own skills (the cleric's columns) buried the creatures'
  effects. The Stage now fights them with a **quiet** party (its skills off), cropped on the striker. Each creature's
  blows spark in its own colour (`fx.js` styles: the beetle's fire, the wraith's cold green, the golem's grit), its
  heavy blows and shots warned on the ground as every foe's are.
- **Round 2:** the golem's heavy blow had no weight for a giant of stone, and the beetle's spit landed as a plain
  spark. Now the golem's heavy blow shakes the room (a big shock ring and the Toadking's stamp jolt: style `quake`),
  and the beetle's spit bursts into fire-light where it lands (`blast`: style `burn`). The bosses' mechanics read: the
  Rat King's swarm (the knot behind him), the Spider Queen's brood called in.
- **Left for a later pass:** the goblin's and the wraith's crops in the capture (the camera holds the party; a creature
  on the room's edge falls out of a 300 px crop). Their sparks and swings are the game's grammar.

### Against the owner's references: the rat and the wraith

The owner, with two pictures of miniatures (not kept here: they're another's work): *"Use these as reference models for
the rat and wraith… keep on iterating until the 3d models look like this but in our low poly style like the other NPCs."*

- **The rat's reference:** heavy, hunched, shaggy grave rats, their heads big and snarling on long incisors, big
  clawed hands, thick ringed tails, grey.
- **The wraith's:** a skull under a hood crowned with three horns, its jaw open and its sockets lit; arms flung wide,
  gaunt, the fingers long and clawed; a shroud hanging in tatters; below the waist, flames of it twisting up round a
  point; dark, with green light on its edges.

![The rounds on the model sheet: the rat's first (quills) and last, rearing; the wraith's first, second and last](img/creatures/reference-rounds.jpg)

![In the game, close: the rats and the Rat King head-on and from the side; the wraith beside the knight](img/creatures/reference-in-game.jpg)

| Round | Seen | Done |
|---|---|---|
| R1 | A porcupine: the coat stood out in quills; brown; the head small; stick legs | The coat laid back; a cool grey; the head bigger; the forelegs thicker |
| R2 | A pine cone: an even grid of shingles | In the kit's chunky style: a few big ragged clumps where the shag is heaviest (a crest, a ruff, the flanks, the haunches), the hull smooth between |
| R3–R4 | The head still small; a long loaf from the side | The head bigger again; the forelegs thick and furred, the hands big; the body a tenth shorter |
| R5 (in the game) | A hedgehog from the camera's height: the hump and ruff hid a head hung low | The head raised over the shoulders, a thick neck; the hump and the front of the crest lower |
| R6 (in the game) | The face small under the back; the grey lifted to tan by the game's light | The head a quarter bigger again; a darker grey (and Old Gutter's); the Rat King's cape widened over the new hull, darker (it glowed magenta) |
| W1 | Rebuilt to the reference: the skull, the horned crown, the arms flung wide, the tendrils. But the skull small in the hood, scarecrow sleeves, the tendrils sticks with lit dots (spider legs) | A bigger skull forward under a brim; wide ragged sleeve drapes; big hands, long fingers; the tendrils broad tongues of flame rising off the base; the dots gone |
| W2 | Too green (a cactus); a barrel ringed in spikes | Green on the top edges only; a waist, the shroud hanging from the shoulders in a V and long down the back |
| W3 | Pipe sleeves | Bell sleeves |
| W4 (in the game) | The green lifted to lime by the game's light | A darker, greyer green: the reference's rim, not a colour |

### In the sim, unplaced

- `battle.js`: `firebeetle` (rogue: a `firespit` bolt, 8 tiles), `gob` (minion), `wraith` (warrior), `golem` (warrior,
  DEF 9, speed 2.3); `rat_king` (`swarm`, escort rats) and `spider_queen` (`call`, a spider and a spinner), at their
  mirrors' HP, ATK and DEF. No family or hall names them yet.
- Names (`content/foes.json`), actors (`renderer.js` `ENEMY_ACTOR`), bolt look, banners, voices (`audio/cues.js`).
- **The Stage fights them:** `?dev&scene=stage&show=fx&foes=firebeetle,golem` (a family of those alone for the room),
  `&boss=rat_king` (that boss in the floor's hall), `&quiet=0` to let the party's skills run.
- **Balance:** `tools/balance/boss.mjs wickham_keep 5 --floor 1 --boss rat_king` and `… 6 --floor 2 --boss spider_queen`
  (GDD v1.59's numbers). `test/bestiary.test.mjs`: the mirrors, the bosses' stats against their mirrors', every actor
  cast as a creature.

## As built

The answers to §6: the kit in code (1); the spiders in Wickham Keep's Old Cellars (2); the web damage only, no new rule
(3); Old Gutter in now, the Cutting's elite (4); the look as on the sheet (5), the rats a fifth bigger.

![The vermin in a real fight at dusk: the Old Cellars' spiders, a spinner and a rat; a grave rat in the Cutting](img/creatures/vermin-in-game.jpg)

*In the game on the manual clock: the hero kept standing in each room until its vermin were up, four frames 0.2 s apart.*

- **The sim** (`src/sim/battle.js`):

  | Kind | Mirrors | HP / ATK / DEF | Its difference |
  |---|---|---|---|
  | `rat` (grave rat) | minion | 31 / 7.2 / 3 | dodge 12, speed 4.0, reach 2.4; 1 gold |
  | `spider` (giant spider) | warrior | 55 / 9.5 / 6 | chitin, speed 3.0; the cellars' elite |
  | `spinner` | rogue | 34 / 8.4 / 3 | a `web` bolt at range 12 (damage only) |
  | `gutter` (Old Gutter) | warrior | 56 / 9.6 / 5 | the Cutting's elite, every fifth wave as any elite |

  - **Two families, not one `vermin`,** because each room mixes the vermin with what's already there:
    - `cellar` = `{ melee: ['rat', 'spider'], ranged: ['spinner', 'spinner'], elite: 'spider' }`: Wickham Keep's Old
      Cellars (`plans.js` `old_cellars`, floor 2);
    - `cutting` = `{ melee: ['cutthroat', 'rat'], ranged: ['crossbow', 'rogue'], elite: 'gutter' }`: the Old Barrows'
      Cutting (`the_cutting`, floor 1). The rat takes the risen minion's place beside the diggers.
  - None undead (Turn Undead does nothing to them). The board's bounty counts Old Gutter as the Barrows' elite he is.
  - Names for the defeat screen: `content/foes.json`.
- **The art:**
  - `variants.json`: VR1 the rat (height 0.47, a fifth over the spike's), VR2 the spider (0.54), VR3 the spinner (the
    spider smaller and paler, 0.41), VR4 Old Gutter (the rat greyer, 0.61). `bake.json`: `vermin_rat`, `vermin_spider`,
    `vermin_spinner`, `vermin_gutter`, their clips mapped to the kit's.
  - Baked: `assets/actors/vermin_*` (atlases) and `cast.json` (no GLB: the game builds them from the kit). `lab.js` bakes
    a creature's vertex colours and its own glowing eyes.
  - `renderer.js` `ENEMY_ACTOR` maps the kinds; the web's orb is a pale silk (`fx.js` `BOLT_RGB.web`).
  - Voices: the rats a goblin's squeal pitched up, the spiders a cultist's hiss pitched down (`audio/cues.js`).
- **Balance** (`tools/balance/roomlv.mjs --part`, 3 seeds, 300 s; before = the same rooms with the diggers and the cult):

  | Room | Party | Before | After |
  |---|---|---|---|
  | the Cutting at 3 | the right party at 3 | 28 waves | 28 waves |
  | the Cutting at 5 (two up) | the right party at 3 | 18.3 | 18.3 |
  | the Cutting at 1 | hero 1 and a hire | 16.0 | 19.7 |
  | the Old Cellars at 6 | the right party at 6 | 19.7 (held 3 of 3) | 17.3 (held 2 of 3, nobody Fallen) |
  | the Old Cellars at 8 (two up) | the right party at 6 | 7.7 | 9.0 |
  | the Old Cellars at 6 | the hero alone | 5.7 | 5.3 |

  The contract's room (the Breach) is untouched; `smoke-test.mjs` passes with its replay.
- **Checks:**
  - `test/vermin.test.mjs`: every kind named, none undead; each within 15 % of its role's HP and ATK; each room fills with
    its own and nothing else;
  - `test/redhand.test.mjs`, `test/models.test.mjs` (a creature names no model, its clips the kit's);
  - the browser suite: a grave rat in the Cutting stands as its model (`world.js` `stats.modelNames`).

*The proposal as it was put follows.*

![The giant rat and the giant spider, built in code, beside the KayKit knight and through their clips](img/creatures/creatures-spike.jpg)

*The spike's model sheet (`node tools/actor-lab/creatures-sheet.cjs`):*
- *each creature beside the KayKit knight at the size the cast would give it, then through its clips;*
- *the game's camera angle (45° round, 35° down) in a torch-lit room;*
- *every frame posed through `figure.js` `pose`, as the bake and the game pose a figure.*

## 1. What we have

- **Every foe is a man.** All 76 actors in `tools/actor-lab/bake.json` are KayKit's humanoids (knight, barbarian,
  rogue, mage, the four skeletons), recoloured, re-dressed and re-proportioned (`variants.json`, `figure.js`). One
  builder, `figure.js` `build`, makes each:
  - the bake (`lab.js`) draws it into its atlas: the sprites, `?figures=sprites`, the Frontier;
  - the game stands it in Luminati's world as a skinned model (`tools/render3d/world.js`, from `assets/models` and
    `cast.json`);
  - the animator (`render/anim.js`) picks a clip (`idle`, `walk`, `attack`, `heavy`, `hit`, `death`…) and a frame;
    the model plays the KayKit clip `cast.json` maps it to.
- **KayKit has no beasts.** A man can't be bent into a spider, or a rat without looking like a man on all fours. The fen
  ghoul is as far as bending goes.
- **Canon:**
  - **Grave rats are canon:** the world doc's Beasts family (§8), and the GDD's bounty *"Old Gutter, a grave rat the size
    of a dog, is eating the dead in the Barrows."* The world doc already plans the beasts "on one shared quadruped"
    (war-hounds, wolves, boars, snow-wolves) and "at most two new silhouettes a region".
  - **Spiders are not.** They go into the world doc first, where and whose (§6, question 2).

## 2. The ways to get a beast, weighed

| Way | For | Against |
|---|---|---|
| **A free animated pack** (e.g. Quaternius' CC0 animals and monsters) | Real animation; quick if it has the beast | Its own rig and clip names per pack; another hand's style beside KayKit's; can't be fetched here (itch.io and OpenGameArt are blocked to this environment); a dependency row; what the pack lacks (a giant spider with our clips) we'd still have to make |
| **Bend a KayKit man** (as the fen ghoul) | No new pipeline | No spider; a rat on a man's skeleton walks like a man |
| **Luminati's own pixel monsters** (its procedural sprites) | They exist | Flat cards, against the art standard the landmarks set (built in 3D, lit, shadowed) |
| **Our own creature kit, in code (recommended)** | Our style; nothing downloaded; one rig per *body plan*, its species by parameters; clips made to our clip names; deterministic; flows through the bake, the cast and the 3D figures unchanged | The animation is ours to tune (the spike's is a first pass) |

## 3. The recommendation: a creature kit in code

`tools/actor-lab/creatures.js`, in the same spirit as the env kit (`buildkit.js`): the catalogue is code.

- **A rig per body plan, not per species.** Each body plan is built bone by bone at its bind pose. Its parts (blobs and
  tapered limbs, faceted, vertex-coloured) are rigid on their bones in **one skinned mesh**, plus one for its glowing eyes.
  - **The quadruped:** the rat now; then the world doc's hounds, wolves, boars and snow-wolves on its proportions.
  - **The arachnid:** the spider and its kin.
- **Clips keyed in code**, named as the cast wants: `Idle`, `Walk`, `Attack`, `Attack2`, `Heavy`, `Hit`, `Death`,
  `Cast`. They're sampled at 24 fps from small functions:
  - the rat scurries on its diagonal pairs;
  - the spider walks the alternating tetrapod gait, four legs down while four swing;
  - each rears, lunges and dies its own way: the rat rolls onto its side, the spider curls its legs in under it.
- **One seam:** a variant names `creature: { kind: 'rat', … }` in place of `model`.
  - `figure.js` `build` returns the creature in the shape it returns a KayKit model in (`{ root, mixer, clips, frame }`).
  - `pose` leaves a creature's proportions alone (the heroic pass is a man's).
  - Nothing else changes: the bake bakes its atlas, `models.mjs` writes its cast entry (no GLB to prune), world.js stands
    it in the world, and the animator drives it.
  - Its size is the variant's existing `height` (a man is 1).

**Measured (the spike):**

| | Triangles | Draws | Bones | Height |
|---|---|---|---|---|
| Giant rat | 1,680 | 2 | 22 | knee-high, a third of a man; nose to tail-tip 1.4 men |
| Giant spider | 1,876 | 2 | 31 | waist-high; its legs span 1.5 men |

- A room of six: about 11,000 triangles and 12 draws, under a figure's budget.
- `luminati.js` 135 → 139 KB gzipped with the kit in it.

## 4. The two creatures

- **The giant rat:**
  - **Look:** a grave rat the size of a dog: hunched, the haunches broadest, a mangy ridge down its back, a bare ringed
    tail curling to the ground, round bare ears, yellow teeth, eyes like coals.
  - **Clips:** it scurries, lunges to bite (`Attack`), rears and claws (`Attack2`), leaps (`Heavy`), squeals (`Cast`, if
    a rat should ever call) and rolls over dead.
- **The giant spider:**
  - **Look:** a cellar spider grown wrong: low and wide, eight banded legs, a swollen dark abdomen with a pale mark down
    it, eight eyes catching the light, the fangs working.
  - **Clips:** it walks, rears and strikes (`Attack`), bites (`Attack2`), pounces (`Heavy`), spits a web (`Cast`) and
    dies with its legs curled.
- **Variants by parameters:** the fur, belly, body, banding and eye colours and the seed are parameters. A *spinner*,
  smaller and paler, is the same spider at a smaller `height`. **Old Gutter** is the rat at a bigger one, greyer.

## 5. In the sim (the balance contract holds whoever fills a wave)

Each new kind mirrors a role's strength, as every family has (`battle.js`, GDD §7.1). The waves get harder in kind, not
in sum.

| Kind | Mirrors | Its difference |
|---|---|---|
| `rat` (giant rat) | the minion | quicker and lighter (HP about 30, dodge 12, speed 4.0), a short reach; vermin carry little gold |
| `spider` (giant spider) | the warrior; the family's elite | chitin (DEF 6), slower; its heavy blow a pounce |
| `spinner` (a smaller spider) | the rogue (ranged) | spits a `web` bolt |

- **The family:** `vermin` = `{ melee: ['rat', 'spider'], ranged: ['spinner', 'spinner'], elite: 'spider' }`, none of
  them undead (Turn Undead does nothing to them).
- **Mixed into what's there:** grave rats in the Old Barrows' rooms with the diggers (they eat the dead, and the dig
  turned them up).
- **Old Gutter** as the bounty's named elite (GDD §16's board), at the elite's stats.
- **Checks:** the room-level harness and the boss harness on a `vermin` room before and after, and the smoke test's
  contract.

## 6. Questions for the owner

1. **The approach:** our own creature kit in code (recommended), rather than a downloaded pack?
2. **Where the spiders live** (canon; the world doc first). Candidates:
   - Wickham Keep's second floor, "a castle then a cave": its cellars gone to the spiders, and the Redhand won't go down;
   - the Sunken Chapel's flooded undercroft;
   - a Fens site (webs over the meres).
3. **The spinner's web:** damage only, as every other bolt (no balance change), or a short root on the one it hits (the
   heroes' Binding Roots' status turned on them: a rule, so a balance run)?
4. **Old Gutter:** in now, as the Barrows' bounty elite?
5. **The look:** the rat and the spider as on the sheet, or more grotesque (bigger fangs, a skull-mark, sores), or less?

## 7. The work, if approved

1. **The world doc:** the spiders' place and lore; the grave rats' look (§8).
2. **The sim:** the three kinds, the family, where they fill waves; Old Gutter; the balance runs. Tests: the kinds'
   stats mirror their roles (as the Fens' test does).
3. **The art:**
   - `bake.json` and `variants.json` entries naming `creature`, re-baked (atlases, `cast.json`);
   - a `web` bolt's look (`skillfx.js`);
   - a squeal and a hiss (`tools/audio/synth.mjs`, no download);
   - the animation tuned on the manual clock (burst frames of each clip in a real fight: `tools/capture/skills.mjs`'s way).
4. **Checks:** the browser suite (a creature stands as a model and plays its clips); a capture sheet in a room at dusk.

## The spike, in the code

- `tools/actor-lab/creatures.js`: the kit, `buildCreature({ kind, … })`: the rig, the parts, the clips.
- `tools/actor-lab/figure.js`: `build` returns a creature for a variant naming one; `pose` keeps a creature's proportions.
  Inert until a variant names a creature.
- `tools/render3d/build.mjs` stages `creatures.js` with `figure.js`.
- `tools/actor-lab/creatures.html`, `creatureslab.js`, `creatures-sheet.cjs`: the model sheet above.
- No node test: `three` resolves only under `tools/actor-lab`, which CI doesn't install. The sheet is the spike's check.
