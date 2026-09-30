// ilse.ink — Sister Ilse, a Grey Sister archivist at the Shrine of the Ember in Thornwick (world doc
// §5, §7, v1.6): sent up from Reedholm to copy whatever comes out of the barrows; keeps the
// Chronicle; trusts nothing she hasn't read twice. Entry: ilse_hub. Bound in by src/story/adapter.js
// from the sim (sim/npcs.js varsFor); Ink only reads them (flags: met_ilse).

VAR hero_name = ""
VAR hero_class = ""
VAR hero_origin = ""
VAR hero_level = 1
VAR party_size = 1
VAR fallen_name = ""
VAR day_part = 0
VAR flag_met_ilse = 0

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
-> ilse_topics

== ilse_greet_fallen ==
"You came up without {fallen_name}." She puts the board down. "The Shrine can raise them. Go in. I'll wait."
-> ilse_topics

== ilse_topics ==
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

== ilse_bye ==
{&"Go carefully. Come back literate."|"Mind your feet on the stairs down there. They're older than they look."|Ilse has already bent back over the tablet.}
-> END
