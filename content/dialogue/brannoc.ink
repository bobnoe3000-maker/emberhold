// brannoc.ink — Brannoc, a Redhand deserter and the first found companion (world doc §5, v1.7).
// Captain Garrow kept him chained in the last hall of Wickham Keep's Old Cellars as an example to the others.
// Big, slow to talk, quick to apologise. Entry: brannoc_hub: in the hall while he waits there, and
// from his party card once he's with you. Bound in by src/story/adapter.js from the sim
// (sim/npcs.js varsFor: joined 0 / 1, in_party 0 / 1; core.js: boss_<id> 0 / 1); Ink only reads them.
// Effects go out as tags the sim checks: flags: met_brannoc; `# companion: join` (heroes.js: only once
// Garrow has fallen); his chain, Chains of the Redhand (q_ = −1 locked · 0 available · 1 active ·
// 2 ready · 3 done).

VAR hero_name = ""
VAR hero_class = ""
VAR hero_origin = ""
VAR hero_level = 1
VAR party_size = 1
VAR fallen_name = ""
VAR day_part = 0
VAR flag_met_brannoc = 0
VAR joined = 0
VAR in_party = 0
VAR boss_redhand_captain = 0
VAR q_brannoc_old_debts = -1
VAR q_brannoc_paymasters_box = -1
VAR q_brannoc_standing_down = -1

== brannoc_hub ==
{ joined == 0 && boss_redhand_captain == 0: -> brannoc_chained_early }
{ joined == 0: -> brannoc_chained }
{ fallen_name != "": -> brannoc_greet_fallen }
-> brannoc_greet

// ── in the hall ──
== brannoc_chained_early ==
A big man sits against the back wall with a chain from his ankle to a ring in the stone. He watches the door, not you. # flag: set met_brannoc
"Garrow has the key. Garrow has all the keys. Sorry. You didn't ask."
-> END

== brannoc_chained ==
{ flag_met_brannoc == 0: A big man sits against the back wall of the hall with a chain from his ankle to a ring in the stone. He looks at what's left of Captain Garrow for a long time. # flag: set met_brannoc }
{ flag_met_brannoc == 1: Brannoc is still sitting by the ring in the wall. He's found the key on Garrow and not used it. }
"Brannoc. I was Redhand. I tried to leave twice. The second time he chained me here so the others could see what leaving looked like."
{
- hero_origin == "redhand_deserter":
    "You left too. I can tell. You stand like someone who's stopped waiting to be shouted at. How did you do it? Sorry. Later."
- else:
    "He fed me when he remembered. He mostly remembered. That's the nicest thing I'll say about him."
}
"The robes paid him to dig. I heard them count it. I'd like to know what for. I'd like to see it through, if you'll have me."
+ [Come with us. #mark: quest]
    He unlocks the chain himself, which takes him three tries, and stands up slowly, as if he expects the ceiling to object. # companion: join
    -> brannoc_joined
+ [Not yet.]
    "I'll be here. I'm good at being here."
    -> END

== brannoc_joined ==
{ in_party == 1: "I'll go first through doors. I'm the widest. It's the one thing I'm best at." }
{ in_party == 0: "Your company's full. That's all right. I'll wait at the inn in Thornwick. I'm good at waiting. Sorry. I said that." }
-> END

// ── with you ──
== brannoc_greet ==
{&Brannoc falls into step and waits for you to say something first.|"Sorry. Were you going to say something? Go on."|Brannoc is turning a link of old chain over in his fingers. He puts it away when he sees you looking.}
{ q_brannoc_standing_down == 3: "I keep thinking about them down there. Nobody came, and they stayed anyway. We came, in the end. Late. But we came." }
-> brannoc_topics

== brannoc_greet_fallen ==
Brannoc looks back the way you came, where {fallen_name} should be.
"We should go back for {fallen_name}. Sorry. You know that. I just wanted it said."
-> brannoc_topics

== brannoc_topics ==
+ { q_brannoc_old_debts == 2 } [That's Garrow's three sergeants down. #mark: quest ready] -> brannoc_debts_turnin
+ { q_brannoc_paymasters_box == 2 } [We found the paymaster's boxes in the Keep. #mark: quest ready] -> brannoc_box_turnin
+ { q_brannoc_standing_down == 2 } [We stood with the legion. Five waves. #mark: quest ready] -> brannoc_standing_turnin
+ { q_brannoc_old_debts == 0 } [Is there anything you need to settle? #mark: quest] -> brannoc_debts_offer
+ { q_brannoc_old_debts == 1 } [About the sergeants… #mark: quest active] -> brannoc_debts_active
+ { q_brannoc_paymasters_box == 0 } [Where did the robes' coin go? #mark: quest] -> brannoc_box_offer
+ { q_brannoc_paymasters_box == 1 } [About the paymaster… #mark: quest active] -> brannoc_box_active
+ { q_brannoc_standing_down == 0 } [What do you want now? #mark: quest] -> brannoc_standing_offer
+ { q_brannoc_standing_down == 1 } [About the legion… #mark: quest active] -> brannoc_standing_active
+ [Why did the Company dig?] -> brannoc_digging
+ [Tell me about Garrow.] -> brannoc_garrow
+ [That's all.] -> brannoc_bye

// Old Debts (content/quests/brannoc_old_debts.json)
== brannoc_debts_offer ==
"Garrow's sergeants. The ones who kept my chain oiled. They're still in the Keep, and they think I owe them."
"I don't. But they'll say so every time we pass, loudly, with crossbows. I'd like it settled before it follows us."
+ [We'll settle it. #mark: quest]
    "Three of them. They lead the others in, every so often, shouting. You'll know them by the shouting." # quest: accept brannoc_old_debts
    -> brannoc_topics
+ [Not now.]
    "No. Sorry. They'll keep. They always did."
    -> brannoc_topics

== brannoc_debts_active ==
"Wickham Keep. Three sergeants. Stay in a room long enough and one comes to you shouting. They never learned not to."
-> brannoc_topics

== brannoc_debts_turnin ==
Brannoc is quiet for a while.
"That's done, then. I thought I'd feel something. I feel like sitting down. Sorry. I'll stand." # quest: turnin brannoc_old_debts
-> brannoc_topics

// The Paymaster's Box (content/quests/brannoc_paymasters_box.json)
== brannoc_box_offer ==
"The paymaster kept the robes' coin in the Keep's strongroom, down in the Barracks, not with Garrow. He trusted nobody. Not Garrow, not the men, not himself. So two boxes, in two places."
"I'd like to see whose seal is on the purses. Garrow never asked. I'm asking."
+ [We'll find the boxes. #mark: quest]
    "Two chests in the Barracks, the Keep's second floor. He'd hide them where he'd have to walk past them twice a day, to be sure they were still there." # quest: accept brannoc_paymasters_box
    -> brannoc_topics
+ [Not now.]
    "The coin's not going anywhere. That was always the paymaster's whole idea."
    -> brannoc_topics

== brannoc_box_active ==
"Two chests in the Barracks, the Keep's second floor. He'd keep them close to the doors, where he could count them on his way past."
-> brannoc_topics

== brannoc_box_turnin ==
Brannoc tips a purse into his hand and holds the wax to the light. It's red, the colour of a coal just before it goes out, with no crest in it, only a thumbprint.
"Lords put lions on their wax. This is somebody who likes fire and doesn't like names." He pockets one. "Sorry. I'll give it to Sister Ilse. She'll want to read it twice." # quest: turnin brannoc_paymasters_box
-> brannoc_topics

// Standing Down (content/quests/brannoc_standing_down.json)
== brannoc_standing_offer ==
"Osric says there's a legion in the barrows that held a road for three hundred years because nobody told them to stop."
"I left everything I was ever in. Twice. I'd like to stand somewhere once, with somebody who didn't. Even if they're dead. Especially if."
+ [We'll stand with them. #mark: quest]
    "The Old Barrows. The Long Gallery, the second floor, its last hall, where they stand in rows. Five waves, and nobody steps out. Sorry. I know you'll step out if you have to. I mean I won't." # quest: accept brannoc_standing_down
    -> brannoc_topics
+ [Not now.]
    "They've waited a long time. They'll understand."
    -> brannoc_topics

== brannoc_standing_active ==
"The Old Barrows. The Long Gallery's last hall, the second floor. Five waves. I've been practising standing still. It's harder than it looks."
-> brannoc_topics

== brannoc_standing_turnin ==
Brannoc takes the old chain out of his pocket, all of it but one link, and works that link open with his thumbs until it bends.
"There. I've kept one. The rest is yours. It's not much. It held me for a year. Maybe it'll hold something for you." # quest: turnin brannoc_standing_down
-> brannoc_topics

== brannoc_digging ==
"I don't know. That's the honest answer. Sorry, it's not a good one."
"The robes came once a month, paid Garrow, and asked for nothing to come up. Just the digging. Downward. Toward the chapel, I think. They listened to the ground like it might answer."
-> brannoc_topics

== brannoc_garrow ==
"He collected. Tolls, tithes, debts. Men. He wrote everything down in a book, and if your name was in the book you owed him until he crossed it out."
"He never crossed anything out. I checked, once. That was the first time I left."
-> brannoc_topics

== brannoc_bye ==
{&"Right. I'll be just behind you. Or in front, at doors."|Brannoc nods and falls back half a step.|"Sorry. Go on."}
-> END
