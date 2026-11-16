// dagny.ink — Charter-Reeve Dagny Coalbrook (world doc §3.3, v1.53): a Deepdelver, short and broad and grey in the braid,
// who holds the charter-moot in the Slag & Bellows' back room because the moot-hall roof came in. Her miners don't come
// home off the night shift, and the Assay says they quit. Act III's main giver. Entry: dagny_hub. Bound in by
// src/story/adapter.js from the sim (sim/npcs.js varsFor: with_tamsin 0 / 1, her niece with you, party or bench;
// core.js boss_<id>; quests.js: q_ = −1 locked · 0 available · 1 active · 2 ready · 3 done, and s_ = the step, read
// before this conversation counts: The Wickham Road is a word with her, so it's ready by the time she reads the letter).
// Flags: met_dagny. Act III, chapters 1–2.

VAR hero_name = ""
VAR hero_class = ""
VAR hero_origin = ""
VAR hero_level = 1
VAR party_size = 1
VAR fallen_name = ""
VAR day_part = 0
VAR flag_met_dagny = 0
VAR with_tamsin = 0
VAR boss_foreman = 0
VAR q_ch3_the_wickham_road = -1
VAR s_ch3_the_wickham_road = 0
VAR q_ch3_short_shift = -1

== dagny_hub ==
{ q_ch3_the_wickham_road == 1 || q_ch3_the_wickham_road == 2: -> dagny_road_meet }
{ flag_met_dagny == 0: -> dagny_first_meet }
{ fallen_name != "": -> dagny_greet_fallen }
-> dagny_greet_back

== dagny_first_meet ==
A short, broad woman with a grey braid down her back stands in the Slag & Bellows' doorway, doing sums on her fingers and not liking them.
"Dagny Coalbrook. Charter-Reeve, which means when the roof falls in, it's me they shout at. The moot's in the back. The moot-hall roof fell in." # flag: set met_dagny
-> dagny_origin

== dagny_origin ==
{
- hero_origin == "deepdelver_fostered":
    "Clan-fostered. I can tell by the way you looked at the ceiling when you came in. Good. Keep doing that."
- hero_origin == "redhand_deserter":
    "Redhand. Your Company sold us lamp oil once, at three times the price, and called the difference a toll. I don't hold it against you. I hold it against the oil."
- hero_origin == "grey_sisters_ward":
    "A Sisters' ward. Then you can read. Good. Half the moot can't, and the other half reads the Assay's papers, which is worse."
- hero_origin == "thornwick_born":
    "Thornwick. Your carters bring us bread and take our iron, and complain about both all the way home."
- else:
    "You'll want work. Everyone who comes up that road wants work, or wants to sell us something. You don't look like you're selling."
}
-> dagny_topics

// ── The Wickham Road (content/quests/ch3_the_wickham_road.json): Ilse sent you; a word with her, and she takes it in ──
== dagny_road_meet ==
// (the first line says nothing to the sim: a line with effects is where the story waits and comes back with the sim's
// variables, and coming back to this knot's first line would start the talk over from the hub, read-in and all)
{ flag_met_dagny == 0: A short, broad woman with a grey braid down her back stands in the Slag & Bellows' doorway, doing sums on her fingers. | Dagny is in the Slag & Bellows' doorway, doing sums on her fingers. }
You give her Sister Ilse's letter. She reads it standing up, fast, and then the tracing folded inside it, slowly. # flag: set met_dagny
"Dagny Coalbrook. Charter-Reeve. I asked her for someone who fights. She sent you, and three pages." She holds up the tracing. "Scales over a pick. That's the Kell Assay. It's painted on their gate at Kell's Rest, over the Slagborn's mark, as of this spring."
"The Assay bought the Slagborn's lease off Gunnar Slagg. They've lit the Cinderworks again, and they hire for a night shift. Good pay. My miners take it." She folds the letter very small. "They don't come home off it. The Assay says they quit." # quest: turnin ch3_the_wickham_road
"Nobody quits the Assay at that pay. Sit down. The moot's arguing. It'll be arguing when we get there."
-> dagny_topics

== dagny_greet_back ==
{&Dagny looks up from a column of figures and puts a thumb on her place.|"{hero_name}. The moot sends its regards. The moot sends its regards to everyone. It's cheaper than help."|Dagny is listening to the back room through the door. Somebody in there is shouting about roofs.}
{ q_ch3_the_wickham_road == 0: "There's a Grey Sister in Thornwick writing to half the Provinces about a pair of scales. If she's written to you, she'll have a letter for me." }
{ q_ch3_short_shift == 1 && with_tamsin == 0: "The Cold Seam. South, off the Wickham road, the old pithead. Bring her up. Tell her I said. She won't come if you say it was your idea." }
{ q_ch3_short_shift == 3 && with_tamsin == 1: "Tamsin. Wipe your face. No, the other side. Both sides." }
{ q_ch3_short_shift == 3 && with_tamsin == 0: "Tamsin's still down the Seam? Then she's mending something, and she'll come up when it's mended. Go and fetch her. Tell her it's broken up here." }
-> dagny_topics

== dagny_greet_fallen ==
"You came in short." She doesn't ask who. "{fallen_name}. Old Brannagh's shrine, by the square. She'll light a candle off the Flame for them and charge you for the candle."
-> dagny_topics

== dagny_topics ==
+ { q_ch3_short_shift == 2 } [The Foreman's down. #mark: quest ready] -> dagny_shift_turnin
+ { q_ch3_short_shift == 0 } [What's wrong at the Cold Seam? #mark: quest] -> dagny_shift_offer
+ { q_ch3_short_shift == 1 } [About the Cold Seam… #mark: quest active] -> dagny_shift_active
+ [The night shift?] -> dagny_night_shift
+ [What's the charter-moot?] -> dagny_moot
+ [Tell me about Ashgate.] -> dagny_ashgate
+ [I'll be going.] -> dagny_bye

// ── Short Shift (content/quests/ch3_short_shift.json): her niece in the Cold Seam, and the Foreman who keeps her ──
== dagny_shift_offer ==
"The Cold Seam. South, off the Wickham road: you came past it. Our last pithead. Played out forty years. We left the timbers in and the lamps on their hooks, and nobody went down."
"This spring the goblins came through it. Out of the range, from your side: the Scrag Warren's lot, digging on as if somebody'd paid them to. They've the warren under it now, and a foreman of their own."
"My niece Tamsin went down after the Seam's books. Four days ago." She does a sum on her fingers that doesn't need doing. "Tamsin's never been anywhere four days. She gets bored on the second."
+ [We'll bring her up. #mark: quest]
    "Down past the winding room, into what the goblins dug. Whoever they call the foreman, that's who'll have her. She can mend anything with an edge. They'll have found that out." # quest: accept ch3_short_shift
    { boss_foreman == 1: "You've been down already? Then he's done, and she's sitting in the dark being pleased with herself. Go and get her." }
    -> dagny_topics
+ [Not yet.]
    "No. No, she'll keep." She doesn't sound sure. "She's kept worse. She's kept me."
    -> dagny_topics

== dagny_shift_active ==
"The Cold Seam, off the Wickham road south of here. Through the old pithead, down the shaft by the winding room, into the warren. Their foreman. Tamsin."
-> dagny_topics

== dagny_shift_turnin ==
{ with_tamsin == 1: Dagny looks at Tamsin for a long moment. Tamsin looks at the ceiling, the way clan children do when they've been somewhere they shouldn't. }
{ with_tamsin == 1: "You're black to the elbow." "It's soot, Aunt Dagny." "I know what it is. I've been black to the elbow. I was never black to the elbow for four days." }
{ with_tamsin == 0: "And Tamsin?" You tell her where Tamsin is. Dagny closes her eyes for a count of three. "Still down there. Mending something. Of course she is." }
You tell her about the tally cave: the chutes, the whistle, the chalk crosses, and the wall the Foreman kept his tally on, top to bottom, none of it adding up. # quest: turnin ch3_short_shift
"A goblin with a foreman's hat and a whistle, and a wall of sums." She nearly smiles. "That's every foreman I ever worked under."
"I'll buy the moot a round. It'll think the roof's coming in again." She stands. "And then the moot can talk about the night shift, because the Seam's done and they've nothing else left to talk about."
-> dagny_topics

== dagny_night_shift ==
"The Assay hires at Kell's Rest, under the dead mountain. Night work at the Cinderworks: the furnaces again, after three hundred years. Pay's twice ours."
"The ones who take it go out on the night cart. The cart comes back. It comes back empty, and the Assay says they quit, and it says so in writing, with a seal. You can always tell a lie by the seal."
-> dagny_topics

== dagny_moot ==
"The charter-moot. Every clan in Ashgate sends somebody to sit in a room and say no to every other clan. It's how the Deepdelvers have kept the charter since the empire wrote it. It works better than you'd think. It works slower than you'd believe."
"The Slagborn don't come any more. Gunnar sold their lease, and his row won't sit at a table he's sat at. So there's an empty chair at the moot, and everybody looks at it when the Assay comes up."
-> dagny_topics

== dagny_ashgate ==
"Slag-brick, all of it. We burn the ore and build the town out of what's left. The wheel over the gate's off the first pithead. It doesn't turn. We like to look at it."
"Bel at the Bellows, Widow Pellam at the Rest, Haldor at the Forge, who'll tell you he's the best in the Provinces. He is. Don't tell him I said. Hob by the well, if you need a door opened. Don't ask Hob how."
-> dagny_topics

== dagny_bye ==
{&"Mind the step. Everything in Ashgate's a step."|Dagny has gone back to her sums.|"If the moot asks, you were never here. If the Assay asks, the same."}
-> END
