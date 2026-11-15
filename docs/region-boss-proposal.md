# A region boss: a proposal

**Status:** Implemented, stages 1–2 (2026-11-15): GDD §19 v1.105 is the plan of record now; this is the proposal as it
was, with what was built differently in §10. The owner, on §9: *"Ok go with your proposal, except world boss at the top of
each hour for now (24x)"*.

The owner, 2026-11-15:

> *"Propose a region boss feature, on a timer 3x per day.. huge, tells on attack to avoid, not to complex, high hp.
> Join with my party, up to 4 other partys join? Think about future multiplayer reqs"*

This follows [shared-play-rules.md](./shared-play-rules.md). Decision 5 there: *"the first event: a region boss on one
land, in a set-piece arena (the Bowl's Sand the pattern), on the stage 3 server"*. Its §4 already says what an event adds
to a raid: open membership, no wipe, contribution, a schedule. This document makes that concrete for one boss. It is
built in stages, so it plays offline long before the server exists, and nothing in the offline stage has to be
thrown away when the server comes.

## 0. In short

- **Three windows a day**, at set times. Each is 15 minutes long and announced 10 minutes before.
- **Where:** the old stones north-east of Saltmere (the Fens, the level-14 spawn point, [world doc §3.2](./emberfall-world.md)).
  In a window, the biggest stone in the ring stands up. Walking into the ring then takes your company into **the Ring**, a
  set-piece arena, as the Bowl's Sand is.
- **The boss: the Kingstone**, a stone golem **four times a man's height**, built from the golem we already have, with
  **very high HP** and **three attacks**:
  - each attack is told on the ground before it lands;
  - each is avoided by moving;
  - there are no adds, and one change at half health.
- **Your party, and up to four more.** You go in with your company (hero and two companions). Up to four other
  companies join the same fight: **five parties, fifteen heroes**. Offline, the other four are AI companies (the Bowl's
  rivals, already built). Online, they are other players' companies.
- **No wipe.** A downed hero gets up at the ring's edge after 8 s, at no cost. The fight is lost only if the window ends
  first.
- **Rewards once per window per hero**, by tier, from your part in the fight. The top tier has a chance at the
  Kingstone's own heirloom.

## 1. What the player does

1. **It's on its way.** Ten minutes before a window:
   - a toast: *"The old stones are stirring"*;
   - a marker on the World map and the minimap;
   - a line on the top bar with the countdown.
   The Guild's coach (as built) can take you to Saltmere.
2. **The ring.** Walk your company into the old stones while the window is open. The screen goes to the Ring:
   - a round arena of standing stones, about 36 tiles across, open sky;
   - the Kingstone half-buried in the middle;
   - the other companies arriving round the edge.
   - **Offline:** the AI companies fill up over the first 30 s, one to four of them, as people would.
3. **The fight.** It stands, and the fight runs until it falls or the window shuts.
4. **The end.** A card with:
   - your tier;
   - what you were paid;
   - the companies' parts, ranked (damage, healing, time standing).
   Then **Leave**, back to the old stones.

## 2. The Kingstone

The lore, proposed canon (it goes into the world doc first, if chosen):

- The old stones are older than the Empire, and the golems in them are its guards.
- The Kingstone is the ring's centre stone. It stands three times a day, at the hours the old people rang the stones.
  Nobody alive knows why.
- Moss is on its shoulders, and its ember core shows through the cracks.
- No chosen ones: it isn't killed. It falls back into the ring, and stands again at the next hour.

| | |
|---|---|
| **Size** | 4× a man: 7 Luminati units, the golem model at 4× (its clips scaled; the golem was built for 2×). Its footprint is a 3 × 3-tile block, so you fight round its feet |
| **Level** | The region's top, 18 for the Fens. Heroes are **synced to it** (§5) |
| **HP** | Very high, by how many companies are in it, in steps (§4). Set so the fight runs **5–7 minutes** whatever the head count |
| **Damage** | Its blows are slow and huge. Its plain hit (a stamp at whoever's in front) is a warrior's at its level. The three attacks below are what kill |
| **Moves** | Slowly: it turns to face its target, and steps only to keep someone in front |

### The three attacks (each told on the ground, each avoided by moving)

Every one uses the warnings we already draw (`skillfx.js`: a heavy blow's ring, a shot's lane). The tell's fill runs from
the edge in to the centre while the attack winds up, and it lands when the fill reaches the middle.

| Attack | When | The tell | What it does | Avoid by |
|---|---|---|---|---|
| **Stamp** | Every 7 s, at the biggest knot of heroes | A red ring, radius 4, filling over **1.6 s** | 60 % of max HP, knocked down 1 s | Stepping out of the ring |
| **Sweep** | Every 12 s, at whoever it faces | A 120° cone in front of it, 9 tiles long, filling over **2 s** | 45 % of max HP, thrown 3 tiles | Getting behind it or to the side |
| **Stones fall** | Every 30 s, and at 75 %, 50 % and 25 % HP | 6–10 small circles (radius 2.5) across the ring, filling over **2.4 s**, a stone's shadow growing | 70 % of max HP | Standing in the clear between them |

**At half health it cracks**, the ember showing through. It doesn't change what it does, only how often:
- Stamp every 5 s;
- Sweep every 9 s;
- Stones fall with 10–14 circles.

That's the whole fight: three tells, one speed-up. A new player learns it in one window: *red on the floor, get out*.

**The AI moves too.** Companions and the AI companies step out of a tell the way they step out of the Fens' hazards today
(`hazards.js` `openGround`). Each reacts after a short, random delay (0.4–0.9 s, longer for a lower-grade stand-in), so
they're sometimes caught, as people are. Your own hero is yours to move: a tap moves you, as anywhere.

## 3. One fight, five parties

- **A party is a company:** a hero and their two companions, or later, friends' heroes in those seats. Each party follows
  its own hero, under the rules built for raids:
  - the follow rule (shared-play §3.1);
  - one leader a party.
- **Up to five parties in the Ring:** yours and four more, fifteen heroes. A sixth party starts a second Ring for the same
  window. There is one fight per Ring, and Rings don't share HP.
- **Joining late:** a party can walk in until the Kingstone is under 25 %. Its HP step goes up when a party arrives and
  never comes down when one leaves, so leaving can't be used to make it easier.

## 4. Numbers (to tune with a harness before it ships)

**HP scaling by parties present.** Steps, not per head, so it doesn't swing:

| Parties | 1 | 2 | 3 | 4 | 5 |
|---|---|---|---|---|---|
| HP × | 1.0 | 1.85 | 2.6 | 3.3 | 4.0 |

The 1.0 base is set so a level-18 right party alone takes 6 minutes (`tools/balance/regionboss.mjs`, new: the boss.mjs
pattern with N parties).

**The targets the harness holds it to:**

| Measure | Target |
|---|---|
| Fight length | 5–7 min, 1 to 5 parties |
| A party that never moves out of a tell | Down several times, and its tier drops. Not a wipe: they get up |
| A party that dodges well | Down once or not at all |
| The window | Long enough that a party arriving late still finishes |

**Tiers.** From each hero's part:
- damage dealt;
- healing done;
- time standing in the Ring.

Each is measured against the average of the heroes there:

| Tier | Share of the average |
|---|---|
| Gold | Top 30 %, or 1.3× the average |
| Silver | 0.7× |
| Bronze | Took part 60 s |

**Pay** (paid by the event, not dropped, so the v1.104 halving doesn't apply; numbers to tune):

| Tier | XP | Gold | Cinders | Items | Heirloom |
|---|---|---|---|---|---|
| Bronze | 1 room's worth | 60 × level | 5 | | |
| Silver | 2× | 120 × level | 10 | A Fine | |
| Gold | 3× | 200 × level | 20 | A Fine, 30 % Rare | 4 % the Kingstone's heirloom, *the Kingstone's Ember*, once a hero |

Once per window per hero. Three windows a day means at most three paydays.

## 5. Rules (the shared-play row: `modes.js` gains `event`)

| Rule | Value |
|---|---|
| Story, board, the count | Off (decisions 3 and 4): no quest counts, no lanterns or souls |
| Death | Respawn at the ring's edge after 8 s, full HP, no cost. Nobody is Fallen |
| Wipe | None. The window ending unbeaten is a loss: Bronze pay for those who were there a minute, no more |
| Level sync | Every hero fights **at the region's top (18)**. Below it, raised to it; above it, lowered to it. Their kit's numbers scale with them. Below the region's band (under 10 for the Fens), they can't enter. This one rule keeps the fight's numbers fixed whoever comes, and lets a level-12 player stand beside a level-30 one without being carried or trivialising it |
| XP and gold during it | None from the plain hits: the pay is the tier's (§4) |
| Loot during it | None: the tier's pay at the end |
| Boons and shrines | Off, as the Bowl's |

## 6. The schedule

**The windows.** Three fixed times in the day, the server's (UTC) when there is one, shown in the player's own time.
Proposed: **12:00, 18:00 and 21:00 local**. Each is 15 minutes, announced 10 minutes before. The times live in content
(`content/events.json`), so they can move without a build.

**Offline (stages 1–2).** The sim keeps no clock (golden rule 1), so the window is opened outside it:
- The device's clock, in the UI, says a window is on. It pushes a command, `eventOpen { window: '2026-11-15#2' }`.
- The sim records the window's id and pays once per id per hero.
- Offline play is unverified anyway (as the raid's three a day is). The id is what carries over to the server, where the
  server opens the window and the client's clock means nothing.

## 7. Thinking ahead: what multiplayer needs

What the offline stages have to get right now, so the server stage is a room and not a rewrite:

1. **The sim has to hold more than one party.** Today a world has one `state.player` and one `state.party`. An event (and a
   live raid) needs `parties[]`, each with its leader, seats and follow state, and every command carrying its party and
   seat. This is the largest piece of work. Do it once, behind the `event` mode row, offline first (stage 2), with the
   AI companies as the other parties. Then the server stage only swaps an AI party for a person's.
2. **One seed per Ring.** The window's id and the Ring's number make its seed (shared-play §3.8). Every client and the
   server build the same Ring, and the boss's choices (whom to stamp, where stones fall) are drawn from the Ring's own
   streams. A client never decides them.
3. **The tells are sim events with a start tick and a duration.** The boss's attacks are sim rules (`battle.js`), and the
   tell is the event the sim emits when the wind-up starts: `{ kind, x, y, r, until }`. A client draws the fill from that
   alone, so every player sees the same tell at the same moment, whatever their frame rate. Who is hit is decided by the
   sim when it lands.
4. **The server owns the fight and the pay** (golden rule 3).
   - A Colyseus room `ring:<region>:<window>:<n>` ticks `/sim` at 20 Hz.
   - Clients send commands only: a move, a skill, Leave.
   - The tier and the pay are worked out from the room's own record and written by the server. A client claims nothing.
5. **Bandwidth.** Fifteen heroes, one boss and the tells, at 20 Hz deltas of position, HP and action, is about 16 × 16
   bytes × 20, roughly 5 KB/s each way. That's fine on mobile data. There's no need for interest management at fifteen;
   the shared-play doc's twenty-plus world events would need it.
6. **Joining, leaving, dropping** (the raid decisions, carried over):
   - **Walk out:** you lose the window's pay, and your party leaves the Ring.
   - **Drop:** your hero goes to AI follow for 60 s, and back is back. Never back: no pay.
   - **Late join:** allowed until the boss is under 25 %. HP steps up and never down (§3).
7. **Matchmaking is simple.** Parties walk into the stones. The server puts each in the fullest open Ring of that window
   with room for it (five parties a Ring), or opens a new one. A party of friends goes in as one.
8. **Fair across levels.** The level sync (§5) is a sim rule, so the server and every client agree on it.
9. **Phones.** Fifteen figures as models and a 4× boss:
   - Measure with `figperf.mjs` (the town square already draws 17 models).
   - The Ring's set has no buildings, so the frame has room.
   - If it's over budget, the AI companies' far members can drop to the sprite figures (`?figures=sprites` exists).
10. **Talk.** Only *Say…* presets (the raid's plan, stage 4), no free chat, and a block button.
11. **The day is the server's.** The three windows and the once-a-window pay run on the server's day (shared-play §3.7),
    not the device's, when online.

## 8. In stages

1. **The Ring and the Kingstone, offline, one party.**
   - The arena (a set piece, as the Sand).
   - The boss at 4×, its three attacks and tells, the AI stepping out of tells.
   - The schedule on the device's clock, the tiers and pay, save (the windows paid).
   - The harness `regionboss.mjs` holding §4's targets.
   - Playable on its own. A level-18 party alone has a 6-minute fight.
2. **Five parties, offline.**
   - The sim's `parties[]` (§7.1).
   - The AI companies (the Bowl's `rivals.js`) as the other four.
   - The HP steps, contribution and the ranked end card.
   - The harness at 1–5 parties.
3. **Live** (the stage 3 server, with live raids):
   - the Colyseus Ring room;
   - matchmaking per window;
   - the server's clock and pay;
   - reconnection.
4. **More regions:** one boss each, once the first is right.
   - The Vale's would be at level 9.
   - Candidates are for the world doc, but none is named here, because canon goes there first.

## 9. For the owner to decide

1. **Where and who:** the Kingstone at the Fens' old stones, as proposed, or the Vale first (level 9, for the most
   players).
2. **The windows:** 12:00, 18:00, 21:00 local, 15 minutes each? Or other times?
3. **Level sync** to the region's top (proposed), or no sync, with a minimum level only.
4. **The pay and the tiers** as in §4, or more (or less) generous. Is the heirloom chance right?
5. **Offline AI companies** filling the other four places until the server (proposed), or your party alone until then.
6. **Death:** get up at the edge after 8 s at no cost (proposed), or out for the rest of the fight once downed twice.

## 10. As built (GDD §19 v1.105)

Every decision of §9 as proposed, except the windows: **the top of every hour**, 24 a day (15 minutes each, announced
from ten to), not three. What else came out differently, and why:

- **The windows are hours** (§6): no `content/events.json`; the id is the hour, `2026-11-15T14`, and the command is
  `ringEnter { window, left }` (`src/ui/ring.js` reads the device's clock; `?dev&ring=on` holds one open on localhost).
- **The other companies are fighters in the fight, not parties of the sim** (§7.1): offline an AI company is a list of
  members in `battle.ring` (each following its own first, on the member AI), so `parties[]` is still the server stage's
  work. There's always at least one: the window's draw brings 1–4, so offline a Ring has 2–5 companies.
- **HP steps** (§4): 1.0, 1.85, **4.0, 5.0, 6.5** (2.6, 3.3, 4.0 proposed), on a base of 115 × the room's HP at 18: with
  the steps as proposed five companies were done in 3½ minutes. Measured, 5.7–6.1 minutes at every head count from 2 to 5,
  piloted or on autobattle (GDD §19.9).
- **The stamp** (§2): **2.0 s and radius 3.5** (1.6 and 4 proposed): from its middle, after its look, a member couldn't
  clear it, and most were caught. No knockdown.
- **The tiers** (§4) are the **company's** part against the average company's (Gold 1.15×, Silver 0.8×): by each hero's
  own, the fighter who holds it and the cleric who heals were always Bronze beside a mage.
- **The way out is shut while it stands**: on autobattle the hero stepped back through the gate mid-fight and lost the
  window (the harness found it). *Leave* on the end card, or the gate after.
- **The marker** (§1.1): the old stones on the minimap and both World map tabs, lit by the hour (GDD §19.8), with a
  Walk there to the ring's edge.
- **Not yet:** the AI's reaction by grade (one range for all). The Guild's coach already goes to Saltmere.

