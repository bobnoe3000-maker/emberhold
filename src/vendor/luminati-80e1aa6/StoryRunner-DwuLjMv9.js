import { jn as e, st as t } from "./three.core-DtPqUex8.js";
import { n } from "./Palette-D7TB3xJk.js";
import { a as r, l as i, r as a } from "./math-Du_SWpiD.js";
import { c as o, i as s, n as c } from "./own-rp3p7qEo.js";
import { i as l, t as u } from "./CharacterSprites-DgZfPMSX.js";
import { a as d, c as f, d as p, f as m, i as h, l as g, n as _, o as v, r as ee, s as y, t as te, u as b } from "./StoryCondition-BKyw6JI2.js";
import { C as ne, S as re, b as x, m as ie, w as ae } from "./ObjectCatalog-CLBSNnc2.js";
import { a as oe, u as S } from "./I18n-BeKB4FMa.js";
import { a as se, i as ce, n as le } from "./Travel-4-idrvN5.js";
import { a as C, i as ue, r as w } from "./ContentText-nXIHgNO8.js";
import { r as de, t as fe } from "./dialogue-D_zYka2G.js";
import { t as pe } from "./Nav-CrItj1Ws.js";
import { a as T, c as me, d as he, f as ge, l as E, o as _e, p as ve, s as ye, t as be, u as D } from "./PartyRules-BC3MXv_G.js";
//#region src/engine/level/StoryScript.js
var O = Object.freeze({
	lines: 4e3,
	depth: 16,
	lineLength: 2e3
}), xe = [
	"up",
	"down",
	"left",
	"right"
], Se = Object.freeze({
	"!": "!",
	"?": "?",
	"...": "…",
	"…": "…",
	note: "♪",
	"♪": "♪",
	heart: "♥",
	"♥": "♥",
	zzz: "zzz",
	anger: "#",
	sweat: "💧",
	idea: "✦"
}), Ce = [
	"clear",
	"rain",
	"snow",
	"frost"
], we = [
	"cheer",
	"dance",
	"cower",
	"kneel",
	"bow",
	"victory",
	"ready",
	"cast",
	"none"
], k = [
	"explosion",
	"fireball",
	"flames",
	"smoke",
	"holy",
	"frost",
	"shockwave",
	"dust",
	"sparkle",
	"fireworks",
	"embers",
	"roar",
	"toll",
	"thaw",
	"petals",
	"leaves",
	"memory",
	"crows"
], A = [
	"white",
	"gold",
	"red"
], Te = Object.freeze({
	yaw: Object.freeze([-36e3, 36e3]),
	pitch: Object.freeze([2, 85]),
	dist: Object.freeze([4, 90]),
	fov: Object.freeze([12, 70]),
	lift: Object.freeze([-10, 30]),
	orbit: Object.freeze([-360, 360])
}), Ee = [
	"on",
	"yaw",
	"pitch",
	"dist",
	"fov",
	"lift",
	"orbit",
	"reset"
], De = Object.freeze({
	pitch: Object.freeze([-24, 24]),
	pan: Object.freeze([-1, 1])
}), Oe = {
	if: {
		args: "<condition>",
		help: "the indented block runs when the condition holds (then `elif <condition>` / `else`)"
	},
	elif: {
		args: "<condition>",
		help: "after an if: the next condition to try"
	},
	else: {
		args: "",
		help: "after an if: the block when nothing before held"
	},
	choice: {
		args: "[question]",
		help: "offer the indented `> label` options (`> [if c]`, `> [once]`); the picked option's block runs"
	},
	loop: {
		args: "",
		help: "repeat the indented block until `break` (or `stop`)"
	},
	break: {
		args: "",
		help: "leave the innermost loop"
	},
	once: {
		args: "<key>",
		help: "the indented block runs only the first time (the key is remembered in the save)"
	},
	cycle: {
		args: "<key>",
		help: "one `*` alternative each time, in turn, round and round"
	},
	seq: {
		args: "<key>",
		help: "one `*` alternative each time, in turn, then the last one again and again"
	},
	pick: {
		args: "<key>",
		help: "one `*` alternative, picked at random — per journey: a reload plays the same one"
	},
	stop: {
		args: "",
		help: "end the script"
	},
	call: {
		args: "<script>",
		help: "run a named script of the campaign's story files, then go on"
	},
	wait: {
		args: "<seconds> | <who> | thaw",
		help: "pause, or wait until an actor ends a walk started with `nowait`, or (`wait thaw`) until the running thaw front has crossed the level"
	},
	set: {
		args: "<flag>",
		help: "set a story flag (its value becomes 1)"
	},
	clear: {
		args: "<flag>",
		help: "clear a story flag / variable (0)"
	},
	var: {
		args: "<name> = | + | - <number>",
		help: "set, raise or lower a story variable"
	},
	give: {
		args: "<item> [count]",
		help: "give the player an item (`gold` is money)"
	},
	take: {
		args: "<item> [count]",
		help: "take an item from the player (at most as many as they have)"
	},
	quest: {
		args: "<id> start [title] | stage <stage> [text] | done | fail",
		help: "start, advance, finish or fail a quest (the journal, B)"
	},
	home: {
		args: "<who> [x z]",
		help: "where a villager stays from now on (default: where they stand; remembered for the level)"
	},
	time: {
		args: "<hour> | <hh:mm> [seconds]",
		help: "set the time of day; with seconds the shown hour glides there (on a level with a fixed hour too) and the script waits"
	},
	weather: {
		args: "clear | rain | snow | frost",
		help: "change the weather (frost: a clear, cold sky over settled snow)"
	},
	travel: {
		args: "<level> [entrance]",
		help: "campaigns: go to another level (the script goes on there)"
	},
	rest: {
		args: "",
		help: "sleep until morning (the inn's fade; a new day)"
	},
	heal: {
		args: "",
		help: "combat levels: restore the player's health and mana"
	},
	shop: {
		args: "",
		help: "the talking villager's built-in shop"
	},
	builtin: {
		args: "<conversation>",
		help: "play a hand-written conversation of the game (src/game/dialogue.js)"
	},
	ending: {
		args: "<id> [title]",
		help: "the story ends: an end card, then the title screen (the save remembers the ending)"
	},
	cutscene: {
		args: "",
		help: "letterbox, no HUD, skippable (hold Esc) until the script ends"
	},
	walk: {
		args: "<who> <x> <z> | <who> <place> [run] [nowait]",
		help: "walk an actor there on the walk grid; waits unless `nowait`"
	},
	face: {
		args: "<who> up | down | left | right | <who> <place>",
		help: "turn an actor (towards an actor, marker, entrance or object)"
	},
	emote: {
		args: "<who> ! | ? | ... | note | heart | zzz | anger | sweat | idea [seconds]",
		help: "a bubble over an actor"
	},
	bark: {
		args: "<who> <text>",
		help: "a short speech bubble over an actor (the rest of the line; `${…}` and {gold} as in dialogue) — holds nobody, so it suits background events"
	},
	party: {
		args: "join <who> [as <class>] [<preset>] | leave <who> | rule <who> <preset> | set <who> <field> <value> | menu [<who>]",
		help: "the player's party: a villager here joins (`party join sela as warden guardian` — classes warden, ranger, mystic, cleric, icemage, greatshield; presets balanced, aggressive, guardian, support, hunter, passive) or a member leaves; a member's combat rule becomes a preset, or one field changes (`party set sela heal often`); `menu` opens the tactics panel and waits until it closes. Conditions read `party` (how many members) and `party:sela`"
	},
	teleport: {
		args: "<who> <x> <z> | <who> <place> [facing]",
		help: "put an actor somewhere at once"
	},
	camera: {
		args: "<who> [seconds] | <x> <z> [seconds] | reset [seconds]",
		help: "look at an actor, an object or a point (until `camera reset` or the script ends)"
	},
	shake: {
		args: "[amount]",
		help: "shake the camera"
	},
	fade: {
		args: "out [seconds] [white] | in [seconds]",
		help: "fade the screen to black (or to white) and back"
	},
	shot: {
		args: "[on <who> | on <x> <z>] [yaw <deg>] [pitch <deg>] [dist <u>] [fov <deg>] [lift <u>] [orbit <deg/s>] [seconds] [nowait] | reset [seconds]",
		help: "frame the camera: the words in any order, each optional (what is left out stays); the last number is the move's length (0, the default: a cut) — a move waits until the camera is there unless `nowait`; yaw 0 looks north from the south, 90 from the east; orbit turns the yaw on and on; `shot reset` eases back to the game's framing (the end of the script does too)"
	},
	slowmo: {
		args: "<scale 0.1–1> [seconds]",
		help: "the whole game's time slows (eased over the seconds); back to 1 at the end of the script"
	},
	flash: {
		args: "[white | gold | red] [seconds] [hold]",
		help: "a full-screen flash (default white, 0.35 s); `hold` keeps the colour up (coming in over the seconds) until the next flash fades it back — a memory over white"
	},
	pose: {
		args: "<who> cheer | dance | cower | kneel | bow | victory | ready | cast | none [seconds]",
		help: "an actor plays a pose (none: back to normal); does not wait"
	},
	effect: {
		args: "<name> <who> | <name> <x> <z> [scale]",
		help: "a visual effect there, with its sound — explosion, fireball, flames, smoke, holy, frost, shockwave, dust, sparkle, fireworks, embers, roar, toll, thaw, petals, leaves, memory, crows; does not wait, hurts nobody"
	},
	thaw: {
		args: "[<who> | <place> | <x> <z>] [seconds]",
		help: "the thaw front rolls out from there (default: the frost's \"at\") across the level in about the seconds (default by its size, 10–13); the level stays thawed if its frost's \"until\" holds. Does not wait (`wait thaw` does)"
	},
	toll: {
		args: "<belfry or chime id> [strength]",
		help: "ring that bell: it swings and tolls on its own note — a belfry by its kind, a chime by its place among the level's chimes (strength 0.1–2, default 1); does not wait"
	},
	banner: {
		args: "<title> [| subtitle]",
		help: "the big title banner"
	},
	title: {
		args: "<text> [| subtitle]",
		help: "a cinematic title card in the middle of the screen; waits until it is gone (about 4 s)"
	},
	toast: {
		args: "<text>",
		help: "a short message at the top"
	},
	sfx: {
		args: "<sound> [pitch <semitones>] [pan <-1–1>]",
		help: "play a sound effect — higher or lower by semitones (−24–24), from a side (−1 left … 1 right)"
	},
	music: {
		args: "<track> | on | off",
		help: "change, start or stop the music"
	}
}, ke = /* @__PURE__ */ new Set([
	"if",
	"elif",
	"else",
	"choice",
	"loop",
	"once",
	"cycle",
	"seq",
	"pick"
]), Ae = 60;
function je(e) {
	let t = 0, n = 0, r = !1, i = !1;
	for (; n < e.length; n++) if (e[n] === " ") t++, i = !0;
	else if (e[n] === "	") t += 2, r = !0;
	else break;
	return {
		indent: t,
		text: e.slice(n).trimEnd(),
		tab: r,
		space: i
	};
}
function Me(e) {
	let t = [], n = 0;
	for (; n < e.length;) {
		for (; e[n] === " " || e[n] === "	";) n++;
		if (n >= e.length) break;
		if (e[n] === "\"") {
			let r = "";
			for (n++; n < e.length && e[n] !== "\"";) {
				if (e[n] === "\\" && n + 1 < e.length) {
					r += e[n + 1], n += 2;
					continue;
				}
				r += e[n++];
			}
			n = Math.min(n + 1, e.length), t.push({
				text: r,
				quoted: !0,
				end: n
			});
		} else {
			let r = "";
			for (; n < e.length && e[n] !== " " && e[n] !== "	";) r += e[n++];
			t.push({
				text: r,
				quoted: !1,
				end: n
			});
		}
	}
	return t;
}
var j = (e) => b(e);
function Ne(e, t) {
	let n = e.trim();
	for (let e = 0; e < t; e++) {
		let e = /^\S+\s*/.exec(n);
		if (!e) return "";
		n = n.slice(e[0].length);
	}
	return n.trim();
}
function M(e) {
	return e.includes("\\") ? e.replace(/(\\+)(n?)/g, (e, t, n, r, i) => {
		if (!n && i[r + e.length] === "$") return e;
		let a = "\\".repeat(t.length >> 1);
		return t.length % 2 == 0 ? a + n : a + (n ? "\n" : "\\");
	}) : e;
}
function N(e, t) {
	let n = Me(t), r = n.map((e) => e.text), i = (e, t) => {
		if (e === void 0 || e === "") throw Error(`${t} is missing`);
		if (!y(e)) throw Error(`"${e}" is not a ${t} (letters, digits, _ . -)`);
		return e;
	}, a = (e, t) => {
		let r = n[e];
		if (r?.quoted) {
			let e = r.text.trim();
			if (!e || e.length > Ae) throw Error(`"${r.text}" is not a ${t} (a quoted name has 1–${Ae} characters)`);
			return e;
		}
		return i(r?.text, t);
	}, o = (e) => !!n[e] && !n[e].quoted && Number.isFinite(j(n[e].text)), s = (e, ...t) => !!n[e] && !n[e].quoted && t.includes(n[e].text), l = (e, t) => {
		if (i(e, t), te.has(e.toLowerCase())) throw Error(`"${e}" is a reserved word, not a ${t}`);
		return e;
	}, u = (e, t) => {
		if (e === void 0) return 1;
		let n = j(e);
		if (!Number.isInteger(n) || n < 1 || n > 1e6) throw Error(`${t} must be a whole number from 1`);
		return n;
	}, d = (e, t) => {
		if (e === void 0) return t;
		let n = j(e);
		if (!(n >= 0 && n <= 600)) throw Error(`"${e}" is not a time in seconds`);
		return n;
	}, f = () => {
		if (r.length) throw Error(`"${e}" takes nothing after it`);
		return {};
	};
	switch (e) {
		case "break":
		case "stop":
		case "rest":
		case "heal":
		case "shop":
		case "cutscene":
		case "else":
		case "loop": return f();
		case "once":
		case "cycle":
		case "seq":
		case "pick":
			if (r.length !== 1) throw Error(`${e} <key> (a name the save remembers it by)`);
			return { key: i(r[0], "key") };
		case "call":
		case "builtin": {
			let t = e === "call" ? "script name" : "conversation name";
			if (r.length > 1) throw Error(`${e} takes one ${t} — nothing after it`);
			return { script: i(r[0], t) };
		}
		case "wait":
			if (r.length !== 1) throw Error("wait <seconds> | <who> | thaw");
			return o(0) ? { seconds: d(r[0], 1) } : s(0, "thaw") ? { thaw: !0 } : { who: a(0, "actor") };
		case "set":
		case "clear":
			if (r.length !== 1) throw Error(`${e} <flag>`);
			return { name: l(r[0], "flag name") };
		case "var": {
			if (r.length !== 3) throw Error("var <name> = | + | - <number>");
			let e = He(r[1]);
			if (!e) throw Error(`"${r[1]}" is not = + or -`);
			let t = j(r[2]);
			if (!Number.isFinite(t) || Math.abs(t) > 1e9) throw Error(`"${r[2]}" is not a number`);
			return {
				name: l(r[0], "variable name"),
				by: e,
				value: t
			};
		}
		case "give":
		case "take":
			if (r.length < 1 || r.length > 2) throw Error(`${e} <item> [count]`);
			return {
				item: i(r[0], "item id"),
				count: u(r[1], "the count")
			};
		case "quest": {
			let e = i(r[0], "quest id"), n = r[1];
			if (n === "start") return {
				id: e,
				verb: n,
				text: M(Ne(t, 2))
			};
			if (n === "stage") return {
				id: e,
				verb: n,
				stage: i(r[2], "stage name"),
				text: M(Ne(t, 3))
			};
			if (n === "done" || n === "fail") {
				if (r.length > 2) throw Error(`quest <id> ${n} takes nothing after it`);
				return {
					id: e,
					verb: n
				};
			}
			throw Error("quest <id> start [title] | stage <stage> [text] | done | fail");
		}
		case "home": {
			let e = a(0, "actor");
			if (r.length === 1) return { who: e };
			if (r.length !== 3 || !o(1) || !o(2)) throw Error("home <who> [x z]");
			return {
				who: e,
				x: j(r[1]),
				z: j(r[2])
			};
		}
		case "time": {
			let e = /^(\d{1,2}):([0-5]\d)$/.exec(r[0] ?? ""), t = e ? Number(e[1]) + Number(e[2]) / 60 : j(r[0]);
			if (r.length < 1 || r.length > 2 || !(t >= 0 && t <= 24)) throw Error("time <hour 0–24> | <hh:mm> (minutes 00–59) [seconds]");
			if (r.length === 2 && !o(1)) throw Error(`time <hour> [seconds]: "${r[1]}" is not a time in seconds`);
			return r.length === 2 ? {
				hour: t,
				seconds: d(r[1], 0)
			} : { hour: t };
		}
		case "weather":
			if (r.length !== 1 || !Ce.includes(r[0])) throw Error(`weather ${Ce.join(" | ")}`);
			return { weather: r[0] };
		case "travel":
			if (r.length < 1 || r.length > 2) throw Error("travel <level> [entrance]");
			return {
				level: i(r[0], "level id"),
				entrance: r[1] === void 0 ? "" : i(r[1], "entrance name")
			};
		case "ending": return {
			id: i(r[0], "ending id"),
			title: M(Ne(t, 1))
		};
		case "walk":
		case "teleport": {
			let t = a(0, "actor"), i = /* @__PURE__ */ new Set(), c = [];
			for (let t = 1; t < n.length; t++) e === "walk" && s(t, "run", "nowait") || e === "teleport" && s(t, ...xe) ? i.add(n[t].text) : c.push(t);
			let l = e === "walk" ? {
				who: t,
				run: i.has("run"),
				wait: !i.has("nowait")
			} : {
				who: t,
				facing: xe.find((e) => i.has(e)) ?? ""
			};
			if (c.length === 2 && o(c[0]) && o(c[1])) return {
				...l,
				x: j(r[c[0]]),
				z: j(r[c[1]])
			};
			if (c.length === 1) return {
				...l,
				to: a(c[0], "place")
			};
			throw Error(e === "walk" ? "walk <who> <x> <z> | <who> <place> [run] [nowait]" : "teleport <who> <x> <z> | <who> <place> [facing]");
		}
		case "face": {
			if (r.length !== 2) throw Error("face <who> up | down | left | right | <who> <place>");
			let e = a(0, "actor");
			return s(1, ...xe) ? {
				who: e,
				dir: r[1]
			} : {
				who: e,
				to: a(1, "place")
			};
		}
		case "emote":
			if (r.length < 2 || r.length > 3) throw Error("emote <who> <icon> [seconds]");
			if (!c(Se, r[1])) throw Error(`"${r[1]}" is not an emote (${Object.keys(Se).join(" ")})`);
			return {
				who: a(0, "actor"),
				icon: Se[r[1]],
				seconds: d(r[2], 1.6)
			};
		case "bark":
			if (r.length < 2) throw Error("bark <who> <text>");
			return {
				who: a(0, "actor"),
				text: M(t.slice(n[0].end).trim())
			};
		case "camera":
			if (s(0, "reset")) {
				if (r.length > 2) throw Error("camera reset [seconds]");
				return {
					reset: !0,
					seconds: d(r[1], .8)
				};
			}
			if (r.length >= 2 && o(0) && o(1)) {
				if (r.length > 3) throw Error("camera <x> <z> [seconds]");
				return {
					x: j(r[0]),
					z: j(r[1]),
					seconds: d(r[2], 1)
				};
			}
			if (r.length < 1 || r.length > 2) throw Error("camera <who> [seconds] | <x> <z> [seconds] | reset [seconds]");
			return {
				who: a(0, "actor or place"),
				seconds: d(r[1], 1)
			};
		case "shake": {
			let e = r[0] === void 0 ? .3 : j(r[0]);
			if (r.length > 1 || !(e >= 0 && e <= 2)) throw Error("shake [amount 0–2]");
			return { amount: e };
		}
		case "fade": {
			let e = "fade out | in [seconds] — \"fade out [seconds] white\" fades to white";
			if (r[0] !== "out" && r[0] !== "in" || n[0].quoted) throw Error(e);
			let t = r[0], i, a = !1;
			for (let c = 1; c < n.length; c++) if (s(c, "white")) {
				if (t !== "out") throw Error("fade in [seconds] — \"white\" belongs to \"fade out\" (a fade in comes back from the colour the fade out went to)");
				if (a) throw Error(`${e}: "white" is given twice`);
				a = !0;
			} else if (o(c)) {
				if (i !== void 0) throw Error(`${e}: one time in seconds`);
				i = d(r[c], 0);
			} else throw F(r[c], "a word of fade", ["white"], {
				quoted: n[c].quoted,
				usage: e
			});
			return {
				dir: t,
				seconds: i ?? (t === "out" ? .5 : .6),
				...a ? { white: !0 } : {}
			};
		}
		case "banner":
		case "title": {
			let n = t.trim();
			if (!n) throw Error(`${e} <${e === "banner" ? "title" : "text"}> [| subtitle]`);
			let r = n.split(/(?<!\\)\|/), i = (e) => M(e.replace(/\\\|/g, "|").trim()), a = i(r[0]);
			if (e === "title" && !a) throw Error("title <text> [| subtitle]: the title card's text is missing before the \"|\"");
			return {
				title: a,
				subtitle: i(r.slice(1).join("|"))
			};
		}
		case "shot": return Fe(n, a, o, s, d);
		case "slowmo":
			if (r.length < 1 || r.length > 2 || !o(0) || r.length === 2 && !o(1)) throw Error("slowmo <scale 0.1–1> [seconds] — e.g. \"slowmo 0.3\", \"slowmo 1 0.5\"");
			return {
				scale: P(j(r[0]), .1, 1),
				seconds: d(r[1], 0)
			};
		case "flash": {
			let e = `flash [${A.join(" | ")}] [seconds] [hold]`, t = "", i, a = !1;
			for (let c = 0; c < n.length; c++) if (o(c)) {
				if (i !== void 0) throw Error(`${e}: one time in seconds`);
				i = P(d(r[c], .35), .05, 5);
			} else if (s(c, ...A)) {
				if (t) throw Error(`${e}: one colour`);
				t = r[c];
			} else if (s(c, "hold")) {
				if (a) throw Error(`${e}: "hold" is given twice`);
				a = !0;
			} else throw F(r[c], "a colour of flash or \"hold\"", [...A, "hold"], {
				quoted: n[c].quoted,
				usage: e
			});
			return a ? {
				color: t || A[0],
				seconds: i ?? 0,
				hold: !0
			} : {
				color: t || A[0],
				seconds: i ?? .35
			};
		}
		case "pose": {
			let e = "pose <who> <pose> [seconds]";
			if (r.length < 2 || r.length > 3) throw Error(`${e} — poses: ${we.join(", ")}`);
			let t = a(0, "actor"), i = n[1];
			if (i.quoted || !we.includes(i.text)) throw F(i.text, "a pose", we, {
				quoted: i.quoted,
				usage: e
			});
			if (r.length === 3 && !o(2)) throw Error(`${e}: "${r[2]}" is not a time in seconds`);
			return {
				who: t,
				pose: i.text,
				seconds: d(r[2], 0)
			};
		}
		case "effect": {
			let e = "effect <name> <who> [scale] | effect <name> <x> <z> [scale]", t = n[0];
			if (!t) throw Error(`${e} — effects: ${k.join(", ")}`);
			if (t.quoted || !k.includes(t.text)) throw F(t.text, "an effect", k, {
				quoted: t.quoted,
				usage: e
			});
			if (!n[1]) throw Error(`${e}: where is missing`);
			let i = (t) => {
				if (n[t] === void 0) return 1;
				if (!o(t)) throw Error(`${e}: "${r[t]}" is not a scale (a number, 0.1–5)`);
				return P(j(r[t]), .1, 5);
			};
			if (o(1)) {
				if (!o(2)) throw Error(`${e}: a point is two numbers, x and z`);
				if (n.length > 4) throw Error(`${e} — nothing after the scale`);
				return {
					name: t.text,
					x: j(r[1]),
					z: j(r[2]),
					scale: i(3)
				};
			}
			if (n.length > 3) throw Error(`${e} — nothing after the scale`);
			return {
				name: t.text,
				who: a(1, "actor or place"),
				scale: i(2)
			};
		}
		case "thaw": {
			let e = "thaw [<who> | <place> | <x> <z>] [seconds]", t = n.filter((e, t) => o(t)).length;
			if (n.length > 3 || n.length && !o(0) && t !== n.length - 1) throw Error(e);
			if (!n.length) return {};
			if (!o(0)) {
				if (n.length > 2) throw Error(`${e}: nothing after the seconds`);
				return {
					who: a(0, "actor or place"),
					...n.length === 2 ? { seconds: d(r[1], 0) } : {}
				};
			}
			if (t !== n.length) throw Error(e);
			return n.length === 1 ? { seconds: d(r[0], 0) } : {
				x: j(r[0]),
				z: j(r[1]),
				...n.length === 3 ? { seconds: d(r[2], 0) } : {}
			};
		}
		case "toll":
			if (r.length < 1 || r.length > 2) throw Error("toll <belfry or chime id> [strength]");
			if (r.length === 2 && !o(1)) throw Error(`toll <id> [strength]: "${r[1]}" is not a strength (a number, 0.1–2)`);
			return {
				id: i(r[0], "belfry or chime id"),
				strength: r.length === 2 ? P(j(r[1]), .1, 2) : 1
			};
		case "toast": {
			let e = t.trim();
			if (!e) throw Error("toast <text>");
			return { text: M(e) };
		}
		case "sfx": {
			let e = "sfx <sound> [pitch <semitones>] [pan <-1–1>]";
			if (!r.length) throw Error(e);
			let t = { name: i(r[0], "sound name") };
			for (let i = 1; i < n.length; i++) {
				let a = n[i];
				if (a.quoted || !c(De, a.text)) {
					let t = a.quoted ? "" : Re(a.text, Object.keys(De));
					throw Error(`"${a.text}" is not a word of sfx (pitch, pan)${t ? ` — did you mean "${t}"?` : ""} — ${e}`);
				}
				let s = a.text;
				if (t[s] !== void 0) throw Error(`${e}: "${s}" is given twice`);
				if (!o(i + 1)) throw Error(`${e}: "${s}" takes a number${n[i + 1] ? ` — "${n[i + 1].text}" is none` : ""}`);
				let [l, u] = De[s];
				t[s] = P(j(r[i + 1]), l, u), i++;
			}
			return t;
		}
		case "music":
			if (r.length !== 1) throw Error("music <track> | on | off");
			return { track: i(r[0], "track") };
		case "party": return Ve(n, a, s);
		default: throw Error(`"${e}" is not a command`);
	}
}
var P = (e, t, n) => Math.min(n, Math.max(t, e)), Pe = Object.freeze({
	distance: "dist",
	zoom: "dist",
	at: "on",
	look: "on",
	target: "on",
	tilt: "pitch",
	angle: "yaw",
	turn: "orbit",
	rotate: "orbit",
	height: "lift",
	raise: "lift"
});
function Fe(e, t, n, r, i) {
	let a = "shot [on <who> | on <x> <z>] [yaw <deg>] [pitch <deg>] [dist <u>] [fov <deg>] [lift <u>] [orbit <deg/s>] [seconds] [nowait] | shot reset [seconds]";
	if (!e.length) throw Error(`${a} — at least one of on, yaw, pitch, dist, fov, lift, orbit`);
	if (r(0, "reset")) {
		if (e.length > 2 || e.length === 2 && !n(1)) throw Error("shot reset [seconds] — nothing else after \"reset\"");
		return {
			reset: !0,
			seconds: i(e[1]?.text, .8)
		};
	}
	let o = { reset: !1 }, s, l = !1;
	for (let u = 0; u < e.length; u++) {
		let d = e[u];
		if (r(u, "nowait")) {
			if (o.wait === !1) throw Error(`${a}: "nowait" is given twice`);
			o.wait = !1;
			continue;
		}
		if (n(u)) {
			if (s !== void 0) throw Error(`${a}: "${d.text}" — the move's length is given twice (a number after no word is the length)`);
			s = i(d.text, 0);
			continue;
		}
		if (d.quoted || !Ee.includes(d.text) || d.text === "reset") {
			if (r(u, "reset")) throw Error("shot reset [seconds] — \"reset\" comes alone, first");
			let e = d.text.toLowerCase(), t = c(Pe, e) ? Pe[e] : "", n = d.quoted ? "" : t || Re(d.text, Ee.filter((e) => e !== "reset"));
			throw Error(`"${d.text}" is not a word of shot (on, yaw, pitch, dist, fov, lift, orbit; or "shot reset")${n ? ` — did you mean "${n}"?` : ""}`);
		}
		let f = d.text;
		if (f === "on" ? o.who !== void 0 || o.x !== void 0 : o[f] !== void 0) throw Error(`${a}: "${f}" is given twice`);
		if (l = !0, f === "on") {
			if (!e[u + 1]) throw Error(`${a}: who or where is missing after "on"`);
			if (n(u + 1)) {
				if (!n(u + 2)) throw Error(`${a}: "on" a point takes two numbers, x and z`);
				o.x = b(e[u + 1].text), o.z = b(e[u + 2].text), u += 2;
			} else o.who = t(u + 1, "actor or place"), u++;
			continue;
		}
		if (!n(u + 1)) throw Error(`${a}: "${f}" takes a number${e[u + 1] ? ` — "${e[u + 1].text}" is none` : ""}`);
		let [p, m] = Te[f];
		o[f] = P(b(e[u + 1].text), p, m), u++;
	}
	if (!l) throw Error(`${a} — a length alone frames nothing: at least one of on, yaw, pitch, dist, fov, lift, orbit`);
	return o.seconds = s ?? 0, o;
}
var Ie = [
	"join",
	"leave",
	"rule",
	"set",
	"menu"
], Le = Object.freeze({
	join: "party join <who> [as <class>] [<preset>]",
	leave: "party leave <who>",
	rule: "party rule <who> <preset>",
	set: "party set <who> <field> <value>",
	menu: "party menu [<who>]"
});
function Re(e, t) {
	let n = String(e).toLowerCase(), r = n.length <= 4 ? 1 : 2, i = "", a = r + 1;
	for (let e of t) {
		let t = ze(n, e);
		t < a && t < n.length && (a = t, i = e);
	}
	return i;
}
function ze(e, t) {
	if (Math.abs(e.length - t.length) > 3) return 99;
	let n = Array.from({ length: e.length + 1 }, (e, n) => Array.from({ length: t.length + 1 }, (e, t) => n === 0 ? t : t === 0 ? n : 0));
	for (let r = 1; r <= e.length; r++) for (let i = 1; i <= t.length; i++) n[r][i] = Math.min(n[r - 1][i] + 1, n[r][i - 1] + 1, n[r - 1][i - 1] + (e[r - 1] === t[i - 1] ? 0 : 1)), r > 1 && i > 1 && e[r - 1] === t[i - 2] && e[r - 2] === t[i - 1] && (n[r][i] = Math.min(n[r][i], n[r - 2][i - 2] + 1));
	return n[e.length][t.length];
}
var Be = Object.freeze({
	target: Object.freeze({
		closest: "nearest",
		near: "nearest",
		boss: "strongest",
		toughest: "strongest",
		archers: "ranged",
		casters: "ranged",
		mine: "leader"
	}),
	distance: Object.freeze({
		near: "close",
		nearby: "close",
		short: "close",
		medium: "mid",
		middle: "mid",
		normal: "mid",
		long: "far",
		away: "far",
		wide: "far"
	}),
	attack: Object.freeze({
		always: "free",
		freely: "free",
		yes: "free",
		on: "free",
		help: "assist",
		no: "never",
		off: "never",
		none: "never"
	}),
	skills: Object.freeze({
		always: "free",
		freely: "free",
		yes: "free",
		on: "free",
		mana: "save",
		no: "never",
		off: "never",
		none: "never"
	}),
	heal: Object.freeze({
		always: "often",
		sometimes: "half",
		rarely: "low",
		no: "never",
		off: "never",
		none: "never"
	}),
	evade: Object.freeze({
		yes: "on",
		true: "on",
		always: "on",
		dodge: "on",
		no: "off",
		false: "off",
		never: "off",
		none: "off"
	}),
	retreat: Object.freeze({
		no: "never",
		off: "never",
		none: "never"
	})
});
function F(e, t, n, { quoted: r = !1, usage: i = "", field: a = "" } = {}) {
	let o = String(e).toLowerCase();
	if (r && n.includes(o)) return /* @__PURE__ */ Error(`"${e}" is quoted — ${t} is written without quotes: ${o}${i ? ` (${i})` : ""}`);
	let s = (a && c(Be, a) && c(Be[a], o) ? Be[a][o] : "") || Re(e, n);
	return /* @__PURE__ */ Error(`"${e}" is not ${t} (${n.join(", ")})${s ? ` — did you mean "${s}"?` : ""}`);
}
var I = (e) => /\s/.test(e) ? `"${e}"` : e;
function Ve(e, t, n) {
	let r = e[0] && !e[0].quoted ? e[0].text : "";
	if (!r) throw Error(`party ${Ie.join(" | ")} — ${Object.values(Le).join(" · ")}`);
	if (!c(Le, r)) throw F(r, "a party command", Ie);
	let i = Le[r], a = () => {
		if (!e[1]) throw Error(`${i}: the villager is missing`);
		let n = t(1, "villager");
		if (n.toLowerCase() === "player") throw Error(`${i}: the player leads the party — <who> is a villager`);
		return n;
	};
	switch (r) {
		case "join": {
			let t = a(), o = "", s = "";
			for (let r = 2; r < e.length; r++) {
				let a = e[r];
				if (n(r, "as")) {
					if (o) throw Error(`${i}: the class is given twice`);
					let n = e[r + 1];
					if (!n) throw Error(`${i}: the class is missing after "as" (${be.join(", ")})`);
					if (!n.quoted && D(n.text.toLowerCase())) throw Error(`"${n.text}" is a preset, not a class (${be.join(", ")}) — a preset is written without "as": party join ${I(t)} ${n.text.toLowerCase()}`);
					if (n.quoted || !E(n.text)) throw F(n.text, "a class", be, {
						quoted: n.quoted,
						usage: i
					});
					o = n.text, r++;
					continue;
				}
				if (!a.quoted && E(a.text)) throw Error(`"${a.text}" is a class — write "as ${a.text}" (${i})`);
				if (a.quoted || !D(a.text)) throw F(a.text, "a preset", T, {
					quoted: a.quoted,
					usage: i
				});
				if (s) throw Error(`${i}: the preset is given twice`);
				s = a.text;
			}
			return {
				verb: r,
				who: t,
				cls: o,
				preset: s
			};
		}
		case "leave": {
			let t = a();
			if (e.length > 2) throw Error(`${i} — nothing after the villager`);
			return {
				verb: r,
				who: t
			};
		}
		case "rule": {
			let t = a(), n = e[2];
			if (!n) throw Error(`${i}: the preset is missing (${T.join(", ")})`);
			if (!n.quoted && he(n.text)) throw Error(`"${n.text}" is a field of the rule — write "party set ${I(t)} ${n.text} <value>" (${i})`);
			if (!n.quoted && E(n.text.toLowerCase())) throw Error(`"${n.text}" is a class, not a preset (${T.join(", ")}) — a member's class is chosen when it joins: party join ${I(t)} as ${n.text.toLowerCase()}`);
			if (n.quoted || !D(n.text)) throw F(n.text, "a preset", T, {
				quoted: n.quoted,
				usage: i
			});
			if (e.length > 3) throw Error(`${i} — one preset, nothing after it`);
			return {
				verb: r,
				who: t,
				preset: n.text
			};
		}
		case "set": {
			let t = a(), n = e[2];
			if (!n) throw Error(`${i}: the field is missing (${ye.join(", ")})`);
			if (!n.quoted && D(n.text)) throw Error(`"${n.text}" is a preset — write "party rule ${I(t)} ${n.text}" (${i})`);
			if (n.quoted || !he(n.text)) throw F(n.text, "a field of the rule", ye, {
				quoted: n.quoted,
				usage: i
			});
			let o = _e[n.text].values, s = e[3];
			if (!s) throw Error(`${i}: the value is missing (${n.text}: ${o.join(", ")})`);
			if (s.quoted || !ge(n.text, s.text)) throw F(s.text, `a value of ${n.text}`, o, {
				quoted: s.quoted,
				usage: i,
				field: n.text
			});
			if (e.length > 4) throw Error(`${i} — one value, nothing after it`);
			return {
				verb: r,
				who: t,
				field: n.text,
				value: s.text
			};
		}
		default:
			if (e.length > 2) throw Error(`${i} — at most one member, nothing after it`);
			return {
				verb: r,
				who: e[1] ? a() : ""
			};
	}
}
function He(e) {
	return e === "=" ? "=" : e === "+" || e === "+=" ? "+" : e === "-" || e === "-=" ? "-" : "";
}
function Ue(e) {
	let t = e.toLowerCase(), n = "", r = 3;
	for (let e of Object.keys(Oe)) {
		let i = We(t, e);
		i < r && (r = i, n = e);
	}
	return n;
}
function We(e, t) {
	if (Math.abs(e.length - t.length) > 3) return 99;
	let n = Array.from({ length: t.length + 1 }, (e, t) => t);
	for (let r = 1; r <= e.length; r++) {
		let i = n[0];
		n[0] = r;
		for (let a = 1; a <= t.length; a++) {
			let o = n[a];
			n[a] = Math.min(n[a] + 1, n[a - 1] + 1, i + (e[r - 1] === t[a - 1] ? 0 : 1)), i = o;
		}
	}
	return n[t.length];
}
function Ge(e) {
	let t = e.trim(), n = () => /^\S+/.exec(t)?.[0] ?? "", r = n(), i = !1;
	return r.toLowerCase() === "once" && (i = !0, t = t.slice(r.length).trim(), r = n(), !r) ? {
		once: i,
		src: null
	} : r.toLowerCase() === "if" ? {
		once: i,
		src: t.slice(r.length).trim()
	} : null;
}
var Ke = (e) => e.indexOf(ie);
function qe(e) {
	let t = p(e), n = [], r = /* @__PURE__ */ new Set();
	if (t.length > O.lines) {
		n.push({
			line: O.lines + 1,
			msg: `a script may have at most ${O.lines} lines — the rest is ignored`
		});
		for (let e = O.lines; e < t.length; e++) r.add(e + 1);
		t.length = O.lines;
	}
	let i = [], a = !1, s = !1, l = /* @__PURE__ */ new Map();
	t.forEach((e, t) => {
		let { indent: c, text: u, tab: d, space: f } = je(o(e, "")), { text: p, tag: m } = re(u);
		if (p.length > O.lineLength) {
			n.push({
				line: t + 1,
				msg: `line longer than ${O.lineLength} characters`
			}), r.add(t + 1);
			return;
		}
		if (m && l.set(t + 1, m), p.startsWith("#")) {
			r.add(t + 1);
			return;
		}
		if (p) {
			if (Ke(p) >= 0) {
				n.push({
					line: t + 1,
					msg: `"${ie}" in the line: a key tag is "${ie}" and 32 hex digits at the end of the line, after a space — one per line`
				}), r.add(t + 1);
				return;
			}
			a ||= d, s ||= f, i.push({
				line: t + 1,
				indent: c,
				text: p
			});
		}
	});
	let u = a && s ? " (this script indents with tabs and with spaces: a tab counts as 2 spaces)" : "", d = 0, m = null, h = (e, t, a) => {
		let o = [];
		for (; d < i.length;) {
			let s = i[d];
			if (s.indent < e) break;
			if (s.indent > e) {
				n.push({
					line: s.line,
					msg: `unexpected indentation${u}`
				}), r.add(s.line), d++;
				continue;
			}
			let c = d;
			d++;
			try {
				let e = te(s, t, a, o);
				e && o.push(e);
			} catch (e) {
				for (n.push({
					line: s.line,
					msg: e.message
				}); d < i.length && i[d].indent > s.indent;) d++;
				for (let e = c; e < d; e++) r.add(i[e].line);
				a === "vary" && s.text.startsWith("*") && o.push({
					t: "alt",
					line: s.line,
					body: []
				});
			}
		}
		return o;
	}, g = (e) => d < i.length && i[d].indent > e.indent, _ = (e, t) => {
		let a = i[d].line, o = 0;
		for (; d < i.length && i[d].indent > e.indent;) r.add(i[d].line), d++, o++;
		n.push({
			line: a,
			msg: `unexpected indentation: ${t} takes no indented block — ${o === 1 ? "this line is" : `these ${o} lines are`} left out${u}`
		});
	}, v = (e, t, n = "script") => {
		if (t >= O.depth) throw Error(`blocks nested deeper than ${O.depth}`);
		if (!g(e)) throw Error(`an indented block must follow${u}`);
		return h(i[d].indent, t + 1, n);
	}, ee = (e, t) => {
		if (t.startsWith(":") && (t.length === 1 || /\s/.test(t[1]))) {
			let n = t.slice(1).trim();
			if (!n) throw Error("the line says nothing");
			return m = "", {
				t: "say",
				line: e.line,
				speaker: "",
				text: M(n)
			};
		}
		if (t === "-" || t.startsWith("- ")) {
			let n = t.slice(1).trim();
			if (!n) throw Error("the line says nothing");
			return {
				t: "say",
				line: e.line,
				speaker: m,
				text: M(n)
			};
		}
		let n = /^([a-z]+)(?:\s|$)/.exec(t);
		if (n && c(Oe, n[1])) return null;
		let r = /^"([^"]{1,60})":(\s+([\s\S]*))?$/.exec(t), i = t.indexOf(":");
		if (r || i > 0 && i <= 60 && (i === t.length - 1 || /\s/.test(t[i + 1]))) {
			let n = r ? r[1].trim() : t.slice(0, i).trim(), a = (r ? r[3] ?? "" : t.slice(i + 1)).trim();
			if (!a) throw Error("the line says nothing");
			return m = n, {
				t: "say",
				line: e.line,
				speaker: n,
				text: M(a)
			};
		}
		return null;
	}, y = (e, t) => {
		let n = /^\S+/.exec(e)?.[0] ?? e, r = Ue(n), i = n.includes(":") ? " — a speaker's colon needs a space after it (\"Name: text\")" : t ? " — dialogue is written \"Name: text\"" : "";
		return /* @__PURE__ */ Error(`"${n}" is not a command${r ? ` (did you mean "${r}"?)` : ""}${i}`);
	}, te = (e, t, n, r) => {
		let i = e.text;
		if (n === "choice" && !i.startsWith(">")) throw Error("a choice holds only options (\"> label\")");
		if (n === "vary" && !i.startsWith("*")) throw Error("a cycle / seq / pick holds only \"*\" alternatives");
		if (i.startsWith(">")) {
			if (n !== "choice") throw Error("an option (\"> label\") must be inside a choice");
			let r = i.slice(1).trim(), a = null, o = "", s = !1, c = /^\[([^\]]*)\]\s*/.exec(r), l = c ? Ge(c[1]) : null;
			if (c && l) {
				if (s = l.once, l.src !== null) {
					if (!l.src) throw Error("option condition: the condition is missing — [if <condition>]");
					o = l.src;
					let e = f(o);
					if (e.error) throw Error(`option condition: ${e.error}`);
					a = e.cond;
				}
				r = r.slice(c[0].length).trim();
			}
			if (!r) throw Error("the option has no label");
			let u = g(e) ? v(e, t) : [];
			return {
				t: "option",
				line: e.line,
				label: M(r),
				cond: a,
				src: o,
				once: s,
				body: u
			};
		}
		if (i.startsWith("*")) {
			if (n !== "vary") throw Error("an alternative (\"*\") must be inside a cycle, seq or pick");
			let r = i.slice(1).trim(), a = [];
			if (r) {
				let t = {
					line: e.line,
					indent: e.indent,
					text: r
				}, n = ee(t, r) ?? b(t, r, !0);
				a.push(n);
			}
			if (g(e) && a.push(...v(e, t)), !a.length) throw Error("an empty alternative");
			return {
				t: "alt",
				line: e.line,
				body: a
			};
		}
		let a = ee(e, i);
		if (a) return g(e) && _(e, "a line of dialogue"), a;
		let o = /^([a-z]+)(?:\s+([\s\S]*))?$/.exec(i);
		if (o && c(Oe, o[1])) {
			let n = o[1], a = o[2] ?? "";
			if (n === "if" || n === "elif") {
				if (!a.trim()) throw Error(`${n} <condition>`);
				let i = f(a);
				if (i.error) throw Error(`${n}: ${i.error}`);
				if (n === "elif") {
					let n = r[r.length - 1];
					if (!n || n.t !== "if" || n.otherwise) throw Error("elif without an if before it");
					return n.branches.push({
						cond: i.cond,
						src: a.trim(),
						body: v(e, t)
					}), null;
				}
				return {
					t: "if",
					line: e.line,
					branches: [{
						cond: i.cond,
						src: a.trim(),
						body: v(e, t)
					}],
					otherwise: null
				};
			}
			if (n === "else") {
				N(n, a);
				let i = r[r.length - 1];
				if (!i || i.t !== "if" || i.otherwise) throw Error("else without an if before it");
				return i.otherwise = v(e, t), null;
			}
			if (n === "loop") return N(n, a), {
				t: "loop",
				line: e.line,
				body: v(e, t)
			};
			if (n === "once") {
				let { key: r } = N(n, a);
				return {
					t: "once",
					line: e.line,
					key: r,
					body: v(e, t)
				};
			}
			if (n === "cycle" || n === "seq" || n === "pick") {
				let { key: r } = N(n, a), i = v(e, t, "vary").filter((e) => e.t === "alt").map((e) => e.body);
				if (!i.some((e) => e.length)) throw Error(`a ${n} needs at least one "*" alternative`);
				return {
					t: "vary",
					line: e.line,
					mode: n,
					key: r,
					alts: i
				};
			}
			if (n === "choice") {
				let n = v(e, t, "choice").filter((e) => e.t === "option").map(({ t: e, ...t }) => t);
				if (!n.length) throw Error("a choice needs at least one option");
				if (n.length > 8) throw Error("a choice may offer at most 8 options");
				return {
					t: "choice",
					line: e.line,
					text: M(a.trim()),
					options: n
				};
			}
			return b(e, i);
		}
		throw y(i, !0);
	}, b = (e, t, n = !1) => {
		let r = /^([a-z]+)(?:\s+([\s\S]*))?$/.exec(t);
		if (!r || !c(Oe, r[1])) throw y(t, !1);
		if (ke.has(r[1])) throw Error(`"${r[1]}" needs a line of its own with an indented block`);
		let i = N(r[1], r[2] ?? "");
		return !n && g(e) && _(e, `"${r[1]}"`), {
			t: "cmd",
			line: e.line,
			op: r[1],
			args: i
		};
	}, x = h(i.length ? i[0].indent : 0, 0, "script");
	for (; d < i.length;) n.push({
		line: i[d].line,
		msg: `unexpected indentation${u}`
	}), r.add(i[d].line), d++;
	n.sort((e, t) => e.line - t.line);
	let ae = [];
	if (l.size) {
		let e = /* @__PURE__ */ new Set();
		for (let t of tt(x)) {
			if (!t.held) continue;
			let n = t.option ? t.option.line : t.node.line, r = l.get(n);
			if (!r) continue;
			e.add(n);
			let i = t.node;
			t.option ? t.option.tk = r : t.node.t === "cmd" && (t.node.op === "banner" || t.node.op === "title") ? i.tks = [r, ne(r)] : i.tk = r;
		}
		for (let t of l.keys()) !e.has(t) && !r.has(t) && ae.push(t);
	}
	return {
		nodes: x,
		errors: n,
		stray: ae,
		parked: [...r].sort((e, t) => e - t)
	};
}
function L(e, t) {
	if (!e.includes("$")) return e;
	let n = e.length, r = "", i = 0;
	for (; i < n;) {
		let a = e[i];
		if (a === "\\") {
			let t = i + 1;
			for (; t < n && e[t] === "\\";) t++;
			if (e[t] !== "$") {
				r += e.slice(i, t), i = t;
				continue;
			}
			let a = t - i;
			r += "\\".repeat(a >> 1), a % 2 ? (r += "$", i = t + 1) : i = t;
			continue;
		}
		if (a !== "$") {
			let t = i + 1;
			for (; t < n && e[t] !== "$" && e[t] !== "\\";) t++;
			r += e.slice(i, t), i = t;
			continue;
		}
		if (e[i + 1] === "{") {
			let n = /^\$\{([^{}]{1,90})\}/.exec(e.slice(i, i + 93));
			if (n) {
				r += Je(n[1], n[0], t), i += n[0].length;
				continue;
			}
		} else if (e[i + 1] === "$" && e[i + 2] !== "{") {
			r += "$", i += 2;
			continue;
		}
		r += "$", i++;
	}
	return r;
}
function Je(e, t, n) {
	let r = g(e.trim());
	if (typeof r == "string") return t;
	let i = (r.kind === "stage" || r.kind === "quest") && n.text ? n.text(r) : void 0;
	if (i !== void 0) return String(i);
	let a = n.get(r);
	return String(typeof a == "number" ? Math.round(a * 100) / 100 : a);
}
function Ye(e, t, n, r, i, a = 0) {
	if (t <= 1) return 0;
	if (e === "cycle") return n % t;
	if (e === "seq") return Math.min(n, t - 1);
	let o = 2166136261, s = `${r}|${i}|${n}`;
	for (let e = 0; e < s.length; e++) o ^= s.charCodeAt(e), o = Math.imul(o, 16777619);
	let c = typeof a == "number" ? a >>> 0 : 0;
	return c && (o ^= c, o ^= o >>> 16, o = Math.imul(o, 2246822507), o ^= o >>> 13, o = Math.imul(o, 3266489909), o ^= o >>> 16), (o >>> 0) % t;
}
var Xe = /* @__PURE__ */ new Set(/* @__PURE__ */ "bark.emote.walk.face.teleport.home.wait.set.clear.var.give.take.quest.heal.sfx.toast.banner.music.weather.shake.call.stop.break.party.pose.effect".split(".")), Ze = Object.freeze({
	cutscene: "a cutscene holds the player",
	camera: "the camera stays with the player",
	fade: "a fade takes the screen from the player",
	travel: "travel takes the player to another level",
	rest: "resting holds the player",
	shop: "the shop needs the player",
	builtin: "a conversation needs the player",
	ending: "the ending holds the player",
	time: "a clock jump re-lights the scene and runs the time events at once",
	shot: "the camera stays with the player",
	slowmo: "slow motion takes the whole game's time from the player",
	flash: "a flash takes the screen from the player",
	title: "a title card takes the screen from the player",
	thaw: "the thaw front changes the whole level under the player",
	toll: "a toll is a beat of a scene: it rings while the story holds the player"
});
function Qe(e) {
	switch (e?.t) {
		case "say": return "dialogue needs the player";
		case "choice": return "a choice needs the player's answer";
		case "if":
		case "loop":
		case "once":
		case "vary": return "";
		case "cmd": {
			let t = e.op;
			return Xe.has(t) ? (t === "walk" || t === "face" || t === "teleport" || t === "pose") && $e(e.args?.who) ? `"${t} player": the player is the player's in the background` : t === "party" && e.args?.verb === "menu" ? "the tactics panel needs the player" : "" : c(Ze, t) ? Ze[t] : `"${t}" needs the player`;
		}
		default: return "not a line a background run knows";
	}
}
function $e(e) {
	return typeof e == "string" && e.toLowerCase() === "player";
}
function R(e, t) {
	for (let n of e ?? []) if (t(n), n.t === "choice") for (let e of n.options) R(e.body, t);
	else if (n.t === "if") {
		for (let e of n.branches) R(e.body, t);
		R(n.otherwise, t);
	} else if (n.t === "loop" || n.t === "once") R(n.body, t);
	else if (n.t === "vary") for (let e of n.alts) R(e, t);
}
function et(e) {
	return typeof e == "string" && e.trim() !== "";
}
function tt(e) {
	let t = [], n = (e, n, r, i, a) => t.push({
		n: t.length,
		node: e,
		option: n,
		part: r,
		kind: i,
		text: typeof a == "string" ? a : "",
		held: et(a)
	});
	return R(e, (e) => {
		if (e.t === "say") n(e, null, "text", "line", e.text);
		else if (e.t === "choice") {
			n(e, null, "question", "line", e.text);
			for (let t of e.options) n(e, t, "option", "choice", t.label);
		} else if (e.t === "cmd") {
			let t = e.args ?? {};
			e.op === "bark" || e.op === "toast" ? n(e, null, "text", "line", t.text) : e.op === "banner" || e.op === "title" ? (n(e, null, "title", "title", t.title), n(e, null, "subtitle", "title", t.subtitle)) : e.op === "quest" && t.verb === "stage" ? n(e, null, "text", "line", t.text) : e.op === "ending" && n(e, null, "title", "title", t.title);
		}
	}), t;
}
//#endregion
//#region src/game/story/StoryState.js
var z = 4096, B = 1e9, V = 200, nt = 1e5, H = (e) => !!e && typeof e == "object" && !Array.isArray(e), U = (e) => typeof e == "number" && Number.isFinite(e) ? e : null, rt = (e) => Math.max(-1e9, Math.min(B, e)), W = () => Object.create(null);
function it(e) {
	return typeof e == "string" && e.length > 0 && e.length <= 80 && e === e.trim() && !/[\u0000-\u001f\u007f]/.test(e);
}
function at() {
	let e = globalThis.location ? new URLSearchParams(globalThis.location.search).get("seed") : null, t = e !== null && /^\d{1,10}$/.test(e) ? Number(e) >>> 0 : 0;
	if (t) return t;
	let n = globalThis.crypto;
	return n?.getRandomValues ? n.getRandomValues(/* @__PURE__ */ new Uint32Array(1))[0] || 1 : Date.now() >>> 0 || 1;
}
function G(e) {
	if (e.length <= V) return e;
	let t = 2166136261;
	for (let n = 0; n < e.length; n++) t ^= e.charCodeAt(n), t = Math.imul(t, 16777619) >>> 0;
	return `${e.slice(0, 190)}#${t.toString(36)}`;
}
var ot = 60, st = 200, ct = 32, lt = 4096, ut = /^[A-Za-z][A-Za-z0-9_]{0,39}$/, dt = /^#[0-9a-fA-F]{3,8}$/, ft = (e, t) => typeof e == "string" ? e.replace(/[\u0000-\u001f\u007f]/g, "").trim().slice(0, t) : "";
function pt(e, t = 0) {
	if (!H(e)) return null;
	let n = {}, r = 0;
	for (let [i, a] of Object.entries(e)) {
		if (r >= ct) break;
		if (!ut.test(i) || i === "constructor" || i === "prototype") continue;
		let e;
		if (typeof a == "string") e = a.slice(0, 80);
		else if (typeof a == "boolean" || a === null || typeof a == "number" && Number.isFinite(a)) e = a;
		else if (t === 0 && H(a)) e = pt(a, 1);
		else continue;
		(e !== null || a === null) && (n[i] = e, r++);
	}
	return t === 0 && JSON.stringify(n).length > lt ? null : n;
}
function mt(e) {
	if (!Array.isArray(e)) return [];
	let t = [], n = /* @__PURE__ */ new Set(), r = /* @__PURE__ */ new Set();
	for (let i of e.slice(0, 64)) {
		if (t.length >= 3) break;
		if (!H(i) || !y(i.id) || n.has(i.id)) continue;
		let e = y(i.actor) ? i.actor : "";
		if (e && r.has(e)) continue;
		n.add(i.id), e && r.add(e);
		let a = pt(i.spec);
		t.push({
			id: i.id,
			name: ft(i.name, ot) || i.id,
			actor: e,
			preset: y(i.preset) && i.preset.length <= 40 ? i.preset : "villager",
			spec: a,
			color: typeof i.color == "string" && dt.test(i.color) ? i.color : "#c9a45c",
			cls: E(i.cls) ? i.cls : me(a?.weapon),
			rule: ve(i.rule),
			level: y(i.level) ? i.level : ""
		});
	}
	return t;
}
function ht(e, t) {
	if (!e?.length) return !1;
	let n = String(t).toLowerCase();
	return e.some((e) => e.id.toLowerCase() === n || !!e.actor && e.actor.toLowerCase() === n || e.name.toLowerCase() === n);
}
function gt(e, t) {
	let n = (n, r) => {
		if (!r) return 0;
		let i = s(t.story?.quests ?? {}, n)?.stages;
		if (i?.length) {
			let e = i.findIndex((e) => e.id === r);
			return e >= 0 ? e + 1 : i.length + 1;
		}
		let a = e().quest(n)?.log ?? [], o = a.indexOf(r);
		return o >= 0 ? o + 1 : a.length + 1;
	}, r = (e, n) => {
		let r = t.visitKeys?.(n) ?? [];
		for (let i of [
			...r,
			`actor:${n}`,
			`actor:${n.toLowerCase()}`,
			`${t.level()}/${n}`,
			n
		]) if (Object.hasOwn(e.visits, i)) return e.visits[i];
		return 0;
	};
	return {
		get(i) {
			let a = e();
			switch (i.kind) {
				case "": return a.get(i.name);
				case "item": return a.count(i.name);
				case "quest": return a.quest(i.name)?.state ?? "none";
				case "stage": return n(i.name, a.quest(i.name)?.stage ?? "");
				case "visits": return r(a, i.name);
				case "visited": return +!!t.visited?.().includes(i.name);
				case "party": return +!!ht(a.party, i.name);
				case "done": return a.isDone(`${t.level()}.${i.name}`) || a.isDone(i.name) || a.isDone(`story.${i.name}`) || a.isDone(`once:${i.name}`) ? 1 : 0;
				case "game": {
					if (i.name === "day") return a.day;
					if (i.name === "level") return t.level();
					if (i.name === "party") return a.party?.length ?? 0;
					let e = t.game?.(i.name);
					return e === void 0 ? i.name === "gold" ? a.gold : i.name === "chapter" || i.name === "weather" ? "" : 0 : e;
				}
				default: return 0;
			}
		},
		word(t, r) {
			return t.kind === "stage" ? n(t.name, r) : t.kind === "quest" || t.kind === "game" && (t.name === "chapter" || t.name === "level" || t.name === "weather") ? r : e().get(r);
		},
		text(t) {
			let n = e();
			if (t.kind === "stage") return n.quest(t.name)?.stage ?? "";
			if (t.kind === "quest") return n.quest(t.name)?.state ?? "none";
		}
	};
}
var _t = class e {
	constructor(e = null, t = []) {
		this.vars = W();
		for (let [t, n] of Object.entries(e?.vars ?? {})) n && (this.vars[t] = n);
		for (let e of t) it(e) && (this.vars[e] = 1);
		this.items = W(), this.itemNames = W(), this.gold = 0, this.quests = W(), this.done = /* @__PURE__ */ new Set(), this.counters = W(), this.visits = W(), this.day = 1, this.levels = W(), this.ending = "", this.pending = [], this.seed = 0, this.party = [], this.version = 0;
	}
	setParty(e) {
		this.party = e.map((e) => ({
			...e,
			spec: e.spec ? { ...e.spec } : null,
			rule: { ...e.rule }
		})), this.version++;
	}
	get(e) {
		return Object.hasOwn(this.vars, e) ? this.vars[e] : 0;
	}
	has(e) {
		return this.get(String(e).trim()) !== 0;
	}
	setVar(e, t) {
		if (!v(e) || !Number.isFinite(t)) return !1;
		let n = rt(t);
		return this.get(e) !== n && (n === 0 ? delete this.vars[e] : this.vars[e] = n, this.version++, !0);
	}
	setFlag(e, t = !0) {
		return v(e) ? this.setVar(e, +!!t) : !it(e) || this.has(e) === t ? !1 : (t ? this.vars[e] = 1 : delete this.vars[e], this.version++, !0);
	}
	count(e) {
		return e === "gold" ? this.gold : Object.hasOwn(this.items, e) ? this.items[e] : 0;
	}
	addItem(e, t) {
		if (!y(e) || !Number.isFinite(t) || t === 0) return 0;
		let n = this.count(e), r = Math.max(0, Math.min(B, n + Math.trunc(t)));
		return r === n ? 0 : (e === "gold" ? this.gold = r : r === 0 ? delete this.items[e] : this.items[e] = r, this.version++, r - n);
	}
	nameItem(e, t) {
		let n = ft(t, st);
		return !y(e) || e === "gold" || !n || !Object.hasOwn(this.itemNames, e) && Object.keys(this.itemNames).length >= z ? !1 : (this.itemNames[e] = n, !0);
	}
	itemNameOf(e) {
		return Object.hasOwn(this.itemNames, e) ? this.itemNames[e] : "";
	}
	quest(e) {
		return Object.hasOwn(this.quests, e) ? this.quests[e] : null;
	}
	questChange(e, t, { stage: n = "", text: r = "", key: i = "", src: a = "" } = {}) {
		if (!y(e)) return "";
		let o = this.quest(e), s = !o;
		if (!o) {
			if (Object.keys(this.quests).length >= z) return "";
			o = {
				state: "active",
				stage: "",
				log: [],
				title: "",
				texts: W(),
				keys: W(),
				src: W()
			}, this.quests[e] = o;
		}
		let c = "";
		return t === "start" ? (r && !o.title && (o.title = r), c = s ? "start" : "") : t === "stage" ? (r && (o.texts[n] = r, o.keys ??= W(), o.src ??= W(), x(i) && typeof a == "string" ? (o.keys[n] = i, o.src[n] = a) : (delete o.keys[n], delete o.src[n])), o.stage !== n && (o.stage = n, o.log.includes(n) || o.log.push(n), c = s ? "start" : "stage"), o.state !== "active" && (o.state = "active", c ||= "stage")) : t === "done" && o.state !== "done" ? (o.state = "done", c = "done") : t === "fail" && o.state !== "failed" && (o.state = "failed", c = "fail"), (c || s) && this.version++, c;
	}
	isDone(e) {
		return this.done.has(G(e));
	}
	markDone(e) {
		let t = G(e);
		return !this.done.has(t) && (this.done.size >= z * 4 && this.done.delete(this.done.values().next().value), this.done.add(t), this.version++, !0);
	}
	bump(e) {
		let t = G(e), n = Object.hasOwn(this.counters, t) ? this.counters[t] : 0;
		return (Object.keys(this.counters).length < z || Object.hasOwn(this.counters, t)) && (this.counters[t] = n + 1), n;
	}
	visitsOf(e) {
		let t = G(e);
		return Object.hasOwn(this.visits, t) ? this.visits[t] : 0;
	}
	visit(e) {
		let t = G(e), n = this.visitsOf(t);
		return (Object.keys(this.visits).length < z || Object.hasOwn(this.visits, t)) && (this.visits[t] = n + 1), this.version++, n;
	}
	levelMemory(e) {
		return Object.hasOwn(this.levels, e) || (this.levels[e] = { homes: W() }), this.levels[e];
	}
	basicReader(e = {}) {
		return gt(() => this, {
			level: () => "",
			...e
		});
	}
	toJSON() {
		return {
			vars: { ...this.vars },
			items: { ...this.items },
			...Object.keys(this.itemNames).length ? { itemNames: { ...this.itemNames } } : {},
			gold: this.gold,
			quests: Object.fromEntries(Object.entries(this.quests).map(([e, t]) => [e, {
				state: t.state,
				stage: t.stage,
				log: [...t.log],
				...t.title ? { title: t.title } : {},
				...Object.keys(t.texts).length ? { texts: { ...t.texts } } : {},
				...t.keys && Object.keys(t.keys).length ? { keys: { ...t.keys } } : {},
				...t.src && Object.keys(t.src).length ? { src: { ...t.src } } : {}
			}])),
			done: [...this.done],
			counters: { ...this.counters },
			visits: { ...this.visits },
			day: this.day,
			levels: Object.fromEntries(Object.entries(this.levels).map(([e, t]) => [e, { homes: { ...t.homes } }])),
			...this.ending ? { ending: this.ending } : {},
			...this.pending.length ? { pending: [...this.pending] } : {},
			...this.seed ? { seed: this.seed } : {},
			...this.party.length ? { party: this.party.map((e) => ({
				...e,
				spec: e.spec ? JSON.parse(JSON.stringify(e.spec)) : null,
				rule: { ...e.rule }
			})) } : {}
		};
	}
	static fromJSON(t, n = null) {
		let r = new e(n);
		if (!H(t)) return r;
		let i = t, a = (e) => H(e) ? Object.entries(e).slice(0, z) : [];
		r.vars = W();
		for (let [e, t] of a(i.vars)) (v(e) || it(e) && t === 1) && U(t) !== null && t !== 0 && (r.vars[e] = rt(t));
		for (let [e, t] of a(i.items)) y(e) && e !== "gold" && U(t) !== null && t > 0 && (r.items[e] = Math.min(B, Math.floor(t)));
		for (let [e, t] of a(i.itemNames)) typeof t == "string" && r.nameItem(e, t);
		r.gold = Math.max(0, Math.min(B, Math.floor(U(i.gold) ?? 0)));
		for (let [e, t] of a(i.quests)) {
			if (!y(e) || !H(t)) continue;
			let n = [
				"active",
				"done",
				"failed"
			].includes(t.state) ? t.state : "active", i = (e) => typeof e == "string" && /^[A-Za-z0-9_][A-Za-z0-9_.-]{0,79}$/.test(e), o = W();
			for (let [e, n] of a(t.texts)) i(e) && typeof n == "string" && (o[e] = n.slice(0, 2e3));
			let s = W(), c = W(), l = H(t.src) ? t.src : {};
			for (let [e, n] of a(t.keys)) {
				let t = Object.hasOwn(l, e) ? l[e] : void 0;
				Object.hasOwn(o, e) && x(n) && typeof t == "string" && (s[e] = n, c[e] = t.slice(0, 2e3));
			}
			r.quests[e] = {
				state: n,
				stage: i(t.stage) ? t.stage : "",
				log: Array.isArray(t.log) ? t.log.filter(i).slice(0, 256) : [],
				title: typeof t.title == "string" ? t.title.slice(0, 200) : "",
				texts: o,
				keys: s,
				src: c
			};
		}
		if (Array.isArray(i.done)) for (let e of i.done.slice(0, z * 4)) typeof e == "string" && e.length <= V && r.done.add(e);
		for (let [e, t] of a(i.counters)) e.length <= V && U(t) !== null && t >= 0 && (r.counters[e] = Math.min(B, Math.floor(t)));
		for (let [e, t] of a(i.visits)) e.length <= V && U(t) !== null && t >= 0 && (r.visits[e] = Math.min(B, Math.floor(t)));
		r.day = Math.max(1, Math.min(B, Math.floor(U(i.day) ?? 1)));
		for (let [e, t] of a(i.levels)) {
			if (!y(e) || !H(t)) continue;
			let n = r.levelMemory(e);
			for (let [e, r] of a(t.homes)) {
				let t = (e) => U(e) !== null && Math.abs(e) <= nt;
				y(e) && Array.isArray(r) && r.length === 2 && t(r[0]) && t(r[1]) && (n.homes[e] = [r[0], r[1]]);
			}
		}
		return r.ending = y(i.ending) ? i.ending : "", Array.isArray(i.pending) && (r.pending = i.pending.filter((e) => typeof e == "string" && e.length <= 300 && /^(event|story|talk):/.test(e)).slice(0, 64)), r.seed = Number.isInteger(i.seed) && i.seed > 0 && i.seed <= 4294967295 ? i.seed : 0, r.party = mt(i.party), r;
	}
}, vt = Object.freeze({
	glow: {
		preset: "embers",
		keys: Object.freeze({
			texture: "glow",
			twinkle: 0,
			fade: Object.freeze([.02, .6])
		})
	},
	fire: {
		preset: "embers",
		keys: Object.freeze({
			texture: "smoke",
			twinkle: 0,
			fade: Object.freeze([.04, .55])
		})
	},
	flame: {
		preset: "footstep",
		keys: Object.freeze({
			lit: 0,
			fade: Object.freeze([.02, .45])
		})
	},
	ice: {
		preset: "sparkle",
		keys: Object.freeze({ texture: "snow" })
	},
	spark: {
		preset: "emberBurst",
		keys: Object.freeze({})
	},
	star: {
		preset: "sparkle",
		keys: Object.freeze({})
	},
	ember: {
		preset: "embers",
		keys: Object.freeze({})
	},
	dust: {
		preset: "footstep",
		keys: Object.freeze({})
	},
	smoke: {
		preset: "smoke",
		keys: Object.freeze({})
	},
	chips: {
		preset: "splash",
		keys: Object.freeze({})
	},
	snow: {
		preset: "snow",
		keys: Object.freeze({})
	},
	bit: {
		preset: "splash",
		keys: Object.freeze({
			blending: "cutout",
			lit: 0
		})
	},
	petal: {
		preset: "petals",
		keys: Object.freeze({})
	},
	leaf: {
		preset: "leaves",
		keys: Object.freeze({})
	}
}), yt = Object.freeze([
	"dust",
	"chips",
	"smoke",
	"snow",
	"flame",
	"bit",
	"petal",
	"leaf",
	"fire",
	"glow",
	"ice",
	"star",
	"spark",
	"ember"
]), bt = Object.freeze({
	velocity: [
		0,
		0,
		0
	],
	velocityVariance: [
		0,
		0,
		0
	],
	windInfluence: 0,
	spin: [0, 0],
	gravity: 0,
	drag: 0,
	alpha: 1,
	hdr: 1,
	sizeEnd: 1,
	spawnSize: [
		.2,
		.2,
		.2
	],
	burstSpeed: [0, 0],
	burstUp: [0, 0],
	ballistic: !1
}), xt = 96, St = Object.freeze({
	x: 0,
	y: -1e3,
	z: 0
}), K = {
	x: 0,
	y: 0,
	z: 0
};
function q(e, t, n, r, i, a, o) {
	let s = e.particles, c = Math.min(xt, Math.round(a));
	if (!s || c <= 0) return;
	K.x = n, K.y = r, K.z = i;
	let l = vt[t];
	s.burst(l.preset, K, c, {
		...bt,
		...o,
		...l.keys
	});
}
var J = (e, t, n) => [e * n, t * n], Y = /* @__PURE__ */ new WeakMap();
function Ct(e) {
	let t = Y.get(e);
	return t || (t = {
		time: 0,
		jobs: [],
		plays: 0
	}, Y.set(e, t)), t;
}
function X(e, t, n) {
	if (!(t > 0)) {
		n();
		return;
	}
	let r = Ct(e);
	r.jobs.push({
		at: r.time + t,
		fn: n
	});
}
function wt(e, t) {
	let n = Y.get(e);
	if (!n || (n.time += Math.max(0, t), !n.jobs.length)) return;
	let r = [], i = [];
	for (let e of n.jobs) (e.at <= n.time ? r : i).push(e);
	if (r.length) {
		n.jobs = i, r.sort((e, t) => e.at - t.at);
		for (let e of r) try {
			e.fn();
		} catch (e) {
			console.warn("[Luminati] story: an effect failed:", e);
		}
	}
}
function Tt(e) {
	let t = Y.get(e);
	t && (t.jobs.length = 0);
}
function Et(e) {
	return Y.get(e)?.jobs.length ?? 0;
}
function Dt(e, t, n) {
	let i = e.rig, a = i?.focusPoint;
	if (!a) return {
		vol: 1,
		pan: 0,
		near: 1
	};
	let o = t - a.x, s = n - a.z, c = Math.hypot(o, s), l = Number.isFinite(i.yaw) ? i.yaw : 0;
	return {
		vol: r(1.15 - c / 36, .12, 1),
		pan: r((o * Math.cos(l) - s * Math.sin(l)) / 14, -.9, .9),
		near: r(1 - c / 26, 0, 1)
	};
}
function Z(e, t, n, r, i = 1, a = 1) {
	let o = Dt(e, n, r);
	e.audio?.playSfx?.(t, {
		volume: i * o.vol,
		pan: o.pan,
		pitch: a
	});
}
function Ot(e, t, n, r, i) {
	let a = Dt(e, t, n).near;
	a > .02 && e.rig?.shake?.(r * a, i);
}
function kt(e, t, n, r, i) {
	let a = Dt(e, t, n).near * i, o = e.story;
	a > .04 && o?.screenFlash?.(r, .32, Math.min(.6, a));
}
function Q(e, t, n, r, i, a, o, s, c) {
	let l = typeof c.drag == "number" && c.drag > 0 ? c.drag : 0, u = l ? a * l / (1 - Math.exp(-l * o)) : a / o;
	q(e, t, n, r, i, s, {
		life: [o * .92, o],
		burstSpeed: [u, u * 1.04],
		burstUp: [0, .05],
		spawnSize: [
			.15,
			.05,
			.15
		],
		...c
	});
}
function At(e, t, n, r, i, a, o = [
	"#3b2f28",
	"#5a4a3a",
	"#2a2220",
	"#6e5c48"
]) {
	q(e, "chips", t, n + .2, r, a, {
		life: [.7, 1.4],
		size: J(.08, .17, i),
		sizeEnd: .9,
		burstSpeed: J(1.8, 4.6, i),
		burstUp: J(3.5, 7.5, Math.sqrt(i)),
		gravity: -14,
		drag: .3,
		spawnSize: J(.5, .5, i).concat(.5 * i),
		colors: o,
		hdr: 1,
		ballistic: !0,
		spin: [2, 8]
	});
}
function jt(e, t, n, i, a) {
	let o = r(a, .4, 3), s = n + .5 * a;
	q(e, "flame", t, s, i, 10 * o, {
		life: [.8, 1.25],
		size: J(.85, 1.3, a),
		sizeEnd: 2.1,
		burstSpeed: J(2.2, 4, a),
		burstUp: J(.4, 1.6, a),
		drag: 3.6,
		gravity: 2.2,
		spawnSize: J(.8, .4, a).concat(.8 * a),
		colors: [
			"#c8401a",
			"#a8301a",
			"#e0581c"
		],
		hdr: 1.05,
		spin: [.4, 1.4]
	}), q(e, "flame", t, s, i, 14 * o, {
		life: [.6, 1],
		size: J(.8, 1.2, a),
		sizeEnd: 1.9,
		burstSpeed: J(1.3, 2.9, a),
		burstUp: J(.6, 2, a),
		drag: 3.4,
		gravity: 1.9,
		spawnSize: J(.7, .4, a).concat(.7 * a),
		colors: [
			"#ff9a3c",
			"#ff7a24",
			"#f6682a"
		],
		hdr: 1.2,
		spin: [.4, 1.4]
	}), q(e, "flame", t, s, i, 12 * o, {
		life: [.45, .8],
		size: J(.65, 1, a),
		sizeEnd: 1.7,
		burstSpeed: J(.6, 1.8, a),
		burstUp: J(.8, 2.2, a),
		drag: 3.2,
		gravity: 1.6,
		spawnSize: J(.5, .4, a).concat(.5 * a),
		colors: [
			"#fff3b8",
			"#ffe08a",
			"#ffc45a"
		],
		hdr: 1.35,
		spin: [.4, 1.4]
	}), q(e, "fire", t, s, i, 5 * o, {
		life: [.2, .36],
		size: J(.6, .9, a),
		sizeEnd: 1.7,
		burstSpeed: J(.4, 1.4, a),
		burstUp: J(.4, 1.2, a),
		drag: 3.6,
		gravity: 1,
		spawnSize: J(.4, .3, a).concat(.4 * a),
		colors: ["#ffd27a", "#ffa23c"],
		hdr: 1.25,
		spin: [.5, 2]
	}), q(e, "glow", t, s, i, 1, {
		life: [.1, .12],
		size: J(1.6, 1.6, a),
		sizeEnd: 1.8,
		color: "#fff0c8",
		hdr: 2.4,
		spawnSize: [
			0,
			0,
			0
		]
	}), q(e, "spark", t, s, i, 18 * o, {
		life: [.3, .75],
		size: [.05, .08],
		sizeEnd: .5,
		burstSpeed: J(4.5, 10.5, Math.sqrt(a)),
		burstUp: J(2.5, 8, Math.sqrt(a)),
		gravity: -9,
		drag: 1.2,
		spawnSize: [
			.3,
			.3,
			.3
		],
		colors: [
			"#fff2c0",
			"#ffb04a",
			"#ff7a2a"
		],
		hdr: 2.8
	}), Q(e, "dust", t, n + .2, i, 3.8 * a, 1.2, 20 * o, {
		size: J(.6, .9, a),
		sizeEnd: 3,
		drag: 2.2,
		colors: [
			"#c9b391",
			"#b39c7a",
			"#d8c4a0"
		],
		alpha: .75,
		spin: [.5, 2]
	}), At(e, t, n, i, a, 10 * o), X(e, .14, () => {
		q(e, "flame", t, s + .5 * a, i, 8 * o, {
			life: [.7, 1.1],
			size: J(.7, 1.05, a),
			sizeEnd: 1.9,
			burstSpeed: J(.4, 1.2, a),
			burstUp: J(1.6, 2.8, Math.sqrt(a)),
			drag: 1.8,
			gravity: 1.6,
			spawnSize: J(.7, .5, a).concat(.7 * a),
			colors: [
				"#d8501c",
				"#b8381a",
				"#ff7a24"
			],
			hdr: 1.1,
			spin: [.4, 1.4]
		}), q(e, "flame", t, s + .4 * a, i, 6 * o, {
			life: [.5, .85],
			size: J(.55, .85, a),
			sizeEnd: 1.7,
			burstSpeed: J(.3, 1, a),
			burstUp: J(1.8, 3, Math.sqrt(a)),
			drag: 1.8,
			gravity: 1.4,
			spawnSize: J(.5, .4, a).concat(.5 * a),
			colors: ["#ffc45a", "#ffa23c"],
			hdr: 1.25,
			spin: [.4, 1.4]
		});
	}), X(e, .3, () => q(e, "smoke", t, s + .8 * a, i, 12 * o, {
		life: [2.4, 3.8],
		size: J(.8, 1.2, a),
		sizeEnd: 3.6,
		burstSpeed: J(.5, 1.3, a),
		burstUp: J(1.4, 2.6, Math.sqrt(a)),
		drag: 1.2,
		gravity: .45,
		windInfluence: .25,
		spawnSize: J(1, .6, a).concat(1 * a),
		colors: [
			"#2c2624",
			"#3a3330",
			"#4a413c"
		],
		alpha: .8,
		spin: [.1, .5]
	})), X(e, .12, () => q(e, "ember", t, s, i, 14 * o, {
		life: [1.4, 2.8],
		size: [.06, .1],
		sizeEnd: .4,
		burstSpeed: [.4, 1.8],
		burstUp: [1.4, 3.4],
		gravity: .6,
		drag: .8,
		windInfluence: .45,
		spawnSize: J(1.4, .6, a).concat(1.4 * a),
		colors: [
			"#ff8a2a",
			"#ffc070",
			"#ff5a1a"
		],
		hdr: 2.2
	}));
}
var Mt = Object.freeze([
	[
		"#fff1c4",
		"#ffd06a",
		"#ffb04a"
	],
	[
		"#e6fbff",
		"#9fdcff",
		"#5288e6"
	],
	[
		"#ffd0e6",
		"#ff8ab4",
		"#fff1c4"
	],
	[
		"#d8ffe8",
		"#7fe3b0",
		"#e6fbff"
	],
	[
		"#fff6e0",
		"#ff9a7a",
		"#d0452f"
	]
]), Nt = [
	"glow",
	"fire",
	"flame",
	"spark",
	"dust",
	"chips",
	"smoke",
	"ember"
], Pt = {
	explosion: {
		pools: Nt,
		play(e, t, n, r, i) {
			jt(e, t, n, r, i), Z(e, "explosion", t, r, Math.min(1, .7 + .15 * i)), Ot(e, t, r, Math.min(.9, .42 * i), .55), kt(e, t, r, "gold", .18 * Math.min(1.5, i));
		}
	},
	fireball: {
		pools: Nt,
		play(e, t, n, r, i, a) {
			let o = Number.isFinite(e.rig?.yaw) ? e.rig.yaw : 0, s = (a.chance(.5) ? -1 : 1) * a.range(9, 13), c = a.range(2, 5), l = t + Math.cos(o) * s - Math.sin(o) * c, u = r - Math.sin(o) * s - Math.cos(o) * c, d = n + 13 + a.range(0, 3), f = n + .4 * i;
			Z(e, "fireballFall", t, r, .85);
			for (let n = 0; n <= 63; n++) {
				let a = n / 63, o = a * a * (1.6 - .6 * a), s = l + (t - l) * o, c = d + (f - d) * o, p = u + (r - u) * o;
				X(e, n * .016666666666666666, () => {
					q(e, "glow", s, c, p, 1, {
						life: [.07, .09],
						size: J(1.1, 1.2, i),
						sizeEnd: .9,
						color: "#ffe6a8",
						hdr: 2.6,
						spawnSize: [
							0,
							0,
							0
						]
					}), q(e, "flame", s, c, p, 2, {
						life: [.28, .5],
						size: J(.45, .7, i),
						sizeEnd: 1.6,
						burstSpeed: [.2, .8],
						burstUp: [.2, .9],
						drag: 2,
						gravity: 1,
						spawnSize: J(.25, .25, i).concat(.25 * i),
						colors: [
							"#ffe08a",
							"#ffaa3c",
							"#ff7a2a"
						],
						hdr: 1.35,
						spin: [.5, 2]
					}), n % 2 == 0 && q(e, "smoke", s, c, p, 1, {
						life: [1.2, 2],
						size: J(.6, .85, i),
						sizeEnd: 3.4,
						burstSpeed: [.1, .4],
						burstUp: [.2, .6],
						drag: 1,
						gravity: .25,
						windInfluence: .25,
						spawnSize: [
							.2,
							.2,
							.2
						],
						colors: ["#2e2826", "#3d3532"],
						alpha: .78,
						spin: [.1, .5]
					}), n % 3 == 0 && q(e, "spark", s, c, p, 2, {
						life: [.25, .5],
						size: [.05, .07],
						sizeEnd: .5,
						burstSpeed: [.5, 2],
						burstUp: [-.5, 1.5],
						gravity: -6,
						drag: 1.5,
						spawnSize: [
							.2,
							.2,
							.2
						],
						colors: ["#ffd27a", "#ff8a2a"],
						hdr: 2.6
					});
				});
			}
			X(e, 1.0666666666666667, () => {
				jt(e, t, n, r, i * 1.15), Z(e, "explosion", t, r, Math.min(1, .8 + .12 * i)), Ot(e, t, r, Math.min(1, .5 * i), .6), kt(e, t, r, "gold", .22 * Math.min(1.5, i));
			});
		}
	},
	flames: {
		pools: [
			"glow",
			"fire",
			"flame",
			"ember",
			"smoke"
		],
		play(e, t, n, i, a) {
			let o = .05;
			Z(e, "fireRoar", t, i, .75);
			for (let s = 0; s < 52; s++) {
				let c = s / 52, l = Math.min(1, s * o / .3, (2.6 - s * o) / .6);
				X(e, s * o, () => {
					let o = a * (.6 + .4 * l);
					q(e, "flame", t, n + .15, i, Math.max(1, 2.6 * l * r(a, .5, 2.5)), {
						life: [.45, .85],
						size: J(.45, .8, o),
						sizeEnd: .3,
						burstSpeed: [.05, .3],
						burstUp: J(1.4, 2.6, Math.sqrt(a)),
						gravity: 1.4,
						drag: 1.4,
						spawnSize: J(1.1, .2, a).concat(1.1 * a),
						colors: [
							"#ffe08a",
							"#ffb347",
							"#ff8a2a",
							"#f0601c"
						],
						hdr: 1.3,
						spin: [.5, 1.5]
					}), s % 2 == 0 && q(e, "fire", t, n + .2, i, 1, {
						life: [.35, .6],
						size: J(.6, .9, o),
						sizeEnd: .4,
						burstSpeed: [.05, .2],
						burstUp: J(1, 1.8, Math.sqrt(a)),
						gravity: 1,
						drag: 1.4,
						spawnSize: J(.8, .2, a).concat(.8 * a),
						colors: ["#ffc45a", "#ff8a2a"],
						hdr: 1.3,
						spin: [.5, 1.5]
					}), s % 4 == 0 && q(e, "glow", t, n + .45 * a, i, 1, {
						life: [.3, .4],
						size: J(1.7, 2, o),
						sizeEnd: 1.1,
						color: "#ffa04a",
						hdr: 1.3,
						spawnSize: J(.4, .2, a).concat(.4 * a)
					}), s % 3 == 0 && q(e, "ember", t, n + .4, i, 2, {
						life: [1, 2],
						size: [.06, .1],
						sizeEnd: .4,
						burstSpeed: [.2, .8],
						burstUp: [1.5, 3],
						gravity: .6,
						drag: .7,
						windInfluence: .5,
						spawnSize: J(1, .4, a).concat(1 * a),
						colors: ["#ff8a2a", "#ffc070"],
						hdr: 2.2
					}), s % 5 == 0 && c > .1 && q(e, "smoke", t, n + 1.3 * a, i, 1, {
						life: [2.2, 3.4],
						size: J(.6, .9, a),
						sizeEnd: 3.4,
						burstSpeed: [.1, .3],
						burstUp: [.8, 1.3],
						drag: .6,
						gravity: .2,
						windInfluence: .3,
						spawnSize: J(.6, .2, a).concat(.6 * a),
						colors: [
							"#2e2826",
							"#3d3532",
							"#4a423e"
						],
						alpha: .7,
						spin: [.1, .4]
					});
				});
			}
		}
	},
	smoke: {
		pools: ["dust", "smoke"],
		play(e, t, n, i, a) {
			let o = r(a, .5, 2.5);
			Z(e, "breath", t, i, .35, .7), q(e, "dust", t, n + .2, i, 10 * o, {
				life: [.9, 1.4],
				size: J(.7, 1, a),
				sizeEnd: 2.8,
				burstSpeed: J(1, 2.4, a),
				burstUp: [.2, .7],
				drag: 2.4,
				colors: [
					"#6a6460",
					"#57514d",
					"#7a7470"
				],
				alpha: .7,
				spin: [.5, 2]
			});
			for (let r = 0; r < 26; r++) {
				let s = r / 26;
				X(e, r * .11, () => q(e, "smoke", t, n + .4 * a, i, 3 * o, {
					life: [3.2, 5.2],
					size: J(.8, 1.2, a),
					sizeEnd: 4.4,
					burstSpeed: J(.2, .7, a),
					burstUp: [.9, 1.7],
					drag: .45,
					gravity: .18,
					windInfluence: .3,
					spawnSize: J(1, .3, a).concat(1 * a),
					colors: s < .5 ? [
						"#3a3432",
						"#47413e",
						"#2e2a28"
					] : [
						"#5a5552",
						"#6b6662",
						"#47423f"
					],
					alpha: .72,
					spin: [.1, .4]
				}));
			}
		}
	},
	holy: {
		pools: [
			"glow",
			"star",
			"spark"
		],
		play(e, t, n, i, a) {
			let o = r(a, .4, 3);
			Z(e, "holyPillar", t, i, .85);
			for (let r = 0; r < 24; r++) {
				let o = 23 - r;
				X(e, r * .01, () => q(e, "glow", t, n + (.3 + o * .34) * a, i, 1, {
					life: [.9, 1.1],
					size: J(.95, 1.1, a),
					sizeEnd: .25,
					color: o < 3 ? "#fff6e0" : "#ffe6a0",
					hdr: 1.05,
					spawnSize: [
						.04,
						.06,
						.04
					]
				}));
			}
			X(e, .22, () => {
				q(e, "glow", t, n + .5 * a, i, 1, {
					life: [.4, .5],
					size: J(2.6, 2.6, a),
					sizeEnd: 1.4,
					color: "#fff0c0",
					hdr: 1.6,
					spawnSize: [
						0,
						0,
						0
					]
				}), Q(e, "glow", t, n + .15, i, 3.2 * a, .6, 28, {
					size: J(.32, .42, a),
					sizeEnd: .5,
					color: "#ffd77a",
					hdr: 1.9,
					drag: 1
				}), Q(e, "star", t, n + .3, i, 2.4 * a, .8, 14, {
					size: J(.22, .3, Math.sqrt(a)),
					sizeEnd: .6,
					colors: ["#fff6d0", "#ffe08a"],
					hdr: 2.2,
					drag: 1.5,
					spin: [.5, 2]
				});
			});
			for (let r = 0; r < 4; r++) X(e, .1 + r * .18, () => q(e, "spark", t, n + .4, i, 6 * o, {
				life: [.5, .9],
				size: [.05, .07],
				sizeEnd: .6,
				velocity: [
					0,
					7,
					0
				],
				velocityVariance: [
					.15,
					1.5,
					.15
				],
				burstSpeed: [0, .2],
				spawnSize: J(1.1, .3, a).concat(1.1 * a),
				colors: ["#fff6e0", "#ffe08a"],
				hdr: 2
			}));
			q(e, "star", t, n + .3, i, 18 * o, {
				life: [.9, 1.7],
				size: J(.24, .38, Math.sqrt(a)),
				sizeEnd: .8,
				burstSpeed: [.3, 1],
				burstUp: [1.4, 3.2],
				gravity: .2,
				drag: 1.2,
				spawnSize: J(1.4, .4, a).concat(1.4 * a),
				colors: [
					"#fff6d0",
					"#ffe08a",
					"#e6f2ff"
				],
				hdr: 2.2,
				spin: [.5, 2]
			}), X(e, .35, () => q(e, "star", t, n + 5 * a, i, 14 * o, {
				life: [1.2, 2],
				size: J(.18, .3, Math.sqrt(a)),
				sizeEnd: .6,
				velocity: [
					0,
					-1.4,
					0
				],
				burstSpeed: [.1, .5],
				burstUp: [0, 0],
				drag: .4,
				spawnSize: J(2.4, 1.5, a).concat(2.4 * a),
				colors: ["#fff6e0", "#ffe9a8"],
				hdr: 2,
				spin: [.5, 2]
			})), kt(e, t, i, "gold", .12 * Math.min(1.5, a));
		}
	},
	frost: {
		pools: [
			"ice",
			"chips",
			"smoke",
			"star",
			"glow",
			"snow"
		],
		play(e, t, n, i, a) {
			let o = r(a, .4, 3), s = n + .5 * a;
			Z(e, "freeze", t, i, .85), Z(e, "iceSpike", t, i, .55, 1.1), q(e, "smoke", t, n + .25, i, 12 * o, {
				life: [1.4, 2.4],
				size: J(.8, 1.2, a),
				sizeEnd: 2.8,
				burstSpeed: J(1.2, 2.8, a),
				burstUp: [.1, .4],
				drag: 2.4,
				gravity: .02,
				spawnSize: J(.6, .2, a).concat(.6 * a),
				colors: [
					"#bfe0f6",
					"#a8d0ee",
					"#d6ecfa"
				],
				alpha: .45,
				spin: [.1, .5]
			}), q(e, "chips", t, s, i, 14 * o, {
				life: [.6, 1.2],
				size: J(.08, .15, a),
				sizeEnd: .9,
				burstSpeed: J(2, 4.5, a),
				burstUp: J(3, 6, Math.sqrt(a)),
				gravity: -14,
				drag: .3,
				spawnSize: J(.4, .3, a).concat(.4 * a),
				colors: [
					"#e6fbff",
					"#b0d6ff",
					"#8fc4ee"
				],
				hdr: 1.2,
				ballistic: !0,
				spin: [2, 8]
			}), q(e, "ice", t, s, i, 20 * o, {
				life: [.6, 1.2],
				size: J(.22, .36, a),
				sizeEnd: .6,
				burstSpeed: J(1.8, 4.2, Math.sqrt(a)),
				burstUp: [.8, 3],
				gravity: -5,
				drag: 2,
				spawnSize: [
					.3,
					.3,
					.3
				],
				colors: [
					"#e6fbff",
					"#b0d6ff",
					"#8fd0ff"
				],
				hdr: 1.8,
				spin: [2, 6]
			}), Q(e, "glow", t, n + .12, i, 3 * a, .55, 24, {
				size: J(.32, .42, a),
				sizeEnd: .6,
				color: "#8fd0ff",
				hdr: 1.9,
				drag: 1.2
			}), q(e, "glow", t, s, i, 1, {
				life: [.16, .2],
				size: J(2.2, 2.2, a),
				sizeEnd: 1.5,
				color: "#d6f0ff",
				hdr: 1.8,
				spawnSize: [
					0,
					0,
					0
				]
			}), q(e, "star", t, s, i, 12 * o, {
				life: [.7, 1.3],
				size: J(.22, .36, Math.sqrt(a)),
				sizeEnd: .8,
				burstSpeed: [.5, 1.6],
				burstUp: [.3, 1.2],
				drag: 1.6,
				spawnSize: J(1.4, .8, a).concat(1.4 * a),
				colors: ["#e6fbff", "#9fdcff"],
				hdr: 2.4,
				spin: [.5, 2]
			}), X(e, .3, () => q(e, "snow", t, n + 3 * a, i, 16 * o, {
				life: [1.6, 2.6],
				size: J(.08, .13, Math.sqrt(a)),
				velocity: [
					0,
					-.9,
					0
				],
				velocityVariance: [
					.2,
					.25,
					.2
				],
				burstSpeed: [0, .2],
				drag: .2,
				windInfluence: .4,
				spawnSize: J(3, 1, a).concat(3 * a),
				color: "#ffffff",
				alpha: .95,
				spin: [.5, 1]
			}));
		}
	},
	shockwave: {
		pools: [
			"dust",
			"glow",
			"chips"
		],
		play(e, t, n, i, a) {
			let o = r(a, .4, 3);
			Z(e, "quake", t, i, .9), Ot(e, t, i, Math.min(1, .55 * a), .7), Q(e, "dust", t, n + .2, i, 5.4 * a, 1, 30 * o, {
				size: J(.6, .9, a),
				sizeEnd: 3,
				drag: 1.4,
				colors: [
					"#c8b08a",
					"#b39a76",
					"#d6c09a"
				],
				alpha: .75,
				spin: [.5, 2]
			}), Q(e, "glow", t, n + .25, i, 5.8 * a, .45, 28, {
				size: J(.45, .6, a),
				sizeEnd: .7,
				color: "#fff0c8",
				hdr: 1.6
			}), q(e, "glow", t, n + .3, i, 1, {
				life: [.16, .18],
				size: J(2.6, 2.6, a),
				sizeEnd: 1.6,
				color: "#fff3d6",
				hdr: 1.8,
				spawnSize: [
					0,
					0,
					0
				]
			}), At(e, t, n, i, a, 12 * o);
		}
	},
	dust: {
		pools: [
			"dust",
			"smoke",
			"chips"
		],
		play(e, t, n, i, a) {
			let o = r(a, .4, 3);
			Z(e, "quake", t, i, .4, 1.2), Q(e, "dust", t, n + .2, i, 3.2 * a, 1.1, 18 * o, {
				size: J(.6, .9, a),
				sizeEnd: 3,
				drag: 2,
				colors: [
					"#cdb48c",
					"#b89e78",
					"#d8c4a0"
				],
				alpha: .72,
				spin: [.5, 2]
			}), q(e, "dust", t, n + .3, i, 16 * o, {
				life: [1, 1.8],
				size: J(.7, 1.1, a),
				sizeEnd: 3.2,
				burstSpeed: J(.8, 2.4, a),
				burstUp: [.4, 1.4],
				drag: 2.6,
				spawnSize: J(1, .4, a).concat(1 * a),
				colors: [
					"#cdb48c",
					"#b89e78",
					"#a08a6a"
				],
				alpha: .75,
				spin: [.5, 2]
			}), X(e, .14, () => q(e, "smoke", t, n + .6 * a, i, 10 * o, {
				life: [2, 3],
				size: J(.9, 1.3, a),
				sizeEnd: 3.4,
				burstSpeed: J(.4, 1.2, a),
				burstUp: [.5, 1.1],
				drag: 1,
				gravity: .14,
				windInfluence: .3,
				spawnSize: J(1.4, .4, a).concat(1.4 * a),
				colors: [
					"#c2ad8a",
					"#a8936f",
					"#b8a382"
				],
				alpha: .55,
				spin: [.1, .4]
			})), At(e, t, n, i, a * .8, 8 * o, [
				"#6e5c48",
				"#8a7660",
				"#5a4a3a"
			]);
		}
	},
	sparkle: {
		pools: ["star", "glow"],
		play(e, t, n, i, a) {
			let o = r(a, .4, 3);
			Z(e, "chime", t, i, .55, 1.2), q(e, "star", t, n + .9 * a, i, 22 * o, {
				life: [.7, 1.5],
				size: J(.26, .42, Math.sqrt(a)),
				sizeEnd: .8,
				burstSpeed: [.2, .9],
				burstUp: [.3, 1.2],
				gravity: .15,
				drag: 1.6,
				spawnSize: J(1.6, 1.4, a).concat(1.6 * a),
				colors: [
					"#fff6d0",
					"#ffe08a",
					"#bfe0ff",
					"#ffd0f0"
				],
				hdr: 3,
				spin: [.5, 2]
			}), q(e, "glow", t, n + .9 * a, i, 3, {
				life: [.5, .8],
				size: J(1.2, 1.8, a),
				sizeEnd: .6,
				color: "#fff3d0",
				hdr: 1.4,
				spawnSize: J(1, .8, a).concat(1 * a)
			});
		}
	},
	fireworks: {
		pools: [
			"spark",
			"glow",
			"star"
		],
		play(e, t, n, i, a, o) {
			let s = r(Math.round(3 * a), 1, 8), c = o.int(0, Mt.length - 1);
			for (let l = 0; l < s; l++) {
				let s = l * .42 + o.range(0, .12), u = 1 + o.range(0, .35), d = n + (9 + o.range(0, 3.5)) * Math.sqrt(a), f = t + o.range(-1.6, 1.6) * Math.sqrt(a), p = i + o.range(-1.6, 1.6) * Math.sqrt(a), m = o.range(-1.2, 1.2), h = Mt[(c + l) % Mt.length], g = 1 / 30, _ = Math.round(u / g);
				X(e, s, () => Z(e, "whirl", f, p, .3, 1.6));
				for (let t = 0; t <= _; t++) {
					let r = t / _, i = 1 - (1 - r) * (1 - r), a = f + m * r, o = n + .3 + (d - n - .3) * i;
					X(e, s + t * g, () => {
						q(e, "spark", a, o, p, 1, {
							life: [.3, .45],
							size: [.05, .07],
							sizeEnd: .4,
							velocity: [
								0,
								-1.5,
								0
							],
							burstSpeed: [.1, .4],
							burstUp: [0, 0],
							gravity: -3,
							drag: 1,
							spawnSize: [
								.05,
								.05,
								.05
							],
							color: h[0],
							hdr: 2.4
						}), q(e, "glow", a, o, p, 1, {
							life: [.06, .08],
							size: [.45, .5],
							sizeEnd: .8,
							color: h[0],
							hdr: 3,
							spawnSize: [
								0,
								0,
								0
							]
						});
					});
				}
				X(e, s + u + g, () => {
					let t = f + m;
					q(e, "glow", t, d, p, 2, {
						life: [.18, .26],
						size: J(2.8, 3.4, a),
						sizeEnd: 1.5,
						color: h[0],
						hdr: 3.6,
						spawnSize: [
							0,
							0,
							0
						]
					}), q(e, "spark", t, d, p, 34 * r(a, .5, 2), {
						life: [.9, 1.5],
						size: [.06, .09],
						sizeEnd: .5,
						burstSpeed: J(4.4, 5.6, Math.sqrt(a)),
						burstUp: J(-4.6, 4.6, Math.sqrt(a)),
						gravity: -2.2,
						drag: 1.5,
						spawnSize: [
							.2,
							.2,
							.2
						],
						colors: h,
						hdr: 3.4
					}), q(e, "star", t, d, p, 18 * r(a, .5, 2), {
						life: [1, 1.7],
						size: J(.26, .4, Math.sqrt(a)),
						sizeEnd: .6,
						burstSpeed: J(3.4, 4.6, Math.sqrt(a)),
						burstUp: J(-3.5, 3.5, Math.sqrt(a)),
						gravity: -1.6,
						drag: 1.7,
						spawnSize: [
							.2,
							.2,
							.2
						],
						colors: h,
						hdr: 3,
						spin: [.5, 2]
					}), X(e, .55, () => q(e, "star", t, d - 1.2, p, 14 * r(a, .5, 2), {
						life: [.4, .8],
						size: [.14, .24],
						sizeEnd: .5,
						burstSpeed: [.4, 1.2],
						burstUp: [-.8, .4],
						gravity: -1.2,
						drag: 1.2,
						spawnSize: J(4.5, 3.5, Math.sqrt(a)).concat(4.5 * Math.sqrt(a)),
						colors: ["#fff6e0", h[1]],
						hdr: 2.6,
						spin: [1, 3]
					})), Z(e, "firework", t, p, .85, .9 + .08 * l);
				});
			}
		}
	},
	embers: {
		pools: ["ember", "spark"],
		play(e, t, n, i, a) {
			let o = r(a, .4, 3);
			Z(e, "fireRoar", t, i, .3, 1.25);
			for (let r = 0; r < 3; r++) X(e, r * .4, () => {
				q(e, "ember", t, n + .4, i, 12 * o, {
					life: [1.5, 3],
					size: [.06, .11],
					sizeEnd: .4,
					burstSpeed: [.3, 1.1],
					burstUp: [1, 2.6],
					gravity: .6,
					drag: .6,
					windInfluence: .6,
					spawnSize: J(2, .5, a).concat(2 * a),
					colors: [
						"#ff8a2a",
						"#ffb04a",
						"#ff5a1a",
						"#ffd27a"
					],
					hdr: 2.6
				}), q(e, "spark", t, n + .4, i, 4 * o, {
					life: [.6, 1.1],
					size: [.04, .06],
					sizeEnd: .4,
					burstSpeed: [.3, 1],
					burstUp: [1.5, 3],
					gravity: .4,
					drag: .8,
					spawnSize: J(1.6, .4, a).concat(1.6 * a),
					colors: ["#ffd27a", "#ff8a2a"],
					hdr: 2.6
				});
			});
		}
	},
	roar: {
		pools: [
			"dust",
			"glow",
			"chips"
		],
		play(e, t, n, i, a) {
			let o = r(a, .4, 3);
			Z(e, "roar", t, i, 1), X(e, .18, () => Z(e, "quake", t, i, .5, .8)), e.rig?.shake?.(Math.min(1.1, .7 * a), 1.3);
			for (let r = 0; r < 2; r++) X(e, r * .28, () => {
				Q(e, "dust", t, n + .25, i, (6.5 + r * 2) * a, 1.1, 30 * o, {
					size: J(.7, 1.05, a),
					sizeEnd: 3,
					drag: .6,
					colors: [
						"#c8b08a",
						"#a8926f",
						"#d6c09a"
					],
					alpha: .62,
					spin: [.5, 2]
				}), Q(e, "glow", t, n + .6, i, (7 + r * 2) * a, .5, 24, {
					size: J(.6, .8, a),
					sizeEnd: 1.2,
					color: "#f4e3b3",
					hdr: 1.1,
					alpha: .7
				});
			});
			At(e, t, n, i, a * .7, 8 * o, [
				"#6e5c48",
				"#8a7660",
				"#5a4a3a"
			]);
		}
	},
	toll: {
		pools: ["bit"],
		play(e, t, n, r, i) {
			let a = Math.sqrt(i);
			Q(e, "bit", t, n, r, 4.6 * i, .75, 34, {
				size: J(.13, .18, a),
				sizeEnd: .7,
				colors: [
					"#ffd877",
					"#f0c050",
					"#e8b04a"
				],
				hdr: 1.1,
				drag: 1.2
			}), Q(e, "bit", t, n - .12, r, 3.1 * i, .7, 24, {
				size: J(.14, .2, a),
				sizeEnd: .6,
				colors: [
					"#8a5418",
					"#6e3a10",
					"#5c300c"
				],
				hdr: 1,
				drag: 1.4
			}), q(e, "bit", t, n - .3, r, 10, {
				life: [1, 1.6],
				size: [.08, .12],
				sizeEnd: .6,
				burstSpeed: J(.3, 1, a),
				burstUp: [-.2, .3],
				gravity: -.8,
				drag: 1.2,
				spawnSize: J(1.2, .4, i).concat(1.2 * i),
				colors: [
					"#ffd877",
					"#e8b04a",
					"#c88a30"
				],
				hdr: 1.05
			}), X(e, .32, () => Q(e, "bit", t, n, r, 6.6 * i, .95, 30, {
				size: J(.1, .14, a),
				sizeEnd: .5,
				colors: [
					"#f0c050",
					"#c88a30",
					"#8a5418"
				],
				hdr: 1,
				drag: .8
			}));
		}
	},
	thaw: {
		pools: [
			"smoke",
			"star",
			"snow",
			"bit"
		],
		play(e, t, n, i, a) {
			let o = r(a, .4, 3);
			Z(e, "thawSweep", t, i, .8), q(e, "smoke", t, n + .3, i, 14 * o, {
				life: [1.6, 2.6],
				size: J(.7, 1.1, a),
				sizeEnd: 2.6,
				burstSpeed: J(.6, 1.8, a),
				burstUp: [.4, 1.2],
				drag: 1.6,
				gravity: .12,
				spawnSize: J(2.4, .3, a).concat(2.4 * a),
				color: "#eef4f8",
				alpha: .16,
				spin: [.1, .4]
			}), q(e, "star", t, n + .5, i, 12 * o, {
				life: [.5, 1],
				size: [.16, .26],
				sizeEnd: .6,
				burstSpeed: [.2, .8],
				burstUp: [.2, .8],
				drag: 1.4,
				spawnSize: J(3, .6, a).concat(3 * a),
				colors: ["#e6fbff", "#fff6e0"],
				hdr: 1.35
			}), q(e, "snow", t, n + 2.5 * a, i, 10 * o, {
				life: [.8, 1.4],
				size: [.14, .22],
				velocity: [
					0,
					-2.4,
					0
				],
				velocityVariance: [
					.2,
					.5,
					.2
				],
				gravity: -2,
				spawnSize: J(2.5, .8, a).concat(2.5 * a),
				color: "#f4f8fc",
				alpha: .95,
				spin: [.5, 1]
			}), q(e, "bit", t, n + .8, i, 12 * o, {
				life: [.5, 1],
				size: [.1, .17],
				sizeEnd: .8,
				burstSpeed: J(1.4, 3.4, Math.sqrt(a)),
				burstUp: [2, 4.2],
				gravity: -12,
				drag: .3,
				spawnSize: J(.8, 1, a).concat(.8 * a),
				colors: [
					"#cfe8f0",
					"#8cc0d6",
					"#4a88a8",
					"#eef4f8"
				],
				hdr: 1,
				ballistic: !0,
				spin: [2, 8]
			});
		}
	},
	petals: {
		pools: ["petal"],
		play(e, t, n, i, a) {
			let o = r(a, .4, 3);
			Z(e, "windGust", t, i, .35, 1.2), q(e, "petal", t, n + 2.2 * a, i, 34 * o, {
				life: [2.6, 4],
				size: [.24, .32],
				velocity: [
					.7,
					-.35,
					.2
				],
				velocityVariance: [
					.5,
					.25,
					.5
				],
				burstSpeed: [.4, 1.6],
				burstUp: [.5, 1.6],
				gravity: -.4,
				drag: .8,
				windInfluence: 1,
				spin: [1, 3.5],
				spawnSize: J(3.2, 1.4, a).concat(3.2 * a),
				colors: [
					"#fff6f2",
					"#fff6f2",
					"#fffaf0",
					"#fbe2ea",
					"#fff6f2",
					"#fbe2ea",
					"#fffaf0",
					"#f2bcd6",
					"#f2bcd6",
					"#d98ab4"
				],
				alpha: 1
			});
		}
	},
	leaves: {
		pools: ["leaf"],
		play(e, t, n, i, a) {
			let o = r(a, .4, 3);
			Z(e, "windGust", t, i, .4), q(e, "leaf", t, n + 2.4 * a, i, 28 * o, {
				life: [2.4, 3.6],
				size: [.32, .42],
				velocity: [
					.9,
					-.5,
					.3
				],
				velocityVariance: [
					.6,
					.3,
					.6
				],
				burstSpeed: [.4, 1.6],
				burstUp: [.4, 1.4],
				gravity: -.5,
				drag: .8,
				windInfluence: 1,
				spin: [1, 4],
				spawnSize: J(3.2, 1.4, a).concat(3.2 * a),
				colors: [
					"#f6c860",
					"#ec9234",
					"#ec9234",
					"#c8502a",
					"#8a2a22",
					"#f6c860"
				],
				alpha: 1
			});
		}
	},
	memory: {
		pools: ["flame", "star"],
		play(e, t, n, i, a) {
			let o = r(a, .4, 3);
			Z(e, "memoryChime", t, i, .6), q(e, "flame", t, n + 1 * a, i, 10 * o, {
				life: [2.4, 3.6],
				size: J(1.2, 1.8, a),
				sizeEnd: 2.4,
				burstSpeed: [.05, .3],
				burstUp: [.1, .35],
				gravity: .02,
				drag: .6,
				spawnSize: J(3.6, 1.6, a).concat(3.6 * a),
				color: "#f6f2ec",
				alpha: .22,
				spin: [.05, .2]
			}), q(e, "star", t, n + 1.2 * a, i, 22 * o, {
				life: [1.8, 3],
				size: [.1, .18],
				sizeEnd: .6,
				burstSpeed: [.05, .25],
				burstUp: [.15, .45],
				drag: .6,
				spawnSize: J(4, 2, a).concat(4 * a),
				colors: [
					"#ffffff",
					"#f6f0e4",
					"#e8f0ff"
				],
				hdr: 1.15
			});
		}
	},
	crows: {
		pools: ["leaf", "bit"],
		play(e, t, n, i, a) {
			let o = r(a, .4, 3);
			Z(e, "crowFlock", t, i, .8);
			for (let r = 0; r < 2; r++) X(e, r * .18, () => q(e, "leaf", t, n + .6, i, 9 * o, {
				life: [2.4, 3.4],
				size: [.36, .5],
				velocity: [
					.3,
					1.4,
					-2.2
				],
				velocityVariance: [
					1,
					.5,
					.8
				],
				burstSpeed: [1, 2.6],
				burstUp: [1.6, 3.2],
				gravity: .6,
				drag: .35,
				windInfluence: .2,
				spin: [5, 9],
				spawnSize: J(1.4, .4, a).concat(1.4 * a),
				colors: [
					"#1a1620",
					"#24202c",
					"#2e2834"
				],
				alpha: 1
			}));
			X(e, .35, () => q(e, "bit", t, n + 2.2, i, 6 * o, {
				life: [1.6, 2.4],
				size: [.07, .1],
				sizeEnd: .8,
				burstSpeed: [.3, 1],
				burstUp: [0, .4],
				gravity: -.7,
				drag: 1.4,
				windInfluence: .6,
				spawnSize: J(2, 1, a).concat(2 * a),
				colors: ["#1a1620", "#2e2834"],
				hdr: 1,
				spin: [1, 3]
			}));
		}
	}
}, Ft = Object.freeze(Object.fromEntries(k.map((e) => {
	let t = s(Pt, e);
	if (!t) throw Error(`Effects: no recipe for the effect "${e}"`);
	let n = Object.freeze([...t.pools]);
	return [e, Object.freeze({
		play: (n, r, o, s, c) => {
			let l = Ct(n), u = new a(i(`${e}:${Math.round(r * 16)}:${Math.round(s * 16)}:${l.plays++}`));
			t.play(n, r, o, s, c, u);
		},
		presets: Object.freeze([...new Set(n.map((e) => vt[e].preset))]),
		pools: n
	})];
})));
function It(e, t, n, r, i, a = 1) {
	let o = s(Ft, t);
	return !o || !Number.isFinite(n) || !Number.isFinite(r) || !Number.isFinite(i) ? !1 : (o.play(e, n, r, i, Math.min(5, Math.max(.1, Number.isFinite(a) ? a : 1))), !0);
}
function Lt(e) {
	let t = /* @__PURE__ */ new Set();
	for (let n of e) {
		let e = s(Ft, n);
		for (let n of e?.pools ?? []) t.add(n);
	}
	return [...t];
}
function Rt(e, t) {
	let n = new Set(Lt(t)), r = yt.filter((e) => n.has(e));
	if (!e.particles) return r;
	for (let t of r) q(e, t, St.x, St.y, St.z, 1, {
		life: [.05, .05],
		size: [.1, .1]
	});
	return r;
}
//#endregion
//#region src/game/story/strings.js
var zt = {
	en: {
		"quest.start": "New quest: {title}",
		"quest.stage": "Quest updated: {title}",
		"quest.done": "Quest complete: {title}",
		"quest.fail": "Quest failed: {title}",
		"gold.received": "Received {n} gold",
		"gold.given": "Gave {n} gold",
		"item.received": "Received: {item}",
		"item.receivedCount": "Received: {item} ×{n}",
		"item.given": "Handed over: {item}",
		"item.givenCount": "Handed over: {item} ×{n}",
		"ending.default": "The End"
	},
	ja: {
		"quest.start": "新しいクエスト：{title}",
		"quest.stage": "クエスト更新：{title}",
		"quest.done": "クエスト達成：{title}",
		"quest.fail": "クエスト失敗：{title}",
		"gold.received": "{n}ゴールドを受け取った",
		"gold.given": "{n}ゴールドを渡した",
		"item.received": "{item}を受け取った",
		"item.receivedCount": "{item}×{n}を受け取った",
		"item.given": "{item}を渡した",
		"item.givenCount": "{item}×{n}を渡した",
		"ending.default": "おわり"
	},
	zh: {
		"quest.start": "新任务：{title}",
		"quest.stage": "任务更新：{title}",
		"quest.done": "任务完成：{title}",
		"quest.fail": "任务失败：{title}",
		"gold.received": "获得 {n} 金币",
		"gold.given": "交出 {n} 金币",
		"item.received": "获得：{item}",
		"item.receivedCount": "获得：{item} ×{n}",
		"item.given": "交出：{item}",
		"item.givenCount": "交出：{item} ×{n}",
		"ending.default": "完"
	}
}, Bt = null, Vt = () => Bt ?? import("./Frost-C9e4W9MN.js").then((e) => Bt = e), Ht = () => import("./EvermereAudio-jpxCUeQ6.js"), Ut = 2e4, Wt = 500, Gt = 8, Kt = .6, qt = 3, Jt = 60, Yt = /* @__PURE__ */ new Set([
	"wait",
	"walk",
	"camera",
	"fade",
	"travel",
	"rest",
	"ending",
	"builtin",
	"shop",
	"cutscene",
	"teleport",
	"emote",
	"banner",
	"shake",
	"shot",
	"title"
]), Xt = .6, Zt = .6, Qt = 4.5, $t = "var(--g-kf0)", en = Object.freeze([
	["yaw", "yaw"],
	["pitch", "pitch"],
	["dist", "distance"],
	["fov", "fov"],
	["lift", "lift"]
]), tn = Object.freeze({
	cheer: [{ anim: "cheer" }, {
		cols: ["cast", "idle0"],
		fps: 3,
		loop: !0
	}],
	dance: [{ anim: "dance" }, {
		cols: [
			"spin",
			"cast",
			"spin",
			"idle0"
		],
		fps: 3,
		loop: !0
	}],
	cower: [{ cols: ["cower"] }, { cols: ["tuck"] }],
	kneel: [{ cols: ["kneel"] }, { cols: ["tuck"] }],
	bow: [{ cols: ["bow"] }, { cols: ["tuck"] }],
	victory: [{
		cols: ["wind", "cast"],
		fps: 6,
		loop: !1
	}, { anim: "cheer" }],
	ready: [{ cols: ["wind"] }],
	cast: [{ cols: ["cast"] }]
}), nn = /^\s*(?:\*\s+)?effect\s+([a-z]+)/, rn = /^\s*(?:\*\s+)?toll\s/, an = 1, on = .8, sn = 1.5, cn = {
	up: [0, -1],
	down: [0, 1],
	left: [-1, 0],
	right: [1, 0]
}, ln = 8, un = 2, dn = 2, fn = 8, pn = 8, mn = 12, hn = 4, gn = 6, $ = (e, t) => e ? ue(t) : t(), _n = class {
	constructor({ game: e, story: t = null, state: n, levelId: r = "" }) {
		oe("story", zt), this.game = e, this.story = t, this.state = n, this.levelId = r, this._parsed = /* @__PURE__ */ new Map(), this.events = [], this.globalEvents = (t?.events ?? []).map((e) => ({
			def: e,
			last: null
		})), this.queue = [], this.run = null, this.walks = /* @__PURE__ */ new Map(), this.timers = [], this._untils = [], this.bgRuns = [], this.bgQueue = [], this._mainActors = /* @__PURE__ */ new Set(), this._resumeTalk = "", this._bgWaiters = [], this._cam = null, this._cine = null, this._cineKit = null, this._cineLoad = null, this._slow = null, this._poses = /* @__PURE__ */ new Map(), this._poseWarned = /* @__PURE__ */ new Set(), this._trace = [], this._src = /* @__PURE__ */ new WeakMap(), this._actorSheets = /* @__PURE__ */ new Map(), this.cardShownAt = -Infinity, this._lastSfx = {
			name: "",
			at: -Infinity
		}, this.errors = 0, this._auto = null, this._version = -1, this._hourInt = -1, this._tick = -1, this._weather = "", this._gold = 0, this._prevTime = null, this._skipHold = 0, this._nav = null, this._navLevel = null, this._navSteps = null, this._navIdle = 0, this._pathBuf = /* @__PURE__ */ new Float32Array(512), this._offCombat = null, this._inChapter = !1, this._bursts = /* @__PURE__ */ new Map(), this._now = 0, this.focusCut = !1, this._loaded = !e.warmedUp, this._musicLater = [], e.warmedUp?.then(() => {
			this._loaded = !0, this._loading() || this._primeLater();
		}), this.reader = gt(() => this.state, {
			story: t,
			level: () => this.levelId,
			visited: () => this.game.campaign?.state.visited ?? [],
			game: (e) => this._gameValue(e),
			visitKeys: (e) => {
				let t = this._npc(e);
				return t ? [this.visitKey(t)] : [];
			}
		}), this.holds = (e) => h(_(e), this.reader), this.test = (e) => h(ee(e), this.reader), this.present = (e) => se(e, this.holds) && !(e?.type === "npc" && this.partyHolds(e));
	}
	partyHolds(e) {
		let t = this.game.party;
		if (t) return t.holds(e);
		let n = this.state.party;
		if (!n?.length || !e) return !1;
		let r = typeof e.actor == "string" ? e.actor.trim() : typeof e.storyObj?.actor == "string" ? e.storyObj.actor.trim() : "";
		return n.some((t) => t.id === e.id || !!r && t.actor === r);
	}
	_gameValue(e) {
		let t = this.game;
		switch (e) {
			case "hour": return this._clock();
			case "gold": return this.gold;
			case "chapter":
				if (this._inChapter || !t.campaign) return t.campaign?.state.chapter ?? "";
				this._inChapter = !0;
				try {
					return t.campaign.chapterId();
				} finally {
					this._inChapter = !1;
				}
			case "weather": return t.weather?.weather ?? "clear";
			case "visits": return this.run?.self ? this.run.visits : 0;
			default: return;
		}
	}
	_clock() {
		let e = this.game;
		return e.campaign ? e.campaign.hour() : e.lighting?.timeOfDay ?? 0;
	}
	get gold() {
		let e = this.game.combat?.pc;
		return e ? e.gold : this.state.gold;
	}
	visitKey(e) {
		let t = "record" in e ? e.record : null, n = typeof e.storyObj?.actor == "string" ? e.storyObj.actor.trim() : t?.actor ?? "";
		return n ? `actor:${n}` : this.game.campaign ? `${t?.level || this.levelId}/${e.id}` : e.id;
	}
	changed() {
		this.state.version++;
	}
	setState(e) {
		this.state = e, this._version = -1;
		for (let e of this.globalEvents) e.last = null;
		this.queue.length = 0;
		for (let e of [...this.bgRuns]) this._stopBg(e);
		this.bgQueue.length = 0, this._resumeTalk = "", this._bursts.clear(), this.game.syncParty?.()?.catch?.((e) => console.warn("[Luminati] story: the party could not follow the new story state:", e));
	}
	rested(e) {
		e >= 8 && this.state.day++, this.state.version++, this._prevTime = this._clock();
	}
	resyncClock() {
		this._prevTime = this._clock(), this.applyPresence({ instant: !0 }), this._baseline();
	}
	_baseline() {
		for (let e of this.events) e.last = e.obj.on === "change" && this._eventHolds(e);
		for (let e of this.globalEvents) e.last = e.def.on === "change" && this.test(e.def.if);
		let e = this._clock();
		this._version = this.state.version, this._hourInt = Math.floor(e), this._tick = Math.floor(e * 10), this._weather = this.game.weather?.weather ?? "clear", this._gold = this.gold;
	}
	setLevelId(e) {
		this.levelId = e;
	}
	holdsIn(e) {
		return (t) => {
			let n = this.levelId;
			this.levelId = e;
			try {
				return this.holds(t);
			} finally {
				this.levelId = n;
			}
		};
	}
	resumePending() {
		let e = this.state.pending;
		this.state.pending = [];
		for (let t of e) if (t.startsWith("event:")) {
			let e = this.events.find((e) => `event:${e.key}` === t);
			e && this._trigger(e, { resume: !0 });
		} else if (t.startsWith("story:")) {
			let e = this.globalEvents.find((e) => `story:${e.def.id}` === t);
			e && this._triggerGlobal(e, { resume: !0 });
		} else if (t.startsWith("talk:")) {
			let e = t.lastIndexOf("/");
			e > 5 && t.slice(5, e) === this.levelId && (this._resumeTalk = t.slice(e + 1));
		}
	}
	pendingKeys() {
		let e = [];
		this.run && (this.run.kind === "event" || this.run.kind === "story" || this.run.kind === "talk") && e.push(this.run.key);
		for (let t of this.queue) (t.kind === "event" || t.kind === "story") && !e.includes(t.key) && e.push(t.key);
		for (let t of this.bgRuns) t.onceKey && !t.stopped && !e.includes(t.key) && e.push(t.key);
		for (let t of this.bgQueue) t.onceKey && !e.includes(t.key) && e.push(t.key);
		return e;
	}
	attachLevel(t) {
		let n = this.game;
		this.levelId = t, this.events = [];
		let r = n.world;
		for (let i of n.level.objects) {
			if (i.type !== "event") continue;
			let n = i, a = {
				obj: n,
				nodes: this._parse(`level:${t}/${n.id}`, n.run, `${t} › event ${n.id}`).nodes,
				key: `${t}.${n.id}`,
				inside: !1,
				last: !1
			};
			if (n.on === "use" && n.maxX > n.minX && n.maxZ > n.minZ) {
				let t = (n.minX + n.maxX) / 2, i = (n.minZ + n.maxZ) / 2, o = r.groundAt(t, i), s = typeof n.label == "string" && n.label.trim() ? n.label.trim() : "Look";
				a.prompt = {
					id: `event:${n.id}`,
					position: new e(t, o, i),
					radius: Math.max(.9, Math.hypot(n.maxX - n.minX, n.maxZ - n.minZ) / 2 + .3),
					label: s,
					kind: "event",
					prompt: new e(t, o + 1.6, i),
					lookSpan: null,
					area: {
						minX: n.minX,
						maxX: n.maxX,
						minZ: n.minZ,
						maxZ: n.maxZ
					},
					text: {
						speaker: "",
						lines: []
					},
					object: n,
					storyEvent: !0,
					disabled: !0,
					onInteract: () => n.background === !0 ? Promise.resolve(void this._enqueueBg({
						kind: "event",
						key: `event:${a.key}`,
						nodes: a.nodes,
						onceKey: n.once ? a.key : ""
					})) : this._runInline({
						kind: "event",
						key: `event:${a.key}`,
						nodes: a.nodes,
						onceKey: n.once ? a.key : ""
					})
				}, r.interactables.push(a.prompt);
			}
			this.events.push(a);
		}
		let i = this.state.levelMemory(t).homes, a = n.level.width, o = n.level.depth;
		for (let e of n.npcs) {
			let n = e.storyObj, r = d(n?.talk) ? n.talk : null, c = typeof n?.actor == "string" ? n.actor.trim() : "", l = !r && c ? s(this.story?.actors ?? {}, c)?.talk : "";
			e.storyTalk = r ? this._parse(`talk:${t}/${e.id}`, r, `${t} › npc ${e.id} talk`).nodes : l ? this._script(l)?.nodes ?? null : null;
			let u = Object.hasOwn(i, e.id) ? i[e.id] : null;
			u && e.setHome(Math.min(a, Math.max(0, u[0])), Math.min(o, Math.max(0, u[1])), { move: !0 });
		}
		let c = n.combat;
		c && this.events.some((e) => e.obj.on === "cleared") && (this._offCombat = c.events.on("kill", (e) => this._onKill(e))), this.applyPresence({ instant: !0 });
		let l = n.player.position;
		for (let e of this.events) e.inside = this._inside(e.obj, l.x, l.z), e.last = e.obj.on === "change" && this._eventHolds(e);
		for (let e of this.globalEvents) e.last === null && (e.last = e.def.on === "change" && this.test(e.def.if));
		let u = this._clock();
		this._version = this.state.version, this._hourInt = Math.floor(u), this._tick = Math.floor(u * 10), this._weather = n.weather?.weather ?? "clear", this._gold = this.gold, this._prevTime ??= u, this._dropNav(), this._prepareNav();
		let f = this._effectNames();
		f.size && Rt(n, f), this._loadCineKit(), n.thaw && Vt();
	}
	_effectNames() {
		let e = /* @__PURE__ */ new Set(), t = (t) => {
			t && R(t, (t) => {
				t.t === "cmd" && t.op === "effect" && typeof t.args?.name == "string" ? e.add(t.args.name) : t.t === "cmd" && t.op === "toll" && e.add("toll");
			});
		};
		for (let e of this.events) t(e.nodes);
		for (let e of this.game.npcs ?? []) t(e.storyTalk);
		let n = this.story?.scripts ?? {};
		for (let t of Object.keys(n)) {
			let r = s(n, t);
			if (r) for (let t of p(r.lines)) {
				let n = nn.exec(t);
				n ? e.add(n[1]) : rn.test(t) && e.add("toll");
			}
		}
		return e;
	}
	_loadCineKit() {
		return this._cineKit ? Promise.resolve(this._cineKit) : typeof document > "u" || !this.game.ui?.root ? Promise.resolve(null) : (this._cineLoad ??= import("./storyUI-BfHSLYf3.js").then(({ cineUIClasses: e }) => (this._cineKit = e(), this._cineKit), (e) => (console.warn("[Luminati] story: the title card and the flash could not be made:", e), this._cineLoad = null, null)), this._cineLoad);
	}
	_cineNow() {
		if (this._cine) return this._cine;
		let e = this.game.ui?.root;
		if (!this._cineKit || !e) return this._loadCineKit(), null;
		let { TitleCard: t, ScreenFlash: n } = this._cineKit;
		return this._cine = {
			title: new t(e),
			flash: new n(e)
		}, this._cine;
	}
	async _cineUI() {
		return this._cine ? this._cine : (await this._loadCineKit(), this._cineNow());
	}
	detachLevel() {
		this._offCombat?.(), this._offCombat = null;
		for (let [e, t] of this.walks) this._endWalk(e, t, !0);
		this.walks.clear(), this._endUntils(), this._cam && this._cameraRestore(), this.game.rig?.framed && this.game.rig.endFraming(), this._endSlowmo(), this._endPoses(null), Tt(this.game), this._cine?.flash.clear(), this._cine?.title.active && this._cine.title.skip(), this.queue = this.queue.filter((e) => e.kind === "story" || e.kind === "test");
		for (let e of [...this.bgRuns]) this._stopBg(e);
		this.bgQueue = this.bgQueue.filter((e) => e.kind === "story"), this._mainActors.clear(), this._resumeTalk = "", this.events = [], this._dropNav(), this.game.ui.emotes?.clear?.();
	}
	applyPresence({ instant: e = !1 } = {}) {
		let t = this.game, n = !1, r = !e && t.thaw ? t.thaw.gate(t, this.present) : this.present;
		for (let e of t.npcs) {
			let t = (!e.storyObj || r(e.storyObj)) && !this.partyHolds(e);
			t !== e.present && (e.setPresent(t), n = !0);
		}
		t.levelStatesChanged?.();
		let { rect: i, mapChanged: a } = t.world.applyStory({ instant: e });
		if (t.critters?.applyStory(this.present), t.combat?.applyPresence(r, { instant: e }), a && !e && t.repaintLevelMap(), i) {
			let e = .5, n = (t, n) => t > i.minX - e && t < i.maxX + e && n > i.minZ - e && n < i.maxZ + e, r = t.player.position;
			if (n(r.x, r.z)) {
				let e = t._nearestStandable(r.x, r.z);
				e && (e.x !== r.x || e.z !== r.z) && (t.player.teleport(e.x, e.z), t.combat?.onTeleport());
			}
			for (let e of t.npcs) e.present && n(e.position.x, e.position.z) && !t.tileMap.isWalkable(e.position.x, e.position.z) && e.teleportHome();
			t.critters?.standClear(n), this._nav && this._navLevel === t.tileMap && (this._navSteps ? this._navSteps = this._nav.buildSteps(null, hn) : this._nav.buildRect(i.minX, i.maxX, i.minZ, i.maxZ)), t.combat?.rebuildNav(i);
		}
		for (let e of this.events) e.prompt && (e.prompt.disabled = !this.present(e.obj) || e.obj.once && this.state.isDone(e.key) || !this._eventGuard(e));
		n && t.refreshActors();
	}
	_eventGuard(e) {
		return e.obj.on === "change" || !e.obj.if || this.test(e.obj.if);
	}
	_eventHolds(e) {
		return !!e.obj.if && this.test(e.obj.if);
	}
	_inside(e, t, n) {
		return t >= e.minX && t < e.maxX && n >= e.minZ && n < e.maxZ;
	}
	onArrive() {
		for (let e of this.events) e.obj.on === "arrive" && this._trigger(e);
		for (let e of this.globalEvents) {
			let t = e.def;
			t.on !== "arrive" || t.level && t.level !== this.levelId || this._triggerGlobal(e);
		}
	}
	_trigger(e, { resume: t = !1 } = {}) {
		let n = e.obj;
		if (!this.present(n) || !t && !this._eventGuard(e) || n.once && this.state.isDone(e.key)) return;
		let r = {
			kind: "event",
			key: `event:${e.key}`,
			nodes: e.nodes,
			onceKey: n.once ? e.key : ""
		};
		n.background === !0 ? this._enqueueBg(r) : this.enqueue(r);
	}
	_triggerGlobal(e, { resume: t = !1 } = {}) {
		let n = e.def, r = `story.${n.id}`;
		if (n.once && this.state.isDone(r) || !t && n.on === "arrive" && n.if && !this.test(n.if)) return;
		let i = this._script(n.run);
		if (!i) return;
		let a = {
			kind: "story",
			key: `story:${n.id}`,
			nodes: i.nodes,
			onceKey: n.once ? r : ""
		};
		n.background === !0 ? this._enqueueBg(a) : this.enqueue(a);
	}
	_onKill(e) {
		let t = e?.groupId;
		if (t && !(this.game.combat?.enemies ?? []).some((e) => e.groupId === t && !e.isAdd && e.alive)) for (let e of this.events) {
			let n = typeof e.obj.group == "string" ? e.obj.group.trim() : "";
			e.obj.on === "cleared" && n === t && this._trigger(e);
		}
	}
	update(e) {
		let t = this.game;
		if (t.mode !== "play") return;
		this._musicLater.length && this._loaded && this._primeLater(), this._now += e;
		let n = t.engine?.time?.timeScale, r = n > 0 && n !== 1 ? e / n : e, i = this._bgPaused();
		this.walks.size && this._updateWalks(e, i), this.timers.length && this._updateTimers(r, i), this._untils.length && this._updateUntils(), this._slow && this._stepSlow(r), this._cam && this._updateCamera(r), this._poses.size && this._updatePoses(e), wt(t, e);
		let a = this._cine?.title;
		a?.active && a.update(r, t.engine?.input ?? null);
		let o = this.run;
		o?.cutscene && !o.fast && this._updateSkip(r);
		let s = this._clock();
		if (this._prevTime !== null && s !== this._prevTime) {
			let e = ((s - this._prevTime) % 24 + 24) % 24;
			e > 0 && e < 12 && this._passTime(this._prevTime, e);
		}
		this._prevTime = s;
		let c = Math.floor(s * 10), l = t.weather?.weather ?? "clear", u = this.gold;
		if (this.state.version !== this._version || c !== this._tick || l !== this._weather || u !== this._gold) {
			let e = Math.floor(s), t = this.state.version !== this._version || e !== this._hourInt;
			this._version = this.state.version, this._hourInt = e, this._tick = c, this._weather = l, this._gold = u, this._storyChanged(t);
		}
		let d = t.player.position;
		for (let e of this.events) {
			let n = e.obj.on;
			if (n !== "enter" && n !== "leave") continue;
			let r = this._inside(e.obj, d.x, d.z);
			r !== e.inside && (e.inside = r, !o && !t.busy && n === "enter" === r && this._trigger(e));
		}
		if (!this.run && this.queue.length && this._idle()) this._next();
		else if (!this.run && this._resumeTalk && this._idle()) {
			let e = this._resumeTalk;
			this._resumeTalk = "", t.talkTo(e);
		}
		if (!this._bgPaused()) {
			if (this._bgWaiters.length) for (let e of this._bgWaiters.splice(0)) e();
			for (; this.bgQueue.length && this.bgRuns.length < fn;) this._execBg(this.bgQueue.shift());
		}
	}
	_bgFree() {
		return new Promise((e) => {
			this._bgWaiters.push(e);
		});
	}
	_bgPaused() {
		let e = this.game;
		return !!this.run || e.mode !== "play" || e.busy || e.ui.dialog.isOpen || e.mapOpen || e.photoMode || e.journalOpen || !!e.partyMenuOpen || !!e.campaign?.traveling;
	}
	_passTime(e, t) {
		e + t >= 24 && (this.state.day++, this.state.version++);
		for (let n of this.events) {
			let r = n.obj.at;
			if (n.obj.on !== "time" || typeof r != "number" || !Number.isFinite(r)) continue;
			let i = ((r % 24 - e) % 24 + 24) % 24;
			i > 0 && i <= t && this._trigger(n);
		}
	}
	_advanceClock(e) {
		let t = this.game, n = this._clock();
		t.campaign ? t.campaign.setStoryTime(e) : t.setTime(e);
		let r = this._clock(), i = ((r - n) % 24 + 24) % 24;
		i > 0 && this._passTime(n, i), this._prevTime = r;
	}
	_storyChanged(e = !0) {
		this.applyPresence();
		for (let e of this.events) {
			if (e.obj.on !== "change") continue;
			let t = this._eventHolds(e);
			t && !e.last && this._trigger(e), e.last = t;
		}
		for (let e of this.globalEvents) {
			if (e.def.on !== "change") continue;
			let t = !!e.def.if && this.test(e.def.if);
			t && !e.last && this._triggerGlobal(e), e.last = t;
		}
		this.game.campaign?.onStoryChange({ save: e }), this.game.ui.journal?.isOpen && this.game.ui.journal.setData(this.journalData());
	}
	whenIdle(e = 1e4) {
		let t = performance.now();
		return new Promise((n) => {
			let r = () => {
				!this.run && !this.queue.length ? n(!0) : performance.now() - t > e ? n(!1) : setTimeout(r, 50);
			};
			r();
		});
	}
	_idle() {
		let e = this.game;
		return e.mode === "play" && !e.busy && !e.ui.dialog.isOpen && !e.mapOpen && !e.photoMode && !e.journalOpen && !e.partyMenuOpen && !e.combat?.locksPlayer && !e.campaign?.traveling;
	}
	enqueue(e) {
		this.queue.some((t) => t.key === e.key) || this.run?.key === e.key || this.queue.length >= 64 || !this._admit(e) || this.queue.push(e);
	}
	_admit(e) {
		if (e.kind !== "event" && e.kind !== "story") return !0;
		let t = this._bursts.get(e.key);
		if (t && this._now - t.t < un) {
			if (++t.n > ln) return t.n === 9 && console.warn(`[Luminati] story: ${e.key} ran ${ln} times in ${un} s — held back (events that trigger each other?)`), !1;
		} else this._bursts.set(e.key, {
			t: this._now,
			n: 1
		});
		return this._bursts.size > 256 && this._bursts.clear(), !0;
	}
	_enqueueBg(e) {
		this.bgQueue.some((t) => t.key === e.key) || this.bgRuns.some((t) => t.key === e.key) || this.bgQueue.length >= 64 || !this._admit(e) || this.bgQueue.push(e);
	}
	async _execBg(e) {
		if (e.onceKey && this.state.isDone(e.onceKey)) return;
		let t = {
			kind: e.kind,
			key: e.key,
			nodes: e.nodes,
			self: null,
			visits: 0,
			visitKey: "",
			onceKey: e.onceKey ?? "",
			steps: 0,
			fast: !1,
			cutscene: !1,
			calls: 0,
			background: !0,
			stopped: !1,
			actors: /* @__PURE__ */ new Set()
		};
		this.bgRuns.push(t);
		try {
			await this._block(t.nodes, t);
		} catch (e) {
			t.stopped || this._error(t, e?.message ?? String(e));
		} finally {
			for (let [, e] of this.walks) e.run === t && (e.orphan = !0);
			this.timers = this.timers.filter((e) => e.run !== t || (e.resolve(), !1));
			let e = this.bgRuns.indexOf(t);
			e >= 0 && this.bgRuns.splice(e, 1), this._endPoses(t);
			for (let e of t.actors) e.directed && !this.walks.get(e)?.orphan && !this._heldElsewhere(e, null) && e.release();
			t.onceKey && !t.stopped && this.state.markDone(t.onceKey);
		}
	}
	_heldElsewhere(e, t) {
		if (this._mainActors.has(e) || this.bgRuns.some((n) => n !== t && n.actors.has(e))) return !0;
		let n = this.walks.get(e);
		return !!n && n.run !== t && !!n.run?.background;
	}
	_stopBg(e) {
		if (!e.stopped) {
			e.stopped = !0;
			for (let e of this._bgWaiters.splice(0)) e();
			for (let [t, n] of this.walks) n.run === e && this._endWalk(t, n, !1);
			this.timers = this.timers.filter((t) => t.run !== e || (t.resolve(), !1)), this._endPoses(e);
		}
	}
	_takeActor(e, t) {
		if (t.background) {
			if (this._mainActors.has(e)) throw this._stopBg(t), Error("the main lane directs this villager");
			t.actors.add(e);
			return;
		}
		if (e === this.game.player) return;
		this._mainActors.add(e);
		for (let t of [...this.bgRuns]) t.actors.has(e) && this._stopBg(t);
		let n = this.walks.get(e);
		n?.run?.background && this._endWalk(e, n, !1), this._poses.get(e)?.run.background && this._endPose(e);
	}
	_next() {
		let e = !!this.openingRun(), t = this.queue.shift();
		t && (t.onceKey && this.state.isDone(t.onceKey) || this._exec(t, {
			ownBusy: !0,
			opening: e
		}));
	}
	_runInline(e) {
		return e.onceKey && this.state.isDone(e.onceKey) ? Promise.resolve() : this._exec(e, { ownBusy: !1 });
	}
	async talk(e) {
		let t = this.visitKey(e), n = this.state.visitsOf(t), r = ("record" in e ? this.talkFor(e) : null) ?? e.storyTalk ?? [];
		await this._runInline({
			kind: "talk",
			key: `talk:${this.levelId}/${e.id}`,
			nodes: r,
			self: e,
			visits: n,
			visitKey: t
		});
	}
	talkFor(e) {
		let t = e?.id;
		if (typeof t != "string") return null;
		let n = this.game.npcById?.get(t);
		if (n?.storyTalk) return n.storyTalk;
		if (!n) {
			let e = this.game.level?.objects?.find((e) => e.type === "npc" && e.id === t);
			if (e && d(e.talk)) return this._parse(`talk:${this.levelId}/${t}`, e.talk, `${this.levelId} › npc ${t} talk`).nodes;
		}
		let r = e.record?.actor || e.storyObj?.actor, i = typeof r == "string" ? r.trim() : "", a = i ? s(this.story?.actors ?? {}, i)?.talk : "";
		return a ? this._script(a)?.nodes ?? null : null;
	}
	async _exec(e, { ownBusy: t, opening: n = !1 }) {
		let r = this.game, i = {
			kind: e.kind,
			key: e.key,
			nodes: e.nodes,
			self: e.self ?? null,
			visits: e.visits ?? 0,
			visitKey: e.visitKey ?? "",
			onceKey: e.onceKey ?? "",
			steps: 0,
			fast: !1,
			cutscene: !1,
			calls: 0,
			onBlack: n
		};
		this.run = i;
		let a = this.musicOf(i.nodes);
		a.length && this._primeMusic(a, n ? this._blackMusic(i.nodes) : []), t && (r.busy = !0), r.ui.prompt.hide(), r.campaign?.holdSaves();
		try {
			await this._block(i.nodes, i);
		} catch (e) {
			this._error(i, e?.message ?? String(e));
		} finally {
			try {
				this._finish(i);
			} catch (e) {
				console.error("[Luminati] story: ending the run failed:", e);
			}
			this.run === i && (this.run = null), t && (r.busy = !1), r._talkCooldown = Math.max(r._talkCooldown ?? 0, .4), r.campaign?.releaseSaves(), r.campaign?.save(), this._version = this.state.version, this._storyChanged(!1);
		}
	}
	_finish(e) {
		let t = this.game;
		(t.ui.dialog.isHeld || t.ui.dialog.isOpen) && t.ui.dialog.close();
		for (let [e, t] of this.walks) t.run?.background || this._endWalk(e, t, !0);
		this.timers = this.timers.filter((e) => e.run?.background ? !0 : (e.resolve(), !1)), this._cam ? this._cameraRestore({ ease: e.fast ? 0 : Xt }) : t.rig?.framed && e.fast && t.rig.endFraming(), this._endSlowmo(), this._endPoses(e), this._cine?.title.active && this._cine.title.skip();
		let n = this._cine?.flash.held ? this._cine.flash : null;
		n && e.fast ? n.clear() : n?.flash(n.color, Zt, 1), e.cutscene && (t.ui.setCutscene?.(!1), t.ui.setSkipHint?.(!1, 0)), t.ui.fader.opacity > 0 && !t.campaign?.traveling && !this.state.ending && !this.openingRun() && t.ui.fader.fadeIn(.4);
		for (let e of t.npcs) e.directed && !this.bgRuns.some((t) => t.actors.has(e)) && e.release();
		for (let e of t.party?.members ?? []) e.directed && !this.bgRuns.some((t) => t.actors.has(e)) && e.release();
		this._mainActors.clear(), e.visitKey && this.state.visit(e.visitKey), e.onceKey && this.state.markDone(e.onceKey), this.state.version++, this.run === e && (this.run = null);
	}
	_error(e, t) {
		this.errors++, console.warn(`[Luminati] story: ${e.key}: ${t}`);
	}
	_traceLine(e, t) {
		let n = t.t === "cmd" ? t.op : t.t;
		this._trace.push(`${e.key}:${t.line} ${n}`), this._trace.length > Jt && this._trace.shift();
	}
	async _block(e, t) {
		for (let n = 0; n < e.length; n++) {
			let r = e[n];
			if (t.stopped) return "stop";
			if (t.background) {
				for (; this._bgPaused() && !t.stopped;) await this._bgFree();
				if (t.stopped) return "stop";
				let e = Qe(r);
				if (e) throw Error(`line ${r.line}: ${e} (a background run)`);
			}
			if (++t.steps > Ut) throw Error(`line ${r.line}: the script ran more than ${Ut} commands (a loop that never ends?)`);
			this._traceLine(t, r);
			let i = "";
			switch (r.t) {
				case "say": {
					let a = [r];
					for (; e[n + 1]?.t === "say";) a.push(e[++n]);
					let o = e[n + 1]?.t === "choice" ? e[++n] : null;
					i = await this._say(a, o, t);
					break;
				}
				case "choice":
					i = await this._say([], r, t);
					break;
				case "if": {
					let e = r.branches.find((e) => h(e.cond, this.reader)), n = e ? e.body : r.otherwise;
					n && (i = await this._block(n, t));
					break;
				}
				case "loop":
					for (let e = 0;; e++) {
						if (e >= Wt) throw Error(`line ${r.line}: the loop ran ${Wt} times without a break`);
						let n = await this._block(r.body, t);
						if (n === "break") break;
						if (n === "stop") {
							i = "stop";
							break;
						}
					}
					break;
				case "once":
					this.state.markDone(`once:${r.key}`) && (i = await this._block(r.body, t));
					break;
				case "vary": {
					let e = this.state.bump(`vary:${r.key}`);
					this.state.version++, i = await this._block(r.alts[Ye(r.mode, r.alts.length, e, r.key, this.state.day, this.state.seed)], t);
					break;
				}
				case "cmd": i = await this._cmd(r, t);
			}
			if (i) return i;
		}
		return "";
	}
	async _say(e, t, n) {
		let r = this.game, i = [];
		t && (i = t.options.filter((e) => (!e.cond || h(e.cond, this.reader)) && !(e.once && this.state.isDone(this._optionKey(n, e)))), i.length || (this._error(n, `line ${t.line}: no option of the choice is open — skipped`), t = null));
		let a = !!this._auto, o = !a && n.fast ? t && !t.text ? e.length - 1 : -1 : null, s = e.map((e, t) => $(a || o !== null && t !== o, () => this._line(e.speaker, e.text, n, e.tk))), c = !1;
		if (t) {
			let o = $(a, () => i.map((e) => L(w(e.tk, e.label, "choice"), this.reader))), l = !s.length && !this._auto && !n.fast ? r.ui.dialog.heldLine ?? null : null, u = t.text ? $(a, () => this._line(e.length ? e[e.length - 1].speaker : null, t.text, n, t.tk)) : null;
			if (u && l && (l.speaker ?? null) === u.speaker) s.push({
				...l,
				speaker: l.speaker ?? null,
				ask: u.text,
				choices: o
			}), c = !0;
			else if (u) u.choices = o, s.push(u);
			else if (s.length) s[s.length - 1].choices = o;
			else if (l) s.push({
				...l,
				speaker: l.speaker ?? null,
				choices: o
			}), c = !0;
			else {
				let e = $(a, () => this._line(null, "", n));
				e.choices = o, s.push(e);
			}
		}
		if (!s.length) return "";
		let l = 0;
		if (this._auto) {
			for (let e of s) {
				let t = this._src.get(e);
				this._trace.push(t ? `  “${t.speaker ?? ""}: ${L(t.text, this.reader)}”` : `  “${e.speaker ?? ""}: ${e.text}”`);
			}
			l = t ? Math.min(i.length - 1, Math.max(0, this._auto.shift() ?? 0)) : 0;
		} else {
			if (n.fast && !t) return "";
			let e = r.ui.dialog.open({
				lines: n.fast ? s.slice(-1) : s,
				hold: !0
			});
			c && r.ui.dialog.skip?.();
			let i = await e;
			t && typeof i != "number" && n.fast && this.run === n && (i = await r.ui.dialog.open({
				lines: s.slice(-1),
				hold: !0
			})), l = typeof i == "number" ? i : 0;
		}
		if (!t) return "";
		let u = i[Math.min(l, i.length - 1)];
		return u.once && this.state.markDone(this._optionKey(n, u)), this._trace.push(`  > ${u.label}`), this._block(u.body, n);
	}
	_optionKey(e, t) {
		return `opt:${e.kind === "talk" && e.self ? this.visitKey(e.self) : e.key}:${t.line}:${t.label}`;
	}
	_line(e, t, n, r = "") {
		let i = L(w(r, t), this.reader), a, o = null;
		if (e === null) {
			let e = n.self;
			if (e) {
				let t = this._sheetOf(e), n = this._titleOf(e);
				a = {
					speaker: this._plateOf(e),
					text: i,
					portraitColor: e.def.portraitColor,
					...t ? { sheet: t } : {},
					...n ? { title: n } : {}
				}, o = e.name;
			} else a = {
				speaker: null,
				text: i
			};
		} else if (e === "") a = {
			speaker: null,
			text: i
		};
		else {
			let t = this._speaker(e);
			t ? (a = {
				speaker: t.plate,
				text: i,
				...t.color ? { portraitColor: t.color } : {},
				...t.sheet ? { sheet: t.sheet } : {},
				...t.title ? { title: t.title } : {}
			}, o = t.name) : (a = {
				speaker: C(e),
				text: i
			}, o = e);
		}
		return this._src.set(a, {
			speaker: o,
			text: t
		}), a;
	}
	_speaker(e) {
		let t = $e(e) ? this.game.playerName : "";
		if (t) return {
			name: t,
			plate: C(t),
			color: "",
			sheet: this._sheetOf(this.game.player)
		};
		let n = this._npc(e);
		if (n) return {
			name: n.name,
			plate: this._plateOf(n),
			color: n.def.portraitColor,
			sheet: this._sheetOf(n),
			title: this._titleOf(n)
		};
		let r = this.story?.actors;
		if (r) {
			let t = e.toLowerCase();
			for (let [e, n] of Object.entries(r)) if (e.toLowerCase() === t || n.name.toLowerCase() === t) return {
				name: n.name,
				plate: C(n.name),
				color: n.portraitColor,
				sheet: this._actorSheet(n.preset, n.spec)
			};
		}
		return null;
	}
	_plateOf(e) {
		let t = e.storyObj;
		if (t?.type === "npc") {
			let e = t.name;
			if (!(typeof e == "string" && e) && typeof e != "number" && typeof e != "boolean") return S("game.default.villager");
		}
		return C(e.name);
	}
	_titleOf(e) {
		if (!e) return "";
		let t = e, n = t.def?.title == null ? t.storyObj?.title == null ? t : t.storyObj : null, r = n ? n.title : t.def?.title;
		if (typeof r != "string" || !r.trim()) return "";
		let i = n ? ae(n, "title") : typeof t.def?.titleKey == "string" ? t.def.titleKey : "";
		return w(i, r.trim(), "title");
	}
	_sheetOf(e) {
		if (!e) return null;
		let t = e;
		return t.sheet?.canvas ?? t.sprite?.sheet?.canvas ?? null;
	}
	_actorSheet(e, t) {
		if (!e && !t || typeof document > "u") return null;
		let n = e || "villager", r = t ? `${n}|${JSON.stringify(t)}` : n, i = this._actorSheets.get(r);
		if (i === void 0) {
			i = null;
			try {
				let e = l(t ? {
					...u[n],
					preset: n,
					...t
				} : n);
				i = e.canvas, e.dispose();
			} catch (e) {
				console.warn(`[Luminati] story: no portrait for the look "${n}":`, e);
			}
			this._actorSheets.set(r, i);
		}
		return i;
	}
	async _cmd(e, t) {
		let n = this.game, r = e.args, i = this.state, a = Yt.has(e.op) || e.op === "party" && r.verb === "menu";
		switch (!t.background && a && (n.ui.dialog.isHeld || n.ui.dialog.isOpen) && (e.op !== "wait" || r.seconds !== 0) && n.ui.dialog.close(), e.op) {
			case "stop": return "stop";
			case "break": return "break";
			case "call": {
				let n = this._script(r.script);
				if (!n) throw Error(`line ${e.line}: no script "${r.script}" in the story files`);
				if (++t.calls > Gt) throw Error(`line ${e.line}: calls nested deeper than ${Gt}`);
				let i = await this._block(n.nodes, t);
				return t.calls--, i === "stop" ? "stop" : "";
			}
			case "wait":
				if (r.thaw) await (await Vt()).whenThawed();
				else if (r.who) {
					let e = this._actor(r.who), n = e ? this.walks.get(e) : null;
					n?.run?.background && !t.background ? this._takeActor(e, t) : n && await n.promise;
				} else await this._wait(r.seconds, t);
				return "";
			case "set": return i.setVar(r.name, 1), "";
			case "clear": return i.setVar(r.name, 0), "";
			case "var": return i.setVar(r.name, r.by === "=" ? r.value : i.get(r.name) + (r.by === "+" ? r.value : -r.value)), "";
			case "give":
			case "take": return this._items(r.item, e.op === "give" ? r.count : -r.count, t), "";
			case "quest": return this._quest(r, e.tk), "";
			case "home": {
				let a = this._actor(r.who);
				if (!a || a === n.player) throw Error(`line ${e.line}: "${r.who}" is no villager here`);
				if ("record" in a) return this._warn(t, `line ${e.line}: "${r.who}" is in the party — "home" changes nothing while it is`), "";
				let o = a;
				this._takeActor(o, t);
				let s = r.x ?? o.position.x, c = r.z ?? o.position.z, [l, u] = this._onMap(s, c);
				return o.setHome(l, u, { move: r.x !== void 0 && !o.directed }), i.levelMemory(this.levelId).homes[o.id] = [+l.toFixed(3), +u.toFixed(3)], i.version++, "";
			}
			case "time": {
				if (r.seconds === void 0) return this._advanceClock(r.hour), "";
				let e = t.fast ? 0 : Math.max(0, r.seconds), i = this._clock();
				n.campaign ? n.campaign.setStoryTime(r.hour, { seconds: e }) : e > 0 && typeof n.weather?.setTime == "function" ? n.weather.setTime(r.hour, { duration: e }) : n.setTime(r.hour);
				let a = this._clock(), o = ((a - i) % 24 + 24) % 24;
				return o > 0 && this._passTime(i, o), this._prevTime = a, e > 0 && await this._wait(e, t), Math.abs(n.lighting.timeOfDay - (r.hour % 24 + 24) % 24) > .001 && n.setTime(r.hour), "";
			}
			case "thaw": {
				let i = r.who === void 0 ? r.x === void 0 ? null : this._onMapXZ(r.x, r.z) : this._place(r.who);
				if (r.who !== void 0 && !i) throw Error(`line ${e.line}: "${r.who}" names no place here`);
				this._trace.push("  [thaw]");
				let { startThaw: a } = await Vt();
				return t.stopped || a(n, {
					at: i,
					seconds: r.seconds,
					wait: (e) => this._wait(e, t),
					run: t
				}), "";
			}
			case "toll": {
				let i = n.world.bells.get(r.id);
				if (this._trace.push(`  [toll: ${r.id}]`), !i) return this._warn(t, `line ${e.line}: "${r.id}" is no bell here (a belfry or a chime as the story stands) — nothing rings`), "";
				if (t.fast) return "";
				let a = r.strength ?? 1;
				i.ring(a), It(n, "toll", i.mouth[0], i.mouth[1], i.mouth[2], i.kind === "chime" ? .45 * a : a);
				let o = this._tollVoice(r.id, i, await Ht());
				return t.stopped ? "" : (this._trace.push(`  [bell: ${o.sound} ×${+o.pitch.toFixed(3)}]`), n.audio.playSfx(o.sound, {
					volume: Math.min(1, .6 + .3 * a),
					pitch: o.pitch
				}), "");
			}
			case "weather": return n.weather.setWeather(r.weather), "";
			case "travel":
				if (!n.campaign) throw Error(`line ${e.line}: "travel" needs a campaign`);
				if (!n.campaign.isLevel(r.level)) throw Error(`line ${e.line}: "${r.level}" is not a level of the campaign`);
				if (!await n.campaign.travel(r.level, {
					entrance: r.entrance,
					fromStory: !0
				})) throw Error(`line ${e.line}: the travel to "${r.level}" failed`);
				return "";
			case "rest": return await n.restUntilMorning(), "";
			case "heal": return n.combat?.pc?.refill?.(), this._healMembers(), "";
			case "party": return this._party(e, t);
			case "shop": {
				let n = t.self;
				if (!n) throw Error(`line ${e.line}: "shop" belongs in a villager's talk script`);
				return await de({
					...n.storyObj,
					dialogue: [],
					action: "shop"
				})(this._conversationContext(n, t)), "";
			}
			case "builtin": {
				let n = s(fe, r.script);
				if (!n) throw Error(`line ${e.line}: no built-in conversation "${r.script}"`);
				let i = t.self;
				return await n(this._conversationContext(i, t), i?.storyObj ?? {}), "";
			}
			case "ending": return i.ending = r.id, i.version++, n.campaign?.releaseSaves(), n.campaign?.save(), n.campaign?.holdSaves(), this._hush(), await n.ui.endCard?.show({
				title: r.title ? L(w(e.tk, r.title, "title"), this.reader) : S("story.ending.default"),
				subtitle: C(n.campaign?.campaign.name ?? n.level.name)
			}), n.ui.endCard && (n.audio?.stopMusic?.({ fade: an }), await n.ui.fader.fadeOut(an)), n.returnToTitle(), "stop";
			case "cutscene": return t.cutscene || (t.cutscene = !0, n.ui.setCutscene?.(!0), n.combat?.targeting?.release(), this._retractRegionBanner()), "";
			case "walk": {
				let n = this._actor(r.who);
				if (!n) throw Error(`line ${e.line}: "${r.who}" is no villager or "player" here`);
				let i = r.to === void 0 ? {
					x: r.x,
					z: r.z
				} : this._place(r.to);
				if (!i) throw Error(`line ${e.line}: "${r.to}" names no place here`);
				let [a, o] = this._onMap(i.x, i.z), s = this._walk(n, a, o, r.run, t);
				return r.wait && await s, "";
			}
			case "face": {
				let n = this._actor(r.who);
				if (!n) throw Error(`line ${e.line}: "${r.who}" is no villager or "player" here`);
				if (this._takeActor(n, t), r.dir) this._faceDir(n, r.dir);
				else {
					let e = this._place(r.to);
					e && this._faceTo(n, e.x, e.z);
				}
				return "";
			}
			case "emote": {
				let e = this._actor(r.who);
				return e && !t.fast && n.ui.emotes?.show(e.sprite, r.icon, r.seconds, { offsetY: e === n.player ? 2.2 : 2.35 }), "";
			}
			case "bark": {
				let i = this._actor(r.who);
				return i && !t.fast && n.ui.emotes?.bark(i.sprite, L(w(e.tk, r.text), this.reader), void 0, { offsetY: i === n.player ? 2.2 : 2.35 }), this._trace.push(`  ‹${r.who}: ${r.text}›`), "";
			}
			case "teleport": {
				let n = this._actor(r.who);
				if (!n) throw Error(`line ${e.line}: "${r.who}" is no villager or "player" here`);
				let i = r.to === void 0 ? {
					x: r.x,
					z: r.z,
					facing: ""
				} : this._place(r.to);
				if (!i) throw Error(`line ${e.line}: "${r.to}" names no place here`);
				let [a, o] = this._onMap(i.x, i.z);
				this._takeActor(n, t), this._teleport(n, a, o);
				let s = r.facing || i.facing;
				return s && this._faceDir(n, s), "";
			}
			case "camera":
				if (r.reset) await this._cameraReset(t.fast ? 0 : r.seconds);
				else {
					let n = r.who === void 0 ? this._onMapXZ(r.x, r.z) : this._placeTarget(r.who);
					if (!n) throw Error(`line ${e.line}: "${r.who}" names nothing to look at here`);
					await this._cameraTo(n, t.fast ? 0 : r.seconds);
				}
				return "";
			case "shake": return t.fast || n.rig.shake(r.amount, .45), "";
			case "fade": return t.onBlack = !1, r.dir === "out" ? await n.ui.fader.fadeOut(t.fast ? .05 : r.seconds, r.white ? $t : void 0) : await n.ui.fader.fadeIn(t.fast ? .05 : r.seconds), "";
			case "shot": return this._shot(e, t);
			case "slowmo": return this._slowmo(e, t);
			case "flash": return this._flash(e, t);
			case "title": return this._title(e, t);
			case "pose": return this._pose(e, t);
			case "effect": return this._effect(e, t);
			case "banner": return t.fast || n.ui.banner.show(L(w(e.tks?.[0], r.title, "title"), this.reader), L(w(e.tks?.[1], r.subtitle, "title"), this.reader), { duration: 3.2 }), "";
			case "toast": return n.ui.hud.toast(L(w(e.tk, r.text), this.reader), 2.4), "";
			case "sfx": return this._sfx(r.name, .7, r), "";
			case "music": return r.track === "off" ? n.audio.stopMusic() : r.track === "on" ? n.setMusic(!0) : (t.onBlack && !t.fast && await this._musicRendered(r.track), n.audio.startMusic({
				track: r.track,
				fade: 2
			})), "";
			default: throw Error(`line ${e.line}: "${e.op}" cannot run here`);
		}
	}
	async _shot(e, t) {
		let n = e.args, r = this.game.rig, i = t.fast ? 0 : Math.max(0, Number(n.seconds) || 0);
		if (n.reset) return i === 0 && (this.focusCut = !0), await this._cameraReset(i), "";
		let a = null;
		if ((n.who !== void 0 || n.x !== void 0) && (a = n.who === void 0 ? this._onMapXZ(n.x, n.z) : this._placeTarget(n.who), !a)) throw Error(`line ${e.line}: "${n.who}" names nothing to look at here`);
		this._camSession();
		let o = [];
		a && o.push(this._cameraTo(a, i, { chest: !0 }));
		let s = {};
		for (let [e, t] of en) typeof n[e] == "number" && (s[t] = n[e]);
		return Object.keys(s).length && o.push(r.setFraming(s, i)), typeof n.orbit == "number" && r.orbit(n.orbit), i === 0 && a && r.snap(), i === 0 && o.length && (this.focusCut = !0), i > 0 && n.wait !== !1 && await Promise.all(o), "";
	}
	_slowmo(e, t) {
		let n = this.game.engine?.time;
		if (!n) return "";
		let r = n.timeScale > 0 ? n.timeScale : 1, i = this._slow ??= {
			base: r,
			from: r,
			to: r,
			t: 0,
			dur: 0
		};
		return i.from = r, i.to = Math.min(1, Math.max(.1, Number(e.args.scale) || 1)), i.t = 0, i.dur = t.fast ? 0 : Math.max(0, Number(e.args.seconds) || 0), this._stepSlow(0), "";
	}
	_stepSlow(e) {
		let t = this._slow;
		if (!t) return;
		t.t = Math.min(t.dur, t.t + Math.max(0, e));
		let n = t.dur > 0 ? t.t / t.dur : 1;
		this._setTimeScale(t.from + (t.to - t.from) * ((1 - Math.cos(Math.PI * n)) / 2)), n >= 1 && Math.abs(t.to - t.base) < 1e-6 && this._endSlowmo();
	}
	_setTimeScale(e) {
		let t = this.game;
		t.engine?.time && (t.engine.time.timeScale = e, t.rig && (t.rig.framingRate = e > 0 ? 1 / e : 1));
	}
	_endSlowmo() {
		let e = this._slow;
		e && (this._slow = null, this._setTimeScale(e.base), this.game.rig && (this.game.rig.framingRate = 1));
	}
	async _flash(e, t) {
		if (t.fast) return "";
		if (e.args.hold) {
			let n = await this._cineUI();
			!t.fast && !t.stopped && n?.flash.hold(e.args.color, e.args.seconds, 1);
		} else this._cineNow()?.flash.flash(e.args.color, e.args.seconds, 1);
		return "";
	}
	screenFlash(e, t = .35, n = 1) {
		let r = this._cineNow()?.flash;
		r && !r.held && r.flash(e, t, n);
	}
	async _title(e, t) {
		let n = e.args;
		if (this._trace.push(`  [title: ${n.title}${n.subtitle ? ` | ${n.subtitle}` : ""}]`), t.fast) return "";
		let r = L(w(e.tks?.[0], n.title, "title"), this.reader), i = n.subtitle ? L(w(e.tks?.[1], n.subtitle, "title"), this.reader) : "", a = await this._cineUI();
		return t.fast || t.stopped ? "" : (this.cardShownAt = typeof performance < "u" ? performance.now() : Date.now(), this._hush(), a ? await a.title.show(r, i) : await this._wait(Qt, t), "");
	}
	get cardUp() {
		return !!this._cine?.title.active;
	}
	_hush() {
		let e = this.game.ui.emotes;
		if (e) for (let t of this.game.npcs ?? []) t.hush?.(e);
	}
	_retractRegionBanner() {
		let e = this.game, t = e._regionBanner;
		if (!t) return;
		e._regionBanner = null;
		let n = e.ui.banner;
		e.engine.time.elapsed - t.at > sn || !n.visible || n._titleText !== t.title || (n.hide(!0), e._bannersShown.delete(t.name));
	}
	_pose(e, t) {
		let n = e.args, r = this.game, i = this._actor(n.who);
		if (!i?.sprite) return this._warn(t, `line ${e.line}: "${n.who}" is no villager, party member or "player" here — no pose`), "";
		i !== r.player && this._takeActor(i, t);
		let a = this.walks.get(i);
		if (a && this._endWalk(i, a, !1), this._endPose(i), this._trace.push(`  [pose: ${n.who} ${n.pose}]`), n.pose === "none" || t.fast && n.seconds > 0) return "";
		let o = this._posePlan(i, n.pose);
		if (!o) {
			let a = i === r.player ? "the player" : "record" in i ? "a party member" : "a villager", o = `${a}:${i.sprite.sheet?.name ?? ""}:${n.pose}`;
			return this._poseWarned.has(o) || (this._poseWarned.add(o), this._warn(t, `line ${e.line}: "${n.who}" has no "${n.pose}" pose on this level (${a === "a villager" ? "villagers pose on the festival sheet" : "the player and party members pose on their combat sheet, on a level without enemies on the festival sheet: no ready / cast"}) — it stands as it is`)), "";
		}
		i !== r.player && i.direct?.();
		let s = {
			name: n.pose,
			plan: o,
			t: 0,
			left: n.seconds > 0 ? n.seconds : Infinity,
			run: t
		};
		return this._poses.set(i, s), this._applyPose(i, s), "";
	}
	_posePlan(e, t) {
		let n = e.sprite?.sheet;
		if (!n) return null;
		let r = n.poses ?? null, i = n.animations ?? {};
		for (let e of s(tn, t) ?? []) if ("anim" in e) {
			let t = Object.hasOwn(i, `${e.anim}_down`) ? i[`${e.anim}_down`] : null;
			if (t?.frames?.length) return {
				anim: e.anim,
				fps: t.fps > 0 ? t.fps : 6,
				loop: t.loop !== !1
			};
		} else if (r && e.cols.every((e) => Object.hasOwn(r, e))) return {
			cols: e.cols.map((e) => r[e]),
			fps: e.fps ?? 4,
			loop: !!e.loop
		};
		return null;
	}
	_updatePoses(e) {
		for (let [t, n] of this._poses) {
			if (!t.sprite) {
				this._poses.delete(t);
				continue;
			}
			if (n.t += e, n.left !== Infinity && (n.left -= e, n.left <= 0)) {
				this._endPose(t);
				continue;
			}
			this._applyPose(t, n);
		}
	}
	_applyPose(e, t) {
		let r = e.sprite, i = t.plan, a = n.includes(r.direction) ? r.direction : "down", o = Math.max(0, n.indexOf(a)), s = i.cols ?? [];
		if (i.anim) {
			let e = r.sheet.animations, t = Object.hasOwn(e, `${i.anim}_${a}`) ? e[`${i.anim}_${a}`] : e[`${i.anim}_down`];
			s = t.frames.map((e) => e.col), o = t.frames[0]?.row ?? o;
		}
		if (!s.length) return;
		let c = Math.floor(t.t * i.fps), l = s[i.loop ? c % s.length : Math.min(s.length - 1, c)];
		r.direction = a, r.setFrame(l, o);
	}
	_endPose(e) {
		this._poses.delete(e) && e !== this.game.player && e.sprite?.play?.("idle", { restart: !0 });
	}
	_endPoses(e) {
		for (let [t, n] of [...this._poses]) (!e || n.run === e) && this._endPose(t);
	}
	_effect(e, t) {
		let n = e.args, r = n.who === void 0 ? this._onMapXZ(n.x, n.z) : this._place(n.who);
		if (!r) throw Error(`line ${e.line}: "${n.who}" names no place here`);
		if (this._trace.push(`  [effect: ${n.name}]`), t.fast) return "";
		let [i, a] = this._onMap(r.x, r.z);
		return It(this.game, n.name, i, this.game.tileMap.getHeight(i, a), a, n.scale), "";
	}
	openingRun() {
		let e = this.queue[0];
		if (!e || e.kind !== "event" && e.kind !== "story") return null;
		let t = {
			music: !1,
			tracks: []
		};
		return this._fadesInFirst(e.nodes, t, 0) === "in" ? t : null;
	}
	openingMusic() {
		let e = new Set(this.run ? this.musicOf(this.run.nodes) : []);
		for (let t of this._arrivalMusic()) e.add(t);
		return [...e];
	}
	_arrivalMusic() {
		let e = this._arrivalFirst();
		return e ? this._blackMusic(e) : [];
	}
	_blackMusic(e) {
		let t = {
			music: !1,
			tracks: []
		};
		return this._fadesInFirst(e, t, 0) === "in" ? t.tracks : [];
	}
	primeMusicAhead() {
		this._primeMusic(this.openingMusic(), this._arrivalMusic());
	}
	_primeMusic(e, t = e) {
		let n = this.game.audio;
		n.retainMusic("story", e), this._musicLater = this._loading() ? e.filter((e) => !t.includes(e)) : [];
		for (let t of e) this._musicLater.includes(t) || n.primeMusic(t);
	}
	_loading() {
		return !this._loaded || this.game.mode === "travel";
	}
	_primeLater() {
		let e = this._musicLater;
		this._musicLater = [];
		for (let t of e) this.game.audio.primeMusic(t);
	}
	_arrivalFirst() {
		for (let e of this.events) {
			let t = e.obj;
			if (t.on === "arrive" && t.background !== !0 && this.present(t) && this._eventGuard(e) && !(t.once && this.state.isDone(e.key))) return e.nodes;
		}
		for (let e of this.globalEvents) {
			let t = e.def;
			if (t.on !== "arrive" || t.level && t.level !== this.levelId || t.background === !0 || t.once && this.state.isDone(`story.${t.id}`) || t.if && !this.test(t.if)) continue;
			let n = this._script(t.run);
			if (n) return n.nodes;
		}
		return null;
	}
	musicOf(e) {
		let t = /* @__PURE__ */ new Set(), n = (e, r) => R(e, (e) => {
			if (e.t === "cmd") {
				if (e.op === "music") {
					let n = e.args?.track;
					typeof n == "string" && n !== "off" && n !== "on" && t.add(n);
				} else if (e.op === "call" && r < Gt) {
					let t = this._script(e.args?.script);
					t && n(t.nodes, r + 1);
				}
			}
		});
		return n(e, 0), [...t];
	}
	_musicRendered(e) {
		return new Promise((t) => {
			let n = setTimeout(t, mn * 1e3);
			Promise.resolve(this.game.audio.primeMusic(e)).then(() => {
				clearTimeout(n), t();
			}, () => {
				clearTimeout(n), t();
			});
		});
	}
	_fadesInFirst(e, t, n) {
		for (let r of e) if (r.t !== "say") {
			if (r.t !== "cmd") return "stop";
			switch (r.op) {
				case "fade": return r.args.dir === "in" ? "in" : "out";
				case "music": {
					t.music = !0;
					let e = r.args?.track;
					typeof e == "string" && e !== "off" && e !== "on" && !t.tracks.includes(e) && t.tracks.push(e);
					break;
				}
				case "call": {
					let e = n < 4 ? this._script(r.args.script) : null;
					if (!e) return "stop";
					let i = this._fadesInFirst(e.nodes, t, n + 1);
					if (i) return i;
					break;
				}
				case "travel":
				case "ending":
				case "rest":
				case "shop":
				case "builtin":
				case "stop": return "stop";
			}
		}
		return "";
	}
	_conversationContext(e, t) {
		let n = this.game;
		return {
			say: (t, r = {}) => {
				let i = r.speaker === void 0 ? this._sheetOf(e) : null, a = {
					speaker: r.speaker == null ? e ? this._plateOf(e) : "" : C(String(r.speaker)),
					lines: t,
					portraitColor: e?.def.portraitColor,
					...i ? { sheet: i } : {}
				};
				return n.ui.dialog.open(a);
			},
			toast: (e) => n.ui.hud.toast(e, 2.4),
			sfx: (e) => this._sfx(e, .7),
			visits: t.visits,
			game: n,
			npc: e
		};
	}
	_items(e, t, n) {
		let r = this.game;
		if (e === "gold") {
			let e = r.combat?.pc, i = this.gold, a = Math.max(0, i + t);
			if (a === i) return;
			e ? e.gold = a : this.state.gold = a, this.state.version++, n.fast || r.ui.hud.toast(t > 0 ? S("story.gold.received", { n: a - i }) : S("story.gold.given", { n: i - a }), 2.2, { kind: "item" });
			return;
		}
		let i = this.state.addItem(e, t);
		if (!i) return;
		let a = Math.abs(i), o = i > 0 ? a > 1 ? "story.item.receivedCount" : "story.item.received" : a > 1 ? "story.item.givenCount" : "story.item.given";
		n.fast || r.ui.hud.toast(S(o, {
			item: C(this.itemName(e)),
			n: a
		}), 2.2, { kind: "item" }), i > 0 && this._sfx("chime", .5);
	}
	_sfx(e, t, n = {}) {
		let r = typeof performance < "u" ? performance.now() : Date.now();
		if (this._lastSfx.name === e && r - this._lastSfx.at < 50) return;
		this._lastSfx = {
			name: e,
			at: r
		};
		let i = { volume: t };
		n.pitch !== void 0 && (i.pitch = 2 ** (n.pitch / 12)), n.pan !== void 0 && (i.pan = n.pan), this.game.audio.playSfx(e, i);
	}
	_tollVoice(e, t, n) {
		let r = this.game.level.objects;
		if (t.kind === "chime") {
			let t = r.filter((e) => e.type === "monument" && e.opts?.kind === "chime"), i = Math.max(0, t.findIndex((t) => t.id === e));
			return {
				sound: "waysideChime",
				pitch: n.CHIME_PITCH[i % n.CHIME_PITCH.length]
			};
		}
		let i = r.find((t) => t.id === e);
		return {
			sound: i?.type === "belfry" && i.opts?.bell === "black" ? "bellTollBlack" : "bellToll",
			pitch: s(n.BELL_PITCH, t.kind) ?? 1
		};
	}
	itemName(e) {
		return s(this.story?.items ?? {}, e)?.name ?? (this.state.itemNameOf(e) || m(e));
	}
	questTitle(e) {
		return s(this.story?.quests ?? {}, e)?.title || this.state.quest(e)?.title || m(e);
	}
	_quest(e, t = "") {
		let n = e.verb === "stage", r = this.state.questChange(e.id, e.verb, {
			stage: e.stage ?? "",
			text: e.text ? L(e.text, this.reader) : "",
			...n && e.text && t ? {
				key: t,
				src: e.text
			} : {}
		});
		if (!r) return;
		let i = C(this.questTitle(e.id));
		this.game.ui.hud.toast(S(`story.quest.${r}`, { title: i }), 2.8, { kind: "quest" }), this._sfx(r === "fail" ? "cancel" : "chime", .55);
	}
	giveNamed(e, t = 1) {
		let n = e.trim().toLowerCase(), r = "";
		for (let [e, t] of Object.entries(this.story?.items ?? {})) if (t.name.toLowerCase() === n || e === n) {
			r = e;
			break;
		}
		return r || (r = n.replace(/[^a-z0-9_.-]+/g, "-").replace(/^-+|-+$/g, "") || "item", this.state.nameItem(r, e)), this.state.addItem(r, t), {
			id: r,
			count: this.state.count(r)
		};
	}
	async _party(e, t) {
		let n = this.game, r = e.args, i = `line ${e.line}: party ${r.verb}`;
		if (r.verb === "join") {
			let e = () => (this._warn(t, `${i}: "${r.who}" is in the party already`), "");
			if (n.party?.find(r.who)) return e();
			let a = this._villager(r.who);
			if (!a) this._warn(t, `${i}: "${r.who}" is no villager here — nobody joins`);
			else if (!n.party && this.partyHolds(a)) return e();
			else if (!a.present) this._warn(t, `${i}: "${r.who}" is not here as the story stands — nobody joins`);
			else if ((n.party?.count ?? 0) >= 3) this._warn(t, `${i}: the party is full (3) — "${r.who}" does not join`);
			else {
				let o = await n.ensureParty();
				if (o.find(r.who) || o.holds(a)) return e();
				if (o.count >= 3) return this._warn(t, `${i}: the party is full (3) — "${r.who}" does not join`), "";
				let s = this.walks.get(a);
				s && this._endWalk(a, s, !1), a.sprite && n.ui.emotes?.clear?.(a.sprite, !0), o.join(a, {
					cls: r.cls || void 0,
					preset: r.preset || void 0
				}) ? this._trace.push(`  [party: ${r.who} joins]`) : this._warn(t, `${i}: "${r.who}" could not join`);
			}
			return "";
		}
		let a = n.party, o = a?.find(r.who || "") ?? null;
		if (r.verb === "menu") {
			if (!a?.count) return this._warn(t, `${i}: nobody is in the party — no tactics panel`), "";
			if (r.who && !o && this._warn(t, `${i}: "${r.who}" is not in the party — the panel opens on the first member`), t.fast || this._auto) return this._trace.push("  [party: tactics panel (not opened)]"), "";
			let e = o ? o.id : void 0;
			return (typeof n.togglePartyMenu == "function" ? n.togglePartyMenu(!0, e, { force: !0 }) : a.openMenu(e)) ? (await this._until(() => !a.menuOpen, t), "") : (this._warn(t, `${i}: the tactics panel did not open`), "");
		}
		if (!o) return this._warn(t, `${i}: "${r.who}" is not in the party`), "";
		switch (r.verb) {
			case "leave": {
				let e = this.walks.get(o);
				e && this._endWalk(o, e, !1), this._mainActors.delete(o);
				for (let e of this.bgRuns) e.actors.delete(o);
				o.sprite && n.ui.emotes?.clear?.(o.sprite, !0), a.leave(o.id);
				break;
			}
			case "rule":
				a.setRule(o.id, r.preset, {
					source: "story",
					quiet: t.fast
				});
				break;
			case "set": a.setField(o.id, r.field, r.value, {
				source: "story",
				quiet: t.fast
			});
		}
		return "";
	}
	_healMembers() {
		let e = this.game.combat;
		if (e && "healAllies" in e && typeof e.healAllies == "function") e.healAllies();
		else for (let e of this.game.party?.members ?? []) e.combat?.refill();
	}
	_warn(e, t) {
		console.warn(`[Luminati] story: ${e.key}: ${t}`);
	}
	_until(e, t) {
		return e() ? Promise.resolve() : new Promise((n) => {
			this._untils.push({
				done: e,
				resolve: () => n(),
				run: t
			});
		});
	}
	_updateUntils() {
		for (let e = this._untils.length - 1; e >= 0; e--) {
			let t = this._untils[e], n = !0;
			try {
				n = t.done();
			} catch (e) {
				console.warn("[Luminati] story: a wait failed:", e);
			}
			n && (this._untils.splice(e, 1), t.resolve());
		}
	}
	_endUntils() {
		for (let e of this._untils.splice(0)) e.resolve();
	}
	_npc(e) {
		let t = this.game.party?.find(e);
		return t?.sprite ? t : this._villager(e);
	}
	_villager(e) {
		let t = this.game.npcs ?? [], n = this.game.npcById?.get(e);
		if (n) return n;
		let r = String(e).toLowerCase();
		return t.find((e) => typeof e.storyObj?.actor == "string" && e.storyObj.actor.trim().toLowerCase() === r) ?? t.find((e) => e.id.toLowerCase() === r || e.name.toLowerCase() === r) ?? null;
	}
	_actor(e) {
		return $e(e) ? this.game.player : this._npc(e);
	}
	_place(e) {
		let t = this._actor(e);
		if (t) return {
			x: t.position.x,
			z: t.position.z
		};
		let n = this.game.level.objects, r = (e) => typeof e == "string" && Object.hasOwn(cn, e) ? e : "", i = n.find((t) => t.type === "marker" && (t.id === e || typeof t.name == "string" && t.name.trim() === e));
		if (i) return {
			x: i.x,
			z: i.z,
			facing: r(i.facing)
		};
		let a = ce(this.game.level).find((t) => le(t) === e && this.present(t));
		if (a) return {
			x: a.x,
			z: a.z,
			facing: r(a.facing)
		};
		let o = n.find((t) => t.id === e);
		return o ? Number.isFinite(o.x) && Number.isFinite(o.z) ? {
			x: o.x,
			z: o.z
		} : Number.isFinite(o.minX) ? {
			x: (o.minX + o.maxX) / 2,
			z: (o.minZ + o.maxZ) / 2
		} : Number.isFinite(o.x0) ? {
			x: (o.x0 + o.x1) / 2,
			z: (o.z0 + o.z1) / 2
		} : null : null;
	}
	_placeTarget(e) {
		let t = this._actor(e);
		if (t) return { object: t.sprite };
		let n = this._groupFoe(e);
		return n ? {
			object: n.sprite,
			group: e,
			foe: n
		} : this._place(e);
	}
	_groupFoe(e) {
		let t = this.game.combat?.enemies;
		if (!t || !e) return null;
		let n = null, r = null;
		for (let i of t) if (i.groupId === e && i.sprite.visible) {
			if (!i.alive) {
				i.boss && (i.sprite.opacity ?? 1) > 0 && (r ??= i);
				continue;
			}
			if (i.boss) return i;
			n ??= i;
		}
		return n ?? r;
	}
	_faceDir(e, t) {
		let n = s(cn, t);
		n && (e === this.game.player ? this.game.player.faceTowards(e.position.x + n[0], e.position.z + n[1]) : typeof e.faceWorld == "function" ? e.faceWorld(n[0], n[1]) : e.sprite.setDirection(t));
	}
	_onMap(e, t) {
		let n = this.game.level;
		return [Math.min(n.width + dn, Math.max(-2, e)), Math.min(n.depth + dn, Math.max(-2, t))];
	}
	_onMapXZ(e, t) {
		let [n, r] = this._onMap(e, t);
		return {
			x: n,
			z: r
		};
	}
	_faceTo(e, t, n) {
		e === this.game.player ? this.game.player.faceTowards(t, n) : typeof e.faceWorld == "function" ? e.faceWorld(t - e.position.x, n - e.position.z) : e.sprite.faceVector(t - e.position.x, n - e.position.z);
	}
	_teleport(e, t, n) {
		let r = this.game, i = r._standable(t, n) ?? {
			x: t,
			z: n
		};
		e === r.player ? (r.player.teleport(i.x, i.z), r.combat?.onTeleport(), this._cam || (r._updateCameraBounds(), r.rig.snap()), r.world.lightPool?.snap()) : e.placeAt(i.x, i.z);
	}
	_ownNav() {
		let e = this.game;
		if (this._nav && this._navLevel === e.tileMap) {
			if (this._navSteps) {
				let e = this._navSteps;
				this._navSteps = null;
				for (let t = e.next(); !t.done; t = e.next());
			}
			return this._nav;
		}
		return this._dropNav(), this._nav = new pe(e.tileMap, { maxExpand: this._navCapacity() }), this._navLevel = e.tileMap, this._nav;
	}
	_navCapacity() {
		let e = this.game.level;
		return Math.max(8e3, Math.ceil(e.width * 2) * Math.ceil(e.depth * 2));
	}
	_dropNav() {
		this._navIdle && typeof cancelIdleCallback == "function" && cancelIdleCallback(this._navIdle), this._navIdle = 0, this._navSteps = null, this._nav = null, this._navLevel = null;
	}
	_prepareNav() {
		let e = this.game;
		e.combat?.nav || this._nav || typeof requestIdleCallback != "function" || !this._mayWalk() || (this._nav = new pe(e.tileMap, {
			maxExpand: this._navCapacity(),
			defer: !0
		}), this._navLevel = e.tileMap, this._navSteps = this._nav.buildSteps(null, hn), this._stepNav());
	}
	_stepNav() {
		!this._navIdle && this._navSteps && (this._navIdle = requestIdleCallback((e) => {
			this._navIdle = 0;
			let t = this._navSteps;
			if (!t) return;
			let n = performance.now(), r = e.didTimeout ? gn / 2 : Math.min(gn, e.timeRemaining() - 1);
			for (; this._navSteps === t;) {
				if (t.next().done) {
					this._navSteps = null;
					return;
				}
				if (performance.now() - n >= r) break;
			}
			this._stepNav();
		}, { timeout: 1e3 }));
	}
	_mayWalk() {
		let e = !1, t = (t) => {
			!e && t && R(t, (t) => {
				t.t === "cmd" && t.op === "walk" && (e = !0);
			});
		};
		for (let e of this.events) t(e.nodes);
		for (let e of this.game.npcs) t(e.storyTalk);
		let n = this.story?.scripts ?? {};
		for (let t of Object.keys(n)) {
			if (e) break;
			let r = s(n, t);
			r && p(r.lines).some((e) => /^\s*walk\s/.test(e)) && (e = !0);
		}
		return e;
	}
	_plan(e, t, n, r) {
		let i = this.game, a = this._pathBuf, o = (e) => {
			let t = [];
			for (let n = 0; n < e; n++) t.push([a[n * 2], a[n * 2 + 1]]);
			return t;
		};
		try {
			let s = i.combat?.nav;
			if (s) {
				let c = Math.max(i.level.width, i.level.depth) > 64 ? 24e3 : 8e3, l = s.findPath(e, t, n, r, 1e6, a, Math.min(s.maxExpand, c));
				if (l > 0) return o(l);
			}
			let c = this._ownNav(), l = c.findPath(e, t, n, r, 1e6, a, c.maxExpand);
			if (l > 0) return o(l);
		} catch (e) {
			console.warn("[Luminati] story: walk grid:", e);
		}
		return [];
	}
	_walk(e, t, n, r, i) {
		let a = this.game;
		this._takeActor(e, i);
		let o = this.walks.get(e);
		if (o?.run?.background && o.run !== i && !o.orphan ? this._stopBg(o.run) : o && this._endWalk(e, o, !1), this._endPose(e), i.fast) return this._teleport(e, t, n), Promise.resolve();
		let s = e.position, c = this._plan(s.x, s.z, t, n);
		c.length || (console.warn(`[Luminati] story: ${i.key}: no way to (${t.toFixed(1)}, ${n.toFixed(1)}) on the walk grid — walking straight`), c = [[t, n]]), e !== a.player && e.direct();
		let l, u = new Promise((e) => {
			l = e;
		});
		return this.walks.set(e, {
			points: c,
			i: 0,
			running: !!r,
			resolve: l,
			promise: u,
			stuck: 0,
			last: Infinity,
			goal: [t, n],
			run: i,
			legs: 0
		}), u;
	}
	_updateWalks(e, t = !1) {
		let n = this.game, r = Math.max(.12, e * 6.5);
		for (let [i, a] of this.walks) {
			if (t && a.run?.background) {
				a.stuck = 0, a.last = Infinity, a.paused || (a.paused = !0, i !== n.player && i.stopWalk?.());
				continue;
			}
			a.paused = !1;
			let [o, s] = a.points[a.i], c = i.position, l = Math.hypot(o - c.x, s - c.z);
			if (l < r) {
				if (++a.i < a.points.length) continue;
				let e = a.goal[0], t = a.goal[1];
				if (Math.hypot(e - c.x, t - c.z) > Math.max(.5, r) && a.legs < pn) {
					let n = this._plan(c.x, c.z, e, t);
					if (n.length) {
						a.points = n, a.i = 0, a.legs++, a.stuck = 0, a.last = Infinity;
						continue;
					}
				}
				this._endWalk(i, a, !1);
				continue;
			}
			a.stuck = l < a.last - .001 ? 0 : a.stuck + e, a.last = l, i === n.player ? n.player.scripted = {
				x: (o - c.x) / l,
				z: (s - c.z) / l,
				run: a.running
			} : i.walkStep(e, o, s, a.running), a.stuck > qt && (this._teleport(i, a.goal[0], a.goal[1]), this._endWalk(i, a, !1));
		}
	}
	_endWalk(e, t, n) {
		n && this._teleport(e, t.goal[0], t.goal[1]), e === this.game.player ? this.game.player.scripted = null : e.stopWalk?.(), this.walks.delete(e), t.resolve(), t.orphan && e !== this.game.player && e.directed && !this._heldElsewhere(e, t.run) && e.release();
	}
	_wait(e, t) {
		return t.fast || e <= 0 ? Promise.resolve() : new Promise((n) => {
			this.timers.push({
				t: e,
				resolve: () => n(),
				run: t
			});
		});
	}
	_updateTimers(e, t = !1) {
		for (let n = this.timers.length - 1; n >= 0; n--) {
			let r = this.timers[n];
			t && r.run?.background || (r.t -= e, r.t <= 0 && (this.timers.splice(n, 1), r.resolve()));
		}
	}
	_updateSkip(e) {
		let t = this.game;
		t.engine.input.action("cancel") ? this._skipHold += e : this._skipHold = 0, t.ui.setSkipHint?.(this._skipHold > 0, Math.min(1, this._skipHold / Kt)), !(this._skipHold < Kt) && (this._skipHold = 0, t.ui.setSkipHint?.(!1, 0), this.skip());
	}
	skip() {
		let e = this.run;
		if (!e || e.fast) return !1;
		e.fast = !0;
		let t = this.game;
		this.timers = this.timers.filter((e) => e.run?.background ? !0 : (e.resolve(), !1));
		for (let [e, t] of this.walks) t.run?.background || this._endWalk(e, t, !0);
		return this._cam && (this._cam.t = this._cam.dur), t.rig?.completeFraming?.(), this._slow && (this._slow.t = this._slow.dur), this._cine?.title.active && this._cine.title.skip(), this._cine?.flash.held && this._cine.flash.clear(), Tt(t), t.ui.dialog.isOpen && !t.ui.dialog.isChoosing && t.ui.dialog.close(), !0;
	}
	get ownsCamera() {
		return !!this._cam;
	}
	_camSession() {
		if (this._cam) return this._cam;
		let t = this.game, n = t.rig;
		this._cam = {
			proxy: null,
			from: new e(),
			to: null,
			t: 0,
			dur: 0,
			resetting: !1,
			resolve: null,
			saved: {
				lookAhead: n.lookAhead,
				bounds: { ...n.bounds }
			},
			up: .9
		}, n.lookAhead = 0;
		let r = t.level.width, i = t.level.depth;
		return n.bounds = {
			minX: -4,
			maxX: r + 4,
			minZ: -4,
			maxZ: i + 4
		}, this._cam;
	}
	_cameraTo(e, n, { chest: r = !1 } = {}) {
		let i = this.game, a = i.rig, o = this._camSession();
		if (!o.proxy) {
			let e = new t();
			e.position.copy(a.focusPoint), r && (e.position.y -= a.targetOffsetY ?? 0), o.proxy = e, a.setTarget(e), i.lighting.followTarget(e);
		}
		return o.resolve?.(), o.resolve = null, o.from.copy(o.proxy.position), o.up = r ? 0 : .9, o.to = e, o.t = 0, o.dur = Math.max(0, n), o.resetting = !1, o.dur === 0 ? (this._updateCamera(0), Promise.resolve()) : new Promise((e) => {
			o.resolve = () => e();
		});
	}
	_cameraReset(e) {
		let t = this._cam;
		if (!t) return Promise.resolve();
		t.resolve?.(), t.resolve = null;
		let n = Math.max(0, e);
		if (t.proxy) {
			let e = this.game.player.position, n = t.saved.bounds;
			t.from.copy(t.proxy.position), t.to = {
				x: Math.min(n.maxX, Math.max(n.minX, e.x)),
				z: Math.min(n.maxZ, Math.max(n.minZ, e.z))
			};
		} else t.to = null;
		t.t = 0, t.dur = n, t.resetting = !0;
		let r = this.game.rig;
		return r.framed && r.resetFraming(n), new Promise((e) => {
			t.resolve = e, n === 0 && this._updateCamera(0);
		});
	}
	_cameraRestore({ ease: e = 0 } = {}) {
		let t = this._cam;
		if (!t) return;
		let n = this.game, r = n.rig;
		r.lookAhead = t.saved.lookAhead, r.bounds = { ...t.saved.bounds }, r.setTarget(n.player.sprite), n.lighting.followTarget(n.player.sprite), r.framed && (e > 0 ? r.resetFraming(e) : r.endFraming()), this._cam = null, t.resolve?.();
	}
	_updateCamera(e) {
		let t = this._cam;
		if (!t) return;
		let n = t.to;
		if (t.proxy && n?.foe && !n.foe.alive && n.group) {
			let e = this._groupFoe(n.group);
			e && e !== n.foe && (n.foe = e, n.object = e.sprite, t.t >= t.dur && (t.from.copy(t.proxy.position), t.t = 0, t.dur = on));
		}
		t.t = Math.min(t.dur, t.t + e);
		let r = t.dur > 0 ? t.t / t.dur : 1, i = r * r * (3 - 2 * r);
		if (t.proxy && n) {
			let e, r, a;
			n.object ? (n.object.getWorldPosition(t.proxy.position), e = t.proxy.position.x, r = t.proxy.position.y + t.up, a = t.proxy.position.z) : (e = n.x, a = n.z, r = this.game.tileMap.getHeight(n.x, n.z)), t.proxy.position.set(t.from.x + (e - t.from.x) * i, t.from.y + (r - t.from.y) * i, t.from.z + (a - t.from.z) * i);
		}
		if (r >= 1) {
			let e = t.resolve;
			t.resolve = null, t.resetting && this._cameraRestore(), e?.();
		}
	}
	_parse(e, t, n) {
		let r = `${e}\u0000${p(t).join("\n")}`, i = this._parsed.get(r);
		if (!i) {
			i = qe(t);
			for (let e of i.errors) this.errors++, console.warn(`[Luminati] story: ${n}:${e.line}: ${e.msg}`);
			this._parsed.set(r, i);
		}
		return i;
	}
	_script(e) {
		let t = s(this.story?.scripts ?? {}, e);
		return t ? this._parse(`script:${e}`, t.lines, `${t.file} › ${e} (from line ${t.line})`) : null;
	}
	_stageText(e, t, n) {
		let r = s(this.story?.quests ?? {}, e)?.stages.find((e) => e.id === n), i = r?.text;
		if (i) return L(w(r.textKey ?? "", i), this.reader);
		let a = Object.hasOwn(t.texts, n) ? t.texts[n] : "";
		if (!a) return "";
		let o = t.keys && Object.hasOwn(t.keys, n) ? t.keys[n] : "", c = t.src && Object.hasOwn(t.src, n) ? t.src[n] : null;
		return o && c !== null ? a === c ? w(o, c) : a : w(o, a);
	}
	journalData() {
		let e = this.state, t = this.story?.quests ?? {};
		return {
			quests: Object.entries(e.quests).map(([e, n]) => {
				let r = s(t, e);
				return {
					id: e,
					title: C(this.questTitle(e)),
					state: n.state,
					text: r ? w(r.textKey ?? "", r.text) : "",
					log: n.log.map((t) => this._stageText(e, n, t)).filter(Boolean),
					goals: (r?.goals ?? []).map((e) => ({
						text: L(w(e.textKey ?? "", e.text), this.reader),
						done: !!e.done && this.test(e.done)
					}))
				};
			}),
			items: Object.entries(e.items).map(([e, t]) => {
				let n = s(this.story?.items ?? {}, e);
				return {
					id: e,
					name: C(this.itemName(e)),
					count: t,
					text: n ? w(n.textKey ?? "", n.text) : "",
					key: !!n?.key
				};
			}),
			gold: this.gold
		};
	}
	info() {
		return {
			level: this.levelId,
			vars: { ...this.state.vars },
			items: { ...this.state.items },
			gold: this.gold,
			quests: Object.fromEntries(Object.entries(this.state.quests).map(([e, t]) => [e, {
				state: t.state,
				stage: t.stage
			}])),
			day: this.state.day,
			done: [...this.state.done],
			running: this.run ? this.run.key : "",
			queued: this.queue.map((e) => e.key),
			background: this.bgRuns.map((e) => e.key),
			backgroundQueued: this.bgQueue.map((e) => e.key),
			events: this.events.map((e) => ({
				id: e.obj.id,
				on: e.obj.on,
				present: this.present(e.obj),
				done: this.state.isDone(e.key)
			})),
			ownsCamera: this.ownsCamera,
			errors: this.errors,
			ending: this.state.ending,
			cine: this.cineInfo()
		};
	}
	cineInfo() {
		let e = this.game, t = this._cine?.title;
		return {
			framed: !!e.rig?.framed,
			orbit: e.rig?.orbitRate ?? 0,
			timeScale: e.engine?.time?.timeScale ?? 1,
			title: t ? t.phase : "gone",
			titleTexts: t?.active ? t.texts : null,
			flash: this._cine?.flash.color ?? "",
			poses: [...this._poses].map(([t, n]) => `${t === e.player ? "player" : t.id}:${n.name}`),
			effects: Et(e),
			follows: this._cam?.to?.foe?.uid ?? ""
		};
	}
	get hooks() {
		return {
			info: () => this.info(),
			get: (e) => this.state.get(String(e)),
			set: (e, t = 1) => Number(t) === 1 || Number(t) === 0 ? this.state.setFlag(String(e), Number(t) === 1) : this.state.setVar(String(e), Number(t)),
			holds: (e) => this.holds(String(e)),
			give: (e, t = 1) => (String(e) === "gold" ? this._items("gold", Number(t), { fast: !0 }) : this.state.addItem(String(e), Number(t)), this.state.count(String(e))),
			run: (e) => {
				let t = qe(e);
				if (t.errors.length) return console.warn("[Luminati] story: test script:", t.errors), Promise.resolve(!1);
				let n = `test:${Math.round(performance.now())}`;
				return this.enqueue({
					kind: "test",
					key: n,
					nodes: t.nodes
				}), new Promise((e) => {
					let t = () => this.run?.key === n || this.queue.some((e) => e.key === n) ? setTimeout(t, 50) : e(!0);
					setTimeout(t, 50);
				});
			},
			fire: (e) => {
				let t = this.events.find((t) => t.obj.id === e);
				if (!t) return !1;
				let n = {
					kind: "event",
					key: `event:${t.key}`,
					nodes: t.nodes,
					onceKey: t.obj.once ? t.key : ""
				};
				return t.obj.background === !0 ? this._enqueueBg(n) : this.enqueue(n), !0;
			},
			seed: (e) => (e !== void 0 && Number.isInteger(Number(e)) && Number(e) > 0 && (this.state.seed = Number(e) >>> 0), this.state.seed),
			auto: (e = !0) => {
				this._auto = e === !1 ? null : Array.isArray(e) ? e.map(Number) : [];
			},
			skip: () => this.skip(),
			trace: () => [...this._trace],
			journal: () => this.journalData()
		};
	}
	dispose() {
		this.detachLevel(), this._endUntils(), this.queue.length = 0, this.bgQueue.length = 0, this._cam = null, this._actorSheets.clear(), this._cine?.title.dispose(), this._cine?.flash.dispose(), this._cine = null;
	}
};
//#endregion
export { _n as StoryRunner, _t as StoryState, at as journeySeed };
