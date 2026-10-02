# Emberfall — World Summary

**v1.16 · 2026-10-02 · Companion to [emberfall-gdd.md](./emberfall-gdd.md).**

v1.16 says how the Vale's enemies look (§5, §8; art critic pass 9). Captain Garrow fights bareheaded:
dark hair going back, a goatee, and a gold ring in one ear. The Robed Stranger wears the Cult's charcoal and ember and
carries the ember-shard he dies holding. The Cult's acolytes shave their heads. Nothing new about who
they are.

v1.15 says how Thornwick's people look beside each other (§5; art critic pass 8). The Watch can't
afford plate that shines: Osric's is dull iron, and Jory's is boiled leather. They aren't one size:
Jory is the tallest in the square, Hedda and Nell Tolley the smallest, and Brannoc is bigger than any of
them. Nothing new about who they are.

v1.14 says what Thornwick's people carry about the square (§5; art critic pass 6). Each one's trade
is in their hands: Wendel a lit lantern (the lamp oil he sells), Bess Hale a smith's hammer and a
leather apron, Col a carter's whip, Nell Tolley the Crossed Keys' ring of keys, Hedda a basket of
eggs, Maudry her pewter mug and the mustard dress down to her boots. Nothing new about who they are.

v1.13 fixes two words (dialogue critic pass 1). A companion who goes down and stays down until the
temple raises them is **slain**, not "Fallen": the Fall is the empire's, and the word stays with
it. The salvage currency is **cinders**, not "embers": the Ember is the empire's flame, and the
word stays with that too. A party that loses a room is **beaten**.

v1.12 says why a new companion is greener than you (§4, *Sellswords and the Guild's ranks*; §5,
Brannoc): the Guild keeps its seasoned members for companies it knows, and Brannoc comes out of a
cell. Either way they learn the rest at your side.

v1.11 says how the Lantern Guild hires out its sellswords (§4, *Sellswords and the Guild's
ranks*): the four ranks, the dawn wage, and what a sellsword does when it isn't paid.

v1.10 says where the Vale's bows come from (§3.1, *Bows and crossbows*): yew from the old
hedgerows, poachers' hunting bows and the Greyholt fletchers' longbows. It also says why the
Redhand carry crossbows instead.

v1.9 says why the Vale fights its dead (§3.1, *The road*). The barrows legion stands on the barrows
road in ranks, facing north, waiting for the relief that never came, and nothing gets past it. It
also says how they're relieved: the line thins as the barrows are fought, and breaks when its
Standard falls. The intro's last beat now points at the road, not the town.

v1.8 fills in Brannoc's chain (§5): who he owes, where the paymaster kept the robes' coin, and what
the wax on the purses looks like. It also says who holds the Vale set's hall fragments (§7): Garrow
kept the Last Dispatch, and the Chaplain's Last Page lies where the Stranger was digging.

v1.7 fills in the Hollow Vale for M5 ([m5-plan.md](./m5-plan.md)). It adds the Vale's sites (§3.1),
Captain Garrow and the Robed Stranger (§8) and the trial-givers (§5), and gives Brannoc a story
(§5). The Chronicle's Vale set is now complete at ten fragments, with its hidden site (§7). Act I's
shard now turns up in the Sunken Chapel; the barrows were already open when the game begins (§6).

v1.6 brings Thornwick's people into the town (§5): Osric's Watch post by the well, Sister Ilse at
the Shrine, and six townsfolk. It also sets down the first three fragments of the Vale's Chronicle
set (§7).

v1.5 hangs the Lantern Guild's board in Thornwick (§4) and says who pins jobs to it.

v1.4 gives Maudry an errand (§5): the carters won't take the barrows road.

v1.3 adds what Maudry Fenn lets slip in her first conversation (§5).

v1.2 dresses the Grey Sisters' clerics (§4: off-white vestments, a mace and a chained psalter),
changes the pitch to *"The heroes of this age are not available… Looks like it is up to you."*
(the intro's closing card)
and adds the old roads (§3.6) and the loading tips (§7).

v1.1 adds:
- the Heights story boss (§8);
- Ember Rifts and region bosses (§10);
- origins and a dialogue voice guide for writers (§11).

All player-facing text is pre-written and branching, authored in Ink and JSON
([quest-lore-system.md](./quest-lore-system.md)). This is the
narrative spine: the history, places, factions and main arc that quests, dungeons, enemies and
loot all hang from. The quest generator reads its tables (regions, sites, factions, hooks), so
names and facts here are **canon for content**. Change them here first.

---

## 1. The pitch

> The heroes of this age are not available… Looks like it is up to you.

**Emberfall** is the forgotten backwater of a fallen empire. It's a second-rate province of
mud roads, tired militias, half-flooded abbeys and ruins nobody famous bothers to loot. The
tone is the **classic D&D paperback**: sellswords in a tavern, a quest board and a rumour
about a barrow. There's a map with blank corners and a dungeon under the keep. It's earnest,
a little grim, occasionally wry, and never epic at the start. You are nobody. By the end
Emberfall will tell stories about you, even if the rest of the world never hears of them.

**Tone rules**
- **Small stakes that grow.** The first quest is rats and bandits. The last one is the fate of
  the province, not the world.
- **Ruins of greatness.** Everything impressive was built by *someone else, long ago*. The
  living make do.
- **Wry, not silly.** NPCs complain about taxes and the weather while the dead walk. No memes,
  no fourth wall.
- **History is found, not told.** No lore dumps. The past arrives in fragments the player
  pieces together (§7).

---

## 2. History at a glance

| Age | When | What happened |
|---|---|---|
| **The Kindling** | ~1,000 years ago | Pilgrims find the **Ember**, a flame that burns without fuel, in a crater in the Pale Heights. Whoever tends it can bind the dead to labour. |
| **The Solmere Empire** | ~900–300 years ago | The **Ember Throne** is built around the flame. Its **Ashbound**, legions of bound dead, dig the Undervaults, stoke the forges and never tire. This province is the empire's mines and granaries. |
| **The Fall** | ~300 years ago | In one night the Ember goes out. The Ashbound drop where they stand, the forges go cold and the empire tears itself apart within a generation. The event gives the land its name. |
| **The Long Dim** | 300 years → now | Emberfall becomes a backwater with petty lords, a trade road and nothing more. The ruins are "haunted", which is to say *quiet*. |
| **Now** | Year 301 of the Dim | Smoke rises from the old forges. Barrows are opening. The dead are standing up again, and nobody important is coming to help. |

**The secret (Act IV reveal).** The Ember did not fail. **Empress Aurelle Solmere put it out
herself.** She learned that the flame didn't just bind the dead; it *burned the living's
souls as fuel*. The Fall was a sacrifice, and the empire's collapse was the price. The only
record is scattered in fragments that the Cinder Cult has spent 300 years trying to destroy.

---

## 3. The land: four regions and a throne

Each region is a difficulty tier, a set of tile variants and biomes (the engine's
`?tiles=&tv=` language), an enemy mix and a chapter of the main arc. **Each region has one
town, its hub**, with the same four services in the same buildings, toned for the region (GDD §10).

### 3.1 The Hollow Vale: levels 1–8 · Act I
Rolling farmland, hedgerows and the barrows of the old legions. It's the safest region, and
it's where everyone starts.
- **Town:** **Thornwick**: tavern *The Tired Mule*, inn *The Crossed Keys*, *Hale & Daughter,
  Smiths*, the *Shrine of the Ember*. **Greyholt** (walled market town, seat of the useless Lord
  Pellam) is an overland landmark, not a hub.
- **Sites:** the Old Barrows (crypts), **Wickham Keep** (a ruin the Redhand bandits hold), the
  Sunken Chapel and the Tithe Mill. (v1.7:)
  - **The Tithe Mill:** Lord Pellam's mill on the river, where the Vale's tithe grain is ground.
    The Redhand squat in it and burn the miller's carts for warmth. Levels 1–3.
  - **Wickham Keep:** an imperial keep on the Wickham road, now the Redhand's hold, with cellars
    that go down into older stone. Levels 3–6.
  - **The Sunken Chapel:** an imperial chapel half-swallowed by the river marsh, where the
    legion was bound. Robed strangers pay the Redhand to dig there. Levels 5–8.
  - **The Ninth Milestone** (hidden): the legion's strongroom under the ninth milestone of the
    Wickham road. Nobody knows it's there until the Chronicle says so.
- **The road (v1.9): why the Vale fights its dead.** The barrows lie under the old Wickham road.
  Its stretch past them, which Thornwick calls the *barrows road*, is the short way out of the
  Vale for the Greyholt cart and everyone else. When the digging woke the Third Legion this spring,
  it did what its last order said: it went back to its post. The dead stand across the barrows road
  in ranks, facing north, the way the relief column would have come.
  - **They don't march on Thornwick.** They don't want anything. They stop whatever comes down the
    road, because nothing that comes down it is the relief. The first wagons that tried are still
    standing where they were stopped, one of them overturned.
  - **That is the harm.** The carters go the long way round, a day out each way. Lamp oil, ale
    and iron cost more every week. Lord Pellam sends letters. It's a slow strangling, not a siege.
  - **Walkers get through.** The dead turn their heads to anyone on foot and let them pass: one
    traveller isn't an army. Wagons, carts and columns they stop.
  - **How the line thins.** The ranks on the road are drawn from the legion below. Each one goes
    when its part of the legion is put down:
    - the front rank, when the walking kind near the surface are knocked back (Maudry's errand,
      *The Long Way Round*);
    - the officers' rank, when the bright-eyed ones who lead them fall (Osric's bounty, *The
      Captain's Ledger*);
    - the last rank, around the Standard, when the Standard of the Third Legion falls in the
      barrows' third-floor hall.
    With the Standard down the line breaks, the road opens, and the carts run again.
  - **Putting them down is the only relief anyone has brought them.** The Chronicle (§7) is how
    the player learns this: Standing Order 14, the muster roll, the dispatch that was never sent.
    Thornwick's people say it plainly, without knowing why it's so: *"They just stand there. Facing
    north. Like they're waiting for somebody."*
- **Bows and crossbows (v1.10).** The Vale's hedgerows are old yew, planted by the legions to
  keep cattle off the road. Everyone in the Vale has strung a bow from them at some point, mostly
  for Lord Pellam's deer, which is why it's illegal.
  - The **hunting bow** is the poacher's: short, quick and quiet, and it fits under a coat.
  - The **yew longbow** is Greyholt work. The fletchers there cut a stave for a year before they
    string it, and charge like it.
  - **Crossbows** are the Redhand's. A crossbow can be taught in an afternoon; a bow takes years,
    and the Company doesn't keep anyone that long. A good rogue uses whichever one they've got.
- **Look:** `plain` and `earth` variants; flagstone keeps and cobble barrows. Biome: *Dreadforge*.
- **Enemies:** Redhand bandits and cutpurses, Ashbound minions, grave rats.

### 3.2 The Greywater Fens: levels 8–15 · Act II
Reed-choked marsh around a drowned imperial canal. There's fog every morning, and the lanterns
on the stilt-houses never go out.
- **Town:** **Saltmere**, the stilt town of eel-fishers and smugglers: *The Drowned Eel*, *The Stilt
  House*, *Saltmere Chandlery*, the *Chapel of the Grey Sisters*. **Reedholm** (the Sisters'
  hermitage) is an overland landmark.
- **Sites:** the **Drowned Abbey**, the **Sickpools** (imperial alchemy vats, still leaking),
  Toadking's Mound and the Canal Locks.
- **Look:** `water` and `poison` variants; temple-checker abbeys and cavern pools. Biome: *Sickpools*.
- **Enemies:** Cinder Cult acolytes, fen ghouls, Ashbound rogues, bog-witches.

### 3.3 The Cinder Reach: levels 15–22 · Act III
Black hills of slag and the imperial foundries. Someone has lit the furnaces again.
- **Town:** **Ashgate**, a hard mining town under the Deepdelvers' charter: *The Slag & Bellows*,
  *Deepdelver's Rest*, *The Ashgate Forge*, the *Shrine of the Last Flame*. **Kell's Rest** (a
  waystation in a dead volcano's shadow) is an overland landmark.
- **Sites:** the **Cinderworks**, the **Magma Vault**, the Forgehall of Oruth and the Slag Tunnels.
- **Look:** `lava` and `rock` variants; rune plates in the forges and cavern tunnels. Biomes:
  *Cinderworks*, *Magma Vault*, *Barren Waste*.
- **Enemies:** Ashbound warriors, forge-wights, Cult furnace-priests, cinder hounds.

### 3.4 The Pale Heights: levels 22–30 · Act IV
Frozen passes above the crater where the Ember was found. The air hums.
- **Town:** **Frosthold**, the last outpost, a monastery turned fortress: *The Frozen Flagon*,
  *Pilgrims' Hall*, *Frosthold Outfitters*, *The Monastery Chapel*.
- **Sites:** the **Glass Keep**, the **Soulcracks** (a canyon split by the Fall), and the
  pilgrims' stair.
- **Look:** `ice` and `rock` variants; cavern and flagstone. Biome: *Soulcracks*.
- **Enemies:** Ashbound mages and elite legions, frost revenants, the Cult's inner circle.

### 3.5 The Ember Throne: finale, level 30+
The imperial palace, half-swallowed by the crater, with rune plates everywhere and the dark
pit where the Ember burned. Look: `runeplate`, with lava and soul glows.

### 3.6 The overland
Regions link by roads (safe-ish, with random encounters), trails (faster but more dangerous)
and a few hidden paths unlocked by lore (§7). The map starts fogged, and discovered places stay
revealed, the same model as the dungeon minimap. The main roads are Solmere work, laid for
marching dead: they run straight through anything in the way, hill, bog or village.

---

## 4. Factions

| Faction | Who | Wants | Role |
|---|---|---|---|
| **The Lantern Guild** | A shabby adventurers' guild with a board in every town | Coin, and renown for its members | **Quest giver.** Its quest board is the mini-quest generator. Guild rank gates regions. In Thornwick the board hangs inside the Tired Mule, by the door (v1.5). Anyone can pin a job to it and the Guild takes a cut of the pay; Maudry reads every one. The jobs pinned there come from people already in canon: Maudry Fenn, the carters, Wendel of the provisions shop, the daughter at Hale & Daughter, the Shrine of the Ember, and Osric Hale for the Watch, when the Watch has the coin. Nobody new is named on it. |
| **The Cinder Cult** | Zealots who believe the Ember was *stolen* and must be relit | To rekindle the Ember Throne | **Main antagonists.** Human enemies, necromancers and the source of the rising dead. |
| **The Ashbound** | The empire's bound dead, waking as the Cult stirs the embers | Nothing. They obey old orders (the Vale's: hold the Wickham road until relieved, §3.1 *The road*). | **The main enemy family.** Four skeleton archetypes plus elites. They glow with the Ember's colours. |
| **The Redhand Company** | Deserters turned bandits | Loot, and to be left alone | Act I human enemies; recurring later as hirelings. |
| **The Grey Sisters** | Healers and archivists in the fens | To preserve the old records | Lore keepers. Source of the **Cleric** class (their clerics walk the Vale roads in off-white vestments with a flanged mace and a chained psalter, and some take coin at a tavern) and, later, the **Healer**. |
| **The Deepdelvers** | Miners' charter in the Cinder Reach (dwarf-folk) | To reopen the old seams | Neutral traders; the smith upgrades. |
| **Lord Pellam's Watch** | Greyholt's underpaid militia | Order, cheaply | Bounties; comic relief; occasionally brave. |

**Sellswords and the Guild's ranks (v1.11).** The sellswords at a tavern table are the Lantern
Guild's members, and the Guild hires them out. They change every day: some move on and new ones
walk in off the road. Hiring one means paying the Guild a signing fee up front, then the
sellsword's wage every morning. The Guild ranks its members by a lamp they can carry:
- **Wick:** new, never been lit. Cheap, and mostly what they say they are.
- **Lamp:** a few seasons on the road and still alive, which says something.
- **Lantern:** known in more than one town. They've learned a trick or two they don't mention
  until they trust you.
- **Beacon:** a name people in the Vale would recognise. Rare, dear, and worth it.

Wages are paid at dawn, wherever the company is. A sellsword who isn't paid still fights: the
Guild's rules say so, and it's bad for business otherwise. But they do the job and nothing past
it, and whatever they're good at for, they keep to themselves until they're paid. A sellsword
who stays with a company long enough, paid and kept alive, may come to stay for the company and
not the coin. The Guild calls them **Sworn** and takes a smaller cut.

Found companions (Brannoc, §5) aren't Guild members and take no wage.

The Guild doesn't send its seasoned members out with strangers. Whoever you sign on has about
half your seasons on the road, whatever their rank says about what they can do, and they learn
the rest at your side (v1.12). Maudry's way of putting it: *"The good ones are spoken for. The
ones I've got will be good. Give them a month."*

**Peoples:** mostly humans, plus stout **Deepdelver** dwarf-folk in the hills, a few **fen-folk**
halflings in the marsh, and rare, aloof elves passing through. Standard fantasy, lightly used.

---

## 5. Key characters

- **Maudry Fenn**, keeper of *The Tired Mule* in Thornwick. She's the player's first contact,
  knows everyone's business, and tells you more than she should. She keeps a pewter mug in her
  hand and a dress the colour of old mustard. What she lets slip (v1.3): Lord Pellam answered
  Thornwick's plea for help with a three-page letter nobody can read as a yes; the Watch posts
  bounties only when it has coin; a Grey Sister usually sits in the Mule's corner, for hire;
  at Hale & Daughter "it's the daughter you want"; Wendel's lamp oil keeps going up. Her
  errand (v1.4): since the barrows opened, the carters won't take the barrows road and go the
  long way round, a day out of their way, and the price of everything she pours goes up with
  it. She pays to have the walking kind knocked back (*The Long Way Round*).
- **Warden-Captain Osric Hale**, Greyholt's watch. He's honest and tired, and posts the bounties.
  (v1.6) Since the barrows opened he keeps a Watch post in Thornwick: a table by the square's
  well, a ledger and Jory. When Pellam's coin is late, which is always, he pays the bounty on the
  bright-eyed ones out of his own purse and writes it down.
- **Brannoc**, a Redhand deserter and the first **found companion** (fighter), met chained in
  Wickham Keep. (v1.7) He tried to leave the Company twice. Captain Garrow kept him chained in
  the Keep's hall as an example to the others, and fed him when he remembered to. (v1.12) Months
  on a chain took the edge off him: he joins about half as seasoned as you, and gets it back fast.
  Big, slow to
  talk and quick to apologise, he wants to find out who paid the Company to dig, then to see the
  legion in the barrows that never deserted anything.
  His chain, *Chains of the Redhand*, ends with the heirloom *The Broken Chain* — *"He kept one
  link."*
  (v1.8) Its three parts: *Old Debts*, Garrow's sergeants, who kept his chain oiled and say he still
  owes them; *The Paymaster's Box*, the Company paymaster's two chests in the Tithe Mill (he trusted
  nobody, himself included), where every purse of the robes' coin is sealed in coal-red wax with no
  crest in it, only a thumbprint; and *Standing Down*, where he stands five waves in the Old Barrows
  beside the legion that never deserted anything. He found the key to his chain on Garrow and
  hadn't used it when you came in. He joins your company there.
- **Captain Garrow** (v1.7), captain of the Redhand Company. He collects: tolls, tithes, debts,
  and men who owe him. The robed strangers' coin made him careless.
  (v1.16) He wears no helmet: he wants to be recognised when he collects. Dark hair going back, a goatee,
  a scar, and a gold ring in one ear that was someone else's.
- **The Robed Stranger** (v1.7), a Cinder Cult acolyte who pays for the digging at the Sunken
  Chapel. He never gives a name, and dies with an ember-shard in his fist.
  (v1.16) He wears the Cult's charcoal robe with its ember trim, and carries the ember-shard openly, lit,
  in his free hand: the one he dies holding.
- **Wren**, a Saltmere smuggler and **found companion** (rogue) who owes the Cult money.
- **Sister Ilse**, a Grey Sister archivist. She keeps the Chronicle (§7) and is the future
  **Healer** unlock. (v1.6) Reedholm sent her up to the Shrine of the Ember in Thornwick to copy
  whatever comes up out of the barrows. She pays in blessings, trusts nothing she hasn't read
  twice, and hates guesswork more than the dead.
- **The Kindler** (Master Corvane Vell), voice of the Cinder Cult. He's charismatic, sincere,
  and wrong. He appears through the arc and is the final boss at the Ember Throne.
- **Empress Aurelle Solmere**, dead 300 years. She is heard only through fragments, and is the
  heart of the secret.

**Thornwick's townsfolk (v1.6).** Short, earthy names (§9). Each keeps to their own business
around the square by day and somewhere else by night:
- **Wendel**, of Wendel's Provisions: rope, bread and lamp oil. He blames the roads for his
  prices, and the roads blame him.
- **Bess Hale**, the daughter at Hale & Daughter, Smiths, who does the work. She is no relation
  to the Captain, as both of them will tell you at once.
- **Col**, a carter. He took the long way round the barrows for a month and wants it known.
- **Jory**, the Watch's only man in Thornwick: young, earnest, and Osric's runner.
- **Nell Tolley**, keeper of the Crossed Keys. She charges for the stairs, not the bed.
- **Hedda**, who sells eggs by the well and knows the weather, and says she knows nothing else.

(v1.14) **What they carry.** Wendel walks the square with a lit lantern; Bess wears her leather apron and
keeps her hammer in hand; Col has his carter's whip; Nell Tolley carries the Crossed Keys' keys on an iron
ring; Hedda carries her eggs in a basket; Maudry has her pewter mug.

(v1.15) **How they look.** Lord Pellam's Watch dresses cheaply: Osric wears dull iron that was never
polished for anyone, and Jory, who is young, wears boiled leather and carries the Watch's one good sword.
They aren't one size. Jory is the tallest in the square, Bess Hale is nearly as tall, and Hedda and Nell
Tolley are the smallest; Brannoc stands taller than any of them.

**Who teaches the trials (v1.7).** At level 6 each class has a trial in Thornwick: **Osric Hale**
for fighters (*Hold the Keep Gate*), **Nell Tolley** for rogues (*Quiet Feet*; she was something
else before she kept an inn, and won't say what), **Hedda** for mages (*Cold Weather*; the weather
listens to her) and **Sister Ilse** for clerics (*Last Rites*).

---

## 6. The main arc (four acts)

The main arc is a light **chapter spine**. Each act unlocks when the region's renown threshold
is met (see the GDD). Mini-quests fill the space between chapter beats and drip-feed the story.

1. **Act I — Smoke over the Vale.** Bandits are raiding the Tithe Mill. Chasing them into
   Wickham Keep reveals they're paid by robed strangers to *dig*. The Old Barrows open, the
   Ashbound walk, and a Cult acolyte dies with a strange ember-shard in his fist. (v1.7: the
   barrows opened before the game begins. The chapters run: the Tithe Mill for Maudry; Wickham
   Keep and Captain Garrow for Osric; then the Sunken Chapel, where the Robed Stranger dies with
   the shard, which goes to Sister Ilse.)
2. **Act II — The Drowned Abbey.** The shard leads to the fens. The Cult is draining the
   Sickpools and "harvesting" drowned souls at the Drowned Abbey. The Grey Sisters hold records
   the Cult wants burned. You save some of them.
3. **Act III — Relighting the Forges.** The Cult has lit the Cinderworks to forge a vessel
   for a new flame. As the forges roar, the Ashbound across the province grow stronger and
   organize. You break the Forgehall of Oruth, but the vessel is already gone, north.
4. **Act IV — The Throne of Embers.** At the Glass Keep, the final fragments reveal the secret:
   Aurelle put the Ember out on purpose. At the Ember Throne the Kindler lights the vessel.
   Defeat him, and choose to snuff the new flame as she did. A later option is to keep it,
   which would enable post-game content and a darker ending.

**Post-game:** the Undervaults beneath the Throne go on forever. This is the endless-depth grind,
and it maps directly to the engine's descent levels.

---

## 7. Discoverable history: the Chronicle of the Fall

Lore is **lite and optional**, but it pays off.
- **Fragments** are found in chests, on shrines, as rune-plate inscriptions and from bosses.
  They're one to three sentences each: a legion's standing order, a forge ledger, a nun's
  confession, a letter from the Empress.
- There are ~10 per region and ~45 in total. Each one is a **journal entry** in the
  *Chronicle*, kept by Sister Ilse.
- **Completing a region's set** reveals a **hidden site** (a secret vault with a guaranteed
  heirloom) and a region epilogue.
- Fragments are placed deterministically from the world seed, so two players with different
  seeds find them in different places and in a different order. The *truth* they add up to is
  the same.

Sample fragments:
- *"Standing order 14: the Third Legion holds the Wickham road until relieved. — Stamped by
  the Ember Throne, Year 612."* (Found in the Old Barrows. They are still holding it.)

**The Vale set, the first three (v1.6).** All three are found in the Old Barrows:
1. **Standing Order 14** (the line above), in one of the barrows' chests on the first floor.
2. *"Muster roll, Third Legion, second cohort, at the Wickham road: two hundred and forty bound,
   two hundred and forty present. There are never absences."* At a shrine on the second floor.
3. *"The bound dropped where they stood at the second watch. The living asked me what now. I told
   them: hold the road until relieved. — a centurion's tablet"* In the stairs-down hall of the
   second floor, for whoever holds that hall long enough to look.

Together they say that the dead in the barrows are a legion still following its last order.
Nobody ever came to relieve them. Sister Ilse reads them in that order.

**The rest of the Vale set (v1.7).** Ten in all. The last one found reveals the Ninth Milestone.
4. **The Tithe Ledger**, in a chest in the Tithe Mill: *"Tithe of the Vale, Year 612: grain, four
   hundred measures. Souls, two hundred and forty. Paid in full to the Ember Throne."*
5. **A Gate-Warden's Note**, at a shrine in Wickham Keep: *"Relief column expected by the harvest
   moon. Keep the road open. Keep the lamps lit."*
6. **The Last Dispatch**, in Wickham Keep's second-floor hall: *"To the Third Legion at the
   Wickham road: the Throne is dark. No relief will come. Stand down."* Sealed, and never sent.
7. **A Chaplain's Prayer**, in a chest in the Sunken Chapel: *"Bind them gently. Most of them
   volunteered."*
8. **The Binding Rite**, at a shrine on the Chapel's second floor: *"Speak the order last. The
   bound keep the last thing they hear."*
9. **The Chaplain's Last Page**, in the Chapel's second-floor hall: *"The Throne went dark
   tonight. I cannot bind a second order over the first. Forgive me."*
10. **The Standard's Ribbon**, taken from the Standard of the Third Legion when it falls:
   *"Third Legion. Wickham road. Until relieved."*

(v1.8) **Who holds them.** Captain Garrow kept the Last Dispatch with his ledgers, its seal
unbroken; it's found when he falls. The Chaplain's Last Page lies in the chapel hall where the Robed
Stranger was digging, and is found when he falls. The Standard's Ribbon is on the Standard.

The **Ninth Milestone's** vault holds the heirloom *The Last Order* — *"It says: hold. It doesn't
say for how long."*
- *"Furnace nine requires eleven more souls per week to meet quota."* (A Cinderworks ledger.)
- *"Forgive me. They will call it the Fall. Let them. — A."* (Glass Keep, last of the set.)

**Loading tips** (`content/tips.json`) alternate a line of lore with a one-liner. The lore lines
state only facts from this doc (the standing order above, the flare-seams in §10.1, the roads
in §3.6, Maudry in §5); the one-liners are the wry voice (§1) and state nothing new.

---

## 8. Bestiary families

| Family | Region | Archetypes (current art) | Notes |
|---|---|---|---|
| **Ashbound** | all | Minion, Warrior, Rogue, Mage (the KayKit skeletons) | Eye glow reads their rank. Weak to Cleric *Turn Undead*. |
| **Redhand** | Hollow Vale | Cutthroat, Brute, Crossbowman (recoloured hero models) | Human bandits; can surrender. Their elites are Sergeants (v1.7). |
| **Cinder Cult** | Fens → Throne | Acolyte (cultist), Necromancer, Furnace-priest | Raise and buff Ashbound; priority targets. (v1.16) Acolytes shave their heads and wear charcoal with ember trim. |
| **Beasts** | varies | Grave rats, fen ghouls, cinder hounds, frost revenants | New art needed later. |
| **Bosses** | per site | Redhand Captain (Captain Garrow, Wickham Keep; heirloom *Garrow's Due* — "He collected. Everyone paid."), the Robed Stranger (the Sunken Chapel, v1.7), the Abbess Below, Oruth the Forgemaster, **the Glass Legate** (v1.1), the Kindler | One per major site, each with one signature mechanic. **The Glass Legate** is the Ashbound officer Aurelle left to guard her last letter in the Glass Keep. It still obeys an order nobody alive remembers giving. |

---

## 9. Naming style guide

- **Places** are plain English compounds with a worn edge: Thornwick, Greyholt, Saltmere,
  Ashgate, Kell's Rest. Imperial ruins use grand Latinate names: Solmere, Aurelle, Oruth.
- **People** have short, earthy names (Brannoc, Wren, Maudry, Osric), and nobles get an extra
  syllable they don't deserve.
- **Items** are plain at low rarity ("Iron Sword"). Heirlooms carry a name and a line of history:
  *Hale's Last Watch — "The Captain's grandfather held Greyholt's gate with this for a night
  and a day."*
- **Avoid** chosen ones, prophecies, dark lords and anything with an apostrophe in the middle.

---

## 10. Ember Rifts and region bosses (v1.1)

### 10.1 Ember Rifts
- **What they are:** when the Cinder Cult stokes the old forges, echoes of the Ember flare
  inside sealed imperial vaults. For a few days a **Rift** burns open with the old light:
  - the Ashbound inside stand straighter;
  - the vault's hoard is *kindled*;
  - then the flare gutters and the vault seals again.
- **Who knows:** the Deepdelvers call them "flare-seams". The Grey Sisters record each one.
- **The secret they hint at:** the Ember was never truly gone (§2).
- **Loot names:**
  - Kindled items carry the prefix *Kindled*, or a vault name: *of the Ninth Vault*.
  - Affixes speak of warmth, hunger and the dead: *"Warm to the touch, and hungry."*

### 10.2 Region bosses
Optional, repeatable foes, each drawn from a fragment of the Chronicle (§7):

| Region | Boss | From the history | Heirloom line (example) |
|---|---|---|---|
| Hollow Vale | **The Standard of the Third Legion** | *Standing order 14*: the legion still holds the Wickham road until relieved | *The Relief — "Somebody finally came."* |
| Greywater Fens | **The Drowned Choir** | The Abbey's sisters, drowned at their office, still singing under the water | *Vespers — "Sung in water, heard in bone."* |
| Cinder Reach | **Furnace Nine** | *"Furnace nine requires eleven more souls per week to meet quota."* It learned to feed itself. | *Quota — "It always asked for more."* |
| Pale Heights | **The First Pilgrim** | The pilgrim who found the Ember in the crater, bound in ice at its lip | *First Light — "It was beautiful. That was the trouble."* |

---

## 11. Origins and dialogue voice (v1.1)

**Origins** (chosen at creation; GDD §6.1):

| Origin | Background |
|---|---|
| *Thornwick-born* | Grew up above a shop on the square. Maudry Fenn knew your mother. |
| *Redhand deserter* | Walked away from the Company with a sword and a grudge. |
| *Ward of the Grey Sisters* | Raised among the archives at Reedholm. |
| *Deepdelver-fostered* | A human child raised by a Deepdelver clan in the Reach. |

**Dialogue voice for writers:**
- **Plain words:** short sentences, and characters complain about practical things (tax,
  weather, the price of lamp oil) while the dead walk.
- **Nobles overreach:** Lord Pellam uses three words where one would do.
- **Point, don't explain:** nobody explains the past. They mention it sideways, and the
  Chronicle holds the pieces.
- **The dead as trouble:** the Ashbound are ordinary trouble, *"the walking kind"*, never
  cosmic horror.
- **Reactivity:** every named NPC has at least one line for your origin, one for a slain
  companion, and one for each region fragment set.
- **Banned:** no prophecies, no chosen ones, no winks at the player, and no apostrophes in the
  middle of names.

