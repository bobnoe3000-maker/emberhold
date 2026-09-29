# Emberfall (Emberhold) — Design Docs

Reference artifacts for the game. Living documents: update them here as decisions
change, and add new ones alongside. Newest planning always supersedes older — see
the header of each status doc for what it replaces.

| Document | What it is | Status |
|---|---|---|
| [architecture.md](./architecture.md) | App design, layers, module map, determinism, online services, **evaluated tech stack** with decision log (A1–A11, incl. verified progression) | **Plan of record** for architecture (2026-09-28) |
| [development-plan.md](./development-plan.md) | Feature plan (intro and cutscenes, accounts, hero creation and select, character windows and stat points, NPCs, quests and lore, loot, Ember Rifts, region bosses, death and resurrection, multiplayer) and milestones M2.5–M12 | **Plan of record** for build order (v0.5, 2026-09-28) |
| [quest-lore-system.md](./quest-lore-system.md) | The Hero component: quest kinds, content data model, objective types, deterministic generator, Ink dialogue conventions, discovery, the Chronicle, the Journal | **Spec** for M4–M5 (2026-09-28) |
| [../AGENTS.md](../AGENTS.md) | Working agreement and best practices for agents and contributors | **Current** |
| [town-art-options.md](./town-art-options.md) | Town + overland prototype with our own buildings; hub towns (one per region, same shapes, regional tones), live via `?scene=town&region=vale` | **Decided** — Option A shapes, regional tones (2026-09-28) |
| [emberfall-gdd.md](./emberfall-gdd.md) | **Emberfall** game design: autobattler party RPG, classes, stats and attributes, skills, creation and origins, death and resurrection, loot, quests and the Journal, overland, offline and multiplayer | **Plan of record** for game design (v1.2, 2026-09-28) |
| [emberfall-world.md](./emberfall-world.md) | Emberfall world summary: history, regions, factions, characters, four-act arc, discoverable lore, bestiary, Ember Rifts and region bosses, origins and dialogue voice | **Canon** for narrative and quest content (v1.2, 2026-09-29) |
| [tile-styles.md](./tile-styles.md) | Five structured floor/wall tile styles × seven material variants (plain, earth, rock, lava, poison, ice, water), switch with `?tiles=&tv=` | **Current** — cobble is the default (2026-09-28) |
| [art-critic-pass-2.md](./art-critic-pass-2.md) | Critic pass 2: battle spacing, readable figures, church/forge/porch, soft foliage, dungeon room themes; scores 6.8–7.2 per track, ranked open issues | Superseded by pass 3 |
| [art-critic-pass-3.md](./art-critic-pass-3.md) | Critic pass 3: fluid movement (velocity, pure-pursuit paths, companion pursuit, sub-pixel camera, stride settle), +10 % walk speed, knight lighting, hit rim; measured before/after | **Current** (2026-09-28) |
| [compass-mockup.html](./compass-mockup.html) | Compass travel mockup: context-sensitive destinations (dungeon / overland / town) the party auto-walks to | **Implemented** (src/ui/compass.js, src/sim/travel.js) |
| [gear-mockup.html](./gear-mockup.html) | Character sheet mockup: tap a party card for six gear slots, stats and the party bag; item cards with comparison; loot toast | **Implemented** (src/ui/sheet.js) |
| [intro-mockup.html](./intro-mockup.html) | Load screen and intro, *The Chronicle of the Fall*, revision 4: direction C (Ash and flame); a script with a hook and a leader on every card; a haunting synth score in four cues (the Fall's carries unbroken through cards 3–5), with voice-led transitions on shared notes and equal-power crossfades; a painted finishing pass; the No Game Studios splash; lore-and-one-liner loading tips; no narration; and the script, music and art critiques | **Implemented** (2026-09-29; the last line became *"Looks like it is up to you."*): `src/cutscene/` (`player.js`, `scenes.js`, `score.js`), `content/cutscenes/intro.json`, `content/tips.json` |
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
