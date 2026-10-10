# actor-lab — character look-dev for the Emberlit renderer

Renders the **KayKit CC0** character packs exactly as Emberhold's camera sees them
(orthographic, 30° pitch / 45° yaw — the 2:1 dimetric of `src/render/iso.js` —
46 px tall at native resolution, no AA), then composes review boards, including one
over a real in-game backdrop at true pixel scale. This is the tool behind the
**Option C / heroic proportions** decision in
[`docs/character-direction.md`](../../docs/character-direction.md).

```sh
cd tools/actor-lab
npm i                        # three.js + playwright-core (dev only)
sh fetch-assets.sh           # ~40 MB of glTF → models/ (gitignored)
node render.cjs              # 18 variants × stock/heroic × 3 facings → out/*.png
node render.cjs --px 56      # same at another figure height → out/px56/ (default 46 → out/)
node capture-backdrop.cjs    # real game room, actors hidden → out/backdrop.png
python3 compose.py           # out/board_{heroes,enemies,inworld}.png   (needs Pillow)
node bake.cjs                # the GAME atlases (bake.json) → ../../assets/actors/
node bake.cjs --anchors      # refresh only the weapon anchors and walk stride in those atlases' JSON (seconds, no raster)
node bake.cjs --portraits    # only the window portraits and figures (<actor>.face.png, <actor>.fig.png)
node faces.cjs               # the face board: every faces.json preset, then every face part → out/faces_board.png
node icons.cjs               # item icons (icons.json) → ../../assets/items/<id>.png
node bake-env.cjs            # environment atlases (env.json + town.json: all our own buildkit.js models) → ../../assets/env/
```

## Environment bake (`envlab.js`, `buildkit.js`, `bake-env.cjs`)

`buildkit.js` is our own building and tree kit (three art options, see
`docs/town-art-options.md`). `envlab.js` bakes any model in the game camera at
1 unit = 10 tiles. It writes albedo (with a grade), normals with the planar sun shadow in their
alpha, and a per-pixel depth key (ground x+y + 0.816 × height) with the lit-window flag.
Everything is shelf-packed into one atlas set.

Per-sprite knobs in `env.json` beyond the grade:
- `glowId` — the GLOW_ID its glowing meshes light up in the game (default 9, lit windows; the
  stairwell's arch uses 2, violet).
- `below` — keep geometry down to this depth under the ground (model units); the bake clips at the
  ground otherwise. For a hole (`stairsdown`): its model also carries a depth-only floor around
  the opening (meshes with `userData.mask`), so the bake sees into it only through its mouth,
  and the renderer draws it over the floor (`hole` structures, `renderer.js`).
- `shadow: false` — no planar ground shadow.
- `gltf` — load a glTF from any path under `models/` (`'nature/Fern_1'`), with `scale` to bring it to our size.
  Cut-out materials (glTF `alphaMode: MASK`: leaf cards, petals, grass blades) bake as cut-outs in every
  pass: albedo, normals, depth key, shadow, glow.

### The nature pack

The undergrowth (`ug_*`) and the scatter's rocks (`rock_F`, `rock_G`, `rock_H`) are Quaternius' **Stylized
Nature MegaKit** (CC0), graded in the bake to the Vale's trees (`docs/nature-pack-proposal.md`).
- **Getting it:** download its glTF folder (from quaternius.com or itch.io) and unzip it into
  `models/nature/`. Like `models/`, it isn't committed.
- **Without it:** `bake-env.cjs` stops and says so.

## Game atlases (`bake.cjs` + `bake.json`)

`bake.json` lists what ships: the hero (`F1`, Knight · sword & board) and the four
skeletons (`E1`–`E4`). Each has idle + walk clips. For every one of the **8 screen
directions** (row 0 = E, 1 = SE, 2 = S toward the camera, … clockwise) × every clip frame,
`window.bakeAtlas` in `lab.js` renders the figure three times at 56 px, heroic:

- **albedo** — unlit palette colour, then the grim pass, a value gain (`albedoGain`, 0.5,
  into the terrain's albedo range since the deferred pass relights it) and a 1 px ink
  outline. Alpha is the mask.
- **normal** — view-space normals remapped to the renderer's screen convention (camera-facing
  ≈ (0, −0.28, 0.96), up-facing ≈ (0, 0.3, 0.95)), so the torch and braziers wrap the figure.
- **emissive** — the glowing-eye mesh only; written only if something glows. The glow
  colour is the `glow` GLOW_ID in `bake.json`.

Scale and camera are fixed from the idle pose so the figure never pulses between frames,
and the rest pose is restored before each sample so the heroic pass never compounds.
Outputs are `<name>.json` (cell size, foot anchor, clips, glow) plus `.alb/.nrm/.emi.png`,
loaded by `loadActorAtlas()` in `src/render/renderer.js`.

**Weapon anchors.** Every held weapon is a rigid mesh under a hand slot (`handslotr` /
`handslotl`; shields are skipped). `weaponRig()` finds its tip once, in slot space: the end
of the weapon's long axis farthest from the grip. That is the sword point, axe head, staff
crown or crossbow nose. `anchorAt()` projects the tip and the grip into every baked cell.
The JSON gets `anchors: { r: [...], l: [...] }`, with 5 ints per cell
(`tipX, tipY, gripX, gripY, z`), where cell = `dir × frames + frame` and z is the px the tip
sits toward the camera. `src/render/fx.js` draws the weapon trails, glints and cast shimmer
from these. A variant can override the tip with `tipAxis: {r: 'x'|'y'|'z'}` or
`tipFlip: {r: true}`.

`render.cjs` serves this folder itself and drives headless Chromium with SwiftShader
WebGL. Set `CHROME_PATH` if Chromium isn't at the sandbox's `/opt/pw-browsers` path.
`capture-backdrop.cjs` serves the repo root and uses two dev-only hooks: `?dev`
(exposes `globalThis.__sim`) and `globalThis.__noactors` (the renderer skips actors).

## Files

| file | role |
|---|---|
| `lab.js` / `lab.html` | three.js harness: loadouts, weapon attachment, recolor, glowing eyes, heroic pass, render |
| `faces.js` / `faces.json` / `faces.cjs` | the modular face kit (critic pass 4): KayKit heads split by swatch, a stitched bald skull, and eyes, brows, noses, mouths, hair, facial hair and marks placed on it; presets; the face board |
| `props.js` | what the kits lack, shared by figures and icons: code-built props (the cleric's mace, Maudry's mug, the Standard of the Third Legion) and the swatch repaint |
| `variants.json` | the roster: 10 hero loadouts (fighter/rogue/mage) + 8 enemy NPCs |
| `bake.cjs` / `bake.json` | bake the shipped actor atlases into `assets/actors/` |
| `icons.cjs` / `iconlab.js` / `icons.json` | bake the item icons into `assets/items/` (one kit mesh or code-built trinket per icon, 96 px) |
| `render.cjs` | static server + headless render of every variant; exports `serve`, `CHROME`, `GL` |
| `capture-backdrop.cjs` | screenshot a furnished room with actors hidden (dpr 2 ⇒ 1 screenshot px = 1 canvas px, 3 per native px) |
| `compose.py` | the 'grim' pass + the three boards |
| `fetch-assets.sh` | pulls the KayKit Adventurers + Skeletons packs from raw GitHub |

## Variant knobs (`variants.json`)

- `model` — `Knight`, `Barbarian`, `Rogue`, `Rogue_Hooded`, `Mage`, `Skeleton_{Warrior,Minion,Rogue,Mage}`
- `show` — accessory meshes to keep (every other accessory of that model is hidden), e.g.
  `["1H_Sword","Round_Shield","Knight_Helmet","Knight_Cape"]`. The full lists are in `ACC` in `lab.js`.
- `attach` — `{ bone: file }` parents a weapon glTF onto `handslot.r` / `handslot.l` (skeleton weapons ship separately).
- `hold` — `{ bone: prop }` puts one of our own code-built props (`PROPS` in `props.js`) in a hand
  slot, along +y like the kits' one-handed weapons. It gets weapon anchors like any held weapon.
  `C1`, the cleric, holds `"mace"`; `N1`, Maudry Fenn (actor `npc_maudry`), holds `"mug"`.
- `face` — a preset name from `faces.json` (or an inline face) replaces the KayKit head with the
  face kit's (`faces.js`): `skin`, `hair` + `hairColor`, `eyes` + `iris`, `brows`, `nose`, `mouth`,
  `beard`, `marks: [...]`, and `skull: "own"` to keep a hooded model's face and hood. `OPTIONS`
  in `faces.js` lists every choice; `node faces.cjs` draws them. The atlas bakes a simplified
  face (dot eyes, no marks: what reads at 56 px); the portrait the full one.
- `wear` — `{ bone: prop }` puts a code-built prop on a body bone instead of a hand (`N5`, Bess Hale:
  `{"hips": "apron"}`, her leather apron).
- Carried props with `userData.hang` (the lantern, hammer, egg basket, key ring and carter's whip in
  `props.js`) **hang plumb**: every sampled pose turns them so they point straight down from the grip
  (a prop built along −y, the whip, stands up), keeping the figure's yaw. A rigid prop stuck out like a
  pole in the Idle hand. A prop part with `userData.glow` (the lantern's glass) is written to the
  emissive plane like the skeletons' eyes; give the actor a `glow` id in `bake.json` (Wendel: 3, ember).
  `hang: 'up'` (art pass 9) stands a prop on end instead, its head above the hand: the staff the Robed
  Stranger and the Cinder acolyte carry, which the rest pose held orb-down.
- `px` in a `bake.json` actor (art pass 9) bakes that actor at its own figure height: the bosses at 73
  (56 × 1.3, 114 × 133 cells), so the renderer draws them 1:1 rather than nearest-upscaling a 56 px atlas.
  `bake.cjs` reopens the lab at that height; `BAKE_PX` scales everyone alike.
- `swatches` — `[{ tile: [col, row], to: [light, dark] }]` repaints whole swatches of the kit's
  8 × 4 gradient-swatch texture by the swatch's own luminance, so its gradient survives and only
  the parts that use that swatch change. The cleric's off-white vestments are the Mage's robe
  swatch `[0, 1]`. Icons can reuse a variant's swatches (`"swatches": "C1"` in `icons.json`), or mix one with
  their own (`["R2", { "tile": [0, 0], "to": [...] }]`: the rogue's leathers, and the face in the hood in shadow).
- `sat` and `rim` in `icons.json` (art critic pass 16): `sat` (0–1) pulls an icon's colour toward grey, for a kit
  colour that shouts in the bag; `rim` scales the cool rim light, which a surface turned from the key takes alone
  (a book's cover read lavender under it).
- `recolor` — a CSS filter applied to the model's colour texture; how human enemy NPCs reuse hero models.
  (Look-dev only: the shipping version should remap swatches in the small palette texture exactly.)
- `eyes` — emissive colour for the skeletons' separate `*_Eyes` mesh.
- `skull` — (skeleton-skull proposal) the skeletons: their `*_Eyes`, `*_Head` and `*_Jaw` meshes are tagged in
  the part pass, and `albSkull` draws dark sockets (open below, a bone brow ridge kept), a nasal notch and teeth
  where the 4 × 4 average washed them into the bone. Not the face kit: a skull has sockets, not eyes and brows.
- `hide` — kit meshes left off (`E2`, the minion: `["Skeleton_Minion_Cloak"]`, its collar hid the jaw; it wears
  the `rag` prop on the chest bone instead).
- `height` — (art pass 8) fit the figure by its body alone, held things left out, to `px` × `height`
  (the townsfolk: 0.85 for Nell to 1.02 for Jory, Brannoc 1.06). Without it the whole figure, props and
  all, fills `px`, as for the heroes and foes; a book or whip held high shrank the person under it.
- `pose` — `[clipName, t01]`; default `["Idle", 0.5]`. Every model shares one rig with 76–95 clips
  (attacks, Hit, Block, Dodge, Death, Spellcast; skeletons add Awaken/Spawn/Resurrect).

## Face knobs (art pass 7, `docs/face-fidelity-proposal.md`)

The shipped bake is `eyes2,grade` (A2b + B, `art-critic-pass-7.md` *Shipped*): every actor with a face
preset gets a part pass beside the albedo, and its features are placed by `pixelFace`. Actors without
face parts (the skeletons, the Standard) skip the part pass and bake as before.
- `BAKE_OUT=dir`: write the atlases into a scratch tree instead of `assets/actors`.
- `BAKE_PROTO=…` replaces the shipped set (`off` = faces as before pass 7, plain averaging and the
  world grade):
  - `features`: A, eyes, brows and mouths that cover 3 of 16 sub-samples keep their own colour;
  - `grade`: B, a softer grade on skin, hair and features, and a hairline;
  - `eyes1` / `eyes2`: A2's pixel-art face: 1 px iris-tinted eyes; brows a row over each eye (a lone
    three-quarter eye's: 2 px), toned toward the skin; a mouth of at most 2 px. `eyes2` adds a white
    on each eye's outer side, which comes from the geometry, so a lone three-quarter eye gets one;
  - `stats`: prints the idle cell's head box and feature counts, front (2) and three-quarter (1).
    Add it to the shipped set: `BAKE_PROTO=eyes2,grade,stats`.
- `BAKE_HEAD=0.74`: the head bone's scale (heroic default 0.62).
- `BAKE_PX=72`: the figure height (default 56, from `bake.json`). At 90 px or more the atlas keeps the
  portrait's face. The Stage's `space=` spreads bigger figures apart.

They need the face part tags (`userData.part`) that `faces.js` puts on every face mesh.

## Walk stride (`strideOf` in `lab.js`, art pass 6)

An atlas whose `walk` is a `Walking_*` clip gets `stride` in its JSON: the tiles the figure travels in
one cycle, measured from its own feet. The clips walk in place, so a planted foot slides back at the
body's speed. The contact is the lowest skinned vertex of each leg (the ankle bone lifts while the sole
is down). Each stretch where it stays within 5 cm of the floor gets a least-squares slope, and the
stride is their length-weighted mean, converted at the camera's scale (8√2 px a tile along screen x).
The renderer steps walk frames by distance ÷ stride, so matching feet don't skate. It's null when the
segments disagree by more than 30 % (the Ashbound's shuffle, the Knight model's walk); the renderer
keeps a constant then. `node bake.cjs --anchors` refreshes it in seconds. The party's run (`Running_A`)
is left out: it has a flight phase and no clean plant, and the fit swings 3.3–4.9 with the band.

## Portraits (`renderPortrait` in `lab.js`)

Actors with `portrait: true` in `bake.json` also get `<out>.face.png`: head and shoulders,
96 × 112, **lit** (the windows have no deferred light): a warm key, a cool fill and a violet
rim, the figure turned 22° and the camera 8° above eye level, the head 60 % of the frame,
supersampled 4×, a light grade and the atlas's 1 px ink outline. The windows draw it through
`src/ui/actorart.js` `drawPortrait` (an actor without one falls back to a crop of its atlas).

Actors with `figure: { pose: [clip, t], yaw? }` also get `<out>.fig.png` (`renderFigure`): the whole
figure for the character window, 352 × 408 (176 × 204 CSS at 2×), lit the same way, in the actor's
own pose — a guard, a raised staff, a lifted mug — turned `yaw` degrees (default 24; the mage turns
−30 so the staff stays off her face). The frame comes from the rest pose, so every figure's feet
sit on the same line, over the window's ground shadow. `drawCharacter` draws it.

## Heroic proportions (`HEROIC` in `lab.js`)

KayKit ships chibi proportions. The heroic pass shrinks the head bone to **0.62×** and
pushes joints outward — spine ×1.20, chest ×1.18, neck ×1.10, knee→ankle ×1.50,
ankle→foot ×1.45, elbow→wrist ×1.30. That lengthens limbs and torso without thickening
them. It runs **after** each pose is sampled, because the clips key scale and
translation on every bone.

## Gotchas

- **GLTFLoader strips `.` from node names** (`handslot.r` → `handslotr`, `lowerleg.l` →
  `lowerlegl`). `findNode()` and `applyHeroic()` accept both spellings. Before this fix,
  weapons silently failed to attach and the leg stretch did nothing.
- Normalising every figure to 46 px means a heroic figure's head covers fewer pixels.
  That's intended, but it's why the heroic row looks slightly "smaller".
- The in-world board is ~0.15 % non-deterministic (live torch flicker in the backdrop).
  The lineups are pixel-stable.

## License

KayKit Character Pack: Adventures 1.0 and Skeletons 1.0 by Kay Lousberg — **CC0 1.0**
(no attribution required, no share-alike). Only baked outputs will ever ship; the
downloaded `models/` are never committed.
