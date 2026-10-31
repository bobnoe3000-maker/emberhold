import { i as e } from "./own-rp3p7qEo.js";
import { g as t, v as n, y as r } from "./ObjectCatalog-CLBSNnc2.js";
import { u as i } from "./I18n-BeKB4FMa.js";
import { a, r as o, t as s } from "./ContentText-nXIHgNO8.js";
//#region src/game/dialogue.js
function c() {
	return {
		reward: o("dlg.drillmaster.reward.keys", "Take these {Healing Draughts}. Drink one with {C} when the world starts to spin. Bram sells more at the stall."),
		strike: o("dlg.drillmaster.strike.keys", "Strike with {J (or the left mouse button)} — press it again as the blade comes back and you chain three cuts, the last one a thrust that knocks foes flat."),
		roll: o("dlg.drillmaster.roll.keys", "Roll with {K (or the right mouse button)} while you move: for a heartbeat nothing can touch you. Roll just as a blow lands and the world slows for you."),
		skills: o("dlg.drillmaster.skills.keys", "Your skills are on {U, I and O (or 1–3)}, your draughts on {C}, and {L} fixes your eyes on one foe."),
		waitBoth: o("dlg.drillmaster.wait-both.keys", "Still waiting on a full three-cut combo on a dummy ({J (or the left mouse button)} three times) and one roll ({K (or the right mouse button)}). The dummies are patient. I am less so."),
		waitCombo: o("dlg.drillmaster.wait-combo.keys", "Still waiting on a full three-cut combo on a dummy ({J (or the left mouse button)} three times). The dummies are patient. I am less so."),
		waitRoll: o("dlg.drillmaster.wait-roll.keys", "Still waiting on one roll ({K (or the right mouse button)}). The dummies are patient. I am less so.")
	};
}
function l(e, t, n, r) {
	if (!t.upgrade) return s(o("dlg.shopkeeper.bought", "Obtained: ${name}"), { name: e });
	let i = {
		name: e,
		before: n,
		after: r
	};
	switch (r === null ? "" : t.upgrade) {
		case "attack": return s(o("dlg.shopkeeper.bought-atk", "Obtained: ${name} — ATK ${before} → ${after}"), i);
		case "def": return s(o("dlg.shopkeeper.bought-def", "Obtained: ${name} — DEF ${before} → ${after}"), i);
		case "maxHp": return s(o("dlg.shopkeeper.bought-max-hp", "Obtained: ${name} — Max HP ${before} → ${after}"), i);
		case "maxMp": return s(o("dlg.shopkeeper.bought-max-mp", "Obtained: ${name} — Max MP ${before} → ${after}"), i);
		default: return s(o("dlg.shopkeeper.bought-gain", "Obtained: ${name} — ${gain}"), {
			name: e,
			gain: t.gainLabel
		});
	}
}
var u = (e) => e === "gold" ? o("dlg.shop.not-enough-gold", "Not enough gold") : e === "full" ? o("dlg.shop.cannot-carry-more", "You cannot carry more") : o("dlg.shop.not-for-sale", "Not for sale"), d = {
	async elder({ say: e, visits: t }) {
		t === 0 ? await e([
			o("dlg.elder.welcome", "Ah, a traveler. Welcome to {Emberfall}, child. Mind the cobbles — they are older than I am, and twice as stubborn."),
			o("dlg.elder.founders", "Our founders followed this river up from the lowlands four hundred years ago. At dusk the falls catch the last of the sun and glow like embers in a hearth."),
			o("dlg.elder.hence-the-name", "Hence the name. We are not an imaginative people, but we are an honest one."),
			o("dlg.elder.inn-tip", "If your feet are weary, the {Ember & Oak} has a bed and a bowl of stew. Rosalind keeps the hearth warm and the gossip warmer.")
		]) : t % 2 == 1 ? await e([o("dlg.elder.well", "Thirsty? The well is free to all. Its water comes down from {Windmill Hill}, and in all my years it has never once run dry."), o("dlg.elder.stair", "Climb the stair by the inn some evening. The whole valley turns to gold up there.")]) : await e([o("dlg.elder.still-here", "Still here? Good. A village is only as warm as the company that lingers in it.")]);
	},
	async innkeeper({ say: e, game: t }) {
		await e([o("dlg.innkeeper.welcome", "Welcome to the {Ember & Oak}! Warm beds, hot stew, and only a modest amount of snoring from the loft."), {
			text: o("dlg.rest.ask", "Will you rest until morning?"),
			choices: [o("dlg.rest.not-yet", "Not yet", "choice"), o("dlg.rest.until-morning", "Rest until morning", "choice")]
		}]) === 1 ? (await t.restUntilMorning(), await e([o("dlg.innkeeper.good-morning", "Good morning, sleepyhead! Breakfast is on the table, and the rooster has been shouting about it for an hour.")])) : await e([o("dlg.innkeeper.take-your-time", "Take your time, dear. The fire will keep.")]);
	},
	async merchant({ say: e, toast: t, sfx: n, game: r }) {
		await e([o("dlg.merchant.step-up", "Step right up! The finest produce this side of the river — and the only produce this side of the river, but let us not dwell on that."), {
			text: o("dlg.merchant.offer-apple", "An apple, fresh from the valley orchards? For a new face in {Emberfall}, it is on the house."),
			choices: [o("dlg.shop.just-looking", "Just looking", "choice"), o("dlg.merchant.take-apple", "Take an apple", "choice")]
		}]) === 1 ? (r.inventory.apples = (r.inventory.apples ?? 0) + 1, n("chime"), t(r.inventory.apples > 1 ? s(o("dlg.merchant.obtained-apple-count", "Obtained: Crisp Apple ×${count}"), { count: r.inventory.apples }) : o("dlg.merchant.obtained-apple", "Obtained: Crisp Apple")), await e([o("dlg.merchant.fine-choice", "A fine choice! Crisp as a winter morning and twice as sweet. Come back tomorrow — I will have pears. Probably.")])) : await e([o("dlg.merchant.looking-is-free", "Looking is free! ...For now.")]);
	},
	async guard({ say: e, visits: t }) {
		t === 0 ? await e([
			o("dlg.guard.halt", "Halt! State your— ah. Forgive me, traveler. Force of habit."),
			o("dlg.guard.ducks-and-gossip", "Nothing has crossed this bridge in years but ducks and gossip, and I have yet to arrest either."),
			o("dlg.guard.grove", "The grove beyond turns to amber this time of year. Keep to the path after dark — the river is gentle, but she is deeper than she looks.")
		]) : await e([o("dlg.guard.all-quiet", "All quiet on the bridge. Just the way I like it. ...Mostly.")]);
	},
	async farmer({ say: e }) {
		await e([
			o("dlg.farmer.turnips", "Hm? Oh, don't mind me. Just asking the turnips how they are getting on."),
			o("dlg.farmer.soil", "Soil's been kind this year. Rain came when we asked for it and kept away when we didn't. Can't ask fairer than that."),
			o("dlg.farmer.chickens", "If you see my granddaughter, tell her the chickens have filed a formal complaint.")
		]);
	},
	async child({ say: e, visits: t }) {
		t % 2 == 0 ? await e([o("dlg.child.duchess", "Shh! I'm sneaking up on {Duchess}. She's the plump one. She's also the fastest, which is not fair at all."), o("dlg.child.eggs", "Grandpa says if I catch her, I get to name the next batch of eggs!")]) : await e([o("dlg.child.fence", "...Hey, you're tall. Could you be a fence? You just have to stand really, really still.")]);
	},
	async bard({ say: e, toast: t, game: n, visits: r }) {
		let i = n.audio.musicPlaying;
		r === 0 ? (await e([o("dlg.bard.listener", "A listener! Sit, sit. The fire is warm and my lute is — mostly — in tune."), i ? o("dlg.bard.song-intro-playing", "You have been hearing me since the square, I expect. This one is called {Emberfall Evening}. I wrote it on that very bench, the night the falls turned gold.") : o("dlg.bard.song-intro", "This one is called {Emberfall Evening}. I wrote it on that very bench, the night the falls turned gold.")]), i || (n.setMusic(!0), t(o("dlg.bard.song-toast", "♪ Emberfall Evening")))) : i ? await e([{
			text: o("dlg.bard.another-verse", "Another verse, or shall I rest my fingers by the fire?"),
			choices: [o("dlg.music.keep-playing", "Keep playing", "choice"), o("dlg.bard.rest-a-while", "Rest a while", "choice")]
		}]) === 1 ? (await e([o("dlg.bard.no-offence", "No offence taken. Even a bard's fingers need a rest by the fire.")]), n.setMusic(!1), t(o("dlg.music.fades", "The music fades…"))) : await e([o("dlg.bard.another-verse-yes", "Then another verse it is! This part is my favourite — the river joins in.")]) : (await e([o("dlg.bard.from-the-top", "Quiet suits a fire, but a song suits it better. Here — from the top.")]), n.setMusic(!0), t(o("dlg.bard.song-toast", "♪ Emberfall Evening")));
	},
	async scholar({ say: e, visits: t }) {
		t === 0 ? await e([
			o("dlg.scholar.visitor", "Oh! A visitor on the hill. I am cataloguing how the light moves over this valley. Would you believe it is different every hour?"),
			o("dlg.scholar.time-key", "Press {T} and watch the day turn — dawn, noon, golden hour, dusk and night. I have documented each one. Twice."),
			o("dlg.scholar.weather-key", "{R} summons the weather: rain, then snow, then clear skies again. Do not ask me how. Scholarship has its limits."),
			o("dlg.scholar.view-keys", "{P} hides everything but the view. {Q} and {E} turn the world around you, and {Z} and {X} — or the wheel — bring it closer or push it away."),
			o("dlg.scholar.notes-keys", "And should you wish to see my working notes, {~} opens them. {H} will remind you of all this, should you forget.")
		]) : await e([o("dlg.scholar.remember", "Remember: {T} for the hour, {R} for the weather, {P} for the view, {H} for help. The rest is patience."), o("dlg.scholar.golden-hour", "Golden hour is my favourite. The shadows grow long and everything looks like it remembers something.")]);
	},
	async drillmaster(e, t) {
		let { say: n, game: r, toast: i, sfx: a, visits: l } = e, u = r.combat;
		if (!u) {
			await m(t ?? {})(e);
			return;
		}
		if (u.bossDefeated) {
			await n([o("dlg.drillmaster.boss-felled", "You felled {Cinderheart}. I watched the glow go out of the caldera from the palisade — the whole camp cheered loud enough to wake the dummies."), o("dlg.drillmaster.first-watch", "The pass has not been this quiet since my grandmother held this post. Rest by the fire tonight, soldier. You have earned the first watch off.")]);
			return;
		}
		let d = c(), f = u.tutorial;
		if (f.combo && f.dodge && !f.rewarded) {
			let e = u.rewardTutorial();
			e > 0 && (a("chime"), i(s(o("dlg.drillmaster.obtained-draughts", "Obtained: Healing Draught ×${count}"), { count: e }))), await n([
				o("dlg.drillmaster.well-done", "Now that is a sword arm! A full combo and a clean roll — the dummies will be telling stories about you."),
				e > 0 ? d.reward : o("dlg.drillmaster.satchel-full", "I had draughts for you, but your satchel is full. Bram sells more at the stall when you need them."),
				o("dlg.drillmaster.glade-warning", "The glade beyond the gate is crawling with slimes. Mind the goblins — they circle before they strike.")
			]);
			return;
		}
		if (f.rewarded) {
			await n([o("dlg.drillmaster.remember", "Remember: strike, roll, strike again. And rest at a {waystone} before you take on anything with a crown of fire.")]);
			return;
		}
		if (l === 0) {
			await n([
				o("dlg.drillmaster.hold-there", "Hold there, traveler. Nobody leaves this camp with a sword they cannot swing. I am {Captain Maren}, and the dummies are my recruits."),
				d.strike,
				d.roll,
				d.skills,
				o("dlg.drillmaster.show-me", "Show me a full three-cut combo on a dummy, and one good roll. Then come back to me.")
			]);
			return;
		}
		await n([!f.combo && !f.dodge ? d.waitBoth : f.combo ? d.waitRoll : d.waitCombo]);
	},
	async shopkeeper(t, n) {
		let { say: i, game: a, toast: c, sfx: d, visits: f } = t, h = a.combat;
		if (!h?.shopOffers) {
			await m(n ?? {})(t);
			return;
		}
		if (h.engaged) {
			d("cancel"), await i([o("dlg.shopkeeper.foes-near", "Not with foes at your heels! Lose them first, then we can talk trade.")]);
			return;
		}
		let g = p(r(n?.dialogue).filter((e) => !e.choices), n), _ = f === 0 ? g : g.slice(-1), v = f > 0 && g.length > 1 ? o("dlg.shopkeeper.tell-me-again", "Tell me again", "choice") : null, y = h.pc, b = {
			attack: () => y.atk,
			def: () => y.def,
			maxHp: () => y.hpMax,
			maxMp: () => y.mpMax
		}, x = 0;
		for (let t = 0; t < 16; t++) {
			let n = h.shopOffers().filter((e) => !e.sold), r = t === 0 ? [..._] : [], a = [o("dlg.shopkeeper.nothing-more", "Nothing more", "choice"), ...n.map((e) => s(e.reason === "gold" ? o("dlg.shopkeeper.ware-short", "${name} (${gain}) — ${price} gold (not enough)", "choice") : o("dlg.shopkeeper.ware", "${name} (${gain}) — ${price} gold", "choice"), {
				name: e.label,
				gain: e.gainLabel,
				price: e.price
			}))];
			v && a.push(v);
			let f = {
				gold: y.gold,
				atk: y.atk,
				def: y.def
			};
			r.push({
				text: s(t === 0 ? o("dlg.shopkeeper.menu-first", "What will it be? You carry {${gold} gold} · ATK ${atk} · DEF ${def}.") : o("dlg.shopkeeper.menu-again", "Anything else? You carry {${gold} gold} · ATK ${atk} · DEF ${def}."), f),
				choices: a
			});
			let p = await i(r);
			if (v && p === a.length - 1) {
				await i(g.slice(0, -1));
				continue;
			}
			if (typeof p != "number" || p <= 0 || !n[p - 1]) break;
			let m = n[p - 1], S = m.upgrade ? e(b, m.upgrade) : null, C = S ? S() : 0, w = h.buy(m.name);
			w.ok ? (x++, d("chime"), c(l(m.label, m, C, S ? S() : null))) : (d("cancel"), c(u(w.reason)));
		}
		await i([x > 0 ? o("dlg.shopkeeper.farewell-bought", "A pleasure doing business. Mind the fire up there.") : o("dlg.shopkeeper.farewell-none", "Suit yourself. The cart is not going anywhere.")]);
	}
}, f = {
	rest: () => ({
		text: o("dlg.rest.ask", "Will you rest until morning?"),
		choices: [o("dlg.rest.not-yet", "Not yet", "choice"), o("dlg.rest.until-morning", "Rest until morning", "choice")]
	}),
	shop: (e, t = null) => ({
		text: t === null ? s(o("dlg.action.shop-ask", "Would you like the ${item}?"), { item: e }) : s(o("dlg.action.shop-ask-price", "Would you like the ${item}? (${price} gold)"), {
			item: e,
			price: t
		}),
		choices: [o("dlg.shop.just-looking", "Just looking", "choice"), o("dlg.action.shop-yes", "Yes, please", "choice")]
	}),
	music: () => ({
		text: o("dlg.action.music-ask", "Another song, or a little quiet?"),
		choices: [o("dlg.music.keep-playing", "Keep playing", "choice"), o("dlg.action.music-quiet", "Some quiet", "choice")]
	})
};
function p(e, r) {
	return e.map((e) => {
		let i = o(n(r, e.i), e.text);
		return e.choices ? {
			text: i,
			choices: e.choices.map((n) => o(t(r, e.i, n.j), n.text, "choice"))
		} : i;
	});
}
function m(e) {
	let t = r(e.dialogue), n = e.action ?? "none", c = String(e.item || "Crisp Apple"), l = t[t.length - 1], d = !!l?.choices, m = d && l.choices.length === 1 ? 0 : 1;
	return async (r) => {
		let { say: l, toast: h, sfx: g, game: _ } = r, v = _.audio.musicPlaying, y = n === "shop" ? e.item ? a(c) : i("game.default.item") : "", b = n === "shop" ? _.combat?.priceOf(c) ?? null : null, x = p(t, e);
		d || (n === "rest" ? x.push(f.rest()) : n === "shop" ? x.push(f.shop(y, b)) : n === "music" && v && x.push(f.music())), x.length || x.push("…");
		let S = await l(x), C = typeof S == "number" && S >= m, w = (e) => e > 1 ? s(o("dlg.action.obtained-count", "Obtained: ${item} ×${count}"), {
			item: y,
			count: e
		}) : s(o("dlg.action.obtained", "Obtained: ${item}"), { item: y });
		if (n === "rest" && C) await _.restUntilMorning();
		else if (n === "shop" && C && b !== null) {
			let e = _.combat.buy(c);
			e.ok ? (g("chime"), h(w(1))) : (g("cancel"), h(u(e.reason)));
		} else if (n === "shop" && C && _.story) {
			let { count: e } = _.story.giveNamed(c, 1);
			g("chime"), h(w(e));
		} else if (n === "shop" && C) {
			let e = c.toLowerCase();
			_.inventory[e] = (_.inventory[e] ?? 0) + 1, g("chime"), h(w(_.inventory[e]));
		} else n === "music" && (d ? C && !v && (_.setMusic(!0), h(o("dlg.action.music-toast", "♪ Music"))) : v ? C && (_.setMusic(!1), h(o("dlg.music.fades", "The music fades…"))) : (_.setMusic(!0), h(o("dlg.action.music-toast", "♪ Music"))));
	};
}
function h(t) {
	let n = t.script ? e(d, t.script) : null;
	return t.script && !n && console.warn(`[Luminati] NPC "${t.id}": unknown script "${t.script}"; using its dialogue.`), n ? (e) => n(e, t) : m(t);
}
//#endregion
export { h as n, m as r, d as t };
