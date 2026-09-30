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
        {&"The forge isn't taking custom yet. When it is, bring me old legion iron. It's better than anything we can buy."|"That edge has seen bone. Bone's hard on an edge. So are skeletons."|"Father says hello. Father says it from a chair."}
    }
}
-> END

== col_hub ==
{ flag_met_col == 0:
    "Col. I drive the Greyholt cart. Drove it the long way round the barrows a whole month, a day out each way. Just so you know." # flag: set met_col
- else:
    {&"The horse still shies at the mounds. So do I. Neither of us will say so."|"A day out of the way, both ways, for a month. Somebody ought to pay me for that day. Nobody will."|"Saw one standing in the road at dusk last week. It saluted. I didn't."}
}
-> END

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
-> END

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
-> END
