// wren.ink — Wren, a Saltmere smuggler and the Fens' found companion (rogue; world doc §5, v1.29). She borrowed from
// the Toadking to pay the Cult, couldn't pay the Toadking, and he kept her tied in the Boat Hall as surety beside his
// berth-book. Small, quick, a black braid, a smirk she uses instead of thanks. Entry: wren_hub: in the hall while she
// waits there, and from her party card once she's with you. Bound in by src/story/adapter.js from the sim
// (sim/npcs.js varsFor: joined 0 / 1, in_party 0 / 1; core.js: boss_<id> 0 / 1; quests.js: q_ = −1 locked ·
// 0 available · 1 active · 2 ready · 3 done, s_ = the step, read before this conversation counts: Fog on the
// Canal's last step is a word with her). Effects: flags: met_wren; `# companion: join` (heroes.js: only once the
// Toadking has fallen). She's talked to from her card, party or bench (`joined`, v1.154). Her chain, What's Owed, is
// Dace Pike's to give since v1.155 (the owner: "move the companion chains to townspeople too"; dace.ink): she only says
// what she's owed, and who's keeping count. The rogue's level-12 trial, Dead Water, is Dace Pike's now (dace.ink; the owner, 2026-11-26: no quest
// needs a companion): she only says what's on her knives, and who has it off her.

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
-> wren_topics

== wren_greet_fallen ==
Wren keeps looking back the way you came, where {fallen_name} should be, and pretending she isn't.
"We should go back for {fallen_name}. Not because I like them. They owe me two coppers."
-> wren_topics

== wren_topics ==
+ [Tell me about this marker.] -> wren_owed
+ [What's on your knives?] -> wren_knives
+ [Why did you borrow from the Cult?] -> wren_why
+ [Tell me about the Toadking.] -> wren_toadking
+ [That's all.] -> wren_bye

// What's Owed (content/quests/wren_*.json): Dace Pike gives it since v1.155
== wren_owed ==
"A marker's a promise with a knife in it. The Cult cut mine in three and gave the pieces to three of their harvesters at the Locks. While they carry it, the Cult can come and collect me, in a cage on a pole."
"There's more. Two of my caches are down at the vats, and the Cult's boat ties up under the Abbey, and I'd like to see it on fire."
"Dace has it all on my pages. If the Cult collects me he's never paid, so he's taking an interest. Ask him at the Eel. Don't let him charge you for asking."
-> wren_topics

// ── the rogue's second trial (content/quests/trial_dead_water.json): Dace Pike gives it since v1.154 ──
== wren_knives ==
"On my knives? Something from the Sickpools. Don't lick them." She turns one so the edge catches the light. It's faintly green.
"Dace knows how much goes on an edge. I showed him, to clear a page. Ask him at the Eel and he'll teach your rogues. He'll tell them he thought of it himself."
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
