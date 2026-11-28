// lucan.ink — Lucan Varro of Highmarch, who signs himself Lucanus, the Seventh Voice (world doc v1.72 §3.7, §5, §6):
// handsome, educated and sincere, a tragedy who thinks he's a history; his mother called him Luke. He came down from the
// Lady Livia's household, opened her sealed box, learned the Canticle in four years, and sang the drowned fleet up to
// march on the capital. Beaten on the Seventh Tower's roof (Highmarch, floor 2), he stops at a tenth of his life and
// sits down on the old signal stand's steps, and the sim puts him there (npcs.js `found`, placed only once he's beaten;
// the roof stays quiet while he sits). Spoken to, he has the Kindler's letters from the steward's room on his knee, opened at
// last; he says his line and walks north to the Heights after the vessel, which left with the Kindler days ago.
// His device (copy-review §8): he hears his life as the histories will tell it, then gives you the plain fact. Long,
// balanced, educated sentences; sincere, never sneering. No HTML.
// He's a visitor, as the Kindler is: `# flag: set lucan_gone` is his last line, and the sim takes him out of the hall
// once it's set (npcs.js `visitor`). Talking to him is The Seventh Voice's last step (`meet` lucan at highmarch), but the
// conversation stands on its own, quest or none. Entry: lucan_hub. Bound in by src/story/adapter.js from the sim
// (quests.js: q_ / s_ for The Seventh Voice, read before this talk counts). The Grace's crew (*"Livia's crew. Let them
// rest."*) is the region boss's line, for later: here it's only a ship he never called.

VAR hero_name = ""
VAR hero_class = ""
VAR hero_origin = ""
VAR hero_level = 1
VAR party_size = 1
VAR fallen_name = ""
VAR day_part = 0
VAR flag_lucan_gone = 0
VAR q_ch4_seventh_voice = -1
VAR s_ch4_seventh_voice = 0

== lucan_hub ==
A young man sits on the steps of the old signal stand with his sword laid on the step beside him, as if he'd put it down to free a hand. He's handsome even now, in a coat cut for a coronation and torn at the shoulder. There's a bundle of letters on his knee, their seals broken.
"Lucan Varro. On the commissions I signed Lucanus, the Seventh Voice. I chose it the winter I opened the box. It looked very well in red wax."
{ fallen_name != "": "You came in with {fallen_name}. I'm sorry. A week ago I'd have sung them up again for you, and you'd have hated me for it." }
"The histories will say the Seventh Voice was beaten on his own steps. I'd like it put down that I sat."
-> lucan_talk

== lucan_talk ==
* [What are those letters?] -> lucan_letters
* [Why did you stop?] -> lucan_stopped
* [You opened Livia's box.] -> lucan_box
+ [Where will you go?] -> lucan_north
+ [You're coming with us.] -> lucan_refuse

== lucan_letters ==
"The Kindler's. They were on my own table in the steward's room, under the plans for the procession. I never opened one. He wrote such long letters, and I had a capital to take."
"He calls me friend in every one. He calls everyone friend, I gather. I took it as a particular honour."
"He thanks me for the rooms, and for an escort as far as my gate. The crate went north with him. He hopes the coronation goes well. The wax on these is red, too. It was always his wax."
-> lucan_talk

== lucan_stopped ==
"You'd broken my breath twice. The third time I heard what I was singing. I was calling my own guard up off this roof to die for me again. One of them taught me to ride."
"A chronicle would call that the turning of the tide. It was a man on a floor, out of breath, who'd stopped liking his own voice."
-> lucan_talk

== lucan_box ==
"It came down to us from the Lady Livia's household, with the silver and the debts. Every Varro before me dusted it and left it shut. I was the first with an education."
"On the inside of the lid, in her hand, it says never open it. You only read that afterwards."
"Four years learning what was in it. I had the voice for it. Everyone always said I had the voice."
"There's one ship off the Mole I never called up. I had the verse for her. I found I hadn't the right."
-> lucan_talk

== lucan_refuse ==
"To Tollhaven, to be tolled at the gate and tried on the quay? The League's Speaker would be within her rights."
"But he's days ahead of you, and he means to light something with what he's carrying. I know the road, and he'll be expecting me. Let me go first."
-> lucan_go

== lucan_north ==
"North. Up to the Heights, after him. He's taken it where the fire was lit the first time, and when he gets there he'll want a Voice. He hasn't asked me. He's never asked. He assumes."
"I'd like to tell him no in person. It's the one thing I've learned this spring that wasn't in the box."
-> lucan_go

== lucan_go ==
He stands, and puts the letters inside his coat. He looks at the sword on the step for a while and leaves it there.
"I wanted the empire, not its kitchen fire. It seems they were the same room."
"My mother called me Luke. It never looked like much in wax."
{ q_ch4_seventh_voice == 1 && s_ch4_seventh_voice == 2: Hester Quaile will want to hear which way he went. }
He walks down the tower stair and out through the yard, without hurrying. Behind him the dead on the roof stay where they fell. # flag: set lucan_gone
-> END
