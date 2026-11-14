# Shared play: the rules for raids and world events (an analysis)

**Status:** Decided (2026-11-14, §8: the owner's answers to §7). Nothing here is built beyond what §5 says and §9 (the rule set, §6).

**The owner, 2026-11-14:** *"Determine what other different logic we need to accommodate multiplayer raids correctly.. eg
leaving, offline, loot drops, lanterns, .. which would work or not apply vs normal gameplay.. we might need similar rule sets
for thing like a region or world boss event"*.

Raids stage 1 ([party-up-raids-proposal.md](./party-up-raids-proposal.md), GDD §18) runs offline: one player and two
stand-ins in the player's own sim. Live raids (stage 3), and later a region or world boss event, put several players' heroes
in one sim on a server. This walks every system in `src/sim` and says, for each kind of play, whether it works as it is,
needs a rule of its own, or doesn't apply.

---

## 1. What changes when play is shared

The whole game is built on four assumptions that shared play breaks:

1. **One owner.** A slot's sim has one player: one hero steers (`state.player`), one company follows, one bag, one purse,
   one story. Shared play has several owners in one world. Each needs their own hero, bag, purse and story, and
   **nothing one player does may write another's**.
2. **One seed.** A slot's world is built from its own seed. Its dungeons' layouts (`levelSeed`), its overland
   (`createOutdoor(baseSeed)`), where its Chronicle fragments lie and its loot rolls (`counters.lootN`) all come from it.
   Two players' Wickham Keeps are not the same building. A shared world needs a **canonical seed** that every client
   builds from, and personal rolls on streams the server can reproduce for each player.
3. **One clock.** A slot's clock (`state.t`) is the game's day and hour. It drives wages, the tavern and shop stock, the
   board, expeditions, the temple's free raise, the Bowl's day, the raid count, weather and time of day. When the page
   comes back after being away, the sim plays the time away through (`state.away`). A shared room has a clock of its own,
   on the server. It can't pause, it can't be fast-forwarded, and it isn't any one player's.
4. **One authority.** Today the slot's own sim is the truth until a server replays it (`replay.js`). In a shared room the
   **server's sim is the truth**. Clients send commands and get state. What a player takes home is the room's result,
   written into their verified save, never a claim from their client.

So every piece of state falls into one of three kinds:

| Kind | What | Who owns it in shared play |
|---|---|---|
| **Instance** | The world copy: its floors, foes, the fight, rooms won, gates, chests opened, shrines used, cages lying about, the boss | The room, for the run only. Nothing of it is saved to anyone. |
| **Personal** | Each hero (level, XP, gear, skills, stance, loadout), bag, gold, cinders, the raid record | The player. It comes into the room as a snapshot of their verified save, and goes home as a diff the server writes. |
| **Slot story** | Quests, board jobs, flags, the Chronicle, bosses fallen and away, gates opened for good, the count (lamps, souls), road ranks, camps, towns reached, trials, companions met | The player's own world, untouched by a shared room (the owner: *"a run isn't the story"*, GDD §18). |

---

## 2. Three kinds of shared play

| | **Raid** (GDD §18) | **Region event** | **World event** |
|---|---|---|---|
| Who | 3 heroes, a lobby, a leader | Anyone verified in that land when it's on | Everyone, across lands |
| Where | A copy of a band dungeon, its own instance | A shared copy of one land's overland, or an arena on it | One place, many shards (instances of ~20) |
| Length | A run: 6–22 min, to a boss | A window: say 15–20 min, on a schedule | A window or a season |
| Join and leave | Set out together; leaving ends your seat | Walk in, walk out, any time | The same |
| Limit | 3 a hero a day | Once a window per hero (its reward) | Once per tier per hero |
| A win | The band's boss falls | The event's boss or goal before the window shuts | A shared goal (total damage, a count) |
| A loss | A wipe: no penalty | Nobody wipes: each hero is downed and comes back | The window shuts |

The rule sets in §3 are written so that one table drives all three, as the Bowl (`BOUT`), the Mere Tower (`TOWER`) and the
raid (`RAID`) each already pass their rules into `battle.js`. §6 proposes making that one object.

---

## 3. System by system

Legend: **Same** = works as it is. **Rule** = needs a rule of its own (said how). **Off** = doesn't apply.
*Stage 1* is what's built today (offline, stand-ins).

### 3.1 Moving and control

| System | Single player | Raid, stage 1 (built) | Live raid | Region / world event |
|---|---|---|---|---|
| Stick, tap, compass walk (`core.js` move, goto, tap) | One hero | Same | **Rule:** every command carries its seat, and the server checks a seat only moves its own hero | **Rule:** the same, by player |
| Companions follow the hero (`battle.js` atEase, formation) | The company follows `party[0]` | The stand-ins follow you | **Rule:** a seat whose player isn't steering follows the leader (the owner's rule). The formation is by class. The leader can pass the lead. | **Rule:** no leader. An idle hero holds where it is and fights what comes, or walks to the event's rally point. |
| Autobattle when not steering | After 0.5 s | Same | Same, per seat | Same |
| Focus (tap a foe) | One `focusId` for the party | Same (one player) | **Rule:** a focus per seat. Today `battle.focusId` is one value. The leader's mark is shown to the others as a suggestion. | **Rule:** per player |
| Stance, loadout, autocast, priority | Per member | Same | Same: each player sets their own hero's | Same |
| Stairs (`descend`, `ascend`) | The company goes | Same | **Rule:** only the leader's stairs take the group, and everyone goes | Off (an overland) |
| Way out, exits (`travel`, `exitAt`) | Leaves the site | Ends the raid; the company is back (`leaveRaid`) | **Rule:** a player who walks out leaves the run, and their seat goes to AI follow for the rest. **Decision 1:** does walking out forfeit the coffer? | **Rule:** walking out leaves the event; you come back if the window's still open |
| Homeward Scroll (`useItem`) | Home to the town | Ends the raid (`travel` → `leaveRaid`) | **Rule:** leaving, as above (your scroll is used up) | The same |
| Step out (a room's doorway) | Ends the fight | Same | **Rule:** the room's fight goes on while any hero is in it; one stepping out isn't the room resetting | **Rule:** the event's area isn't a room: no reset |
| The pause menu | A fight goes on under it (GDD v1.90) | Same | Same: there's never a pause in a shared room | Same |
| Bout speed 2× / 4× (`ui/bowl.js`) | The Bowl only | Off | **Off:** one clock for everyone | **Off** |

### 3.2 Leaving, dropping, offline

| Case | Single player | Raid, stage 1 | Live raid | Region / world event |
|---|---|---|---|---|
| The app closes or the signal goes | The slot saves; play stops | The save is the world you set out from (`snapshot`); a reload ends the run, still spent | **Rule:** the seat goes to AI follow and a reconnection token holds it until the run ends. Back in time: your hero again, and your coffer at the end. **Decision 2:** a dropped player who never comes back: coffer or not? | **Rule:** your hero stands out of the fight (not a body to carry), removed after a minute; rejoin while the window's open |
| Offline catch-up (`state.away`, `ui/away.js`) | The time away is played through on the same rules | If the tab comes back mid-raid, the catch-up plays the raid on with the AI. A reload ends it (the save is from before). | **Off for the room:** the server runs it in real time. **Rule:** a slot's catch-up must not count time spent in a shared room, or the company is paid twice and expeditions run double. | The same |
| The slot's own clock while you're in a room | Your clock | Your clock runs on (it is the raid's) | **Rule:** the room's time is added to your slot's clock when its result is written back, so dawns, wages, expeditions and the shop roll over exactly once | The same |
| Saving mid-run | Autosave | The world you set out from | **Rule:** the slot is locked while you're in a room. Your client saves nothing of the run; the server writes the result at the end (or at your drop-out). | The same |

### 3.3 The fight

| System | Single player | Raid, stage 1 | Live raid | Region / world event |
|---|---|---|---|---|
| Waves and the tide (`spawnWave`, `TIDES`) | The room's level and wave size | 6 waves a room on its own tide (`RAID.tide`) | Same. The room sets the wave size, not the party (GDD §3.2), so 3 heroes face what a hero and 2 companions do. | **Rule:** an event's foes and boss scale with how many are there: a deterministic table by head count, steps of 5, so the bits are the same for everyone |
| A room won, the gate (`raidRoom`, `gateOf`) | 20 waves drop the gate for good | 6 waves, for the run only | Same | Off |
| Downed, Fallen (`downedOut`, `fall`) | Companions Fallen when Downed twice; the hero only Downed | Nobody Fallen | Same: three main heroes, never Fallen, rise in the lull | **Rule:** downed, then up again after N s at the edge (no lull to wait for) |
| A wipe (`defeat`) | Temple, 25 % of gold, Weakened | No cost, home (`onRaidLost`) | Same. **Rule:** a wipe ends the run for all three. | **Off:** there's no wipe. Each hero goes down and comes back. The event ends at its window. |
| Boss away after a fall (`bossBack`) | 30 min empty hall | Always home, nothing written | Same | **Rule:** the event's own schedule |
| A boss's first fall (story, heirloom) | Counts once, pays its heirloom | Not the story's; a raid drop instead | Same | Same, plus contribution (§3.4) |
| Boss mechanics (Garrow's calls, the Stranger's raising, the Toadking's mud, the Abbess's flood…) | Per fight | Same | Same: they target "the party", and three heroes are the party | **Rule:** a mechanic aimed at one target (a call, a raise) must pick among many by a seeded draw, not "the hero" |
| Healing, buffs, auras, shrine boons (`boonsOf`, `state.boons`) | The company | Same | **Rule:** boons are per slot today (`state.boons`, saved). In a room a boon is runtime on the heroes in reach when it's used, and it isn't written home. | The same |
| XP (`XP_SHARE`, `gainXp`) | Shared by the living, ½ each for three | ×1.25; stand-ins gain none | **Rule:** each player's hero gets their share, ×1.25. The server writes it into each verified save. | **Rule:** `XP_SHARE` stops at 3. An event pays by contribution tier, not per kill split 20 ways. |
| Gold and cinders from kills (`reward`) | Into the one purse | ×1.25 into your purse | **Rule:** each player gets the kill's gold and cinders, as in their own party (not split three ways) | **Rule:** by contribution tier at the end |
| Room scaling by heroes' levels | One company's levels | The stand-ins at your level | **Rule:** three different levels in one room: the dungeon is as it is (the owner); each hero's own under-level penalty (GDD v1.67) still applies to them | The same |

### 3.4 Loot

| System | Single player | Raid, stage 1 | Live raid | Region / world event |
|---|---|---|---|---|
| Drops (`loot.js` drop: wave, elite, chest, boss) | Rolled for the party's classes (80 %), on the slot's stream (`counters.lootN`) | At the raid's odds, for your class alone (`own`) | **Rule:** every drop is rolled **for each player**, on a stream from the room's seed and that player's seat, for their class. Nobody sees another's. Nothing is split or traded. | **Rule:** personal rolls at the end, by contribution tier, not per kill (twenty players' drops a wave would flood the bag) |
| Who a drop is "an upgrade for" (`bestFor`) | Any member | Never a stand-in (done) | Only your own hero | The same |
| A full bag (salvage to cinders) | Your bag | Same | Same: each player's own bag, in their snapshot | Same |
| Chests (`harvest` chest) | Opened once, one roll | Opened once, your roll | **Rule:** opened once for the room, **a roll for each player**. Who taps it doesn't matter. | **Rule:** an event's chest, if any, is personal: each player sees their own, opened once each |
| Shrines (`useShrine`) | One use, the company's boon | Same | **Rule:** one use for the room; the boon lands on every hero in reach | The same |
| Homeward Scroll drops (`SCROLL_DROP`) | Rare loot | Same (your stream) | Personal, as drops | Personal |
| The coffer (`cofferOf`) | — | Yours, rolled from the raid's number | **Rule:** each player's own, from the room's seed and the seat; `raid.dry` is each player's | The event's own reward table, by tier |
| A boss's heirloom, a vault's (`grant`) | Once, from its first fall | Not paid (the story's) | The same | **Rule:** an event's heirloom, if any, is a tier's reward, once per hero |

### 3.5 Lanterns, lamps and the count

The count (`lamps.js`: lamps broken, souls freed) is the story's: Ilse keeps it, Ink reads it, the ending weighs it.

| System | Single player | Raid, stage 1 (built) | Live raid | Region / world event |
|---|---|---|---|---|
| A harvester's lantern-cage, dropped where it falls; a touch breaks it (`cageBroken`) | +1 lamp, +1 soul | **Fixed today:** it breaks in the fight, and nothing is written to your count (`battle.js` tally, `core.js`). It had counted. | **Decision 3:** (a) a shared room never moves the count (it's your own world's story: built), or (b) everyone present gets the credit | The same decision |
| The party picks cages up when calm (`pickCages`) | Automatic | Same, uncounted | **Rule:** a cage is an instance object, broken once for the room; its credit follows decision 3 | The same |
| A lamp breaks when its keeper falls (the Standard) | +1 lamp and its souls, once, and the lamp is broken for good (`state.lampsBroken`) | **Fixed today:** the Standard ends a Sunken Chapel raid, and his fall there had broken his lamp *in your story*. Now his bound dead still lie down in the fight, but the lamp isn't written as broken and nothing is counted. | Off, under (a) | Off |
| A slain undead's soul (`e.undead` credit) | +1 soul | Fixed today: not counted | As decision 3 | As decision 3 |

**Built as (a)** (2026-11-14), since GDD §18 already says a raid isn't the story: the count is found, not farmed, and three
raids a day would move it faster than the story expects. Switching to (b) is the one guard in `battle.js` (`tally`) and one
in `core.js`. Test: `raid.test.mjs` (*a raid moves no story count*).

### 3.6 The story and the slot

| System | Single player | Raid, stage 1 (built) | Live raid | Region / world event |
|---|---|---|---|---|
| Quests, board jobs (`quests.js` count) | Counted | Not counted (done: `getWorld().raid`) | Off | **Decision 4:** a board job could ask for an event ("take part in the Drowned Bell") as its objective, counted by the server at write-back. Otherwise off. |
| The Chronicle (`lore.js`) | Found | Not found in a raid (done) | Off | Off |
| Named NPCs, the found companions, talk (`npcs.js`, `talk`) | In the world | None on a raid's floors (done) | Off | **Rule:** an event can have its own authored lines (a herald), never a quest-giver |
| Flags, bosses fallen, `bossBack`, gates opened, camps cleared, `sitesEntered`, `revealed`, road ranks | The slot's | Untouched (done) | Untouched | Untouched |
| Trials (class skills) | The company's | The stand-ins carry all trials (`ALL_TRIALS`); yours unchanged | Each hero's own, from their snapshot | The same |

### 3.7 The company, the town and time

| System | Single player | Raid, stage 1 | Live raid | Region / world event |
|---|---|---|---|---|
| Your companions | In the party | Wait where you left them (`raidOn.party`) | Same: in your slot, not the room | Same |
| Dawn wages (`heroes.js` payDawn) | The party in full, the bench at half | **Fixed today:** the waiting company is paid as if in the party (it was skipped). Test in `raid.test.mjs`. | **Rule:** paid when the room's time is added to your clock (§3.2) | The same |
| Expeditions (`expeditions.js`) | Run on your clock; back to the bench | Same (the bench is untouched) | Same, on your clock at write-back | Same |
| Hire, swap, bench, dismiss, retrain (`heroes.js`) | In town | Refused on a raid (done) | Off (your slot is locked) | Off |
| The forge, the shop, the inn, the temple, the coach | In town | Off (you're in a dungeon) | Off | Off, unless the event is in a town square (§4) |
| The daily counts: the raid's three, the Bowl's ten, the shop's stock, the board | Your game day | Your game day (`DAY_S`) | **Rule:** the **server's real day** for anything shared (the raid's three). Your slot's game day for the rest. | The server's day, per event |
| Weather, time of day (`weather.js`, `partOf`) | From your clock | From your clock | **Rule:** the room's own hour (underground it's the kit's light anyway) | **Rule:** the event's hour, the same for everyone in it |

### 3.8 Fair play, saves, determinism

| System | Single player | Raid, stage 1 | Live raid | Region / world event |
|---|---|---|---|---|
| Verified progress (`replay.js`) | The server replays a session | Unverified, like all offline play | **Rule:** only verified heroes may join. The room's command log and seed are kept for audit. The result is the server's. | The same |
| A dev game (`state.dev`) | Refused by the validator | Allowed offline | **Off:** a dev game can't join | Off |
| The seed | The slot's | Your slot's (your Wickham Keep) | **Rule:** a canonical seed for the room (per dungeon, per day), so every client builds the same floors | **Rule:** a canonical seed per event |
| Commands | One player's | Same | **Rule:** each carries its seat; the server rate-limits them per tick (architecture §10) | The same, by player |
| What's sent | — | — | Commands in, state deltas out at 20 Hz (A8, Colyseus) | Interest-managed: only heroes and foes near you |
| The save shape | Snapshot / restore | `raid` (v48) | **Rule:** the slot's save gains a "locked in a room" marker while a run is on, so a second device can't play the slot meanwhile | The same |

---

## 4. A region or world boss event: what it adds

The raid's rules carry most of an event. These are the differences that need deciding:

- **Open membership.** No lobby and no seats. You walk into the event's area while it's on, and you're in.
- **Many heroes, one fight.** Foes and the boss scale with head count by a table, in steps, so it doesn't swing as
  people come and go. Twenty heroes need interest management in the room (who's sent to whom) and a cap per shard.
- **No companions.** Each player brings their main, as in a raid. It keeps the count of bodies (and draws) down.
- **No wipe.** A downed hero gets up at the edge after a few seconds (no penalty). The event is won or lost by its
  window.
- **Contribution.** Damage done, healing done and time in the fight, from the room's own record, decide a tier
  (none / bronze / silver / gold) and the reward rolls at the end. Today's per-kill XP and gold split (`XP_SHARE`) doesn't
  stretch to twenty.
- **A schedule.** The server says when the event is on, from its own clock. The game shows it on the World map, as the
  coach's towns are.
- **Where.** A shared copy of one land's overland, built from a canonical seed. That copy isn't your own Vale: its camps,
  road ranks and quests don't show. Or a set-piece arena (as the Bowl's Sand is) off the land's road.
- **Rewards.** Once per window per hero; an event-only item or heirloom at the top tier; no story count (decision 3).

---

## 5. Found and fixed while auditing (2026-11-14)

- **The waiting company wasn't paid at dawn on a raid.** The dawn wage only paid `state.party` and the bench, and a raid
  swaps the party for the hero and the stand-ins, so the companions left waiting were skipped (no wage, no loyalty), and
  GDD §18 said wages run as ever. `heroes.js` payDawn now pays the waiting company too (`waiting`, from `core.js`
  raidOn). Test: `raid.test.mjs` (*the company left waiting is paid at dawn*).
- **A raid wrote to the story's count, and broke the Standard's lamp for good.** A raid's cages, its slain dead and a
  lamp-keeper's fall (the Standard ends a Sunken Chapel raid) added to `state.count`, and his fall pushed his lamp into
  `state.lampsBroken`, as if you'd broken it in your own world. Now none of it is written on a raid (the fight is the same:
  the bound still lie down). Decision 3 can still choose to credit it.

## 6. Proposed: one rule set for every kind of play

Today each kind of play passes its own rules into `battle.js` (`BOUT` for the Bowl, `TOWER`, `raidRun()` for raids, the
camps' own), and `core.js` guards the story with checks in several places. One object would make shared play a matter of
filling in a table:

```js
// a kind of play's rules (sim/modes.js, proposed): read by battle.js, core.js, loot.js, quests.js, lore.js, lamps.js
{
  kind: 'raid',            // 'slot' (single player) | 'bout' | 'tower' | 'raid' | 'event'
  story: false,            // quests, board, Chronicle, flags, bosses, gates, the count: written or not
  count: false,            // lamps and souls (decision 3)
  death: 'none',           // 'wipe' (temple, gold, Weakened) | 'none' (home, no cost) | 'respawn' (an event)
  fallen: false,           // companions Fallen on a second down
  waves: 6, tide: { step: 0.1, cap: 0.5 },    // or the room's own
  bossHome: true,          // ignore bossBack
  loot: { odds: 'raid', who: 'each', classes: 'own' },   // 'party' | 'each' | 'tier'
  xp: 1.25, gold: 1.25, split: 'party',                  // 'party' | 'each' | 'tier'
  leader: true, follow: 'leader',                        // or 'hold' (an event)
  pause: false, speed: false, clock: 'room',             // 'slot' | 'room'
  limit: { perDay: 3, day: 'server' },
}
```

The slot's own play is the same object with everything on; the Bowl's and the Tower's become rows of it. That refactor is
worth doing before stage 3, not during it.

## 7. For the owner to decide

1. **Walking out of a live raid:** does it forfeit your coffer? (Proposed: yes for walking out; no for a drop-out who
   comes back before the end.)
2. **A drop-out who never comes back:** do they still get their coffer if the others win? (Proposed: yes, if they won at
   least one room with the group. The AI carried their seat.)
3. **Lanterns and the count in raids and events:** never counted (built for raids now), or credited to everyone there?
4. **Events and the board:** may a board job ask you to take part in an event?
5. **Region event first, or world event?** Proposed: a region boss on one land, in a set-piece arena, as the first event
   (the Bowl's Sand shows the pattern), on the stage 3 server.
6. **Do the refactor in §6 now** (no behaviour change, tests as they are), before live raids?

## 8. Decided (the owner, 2026-11-14)

The owner: *"Lets go with your recommendation on 1 and 2, except if never return then no chest or loot that happens after
you leave"*. So:

- **Raid rewards** stay as they are: a run finds 1.0–3.7 Fine and 0–0.5 Rare before its coffer, against the farm's 0.92 Fine
  and 0.17 Rare an hour; the daily three is what keeps it in bounds, as asked ("higher chance of rewards but limited number
  per day"). Looked at again with stage 3's real days.
- **Decision 1, walking out of a live raid:** forfeits the coffer. The seat goes to AI follow for the rest of the run.
- **Decision 2, a drop-out:** back before the run ends, your hero again and your coffer at the end. **Never back: no coffer,
  and nothing that drops after you went** (the owner, against the proposal's "coffer if you won a room"). Loot is rolled for
  each player present when it drops (`who: 'each'`), so a seat on AI follow rolls none: a drop-out who comes back has what
  dropped while they were there, and the coffer.
- **Decision 3, lanterns and the count:** never counted in a raid or an event (as built: `battle.js` tally).
- **Decision 4, events and the board:** no board job asks for an event.
- **Decision 5, the first event:** a region boss on one land, in a set-piece arena (the Bowl's Sand the pattern), on the
  stage 3 server.
- **Decision 6, the refactor in §6:** now, before live raids, with no change in behaviour (§9).

## 9. As built: the rule set (2026-11-14, architecture A22)

§6's table is `src/sim/modes.js`: `MODES` has a row for each kind of play there is now (`slot`, `camp`, `tower`, `bout`,
`raid`), every row with every field (`story`, `count`, `death`, `fallen`, `boon`, `heal`, `dmg`, `bossHome`, `xp`, `gold`,
`waves`, `tide`, `loot`). `modeOf(battle, raid)` picks the fight's row (a bout, a raid, between its rooms too, the Tower, a
spawn point's, else the slot's); `modeOfWorld(w)` the world's, for what sees only the world (quests.js, lore.js).

What reads it, where each had its own check before:

| Rule | Read in | Was |
|---|---|---|
| `story` | battle.js a boss's fall (the story's count and his time away, or a raid's own `bossDown`); quests.js `count`; lore.js a hall's find | `raidRun()`, `w.raid` |
| `count` | battle.js `tally` and a lamp's first breaking; core.js a cage's touch | `!raidRun()`, `!raidOn` |
| `death` | battle.js `defeat`: `none` (a raid's: home, no cost), `satchel` (the Tower's), `wipe` | `raidRun()`, `b.tower` |
| `fallen` | battle.js a second down, and the downed when a fight's left | `!bout && !raidRun()` |
| `boon`, `heal`, `dmg` | battle.js | `battle.bout ? BOUT.… : …` |
| `bossHome` | battle.js a hall's boss at the start of its fight | `raidRun() ||` |
| `xp`, `gold` | battle.js a kill's pay | `R.rules.xp` |
| `waves`, `tide` | battle.js a room won after its waves; a wave's climb | `R.rules.waves`, `R.rules.tide` |
| `loot` | core.js `dropHere` (a raid's odds, the hero's class) | `raidOn` |

Not in it, because they're each one kind's own machinery rather than a rule another kind would set differently: the Bowl's
sides, its call and its clock (`BOUT`'s other fields, bowl.js), the Tower's waves, wardens and satchel (tower.js), a spawn
point's band and respawn (camps.js), a raid's stand-ins, seats, day and coffer (raid.js). §6's `leader`, `follow`, `pause`,
`speed`, `clock` and `limit` come with the stage 3 server, when there's something that reads them.

**No change in behaviour**, measured: every balance harness run against the commit before and after, the same to the digit
(`roomlv` at 3, 6 and 15 with Vault; `raid` at Wickham Keep and the Barrows; `boss`; `tower`; `bowl`, a company and alone;
`camps`; `loot`), the smoke test's replay hash as it was, 639 tests (`test/modes.test.mjs`: every row whole, the right row
for the fight, the decisions in the raid row). `tools/balance/bowl.mjs` had stopped running since the Bowl moved to the
Quarry Ring's one room (v1.89: it looked for a room that isn't the entrance); fixed on the way, as the baseline needed it.

