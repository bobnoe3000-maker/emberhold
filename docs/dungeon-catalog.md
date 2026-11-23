# Dungeon catalogue: the dressing kits, the regions' rosters, the archetypes still to build

*2026-11-23 · **Proposal**, for the owner. It changes no canon and no rule yet. Names and facts here come from
[emberfall-world.md](./emberfall-world.md); a place it adds is marked **(proposal)** and goes to the world doc first if
it's taken. The owner: "Catalog these new dungeon dressing types and assets for future use. Weave them into the current
and planned regions and quest line. Outline additional archetypes of dungeons that each region might need (keeping to
up to 3 per region with a secret optional one per GDD)."*

The rule it keeps is GDD §10, *One dungeon a level* (v1.48):

- Each land has its band dungeons, one a band, none overlapping.
- Each land has **one secret dungeon**, opened by its Chronicle set, at the land's top level. It seals for a while
  after its vault is opened (`SECRET_REST`).
- A band is three levels. **"A dungeon may widen to four or five levels later if a land wants fewer of them"**: that
  clause is what keeps the later lands, which span fifteen levels each, to three dungeons.

---

## 1. The one-floor building template

The four new kits were built on one floor plan. It is the cheapest way to a new place, and each of the four reached a
critic score of 6 to 9 in a day or two.

| Room | Role | Size (tiles) | What it's for |
|---|---|---|---|
| 1 | entrance (a sanctuary) | 32 × 30 | the way in; the person who names the place stands here |
| 2 | room | 50 × 40 | the big fight, its middle kept open |
| 3 | offshoot | 26 × 20 | a small set piece (a kitchen, a chapel, a net stage, a watch walk) |
| 4 | room | 30 × 30 | a side room with its own look (the snug, the ossuary, the jetty, the bakers' row) |
| 5 | end | 48 × 40 | the last room: the chest, the boss if there is one |

The doors between rooms are 10 wide, the minimum hall width that `checkPlan` accepts.

**Making a new site from it** (the four as worked examples):

1. **The place.** Write its rooms in `src/sim/plans.js`, copying `shuttered_inn`, `haddow_crypt`, `old_eel_wharf`
   or `high_ramparts`. Give its record in `src/sim/sites.js` (region, base, family, `plan`) and its
   `content/sites/<id>.json`.
2. **The kit.** Add the kit to `DRESS`, `PLAN_OB`, `DOOR_LIGHT` and `PLAN_THEME` in `src/sim/world.js`, and the
   room's dressing tokens in `dressPlanned`. Any new piece goes in `DRESS_PIECES`, and in `DRESS_CAP` if it may
   repeat. A piece walked over goes in `FLAT_PROPS`.
3. **The look.** Add a `KIT_LOOK` entry in `src/render3d/convert.js`: floor and wall tiles, the hour, its flags
   (`inside`, `water`, `ramparts`) and the fill.
4. **The pieces.** Map each piece in the kit's handler (`TAVERN_3D`, `DOCK_3D` or `RAMP_3D`, or a new one). Build its
   trim in `tools/render3d/world.js` `buildTavern`, then rebuild with `node tools/render3d/build.mjs`.
5. **The checks.**
   - Every room's dressing stays under its size's caps (`node tools/dungeon/dress-audit.mjs <site>`).
   - Nothing stands on the stairs or in a doorway (`--clear`).
   - A test like `test/docks.test.mjs`: each room dressed as written, middles open, every piece whole, every room
     reached, the drawn side's pieces counted.
   - Art critic rounds against the reference, captured on the manual clock.

## 2. The four new kits

### 2.1 What each one is

| | **tavern**, **tavern_cellar** | **crypt**, **ossuary** | **docks** | **ramparts** |
|---|---|---|---|---|
| **What it is** | a building's inside: timber, plaster, a hearth | a family vault: dressed stone, an arcade, tombs | a wharf at night: decks on piles over still water, mist | a walled town's high streets: cobbled terraces, houses behind, a parapet over the drop |
| **Site (status)** | the Shuttered Inn, Reach, 20, placed | the Haddow Crypt, Vale, 6, placed | the Old Eel Wharf, Fens, 12, **parked** | the High Ramparts, Reach, 22, **parked** |
| **Preview** | `?scene=dungeon&site=shuttered_inn` | `…&site=haddow_crypt` | `…&site=old_eel_wharf` | `…&site=high_ramparts` |
| **Critic score** | **9** (10 rounds) | **8** (18 rounds) | **6.5** (round 4; its fixes in, being rescored) | **6** (round 2; its fixes in, being rescored) |
| **Rooms** | front room, common room, kitchen, snug, cellar hall | stair hall, hall of tombs, chantry chapel, ossuary, founder's vault | landing, fish market, net stage, long jetty, harbour end | stair head, market terrace, watch walk, bakers' row, bastion |
| **Sim dressing tokens** | `counter` `hearth` `kitchen_hearth` `noticeboard` `tavern_tables` `snug_tables` `prep_table` `firewood` `fire_baskets` `casks` `rug` `corners` `shrine_west` | `tombs` `tombs_near` `tombs_side` `tomb_one` `great_tomb` `mourners` `founder_lights` `candelabra_pair` `candelabra_ends` `offering` `chantry_altar` `chantry_pews` `crypt_corners` | `dock_lamps` `dock_cargo` `dock_ropes` `fish_market` `moorings` `crane` | `rampart_torches` `rampart_cargo` `rampart_clutter` `market_stalls` `oven` `rampart_well` |
| **Its own trim** (world.js) | post, beam, pegs, board, shelf, slate, cornice, window, hatchment, antlers, herbs, ham, logs, casks, cauldron, tableware, apron, grime, web, lantern | pier, arcade, sconce, niche, loculi, plaque, saint, rood, tomb, greattomb, mourner, altar, offering, candlestand, candelabra, urns, ledger, lightwell, skullniche, boneshelf, bonepile, skullpile, bonering, footbones, footcandles, fallenslab, plinth, surround | dockedge, dockrail, pile, bollard, lamppost (and its halo), lampglint, fishcrate, rope, net, rowboat, crane, reeds, harbourmist (with the far water) | merlons, walldrop (fog, string courses, slits), fartower (high and low), torchpole, oven; the houses are Luminati's `house` |
| **Luminati's objects** | the furniture (`furn`: tables, benches, sacks) | none | `barrel`, `crateStack` | `house`, `marketStall`, `well`, `barrel`, `crateStack` |
| **Light** | candles and the hearth; warm fill; the night at the shutters | sconces, a light-well; a cold fill | lanterns on posts, a halo each, broken glints on the water; hour 21.2 | torches on poles, the oven's mouth, the houses' windows; hour 21.6 |
| **Textures** | the inn's plaster, timber and flags | `crypt_flag`, `crypt_cap`, ashlar | `dock_deck` (planks), `dock_side` | `rampart_wall` (ashlar), `rampart_top`, `rampart_cobble` |
| **Doc / test** | [tavern-dungeon.md](./tavern-dungeon.md), `test/tavern.test.mjs` | [crypt-dungeon.md](./crypt-dungeon.md), `test/crypt.test.mjs` | [docks-dungeon.md](./docks-dungeon.md), `test/docks.test.mjs` | [ramparts-dungeon.md](./ramparts-dungeon.md), `test/ramparts.test.mjs` |

### 2.2 What each one is good for beyond its own site

- **The tavern kit** is the timber interior: posts and beams, plastered walls, a hearth, shelves and hanging stores.
  Its reuses:
  - any lived-in room: a guardhouse, a counting house, a palace's servants' wing, a ship's cabin;
  - with the crypt's rows of the dead laid out, **the Greenwood's tithe-granaries**: a barn, the Ashbound under the
    beams "in rows like sheaves" (world doc §3.8).
- **The crypt kit** is dressed stone with an arcade and set pieces along the walls. Its reuses:
  - any formal stone interior: a palace hall, a chapter-house, a reliquary, the Glass Keep (in black glass);
  - **the ossuary** for any charnel: the Heights' pilgrims who never went home.
- **The docks kit** is a deck over water, with the water and its mist drawn past the level's edges. Its reuses:
  - every harbour: **the Tidemark's**, the Drowned Mole and the Gull Isles;
  - Solmere's quays "over mud";
  - the Fens' boardwalks, if the Fens are ever redressed.
- **The ramparts kit** is a terrace over a drop, with the town behind, the wall's face falling into fog and towers
  out in the mist. Its reuses:
  - any height: **Highmarch's walls** (the storm of Act IV);
  - **the Pilgrims' Stair** (Act VI, the switchbacks over the drop, with snow);
  - Frosthold's one wall, the Praetory's posts, Greyholt if it is ever entered.

### 2.3 The older kits, by archetype (for reference)

| Archetype | Kits (`DRESS` in src/sim/world.js) | Used in |
|---|---|---|
| Barrow, burial gallery | `dig`, `gallery`, `muster` | the Old Barrows |
| Keep, fort | `bailey`, `barracks` | Wickham Keep |
| Cave under a building | `cellar` | Wickham Keep's Old Cellars |
| Flooded chapel | `nave`, `cultcut`, `binding` | the Sunken Chapel |
| Fen island, boat hall | `mound` | Toadking's Mound |
| Canal works | `locks`, `vats` | the Canal Locks, Vat Seven |
| Abbey | `abbey` | the Drowned Abbey |
| Mine | `pithead`, `warren` | the Cold Seam |
| Compound, strongroom | `yards`, `quota`, `strongroom` | the Assay Yards, the Ninth Vault |
| Forge, foundry | `forge`, `deepforge`, `works`, `vault` | the Forgehall, the Cinderworks, the Magma Vault |
| Building inside | `tavern`, `tavern_cellar`, `crypt`, `ossuary` | the Shuttered Inn, the Haddow Crypt |
| Open air | `docks`, `ramparts` | the Old Eel Wharf, the High Ramparts (both parked) |

## 3. How the lands stand against "three and a secret"

| Land | Levels | Band dungeons | Secret | Also | Against the rule |
|---|---|---|---|---|---|
| The Hollow Vale | 1–9 | the Old Barrows, Wickham Keep, the Sunken Chapel | the Ninth Milestone (9) | the Haddow Crypt (6), the Proving Pens (a trial at 4) | **Over by one.** The Haddow Crypt sits inside Wickham Keep's band (4–6). |
| The Greywater Fens | 10–18 | Toadking's Mound, the Canal Locks, the Drowned Abbey | the Reedholm Undercroft (18) | the Mere Tower (no XP); the Old Eel Wharf (parked) | Keeps it. |
| The Cinder Reach | 19–30 | the Cold Seam, the Assay Yards, the Cinderworks (Oruth's Forgehall its first floor) | the Ninth Vault (30) | the Shuttered Inn (20); the High Ramparts (parked) | **Keeps it** (v1.144: three bands of four). The Shuttered Inn sits inside the Cold Seam's band. |
| The Tidemark | 30–45 | (not built) | the Sister's Cabin (canon) | | Three bands of five, §4.4. |
| The Greenwood | 45–60 | (not built) | the First Barn (canon) | | Three bands of five, §4.5. |
| The Pale Heights | 60–75 | (not built) | (none named) | the Ember Throne finale (73–75), the Undervaults | Three bands of four and the finale, §4.6. |

**A proposal for the extras: "side vaults".** The Haddow Crypt and the Shuttered Inn are a different thing from a band
dungeon:

- one floor on the template;
- one level, inside a band;
- sent to by an errand.

Proposed rule, for the GDD if the owner takes it:

- **At most one side vault a land.**
- It is **opened by its errand**.
- It **seals after its end room is cleared**, as a secret does (`SECRET_REST`). It is a visit, not a second farm, so
  *one dungeon a level* holds.

Without this rule, the Haddow Crypt and the Shuttered Inn each break *one dungeon a level*, and one of them should be
parked again.

## 4. Region by region

Each land below has:

- up to three band dungeons and its secret;
- each dungeon's archetype and the kits that dress it (**built**, **reused**, or **new**);
- the act chapter it carries;
- the person by the way in who names the floors (GDD §10: "someone by the way in who names the floors"), always an
  existing canon person.

Acts IV to VI have six chapters each (world doc §6, "six chapters an act"). The beats below are proposed chapter
placements, not written chapters. Any line a player reads goes through [copy-voice.md](./copy-voice.md) when it is
written.

### 4.1 The Hollow Vale (1–9, Act I, built)

| | Dungeon | Archetype | Kits |
|---|---|---|---|
| 1–3 | The Old Barrows | barrow | built |
| 4–6 | Wickham Keep | keep, then a cave | built |
| 7–9 | The Sunken Chapel | flooded chapel | built |
| secret, 9 | The Ninth Milestone | strongroom | built |
| side vault, 6 | The Haddow Crypt | family vault | **crypt, ossuary** (built) |

- **The weave.** The Haddow Crypt has its place (the Haddows' chantry east of the lumber camp) but no errand yet. It
  fits Act I's spine: the Ashbound risen in a wool family's vault is what happens wherever the Cult's sparks were
  carried past the bound (Ilse, *The Standard*).
- **Proposed errand:** from **Tobin Hask**, who keeps the dead's names in a book and would want the Haddows' put
  down too. The errand opens the crypt as a side vault.

### 4.2 The Greywater Fens (10–18, Act II, built)

| | Dungeon | Archetype | Kits |
|---|---|---|---|
| 10–12 | Toadking's Mound | fen island, boat hall | built |
| 13–15 | The Canal Locks | canal works | built |
| 16–18 | The Drowned Abbey | abbey | built |
| secret, 18 | The Reedholm Undercroft | copy-room, scriptorium | built (procedural) |
| side vault (optional), 12 | The Old Eel Wharf | wharf | **docks** (built) |

- **The weave.**
  - The docks kit's real home is the Tidemark (§4.4).
  - In the Fens it could stay as the side vault: Saltmere's eel-men's old wharf on the canal, the Abbey's drowned come
    up the canal into it. The errand would come from **Dace Pike**, who writes down what everyone owes.
- **Recommendation:** keep it parked. It is the kit's proving ground. Its rooms become the Drowned Mole's first floor,
  so the kit's first real place is the Tidemark.
- **A re-dress later.** The Reedholm Undercroft (the binding clergy's copy-room) is drawn by the generic generator. The
  tavern kit's shelves and boards, with the crypt's stone, would give it a scriptorium's look.

### 4.3 The Cinder Reach (19–30, Act III, built)

| | Dungeon | Archetype | Kits |
|---|---|---|---|
| 19–22 | The Cold Seam | mine | built |
| 23–26 | The Assay Yards | compound | built |
| 27–30 | The Cinderworks: Oruth's Forgehall (floor 1), the Furnace Hall and the Magma Vault (floor 2) | forge hall, then foundry | built |
| secret, 30 | The Ninth Vault | strongroom | built |
| side vault, 20 | The Shuttered Inn | inn | **tavern** (built) |

- **The rule: three, done (v1.144).** The owner chose (b): "Make the reach as 3 dungeons". The Reach is three bands
  of four, two levels a floor:
  - the Cold Seam 19–22, the Assay Yards 23–26;
  - the Cinderworks 27–30, with Oruth's Forgehall as its first floor (Oruth at the bottom of it, 28) and the Furnace
    Hall, the Magma Vault and Furnace Nine as its second (Morrow Vane holds the Furnace Hall at 29, the Stoker the
    vault's end at 30).

  The Forgehall's own door on the Ashwater is walled up (the Assay dug in from the works). The chapters keep their
  beats; their levels and directions moved with the bands (*Paid by Weight* 23, *Gone Back to Work* 27, *Night Shift*
  29), and the shaman's trial at 24 went to the Assay Yards' sheds. Saves from before (v58) send a hero standing in
  the Forgehall to the Cinderworks' door.
- **The High Ramparts** don't belong in the Reach: no walled town stands high there (Ashgate's wall is on flat ground).
  Its kit moves to the Tidemark and the Heights, and the site stays parked.
- **The Shuttered Inn's errand** exists in its place (Nan Ruddock's Redhand off the yards' gates). It is the land's one
  side vault.

### 4.4 The Tidemark (31–45, Act IV, *The Seventh Voice*): proposed

These are three bands of five. Every site name is canon (world doc §3.7).

| | Dungeon | Archetype | Kits | Chapter beat |
|---|---|---|---|---|
| 31–35 | **The Drowned Mole**, the sunken imperial harbour | sunken harbour | **docks** (reused) for the wharf floor; **new `mole`** for the stone quays at low tide, the old moles' stone and weed, wrecks on their sides | Lucan raises the drowned fleet here. The drowned sailors under his orders. The Grace (the region boss) holds station off it. |
| 36–40 | **The Gull Isles**, Admiral Hesk's anchorage | corsair hold: a sea cave and hulks | **new `hulk`** (a ship's inside: the tavern kit's timber laid as decks and ribs, hammocks, the rowboat's hull pieces); the `cellar` cave with the docks' water | The Gull Fleet's corsairs, Admiral Grell Hesk and his commission. Who pays it is the act's thread to Highmarch. |
| 41–45 | **Highmarch**: the walls, then the Seventh's Palace | walled city, then palace | **ramparts** (reused) for floor 1, the storm the reference shows; **new `palace`** for floor 2 (the crypt kit's stone and arcade, the tavern kit's furniture, banners, a throne room) | "The company storms Highmarch." Lucan Varro in his palace, **beaten, not killed**: like Morrow Vane, the fight ends him without a death. He finds the Kindler's letters on his own table. |
| secret, 45 | **The Sister's Cabin**, the wreck of *Aurelle's Grace* (canon, hidden) | wreck | `hulk` (new) with the crypt kit's reliquary pieces | Opened by the Tidemark's Chronicle set. Livia's crew's ship, with the Grace's crew holding station outside it. |

- **Not dungeons:**
  - **Brine Cross** is a story set piece: the League holds the bridge, and Old Gannet breaks his own lamp and the
    drowned lie down. It suits a raid or a held position on the overland.
  - **The Lamp Fort** (Old Gannet's light) is an ally's place, a candidate for the land's one side vault: a coast fort
    on the ramparts kit, with the Gull Fleet at its door.
- **By the way in:**
  - the Mole: **Sister Maren** (the Tidemark's found companion, chaplain on the quays);
  - the Isles: **Hester Quaile** (harbourmistress);
  - Highmarch: the League's people at Brine Cross.

### 4.5 The Greenwood (46–60, Act V, *The Unpaid*): proposed

These are three bands of five. Every site name is canon (world doc §3.8).

| | Dungeon | Archetype | Kits | Chapter beat |
|---|---|---|---|---|
| 46–50 | **Hollin Ford Barn**, the barn the clans keep shut | tithe-granary | **new `granary`**: the tavern kit's timber (posts, beams, pegs, hanging stores) as a barn, and the crypt kit's rows laid as the dead "in rows like sheaves", a reeve's desk and the tithe-lamp | The clans' grandparents. A clan short of grain sells them a cart at a time. |
| 51–55 | **The Tally-House**, the Tithe-Reeve's counting-house | counting house | **new `counting`**: the tavern interior with the Reach's ledger pieces (`desk`, `shelf`, `ledgers`, `strongbox`), tallymen at the desks | The arrears: three hundred years of them, and the living taken to make up the count. |
| 56–60 | **The Root Granary**, under the great oaks | root vault | **new `rootvault`**: the crypt kit's vault with oak roots grown through its arcade and down its walls | The company opens it and the Unpaid lie down. The Tithe-Reeve in the last hall. The Unpaid themselves are the land's region boss (§10.2), repeatable. |
| secret, 60 | **The First Barn** (canon, hidden) | the first tithe-granary | `granary` (new), oldest and plainest | Opened by the Greenwood's Chronicle set. |

- **Not dungeons:** the Charcoal Clearing, the Antler Stones and the Thornway are overland places and spawn points.
  The Charcoal Clearing is where Nan Ruddock lifts the sacking off a cart, a story beat in the open.
- **By the way in:**
  - the Barn: **Moth** (the found companion);
  - the Tally-House: **Thane Ivo**;
  - the Root Granary: **Grandmother Yew**;
  - **Lirien**, who comes every seventy years to see whether the barns are open yet, is the natural keeper of the
    secret's door.

### 4.6 The Pale Heights (61–72, then the Throne, Act VI): proposed

These are three bands of four, then the finale at 73–75. Every site name is canon (world doc §3.4) unless marked.

| | Dungeon | Archetype | Kits | Chapter beat |
|---|---|---|---|---|
| 61–64 | **The Pilgrims' Stair** | ascent | **ramparts** (reused): the terrace over the drop, the wall's face into the fog, towers out in the mist, now switchbacks of cut stair with snow on the treads and frost on the parapet | "Up the Pilgrims' Stair after Lucan, with the Redhand turning to hold it behind you." Frost revenants, the glass-touched. |
| 65–68 | **The Soulcracks** | glass canyon | the existing `chasm` theme with **new `glasscrack`**: the crater's black glass along the split, pilgrims fused into it | The canyon the Fall split open. |
| 69–72 | **The Praetory**, then **the Glass Keep** | fortress, then glass palace | floor 1 the `barracks` kit (built) with ice and the ramparts' parapets: the Empress's bound guard at their posts. Floor 2 **new `glasskeep`**: the crypt kit's vault and arcade in black glass | At the Glass Keep, Aurelle's last letter (the reveal). The Glass Legate. |
| 73–75 | **The Ember Throne** (finale, world doc §3.5) | throne, rune plates | **new `runeplate`** (planned separately) | The Kindler and the vessel. Lucan sings the last verse. |
| secret, 75 | **The Hospice Charnel** **(proposal)**, under the Frozen Hospice | charnel | **ossuary** (reused) with snow at the door and ice on the bones | The Heights' Chronicle set opens it: the pilgrims who never went home, kept by the monks. The Heights have no hidden site in canon yet, so this goes to the world doc first if taken. |

- **Not dungeons:**
  - **The Lip** holds the First Pilgrim, the land's region boss, as a ring fight on the overland like the Kingstone.
  - **The Undervaults** are the post-game descent.
- **By the way in:**
  - the Stair: **Sister Hild** (the Hospice's infirmarian);
  - the Praetory: **Brother Cobb**, a Praetorian's grandson, who keeps the barracks' keys;
  - the Soulcracks: **Prior Anselm**.

### 4.7 Solmere (from 15, side quests only)

Solmere has no band (it has the Bowl, the Mere Tower and the Great Beacon). Two side places the new kits make cheap,
for "Solmere's own trouble":

- the **dry quays**, standing "over mud" twenty feet above the Mere: the **docks** kit with the water gone and mud
  under the piles;
- **the Grand Archive's lost wing**: the `counting` kit (new) in the crypt's stone.

Both are optional, and both use the side-vault rule.

## 5. The archetypes still to build

Ordered by how much of them already exists.

| New kit | Archetype | Where | Built from | New pieces | Size |
|---|---|---|---|---|---|
| `mole` | sunken harbour | the Drowned Mole | docks (water, mist, piles, lamps) + ashlar | stone quay steps, mooring rings, weed bands, a wreck on its side | S |
| `granary` | tithe-granary | Hollin Ford Barn, the First Barn | tavern (timber) + crypt (rows) | sheaf-rows of the laid dead, a reeve's desk, the tithe-lamp, a threshing floor | S |
| `counting` | counting house | the Tally-House, the Archive's wing | tavern interior + `desk`, `shelf`, `ledgers`, `strongbox` | tally-boards, chained tallymen's desks, a ledger wall | S |
| `palace` | palace hall | the Seventh's Palace | crypt (stone, arcade, piers) + tavern (furniture) | banners, a dais and chair of state, long tables, tapestry boards | M |
| `hulk` | ship's inside | the Gull Isles, the Sister's Cabin | tavern (timber) + rowboat (hull) + docks (water) | ribs and knees, a sloped deck, hammocks, gun ports, a hold ladder | M |
| `rootvault` | root vault | the Root Granary | crypt (vault, arcade) | oak roots through the walls and floor, root curtains, earth falls | M |
| `glasskeep` | glass palace | the Glass Keep | crypt (vault, piers, plaques) | black-glass materials, a frozen court, Aurelle's writing table | M |
| `glasscrack` | glass canyon | the Soulcracks | `chasm` theme, ramparts' drop and fog | glass shelves and spires, fused pilgrims | M |
| (ramparts, snow) | ascent | the Pilgrims' Stair | ramparts as it stands | snow on treads, ice on the parapet, prayer posts, switchback stairs | S |
| `runeplate` | the Throne | the Ember Throne | (its own plan) | rune plates, the pit, the vessel | L |

**Effort.** "S" is a kit on the template in about a day, from pieces that already exist. "M" needs a new set of pieces
and critic rounds against a reference. Each new kit wants a reference image from the owner, as the four new ones had.

## 6. Where the four new kits go

| Kit | Vale | Fens | Reach | Tidemark | Greenwood | Heights | Solmere |
|---|---|---|---|---|---|---|---|
| tavern | | Undercroft re-dress | **the Shuttered Inn** | `hulk`, `palace` (furniture) | `granary`, `counting` | | `counting` |
| crypt, ossuary | **the Haddow Crypt** | Undercroft re-dress | | `palace`, the Sister's Cabin | `rootvault`, `granary` (rows) | `glasskeep`, the Hospice Charnel | the Archive's wing |
| docks | | the Old Eel Wharf (parked) | | **the Drowned Mole**, the Gull Isles | | | the dry quays |
| ramparts | | | the High Ramparts (parked) | **Highmarch's walls**, the Lamp Fort | | **the Pilgrims' Stair**, the Praetory | |

## 7. For the owner to decide

1. **Side vaults:** take the rule in §3 (one a land, one floor, opened by its errand, sealed after), or park the
   Haddow Crypt and the Shuttered Inn back out of the bands.
2. **The Reach's four:** keep them as the exception (recommended), or re-cut them into three bands of four.
3. **The later lands' bands:** three bands of five in the Tidemark and the Greenwood, and three of four plus the Throne
   in the Heights, as §4 proposes.
4. **The Heights' secret:** the Hospice Charnel (proposal), or another place written into the world doc.
5. **The Old Eel Wharf:** stays parked and gives its rooms to the Drowned Mole (recommended), or becomes the Fens'
   side vault.
6. **References** for the new kits in §5, starting with the Tidemark's: a sunken stone harbour (`mole`), a ship's
   inside (`hulk`), a palace hall (`palace`).

## 8. Order of work, if this is taken

1. **Finish the two trials.** Run the docks and ramparts critic rounds to 8 or better. They are the Tidemark's first
   and last floors.
2. **Canon.** Write the Tidemark's three, its side vault and its six chapters into the world doc, then the GDD's band
   table.
3. **Build the cheap kits first.** Build `mole` and `granary` on the template, then `palace` and `hulk` with
   references.
4. **Build the Tidemark** as the Reach was built (reach-plan.md): plans, foes, bosses and mechanics, the smoke
   contract at its band tops, chapters.
