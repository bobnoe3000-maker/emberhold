# The Old Provinces: a world beyond Emberfall

**Proposal, draft 2 (2026-10-04), awaiting the owner.** Draft 2 takes in two critic passes: a game designer's and a
D&D writer's (§10). Nothing here is canon until the owner signs it off and it lands in
[emberfall-world.md](./emberfall-world.md) (canon first) and the [GDD](./emberfall-gdd.md) (design).

The owner (2026-10-04):

> "Outline a world map like middle earth illustration style based on our world lore. We are just a smaller region
> thats part of a bigger fallen empire thats on a continent or island with other fragmented city states and
> kingdoms. Thornwick should cover up to level 15. Outline the other areas each covering the next 15 or 20 levels.
> … Thornwick and its main quest is the first to solve - the ashenborn dead. Other regions should have different
> mainline stories and quests. Outline the npcs and enemies found in each region. New skills to learn. Also the
> fallen empire city mentioned in lore is where players gather for the arena. Its a larger city but in somewhat
> disrepair. Also there is a dark tower where players can challenge wave after wave, no xp, but for a leader board
> and special loot. A boss at each 10th wave that drops rare items the first time defeated. Take a pass in this
> proposal with a game design and dnd writer critic pass…"

The "ashenborn dead" are the canon **Ashbound**, and this doc uses that name.

**Contents.**
- §1 The idea
- §2 The map
- §3 The regions (Emberfall, the Reach, the Tidemark, the Tithewood, the Heights)
- §4 Solmere: the Bowl and the Great Beacon
- §5 New skills
- §6 Enemies and art
- §7 How it hangs together
- §8 Numbers and phasing
- §9 Canon and design changes
- §10 The critic passes
- §11 Questions for the owner

---

## 1. The idea

Emberfall was always "the forgotten backwater of a fallen empire" (world doc §1). This proposal draws the rest of
that empire.
- **The Old Provinces** are an island-continent, once the whole of the Solmere Empire.
- At its heart, on a lake, stands **Solmere**, the dead capital, where the court, the treasury and the clerks were.
- North of it, in a crater in the Pale Heights, burned the **Ember**, in its own palace: the **Ember Throne**. The
  empire ruled from Solmere and *burned* at the Throne.
- When the flame went out, the provinces broke apart into:
  - a mining charter;
  - a league of free ports and a would-be emperor;
  - clan woods that never wanted the empire.

Emberfall stays what it always was: the empire's **granary**, far from anything that mattered. The tone rule
stretches, but no further: the last quest is about **the fate of the Old Provinces, never the world**.

**Each region's main story is about one thing the Fall left behind,** each in a different key:
- **Emberfall:** the dead who kept their orders. A war-ghost story.
- **The Cinder Reach:** the forges that still need feeding. A company town.
- **The Tidemark:** the living who want the throne back. A war of succession.
- **The Tithewood:** the souls the empire took and never spent. Folk horror.
- **The Pale Heights:** the flame itself. A pilgrimage, and an ending.

**The Cinder Cult** runs underneath all five as a buyer, a patron and a thief. In each region somebody else is the
villain, with their own reasons. The Cult needs four things to light the Ember again:
- **a spark:** shards struck from bound souls;
- **a vessel** to hold a flame;
- **a voice** the flame will obey;
- **fuel**.

Each region shows the player one of them. The Cult doesn't win every time.

**Its preacher, the Kindler** (Master Corvane Vell, canon), is met long before the end:
- preaching from a Cult boat at the Canal Locks, around level 10;
- at the miners' burial in Ashgate, paying for the stones;
- at the would-be emperor's table.

---

## 2. The map

![The Old Provinces of Solmere, in the 301st year of the Dim](img/world/old-provinces.jpg)

The Lantern Guild's own wall map: ink on parchment, hills in hatching, woods in little crowns, the imperial roads
ruled straight, with a dead beacon-tower every day's march. The corners are blank, because nobody has been. Source:
`tools/worldmap/draw.mjs` (seeded; `node tools/worldmap/draw.mjs` redraws it, with an SVG beside the JPG).

| | Where | Levels | Hub | Main story |
|---|---|---|---|---|
| **Act I–II · Emberfall** (the Hollow Vale and the Greywater Fens) | the south-west corner | **1–15** | **Thornwick** (and Saltmere, §3.1) | *Until Relieved*: the Ashbound dead |
| **Act III · The Cinder Reach** (the Deepdelver Charter) | the black hills of the west | **15–30** | **Ashgate** | *Quota*: the forges relit, and who feeds them |
| **Solmere**, the dead capital (a free city) | the centre, on the Mere | from 15 | **the Lamphall** | the Bowl (arena) and the Great Beacon (the tower); side quests only |
| **Act IV · The Tidemark** (the free ports, and the kingdom of Highmarch) | the east coast | **30–45** | **Tollhaven** | *The Seventh Solmere*: a would-be emperor's war |
| **Act V · The Tithewood** (the clan woods) | the south-east | **45–60** | **Rookstead** | *The Unpaid*: the tithe the empire never collected |
| **Act VI · The Pale Heights and the Ember Throne** | the north, round the crater | **60–75** | **Frosthold** | *The Throne of Embers*: the finale |
| After the finale | under the Throne, and in Solmere | 75 | — | the Undervaults (canon: the XP and loot dive) and the Great Beacon (the leaderboard) |

**The route** goes round the capital: Emberfall, up the Wickham road into the Reach, east to Solmere, out to the
coast, south into the wood, and last north up the Pilgrims' Stair.
- **Every region opens at the previous region's finale.** Maudry Fenn sends the company on after Act II, with a
  letter to the Guild in Solmere (*"Don't let them make you pay for the stairs"*).
- **Every region's first two sites overlap the last band by about three levels.** So a company can finish one
  region's story or start the next one's grind, and choose where to farm.
- **Renown** opens a region's side content and its embassy quarter in Solmere. It's no longer a gate on the road.

---

## 3. The regions

Each region below has the same parts:
- what it is;
- its main story, six chapters (★, as now);
- six or more sites, the first overlapping the previous band, plus a hidden one;
- three **rumours** (one of them false) and one **room** to remember;
- its people;
- its enemies and bosses;
- its Chronicle set.

Its skills are in §5.

### 3.1 Emberfall: levels 1–15 · Acts I–II · *Until Relieved*

**What it is.** As canon has it: the Hollow Vale's farms and barrows (1–8), and south of them the Greywater Fens
(8–15), round the drowned imperial canal. **Thornwick** is its town, and its chapters and board run to 15.
- **Saltmere** is the Fens' second town. Its square has all four services, in the stilt town's tone (GDD §10), so
  an 8–15 company needn't walk home to mend.
- The owner's "Thornwick to 15" reads as **Emberfall's story to 15**. That's question 1 in §11.

**The Grey Sisters, explained.**
- The Drowned Abbey belonged to the order the Grey Sisters came out of: the imperial **binding clergy**, who bound
  the tithe for the Throne. *"Bind them gently. Most of them volunteered."* was their prayer (Vale set, the Sunken
  Chapel).
- The Sisters keep records because their mothers kept the **binding rolls**. Nobody in Reedholm likes to say so.

**Act I, *Smoke over the Vale*** (shipped, 1–9): the Tithe Mill, Wickham Keep and Garrow, the Sunken Chapel and the
Robed Stranger, the Standard of the Third Legion. The road opens and the carts run.

**Act II, *The Drowned Abbey*** (8–15):
1. ★ *Fog on the Canal* (8–10). In Saltmere, **Wren** (canon) owes the Cult money and knows where its boats go at
   night.
2. ★ *The Locks* (10–11). At the Canal Locks a Cult boat is moored, and a man in its bows is preaching to the
   eel-fishers about a fire that was *stolen*. He's courteous, sincere and doesn't fight. That's the Kindler, and
   he won't give his name yet.
3. ★ *The Sickpools* (11–12). The Cult is draining the imperial vats. What's at the bottom is the fen dead, kept
   from rotting by whatever the empire brewed there.
4. ★ *The Bells* (12–13). The **Drowned Abbey**. The binding clergy drowned at their office when the canal broke
   on the night of the Fall. **The Abbess Below** still keeps the hours under the water.
5. ★ *The Rolls* (13–14). The Cult isn't burning the Abbey's records. It's **stealing** the binding rolls and the
   genealogies of every house the clergy served. You save what's left and carry it to Reedholm.
6. ★ *The Last Office* (14–15).
   - The Abbess falls, and Sister Ilse lays the province's shards side by side. Each one was cut from a bound soul's
     last light, struck from a legion or a choir like flint. The Cult wasn't raising the dead. It was mining them.
   - The Abbey's Cult ledgers name a buyer: the **Kell Assay** in the Reach. It pays in coal-red wax with a
     thumbprint in it, the same as the Paymaster's Box.
   - **The win:** the dead of the province are put down, and the records are safe.
   - **The cost, found later:** the genealogies you saved are copied at Reedholm, and the Kindler reads the copy in
     the Tidemark.

**Sites.**

| Site | Levels | What it is, and its room to remember |
|---|---|---|
| The Vale's six sites | 1–9 | shipped |
| **Toadking's Mound** (canon name) | 8–11 | a fen-folk bandit chief's island of stolen boats. *The Boat Hall*: forty hulls on their sides, and something living in each |
| **The Canal Locks** | 9–12 | the lock-keepers' halls. *The Sluice*: the bound lock-men lie in it in rows, still holding their windlasses |
| **The Sickpools** | 10–13 | the imperial vats. *Vat Seven*: drained, with a ladder down into what's left |
| **The Drowned Abbey** | 12–15 | three floors into the water. *The Choir*: the stalls are full, and the singing comes up through the floor |
| **The Reedholm Undercroft** (hidden: the Fens set) | 15 | the binding clergy's copy-room. Mother Agnes of Reedholm has kept it locked for forty years |

**Rumours.**
- "The Toadking's got a boat for every tooth he's lost." (True.)
- "The Abbey bells ring on their own at the dark of the moon." (True: the Abbess keeps the hours.)
- "Saltmere eels are fat this year because of what's in the canal." (False. Pim Rushlight started it to sell oil.)

**People.**
- **Wren** (canon): a smuggler who owes the Cult money, and the Fens' found companion (rogue).
- **Pim Rushlight:** a fen-folk halfling, chandler of Saltmere. He sells lamp oil cheaper than Wendel and wants
  Wendel told.
- **Mother Agnes of Reedholm:** the Sisters' prioress. She knows what the binding rolls are and would rather the
  Undercroft stayed shut. She doesn't want Ilse reading them either.
- **The Toadking:** fat, cheerful, and armed with a boat-hook.
- **Brother Teague:** the Cult's harvester at the Abbey, the Robed Stranger's superior. Unlike the Stranger, he
  gives his name.

**Enemies.**
- Fens (canon):
  - Cult acolytes and **harvesters** (a lantern-cage on a pole);
  - **fen ghouls**;
  - Ashbound rogues;
  - **bog-witches**;
  - the Toadking's **reed-cutters**.
- **Bosses:**
  - the Toadking (new: slowing mud he calls up);
  - Brother Teague (existing: "break the cage that heals him");
  - **the Abbess Below** (new: each bell raises the water, which slows the party and takes the floor's edges).
- **Region boss:** **the Drowned Choir** (canon), the Abbess's choir as a repeatable echo, met after her fall.

**Chronicle: the Fens set.** About the night the canal broke.
- *"Gates three and four untended since the second watch. The bound lock-men are lying in the sluice. The water is
  coming up the chapel steps."*
- The last fragment: *"We kept the hours. The water kept us."*

### 3.2 The Cinder Reach: levels 15–30 · Act III · *Quota*

**What it is.** Black hills of slag west of the capital, and the imperial foundries in them (canon §3.3, its
levels moved).
- **The Deepdelvers** held the seams under an imperial charter and ran the foundries. They never asked what the
  furnaces burned.
- **Hub: Ashgate** (canon).
- **Kell's Rest**, under a dead volcano (canon landmark), is the **Kell Assay**'s depot. The Assay took its name
  from the place.

**Act III, *Quota*.** Who pays to make a fire burn, and with what?
1. ★ *The Cold Shift* (15–18). Ashgate is booming; the Cinderworks are relit and hiring. Men on the night shift in
   the Slag Tunnels don't come up.
2. ★ *The Burial* (18–20). The miners' funeral. A courteous stranger pays for every stone. The company may know the
   face from the Canal Locks.
3. ★ *The Assay* (20–23). The relit works belong to the Kell Assay, which bought the lease from the Slagborn clan.
   Its factor, **Morrow Vane**, is polite, pays well, and keeps a ledger with a column headed *quota*.
4. ★ *The Charter Moot* (23–26). The clans meet in the **Forgehall of Oruth** to decide whether to take Vane's coin.
   **Oruth the Forgemaster** (canon) wakes in the heat, the empire's bound forgemaster and the clans' own ancestor,
   and goes back to work as ordered. The moot ends in a fight, with Oruth on the wrong side of it.
5. ★ *Furnace Nine* (26–28). The Cinderworks' last furnace. Vane has fed it miners at the Cult's rate: *"eleven
   more souls per week"* (canon). Vane falls.
6. ★ *The Cast* (28–30). The **Magma Vault**.
   - The furnaces were casting a **vessel**: a lamp the size of a cart, with room inside for a flame.
   - The furnace-priests have it on a dray, going north-east by the Solmere road.
   - **The loss:** you reach the Vault a day late.
   - **The trace:** in Solmere an Exchange customs stub reads *"One lamp, large. Duty paid."*

**Sites.**

| Site | Levels | Its room to remember |
|---|---|---|
| **The Cold Seam** | 12–17 | a played-out Deepdelver mine: *the Tally Wall*, a hundred years of shift-marks scratched in the rock |
| **The Slag Tunnels** | 15–19 | *the Shift-Bell*, which still rings for a shift nobody works |
| **The Assay Yards** (Kell's Rest) | 18–22 | *the Counting House*: Vane's clerks, Vane's ledgers, and a strongroom of coal-red wax |
| **The Cinderworks** | 20–25 | one floor per furnace, hotter each floor |
| **The Forgehall of Oruth** | 23–27 | *the Anvil of the Charter*, where the clans swear |
| **The Magma Vault** | 26–30 | under Furnace Nine |
| **The Ninth Vault** (hidden: the Reach set) | 30 | the imperial quota office's strongroom (canon loot: *of the Ninth Vault*) |

**Rumours.**
- "The Assay pays double for the night shift." (True. Nobody asks why.)
- "Oruth's hammer still rings in the Forgehall." (True, once the forges are lit.)
- "The Slagborn sold their own grandmothers to the Assay." (False: they sold the lease. The grandmothers come up in
  the Tithewood.)

**People.**
- **Charter-Reeve Dagny Coalbrook:** a Deepdelver, head of the moot. Short-tempered, honest, broke. She gives the
  chapters.
- **Tamsin Coalbrook:** her niece, a mage-smith, and the Reach's found companion (mage). She wants her cousins back
  from the night shift.
- **Morrow Vane:** the Assay's factor, and the act's villain. He's never cruel and never in a hurry. He believes
  every soul has a price, and pays it.
- **Gunnar Slagg:** headman of the Slagborn, who sold the lease. He's ashamed of it, and drinks.
- **Hob:** an Ashgate fixer who knows which shift is short.

**Enemies.**
- Canon: forge-wights, cinder hounds, Ashbound warriors, Cult furnace-priests.
- New, at most two new silhouettes (§6):
  - **Assay guards**: recoloured humans in Kell livery;
  - **Slagborn renegades**: recoloured Deepdelvers;
  - **slag haulers**: a new silhouette.
- **Bosses:**
  - the Foreman (existing: Skarn's adds, called up by the Shift-Bell);
  - **Oruth** (new: molten seams on the floor; uses the ground-hazard system, §8);
  - **Morrow Vane** (existing: the Stranger's raise; he buys a fallen guard back every 20 s).
- **Region boss:** **Furnace Nine** (canon).

**Chronicle: the Reach set.** Canon: *"Furnace nine requires eleven more souls per week to meet quota."* The last
fragment: *"The charter is renewed for another hundred years. The Deepdelvers did not ask what the furnaces burn.
We did not tell them."*

### 3.3 The Tidemark: levels 30–45 · Act IV · *The Seventh Solmere*

**What it is.** The east coast: the **Tidemark League** of free ports, and inland the walled kingdom of
**Highmarch**, once the empire's eastern march.
- **Hub: Tollhaven**, the League's largest port, where even the harbour chain takes a toll.
- Towns: **Brine Cross** (a bridge-town on the Highmarch road) and **Gullwick**.

**Act IV, *The Seventh Solmere*.** A war, between reasonable-sounding people.
1. ★ *Letters of Marque* (30–33). The Gull Fleet's corsairs raid League shipping under Highmarch commissions. The
   **Lamp Fort**, Old Gannet's coast light, is the first place they hit.
2. ★ *The Admiral's Ledger* (33–35). In the Gull Isles, **Admiral Hesk**'s books show who pays: Highmarch.
3. ★ *The Claim* (35–38).
   - **Lucan Varro of Highmarch** signs himself **Lucanus Solmere, the Seventh** (his mother called him Luke). He
     means to march on the capital and be crowned in it.
   - Is he Solmere blood? He is: the Empress's sister fled east on the flagship *Aurelle's Grace* the night of the
     Fall, and her line is in Highmarch.
   - So is half the Tidemark's minor nobility. She had eleven children. Lucan isn't special. He's the one who
     wants it.
4. ★ *The Road West* (38–41). Lucan's legion marches: living soldiers drilled to the old manuals, with hired
   Redhand crossbows (canon: the Redhand "recurring later as hirelings"). You raid its camps on the Highmarch road.
5. ★ *Brine Cross* (41–43). The bridge-town that blocks his road, held room by room. The League holds, and so do
   you.
6. ★ *The Seventh's Palace* (43–45). You storm Highmarch. Lucan is beaten, not killed.
   - In his study are letters from **the Kindler**, who has dined at Lucan's table all year.
   - What the Kindler offered: a relit Ember, and with it the bound legions of every province obeying a Solmere
     voice.
   - Lucan wanted the empire, not its kitchen fire, and refused. Beaten, he sees that the furnace is the only road
     to the empire he wanted. *"I wanted the empire, not its kitchen fire. It seems they were the same room."*
   - He walks north to the Heights himself. The Cult never takes him.
   - **The win:** the war ends and the League stands.
   - **The cost:** a Solmere voice is on the Pilgrims' Stair.
   - (The Kindler learned the blood was common from the genealogies you saved. Sister Maren, who read them first,
     knows her own name is in them.)

**Sites.**

| Site | Levels | Its room to remember |
|---|---|---|
| **The Lamp Fort** | 27–32 | *the Lamp-Room*, the last lit lamp on the coast, defended |
| **The Gull Isles** | 30–34 | *the Prize Hall*: a fort's great hall stacked with League cargo |
| **The Drowned Mole** | 33–37 | the sunken imperial harbour. *The Chain-House*: the harbour chain, and the officer who closes it |
| **The Highmarch Road** | 37–41 | the legion's camps, a tent at a time |
| **Brine Cross** | 40–43 | the siege |
| **The Seventh's Palace** | 42–45 | *the Long Gallery*: three hundred years of Solmere portraits, all of them bought |
| **The Sister's Cabin** (hidden: the Tidemark set) | 45 | the wreck of *Aurelle's Grace* |

**Rumours.**
- "Lucan's mother was a fishwife." (False. His mother was a Varro, and she'd want that known.)
- "The Gull Fleet's admiral has a commission from a king." (True.)
- "There's a ship off the Mole that never comes in." (True: the Grace.)

**People.**
- **Hester Quaile:** Speaker of the League, harbourmistress of Tollhaven. She counts everything twice and gives the
  chapters.
- **Sister Maren:** a Grey Sister, chaplain on Tollhaven's quays, and the Tidemark's found companion (cleric). She
  read the genealogies first and wishes she hadn't.
- **Old Gannet:** keeper of the Lamp Fort and the Guild's oldest member. He keeps the light because nobody told him
  to stop.
- **Lucan Varro, "Lucanus the Seventh":** handsome, educated and sincere. A tragedy who thinks he's a history.
- **Admiral Grell Hesk:** a corsair with a commission, and proud of it.
- **The Kindler:** at Lucan's table, the third time you meet him.

**Enemies.**
- **Highmarch legionaries** (the Seventh's Own): recoloured humans with a shield wall (new: *formation*, a front
  rank that halves damage from the front).
- **Redhand crossbowmen** (canon art, hired).
- **Gull Fleet corsairs**: boarders and harpooners, recoloured.
- **War-hounds** (the shared quadruped, §6).
- **Siege engineers**, who build a ballista mid-fight if they're let (new: a structure that's a target).
- **Drowned sailors**: Ashbound of the imperial fleet, recoloured.
- **Bosses:**
  - **Admiral Hesk** (new: harpoons pull a member out of the formation);
  - the Mole's **Harbourmaster** (existing: "break the chain that shields him");
  - the Seventh's Champion (existing);
  - **Lucan** (existing: his guard must fall before he can be reached).
- **Region boss:** **The Grace**, the flagship's bound crew, holding station off the Mole "until recalled". It's the
  Tidemark's mirror of the Third Legion, and comes in on a spring tide.

**Chronicle: the Tidemark set.** Letters from the Empress to her sister, from girlhood to the year before the
Fall. They build to the reveal without giving it away.
- *"Father says the flame knows our voices, the way a dog knows its master's step."*
- *"You are to marry a march-lord and live by the sea. I envy you the sea."*
- The last fragment: *"Take the Grace. Take the children. Don't ask me why, and don't come back."*

### 3.4 The Tithewood: levels 45–60 · Act V · *The Unpaid*

**What it is.** The great wood and the hill-clans of the south-east, which the empire conquered and **tithed**, in
grain and in souls.
- The Vale paid its share, as canon's Tithe Ledger has it: *"Souls, two hundred and forty."* That's the Third
  Legion's muster of two hundred and forty bound. The Vale's tithe became its legion.
- The clans' tithe never became anything. The empire took them alive, bound them, and laid them in **tithe-
  granaries**, barns under the oaks, in rows like sheaves, with a reeve and a ledger, to wait for the carts to the
  Throne.
- On the night of the Fall the bound dropped where they lay, and no carts came.
- The clans sealed the barns because they couldn't bear to open them. They call what's inside their grandparents.
- **The hedge-callers** (canon §4) learned their trade here first. This is the old country of the cup by the
  hearth.
- **Hub: Rookstead**, a clan steading inside a ring of standing stones. Landmarks: **Hollin Ford**, and the **Tithe
  Road**, the imperial road ruled straight through the oaks and now half swallowed.

**Act V, *The Unpaid*.** Folk horror, quiet and unkind.
1. ★ *Arrears* (45–48). Since the forges were relit, the bound in the barns have stirred, and so has their reeve.
   The **Tithe-Reeve** is the empire's collector, bound to his ledger. He's collecting again, and the clans are
   three hundred years in arrears. He takes the living to make up the count.
2. ★ *Charcoal and Coin* (48–50). In the charcoal burners' clearing, a clan that's short of grain has been selling
   its grandparents to the Cult, a cart at a time. The Cult doesn't steal here. It buys.
3. ★ *The Moot of Antlers* (50–53). At the stones, the clans, the hedge-callers and the wood's own wardens decide
   what to do. The clans want the barns opened and their dead let go.
4. ★ *The Tally* (53–55). The **Tally-House**, where the empire kept the count: its tallymen, Ashbound clerks in
   chains. The Reeve has counted the Cult's buyers as *arrears* and collected them, with their carts.
5. ★ *The Thornway* (55–57). The Tithe Road through the deep wood, and the wardens who won't let it be used again.
6. ★ *Paid in Full* (57–60). The **Root Granary** under the oldest oak: the Reeve, the count, and the Unpaid.
   - You open the granary, the bound lie down, and the clans bury their grandparents.
   - **Mostly a win.** The carts the clan sold are already gone, and they're the only fuel the Cult has: enough to
     light a flame, not to keep it.

**Sites.**

| Site | Levels | Its room to remember |
|---|---|---|
| **Hollin Ford Barn** | 42–47 | *the Threshing Floor*, laid with sheaves that aren't grain |
| **The Charcoal Clearing** | 45–49 | *the Cart Yard*, and the Cult's buyers' tally |
| **The Antler Stones** | 48–52 | the moot, and the wardens' trial ground |
| **The Tally-House** | 51–55 | *the Abacus Floor*: the count kept in stone beads the size of fists, still moving |
| **The Thornway** | 54–57 | the road the wood is taking back |
| **The Root Granary** | 56–60 | under the oldest oak |
| **The First Barn** (hidden: the Tithewood set) | 60 | where the first tithe was taken, and a hedge-caller's grave |

**Rumours.**
- "The barns are full of gold the empire left." (False. They're full of grandparents.)
- "The Reeve can't count past what's in his ledger." (True, and it matters.)
- "There's an elf at the stones who's older than the barns." (True.)

**People.**
- **Grandmother Yew:** the eldest hedge-caller of Rookstead, who gives the chapters. If Col taught the company, she
  calls the player "the carter's friend".
- **Moth:** a hedge-caller's boy, small and serious, and the Tithewood's found companion (shaman). His great-great-
  grandmother is in the Root Granary.
- **Thane Ivo of the Antlers:** the clans' war-leader. He'd burn the Tally-House with the tallymen in it.
- **Lirien:** an elf, and as canon has it, passing through. She comes every seventy years to see whether the barns
  are open yet, because she'd like to see the empire put one thing right. She teaches nothing until the doors come
  down.
- **The Tithe-Reeve:** the empire's collector, bound to his ledger.

**Enemies.**
- **Tallymen**: Ashbound clerks, a recolour with chains and ledgers. They mark a target, and the marked member takes
  more.
- **Barn-wights**: the stirred tithe, rising off the threshing floors (the ghost look, §6).
- Cult **buyers** and their carters, recoloured.
- **Thorn-wardens**: the wood's own (one new silhouette).
- **Wolves** and **boars** (the shared quadruped).
- **Bosses:**
  - the Reeve's Clerk (existing: marks);
  - **the Green Warden** (new: roots that hold a member in place);
  - the Tally (existing: adds, a clerk per bead);
  - **the Tithe-Reeve** (existing: "break what shields him": each soul he's collected is a shield, and each cage you
    open strips one).
- **Region boss:** **The Unpaid**, the granary's host as one. It's beaten, not killed: it lies down.

**Chronicle: the Tithewood set.** The tithe from the clans' side: tally-sticks, a reeve's diary, hedge-callers'
charms. The last fragment, cut into a tally-stick: *"Hide the little ones in the hay. The carts take what is
counted."*

### 3.5 The Pale Heights and the Ember Throne: levels 60–75 · Act VI · *The Throne of Embers*

**What it is.** As canon §3.4–3.5 has it, its levels moved: the frozen passes round the crater where the Ember was
found, and the flame's palace in it.
- **Hub: Frosthold**, the monastery turned fortress.

**Act VI, *The Throne of Embers*.**
1. ★ *The Frozen Hospice* (60–62). The pilgrims' hospice at the foot of the Stair, and the Cult's camp around it.
   The vessel's dray is in the yard. Lucan isn't.
2. ★ *The Pilgrims' Stair* (62–65). Up the Stair after him, with the Cult on it.
3. ★ *The Soulcracks* (65–68). The canyon the Fall split open. What the Ember burned is down there, as light in the
   rock.
4. ★ *The Praetory* (68–71). The Empress's bound guard, still at their posts in the palace barracks.
5. ★ *The Glass Keep* (71–73). **The Glass Legate** (canon) guards Aurelle's last letter. The reveal is canon:
   *"Forgive me. They will call it the Fall. Let them. — A."* With it comes the line the Tidemark letters only
   hinted at: *"It knows our voice. It will hear one last order, and then no more. — A."*
6. ★ *The Throne of Embers* (73–75). In the Throne, the Kindler sets the vessel in the dark pit with the spark in
   it, and Lucan standing by.
   - **The fight is in phases.** The fuel is too little, so between phases the Cult's faithful walk into the
     vessel, one rank at a time, and the flame grows.
   - Beaten, the Kindler walks in last: *"Most of them volunteered."*
   - **The choice is canon's, and the player's.**
     - Whose voice: Lucan's, or **Sister Maren**'s, if she's in the company (her name is in the genealogies).
     - What it says: *stop*, as Aurelle said, the good ending; or *burn*, which keeps the flame, gives the darker
       ending and opens the post-game Undervaults (canon).

**Sites.**

| Site | Levels |
|---|---|
| the Frozen Hospice | 57–62 |
| the Pilgrims' Stair | 60–65 |
| the Soulcracks | 64–68 |
| the Praetory | 67–71 |
| the Glass Keep (canon) | 70–73 |
| the Lip (the crater's rim: the First Pilgrim, canon region boss) | 72–75 |
| the Ember Throne | 73–75 |

**Rumours.**
- "The Glass Keep has no door." (True: you go in through the Soulcracks.)
- "The monks of Frosthold were pilgrims who never went home." (True.)
- "The flame was never lit at all." (False, and the Cult hangs men for saying it.)

**People.**
- **Prior Anselm of Frosthold:** gives the chapters, and has buried more pilgrims than he's fed.
- **Sister Hild:** Frosthold's infirmarian, who teaches the cleric's last skill.
- **Brother Cobb:** a monk who was a Praetorian's grandson and keeps the barracks' keys.
- **The Glass Legate.**
- **Lucan.**
- **The Kindler.**
- **The First Pilgrim.**

**Enemies.**
- Canon: Ashbound mages and elite legions, frost revenants, the Cult's inner circle.
- **Praetorians**: the Empress's bound guard, recoloured elites.
- **The glass-touched**: pilgrims fused with the crater's glass (a new look, the one new silhouette here).
- **Snow-wolves**: the shared quadruped.

**Chronicle: the Heights set** (canon's Glass Keep fragments), ending with Aurelle's.

---

## 4. Solmere, the dead capital (from 15): the Bowl and the Great Beacon

**What it is.** The empire's capital on the Mere, where the court sat, the treasury counted and the clerks wrote the
orders the Throne's flame carried out. It was built for half a million people. About twenty thousand live there now,
in the best of the ruins.
- Every successor state wants it, so none can have it. **The Dim Peace**, signed in the 41st year of the Dim out of
  exhaustion, says no crown may hold Solmere.
- It's kept, in name, by **the Peace Wardens**. In fact it's kept by **the Lantern Guild**, whose mother-house, **the
  Lamphall**, stands at the foot of the Great Beacon.
- **It's in disrepair, honestly:**
  - whole quarters are empty;
  - the aqueduct runs into a street;
  - the Solmeres' town palace is a tenement with very good ceilings;
  - the Grand Archive is half burned and half lived in;
  - the **Exchange** is shut: *the sign says* Reopening. *It has said so for two hundred and sixty years.*

**The beacons, and the Guild's guilty history.**
- The flame was in the Heights, and the orders came from Solmere. A chain of beacon-towers carried them by
  beacon-light, from the Great Beacon to every province's bound.
- The empire's **beacon-keepers** lit them. The Lantern Guild is what's left of the keepers, and its ranks are
  their lamps: **Wick, Lamp, Lantern, Beacon**.
- On the night of the Fall the lamps went dark, so no *stand down* could reach anyone. That's why the Last Dispatch
  was never sent, and why a gate-warden wrote *"Keep the lamps lit."*
- The Guild keeps the roads now. It doesn't talk about why.

**What's here** (a social hub: the "large city where players gather" from GDD §1, pillar 7):
- **The Lamphall.** The Guild's mother-house: the company's arrival (Maudry's letter), a city-wide board, and the
  square where companies meet. The Master of the Roll is **Aldo Pennick**.
- **The Bowl** (below), and **the Great Beacon** (below).
- **The embassy quarters**: the Charter's, Highmarch's, the League's and the clans'. Each opens with that region's
  renown, and each has its own errands.
- **The Grey Sisters' Hospice**: the temple.
- **Solmere's own trouble** (side quests only, never a main story, pillar 5):
  - the aqueduct, which the Charter and Highmarch both bid to repair, for the water rights;
  - the gangs in the empty quarters;
  - a Highmarch envoy recruiting;
  - the Archive's lost wing;
  - the customs stub for a large lamp.

### 4.1 The Bowl: the arena

**What it is.** The imperial *Circus of the Sun*, where bound dead fought for crowds. Half its tiers have fallen in,
and the other half are full every feast-day. It's run by **Ma Gorrie**, who takes the bets, and **the Crier**, an
Ashbound herald who still calls the bouts. *"He called my grandmother's bouts. Calls them better than I do. Leave
him be."*

**How it plays.** As canon plans (GDD §12; dev plan M10/M12): **async party against party first, live later.**
- **A bout:** your company (hero and two) against another player's company, as it stood at their last verified
  sync, run in the same sim. It's replayed and validated like everything else that's shared.
- **Fair matches:**
  - the server picks opponents;
  - one attempt per pairing per day, so a bout can't be re-rolled with a different stance;
  - your own account's companies are never in your pool;
  - levels are evened within a **bracket** (15–29, 30–44, 45–59, 60–75): both sides fight at the bracket's top.
- **Arena coefficients:** crowd control lasts half as long against companies (*Rite of Truce*, *Drowned Whisper*).
- **Offline, the Bowl still has a ladder:** **written rival companies**, each with a name and a manner, and a
  tavern table you can see them at. For example: *the Widow Brack's Three*; *the Coalbrook Boys*; *Hesk's
  Cousins*.
- **Rewards: standing only.** Titles, the season's banner over the company's tavern table, Bowl tabards and
  colours. No gear with stats, so power is never behind PvP (dev plan §2.12, pillar 8).
- **Later (M12):** live 1v1 and 3v3, and the Heroic raids gathering in the Lamphall.

### 4.2 The Great Beacon: the dark tower

**What it is.** The tower that sent the Throne's orders to the provinces. It has been dark for three hundred years,
but it isn't empty.
- Its garrison was the empire's **signal corps**, bound and quartered landing by landing, under one order: *muster
  at the lamp*.
- Every night they climb the stair to the lamp-room, as ordered, and every morning they're back on their landings.
- The Guild holds the door. For a fee and a signature it lets a company **climb the Beacon**: wave after wave of
  the corps on the stair, as long as it can hold.
- The Roll counts the waves held, not the steps. *The Guild stopped arguing about the arithmetic.*

**The rules** (the owner's, made to hold up):
- **No XP.** The Beacon teaches nothing. Outside XP, it can never be the place to level, and the regions stay the
  way to grow.
- **It pays.** Gold and cinders each wave, rising with the wave (pillar 3: waves pay for their danger), within the
  economy's budget. Its loot is below.
- **The climb.**
  - Each wave is harder than the last: **+6 % a wave, compounding**, from a table (deterministic, like
    `XP_TABLE`).
  - A new kind of foe joins at every tenth: the corps first, then every province's dead, then worse.
  - It starts at the company's level, and a run ends when you leave or are beaten.
  - **Landings, every tenth wave:** leave there and you keep everything. If you're beaten, you keep what you'd won
    up to the last landing.
- **The Roll** (the leaderboard).
  - It counts the **highest wave held in a live, verified climb**, per bracket and per season.
  - **The flame clock:** a climb has a time limit, like the Rifts', so the Roll measures holding power, not hours.
  - Going offline in the tower counts as stepping out at the last landing. Offline time can't climb the Roll, and
    premium windows can't buy standing (pillar 8).
  - Each season's waves are seeded **per season**, the same for everyone.
  - The Roll is written only by the replay validator (AGENTS.md, architecture §10).
- **Before the validator exists** (M6), the Beacon still plays: waves 1–30 as an offline site, with no Roll.

**The lampwardens.** A warden holds every tenth landing. The **first time a hero's company beats one, in a bracket,
it drops that warden's heirloom**:
- at the bracket's top item level;
- for a class in the party (Rare and above always fits the party, GDD §8);
- once per game slot, per bracket.

After that a warden drops ordinary Beacon loot. Each warden is tagged with the mechanic it reuses or the one thing it
adds.

| Wave | Warden | Mechanic | First kill (one of, for the party's classes) |
|---|---|---|---|
| 10 | **The Doorward** | new: *front*, half damage from the front (the Seventh's Own's formation) | *The Doorward's Latch* (shield) · *Doorward's Bar* (staff) |
| 20 | **The Oilwright** | the ground-hazard system (§8): burning oil, which the party steps out of | *Oilwright's Apron* (armour, any class) |
| 30 | **The Bellringer** | existing: adds, a rank of the corps on each bell | *The Ringing Iron* (mace) · *Bell-Rope* (belt) |
| 40 | **The Lensman** | new: *reflect*, one spell in four comes back at its caster (the autocast learns to hold) | *The Lensman's Glass* (off-hand) |
| 50 | **The Keeper of Wicks** | new: *snuff*, one buff gone every 2 s | *Snuffer* (dagger) · *Wick-Trimmer* (sword) |
| 60 | **The Twin Lamps** | new: *pair*, kill them within 5 s of each other or the other relights (the party hits the healthier twin) | *The Pair* (rings) |
| 70 | **The Beacon Hound** | existing: hunts the lowest-HP member (the shared quadruped) | *Houndsmaster's Lead* (bow) · *Collar of the Hound* (amulet) |
| 80 | **The Signalman** | existing: adds, pouring in until he falls | *Signal Horn* (amulet) |
| 90 | **The Last Keeper** | existing: enrage, his order to keep the lamp lit and nothing else | *Keeper's Oath* (helm) |
| 100 | **The Lamp-Room** | the room itself: the dark lamp burns whoever stands nearest (ground hazard) | *Lampblack* (cloak; a dark shimmer on the figure) |

Past wave 100 the wardens come round again, harder, with nothing new to drop. That's for the Roll.

**Beacon loot.**
- Between wardens the tower drops **beacon-lit** pieces: the canon *Kindled* affix pool (world doc §10.1) with the
  tower's name on it (*"Still warm. Nobody knows from what."*) and a faint pale glow on the figure.
- They replace a room's Fine roll inside the loot budget (dev plan §2.7); they don't add to it.
- A beacon-lit piece is no stronger than a Rare.

---

## 5. New skills

**What exists:** each class has abilities at levels 1, 6 and 12, taught by Thornwick's trials (the 12s by level until
M8), and a passive at 20 (GDD §5). The pillar is *skills are earned*: each one unlocks at a level and is learned from a
trial, with a named teacher and a quest.

**This proposal:**
- **One new active per class per region**, about three levels into the band: **18, 33, 48, 63**.
- **At the trial the company chooses between two.** "Many ways to play" comes from the choice, not the count.
- **A second passive at 40.** It changes how the class plays, and never touches gold.
- **The loadout.** From the fifth active (level 33) a member carries **four** into a fight (Skills tab); the rest
  wait in the book.
- **A free skill-point respec** at any temple, so points never sit stranded in benched skills.
- **The rules for every skill:**
  - it states its **autocast test** (when the AI casts it);
  - it reuses an existing effect or adds one at most;
  - one "can't drop below 1 HP" effect exists in the game (the cleric's *Lifeline*), and no skill adds another.

Each cell below gives two options: the first and the second.

| Class | The Reach (L18) · teacher | The Tidemark (L33) · teacher | The Tithewood (L48) · teacher | The Heights (L63) · teacher |
|---|---|---|---|---|
| **Fighter** | **Anvil Stance** (6 s: melee on you takes 20 % back; *test:* 2+ melee foes on you) / **Shoulder Charge** (knock the nearest caster down 1 s; *test:* a caster within 4 tiles) · *Dagny Coalbrook* | **Hold the Bridge** (the party behind you takes 25 % less for 6 s; *test:* 3+ foes in front) / **Boarding Rush** (charge the farthest foe; *test:* an archer out of reach) · *Hester's sergeant, Brine Cross* | **Thornhide** (5 s: whoever hits you bleeds; *test:* 3+ on you) / **Taunt the Wood** (pull every foe in 4 tiles onto you; *test:* an ally below 40 %) · *Thane Ivo* | **Hold Fast** (8 s: the party +40 % DEF, but slowed; *test:* the party below 50 % on average) / **Praetor's Cut** (2.4× through the front rank; *test:* a formation) · *Brother Cobb* |
| **Rogue** | **Slag Pot** (a burning patch, the ground-hazard system; *test:* 3+ clustered) / **Cut the Strap** (−30 % DEF 6 s on an elite; *test:* an elite or boss) · *Hob* | **Mark for the Fleet** (the party's crits on the mark +20 %; *test:* the focus target) / **Harpoon** (pull a caster to you; *test:* a caster out of reach) · *Old Gannet* | **Fade into the Thorn** (drop aggro; reappear behind the farthest caster; *test:* below 40 % HP) / **Twice-Bitten** (Venom spreads on a kill; *test:* 3+ foes) · *Lirien* | **Glasswalk** (blink through a foe, the next strike crits; *test:* a foe below 30 %) / **Lampblack** (2 s: foes in 3 tiles miss; *test:* 3+ on you) · *the Prior's lay brother* |
| **Mage** | **Slagstorm** (a growing burning field; *test:* 4+ clustered) / **Quench** (freeze one foe solid 3 s; *test:* an elite on an ally) · *Tamsin Coalbrook* | **Storm-glass** (a bolt that jumps to 3 more; *test:* 3+ foes) / **Undertow** (pull a knot together; *test:* 3+ spread within 5 tiles) · *Hester's harbour mage, Mistress Fane* | **Wildfire** (fire that spreads foe to foe; *test:* 3+ foes in contact) / **Rimebark** (a ward that slows whoever strikes it; *test:* an ally under melee) · *Grandmother Yew, reluctantly* | **Last Light** (3.5×, costs half your MP; *test:* a boss below 40 %) / **Glass Prism** (split a firebolt into 3; *test:* 3+ foes) · *Prior Anselm* |
| **Cleric** | **Hallowed Ground** (a circle that mends allies in it; *test:* 2+ allies hurt and close) / **Censure** (an elite deals −25 % for 6 s; *test:* an elite on an ally) · *Ashgate's shrine-keeper, Old Brannagh* | **Rite of Truce** (living foes in a room stand still 3 s; *test:* 4+ living foes; arena: 1.5 s) / **Ward of the Quay** (absorb 25 % of max HP on the party; *test:* the party below 70 %) · *Sister Maren* | **Unbinding** (2× to the bound and the Unpaid, a mend for each hit; *test:* 2+ bound foes) / **Last Rites Remembered** (the slain rise faster at a shrine; *passive-like, always on*) · *Grandmother Yew* (*"Your Sisters bound them. You can learn to let go."*) | **Requiem** (a party heal, and one downed ally stands; *test:* an ally downed) / **Vigil** (MP to the party over 8 s; *test:* the party's MP below 30 %) · *Sister Hild* |
| **Shaman** | **Ash Totem** (drains every foe near it; *test:* 3+ within 3 tiles) / **Ember Breath** (Spirit Drain stacks twice as fast for 6 s; *test:* a boss) · *the Slagborn's wise-woman, Mother Coke* | **Drowned Whisper** (a knot turns on itself 2 s; *test:* 3+ clustered; arena: 1 s) / **Tide-Song** (the party's regen doubled 8 s; *test:* a long fight, 60 s+) · *Old Gannet* | **Call the Unpaid** (three spirits fight 10 s; *test:* 3+ foes) / **Rootbind** (hold one foe 3 s; *test:* a foe on the healer) · *Grandmother Yew* | **Breath of the Heights** (the party's MP back; *test:* the party's MP below 30 %) / **First Pilgrim's Charm** (Hex lasts until the target dies; *test:* a boss) · *the First Pilgrim's grave-keeper* |

**The passives at 40** (from the region's trial-giver):
- **Fighter, *Old Soldier*:** the front rank: +10 % DEF for each ally behind you.
- **Rogue, *Wolf's Patience*:** crits from range don't draw aggro.
- **Mage, *Bright Mind*:** a crit refunds the spell's MP.
- **Cleric, *Psalter*:** heals also clear a slow.
- **Shaman, *Hedge Lore*:** a hexed foe that dies passes the hex on.

**The Healer** (canon's future class) is **deferred.** With the shaman shipped and *Hallowed Ground* and *Requiem*
here, a third healer has no job yet. If it comes back, it gets its own row and its own job: cleanses and wards.

---

## 6. Enemies and art

**At most two new silhouettes a region.** Everything else is a recolour of what the bake already has: the KayKit
adventurers, the skeletons and the goblins.

| Region | New silhouettes | Recolours and reuse |
|---|---|---|
| Emberfall (Fens) | fen ghoul, bog-witch | Cult harvesters (acolytes), reed-cutters (Redhand), drowned clergy (Ashbound) |
| The Reach | slag hauler, forge-wight | Assay guards, Slagborn (humans), furnace-priests (Cult), cinder hounds (the quadruped) |
| The Tidemark | (none: all human) | legionaries, corsairs, engineers (humans), drowned sailors (Ashbound), war-hounds (the quadruped) |
| The Tithewood | thorn-warden | tallymen (Ashbound), barn-wights and the Unpaid (the ghost look the Fallen already have), wolves and boars (the quadruped) |
| The Heights | glass-touched | Praetorians (Ashbound elites), frost revenants (Ashbound recolour), snow-wolves (the quadruped) |
| The Beacon | (none) | the signal corps (Ashbound), every region's mix |

**One quadruped rig** carries every hound, wolf and boar, and the Beacon Hound. It's the one new rig in this
proposal.

---

## 7. How it hangs together

**One question, five answers.** The Fall left the provinces its debts, and each region pays one.

| Region | What the Fall left | Who wants it | What it shows the player | How it ends |
|---|---|---|---|---|
| Emberfall | the dead, still under orders | nobody: they just stand there | **the spark**: the Cult is mining the dead | a win, with a cost found later (the copied genealogies) |
| The Reach | the forges, still needing fuel | the Kell Assay, for profit | **the vessel** | a loss: a day late |
| The Tidemark | the throne, still empty | Lucan, for a crown | **the voice**: anyone of the blood | a win, and a man who walks north on his own |
| The Tithewood | the tithe, still uncollected | the Reeve, for the count | **the fuel**: bought, not stolen | mostly a win: too little fuel got out |
| The Heights | the flame | the Kindler, for faith | it all comes together | the choice |

**The Chronicle builds the reveal across the map:**
- **the Vale:** the dead were tithed;
- **the Fens:** the Sisters' mothers bound them;
- **the Reach:** the forges burned them;
- **the Tidemark:** the flame knew the Empress's voice;
- **the Tithewood:** the tithe was *counted*;
- **the Heights:** she told it to stop.

The Chronicle grows from about 45 fragments to about **60**: ten per region and set.

**Nobody is a chosen one** (world doc §9).
- The blood is common: half the Tidemark has a drop of it. The ones who matter are the ones who want it (Lucan) and
  the one who's afraid of it (Maren).
- The player is a company of sellswords with good boots.

**The callbacks are planned:**
- the coal-red wax: the Paymaster's Box, then the Abbey, then the Assay;
- the genealogies: the Abbey, then Reedholm's copy, then the Kindler, then Maren;
- Col's grandmother, and Grandmother Yew;
- "until relieved": the Third Legion, then the Grace, and nothing else, so the phrase keeps its weight;
- "most of them volunteered": the Sunken Chapel, then the Throne;
- the dark lamps: the Gate-Warden's note, then the Great Beacon, then the Guild's ranks.

---

## 8. Numbers and phasing

**The cap is 75: five bands of 15.** The game designer's estimates, from `XP_TABLE` ×3 and the measured L6 trio, are
hours of pure fighting; real play is about 2–3× that.

| Band | Fighting hours | Sites | Chapters |
|---|---|---|---|
| Emberfall 1–15 | ~2.5 | 6 shipped + 5 | 8 (Acts I–II) |
| The Reach 15–30 | ~5.4 | 6 + hidden | 6 |
| The Tidemark 30–45 | ~6.5 | 6 + hidden | 6 |
| The Tithewood 45–60 | ~6.5 | 6 + hidden | 6 |
| The Heights 60–75 | ~6.5 | 7 | 6 |

**The prerequisites, before any band past 30:**
- **The XP a level goes linear above 30**, about 26 minutes of fighting a level, so the late bands don't swell.
- **Stats compound, from tables.** Today enemy stats grow linearly (×(1 + 0.14 (L − 1))), so above 30 one level
  stops mattering: a room three up is +41 % HP at L6, but +15 % at L30 and +9 % at L60. The fix:
  - foes, classes and items move to a **compounding integer table** (deterministic, like `XP_TABLE`);
  - the room premium is capped;
  - the smoke contract (GDD §7.1) extends to levels 15, 30, 45, 60 and 75.
- **One ground-hazard system**, with the party's AI stepping out of it. Slag Pot, Slagstorm, the Oilwright, Oruth,
  the Lamp-Room and the Abbess's water all use it.
- **The tables are seeded where they must be.** Each region's minor sites fill out between its six main ones, as
  GDD §10 already allows.

**Phasing** (the dev plan's milestones):

| Milestone | What |
|---|---|
| **M8** | **the Fens** to 15 (Act II), and Saltmere; **a Solmere shell**: the Lamphall, and the Beacon's waves 1–30 as an offline site, with no Roll. A capped player has an endgame loop before new regions come. |
| **M9** | **the Reach** (Act III); the stat rescale; the first skill tier (L18); the cap to 30 |
| **After M6's validator** | the Beacon's Roll and seasons |
| **M10** | **the Bowl**, async, with its written rivals |
| **M11–M14** | one region per milestone (the Tidemark, the Tithewood, the Heights and the Throne), raising the cap each time |

---

## 9. Canon and design changes this needs

**World doc** (a canon pass, before any content):
1. **The Old Provinces.** The empire was the island. Emberfall is its south-west province, the Vale and the Fens,
   and the empire's granary (§2 now says "mines and granaries"). The Reach, the Heights and the Throne are
   neighbouring lands (§3 now puts all four regions in one province).
2. **The tone rule** (§1): "the fate of the Old Provinces, never the world".
3. **Solmere and the Throne.** Solmere was the capital: the court, the treasury and the orders. The Throne was the
   flame's palace in the crater.
4. **The beacons.** The Throne's orders went out by beacon-light. The Lantern Guild is what's left of the
   beacon-keepers, and its ranks are their lamps. When the lamps went dark, no stand-down reached anyone.
5. **The voice.** Anyone binds *by* the Ember's light. The flame itself obeys the voice it was taught, the house
   of Solmere's, and the blood is common.
6. **The Grey Sisters** came out of the imperial binding clergy. The Drowned Abbey was theirs.
7. **The Vale's tithe became the Third Legion** (240 = 240). The clans' tithe lay in the granaries.
8. **The Cult's four needs** (spark, vessel, voice, fuel), and the faithful as the last fuel.
9. **Acts I–VI by region** (§6 now has four acts).
10. **Level bands:** the Reach 15–30, the Heights 60–75, the Throne at 73–75. New: the Tidemark 30–45, the
    Tithewood 45–60.
11. **New names.**
    - Places: the Old Provinces, the Mere, the Dim Peace, the Lamphall, the Bowl, the Great Beacon, the Tidemark,
      Tollhaven, Highmarch, Brine Cross, Gullwick, the Tithewood, Rookstead, Hollin Ford, the Tithe Road.
    - People: Lucan Varro, Hester Quaile, Sister Maren, Old Gannet, Admiral Grell Hesk, Dagny and Tamsin
      Coalbrook, Morrow Vane, Gunnar Slagg, Hob, Old Brannagh, Mother Coke, Grandmother Yew, Moth, Thane Ivo,
      Lirien, Prior Anselm, Sister Hild, Brother Cobb, Mother Agnes, Pim Rushlight, Brother Teague, Aldo Pennick,
      Ma Gorrie, the Crier.

**GDD:**
- the cap 30 → 75;
- XP linear above 30;
- compounding stat tables;
- the skill tiers, the loadout and the respec;
- one ground-hazard system;
- the Bowl and the Beacon rules;
- regions gated by the previous finale, with renown opening side content;
- Saltmere's hub, if the owner agrees.

**Dev plan:** §8's phasing, and the content budget, rescaled.

---

## 10. The critic passes

Two critics read draft 1 against the world doc, the GDD, the dev plan and AGENTS.md: a game designer and a D&D
writer. Here is what they found, and what draft 2 did about it.

### 10.1 The game designer

| # | Finding | Severity | What changed |
|---|---|---|---|
| 1 | Linear stat growth: above 30, one level stops mattering (+41 % HP for a room three up at L6, +9 % at L60) | High | compounding stat tables and a capped premium before any band past 30; the smoke contract at 15–75 (§8) |
| 2 | The bands get longer where content gets thinner (the Heights: 4 sites for 20 levels, ~14 h of fighting) | High | the cap is 75 and every band 15; XP linear above 30; 6+ sites and 6 chapters a band |
| 3 | The Beacon was easier than a normal room (+1 % a floor) and could be climbed offline, so premium bought standing | High | +6 % a wave, compounding; the Roll counts only live, verified, timed climbs; offline = step out at the landing; seeded per season (§4.2) |
| 4 | The tower's loot broke the rarity targets (every company gets an heirloom at 15) | High | first kills once per game slot per bracket, at the bracket's top level, for the party's classes; beacon-lit replaces the Fine roll; gold and cinders per wave |
| 5 | The Arena was a Rare vendor and an exploit target (re-rolls, alt feeding, CC) | High | standing only; server-picked opponents, one try a pairing a day, own account excluded, levels evened, arena CC halved, an offline ladder of written rivals (§4.1) |
| 6 | The scope was several M5s; new rigs for every beast | High | at most two new silhouettes a region; one quadruped rig; the ghost look for spirits; phased one region per milestone (§6, §8) |
| 7 | Too many skills, overlapping; three "can't die" effects; no autocast rules | Medium | one active per class per region, a choice of two; every skill states its autocast test; one 1-HP effect in the game (§5) |
| 8 | A dead gap from 12 to 25; the loadout didn't bite until 35; stranded points; gold passives | Medium | skills at 18/33/48/63; the loadout from the fifth active; a free temple respec; passives change play, none touch gold |
| 9 | The Healer row was empty and a third healer had no job | Medium | deferred (§5) |
| 10 | The gates contradicted each other (Guild rank vs the sellswords' ranks; Solmere opening on a promotion made in Solmere) | Medium | one gate: the previous finale; renown opens side content and embassies (§2) |
| 11 | Saltmere as a waystation broke GDD §10 and added dead travel | Medium | Saltmere stays a full hub; the owner's line read as Emberfall's story to 15 (§3.1, question 1) |
| 12 | Some boss mechanics were unreadable or contradicted the rules (room swaps, 20 snuffs a second, the Twin Lamps, the Unpaid skipping the front line) | Medium | each boss tagged with an existing mechanic or one new one; snuff every 2 s; a "hit the healthier twin" rule; the Unpaid fight in formation |
| 13 | The route was one line, and Solmere was empty offline | Medium | each region's first sites overlap the last band; the Bowl's written rivals |
| 14 | Three endless leaderboards and two affix pools | Low | the Beacon is the leaderboard, the Undervaults the after-cap dive; beacon-lit is the Kindled pool |
| 15 | Every region ended with the Cult escaping with its prize | Low | the endings vary (§7) |
| 16 | Some teachers were letters, places or bosses; `XP_TABLE` stops at 60 | Low | every trial has a named NPC; the table is extended in §8's prerequisites |

### 10.2 The D&D writer

| # | Finding | Severity | What changed |
|---|---|---|---|
| 1 | The scale broke "the empire's mines and granaries" and "the fate of the province" | High | Emberfall is the granary; "the fate of the Old Provinces, never the world" (§1, §9) |
| 2 | Two palaces: the Throne in the crater and the Solmeres' palace in Solmere; the Beacon carrying a light that was in the Heights | High | Solmere was the court; the Throne the flame's palace; the beacons carried **orders**, which explains the unsent Dispatch and "keep the lamps lit" (§4) |
| 3 | "The Ember answers only to Solmere blood" contradicted "whoever tends it can bind the dead", and came near a chosen one | High | anyone binds by its light; the flame obeys the voice it was taught (the Binding Rite: "the bound keep the last thing they hear"); the blood is common (§3.3, §9) |
| 4 | The Tidemark letters gave away the Glass Keep's reveal at level 45 | High | the letters only hint ("the flame knows our voices"); "one last order" moved to the Glass Keep |
| 5 | Every region ended "what the Cult took", four losses in a row; the Cult burning records it needed | High | varied endings; the Cult *steals* the genealogies, and the copy you save is the one the Kindler reads |
| 6 | The Kindler first met at level 41 | High | met at the Canal Locks (~10), the Ashgate burial (~19) and Lucan's table |
| 7 | The tithe logic didn't hold; the Tithewood repeated the Abbey's harvest | High | the Vale's 240 tithed became the Third Legion; the clans' bound lay in the granaries; the Cult *buys*; the Reeve collects the buyers as arrears |
| 8 | The act numbering broke; the vessel's route and how it crossed Solmere | Medium | Acts I–VI by region; the vessel goes north-east by the Solmere road; the customs stub |
| 9 | The Grey Sisters tangled (drowned, yet alive); the Abbess and the Choir the same boss; the Healer given to the wrong Sister | Medium | the binding clergy; the Abbess the story kill and the Choir her echo; the Healer deferred; Mother Agnes the one who'd keep the Undercroft shut |
| 10 | Lucan's syllable gag didn't work; "Ninth" was overloaded; his turn had no hook; the Empress's Cabin held letters *to* her sister | Medium | *Lucanus* ("his mother called him Luke"); *the Seventh*; the bound legions obey a Solmere voice; the Sister's Cabin |
| 11 | The finale took the choice from the player; the Kindler gave himself before he was beaten | Medium | the player chooses whose voice (Lucan's or Maren's) and what it says; the faithful walk in between phases, the Kindler last |
| 12 | The Beacon "drawing" the Ashbound contradicted what they are; 100 floors too grand | Medium | the signal corps, ordered to muster at the lamp; waves on the stair, not floors |
| 13 | "Until relieved" used three times | Medium | kept for the Third Legion and the Grace; ★ *The Last Office*; the fighter's *Hold Fast* |
| 14 | Name clashes (the Tallyman and the tallymen; the Glasswright and the Glass Legate; beacon-light three ways; the Kell Assay and Kell's Rest) | Medium | the Crier; the Lensman; *Lampblack*; the Assay's depot at Kell's Rest, which stays a landmark |
| 15 | Lirien a fixed warden, when canon's elves pass through | Low/Medium | she comes every seventy years to see if the barns are open, and teaches nothing until they are |
| 16 | No D&D texture: rumours, rooms, quarrels | Medium | three rumours a region (one false), a room to remember a site, the aqueduct quarrel in Solmere |
| 17 | "Trade later" winked at the player | Low | *"The sign says Reopening. It has said so for two hundred and sixty years."* |
| 18 | "It was for the fire" explained instead of being found; the Chronicle total | Low | *"Hide the little ones in the hay. The carts take what is counted."*; about 60 fragments |
| 19 | Saltmere's change needed canon first | Low | Saltmere stays a hub, so no change |

**What both critics said to keep:**
- the spine, and the Cult as a buyer rather than the local villain;
- Morrow Vane;
- Oruth going back to work as ordered;
- the Reeve taking the living to make up the count;
- Old Gannet keeping the light because nobody told him to stop;
- the Dim Peace;
- the palace "with very good ceilings";
- the herald nobody has the heart to put down;
- the Grace "until recalled";
- the Guild's ranks named for the beacons;
- the landing wager;
- a leaderboard written only by the validator;
- the arena async first;
- *"We kept the hours. The water kept us."*

---

## 11. Questions for the owner

1. **"Thornwick to 15."** Draft 2 reads it as Emberfall's story to 15, from Thornwick, with Saltmere a full town
   for the Fens. Or do you want Saltmere a waystation, so the whole band comes home to Thornwick?
2. **The cap of 75**, in five bands of 15? Your note allowed 15–20; 15 keeps every band to six sites and six
   chapters.
3. **The skill choice:** one new active per region, picked from two at the trial, and four carried from the fifth?
4. **The finale's voice:** the player chooses Lucan's or Maren's. Or should Lucan's be the only one, so Maren is
   never at risk?
5. **The Bowl's rewards:** standing only (titles, banners, tabards), as both critics recommend?
6. **The Beacon:** waves 1–30 offline at M8, before the Roll exists at M6's validator?
