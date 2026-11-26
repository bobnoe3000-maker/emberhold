// tamsin.ink — Tamsin Coalbrook, Dagny's niece, a mage-smith and the Reach's found companion (mage; world doc §3.3,
// v1.53): she works iron with her hands and with the Ember both, which the clans think is showing off. She went down the
// Cold Seam after its books, and the Scrag Warren's goblins kept her at their anvil in the tally cave for the forge-work
// she can do. Entry: tamsin_hub: in the tally cave while she waits there, and from her card once she's with you (party
// or bench). Bound in by src/story/adapter.js from the sim (sim/npcs.js varsFor: joined 0 / 1, party or bench;
// in_party 0 / 1; core.js: boss_<id> 0 / 1). Effects: flags: met_tamsin; `# companion: join` (heroes.js: only once
// the Foreman has fallen). She gives her own chain, Showing Off (world doc §5: tamsin_the_stamp, tamsin_the_patterns,
// tamsin_spoiled_casting), gated on `joined` through her hub. (v1.154; the owner, 2026-11-26: no quest needs a
// companion) Act III's last chapter, Quota, and the mages' trial at 24, Ask the Iron, are Dagny's now (dagny.ink): Tamsin
// only talks about them and sends you to her aunt. She isn't bound their q_ (quests.js varsFor binds a quest's giver and
// taker), so what she says reads the bosses.

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
VAR boss_stoker = 0
VAR boss_morrow_vane = 0
VAR q_tamsin_the_stamp = -1
VAR q_tamsin_the_patterns = -1
VAR q_tamsin_spoiled_casting = -1

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
{ boss_morrow_vane == 1 && boss_stoker == 0: "The Magma Vault. Under the Cinderworks. I can feel it from here, like a forge with the door open." }
{ boss_stoker == 1: "The mould was empty. I keep thinking about the shape of it. I could draw it for you. I'd rather not." }
-> tamsin_topics

== tamsin_greet_fallen ==
Tamsin keeps looking back the way you came, for {fallen_name}.
"I can mend most things. Not that. Take them to Old Brannagh. She'll light a candle off the Flame, and she'll count them back in."
-> tamsin_topics

== tamsin_topics ==
+ { boss_morrow_vane == 1 && boss_stoker == 0 } [Where did the night shift go?] -> tamsin_quota_offer
+ { q_tamsin_the_stamp == 2 } [Three of the Assay's stamps. #mark: quest ready] -> tamsin_stamp_turnin
+ { q_tamsin_the_stamp == 0 } [What do you want with the Assay? #mark: quest] -> tamsin_stamp_offer
+ { q_tamsin_the_stamp == 1 } [About the stamps… #mark: quest active] -> tamsin_stamp_active
+ { q_tamsin_the_patterns == 2 } [The Forgehall's patterns. #mark: quest ready] -> tamsin_patterns_turnin
+ { q_tamsin_the_patterns == 0 } [What did the old smiths cast? #mark: quest] -> tamsin_patterns_offer
+ { q_tamsin_the_patterns == 1 } [About the patterns… #mark: quest active] -> tamsin_patterns_active
+ { q_tamsin_spoiled_casting == 2 } [The moulds are cracked. #mark: quest ready] -> tamsin_casting_turnin
+ { q_tamsin_spoiled_casting == 0 } [Could you spoil their moulds? #mark: quest] -> tamsin_casting_offer
+ { q_tamsin_spoiled_casting == 1 } [About the moulds… #mark: quest active] -> tamsin_casting_active
+ [Would you teach a mage to ask?] -> tamsin_trial_offer
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

// ── Act III, chapter 6: Quota (content/quests/ch3_quota.json): Dagny gives it (v1.154); Tamsin says where they went ──
== tamsin_quota_offer ==
"The pens were empty because they took them down. Under the Cinderworks there's the Magma Vault, and in the Vault there's Furnace Nine. I've heard it all the way from Ashgate. It's hungry. Iron isn't, usually."
"A furnace-priest keeps its lamp. The Stoker, the Assay's men call him. Break the lamp and whatever's in it goes free. Whoever's still alive down there walks out."
"Aunt Dagny's sending people down after them. She'll want to send you herself. It's most of what a Charter-Reeve is for."
"And they've been casting something down there, in pale iron. When you go, I want to see the mould."
-> tamsin_topics

// ── Showing Off, 1: The Assay's Stamp (content/quests/tamsin_the_stamp.json) ──
== tamsin_stamp_offer ==
"The Assay stamps everything it weighs. Ore, iron, men. Its guard-captains carry the stamps on their belts, at the Yards."
"I want three. I want to know their mark by feel, so when I put my thumb on something they've made I know whose it is."
+ [We'll get you three. #mark: quest]
    "The Yards. The captains lead every fifth lot. Brass on the collar, stamp on the belt." # quest: accept tamsin_the_stamp
    -> tamsin_topics
+ [Not now.]
    "Fine. I'll practise on Haldor's."
    -> tamsin_topics

== tamsin_stamp_active ==
"Three stamps off three captains, at the Assay Yards."
-> tamsin_topics

== tamsin_stamp_turnin ==
Tamsin turns the stamps over in her fingers, one after another, with her eyes shut.
"Scales over a pick. Badly cut. The pick's handle is too short; whoever cut it never held one." She opens her eyes. "I'll know it now. Anywhere." # quest: turnin tamsin_the_stamp
-> tamsin_topics

// ── Showing Off, 2: The Pattern Store (content/quests/tamsin_the_patterns.json) ──
== tamsin_patterns_offer ==
"The Forgehall was the Throne's own forge. The old smiths kept their patterns there, every shape they ever cast. If the Assay is casting something, it learned how from those shelves."
"Bring me what's in the chests. I want to read them the way you read a letter."
+ [We'll bring them. #mark: quest]
    "The Forgehall. It's under the Cinderworks now: the Assay dug in from the works. Two chests, any floor you like. The pattern store's are the heavy ones." # quest: accept tamsin_the_patterns
    -> tamsin_topics
+ [Not now.]
    "They've waited three hundred years to be read. Patterns are patient. Smiths aren't."
    -> tamsin_topics

== tamsin_patterns_active ==
"The Forgehall's chests. Two. The patterns are wood and wax, wrapped in oilcloth. Don't drop them."
-> tamsin_topics

== tamsin_patterns_turnin ==
She unwraps the patterns on her knee, one at a time. Little lamps, every one the same, a shelf's worth.
"Lamp patterns. Throne measure. Forty to a shelf." She fits one into her palm. "Each to hold one. One what, it doesn't say. It doesn't need to." # quest: turnin tamsin_the_patterns
She wraps them up again more carefully than she unwrapped them.
-> tamsin_topics

// ── Showing Off, 3: Spoiled Casting (content/quests/tamsin_spoiled_casting.json) ──
== tamsin_casting_offer ==
"The Cult keeps spare moulds in the Magma Vault, stacked on the floor, ready. If the first casting fails, they'll pour another."
"I can crack them where they stand. Ask the iron in them to let go. It takes a while, and it takes quiet, and the Magma Vault isn't quiet. Hold the floor round me."
+ [We'll hold it. #mark: quest]
    "The Magma Vault. Five turns of the fighting. I'll be the one on her knees with her hand on a mould, looking busy. I will be." # quest: accept tamsin_spoiled_casting
    -> tamsin_topics
+ [Not now.]
    "They'll still be there. Moulds don't go anywhere. That's the point of them."
    -> tamsin_topics

== tamsin_casting_active ==
"The Magma Vault. Five waves. I'll do the rest."
-> tamsin_topics

== tamsin_casting_turnin ==
"Every one of them. Cracked through, end to end. They'll ring wrong if anyone taps them, and they'll split if anyone pours." # quest: turnin tamsin_spoiled_casting
"The clans would say that was showing off. The clans are right. It felt wonderful."
-> tamsin_topics

// ── the mages' trial at 24 (content/quests/trial24_mage.json): Dagny gives it from Tamsin's notes (v1.154) ──
== tamsin_trial_offer ==
"Your mages tell the fire what to do. That works. It's loud. Asking's quieter, and it reaches further."
"I wrote it all down for Aunt Dagny, properly, with drawings. Ask her for the notes. They're better than me explaining. I'd only show off."
-> tamsin_topics
