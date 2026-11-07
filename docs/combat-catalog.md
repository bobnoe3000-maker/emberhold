# Combat catalog: every skill and effect, ours and Luminati's

**Current (2026-11-07). Kept up to date: a new skill, move or effect adds its row here in the same change.**

The owner, 2026-11-07:

> "any issues if we move to the [Luminati] fighting rules, skills and effects - what would change? We would want to build
> a complete catalog of skills and fx from both sets, and we will eventually expand and improve on these"

This doc has six parts:
- **A.** What moving to Luminati's fighting rules would change, and what we recommend.
- **B.** The two sets side by side, by theme: where each is strong, and what is missing on both sides.
- **C.** The gaps and quirks the survey found.
- **D.** How to keep this doc current.
- **E.** The full inventory of Emberfall's combat.
- **F.** The full inventory of Luminati's combat.

Both inventories were read from the code:
- Emberfall's from this repository.
- Luminati's from its pinned checkout `80e1aa6`, which `node tools/lumina/build.mjs` clones into `tools/lumina/.work/luminati/`. The paths in Part F are relative to that checkout's `src/`.

Units:
- Emberfall measures distance in **tiles**. Luminati measures it in world units, **u**. On our Luminati renderer, 1 u = 2 tiles (`hybrid.js` halves tile positions).
- Luminati counts time in 60 Hz frames, **f**. Emberfall counts it in seconds.

---

## A. Moving to Luminati's fighting rules: what would change

Luminati's rules fight a different game from ours, so moving to them would replace Emberfall's core. Its effects are a separate question: they could be drawn over our own rules. That second option keeps everything below working.

| Area | Emberfall now | Luminati | What moving would mean |
|---|---|---|---|
| **Who fights** | A one-thumb **autobattler** (GDD §3.4). You steer, pick a focus target, set a stance and walk out to leave. The leader fights by itself half a second after you let go. No potions (v1.13); healing is the cleric's. | An **action RPG**. You play the hero: a three-hit combo, a dodge roll with invulnerable frames, a perfect dodge, lock-on, three skill buttons and a Healing Draught. The companions are AI. | **The genre changes.** A phone screen needs about seven buttons plus the stick. The Auto button we built for the prototype is a stand-in that presses the skills in turn, not a design. Stance, focus and "walking out is the retreat" lose their place. |
| **Determinism and fair play** (AGENTS.md rules 1 and 3; GDD §12) | The sim is headless, runs under plain node and is bit-exact. Maths go through `detmath`, and every random draw has its own seeded stream. The server replays each session's commands. Time away is fast-forwarded by the same sim. | Its RNG is seeded mulberry32, which is fine. But gameplay paths use the engine's `Math.hypot`, `sin`, `cos`, `atan2` and `**` (about 650 calls across combat and party), which can differ between engines. Each frame is split into sub-steps sized by the frame time, so results depend on frame rate. Gameplay reads the **camera**: a foe winds up only while on screen (`canWindup`), and moves are camera-relative. It needs three.js, Sprite3D and the TileMap to run. | **Server verification and offline progress both stop working.** To get them back we'd have to rewrite Luminati's combat core onto `detmath`, a fixed step and no camera. At that point it would be our sim with Luminati's numbers. |
| **Online** (Colyseus, 20 Hz, server-authoritative) | Commands in, state deltas out. Nothing depends on reaction time. | Invulnerable frames 1–13 at 60 Hz and an 8-frame perfect-dodge window. | Live play would need client prediction and rollback. A 20 Hz server can't judge a 133 ms dodge. |
| **The balance contract** (AGENTS.md rule 6; GDD §7.1) | 7 gates in the smoke test, plus the `roomlv`, `boss`, `loot`, `tower` and `frontier` harnesses, all on `battle.js`. Rooms, waves, the tide and room levels. | Groups placed on the map. A fall wakes you at the waystone, and a rest there brings every foe back. No waves. | **Every gate and every harness rebuilt.** The room-and-wave loop at the heart of the GDD has no counterpart. |
| **Progression** | 5 classes × 3 skills and a passive, trials at levels 6 and 12, ranks 1–5, attributes, Rare gear mods, stances, sellsword perks (§E.1). | Three player kits of 3 skills each. The traveler opens them by level 4; the level cap is 10. Six party classes with 1–2 skills each. No gear stats on skills. | **Classes don't map one to one.** Rogue and shaman have no counterpart: Luminati's ranger is a bow, and nothing drains or hexes. Our mage splits into their mystic and ice mage. Trials, ranks and perks would need to be re-made. |
| **Death** | Downed twice in one visit makes a member Fallen. A temple raises them; a wipe leaves the party Weakened (the M3 tests). | Wake at the last waystone. A rest there brings every foe back. | The M3 rules, their browser test and the save fields would all change. |
| **Foes and bosses** | 20 foe kinds and 10 bosses, plus 10 tower wardens, with mechanics in the sim (§E.3). | 23 kinds with fuller move sets and a strict telegraph grammar, plus 6 bosses with phases and arenas (§F.3). | All our foes would have to be rewritten as Luminati AI, or theirs adopted, which changes the world's canon. |
| **Renderers** | Effects are drawn into the emissive plane, which **both** renderers show. Emberlit is the default (A2). | Effects are 3D quads, lights and meshes in the three.js scene. | Emberlit couldn't draw them. Luminati would become the only renderer: the phone budget question, and architecture decision A2 retired. A17 runs only Luminati's engine and world layers, so this needs a new decision row. |
| **Save, tests, docs** | 478 node tests, replay parity between Chromium, WebKit and Node, smoke tamper cases. | Its own browser bot digests. | A save migration, and most of the tests rewritten. |
| **Licence** | – | MIT, pinned at `80e1aa6`. | Not a blocker. But changing its combat means forking it: today we rebuild from the pin and never edit it. |

**What Luminati would bring:**
- The feel of a hit: hit-stop, poise, knockdown, super armour.
- A telegraph grammar for every foe attack: markers that fill, lanes that lock.
- The five hero spell packages: Holy, Ice, Earth, Swordmaster and Bellwarden. They have real lights and 3D pieces (ice crystals, rock spikes, spectral blades and bells, a ward dome).
- Foes and bosses with fuller move sets.

All of that can be had **without** taking its rules.

### Recommendation: keep our rules, mine theirs

1. **Moves become sim rules.** A Luminati move we want becomes a skill in `skills.js` and `battle.js`, written in `detmath` with its own stream and sized in tiles. Its numbers go through the room-level harness like any balance change. Part B marks the candidates.
2. **Looks become presentation.**
   - **On Emberlit:** `skillfx.js` stays.
   - **On Luminati:** a bridge in `tools/render3d/world.js` plays Luminati's own effect packages from our `skill` events:
     - FxQuads, GroundMarkers and VfxLights;
     - the 3D pieces, for example the Tomb's crystals for Frost Nova, Judgement's pillars for Turn Undead and the ward dome for Shield Wall.

     That needs a decision row extending A17.
   - **Timing:** the sim stays the clock. A moment starts on the sim's cast and landing, as it does now.
3. **Feel.** Hit-stop, shake tables and the telegraph grammar (markers that fill and lock) are presentation. We can adopt them on both renderers without touching the sim.
4. **New statuses, deliberately.** Stun, freeze, knockdown, pull and marks are good ideas. Each is a sim rule with a test and a balance run, added one at a time.

---

## B. The two sets by theme

Each row puts what fills a role in Emberfall next to what fills it in Luminati. The last column is the note for the next pass. ★ marks a Luminati move or look worth porting.

| Theme | Emberfall | Luminati | Next pass |
|---|---|---|---|
| A sweep round the body | **Cleave**: a crescent and a 0.65× splash within 1.8 tiles | **Whirl Slash** (traveler, two hits at r 2.2 u); **Sweep** (warden); ★ **Tempest Edge**: three hits, spectral swords orbiting | Cleave's crescent is ours. Tempest's orbiting blades are a model for a fighter rank-up or a passive's look. |
| A single strike | **Backstab**: 1.6×, +25 % crit, two crossed cuts | The **combo finisher** A3 (lane plus sector, a thrust streak); the **hammer slam** | – |
| A line or wave | none | ★ **Dragonfang Wave** (a piercing lane); **Peal** (a cone that detonates marks); Rime Lane (a foe's) | **A gap in ours.** No skill hits in a line; a fighter or rogue lane is a candidate. |
| Leap or slam | none | ★ **Skyfall Judgement** (a leap, a falling sword, a 5.5 u slam); **Earthshatter** (rock spikes); **Carillon** | **A gap in ours.** A fighter level-20 or level-24 move. |
| Fire at range | **Firebolt** (a roaring head, embers, a scorch); the mage's basic bolt | **Ember Bolt** (a splash); the mystic's bolt; ★ **Flare**, a burst 0.7 s after the cast on the target's spot | Flare's delayed burst would give the mage a second fire shape. |
| Frost | **Frost Nova**: thrown onto a group, 3.5 tiles, slow 3 s; a frost ring, spikes, rime | ★ **Glacial Tomb** (a glyph, then 3D crystals; freeze 2.5 s); ★ **Blizzard** (a storm field, ticks, chill); **Frost Lance** (chill) | The Tomb's crystals and ground frost are the best look in either set for our Frost Nova on Luminati. Blizzard is a level-20 or rank idea. |
| Holy area | **Turn Undead**: a sunburst round the cleric, undead only | ★ **Judgement**: a glyph, a ring of six pillars, then the great pillar; **Radiant Nova** | Judgement's pillars are a strong Luminati look for Turn Undead. |
| Heal one | **Mend** (a column, a mark); **Second Wind** (wind strands) | The cleric's **Mend**: stars flying from the staff, then a green column; the **Healing Draught** | Close already. Their stars-to-target travel is a nice touch. |
| Heal the party | **Ancestors' Breath**: heal over time plus ATK, rising leaves | ★ **Sanctuary**: a healing circle on the hurt, 8 ticks, and a ward on the party | A cleric idea. Ours heals continuously; theirs heals in ticks you can see. |
| Raise | **Lifeline** (the passive: once a visit, holds at 1 HP; a float only) | ★ **Revive**: kneel, a pillar of light, rise at 40 % | No raise mid-fight in ours. Design question: the GDD keeps raising for temples. |
| Ward or shield | **Arcane Ward**: points that soak damage, a dome | Ward as a damage fraction from Sanctuary and Bulwark; the **ward rings** under heroes; the cantor's ward on a foe | **Add a ward break to ours** (§C). Their ring under the feet reads better than a dome on three people. |
| Taunt or guard | **Shield Wall**: DEF ×1.5, taunt within 7 tiles, a war-cry ring, turning plates | ★ **Bulwark**: a war cry, taunt within 6 u, a 3D hex dome, a ward | Bulwark's dome and amber snap ring on each taunted foe would suit Shield Wall on Luminati. |
| Evade | **Smoke Step**: +30 dodge, foes lose the rogue, smoke | **Dodge roll**, backstep, perfect dodge with slow motion | Ours is a stat, theirs a reflex. For an autobattler, ours is right. |
| Poison, damage over time | **Venom**: ticks for 6 s, bubbles | none on foes; magma pools and holes on the ground | Ours alone. |
| Drain | **Spirit Drain**: up to 5 stacks, mends the party | none | Ours alone. |
| Curse or marks | **Hex**: −ATK and −DEF, a sigil, sinking motes | ★ **Resonance marks** (the bellwarden): 1–3 per foe, spent by Peal and Carillon for extra damage | Marks are a good shaman idea: stacks the shaman then spends. |
| Party buff | **Bless** (halo), **Breath** | none, only wards | Ours alone. |
| Something planted | none | ★ **Toll**: a spectral bell planted for 6 s that tolls every 1.5 s, pulls foes and is a safe zone | **A gap in ours.** A shaman totem fits Emberfall well. |
| Crowd control | Slow only (Frost Nova). No stun, freeze or knockdown in the sim | Chill, freeze, stun, knockdown, pull, knockback, poise, guarded and exposed | Add one at a time as sim rules (§A recommendation 4). |
| Foe telegraphs | Banners; hazard ground (mud, sluice, flood) | **A grammar**: every wind-up ≥ 18 f, markers that fill, lanes that track then lock, a white rim at the hit | Presentation only. The best single thing to adopt, on both renderers. |
| Boss mechanics | call, kindle, line, swarm, mud, cage, vespers, bells, issue, sluice (§E.3b) | phases and roars, arenas with a gate, guarded and exposed, broken, submerge, the Hush toll and warmth (§F.3) | Most of ours **draw nothing** (§C). Their roar, push ring and exposed glow are a model. |
| Hit feel | Sparks, a ground ring on heavy hits, a 160 ms camera jolt | Hit-stop (4–12 f), shake tables, the hit flash, kill and crit bonuses, combat colour grading (vignette, desaturation) | Presentation. Hit-stop must stay out of the sim clock. |

---

## C. Gaps and quirks the survey found

**Fixed (2026-11-07, the boss pass: [combat-fx.md](combat-fx.md) "The boss pass"):**
- everything under "Not drawn on the Luminati renderer" and "Mechanics that draw nothing";
- the weapon styles, and Wren's bow;
- a ward break and a level-up effect;
- a sound for each skill.

**Still open:**
- the sim quirks below;
- the docs' disagreements;
- **found on the way: the Quartermaster never issues.** His escort is down by 9.1 s, his first issue due at 10 s, so in 3
  × 90 s of fighting it never fired. Making it stand a fallen rank up, as the world doc reads and the prototype does, is a
  rules change for the owner.

What the survey found:

**Not drawn on the Luminati renderer:**
- The Abbess's flood: hybrid passes patch hazards only (`src/render3d/hybrid.js:175`).
- Teague's lantern-cage: a prop with no atlas, which hybrid skips (`:161`). Only its HP bar floats there.
- The bolt and arrow **sprites**: only their light trails, halos and bursts show.

**Mechanics that draw nothing:**
- The Quartermaster's issue (a foe made whole).
- The Choir's singing and mending.
- The Stranger's kindle.
- Skarn's drum.
- Which foes the Standard's line protects (only the boss bar shows a shield, and the Standard's line never sets it).
- Each of these has only a banner, and most of their events already carry the spot.

**No weapon style**, so no swing trail, default sparks and the default soul colour on death:
- the ten Mere Tower wardens;
- the found companions Brannoc and Wren. Wren also never gets her bow look (`memberAtlas` only swaps `hero_rogue`).

**Sim quirks** (each would be a balance change, so a harness run first):
- **Turn Undead cancels Frost Nova's slow.** It sets `slow = 0` on every foe it hits (`skills.js` `turn_undead` `slow: 0`, applied in `battle.js` utility).
- **Turn Undead is never cast at a single undead**, a lone undead boss included: it needs at least 2.
- **Smoke Step goes up only when the rogue is hurt.** It has no "threatened" trigger; only taunting guards do.
- **Frost Nova misses the mage's +20 % cluster bonus.** It resolves through utility, not `attack()`.

**Missing moments:**
- a ward break (a shatter when Arcane Ward is spent);
- a level-up effect (only a banner and a sound);
- a skill sound for each skill (every skill sounds `warcry`; the `skill` event isn't listened to).

**Docs that disagree with the code:**
- **`docs/combat-fx.md`** had three stale lines. They are corrected in this change:
  - Frost Nova is thrown, at 3.5 tiles;
  - a utility lands 0.38 s into its 0.55 s clip;
  - auras fade over 0.8 s on the party and 0.6 s on foes.
- **The GDD** has stale lines. They are listed in §E.7; any change goes to the owner first:
  - boss locations in §3 and §17;
  - Turn Undead's "every Ashbound";
  - "HP/MP pips".
- **Luminati's own COMBAT.md** disagrees with its code in places (§F.7). We don't edit it.

---

## D. Keeping it current

- **A new skill, foe ability, boss mechanic or effect** adds its row in §E (ours) or §F (a Luminati version we pin to). Where it fills a theme, it also adds a row in §B.
- **Ids are API.** Skill ids, `SKILL_MOMENTS` keys and foe kinds are named as the code names them.
- **A Luminati move ported into our sim** keeps its Luminati row and gains our row, with "from Luminati's X" in the Next pass column.
- **When the Luminati pin moves** (`tools/render3d/build.mjs`), recheck §F against the new checkout.

---

## E. Emberfall’s combat, in full

Read from this repository at the commit of this doc. The code is taken as right where it and the docs disagree.


Abbreviations used below:
- **bt** = `src/sim/battle.js`
- **sk** = `src/sim/skills.js`
- **sfx** = `src/render/skillfx.js`
- **fx** = `src/render/fx.js`
- **rr** = `src/render/renderer.js`
- **hy** = `src/render3d/hybrid.js`
- **w3** = `tools/render3d/world.js` (the source that builds the vendored Luminati world)

Units: distances in tiles, times in seconds. "×ATK" means a multiple of the caster's attack stat.

---

### E.0 Rules shared by every skill

These rules come from `sk` and `bt`.

#### Unlocks, ranks and cost
- **Unlocks.** Each class has a level-1 skill, plus level-6 and level-12 skills that need the class's trial. The level-6 trial is stored as `state.trials[cls]` and the level-12 one as `state.trials[cls+'12']` (sk:5-8, sk:76-79). The passive comes at level 20 (sk:53-59).
- **Ranks 1–5.** Each rank adds +10 % power. Ranks 3 and 5 each take 1 MP off the cost (sk:93, sk:103).
- **Strength.** `skillMult = rankPower × (1 + Rare gear power) × (1 + Focus power)` (sk:97).
- **Rare gear mods** apply only to each class's level-1 skill (Cleave, Backstab, Firebolt, Mend, Spirit Drain). A mod is either −3 MP or +15 % power (`items.js` ABILITY_OF:123 and :161, `abilityMods`:244).
- **What power scales.** Damage, the size of a buff, and the amount of a heal or ward. Durations never scale.

#### Turns and timing
- A member casts a **utility** (guard, heal, ward, nova, mend, bless, breath, hex) only when `cd ≤ 0 && act ≤ 0.12`. The hero only does so while not being steered (bt:1223-1224). The cast uses up the turn.
- `tryUtility` (bt:697) walks the member's priority list (`priorityOf`, sk:107). It skips anything locked, set to auto-cast off, or unaffordable. Otherwise a **strike** replaces the basic attack (`pickStrike`, bt:685).
- **Cast timing.** A utility sets `act = 0.55`, `cd = class interval` and `atkKind = 'heavy'`. The effect lands `WINDUP_HEAVY = 0.38 s` later (bt:248, bt:725-729).
- **Strikes** are heavy as well. The blow lands, or the bolt is released, 0.38 s in. A bolt then flies at 26 tiles/s (bt:244, bt:813-816).

#### Stances
- **AI thresholds** (STANCE_AI, bt:75):
  - "low HP" means below 0.3 (aggressive), 0.5 (balanced) or 0.65 (defensive).
  - MP reserve:
    - aggressive keeps none;
    - balanced keeps the cheapest utility's cost once anyone is below 50 %;
    - defensive keeps max(cheapest, 50 % of max MP) (bt:669-675).
- **Stat mods** (sk:69):
  - aggressive: ATK ×1.1, DEF ×0.9;
  - defensive: ATK ×0.9, DEF ×1.15.

#### Events
- **Presentation events** come from `skillEv(A, at, by, tgt, ally, reached, crit)` (bt:737). It emits a `'skill'` event carrying `{id, at:'cast'|'land', cls, by, x, y, tid, ally, tx, ty, r, reached[], crit}`.
- Every cast also emits `combat {t:'ability', name}`, which shows as a floating orange name (rr:1558).

---

### E.1 Class skills

#### Fighter
Class traits: melee, range 3.0, swings every 1.3 s, speed 6.8 (bt:48). The default look is `hero_barbarian`; the main hero may be `hero_knight`.

| id | Name | Unlock | MP | Cooldown | What it does | When the AI casts it | Effect drawn (sfx) |
|---|---|---|---|---|---|---|---|
| `cleave` | Cleave | Lv 1 | 10 | none beyond the swing (heavy) | **Strike.** 1.3×ATK on the target. Then 0.65× (×mult) **splash** on every other live foe within **1.8** of the target, not heavy (bt:800-803). Rare gear can mod it. | In place of a basic swing, when MP ≥ cost + reserve (bt:685) | `cleave` (sfx:94), life 0.55 s, on land only. A crescent swept round the caster at 1.05–1.75 tiles, lifted 13–15 px, over 0.11 s, with a white-hot head star. A spark star and a scuff ring on the target and each splashed foe. Colours: cleave [255,190,100] and cleaveHot. No aura. |
| `shield_wall` | Shield Wall | Lv 6 + fighter trial | 20 | casting takes the turn | **Guard**, 6 s (+2 with the Long Watch perk). DEF × (1 + 0.5×mult) (`buff.wall`, `wallK`; bt:283, bt:744). **Taunt:** every foe targets the nearest Shield Wall holder within **7 tiles** (bt:1251, bt:1282). | Not already up, and either own HP below low, or another ally standing with ≥2 foes within 3.2 tiles (≥3 when aggressive) (bt:703-707) | The only skill with a **cast** moment (sfx:109). **Cast:** a red war-cry ring out to 3.3 tiles over 0.4 s, and motes plus a line from each foe within 4.2 tiles to the fighter (colour taunt [255,84,56]). **Land:** a shield of light rises 22 px in front, then fades (wall [255,210,130]), life 0.95 s. **Aura** (sfx:290): six plate arcs at r 0.66 turning at the feet, ticks, and a pulse ring every 1.2 s. |
| `second_wind` | Second Wind | Lv 12 + `fighter12` trial | 25 | casting takes the turn | **Heal self** for 25 % of max HP (×mult ×healMod: Devout, Sisters' Ward) (bt:746-748). | Own HP fraction below low (bt:708) | `second_wind` (sfx:129), life 1.2 s. Three wind strands whirl up 54 px, with a ring at the feet. Colour wind [190,255,150]. No aura. |
| passive | Iron Hide | Lv 20 | – | – | DEF ×1.1 (`party.js` statsFor). HP regen ×2 below 30 % HP (bt:1165). | always on | none |

#### Rogue
Class traits:
- With daggers: range 2.8, every 0.9 s, speed 7.5 (bt:49).
- With a bow or crossbow it shoots (SHOT, bt:57-62):
  - Hunting Bow: range 10, every 0.95 s, `arrow`;
  - Longbow: range 13, every 1.1 s, `arrow`;
  - Hand Crossbow: range 10, every 1.05 s, `bolt`;
  - Heavy Crossbow or Arbalest: range 12, every 1.35 s, `bolt`.
- Every rogue blow from the target's rear half crits ×1.25 harder (BACKSTAB_CRIT, bt:68 and bt:788). This applies to every rogue attack, not only Backstab.

| id | Name | Unlock | MP | Cooldown | What it does | When the AI casts it | Effect drawn |
|---|---|---|---|---|---|---|---|
| `backstab` | Backstab | Lv 1 | 10 | heavy swing | **Strike.** 1.6×ATK, +25 % crit chance (bt:779). Rare gear can mod it. | In place of a basic attack | `backstab` (sfx:139), life 0.6 s. A shadow streak from the rogue to the target (green, 0.25 s), then two crimson cuts crossing on the target (stab [255,52,84]). A star on a crit (`e.crit`). |
| `smoke_step` | Smoke Step | Lv 6 + trial | 15 | takes the turn | **Guard**, 5 s (+2 with Smoke Artist). Dodge + 30×mult (`buff.smoke`, `smokeK`). Dodge is capped at 50 when a blow resolves (bt:503). **Drop aggro:** foes ignore smoked members while any unsmoked member is alive (bt:1250). | Not already up **and** own HP below low. It has no "threatened" trigger: the `guards` test needs `A.taunt` (bt:706-707). | `smoke_step` (sfx:151), life 1.3 s. 16 lilac smoke puffs thrown out in a ring and rising, with wisps. **Aura** (sfx:293): four smoke wisps turning round them. |
| `venom` | Venom | Lv 12 + `rogue12` | 20 | heavy | **Strike.** 0.8×ATK, then **poison**: `{t:6 (+2 Venomous), dps: ATK×0.35×mult}`. It ticks once a second through `applyHit`, never crits, and each tick is a real 'hit' with sparks and a number (bt:804, bt:1262-1267). | As a strike, skipped if the target's poison has more than 1 s left (bt:689) | `venom` (sfx:160), life 0.8 s. 12 green drops arc out and fall, with a star and a ring at the feet (venom [150,255,50]). **Aura on the foe** (sfx:308): bubbles rising, and a sick glow under them. |
| passive | Opportunist | Lv 20 | – | – | Any crit by the rogue restores 5 MP (bt:798). | – | none |

#### Mage
Class traits: range 14, every 1.6 s, speed 6.4. **Every** mage attack is a `fire` bolt, the basic one too (bt:50). Cluster bonus: a mage attack deals ×1.2 to a target with ≥2 other live foes within 2 tiles (CLUSTER_ATK, bt:68 and bt:787). The bonus applies to basic attacks and Firebolt. It does **not** apply to Frost Nova, because the nova resolves through `utility`, which skips `attack()`.

| id | Name | Unlock | MP | Cooldown | What it does | When the AI casts it | Effect drawn |
|---|---|---|---|---|---|---|---|
| `firebolt` | Firebolt | Lv 1 | 12 | heavy | **Strike** at range, 1.8×ATK. The projectile is `kind 'fire'` and tagged `skill:'firebolt'` (bt:815). **Kindler** perk: splash 0.3× within 1.8 tiles (bt:800). Rare gear can mod it. | As a strike | **In flight:** `fireHead` (sfx:272), called by `boltFx` (rr:1017). An 11 px halo and a 4 px core over the normal fire trail, shedding 10 embers, with a star. **Land:** `firebolt` (sfx:170), life 0.9 s, fired when the projectile hits. A white-orange flash and star, a fire ring at chest height, 18 embers arcing out, smoke motes rising, and a scorch ring with a glow pool on the floor. The generic `fx.burst` (ember) plays too (rr:1024). |
| `frost_nova` | Frost Nova | Lv 6 + trial | 30 | takes the turn | **Nova, thrown** (GDD v1.53). Centred on the foe within the mage's reach (14) that has the most live, non-spawning foes within **3.5**, needing ≥2 (`novaCentre`, bt:229-234). On landing, each foe within 3.5 of that foe's position takes 0.8×ATK×mult (a heavy hit) and gets `slow = 3` (bt:771-773). **Slow:** the foe's cooldown ticks at half speed and it moves at half speed (bt:1280-1281, bt:1291-1294). Emits `combat 'heavy'` at the **caster**, which shakes the camera. | When a knot of ≥2 exists (bt:719) | `frost_nova` (sfx:185), life 1.1 s. A cold streak from the staff to the knot (0.16 s). A frost ring expands to `e.r` (3.5) over 0.3 s, with an inner ring and a mist pool. 18 ice spikes grow as the ring passes, and each reached foe gets a white star. **Aura** (sfx:306): a rime ring and pool at the feet, with snow motes falling. |
| `arcane_ward` | Arcane Ward | Lv 12 + `mage12` | 25 | takes the turn | **Ward** on the most-hurt live ally with no ward, whose HP fraction is below low + 0.1 (bt:709-712). `ward = 30 % × mult` of their max HP. It absorbs damage first; a blow fully soaked emits `combat 'warded'` and does nothing else (bt:514). It does not expire by time; it is cleared on a new room visit, a down, a fall or leaving the room (bt:454, 485, 492, 533). | When such an ally exists | `arcane_ward` (sfx:198), life 0.95 s. Six runes spiral in (0.35 s), then a dome oval closes over the ally. **Aura** (sfx:300): a quiet dome, a light running round it, a foot ellipse and twinkling facets (ward [110,150,255]). **No break or shatter** when the ward is spent (noted as a gap in docs/combat-fx.md). |
| passive | Kindled Mind | Lv 20 | – | – | MP regen ×1.25 (`party.js` statsFor) | – | none |

#### Cleric
Class traits: melee (mace), range 3.0, every 1.3 s, speed 6.6. Cleric heals are ×1.2 (HEAL_BONUS, sk:99), applied in Mend (bt:751).

| id | Name | Unlock | MP | Cooldown | What it does | When the AI casts it | Effect drawn |
|---|---|---|---|---|---|---|---|
| `mend` | Mend | Lv 1 | 12 | takes the turn | **Heal** the most-hurt live ally (self included) whose fraction is below min(0.9, low + 0.15), for 22 % of **their** max HP × mult × 1.2 × healMod. healMod covers Devout ×1.1, Sisters' Ward ×1.15 and Steady Hands ×1.15 (bt:713-716, bt:749-752; `companions.js` healMod:183). Rare gear can mod it. | When such an ally exists | `mend` (sfx:207), life 1.1 s. A gold column 74 px from above, a ring and pool at the feet, a "+" mark rising over the head, and 7 rising motes (mend [255,230,150]). No aura. |
| `bless` | Bless | Lv 6 + trial | 25 | takes the turn | **Party buff** on every living member: ATK and DEF × (1 + 0.15×mult) for 8 s (`buff.bless`, `blessK`; bt:753-755, bt:283). | ≥2 foes, and nobody already blessed (bt:717-718) | `bless` (sfx:218), life 1.2 s. A rune circle turning at the cleric's feet, and a halo dropping onto each ally (`reached` = the party). **Aura** (sfx:296): a pulsing halo at 52 px. |
| `turn_undead` | Turn Undead | Lv 12 + `cleric12` | 30 | takes the turn | **Nova round the caster**, radius **3**. 1.6×ATK×mult (heavy) to every foe with `undead` set; `slow:0` (bt:771-773). Whether a foe counts as undead is decided per family by `F.undead(k)` (bt:159-171) or the boss's `undead` flag, not "Ashbound" by name. **Quirk:** it sets `o.slow = 0` on every foe it hits, which cancels any Frost Nova chill on them. | ≥2 undead within 3 of the cleric. It is never cast at a lone undead, a lone boss included (bt:230). | `turn_undead` (sfx:228), life 1.1 s. 20 rays running out over the floor to 3 tiles, a ring, a pool, a column and a star at the caster, and a flare plus rising smoke on each reached foe (turn [255,246,210]). It does **not** read `e.r`; the radius is hard-coded to 3. No aura. |
| passive | Lifeline | Lv 20 | – | – | Once per room visit (`battle.lifeline`), the blow that would down an ally leaves them at 1 HP instead, as long as a living cleric has the passive (bt:522-525). | – | Float text "Lifeline" (rr:1567) and the `ward` sound. No fx. |

#### Shaman
Class traits: range 12, every 1.5 s, speed 6.5, fires a `spirit` bolt (bt:52).

| id | Name | Unlock | MP | Cooldown | What it does | When the AI casts it | Effect drawn |
|---|---|---|---|---|---|---|---|
| `spirit_drain` | Spirit Drain | Lv 1 | 9 | heavy | **Strike** at range, 0.7×ATK. Then one **drain stack**: `drain = {n ≤ dmax 5 (8 with Old Ways), t: 8 (+2 Deep Drinker), dps: ATK×0.12×mult}`. Each hit adds a stack and resets the timer. Every tick deals dps × n and mends the most-hurt ally for 50 % of it (DRAIN_MEND). With Old Ways the caster also gets +1 MP a tick (bt:805-808, bt:1268-1277). Rare gear can mod it. | As a strike, skipped if the target is full on stacks with more than 2 s left (bt:690) | `spirit_drain` (sfx:239), life 0.8 s, on bolt arrival. A wavering tether from the foe to the shaman with 7 motes travelling along it, and a star (drain [110,240,210]). **Aura on the foe** (sfx:311): one teal mote per stack circling it. Drain ticks emit plain 'hit' sparks and numbers, and the mend back is **silent** (no heal event, no float). |
| `ancestors_breath` | Ancestors' Breath | Lv 6 + trial (*Old Roads*) | 22 | takes the turn | **Party HoT and buff** for 6 s: `breathK = 0.05×mult×healMod` of max HP per second, applied continuously in the regen loop (bt:1172), plus ATK × (1 + 0.1×mult) (`breathAtk`, bt:760-763). | Nobody breathing it already, and either ≥2 allies below min(0.85, low + 0.25), or anyone below low (bt:720-723) | `ancestors_breath` (sfx:249), life 1.3 s. A double ring breathing out to 3.1 tiles, and 8 leaves spiralling up each ally (breath [140,255,190]). **Aura** (sfx:297): three leaves rising. |
| `hex` | Hex | Lv 12 + `shaman12` | 22 | takes the turn | **Debuff** on every live foe within **3.5** of the centre: `hex = {t:8, k: min(0.4, 0.2×mult)}`. It cuts the foe's ATK when it swings and its DEF when it is struck (bt:499-501, bt:764-768, bt:796). Centre (`hexCentre`, bt:678-683): the foe with the most un-hexed foes within 3.5, needing ≥2 (a boss wins a tie); otherwise the first boss or elite that is not hexed. | When `hexCentre` returns a target | `hex` (sfx:259), life 1.4 s. A sigil drawn stroke by stroke on the floor (two rings and a pentagram, r 1.35), a violet pool, and violet lines to each reached foe (hex [160,255,70], hexV [190,110,255]). **Aura** (sfx:314): a ring with three beads under the foe, and violet motes sinking. The sim also emits combat `'hex'`, shown as the float "hexed" (rr:1565). |
| passive | Old Ways | Lv 20 | – | – | Spirit Drain caps at 8 stacks (+3), and each tick returns 1 MP to the caster (sk:101, bt:676, bt:1274) | – | none |

#### Sellsword perks that act in combat
Defined in `src/sim/companions.js` (PERKS :42, FIGHT :86). None of them has its own effect drawn.

| Perk | What it does in a fight | Where in bt |
|---|---|---|
| bodyguard | Takes 20 % of what is aimed at the hero, within 3 tiles | bt:515-518 |
| skirmisher | ×1.2 against a foe that isn't fighting them | bt:790 |
| finisher | ×1.15 against a foe under half HP | bt:791 |
| last_stand | ×1.2 while under 25 % HP | bt:792 |
| grave_warden | ×1.15 against the undead | bt:794 |
| redhand_breaker | ×1.15 against the living | bt:794 |
| field_medic | Every 12 s, +5 % max HP to the most-hurt ally; shown as the "+N" heal float and the heal sound | bt:1167-1170 |
| Ability perks | venomous, smoke_artist, long_watch and deep_drinker each add +2 s; kindler gives Firebolt a 0.3× splash; steady_hands is ×1.15 on **all** of that member's heals (described as "Mend") | bt:744, bt:800, bt:804, bt:807; healMod |
| Auras | drillmaster: attacks 5 % faster; banner_man: party DEF ×1.05; old_campaigner: party HP regen ×1.1 | bt:781, bt:282, bt:1166 |
| Sworn | Once per room visit, the companion rises at 30 % HP instead of going down; shown as the float "rises" | bt:526-529 |

---

### E.2 Basic attacks and class looks

#### Swings and clips
- **Light swings** alternate between clip A (`attack`) and clip B (`attack2`).
- **Heavy** (the `heavy` clip) is used for every ability, every **utility cast**, and every **elite** blow (bt:780-782, bt:725; anim.js:39-41).
- A light blow lands `WINDUP = 0.18 s` after the swing starts, a heavy one 0.38 s.
- The weapon effect is chosen per **atlas** from FX_STYLES (fx:31-76, drawn by `weapon()` at fx:170). It traces the baked anchors with a Catmull-Rom curve (fx:161).

#### Per class

| Class / look | Basic attack | Weapon fx (`FX_STYLES`) | Projectile and landing | Hit-spark colour |
|---|---|---|---|---|
| Fighter `hero_barbarian` (the knight hero is `hero_knight`) | Melee 3.0 / 1.3 s | `arc` on attack, attack2 and heavy. WARM [255,170,90], wide ×1.25. The knight uses STEEL [185,210,255]. | – | [255,196,120]; the knight [255,238,205] |
| Rogue `hero_rogue` | Melee 2.8 / 0.9 s | Attack is `stab` (a thrust line and a glint); attack2 and heavy are `arc`. VERDANT, thin, and the off-hand dagger draws too (fx:176). | – | [215,255,225] |
| Rogue with a bow (`_bow`, `_longbow`) | Shoots `arrow` | No weapon fx ("the arrow is the effect") | `arrowSprite`: 16 headings, glint at head and fletching (rr:473). `fx.trail` draws a thin pale streak with no halo or floor glow (fx:243). Landing: `burst` at size 0.55 (rr:1023-1024). | verdant |
| Rogue with a crossbow (`_hxbow` hand, `_xbow` heavy; RANGED_LOOK rr:551) | Shoots `bolt` | `shot`: a muzzle flash in MUZZLE colour (fx:212) | `boltSprite('bolt')`: a small grey orb with no glow. Trail, halo and floor glow in [200,210,230]. Burst at 0.55. | verdant |
| Mage `hero_mage` | `fire` bolt, 14 / 1.6 s | `cast`: a shimmer gathers at the staff crown with circling motes, then flashes on release (fx:198). ARCANE [110,140,255]; **heavy uses FIRE** (heavyCol). | `boltSprite('fire')`: a lava orb (rr:458). Fire trail, halo and floor glow; on landing, a burst **with embers**. | [175,195,255]; heavy [255,170,80] |
| Cleric `hero_cleric` | Melee mace 3.0 / 1.3 s | `arc`, HOLY [255,214,120], wide ×1.15 | – | [255,236,180] |
| Shaman `hero_shaman` | `spirit` bolt, 12 / 1.5 s | `cast` in pale teal [150,235,215] | `spirit` orb [150,235,215], strong glow. Trail and burst in BOLT_RGB.spirit [120,235,215]. | [180,255,230] |
| Found companions `hero_brannoc` (fighter), `hero_wren` (rogue) | as their class | **No FX_STYLES entry**, so no weapon trail | Wren never gets a ranged look, because `memberAtlas` only swaps `hero_rogue` (rr:552) | default [255,232,200] |

#### Side effects of the heavy clip
Because utilities play the caster's **heavy** clip, the weapon effect draws during buffs too:
- A Shield Wall or Second Wind shows the fighter's heavy weapon arc.
- Bless or Mend shows the cleric's mace arc.
- Frost Nova and Arcane Ward gather **fire-coloured** light at the mage's staff (heavyCol FIRE).

---

### E.3 Foes and bosses

#### E.3a Foe kinds

Source: ENEMIES (bt:114-152), the stats of each kind at level 1.

Scaling:
- HP ×(1 + 0.14·(L−1)); ATK ×(1 + 0.12·(L−1)) (bt:417).
- Tide and premium multiply on top.
- **Elite:** HP ×2.5, ATK ×1.3, XP ×3, gold ×4, 1 cinder. Every elite blow is heavy, with a camera jolt when it lands on the party.

No ordinary foe has an ability, a status effect or a debuff on the party. Each foe has only its basic melee attack or a bolt of its kind. The hexer's "green hex" and the bog-witch's marsh-light are cosmetic bolt kinds.

| Kind | Family use | Attack | Atlas (rr:43) | Weapon fx | Bolt (BOLT_RGB fx:28 / sprite rr:458) |
|---|---|---|---|---|---|
| minion | ashbound, diggers, chapel, lockcult | melee 2.8 / 1.2 s | skeleton_minion | arc, BILE | – |
| warrior (elite of ashbound and chapel) | ashbound, chapel | melee 3.0 / 1.4 s | skeleton_warrior | arc, SOUL green | – |
| rogue (skeleton archer) | ashbound, diggers, chapel, lockcult, harvest, drowned | bolt 12 / 1.6 s | skeleton_rogue | shot, muzzle | `bolt`, grey |
| mage | ashbound | bolt 14 / 2.0 s | skeleton_mage | cast, SOULCAST | `soul`, violet [170,130,255] |
| cutthroat | redhand, diggers | melee 2.8 / 1.1 s | redhand_cutthroat | stab/arc, REDHAND thin | – |
| brute (elite of redhand and diggers) | redhand | melee 3.0 / 1.5 s | redhand_brute | arc, REDHAND wide | – |
| crossbow | redhand, diggers | bolt 13 / 1.7 s | redhand_crossbow | shot | `bolt` |
| acolyte | chapel, lockcult | bolt 14 / 2.0 s | cinder_acolyte | cast, EMBER | `fire`, embers on landing |
| goblin | goblin | melee 2.6 / 1.0 s | goblin_skirmisher | stab/arc, VERDANT | – |
| bruiser (elite) | goblin | melee 3.0 / 1.5 s | goblin_bruiser | arc, WARM | – |
| archer | goblin | bolt 13 / 1.6 s | goblin_archer | none | `arrow` |
| hexer | goblin | bolt 14 / 2.0 s | goblin_hexer | cast, BILE | `hex`, green [150,240,90] |
| fenghoul | reedmen, harvest | melee 3.0 / 1.1 s | fen_ghoul | arc, BILE thin | – |
| reedcutter (elite) | reedmen | melee 3.3 / 1.5 s | reed_cutter | arc (heavy is a stab), WARM | – |
| fowler | reedmen | bolt 13 / 1.7 s | reed_fowler | shot | `bolt` |
| bogwitch | reedmen, harvest | bolt 14 / 2.0 s | bog_witch | cast, pale green | `marsh` [190,240,200] |
| harvester (elite of lockcult, harvest, drowned) | lockcult, harvest, drowned | melee 3.4 / 1.5 s | cult_harvester | arc (heavy is a stab), violet | – |
| drowned | drowned | melee 2.8 / 1.2 s | drowned_brother | arc, teal | – |
| cantor | drowned | bolt 14 / 2.0 s | drowned_cantor | cast, teal | `soul` |
| lantern (Teague's cage; inert) | – | none (interval 99) | the `props.cage[0]` sprite, lifted 12 px (rr:1190) | – | – |

Family rosters are in FAMILIES (bt:159-171). Which kinds count as undead (relevant to Turn Undead and the Standard's line):
- ashbound: all;
- diggers: minion and rogue;
- chapel: everything except the acolyte;
- lockcult: minion and rogue;
- harvest: rogue only;
- drowned: drowned, cantor and rogue.

#### E.3b Bosses

Each boss is BOSSES (bt:199-212): its `like` kind's stats multiplied by its own HP, ATK and DEF multipliers.
- The mechanic runs in `bossMech` (bt:1071-1140). Its constants are at bt:213-215.
- Halved damage is decided by `halved()` (bt:218).
- Bosses are placed by `sites.js` `bosses` (:42-50, `bossAt`:79).

| Boss (id) | Where (sites.js) | Like (attack) | Multipliers (HP / ATK / DEF) | Mechanic, in the sim | How it is drawn now |
|---|---|---|---|---|---|
| Captain Garrow (`redhand_captain`), story, once | Wickham Keep, floor 2 | brute (melee) | 22 / 2.3 / 1.6 | **call**: below 2/3 and again below 1/3 HP, his escort kinds (cutthroat and crossbow) spawn ±1.3 tiles from him, and he takes **half** damage while any of them stands (bt:1073-1076) | Banner "Garrow calls his men" (rr:1582). On the boss bar, a ⛨ and a grey bar while halved (rr:1642-1646). The new men walk in with the ordinary spawn dissolve. No mechanic fx. Atlas boss_garrow: arc (heavy stab), REDHAND. |
| The Robed Stranger (`robed_stranger`), once | Sunken Chapel, floor 1 | acolyte (fire bolt 14) | 38 / 2.8 / 2.5 | **kindle**: every 12 s, the last non-boss foe slain rises as an Ashbound minion where it fell (bt:1077-1080) | Banner. The minion rises with the shared undead rise clip. No fx at the spot, even though the event carries x and y. boss_stranger: cast EMBER, heavy FIRE. |
| Standard of the Third Legion (`standard`), undead, lamp keeper | Sunken Chapel, floor 2 | warrior (melee) | 34 / 2.2 / 1.8 | **line**: non-boss undead within 4 tiles of the standing Standard take half damage (bt:222). His fall breaks the `third_legion` lamp (240 souls), and every bound undead lies down (bt:609-616). | Only the bossWave banner sub-line. **Nothing marks which foes are halved**, and the boss bar is never shielded, because `halved` does not apply to the boss itself. On a kill: a violet `fx.rise` column for the lamp (rr:1606-1608), and an `fx.beam` "freed" on each bound foe. boss_standard: arc, HOLY. |
| Old Skarn (`goblin_chief`) | Wickham Keep, floor 1 | bruiser (melee) | 26 / 2.1 / 1.5 | **swarm**: every 10 s, up to 2 escort kinds (goblin, archer) at the hall cell farthest from him (best of 4 draws), at most 4 of his up at once. His shooters close to half their range (bt:1081-1092, bt:1293). | Banner "Skarn drums: goblins pour out". The goblins fade in with the spawn dissolve. No drum fx. boss_skarn: arc, WARM. |
| The Toadking (`toadking`) | Toadking's Mound, floor 3 (GDD §17 says floor 2) | reedcutter (melee 3.3) | 18 / 2.1 / 1.6 | **mud**: every 9 s, a patch of radius 1.8 lasting 6 s under each standing party member. Hazard: party move ×0.5 and cooldown recovery ×0.7, and the AI steps out of it first (hazards.js:12, bt:1093-1098). | Banner. **Emberlit:** `paintHazards` paints a near-black disc with a pale wet rim, a dithered edge, bubbles, and a well-up and sink fade (rr:647-670). **Luminati:** a ground disc and rim mesh (hy:174-178, w3:430). |
| Brother Teague (`teague`), once | Drowned Abbey, floor 1 | harvester (melee 3.4) | 16 / 2.1 / 1.5 | **cage**: an inert `lantern` foe at his side with 35 % of his HP and his DEF. While it is lit he mends 2.5 % of max HP a second and takes half damage. Breaking it gives a lamp and a soul (bt:378, bt:428-443, bt:1117-1120, bt:600-606). | **Emberlit:** the cage prop sprite with its own hit flash and HP bar. Broken: the banner "Teague's cage breaks" plus an `fx.beam` of SOUL_FREE violet for 1.4 s. ⛨ on the boss bar while it stands. **Luminati: the cage is not drawn at all.** The draw has no `atl`, so hybrid skips it (hy:161). Only its HP bar floats there. boss_teague: arc (heavy stab), violet. |
| The Drowned Choir (`drowned_choir`), undead | Drowned Abbey, floor 2 | cantor (soul bolt 14) | 26 / 2.0 / 1.8 | **vespers**: its singing cantors stay within 3 tiles of it. While ≥1 sings, every undead foe in the hall mends 2 % of max HP a second. With fewer than 2 singing, a new cantor stands up every 12 s at the cell farthest from the hero (best of 4) (bt:377, bt:1121-1132, bt:1290-1292) | Banner "Another sister stands to sing". **No fx for the mending or the singing.** boss_choir: cast, teal. |
| The Abbess Below (`abbess_below`), undead, lamp keeper | Drowned Abbey, floor 3 | drowned (**melee** 2.8) | 36 / 2.5 / 1.9 | **bells**: every 12 s the flood level rises by 1, up to 4. Each step covers `max(1, round(deepest × 0.12))` tiles from the walls; water is a hazard. Her fall breaks `choir_lamp` (312 souls) and the water drains (bt:1133-1139, bt:596). | Banners for each bell and for the drain. **Emberlit:** flooded tiles painted deep teal with sparse emissive glints and a lighter tide line (rr:672-684). **Luminati: the flood is not drawn.** hybrid passes only patch hazards and has no `flood` (hy:175). boss_abbess uses `cast` fx but is a melee foe, so it "casts" with no bolt. |
| The Quartermaster (`quartermaster`), undead | Old Barrows, floor 2 | warrior (melee) | 24 / 1.9 / 1.6 | **issue**: every 10 s, the most-hurt non-boss foe still below max HP is restored to full (bt:1099-1103) | Banner "issues arms" only. **No fx on the restored foe**, even though the event carries its x and y. Its HP bar jumps. boss_quartermaster: arc, brass. |
| The Vatwarden (`vatwarden`) | Canal Locks, floor 3 | harvester (melee 3.4) | 20 / 2.2 / 1.6 | **sluice**: every 11 s, a strip of patches (radius 1.5, 6 s, spaced 2.2, ±8 tiles) through the party's centroid, alternating along x and along y (bt:1104-1116) | Banner. Painted green-black with a bilious rim on Emberlit (rr:648), and as a disc and rim on Luminati. **Not in the art review's fx page**, which shows only the mud and the flood (review.js:141-142). boss_vatwarden: arc (heavy stab), sick green. |
| **Mere Tower wardens** (tower.js:25-35; a warden every 10th wave; escort replaced by the block's `melee[0]` and `ranged[0]`, bt:398) | Mere Tower | Doorward (warrior, call); Mudlark (fenghoul, swarm); Bellringer (acolyte, kindle); Lensman (crossbow, call); Hush (rogue, swarm); Twins (brute, call); Tower Hound (goblin, swarm); Gatherer (harvester, kindle); Watcher (mage, call); Star Room (warrior, kindle) | per tower.js | Call, swarm or kindle, the same as above | The same banners, named from BOSSES (rr:1581). Atlases `boss_<name>`. **None of them has an FX_STYLES entry**, so: no weapon trail, default hit sparks, and the default soul colour [220,220,235] on death (rr:1244). |

#### E.3c What every foe gets
- **Spawn.**
  - Undead play the rise-from-the-ground clip (`spawnP`).
  - The living fade in with an ordered dither over 0.5 s (rr:1204-1207).
- **Death.** The death clip plays, then a dither dissolve over the last 0.35 s of `DEATH_T = 1.1` (rr:1206), plus `fx.soul` in the kind's spark colour (big for a boss or elite; rr:1242-1245).
- **Ring and HP bar.** A team ring at the feet: red [196,58,46], or orange [236,128,48] for an elite (rr:601). An HP bar: red; orange and wider for an elite (rr:1625).

---

### E.4 Status effects and auras

All of these are runtime fields. None is in `MEMBER_KEYS` (core.js:580), and all are cleared on a new room visit, a down, a fall or leaving the room.

| Who | State field | Set by | Effect (sim) | How it looks |
|---|---|---|---|---|
| party | `buff.wall`, `wallK` | Shield Wall | DEF × (1 + wallK). Taunt: foes within 7 tiles target the holder (bt:283, bt:1251) | Aura of turning plates, plus a pulse (sfx:290) |
| party | `buff.smoke`, `smokeK` | Smoke Step | +dodge. Foes lose the member (bt:1250) | Smoke wisps (sfx:293) |
| party | `buff.bless`, `blessK` | Bless | ATK and DEF × (1 + k) | Halo (sfx:296) |
| party | `buff.breath`, `breathK`, `breathAtk` | Ancestors' Breath | HoT and ATK × (1 + k) (bt:1172) | Rising leaves (sfx:297) |
| party | `ward` (points) | Arcane Ward | Absorbs damage first; `'warded'` when a blow is fully soaked | Dome (sfx:300). Floats "ward N" and "warded" (rr:1563-1564). No break effect. |
| party | `down`, `downs`, `fallen` | 0 HP; downed twice in a visit means Fallen | Rises at 25 % in the lull (bt:1192). A Fallen companion follows as a ghost until a temple or shrine raises it. | Downed: death clip and fade 0.35. Fallen: grey dithered ghost with a pale rim (rr:711-721). Raised: `fx.rise`, a holy column (rr:1599-1603), then `raisedLook`, a ghost then a warm rim (fx:84). |
| party | `weakUntil` (Weakened) | A wipe | −10 % max HP, max MP, ATK and DEF (`party.js` WEAK) | HUD and banner only |
| party | `battle.lifeline`, `battle.sworn` | Lifeline, Sworn | Holds on at 1 HP / rises at 30 % HP | Floats only |
| party | standing in a hazard (derived) | mud, sluice, flood | Move ×0.5, cooldown recovery ×0.7 (hazards.js:12, bt:1174, bt:1207) | The ground paint, not the figure |
| party | shrine boon (`boonK`) | red or blue shrine | ATK or DEF ×1.25 for 2 minutes (bt:282) | Outside fight fx (HUD) |
| foe | `slow` (s) | Frost Nova (set to 0 by Turn Undead) | Cooldown and movement at ×0.5 (bt:1280-1294) | Rime and snow (sfx:306) |
| foe | `poison {t, dps, acc, by}` | Venom | A non-crit tick every 1 s (bt:1262) | Bubbles and a glow (sfx:308). Each tick also gives hit sparks and a number. |
| foe | `drain {n, t, dps, acc, by}` | Spirit Drain | dps × n each second, half of it mending the most-hurt ally, +1 MP with Old Ways (bt:1268) | Motes, one per stack (sfx:311) |
| foe | `hex {t, k}` | Hex | ATK when it swings and DEF when struck × (1 − k), k ≤ 0.4 (bt:499-501) | Sigil ring and sinking motes (sfx:314). Float "hexed". |
| foe | halved (derived: `halved()`) | Garrow's guards, Teague's cage, the Standard's line | Damage taken ceil(/2) (bt:513) | ⛨ and a grey bar on the **boss** bar only. Nothing marks a foe halved by the line. |
| foe | `mend` (accumulator) | cage, vespers | Regen in whole points | No fx |
| foe | `singer`, `swarm`, `guards`, `cage` (links) | boss mechanics | AI leash and ownership | – |
| foe | `flash` 0.12 s, `hitN` | any hit (bt:519) | – | Flinch clip. Emberlit: a hot rim and warm tint on the silhouette (stamp, rr:703). Luminati: the sprite tint is lifted ×(1 + 2.6·flash) (w3:419-420). |

**Stun and knockback:** none exist in the sim. **Taunt** is only Shield Wall's 7-tile pull. **Aggro drop** is only Smoke Step.

**Aura fade.** A party aura fades over its last 0.8 s; a foe aura over its last 0.6 s (sfx:290-316). docs/combat-fx.md says "over their last second".

---

### E.5 Shared FX vocabulary

#### fx.js primitives
Every primitive draws into the window G-buffer's emissive plane only (fx:99-157).

| Primitive | One line |
|---|---|
| `depth(key, footY, baseH)` | Sets the owner depth for the next marks |
| `mark(x, y, a)` | Coverage per pixel, blended by max |
| `flush(col, gain)` | Writes coverage as light (×0.24 per channel). Dims to 0.22 behind nearer depth. Alpha 250 (steady), or the owner's depth key when another painter is drawing (fx:103-117). |
| `disc(x, y, r, a, p)` | Soft disc from a cached kernel (fx:122-132) |
| `seg(x0, y0, x1, y1, a0, a1, w)` | A ramped line, optionally thick |
| `star(x, y, r, a)` | A four-point glint with a hot core |
| `ribbon(pts)` | A swept blade ribbon, bright at its outer edge |
| `anchor()` | A Catmull-Rom curve through the baked weapon tip and grip anchors |

#### fx.js named effects

| Effect | Trigger | Look |
|---|---|---|
| `weapon()` `arc` (fx:180) | Any swing clip whose style has an `arc` key | A tip ribbon over the impact window. On heavy, also an impact star and disc at the impact frame. |
| `weapon()` `stab` | Rogue, cutthroat and goblin light A; heavy for reedcutter, harvester, Garrow, Teague, Toadking and Vatwarden | A thrust line and a glint |
| `weapon()` `cast` | Mages, the shaman and caster foes | Gathering crown light with circling motes, then a release flash and star |
| `weapon()` `shot` | Crossbows | Muzzle flash |
| `impact()` (fx:225) | combat `'hit'` (rr:1547-1551) | 7 sparks (10 on a crit, 11 heavy) sprayed away from the striker, plus a flash (crit and heavy add a star). Colour from the striker's style `spark` / `heavySpark`. |
| `shock()` (fx:264) | A hit that is heavy or a crit (rr:1552) | A ground ring 15 px wide (22 px when heavy **and** crit) |
| `trail()` (fx:239) | Every projectile each frame (`boltFx`, rr:1011) | Tapering streak, head halo and floor glow pool. Arrows get a thin pale streak only. |
| `burst()` (fx:255) | A bolt that has vanished since the last frame (`boltsLand`, rr:1020) | Flash, a ring at chest height and 8 sparks. Fire adds 12 falling embers. Arrows and quarrels at size 0.55. It plays even if the blow missed or the target died. |
| `soul()` (fx:269) | A foe first seen `dead` (rr:1242); not for the lantern | Flash, a ground ring and 10 rising motes (16 when big) |
| `beam()` (fx:277) | `loot` (rarity colour), and combat `'freed'` (SOUL_FREE violet, 1.4 s) | A light column and a ground glint |
| `rise()` (fx:280) | `resurrected` (HOLY), `lampBroken` (violet, 2.6 s), `cageBroken` (violet, 1.6 s) | A tall column, a spreading ring and rising motes |
| `particles()` (fx:283) | Every frame | Advances beams, flashes, rings and parts (240 at most) |
| `wisps()` (fx:331) | Fens marsh-lights at dusk and night | Not combat |

#### Renderer combat presentation outside the fx plane (rr)

- **Team foot rings** (`footMark`, rr:602): party gold, foes red, elites orange; Emberlit draws only the near arc.
- **Hit flash** on the sprite (rr:703).
- **Dissolves:** spawn and death (rr:694).
- **Camera jolt** on combat `'heavy'` within 14 tiles, 160 ms (rr:1568, rr:1064). Amplitude 2.2 when the party is struck, otherwise 1.6. Novas jolt at the caster.
- **Floats** (rr:1554-1567):
  - damage (white; crits gold with "!"; party red);
  - "miss";
  - "+xp", "+✦" cinders;
  - the ability name (orange);
  - "falls", "rises", "is slain";
  - "+heal";
  - "ward N", "warded", "hexed", "Lifeline".
- **HP bars and boss bar** with ⛨ (rr:1616-1648). The GDD §3.7 promises "HP/MP pips"; only HP bars are drawn.
- **Banners** for waves, the tide, bosses and level-ups (rr:1573-1595). Level-up has **no visual fx**, only a banner and the `levelup` sound.
- **Bolt sprites:** `boltSprite` orbs (fire, soul, hex, spirit, marsh, bolt) and `arrowSprite` (rr:458-490).
- **Ground hazards** via `paintHazards` (rr:655).
- **Focus target:** Emberlit has no focus marker that I could find. Luminati draws a rotating gold ring (hy:170, w3:429).

#### skillfx moments
- **Moments:** 15, one per class skill (`SKILL_MOMENTS`, sfx:46; LIFE sfx:43). Only `shield_wall` has a `'cast'` phase; all the others draw on `'land'`. `fireHead` draws the Firebolt in flight.
- **Auras:** 5 on the party (wall, smoke, bless, breath, ward) and 4 on foes (slow, poison, drain, hex) (sfx:283-319).
- **How they are drawn:** a module gain ×1.7 (sfx:57). Ground circles are true world ellipses at 11.31 × 5.66 px per tile (sfx:33). A moment follows its caster and target by id (sfx:87, sfx:333-334).

#### The Luminati renderer (hy, w3)
- **One effects plane for both renderers.** In external mode, Emberlit skips stamping and paints (`if (!X)`, rr:1227), clears EMI, and draws **all** fx.js and skillfx output on black. The plane's alpha carries each owner's depth key (rr:1233).
- **How Luminati composites it.** Luminati adds it after its post pass as light, with ×2.4 gain and an 8-tap bloom, cut to 0.22 where scene geometry stands nearer than the owner (w3:220-282).
- **No 3D combat lights or particles.** The only Luminati light we drive is the hero's "carry" light (w3:433-436).
- **Luminati's own combat fx are unused.** The vendored `CombatSystem` (bruteQuake, dust and so on) is not driven by the game.
- **Ground items** are rebuilt as meshes: team rings (whole thin rings), the focus mark, and mud and sluice patches (hy:154-178, w3:428-430).

**Gaps on Luminati:**
- the Abbess's flood is not drawn;
- Teague's lantern-cage sprite is not drawn;
- bolt and arrow **sprites** are not drawn (only their light trail, halo and burst);
- Emberlit's per-sprite emissive (the bolt orbs' baked glow) is lost.

#### Sound (brief)
Sources: `src/audio/cues.js` and `listen.js`.
- **Per-skill sounds:** there are none, and the `'skill'` event is not listened to. Instead:
  - every ability → `warcry`;
  - combat `'guard'` (Shield Wall, Smoke Step, Bless and Breath all emit it) → `guard`;
  - `'heal'` → `heal`;
  - `'ward'`, `'warded'` and `'lifeline'` → `ward`;
  - `'hex'` → `hex`;
  - `'heavy'` → a low `swing`.
- **Blows** are a synthesised thump, with a crack on a crit or a heavy hit (engine.js:105). A struck foe sometimes gives a hurt voice.
- **Swings** sound by atlas (cues.js:43):
  - bow (bows, crossbows, archers, skeleton rogues);
  - fire (mage, skeleton mage, acolyte, Stranger, cantor, Choir, Abbess);
  - spirit (shaman, bog-witch);
  - hex (hexer);
  - otherwise a heavy or light swing.
- **Boss mechanic events have no sound.** `quake` exists in the bank but our game never uses it.

---

### E.6 Determinism notes

- **Sim (deterministic, replayable on the server).** Everything in §1, §3 and §4 is sim: `skills.js`, `battle.js`, `companions.js` FIGHT, `hazards.js` and `tower.js`.
  - Draws come only from `mulberry32(streamSeed(seed ^ room…, 0xb477))`. Math goes through `detmath`.
  - The `'skill'` and `'combat'` events are emit-only and change no state. `test/skillfx.test.mjs` asserts the same state hash with and without listeners.
- **Presentation (not replayed).** `fx.js`, `skillfx.js`, renderer floats, banners, shake and `hybrid.js`/`world.js` are presentation.
  - They use `Math.random` (fx.js impact, burst, soul) and `performance.now()`. skillfx uses its own seeded `rnd` hash per moment, so a replayed frame draws the same.
  - Presentation keeps its own state in WeakMaps and arrays (trails, gone, raisedAt). It reads `buff`, `ward`, `slow`, `poison`, `drain` and `hex` but never writes them.
- **Frontier sandbox (`src/sim/frontier/frontier.js`).** It has its own deterministic sim with basic attacks and the cleric's Mend only (frontier.js:22, 50-51, 251-255). There are no skills there. Its view draws canvas sparks, shot lines, mend rings and floats (`src/frontier/view.js`:185-191, 369-383), not fx.js.

---

### E.7 Where docs and code disagree

1. *(Corrected in docs/combat-fx.md with this doc.)* **docs/combat-fx.md:55** says Frost Nova runs "2.8 tiles … from the mage". The code throws it onto a knot with radius 3.5. The doc's later section records the fix; its design table is stale. The comment above the moment (sfx:183) still says "from the mage".
2. *(Corrected in docs/combat-fx.md with this doc.)* **docs/combat-fx.md:125** gives "the wind-up is 0.55 s". 0.55 is the clip (`act`); the effect lands at `WINDUP_HEAVY` = 0.38 s.
3. *(Corrected in docs/combat-fx.md with this doc.)* **docs/combat-fx.md:73** says auras fade "over their last second". The code uses 0.8 s on the party and 0.6 s on foes.
4. **GDD §5.1** says a guard is cast "when threatened". Smoke Step only fires below the stance's low-HP line; only a taunting guard, Shield Wall, has the threatened trigger.
5. **GDD §5** says Turn Undead hits "every Ashbound within 3 tiles". In the code it hits family- or boss-flagged `undead` foes and needs ≥2 of them to cast at all. It also zeroes Frost Nova's slow on the foes it hits.
6. **GDD §5** says the mage's class bonus applies to "Spells". The code applies it to the mage's `attack()`, so basic bolts and Firebolt, but not Frost Nova.
7. **steady_hands** is described as "Mend heals 15 % more". The code applies it to all of that member's heals. In practice the perk is cleric-only, so this is the same thing.
8. **GDD §3 boss list** places the Standard on the Old Barrows' third floor and Skarn in the Scrag Warren. `sites.js` has them in the Sunken Chapel (floor 2) and Wickham Keep (floor 1), per v1.48. GDD §17 has the Toadking on floor 2; `sites.js` has floor 3.
9. **GDD §17 Vespers** mends "every drowned foe". The code mends every `undead` foe in the hall, which includes skeleton rogues.
10. **GDD §3.7** promises HP and MP pips. Only HP bars are drawn.

### E.8 Unclear / not verified

- I didn't find a focus marker on Emberlit. It may live in UI code I didn't open.
- `sites.js` floor indices are 1-based through `bossAt`. Authored plans (`plans.js`) could still override room families per room.
- No heirloom (BOSSES `heirloom`, items.js) has a combat behaviour in `battle.js`; they appear to be stats only.

---

## F. Luminati’s combat, in full

Read from Luminati at its pin `80e1aa6` (`tools/lumina/.work/luminati/`, cloned by `node tools/lumina/build.mjs`); paths are relative to its `src/`. None of this runs in the game today: the game draws its world with Luminati but fights by its own sim (§A).

Source: `tools/lumina/.work/luminati` at `80e1aa6`. Paths below are relative to `src/` unless they start with `docs/`. Everything here was read from the code. Units: u = world unit (16 texels), f = a 60 Hz frame (`F(n) = n/60`, `combat/rules.js:61`), mv = motion value (damage = ATK × mv × roll 0.92–1.08 × mitigation `40/(40+2·DEF)` × crit 1.75 × vuln, `CombatSystem.js:2933-2944`), kb = knockback (u, capped at 3, `rules.js:190`). Knockdown happens when the `knockdown` flag is set or kb ≥ 2.5 (`rules.js:347`; allies `party/rules.js:117`).

Every melee hit the player lands shows the same feedback, so the tables below leave it out. The pieces are an `impact` star (or `crit`), a `hitSpark` burst (6, or 10 on a crit), a damage number, the enemy's white hit flash for 4 f, hit-stop `min(10, base + crit 2 + kill 4)` (bosses use base 5 and get no kill bonus), and a shake: hit 0.05/0.12, crit 0.12/0.2, finisher 0.08/0.15, kill 0.08/0.16. Sources: `CombatSystem.js:2958-2969`, `Feel.js:16-42`, `_impactStar` `CombatSystem.js:1212`.

---

### F.1 Player kits

Each kit's slots are defined in `combat/rules.js` (`SKILLS` :105, `SWORD_SKILLS` :115, `BELL_SKILLS` :127, `PLAYER_KIT_RULES` :334). Its frames are run in `combat/PlayerCombat.js`. All three kits bind skills to U/1, I/2 and O/3; the Healing Draught is on C.

Common resources (`rules.js:72-174`): SP 100, regenerating 45/s after 0.5 s (1.2 s once empty). When SP hits 0 the player is "winded" until SP ≥ 30, and attack recovery runs ×1.35 slower. Each landed melee hit gives +2 MP, at most +4 per swing. MP regeneration is 0.8/s for the traveler, 1.5/s for the swordmaster and 1.0/s for the bellwarden. Stats are HP 100+12/level, MP 40+5, ATK 12+3, DEF 4+1, with a level cap of 10.

#### F.1.0 Shared moves (all kits)

| Move | Frames / cost | Effect | Look | Source |
|---|---|---|---|---|
| Combo A1 | 22 f, SP 5; active f5–7; next at f14, dodge at f8; lunge 0.4 u over f3–7 | sector r 1.6 ±60°, mv 1.0, kb 0.5, poise 10, hit-stop 4 | traveler: named `slash` flat 0.55 u ahead at f5; SFX `swing` | rules.js:211; PlayerCombat.js:519-566 |
| Combo A2 | 24 f, SP 5; active f5–7; next at f15 | sector r 1.6 ±60°, mv 1.1, kb 0.6, poise 12, hit-stop 4 | `slash` with `flip` (backhand) | rules.js:217 |
| Combo A3 (finisher) | 39 f, SP 8; active f10–14; next at f32, dodge at f15; lunge 0.8 u | union of a lane 2.2×1.0 and a sector r 2.0 ±35°; mv 1.8, kb 2.0, poise 30; crit +0.10; hit-stop 7 | `thrust` 0.9 u ahead and `slashBig` 0.5 u ahead; finisher shake; SFX `swingHeavy` | rules.js:223; PlayerCombat.js:539-541 |
| Magnet | soft target picked at f0–2 within 3 u; turns at most 60°; lunge extended to reach | — | — | rules.js:232; PlayerCombat.js:495-517 |
| Dodge roll (move input held) | 22 f, SP 25; i-frames f1–13; 3.2 u over 15 f; attack from f16, skill from f18 | perfect window f1–8 | `footstep` burst ×6, SFX `dodge`; no shake | rules.js:240; PlayerCombat.js:620-661 |
| Backstep (no input) | 16 f, SP 15; i-frames f1–8; 1.8 u back over 10 f | perfect window f1–8 | same | rules.js:245 |
| Perfect dodge | an enemy hit overlaps the player in f1–8; 3 s cooldown | enemies slowed to 0.35 for 0.6 s; player i-frames ≥ 0.6 s; +15 SP, +5 MP | "Perfect!" number, `sparkle` ×10, SFX `perfect`, look pulse (saturation −0.35 plus chromatic aberration 0.004 for 0.6 s) | rules.js:174; PlayerCombat.js:668-681; CombatSystem.js:3683; Feel.js:151 |
| Healing Draught | 30 f, pose `aim`, heals at f18; 1.0 s cooldown; carries max 5 (starts with 3); costs 25 gold | +40 % max HP | `healGlow` ×12 at y+0.9, SFX `drink`; the swordmaster or bellwarden look adds a minor green or warm spark light | rules.js:150-153, 266; PlayerCombat.js:1166-1204 |
| Hitstun / knockdown (received) | hitstun 18 f plus 48 f i-frames; knockdown 36 f down + 18 f get-up, 30 f i-frames after, tech from f24 | — | player flash (2.0, 0.35, 0.3) a 0.7 for 3 f; 15 Hz i-frame blink; shake hurt 0.15/0.25 or knockdown 0.25/0.35; hit-stop 6; red vignette pulse | rules.js:346-347; Feel.js:44-49, 148-149 |
| Level-up | 60 f invulnerable | full refill | named `pillar` following the player for 60 f, `levelSparkle` ×14 | CombatSystem.js:3717-3720 |

#### F.1.1 Traveler (default kit; COMBAT.md §6.6)

| id | Name | Unlock | MP | CD | Frames / shape / numbers | Look | Source |
|---|---|---|---|---|---|---|---|
| skill1 | Whirl Slash | Lv 1 | 10 | 4.0 s | 32 f, pose `spin`; two hits at f6–8 and f14–16 (separate tags); circle r 2.2 around the player; mv 1.2 each, kb 1.4 radial, poise 15; super armour f0–24; dodge from f24; hit-stop 3 | SFX `whirl` at f3; named `spin` (flat, follows the player, 2 loops) at f5 | rules.js:254; PlayerCombat.js:728-746 |
| skill2 | Ember Bolt | Lv 2 | 8 | 1.5 s | 20 f, pose `cast`; projectile released at f8 from ground+0.9; 14 u/s, range 12, radius 0.35; mv 2.0, kb 0.8, poise 20; splash r 1.0 at mv 0.6; auto-aims at a soft target within ±45° and 12 u; dodge from f12, attack from f14; hit-stop 3 | projectile `emberBolt` (billboard, HDR (3.2, 1.5, 0.5) ×1.2); on hit, `impact` + `emberBurst` ×8 and SFX `boltHit` | rules.js:258; PlayerCombat.js:748-780; Projectiles.js:60; CombatSystem.js:2582 |
| skill3 | Radiant Nova | Lv 4 | 18 | 12.0 s | 40 f (`cast`, `spin`, `follow`); burst at f20: circle r 3.2, mv 2.6, kb 2.2, poise 60, knockdown on non-bosses; i-frames f4–20; dodge from f30; hit-stop 5 | GroundMarkers `player` (gold) disc grows r 0→3.2 over f0–20, then a ring band 0.45 wide at the burst; `magicBurst` ×24; shake 0.2/0.3; SFX `nova` | rules.js:262; PlayerCombat.js:782-823 |

#### F.1.2 Swordmaster (Aldric; `player.kit: 'swordmaster'`; DRAGON_CAMPAIGN.md §6.8)

The combo uses the same table as the traveler. Only its look differs, from `SwordmasterFx.swing` (`SwordmasterFx.js:649`):

- Each swing pairs `heroGale` (slate body) with `heroGaleLit` (silver lit layer) as a wind blade, plus bursts `heroWindSpark` and `heroGust`.
- A3 adds the named `thrust` with `heroThrustLit` and a flung `heroGale` (10 u/s), plus a minor steel spark light (`SwordmasterFx.js:658-669`).
- The blade's glow texels charge during the wind-up (`windup` :634).
- Every foe hit gets a `heroCut` mark (`onHit` :1404).

| id | Name | Unlock | MP | CD | Frames / shape / numbers | Look (SwordmasterFx) | Source |
|---|---|---|---|---|---|---|---|
| skill1 | Tempest Edge | Lv 10 | 16 | 6 s | 50 f. The body turns a quarter every 3 f from f6 to f41. Drift 1.6 u/s with move input. Three hits on all foes within r 3.6 at f12–14, f24–26 and f36–39: mv 1.2/1.2/1.7, kb 0.8/0.8/2.4 radial, poise 16/16/32. Super armour to f40; dodge from f40. Hit-stop 3, the last hit 5 | Gather ring `heroCyclone` with `heroGust`; 4 spectral steel swords in 3D (`SpectralBlades`) orbit from f4 and open to r 3.0 by f14, with runes filling hit by hit, and fly out at f40. Bursts `heroWindSpark`, `heroGust`, `heroGlint`. A dim steel field light orbits. Shake hit / finisher per hit. SFX `bladeStorm`, `whirl`, `swingHeavy` | rules.js:282; PlayerCombat.js:835-892; SwordmasterFx.js:716 |
| skill2 | Dragonfang Wave | Lv 10 | 12 | 3.5 s | 30 f; lunge 0.5 u over f5–10. Wave released at f10: 24 u/s, range 10, width 3.0. It pierces and is a lane hit along its path with one tag: mv 3.2, kb 2.2 along the lane, poise 45. It breaks on a rise > 0.9 u or a drop > 2.6 u. Auto-aims like Ember Bolt. Dodge from f16, attack from f20; hit-stop 5 | Three gathering `partySunburst` stars. Crimson `heroGale` swing. The wave is a body `heroWave`, lit `heroWaveLit` and core (halo) riding the front, with a billboard crest `heroFangCrest` / `heroFangCrestLit`. Bursts `heroFangEmber`, `heroGust`. A crimson light rides the front. On a wall: `heroDebris`, `partySunburst` flash, SFX `wallHit`. Foes hit get a `heroBite` mark. Finisher shake; SFX `swordWave` | rules.js:297; PlayerCombat.js:898-993; SwordmasterFx.js:901-1010 |
| skill3 | Skyfall Judgement | Lv 10 | 30 | 15 s | 66 f. A leap toward a soft target within 7 u (lands 0.8 u short; else 2.5 u forward; max 5.5 u), arc 2.4 u high from f8 to f28. Slam at f28: circle r 5.5, mv 5.0, kb 3.0, poise 120, knockdown (not bosses). I-frames f3–34; dodge from f46; hit-stop 8 | Dark engraved `heroSigil` and `heroRunes` at the landing point. Crouch star (`partySunburst`). A giant gold sword (3D `SpectralBlades`) falls from f12, y 10. Impact: `heroCrack`, `partySunburst` flash, `heroDebris` ×24, `heroDustRing` ×12, `heroHoly` ×12; two gold GroundMarkers `player` shock rings (r 0.6→6.7 over 0.42 s and 0.4→5.5 over 0.5 s, dimmed by night and low sun). Shake 0.42/0.6. A gold light rides the sword point, flashes at the slam (11), then holds low. The sword dissolves into `heroMote`. SFX `skyfall`, `quake` | rules.js:310; PlayerCombat.js:1000-1132; SwordmasterFx.js:1022-1144 |

#### F.1.3 Bellwarden (Linnet; `player.kit: 'bellwarden'`; EVERMERE_CAMPAIGN.md §5.5)

The hammer combo replaces `COMBO` (`kits/bellwarden.js:58-77`). Every blow adds one resonance mark (max 3 per foe, fading 6 s after the last). Peal and the Carillon chord consume marks.

| Move | Frames / numbers | Look (BellwardenFx) | Source |
|---|---|---|---|
| H1 | 28 f, SP 6; active f6–8; sector r 1.8 ±65°; mv 1.1, kb 0.8, poise 20; hit-stop 5 | bronze `hammerArc` crescent; `bellSpark` on the foe struck; hammer glow texels charge and flash | bellwarden.js:58; BellwardenFx.js:626-705 |
| H2 | 30 f, SP 6; sector r 1.8 ±65°; mv 1.25, kb 0.9, poise 24 | `hammerArc` flipped | :64 |
| H3 overhead slam | 48 f, SP 9; active f13–16; lane 2.4×1.3 + sector r 2.2 ±40°; mv 2.05, kb 2.2, poise 60; also a ring r 1.6 at 1.4 u ahead; hit-stop 8; shake finisher ×1.5 | `hammerCrack` crater, small `bellRingS`, bursts `bellPuff`, `bellSpark`, `heroDebris`; minor spark light | :70, :82, :312-334; BellwardenFx.js:664 |
| Marks (on foes) | +1 per blow, per Toll ring and per Carillon drop; max 3; 6 s | 1–3 small gold `bellMark` billboards over the foe that pop on gain; a burst (`bellRingS` + `bellShimmer`) when consumed | bellwarden.js:87; BellwardenFx.js:1058-1093 |

| id | Name | Unlock | MP | CD | Frames / shape / numbers | Look | Source |
|---|---|---|---|---|---|---|---|
| skill1 | Peal | Lv 3 | 8 | 3 s | 32 f; lunge 0.25 u. At f9 a forward cone r 5 ±35° hits each foe once: mv 1.4, kb 1.6, poise 60 (breaks Hushguard armour). Consumes marks for +50 % mv each. Also tolls a planted bell it reaches. Dodge from f18; hit-stop 4; finisher shake | flat `bellPeal` cone, `bellWave` billboards travelling outward at 8 u/s, `bellShimmer`, a burst on each detonated foe, minor light | bellwarden.js:95; :481-521; BellwardenFx.js:743 |
| skill2 | Toll | Lv 5 | 16 | 9 s | 34 f. Plants a spectral bell at a soft target within 6 u (else 3 u ahead), landing at f12. It stands 6 s and tolls at once, then every 1.5 s. A hammer blow that reaches it (r 0.9) tolls it at once (at most once per swing, ≥ 0.9 s apart). Each toll is a ring r 3.5: mv 0.8, poise 15, pulls foes 0.6 u inward, adds a mark. While standing it is warmth (a safe zone from the Hush Bell pulse). Hit-stop 3 | 3D `SpectralBells` bell takes shape and falls; `hammerCrack` under it; `bellPuff`, `heroDebris`. Each toll: the bell swings, its sound bow flares, a broken `bellArc` ring (orbit segments) rolls out to r with an echo, plus `bellWave` and `bellShimmer`; the field light flashes. It dissolves crown first into `heroMote` | bellwarden.js:107; :566-640; BellwardenFx.js:788 |
| skill3 | Carillon | Lv 8 | 30 | 18 s | 72 f; super armour to f60. Four bells drop 2.4 u around her (front, right, back, left) at f6/18/30/42. Each landing is a ring r 2.0: mv 0.9, poise 20, +1 mark. Chord at f54: every foe within r 8 takes mv 1.6 × (1 + 0.375 × marks), poise 40, and a 2.5 s stun if not a boss. A boss carrying 3 marks takes a 300 poise blow. Hit-stop 6; shake 0.3/0.45 (drops shake hit×2) | Four 3D `SpectralBells` drop, each with `bellRingS`, a rising `bellNote` glyph, `bellPuff` and `bellShimmer`. At the chord all four swing and flare, a great `bellArc` ring rolls to 8 u, plus `hammerCrack`, `bellPuff` ×14 and `heroDustRing` ×10. The field light gathers and flashes on each note and the chord. Stunned foes get the named `stun` stars | bellwarden.js:124; :646-742; BellwardenFx.js:886 |

---

### F.2 Party classes

Stats are in `party/rules.js` (`CLASS_STATS` :34, `KIT` :181, `VQ_CLASSES` :48 = cleric, icemage, greatshield). Classes 1–3 (warden, ranger, mystic) are the Cinderwatch/Evermere generic classes; 4–6 are Vanquish's heroes, which have two skills each. `PARTY_CLASSES` (`engine/level/PartyRules.js:159`) lists exactly these six classes.

Common rules:

- **Dodge roll:** 20 f, i-frames f1–13, 3 u, 1.1 s cooldown. It rolls out of an `enemy` marker with progress in [0.3, 1), or any `magma` marker, when `evade: on` (`MemberCombat.js:1686`).
- **Hurt:** 14 f, then 0.5 s i-frames. Knockdown: 36 + 18 f, then 0.6 s i-frames.
- **Down:** at HP 0. It gets up 2 s after the fight with 30 % HP. VQ heroes also rally after 25 s (`VQ_AI.rally`).
- **Party ATK scale:** ×1 / 0.85 / 0.72 for 1 / 2 / 3 members fighting.
- **Support pace:** with `heal: often`, the basic-attack pause and the skill cooldowns are ×2.
- **Ally hit feedback:** an `impact`/`crit` star (`ALLY_STAR`), `hitSpark`, and quieter SFX (`CombatSystem.js:2782`).

#### F.2.1 Non-hero AI rule (`MemberCombat._think`, :584)

The member takes the first action that applies, in this order:

1. If the boss arena is sealed and it is outside, it waits at the gate.
2. Evade.
3. Mend, when `heal` ≠ never, Mend is off cooldown and MP is enough. Thresholds are low 0.3, half 0.5, often 0.75. The target is the lowest HP fraction below the threshold among the player and members, counting Mends already being cast on them (`_pickHeal` :1162). It walks to within range first. At the heal frame it re-checks the target and may switch target or fizzle, refunding the MP.
4. Retreat when its own HP is below the `retreat` threshold (0.25 or 0.5).
5. Fight its target, picked by `rule.target` (`_pickTarget` :717: leader, nearest, weakest, strongest, or ranged-token foes). It uses its skill if `_skillReady` (:1097: skills ≠ never; `save` keeps the Mend's MP) and `_skillSuits` (:1112); otherwise its basic attack.
6. Hold a spot 1.8 u beside the player.

Rule presets are `PartyRules.js:114` (balanced, aggressive, guardian, support, hunter, passive).

| Class (role) | Move | Numbers | AI use | Look | Source |
|---|---|---|---|---|---|
| warden (melee, spear) HP 82 MP 30 ATK 6 DEF 3.5 | basic: 2-thrust combo | T1 20 f, active f7–9, sector r 1.7 ±35°, mv 1.0, kb 0.5, poise 10, lunge 0.3. T2 26 f, r 1.8, mv 1.3, kb 1.2, poise 16. Pause 0.75 s; reach 1.35 u + foe radius | in reach and `atkCd` ≤ 0; steps aside if standing in front of the player on screen | named `thrust` ×0.85 at 0.85 u ahead; SFX `swing` / `swingHeavy` | rules.js:182-198; MemberCombat.js:1880 |
| | skill: Sweep | 10 MP, 7 s; 32 f `spin`; circle r 2.2 at f10–13; mv 1.3, kb 2.2, poise 30; super armour to f16 | ≥ 2 foes within 2.5 u of itself, or a tough foe (elite/boss) in reach, at the same height | named `spin` ×0.95 following it at f8; SFX `whirl` | :200; MemberCombat.js:1944 |
| | mend | 10 MP, 6 s; 34 f, heals at f20; 25 % + 6; range 8 | heal gate (above) | `healGlow` ×6 on the caster and ×12 on the target; SFX `pickup` | :204; :2190-2245 |
| ranger (ranged, bow) HP 62 MP 30 ATK 7 DEF 2 | basic: arrow | 26 f, release f14; 16 u/s, range 12, radius 0.25; mv 1.0, kb 0.4, poise 6; pause 0.5 s; leads the target (≤ 3 u) | at standoff with line of sight; backs off if closer than standoff − 1.6 | projectile `arrow` (flat, (1.6, 1.35, 1.0)); SFX `arrow` | :207; :1980-2005 |
| | skill: Volley | 9 MP, 7 s; 32 f, release f18; 3 arrows at ±12°; mv 0.9, kb 0.6, poise 8 | d ≤ 11, line of sight, and (tough, or ≥ 2 foes within 3 u of the target) | three `arrow`s | :212 |
| | mend | as warden | | as warden | :217 |
| mystic (caster, staff) HP 58 MP 60 ATK 6.5 | basic: ember bolt | 26 f, release f14; 12 u/s, range 11; mv 1.15, kb 0.6, poise 10; splash r 0.8 at mv 0.45; pause 0.75 s | as ranger | projectile `emberBolt`; SFX `bolt` | :220; :2008 |
| | skill: Flare | 12 MP, 8 s; 30 f; at f16 a delayed burst on the target's spot after 0.7 s: circle r 1.9, mv 2.2, kb 1.5, poise 35. No ground marker | d ≤ 10, line of sight, and (tough, or ≥ 2 foes within 2.3 u of the target) | `sparkle` ×6 at the spot; `emberBurst` ×2 every 0.15 s while pending; then `impact` ×1.5, `magicBurst` ×16, `emberBurst` ×10; SFX `hexBurst` | :227; :2101-2170 |
| | mend | 12 MP, 4.5 s; 30 f, heals at f18; 35 % + 10; range 9 | | as warden | :230 |

#### F.2.2 Vanquish heroes (`VQ_CLASSES`; AI `_thinkHero` :2758, `_heroSkill` :2858)

Hero AI order:

1. Wait at the gate if outside a sealed arena.
2. Evade.
3. Revive (cleric only).
4. Sanctuary (cleric only).
5. Mend (cleric). Mend keeps the revive's 24 MP in reserve unless the player is below 25 % HP; it then spends the reserve, on the player only.
6. Retreat.
7. Fight: a skill if one suits, otherwise the missile or combo.
8. Hold a spot.

`skillGap` 1.6 s separates two skills. Casters keep `radius + 2` u from a boss. Area spells land on the target's spot pulled halfway toward the centroid of fighters within 2.5 u (`_spellSpot` :2945). Enemies switch target to an ally on threat (`ALLY.threat` 1.25 etc.).

**Light and halo for all three.** Their looks take one field light plus at most one minor spark light from `VfxLights` (never a lamp). Bright quads use the FxQuads halo.

| Class | Move | Numbers | AI use | Look | Source |
|---|---|---|---|---|---|
| **cleric** (Seraphine) HP 64+7/Lv, MP 72+7, ATK 6, DEF 2.6; in-fight MP regen 2.5/s | basic: Holy Bolt | 26 f, release f14; 11 u/s, homing 5 rad/s; range 11; mv 1.15, kb 0.5, poise 10; splash r 1.0 at mv 0.45; pause 0.7 s | as caster basic | `partyHolyOrb` body + haloed core riding a minor light; `holyTrail`; on impact `holySpark` and a `partyRing` splash ring sized to the splash; staff `partySunburst` star; glow texels charge | rules.js:242; MemberCombat.js:3145-3170, 3324-3560; HolySpellFx.js |
| | skill: Judgement | 18 MP, 12 s; 40 f, cast at f18, range 10. A sun glyph r 3.5 on the spot. After 0.45 s, six pillars on a ring of 2.3 u, 0.06 s apart (each circle r 1.3, mv 0.95, kb 0.5, poise 12). 0.16 s after the last, the great pillar: r 3.5, mv 1.5, kb 1.6, poise 30, hit-stop 4. Shake 0.16/0.25. Keeps max(revive + Mend MP, 35 % max MP) | spot within 10 u with line of sight, and (tough, or ≥ 2 fighters within 3.2 u of the spot) | `partyGlyphHoly` over a filling `partyIceGlow` disc; sigils; `partyPillar` (thin bright core, then the body 2 f later); stars sliding in; great pillar plus a `partyRing`; burn marks; `holyAscend` and `holyMotes`; field light with a payoff flash held through the hit-stop | :248; :3656-3680 |
| | skill2: Sanctuary (a heal) | 26 MP, 24 s; 48 f, at f26. Circle r 4 for 4 s on the middle of the hurt; 8 ticks heal 40 % + 16 in total; `sys.ward(0.3, 6 s)` | ≥ 2 party members below (heal threshold + 0.2, cap 0.9) within range + r; or 1 such member and ≥ 4 foes within 5 u of the player. Keeps the revive MP unless the player is critical | green `partyGlyphHoly`/`partyRing` bloom with a continuous ward ring at its edge; a pulse ring and light pulse each tick; `lifeRise`, `lifeMotes`, `lifeAscend`; `partyWardRing` and a shimmer highlight on each warded hero; SFX `sanctuary` | :260; :3036-3076, 3686 |
| | mend | 14 MP, 4 s; 30 f at f18; 45 % + 16; range 10 | heal gate | three `partySunburst` stars fly from her staff to the target; a green column of light on arrival; `lifeRise`; minor light | :266; :2232-2236 |
| | revive | 24 MP, 10 s; 66 f (`tuck` kneel, `cast`), raises at f50 with 40 % HP and 1.5 s i-frames; kneels within 1.6 u | a fallen member within 9 u of the player (anywhere in a closed arena), no foe within 2.5 u (1.25 u once down ≥ 6 s) | glyph and filling disc under the fallen; its sprite warms; a pillar of light, `holyAscend`; a failed raise burns out; field light | :268; :2975-3025, 3240-3290 |
| **icemage** (Lyra) HP 56, MP 74, ATK 7 (hardest hitter) | basic: Frost Lance | 24 f, release f12; 17 u/s straight with lead; range 12, radius 0.26; mv 1.25, kb 0.4, poise 8; chill 2.5 s at slow 0.3 (never a boss; not re-applied while the foe is chilled > 0.5 s); pause 0.65 s | as caster basic | `partyIceLance` (blue-violet body) + `partyIceLanceLit` (cyan, halo); `partyFrostShards` ×4 at launch; `partyFrostTrail`; impact spark light (minor); staff star and glow texels; SFX `iceSpike` | :277; :3382-3554 |
| | skill: Blizzard | 20 MP, 12 s; 40 f, at f20, range 11. A storm r 4 for 4 s with 5 ticks every 0.8 s: mv 0.55, kb 0.15, poise 6, chill 1.2 s at slow 0.5 | not a boss, spot within 11 u, ≥ 3 fighters within 3.6 u (only after the Tomb check fails) | Layered: far `partySnowStreak`, mid `partySnowfall`, circling `partyIceFlake`, near `partyIceBokeh` (blurred by depth of field), hail landing as `partyIcePuff`, `partyIceMist` banks, `partySwirl` vortex (soft edge). `GroundFrost` builds up. `Weather.gust` bends the grass. A dim flickering cold light. SFX `blizzard` | :283; :3722 |
| | skill2: Glacial Tomb | 24 MP, 16 s; 44 f, at f22, range 10. A frost glyph for 0.5 s, then 14 spikes: circle r 3.5, mv 2.4, kb 0.3, poise 40, freeze 2.5 s (a boss is only chilled 0.2), hit-stop 4; shatters 0.9 s later. Shake 0.18/0.25 | (≥ 4 fighters within 3.2 u, or a tough target), else ≥ 3 within 3.2 u when Blizzard does not suit | Anticipation: `GroundFrost` cracks race from the staff to the ring with a star and charge light on the tips; `partyGlyphFrost` fills; `partyIceGlow` soft disc. Eruption: 3D `IceCrystals` (lit, shadow-casting) burst ring by ring (outer first, the great spike last) and overshoot; cold light flash. Hold: glints slide down the spikes; frozen foes wear `partyIceShell` + `partyIceShellLit`. Release: `partyIceShard`/`Lit` shards bounce and dissolve; `partyIceChunks`, `partyFrostGlint`. SFX `iceSpike`, `freeze`, `iceShard` | :288; :3739-3755; IceSpellFx.js:37-49 |
| | mend / revive | none | | | :294 |
| **greatshield** (Brannoc) HP 108+12, MP 32, ATK 6, DEF 6+1.2 | basic: Shield Bash, then mace | Bash 22 f: sector r 1.6 ±50°, mv 0.9, kb 1.4, poise 24, stun 0.5 s (not bosses). Mace 28 f: sector r 1.8 ±65°, mv 1.5, kb 1.1, poise 26. Pause 0.6 s; reach 1.4. Super armour: no hitstun from any hit without knockdown | melee in reach | Bash: a ring-of-rays clang (`partySunburst`) on the shield, `earthShieldSpark`, a spark light. Mace: `slashBig` steel smear. A blocked blow rings gold off the shield (`block`, rate-limited) with SFX `guard`. The crest glow kicks on each bash | :298-312; :3301-3312; EarthSpellFx.js:54-56 |
| | skill: Bulwark | 16 MP, 16 s; 40 f, at f16. War cry `sys.taunt(self, r 6, 5 s)` and `sys.ward(0.25, 6 s)`; armour to f40. Shake 0.14/0.3 | ≥ 2 non-boss foes within 6 u targeting someone else, or ≥ 4 foes within 6 u, or the player < 50 % HP with a foe within 3 u of the player and the player within 6 u (`_bulwarkSuits` :2901) | Wind-up: a faint `partyGlyphWard` seed. Cry: gold clang, amber roar `partyRing`, `earthDustRing`, `earthCrySpark`, a warm flash that slides to the dome and turns azure; an amber snap ring on each taunted foe. 3D `WardDome` hex lattice grows over the party with sweeping bands, then dissolves into `earthWardMote`. Azure `partyWardRing` under each warded hero for 6 s. SFX `taunt`, `ward` | :317; :3798-3812 |
| | skill2: Earthshatter | 18 MP, 12 s; 46 f, slam at f22 (doc: 0.9 u ahead). Circle r 3.5: mv 2.0, kb 2.6, poise 50, knockdown, hit-stop 5. 0.14 s later a ring of 9 spikes (ring 1.0–3.8): mv 0.9, kb 1.4, poise 20. Armour to f46. Shake 0.32/0.35 | same height, and (≥ 2 fighters within 3.2 u, or a tough foe in reach + 0.4) | `earthGrit` at f8/14/20 with a charge light from f14. Impact: `partyCrack` flashes gold and cools dark within ≈ 0.45 s, a matte shock `partyRing`, `earthDustRing`. 3D `RockSpikes` sweep up from his side, with small ones on the far half. They crumble into `earthChips`, `earthChipPuff`, `partyRubble`, `partyDust`. SFX `earthshatter`, `crash` | :323; :3764-3792; EarthSpellFx.js:36-45 |

---

### F.3 Enemies and bosses

The roster is `ENEMY_DEFS` (`combat/defs.js:134`, plus `defs/brutes.js`, `swarm.js`, `dragon.js`, and the Evermere `packs/evermere/defs*.js`). Brains are in `ai/*.js` and `packs/evermere/*.js`.

**Telegraph grammar (COMBAT.md §7.3, `ai/index.js:23-26`):**

- Every wind-up is ≥ 18 f, with a wind-up highlight (1.6, 0.7, 0.3) pulsing 0.45↔0.9 at 8 Hz (`Enemy.js:148`).
- Non-bosses wind up only while on screen (`ctx.onScreen`, NDC 0.92).
- Areas of r ≥ 1.5 and all ranged attacks get a ground marker (style `enemy`, red-orange). Its fill progress reaches 1 when the attack resolves; the rim goes white for 5 f.
- Lanes track, then lock for the last 12–15 f, and the rim flashes on lock.

**Shared enemy states and visuals:**

- States run dormant → idle → notice → engage ⇄ windup → active → recover.
- Hitstun is 13 f; stagger (poise broken) is 36 f, 60 f for the boar (`Enemy.js:64-66`).
- Elites get a gold shimmer highlight (`Enemy.js:149`) and ×1.8 HP, ×1.25 ATK, ×1.5 poise, ×2.5 XP, ×3 gold (`defs.js:234`). Level scaling: HP +20 %/level, ATK +12 %/level.
- Death is a `deathPoof` ×8 (slime: `gooPoof` ×12) (`Enemy.js:709, 2117`).
- **Attack tokens:** melee budget 3, ranged 2. The token is a per-kind cost.

#### F.3.1 Cinderwatch kinds (COMBAT.md §7.7)

| Kind | Role / stats (Lv 1) | Attacks: telegraph and timing | Look | Source |
|---|---|---|---|---|
| slime (Moss Slime) | swarm chaser; HP 26, ATK 8, poise 0; hops 2.2 u/s | **Leap**: d ≤ 2.2; 30 f wind-up; 2.4 u leap over 12 f; circle r 0.6 each sub-step; mv 1.0, kb 0.8; no marker; recover 42 f; cooldown 84 f | SFX `slimeHop`; `footstep` dust; death `gooPoof` | ai/slime.js:1-36, 114 |
| goblin (Bramble Goblin) | melee flanker; HP 48, ATK 11, poise 15; circle-strafes at 2.5–3.5 u | **Slash**: d ≤ 3.2; 27 f wind-up (steps in; facing locks for the last 6 f); 0.8 u lunge over 6 f; sector r 1.3 ±60°, mv 1.0, kb 0.6. 30 % chance of a follow-up (18 f wind-up, 0.4 u lunge). Recover 36 f; cooldown 60 f. **Back-hop**: 20 % chance when the player swings within 2 u; 1.2 u over 10 f; cooldown 90 f. No marker | SFX `windup`, `swing` | ai/goblin.js:1-204 |
| archer (Thorn Archer) | kiter, keeps 5–9 u; HP 34, ATK 10 | **Shot**: 4.5 ≤ d ≤ 11, line of sight; 48 f wind-up with a lane marker (width 0.5, length ≤ 14) tracking a 0.25 s lead for 33 f, locked 15 f; `arrow` 14 u/s, range 14; mv 1.0, kb 0.4. Every 3rd shot is a 3-arrow volley at ±12° (three lanes). Recover 18 f; cooldown 108–144 f. **Shove**: player within 1.6 u for 60 f; 18 f wind-up; sector r 1.2 ±50°, mv 0.6, kb 1.5 | `arrow` projectile; SFX `windup`, `arrow` | ai/archer.js:9-52, 137-260 |
| shaman (Hex Shaman) | caster/support, keeps 5–8 u; HP 40, ATK 14; staff glow (0.5, 1.0, 0.6) ×2 | **Hex Flame**: d ≤ 10; 24 f wind-up; circle marker r 1.6 at a 0.3 s lead, filling over 66 f while it channels; erupts mv 1.3, kb 1.0. A placed hazard still erupts if the shaman is interrupted. Cooldown 150 f. **Mend**: every 480 f on an ally within 6 u below 60 % HP; 30 f cast; +30 % HP. **Blink**: player within 2.5 u for 60 f; 12 f tuck; reappears ≤ 4 u away; cooldown 300 f | eruption `emberBurst` ×10 with SFX `hexBurst`; heal `healGlow` ×8; blink `deathPoof` ×8 | ai/shaman.js:1-43, 140-260 |
| bat (Cinder Bat) | flier swarm; hover 1.3; HP 24, poise 0, kb ×1.5; eyes glow | **Swoop**: every 90–180 f; 18 f wind-up with a circle marker r 0.6 at the dive point; dives at 9 u/s through it at hover 0.6; circle r 0.5; mv 1.0, kb 0.4; 36 f climb | SFX `batScreech`; falls 12 f on death | ai/bat.js:1-33 |
| boar (Ironhide Boar) | heavy charger; HP 120, ATK 20, poise 60, token cost 2 | **Charge**: 4 ≤ d ≤ 10; 60 f paw wind-up (`footstep` dust ×4 every 12 f); lane marker 1.4 wide over its free run ≤ 12 u, tracking 45 f, locked 15 f; 10 u/s, armoured; circle r 0.8 ahead; mv 1.4, kb 3.0, knockdown. Into a wall or collider: stunned 120 f, vuln 1.5, exposed (named `stun` FX, shake 0.3/0.4). Otherwise a 30 f skid and 72 f recover. Elites charge twice. **Gore**: d ≤ 2; 27 f wind-up with a sector marker r 1.6 ±45°; 0.9 u lunge; mv 1.0, kb 1.5; recover 45 f | SFX `boarSnort`, `boarCharge`, `stun` | ai/boar.js:1-51, 117-322 |
| dummy (Straw Dummy) | passive; HP 9999, infinite poise and mass | none; wobbles (`hurt` / `hurt2`, 8 f each); refills 120 f after the last hit | — | ai/dummy.js |

**Golem (Cinderheart), boss.** HP 5200, ATK 22, poise 250 per phase, phases at 70 % and 35 %, adds = bats (`ai/golem.js:1-89`; moves :601-919).

- **States:** dormant (guarded) → intro 108 f (guarded; `bossAwake` at f60) → engage, with 54–84 f gaps (36–60 f in phase 3) and no move three times in a row. Phase-3 wind-ups are ×0.75, never below 18 f.
- **Hammer Slam:** d ≤ 4.5. 60 f wind-up; circle r 2.6 centred 1.6 u ahead; mv 1.5, kb 2.5, knockdown; shake 0.45/0.5; `dust`; 60 f punish window. From phase 2 it leaves a magma pool r 2.0 for 240 f (flat 6 every 30 f). In phase 3 it becomes the Shockwave Slam: 3 rings 18 f apart at 6 u/s to r 10, 0.6 wide, mv 1.2, kb 1.5.
- **Sweep:** the player > 70° off its facing within 3.2 u for 60 f total, or a 20 % chance at d ≤ 3. 48 f; circle r 2.6; mv 1.0, kb 3.0.
- **Rock Toss:** d > 7. 36 f; 3 landing circles r 1.4 (0.5 s lead, ±2.5 u apart) fill over 72 f while 3 `boulder` arc projectiles fly (mv 1.1, kb 1.5). Landing: `dust` ×1.6, `emberBurst`, SFX `slam`.
- **Ember Rain:** phase ≥ 2. 30 f roar; 6 circles (10 in phase 3) r 1.2, 15 f apart, each filling 66 f (mv 1.2, kb 1.0, `emberBurst` ×10, SFX `hexBurst`); a 90 f channel during which it is hittable.
- **Charge:** phase ≥ 2, d ≥ 5. 54 f; lane 1.8 wide, tracking 42 f, locked 12 f; 12 u/s, armoured; circle r 1.4; mv 1.5, kb 3, knockdown. Into a brazier: stun 120 f, shake 0.35/0.45. At the arena edge: a 45 f skid.
- **Phase 2:** 120 f guarded roar, shake 0.45/1.2, push ring r 0.5→5 (kb 3, mv 0), glow ramps to 2.0; 3 bats at the corners, and 3 more at ≤ 52 % if fewer than 2 are alive.
- **Phase 3:** 90 f exposed kneel (every hit crits, damage capped at 8 %/hit), then a 60 f guarded roar; glow 2.4↔3.4 at 2 Hz.
- **Arena:** `BossArena.js` — a closed gate of `wallFlame` quads every 0.6 u, HDR (1.5, 0.75, 0.25); a `barrier` rect outline; an `embers` emitter in phase 2.
- **Death:** hit-stop 12, shake 0.5/0.8, `victoryEmbers`, `victorySparkle`.

#### F.3.2 Vanquish the Evil Dragon kinds (DRAGON_CAMPAIGN.md §5.3, §6.7; COMBAT.md §29)

| Kind | Role / stats | Attacks | Look | Source |
|---|---|---|---|---|
| drakeborn (Drakeborn Ravager) | heavy brute; HP 250, ATK 16, DEF 7, poise 110; besieges houses when idle (no hitbox) | Opens with a 24 f roar. **Cleave**: d ≤ 3; 30 f wind-up with a sector marker r 2.6 ±70° (locked for the last 8 f); 6 f active, 0.6 u lunge; mv 1.3, kb 2.0. 35 % chance of a backhand (20 f, mv 1.1, kb 2.4). Recover 36 f; cooldown 54 f. **Ground Slam**: d ≤ 3.6, 30 %, cooldown 6 s; 42 f; circle marker r 3.0 at 1.1 u ahead; mv 1.6, kb 2.8, knockdown; then a ring r 1.2→5.4 at 10 u/s, 0.9 wide, mv 0.5, kb 1.6. **Charging Gore**: 4 ≤ d ≤ 9, 55 %, cooldown 7 s; 44 f; lane 1.6 wide over its free run ≤ 10 u, tracking 32 f, locked 12 f; 9.5 u/s, armoured; circle r 1.0; mv 1.5, kb 3.2, knockdown. Into a wall: crash, shake, reels 70 f ×1.3 damage | `bruteCleave` ground crescent (flat, 80×44 px); `bruteQuake` ember cracks (×1.6); `dust`, `bruteDust`, `bruteRubble`, `bruteSparks`, `bruteSplinters`; siege `impact` on walls. Death: 30 f, then a 40 f fade with `bruteEmbers`. Ember-eye glow | ai/drakeborn.js:1-64, 518-790 |
| ashhound (Ashen Hellhound) | fast pack hunter; HP 290, ATK 16, poise 40; rakes walls when idle | Circles at 2.8–4.6 u; opens with a 12 f snarl. **Bite combo**: d ≤ 2.4; 20 f wind-up with a sector marker r 1.7 ±45°; 5 f active, 1.0 u lunge; mv 0.85, kb 0.6. A second bite always, a third at 45 % (each 18 f with its own marker). Cooldown 40 f. **Pounce**: 3.5 ≤ d ≤ 7.5, 50 %, cooldown 5 s; 30 f; landing circle r 1.6 at a 0.25 s lead, filling over the wind-up and the 22 f leap (1.1 u arc); mv 1.25, kb 2.2, knockdown. **Fire Breath**: 1.5 ≤ d ≤ 5.5, 40 %, cooldown 8 s; 36 f with a cone marker r 5 ±28° (locked for the last 10 f); 54 f of fire with a fresh tag every 9 f (mv 0.32, kb 0.25: 6 ticks) | `bruteBite` snap; `bruteBreath` flat fan replayed every 24 f; `bruteBreath`/`bruteFireCore` particles down the cone; `bruteQuake` ×0.75 on landing; `bruteClaw` on walls; mane `uGlow` | ai/ashhound.js:1-89, 331-560 |
| wyrmcaller (Wyrmcult Pyromancer) | fire caster, keeps 5.5–9 u; HP 125, ATK 18; besieges by throwing fire at roofs | **Fireball**: d ≤ 11; 28 f; lobbed to a 0.35 s lead, landing after 0.8 s in a circle marker r 1.8; explodes mv 1.25, kb 1.8 (a delayed hazard, cancelled if the caster dies). Cooldown 2.6 s. **Flame Pillars**: d ≤ 10, 45 %, cooldown 9 s; 34 f channel; 3 circles r 1.5 under the target 0.45 s apart, each filling 0.8 s; mv 1.1, kb 1.4. **Blink**: target within 3 u for 30 f, or 2 melee hits in 1.5 s; 14 f; moves up to 5 u away, leaving a fire circle r 1.6 that erupts after 0.5 s (mv 0.6, kb 1.4); cooldown 5 s | projectile look `bruteFireball` (trail `bruteEmbers`, hit `bruteFireBlast` ×18 + `impact` ×1.8 + SFX `explosion`); `bruteSigil` under itself; a smaller sigil under each pillar; `brutePillar` billboard; `bruteFlames` (blink, roofs, death); `bruteGather`, `bruteBlink`, `bruteFireCore`, `bruteSmoke` | ai/wyrmcaller.js:1-95, 390-560 |
| kobold (Scalekin Skirmisher) | pack spear (pack AI helpers `packInit` etc.); HP 150, poise 14; token cost 0.75 (4 attack at once); ring 3.3 / 4.4 u | **Jab**: within 4.4 u, runs in to 2.4 u; 20 f wind-up darting in at 5 u/s (locked for the last 6 f); 5 f lane 1.75×0.55; mv 0.85, kb 0.4. 35 % chance of a second jab (18 f). No marker. Recover 22 f; cooldown 70–150 f (×0.6 when flanking). **Lunge**: 3.4 ≤ d ≤ 5, cooldown 300–480 f; 32 f with a lane marker 0.8 wide (tracking 20 f, locked 12 f); dash over 12 f; circle r 0.55; mv 1.25, kb 1.0. Hops back 1.1 u after each strike; 15 % back-hop when the player swings | named `thrust` glint; `swarmDust`; SFX `yip` | ai/kobold.js:1-37, 499-625 |
| whelp (Ashwing Whelp) | pack dragonling, hopping gait; HP 160, poise 0 | **Bite**: within 4.8 u, hops in to 2.6 u; 22 f; hop-bite 1.3 u over 9 f; sector r 1.05 ±55°; mv 1.0, kb 0.5. Hops back 1.4 u at 75 %. Cooldown 80–160 f. **Fire Spit**: 4 ≤ d ≤ 8, cooldown 300–450 f; 34 f with a lane marker 0.5 wide (≤ 8.5 u, 0.3 s lead; tracking 22 f, locked 12 f); glob 9 u/s; mv 0.85, kb 0.3 | `swarmSpit` projectile (`swarmSpark` at the end); throat glow ×1.6→×4; death `swarmSpark` | ai/whelp.js:1-77, 262-391 |
| emberimp (Ember Imp) | flier on a high ring (5.0 / 5.9 u, hover 1.6); HP 100, poise 0, kb ×1.5; ranged token | **Fire Orb**: 2.5 ≤ d ≤ 9, cooldown 150–260 f; 30 f with a lane marker 0.45 wide (≤ 10 u; tracking 18 f, locked 12 f); 8.5 u/s; mv 0.85, kb 0.3. Every 3rd cast throws 2 orbs at ±9°. **Diving Burst**: 2.5 ≤ d ≤ 6.5, cooldown 360–540 f (the first after 5–10 s); 30 f rising to 2.2 u with a circle marker r 1.5 at a 0.2 s lead filling to 0.7; dive at 11 u/s, filling to 1 on landing; circle r 1.5, mv 1.2, kb 1.2; small shake; hangs low 14 f (open to a riposte), climbs 36 f | `swarmOrb` projectile; named `swarmBurst` (flat), `swarmFlare` ring of streaks, `swarmAsh`, `swarmSpark`; glow ×1.3→×3.2; SFX `cackle`, `screech` | ai/emberimp.js:1-71, 220-386 |

**Dragon (Vorthrax), boss.** HP 8000, ATK 34, poise 1800, phases at 65 % and 30 %, adds = whelps (`ai/dragon.js:1-125`; moves :932-1606).

- **Intro:** 270 f — descends out of the sky with its `DragonShadow`, touches down at f150, roars at f215.
- **Gaps:** 45–75 f (36–60 f in phase 2, 24–45 f in phase 3). Phase-3 wind-ups are ×0.8. Turn rate 90/110/140 °/s.
- **Claw:** d ≤ 5.8. 32 f; sector r 5.6 ±55°; 8 f; mv 1.4, kb 2.6; 34 f recover.
- **Bite:** 3–7 u. 26 f; circle r 1.9 at the snout 4.6 u ahead (it tracks); mv 1.9, kb 1.6; 40 f punish window.
- **Tail Sweep:** the player behind it for 36 f, or within 6 u. 40 f; sector r 6.6 ±115° behind; 10 f; mv 1.25, kb 3.6, knockdown.
- **Fire Breath:** d ≤ 11. 54 f inhale with the whole sweep area marked. Then 96 f sweeping ±35°: sector r 9.5 ±16° hitting every 10 f (mv 0.5, kb 0.8). Leaves 4 magma patches r 1.4 for 5 s (5 damage per 0.5 s).
- **Wing Gust:** phase ≥ 2, d ≤ 8. 36 f; sector r 10 ±38°; 18 f; mv 0.3, kb 5.5.
- **Stomp:** d ≤ 4.2. 42 f; circle r 3.4; mv 1.6, kb 2.8, knockdown; then 1/2/3 rings by phase, 16 f apart, at 7.5 u/s to r 11, 0.8 wide (mv 1.0, kb 1.8).
- **Flight:** phase ≥ 2; right after the phase-2 roar, then every 32 s. Take-off 50 f; climbs out of sight for 60 f (guarded, only its shadow shows). A barrage of 6 (or 10) circles r 1.7, each filling 66 f under a falling fireball (mv 1.3, kb 1.5). Then a dive lane 3.2 wide from the far side through the player (tracking 54 f, locked 18 f); a swoop at 22 u/s, armoured, r 2.2, mv 1.7, kb 3, knockdown. The crash ends in a ring (mv 0.8) and leaves it stunned 180 f (vuln 1.5, exposed).
- **Broken:** stagger 150 f, vuln 1.3.
- **Player outside the arena:** it lobs 3 fireballs every 4.5 s; after 10 s out of reach it climbs back into the sky.
- **Phase 2:** 120 f roar, push ring, 3 whelps at level 5.
- **Phase 3:** lava cracks — 6 magma pools r 1.6–2.2 for 12 s, 3 new ones every 15 s, with `dragonLavaSpit`; the glow pulses.
- **FX:** `dragonBlast`, `dragonRing` (shock / push / fire ring, grow), `dragonEmbers` (ground), projectile `dragonFireball` with trail `dragonTrail`; bursts `dragonDust`, `dragonDebris`, `dragonSmoke`, `dragonFireBurst`, `dragonEmbers`, `dragonDeath`; many shakes.

**Sky dragon** (set piece, not targetable; `SkyDragon.js:1-50`).

- A draped shadow flying ≈ 9 u/s over its rect.
- **Volleys:** fireballs 0.22 s apart, each falling over 1.3 s from 15 u.
- **In a fight they are armed:** a telegraph circle per ball. `sys.strike` hits within 60 % of the radius at ATK 26 × power (1.6), knockdown, kb 2.5; the rest of the circle takes ×0.7 at kb 1.5.
- **Outside a fight they are harmless spectacle.** Impact shows a flash, `dragonBlast`, flames, smoke, debris, a shockwave ring, and a scorch with embers fading over 9 s.

#### F.3.3 The Bells of Evermere pack (EVERMERE_CAMPAIGN.md §5.4, §6.6–6.7; COMBAT.md §30)

All Evermere kinds load lazily with the pack. Marker styles added by the pack: `frost` (5) and `crack` (6) (`packs/evermere/core.js:44-90`), and `gulletWarm` (9) (`gulletIce.js:36`). The arena is an ice gate of `evIceWall` quads (0.3, 0.68, 1.0), rime-mote `embers` and a `frost` outline (`core.js:30-38`).

| Kind | Role / stats | Attacks | Look | Source |
|---|---|---|---|---|
| hushguard (Hushguard) | armoured knight; HP 165, ATK 10, DEF 6, poise 60; armour ×0.35 damage until poise breaks. Sword + heater shield, or halberd, chosen by group seed. Idle head turns toward Linnet within 12 u | **Break:** when poise empties, the frost core opens for 3 s (×1.6 damage, exposed, no attacks, reels back), then it seals again. **Cut**: 26 f with a sector marker (sword r 1.8 ±65°, halberd r 2.4 ±55°), facing locked for the last 6 f; 6 f; mv 1.1, kb 0.8. 55 % chance of a second cut (18 f, mv 1.2). Recover 34 f. **Heavy** (cooldown 4–6 s): sword shield bash (24 f, lane 1.6×1.3 plus a 0.6 u shove, mv 0.9, kb 2.2) or halberd sweep (30 f, sector r 3.2 ±110°, mv 1.4, kb 1.6). **Lunge**: 3.2–5.6 u, cooldown 5–7 s; 28 f with a lane marker (tracking 16 f, locked 12 f); 10 f thrust (sword 2.4+1.1 u, halberd 1.8+2.0 u); mv 1.3, kb 1.2. Token cost 1.5 | `evArc` cut crescent; `evCore` burst with `evFrostBurst`, SFX `iceCrack`, core glow texels, `evMotes`; `evSeal` with `evRimePuff`; cantor ward ring `evWard` (×0.6 damage for 4 s); `evIceChips`, `evSnowKick` | packs/evermere/hushguard.js:1-104, 467-735 |
| frostwolf (Frost Wolf) | pack (borrows the kobold brain through a context view that remaps SFX/FX); HP 240, ATK 6 | Bite = the kobold jab (20 f, lane 1.75×0.55, mv 0.85) shown as `evBite`. Pounce = the kobold lunge (32 f, lane marker, 12 f leap with a 0.55 u arc, mv 1.25, kb 1.0) with `evSnowKick`. **Frost Breath**: 1.8–4 u, 35 %, cooldown 7–10 s; 30 f with a sector marker r 3.6 ±28° (tracking 18 f, locked 12 f); 30 f breath with a tag every 10 f (mv 0.4, kb 0.3). It applies no chill (see §5). **Howl**: once per fight; 40 f; pulls every wolf within 14 u in, ring 30 % tighter for 6 s, and they strike at once. Not an attack | `evBreath` flat fan; `evBreathMist`; `evRing` over the muzzle on the howl; `evRimePuff`; SFX `wolfSnarl`, `wolfHowl`, `frostBreath` | packs/evermere/frostwolf.js:1-64, 297-385 |
| rimecrow (Rime Crow) | flier (borrows the bat brain); HP 160, poise 0 | **Diving Peck**: the bat swoop (18 f, circle marker, mv 1.0, kb 0.4; caw SFX). **Ice-Shard Spit**: 3–8 u, cooldown 3–5 s; 22 f with a lane marker 0.6 wide (tracking 14 f, locked 8 f); `evShard` 11 u/s, range 10; mv 0.8, kb 0.3; recover 20 f | `evShard` (flat, hit `evIceChips`); death `evFeathers` + `evRimePuff` | packs/evermere/rimecrow.js:1-41, 150 |
| cantor (Hush Cantor) | support, keeps 6–8 u; HP 170, poise 12; ranged token | **Call**: every ≈ 6 s; 30 f raise (interruptible), then a 24 f ring. Seals every broken Hushguard within 7 u at once and wards it (×0.6 for 4 s). **Hush**: 3.5–10 u, cooldown 3–4.5 s; 24 f with a lane marker 0.7 wide (tracking 14 f, locked 10 f); `evShard` 9 u/s, range 11; mv 0.9, kb 0.4 | `evRing` billboard over the bell (lift 2.7); hush shard hits `evRimePuff` + `evRing`; SFX `waysideChime` ×0.75, `cantorHush` | packs/evermere/cantor.js:1-51, 198-297 |
| tentacle (Old Gullet's arm) | add; HP 100, infinite mass and poise; driven by the head's orders | **slam**: rises at the crack's end; the lane 2 wide tracks, then locks 18 f while a crack races along it (`crack` marker); flung down flat over 6 f (mv 0.7, kb 2.6, knockdown); the ice erupts along the lane every 1.4 u; lies 90 f, then sinks. **sweep**: rises in a lasting hole; locks 16 f; sector r 4.6 ±120° (`gulletWarm` marker); 10 f (mv 0.7, kb 2.2). **rise**: sways during transitions. A stun or freeze breaks off its order | `gulletBurst`, `gulletSpray`, `gulletIce`, `gulletMist`, `gulletCrackDust`; SFX `tentacleSlam`, `iceBreak` | packs/evermere/tentacle.js:1-40, 269-470 |

**Rimehart, boss.** HP 3900, poise 520, phase at 55 %, released rather than killed (`packs/evermere/rimehart.js:1-117`, moves :651-1131).

- **Intro:** 150 f; bellow at f84. Gaps 42–72 f (30–54 f in phase 2). Markers are `frost`, the charge lane `crack`.
- **Antler Charge:** d ≥ 4.5. Lane 2.4 wide, tracking 30 f, locked 12 f; 13 u/s, armoured; r 1.5; mv 1.4, kb 3, knockdown. Into a tree trunk: stunned 150 f, vuln 1.5, exposed, snow shaken off (`evgSnow`). At the arena edge: a 36 f skid. Phase 2 charges twice.
- **Antler Sweep:** d ≤ 4.4. 36 f (tracking 20); sector r 4 ±70°; mv 1.15, kb 2.6.
- **Rear & Stomp:** d ≤ 3.6, or the player at its flank for 45 f. 46 f; circle r 3 at 1.2 u ahead; mv 1.45, kb 2.6, knockdown; a frost ring r 3→7.5 at 7 u/s, 0.7 wide (mv 0.9, kb 1.8).
- **Frost Leap:** phase 2, d ≥ 3. 30 f; 3 landing circles r 2.2 march toward the player, filling 30 f, 26 f apart (mv 1.25, kb 2; the last knocks down); 48 f punish window.
- **Blizzard Bellow:** phase 2, d ≤ 8. 40 f; cone r 7 ±30°; 54 f with a tick every 10 f (mv 0.3, kb 0.9). Leaves 3 ice patches r 1.35 for 6 s (`evgIcePatch`; 3 flat damage per 0.5 s after 18 f).
- **Phase 2:** 110 f; ice crystals burst onto the antlers at f50 (the `X` sheet cells); a push ring.
- **Release:** kneels in a frost shell; waits for the thaw front (`thawField.reached`); shakes off the frost; walks north with `evgPetals`.
- **FX:** `evgFrostBurst` (×1.6 / ×2.4), `evgFrost`, `evgShards`, `evgBreath`; glow (0.45, 0.85, 1.0).

**Harvest Mawkin, boss.** HP 7300, phases at 60 % and 25 %, adds = Rime Crows (6 at level 8), released (`packs/evermere/mawkin.js:1-124`, moves :684-1214).

- **Intro:** 156 f; a burst of crows at f60.
- **Reap:** phases 1–2, d ≤ 5.2. 40 f (tracking 22, locked 18); sector r 5 ±100°; mv 1.3, kb 2.8.
- **Full Reap:** phase 3, replaces Reap; d ≤ 5.4. 60 f; circle r 5; mv 1.5, kb 3.2, knockdown.
- **Crow Volley:** d ≥ 4. 36 f; 3 lanes 1.4 wide (at the player and ±24°) filling 36/44/52 f; a crow dives down each as a piercing shot (15 u/s, mv 0.85, kb 1.6).
- **Furrow Swap:** sinks (36 f; `ctx.submerge`, untargetable). Three marks fill around the player for 90 f: one real (gold rim), two cracking ice. It rises at the real one (mv 1.3, kb 2.6, knockdown); the false ones erupt as frost stalks (mv 1.2, kb 2). 44 f punish window.
- **North Wind:** phase ≥ 2. 50 f; 2 lanes (3 in phase 3) 2.4 wide across the arena from west to east; 50 f of gusts with a tick every 10 f (mv 0.25, kb 4 pushing east); up to 2 crows ride in.
- **The Reaping:** phase 3. 30 f; rows of stalks every 2.3 u erupting one every 16 f, each a lane 1.3 wide filling 36 f with a 2.6 u gap; mv 1.1, kb 2.4.
- **Release:** a straw heap under Osmund's coat.
- **FX:** `evgReap`, `evgStalk`, `evgGust`, `evgCrow` (projectile with `evgFeathers`), `evgFrostBurst`; bursts `evgStraw`, `evgChaff`, `evgLeaves`, `evgFeathers`.

**Old Gullet, boss.** HP 2200, phases at 65 % and 30 %, adds = tentacles (6 at level 5), released (`packs/evermere/gullet.js:1-115`, moves :875-1331; ice look `gulletIce.js`).

- **Submerged most of the fight:** hidden and guarded, with its shadow moving under the ice.
- **Surfaces:** after 3 "pains" (2 in phase 3) or 14 s. A gold glint shows for 54/50/42 f, then it stays up 6 s (5 s in phase 3). Broken: 150 f, vuln 1.3.
- **Crack Slam:** an arm, as above.
- **Ice Burst:** 3 circles (4 in phase 3) r 1.5 at a 0.45 s lead, filling 48 f (mv 0.75, kb 1.6); each leaves a hole for 8 s.
- **Tentacle Sweep:** phase 2–3.
- **Shard Barrage:** phase 3. 6 circles r 1.3, 8 f apart, each filling 60 f under an arcing `gulletShard` (mv 0.8).
- **Frost-Ink:** while up, phase 2–3. The siphon swells 42 f under a cone r 7 ±35°, then sprays 36 f (3 hits, mv 0.45).
- **Holes:** 4 flat damage every 0.5 s plus a push out. Foes in a hole are pushed out and chilled 1.5 s.
- **Phase 2:** cracks to 4 lasting holes.
- **Markers:** `gulletWarm` (warm, dark ember fill on ice).
- **Ally hints:** it publishes `allyHints` so companions avoid holes and wait at the glint.
- **FX:** `gulletPool`/`S`, `gulletRim`/`S`, `gulletCrack`, `gulletShadow`, `gulletGlint`, `gulletFoam`, `gulletBurst`; bursts `gulletSpray`, `gulletIce`, `gulletMist`, `gulletInk`, `gulletInkFrost`, `gulletRime`, `gulletBubbles`, `gulletCrackDust`.

**Hushed King, final boss.** HP 12400, poise 520, phases at 65 % and 30 % (`packs/evermere/hushedking.js:1-130`, moves :586-1066; tuning `defsKing.js` `KING_TUNING`).

- **Intro:** 108 f. Wind-ups ×0.75 in phase 3. Turn rate 150/170/190 °/s.
- **Black Peal:** d ≤ 5.2. 36 f; cone r 5.4 ±35°, locked 12 f before it sounds; mv 1.25, kb 3.
- **Black Toll:** a black bell planted ≤ 6 u toward the player. It rings 4 times, the first after 60 f, then every 90 f; each ring r 3.5 (mv 0.75, kb 4.2) pushes everyone out.
- **Leap Slam:** 4–12 u. 34 f crouch with a tracked landing circle (locked 12 f); 30 f airborne; r 2.6, mv 1.6, kb 3.2, knockdown. From phase 2 it leaves a refreeze wave to r 6.5 at 7 u/s (mv 1.0, kb 1.6).
- **Hammer Sweep:** punishes the player at his side or back. 30 f; r 2.9; mv 1.1, kb 3.2.
- **Rime Lane:** phase 2+. 40 f, locked 12 f; lane 12×1.6 with spikes racing at 26 u/s every 0.9 u (`crack` marker; mv 1.3, kb 2.2).
- **Black Carillon:** phase 3. Four bells drop 12 f apart around him (r 1.7, mv 0.8). The chord at f30 is a ring to r 8.5 at 9 u/s, 1.0 wide (mv 1.7, kb 4). Then he kneels, stunned 4 s with the crown exposed: every hit crits, vuln 1.5.
- **Ring:** he rings the Hush Bell himself.
- **Broken:** 180 f, vuln 1.3.
- **Phase 2:** 2 Hushguard and 1 Cantor at level 10.
- **Phase 3:** sets the story flag `bc-crown-phase`.
- **Release:** the crown shatters (`evkBurst`, `evkSplinter`, `evkGlint`).
- **FX:** `evkBell`, `evkBellDrop`, `evkRing`, `evkPeal`, `evkSpike`, `evkBurst`, the named `spin` and `dust`; bursts `evkRime`, `evkAsh`, `evkSmoke`.

**Hush Bell toll** (level system; `HushToll.js:1-60`, `TOLL_TUNING`).

- Three beats 54 f apart. On each beat every warm zone flashes `evkWarm` (gold).
- A dark ring of `evkWave` quads (24 segments) rolls out at 22 u/s, shedding `evkAsh`.
- When it reaches the player, `ctx.pulse` deals power 30 and knock 1.2 to anyone not in warmth (lit braziers r 3.5, Linnet's Toll bell). It is harmless outside an engaged fight.
- Period: 20 s base, 15 s in the court phase (a brazier dies after each toll, `evkSmoke`), 8 s in the crown phase.

---

### F.4 Shared FX vocabulary

#### F.4.1 Named CombatFx effects (`combat/CombatFx.js:76-88`; one FxQuads batch, pool 128)

Any atlas frame can also be played with options (COMBAT.md §29 V9).

| Name | Frame | Mode / lift | HDR colour | Use |
|---|---|---|---|---|
| `slash` | slash 48×24×4 @30 | flat, 0.8 | (1.8, 1.8, 1.55) | combo A1/A2 (flip) |
| `slashBig` | slashBig 64×32×4 | flat, 0.8 | (1.95, 1.7, 1.2) | A3, greatshield mace |
| `thrust` | thrust 48×12×3, rot π/2 | flat, 0.85 | (1.8, 1.8, 1.7) | A3, warden thrusts, kobold glint |
| `spin` | spin 64×64×4, 2 loops, ×1.1 | flat, 0.7 | (1.7, 1.6, 1.2) | Whirl Slash, warden Sweep, King |
| `impact` | impact 16×16×4, ×1.2 | billboard, 1.0 | (2.2, 2.0, 1.5) | hit star, explosions |
| `crit` | crit 24×24×4, ×1.3 | billboard, 1.0 | (2.6, 2.1, 0.8) | crit star |
| `dust` | dust 16×16×3 @20, ×1.4 | billboard, 0.3 | (1.0, 0.95, 0.85) | landings, slams |
| `stun` | stun 16×8×4 @10, loop 2 s | billboard, 1.6, follows | (3.0, 2.6, 0.8) | dizzy stars |
| `pillar` | pillar 24×64×4 @12, loop 1 s, ×0.85, back 0.5 | billboard, 2.0 | (1.05, 0.82, 0.32) | level-up |
| `swarmBurst` | swarmBurst 32×32×4 | flat, 0.06 | (2.0, 0.85, 0.28) | imp diving burst |

#### F.4.2 FX atlas frames (`engine/pixel/FxSprites.js:66-87` base; modules in `engine/pixel/fx/*.js`)

| Group | Frames |
|---|---|
| Base | slash, slashBig, spin, thrust, impact, crit, dust, arrow, emberBolt, boulder, coin, heart, mana, draught, upgrade, core, stun, pillar, wallFlame |
| heroFx (swordmaster) | heroGale, heroBlade, heroCyclone, heroWave, heroSword, heroSigil, heroCrack; late 2: heroGaleLit, heroThrustLit, heroWaveLit, heroFangCrest, heroFangCrestLit, heroCut, heroBite, heroRunes |
| partyFx (heroes) | partyGlyphHoly, partyGlyphFrost, partyGlyphWard, partyRing, partyCrack, partySwirl, partyPillar, partyDome, partySunburst, partyRockSpike, partyWardRing, partyHolyOrb; late 1: partyIceLance(+Lit), partyIceShard(+Lit), partyIceFlake, partyIceMist, partyIceGlow, partyIceBokeh, partyIceShell(+Lit). Retired and kept in `RESERVED`: partyFrostFloor, partyIceSpike, partyFrostLance |
| dragonFx | dragonFireball, dragonBlast, dragonRing, dragonScorch, dragonEmbers |
| bruteFx | bruteCleave, bruteQuake, bruteBreath, bruteFireball, brutePillar, bruteSigil, bruteFlames, bruteBite, bruteClaw |
| swarmFx | swarmOrb, swarmSpit, swarmBurst |
| evCoreFx (late 3) | evIceWall |
| evFoesFx (late 3) | evArc, evCore, evSeal, evWard, evShard, evBreath, evRing, evBite |
| evGuardFx (late 3) | evgFrostBurst, evgIcePatch, evgStalk, evgCrow, evgGust, evgReap |
| evGulletFx (late 3) | gulletPool, gulletPoolS, gulletRim, gulletRimS, gulletCrack, gulletShard, gulletBurst, gulletShadow, gulletGlint, gulletFoam |
| evKingFx (late 3) | evkBell, evkBellDrop, evkRing, evkPeal, evkWave, evkWarm, evkSpike, evkBurst |
| Bellwarden (in `BellwardenFx.js:1296`, late 3) | bellArc, bellRingS, bellPeal, hammerArc, hammerCrack, bellMark, bellNote, bellWave |

#### F.4.3 Projectile looks (`combat/Projectiles.js:58-64`; packs pass their own `ProjectileLook`)

- **Built-in:** `arrow` (flat, (1.6, 1.35, 1.0)); `emberBolt` (billboard, (3.2, 1.5, 0.5) ×1.2); `boulder` (×1.8); `swarmOrb`; `swarmSpit`.
- **Custom looks:** wyrmcaller fireball and roof bolt (`bruteFireball`); dragon barrage (`dragonFireball`, trail `dragonTrail`); crow and cantor shards (`evShard`); Mawkin crows (`evgCrow`); Gullet barrage (`gulletShard`, spin 9).
- **Hero missiles** (Holy Bolt, Frost Lance) are driven by MemberCombat and drawn by the hero looks.

#### F.4.4 Particle presets (`engine/fx/Particles.js:56-221` base; `engine/fx/presets/*.js` registered at combat load)

| Source | Presets (purpose) |
|---|---|
| Base, ambient | dust, fireflies, embers (also the boss-arena emitter), smoke, leaves, petals, rain, snow, mist, footstep (dodges, roll, paw), splash, sparkle |
| Base, combat (one extra streak pool) | hitSpark (hits), emberBurst (fire bursts, bolt impact), deathPoof, gooPoof (slime), healGlow (heals; also chill motes via override), magicBurst (Nova, Flare, ward glint, ice glints), victoryEmbers, victorySparkle (boss death), levelSparkle |
| hero.js | heroWindSpark, heroFangEmber, heroHoly, heroGlint, heroGust, heroDustRing, heroDebris, heroMote |
| party.js | partyFrostShards, partyFrostGlint, partyFrostTrail, partySnowfall, partyIceChunks, partySnowStreak, partyIcePuff, partyDust, partyRubble |
| holy.js | holySpark, holyMotes, holyTrail, holyAscend, lifeRise, lifeMotes, lifeAscend |
| earth.js | earthDustRing, earthGrit, earthChips, earthChipPuff, earthShieldSpark, earthCrySpark, earthWardMote |
| dragon.js | dragonTrail, dragonFireBurst, dragonFlare, dragonEmbers, dragonSmoke, dragonDust, dragonDebris, dragonDeath, dragonLavaSpit |
| brutes.js | bruteSparks, bruteSplinters, bruteDust, bruteRubble, bruteFireBlast, bruteFireCore, bruteSmoke, bruteBreath, brutePillar, bruteGather, bruteEmbers, bruteBlink |
| swarm.js | swarmDust, swarmAsh, swarmSpark, swarmFlare |
| siege.js (village fires, not combat) | smokeDark, smokeWisp, bonfireSmoke |
| evFoes.js (pack) | evFrostBurst, evMotes, evRimePuff, evFeathers, evIceChips, evSnowKick, evBreathMist |
| evGuard.js (pack) | evgFrost, evgBreath, evgShards, evgSnow, evgPetals, evgStraw, evgChaff, evgLeaves, evgFeathers |
| evGullet.js (pack) | gulletSpray, gulletIce, gulletMist, gulletInk, gulletInkFrost, gulletRime, gulletBubbles, gulletCrackDust |
| evKing.js (pack) | evkRime, evkSplinter, evkGlint, evkAsh, evkSmoke |
| BellwardenFx.js:70 (her chunk) | bellSpark, bellShimmer, bellPuff |

Status bursts are per-particle overrides of warmed presets (`Enemy.js:192-196`): FROST_MOTES, ICE_GLINT, ICE_TWINKLE, ICE_CHIPS, ICE_STREAK.

#### F.4.5 Ground markers (`engine/fx/GroundMarkers.js:72-73`; one draped instanced draw call)

**Shapes:** circle, ring, sector, lane, rect (outline only). A marker has a `progress` fill, an optional `flash` on lock, and its rim goes white at progress 1.

| Style (id) | Look | Users |
|---|---|---|
| enemy (0) | red-orange rim (2.6, 0.34, 0.12), fill alpha 0.22→0.5 | all enemy telegraphs by default |
| player (1) | gold rim (2.2, 1.6, 0.6), fill 0.14→0.34 | Radiant Nova, Skyfall shock rings, Mawkin's real swap mark |
| lock (2) | thin rotating gold dashes | lock-on ring |
| barrier (3) | pulsing orange outline | Cinderheart arena |
| magma (4) | cellular basalt crust with glowing cracks | golem pools, dragon breath patches and lava |
| frost (5) | dark ink outline, cyan rim, hatched fill | Evermere boss telegraphs, ice barrier |
| crack (6) | jagged fissure growing with progress | charge lanes, Rime Lane, Mawkin stalks, tentacle slam |
| gulletWarm (9) | enemy rim plus dark ember fill (reads on ice) | Gullet and its arms |

#### F.4.6 Lights (`engine/lighting/VfxLights.js`)

- `VFX_LIGHT_COUNT` = 4 point lights exist on every level, parked at intensity 0. `acquire({minor})` (:103) hands one out.
- **field:** one per hero for its skills; it can take over a minor light.
- **minor:** a short spark that only takes a free light.
- Defaults: icy blue, intensity 20, distance 9, decay 1. Users are the swordmaster, bellwarden, cleric, ice mage and greatshield looks.
- The rules: ≥ 2 u up; warm lights × dayK(0.4); a flash's excess × dayK(0.25); cap 6; aged on frame time.
- Enemies, the core and `SkyDragon` use no lights.

#### F.4.7 Other FX systems

- **FxQuads** (`engine/fx/FxQuads.js`): the one instanced cut-out batch, with a Bayer dither fade. Options: `soft` radial dither, and an opt-in additive `halo` (a second program, `enableHalo`, used by the hero looks).
- **3D pieces:** `SpectralBlades` (swordmaster swords), `SpectralBells` (bellwarden), `IceCrystals` and `GroundFrost` (ice mage), `RockSpikes` and `WardDome` (greatshield), `DragonShadow` (dragon / sky dragon shader mesh).
- **HeroFx** (`PlayerCombat.js:1590+`): a pool of 96 hero quads that pair a body with a lit layer.
- **CombatLook** (`Feel.js:84`): DOF focus when engaged; red vignette on hurt (0.35 s); low-HP vignette beat and −0.25 saturation; perfect-dodge desaturation plus chromatic aberration; chromatic aberration on a boss phase; death desaturation; cinematic streaks ×0.35 when engaged.
- **Feel.js tables:** `HIT_STOP` (melee 4, finisher 7, skill 3, crit +2, kill +4, boss 5, cap 10, playerHurt 6, bossPhase 12, bossDeath 12, guard 2) and `SHAKE` (amplitude/duration: hit .05/.12, crit .12/.2, finisher .08/.15, hurt .15/.25, knockdown .25/.35, nova .2/.3, wallStun .3/.4, bossSlam .45/.5, bossRoar .45/1.2, bossIntro .25/.6, bossDeath .5/.8, kill .08/.16). Shakes from `feel` are capped at 0.6 u and 1.5 s.
- **FlameBatch** (`engine/world/props/FlameBatch.js`) is the level's merged set-piece fire. It is not used by combat effects.

---

### F.5 Status effects

| Status | Rule | Shown as | Source |
|---|---|---|---|
| chill / slow | the enemy's whole step × (1 − slow); default slow 0.35, cap 0.9, max 30 s. A boss is held to slow ≤ 0.2 for ≤ 3 s, then immune for 6 s. Sources: Frost Lance (2.5 s, 0.3), Blizzard (1.2 s, 0.5); Gullet's holes chill foes 1.5 s | cold-ratio highlight breathing (CHILL_HL 0.5↔0.62 at 1.5 Hz) with a faint rime mix of 0.07; frost motes every 0.45 s; half strength on a boss | Enemy.js:160-186, 486 |
| freeze | held in the `stun` state (attack cancelled, animation stopped). A boss only gets a 0.2 chill. Source: Glacial Tomb 2.5 s | ICE_FLASH mix 0.3 plus ICE_HL; ice glints every 0.38 s; on thaw a shatter of `splash` chips and `hitSpark` streaks; the ice mage's `partyIceShell` quad (SHELL tints) | Enemy.js:162-166, 509 |
| stun (status) | hold with the hurt pose; not on bosses or passive kinds. Sources: greatshield bash 0.5 s, Carillon 2.5 s | named `stun` dizzy stars following the foe | CombatSystem.js:2982-2998 |
| brain stun | boar wall 120 f, golem brazier 120 f, dragon after the dive 180 f, Rimehart tree 150 f; vuln 1.5 and exposed; drakeborn reel 70 f at ×1.3 | `stun` FX; shake | the brains |
| stagger / Broken | poise empties → 36 f (boar 60 f). Bosses use per-phase poise: Broken 150–180 f, vuln 1.3, exposed | pose `hurt` | Enemy.js:64-66 |
| exposed / kneel | exposed: crit chance +0.30. Kneel (golem phase 3, King after Carillon): every hit crits; the golem caps damage at 8 % per hit | brain poses and glow | CombatSystem.js:2936-2945 |
| guarded | hits deal 0 | "Guard" number, `hitSpark` ×4, hit-stop 2 | CombatSystem.js:2918-2926 |
| armoured (super armour) | enemy `e.armored` (charges, gores, swoops): no hitstun or stagger. Player `_armor`: Whirl f0–24, Tempest to f40, Carillon to f60 (damage and flash only). Greatshield: any non-knockdown hit, every hit during his skills' armour frames | greatshield block clang plus SFX `guard` | rules.js; MemberCombat.js:3301 |
| i-frames | player: roll f1–13, backstep f1–8, Nova f4–20, Skyfall f3–34, after hitstun 48 f, after knockdown 30 f, level-up 60 f, respawn 2 s, perfect dodge ≥ 0.6 s. Allies: roll f1–13, hurt 0.5 s, knockdown 0.6 s, revive 1.5 s | player `mesh.visible` blink at 15 Hz | Feel.js:49 |
| perfect dodge | enemy time ×0.35 for 0.6 s | desaturation plus chromatic aberration, "Perfect!", `sparkle` | §1.0 |
| ward (party) | damage to the player and allies × (1 − frac); the strongest ward wins; up to `WARD_SLOTS`. Sanctuary 0.3 for 6 s, Bulwark 0.25 for 6 s | `magicBurst` WARD_GLINT on each spared hit; ward rings under heroes (green for the cleric, azure for the greatshield) | CombatSystem.js:1694-1730, 3022 |
| ward (enemy) | Cantor seal: ×0.6 damage for 4 s on a Hushguard | `evWard` rune ring | hushguard.js:58-64 |
| Hushguard armour / core | ×0.35 until poise breaks, then ×1.6 for 3 s | `evCore`, `evSeal` | hushguard.js:8-18 |
| taunt | Bulwark: non-boss foes within 6 u target the greatshield for 5 s | amber snap ring per foe | CombatSystem.js:1664 |
| resonance marks | 0–3 per foe, 6 s; consumed for mv × (1 + k·n) | `bellMark` quads; a core `marksLook` exists but is null unless set | CombatSystem.js consumeMarks; core.js:337 |
| submerged | untargetable, guarded, fades over 12 f (Gullet head, Mawkin swap) | sprite fade; Gullet's under-ice shadow | CombatSystem.js submerge; core.js |
| winded | SP 0 until SP ≥ 30; recovery ×1.35 | HUD | rules.js:143 |
| wind-up / elite | telegraph highlight 0.45↔0.9 at 8 Hz; elite gold shimmer 0.12↔0.24 at 1 Hz | Sprite3D highlight | Enemy.js:148-149 |

---

### F.6 Engine coupling notes

**Timing**
- Every window is in 60 Hz frames (`F`, `frameOf` with EPS).
- `CombatSystem.update` splits the *frame* dt into `n = ceil(dt/(1/60))` equal sub-steps (`CombatSystem.js:2004-2006`). Results therefore depend on the frame rate unless `?fixedstep` (`Engine#manualStep`) is on.
- Hit-stop and slow motion are combat-local clocks.

**RNG**
- All seeded: engine `RNG` is mulberry32 (`engine/utils/math.js:33-70`).
- Combat seed is `hashString(level.name)` (`CombatSystem.js:317`). Each enemy uses `hashString(uid) ^ seed` (:882). Loot uses `lootRng(uid, deathCount, seed)`. `SkyDragon` uses `hashString(obj.id)`.
- Allies use `ally:<id>`. The looks have their own streams (`sword:player`, `bell:player`, `holy:/ice:/earth:<id>`), so visuals never draw from the gameplay RNG.
- Damage roll and crit roll come from `sys.rng` (player) or the ally's RNG.
- No real `Math.random` exists in `game/combat` or `game/party`; the 2 hits are comments.

**Math** (counts across all of `game/combat` / `game/party`)
- `Math.sin` 114/51, `cos` 109/44, `hypot` 187/115, `atan2` 55/8, `exp` 12/24. `**` occurs 12 times in the sim-side files checked: `rules.js:85` xpToNext `L**1.6`; goblin hop easing `goblin.js:78` ×2; kobold ×2; whelp ×2; Enemy ×2; PlayerCombat ×1 (the Skyfall arc, visual lift); gullet ×2. `Math.pow` appears twice.
- Gameplay-relevant uses: distance tests (`hypot` everywhere: CombatSystem 38, MemberCombat 68, Enemy 16); the player's magnet `atan2`/`cos`/`sin` (`PlayerCombat.js:504-511`) and Tempest facing (:854); pack ring angles (kobold `packInit`); boss `turnToward`/yaw (`atan2` in golem, dragon, rimehart, mawkin, king, tentacle); ring and barrage placement (`cos`/`sin` in golem, dragon, gullet ×9/10); ally shot rotation (`MemberCombat.js:2084-2087`).
- Most `sin`/`cos`/`exp` are visual-only: SwordmasterFx 16/12/7, IceSpellFx 18/14/7, HolySpellFx 12/8/6, BellwardenFx 9/9/5; the Skyfall lift is visual.

**Clock reads**
- `performance.now` appears only in stats and budgets: CombatSystem load, nav build and tick timers (:667, 789, 1976, 3823), and `Party.js:1720`'s idle-callback budget for the follow nav build. No `Date` or timers.

**three.js, Sprite3D and camera**
- CombatSystem imports `three`, the engine barrel, FxQuads, GroundMarkers, FxSprites, MonsterSprites and the UI modules.
- `Enemy.js` and `PlayerCombat.js` import the barrel. Enemies own a `Sprite3D` (`e.sprite`); the dragon, Rimehart, Mawkin, Gullet and tentacle brains set frames and opacity on it directly (≈ 70 `sprite.` uses in brains).
- `ai/dragon.js` imports `SkyDragon` (`three`); the Evermere brains import their sheet painters, `GlobalUniforms` and `ThawField`.
- **Gameplay reads the camera:** `ctx.onScreen` (projected NDC) gates every non-boss wind-up; move input is camera-relative; ally `_covers` and `_spaceOut` use screen axes.

**World**
- `Nav` is a 0.5 u walk grid built from the `TileMap` (heights, colliders, water; `Nav.js:1-30`).
- `ctx.moveGround` and `ctx.moveFly` move through `tileMap.move` (colliders, step 0.55).
- `ctx.los` uses terrain heights. GroundMarkers bake the height field. The `freeRun` and wall-stun tests use `blockedBy` from the TileMap.

**Headless?**
- Not as shipped. CombatSystem, Enemy and PlayerCombat pull in `three`, the DOM UI and WebGL modules. The project's determinism checks run in the browser (fixed-step bot digest).
- Node-safe pieces: `combat/rules.js`, `combat/defs.js` + `defs/*`, `packs/evermere/defs*.js`, `party/rules.js`, `engine/level/PartyRules.js`. `Hitboxes.js` and `Nav.js` have no imports; `Projectiles.js` imports only rules.js. The simple brains (goblin, archer, shaman, slime, bat, boar, dummy, kobold, whelp, emberimp, drakeborn, ashhound, wyrmcaller) import only each other or `aimVy`.
- Running the logic headless would need stubs for `Enemy`/`CombatContext` (onScreen, los, moveGround, markers, fx, burst, sfx) and a fixed dt.

---

### F.7 Where the docs and the code disagree

- **COMBAT.md §11.5 named-effect colours** (e.g. `slash` (3.0, 3.0, 2.6), `impact` (3.5, 3.2, 2.4)): the code is about 40 % dimmer (`CombatFx.js:70-88`). The doc's "Shipped values" note says so, but the table was never updated. The table also lacks `swarmBurst`.
- **COMBAT.md §11.4 shake list:** has no `kill` shake; `Feel.js:41` has `kill: [0.08, 0.16]`, which is applied on kills (`CombatSystem.js:2968`).
- **COMBAT.md §7.3:** says the wind-up uses `uFlash` alpha 0.35↔0.6. The code uses a Sprite3D highlight at strength 0.45↔0.9 (the doc's own rev. 4 note agrees with the code).
- **Frost Wolf breath:** EVERMERE_CAMPAIGN.md §5.4 calls it a "frost-breath cone". The code applies no chill (`frostwolf.js:20-21`). By design, no enemy hit applies a status to the party (KNOWN_ISSUES VQ-02).
- **Telegraph rule "markers for r ≥ 1.5 areas":** the bat swoop shows an r 0.6 marker anyway, and the kobold jab and slime leap show none. This is consistent with the rule (they are below the threshold), not a violation.
- **Resonance marks:** core has a `marksLook` drawer (§30.4), but the bellwarden's marks are drawn by `BellwardenFx` (`bellMark`). It is unclear whether the core drawer is ever set. I did not trace it further.
- **Everything else checked agreed with the code:** COMBAT.md §6.6 (traveler), PARTY.md §5.2/§12 tables, and EVERMERE_CAMPAIGN.md §5.5 (bellwarden).
