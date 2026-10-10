// tobin.ink — Tobin Hask, Thornwick's sexton (world doc §3.1, v1.32): he keeps a lantern at the Old Barrows' mouth
// and the dead's names in a book nobody asked him to keep. Stands by the way in on the first floor (npcs.js `found`,
// `entrance`). He names the floors, and talks about the dead as if they were the parish, because they were. Entry:
// tobin_hub. Bound in by src/story/adapter.js from the sim.

VAR hero_name = ""
VAR hero_level = 1
VAR party_size = 1
VAR fallen_name = ""
VAR flag_met_tobin = 0
VAR boss_quartermaster = 0

== tobin_hub ==
{ flag_met_tobin == 0: -> tobin_first }
Tobin Hask lifts his lantern an inch, which is as far as he lifts it for anyone.
{ boss_quartermaster == 1: "The Muster Hall's gone quiet. Quieter. I wrote it down." }
{ fallen_name != "": "You've lost one. {fallen_name}. Give me the spelling before you go, and I'll put it in with the others." }
-> tobin_talk

== tobin_first ==
An old man in a rusty black coat sits on a coffin-lid laid over two stones, a lantern by his boot and a ledger open on his knee. He doesn't get up.
"Tobin Hask. Sexton, Thornwick. Somebody has to keep the names, and the parish stopped paying me for it in my father's time, so it might as well be me." # flag: set met_tobin
-> tobin_talk

== tobin_talk ==
+ [What is this place?] -> tobin_floors
+ [Who's down there?] -> tobin_dead
+ [What's in the book?] -> tobin_book
+ [I'll be going.] -> tobin_bye

== tobin_floors ==
"Three floors, and they're older than the road. This is the Barrow Mouth, where the Redhand have been digging at the door for whatever they think the legion buried with its dead. Mostly they've found the dead."
"Below is the Long Gallery: niches in the walls, a skull in every one, and the candles the families left still burning, which they shouldn't be. Below that, the Muster Hall."
-> tobin_muster

== tobin_muster ==
"The Third Legion's quartermaster keeps the stores down there. Kept, I should say. Keeps. He still issues. Knock one of his lads down and the old man has him back on his feet with a fresh shield before you've wiped your blade."
{ boss_quartermaster == 1: "Or he did. I hear he's handed in his last chit." }
{ boss_quartermaster == 0 && hero_level < 3: "I'd not go looking for him alone, if I were you. I'd not go looking for him at all, but I'm a sexton." }
-> tobin_talk

== tobin_dead ==
"Legion men, mostly. Three hundred years of them, laid in rows, every one with his name cut over his niche, and every one of them walking about since spring as if somebody called a muster."
"Nobody did. Nobody I know. But something did, and they answered, the way soldiers do."
-> tobin_talk

== tobin_book ==
He turns it so you can see: columns of names in a careful hand, and beside some of them a date, and beside a few of them a second date, much more recent.
"Those are the ones that came up the steps. Those are the ones that went back down, after. You'd be surprised how many I've had to cross out twice."
-> tobin_talk

== tobin_bye ==
"Mind the third step down. It's not a step any more."
-> END
