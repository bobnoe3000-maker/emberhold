// brannoc.ink — Brannoc, a Redhand deserter and the first found companion (world doc §5, v1.7).
// Captain Garrow kept him chained in the last hall of Wickham Keep's Old Cellars as an example to the others.
// Big, slow to talk, quick to apologise. Entry: brannoc_hub: in the hall while he waits there, and
// from his party card once he's with you. Bound in by src/story/adapter.js from the sim
// (sim/npcs.js varsFor: joined 0 / 1, in_party 0 / 1; core.js: boss_<id> 0 / 1); Ink only reads them.
// Effects go out as tags the sim checks: flags: met_brannoc; `# companion: join` (heroes.js: only once
// Garrow has fallen). His chain, Chains of the Redhand, is Osric Hale's to give since v1.155 (the owner: "move the
// companion chains to townspeople too"; osric.ink): Brannoc only says what he'd like settled, and who has it in his book.
// He's talked to from his card in the party or on the bench (`joined`).

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
-> brannoc_topics

== brannoc_greet_fallen ==
Brannoc looks back the way you came, where {fallen_name} should be.
"We should go back for {fallen_name}. Sorry. You know that. I just wanted it said."
-> brannoc_topics

== brannoc_topics ==
+ [Is there anything you need to settle?] -> brannoc_settle
+ [Why did the Company dig?] -> brannoc_digging
+ [Tell me about Garrow.] -> brannoc_garrow
+ [That's all.] -> brannoc_bye

// Chains of the Redhand (content/quests/brannoc_*.json): Osric Hale gives it since v1.155
== brannoc_settle ==
"Garrow's sergeants say I owe them. The paymaster's boxes are still in the Keep, with whoever's seal is on the robes' coin. And there's a legion under the Sunken Chapel that never left anything. I'd like all three seen to."
"Osric Hale has them in his book. He says they're the Watch's business. Ask him at the well. He'll write you down for it. He writes everybody down."
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
