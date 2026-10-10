# Quest progression: a critique (after one dungeon a level)

**For review (2026-10-10).** The owner: *"critique the quest progression.. does the story make sense and is it
compelling and clear?"* This reads the main story, the errands, the companions' chains and the trials as the game
has them after [one dungeon a level](./dungeons-per-map-proposal.md) (v1.48), against the
[world doc's arc](./emberfall-world.md) (§6). It changes nothing. The fixes are proposed at the end.

## The short answer

- **Makes sense:** mostly. The question ladder works: who's burning the wagons, who pays the bandits to dig, who are
  the robed strangers, where does the shard come from, who buys what the Cult takes. Each chapter answers the last
  question and asks the next.
- **Compelling:** in its voice, yes. The givers are people (Maudry's prices, Osric's own purse, Dace's book, Pim
  pricing his oil). The Kindler is the best scene in the game. But the setting's own hook, *the dead are standing up*,
  never gets a chapter, and Act I stops one beat short of its finale.
- **Clear:** journals say which dungeon, which floor and which hall, which is good. But four quests still describe
  the map before v1.48, and the level-12 trials send a level-12 company into rooms two to four levels up without a
  word.
- **One real bug:** every chapter after the first pays about half the XP it was designed to (below, 1).

## The spine as it stands

What the main story asks of you, level by level (chapters ★, in the band that holds that level):

| Level | Dungeon (band) | Main story | Beside it |
|---|---|---|---|
| 1 | Barrows (1–3) | ★ *Smoke over the Vale* (Maudry): 4 waves at the Barrow Mouth | *The Long Way Round*, *The First Page* |
| 2–3 | Barrows | (waiting for 4) | *The Captain's Ledger*; the Quartermaster at 3, **no quest** |
| 4–6 | Keep (4–6) | ★ *The Diggers* (Osric): down to the Old Cellars, Garrow at 6 | *Hens Under the Hill* (Skarn at 4); Brannoc's chain from 6; five trials at 6 |
| 7–8 | Chapel (7–9) | ★ *An Ember in the Fist* (Osric): the Stranger at 8. **"Act I is done."** | |
| 8–10 | Chapel | **nothing**: "Next: Fog on the Canal, once your hero reaches level 10" (about 2 hours of play) | the Standard at 9, **no quest**; the Ninth Milestone (Chronicle) |
| 10–12 | Mound (10–12) | ★ *Fog on the Canal* (Ilse → Dace): the Toadking at 12, Wren | Col's *Old Water* (12) |
| 13–14 | Locks (13–15) | ★ *The Locks* (Dace): the Kindler, the Sluice | Wren's *Marker* |
| 15 | Locks, Vat Seven | ★ *The Sickpools* (Pim): three cages | the Vatwarden at 15, **no quest**; Wren's *Night Boats* |
| 16 | Abbey (16–18) | ★ *The Bells* (Orla): Teague | Wren's *Settled* |
| 17 | Abbey | ★ *The Rolls* (Orla → Agnes): down to floor 3 (18), two chests | the Choir at 17, **no quest** (it's in the way) |
| 18 | Abbey | ★ *The Last Office* (Agnes → Ilse): the Abbess. **"Act II is done."** | the Undercroft (secret) |

## What works

- **The mystery ladder.** Smoke → bandits → somebody pays them to dig → robed strangers → a shard made in the Fens →
  the Cult's boats → a preacher who won't give his name → the vats → the rolls → *they were mining the dead, for the
  Kell Assay*. It's paced so each answer is small and concrete (a ledger, a seal, a foundry mark, a berth-book), as
  the world doc asks: history found, not told.
- **The voices.** Wry and specific, never silly. "The carters complain about something else now." "He wrote 'no
  name' next to it, then underlined that." The new keepers keep it up.
- **Givers rotate and hand you on.** Maudry hands you to Osric, Osric to Ilse, Ilse to Dace, then Pim, Orla and
  Agnes, and back to Ilse at the end. You meet a town through its jobs.
- **Companions have their own chains**, with heirlooms that mean something (Brannoc's chain less one link, Wren's
  ring).
- **Act II's six chapters** follow the dungeons almost exactly, one or two a band, and *The Locks* is the best
  chapter in the game: a quiet, courteous antagonist who isn't fought.

## What doesn't, most important first

### 1. Chapters pay about half their XP (a bug)

A quest pays a share of a level *at the level it's written for* (`rewards.lv`, GDD §9 v1.39). Those levels weren't
moved when the dungeons were re-banded (Act II went up three levels), and some were already low. Each chapter's
reward, done at the level its dungeon asks for, against the same share at that level:

| Quest | Done at | Pays as if | Share it pays |
|---|---|---|---|
| *The Diggers* | 6 | 4 | 49 % |
| *An Ember in the Fist* | 8 | 6 | 55 % |
| *Fog on the Canal* | 12 | 9 | 56 % |
| *The Locks* | 14 | 11 | 50 % |
| *The Sickpools* | 15 | 12 | 51 % |
| *The Bells* | 16 | 13 | 51 % |
| *The Rolls* | 18 | 14 | 42 % |
| *The Last Office* | 18 | 15 | 53 % |
| Wren's three | 13 / 15 / 16 | 10 / 11 / 12 | 52 / 40 / 41 % |
| Brannoc's *Old Debts* | 6 | 4 | 49 % |

A chapter is meant to be about half a level to whoever it's written for; it's a quarter.

### 2. Act I ends one beat early, and leaves a two-hour hole

- **Canon** (world doc §6, v1.32) ends Act I at the Standard of the Third Legion, in the Binding Crypt at 9: *the
  lamp breaks, the road opens, Act I ends.*
- **The game** ends Act I at the Robed Stranger, at 8. The Standard is only a lead in the Journal, and nothing asks
  you to finish him.
- **Then nothing:** Act II waits for level 10. Levels 8 to 10 take about two hours of play (53 and 61 minutes on the
  v1.38 curve), and the main story has nothing to say for all of it.

### 3. The dead are scenery

- **The setting's hook isn't a quest.** The world opens on *"the barrows are opening, the dead are standing up again,
  and nobody important is coming to help."* Every Act I chapter chases the living: bandits, a captain, a robed
  stranger.
- **Nobody says why the dead walk.** Tobin's book, the Long Gallery and the Muster Hall show it. No chapter asks,
  and none answers.
- **Three digs, no answer.** Act I asks *what are they digging for?* three times: at the barrow mouth, under the
  Keep, in the Chapel's cut. It only answers *who's paying*. The chain from the digs to the dead to the Cult's need
  is canon (the Cult binds the dead, and Act II finds it mining them), but Act I never makes it. A player reaching
  the Fens knows a robed man wanted something in a chapel, not what.
- **The answer is unquested.** The Standard is where it would land: the legion was bound under the chapel, and the
  Cult dug down to its binding.

### 4. Three new bosses have no quest

- **The Quartermaster** (3) caps the Barrows. Only Tobin mentions him.
- **The Vatwarden** (15) is *the Cult's overseer at Vat Seven*. *The Sickpools* sends you to Vat Seven to break his
  harvesters' cages and stops there, a room short of the man running it.
- **The Choir** (17) stands between you and *The Rolls*' third floor, and the journal doesn't mention her. (Bosses
  don't lock the stairs, so you can slip past, but nothing tells you either way.)

A boss with no quest is a boss most players meet by accident, or don't.

### 5. The level-12 trials send a level-12 company into rooms two to four levels up

They're offered at 12, but most are set where v1.48 moved the Fens:

| Trial | Where | Room level | Up from 12 |
|---|---|---|---|
| *The Old Water* (shaman) | the Mound, floor 2+ | 11–12 | fine |
| *Dead Water* (rogue) | the Locks, any floor | 13+ | 1 |
| *The Long Watch* (fighter) | the Sluice's hall, 10 waves | 14 | 2, and a hall |
| *Lamp Oil* (mage) | Vat Seven | 15 | 3 |
| *Vigil* (cleric) | the Abbey | 16+ | 4 |

The balance contract says a room three levels up defeats even the right party. A cleric's trial at 12 is in
practice a trial at 16, and the Journal doesn't say so.

### 6. Text written for the old map

- *The Long Way Round* says *knock back the dead in the Old Barrows*, and *The Captain's Ledger* pays for *the
  bright-eyed ones, the elite dead*. Both count anywhere in the Barrows. The first floor, where a level-2 player is,
  is now the Redhand's dig: the waves are living bandits, and the "bright-eyed" elites are Redhand brutes.
- *The Bells* says the Abbey is *out past the Sickpools*. The Sickpools aren't a place on the map any more; they're
  Vat Seven, under the Locks.
- *The Rolls* opens at 17 but asks for chests on the Abbey's third floor, which is 18.

### 7. Smaller things

- **Maudry gives two quests in the same place at the same time.** *Smoke over the Vale* (4 waves on the Barrows'
  first floor) and *The Long Way Round* (4 waves and a chest in the Barrows) are done by the same four waves.
- **Brannoc's last errand sends a level-6+ company back to level-2 rooms.** *Standing Down* holds the Long Gallery's
  hall. Its idea, a deserter standing once with a legion that never stood down, fits the Binding Crypt better: the
  bound stand there in rows, under their standard, at 9.
- **Act II's end leaves 18 with nowhere to go.** The Reach opens later. That's expected, but the end card could say
  plainly that the Abbey and the Tower are the grind until then (it nearly does).

## Proposed fixes, smallest first

Each is data and text, with no new systems; together, an afternoon.

1. **Pay chapters at their own level.** Set `rewards.lv` to the level each is done at (the "Done at" column under 1).
2. **Point the Barrows' errands at the dead.**
   - *The Long Way Round* and *The Captain's Ledger* ask for the Long Gallery (`floor: 2`), where the dead are, from
     level 2.
   - *Smoke* stays on the first floor with the bandits.
   - That also separates Maudry's two quests.
3. **Fix the words:**
   - *The Bells*: out past the Locks;
   - *The Rolls*: open at 18, or ask for floor 2's chests at 17.
4. **Give the bosses their quests:**
   - **The Quartermaster:** Tobin's errand at 3, *The Last Chit*. While he issues, the Gallery's dead keep getting
     up; put him down so they stay down.
   - **The Vatwarden:** a second step of *The Sickpools*. The cages, then the man who fills them.
   - **The Choir:** named in *The Rolls*' first step, so the stairs down aren't a surprise.
5. **Finish Act I as canon has it: a fourth chapter, *The Standard* (Ilse, at 9).**
   - She has the shard and has read about the binding.
   - Down to the Binding Crypt: break the Standard, its lamp goes out, the road opens.
   - It answers *what were they digging for*: the bound legion. Act II's *mining the dead* then lands as the second
     half of something the player already half-knows.
   - It fills the 8–10 hole. *Fog on the Canal* follows it (gate 10, after it).
6. **Site the level-12 trials at 12–13:**
   - *The Long Watch*: the Mound's second-floor hall;
   - *Lamp Oil*: the Locks' first floor;
   - *Vigil*: the Mound's third floor, the drowned boat-folk the Toadking left;
   - *Dead Water* and *The Old Water*: as they are.

   (Or offer each at its room's level, but the trials are written as the level-12 tier.)
7. **Move *Standing Down* to the Binding Crypt** (floor 3's waves, not the Standard's hall, which goes quiet once he
   falls). Brannoc's chain then walks forward through the Vale with you, 6 to 9, instead of back to 2.

What I'd keep as it is:
- the givers;
- the voice;
- the Kindler;
- Act II's six beats;
- the small stakes in Act I (rats and bandits first: that's the brief).

## Pointers

- `src/sim/quests.js` `QUESTS`: levels, steps, rewards;
- `content/quests/*.json`: the words;
- `content/story.json`: the Journal's leads;
- `src/ui/storystatus.js`: "Next: … once your hero reaches level N";
- world doc §3.1, §3.2, §6.
