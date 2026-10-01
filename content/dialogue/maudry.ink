// maudry.ink — Maudry Fenn, keeper of the Tired Mule, Thornwick (world doc §5). The player's first
// contact: she knows everyone's business and tells you more than she should.
// Entry: maudry_hub (the sim's 'dialogue' event names it). Bound in by src/story/adapter.js from
// the sim (sim/npcs.js varsFor); Ink only reads them. Effects go out as tags and the sim checks
// each one (flags: met_maudry; her errand, vale_long_way_round: q_ = −1 locked · 0 available ·
// 1 active · 2 ready · 3 done). `# service: tavern` opens the hiring board. A choice tagged
// `#mark: quest` (inside its brackets) shows as a quest one; `#mark: quest ready` hands one in.

VAR hero_name = ""
VAR hero_class = ""
VAR hero_origin = ""
VAR hero_level = 1
VAR party_size = 1
VAR fallen_name = ""
VAR flag_met_maudry = 0
VAR q_vale_long_way_round = -1
VAR q_ch1_smoke_over_the_vale = -1
VAR frag_vale_count = 0
VAR road_ranks = 3

== maudry_hub ==
{ flag_met_maudry == 0: -> maudry_first_meet }
{ fallen_name != "": -> maudry_greet_fallen }
-> maudry_greet_back

== maudry_first_meet ==
The woman at the Mule's door looks you over and goes on wiping a mug that was already clean.
"Maudry Fenn. The Mule's mine. You'll be the one who came in off the road looking like the road came with you." # flag: set met_maudry
{
- hero_origin == "thornwick_born":
    "Hold on. I know that frown. I knew your mother, {hero_name}. She'd have had words about those boots."
- hero_origin == "redhand_deserter":
    "That's a Redhand way of standing. Don't look at me like that, I've poured for enough of them. Walked out, did you? Good. Keep walking in here and we'll get on."
- hero_origin == "grey_sisters_ward":
    "Reedholm manners. The Sisters raised you, then. You'll be able to read, which puts you ahead of the Watch."
- hero_origin == "deepdelver_fostered":
    "You shake hands like a Deepdelver. That's not a complaint. The last one who did that paid in advance."
- else:
    "{hero_name}, is it. I'll remember. I remember everyone. It's the job."
}
{ road_ranks > 0:
    "If you came by the crossroads you'll have seen them. The dead, standing across the barrows road in rows, facing north like they're waiting for somebody."
    "They don't come here. They don't need to. Nothing gets down that road, and everything I pour comes up it."
}
-> maudry_topics

== maudry_greet_back ==
{&Maudry looks up from the tap. "Back again, {hero_name}."|"Still in one piece, I see. The Vale's getting careless."|Maudry slides a mug your way without asking. "On the house. Don't tell anyone."}
{ q_vale_long_way_round == 2: "You've the look of someone with news. Go on, then." }
{ q_vale_long_way_round == 3 && road_ranks > 0: "The front rank's gone off the barrows road since you started going down. A carter tried it yesterday and got as far as the next. That's progress, and it's worth a mug." }
{ road_ranks == 3 && q_vale_long_way_round != 3: "Still standing out there on the barrows road, the dead. Facing north. Nobody's told them nobody's coming." }
{ road_ranks == 0: "Col took the barrows road this morning and came back with all four wheels. First time since spring. I've dropped the price of ale. Don't tell anyone." }
{ q_ch1_smoke_over_the_vale == 0: "There's smoke up the river again. You'll have seen it. Everyone's seen it and nobody's doing anything about it." }
{ q_ch1_smoke_over_the_vale == 3: "Osric's been writing in that ledger of his like it owes him money. Whatever you told him, he took it serious." }
{ frag_vale_count >= 3 && frag_vale_count < 10: "Sister Ilse was in here last night. Didn't drink. Just sat. Said the dead in the barrows are still following orders. I said so are half my customers. She didn't laugh." }
{ frag_vale_count == 10: "Sister Ilse bought a round last night. Sister Ilse. She said it was for a legion. I didn't ask which. I poured." }
-> maudry_topics

== maudry_greet_fallen ==
Maudry looks past you at the door, then back. "No {fallen_name} today?"
"Take them to the Shrine of the Ember. They raise the ones who fell down there. Cheaper than a funeral, and they complain less after."
-> maudry_topics

== maudry_topics ==
+ { q_ch1_smoke_over_the_vale == 0 } [You said something about smoke? #mark: quest] -> maudry_ch1_offer
+ { q_ch1_smoke_over_the_vale == 1 } [About the Tithe Mill… #mark: quest] -> maudry_ch1_active
+ { q_ch1_smoke_over_the_vale == 2 } [The mill's clear. #mark: quest] -> maudry_ch1_ready
+ { q_vale_long_way_round == 2 } [The barrows road is clearer. #mark: quest ready] -> maudry_longway_turnin
+ { q_vale_long_way_round == 0 } [Anything I can do? #mark: quest] -> maudry_longway_offer
+ { q_vale_long_way_round == 1 } [About the barrows road… #mark: quest] -> maudry_longway_active
+ [What's the news?] -> maudry_news
+ [Anyone for hire?] -> maudry_hire
+ [Tell me about the barrows.] -> maudry_barrows
+ [What's in Thornwick?] -> maudry_town
+ [I'll be going.] -> maudry_bye

== maudry_news ==
"The barrows are open again. Not dug open. Open. And the ones inside are the walking kind now."
"Somebody sent to Greyholt for help. Lord Pellam sent back a letter. Three pages. I read it twice and I still couldn't tell you if it was a yes."
"Osric Hale posts a bounty when the Watch has the coin, which is about never. So it's you, I suppose. Nobody else is coming."
-> maudry_topics

== maudry_hire ==
"Sellswords drink here. Some of them even pay. The board by the door says who's looking for work and what they cost."
{ party_size >= 3: "You've company enough already, mind. I'll not have a crowd blocking my door." }
"There's usually a Grey Sister in the corner, too. Takes coin for the road like anyone else. Don't let the vestments fool you. She swings that mace like she means it."
+ [Show me the board.]
    "Go on, then." # service: tavern
    -> END
+ [Later.] -> maudry_topics

== maudry_barrows ==
"Old mounds, out past the fields. From when there was an empire to bury people in."
"They march down there, you know. In step. Like somebody's still calling it."
"You find anything with writing on it, bring it up. Somebody ought to be reading it."
-> maudry_topics

== maudry_town ==
"The Crossed Keys, if you want a bed and don't mind the stairs. Hale & Daughter for anything that needs mending. It's the daughter you want."
"Wendel's for rope and bread. His lamp oil's gone up a copper again. He blames the roads. I blame Wendel."
"And the Shrine of the Ember. They raise the ones who fell. You'll get to know them, I expect. Everyone does."
-> maudry_topics

// ── her errand: The Long Way Round (content/quests/vale_long_way_round.json) ──
== maudry_longway_offer ==
"Since you ask. The carters won't take the barrows road any more. They go the long way round, a day out of their way, and they put it on the price of everything I pour."
"Go down into the Old Barrows. Knock the walking kind back. Four good fights, and open one of their chests, so I know you went further than the door."
"Come back and tell me. I'll make it worth the boots."
+ [I'll see to it. #mark: quest]
    "Good. Mind the ones with crossbows." # quest: accept vale_long_way_round
    -> maudry_topics
+ [Not today.]
    "Suit yourself. The long way round's still there. So are the prices."
    -> maudry_topics

== maudry_longway_active ==
"The walking kind still walking, are they? Four fights, and a chest opened. I'm not asking you to empty the place. Just to make the road less interesting."
-> maudry_topics

== maudry_longway_turnin ==
"Well. The carters came in this morning complaining about something else entirely. That's how I know it worked."
"Anything with writing on it in that chest? No? Pity. Here. It's not much, but it's more than Lord Pellam would have sent." # quest: turnin vale_long_way_round
-> maudry_topics

// ── Act I, chapter 1: Smoke over the Vale (content/quests/ch1_smoke_over_the_vale.json) ──
== maudry_ch1_offer ==
"The Redhand Company. Deserters, when they're being polite about it. They're squatting in the Tithe Mill again, up the river."
"Burned the miller's cart for warmth. It's summer. That's not warmth, that's spite."
"The tithe grain goes through that mill. Lord Pellam's grain, strictly, but it's our bread before it's his. Somebody has to shift them, and it's never going to be the Watch."
+ [I'll shift them. #mark: quest]
    "Good. Four fights ought to make the point. When they've gone, tell Osric Hale at the well. He'll want to write down where they went." # quest: accept ch1_smoke_over_the_vale
    -> maudry_topics
+ [Not yet.]
    "The smoke'll keep. So will the Redhand. Unfortunately."
    -> maudry_topics

== maudry_ch1_active ==
"Up the river, the stone place with the wheel. You'll smell it before you see it."
"Four fights, and they'll get the message. The Redhand are thick, but they can count to four."
-> maudry_topics

== maudry_ch1_ready ==
"Don't tell me, tell Osric. He keeps the book. I only keep the mugs."
-> maudry_topics

== maudry_bye ==
{&"Mind the step."|"Wipe your boots on the way out, not the way in."|"Come back in one piece. The pieces are harder to serve."}
-> END
