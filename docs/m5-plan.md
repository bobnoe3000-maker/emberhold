# M5 — The Hollow Vale: plan

**2026-09-30 · Plan of record for M5** (development plan §3). The goal: levels 1–8 playable from start
to finish in about 6–8 hours. The canon these slices use is in the world doc (v1.7). Each slice
lands as its own commit, with tests, balance runs where numbers move, and doc updates.

## What M5 adds

| | Before M5 | After M5 |
|---|---|---|
| Sites you can enter | the Old Barrows | + the Tithe Mill, Wickham Keep, the Sunken Chapel, and the hidden Ninth Milestone |
| Enemy families | Ashbound (4 skeletons) | + the Redhand Company (cutthroat, brute, crossbowman); a Cinder Cult acolyte |
| Bosses | none | the Redhand Captain (Wickham Keep), the Robed Stranger (the Sunken Chapel), the Standard of the Third Legion (the Old Barrows, repeatable) |
| Story | errands, bounties, board jobs | Act I, *Smoke over the Vale*: three chapter quests |
| Companions | hired at the tavern | + Brannoc, a found companion, and his chain (3 quests) |
| Abilities | unlock by level | the level-6 ability of each class unlocks through its **class trial** |
| Chronicle | 3 Vale fragments | the full Vale set (10), completing it reveals the hidden site and its heirloom |
| Loot | Common–Rare | + Heirlooms (bosses, the hidden site); drop rates tuned to targets |

## Slices

1. **Sites as data** (`src/sim/sites.js`, `content/sites/`). A site is a name, a look (dungeon
   theme), a level band (base level, levels per floor), how many floors, its enemy family, its
   rooms (how many), and on which floor its boss waits. The overland gets an entrance for each
   site. Some start hidden (`state.revealed`): Wickham Keep until the Tithe Mill is cleared, the
   Ninth Milestone until the Vale set is complete. Save v11: `revealed`, the site you're in.
   The Old Barrows keeps its numbers (base 1, 3 levels a floor, no bottom).

   | Site | Levels | Floors | Family | Boss |
   |---|---|---|---|---|
   | The Tithe Mill | 1–3 | 1 | Redhand | none (its hall holds the foreman's gang) |
   | Wickham Keep | 3–6 | 2 | Redhand (floor 2: + Ashbound) | the Redhand Captain, floor 2 hall |
   | The Sunken Chapel | 5–8 | 2 | Ashbound + Cinder acolytes | the Robed Stranger, floor 2 hall |
   | The Old Barrows | 1–10 | ∞ | Ashbound | the Standard of the Third Legion, floor 3 hall (optional, repeatable) |
   | The Ninth Milestone | 8 | 1 | Ashbound | none; the vault holds the heirloom |

2. **The Redhand Company.** Three archetypes baked from recoloured hero models (swatches, not CSS
   filters): cutthroat (twin knives), brute (great-axe), crossbowman. Their elite is a
   Sergeant. Stats mirror the Ashbound roles so the difficulty contract holds. The renderer maps
   enemy kinds to actor atlases through one table.
3. **Bosses.** A boss hall spawns its boss with an escort and holds no further waves once the
   boss falls. Each boss has one signature mechanic:
   - *Redhand Captain* — **Call to Arms**: at 2/3 and 1/3 HP he calls two Redhand to his side and
     takes half damage until they fall.
   - *The Robed Stranger* — **Kindle**: every 12 s he raises the last foe slain as a fresh
     Ashbound minion.
   - *The Standard of the Third Legion* — **Hold the Line**: Ashbound within 4 tiles of the
     Standard take half damage. Knock the Standard down first (tap to focus).
   A boss's first kill drops its heirloom; later kills roll boss loot (a Fine or better item).
4. **Act I, *Smoke over the Vale*** (chapter quests: no abandon; a quest can be handed in to
   someone other than its giver).
   1. *Smoke over the Vale* — Maudry: drive the Redhand out of the Tithe Mill (hold 4 waves
      there). Hand in to Osric. Reveals Wickham Keep.
   2. *The Diggers* — Osric: go down to the Keep's second floor and put down the Redhand
      Captain. The Captain's men were paid by robed strangers to dig. Hand in to Osric.
   3. *An Ember in the Fist* — Osric: find where the strangers dig, in the Sunken Chapel, and
      put down the Robed Stranger. He dies with an ember-shard in his fist. Hand in to Sister
      Ilse. Act I ends.
5. **Brannoc.** Chained in the Keep's second-floor hall; once the Captain falls, talk to him and
   he joins you (the bench if the party is full). Talk to him from his party card. His chain,
   *Chains of the Redhand*:
   1. *Old Debts* — three Redhand sergeants (elites) in Wickham Keep.
   2. *The Paymaster's Box* — two chests in the Tithe Mill.
   3. *Standing Down* — hold the Old Barrows' second-floor hall for 5 waves. Reward: the
      heirloom trinket *The Broken Chain*.
6. **Class trials at level 6.** A trial is offered when anyone in your company of that class is
   level 6+. Done, it teaches the level-6 ability to every member of that class. The level-12
   abilities stay unlocked by level until the M8 trials.

   | Class | Trial | Giver | Objective |
   |---|---|---|---|
   | Fighter | *Hold the Keep Gate* | Osric Hale | hold 8 waves in Wickham Keep |
   | Rogue | *Quiet Feet* | Nell Tolley | 3 elites in Wickham Keep |
   | Mage | *Cold Weather* | Hedda | hold 6 waves in the Sunken Chapel |
   | Cleric | *Last Rites* | Sister Ilse | hold the Old Barrows' second-floor hall for 5 waves |
7. **The Vale Chronicle, whole.** Seven more fragments (world doc §7): one in the Tithe Mill, two
   in Wickham Keep, three in the Sunken Chapel, one carried by the Standard. The last one
   found reveals the Ninth Milestone; its vault holds the heirloom *The Last Order*.
8. **Loot and balance.** Drop rates measured with the headless farm at levels 3 / 6 / 9 and
   tuned toward the development plan's §2.7 targets. The room-level harness runs each site's
   band. A headless golden path plays Act I start to finish; the browser test walks its first
   chapter.

## Decisions

- **The Old Barrows stay open from the start.** Act I's "the Barrows open" beat happened before
  the game starts (every errand already says "since the barrows opened"). The shard moves to the
  Sunken Chapel (world doc v1.7).
- **Trials are the company's, not the hero's.** A hired cleric learns Bless when your company has
  done *Last Rites*, so companions of every class need their trial too. The difficulty
  contract's party runs assume trials done at level 6 and up, as they assume gear at level.
- **Brannoc is a companion like the hires**, with a fixed look and name and his own
  conversation. He can be benched, not released.
- **Bandits don't surrender yet** (world doc §8 says they can). A later pass.
