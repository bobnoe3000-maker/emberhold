# First steps and first-open cards (a plan)

**Status:** the opening square's cards are **Implemented** (2026-11-10, GDD §6.1 v1.64: `src/ui/firststeps.js`,
`content/firststeps.json`). The services' first-open cards (§3) are **Proposed**.

The owner, 2026-11-10: "After Ready - create a few focus screen, tool tips/tutorials - Opening square: How to move, how
to view your character and whats on those screens, compass navigation, quest log, and world menu and main menu. how to
find your first quest. Create a plan for more tool tips when a player opens a screen for the first time describing
what/how - e.g. shop, smith, tavern, inn, temple".

## 1. The rules every card keeps

- **One at a time, and short.**
  - A card says what a thing is for and the one way to use it.
  - The rest is found by using it.
  - A title of a few words; at most 320 characters of text, about four lines on a phone.
- **Pointing, not covering.**
  - A card rings what it's about, the screen dimmed round it, and stands on the far side of the screen from it.
  - Where it can, the card sits in the lower half (thumb reach).
- **Easy to leave.**
  - Every card has Next (Done on the last) and Skip.
  - Skip ends the set, and the set doesn't come back by itself.
  - The menu's **First steps** shows the opening square's set again.
- **Once, per game slot.**
  - Whether a slot has seen a set is a note on the device (localStorage, like the menu's settings).
  - It is how the screen is learned, not the game's progress: the sim and the save never see it, and a replay is
    the same with or without it.
  - With storage off, a card is shown at most once a session, never one that won't go.
- **Presentation only.**
  - Nothing a card does touches the sim, and the cards swallow their taps.
  - The sim is held while the opening set is up, so nothing happens behind it.
  - A service's card sits over its window, which waits.
- **Written as the game is.**
  - The text is content (JSON, checked against a schema), written in the world doc's plain voice.
  - Rendered as text, never HTML.

## 2. The opening square (implemented)

After Ready, once the town's square is up and the HUD is on it, eight cards. `content/firststeps.json`:

| # | Card | Rings | What it says |
|---|---|---|---|
| 1 | Walking | (the world) | drag for the stick; tap the ground, a door, a person, a chest; pinch to zoom |
| 2 | Your hero | your card (`#party`) | tap for your windows: Gear and the bag, Stats (the points, what you were born with), Skills (every three levels, four in a fight); companions get cards beside yours |
| 3 | The compass | `#compassBtn` | pick a place and your hero walks there; drag or tap to stop |
| 4 | The Journal | `#journalBtn` | the errands, their steps, who to go back to; the tracked one under it |
| 5 | The World map | `#mapBtn` | the land and the Old Provinces; the Guild's coach between towns you've walked to |
| 6 | The menu | `#menuBtn` | pause, slots, sound, graphics, brightness, these first steps again; the game keeps itself |
| 7 | The square | `#hubBar` | the services a tap away while you stand in a square |
| 8 | Your first errand | (the world) | Maudry Fenn at the Tired Mule has work; the gold mark over anyone with work for you; walk up and tap her |

The browser suite reads the eight through, in order, each but the first and last ringing its thing
(`test/browser/run.mjs`, the M3 flow).

## 3. The services' first-open cards (proposed)

The first time a window opens in a game slot, one card over it says what the window is for and how it works. Each is
one card, not a set. Its rows are the window's own (`townmenu.js` SERVICES), so the card never repeats them.

| Window | Opens from | The card (draft) | Rings |
|---|---|---|---|
| **Shop** | the square's Shop | "Plain arms and armour at your level, new every dawn. Buy for anyone in your company; sell what you carry, and buy it back if you change your mind. A Homeward Scroll is always on the shelf: it takes you home from a dungeon." | the Buy row |
| **Smith** | Smith | "The forge makes what you wear better. Upgrade a piece up to +5 with gold and cinders; reforge one of its traits on a Fine piece or better; salvage what you won't use into cinders. The Deepdelver-fostered pay a tenth less." | the Upgrade row |
| **Tavern** | Tavern | "The Lantern Guild's room. The board has short jobs for this land; the sellswords for hire change every dawn (their rank, their perks, their fee); the coach goes to any town you've walked to. Ask around for more faces, for a few coins." | the Hire row |
| **Hire** (inside the tavern) | Hire companions | "Two slots beside you. A sellsword costs a fee to sign and a wage every dawn; pay them and they grow loyal, and a Lantern or a Beacon shows a perk it kept back. Unpaid, their perks go dark." | the first card's fee |
| **Inn** | Inn | "Rest to be whole again; it lifts Weakened. Your companions who aren't with you wait here, on the bench, at half wages, and can be sent on the road for XP and gold while you're away." | the Rest row |
| **Temple** | Temple | "The Grey Sisters raise the slain, free once a day and for gold after. Respec sets your attribute points back to spend again (the first time free); what you were born with stays. The Chronicle holds the lore you've found." | Raise the slain |
| **The board** | the tavern's Quest board | "Small jobs posted for this land: a number of a thing put down, somewhere to clear. Take one and it goes in your Journal; come back here for the pay." | the first job |
| **The coach** | the tavern, or the World map | "The Guild's coach runs between towns you've walked to, ten gold a day of road. It leaves from a square." | the first town |
| **The bag** (Gear tab) | your card, first time | "What you carry, and what each of you wears. Tap a piece for its card: wear it, compare it, sell it later. A green number is what gear adds." | the bag |
| **Skills** (tab) | your card | "A new skill every three levels, a passive every ninth. Points from each level raise their ranks. Four go into a fight: choose which, and they're used as the fight wants them." | the loadout |
| **A dungeon's first room** | entering one | "The room is the fight: foes come in waves while you stay in it. Walk out through a doorway and it's over, the room as it was. The stairs go down to harder floors." | the room's doorways |
| **Fallen** | the first time a hero falls | "Fallen: back at the temple, weakened for a while. A companion who falls in a fight is slain until the temple raises them." | the temple's row |

How it's built, when it is:

- **One module, two kinds of set.** `firststeps.js` gains `once(id, card)`: show this one card the first time `id` is
  asked, ringing `at` if it's on screen.
- **Asked from the windows' own code at open:** `townmenu.js` `open(kind)` and its subviews (`hire`, `board`, `coach`),
  `sheet.js`'s tabs, `battle` start (the first room), `fallen` (the sim's event).
- **The text** in `content/firststeps.json` under `once`, the schema as the steps'.
- **Seen** as the steps are: a note a slot on the device.
- **Order of work:**
  1. the six services (shop, smith, tavern, inn, temple, hire);
  2. the board and the coach;
  3. the tabs;
  4. the first room and the first fall.
  The browser suite opens each window once and sees its card, and opens it again and sees none.

## 4. Not yet

- A pointer that walks you to Maudry (the compass already does, once her errand is tracked; the card says where she
  is). If players still miss her, the errand can be tracked from the start.
- Cards for the overland's spawn points, expeditions and the Mere Tower: when each first comes into reach, in the same
  `once` form.
- Translations: the text is content, keyed by id, ready for them.
