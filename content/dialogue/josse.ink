// josse.ink — Josse Wether, the Quay Chapel's sexton in Tollhaven (world doc v1.74 §3.7), on the Chapel's step with
// the book of the drowned's names on his knee and a handbell beside him. Sister Maren reads the names out of an evening;
// he finds them and writes them in first. Slow, careful and unhurried, gentle with the dead and a little grim about the
// living. His concern is getting a name right, and it bends his syntax: he spells a name out, letter by letter, before
// he writes it or says what he thinks of it (his one device, copy-review §8; at most once a knot). Entry: josse_hub.
// Bound in by src/story/adapter.js from the sim (sim/npcs.js varsFor; day_part 0 dawn · 1 day · 2 dusk · 3 night;
// quests.js q_ = −1 locked · 0 available · 1 active · 2 ready · 3 done). Flags: met_josse; `# service: temple` opens the
// Chapel's window. He gives and takes in Maren's chain, The Names (GDD v1.155: a companion's chain is a townsperson's,
// and nothing waits on her being with you): maren_the_harbour_roll (two chests in the Drowned Mole, the harbour office's
// roll of who drowned), maren_the_prize_crews (six waves among the Gull Isles' hulks, copying the taken crews' names off
// the beams) and maren_said_aloud (five waves in Highmarch's Seventh Tower while the names are read out there; it pays the
// heirloom The Name Bell, which the sim gives, never this file). He speaks of Maren; the names are hers to say. No HTML.

VAR hero_name = ""
VAR hero_class = ""
VAR hero_origin = ""
VAR hero_level = 1
VAR party_size = 1
VAR fallen_name = ""
VAR day_part = 0
VAR flag_met_josse = 0
VAR q_maren_the_harbour_roll = -1
VAR q_maren_the_prize_crews = -1
VAR q_maren_said_aloud = -1

== josse_hub ==
{ flag_met_josse == 0:
    A thin man in a sexton's black coat sits on the Quay Chapel's step with a heavy book open on his knee and a handbell by his boot. He says a name to himself, shapes it letter by letter with his lips, and writes it in.
    "Josse Wether. W, E, T, H, E, R. Not the weather, and not the sheep. I'm the Chapel's sexton: the bell, the roof, and this." He lifts the book an inch. # flag: set met_josse
    "Sister Maren reads the names out of it of an evening. Someone has to have them written down first. That's me."
- else:
    { day_part == 2:
        Josse is ringing the handbell at the Chapel door, once, and then again, and between the rings someone inside is saying names.
    - else:
        {&"Morning or evening, the book doesn't mind which. Come in out of the wind."|Josse is writing. He finishes the name before he looks up, and blots it.|"Another one in today, off a fishing boat. A cooper. C, O, O, P, E, R. It was his trade and his name both. He'd have liked that."}
    }
}
{ fallen_name != "": "You came up the quay without {fallen_name}. Inside. The Chapel can get them up again, for the fee. I'd rather not have to learn their name the other way." }
{ q_maren_said_aloud == 3: "The book's as whole as it'll get. The Sister reads it through in a night now. She says it's shorter than she feared. It isn't. She reads quicker." }
-> josse_topics

== josse_topics ==
+ { q_maren_the_harbour_roll == 2 } [The harbour office's roll. #mark: quest ready] -> josse_roll_turnin
+ { q_maren_the_harbour_roll == 0 } [What's missing from the book? #mark: quest] -> josse_roll_offer
+ { q_maren_the_harbour_roll == 1 } [About the roll… #mark: quest active] -> josse_roll_active
+ { q_maren_the_prize_crews == 2 } [The names off the hulks' beams. #mark: quest ready] -> josse_crews_turnin
+ { q_maren_the_prize_crews == 0 } [Who else isn't in the book? #mark: quest] -> josse_crews_offer
+ { q_maren_the_prize_crews == 1 } [About the hulks… #mark: quest active] -> josse_crews_active
+ { q_maren_said_aloud == 2 } [The names were said in the tower. #mark: quest ready] -> josse_aloud_turnin
+ { q_maren_said_aloud == 0 } [Is the book finished? #mark: quest] -> josse_aloud_offer
+ { q_maren_said_aloud == 1 } [About the tower… #mark: quest active] -> josse_aloud_active
+ [Can the Chapel help us?]
    "It raises the fallen, for a fee. The fee goes on the roof. The roof needs it." # service: temple
    -> END
+ [Why the bell?] -> josse_bell
+ [Tell me about Sister Maren.] -> josse_maren
+ [Tell me about the Quay Chapel.] -> josse_chapel
+ [I'll leave you to it.] -> josse_bye

// ── The Names, 1: The Harbour Roll (content/quests/maren_the_harbour_roll.json) ──
== josse_roll_offer ==
"The book's short. The Sister names the Mole's drowned when she meets them, and half of them she names by what they did aboard. A cook. A gunner. The boy on the lines. They had names. She'd rather say those. So would I."
"The old harbour kept a roll of everyone who drowned in it. The harbour office had it, out on the moles. If it's anywhere, it's in a chest out there."
"It's the Sister's work, saying them. She's out with you, or out on the quays, and the book's mine. Bring me the roll and I'll copy it in."
+ [We'll find the roll. #mark: quest]
    "The Drowned Mole, by Gullwick's ferry. Two chests: the office always split a roll, in case of fire. A harbour office worrying about fire. Try the harbour office itself first, on the moles." # quest: accept maren_the_harbour_roll
    -> josse_topics
+ [Not now.]
    "They've waited at the bottom of the harbour. A chest is drier."
    -> josse_topics

== josse_roll_active ==
"The Drowned Mole. Two chests, anywhere in it, but the harbour office on the moles is likeliest. Keep it dry if you can. Salt eats ink."
-> josse_topics

== josse_roll_turnin ==
Josse opens the roll across his knee and reads down the first column under his breath. At one he stops. "H, A, L, L, O, W, E, S. Hallowes. Bosun." He writes it in, and goes on. # quest: turnin maren_the_harbour_roll
"Four hundred and some. Most of them never got into anyone's book but this one, and that was a tithe office's."
"The Sister will read them tonight. It'll take her till the second watch. She won't mind the hour. She'll mind if I've spelled one wrong, so I won't have."
-> josse_topics

// ── The Names, 2: The Prize Crews (content/quests/maren_the_prize_crews.json) ──
== josse_crews_offer ==
"There's another lot not in the book. Hesk's. Not his own men: the crews he took off League ships, this year and last. He kept them below decks in his hulks on the Isles until somebody paid for them. For some, nobody paid."
"Men kept below cut their names in the beams. They always have. I'd like those copied before the Gull Fleet burns the hulks for firewood."
"Copying takes a while, and the fleet won't give you a while. You'll have to hold them off while somebody writes."
+ [We'll copy them. #mark: quest]
    He gives you a board, a quire of paper and a stub of lead. "The Gull Isles, the second floor, in the hulks. Six turns of the fighting, and every name off the beams. Spell them as they're cut, even cut wrong. It's their spelling." # quest: accept maren_the_prize_crews
    -> josse_topics
+ [Not now.]
    "The beams are oak. The names have a while yet, unless the fleet runs short of firewood."
    -> josse_topics

== josse_crews_active ==
"The hulks on the Gull Isles, the second floor. Hold six waves, and copy the beams while you do."
-> josse_topics

== josse_crews_turnin ==
Josse reads your copy through slowly, mouthing each name. Some are cut twice on the beams, once by the man and once by his mate, in case.
"C, O, R, R, A, N. Corran. His mate cut it with one R. He cut it with two. I'll go with the man." # quest: turnin maren_the_prize_crews
"Once each in the book. The Sister will say them once. That's all a name wants: to be said right, the once."
-> josse_topics

// ── The Names, 3: Said Aloud (content/quests/maren_said_aloud.json): the heirloom The Name Bell ──
== josse_aloud_offer ==
"The book's as whole as I can make it. There's one thing more, and it's the Sister's thought, not mine."
"Most of the names in here were sung up off the Mole by one man, and walked up the Highmarch road to his tower to be given their orders. The Sister says the bound keep the last thing they hear, and that the last thing that tower heard of them should be their names, not his song."
"I've written a fair copy, small enough to carry. Anyone can read it. You don't need to be a Sister. You only need to get every one right. The tower won't let you read in peace, so somebody holds the floor while somebody reads."
+ [We'll read them there. #mark: quest]
    He puts the fair copy into your hands as if it might spill. "Highmarch, the second floor: the tower. Five turns of the fighting, and every name read out while you hold it. Read slow. It's a long book." # quest: accept maren_said_aloud
    -> josse_topics
+ [Not yet.]
    "Then I'll make the copy smaller. My hand's getting better at small."
    -> josse_topics

== josse_aloud_active ==
"The Seventh Tower, Highmarch's second floor. Five waves, and the fair copy read through out loud, every name."
-> josse_topics

== josse_aloud_turnin ==
You give him back the fair copy. Its corners have gone soft from being held through a fight. He turns the pages to the last and closes it.
"Every one? Then that tower has heard them said in a plainer voice than his. Plainer's better. It's how you'd call a man in off a boat." # quest: turnin maren_said_aloud
He picks up the handbell from beside his boot and holds it out. "It's rung once for every name in that book. The Chapel can buy another. This one knows the work."
"The Sister will want to hear you did it. She'll say she'd have read it louder. She would."
-> josse_topics

// ── plain topics ──
== josse_bell ==
"One ring for each name, once the Sister's said it, so the name knows it's been heard. That's the old custom on this quay."
"I don't know if it's true. I ring it anyway. It's a small bell and a long book, and my arm's got used to it."
-> josse_topics

== josse_maren ==
"Sister Maren. M, A, R, E, N. Came to us from Reedholm with a copy of the fleet's muster in her bag, and read it out on the quay the first night, every name, to nobody. The second night there were six of us listening."
"She went out to the Mole after the drowned on a boat Hester never cleared. I'd have gone with her, but somebody had to ring. I've thought about that since."
-> josse_topics

== josse_chapel ==
"The Quay Chapel. Small, damp, and older than the quay: they built the quay up to its door. The sea takes the drowned round here, so a sexton has no digging. I keep the book instead. It's drier work."
"The League gives us nothing, and Hester's never tolled us, and the roof leaks on the north side. We pray on the south side. It's worked so far."
-> josse_topics

== josse_bye ==
{&"Mind the step. It's wet. It's always wet."|Josse has gone back to the book. You hear him spelling something under his breath.|"Go careful. I'd rather not have to write you in."}
-> END
