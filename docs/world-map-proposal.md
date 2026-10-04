# The Old Provinces: a world beyond Emberfall

**Proposal, draft 1 (2026-10-04), awaiting the owner.** Nothing here is canon until the owner signs it off and it
lands in [emberfall-world.md](./emberfall-world.md) (canon first) and the [GDD](./emberfall-gdd.md) (design).

The owner (2026-10-04):

> "Outline a world map like middle earth illustration style based on our world lore. We are just a smaller region
> thats part of a bigger fallen empire thats on a continent or island with other fragmented city states and
> kingdoms. Thornwick should cover up to level 15. Outline the other areas each covering the next 15 or 20 levels.
> … Thornwick and its main quest is the first to solve - the ashenborn dead. Other regions should have different
> mainline stories and quests. Outline the npcs and enemies found in each region. New skills to learn. Also the
> fallen empire city mentioned in lore is where players gather for the arena. Its a larger city but in somewhat
> disrepair. Also there is a dark tower where players can challenge wave after wave, no xp, but for a leader board
> and special loot. A boss at each 10th wave that drops rare items the first time defeated."

(The "ashenborn dead" are the canon **Ashbound**, and this doc uses that name.)

---

## 1. The idea in one paragraph

Emberfall was always "the forgotten backwater of a fallen empire" (world doc §1). This proposal draws the rest of
that empire. **The Old Provinces** are an island-continent, once the whole of the Solmere Empire. At their heart
stands **Solmere**, the dead capital on its lake. North of it, in the Pale Heights, is the crater where the Ember was
found. When the flame went out, the provinces broke apart into:
- mining charters;
- free ports and a would-be emperor;
- clan woods that never wanted the empire in the first place.

Each region's main story is about one thing the Fall left behind:
- **Emberfall:** the dead who kept their orders.
- **The Cinder Reach:** the forges that still need feeding.
- **The Tidemark:** the living who want the throne back.
- **The Tithewood:** the souls the empire took and never spent.
- **The Pale Heights:** the flame itself.

The Cinder Cult runs underneath all five as a buyer, a patron and a thief, never as the local villain. It needs four
things to relight the Ember, and each region's ending shows which one it took from there:
- **a spark** (Emberfall);
- **a vessel** (the Reach);
- **a hand** (the Tidemark);
- **fuel** (the Tithewood).

The Heights are where it puts them together.

---

## 2. The map

![The Old Provinces of Solmere, in the 301st year of the Dim](img/world/old-provinces.png)

Drawn as the Guild's own wall map: ink on parchment, hills in hatching, woods in little crowns, the old roads ruled
straight. The corners are blank, because nobody has been. Source: `tools/worldmap/draw.mjs` (SVG; regenerate with
`node tools/worldmap/draw.mjs`).

| | Where | Levels | Hub | Main story |
|---|---|---|---|---|
| **1. Emberfall** (the Hollow Vale and the Greywater Fens) | the south-west corner, the empire's granary | **1–15** | **Thornwick** | *Until Relieved*: the Ashbound dead |
| **2. The Cinder Reach** (the Deepdelver Charter) | the black hills of the west | **15–30** | **Ashgate** | *Quota*: the forges relit, and who feeds them |
| **Solmere**, the dead capital (free city) | the centre, on the Mere | 15+ (all bands) | **the Lamphall** | the Arena, and the Great Beacon |
| **3. The Tidemark** (the free ports, and the kingdom of Highmarch) | the east coast | **30–45** | **Tollhaven** | *The Ninth Solmere*: a would-be emperor's war |
| **4. The Tithewood** (the clan woods) | the south-east | **45–60** | **Rookstead** | *The Unpaid*: the souls the empire never burned |
| **5. The Pale Heights and the Ember Throne** | the north, round the crater | **60–80** | **Frosthold** | *The Throne of Embers*: the finale |
| Post-game | under the Throne | 80 | — | the Undervaults (canon); the Great Beacon |

**The route** runs round the capital:
1. Emberfall, then up the Wickham road into the Reach.
2. East along the old road to Solmere.
3. On to the coast, then south into the wood.
4. Last, north up the Pilgrims' Stair to the crater.

Solmere opens once Emberfall is done. You pass through it again and again on the way.

**Guild rank gates the road** (canon: "Guild rank gates regions"). The company's own rank follows the sellswords'
lamps:
- **Wick:** Emberfall.
- **Lamp:** the Reach and Solmere.
- **Lantern:** the Tidemark and the Tithewood.
- **Beacon:** the Heights.

The level cap rises from 30 to **80**.

---

## 3. The regions

Each region below has the same parts:
- what it is;
- its main story in chapters (★, as now);
- its sites and their bands;
- its people;
- its enemies and bosses;
- its Chronicle set and hidden site;
- what it teaches (§5).

### 3.1 Emberfall: levels 1–15 · *Until Relieved*

**What it is.** It's as canon has it: the Hollow Vale's farms and barrows (1–8), and south of them the Greywater Fens
(8–15), where the drowned imperial canal runs to the sea. It's one province, with one hub: **Thornwick**.
- **Saltmere**, the stilt town, becomes a **waystation**: a tavern with a board, the Grey Sisters' chapel and a
  shrine. It has no smith and no inn, so a company comes home to Thornwick to mend, rest and spend.
- That keeps the owner's line ("Thornwick should cover up to level 15") and gives the Fens a town of their own.

**Main story.** It's the Ashbound dead, in two acts.

1. **Act I, *Smoke over the Vale*** (shipped, 1–9): the Tithe Mill, Wickham Keep and Garrow, the Sunken Chapel and
   the Robed Stranger, the Standard of the Third Legion. The road opens and the carts run.
2. **Act II, *The Drowned Abbey*** (8–15): the shard leads to the fens.
   - ★ *Fog on the Canal* (8–10). In Saltmere, **Wren** owes the Cult money and knows where its boats go at night:
     to the **Sickpools**, the imperial alchemy vats.
   - ★ *The Sickpools* (10–12). The Cult is draining them. What's left at the bottom is the fen dead, kept from
     rotting by whatever the empire brewed there. They're being carted to the Abbey.
   - ★ *The Bells* (12–14). The **Drowned Abbey**. The Grey Sisters drowned at their office when the canal broke
     the night of the Fall, and the **Abbess Below** still keeps the hours under the water. The Cult is
     "harvesting" what the Abbey holds, the drowned souls, and burning the Sisters' records as it goes. You
     save some of the records: the Sisters' genealogies, which matter in the Tidemark.
   - ★ *Until Relieved* (14–15). The last of the province's dead are put down and the Abbess with them.
     - Sister Ilse lays the shards side by side and reads them. Every one was cut from the same place: a bound
       soul's last light, struck out of a legion or a choir like flint.
     - The Cult wasn't raising the dead. It was mining them.
     - The ledgers on the Abbey's Cult boats name their buyer: an assay house in Ashgate, paying in coal-red wax
       with a thumbprint in it, the same seal as the Paymaster's Box.
     - **What the Cult took from Emberfall: the spark.**

**Sites.**

| Site | Levels | What |
|---|---|---|
| The Tithe Mill, the Scrag Warren, Wickham Keep, the Sunken Chapel, the Old Barrows, the Ninth Milestone | 1–9 | shipped |
| **Toadking's Mound** | 8–11 | a fen-folk bandit chief's island of stolen boats (canon name) |
| **The Canal Locks** | 9–12 | the drowned imperial canal's lock-keepers' halls, where the Cult moors |
| **The Sickpools** | 10–13 | the imperial vats, still leaking |
| **The Drowned Abbey** | 12–15 | three floors going down into the water; the Abbess Below |
| **Reedholm Undercroft** (hidden) | 15 | the Grey Sisters' sealed copy-room, revealed by the Fens' Chronicle set |

**People.**
- Shipped: Maudry, Osric, Ilse, the six townsfolk, Brannoc, Garrow, the Robed Stranger, Old Skarn.
- **Wren** (canon): a Saltmere smuggler, and the Fens' found companion (rogue).
- **Mother Agnes of Reedholm:** the Grey Sisters' prioress. She keeps what's left of the archive and teaches the
  **Healer** (canon: the Healer unlocks in the Fens).
- **Pim Rushlight:** a fen-folk halfling, chandler of Saltmere. He sells lamp oil cheaper than Wendel and wants
  Wendel told.
- **The Toadking:** a fen-folk bandit chief, fat, cheerful, and armed with a boat-hook.
- **Brother Teague:** the Cult's harvester at the Abbey. He's the Robed Stranger's superior, and he does keep his
  name.

**Enemies.**
- Shipped: the Redhand, the Ashbound minions, rogues, warriors and mages, and the hill goblins.
- Fens (canon):
  - Cult acolytes and **harvesters** (a lantern-cage on a pole);
  - **fen ghouls**;
  - Ashbound rogues;
  - **bog-witches**;
  - the Toadking's **reed-cutters**.
- **Bosses:** the Toadking (he calls the fen up: slow mud), **Brother Teague** (a cage of souls that heals him
  until it's broken), the **Abbess Below** (the bells: every toll drowns the room a little more).
- **Region boss** (canon): **the Drowned Choir**.

**Chronicle.**
- The Vale's ten fragments (shipped).
- The **Fens set**, ten fragments, about the night the canal broke and what the Sisters wrote down as the water
  rose. Its last fragment: *"We kept the hours. The water kept us."*

### 3.2 The Cinder Reach: levels 15–30 · *Quota*

**What it is.** Black hills of slag west of the capital, and the imperial foundries in them (canon §3.3, its
levels moved).
- **The Deepdelvers** held the seams under an imperial charter and ran the foundries for the empire. They never
  asked what the furnaces burned.
- Since the Fall the furnaces have been cold, and the charter has been a piece of paper nobody can enforce.
- **Hub: Ashgate** (canon), under the Deepdelvers' charter. **Kell's Rest** is a waystation under a dead volcano.

**Main story.** *Quota*, a story about the living. Who pays to make a fire burn, and with what?
1. ★ *The Cold Shift* (15–18). Ashgate is booming. Someone has relit the **Cinderworks**, and there's work for
   everyone. Miners on the night shift in the **Slag Tunnels** don't come up.
2. ★ *The Assay* (18–22). The relit works belong to **the Kell Assay**, a human company that bought the lease
   from the Slagborn clan. Its factor, **Morrow Vane**, is polite, pays well and keeps a ledger.
   - The ledger has a column headed *quota*.
   - The coin in his strongroom is sealed in coal-red wax with a thumbprint.
3. ★ *The Charter Moot* (22–26). The Deepdelver clans meet in the **Forgehall of Oruth** to decide whether to take
   Vane's money.
   - **Oruth the Forgemaster**, the empire's great bound forgemaster and the clans' revered ancestor, wakes in the
     hall when the forges' heat reaches it, and goes back to work as ordered.
   - The moot ends in a fight, with Oruth on the wrong side of it.
4. ★ *Furnace Nine* (26–30). The **Magma Vault** under the Cinderworks.
   - Vane fed the furnaces miners, at the Cult's rate: *eleven more souls per week*.
   - The thing the furnaces were forging is cast: a **vessel**, a lamp the size of a cart, with room inside for a
     flame.
   - Vane falls. The Cult's furnace-priests have already hauled the vessel east, on the old road to Solmere.
   - **What the Cult took from the Reach: the vessel.**

**Sites.**

| Site | Levels | What |
|---|---|---|
| **The Slag Tunnels** | 15–19 | collapsed workings full of cinder hounds |
| **The Cinderworks** | 18–23 | the relit foundry, a floor per furnace |
| **The Forgehall of Oruth** | 22–27 | the clans' hall, and its forgemaster |
| **The Magma Vault** | 26–30 | under Furnace Nine |
| **The Ninth Vault** (hidden) | 30 | the imperial quota office's strongroom (canon loot prefix: *of the Ninth Vault*) |

**People.**
- **Charter-Reeve Dagny Coalbrook:** a Deepdelver, head of the moot. She is short-tempered, honest and broke, and
  she gives the region's chapters.
- **Tamsin Coalbrook:** Dagny's niece, a mage-smith, and the Reach's found companion (mage). She wants the
  charter honoured and her cousins back from the night shift.
- **Morrow Vane:** the Kell Assay's factor, and the chapter villain. He's never cruel and never in a hurry. He
  believes every soul has a price, and pays it.
- **Gunnar Slagg:** headman of the Slagborn clan, who sold the lease. He's ashamed and drinks about it.
- **Hob:** an Ashgate fixer who knows which shift is short.
- **Oruth the Forgemaster:** bound, ancestral, and on the wrong side.

**Enemies.**
- **Forge-wights**, **cinder hounds**, Ashbound **warriors** (the foundry legions) and Cult **furnace-priests**,
  all canon.
- New:
  - **Assay guards**, living sellswords in Kell livery;
  - **slag golems**, the works' bound haulers;
  - **Slagborn renegades**, Deepdelvers on Vane's pay.
- **Bosses:** the Slagborn's champion (Slag Tunnels), the **Foreman** (a forge-wight who calls the shift), **Oruth**
  (canon: hammers the floor into molten seams), **Morrow Vane** (he buys his guards back: every 20 s, a fallen
  guard rises in fresh livery).
- **Region boss** (canon): **Furnace Nine**, which learned to feed itself.

**Chronicle.** The **Reach set**, about the charter and the quota. Canon: *"Furnace nine requires eleven more souls
per week to meet quota."* Its last fragment: *"The charter is renewed for another hundred years. The Deepdelvers
did not ask what the furnaces burn. We did not tell them."*

### 3.3 Solmere, the dead capital (15+): the Arena and the Great Beacon

**What it is.** The empire's capital, on the lake it's named for (*Sol-mere*). It was built for half a million
people. About twenty thousand live there now, in the best of the ruins.
- Every successor state wants it, so none can have it. **The Dim Peace** (signed in the 41st year of the Dim, out
  of exhaustion) says no crown may hold Solmere.
- It's kept, in name, by **the Peace Wardens**. In fact it's kept by **the Lantern Guild**, whose mother-house,
  **the Lamphall**, stands at the foot of the Great Beacon.
- **It's in disrepair, honestly:**
  - whole quarters are empty;
  - the aqueduct runs into a street;
  - the palace of the Solmeres is a tenement with very good ceilings;
  - the Grand Archive is half burned and half lived in.

**Why the Guild.** The Lantern Guild began as the empire's **beacon-keepers**. A chain of lamp-towers carried the
Ember's light from the Great Beacon to every province, and the Guild's ranks are named for them: **Wick, Lamp,
Lantern, Beacon**. When the light went out, the keepers had nothing to keep, so they kept the roads instead. This
is new canon, and it makes the Guild's lamps make sense.

**What's here.**
- **The Lamphall:** the Guild's mother-house. The company is entered on the Roll here when it makes *Lamp*, and
  this is how Solmere opens. It has a global board, the Guild's promotions, and the social square for players.
  The Master of the Roll is **Aldo Pennick**.
- **The Bowl** (the imperial *Circus of the Sun*): the empire's arena, where bound dead fought for crowds.
  - Half its tiers have fallen in. The other half are full every feast-day.
  - Companies fight companies for purses and a place on the board.
  - Run by **Ma Gorrie**, who takes bets, and **the Tallyman of the Bowl**, an Ashbound herald who still calls the
    bouts. Nobody has had the heart to put him down.
- **The Great Beacon:** the dark tower (below).
- **Quarters:**
  - each successor state keeps an embassy quarter: the Charter's, Highmarch's, the League's, the clans'. A
    company's renown in a region opens that quarter's door;
  - the **Grey Sisters' Hospice** (resurrection, the temple);
  - the **Exchange** (shut since the Fall: "trade later").

**Solmere's own trouble** (side quests, never a main story):
- the aqueduct;
- the gangs that hold the empty quarters;
- a Highmarch envoy recruiting;
- the Bowl's dead herald;
- the Archive's lost wing.

#### The Arena: the Bowl

The arena is what canon already plans (GDD §12, M10/M12): **async party-vs-party first, live later**.
- **How a bout works.** Your company (hero plus two) against another player's company as it stood when they last
  saved it, played in the same sim. Bouts are replayed and validated like everything else that's shared.
- **Brackets by band.** 15–29, 30–44, 45–59, 60–80. A bout is against companies in your band, at your level.
- **Seasons** (a month). Standing comes from wins against companies ranked near you.
- **Rewards:**
  - **marks of the Bowl**, which buy the Bowl's own gear: arena tabards, banners and a few named items. These are
    no stronger than a Rare of their level; the Bowl is for standing, not power;
  - titles;
  - a season banner over the company's tavern table.
- **Later:** live 1v1 and 3v3 (M12), and the Heroic raids gathering in the Lamphall.

#### The Great Beacon: the dark tower

**What it is.** The tower that carried the Ember's light to the provinces. It has been dark for 300 years, but it
isn't empty.
- The empire bound **lampwardens** to keep it, a warden to every tenth landing, and they still keep it.
- Every night whatever the dark draws, Ashbound from every province and worse, climbs the stair toward the
  lamp-room.
- The Guild holds the door. For a fee and a signature it lets a company **climb the Beacon**: floor after floor,
  each a wave, as far as it can hold.

**The rules** (the owner's):
- **No XP.** The Beacon teaches nothing. In the fiction it pays only in what it holds: **beacon-light**, the Guild's
  word for the pale fire that clings to what comes down from the tower. Kept out of XP, the tower can't become a
  levelling farm, and the regions stay the way to grow.
- **A leaderboard: the Beacon Roll**, the names painted on the stair's door.
  - Highest floor reached, per band and per season.
  - Validated by replay: written only by the validator (architecture, AGENTS.md).
- **Waves.** Each floor is one wave, harder than the last, with no rest between.
  - The climb starts at the company's level.
  - Every floor adds +1 % to the foes' power, and every tenth adds a step: a new kind of foe joins the mix.
  - You can leave at any landing. Leaving keeps what you won; being beaten keeps the floors climbed, not the
    loot carried since the last landing.
- **A boss at every tenth floor: the lampwardens.** Each drops a **rare item the first time it's beaten**: its own
  heirloom, once per hero. After that it drops ordinary tower loot.

| Floor | Warden | Mechanic | First kill |
|---|---|---|---|
| 10 | **The Doorward** | holds the stair: half damage from the front | *The Doorward's Latch* (shield) |
| 20 | **The Oilwright** | spills burning oil that spreads each tick | *Oilwright's Apron* (armour) |
| 30 | **The Bellringer** | each bell calls a rank of Ashbound | *The Ringing Iron* (mace) |
| 40 | **The Glasswright** | mirrors a spell back at its caster | *Glasswright's Lens* (mage off-hand) |
| 50 | **The Keeper of Wicks** | snuffs your buffs, one a tick | *Snuffer* (dagger) |
| 60 | **The Twin Lamps** | two wardens; kill them together or the other relights | *The Pair* (rings) |
| 70 | **The Beacon Hound** | hunts the lowest-HP member | *Houndsmaster's Lead* (whip-bow) |
| 80 | **The Signalman** | links to the next floor: adds pour in until it's down | *Signal Horn* (amulet) |
| 90 | **The Last Keeper** | the order to keep the lamp lit, and nothing else | *Keeper's Oath* (helm) |
| 100 | **The Lamp-Room** | the room itself: the dark lamp burns whoever stands nearest | *Beacon-light* (cloak; the pale fire visible on the figure) |

Past floor 100 the wardens come round again, harder, with nothing new to drop: that's for the Roll.

**Special loot.** Between wardens the tower drops **beacon-lit** gear: ordinary bases with one beacon affix
(*"Still warm. Nobody knows from what."*) and a faint pale glow on the figure. A beacon-lit piece is no stronger
than a Rare, but it can't be had anywhere else.

### 3.4 The Tidemark: levels 30–45 · *The Ninth Solmere*

**What it is.** The east coast: the **Tidemark League** of free ports, and inland the walled kingdom of
**Highmarch**.
- The ports traded with the empire, and now they trade with everybody and charge for the privilege.
- Highmarch was the empire's eastern march.
- **Hub: Tollhaven**, the League's largest port, where even the harbour chain takes a toll. Landmarks: **Brine
  Cross** (a bridge-town on the Highmarch road), **Gullwick**, and **Highmarch** itself.

**Main story.** *The Ninth Solmere*, a war story. Mostly the living, and mostly the reasonable-sounding.
1. ★ *Letters of Marque* (30–33). The **Gull Fleet** corsairs are raiding the League's shipping with Highmarch's
   letters of marque. In the Gull Isles, an admiral's ledger shows who pays.
2. ★ *The Claim* (33–37). **Lucan Varro** of Highmarch styles himself **Lucan Solmere, the Ninth**, heir of the
   empire, and means to march on the capital and be crowned in it.
   - Is he Solmere blood? The Grey Sisters' genealogies you saved from the Drowned Abbey say **yes**. He comes of
     the Empress's sister's line.
   - He's the real thing, and it doesn't make him right.
3. ★ *Brine Cross* (37–41). Lucan's legion, living soldiers in imperial kit with hired Redhand crossbows (canon:
   the Redhand "recurring later as hirelings"), lays siege to the bridge-town that blocks his road west. You hold
   it.
4. ★ *The Ninth's Palace* (41–45). You storm Highmarch. Lucan is beaten, not killed.
   - In his study: letters from **the Kindler** (Corvane Vell, canon), who has courted him all along.
   - The Ember answers only to Solmere blood, which is why one Empress could put it out. A new flame needs a
     Solmere hand to tend it.
   - Lucan wanted an empire, not a furnace, and refused. Beaten, with nothing left, he goes to the Heights of his
     own will: *"Better a furnace than a ditch."*
   - **What the Cult took from the Tidemark: the hand.**

**Sites.**

| Site | Levels | What |
|---|---|---|
| **The Gull Isles** | 30–34 | corsair holds in the old signal forts |
| **The Drowned Mole** | 33–37 | the sunken imperial harbour wall, and what's moored inside it |
| **Brine Cross** | 37–41 | the siege, held room by room |
| **The Ninth's Palace** | 41–45 | Highmarch's keep |
| **The Empress's Cabin** (hidden) | 45 | the wreck of the imperial flagship *Aurelle's Grace*, and the Empress's letters to her sister |

**People.**
- **Hester Quaile:** Speaker of the League's council, harbourmistress of Tollhaven. She counts everything twice and
  gives the region's chapters.
- **Sister Maren:** a Grey Sister who serves as chaplain on Tollhaven's quays, and the Tidemark's found companion
  (cleric). She read the genealogies first and wishes she hadn't.
- **Old Gannet:** keeper of the last lit lamp-tower on the coast. He's the Guild's oldest member, and he keeps the
  light because nobody told him to stop.
- **Lucan Varro, "the Ninth":** handsome, educated and sincere, the nobleman with one syllable too many.
- **Admiral Grell Hesk** of the Gull Fleet: a corsair with a commission, and proud of it.
- **The Kindler** (canon): seen here for the first time in person, at Lucan's table.

**Enemies.**
- **Highmarch legionaries** (the Ninth's Own): living soldiers drilled to the old manuals. They fight in formation
  and hold a shield wall.
- **Redhand crossbowmen**, hired (canon art).
- **Gull Fleet corsairs:** boarders, harpooners and powder-monkeys with fire pots.
- **War-hounds.**
- **Siege engineers**, who build a ballista mid-fight if they're let.
- The Drowned Mole's **drowned sailors**: Ashbound of the imperial fleet, still at their stations.
- **Bosses:** Admiral Hesk (boarding: he swaps rooms with you), the **Mole's Harbourmaster** (an Ashbound officer who
  closes the chain), **the Ninth's Champion** at Brine Cross, and **Lucan** (he fights fair, and his guard won't
  let you reach him until they're down).
- **Region boss:** **The Grace**, the imperial flagship's bound crew, still holding station off the Mole "until
  recalled". It's the Tidemark's mirror of the Third Legion: it surfaces at the Mole's mouth on a spring tide.

**Chronicle.** The **Tidemark set**: Aurelle's letters to her sister, from girlhood to the last year. It's the first
time the player hears the Empress speak.
- *"They say the Ember answers to our blood. Father says that is why we must never be afraid of it."*
- The last fragment: *"If it answers to our blood, it can be told to stop."*

### 3.5 The Tithewood: levels 45–60 · *The Unpaid*

**What it is.** The great wood and the hill-clans of the south-east, which the empire conquered and **tithed**.
- Every year the clans paid in grain, and in souls. Canon, from the Tithe Ledger: *"Souls, two hundred and forty.
  Paid in full to the Ember Throne."*
- The souls didn't go to the Throne at once. They waited in imperial **tithe-granaries**, barns under the oaks with
  a reeve and a ledger, until the carts came.
- On the night of the Fall, no carts came. Three hundred years of the tithe are still in the granaries, **unpaid**.
- The clans call them their grandparents.
- The **hedge-callers** (canon §4) learned their trade here first. This is the old country of the cup by the
  hearth.
- **Hub: Rookstead**, a clan steading inside a ring of standing stones. Landmarks: **Hollin Ford**, and the **Tithe
  Road**, the imperial road ruled straight through the oaks and now half swallowed.

**Main story.** *The Unpaid*: folk horror, quiet and unkind.
1. ★ *Arrears* (45–49). A granary's reeve has woken: the **Tithe-Reeve**, the empire's collector, bound to his
   ledger. Since the Cult relit the forges he's been collecting again, and the clans are three hundred years in
   arrears. He takes the living to make up the count.
2. ★ *The Moot of Antlers* (49–53). The clans, the hedge-callers and the wood's own wardens meet at the stones. The
   clans want the granaries opened and their dead let go. Opening them means going through the **Tally-House**,
   where the empire kept the count.
3. ★ *The Tally* (53–57). The Tally-House and its **tallymen**, Ashbound clerks in chains, counting. The Cult's
   **harvesters** are already there, filling lantern-cages.
4. ★ *Paid in Full* (57–60). The **Root Granary** under the oldest oak: the Reeve, the count and the Unpaid.
   - You open the granary, and the clans' dead go home.
   - Most of them. The Cult's last carts got out with a share before the doors came down.
   - It's enough to light a flame, not enough to keep it, and the Kindler knows it.
   - **What the Cult took from the Tithewood: fuel.** Too little, which matters in the finale.

**Sites.**

| Site | Levels | What |
|---|---|---|
| **The Barn at Hollin Ford** | 45–49 | the first granary, and its reeve's clerk |
| **The Thornway** | 48–52 | the Tithe Road, swallowed by the wood; the wardens' ground |
| **The Tally-House** | 52–57 | the imperial count |
| **The Root Granary** | 56–60 | under the oldest oak |
| **The First Barn** (hidden) | 60 | where the first tithe was taken, and a hedge-caller's grave |

**People.**
- **Grandmother Yew:** the eldest hedge-caller of Rookstead, who gives the region's chapters. She calls the player
  "the carter's friend" if Col taught them (a callback).
- **Moth:** a hedge-caller's boy, small and serious, the Tithewood's found companion (shaman). His great-great-
  grandmother is in the Root Granary.
- **Thane Ivo of the Antlers:** the war-leader of the clans, who wants to burn the Tally-House with the tallymen in
  it.
- **Lirien:** an elf. Canon says "rare, aloof elves passing through", and the Tithewood is what they pass through
  to. She is the wood's warden at the stones. She's polite and old, and unhelpful until she isn't.
- **The Tithe-Reeve:** the empire's collector, bound to the ledger he carries.

**Enemies.**
- **Tallymen**, the Reeve's Ashbound clerks: chains and ledgers. They mark a target, and the marked one takes more.
- **Barn-wights.**
- The Cult's **harvesters**, with lantern-cages.
- **Thorn-wardens**, the wood's own, who are hostile on the Thornway.
- **Wolves** and **boars**.
- **The Unpaid**: spirits, not bodies. They pass through the front line. Turn Undead works on them, and the new
  cleric skill *Unbinding* more.
- **Bosses:** the **Reeve's Clerk** (Hollin Ford), **the Green Warden** (the Thornway; the wood fights for it),
  **the Tally** (a clerk with a thousand hands), and **the Tithe-Reeve** (each soul he's collected is a shield;
  open the cages to strip them).
- **Region boss:** **The Unpaid**, the granary's host as one. It's beaten, not killed: it goes home.

**Chronicle.** The **Tithewood set**, about the tithe from the clans' side: tally-sticks, a reeve's diary, a
hedge-caller's charm against the carts. Its last fragment: *"The tithe was never for the dead. It was for the
fire."*

### 3.6 The Pale Heights and the Ember Throne: levels 60–80 · *The Throne of Embers*

**What it is.** It's canon §3.4–3.5, with its levels moved: the frozen passes round the crater where the Ember was
found.
- **Hub: Frosthold**, the monastery turned fortress.
- Sites (canon): the Pilgrims' Stair, the Soulcracks, the Glass Keep, the Ember Throne.

**Main story.** The canon Act IV, with the four threads gathered.
1. ★ *The Pilgrims' Stair* (60–65). The vessel's road, the Cult's camps, and Lucan's guard going up ahead of you.
2. ★ *The Soulcracks* (65–70). The canyon the Fall split open. What the Ember burned is down there, as light in the
   rock.
3. ★ *The Glass Keep* (70–75). **The Glass Legate** (canon) guards Aurelle's last letter.
   - The reveal: she put the Ember out herself, and with her own blood (the Tidemark set made that possible to
     understand).
   - Canon: *"Forgive me. They will call it the Fall. Let them. — A."*
4. ★ *The Throne of Embers* (75–80). The Kindler lights the vessel with the spark, in the vessel, by Lucan's hand.
   - The fuel is too little. So, sincere to the end, Corvane Vell and his faithful give it themselves.
   - The Chaplain's Prayer (Vale set) comes back: *"Bind them gently. Most of them volunteered."*
   - Beat him, and the choice is canon's: **snuff the new flame as Aurelle did**. Only a Solmere hand can tell it to
     stop, and Lucan is standing there.
   - Or keep it: the darker ending, and the post-game Undervaults (canon).

**People.**
- **Prior Anselm of Frosthold**, who gives the chapters.
- **The Glass Legate.**
- **Lucan**, the last time.
- **The Kindler.**
- **The First Pilgrim** (region boss, canon).

**Enemies** (canon):
- Ashbound mages and elite legions, the Empress's **Praetorian** dead;
- frost revenants;
- the Cult's inner circle;
- the **glass-touched**: pilgrims fused with the crater's glass.

**Chronicle.** The **Heights set** (canon's Glass Keep fragments), ending with Aurelle's.

---

## 4. Enemies and new art, by region

| Region | New families | Reuses |
|---|---|---|
| Emberfall (Fens) | Cult harvesters, fen ghouls, bog-witches, reed-cutters | Ashbound, Cult acolytes |
| The Reach | forge-wights, cinder hounds, slag golems, Assay guards, Slagborn | Ashbound warriors, furnace-priests |
| Solmere / Beacon | the lampwardens (ten bosses) | every region's foes, in the tower's mix |
| The Tidemark | Highmarch legionaries, corsairs, war-hounds, engineers, drowned sailors | Redhand crossbowmen |
| The Tithewood | tallymen, barn-wights, thorn-wardens, wolves, boars, the Unpaid | Cult harvesters |
| The Heights | Praetorians, frost revenants, glass-touched | Ashbound mages, Cult inner circle |

---

## 5. New skills

Today each class has abilities at levels 1, 6 and 12 (taught by Thornwick's trials) and a passive at 20 (GDD §5).
The pillar is "skills are earned": each unlocks at a level and is **learned from a trial in the region that
teaches it**.

With seven abilities, autocast gets crowded. So from level 25 a member **carries four** actives (a loadout, set in
the Skills tab) and the rest wait. This is where "many ways to play" gets its depth.

| Class | The Reach (L25) | The Tidemark (L35) | The Tithewood (L50) | The Heights (L65) | Passive (L40) |
|---|---|---|---|---|---|
| **Fighter** | **Anvil Stance**: 6 s unmoved; melee hitting you takes 20 % back (Dagny) | **Hold the Bridge**: the party behind you takes 25 % less for 6 s (Brine Cross's captain) | **Oath of Thorns**: the next 5 hits on you wound their striker (Thane Ivo) | **Until Relieved**: for 6 s nobody in the party can drop below 1 HP (the Glass Legate's last order, taken from it) | *Old Soldier*: +1 s on every guard |
| **Rogue** | **Slag Pot**: a thrown pot, a burning patch that blinds (Hob) | **Mark for the Fleet**: a marked foe takes +20 % from the party's crits (Old Gannet) | **Fade into the Thorn**: step out of sight, reappear behind the farthest caster (Lirien) | **Glasswalk**: blink through a foe, and the next strike crits (Prior Anselm) | *Pickpocket*: +gold from kills |
| **Mage** | **Slagstorm**: a burning field that grows (Tamsin) | **Storm-glass**: lightning that jumps to 3 more (Hester's harbour mage) | **Wildfire**: fire that spreads from foe to foe (Grandmother Yew, reluctantly) | **Last Light**: one huge strike, at the cost of half your MP (Aurelle's letter) | *Bright Mind*: crits refund MP |
| **Cleric** | **Hallowed Ground**: a circle that heals allies and burns the dead in it (Ashgate's shrine) | **Rite of Truce**: the living foes in a room stop for 3 s (Sister Maren) | **Unbinding**: frees bound souls: great damage to the dead and the Unpaid, a heal for each (Mother Agnes's letter) | **Requiem**: a party-wide heal, and every downed ally stands (Frosthold) | *Psalter*: heals cleanse a slow |
| **Shaman** | **Ash Totem**: a totem that drains every foe near it (the Slagborn's wise-woman) | **Drowned Whisper**: the foes in a knot hear the sea and turn on each other for 2 s (Gannet) | **Call the Unpaid**: three spirits fight beside you for 10 s (Grandmother Yew) | **Breath of the Heights**: the party's MP back, and +20 % ATK for 8 s (the First Pilgrim's charm) | *Hedge Lore*: hexes last longer |
| **Healer** (unlocks in the Fens, canon) | Renew, Purge, Sanctuary (canon, at 8 / 12 / 15) and then the same four trials | | | | |

The trials are the company's, as now: one member of the class at the level, and every member of the class learns it.

---

## 6. How it hangs together

**One question, five answers.** The Fall left the provinces with its debts, and each region pays one:

| Region | What the Fall left | Who wants it | What the Cult takes |
|---|---|---|---|
| Emberfall | the dead, still under orders | nobody: they just stand there | **the spark** (shards struck from bound souls) |
| The Reach | the forges, still needing fuel | the Kell Assay, for profit | **the vessel** |
| The Tidemark | the throne, still empty | Lucan, for a crown | **the hand** (Solmere blood) |
| The Tithewood | the tithe, still unpaid | the Reeve, for the count | **the fuel** (too little) |
| The Heights | the flame | the Kindler, for faith | — he puts them together |

- **The Chronicle builds the reveal across the map.** The Vale shows the dead were *tithed*, the Reach that the
  forges *burned* them, the Tidemark that the Empress's blood *commanded* the flame, and the Tithewood that the
  tithe was *for the fire*. The Heights say she *chose* to put it out.
- **Nobody is a chosen one** (world doc §9). Lucan is real blood and an ordinary man. The player is a company of
  sellswords with good boots.
- **Callbacks are planned, not hoped for:**
  - the coal-red wax (the Vale → the Abbey → the Reach);
  - the Sisters' genealogies (the Fens → the Tidemark);
  - Col's grandmother (the Vale → Grandmother Yew);
  - *"until relieved"* (the Third Legion → the Grace → the fighter's capstone);
  - *"most of them volunteered"* (the Sunken Chapel → the Throne).

---

## 7. Canon and design changes this needs

**World doc** (a canon pass, before any content):
1. **The Old Provinces and Solmere.** The empire was the island. Emberfall is its south-west province, the Vale
   and the Fens. The Reach, the Heights and the Throne are **neighbouring lands**, not Emberfall's (§3 now puts all
   four in the province).
2. **Level bands:**

   | Region | Was | Now |
   |---|---|---|
   | Vale | 1–8 | 1–8 |
   | Fens | 8–15 | 8–15 |
   | Reach | 15–22 | 15–30 |
   | Heights | 22–30 | 60–80 |
   | Throne | 30+ | 75–80 |

   Two new regions: the Tidemark (30–45) and the Tithewood (45–60).
3. **Thornwick is Emberfall's one hub**, and Saltmere a waystation (GDD §10 lists Saltmere as a hub).
4. **The Lantern Guild began as the beacon-keepers**, and the Great Beacon is its mother-house's tower.
5. **The Ember answers to Solmere blood.** This is new, and it's what lets Aurelle put it out alone.
6. **The Cult's four needs** (spark, vessel, hand, fuel), and the Kindler's faithful as the last fuel.
7. **New names:**
   - places: the Tidemark, Tollhaven, Highmarch, Brine Cross, Gullwick, the Tithewood, Rookstead, Hollin Ford,
     the Mere, the Bowl, the Lamphall;
   - people: Lucan Varro, Hester Quaile, Sister Maren, Old Gannet, Dagny and Tamsin Coalbrook, Morrow Vane, Gunnar
     Slagg, Hob, Grandmother Yew, Moth, Thane Ivo, Lirien, Prior Anselm, Mother Agnes, Pim Rushlight, Brother
     Teague, Aldo Pennick, Ma Gorrie.

**GDD:**
- level cap 30 → 80, and the XP table extended (the same curve);
- the four-active loadout from 25;
- the arena brackets;
- the Beacon's rules;
- region renown by Guild rank.

**Development plan:**
- M8 becomes "the Fens" (Emberfall to 15), and M9 the Reach.
- New milestones for Solmere (with M10's async arena), the Tidemark, the Tithewood, and the Heights and Throne.
- The Beacon rides on M7's leaderboards and validator.

---

## 8. Questions for the owner

1. **Saltmere as a waystation?** Or should the Fens keep a full hub, with Thornwick's reach ending at 8?
2. **The level cap of 80**, in five bands of 15–20?
3. **The four-active loadout** from 25, or every ability on autocast?
4. **Lucan at the finale:** a Solmere hand at the snuffing (he does what Aurelle did), or the player alone?
5. **The arena's rewards:** standing only (titles, banners, cosmetics), or Bowl gear capped at Rare?
