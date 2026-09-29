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

Coming (docs/development-plan.md): `quests/`, `npcs/`, `lore/`, `dialogue/*.ink` (compiled
by the same step), `bosses/`, `rifts.json`, more `cutscenes/`.
