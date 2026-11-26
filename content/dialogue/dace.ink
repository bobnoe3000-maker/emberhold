// dace.ink — Dace Pike, who keeps the Drowned Eel in Saltmere (world doc §3.2, v1.29): Wenna's older brother, broad,
// slow, and the only man in Saltmere who writes things down. He lends nobody money, which is why everyone tells him
// what they owe. Entry: dace_hub. Bound in by src/story/adapter.js from the sim (sim/npcs.js varsFor; quests.js:
// q_ = −1 locked · 0 available · 1 active · 2 ready · 3 done, and s_ = the step a quest is on, read before this
// conversation counts: Fog on the Canal's first step is a word with him). Flags: met_dace. Act II, chapters 1–2.
// (v1.154; the owner, 2026-11-26: no quest needs a companion) the rogue's level-12 trial, Dead Water, which was Wren's:
// what she puts on her knives, which she paid off a page of her debts to him with. (v1.155; the owner: "move the
// companion chains to townspeople too") And Wren's chain, What's Owed (wren_the_marker, wren_night_boats,
// wren_settled): she owes him four pages, and if the Cult collects her he's never paid, so he takes an interest. He
// talks about her freely; nothing waits on her being found or with you. Settled's boat is fired by his sister Wenna
// from her punt, and the ring off it is the heirloom The Receipt.

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
VAR q_trial_dead_water = -1
VAR q_wren_the_marker = -1
VAR q_wren_night_boats = -1
VAR q_wren_settled = -1

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
// (the first line says nothing to the sim: the story waits after a line with effects and comes back with the sim's
// variables, and by then this meeting has counted, so coming back to the first line would start over from the hub)
{ flag_met_dace == 0: A broad man behind the Eel's counter is writing in a book with a pencil he has to lick every third word. | Dace looks up from the book. }
You give him Sister Ilse's letter. He reads it twice, slowly, with his finger, and puts it in the book. # flag: set met_dace
"Dace Pike. Ilse writes a good letter. Too many words, but all the right ones."
"Robed men, boats at night, up the canal toward your Vale. Aye. Nobody in Saltmere's seen where they tie up. Nobody but Wren, and Wren owes everybody."
"She owed the Toadking last. He's a bandit out in the reeds with a mound of stolen boats, and when you can't pay him he keeps you. He's kept her a month." He turns the book round so you can see her line. It's long.
{ boss_toadking == 1: "You've been out there already, have you. Then go back down and talk to her. She'll be in his Boat Hall, if she's anywhere." }
{ boss_toadking == 0: "Toadking's Mound. The Boat Hall's the second floor down. Put him down and Wren'll talk. She'll talk anyway. Put him down first." }
-> dace_topics

== dace_greet_back ==
{&Dace looks up from the book and nods at the bench by the stove.|"{hero_name}. You're in here." He taps the book. "Nothing against you yet."|Dace is adding up a column. He holds up a hand until it comes out the same twice.}
{ q_ch2_fog_on_the_canal == 1 && s_ch2_fog_on_the_canal == 1: "Toadking's Mound. The Boat Hall's the second floor. He's fat and cheerful and he'll hit you with a boat-hook. Don't let the cheerful fool you." }
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
+ { q_wren_the_marker == 2 } [All three pieces of Wren's marker. #mark: quest ready] -> dace_marker_turnin
+ { q_wren_the_marker == 0 } [What does Wren owe? #mark: quest] -> dace_marker_offer
+ { q_wren_the_marker == 1 } [About the marker… #mark: quest active] -> dace_marker_active
+ { q_wren_night_boats == 2 } [Both of Wren's caches. #mark: quest ready] -> dace_boats_turnin
+ { q_wren_night_boats == 0 } [Anything else of Wren's? #mark: quest] -> dace_boats_offer
+ { q_wren_night_boats == 1 } [About her caches… #mark: quest active] -> dace_boats_active
+ { q_wren_settled == 2 } [The Cult's boat is burning. #mark: quest ready] -> dace_settled_turnin
+ { q_wren_settled == 0 } [What about the Cult's boat? #mark: quest] -> dace_settled_offer
+ { q_wren_settled == 1 } [About the boat… #mark: quest active] -> dace_settled_active
+ { q_trial_dead_water == 2 } [Five of their leaders. None of them saw us. #mark: quest ready] -> dace_dead_water_turnin
+ { q_trial_dead_water == 0 } [Would you teach a rogue anything? #mark: quest] -> dace_dead_water_offer
+ { q_trial_dead_water == 1 } [About the vats… #mark: quest active] -> dace_dead_water_active
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
"The Canal Locks, up the cut. The preacher's on the first floor, by the way in. The Sluice is the hall at the far end of it. Five waves, the eel-men say, before the lock-men lie back down. They'd know. They've watched."
-> dace_topics

== dace_locks_turnin ==
You tell him about the man in the plain coat: how kind he was, how he wouldn't give his name, how he stepped down into the Cult's boat as if somebody had held it for him.
Dace writes it all down. Then he writes *no name* beside it, and underlines that, and sits looking at it. # quest: turnin ch2_the_locks
"Pim'll want to see you. Pim always wants to see somebody, but this time he means it. His cart's by the cistern."
-> dace_topics

// ── the rogue's second trial (content/quests/trial_dead_water.json; his since v1.154, Wren's before) ──
== dace_dead_water_offer ==
"A rogue? Aye, I've something. Not mine, mind. Wren's. She owed me a page and paid it off in what she knows, and I've had it ever since."
"There's a green in the Sickpools that doesn't kill quick. It's patient. The eel-men put a drop on the gaff for the big ones, and the big ones come in quiet in the end."
"The Cult's harvesters at the vats, the ones out in front with the full cages, wade in it all day and never look behind them. Nothing behind them ever moved. Get behind five before they turn round, and I'll show your rogues what to put on a blade, and how much."
+ [We'll get behind five. #mark: quest]
    "The Canal Locks, down at the vats. The ones out in front, every fifth lot, with the full cages. Mind your footing at the edges. Folk who go in that water come out quiet." # quest: accept trial_dead_water
    -> dace_topics
+ [Not now.]
    "Suit yourself. The vats'll still be green."
    -> dace_topics

== dace_dead_water_active ==
"The Locks' vats. Five of their leaders, from behind. Folk say they never look. Folk are mostly right about that sort of thing."
-> dace_topics

== dace_dead_water_turnin ==
Dace fetches a little stoppered bottle from under the counter, the kind Pim sells oil in, and shows your rogues how much goes on an edge: one drop, worked in with a thumb, and then wipe the thumb. Twice.
"Venom, Wren calls it. She paid off page three with it. Now you've had it too, and she's still on page four." # quest: turnin trial_dead_water
-> dace_topics

// ── What's Owed (content/quests/wren_*.json; his since v1.155, Wren's before): Wren's debts, which are his business ──
== dace_marker_offer ==
"Wren? Four pages. And that's only what she owes me." He doesn't open the book. He doesn't need to.
"She borrowed off the Cult for a boat, and they hold her marker for it. A marker's a promise with a knife in it. They cut hers in three and gave the pieces to three of their harvesters, the ones that lead the others at the Locks."
"While those pieces walk about, the Cult can come and collect her, and they don't collect in coin. If they collect her, I'm never paid. So I'm taking an interest."
+ [We'll get the pieces. #mark: quest]
    "The Canal Locks. The leader of every fifth lot, with the cage that glows. Three pieces. They'll not know what they're carrying. Cult folk never do." # quest: accept wren_the_marker
    -> dace_topics
+ [Not now.]
    "Aye, well. She's kept clear of them this long. Mostly by owing me instead."
    -> dace_topics

== dace_marker_active ==
"The Locks. Three of their leaders, every fifth lot. Each one's got a piece of her on him."
-> dace_topics

== dace_marker_turnin ==
Dace fits the three pieces together on the counter. It's a strip of hide with Wren's name burned into it, and a number, and a little drawing of a flame.
He reads the number, whistles low, and feeds the strip into the stove a piece at a time. "That's her off the Cult's books." # quest: turnin wren_the_marker
"She's still in mine. Somebody has to keep her honest, and it'll not be the Cult."
-> dace_topics

== dace_boats_offer ==
"When Wren ran the canal at night she hid things down at the vats under the Locks. Two chests, tied with her knot. She told me where, near enough, to clear half a page."
"Now the Cult's draining the vats, and somebody in a robe's going to open one and learn things about the Sisters. Folk in Saltmere would rather they didn't. So would the Sisters."
+ [We'll fetch them up. #mark: quest]
    "The Canal Locks, any floor. Vat Seven's the likeliest. Her knot's the one that looks wrong and isn't." # quest: accept wren_night_boats
    -> dace_topics
+ [Not now.]
    "They've stayed hid this long. Most of what Wren hides does."
    -> dace_topics

== dace_boats_active ==
"Two chests with Wren's knot, down at the Locks. Vat Seven first. Don't untie the knot. You'll never tie it back."
-> dace_topics

== dace_boats_turnin ==
Dace has you set both chests behind the counter, knots and all. He doesn't open them.
"Wren's. They stay shut till she comes for them." He writes it down. "She'll say I opened them. I've written that I didn't, and the date." # quest: turnin wren_night_boats
-> dace_topics

== dace_settled_offer ==
"The Cult's boat ties up under the Abbey now, the one the Toadking charged double. Everything they carry goes on it: the cages, the rolls, and the markers on half of Saltmere."
"My sister Wenna says she'll pole round under the Abbey with a pot of pitch and set it alight from the water. She'll want the cloister above it held while she does, so nobody comes down the stair at her."
"Wren would give her right hand to see it burn. She'd want it back after, mind."
+ [We'll hold the cloister. #mark: quest]
    "The Drowned Abbey, the cloister, on the first floor. Five lots of them, and Wenna will have it burning. Don't go looking for her. She'll come for you." # quest: accept wren_settled
    -> dace_topics
+ [Not now.]
    "It'll still float tomorrow. That's the trouble with boats."
    -> dace_topics

== dace_settled_active ==
"The Abbey's cloister, the first floor. Five waves, and keep them off the stair. Wenna does the rest."
-> dace_topics

== dace_settled_turnin ==
Dace has the news already. Wenna came in an hour before you, smelling of pitch, and drank something he didn't charge her for.
He takes a ring from under the counter and puts it in front of you. "She fished this off the boat before she lit it. It's Wren's. She paid the Cult with it, the first time she borrowed." # quest: turnin wren_settled
"Wenna says it's yours, for holding the stair. Wren will want it back. Don't give it her. It's a receipt."
-> dace_topics

== dace_book ==
"Who owes who. Not money. I don't lend money, which is why they all tell me. A man'll tell you anything if he knows you won't ask for it back."
"Half of Saltmere owes Wren. Wren owes the other half. Somewhere in the middle there's a boat that belongs to nobody, and that's where the Toadking lives."
-> dace_topics

== dace_saltmere ==
"Stilts, boards, eels, fog. The Sisters at the chapel, Pim at his cart, my sister Wenna at the landing with her punt. Folk come in off the road from your Vale and look at us like we're sinking."
"We are. Slowly. We've been sinking since the empire. We'll be sinking long after it's back."
-> dace_topics

== dace_bye ==
{&"Mind the boards. The third one from the door's not a board."|Dace has gone back to the book.|"Pay as you go. Everybody else does it the other way."}
-> END
