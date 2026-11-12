# The painted head — spike (2026-11-12)

**Status: spike, behind a switch.** The game draws as before unless the page has `?faces=painted`.

## Why

The owner (2026-11-12), after the Meshtint *Cute Series Faces Expansion Pack*: *"lets use this to improve the fidelity and
possible variability for faces … Pay close attention to the maps for the face and also the better head shapes"*, then
*"Go with the packs proportions, selectable by player expressions as a part of character creation. Start the spike"*.

What the pack does (studied from its product images; none of its art is in the repo, ours is built in code):

- a head in three parts: a swappable **hair** shell; a smooth, egg-shaped **skull** (a full crown, round cheeks, a soft
  chin, the nose a sculpted bump, small set-in ears); and a **face mask**, a small curved patch on the skull's front that
  carries the whole face as **one painted picture** (eyes, brows, mouth);
- one picture fits every head: the brows take the hair's colour, the irises their own; a lash flick on some;
- what reads small: big dark eyes with a glint, thick brows, a short mouth line; expressions and marks (scars, war paint,
  fangs, tears, creases) are the same picture redrawn.

## What the spike builds (`tools/actor-lab/faces.js`, *the painted head*)

- **The skull** (`eggSkull`, `eggAt`, `HEADS`): built from numbers, twenty heads to choose from (the owner, 2026-11-12,
  after the pack's rounded box: *"I dont like the shape of the head or the big eyes. Build 20 different head shapes with
  some depth or detail that i can choose from"*). Each is its sections' squareness, the crown's and chin's curves, its
  width and depth, the jaw drawn in toward the chin, a long jaw or a tall crown, then sculpted: the brow ridge, the eyes
  set in, the nose's bridge, cheekbones and the hollows under them, the lips, the chin's point and cleft, the jaw's
  corners, the temples, jowls, the back of the skull, a sloped forehead. Oval, heart, square, round, long, diamond, pear,
  rugged, gaunt, broad, elfin, brute, noble, cherub, wedge, jowly, hawk, moon, chiselled, dome; the pack's box kept as
  `pack`. Each stays inside KayKit's head, so its helms and hoods and our hair shells still fit (KayKit's long cuts pushed
  out to clear it). A face's `head` picks one (oval without). Our six noses are six soft bumps (`BUMP`) low, just over
  the mouth; our six face shapes deform it as they did KayKit's (`SHAPES`); flat ears set back at the eyes' and nose's
  height, or our pointed ones. The board: `node tools/actor-lab/faces-spike.cjs --heads` → `out/faces_heads.png`, each
  bald from the front, three-quarter and turned, and with hair at play's size.
  ![twenty heads](img/faces/heads-board.jpg) (the pack's box, the board before: ![three-quarter](img/faces/spike-head-3q.jpg))
- **The mask** (`faceMask`): the skull's front from 66° left to 66° right and from just above the chin to the brow line,
  a hair (0.006) proud of it, its picture's u and v across it. The eye line sits at y 0.46, the mouth at 0.18.
- **The picture** (`facePicture`, 512 px, one per distinct face, cached): drawn on a canvas in the head's own units — the
  eyes made smaller after the owner's *"I dont like … the big eyes"*: a modest almond with its white, the iris in its colour, a pupil, a glint, the upper lid's dark line and a crease over it,
  thick tapered brows in the hair's colour, a short mouth line, a hint of the lower lip. Transparent between the features
  (the skull's skin shows; a painted skin showed as a patch of another tone in the game's light) and drawn as a cutout
  (`alphaTest`: the game's figure fade sets `transparent` from the figure's opacity). No mipmaps: at a 20 px head the
  eyes stay dark pixels.
- **Our parts on it:** eyes (round, wide, narrow, tired, sharp), brows (six), mouths (seven), iris colours, lashes; marks
  painted (scar through the brow, cheek scar, freckles, blush, forehead lines, eyepatch, and a new war-paint stripe); the
  earring, beards and hair are the kit's own, grown off the new skull (KayKit's long cuts pushed out to clear it).
- **Expressions** (`EXPRESSIONS`, `PEXPR`): neutral, smile, happy, stern, sad, smug, surprised, fierce: the brows turned
  and raised, lids lowered, a mouth (and fangs, tears, a scowl's creases) — the picture redrawn.

## Measured

- **The face board** (`node tools/actor-lab/faces-spike.cjs` → `tools/actor-lab/out/faces_spike.png`): six looks as
  today's 3D parts and as the painted head, the eight expressions, marks and shapes, and both at a 20 px head drawn 4×.
  ![spike board](img/faces/spike-board.jpg)
- **In play** (the Stage, `node tools/capture/stage.mjs --show cast --cast party,town --clips idle --query faces=painted`):
  the same figures cropped and drawn 3×, today's above. Today's faces are two specks at play's size; the painted ones
  read as eyes, in their colour, under brows. ![in play](img/faces/spike-in-play.jpg)

## Found, for the full pass

- **Dark skin** (deep, umber): dark eyes and black brows on it lose their edge; the pack lightens its brows there and
  keeps the glint. To do: a lighter brow and an eye rim on dark skin.
- **The pixel look at play's size** is crisp but a little ragged (no mipmaps); a hand-drawn far picture (the eyes as two
  clean blocks) may read better.
- **Hats and hoods** cover the eye line on some (the mage's brim): the eye line sits lower than KayKit's; the brims
  may want a little lift.
- **Perf** is to be measured with `tools/capture/figperf.mjs` (one textured mask a head in place of ~20 merged parts;
  a 512² picture a distinct face, shared by every face drawn alike).

## Next (not in the spike)

0. **The owner picks heads** from the twenty: `head` a part of the appearance (sim `PARTS`, the kit's `OPTIONS`), with the
   expression, in one save version bump.

1. **Expression at creation:** `expression` a part of the appearance (sim `PARTS`, the kit's `OPTIONS`), chosen on the
   creation's Look step and at the temple; a save version bump with a migration (an old look: neutral).
2. **Every face painted:** the switch on by default, the presets in `faces.json` checked on the board, the bakes
   (portraits, figures, atlases) redone, the face board's rows for the new marks.
3. **Moods in play** (presentation only): blink, a hit's wince, a downed figure's shut eyes — the picture's mood swapped.
4. **More variety:** more eyes, brows and mouths, now that each is a drawing.
