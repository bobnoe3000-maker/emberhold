// osric.ink — Warden-Captain Osric Hale, Greyholt's watch, at his Watch post by Thornwick's well
// (world doc §5, v1.6): honest, tired, pays the bright-eyed bounty from his own purse and writes it
// down. Entry: osric_hub. Bound in by src/story/adapter.js from the sim (sim/npcs.js varsFor); Ink
// only reads them. Effects go out as tags and the sim checks each one (flags: met_osric; his
// bounty, vale_captains_ledger: q_ = −1 locked · 0 available · 1 active · 2 ready · 3 done).
// A choice tagged `#mark: quest` (inside its brackets) shows as a quest one.

VAR hero_name = ""
VAR hero_class = ""
VAR hero_origin = ""
VAR hero_level = 1
VAR party_size = 1
VAR fallen_name = ""
VAR day_part = 0
VAR flag_met_osric = 0
VAR q_vale_captains_ledger = -1
VAR q_ch1_smoke_over_the_vale = -1
VAR q_ch1_the_diggers = -1
VAR q_ch1_ember_in_the_fist = -1
VAR frag_vale_count = 0

== osric_hub ==
{ flag_met_osric == 0: -> osric_first_meet }
{ fallen_name != "": -> osric_greet_fallen }
-> osric_greet_back

== osric_first_meet ==
A grey man at a folding table by the well turns a page in a ledger and doesn't look up until he's finished the line.
"Osric Hale. Warden-Captain, Greyholt's watch, which is to say Lord Pellam's, which is to say mostly mine." # flag: set met_osric
{
- hero_origin == "redhand_deserter":
    "You stand like the Company. I'll not ask. The Watch has taken worse than deserters, and I've signed for most of them."
- hero_origin == "thornwick_born":
    "{hero_name}. Maudry said you'd be back. She says a lot. This time she was right."
- hero_origin == "grey_sisters_ward":
    "Reedholm. Sister Ilse will want you. She wants everyone who can read, and gets about one a year."
- hero_origin == "deepdelver_fostered":
    "Deepdelver boots. Good. The last pair I saw walked into the barrows and walked out again, which is more than the Watch manages."
- else:
    "Write your name in the book if you mean to stay. I like to know who to send the bill to."
}
-> osric_topics

== osric_greet_back ==
{&Osric marks something in the ledger and nods at the stool. "Sit if you like. It's the Watch's stool. Nobody else wants it."|"{hero_name}. Still standing. Good."|"The well's been quiet today. The well's always quiet. It's the barrows that aren't."}
{ q_vale_captains_ledger == 2: "You've the look of three lines in my book. Let's have them." }
{ q_vale_captains_ledger == 3: "Three paid, three written. The Watch doesn't forget a debt, even when Greyholt does." }
{ q_ch1_ember_in_the_fist == 3: "Sister Ilse sent me a note. It says 'the fens.' Two words. She's never used two words for anything." }
{ frag_vale_count == 3: "Sister Ilse read me your tablets. A legion holding a road until relieved." He looks at the ledger for a long moment. "I know how that goes." }
-> osric_topics

== osric_greet_fallen ==
Osric looks at the space beside you where {fallen_name} should be, and writes something down.
"I keep a page for the ones who don't come back up. Take {fallen_name} to the Shrine before I need it."
-> osric_topics

== osric_topics ==
+ { q_ch1_smoke_over_the_vale == 2 } [The Redhand are out of the mill. #mark: quest ready] -> osric_ch1_report
+ { q_ch1_the_diggers == 0 } [Where did the Redhand go? #mark: quest] -> osric_ch2_offer
+ { q_ch1_the_diggers == 1 } [About Wickham Keep… #mark: quest] -> osric_ch2_active
+ { q_ch1_the_diggers == 2 } [Garrow's done collecting. #mark: quest ready] -> osric_ch2_turnin
+ { q_ch1_ember_in_the_fist == 0 } [Who paid for the digging? #mark: quest] -> osric_ch3_offer
+ { q_ch1_ember_in_the_fist == 1 } [About the chapel… #mark: quest] -> osric_ch3_active
+ { q_vale_captains_ledger == 2 } [Three of the bright-eyed ones. #mark: quest ready] -> osric_ledger_turnin
+ { q_vale_captains_ledger == 0 } [Any bounties posted? #mark: quest] -> osric_ledger_offer
+ { q_vale_captains_ledger == 1 } [About the bounty… #mark: quest] -> osric_ledger_active
+ { q_vale_captains_ledger == -1 } [Any bounties posted?] -> osric_ledger_early
+ [What does the Watch do here?] -> osric_watch
+ [Tell me about Lord Pellam.] -> osric_pellam
+ [I'll be going.] -> osric_bye

== osric_ledger_early ==
"For you? Not yet. The ones worth a bounty lead the walking kind, and they'd have you for breakfast."
"Win a few rooms in the barrows first. Come back when your boots have seen the second floor."
-> osric_topics

== osric_ledger_offer ==
"There's one kind worth paying for. Every fifth wave or so, one of them comes up with eyes like forge coals and the rest fall into step behind it."
"Put three of those down in the Old Barrows. Lord Pellam's coin is due any week now, which is what it said last month. Until it comes, I pay, and I write it down."
+ [I'll see to it. #mark: quest]
    "Good. Don't go alone into the deep rooms. I've enough names on that page." # quest: accept vale_captains_ledger
    -> osric_topics
+ [Not yet.]
    "The bright-eyed ones will keep. They've kept three hundred years."
    -> osric_topics

== osric_ledger_active ==
"Three of the bright-eyed ones. They lead every fifth wave. Stay in the room long enough and one will come to you."
"And step out when you're low. A room doesn't care how brave you were."
-> osric_topics

== osric_ledger_turnin ==
Osric counts on his fingers, then writes three short lines in the ledger and blots them.
"Paid in full. Out of my purse, which Lord Pellam will repay, which is a sentence I have written before." # quest: turnin vale_captains_ledger
-> osric_topics

// ── Act I (content/quests/ch1_*.json) ──
== osric_ch1_report ==
Osric opens the ledger to a fresh page, which for him is a ceremony.
"Out of the mill. Good. Where to?" He listens, and writes. "Wickham Keep. Of course. It has walls, and nobody's collected rent on it for three hundred years."
"The Keep's on the Wickham road, north of the crossroads. The gate's been barred since spring. It won't be now, not to you. They'll want to see who knocked." # quest: turnin ch1_smoke_over_the_vale
-> osric_topics

== osric_ch2_offer ==
"The Redhand at Wickham Keep answer to a Captain Garrow. He collects. Tolls, tithes, debts, men who owe him."
"Here's what I don't like. The carters say there's digging in the Keep's cellars. Bandits don't dig. Bandits take what somebody else dug up."
"Somebody's paying them. I'd like to know who, and I'd like Garrow to stop collecting."
+ [I'll go to the Keep. #mark: quest]
    "Down to the second floor. That's where he'll be, counting. Take company, {hero_name}. Garrow doesn't fight alone. He never has." # quest: accept ch1_the_diggers
    -> osric_topics
+ [Not yet.]
    "He's not going anywhere. That's rather the problem."
    -> osric_topics

== osric_ch2_active ==
"Wickham Keep, second floor. Garrow keeps his men close and his coin closer."
"When he's in trouble he shouts, and they come. Put down the ones who come, then him. That's the whole of the tactics. It's usually enough."
-> osric_topics

== osric_ch2_turnin ==
Osric reads the page you give him twice, then a third time, which is once more than he reads anything.
"Garrow's own ledger. He kept books. Of course he did." He taps a line. "'For digging at the chapel, forty crowns. Ask no questions of the robes.' Robes."
"Well. Garrow's done collecting. I'll write that down with some pleasure." # quest: turnin ch1_the_diggers
-> osric_topics

== osric_ch3_offer ==
"The Sunken Chapel. In the marsh south of here, where the river's been eating it for a century."
"Men in robes paid Garrow to dig there, and paid well, and asked for nothing up. Whatever they want is still down there. Or it was."
"Find the one who pays. Ask him what for. If he won't say, stop him paying."
+ [I'll go down into the chapel. #mark: quest]
    "It's older than the Keep and wetter than the barrows. Sister Ilse says it was a place where things were bound. She says it the way other people say 'haunted.'" # quest: accept ch1_ember_in_the_fist
    -> osric_topics
+ [Not yet.]
    "The robes will keep digging. They don't strike me as the kind who stop for weather."
    -> osric_topics

== osric_ch3_active ==
"The Sunken Chapel. Mind your footing. The floor's the river's now."
"Whatever you find on the one in charge, bring it back. Not to me. To Sister Ilse. I only write things down. She reads them."
-> osric_topics

== osric_watch ==
"Greyholt sent a Captain and a man to hold Thornwick against the dead. I'm the Captain. Jory's the man."
"We keep the book, we keep the well, and we keep people out of the barrows who've no business there. You've business there, so I'll not keep you."
-> osric_topics

== osric_pellam ==
"Lord Pellam writes. Three pages to Thornwick last month, on good paper. Maudry read it twice. So did I."
"It says he is aware, that he is concerned, and that help is being considered at the highest level. The highest level is him. He's considering it."
-> osric_topics

== osric_bye ==
{&"Mind the well. People fall in it more than you'd think."|"Come back up. It's all I ask."|Osric has already gone back to the ledger.}
-> END
