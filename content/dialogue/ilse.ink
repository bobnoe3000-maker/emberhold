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
{ frag_vale_count == 3: "The Vale's set is whole, as far as the barrows go. I've read it four times. It doesn't get kinder." }
-> ilse_topics

== ilse_greet_fallen ==
"You came up without {fallen_name}." She puts the board down. "The Shrine can raise them. Go in. I'll wait."
-> ilse_topics

== ilse_topics ==
+ { q_vale_first_page == 2 } [I found this in the barrows. #mark: quest ready] -> ilse_page_turnin
+ { q_vale_first_page == 0 } [Can I help with the Chronicle? #mark: quest] -> ilse_page_offer
+ { q_vale_first_page == 1 } [About the first page… #mark: quest] -> ilse_page_active
+ { frag_vale_count > 0 } [Read me the Chronicle.] -> ilse_read
+ [What are you writing?] -> ilse_writing
+ [What should I look for?] -> ilse_look
+ [I'll be going.] -> ilse_bye

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
