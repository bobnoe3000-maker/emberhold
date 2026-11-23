// ashgate.ink — Ashgate's people (world doc §3.3, v1.53 "Ashgate's people"), as townsfolk.ink is Thornwick's: a hub
// knot each, a first word, then a line that changes with the time of day or what you've done. The keepers of the town's
// services open their window from a word with them, as Maudry opens the Mule's board. Short on purpose: people with
// their own business. (v1.54) Some give work too: Hob's Paid by Weight and Mother Coke's Gone Back to Work (Act III's
// third and fourth chapters), Gunnar's shame and Old Brannagh's shrine, and the trials at 24 (Haldor, Hob, Brannagh,
// Mother Coke). Entry knots: <name>_hub. Bound in by src/story/adapter.js from the sim (sim/npcs.js varsFor; day_part
// 0 dawn · 1 day · 2 dusk · 3 night; core.js boss_<id>; quests.js q_ −1 locked · 0 available · 1 active · 2 ready ·
// 3 done). Effects: their met_ flags; quest tags; `# service: <kind>` opens that window after the talk.

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
VAR boss_weighmaster = 0
VAR boss_oruth = 0
VAR q_ch3_paid_by_weight = -1
VAR q_ch3_gone_back_to_work = -1
VAR q_gunnar_the_lease = -1
VAR q_gunnar_the_row = -1
VAR q_brannagh_last_wages = -1
VAR q_brannagh_counted_in = -1
VAR q_trial24_fighter = -1
VAR q_trial24_rogue = -1
VAR q_trial24_cleric = -1
VAR q_trial24_shaman = -1

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
{ q_ch3_paid_by_weight == 1: "Davy Pruett. By the yard gate. Thin, ink on his cuffs, talks like he's paid by the word. He isn't. Not by the Assay, anyway." }
{ q_ch3_paid_by_weight == 3: "The Weighmaster's down, I hear. The Assay's hired a new one. He weighs heavier. They always do." }
-> hob_topics

== hob_topics ==
+ { q_ch3_paid_by_weight == 0 } [We need to get into the Assay Yards. #mark: quest] -> hob_weight_offer
+ { q_ch3_paid_by_weight == 1 } [About the Yards… #mark: quest active] -> hob_weight_active
+ { q_trial24_rogue == 2 } [Five passes. #mark: quest ready] -> hob_trial_turnin
+ { q_trial24_rogue == 0 } [What would you teach a rogue? #mark: quest] -> hob_trial_offer
+ { q_trial24_rogue == 1 } [About the passes… #mark: quest active] -> hob_trial_active
+ [Just passing.] -> END

// ── Act III, chapter 3: Paid by Weight (content/quests/ch3_paid_by_weight.json; Dagny takes it in) ──
== hob_weight_offer ==
"The Yards. Everybody wants into the Yards and nobody wants to be seen wanting it." He looks at the well, not at you. "The night shift's rolls are under them, in what the Assay calls the quota office. It was the Throne's, once. They kept the name. They liked it."
"The gate wants a pass. There's a clerk at Kell's Rest, Davy Pruett, who owes me for something he'd rather his mother didn't hear about. He'll have a pass for you. He'll talk while he gives it you. Let him."
+ [What's your price? #mark: quest]
    "You'll owe me. I'll know when." He taps the side of his nose, which is a thing Hob does instead of smiling. "Pruett, at the yard gate. Then down. A man with a scale-pan keeps the office. They call him the Weighmaster. He'll weigh you. Don't be the heaviest." # quest: accept ch3_paid_by_weight
    -> hob_topics
+ [Not yet.]
    "Doors keep. That's what they're for."
    -> hob_topics

== hob_weight_active ==
"West, by the Kell road, under the dead mountain. Pruett at the gate, then down under the Yards to the quota office. The rolls go to Dagny. Not to me. I don't want to know what's on them. I already know."
-> hob_topics

// ── the rogues' trial at 24 (content/quests/trial24_rogue.json) ──
== hob_trial_offer ==
"Light fingers. Everybody thinks it's about the fingers. It's about being close enough that nobody thinks to look at them."
"The Assay's guard-captains carry passes on their belts. Five of them. Your rogue gets close enough to take them, and the captains won't be needing them after."
+ [We'll bring you five. #mark: quest]
    "The Yards. Every fifth lot, the ones with the brass on their collars. Don't bring me six. Six is greedy." # quest: accept trial24_rogue
    -> hob_topics
+ [Not now.]
    "Fingers keep too."
    -> hob_topics

== hob_trial_active ==
"Five passes off five captains, in the Yards. You'll know them by the brass."
-> hob_topics

== hob_trial_turnin ==
Hob counts the passes without seeming to look at them, and they are gone into his coat before he's finished.
"Here's the thing your rogue's learned: a scatter of iron underfoot, and a man who's chasing you stops chasing and starts dancing. Caltrops. Old as roads." # quest: turnin trial24_rogue
-> hob_topics

// ── Old Brannagh, on the Shrine's step: the Last Flame, and the shift counted in and out ──
== brannagh_hub ==
{ flag_met_brannagh == 0:
    An old woman sits on the Shrine's step beside a lamp in an iron cage. It's small and it's never been let go out. She is counting under her breath, and finishes before she looks at you.
    "Brannagh. I was the Seam's lamp woman, forty years. Gave the shift its lamps going down and took them back coming up. Now I keep this one. It's less walking." # flag: set met_brannagh
- else:
    {&"Twelve went out on the night cart this week. None back. I count them anyway. You don't stop counting because the sum's wrong."|"The Last Flame. Older than the charter, and never let go out. Somebody has to keep one in. It might as well be somebody who counts."|"The Seam closed on a Friday. They never paid the last shift. I've said so for forty years. Nobody listens to a lamp woman."}
    { boss_foreman == 1: "You've been down the Seam. I can smell the old gallery on you. Are my lamps still on their hooks? Two hundred. I hung every one." }
}
{ q_brannagh_last_wages == 3 && q_brannagh_counted_in < 1: "Paid. Forty years late, to grandchildren mostly, but paid. The Seam's square now. The Cinderworks isn't." }
-> brannagh_topics

== brannagh_topics ==
+ { q_brannagh_last_wages == 2 } [The Seam's last wages. #mark: quest ready] -> brannagh_wages_turnin
+ { q_brannagh_last_wages == 0 } [The last shift was never paid? #mark: quest] -> brannagh_wages_offer
+ { q_brannagh_last_wages == 1 } [About the wages… #mark: quest active] -> brannagh_wages_active
+ { q_brannagh_counted_in == 2 } [The Flame burned in the Cinderworks. #mark: quest ready] -> brannagh_counted_turnin
+ { q_brannagh_counted_in == 0 } [You counted the night shift out. #mark: quest] -> brannagh_counted_offer
+ { q_brannagh_counted_in == 1 } [About the count… #mark: quest active] -> brannagh_counted_active
+ { q_trial24_cleric == 2 } [The count's said in the cage store. #mark: quest ready] -> brannagh_trial_turnin
+ { q_trial24_cleric == 0 } [Would you teach a cleric? #mark: quest] -> brannagh_trial_offer
+ { q_trial24_cleric == 1 } [About the count… #mark: quest active] -> brannagh_trial_active
+ [Can the Shrine help us?]
    "It raises the fallen, if you can pay. The Flame does the raising. I do the charging." # service: temple
    -> END
+ [Mind the Flame.]
    "I always do."
    -> END

// ── Old Brannagh's shrine, 1: The Last Wages (content/quests/brannagh_last_wages.json) ──
== brannagh_wages_offer ==
"The last shift. Forty-two of them, coming up the ladder on a Friday, and the pay office shut its grille in their faces. The Seam's done, the clerk said. Wages to follow."
"They didn't follow. They're still down there, in the strongboxes behind the grille. I know. I counted them going in."
+ [We'll bring them up. #mark: quest]
    "Two boxes, anywhere in the Seam. The pay office, off the lamp room, had them last. Don't count it. I'll count it." # quest: accept brannagh_last_wages
    -> brannagh_topics
+ [Not now.]
    "It's waited forty years. It's good at it."
    -> brannagh_topics

== brannagh_wages_active ==
"The Cold Seam. Two boxes, anywhere you find them. Try the pay office first, behind the grille."
-> brannagh_topics

== brannagh_wages_turnin ==
Brannagh tips the strongboxes out on the Shrine's step and counts, coin by coin, with her lips moving. The sum comes out the same twice. She looks almost disappointed.
"Forty-two wages. Most of them have children, and the children have children. It'll go further split. Money does, when it's late enough." # quest: turnin brannagh_last_wages
-> brannagh_topics

// ── Old Brannagh's shrine, 2: Counted In (content/quests/brannagh_counted_in.json) ──
== brannagh_counted_offer ==
"I counted the night shift out. Every one, onto the cart. I can't count them in from here. The Cinderworks is too far for my knees."
"Take a lamp off the Flame. Carry it down to the pens, and hold it there, lit, so whoever's still in there can see the way. Somebody has to be standing where they come out."
+ [We'll carry it. #mark: quest]
    She lights a lamp off the Flame and gives it you as if it were a baby. "Six turns of the fighting. Then it'll have been there long enough to count." # quest: accept brannagh_counted_in
    -> brannagh_topics
+ [Not yet.]
    "The Flame'll keep. It always has."
    -> brannagh_topics

== brannagh_counted_active ==
"The Cinderworks. The lamp lit, six turns of the fighting, where the shift can see it."
-> brannagh_topics

== brannagh_counted_turnin ==
You give her back the lamp. She takes it with both hands and sets it by the Flame, and they burn the same.
"Then I've counted. It's short. I knew it would be." She writes on the slate by the door: the number out, the number in, and the difference, underlined. # quest: turnin brannagh_counted_in
"Somebody should write the difference down. Otherwise it's just a number."
-> brannagh_topics

// ── the clerics' trial at 24 (content/quests/trial24_cleric.json) ──
== brannagh_trial_offer ==
"The Assay keeps a cage store under the Yards. The night shift's chains are on the walls. Nobody counted them out. Not properly."
"Send me a cleric. Have them stand among the chains and count, while the Assay's men object. Six turns of it. Counting out is how you learn counting in."
+ [We'll count. #mark: quest]
    "Under the Yards, the cage store. Out loud. They'll hear." # quest: accept trial24_cleric
    -> brannagh_topics
+ [Not yet.]
    "I've counted alone forty years. A while longer won't hurt."
    -> brannagh_topics

== brannagh_trial_active ==
"The cage store, under the Yards. Six turns of the fighting. Out loud."
-> brannagh_topics

== brannagh_trial_turnin ==
"Good. Then here's the other way." Brannagh puts her hand on the Flame's cage. "When one of yours goes down, you kneel, and you count them back in. One. That's all it takes. One, said like you mean it." # quest: turnin trial24_cleric
"The Shrine does it for coin. You'll do it for nothing, once a fight. Don't tell the Shrine."
-> brannagh_topics

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
+ { q_trial24_fighter == 2 } [The counting house held. #mark: quest ready] -> haldor_trial_turnin
+ { q_trial24_fighter == 0 } [What would you teach a fighter? #mark: quest] -> haldor_trial_offer
+ { q_trial24_fighter == 1 } [About the counting house… #mark: quest active] -> haldor_trial_active
+ [Can you improve this?]
    "I can improve anything. Whether you can pay for it's another sum." # service: smith
    -> END
+ [Another time.]
    -> END

// ── the fighters' trial at 24 (content/quests/trial24_fighter.json) ──
== haldor_trial_offer ==
"A blade's not finished when it leaves the forge. It's finished when it's held something. Then you know what it's made of." He looks at your fighter's sword. "Most aren't made of much."
"The Assay's counting house at the Yards. Have your fighter hold it, ten turns of the fighting. Not an inch. Then come back and I'll show them what a blade does when it's tempered."
+ [Ten waves. #mark: quest]
    "The counting house, the first floor's hall. Ten. I'll know if it's nine." # quest: accept trial24_fighter
    -> haldor_topics
+ [Not yet.]
    "Iron keeps."
    -> haldor_topics

== haldor_trial_active ==
"The counting house at the Yards. Ten waves. Not an inch."
-> haldor_topics

== haldor_trial_turnin ==
Haldor takes your fighter's sword, sights down it, and grunts, which is as near as he comes to praise.
"Tempered. Now: three blades turning round you, and the man who comes inside them regrets it. Whirling Blades. It's not a trick. It's what a tempered blade does when you stop holding it so tight." # quest: turnin trial24_fighter
-> haldor_topics

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
{ q_gunnar_the_row == 3: "They're coming home. In ones and twos, and they don't look at me. That's fair. I didn't look at them, when I signed." }
-> gunnar_topics

== gunnar_topics ==
+ { q_gunnar_the_lease == 2 } [Here's your lease. #mark: quest ready] -> gunnar_lease_turnin
+ { q_gunnar_the_lease == 0 } [What did you sign? #mark: quest] -> gunnar_lease_offer
+ { q_gunnar_the_lease == 1 } [About the lease… #mark: quest active] -> gunnar_lease_active
+ { q_gunnar_the_row == 2 } [The renegades' leaders are down. #mark: quest ready] -> gunnar_row_turnin
+ { q_gunnar_the_row == 0 } [What about the ones who went over? #mark: quest] -> gunnar_row_offer
+ { q_gunnar_the_row == 1 } [About the Forgehall… #mark: quest active] -> gunnar_row_active
+ [Drink up, Gunnar.] -> END

// ── Gunnar Slagg's shame, 1: The Lease (content/quests/gunnar_the_lease.json) ──
== gunnar_lease_offer ==
"I signed it. I never read it. There was a lot of it, and the man was very polite, and the coin was on the table." He turns the mug round. "Morrow Vane. Lovely hand. He wrote out my name for me, so I'd spell it right."
"The Assay keeps the lease at the Yards, in their counting house. I'd like to read what I sold. All of it. Then I'll know what to be ashamed of, instead of everything."
+ [We'll fetch it. #mark: quest]
    "The Yards' chests, any floor. Filed under the year. They file everything." # quest: accept gunnar_the_lease
    -> gunnar_topics
+ [Not now.]
    "It'll keep. It's paper. Paper keeps better than people."
    -> gunnar_topics

== gunnar_lease_active ==
"The Assay Yards. Any two of their chests'll do it. They keep the lease with the tickets."
-> gunnar_topics

== gunnar_lease_turnin ==
Gunnar reads the lease twice, with his finger, the way a man reads a letter he already knows the end of.
"First page: the roofs. Very generous. Second page: the seams. Third page." He stops. "'The lessor to furnish a night shift from among his own people, at the agreed rate.' That's us. I sold them us." # quest: turnin gunnar_the_lease
He folds it very small and doesn't drink for a while.
-> gunnar_topics

// ── Gunnar Slagg's shame, 2: The Row (content/quests/gunnar_the_row.json) ──
== gunnar_row_offer ==
"When Oruth woke, some of ours went to the Forgehall. Our own ancestor, working again. They thought it meant something. It does. It means somebody's using him."
"Their leaders keep the rest there. Put the leaders down. The rest will come home. They'll hate me, home. That's better than the Forgehall."
+ [We'll send them home. #mark: quest]
    "The Forgehall. The Assay walled its doors, so you go in at the Cinderworks gate and down. The leaders come with every fifth lot, with braids to the waist. Three of them." # quest: accept gunnar_the_row
    -> gunnar_topics
+ [Not yet.]
    "No. Not yet. I've been saying not yet for a year."
    -> gunnar_topics

== gunnar_row_active ==
"The Forgehall. Three of the renegades' leaders. The rest will follow anyone who isn't them."
-> gunnar_topics

== gunnar_row_turnin ==
Gunnar listens, nods, and puts his mug down on the Rest's table, and leaves it there, and walks out into the square where the whole row can see him.
"Somebody should be standing here when they come in." # quest: turnin gunnar_the_row
-> gunnar_topics

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
{ q_ch3_gone_back_to_work == 3: "He's asleep. The fortieth verse rhymes again. I sing it every night now, to be sure. Quietly. He was always a light sleeper." }
-> coke_topics

== coke_topics ==
+ { q_ch3_gone_back_to_work == 2 } [Oruth's asleep. #mark: quest ready] -> coke_oruth_turnin
+ { q_ch3_gone_back_to_work == 0 } [The Forgehall's lit. #mark: quest] -> coke_oruth_offer
+ { q_ch3_gone_back_to_work == 1 } [About Oruth… #mark: quest active] -> coke_oruth_active
+ { q_trial24_shaman == 2 } [The verse is sung. #mark: quest ready] -> coke_trial_turnin
+ { q_trial24_shaman == 0 } [Would you teach a shaman the fortieth verse? #mark: quest] -> coke_trial_offer
+ { q_trial24_shaman == 1 } [About the verse… #mark: quest active] -> coke_trial_active
+ [Sing on, Mother.] -> END

// ── Act III, chapter 4: Gone Back to Work (content/quests/ch3_gone_back_to_work.json) ──
== coke_oruth_offer ==
"The Forgehall's lit. Somebody lit it, and somebody's working the anvil. Three hundred years cold." She pulls the shawl tight. "It's him. The fortieth verse. It's stopped rhyming."
"Oruth was the clans' forgemaster before there were clans to speak of. The Throne bound him to his anvil, and told us he'd gone to the Throne. He works as he was ordered. He'll work for anyone who lights the fire."
"Don't kill him. You can't. Beat him till he's tired of it, and he'll lie down and go back to sleep. Then I'll sing over him, and it'll rhyme."
+ [We'll put him to bed. #mark: quest]
    "The Assay walled the Forgehall's doors and dug in from the Cinderworks. Go in at the works gate. His forge is at the bottom of the first floor. Mind his wights. He makes them better while you watch." # quest: accept ch3_gone_back_to_work
    { boss_oruth == 1: "You've been. He's asleep already? Then I'll sing it now." }
    -> coke_topics
+ [Not yet.]
    "He's waited three hundred years to be woken. He can wait to be put down."
    -> coke_topics

== coke_oruth_active ==
"The Forgehall. Down to his own forge. Tire him out. Don't hate him for it. He's only doing as he was told, which is the worst thing anyone does."
-> coke_topics

== coke_oruth_turnin ==
You tell her how he went: how he set the hammer down on the anvil, square, the way a smith does at the end of the day, and lay down beside it, and was asleep before the forge cooled.
Mother Coke sits a long while. Then she sings, low, in the clans' old tongue, and the last line comes round to meet the first. # quest: turnin ch3_gone_back_to_work
"It rhymes." She wipes her face with a black hand and makes it worse. "Good. Now go and tell Dagny. She'll want to know who lit him. So will I."
-> coke_topics

// ── the shamans' trial at 24 (content/quests/trial24_shaman.json) ──
== coke_trial_offer ==
"The fortieth verse. The one that stops rhyming. A shaman of yours should know it, so they know what it sounds like when something's woken that shouldn't be."
"It wants singing over the clans' own ore. The Assay weighs it in sheds at the Yards. Six turns of the fighting. Sing under it."
+ [We'll sing it. #mark: quest]
    "The Yards, the first floor. Six turns. Don't sing it pretty. It isn't." # quest: accept trial24_shaman
    -> coke_topics
+ [Not yet.]
    "The verse keeps. It's kept three hundred years."
    -> coke_topics

== coke_trial_active ==
"The Yards' sheds. Six turns of the fighting, with the verse under it."
-> coke_topics

== coke_trial_turnin ==
"Good. Now the other thing the verse is for." She drives a stick into the ash of the square and ties a black rag to it. "A post. The spirits gather to it, and they pull. Whoever's near it is held, and whoever's ours is helped." # quest: turnin trial24_shaman
"Spirit Totem, the Guild calls it. The clans call it a stick. It works either way."
-> coke_topics
