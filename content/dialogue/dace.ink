// dace.ink — Dace Pike, who keeps the Drowned Eel in Saltmere (world doc §3.2, v1.29): Wenna's older brother, broad,
// slow, and the only man in Saltmere who writes things down. He lends nobody money, which is why everyone tells him
// what they owe. Entry: dace_hub. Bound in by src/story/adapter.js from the sim (sim/npcs.js varsFor; quests.js:
// q_ = −1 locked · 0 available · 1 active · 2 ready · 3 done, and s_ = the step a quest is on, read before this
// conversation counts: Fog on the Canal's first step is a word with him). Flags: met_dace. Act II, chapters 1–2.

VAR hero_name = ""
VAR hero_class = ""
VAR hero_origin = ""
VAR hero_level = 1
VAR party_size = 1
VAR fallen_name = ""
VAR day_part = 0
VAR flag_met_dace = 0
VAR q_ch2_fog_on_the_canal = -1
VAR s_ch2_fog_on_the_canal = 0
VAR q_ch2_the_locks = -1
VAR boss_toadking = 0

== dace_hub ==
{ q_ch2_fog_on_the_canal == 1 && s_ch2_fog_on_the_canal == 0: -> dace_fog_meet }
{ flag_met_dace == 0: -> dace_first_meet }
{ fallen_name != "": -> dace_greet_fallen }
-> dace_greet_back

== dace_first_meet ==
A broad man behind the Eel's counter is writing in a book with a pencil he has to lick every third word. He finishes the word.
"Dace Pike. The Eel's mine, and the book's mine. If you owe somebody in Saltmere, it's in here. If you don't, you will." # flag: set met_dace
-> dace_topics

// ── Fog on the Canal (content/quests/ch2_fog_on_the_canal.json): Ilse sent you; he knows who to ask ──
== dace_fog_meet ==
{ flag_met_dace == 0: A broad man behind the Eel's counter is writing in a book with a pencil he has to lick every third word. # flag: set met_dace }
You give him Sister Ilse's letter. He reads it twice, slowly, with his finger, and puts it in the book.
"Dace Pike. Ilse writes a good letter. Too many words, but all the right ones."
"Robed men, boats at night, up the canal toward your Vale. Aye. Nobody in Saltmere's seen where they tie up. Nobody but Wren, and Wren owes everybody."
"She owed the Toadking last. He's a bandit out in the reeds with a mound of stolen boats, and when you can't pay him he keeps you. He's kept her a month." He turns the book round so you can see her line. It's long.
{ boss_toadking == 1: "You've been out there already, have you. Then go back down and talk to her. She'll be in his Boat Hall, if she's anywhere." }
{ boss_toadking == 0: "Toadking's Mound. The Boat Hall's the third floor down. Put him down and Wren'll talk. She'll talk anyway. Put him down first." }
-> dace_topics

== dace_greet_back ==
{&Dace looks up from the book and nods at the bench by the stove.|"{hero_name}. You're in here." He taps the book. "Nothing against you yet."|Dace is adding up a column. He holds up a hand until it comes out the same twice.}
{ q_ch2_fog_on_the_canal == 1 && s_ch2_fog_on_the_canal == 1: "Toadking's Mound. The Boat Hall's the third floor. He's fat and cheerful and he'll hit you with a boat-hook. Don't let the cheerful fool you." }
{ q_ch2_fog_on_the_canal == 1 && s_ch2_fog_on_the_canal == 2: "He's down? Then go and get Wren before somebody else she owes gets there first." }
{ q_ch2_the_locks == 1: "The Canal Locks. Up the cut, past the eel-traps. Mind the man doing the talking. Folk who talk that well usually want something." }
{ q_ch2_the_locks == 3: "No name. I've had men in here owe me with no name. Never one I didn't want to find." }
-> dace_topics

== dace_greet_fallen ==
"You came in short." He writes something down. "{fallen_name}. The chapel'll see to them. Sister Orla's sharp, but she's quick."
-> dace_topics

== dace_topics ==
+ { q_ch2_fog_on_the_canal == 2 } [Wren read the Toadking's berth-book. #mark: quest ready] -> dace_fog_turnin
+ { q_ch2_the_locks == 2 } [The Sluice is quiet. #mark: quest ready] -> dace_locks_turnin
+ { q_ch2_the_locks == 0 } [What now? #mark: quest] -> dace_locks_offer
+ { q_ch2_the_locks == 1 } [About the Locks… #mark: quest active] -> dace_locks_active
+ [What's in the book?] -> dace_book
+ [Tell me about Saltmere.] -> dace_saltmere
+ [I'll be going.] -> dace_bye

== dace_fog_turnin ==
"The Canal Locks." He writes it down under a heading that just says *ROBES*, and draws a line under it, and then another one.
"Every boat that's come past this window in a month, Wren knew where it was going, and the Toadking knew Wren knew, and nobody knew the Toadking knew." He looks pleased. "That's the most anybody's known about anything in this town since my father died." # quest: turnin ch2_fog_on_the_canal
-> dace_topics

// ── The Locks (content/quests/ch2_the_locks.json) ──
== dace_locks_offer ==
"The eel-men say somebody's preaching at the Locks. In the old lock-keepers' hall, on the first floor, to whoever'll sit. They say he's very kind."
"They say the drowned lock-men in the Sluice have stopped lying still since he came. They say that more quietly."
+ [We'll go and listen. #mark: quest]
    "Hear him out. Then go down to the Sluice, the hall at the bottom, and see what he's got listening." He writes your name in the book, in a column of its own. # quest: accept ch2_the_locks
    -> dace_topics
+ [Not yet.]
    "He'll keep. Preachers always do. That's half the trouble with them."
    -> dace_topics

== dace_locks_active ==
"The Canal Locks, up the cut. The preacher's on the first floor, by the way in. The Sluice is the hall on the floor below. Five waves, the eel-men say, before the lock-men lie back down. They'd know. They've watched."
-> dace_topics

== dace_locks_turnin ==
You tell him about the man in the plain coat: how kind he was, how he wouldn't give his name, how he stepped down into the Cult's boat as if somebody had held it for him.
Dace writes it all down. Then he writes *no name* beside it, and underlines that, and sits looking at it. # quest: turnin ch2_the_locks
"Pim'll want to see you. Pim always wants to see somebody, but this time he means it. His cart's by the cistern."
-> dace_topics

== dace_book ==
"Who owes who. Not money. I don't lend money, which is why they all tell me. A man'll tell you anything if he knows you won't ask for it back."
"Half of Saltmere owes Wren. Wren owes the other half. Somewhere in the middle there's a boat that belongs to nobody, and that's where the Toadking lives."
-> dace_topics

== dace_saltmere ==
"Stilts, boards, eels, fog. The Sisters at the chapel, Pim at his cart, my sister Wenna at the landing with her punt. Folk come down the canal road from your Vale and look at us like we're sinking."
"We are. Slowly. We've been sinking since the empire. We'll be sinking long after it's back."
-> dace_topics

== dace_bye ==
{&"Mind the boards. The third one from the door's not a board."|Dace has gone back to the book.|"Pay as you go. Everybody else does it the other way."}
-> END
