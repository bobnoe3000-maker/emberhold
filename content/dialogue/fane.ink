// fane.ink — Mistress Fane, Tollhaven's harbour mage (world doc v1.74 §3.7), by the square's well with a pot of wet
// salt and a brush. She keeps the ward on the harbour chain: a line of salt-writing on every link that tells it to hold,
// lettered again at each low water while the links are out of the sea. She's exact, impatient with anyone who thinks
// magic ought to be impressive, and paid by the link. Her concern is the tide, and it bends her syntax: she tells every
// time by it, the state of the water first and then "so" and what follows from it (her one device, copy-review §8; at
// most once a knot). Entry: fane_hub. Bound in by src/story/adapter.js from the sim (sim/npcs.js varsFor; day_part
// 0 dawn · 1 day · 2 dusk · 3 night; quests.js q_ = −1 locked · 0 available · 1 active · 2 ready · 3 done). Flags:
// met_fane. She gives and takes in her two errands (docs/tidemark-plan.md step 7): The Chain Ward (fane_the_chain_ward:
// three of the drowned's bosuns off the Drowned Mole, whose whistles foul the ward) and Signal Powder
// (fane_signal_powder: two of the Gull Fleet's chests on the Gull Isles). No HTML.

VAR hero_name = ""
VAR hero_class = ""
VAR hero_origin = ""
VAR hero_level = 1
VAR party_size = 1
VAR fallen_name = ""
VAR day_part = 0
VAR flag_met_fane = 0
VAR q_fane_the_chain_ward = -1
VAR q_fane_signal_powder = -1

== fane_hub ==
{ flag_met_fane == 0:
    A woman in a salt-white apron kneels by the well with a length of old chain across her knees, a pot of wet salt beside her and a brush in her hand. She finishes the stroke she's on, then looks at the harbour, not at you.
    "An hour to low water, so I'll be quick. Mistress Fane. Harbour mage. I keep the ward on the chain." # flag: set met_fane
- else:
    { day_part == 3:
        "Low water at the second watch, so I'm up. Everyone else on this square has the sense to be asleep."
    - else:
        {&"Half-flood. The chain's under, so for six hours the ward is the sea's problem. Then it's mine again."|Fane is lettering a spare link. She doesn't look up until the line of salt closes on itself.|"Three hours of ebb left, so ask. I can talk and write. I can't talk and write well."}
    }
}
{ fallen_name != "": "You're one short. The Quay Chapel's on the square, past the Paid Toll. Josse rings for the dead. Yours can still be got up." }
{ q_fane_the_chain_ward == 1: "Three bosuns on the Mole. I want their whistles, not their opinions." }
{ q_fane_signal_powder == 3: "The chain hasn't twitched at night since the powder went in the harbour. I've started sleeping through low water. Hester says I'm still paid for it." }
-> fane_topics

== fane_topics ==
+ { q_fane_the_chain_ward == 2 } [Three bosuns' whistles. #mark: quest ready] -> fane_ward_turnin
+ { q_fane_the_chain_ward == 0 } [What's wrong with the ward? #mark: quest] -> fane_ward_offer
+ { q_fane_the_chain_ward == 1 } [About the bosuns… #mark: quest active] -> fane_ward_active
+ { q_fane_signal_powder == 2 } [The Gull Fleet's powder. #mark: quest ready] -> fane_powder_turnin
+ { q_fane_signal_powder == 0 } [Is anything else fouling the ward? #mark: quest] -> fane_powder_offer
+ { q_fane_signal_powder == 1 } [About the powder… #mark: quest active] -> fane_powder_active
+ [What does the ward do?] -> fane_ward
+ [A mage, writing in salt?] -> fane_salt
+ [Tell me about Tollhaven.] -> fane_town
+ [I'll let you work.] -> fane_bye

// ── The Chain Ward (content/quests/fane_the_chain_ward.json): the drowned bosuns' whistles ──
== fane_ward_offer ==
"Low water in two hours, so listen. Every link of the chain has a line of salt on it. Salt on iron, under the sea twice a day, and it holds, because the sea is salt too. The sea agrees with it."
"Since the drowned started walking, the ward's gone foul at the Mole end. Their bosuns carry whistles, the old fleet's pattern. A bosun's call is an order, and the ward hears it as one. Every night a few more links forget what they were told."
"Bring me three of those whistles. I want the call they're blowing, so I can write the ward to ignore it. Writing it to ignore everything would be easier. Then it would ignore ships."
+ [We'll bring three. #mark: quest]
    "The Drowned Mole, by Gullwick's ferry. The bosuns lead every fifth wave, and you'll hear them before you see them. Three whistles, so three bosuns." # quest: accept fane_the_chain_ward
    -> fane_topics
+ [Not now.]
    "Then I'll letter it again at low water, and at the next. The ward was never going to fix itself. It's salt."
    -> fane_topics

== fane_ward_active ==
"The Drowned Mole. Three bosuns, three whistles. Don't blow them on the way back. The chain will think you're the fleet."
-> fane_topics

== fane_ward_turnin ==
Fane lays the three whistles on the well's rim and blows each one, very softly, watching the chain out across the harbour. At the second, the links nearest the Mole give a shiver you can see from the square.
"That one. All hands. The old fleet's call to come on deck." # quest: turnin fane_the_chain_ward
"Half-ebb, so the chain's still under and I can't touch it. Tonight, then. I'll write every link to hear that call and do nothing about it. It's the first order on this coast I've been asked to make something ignore. I'm looking forward to it."
-> fane_topics

// ── Signal Powder (content/quests/fane_signal_powder.json): the Gull Fleet's, before it signals the drowned ──
== fane_powder_offer ==
"Flood in an hour, so briefly. The Gull Fleet keeps signal powder in its stores on the Isles, the old navy's. Lit on a mole's end at night it burns a colour, and at sea a colour is an order."
"The drowned were the navy's crews. Nobody's lit any of it near them yet. I'd like it at the bottom of my harbour before anyone thinks to."
"The ward was written for living ships. It has no idea what to do about a signal. Neither do I, which is why I'd rather not find out."
+ [We'll fetch it. #mark: quest]
    "The Gull Isles, past the salt marsh. The powder's in kegs in the fleet's chests. Two chests should be all of it. Keep it away from lamps. All lamps." # quest: accept fane_signal_powder
    -> fane_topics
+ [Not now.]
    "Then I'll watch the Isles at night. I was going to anyway."
    -> fane_topics

== fane_powder_active ==
"The Gull Isles. Two of the fleet's chests, and the kegs in them. Dry, and nowhere near a light."
-> fane_topics

== fane_powder_turnin ==
Fane tips a pinch from each keg onto the wet stone by the well and touches her brush to it. It fizzes a sick green and goes grey.
"Green. The old navy's green: all ships, close on the light." She looks east along the coast, toward the Lamp Fort, and doesn't say anything else about it. # quest: turnin fane_signal_powder
"Slack water tonight, so the harbour will be still. It goes off the end of the jetty, a keg at a time, wet. The fish will have to manage."
-> fane_topics

// ── plain topics ──
== fane_ward ==
"Flood's making, so it's working now. Every link says hold. The chain holds whatever comes against it until the tollman unhooks it, and the tollman unhooks it when Hester's been paid."
"Hester calls it the toll. I call it a sentence with one verb in it, written six hundred times."
-> fane_topics

== fane_salt ==
"Salt because the sea's made of it. Ink argues with water. Blood is for mages who want to be stared at in taverns, and the ones I've met have mostly got their wish."
"The League pays me a penny a link a tide. Hester once tried to toll me for standing on her chain. We settled."
-> fane_topics

== fane_town ==
"Everyone in Tollhaven knows the hour by the water, except visitors. High water, the chain's down and the ships come in. Low water, the chain's out and I'm on it. The Paid Toll does well at both."
"The Quay Chapel says the drowned's names. Josse, the sexton, writes them down first. Between him and me, the harbour's well kept. Nobody thanks either of us. That's how you know."
-> fane_topics

== fane_bye ==
{&"Mind the chain on your way past. The ward doesn't know you."|Fane has already gone back to the link on her knees.|"Low water at dusk, so I'll be out on the mole. Don't wave. It smudges."}
-> END
