# Sound plan: effects, ambience and the sound critic passes

**Phases S0–S3 implemented · 2026-10-03.** S4 (UI sounds beyond loot and level-up, haptics) is still to do; see §9
for what shipped. The owner asked for sound, beginning with: footsteps, attacks, a screech or a "hah!" when foes
appear, water dripping, and the creek flowing.

The owner's answers to §8 (2026-10-03):

- **Voices:** start with free packs for the foes' voices.
- **Music:** ambient sound only in the Vale and the dungeons, no music beds.
- **Default:** sound starts at a moderate level, with a game menu to switch off:
  - ambient sound;
  - attack and spell effects;
  - foes' arrival and death sounds.

  Footsteps got a switch of their own too.

This plan covers:

- what we play and when;
- where each sound comes from;
- how it is built without touching the sim;
- the **sound critic passes**: a measured review after each phase, like the art critic passes.

Decision A15 (architecture.md) is now made.

## 1. Where we are

- **The intro's score** (`src/cutscene/score.js`) is the only audio. It is synthesised live in WebAudio, with no
  files (decision A12).
  - It handles the browser unlock (sound starts only after a tap) and a music toggle kept in localStorage
    (`cutscene/player.js`).
- **Architecture §8.9** chose Howler.js for audio, but nothing uses it. A12 already went without it.
- **Ink tags:** `# sfx:` is reserved and dropped (`story/adapter.js`), so dialogue can cue sounds later.
- **What we can hook today, all presentation-side:**
  - The sim's bus events: `combat` (`hit` with `src`, `crit`, `heavy`; `miss`; `warded`; `fallen`; `lifeline`),
    plus `wave`, `battle`, `slain`, `loot`, `chestOpened`, `shrine`, `levelUp`, `descend`, `questChanged`,
    `tideTurned`, `traded`, `forged`, and others.
  - The animator's state:
    - walk phase per unit (`anim.js`: frames advance with distance, so footfalls can sit on the feet);
    - the swing start (`atkN`) and its impact frame;
    - the hit flinch, death and spawn (`e.spawn`).
  - The world:
    - ground materials outdoors (`oMaterialAt`: grass, dirt, cobble, field; water and bank tiles for the river and
      the mill-race);
    - floor materials and themes in the dungeons (`level.js`: soil, sand, basalt, bone, flesh; the warren is an old
      mine in rock; the chapel's floors are poison pools);
    - the time of day (the sky dial).

## 2. Rules

1. **Sound is presentation.** It is a listener on `sim.bus` and the renderer's state, like the renderer.
   - The sim never imports it, and nothing it does reaches a command.
   - No sim RNG stream is drawn for it: its variety comes from its own hash of unit id and time.
   - A replay is the same with sound or without (golden rule 1).
2. **Nothing important is sound-only.** Every cue has a visual twin already: the hit flash, the wave banner, the
   loot beam. Muted play loses nothing (A3 accessibility).
3. **Dusky, small and close.**
   - The world doc's tone carries over: small stakes, wry, worn.
   - Leather, wood, iron and wet stone, not orchestral hits or sci-fi whooshes.
   - Goblins sound nasty and a bit funny, not monstrous.
4. **Barks are noises, not words.** Screeches, grunts, a "hah!", a cackle, a hiss. Any spoken line stays authored
   text in Ink (golden rule 5). No voice is generated at runtime.
5. **Mobile first.**
   - One AudioContext, shared with the score.
   - Unlock on the first tap; pause on `visibilitychange` and Capacitor `pause`.
   - Keep the voice count and the download small (budgets, §6).
6. **Catch-up is silent.** When the sim runs many ticks in one frame (a resume, offline progress), the listener
   drops what it missed rather than playing a pile-up.

## 3. Architecture (decision A15, made 2026-10-03)

**A15 (proposed):** `src/audio/` on raw WebAudio, sharing the score's context. This replaces Howler in §8.9.

- Sound effects are of two kinds:
  - **synthesised** (footsteps, water, wind, whooshes, UI): no files, endless variation;
  - **decoded from one CC0 sample sprite** (impacts, barks, the drum): what synthesis does badly.
- Howler's two strengths are the mobile unlock and audio sprites. The score already does the unlock, and a sprite
  is a 40-line `AudioBuffer` slice, so no dependency is needed.
- Files are Ogg Opus with an AAC (`.m4a`) twin for older iOS Safari. Credits go in `assets/CREDITS.md`.

Modules:

| File | Job |
|---|---|
| `src/audio/engine.js` | Owns the context: unlock, the buses (music · sfx · ambience · voice · ui → master → limiter), ducking, the settings (a volume per bus, mute), pause and resume. It takes over the score's context and mute toggle. |
| `src/audio/voices.js` | A voice pool: the cap per category, steal-oldest, and a per-cue rate limit. Positioning from screen space: pan by the screen x of the source, gain by its distance from the view's centre, silence beyond the view plus a margin. |
| `src/audio/synth.js` | The synthesised recipes as functions: `footstep(material, weight)`, `whoosh(kind)`, `drip(pitch)`, `creekBed()`, `wind()`, `fire()`, UI ticks. Each is parameterised and seeded, with no fixed samples. |
| `src/audio/bank.js` | The sample sprite: loads one `sfx.ogg`/`.m4a` plus `sfx.json` (named slices, each with 3–6 variants), decodes once, and picks a variant, never the same twice running. |
| `src/audio/cues.js` | The map from game to sound, as pure functions (tested under node): `cueForCombat(ev)`, `footstepMaterial(world, x, y)`, `barkFor(kind, elite, boss)`, `ambienceFor(world, x, y, tod)`. Data lives in `content/sounds.json` with a schema, so the mix is data. |
| `src/audio/listen.js` | The listener. It subscribes to `sim.bus` and reads the renderer's per-frame state (the animator already knows walk phase, swing start and spawn), then calls the cues. |
| `src/ui/settings` (existing menu) | Sliders for music, effects and ambience, and a mute. All ≥ 44 px. Stored per device, not in the save. |

The renderer gains one small hook: per frame, it hands `listen.js` the units it drew with their screen position,
anim state and atlas (what the dev `__trace` already collects). The animator gains one: a **footfall** flag when a
walk phase crosses a contact point.

## 4. The sounds

Each row is a cue, with its source, its trigger and its first-pass mix level. The level is relative to master,
and the critic pass sets the real ones. "Synth" means built in `synth.js`; "sample" means a slice of the sprite.

### 4.1 Footsteps (the owner's first ask)

**Trigger.** The animator's walk phase crosses a contact point: two per cycle, half a cycle apart, measured on
each clip as `PASS` was for the passing poses.

- Because the walk is stride-synced, steps land on the feet whatever the speed.
- The same rule covers the goblins' new run and the skeletons' shamble.

**Material** is the ground under the unit:

| Where | Material | Character |
|---|---|---|
| Vale meadow and fields | grass | soft, dry swish |
| Tracks and roads | dirt | packed thud with a little grit |
| Thornwick | cobble | hard tick, short ring |
| Bridges, the mill's deck | wood | hollow knock |
| River bank, the mill-race edge | wet | squelch, a splash on 1 step in 4 |
| Dungeon soil and sand (barrows, mill, warren) | soil | muffled crunch, cave reverb |
| Basalt and obsidian (keep cellars, milestone) | stone | crisp scuff, long tail |
| Bone and flesh floors (the chapel, the keep) | bone / wet | brittle crackle / soft slap |

**Weight**, by figure:
- light: goblins (quick, scuffing);
- normal: people;
- heavy: Garrow, the bruiser, Skarn, more low end;
- shamble: the Ashbound, a drag and a bone clack.

**The party** steps at full level. Foes are 6 dB under and positioned, and companions sit between the two.

**Budget:**
- at most 4 footstep voices at once, the hero's always kept;
- under 2 ms of synthesis per step;
- variety from pitch ±6 % and a random filter cutoff.

### 4.2 Attacks and blows

**Swing** (on `atkN`, timed so its peak lands on the clip's impact frame), by weapon or school:
- blade: thin whoosh;
- axe, mace or heavy: deep whoosh;
- dagger: flick;
- staff: wooden swoosh;
- bow: string release, then an arrow whiz along the bolt's flight;
- crossbow: thunk;
- spells: a fire roar for the mage's bolt, a hollow drone for the shaman's spirit bolt and hex, a soft bell for
  heals and blessings, and a glassy shimmer for wards.

**Impact** (`combat: hit`), by what was hit:
- flesh: thud;
- armour: clank;
- shield: block (the target's guard);
- bone: the Ashbound, dry crack.

A crit adds a short bright sting. `heavy` adds low end. A `miss` is a swing with no impact, plus a scuff.

**Down and out:**
- `fallen`: a body-fall thud and a low tone;
- an enemy's death: its kind's death cry (§4.3) or a bone collapse;
- `lifeline` and `warded`: a quick rising shimmer.

**Rate:** at most 6 impacts a second room-wide; above that, the quietest are dropped. Mix: impacts −10 dB,
swings −14 dB.

### 4.3 Foes arriving: screeches and "hah!"

**Trigger:**
- a foe's `spawn` starts (a living foe walking in out of the dark, the Ashbound rising), or `wave` fires;
- one bark per kind per wave, at most one every 0.6 s, and only for foes on or near the screen.

| Who | Bark | Notes |
|---|---|---|
| Goblin skirmisher | high screech, a yip | the most common: 6+ variants |
| Goblin bruiser | "HAH!" (a barked grunt) | the owner's "hah"; lower, chesty |
| Goblin archer | nasal cackle | on spawn and on a kill |
| Goblin hexer | hiss with a rattle shake | its bone rattle is in the canon |
| Old Skarn | a drum boom, then a war-screech; each swarm call (every 10 s) is two booms and the answering yips | the drum is his mechanic, so it should be heard |
| The Ashbound | earth crumble, a bone rattle, a low exhale | under the rising animation |
| Redhand cutthroat / brute / crossbow | "hah!" / a grunt / a sharp whistle | human, rough |
| Cinder acolyte | a breathy whisper-hiss | the Cult is quiet and wrong |
| Bosses on entry | a sting under the boss bar: Garrow's sword drawn, the Stranger's ember hum, the Standard's horn | one each, short |

**Source.** Barks are recorded, not synthesised: synthesised voices sound cheap. Two options, ranked:
1. Record them ourselves (the owner or friends; a phone in a quiet room is enough). They are characterful, ours,
   and need no licence.
2. CC0 creature packs, filtered and pitched. Kenney and freesound.org's CC0 set have usable grunts. The pass
   checks licences: CC0 or CC-BY only, credited.

Mix: voice bus −8 dB, ducking ambience by 4 dB for 300 ms.

### 4.4 Water

**Dripping (dungeons).** Drip emitters are placed per floor from the floor's own layout:
- under timber sets in the warren;
- at wall bases in the barrows and the keep's cellars;
- over the pools in the chapel.

The place is seeded by the renderer's own hash of the floor seed (no sim stream). Each emitter drips every
2–9 s: a pitched plink (synth: a fast pitch drop with a resonant ping), with a cave reverb sized to the room. 3–6
emitters per room, heard only near the camera.

**The creek and the river (the Vale).** A continuous bed of filtered noise with slow bubbling modulation (synth):
- Its gain follows the distance from the view's centre to the nearest `WATER` tile. The renderer already knows
  the river's centreline; precompute a coarse distance field once per world.
- It pans toward the side the water is on, and its pitch rises a little where the river narrows.
- **The mill-race and the Tithe Mill's wheel:** a louder churn plus the wheel's slow wooden knock, a loop from the
  sprite.
- **Banks:** occasional laps when the party stands on `BANK`.

Mix: ambience bus −18 dB at the river's edge, falling to silence about 14 tiles away.

### 4.5 The rest of the world (later phases)

- **The Vale by time of day:**
  - wind through the trees (synth, swelling with the sky dial);
  - birds by day;
  - crickets and an owl at night;
  - the town's murmur and the smith's hammer in Thornwick (near the forge);
  - muffled tavern noise near the tavern.
- **Fires:** the warren's fire pit, braziers, the Cult's ember (synth crackle).
- **Dungeon tone:** a room tone per theme:
  - the warren's dripping mine with timber creaks;
  - the barrows' low wind;
  - the chapel's wet hum;
  - the keep's distant chains.
- **UI and rewards:**
  - taps;
  - the Journal's page turn;
  - a coin clink on gold;
  - loot by rarity (a common tick, then a rising chime up to a rare's bell);
  - level up;
  - quest accepted and handed in;
  - a shrine's hum;
  - a chest's creak;
  - the stairs.

  All on the ui bus. The two biggest moments (level up, a rare drop) briefly duck the rest.

## 5. The sound critic passes

Each phase ends with a **sound critic pass**, written like the art critic passes: how it was measured, what was
wrong (ranked), what changed, before and after numbers. The docs are `docs/sound-critic-pass-N.md`.

**Tools** (built in phase S0):

- **The soundboard** (`?dev&scene=sounds`, localhost only):
  - every cue with all its variants;
  - played alone, as a sequence (a footstep cycle on each material, a wave arriving), and in a "busy room" mix;
  - each cue shows its level meter and a spectrogram.
  - It is the Stage for the ear.
- **The renderer** (`tools/audio/render.mjs`):
  - replays a recorded session (a scripted fight, a walk from Thornwick to the mill, a warren floor) through an
    `OfflineAudioContext` in Playwright;
  - writes `out/<name>.wav`, `spectrogram.png`, and a `stats.json`:
    - integrated and short-term loudness;
    - true-peak;
    - the voice count over time;
    - events per second by category;
    - the repeat rate (the same variant twice running);
    - the timing error between each footfall or impact and its frame.

  It runs on the manual clock, so a capture is the same every run.
- **Captures before and after**, in the commit and the doc (golden rule 7).

**The rubric.** Each category is scored 1–5 by listening, and each score is backed by a measure:

| Criterion | What it asks | Measured by |
|---|---|---|
| Readability | Eyes closed, can you tell what just happened (a hit, a miss, a block, who arrived)? | blind test on the soundboard sequences |
| Fit | Is it dusky, worn and small-stakes, the world doc's tone? Nothing epic, nothing sci-fi. | listening, against the reference list kept in the pass |
| Sync | Do steps sit on the feet and blows on the impact frame? | `stats.json`: 95 % of events within 17 ms (one frame at 60 Hz) |
| Fatigue | Does a 10-minute farm grate? | repeat rate under 5 %; at least 4 variants for any cue heard more than once a second |
| Space | Does the field sound open and the warren close? Does the river sit where it is? | reverb per place; the pan follows the screen x |
| Mix | Does anything mask a bark or a hit? Is there any harshness? | loudness by bus against the targets (§6); energy in 2–5 kHz on screeches capped |
| Load | Is it cheap on a phone? | the voice count; the audio thread on a mid phone (Chrome's `chrome://media-internals`, Safari's Web Inspector); the download size |

**Passes planned:**
- Pass 1 after S1 (steps and blows).
- Pass 2 after S2 (barks).
- Pass 3 after S3 (water and ambience).
- A whole-game pass after S4 (a full session: Thornwick → the Vale → the warren → Skarn → home).

## 6. Budgets and targets (first pass; the critic tunes them)

| Measure | Target |
|---|---|
| Master loudness, a busy fight | about −16 LUFS integrated (phone speakers), true-peak ≤ −1 dBTP after the limiter |
| Bus levels relative to master | voice −8 · impacts −10 · swings −14 · footsteps (party) −18, (foes) −24 · ambience −18 at its loudest · ui −14 |
| Voices at once | 24 at most: footsteps 4, impacts 6, swings 4, barks 3, ambience 4, ui 3 |
| Download | the sample sprite ≤ 600 KB (Opus at 64–96 kbps, mono except the beds), loaded after the first frame, never blocking play |
| CPU | the synthesis of one footstep or drip ≤ 0.2 ms, with no allocation per frame in the listener |
| Latency | a tap's click ≤ 50 ms; a bark within 100 ms of the spawn's first frame |

## 7. Phases

| Phase | Content | Done when |
|---|---|---|
| **S0 Foundations** | Decision row A15. `src/audio/engine.js` (shared context, buses, unlock, settings, pause and resume; the score moves onto it). Voices and rate limits. `content/sounds.json` with its schema. The soundboard and `tools/audio/render.mjs`. A **silence audit**: every event and moment that should make a sound, listed. | the score plays through the engine with its mute kept; the soundboard runs; `render.mjs` writes a silent baseline; check passes |
| **S1 Steps and blows** | Footfall points in the animator for every walk clip (measured, like the stride). Material lookup outdoors and in. Synthesised steps for each material and weight. Swings and impacts (synth whooshes; sampled impacts). Crit, miss, block and fallen. | **Sound critic pass 1**: sync ≥ 95 % within a frame; repeat rate < 5 %; the busy-fight loudness on target |
| **S2 Arrivals** | Spawn barks per kind (§4.3): recorded or CC0, edited, in the sprite. Skarn's drum on every swarm call. The Ashbound's rise. Boss stings. Ducking. | **Pass 2**: blind test (who arrived?) ≥ 80 % right; the screech's 2–5 kHz under its cap |
| **S3 Water and places** | The river and creek bed from a distance field; the mill-race and its wheel; dungeon drip emitters per floor; room tones per theme; the Vale's wind, day birds and night insects on the sky dial; fires. | **Pass 3**: the river heard where it is (pan error < 15°), silent beyond 14 tiles; the drips don't line up into a rhythm |
| **S4 UI, rewards and settings** | UI ticks, loot by rarity, coins, level up, quests, shrine, chest, stairs. Sliders and mute in the menu. Capacitor pause. Haptics paired with the two biggest moments on native. | **The whole-game pass**; browser tests for unlock, mute persistence, no errors, and nothing playing while hidden |

Golden-rule upkeep in every phase:
- **Tests:**
  - `node:test` for `cues.js` (event → cue, material lookup, the rate limiter, variant choice);
  - a browser test: the graph builds, the first tap unlocks, mute survives a reload, no sound while the tab is
    hidden;
  - the smoke replay unchanged.
- **Docs:**
  - this plan marked Implemented, phase by phase;
  - A15 in the decision log;
  - a §8.9 note;
  - CREDITS for every sample.

## 8. Questions for the owner (answered 2026-10-03)

1. **Barks:** free packs first.
   - The foes' voices are Flare's (CC-BY-SA 3.0), pitched per kind: the skirmisher high, the bruiser's "hah!"
     lower, Skarn lowest.
   - Our own recordings can replace them later. A cue is a list of files in `tools/audio/sounds.json`.
2. **Music in play:** none for now. The Vale and the dungeons have ambience only.
3. **Default level:** sound starts moderate (volume 0.6 ≈ −4.5 dB under full) after the first tap. The menu's
   Sound panel holds the volume and four switches: ambient, attacks and spells, footsteps, foes arriving and
   falling.

## 9. What shipped (sound critic pass 1: [sound-critic-pass-1.md](./sound-critic-pass-1.md))

**Where it differs from the plan above:**
- **Samples:** Flare's sounds (`flareteam/flare-game`, CC-BY-SA 3.0, credited in `assets/CREDITS.md`). Kenney,
  freesound and OpenGameArt couldn't be reached from the build environment; GitHub could.
- **Format:** one MP3 per variant, not a sprite. Every browser decodes MP3, Safari included, so no AAC twin is
  needed. Loops crossfade their own seam to hide MP3's padding.
- **Size:** about 690 KB in all. One-shots are decoded on the first tap; loops only in the place that has them.
  The budget in the test is 750 KB.
- **Mix data:** the cue table is code (`src/audio/cues.js`, pure and tested), not `content/sounds.json`. The
  sources are data (`tools/audio/sounds.json`).
- **Synthesis:** the blows (filtered noise, with a crack on a crit). Footsteps, water and wind are samples, which
  sounded better than a first synthesis would.

**Files:**

| File | What it does |
|---|---|
| `src/audio/context.js` | The one AudioContext, shared with the intro's score |
| `src/audio/settings.js` | Volume plus four switches, per device |
| `src/audio/engine.js` | Buses, the limiter, voice caps, retrigger gaps, variant choice, pan, crossfaded loops, synthesised blows, a dev meter |
| `src/audio/cues.js` | Voices by kind, swings by atlas, steps by ground and weight, events, ambience by place and time |
| `src/audio/listen.js` | The listener on `sim.bus` and `renderer.onFrame` |
| `render/anim.js` | Flags `step` (a foot down at the contacts, 0.45 and 0.95 of the cycle) and `swing` |
| `ui/title.js` | The Sound panel in the menu |
| `tools/audio/prep.mjs` + `sounds.json` | Builds `assets/audio` |

**Tests:**
- `test/audio.test.mjs`:
  - the settings;
  - every cue present;
  - pitch order by size;
  - the creek's fall-off;
  - day and night;
  - the budget;
  - footfalls on frames 4 and 9, 20 in 10 cycles;
  - a swing flagged once.
- Browser test 18: the first tap starts sound; the panel's switches; ambient off survives a reload.
