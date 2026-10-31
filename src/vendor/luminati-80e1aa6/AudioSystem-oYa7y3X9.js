import { a as e, d as t } from "./math-Du_SWpiD.js";
import { i as n } from "./own-rp3p7qEo.js";
Object.freeze([
	"step",
	"blip",
	"confirm",
	"cancel",
	"open",
	"close",
	"chime",
	"splash"
]);
var r = Object.freeze(/* @__PURE__ */ "swing.swingHeavy.hit.crit.hurt.dodge.perfect.whirl.bolt.boltHit.nova.drink.guard.enemyAlert.windup.arrow.arrowHit.hexBurst.slimeHop.batScreech.boarSnort.boarCharge.stun.enemyDie.bossRoar.slam.rockToss.gateClose.pickup.coin.chestOpen.waystone.levelup.playerDown.heartbeat".split(".")), i = Object.freeze(/* @__PURE__ */ "roar.roarFar.wingbeat.fireballFall.explosion.fireRoar.breath.quake.swordWave.bladeStorm.skyfall.holyBolt.holyPillar.sanctuary.iceShard.blizzard.iceSpike.freeze.shieldBash.taunt.earthshatter.ward.cheer.firework.scream.growl.yip.screech.cackle.crash.wallHit".split(".")), a = Object.freeze("bellToll bellTollBlack waysideChime thawSweep iceCrack iceBreak drip fallsBreak millStart wolfHowl crowCaw crowFlock gulletRoar tentacleSlam hammerHit hammerSlam peal tollBell carillon markPop reap hushToll crownShatter tuningFork memoryChime gullCry windGust braziersLit stagBellow motif bellTollFar hushSeal wolfSnarl frostBreath shardSpit cantorHush".split(" ")), o = new Set(r), s = new Set(i), c = new Set(a), l = Object.freeze([
	"emberfall",
	"battle",
	"boss",
	"dread",
	"siege",
	"ascent",
	"dragon",
	"festival",
	"triumph"
]), u = Object.freeze([
	"hush",
	"waking",
	"tides",
	"harvest",
	"rimeholt",
	"hushfight",
	"guardian",
	"hushedking",
	"firstspring"
]), d = Object.freeze(["victory", "levelup"]), f = Object.freeze([
	"wind",
	"birds",
	"crickets",
	"fire",
	"water",
	"crowd",
	"blaze"
]), p = Object.freeze([
	"surf",
	"howl",
	"icebed"
]), m = [...f, ...p], h = (e) => 440 * 2 ** ((e - 69) / 12), g = {
	wind: .62,
	birds: 1.5,
	crickets: .95,
	fire: .29,
	water: .62,
	crowd: .3,
	blaze: .38
}, _ = {
	music: 2.4,
	sfx: 1.9,
	amb: 1.5
}, v = {
	step: .045,
	blip: .018,
	confirm: .05,
	cancel: .05,
	open: .08,
	close: .08,
	chime: .1,
	splash: .08,
	swing: .04,
	swingHeavy: .05,
	hit: .03,
	crit: .04,
	hurt: .06,
	dodge: .05,
	perfect: .06,
	whirl: .06,
	bolt: .05,
	boltHit: .04,
	nova: .06,
	drink: .06,
	guard: .04,
	enemyAlert: .05,
	windup: .05,
	arrow: .04,
	arrowHit: .04,
	hexBurst: .05,
	slimeHop: .04,
	batScreech: .05,
	boarSnort: .06,
	boarCharge: .06,
	stun: .06,
	enemyDie: .04,
	bossRoar: .06,
	slam: .06,
	rockToss: .05,
	gateClose: .06,
	pickup: .035,
	coin: .03,
	chestOpen: .06,
	waystone: .06,
	levelup: .06,
	playerDown: .06,
	heartbeat: .06,
	roar: .25,
	roarFar: .25,
	wingbeat: .12,
	fireballFall: .05,
	explosion: .06,
	fireRoar: .08,
	breath: .2,
	quake: .2,
	swordWave: .08,
	bladeStorm: .1,
	skyfall: .2,
	holyBolt: .05,
	holyPillar: .08,
	sanctuary: .2,
	iceShard: .05,
	blizzard: .2,
	iceSpike: .1,
	freeze: .06,
	shieldBash: .05,
	taunt: .2,
	earthshatter: .2,
	ward: .2,
	cheer: .3,
	firework: .08,
	scream: .08,
	growl: .08,
	yip: .05,
	screech: .06,
	cackle: .1,
	crash: .15,
	wallHit: .04
}, y = /* @__PURE__ */ new Set([
	"perfect",
	"nova",
	"drink",
	"hexBurst",
	"bossRoar",
	"slam",
	"gateClose",
	"chestOpen",
	"waystone",
	"levelup",
	"playerDown"
]), b = .35, x = 40, S = 32e3, C = 96, w = {
	Dm: {
		bass: 38,
		arp: [
			50,
			57,
			62,
			64,
			65,
			69
		],
		pad: [
			50,
			57,
			64,
			65
		]
	},
	C: {
		bass: 36,
		arp: [
			48,
			55,
			60,
			62,
			64,
			67
		],
		pad: [
			48,
			55,
			62,
			64
		]
	},
	G: {
		bass: 43,
		arp: [
			50,
			55,
			59,
			62,
			67,
			71
		],
		pad: [
			50,
			55,
			59,
			62
		]
	},
	F: {
		bass: 41,
		arp: [
			53,
			57,
			60,
			64,
			65,
			69
		],
		pad: [
			53,
			57,
			60,
			64
		]
	},
	Am: {
		bass: 45,
		arp: [
			52,
			57,
			60,
			64,
			69,
			72
		],
		pad: [
			52,
			57,
			60,
			64
		]
	},
	D: {
		bass: 38,
		arp: [
			50,
			57,
			62,
			64,
			66,
			69
		],
		pad: [
			50,
			57,
			64,
			66
		]
	},
	Em: {
		bass: 40,
		arp: [
			52,
			59,
			62,
			64,
			67,
			71
		],
		pad: [
			52,
			59,
			62,
			67
		]
	}
}, T = [
	"Dm",
	"C",
	"G",
	"Dm",
	"F",
	"C",
	"G",
	"Am"
], E = [
	"D",
	"C",
	"G",
	"D",
	"Em",
	"G",
	"C",
	"D"
], D = [
	[
		0,
		0,
		2,
		69
	],
	[
		0,
		2,
		1,
		74
	],
	[
		0,
		3,
		1,
		76
	],
	[
		1,
		0,
		1.5,
		77
	],
	[
		1,
		1.5,
		.5,
		76
	],
	[
		1,
		2,
		1,
		74
	],
	[
		1,
		3,
		1,
		72
	],
	[
		2,
		0,
		3,
		74
	],
	[
		2,
		3,
		1,
		71
	],
	[
		3,
		0,
		4,
		69
	],
	[
		4,
		0,
		1,
		72
	],
	[
		4,
		1,
		1,
		74
	],
	[
		4,
		2,
		1,
		77
	],
	[
		4,
		3,
		1,
		81
	],
	[
		5,
		0,
		2,
		79
	],
	[
		5,
		2,
		1,
		76
	],
	[
		5,
		3,
		1,
		72
	],
	[
		6,
		0,
		1.5,
		74
	],
	[
		6,
		1.5,
		.5,
		76
	],
	[
		6,
		2,
		1,
		74
	],
	[
		6,
		3,
		1,
		71
	],
	[
		7,
		0,
		3,
		69
	],
	[
		8,
		0,
		1,
		74
	],
	[
		8,
		1,
		1,
		78
	],
	[
		8,
		2,
		2,
		81
	],
	[
		9,
		0,
		1.5,
		79
	],
	[
		9,
		1.5,
		.5,
		76
	],
	[
		9,
		2,
		2,
		72
	],
	[
		10,
		0,
		1,
		71
	],
	[
		10,
		1,
		1,
		74
	],
	[
		10,
		2,
		1,
		79
	],
	[
		10,
		3,
		1,
		78
	],
	[
		11,
		0,
		1,
		76
	],
	[
		11,
		1,
		1,
		74
	],
	[
		11,
		2,
		2,
		69
	],
	[
		12,
		0,
		1.5,
		79
	],
	[
		12,
		1.5,
		.5,
		78
	],
	[
		12,
		2,
		1,
		76
	],
	[
		12,
		3,
		1,
		71
	],
	[
		13,
		0,
		2,
		74
	],
	[
		13,
		2,
		1,
		71
	],
	[
		13,
		3,
		1,
		74
	],
	[
		14,
		0,
		1,
		76
	],
	[
		14,
		1,
		1,
		79
	],
	[
		14,
		2,
		1,
		76
	],
	[
		14,
		3,
		1,
		72
	],
	[
		15,
		0,
		4,
		74
	]
], O = [
	[
		0,
		1,
		2,
		3,
		4,
		5,
		4,
		3,
		2,
		3,
		2,
		1
	],
	[
		0,
		2,
		1,
		3,
		2,
		4,
		3,
		5,
		4,
		3,
		2,
		1
	],
	[
		0,
		1,
		2,
		3,
		4,
		5,
		5,
		4,
		3,
		2,
		1,
		2
	]
];
function k(e, n, r) {
	let i = t(r), a = [];
	if (e.forEach((e, t) => {
		let n = w[e], r = t * 4;
		a.push({
			beat: r,
			kind: "pad",
			notes: n.pad,
			dur: 4
		}), a.push({
			beat: r,
			kind: "harp",
			midi: n.bass,
			vel: .85,
			pan: -.1
		}), a.push({
			beat: r + 2,
			kind: "harp",
			midi: n.bass + (t % 2 ? 12 : 7),
			vel: .45,
			pan: -.1
		});
		let o = O[t % 4 == 3 ? 2 : t % 2];
		for (let e = 0; e < 12; e++) {
			let t = o[e], s = e % 3 == 0 ? .72 : .5;
			a.push({
				beat: r + e / 3,
				kind: "harp",
				midi: n.arp[t],
				vel: s * (.88 + i() * .24),
				pan: -.35 + t / 5 * .7,
				jitter: (i() - .5) * .012
			});
		}
	}), n) for (let [e, t, r, o] of n) a.push({
		beat: e * 4 + t,
		kind: "flute",
		midi: o,
		dur: r,
		vel: .85 + i() * .15
	});
	return a.sort((e, t) => e.beat - t.beat), {
		events: a,
		lengthBeats: e.length * 4
	};
}
var A = {
	Dm: {
		bass: 38,
		arp: [
			50,
			53,
			57,
			62,
			65,
			69
		],
		pad: [
			50,
			57,
			62,
			65
		]
	},
	Bb: {
		bass: 34,
		arp: [
			46,
			50,
			53,
			58,
			62,
			65
		],
		pad: [
			46,
			53,
			58,
			62
		]
	},
	C: {
		bass: 36,
		arp: [
			48,
			52,
			55,
			60,
			64,
			67
		],
		pad: [
			48,
			55,
			60,
			64
		]
	},
	Gm: {
		bass: 43,
		arp: [
			50,
			55,
			58,
			62,
			67,
			70
		],
		pad: [
			50,
			55,
			58,
			62
		]
	},
	A: {
		bass: 33,
		arp: [
			45,
			49,
			52,
			57,
			61,
			64
		],
		pad: [
			49,
			52,
			57,
			61
		]
	},
	Cm: {
		bass: 36,
		arp: [
			48,
			51,
			55,
			60,
			63,
			67
		],
		pad: [
			48,
			55,
			60,
			63
		]
	},
	Db: {
		bass: 37,
		arp: [
			49,
			53,
			56,
			61,
			65,
			68
		],
		pad: [
			49,
			56,
			61,
			65
		]
	},
	Ab: {
		bass: 32,
		arp: [
			44,
			48,
			51,
			56,
			60,
			63
		],
		pad: [
			48,
			51,
			56,
			60
		]
	},
	Bbm: {
		bass: 34,
		arp: [
			46,
			49,
			53,
			58,
			61,
			65
		],
		pad: [
			46,
			53,
			58,
			61
		]
	},
	Fm: {
		bass: 41,
		arp: [
			48,
			53,
			56,
			60,
			65,
			68
		],
		pad: [
			48,
			53,
			56,
			60
		]
	},
	C5: {
		bass: 36,
		arp: [
			48,
			55,
			60,
			67,
			72,
			79
		],
		pad: [
			48,
			55,
			60,
			67
		]
	}
}, j = {
	battle: {
		title: "Ashes on the Wind",
		bpm: 132,
		seed: 42469,
		order: "alternate",
		start: "A",
		sections: {
			A: {
				prog: [
					"Dm",
					"Dm",
					"Bb",
					"C",
					"Dm",
					"Dm",
					"Gm",
					"A"
				],
				bass: [
					0,
					0,
					12,
					0,
					7,
					0,
					12,
					7
				],
				bassVel: [
					1,
					.55,
					.8,
					.55,
					.9,
					.55,
					.8,
					.62
				],
				drums: [
					1,
					.3,
					.5,
					.3,
					.85,
					.3,
					.55,
					.4
				],
				harp: {
					step: .5,
					pat: [
						0,
						1,
						2,
						3,
						4,
						3,
						2,
						1
					],
					vel: .5
				},
				melody: [
					[
						4,
						0,
						1,
						62
					],
					[
						4,
						1,
						1,
						65
					],
					[
						4,
						2,
						2,
						69
					],
					[
						5,
						0,
						1.5,
						69
					],
					[
						5,
						1.5,
						.5,
						67
					],
					[
						5,
						2,
						2,
						65
					],
					[
						6,
						0,
						2,
						67
					],
					[
						6,
						2,
						2,
						70
					],
					[
						7,
						0,
						3,
						69
					],
					[
						7,
						3,
						1,
						61
					]
				]
			},
			B: {
				prog: [
					"Bb",
					"C",
					"Dm",
					"Dm",
					"Gm",
					"Bb",
					"A",
					"A"
				],
				bass: [
					0,
					12,
					0,
					12,
					7,
					12,
					0,
					7
				],
				bassVel: [
					1,
					.6,
					.75,
					.6,
					.9,
					.6,
					.8,
					.7
				],
				drums: [
					1,
					.4,
					.6,
					.75,
					.9,
					.4,
					.7,
					.85
				],
				harp: {
					step: .25,
					pat: [
						0,
						2,
						1,
						3,
						2,
						4,
						3,
						5,
						4,
						3,
						5,
						2,
						4,
						1,
						3,
						2
					],
					vel: .42
				},
				fill: !0,
				melody: [
					[
						0,
						0,
						1.5,
						70
					],
					[
						0,
						1.5,
						.5,
						69
					],
					[
						0,
						2,
						2,
						65
					],
					[
						1,
						0,
						1.5,
						67
					],
					[
						1,
						1.5,
						.5,
						69
					],
					[
						1,
						2,
						2,
						72
					],
					[
						2,
						0,
						3,
						74
					],
					[
						2,
						3,
						1,
						72
					],
					[
						3,
						0,
						1,
						69
					],
					[
						3,
						1,
						1,
						72
					],
					[
						3,
						2,
						2,
						74
					],
					[
						4,
						0,
						1.5,
						74
					],
					[
						4,
						1.5,
						.5,
						72
					],
					[
						4,
						2,
						1,
						70
					],
					[
						4,
						3,
						1,
						67
					],
					[
						5,
						0,
						2,
						70
					],
					[
						5,
						2,
						1,
						74
					],
					[
						5,
						3,
						1,
						77
					],
					[
						6,
						0,
						3,
						76
					],
					[
						6,
						3,
						1,
						73
					],
					[
						7,
						0,
						2,
						69
					],
					[
						7,
						2,
						2,
						64
					]
				]
			}
		}
	},
	boss: {
		title: "Heart of Cinders",
		bpm: 140,
		seed: 49619,
		order: "hold",
		start: "A",
		sections: {
			A: {
				prog: [
					"Cm",
					"Db",
					"Cm",
					"Db",
					"Ab",
					"Bbm",
					"Db",
					"Cm"
				],
				bass: [
					0,
					0,
					12,
					0,
					0,
					12,
					7,
					12
				],
				bassVel: [
					1,
					.5,
					.75,
					.5,
					.95,
					.75,
					.6,
					.75
				],
				drums: [
					1,
					.25,
					.3,
					.6,
					.9,
					.25,
					.6,
					.35
				],
				harp: {
					step: .5,
					pat: [
						0,
						2,
						1,
						3,
						2,
						4,
						3,
						1
					],
					vel: .46
				},
				melody: [
					[
						0,
						0,
						2,
						72
					],
					[
						0,
						2,
						1,
						73
					],
					[
						0,
						3,
						1,
						72
					],
					[
						1,
						0,
						3,
						68
					],
					[
						1,
						3,
						1,
						70
					],
					[
						2,
						0,
						2,
						67
					],
					[
						2,
						2,
						2,
						63
					],
					[
						3,
						0,
						4,
						65
					],
					[
						4,
						0,
						2,
						72
					],
					[
						4,
						2,
						1,
						75
					],
					[
						4,
						3,
						1,
						72
					],
					[
						5,
						0,
						2,
						73
					],
					[
						5,
						2,
						2,
						70
					],
					[
						6,
						0,
						1,
						68
					],
					[
						6,
						1,
						1,
						70
					],
					[
						6,
						2,
						1,
						72
					],
					[
						6,
						3,
						1,
						73
					],
					[
						7,
						0,
						4,
						72
					]
				]
			},
			B: {
				prog: [
					"Cm",
					"Cm",
					"Db",
					"Db",
					"Fm",
					"Ab",
					"Db",
					"C5"
				],
				bass: [
					0,
					12,
					0,
					12,
					0,
					12,
					7,
					12
				],
				bassVel: [
					1,
					.7,
					.85,
					.7,
					1,
					.7,
					.85,
					.8
				],
				drums: [
					1,
					.5,
					.7,
					.5,
					1,
					.5,
					.8,
					.9
				],
				harp: {
					step: .25,
					pat: [
						0,
						2,
						4,
						5,
						3,
						1,
						2,
						4,
						5,
						4,
						2,
						3,
						1,
						2,
						4,
						3
					],
					vel: .4
				},
				fill: !0,
				melody: [
					[
						0,
						0,
						1,
						75
					],
					[
						0,
						1,
						1,
						73
					],
					[
						0,
						2,
						2,
						72
					],
					[
						1,
						0,
						1.5,
						79
					],
					[
						1,
						1.5,
						.5,
						77
					],
					[
						1,
						2,
						2,
						75
					],
					[
						2,
						0,
						2,
						77
					],
					[
						2,
						2,
						2,
						80
					],
					[
						3,
						0,
						3,
						77
					],
					[
						3,
						3,
						1,
						73
					],
					[
						4,
						0,
						2,
						77
					],
					[
						4,
						2,
						1,
						75
					],
					[
						4,
						3,
						1,
						72
					],
					[
						5,
						0,
						2,
						75
					],
					[
						5,
						2,
						2,
						72
					],
					[
						6,
						0,
						1,
						73
					],
					[
						6,
						1,
						1,
						75
					],
					[
						6,
						2,
						1,
						77
					],
					[
						6,
						3,
						1,
						80
					],
					[
						7,
						0,
						4,
						79
					]
				]
			}
		}
	}
}, M = Object.freeze({
	dread: ["A", "B"],
	siege: ["A", "B"],
	ascent: ["A", "B"],
	dragon: [
		"A",
		"B",
		"C"
	],
	festival: ["A", "B"],
	triumph: ["A", "B"]
}), N = null, P = null;
function F() {
	return N ??= import("./VanquishAudio-Dnekf92h.js").then((e) => P = e), N;
}
var I = null, L = null;
function R() {
	return I ??= import("./EvermereAudio-DMDMwtcP.js").then((e) => L = e), I;
}
var z = (e) => Object.hasOwn(M, e) ? "vq" : u.includes(e) ? "ev" : null, B = (e) => e === "ev" ? L : P, V = "[AudioSystem] campaign audio:", H = (e) => e === "ev" ? R() : F(), U = (e) => e.split(".")[0], W = {
	vq: /* @__PURE__ */ new Map(),
	ev: /* @__PURE__ */ new Map()
}, G = Object.freeze({
	siege: Object.freeze({
		explore: "A",
		battle: "B",
		phases: Object.freeze(["B"])
	}),
	ascent: Object.freeze({
		explore: "A",
		battle: "B",
		phases: Object.freeze(["B"])
	}),
	dragon: Object.freeze({
		explore: "A",
		battle: "A",
		phases: Object.freeze([
			"A",
			"B",
			"C"
		])
	})
});
function K(e, t) {
	let n = [], r = e.prog.length;
	e.prog.forEach((i, a) => {
		let o = A[i], s = a * 4;
		n.push({
			beat: s,
			kind: "pad",
			notes: o.pad,
			dur: 4
		});
		for (let i = 0; i < 8; i++) {
			n.push({
				beat: s + i * .5,
				kind: "bass",
				midi: o.bass + e.bass[i],
				dur: .4,
				vel: e.bassVel[i] * (.92 + t() * .16)
			});
			let c = e.drums[i], l = e.fill && a === r - 1 && i >= 4;
			c > 0 && !l && n.push({
				beat: s + i * .5,
				kind: "taiko",
				big: i % 4 == 0,
				vel: c * (.9 + t() * .15)
			});
		}
		if (e.fill && a === r - 1) for (let e = 0; e < 8; e++) n.push({
			beat: s + 2 + e * .25,
			kind: "taiko",
			big: e === 0 || e === 7,
			vel: .35 + e * .09 + t() * .05
		});
		let c = e.harp, l = Math.round(4 / c.step);
		for (let e = 0; e < l; e++) {
			let r = c.pat[e % c.pat.length];
			n.push({
				beat: s + e * c.step,
				kind: "harp",
				midi: o.arp[r],
				vel: c.vel * (e % (l / 4) == 0 ? 1.25 : 1) * (.88 + t() * .24),
				pan: -.35 + r / 5 * .7,
				jitter: (t() - .5) * .008
			});
		}
	});
	for (let [r, i, a, o] of e.melody ?? []) n.push({
		beat: r * 4 + i,
		kind: "flute",
		midi: o,
		dur: a,
		vel: .8 + t() * .15
	});
	return n.sort((e, t) => e.beat - t.beat), {
		events: n,
		lengthBeats: r * 4
	};
}
function q(e) {
	let n = t(e === "victory" ? 20935 : 124897), r = [];
	if (e === "victory") {
		let e = [
			{
				pad: [
					50,
					57,
					62,
					66
				],
				arp: [
					50,
					57,
					62,
					66,
					69,
					74
				]
			},
			{
				pad: [
					50,
					55,
					59,
					62
				],
				arp: [
					43,
					50,
					55,
					59,
					62,
					67
				]
			},
			{
				pad: [
					49,
					52,
					57,
					61
				],
				arp: [
					45,
					52,
					57,
					61,
					64,
					69
				]
			},
			{
				pad: [
					50,
					57,
					62,
					66
				],
				arp: [
					38,
					50,
					57,
					62,
					66,
					69
				]
			}
		], i = [
			0,
			1,
			2,
			3,
			4,
			5,
			4,
			3,
			2,
			3,
			4,
			5
		];
		e.forEach((e, t) => {
			let a = t * 4;
			r.push({
				beat: a,
				kind: "pad",
				notes: e.pad,
				dur: t === 3 ? 6 : 4
			});
			let o = t === 3 ? 6 : 12;
			for (let s = 0; s < o; s++) {
				let o = t === 3 ? s : i[s];
				r.push({
					beat: a + s / 3,
					kind: "harp",
					midi: e.arp[o],
					vel: (s % 3 == 0 ? .7 : .5) * (.9 + n() * .2),
					pan: -.35 + o / 5 * .7
				});
			}
		});
		for (let [e, t, n, i] of [
			[
				0,
				0,
				1,
				74
			],
			[
				0,
				1,
				1,
				78
			],
			[
				0,
				2,
				2,
				81
			],
			[
				1,
				0,
				1.5,
				83
			],
			[
				1,
				1.5,
				.5,
				81
			],
			[
				1,
				2,
				2,
				79
			],
			[
				2,
				0,
				1,
				78
			],
			[
				2,
				1,
				1,
				76
			],
			[
				2,
				2,
				2,
				73
			],
			[
				3,
				0,
				4,
				74
			]
		]) r.push({
			beat: e * 4 + t,
			kind: "flute",
			midi: i,
			dur: n,
			vel: .9
		});
		return r.push({
			beat: 12,
			kind: "bell",
			midi: 86,
			vel: .12
		}), r.push({
			beat: 12.25,
			kind: "bell",
			midi: 93,
			vel: .1
		}), {
			bpm: 108,
			events: r.sort((e, t) => e.beat - t.beat),
			lengthBeats: 16,
			rng: t(20936)
		};
	}
	return [
		62,
		66,
		69,
		74,
		78,
		81,
		86
	].forEach((e, t) => r.push({
		beat: t * .25,
		kind: "harp",
		midi: e,
		vel: .65 + t * .03,
		pan: -.4 + t * .13
	})), r.push({
		beat: 0,
		kind: "pad",
		notes: [
			50,
			57,
			62,
			66
		],
		dur: 3
	}), r.push({
		beat: 1.75,
		kind: "bell",
		midi: 93,
		vel: .13
	}), r.push({
		beat: 1.9,
		kind: "bell",
		midi: 98,
		vel: .1
	}), {
		bpm: 120,
		events: r,
		lengthBeats: 4,
		rng: t(124898)
	};
}
var J = class {
	constructor({ volume: n = .6, musicVolume: r = .5, sfxVolume: i = .85, ambienceVolume: a = .7, reverb: o = .32, suspendWhenHidden: s = !0, bpm: c = 72, context: l = null } = {}) {
		this.ctx = null, this._providedContext = l, this._offline = typeof OfflineAudioContext < "u" && l instanceof OfflineAudioContext, this._volume = e(n, 0, 1), this._muted = !1, this._musicVolume = r, this._sfxVolume = i, this._ambienceVolume = a, this._reverbAmount = o, this._suspendWhenHidden = s, this.bpm = c, this._rng = t(388817), this._ambTargets = {
			wind: 0,
			birds: 0,
			crickets: 0,
			fire: 0,
			water: 0,
			crowd: 0,
			blaze: 0
		}, this._ambFade = 2.5, this._layers = {}, this._musicWanted = !1, this._musicStopped = !1, this._music = null, this._lastSfx = Object.create(null), this._voices = 0, this._harpCache = /* @__PURE__ */ new Map(), this._timer = null, this._disposed = !1, this._hiddenSuspended = !1, this._stepSide = 1, this._intro = k(["Dm", "Dm"], null, 11), this._main = k([...T, ...E], D, 23), this._musicTrackWanted = "emberfall", this._sectionWanted = null, this._tracks = /* @__PURE__ */ new Map(), this._stingers = /* @__PURE__ */ new Map(), this._crng = t(789415), this._cPan = null, this._cBrown = null, this._warnedMusic = null, this._vrng = t(501477), this._vqPrimed = !1, this._musicGate = null, this._musicWaitMs = 0, this._musicGo = null, this._musicFailed = /* @__PURE__ */ new Set(), this._evPrimed = !1, this._tick = this._tick.bind(this), this._onVisibility = this._onVisibility.bind(this);
	}
	unlock() {
		if (this._disposed) return Promise.resolve(!1);
		if (!this.ctx) {
			if (this._providedContext) this.ctx = this._providedContext;
			else {
				let e = typeof window < "u" ? window.AudioContext || window.webkitAudioContext : null;
				if (!e) return Promise.resolve(!1);
				try {
					this.ctx = new e({ latencyHint: "interactive" });
				} catch (e) {
					return console.warn("[AudioSystem] could not create AudioContext:", e), Promise.resolve(!1);
				}
			}
			this._build();
		}
		let e = this.ctx;
		return this._offline ? Promise.resolve(!0) : (e.state === "suspended" ? e.resume() : Promise.resolve()).then(() => this.ready).catch(() => !1);
	}
	get ready() {
		return !!this.ctx && !this._disposed && (this._offline || this.ctx.state === "running");
	}
	get masterVolume() {
		return this._volume;
	}
	set masterVolume(t) {
		this._volume = e(Number(t) || 0, 0, 1), this._applyMaster();
	}
	get muted() {
		return this._muted;
	}
	set muted(e) {
		this._muted = !!e, this._applyMaster();
	}
	get musicVolume() {
		return this._musicVolume;
	}
	set musicVolume(t) {
		this._musicVolume = e(Number(t) || 0, 0, 1), this._buses && this._buses.music.gain.setTargetAtTime(this._musicVolume * _.music, this.ctx.currentTime, .05);
	}
	get sfxVolume() {
		return this._sfxVolume;
	}
	set sfxVolume(t) {
		this._sfxVolume = e(Number(t) || 0, 0, 1), this._buses && this._buses.sfx.gain.setTargetAtTime(this._sfxVolume * _.sfx, this.ctx.currentTime, .05);
	}
	get ambienceVolume() {
		return this._ambienceVolume;
	}
	set ambienceVolume(t) {
		this._ambienceVolume = e(Number(t) || 0, 0, 1), this._buses && this._buses.amb.gain.setTargetAtTime(this._ambienceVolume * _.amb, this.ctx.currentTime, .05);
	}
	get ambience() {
		return { ...this._ambTargets };
	}
	update(e) {
		this.ctx && !this._disposed && this._tick();
	}
	dispose() {
		if (!this._disposed) {
			if (this._disposed = !0, this._timer !== null && clearInterval(this._timer), this._timer = null, typeof document < "u" && document.removeEventListener("visibilitychange", this._onVisibility), this.ctx) {
				for (let e of Object.keys(this._layers)) this._destroyLayer(e);
				this._music && this._stopInstance(this._music, .05), this._music = null;
				let e = this.ctx;
				try {
					this._master.disconnect();
				} catch {}
				!this._offline && !this._providedContext && typeof e.close == "function" && e.close().catch(() => {});
			}
			this._harpCache.clear(), this.ctx = null, this._buses = null;
		}
	}
	playSfx(e, { volume: t = 1, pitch: r = 1, pan: i = 0, delay: a = 0 } = {}) {
		if (!this.ready || this._disposed) return !1;
		let l = this.ctx.currentTime + .005 + Math.max(0, a), u = this._lastSfx[e] ?? -1;
		if (Math.abs(l - u) < (n(v, e) ?? .02) || this._voices > C) return !1;
		this._lastSfx[e] = l;
		let d = Math.max(0, t), f = Math.max(.05, r);
		switch (e) {
			case "step":
				this._sfxStep(l, d, f, i);
				break;
			case "blip":
				this._sfxBlip(l, d, f, i);
				break;
			case "confirm":
				this._sfxConfirm(l, d, f, i);
				break;
			case "cancel":
				this._sfxCancel(l, d, f, i);
				break;
			case "open":
				this._sfxGliss(l, d, f, i, !0);
				break;
			case "close":
				this._sfxGliss(l, d, f, i, !1);
				break;
			case "chime":
				this._sfxChime(l, d, f, i);
				break;
			case "splash":
				this._sfxSplash(l, d, f, i);
				break;
			default:
				if (o.has(e)) {
					this._sfxCombat(e, l, d, f, i);
					break;
				}
				if (s.has(e) || c.has(e)) {
					this._sfxPack(s.has(e) ? "vq" : "ev", e, l, d, f, i);
					break;
				}
				return this._warnedSfx?.has(e) || ((this._warnedSfx ??= /* @__PURE__ */ new Set()).add(e), console.warn(`[AudioSystem] unknown sfx "${e}"`)), !1;
		}
		return !0;
	}
	_sfxStep(t, n, r, i) {
		let a = this.ctx, o = this._rng, s = r * (.82 + o() * .36);
		this._stepSide = -this._stepSide;
		let c = this._panner(e(i + this._stepSide * .12, -1, 1), this._buses.sfx), l = this._noiseSource(this._white, t, o() * 1.5), u = this._biquad("bandpass", 1050 * s, .9), d = this._biquad("highpass", 280, .7), f = a.createGain();
		f.gain.setValueAtTime(0, t), f.gain.linearRampToValueAtTime(.32 * n, t + .003), f.gain.setTargetAtTime(0, t + .006, .02), l.connect(u).connect(d).connect(f).connect(c), l.stop(t + .2);
		let p = a.createOscillator();
		p.type = "sine", p.frequency.setValueAtTime(125 * s, t), p.frequency.exponentialRampToValueAtTime(58 * s, t + .06);
		let m = a.createGain();
		m.gain.setValueAtTime(0, t), m.gain.linearRampToValueAtTime(.22 * n, t + .004), m.gain.setTargetAtTime(0, t + .01, .025), p.connect(m).connect(c), p.start(t), p.stop(t + .2), this._cleanup(l, [
			l,
			u,
			d,
			f,
			p,
			m,
			c
		]);
	}
	_sfxBlip(e, t, n, r) {
		let i = this.ctx, a = 1150 * n * (1 + (this._rng() - .5) * .05), o = this._panner(r, this._buses.sfx), s = this._biquad("lowpass", 2600, .5), c = i.createGain();
		c.gain.setValueAtTime(0, e), c.gain.linearRampToValueAtTime(.085 * t, e + .002), c.gain.setTargetAtTime(0, e + .004, .011);
		let l = i.createOscillator();
		l.type = "triangle", l.frequency.value = a;
		let u = i.createOscillator();
		u.type = "square", u.frequency.value = a * .5;
		let d = i.createGain();
		d.gain.value = .22, l.connect(s), u.connect(d).connect(s), s.connect(c).connect(o), l.start(e), u.start(e), l.stop(e + .09), u.stop(e + .09), this._cleanup(l, [
			l,
			u,
			d,
			s,
			c,
			o
		]);
	}
	_sfxConfirm(e, t, n, r) {
		let i = this._panner(r, this._buses.sfx, .35);
		this._bell(e, h(81) * n, .2 * t, .9, i), this._bell(e + .075, h(88) * n, .18 * t, 1.2, i), this._later(i, e, 2);
	}
	_sfxCancel(e, t, n, r) {
		let i = this.ctx, a = this._panner(r, this._buses.sfx, .15);
		[76, 69].forEach((r, o) => {
			let s = e + o * .075, c = h(r) * n, l = i.createOscillator();
			l.type = "triangle", l.frequency.setValueAtTime(c, s), l.frequency.exponentialRampToValueAtTime(c * .96, s + .14);
			let u = this._biquad("lowpass", 1900, .4), d = i.createGain();
			d.gain.setValueAtTime(0, s), d.gain.linearRampToValueAtTime(.16 * t, s + .005), d.gain.setTargetAtTime(0, s + .02, .05), l.connect(u).connect(d).connect(a), l.start(s), l.stop(s + .35), this._cleanup(l, [
				l,
				u,
				d
			]);
		}), this._later(a, e, 1);
	}
	_sfxGliss(e, t, n, r, i) {
		let a = this._panner(r, this._buses.sfx, .4), o = [
			62,
			64,
			65,
			67,
			69,
			71,
			72,
			74,
			76,
			77,
			79
		], s = i ? o.slice(2) : o.slice(0, 9).reverse(), c = Math.round(12 * Math.log2(n));
		s.forEach((n, r) => {
			let o = (.26 - r * .012) * t, l = (r / (s.length - 1) - .5) * .8 * (i ? 1 : -1);
			this._pluck(e + r * .034, n + c, o, l, a);
		}), this._later(a, e, 3.2);
	}
	_sfxChime(e, t, n, r) {
		let i = this._panner(r, this._buses.sfx, .6);
		[
			86,
			90,
			93,
			98
		].forEach((r, a) => this._bell(e + a * .068, h(r) * n, (.11 - a * .012) * t, 1.4, i));
		let a = this.ctx;
		for (let n = 0; n < 5; n++) {
			let r = e + .05 + n * .05 + this._rng() * .03, o = a.createOscillator();
			o.type = "sine", o.frequency.value = 4200 + this._rng() * 2600;
			let s = a.createGain();
			s.gain.setValueAtTime(0, r), s.gain.linearRampToValueAtTime(.018 * t, r + .004), s.gain.setTargetAtTime(0, r + .008, .05), o.connect(s).connect(i), o.start(r), o.stop(r + .4), this._cleanup(o, [o, s]);
		}
		this._later(i, e, 2.5);
	}
	_sfxSplash(e, t, n, r) {
		let i = this.ctx, a = this._rng, o = this._panner(r, this._buses.sfx, .25), s = this._noiseSource(this._white, e, a() * 1.2), c = this._biquad("lowpass", 6500 * n, .9);
		c.frequency.setValueAtTime(6500 * n, e), c.frequency.exponentialRampToValueAtTime(380 * n, e + .5);
		let l = i.createGain();
		l.gain.setValueAtTime(0, e), l.gain.linearRampToValueAtTime(.42 * t, e + .01), l.gain.setTargetAtTime(0, e + .04, .13), s.connect(c).connect(l).connect(o), s.stop(e + .9), this._cleanup(s, [
			s,
			c,
			l
		]);
		for (let r = 0; r < 6; r++) {
			let r = e + .06 + a() * .4, s = (650 + a() * 900) * n, c = i.createOscillator();
			c.type = "sine", c.frequency.setValueAtTime(s, r), c.frequency.exponentialRampToValueAtTime(s * 1.9, r + .045);
			let l = i.createGain();
			l.gain.setValueAtTime(0, r), l.gain.linearRampToValueAtTime((.03 + a() * .04) * t, r + .004), l.gain.setTargetAtTime(0, r + .02, .015), c.connect(l).connect(o), c.start(r), c.stop(r + .12), this._cleanup(c, [c, l]);
		}
		this._later(o, e, 1.6);
	}
	_bell(e, t, n, r, i) {
		let a = this.ctx, o = [
			[
				1,
				1,
				1
			],
			[
				2,
				.32,
				.6
			],
			[
				2.76,
				.2,
				.45
			],
			[
				5.4,
				.07,
				.25
			]
		], s = a.createGain();
		s.gain.value = n, s.connect(i);
		let c = [s], l = null;
		for (let [n, i, u] of o) {
			let o = a.createOscillator();
			o.type = "sine", o.frequency.value = t * n;
			let d = a.createGain();
			d.gain.setValueAtTime(0, e), d.gain.linearRampToValueAtTime(i, e + .003), d.gain.setTargetAtTime(0, e + .004, r * u / 4), o.connect(d).connect(s), o.start(e), o.stop(e + r * u * 1.4 + .1), c.push(o, d), l ??= o;
		}
		this._cleanup(l, c);
	}
	_combatOut(t, n) {
		if (!this._cPan) {
			let e = this.ctx, t = e.createGain();
			t.gain.value = .35, t.connect(this._reverbIn);
			let n = (n) => Array.from({ length: 9 }, (r, i) => {
				let a = e.createStereoPanner();
				return a.pan.value = -.8 + i * .2, a.connect(this._buses.sfx), n && a.connect(t), a;
			});
			this._cPan = {
				dry: n(!1),
				wet: n(!0)
			};
		}
		let r = Math.round((e(t, -.8, .8) + .8) / .2);
		return (n ? this._cPan.wet : this._cPan.dry)[r];
	}
	_combatBrown() {
		if (this._cBrown) return this._cBrown;
		let e = this.ctx, n = e.sampleRate, r = Math.floor(n * 2), i = e.createBuffer(1, r, n), a = i.getChannelData(0), o = t(45579), s = new Float32Array(r);
		for (let e = 0; e < r; e++) s[e] = o() * 2 - 1;
		let c = 0;
		for (let e = 0; e < 2; e++) for (let e = 0; e < r; e++) c = (c + .02 * s[e]) / 1.02, a[e] = c * 3.5;
		let l = Math.exp(-2 * Math.PI * 35 / n);
		for (let e = 0; e < 2; e++) {
			let e = a[r - 1], t = 0;
			for (let n = 0; n < 2; n++) for (let i = 0; i < r; i++) {
				let r = a[i];
				t = l * (t + r - e), e = r, n && (s[i] = t);
			}
			a.set(s);
		}
		return this._cBrown = i, i;
	}
	_sfxCombat(e, t, n, r, i) {
		let a = this.ctx, o = this._crng, s = this._combatOut(i, y.has(e)), c = [], l = null, u = -Infinity, d = (e, n, i = n, o = .1, s = 0) => {
			let l = a.createOscillator();
			return l.type = e, l.frequency.setValueAtTime(n * r, t + s), i !== n && l.frequency.exponentialRampToValueAtTime(i * r, t + s + o), l.start(t + s), c.push(l), l;
		}, f = (e = 0, n = this._white) => {
			let r = this._noiseSource(n, t + e, o() * 1.9);
			return c.push(r), r;
		}, p = (e, t, n) => {
			let i = this._biquad(e, t * r, n);
			return c.push(i), i;
		}, m = (e, r, i, o, s = 0) => {
			let l = a.createGain();
			return l.gain.value = 0, l.gain.setValueAtTime(0, t + r), l.gain.linearRampToValueAtTime(e * n, t + r + i), l.gain.setTargetAtTime(0, t + r + i + s, o), c.push(l), l;
		}, h = () => {
			let e = a.createGain();
			return e.gain.value = 0, c.push(e), e;
		}, g = (e, r, i, a, o) => {
			r > .006 && e.gain.setTargetAtTime(0, t + r - .006, .0012), e.gain.setValueAtTime(0, t + r), e.gain.linearRampToValueAtTime(i * n, t + r + a), e.gain.setTargetAtTime(0, t + r + a, o);
		}, _ = (e, n) => {
			e.setValueAtTime(n[0][1] * r, t + n[0][0]);
			for (let i = 1; i < n.length; i++) e.exponentialRampToValueAtTime(n[i][1] * r, t + n[i][0]);
		}, v = (e, n) => {
			e.stop(t + n), t + n > u && (u = t + n, l = e);
		}, b = 1 + (o() - .5) * .05;
		switch (e) {
			case "swing": {
				let e = f(), t = p("bandpass", 700, 1.1);
				_(t.frequency, [
					[0, 700 * b],
					[.07, 2600],
					[.16, 1100]
				]), e.connect(t).connect(m(.55, 0, .02, .04)).connect(s), v(e, .3);
				let n = d("triangle", 1250 * b, 1700, .08);
				n.connect(m(.035, 0, .01, .03)).connect(s), v(n, .2);
				break;
			}
			case "swingHeavy": {
				let e = f(), t = p("bandpass", 400, .9);
				_(t.frequency, [
					[0, 400 * b],
					[.12, 1800],
					[.28, 700]
				]), e.connect(t).connect(m(.36, 0, .04, .07)).connect(s), v(e, .55);
				let n = d("sine", 110, 60, .25);
				n.connect(m(.18, .02, .03, .08)).connect(s), v(n, .62);
				break;
			}
			case "hit": {
				let e = d("sine", 170 * b, 52, .09);
				e.connect(m(.55, 0, .003, .05)).connect(s), v(e, .4);
				let t = f();
				t.connect(p("bandpass", 1700, .9)).connect(m(.42, 0, .002, .018)).connect(s), v(t, .15);
				break;
			}
			case "crit": {
				let e = d("sine", 200 * b, 48, .12);
				e.connect(m(.6, 0, .003, .07)).connect(s), v(e, .55);
				let t = m(.33, 0, .002, .09), n = d("triangle", 1480, 1380, .3);
				n.connect(t);
				let r = f();
				r.connect(p("bandpass", 2900, 6)).connect(t), t.connect(s), v(r, .7), v(n, .7);
				break;
			}
			case "hurt": {
				let e = m(.42, 0, .004, .07), t = d("sine", 190 * b, 70, .18), n = d("triangle", 280 * b, 150, .2);
				t.connect(e), n.connect(e), e.connect(s), v(t, .5), v(n, .5);
				let r = f();
				r.connect(p("lowpass", 1100, .7)).connect(m(.3, 0, .002, .04)).connect(s), v(r, .25);
				break;
			}
			case "dodge": {
				let e = f(), t = p("bandpass", 1800, .8);
				_(t.frequency, [[0, 1800 * b], [.18, 700]]), e.connect(t).connect(m(.32, 0, .03, .05)).connect(s), v(e, .4);
				let n = f(.22);
				n.connect(p("lowpass", 900, .7)).connect(m(.2, .22, .005, .03)).connect(s), v(n, .45);
				break;
			}
			case "perfect": {
				let e = m(.113, 0, .005, .35), t = d("sine", 1568), n = d("sine", 2349);
				t.connect(e), n.connect(e), e.connect(s), v(t, 2.5), v(n, 2.5);
				let r = f(), i = p("bandpass", 5e3, 1.5);
				_(i.frequency, [[0, 5e3], [.3, 1500]]), r.connect(i).connect(m(.113, 0, .02, .08)).connect(s), v(r, .6);
				break;
			}
			case "whirl": {
				let e = f(), t = p("bandpass", 1300, 1.4), n = d("sine", 11 / r), i = a.createGain();
				i.gain.value = 700 * r, c.push(i), n.connect(i).connect(t.frequency), e.connect(t).connect(m(.34, 0, .05, .16, .2)).connect(s), v(e, 1.4), v(n, 1.4);
				break;
			}
			case "bolt": {
				let e = f(), t = p("lowpass", 600, .8);
				_(t.frequency, [
					[0, 600],
					[.12, 3500],
					[.35, 1200]
				]), e.connect(t).connect(m(.45, 0, .01, .1)).connect(s), v(e, .75);
				let n = d("triangle", 260 * b, 520, .15);
				n.connect(m(.1, 0, .01, .08)).connect(s), v(n, .6);
				break;
			}
			case "boltHit": {
				let e = f();
				e.connect(p("bandpass", 1100, .7)).connect(m(.4, 0, .002, .07)).connect(s), v(e, .52);
				let t = d("sine", 140 * b, 55, .12);
				t.connect(m(.35, 0, .003, .06)).connect(s), v(t, .45);
				break;
			}
			case "nova": {
				let e = d("sine", 120, 40, .6);
				e.connect(m(.28, 0, .005, .2)).connect(s), v(e, 1.4);
				let t = m(.18, 0, .004, .2), n = f(), r = p("lowpass", 6e3, .7);
				_(r.frequency, [[0, 6e3], [.7, 500]]), n.connect(r).connect(t);
				let i = d("sine", 1175);
				i.connect(t), t.connect(s), v(n, 1.4), v(i, 1.45);
				break;
			}
			case "drink": {
				let e = d("sine", 260), n = e.frequency;
				n.exponentialRampToValueAtTime(420 * r, t + .07), n.setValueAtTime(240 * r, t + .16), n.exponentialRampToValueAtTime(400 * r, t + .23), n.setValueAtTime(250 * r, t + .32), n.exponentialRampToValueAtTime(440 * r, t + .39);
				let i = h();
				for (let e of [
					0,
					.16,
					.32
				]) g(i, e, .22, .012, .03);
				e.connect(p("lowpass", 1200, .7)).connect(i).connect(s), v(e, .6);
				let a = d("sine", 1760, 2640, .2, .5);
				a.connect(m(.06, .5, .01, .15)).connect(s), v(a, 1.4);
				break;
			}
			case "guard": {
				let e = m(.3, 0, .002, .06), t = d("triangle", 760 * b), n = d("triangle", 1190 * b);
				t.connect(e), n.connect(e), e.connect(s), v(t, .45), v(n, .45);
				let r = f();
				r.connect(p("highpass", 3e3, .7)).connect(m(.12, 0, .001, .015)).connect(s), v(r, .1);
				break;
			}
			case "enemyAlert": {
				let e = d("triangle", 880);
				e.frequency.setValueAtTime(1320 * r, t + .07);
				let n = h();
				g(n, 0, .18, .005, .025), g(n, .07, .19, .005, .05), e.connect(p("lowpass", 3e3, .5)).connect(n).connect(s), v(e, .45);
				break;
			}
			case "windup": {
				let e = f(), r = p("bandpass", 300, 1.2);
				_(r.frequency, [[0, 300], [.35, 1400]]);
				let i = h();
				i.gain.setValueAtTime(0, t), i.gain.linearRampToValueAtTime(.24 * n, t + .35), i.gain.setTargetAtTime(0, t + .35, .03), e.connect(r).connect(i).connect(s), v(e, .6);
				let a = d("sine", 70, 120, .35), o = h();
				o.gain.setValueAtTime(0, t), o.gain.linearRampToValueAtTime(.16 * n, t + .35), o.gain.setTargetAtTime(0, t + .35, .04), a.connect(o).connect(s), v(a, .6);
				break;
			}
			case "arrow": {
				let e = d("triangle", 196 * b, 180, .12);
				e.connect(m(.2, 0, .002, .04)).connect(s), v(e, .3);
				let t = f(), n = p("bandpass", 2600, 5);
				_(n.frequency, [[0, 2600], [.2, 3400]]), t.connect(n).connect(m(.12, .02, .02, .07)).connect(s), v(t, .45);
				break;
			}
			case "arrowHit": {
				let e = d("sine", 260 * b, 110, .06);
				e.connect(m(.3, 0, .002, .03)).connect(s), v(e, .2);
				let t = f();
				t.connect(p("bandpass", 900, 1)).connect(m(.26, 0, .001, .015)).connect(s), v(t, .12);
				break;
			}
			case "hexBurst": {
				let e = f(), t = p("lowpass", 400, .8);
				_(t.frequency, [
					[0, 400],
					[.08, 3200],
					[.6, 700]
				]), e.connect(t).connect(m(.42, 0, .01, .15)).connect(s), v(e, 1);
				let n = d("sine", 90, 38, .35);
				n.connect(m(.4, 0, .004, .12)).connect(s), v(n, .8);
				break;
			}
			case "slimeHop": {
				let e = d("sine", 170 * b, 420, .07);
				e.frequency.exponentialRampToValueAtTime(260 * r, t + .14), e.connect(p("lowpass", 1400, .7)).connect(m(.26, 0, .004, .05)).connect(s), v(e, .35);
				let n = f();
				n.connect(p("lowpass", 500, .7)).connect(m(.12, 0, .002, .03)).connect(s), v(n, .2);
				break;
			}
			case "batScreech": {
				let e = d("sine", 3400 * b, 2500, .14), t = d("sine", 70), n = a.createGain();
				n.gain.value = 420 * r, c.push(n), t.connect(n).connect(e.frequency), e.connect(p("bandpass", 2800, 1.2)).connect(m(.11, 0, .004, .05)).connect(s), v(e, .38), v(t, .38);
				break;
			}
			case "boarSnort": {
				let e = f(), t = h();
				g(t, 0, .34, .02, .05), g(t, .18, .28, .02, .06), e.connect(p("bandpass", 430, 3)).connect(t).connect(s), v(e, .62);
				let n = d("sine", 95 * b, 70, .3), r = h();
				g(r, 0, .18, .02, .05), g(r, .18, .15, .02, .06), n.connect(r).connect(s), v(n, .62);
				break;
			}
			case "boarCharge": {
				let e = f(0, this._combatBrown());
				e.connect(p("lowpass", 320, .8)).connect(m(.5, 0, .05, .25, .2)).connect(s), v(e, 2);
				let t = d("triangle", 520 * b, 880, .25);
				t.connect(m(.12, 0, .02, .08)).connect(s), v(t, .6);
				break;
			}
			case "stun": {
				let e = d("triangle", 1500 * b), t = d("sine", 7 / r), n = a.createGain();
				n.gain.value = 300 * r, c.push(n), t.connect(n).connect(e.frequency), e.connect(m(.1, 0, .01, .18, .2)).connect(s), v(e, 1.5), v(t, 1.5);
				break;
			}
			case "enemyDie": {
				let e = f(), t = p("lowpass", 1600, .7);
				_(t.frequency, [[0, 1600], [.35, 300]]), e.connect(t).connect(m(.4, 0, .005, .1)).connect(s), v(e, .65);
				let n = d("triangle", 560 * b, 140, .32);
				n.connect(m(.19, 0, .005, .1)).connect(s), v(n, .65);
				break;
			}
			case "bossRoar": {
				let e = p("lowpass", 450, 2);
				_(e.frequency, [
					[0, 450],
					[.3, 900],
					[1.3, 400]
				]);
				let t = d("sawtooth", 64, 46, 1.3), n = f(0, this._combatBrown());
				t.connect(e), n.connect(e);
				let r = d("sine", 13), i = a.createGain();
				i.gain.value = 250, c.push(i), r.connect(i).connect(e.frequency), e.connect(m(.26, 0, .15, .3, .8)).connect(s), v(t, 3.1), v(n, 3.1), v(r, 3.1);
				break;
			}
			case "slam": {
				let e = d("sine", 95, 32, .5);
				e.connect(m(.49, 0, .004, .18)).connect(s), v(e, 1.3);
				let t = f(), n = p("lowpass", 2400, .7);
				_(n.frequency, [[0, 2400], [.5, 180]]), t.connect(n).connect(m(.35, 0, .002, .14)).connect(s), v(t, 1);
				break;
			}
			case "rockToss": {
				let e = f(), t = p("bandpass", 250, 1);
				_(t.frequency, [[0, 250], [.25, 900]]), e.connect(t).connect(m(.3, 0, .04, .08)).connect(s), v(e, .62);
				let n = d("sine", 70, 55, .2);
				n.connect(m(.18, 0, .01, .08)).connect(s), v(n, .62);
				break;
			}
			case "gateClose": {
				let e = f(0, this._combatBrown()), t = p("lowpass", 200, .9);
				_(t.frequency, [
					[0, 200],
					[.35, 2800],
					[1, 600]
				]), e.connect(t).connect(m(.44, 0, .3, .3)).connect(s), v(e, 2.4);
				let n = d("sine", 62, 45, .4, .3);
				n.connect(m(.44, .3, .004, .2)).connect(s), v(n, 1.75);
				break;
			}
			case "pickup":
				for (let [e, i] of [[0, 81], [.07, 86]]) {
					let o = a.createBufferSource();
					o.buffer = this._harpBuffer(i), o.playbackRate.value = r;
					let l = a.createGain();
					l.gain.value = .3 * n, o.connect(l).connect(s), o.start(t + e), c.push(o, l), v(o, e + o.buffer.duration / r);
				}
				break;
			case "coin": {
				let e = d("triangle", 1976 * b);
				e.frequency.setValueAtTime(2637 * r * b, t + .06);
				let n = d("sine", 3952 * b);
				n.frequency.setValueAtTime(5274 * r * b, t + .06);
				let i = m(.11, 0, .002, .12, .06), a = m(.035, 0, .002, .08, .06);
				e.connect(i).connect(s), n.connect(a).connect(s), v(e, .9), v(n, .9);
				break;
			}
			case "chestOpen": {
				let e = f(), n = p("bandpass", 320, 8);
				_(n.frequency, [[0, 320], [.3, 560]]), e.connect(n).connect(m(.32, 0, .05, .08, .15)).connect(s), v(e, .8);
				let i = d("triangle", 1175), a = h();
				[
					1175,
					1480,
					1760,
					2349
				].forEach((e, n) => {
					i.frequency.setValueAtTime(e * r, t + .3 + n * .08), g(a, .3 + n * .08, .14, .004, n === 3 ? .18 : .05);
				}), i.connect(a).connect(s), v(i, 1.8);
				break;
			}
			case "waystone": {
				let e = m(.14, 0, .03, .45, .1), t = d("sine", 587.3), n = d("sine", 880);
				t.connect(e), n.connect(e), e.connect(s), v(t, 3.3), v(n, 3.3);
				let r = f();
				r.connect(p("bandpass", 4200, 12)).connect(m(.12, 0, .3, .4)).connect(s), v(r, 3.3);
				break;
			}
			case "levelup": {
				let e = h(), n = d("triangle", 587.3), i = d("sine", 1174.7);
				[
					587.3,
					740,
					880,
					1174.7
				].forEach((a, o) => {
					n.frequency.setValueAtTime(a * r, t + o * .09), i.frequency.setValueAtTime(a * 2 * r, t + o * .09), g(e, o * .09, o === 3 ? .113 : .085, .005, o === 3 ? .3 : .06);
				}), n.connect(e), i.connect(e), e.connect(s), v(n, 2.4), v(i, 2.4);
				let a = f(.3);
				a.connect(p("bandpass", 6e3, 3)).connect(m(.056, .3, .02, .2)).connect(s), v(a, 1.75);
				break;
			}
			case "playerDown": {
				let e = d("triangle", 440, 110, .9);
				e.connect(p("lowpass", 1500, .7)).connect(m(.17, 0, .01, .3, .3)).connect(s), v(e, 2.4);
				let t = d("sine", 80, 40, .3);
				t.connect(m(.34, 0, .004, .12)).connect(s), v(t, .9);
				break;
			}
			case "heartbeat": {
				let e = d("sine", 72, 48, .08);
				e.frequency.setValueAtTime(64 * r, t + .19), e.frequency.exponentialRampToValueAtTime(44 * r, t + .27);
				let n = d("triangle", 116, 96, .08), i = h();
				g(i, 0, .5, .01, .05), g(i, .19, .38, .01, .06);
				let a = h();
				g(a, 0, .08, .01, .04), g(a, .19, .06, .01, .05), e.connect(i).connect(s), n.connect(a).connect(s), v(e, .65), v(n, .65);
				break;
			}
		}
		this._cleanup(l, c);
	}
	_sfxPack(e, t, n, r, i, a) {
		let o = B(e);
		o ? o.playSfx(this, t, n, r, i, a) : H(e).then((e) => {
			if (this._disposed || !this.ctx) return;
			let o = this.ctx.currentTime;
			o - n <= .4 && e.playSfx(this, t, Math.max(n, o + .005), r, i, a);
		}), this._packPrime(e);
	}
	primeSfx(e) {
		let t = performance.now();
		return F().then((t) => t.primeSfx(e)).then(() => performance.now() - t);
	}
	get vqRenders() {
		let e = P ?? L;
		return e ? {
			...e.renders(),
			music: {
				...e.musicRenders(),
				waitMs: this._musicWaitMs
			}
		} : {
			buffers: 0,
			bytes: 0,
			mainMs: 0,
			maxBlockMs: 0,
			slow: [],
			music: {
				buffers: 0,
				bytes: 0,
				mainMs: 0,
				maxBlockMs: 0,
				missed: 0,
				waitMs: this._musicWaitMs,
				primed: []
			}
		};
	}
	primeMusic(e) {
		e = U(e);
		let t = z(e);
		return t ? H(t).then((t) => t.primeMusic(e, this)).then((t) => (this._combatTrack(e), t)).catch((t) => (console.error(V, t), {
			ok: !1,
			failed: [e]
		})) : Promise.resolve({
			ok: !0,
			failed: []
		});
	}
	musicReady(e) {
		e = U(e);
		let t = z(e);
		if (!t) return !0;
		let n = B(t);
		return n ? n.musicReady(e) : !1;
	}
	retainMusic(e, t) {
		for (let n of ["vq", "ev"]) {
			let r = t.map(U).filter((e) => z(e) === n), i = B(n);
			if (i) {
				i.retainMusic(e, r);
				continue;
			}
			let a = W[n];
			(r.length || a.has(e)) && (a.size || H(n).then((e) => {
				for (let [t, n] of a) e.retainMusic(t, n);
				a.clear();
			}, (e) => {
				a.clear(), console.error(V, e);
			}), a.set(e, r));
		}
	}
	_vqModule() {
		return F();
	}
	get evPack() {
		return L ?? (R(), null);
	}
	_vqBuffersOf(e) {
		return P ? P.buffersOf(e) : null;
	}
	_packPrime(e) {
		let t = e === "ev" ? "_evPrimed" : "_vqPrimed";
		this[t] || this._disposed || typeof OfflineAudioContext > "u" || (this[t] = !0, H(e).then((e) => e.primeSfx()).catch((e) => console.error(V, e)));
	}
	setAmbience(t = {}, { replace: n = !1, fade: r = 2.5 } = {}) {
		for (let r of m) t[r] === void 0 ? n && r in this._ambTargets && (this._ambTargets[r] = 0) : this._ambTargets[r] = e(Number(t[r]) || 0, 0, 1);
		(this._ambTargets.crowd > .001 || this._ambTargets.blaze > .001) && this._packPrime("vq"), this._ambFade = Math.max(.05, r), this.ctx && !this._disposed && this._applyAmbience();
	}
	_applyAmbience() {
		let e = this.ctx.currentTime, t = this._ambFade / 3;
		for (let n of m) {
			if (!(n in this._ambTargets)) continue;
			let r = this._ambTargets[n], i = this._layers[n];
			r > .001 && !i && (i = this._createLayer(n)), i && (i.gain.gain.cancelScheduledValues(e), i.gain.gain.setValueAtTime(i.gain.gain.value, e), i.gain.gain.setTargetAtTime(r * (g[n] ?? L.LAYER_GAIN[n]), e, t), i.level = r, i.silentAt = r > .001 ? Infinity : e + this._ambFade * 2 + 1);
		}
	}
	_createLayer(e) {
		let t = e === "crowd" || e === "blaze" ? "vq" : p.includes(e) ? "ev" : null;
		if (t && !B(t)) return H(t).then(() => {
			this.ctx && !this._disposed && this._applyAmbience();
		}), null;
		let n = this.ctx, r = n.createGain();
		r.gain.value = 0, r.connect(this._buses.amb);
		let i = {
			name: e,
			gain: r,
			nodes: [r],
			sources: [],
			level: 0,
			silentAt: Infinity,
			next: 0,
			voices: null
		}, a = (...e) => (i.nodes.push(...e), e[0]), o = (e, t = 1, r = 0) => {
			let o = n.createBufferSource();
			return o.buffer = e, o.loop = !0, o.playbackRate.value = t, o.start(n.currentTime, r % e.duration), i.sources.push(o), a(o);
		}, s = (e, t, r, o = "sine") => {
			let s = n.createOscillator();
			s.type = o, s.frequency.value = e;
			let c = n.createGain();
			return c.gain.value = t, s.connect(c).connect(r), s.start(), i.sources.push(s), a(s, c), s;
		}, c = this._rng;
		switch (e) {
			case "wind": {
				let e = o(this._brown, 1, c() * 5), t = a(this._biquad("bandpass", 380, .65)), i = a(n.createGain());
				i.gain.value = .7;
				let l = a(n.createStereoPanner());
				e.connect(t).connect(i).connect(l).connect(r), s(.071, 210, t.frequency), s(.13, .32, i.gain), s(.043, .45, l.pan);
				let u = o(this._white, 1, c() * 1.5), d = a(this._biquad("bandpass", 1300, 5)), f = a(n.createGain());
				f.gain.value = .05, u.connect(d).connect(f).connect(r), s(.052, 420, d.frequency), s(.09, .035, f.gain);
				break;
			}
			case "birds": {
				let e = a(this._biquad("highpass", 1400, .7));
				e.connect(r), i.input = e, i.next = n.currentTime + .3 + c() * .8;
				break;
			}
			case "crickets": {
				i.voices = [
					{
						freq: 4420,
						pan: -.45,
						period: .64,
						pulses: 3,
						amp: .11
					},
					{
						freq: 4780,
						pan: .5,
						period: .83,
						pulses: 4,
						amp: .075
					},
					{
						freq: 3960,
						pan: .05,
						period: 1.07,
						pulses: 2,
						amp: .05
					}
				].map((e) => {
					let t = n.createOscillator();
					t.type = "sine", t.frequency.value = e.freq;
					let o = n.createGain();
					o.gain.value = 0;
					let s = n.createStereoPanner();
					return s.pan.value = e.pan, t.connect(o).connect(s).connect(r), t.start(), i.sources.push(t), a(t, o, s), {
						...e,
						gain: o,
						next: n.currentTime + .1 + c() * .5
					};
				});
				let e = o(this._white, 1, c()), t = a(this._biquad("bandpass", 5200, 4)), l = a(n.createGain());
				l.gain.value = .02, e.connect(t).connect(l).connect(r), s(2.3, .012, l.gain);
				break;
			}
			case "fire": {
				let e = o(this._brown, .8, c() * 5), t = a(this._biquad("lowpass", 170, .7)), l = a(n.createGain());
				l.gain.value = .75, e.connect(t).connect(l).connect(r), s(.31, .18, l.gain), s(.47, .12, l.gain);
				let u = o(this._white, 1, c()), d = a(this._biquad("bandpass", 2600, .6)), f = a(n.createGain());
				f.gain.value = .022, u.connect(d).connect(f).connect(r), s(.9, .012, f.gain);
				let p = a(n.createGain());
				p.gain.value = 1, p.connect(r), i.input = p, i.next = n.currentTime + .05;
				break;
			}
			case "water": {
				let e = o(this._brown, 1.15, c() * 5), t = a(this._biquad("bandpass", 520, .55)), l = a(n.createGain());
				l.gain.value = .62, e.connect(t).connect(l).connect(r), s(.21, 160, t.frequency), s(.17, .12, l.gain);
				let u = o(this._white, 1, c() * 1.5), d = a(this._biquad("bandpass", 1650, 1.3)), f = a(n.createGain());
				f.gain.value = .07, u.connect(d).connect(f).connect(r), s(.33, .035, f.gain), s(.12, 380, d.frequency);
				let p = a(n.createGain());
				p.gain.value = 1, p.connect(r), i.input = p, i.next = n.currentTime + .1;
				break;
			}
			case "crowd":
			case "blaze":
				P.buildLayer(this, e, i, {
					add: a,
					src: o,
					lfo: s
				});
				break;
			default: t && L.buildLayer(this, e, i, {
				add: a,
				src: o,
				lfo: s
			});
		}
		return this._layers[e] = i, i;
	}
	_destroyLayer(e) {
		let t = this._layers[e];
		if (t) {
			for (let e of t.sources) try {
				e.stop();
			} catch {}
			for (let e of t.nodes) e.disconnect();
			t.input && t.input.disconnect(), delete this._layers[e];
		}
	}
	_scheduleAmbience(e) {
		let t = e + b, n = this._rng, r = this._layers, i = r.birds;
		if (i && i.level > .001) for (i.next < e && (i.next = e + .1 + n() * .6); i.next < t;) this._birdCall(i.next, i), i.next += (.9 + n() * 3.4) / (.35 + i.level);
		let a = r.crickets;
		if (a && a.level > .001) for (let r of a.voices) for (r.next < e && (r.next = e + .05 + n() * .2); r.next < t;) {
			let e = r.gain.gain;
			for (let t = 0; t < r.pulses; t++) {
				let n = r.next + t * .046;
				e.setValueAtTime(0, n), e.linearRampToValueAtTime(r.amp, n + .007), e.linearRampToValueAtTime(0, n + .024);
			}
			r.next += r.period * (.96 + n() * .08);
		}
		let o = r.fire;
		if (o && o.level > .001) {
			o.next < e && (o.next = e + n() * .1);
			let r = 4 + 10 * o.level;
			for (; o.next < t;) {
				let e = n() < .25 ? 2 + Math.floor(n() * 3) : 1;
				for (let t = 0; t < e; t++) this._crackle(o.next + t * (.008 + n() * .03), o.input);
				o.next += -Math.log(1 - n() * .999) / r;
			}
		}
		let s = r.water;
		if (s && s.level > .001) {
			s.next < e && (s.next = e + n() * .2);
			let r = 2.5 + 6 * s.level;
			for (; s.next < t;) this._bubble(s.next, s.input), s.next += -Math.log(1 - n() * .999) / r;
		}
		P && (r.crowd || r.blaze) && P.scheduleLayers(this, r, e, t), L?.scheduleLayers(this, r, e, t);
		for (let t in r) {
			let n = r[t];
			n.level <= .001 && e > n.silentAt && this._destroyLayer(t);
		}
	}
	_birdCall(e, t) {
		let n = this.ctx, r = this._rng, i = .35 + r() * .65, a = this._panner((r() - .5) * 1.5, t.input), o = Math.floor(r() * 3), s = [a], c = null, l = (e, t, r, o, l, u = "sine") => {
			let d = n.createOscillator();
			d.type = u, d.frequency.setValueAtTime(t, e), d.frequency.exponentialRampToValueAtTime(r, e + o);
			let f = n.createGain();
			return f.gain.setValueAtTime(0, e), f.gain.linearRampToValueAtTime(l * i, e + Math.min(.012, o * .3)), f.gain.setTargetAtTime(0, e + o * .55, o * .18), d.connect(f).connect(a), d.start(e), d.stop(e + o + .1), s.push(d, f), c = d, d;
		};
		if (o === 0) {
			let t = 4 + Math.floor(r() * 4), n = 3300 + r() * 1100;
			for (let r = 0; r < t; r++) l(e + r * .068, n * (1 - r * .025), n * .74 * (1 - r * .025), .05, .09);
		} else if (o === 1) {
			let t = 2700 + r() * 700;
			l(e, t, t * 1.14, .13, .08), l(e + .2, t * .95, t * .72, .19, .075);
		} else {
			let t = l(e, 3400 + r() * 700, 3e3 + r() * 500, .28, .065), i = n.createOscillator();
			i.frequency.value = 38 + r() * 30;
			let a = n.createGain();
			a.gain.value = 320 + r() * 260, i.connect(a).connect(t.frequency), i.start(e), i.stop(e + .4), s.push(i, a);
		}
		c && this._cleanup(c, s);
	}
	_crackle(e, t) {
		let n = this.ctx, r = this._rng, i = this._noiseSource(this._white, e, r() * 1.8), a = this._biquad("highpass", 1200 + r() * 2800, .8), o = n.createGain(), s = .08 + r() * r() * .5, c = .003 + r() * .01;
		o.gain.setValueAtTime(0, e), o.gain.linearRampToValueAtTime(s, e + 8e-4), o.gain.setTargetAtTime(0, e + .001, c * .4);
		let l = this._panner((r() - .5) * .6, t);
		i.connect(a).connect(o).connect(l), i.stop(e + c + .06), this._cleanup(i, [
			i,
			a,
			o,
			l
		]);
	}
	_bubble(e, t) {
		let n = this.ctx, r = this._rng, i = 480 + r() * 950, a = .03 + r() * .04, o = n.createOscillator();
		o.type = "sine", o.frequency.setValueAtTime(i, e), o.frequency.exponentialRampToValueAtTime(i * (1.4 + r() * .5), e + a);
		let s = n.createGain();
		s.gain.setValueAtTime(0, e), s.gain.linearRampToValueAtTime(.012 + r() * .03, e + .005), s.gain.setTargetAtTime(0, e + a * .5, a * .3);
		let c = this._panner((r() - .5) * 1.2, t);
		o.connect(s).connect(c), o.start(e), o.stop(e + a + .08), this._cleanup(o, [
			o,
			s,
			c
		]);
	}
	startMusic({ fade: e = 2.5, track: t, section: n } = {}) {
		let r = t ?? this._musicTrackWanted, i = U(r);
		if (!l.includes(i) && !u.includes(i)) {
			this._warnMusic(`unknown music track "${i}"`);
			return;
		}
		if (i !== this._musicTrackWanted && (this._musicTrackWanted = i, this._sectionWanted = null), n ??= r.split(".")[1], n && this.setMusicSection(n), this._musicWanted = !0, this._musicStopped = !1, !this.ctx || this._disposed) return;
		let a = this._music;
		if (a && !a.stopping && a.track === i) return;
		let o = z(i);
		if (o) {
			this._packPrime(o);
			let t = B(o);
			if (!t || this._musicGo !== i && !t.musicReady(i)) {
				this._musicGate?.track !== i && (this._musicGate = {
					track: i,
					t0: performance.now()
				}), this.primeMusic(i).then((t) => {
					!this._disposed && this._musicWanted && this._musicTrackWanted === i && B(o) && (t.ok || (this._musicFailed.has(i) || (this._musicFailed.add(i), console.error(`[AudioSystem] "${i}" plays without its failed renders: ${t.failed}`)), this._musicGo = i), this.startMusic({
						track: i,
						fade: e
					}));
				});
				return;
			}
		}
		a && !a.stopping && (this._music = null, this._stopInstance(a, e)), o && (this._musicWaitMs = this._musicGate?.track === i ? Math.round(performance.now() - this._musicGate.t0) : 0, this._musicGo = null), this._musicGate = null;
		let s = this.ctx.currentTime;
		this._music = i === "emberfall" ? this._startSong(s, e) : this._startCombatTrack(i, s, e), this._scheduleMusic(s);
	}
	_startSong(e, t) {
		let n = this.ctx, r = n.createGain();
		r.gain.setValueAtTime(0, e), r.gain.linearRampToValueAtTime(1, e + Math.max(.05, t)), r.connect(this._buses.music);
		let i = n.createGain();
		i.gain.value = .55, r.connect(i).connect(this._reverbIn);
		let a = this._biquad("lowpass", 4200, .5);
		a.connect(r);
		let o = n.createGain();
		o.gain.value = 1, o.connect(r);
		let s = this._biquad("lowpass", 3400, .5);
		s.connect(r);
		let c = {
			out: r,
			send: i,
			harpBus: a,
			padBus: o,
			fluteBus: s,
			section: this._intro,
			sectionStart: e + .15,
			cursor: 0,
			loop: 0,
			stopping: !1,
			track: "emberfall",
			nodes: [
				a,
				o,
				s,
				i,
				r
			],
			sections: null,
			sectionName: null,
			pending: null,
			switchAt: -1,
			lastBeat: -1,
			rng: void 0,
			next: () => this._main
		};
		return Object.defineProperty(c, "bpm", {
			get: () => this.bpm,
			enumerable: !0
		}), c;
	}
	_startCombatTrack(e, t, n) {
		let r = this.ctx, i = this._combatTrack(e), a = r.createGain();
		a.gain.setValueAtTime(0, t), a.gain.linearRampToValueAtTime(1, t + Math.max(.05, n)), a.connect(this._buses.music);
		let o = r.createGain();
		o.gain.value = .4, a.connect(o).connect(this._reverbIn);
		let s = !i.score, c = this._biquad("lowpass", 4600, .5);
		c.connect(a);
		let l = null;
		s && (l = r.createGain(), l.gain.value = .9, l.connect(a));
		let u = this._biquad("lowpass", 3600, .5);
		u.connect(a);
		let d = null, f = null;
		s && (d = r.createGain(), d.gain.value = 1, d.connect(a), f = this._biquad("lowpass", 2200, .6), f.connect(a));
		let p = this._sectionWanted && i.sections[this._sectionWanted] ? this._sectionWanted : i.start, m = {
			out: a,
			send: o,
			harpBus: c,
			padBus: l,
			fluteBus: u,
			drumBus: d,
			bassBus: f,
			section: i.sections[p],
			sectionStart: t + .15,
			cursor: 0,
			loop: 0,
			stopping: !1,
			track: e,
			bpm: i.sections[p].bpm ?? i.bpm,
			nodes: s ? [
				c,
				l,
				u,
				d,
				f,
				o,
				a
			] : [
				c,
				u,
				o,
				a
			],
			sections: i.sections,
			sectionName: p,
			pending: null,
			switchAt: -1,
			lastBeat: -1,
			rng: i.rng,
			next: (e) => (i.order === "alternate" && (e.sectionName = e.sectionName === "A" ? "B" : "A"), i.sections[e.sectionName]),
			faders: [a],
			sources: [],
			held: null
		};
		if (i.score) {
			(P ?? L).scoreBuses(this, m, i.score);
			for (let e of m.faders) e !== a && (e.gain.setValueAtTime(0, t), e.gain.linearRampToValueAtTime(1, t + Math.max(.05, n)));
		}
		return m;
	}
	_combatTrack(e) {
		let n = this._tracks.get(e);
		if (!n) {
			let r = z(e);
			if (r) n = B(r).scoreTrack(e);
			else {
				let r = j[e], i = t(r.seed), a = {};
				for (let e of Object.keys(r.sections)) a[e] = K(r.sections[e], i);
				n = {
					name: e,
					title: r.title,
					bpm: r.bpm,
					order: r.order,
					start: r.start,
					sections: a,
					rng: t(r.seed ^ 1540483477)
				};
			}
			this._tracks.set(e, n);
		}
		return n;
	}
	stopMusic({ fade: e = 2.5 } = {}) {
		this._musicWanted = !1, this._musicStopped = !0;
		let t = this._music;
		t && this.ctx && (this._music = null, this._stopInstance(t, e));
	}
	_stopInstance(e, t) {
		e.stopping = !0;
		let n = this.ctx.currentTime, r = n + Math.max(.05, t);
		for (let t of e.faders ?? [e.out]) {
			let e = t.gain;
			e.cancelScheduledValues(n), e.setValueAtTime(e.value, n), e.linearRampToValueAtTime(0, r);
		}
		for (let t of e.sources ?? []) try {
			t.stop(r + .1);
		} catch {}
		setTimeout(() => {
			for (let t of e.nodes) try {
				t.disconnect();
			} catch {}
		}, (t + 4) * 1e3);
	}
	get musicPlaying() {
		return this._musicWanted;
	}
	get musicStopped() {
		return this._musicStopped;
	}
	get musicTrack() {
		return this._musicWanted ? this._musicTrackWanted : null;
	}
	get musicSection() {
		let e = this._music;
		return e && !e.stopping && e.sections ? e.sectionName : null;
	}
	setMusicSection(e) {
		let t = this._musicTrackWanted, r = n(j, t), i = r ? Object.keys(r.sections) : n(M, t) ?? (u.includes(t) ? [e] : null);
		if (!i || !i.includes(e)) return;
		this._sectionWanted = e;
		let a = this._music;
		if (!a || a.stopping || !a.sections?.[e] || a.track !== t) return;
		if (e === a.sectionName) {
			a.pending = null, a.switchAt = -1;
			return;
		}
		a.pending = e;
		let o = a.section.bpb ?? 4, s = (Math.floor(a.lastBeat / o) + 1) * o;
		a.switchAt = s < a.section.lengthBeats ? s : -1;
	}
	_takeSection(e) {
		let t = e.pending;
		return e.pending = null, e.switchAt = -1, e.sectionName = t, e.held &&= {}, e.sections[t];
	}
	playStinger(t, { volume: n = 1, duck: r = .3 } = {}) {
		if (!this.ready || this._disposed || !this._musicWanted) return !1;
		if (!d.includes(t)) return this._warnMusic(`unknown stinger "${t}"`), !1;
		let i = this._stingers.get(t);
		i || (i = q(t), this._stingers.set(t, i));
		let a = this.ctx, o = a.currentTime, s = o + .06, c = 60 / i.bpm, l = i.lengthBeats * c, u = a.createGain();
		u.gain.value = Math.max(0, n), u.connect(this._buses.music);
		let f = a.createGain();
		f.gain.value = .55, u.connect(f).connect(this._reverbIn);
		let p = this._biquad("lowpass", 4600, .5);
		p.connect(u);
		let m = this._biquad("lowpass", 3600, .5);
		m.connect(u);
		for (let e of i.events) {
			let t = s + e.beat * c;
			switch (e.kind) {
				case "harp":
					this._pluck(t, e.midi, e.vel * .34, e.pan, p);
					break;
				case "pad":
					this._pad(t, e.notes, e.dur * c, u, i.rng);
					break;
				case "flute":
					this._flute(t, e.midi, e.dur * c, e.vel, m, i.rng);
					break;
				case "bell": this._bell(t, h(e.midi), e.vel, 2.4, u);
			}
		}
		let g = this._music, _ = Number.isFinite(r) ? e(r, 0, 1) : .3;
		if (g && !g.stopping) {
			if (_ <= .001) this._music = null, this._stopInstance(g, .35);
			else for (let e of g.faders ?? [g.out]) {
				let t = e.gain;
				t.cancelScheduledValues(o), t.setValueAtTime(t.value, o), t.setTargetAtTime(_, o, .12), t.setTargetAtTime(1, s + l * .85, .6);
			}
		}
		return this._offline || setTimeout(() => {
			for (let e of [
				p,
				m,
				f,
				u
			]) try {
				e.disconnect();
			} catch {}
		}, (l + 6) * 1e3), !0;
	}
	toggleMusic() {
		return this._musicWanted ? this.stopMusic() : this.startMusic(), this._musicWanted;
	}
	_warnMusic(e) {
		this._warnedMusic?.has(e) || ((this._warnedMusic ??= /* @__PURE__ */ new Set()).add(e), console.warn(`[AudioSystem] ${e}`));
	}
	_scheduleMusic(e) {
		let t = this._music;
		if (!t || t.stopping) return;
		let n = 60 / t.bpm, r = e + b, i = () => {
			t.section.bpm && t.section.bpm !== t.bpm && (t.bpm = t.section.bpm, n = 60 / t.bpm);
		}, a = 0;
		for (; a++ < 4096;) {
			let a = t.section;
			if (t.cursor >= a.events.length) {
				t.sectionStart += a.lengthBeats * n, t.section = t.pending === null ? t.next(t) : this._takeSection(t), t.held && t.section !== a && (t.held = {}), t.cursor = 0, t.lastBeat = -1, t.loop++, i();
				continue;
			}
			let o = a.events[t.cursor];
			if (t.switchAt >= 0 && o.beat >= t.switchAt) {
				t.sectionStart += t.switchAt * n, t.section = this._takeSection(t), t.cursor = 0, t.lastBeat = -1, i();
				continue;
			}
			let s = t.sectionStart + o.beat * n + (o.jitter ?? 0);
			if (s > r) break;
			if (t.cursor++, t.lastBeat = o.beat, s < e - .03) continue;
			let c = Math.max(s, e + .002);
			if (!(this._voices > C * 1.5)) switch (o.kind) {
				case "harp":
					this._pluck(c, o.midi, o.vel * .34, o.pan, t.harpBus);
					break;
				case "pad":
					this._pad(c, o.notes, o.dur * n, t.padBus, t.rng, o.vel);
					break;
				case "flute":
					this._flute(c, o.midi, o.dur * n, o.vel, t.fluteBus, t.rng);
					break;
				case "taiko":
					this._taiko(c, o.vel, o.big, t.drumBus, t.rng);
					break;
				case "bass":
					this._sawBass(c, o.midi, o.dur * n, o.vel, t.bassBus);
					break;
				default: (P ?? L)?.scoreVoice(this, o, c, n, t);
			}
		}
	}
	_pluck(t, n, r, i, a) {
		let o = this.ctx, s = o.createBufferSource();
		s.buffer = this._harpBuffer(n);
		let c = o.createGain();
		c.gain.value = r;
		let l = o.createStereoPanner();
		l.pan.value = e(i, -1, 1), s.connect(c).connect(l).connect(a), s.start(t), this._cleanup(s, [
			s,
			c,
			l
		]);
	}
	_pad(e, t, n, r, i = this._rng, a = 1) {
		let o = this.ctx, s = this._biquad("lowpass", 700, .45);
		s.frequency.setValueAtTime(650, e), s.frequency.linearRampToValueAtTime(1350, e + n * .55), s.frequency.linearRampToValueAtTime(800, e + n + 1.6);
		let c = o.createGain(), l = .03 * a;
		c.gain.setValueAtTime(0, e), c.gain.linearRampToValueAtTime(l, e + Math.min(1.2, n * .4)), c.gain.setValueAtTime(l, e + n), c.gain.setTargetAtTime(0, e + n, .45), s.connect(c).connect(r);
		let u = e + n + 2.8, d = [s, c], f = null;
		for (let n = 0; n < t.length; n++) {
			let r = h(t[n]);
			for (let t of [-1, 1]) {
				let a = o.createOscillator();
				a.type = "sawtooth", a.frequency.value = r, a.detune.value = t * (5 + n * 1.3) + (i() - .5) * 3;
				let c = o.createStereoPanner();
				c.pan.value = t * (.25 + n * .07), a.connect(c).connect(s), a.start(e), a.stop(u), d.push(a, c), f ??= a;
			}
		}
		this._cleanup(f, d);
	}
	_flute(e, t, n, r, i, a = this._rng) {
		let o = this.ctx, s = h(t), c = e + n + .7, l = o.createOscillator();
		l.type = "sine", l.frequency.value = s;
		let u = o.createOscillator();
		u.type = "triangle", u.frequency.value = s;
		let d = o.createGain();
		d.gain.value = .16;
		let f = o.createOscillator();
		f.frequency.value = 5.1 + a() * .4;
		let p = o.createGain();
		p.gain.setValueAtTime(0, e), p.gain.setValueAtTime(0, e + Math.min(.25, n * .4)), p.gain.linearRampToValueAtTime(s * .0068, e + Math.min(.7, n * .8)), f.connect(p), p.connect(l.frequency), p.connect(u.frequency);
		let m = o.createGain(), g = .12 * r;
		m.gain.setValueAtTime(0, e), m.gain.linearRampToValueAtTime(g, e + .08), m.gain.linearRampToValueAtTime(g * .82, e + Math.max(.1, n * .7)), m.gain.setTargetAtTime(0, e + n * .96, .09), l.connect(m), u.connect(d).connect(m);
		let _ = this._noiseSource(this._white, e, a() * 1.5), v = this._biquad("bandpass", s * 2, 1.6), y = o.createGain();
		y.gain.setValueAtTime(0, e), y.gain.linearRampToValueAtTime(.018 * r, e + .05), y.gain.setTargetAtTime(.004 * r, e + .06, .1), y.gain.setTargetAtTime(0, e + n * .96, .06), _.connect(v).connect(y).connect(i), m.connect(i);
		for (let t of [
			l,
			u,
			f
		]) t.start(e), t.stop(c);
		_.stop(c), this._cleanup(l, [
			l,
			u,
			d,
			f,
			p,
			m,
			_,
			v,
			y
		]);
	}
	_taiko(e, t, n, r, i = this._rng) {
		let a = this.ctx, o = a.createOscillator();
		o.type = "sine", o.frequency.setValueAtTime(n ? 118 : 205, e), o.frequency.exponentialRampToValueAtTime(n ? 46 : 118, e + (n ? .22 : .1));
		let s = a.createGain();
		s.gain.setValueAtTime(0, e), s.gain.linearRampToValueAtTime((n ? .36 : .19) * t, e + .003), s.gain.setTargetAtTime(0, e + .01, n ? .13 : .055);
		let c = this._noiseSource(this._white, e, i() * 1.9), l = this._biquad(n ? "lowpass" : "bandpass", n ? 900 : 1800, n ? .7 : .9), u = a.createGain();
		u.gain.setValueAtTime(0, e), u.gain.linearRampToValueAtTime((n ? .12 : .1) * t, e + .002), u.gain.setTargetAtTime(0, e + .004, n ? .03 : .018), o.connect(s).connect(r), c.connect(l).connect(u).connect(r), o.start(e), o.stop(e + (n ? .9 : .45)), c.stop(e + .2), this._cleanup(o, [
			o,
			s,
			c,
			l,
			u
		]);
	}
	_sawBass(e, t, n, r, i) {
		let a = this.ctx, o = h(t), s = a.createOscillator();
		s.type = "sawtooth", s.frequency.value = o;
		let c = this._biquad("lowpass", o * 12, 3.2);
		c.frequency.setValueAtTime(Math.min(2400, o * 14), e), c.frequency.exponentialRampToValueAtTime(Math.max(140, o * 2.4), e + .12);
		let l = a.createGain(), u = .2 * r;
		l.gain.setValueAtTime(0, e), l.gain.linearRampToValueAtTime(u, e + .004), l.gain.setTargetAtTime(u * .55, e + .012, .05), l.gain.setTargetAtTime(0, e + n, .03), s.connect(c).connect(l).connect(i), s.start(e), s.stop(e + n + .25), this._cleanup(s, [
			s,
			c,
			l
		]);
	}
	_harpBuffer(n) {
		let r = this._harpCache.get(n);
		if (r) return r;
		let i = S, a = h(n), o = e(3.4 - (n - 38) * .045, 1.1, 3.2), s = Math.ceil(i * o);
		r = this.ctx.createBuffer(1, s, i);
		let c = r.getChannelData(0), l = t(19003 + n * 977), u = i / a, d = u - .5, f = 10 ** (-3 / (o * .75 * a)), p = Math.ceil(u) + 2, m = e(.3 + (n - 50) * .02, .14, .7), g = 0, _ = 0;
		for (let e = 0; e < p; e++) g += (l() * 2 - 1 - g) * m, _ += (g - _) * m, c[e] = _;
		let v = Math.max(1, Math.round(u * .14));
		for (let e = p - 1; e >= v; e--) c[e] -= .55 * c[e - v];
		let y = 0;
		for (let e = 0; e < p; e++) y += c[e];
		y /= p;
		for (let e = 0; e < p; e++) c[e] -= y;
		for (let e = p; e < s; e++) {
			let t = e - d, n = Math.floor(t), r = t - n, i = c[n] + (c[n + 1] - c[n]) * r, a = c[n - 1] + (c[n] - c[n - 1]) * r;
			c[e] = f * .5 * (i + a);
		}
		let b = 0;
		for (let e = 0; e < s; e++) b = Math.max(b, Math.abs(c[e]));
		let x = b > 0 ? .9 / b : 1, C = Math.floor(s * .25);
		for (let e = 0; e < s; e++) {
			let t = c[e] * x;
			e < 56 && (t *= e / 56);
			let n = s - 1 - e;
			n < C && (t *= n / C), c[e] = t;
		}
		return this._harpCache.set(n, r), r;
	}
	_build() {
		let e = this.ctx, n = e.createGain(), r = e.createDynamicsCompressor();
		r.threshold.value = -14, r.knee.value = 12, r.ratio.value = 3, r.attack.value = .006, r.release.value = .25;
		let i = e.createGain();
		i.gain.value = this._muted ? 0 : this._volume, n.connect(r).connect(i).connect(e.destination), this._mix = n, this._master = i;
		let a = e.createConvolver();
		a.buffer = this._makeImpulse(2.8, 2.3);
		let o = e.createGain();
		o.gain.value = 1;
		let s = e.createGain();
		s.gain.value = this._reverbAmount;
		let c = this._biquad("highpass", 160, .7);
		o.connect(c).connect(a).connect(s).connect(n), this._reverbIn = o;
		let l = (t, r) => {
			let i = e.createGain();
			i.gain.value = t, i.connect(n);
			let a = e.createGain();
			return a.gain.value = r, i.connect(a).connect(o), i;
		};
		this._buses = {
			sfx: l(this._sfxVolume * _.sfx, .22),
			music: l(this._musicVolume * _.music, 0),
			amb: l(this._ambienceVolume * _.amb, .12)
		};
		let u = t(2827), d = e.createBuffer(1, Math.floor(e.sampleRate * 2), e.sampleRate), f = d.getChannelData(0);
		for (let e = 0; e < f.length; e++) f[e] = u() * 2 - 1;
		this._white = d;
		let p = e.createBuffer(1, Math.floor(e.sampleRate * 6), e.sampleRate), m = p.getChannelData(0), h = 0;
		for (let e = 0; e < m.length; e++) h = (h + .02 * (u() * 2 - 1)) / 1.02, m[e] = h * 3.5;
		let g = m[m.length - 1] - m[0], v = 0;
		for (let e = 0; e < m.length; e++) m[e] -= g * e / (m.length - 1), v += m[e];
		v /= m.length;
		for (let e = 0; e < m.length; e++) m[e] -= v;
		this._brown = p, this._offline || (this._timer = setInterval(this._tick, x), typeof document < "u" && document.addEventListener("visibilitychange", this._onVisibility)), this._applyAmbience(), this._musicWanted && this.startMusic();
	}
	_makeImpulse(e, n) {
		let r = this.ctx, i = r.sampleRate, a = Math.floor(i * e), o = r.createBuffer(2, a, i), s = Math.floor(i * .014);
		for (let r = 0; r < 2; r++) {
			let c = o.getChannelData(r), l = t(485 + r * 7919), u = 0;
			for (let t = s; t < a; t++) {
				let r = (t - s) / i, a = Math.exp(-6.91 * r / n), o = .85 - .7 * Math.min(1, r / e);
				u += (l() * 2 - 1 - u) * o, c[t] = u * a;
			}
			for (let e = 0; e < 10; e++) {
				let t = s + Math.floor(i * (.004 + l() * .07));
				t < a && (c[t] += (l() - .5) * .9 * (1 - e / 12));
			}
			let d = Math.floor(i * .1);
			for (let e = 0; e < d; e++) c[a - 1 - e] *= e / d;
		}
		return o;
	}
	_applyMaster() {
		this.ctx && this._master && this._master.gain.setTargetAtTime(this._muted ? 0 : this._volume, this.ctx.currentTime, .03);
	}
	_biquad(e, t, n) {
		let r = this.ctx.createBiquadFilter();
		return r.type = e, r.frequency.value = t, r.Q.value = n, r;
	}
	_panner(t, n, r = 0) {
		let i = this.ctx.createStereoPanner();
		if (i.pan.value = e(t, -1, 1), i.connect(n), r > 0) {
			let e = this.ctx.createGain();
			e.gain.value = r, i.connect(e).connect(this._reverbIn), i._send = e;
		}
		return i;
	}
	_later(e, t, n) {
		if (this._offline) return;
		this._voices++;
		let r = (Math.max(0, t - this.ctx.currentTime) + n + .05) * 1e3;
		setTimeout(() => {
			this._voices--;
			try {
				e.disconnect(), e._send?.disconnect();
			} catch {}
		}, r);
	}
	_noiseSource(e, t, n = 0) {
		let r = this.ctx.createBufferSource();
		return r.buffer = e, r.loop = !0, r.start(t, n % e.duration), r;
	}
	_cleanup(e, t) {
		e && (this._voices++, e.onended = () => {
			this._voices--;
			for (let e of t) try {
				e.disconnect(), e._send?.disconnect();
			} catch {}
		});
	}
	prescheduleOffline(e) {
		if (this.ctx && this._offline) for (let t = 0; t < e; t += b * .5) this._scheduleMusic(t), this._scheduleAmbience(t);
	}
	_tick() {
		let e = this.ctx;
		if (!e || this._disposed || e.state !== "running") return;
		let t = e.currentTime;
		this._scheduleMusic(t), this._scheduleAmbience(t);
	}
	_onVisibility() {
		let e = this.ctx;
		e && this._suspendWhenHidden && !this._disposed && (document.visibilityState === "hidden" ? e.state === "running" && (this._hiddenSuspended = !0, e.suspend().catch(() => {})) : this._hiddenSuspended && (this._hiddenSuspended = !1, e.resume().catch(() => {})));
	}
};
//#endregion
export { i as a, G as i, r as n, a as r, J as t };
