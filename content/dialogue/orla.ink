// orla.ink — Sister Orla, who keeps the Grey Sisters' chapel in Saltmere (world doc §3.2, v1.29): young, sent down
// from Reedholm for her temper, and the only Sister who'll say the binding rolls out loud. Entry: orla_hub. Bound in
// by src/story/adapter.js from the sim (sim/npcs.js varsFor; quests.js: q_ = −1 locked · 0 available · 1 active ·
// 2 ready · 3 done). Flags: met_orla. Act II, chapters 4–5 (the Rolls go to Mother Agnes, agnes.ink).

VAR hero_name = ""
VAR hero_class = ""
VAR hero_origin = ""
VAR hero_level = 1
VAR party_size = 1
VAR fallen_name = ""
VAR day_part = 0
VAR flag_met_orla = 0
VAR q_ch2_the_bells = -1
VAR q_ch2_the_rolls = -1

== orla_hub ==
{ flag_met_orla == 0: -> orla_first_meet }
{ fallen_name != "": -> orla_greet_fallen }
-> orla_greet_back

== orla_first_meet ==
A young Grey Sister is scrubbing the chapel step hard enough to take the grey off it. She stops when your shadow falls on the wet part.
"Sister Orla. Reedholm sent me down here to learn patience. It's going very well." # flag: set met_orla
{
- hero_origin == "grey_sisters_ward":
    "You're one of ours. Reedholm, the wards' dormitory, the cold end. Did they tell you what the order was before it was the order? No. They don't tell anyone."
- else:
    "If you've come for a blessing, the Mother's the one for those. If you've come for the truth, sit down. It takes longer."
}
-> orla_topics

== orla_greet_back ==
{&Orla straightens up from the step with her hands on her back.|"{hero_name}. Good. I've been wanting to shout at somebody who'd shout back."|The chapel door is open. Orla is inside, reading something she has been told not to.}
{ q_ch2_the_bells == 1: "Teague's at the choir's door. He'll tell you his name. Don't tell him yours." }
{ q_ch2_the_rolls == 1: "The lowest floor. Whatever's left of the rolls, bring it up. The Mother's waiting, and she's very bad at it." }
{ q_ch2_the_rolls >= 2: "The Mother's inside with the rolls. Go on. She'll pretend she isn't glad." }
-> orla_topics

== orla_greet_fallen ==
"You've lost {fallen_name}." She is already wiping her hands. "Bring them in. The chapel can raise them. That's the one thing the order was ever any good for."
-> orla_topics

== orla_topics ==
+ { q_ch2_the_bells == 2 } [Brother Teague is down. #mark: quest ready] -> orla_bells_turnin
+ { q_ch2_the_bells == 0 } [Pim says you've been asking for us. #mark: quest] -> orla_bells_offer
+ { q_ch2_the_bells == 1 } [About Brother Teague… #mark: quest active] -> orla_bells_active
+ { q_ch2_the_rolls == 0 } [What now? #mark: quest] -> orla_rolls_offer
+ { q_ch2_the_rolls == 1 } [About the rolls… #mark: quest active] -> orla_rolls_active
+ [What are the binding rolls?] -> orla_rolls_what
+ [Why did Reedholm send you down?] -> orla_temper
+ [I'll be going.] -> orla_bye

// ── The Bells (content/quests/ch2_the_bells.json) ──
== orla_bells_offer ==
"The Abbey's bells rang three nights running. There's been nobody in that tower to ring them for three hundred years."
"The Mother says it's the wind. There's no wind at the dark of the moon. There's a man at the choir's door, the eel-men say, with a cage on a pole and a light in it, and he tells them his name."
"I'd go myself. I asked. The Mother said if I went she'd send me somewhere that makes Saltmere look like Reedholm."
+ [We'll go. #mark: quest]
    "The Drowned Abbey, out past the Sickpools. The choir's door is the first floor's hall. Break his cage first: the eel-men say while it's lit, nothing touches him." # quest: accept ch2_the_bells
    -> orla_topics
+ [Not yet.]
    "Then listen tonight. You'll hear them. Everyone here does, and nobody says so."
    -> orla_topics

== orla_bells_active ==
"Brother Teague, at the choir's door: the first floor's hall of the Drowned Abbey. Break the cage, and then he's only a man. Most of them are, under the cage."
-> orla_topics

== orla_bells_turnin ==
Orla opens the chapel's book at the back, where the names go, and writes *Teague* at the bottom of a long page.
"He gave his name to everyone he took. I'll give it back to them. It's the least he's owed." She blots it, hard. "Both ways." # quest: turnin ch2_the_bells
-> orla_topics

// ── The Rolls (content/quests/ch2_the_rolls.json): taken in by Mother Agnes ──
== orla_rolls_offer ==
"Teague wasn't only harvesting. The eel-men saw his brothers carrying boxes out of the Abbey, the long flat kind. Rolls go in those."
"The binding rolls. Every name the order ever bound, under the Abbey, in the water. The Cult is taking them away, and I don't know what for, and that frightens me more than the bells did."
"The Mother's come down from Reedholm. She'd rather they stayed shut. I'd rather they stayed ours."
+ [We'll bring up what's left. #mark: quest]
    "The lowest floor, the third. Whatever's left of them, two chests' worth, if the Cult's left that. Take them to the Mother, inside. Don't let her send you away first." # quest: accept ch2_the_rolls
    -> orla_topics
+ [Not yet.]
    "They've been in the water three hundred years. A few more days won't drown them. It's the boxes I mind."
    -> orla_topics

== orla_rolls_active ==
"The Abbey's third floor. Two chests of whatever's left. Then the Mother, in the chapel. She'll say thank you. She'll say it as if it hurt."
-> orla_topics

== orla_rolls_what ==
"Before the Grey Sisters were the Grey Sisters, we were the binding clergy. We bound the tithe for the Throne. Every soul, written down on a roll: who, when, and that they volunteered."
"'Bind them gently. Most of them volunteered.' That was the prayer. Nobody at Reedholm says it out loud. I do. Somebody should hear it who wasn't there."
-> orla_topics

== orla_temper ==
"I told the Mother at chapter that most of them didn't volunteer. That the rolls say so if you read the columns, not just the names." She goes back to the step. "She said I'd learn patience in Saltmere."
"I've learned the eel-men cheat at cards. It's a start."
-> orla_topics

== orla_bye ==
{&"Go on, then. Mind the bells."|Orla has gone back to the step.|"If you see the Mother, I'm being patient."}
-> END
