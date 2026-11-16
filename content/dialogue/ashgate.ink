// ashgate.ink — Ashgate's people (world doc §3.3, v1.53 "Ashgate's people"), as townsfolk.ink is Thornwick's: a hub
// knot each, a first word, then a line that changes with the time of day or what you've done. The keepers of the town's
// services open their window from a word with them, as Maudry opens the Mule's board. Short on purpose: people with
// their own business; Act III's chapters are Dagny's (dagny.ink). Entry knots: <name>_hub. Bound in by
// src/story/adapter.js from the sim (sim/npcs.js varsFor; day_part 0 dawn · 1 day · 2 dusk · 3 night; core.js
// boss_<id>; quests.js chapters_done). Effects: their met_ flags; `# service: <kind>` opens that window after the talk.

VAR hero_name = ""
VAR hero_class = ""
VAR hero_origin = ""
VAR hero_level = 1
VAR party_size = 1
VAR fallen_name = ""
VAR day_part = 0
VAR flag_met_hob = 0
VAR flag_met_brannagh = 0
VAR flag_met_wynn = 0
VAR flag_met_haldor = 0
VAR flag_met_bel = 0
VAR flag_met_gunnar = 0
VAR flag_met_pellam = 0
VAR flag_met_coke = 0
VAR boss_foreman = 0

// ── Hob, by the well: a fixer ──
== hob_hub ==
{ flag_met_hob == 0:
    A thin man leaning on the well looks at your boots, then your purse, then your face, in that order.
    "Hob. Just Hob. If you need a thing done, I know a man. Usually it's me." # flag: set met_hob
- else:
    { day_part == 3:
        Hob is in the well's shadow, where the lamps don't reach. "Night's my busy time. Not tonight. Tonight I'm a man leaning on a well."
    - else:
        {&"The Assay's gate at Kell's Rest wants a pass. I don't have one. I know the drawer they're kept in."|"The night cart leaves the Assay's yard at dusk, full. I've never seen it come back full. I've never seen it come back any other way than empty."|"Doors, passes, the right guard on the right night. Everything has a price. Mine's reasonable. The guard's isn't."|"Somebody's been paying for stones in the Slagborn row. Headstones. Nice ones. Paid in advance, with a very polite note."}
    }
}
-> END

// ── Old Brannagh, on the Shrine's step: the Last Flame, and the shift counted in and out ──
== brannagh_hub ==
{ flag_met_brannagh == 0:
    An old woman sits on the Shrine's step beside a lamp in an iron cage. It's small and it's never been let go out. She is counting under her breath, and finishes before she looks at you.
    "Brannagh. I was the Seam's lamp woman, forty years. Gave the shift its lamps going down and took them back coming up. Now I keep this one. It's less walking." # flag: set met_brannagh
- else:
    {&"Twelve went out on the night cart this week. None back. I count them anyway. You don't stop counting because the sum's wrong."|"The Last Flame. Older than the charter, and never let go out. Somebody has to keep one in. It might as well be somebody who counts."|"The Seam closed on a Friday. They never paid the last shift. I've said so for forty years. Nobody listens to a lamp woman."}
    { boss_foreman == 1: "You've been down the Seam. I can smell the old gallery on you. Are my lamps still on their hooks? Two hundred. I hung every one." }
}
-> brannagh_topics

== brannagh_topics ==
+ [Can the Shrine help us?]
    "It raises the fallen, if you can pay. The Flame does the raising. I do the charging." # service: temple
    -> END
+ [Mind the Flame.]
    "I always do."
    -> END

// ── Wynn Sallow, the Ashgate Exchange: two sets of scales ──
== wynn_hub ==
{ flag_met_wynn == 0:
    A neat man behind a counter with two sets of scales on it is weighing a nail on both, and writing down the bigger number.
    "Wynn Sallow. The Exchange. Buy, sell, weigh. Those are the Deepdelvers' scales, and those are the Assay's." He taps the second set. "Before you ask: those." # flag: set met_wynn
- else:
    { day_part == 3:
        Wynn is at the Slag & Bellows' end of the square with a mug, his scales nowhere near him. "Shop's shut. Everything weighs what it weighs till morning."
    - else:
        {&"The Assay's scales are a little heavy. Or the Deepdelvers' are a little light. Depends who you ask. Nobody asks me."|"Iron's up. Coal's up. Lamp oil's up. Only thing that's down in Ashgate is the night shift, and I don't sell that."|"Your Wendel in Thornwick sends his regards, and a complaint about the price of rope. He always sends both."}
    }
}
-> wynn_topics

== wynn_topics ==
+ [What have you got?]
    "What the carts brought up. Weighed fair, by somebody's weight." # service: shop
    -> END
+ [Nothing today.]
    -> END

// ── Haldor Ironmonger, the Ashgate Forge ──
== haldor_hub ==
{ flag_met_haldor == 0:
    A broad Deepdelver with a beard tucked into his apron sets his hammer down as if it might hear him.
    "Haldor Ironmonger. The Ashgate Forge. The best upgrades in the Provinces. I'd be modest about it, but it wouldn't be honest." # flag: set met_haldor
- else:
    { day_part == 3:
        "Forge is banked. I'm off. Ask me about your edges in the morning. I'll tell you they're wrong."
    - else:
        {&"Hale & Daughter, in Thornwick? Good girl. Good arm. Wrong iron."|"The Cinderworks are lit. I can taste it in the coal. Somebody up there is burning something that isn't coal."|"Tamsin Coalbrook used to sweep this floor. Then she started asking the iron things, and it started answering, and I had to sweep it myself."}
    }
}
-> haldor_topics

== haldor_topics ==
+ [Can you improve this?]
    "I can improve anything. Whether you can pay for it's another sum." # service: smith
    -> END
+ [Another time.]
    -> END

// ── Bel Ruddle, the Slag & Bellows: the board by the bellows ──
== bel_hub ==
{ flag_met_bel == 0:
    A round woman with her sleeves rolled up is haggling with a carter over a barrel, and winning.
    "Bel Ruddle. The Slag & Bellows is mine. The board's by the bellows: the Guild's jobs, and the Guild's sellswords, if you can afford them. The paper curls. The jobs don't." # flag: set met_bel
- else:
    { day_part >= 2:
        {&"The moot's in my back room again. They drink small beer and argue large. I charge for the room by the shout."|"Gunnar Slagg doesn't drink here any more. He drinks at the Rest, where his row won't see him. They see him."|"Night cart went past at dusk. I don't look at it any more. Nobody does. That's what it's counting on."}
    - else:
        {&"Barrels in the morning, beer in the evening. In between I count the barrels."|"If you're looking for Dagny, she's at my door. She's always at my door. She says it's for the light."}
    }
}
-> bel_topics

== bel_topics ==
+ [Who's looking for work?]
    "Go on, then. Mind the bellows." # service: tavern
    -> END
+ [Just passing.]
    -> END

// ── Gunnar Slagg, the Slagborn headman, who sold the lease ──
== gunnar_hub ==
{ flag_met_gunnar == 0:
    A big man in a good coat sits where nobody else would, with a mug he isn't enjoying. He looks up as if you've caught him at something.
    "Gunnar Slagg. Headman of the Slagborn." He says it as if it's a debt. "You've seen the roofs on our row? Good roofs. Best in Ashgate. Every house." # flag: set met_gunnar
- else:
    { day_part == 0:
        Gunnar is on the square at first light, looking up at the Slagborn row's new roofs as if he's checking they're still there. "They don't leak. I'll say that for them. They don't leak."
    - else:
        {&"The Assay paid in coin. Good coin. Roofs for every house, and a bit over. I thought: what's a lease? A lease is paper."|"Don't tell the row you saw me here. They know. Don't tell them anyway."|"Mother Coke won't speak to me. She'll speak about me. She does it very loud, outside my door."|"Twenty of ours took the night shift. Good pay, the Assay said. I said it too. I said it first."}
    }
}
-> END

// ── Widow Pellam, Deepdelver's Rest: the boots by the door ──
== pellam_hub ==
{ flag_met_pellam == 0:
    A thin woman in black is setting out boots by the Rest's door in a long, neat row, toes to the street.
    "Widow Pellam. The beds are mine, and the soup. Leave your boots by the door. Everybody does." # flag: set met_pellam
- else:
    { day_part == 0:
        Widow Pellam is on the square at dawn, beating the dust out of a boot against the well. "Some of these have been by the door a while. I keep them clean. They'll want them clean."
    - else:
        {&"The boots by the door? The night shift's. They lodged here. They'll be back for them." She lines one up with its neighbour. "They'll be back."|"Beds are soft, soup's hot, nobody asks your business. If you want your business asked, the Bellows is across the square."|"No relation to the lord. People ask. There's a lord Pellam in the Vale who writes three pages when one would do. My husband never wrote at all."}
    }
}
-> pellam_topics

== pellam_topics ==
+ [A bed for the night.]
    "Boots by the door." # service: inn
    -> END
+ [Not tonight.]
    -> END

// ── Mother Coke, the Slagborn's wise-woman ──
== coke_hub ==
{ flag_met_coke == 0:
    An old Slagborn woman, black-shawled and blacker-handed, sits on an upturned ore bucket and watches the road come in.
    "Mother Coke. I know the songs. All of them. Most of them are about Oruth, and most of them are long." # flag: set met_coke
- else:
    {&"There's a song about Oruth. Forty verses. In thirty-nine he's asleep under the mountain with his hammer on his chest. In the fortieth somebody wakes him, and it stops rhyming."|"He was never meant to be woken. That's not a prophecy. It's what the song says about lids: you leave them on."|"Gunnar Slagg roofed the row with the clan's lease. I'll sing that one at his burying. It's short. He'll like that."|"The Cinderworks are lit. Three hundred years cold, and the Assay had them going in a month. There's a verse about that. I'm not singing it in the street."}
}
-> END
