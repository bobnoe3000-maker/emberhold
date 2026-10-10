// ned.ink — Ned Fallow, the Tithe Mill's miller (world doc §3.1, v1.32): the Redhand hold him in Wickham Keep's bailey
// for Lord Pellam's ransom, which Lord Pellam hasn't paid. Stands by the way in on the Keep's first floor (npcs.js
// `found`, `entrance`), tied to nothing in particular: they took his boots. He names the floors. Entry: ned_hub.
// Bound in by src/story/adapter.js from the sim.

VAR hero_name = ""
VAR hero_level = 1
VAR party_size = 1
VAR flag_met_ned = 0
VAR boss_goblin_chief = 0
VAR boss_redhand_captain = 0

== ned_hub ==
{ flag_met_ned == 0: -> ned_first }
Ned Fallow is sitting on a sack of what used to be his own flour, in his stockings.
{ boss_redhand_captain == 1: "They're saying the captain's dead. I'll go when the bailey's quiet. They've still got my boots, and it's a long walk to the mill in these." }
-> ned_talk

== ned_first ==
A big, flour-pale man in his stockings is sitting by the gate on a sack, eating an apple he plainly wasn't given.
"Ned Fallow. The Tithe Mill, by the river. You'll know it: the wheel that squeaks. I'm being held for ransom." He thinks about it. "By the Redhand. From Lord Pellam. Who hasn't paid. It's been nine weeks." # flag: set met_ned
-> ned_talk

== ned_talk ==
+ [Why don't you just walk out?] -> ned_walk
+ [What's in the Keep?] -> ned_floors
+ [Who's the goblin with the drum?] -> ned_skarn
+ [I'll be going.] -> ned_bye

== ned_walk ==
"They took my boots. And they've got my mill, or their friends have, and if I go home there'll be six of them sleeping in my hopper." He bites the apple. "Besides, they feed me. Worse than I feed myself, but more often."
-> ned_talk

== ned_floors ==
"This is the Bailey: the Company's camp, their tents, their fires, their washing, which is worse than their fires. Down the stair is the Barracks, the bunks and the armoury and the paymaster's strongroom, which is locked, and which the paymaster isn't."
"Below that they've broken through the cellars into a cave. The captain has them digging day and night. Garrow. He doesn't say what for. I don't think he knows. I think somebody's paying him not to know."
{ boss_redhand_captain == 0 && hero_level < 6: "I'd want more than you've got before I went down there, if you'll forgive a miller saying so." }
-> ned_talk

== ned_skarn ==
{ boss_goblin_chief == 0: "Old Skarn. Came down out of the hills with a cart of hens, and half of them are Hedda's. He's been haggling with Nan Ruddock, the Company's quartermaster, for three days. The drum's how he haggles. Nobody's bought a hen yet." }
{ boss_goblin_chief == 1: "Was. Old Skarn. The hens are loose all over the bailey now. Nobody's sure whose they are, which is the first fair thing that's happened here." }
-> ned_talk

== ned_bye ==
"If you see Lord Pellam, tell him the price has gone down. I'd come cheaper now. I've lost weight."
-> END
