// wren.ink — Wren, a Saltmere smuggler and the Fens' found companion (rogue; world doc §5, v1.29). She borrowed from
// the Toadking to pay the Cult, couldn't pay the Toadking, and he kept her tied in the Boat Hall as surety beside his
// berth-book. Small, quick, a black braid, a smirk she uses instead of thanks. Entry: wren_hub: in the hall while she
// waits there, and from her party card once she's with you. Bound in by src/story/adapter.js from the sim
// (sim/npcs.js varsFor: joined 0 / 1, in_party 0 / 1; core.js: boss_<id> 0 / 1; quests.js: q_ = −1 locked ·
// 0 available · 1 active · 2 ready · 3 done, s_ = the step, read before this conversation counts: Fog on the
// Canal's last step is a word with her). Effects: flags: met_wren; `# companion: join` (heroes.js: only once the
// Toadking has fallen); her chain, What's Owed.

VAR hero_name = ""
VAR hero_class = ""
VAR hero_origin = ""
VAR hero_level = 1
VAR party_size = 1
VAR fallen_name = ""
VAR day_part = 0
VAR flag_met_wren = 0
VAR joined = 0
VAR in_party = 0
VAR boss_toadking = 0
VAR q_ch2_fog_on_the_canal = -1
VAR s_ch2_fog_on_the_canal = 0
VAR q_wren_the_marker = -1
VAR q_wren_night_boats = -1
VAR q_wren_settled = -1
VAR q_trial_dead_water = -1

== wren_hub ==
{ joined == 0 && boss_toadking == 0: -> wren_tied_early }
{ joined == 0: -> wren_tied }
{ fallen_name != "": -> wren_greet_fallen }
-> wren_greet

// ── in the Boat Hall ──
== wren_tied_early ==
A small woman sits roped to the mast of an upturned boat, next to a lectern with a fat book chained to it. She has worked one hand free and is using it to wave. # flag: set met_wren
"Don't mind me. I'm surety. He'll be along in a minute to tell you how much I'm worth. It's less than you'd think."
-> END

== wren_tied ==
{ flag_met_wren == 0: A small woman sits roped to the mast of an upturned boat, next to a lectern with a fat book chained to it. She watches the Toadking's men carry him off by the boots. # flag: set met_wren }
{ flag_met_wren == 1: Wren is still roped to the mast. She's got both hands free now, and is reading the chained book upside down. }
"Wren. Saltmere. I owed him, he kept me, you've settled it. I'd say thank you, but then I'd owe you, and I've only just got clear."
{ q_ch2_fog_on_the_canal == 1 && s_ch2_fog_on_the_canal == 2: -> wren_berth_book }
"His berth-book. Every boat that's come through the reeds, who rowed it, what it carried, where it tied up. He couldn't read. He just liked having it."
-> wren_ask

== wren_berth_book ==
"Dace sent you? Of course Dace sent you. Dace has me on four pages." She pulls the chained book round and turns to the back without looking.
"Robes. Night boats, up the canal and back, every new moon since spring. Heavy going up, heavier coming back." Her finger stops. "They tie up at the Canal Locks. Always the Locks. The Toadking charged them double and they paid it without asking. Nobody pays the Toadking without asking."
"Tell Dace. He'll write it under *robes*. He's got a heading for them already. He's had it a year."
-> wren_ask

== wren_ask ==
"The Cult holds my marker. That's why I owed him: I borrowed to pay them, and paid them, and they still hold it. They'll come and collect, and they don't collect money."
"You look like people who go places the Cult goes. I could come along. I'm good with locks and better with knives, and I know where everything in this fen is hidden, because I hid most of it."
+ [Come with us. #mark: quest]
    She slips the last of the rope like it was never tied, and stands, and stretches until something in her back clicks. # companion: join
    -> wren_joined
+ [Not yet.]
    "Suit yourself. I'll stay here and read. He's got some very interesting entries about the Sisters."
    -> END

== wren_joined ==
{ in_party == 1: "Right. I'll walk behind you. Not because I'm scared. Because it's where the pockets are." }
{ in_party == 0: "Your company's full. Fine. I'll be at the Stilt House in Saltmere. Don't tell Dace I'm there. He'll want to talk about page three." }
-> END

// ── with you ──
== wren_greet ==
{&Wren falls into step and pretends she was already there.|"What? I wasn't touching anything."|Wren is flipping a coin across her knuckles. It isn't hers. It might be yours.}
{ q_wren_settled == 3: "No marker. No boat. No debt. I keep checking my pockets for it. Habit." }
{ q_wren_night_boats == 3 && q_wren_settled == -1: "The Cult's boat ties up under the Abbey. There's a man with a cage at the choir's door above it, though. Once he's gone, I've a fire to light." }
-> wren_topics

== wren_greet_fallen ==
Wren keeps looking back the way you came, where {fallen_name} should be, and pretending she isn't.
"We should go back for {fallen_name}. Not because I like them. They owe me two coppers."
-> wren_topics

== wren_topics ==
+ { q_wren_the_marker == 2 } [That's all three pieces of the marker. #mark: quest ready] -> wren_marker_turnin
+ { q_wren_night_boats == 2 } [We found both your caches. #mark: quest ready] -> wren_boats_turnin
+ { q_wren_settled == 2 } [The boat's burning. #mark: quest ready] -> wren_settled_turnin
+ { q_wren_the_marker == 0 } [Tell me about this marker. #mark: quest] -> wren_marker_offer
+ { q_wren_the_marker == 1 } [About the marker… #mark: quest active] -> wren_marker_active
+ { q_wren_night_boats == 0 } [Anything else you're owed? #mark: quest] -> wren_boats_offer
+ { q_wren_night_boats == 1 } [About your caches… #mark: quest active] -> wren_boats_active
+ { q_wren_settled == 0 } [What would settle it? #mark: quest] -> wren_settled_offer
+ { q_wren_settled == 1 } [About the boat… #mark: quest active] -> wren_settled_active
+ { q_trial_dead_water == 2 } [Five of their leaders. None of them saw us. #mark: quest ready] -> wren_dead_water_turnin
+ { q_trial_dead_water == 0 } [What's on your knives? #mark: quest] -> wren_dead_water_offer
+ { q_trial_dead_water == 1 } [About the Sickpools… #mark: quest active] -> wren_dead_water_active
+ [Why did you borrow from the Cult?] -> wren_why
+ [Tell me about the Toadking.] -> wren_toadking
+ [That's all.] -> wren_bye

// What's Owed, 1: The Marker (content/quests/wren_the_marker.json)
== wren_marker_offer ==
"A marker's a promise with a knife in it. The Cult cut mine in three and gave the pieces to three of their harvesters, the ones who lead the others. One piece is a promise. Three is a debt."
"They work the Canal Locks. While those pieces walk around, the Cult can come and collect me, and they collect the way they collect everyone: in a cage on a pole."
+ [We'll get them back. #mark: quest]
    "The Locks. The ones out in front, every fifth lot, with the bigger cages. Bring me all three pieces. I want to see them burn." # quest: accept wren_the_marker
    -> wren_topics
+ [Not now.]
    "Fine. I'll just walk behind you jumpier than usual."
    -> wren_topics

== wren_marker_active ==
"The Canal Locks. Their leaders, every fifth lot. Three pieces. They won't know what they're carrying. That's the Cult: nobody knows what they're carrying."
-> wren_topics

== wren_marker_turnin ==
Wren fits the three pieces together on her knee. It's a strip of hide with her name burned into it, and a number, and a little drawing of a flame.
She reads it once, holds it over the nearest light until it catches, and drops it before it reaches her fingers. "That's that." # quest: turnin wren_the_marker
-> wren_topics

// What's Owed, 2: Night Boats (content/quests/wren_night_boats.json)
== wren_boats_offer ==
"Back when I ran the canal at night, I left things in the Sickpools. Nobody goes there. That was the point."
"Now the Cult's draining the vats, and somebody's going to drain one of mine. Two chests, tied with my knot. I'd like them back before somebody in a robe opens them and learns things about the Sisters."
+ [We'll get them. #mark: quest]
    "The Sickpools. Any two chests will be mine, probably. I hid a lot." # quest: accept wren_night_boats
    -> wren_topics
+ [Not now.]
    "They've kept this long. Most things I hide do."
    -> wren_topics

== wren_boats_active ==
"Two chests in the Sickpools. My knot's the one that looks wrong and isn't."
-> wren_topics

== wren_boats_turnin ==
Wren counts what's in them, out loud, in front of you, coin by coin. It takes a while.
"That's a compliment, by the way. I don't count in front of anybody." # quest: turnin wren_night_boats
-> wren_topics

// What's Owed, 3: Settled (content/quests/wren_settled.json)
== wren_settled_offer ==
"The Cult's boat. The one that ties up under the Abbey, the one the Toadking charged double. They carry everything on it: the cages, the rolls, the people who said yes."
"I'd like to burn it. Somebody has to hold the hall above it while I do, and it can't be me, because I'll be busy being on fire carefully."
+ [We'll hold the hall. #mark: quest]
    "The Drowned Abbey, the first floor's hall. Five lots of them, and I'll have it alight. Don't come looking for me. I'll come looking for you." # quest: accept wren_settled
    -> wren_topics
+ [Not now.]
    "It'll still float tomorrow. That's the problem with boats."
    -> wren_topics

== wren_settled_active ==
"The Abbey, the first floor's hall. Hold it five waves. I'll do the rest. I like doing the rest."
-> wren_topics

== wren_settled_turnin ==
Wren smells of pitch and smoke, and is smiling with all of her face for once.
She takes a ring off her thumb and holds it out. "I paid the Cult with this, the first time. Got it back off the boat. Take it. I'd only sell it." # quest: turnin wren_settled
"Don't make anything of it. It's a receipt."
-> wren_topics

// ── the rogue's second trial (content/quests/trial_dead_water.json; world doc v1.30) ──
== wren_dead_water_offer ==
"On my knives? Something from the Sickpools. Don't lick them." She turns one so the edge catches the light. It's faintly green.
"The vats. What's in them doesn't kill you fast. It's patient. The harvesters' leaders wade about in it all day and never look behind them, because nothing behind them ever moved."
"Get behind five of them before they turn round, and I'll show your rogues what to put on a blade, and how much. How much is the important part."
+ [Show us. #mark: quest]
    "Five. The ones out in front, with the full cages. Quietly. If they see you, it doesn't count, and also they'll see you." # quest: accept trial_dead_water
    -> wren_topics
+ [Not now.]
    "Fine. Mind the green ones."
    -> wren_topics

== wren_dead_water_active ==
"Five of the harvesters' leaders in the Sickpools. From behind. They never look."
-> wren_topics

== wren_dead_water_turnin ==
Wren takes a little stoppered bottle out of her boot, the kind Pim sells oil in, and shows your rogues how much goes on an edge: one drop, worked in with a thumb, and then wipe the thumb. Twice.
"That's venom. It's not clever. It's just patient. Be patient and you'll be fine." # quest: turnin trial_dead_water
-> wren_topics

== wren_why ==
"Everybody in Saltmere's borrowed from the Cult once. They lend at nothing a year, and they're very reasonable about it right up until they aren't."
"I wanted a boat of my own. I got one. Then they wanted it back, with me in it." She shrugs. "So I borrowed from the Toadking to pay them, and you've seen how that went."
-> wren_topics

== wren_toadking ==
"He wasn't cruel. He just liked having things. Boats, books, me. He'd sit by that book every night and run his finger down it like it was a song."
"Forty boats in that hall. Every one he'd taken from somebody who couldn't pay. He kept one tooth for each. Ask me how I know."
-> wren_topics

== wren_bye ==
{&"Right behind you. Or in front. Wherever the pockets are."|Wren gives a little salute with two fingers.|"Go on. I'll catch up. I always do."}
-> END
