# content/

Game content as data (docs/architecture.md A5): every `content/<name>.json` is validated
against `content/schema/<name>.schema.json`, and every `content/<dir>/*.json` against
`content/schema/<dir>.schema.json`, by `npm run content` (Ajv), and CI fails on any
error or duplicate id. Code interprets content; it never embeds it. Canon (names, facts)
comes from `docs/emberfall-world.md` — change it there first.

| File | What | Consumed by |
|---|---|---|
| `origins.json` | The four hero origins (GDD §6.1) | Character creation (M3); the sim's rule edges in `src/sim/party.js` are tested against it |
| `creation.json` | Class blurbs, locked classes and name suggestions per origin | Character creation (`src/ui/create.js`) |
| `tips.json` | Loading tips: lore lines (with a source) and one-liners (world doc §7) | The loading screen (`src/cutscene/player.js`) |
| `cutscenes/intro.json` | The intro, *The Chronicle of the Fall*: six cards, each a scene, a music cue and its lines (checked against `schema/cutscenes.schema.json`) | The intro (`src/cutscene/player.js`); `test/cutscene.test.mjs` keeps it in step with the scenes and the score |

| `npcs/<id>.json` | A named NPC: name, role, town, look (atlas), portrait, Ink file and entry knot (quest-lore-system §4.4) | The renderer (look, name tag), the dialogue window; `test/npcs.test.mjs` keeps it in step with the sim's table (`src/sim/npcs.js`: where they stand, which flags they may set) |
| `dialogue/<name>.ink` | Conversations in Ink (quest-lore-system §6): one file per named NPC (`maudry`, `osric`, `ilse`) and one shared by the townsfolk (`townsfolk`, a hub knot each), compiled to `dialogue/<name>.json` by `node tools/content/ink.mjs` (commit both; `npm run content` fails on a stale or broken one) | `src/story/adapter.js` → `src/ui/dialogue.js` |

| `board/<template>.json` | A Lantern Guild board template's words (titles, hooks signed by canon posters, brief, objective label, journal / ready / done lines, ordinals); the shape (what it counts and pays) is the sim's (quest-lore-system §4.2) | The board (`src/ui/townmenu.js`) and the Journal through `src/ui/boardwords.js`; `test/board.test.mjs` keeps them in step with `src/sim/board.js` and checks every poster is in the world doc |
| `lore/<id>.json` | A Chronicle fragment's words (title, text, note, and where it is while missing); the text is canon from the world doc §7 (quest-lore-system §7) | The Journal's Chronicle tab (`src/ui/journal.js`); `test/lore.test.mjs` keeps it in step with the sim's table (`src/sim/lore.js`) and checks each text is in the world doc |
| `quests/<id>.json` | A quest's words (title, summary, step text, objective labels, the ready and done lines) and its shape (kind, giver, level window, steps, objectives, rewards) (quest-lore-system §4.1) | The Journal, tracker, toasts and compass (`src/ui/journal.js`); `test/quests.test.mjs` keeps the shape in step with the sim's table (`src/sim/quests.js`) and checks the giver's Ink has the accept and turn-in tags |

Coming (docs/development-plan.md): `lore/`, `bosses/`, `rifts.json`, more `cutscenes/`.
