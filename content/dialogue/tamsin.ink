// tamsin.ink — Tamsin Coalbrook, Dagny's niece, a mage-smith and the Reach's found companion (mage; world doc §3.3,
// v1.53): she works iron with her hands and with the Ember both, which the clans think is showing off. She went down the
// Cold Seam after its books, and the Scrag Warren's goblins kept her at their anvil in the tally cave for the forge-work
// she can do. Entry: tamsin_hub: in the tally cave while she waits there, and from her party card once she's with you.
// Bound in by src/story/adapter.js from the sim (sim/npcs.js varsFor: joined 0 / 1, in_party 0 / 1; core.js:
// boss_<id> 0 / 1). Effects: flags: met_tamsin; `# companion: join` (heroes.js: only once the Foreman has fallen).
// (Her own chain, as Brannoc's and Wren's, is still to be written: docs/reach-plan.md "Side quests".)

VAR hero_name = ""
VAR hero_class = ""
VAR hero_origin = ""
VAR hero_level = 1
VAR party_size = 1
VAR fallen_name = ""
VAR day_part = 0
VAR flag_met_tamsin = 0
VAR joined = 0
VAR in_party = 0
VAR boss_foreman = 0

== tamsin_hub ==
{ joined == 0 && boss_foreman == 0: -> tamsin_chained_early }
{ joined == 0: -> tamsin_chained }
{ fallen_name != "": -> tamsin_greet_fallen }
-> tamsin_greet

// ── in the tally cave ──
== tamsin_chained_early ==
A young Deepdelver woman, black to the elbows, sits at a goblin anvil with a chain from her ankle to the wall. She is putting an edge on a pick, and the iron is glowing where her thumb goes, not where the fire is. # flag: set met_tamsin
"Don't mind me. I'm on shift. He'll blow the whistle in a minute and tell you what I'm worth. It's four picks a day."
-> END

== tamsin_chained ==
{ flag_met_tamsin == 0: A young Deepdelver woman, black to the elbows, sits at a goblin anvil with a chain from her ankle to the wall. The goblins are carrying their foreman out by his boots, and his lamp-hat after him. # flag: set met_tamsin }
{ flag_met_tamsin == 1: Tamsin is still at the anvil. She has stopped sharpening the pick and started on her chain, which is softening where her thumb goes. }
"Tamsin Coalbrook. Aunt Dagny sent you. Don't tell me she didn't. She'll have done a sum on her fingers first."
{
- hero_origin == "deepdelver_fostered":
    "You're clan-raised. You keep looking at the roof. So do I. It's the only sensible thing to look at down here."
- hero_class == "mage":
    "You do it too, then. The fire without the forge. Don't let the clans see you at it. They think it's showing off. It is."
- else:
    "I came down for the Seam's books. Old Brannagh says the last shift was never paid. She's said it for forty years. I thought I'd find out if it was true before she said it for forty-one."
}
-> tamsin_ask

== tamsin_ask ==
"They found out I can mend a pick with my hands, and with the other thing. So they kept me. He put me on his tally: one pick, one chalk mark. I'm the only thing on that wall that adds up."
"You go places people like the Assay don't want you. I can mend what you break, and break what you can't. I'd like to know where Aunt Dagny's night shift goes. I'd like to know it before she does."
+ [Come with us. #mark: quest]
    She puts her thumb to the last link of the chain. It goes red, then soft, then it's two pieces. # companion: join
    -> tamsin_joined
+ [Not yet.]
    "Fine. I'll finish this pick. It'd be a shame to leave a pick half done. They'd only use it badly."
    -> END

== tamsin_joined ==
{ in_party == 1: "I'll walk at the back and mend things. If anything's broken, tell me. If nothing's broken, wait." }
{ in_party == 0: "Your company's full. Fine. I'll be at the Ashgate Forge, telling Haldor what's wrong with his. Come and get me before he throws me out." }
-> END

// ── with you ──
== tamsin_greet ==
{&Tamsin is turning a nail over in her fingers. It's straighter every time it comes round.|"What? I'm listening. I can listen and mend at once. Aunt Dagny can't, which is why she thinks nobody can."|Tamsin falls into step, black to the elbows still. It doesn't wash off. She's stopped trying.}
-> tamsin_topics

== tamsin_greet_fallen ==
Tamsin keeps looking back the way you came, for {fallen_name}.
"I can mend most things. Not that. Take them to Old Brannagh. She'll light a candle off the Flame, and she'll count them back in."
-> tamsin_topics

== tamsin_topics ==
+ [Why do the clans call it showing off?] -> tamsin_showing_off
+ [What did you find in the Seam's books?] -> tamsin_books
+ [Tell me about your aunt.] -> tamsin_dagny
+ [That's all.] -> tamsin_bye

== tamsin_showing_off ==
"Because a smith's meant to sweat. You put the iron in the fire and the fire does the work and you hit it until it agrees with you. That's honest."
"I just ask the iron. It's quicker. The clans think anything that's quicker is cheating, which is why the charter-moot takes a week to decide what day it is."
-> tamsin_topics

== tamsin_books ==
"The pay book. The last shift, forty years back: forty-two names, and a line drawn under them, and nothing paid. The Seam closed on a Friday."
"Brannagh was right. She'll be unbearable. I'm going to tell her anyway."
-> tamsin_topics

== tamsin_dagny ==
"She raised me, mostly by doing sums at me. She's Charter-Reeve because nobody else would stand up in the moot long enough to be elected. The moot-hall roof came in the week after. She says that wasn't her."
"She does sums on her fingers when she's frightened. She was doing them when I went down the Seam. That's why I went. Somebody had to find out what they added up to."
-> tamsin_topics

== tamsin_bye ==
{&"Right. Mind the edges."|Tamsin has gone back to the nail.|"Tell me if anything breaks. Tell me first."}
-> END
