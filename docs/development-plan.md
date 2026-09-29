# Emberfall — Development and Feature Plan

**v0.5 · 2026-09-28 · Plan of record for what we build next, and in what order.** It
re-baselines [emberhold-status-v0.4.md](./emberhold-status-v0.4.md), which predates
combat, towns, loot and the renderer work, and it replaces the roadmap table in
[emberfall-gdd.md §15](./emberfall-gdd.md).

| Question | Doc |
|---|---|
| How it's built | [architecture.md](./architecture.md) |
| The rules | [emberfall-gdd.md](./emberfall-gdd.md) |
| The canon | [emberfall-world.md](./emberfall-world.md) |
| The quest, lore and NPC system | [quest-lore-system.md](./quest-lore-system.md) |
| How to work here | [../AGENTS.md](../AGENTS.md) |

**Narrative rule for everything below:** all story, quest, lore and dialogue text is
**pre-written and branching**, authored in Ink and JSON. "NPC AI" means behaviour
(schedules, movement, roles); no text is generated at runtime (architecture §1).

---

## 1. Where we are (v0.5 baseline)

| Area | Shipped | Where |
|---|---|---|
| Sim core | 20 Hz deterministic headless sim; seed + diff saves (v3); commands in, events out | `src/sim/core.js`, `persist/save.js` |
| World | Themed dungeon levels (rooms, corridors, descent); Thornwick hub town with a fixed square; overland with roads, bridges and landmarks; compass travel; tap-to-move | `world.js`, `outdoor.js`, `travel.js`, `path.js` |
| Battle (M1) | Room battles at fixed room levels, waves, elites, formation, focus, autobattle, three classes with one ability each, light and heavy attacks, XP and levels, defeat → town | `battle.js`, `party.js` |
| Party (M2, part) | Hero plus two tavern hires; party cards | `ui/party.js`, `townmenu.js` |
| Loot v1 | Six gear slots, 36 class bases, Common–Rare rolls, Rare ability modifiers, a 20-slot bag, Embers, drops from chests, waves and elites; the character sheet | `items.js`, `loot.js`, `ui/sheet.js` |
| Presentation | Emberlit WebGL2 deferred renderer; 56 px KayKit actors (8 atlases) with weapon anchors; weapon effects; loot beams; sub-pixel camera; fluid movement (critic pass 3) | `render/*` |
| Tools | Actor, icon and environment bakes; motion traces; balance harness | `tools/actor-lab`, scratch harnesses |
| Fair play | Deterministic math (`detmath.js`) across engines; the session recorder, canonical state hash and replay verifier; dev hooks limited to localhost; smoke tests prove tampering is rejected | `sim/detmath.js`, `sim/replay.js` |
| Foundations (M2.5) | Emberfall name; three game slots (IndexedDB, save v4); Preact windows; types, lint, unit, content and browser tests; CI | `persist/`, `ui/slots.js`, `test/`, `.github/workflows/ci.yml` |
| Heroes (M3) | Title / pause menu; character creation (class, look, origin, name); the Party screen with the bench; attributes and points; the Skills tab (ranks, auto-cast, priority, stance) with 9 abilities and 3 passives; Downed / Fallen / ghosts, the temple, shrines, the inn, Weakened; save v5 | `sim/heroes.js`, `sim/attributes.js`, `sim/skills.js`, `ui/title.js`, `ui/create.js`, `ui/partyscreen.js`, `ui/sheet.js`, `tools/balance/roomlv.mjs` |

**Not yet built:**
- accounts, the intro;
- NPCs, dialogue, quests, lore and the journal;
- the other three regions;
- bosses, rifts, expeditions;
- multiplayer.

---

## 2. Feature plans

Each feature lists a player-facing design, the systems it needs, its content, and an exit
test. Where the GDD changes, the GDD has been amended (v1.2) and this plan points to the
section.

### 2.1 Intro, title and cutscenes

**Implemented (2026-09-29): the boot, the title and the intro**, as approved in
[intro-mockup.html](./intro-mockup.html) (direction C, revision 4, with the closing lines changed to
*"The heroes of this age are not available… Looks like it is up to you."*):
- `src/cutscene/player.js`: the studio splash (*No Game Studios*), the loading screen (lore tips
  from `content/tips.json`; the bar waits on `renderer.ready`), "Tap to begin", and the card
  player.
- `src/cutscene/scenes.js`: the six painted scenes.
- `src/cutscene/score.js`: the live-synthesised score (four cues, voice-led transitions).
- `content/cutscenes/intro.json`: the cards (scene, cue, lines).
- Begin on an empty slot plays the intro, then creation. **The Chronicle** on the title replays
  it. The score plays under the title and creation and fades out into play.
- Still to come: the timeline steps for in-game cutscenes, *Arrival in Thornwick*,
  `seenCutscenes`, and rewatching from Settings.

**Player flow:**
- **First launch:**
  1. Studio splash (1.5 s, tap to skip), then the loading screen (tap to begin).
  2. **Title.**
  3. New Game (Begin).
  4. **Intro cutscene.**
  5. Character creation.
  6. The *Arrival in Thornwick* cutscene.
  7. Play.
- **Later launches:** Title → Continue (the last-played game slot) or **Game slots** (up to
  three games).
- **Party:** the three hero slots of the current game.

**Title screen:**
- A live in-engine vignette behind the logo: Thornwick square at dusk, the camera drifting,
  embers rising. It uses the real renderer, so it costs no new assets.
- The EMBERFALL logo, and buttons for Continue / Party / Settings / Account.
- The build number, small.

**Intro, "The Chronicle of the Fall":**
- 60–90 s, 6 cards, tap to advance, skippable. It can be rewatched from Settings and the
  Chronicle.
- No narration: the card text is read, not voiced (decided 2026-09-29). The lines come
  straight from world doc §2; the approved script is `content/cutscenes/intro.json`. The score
  has four cues, and the Fall's plays unbroken through cards 3–5. Each card is a still baked from our own assets (actor-lab dioramas with the grim
  pass) under a text card:
  1. The Kindling: pilgrims at the crater.
  2. The Solmere Empire: the Ember Throne, the Ashbound at the forges.
  3. The Fall: in one night the Ember goes out, and the Ashbound drop where they stand.
  4. The Long Dim: ruins, mud roads.
  5. Now: smoke over the old forges, a barrow opening.
  6. Thornwick: *"The heroes of this age are not available… Looks like it is up to you."*

**In-game cutscenes** are short (5–30 s) and played by the timeline player:
- camera pans, letterbox bars, scripted walks (sim commands), Ink lines with portraits,
  fades and music cues;
- used for chapter beats, arrival in each region town, and boss intros (a pan to the boss
  and a name card).

**Systems:**
- `src/app/` screen state machine.
- `src/cutscene/` player. Timelines are data: `content/cutscenes/*.json`, with steps
  `camera`, `wait`, `card`, `still`, `say`, `walk`, `fade`, `music`, `letterbox`.
- The save records `seenCutscenes`.
- The sim is paused during a cutscene, except for the scripted walks.

**Exit test:** a fresh install reaches Thornwick through title, intro, creation and arrival
in under 3 minutes, and every step can be skipped. Continue resumes the last hero in one
tap.

### 2.2 Login and player accounts

**Guest-first; accounts are optional and additive:**
- First launch creates a **local profile** (a uuid) with no sign-up and no network.
- **Linking an account** is optional. It is offered:
  - after the first quest turn-in (a soft toast, once);
  - from Title → Account;
  - whenever a feature needs it (cloud save, leaderboards, multiplayer).
- **Providers:** Apple (required on iOS whenever any social login exists), Google, and an
  email one-time code.
- Under the hood this is Supabase anonymous sign-in, upgraded by linking an identity, so
  guest progress carries over.

**Account screen:**
- signed-in identity;
- display name (profanity-filtered word list; unique within a suffix);
- the cloud save, with last sync time;
- sign out;
- **delete account**, which removes all server data (a store requirement).

**Cloud saves:**
- Each game slot syncs to `saves (user_id, slot)`, one row per slot: the
  **server-verified** state (§2.13).
- Conflicts resolve as last-writer-wins. If both copies changed since the last sync, the
  player chooses between them, shown with level, region and playtime.
- The save stays small: seed + diffs, under 64 KB.

**Systems:** `src/net/supabase.js`, `supabase/migrations` (profiles, heroes, saves, with RLS),
and an account window (Preact).

**Privacy:**
- We collect an email only if the player chooses email login.
- We collect no location.
- There's an analytics opt-out.

**Exit test:**
- Guest play works in airplane mode.
- Linking later keeps all heroes.
- A second device pulls the saves.
- Deleting the account wipes the rows.

### 2.3 Hero slots, character select and creation

**Up to three game slots**, each a whole game:
- its own world seed;
- its own **main character**;
- its own party and progress.

Within a game, the party has **three hero slots: your main character plus two companions**,
the GDD's "you plus two companions" (GDD §6, §6.1).

**The game slots window** (**shipped at M2.5**: ☰ in the HUD, `src/ui/slots.js`) lists
three cards. Each shows the main character's name, class, level, party size, location,
playtime and last played.
- **Play** switches to that game.
- **New game** fills an empty slot and opens the Title with *Begin*, which leads to
  character creation (**shipped at M3**). A slot stays empty until creation's Begin.
- **Delete** asks twice.

The Title screen (**shipped at M3**, `src/ui/title.js`) is also the pause menu (☰): Continue /
Resume, Game slots, Party, and Account (M6). The sim doesn't tick while it is up.

| Slot | Who | Rules |
|---|---|---|
| **1: Main character** | Created once, at New Game | Always in the party; can't be dismissed; controlled by the stick and taps |
| **2–3: Companions** | Hired at a tavern, or found (Brannoc, Wren…) | Chosen on the **Party screen** from everyone you've recruited. The rest wait on the **bench** at the inn and earn 50 % XP. |

**Character select** is the **Party screen**: three large slot cards, each showing the
portrait, name, class, level, HP and gear score. You get to it from Title → Party, from the
inn, or by long-pressing a party card.
- **Slot 1** opens that character's window: Gear / Stats / Skills / Bag / Info (§2.4).
- **Slots 2–3:** **Swap** chooses a companion from the bench (in any town), and **Dismiss**
  sends them back to the bench.
- **A new main character** needs a free game slot, or deleting one (§2.3 above).

**Character creation** is one screen with a live figure preview on top and steps in a
bottom sheet:
1. **Class:** Fighter, Rogue, Mage or Cleric. Each card shows the role line, a stat radar, three
   ability icons with unlock levels, and a difficulty hint. The Healer shows as
   locked: *"Found in the fens"* (world doc §4).
2. **Look:**
   - the base model per class: Knight or Barbarian (fighter), Rogue or Hooded Rogue, Mage,
     the bareheaded Grey Sister's cleric;
   - five accent palettes (cloth, trim), baked as recolour variants.

   v1 ships the existing baked looks. A later runtime recolour mask means a new palette
   doesn't need a re-bake.
3. **Origin**, a small story hook (GDD §6.1). Each ties to a faction, opens unique dialogue
   lines, and gives a small edge:

   | Origin | Faction tie | Edge | Dialogue |
   |---|---|---|---|
   | *Thornwick-born* | Maudry Fenn knows your family | One extra hireling on the tavern roster | Warm town greetings |
   | *Redhand deserter* | The Redhand Company | +1 ATK at level 1 | Bandits may parley |
   | *Ward of the Grey Sisters* | The Grey Sisters | Lore fragments grant +20 % XP | Sister Ilse's early trust |
   | *Deepdelver-fostered* | The Deepdelvers | Smith upgrades are 10 % cheaper | Dwarf-folk banter |

4. **Name:** a text field, plus a dice button with suggestions from the naming guide
   (world doc §9) in lists per origin.
5. **Confirm:** the portrait card, then *"Begin"*.

**Systems:**
- The hero comes from `makeHero({ cls, look, origin, name })`, which replaces the fixed
  knight.
- The world seed is created at New Game.
- Origins are content (`content/origins.json`).
- Looks map to atlas names.

**Exit test:** create, select and delete heroes. Class and look show correctly in the
world and on the cards. An origin changes at least three dialogue lines in Act I.

### 2.4 Character windows: equipment, inventory, stats, skills; stat points

**Tap a party tile to open that member's window.** It already opens today (gear, stats,
bag). It grows into **tabs**:

| Tab | Content |
|---|---|
| **Gear** (shipped) | Six slots around the figure; item cards with comparison; equip, give, unequip, salvage |
| **Stats** | The four **attributes** with a point-spend UI; derived stats with the gear share in green; resistances later |
| **Skills** | The three class abilities and the passive, with unlock levels, ranks (1–5), an **auto-cast toggle and priority order**, and **stance** (Aggressive / Balanced / Defensive) |
| **Bag** | The shared inventory, with sort (slot / rarity / level), filter (usable by this member), a consumables row (potions later) and a capacity upgrade (20 → 30, a quest reward) |
| **Info** | Origin, trait, a short bio (companions), kills, deaths, time in party |

**Attributes and stat points** (GDD §4.1, new):
- **Four attributes:**
  - **Might:** ATK;
  - **Grit:** HP and DEF;
  - **Finesse:** CRIT and DODGE;
  - **Focus:** MP, MP regen and ability power.
- **Points:** each level-up grants **3 points**, plus class growth that stays automatic
  (reduced to 70 % of today's per-level growth).
- **Tuning target:** the class's *recommended* allocation reproduces today's stat curve
  within ±3 %, so balance holds and choice adds variety rather than power creep.
- **Companions:** they auto-allocate by class template, with an option to manage them
  yourself.
- **Respec** at the temple: the first is free, then 20 gold × level.
- A pending-points badge shows on the party card.

**Skills** (GDD §5.1, new):
- **Skill points:** 1 point at every even level (15 by level 30).
- **Ranks:** each point raises an ability's rank from 1 to 5. Each rank adds +10 % power,
  and ranks 3 and 5 also cost 1 MP less.
- **Unlocks:** abilities unlock at levels 1, 6 and 12 via **class quests** (§2.6), and the
  passive at level 20.

**Systems** (**shipped at M3**):
- `sim/attributes.js`, used by `statsFor`. Class growth is the class table minus what the
  recommended build adds, so the recommended build reproduces the table exactly (tested at
  every level to 19; the passives add on top from 20).
- `sim/skills.js`: abilities, ranks, stances; `battle.js` casts them.
- Commands (`sim/heroes.js`): `spendPoint`, `setAutoAttrs`, `respec`, `rankSkill`,
  `setAutocast`, `setPriority`, `setStance`.
- Save fields per member: `attrs`, `autoAttrs`, `skills`, `off`, `prio`, `stance`, `respecs`.
  Unspent attribute and skill points are derived from level, never stored.
- The Stats and Skills tabs are in `ui/sheet.js` (template strings, like the Gear tab); the
  new M3 windows (title, creation, Party screen) are Preact.

**Exit test:**
- Spending and respeccing work, and the numbers match between the sim and the window.
- The balance harness holds (20–30 % HP per wave at level) with the recommended builds.
- Stance changes battle behaviour, measurably.

### 2.5 NPCs: behaviour, random quests and world history

**Kinds of NPC:**

| Kind | Examples | Behaviour | Talk |
|---|---|---|---|
| **Named** | Maudry Fenn, Warden-Captain Hale, Sister Ilse, the smiths (Hale & Daughter), the region keepers | A day schedule; they stay findable (service buildings) | Ink knots per quest state; remember what you did |
| **Quest givers** | Named NPCs and some townsfolk (marked "!") | A schedule, and they wait near their post | Offer 0–1 side quests from templates |
| **Townsfolk** | Farmers, guards, pilgrims, eel-fishers | Wander, work stations, square at dusk, home at night | **Barks** (short lines) and **rumours** |
| **Travellers** | Merchants, pilgrims, Pellam's Watch patrols | Walk the roads between nodes | A bark, sometimes a trade or rumour |
| **Captives / found companions** | Brannoc, Wren | Chained in a site until rescued | A personal quest chain |

**Built so far:** Maudry Fenn stands outside the Tired Mule (`src/sim/npcs.js`), turns to you as
you come near and fidgets now and then (renderer-side); tap her to talk. Schedules, townsfolk and
barks are still to come.

**Behaviour AI** (`sim/npc/`, deterministic):
- A schedule by time of day (dawn / day / dusk / night) picks the goal: home, work station,
  square or tavern.
- Movement reuses the party's velocity steering and A* paths.
- **Reactions:**
  - turn to face the hero within 3 tiles;
  - greet once per visit;
  - flee from a battle room;
  - guards step toward fights in towns (later).
- The in-game clock advances with play and travel. It is sim time, so it stays
  deterministic.

**Random quests from NPCs:** assembled from the GDD §9 templates, deterministically:
- **Inputs:** seed, region, in-game day, guild rank and act.
- **Hooks:** pre-written pools per template × region × act. The giver's role and the targets
  come from the world doc tables.
- **Limits:** each giver offers at most one at a time, refreshed each in-game dawn.

**World history through NPCs:**
- **Memory lines:** pools per region of townsfolk remarks about the past. Vale farmers
  mention the Third Legion that "still holds the Wickham road"; fen-folk mention the bells
  under the Abbey.
- **Rumours:** each rumour line points at a place, lore fragment or quest. Hearing it
  **reveals the site on the map**, which is a discovery hook.
- **Reactions to lore:** named NPCs react to fragments you've found, through Ink variables
  bound from the Chronicle. For example: *"You read the ledger? Then you know what furnace
  nine burned."*

**Art:** townsfolk reuse the KayKit adventurer models with recolours (the lab already
supports `recolor`). v1 needs 6 townsfolk looks and 4 named-NPC looks, with walk, idle and
talk clips only.

**Exit test:**
- Thornwick has 8+ NPCs keeping schedules.
- Every named NPC has state-aware dialogue.
- Rumours reveal map sites.
- A replay with the same seed produces the same NPC positions and quests.

### 2.6 The Hero component: quests, lore and discovery, with a player log

Full spec: [quest-lore-system.md](./quest-lore-system.md). In summary:

- **Hero quests:**
  - **Chapter quests:** the main arc, four acts, gated by renown (GDD §9).
  - **Companion quests:** personal chains for Brannoc, Wren, and more later.
  - **Class quests:** a trial at levels 6, 12 and 20 unlocks the next ability or the passive.
- **Side quests**, small and repeatable-ish:
  - **Board quests:** the Lantern Guild board in the tavern.
  - **NPC quests:** from quest givers (§2.5).
  - **Bounties:** named elites.
- **Discovery:**
  - **Places:** sites, landmarks, hidden paths.
  - **Lore fragments:** about 45 in total, about 10 per region. They are placed
    deterministically and collected into the **Chronicle** (world doc §7).
  - **First visits:** they give XP and sometimes reveal rumours.
- **Gating:** every quest and discovery declares gates on region, town, level window,
  renown, act, class, origin and flags. The board only shows what fits.
- **Player log (the Journal):**
  - **Tabs:** Active / Available / Completed / Chronicle / Discoveries.
  - **Entries:** objectives with progress, the giver, rewards, and region and level.
  - **Track:** one active quest is tracked. It pins to the **compass** as a destination (the
    compass already supports this) and shows a map marker.
  - **Feedback:** a toast for every update.
- **Rewards:** gold, XP, renown, items (Fine guaranteed on chapters), ability unlocks,
  companions, and map reveals.

**Exit test:**
- Act I's quests are completable end to end.
- The log reflects every state.
- The tracked quest drives the compass.
- The Chronicle collects the Vale set, and completing it reveals the hidden site.

### 2.7 Loot: rare, class-specific

v1 ships **generous** rates so the loop is felt early (`gear-and-loot-plan.md`). The target
is the GDD's **"rare but valuable"**:

| Step | Change |
|---|---|
| **M5 tune** | Measure drops per hour with the headless farm at levels 3 / 6 / 9, then cut toward these targets per hour of active play: about 3 Common, about 1 Fine, about 1 Rare per 5 h. Heirlooms come only from bosses and hidden sites. |
| **Class-specific** | Every item except trinkets has a class (shipped). Drops lean 80 % to party classes, 100 % for Rare and above. Off-class items salvage into Embers. |
| **Bad-luck protection** | +3 % per boss kill without a Rare (GDD §8), and +1 % per 10 waves without a Fine |
| **Special sources** | Rifts: *Kindled* affixes (§2.8). Region bosses: heirloom tables (§2.9). Hidden sites: a guaranteed heirloom. Chapters: a guaranteed Fine. |
| **Visible gear** | A weapon layer: bake bodies without weapons, bake weapon families as small atlases, and composite at the baked hand anchor (the anchors already exist from the weapon effects work) |
| **Smith** | Upgrades +1…+5, salvage and affix reroll (GDD §8, §10) |

**Exit test:** a 10-hour headless farm meets the targets within ±25 %, and a player survey
finds drops feel like events.

### 2.8 Special dungeons: Ember Rifts (timed, special loot)

**Lore** (world doc §10, new): when the Cult stokes the old forges, echoes of the Ember flare
in sealed imperial vaults. For a few days a **Rift** opens, burning with the old light, then
gutters out. The Ashbound inside are stronger and the vault's hoard is *kindled*.

**Mechanics:**
- **Opening:** one **weekly Rift per region**. Its layout comes from a seed of (week number,
  region), so everyone gets the same Rift (fair leaderboards).
- **Entry:** it needs region level or higher, plus an **Ember Spark**. Sparks come from
  quests and bosses, with at most 3 runs a day, which keeps it special.
- **The run:** 3 floors with fixed wave counts (not endless) and a **Rift Keeper** boss.
  - **Flame timer:** 12 minutes in sim ticks. Clear before it gutters.
  - **Medals:** gold, silver or bronze by time. A run that times out ejects the party with
    partial rewards.
- **Rift modifiers:** 1–2 per week, from a table. Examples: *Kindled Dead* (Ashbound +20 %
  ATK) and *Ashen Air* (regen −50 %).

**Loot:**
- **Kindled items:** Fine or better, plus one Kindled affix from a Rift-only pool. For
  example: *+15 % damage vs Ashbound*, *abilities cost 2 less MP above 50 % HP*, *heal 3 %
  on kill*.
- Bonus Embers.
- Cosmetic **ember-trail weapon effect styles** (reusing the `fx.js` styles).

**Leaderboard:** the fastest validated clear per week and region. It needs the determinism
audit (architecture §7).

**Systems:** `sim/rift.js`, `content/rifts.json` (modifiers, affix pool), a rift entrance
node on each region's overland, and a leaderboard window.

**Exit test:** weekly Rifts rotate, the timer and medals work, Kindled loot drops only
there, and a submitted run is replay-validated.

### 2.9 Region bosses (special loot)

**Two tiers:**

| Tier | What | When |
|---|---|---|
| **Story bosses** (world doc §8) | Redhand Captain (Vale), the Abbess Below (Fens), Oruth the Forgemaster (Reach), the Glass Legate (Heights, new), the Kindler (Throne). Each has one signature mechanic (GDD §7: ×8 HP). | Once per act, replayable at the site |
| **Region bosses** (world doc §10, new) | Optional, repeatable, a **weekly lockout** per hero. Each is drawn from a lore fragment. | After the act's story boss |

**Region bosses:**

| Region | Boss | History source | Mechanic |
|---|---|---|---|
| Hollow Vale | **The Standard of the Third Legion**: an Ashbound legion still holding the Wickham road | Standing order 14 (world doc §7) | Ranks rally round the standard-bearer; kill the bearer to break them |
| Greywater Fens | **The Drowned Choir**: the Abbey's sisters, singing under the water | The Drowned Abbey (world doc §3.2) | Their song heals the Ashbound; focus the cantor to silence it |
| Cinder Reach | **Furnace Nine**: a furnace that learned to feed itself | *"Furnace nine requires eleven more souls per week"* | Vents lava zones; consumes fallen units to grow |
| Pale Heights | **The First Pilgrim**: the pilgrim who found the Ember, bound in ice at the crater's lip | The Kindling (world doc §2) | Frost rings and soul-cracks split the arena |

**Loot:**
- a **heirloom table** per boss: named items with a line of history, per the naming guide;
- a guaranteed Rare on the first kill each week;
- a **trophy** entry in the Chronicle;
- renown.

**Multiplayer later:** a *Heroic* raid version for 4–6 players (§2.12).

**Systems:** `content/bosses/*.json` (stats, phases, mechanic id, loot table) and
`sim/boss/*.js`, with one mechanic module per boss. Each boss gets a boss-intro cutscene.

**Exit test:** each Vale boss is beatable at region level with a party of three, the
mechanic is readable on a phone, and the lockout and loot tables work.

### 2.10 Death and resurrection

**States:**

```
Healthy → Downed (0 HP in battle) → Fallen (dead) → Resurrected
          ↑ rises in the lull at 20 % HP if the wave is cleared (shipped)
```

**Downed becomes Fallen when either:**
- the member is downed a **second time in the same room visit**; or
- the party **leaves the room** while the member is still Downed.

**While Fallen:**
- the member follows as a **ghost** (translucent, grey);
- can't fight and earns no XP;
- the party card shows **FALLEN**.

**Resurrection:**
- the **Temple** service in any town: 25 gold × level. It's free once a day while the hero
  is level 5 or lower (new-player grace);
- a **Shrine** in a site: one use per shrine, raises one Fallen member at 50 % HP;
- (the **Cleric**'s *Lifeline*, level 20, instead keeps one ally a room visit from going down);
- a rare consumable, the **Phoenix Ember**.

**The hero is never Fallen while a companion stands:**
- the hero stays Downed, and the companions fight on (shipped);
- if they clear the wave, the hero rises.

**All down, a wipe** (GDD §3.6, amended):
- The party wakes at the **Temple** of the region's town.
- Everyone is restored to 30 % HP, and Fallen status is cleared: the temple's grace.
- You lose 25 % of carried gold (shipped).
- Everyone is **Weakened** (−10 % stats) until they rest at the inn or 10 minutes pass.

**Hardcore mode** (opt-in at creation, later): a Fallen hero is permanent, and companions
are lost unless raised before leaving the site.

**Systems:**
- `member.state` (`ok` / `downed` / `fallen`) and `member.downsThisRoom`;
- the temple menu's Resurrect list;
- party card states;
- ghost rendering: the actor stamp with desaturation and a steady emissive rim;
- save migration.

**Exit test:** every transition is covered by smoke tests. Balance: a same-level room
never produces a Fallen member in the smoke seeds.

**Shipped at M3** (`sim/battle.js`, `sim/heroes.js`, `ui/townmenu.js`), with three amendments
the balance harness asked for (`tools/balance/roomlv.mjs`):
- **"Twice in one room visit" means twice in waves back to back.** A room holds for as long
  as you stay, and before M3 a mage went down 5–10 times in a 5-minute stay (the lull hid
  it). Standing through one cleared wave forgets the earlier down.
- **The lull waits for everyone.** The next wave comes when the party is at 50 % *and*
  everyone standing is at 60 % (or 15 s pass), so nobody walks into a wave nearly dead.
- **Formation** (GDD §3.5): foes count the back line as further away (rogue +1 tile, mage
  +2.5), so the front line takes the blows.

Measured (300 s, seeds 20260807 / 777 / 4242, levels 3 / 6 / 9, recommended builds):
solo 26.4 % → 26.7 % HP per wave (L3 and L9 identical); party 24.0 % → 21.7 %; companion
downs per stay from about 5–10 to 0–2; 45 same-level 100 s visits: no Fallen, no defeats;
36 five-minute stays: 1 Fallen, no defeats. Solo +3 rooms still defeat you; parties now
hold 5 of 9 +3 rooms at about 40 % HP per wave (before, they wiped in the first wave) —
an open tuning item for M4.

**Fix (2026-09-29): the hero autobattled at 2 tiles/s.** Its autobattle step ran on a fresh
probe each tick, restarting the stride ramp, so the fighter crawled while companions moved at
full speed. With the hero at its real 6.8 tiles/s, parties got stronger (17 % HP per wave), so
full-party foes gained +25 % HP (not ATK: harder hits became burst downs and Fallen mages) and
the mage now keeps its whole 3.2-tile distance. Also fixed: companions teleporting back to
the hero mid-fight (the >14-tile catch-up is now out of battle only); personal-space shoves of
~1.2 tiles in one tick (capped at 0.3 per tick); a fighter guarding a Downed hero stood idle.
After: solo 25.4 % per wave, party 22.2 %; 45 visits and 18 five-minute stays with no Fallen;
solo +3 rooms: 11 of 12 defeats (the one hold ends at 4 % HP after a level-up mid-run).

A Fallen member is a ghost: the actor stamp with an ordered-dither see-through, a cold grey
and a steady pale rim (`render/renderer.js`, look `ghost`). Weakened lasts 10 minutes of
play; an in-game day (the temple's free raise) is 24 minutes (`DAY_S`).

### 2.11 Drawing on world history

Every system pulls from [emberfall-world.md](./emberfall-world.md), and **canon changes
land there first**:

| System | History hook |
|---|---|
| Intro and cutscenes | §2 History at a glance; §6 act beats |
| Quests | Hooks and givers from the act and region tables (GDD §9); chapter quests follow §6 |
| NPCs | Memory lines and rumours per region; named characters from §5; factions from §4 |
| Lore | The Chronicle of the Fall, about 45 fragments (§7); set completion reveals hidden sites |
| Loot | Heirloom names and history lines (§9 naming guide); Kindled affixes (Rift lore) |
| Bosses | Story bosses (§8); region bosses drawn from fragments (§10) |
| Places | Town, site and landmark names (§3); overland nodes |
| Enemies | Bestiary families per region (§8) |
| Origins | Faction ties (§4) |

A content checklist sits in [quest-lore-system.md §9](./quest-lore-system.md).

### 2.12 Future multiplayer

Everything builds on the same deterministic sim (architecture §6–§8.8). Phases, in order:

| Phase | Features | Tech |
|---|---|---|
| **A: Async** | Weekly Rift and Undervault leaderboards. **Hire a friend's hero:** a snapshot appears in other players' taverns and earns its owner gold. **Async Arena:** your party vs a snapshot party in a validated autobattle, with a rating. | Supabase tables; replay validator; `detmath` |
| **B: Shared instances** | **Town presence:** see other heroes in the square, with emotes (about 20 visible, interest-managed). **Co-op sites:** 2–3 players, each bringing their hero (plus up to one companion each); shared rooms, personal loot. | Colyseus rooms running `/sim`; clients send commands and interpolate state deltas |
| **C: Group raids** | 4–6 players against *Heroic* region bosses with positioning mechanics; weekly lockout; personal loot rolls | Colyseus raid room; boss modules shared with single player |
| **D: PvP** | **Live Arena** (1v1 and 3v3 party autobattles, with steering, focus and stance as the skill), seasons, and a Glicko-2 rating. An optional normalized-gear bracket keeps it fair. | Colyseus arena room; matchmaking service |

**Design guardrails:**
- PvP and raid gear never invalidates single-player progression.
- There's no player trading at first, to protect the "loot is found" pillar and prevent
  real-money trading.
- The server is always authoritative; clients send intents only.

---

### 2.13 Fair play: no client-side cheating of levels or gear

**The principle:** the client is never trusted. Anyone can edit memory, a save file or the
clock on their own device, and no amount of obfuscation stops that. So the game never
*believes* the client. It **re-simulates** the client.

**How verified progression works.** Levels, XP, gold and gear exist only as the result of
running the deterministic sim:
1. **Session start:** a session starts from the hero's last **verified** state. The server
   issues a session token with a timestamp.
2. **Recording:** the client records every command the player gives, keyed by sim tick. That
   is a few KB per hour.
3. **Upload:** at checkpoints (autosave, returning to town, going online after offline play)
   the client uploads the *claim*: start state, command log, tick count, and the end-state
   hash.
4. **Replay:** the server replays the claim in Node with the same sim (`sim/replay.js`) and
   produces the authoritative end state: every level, XP point, coin and item roll.
5. **Store:** only that state is stored, as the hero's verified save. The client's copy is a
   cache.

**What gets rejected:**

| Cheat | Why it fails |
|---|---|
| Editing level, XP, gold or stats in memory | The replay's end state doesn't match the claim |
| Spawning or editing items | Items only exist if the replayed sim rolled them. Their rolls come from the seeded loot stream and the drop counter. |
| Editing the local save | The session's start state isn't the hero's verified state |
| Speeding up the clock ("level up faster") | The claimed ticks exceed the wall-clock time since the session token, with 5 % slack |
| Forged commands (equipping an item you don't own, hiring outside a town, looting out of reach) | The sim validates every command and ignores invalid ones, so they change nothing |
| Re-rolling loot by reloading | Drops come from the world seed plus a saved drop counter, so reloading gives the same item |
| Offline idle ("expeditions") | Computed by the server's replay, not the client |

**Trust tiers:**
- **Guest / offline play** is fully playable, but its progress is *unverified*. You can only
  cheat yourself.
- **To enter anything shared** (leaderboards, Rift rankings, hire-a-friend, co-op, raids,
  PvP), the hero must be **verified**: signed in, with sessions replayed.
- **After offline play,** the sessions verify on the next connection.
- **A failed session** is rejected, and the hero rolls back to its last verified state. The
  client shows *"This session couldn't be verified"*. A repeat offender's hero is flagged
  unverified.
- **Multiplayer** is server-authoritative anyway: clients send only commands.

**Shipped now (in code, with tests):**
- `detmath.js` makes the sim bit-identical on V8 and JavaScriptCore:
  - `sin`, `cos`, `atan2`, `exp` and `hypot` from basic arithmetic;
  - an integer XP table;
  - no `**`.
- `replay.js`: `startSession` (recording), `stateHash` (canonical 64-bit hash) and
  `verifySession` (the start-state check, log ordering, the wall-clock limit, and replay
  with a hash compare).
- `smoke-test.mjs` replays a real 2.5-minute battle session exactly, and rejects:
  - edited level and XP;
  - a forged item;
  - edited gold;
  - an edited save;
  - a 10× sped-up clock.
- Dev hooks (`?dev`: the live sim on the page, slow motion, manual clock) work only on
  localhost, so a deployed build has no cheat console.
- **Fixed on the way:** saving mid-battle silently failed, because runtime links made the
  snapshot circular. The snapshot now keeps only a member's durable fields.

**Still to build (M6):**
- `net/session.js`: upload with checkpoints and resume after offline play.
- The validator worker (Node or edge function) that stores the verified save.
- Session tokens.
- A rollback UX.
- Rate limits: sessions per hour and log size.
- Server-side expeditions.

A CI job replays recorded sessions in Chromium and WebKit (via Playwright) and in Node, to
prove cross-engine hashes stay identical.

## 3. Milestones

These re-baseline GDD §15. M1 is done; M2 is partly done.

| # | Milestone | Scope | Exit test |
|---|---|---|---|
| **M2** ✓ part | Party and town | Done: town hub, tavern hires, loot v1, compass, effects. Moved to later milestones: the quest board (M4) and the smith and shop menus (M3/M7). | — |
| **M2.5** ✓ | **Foundations** (done 2026-09-28) | Shipped: **renamed to Emberfall**; **three game slots** in IndexedDB (save v3 → v4, the old save becomes slot 1) with the Game slots window, the first Preact + htm window; JSDoc types with `tsc`; ESLint, which enforces the sim determinism rules; `node:test` (12 tests); `content/` with JSON Schema and Ajv (origins); browser tests (replay parity Chromium/WebKit vs Node; the slots flow); GitHub Actions CI; legacy renderers deleted. | Met: every check green locally; CI runs the same, plus WebKit. |
| **M3** ✓ | **Heroes** (done 2026-09-29) | Shipped: the Title / pause menu; character creation (class, look, origin, name; `content/creation.json`); the Party screen (main + two companions, bench of 6, swap / dismiss / release in towns, bench earns 50 % XP); attributes (3 points a level, Auto, temple respec); the Stats and Skills tabs (ranks 1–5, auto-cast, priority, stance); 6 new abilities and 3 passives; Downed → Fallen → ghost, temple and shrine resurrection, the wipe → temple → Weakened, inn rest; save v5. Deviations: abilities unlock by level until class trials (M4); accent palettes wait for the recolour mask; hiring stays free until the M7 economy. | Met: create → play → Fallen → temple → resurrect → wipe → temple → inn → reload passes in Chromium (`npm run test:browser`); 34 unit tests; smoke gates 18 same-level party visits with no Fallen; balance within 20–30 % per wave (details in §2.10). Open: parties now survive some +3 rooms (5 of 9 runs, about 40 % HP per wave). |
| **M4** ◐ | **Story engine** | *Slice 1 done (2026-09-29): Maudry Fenn at the Tired Mule — inkjs vendored (A13), `tools/content/ink.mjs`, `content/npcs/` + `content/dialogue/maudry.ink`, tap to talk (`sim/npcs.js`), the dialogue window, story flags (save v6); see quest-lore-system §6.* inkjs adapter and dialogue window; the NPC system (named, townsfolk, schedules); quest engine, journal and compass tracking; the side-quest generator; discovery and Chronicle v1; the cutscene player and the intro | The Thornwick slice: 3 named NPCs, 6 townsfolk, 5 side-quest templates live, and 3 fragments |
| **M5** | **The Hollow Vale** (content-complete region 1) | Overland sites (Old Barrows, Wickham Keep, Sunken Chapel, Tithe Mill); Act I chapter quests; Brannoc's companion chain; the class trials at level 6; the Redhand Captain and the Standard of the Third Legion; the Vale Chronicle set and its hidden site; loot tuned to "rare"; balance for levels 1–8 | Levels 1–8 playable start to finish in about 6–8 hours |
| **M6** | **Accounts and ship** | Supabase guest → linked accounts; **verified progression** (session upload, server replay validator, rollback; §2.13); cloud saves; Vite packaging; PWA; Capacitor iOS and Android builds; Sentry; a settings screen; store assets and privacy policy | TestFlight and Play internal track. Airplane-mode play works. |
| **M7** | **Endgame loops** | Ember Rifts and leaderboards (reusing the M6 validator); expeditions (idle, GDD §12); bad-luck protection; smith upgrades, salvage and reroll; Heirlooms | A day of play plus idle feels rewarding. Leaderboard entries are validated. |
| **M8** | **Fens and Reach** | Acts II–III; Cult, beast and fen-ghoul art; Delve, Escort and Investigate templates; Wren's chain; the Healer unlock | Levels 8–22 |
| **M9** | **Heights and Throne** | Act IV; the finale; the Undervaults post-game; the Healer | Campaign complete |
| **M10** | **Multiplayer A (async)** | Hire-a-friend, async arena, leaderboards | 1,000 simulated snapshots validated |
| **M11** | **Multiplayer B (shared instances, co-op)** | Colyseus town presence and co-op sites | A 3-player co-op site at 20 Hz on mobile networks |
| **M12** | **Multiplayer C/D (raids, PvP)** | Heroic raids, live arena, seasons | A raid clear; a PvP season ladder |

**Ordering rationale:**
- Foundations come first, because every later feature adds content shapes and windows.
- Heroes come before Story, because origins, class and levels gate the quests.
- A content-complete Vale comes before accounts and store builds, so there is a real game to
  ship.
- Endgame loops come before new regions, to keep level-capped players engaged.
- Multiplayer comes last, once the sim is audited.

---

## 4. Content budget (what writers and artists owe)

| Content | M4 | M5 | M8 | M9 |
|---|---|---|---|---|
| Ink dialogue (named NPCs) | 3 | 10 | +10 | +8 |
| Side-quest templates × hook pools | 5 × 12 lines | 7 × 30 | +3 templates | — |
| Barks and rumours (per region) | 60 | 150 | +300 | +150 |
| Lore fragments | 3 | 10 (Vale set) | +20 | +12 |
| Cutscenes | intro + arrival | +6 | +8 | +8 |
| Townsfolk and NPC looks (baked) | 6 + 4 | +4 | +8 | +6 |
| Bosses | — | 2 | 4 | 3 |

---

## 5. Risks and mitigations

| Risk | Mitigation |
|---|---|
| **Content volume** (dialogue, fragments, barks) outpaces engineering | Template-driven side quests; pools shared across regions with region overrides; a writers' Ink style guide; CI catches broken ids |
| **Art** for townsfolk, beasts and bosses | Reuse KayKit with recolours and props first; commission or bake new models only for bosses; the weapon layer avoids re-baking every loadout |
| **Cross-engine determinism** for verified progression and leaderboards | Done: `detmath.js` replaces every engine-dependent call in the sim. CI replays recorded sessions on Chromium, WebKit and Node (M6). Server-authoritative multiplayer doesn't depend on it. |
| **Low-end phone performance** | Budgets in architecture §9; a 30 fps saver; per-region lazy atlases; Playwright perf traces in CI |
| **Store policy** (Apple sign-in, account deletion, privacy labels) | Designed in at M6 (§2.2) |
| **Save migrations** across many milestones | `SAVE_VERSION` bumps with tests per step; saves hold ids, not text |
| **Multiplayer ops cost** | Async first (Supabase only); Colyseus rooms only for M11+; interest management; autoscale on Railway or Fly |

---

## 6. Decisions this plan makes (GDD open questions)

| GDD open question | Decision |
|---|---|
| **6. Rename timing** | At M2.5. |
| **2. Defeat cost** | Now includes Fallen and resurrection, plus the Weakened debuff after a wipe (§2.10). |
| **3. Quest refresh** | At in-game dawn. Real-time refresh is a daily bonus, stamped into the command for replay. |
| **4. Hardcore** | An opt-in at creation, post-M6. |

Still open: the rally button (open question 1), monetization (open question 5), and
room-level pacing (open question 7, tune at M5).
