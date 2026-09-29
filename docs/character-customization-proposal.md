# Character customisation and gear on the figure — proposal

**Status: Proposed, parked (2026-09-29).** Nothing here is decided or scheduled; we'll
revisit it later. It records:
- the question;
- the options we evaluated;
- the approach we'd recommend;
- the evidence (a working mock-up), so the discussion can pick up where it stopped.

Related:
- [body-mockup.md](./body-mockup.md) — the mock-up;
- [art-critic-pass-4.md](./art-critic-pass-4.md) — faces, portraits and the character-window
  figure;
- [character-direction.md](./character-direction.md) — why KayKit in the first place.

## The question

The character window (the gear sheet) shows a figure that never changes with what's equipped.
Beyond gear, we want characters to vary in:

- **body build:** thin, normal, thick;
- **face shape:** normal, thin, thick, round, oblong, pear;
- **face parts:** the face kit already has 5 eye styles, 6 brows, 7 mouths, 6 noses,
  11 hair styles, 6 kinds of facial hair and 7 marks;
- **gear:** weapon, off-hand, helm, armour and boots, shown on the figure.

It is also a style question. The characters today are mostly KayKit's, and the preference is
for a look that is **our own**.

## Where we are today

| Part | Source |
|---|---|
| Buildings, trees, rocks, world props | **Ours** (`tools/actor-lab/buildkit.js`); KayKit's environment pack was fully replaced |
| Faces | **Ours** (`faces.js`), on a skull stitched from KayKit head geometry |
| The cleric's mace, Maudry's mug | **Ours** (`props.js`) |
| Proportions, grade, outline, lighting, portraits, window figures | **Ours** |
| Recolours (vestments, Maudry's dress) | Our repaints of KayKit's texture |
| Bodies and clothing | **KayKit** |
| Weapons, shields, hats, helmets, capes | **KayKit** (except the mace and mug) |
| Skeleton (rig) and all animation (76–95 clips) | **KayKit** |

**About KayKit.** KayKit is Kay Lousberg's low-poly character packs (Adventurers and
Skeletons), released as **CC0**: we can modify and ship them without conditions. Each model
has:
- a rigged, skinned body on one rig shared by every model;
- 76–95 animation clips;
- chibi proportions, with clothing built into the body;
- one generic face;
- a texture of 32 gradient swatches;
- separate accessories.

It is polished and consistent, but widely used, so a stock KayKit figure is recognisable as
one.

## Options evaluated: gear (and appearance) on the figure

The deciding factor is combinations: 3 builds × 6 face shapes × the faces × every visible
piece of gear. Every new axis multiplies the bakes, unless the figure is assembled rather
than baked.

| Option | How | Verdict |
|---|---|---|
| **A. Pre-baked figures per combination** | Today's `.fig.png` (60–90 KB each), one per look | **Rejected.** It breaks on the first gear change, before builds and face shapes. |
| **B. 2D layers** | Bake each weapon, off-hand, helm and armour as a layer in the figure's pose, with a depth map for overlaps, and stack them in the window | **Rejected for the long term.** Armour and weapon layers need a bake per build (thick arms move the hands); helms need one per face shape. That's items × builds + helms × shapes × builds, per class pose. No rotation, and no help for creation or the in-world sprite. |
| **C. Live 3D in the windows** | Load three.js (the 3D library the art tools use) and a slim model pack when a window opens; assemble the figure from appearance and equipped gear; rotate by drag | **Recommended.** Builds are girth settings, face shapes are skull deformations, and gear attaches to bones. Every combination is free. |

**Measured costs of C:**
- **three.js:** 170 KB gzipped (`three.module.min.js`, 0.169.0). It loads only with a window,
  never in the world renderer.
- **Model pack:** each KayKit GLB is about 3.6 MB, mostly clips and 1024 px textures. A pack
  with one rig, the few poses we use and 128 px swatch textures is estimated at about 1 MB.
  It shrinks further as visible parts become code-built.
- **Architecture:** it needs a new decision row (A14), reversing A2's "three.js stays
  tools-only" for **windows only**. Emberlit keeps the world.
- **Phones:** a second WebGL context while the window is open. It renders only on change or
  drag and is disposed on close. Context loss must be handled. The baked `.fig.png` stays as
  the loading image and fallback.

## Style: "custom on KayKit's skeleton"

**Keep** KayKit's skeleton and animation clips. Animation is by far the most expensive thing
to make, and hard to do well in code.

**Replace** everything visible with our own code-built parts, as the faces already are:
bodies, clothes and armour, weapons, headgear.

The end state is that KayKit contributes only the skeleton and motion, and the look is ours.
It stays CC0-clean. We'd keep KayKit's visual language (chunky low poly, gradient swatches)
so our parts sit with the animation, and check each step with a critic pass.

(Replacing the skeleton and animation too was considered and set aside: it's by far the most
expensive part to redo, for the least visible gain.)

## Evidence: the mock-up

`tools/actor-lab/body.js` hides every KayKit mesh and builds skinned bodies in code on
KayKit's skeleton. [body-mockup.md](./body-mockup.md) has the board.

- **The four classes, each fully ours:**
  - **Fighter:** helm, breastplate, pauldrons, tabard, cape, sword and shield.
  - **Rogue:** hood with cowl, mantle, pouches, daggers.
  - **Mage:** robe, wizard hat, staff.
  - **Cleric:** coif and wimple, vestments, mace and book.
- **Builds:** thin · normal · thick. Girth only, so every clip still fits; thick adds a
  belly.
- **Face shapes:** normal · thin · thick · round · oblong · pear. Parts and hair follow the
  shape, and headgear grown from the shaped skull fits each one.
- **Animation:** walk, chop and cast, driven by KayKit's clips with no fitting work.

**Findings:**
- The approach works, and every combination is just a setting.
- The finish is rougher than KayKit's sculpted folds and bevels. The gap is small at 56 px in
  the world and clear in the character window.
- Rough spots: hair at the helm's front edge on the oblong face, thick under a robe barely
  shows, the rogue reads dark in the world, and the weapons are simple.

## Proposed plan (when we revisit)

1. **An art pass on the parts:** bevelled plates and trims, cloth folds, swatch gradients
   (vertex colours), and each class's silhouette. Measured with critic passes against KayKit
   today, until the window figure is at least as good.
2. **The live view:** a model-pack build tool (slim rig, poses, small textures) and a `doll`
   module in `src/ui/`. The character window uses it: gear on bones, drag to rotate, the
   baked PNG as fallback. Record decision A14, and measure memory and first-open time on a
   real phone.
3. **Outfits from items:** each item base names its layers (breastplate, robe, hood, helm,
   weapon mesh), so the figure wears what the character equips.
4. **Appearance in creation and the save:**
   - a durable member field `appearance` holding build, face shape and face parts;
   - it goes in `MEMBER_KEYS` with save v7 and a migration;
   - the sim validates it against the allowed options at `createHero`; it's cosmetic only;
   - creation uses the same live figure.
5. **In-world sprites, later:** bake each hero's and townsperson's sprite sheet from the same
   figure. Either keep baking in the tools, or bake per character on the device and cache it
   in IndexedDB. Measure on a phone first.

## To decide when we revisit

- **Go or no-go** on "custom on KayKit's skeleton", and on the art pass (step 1) as the gate.
- **A14:** three.js in the windows (lazy-loaded, windows only), or stay with baked figures
  and accept no gear on the figure.
- **The build and face-shape lists:** are three builds and six shapes the right set? Should
  height vary too? (It's possible, but it changes the in-world figure's footprint.)
- **Which gear shows:** weapon, off-hand and helm first; armour sets when item bases carry
  layers.
- **Townsfolk:** built from the same kit (role templates × builds × faces), which the NPC
  plan (development plan §2.5) needs anyway.
