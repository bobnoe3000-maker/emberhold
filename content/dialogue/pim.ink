// pim.ink — Pim Rushlight, a fen-folk chandler who sells lamp oil off a handcart by Saltmere's cistern, cheaper than
// Wendel, and wants Wendel told; he moves the cart when the Sisters look at him (world doc §3.2, v1.29). He started
// the rumour about the eels. Entry: pim_hub. Bound in by src/story/adapter.js from the sim (sim/npcs.js varsFor;
// quests.js: q_ = −1 locked · 0 available · 1 active · 2 ready · 3 done). Flags: met_pim. Act II, chapter 3.

VAR hero_name = ""
VAR hero_class = ""
VAR hero_origin = ""
VAR hero_level = 1
VAR party_size = 1
VAR fallen_name = ""
VAR day_part = 0
VAR flag_met_pim = 0
VAR q_ch2_the_sickpools = -1
VAR q_trial_lamp_oil = -1

== pim_hub ==
{ flag_met_pim == 0: -> pim_first_meet }
-> pim_greet_back

== pim_first_meet ==
A thin man with oil to the elbows leans on a handcart full of stoppered jars. He has the cart's handles in both hands, ready to go, though nobody's asked him to.
"Pim Rushlight. Lamp oil, wick, tallow, a good pitch for boats. Cheaper than anything up the road in Thornwick. You can tell Wendel I said so. Please tell Wendel I said so." # flag: set met_pim
-> pim_topics

== pim_greet_back ==
{&"Oil? Oil. Everybody needs oil. The dead don't, but they're not my customers."|Pim has moved the cart three boards to the left since you last saw it.|"{hero_name}! Did you tell Wendel?"}
{ q_ch2_the_sickpools == 1: "Vat Seven, under the Locks. The cages with something in them glow. You'll know. Your teeth know." }
{ q_ch2_the_sickpools == 3: "Three cages. Three. My oil's going to cost more now, you know. I'm only telling you so you know." }
-> pim_topics

== pim_topics ==
+ { q_ch2_the_sickpools == 2 } [Three cages, broken. #mark: quest ready] -> pim_pools_turnin
+ { q_ch2_the_sickpools == 0 } [Dace says you want to see me. #mark: quest] -> pim_pools_offer
+ { q_ch2_the_sickpools == 1 } [About the Sickpools… #mark: quest active] -> pim_pools_active
+ { q_trial_lamp_oil == 2 } [Eight waves among the vats. #mark: quest ready] -> pim_lamp_oil_turnin
+ { q_trial_lamp_oil == 0 } [You know a lot about fire. #mark: quest] -> pim_lamp_oil_offer
+ { q_trial_lamp_oil == 1 } [About the vats… #mark: quest active] -> pim_lamp_oil_active
+ [Where does your oil come from?] -> pim_oil
+ [Are the eels really fat this year?] -> pim_eels
+ [I'll be going.] -> pim_bye

// ── The Sickpools (content/quests/ch2_the_sickpools.json) ──
== pim_pools_offer ==
He looks both ways along the boards, and at the chapel, and lowers his voice.
"The old vats, the Sickpools. The canal drains them now, under the Locks: Vat Seven. Imperial. Still leaking. What leaks out burns lovely, and nobody asks a chandler where he gets his oil, so."
"Somebody's draining them. At night. Men with poles, and on the poles there's little cages, and the cages are full of light I didn't sell them." He swallows. "And the vats are full of the drowned. They were. They're emptying."
+ [We'll look into it. #mark: quest]
    "Break the cages. The full ones, the ones that glow: their leaders carry those. Three would do. Three would make me feel a good deal better about my oil." # quest: accept ch2_the_sickpools
    -> pim_topics
+ [Not now.]
    "No. No, of course. Lovely oil, though. Burns very bright."
    -> pim_topics

== pim_pools_active ==
"Vat Seven, the bottom of the Locks, where the water goes the wrong colour. Their leaders carry the full cages. Break three, and then don't tell me what was in them."
-> pim_topics

== pim_pools_turnin ==
Pim counts on his fingers, twice, and wipes his hands on his apron, which makes them worse.
"Three. Good. That's good. That's somebody's grandmother not in a jar." He looks at his own jars for a while. # quest: turnin ch2_the_sickpools
"Orla at the chapel's been asking for you. Asking everyone. Loudly. The bells, she says. I'd go before she comes to find you."
-> pim_topics

// ── the mage's second trial (content/quests/trial_lamp_oil.json; world doc v1.30) ──
== pim_lamp_oil_offer ==
He looks at your mage the way he looks at a lamp that's smoking.
"You burn things. Yes. Everybody can burn things. The trick, the whole trade, is keeping the fire off what you don't want burned. The wick, the glass, the hand holding it."
"Go and stand among the vats at Vat Seven, under the Locks. Eight waves. They burn lovely out there, and the harvesters don't care what catches. Come back unsinged and I'll show you how a chandler keeps a flame off his fingers. It works for friends too."
+ [We'll go. #mark: quest]
    "Eight. Unsinged. Well. Mostly unsinged." # quest: accept trial_lamp_oil
    -> pim_topics
+ [Not now.]
    "No. Of course. I'll be here. Or a bit to the left of here."
    -> pim_topics

== pim_lamp_oil_active ==
"Vat Seven, under the Locks, among the vats. Eight waves. Mind your sleeves."
-> pim_topics

== pim_lamp_oil_turnin ==
Pim lights a wick, cups it in his bare hands, and shows your mage the trick: not a wall, just a little room around the flame where the heat isn't. Then he does it round your mage's hand instead.
"Arcane ward, the Sisters call it. I call it not burning yourself. No charge. No charge at all. You'll remember I said no charge." # quest: turnin trial_lamp_oil
-> pim_topics

== pim_oil ==
"Here and there. Mostly there." He coughs. "It's oil. Oil's oil. Wendel's comes from whales, he says. Have you ever seen a whale in the Vale? No. Neither has Wendel."
-> pim_topics

== pim_eels ==
"Enormous. Never seen them so fat. It's what's in the canal, I expect." He waits. "Lamps by the eel-traps help, of course. Bright ones. I've a jar here."
-> pim_topics

== pim_bye ==
{&"Tell Wendel!"|Pim is already pushing the cart somewhere the Sisters can't see it.|"Mind how you go. Bright lamps, mind."}
-> END
