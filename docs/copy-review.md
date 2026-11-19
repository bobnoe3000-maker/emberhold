# Emberfall copy review: dialogue, narrative, names and UI text

*2026-11-19 · **Proposal, for the owner's review** (the owner: "I want to take a pass at the dialog, text, narrative and copy. Much of it seems to be written by AI - with odd names and repeating phrases, etc.. suggestions for me to review"). Nothing here has been changed in the game yet. Every count comes from a one-off scan of the repo at commit 8cdd64f (§9 proposes making it a CI check); line numbers are for the files as they stood then.*

**What was read.** 5,564 player-facing strings, about 49,500 words:
- **Ink dialogue:** 958 lines (21,500 words) and 356 choice labels across 18 `.ink` files.
- **Content JSON:** 2,174 strings (quests, lore, board, sites, story, tips, first steps, creation, origins, companions, foes, arena, intro).
- **JavaScript:** 1,967 string literals from `src/sim` and `src/ui`: item names and flavour, skills, toasts, cards and buttons.

Code comments and docs were left out.

---

## Summary: the biggest problems

The writing is mostly competent. There are almost no typos. The lore fragments and heirloom lines are good, and the classic machine-prose words are missing: "tapestry", "testament", "delve", "destiny" and "realm" add up to 1 use in the whole corpus. The "written by AI" feel comes from structure. A small kit of devices, frames and numbers is used by every writer-voice in the game. The eight biggest problems:

1. **Everyone in the game keeps books.**
   - 9 of the ~20 named speakers are first shown writing in, or reading from, a ledger or book.
   - "reads it twice" appears 14 times, across 8 speakers.
   - 22 of 51 quest-complete lines (43%) end on someone writing, reading or counting.
2. **Every NPC turns down "Not yet" with the same line.** 32 of the 53 replies to "Not yet." / "Not now." (60%) are some form of "it'll keep / it's waited / it's not going anywhere", and 9 of them add "three hundred years". In `ashgate.ink`, five different speakers answer "X keeps."
3. **Everyone talks at the same rhythm.**
   - Every NPC averages 5.3–7.9 words a sentence.
   - 29–61% of each NPC's sentences are four words or fewer.
   - At most 3% of anyone's sentences are questions.
   - The charismatic preacher, the archivist, the slow-spoken soldier and the nervous chandler all measure alike.
4. **Some words and numbers are reached for by default.**
   - "nobody" / "somebody" appear 176 times in 32,800 words of narrative, roughly one every 190 words. That is about 10× what novels typically use.
   - "forty" appears 44 times as the stock number: forty years ×6, forty crowns, forty boats, forty hulls, forty hundredweight, forty bound.
   - "three hundred years" appears 23 times.
5. **The item flavour pool is tiny.**
   - Every Fine and Rare drop in all three regions draws its line from 12 strings (`src/sim/items.js:143-148`), so the player is more likely than not to see a repeat by the 5th piece.
   - 4 of the 12 lines mention stitching, leather or metal, but land on any base, including rings and robes.
   - The affix words include non-canon "the Long Dark", "Saint Ilse" and "the Hollow King", and "Tallowmere", which is the name of a real indie game.
6. **The name pools recycle canon names and borrow from other works.**
   - 8 of the 30 hire names belong to named NPCs: Osric, Tamsin, Tobin, Hesk, Maren, Wenna, Thane, Hild.
   - The name suggestions at hero creation offer "Garrow" and "Teague", who are bosses.
   - The Bowl's roster has 7 players called Wren, though the world doc says the Guild stops calling anyone Wren. Sister Orla and Bess Hale fight in the Bowl too.
   - Some names come from other works: Garruk (Magic: The Gathering), Thrain (Tolkien), Coldharbour (Elder Scrolls), Wat Tyler (a real 1381 rebel).
   - Six skill names are World of Warcraft's: Kidney Shot, Fan of Knives, Shadowstep, Frost Nova, Blizzard, Consecrate.
7. **The UI calls one thing by several names.**
   - Losing a fight is "The party is beaten", "The company is beaten", "Your group was beaten" and "Your party is beaten", in 4 files.
   - Out-of-the-fight members are "slain", "Fallen" or "Downed".
   - The place that raises them is "the temple", "the Shrine of the Ember" or "the chapel", while the dungeon's buff stones are also "shrines".
   - Money is "gold" in the UI but "coppers" and "crowns" in dialogue. Nell says a bed is "five coppers a level", but the code charges 5 gold a level.
8. **Some copy is now wrong.**
   - The smith's first-open card still says upgrades stop at +5 and need wood and stone. The game goes to +9 and dropped wood and stone in v1.75.
   - The Journal puts the Drowned Choir on the second floor, but the quest and Orla say the first.
   - A loading tip says every shrine mends.
   - Character creation shows a locked "Healer" class, which the world doc lists as deferred.

**What's fine and should be kept:**
- The 32 Chronicle fragments (`content/lore/*.json`).
- Most heirloom lines ("He collected. Everyone paid.", "Its pair is somewhere above you.").
- Pim, Ned, Hester, the Kindler and Brannoc as voices.
- The quest titles.
- Mechanically, the text is clean: scans for doubled words, stray spaces, "then/than", "its/it's" and unbalanced quotes found nothing.

---

## 1. Repetition

### 1.1 Repeated whole sentences

There are 61 sentences of 5+ words that appear in two or more places. Most are harmless:
- Ilse reading a fragment aloud repeats the fragment, by design.
- The Guild board's "Hand it in at the Lantern Guild's board, inside …" appears ×15, as a template.

These are the ones worth fixing:

| Count | Sentence | Where |
|---|---|---|
| 3 | "Once its vault is opened it seals itself for a while; then it can be walked again." | `content/sites/ninth_milestone.json:8`, `ninth_vault.json:8`, `reedholm_undercroft.json:8` (a rules sentence pasted into three place descriptions) |
| 3 | "Six turns of the fighting." | `ashgate.ink:152, 180, 406` |
| 2 | "We should go back for {fallen_name}." | `brannoc.ink:68`, `wren.ink:78` |
| 2 | "They've waited three hundred years." | `agnes.ink:64`, `ilse.ink:134` |
| 2 | "It's kept three hundred years." | `ashgate.ink:411`, `ilse.ink:384` |
| 2 | "You'll smell it before you see it." | `ilse.ink:381`, `maudry.ink:186` |
| 2 | "Take {them} to the Shrine of the Ember, the temple on the square" | `maudry.ink:64`, `osric.ink:62` |
| 2 | "The Seam closed on a Friday." | `ashgate.ink:104`, `tamsin.ink:108` |
| 2 | "You came in short." | `dace.ink:53`, `dagny.ink:78` |
| 2 | "Your company's full." + "Fine. I'll be at …" | `wren.ink:66`, `tamsin.ink:67` (Brannoc's at `brannoc.ink:57` is the same beat) |

### 1.2 Repeated phrases (n-grams)

The 3–8-word phrases repeated most are place names: "the Old Barrows" ×46, "the Canal Locks" ×33, "the Wickham road" ×29. That is normal for a game. The phrases that read as habit:

| Phrase | Count | Spread |
|---|---|---|
| "three hundred years" | 32 (23 as a sentence beat) | ilse 7, ashgate 4, agnes 3, intro 3, orla 2, osric 2 … in 11 files |
| "turns of the fighting" | 8 | ashgate 6, tamsin 2. A third word for "waves"; see §5 |
| "I'd like to (know)" | 13 | brannoc 4, ilse 3, wren 2, osric, dagny, tamsin, gunnar |
| "every fifth wave / lot" | 20 | the elite rule, said in-voice by 6 NPCs |
| "if you can" | 9 | 6 speakers |
| "the walking kind" | 4 | maudry 3, osric 1 (a canon phrase from the world doc, used just about right) |
| "the way a(n) X …" simile | 21 | 11 files |
| "as if …" | 18 | 10 files |

### 1.3 Templates used by several NPCs

These are the frames a reader notices, because the same line shape turns up in different mouths:

- **Turning down a quest (the "Not yet." / "Not now." reply).** I pulled all 53 replies. 32 of them (60%) say the same thing:
  - "X will keep" ×15: `osric.ink:120` "The bright-eyed ones will keep. They've kept three hundred years.", `ilse.ink:173` "The barrows will keep. They've had practice.", `dace.ink:78` "He'll keep. Preachers always do.", `brannoc.ink:93`, `dagny.ink:106`, `maudry.ink:182`, `wren.ink:126`, and five Ashgate speakers in one file: Hob `ashgate.ink:71` "Doors keep. That's what they're for." and `:86` "Fingers keep too.", Brannagh `:155` "The Flame'll keep.", Haldor `:241` "Iron keeps.", Gunnar `:306` "It'll keep. It's paper. Paper keeps better than people.", Mother Coke `:411` "The verse keeps."
  - "It's waited / it's patient" ×10: `agnes.ink:64`, `ilse.ink:134`, `tamsin.ink:166` "Patterns are patient. Smiths aren't.", `townsfolk.ink:109` "It's waited. Old water does.", `townsfolk.ink:278` "Weather's patient. It's the only thing that is."
  - "Not going anywhere. That's the point/problem of X" ×8: `osric.ink:95` "The post's not going anywhere. That's the point of a post.", `osric.ink:148` "He's not going anywhere. That's rather the problem.", `tobin.ink:69` "He's not going anywhere. That's rather the trouble.", `tamsin.ink:187` "Moulds don't go anywhere. That's the point of them.", `wren.ink:146` "It'll still float tomorrow. That's the problem with boats.", `townsfolk.ink:88` "That's the trouble with roads."
  - The good ones show what to aim for. Each speaker reacts in their own way: `pim.ink:74` "I'll be here. Or a bit to the left of here.", `wren.ink:106` "Fine. I'll just walk behind you jumpier than usual.", `townsfolk.ink:130` "She's not getting any less cooked.", `dagny.ink:157` "One more day." She doesn't believe it either.
- **A companion left dead.** `brannoc.ink:67` "looks back the way you came, where {fallen_name} should be". `wren.ink:77` is the same. `tamsin.ink:78` "keeps looking back the way you came, for {fallen_name}". `osric.ink:61` "looks at the space beside you where {fallen_name} should be".
- **Meeting a captive companion.** Each is found tied up in a boss's hall, described with "sits … with a chain from [his/her] ankle":
  - The first lines share a frame. `wren.ink:37` "Don't mind me. I'm surety. He'll be along in a minute to tell you how much I'm worth." `tamsin.ink:38` "Don't mind me. I'm on shift. He'll blow the whistle in a minute and tell you what I'm worth."
  - So does what happens to the boss. `wren.ink:41` "the Toadking's men carry him off by the boots". `tamsin.ink:42` "The goblins are carrying their foreman out by his boots".
- **A villain's ledger is found.** `osric.ink:158` "He kept books. Of course he did." `dagny.ink:167` "He left his ledger. Of course he did." `kellsrest.ink:72` "Hob sent you. Of course he did."

### 1.4 Repetition from the generators

- **Item flavour (`src/sim/items.js:143-148`).** `FLAVOUR` holds 12 lines, and `pick(rng, FLAVOUR)` (`items.js:182`) gives one to every Fine and Rare item from any base, at any level, in any region:
  - A repeat is more likely than not by the 5th Fine-or-better piece (62%), and almost certain by the 10th (99.6%).
  - 4 of the 12 lines name a material: "The stitching is careful. The bloodstains are not.", "A pilgrim's mark is pressed into the leather.", "The metal is still warm.", "Forged in Thornwick …". So a Ring, a Book of Hours or Slippers can say it was forged, or that its leather was stamped.
  - "Forged in Thornwick the winter the wells went black." turns up on drops in the Fens and the Reach.
  - The line the owner quoted, "Bought for a song; the singer never came back for it.", doesn't parse. The buyer pays the song to the seller, so why would the singer come back?
- **Item names (`items.js:141-142`).** 15 Fine words and 12 Rare words cover the whole game. The generator makes things like:
  - "Pilgrim's Pilgrim Boots" (the Fine word "Pilgrim's" on the "Pilgrim Boots" base);
  - "Book of Hours of the Long Dark" (two "of"s);
  - "Witch Hat of Saint Ilse";
  - "Wickham …" on Reach drops.
- **The Bowl roster (`content/arena.json`).** 400 member and player names are built from about 90 surnames: Gorse ×13, Wick ×12, Marsh ×11, then Kettle, Bramble, Ember, Grist and Yarrow ×10 each. "Ember" and "Ash" are surnames for 19 people, in a world where the Ember is the thing that burned souls.

---

## 2. AI-writing tells, with counts

House style versus tic: the world doc (§1, §11) asks for "plain words: short sentences", "wry, not silly", small practical complaints, and history "found, not told". Most of the text keeps to that. The problems below are where one device has spread to everyone.

| Construction | Count | Notes / examples |
|---|---|---|
| Sentences opening "Nobody …" / "Somebody/Someone …" | 43 / 41 | Plus 50 more uses mid-sentence. Overall nobody + nobody's = 91 and somebody + somebody's = 85 in 32,757 narrative words (≈5,400 per million; novels run at roughly 400–500 per million). `ilse.ink` alone has 14 such openings. |
| Fragment beginning "Not …" | 40 | `osric.ink:89` "That's the Watch. Not the sword. The standing.", `wren.ink:65` "Not because I'm scared. Because it's where the pockets are.", `items.js:197` "Not in your favour.", `items.js:218` "Not a sound. Not even a heartbeat." |
| "X. It/They did/does not Y." punchline | 38 | `items.js:145` "Taken from a barrow. The barrow did not object.", `items.js:147` "The last owner fell holding it. It did not fall.", `frag_reach_renewal.json` "We did not tell them." (that one's earned) |
| One-word answers ("Good." "Fine." "No.") | 44 | Pim 6, Tamsin 6, Osric 5; "Fine." opens 7 of Tamsin's and Wren's replies |
| "That's the point / the trouble / all it is" | 38 | townsfolk 6, osric 5, brannoc 4 |
| Short general statements as punchlines | 32 | "Orders don't end." (`ilse.ink:188`), "Bandits don't dig." (`osric.ink:142`), "Hens don't hold grudges." (`townsfolk.ink:233`), "Patterns are patient. Smiths aren't." (`tamsin.ink:166`), "Paper keeps better than people." (`ashgate.ink:306`), "Money doesn't change much. It just changes hands." (`kellsrest.ink:48`) |
| Stock modern line | 2 | "It always is. Until it isn't." (`kellsrest.ink:86`), "right up until they aren't" (`wren.ink:181`) |
| "which is why / which is more than / which he never does" | 11 | Osric 6 of them: `osric.ink:42, 55, 115, 130, 135, 157` |
| Colons in spoken lines | 168 | Ilse 20. A colon to explain is a written habit: `ashgate.ink:95` "Here's the thing your rogue's learned: a scatter of iron …" |
| Sentences ending ", and Y." | 349 | Fine in itself, but it is the main sentence shape for every NPC (Ilse 36, Ashgate 32). |
| "the kind of X that Y", tricolons | 0 / 19 | Not a problem here. |

**Default numbers.**
- **"forty"** (44 times):
  - Brannagh "forty years" (`ashgate.ink:102, 135, 176`) and Tamsin about Brannagh (`tamsin.ink:51`);
  - the Cold Seam "played out forty years" (`dagny.ink:98`, `cold_seam.json:7`);
  - Agnes has had the key "forty years" (`ilse.ink:281`, `reedholm_undercroft.json:8`);
  - "forty crowns" (`osric.ink:158`), "forty boats" (`wren.ink:187`), "forty hulls" (`toadking_mound.json:7`), "forty hundredweight" (`frag_reach_weigh_ticket.json`), "forty bound" (`frag_fens_vat_ledger.json`);
  - "forty lamps" and "forty to a shelf". These two are a real motif, and the other forties blunt it.
- **"three"** (109) and **"hundred"** (50) are high too.

**Stage business that everyone shares.** These are the stage directions an editor would underline:
- **Ledger or book on first meeting:** Osric (`osric.ink:32`, "turns a page in a ledger"), Dace (`dace.ink:27`, "writing in a book"), Tobin (`tobin.ink:22`, "a ledger open on his knee"), Nan Ruddock (`kellsrest.ink:30`, "a ledger on her knee"), Davy Pruett (`kellsrest.ink:65`, "with a ledger"), Ilse (`ilse.ink:68`, "a writing board on her knees"), Dagny (`dagny.ink:36`, "doing sums on her fingers"), Wynn (`ashgate.ink:191`, "writing down the bigger number"), and Agnes, whose look is a ledger (`agnes.ink:25`, "She looks at you the way a ledger looks at a sum").
- **Making you wait while they finish writing:** `osric.ink:32` "doesn't look up until he's finished the line", `dace.ink:27` "He finishes the word.", `ilse.ink:85` "holds up a finger until she finishes the word", `ashgate.ink:101` "finishes before she looks at you", `dace.ink:45` "holds up a hand until it comes out the same twice".
- **Reading it twice** (14): `ilse.ink:142, 181`, `dace.ink:36` "He reads it twice, slowly, with his finger", `ashgate.ink:314` "Gunnar reads the lease twice, with his finger", `osric.ink:157` "reads the page you give him twice, then a third time", `agnes.ink:61` "She reads things twice", `brannoc.ink:122` "She'll want to read it twice", `osric.ink:204` "Maudry read it twice. So did I."
- **"X to the elbows / cuffs"** (7): Pim "oil to the elbows" (`pim.ink:22`), Tamsin "black to the elbows" (`tamsin.ink:37`), Davy "ink to the cuffs" (`kellsrest.ink:65, 71`), Hob on Davy "ink on his cuffs" (`ashgate.ink:51`).
- **Sitting on an upturned crate, bucket or boat** (5): `kindler.ink:21`, `kellsrest.ink:30`, `ashgate.ink:363`, `wren.ink:36`.
- **"which he/she never does"** (5): `osric.ink:55` "He closes the ledger, which he never does.", `dagny.ink:143` "sits down, which she never does", `ilse.ink:376`.
- **The bookkeeping theme as a whole:** count/ledger/tally/book/roll/write appear in 214 of 4,264 narrative sentences. Money (paid/owe/debt) appears in another 115.

The world is about tithes and quotas, so ledgers are on theme. When the ledger is the dead empire's, it lands. When nine living people also keep one, it starts to feel like the writer's habit rather than the world.

**Lines that wink at the player or use mechanics words.** The world doc bans "winks at the player"; these break that:
- `townsfolk.ink:190` (Nell): "Rest's five coppers a level. Don't ask what a level is. It's what the ledger says."
- `ashgate.ink:213` (Haldor): "The best upgrades in the Provinces."
- `townsfolk.ink:47` (Bess): "So are skeletons." The world never calls them skeletons; it calls them the Ashbound.
- `ashgate.ink:366` (Mother Coke): "That's not a prophecy." This is a character quoting the style guide's own rule.
- Title and intro: "The heroes of this age are not available… Looks like it is up to you." (`intro.json:44`, `title.js:260`). This is the owner's pitch line, so it may stay. It is the only voice-mail joke in the game, though.
- `story.json:12`: "The rest of the Old Provinces comes in a later update." This is a developer's note in the story's voice.

---

## 3. Voice: do the NPCs sound different?

### 3.1 The numbers

| NPC (file) | Sentences | Mean words | % ≤4 words | % questions | "I" per 100 words |
|---|---|---|---|---|---|
| Ilse (`ilse.ink`) | 413 | 6.7 | 37 | 0 | 1.6 |
| Ashgate's eight (`ashgate.ink`) | 322 | 5.5 | 50 | 1 | 2.4 |
| Osric | 195 | 6.7 | 38 | 1 | 2.3 |
| Maudry | 193 | 7.0 | 36 | 3 | 2.0 |
| Dagny | 199 | 6.4 | 44 | 3 | 1.4 |
| Tamsin | 179 | 6.2 | 45 | 1 | 3.5 |
| Wren | 145 | 6.7 | 38 | 1 | 4.3 |
| Brannoc | 120 | 5.6 | 48 | 1 | 5.8 |
| Dace | 78 | 7.0 | 33 | 1 | 0.6 |
| Pim | 93 | 5.3 | 56 | 3 | 2.2 |
| Kindler | 38 | 6.7 | 45 | 3 | 4.7 |

The world doc says the Kindler is "charismatic, sincere". Brannoc is "slow to talk". Ilse "hates guesswork". Maudry "tells you more than she should". Yet they all speak in the same clipped sentences of six or seven words, and none of them asks questions. Lord Pellam, the one voice the doc writes as over-wordy ("three words where one would do"), never speaks.

### 3.2 Each voice in brief

- **Maudry Fenn.** A gossiping innkeeper who gives things away. Distinct when she gossips: "Sister Ilse bought a round last night. Sister Ilse. She said it was for a legion. I didn't ask which. I poured." (`maudry.ink:57`). Weak spots: her Shrine directions are word for word Osric's (`maudry.ink:64` / `osric.ink:62`), and she says "Don't tell anyone." twice in one greeting block (`maudry.ink:49, 53`).
- **Osric Hale.** Tired official, dry, self-mocking about paperwork: "Out of my purse, which Lord Pellam will repay, which is a sentence I have written before." (`osric.ink:130`). This is the strongest wry voice in the game. The trouble is that the game then hands his ledger to Dace, Tobin, Nan and Davy, which dilutes him.
- **Sister Ilse.** Archivist, precise, mildly sardonic: "Don't guess what it says. Bring it to me. I'll guess properly." (`ilse.ink:163`). She is the heaviest user of "Nobody/Somebody" (14 openings) and of "three hundred years" (7). She reads things twice 5 times.
- **Brannoc.** Apologetic giant: "I'll go first through doors. I'm the widest. It's the one thing I'm best at." (`brannoc.ink:56`). Distinct, but "Sorry." comes 9 times in 120 sentences. Halving that would keep the trait and lose the tic.
- **Wren.** A smuggler with a smirk, always transactional: "Not because I like them. They owe me two coppers." (`wren.ink:78`). Distinct, but her first line and her "company's full" line are copies of Tamsin's frame (§1.3).
- **Dagny Coalbrook.** Harried civic leader: "The moot sends its regards to everyone. It's cheaper than help." (`dagny.ink:67`). "Sums on her fingers" comes 5 times and "reads it standing up" 3 times. That is one tic too many on one character.
- **Tamsin Coalbrook.** A show-off prodigy: "The clans would say that was showing off. The clans are right. It felt wonderful." (`tamsin.ink:196`). One of the best voices.
- **Dace Pike.** Keeps a book of debts. He is Osric's twin: a man with a book, a nod at the bench, "He writes it down under a heading that just says *ROBES*" (`dace.ink:66`). His one unique note is "I don't lend money, which is why they all tell me." (`dace.ink:92`), and that is his best line.
- **The Kindler.** The best-differentiated speaker: "Come in, come in. Mind the step … Nobody here will hurt you while I'm talking. They like to listen." (`kindler.ink:22`). The doc wants him charismatic, though, and he would earn it with longer, warmer sentences than anyone else.
- **Pim Rushlight.** Anxious, repeats himself: "Three. Good. That's good. That's somebody's grandmother not in a jar." (`pim.ink:61`). Distinct. Keep him as he is.

### 3.3 Blind test

Six lines, with the speakers removed:

1. "The barrows will keep. They've had practice."
2. "The bright-eyed ones will keep. They've kept three hundred years."
3. "It'll keep. It's paper. Paper keeps better than people."
4. "They've kept this long. Most things I hide do."
5. "He'll keep. Preachers always do."
6. "The verse keeps. It's kept three hundred years."

The speakers: 1 Ilse (`ilse.ink:173`), 2 Osric (`osric.ink:120`), 3 Gunnar (`ashgate.ink:306`), 4 Wren (`wren.ink:126`), 5 Dace (`dace.ink:78`), 6 Mother Coke (`ashgate.ink:411`). Only Wren's can be told apart, and only because of "I hide".

**Speakers who could swap lines:**
- Osric, Dace and Tobin: three men with a book who write the player down.
- Ilse and Agnes: Grey Sisters who read slowly.
- Wren and Tamsin: captives with the same opening frame.
- Ashgate's Hob, Brannagh, Haldor, Gunnar and Coke: the "X keeps" quintet.

---

## 4. Names

Sources checked:
- the world doc's §5 and §9;
- `content/npcs/*.json` (31 NPCs) and the bosses in `src/sim/battle.js:319-349`;
- the hire pool in `src/sim/party.js:137-143`;
- the raid stand-ins in `src/sim/raid.js:49-51`;
- the hero-name suggestions in `content/creation.json:36-172`;
- the Bowl roster in `content/arena.json` (100 companies, 400 names);
- items (`items.js:141-142`, heirlooms 190-223) and skills (`src/sim/skills.js`).

**A. Generated pools reuse canon names.** This is the biggest naming problem: it makes major characters feel like stock.
- **Hire pool** (`party.js:138-142`): Osric (Osric Hale), Tamsin (Tamsin Coalbrook), Tobin (Tobin Hask), Hesk (Admiral Hesk), Maren (Sister Maren), Wenna (Wenna Pike), Thane (Thane Ivo; "thane" is also a title), Hild (Sister Hild). That is 8 of 30. Ilsabet is also close to Ilse.
- **Creation suggestions** (`creation.json`):
  - The Redhand deserter list offers **Garrow** (the Redhand captain you kill), **Teague** (a Fens boss), Vane, Dagny, Jory, Pike and Hask.
  - The Thornwick list offers Agnes, Hester, Col, Hob, Ned, Bess, Nell and Mabry.
  - The Grey Sisters list offers Tobin and Anselm.
  - The Deepdelver list offers Gunnar (Gunnar Slagg is Slagborn, not Deepdelver), Wenna, Fenn, Hob, and Skarl (one letter off Skarn, the goblin chief).
- **Raid stand-ins** (`raid.js:49-51`): "Brannoc77", "Tamsin Holt", "Ada Fenn", "Jory Teal", "Hesk", "Kestrel Vane".
- **Bowl** (`content/arena.json`):
  - "Sister Orla" fights for "Sister Orla's Penitents" (`:205, 220`). She is Saltmere's chapel sister.
  - "Bess Hale" (`:1857`) is the Thornwick smith, and "Hedda" (`:252`) is the egg-seller.
  - "Brannoc" plays at `:1716`.
  - Wren appears ×7, against the world doc's "The Lantern Guild's tavern rolls stop calling anyone Wren once she's been found".
  - Tamsin ×4, Jory ×5, Ilse ×4, Pim ×4, Hob ×4, Osric ×3, and Hale ×8 as a surname.

**B. Borrowed from other works or from real history:**
- **Garruk** (Magic: The Gathering), `party.js:138`.
- **Thrain** (Tolkien), `creation.json` Deepdelver list.
- **Coldharbour** (Elder Scrolls; also London), 4 Bowl surnames.
- **Wat Tyler** (the 1381 rebel), `raid.js:51`.
- **Tallowmere** (an indie game), a Fine item word at `items.js:141`.
- **Elric** (Moorcock), 4 Bowl names.
- "The White Wolves" (Bowl company name), which reads as The Witcher.
- **Skills taken from World of Warcraft:** Kidney Shot, Fan of Knives, Shadowstep, Frost Nova, Blizzard, Consecrate. Judgement, Earthshatter and Whirling Blades are generic MMO names.
- The world's own skill names are better: Second Wind, Old Marks, Thunder Drum, Hold the Line, Smoke Step. Hedda even calls Frost Nova "only a hard frost, early" (`trial_cold_weather.json`).

**C. Names too close to each other, in the same region or the same story:**
- Brannoc and **Old Brannagh**.
- **Nan Ruddock** and **Bel Ruddle**, both at Ashgate.
- **Morrow Vane** (the factor) and **Corvane Vell** (the Kindler), the two Act III villains; the stand-in "Kestrel Vane" and Bowl Vanes ×5 add to the overlap.
- Wenna Pike, Wynn Sallow, and the hire-pool Wenna.
- Hob and Corporal Hobb; Skarn and Skarl; Ilse, Ilsabet and Isolde; Tobin and Tobias.
- The "no relation" joke is used twice: Osric Hale and Bess Hale (world doc), then Lord Pellam and Widow Pellam (`ashgate.ink:348`). Once is a joke; twice looks like a habit.

**D. Generic fantasy, or against the naming guide:**
- **Rare item words** (`items.js:142`):
  - "the Hollow King" is a dark-lord name, which the guide bans.
  - "Saint Ilse" uses a saint, which canon doesn't have, and the name of a living NPC.
  - "the Long Dark" is wrong: canon calls the era the Long Dim. The same mistake is in the flavour line "Kept lit through the Long Dark."
- **Fine item words** (`items.js:141`): "Ashwarden", "Emberforged", "Cinderbrand", "Gravewatch", "Oakheart", "Grim", "Hollow" are stock fantasy, and not tied to any region.
- **Proving Pens bosses and foes:** "The Rat King", "The Spider Queen", "a graveyard wraith", "a stone golem". "Old Gutter" (`foes.json`) shows what an in-world name looks like.
- **Words built on ember, cinder, ash and kindle:** 91 distinct capitalised names and words in the corpus contain one of these roots: Ashgate, Ashbound, Ashwater, Cinder Reach, Cinder Cult, Cinderworks, the Kindler, Kindled, the Ember Throne, Emberfall, cinders (the currency), cinder hounds, and the Bowl's 19 people surnamed Ember or Ash. The world's central symbol is in nearly every name, and that waters it down.

**E. Names that read oddly:**
- "Mother Coke": modern readers will think of the drug or the soft drink.
- "Haldor Ironmonger": an ironmonger sells hardware; he is a smith.
- "Witch Hat": a costume-shop item in a world whose casters are hedge-callers and Grey Sisters.

The heirloom names (Garrow's Due, The Receipt, Short Weight, The Whistle, Quota) are good. They follow the guide's "a name and a line of history".

**F. One name used for two things:**
- **"Kindler"** is both the Cult leader's title and a sellsword perk (`content/companions.json:36`).
- **"Quota"** is both a quest (`ch3_quota`) and an heirloom.
- **"The Last Office"** is both a quest and an heirloom.
- **"Long Watch"** (perk) and **"The Long Watch"** (trial).
- **"Revive"** is a skill, but the temple "raises".

---

## 5. Clarity and UX copy

**One thing, several names:**

| Concept | Variants found (file:line) | Pick one |
|---|---|---|
| Losing the fight | "The party is beaten" `defeat.js:53` · "The company is beaten" `chatdock.js:291` · "Your group was beaten." `partyup.js:150` · "Your party is beaten" `renderer.js:1210` | "The company is beaten" |
| Your group | party (35 uses in UI), company (32), group (3), "Team" (Bowl tab). `townmenu.js:361` uses both in one sentence: "Your party and the bench are both full. Dismiss someone … (Your company)." | "company" for the people; "party" only if it strictly means the three in the field |
| Out of the fight | "slain" (17 UI), "the Fallen" `heroes.js:228`, "Downed" `stepout.js:46`, "beaten" | Downed = on the floor in a fight; slain = needs the temple. Drop "Fallen" from the UI. |
| Where you're raised | "the temple" (19 UI), "the Shrine of the Ember" (the town temple's name), "the chapel", "Shrine of the Last Flame". The dungeon's buff stones are also shrines, so `away.js:96` "raise them at a temple or a shrine" and `hud.js:70` "at the temple in town, or a shrine below" mean two different things by "shrine". `chatdock.js:291` and `renderer.js:1210` say "you wake at the temple" even in Saltmere and Ashgate, where `defeat.js:62` gets the name right. | "temple" for the town building (its name as the subtitle); "Shrine of Mending" in full for the dungeon stone |
| Money | gold (UI, 62 uses), coin (dialogue, 17), coppers (`townsfolk.ink:190`, `maudry.ink:148`, `wren.ink:78`), crowns (`osric.ink:158`), marks (the Bowl's) | Gold in the UI; let NPCs say "coin". Drop coppers and crowns, or make them real denominations. |
| Waves | "waves" (UI and quests), "lots" (dialogue ×13: `wren.ink:103` "every fifth lot"), "turns of the fighting" (×8). Tamsin uses both within seven lines: `tamsin.ink:184` "Five turns of the fighting" and `:191` "Five waves". | "waves" wherever there is a count; let a speaker say "lot" in passing |
| Dungeon depth | "floor" (93), "level down" (`ashgate.ink:132`, `kellsrest.ink:73`), where "level" clashes with hero level | "floor" |
| Stats | `STAT_LABEL` CRIT / DODGE (`items.js:23`) vs "CRT {…}% · DDG {…}%" (`townmenu.js:299`) | one set |
| Spelling | "Armor" (`items.js:22`, slot label) vs "armour" (`townmenu.js:12, 13, 488`, `firststeps.json:56`) | "Armour" (the rest is British) |

**Copy that is wrong now:**
- **The smith's first-open card** (`firststeps.json:62`) says: "Upgrade a piece a step at a time to +5, for gold and cinders (wood and stone from +3)." The game goes to +9 (`items.js` `UP_MAX = 9`; `townmenu.js:18` "+1 to +9"), takes a piece of gear (`townmenu.js:440`), and dropped wood and stone in v1.75.
- **Journal** (`story.json:30`): "the Drowned Choir still sings in the second-floor hall". The quest (`ch2_the_rolls.json:19`), Orla (`orla.ink:88`) and `sites.js` put it on the first floor.
- **Tip** (`tips.json:13`): "A shrine's light mends everyone standing, or raises one of the slain." Only the Shrine of Mending mends or raises; Might and Warding buff (`hud.js:46-49`).
- **Nell's price** (`townsfolk.ink:190`): "five coppers a level". `REST_COST = 5` gold × level (`heroes.js:59`).
- **Creation** (`creation.json:29-33`, shown at `create.js:130`): a locked "Healer — Found in the fens." The world doc §5 says the Healer is deferred (v1.20), so this teases a class that doesn't exist.
- **Proving Pens summary** (`content/sites/proving_pens.json:7`): "The fire beetles, goblins, wraiths and golems each alone, the vermin together, all four new together; the Rat King and the Spider Queen in the halls." This is a design note, not a description.
- **`story.json` `nextFound`**: "talk to her from her card". The "her" is hard-coded. It is right for Tamsin today, but wrong the first time a male found companion uses it.

**Mechanics explained badly or with in-house jargon:**
- "their perks are dark" (`hud.js:80`, `partyscreen.js:69`, `sheet.js:329`, `townmenu.js:334`). Better: "their perks are off until paid".
- "once a room" / "once a room visit" (`hud.js:83`, `skills.js:89, 123`, `sheet.js:332`). A player won't know what a "room visit" is. Better: "once per room you enter".
- `worldmap.js:334`: "Furnace Nine burns the first 15 minutes after every half hour". Better: "from half past each hour, for 15 minutes".
- `ring.js:119`: "It was still standing when the window's quarter hour ran out. A minute there pays Bronze." The "window" and "Bronze" are never introduced.
- `bowl.js:164`: "The ten bouts a day are shared with Team." "Team" is a tab name used as if it were a person.
- `companions.json` terms: "Fee and wage are times their level." Better: "Fee and wage scale with their level." Also, a section headed "Seasons" describes levels, not seasons.
- `skills.js` uses "within 3¾ tiles" in 4 places. That's fine for a stats panel, but odd in prose.

**Length on a phone.** Most toasts are short. 5 HUD lines run past 90 characters (`hud.js:46-49`, `away.js:64`). `partyup.js:104` packs the whole raid explanation into one note.

**Punctuation:**
- Apostrophes are straight 2,079 times and curly 85 times. The curly ones are mostly in `townmenu.js`, which has 22 curly and 3 straight. 7 files mix the two (`townmenu.js`, `sheet.js`, `ring.js`, `defeat.js`, `hud.js`, `tips.json`, `foes.json`).
- Percent signs are "25 %" 73 times and "25%" 7 times; `sheet.js` and `townmenu.js:299` do both.
- The middle dot (·) is used consistently as a separator (128 UI strings, never more than 4 in a string). That's fine.
- "…" (62) is used throughout, with no "...". That's fine.

---

## 6. Other things an editor would flag

- **Lines that don't quite mean anything:**
  - "Bought for a song; the singer never came back for it." (`items.js:147`)
  - "Nobody listens always." (`townsfolk.ink:271`)
  - "Officers of Nothing" (a bounty title, `bounty.json`)
  - "Stand downwind of nothing." (`arena.json`, The Ember Choir)
- **Too-modern phrases:**
  - "Until it isn't." (`kellsrest.ink:86`)
  - "Looks like it is up to you." (`intro.json`)
  - "Individual" vs "Team" on the Bowl tabs (`bowl.js:212`)
  - "The heroes of this age are not available…" (voice-mail register)
  - "mini-quests" (`townmenu.js:23`)
  - "Respec" and "reroll" (`sheet.js:305`, `townmenu.js:18`) are gamer slang. Acceptable as UI labels, but they sit next to in-world text like "The Sisters keep a mirror and a pair of shears".
- **Weekday names:** Friday appears in `ashgate.ink:104`, `tamsin.ink:108` and `ashgate.ink:129`, and Tuesday to Friday in `tobin.ink:63`. Fine if wanted; just note that this world has weekdays.
- **Off-canon wording:** "Long Dark" (`items.js:146`) where canon says Long Dim. "Dwarf-folk banter" (`origins.json:18`): not shown to players, but the world doc never calls Deepdelvers dwarves.
- **Typos:** none found by mechanical scans. Ink lines with odd numbers of quote marks: none.

---

## 7. Suggestions, best payoff first

Each fix keeps the world's tone. The goal is plainer, more specific lines, and each speaker sounding like themselves.

### 7.1 Fix the 8 wrong strings first

| File:line | Before | After |
|---|---|---|
| `firststeps.json:62` | "Upgrade a piece a step at a time to +5, for gold and cinders (wood and stone from +3). Cinders come from salvaging gear you won't use." | "The forge makes your gear better: a step at a time, up to +9, for gold, cinders and a piece of gear you give up. Cinders come from salvaging what you won't use." |
| `story.json:30` | "…sings in the second-floor hall. Somebody should stop them." | "…sings in the first floor's hall, over the stair. Orla wants it stopped." |
| `tips.json:13` | "A shrine's light mends everyone standing, or raises one of the slain. Once." | "A Shrine of Mending raises the first of your slain and speeds everyone's healing. One use." |
| `townsfolk.ink:190` | "Rest's five coppers a level. Don't ask what a level is. It's what the ledger says." | "Beds are priced by the guest. The bigger the name, the bigger the bill." |
| `ashgate.ink:213` | "The best upgrades in the Provinces." | "The best edges in the Provinces." |
| `townsfolk.ink:47` | "So are skeletons." | "So's legion steel." |
| `proving_pens.json:7` | (design note) | "A trial behind the Scrag Warren's old adit: two floors of pens where something has been keeping beasts. The biggest are kept in the halls." |
| `creation.json:29-33` | Healer · locked · "Found in the fens" | Remove until the class exists. |

### 7.2 Item flavour and names (`src/sim/items.js:141-148`)

The fix is a generator change: pools by material, and by region where the item level tells you the region. Write about 8 lines per material group (metal / leather-cloth / wood-bone / jewellery) per region, about 60–90 lines in all. Then filter Fine words that repeat the base ("Pilgrim's" on Pilgrim Boots).

Before and after:
- "Bought for a song; the singer never came back for it." → Vale, metal: "Sold at Thornwick market with the legion's number filed off."
- "Taken from a barrow. The barrow did not object." → Vale, any: "Barrow clay still packed in the rivets."
- "The last owner fell holding it. It did not fall." → any: "The grip is worn to a smaller hand than yours."
- "The stitching is careful. The bloodstains are not." → leather and cloth only: "Patched at the elbow with sacking, in small careful stitches."
- '"Kept lit through the Long Dark." The metal is still warm.' → Reach, metal: "Stamped KELL ASSAY, FIT FOR ISSUE. The stamp is newer than the steel." Fens, any: "Green at every seam. It was in the canal a long while."

Rare words: "Saint Ilse" → "the Grey Sisters"; "the Hollow King" → "the Third Legion"; "the Long Dark" → "the Long Dim".

Fine words: replace "Tallowmere", "Oakheart", "Grim" and "Hollow" with region words: "Legion-issue", "Redhand", "Reed-bound", "Slag-forged", "Assay-stamped".

The sim side: `flav` and `name` are stored on the item, so old loot keeps its text. Changing the pool changes the text of new drops, so re-check `smoke-test.mjs`'s recorded replay hash after the change.

### 7.3 Break the shared templates in dialogue (about 110 lines)

- **Decline replies (32 lines).** Keep at most 3 "it'll keep" lines in the whole game, and make every other reply say something about that speaker:
  - Haldor `ashgate.ink:241` "Iron keeps." → "Then get your edge ground by someone worse. You'll be back."
  - Gunnar `ashgate.ink:306` "It'll keep. It's paper. Paper keeps better than people." → "Right. I'll be here, then. Not in the row. Here."
  - Ilse `ilse.ink:173` "The barrows will keep. They've had practice." → "When you do go: anything with a stamp. Not a guess about a stamp. A stamp."
  - Dace `dace.ink:78` "He'll keep. Preachers always do." → "Then I'll put you down as owing me a look. I collect."
  - Tobin `tobin.ink:69` "No. He's not going anywhere. That's rather the trouble." → "Then I'll keep crossing them out. The ink's coming out of my own pocket, mind."
- **Staging (about 25 lines).** Give the ledger to Osric and the dead empire only. Tobin's book of names can stay, because it is his job. Everyone else gets their own business:
  - Nan, `kellsrest.ink:30` "with a ledger on her knee and a crossbow against the crate" → "oiling a crossbow that doesn't need it, with the Assay's pay-chit pinned to her sash where everyone can see it".
  - Davy, `kellsrest.ink:65` "sitting on the yard gate's step with a ledger" → "eating bread and dripping on the yard gate's step".
  - Dace, `dace.ink:36` "He reads it twice, slowly, with his finger" → "He reads it slowly, lips moving, a thumb under each line."
  - Osric, `osric.ink:157` "reads the page you give him twice, then a third time, which is once more than he reads anything" → "reads the page with his thumb over the signature, as if it might get away."
  - Agnes, `agnes.ink:25` "She looks at you the way a ledger looks at a sum." → "She looks at you the way she'd look at a novice come in late to Office."
- **Captive companions (6 lines):**
  - Wren, `wren.ink:37` "Don't mind me. I'm surety. He'll be along in a minute to tell you how much I'm worth…" → "If you're robbing him, the good stuff's under the boat. If you're here for me, cut the rope first and haggle after."
  - Tamsin, `tamsin.ink:42` "carrying their foreman out by his boots" → "dragging their foreman out by his whistle cord".
  - Wren, `wren.ink:66` "Your company's full. Fine. I'll be at the Stilt House…" → "No room? I've been in tighter. Stilt House, Saltmere. Don't tell Dace."
- **"forty" (about 15 lines).** Keep forty for lamps only (the tithe plate and the pattern shelf), so the motif means something:
  - `toadking_mound.json:7` "forty hulls" → "every hull he ever took".
  - `reedholm_undercroft.json:8` and `ilse.ink:281` "forty years" → "since she took her vows".
  - Brannagh's "forty years" (`ashgate.ink:102, 135, 176`) → "since the Seam shut".
  - `osric.ink:158` "forty crowns" → "thirty gold".
- **"Nobody/Somebody" (cut about 60 of 176).** Ilse first: e.g. `ilse.ink:76` "Somebody should write down why." → "I'd like to know why before the Cult does."
- **"Of course he did." ×3.** Keep Osric's; Dagny `dagny.ink:167` → "He left his ledger. A man like that always leaves the paperwork."

### 7.4 Give each major NPC a different rhythm, not just different subjects

The doc's "short sentences" should stay the default for townsfolk. Three or four voices should break it on purpose:
- The Kindler: long, warm, rolling sentences, and he asks questions.
- Agnes: formal and liturgical, full sentences, no contractions.
- Ilse: qualifies and corrects herself.
- Lord Pellam: write him at last (a letter would do): florid and three words where one would do, the one wordy voice.

Example, Kindler `kindler.ink:37`. Before: "That nobody needs to be tired any more." After: "That nobody need be tired any more. Not the lock-men, not your carters, not you. Doesn't that sound like something worth a little trouble?"

### 7.5 Names

- **Hire pool** (`party.js:138-142`):
  - Garruk → Godwin, Osric → Oswy, Tamsin → Tansy, Thane → Thom, Maren → Mildred, Tobin → Tod, Hesk → Rusk, Hild → Hulda.
  - The names are only display text. The rng draws index into the arrays, so swapping names doesn't shift any draws as long as each class list stays at 6.
- **Creation pools:** remove Garrow, Teague, Vane, Dagny, Gunnar, Agnes, Tobin, Anselm, Thrain, Skarl, Jarl and Grimm. Replace the Deepdelver list's Tolkien and Norse names with something from the Reach's own sound: clipped, mining words like Lode, Marl and Durn, which are already in the list.
- **Raid stand-ins:** Wat Tyler → Wat Cooper; Brannoc77 → barrowman77; Kestrel Vane → Kestrel Moss.
- **Bowl:** no canon NPCs as fighters (Sister Orla → Sister Brid's Penitents), no Wrens, Coldharbour → Coldwell, and fewer than 5 people per surname.
- **Close pairs:** rename Old Brannagh (Old Nessa?) or Bel Ruddle (Bel Tanner?). Decide whether Corvane Vell / Morrow Vane is deliberate; if not, rename one.
- **Owner decisions:**
  - Mother Coke (keep, or try "Mother Breeze", breeze being coke dust).
  - The WoW skill names: Frost Nova → Hard Frost (Hedda already calls it that), Fan of Knives → Knife Spray, Kidney Shot → Pommel Blow, Shadowstep → Step Behind, Consecrate → Hallowed Ground, Blizzard → Whiteout.
  - Rename the "Kindler" perk (→ "Spark-Thrower").

### 7.6 UI terms (about 40–60 strings)

Adopt the glossary in §8, then:
- `defeat.js:53`, `chatdock.js:291`, `partyup.js:150`, `renderer.js:1210` → "The company is beaten." The subtitle should name the place, as `defeat.js:62` already does.
- `heroes.js:228` "Only a temple can raise the Fallen here" → "Only a town temple can raise the slain."
- `hud.js:70` "{name} is slain: out of the fight until raised · at the temple in town, or a shrine below" → "{name} is slain · raise them at a temple or a Shrine of Mending"
- `townmenu.js:361` "Your party and the bench are both full. Dismiss someone on the bench for good first (Your company)." → "Your company and the bench are full. Dismiss someone from the bench first."
- `worldmap.js:334` → "Furnace Nine burns from half past each hour, for 15 minutes."

---

## 8. A short style sheet

**The house voice.** Keep these from the world doc: plain words, practical complaints, history in fragments. Add these:
- Every NPC needs one concern that bends their syntax: Pim's nerves, Brannoc's apologies, Tamsin's showing off. A concern only in what they talk about isn't enough.
- No device belongs to more than one speaker. If a ledger is Osric's, nobody else has one.
- One punchline per line at most. Let some lines simply give information.
- NPCs may ask the player questions.

**Voices.**

| NPC | Register | Sentence shape | Their one device | Not for them |
|---|---|---|---|---|
| Maudry | Gossip, warm, mercenary | Medium, run-on with "and"; asides | Tells a secret, then prices it | ledgers, "keeps" |
| Osric | Tired official | Measured; "which is …" clauses | The ledger (his alone) | aphorisms about patience |
| Ilse | Precise archivist | Full sentences, qualifies herself | Corrects your wording | "Nobody/Somebody" openers (cap 3) |
| Agnes | Old prioress, formal | Long, liturgical, no contractions | Quotes the Office | jokes |
| Brannoc | Big, slow, sorry | Short; one "Sorry." every 3–4 knots | Apologising | wit |
| Wren | Smuggler | Quick, transactional, asks questions | Everything is a deal or a debt | counting coins, "keeps" |
| Dagny | Harried civic leader | Brisk orders | Sums on her fingers (×2 max) | reading twice or standing up |
| Tamsin | Prodigy, show-off | Bright, boastful, short | "Showing off" / asking the iron | "Don't mind me" |
| Dace | Fen landlord | Folksy, fen words ("Aye", "folk") | Who-owes-whom gossip (no book) | Osric's lines |
| Kindler | Preacher | Long, warm, rhetorical questions | Calls everyone "friend" | clipped fragments |
| Pim | Nervous chandler | Repeats himself | "Please tell Wendel" | as is |

**Banned or limited phrases.** These should be counts a CI check can enforce:

| Phrase / pattern | Budget (whole game) | Now |
|---|---|---|
| "will keep" / "X keeps." as a reply | 3 | 15 |
| "not going anywhere" / "That's the point/problem/trouble of/with X" | 2 | 8 |
| "three hundred years" | 10 (Ilse and lore exempt) | 23 |
| "forty" outside lamps | 0 | ~38 |
| "reads it twice", "with his/her finger" | Ilse only, 2 | 14 / 4 |
| "Of course he/she did." | 1 | 4 |
| Sentence opening "Nobody" / "Somebody" | 1 per knot; 40 total | 84 |
| "Not X. Y." fragment pairs | 1 per NPC file | 40 |
| "to the elbows / cuffs", "upturned …" | 1 each | 7 / 5 |
| "Don't mind me", "You came in short", "Your company's full" | 1 each | 2 / 2 / 3 |
| "Sorry." (Brannoc) | 5 | 9 |
| Mechanics words in NPC mouths ("level", "upgrade", "skeleton", "XP") | 0 | 4 |

**Naming rules:**
1. No generated name (hire pool, stand-ins, creation suggestions, Bowl) may share a first name or surname with an NPC in `content/npcs/` or a boss in `battle.js`.
2. No names from other works or real people. Keep a deny list: Garruk, Thrain, Elric, Coldharbour, Wat Tyler, Tallowmere, and the WoW skill names.
3. Within a region, no two named NPCs share their first four letters (Brann-, Rudd-, Vane/Vell).
4. People are not named Ember, Ash, Cinder or Kindle. The motif is for places and the Cult.
5. Items:
   - Rare "of X" uses canon proper nouns only, and no saints.
   - Fine words come from the drop's region.
   - The generator never repeats a word already in the base name.
6. Skill names are in-world idiom (Second Wind, Old Marks), not MMO stock.
7. One name, one thing. A quest, a perk and an heirloom don't share a name.

**Terms glossary for UI text:**
- **company**: the player's people. **party**: only if it strictly means the three in the field.
- **Downed**: down mid-fight. **slain**: needs the temple. Not "Fallen".
- **temple**: the town building, with its own name as the subtitle. **Shrine of Might / Warding / Mending**: always in full.
- **gold** in the UI, **coin** in speech.
- **waves**, **floor**, **Armour**, **CRIT / DODGE**, "25 %", and curly apostrophes everywhere (or straight everywhere; just pick one).

---

## 9. Keeping it from coming back

This is a proposal only; nothing was built. Add `tools/content/copylint.mjs` and chain it into the existing `content` script: `"content": "node tools/content/validate.mjs && node tools/content/ink.mjs --check && node tools/content/copylint.mjs"`. `npm run check` and CI then pick it up for free.

1. **The corpus.** It is built the same way as `corpus.mjs` here:
   - the Ink source, with logic, tags and diverts stripped, and `{&a|b}` sequences split;
   - the text keys of `content/**/*.json`, skipping the `$comment` and `note` keys in NPC files;
   - string literals from `src/ui/*.js` and the copy-bearing sim files (`items.js`, `skills.js`, `party.js` `NAMES`, `raid.js` `STANDIN_NAMES`), parsed with `espree` or `acorn`, which already come in through ESLint.

   Every string keeps its file:line.
2. **Rules** live in a `content/copy-rules.json`:
   - `budgets`: regex → maximum count, the table in §8. Fail when a count goes over its budget.
   - `banned`: regexes that may never appear, e.g. `\bLong Dark\b`, `\bSaint \w+`, `\bskeletons?\b` in Ink, and the IP deny list.
   - `glossary`: a deprecated term → its preferred form, applied to `src/ui` only (e.g. `\bFallen\b` → "slain", `\bgroup\b` → "company").
   - `names`: build the canon set from `content/npcs/*.json` names and `battle.js` `BOSSES` names. Fail if any generated pool contains one of those first names or surnames, or if two NPCs in a region share a 4-letter prefix.
   - `style`: per-file apostrophe style and "N %" spacing.
3. **A ratchet for repetition.**
   - Count every 4–6-word phrase, excluding a stop-list of proper nouns, which can be generated from content names and site names.
   - Exclude a short allow-list of deliberate templates (the board's "Hand it in at …", Ilse reading fragments).
   - Write the counts to `content/copy-baseline.json`. Fail if any phrase count rises above the baseline, or if a new phrase appears more than 4 times.
   - `node tools/content/copylint.mjs --update` rewrites the baseline after a human has reviewed the change.

   The existing text doesn't fail the build on day one, and the counts can only go down.
4. **Output** is one line per hit, in the form `file:line rule "excerpt"`, like ESLint's, so it reads well in CI logs.
5. **Tests:** a `test/copylint.test.mjs` with a few fixture strings proves each rule fires.

---

## 10. Order of work

| Step | What | Strings touched | Size |
|---|---|---|---|
| 1 | The 8 wrong strings (§7.1) | 8 | An hour |
| 2 | UI terms glossary pass (§7.6, §5 table) | 40–60 in `src/ui`, sim refusal strings | Half a day; needs a browser-suite run, since some tests match text |
| 3 | Item flavour and affix words, and the generator by material and region (§7.2) | 12 → about 70 flavour lines, 27 words, a generator change in `items.js` | Half a day plus re-checking the smoke replay |
| 4 | Name pools (§7.5): hire, stand-ins, creation, Bowl | about 40 replacements of 30 + 24 + 128 + 500 names | Half a day; data only |
| 5 | Dialogue templates (§7.3): declines, staging, captive frames, forty, Of course, Nobody/Somebody | about 110 lines in 15 `.ink` files and 6 JSON, then `node tools/content/ink.mjs` to recompile | 1–2 days |
| 6 | Voice pass on the six heaviest files (ilse 413 sentences, ashgate 322, townsfolk 206, dagny 199, osric 195, maudry 193), using §8 | about 300 lines lightly touched | 2–3 days |
| 7 | Owner decisions: skill renames, Mother Coke, the title tagline, Corvane/Vane | 6–10 names | Decision, then an hour |
| 8 | `copylint.mjs` and its baseline (§9) | — | Half a day to a day |

Doing step 8 right after step 1 means each later step lowers the baseline, and the counts can't creep back up.

---

*The scan's scripts were one-off scratch work and aren't in the repo; §9's `copylint.mjs` is the proposal for a lasting version.*

## 11. Found while writing the Script Desk's context notes (2026-11-19)

These are places where the text and the game disagree. The Script Desk shows each one beside its line.

**Wrong now:**
- **Maudry's active line for *Smoke over the Vale*** (maudry.ink, `maudry_ch1_active`): "Up the river, the stone place
  with the wheel" points to the Tithe Mill. The chapter moved to the barrow mouth in world doc v1.32, and her offer's
  "smoke up the river" dates from the same earlier version.
- **Floor numbers in `story.json`:**
  - The Toadking's hall is the Mound's second floor, not the third.
  - The Drowned Choir is the Abbey's first floor, not the second.
  - *The Rolls* labels its chests "on the second floor", but they count from the first floor down.
  - The Chaplain's Last Page fragment note says the "second-floor hall", but the fragment is on the Chapel's first floor.
- **Brother Teague** is still "at the choir's door" in Orla's and Wren's lines and the Bells summary. Since world doc
  v1.48 he keeps a cell off the cloister.
- **The Mere Tower:** `story.json` still has "the ferry at Saltmere's quay". Since v1.51 Wenna Pike comes when she's sent
  for.
- **Ilse's "the mill's tithe ledger":** the fragment has been in Wickham Keep's strongroom since v1.48.
- **Col's *Old Roads* hand-in choice** "The Scrag's quiet" predates the trial's move to Wickham Keep (v1.48).
- **The HUD's "New skill learned"** (`src/ui/hud.js`) names the class's level-6 skill after the level-12 and level-24
  trials. The dialogue box names the right one.
- **Osric (r0634) and Maudry (r0526) name the Kell Assay** one chapter before Ilse reveals it at *The Last Office*.

**Text that promises more than the game does:**
- The barrows-road messages pick a line by how many ranks are left, not by which rank fell.
- *The Sickpools*' ready line mentions only the cages, but the Vatwarden must fall too.
- *Dead Water*'s "if they see you, it doesn't count" and *Night Boats*' "tied with my knot" are flavour; the game counts
  any five wave-leaders and any two chests.
- Gunnar's braided renegade leaders, and the Yards' "guard-captains", aren't what the player fights.

**Canon drift:**
- Brannoc's chain "held me for a year", but canon says months.
- Brannagh's "twelve a week" against canon's eleven.

**Never shown:**
- `story.json`'s "Act II is done" card;
- the intro's `name` field;
- the road file's `road` field;
- a site's `summary`, such as the Proving Pens' design note.
