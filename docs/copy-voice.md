# The owner's voice: what the Script Desk teaches

*Started 2026-11-19 · **Current**: read this before writing any line a player reads. It grows each time the owner works
through the Script Desk. Until a round is read in, the rules are the style sheet in
[copy-review.md](./copy-review.md) §8 plus the owner's ask below.*

## Where the edits live

- **The Script Desk:** https://claude.ai/artifact/HqBdb1cozFdMLDhUYFpTkp (private to the owner). It lists every line a
  player reads (dialogue, Journal, Chronicle, item flavour, names, menus) by storyline and quest. Each line shows its
  current text and a proposed rewrite, and has room for the owner's own wording.
- **Its store** (the `ArtifactData` tool, that URL):
  - `edits/<row id>`: one document per line the owner touched.
    - `choice`: `keep`, `proposed`, `mine` or `cut`.
    - `mine`: the owner's wording.
    - `note`: the owner's reason.
    - Also the line's `cur`, `proposed`, `why`, `tag` (fix · repeat · voice · wit · name · clarity), `who`, `q`, `g` and
      `at` (file:line, as of commit c80350e).
    - `isNew` / `after`: a proposed new line and the row it follows.
  - `notes/general`: the owner's free notes on voice and humour.

## How a round is read in

1. List `edits` (page through with the cursor) and read `notes/general`.
2. Learn from four kinds of evidence, in this order:
   - the `note`s and general notes, which are the owner's own words;
   - `mine` against `proposed`, which shows what the owner changes in our writing;
   - which proposals the owner took against which they kept or cut, by tag and by speaker;
   - which new lines and wit ideas survived.
3. Write what was learned below. Keep each finding short and quote an example. Say per speaker where the owner's taste
   differs from §8.
4. Apply the decisions to the game files:
   - Ink: then run `node tools/content/ink.mjs`.
   - Content JSON.
   - `src/sim/items.js`, `party.js` and `skills.js`. Check the replay hash in `smoke-test.mjs` after any change to text
     the sim stores.
   - Run `npm run check` and the browser suite, because some checks match text.
5. Re-check `at` against the current file before applying a line, because lines move.

## The owner's standing asks

- 2026-11-19: "Much of it seems to be written by AI, with odd names and repeating phrases." Break the shared templates
  and give each speaker their own device (copy-review.md §1–§3, §8).
- 2026-11-19: "Add additional suggestions to include some of the typical D&D dry wit and humor." This means dry,
  deadpan humour about the adventuring trade, in each speaker's own voice:
  - the indignities of the work: looting the dead politely, hazard pay, the trap that checks back, who carries the
    loot;
  - townsfolk who are unimpressed by heroes.

  It stays in-world. Never mention dice, levels, XP or a DM, and no modern idiom. At most one punchline a line. Agnes
  and the Chronicle stay solemn.

## Learned from the owner's edits

### Round 1 (2026-11-19): *Smoke over the Vale*, 5 lines, all the owner's own wording, all now in the game

What the edits show:

- **The Journal speaks plainly and points the way.** The owner rewrote the quest's Journal text, not its dialogue. The
  rewrites name the place the way a player knows it, as a dungeon you go into: "the entrance to the Old Barrows'
  dungeon"; "Head down the road and find Old Barrows dungeon. Go in and drive out the Redhand…". They say what to do
  in game terms: "win four waves on the first floor", not "hold".
- **No abstract place names in objectives.** The owner's note on the label: "Waves held at the Barrow Mouth" became
  "Waves held at the Old Barrow", "the name of the quest location matches what was given in the original quest text".
  "Mouth" was "too abstract". An objective uses the name the quest gave the place, not a room or floor name the player
  hasn't been told.
- **Say what comes next.** The ready line gained "and tell you what is next". When a quest hands the player on, the
  text should say so.
- **Name who was cleared.** "clear of Redhands": say who, not just that the place is clear.
- **Grammar sharpened, voice kept.** On Maudry's line, "That's not warmth, that's spite" became "That's not for warmth,
  that's for spite". The owner kept the joke and made it parse.

Notes for writers:

- The owner's own words for the foe are "Redhands" (plural) and "the Old Barrow" (singular, in the label and ready
  line). Canon says "the Redhand" and "the Old Barrows". The owner kept "Old Barrows" in the summary and journal, so ask
  which form they want before making it uniform.
- Two of the edits ran over the quest schema's limits: summary 240 characters, ready 120. They were trimmed to fit with
  the owner's additions kept. The desk now counts characters against each field's limit.
