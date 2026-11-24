# Progression: what the game keeps of a player's climb

**Current (2026-11-24): the tracking list.** The owner asked to track the progression features as one list, for example:

- the World map's vertical climb of the regions;
- three stars a dungeon;
- downing waves to open gates;
- the Mere Tower;
- and the new rule: "once a player has defeated a quest/dungeon boss, then they can join raids for that dungeon".

This doc lists every system that keeps a player's progress. For each one it gives:

- what it records;
- how it's earned;
- what it opens;
- where the player sees it;
- where it lives in the save and the code.

Add a row whenever a system is added or changed, and keep the GDD's rules the source of the numbers.

All of it follows the fair-play rule (AGENTS.md rule 3): progress comes only out of the sim's own rules, is saved
through `snapshot()` / `restore()`, and replays exactly. The Developer panel's tools are the one way around it, and
they mark the slot a dev game.

## The systems

| # | System | What it records | How it's earned | What it opens | Where you see it | Save · code | Status |
|---|---|---|---|---|---|---|---|
| 1 | **Hero level** | Each member's level and XP, 1–75 (the XP table runs to 75 since v1.148) | XP from fights, quests, the board, the Chronicle, raids, region bosses | Stat points (3 a level), a skill point every even level, the skill ladder below, every level gate below | The party cards, the character window | `party[].level/xp` · `party.js` XP_TABLE, gainXp | Built |
| 2 | **Skill ladder** | The abilities and passives each member has open | A new skill every 3 levels, a passive every third (9/18/27, with ranks). The class trials at 6, 12 and 24 open each tier | Up to four active skills in the loadout | The Skills tab; a card when a trial is handed in | `trials`, member `skills`/`loadout` · `skills.js`, `quests.js` | Built |
| 3 | **The story (acts and chapters)** | Each quest's state and step | Playing the chapters: Act I (the Vale), Act II (the Fens), Act III (the Reach) | **The lands:** the Fens after Act I, the Cinder Reach after Act II, the Tidemark after Act III (*Quota*, v1.150; its first chapters *Consigned* and *Low Water* in the Drowned Mole, then *Letters of Marque* on the Gull Isles and *The Keeper's Light* at the Lamp Fort, v1.151), the Pale Heights after Act IV (v1.150; opened after Act III in v1.148, and kept by a company that stood in Frosthold then). Hidden sites. Companions found | The Journal; the tracker under the top bar | `quests` · `quests.js`, `regions.js` LANDS.opens | Built (Acts I–III; Act IV under way) |
| 4 | **The World map's climb** | Which lands are open, the hero's level against each land's band | Opening a land (3); levelling (1) | — (it shows progress, it gates nothing) | The World tab: the lands climb bottom to top by level, fog over the shut and the unbuilt, "opens from level N" on a land not open. (2026-11-24, the owner: the level rail at the side removed; the hero's level is on the party card) (v1.148, the owner: no star tally under an open land's name) | read from 1, 3, 6 · `ui/worldmap.js`, `ui/wallmap.js` CLIMB | Built |
| 5 | **Towns reached** | The towns stood in | Walking into a town | The Guild's coach to it | The coach's card; the World map's stops | `reached` · `coach.js` | Built |
| 6 | **Dungeon stars** | Each dungeon's best: stars 0–3, best time, clean or not, runs | 1 star cleared; 2 under par; 3 fast with nobody down | — (a record, pays nothing) | Three stars beside each dungeon on the World map and its land tab; the run timer in a dungeon | `stars` · `stars.js`, GDD §10 v1.143 | Built |
| 7 | **Dungeon gates** | Each floor's gates opened, for good, per slot | Holding `GATE_WAVES` (10) waves in one visit of the room before the gate (GDD v1.70, v1.118 a gate a room) | The way on to the next room or the floor's hall | The gate in the dungeon; the wave pill counting to it | `gates` · `world.js` gatesOf, GATE_WAVES | Built |
| 8 | **Bosses put down** | Each boss's kills | Beating him in his hall (or on the Tower's landings) | The story's next beat (a story boss's first fall), his heirloom, a found companion freed; **the dungeon's raid** (v1.149, below) | The boss bar and banner; the Journal | `bosses` · `battle.js`, `core.js` bossVars | Built |
| 9 | **Raids** | The day's raids used, raids won, coffers since a Rare | Party Up: a band dungeon run with an end, three a day | **v1.149:** a dungeon's raid opens once its last boss is down in play (8), as well as its land open, its way in found and the hero at its level | Party Up's list (each row says why it's shut); the raid's end card | `raid` · `raid.js` raidSites | Built; the boss gate new in v1.149 |
| 10 | **The Mere Tower** | The climb's wave, best wave, landing, satchel, the wardens' heirlooms won | Climbing its landings, from level 12 | Heirlooms at the wardens; the satchel banked at a landing | ☰ → The Mere Tower; the landing's card | `tower` · `tower.js` | Built |
| 11 | **Region bosses** | Each window stood in, falls, the fastest | Standing against the Kingstone (top of the hour, Fens, from 10), Furnace Nine (half past, Reach, from 25, once its lamp is broken) or the First Pilgrim (half past, Heights, from 61) | Tier pay; each one's heirloom at Gold | The hour's line under the top bar; the fight's bar; the end card; their pins on the World map | `ring` · `ring.js` | Built |
| 12 | **Lamps and souls** | Lamps broken, souls freed | The story's and the sites' lamps (lamps.js) | Furnace Nine's window (the Stoker's lamp) | The Journal | `lampsBroken`, `count` · `lamps.js` | Built |
| 13 | **Hidden sites** | Secret dungeons found | A chapter's reward, or the Chronicle | Their doors on the overland; their vaults' heirlooms. (v1.151) A **side vault** (the Haddow Crypt, the Shuttered Inn, the Lamp Fort) keeps its errand-giver's **keepsake** in its end room, once; then it seals for two hours as a secret does (not while an errand still sends you there) | The land tab's new pin | `revealed`, `secrets`, flags `vault_<site>` · `sites.js` side, `core.js` | Built |
| 14 | **The Chronicle** | Fragments of the Fall found | Found where they lie, in sites and on the lands | XP; some reveal hidden sites | The Journal's Chronicle | `lore` · `lore.js` | Built |
| 15 | **Gear** | Every piece: rarity, the smith's +N, traits, heirlooms | Drops, chests, the shop, the forge's upgrades (to +9, with odds) | Strength for the next band | The bag, the character window; the worn look and the heirloom flourish | `bag`, member `gear` · `items.js`, `smith.js` | Built |
| 16 | **Companions** | Who's hired, in the party or on the bench, their levels and perks | Hiring at a tavern; the found ones freed in the story | A fuller party | The party cards; the tavern | `party`, `bench` · `companions.js`, `heroes.js` | Built |
| 17 | **The Bowl** | Marks, the day's bouts, a Team and an Individual ladder, the day's tourney | Bouts from level 6 | Ranks; the tourney's purse | ☰ → the Bowl's board | `bowl` · `bowl.js` | Built |
| 18 | **Spawn points** | Each camp's clears and when it's full again | Clearing it | — (XP and drops as any fight) | The dotted ring on the overland | `camps` · `camps.js` | Built |

## The rule added in v1.149: a raid opens on its boss

The owner (2026-11-24): *"once a player has defeated a quest/dungeon boss, then they can join raids for that dungeon"*.

A raid runs a band dungeon to its last floor's hall and its boss. Party Up now opens a dungeon's raid only once the
company has put that boss down in play, in the dungeon itself (`state.bosses[boss] > 0`). That's in addition to the
gates it already had: the land open, the way in found, the hero at the dungeon's level.

- **Why:** a raid is a dungeon run again for its better pay. The first time through is the story's and the dungeon's
  own: the gates (7), the stars (6) and the boss's first fall with his heirloom (8).
- **On screen:** a shut row reads *beat the Quartermaster first* (his name), as the others read *from level 6*.
- **In the sim:** `raid.js` raidSites gives the row `why: 'boss'`. The `raidGo` command refuses it with the same words, so
  a client can't skip it.

## Where the progression could go next (not built)

- A **progress screen** gathering this list for the player: each land's dungeons with stars, gates and bosses, the
  Tower's best, the region bosses' records. Today these are spread over the World map, the Journal and the menus.
- **Achievements** read off the same records (every dungeon three-starred in a land, a region boss at Gold).
