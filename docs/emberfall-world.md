# Emberfall — World Summary

**v1.2 · 2026-09-29 · Companion to [emberfall-gdd.md](./emberfall-gdd.md).**

v1.2 changes the pitch to *"The heroes of this age are not available… Looks like it is up to you."*
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
  Sunken Chapel and the Tithe Mill.
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
| **The Lantern Guild** | A shabby adventurers' guild with a board in every town | Coin, and renown for its members | **Quest giver.** Its quest board is the mini-quest generator. Guild rank gates regions. |
| **The Cinder Cult** | Zealots who believe the Ember was *stolen* and must be relit | To rekindle the Ember Throne | **Main antagonists.** Human enemies, necromancers and the source of the rising dead. |
| **The Ashbound** | The empire's bound dead, waking as the Cult stirs the embers | Nothing. They obey old orders. | **The main enemy family.** Four skeleton archetypes plus elites. They glow with the Ember's colours. |
| **The Redhand Company** | Deserters turned bandits | Loot, and to be left alone | Act I human enemies; recurring later as hirelings. |
| **The Grey Sisters** | Healers and archivists in the fens | To preserve the old records | Lore keepers. Source of the **Cleric** class (their clerics walk the Vale roads, and some take coin at a tavern) and, later, the **Healer**. |
| **The Deepdelvers** | Miners' charter in the Cinder Reach (dwarf-folk) | To reopen the old seams | Neutral traders; the smith upgrades. |
| **Lord Pellam's Watch** | Greyholt's underpaid militia | Order, cheaply | Bounties; comic relief; occasionally brave. |

**Peoples:** mostly humans, plus stout **Deepdelver** dwarf-folk in the hills, a few **fen-folk**
halflings in the marsh, and rare, aloof elves passing through. Standard fantasy, lightly used.

---

## 5. Key characters

- **Maudry Fenn**, keeper of *The Tired Mule* in Thornwick. She's the player's first contact,
  knows everyone's business, and tells you more than she should.
- **Warden-Captain Osric Hale**, Greyholt's watch. He's honest and tired, and posts the bounties.
- **Brannoc**, a Redhand deserter and the first **found companion** (fighter), met chained in
  Wickham Keep.
- **Wren**, a Saltmere smuggler and **found companion** (rogue) who owes the Cult money.
- **Sister Ilse**, a Grey Sister archivist. She keeps the Chronicle (§7) and is the future
  **Healer** unlock.
- **The Kindler** (Master Corvane Vell), voice of the Cinder Cult. He's charismatic, sincere,
  and wrong. He appears through the arc and is the final boss at the Ember Throne.
- **Empress Aurelle Solmere**, dead 300 years. She is heard only through fragments, and is the
  heart of the secret.

---

## 6. The main arc (four acts)

The main arc is a light **chapter spine**. Each act unlocks when the region's renown threshold
is met (see the GDD). Mini-quests fill the space between chapter beats and drip-feed the story.

1. **Act I — Smoke over the Vale.** Bandits are raiding the Tithe Mill. Chasing them into
   Wickham Keep reveals they're paid by robed strangers to *dig*. The Old Barrows open, the
   Ashbound walk, and a Cult acolyte dies with a strange ember-shard in his fist.
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
| **Redhand** | Hollow Vale | Cutthroat, Brute, Crossbowman (recoloured hero models) | Human bandits; can surrender. |
| **Cinder Cult** | Fens → Throne | Acolyte (cultist), Necromancer, Furnace-priest | Raise and buff Ashbound; priority targets. |
| **Beasts** | varies | Grave rats, fen ghouls, cinder hounds, frost revenants | New art needed later. |
| **Bosses** | per site | Redhand Captain, the Abbess Below, Oruth the Forgemaster, **the Glass Legate** (v1.1), the Kindler | One per major site, each with one signature mechanic. **The Glass Legate** is the Ashbound officer Aurelle left to guard her last letter in the Glass Keep. It still obeys an order nobody alive remembers giving. |

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
- **Reactivity:** every named NPC has at least one line for your origin, one for a Fallen
  companion, and one for each region fragment set.
- **Banned:** no prophecies, no chosen ones, no winks at the player, and no apostrophes in the
  middle of names.

