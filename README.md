# EMBERFALL (repo: emberhold)

A portrait, one-thumb, D&D-paperback **autobattler party RPG** for phones. You lead a party of
three through the forgotten province of Emberfall: towns, overland roads, keeps and
dungeons. Battles fight themselves; you choose the quests, the party, the gear and the
tactics.

It is plain ES modules with **zero build**, a headless deterministic 20 Hz sim, and the
**Emberlit** WebGL2 deferred renderer with baked 56 px KayKit characters. It runs fully
offline.

## Start here

| Doc | For |
|---|---|
| [AGENTS.md](AGENTS.md) | How to work in this repo: commands, rules, best practices |
| [docs/architecture.md](docs/architecture.md) | App design, layers, tech stack decisions |
| [docs/development-plan.md](docs/development-plan.md) | Feature plan and milestones (plan of record) |
| [docs/emberfall-gdd.md](docs/emberfall-gdd.md) | Game design: rules and numbers |
| [docs/emberfall-world.md](docs/emberfall-world.md) | World canon: history, regions, factions, characters |
| [docs/quest-lore-system.md](docs/quest-lore-system.md) | Quests, lore, discovery, NPCs, dialogue |
| [docs/README.md](docs/README.md) | Every doc, with its status |

## Run

ES modules need a server:

```bash
python3 -m http.server 8080      # open http://localhost:8080 (use your LAN IP on a phone)
```

Useful URLs:
- `?scene=town|overland|dungeon` starts in a scene;
- `?region=vale|fens|reach|heights` picks the region;
- `?dev` exposes `globalThis.__sim`;
- `?dev&slow=8` runs in slow motion;
- `?dev&manual` gives step-by-step frames;
- `?dev&tod=night` (or `dawn`, `day`, `dusk`, a fraction of the day) holds the outdoor light for look-dev.

**Controls:**
- launch: the studio splash and the loading screen, then tap to begin;
- the title screen starts or continues the slot's game (Begin plays the intro, *The Chronicle
  of the Fall*, then character creation; The Chronicle replays it); ☰ brings it back as a pause
  menu (game slots, the Party screen);
- drag anywhere for a floating joystick;
- tap to walk or use things;
- tap an enemy to focus it;
- tap a party card for the character window (Gear, Stats, Skills);
- in a town square, the service bar opens the tavern, the inn (rest, the party and bench)
  and the temple (raise the Fallen, respec);
- the compass (under the minimap) offers auto-travel.

## Test

```bash
npm ci                 # dev tooling only (the game itself has no build step)
npm run check          # types, lint, content schemas, unit tests, smoke tests
npm run test:browser   # replay parity across browser engines, game-slots flow
```

CI runs the same on every push (`.github/workflows/ci.yml`).

## Deploy

Deploys run on Netlify as static files. `netlify.toml` publishes `.` with no build command,
and every push to `main` deploys. Store builds (Capacitor) and packaging (Vite) arrive at
milestone M6 ([docs/development-plan.md](docs/development-plan.md)).

## Saves

- **What a save holds:** the world seed plus what changed, via the sim's `snapshot()` /
  `restore()`. This covers the party, gear and bag, counters, the dungeon overlay and
  discovery.
- **Where:** up to **three game slots**, each its own world, main character and party, in
  IndexedDB (☰ in the HUD). They autosave every 15 s and on tab hide, with a synchronous
  backup. Saves are versioned (v5, with migrations). Code: `src/persist/save.js`.
- **Next:** **verified** cloud saves. The server replays each play session
  (`src/sim/replay.js`), so edited memory, saves or clocks can't advance levels or create
  gear.

## Credits

Character and weapon models: KayKit (CC0). See [assets/CREDITS.md](assets/CREDITS.md).
