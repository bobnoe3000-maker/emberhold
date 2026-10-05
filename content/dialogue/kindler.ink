// kindler.ink — the Kindler (Master Corvane Vell), voice of the Cinder Cult (world doc §5, §6, v1.29): charismatic,
// sincere, and wrong. Met once, long before the end, on the Canal Locks' first floor by its way in: a courteous man
// in a plain coat preaching to whoever will sit. He won't give his name, and leaves on the Cult's boat when he's said
// his piece: `# flag: set met_kindler` is his last line, and the sim takes him out of the room once it's set
// (npcs.js `visitor`). Entry: kindler_hub. Bound in by src/story/adapter.js from the sim (quests.js: q_ / s_ for
// The Locks, whose first step is hearing him out). He never threatens anyone. He doesn't need to.

VAR hero_name = ""
VAR hero_class = ""
VAR hero_origin = ""
VAR hero_level = 1
VAR party_size = 1
VAR fallen_name = ""
VAR day_part = 0
VAR flag_met_kindler = 0
VAR q_ch2_the_locks = -1
VAR s_ch2_the_locks = 0
VAR boss_robed_stranger = 0

== kindler_hub ==
A man in a plain grey coat sits on an upturned bucket by the lock-keepers' door, talking to nobody in particular. The bound lock-men stand along the far wall with their windlasses, quite still, listening. He stands when he sees you, and smiles as if you were expected.
"Come in, come in. Mind the step: it's older than the canal. Sit, if you'd like. Nobody here will hurt you while I'm talking. They like to listen."
{ boss_robed_stranger == 1: "You were at the Sunken Chapel, I think. A young man of ours died there with something warm in his hand. I'm sorry for it. He was very sure of himself. I tried to teach him not to be." }
-> kindler_talk

== kindler_talk ==
+ [Who are you?] -> kindler_name
+ [What are you telling them?] -> kindler_sermon
+ [The lock-men are dead.] -> kindler_dead

== kindler_name ==
"Somebody who lights lamps that have gone out. Names are for rolls, and I've read enough rolls to know what they're for."
"Call me whatever the Sisters call me. They'll have something. They always have something."
-> kindler_more

== kindler_sermon ==
"That nobody needs to be tired any more."
"Look at them. Three hundred years at the windlass, and not a complaint. No hunger. No grief. No bad backs. The empire found the one thing that makes people stop hurting, and then it was ashamed of it, and buried it, and called the burying a mercy."
"I don't think it was a mercy. I think it was a waste."
-> kindler_more

== kindler_dead ==
"Are they?" He looks along the wall as if counting them. "They're quiet, and they're useful, and nobody's frightened of them but you. I've met living men I could say less for."
-> kindler_more

== kindler_more ==
+ [What happens to the people in the cages?] -> kindler_cages
+ [You're coming with us.] -> kindler_go
+ [Enough.] -> kindler_go

== kindler_cages ==
"They're kept. Carefully. Nothing that's kept is lost." He says it gently, the way you'd say it to a child at a funeral. "You'll see. Not today. But you'll see."
-> kindler_go

== kindler_go ==
Somewhere below, a boat bumps the lock gate. He looks toward the sound, then back at you, and buttons his coat.
"That's mine. I'd ask you to come, but you'd say no, and I'd rather you said it later, when you've had a chance to think." He nods to the lock-men, who don't nod back. "They'll be restless when I've gone. They don't like it when the talking stops. Be kind to them, if you can."
{ q_ch2_the_locks == 1 && s_ch2_the_locks == 0: Dace will want to know he wouldn't give a name. }
He steps through the lock-keepers' door, and down, and the boat's lantern goes off up the canal without hurrying. # flag: set met_kindler
-> END
