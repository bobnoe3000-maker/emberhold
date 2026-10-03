// townsfolk.ink — Thornwick's townsfolk (world doc §5, v1.6): a hub knot each, a first word, then a
// line that changes with the time of day or what you've done. Short on purpose: people with their
// own business, not quest givers. Entry knots: <name>_hub. Bound in by src/story/adapter.js from the
// sim (sim/npcs.js varsFor; day_part 0 dawn · 1 day · 2 dusk · 3 night). Effects: their met_ flags.

VAR hero_name = ""
VAR hero_class = ""
VAR hero_origin = ""
VAR hero_level = 1
VAR party_size = 1
VAR fallen_name = ""
VAR day_part = 0
VAR flag_met_wendel = 0
VAR flag_met_bess = 0
VAR flag_met_col = 0
VAR flag_met_jory = 0
VAR flag_met_nell = 0
VAR flag_met_hedda = 0
VAR q_trial_quiet_feet = -1
VAR road_ranks = 3
VAR q_trial_cold_weather = -1
VAR q_vale_hens_under_the_hill = -1
VAR q_trial_old_roads = -1

== wendel_hub ==
{ flag_met_wendel == 0:
    "Wendel. The provisions are mine. The prices are the roads' fault." # flag: set met_wendel
- else:
    { day_part == 3:
        Wendel is on the Mule's step with a mug, off the clock. "Shop's shut. Ask me about lamp oil in the morning and I'll tell you it's gone up."
    - else:
        {&"Lamp oil's up a copper. Before you ask, it's the roads."|"Rope's cheaper than it was. Nobody's buying rope. They're buying lamp oil."|"Somebody asked for a map of the barrows. I sell bread."}
    }
}
-> END

== bess_hub ==
{ flag_met_bess == 0:
    "Bess Hale. It's my name over the door, and my father's, and it's my arm doing the work. No, I'm not the Captain's. He says it first, usually." # flag: set met_bess
- else:
    { day_part == 3:
        "Forge is banked for the night. Buy me a drink and I'll tell you what's wrong with your sword."
    - else:
        {&"The forge is open. Bring me what you wear and I'll make it better. Bring me what you won't, and I'll make it cinders."|"That edge has seen bone. Bone's hard on an edge. So are skeletons."|"Father says hello. Father says it from a chair."}
    }
}
-> END

== col_hub ==
{
- flag_met_col == 0:
    "Col. I drive the Greyholt cart. Drove it the long way round the barrows a whole month, a day out each way. Just so you know." # flag: set met_col
- road_ranks == 0:
    {&"Barrows road's open. Half a day to Greyholt. Half a day! I'll not know what to do with the other half."|"I went past where they stood. Nothing there now but the road, and my old wagon in the ditch. I'll have that back, thank you."}
- road_ranks < 3:
    "There's fewer of them on the barrows road. I counted. Didn't stop to count properly, mind."
- else:
    {&"The horse still shies at the mounds. So do I. Neither of us will say so."|"A day out of the way, both ways, for a month. Somebody ought to pay me for that day. Nobody will."|"Saw one standing in the road at dusk last week. It saluted. I didn't."|"That's my wagon on its side by the barrows road. They didn't hurt me. They just stood in front of the horse till it went over. Then they went back to facing north."}
}
{ q_trial_old_roads >= 0 && q_trial_old_roads <= 2: -> col_topics }
-> END

// ── the shaman's trial (content/quests/trial_old_roads.json; world doc v1.19) ──
== col_topics ==
+ { q_trial_old_roads == 2 } [The Scrag's quiet. Six waves. #mark: quest ready] -> col_trial_turnin
+ { q_trial_old_roads == 0 } [You leave ale out by the wheel. #mark: quest] -> col_trial_offer
+ { q_trial_old_roads == 1 } [About the long way round… #mark: quest active] -> col_trial_active
+ [Safe roads, Col.] -> END

== col_trial_offer ==
"Cup by the wheel, every night. My gran did it, and her gran. You'll laugh."
He doesn't wait to see if you do. He looks at your shaman instead.
"She was one of those. Hedge-caller. Breathed on a cut and it closed. Breathed on a man who'd beaten his wife and he coughed for a year. She showed me the first part. I never had the knack for it. Yours might."
"The long way round goes under the range, past the Scrag. Goblins. They don't stop carts the way the dead do. They just take things off them. Go and hold that hole for six waves, and I'll show your hedge-caller what she showed me."
+ [We'll hold it. #mark: quest]
    "Breathe slow when it's worst. That's the whole of it, she said. I never believed her." # quest: accept trial_old_roads
    -> col_topics
+ [Not yet.]
    "Road'll still be there. That's the trouble with roads."
    -> col_topics

== col_trial_active ==
"The Scrag, under the range past the mill. Six waves. When it's worst, breathe slow."
-> col_topics

== col_trial_turnin ==
Col takes your shaman's hand in both of his and breathes on it, once, the way you'd warm a child's fingers, and something old in the Vale breathes with him.
"One for you, one for them. That's how she said it. Go on. And leave something by your wheel tonight." # quest: turnin trial_old_roads
-> col_topics

== jory_hub ==
{ flag_met_jory == 0:
    "Jory. The Watch. Well, the rest of the Watch. The Captain's the Watch; I'm the running about." # flag: set met_jory
- else:
    { day_part == 1 || day_part == 3:
        "On my rounds. The Captain says a round's a round even when nothing's round the corner. Especially then."
    - else:
        {&"The Captain paid me this week. Out of his own purse. Don't tell him I told you. He writes it down anyway."|"If you're going down, go down with friends. That's not the Captain talking. That's me."|"I've never seen a bright-eyed one. I'd like to keep it that way."}
    }
}
-> END

== nell_hub ==
{ flag_met_nell == 0:
    "Nell Tolley. The Crossed Keys. A bed's cheap. The stairs up to it are what you pay for." # flag: set met_nell
- else:
    { day_part == 0:
        "Water's for the guests. The well's for everyone, and everyone's at it at dawn."
    - else:
        {&"Rest's five coppers a level. Don't ask what a level is. It's what the ledger says."|"You look like the stairs will be a trial. They'll still cost you."|"Maudry pours, I put people to bed. Between us, Thornwick gets by."}
    }
}
{ q_trial_quiet_feet >= 0 && q_trial_quiet_feet <= 2: -> nell_topics }
-> END

// ── the rogue's trial (content/quests/trial_quiet_feet.json) ──
== nell_topics ==
+ { q_trial_quiet_feet == 2 } [Three sergeants, and they never heard us. #mark: quest ready] -> nell_trial_turnin
+ { q_trial_quiet_feet == 0 } [You walk very quietly for an innkeeper. #mark: quest] -> nell_trial_offer
+ { q_trial_quiet_feet == 1 } [About the sergeants… #mark: quest active] -> nell_trial_active
+ [Goodnight, Nell.] -> END

== nell_trial_offer ==
Nell looks at your rogue for a long moment, the way she looks at a guest she suspects will leave by the window.
"I kept an inn before this. And before that, something else. Never mind what."
"There's sergeants in Wickham Keep who think they're hard to get behind. Put three of them down, and I'll teach your rogue what I used to do on stairs."
+ [Done. #mark: quest]
    "Don't tell Maudry. She'll want to charge for it." # quest: accept trial_quiet_feet
    -> nell_topics
+ [Not yet.]
    "Suit yourself. The stairs'll still creak for you."
    -> nell_topics

== nell_trial_active ==
"Three Redhand sergeants in the Keep. They shout. People who shout never listen for anyone behind them."
-> nell_topics

== nell_trial_turnin ==
Nell takes your rogue up the Crossed Keys' stairs and back down again, twice, and the stairs don't make a sound either time.
"Weight on the edge, not the middle. Breathe out when they breathe in. And when they turn round, be somewhere else. There. That's worth more than the room." # quest: turnin trial_quiet_feet
-> nell_topics

== hedda_hub ==
{ flag_met_hedda == 0:
    "Hedda. Eggs, if you want them. I know the weather, too, but I don't sell that." # flag: set met_hedda
- else:
    {
    - day_part == 0:
        "Fog off the fields this morning. It'll burn off by noon, same as yesterday. Eggs?"
    - day_part == 2:
        "Wind's turning. Rain tomorrow, or not. I'm right more often than Lord Pellam."
    - else:
        {&"The hens stopped laying the week the barrows opened. They've started again. Hens don't hold grudges."|"Folk say the dead walk in step. So do the geese. Nobody writes to Greyholt about the geese."|"Two for a copper, and I'll not tell anyone you bought eggs before going to fight the dead."}
    }
}
{ (q_trial_cold_weather >= 0 && q_trial_cold_weather <= 2) || (q_vale_hens_under_the_hill >= 0 && q_vale_hens_under_the_hill <= 2): -> hedda_topics }
-> END

// ── the mage's trial (content/quests/trial_cold_weather.json) ──
== hedda_topics ==
+ { q_vale_hens_under_the_hill == 2 } [Old Skarn's been told. #mark: quest ready] -> hedda_hens_turnin
+ { q_vale_hens_under_the_hill == 0 } [You're short of hens. #mark: quest] -> hedda_hens_offer
+ { q_vale_hens_under_the_hill == 1 } [About your hens… #mark: quest active] -> hedda_hens_active
+ { q_trial_cold_weather == 2 } [It listened. Six waves in the chapel. #mark: quest ready] -> hedda_trial_turnin
+ { q_trial_cold_weather == 0 } [Does the weather really listen to you? #mark: quest] -> hedda_trial_offer
+ { q_trial_cold_weather == 1 } [About the chapel… #mark: quest active] -> hedda_trial_active
+ [Two eggs, then.] -> END

// ── her hens (content/quests/vale_hens_under_the_hill.json; world doc v1.19) ──
== hedda_hens_offer ==
"Four. Four hens since the thaw, and a green hand through the slats where the fox used to come. It isn't a fox."
"The carters go the long way round now, under the range, and the goblins up there have found out what falls off a cart. Hens don't fall off carts. They came down for them."
"There's a hole in the scar at the foot of the range, north of the mill. The one with the drum is their chief. Old Skarn, the carters call him. Go and tell him about my hens."
+ [We'll tell him. #mark: quest]
    "Tell him loudly. I'll know if you whisper." # quest: accept vale_hens_under_the_hill
    -> hedda_topics
+ [Not now.]
    "They'll be back for the geese. Then you'll hear about it."
    -> hedda_topics

== hedda_hens_active ==
"The Scrag, at the foot of the range, north of the mill. Down two floors, where the drum is. Put the drummer down and the rest stop coming."
-> hedda_topics

== hedda_hens_turnin ==
"No drum last night. First quiet night since the thaw." She counts the hens in her head, and doesn't say the number.
"I'll not get the four back. But nobody else will lose theirs, and that's the same as winning in this town. Here. And take a dozen eggs. Don't argue." # quest: turnin vale_hens_under_the_hill
-> hedda_topics

== hedda_trial_offer ==
"It does. Not always. Nobody listens always."
Hedda looks at your mage the way she looks at the sky before she says whether it'll rain.
"You've the hands for it. Go and stand in the Sunken Chapel, where it's damp and cold and full of things that don't like either. Six waves. See if the cold comes when you call it."
+ [We'll go. #mark: quest]
    "Wrap up. I'm not joking. That's half of it." # quest: accept trial_cold_weather
    -> hedda_topics
+ [Not yet.]
    "No hurry. Weather's patient. It's the only thing that is."
    -> hedda_topics

== hedda_trial_active ==
"The Sunken Chapel. Six waves. When it's coldest, don't fight it. Ask it."
-> hedda_topics

== hedda_trial_turnin ==
Hedda holds out her hand, palm down, over the eggs, and for a moment there's frost on the shells.
"There. That's all it is. A hard frost, early, and you decide where it lands. Don't tell anyone I can do that. They'll want it for the milk." # quest: turnin trial_cold_weather
-> hedda_topics
