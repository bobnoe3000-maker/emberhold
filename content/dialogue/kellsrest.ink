// kellsrest.ink — Kell's Rest's two (world doc §3.3, v1.54 "Kell's Rest's people"), met at the Assay Yards' gate (v1.57; v1.130–v1.131 in a square of Kell's Rest's own), in its way
// in: Nan Ruddock, Garrow's quartermaster once, who holds the gate with what's left of the Redhand because the Assay pays
// on time; and Davy Pruett, a junior clerk of the Kell Assay, who sells nothing and says too much. Hob's pass comes
// through him: a word with him is Paid by Weight's first step (quests.js `meet`; s_ is read before this conversation
// counts). Entry knots: nan_hub, clerk_hub. Bound in by src/story/adapter.js from the sim (sim/npcs.js varsFor; core.js
// boss_<id>; quests.js q_ / s_). Effects: met_nan, met_clerk.

VAR hero_name = ""
VAR hero_class = ""
VAR hero_origin = ""
VAR hero_level = 1
VAR party_size = 1
VAR fallen_name = ""
VAR day_part = 0
VAR flag_met_nan = 0
VAR flag_met_clerk = 0
VAR boss_weighmaster = 0
VAR boss_morrow_vane = 0
VAR q_ch3_paid_by_weight = -1
VAR s_ch3_paid_by_weight = 0

// ── Nan Ruddock, at the yard gate ──
== nan_hub ==
{ flag_met_nan == 0: -> nan_first_meet }
{ boss_weighmaster == 1: -> nan_after }
{&Nan Ruddock is leaning on the gatepost, cleaning her nails with a knife she clearly uses for other things.|"Still here? So am I. The Assay pays by the day."|Nan is counting her men on the wall. The number she gets doesn't please her, but it doesn't surprise her either.}
-> nan_topics

== nan_first_meet ==
A broad woman in a red sash sits on an upturned crate by the yard gate, with a ledger on her knee and a crossbow against the crate.
"Ruddock. Nan. I was Garrow's quartermaster. Now what's left of the Redhand is mine, and the Assay pays us to stand on its gate. It pays on time. Garrow never once did." # flag: set met_nan
{
- hero_origin == "redhand_deserter":
    "I know your face. You walked. Plenty did. I wrote you down as dead, it was less paperwork. Stay dead, near me, and we'll get on."
- hero_origin == "thornwick_born":
    "Thornwick. The Captain used to say Thornwick paid its tolls in complaints. He wasn't wrong."
- else:
    "I'll tell you what I tell everyone. My lads fight whoever comes through the gate without a pass. Nothing personal. It's in the contract."
}
-> nan_topics

== nan_after ==
"You put the Weighmaster down." She writes it in her ledger. "The Assay will hire another. My lads are still on the gate. That's the Redhand. We're always still on the gate."
-> nan_topics

== nan_topics ==
+ [Whose money is it, really?]
    "The Assay's. Before that, Garrow's, and before that a robed man's in the Vale who paid for digging." She shrugs. "Money doesn't change much. It just changes hands."
    -> nan_topics
+ [What's under the Yards?]
    "Cellars. A cage store. An office nobody's allowed in but the Weighmaster. I don't go down. The pay's for the gate."
    -> nan_topics
+ [We'll be going in.]
    "Then you'll be going past my lads. Nothing personal." She picks up the crossbow. Not toward you. Not yet.
    -> END

// ── Davy Pruett, the Assay's clerk ──
== clerk_hub ==
{ q_ch3_paid_by_weight == 1 && s_ch3_paid_by_weight == 0: -> clerk_pass }
{ flag_met_clerk == 0: -> clerk_first_meet }
{&Davy Pruett looks round, sees it's you, and only looks a little relieved.|"I'm not supposed to talk to anyone. I'm talking to you. That's how it always goes."|Pruett is copying figures from one ledger into another, and his lips are moving with the numbers.}
-> clerk_topics

== clerk_first_meet ==
A thin young man with ink to the cuffs is sitting on the yard gate's step with a ledger, as if he'd been sent out of a room.
"Pruett. Davy. Junior clerk, Kell Assay. I don't sell anything. I'm not allowed to. I just write down what everyone else sells." # flag: set met_clerk
-> clerk_topics

// ── Paid by Weight (content/quests/ch3_paid_by_weight.json): Hob's pass ──
== clerk_pass ==
A thin young man with ink to the cuffs is waiting by the yard gate, and jumps when you say Hob's name.
"Hob sent you. Of course he did. Here." He pushes a brass pass into your hand without looking at it. "It's real. That's the frightening part. It's a real pass with a real seal, and I'll be the one who wrote it out." # flag: set met_clerk
"The quota office is the second level down, past the cage store. The Weighmaster keeps it. He weighs everyone who comes in. The night shift's rolls are on his desk. He reads them in the evenings, for pleasure."
"Don't tell anyone I told you. Tell Hob we're square. We're not, he'll say. Tell him anyway."
-> clerk_topics

== clerk_topics ==
+ [What does the Assay do here?]
    "Weighs things. Ore, iron, coal. Men, for the night shift: they weigh them at the gate and write it down. I asked why. They said the furnace has a quota, and quotas are kept by weight." He swallows. "I stopped asking."
    -> clerk_topics
+ [Who's Morrow Vane?]
    { boss_morrow_vane == 0: "The factor. Very polite. He signs everything himself, beautifully. He's never once been rude to me, and I'm more frightened of him than of the Weighmaster." }
    { boss_morrow_vane == 1: "Gone. A day ahead on the Solmere road, they say, with something under a tarpaulin on a cart that took twelve oxen. He left the books in perfect order. That's how I knew he wasn't coming back." }
    -> clerk_topics
+ [That's all.]
    "It always is. Until it isn't."
    -> END
