// quaile.ink — Hester Quaile, Speaker of the Tidemark League and harbourmistress of Tollhaven (world doc v1.69 §3.7),
// by the Paid Toll's door. Everything that comes in under the chain pays, and she tolls talk the same way: a question
// has its price, which she names and then waives (her one device: copy-review §8; at most once a knot). Not Hester
// Lowe, the Vale's beekeeper (hester.ink). Act IV's main giver. Entry: quaile_hub. Bound in by src/story/adapter.js
// from the sim (sim/npcs.js varsFor: with_maren 0 / 1, her chaplain with you, party or bench; core.js boss_<id>;
// quests.js: q_ = −1 locked · 0 available · 1 active · 2 ready · 3 done, read before this conversation counts:
// Consigned is a word with her, so it's ready by the time she reads Ilse's page). Flags: met_quaile.
// Act IV: she takes in chapter 1, Consigned (Ilse's), and gives chapter 2, Low Water, and Letters of Marque (Hesk on the
// Gull Isles), and after Low Water points the company at Old Gannet's Lamp Fort (gannet.ink gives The Keeper's Light).
// The name on Hesk's commission is read as a name: who Lucanus is, and that he sang on the mole, is for later chapters.
// After both of those she gives Brine Cross (ch4_brine_cross): the drowned fleet's crews come down the Highmarch road and
// west for the bridge, the League holds its east barricade, and Old Gannet breaks his lamp on it (docs/tidemark-plan.md,
// step 5). She learns what his weekly report meant from the company, at the turn-in; Highmarch, Maren's chapter, is next.

VAR hero_name = ""
VAR hero_class = ""
VAR hero_origin = ""
VAR hero_level = 1
VAR party_size = 1
VAR fallen_name = ""
VAR day_part = 0
VAR flag_met_quaile = 0
VAR with_maren = 0
VAR boss_harbourmaster = 0
VAR boss_hesk = 0
VAR q_ch4_consigned = -1
VAR q_ch4_low_water = -1
VAR q_ch4_letters_of_marque = -1
VAR q_ch4_brine_cross = -1

== quaile_hub ==
{ q_ch4_consigned == 1 || q_ch4_consigned == 2: -> quaile_consigned_meet }
{ flag_met_quaile == 0: -> quaile_first_meet }
{ fallen_name != "": -> quaile_greet_fallen }
-> quaile_greet_back

== quaile_first_meet ==
A tall woman in a salt-stiff coat stands by the Paid Toll's door with a slate under her arm, watching the harbour chain as if it might try to leave without paying.
"Hester Quaile. Harbourmistress, and Speaker of the League, which is the same work with more chairs." # flag: set met_quaile
"Talk on this quay is a penny a question. The first one's free. The League likes a customer to come back."
-> quaile_origin

== quaile_origin ==
{
- hero_origin == "deepdelver_fostered":
    "Clan-raised, and this far from a mountain. You'll hate the sea for a week. Everyone from under a hill does. Then you'll only dislike it, like the rest of us."
- hero_origin == "redhand_deserter":
    "Redhand. Your old Company went up the Highmarch road this spring with a cart of crossbows, and paid my gate in full. I've never known the Redhand pay anything in full. It worries me."
- hero_origin == "grey_sisters_ward":
    "A Sisters' ward. Our chaplain's one of yours. She prays for everything on this quay and charges for none of it. It's bad for trade."
- hero_origin == "thornwick_born":
    "Thornwick. Your wool comes through here on its way to everywhere, and pays wharfage going out and again coming back as cloth. I like Thornwick."
- else:
    "You're from inland. You keep looking at the water to see if it's moving. It is. Stand back from the edge."
}
-> quaile_topics

// ── Consigned (content/quests/ch4_consigned.json, given by Ilse): a word with her, and she takes it in ──
== quaile_consigned_meet ==
// (the first line says nothing to the sim: a line with effects is where the story waits and comes back with the sim's
// variables, and coming back to this knot's first line would start the talk over from the hub, as dagny.ink explains)
{ flag_met_quaile == 0: A tall woman in a salt-stiff coat stands by the Paid Toll's door with a slate under her arm, watching the harbour chain. | Hester Quaile is by the Paid Toll's door, watching the harbour chain. }
You show her Ilse's copy of the ledger's last page. She reads the line about the freight, and her mouth goes thin. # flag: set met_quaile
"Hester Quaile. Speaker of the League, harbourmistress, and it seems I've been paid. Freight paid at Tollhaven. That means paid to me. Everything at Tollhaven is paid to me."
"I never saw this crate. It came by the Solmere road to Brine Cross and went up the Highmarch road from there. It never came near my quay. Somebody paid my freight on goods I never touched." # quest: turnin ch4_consigned
"A harbourmistress isn't paid for nothing. I'll find out what I was paid for. That's my trouble. You can have the other one. It comes up the quays at night."
-> quaile_topics

== quaile_greet_back ==
{&Hester is watching a boat come in under the chain. She doesn't look round until it's paid.|"{hero_name}. That's twice today. The second greeting is a penny. I'll waive it."|Hester is arguing with a carter about the width of his cart. Carts are tolled by the foot.}
{ q_ch4_consigned == 0: "A Grey Sister in Thornwick has been writing to me about freight, with the postage owing. If she sent you, bring her page." }
{ q_ch4_low_water == 1 && with_maren == 0: "Gullwick, and the ferry out to the Mole. Bring my chaplain back. She went out on a boat I never cleared, and I'd like a word with her about it." }
{ q_ch4_low_water == 3 && with_maren == 1: "Sister. The ferryman's been up for his fare. I've put it on the Chapel's account." }
{ q_ch4_low_water == 3 && with_maren == 0: "Maren's still out on the Mole? Then she's saying names at it. Fetch her in. Tell her the Chapel roof leaks. It does." }
{ q_ch4_low_water == 3: "The quays are quiet at night. I've had the watch go back to counting boats. They'd got out of the habit." }
{ q_ch4_letters_of_marque == 1: "Hesk took another League ship this week. I've added her to what he owes. It's getting to be a long slate." }
{ q_ch4_letters_of_marque == 3 && q_ch4_brine_cross < 1: "I've had Hesk's commission copied to every port in the League. Lucanus. Nobody on this coast knows the name. They all will." }
{ q_ch4_brine_cross == 1: "The League's three have sent word from the bridge. Two words, and one of them was your name." }
{ q_ch4_brine_cross == 3: "The coast east of town is dark at night now. The fishing boats keep asking me why. I tell them it's a saving on oil." }
-> quaile_topics

== quaile_greet_fallen ==
"You went out with {fallen_name}. I only saw you come back." She points up the quay with the slate. "The Quay Chapel, on the square. That walk is toll-free. There are a few. The League keeps a list."
-> quaile_topics

== quaile_topics ==
+ { q_ch4_low_water == 2 } [The Harbourmaster's down. #mark: quest ready] -> quaile_low_turnin
+ { q_ch4_low_water == 0 } [What comes up the quays at night? #mark: quest] -> quaile_low_offer
+ { q_ch4_low_water == 1 } [About the Mole… #mark: quest active] -> quaile_low_active
+ { q_ch4_letters_of_marque == 2 } [Hesk's down. #mark: quest ready] -> quaile_marque_turnin
+ { q_ch4_letters_of_marque == 0 } [Why is the Gull Fleet late? #mark: quest] -> quaile_marque_offer
+ { q_ch4_letters_of_marque == 1 } [About Hesk… #mark: quest active] -> quaile_marque_active
+ { q_ch4_brine_cross == 2 } [The bridge held. #mark: quest ready] -> quaile_brine_turnin
+ { q_ch4_brine_cross == 0 } [What's the League doing at Brine Cross? #mark: quest] -> quaile_brine_offer
+ { q_ch4_brine_cross == 1 } [About Brine Cross… #mark: quest active] -> quaile_brine_active
+ { q_ch4_low_water == 3 } [Is the Fleet troubling anyone else?] -> quaile_lampfort
+ [What is the League?] -> quaile_league
+ [Tell me about Tollhaven.] -> quaile_tollhaven
+ [I'll be going.] -> quaile_bye

// ── Act IV, chapter 2: Low Water (content/quests/ch4_low_water.json): the drowned on her quays, and her chaplain ──
== quaile_low_offer ==
"The Mole. The old imperial harbour off Gullwick, sunk when the empire went. At low water you can walk on its stones. Sensible people don't."
"This month the drowned off it have been walking up my quays at night. Sailors, in what's left of the fleet's coats. They stand at the bollards as if they're waiting to be paid off. By morning they've gone back in."
"Our chaplain, Sister Maren, took a boat out to them three nights ago. On her own. She didn't clear it with me, which is the one thing on this coast nobody does."
+ [We'll go out to the Mole. #mark: quest]
    "The beach road to Gullwick. The ferryman will row you out. He'll want paying, and he's right to. Whatever keeps them walking, it'll be on the outer mole's end, where the old harbourmaster had his berths." # quest: accept ch4_low_water
    { boss_harbourmaster == 1: "You've been out already? Then come and tell me properly. I'll waive the toll on the telling." }
    -> quaile_topics
+ [Not yet.]
    "No. They'll walk again tonight. The watch is getting used to them, which I like even less."
    -> quaile_topics

== quaile_low_active ==
"The beach road to Gullwick, and the ferry out to the Mole. Down to the moles at low water, and out to the end of the outer one. And Maren."
-> quaile_topics

== quaile_low_turnin ==
{ with_maren == 1: Maren comes up the quay behind you with a boathook over her shoulder. Hester looks at her for a long moment. }
{ with_maren == 1: "You took a boat I never cleared." "You'd have said no." "I'd have charged you. It isn't the same thing." }
{ with_maren == 0: "And Maren?" You tell her about the harbour office, the boathook in its door, and the names. Hester lets her breath go. "Still out there, then. The sea will run out of drowned before she runs out of names." }
You tell her the rest: the outer mole, the Harbourmaster with his berths' book under his arm, and the lamp-stand at the end, where someone had stood and sung. # quest: turnin ch4_low_water
"Sung." She says it like a cargo she's never had to clear. "The drowned don't walk up a quay for nothing. Somebody gave them a tune to walk to."
"Singers aren't my trade. The Gull Fleet is, and it's three weeks late with its dues. Come back to me. I'll know why by then, and I won't like it."
-> quaile_topics

// ── Act IV: Letters of Marque (content/quests/ch4_letters_of_marque.json): the Gull Fleet's commission ──
== quaile_marque_offer ==
"I said I'd know why the Gull Fleet was late with its dues. It's stopped paying them. It's taking League ships instead, crews and cargo, with a paper to say it may."
"A letter of marque. Somebody has commissioned Admiral Grell Hesk to make war on my coast. He shows it to every master before his men go over the side, so they know it's lawful. He's very proud of it."
"I want that paper: who signed it, and what they paid him with. He lies up on the Gull Isles with the fleet's hulks and keeps his papers aboard. There's a toll on reading another captain's letters in this harbour. For his, I'll waive it."
+ [We'll fetch Hesk's commission. #mark: quest]
    "Out past the salt marsh to the jetty on the bay's west shore, where the fleet lands its boats. Through the sea cave to the hulks in the lagoon. Hesk keeps the flagship's great cabin, and his officers keep a wardroom." # quest: accept ch4_letters_of_marque
    { boss_hesk == 1: "Hesk's down already? Then whatever was in his wardroom is what I want. Bring it, and the story." }
    -> quaile_topics
+ [Not yet.]
    "Then I lose another ship this week. I'll send you the bill."
    -> quaile_topics

== quaile_marque_active ==
"The jetty past the salt marsh, on the bay's west shore. The sea cave, then the hulks. Hesk in his great cabin, and his papers in the wardroom. I want the one with a seal on it."
-> quaile_topics

== quaile_marque_turnin ==
{ with_maren == 1: Maren comes in off the quay behind you and stands where she can see the slate. }
You put the paper from Hesk's wardroom on Hester's slate: a letter of marque for the Gull Fleet, against the ships of the League, paid in advance.
It's signed at the foot in a wide, careful hand, *Lucanus*. Under the name is a seal of coal-red wax with no crest in it, only a thumbprint. # quest: turnin ch4_letters_of_marque
Hester reads the name aloud. "Lucanus. An emperor's kind of name. Nobody's signed like that since there were emperors."
"Paid in advance. Hesk has never been paid in advance in his life. Somebody wanted my coast cleared, and wanted it by a date."
"And this wax. The Redhand paid my gate this spring in purses sealed with it, for a cart of crossbows going up the Highmarch road. Ask anyone in the Reach who pays the Redhand."
{ with_maren == 1: Maren says two names, quietly: the masters of the last two League ships Hesk boarded. "He showed them that paper first. It made it lawful. It didn't make it anything else." }
"Somebody sang my drowned up off the Mole, and somebody paid Hesk to clear the sea in front of them. I'd like to think that's two people."
"If either of them wants anything inland, he crosses at Brine Cross. Everybody does. I'll have the League's people on that bridge. Come back to me."
-> quaile_topics

// ── Act IV: Brine Cross (content/quests/ch4_brine_cross.json): the drowned march on the bridge, the League holds it ──
// (the stand: camps.js brine_cross, eight waves at the east barricade with three of the League; held, Gannet breaks his
// lamp on it and the drowned lie down, flags.brine_held)
== quaile_brine_offer ==
"The drowned came up off the Mole two nights ago. Not to my quays this time. Every hull's worth went ashore and up the Highmarch road."
"This morning they came back down it, in step, and turned west for Brine Cross. Past the bridge is the Solmere road, and at the end of that is the old capital, where they crowned emperors."
"Whoever Lucanus is, he's sending his dead there ahead of him. The League means to hold the bridge. I've put three of ours at its east barricade. A pikeman, a crossbowman and a surgeon. Every other port sent its apologies, and a bill."
"The tollhouse on that bridge takes a toll off everyone going west. The drowned don't carry purses. I've told the tollman to waive yours."
"Gannet's report came in this morning, too. *Wind east. Light's lit, for now.* I've had that message every week since I took this chair, and he's never added a word to it."
+ [We'll hold the bridge. #mark: quest]
    "The coast road west, past where the Highmarch road comes down, and on to the bridge. Stand at the barricade with the League's three and hold it until they stop coming. You'll know the League's people. They're the ones with receipts." # quest: accept ch4_brine_cross
    -> quaile_topics
+ [Not yet.]
    "Then the League's three hold it alone a while. They're on a day rate. I'd like it to be a short day."
    -> quaile_topics

== quaile_brine_active ==
"West on the coast road, past the Highmarch road, to the bridge at Brine Cross. The east barricade, with the League's three. Hold it until the drowned stop coming."
-> quaile_topics

== quaile_brine_turnin ==
{ with_maren == 1: Maren is a step behind you, with the road's dust on her hem. }
You tell Hester about the bridge: eight crews up the road, the League's three holding with you, and then an old man behind the last of them with a lamp on his back. He broke it on the barricade, and the drowned lay down in the road. # quest: turnin ch4_brine_cross
"Gannet. Off his headland, and past my gate with that lamp on his back, and never put his head in to say."
"Every week, that report. I took it for weather. That light was the one thing on this coast nobody had told to stop."
"He'll send the League a bill for that lamp, I expect. I'll pay it without counting it. Don't tell anyone in the League. They'd want me looked at."
{ with_maren == 1: Maren says names, quietly: a bosun, two gunners, a ship's boy, men she named on the Mole. "They'll not get up again. I'll say the rest at the Chapel." }
"They came down the Highmarch road. Whoever sang them off the Mole is up that road, behind the walls. I said Highmarch would like an emperor again. It seems one has applied."
{ with_maren == 1: She looks at Maren. "And you'll want to go up that road, Sister. Clear it with them this time, if not with me." }
{ with_maren == 0: "Find Maren. She'll want to go up that road, and she'll go alone. She went out to the Mole alone." }
-> quaile_topics

// after Low Water: Old Gannet's light, and the Gull Fleet at his door (gannet.ink has The Keeper's Light)
== quaile_lampfort ==
"Old Gannet, at the Lamp Fort. His light is out on the cliffs east of town, on its headland. You'll see it from the quay at night."
"The Gull Fleet has been at his door all month. He sends me the same message every week: *Wind north-east. Light's lit.* He thinks that's a report."
"He says he's kept that light since before Tollhaven had a chain. I've never charged him for his oil, which is as well. If he's right, the bill would sink the League."
"Go out and look in on him. He won't ask. I've never known him ask anyone for anything."
-> quaile_topics

== quaile_league ==
"The Tidemark League. Every free port on this coast round one table, agreeing about nothing but the price of the chain. I'm the Speaker. I speak. That was two questions, by the way."
"Highmarch would like an emperor again. The League would like to toll him."
-> quaile_topics

== quaile_tollhaven ==
"The quay, three jetties, two moles and the chain between their towers. Everything that comes in under the chain pays. Everything that goes out pays again. It's a simple town."
"The Chain Locker if you want a bed. The Bonded Stores for rope and the rest. The Quay Forge if it's broken. The Paid Toll for everything else. The name is a promise."
-> quaile_topics

== quaile_bye ==
{&"Mind the chain on your way past. It bites."|Hester has gone back to watching the chain.|"No toll on leaving. The League is generous that way."}
-> END
