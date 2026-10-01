# Dialogue critic pass 1 — clarity, and the words the game uses

**2026-10-01 · Current.** This is a read of every line a player reads in conversation and in the
Journal:
- the five Ink files: Maudry, Osric, Ilse, Brannoc and the townsfolk (877 lines);
- the 13 quests and the 5 board templates;
- the barrows-road lines and the 10 Chronicle notes;
- the HUD and defeat-screen lines about death and the temple.

The test: could a player who put the phone down for a week read any one line, and know **who**
is speaking or asking, **what** is wanted, **where** it is, and **when** it's done? That matters
most where a flow pauses for a long time, between taking a quest and handing it in. The voice must
still follow the world doc §1 tone rules and §11 voice guide. Part 2 audits the game's nouns and
key verbs and recommends wording; those changes are for the owner to decide.

## Part 1 — clarity

### What was wrong

1. **The Journal never said why.** An active card showed the title, the giver's name and the
   current step, but never the quest's `summary`, the only text that says who wants it and why.
   The summary was written and never shown. So a step like *"Put down three of the bright-eyed ones
   in the Old Barrows"* stood alone, with no word of who they are, who pays, or what for.
2. **Steps and hand-ins left out where.**
   - *"Hold six waves in the Sunken Chapel."* didn't say where the chapel is.
   - *"Go back to Hedda in Thornwick."* didn't say where Hedda stands.
   - *"Open two chests in the Tithe Mill."* didn't say where the mill is.

   Each place is given once in conversation, which a player may have read days before.
3. **Hand-in choices assumed you remembered.**
   - Osric's *"Garrow's done collecting."* only makes sense if you remember his own phrase from
     the offer, maybe hours earlier.
   - Ilse's *"He died holding this."*: who did?
   - Brannoc's *"The paymaster's boxes."* and *"We held the hall."*, and Hedda's *"It listened."*,
     don't say which job they finish.
4. **One thing, three words.**
   - **Fight, wave, room.** Maudry asks for "four good fights", the Journal for "Waves held", the
     HUD says WAVE. The Smoke over the Vale label said "Fights won".
   - **Elite.** It is "the bright-eyed ones", "elites", "officers", "the big ones" and "Redhand
     sergeants".
   - **The room with the stairs down.** It is "the hall at the foot of each stair", "a
     stairs-down hall", "the stairhead", "the second floor's hall" and "the hall with the stairs
     down". *"At the foot of each stair"* is wrong as well: the hall is at the top of the way
     down.
5. **"Shrine" named two things.**
   - The dungeon shrines that mend the party once.
   - The **Shrine of the Ember**, Thornwick's temple, where the Fallen are raised.

   Maudry's *"Take them to the Shrine"* and the defeat screen's *"Wake at the Shrine"* both meant
   the temple. The services bar calls the same building *Temple*.
6. **"Fallen" was explained nowhere.** The HUD said *"Brin is Fallen · raise them at a temple or
   shrine"*. Maudry said *"They raise the ones who fell down there"*: fell down what?
7. **"The board" named two things.** Maudry's *"The board by the door says who's looking for
   work"* meant the hiring list. The Lantern Guild's *quest board* also hangs by the door.
8. **Some Chronicle notes could lie.** *"From a shrine on the Sunken Chapel's second floor"* is
   false on a floor drawn without a shrine. There the fragment waits in the stair hall (lore.js;
   true of the Chapel's second floor on 23 of 40 seeds).

### What changed

**The Journal** (`src/ui/journal.js`).
- An active card now reads as a whole:
  - title, then giver and level;
  - the summary in italics, saying who and why;
  - **NOW:** the step, saying what and where;
  - the objectives and the reward.
- A Done card names who it was for.

**Every quest's text** (`content/quests/*.json`).
- **Summary:** names the giver and where they are ("Osric Hale, Warden-Captain of the Watch at
  Thornwick's well").
- **Step:** says what and where ("Hold six waves in the Sunken Chapel, in the marsh south of
  Thornwick").
- **Ready:** says who and where to hand in ("Go back to Hedda, by the well in Thornwick").
- **Done:** says what you did ("You drove the Redhand out of the Tithe Mill. They went to Wickham
  Keep; Osric Hale wrote it down.").
- **Trial summaries** say what you'll learn ("the fighter's level-6 skill").
- **Journal verbs:** *Defeat* and *hold N waves*. Conversation keeps the voice's *put down* and
  *fights*.

**Board jobs** (`content/board/*.json`).
- The journal line carries its count ("hold 4 waves against the dead there, in any rooms").
- Hand-in reads "the Lantern Guild's board, inside the Tired Mule in Thornwick".
- The carters' hook no longer puts the hall "at the foot of each stair".

**Hand-in choices name the job.**

| Before | After |
|---|---|
| The barrows road is clearer. | I knocked the barrows back, like you asked. |
| The mill's clear. | The Redhand are out of the Tithe Mill. |
| Garrow's done collecting. | Captain Garrow is down. I have his ledger. |
| We held the Keep. | We held Wickham Keep, eight waves. |
| Three of the bright-eyed ones. | Three of the bright-eyed ones are down. |
| He died holding this. | The robed stranger in the chapel died holding this. |
| The rites are said. | The rites are said, in the barrows. |
| That's three sergeants. | That's Garrow's three sergeants down. |
| The paymaster's boxes. | We found the paymaster's boxes at the mill. |
| We held the hall. | We stood with the legion. Five waves. |
| It listened. | It listened. Six waves in the chapel. |

**Offers and reminders say the count and the place.**
- Maudry: "Four waves of them, four good fights"; "Four waves held in the Old Barrows, and one of
  their chests opened".
- Osric: "hold eight waves, in any rooms you like"; "the cellars of Wickham Keep".
- Ilse and Brannoc: "the hall by the stairs down, on the second floor or deeper".

**The temple and the Fallen.**
- Maudry and Osric: "the Shrine of the Ember, the temple on the square". Maudry: "the Sisters
  raise the Fallen there, the ones who went down and stayed down".
- The defeat screen: *Wake at the temple*, "You wake at the temple in Thornwick, the Shrine of
  the Ember".
- The HUD: *"Brin is Fallen: out of the fight until raised · at the temple in town, or a shrine
  below"*.

**The hiring list.** Maudry: "The Lantern Guild keeps a list at the bar of who's looking for
work"; her choice is *Show me who's looking.*

**Chronicle notes** for shrine-held fragments say the floor, not the shrine.

**Voice check.** Every changed line keeps to the §11 guide:
- plain words and short sentences;
- the dead as "the walking kind" in conversation;
- no lore dumps and no winks.

The new place-words are ones characters already used ("up the river", "the marsh south of here",
"by the well"). The Journal is the plain narrator, so it says *defeat* and *waves* where people say
*put down* and *fights*.

**Not changed.** Knot names, quest ids and objective counts are API (AGENTS.md: rename only with a
save migration).

## Part 2 — the words the game uses (recommendations)

What each word means in the rules, where a player meets it, and what I'd do. **Decide** marks a
recommendation that changes a game term; those are yours to call. Nothing in this table has been
renamed.

| Word | What it means in the rules | Where a player meets it | Problem | Recommendation |
|---|---|---|---|---|
| **Fallen** | Dead until raised. A companion Downed a second time in a room visit, or left Downed when the party walks out, follows as a ghost: no fighting, no XP. Raised at a temple (gold), a dungeon shrine, or by a wipe. The hero is never Fallen. | Party cards, HUD, temple, inn, dialogue | It means *dead*, and the word alone doesn't say so: "fallen" can mean tripped, or Downed. *Emberfall* makes it thematic. | **Decide.** (a) **Keep "Fallen"** and always define it where it first shows (done in the HUD toast: "out of the fight until raised"); add a one-line tip. (b) **Rename to "Slain"**: unambiguous, still in voice ("Brin is slain · raise them at the temple"). I'd take (a): it's the game's own word, and with Downed beside it, "Fallen" reads as the worse state once defined. |
| **Downed** | 0 HP in a fight; rises in the lull at 20 % if the wave is cleared. | Party cards, combat floats | Clear. | Keep. Pair with Fallen once: *Downed: up again after the wave · Fallen: out until raised*. |
| **Weakened** | 10 minutes of lower stats after a wipe; the inn lifts it. | HUD chip, defeat screen | Clear, but the HUD chip doesn't say for how long. | Keep. Have the chip say "weakened · 7 min". |
| **Wipe / defeat** | Everyone down: wake at the temple, 25 % of carried gold lost. | Defeat screen ("The party has fallen") | "The party has fallen" uses *fallen* for a different state (everyone Downed, nobody necessarily Fallen). | **Decide.** Change the headline to "The party is beaten" or "Defeated", so *fallen* means one thing. |
| **Shrine** (dungeon) vs **Shrine of the Ember** (temple) | Dungeon: mends once. Temple: raises for gold, respec, Chronicle. | World label, HUD, dialogue, defeat screen | Same word, two buildings. | Done here: dialogue and UI say *the temple* for the town building, which keeps its name. **Decide** whether the dungeon one should become an **altar** ("Ember altar"), so "shrine" disappears from the dungeon. I'd keep "shrine": it's on screen, labelled and toasted. |
| **Wave / fight / room** | A wave is one group of foes in a room; a room keeps sending waves until you step out or lose. | HUD (WAVE n), Journal, dialogue | Three words for counts. | Done: the Journal and labels count **waves**; people may say fights. |
| **Hold** (a room, N waves) | Survive N waves in a room. | Journal, board | Fine once learned. | Keep. The board's journal line spells it out ("hold 4 waves … in any rooms"). |
| **Elite / bright-eyed one / sergeant** | The Ashbound elite (bright eyes) and the Redhand elite (sergeant) lead every fifth wave. | Journal, board, dialogue | Several names; "elite" is gamey. | Done: the Journal says "elites (the bright-eyed ones)" and "sergeants (the Redhand's elites)". Keep both family names; they carry the voice. |
| **Stair hall** | A floor's last room, with the stairs down; the floor's guard and its toughest fights. | Journal, board, dialogue | Five names for it. | Done: the Journal and board say **stair hall (the room with the stairs down)**; people say "the hall by the stairs down". |
| **Embers** (✦, HUD) vs **the Ember** (the flame) vs **ember-shard** | ✦ embers: salvage currency. The Ember: the empire's flame. Ember-shard: Act I's find. | HUD, smith, story | A player may think ✦ counts story Embers. | **Decide.** Rename the currency to **cinders**, or label the HUD count "embers (salvage)" when tapped. I'd pick cinders: it keeps the fire theme and frees *Ember* for the story. |
| **The walking kind / the dead / Ashbound / skeletons** | The Ashbound, the empire's bound dead. | Dialogue, foes, board | Fine as voice. "Skeletons" (Bess) is a modern word. | Keep. The Journal says "the dead"; Ashbound is for the bestiary. |
| **Put down** | Kill. | Dialogue | Fine in voice; ambiguous in a task line ("put down three sergeants" could mean set down). | Done: the Journal says *defeat*. |
| **Raise** | Bring a Fallen companion back. | Temple, shrine, HUD | Clear. | Keep. |
| **Bench / lodge** | Companions not in the party, waiting at the Thornwick inn (half XP, half wage). | Party screen, tavern | "Lodge" and "bench" both appear. | Use **bench** everywhere. |
| **Sworn / Owed / Loyalty / Wick-Lamp-Lantern-Beacon** | The Guild's terms. | Tavern, Contract tab | Explained in the Guild's terms card. | Keep. |
| **Dawn** | The start of each in-game day, an hour of play: the wage, the board, the roster. | HUD dial and wage line, tavern | "Every morning" (Maudry) and "dawn" mean the same. | Keep; the dial and the Guild's terms say dawn. |
| **Room level / LV** | A room's foes' level. | Room pill, compass | Clear. | Keep. |
| **Step out** | Walk out of a room's fight. | Button | Clear. | Keep. |

### For the owner
1. **Fallen:** keep and define (recommended), or rename to *Slain*.
2. **The defeat headline:** "The party is beaten" instead of "The party has fallen".
3. **The ✦ currency:** rename to *cinders*, or label it.
4. **Dungeon shrines:** keep the name (recommended), or call them altars.
5. **Weakened:** show the minutes left on the HUD chip.

Each is a small change once decided: the word lives in a handful of UI strings and docs. A rename
of *Fallen* in saves isn't needed (the save stores a boolean).
