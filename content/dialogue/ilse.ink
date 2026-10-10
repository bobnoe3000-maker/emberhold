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
VAR q_ch2_fog_on_the_canal = -1
VAR q_ch2_the_last_office = -1
VAR q_trial_last_rites = -1
VAR frag_vale_count = 0
VAR frag_vale_standing_order = 0
VAR frag_vale_muster_roll = 0
VAR frag_vale_centurion_tablet = 0
VAR frag_vale_tithe_ledger = 0
VAR frag_vale_gate_warden_note = 0
VAR frag_vale_last_dispatch = 0
VAR frag_vale_chaplains_prayer = 0
VAR frag_vale_binding_rite = 0
VAR frag_vale_chaplains_last_page = 0
VAR frag_vale_standards_ribbon = 0
VAR frag_fens_count = 0
VAR frag_fens_lock_tally = 0
VAR frag_fens_canal_order = 0
VAR frag_fens_sluice_book = 0
VAR frag_fens_reed_stick = 0
VAR frag_fens_tithe_plate = 0
VAR frag_fens_vat_ledger = 0
VAR frag_fens_drain_order = 0
VAR frag_fens_novice_letter = 0
VAR frag_fens_day_book = 0
VAR frag_fens_last_hour = 0
VAR count_lamps = 0
VAR count_souls = 0

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
{ q_ch1_ember_in_the_fist == 3 && q_ch2_fog_on_the_canal < 1: "I've written to Reedholm about the shard. Twice. The second letter was mostly apologising for the first." }
{ q_ch2_fog_on_the_canal == 1: "Dace Pike, at the Drowned Eel in Saltmere. Give him my letter. He'll read it slowly. Let him." }
{ q_ch2_fog_on_the_canal == 3 && q_ch2_the_last_office < 2: "Reedholm writes that you're keeping Saltmere busy. Orla writes that you're keeping the Mother busy. I like Orla's letters better." }
{ q_ch2_the_last_office == 3: "I've copied the Abbey's ledger for Reedholm. I've kept the copy I made first. I'm still not a fool." }
{ frag_vale_count >= 3 && frag_vale_count < 10: "The Vale's set has more gaps than words. I've read what we have four times. It doesn't get kinder." }
{ frag_vale_count == 10: "The Vale's set is whole. All ten. I've copied it for Reedholm and kept the copy I made first, because I'm not a fool." }
-> ilse_topics

== ilse_greet_fallen ==
"You came up without {fallen_name}." She puts the board down. "The Shrine can raise them. Go in. I'll wait."
-> ilse_topics

== ilse_topics ==
+ { q_ch1_ember_in_the_fist == 2 } [The robed stranger in the chapel died holding this. #mark: quest ready] -> ilse_ch3_turnin
+ { q_ch2_the_last_office == 2 } [The Abbess Below is down. This was under the lamp. #mark: quest ready] -> ilse_ch2_turnin
+ { q_ch2_fog_on_the_canal == 0 } [What about the shard? #mark: quest] -> ilse_ch2_offer
+ { q_ch2_fog_on_the_canal == 1 } [About Saltmere… #mark: quest active] -> ilse_ch2_active
+ { q_vale_first_page == 2 } [I found this in the barrows. #mark: quest ready] -> ilse_page_turnin
+ { q_trial_last_rites == 2 } [The rites are said, in the barrows. #mark: quest ready] -> ilse_trial_turnin
+ { q_trial_last_rites == 0 } [Is there anything you'd teach a cleric? #mark: quest] -> ilse_trial_offer
+ { q_trial_last_rites == 1 } [About the rites… #mark: quest active] -> ilse_trial_active
+ { q_vale_first_page == 0 } [Can I help with the Chronicle? #mark: quest] -> ilse_page_offer
+ { q_vale_first_page == 1 } [About the first page… #mark: quest active] -> ilse_page_active
+ { frag_vale_count > 0 } [Read me the Chronicle.] -> ilse_read
+ { frag_fens_count > 0 } [Read me what we found in the Fens.] -> ilse_read_fens
+ { count_souls > 0 } [You keep a count?] -> ilse_count
+ [What are you writing?] -> ilse_writing
+ [What should I look for?] -> ilse_look
+ [I'll be going.] -> ilse_bye

// ── the cleric's trial (content/quests/trial_last_rites.json) ──
== ilse_trial_offer ==
"Nobody said the rites for the legion in the barrows. They were waiting to be relieved. You don't bury people who are waiting."
"I'd like a cleric of yours to go down into the Sunken Chapel, where the legion was bound, to the Nave's last hall, and stand, and say them. The dead will object. Say them anyway, five waves long."
+ [We'll say them. #mark: quest]
    "Properly. Every word. I'll know if you skip one, and so will they." # quest: accept trial_last_rites
    -> ilse_topics
+ [Not yet.]
    "They've waited three hundred years. I've only waited since spring."
    -> ilse_topics

== ilse_trial_active ==
"The Nave's last hall, in the Sunken Chapel, the first floor. Five waves. The rites don't need to be loud. They need to be finished."
-> ilse_topics

== ilse_trial_turnin ==
Ilse writes a line, reads it twice, and puts the pen down.
"Then they're said. Here: the same words, turned round, for the living. We call it a blessing. It's the rites said forwards, which is the only direction that helps anybody." # quest: turnin trial_last_rites
-> ilse_topics

== ilse_writing ==
"The Chronicle. Anything the old empire left that still says something: orders, rolls, letters. One to three lines, usually. They didn't write for us."
"Put enough of them in order and they stop being scraps and start being a sentence. Then you find out whether you wanted to read it."
-> ilse_topics

== ilse_count ==
"Of the freed. {count_souls} by my reckoning{count_lamps > 0:, and {count_lamps} {count_lamps == 1:lamp|lamps} broken}."
{ count_lamps == 0:
  "The bound you put down go free one at a time. A lamp lets them all go at once, if you can get at it. Its keeper won't let you."
- else:
  "A lamp is worse than the dead it keeps. Break one and every soul in it goes at once. You'll have felt the room go quiet."
}
"The empire kept a tally of everyone it bound. It seems fair to keep one of everyone let go. Nobody else will."
-> ilse_topics

== ilse_look ==
"Anything with a stamp or a name. The barrows' chests, the old shrines down there, and the halls by the stairs down. The dead kept their best things where they kept their best men."
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
"Anything with a stamp. The chests on the first floor, the shrines deeper down, the hall by each stair down. Bring the first thing you find."
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
{ frag_vale_count >= 3 && frag_vale_standing_order + frag_vale_muster_roll + frag_vale_centurion_tablet == 3:
    Ilse puts the three from the barrows side by side on the step, in order, and is quiet for a while.
    "They're not rising. They're still standing. The same order, the same road, three hundred years. Nobody ever came to relieve them."
}
{ frag_vale_tithe_ledger == 1:
    "The mill's tithe ledger. Grain, four hundred measures. Souls, two hundred and forty. Paid in full."
    "Two hundred and forty. The same as the muster roll. The Vale didn't send a legion. It paid one."
}
{ frag_vale_gate_warden_note == 1:
    "A gate-warden at the Keep: relief expected by the harvest moon. Keep the road open, keep the lamps lit."
    "So somebody was coming. Or somebody believed it, which at the Keep amounted to the same thing."
}
{ frag_vale_last_dispatch == 1:
    "The last dispatch. The Throne is dark. No relief will come. Stand down." She turns it over twice. "Sealed. Never sent."
    "They were told to stop, and the letter sat in a drawer. Garrow kept it with his ledgers. He kept everything."
}
{ frag_vale_chaplains_prayer == 1:
    "A chaplain's prayer from the chapel. Bind them gently. Most of them volunteered."
    "Most."
}
{ frag_vale_binding_rite == 1:
    "The binding rite. Speak the order last: the bound keep the last thing they hear."
    "That's how it held. Not magic, or not only. The last thing anybody said to them."
}
{ frag_vale_chaplains_last_page == 1:
    "The chaplain's last page. The Throne went dark. He couldn't bind a second order over the first. Forgive me."
    "He tried. The order to stand down came, and there was no way left to tell them."
}
{ frag_vale_standards_ribbon == 1:
    "The ribbon off their standard. Third Legion. Wickham road. Until relieved."
}
{
- frag_vale_count == 10:
    Ilse lays all ten out in a line along the Shrine's step, and reads them once more, aloud, to nobody in particular.
    "A tithe of souls. A legion bound to an order. The order to stand down, written and sealed and never sent, and no way left to give it."
    "A legion keeps a strongroom on its road. Theirs would be under the ninth milestone of the Wickham road, where the relief would have come in. If anything was left for them, it's there." She writes it down. "It's on your map now. I think somebody should go."
- frag_vale_count < 3:
    "There's more of it down there. There always is. The Vale's set will have gaps until someone goes deeper."
- else:
    "There are gaps still. The barrows, the Keep, the chapel. The old empire kept its papers where it kept its sins."
}
-> ilse_topics

// ── the Fens set (world doc §7 v1.30): she reads them as she reads the Vale's, in order ──
== ilse_read_fens ==
{ frag_fens_lock_tally == 1:
    "A lock-keeper's tally. Sixty lock-men on the Abbey's rolls, bound. They don't tire at the windlass. The Abbess says they don't mind it."
    "The Abbess says. Not the lock-men."
}
{ frag_fens_canal_order == 1:
    "A canal order. All barges clear of the Locks by the second watch: the Throne's tithe-boats have the canal tonight."
}
{ frag_fens_sluice_book == 1:
    "The sluice-book. Gates three and four untended since the second watch. The bound lock-men lying in the sluice. The water coming up the chapel steps."
    "The second watch again. The same hour the legion dropped on the Wickham road. The same night."
}
{ frag_fens_reed_stick == 1:
    "A reed-cutter's tally-stick. Four boats off the flood, the night the water came, nobody aboard. One with a lamp in the bow, still lit."
}
{ frag_fens_tithe_plate == 1:
    "A plate off a boat. Tithe-boat Ninth, the Drowned Abbey to the Ember Throne. Cargo: lamps, forty."
    "Forty lamps. Not grain. Not coin. They shipped the dead up the canal by the boatload."
}
{ frag_fens_vat_ledger == 1:
    "The vat-master's ledger. Vat seven: forty bound, steeped. The Abbey's lamps want filling by the new moon."
}
{ frag_fens_drain_order == 1:
    "The drain order. If the gates fail, open the vats to the canal. Better drowned than loose."
    "That's why the Fens are what they are. Somebody did as they were told."
}
{ frag_fens_novice_letter == 1:
    "A novice's letter to her mother. They let her write the names. Most of them volunteered. She asked about the rest, and was given more names to write."
    She reads that one twice, and then doesn't say anything for a while.
}
{ frag_fens_day_book == 1:
    "The Abbess's day-book. The Throne is dark. The bound won't lie down without the order, and there's nobody left to give it. We will keep the hours."
}
{ frag_fens_last_hour == 1:
    "The last of it, off the Abbess herself. We kept the hours. The water kept us."
}
{
- frag_fens_count == 10:
    Ilse lays the ten from the Fens beside the ten from the Vale, and the two lines are the same length.
    "The same night. The Throne went dark at the second watch, and everything it had bound stopped where it stood, and nobody was left to tell it to lie down. The Vale held its road. The Fens kept their hours."
    "And my order wrote the names." She doesn't look up. "The rolls were copied out fair at Reedholm, in the Undercroft. Mother Agnes has the key. She's had it forty years. Ask her. Tell her I sent you, and that I'm sorry."
- else:
    "There are gaps. The Locks, the Mound, the vats, the Abbey. The Fens kept their papers wet, but they kept them."
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

// ── Act II, chapter 1: Fog on the Canal (content/quests/ch2_fog_on_the_canal.json): to Dace Pike in Saltmere ──
== ilse_ch2_offer ==
"The shard." She has it out of the cloth before you've finished, which she never does. "I can't read the foundry mark. I've tried. I've tried twice, and then a third time, which is a sin at Reedholm."
"But the robed men's boats come up from the Fens, and the Sisters at Saltmere write to me about them, and they're frightened, and Sisters don't frighten."
"There's a man at the Drowned Eel in Saltmere, Dace Pike. He writes down what everybody owes. If somebody's paying for boats, he'll have it in a column somewhere."
+ [We'll go south. #mark: quest]
    She writes a letter, reads it twice, and gives it to you folded small. "Give him this. He'll read it with his finger. Be patient. He's the only man in Saltmere who reads at all." # quest: accept ch2_fog_on_the_canal
    "The canal road leaves the Vale at its south edge, past the barrows. Saltmere's a day. You'll smell it before you see it."
    -> ilse_topics
+ [Not yet.]
    "No. Not yet. It's kept three hundred years." She wraps it again. "I'd still rather it didn't keep much longer."
    -> ilse_topics

== ilse_ch2_active ==
"Saltmere: the canal road south, a day. Dace Pike, at the Drowned Eel. Give him my letter, and let him read it slowly."
-> ilse_topics

// ── Act II, chapter 6: The Last Office (content/quests/ch2_the_last_office.json, given by Mother Agnes) ──
== ilse_ch2_turnin ==
Ilse takes the ledger from you with both hands. The water's got into it, and she turns each page as if it were skin.
She reads it once, and puts it down, and reads it again, with the shard beside it on the cloth.
"They weren't raising the dead. Nobody ever was. They were mining them: the bound in the vats, the sisters in the lamp, a soul to a cage. Weighed out like ore." She puts a finger on the last column. "And sold. Every shipment, to the same mark."
"Scales and a pick. The Kell Assay. Up in the Reach, at the Cinderworks." # quest: turnin ch2_the_last_office
"I'm going to write to Reedholm. Then I'm going to sit here for a while, and not write anything. Then you're going to need to go to the Reach."
-> ilse_topics

