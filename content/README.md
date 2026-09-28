# content/

Game content as data (docs/architecture.md A5): every `content/<name>.json` is validated
against `content/schema/<name>.schema.json` by `npm run content` (Ajv), and CI fails on any
error or duplicate id. Code interprets content; it never embeds it. Canon (names, facts)
comes from `docs/emberfall-world.md` — change it there first.

| File | What | Consumed by |
|---|---|---|
| `origins.json` | The four hero origins (GDD §6.1) | Character creation (M3) |

Coming (docs/development-plan.md): `quests/`, `npcs/`, `lore/`, `dialogue/*.ink` (compiled
by the same step), `bosses/`, `rifts.json`, `cutscenes/`.
