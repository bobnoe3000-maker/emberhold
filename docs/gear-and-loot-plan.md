# Gear and loot v1

**Mockup:** `docs/gear-mockup.html`. **Rules:** GDD §8 (slots, rarities, class items),
§4 (stats) and §10 (Embers). This is the smallest build that lets you find gear, equip it
and see it change your numbers. The later sections list what is deliberately left out.

## Status: implemented

The code is in `src/sim/items.js`, `src/sim/loot.js` and `src/ui/sheet.js`. It differs
from the original plan as follows:

- **Six slots, not four:** weapon, off-hand, helm, armor, boots and trinket. Each class
  has its own bases for all six. The armor and boots icons are cut from the character
  models' body and leg meshes.
- **Class base stats now include the starting kit.** The level-1 values in `CLASSES` are
  the GDD table minus the level-1 starting kit. A fresh character in their kit has exactly
  the GDD numbers, so the room-level balance still holds:
  - at-level rooms cost 21–31 % HP per wave;
  - a room three levels above you defeats you.
  (2026-09-30: gear now grows twice as fast with item level and the classes that much slower, so
  gear at your level matters; GDD §7.1.)
- **Rare ability modifiers work now,** not later. "*X* costs 3 less MP" and "*X* hits
  15 % harder" apply in battle when the wearer's class ability matches.
- **Full bag:** any drop is salvaged straight into Embers, with a toast. There is no
  overflow slot.
- **Off-hand with a two-handed weapon:** equipping an off-hand is refused while a
  two-handed weapon is worn. The card says why.

## What the player gets

- **Open the sheet:** tap a party card to open that member's sheet. It shows:
  - six slots: weapon, off-hand and trinket on the left; helm, armor and boots on the right;
  - stats with the gear's share shown in green;
  - the shared party bag (20 slots) with gold and Embers;
  - tabs to switch member. A green dot on a tab means an upgrade is waiting.
- **Item card:** tap an item, worn or in the bag, to open it. The card shows:
  - the icon, name in rarity colour, rarity, item level, slot and class;
  - base stats, affixes, and any ability modifier;
  - a flavour line;
  - a comparison against what's worn (bag items only);
  - actions: **Equip**, **Unequip**, **Give to …** (off-class items) and **Salvage** (Embers).
- **Loot drops:** a drop shows a beam where it fell and a toast naming the item. The toast
  offers one quick action: **Equip on X** (the member it upgrades) or **Bag**.
- **Upgrade badges:** party cards and bag items flag upgrades with **▲**, and new items
  with **NEW**.

## Icons

- `tools/actor-lab/icons.cjs` + `iconlab.js` bake `assets/items/<id>.png` at 96 px from
  `icons.json`:
  - one mesh isolated from the KayKit hero kits (or the Ashbound weapons);
  - placed on the RPG diagonal;
  - lit with a warm key and a cool rim;
  - supersampled 4×, with an ink outline.
- **The 39 icons:**
  - **Weapons:** 1H/2H sword, 1H/2H axe, knife, 1H/2H crossbow, wand and staff.
  - **Off-hands:** five shields, an offhand knife and a tome.
  - **Headgear and cloaks:** plate helm, fur hood, rogue hood, witch hat and three cloaks.
  - **Body armour and boots:** plate, fur, leather and robes, cut from each class's body
    and leg meshes (`meshes` + `below` in `icons.json`).
  - **Ashbound gear:** blade, axe, staff, crossbow and shield.
  - **Trinkets:** ring, amulet and charm, modelled in code.
- A new base item that uses an existing mesh needs only a line in `icons.json`.

## 1 · Sim: items, gear, stats (`src/sim/items.js`, `party.js`, `core.js`)

**Item bases.** `BASES` is a data table, one row per base, for example:
`{ id, name, slot, cls, hands, icon, stats: { atk: [base, perIlv] } }`.

About 20 bases cover the GDD slot table:

| Class | Weapons | Off-hands | Helm | Armor | Boots |
|---|---|---|---|---|---|
| Fighter | sword, axe, greatsword, great-axe, Ashbound falx / cleaver | round, kite, tower, spiked shields, targe, Ashbound buckler | great helm, bear hood | plate harness, fur mail | sabatons, fur boots |
| Rogue | dagger, hand crossbow, heavy crossbow, Ashbound arbalest | parrying dagger | hood | leathers | soft boots |
| Mage | wand, staff, Ashbound staff | tome | witch hat | robes | slippers |

**Trinkets** (any class): ring, amulet, charm.

**Item instances** are plain JSON, so they save as they are:

```js
{ uid, base: 'sword_2h', r: 'fine', ilv: 5, name: 'Cinderbrand Greatsword', aff: [['hp', 15]], mod: null }
```

**Rolls.** `rollItem(rng, { ilv, rarity, classes })` builds an item:
- **Base:** picked with an 80 % bias toward the party's classes. Trinkets are always
  eligible.
- **Affixes:** drawn from the eight stats. Fine gets 1, Rare gets 2.
- **Rare modifier:** a Rare also gets one ability modifier, picked from its class's
  abilities.
- **Name:** comes from word lists, e.g. *Cinderbrand Greatsword* for a Fine or
  *Greatsword of the Last Hearth* for a Rare.

Every roll uses the sim RNG on its own stream (`streamSeed(seed, site / wave / chest)`), so
a replay reproduces the same loot.

**Gear on members.** Each member gets
`member.gear = { weapon, off, helm, armor, boots, trinket }`. Starting kits are Common items
at the member's level, matching the model they already wear:
- **Fighters:** sword, round shield, great helm, plate harness and sabatons.
- **Rogues:** dagger, parrying dagger, hood, leathers and soft boots.
- **Mages:** staff, witch hat, robes and slippers.

**`statsFor(m)`** adds the gear's stats on top of the class and level values. It returns
the totals, a `gear` breakdown (the green numbers on the sheet), and `hpr` / `mpr` so gear
can raise regen. Battle regen reads those instead of `CLASSES[cls].hpr`. That is the only
battle change.

**Commands:**

| Command | Rules |
|---|---|
| `equip {member, uid}` | Checks class. A **two-handed** weapon moves the off-hand to the bag, and an off-hand refuses while a 2H weapon is worn. The replaced item goes to the bag. Refused if the bag is full. |
| `unequip {member, slot}` | Moves the item to the bag. |
| `give {member, uid}` | Equip on another member (off-class convenience). |
| `salvage {uid}` | Grants Embers by rarity: 1 / 2 / 5 / 12. |

**State and saves:** `state.bag` (up to 20 item objects) and `state.counters.embers`.
`snapshot()` / `restore()` gain `bag` and `embers`; gear already rides along inside
`party`. Old saves without gear get the starting kits.

## 2 · Drops (`battle.js`, `core.js`)

**Sources:**
- **Chests:** a chest already emits `looted`. It now also rolls one item.
- **Wave clears:** a small chance, weighted by room level.
- **Elites:** a higher chance.

**Item level:** the room level, which ties loot to the fixed room-level ladder (deeper
rooms give better gear).

**Proposed v1 rates** (generous so the loop is testable; tune after playtests):

| Source | Any item | Fine | Rare |
|---|---|---|---|
| Chest | 60 % | 25 % | 4 % |
| Wave clear | 8 % | 20 % | 2 % |
| Elite | 30 % | 35 % | 6 % |

The Fine and Rare columns are shares of the items that drop; the rest are Common. The GDD's
rates (Fine at 1 % per wave) assume a long grind and would make v1 feel empty.

**Loot event:** the sim emits `loot { item, x, y, src, best }`, where `best` is the member
the item upgrades most (a simple stat-weight score per class).

**Full bag:** a Common drop is auto-salvaged with a toast. A better drop waits in a
one-slot "overflow" until you make room.

## 3 · UI (`src/ui/sheet.js`, `party.js`, renderer)

- **`sheet.js`:** the bottom sheet from the mockup, DOM only like `compass.js`, talking to
  the sim through commands:
  - member tabs;
  - the four-slot paper doll around the atlas portrait;
  - the stats grid;
  - the 5×4 bag;
  - the item card with comparison.
- **Party cards:** they become tappable (today the panel is `pointer-events: none`). They
  get the **▲ UPGRADE** badge.
- **Loot toast:** reuses the compass chip's styling. The toast offers **Equip on X** /
  **Bag**.
- **Renderer:** a loot beam and ground glint at the drop point for about 2 s, built from
  the fx.js primitives (a vertical ribbon plus a disc). It is coloured by rarity.
- **While the sheet is open**, the stick and tap-to-move are ignored, but the sim keeps
  running. The sheet is allowed in battle so you can swap gear mid-fight.

## 4 · Tests (`smoke-test.mjs`)

- The same seed produces the same drops across a replay.
- Equip and unequip round-trip through the bag.
- A 2H weapon frees the off-hand. Class limits are enforced.
- `statsFor` totals equal the base values plus the gear.
- A save and reload keeps the gear and the bag.
- A chest yields a `loot` event.
- **Balance check:** the existing solo-hold and room-level checks still pass with the
  starting kits. The kits are tuned so a starting character matches today's numbers.

## Not in v1 (next)

- **More Rare modifiers:** v1 has cost and power. Behaviour changes, such as *Cleave
  strikes one more foe*, need more hooks in ability resolution.
- **Heirlooms:** fixed named items from bosses and hidden sites.
- **Smith upgrades and the shop:** smith upgrades +1 to +5, and the shop selling Commons.
  Both town services already exist in the menu.
- **Visible gear:** a new weapon changing the sprite. The weapon anchors from the FX work
  make a **separate weapon layer** possible. The plan: bake the bodies without weapons,
  bake each weapon family as its own small atlas, and composite at the hand anchor.
  Re-baking a full atlas per loadout would not scale.
- **Potions and consumables.**

## Order of work

1. Build the sim: items, gear, stats, commands and saves, with tests.
2. Add drops and the loot event.
3. Build the sheet and item card.
4. Add the toast, the beam and the badges.
5. Tune the rates with a headless farm run: drops per 10 minutes at each room level.
