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

*(Nothing yet. The first round is read in once the owner has worked through the desk.)*
