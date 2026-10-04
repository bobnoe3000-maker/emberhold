# M8 — The Greywater Fens: plan

**2026-10-04 · Plan of record for M8** (development plan §3). The goal: levels 8–15 playable from start to finish,
Act II, *The Drowned Abbey*, continuing straight from Act I. The canon these slices use is world doc v1.20 §3.2, §6
and §7, and GDD v1.23 §17. As in M5, each slice lands as its own commit, with tests, balance runs where numbers
move, and doc updates. The owner asked for **art, story and quest critic passes** along the way: each slice that
adds art, words or quests ends with its pass (below), and the last slice gathers them.

## What M8 adds

| | Before M8 | After M8 |
|---|---|---|
| Regions you can walk | the Hollow Vale | + **the Greywater Fens**, south of the Vale by the canal road, opened by Act I's end |
| Towns | Thornwick | + **Saltmere**, the Fens' waystation: stilts over the bog, a tavern with the board and the Grey Sisters' chapel |
| Sites | 6 in the Vale | + Toadking's Mound, the Canal Locks, the Sickpools, the Drowned Abbey, and the hidden Reedholm Undercroft |
| Enemy families | Ashbound, Redhand, Cult acolyte, hill goblins | + fen ghouls, bog-witches, Cult harvesters (with lantern-cages), the Toadking's reed-cutters, the drowned clergy |
| Bosses | Garrow, the Stranger, the Standard, Old Skarn | + the Toadking, Brother Teague, the Abbess Below, and the Drowned Choir (repeatable) |
| Story | Act I | + Act II, six chapters, with the Kindler met at the Locks |
| Companions | Brannoc | + **Wren**, a found rogue, and her chain (3 quests) |
| Rules | — | **lamps** (the Standard's, the choir-lamp), **cages**, **the count** (lamps broken, souls freed); a first **ground hazard** |
| Trials | level 6 | + the **level-12 trials** (the 12s have been unlocked by level until now) |
| Chronicle | the Vale set | + the Fens set (10), whose last fragment reveals the Undercroft and its heirloom |
| Balance | gates at 1, 3, 6, 9 | + 12 and 15 |

## What the code needs first (from a read of the Vale, 2026-10-04)

- **Region isn't state.** `createSim` takes `region` once and never saves it; the overland is always the Vale
  (`createOutdoor` ignores `region`); there's no way between regions. Homeward, defeat, the compass's labels, the
  board, the journal's story status, the Chronicle's set names, the slot card, the defeat screen and the minimap's
  colours all assume the Vale.
- **Every town is the same walled five-service hub.** Saltmere is a waystation: two services, no wall, on stilts.
- **No boss mechanic heals through cages; no ground hazard exists.**
- **Loot has no per-region tables**: item level is the lever, and that carries over as it is.

## Slices

1. **Regions as state, and the canal road.**
   - `state.region` ('vale' | 'fens'), durable, in `snapshot()` / `restore()`; **save v18**, older saves are in the
     Vale.
   - `createOutdoor` builds the region's overland; `travel` crosses between regions at a **region exit** (the
     Vale's south edge ↔ the Fens' north edge, the canal road). The road south is shut until Act I is done
     (*"The canal road's flooded past the mill. Ilse says there's a way, when you've a reason."*).
   - The region's town: Homeward and defeat go to **Saltmere** in the Fens (it has a chapel), Thornwick in the Vale.
   - Generalise the Vale's hard-codes: the compass labels, `board.js`'s site and region, `storystatus.js` by act,
     the journal's set names, the slot card, the defeat screen's temple, the minimap's colours, `road.js` (the
     Vale only), the HUD's road fetch.
   - Dev: `?region=fens&scene=overland`. Tests: the region survives a save round trip; the road is shut, then open;
     crossing both ways lands at the other side's arrival; old saves load in the Vale.
   - **Done** (2026-10-04): `src/sim/regions.js` (`LANDS`), `core.js` (`state.region`, `landOpen`, the `landShut`
     event), `persist/save.js` (v18), `travel.js`, `heroes.js` / `smith.js` / `board.js` (services by kind),
     `ui/townmenu.js`, `slots.js`, `journal.js`, `defeat.js`; `test/regions.test.mjs`. The shut road's word is
     Ilse's: *"The canal road's under water past the barrows. Sister Ilse says there's a way through, when you've a
     reason to go."* (it leaves the barrows road, not the mill's). `storystatus.js` by act waits for Act II (slice 7).
2. **The Fens overland and Saltmere.** Art.
   - **Swamp ground** in `outdoorpaint.js`: bog water (still, a faint sheen), peat, reed beds (the grass tuft,
     taller), duckweed (region-towns proposal: Saltmere, Hollin Ford and Tollhaven's salt marsh share it).
   - **The Fens overland**: the drowned canal ruled straight through the bog with the canal road along it, reed
     beds, alder carr, dead trees, the sites' landmarks; Reedholm's priory on a rise as a landmark.
   - **Saltmere**, built by a new `buildWaystation`: stilt houses, boardwalks, the square a deck on piles, the
     *Drowned Eel* and the chapel where a town's tavern and temple stand, a rainwater cistern for the well, punts,
     eel traps, marsh-lights (presentation only).
   - Bakes: stilt houses, the deck and boardwalks (walkable, like the bridge), reeds, dead trees, the site
     landmarks. Never hand-edited.
   - **Art critic pass**: before/after captures by day and at dusk at in-game scale; luma and contrast against the
     Vale (it must stay dusky); readability of the walkable boardwalks; a contact sheet.
   - **Done** (2026-10-04): `src/sim/outdoor.js` (`buildFens`, `buildWaystation`, `G.MARSH` / `POOL` / `DECK`),
     `src/render/outdoorpaint.js` (`marsh`, `pool`, `deck`, `canal`), `palette.js`; bakes `fens_stilt_1–3`,
     `fens_stilttavern_1`, `fens_cistern_1`, `fens_punt_1`, `fens_eeltrap_1` (`tools/actor-lab/buildkit.js`,
     `town.json`). The pass: [fens-critic-pass.md](./fens-critic-pass.md) §1. **Marsh-lights move to slice 4**,
     with the bog-witch's lantern: both want a drifting light.
3. **The Fens' sites as data.** `SITES` and `content/sites/`:

   | Site | Levels | Floors | Family | Boss | Theme |
   |---|---|---|---|---|---|
   | Toadking's Mound | 8–11 | 2 | reed-cutters + fen ghouls | the Toadking, floor 2 hall | `earth`, boat-hall furniture |
   | The Canal Locks | 9–12 | 2 | Ashbound (the bound lock-men) + Cult | none; the Sluice holds the chapter | `water` |
   | The Sickpools | 10–13 | 2 | Cult harvesters + fen ghouls + bog-witches | none; Vat Seven | `poison` |
   | The Drowned Abbey | 12–15 | 3 | the drowned clergy + Cult | Brother Teague (floor 2), the Abbess Below (floor 3, the choir-lamp) | `water`, choir furniture |
   | The Reedholm Undercroft | 15 | 1 | Ashbound | none; the vault | hidden until the Fens set is whole |

   The Drowned Choir is the Abbey's repeatable echo once the Abbess has fallen. Tests: content ↔ table, bands,
   exits.
   - **Done** (2026-10-04): `src/sim/sites.js` (each site's `region`; the Fens' five, their families the Vale's
     stand-ins until slice 4, their halls bossless until slice 6; `levelBand` reads the room count, so the Abbey's three
     floors of four rooms read 12–15), `level.js` (themes `mire`, `water`, `sluice`), `tilestyles.js` (the
     **drowned** look), `outdoor.js` (`buildFens`: the landmarks, roads to their doors, ways in and arrivals),
     `core.js` (a site's floors are in its land), `content/sites/*.json`; `test/sites.test.mjs`. The Locks are
     `sluice` (flagstone), not `water`, so they don't read as the Abbey. Art pass: [fens-critic-pass.md](./fens-critic-pass.md) §2.
     Saltmere's board still posts jobs at the Old Barrows; jobs by region come with Saltmere's people (slice 8).

4. **The Fens' foes.** Mirroring the Ashbound roles, as the Redhand and goblins did.
   - **Fen ghoul** (melee, a new silhouette: long-armed, hunched, mud-dark), **bog-witch** (caster, a new
     silhouette: a hag in sacking with a lantern of marsh-light), **harvester** (a Cult acolyte carrying a
     lantern-cage on a pole), **reed-cutter** (a Redhand recolour with a bill-hook), **the drowned clergy**
     (Ashbound recolours in sodden grey habits, waterweed).
   - Bakes, the Stage lineup, `ENEMY_ACTOR`, swing profiles; `test/fens-foes.test.mjs`.
   - **Marsh-lights** (moved here from slice 2): a drifting point of pale light over the meres at dusk and night,
     presentation only, the same path as the bog-witch's lantern.
   - **Done** (2026-10-04): `src/sim/battle.js` (kinds `fenghoul`, `reedcutter`, `fowler`, `bogwitch`, `harvester`,
     `drowned`, `cantor`; families `reedmen`, `lockcult`, `harvest`, `drowned`), `sites.js`, `world.js` (their rooms'
     dressing); bakes `fen_ghoul`, `bog_witch`, `reed_cutter`, `reed_fowler`, `cult_harvester`, `drowned_brother`,
     `drowned_cantor` (`tools/actor-lab`: `variants.json`, `bake.json`, `faces.json`, `props.js` billhook, cagepole,
     marshlamp, crook, habit, reedhat; `lab.js` the `frame` knob); `renderer.js`, `fx.js` (styles, `wisps`),
     `gsprite.js` (GLOW_ID 10, marsh), `audio/cues.js`, `dev/stage.js`, `content/foes.json`; `test/fens-foes.test.mjs`.
     World doc v1.21 §8, GDD v1.25 §3. Art pass and balance: [fens-critic-pass.md](./fens-critic-pass.md) §3. The fowler
     (a reed-cutter with a fowling crossbow) fills the family's ranged slot.
   - **Art critic pass** on the Stage: silhouettes against the Vale's cast, their faces, readability at 56 px.
5. **Lamps, cages and the count** (GDD §17).
   - **A lamp** is an object in a site's last room with the list of foes tied to it, held by its keeper. While
     the keeper stands it can't be struck; once broken, every foe on its list lies down and the room falls quiet.
     The Standard of the Third Legion becomes the first: it carries the legion's lamp.
   - **Cages**: a harvester's cage drops when the harvester falls; breaking it frees one soul.
   - **The count**: `state.count = { lamps, souls }`, durable, added to only by these rules (a bound foe put down,
     a cage, a lamp); **save v19** with a migration that credits a save that already broke the Standard.
   - The Chronicle tab shows the count at its head; Ilse remarks on it.
   - Tests: a lamp can't be struck while its keeper stands; breaking it lays its list down; the count's sources and
     its exclusions (the living, beasts); the migration; no command sets it.
6. **Bosses and the first ground hazard.**
   - **One ground-hazard system** (GDD §17): patches on the floor with an effect and a lifetime, and the party's
     AI steps out of them.
   - **The Toadking** — *Mud*: he calls up slowing mud round the party every 10 s.
   - **Brother Teague** — *The Cage*: he carries a lantern-cage that mends him while it's lit; break the cage
     (tap to focus) and he can be hurt properly.
   - **The Abbess Below** — *The Bells*: each bell raises the water from the hall's edges, slowing whoever stands
     in it and taking the floor's edges. Her lamp breaks with her (slice 5).
   - **The Drowned Choir** — *Vespers*: its song mends the drowned while its cantor stands.
   - Heirlooms (world doc §10.2: *Vespers — "Sung in water, heard in bone."*; the others written in the story pass).
     `tools/balance/boss.mjs` at each hall's level: each falls to a party at its level, 3 of 3.
7. **Act II, *The Drowned Abbey*.** Six chapters, Ink for every beat (world doc §6):
   1. *Fog on the Canal* (8–10): Ilse sends the company south; in Saltmere, **Wren** knows where the Cult's boats
      go at night: the Toadking rents them berths. Put the Toadking down; his berth-book names the Locks.
   2. *The Locks* (10–11): a Cult boat moored at the Canal Locks, and a courteous man in its bows preaching to the
      eel-fishers. **The Kindler**, met as a non-hostile figure who talks and leaves. Then hold the Sluice.
   3. *The Sickpools* (11–12): the Cult is draining the vats. Break the harvesters' cages in the Sickpools.
   4. *The Bells* (12–13): the Drowned Abbey. Brother Teague at the choir's door.
   5. *The Rolls* (13–14): the Cult is stealing the binding rolls; save what's left from the Abbey's third floor and
      carry them to **Mother Agnes**, come down to Saltmere's chapel from Reedholm.
   6. *The Last Office* (14–15): the Abbess Below and her choir-lamp. Ilse lays the province's shards side by side;
      the ledgers name the Kell Assay. Act II ends, with the cost found later (the copy at Reedholm).

   Saltmere's people: Wren, **Pim Rushlight** (a side errand: Wendel's prices), Mother Agnes, the chapel's sister,
   the Drowned Eel's keeper. Ilse, Maudry and Osric each have a line for the Fens.
   - **Story critic pass**: voice (world doc §11: plain words, nobody explains the past), canon facts, the tone
     rule, the Kindler's sincerity, every line ≤ the journal's 160 characters where it's a journal line.
   - **Quest critic pass**: each chapter's objective is clear from its journal line, reachable at its level, never
     needs a backtrack the compass can't walk, hands in where the player expects, and pays like Act I.
8. **Wren.** A found rogue (world doc §5: a smuggler who owes the Cult money). Freed by the Toadking's fall: she's
   tied in his boat hall as surety for her debt. Her chain, *What's Owed*:
   1. *The Marker* — three harvester elites in the Canal Locks carry her debt's marker between them.
   2. *Night Boats* — two of her caches in the Sickpools, before the Cult finds them.
   3. *Paid in Full* — hold the Abbey's first-floor hall 5 waves while she lights the Cult's boat. Reward: a heirloom
      trinket (written in the story pass).
   - Her face is the `wren` preset already in `faces.json` (a black braid, a smirk). The tavern stops drawing *Wren*
     as a hireling's name, as it did *Brannoc* (and *Tamsin*, who is the Reach's, in M9).
9. **The level-12 trials.** The 12s have been unlocked by level since M5. Each gets a trial and a teacher, as the
   6s did: fighter (Osric, *The Long Watch*), rogue (Wren, *Dead Water*), mage (Pim Rushlight, *Lamp Oil*: a
   chandler knows fire), cleric (Mother Agnes, *Vigil*), shaman (Col, *The Old Water*). Older saves count every class
   the company had at 12, so nobody loses an ability. Canon first: the teachers go in world doc §5.
10. **The Fens Chronicle.** Ten fragments (the night the canal broke; world doc §7), placed as the Vale's are; the
    last reveals the Reedholm Undercroft, whose vault holds the set's heirloom. Ilse reads them all; Mother Agnes has
    a line for the set whole.
11. **Loot, balance and the golden path.**
    - The room-level harness at each site's band, solo and party; the boss harness at each hall.
    - The smoke gates add 12 and 15 (the right party holds a same-level room 10+ waves, nobody Fallen in the first
      five; a lone hero is down within 2 waves).
    - The headless farm at 12 and 15 against the §2.7 targets.
    - `test/m8-golden.test.mjs` plays Act II headless after Act I: the road south, the chapters, Wren and her chain,
      a level-12 trial, the count, the set and the vault, and a save round trip. The browser test walks the first
      chapter: Ilse → the canal road → Saltmere → Wren.
12. **The critic passes, gathered.** `docs/fens-critic-pass.md`: the art, story and quest passes from each slice,
    what each found, what changed, and the before/after numbers.
13. **Then the Solmere shell** (development plan M8): the Lamphall and the Mere Tower, played offline. Planned in
    its own document when the Fens are done.

## Decisions

- **Thornwick stays the base**, and Saltmere is a waystation, as the owner decided. Saltmere has the chapel, so a
  company beaten in the Fens wakes there, not a day's walk away.
- **Region is the sim's**, saved with the game, so a replay knows where it is.
- **Wren is a woman** in this plan: a smuggler, quick and practical. (Canon says only "a smuggler"; set in world
  doc §5 with her chain.)
- **The Kindler doesn't fight in Act II.** He's met, and he leaves. The player can't stop him yet, and shouldn't be
  able to try.
