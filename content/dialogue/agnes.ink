// agnes.ink — Mother Agnes, prioress of Reedholm (world doc §3.2, v1.29): come down to Saltmere's chapel while the
// Abbey's bells ring, staying until it's quiet. She'd rather the rolls stayed shut, and says so. Entry: agnes_hub.
// Bound in by src/story/adapter.js from the sim (sim/npcs.js varsFor; quests.js: q_ = −1 locked · 0 available ·
// 1 active · 2 ready · 3 done). Flags: met_agnes. Act II, chapters 5 (she takes the Rolls in) and 6 (the Last
// Office, handed in to Sister Ilse in Thornwick).

VAR hero_name = ""
VAR hero_class = ""
VAR hero_origin = ""
VAR hero_level = 1
VAR party_size = 1
VAR fallen_name = ""
VAR day_part = 0
VAR flag_met_agnes = 0
VAR q_ch2_the_rolls = -1
VAR q_ch2_the_last_office = -1

== agnes_hub ==
{ flag_met_agnes == 0: -> agnes_first_meet }
-> agnes_greet_back

== agnes_first_meet ==
An old Grey Sister sits in the chapel's one good chair with her hands folded on a stick. She looks at you the way a ledger looks at a sum.
"Mother Agnes, of Reedholm. I've come down while the bells ring. When they stop, I go home." # flag: set met_agnes
"Orla will have told you about the rolls. Orla tells everyone about the rolls. Some things are kept shut because they were opened once already."
-> agnes_topics

== agnes_greet_back ==
{&Agnes doesn't get up. She nods at the bench.|"{hero_name}. Sit, if you're stopping. Stand, if you're going."|Agnes is reading by the window, with the page held a long way from her face.}
{ q_ch2_the_last_office == 1: "The chapter-house, under the Choir. She rings the bells, and the water comes when she does. Keep your feet dry and your head down." }
{ q_ch2_the_last_office >= 2: "It's quiet. Listen. Three hundred years, and it's quiet." }
-> agnes_topics

== agnes_topics ==
+ { q_ch2_the_rolls == 2 } [We brought up what's left of the rolls. #mark: quest ready] -> agnes_rolls_turnin
+ { q_ch2_the_last_office == 0 } [What do the rolls say? #mark: quest] -> agnes_office_offer
+ { q_ch2_the_last_office == 1 } [About the Abbess… #mark: quest active] -> agnes_office_active
+ [Why keep the rolls shut?] -> agnes_shut
+ [I'll be going.] -> agnes_bye

// ── The Rolls (content/quests/ch2_the_rolls.json, given by Orla) ──
== agnes_rolls_turnin ==
You set the rolls on the table: what's left of them, swollen, the wax run and set again. Agnes doesn't touch them for a long moment.
"I asked Orla not to send you. I see she didn't listen. She never has." # quest: turnin ch2_the_rolls
She unties the first one, and reads it standing up, and then she sits down to read the rest.
-> agnes_topics

// ── The Last Office (content/quests/ch2_the_last_office.json): handed in to Sister Ilse ──
== agnes_office_offer ==
"Three hundred and twelve professed. The whole Abbey, every sister who took the vows there, written at the bottom of the last roll. In the Abbess's own hand."
"And beside it, a lamp's mark. She didn't drown with them. She kept them. In the choir-lamp, in the chapter-house, under the Choir, trimmed every night like a sanctuary light."
"And now the Cult comes for the harvest, and she lets them, because the lamp has to be fed, and she's been feeding it three hundred years." Agnes grips the stick. "Let them go. I'd say it more kindly if I knew how."
+ [We'll let them go. #mark: quest]
    "The chapter-house is the third floor's hall. When she rings the bells, the water comes in from the walls, a little further each time. The dead don't mind it. You will." # quest: accept ch2_the_last_office
    "There'll be a ledger under the lamp. There's always a ledger. Take it to Ilse in Thornwick. She reads things twice. I could only bear to read this once."
    -> agnes_topics
+ [Not yet.]
    "They've waited three hundred years. I'd rather they hadn't. Go when you're ready, and not before."
    -> agnes_topics

== agnes_office_active ==
"The Drowned Abbey, the third floor's hall: the chapter-house. Stay out of the water when the bells ring. Break the lamp. Bring Ilse the ledger."
-> agnes_topics

== agnes_shut ==
"Because the last time somebody read them carefully, they built an empire on them." She closes her eyes. "Orla thinks shame is a reason to open a book. It's a reason to read it once and sit with it. She hasn't learned the second part."
-> agnes_topics

== agnes_bye ==
{&"Go carefully."|Agnes lifts two fingers off the stick, which is a blessing if you want it to be.|"Tell Orla I'm not angry. Tell her quietly, so she believes it."}
-> END
