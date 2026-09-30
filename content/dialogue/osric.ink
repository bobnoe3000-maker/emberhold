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
-> osric_topics

== osric_greet_fallen ==
Osric looks at the space beside you where {fallen_name} should be, and writes something down.
"I keep a page for the ones who don't come back up. Take {fallen_name} to the Shrine before I need it."
-> osric_topics

== osric_topics ==
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
