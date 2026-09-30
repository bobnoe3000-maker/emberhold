# Emberfall — Quest, Lore and Discovery System (the Hero component)

**v1.0 · 2026-09-28 · Spec for M4–M5** ([development-plan.md §2.5–§2.6](./development-plan.md)).
It covers:
- quests (hero and side);
- NPC talk and dialogue;
- discovery;
- the Chronicle;
- the player's Journal.

**Rules:**
- Mechanics follow [emberfall-gdd.md §9](./emberfall-gdd.md); content follows
  [emberfall-world.md](./emberfall-world.md); code layout follows
  [architecture.md](./architecture.md).
- **All text is pre-written.** Branching lives in Ink. Variety comes from seeded selection
  among authored pools, never from generated prose.

---

## 1. Principles

1. **The sim owns the truth.**
   - Quest state, flags, discoveries and fragments live in the sim snapshot.
   - Progress is driven by sim events.
   - The UI and Ink only *read* that state and *request* changes, as commands.
2. **Deterministic.**
   - Which side quests appear, which rumours an NPC tells and where fragments lie are all
     pure functions of (seed, region, in-game day, rank, act, flags).
   - A replay reproduces them.
3. **Content is data with stable ids.**
   - Quest ids, knot names, NPC ids and fragment ids are API.
   - Saves store ids and counters, never text.
4. **Small stakes that grow; history found, not told** (world doc tone rules).
   - Every quest line should either move the act forward or put a piece of the past in the
     player's hands.

---

## 2. Vocabulary

| Term | Meaning |
|---|---|
| **Quest def** | Authored content: id, kind, gates, steps, objectives, rewards, dialogue knots |
| **Quest instance** | Runtime state for one quest: `state`, current step, objective counters, the seed used |
| **Objective** | A condition counted from sim events (e.g. *kill 6 Ashbound in the Old Barrows*) |
| **Gate** | When a quest or discovery is offered or visible: region, town, level window, renown, act, class, origin, flags |
| **Flag** | A named boolean or small integer in the save (`mill_bandits_paid`, `met_ilse`) |
| **Discovery** | A place or event recorded the first time the hero finds it: sites, landmarks, hidden paths, NPCs met, bosses beaten |
| **Fragment** | A lore piece, 1–3 sentences, collected into the **Chronicle** |
| **Journal** | The player log window: quests, Chronicle, discoveries |

---

## 3. Quest kinds

| Kind | Source | Repeat | Examples |
|---|---|---|---|
| **Chapter** (hero) | Main arc, world doc §6 | Once | *Smoke over the Vale*: the Tithe Mill → Wickham Keep → the Old Barrows open |
| **Companion** (hero) | Found companions | Once per companion | Brannoc's *Chains of the Redhand* |
| **Class trial** (hero) | Class guild figure in town | Once each at levels 6, 12 and 20 | Fighter: *Hold the Mill Bridge* (Hold 8 waves) → unlocks Shield Wall |
| **Board** (side) | Lantern Guild board, from templates | Refreshes each in-game dawn, 3–5 offered | Hold / Bounty / Rescue / Retrieve / Delve / Escort / Investigate |
| **NPC errand** (side) | Quest-giver NPCs, from templates | One per giver at a time | *"My brother went to Wickham Keep with a shovel and a bad idea."* |
| **Bounty** (side) | Warden-Captain Hale's post | Weekly rotation | A named elite in a named site |
| **Discovery** | Exploration | Once per thing | Find the Sunken Chapel; read *Standing Order 14* |

---

## 4. Data model (content)

All files sit under `content/` and are validated against `content/schema/*.json` in CI. The
examples are abridged.

### 4.1 Quest def (hero)

```json
{
  "id": "ch1_tithe_mill",
  "kind": "chapter",
  "act": 1,
  "title": "Smoke over the Vale",
  "giver": "maudry_fenn",
  "gates": { "region": "vale", "level": [1, 8], "flags": [], "renown": { "vale": 0 } },
  "steps": [
    { "id": "talk", "objectives": [{ "type": "talk", "npc": "maudry_fenn", "knot": "maudry_ch1_offer" }] },
    { "id": "clear", "objectives": [{ "type": "hold", "site": "tithe_mill", "room": "mill_floor", "waves": 3 }],
      "journal": "Drive the Redhand out of the Tithe Mill." },
    { "id": "report", "objectives": [{ "type": "talk", "npc": "osric_hale", "knot": "hale_ch1_report" }] }
  ],
  "rewards": { "xp": 250, "gold": 60, "renown": { "vale": 10 }, "item": { "rarity": "fine", "classBias": "hero" },
               "reveal": ["wickham_keep"], "unlock": ["ch1_wickham_keep"] }
}
```

### 4.2 Side-quest template (board / NPC)

**Implemented for the board (M4 slice 3, 2026-09-30).** It's simpler than the sketch below,
and deliberately so:
- **What the sim owns:** each template's shape, in `src/sim/board.js` `BOARD`. That covers which
  objective it sets, how its sizes are drawn, how much work it is and how deep it may send you.
- **What the content owns:** the words, one file per template in `content/board/<template>.json`
  (schema `board.schema.json`): 4+ titles, 6+ hooks each signed by a canon poster (world doc §4),
  the brief, the objective label, and the journal, ready and done lines.
- **Slots:** only `{n}` (a number) and `{floor}` (a word from the file's `ordinals`), so every
  line stays grammatical.
- **Ids:** a job is a pure function of (world seed, in-game day, the hero's level when the board
  went up, slot). Its id `board_<day>_<lv>_<slot>` rebuilds it, so the save keeps only ids and
  counters. `restore` drops an id from a day to come or above the hero's level.
- **Words:** the UI picks the title and hook from the job's own draws (`job.pick`, in
  `src/ui/boardwords.js`), so a job always reads the same.
- **Commands:** `boardAccept { id }` and `boardTurnIn { id }`, town only, at most 3 open. The
  Journal keeps the last 12 finished jobs.
- **Company:** since 2026-09-30 a job carries `company`, true for a Warden or Delve room of level
  4+ near or above your level. The card and the Journal say *bring company* (GDD §7.1).
- **New objective types** (§4.3):
  - `elites` counts the `slain { elite }` event (battle.js);
  - `reach` counts floors reached going down (`levelChanged` without a scene);
  - `waves` gains `hall` (only in the floor's stairs-down room) and `floor` (that floor or deeper),
    and `wave { cleared }` now carries its `room`.
- **Tests:** `test/board.test.mjs` walks every template solo on the compass alone; browser
  section 8.

```json
{
  "id": "tpl_bounty",
  "kind": "board",
  "template": "bounty",
  "gates": { "regions": ["vale", "fens", "reach", "heights"], "level": "region" },
  "pick": {
    "target": { "from": "elites", "filter": { "region": "$region", "act": "<=$act" } },
    "site": { "from": "sites", "filter": { "region": "$region", "discovered": true } },
    "giver": { "from": "npcs", "filter": { "roles": ["watch", "guild"], "town": "$town" } }
  },
  "hooks": "hooks/bounty.$region.act$act",
  "objectives": [{ "type": "kill", "target": "$target", "site": "$site", "count": 1 }],
  "rewards": { "xp": "region*40", "gold": "region*18", "renown": { "$region": 3 } },
  "skulls": "auto"
}
```

`hooks/bounty.vale.act1` is a pool of pre-written lines with slots:

```json
[
  "\"{target}, a grave rat the size of a dog, is eating the dead in {site}.\"",
  "\"Lord Pellam wants {target} gone from {site}. Lord Pellam wants a lot of things. This one pays.\""
]
```

Slots take only proper names from content, so every combination stays grammatical.

### 4.3 Objective types (driven by sim events)

| Type | Params | Counts on sim event |
|---|---|---|
| `talk` | npc, knot | `talked { npc, knot }` (the dialogue reached the knot's end tag) |
| `kill` | target (archetype, elite id or family), site?, count | `enemyKilled { kind, elite, site }` |
| `hold` | site, room?, waves | `wave { cleared, site, room }` |
| `reach` | site / landmark / floor | `entered { site, floor }` |
| `collect` | item or fragment id, count | `looted`, `fragmentFound` |
| `discover` | discovery id | `discovered { id }` |
| `escort` | npc, to | `escortArrived`; fails on `escortDown` |
| `rescue` | captive id, site | `freed { id }` |
| `deliver` | item, npc | `talked` with the item held; consumes it |
| `survive` | seconds, site | Room time without a wipe |

Objectives can be ordered (step by step) or unordered (`"any": true` within a step).

### 4.4 NPC def

```json
{
  "id": "maudry_fenn",
  "name": "Maudry Fenn",
  "role": ["innkeeper", "giver"],
  "town": "thornwick",
  "look": "npc_maudry",
  "schedule": [
    { "at": "dawn", "goal": "tavern_bar" }, { "at": "day", "goal": "tavern_bar" },
    { "at": "dusk", "goal": "square_well", "chance": 0.3 }, { "at": "night", "goal": "tavern_bar" }
  ],
  "dialogue": "maudry",
  "barks": "barks/innkeeper",
  "rumours": "rumours/vale",
  "gives": ["tpl_rescue", "tpl_retrieve"]
}
```

Townsfolk come from **role templates**:
- a name from the naming-guide lists (world doc §9);
- a look from the region's townsfolk set;
- a schedule and bark pools from the role;
- all picked with the town's seed stream, so Thornwick has the same people every time.

### 4.5 Lore fragment and discovery

```json
{ "id": "frag_standing_order_14", "region": "vale", "set": "vale", "order": 1,
  "text": "Standing order 14: the Third Legion holds the Wickham road until relieved. — Stamped by the Ember Throne, Year 612.",
  "note": "Found in the Old Barrows. They are still holding it.",
  "placement": { "sites": ["old_barrows"], "via": ["chest", "shrine", "runeplate"] },
  "reveals": ["boss_third_legion"] }
```

```json
{ "id": "disc_sunken_chapel", "type": "site", "region": "vale", "xp": 40,
  "revealedBy": ["rumour_vale_chapel_lights", "map_walk"], "journal": "A chapel half-swallowed by the marsh edge." }
```

Placement is deterministic: `streamSeed(seed, FRAGMENTS)` chooses the site and container per
fragment. Two players find the same truth in different places (world doc §7).

---

## 5. Runtime (sim)

**Implemented (M4 slice 2, 2026-09-29):**
- `src/sim/quests.js` is one module rather than the `src/sim/quest/` folder below:
  - it holds `QUESTS` (what counts and what pays), mirrored by `content/quests/*.json` (the
    words), with `test/quests.test.mjs` keeping the two in step;
  - states are 0 available, 1 active, 2 ready, 3 done, and −1 locked when the level window
    fails;
  - objectives are counted from the sim's own events: `waves` from `wave { cleared }` in a
    site's rooms, and `loot` from `looted { kind: 'chest' }`.
- Accepting and turning in come only from the giver's conversation: the Ink tags
  `# quest: accept <id>` and `# quest: turnin <id>`, checked against the talking NPC and the
  quest's state. Rewards (XP to the party, half to the bench, and gold) are paid once, through
  `gainXp` and the counters.
- Commands: `track`, `questAbandon` (not chapters). Events: `questChanged`, `questReward`,
  `questTracked`.
- Ink reads `q_<id>` for the quests an NPC gives.
- The compass's first row is the tracked quest's next place (`quests.compass`). There's none
  while you're in the fight it wants.
- **"Reach a floor" objectives** can come now: every floor has a stair back up, one floor at a
  time (GDD §3.1). The first errand predates that and asks for a chest instead. The board's Delve
  jobs use them (`reach`, §4.2).
- The first quest is Maudry's errand, *The Long Way Round*: hold 4 waves and open a chest in
  the Old Barrows. The Act I chapter (*Smoke over the Vale*, the Tithe Mill) waits for its
  site and the Redhand enemies.

**Module:** `src/sim/quest/`:
- `engine.js`: instance state machine, objectives, rewards;
- `generate.js`: board and NPC offers;
- `discovery.js`;
- `chronicle.js`.

**Quest state machine:**

```
locked ──gates pass──▶ available ──accept──▶ active ──last step done──▶ ready ──turn in──▶ done
                                   │                 │                              (rewards)
                                   └──decline/expire─┘──fail (escort down, timer)──▶ failed ──retry?──▶ available
active ──abandon──▶ available (side) | active stays (chapter: can't abandon)
```

**Event flow:**
- The engine subscribes to internal sim events. Battle, loot and travel emit them.
- Each tick it updates counters and advances steps.
- It emits `questChanged { id, state, step, progress }` for the UI.
- **Rewards** go through the same code paths as loot and XP:
  - items via `loot.drop('quest', …)` with a guaranteed rarity;
  - XP via `reward`.

**Generation:**

```
generateOffers(seed, { region, town, day, rank, act, flags, heroLevel }) → Offer[]
```

It is pure:
- The **stream** is `streamSeed(seed, QUESTS ^ hash(town, day))`.
- It picks templates that pass their gates, then fills slots from content filters, then a
  hook line from the pool.
- **Skulls** come from the level difference: target room level vs hero level (GDD §9).

**The in-game day:**
- It advances by **travel time plus rests at the inn**. It's sim time, so it stays
  deterministic.
- A real-time daily bonus refresh is sent as a command stamped with the date. The replay
  sees the same command, so it stays reproducible.

**Commands** (from the UI and story layer):
- `questAccept { id }`, `questDecline { id }`, `questAbandon { id }`, `questTurnIn { id }`;
- `track { id }`;
- `talk { npc }`;
- `dialogueEffect { tag, args }`, which comes from Ink tags (§6) and is validated against
  the current conversation.

---

## 6. Dialogue: Ink conventions

**Implemented (M4 slice 1: Maudry Fenn, 2026-09-29):**
- `content/npcs/maudry_fenn.json` (schema `content/schema/npcs.schema.json`) and
  `content/dialogue/maudry.ink` (compiled by `node tools/content/ink.mjs`, CI `--check`).
- `src/sim/npcs.js`: `NPCS` (where each stands; which flags its talk may set), the `talk`,
  `dialogueEffect` and `endTalk` commands, events `dialogue`, `flagChanged`, `talkEnded`.
  Tapping someone out of reach walks you up beside them first; walking off ends the talk.
- Bound today: `hero_name`, `hero_class`, `hero_origin`, `hero_level`, `party_size`,
  `fallen_name` and the NPC's own `flag_<name>`s. The rest of the list below comes with quests.
- Tags live today: `flag` (sim), `service` (opens that town window after the talk),
  `portrait` / `sfx` (ignored). `quest`, `give`, `reveal` reach the sim and are ignored until
  the quest engine validates them.
- `src/story/adapter.js` runs the story; `src/ui/dialogue.js` is the window (one line per tap,
  then choices; narration in italics, speech in quotes).
- **Quest choices are marked.** A tag inside a choice's brackets belongs to the choice and never
  reaches the sim: `+ [Anything I can do? #mark: quest]`. The window sets these apart with a ◆, a
  **Quest** label and the gold accent; `#mark: quest ready` (handing one in) uses **Hand in** and
  the Journal's green. Mark offers, accepts, turn-ins and "about that job" asks; not refusals.
- Tests: `test/npcs.test.mjs`; browser section 6 in `test/browser/run.mjs`.

**Files and knots:**
- One `.ink` file per named NPC (`content/dialogue/maudry.ink`) and one per quest chain.
- Knots are named `npc_topic_beat`, for example `maudry_ch1_offer` and
  `maudry_after_mill`.
- An `== npc_hub ==` knot per NPC routes by state.

**Variables bound in** (read-only from Ink's side):
- `hero_name`, `hero_class`, `hero_origin`, `hero_level`;
- `region`, `act`, `renown_vale` and the other regions;
- `q_<id>` (a state number) and `flag_<name>`;
- `frag_<id>` (known or not), `time_of_day`.

**Effects** go out only as tags. The adapter turns them into `dialogueEffect` commands, and
the sim validates each one against the quest defs:

| Tag | Effect |
|---|---|
| `# quest: offer ch1_tithe_mill` | Shows the accept / decline card |
| `# quest: accept ch1_tithe_mill` | Accepts the quest |
| `# quest: turnin ch1_tithe_mill` | Turns it in |
| `# flag: set met_ilse` / `# flag: add mill_rumours 1` | Sets or bumps a flag |
| `# reveal: sunken_chapel` | Map reveal (a rumour) |
| `# give: gold 20` | Only when the quest def lists it as a dialogue reward. The sim rejects unknown gifts. |
| `# shop: open` / `# service: resurrect` | Opens a UI window |
| `# portrait: maudry_smile` / `# sfx: door` | Presentation only |

**Example:**

```ink
== maudry_hub ==
{ q_ch1_tithe_mill == 0: -> maudry_ch1_offer }
{ q_ch1_tithe_mill == 3: -> maudry_after_mill }
Maudry wipes a mug that was already clean. "Something on your mind, {hero_name}?"
+ [Any work?] -> maudry_board
+ [Just passing.] -> END

== maudry_ch1_offer ==
"The Redhand are squatting in the Tithe Mill again. Burned the miller's cart for warmth, which is rich, seeing as it's summer."
{ hero_origin == "thornwick": "Your mother would've had them out with a broom." }
+ [I'll see to it.] # quest: accept ch1_tithe_mill
  "Mind the loft. It's not the bandits I'd worry about. It's the floor." -> END
+ [Not today.] "Suit yourself. They'll still be there. That's the trouble with bandits." -> END
```

**Barks and rumours** are JSON pools, not Ink: short, stateless and picked by seed.
- Keyed by `role × region × act × time_of_day`.
- A rumour carries a `reveals` id. The first time you hear it, the map marks the place.

**Voice** (world doc §1, §9):
- Wry, earthy, small-stakes.
- No chosen ones or prophecy.
- Nobles talk above their station.
- The dead are spoken of as ordinary trouble: *"the walking kind."*

---

## 7. Discovery and the Chronicle

- **Discoveries:**
  - site entered, landmark approached, NPC met, boss beaten, hidden path found;
  - each is recorded once;
  - it gives XP (small) and fires `discovered`, which can advance `discover` objectives and
    unlock rumours or quests.
- **Fragments** come from chests, shrines, rune plates, bosses and some dialogue.
  - `fragmentFound` adds the fragment to the **Chronicle**, grouped by region set, with
    **Sister Ilse** as the keeper.
  - **Completing a set:**
    1. reveals the region's **hidden site** (a guaranteed Heirloom, GDD §8);
    2. plays a short epilogue card;
    3. sets `flag_chronicle_<region>`, which Ink uses for NPC reactions.
- **Region boss unlocks:** some fragments have `reveals` (for example Standing Order 14 →
  the Standard of the Third Legion), tying region bosses to history (development plan §2.9).

---

## 8. The Journal (player log window)

**Implemented (M4 slice 2):**
- `src/ui/journal.js` is the window, opened from the book button under the compass or by
  tapping the tracker. It has two tabs:
  - **Active:** the kind badge, title, giver and level window, the current step text (or
    "go back to …"), each objective with a bar and a count, the reward, **Track** and
    **Abandon**;
  - **Completed:** the title, a closing line and what it earned.
- The tracker line sits just above the party cards (and above the town's service bar) and shows
  the tracked quest's title and its counts. It used to sit under the top HUD, where it covered the
  minimap; the compass's walk chip stacks above it.
- Toasts: *Quest accepted*, each objective step (*Waves held … 2/4*), *Quest complete · go
  back to …*, and the reward.
- The Available, Chronicle and Discoveries tabs come with their systems.

A bottom sheet with tabs, opened from a book icon under the minimap and from the party
card's menu:

| Tab | Content |
|---|---|
| **Active** | Quest cards: title, kind badge (Chapter / Companion / Trial / Board / Errand / Bounty), giver portrait, current step text, objective counters (`Hold 2/3 waves`), region and level, skulls, rewards. Actions: **Track** (one at a time) and Abandon (side quests only). |
| **Available** | Offers you've seen and not taken, and where to get them |
| **Completed** | A short record per quest: the date in in-game days, the reward |
| **Chronicle** | Fragments by region set (found and missing), set progress, epilogues, rewatch the intro |
| **Discoveries** | Places by region with a tap-to-travel compass pin; NPCs met; bosses beaten |

**Tracking:**
- The tracked quest's current objective becomes a **compass destination**, reusing
  `sim.destinations()` and the walk chip, with a map marker and a HUD line:
  *"Tithe Mill · Hold 2/3."*
- **Toasts:** *Quest accepted*, *Objective updated*, *Quest complete — return to Hale*,
  *New discovery*, *Fragment found*.

---

## 9. Content checklist per region (for writers)

- **4 chapter quests.** Each ends by revealing a new site, opening the story boss, or
  meeting a companion.
- **1 companion chain** (3 quests) and **3 class trials** (by level 20).
- **7 board templates**, each with a region hook pool of 8+ lines per act.
- **10 fragments.** Each ties to a site, a character or the secret (world doc §2). One
  unlocks the region boss.
- **Named NPCs:** 3–5 with Ink hubs. Each has lines for your origin, for your deaths and
  resurrections, and for the region's fragments.
- **Townsfolk pools:** 40 barks, 20 memory lines about the past, 15 rumours (each revealing
  something).
- **Cutscenes:** arrival, the chapter climax, the boss intro, the set epilogue.

---

## 10. Save shape (inside `sim.snapshot()`)

```js
quests: { [id]: [state, step, ...counters] },   // compact tuples
offers: { day, town, ids: [...] },               // today's generated offers (regenerable; cached)
flags: { [name]: number },
discovered: [...ids], fragments: [...ids], tracked: id | null, day: number
// the Ink story state is stored beside the snapshot (slot.story), not inside the sim
```

**Implemented so far:** `flags` (save v6); `quests` as `{ [id]: [state, step, ...counters] }` and
`tracked` (save v7). A restore keeps only known quests, real states and steps, and counters
within bounds. The Ink story state is *not* saved
(architecture A13): anything a conversation must remember is a flag, set through a validated
`dialogueEffect`, so the server can replay it. `slot.story` above is dropped from the plan.

---

## 11. Tests

- **Generator:**
  - the same inputs give the same offers;
  - gates are respected;
  - no offer targets an undiscovered or locked site.
- **Engine:**
  - every state transition;
  - objective counting per event type;
  - rewards are paid once;
  - escort fail and retry.
- **Save:** round-trip with quests mid-step; migration from saves without quests.
- **Content** (CI):
  - schemas;
  - every id referenced exists: quest → npc, knot, site, fragment;
  - every Ink file compiles;
  - every tag is known;
  - every hook slot resolves.
- **Playthrough** (Playwright, manual clock): the Act I golden path, with journal
  screenshots at each step.
