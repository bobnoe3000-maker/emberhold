# Combat effects: every skill its own

**Implemented (2026-11-07).** The code:
- the effects: `src/render/skillfx.js`;
- the events: `src/sim/battle.js` `skillEv`;
- faster primitives: `src/render/fx.js` (disc kernels);
- the art review cells: `src/dev/review.js`;
- the fight capture: `tools/capture/skills.mjs`.

The owner, 2026-11-07:

> "After this move onto the combat fx including critic review. Unique effects for each spell and skill. AAA quality"

## How it was looked at

- **A real fight on both renderers.** `tools/capture/skills.mjs` stages three parties of level 15 with every skill
  learned, in a level-15 room of the Old Barrows:
  - fighter, rogue, mage;
  - cleric, shaman, fighter;
  - the mage alone in front, the rogue's Backstab off and the fighter starting hurt, so that Frost Nova, Venom and
    Second Wind come up.

  It shoots each skill's first cast at +0, 0.2, 0.4, 0.6, 0.8, 1.1 and 1.6 s. The sim is deterministic, so the same
  skills fire at the same moments on every checkout, and a before and an after line up frame for frame.
- **The art review.** `?dev&scene=stage&show=fx&match=Skills`, and `tools/capture/stage.mjs --show fx --match Skills`
  for strips. Every skill's moment has its own cell, and so does every aura.

## The critique (before)

- **A skill was its name.** A cast drew its name floating up over the caster and the class's ordinary swing or cast
  flash, nothing else.
  - Bless, Hex, Arcane Ward, Shield Wall, Smoke Step, Mend and Ancestors' Breath drew nothing at all.
  - Frost Nova and Turn Undead were a screen shake.
  - The Firebolt was the mage's ordinary fire bolt.
- **What a skill leaves on someone couldn't be seen.** A Shield Wall's taunt, a Smoke Step's dodge, Bless, a Ward's
  shield, a Hex, Venom's poison, Spirit Drain's stacks and Frost Nova's slow were state the sim kept. On the screen,
  only a "ward 40" or a "hexed" floated up once.
- **One look for every class.** A cleric's Mend and a shaman's Breath read alike (a green number). A fighter's Cleave
  and a rogue's Backstab were the same heavy arc in different colours.

## The design (after)

Each class has its colour language. Each skill has its own shape and its own timing: an anticipation, an impact and a
decay.

| Class | Skill | The moment | What it leaves |
|---|---|---|---|
| Fighter: warm steel, amber | Cleave | a crescent swept round the blade toward the target and past it, a white-hot edge; a spark and a scuff ring on each foe beside the target | |
| | Shield Wall | the war cry: a red ring thrown out over the floor, the lines of the foes it turns; then a shield of light standing before him | a ring of plates at his feet, turning, a pulse going out |
| | Second Wind | three strands of wind whirling up round him, a ring at his feet | |
| Rogue: verdant, a crimson cut | Backstab | a shadow's streak from where the rogue stood, then two cuts crossing on the target; a crit a star | |
| | Smoke Step | smoke thrown out in a ring at the feet, billowing and rising | wisps of smoke turning about them |
| | Venom | a green splash, drops thrown out and falling, a ring at the feet | bubbles rising off the poisoned, a sick glow under them |
| Mage: arcane blue, fire, frost | Firebolt | in flight, a roaring head with embers shed behind it; where it lands, a white-orange flash, a ring of fire, embers flung up and falling, smoke-light rising, the floor scorched | |
| | Frost Nova | a ring of frost running out 2.8 tiles over the floor, ice spikes standing up behind it as it passes, a cold mist; each foe reached flashes white | rime at the chilled foe's feet, snow falling on them |
| | Arcane Ward | runes drawn in round the ally, then the dome closing over them | the dome, a light running round it, facets twinkling |
| Cleric: gold | Mend | a beam of gold from above onto the ally, a ring at their feet, a mark rising over their head, motes going up | |
| | Bless | a rune circle turning at the cleric's feet, a halo settling over each of the party | the halo |
| | Turn Undead | the sunburst: rays running out over the floor, a ring of light behind them, a column; each of the dead it reaches flares and smokes | |
| Shaman: spirit teal, hex green and violet | Spirit Drain | a tether, motes drawn along a wavering line from the foe to the shaman | a mote apiece circling the foe for each stack |
| | Ancestors' Breath | a breath going out over the floor, leaves of spirit-light spiralling up each of the party | leaves going up them |
| | Hex | a sigil drawn stroke by stroke on the floor under the knot (two rings and a five-pointed star), a violet line out to each foe it takes | a mark under each hexed foe, the life sinking out of them |

How it's built:
- **One effects plane.** Everything is drawn as light into the emissive plane with fx.js's primitives, as AGENTS.md
  asks: effects reuse the primitives, no new passes. So both renderers show it: Emberlit lights its window with it, and
  Luminati lays the plane over its world.
- **Moments come from the sim.** `battle.js` emits a `skill` event when a skill is cast and when it lands: who cast
  it, at whom, and those it reached. It's an event only, never state, so replays are exactly as they were (a test holds
  the fight's hash, heard or not).
- **Effects follow people.** A moment follows its caster and target by id while they move.
- **Auras come from state.** They are read off the sim's state every frame: `buff.wall`, `smoke`, `bless`, `breath`,
  `ward`, and a foe's `slow`, `poison`, `drain` and `hex`. They fade over their last second.
- **Ground effects are on the ground.** Ground effects are true world circles: an ellipse of 11.3 × 5.7 px a tile,
  stroked a pixel at a time. They sit under the figures; the rest stands over them.

## Measured

**The frame's cost.** A node benchmark with the real primitives, a 260 × 300 native buffer, on the cloud box:

| | Before the kernels | After |
|---|---|---|
| Every aura on 3 allies and 6 foes (the worst case) | 1.53 ms | 0.52 ms |
| Seven big moments at once, and every aura | 4.10 ms | 0.96 ms |
| Nothing under way | 0.005 ms | 0.003 ms |

fx.js's `disc()` now takes its weights from a kernel kept per radius and falloff, to a tenth of a pixel. These are the
same marks without a `hypot` and a `pow` a pixel, and every older effect is faster for it too.

**Tests.** `test/skillfx.test.mjs` checks three things:
- every class skill has a moment of its own, and no two draw alike;
- the sim says when a skill is cast and lands, with who it reached;
- saying so changes nothing: the same fight's state hash, heard or not.

`npm run check` passes: 491 tests, SMOKE_OK, RENDER_SMOKE_OK.

**Burst frames.** Before and after, on both renderers: `tools/capture/skills.mjs`.
- Each row is a skill's first cast, at +0, 0.2, 0.4, 0.6, 0.8, 1.1 and 1.6 s. Emberlit is on the left, Luminati on the
  right.
- The before has 12 rows: Venom, Frost Nova and Second Wind never came up in its two fights.
- The after adds the third fight. Frost Nova is staged there (marked so): the sim's own event, sent with the foes
  nearest the mage, because no fight here brings two foes within its 2.8 tiles.

![Before: a skill was its name](img/fx/skills-before.jpg)
![After: every skill its own](img/fx/skills-after.jpg)

*Closer, at play scale. Rows: Cleave's crescent, Frost Nova (both renderers), Turn Undead's sunburst, Bless's halos
(Luminati), Backstab's crossed cuts.*

![Close-ups](img/fx/skills-closeups.jpg)

## Tuned after the first real-fight frames

- **Arcane Ward.** On two or three of the party at once, the dome read as a wall of ovals. It is held at about half the
  light now.
- **The Firebolt.** In flight it passed for the mage's plain bolt. Its head is now an 11 px halo with a 4 px core, and
  it sheds 10 embers, not 7.
- **Every stroke.** At fx.js's own gain the first pass read as dotted outlines. Rings are now stroked a pixel at a time
  along their length, and the module's light is ×1.7.

## Left, and the critic's notes for the next pass

- **The foes' own abilities.** The bosses' calls, the hexer's curse and the acolytes' fire still use the shared cast
  and bolt. They are next, in the same way: an event each, and a moment each.
- **Timing against the clip.** Each moment starts on the sim's cast and landing (the wind-up is 0.55 s). The swing and
  the effect line up because both follow the sim; a skill-specific clip would sell them more.
- **A ward breaking.** When a ward is spent, the dome goes out without a shatter. A 'warded' pulse and a break are
  worth adding.
- **Frost Nova's own conditions: fixed (2026-11-07, GDD v1.53; the owner: "Yes fix frost nova range").** It had two
  faults:
  - It was cast round the mage, who keeps her distance.
  - Its 2.8 tiles could never take in two foes, because they stand 2.8 apart (their melee reach round whoever they
    fight).

  It is now thrown onto the thickest knot of foes within the mage's reach (her bolt's 14 tiles), 3.5 tiles across as
  Hex is. A cold streak runs from her staff to the knot, and the ring bursts there at its real radius. Measured, in 3 ×
  3 minutes of fighting:

  | | Before | After |
  |---|---|---|
  | Frost Nova cast, L6 mage, fighter, cleric | 0 | 4 |
  | L9 fighter, rogue, mage | 0 | 13 |
  | L15 fighter, rogue, mage | 2 | 16 |
  | The contract's no-healer party at L6 (fighter, rogue, mage), worn down | at 189 s, 264 s | at 269 s, 292 s (the gate: within 300) |
  | roomlv, a mage hero with a fighter and a rogue, L9 (two seeds) | down at 235 s, 260 s | held 300 s, 16 waves each |
  | … at L15 | down at 217 s, 284 s | held 300 s, 16 and 15 waves |

  Every contract gate still passes. The mage is clearly stronger now that her level-6 skill works. The no-healer gate
  is back near its margin before the dungeon dressing (283 s, 292 s). If it's too close, Frost Nova's power (0.8×) is
  the knob. `test/skillfx.test.mjs` holds the fix: with it, it goes off in a minute's fight and lands on a knot;
  without it, it never fires.
