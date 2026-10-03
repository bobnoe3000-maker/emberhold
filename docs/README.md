# Emberfall (Emberhold) — Design Docs

Reference artifacts for the game. Living documents: update them here as decisions
change, and add new ones alongside. Newest planning always supersedes older — see
the header of each status doc for what it replaces.

| Document | What it is | Status |
|---|---|---|
| [architecture.md](./architecture.md) | App design, layers, module map, determinism, online services, **evaluated tech stack** with decision log (A1–A11, incl. verified progression) | **Plan of record** for architecture (2026-09-28) |
| [development-plan.md](./development-plan.md) | Feature plan (intro and cutscenes, accounts, hero creation and select, character windows and stat points, NPCs, quests and lore, loot, Ember Rifts, region bosses, death and resurrection, multiplayer) and milestones M2.5–M12 | **Plan of record** for build order (v0.5, 2026-09-28) |
| [quest-lore-system.md](./quest-lore-system.md) | The Hero component: quest kinds, content data model, objective types, deterministic generator, Ink dialogue conventions, discovery, the Chronicle, the Journal | **Spec** for M4–M5 (2026-09-28); §5 quests, §6 dialogue and §8 the Journal **partly implemented** (M4 slices 1–2) |
| [../AGENTS.md](../AGENTS.md) | Working agreement and best practices for agents and contributors | **Current** |
| [nature-pack-proposal.md](./nature-pack-proposal.md) | Quaternius' Stylized Nature MegaKit (CC0) as landscaping: the env lab's new cut-out (alpha-mask) bake support, every model at in-game scale beside ours, colour measured and graded, two in-game variants (undergrowth only, a full tree swap) captured against now; recommends the undergrowth and rocks and keeping our trees | **Implemented** (2026-10-03): undergrowth and rocks; `tools/actor-lab/env.json` + `envlab.js`, `src/sim/outdoor.js` (`undergrowth`, `ROCKS`), `test/town.test.mjs` |
| [town-layout-proposal.md](./town-layout-proposal.md) | The town reviewed as an art critic would (the square, the way in, the edge) and replanned for the portrait frame: for Thornwick a timber palisade with watchtowers (stone kept for a later town), the bridge straight into an east gate, the camera leading to the gate on the approach, a cobbled high street, five services round the well with every entrance facing it, more room between them; Thornwick walled on the overland to match. Measured on a blockout with stand-in wall pieces | **Implemented** (2026-10-03): `src/sim/outdoor.js` (`buildTown`, the overland's Thornwick), `tools/actor-lab/buildkit.js` + `town.json`, `src/render/renderer.js` (camera lead, plaques), `src/sim/npcs.js`; `test/town.test.mjs` |
| [town-art-options.md](./town-art-options.md) | Town + overland prototype with our own buildings; hub towns (one per region, same shapes, regional tones), live via `?scene=town&region=vale` | **Decided** — Option A shapes, regional tones (2026-09-28) |
| [emberfall-gdd.md](./emberfall-gdd.md) | **Emberfall** game design: autobattler party RPG, classes, stats and attributes, skills, creation and origins, death and resurrection, loot, quests and the Journal, overland and the time of day, the forge and the shop, offline and multiplayer | **Plan of record** for game design (v1.14, 2026-10-02) |
| [emberfall-world.md](./emberfall-world.md) | Emberfall world summary: history, regions, factions, characters, four-act arc, discoverable lore, bestiary, Ember Rifts and region bosses, origins and dialogue voice | **Canon** for narrative and quest content (v1.14, 2026-10-02) |
| [tile-styles.md](./tile-styles.md) | Five structured floor/wall tile styles × seven material variants (plain, earth, rock, lava, poison, ice, water), switch with `?tiles=&tv=` | **Current** — cobble is the default (2026-09-28) |
| [art-critic-pass-2.md](./art-critic-pass-2.md) | Critic pass 2: battle spacing, readable figures, church/forge/porch, soft foliage, dungeon room themes; scores 6.8–7.2 per track, ranked open issues | Superseded by pass 3 |
| [character-customization-proposal.md](./character-customization-proposal.md) | Character customisation and gear on the figure: options evaluated (pre-baked, 2D layers, live 3D in the windows), "custom on KayKit's skeleton", body builds and face shapes, a phased plan and what to decide | **Proposed — parked** (2026-09-29); revisit later |
| [body-mockup.md](./body-mockup.md) | Mock-up: our own code-built bodies, clothes, headgear and weapons skinned to KayKit's skeleton and clips; body builds (thin · normal · thick) and face shapes (normal · thin · thick · round · oblong · pear) | **Mock-up** (2026-09-29), evidence for the proposal above; not shipped |
| [art-critic-pass-4.md](./art-critic-pass-4.md) | Critic pass 4: faces — the modular face kit (`tools/actor-lab/faces.js`), baked lit portraits for the windows, new faces for the five hero looks and Maudry; measured before/after | **Current** (2026-09-29) |
| [art-critic-pass-5.md](./art-critic-pass-5.md) | Critic pass 5: the time of day — dawn, day, dusk and night light for town and overland (`render/daylight.js`), the HUD's sky dial under the embers, the HUD row that fits a phone; measured before/after, overlap-tested | **Current** (2026-10-01) |
| [art-critic-pass-6.md](./art-critic-pass-6.md) | Critic pass 6: the people — townsfolk dressed (no more bare-looking legs), each carrying their trade (lantern, hammer and apron, whip, keys, eggs), the rogue's trousers; animation: measured walk strides (no skating), the square out of lockstep, gestures at their own speed, turning to each other in a conversation | **Current** (2026-10-02) |
| [character-stage-proposal.md](./character-stage-proposal.md) | The Stage (`?dev&scene=stage`), a dev-only lineup page where the party, townsfolk and foes stand in rows animated in place through the real renderer (clip, facing, light, zoom, before/after twin), plus a capture tool; a player-facing gallery later | **Implemented** (2026-10-02): `src/dev/stage.js`, `tools/capture/stage.mjs`, browser test §15c |
| [face-fidelity-proposal.md](./face-fidelity-proposal.md) | Art critic pass 7 (options): why faces read blank in the world (the bake averages sub-pixel eyes, brows and mouths away; pale hair melts into skin), with prototypes on the Stage: A keep features whole, B a face grade and hairline, C bigger heads; A2, D and E described | **Implemented** (2026-10-02): A2b + B shipped as the default bake (`tools/actor-lab/lab.js`) |
| [art-critic-pass-7.md](./art-critic-pass-7.md) | Critic pass 7: the eyes. What's wrong with A's (goggles, black holes, fused brows), A2 a pixel-art eye (A2a, A2b with whites), and D more pixels per figure (D1 72 px; D2 a simulated 112 px layer), all on the Stage; recommends A2b + B; *Shipped*: A2b + B with whites in both views and toned brows, every face actor rebaked | **Implemented** (2026-10-02) |
| [art-critic-pass-8.md](./art-critic-pass-8.md) | Critic pass 8: Thornwick's people. Women no longer read as bearded (necklines), nobody stands behind a roof or in the well (spots measured with the renderer's x-ray share; browser test 15d), the Watch out of the hero's plate, heights in canon order, a compact amble (`Walking_B`) | **Implemented** (2026-10-02) |
| [art-critic-pass-11.md](./art-critic-pass-11.md) | Critic pass 11: toward the owner's reference (a commercial village frame, kept out of the repo, described in words). What it does (warm high-key light, tiled roofs, leaf-cluster crowns, dressed bases, life), the same pixel metrics on it and on us (a third darker, half as colourful, neutral where it's warm), a rubric (reference 8.7, us 4.4, target 7.5), and twelve iterations (11a–11l: light, shadow, buildings, plants and ground, life, the crowd, cast shadows, greenery, field walls, the cast, trees among the houses); 4.4 → 7.3 | **Implemented** (2026-10-03) |
| [art-critic-pass-10.md](./art-critic-pass-10.md) | Critic pass 10: the Vale's landscape. Mountains smaller than the keep and on a lattice, crumpled facets and dunce-cap snow; near-black pines and pines cut into grove oaks; no woods where you walk (13 % of the map near a tree) and a lumber camp in open meadow; roads with hard corners, rail-track ruts and tangled joins; a river of canal bands and ice-crack streaks, and the Tithe Mill 10 tiles from water. Measured in 19 phone frames and from above; proposals M1–M3, T1–T4, R1–R5, W1–W4 in two phases. *Shipped*: the pines' black was a NaN bug in the bake; massifs twice the keep, at half resolution; six woods; filleted roads with aprons and tracks; a meandering river with a mill-race | **Implemented** (2026-10-03): `tools/actor-lab/buildkit.js`, `envlab.js`, `env.json`; `src/sim/outdoor.js`, `road.js`; `src/render/outdoorpaint.js`, `renderer.js` (`up`); `test/overland.test.mjs` |
| [art-critic-pass-9.md](./art-critic-pass-9.md) | Critic pass 9: the foes. Each kind gets its own face (none wears a hero's), Garrow bareheaded in steel, the Robed Stranger in the Cult's charcoal and ember with his lit ember-shard, the bosses baked tall at 73 px instead of upscaled ×1.3, weapon effects and sparks for the Redhand, the Cult and the bosses, staves held upright | **Implemented** (2026-10-02) |
| [skeleton-skull-proposal.md](./skeleton-skull-proposal.md) | The Ashbound minion's skull: why it reads as a white egg (the bake averages its sockets away, the cloak hides its jaw), and options prototyped on the Stage: a pixel skull drawn from the geometry (sockets with a brow ridge, a nasal notch, teeth), the cloak off, a bone grade, a smaller skull. Shipped: P1b on all five skeletons, the minion's cloak replaced by a low rag | **Implemented** (2026-10-02) |
| [dialogue-critic-pass-1.md](./dialogue-critic-pass-1.md) | Dialogue critic pass 1: every conversation, quest, board job and Chronicle note read for who / what / where / when; the fixes (the Journal shows why, hand-ins name the job, one word per thing); and an audit of the game's terms (Fallen, shrine, embers…) with recommendations | **Current** (2026-10-01) |
| [tavern-hire-mockup.html](./tavern-hire-mockup.html) | Mockup: the tavern's Hire companions view split into two sub-tabs (Your company · Hire) under the Guild's terms and the purse; "Add to roster · fee" when the party is full; swap a bench member in from the tavern | **Implemented** (2026-10-02): `src/ui/townmenu.js` hire(); browser test §15 |
| [art-critic-pass-3.md](./art-critic-pass-3.md) | Critic pass 3: fluid movement (velocity, pure-pursuit paths, companion pursuit, sub-pixel camera, stride settle), +10 % walk speed, knight lighting, hit rim; measured before/after | **Current** for movement (2026-09-28) |
| [compass-mockup.html](./compass-mockup.html) | Compass travel mockup: context-sensitive destinations (dungeon / overland / town) the party auto-walks to | **Implemented** (src/ui/compass.js, src/sim/travel.js) |
| [gear-mockup.html](./gear-mockup.html) | Character sheet mockup: tap a party card for six gear slots, stats and the party bag; item cards with comparison; loot toast | **Implemented** (src/ui/sheet.js) |
| [intro-mockup.html](./intro-mockup.html) | Load screen and intro, *The Chronicle of the Fall*, revision 4: direction C (Ash and flame); a script with a hook and a leader on every card; a haunting synth score in four cues (the Fall's carries unbroken through cards 3–5), with voice-led transitions on shared notes and equal-power crossfades; a painted finishing pass; the No Game Studios splash; lore-and-one-liner loading tips; no narration; and the script, music and art critiques | **Implemented** (2026-09-29; the closing lines became *"The heroes of this age are not available… Looks like it is up to you."*): `src/cutscene/` (`player.js`, `scenes.js`, `score.js`), `content/cutscenes/intro.json`, `content/tips.json` |
| [m5-plan.md](./m5-plan.md) | M5, the Hollow Vale: sites as data, the Redhand Company, bosses, Act I, Brannoc, class trials, the whole Vale Chronicle, loot and balance for levels 1–8; slices and decisions | **Implemented** (M5 done, 2026-09-30) |
| [difficulty-pass-1.md](./difficulty-pass-1.md) | Difficulty pass 1: the room sets the wave, the tide and its cap (1b), a lull that's a breath, party XP, gear's share of power; before/after matrix, tuning trials and the smoke contract (GDD §7.1) | **Implemented** (2026-09-30; src/sim/battle.js, src/sim/items.js) |
| [gear-and-loot-plan.md](./gear-and-loot-plan.md) | Gear and loot v1: item data and rolls, equip rules, drops, sheet UI, tests, what's deferred | **Implemented** (src/sim/items.js, src/sim/loot.js) |
| [art-critic-pass-1.md](./art-critic-pass-1.md) | Critic pass 1: animation clips, grounding, layouts; before/after scores | Superseded by pass 2 |
| [prompts/art-eval-loop.md](./prompts/art-eval-loop.md) | The four-track art improvement + evaluation loop prompt (characters, assets, town, dungeon) | **Ready to run** |
| [character-direction.md](./character-direction.md) | Character art decision — KayKit CC0 3D, heroic proportions, 'grim' pass; roster + integration plan | **Current** character direction (2026-09-27) |
| [emberlit-tdd.md](./emberlit-tdd.md) | Technical design for the Emberlit WebGL2 deferred renderer (G-buffers, point lights, HDR bloom) | **Active** render spec (shipped) |
| [emberlit-demo.html](./emberlit-demo.html) | The Emberlit reference demo the renderer was ported from (open in a browser) | Reference |
| [emberhold-status-v0.4.md](./emberhold-status-v0.4.md) | Project status & plan (v0.4) — art direction pivots to Dreadforge (nightmare) | Superseded by [development-plan.md](./development-plan.md) (v0.5) |
| [dreadforge-tdd.md](./dreadforge-tdd.md) | Technical design doc for the Dreadforge nightmare pipeline (materials, voxel bake, CA creatures, post stack, hybrid actors) | **Active** art-direction + render spec |
| [dreadforge-mockup.html](./dreadforge-mockup.html) | Confirmed nightmare-biome look — from-spec, live generators (open in a browser) | **Current** visual reference |
| [emberhold-iso-pivot-tdp.md](./emberhold-iso-pivot-tdp.md) | Technical design plan for the isometric fine-tile pivot | Landed (iso geometry); superseded on mood by Dreadforge |
| [emberhold-status-v0.3.md](./emberhold-status-v0.3.md) | Project status & plan (v0.3) — save/load + iso pivot | Superseded by v0.4 |
| [emberhold-design.md](./emberhold-design.md) | Full game design + architecture + roadmap (v0.1, v0.3-amended) | Layering rules restated in architecture.md; **stack choice superseded** by architecture.md; **game design superseded** by emberfall-gdd.md |
| [art-style-iso.html](./art-style-iso.html) | Iso field guide — terrain, cliffs, props, detailed 24×36 characters | Geometry/proportion reference; **Emberwood mood retired** by Dreadforge |
| [iso-mockup-fine.html](./iso-mockup-fine.html) | The original iso visual-spec proof — 16×8 diamonds, elevation, quantized lighting | Reference the pivot spec was locked from (pre-detailed-doll) |
| [assetforge-v0.html](./assetforge-v0.html) | Original procedural art-pipeline proof (palettes, blob-47, paper-doll) | Historical — flat top-down; blob-47 now parked |
| [emberhold-status-v0.2.md](./emberhold-status-v0.2.md) | Prior status (v0.2) | Superseded by v0.3 |

## Conventions

- **Status docs are versioned** (`-v0.2`, `-v0.3`, …). Bump the version on a re-baseline
  rather than editing history; state what the new version supersedes in its header.
- **The design doc is the "why."** Amend it in place when a locked decision changes
  (see its v0.3 iso banner), and note the change in the current status doc's decision log.
- Implementation lives at the repo root (`index.html`, `src/`); these docs describe
  intent, not the running build. Keep the two in sync when a phase ships.

## Build progress (quick pointer)

Status as of v0.5 (2026-09-28): [development-plan.md §1](./development-plan.md) lists what's
shipped on `main`:
- M1 battle core;
- the Thornwick hub and overland;
- compass travel and tap-to-move;
- loot v1 and the character sheet;
- weapon effects;
- fluid movement (critic pass 3);
- **M2.5 Foundations** (done): the Emberfall rename, three game slots, types, lint, tests, CI;
- **M3 Heroes** (done): the title and pause menu, character creation with origins, the Party
  screen and bench, attributes and skills, stances, and death and resurrection (Fallen,
  temple, shrine, inn, Weakened).

**Next: M4** in [development-plan.md](./development-plan.md) §3.
