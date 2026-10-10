// hester.ink — Hester Lowe, who keeps bees in the Sunken Chapel's dry porch (world doc §3.1, v1.32), and watched the
// robed strangers come and go all spring. Stands by the way in on the chapel's first floor (npcs.js `found`,
// `entrance`). She names the floors, and doesn't think much of anyone who isn't a bee. Entry: hester_hub. Bound in by
// src/story/adapter.js from the sim.

VAR hero_name = ""
VAR hero_level = 1
VAR party_size = 1
VAR flag_met_hester = 0
VAR boss_robed_stranger = 0
VAR boss_standard = 0

== hester_hub ==
{ flag_met_hester == 0: -> hester_first }
Hester Lowe is smoking a skep with a twist of rag, and doesn't look round.
{ boss_robed_stranger == 1: "The robed lot have stopped coming. The bees are pleased. So am I, though I'll not tell them so." }
-> hester_talk

== hester_first ==
An old woman with a hood pulled down for a veil is kneeling by a row of straw hives in the only dry corner of the porch. The air hums.
"Don't swat. They don't like it and neither do I. Hester Lowe. The bees were here first, and I came for the bees, and you came for whatever you came for. Mind them." # flag: set met_hester
-> hester_talk

== hester_talk ==
+ [Bees? Here?] -> hester_bees
+ [What's below?] -> hester_floors
+ [You saw the robed strangers?] -> hester_robes
+ [I'll be going.] -> hester_bye

== hester_bees ==
"Warm stone, dry porch, a nave full of flowers nobody planted. The river brings the seed in at the windows." She lifts a comb, dark as tea. "Chapel honey. Tastes of incense and mud. The Sisters buy it and pretend they don't."
-> hester_talk

== hester_floors ==
"The Nave first. The river's half of it now: pews under the water, the saints face down in it where they fell, the altar still dry, more or less. Then the Cult's Cut, where the robed lot dug down through the floor and lit their fires and chained things up."
"Under that, the crypt where they bound the legion. The old standard's still down there, standing over them. I've heard it at night. It sounds like a flag in no wind."
{ boss_standard == 1: "Not lately. Lately it's been quiet." }
-> hester_talk

== hester_robes ==
"All spring. Two or three at a time, never more, never by the road. Polite. Wiped their feet. One of them asked if the honey was for sale and paid twice what I asked, which is how I knew he wasn't from round here."
{ boss_robed_stranger == 0: "The young one with the warm thing in his hand is still down there. He doesn't come up any more. I don't think he can." }
-> hester_talk

== hester_bye ==
"Walk slowly past the hives. They know the difference."
-> END
