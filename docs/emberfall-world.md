# Emberfall — World Summary

**v1.0 · 2026-09-28 · Companion to [emberfall-gdd.md](./emberfall-gdd.md).** This is the
narrative spine: the history, places, factions and main arc that quests, dungeons, enemies and
loot all hang from. The quest generator reads its tables (regions, sites, factions, hooks), so
names and facts here are **canon for content**. Change them here first.

---

## 1. The pitch

> The heroes of this age are off saving kingdoms. You got the Marches.

**Emberfall** is the forgotten backwater of a fallen empire. It's a second-rate province of
mud roads, tired militias, half-flooded abbeys and ruins nobody famous bothers to loot. The
tone is the **classic D&D paperback**: sellswords in a tavern, a quest board and a rumour
about a barrow. There's a map with blank corners and a dungeon under the keep. It's earnest,
a little grim, occasionally wry, and never epic at the start. You are nobody. By the end the
Marches will tell stories about you, even if the rest of the world never hears of them.

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
| **The Solmere Empire** | ~900–300 years ago | The **Ember Throne** is built around the flame. Its **Ashbound**, legions of bound dead, dig the Undervaults, stoke the forges and never tire. The Marches are the empire's mines and granaries. |
| **The Fall** | ~300 years ago | In one night the Ember goes out. The Ashbound drop where they stand, the forges go cold and the empire tears itself apart within a generation. The event gives the land its name. |
| **The Long Dim** | 300 years → now | The Marches become a backwater with petty lords, a trade road and nothing more. The ruins are "haunted", which is to say *quiet*. |
| **Now** | Year 301 of the Dim | Smoke rises from the old forges. Barrows are opening. The dead are standing up again, and nobody important is coming to help. |

**The secret (Act IV reveal).** The Ember did not fail. **Empress Aurelle Solmere put it out
herself.** She learned that the flame didn't just bind the dead; it *burned the living's
souls as fuel*. The Fall was a sacrifice, and the empire's collapse was the price. The only
record is scattered in fragments that the Cinder Choir has spent 300 years trying to destroy.

---

## 3. The land: four regions and a throne

Each region is a difficulty tier, a set of tile variants and biomes (the engine's
`?tiles=&tv=` language), an enemy mix and a chapter of the main arc. Towns are small: a
tavern, a smith, a shrine and the Lantern Guild's quest board.

### 3.1 The Hollow Marches: levels 1–8 · Act I
Rolling farmland, hedgerows and the barrows of the old legions. It's the safest region, and
it's where everyone starts.
- **Towns:** **Thornwick** (start village, crossroads inn *The Tired Mule*) and **Greyholt**
  (walled market town, seat of the useless Lord Pellam).
- **Sites:** the Old Barrows (crypts), **Wickham Keep** (a ruin the Redhand bandits hold), the
  Sunken Chapel and the Tithe Mill.
- **Look:** `plain` and `earth` variants; flagstone keeps and cobble barrows. Biome: *Dreadforge*.
- **Enemies:** Redhand bandits and cutpurses, Ashbound minions, grave rats.

### 3.2 The Greywater Fens: levels 8–15 · Act II
Reed-choked marsh around a drowned imperial canal. There's fog every morning, and the lanterns
on the stilt-houses never go out.
- **Towns:** **Saltmere** (stilt town of eel-fishers and smugglers) and **Reedholm** (a
  hermitage of the Grey Sisters).
- **Sites:** the **Drowned Abbey**, the **Sickpools** (imperial alchemy vats, still leaking),
  Toadking's Mound and the Canal Locks.
- **Look:** `water` and `poison` variants; temple-checker abbeys and cavern pools. Biome: *Sickpools*.
- **Enemies:** Cinder Choir acolytes, fen ghouls, Ashbound rogues, bog-witches.

### 3.3 The Cinder Reach: levels 15–22 · Act III
Black hills of slag and the imperial foundries. Someone has lit the furnaces again.
- **Towns:** **Ashgate** (a hard mining town under the Deepdelvers' charter) and **Kell's Rest**
  (a waystation in a dead volcano's shadow).
- **Sites:** the **Cinderworks**, the **Magma Vault**, the Forgehall of Oruth and the Slag Tunnels.
- **Look:** `lava` and `rock` variants; rune plates in the forges and cavern tunnels. Biomes:
  *Cinderworks*, *Magma Vault*, *Barren Waste*.
- **Enemies:** Ashbound warriors, forge-wights, Choir furnace-priests, cinder hounds.

### 3.4 The Pale Heights: levels 22–30 · Act IV
Frozen passes above the crater where the Ember was found. The air hums.
- **Towns:** **Frosthold** (last outpost, a monastery turned fortress).
- **Sites:** the **Glass Keep**, the **Soulcracks** (a canyon split by the Fall), and the
  pilgrims' stair.
- **Look:** `ice` and `rock` variants; cavern and flagstone. Biome: *Soulcracks*.
- **Enemies:** Ashbound mages and elite legions, frost revenants, the Choir's inner circle.

### 3.5 The Ember Throne: finale, level 30+
The imperial palace, half-swallowed by the crater, with rune plates everywhere and the dark
pit where the Ember burned. Look: `runeplate`, with lava and soul glows.

### 3.6 The overland
Regions link by roads (safe-ish, with random encounters), trails (faster but more dangerous)
and a few hidden paths unlocked by lore (§7). The map starts fogged, and discovered places stay
revealed, the same model as the dungeon minimap.

---

## 4. Factions

| Faction | Who | Wants | Role |
|---|---|---|---|
| **The Lantern Guild** | A shabby adventurers' guild with a board in every town | Coin, and renown for its members | **Quest giver.** Its quest board is the mini-quest generator. Guild rank gates regions. |
| **The Cinder Choir** | A cult that believes the Ember was *stolen* and must be relit | To rekindle the Ember Throne | **Main antagonists.** Human enemies, necromancers and the source of the rising dead. |
| **The Ashbound** | The empire's bound dead, waking as the Choir stirs the embers | Nothing. They obey old orders. | **The main enemy family.** Four skeleton archetypes plus elites. They glow with the Ember's colours. |
| **The Redhand Company** | Deserters turned bandits | Loot, and to be left alone | Act I human enemies; recurring later as hirelings. |
| **The Grey Sisters** | Healers and archivists in the fens | To preserve the old records | Lore keepers. The future **Cleric and Healer** class source. |
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
- **Wren**, a Saltmere smuggler and **found companion** (rogue) who owes the Choir money.
- **Sister Ilse**, a Grey Sister archivist. She keeps the Chronicle (§7) and is the future
  **Cleric** unlock.
- **The Kindler** (Master Corvane Vell), voice of the Cinder Choir. He's charismatic, sincere,
  and wrong. He appears through the arc and is the final boss at the Ember Throne.
- **Empress Aurelle Solmere**, dead 300 years. She is heard only through fragments, and is the
  heart of the secret.

---

## 6. The main arc (four acts)

The main arc is a light **chapter spine**. Each act unlocks when the region's renown threshold
is met (see the GDD). Mini-quests fill the space between chapter beats and drip-feed the story.

1. **Act I — Smoke on the Marches.** Bandits are raiding the Tithe Mill. Chasing them into
   Wickham Keep reveals they're paid by robed strangers to *dig*. The Old Barrows open, the
   Ashbound walk, and a Choir acolyte dies with a strange ember-shard in his fist.
2. **Act II — The Drowned Choir.** The shard leads to the fens. The Choir is draining the
   Sickpools and "harvesting" drowned souls at the Drowned Abbey. The Grey Sisters hold records
   the Choir wants burned. You save some of them.
3. **Act III — Relighting the Forges.** The Choir has lit the Cinderworks to forge a vessel
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

---

## 8. Bestiary families

| Family | Region | Archetypes (current art) | Notes |
|---|---|---|---|
| **Ashbound** | all | Minion, Warrior, Rogue, Mage (the KayKit skeletons) | Eye glow reads their rank. Weak to Cleric *Turn Undead*. |
| **Redhand** | Marches | Cutthroat, Brute, Crossbowman (recoloured hero models) | Human bandits; can surrender. |
| **Cinder Choir** | Fens → Throne | Acolyte (cultist), Necromancer, Furnace-priest | Raise and buff Ashbound; priority targets. |
| **Beasts** | varies | Grave rats, fen ghouls, cinder hounds, frost revenants | New art needed later. |
| **Bosses** | per site | Redhand Captain, the Abbess Below, Oruth the Forgemaster, the Kindler | One per major site, each with one signature mechanic. |

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
