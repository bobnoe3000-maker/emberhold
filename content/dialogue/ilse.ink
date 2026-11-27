// ilse.ink — Sister Ilse, a Grey Sister archivist at the Shrine of the Ember in Thornwick (world doc
// §5, §7, v1.6): sent up from Reedholm to copy whatever comes out of the barrows; keeps the
// Chronicle; trusts nothing she hasn't read twice. Entry: ilse_hub. Bound in by src/story/adapter.js
// from the sim (sim/npcs.js varsFor); Ink only reads them (flags: met_ilse; her errand,
// vale_first_page: q_ = −1 locked · 0 available · 1 active · 2 ready · 3 done; the Vale's fragments,
// sim/lore.js: frag_<id> 0 / 1 and frag_vale_count). She reads the set in order (world doc §7). (v1.74) And the
// Tidemark's twelve, the Lady Aurelle's letters to Livia (frag_tide_*, frag_tidemark_count), in ilse_read_tide.

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
VAR q_ch1_the_standard = -1
VAR boss_standard = 0
VAR q_ch2_fog_on_the_canal = -1
VAR q_ch2_the_last_office = -1
VAR q_ch3_the_wickham_road = -1
VAR chapters_done = 0
VAR q_ch4_consigned = -1
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
VAR frag_reach_count = 0
VAR frag_reach_charter_roll = 0
VAR frag_reach_lamp_tally = 0
VAR frag_reach_chute_plate = 0
VAR frag_reach_weigh_ticket = 0
VAR frag_reach_quota_order = 0
VAR frag_reach_throne_weight = 0
VAR frag_reach_binding_of_oruth = 0
VAR frag_reach_pattern_shelf = 0
VAR frag_reach_apron_plate = 0
VAR frag_reach_night_rota = 0
VAR frag_reach_vanes_ledger = 0
VAR frag_reach_renewal = 0
VAR frag_tidemark_count = 0
VAR frag_tide_first_letter = 0
VAR frag_tide_the_harbour = 0
VAR frag_tide_the_wedding = 0
VAR frag_tide_the_toll = 0
VAR frag_tide_the_ship = 0
VAR frag_tide_the_lamps = 0
VAR frag_tide_the_children = 0
VAR frag_tide_the_commission = 0
VAR frag_tide_the_chapel = 0
VAR frag_tide_the_voices = 0
VAR frag_tide_the_box = 0
VAR frag_tide_take_the_grace = 0
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
{ q_ch1_the_standard == 1: "The Binding Crypt, under the chapel. The standard with the lamp on it. Break the lamp, and they can all lie down." }
{ q_ch1_the_standard == 3 && q_ch2_fog_on_the_canal < 1: "I've written to Reedholm about the shard. Twice. The second letter was mostly apologising for the first." }
{ q_ch2_fog_on_the_canal == 1: "Dace Pike, at the Drowned Eel in Saltmere. Give him my letter. He'll read it slowly. Let him." }
{ q_ch2_fog_on_the_canal == 3 && q_ch2_the_last_office < 2: "Reedholm writes that you're keeping Saltmere busy. Orla writes that you're keeping the Mother busy. I like Orla's letters better." }
{ q_ch2_the_last_office == 3 && q_ch3_the_wickham_road < 1: "I've copied the Abbey's ledger for Reedholm. I've kept the copy I made first. I'm still not a fool." }
{ q_ch3_the_wickham_road == 1: "The Wickham road, north, over the range. Dagny Coalbrook, in Ashgate. Give her my letter. She won't read it slowly. She'll read it standing up." }
{ q_ch3_the_wickham_road == 3 && chapters_done < 16: "Dagny writes. Four lines, every week, all of them about the Assay. I've started to look forward to them, which worries me." }
{ chapters_done >= 16 && q_ch4_consigned < 1: "Dagny sent me Vane's ledger, wrapped in oilcloth, with four words: *You'll want the end.* She was right. I do." }
{ q_ch4_consigned == 1: "Tollhaven, in the Tidemark. Hester Quaile, at the Paid Toll. Show her the page, and don't let her charge you for reading it." }
{ q_ch4_consigned == 3: "Hester Quaile writes to me now. Her letters come with the postage owing. I pay it. They're worth it." }
{ frag_vale_count >= 3 && frag_vale_count < 10: "The Vale's set has more gaps than words. I've read what we have four times. It doesn't get kinder." }
{ frag_vale_count == 10: "The Vale's set is whole. All ten. I've copied it for Reedholm and kept the copy I made first, because I'm not a fool." }
-> ilse_topics

== ilse_greet_fallen ==
"You came up without {fallen_name}." She puts the board down. "The Shrine can raise them. Go in. I'll wait."
-> ilse_topics

== ilse_topics ==
+ { q_ch1_ember_in_the_fist == 2 } [The robed stranger in the chapel died holding this. #mark: quest ready] -> ilse_ch3_turnin
+ { q_ch1_the_standard == 2 } [The Standard's down. Its lamp broke. #mark: quest ready] -> ilse_ch4_turnin
+ { q_ch1_the_standard == 0 } [What is the shard? #mark: quest] -> ilse_ch4_offer
+ { q_ch1_the_standard == 1 } [About the Standard… #mark: quest active] -> ilse_ch4_active
+ { q_ch2_the_last_office == 2 } [The Abbess Below is down. This was under the lamp. #mark: quest ready] -> ilse_ch2_turnin
+ { q_ch2_fog_on_the_canal == 0 } [What about the shard? #mark: quest] -> ilse_ch2_offer
+ { q_ch2_fog_on_the_canal == 1 } [About Saltmere… #mark: quest active] -> ilse_ch2_active
+ { q_ch3_the_wickham_road == 0 } [Where is the Kell Assay? #mark: quest] -> ilse_ch3_road_offer
+ { q_ch3_the_wickham_road == 1 } [About Ashgate… #mark: quest active] -> ilse_ch3_road_active
+ { q_ch4_consigned == 0 } [Where did the vessel go? #mark: quest] -> ilse_ch4_consigned_offer
+ { q_ch4_consigned == 1 } [About Tollhaven… #mark: quest active] -> ilse_ch4_consigned_active
+ { q_vale_first_page == 2 } [I found this in the barrows. #mark: quest ready] -> ilse_page_turnin
+ { q_trial_last_rites == 2 } [The Haddows' names are said. #mark: quest ready] -> ilse_trial_turnin
+ { q_trial_last_rites == 0 } [Is there anything you'd teach a cleric? #mark: quest] -> ilse_trial_offer
+ { q_trial_last_rites == 1 } [About the rites… #mark: quest active] -> ilse_trial_active
+ { q_vale_first_page == 0 } [Can I help with the Chronicle? #mark: quest] -> ilse_page_offer
+ { q_vale_first_page == 1 } [About the first page… #mark: quest active] -> ilse_page_active
+ { frag_vale_count > 0 } [Read me the Chronicle.] -> ilse_read
+ { frag_fens_count > 0 } [Read me what we found in the Fens.] -> ilse_read_fens
+ { frag_reach_count > 0 } [Read me what we found in the Reach.] -> ilse_read_reach
+ { frag_tidemark_count > 0 } [Read me the letters from the Tidemark.] -> ilse_read_tide
+ { count_souls > 0 } [You keep a count?] -> ilse_count
+ [What are you writing?] -> ilse_writing
+ [What should I look for?] -> ilse_look
+ [I'll be going.] -> ilse_bye

// ── the cleric's trial (content/quests/trial_last_rites.json) ──
== ilse_trial_offer ==
"The Haddows paid a priest to say their names once a year, in the little chapel under their chantry. The money ran out before the names did."
"Send a cleric of yours down into the Haddow Crypt and have every name said, five waves long. The family got up when the priest stopped coming. They'll want to check you have the list right."
+ [We'll say them. #mark: quest]
    "Properly. Every word. I'll know if you skip one, and so will they." # quest: accept trial_last_rites
    -> ilse_topics
+ [Not yet.]
    "Then the list goes back in the drawer. It's a long list. Wool paid well."
    -> ilse_topics

== ilse_trial_active ==
"The Haddow Crypt, under the chantry east of the lumber camp. Five waves, anywhere below. The rites don't need to be loud. They need to be finished."
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

// ── the Reach set (world doc v1.54 §7): the charter, the quota, the forge, the furnace ──
== ilse_read_reach ==
{ frag_reach_charter_roll == 1:
    "The clans' charter. The seams of the Reach, to work and hold; ore to the Throne's foundries at the agreed weight. What the foundries burn is the Throne's business."
    "Business. That's the word they chose."
}
{ frag_reach_lamp_tally == 1:
    "A lamp tally from the Seam. Two hundred out, two hundred in. The night shift not entered on the clans' rolls: the night shift is the foundry's."
}
{ frag_reach_chute_plate == 1:
    "A chute plate. Ore by the upper road; cargo by night, by the lower. The clans to keep off the lower road."
}
{ frag_reach_weigh_ticket == 1:
    "A weigh-ticket. Pale iron, forty hundredweight, assayed true. Fuel for the melt: see the quota office."
}
{ frag_reach_quota_order == 1:
    "The quota order. Furnaces one to twelve, four thousand souls this year. The clans' charter renewed if the quota is met."
    She puts the pen down for that one.
}
{ frag_reach_throne_weight == 1:
    "A weight. One soul, Throne measure." She lifts it, and sets it down again. "It's heavier than it should be. I keep picking it up to check."
}
{ frag_reach_binding_of_oruth == 1:
    "Oruth's binding. Bound at his anvil by his own leave, to work until countermanded. His clan to be told he went to the Throne."
}
{ frag_reach_pattern_shelf == 1:
    "The pattern shelf. Lamp patterns, forty to a shelf, each to hold one. The Forgemaster signed every casting."
    "So the Fens' lamps were cast here. Every one. The Abbey just filled them."
}
{ frag_reach_apron_plate == 1:
    "Oruth's apron-plate. Bound to the work, until countermanded. Nobody ever countermanded anything. That's the whole Chronicle, in one line."
}
{ frag_reach_night_rota == 1:
    "The night rota. Furnace Nine: night shift eleven, day shift none. The furnace doesn't want a day shift."
}
{ frag_reach_vanes_ledger == 1:
    "Furnace nine requires eleven more souls per week to meet quota. Copied out fair, and under it, in a newer hand: as before."
    "He read the Throne's books and did what they said. That's all he did. That's what I can't forgive."
}
{ frag_reach_renewal == 1:
    "The last of it, off the Stoker. The charter renewed for another hundred years. The Deepdelvers did not ask what the furnaces burn. We did not tell them."
}
{
- frag_reach_count == 12:
    Ilse lays the Reach's twelve under the Fens' ten and the Vale's ten. Three lines now. The last is the longest.
    "The Vale's dead were tithed. The Fens' were steeped and shipped up the canal in lamps. And the lamps were cast in the Reach, and filled by quota, and the clans held the charter and never asked."
    "The quota office kept a strongroom: the Ninth Vault, up the old track on the dead mountain. The books will be there. Read them for me. I'm not sure I can."
- else:
    "There are gaps. The Seam, the Yards, the Forgehall, the Cinderworks. The Reach kept its papers dry. It would."
}
-> ilse_topics

// ── the Tidemark set (world doc v1.74 §7): the Lady Aurelle's letters to her sister Livia, her side only. She reads
// them in order, as letters, and won't say what the last one means: that's the Glass Keep's, Act VI ──
== ilse_read_tide ==
{ frag_tide_first_letter == 1:
    "A girl's letter to her sister. Her father let her hold the Canticle: only a scroll, she says, and it weighs more than one. She's to go to the Beacon in the spring and learn it. Her sister gets her room, and the window that sticks."
    "There's no name at the foot. An A. I'm not going to guess which A. Guessing is how the old histories got written."
}
{ frag_tide_the_harbour == 1:
    "Her first order, sung from the lamp-stand at the end of the outer mole. Make fast. Every ship in the harbour made fast at once, and nobody aboard looked up."
    "So she was a Voice, and young. I've been writing Voices in my notes as if they were offices. They were people. I'll correct the notes."
}
{ frag_tide_the_wedding == 1:
    "Livia's to marry in Highmarch, a man whose tower looks at the sea. Her sister isn't let to come. Wear Mother's pearls; be kind to his steward, Varro, who counts the spoons."
    She writes the steward's name in the margin and underlines it. "That's a Highmarch name still."
}
{ frag_tide_the_toll == 1:
    "How the fleet was crewed. The coast paid its tithe at the harbour mouth, a crew in every ten ships, written into the Harbourmaster's book. She sang to them after. Don't ask me again in a letter."
    "In a letter. So Livia asked her to her face, later, and whatever she was told, nobody wrote it down."
}
{ frag_tide_the_ship == 1:
    "The new flagship, named for her: Aurelle's Grace. She asked for a smaller ship and a plainer name, and was told an Empress doesn't ask."
    Ilse puts the pen down, and picks it up again. "Then it's that A. The Empress Aurelle, writing to her sister about cabins."
}
{ frag_tide_the_lamps == 1:
    "She asked the Admiralty for a living crew for the Grace. The bound were cheaper, and kept their stations as long as the stern-lantern was lit, and the lantern as long as the Throne was. As long as. She asked again."
}
{ frag_tide_the_children == 1:
    "Hammocks on the Grace, twenty, small. Livia had two children. The others' names were on a roll that spring, and weren't by the summer."
    "She doesn't say which roll. She doesn't need to."
}
{ frag_tide_the_commission == 1:
    "The Grace's master's commission, in her own hand: to carry the Lady Livia and whoever she brings wherever she says, and answer no other order. Not the Admiralty's, not a Voice's, and not hers, after."
    "After what, she doesn't say. I've noticed she stops saying things at about this point in every letter."
}
{ frag_tide_the_chapel == 1:
    "A chapel at the Beacon's foot, with one stand in it. She went down at night and said the last verse to herself, without the voice. Everyone who learns the Canticle learns the last verse, she says. Nobody sings it."
    "And then: do not worry. I've copied that line out three times. It doesn't get more convincing."
}
{ frag_tide_the_voices == 1:
    "Six Voices at the Beacon's table, singing the empire's orders and agreeing about everything. The other five had stopped hearing the bound. She still did. The harbour again, every night."
}
{ frag_tide_the_box == 1:
    "The box. Cedar bound in pale iron, made for her chapel, with the scroll in it. Inside the lid: never open it. Whoever reads that will have opened it already, she says. She could think of nothing better."
    "Neither can I. I've tried. It's a very short list, the things that work on people."
}
{ frag_tide_take_the_grace == 1:
    "The last of them. When the Beacon goes dark, don't wait for word, there won't be any. Take the Grace. Take the children. Take the box from my chapel, and never open it."
}
{
- frag_tidemark_count == 12:
    Ilse lays the twelve letters under the rest of the Chronicle, and they don't line up with anything above them. They aren't orders or tallies. They're one side of a conversation between sisters.
    "When the Beacon goes dark, she says, as if she'd been told the day. I'm not going to say what I think that means until I've read something that says it for me."
    "The Grace went onto the reef below the Lamp Fort the night the Throne went dark, children and all. The box came ashore. Nothing else did. The wreck's still on her reef, and Tollhaven's boats give her a wide berth and call her the Sister's Cabin."
    "At low water there's a way up her side. Bring me her manifest, if it's there. I'd like those twenty written down somewhere that isn't a roll."
- else:
    "There are gaps. The Mole, the Isles, Highmarch. Her sister kept every letter, by the look of it, and the sea had the rest."
}
-> ilse_topics

== ilse_bye ==
{&"Go carefully. Come back literate."|"Mind your feet on the stairs down there. They're older than they look."|Ilse has already bent back over the tablet.}
-> END

// ── Act I, chapter 3: An Ember in the Fist (content/quests/ch1_ember_in_the_fist.json) ──
== ilse_ch3_turnin ==
Ilse takes the shard in a cloth, not her hand. It glows faintly through the cloth, the colour of a coal just before it goes out.
"Warm. Three hundred years in the dark and it's warm." She turns it over. "There's a mark on the back. An imperial foundry mark. Fens work. Saltmere, or near it."
"The robed men weren't digging for gold. They were digging for this. Somebody wants the old fire back." She wraps it twice more. "Leave it with me tonight. I know what it is. I want to be wrong about where it came from." # quest: turnin ch1_ember_in_the_fist
-> ilse_topics

// ── Act I, chapter 4: The Standard (content/quests/ch1_the_standard.json; world doc v1.33 §6) ──
== ilse_ch4_offer ==
"I wasn't wrong." She has the shard on the cloth, and a roll of the order's open beside it, held flat with a cup. "It's a spark. You cut one out of one of the bound, like flint out of a stone. It holds a little of the fire, enough to light a lamp by. And near the bound, it stirs them."
"The Third Legion was bound under that chapel, where it stood. The robed men dug down to it and cut sparks out of it, and every spark they carried past the barrows on the road woke the rest. That's why the barrows opened this spring. Nobody called a muster. Somebody walked past with a pocketful of them."
"Their standard's still down there, in the Binding Crypt, with the legion's lamp on it. It's dark. A dark lamp breaks like old iron. Break it, and every one of them goes free at once, and lies down wherever they're standing. The road with them."
+ [We'll break it. #mark: quest]
    "The second floor. The bound stand in rows down there, the way they were stopped. Don't wake more of them than you have to. And bring me back what you can of the lamp. I'd like to know who cast it." # quest: accept ch1_the_standard
    { boss_standard == 1: "You've already been down. Then it's done, and you can tell me about it now." }
    -> ilse_topics
+ [Not yet.]
    "No. They've stood three hundred years. One more week won't hurt them. It's us it hurts."
    -> ilse_topics

== ilse_ch4_active ==
"The Binding Crypt, the Sunken Chapel's second floor. The standard with the lamp on it. Break the lamp, and they lie down."
-> ilse_topics

== ilse_ch4_turnin ==
You tell her about the crypt: the rows, the lamp, the sound it made, and how they went down all at once, like a field when the wind drops.
She writes for a long time without looking up. "They were waiting to be relieved. Somebody finally came." She puts the pen down. "Col took the barrows road this morning, Maudry says. All four wheels."
"The first part of anything is finding out it's worse than you thought. That was ours." # quest: turnin ch1_the_standard
"Now. The shard, and where it was made." She turns it over to the foundry mark. "That's for later. For tonight, sit down. You look like you've been standing three hundred years yourself."
-> ilse_topics

// ── Act II, chapter 1: Fog on the Canal (content/quests/ch2_fog_on_the_canal.json): to Dace Pike in Saltmere ──
== ilse_ch2_offer ==
"The shard." She has it out of the cloth before you've finished, which she never does. "I can't read the foundry mark. I've tried. I've tried twice, and then a third time, which is a sin at Reedholm."
"But the robed men's boats come up from the Fens, and the Sisters at Saltmere write to me about them, and they're frightened, and Sisters don't frighten."
"There's a man at the Drowned Eel in Saltmere, Dace Pike. He writes down what everybody owes. If somebody's paying for boats, he'll have it in a column somewhere."
+ [We'll go to Saltmere. #mark: quest]
    She writes a letter, reads it twice, and gives it to you folded small. "Give him this. He'll read it with his finger. Be patient. He's the only man in Saltmere who reads at all." # quest: accept ch2_fog_on_the_canal
    "The canal road leaves the Vale at its north-east corner, past the old milestone. Saltmere's a day's walk, most of it wet."
    -> ilse_topics
+ [Not yet.]
    "No. Not yet. It's kept three hundred years." She wraps it again. "I'd still rather it didn't keep much longer."
    -> ilse_topics

== ilse_ch2_active ==
"Saltmere's a day up the canal road, north-east past the milestone. Dace Pike, at the Drowned Eel. Give him my letter, and let him read it slowly."
-> ilse_topics

// ── Act II, chapter 6: The Last Office (content/quests/ch2_the_last_office.json, given by Mother Agnes) ──
== ilse_ch2_turnin ==
Ilse takes the ledger from you with both hands. The water's got into it, and she turns each page as if it were skin.
She reads it once, and puts it down, and reads it again, with the shard beside it on the cloth.
"They weren't raising the dead. Nobody ever was. They were mining them: the bound in the vats, the sisters in the lamp, a soul to a cage. Weighed out like ore." She puts a finger on the last column. "And sold. Every shipment, to the same mark."
"Scales and a pick. The Kell Assay. Up in the Reach, at the Cinderworks." # quest: turnin ch2_the_last_office
"I'm going to write to Reedholm. Then I'm going to sit here for a while, and not write anything. Then you're going to need to go to the Reach."
-> ilse_topics

// ── Act III, chapter 1: The Wickham Road (content/quests/ch3_the_wickham_road.json): north to Ashgate, to the
//    Charter-Reeve, who takes it in ──
== ilse_ch3_road_offer ==
Ilse has the ledger open at the last page, and a map of the Provinces under it that she has plainly been arguing with.
"The Kell Assay. An assay house: they weigh ore and tell you what it's worth, and take a share for telling you. Their yards are at Kell's Rest, in the Cinder Reach. North, over the range, by the Wickham road."
"I wrote to Ashgate. The Deepdelvers hold it by charter, so it has a Charter-Reeve, and the Charter-Reeve is a Dagny Coalbrook. She answered in four words." Ilse turns the letter round. It says: *Send someone who fights.*
+ [We'll go north. #mark: quest]
    She writes a second letter, reads it twice, and folds a tracing of the mark inside it, scales over a pick. "Give her this. Then do what she says. I suspect everyone does." # quest: accept ch3_the_wickham_road
    "The Wickham road leaves the Vale at its north edge, past the Keep, and climbs. Ashgate's on the far side. You'll know it by the wheel over the gate."
    -> ilse_topics
+ [Not yet.]
    "No. The Reach has been black for three hundred years. It can stay black a while longer." She looks at the letter. "Four words. I've never had a letter that worried me more per word."
    -> ilse_topics

== ilse_ch3_road_active ==
"The Wickham road, north past the Keep and over the range. Ashgate, the wheel over the gate. Dagny Coalbrook, the Charter-Reeve. My letter, and the mark."
-> ilse_topics

// ── Act IV, chapter 1: Consigned (content/quests/ch4_consigned.json): east to Tollhaven, to its harbourmistress, who
//    takes it in (docs/tidemark-plan.md "The story") ──
== ilse_ch4_consigned_offer ==
"'Go' is generous. It was sent. There's a difference, and it's on the last page."
Ilse has Morrow Vane's ledger open on her board at the back, where something has been pasted in over the binding.
"You'd call it his ledger. It isn't, quite: a ledger balances, and this only ever adds. And the last page is something else again. It's a consignment note."
"One crate, pale iron, Throne measure. Consigned by the Solmere road to Brine Cross. Freight paid at Tollhaven." She turns the board round. "The hand isn't Vane's. It's a clerk's, and someone at the other end signed for it."
"Brine Cross is the bridge on the Highmarch road, in the Tidemark. Tollhaven is the Tidemark's port, and its harbourmistress is the Speaker of the League, a Hester Quaile. I wrote to her. She answered by return, with the postage owing."
+ [We'll go to Tollhaven. #mark: quest]
    She copies the last page out and gives you the copy, not the page. "Show her that. Ask her who paid, and what for." # quest: accept ch4_consigned
    "Out of the Reach by the Solmere road. Don't stop in Solmere. Take the Tidemark's road on through it, over the bridge at Brine Cross, and east along the coast. Tollhaven is the one with a chain across its harbour."
    -> ilse_topics
+ [Not yet.]
    She closes the ledger with a thumb in the last page. "It was a day ahead of us in the Reach. I'd rather it didn't get to be a season ahead."
    -> ilse_topics

== ilse_ch4_consigned_active ==
"The Solmere road out of the Reach, on through Solmere, over the bridge at Brine Cross and east to Tollhaven. Hester Quaile, at the Paid Toll. My copy of the last page."
-> ilse_topics
