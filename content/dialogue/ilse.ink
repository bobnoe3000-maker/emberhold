// ilse.ink — Sister Ilse, a Grey Sister archivist at the Shrine of the Ember in Thornwick (world doc
// §5, §7, v1.6): sent up from Reedholm to copy whatever comes out of the barrows; keeps the
// Chronicle; trusts nothing she hasn't read twice. Entry: ilse_hub. Bound in by src/story/adapter.js
// from the sim (sim/npcs.js varsFor); Ink only reads them (flags: met_ilse; her errand,
// vale_first_page: q_ = −1 locked · 0 available · 1 active · 2 ready · 3 done; the Vale's fragments,
// sim/lore.js: frag_<id> 0 / 1 and frag_vale_count). She reads the set in order (world doc §7).

VAR hero_name = ""
VAR hero_class = ""
VAR hero_origin = ""
VAR hero_level = 1
VAR party_size = 1
VAR fallen_name = ""
VAR day_part = 0
VAR flag_met_ilse = 0
VAR q_vale_first_page = -1
VAR q_ch1_ember_in_the_fist = -1
VAR q_trial_last_rites = -1
VAR frag_vale_count = 0
VAR frag_vale_standing_order = 0
VAR frag_vale_muster_roll = 0
VAR frag_vale_centurion_tablet = 0

== ilse_hub ==
{ flag_met_ilse == 0: -> ilse_first_meet }
{ fallen_name != "": -> ilse_greet_fallen }
-> ilse_greet_back

== ilse_first_meet ==
A Grey Sister sits on the Shrine's step with a writing board on her knees, copying from a tablet so worn it is mostly guesswork. She frowns at the guesswork.
"Sister Ilse. Reedholm sent me up to write down whatever comes out of the barrows before somebody burns it or sells it." # flag: set met_ilse
{
- hero_origin == "grey_sisters_ward":
    "You were at Reedholm. I know the way you're standing: like someone waiting to be told off for reading at table. Sit. Nobody here will tell you off."
- hero_origin == "redhand_deserter":
    "The Company burned a library at Ashgate. I don't hold you to it. I hold them to it."
- hero_origin == "thornwick_born":
    "You're from here. Then you'll know the barrows were quiet your whole life. They aren't now. Somebody should write down why."
- hero_origin == "deepdelver_fostered":
    "The Deepdelvers keep records in stone. It's a good habit. It's also why nobody reads them."
- else:
    "You'll be going down there. Everyone is, now."
}
-> ilse_topics

== ilse_greet_back ==
{&Ilse looks up from the board and holds up a finger until she finishes the word.|"{hero_name}. Anything with writing on it today?"|"The Shrine's quiet. The quiet is the nice part."}
{ q_vale_first_page == 2: "You've found something. I can tell by the way you're holding your hands. Give it here." }
{ q_ch1_ember_in_the_fist == 3: "I've written to Reedholm about the shard. Twice. The second letter was mostly apologising for the first." }
{ frag_vale_count == 3: "The Vale's set is whole, as far as the barrows go. I've read it four times. It doesn't get kinder." }
-> ilse_topics

== ilse_greet_fallen ==
"You came up without {fallen_name}." She puts the board down. "The Shrine can raise them. Go in. I'll wait."
-> ilse_topics

== ilse_topics ==
+ { q_ch1_ember_in_the_fist == 2 } [He died holding this. #mark: quest ready] -> ilse_ch3_turnin
+ { q_vale_first_page == 2 } [I found this in the barrows. #mark: quest ready] -> ilse_page_turnin
+ { q_trial_last_rites == 2 } [The rites are said. #mark: quest ready] -> ilse_trial_turnin
+ { q_trial_last_rites == 0 } [Is there anything you'd teach a cleric? #mark: quest] -> ilse_trial_offer
+ { q_trial_last_rites == 1 } [About the rites… #mark: quest] -> ilse_trial_active
+ { q_vale_first_page == 0 } [Can I help with the Chronicle? #mark: quest] -> ilse_page_offer
+ { q_vale_first_page == 1 } [About the first page… #mark: quest] -> ilse_page_active
+ { frag_vale_count > 0 } [Read me the Chronicle.] -> ilse_read
+ [What are you writing?] -> ilse_writing
+ [What should I look for?] -> ilse_look
+ [I'll be going.] -> ilse_bye

// ── the cleric's trial (content/quests/trial_last_rites.json) ──
== ilse_trial_offer ==
"Nobody said the rites for the legion in the barrows. They were waiting to be relieved. You don't bury people who are waiting."
"I'd like a cleric of yours to go down to a hall on the second floor or below, and stand, and say them. The dead will object. Say them anyway, five waves long."
+ [We'll say them. #mark: quest]
    "Properly. Every word. I'll know if you skip one, and so will they." # quest: accept trial_last_rites
    -> ilse_topics
+ [Not yet.]
    "They've waited three hundred years. I've only waited since spring."
    -> ilse_topics

== ilse_trial_active ==
"A hall in the Old Barrows, the second floor or deeper. Five waves. The rites don't need to be loud. They need to be finished."
-> ilse_topics

== ilse_trial_turnin ==
Ilse writes a line, reads it twice, and puts the pen down.
"Then they're said. Here: the same words, turned round, for the living. We call it a blessing. It's the rites said forwards, which is the only direction that helps anybody." # quest: turnin trial_last_rites
-> ilse_topics

== ilse_writing ==
"The Chronicle. Anything the old empire left that still says something: orders, rolls, letters. One to three lines, usually. They didn't write for us."
"Put enough of them in order and they stop being scraps and start being a sentence. Then you find out whether you wanted to read it."
-> ilse_topics

== ilse_look ==
"Anything with a stamp or a name. The barrows' chests, the old shrines down there, and the halls at the foot of each stair. The dead kept their best things where they kept their best men."
"Don't guess what it says. Bring it to me. I'll guess properly."
-> ilse_topics

== ilse_page_offer ==
"You can bring me the first page. Anything from the barrows with the old stamp on it. Their chests are a start; the dead kept their papers the way they kept their spears, close."
"I'll pay in blessings, and a little in coin, because the Shrine insists you can't eat a blessing."
+ [I'll bring you something. #mark: quest]
    "Don't read it on the way. Well. Read it. Just don't guess." # quest: accept vale_first_page
    -> ilse_topics
+ [Not now.]
    "The barrows will keep. They've had practice."
    -> ilse_topics

== ilse_page_active ==
"Anything with a stamp. The chests on the first floor, the shrines deeper down, the hall at the foot of each stair. Bring the first thing you find."
-> ilse_topics

== ilse_page_turnin ==
Ilse takes it in both hands, tilts it to the light, and reads it twice without moving her lips.
"There. The Chronicle of the Vale has a first page. Every one after this is easier to find, and harder to read." # quest: turnin vale_first_page
-> ilse_topics

== ilse_read ==
{ frag_vale_standing_order == 1:
    "Standing order fourteen. The Third Legion holds the Wickham road until relieved. Stamped by the Throne, the year six hundred and twelve."
    "It isn't a story. It's an order. Orders don't end. They're relieved, or they aren't."
}
{ frag_vale_muster_roll == 1:
    "The muster roll: two hundred and forty bound, two hundred and forty present. There are never absences."
    "Somebody counted them every morning. Somebody living. I'd like to know what that was like, and I'd rather not."
}
{ frag_vale_centurion_tablet == 1:
    "The centurion's tablet. The bound dropped where they stood at the second watch. The living asked him what now. He told them to hold the road until relieved."
}
{ frag_vale_count == 3:
    Ilse puts the three side by side on the step, in order, and is quiet for a while.
    "They're not rising. They're still standing. The same order, the same road, three hundred years. Nobody ever came to relieve them."
    "I'll write it down. Then somebody ought to decide what relief would look like."
- else:
    "There's more of it down there. There always is. The Vale's set will have gaps until someone goes deeper."
}
-> ilse_topics

== ilse_bye ==
{&"Go carefully. Come back literate."|"Mind your feet on the stairs down there. They're older than they look."|Ilse has already bent back over the tablet.}
-> END

// ── Act I, chapter 3: An Ember in the Fist (content/quests/ch1_ember_in_the_fist.json) ──
== ilse_ch3_turnin ==
Ilse takes the shard in a cloth, not her hand. It glows faintly through the cloth, the colour of a coal just before it goes out.
"Warm. Three hundred years in the dark and it's warm." She turns it over. "There's a mark on the back. An imperial foundry mark. Fens work. Saltmere, or near it."
"The robed men weren't digging for gold. They were digging for this. Somebody wants the old fire back." She wraps it twice more. "I'm going to need to write to Reedholm. You're going to need to go south." # quest: turnin ch1_ember_in_the_fist
-> ilse_topics

