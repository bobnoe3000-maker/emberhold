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
node capture-backdrop.cjs    # real game room, actors hidden → out/backdrop.png
python3 compose.py           # out/board_{heroes,enemies,inworld}.png   (needs Pillow)
```

`render.cjs` serves this folder itself and drives headless Chromium with SwiftShader
WebGL. Set `CHROME_PATH` if Chromium isn't at the sandbox's `/opt/pw-browsers` path.
`capture-backdrop.cjs` serves the repo root and uses two dev-only hooks: `?dev`
(exposes `globalThis.__sim`) and `globalThis.__noactors` (the renderer skips actors).

## Files

| file | role |
|---|---|
| `lab.js` / `lab.html` | three.js harness: loadouts, weapon attachment, recolor, glowing eyes, heroic pass, render |
| `variants.json` | the roster: 10 hero loadouts (fighter/rogue/mage) + 8 enemy NPCs |
| `render.cjs` | static server + headless render of every variant; exports `serve`, `CHROME`, `GL` |
| `capture-backdrop.cjs` | screenshot a furnished room with actors hidden (dpr 2 ⇒ 1 screenshot px = 1 canvas px, 3 per native px) |
| `compose.py` | the 'grim' pass + the three boards |
| `fetch-assets.sh` | pulls the KayKit Adventurers + Skeletons packs from raw GitHub |

## Variant knobs (`variants.json`)

- `model` — `Knight`, `Barbarian`, `Rogue`, `Rogue_Hooded`, `Mage`, `Skeleton_{Warrior,Minion,Rogue,Mage}`
- `show` — accessory meshes to keep (every other accessory of that model is hidden), e.g.
  `["1H_Sword","Round_Shield","Knight_Helmet","Knight_Cape"]`. The full lists are in `ACC` in `lab.js`.
- `attach` — `{ bone: file }` parents a weapon glTF onto `handslot.r` / `handslot.l` (skeleton weapons ship separately).
- `recolor` — a CSS filter applied to the model's colour texture; how human enemy NPCs reuse hero models.
  (Look-dev only: the shipping version should remap swatches in the small palette texture exactly.)
- `eyes` — emissive colour for the skeletons' separate `*_Eyes` mesh.
- `pose` — `[clipName, t01]`; default `["Idle", 0.5]`. Every model shares one rig with 76–95 clips
  (attacks, Hit, Block, Dodge, Death, Spellcast; skeletons add Awaken/Spawn/Resurrect).

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
