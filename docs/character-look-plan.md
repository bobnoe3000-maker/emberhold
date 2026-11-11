# The character's look: faces, bodies, a live preview, and gear on the figure (a plan)

**Status: Building (2026-11-10;** the owner: "Lets enhance the character model engine… face shape, eyes, eyebrows, mouth, nose, ears, hair color, body size/shape (during character creation AND later if I want in the temple for a gold fee)… gear should have more variability… characters should show what they have equipped… evaluate performance… optimize without any visual quality degradation - especially in gameplay"**).** The live preview is in creation (§5); the rest is being built in §9's order, measured as in §11. It supersedes the parked
[character-customization-proposal.md](./character-customization-proposal.md) (2026-09-29), whose findings it keeps.

The owner: *"create a plan to enhance the kaykit characters so that players can customize the face (types of eyes, nose,
mouth, eyebrows and shape), body types (shape); and also on the character tab the character preview should be a live
image (idle, attack movements); and also all of the gear items should be expandable - different colors and luminosity or
other fx for special gear; gear items should show equipped in play and in the character preview model, propose any
missing gear items that need to be created"*.

## 1. Where we are

Much of the parked proposal is now cheaper, because the world has since moved to 3D models (4b, A20).

| | Today | Source |
|---|---|---|
| **Faces** | Built in code on a bald skull, in 3D, on the figures in play. They come from named presets only (51), not from a choice. The parts: 5 eye shapes, 6 brows, 7 mouths, 6 noses (KayKit's and 5), 6 face shapes, 11 hair styles × 11 colours, 7 skins, 6 irises, 5 beards, 7 marks, 2 ears | `tools/actor-lab/faces.js` `OPTIONS`; `figure.js` `facePreset`; `world.js` figureFor |
| **Bodies** | The KayKit Adventurers (Knight, Barbarian, Mage, Rogue, Rogue_Hooded) on one shared skeleton. A heroic proportion for everyone (head 0.62, longer limbs); per-variant reach, scale and height. Builds (thin, normal, thick) exist only in the mock-up | `figure.js` `HEROIC`, `applyFrame`; `body.js` |
| **A character's look** | The member's `actor` → the bake's actor → a variant → its model, accessories and face preset. Creation offers class, look (`LOOKS`), origin and name. Nothing about the face or body is the player's | `party.js` `LOOKS`; `ui/create.js` |
| **The character tab** | A still image (`<actor>.fig.png`, baked), the six slots round it. It never changes with gear | `ui/sheet.js`, `ui/actorart.js` `drawCharacter` |
| **Gear on the figure** | None. The figure wears its variant's fixed kit, whatever is equipped. The one exception: the rogue's bow or crossbow swaps in another baked figure | `party.js` (starter kit "what the model already wears"); `renderer.js` |
| **Gear's look** | An icon per base (46), a rarity colour on the slot's border, a light column over a drop. No colour, glow or effect on the item itself | `items.js`; `icons.json`; `sheet.js` `RC`; `fx.js` |
| **three.js** | Already shipped, inside Luminati's bundle (`src/vendor/luminati-80e1aa6/`), with `figure.js`, `faces.js` and `buildFigure` | `tools/render3d/build.mjs` |

## 2. What we're building

1. **The player shapes their character's face and body** at creation, and later at the temple or a barber.
2. **The character tab shows the character live:** idling, attacking now and then, turned by a drag, wearing what's
   equipped, in the same model as in play.
3. **Every item has a look,** its colours and its light by rarity and by what it is, special gear with its own effects.
4. **What's equipped is worn:** weapon, off-hand, helm, armour and boots on the figure, in play and in the preview. A
   trinket shows as a glint or an amulet.
5. **The gaps in the gear filled:** the missing pieces listed in §8.

## 3. Faces: the player's choice

**Built** (2026-11-10, GDD §6.1 v1.65): `src/sim/appearance.js` (the choices, validation, a sellsword's own look; save
v39), `createHero` `appearance`, the temple's `restyle` (40 gold); `figure.js` lays the parts over the variant's face;
`ui/lookpicker.js` (a row a part, the marks, a face at random) in creation's Look step and the temple's Change a look,
on the model bareheaded. The new parts below (more eyes, noses, mouths, brows, shapes, ears) are still to come.
**The portrait** (2026-11-10): `ui/portraits.js` keys a member's portrait by their actor and, once they've an appearance
or a helm or armour not their kit's, by those too; that one is rendered by `world.js` `renderPortrait` (the bake's
recipe: the head bone framed, the portrait lights, 3× supersampled, its grade and ink) in one kept offscreen renderer,
cached, and copied into the party card and the character window's tab. The baked `.face.png` stands until it's ready,
and wherever models are off.
**The helm hidden** (2026-11-10, the owner: "lets add a hide helm option for players"): a member's `hideHelm` (save
v40, `heroes.js` `showHelm`), toggled on the figure in the character window; `looks.js` and `portraits.js` draw them
bareheaded, the sim's gear untouched.

- **What's chosen** (each from a list, nothing typed):
  - face shape;
  - eyes and their colour;
  - brows (and their weight);
  - nose;
  - mouth (and its width);
  - hair and its colour;
  - skin;
  - a beard;
  - a mark (a scar, a tattoo, freckles);
  - ears.
- **More parts** to give real choice, built in `faces.js` and held to the face board (`node tools/actor-lab/faces.cjs`)
  and a critic pass:
  - eyes +3 (almond, hooded, deep-set);
  - noses +2 (aquiline, crooked);
  - mouths +2 (pout, gap-tooth);
  - brows +2 (bushy, scarred);
  - face shapes +3 (square, heart, long jaw).
  - That makes about 8 of each, against KayKit's single face.
- **How it's held:** a durable member field `appearance`, holding these ids. It's cosmetic only, so no stat reads it.
  - The sim checks every id against the allowed lists (`src/sim/appearance.js`, the sim's own table, kept in step with
    `faces.js` by a test) at `createHero` and at a change command, and refuses any other.
  - It goes in `MEMBER_KEYS`, with a save bump and a migration: an old member gets its look's preset as its
    appearance, so nothing changes until the player changes it.
  - Replays stay exact, because the choice is a command like any other.
- **Built where it's seen:**
  - `figure.js` builds the face inline from the appearance instead of a preset.
  - The figures in play (`world.js`) cache each member's model by the look and the appearance, so a change rebuilds
    only that one.
  - The portrait (`.face.png`) becomes a render of the same head, drawn into the party card when the appearance
    changes and cached.
  - Townsfolk keep their presets.
- **Hired companions** come with their own face (their preset), which the player may change once hired.

## 4. Bodies: the player's build

**Built** (2026-11-10): four builds and three heights (`figure.js` BUILDS, HEIGHTS: the figure's girth and stature,
the head kept to its own width, a broad one's shoulders out), in play (`world.js`, a template a look) and in the preview.

- **Builds:** thin, normal, broad, heavy.
- **Heights:** 0.94, 1.0, 1.06 of the class's. Height changes the figure's reach on screen, not the sim's footprint.
- **How it's made (recommended):** scales on KayKit's own bones, so every clip still fits and every model's armour
  follows.
  - **Girth:** x and z on the spine, the chest, the upper arms and the thighs.
  - **A belly** on the spine for heavy.
  - **Shoulders:** the clavicles' spread for broad.
  - **Height:** y on the legs and the spine.
  - Measured against the clips on the model sheet: no hand through a hip at thin, no shield through the chest at
    heavy.
- **Later, optional:** the parked proposal's code-built bodies on KayKit's skeleton (`body.js`), once the art pass
  brings them to KayKit's finish. That is a bigger piece of work, and a style decision of its own.
- **Held** in the same `appearance` (`build`, `height`).

## 5. The live preview

**Implemented in creation** (2026-11-10, GDD §6.1 v1.64): `tools/render3d/world.js` `createPreview` (built into the
bundle), `src/render3d/preview.js`, `src/ui/create.js` `Preview`: the look as its model, idling, an attack every few
seconds or on a tap, a drag to turn, the still under it until it stands and wherever it can't. **And the character tab**
(`ui/sheet.js` liveFig): the member in their look and worn gear, one canvas moved into each render (its context kept),
rebuilt only when the look or what's worn changes, let go when the window closes.

- **Where:**
  - the character tab (the Gear tab's figure);
  - creation (the look being made);
  - the temple or barber where the look is changed.
- **How:** a small canvas with its own WebGL context, opened with the window and released when it closes. It uses
  three.js and `buildFigure` from Luminati's bundle (exported from `tools/render3d/world.js`'s build), so the preview is
  the same model as in play, built the same way.
  - It draws only while visible: 30 frames a second while it moves, none while still.
  - The baked `.fig.png` stays as the loading image and the fallback. If no context is to be had, or one is lost,
    the still image shows, the same rule as the world's (`ui/worldfail.js`).
- **What it shows:**
  - The member idling: the class's own idle from `cast.json`.
  - Every few seconds, one of its attacks with the weapon equipped (a sword's swing, a bow's draw, a staff's cast).
  - A tap plays an attack; a drag turns them.
  - A slot changing re-dresses the figure at once, so the item is tried on before it's kept.
- **Measured before it ships, on a real phone:** first open (the model pack and the figure), memory, frame time
  with the world behind it paused, and context loss.
- **Architecture:** decision A14 (three.js in the windows) becomes "the windows use Luminati's bundle's three.js and
  figure builder": no second library, no new download beyond the shared chunk. One decision-log row.

## 6. Gear on the figure

**Built for the weapon, the off-hand and the helm** (2026-11-10, GDD §6.1 v1.65): `tools/actor-lab/gear.js` (each base's
piece: a KayKit mesh from any of the Adventurers, a skeleton's weapon, or one of our props; the hair under a helm),
`figure.js` `gear`, `looks.js` `lookOf` (a member's look and worn gear, keyed), `world.js` (a template a look; a look
nobody wears let go after two minutes, with its own merged geometry). **Armour and boots too** (2026-11-10): `gear.js`
`BODY`, `dressBody`: the five Adventurers share one skeleton (41 joints, one order), so a kit's body and arms (armour)
or legs (boots) are bound to the figure's own bones in place of its own; the cleric's vestments and the shaman's hide
are the Mage's in their own swatches; the class's own kit in its own colours is left as built. A body from another kit
is one mesh more (its texture): 107 draws in a fight against 105.

**Each base names its pieces** (`tools/actor-lab/gear.json`, presentation only, beside `icons.json`): its mesh (a
KayKit piece or a code-built one), the bone it hangs from, its swatch map, and the variants of its look (§7).

| Slot | On the figure | Made from |
|---|---|---|
| **Weapon** | in the right hand (both for two-handers); a bow drawn from the left, its quiver on the back | KayKit's weapons (`1H_Sword`, `2H_Axe`, crossbows, staffs, wands…), code-built where KayKit has none (§8) |
| **Off-hand** | the left hand: a shield on the forearm, a tome, a psalter on its chain, a dagger, a fetish | KayKit's shields and books; `1H_Sword_Offhand`, `1H_Axe_Offhand`, `Spellbook_open` (unused today) |
| **Helm** | the head, the hair hidden or trimmed under it, shaped to the face's skull (the mock-up's way) | KayKit's helmets and hats, code-built hoods and cowls |
| **Armour** | the body. Every Adventurer shares one skeleton, so any model's torso, arms and legs can be bound to any hero. Plate is the Knight's, leathers the Rogue's, fur and hide the Barbarian's, robes and vestments the Mage's. Our face and head stay | the KayKit bodies, then our own sets (§8) |
| **Boots** | the feet and shins of the armour's legs, recoloured, or the boot's own mesh where it differs (sabatons, fur) | KayKit legs; code-built cuffs |
| **Trinket** | an amulet on the chest, a charm at the belt; a ring as a glint on the hand (too small to model at 54 pt) | code-built |

**In play:**
- `world.js` builds each member's figure from its look, its appearance and its equipped gear, and rebuilds it on an
  `equip` event.
- `compact()` merges it to a few draws (a figure stays under its budget of 12 draws). An item's glow keeps a material
  of its own.
- The sprite path (`?figures=sprites`) keeps today's baked figures, without gear (documented).

**Fair play:** what's worn changes nothing in the sim. The figure only reads what's equipped.

## 7. Each item's look: colours, light and effects

**Built** (2026-11-10), then **changed** the same day (the owner: "For rarity, gear doesn't need to be a different
color - rather the gear border in inventory and the rarer an item, there is a faint to slightly stronger glow"): a worn
piece is never tinted. `gear.js` `lookOn` lights it from within in its own colours (its texture as its emissive),
`RARITY_GLOW` common 0, fine 0.07, rare 0.13, heirloom 0.21, and heirloom alone with a slight pulse (±25 %; the owner: "fine faint glow, rare, more glow, heirloom is where the slight pulse is added"), each smith's step +0.02;
in play it's added over the figure's own fill (`world.js`), so a lit piece is never darker than the rest. The rarity's
colour is the bag's: each slot's border in it, with a glow round the border that grows with the rarity (none for
common; heirloom's pulsing slightly too, still for reduced motion; `sheet.js` `.gslot`), the word on the item's card. A piece with a light keeps its own material (one draw more).
**The heirloom's flourish** (2026-11-11, the owner: "do 4"): a figure wearing an heirloom has a few warm embers drifting
up round it (`world.js` `heirMotes`: seven points, one shared geometry and material, their rise in the shader, a child
of the figure so it moves and turns with them; one effect a figure however many heirlooms; at least 3 px so they read
at play's distance). In play and in the character window. Measured on the manual clock: 479 draws a frame before, 480
with an heirloom on (one draw, the figure's embers), nothing for any figure without one.
The table below was the first plan; the colours in it are superseded by the above.

An item's look comes from fields it already has, so no new saved state, no new random draw, and replays exactly as
now: its **base** (the mesh), its **rarity**, its **upgrade** (`up`, the smith's +N) and whether it is an
**heirloom**.

| | Its colours | Its light | Its effect |
|---|---|---|---|
| **Common** | the base's material: iron, leather, wood, cloth | none | none |
| **Fine** | the material bettered: steel, dyed leather, a coloured trim | none | none |
| **Rare** | an enamel or a dye in the rarity's colour (paired with the word, as every rarity is) | a faint rim light | a soft trail on the weapon's swing (the trail exists: `fx.js` weapon trails) |
| **Heirloom** | its own palette, one per heirloom (the Last Order's legion red and bronze, Vespers' drowned green) | a glow of its own colour | its own motes or embers on the figure, at most one effect per figure at a time |
| **The smith's +1…+5** | none | each step a little more light on the edge or the inlay, up to the rare's rim at +5 | none |

- **Kept dusky:** a glow stays under the figure's own light. A heavy glow is for the heirloom alone, and the world's
  bloom carries it.
- **Later, a dye at the smith:** a sim command, paid in gold, its colour from a list, held on the item (a save bump).
  It's a cosmetic the sim validates, never a reward.
- **The drop's light column, the slot's border and the icon** take the same colours. Icons render the item's look:
  `icons.cjs` bakes each base in its rarity's palette.

## 8. Gear to create

**Built** (2026-11-10, the owner: "do 1… critic and validate"): code-built pieces in `tools/actor-lab/props.js`, worn
through `gear.js`, their icons from the very same pieces (`iconlab.js` `prop`): the **Chapel Coif** (a new cleric helm,
the Great Helm's numbers: a warm off-white wimple, a gilt brow band), the **Hide Cowl**, a **Hood** for a rogue whose head
has none, the **Chapel Sword**, the **Book of Hours** (small, blue), the **Chained Psalter** (oxblood and brass, its chain
hanging plumb), the **Spirit Staff**, the **Antler Rod**, the **Bone Fetish** (hanging from the fist); the **Amulet** worn
at the chest and the **Charm** at the outer hip (a ring is too small to be seen); a **quiver** on the back with a bow and
a **bolt case** at the hip with a crossbow. Staves, wands and the rod are carried upright (figure.js plumb), their feet
at the soles: before, a staff pointed at the camera and read as a green egg at the belly. Judged on the gear sheet
(`node tools/capture/gear.mjs`, every piece on its class in the game's own preview) by an independent critic pass, its
fixes taken (the coif fitted with a real wimple, the books in their icons' colours and smaller, the staff lighter and
thicker, the rod, fetish and charm larger, the chain in dull gold, bolt ends on the case). Play's cost unchanged
(figperf: the square 463 draws, a fight 105, as before). Still to come: armour sets of our own, heirloom meshes, capes,
the Ashbound weapons' hold (a crossbow rests low in the kit's idle).

Today's gaps (found against the catalogue, `items.js` `BASES`, and the assets):

| Missing | For | Why |
|---|---|---|
| **A cleric's helm**: a coif and wimple; a mitre for rare | the cleric | the cleric borrows the fighter's Great Helm; the Mage model has no helm |
| **The Hide Cowl's mesh** | the shaman | it uses the rogue's hood icon; no mesh |
| **A hood as its own mesh** | the rogue | the hood is part of the Rogue_Hooded head |
| **The Antler Rod**, **the Bone Fetish**, **the Spirit Staff** | the shaman | they reuse the wand, the charm and the staff |
| **The Book of Hours**, **the Chapel Sword** | the cleric | they reuse the tome and the plain sword |
| **The Chained Psalter's chain** | the cleric | its icon only |
| **An amulet and a charm on the body** | everyone (trinkets) | icons only |
| **Armour sets** of each material, with their boots: plate, mail, leather, hide, robes, vestments | every class | armour is the model's own body today; mail and vestments have none of their own |
| **A mesh for each heirloom weapon and shield** | the heirlooms | they take a base's look |
| **The Ashbound weapons** (falx, cleaver, buckler, arbalest, staff) **in a hero's hand** | the classes that can use them | the skeletons hold them; no hero does |
| **A quiver** | bows and crossbows | none |
| **Capes**, as part of an armour set's or an heirloom's look (not a slot) | the sets | KayKit has four, unused |

New bases to propose, to fill the classes' gaps (each needs its GDD numbers and the balance contract: these are
proposals, not decided):
- **Off-hands:** an off-hand sword and an off-hand axe for the fighter (KayKit's `1H_*_Offhand`, unused); a throwing
  knife for the rogue (`Throwable`).
- **Mage:** a circlet for the helm slot, as an alternative to the hat.
- **Shaman:** a bone-and-feather headdress for the helm slot.
- **Everyone:** a mail shirt, between leather and plate; a lantern as an off-hand for the dark (a light that walks with
  you, cosmetic).

## 9. Order of work

| Step | What | Measured by |
|---|---|---|
| 1 | **The live preview** on the character tab, with today's look: the model, the idle and an attack, drag to turn, the still as fallback; A14's row | first open and memory on a phone; the browser suite (the preview draws, falls back, takes no tap from the world) |
| 2 | **Gear on the figure:** weapon, off-hand and helm first (they're separate meshes today), in the preview and in play | the model sheet per class × each weapon; draw counts in play |
| 3 | **Each item's look:** §7's table, icons rebaked, the trails and the glow | contact sheets per rarity; a critic pass |
| 4 | **Faces chosen:** `appearance`, its validation, its save bump; creation and the temple's barber; the new parts | the face board; `node:test` for validation and the save round trip |
| 5 | **Bodies chosen:** builds and heights by bone scale | the model sheet through every clip at each build |
| 6 | **Armour sets on the figure**, by binding the other models' bodies, then our own sets | per class × material sheets; draws |
| 7 | **The missing gear** (§8), mesh by mesh | the icon sheet; the model sheet |

Each step ships alone, behind nothing. A step that fails its measure on the phone stops the next.

## 10. To decide

- **Steps 1–3 first** (no save change), then the appearance (step 4, a save bump)?
- **Where the look is changed** after creation: at the temple (a barber's chair), free, or for a few coins?
- **The builds and heights:** four builds and three heights, or fewer?
- **Armour:** bind the other models' bodies now (fast, KayKit's look), or wait for our own sets (slower, ours)?
- **The new bases** in §8: which, and when (each needs its numbers in the GDD and a balance run).

## 11. Performance: the measure (`node tools/capture/figperf.mjs`)

Every WebGL draw counted at the context (all of Luminati's passes), real frames, Chromium in software GL on the cloud box
(slow in absolute terms: only a before against an after on the same box means anything). The baseline, 2026-11-10,
before any of §9's steps 2–7:

| Scene | Figures | Draws a frame | Triangles a frame | Frame (median) | JS heap |
|---|---|---|---|---|---|
| Thornwick's square, people as models | 17 (14 kinds) | 463 | 740,000 | 1,217 ms | 125 MB |
| the same, people as sprites (`?figures=sprites`) | 17 | 278 | 534,000 | 1,033 ms | 82 MB |
| a Barrows fight, models | 2 | 105 | 210,000 | 317 ms | 87 MB |

So the 17 figures as models cost 185 draws and 206,000 triangles a frame, about 11 draws and 12,000 triangles each,
shadows included, and 43 MB. The kinds after compact: 103 meshes (579 before). Every step after this one is held to it:
a face, a build and worn gear may not add draws to a figure beyond what its new pieces need, and nothing seen in play
may be cut to pay for it.

**After the faces, builds and worn gear** (2026-11-10, the same box): the square 463 draws, 740,000 triangles (the
same); a Barrows fight 105 draws, 209,000 triangles (the same). Nothing added a draw: a worn piece takes the place of
the kit's own on its bone, and compact merges it as it merged that. Only a piece with a light (rare, heirloom, a +N) is
a draw of its own. Frame times within the box's noise (1,283 ms and 333 ms medians against 1,217 and 317).
