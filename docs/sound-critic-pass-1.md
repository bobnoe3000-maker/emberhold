# Sound critic pass 1: steps, blows, cries, water

The first pass on the game's sound ([sound-plan.md](./sound-plan.md) phases S0–S3). It covers the owner's asks:
- walking;
- attacks;
- a screech or a "hah!" as foes arrive;
- water dripping and the creek flowing.

It also covers the settings menu the owner asked for. The owner's direction (2026-10-03):
- free packs for the voices;
- ambience only in the Vale and the dungeons;
- start moderate;
- switches for ambient sound, attacks and spells, and foes' arrival and death sounds.

## How it was measured

- **The sound files:** each one through ffmpeg:
  - `volumedetect` for the mean and peak;
  - `ebur128` for the loops' loudness;
  - the 2–5 kHz band, which is where a screech gets harsh.
- **The game:** headless Chromium, with the first tap starting sound.
  - The engine's `play` and `blow` were wrapped to log every cue asked for and played.
  - A dev meter after the limiter (`audio.meter()`) was read every 100 ms.
  - Runs:
    - a 30 s goblin fight in the Scrag Warren (a fighter, a cleric and a rogue at levels 1–2);
    - a 30 s Ashbound fight in the Old Barrows;
    - 15 s walking in the Vale near the river.
- **Sync:** a footfall's frame, checked in `test/audio.test.mjs`. The animator's walk is stride-synced, so a
  constant walk of 10 cycles should give 20 footfalls, on the contact frames.
- **Settings:** browser test 18: the first tap starts sound; the menu's Sound panel; a switch survives a reload.

## What was wrong (ranked), and what changed

**1. Silence.** There was no sound outside the intro.
- **Now:** footsteps by ground and weight; swings by weapon and school; blows (synthesised, with a crack on a
  crit); heals, wards, guards, war cries and hexes; loot, level-ups, chests, stairs and coins; foes crying out as
  they come within earshot, flinching and dying; and ambience by place and time.
- **Ambience by place:** the river by its distance; birds by day; owls at dusk and night; the dungeons' drips and
  draught; goblin fires in the warren.
- **Coverage:**
  - In the warren fight, every category played: steps, swings, blows (including crits and heavies), the
    fighter's war cry, a hex, the goblins' cries, flinches and deaths, and the drip, cave and fire loops.
  - In the Vale: the river (at 0.59, 8 tiles off) and birds at dawn.
  - No page errors.
- **The menu:** Sound has a volume slider (default 60) and switches for ambient, attacks and spells, footsteps,
  and foes arriving and falling. Each row is ≥ 44 px, and the settings are kept per device.

**2. A cue's variants didn't match.**
- The goblin's two cries, both peak-normalised to −1 dBFS, sat at mean −27.2 and −14.6 dB: 12.6 dB apart. One
  was nearly inaudible.
- **Fix:** voices are now levelled by their mean (−18 dB) and limited to −1 dBFS. The goblin's cries are now
  −21.8 and −21.0 dB, 0.8 dB apart. Every family's variants are within 3 dB.

**3. The screech was harsh.**
- The goblin's "hah!" (`goblin_phys`) had nearly all its energy in 2–5 kHz: −16.3 dB there against −14.6 dB in
  the full band.
- **Fix:** voices take −3 dB at 3.5 kHz before levelling. That band is now at −22.8 dB, 6.5 dB quieter.

**4. The Vale was nearly silent.**
- Walking by the river measured −35.2 dBFS mean RMS, too quiet for a phone speaker.
- **Fix:** the ambient bus went from 0.5 to 0.65. It now measures −32.9 dBFS mean RMS, still well under a fight
  (ambience shouldn't compete).

**5. A crowded fight wanted more than it should get.**
- In the warren, the figures asked for 6.2 footsteps a second.
- The voice cap (4) and the 45 ms retrigger gap play 4.2 of them; 32 % are dropped. These are the farthest and the
  latest, never a whole family.
- Swings and blows: 1.6 a second asked, 7 % dropped. Cries and deaths: 0.4 a second, none dropped.

## The numbers now

| Measure | Warren fight (30 s) | Barrows fight | The Vale (river 8 tiles off) |
|---|---|---|---|
| Mean RMS after the limiter | −24.8 dBFS | −31.4 dBFS (before the ambient change) | −32.9 dBFS |
| Loudest second | −21.4 dBFS | −25.2 dBFS | −30.9 dBFS |
| Peak | −9.3 dBFS | −11.6 dBFS | −15.8 dBFS |

- **Headroom:** these are at the default volume (0.6, about −4.5 dB under full). Full volume brings a busy fight's
  loudest second to about −17 dBFS, near the plan's −16 LUFS for phone speakers. The limiter never touched a peak
  (all are below −6 dBFS).
- **Loops** (ebur128): the river −20.2, birds −22.6, owl −20.6, cave −19.3, fire −24.7 and drips −26.2 LUFS. The
  drips sat quiet because their true peak capped the normalisation.
  - **Since (the owner):** the drip loop dripped 12 times in 10 s, which is too busy. It's gone. Single cut drops now
    fall at random, at least 10 s apart (measured in the warren over 80 s: 10.8–15.1 s; the chapel about 14 s; the
    mill about 30 s). The size is now 702 KB.
  - **Then the birds and the owl** went the same way: single calls cut from their loops, at least 10 s apart (birds
    12–25 s at dawn, the owl 10.5–19 s at night). The bird cuts are denoised: levelled alone, the field recording's
    hiss showed. The size is now 622 KB.
  - **Footsteps start at 25 %** of their pass-1 level (the owner), about −12 dB, on the new Footsteps slider.
- **Sync:** 20 footfalls in 10 cycles, every one on frame 4 or 9 (the contacts); a swing is flagged once, on its
  first frame.
- **Size:** 692 KB (51 one-shot files for 31 cues, plus 6 loops). One-shots load after the first tap; loops only
  where they play.

## Scores (1–5)

| Criterion | Score | Why |
|---|---|---|
| Readability | 4 | Blows, swings, cries and deaths all tell apart. A crit's crack reads. Spells are generic (one fireball, one freeze). |
| Fit | 3 | Flare's sounds are a little bright and clean for the Vale's worn tone. The goblins are right; the human "hah!" is a borrowed grunt. |
| Sync | 5 | Steps sit on the contacts by construction; swings start on the swing's first frame. |
| Fatigue | 3 | 20 of 31 cues have one file. The pitch spread (±4 %) and per-kind pitch help, but a long farm will hear the same flinch. |
| Space | 3 | Pan follows the screen, and gain falls off by distance. There's no reverb by place yet: the warren's echo is the echo step's own. |
| Mix | 4 | A fight peaks at −9 dBFS. Voices sit over the steps, and ambience sits under the fight. |
| Load | 4 | 692 KB, with loops fetched only where they play. Caps of 4 steps, 6 combat sounds and 3 voices. Steady after load. |

## Next (pass 2)

- **Variants:** more of them for the single-file cues: our own recordings, or more packs.
- **Space:** a convolution reverb per place (the warren, the barrows, the chapel), sized by the room.
- **Town:** the smith's anvil near the forge and a murmur on the square. Flare has an `anvil_loop`.
- **S4:** UI taps, the Journal's page and the shrine's hum; haptics paired with level-up and a rare drop on native.
