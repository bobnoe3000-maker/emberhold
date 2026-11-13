# Emberfall — Game Design Document

**v1.91 · 2026-11-13 · Plan of record for game design.** v1.91 (§17; the owner: "Add a 2 and 4x speed up button option to the arena"): **a bout at 1×, 2× or 4×.** Three buttons under a bout in the Bowl (bottom left, beside Step out's row) run the game that much faster while the bout lasts: the sim's ticks and the picture's clock alike, so the fight is the same blow for blow, only sooner (the sim is tick for tick the same; a replay doesn't know). The choice is kept on the device; outside a bout the game runs at its own pace. **v1.90 · 2026-11-13.** v1.90 (§17; the owner, of three looks for the Sand outdoors: "Lets go with B"; world doc v1.46, [bowl-arena-proposal.md](./bowl-arena-proposal.md) §12): **the Bowl is the Quarry Ring.** One space, the sand, open to the sky in a bright day whatever the hour, three ledges of banded rock behind it with the crowd on them, the near side low; the company comes and goes by the stair in its north face (the Dust Gate; walked onto, it gives the world back, as Leave does). **v1.89 · 2026-11-13.** v1.89 (§3.1; the owner: "we can remove the stairs up and stairs down labels - the stairways are clear enough on thier own with the arches and colors"): **no signs over the stairs.** The *▲ Way out*, *▲ Stairs up* and *▼ Stairs down* signs (v1.51) are gone; each way is its arch, gold-white up and violet down (v1.57), and a tap on the stairs themselves still walks the party there and takes them. **v1.88 · 2026-11-13.** v1.88 (§17; the owner: "Arena/tournament - let's clean up and improve the UI. At the top - first tab choices - are Team vs Individual. Sub tabs are 'challenge' - was the board and 'rankings' - was standings. Entering a fight automatically registers you for the Tourney … The board - Instead of the current naming (the tallow twelve) - it will just be the player name … Just show ranking and rating, and the company classes (no names) including level. Drop the dressing text … And just the button for fight. New faces - cost is gold to refresh - 100, 250 and 500 for refresh 1-3", then, on the mockup, [bowl-arena-proposal.md](./bowl-arena-proposal.md) §13: "mockup looks good - implement"): **the Bowl's two ladders and its board.** **Team** (the company) and **Individual** (your hero alone against a player's hero) are a ladder each: its own rating, rank, record, board of five and league of the hundred. The day's **ten bouts** are shared between them. Under each, **Challenge** (the board: each card a player's rank, name, rating and company as classes and levels, one Fight button, greyed "Fought" once tried) and **Rankings** (the top five and the players round you, overall or in today's tourney). The companies are shown by **their player's name**, made up for now (`content/arena.json` `player`), until other players take their places; their company names, manners, grades, homes and sayings are off the board. **New faces cost gold**: 100, then 250, then 500, three a day across both ladders; the day's first five each stay free. **The tourney is the day's, one a ladder:** your first bout on a ladder enters you; you're placed among the hundred by the day's wins, then the rating gained (theirs as their day finishes, yours as it stands); at the day's end the places are paid marks: 1st 16, to 3rd 10, to 8th 6, to 16th 3. The eight-company bracket, its Enter button and the locked company are gone. Save v47 (`bowl.team`, `bowl.solo`; a v46 record's rating is the Team ladder's, a tourney left open paid as it stood). **v1.87 · 2026-11-13.** v1.87 (§3, §5; the owner: "melee players/npc are too close when fighting - put a little bit of distance so they aren't on top of each other"): **a little room between blades.** Every melee reach, the party's and the foes', is **0.5 tiles longer** (0.7 at first: it left a party with no healer holding a level-6 room, against the contract, §7.1) (`battle.js` `MELEE_GAP`; a shot's is unchanged), so a fighter stands off from what it strikes, and two units on **opposite sides** keep a fifth more personal space than two on the same side (`SEP_FOE` 1.2, 1.25 at first; friends still shoulder together as before). The skills that strike round their caster, which reached just past the old knot, reach **3¾ tiles** (they were 3): Earthshatter, Whirling Blades, Turn Undead, Thunder Drum; Vault lands at the new reach. Measured (headless, the right party): the nearest foe to a melee member in a fight 2.83 → 3.54 tiles, the nearest ally unchanged at 2.83. The contract's rooms (`roomlv.mjs`): level 3 the same; level 6 held as before, the lowest 68 → 35 %, one down; level 9 15 → 14 waves; level 12 the lowest 35 → 45 %; a level-9 medium room 16 waves and defeat → 18 held; a room three up still defeats the right party, sooner (169 / 126 s after, 259 / 195 s before). Bosses (the contract's party, five seeds): Wickham Keep at 6 down in 57–63 s (52–61 before) on four, the fifth a defeat; the Sunken Chapel at 9 83 s (79); the Old Barrows at 3 60 s (58). The Beacon company (the perk gate) held 3 of 10 seeds before and after. As shipped (0.5 and 1.2; the first cut, 0.7 and 1.25, broke two of §7.1's lines: the party with no healer held a level-6 room, and a companion earned 75 % of a lone hero's XP a minute): the no-healer party at 6 down at 210 / 289 s (335 / 262 before), a companion 88 % of a lone hero's XP a minute (101 % before), the nearest foe 3.39 tiles off (2.83 before), the space between sides doing that work. **v1.86 · 2026-11-13.** v1.86 (§17; the owner: "When i enter the tournament arena i want to be able to choose from 5 opponents, refresh 3x per day. I can have up to 10 fights per day. The game simulates similar rules for ai opponents. Lets assume 100 teams for now. I want to watch the fights i choose play out live. This will eventually be to include other players when we open up multiplayer"): **the Bowl's board and its hundred.** The board shows **five teams** near your rating (drawn from the fifteen nearest, easiest first), each with Fight and Fight alone; **three times a day** you may draw five new faces (none shown already that day); **ten bouts a day**, every one paid (a win 2–6 marks by grade, a loss or draw 1), one try a team a day. The roster is **a hundred companies** (`content/arena.json`; the 76 new ones called in by their manner's line). They play **a league of their own on the same rules**: every team ten bouts a day against a team near its rating, the result drawn on the two teams' hidden strengths (grade, manner's edge, a talent of its own), a few drawn, Glicko moving both; it runs from twenty days before the first, from a fixed seed, so it is the same for every player, and the player's bouts don't move it (a shared league, as the server's will be). A **Standings** tab shows its top ten and the teams round your rating, with your place among the 101. Every bout you choose is **fought live** on the Sand as before; the league's are worked out, not watched, until other players' companies take their places. Save v46 (`bowl.picks`, `shown`, `refresh`). **v1.85 · 2026-11-13.** v1.85 (§17; the owner, on the Bowl's proposal: "Menu fine at min level 6, in brackets, lets test and simulate healing for the right balance, for marks only, company locked for the tournament, yes a hero only option. Tournament are daily reset for now"; [bowl-arena-proposal.md](./bowl-arena-proposal.md), world doc v1.44): **the Bowl, built.** From ☰ at level 6 a company goes to the Sand (an authored floor: the Dust Gate and the oval sand, open wall to wall) and back to exactly where it was. A bout is the party as fielded, or **the hero alone** against a rival company's first, against one of 24 written companies (`content/arena.json`) whose strength is rolled by grade at the hero's level (Green: common kit 2 levels old; Steady: common; Seasoned: common +1; Hardened: Fine +1; Champion: Fine +2; their skill points spent from none to all: each grade beats the one below 60–80 %), its rating by grade and its manner's measured edge; **one brain for both sides** (battle.js memberTurn: a rival is a member and fights as your companions do). Rules: full HP and MP in, the HP you came with out; nobody Fallen; crowd control ×0.5 on a member; **blows ×0.5 and healing ×0.75** between companies (measured below); the Crier's call (3 s, each member a random reaction up to 0.8 s so neither side always opens first); 2:00, then the Crier calls it on the share of HP standing (a draw within 2 %). **Brackets** by the hero's level (6–11, 12–14, 15–29, 30–44, 45–59, 60–75) group the board; for now the rivals are made at your level, and levels evened at the bracket's top wait for live companies. **Marks only**: a win 2–6 by grade, a loss or draw 1, the first five bouts a day; no XP, gold or loot. The **ladder**: three picks a day (easier, even, harder by rating, Glicko from 1200), one try a pairing a day. The **tourney**: one a day, you and the seven companies nearest your rating, three rounds, **your company locked** from entry to the end, purse 3 / 6 / 10 / 16 by the round reached; the bouts you don't fight are decided by rating on a draw (watching one waits). A **day** is the game's (an hour of play): the sim keeps no wall clock, so a calendar day waits for the server. Save v45 (`bowl`). Measured (`tools/balance/bowl.mjs`, level 6, steady against steady, 20 seeds × both ends): blows at full strength ended the balanced mirror in 25 s and two mages' in 8 s; at ×0.5 with healing ×0.75 the mirror goes 50 / 50 in 72 s (5 % to the clock), the hero alone 50 / 50 in 70 s; healing ×0.6 or ×0.5 sent wall against wall to the clock 90–100 % without changing the mirror. The manners are uneven (stalkers beat balanced 88 %, spellbinders lose to all but the wall), carried in each company's rating for now (`MANNER_EDGE`). **v1.84 · 2026-11-13.** v1.84 (§3.6; the owner: "Shrine of mending should buff hp regen rate for 2 min"): **the green shrine is a blessing like the other two.** The *Shrine of Mending* gives the whole party +100 % HP regeneration for 2 minutes (a fighter's regen is about 1.4 % of max HP a second in a fight, so about 2.8 % with it: some 170 % of max HP over the two minutes, where the old fill was one top-up), in a fight or out, and still raises the first of the Slain at half health. It no longer fills HP and MP at once. Saved (v44: the boons' `hpr`), shown as a chip on the top bar with the time left. v1.83 (§7, §17; the owner: "Like before we created new nPCs, take a strong pass at creating toad NPCs for the toad king dungeon", with two references; world doc v1.43, [creatures-proposal.md](./creatures-proposal.md) "The toads"): **the Toadking's toads**, built in code. The **mire toad** (`mudtoad`) takes the fen ghoul's place in the Mound's waves at a minion's strength (HP 40, ATK 7.6: more body and less dodge than a ghoul, slower to bite); the **gulper** (`gulper`) is the elite on the Mound's second and third floors (the Boat Hall's, `boathall`; the first floor's, `toadmen`, keeps the reed-cutter's reeve) at a warrior's strength, its barbed tongue the longest reach of any melee foe (4.6) and slow to throw again (1.8 s). The Toadking's escort is his gulper, Dumpling, and a fowler (it was a reed-cutter). Measured: the right party in a room on each of the Mound's three floors, three seeds, five minutes: 2 of 9 defeats before and 2 of 9 after, 12–15 waves held either way; the Toadking's hall at 12, three seeds: 49–53 s before, 49–51 s after, the party's lowest 66–78 % before and 74–78 % after, nobody downed. v1.82 (§3.1; the owner, on the party walking off the drawn floor to fight in Toadking's Mound: "update toadking mound to the latest rules"): **Toadking's Mound is built in halls**, as the rest of the Fens. Its caverns ran past the 256 tiles a side Luminati draws (12 of 15 floors over five seeds), so a room you could walk to stood outside the drawn level, black (docs/level-design-rules.md §5, the first survey's bug). Its three floors keep their six rooms, levels, Wren on the second, the Toadking on the third and the mire's dressing (reeds, boats hauled up, the mud). v1.81 (§7.1; the owner: "The ~10% attack and defence penalty per level you're under a foe - we are dropping this entirely"): **no penalty for a foe above the hero's level**; v1.69's 10 % a level of ATK and DEF is gone (battle.js), and a room three up still defeats the right party, in 7½ minutes rather than 5. v1.80 (§6.2, §5.1; the owner: "im getting notifications that companions not in my party (benched) are leveling up - they should not be"): **the bench earns no XP.** Only the party in the field gains from fights and quests; a benched companion levels only on the road, by an expedition (§6.3), which is sent for that. The bench still draws half wage. v1.79 (§6.1, the owner: "Ok lets incorporate this into the game",
after the painted-faces spike, docs/painted-faces-spike.md): every face is the **painted head** (a sculpted skull, the
whole face one painted picture on it: small dark eyes with a glint, thick brows, a ball nose, big ears, a wider jaw), the
hero's, the company's and the townsfolk's, in play, in the previews and in the baked portraits; two new parts of a
look, the **frame** (strong, or soft: the softer jaw and chin, lashes, coloured lips) and the **expression** (calm,
smiling, glad, stern, sad, smug, surprised, fierce), chosen at creation and at the temple like the rest. Save v43: an
older look gains the strong frame and a calm face. v1.78 (the owner: "Thin the Fens trees by 25% too"): the Greywater
Fens' trees on the land a quarter fewer by crown cover (10,083 → 7,548 tiles of its 240²; 71 → 48 trees), the fen's scatter
and the willows at the water's edge alike, each on a draw of its own stream (sim/outdoor.js FENS_KEEP); the ring past its edge
kept whole. v1.77 (§8, the owner: "In this balance pass increase embers
required"): an upgrade's cinders ×2.5 with the step's gain, +1…+5 at 2, 5, 10, 15, 25 (57 an item to +5; it was 1, 2, 4, 6,
10 = 23), and a reforge's 6 (it was 3). The right party at 6 earns ~60 cinders an hour (48 from elites, ~12 salvaging its
drops), so +5 on a piece is about an hour's. Salvage gives back half, as before. v1.76 (§8, the owner: "Propose a balance increase for upgrades
and reforges"; asked: "20% and traits too", "Never a weak roll"): a smith's upgrade step adds 20 % to an item's base stats
(it was 8 %) and 10 % to its traits (none before), so +5 doubles the base and adds half again to the traits; prices are as
they were. A reforged trait rolls 1.0–1.2× its usual size at the item's level (a drop's 0.8–1.2×), never a weak roll; its
price still doubles each time. Measured, the right party at 6 with every piece +5 (plain kit, no traits): one level up 11
waves at +0, 12 at the old step, 15 now; two up 3, 4, 6; three up 2 at the old step, 5 now, the room still winning.
v1.75 (§8, the owner: "Drop the wood and stone reqs for
upgrades"): a smith's upgrade costs gold × item level and cinders only (it took 8, 12, 16 wood and stone for +3, +4, +5).
Wood and stone are still gathered, for nothing at the forge now. v1.74 (§12, the owner: "Offline progress on a lvl 3 room..
characters went from level 4 to 6 in 2 hours. I would like them to only increase 1 level"; asked, the owner chose half XP
offline over a slower curve for all play): while the time away is played through, a foe slain pays half its XP
(sim/battle.js AWAY_XP 0.5); the level curve and live play are as they were. Measured, the right party at 4 in a level-3
room for two hours: live, level 5 and 94 % on to 6; away, level 5 and 15 % on. v1.73 (bosses, the owner: "after the boss is defeated.. regular
npcs can still spawn. Show the timer for when the boss will reappear"; 30 minutes, story bosses too): a boss put down is away
for 30 minutes of game time (sim/battle.js BOSS_BACK, state.bossBack, save v42) and his hall stands empty meanwhile: no
waves (it had fought ordinary waves after a story boss fell, and a boss was back the moment you stepped in again). Then he
holds it again. A story boss (Garrow, the Robed Stranger, Brother Teague) comes back too; only his first fall is the
story's and pays his heirloom, and a found companion waiting in his hall still keeps it quiet till he's joined you. One
exception: a quest under way that asks you to hold that hall (Wren's Settled) gets its ordinary waves there. In the hall a
pill says who and when ("THE QUARTERMASTER · BACK IN 23:39"); his fall's banner says the hall stands empty for 30 min;
the map's dungeon card names a boss away with his minutes. v1.72 (§10, the owner: "The mini map replaces the world menu
button ... Let me click in the minimap to also walk to a location ... the region button on the left and the old provinces on
the right. Rename old provinces to World"): the minimap in the top bar is the map's button (the globe gone; the town square's
home screen, with no minimap, opens it from the tavern's coach row as before); the map's tabs are the land you're in, then
World (headed The Old Provinces); on the land's tab a tap on open ground marks the nearest spot you can stand on, its card
says how far, and Walk here is a plain goto there (sim travel.js walkSpot, read-only; on the land you stand on only: "Climb
out first" underground, "Take the road out first" in town). ui/worldmap.js. v1.71 (the owner: "Reduce the trees in Hollow Vale by 25%"): the Hollow
Vale's trees on the land a quarter fewer by crown cover (19,429 → 14,576 tiles; 100 → 67 trees, 42 → 33 groves), the forest ring
past its edge kept whole as its wall, every spawn point's fire and posts kept clear of crowns (sim/outdoor.js TREE_KEEP;
docs/level-design-rules.md densities). v1.70 (§3.3b, the owner: "A gate prevents a player from
moving to the next room until they have survived 20 waves… Once open, always open for that game slot"): every floor's
last hall behind a gate, dropped by 20 waves held in the room before it, for good in the slot (save v41). v1.69 (the owner, 2026-11-11): §3.3 an ordinary room's tide
tops out at wave 20, not 18 ("Room waves should be 20 to reach foes at +100% not 18"); §10.3 every spawn point's reach a
fifth less ("Reduce the overland aggro radius … by 20%"); §7 a party fights a foe above the hero's level at 10 % less
attack and defence a level ("A 10% attack and defense penalty … for each level under"). v1.68 (§10.3; the owner: "each region or overworld map should also have 3 or 4 NPC spawn locations… with appropriate site dressing and appropriate NPC difficulty just like the 3 or so dungeons per map… also ensure similar wider aggro/chase radius (show as a dotted line when encountered)"): **every land's spawn points.** Three or four a land, at least one at each of its dungeons' bands, each dressed as what it is: the first band's by the roads, the higher bands' well off every road (more than their reach), so a walk to a lower band's dungeon never meets one, a fight you choose as a dungeon is. The Vale: the ditch burrow (1), the Spit (2), Garrow's picket (5, the Redhand) and the old picket (8, the Ashbound). The Fens: the spinner beds (11, giant spiders), the old stones (14, stone golems) and the drowned graves (17, graveyard wraiths). Each sees you from 26 tiles (the Spit 36, the burrow 18) and chases you 4 past it; coming up on one, its reach shows on the ground as a ring of amber dots, and in its fight the edge you can run past, in red. None reaches a way in or out or where anyone arrives. Measured (`tools/balance/camps.mjs`, 6 fights each at the spawn point's level): the right party wins every one, 85–92 % of its health left; a lone fighter wins the burrow, the Spit and Garrow's picket (6 of 6 each), mostly the old picket (5), and struggles past it (the spinner beds 4, the old stones 4, the drowned graves 0), as a same-level room wants company from level 4 (§7.1). The Reach and the Heights get theirs with their acts. v1.67 (§10.3; the owner: "move the goblin camp too the far east side of the map just off the road", "triple the agro radius of the goblin camp", "the rat nest should have already pre-spawned rats out, like the goblin camp - so its obvious where it is"): the Spit moves to the Vale's far east, 6 tiles off the east road (194 tiles from Thornwick's gate), and sees you from **36 tiles** (12 before); the ditch burrow's rats wait out at the hole, as the Spit's goblins wait at their fire, so it shows where it is. v1.66 (§10.3; the owner: "Move the goblin camp out further - increase the chase radius, I have to get right on top, and respawn should be half as fast as in the dungeons. Same radius and respawn rate change for the rat nest"): **spawn points that keep coming.** The Spit moves out past the crossroads, south of the east road (112 tiles from Thornwick's gate; it was 75, on the river above the bridge). A camp sees you from 12 tiles (was 7) and the ditch burrow from 10 (was 5), their arenas wider with them. A band comes back **8 s** after it falls, twice a dungeon room's 4 s lull: stay in the arena and the next band comes on as a room's next wave does; walk off and it's there again when you're back. v1.65 (§6.1; the owner: "Lets enhance the character model engine… customize the face and body type more - player choice and allows for NPC variability… during character creation AND later if I want in the temple for a gold fee"): **a character's look.** Face shape, skin, eyes, brows, nose, mouth, ears, hair and its colour, beard, marks, build and height, chosen at creation and changed at a temple for 40 gold; a sellsword comes with a face and build of their own. What's equipped is worn on the figure (weapon, off-hand, helm), its rarity in its light. Cosmetic only. Save v39. v1.64 (§6.1; the owner: "lets polish the new player / new game start up"): **creation and first steps.** The class shown as the model you'll play; your hero **rolls** what they were born with, six attribute points and a trait drawn from the sellswords' own perks, re-rolled as often as you like (a roll on the class's build is the class table exactly, so the balance contract holds); five name suggestions at a time, and names the sim won't take (profanity, slurs, staff); after Ready, the controls shown one card at a time in the square, and a card the first time each service opens. The quest and story notices (a quest taken, done or paid, a fragment, a set, a site opened) wait for their ✕ (the owner: "the pop up disappears to fast… let me 'X' close them"); the passing ones (a count, not enough MP) still go by themselves. Save v38. v1.63 (§10.3; the owner: "lets place a small goblin camp in Hallow vale - 3 goblins caught a cow and are roasting it over the fire - a small side quest. goblins re-spawn, are level 2, occasional elite. There is also a rat nest - just a small burrow that 1-2 rats appear out of near town… This is a MVP of some overlap NPC spawn points that each map should have"): **spawn points on the overland.** Fights out on a land's map, not only in its dungeons: a **camp** (a band you can see at its fire before it sees you) and a **nest** (a burrow they come out of). Each holds one fight; cleared, it comes back after a while; walked away from, it stays as it was. The Vale's first two: **the Spit** (three level-2 goblins roasting Col's cow, now and then one an elite) and **the ditch burrow** by Thornwick's south wall (one or two level-1 grave rats), each a small errand. The rules are §10.3; every land is to have some. v1.62 (§3, §10; the owner: "write the rules doc and the visibility test… foliage placement… should be different based on the type of biome… dont repeat with 6+ torches unless the room is large"; [level-design-rules.md](./level-design-rules.md), now the plan of record for placement): **the level design rules.** Towns, the overworld and dungeons in one place, where the docs and the code disagreed the code's. Two new rules: what the player needs (the hero, the people, the ways in) is at least half in view from the camera, wherever they meet it; and a room holds as many of a piece as its size allows, every light together capped too (a small room two or three, a hall half a dozen: `src/sim/dresscaps.js`). Each land's foliage has its biome's profile (species, how it grows, densities, the ground each stands on). v1.61 (§10.2, the owner: "let me zoom in and out by the current default camera zoom by at least 33%"): **the camera's zoom**, from 67 % to 150 % of the default, by a two-finger pinch on the world, the mouse wheel, or Graphics (Further, Default, Closer, in tenths), kept per device. Presentation only. v1.60 (§3; the owner: "Add a test dungeon to thornvale, one room with each of the new creatures.. level 4"; [creatures-proposal.md](./creatures-proposal.md) "The Proving Pens"): **the Proving Pens**, a trial site in the Hollow Vale to fight the bestiary in, entered by the Scrag Warren's old adit under the north range. Flat at level 4, like a secret dungeon or the Mere Tower, so it is no band and the Keep keeps 4–6 as its own; authored, two floors of five. A room of each of the new four alone (the fire beetles, the goblins, the wraiths, the golems), the vermin together, all four new together, and the two bosses in the floors' halls: the Rat King on the first (his swarm of rats) and the Spider Queen on the second (her brood). It pays as any room of its level does. Lore and a place of its own come later; until then it is a trial, not canon. v1.59 (§7, §17; the owner: "Create new creatures, red fire beetle, goblin, and a graveyard wraith (1.5x size of humanoid), stone golem (2x size of a humanoid)… Also a rat king and spider queen as boss archetypes. We can worry about where they go location wise and lore later"; [creatures-proposal.md](./creatures-proposal.md) "The bestiary"): **the bestiary.** Four foes and two bosses, built in code, given no place yet (no family, no hall: placed later, with their lore). Each mirrors a role, so the contract holds wherever one goes: the **red fire beetle** a rogue's (fire spat at a short range, 8 tiles; its shell DEF 5), the **goblin** a minion's (quick, dodge 12: the Scrag Warren's goblins keep their own look until it's chosen), the **graveyard wraith** a warrior's (a man and a half tall, long-armed, dodge 10; undead where it's placed) and the **stone golem** a warrior's (twice a man, DEF 9, slow; its heavy blow shakes the room). **The Rat King** takes Old Skarn's swarm (rats pour out while he stands) and **the Spider Queen** Captain Garrow's call (her brood at 2/3 and 1/3, and she takes half damage while they stand), each at the HP, ATK and DEF of the boss it mirrors. Measured in those bosses' own halls (3 seeds): the Rat King falls in 69–83 s, the party's lowest 69–78 % (Skarn: 68–74 s, 59–75 %); the Spider Queen in 56–61 s, 69–76 % (Garrow: 53–58 s, 67–68 %); nobody downed. v1.58 (§7, §16; the owner: "Go with your recommendations, spiders in Wickham Keep's cellars.. rats should be 20% bigger"; [creatures-proposal.md](./creatures-proposal.md), world doc v1.36): **the vermin.** Three new foes, each mirroring a role's strength so the contract holds whoever fills a wave: the **grave rat** a minion's (quicker and lighter: dodge 12, speed 4.0, a short reach), the **giant spider** a warrior's (chitin, DEF 6, slower; the cellars' elite), the **spinner** a rogue's (a web spat at range, damage only), and **Old Gutter**, the biggest grave rat, a warrior's (the Cutting's elite, every fifth wave as any elite). Wickham Keep's Old Cellars fill with spiders, spinners and rats (the `cellar` family); the Old Barrows' Cutting with the Redhand's diggers and grave rats, Old Gutter leading (the `cutting` family; the risen minion's place taken by the rat). Not undead. The board's bounty counts Old Gutter as the Barrows' elite he is. v1.57 (§3.1; the owner: "the up and down stairs are too narrow - make them wider and add an arch that slightly glows so its more obvious", then "Option A with the current brightness"; [dungeon-stairs-proposal.md](./dungeon-stairs-proposal.md)): **the stairs under arches.** The way up is drawn three tiles wide (it was one or two: over the stair the sim already keeps clear), and each way stands under a stone arch in its floor's stone, its inner edge softly lit, gold-white up and violet down. Presentation only: the sim's stairs, the well's 6 × 6 and every rule are as they were. v1.56 (§5, §5.1, §17; the owner: "One new skill every 3 levels opens up. No choice after 15. Also every 3rd skill is a passive… Players can also invest to increase passive skill strength just like active. Players can set up to 4 active skills for play."): **the ladder.** A class learns a skill at 1, 3, 6, 9, 12 … 27, every third a passive (9, 18, 27), nothing to choose between; the tiers' pairs (v1.55) all join the ladder. Passives take ranks 1–5 with the same skill points; three a class. A member sets up to **four abilities in play**; the rest wait. Flare at 3 is 1.5× for 18 MP (was 2.0×, 16), so a level-6 party with no healer is still worn down (§7.1). Measured (3 seeds, 300 s, the right party at a same-level room): 3: 23.3 waves (23.3 before), 6: 16.7 (16.7), 9: 13.0 (14.0), 12: 13.0 (14.0), 15: 13.3 (13.0), 18: 12.0 (12.3). Save v36. v1.55 (§5.1, §5.2, §17; the owner confirmed every skill of [skill-trees-proposal.md](./skill-trees-proposal.md) on the review page, "Updated, proceed"): **the tiers.** At 15 and at 18 each class has two abilities and a member carries one of each, the first until it chooses; the first choice is free anywhere, a change after it free at a temple, the dropped one's ranks back as points. Twenty abilities (§5.1's table) and **crowd control** (§5.2): stun, freeze, knockdown (a hold: no step, no blow, the blow being wound up cut), root, pull and knockback; a boss half the time and never moved; 2 s after a hold before another. Measured: the right party holds a same-level room at 15 for 8 % more waves with the first of each pair, 3 % with the second; at 18 4 % and 3 %; the four bosses of 15–18 fall as before, held at most 19 % of a fight. v1.54 (§17; the owner: "fix the Quartermaster to raise a fallen rank"): the Quartermaster's *Issue* stands the last of his ranks to fall up whole where it fell, every 10 s; with none down, the most hurt living one is made whole, as before. It never fired before: his escort was down by 9 s, his first issue due at 10. One he stood up pays nothing when it falls again. At his level he falls in 60–67 s (was 50–54), the party's lowest 73–83 %; a party a level under is downed now and then (it wasn't). v1.53 (§5; the owner: "fix frost nova range"): Frost Nova is thrown onto the thickest knot of foes within the mage's reach, two or more within its 3.5 tiles (was 2.8 round her: she keeps her distance, and the foes stand 2.8 apart, so it never went off). v1.52 (§3.1; the owner: "Go ahead with the dungeon dressing… Dungeons should have a theme and fit the specific dungeon type and quest", [vale-dungeon-dressing.md](./vale-dungeon-dressing.md)): the Vale's authored rooms dressed as their places, doorways lit by their kit, the way in a lit sanctuary, the Breach's columns authored. v1.51 (§3.1, §3.3; the owner: "Same layout every visit, Skarn at
5, halls 10"; [vale-dungeons-plan.md](./vale-dungeons-plan.md)): **the Hollow Vale's dungeons are authored**: two floors
each (the Ninth Milestone one), five spaces a floor at most (the entrance counted; a large corridor, the *gallery*, 60–80
long, counts as one), halls 10 wide, the same rooms in the same places every visit (the seed moves the furniture, the foes'
draws and the chests' places), each laid out and dressed for what it was: a crypt of galleries, a castle then a cave, a
temple laid on its altar then a round crypt. A band of three levels runs over the two floors: a floor's first rooms at its
base + floor − 1, its offshoot and its hall a level up. Old Skarn at 5. v1.50 (§10; the owner: "design Reach and Heights now", [reach-heights-overlands.md](./reach-heights-overlands.md)): the Cinder Reach and the Pale Heights each have their own overland, laid out on the sketches: Ashgate where three imperial roads meet, the Pale Heights' Stair to the crater's Lip, beacon-towers on the imperial roads, each land's own ground (cracked earth and tailings; snow, scree, river ice and the crater's glass). Previews only: no doors, the roads out shut with their words, until their acts are built. v1.49 (§5.1, §9; the owner's decision, [quest-progression-critique.md](./quest-progression-critique.md)): quests pay at the level their dungeon asks (chapters had kept the old map's levels and paid 40–56 % of their share); Act I has a fourth chapter, *The Standard* (Ilse, 9), and Act II waits for it; Tobin Hask's *The Last Chit* (the Quartermaster, 3); *The Sickpools* ends with the Vatwarden, *The Rolls* (17) silences the Choir and saves the rolls on the Abbey's second floor; the Barrows' errands are fought among the dead on its second floor; the level-12 trials are fought at 11–13; Brannoc's *Standing Down* is in the Binding Crypt. v1.48 (§3, §17; the owner's decision, [dungeons-per-map-proposal.md](./dungeons-per-map-proposal.md)): **one dungeon a level.** Every level a player grinds at belongs to exactly one dungeon, a band of three: three floors of a level each, the two rooms before a floor's hall a level up within the band (the hall keeps its floor's level), the boss in floor 3's last hall at the band's top. Emberfall runs 1–18 in six: the Old Barrows (1–3), Wickham Keep (4–6), the Sunken Chapel (7–9), Toadking's Mound (10–12), the Canal Locks (13–15, the Sickpools its third floor) and the Drowned Abbey (16–18). The Tithe Mill and the Scrag Warren leave the Vale; the Old Barrows no longer go on down. Two new bosses: the Quartermaster (*Issue*) and the Vatwarden (*Sluice*); the Standard moves to the Sunken Chapel's last hall, Old Skarn to Wickham Keep's bailey. Each land keeps one **secret dungeon**, which seals for two hours of play after it's cleared and can then be walked again. The Reach opens at 19. v1.47 (§5): everyone who shoots reaches twice as far, the party's mages, shamans, bows and crossbows and the foes' archers, crossbowmen and casters (a mage 7 → 14 tiles, a hunting bow 5 → 10), and a shot flies twice as fast, so it takes as long to land; a rogue picks off the weakest foe within 8 tiles (or its bow's reach), not anywhere in the room. v1.46 (§3.1): rooms come in three sizes (small, medium, large; large as every room was), a floor's descent room always large, a small room holding four foes at once at most; and a second dungeon layout, **halls** (one building of rectangular rooms and short straight halls), for the sites that were built, the caverns kept for what was dug. v1.45 (§10): an inn stands two storeys; homes and shops one, and the square's plaques hang at set heights, so the menu is the same in every town. The towns' back quarters mix the house with a cottage, a longhouse and a workshop, each dressed for its region, and the common things a town has lying about (a stall, the town's colours, lamps, a table, carts, a lane well, the Vale's windmill) stand where they would be, off the roads and out of the way to any door (art critic pass 14). v1.44 (§10, §3): every waystation has a small tavern, a shop with its own shelves, an inn and a shrine, and no forge (world doc v1.31); Saltmere's shop is Pim's chandlery. A boss felled again leaves a Fine or better one fall in twenty, not three in twenty (the farm's Fines were 1.4–2.0 an hour against about 1). v1.43 (§10): the World map (a globe under the Journal: the Old Provinces, and the land you're in with Walk there) and **the Guild's coach** between the towns you've walked to, from a town's square, 10 gold a day of road, at once. v1.42 (§3, §7, §7.1): the wave stops growing at 5 foes, so the right party holds a same-level room at 12 and 15 as it does at 9 (gated now); the XP table from 10 follows the measured rate, so a level takes as long as before. v1.41 (§5.1): the level-12 trials, taught for the Fens; the Fens Chronicle (ten fragments, the Reedholm Undercroft's vault: world doc §7). v1.40 (§9): Act II's quests: two more objective kinds (a word with someone; full cages broken), a chest objective can want a floor, and the compass leads across lands. v1.39 (§9): quests, the board and the Chronicle pay XP as a share of a level, so they keep their weight on the slower curve. v1.38 (§7, §6.3): much slower levels: each level takes 15 % longer than the last, from 20 minutes for level 2 (level 30 in ~126 h of fighting, was ~8 h); expeditions pay a share of active play's XP a minute. v1.37 (§10, §6.2): Saltmere has an inn, the Stilt House (rest, the bench, expeditions); no two in a company share a name. v1.36 (§17): the ground hazard, and the Fens' bosses: the Toadking's mud, Brother Teague's cage, the Drowned Choir's Vespers, the Abbess Below's bells. v1.35 (§17, §10.1): only an elite harvester drops a cage, and the party breaks a cage near it on its own after 3 s with no foe standing; the top bar is two lines, the shrines' boons and Weakened on a third while lit. v1.34 (§17): the Mere Tower's wardens leave their heirlooms, once a bracket, for a class in the party. v1.33 (§6.3): expeditions: send a benched companion on the Guild's road work for 15 min, an hour or four; back with XP, gold and maybe a find. v1.32 (§12): offline progress is in: the time away (up to 4 h) is played through on the same sim behind a progress screen, then summed up. v1.31 (§17): the Mere Tower is in, ahead of Solmere: Wenna's punt from Saltmere from level 12, waves compounding 6 % from a level-9 room, a warden every tenth, no XP, a satchel banked at each landing. v1.30 (§3.6, §8): shrines of three kinds (green mends, red +25 % ATK and blue +25 % DEF for 2 minutes); every company carries one Homeward Scroll. v1.29 (§3.7): no impassable pools in rooms; one or two pillars, monoliths or gibbets out on the floor instead. v1.28 (§17): lamps, cages and the count are in. v1.27 (§9): each town's board posts its own land's jobs; Saltmere's the Fens'. v1.26 (§10): no stream or bridge before Thornwick's gate, on the Vale or in the town. v1.25 (§3): the Fens' own fill the Fens' sites, each mirroring an Ashbound role. v1.24 (§10): a waystation's bar shows its two services, and the sim refuses the ones it lacks by name. v1.23 (§17) brings in **the Old Provinces**, decided by the owner: six regions to a cap of 75, one town each, numbers that compound before any band past 30, skill tiers and a loadout, lamps and the count, the Bowl, the Mere Tower and the Great Beacon (canon in world doc v1.20). v1.22 (§10.1): the weather's icon beside the sky dial, the icon alone, with the word in the dial's tap; clear spells are sunny or partly sunny. v1.21 (§10.1): the wind shows as long, thin gust lines that come and go; the birds, the owl and the dungeon drips are single calls at least 10 s apart; and every kind of sound, the music too, has its own volume slider. v1.20 adds **weather** (§10.1): rain, fog, snow and wind in spells of 20 minutes or more, on the Vale and in the towns, set by the seed and the clock. It's quiet on the screen (mostly the light) and has its own sound. v1.19 opens the **Scrag Warren** (§3, levels 2–5, two floors) under the north range: the hill goblins (skirmisher, bruiser, archer, hexer), and Old Skarn, whose drum brings two more goblins out of the tunnels every 10 s while he stands. Hedda's side quest *Hens Under the Hill* sends you to him. v1.19 also adds a fifth class, the **Shaman** (§5; the hedge-callers, world doc §4): a ranged support with a stacking Spirit Drain that mends the party as it ticks, a party heal over time with an ATK lift (Ancestors' Breath, Col's trial *Old Roads*), and Hex on a knot of foes. It's playable at creation and sits last at every tavern's table. v1.18 sets down the owner's **key pillars** (§1): level-gated skills learned from quests, optional companions worth 5–25 % each, waves that pay for their danger, online and offline grinding on the same rules (with premium windows), the main story apart from side quests, play styles from party make-up, and single-player now with shared spaces later. §12's offline rules follow them. v1.17 adds the one thing the shop sells besides gear: the **Homeward Scroll** (§8), 300 gold or rare loot, read once to stand on the nearest town's square; still no draughts. v1.16 cuts dropped gold (a kill's, a chest's) to 70 % (§8), quest and board rewards unchanged; and those who shoot hold a stand-off (§5, *Bows and crossbows*). v1.15 lays out the towns (§10;
docs/town-layout-proposal.md). Each town is walled: a timber palisade in Thornwick, stone in the later
regions. Its one gate stands on the road where it crosses a stream, and a high street leads up to the
square. Every service's entrance faces the well, so their places in the square change once. On the
approach road the camera leads toward the gate.

v1.14 asks before a shrine is used (§3.6):
touching one opens a card that says what its blessing would do, with Use or Close.

v1.13 opens the forge and the shop (§8, §11):
smith upgrades +1…+5, reforging a trait and salvage at Hale & Daughter's; Wendel's sells the day's
plain gear at your level, buys what you won't use and lets you buy it back. **No draughts**: what keeps
a party standing is who's in it. Elites now drop 1 cinder and bosses 5, so the forge has a second
source besides salvage.

v1.12 settles the words (dialogue critic
pass 1, world doc v1.13): a companion dead until raised is **Slain** (it was Fallen; the code keeps
`fallen`), a lost room's party is **beaten**, the ✦ salvage currency is **cinders** (it was
Embers), and the HUD's Weakened tag shows the minutes left.

v1.11 makes a new companion a time
investment as well as a gold one (§6): a tavern hire, or Brannoc, joins at **half your level, rounded
up**, and learns the rest at your side. Changing companions now costs levels, so you think about it.

v1.10 makes an in-game day an hour of play
(it was 24 minutes) and shows it (§10.1): dawn, day, dusk and night light the town and the overland
differently, and a small sky dial under the cinders tells you which it is. The wage is still paid once
a dawn, the same amount; so are the board, the tavern's roster and the temple's free raise.

v1.9 makes companions a choice and a gold
sink (§6.2): Lantern Guild ranks, a signing fee and a dawn wage, rolled perks for theorycrafting,
loyalty, and the tavern's Ask around and Retrain. It also makes the old tavern traits real.

v1.8 gives the rogue bows and lets its
bows and crossbows shoot (§5, *Bows and crossbows*; §8): a rogue holding one fights from range
instead of closing in.

v1.7 triples the XP a level takes (§7): 300 × L^1.6, so each level is three times the play.

v1.6 caps the tide (§3.3): waves climb to a
top, then fall back and climb again, so a party strong enough for the top can farm a room as long
as it likes.

v1.5 rebalances fights (§7.1): the room sets
the wave, not the party; waves rise with a tide; lulls are a breath, not a full recovery; gear
carries a real share of your power; companions share XP. A lone hero beats level-1 foes but can't
farm them, and same-level rooms from level 4 want the right party in gear at your level.

v1.4 puts the Lantern Guild's board up
(§9): five templates, a new board each in-game day, three jobs held at once.

v1.3 gives every dungeon floor a stair up, one floor at a time, and a site remembers its floors
for the visit (§3.1).

v1.2 adds:
- attributes and stat points (§4.1);
- skills and stances (§5.1);
- character creation and origins (§6.1);
- death and resurrection (§3.6);
- special loot sources (§8);
- hero quests, discovery and the Journal (§9);
- the multiplayer phases (§12).

The build order moved to [development-plan.md](./development-plan.md) and the tech stack to
[architecture.md](./architecture.md). All narrative text is pre-written: there is no
runtime text generation. v1.1 added room-based battles with respawning waves (§3). This supersedes the *game design*
sections of [emberhold-design.md](./emberhold-design.md) (the Necesse-style survival/colony
sandbox is retired). It does **not** supersede the technical architecture (headless
deterministic sim, seed-plus-diff saves, iso renderer), which this design is built on. The
world, story and factions are in [emberfall-world.md](./emberfall-world.md). The art
prototype of record is the current build: Emberlit renderer, cobble tiles with material
variants, and 56 px KayKit actors (see [character-direction.md](./character-direction.md) and
[tile-styles.md](./tile-styles.md)).

> **Working title change:** *Emberhold* → **Emberfall**. The build still says EMBERHOLD; the
> rename is a separate small change.

---

## 1. Vision

**One-liner:** a classic D&D-paperback adventure in a forgotten backwater. You lead a party of
three through towns, overland roads, keeps and dungeons. Battles fight themselves; you choose
the quests, the party, the gear and the tactics.

**Pillars**
1. **Explore.** A fogged overland of small towns and dangerous sites; every dungeon floor
   reveals itself room by room.
2. **Battle, automatically.** Walk into a room with enemies and the party fights on its own.
   Enemies keep respawning until you leave or fall. You steer (position, focus, stance, when
   to leave) but never micro. Readable on a phone at arm's length.
3. **Grow by grinding.** Enemies scale region by region. Progress comes from repeat quests,
   deeper floors and slowly earned gear. The grind is the game, so it must feel good.
4. **Loot is rare and matters.** Few drops, all class-specific, each a visible upgrade on the
   figure itself.
5. **The world holds together.** Every quest, place and enemy comes from one narrative. History
   is discovered in fragments, never lectured.
6. **Plays anywhere.** One thumb, portrait, fully offline. The party keeps adventuring while
   you're away. Multiplayer comes later, on the same deterministic sim.

**Key pillars (the owner, v1.18).** What every feature is checked against:
1. **Skills are earned.** Each skill unlocks at a level and is learned from a quest (the class trials,
   §5.1), never bought. Level gates when; the quest is how.
2. **Companions help; they aren't required.** A lone hero can play the whole game. Each companion
   adds roughly **5 % to 25 %** to the party's combat strength: a green Hand at the bottom, a
   **Beacon** at full loyalty at the top (§6.2). The contract tests hold this band.
3. **Waves that pay for their danger.** A dungeon room's foes come in waves, each a little harder
   than the last (the tide, §3.3), and each pays a little more. Staying is a wager; walking out is
   always allowed.
4. **Grind online and offline, on the same rules.** Offline is the same sim: the same XP, loot and
   wages, and the same risk. A party can be beaten offline, so don't leave it in a room it can't
   hold (§12).
5. **The main story stands apart from side quests.** Chapter quests are the main story: they read
   as such everywhere (★, gold, listed first). Errands, bounties, trials, companions' chains and
   board jobs are side quests (§9).
6. **Many ways to play, from the party.** Who you bring is the strategy: a healer or none, bows or
   blades, two front-liners or one (§5, §7.1).
7. **Single player now; shared places later.** Every region plays alone. Later, a large city where
   players gather: an Arena, social maps and raid dungeons, a party-up system, and global, guild and
   local chat (§12).
8. **Premium is time and room, never power.**
   - Longer **offline windows**: 4 hours free, then 8, 24 or 36 hours.
   - Up to **two extra main-character slots** (§6.1).
   - Nothing that changes a fight.

**Audience and session:** mobile players who like D&D flavour, autobattlers and idle
progression. Sessions of 3–15 minutes: one quest, a town visit, or a single dungeon floor.

---

## 2. Core loops

| Loop | Length | Beats |
|---|---|---|
| **Room** | 30 s – many min | Enter a room with NPCs → autobattle → wave cleared → a breath → the next wave, a little tougher (the tide) → walk out to recover, or the room wins (§3, §7.1). |
| **Quest** | 3–15 min | Town board → pick a mini-quest → travel overland → site (1–5 floors) → objective → return and turn in. |
| **Growth** | days–weeks | Level up, upgrade gear at the smith, hire or find better companions, raise regional renown → unlock the next act and region → harder enemies → grind again. |
| **Offline** | hours | Leave the party farming a room you've held; results are computed on return (§12). |

---

## 3. Rooms and autobattle

### 3.1 Moving through a map
Every site map (the current dungeon levels) is a set of **defined rooms** linked by
**corridors**. You move in two ways:
- **Virtual stick:** touch anywhere and drag (the floating joystick in the build today).
- **Tap to move:** tap a spot, a doorway or a room on the minimap, and the party walks there by
  the shortest path. Tapping a chest, shrine or the stairs (anywhere on it as drawn, lid and orb included: the
  tap is matched against its sprite, not the floor tile under the finger) walks there and uses it.

The party follows the leader in formation. **Corridors are always safe**: nothing spawns or
fights there. The **entrance room** is a safe sanctuary. On **every floor**, a stone stair
against its back wall leads back up, one floor at a time: on a site's first floor it leads out
to the surface; deeper, it climbs to the floor above, arriving in the corridor just outside that
floor's descent room (never inside it). The **descent room** holds the floor's boss and the
stairs down, which go one floor deeper, arriving at the foot of that floor's stair up. The stairs
down are a stone stairwell 6 tiles by 6 cut into the descent room's floor, a brazier either side
of its top step, the flight going down to an arch lit violet (2026-09-30; before, a small marker
on one tile: `docs/stairs-down-before-after.png`). (v1.57) Each way stands under a stone arch in its floor's stone, its
inner edge softly lit (gold-white up, violet down): the way up's at the head of its flight, against the wall, a dark
doorway behind it, the flight drawn three tiles wide; the well's over its far edge, the landing below it. Nothing walks over it; any tile of it takes
you down from its rim. (v1.51, the owner: "The stairs arent obvious enough") The well's violet light rises out of it. (A sign
hung over each stair from v1.51, *▲ Way out*, *▲ Stairs up*, *▼ Stairs down*; v1.89 took them off: the arches and their
light say it.) No stair
skips a floor. A site remembers every floor you've been on for the visit (chests opened, growths
cut, the map uncovered), so going up and down can't refill them; leaving the site ends the visit.

**Room size** (v1.46, the owner: "both halls and the cavern style rooms should generally come in 3 sizes, small,
medium and large with large being what you currently have designed"). Rooms are arenas in three sizes, tiles across
each way: **small** 18–26 (about one screen), **medium** 28–38, **large** 40–62 (about 1.6–2.5 screens wide at the
current zoom: every room before v1.46). A floor's descent room, its boss's hall, is always large; the others come from
a shuffled bag of the three, so a floor of four or more has some of each. A small room holds **four foes at once at
most** (the wave's five from level 8 is four there: no room to spread out and kite in); medium and large take the full
wave (§3.3). The ways between rooms are 6 tiles wide, so the party walks abreast. A level has 6–8 rooms (a site's own:
`sites.js`). (v1.51) The Hollow Vale's floors are authored instead (`src/sim/plans.js`,
[vale-dungeons-plan.md](./vale-dungeons-plan.md)): five spaces at most, the entrance counted, and a **gallery**, a large
corridor 60–80 tiles long and 18–28 across, counts as one; the halls between are 10 wide and 8–14 long, still safe ground.
Each floor runs entrance → its rooms → its hall, with one **offshoot**: a dead end off the way, a level up, worth the
detour (a chest, a shrine, a fragment of the Chronicle). A room names its own foes where the floor mixes them (the Barrows'
Cutting is the Redhand's, the Breach the dead's). Dug rooms are caves inside their box; the Binding Crypt is round.

**Two layouts** (v1.46; [dungeon-halls-proposal.md](./dungeon-halls-proposal.md)). A site picks one:
- (v1.51) **Authored**, for the Hollow Vale's (the Old Barrows, Wickham Keep, the Sunken Chapel, the Ninth Milestone): each
  floor laid out by hand for what the place was (a crypt, a keep, a temple), the same every visit; the two below remain
  for the other lands. (v1.52, [vale-dungeon-dressing.md](./vale-dungeon-dressing.md)) Each room is dressed as its place:
  the tall pieces on the back walls you see, only low ones on the near walls the camera looks over, a set piece on the
  room's axis with a light of its own, never twice in a room, and every count what the room would hold (one light at each doorway of a fighting room), the middle kept open for the fight. A doorway is lit as its place is (the dig's
  lanterns, the crypt's candles, the keep's torches, the chapel's candelabra); a floor's way in, its sanctuary, keeps its
  braziers. The Breach, the balance contract's arena, has its fallen columns authored, the same on every seed.
- **Halls**, for what was built (the Tithe Mill, Wickham Keep, the Sunken Chapel, the Ninth Milestone, Toadking's Mound
  (v1.82), the Canal Locks, the Drowned Abbey, the Mere Tower, the Reedholm Undercroft): one building of rectangular rooms in rows, joined by
  short straight halls (8–12 tiles long, never a bare doorway: the hall is the safe ground out of a fight). Walls
  between the camera and a floor are cut to knee-high stubs, so you see into every room; the back walls stand full.
  Dressed stone: flagstones and ashlar.
- **Caverns**, for what was dug or grew (the Scrag Warren; the Old Barrows' and the Keep's caves are drawn in their plans
  now, the Sickpools are the Locks' third floor, and Toadking's Mound went to halls in v1.82: its caverns ran past what
  Luminati draws): rooms of
  open shapes (rect, oval, diamond, L) scattered in the abyss, joined by corridors, the walls weathered. A cavern
  entrance is never small, and its back walls always stand for the stair up.

### 3.2 The room battle
- **Entering a room with NPCs starts an autobattle** as soon as the party crosses the doorway.
  Every unit acts on its own through a deterministic AI in the 20 Hz sim.
- **NPCs keep respawning.** When a wave is down there's a short lull (about 4 s), then the next
  wave spawns at the room's spawn points, away from the party. Waves come from the room's spawn
  table (enemy family, level and size).
- **The battle continues until the party leaves the room or dies.** There's no victory
  screen. Each wave of a visit rises with the tide (§3.3) up to a cap, then falls back and climbs
  again. A visit ends when you walk out through a doorway (corridors restore you) or when the
  room wins. A party that can hold the top can farm a room for as long as it likes.
- **Enemies are leashed to their room.** They never follow into corridors. When the party
  leaves, the room's survivors fade out and the room resets. It repopulates next time you enter.
- **Rooms show their threat** before you commit: level, enemy family and a skull rating appear
  on the minimap and over the doorway.

### 3.3 Room levels and waves (risk vs reward)
**Every room has a fixed level.** Within one visit the waves rise with the **tide**: each wave is
a step tougher (HP and ATK) than the one before, up to a **cap** (v1.6; v1.69, the owner: "Room waves should be 20
to reach foes at +100% not 18": an ordinary room's step a nineteenth, 5.3 %). The wave after the top is
back at the start ("the room falls back"), and the climb begins again. So the top is what a party
must hold to farm a room indefinitely; anything weaker is worn down on the climb.

| Room | Step | Cap | Waves to the top |
|---|---|---|---|
| Ordinary room | +5.3 % a wave (1/19) | +100 % | 20 (wave 20 at +100 %, wave 21 back at +0 %) |
| Special: a floor's stairs-down hall | +6 % a wave | +150 % | 26 |

The profiles are data (`TIDES` in `sim/battle.js`); a room can name one with `tide`, and the
stairs-down hall uses `hall` by default. The steps are fixed, not rolled.

Levels rise as you **advance deeper**:

- **Deeper rooms are harder.** Rooms are ranked by walking distance from the entrance, and
  every two rooms further in is one level harder. The descent room is always the hardest on
  its floor.
- **Deeper floors are harder.** Each floor down starts where the one above left off:

  room level = 1 + 3 × floor + ⌊rank ÷ 2⌋

  So floor 1 runs from level 1 to 4, floor 2 from 4 to 7, and so on. The entrance room is a
  safe sanctuary (level 0).
- **Every site has its own band (M5, `src/sim/sites.js`):** room level = the site's base + its
  levels a floor × floor + ⌊rank ÷ 2⌋. The Tithe Mill runs 1–3 on one floor, Wickham Keep 3–6 on
  two, the Scrag Warren 2–5 on two (v1.19), the Sunken Chapel 5–8 on two, the Ninth Milestone is 8 throughout; the Old Barrows keep
  the formula above and go on down. A site's last floor ends in its hall, with no stairs down.
- **One dungeon a level (v1.48, the owner: *"not have more than 1 dungeon overlapping what levels to grind"*).**
  Superseding the two rules above, for every site but the secret ones, the Mere Tower and (v1.60) the Proving Pens, a trial site flat at 4:
  - **A dungeon is a band of three levels**, three floors of a level each: floor *n* is the band's base + *n* − 1.
    Every room on a floor is that level, but the two rooms before its hall (by walking order) are a level up, capped
    at the band's top: rooms still pay for their danger. The hall itself keeps its floor's level, so a floor's boss
    meets the party at the floor's own level. The entrance stays a sanctuary.
  - **Each floor is dressed for its place** (a dressing kit: its rooms' furniture, its obstacles, its shallow pools,
    which are walked through, and its light's tint; [art critic pass 18](./art-critic-pass-18.md)). A crypt looks like
    a crypt and a cave like a cave. The Vale's three dungeons each have someone by the way in who names the floors.
  - **Its boss holds floor 3's last hall**, at the band's top. A floor can have a boss of its own besides.
  - (v1.51) **The Hollow Vale's bands run over two floors** (authored, §3.1): floor 1's first rooms at the base, its
    offshoot and its hall at base + 1; floor 2's first room at base + 1, its offshoot, its other room and its hall at
    base + 2, the band's boss there. Each level keeps rooms to hold: two at the base, three at each level above.
  - **The bands run on without a gap or an overlap**, land after land:

    | Levels | Dungeon | Floors | Bosses (the hall's level) |
    |---|---|---|---|
    | 1–3 | The Old Barrows | the Barrow Mouth; the Long Gallery and the Muster Hall (v1.51: two) | the Quartermaster (3) |
    | 4–6 | Wickham Keep | the Bailey; the Barracks and the Old Cellars (v1.51: two) | Old Skarn (5, v1.51), Captain Garrow (6) |
    | 7–9 | The Sunken Chapel | the Nave; the Cult's Cut and the Binding Crypt (v1.51: two) | the Robed Stranger (8), the Standard of the Third Legion (9) |
    | 10–12 | Toadking's Mound | | the Toadking (12) |
    | 13–15 | The Canal Locks | the Lock Halls, the Sluice, Vat Seven (the Sickpools) | the Vatwarden (15) |
    | 16–18 | The Drowned Abbey | | Brother Teague (16), the Drowned Choir (17), the Abbess Below (18) |

  - **A secret dungeon**, one a land, is opened by the land's Chronicle and stands at the land's top level (the Ninth
    Milestone 9, the Reedholm Undercroft 18). When its vault is opened it **seals for two hours of play**
    (`SECRET_REST`), then can be walked again on a fresh floor. Its heirloom comes once; later its vault holds an
    ordinary find. It's a timed bonus, not a band.
  - **The Mere Tower** pays no XP, so it competes with no band.
  - **No dungeon goes on down.** A dungeon may widen to four or five levels later if a land wants fewer of them.
  - The Tithe Mill and the Scrag Warren are kept, out of play, for the Cinder Reach (the Assay Yards, the Cold Seam).
- **Bosses (M5):** a floor's stairs-down hall can hold its site's boss (`sites.js`), who opens
  the fight with an escort; once it falls, the hall goes quiet for the visit. Each has one
  signature mechanic: Captain Garrow (Wickham Keep) calls two of his men at 2/3 and 1/3 HP and takes
  half damage while they stand; the Robed Stranger (the Sunken Chapel) raises the last foe slain
  every 12 s; the Standard of the Third Legion (the Old Barrows' third floor, optional and
  repeatable) halves the damage taken by the Ashbound within 4 tiles of it; Old Skarn (the Scrag Warren's
  second floor, repeatable, v1.19) drums while he stands, and every 10 s two goblins (a skirmisher and an archer)
  come out at the hall's far side, never more than four of his up at once: the fight is a race to him.
  ![The Scrag Warren: the goblins, Old Skarn, the warren's door on the Vale, a room fight](img/scrag-warren.jpg) A story boss falls
  once; a boss's first fall leaves its heirloom and a Fine or better item, and each later fall a Fine or better one time
  in twenty (v1.44: 15 % before, and re-felling a floor's boss each visit was most of a farm's Fines). The HUD shows
  a boss's name and health under the room pill, with a shield while it's guarded.
- **Who fights** is the site's family (M5, `battle.js` FAMILIES): the Ashbound in the barrows; the
  Redhand Company (cutthroat, brute, crossbowman; their elite a Sergeant) in the Tithe Mill and
  Wickham Keep, with the Ashbound they dug up on the Keep's second floor; the Ashbound and Cinder
  acolytes in the Sunken Chapel; the hill goblins in the Scrag Warren (v1.19: skirmisher, bruiser,
  archer, hexer; their elite a bruiser); (v1.25, M8) in the Fens, the Toadking's men at the Mound (fen ghoul,
  reed-cutter, fowler, bog-witch; their elite the reeve, a reed-cutter), the bound lock-men and then the Cult's harvest at the
  Locks (minion, harvester, Ashbound rogue, acolyte), the harvest at the Sickpools (fen ghoul, harvester, Ashbound rogue,
  bog-witch) and the drowned clergy at the Abbey (brother, harvester, Ashbound rogue, cantor); the Fens' elite is a
  harvester. Each Redhand, goblin or Fens archetype mirrors an Ashbound role's strength, so a
  room's difficulty is its level whoever fills it; bandits carry more coin. Turn Undead reaches only
  the Ashbound.
- **Enemy stats** = archetype base × (1 + 0.14 × (level − 1)) for HP and DEF, and
  × (1 + 0.12 × (level − 1)) for ATK; above level 3, × (1 + 0.05 × (level − 3)) more (the
  premium for the party and gear a same-level room expects, §7.1); × the tide. XP and gold per
  kill scale with the room's level, so deeper rooms pay more.
- **The room sets the wave size, not the party (v1.5):** 2 foes to room level 3, then
  1 + ⌊level ÷ 2⌋ (3 at 4–5, 4 at 6–7), and (v1.42) **5 from level 8 on**. It went on to 7 at 12, and the right party
  held a same-level room 4–8 waves from 12 to 15 against the contract's 10+ (§7.1); with 5 it holds 10–13, and the foes
  still grow with their level. Archers and skeleton mages
  make up to a third of a wave, and at least one in every second wave. Every fifth wave an
  **elite** takes one slot.
- **The lull is 4 s,** a breath: regen runs at 1.5× (5× in corridors and towns). Downed
  companions get back up at 25 % HP when a wave is cleared.
- **Rooms show their threat** before you commit. Each discovered room's level is on the
  minimap, coloured against your level:

  | Room vs your level | Colour | Reads as |
  |---|---|---|
  | at or below | gold | even match |
  | +1 | amber | a step up |
  | +2 | orange | dangerous |
  | +3 or more | red | deadly |

  Entering a room shows its level.
- **Bosses don't respawn with waves.** A floor's boss spawns once per visit to the site (or
  once per day in the post-game Undervaults).

The grind decision is **how deep to push**. Farm a room at your level safely and
indefinitely, or step into a deeper room for better XP and gold at real risk.

### 3.3b The floor's gate (v1.70)

The owner, 2026-11-11: *"A gate prevents a player from moving to the next room until they have survived 20 waves. Then
the gate drops down into the ground and disappears. Once open, always open for that game slot. Adds a feeling and
challenge for progression."*

- **Where:** every floor's last hall (its stairs down, or a last floor's end and its boss) is behind an iron gate.
  It stands across every way in: the corridor's tiles that touch the hall.
- **What opens it:** **20 waves held in one visit** of the room before it, the room its corridor leads back to. That's
  the tide's top (§3.3), so it's the room held at full strength. The entrance has no waves; a hall straight off the
  entrance is won in the floor's hardest room.
  - A wipe, or walking out, starts the count again.
  - Waves held anywhere else don't count.
- **When it opens:** it sinks into the floor in a second and a half ("The gate is down"), and its tiles are walked.
- **Once open, open for good, in that slot:** saved as `gates` (`site:floor`; save v41). Leave, come back, load:
  still open. Another slot has its own.
- **Old saves (v40):** a floor's gate comes back open where its hall's boss is down, and on every floor above the one
  the save was made on.
- **The Mere Tower** has none: its landings are its waves.
- **The player sees:**
  - the room's entry banner: "hold 20 waves to drop the gate";
  - the wave pill: "GATE 12/20";
  - the compass: "The gate · hold 20 waves in the room before it", until it's down, then "Stairs down".
- **Code:** `sim/world.js` `gateOf` (pure: the same floor gives the same gate), `isWalkable` (a shut gate's tiles),
  `battle.js` (the twentieth wave), `core.js` (`state.gates`, applied to every floor built), `travel.js` (the compass).
  Drawn by `tools/render3d/world.js` `placeGate`. Tests: `test/gate.test.mjs`.

### 3.4 What the player controls (one thumb)
- **Position** (stick or tap): move the leader within the room. The party re-forms around
  them, so you can pull enemies, step round a pillar, or reach a chest. Stop steering and the
  leader **autobattles** after half a second: it chases and strikes on its own, routing
  around pillars and pools. It never walks out of the room by itself.
- **Leave** (walk out a doorway): the only way to end a battle alive. Getting out *is* the
  retreat, so movement matters most when things go wrong.
- **Focus** (tap an enemy): the party prioritises that target until it dies.
- **Stance** (toggle): *Aggressive* (chase, spend MP freely), *Balanced*, or *Defensive*
  (hold formation, save MP for heals and shields).
- **No potions** (v1.13; once planned as an auto toggle): the shop sells no draughts. Healing
  in a fight is the cleric's, so the party's make-up matters.

### 3.5 AI and formation
Each unit picks a target by role: the front line takes the nearest threat, the rogue the
lowest HP or the back line, and the mage clusters. Abilities cast when MP and conditions allow
(§5). Attack intervals are class-fixed: fighter 1.3 s, rogue 0.9 s, mage 1.6 s. Enemies use
archetype AI: Ashbound mages raise and buff, and Cult necromancers resurrect. Formation is
front (fighter), mid (rogue) and back (mage): foes reach for the front line first, counting
the rogue 1 tile and the mage 2.5 tiles further away than they are (shipped at M3). The mage
backs off from anything within 3.2 tiles (melee foes reach 2.8–3). A full party of three
faces the same wave a lone hero would (v1.5): companions are added strength. The lull is only a
breath (§3.3), so healing and sustain decide how long a party can stay.

### 3.6 Death, resurrection and defeat
**States:** Healthy → **Downed** (0 HP in battle) → **Slain** (dead) → resurrected.

- **Downed:** if the wave is cleared, Downed members rise in the lull at 20 % HP.
- **Downed → Slain** happens when a member is downed a **second time in the same room
  visit** — counted in waves back to back: standing through one cleared wave forgets the
  earlier down — or when the party **leaves the
  room** with them still Downed.
- **Slain:**
  - the member follows as a ghost: no fighting, no XP;
  - they can be resurrected at a **Temple** (25 gold × level; free once a day for heroes at
    level 5 or lower), at a site **Shrine** (one use each), or with a rare **Phoenix Ember**.
    A Cleric's *Lifeline* (9, v1.56) keeps one ally a room visit from going down at all.
- **The hero** stays Downed, never Slain, while any companion stands.
- **The lull** is 4 s at 1.5× regen, and the room doesn't wait (v1.5; it had waited until
  everyone was back over 60 %, which let a room be held forever).
- **Temple:** an in-game day is an hour of play (§10.1). **Shrine:** with nobody Slain it
  restores the party instead (HP and MP, everyone standing). **A touch asks first (v1.14):** a card
  says what its blessing would do now: it raises the first of the slain (by name) at half health,
  or mends everyone standing, with each one's HP and MP. It notes it's one use, and offers **Use**
  or **Close**. Close leaves it lit for later; so does a touch with nobody Slain and everyone whole,
  where Use is off and says why. A fight's chase doesn't close the card: Use walks back to the
  shrine and uses it there. The sim checks the use (`useShrine`): unspent, in reach, needed
  (`src/ui/shrine.js`, `src/sim/core.js`). It always says what it did. A fragment written on it is read at the first touch either
  way. On screen (`src/render/gsprite.js` voxShrine), a shrine stands as tall as a hero: a stepped
  plinth, a pillar and a big aqua orb, against a far wall so no wall hides it. An unused one carries
  the word *Shrine*, with what it does underneath as you come near. A spent one stays, its orb dark
  stone. **Three kinds (v1.30; the owner, 2026-10-04),** by the orb, named on screen and on the card (never the
  colour alone): a **green** *Shrine of Mending* (v1.84; the owner: "Shrine of mending should buff hp regen rate for 2
  min") gives the whole party **+100 % HP regeneration for 2 minutes**, and raises the first of the Slain at half
  health as it does (no longer an instant fill of HP and MP); a **red** *Shrine of Might* gives the whole
  party **+25 % ATK for 2 minutes**; a **blue** *Shrine of Warding* **+25 % DEF for 2 minutes**. A shrine's kind is
  its tile's, by the floor's seed (about 40 % green, 30 % red, 30 % blue), so the same shrine is the same colour
  every visit. A boon runs on the game's clock, in a fight or out, on any floor; the HUD shows it with the time left,
  it's saved (v20; the green's v44), and another of the same kind sets it back to 2 minutes rather than stacking. Any
  of the three is worth using whole, so its Use is off only with nobody standing (and, for a green one, nobody Slain)
  (`src/sim/shrines.js`). **Inn rest:** 5 gold × your
  level; full HP and MP, and lifts Weakened.
- **Wipe:** if everyone is down, the party wakes at the region town's **Temple**:
  - everyone is restored to 30 % HP and Slain status is cleared;
  - you lose **25 % of carried gold** (gold banks when you visit a town);
  - everyone is **Weakened** (−10 % stats) until they rest at the inn or 10 minutes pass;
  - you keep your XP and gear;
  - (v1.7) before the town, a **defeat screen** says where the party fell (site, floor, room level,
    wave), who struck the last blow, how long it held and what was left standing, and what the wipe
    costs. *Wake at the Shrine* goes on to the Temple (`src/ui/defeat.js`).
- There is no permadeath; *Hardcore* is an opt-in at creation (later).

Details are in [development-plan.md §2.10](./development-plan.md).

### 3.7 Readability
At the current zoom (25 tiles across) figures are about 54 pt tall. Each unit shows HP/MP pips
overhead, floating damage numbers, a crit flash and a dodge "miss". A small room banner shows
the room's level and the wave number. (v1.29) Every floor tile of a room walks: the hazard pools (lava, poison, ice,
water, pits) that were cut into rooms, impassable and spreading with depth, made a room too hard to cross (the owner,
2026-10-04). Instead one or two standing obstacles stand out on each fighting room's open floor, sparingly, with open
ground all round: a pillar taller than the walls, a monolith, or an empty gibbet-cage on its post. The ground hazard to
come (M8.6) is a separate rule: ground you can walk, at a cost. Before / after (a stone room, then a green one): `docs/img/rooms-open.jpg`.

---

## 4. Stats

| Stat | Meaning | Rule |
|---|---|---|
| **HP** | Hit points | 0 = the unit falls. |
| **MP** | Mana | Spent on abilities. Basic attacks are free. |
| **ATK** | Attack power | Raw damage = ATK × ability power (basic attack = 1.0). Covers weapons and spells. |
| **DEF** | Defence | Mitigation = DEF ÷ (DEF + 25 + 5 × attacker level). About 30 % at even gear; better armour pushes it up. |
| **CRIT** | Critical-hit chance % | A crit deals ×1.75 damage. Cap 60 %. |
| **DODGE** | Dodge chance % | Avoids a hit entirely. Rolled before crit. Cap 50 %. |
| **HP regen** | HP per second | As listed at level 1, growing in step with max HP. **×5 out of battle** (corridors, the overland, towns), ×1.5 in a room's lulls; full heal at shrines and inns. |
| **MP regen** | MP per second | Same rules as HP regen. |

Damage per hit = max(1, ATK × power × (1 − mitigation)) × (crit ? 1.75 : 1), unless dodged.
Everything rolls from the seeded sim RNG, so a battle is reproducible from its inputs (this
enables offline results, replays and multiplayer validation).

### 4.1 Attributes and stat points
Four attributes feed the derived stats above:

| Attribute | Feeds | Per point (starting values, tuned by the balance harness) |
|---|---|---|
| **Might** | ATK | +0.4 ATK |
| **Grit** | HP, DEF | +3.5 HP, +0.3 DEF |
| **Finesse** | CRIT, DODGE | +0.25 % CRIT, +0.2 % DODGE |
| **Focus** | MP, MP regen, ability power | +2.5 MP, +0.03 MP/s, +0.5 % ability power |

- **Points:** each level-up grants **3 points**. Class growth per level stays automatic: the
  class-table growth minus what the recommended build adds (fighter 7 HP, 2 MP, 1.6 ATK,
  1.4 DEF; rogue 6.5 / 3 / 1.8 / 0.9; mage 8 / 3 / 2.0 / 0.8).
- **Recommended build** (one level's points): fighter Grit, Might, Grit; rogue Might,
  Finesse, Grit; mage Focus, Might, Focus. It reproduces the class-table HP, MP, ATK and DEF
  exactly; its CRIT, DODGE, MP regen and ability power are the build's own edge. Choice adds
  variety, not power creep. Unspent points aren't stored: they follow from your level.
- **Companions** auto-allocate by class template, or you manage them yourself.
- **Respec** at the temple: the first is free, then 20 gold × level.
- **Gear** adds on top (§8). A fresh character in the class kit has exactly the class-table
  numbers.

---

## 5. Classes

Five classes. Each has **base stats at level 1**, **growth per level**, a skill every
three levels (v1.56, §5.1: seven abilities and three passives to 27). The Cleric joined at M3 (sourced
from the Grey Sisters, world doc §4): playable at creation and hireable at every tavern. The
**Shaman** joined at v1.19 (the Vale's hedge-callers, world doc §4), the same way.

| | **Fighter** | **Rogue** | **Mage** | **Cleric** | **Shaman** (v1.19) |
|---|---|---|---|---|---|
| Role | Front line, tank | Burst, crits, evasion | Ranged spells, area damage, shields | Support: heals, blessings, the bane of the dead | Ranged support: drains over time, heals over time, hexes; strongest in a long fight |
| HP | 140 (+14/lvl) | 100 (+10) | 80 (+8) | 125 (+12) | 98 (+9.5) |
| MP | 20 (+2) | 30 (+3) | 80 (+8) | 50 (+5) | 58 (+6) |
| ATK | 12 (+2.0) | 13 (+2.2) | 14 (+2.4) | 11 (+1.8) | 12.5 (+2.0) |
| DEF | 14 (+2.0) | 8 (+1.2) | 6 (+0.8) | 12 (+1.8) | 7 (+1.2) |
| CRIT | 5 % | **15 %** | 8 % | 5 % | 6 % |
| DODGE | 5 % | **15 %** | 5 % | 5 % | 6 % |
| HP regen | **2.0 /s** | 1.2 /s | 0.8 /s | 1.6 /s | 1.3 /s |
| MP regen | 0.5 /s | 0.8 /s | **2.0 /s** | 1.5 /s | 1.7 /s |
| Class bonus | +10 % DEF while carrying a shield | Crits from behind the target deal +25 % | Spells deal +20 % to a foe with two or more others within 2 tiles | Heals are +20 % stronger | A spirit bolt at range (12 tiles, every 1.5 s); stands off like the mage |
| Abilities | **Cleave** (10 MP: 1.3× to target and adjacent) · **Shield Wall** (20 MP: +50 % DEF for 6 s, taunt) · **Second Wind** (25 MP: heal 25 % HP) | **Backstab** (10 MP: 1.6×, +25 % crit) · **Smoke Step** (15 MP: +30 % dodge for 5 s, drop aggro) · **Venom** (20 MP: poison over time) | **Firebolt** (12 MP: 1.8×) · **Frost Nova** (30 MP: 0.8× to every foe within 3.5 tiles of the thickest knot of them in the mage's reach, slowed 3 s; v1.53: thrown and 3.5 tiles, as Hex is. Cast round the mage, who keeps her distance, it never went off, and at 2.8 tiles it could take no two foes: they stand 2.8 apart, their melee reach round whoever they fight) · **Arcane Ward** (25 MP: shield an ally for 30 % of their max HP) | **Mend** (12 MP: heal the most hurt ally 22 % of max HP) · **Bless** (25 MP: the party +15 % ATK and DEF for 8 s) · **Turn Undead** (30 MP: 1.6× to every Ashbound within 3¾ tiles; v1.87) | **Spirit Drain** (9 MP: 0.7×, then a drain of 0.12× ATK a second for 8 s that stacks to 5; each tick mends the most hurt ally for half of it) · **Ancestors' Breath** (22 MP: the party gets 5 % of max HP back a second and +10 % ATK for 6 s) · **Hex** (22 MP: the foes within 3.5 tiles of the thickest knot, or a lone boss or elite, −20 % ATK and DEF for 8 s) |
| Passives (v1.56) | *Iron Hide* (9), *Hold the Line* (18), *Heavy Hand* (27) | *Opportunist* (9), *Keen Edge* (18), *Exploit* (27) | *Kindled Mind* (9), *Arcane Focus* (18), *Frostbite* (27) | *Lifeline* (9), *Devotion* (18), *Radiance* (27) | *Old Ways* (9), *Ancestral Guard* (18), *Deep Hex* (27) |
| Model (KayKit) | Knight / Barbarian | Rogue / Rogue Hooded | Mage | Mage, bareheaded, in off-white vestments with a grey stole, a flanged mace (our own model) and a chained psalter | Mage, bareheaded with a grey braid, in undyed wool and hide with a moss cape and a staff hung with bones |

The class bonuses sit on top of the class table: a fighter in the class kit (with its round
shield) has 15.4 DEF. The cleric's kit is a mace, a chained psalter, vestments and pilgrim boots.
It carries the same stats as the fighter-style kit it replaced (sword, kite shield, plate and
sabatons), so the class's numbers are unchanged; only its look is different. The cleric can also
wear the fighter's sword, shields, great helm, plate and sabatons, and has two more items of its
own (Chapel Sword, Book of Hours). Recommended build: Grit, Focus, Grit.

**The Shaman (v1.19).** The kit is a Spirit Staff, Hide Robes and Wrapped Boots, with an Antler Rod, a Bone Fetish
and a Hide Cowl to find. Recommended build: Focus, Grit, Might. Their gear drops the way all gear does (the owner,
2026-10-03): 80 % of drops are for the party's classes, the rest for any of the five. A fighter + rogue
+ cleric party now sees 3.3 % shaman pieces and can wear 93.3 % of what drops (95.9 % with four classes);
a party with a shaman sees 25.3 % (21.9 % before). How much drops is unchanged. A shaman
sellsword sits last at every tavern's table and can carry *Devout*, *Field Medic* or their own *Deep Drinker*
(Spirit Drain lasts 2 s longer).
- **What they're for.** A party's healer and a boss's undoing. The drain is slow to build and mends as it goes,
  so the longer the fight, the more it does. Measured (`roomlv.mjs` 300 s at the room's level, fighter + rogue
  + shaman, hires 1,4, 3 seeds; trials done):
  - level 6: held all three runs (17 / 15 / 16 waves; the cleric's party 16 / 15);
  - level 9: held all three runs (14 / 14 / 13 waves; the cleric's 13 held / 13 beaten).
  Its troughs are lower (heals over time, not on the spot), and its bosses fall faster (`boss.mjs --healer
  shaman`, 4 seeds against the cleric's 3):
  | Boss | Shaman's party | Cleric's party |
  |---|---|---|
  | Garrow (Wickham Keep, L6) | 44–52 s | 55–61 s |
  | Old Skarn (the Scrag Warren, L5) | 70–78 s, a down or two | 93–108 s |
  | The Robed Stranger (the Sunken Chapel, L8) | 47–61 s | 52–78 s |
  | The Standard (the Old Barrows, L9) | 63–107 s | 80–101 s |
- **Alone** (the contract): at level 1 a lone shaman lasts 4–8 waves (the mage 4–7); at level 6, 1–2.

![The mage, the cleric and the shaman on the Stage](img/shaman.jpg)

**Bows and crossbows (v1.8).** A rogue fights with what they hold. Daggers close in, as
before. A rogue holding a bow or crossbow shoots from range. Like the mage, they back off from
whatever comes at them and fight at the mage's run speed (6.4). Backstab, Venom and the
crits-from-behind bonus all still apply, as shots.

**The stand-off (2026-10-03).** Everyone who shoots (a mage, a rogue with a bow or crossbow,
and the hero in autobattle when it's one of those) keeps min(5, its range − 0.5) tiles from
every foe.
- Inside that, it steps away from the press, each foe pushing by how near it is, and round a
  wall if one's behind.
- It still takes a ready shot while nothing is within 3.4 tiles.
- Cornered, it stands and shoots.
- Outside the stand-off, it closes to its range and shoots.

Before this, they backed off only once a foe was within 3.0–3.2 tiles, and melee reaches
2.8–3. At level 6 a bow rogue spent 26–29 % of a fight within 3.5 tiles of a foe, and a mage
companion 18 %. Now they spend 2–4 % and 1 % (`roomlv`-style runs, fighter + bow rogue +
cleric or mage). Their reach is unchanged.

| Weapon | Hands | Shot every | Reach | ATK (base + per level) | Notes |
|---|---|---|---|---|---|
| Dagger (+ parrying dagger) | 1 (+1) | 0.9 s | melee | 0.9 + 0.32 (+0.5 + 0.15) | the class kit |
| Hunting Bow | 2 | 0.95 s | 10 tiles | 1.4 + 0.5, CRIT | quick and light (a poacher's bow) |
| Yew Longbow | 2 | 1.1 s | 13 tiles | 1.8 + 0.6, CRIT | Greyholt work |
| Hand Crossbow | 1 | 1.05 s | 10 tiles | 1.1 + 0.36 | keeps the parrying dagger |
| Heavy Crossbow, Ashbound Arbalest | 2 | 1.35 s | 12 tiles | 1.8 + 0.62 / 1.7 + 0.6 | hits hardest, slowest |

**Twice the reach (v1.47).** The owner: *"Ranged combat is too close, double the current target range."* Everyone who
shoots reaches twice as far: the mage 14 tiles, the shaman 12, the bows and crossbows above (they were 5, 6.5, 5 and
6); and the foes' skeleton archers 12, crossbowmen, goblin archers and fowlers 13, and every caster (a skeleton mage, an
acolyte, a hexer, a bog-witch, a cantor, and the bosses built on them) 14. The stand-off is unchanged: min(5, reach −
0.5) tiles from every foe.
- **A shot flies twice as fast** (26 tiles a second, was 13), so it lands as soon after it's loosed as it did.
- **A rogue picks off the weakest foe within 8 tiles**, or within its bow's reach, else the nearest. With the foes'
  shooters standing twice as far back, "the weakest anywhere" sent a dagger rogue on runs across the room: the right
  party held a level-9 room 11.5 waves on average over six seeds, against 13.0, and two seeds fell to 9.
- **Measured** (`roomlv.mjs`, 300 s, four seeds, before → after, waves held on average):

  | Level | Fighter, rogue, cleric | With a longbow rogue | With a mage hero | A lone knight |
  |---|---|---|---|---|
  | 3 | 24.5 → 24.0 | 24.5 → 26.0 | 26.2 → 27.2 | 4.0 → 4.0 |
  | 6 | 16.8 → 17.2 | 16.5 → 18.2 | 17.0 → 18.0 | 0.8 → 0.2 |
  | 9 | 12.5 → 12.8 | 11.8 → 14.5 | 13.5 → 13.2 | 0 → 0 |
  | 12 | 12.2 → 12.0 | 10.8 → 14.2 | 12.5 → 13.5 | 0 → 0 |
  | 15 | 11.5 → 13.0 | 12.2 → 14.0 | 13.0 → 13.5 | 0 → 0 |

  The contract's party is where it was, and the smoke test's contract holds. A bow rogue gains about two waves from
  level 6: twice the reach is worth something, and a bow is now the stronger pick late. If it should match the dagger,
  the knob is the bows' ATK or interval.
- In a level-6 fight a bow rogue's shots leave from 9.3 tiles (the median; it was 4.8) and a mage's from 11.4
  (`test/ranged.test.mjs`).

The trade is reach for the front line. Measured before v1.47 with `roomlv.mjs --rogue <weapon>` (4 seeds,
5 minutes, fighter + rogue + cleric in the class kit at the room's level):
- **Waves held:**
  - level 3: every weapon 22–23 waves;
  - level 6: 15.5–16 waves (dagger 15.8);
  - level 9: 12.2–13.5 waves (dagger 13.5).
- **Party defeats:** at level 9 one run in four is a defeat with each bow or crossbow; with the
  dagger, none.
- **Damage:** the bow rogue deals as much as the dagger rogue (level 9: 6,522 against 5,927).
  But the melee foes it no longer stands among go for the cleric, who takes twice the hits.
- **Alone, the ranged rogue is about level with the mage** (§7.1 class notes):
  - level 1: bows last 13–17 waves (the mage 14), crossbows 4–13;
  - level 6: 1–3 waves in all but one run (one hunting-bow run lasted 6; the mage 2–4).
  - Neither farms forever.

**Future class** (sourced from the Grey Sisters in the world doc):
- **Healer**: pure support. *Renew* (heal over time), *Purge* (cleanse poison and slow), and
  *Sanctuary* (a party-wide heal). *Lifeline* became the Cleric's passive.

Both slot in with the same stat block and ability format. No system changes are needed.

### 5.1 Skills, ranks and stances
- **Unlocks:**
  - the level-1 ability comes at creation;
  - the level-6 and level-12 abilities unlock through **class trials**, short quests (§9).
    (M5) The level-6 trials are the company's, not the hero's: a trial is offered when anyone of
    that class in the party or on the bench is level 6+, and once done every member of the class
    knows the ability, companions hired later included. Teachers: Osric (fighter), Nell Tolley
    (rogue), Hedda (mage), Sister Ilse (cleric), Col the carter (shaman, v1.19: *Old Roads*, six waves
    in the Scrag Warren). Handing a trial in says so in the conversation,
    under the quest's own reward note: *New skill learned: Smoke Step · every rogue in your company
    knows it*, with what the skill does (`src/ui/dialogue.js`; the HUD says it too).
    (v1.41, M8) The level-12 abilities have trials of their own, set for the Fens: offered when anyone of the
    class is 12 and its level-6 trial is done. (v1.49) Each is fought where a level-12 company fights, at 11–13: *The
    Long Watch* (Osric: the Mound's second-floor hall, 10 waves), *Dead Water* (Wren, while she's with you: 5 of the
    Canal Locks' wave leaders), *Lamp Oil* (Pim Rushlight: 8 waves in the Canal Locks), *Vigil* (Mother Agnes: 6
    waves on the Mound's third floor), *The Old Water* (Col: 8 waves on Toadking's Mound's second floor). (Since
    v1.48 three of them were in rooms of 14–16, two to four levels up.) Each pays 30 % of level 12. A save from before them (v26) counts every class someone had at 12 as done;
  - (v1.56) **the ladder**: a skill every three levels, every third a passive (below); the 3, 15, 21 and 24 abilities
    and the passives come with the level.
- **Skill points:** 1 at every even level, into abilities or passives (v1.56). Ranks 1–5; each rank of an ability adds
  +10 % power, and ranks 3 and 5 also cost 1 MP less; each rank of a passive adds its step (the table below).
  - **Power** multiplies the number that matters: damage for a strike or nova, the bonus for a
    guard or Bless, the amount for a heal or ward. Durations stay the same.
  - **The Skills tab says it in numbers** (`src/ui/sheet.js`, with `skillMult` in
    `src/sim/skills.js`, the same multiplier battle.js casts with, Rare gear and the power stat
    included). It shows the member's own effect at their rank, e.g. *Rank 2: 12 MP · 1.98× ATK (56)
    at range*, with the ATK it comes to before the foe's armour. Under it, what the next rank
    changes: *Rank 3 → 11 MP · 2.16× ATK (61)*.
- **Auto-cast:** each ability has an auto-cast toggle and a priority order, set in the
  **Skills** tab of the character window.
- **Stance** per member (§3.4) is set in the same tab:
  - *Aggressive*: +10 % ATK, −10 % DEF; spends MP freely, heals and guards only below 30 %
    HP, and a fighter companion picks its own targets.
  - *Balanced*: no modifiers; strikes freely, and holds back MP for a guard or heal once
    anyone is below half HP.
  - *Defensive*: −10 % ATK, +15 % DEF; keeps half its MP for guards and heals (below 65 %
    HP), and melee companions fight only what comes within 5 tiles of the leader.
- **Casting order:** on its turn a member casts the first ability, top down in its priority
  order, that is unlocked, on auto-cast, affordable and worth it (a guard when threatened, a
  heal when hurt, a ward on the most hurt ally, a nova on two or more foes close by);
  otherwise a strike replaces the basic attack.
- **Rare gear modifiers** (§8) stack with ranks.
- **The ladder (v1.56; it replaces v1.55's tiers, the choice of one of two at 15 and at 18):** a class learns a skill
  every three levels, at 1, then 3, 6, 9 … 27, and every third is a **passive**. Nothing to choose between: the ten skills
  of v1.55's pairs all join the ladder (`src/sim/skills.js` `SKILLS`, `PASSIVES`, `ladderOf`). The 6 and 12 abilities keep
  their trials; the rest come with the level. Laid out to 27 for now (the Fens' content runs to 18); the ladder goes on, a
  skill every three levels, as the regions open (§17).

  | Lv | Fighter | Rogue | Mage | Cleric | Shaman |
  |---|---|---|---|---|---|
  | 1 | Cleave | Backstab | Firebolt | Mend | Spirit Drain |
  | 3 | Cutting Wave | Kidney Shot | Flare | Consecrate | Old Marks |
  | 6 | Shield Wall (trial) | Smoke Step (trial) | Frost Nova (trial) | Bless (trial) | Ancestors' Breath (trial) |
  | 9 | *Iron Hide* | *Opportunist* | *Kindled Mind* | *Lifeline* | *Old Ways* |
  | 12 | Second Wind (trial) | Venom (trial) | Arcane Ward (trial) | Turn Undead (trial) | Hex (trial) |
  | 15 | Vault | Fan of Knives | Gather | Sanctuary | Binding Roots |
  | 18 | *Hold the Line* | *Keen Edge* | *Arcane Focus* | *Devotion* | *Ancestral Guard* |
  | 21 | Earthshatter | Shadowstep | Glacial Tomb | Judgement | Thunder Drum |
  | 24 | Whirling Blades | Caltrops | Blizzard | Revive | Spirit Totem |
  | 27 | *Heavy Hand* | *Exploit* | *Frostbite* | *Radiance* | *Deep Hex* |

  The abilities are v1.55's, with one change: **Flare** comes at 3 at **1.5× for 18 MP** (was 2.0× for 16, and a pair
  ability, wanting two foes): at 2.0× a level-6 party with no healer held 16–17 waves where §7.1 wants it worn down;
  now 10–13, as before Flare came so early.
- **The passives (v1.56)** are always at work: no MP, no turn, no place in the loadout. Ranks 1–5, a step a rank:

  | Passive | Lv | Rank 1 → 5 | What it does |
  |---|---|---|---|
  | Iron Hide | 9 | 8 → 16 % | +DEF; HP regen doubles below 30 % HP |
  | Hold the Line | 18 | 5 → 9 % | allies within 3 tiles of the fighter take less damage |
  | Heavy Hand | 27 | 20 → 40 % | a plain blow also strikes the foes beside its target, for that share |
  | Opportunist | 9 | 3 → 7 MP | a critical hit gives MP back |
  | Keen Edge | 18 | 4 → 8 | crit chance |
  | Exploit | 27 | 15 → 35 % | more damage to a foe stunned, frozen, knocked down or rooted |
  | Kindled Mind | 9 | 15 → 35 % | MP regen |
  | Arcane Focus | 18 | 6 → 14 % | the mage's abilities stronger |
  | Frostbite | 27 | 12 → 24 % | more damage to a foe slowed, chilled or frozen |
  | Lifeline | 9 | 5 → 17 % | once a room visit, an ally who would be Downed holds on at that share of max HP (was 1 HP) |
  | Devotion | 18 | 6 → 14 % | heals stronger |
  | Radiance | 27 | 0.4 → 0.8 % a second | in a fight, allies within 3 tiles mend that share of max HP |
  | Old Ways | 9 | +1 → +5 | Spirit Drain stacks higher, and each tick gives 1 MP back |
  | Ancestral Guard | 18 | 8 → 16 % | allies under 30 % HP take less damage |
  | Deep Hex | 27 | 8 → 16 % | foes the shaman hexes take more damage |

  The v1.0 passives came at 20 (Iron Hide +10 %, Opportunist 5 MP, Kindled Mind +25 %, Lifeline 1 HP, Old Ways to 8):
  at 9 they start a little under that and pass it by rank 3–5.
- **The loadout (v1.56):** a member has **up to four abilities in play**; the rest wait in the book and are never cast.
  Set in the Skills tab (*In play: Yes / No* on each ability; `setLoadout`, validated: four at most, its own class's,
  learned). Until a member sets it, the first four of its priority order are in play, so a new ability goes last and waits
  until it's moved up or put in play. Passives don't count against the four.
  - **When the autobattle casts them** (`src/sim/battle.js` `TIER`): an area wants two foes in it (foes stand 2.8
    apart, round whoever they fight: three seldom came), or one while the caster holds 70 % of its MP or more
    (`SPARE_MP`); Fan of Knives and Binding Roots want two always. A member's strikes leave MP for the dearest of the
    v1.55 abilities it has in play (`tierKeep`), and those that spend it on damage wait on the MP kept for heals and guards.
  - **Their MP** is set so they do at least what the strike they take the place of would with it (dearer, the party
    lost 8 % of its damage on the Drowned Choir).
  - Re-aimed as they land (a lane, a fan): foes move in the wind-up.

### 5.2 Crowd control (v1.55)
Six statuses, sim rules (`src/sim/battle.js`, the CC block), each drawn on the foe (`src/render/skillfx.js` auras):

| Status | What it does | On a boss |
|---|---|---|
| **Stun** | a hold: no step, no blow, no shot, no spell; **a wind-up under way is cut** (its blow never lands, its warning goes) | half the time |
| **Freeze** | a hold, in ice; Glacial Tomb strikes as it breaks | half the time |
| **Knockdown** | a hold, and the foe slides 0.6 tiles back | half the time, no slide |
| **Root** | its feet stop; it still strikes what's in reach, and shoots | half the time |
| **Pull** | moved toward a point, no closer than 0.9 tiles to it | not moved |
| **Knockback** | moved away from a point | not moved |

- **The breather:** after a hold ends, the foe can't be held again for 2 s (`CC_IMMUNE`), so a party can't hold a boss
  down: measured in the halls of 15–18, a boss stood held at most 19 % of his fight (`tools/balance/boss.mjs`, "held").
- **Elites** take the full time. A boss's hall mechanic goes on while he's held.
- Deterministic: no draws; times in the sim's seconds; a move stops at a wall or the room's edge as a step does.

---

## 6. The party

- **You plus two companions.** The main character is chosen at the start (fighter, rogue or
  mage) and can't be dismissed.
- **Hire** at a town tavern: one sellsword per class (one more if you're Thornwick-born), at
  **half your level, rounded up** (v1.11; it was ±1 of your level), new every in-game day. Each has a Lantern Guild rank and perks (§6.2), a
  signing fee and a dawn wage.
  The tavern's Hire view has two sub-tabs under the Guild's terms and the purse (v1.12,
  docs/tavern-hire-mockup.html): **Your company** (the party with To bench and Retrain, the bench
  with *Into the party*, or *Swap for …* when the party is full) and **Hire** (Ask around, today's
  sellswords). With the party full a hire reads **Add to roster · fee** and joins the bench.
- **Find** story companions in dungeons: rescued captives and quest rewards such as Brannoc
  (fighter) and Wren (rogue). They are free and have a unique trait and a personal quest.
  (M5) Brannoc waits chained in Wickham Keep's second-floor hall and joins once Captain Garrow has
  fallen. You talk to a found companion from their party card; they can be benched, never released.
  Brannoc joins at half your level too: months on a chain (world doc §5 v1.12).
- **Half your level (v1.11).** `hireLevel` in `src/sim/party.js`: max(1, ⌈hero level ÷ 2⌉), so L1–2 → 1,
  L6 → 3, L9 → 5. XP is shared equally, and a lower level needs far less XP to rise, so a new hire
  catches up. A fee and a wage are times the companion's own level, so a fresh hire costs half what
  one at your level would, and costs more as they rise. Measured (`roomlv.mjs --fresh`, fighter hero
  with a rogue and a cleric, no perks):

  | Hero | Fresh hires | Same-level room | Two levels down |
  |---|---|---|---|
  | L3 | L2 | holds (47 waves in 10 min; 48 at level), they reach L3 | — |
  | L6 | L3 | down in 264 s, 13 waves (at level: 34 waves) | holds (41 waves), they reach L4 |
  | L9 | L5 | down in 220 s, 9 waves (at level: 17) | holds (32 waves), they reach L6 |

  At L6, in rooms one level down, fresh hires reach L7 in 40 minutes of play (the hero, L8). From
  level 4 a new companion means a few rooms below your level first. The balance contract (§7.1)
  still measures a party levelled to yours.
- **Bench.** Recruited companions wait at the Thornwick inn and can be swapped in any town.
  Active members share XP equally; the bench earns none (v1.80: it was 50 %; the owner, 2026-11-12, "they should not
  be" levelling): a benched companion levels only on the road, by an expedition (§6.3). The bench holds six; a hire with the
  party full goes straight to it.
  - **Dismiss for good** (2026-10-03, the owner): a sellsword on the bench can be let go at a town
    inn (the party screen). Their wage stops (the bench draws half, every dawn), what they're owed is
    written off, and the gear they wore above Common (Fine, Rare, heirloom) goes into the party bag;
    Commons go with them. If the bag can't take it, nothing happens and it says so. A found
    companion (Brannoc) can't be dismissed (`heroes.js` `release`).
- **Visible gear.** Weapons, shields, helmets and capes are toggleable meshes on the KayKit
  models, so a loot upgrade changes the silhouette.

### 6.1 Heroes: creation, origins and slots
- **Game slots:** up to **3 game slots** (premium: up to **two more** main-character slots, v1.18, §1). Each is its own game: its own world seed, main
  character, party and save.
- **Hero slots:** within a game, the party has **three**: your **main character** plus **two
  companions**.
  - The main character is created once, at New Game.
  - The two companion slots are filled from everyone you've hired or found, and swapped with
    the bench at the inn.
- **Attribute points:** 3 per level for every member (§4.1).
- **Creation** (v1.64: the owner, 2026-11-10, "polish the new player / new game start up"):
  - **class:** fighter, rogue, mage, cleric or shaman, shown as the model you'll play (the in-game figure, not a
    sprite);
  - **look** (v1.65: the owner, 2026-11-10, "Let me customize the face and body type more - player choice and allows for
    NPC variability"): the class's model, and the face and build on it, each part a choice from a list, nothing typed:
    face shape, skin, eyes and their colour, brows, nose, mouth, ears, hair and its colour, a beard, up to two marks (a
    scar, freckles, an earring…), a build (thin, normal, broad, heavy) and a height (short, average, tall); and (v1.79,
    the painted head) its **frame** (strong, or soft: a softer jaw and chin, lashes, coloured lips) and its
    **expression** (calm, smiling, glad, stern, sad, smug, surprised, fierce). Seen live on
    the model as it's chosen. Cosmetic only: no stat reads it, and a height changes how tall the figure stands, not the
    sim's footprint. The choices are the face kit's (`src/sim/appearance.js`, kept in step with
    `tools/actor-lab/faces.js`); the sim refuses any other;
  - **changed later at a temple** (v1.65) for **40 gold**, any member of the company; the same look again is refused;
  - **the helm hidden** (v1.65; the owner: "lets add a hide helm option for players"): a toggle on each member's
    figure in the character window, free and anywhere. The figure goes bareheaded and so does their portrait; the helm
    is still worn and still counts. Saved (v40);
  - **what's equipped is worn** (v1.65; the owner: "characters should show what they have equipped… gear should have
    more variability - color, shimmering/lighting/glowing - that better indicates rarity"): the weapon in the hand, the
    off-hand in the other, the helm on the head (the hair under it), on every member of the company, in play and in the
    preview, the moment it's put on. Its rarity is in its light, never its colour (the owner, 2026-11-10: "gear doesn't
    need to be a different color - rather the gear border in inventory and the rarer an item, there is a faint to
    slightly stronger glow"): a piece in its own colours, common as made, **fine a faint glow, rare a little more,
    heirloom the most, and a slight pulse, with a few faint embers drifting up round whoever wears one**, each of the smith's steps a little more. In the bag each slot's border is
    in the rarity's colour with a glow round it that grows the same way (heirloom's pulsing too), the word on the item's card. **Armour and boots are worn too** (v1.65, the owner: "do the armour and boots on the
    body next"): armour is the body and arms of the kit it's made like (plate the knight's, fur the barbarian's,
    leathers the rogue's, robes the mage's; the cleric's vestments and the shaman's hide in their own cloth), boots the
    legs, so a cleric in plate looks it. What a class may wear is as it was (plate the fighter's and the cleric's, robes
    the mage's: a mage can't put on plate). A class in its own kit looks as it always did. Presentation only: the sim's
    gear is as it was. **The party card's portrait is the member's own** (v1.65, the owner: "do the party card portraits
    next"): their face, hair and build under the helm and armour they wear, rendered as the baked portraits are, the
    baked one shown while they look as their class was made;
  - **each class's gear its own** (v1.65; the owner: "do 1"): the cleric's Chapel Sword, Book of Hours, Chained
    Psalter and a new helm, the **Chapel Coif** (the Grey Sisters' wimple; the Great Helm's numbers, so the balance holds),
    the shaman's Spirit Staff, Antler Rod, Bone Fetish and Hide Cowl each look as they are, not borrowed; an amulet is
    worn at the chest and a charm at the hip; a bow brings a quiver and a crossbow a bolt case; staves are carried
    upright;
  - **the Barbarian sets out as a barbarian** (v1.65): an axe, a targe, a fur hood, fur mail and fur boots, where the
    Knight has the sword, shield, great helm, plate and sabatons. It's even: at level 1 HP 146 and ATK 13 against 140
    and 12, crit 4 % against 5 %, dodge 6 % against 5 %. Measured (`roomlv.mjs --look hero_barbarian`, seed 20260807):
    a lone level-1 hero down in wave 4 (the Knight 4); the right party at 6 holds 18 waves (17); a lone level-6 hero
    down in the first (the first);
  - **the sellswords** each come with a face and build of their own, drawn from who they are (the same sellsword, the
    same face), so no two at the tavern look alike; a found companion (Brannoc, Wren) keeps the face they have, until the
    temple. The townsfolk keep theirs: they're who they are;
  - **the roll** (v1.64): what you were born with, rolled together and re-rolled as often as you like before you go on:
    - **born attributes:** six points over Might, Grit, Finesse and Focus. The class's own numbers are lowered by what
      six points on its recommended build would add (two levels of it, §4.1), so a roll that lands on the build is the
      class table exactly, and every other roll trades one strength for another. They're the hero's for good: a respec
      leaves them, and they don't grow;
    - **a trait:** drawn as a Wick sellsword's perks are (§6.2), from the same perks, so a perk added or changed there is
      one a new hero can be born with: one perk of cost 1, or now and then (one in five) a quirk and one of cost 2. Not the
      ones that are about the hero from outside (bodyguard, the bonds to the hero's origin) or about a wage (thrifty,
      greedy);
    - the roll is the sim's, from the game's seed and the roll's number: the client picks which roll, never what is in
      it, and the server replays it;
    - measured (1,000 rolls a class, level 1): a fighter's HP 126–158 (the table's 140, the rolls' mean 137), ATK
      11.2–14.1 (12), DEF 12.7–17.3 (15.4); a mage's MP 70–85 (80), HP 80–103 (80). Traits: each cost-1 perk 11–17 % of
      rolls, a quirk 20 %, and with it a cost-2 one. The contract with the strongest rolls (`roomlv.mjs --born --trait`):
      a lone level-1 fighter is down in wave 4 (4 on the table), a lone level-6 one in the first, and the right party at
      6 holds 16–17 waves (17).

  - **origin;**
  - **name:** five suggestions at a time drawn from the origin's list (and a die for five more), or your own. A name
    the sim won't take is refused with a reason: profanity, slurs and their obvious spellings round, a name that passes
    itself off as staff or the game (GM, Admin, Moderator, Dev, Emberfall and the like). The rule is the sim's
    (`src/sim/names.js`), checked on the name as cleaned, its letters folded (accents off, doubled letters run
    together), so the same name is refused on every client and in the replay.
- **Notices** (v1.64): a quest taken, done or paid, a Chronicle fragment or a set made whole, a site opened: each
  waits on screen for its ✕, four at most (the oldest let go). A passing line (an objective's count, not enough MP, a
  chest) goes by itself as before.
- **First steps** (v1.64): after Ready, the opening square shows the controls one at a time, each a short card pointing at
  the thing it's about, with Next and Skip: moving (tap, hold, the stick), your hero's windows and what's on them, the
  compass, the quest log, the world map, the main menu, and where the first errand is (Maudry). Once a game slot; the
  menu can show them again. The first time a service window opens (shop, smith, tavern, inn, temple, the board, the
  Guild's coach), a card says what it's for and how it works: docs/first-steps-plan.md.
- **Origins** tie the hero to a faction (world doc §4) and change dialogue:

  | Origin | Faction | Edge |
  |---|---|---|
  | *Thornwick-born* | Maudry Fenn | +1 tavern hireling option |
  | *Redhand deserter* | The Redhand Company | +1 ATK at level 1; bandits may parley |
  | *Ward of the Grey Sisters* | The Grey Sisters | +20 % XP from lore |
  | *Deepdelver-fostered* | The Deepdelvers | −10 % smith upgrade cost |

- The first new game plays the intro, *The Chronicle of the Fall*.
- Details are in [development-plan.md §2.1–§2.3](./development-plan.md).

### 6.2 Sellswords: ranks, wages and perks (v1.9)
**The band (v1.18, the owner's pillar, §1).** A companion's rank, perks and loyalty are worth roughly
**5 % to 25 %** of combat strength:
- a green Hand at about 5 %;
- a Beacon at full loyalty at about 25 %;
- measured as waves held by the same party with that sellsword against a plain Hand of its class
  (`tools/balance/roomlv.mjs --perks`).

Companions are never required: the solo contract (§7.1) holds without them.

**Names (v1.37).** No two in a company share a name (the owner, 2026-10-05: "I have 2 Tobins"). A tavern's sellsword
whose drawn name someone in the company (or earlier on the day's list) already has is offered under the next free
name in their class's list, then any class's (`party.js` `distinctNames`); save v24 renames a later duplicate in an
older company the same way. The hero keeps theirs.


Companions are a choice and a gold sink. What you pay for is a way to play: perks to build a
company around. Canon: world doc §4, *Sellswords and the Guild's ranks*. Code: `sim/companions.js`
(rules), `sim/heroes.js` (commands, the dawn wage), `content/companions.json` (names and lines).

**Ranks.** Every tavern sellsword rolls a Lantern Guild rank. Fee and wage are × its level.

| Rank | Perks | Of the tavern | Fee | Wage a dawn | Point budget |
|---|---|---|---|---|---|
| Wick | 1 | 55 % | 30 × level | 5 × level | 1 |
| Lamp | 2 | 30 % | 90 × level | 12 × level | 3 |
| Lantern | 2 + 1 hidden | 12 % | 250 × level | 25 × level | 4 |
| Beacon | 3 + 1 hidden (one a party aura) | 3 % | 600 × level | 45 × level | 6 |

The UI always shows the rank as a colour and the word.

**Wages.** A wage is paid at every in-game dawn (once an hour of play, §10.1; it was every 24 minutes
before v1.10, the same amount), wherever the company is.
- **Order:** the party is paid first, then the bench at half wage. Each sellsword is paid in full
  or not at all.
- **Unpaid:** the wage is owed, and the sellsword's perks go dark (they still fight) until it's
  paid. Pay what's owed at a tavern (*Settle wages*), or at the next dawn you can afford it.
- **Sizing:** two Lanterns at level 6 cost 300 gold a day, about 750 an hour. A fighting party
  earns about 6,200 an hour at level 6 (`roomlv.mjs`; 9,000 before dropped gold was cut to 70 %,
  2026-10-03), so that's 12–22 % of income, depending on time in town.

**Perks.** There are 32 perks in seven families. Each costs points against the rank's budget; a
quirk costs −1, so it buys one more point. One roll in five carries a quirk. The numbers are in
`sim/companions.js` and the lines in `content/companions.json`.
- **Self (1):** Stubborn +10 % DEF, Hardy +10 % HP, Keen-eyed +3 % CRIT, Light-footed +3 % DODGE,
  Iron-lunged +25 % HP regen, Devout heals +10 %.
- **Fighting (2):**
  - Bodyguard (fighter): takes 20 % of the blows aimed at the hero, within 3 tiles.
  - Skirmisher: +20 % to a foe fighting someone else.
  - Finisher: +15 % to a foe under half health.
  - Last Stand: +20 % under a quarter health.
  - Field Medic: every 12 s, the most hurt ally +5 % max HP.
  - Grave-warden: +15 % to the Ashbound. Redhand-breaker: +15 % to the living. These two make a
    company depend on the site.
- **Ability (2), per class:** Venomous (+2 s), Smoke Artist (+2 s), Long Watch (+2 s), Kindler
  (Firebolt splash 0.3×), Steady Hands (Mend +15 %).
- **Party aura (3):** Drillmaster (everyone attacks 5 % faster), Banner-man (+5 % DEF), Old
  Campaigner (+10 % HP regen in a fight). Only the strongest of a kind counts.
- **Bond (2):** these depend on the hero's origin or the company.
  - Hometown: +8 % DEF if the hero is Thornwick-born.
  - Deserter's Bond: +10 % ATK if the hero is a Redhand deserter.
  - Sister's Ward: heals +15 % if the hero is a Grey Sisters' ward.
  - Delver's Eyes: +10 % ATK from a site's second floor down, if the hero was Deepdelver-fostered.
  - Shield-brother: +10 % DEF beside another fighter.
- **Gold:** Thrifty (1) wage −30 %, Haggler (1) inn and temple −15 %, Scavenger (2) foes drop +10 %
  gold. No perk touches drop rates or XP.
- **Quirk (−1):** Greedy (wage × 1.5, foes +5 % gold), Reckless (+10 % ATK, −10 % DEF), Drinker
  (−5 % ATK unless the company slept at an inn in the last two days).

**Loyalty (0–5).** Bond points rise by 1 for each dawn a sellsword is paid while in the party, and
by 1 for each boss it helps put down. They fall by 2 for each dawn it isn't paid. Loyalty needs
1, 3, 5, 8 and 12 points.
- **Loyalty 3:** reveals a Lantern's or Beacon's hidden perk.
- **Loyalty 5, Sworn:** the wage drops a quarter, and once per room visit the sellsword gets up
  at 30 % from the blow that would have Downed it.

**At the tavern:**
- **Ask around:** a new roster for 10 × level gold, doubling each time the same day.
- **Retrain:** a perk for another of its family that costs no more, for 60 × level × (retrains +
  1). Quirks can't be retrained.
- **Found companions:** Brannoc has no rank, fee or wage; he has his own perks (Bodyguard, Hardy).

**On screen and where it's explained** (2026-10-01):
- **Top bar:** a line under the place name (after the sky dial; v1.35) gives the next dawn's wage bill and the time
  to it, `−300 · dawn 14m`.
  - **Short:** amber with ⚠ when the gold won't cover it.
  - **Owed:** red, `owed N ⚠`, when anyone is owed.
  - **Tap it:** in town it opens the tavern's Hire view; out of town it shows who costs what.
  - **Warning:** two minutes before a dawn you can't pay, one toast.
- **Companion cards:** a tag on the XP line, `◆ 72/d` (the rank's colour), `◆ OWED` or
  `◆ free` (found).
- **Character window:** a **Contract** tab for every companion. It shows:
  - the rank and its line;
  - the wage in the party and on the bench, with its modifiers;
  - what's owed, and the perks (dark while owed);
  - the hidden perk's slot;
  - the loyalty track (3 reveals, 5 Sworn), what's left to the next step, and what earns and
    loses bond;
  - retrains and the next retrain's price.
- **The Guild's terms** (`ui/guildterms.js`, text in `content/companions.json` `terms`): the
  reference card. It opens from the top of the tavern's Hire view and from a Contract tab.
  - **Ranks table:** read from the sim's numbers, with the prices at a new hire's level (half yours).
  - **Sections:** wages, owed, loyalty, Ask around, Retrain, the perk families, found companions.
  - **Before any hire:** its link in the Hire view says wages are paid every dawn.
- **Maudry Fenn:** *"How does the Guild hire?"* in her hub and her hiring talk. It covers the
  ranks, the dawn wage, the unpaid and the Sworn, in her voice (`maudry.ink`).
- **Loading tips:** three, on the dawn wage, the unpaid and the Sworn.

**Old saves (v13):** each tavern hire becomes a Wick, and its old trait becomes the perk it always
claimed to be (the traits did nothing before). They're kept for free, with wages from the next
dawn.

**Balance.** The contract (§7.1) is measured with perk-less hires, as before. Perks were measured
with `roomlv.mjs --perks` on 4 seeds, 300 s, fighter + rogue + cleric in the class kit:

| Perks (rogue / cleric) | L3 same | L6 same | L9 same | L3 +3 | L6 +3 | L9 +3 |
|---|---|---|---|---|---|---|
| none | 22.5 | 15.8 | 13.5 | 9.0, lost 4/4 | 6.8, 4/4 | 1.2, 4/4 |
| Lamp: Finisher, Keen-eyed / Steady Hands, Stubborn | 22.5 | 15.8 | 12.0 | 11.5, 3/4 | 6.2, 4/4 | 2.2, 4/4 |
| Lantern: + Grave-warden / + Hardy | 23.0 | 16.5 | 14.2 | 12.2, 1/4 | 7.2, 4/4 | 3.5, 4/4 |
| Beacon: Drillmaster, Finisher, Grave-warden, Skirmisher / Banner-man, Steady Hands, Field Medic, Hardy | 23.8 | 17.2 | 14.5 | 13.0, 2/4 | 9.5, 3/4 | 3.8, 4/4 |

(Waves held; for the +3 rooms, how many of the 4 runs were lost.)
- **Same level:** a Beacon pair holds about 7–9 % more waves.
- **Three levels up:** from level 6 such a room still beats even a Beacon company.
- **Level 3:** paid perks do make a +3 room winnable, which is what the gold buys.
- **Gate:** `test/companions.test.mjs` keeps the level-9 +3 room a defeat for that Beacon company.

### 6.3 Expeditions: the bench on the road (v1.33)
The owner, 2026-10-04: *"let me send my benched companions on timed adventures to level up and bring some gold and
possibly one looted item back."* At a town's inn, **Expeditions** sends a companion off the bench on the Lantern
Guild's road work (world doc v1.24 §4). Three jobs:

| Job | Time | XP (v1.38: of active play's in that time, `xpRate`) | Gold | A find | Fine / Rare among finds |
|---|---|---|---|---|---|
| A watch on the road | 15 min | 30 % | 4 × level × 15 | 15 % | 25 % / 3 % |
| A day for the Guild | 1 h | 25 % | 4 × level × 60 | 40 % | 30 % / 5 % |
| The long round | 4 h | 20 % | 4 × level × 240 | 85 % | 35 % / 8 % |

(v1.38) XP was a share of their next level (the long round 140 %). With every level 15 % longer than the last, from
about level 17 a long round paid more levels than playing for the same four hours, so it's priced off play instead.

- The time is the game's clock: it runs while you play and through the time away (§12). They come back on their own,
  wherever the company is, and the HUD says what they brought.
- A find is at their level and for their class, rolled on the expedition's own stream (the room drops don't move); into
  the bag, or salvaged for cinders if it's full.
- While out they can't be swapped in, released or retrained; they draw the bench's half wage as usual. Anyone on the
  bench who isn't slain can go, any number at once. Nobody is hurt or lost on the road.
- For scale (v1.38): a level-6 companion's long round pays 26,900 XP (about 1.2 levels at 6) and 5,760 gold over 4
  hours; at level 17 it pays 0.3 of a level, where 4 hours of play at 17 is about 1.3. The road is a slow, safe trickle
  for whoever is waiting, never a rival to playing.
- `src/sim/expeditions.js` (`expeditionSend`; save v22), the Inn's Expeditions view (`src/ui/townmenu.js`).

---

## 7. Progression and the grind

- **Levels 1–30** at launch; (v1.23) the cap rises with each region to **75** (§17). Stats grow per the class tables.
- **XP to the next level (v1.38;** the owner, 2026-10-05: *"Much slower level progression"*, then chose ×1.15 a level
  over ×1.5, which put level 30 ~10 years out). Each level takes **15 % longer to fight through** than the one before,
  from **20 minutes** for level 1 → 2: T(L) = 20 × 1.15^(L − 1) minutes in rooms of your own level. The table
  (`party.js`, three figures) is T(L) × what the right party earns a minute each there (`xpRate`: measured L2 132, L6
  555, L9 862, L12 1,219, L15 1,569; fit 85 L + 1.4 L²; v1.42: × 0.9 at 10 and × 0.84 from 11, as measured when the wave
  stopped growing at 5, so the minutes stay the same). L1→2: 1,730 XP; L10→11: 62,700; L17→18: 291,000; L29→30:
  3,060,000. Hours of fighting to reach a level, at level:

  | Level | 2 | 3 | 5 | 8 | 10 | 15 | 20 | 30 |
  |---|---|---|---|---|---|---|---|---|
  | That level alone | 20 min | 23 min | 30 min | 46 min | 1 h | 2 h | 4.1 h | 16.7 h |
  | From level 1 | 0.3 h | 0.7 h | 1.7 h | 3.7 h | 5.6 h | 13.5 h | 29 h | 126 h |

  (It was 300 × L^1.6, v1.7: level 30 in ~8 h of fighting, a level at 17 in ~20 min; an hour offline in the Sickpools
  took a level-17 company ~3 levels.) Farming rooms below you still pays the room's XP, and kills come faster there;
  the curve, not a level-gap cut, sets the pace. Quests and the board pay what they always did, so they count for less
  of a level. Save v25 keeps every member's level and carries the XP toward their next as the same share of the new.
  (§17's "XP goes linear above 30" waits for M9's rescale: until then the 15 % a level carries on.)
- **Enemy scaling.** Enemy level = the room's level (§3.3), offset by the region base and the
  site tier (+0 to +3). Stats = archetype base × (1 + 0.14 × (level − 1)) (ATK 0.12).
  *Elite*: ×2.5 HP, ×1.3 ATK. *Boss*: ×8 HP plus a signature mechanic.
- **The grind gate.** Progress needs levels, gear and the right party (§7.1). The **renown**
  needed to unlock the next act roughly matches reaching that region's level cap, so progress
  means grinding plus gear, not just story.
### 7.1 Difficulty: levels, gear and the right party (v1.5)

**The contract** (gated by `smoke-test.mjs`; measurements in
[difficulty-pass-1.md](./difficulty-pass-1.md)). Every visit here is one you never walk out of:

| Who | Same-level room | Notes |
|---|---|---|
| A lone hero, levels 1–3, kit at level | Wins the first 3+ waves, goes down by wave 12 | You beat level-1 foes alone but can't farm them. Walk out to recover and go back in. |
| A lone hero, level 4+ | Down within 2 waves | Same-level rooms want company. Rooms well below you are for solo. |
| The right party (tank, damage, healer) in gear at level | Holds 10+ waves, nobody Slain in the first five | The tide climbs to +100 %, then falls back. Holding the top means farming as long as you like. Gated at 3, 6 and 9, and (v1.42, M8) at 12 and 15 too, with the lone hero and the room three up. |
| A party with no healer, level 6+ | Worn down on the first climb, before the top (v1.69: within 7½ minutes, before wave 20; was 5 minutes, when the top was wave 18) | Composition matters. |
| Any party, a room 3 levels up | Defeated | |

**Under the foe's level: none (v1.81).** v1.69 cut every member's ATK and DEF 10 % a level a foe stood above the hero;
the owner dropped it (2026-11-12: *"we are dropping this entirely"*). A foe's own level is the whole of its edge: a room
three up still defeats the right party, later than with the cut (wave 4–12, 107–318 s, over 4–5 waves and 108–160 s), so
the contract's visit for it is 7½ minutes, as the no-healer party's.

**Why companions help:**
- The wave is the room's, the same for a lone hero and a party of three (it had grown with the
  party, so each member faced more foes).
- A kill's XP goes to each living member at 100 % alone, 65 % each for two, 50 % each for three.
  A party clears faster, so each member earns 80 %+ of a lone hero's XP a minute in the same
  room, and can take rooms a lone hero can't.

**Why gear matters:**
- Items grow twice as fast with item level: a + b × ilv + b × (ilv − 1).
- The classes grow that much less per level themselves. A hero in the class kit at their level
  has the stats they had before, and one in gear five levels old is visibly behind.
- An item's stats are re-derived from (base, ilv, rarity) on load, so old loot follows the formula.
- Measured: the right party at level 6 holds a room two up for 9 waves in Fine gear at level,
  6 in its level-1 kit.

**Leaving is the way to farm** (implemented 2026-09-30):
- In a fight the room pill reads *ROOM LV 4 · WAVE 6 · FOES +30%*: the tide, in the open. When it
  falls back from the top, a banner says *The room falls back*.
- A **Step out** button sits above the party cards on the right (`src/ui/stepout.js`). It walks
  the hero to the nearest corridor tile past a doorway (the compass row `step-out`,
  `sim/travel.js`), where the fight ends and the corridor restores the party at 5×.
- The button pulses under 45 % party HP ("the party is low"). If a companion is Downed, it warns
  that leaving makes them Slain.
- Going back in is a fresh visit, with the tide back at the start. Measured: a lone level-1 hero
  who steps out when low clears more waves over four visits than one stubborn visit, and never
  wipes (`test/stepout.test.mjs`).
- **The board says when a job wants company:** a Warden's hall or a Delve floor of room level 4+
  that's no more than a level under yours (`companyFor`, `sim/board.js`). The card shows
  *⚑ Bring company*, and the Journal says *bring company*.

**Class notes:**
- A lone mage lasts longest of the damage classes (8–15 waves at level 1): it kites. So does a
  rogue with a bow (13–17 waves; with a crossbow 4–13; §5 v1.8).
- A lone cleric outlasts everyone (13–21 waves) but earns the least XP a minute.
- Neither farms forever.

- **Renown** per region is earned from quests and bosses, and unlocks chapter quests, the next
  region's road, better tavern hirelings and the smith's upgrade tiers.
- **Endless depth.** Post-game, the Undervaults below the Ember Throne keep descending: +1
  level every two floors and a leaderboard (§12). The current build's descent system *is*
  this feature.

---

## 8. Loot

**Rare but valuable.** Every kill drops a little gold, XP and sometimes materials. Gear
drops are events. Deeper rooms raise the gear-drop chance (§3.3).

**Dropped gold is 70 %** (2026-10-03): a kill's gold (its kind's gold × its level) and a chest's
are cut to 70 % (`battle.js` GOLD_DROP). Quest and board rewards, which are paid, are not. Measured
over 300 s with the right party in a same-level room: 312 → 212 gold at level 3, 756 → 517 at 6,
1,224 → 856 at 9; the fight itself is unchanged.

| Slot | Fighter | Rogue | Mage |
|---|---|---|---|
| Weapon | swords, axes, greatswords, great-axes | daggers; hunting bows and yew longbows; hand and heavy crossbows (bows and crossbows shoot, §5) | wands, staves |
| Off-hand | shields | off-hand dagger | tomes |
| Helm | great helm, bear hood | hood | witch hat |
| Armor | plate, fur mail | leathers | robes |
| Boots | sabatons, fur boots | soft boots | slippers |
| Trinket | any class: rings, amulets, charms |||

| Rarity | Source | What it is |
|---|---|---|
| **Common** | shops only | Base stats. |
| **Fine** | 1 % per wave · 3 % per chest (chests are rarer: about one a floor) | Base + 1 random stat affix (from the eight stats). |
| **Rare** | 0.2 % per wave · 1 % per chest · 15 % per boss | Base + 2 affixes + one ability modifier (e.g. *Firebolt pierces*). |
| **Heirloom** | 1 % per boss · guaranteed from hidden sites | Named, fixed stats and a unique effect, plus a line of history (world doc §9). |

- **Chests are a find** (2026-10-01).
  - **How common:** about one a floor, and never none. Each chest the rooms' dressing places is
    kept at 35 %, on its own stream (`world.js` CHEST_KEEP), so the rest of a floor stands as it
    was. A floor left with none (none drawn, or the stairs or pruning took the last) gets one
    against a wall of a fighting room you can walk to (2026-10-03, `placeOneChest`: before, 8 in
    200 Barrows first floors, a quarter of the Sunken Chapel's had none). Measured over game
    floors, per floor (before that fix):
    - the Old Barrows 1.2, the Tithe Mill 1.4 (at least 1), Wickham Keep 1.2;
    - the Sunken Chapel 0.6, where pools crowd some out;
    - it had been about 3.
  - **What's in one:** every chest gives (10 + 5 × room level) × 0.8–1.2 × 0.7 gold, plus wood and
    stone. Its gear chance is 15 % (+5 % a room level; 20 % of that Fine, 7 % Rare); it was
    8.5 %.
  - **Gear an hour holds:** the farm (`loot.mjs`, levels 3 / 6 / 9 × 3 seeds × 3 h) opens 3.8
    chests an hour, not 6.6, and finds 3.72 / 0.97 / 0.13 Common / Fine / Rare an hour, against
    3.40 / 0.92 / 0.17 before.
  - **What it says:** opening one always says what it held. A toast reads *Chest · 32 gold · and
    the Tempered Sword (Fine)!* or *Chest · 32 gold · no gear this time*, and "+32 gold" rises
    off it.
  - **How it looks:** a chest is drawn twice its old size, and an opened one stays where it
    was, lid thrown back, hollow and dark. You can see a room's chest has been had.
  - **Board jobs:** a Retrieve job (open N chests) for 2–3 now takes more than one floor or
    visit.
- **Class-based.** Every item except trinkets has a class. Drops roll 80 % towards classes in
  the active party.
- **Bad-luck protection.** Each boss kill without a Rare adds +3 % to the next roll.
- **The forge** (v1.13, `src/sim/smith.js`; Hale & Daughter's in Thornwick, every town's smith).
  Everything is done in town; an invalid command does nothing, or says why.
  - **Upgrade** +1 to +5, on anything worn by the party or in the bag. Each step adds 8 % to
    the item's **base stats** (not its traits), rounded; the item reads *Tower Shield +2*.

    | Step | to +1 | to +2 | to +3 | to +4 | to +5 | All five |
    |---|---|---|---|---|---|---|
    | Gold (× item level) | 30 | 60 | 120 | 240 | 480 | 930 |
    | Cinders ✦ | 1 | 2 | 4 | 6 | 10 | 23 |
    | Wood and stone, each | — | — | 8 | 12 | 16 | 36 |

    A Deepdelver-fostered hero pays 10 % less gold (§6.1). On a small piece a step's gain can
    round away; the forge says when the next gain shows, and offers no upgrade to a piece that
    gains nothing even at +5 (a level-1 sword's ATK +1). Rounding up instead was measured and
    dropped: a +5 kit at level 3 then held a room three levels up for 300 s (14 waves), against
    §7.1.
  - **Reforge** one trait (affix) of a Fine or better piece into a different kind, rolled fresh
    at the item's level. The roll comes from the item and how often it has been reforged, so it
    is the same for everyone and can't be fished by reloading. The first reforge costs 50 gold ×
    item level and ✦ 3; each later one of the same piece costs double the gold.
  - **Salvage** off-class or outgrown bag items into **cinders** (the upgrade currency, ✦; the
    count sits in the top bar, next to gold): Common 1, Fine 2, Rare 5, Heirloom 12, plus half of the cinders
    any upgrades on it took. *Salvage every plain Common* clears the bag's un-upgraded Commons in
    one tap; a Fine or better piece asks *Sure?* first. Worn gear stays worn.
  - **Cinders also drop** (v1.13): 1 from each elite, 5 from each boss ("+5 ✦" rises off it).
  - **What upgrades are worth** (measured, `roomlv.mjs --up N`: fighter, rogue and cleric in
    gear at level, 300 s). A +5 kit is about one level of power: at level 6 the fighter goes
    HP 226 → 243, ATK 24.3 → 26.3, DEF 31.1 → 37.7. Waves held, plain / +2 / +5:

    | Room | Level 3 | Level 6 | Level 9 |
    |---|---|---|---|
    | Same level | 24 / 24 / 24 held | 17 / 17 / 18 held | 15 held / 14 (beaten at 297 s) / 14 held |
    | Two up | 17 held / — / 18 held | beaten after 9 / — / beaten after 7 | beaten after 5 / — / beaten after 10 |
    | Three up | beaten after 9 / 8 / 9 | beaten after 5 / 6 / 6 | beaten after 2 / 3 / 3 |

    The balance gates (§7.1) hold with any upgrades: a room three levels up still beats the
    right party.
- **The shop** (v1.13; Wendel's Provisions in Thornwick, every town's shop). In town only.
  - **Buy:** four plain Commons a day for the party's classes, at the hero's level the first
    time you're in town that day, 40 gold × item level each. What you buy is gone until dawn.
  - **Sell** a bag item for 6 / 15 / 40 gold × item level (Common / Fine / Rare), +25 % a
    smith's step on it. Heirlooms aren't sold.
  - **Buy back:** the last five things you sold wait, at what they fetched.
  - **No draughts.** The shop sells gear, and one thing besides (§3.4).
  - **The Homeward Scroll** (v1.17), always on the shelf at **300 gold**. Read anywhere out of town, it puts
    the party on the square of the region's town (the nearest town), and it's gone. Read mid-fight, it's walking
    out, as a step-out is. It also turns up as rare loot beside a drop: 3 % from a chest, 4 % from an elite,
    15 % from a boss's first fall and 5 % from its later ones, on a stream of its own so the gear rolls don't move.
    It sells back for 75, is never worn, upgraded or reforged, and *Salvage every plain Common* leaves it.
    **Every company carries one (v1.30; the owner, 2026-10-04):** a new hero sets out with one in the bag, and a
    save from before is given one, once, as it loads (save v20; left out only if the bag is full with none to
    stack on).
    Scrolls stack in the bag like plain gear.
- **The party bag** has 50 slots (20 until 2026-10-03, the owner). Identical plain items stack in one slot, up to 10: the same
  base, rarity, item level and name, and no affixes, Rare modifier or flavour. A full bag still
  takes an item that fits an existing stack; anything else that drops is salvaged at once.
  Low-level Common metal is *Battered* (it was *Worn*, which read as "equipped").
- **Special sources** (v1.2):
  - **Ember Rifts** (timed weekly dungeons) drop *Kindled* items: Fine or better with a
    Rift-only affix.
  - **Region bosses** (weekly lockout) have heirloom tables and give a guaranteed Rare on
    the first kill each week.
  - **Hidden sites**, revealed by completing a Chronicle set, give a guaranteed Heirloom.
  - **Chapter quests** give a guaranteed Fine.
- **Drop rates:** loot v1 ships generous drop rates so the loop is felt early
  (`gear-and-loot-plan.md`). M5 tunes toward the targets above with a headless farm run:
  about 3 Common, about 1 Fine, and about 1 Rare per 5 hours of active play. Rare and above
  always fits the party's classes.
  (M5, done) Measured with `tools/balance/loot.mjs` over 27 h at levels 3 / 6 / 9: 3.4 Common,
  0.92 Fine and 0.17 Rare an hour. A boss's first fall always drops Fine or better; later falls roll
  for it (15 %), so a repeatable boss like the Standard can't be farmed for Rares.

---

## 9. Quests (generated from the narrative)

**The quest board** in each town offers 3–5 mini-quests, refreshed at dawn (real time) or when
three are completed. **Chapter quests** (the main arc) are pinned on top and gated by renown.

**What they pay in XP (v1.39;** the owner, 2026-10-05, after §7 v1.38's slower curve made a chapter worth ~3 % of a
level, where it had been ~25 %). XP is a **share of a level**, never a fixed number:
- **A quest** pays its share of the level it's written for (`rewards.lv`), or of a member's own if they're under it
  (`quests.js` `questXp`): chapters 35 / 45 / 55 / 55 % (Act I's four), errands and bounties 20–30 %, companions'
  chains 30–45 %, trials 30 %. (v1.49) A quest is written for the level its dungeon asks when it's done, the
  chapter's last objective's: *The Diggers* 6, *An Ember in the Fist* 8, *The Standard* 9, *Fog on the Canal* 12,
  *The Locks* 14, *The Sickpools* 15, *The Bells* 16, *The Rolls* 17, *The Last Office* 18 (a test holds every quest
  to it). Since v1.48 they'd kept the old map's levels and paid 40–56 % of their share. An underlevelled companion catches up; a company far past an old errand gets the errand's worth
  at its own level, not a third of theirs. The bench takes none, as in fights (v1.80).
- **A board job** pays 2 % of a level at the posting's level for each unit of effort, more for skulls (`board.js`
  `BOARD_SHARE`): a fair five-effort job is about a tenth of a level.
- **A Chronicle fragment** pays 5 % of each finder's level (a ward of the Grey Sisters, a fifth more) (`lore.js`).
- Gold is unchanged everywhere.

**Main story and side quests (v1.18).** The two read apart everywhere:
- **Main story:** the chapter quests. In the journal they carry a gold **★ Main story** tag and a gold
  edge and are listed first. The tracker marks them ★. They can't be abandoned.
- **Side quests:** everything else (errands, bounties, trials, companions' chains, board jobs).
  They're tagged **Side quest · Errand** (or Bounty, and so on) in a muted colour, listed after,
  and marked ◆ on the tracker.
- In code: `src/ui/journal.js` `isMain`.
- **Where the story stands (2026-10-03, the owner: "not clear where I find the next step").** With no chapter in
  hand, the Journal's Main story section still says something: the next chapter and who gives it (*Next: The
  Diggers. Talk to Osric Hale in Thornwick*), the level it waits for, or that the act is done (*Act I is done*:
  Act II, the Greywater Fens, opens in a later update). While the story waits, a **Still in the Vale** list names
  what's open: Brannoc in Wickham Keep, the Standard, the Scrag Warren, the Chronicle's missing pages, the Ninth
  Milestone once found, a class trial waiting, the board. Words in `content/story.json`; which apply,
  `src/ui/storystatus.js`. Hedda's *Hens Under the Hill* is open to level 30 (it capped at 8, so a hero past
  Act I never saw it).

**Implemented (v1.4, M4 slice 3).** Thornwick's board hangs in the Tired Mule (Tavern → Quest
board); `src/sim/board.js`, words in `content/board/`. (v1.27, M8) **Each town's board posts its own land's jobs:**
Saltmere's, in the Drowned Eel, sends you to the Fens' open sites a party at your level can take on (never one whose
first rooms are more than two levels up), posted by Pim Rushlight, the Grey Sisters, the eel-men, the ferryman and the
Guild, in the Fens' own words. A posting belongs to the town it went up in; a Fens job's id ends `_fens`.
- **When it refreshes:** twice an in-game day, at **dawn and at dusk**, half an hour of play apart
  (v1.12; it was once a day: every 24 minutes before v1.10, every hour in v1.10–1.11), the first time
  you're in town after it's due. The board says which comes next and when ("new jobs at dusk, in
  12 min · posted at dawn and dusk"), and its list is headed *Posted at dawn* or *Posted at dusk*.
  A dusk posting is new jobs (ids `board_<day>d_…`); a dawn one draws exactly as the one-a-day board
  did.
- **How many jobs:** 3 jobs, or 4 from level 4. The jobs are fixed for the posting at the level you
  had when the board went up.
- **Holding jobs:** at most **3** open at once. They're taken and handed in only at the board.
- **Templates:**
  - **Hold** N waves (3–6);
  - **Retrieve**: open N chests (1–3);
  - **Bounty**: slay N elites (1–2);
  - **Delve**: reach floor F;
  - **Warden**: hold N waves (2–3) in the stairs-down hall of floor F or deeper.

  All five are in the Old Barrows until M5 adds sites. Rescue, Escort and Investigate wait for
  captives, escorts and fragments.
- **No job asks for a place more than two levels above you:** three above defeats you (§ balance).
- **Skulls:** 1 when the place is at or below your level, 2 at one to two levels above.
- **Pay** is on top of the fighting: about half its XP again (12 × level per wave of work) and
  a little more than its gold ((3 + 2 × level) per wave of work), +25 % per skull above one.

A mini-quest is assembled deterministically from (world seed, region, day, guild rank, act
progress):

`giver (faction) + template + target (site / enemy / NPC) + hook (a line from the act tables) + reward`

| Template | Objective | Example |
|---|---|---|
| **Hold** | Survive N waves in a named room | *Warden Hale: "The Redhand have the Tithe Mill again. Burn them out."* |
| **Bounty** | Kill a named elite | *"Old Gutter, a grave rat the size of a dog, is eating the dead in the Barrows."* |
| **Rescue** | Free a captive (sometimes a found companion) | *"My brother went to Wickham Keep with a shovel and a bad idea."* |
| **Retrieve** | Bring back an item or lore fragment | *Sister Ilse: "A ledger from the Sickpools. Don't read it."* |
| **Delve** | Reach floor N of a site | *"Map the Cinderworks down to the fourth level."* |
| **Escort** | An NPC follows you; keep them alive | *"Get this surveyor to the Canal Locks and back."* |
| **Investigate** | Explore X rooms; guaranteed lore fragment | *"Something's lit in the Sunken Chapel at night."* |

- **Narrative coherence.** Hooks, givers and targets come from the current act and region
  tables in the world doc. Act I boards talk about bandits and opened barrows; Act III boards
  talk about the forges.
- **Difficulty** is shown as 1–3 skulls relative to the party's level.
- **Rewards:** gold, XP, renown, and sometimes a guaranteed Fine item or a companion.
- **Beyond the board** (v1.2), the Hero component:
  - **Hero quests:** chapters (the main arc), companion chains and class trials.
  - **NPC errands:** random side quests offered by quest-giver NPCs, from the same templates
    and pre-written hook pools.
  - **Bounties:** from the watch.
  - **Discovery:** places, NPCs met, bosses beaten and **lore fragments** into the Chronicle.
  - **Gating:** by region, town, level window, renown, act, class, origin and flags.
  - **The Journal** (quest log) tracks everything. The tracked quest drives the compass.
  - (v1.40, Act II) Two more objective kinds: **meet** (a word with someone, in a town or in a dungeon: Dace Pike,
    Wren in the Boat Hall, the Kindler at the Locks) and **cages** (full lantern-cages broken in a site). A chest
    objective can name a floor (*the rolls* are on the Abbey's third). A word already had counts on accept, as a
    fallen boss does: a found companion already with you, or a visitor who's gone. The compass leads across lands:
    out of town by the road, out of a dungeon by the stairs, and along the overland to the other land's road.
    Chapters open at the world doc's bands (Act II: 8, 10, 11, 12, 13, 14), one level under the hall each wants.
  - Full spec: [quest-lore-system.md](./quest-lore-system.md).

---

## 10. World and travel

- **Overland map.** A fogged node map per region: towns, sites, landmarks and crossroads
  joined by roads and trails. The region skeleton is hand-authored (world doc §3). Minor
  sites and landmarks are procedural from the seed.
- **Travel** between nodes takes in-game time. Roads carry a 15 % encounter chance (ambushes,
  merchants, shrines, lore) and trails 30 %, but trails are faster. You can camp to regen.
- **The region's trouble, on the map** (v1.7; world doc §3.1 *The road*). Each region shows its
  threat where you travel, not only in its dungeons. In the Vale the dead stand in three ranks across
  the barrows road beside a stopped wagon: walkers get through, wagons don't. Each rank goes when its
  part of the legion is put down (Maudry's errand, Osric's bounty, the Standard), with a HUD line
  when it does; with the last one the road opens, the wagon's gone, and the town says so.
- **Towns are hubs, one per region** (v1.23: Thornwick, Ashgate, Tollhaven, Rookstead, Frosthold, and the
  Lamphall in Solmere; §17). Each is the same square in a different region; the size, the edge, the ground and the
  set pieces change ([region-towns-proposal.md](./region-towns-proposal.md)). A region's other stops are
  **waystations**: a tavern with the board and a shrine (Saltmere in the Fens), and (v1.37, the owner: "Saltmere
  needs an inn for party mgt") an inn where the company's bench waits: Saltmere's is the Stilt House. (v1.44, the
  owner: "there should at least be a shop, and small tavern at these way stations… a reason to be there".) Every
  waystation is a **small tavern** (the board, hiring, the Guild's coach), **a shop** (the day's gear and the Homeward
  Scroll, on **shelves of its own**: each town and waystation rolls its own stock, so a stop is worth looking in), an
  inn and a shrine, round the same square. Only the town has a forge. The names and each one's reason to stop are in
  the world doc (§3, *The waystations*); the street plans in
  [town-streets-proposal.md](./town-streets-proposal.md).
  - **A walled town** (v1.15). The circuit is a box of curtain and towers.
    - **Material:** Thornwick, a beginning town, has a timber palisade with watchtowers; the later
      regions' towns have stone.
    - **The way in:** the road runs straight across the meadow into the one gate (v1.26: the stream and its bridge
      before it are gone, the owner's call), then a
      cobbled high street runs up to the square.
    - **What's where:** the houses stand inside, against the back walls. The farms and fields stay
      outside.
    - **How tall** (v1.45, the owner: "Inns should be 2 story, homes and shops one story"): the inn is two
      storeys, its rooms upstairs under dormers; a home or a shop is one. The tavern and the temple keep their own
      heights. The back quarters mix four homes (a house, a cottage, a longhouse with two doors, a workshop with its
      trade out under a lean-to), each in its region's dress: limewash and oak with flower boxes in the Vale, reed
      thatch on short piles in the Fens, soot-dark brick and a coal bin in the Reach, snow on every roof and logs
      stacked under the eaves in the Heights.
    - **The town set** (v1.45, [art-critic-pass-14.md](./art-critic-pass-14.md)): a food stall at the square's edge,
      the town's colours either side of the high street inside the gate, lamps down the high street, the inn's table
      out front, a lane well in the back quarter, crates by the smithy, a handcart by the shop, a cart by the gate and
      one at the farm, a trough for the beasts, the Vale's windmill by its north field. None stands on a road or in
      the walk from the square to a door, and every door, a home's too, can be walked to (test/town.test.mjs).
    - **The camera:** on the approach road it leads halfway to the gate, so the gate is in view
      from the moment you arrive.
  - **The square is the home screen.** It is laid out **exactly the same in every town**, so it
    stays familiar like a menu.
    - **Every entrance faces the well.** The camera sees only the two faces of a building toward
      the bottom of the screen, so every service stands up-screen of the well, with its door on
      the face toward it.
    - **The services stand 8+ tiles apart,** and every door is inside the square's frame.

    | Position | Left (door faces right) | Centre | Right (door faces left) |
    |---|---|---|---|
    | Head | | Temple | |
    | Upper | Tavern | Shop | |
    | Front | Smithy (forge open to the well) | Well (the Watch) | Inn, by the high street |

  - **Using services:**
    - When the hero nears the square, the camera settles on that fixed framing and a bar of the
      town's services slides up: five in a town, four at a waystation (v1.44: tavern, shop, inn, temple; three before).
      Tapping a building or its button opens that service's menu. What a place has no house for (Saltmere's
      forge and shop) is refused by name.
    - Every service's name plaque stays on screen there, clear of the HUD's buttons. (v1.45, the owner: "Make sure
      the town square menu layout stays for each town".) Each plaque hangs at a set height for its service, not at its
      roof's top, so every walled town's square reads as the same menu, and new art never moves it (`SIGN_TOP` in
      sim/outdoor.js; test/town.test.mjs, and the browser suite measures the drawn plaques in each town).
    - Away from the square, tapping a service building walks you to the square instead.
    - Buildings aren't enterable.
  - **Same shapes, regional tones.** The five service buildings have identical silhouettes and
    positions in every town, so they read like menu icons. Only materials, colour and names
    change with the region:
    - Vale: warm oak and slate.
    - Fens: damp grey-green.
    - Reach: soot and rust tile.
    - Heights: pale limestone and blue slate.

    The ground takes the region's tone too.
  - **The services:**

    | Building | Menu |
    |---|---|
    | **Shop** (provisioner / outfitter) | Buy the day's common gear · Sell · Buy back (no draughts, v1.13) |
    | **Smith** (the forge) | Upgrade (+1…+5) · Reforge a trait · Salvage → cinders |
    | **Tavern** | The Lantern Guild's **quest board** (mini-quests) · Hire companions · **The Guild's coach** (v1.43) · Rumours |
    | **Inn** | Rest (restore HP/MP) · Lodge companions (the bench) · Expeditions (idle) |
    | **Temple** | Heal the Wounded · Blessings · The Chronicle (lore) |
- **The World map and the Guild's coach** (v1.43; [worldmap-travel-proposal.md](./worldmap-travel-proposal.md), the
  owner: "a world map button below the journal button", "use a globe icon"). A 44 px globe sits in the right-hand
  column, 22 px under the Journal. It opens a sheet with two tabs:
  - **The Old Provinces:** the Lantern Guild's wall map, fogged past the lands you can walk. The coach's towns are
    pinned, lit once you've stood in one; "you are here"; a ★ by the town whose land the tracked quest leads to.
  - **The land you're in:** its overland, drawn from the game's own world, with its town, its open sites (a hidden
    one stays off the map until found) and its roads out. A site's card gives its levels, floors and bosses; **Walk
    there** makes the compass's walk (from town: the road out, then on to the site).

  **The Guild's coach** (sim/coach.js) is fast travel between towns:
  - **From** a town's or waystation's square (the tavern's *The Guild's coach* row opens the map), never mid-fight or
    with the hero down. Out in the field, the Homeward Scroll is the way home (§8).
  - **To** a town you've stood in, in a land that's open. The first visit is always on foot, so a land's road and its
    trouble are never skipped. The towns reached are saved (`reached`, save v28).
  - **The fare:** 10 gold a day of road, the shortest way on the coach roads (Thornwick–Saltmere a day; each region
    adds its own with its milestone, through the Lamphall). A token: the coach is a service, not a cost to plan for.
  - **At once:** the clock, the weather and the time away don't move; a card says the day on the road while the
    other town comes up. The company travels as it is.
  - Refused by name: off the square, to a shut land, to a town not reached, short of the fare.
- **Each land's overland** (v1.50). A region's overland is its own map, 260 × 260 tiles, north up, laid out by hand on
  its sketch (`tools/worldmap/overlands.mjs`) with the scatter from the seed: its town's walls in small with the gate
  where the town scene's is, its waystations and sites as landmarks, the imperial roads ruled straight with a dead
  beacon-tower every day's march, tracks to the sites, and its own ground.
  - **The Hollow Vale** and **the Greywater Fens** are played.
  - **The Cinder Reach** and **the Pale Heights** are built as previews (`?scene=overland&region=reach|heights`;
    [reach-heights-overlands.md](./reach-heights-overlands.md)). The Reach is ash-dusted scrub with cracked earth and
    rust-red tailings, Ashgate where the Wickham, Kell and Solmere roads meet. The Heights are patchy snow and scree,
    the frozen Sol, the Stair from the Frozen Hospice to the crater's Lip, the crater floored with glass.
  - Until a land opens, its sites have no doors and its roads out are shut, each with a pre-written line, the way the
    canal road waits for Act I.
- **Sites** are the current dungeon levels. Each site has 1–5 floors, a theme and tile variant
  from its region. Each room has a spawn table and a level; corridors and the entrance room
  are safe, and the floor's boss waits in the descent room. Kinds:
  - *Keeps*: flagstone, fewer, larger rooms, human enemies.
  - *Crypts / barrows*: cobble, Ashbound.
  - *Caves*: cavern style.
  - *Imperial works*: rune plates.

### 10.1 Time of day (v1.10)

- **The day.** An in-game day is **an hour of play** (`DAY_S` = 3600 s in `src/sim/heroes.js`; it was
  24 minutes). It has four parts of 15 minutes each, in order: **dawn, day, dusk, night**
  (`partOf` in `src/sim/npcs.js`). The clock is the sim's, so it is deterministic and replays.
- **What runs on it:**
  - Dawn pays the Lantern Guild's wages (§6.2), the same amount a dawn as before, and puts up a
    new board (§9) and a new tavern roster.
  - The temple's free raise is once a day.
  - The townsfolk walk their routines by the part of the day, and Ink reads it as `day_part`.
- **Old saves.** A save from the 24-minute day loads on the same day number at the same time of that
  day (save v15), so nothing kept by the day is lost or paid twice.
- **Night changes nothing in play.** No more foes, no other spawns, no change to any number. Only
  the light and the dial change (below).
- **The light** (`src/render/daylight.js`; measured in `art-critic-pass-5.md`). Town and overland
  are lit by the part of the day; dungeons keep their own light. The sun can't move (the shadows are
  baked at one low angle), so each part changes the light's colour and strength instead:
  - **Dawn:** a rose-gold sun, the windows fading.
  - **Day:** a warm white sun, a neutral sky, dark window glass, lamps low, the baked shadows lifted
    to soft shade.
  - **Dusk:** the game's old look, unchanged.
  - **Night:** cold moonlight at about 45 % of day's brightness, the windows and lamps brighter, and
    the hero's carry light bigger. Moody, but you can still read the ground and the foes.

  Each part blends into the next over two minutes of play, centred on the boundary. The title screen
  is always at dusk.
- **The top bar** (v1.35, 2026-10-05; `docs/hud-mockup.html`, the owner: "The weather icons line can move left, making
  room to shift the mini map and buttons below up", and "account for the shrine buff text"). The ☰, then two lines:
  - **Line 1:** the place name; gold and cinders on the right, ending on the minimap's right edge.
  - **Line 2,** under the name: the sky dial, then the wages. It stops 118 px short of the right edge (it wraps on a
    narrow phone), so nothing of the bar sits over the minimap.
  - **Line 3,** only while lit: Weakened and the shrines' boons as chips (`weakened · 7 min`, `ATK +25% 1:52`,
    `DEF +25% 1:40`), word, amount and time left; tap one for a line on it. (On line 1, two boons had squeezed the
    place name to nothing and run off screen.)
  - **The minimap** hangs 6 px under line 1 (it was 10 px under the whole bar: 22 px higher on a phone), the compass and
    the Journal 8 and 60 px under it; every right edge 12 px in. Measured at 390 × 844: the minimap 270–378 × 36–144,
    the compass 152, the Journal 204 (were 58, 174, 226).
- **The sky dial.** It sits at the start of the bar's line 2 (v1.35; it was under the cinders). A half arc carries the sun from dawn to
  the end of dusk and a crescent moon through the night, and the part's name is always written next to
  it, never colour alone.
  - **Tap it** (44 px or more) for one line: when the next part comes, when dawn comes and the wages
    then.
  - **Room for it:** on a phone the EMBERFALL wordmark leaves the in-game HUD, so line 1 fits: place, gold,
    cinders. Only the place name can shorten, with an ellipsis.
  - **No overlaps:** a browser test checks the dial against everything on screen at four widths, in
    town, on the Vale and in a fight.
- **Weather** (v1.20; the owner, 2026-10-03: "weather cycles … not overly visually intrusive — rain, fog,
  snow … on longer cycles", then "windy day for weather too").
  - **The schedule** (`src/sim/weather.js`) is a pure function of the world's seed, the clock and the
    region, so the same moment always has the same sky. Nothing is saved, nothing draws on a stream, and
    nothing in play reads it.
    - The clock is cut into **spells of 20 minutes** (a third of a day). Each spell is clear, fog, rain,
      snow or wind.
    - In the Vale, about 39 % of spells are clear, 24 % rain, 20 % fog, 9 % wind and 8 % snow.
    - The fens are mistier and sheltered: 33 % fog, 4 % wind.
    - The reach is open and gusty: 17 % wind.
    - The heights are snowy and windswept: 29 % snow, 14 % wind.
    - Fog is likelier in a spell that starts at night or dawn.
    - A spell builds over 3 minutes and fades over 3. Where the next spell is the same weather it runs on,
      so a weather lasts 20, 40 or 60 minutes.
  - **Strength:** 0.55–1 at its height. Outdoors only: the dungeons are underground.
  - **The look** (`src/render/weatherfx.js`): mostly in the light, a little on the screen.
    - **Rain:** the sun dims by up to a third, colour and shadow soften, and sparse fine streaks fall.
    - **Fog:** a veil, thickest toward the top of the screen (the distance) and thin over the party,
      with soft banks drifting through. At night it's a darkening, not a grey wash.
    - **Snow:** a cold, even light and a few slow drifting flakes.
    - **Wind:** the air clears (less of the violet haze). Long, thin gust lines (the owner, v1.21: "longer
      intermittent string like streaks") draw themselves across the screen on the wind and are gone: each is seen
      for half its own 3–6 s cycle, about 4 on screen at once, a median 26 % of the screen's width long (p90
      47 %). They wave gently, brightest at the head. A few leaves still tumble by. The light and contrast are
      otherwise unchanged (+0.4 % and +0.8 % by day).

      ![Wind before (leaves only) and after (gust lines)](img/weather/wind-streaks.jpg)

    Measured at full strength against clear, the change in mean luma and contrast:

    | Weather | Day: luma, contrast | Night: luma, contrast |
    |---|---|---|
    | Rain | −24 %, −21 % | −20 %, −12 % |
    | Fog | +8 %, −29 % | −14 %, −18 % |
    | Snow | −8 %, −9 % | −5 %, −5 % |

    ![The Vale clear, in rain, fog and snow, by day and at night](img/weather/vale-weathers.jpg)
  - **The sound:** rain hisses (synthesised: `audio/engine.js`) and quiets the birds. Wind blows (Flare's
    wind loop) and the birds sing less. Snow brings a softer wind and a hush. Fog only hushes. It's all on
    the ambient slider.
  - **Calls** (v1.21; the owner: "at least 10 sec between each drop", then "same with birds and owls"): a bird
    by day, an owl at dusk and by night, a drip in the dungeons. Each is a single call, never closer than 10 s
    to the last of its kind, and further apart where it's quieter (dusk, weather, town, the mill's dry cellars).
    Measured: birds 12–25 s apart at dawn, the owl 10.5–19 s at night, drips 10.8–15.1 s in the warren.
  - **The weather's icon** (v1.22; the owner, 2026-10-04: "icons only for weather"): a 16 × 14 px icon between
    the dial and the part's word: sunny, partly sunny, fog, rain, snow or wind, and by night a moon (clear) or a
    moon behind a cloud (partly cloudy). The word is never beside it: the dial's tap says it ("Day · dusk in 9 min
    · partly sunny", or "· rain, clearing in 9 min") and so does its screen-reader label. No icon underground.
    - **Sunny or partly sunny:** each clear spell is one or the other by its own hash on the weather stream, the
      same sky for everyone on a seed: about half and half in the Vale, sunnier in the Reach, cloudier in the Fens
      and the Heights. A weather still setting in or clearing (under 0.15) shows partly sunny too. It's the icon
      only: the light and the sim don't read it (`skyAt` in `src/sim/weather.js`, `src/ui/weathericon.js`).

      ![Every icon in the top bar, by day and by night](img/weather/icon-shipped.png)
  - **Dev:** `?dev&weather=rain|fog|snow|wind|clear[:0..1]|sunny|partly` holds a weather (and its icon) for captures.

---


### 10.3 Spawn points on the overland (v1.63)

The owner: *"a MVP of some overlap NPC spawn points that each map should have."* A land's map has fights of its own,
small ones, between its town and its dungeons: something to meet on the road and a reason to walk off it.

- **Two kinds.**
  - **A camp:** a band at a fire, seen before it sees you. They stand at their posts round it, idling, until the party
    comes within **reach** (its aggro radius); then the fight is on.
  - **A nest:** a burrow, its foes out at the hole while it's full (v1.67: it was nothing to see but the burrow), on the
    party when it comes within reach.
- **Its bands.** A spawn point's wave is its band (a camp's kinds and count), or a nest's one or two. No tide: each band
  is the same strength. It fights in an **arena** round it (a circle a few tiles wider than its reach), the way a room
  bounds a dungeon fight: walk out of the arena and the fight is off, the band is back at its posts whole.
- **Cleared, and back.** Its foes pay what they pay anywhere (XP, gold, a wave's chance of a drop). Then it stands
  empty for its **respawn**, **8 s** (v1.66: half as fast as a dungeon room, whose lull is 4 s): stay in the arena and the
  next band comes on then, as a room's next wave does; walk off and it's full again when you're back.
- **Its level is its own,** flat, like a trial site: the Spit's goblins are level 2, the ditch burrow's rats level 1.
  **An elite now and then:** each time it fills, one in four, one of the band is the kind's elite (×2.5 HP, ×1.3 ATK,
  as in a dungeon).
- **Kept.** When each spawn point is next full is saved (save v37), so a reload doesn't fill a camp you just cleared.
- **Errands.** A quest can ask for a spawn point cleared (`camp` objectives, counted on each clear); the compass leads
  there across the land.
- **Not the contract.** §7.1's targets are a room visit you don't walk out of; a spawn point is a low, flat level with no
  tide, so standing at it is a slow grind for a hero of its level and none at all for one past it (XP by level, §4).

| | Where | Band | Level | Elite | Reach · arena | Respawn |
|---|---|---|---|---|---|---|
| **The Spit** (camp) | the Vale's far east, 6 tiles off the east road (v1.67; was past the crossroads, and first the river above the bridge) | three goblins round a fire, Col's cow dead beside it | 2 | 1 in 4 fills | 29 · 33 tiles (v1.69, a fifth less; was 36 · 40, 12 · 16, first 7 · 11) | 8 s (v1.66; was 10 min) |
| **The ditch burrow** (nest) | outside Thornwick's palisade, under the south-west corner tower | one or two grave rats, waiting at the hole (v1.67) | 1 | 1 in 4 fills (Old Gutter's kind) | 14 · 18 tiles (v1.69, a fifth less; was 18 · 22, 10 · 14, first 5 · 9) | 8 s (v1.66; was 5 min) |
| **Garrow's picket** (camp, v1.68) | the hill east of Wickham Keep | three of the Redhand (cutthroat, crossbowman, brute) round a fire under a red banner | 5 | 1 in 4 fills | 21 · 25 tiles (v1.69; was 26 · 30) | 8 s |
| **The old picket** (camp, v1.68) | the river's southern bend, the Vale | three Ashbound legionaries round the Third Legion's standard | 8 | 1 in 4 fills | 21 · 25 tiles (v1.69; was 26 · 30) | 8 s |
| **The spinner beds** (nest, v1.68) | the Fens' reeds, south-west of the Canal Locks | two or three giant spiders and spinners | 11 | 1 in 4 fills | 21 · 25 tiles (v1.69; was 26 · 30) | 8 s |
| **The old stones** (camp, v1.68) | the Fens, north-east of Saltmere | two stone golems in a ring of standing stones | 14 | 1 in 4 fills | 21 · 25 tiles (v1.69; was 26 · 30) | 8 s |
| **The drowned graves** (camp, v1.68) | the Fens, east of the Abbey toward Reedholm | three graveyard wraiths among sunk graves | 17 | 1 in 4 fills | 21 · 25 tiles (v1.69; was 26 · 30) | 8 s |

The table is the sim's own, `src/sim/camps.js` (each land's spawn points, as `outdoor.js` holds its places); the fights
are `battle.js`'s; the errands are Col's *Bramble* and Jory's *The Ditch* (`content/quests/`). Measured, a lone hero
against the Spit (12 fights each): level 1 wins 5, level 2 wins 7, level 3 wins 11, level 4 all 12; the ditch burrow at
level 1, all 12.

Each dresses its own ground (`dress` in the table's file, put down by `outdoor.js`): the Spit its cookfire, the dead
cow beside it, a sacking tent, crates, sacks and bones; the burrow its mound of earth and a few bones. Nothing of it on
a post or a hole. The burrow sits at the south wall's west corner, open ground between it and the camera (which looks from the
south-east), so the fight is in view ([level-design-rules.md](./level-design-rules.md) §1.1), and off every way the
compass walks. Tried and dropped: the north and west walls (the town stood between it and the camera), the south wall's
middle (a grove did), the east wall (the compass's way in from the barrows: the rats stopped every walk to town).

![The Spit at dusk, the goblins at their fire, the dead cow beside it; the ditch burrow at the south wall's west corner](img/world/spawn-points.jpg)

## 11. Economy

| Currency | From | For |
|---|---|---|
| **Gold** | Quests, bounties, selling, chests, foes | Hiring (fee and dawn wages, §6.2), Ask around, Retrain, healing, the inn, shop gear, upgrades |
| **Cinders** (✦) | Salvage, elites (1), bosses (5) | Smith upgrades, reforging a trait |
| **Wood / Stone** | Chests, rocks (existing counters) | High-tier upgrades; future camp or town improvements |
| **Renown** (per region) | Quests, bosses | Unlocks; not spendable |

Shops never sell above Common, so the best gear is always found.

---

## 12. Offline and multiplayer

**Offline-first.** The whole game runs locally with local saves (seed + diffs, as today). No
server is needed to play.

**Fair play (v1.2).** Progress that counts anywhere shared is **verified**:
- The server replays each play session's command log in the same deterministic sim, and only
  that result is stored.
- Edited memory, edited saves, forged items and sped-up clocks don't survive the replay.
- Offline play is unverified until it syncs.

See [development-plan.md §2.13](./development-plan.md).

**Offline grinding (v1.18, the owner's pillars, §1).** Close the game and the party carries on
where you left it, on exactly the online rules. On return, the *same* battle sim fast-forwards
the time away, headless and deterministic, so the result is exact and cheat-checkable.
- **Same as online:**
  - XP, gold, materials, cinders and gear drops at the online rates;
  - wages due at dawn as usual.
- **Defeat is possible.** If the room would beat the party, it does, just as it would online: the
  hero goes to the temple and downed companions are slain. Don't leave a party grinding somewhere
  it can't hold.
- **In town, companions are on retainer.** A party left in town (not grinding) pays its companions
  the bench rate, half wage, for the time away, as a retainer rather than a day's hire (§6.2).
- **Windows:**
  - free: up to **4 hours** of offline time counted;
  - premium: **8, 24 or 36 hours**.
  - Time beyond the window isn't counted.
- **In the game (v1.32, 2026-10-04; `src/ui/away.js`, `src/sim/core.js` `away`):** when a game comes back after a
  minute or more (loaded from its slot as play starts, or a tab shown again), a *While you were away…* screen plays the
  time through on the same sim, exactly, with a bar; about 360× real time on a desktop browser (4 hours in about 40 s),
  slower on a phone. **Stop here** ends it early (the rest isn't counted). Then it says what happened: the waves held and
  foes down, gold (wages paid), cinders, each member's XP or levels, what was found or salvaged, a warden or landing, who
  was slain, a beating. Presentation sits the hours out (the bus is quiet: only the sim's own listeners and the screen's
  collector hear) and the autosave is held until it's done, then written at once. Only the free window is in (4 h);
  premium windows wait for accounts (M6). The time away is the page's clock, so it's unverified until a sync replays it.

**Multiplayer (future), in order:**
1. **Async.** Undervault depth leaderboards. **Hire a friend's hero:** your main can be posted
   as a hireling snapshot in other players' taverns and earns you gold when hired.
2. **Co-op.** Two or three players each bring their main as the party, in a lockstep
   deterministic sim with the host authoritative.
3. **Arena.** Async party-vs-party autobattles against snapshots.

**Expanded in v1.2:**
- **Shared instances:** town presence and co-op sites.
- **Group raids:** 4–6 players against *Heroic* region bosses.
- **Live PvP arena:** 1v1 and 3v3 party autobattles with seasons.

The servers are authoritative and run the same sim. There's no player trading at first.
Phases and tech are in [development-plan.md §2.12](./development-plan.md) and
[architecture.md §6](./architecture.md).

The fixed-tick, seeded, command-driven sim is exactly what 1–3 need. Command logs plus a seed
reproduce any battle for validation.

---

## 13. UX (portrait, one thumb)

| Screen | Content |
|---|---|
| **Site (iso)** | The current view: virtual stick or tap to move, tap to interact, minimap with room threat. In a room battle: overhead pips, a room-level and wave banner, stance toggle (bottom; no potions, v1.13). Doorways glow as exits. |
| **Party cards** (always) | Bottom of every screen: **you in the centre, up to two companions either side**. Each card has a portrait, level badge, name, class, HP bar, ATK / DEF / CRT / DDG, and level with an XP bar. Empty slots say *hire at a town tavern*. |
| **Town square** | The home screen: the same fixed framing in every town (temple, inn, shop, tavern, smithy) with name plaques; a bottom bar of the five services, shown once you're near the square; each opens a bottom-sheet menu. No minimap here. |
| **Quest board** | Cards: giver portrait, hook line, skulls, rewards. |
| **Party** | Three figures with live 3D previews, gear slots, stats and abilities; drag to reorder formation. |
| **Overland** | A scrolling fogged map with the party token; tap a node to travel. |
| **Chronicle** | Lore fragments by region, and set completion. |
| **Title** (v1.2) | A live dusk vignette of Thornwick; Continue / Party / Settings / Account. |
| **Game slots, Party and Creator** (v1.2) | Up to three games. Each game has three hero slots (main plus two companions), with a bench swap. Creation is a live preview plus steps: class, look, origin, name. |
| **Character window** (v1.2) | Tap a party card. Tabs: Gear · Stats (spend points) · Skills (ranks, auto-cast, stance) · Bag · Info. |
| **Dialogue** (v1.2) | Bottom sheet: portrait, lines, up to 4 choices, quest offer cards. |
| **Journal** (v1.2) | Active · Available · Completed · Chronicle · Discoveries; Track pins the compass. |

Everything that matters sits in the lower two-thirds of the screen, within thumb reach.

**Other screens (v1.18, the owner).** Portrait on a phone is the design; the rest adapt rather than stretch:
- **Desktop and tablets** keep things about the phone's size and show more world, instead of blowing 25 tiles up to
  fill the window (a mouse gets a quarter more size, since a desk is viewed from further).
- **The zoom (v1.61)** is the player's, from 67 % to 150 % of the default above (a third and more each way): a
  two-finger pinch on the world (the stick lets go, and no tap fires until both fingers are up), the mouse wheel, or
  Graphics' *Further*, *Default* and *Closer*. Kept per device; the overlay and every tap follow it.
- **A phone on its side** (landscape, under 540 CSS px tall) moves the **party cards into a column on the left**,
  you on top and companions below, compact (one row of stats). Everything else keeps its portrait place: the HUD row
  along the top, the compass and Journal buttons and minimap on the right, the town's service bar and the quest
  tracker along the bottom (right of the column), and the camera centres the hero in the open part of the screen.
  ![Landscape before/after](img/landscape-phone.jpg) (`src/ui/party.js`, `--party-side`; browser test 17)
  - **The notch (2026-10-03, the owner's screenshot).** Sideways, iOS reports the same 47 px inset on both sides,
    though the notch is on one. The page reads which way the phone turned (`src/ui/safearea.js`): the notch's
    side keeps the inset, the other side a plain 16 px, clear of the rounded corner. So with the notch on the
    right, the cards sit 16 px from the left edge, not 55, and the minimap, compass, Journal and Step-out stand
    47 px further in, off the notch. With it on the left, the cards clear it and the right-hand side hugs the edge.
    The card's stats are one row of label-and-value pairs (DDG 18.6 % had run out of the card).
    ![Notch on the right, then on the left (drawn in black)](img/landscape-notch.jpg)

---

## 14. What the prototype already provides

| In the build today | Becomes |
|---|---|
| Headless 20 Hz deterministic sim, seed + diff saves | The battle sim, offline expeditions and the multiplayer basis |
| Themed dungeon levels: rooms, corridors, weathered walls, descent, minimap | Sites and floors; rooms are the battle arenas, corridors the safe paths; post-game Undervaults |
| Six biomes; five tile styles × seven variants (plain, earth, rock, lava, poison, ice, water) | Region looks (world doc §3) |
| Chests, shrines, braziers, stairs | Loot, heals and lore; floor exits |
| Emberlit lighting; hazard pools | Battle readability; terrain tactics |
| 56 px KayKit actors, baked with real normals (knight hero; four Ashbound skeletons) | The class models and enemy families; the lab bakes rogue, mage and human enemies next |

**Needs building:** the combat sim and AI, the stats/class/loot data model, party and UI
screens, towns, the overland map, the quest generator, the Chronicle, expeditions and the
Emberfall rename.

---

## 15. Roadmap

> **v1.2:** the build order is now kept in
> [development-plan.md §3](./development-plan.md). It adds M2.5 Foundations, M3 Heroes,
> M4 Story engine, M5 The Hollow Vale, M6 Accounts and ship, M7 Endgame loops, and (v1.23) M8–M14
> the Old Provinces a region at a time, with multiplayer around them (M10, M15, M16). The table below is the original v1.1 plan,
> kept for history.

| Milestone | Scope | Exit test |
|---|---|---|
| **M1: Battle core** | Stats and formulas, three classes, room battles with respawning waves at fixed room levels, leashing, tap-to-move, abilities, defeat, XP and levels | A solo fighter holds a room of their level indefinitely and can walk out of a bad one |
| **M2: Party and town** | Two companions, Thornwick hub, tavern, smith, shrine, quest board (Hold/Bounty/Rescue/Retrieve), loot v1 | A 15-minute session loop feels complete |
| **M3: The Hollow Vale** | Overland region 1, four sites, Act I, Chronicle v1, balance pass | Levels 1–8 playable end to end |
| **M4: Idle and depth** | Expeditions, upgrades, salvage, Rare/Heirloom, bad-luck protection | A day of play-plus-idle feels rewarding |
| **M5: Fens and Reach** | Acts II–III, new enemies (Cult, beasts), Delve/Escort/Investigate | Levels 8–22 |
| **M6: Heights and Throne** | Act IV, finale, post-game Undervaults | Campaign complete |
| **M7: Multiplayer** | Async (leaderboards, hire friends' heroes), then co-op | — |

**M1 status (battle core, first pass — `src/sim/battle.js`, room levels in `world.js`):**

- **Starting a battle:** stepping into any dungeon room other than the entrance starts one.
- **Waves:** they spawn on reachable tiles at least 9 tiles away and follow §3.3.
- **Your hero** strikes whatever is in reach while you steer, and autobattles when you let go.
- **Companions** hold formation and choose their own targets: the fighter protects you, the
  rogue hunts the weakest foe and the mage keeps its distance.
- **Abilities:** each class has one auto-cast ability: Cleave, Backstab and Firebolt.
- **Movement:** units path around obstacles with a flow field over the room.
- **Focus:** tapping an enemy sets a focus target.
- **Compass travel** (`docs/compass-mockup.html`): a compass under the minimap lists places
  that depend on where you are. Picking one makes the party walk there on its own, along
  corridors where it can. A chip above the party cards shows the destination and steps left;
  it cancels the walk, and so does the stick.

  | Where | Destinations |
  |---|---|
  | Dungeon | Next unexplored room, room at your level, nearest unopened chest or shrine, stairs down (greyed until found), exit |
  | Overland | Town, nearest dungeon, nearest unexplored dungeon, landmarks |
  | Town | Square, nearest dungeon (by the road out), road out |

  A walk that runs into a fight stops so the party can fight. Unless that room is the
  destination, the chip's Resume carries on through it.

  **Journeys** (2026-09-30): a walk only stops for a fight or where it was going, never at a
  scene change. The tracked quest's row, *Nearest dungeon* (in town or on the Vale) and the
  stairs down walk on after each scene change: out of town, across the Vale, into the barrows
  or a floor down, and on to the next unexplored room (or the quest's next place). The road
  out, the town and the exit still end where they say. The stick, a tap and ✕ end a journey
  (`sim/core.js`, `test/journey.test.mjs`).
- **Tap to move** (§3.1): tapping the ground walks the hero there along an A* path (the
  route shown as a gold ring and trail). Tapping a chest, shrine, stairs or growth out of
  reach walks up to it and uses it. The stick cancels the walk at once.
- **Leaving and defeat:** enemies are leashed to their room, so walking out ends the fight.
  A total wipe costs 25 % of your gold and sends you back to town.
- **Regen** grows with the pool (base rate × max ÷ level-1 max), so a lull restores the same
  share of HP at every level.

**Balance:** superseded by the difficulty contract in §7.1 (v1.5, 2026-09-30). The old contract
was "a solo L1 fighter holds a level-1 room for 10 minutes": every room could be farmed forever,
alone, at any level. The before and after numbers are in
[difficulty-pass-1.md](./difficulty-pass-1.md).

**Still to come:** loot drops, bosses, stances, ability slots and hazard terrain.

---

## 16. Open questions

> **v1.2 decisions** ([development-plan.md §6](./development-plan.md)):
> - **#2 Defeat cost:** revised in §3.6.
> - **#3 Quest refresh:** in-game dawn, plus an optional real-time daily bonus.
> - **#4 Hardcore:** opt-in, later.
> - **#6 Rename:** at M2.5.

1. **Manual moment?** Keep battles fully auto, or add one "rally" button per room visit (a charged
   party ability) for a small skill expression?
2. **Defeat cost.** Is 25 % of carried gold plus Wounded companions the right sting for a
   grind game where you choose how long to stay?
3. **Quest refresh.** Real-time dawn refresh (encourages daily return) vs play-based refresh
   only?
4. **Hardcore mode** with permadeath, as an opt-in?
5. **Monetization** (if any): cosmetics and expedition slots only. Never sell power or loot.
6. **Rename timing:** switch the build from EMBERHOLD to EMBERFALL now, or at M2?
7. **Room-level pacing.** Is +1 level every two rooms and +3 per floor the right slope, and
   should a floor's rooms hold a fixed range regardless of layout?

---

## 17. The Old Provinces (v1.23)

The owner's decisions of 2026-10-04 ([world-map-proposal.md](./world-map-proposal.md),
[region-towns-proposal.md](./region-towns-proposal.md); canon in world doc v1.20). Each rule lands with its milestone
(development plan §3); until then the shipped rules stand.

**The map and the cap.**
- (v1.48) **Emberfall runs 1–18** (the Vale 1–9, the Fens 10–18) and **the Reach opens at 19**: one dungeon a band of
  three (§3). With bands of three the cap at 75 is 25 dungeons in all; later maps take about five each, and more
  maps (islands off the coast) can carry the bands past 75.
- **Six regions to level 75**, five bands of 15: Emberfall 1–15 (the Vale 1–8, the Fens 8–15), the Reach 15–30, the
  Tidemark 30–45, the Greenwood 45–60, the Heights and the Throne 60–75. Solmere opens at 15.
- **One gate:** each region opens at the previous region's finale. Renown opens side content and Solmere's embassies.
- **One full town per region**, the player's base, with the same square; waystations elsewhere. Decided: large and
  walled (Ashgate, Tollhaven, the Lamphall); small and open (Rookstead, Frosthold, Saltmere); Thornwick as built.

**Numbers, before any band past 30.**
- **XP goes linear above 30**, about 26 minutes of fighting a level, so the late bands don't swell. (v1.38: superseded for
  now by §7's 15 % a level, the owner's call; M9 revisits the bands past 30 with the stat rescale.)
- **Stats compound, from integer tables** (deterministic, like `XP_TABLE`): today's linear growth makes one level
  stop mattering above 30 (a room three up is +41 % HP at L6, +15 % at L30, +9 % at L60). The room premium is capped.
- **The smoke contract** (§7.1) extends to levels 15, 30, 45, 60 and 75.
- **One ground-hazard system**, with the party's AI stepping out of it (burning patches, the Abbess's water, slag).
  - (v1.36, M8.6; `src/sim/hazards.js`) **Implemented.** A hazard is ground you can walk, at a cost: a **patch** (a
    disc with a lifetime) or a hall's **flooded edge** (every floor tile within N of its walls). A party member
    standing in one moves at half speed (the hero when you steer, too) and recovers from a blow at 0.7 the rate.
    The party's AI steps out to the nearest open ground before it does anything else, then goes back to its fight:
    always out of a patch (it's short, and the foe follows), and into the flood only to reach what it's fighting.
    Foes walk through it. A hazard goes with the boss that raised it, or when you walk out.
- **The Fens' bosses** (v1.36, M8.6; world doc v1.27; one a hall, each with one mechanic, `battle.js` BOSSES):

  | Hall | Boss | Mechanic |
  |---|---|---|
  | Toadking's Mound, floor 2 (floor 3 since v1.48) | **The Toadking** | *Mud*: every 9 s, a patch (radius 1.8, 6 s) under each of the party standing. (v1.83) His gulper, Dumpling, and a fowler at his side |
  | The Drowned Abbey, floor 1 | **Brother Teague** | *The Cage*: his lantern-cage (35 % of his HP) stands at his side; while it's lit he mends 2.5 % of his HP a second and takes half damage. Breaking it frees its soul (a lamp and a soul, as a cage does) |
  | The Drowned Abbey, floor 2 | **The Drowned Choir** | *Vespers*: two cantors sing with it; while one stands, every drowned foe in the hall (the Choir too) mends 2 % of its HP a second, and every 12 s with fewer than two singing another stands up |
  | The Drowned Abbey, floor 3 | **The Abbess Below** | *The Bells*: every 12 s a bell, and the water comes in from the walls, 12 % of the way to the hall's middle a bell (to 4 bells: about three quarters of the floor); her choir-lamp breaks with her (312 souls, once), and the water goes down |

  Measured (`tools/balance/boss.mjs`, fighter + rogue + cleric in their kit at the hall's level, seeds 20260807 / 777 /
  4242): the Toadking (11) falls 3 of 3 in 53–56 s, the party's lowest 68–80 %; Teague (13) 58–64 s, 73–81 %; the
  Choir (14) 78–99 s, 72–76 %; the Abbess (15) 63–79 s, 71–75 % (and to a party a level under, 67–83 s). The Vale's
  bosses, for the same measure: 57–107 s, 43–74 %.
  Their heirlooms: *The Last Tooth*, *Teague's Name*, *Vespers* and *The Last Office* (items.js HEIRLOOMS). Teague
  falls once (a story boss); the others come back each visit. The Canal Locks and the Sickpools keep a boss-less hall
  until Act II gives them one. (v1.48: the Sickpools are the Locks' third floor now, and the Vatwarden holds its hall.)
- **The two bosses of v1.48** (one dungeon a level, §3; world doc v1.32):

  | Hall | Boss | Mechanic |
  |---|---|---|
  | The Old Barrows, floor 3 (3) | **The Quartermaster** of the Third Legion | *Issue* (v1.54): every 10 s the last of his ranks to fall stands up whole where it fell, re-armed from his racks; with none down, the most hurt living one (not himself) is made whole. One he stood up pays nothing again. Put him down first, or the hall never thins |
  | The Canal Locks, floor 3, Vat Seven (15) | **The Vatwarden**, the Cult's overseer at the vats | *Sluice*: every 11 s he opens the vat's sluice, and a strip of sick water (a ground hazard, §17 above) runs across the hall through the party for 6 s |

  The Fens' four keep their mechanics at their new halls: the Toadking on the Mound's third floor (12), Teague (16),
  the Choir (17) and the Abbess (18) on the Abbey's three. Old Skarn drums in Wickham Keep's bailey (4), the Standard
  holds the Sunken Chapel's last hall (9).

  Measured (`tools/balance/boss.mjs <site> <lv> 1,2,3 --floor N`: fighter, rogue and cleric at the hall's level, three
  seeds; the time he falls, and the party's lowest HP):

  | Boss (hall level) | Falls in | Lowest HP |
  |---|---|---|
  | The Quartermaster (3) | 60–67 s (v1.54, six seeds; was 50–54) | 73–83 % (a party a level under: 73–92 s, 21–78 %, downed in two of three) |
  | Old Skarn (4) | 70–79 s | 55–75 % (five seeds) |
  | Captain Garrow (6) | 56–62 s | 58–67 % |
  | The Robed Stranger (8) | 55–58 s | 75–76 % |
  | The Standard (9) | 81–88 s | 67–78 % |
  | The Toadking (12) | 54–62 s | 69–78 % |
  | The Vatwarden (15) | 64–71 s | 71–77 % |
  | Brother Teague (16) | 57–63 s | 73–76 % |
  | The Drowned Choir (17) | 76–123 s | 69–72 % (five seeds) |
  | The Abbess Below (18) | 76–87 s | 65–73 % |

- **Singers and the drummed hold their ground (v1.48, repairing v1.47).** Doubling every shooter's reach (v1.47, §5)
  broke two boss fights: the Drowned Choir's singers (*Vespers*) and the goblins Old Skarn drums up stood back at the
  new reach, out of the party's, and the hall never thinned. The Choir at 14 went from 3 of 3 won (64–75 s) to 0 of 3;
  Skarn at 5 from 3 of 3 to 1 of 3. Now:
  - **a singer holds within 3 tiles of the Choir** (`battle.js` `STALL_R`) and shoots from there, so the party
    reaches the singers while it fights her;
  - **a drummed foe that shoots closes to half its reach** before it shoots, so the goblins Skarn calls come to the
    fight.

  After: the Choir at 17 wins 5 of 5 (76–123 s, lowest 69–72 %), Skarn at 4 wins 5 of 5 (70–79 s, lowest 55–75 %).

**Skills.**
- **A skill every three levels (v1.56, §5.1, the ladder; it supersedes one new active per region at 18, 33, 48 and 63,
  each a choice of one of two, and a second passive at 40):** every third a passive, nothing to choose between. Laid out
  to 27; the regions past the Fens carry it on, and a passive never touches gold.
- **The loadout (v1.56):** four abilities in play from the start; the rest wait in the book.
- **A free respec** at any temple.
- Every skill states its **autocast test**; there's one "can't drop below 1 HP" effect in the game (the cleric's
  *Lifeline*). The **Healer** class is deferred.

**Lamps and the count.**
- **A lamp** is a site's set piece in its last room, with the list of foes tied to it. While its keeper stands it
  can't be struck; once broken, every foe on its list lies down. One sim rule, reusing "break what shields him".
- **Cages:** a Cult harvester's or buyer's lantern-cage frees one soul when broken.
- **The count:** the Chronicle keeps **lamps broken** (cages included) and **souls freed** (each Ashbound put down,
  each cage, each soul a broken lamp held). Two durable integers on the game slot, added to only by sim rules, with
  a save bump; a migration credits saves that already broke the Standard. Later a leaderboard, **the Freed**,
  written only by the replay validator.
- (v1.28, M8 slice 5) **Implemented:** `src/sim/lamps.js`. The Standard's lamp breaks with him (240 souls, the Third
  Legion's muster), and the bound still standing in his hall lie down, freed: no XP or coin for those. A harvester's
  cage falls where it does, underfoot; a tap breaks it. The count heads the Chronicle; save v19.
- (v1.35, 2026-10-05; the owner: "Lantern cages drop way too often", "elite harvesters only, and characters should
  automatically pick up after a few seconds when not in combat") **Only an elite harvester** (a band's every fifth
  wave) drops a cage (world doc v1.26): measured over 20 minutes of a level party farming (the same waves and foes
  before and after), the Sickpools went from 1.95 cages a wave (258 an hour) to 0.18 (24), and the Drowned Abbey from
  2.50 (270) to 0.19 (21). And **the party
  picks it up**: after 3 s with no foe standing (out of a fight, or in a room's lull), the member standing nearest
  breaks every cage within 14 tiles of the hero (the same lamp and soul as a tap; `lamps.js` CAGE_PICKUP_S, CAGE_REACH).

**Solmere.**
- **The Bowl:** async company against company first; server-picked opponents, one try a pairing a day, your own
  account's companies never in your pool, levels evened by bracket (15–29, 30–44, 45–59, 60–75), crowd control
  halved against companies, written rivals offline. It pays **marks of the Bowl** from verified bouts only (a
  daily cap); the heirloom shop's stock is defined later, and nothing in it outdoes a boss heirloom of its level.
  (v1.85, built for now with written rivals, src/sim/bowl.js, rivals.js: from the menu at level 6, brackets from 6–11,
  the hero alone or the company, blows ×0.5 and healing ×0.75 between companies, the daily ladder and tourney; see the
  header and docs/bowl-arena-proposal.md §9. v1.88: two ladders, Team and Individual, each its own rating and day's
  tourney, entered by a bout and paid by place; new faces for gold; proposal §13.)
- **The Mere Tower:** no XP; gold and cinders each wave; **+6 % a wave, compounding**, from a table; a new kind of
  foe every tenth wave; a landing every tenth (leave there and keep everything; beaten, keep what you'd won to the
  last landing). **Always playable offline**, the same sim; a climb counts once its replay is verified. **The Wall**
  counts the highest wave held in a live, verified, timed climb (the flame clock), per bracket and per season, seeded
  per season, written only by the validator. Each tenth-landing warden drops its heirloom the first time a company
  beats it, once per game slot per bracket, at the bracket's top item level, for a class in the party.
  *Tower-found* pieces (the Kindled pool) replace a room's Fine roll, no stronger than a Rare.
  **In the game (v1.31, 2026-10-04; `src/sim/tower.js`, `src/ui/tower.js`), ahead of Solmere:** Wenna Pike's punt at the
  end of a jetty off Saltmere's boardwalk takes a company out from **level 12** (world doc v1.23). The Tower's first
  floor is a landing and the stair hall; in the hall:
  - every wave is a **level-9 room's** × the table (1.06 per wave, compounding): at 12, a company in its kit was beaten
    by wave 6 (as in any room of 12 before the 9–15 tuning); at 9 it makes the first landing and is held near wave 18;
  - the ten waves of a block are one kind (the Ashbound, the Redhand, the goblins, the Toadking's men, the chapel's,
    the lock-cult, the diggers, the harvest, the drowned, round again), and the tenth is a **warden's** (the Doorward,
    the Mudlark, the Bellringer, the Lensman, the Hush, the Twins, the Tower Hound, the Gatherer, the Watcher, the Star
    Room), with an escort of its block; a warden calls, drums or kindles as the bosses do, and its first fall pays a
    boss's drop; (v1.34) its **heirloom** (world doc v1.25: the Doorward's Visor … the Star-Cut, a helm, boots, an
    off-hand, a weapon, armour or a trinket, three fixed affixes at 1.1×) drops the first time it falls in each
    bracket of the hero's level (12–14, then the GDD's 15–29, 30–44, 45–59, 60–75), at the bracket's top item level,
    made for a class in the party (the first base of its slot that class can use; save v23);
  - **no XP**; each wave cleared puts **120 gold × the table** and **a cinder** in the **satchel**, a warden five
    cinders more; the satchel and the climb show on the room pill;
  - at each **landing** the satchel is banked and the hall waits: **Climb on**, or **Home with Wenna** (back to the
    jetty, everything kept). Walking out mid-climb, reading a scroll, or being beaten loses what's in the satchel; a
    beating there costs no quarter of your gold;
  - the climb is saved (v21) and carries on at its wave after a load; the company's highest wave and landing are kept
    (its own Wall until the validator writes the real one; the flame clock, brackets and Tower-found pieces come with it).
  The jetty, a warden and a landing: `docs/img/mere-tower.jpg`. (2026-10-05) The jetty ends under Wenna's ferry stage,
  its sign a plaque with a › that a tap walks you to, as the compass's row does (`docs/img/mere-tower-way.jpg`).
  The wardens are baked at the bosses' 73 px, each its own look (2026-10-05; `docs/img/wardens.jpg`, `docs/fens-critic-pass.md`).
- **The Great Beacon:** a finite Guild site, two landings opening with each region from the Reach, its lamp-room
  after the Throne (★ *Let Them Go Dark*).
