# Art critic pass: the Cinder Reach's cast

The owner, on [reach-plan.md](./reach-plan.md): make the Reach playable, with "new NPC models" and critic passes.
This pass builds and reviews the people and foes of Act III (world doc v1.53 §3.3):

- **Ashgate's named people:** Charter-Reeve Dagny Coalbrook, Hob, Gunnar Slagg, Old Brannagh, Mother Coke, Bel
  Ruddle, Haldor Ironmonger, Widow Pellam and Wynn Sallow (`npc_dagny` … `npc_wynn`, variants N18–N26).
- **Ashgate's crowd:** four miners and mill-hands (`npc_miner_1..4`, MN1–MN4), who take the villagers' place in
  any town of the Reach (`renderer.js` `crowdLook`).
- **The found companion:** Tamsin Coalbrook, mage-smith (`hero_tamsin`, CP3).
- **The Cold Seam's foes:** the slag hauler (`enemy_hauler`, RE1, sim kind `hauler`) and **Gritch, called the
  Foreman** (`boss_foreman`, CR9, sim kind `foreman`), the code-built goblin in a dead foreman's brass lamp-hat.

**Status: Implemented** (2026-11-16). Part two, the rest of Act III's cast: below.

## How it was measured

- **The Stage on Luminati** (`node tools/capture/stage.mjs --show cast --cast …`): every new actor in a real
  dungeon room, beside the knight (a man's height), Dace Pike (a townsman of the Fens), the Vale's goblin, the
  Redhand brute and Old Skarn. Idle, and the foes' attack and heavy blow. The crops are ×2 of a dpr-2 capture, so a
  figure is about the size it is on a phone.
- **The windows' art**: the portrait (`.face.png`) and the character-window figure (`.fig.png`), from `bake.cjs`.
- **The Foreman close up**: `node tools/actor-lab/creatures-sheet.cjs --only foremanf,foreman` (two new rows),
  from the game's camera and through every clip.
- **The swatches**: before choosing colours, each tile of the Barbarian, Rogue and Mage textures was painted
  magenta in turn and rendered, so every repaint below names the part it changes.

Scores are out of 10: **silhouette** (does it read as itself at 56 px, in shape alone), **palette** (does it sit in
the Reach's ash, slag, rust and ember, and stand out from its neighbours) and **story** (does it say who they are).

## Round 1: the first build

![Round 1 at play size](img/reach-cast/r1-play.jpg)
![Round 1 portraits](img/reach-cast/r1-portraits.jpg)

| Actor | Sil. | Pal. | Story | What was wrong |
|---|---|---|---|---|
| Dagny | 7 | 7 | 7 | Short and broad reads; the chain of office a bright V. Good. |
| Hob | 5 | 4 | 4 | Rogue_Hooded's own hood has a mask over the mouth: a thief, not a fixer. Near-black against the floor. |
| Gunnar | 5 | 5 | 6 | The kit's Mug is a white-striped drum held to the face. His soot beard disappears under the chin. |
| Brannagh | 7 | 5 | 7 | The lamp reads. The Mage kit's **orange belt and teal phials** shout on a plain shawl. |
| Mother Coke | 6 | 4 | 6 | Beads read close up; orange belt and phials again; near-black at play size. |
| Bel | 6 | 6 | 6 | Apron and mug read. |
| Haldor | 5 | 6 | 5 | The face kit's "full" beard is a scarf at the chin and is hidden from the camera: a bald man in an apron. |
| Pellam | 6 | 5 | 6 | Hood and keys; the Mage kit's belt again. |
| Wynn | 6 | 6 | 5 | Scales read. The sleeve garters are inside the sleeve. |
| Tamsin | 6 | 6 | 5 | A smith (apron, hammer, tongs). Nothing says mage. |
| Miners | 6 | 5 | 6 | Cap, lamp-cap, kerchief and pick read. The dwarf-folk have no beard from above. |
| Hauler | 5 | 3 | 5 | Big, but the hod sits low behind his back and is lost; brown-black all over. |
| Foreman | 9 | 8 | 8 | The hat is the read at once. But set square on, its brim hides his whole face from the camera. |

## Round 2: what changed

- **The Mage kit's belt and phials put out** (tiles 5,0 6,0 2,2 6,2 repainted to leather and stone) on every robe:
  Brannagh, Mother Coke, Pellam, the mill-hand and Tamsin.
- **The dwarf-folk's beards** (`props.js` `greatBeard`: `beardcopper`, `beardbraids`, `beardrust`,
  `beardchestnut`): a long bib from the jaw over the breast, worn on the head under the face's own beard. The
  Slagborn braid theirs and ring them in brass. `wear` takes a list now (`figure.js`), so a miner wears a lamp-cap
  and a beard.
- **Gunnar** holds the pewter mug (Maudry's), not the kit's.
- **Hob** in the plain Rogue with the rogue's open hood worn as a helm (`gear: { helm: hood }`, fitted to the painted
  head): his face shows, smirking; a brown hood over a bottle-green coat.
- **Wynn's garters** bigger and redder, on the upper arms.
- **Tamsin** wears the Mage hat in her coat's soot, so the mage reads at once over the smith's apron, hammer and
  tongs. Her hammer is her focus: its faces and a seam round its head glow.
- **The hauler's hod** raised up over his shoulders and its wood lightened; his shirt is ash-grey.
- **The Foreman's hat** smaller (r 0.155 → 0.145) and pushed back on his head (0.32 rad).

![Round 2 at play size](img/reach-cast/r2-play.jpg)

| Actor | Sil. | Pal. | Story | Left over |
|---|---|---|---|---|
| Haldor | 8 | 8 | 8 | — the copper spade beard is the read |
| Gunnar | 7 | 7 | 8 | grey braided beard, hidden mug |
| Hob | 6 | 6 | 7 | the hood's mask (fixed in this round's second half: the open hood) |
| Tamsin | 7 | 7 | 7 | mage and smith both |
| Hauler | 6 | 5 | 6 | the hod now over the shoulders, embers lit |
| Foreman | 9 | 8 | 8 | close up, the brim still a sun hat's |

## Round 3: the Foreman, and the shipped bake

- **The brim** narrowed to a hard hat's (×1.32 → ×1.16 the crown) and the hat tipped further back (0.4 rad): his
  red eyes and grin show under it from the game's camera.
- Everything baked for real (`bake.cjs`), `models.mjs` (cast.json) and the Luminati vendor rebuilt.

![The Foreman, round 2 (top) and 3 (bottom)](img/reach-cast/foreman-r2-r3.jpg)
![Shipped, at play size: idle, then the foes' heavy blow](img/reach-cast/final-play.jpg)
![Shipped portraits](img/reach-cast/final-portraits.jpg)
![Shipped character-window figures](img/reach-cast/final-figures.jpg)

| Actor | Sil. | Pal. | Story | Read at 56 px |
|---|---|---|---|---|
| Dagny | 8 | 8 | 8 | short, broad, grey, the brass chain and seal, the charter |
| Hob | 7 | 7 | 7 | lean, a brown hood, green coat, brass buttons |
| Gunnar | 8 | 7 | 8 | heavy, a braided iron-grey beard, a wine coat gone dull, the mug |
| Brannagh | 8 | 8 | 9 | stooped, white bun, olive shawl, a lit miner's lamp |
| Mother Coke | 7 | 7 | 8 | the smallest, bent, soot-black, three strings of beads, a crook |
| Bel | 7 | 7 | 7 | broad, auburn, a linen apron, a mug |
| Haldor | 9 | 8 | 9 | short, broad, bald, a great copper beard, apron, hammer |
| Pellam | 7 | 7 | 7 | a black hood and dress, the keys |
| Wynn | 7 | 7 | 8 | blond, shirt-sleeves, red garters, the brass scales |
| Tamsin | 8 | 8 | 8 | a soot mage's hat, copper and freckles, a smith's apron, a glowing hammer, a billet in the tongs |
| Miners | 7 | 7 | 7 | two men, two dwarf-folk; cap and pick, lamp-cap and lamp, a rust kerchief and pail, a braided rust beard |
| Hauler | 7 | 6 | 7 | a head over a man, the hod of slag over his head, its embers lit, a coal shovel |
| Foreman | 9 | 9 | 9 | a goblin under a lamp-hat made for a man, its lamp lit, ears out under the brim, a tally-stick |

Numbers: the Foreman is 13,324 triangles in 3 draws (the goblin's 10,884 in 2: the lamp's glass is a glow of its
own colour, `creatures.js` `Rig.mesh`). The dwarf-folk are KayKit's Barbarian (Tamsin and the crowd's mill-hand the
Mage) on a `frame` of their own: thighs 0.7 and shins 0.72 of the heroic, the hips 1.16 wide and 1.12 deep (a scale
may be `[x, y, z]` now), the head given its width back, and fitted at 0.72–0.82 of a man.

## Still open

- **Hob** in play shows his hood's shadow under his chin, which can read as a dark beard.
- **Mother Coke and Old Brannagh** are close in shape (old, bent, robed, white-haired); their props (beads and crook,
  lamp) and size keep them apart, not the outline.
- **Tamsin's hat** hides her copper hair; only the fringe of freckles and the topknot's colour in the portrait say
  Coalbrook. If she takes a staff or wand as gear, it replaces the hammer (as any member's weapon does).
- Not seen in Ashgate itself yet (the town is being built alongside); these were judged in a dungeon room.

## Part two: the rest of Act III

The owner on the build sheet ([reach-plan.md](./reach-plan.md), "Ok do all of this"): every foe, boss and person the
rest of the Reach needs, as models, with the two new silhouettes (the cinder hound and the forge-wight) given the most
of the critic's attention. Variants RA1–RA5, RB1–RB4, CR10–CR11, N27–N28.

| Actor | Sim kind | Built from |
|---|---|---|
| `enemy_assay_guard` | `assay_guard` | the Knight in the Kell Assay's grey and brass, the scale-and-pick badge on the breast (`assaybadge`), sword and badge-shield |
| `enemy_assay_xbow` | `assay_xbow` | the hooded rogue in the same grey and brass, a heavy crossbow, the badge |
| `enemy_renegade` | `renegade` | the Barbarian on the dwarf-folk's frame, soot and rust, a full soot beard with its braids hacked short (`beardcut`), a war-pick |
| `enemy_forgewight` | `forgewight` | **new silhouette:** an Ashbound warrior with helm and cloak off, its bones charred, a forge apron, two great leather gauntlets, a sledge with a hot face; the binding's fire through its ribs (`embercracks`) and its eyes ember |
| `creature_cinderhound` | `cinderhound` | **new silhouette:** `creatures.js` `hound`, a lean long-legged quadruped on the rat's rig layout, a ridge of ash hackles lit at their tips, lit seams, an open lit mouth, an ember-tipped tail; clips keyed in code (a lope, a lunge-bite, a snap, a spring, a howl) |
| `enemy_furnacepriest` | `furnacepriest` | the acolyte's charcoal and ember, a leather apron over it, a lit censer swinging (`censer`) |
| `boss_weighmaster` | `weighmaster` | the Barbarian, well-fed (chest ×1.18), a good grey coat, black over-sleeves, the Assay's badge, a brass scale-pan on a chain (`scalepan`, hanging: the flail) |
| `boss_oruth` | `oruth` | an Ashbound warrior on a dwarf's frame (short legs, hips ×1.25), 1.2× a boss's height, his horned helm kept, an ash beard to his belt (`beardash`), forge apron, the binding's shackles with broken chain, the great brass-banded hammer, ember eyes |
| `boss_morrow_vane` | `morrow_vane` | the Rogue, lean, a long dark coat (the cape), dark gloves, grey at the temples and smug, the ledger under one arm, a sword-cane |
| `boss_stoker` | `stoker` | the furnace-priest heavier, a leather soot-mask over mouth and nose, the furnace rake red-hot at its hook, a great censer at his belt |
| `boss_furnace_nine` | `furnace_nine` | `creatures.js` `furnace`, on the golem's bones and KayKit's rig: a banded iron furnace-belly, a grated mouth lit across its front, molten seams, a stack for a head with two slots of fire, smoke, pipe arms with tong hands, stove feet; baked at 73 px, 2 men tall, and drawn ×1.54 (`renderer.js` BIG) to the Kingstone's four men |
| `npc_nan_ruddock` | (people) | the Barbarian in the Redhand's red, the brute's kettle hat, hard-faced and scarred, a halberd carried upright |
| `npc_clerk` | (people) | the Rogue in Assay grey with its badge, spectacles (`specs`), ink on his cheek, worried and wide-eyed, stooped over his ledger |

### Round 1

![The hound, round 1](img/reach-cast/hound-r1.jpg)
![Furnace Nine, round 1](img/reach-cast/furnace-r1.jpg)
![The humanoids, round 1](img/reach-cast/act3-figures-r1.jpg)

| Actor | Sil. | Pal. | Story | What was wrong |
|---|---|---|---|---|
| Cinder hound | 5 | 4 | 5 | A row of flat plates down its back read as boards; brown-black all over; the head small, and hung under the chest from the front |
| Furnace Nine | 7 | 5 | 7 | A stove that walks, good; but the rust hash covered its legs and read as red trousers; the mouth small for what reads of it; the smoke a stack of dark balls; thin arms |
| Forge-wight | 5 | 6 | 5 | The Ashbound warrior's horned helm and red cloak kept: a viking skeleton with an apron. The cracks hidden under the cloak |
| Assay guard and crossbowman | 6 | 5 | 6 | The grey nearly black; the brass trims and badge read |
| Weighmaster | 6 | 5 | 6 | The pan reads; the coat nearly black |
| Oruth | 8 | 7 | 8 | The ash beard makes him a dwarf at once; the hammer and chains read. The cloak hides the cracks |
| Morrow Vane | 6 | 7 | 7 | Coat, ledger and face read; the sword-cane a hair's width |
| Stoker, furnace-priest, renegade, Nan, the clerk | 7 | 7 | 7 | Each reads by its prop: rake and mask, censer, beard and pick, kettle and halberd, spectacles |

### Round 2: what changed

- **The hound:** an ash-grey back over a char belly; the plates replaced by small dark crust shards; a ridge of
  **hackles**, seven jagged ash spines from the nape down the shoulders with lit tips (its read from the game's
  camera); more seams, on the legs too; the head 1.3× and raised.
- **Furnace Nine:** rust at its feet only; the belly wider (r 0.5 → 0.56); the mouth half again as big with heavier
  bars; six seams, front and back; two lighter puffs of smoke instead of three dark ones; great shoulder-pots and
  fists.
- **The forge-wight:** helm and cloak off (`hide`), so the bare charred skull, its ember eyes and the lit ribs show over
  the apron, between the gauntlets. Oruth's cloak off too; his helm kept, the ancestor's.
- **The Assay's grey** lifted (armour #8e9096, the crossbowman's coat #7e8086), the Weighmaster's coat to #8a8c92.
- **The sword-cane's** blade wider.

![The hound and Furnace Nine, round 2](img/reach-cast/hound-furnace-r3.jpg)
![The humanoids, round 2](img/reach-cast/act3-figures-r2.jpg)
![Shipped, on Luminati at play size: idle and the heavy blow (the Assay's men, the renegade, the forge-wight beside the Ashbound warrior it was made from, the hound, the furnace-priest, Nan, the clerk; the bosses)](img/reach-cast/act3-final-play.jpg)
![Furnace Nine and the cinder hound on Luminati, beside the knight and the golem (the Stage draws it at its baked 2.6 men; in its fight BIG takes it to four)](img/reach-cast/act3-furnace-hound-play.jpg)

| Actor | Sil. | Pal. | Story |
|---|---|---|---|
| Cinder hound | 8 | 7 | 8 |
| Forge-wight | 8 | 8 | 8 |
| Furnace Nine | 8 | 7 | 8 |
| Oruth | 9 | 8 | 9 |
| Assay guard / crossbowman | 7 | 7 | 7 |
| Weighmaster | 7 | 7 | 7 |
| Morrow Vane | 7 | 7 | 8 |
| Stoker | 7 | 8 | 8 |
| Furnace-priest | 7 | 8 | 7 |
| Renegade | 7 | 7 | 7 |
| Nan Ruddock | 8 | 8 | 8 |
| The clerk | 7 | 7 | 8 |

Numbers: the hound 4,444 triangles in 2 draws (21 bones); Furnace Nine 4,724 in 2 (41 bones, KayKit's rig).

### Still open

- The hound's crust shards read as dark spots close up (a leopard's), though not at play size.
- The Assay's knights in the lab's light are darker than in play (KayKit's metal without an environment); judged on
  Luminati, where the figures are matte.
- Furnace Nine's smoke is solid: it doesn't drift. An effect over its stack (fx.js) would sell it better than geometry.
- Oruth's mechanic (the anvil) and the Weighmaster's (weighing) have their effects to come in `fx.js`; each has its
  weapon's sparks here.

## Files

`tools/actor-lab/variants.json` (N18–N26, MN1–MN4, CP3, RE1, CR9), `faces.json` (15 faces), `bake.json`,
`props.js` (chain, charter, hod, shovel, pickaxe, minerlamp, minercap/lampcap, beads, garter, scales, emberhammer,
tongs, linenapron, kerchief, widowhood, the four beards), `faces.js` (a `soot` mark, NPCs only), `creatures.js`
(`foremanKit`; a glow a colour), `figure.js` (`frame` scales per axis; `wear` lists), `creatures-sheet.cjs` (the
Foreman's rows); `assets/actors/*` and `assets/models/cast.json` rebaked; `src/render/renderer.js` (`hauler`,
`foreman`, the Reach's crowd), `src/render/fx.js` (the hauler's shovel, the Foreman's claws, Tamsin's casts).
