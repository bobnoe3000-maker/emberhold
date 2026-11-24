// gannet.ink — Old Gannet, keeper of the Lamp Fort's light on its headland east of Tollhaven, and the Lantern Guild's
// oldest member (world doc v1.70 §3.7): sixty years at the light (docs/world-map-proposal.md), because nobody told him to stop. He stands
// inside the fort's gate (npcs.js `found`: lamp_fort, floor 1, `entrance`), as Tobin stands at the barrow mouth, with
// the Gull Fleet in his yard. His one device (copy-review §8): he opens with a keeper's report, the wind, the sea and
// the light, the way a keeper hands over the watch, at most once a knot. He knows what his lamp holds and never says:
// it's Brine Cross, the next chapter, where he breaks it (docs/tidemark-plan.md "The story"). His spare wick in the lamp
// room is the fort's keepsake (gannets_spare_wick: the vault's chest gives it, never this file). Entry: gannet_hub.
// Bound in by src/story/adapter.js from the sim (core.js boss_<id>; quests.js q_ = −1 locked · 0 available · 1 active
// · 2 ready · 3 done). Flags: met_gannet. Act IV: he gives and takes in The Keeper's Light (ch4_keepers_light).
// After Brine Cross (ch4_brine_cross, Hester's) he has carried the lamp up the road and broken it on the bridge's east
// barricade, and the drowned have lain down (camps.js the stand). The sim sets `brine_held` (state.flags) when the stand
// is held; it reaches Ink as flag_brine_held because npcs.js lists it in old_gannet's `flags`, as met_gannet is (this
// file never sets it). From then his report says the light is out, and he'll say what the lamp held.

VAR hero_name = ""
VAR hero_class = ""
VAR hero_origin = ""
VAR hero_level = 1
VAR party_size = 1
VAR fallen_name = ""
VAR day_part = 0
VAR flag_met_gannet = 0
VAR flag_brine_held = 0
VAR boss_hesk = 0
VAR q_ch4_keepers_light = -1

== gannet_hub ==
{ flag_met_gannet == 0: -> gannet_first_meet }
{ fallen_name != "": -> gannet_greet_fallen }
{ flag_brine_held == 1: -> gannet_greet_dark }
-> gannet_greet_back

== gannet_first_meet ==
An old man in an oilskin gone white with salt stands just inside the Lamp Fort's gate, leaning on a long keeper's hammer and watching the yard. On the tower behind him the light is burning, in broad day.
"Wind north-east. Sea getting up. Light's lit." He says it to the yard, as if handing over a watch. "Gannet. Keeper here. Lantern Guild, its oldest member, though it hasn't many." # flag: set met_gannet
"I've kept that light sixty years, because nobody told me to stop. The Guild's been meaning to write."
{
- hero_origin == "redhand_deserter":
    "Redhand. Some of your old Company are in my yard, on the Gull Fleet's pay, with crossbows. Don't take it personally. They don't."
- hero_origin == "grey_sisters_ward":
    "A Sisters' ward. Your mothers wrote the names down and mine lit the lamps. Neither lot asked enough questions."
- else:
    "Hester Quaile sent you, or you're lost. Either way you came up the cliff path, so you'll do."
}
-> gannet_topics

== gannet_greet_back ==
{&Gannet is leaning on his hammer, watching the yard.|"Wind backing west. Light's lit. You again."|Gannet looks up at the light, then at you, in that order.}
{ q_ch4_keepers_light == 1: "They're still in my yard. They fight for shares, and there's no share in a dead man. Give them a few more and they'll work that out." }
{ q_ch4_keepers_light == 3: "Yard's quiet. I've swept it. Corsairs leave a lot behind them, mostly teeth." }
-> gannet_topics

// after Brine Cross: the lamp broken on the barricade, the tower dark for the first time in sixty years
== gannet_greet_dark ==
{&"Wind south-west. Sea slight. Light's out." He listens to himself say the last part.|Gannet is in the yard, looking up at the tower out of habit. Nothing is burning on it.|"Wind backing west. Light's out. You again."}
-> gannet_topics

== gannet_greet_fallen ==
"Wind dropping. {flag_brine_held == 1: Light's out.|Light's lit.} {fallen_name}'s not with you." He takes his eyes off the yard for that.
"The Quay Chapel in Tollhaven will have them up. It's a long way back along the cliffs. Carry them on the landward side."
-> gannet_topics

== gannet_topics ==
+ { q_ch4_keepers_light == 2 } [The yard's clear. #mark: quest ready] -> gannet_light_turnin
+ { q_ch4_keepers_light == 0 } [Can we help with the fleet? #mark: quest] -> gannet_light_offer
+ { q_ch4_keepers_light == 1 } [About the yard… #mark: quest active] -> gannet_light_active
+ { q_ch4_keepers_light == -1 } [Can we help with the fleet?] -> gannet_light_locked
+ { flag_brine_held == 0 } [What's the light for?] -> gannet_light
+ { flag_brine_held == 1 } [What did your lamp hold?] -> gannet_lamp_held
+ { flag_brine_held == 0 } [Who's in the yard?] -> gannet_fleet
+ { flag_brine_held == 1 } [What will you do now?] -> gannet_after
+ [What's in the lamp room?] -> gannet_wick
+ [I'll be going.] -> gannet_bye

// ── Act IV: The Keeper's Light (content/quests/ch4_keepers_light.json): the Gull Fleet in his yard ──
== gannet_light_offer ==
"Wind onshore. That's their wind." He nods down at the headland. "Hesk's boats put in under the cliff at night, and his people come up it and over my curtain wall. I've held the gate. A gate is about what one old man can hold."
"Clear my yard. Beat them off six times and they'll go back to their boats. I'd like to get up my own tower by dusk."
+ [We'll clear your yard. #mark: quest]
    "Through the gate is the yard. The magazine's off it, and the curtain walk runs up to the tower. Mind the dogs. They go for the legs." # quest: accept ch4_keepers_light
    -> gannet_topics
+ [Not yet.]
    "Then I'll stand here a while longer. I've been doing it a while."
    -> gannet_topics

== gannet_light_active ==
"Through the gate and into the yard. Beat them off six times, then come and tell me, and I'll go up and look at my light."
-> gannet_topics

== gannet_light_locked ==
{ hero_level < 36:
    "You'd not last the yard. Hesk's mates would have you off the wall before you'd found the stair. Come back with more scars."
- else:
    "See Hester Quaile in Tollhaven first. The drowned walking up her quays are worse than corsairs in my yard, and she'll tell you so."
}
-> gannet_topics

== gannet_light_turnin ==
Gannet walks out into his yard and stands in the middle of it, looking up. The light on the tower is burning.
"Wind gone round off the land. That's my wind." # quest: turnin ch4_keepers_light
{ boss_hesk == 1: "Hesk's down, I hear. Then whoever paid him will send somebody else, wanting the same thing." }
{ boss_hesk == 0: "They'll be back. Hesk's not the trouble. Whoever pays Hesk is the trouble." }
"You'll want to know what they want with my lamp." He looks at it a long while. "When it matters, I'll tell you. I'd like it not to matter a bit longer."
"Tell Hester Quaile the light's lit. She likes to know, and she'll say she doesn't."
-> gannet_topics

== gannet_light ==
"Not for ships. There's been nothing in this water worth a light since the Fall. I keep it lit anyway."
"Some lights bring things in. This one keeps things where they are. Ask me another."
-> gannet_topics

== gannet_fleet ==
"The Gull Fleet. Corsairs, their mates with boarding pikes, dogs in spiked collars, and Redhand crossbows on the fleet's pay."
"They've walked past my magazine twice and never opened it. They want up the tower, to the lamp, and they've been careful not to break anything on the way."
"Hesk doesn't want a lamp. Somebody's paying Hesk to want one."
-> gannet_topics

== gannet_wick ==
{ flag_brine_held == 0:
    "The lamp, and a chest with my spare wick in it. Trimmed. I've never lit it. It's for the night the lamp goes out."
    "It hasn't yet. If you get up there, take the wick. I'll not be needing it."
- else:
    "An empty hook where the lamp hung, and the chest my spare wick was in."
    "That wick was for the night the lamp went out. It went out. I find I don't want the wick. It's yours, if you've not had it."
}
-> gannet_topics

// ── after Brine Cross: what the lamp held, now he's broken it (world doc §2.1, §3.7: the fleet's coast-lamp) ──
== gannet_lamp_held ==
"The imperial fleet's signal corps. They're in it, and the crews took their orders by its light. When the fleet went down off the Mole, the crews went on listening, and the lamp stayed lit."
"While it burned they'd answer anyone who sang to them right. For a long while that was nobody. Then this spring somebody sang."
"I could have put it out any night these sixty years. I was waiting to be told. In the end I told myself. It took me long enough."
-> gannet_topics

== gannet_after ==
"Sweep the yard. Keep the gate. The Guild will get round to writing now, I expect, to tell me to stop."
"I sleep at night now. I haven't since I was a Wick. It's very dark, sleeping. They tell me you get used to it."
-> gannet_topics

== gannet_bye ==
{&"Mind the cliff path. There's less of it every winter."|Gannet has gone back to watching the yard.|"Get back along the cliffs before dark. {flag_brine_held == 1: There's no light out here now.|The light's not for you.}"}
-> END
