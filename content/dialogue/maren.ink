// maren.ink — Sister Maren, a Grey Sister, chaplain on Tollhaven's quays and the Tidemark's found companion (cleric;
// world doc v1.69 §3.7). She says the drowned's names at the Quay Chapel. When they started walking up the quays she
// took a boat out to the Drowned Mole after them, and holds the harbour office on the moles (floor 2) with a boathook,
// naming the drowned at its door. Her device: she names the dead, by name or by what they did aboard, before she says
// anything else about them (copy-review §8). Entry: maren_hub: in the harbour office while she holds it, and from her
// party card once she's with you. Bound in by src/story/adapter.js from the sim (sim/npcs.js varsFor: joined 0 / 1,
// in_party 0 / 1; core.js: boss_<id> 0 / 1; quests.js: chapters_done, the main chapters handed in: 18 after Low Water,
// 21 after Brine Cross, 22 after The Seventh Voice). Effects: flags: met_maren; `# companion: join` (heroes.js: only
// once the Harbourmaster has fallen). She's talked to from her card, in the party or on the bench (v1.154). Her own
// chain is to come, and will gate on `joined`. Act IV's last chapter, The Seventh Voice (ch4_seventh_voice), is Hester
// Quaile's to give (v1.154; the owner, 2026-11-26: no quest needs a companion): after Brine Cross Maren says her piece
// about the man who sang the drowned up, and sends you to Hester. No quest is bound to her, so she reads chapters_done
// and the bosses, never q_.

VAR hero_name = ""
VAR hero_class = ""
VAR hero_origin = ""
VAR hero_level = 1
VAR party_size = 1
VAR fallen_name = ""
VAR day_part = 0
VAR flag_met_maren = 0
VAR joined = 0
VAR in_party = 0
VAR boss_harbourmaster = 0
VAR boss_lucan = 0
VAR chapters_done = 0

== maren_hub ==
{ joined == 0 && boss_harbourmaster == 0: -> maren_held_early }
{ joined == 0: -> maren_held }
{ fallen_name != "": -> maren_greet_fallen }
-> maren_greet

// ── in the harbour office ──
== maren_held_early ==
A Grey Sister stands in the harbour office's doorway with a boathook held across it. A drowned sailor is on the step in front of her. She says a name to it, and it stops, and stands, and listens. # flag: set met_maren
"Sister Maren. That was a gunner. They stop for their names. Not for long."
"The one who keeps them coming is out on the end of the mole, with his book. While he stands, they climb up. I'll go on naming them. I've more names than he has berths, I hope."
-> END

== maren_held ==
// (one branch or the other, not two conditional lines: the flag's line is replayed with the flag set, and a second
// line asking `== 1` would then show as well)
{ flag_met_maren == 0:
    A Grey Sister sits in the harbour office's doorway with a boathook across her knees. On the mole outside, the drowned have lain down where they stood. # flag: set met_maren
- else:
    Maren is sitting in the doorway now, the boathook across her knees. On the mole outside, the drowned have lain down where they stood.
}
"Sister Maren, of the Quay Chapel. Hester sent you. She'll have charged you for the directions."
{
- hero_origin == "grey_sisters_ward":
    "Reedholm. You've the look. I was there too, copying names into the rolls. Now I say them out loud. It's a better use for them."
- hero_class == "cleric":
    "You're a cleric. Then you know the work is half prayer and half nerve. I've used up the nerve. The prayer is holding."
- else:
    "Mind that one by your boot. A cook. He'd mind being trodden on. He minded everything."
}
-> maren_ask

== maren_ask ==
"I came out because they were coming in. Every night, up the quays, standing at the bollards. A name sends them back. It's all I have that works on them."
"Someone stood on the lamp-stand at the end of the mole and sang them up. I heard it from the boat. He had a good voice. That was the worst of it."
"You'll go after him. I'd like to come. The ones he wakes will want naming, and you'll be busy."
+ [Come with us. #mark: quest]
    She stands, leans the boathook against the doorpost, thinks better of it, and takes it with her. On the way out she says one more name to the mole. # companion: join
    -> maren_joined
+ [Not yet.]
    "Then I'll wait for the tide. They come up with it, and there should be a Sister here to meet them."
    -> END

== maren_joined ==
{ in_party == 1: "I'll walk at the back. If one of yours goes down, I'll get them up. If one of theirs does, I'll tell it who it was." }
{ in_party == 0: "No room. That's all right. I'll be at the Quay Chapel, saying names. Fetch me when you want me. I won't have finished." }
-> END

// ── with you ──
== maren_greet ==
{&Maren is saying names under her breath. She finishes the one she's on before she looks up.|"I'm listening. I can say names and listen at once. It's most of a chaplain's work."|Maren falls into step, the boathook over her shoulder. She brought it back from the Mole. She says it has been more use than the psalter.}
{ chapters_done >= 18 && chapters_done < 21: "The quays are quiet at night now. Hester says it's the first thing on this coast she's had for nothing." }
{ chapters_done == 21: "Highmarch. I've been working out what to say to him. So far it's mostly names." }
{ chapters_done >= 22: "He'll be on the Sol by now, in that coat. I said a prayer for him last night. It's the work. It doesn't mean I liked it." }
-> maren_topics

== maren_greet_fallen ==
Maren says {fallen_name}'s name once, quietly, the way she says the drowned's.
"That isn't one I mean to learn. Take them to the Quay Chapel, or whatever shrine is nearest. Yours get up. Mine don't."
-> maren_topics

== maren_topics ==
+ { chapters_done == 21 && boss_lucan == 0 } [What now, after the bridge?] -> maren_seventh_offer
+ [Whose names do you say?] -> maren_names
+ [What did you hear on the Mole?] -> maren_song
+ [Tell me about Hester.] -> maren_hester
+ [That's all.] -> maren_bye

== maren_names ==
"Bosun. Two gunners. The cook. The boy who ran the lines." She stops there. "The fleet's. The harbour kept a muster of every crew that berthed, and the Quay Chapel had the copy. I read it until I knew it by heart."
"The Sisters wrote names down for the empire once. I say them out loud instead. It's the same list. I'd like to think it's a different use."
-> maren_topics

== maren_song ==
"A man on the lamp-stand at the mole's end, at night, singing. Not a quay song. It was older than the quays."
"The drowned stood up when he sang, the whole fleet of them, and turned toward the land. Then he stopped singing. They didn't stop walking."
"I'd like to tell him he has a good voice. Then I'd like to put him in the harbour with the boathook."
-> maren_topics

== maren_hester ==
"Hester tolls everything: the chain, the gate, the quay, a question if you ask it twice. She has never once tolled the Chapel. She says she's waiting for it to turn a profit."
"She'd have stopped me going out to the Mole. That's why I didn't ask."
-> maren_topics

// ── Act IV, chapter 6: The Seventh Voice (content/quests/ch4_seventh_voice.json): Hester gives it (v1.154); Maren's piece ──
== maren_seventh_offer ==
Maren says names, one after another: the two League masters Hesk boarded, the gunner at the harbour office door, the boy who ran the lines. She stops when she has run out of the ones she means.
"That's what he owes. The man who sang them up. He's in Highmarch, and the drowned came down that road from him, in step."
"Hester's people say his walls are full of legionaries in the old harness, drilling for a coronation. He means to be crowned in the capital. I'd like a word with him before he goes."
"I said I'd tell him he has a good voice. Hester has the League's say on Highmarch. Ask her at the Paid Toll, and I'll come up the road with you. I've even told her I'm going, in writing. It's a first."
-> maren_topics

== maren_bye ==
{&"Go on. I'll catch up. I've a name to finish."|Maren has gone back to her names.|"Mind the weed on the steps. It's had a long time to get slippery."}
-> END
