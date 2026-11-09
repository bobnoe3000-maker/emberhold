import { Jt as e, On as t, Pt as n, T as r, Vn as i, _t as a, c as o, dr as s, h as c, j as l, l as u, st as d, ur as f, vt as p } from "./three.core-D9_Fol79.js";
import { k as m } from "./SmallProps-E2A3GsnG.js";
import { i as h, n as g } from "./Palette-D7TB3xJk.js";
import { a as _, c as ee, l as v, o as te, r as y, u as ne } from "./math-Du_SWpiD.js";
import { r as b } from "./ThawField-D3Wx0alo.js";
import { C as re, S as x, T as ie, a as ae, b as oe, g as se, h as ce, i as le, k as ue, m as de, n as fe, o as pe, r as me, t as he, w as ge, x as _e, y as ve } from "./engine-D4CoK1J3.js";
import { i as ye, n as be } from "./own-rp3p7qEo.js";
import { i as xe, n as Se } from "./AudioSystem-DPgoFtAp.js";
import { t as Ce } from "./CharacterSprites-didr5D7N.js";
import { n as we } from "./Particles-C_vsKpjw.js";
import { c as Te, n as Ee } from "./ObjectCatalog-CLBSNnc2.js";
import { a as De, c as Oe, d as ke, u as S } from "./I18n-BeKB4FMa.js";
import { h as Ae } from "./LevelLook-DBb7Ixt0.js";
import { r as je } from "./Travel-4-idrvN5.js";
import { n as Me } from "./config-DDHWC9jm.js";
import { a as Ne, i as Pe } from "./ContentText-nXIHgNO8.js";
import { t as Fe } from "./Nav-CrItj1Ws.js";
import { c as Ie, l as Le, m as Re, r as ze } from "./PartyRules-BC3MXv_G.js";
//#region src/engine/fx/presets/hero.js
var Be = Object.freeze({
	mode: "burst",
	motion: "emit",
	texture: "streak",
	blending: "additive",
	variants: 1,
	lit: 0,
	pulse: 0,
	tumble: 0,
	aspect: 4,
	streak: .04,
	fade: [0, .3],
	twinkle: 0,
	blink: 0,
	nightVisibility: 0
}), Ve = Object.freeze({
	mode: "burst",
	motion: "emit",
	texture: "star",
	blending: "additive",
	variants: 1,
	lit: 0,
	pulse: 1,
	tumble: 0,
	aspect: 1,
	streak: 0,
	fade: [.05, .3],
	twinkle: 0,
	blink: 0,
	nightVisibility: 0
}), He = Object.freeze({
	mode: "burst",
	motion: "emit",
	texture: "smoke",
	blending: "normal",
	variants: 1,
	lit: 1,
	pulse: 0,
	tumble: 0,
	aspect: 1,
	streak: 0,
	fade: [.05, .6],
	twinkle: 0,
	blink: 0,
	nightVisibility: 0
}), Ue = Object.freeze({
	mode: "burst",
	motion: "emit",
	texture: "square",
	blending: "normal",
	variants: 1,
	lit: .5,
	pulse: 0,
	tumble: 0,
	aspect: 1,
	streak: 0,
	fade: [0, .3],
	twinkle: 0,
	blink: 0,
	nightVisibility: 0
}), We = {
	heroWindSpark: {
		...Be,
		count: 8,
		life: [.16, .34],
		size: [.04, .07],
		sizeEnd: .5,
		spawnSize: [
			.5,
			.3,
			.5
		],
		burstSpeed: [4, 9],
		burstUp: [.2, 1.4],
		gravity: -3,
		drag: 4.5,
		colors: [
			"#9fb4d8",
			"#7f96c0",
			"#c4d2ea"
		],
		hdr: 1.4,
		alpha: 1
	},
	heroFangEmber: {
		...Be,
		count: 6,
		life: [.25, .55],
		size: [.05, .08],
		sizeEnd: .45,
		spawnSize: [
			1.6,
			.4,
			.6
		],
		burstSpeed: [1.2, 3.5],
		burstUp: [.6, 2.2],
		gravity: 1.2,
		drag: 2.2,
		colors: [
			"#e0283c",
			"#ff5a48",
			"#ff9a88"
		],
		hdr: 1.6,
		alpha: 1
	},
	heroHoly: {
		...Ve,
		count: 10,
		life: [.6, 1.2],
		size: [.16, .3],
		sizeEnd: .8,
		spawnSize: [
			2.4,
			.6,
			2.4
		],
		velocity: [
			0,
			1.4,
			0
		],
		burstSpeed: [.3, 1.6],
		burstUp: [.4, 1.4],
		gravity: .4,
		drag: 1.6,
		spin: [.5, 2],
		color: "#ffc860",
		hdr: 1.25,
		alpha: 1
	},
	heroGlint: {
		...Ve,
		count: 8,
		life: [.3, .6],
		size: [.14, .24],
		sizeEnd: .7,
		spawnSize: [
			.6,
			.6,
			.6
		],
		burstSpeed: [.5, 2],
		burstUp: [.1, .6],
		drag: 2.5,
		spin: [1, 3],
		color: "#c8d6ea",
		hdr: 1.3,
		alpha: 1
	},
	heroGust: {
		...He,
		count: 8,
		life: [.35, .7],
		size: [.22, .36],
		sizeEnd: 2.4,
		spawnSize: [
			.6,
			.05,
			.6
		],
		burstSpeed: [1.6, 3.4],
		burstUp: [.1, .5],
		gravity: -.2,
		drag: 4.5,
		spin: [.5, 2.5],
		color: "#dccbb0",
		alpha: .6
	},
	heroDustRing: {
		...He,
		count: 12,
		life: [.9, 1.6],
		size: [.5, .8],
		sizeEnd: 2.6,
		spawnSize: [
			3.2,
			.15,
			3.2
		],
		burstSpeed: [4.5, 8.5],
		burstUp: [.1, .5],
		gravity: -.1,
		drag: 3,
		spin: [.3, 1.5],
		color: "#7d6a52",
		alpha: .45
	},
	heroDebris: {
		...Ue,
		count: 16,
		life: [.8, 1.3],
		size: [.11, .2],
		sizeEnd: .85,
		spawnSize: [
			1.4,
			.2,
			1.4
		],
		burstSpeed: [2, 5.5],
		burstUp: [4, 8],
		gravity: -16,
		drag: .4,
		ballistic: !0,
		colors: [
			"#4e3f33",
			"#6e5946",
			"#33291f",
			"#8a7259"
		],
		hdr: 1,
		alpha: 1
	},
	heroMote: {
		...Ve,
		count: 3,
		life: [.6, 1],
		size: [.1, .18],
		sizeEnd: .5,
		spawnSize: [
			.3,
			.4,
			.3
		],
		velocity: [
			0,
			1.2,
			0
		],
		burstSpeed: [.1, .5],
		burstUp: [.2, .6],
		gravity: .2,
		drag: 1.4,
		spin: [.5, 2],
		color: "#ffcf70",
		hdr: 1.15,
		alpha: 1
	}
}, Ge = Object.freeze({
	mode: "burst",
	motion: "emit",
	texture: "streak",
	blending: "additive",
	variants: 1,
	lit: 0,
	pulse: 0,
	tumble: 0,
	aspect: 4,
	streak: .04,
	fade: [0, .3],
	twinkle: 0,
	blink: 0,
	nightVisibility: 0
}), Ke = Object.freeze({
	mode: "burst",
	motion: "emit",
	texture: "star",
	blending: "additive",
	variants: 1,
	lit: 0,
	pulse: 1,
	tumble: 0,
	aspect: 1,
	streak: 0,
	fade: [.05, .3],
	twinkle: 0,
	blink: 0,
	nightVisibility: 0
}), qe = Object.freeze({
	mode: "burst",
	motion: "emit",
	texture: "smoke",
	blending: "normal",
	variants: 1,
	lit: 1,
	pulse: 0,
	tumble: 0,
	aspect: 1,
	streak: 0,
	fade: [.05, .6],
	twinkle: 0,
	blink: 0,
	nightVisibility: 0
}), Je = Object.freeze({
	mode: "burst",
	motion: "emit",
	texture: "square",
	blending: "normal",
	variants: 1,
	lit: .5,
	pulse: 0,
	tumble: 0,
	aspect: 1,
	streak: 0,
	fade: [0, .3],
	twinkle: 0,
	blink: 0,
	nightVisibility: 0
}), Ye = {
	partyFrostShards: {
		...Ge,
		count: 8,
		life: [.25, .55],
		size: [.05, .08],
		sizeEnd: .5,
		spawnSize: [
			.3,
			.3,
			.3
		],
		burstSpeed: [2.5, 6],
		burstUp: [.8, 3],
		gravity: -7,
		drag: 2,
		colors: [
			"#c8ecff",
			"#8cd2ff",
			"#b0e2ff"
		],
		hdr: 1.6,
		alpha: 1
	},
	partyFrostGlint: {
		...Ke,
		count: 6,
		life: [.4, .9],
		size: [.12, .22],
		sizeEnd: .6,
		spawnSize: [
			.6,
			.6,
			.6
		],
		burstSpeed: [.3, 1.1],
		burstUp: [.2, .8],
		gravity: -.4,
		drag: 2,
		colors: ["#c4eaff", "#92d2ff"],
		hdr: 1.5,
		alpha: 1
	},
	partyFrostTrail: {
		...Ge,
		count: 1,
		life: [.18, .32],
		size: [.05, .07],
		sizeEnd: .4,
		spawnSize: [
			.1,
			.1,
			.1
		],
		burstSpeed: [.2, .6],
		burstUp: [-.2, .3],
		gravity: -1,
		drag: 3,
		color: "#bfeaff",
		hdr: 1.8,
		alpha: 1
	},
	partySnowfall: {
		...Je,
		count: 8,
		life: [1.1, 1.7],
		size: [.1, .16],
		sizeEnd: .7,
		spawnSize: [
			2.4,
			1.2,
			2.4
		],
		velocity: [
			1.1,
			-1.9,
			.4
		],
		velocityVariance: [
			.5,
			.4,
			.5
		],
		burstSpeed: [.1, .6],
		burstUp: [0, 0],
		gravity: -.6,
		drag: .15,
		colors: [
			"#dcefff",
			"#c4e2fa",
			"#e8f4ff"
		],
		hdr: 1,
		alpha: 1
	},
	partyIceChunks: {
		...Je,
		count: 12,
		life: [.5, .9],
		size: [.08, .15],
		sizeEnd: .7,
		spawnSize: [
			1.6,
			.3,
			1.6
		],
		burstSpeed: [1.2, 3.4],
		burstUp: [2.2, 4.8],
		gravity: -10,
		drag: .4,
		ballistic: !0,
		colors: [
			"#d4eeff",
			"#a6d6f6",
			"#7cb8e2"
		],
		hdr: 1.05,
		alpha: 1
	},
	partySnowStreak: {
		...Ge,
		count: 6,
		life: [.45, .7],
		size: [.05, .075],
		sizeEnd: .8,
		spawnSize: [
			7,
			1.6,
			7
		],
		velocity: [
			2.8,
			-6.5,
			1
		],
		velocityVariance: [
			.4,
			.8,
			.4
		],
		burstSpeed: [0, .2],
		burstUp: [0, 0],
		gravity: 0,
		drag: 0,
		colors: [
			"#b4e0ff",
			"#8cc6ff",
			"#cbe9ff"
		],
		hdr: 1.4,
		alpha: 1
	},
	partyIcePuff: {
		...Ke,
		count: 3,
		life: [.25, .45],
		size: [.1, .16],
		sizeEnd: .4,
		spawnSize: [
			.25,
			.05,
			.25
		],
		burstSpeed: [.4, 1.1],
		burstUp: [.3, .9],
		gravity: -1.5,
		drag: 3,
		colors: ["#b8e4ff", "#8ec8ff"],
		hdr: 1.3,
		alpha: 1
	},
	partyDust: {
		...qe,
		count: 8,
		life: [.6, 1.2],
		size: [.45, .8],
		sizeEnd: 2.5,
		spawnSize: [
			1,
			.2,
			1
		],
		burstSpeed: [1.4, 3.4],
		burstUp: [.2, .7],
		drag: 4,
		spin: [.5, 1.5],
		color: "#cdb594",
		colorEnd: "#9c8770",
		alpha: .7
	},
	partyRubble: {
		...Je,
		count: 12,
		life: [.5, 1],
		size: [.08, .16],
		sizeEnd: .8,
		spawnSize: [
			1.2,
			.2,
			1.2
		],
		burstSpeed: [1.5, 4],
		burstUp: [2.5, 5.5],
		gravity: -11,
		drag: .3,
		ballistic: !0,
		colors: [
			"#8c7658",
			"#6c5842",
			"#a89070",
			"#5a4a3a"
		],
		hdr: 1,
		alpha: 1
	}
}, Xe = Object.freeze({
	mode: "burst",
	motion: "emit",
	texture: "streak",
	blending: "additive",
	variants: 1,
	lit: 0,
	pulse: 0,
	tumble: 0,
	aspect: 4,
	streak: .04,
	fade: [0, .3],
	twinkle: 0,
	blink: 0,
	nightVisibility: 0
}), Ze = Object.freeze({
	mode: "burst",
	motion: "emit",
	texture: "smoke",
	blending: "normal",
	variants: 1,
	lit: 1,
	pulse: 0,
	tumble: 0,
	aspect: 1,
	streak: 0,
	fade: [.05, .6],
	twinkle: 0,
	blink: 0,
	nightVisibility: 0
}), Qe = Object.freeze({
	mode: "burst",
	motion: "emit",
	texture: "star",
	blending: "additive",
	variants: 1,
	lit: 0,
	pulse: 1,
	tumble: 0,
	aspect: 1,
	streak: 0,
	fade: [.05, .3],
	twinkle: 0,
	blink: 0,
	nightVisibility: 0
}), $e = Object.freeze({
	mode: "burst",
	motion: "emit",
	texture: "square",
	blending: "normal",
	variants: 1,
	lit: .5,
	pulse: 0,
	tumble: 0,
	aspect: 1,
	streak: 0,
	fade: [0, .3],
	twinkle: 0,
	blink: 0,
	nightVisibility: 0
}), et = [
	"#fff0b0",
	"#ffb648",
	"#ff7a1e",
	"#ff3a12"
], tt = [
	"#ff8a2a",
	"#ff3a12",
	"#ffd27a"
];
function nt(e, t, n) {
	return `${e}${(Math.round(Math.atan2(n, t) / (Math.PI * 2) * 16) % 16 + 16) % 16}`;
}
var rt = {
	dragonTrail: {
		...Xe,
		count: 3,
		life: [.22, .45],
		size: [.08, .14],
		sizeEnd: .4,
		spawnSize: [
			.3,
			.3,
			.3
		],
		burstSpeed: [.3, 1.4],
		burstUp: [.4, 1.6],
		gravity: 1.5,
		drag: 2.2,
		colors: et.slice(1),
		hdr: 3
	},
	dragonFireBurst: {
		...Xe,
		count: 18,
		life: [.3, .75],
		size: [.12, .24],
		sizeEnd: .5,
		spawnSize: [
			.8,
			.3,
			.8
		],
		burstSpeed: [4, 10],
		burstUp: [2, 6.5],
		gravity: -6,
		drag: 2.4,
		colors: et,
		hdr: 3.2
	},
	dragonFlare: {
		...Qe,
		count: 4,
		life: [.14, .3],
		size: [.9, 1.5],
		sizeEnd: 1.8,
		spawnSize: [
			.6,
			.4,
			.6
		],
		burstSpeed: [0, .4],
		burstUp: [.2, .6],
		drag: 3,
		colors: ["#fff0c8", "#ffd27a"],
		hdr: .7
	},
	dragonEmbers: {
		...Xe,
		count: 10,
		life: [.8, 1.8],
		size: [.05, .09],
		sizeEnd: .5,
		spawnSize: [
			2,
			.4,
			2
		],
		burstSpeed: [.3, 1.2],
		burstUp: [1.5, 3.5],
		gravity: 1.2,
		drag: 1.2,
		colors: tt,
		hdr: 2.4
	},
	dragonSmoke: {
		...Ze,
		count: 8,
		life: [1.6, 2.8],
		size: [.8, 1.2],
		sizeEnd: 3,
		spawnSize: [
			1.2,
			.4,
			1.2
		],
		burstSpeed: [.3, 1],
		burstUp: [.8, 1.8],
		gravity: .3,
		drag: 1.2,
		spin: [.3, 1],
		color: "#3a3234",
		alpha: .75
	},
	dragonDust: {
		...Ze,
		count: 12,
		life: [.8, 1.6],
		size: [.7, 1.1],
		sizeEnd: 2.6,
		spawnSize: [
			1.5,
			.2,
			1.5
		],
		burstSpeed: [2, 5.5],
		burstUp: [.2, .9],
		gravity: -.4,
		drag: 2.5,
		spin: [.3, 1.2],
		color: "#a8927a",
		alpha: .65
	},
	dragonDebris: {
		...$e,
		count: 10,
		life: [.6, 1.1],
		size: [.12, .22],
		sizeEnd: .9,
		spawnSize: [
			.8,
			.2,
			.8
		],
		burstSpeed: [2, 5],
		burstUp: [3, 6.5],
		gravity: -14,
		drag: .6,
		ballistic: !0,
		colors: [
			"#3a3036",
			"#5a4a44",
			"#2a2226",
			"#6e5a4c"
		],
		hdr: 1,
		alpha: 1
	},
	dragonDeath: {
		...Xe,
		count: 24,
		life: [1.2, 2.6],
		size: [.06, .12],
		sizeEnd: .4,
		spawnSize: [
			6,
			2.5,
			3
		],
		burstSpeed: [.5, 2.2],
		burstUp: [2, 5],
		gravity: 1,
		drag: .8,
		colors: tt,
		hdr: 2.6
	},
	dragonLavaSpit: {
		...Xe,
		count: 6,
		life: [.5, .9],
		size: [.07, .12],
		sizeEnd: .5,
		spawnSize: [
			1.2,
			.1,
			1.2
		],
		burstSpeed: [.4, 1.4],
		burstUp: [3, 6],
		gravity: -9,
		drag: .4,
		ballistic: !0,
		colors: tt,
		hdr: 2.8
	},
	...it("dragonBreath", (e, t) => ({
		...Xe,
		count: 5,
		life: [.45, .75],
		size: [.22, .36],
		sizeEnd: 1.8,
		spawnSize: [
			.35,
			.3,
			.35
		],
		velocity: [
			e * 12,
			-7,
			t * 12
		],
		burstSpeed: [0, 2.6],
		burstUp: [-.6, .6],
		gravity: .6,
		drag: .5,
		colors: [
			"#ffc25a",
			"#ff8a2a",
			"#f05a1a",
			"#c0300e"
		],
		hdr: .72
	})),
	...it("dragonGust", (e, t) => ({
		...Ze,
		count: 5,
		life: [.6, 1.1],
		size: [.6, 1],
		sizeEnd: 2.4,
		spawnSize: [
			1.4,
			.3,
			1.4
		],
		velocity: [
			e * 8.5,
			.3,
			t * 8.5
		],
		burstSpeed: [.2, 1.5],
		burstUp: [0, .6],
		gravity: -.2,
		drag: 1.4,
		spin: [.4, 1.5],
		color: "#b8a088",
		alpha: .55
	}))
};
function it(e, t) {
	let n = {};
	for (let r = 0; r < 16; r++) {
		let i = r / 16 * Math.PI * 2;
		n[`${e}${r}`] = t(+Math.cos(i).toFixed(4), +Math.sin(i).toFixed(4));
	}
	return n;
}
//#endregion
//#region src/engine/fx/presets/brutes.js
var at = Object.freeze({
	mode: "burst",
	motion: "emit",
	texture: "streak",
	blending: "additive",
	variants: 1,
	lit: 0,
	pulse: 0,
	tumble: 0,
	aspect: 4,
	streak: .04,
	fade: [0, .3],
	twinkle: 0,
	blink: 0,
	nightVisibility: 0
}), ot = Object.freeze({
	mode: "burst",
	motion: "emit",
	texture: "smoke",
	blending: "normal",
	variants: 1,
	lit: 1,
	pulse: 0,
	tumble: 0,
	aspect: 1,
	streak: 0,
	fade: [.05, .6],
	twinkle: 0,
	blink: 0,
	nightVisibility: 0
}), st = Object.freeze({
	mode: "burst",
	motion: "emit",
	texture: "star",
	blending: "additive",
	variants: 1,
	lit: 0,
	pulse: 1,
	tumble: 0,
	aspect: 1,
	streak: 0,
	fade: [.05, .3],
	twinkle: 0,
	blink: 0,
	nightVisibility: 0
}), ct = Object.freeze({
	mode: "burst",
	motion: "emit",
	texture: "square",
	blending: "normal",
	variants: 1,
	lit: .5,
	pulse: 0,
	tumble: 0,
	aspect: 1,
	streak: 0,
	fade: [0, .3],
	twinkle: 0,
	blink: 0,
	nightVisibility: 0
}), lt = [
	"#ffd27a",
	"#ff9a2a",
	"#ff6a1a",
	"#e8400e"
], ut = {
	bruteSparks: {
		...at,
		count: 10,
		life: [.15, .4],
		size: [.04, .07],
		sizeEnd: .6,
		spawnSize: [
			.2,
			.3,
			.2
		],
		burstSpeed: [3, 7],
		burstUp: [.8, 3],
		gravity: -9,
		drag: 2,
		colors: [
			"#fff4c8",
			"#ffd27a",
			"#ff9a3c"
		],
		hdr: 4,
		alpha: 1
	},
	bruteSplinters: {
		...ct,
		count: 10,
		life: [.5, .95],
		size: [.06, .11],
		sizeEnd: .9,
		spawnSize: [
			.3,
			.4,
			.3
		],
		burstSpeed: [1.4, 3.4],
		burstUp: [1.8, 3.8],
		gravity: -9.8,
		drag: .6,
		ballistic: !0,
		spin: [3, 9],
		colors: [
			"#7a5232",
			"#9a6c40",
			"#4e3220"
		],
		hdr: 1,
		alpha: 1
	},
	bruteDust: {
		...ot,
		count: 10,
		life: [.6, 1.25],
		size: [.4, .7],
		sizeEnd: 2.6,
		spawnSize: [
			.9,
			.2,
			.9
		],
		burstSpeed: [.8, 2.4],
		burstUp: [.2, .9],
		gravity: .15,
		drag: 3.5,
		spin: [.4, 1.5],
		color: "#ece2d0",
		alpha: .7
	},
	bruteRubble: {
		...ct,
		count: 12,
		life: [.45, .9],
		size: [.08, .15],
		sizeEnd: 1,
		spawnSize: [
			1.2,
			.2,
			1.2
		],
		burstSpeed: [1.5, 4.2],
		burstUp: [3, 5.5],
		gravity: -12,
		drag: .3,
		ballistic: !0,
		spin: [2, 7],
		colors: [
			"#5c4c40",
			"#7c6858",
			"#3e332c",
			"#9a8268"
		],
		hdr: 1,
		alpha: 1
	},
	bruteFireBlast: {
		...at,
		count: 16,
		life: [.35, .75],
		size: [.13, .24],
		sizeEnd: .4,
		spawnSize: [
			.7,
			.3,
			.7
		],
		burstSpeed: [2, 5],
		burstUp: [1.5, 4.2],
		gravity: 2,
		drag: 2.6,
		colors: lt,
		hdr: 2.1,
		alpha: 1
	},
	bruteFireCore: {
		...st,
		count: 6,
		life: [.18, .4],
		size: [.6, 1.1],
		sizeEnd: 1.6,
		spawnSize: [
			.5,
			.4,
			.5
		],
		burstSpeed: [.3, 1.2],
		burstUp: [.3, 1],
		drag: 3,
		colors: ["#ffc24a", "#ff8a1e"],
		hdr: 1.6,
		alpha: 1
	},
	bruteSmoke: {
		...ot,
		count: 8,
		life: [.9, 1.7],
		size: [.45, .8],
		sizeEnd: 3,
		spawnSize: [
			.8,
			.4,
			.8
		],
		burstSpeed: [.3, .9],
		burstUp: [.8, 1.7],
		gravity: .4,
		drag: 2,
		spin: [.3, 1.2],
		color: "#4a403a",
		alpha: .55
	},
	bruteBreath: {
		...at,
		count: 6,
		life: [.3, .55],
		size: [.2, .36],
		sizeEnd: .45,
		spawnSize: [
			.7,
			.3,
			.7
		],
		burstSpeed: [.2, .9],
		burstUp: [.8, 1.8],
		gravity: 2.2,
		drag: 2.4,
		colors: [
			"#ffa83a",
			"#ff7a1e",
			"#f0501a",
			"#d2340e"
		],
		hdr: 1.5,
		alpha: 1
	},
	brutePillar: {
		...at,
		count: 18,
		life: [.45, .9],
		size: [.12, .22],
		sizeEnd: .4,
		spawnSize: [
			1.1,
			.3,
			1.1
		],
		burstSpeed: [.2, .9],
		burstUp: [4, 8.5],
		gravity: 2,
		drag: 1.2,
		colors: lt,
		hdr: 2.2,
		alpha: 1
	},
	bruteGather: {
		...st,
		count: 4,
		life: [.22, .45],
		size: [.18, .32],
		sizeEnd: .5,
		spawnSize: [
			.6,
			.6,
			.6
		],
		burstSpeed: [.2, .8],
		burstUp: [-.3, .4],
		drag: 3,
		color: "#ffb84a",
		hdr: 2.2,
		alpha: 1
	},
	bruteEmbers: {
		...at,
		count: 10,
		life: [.6, 1.2],
		size: [.04, .07],
		sizeEnd: .5,
		spawnSize: [
			.8,
			.6,
			.8
		],
		burstSpeed: [.3, 1.1],
		burstUp: [1.4, 3],
		gravity: 1.5,
		drag: 1.3,
		colors: [
			"#ffb84a",
			"#ff7a1e",
			"#ff3a12"
		],
		hdr: 2.6,
		alpha: 1
	},
	bruteBlink: {
		...at,
		count: 14,
		life: [.3, .6],
		size: [.1, .18],
		sizeEnd: .4,
		spawnSize: [
			.7,
			1.4,
			.7
		],
		burstSpeed: [2, 4],
		burstUp: [.5, 2.5],
		gravity: 2,
		drag: 4,
		colors: [
			"#ffc24a",
			"#ff6a1a",
			"#c4300e"
		],
		hdr: 2.8,
		alpha: 1
	}
}, dt = Object.freeze({
	mode: "burst",
	motion: "emit",
	texture: "smoke",
	blending: "normal",
	variants: 1,
	lit: 1,
	pulse: 0,
	tumble: 0,
	aspect: 1,
	streak: 0,
	fade: [.05, .6],
	twinkle: 0,
	blink: 0,
	nightVisibility: 0
}), ft = Object.freeze({
	mode: "burst",
	motion: "emit",
	texture: "streak",
	blending: "additive",
	variants: 1,
	lit: 0,
	pulse: 0,
	tumble: 0,
	aspect: 4,
	streak: .04,
	fade: [0, .3],
	twinkle: 0,
	blink: 0,
	nightVisibility: 0
}), pt = {
	swarmDust: {
		...dt,
		count: 5,
		life: [.35, .6],
		size: [.16, .26],
		sizeEnd: 2,
		spawnSize: [
			.4,
			.04,
			.4
		],
		burstSpeed: [.6, 1.4],
		burstUp: [.1, .4],
		gravity: -.3,
		drag: 5,
		spin: [.5, 2],
		color: "#d8b888",
		alpha: .65
	},
	swarmAsh: {
		...dt,
		count: 5,
		life: [.6, 1.1],
		size: [.35, .5],
		sizeEnd: 2.4,
		spawnSize: [
			.8,
			.2,
			.8
		],
		burstSpeed: [.5, 1.2],
		burstUp: [.4, .9],
		gravity: .2,
		drag: 3,
		spin: [.3, 1.2],
		color: "#5c5458",
		alpha: .6
	},
	swarmSpark: {
		...ft,
		count: 6,
		life: [.25, .55],
		size: [.04, .07],
		sizeEnd: .5,
		spawnSize: [
			.2,
			.2,
			.2
		],
		burstSpeed: [1.5, 3.5],
		burstUp: [.8, 2.2],
		gravity: -2,
		drag: 2.5,
		colors: [
			"#ffb040",
			"#ff6a1e",
			"#ffe08a"
		],
		hdr: 2.6,
		alpha: 1
	},
	swarmFlare: {
		...ft,
		count: 14,
		life: [.3, .6],
		size: [.05, .08],
		sizeEnd: .45,
		spawnSize: [
			.3,
			.1,
			.3
		],
		burstSpeed: [3.5, 6.5],
		burstUp: [.6, 2.4],
		gravity: -3,
		drag: 3,
		colors: [
			"#ff8a2a",
			"#ff4a14",
			"#ffd27a"
		],
		hdr: 3,
		alpha: 1
	}
}, mt = {
	holySpark: {
		...Ge,
		count: 8,
		life: [.3, .6],
		size: [.05, .08],
		sizeEnd: .5,
		spawnSize: [
			.3,
			.3,
			.3
		],
		burstSpeed: [2, 4.5],
		burstUp: [1.5, 3.5],
		gravity: -3,
		drag: 2.5,
		colors: [
			"#ffe08a",
			"#ffd067",
			"#ffeaa8"
		],
		hdr: 1.15,
		alpha: 1
	},
	holyMotes: {
		...Ke,
		count: 6,
		life: [.5, .9],
		size: [.12, .2],
		sizeEnd: .6,
		spawnSize: [
			.35,
			.3,
			.35
		],
		velocity: [
			0,
			.5,
			0
		],
		burstSpeed: [.15, .55],
		burstUp: [.15, .5],
		gravity: .3,
		drag: 2,
		colors: ["#ffe596", "#ffd473"],
		hdr: 1.25,
		alpha: 1
	},
	holyTrail: {
		...Ke,
		count: 1,
		life: [.22, .4],
		size: [.11, .18],
		sizeEnd: .3,
		spawnSize: [
			.12,
			.12,
			.12
		],
		burstSpeed: [0, .2],
		burstUp: [0, .2],
		drag: 3,
		color: "#ffe08a",
		hdr: 1.3,
		alpha: 1
	},
	holyAscend: {
		...Ke,
		count: 12,
		life: [.5, .9],
		size: [.1, .18],
		sizeEnd: .4,
		spawnSize: [
			.3,
			3,
			.3
		],
		velocity: [
			0,
			1.8,
			0
		],
		burstSpeed: [.1, .3],
		burstUp: [0, .2],
		gravity: .5,
		drag: 1,
		colors: ["#ffe39a", "#ffecb4"],
		hdr: 1.15,
		alpha: 1
	},
	lifeRise: {
		...Ke,
		count: 6,
		life: [.9, 1.5],
		size: [.12, .2],
		sizeEnd: .6,
		spawnSize: [
			1.4,
			.2,
			1.4
		],
		velocity: [
			0,
			1.5,
			0
		],
		burstSpeed: [.05, .25],
		burstUp: [.2, .6],
		gravity: .4,
		drag: .8,
		colors: [
			"#9ee67e",
			"#86dc6e",
			"#b4ee96"
		],
		hdr: 1,
		alpha: 1
	},
	lifeMotes: {
		...Ke,
		count: 6,
		life: [.5, .9],
		size: [.12, .2],
		sizeEnd: .6,
		spawnSize: [
			.35,
			.3,
			.35
		],
		velocity: [
			0,
			.5,
			0
		],
		burstSpeed: [.15, .55],
		burstUp: [.15, .5],
		gravity: .3,
		drag: 2,
		colors: ["#9ee67e", "#86dc6e"],
		hdr: 1.1,
		alpha: 1
	},
	lifeAscend: {
		...Ke,
		count: 2,
		life: [.6, 1],
		size: [.1, .18],
		sizeEnd: .4,
		spawnSize: [
			.4,
			.4,
			.4
		],
		velocity: [
			0,
			1.6,
			0
		],
		burstSpeed: [.1, .3],
		burstUp: [0, .3],
		gravity: .5,
		drag: 1,
		colors: ["#9ee67e", "#b4ee96"],
		hdr: 1.05,
		alpha: 1
	}
}, ht = {
	earthDustRing: {
		...qe,
		count: 12,
		life: [.6, 1],
		size: [.3, .5],
		sizeEnd: 1.6,
		spawnSize: [
			.5,
			.1,
			.5
		],
		burstSpeed: [5, 7.5],
		burstUp: [.03, .15],
		gravity: -.6,
		drag: 3,
		spin: [.5, 1.5],
		color: "#c9b08c",
		colorEnd: "#9c8770",
		alpha: .5
	},
	earthGrit: {
		...Je,
		count: 5,
		life: [.6, .9],
		size: [.05, .09],
		sizeEnd: .8,
		spawnSize: [
			1.2,
			.05,
			1.2
		],
		burstSpeed: [.05, .25],
		burstUp: [.6, 1.2],
		gravity: .4,
		drag: 2.5,
		colors: [
			"#8c7658",
			"#6c5842",
			"#a89070"
		],
		hdr: 1,
		alpha: 1
	},
	earthChips: {
		...Je,
		count: 3,
		life: [.5, .9],
		size: [.08, .15],
		sizeEnd: .8,
		spawnSize: [
			.3,
			.5,
			.3
		],
		burstSpeed: [1.2, 3],
		burstUp: [2, 4],
		gravity: -16,
		drag: .4,
		ballistic: !0,
		colors: [
			"#7a6650",
			"#5a4a3a",
			"#9c8468"
		],
		hdr: .9,
		alpha: 1
	},
	earthChipPuff: {
		...qe,
		count: 2,
		life: [.4, .6],
		size: [.2, .3],
		sizeEnd: 2.4,
		spawnSize: [
			.3,
			.05,
			.3
		],
		burstSpeed: [.3, .8],
		burstUp: [.1, .4],
		gravity: -.3,
		drag: 3,
		spin: [.5, 1.5],
		color: "#b8a080",
		colorEnd: "#9c8770",
		alpha: .5
	},
	earthShieldSpark: {
		...Ge,
		count: 6,
		life: [.15, .3],
		size: [.04, .06],
		sizeEnd: .5,
		spawnSize: [
			.2,
			.2,
			.2
		],
		burstSpeed: [3, 6.5],
		burstUp: [.5, 2],
		gravity: -9,
		drag: 2,
		colors: ["#ffe0a0", "#ffc060"],
		hdr: 1.6,
		alpha: 1
	},
	earthCrySpark: {
		...Ge,
		count: 8,
		life: [.3, .6],
		size: [.05, .08],
		sizeEnd: .5,
		spawnSize: [
			.6,
			.6,
			.6
		],
		burstSpeed: [3, 6.5],
		burstUp: [.5, 2.5],
		gravity: -4,
		drag: 2.5,
		colors: ["#ffd070", "#ffb040"],
		hdr: 1.6,
		alpha: 1
	},
	earthWardMote: {
		...Ke,
		count: 8,
		life: [.6, 1],
		size: [.12, .2],
		sizeEnd: .5,
		spawnSize: [
			3.6,
			1.4,
			3.6
		],
		velocity: [
			0,
			.8,
			0
		],
		burstSpeed: [.1, .4],
		burstUp: [.2, .6],
		gravity: .3,
		drag: 1.5,
		colors: ["#a8d2ff", "#7cb4f2"],
		hdr: 1.3,
		alpha: 1
	}
}, gt = Object.freeze([
	We,
	Ye,
	rt,
	ut,
	pt,
	mt,
	ht
]);
function _t() {
	for (let e of gt) we(e);
}
function vt(e) {
	we(e);
}
//#endregion
//#region src/game/combat/ai/slime.js
var C = (e) => e / 60, yt = 1e-6, bt = 9, xt = 27, St = 42, Ct = .25, wt = 2.2 * St / 60, Tt = .7, Et = 2.2, Dt = 30, Ot = 12, kt = 2.4, At = .4, jt = 42, Mt = 84, Nt = {
	init() {
		return {
			hop: 0,
			tx: 0,
			tz: 0,
			v: 0,
			cd: 0,
			pause: 0,
			wander: !1,
			wx: 0,
			wz: 0,
			side: 1,
			leapX: 0,
			leapZ: 1,
			tag: 0
		};
	},
	idle(e, t, n) {
		let r = e.ai;
		if (r.pause > 0 && r.hop === 0) {
			r.pause -= t, e.lift = 0, e.anim("idle");
			return;
		}
		if (r.hop === 0) {
			if (!r.wander) {
				let t = e.rng.next() * Math.PI * 2, n = Math.sqrt(e.rng.next()) * e.homeRadius;
				r.wx = e.home.x + Math.cos(t) * n, r.wz = e.home.z + Math.sin(t) * n, r.wander = !0;
			}
			Pt(e, r.wx, r.wz, Tt);
		}
		if (Ft(e, t, n, !1)) {
			let t = e.position;
			(Math.hypot(r.wx - t.x, r.wz - t.z) < .4 || e.stuck) && (r.wander = !1, r.pause = C(e.rng.int(30, 120)), e.resetSeek());
		}
	},
	engage(e, t, n) {
		let r = e.ai, i = e.tp;
		r.cd > 0 && (r.cd -= t);
		let a = e.canMelee(n);
		if (r.hop < C(bt) - yt && r.cd <= 0 && a && i.d <= Et && e.canWindup(n) && e.takeToken(n)) {
			r.hop = 0, e.lift = 0, e.setState("windup");
			return;
		}
		if (r.hop === 0) {
			let t = e.position;
			if (a && i.d <= 2.8000000000000003) {
				e.rng.chance(.25) && (r.side = -r.side);
				let n = -i.dz * r.side, a = i.dx * r.side, o = i.d < 1.3 ? -.6 : 0;
				Pt(e, t.x + (n + i.dx * o) * 2, t.z + (a + i.dz * o) * 2, wt * .6);
			} else {
				let t = e.chasePoint(n);
				Pt(e, t.x, t.z, Math.min(wt, Math.max(.3, i.d - 1.2)));
			}
		}
		Ft(e, t, n, !0);
	},
	attack(e, t, n) {
		let r = e.ai, i = n.player.position, a = e.position;
		if (e.state === "windup") {
			e.entered && n.sfx("slimeHop", a.x, a.z), e.face(i.x, i.z), e.pose("windup"), e.after(Dt) && (r.leapX = e.facing.x, r.leapZ = e.facing.z, r.tag = e.newTag(), e.setState("active"));
			return;
		}
		if (e.state === "active") {
			if (e.after(Ot)) {
				e.lift = 0, n.burst("footstep", a.x, a.y + .05, a.z, 4), e.setState("recover");
				return;
			}
			e.pose("attack");
			let i = Math.min(t, C(Ot) - e.t);
			i > 0 && e.move(r.leapX * (kt / C(Ot)) * i, r.leapZ * (kt / C(Ot)) * i, n);
			let o = Math.min(1, (e.t + t) / C(Ot));
			e.lift = At * 4 * o * (1 - o);
			let s = e.hitSpec();
			s.shape = "circle", s.r = .6, s.mv = 1, s.kb = .8, s.tag = r.tag, n.hitbox(e, s);
			return;
		}
		e.pose("land"), e.after(jt) && (e.dropToken(n), r.cd = C(Mt), r.hop = 0, e.setState("engage"));
	},
	cancel(e) {
		e.ai.hop = 0, e.lift = 0;
	}
};
function Pt(e, t, n, r) {
	let i = e.ai, a = e.position, o = t - a.x, s = n - a.z, c = Math.hypot(o, s);
	if (c < 1e-4) {
		i.tx = a.x, i.tz = a.z, i.v = 0;
		return;
	}
	let l = Math.min(r, c) / c;
	i.tx = a.x + o * l, i.tz = a.z + s * l, i.v = c * l / C(xt);
}
function Ft(e, t, n, r) {
	let i = e.ai, a = i.hop, o = e.position;
	if (a < C(bt) - yt) e.lift = 0, e.pose("move0"), a + t >= C(bt) - yt && r && n.sfx("slimeHop", o.x, o.z);
	else if (a < C(36) - yt) {
		let r = (a - C(bt)) / C(xt), s = Math.min(1, r + t / C(xt));
		e.lift = Ct * 4 * s * (1 - s), e.pose(r < .5 ? "move1" : "move2"), i.v > 0 && Math.hypot(i.tx - o.x, i.tz - o.z) > .001 && e.seek(i.tx, i.tz, i.v, t, n, null);
	} else e.lift = 0, e.pose("land");
	return i.hop = a + t, i.hop >= C(St) - yt && (i.hop = 0, e.endDetour(), !0);
}
//#endregion
//#region src/game/combat/ai/goblin.js
var It = (e) => e / 60, Lt = 3, Rt = 2.5, zt = 3.5, Bt = 3.2, Vt = 1.5, Ht = 27, Ut = 18, Wt = 6, Gt = 6, Kt = .8, qt = .4, Jt = .3, Yt = 36, Xt = 60, Zt = .2, Qt = 1.2, $t = 10, en = 90, tn = /^(attack|skill1|a[123])$/, nn = {
	init(e) {
		return {
			side: e.rng.chance(.5) ? 1 : -1,
			flip: It(e.rng.int(90, 180)),
			blocked: 0,
			cd: 0,
			follow: !1,
			tag: 0,
			lx: 0,
			lz: 1,
			hopT: -1,
			hopX: 0,
			hopZ: 0,
			hopCd: 0,
			prevAction: null,
			prevSwing: 0
		};
	},
	engage(e, t, n) {
		let r = e.ai, i = e.tp, a = n.player;
		if (r.cd > 0 && (r.cd -= t), r.hopCd > 0 && (r.hopCd -= t), r.hopT >= 0) {
			let i = It($t), o = Math.min(i, r.hopT + t), s = Qt * (1 - (1 - o / i) ** 2 - (1 - (1 - r.hopT / i) ** 2));
			e.move(r.hopX * s, r.hopZ * s, n), e.face(a.position.x, a.position.z), e.pose("tuck"), r.hopT = o >= i - 1e-6 ? -1 : o;
			return;
		}
		let o = a.action, s = a.swing ?? 0;
		if ((o !== r.prevAction || s !== r.prevSwing) && (r.prevAction = o, r.prevSwing = s, o && tn.test(o) && i.d <= 2 && r.hopCd <= 0 && e.rng.chance(Zt))) {
			r.hopT = 0, r.hopX = -i.dx, r.hopZ = -i.dz, r.hopCd = It(en), e.pose("tuck");
			return;
		}
		let c = r.cd <= 0, l = e.canMelee(n);
		if (c && l && i.d <= Bt && e.canWindup(n) && e.takeToken(n)) {
			r.follow = !1, e.setState("windup");
			return;
		}
		if (i.d > zt || !l || c && i.d > 2.9000000000000004 && !e.canWindup(n)) {
			e.chase(3, t, n, "walk");
			return;
		}
		r.flip -= t, r.flip <= 0 && (e.rng.chance(.5) && (r.side = -r.side), r.flip = It(e.rng.int(90, 180)));
		let u = -i.dz * r.side, d = i.dx * r.side, f = i.d < Rt ? -.7 : Math.max(-.5, Math.min(.8, (i.d - Lt) * 1.6));
		u += i.dx * f, d += i.dz * f;
		let p = Math.hypot(u, d) || 1, m = e.walk(u / p, d / p, 2.5, t, n, "walk", !1);
		e.face(a.position.x, a.position.z), r.blocked = m < .25 ? r.blocked + t : 0, r.blocked > It(12) && (r.side = -r.side, r.blocked = 0);
	},
	attack(e, t, n) {
		let r = e.ai, i = n.player.position, a = e.tp;
		if (e.state === "windup") {
			let o = r.follow ? Ut : Ht;
			e.entered && n.sfx("windup", e.position.x, e.position.z), e.pose("windup"), e.t < It(o - Wt) - 1e-6 && (e.face(i.x, i.z), !r.follow && a.d > Vt && e.walk(a.dx, a.dz, 2.5, t, n, null, !1)), e.after(o) && (r.lx = e.facing.x, r.lz = e.facing.z, r.tag = e.newTag(), e.setState("active"));
			return;
		}
		if (e.state === "active") {
			if (e.after(Gt)) {
				!r.follow && e.rng.chance(Jt) ? (r.follow = !0, e.setState("windup")) : e.setState("recover");
				return;
			}
			e.pose(r.follow ? "attack2" : "attack");
			let i = (r.follow ? qt : Kt) / It(Gt);
			e.move(r.lx * i * t, r.lz * i * t, n);
			let a = e.hitSpec();
			a.shape = "sector", a.r = 1.3, a.halfAngle = 60, a.dirX = r.lx, a.dirZ = r.lz, a.mv = 1, a.kb = .6, a.tag = r.tag, n.hitbox(e, a), e.entered && n.sfx("swing", e.position.x, e.position.z);
			return;
		}
		e.fr < 12 ? e.pose("follow") : (e.face(i.x, i.z), e.anim("idle")), e.after(Yt) && (e.dropToken(n), r.cd = It(Xt), e.setState("engage"));
	},
	cancel(e) {
		e.ai.follow = !1, e.ai.hopT = -1;
	}
}, rn = 1e-6, w = (e) => e / 60, an = (e) => Math.floor(e * 60 + rn), on = Object.freeze({
	hp: 12,
	mp: 5,
	atk: 3,
	def: 1
}), sn = (e, t = 0) => 100 + on.hp * (e - 1) + t, cn = (e, t = 0) => 40 + on.mp * (e - 1) + t, ln = (e, t = 0) => 12 + on.atk * (e - 1) + t, un = (e, t = 0) => 4 + on.def * (e - 1) + t, dn = (e) => Math.round(30 * e ** 1.6), fn = Object.freeze({
	maxHp: 20,
	maxMp: 10,
	attack: 3,
	core: 20
}), pn = Object.freeze([
	Object.freeze({
		id: "skill1",
		name: "Whirl Slash",
		str: "skill1",
		unlock: 1,
		mp: 10,
		cooldown: 4,
		icon: "whirl",
		keys: "U/1"
	}),
	Object.freeze({
		id: "skill2",
		name: "Ember Bolt",
		str: "skill2",
		unlock: 2,
		mp: 8,
		cooldown: 1.5,
		icon: "bolt",
		keys: "I/2"
	}),
	Object.freeze({
		id: "skill3",
		name: "Radiant Nova",
		str: "skill3",
		unlock: 4,
		mp: 18,
		cooldown: 12,
		icon: "nova",
		keys: "O/3"
	})
]), mn = Object.freeze([
	Object.freeze({
		id: "skill1",
		name: "Tempest Edge",
		str: "tempest",
		unlock: 10,
		mp: 16,
		cooldown: 6,
		icon: "tempest",
		keys: "U/1"
	}),
	Object.freeze({
		id: "skill2",
		name: "Dragonfang Wave",
		str: "dragonfang",
		unlock: 10,
		mp: 12,
		cooldown: 3.5,
		icon: "dragonfang",
		keys: "I/2"
	}),
	Object.freeze({
		id: "skill3",
		name: "Skyfall Judgement",
		str: "skyfall",
		unlock: 10,
		mp: 30,
		cooldown: 15,
		icon: "skyfall",
		keys: "O/3"
	})
]), hn = Object.freeze([
	Object.freeze({
		id: "skill1",
		name: "Peal",
		str: "peal",
		unlock: 3,
		mp: 8,
		cooldown: 3,
		icon: "peal",
		keys: "U/1"
	}),
	Object.freeze({
		id: "skill2",
		name: "Toll",
		str: "toll",
		unlock: 5,
		mp: 16,
		cooldown: 9,
		icon: "toll",
		keys: "I/2"
	}),
	Object.freeze({
		id: "skill3",
		name: "Carillon",
		str: "carillon",
		unlock: 8,
		mp: 30,
		cooldown: 18,
		icon: "carillon",
		keys: "O/3"
	})
]), gn = .5, _n = 1.2, vn = Object.freeze({
	A1: 5,
	A2: 5,
	A3: 8,
	roll: 25,
	backstep: 15
}), yn = 1.35, bn = .8, xn = .12, Sn = .4, Cn = Object.freeze([
	Object.freeze({
		id: "draught",
		name: "Healing Draught",
		price: 25,
		once: !1,
		upgrade: null,
		amount: 0,
		gain: "heals 40 %"
	}),
	Object.freeze({
		id: "whetstone",
		name: "Whetstone",
		price: 120,
		once: !0,
		upgrade: "attack",
		amount: 2,
		gain: "ATK +2"
	}),
	Object.freeze({
		id: "tonic",
		name: "Ironbark Tonic",
		price: 90,
		once: !0,
		upgrade: "maxHp",
		amount: 15,
		gain: "Max HP +15"
	}),
	Object.freeze({
		id: "charm",
		name: "Warding Charm",
		price: 150,
		once: !0,
		upgrade: "def",
		amount: 3,
		gain: "DEF +3"
	})
]), wn = (e) => Cn.find((t) => t.name === e) ?? null, Tn = Object.freeze({
	sp: 15,
	mp: 5,
	cooldown: 3,
	enemyScale: .35,
	time: .6
}), En = .3, Dn = Object.freeze([0, 1.8]), On = .6, kn = .9, An = Object.freeze({
	base: .08,
	rear: .12,
	exposed: .3,
	finisher: .1,
	mult: 1.75
}), jn = (e) => 40 / (40 + 2 * e), Mn = Object.freeze([
	Object.freeze({
		id: "A1",
		total: 22,
		poses: [
			[
				0,
				4,
				"wind"
			],
			[
				5,
				9,
				"slash"
			],
			[
				10,
				21,
				"follow"
			]
		],
		active: [5, 7],
		next: 14,
		dodge: 8,
		lunge: .4,
		lungeFrames: [3, 7],
		hits: [{
			shape: "sector",
			r: 1.6,
			halfAngle: 60
		}],
		mv: 1,
		kb: .5,
		sp: vn.A1,
		poise: 10,
		fx: "slash",
		flip: !1,
		sfx: "swing",
		fxAt: 5,
		hitStop: 4,
		finisher: !1
	}),
	Object.freeze({
		id: "A2",
		total: 24,
		poses: [
			[
				0,
				4,
				"follow"
			],
			[
				5,
				9,
				"backhand"
			],
			[
				10,
				23,
				"wind"
			]
		],
		active: [5, 7],
		next: 15,
		dodge: 8,
		lunge: .4,
		lungeFrames: [3, 7],
		hits: [{
			shape: "sector",
			r: 1.6,
			halfAngle: 60
		}],
		mv: 1.1,
		kb: .6,
		sp: vn.A2,
		poise: 12,
		fx: "slash",
		flip: !0,
		sfx: "swing",
		fxAt: 5,
		hitStop: 4,
		finisher: !1
	}),
	Object.freeze({
		id: "A3",
		total: 39,
		poses: [
			[
				0,
				9,
				"wind"
			],
			[
				10,
				16,
				"thrust"
			],
			[
				17,
				38,
				"follow"
			]
		],
		active: [10, 14],
		next: 32,
		dodge: 15,
		lunge: .8,
		lungeFrames: [8, 12],
		hits: [{
			shape: "lane",
			len: 2.2,
			width: 1
		}, {
			shape: "sector",
			r: 2,
			halfAngle: 35
		}],
		mv: 1.8,
		kb: 2,
		sp: vn.A3,
		poise: 30,
		fx: "thrust",
		flip: !1,
		sfx: "swingHeavy",
		fxAt: 10,
		hitStop: 7,
		finisher: !0
	})
]), Nn = Object.freeze({
	range: 3,
	maxTurnDeg: 60,
	reach: .6,
	extra: .5
}), Pn = Object.freeze({
	total: 22,
	poses: [
		[
			0,
			2,
			"tuck"
		],
		[
			3,
			12,
			"roll"
		],
		[
			13,
			17,
			"tuck"
		],
		[
			18,
			21,
			"wind"
		]
	],
	iframes: [1, 13],
	dist: 3.2,
	moveFrames: 15,
	attackFrom: 16,
	dodgeFrom: 18,
	skillFrom: 18,
	rollSlashLunge: .3,
	perfect: [1, 8]
}), Fn = Object.freeze({
	total: 16,
	poses: [[
		0,
		15,
		"tuck"
	]],
	iframes: [1, 8],
	dist: 1.8,
	moveFrames: 10,
	attackFrom: 10,
	dodgeFrom: 12,
	skillFrom: 12,
	perfect: [1, 8]
}), In = Object.freeze({
	total: 32,
	pose: "spin",
	hits: [[6, 8], [14, 16]],
	r: 2.2,
	mv: 1.2,
	kb: 1.4,
	poise: 15,
	armor: 24,
	dodgeFrom: 24,
	hitStop: 3
}), Ln = Object.freeze({
	total: 20,
	pose: "cast",
	release: 8,
	speed: 14,
	range: 12,
	radius: .35,
	mv: 2,
	kb: .8,
	poise: 20,
	splash: Object.freeze({
		r: 1,
		mv: .6
	}),
	cone: 45,
	dodgeFrom: 12,
	attackFrom: 14,
	hitStop: 3
}), T = Object.freeze({
	total: 40,
	poses: [
		[
			0,
			19,
			"cast"
		],
		[
			20,
			27,
			"spin"
		],
		[
			28,
			39,
			"follow"
		]
	],
	grow: 20,
	at: 20,
	r: 3.2,
	mv: 2.6,
	kb: 2.2,
	poise: 60,
	iframes: [4, 20],
	dodgeFrom: 30,
	hitStop: 5
}), Rn = Object.freeze({
	total: 30,
	pose: "aim",
	at: 18,
	cooldown: 1
}), zn = Object.freeze({
	total: 50,
	poses: [
		[
			0,
			5,
			"wind"
		],
		[
			6,
			41,
			"spin"
		],
		[
			42,
			49,
			"follow"
		]
	],
	spinFrom: 6,
	spinTo: 41,
	spinStep: 3,
	drift: 1.6,
	hits: [
		[12, 14],
		[24, 26],
		[36, 39]
	],
	r: 3.6,
	mv: [
		1.2,
		1.2,
		1.7
	],
	kb: [
		.8,
		.8,
		2.4
	],
	poise: [
		16,
		16,
		32
	],
	armor: 40,
	dodgeFrom: 40,
	hitStop: 3,
	finalStop: 5,
	blades: 4,
	bladesAt: 4,
	bladeOpen: 14,
	bladeR: 3,
	release: 40,
	spin: 15
}), Bn = Object.freeze({
	total: 30,
	poses: [
		[
			0,
			9,
			"wind"
		],
		[
			10,
			15,
			"slash"
		],
		[
			16,
			29,
			"follow"
		]
	],
	release: 10,
	lunge: .5,
	lungeFrames: [5, 10],
	speed: 24,
	range: 10,
	width: 3,
	mv: 3.2,
	kb: 2.2,
	poise: 45,
	wall: .9,
	drop: 2.6,
	dodgeFrom: 16,
	attackFrom: 20,
	hitStop: 5
}), Vn = Object.freeze({
	total: 66,
	poses: [
		[
			0,
			7,
			"tuck"
		],
		[
			8,
			19,
			"cast"
		],
		[
			20,
			27,
			"slash"
		],
		[
			28,
			35,
			"thrust"
		],
		[
			36,
			57,
			"follow"
		],
		[
			58,
			65,
			"wind"
		]
	],
	rise: 8,
	land: 28,
	height: 2.4,
	reach: 7,
	gap: .8,
	forward: 2.5,
	leapMax: 5.5,
	swordAt: 12,
	swordY: 10,
	r: 5.5,
	mv: 5,
	kb: 3,
	poise: 120,
	iframes: [3, 34],
	dodgeFrom: 46,
	hitStop: 8,
	shake: [.42, .6]
}), Hn = Object.freeze({
	traveler: Object.freeze({
		id: "traveler",
		skills: pn,
		mpRegen: bn
	}),
	swordmaster: Object.freeze({
		id: "swordmaster",
		skills: mn,
		mpRegen: 1.5
	}),
	bellwarden: Object.freeze({
		id: "bellwarden",
		skills: hn,
		mpRegen: 1
	})
}), Un = Object.freeze({
	total: 18,
	pose: "hurt",
	slide: 10,
	iframes: 48
}), Wn = Object.freeze({
	down: 36,
	getUp: 18,
	slide: 14,
	iframesAfter: 30,
	techFrom: 24,
	kb: 2.5
}), Gn = w(60), Kn = .25, qn = 1.2, Jn = .1, Yn = w(10), Xn = Object.freeze({
	range: 5,
	halfAngle: 75,
	boltRange: 12,
	boltHalfAngle: 45
}), Zn = Object.freeze({
	range: 14,
	retarget: 8,
	breakAt: 16,
	focusShare: .3,
	focusClamp: 4,
	lambda: 6
}), Qn = Object.freeze({
	share: .45,
	clamp: 6,
	lambda: 4,
	minDistance: 30
}), $n = Object.freeze({
	range: 16,
	linger: 3
}), er = Object.freeze({
	attune: 2,
	stand: 1.2,
	restDraughts: 3
}), tr = Object.freeze({
	near: 8,
	los: 12
}), nr = 64, rr = Object.freeze({
	burst: "swarmSpark",
	wall: 5,
	range: 3,
	sfx: "boltHit",
	volume: .45,
	pitch: 1.3
}), ir = .25, ar = {
	arrow: {
		frame: "arrow",
		mode: "flat",
		color: [
			1.6,
			1.35,
			1
		],
		scale: 1,
		rot: Math.PI / 2
	},
	emberBolt: {
		frame: "emberBolt",
		mode: "billboard",
		color: [
			3.2,
			1.5,
			.5
		],
		scale: 1.2
	},
	boulder: {
		frame: "boulder",
		mode: "billboard",
		color: [
			1.1,
			.95,
			.85
		],
		scale: 1.8
	},
	swarmOrb: {
		frame: "swarmOrb",
		mode: "billboard",
		color: [
			2.4,
			1.05,
			.32
		],
		scale: 1,
		end: rr
	},
	swarmSpit: {
		frame: "swarmSpit",
		mode: "billboard",
		color: [
			2.6,
			.95,
			.28
		],
		scale: .9,
		end: rr
	}
}, or = Object.freeze(Object.keys(ar)), sr = class {
	constructor(e) {
		this.sys = e, this.items = [];
		for (let e = 0; e < nr; e++) this.items.push({
			alive: !1,
			owner: null,
			player: !1,
			ally: null,
			kind: "arrow",
			x: 0,
			y: 0,
			z: 0,
			dirX: 0,
			dirZ: 1,
			vy: 0,
			speed: 0,
			range: 0,
			traveled: 0,
			radius: .2,
			mv: 1,
			kb: 0,
			poise: 0,
			pierce: !1,
			splash: null,
			splashTag: 0,
			arc: null,
			sx: 0,
			sy: 0,
			sz: 0,
			ty: 0,
			t: 0,
			tag: 0,
			h: -1,
			age: 0,
			serial: 0,
			_arc: {
				tx: 0,
				tz: 0,
				time: 0,
				apex: 2
			},
			chill: 0,
			slow: 0,
			freeze: 0,
			stun: 0,
			mark: 0,
			consume: 0,
			feel: null,
			look: null,
			trailT: 0
		});
		this._serial = 0, this._p = {
			x: 0,
			y: 0,
			z: 0,
			frame: "",
			index: 0,
			scale: 1,
			rot: 0,
			mode: "billboard",
			dirX: 0,
			dirZ: 1,
			r: 1,
			g: 1,
			b: 1,
			a: 1
		}, this._colliders = [], this._count = 0;
	}
	get count() {
		return this._count;
	}
	spawn(e, t, n = null) {
		let r = -1;
		for (let e = 0; e < nr; e++) if (!this.items[e].alive) {
			r = e;
			break;
		}
		if (r < 0) return -1;
		let i = this.items[r], a = Math.hypot(t.dirX ?? 0, t.dirZ ?? 1) || 1;
		if (i.alive = !0, i.owner = n ?? e, i.player = e === "player", i.ally = n, i.kind = ar[t.kind] ? t.kind : "arrow", i.x = t.x, i.y = t.y, i.z = t.z, i.dirX = (t.dirX ?? 0) / a, i.dirZ = (t.dirZ ?? 1) / a, i.vy = t.vy ?? 0, i.speed = t.speed ?? 10, i.range = t.range ?? 12, i.traveled = 0, i.radius = t.radius ?? .2, i.mv = t.mv ?? 1, i.kb = t.kb ?? 0, i.poise = t.poise ?? 0, i.pierce = !!t.pierce, i.splash = t.splash ?? null, i.chill = cr(t.chill), i.slow = cr(t.slow), i.freeze = cr(t.freeze), i.stun = cr(t.stun), i.mark = cr(t.mark), i.consume = cr(t.consume), i.feel = t.feel ?? null, i.look = t.look && typeof t.look.frame == "string" ? t.look : null, i.trailT = 0, t.arc) {
			let e = i._arc;
			e.tx = t.arc.tx, e.tz = t.arc.tz, e.time = Math.max(.05, t.arc.time), e.apex = t.arc.apex ?? 2, i.arc = e;
		} else i.arc = null;
		return i.sx = t.x, i.sy = t.y, i.sz = t.z, i.ty = i.arc ? this.sys.groundAt(i.arc.tx, i.arc.tz) : 0, i.t = 0, i.age = 0, i.serial = ++this._serial, i.tag = this.sys.tags.next(), i.splashTag = i.splash ? this.sys.tags.next() : 0, i.h = this.sys.quads.alloc(), this._count++, this._write(i), r;
	}
	step(e, t) {
		if (this._count) for (let n = 0; n < nr; n++) {
			let r = this.items[n];
			if (!r.alive) continue;
			let i = r.player ? e : t;
			r.age += i, this.sys.tags.keep(r.tag, this.sys.stepNo), r.arc ? this._stepArc(r, i) : this._stepStraight(r, i), r.alive && r.look?.trail && this._trail(r, i);
		}
	}
	_trail(e, t) {
		let n = e.look;
		e.trailT -= t, !(e.trailT > 0) && (e.trailT += Math.max(.016, n.trailEvery ?? .05), e.trailT <= 0 && (e.trailT = Math.max(.016, n.trailEvery ?? .05)), this.sys.burst(n.trail, e.x, e.y, e.z, n.trailCount ?? 2));
	}
	impact(e) {
		let t = e.look;
		if (!t) return !1;
		let n = this.sys;
		return t.hitBurst && n.burst(t.hitBurst, e.x, e.y, e.z, t.hitCount ?? 8), t.hitFx && n.fx.play(t.hitFx, e.x, n.groundAt(e.x, e.z), e.z, t.hitFxScale ? { scale: t.hitFxScale } : void 0), t.hitSfx && n.sfxAt(t.hitSfx, e.x, e.z, {
			volume: t.hitVolume ?? .8,
			pitch: t.hitPitch ?? 1
		}), !0;
	}
	_stepStraight(e, t) {
		let n = this.sys.tileMap, r = e.speed * t, i = Math.max(1, Math.ceil(r / ir)), a = r / i, o = e.vy * t / i;
		for (let t = 0; t < i; t++) {
			if (e.x += e.dirX * a, e.z += e.dirZ * a, e.y += o, e.traveled += a, e.x < 0 || e.z < 0 || e.x > n.width || e.z > n.depth) {
				this._expire(e, !1);
				return;
			}
			if (n.getHeight(e.x, e.z) > e.y - .1 || this._inCollider(e.x, e.z)) {
				this._expire(e, !0);
				return;
			}
			if (this._contact(e)) return;
			if (e.traveled >= e.range) {
				this._expire(e, !1);
				return;
			}
		}
		this._write(e);
	}
	_stepArc(e, t) {
		let n = e.arc;
		e.t += t;
		let r = Math.min(1, e.t / n.time);
		if (e.x = e.sx + (n.tx - e.sx) * r, e.z = e.sz + (n.tz - e.sz) * r, e.y = e.sy + (e.ty - e.sy) * r + n.apex * 4 * r * (1 - r), r >= 1) {
			this.sys.queueLanding(e), this._free(e);
			return;
		}
		this._write(e);
	}
	_contact(e) {
		let t = this.sys;
		if (e.owner === "fx" || t._ambient) return !1;
		if (e.player) {
			let n = t.enemies;
			for (let r = 0; r < n.length; r++) {
				let i = n[r];
				if (!i.alive || i.dormant || !i.sprite.visible || i.submerged) continue;
				let a = i.position.x - e.x, o = i.position.z - e.z, s = e.radius + i.radius;
				if (a * a + o * o >= s * s) continue;
				let c = t.bodyBase(i), l = i.def.body;
				if (!(e.y + e.radius < c + l[0] || e.y - e.radius > c + l[1]) && !t.tags.has(e.tag, i) && (t.queueProjectileHit(e, i), !e.pierce)) return this._free(e), !0;
			}
			return !1;
		}
		return this._contactPlayer(e) ? !0 : t.allies.length > 0 && this._contactAllies(e);
	}
	_contactPlayer(e) {
		let t = this.sys, n = t.player;
		if (!t.pc.alive) return !1;
		let r = n.position.x - e.x, i = n.position.z - e.z, a = e.radius + n.radius;
		if (r * r + i * i >= a * a) return !1;
		let o = n.position.y;
		return e.y + e.radius < o || e.y - e.radius > o + t.pc.body[1] || t.tags.has(e.tag, "player") ? !1 : t.pc.invulnerable ? (t.tags.add(e.tag, "player", t.stepNo), t.pc.notePerfectDodge(), !1) : (t.queueProjectileHit(e, "player"), !e.pierce && (this._free(e), !0));
	}
	_contactAllies(e) {
		let t = this.sys, n = t.allies;
		for (let r = 0; r < n.length; r++) {
			let i = n[r];
			if (!i.present) continue;
			let a = i.position, o = a.x - e.x, s = a.z - e.z, c = e.radius + i.radius;
			if (!(o * o + s * s >= c * c) && !(e.y + e.radius < a.y + i.view.body[0] || e.y - e.radius > a.y + i.view.body[1]) && !t.tags.has(e.tag, i)) {
				if (!i.hittable) {
					t.tags.add(e.tag, i, t.stepNo);
					continue;
				}
				if (t.queueProjectileHit(e, i), !e.pierce) return this._free(e), !0;
			}
		}
		return !1;
	}
	_inCollider(e, t) {
		let n = this.sys.tileMap.queryColliders(e - .01, t - .01, e + .01, t + .01, this._colliders);
		for (let r = 0; r < n.length; r++) {
			let i = n[r];
			if (i.type === "circle") {
				let n = e - i.x, r = t - i.z;
				if (n * n + r * r < i.r * i.r) return !0;
			} else if (e > i.minX && e < i.maxX && t > i.minZ && t < i.maxZ) return !0;
		}
		return !1;
	}
	_expire(e, t) {
		let n = this.sys, r = ar[e.kind].end;
		e.look ? t ? (this.impact(e), e.splash && n.queueSplash(e)) : e.look.fadeBurst && n.burst(e.look.fadeBurst, e.x, e.y, e.z, e.look.fadeCount ?? 3) : r ? (n.burst(r.burst, e.x, e.y, e.z, t ? r.wall : r.range), t && r.sfx && n.sfxAt(r.sfx, e.x, e.z, {
			volume: r.volume ?? 1,
			pitch: r.pitch ?? 1
		})) : t ? e.kind === "emberBolt" ? (n.fx.play("impact", e.x, e.y - 1, e.z, { scale: .8 }), n.burst("emberBurst", e.x, e.y, e.z, 6), n.sfxAt("boltHit", e.x, e.z), e.splash && n.queueSplash(e)) : (n.burst("footstep", e.x, e.y, e.z, 3), n.sfxAt("arrowHit", e.x, e.z, { volume: .5 })) : e.kind === "emberBolt" && n.burst("emberBurst", e.x, e.y, e.z, 4), this._free(e);
	}
	_free(e) {
		e.alive && (e.alive = !1, e.owner = null, e.ally = null, e.feel = null, e.look = null, e.h >= 0 && this.sys.quads.free(e.h), e.h = -1, this._count--);
	}
	_write(e) {
		if (e.h < 0) return;
		let t = this._p;
		t.x = e.x, t.y = e.y, t.z = e.z, t.dirX = e.dirX, t.dirZ = e.dirZ, t.a = 1;
		let n = e.look;
		if (n) {
			let r = this.sys.atlasFrames?.[n.frame];
			t.frame = n.frame, t.index = r && r.n > 1 ? Math.floor(e.age * (n.fps || r.fps || 8)) % r.n : 0, t.scale = n.scale ?? 1, t.rot = (n.rot ?? 0) + (n.spin ?? 0) * e.age, t.mode = n.mode === "flat" ? "flat" : "billboard";
			let i = n.color;
			t.r = i?.[0] ?? 1, t.g = i?.[1] ?? 1, t.b = i?.[2] ?? 1, this.sys.quads.set(e.h, t);
			return;
		}
		let r = ar[e.kind];
		t.frame = r.frame;
		let i = this.sys.atlasFrames?.[r.frame];
		t.index = i && i.n > 1 ? Math.floor(e.age * (i.fps || 8)) % i.n : 0, t.scale = r.scale, t.rot = e.kind === "boulder" ? e.age * 6 : r.rot ?? 0, t.mode = r.mode, t.r = r.color[0], t.g = r.color[1], t.b = r.color[2], this.sys.quads.set(e.h, t);
	}
	removeOwner(e) {
		for (let t = 0; t < nr; t++) {
			let n = this.items[t];
			n.alive && n.owner === e && this._free(n);
		}
	}
	clearEnemy() {
		for (let e = 0; e < nr; e++) {
			let t = this.items[e];
			t.alive && !t.player && this._free(t);
		}
	}
	clear() {
		for (let e = 0; e < nr; e++) this._free(this.items[e]);
	}
};
function cr(e) {
	return typeof e == "number" && e > 0 ? Math.min(30, e) : 0;
}
function lr(e, t, n, r) {
	let i = (t - e) * n / Math.max(.5, r);
	return Math.max(-.6 * n, Math.min(.6 * n, i));
}
//#endregion
//#region src/game/combat/ai/archer.js
var E = (e) => e / 60, ur = Math.PI / 180, dr = 4.5, fr = 10, pr = 4.5, mr = 11, hr = 48, gr = 33, _r = .25, vr = 14, yr = 14, br = 14, xr = .5, Sr = 18, Cr = [
	-12 * ur,
	0,
	12 * ur
], wr = 1.6, Tr = 60, Er = 18, Dr = 4, Or = 12, kr = 3, Ar = 20, jr = 60, Mr = 2.2, Nr = {
	init(e) {
		return {
			cd: E(e.rng.int(20, 60)),
			shots: 0,
			side: e.rng.chance(.5) ? 1 : -1,
			strafeT: E(e.rng.int(60, 120)),
			awayT: 0,
			retreatT: 0,
			blockT: 0,
			cornerT: 0,
			hugT: 0,
			los: !1,
			losT: 0,
			move: "shot",
			n: 1,
			px: 0,
			pz: 0,
			tag: 0
		};
	},
	engage(e, t, n) {
		let r = e.ai, i = e.tp, a = n.player.position, o = e.position;
		if (r.cd > 0 && (r.cd -= t), r.retreatT > 0 && (r.retreatT -= t), r.cornerT > 0 && (r.cornerT -= t), r.hugT = i.d < wr ? r.hugT + t : 0, r.losT -= t, r.losT <= 0 && (r.los = n.los(o.x, o.z, a.x, a.z), r.losT = E(6)), r.hugT >= E(Tr) - 1e-6 && e.canWindup(n) && e.takeToken(n)) {
			r.move = "shove", e.setState("windup");
			return;
		}
		let s = r.cd <= 0, c = e.canWindup(n);
		if (s && i.d >= pr && i.d <= mr && r.los && c && e.takeToken(n)) {
			r.move = "shot", e.setState("windup");
			return;
		}
		if ((i.d < dr || r.retreatT > 0) && r.cornerT <= 0) {
			r.awayT -= t, r.awayT <= 0 && (e.bestAway(a.x, a.z, 1.5, n, !0) || (e.away.x = -i.dx, e.away.z = -i.dz), r.awayT = E(12)), r.blockT = e.walk(e.away.x, e.away.z, kr, t, n, "walk") < .25 ? r.blockT + t : 0, r.blockT >= E(Ar) - 1e-6 && (r.blockT = 0, r.retreatT = 0, r.cornerT = E(jr));
			return;
		}
		if (i.d > fr || s && !c) {
			e.chase(kr, t, n, "walk");
			return;
		}
		r.strafeT -= t, r.strafeT <= 0 && (e.rng.chance(.5) && (r.side = -r.side), r.strafeT = E(e.rng.int(60, 120)));
		let l = e.walk(-i.dz * r.side, i.dx * r.side, Mr, t, n, "walk", !1);
		e.face(a.x, a.z), l < .25 && (r.side = -r.side);
	},
	attack(e, t, n) {
		let r = e.ai;
		if (r.move === "shove") {
			Ir(e, t, n);
			return;
		}
		let i = n.player, a = e.position;
		if (e.state === "windup") {
			if (e.entered && (n.sfx("windup", a.x, a.z), r.n = r.shots % 3 == 2 ? 3 : 1), e.t < E(gr) - 1e-6 && (r.px = i.position.x + i.velocity.x * _r, r.pz = i.position.z + i.velocity.z * _r, e.face(r.px, r.pz)), e.pose("windup"), e.after(hr)) {
				Fr(e, n), e.setState("recover");
				return;
			}
			Pr(e, n, e.t / E(hr));
			return;
		}
		e.pose("attack"), e.after(Sr) && (e.dropToken(n), r.cd = E(e.rng.int(108, 144)), e.setState("engage"));
	}
};
function Pr(e, t, n) {
	let r = e.ai, i = e.position, a = Math.hypot(r.px - i.x, r.pz - i.z), o = Math.min(a + 2, br);
	for (let a = 0; a < r.n; a++) {
		let s = r.n === 1 ? 0 : Cr[a], c = Math.cos(s), l = Math.sin(s), u = e.markerSpec("lane", i.x, i.z);
		u.dirX = e.facing.x * c - e.facing.z * l, u.dirZ = e.facing.x * l + e.facing.z * c, u.len = o, u.width = xr, u.progress = Math.min(1, n), u.flash = e.lockFlash(e.t - E(gr)), e.mark(a, t, u);
	}
}
function Fr(e, t) {
	let n = e.ai, r = e.position;
	Pr(e, t, 1);
	let i = Math.hypot(n.px - r.x, n.pz - r.z), a = r.y + .9, o = lr(a, t.groundAt(n.px, n.pz) + .9, vr, i);
	for (let r = 0; r < n.n; r++) {
		let s = n.n === 1 ? 0 : Cr[r], c = Math.cos(s), l = Math.sin(s), u = e.projSpec();
		u.kind = "arrow", u.y = a, u.dirX = e.facing.x * c - e.facing.z * l, u.dirZ = e.facing.x * l + e.facing.z * c, u.vy = o, u.speed = vr, u.range = yr, u.radius = .2, u.mv = 1, u.kb = .4, t.projectile(e, u), e.markToFade(r, t, Math.min(i + 2, br) / vr);
	}
	t.sfx("arrow", r.x, r.z), n.shots++;
}
function Ir(e, t, n) {
	let r = e.ai, i = n.player.position;
	if (e.state === "windup") {
		e.entered && n.sfx("windup", e.position.x, e.position.z), e.t < E(12) - 1e-6 && e.face(i.x, i.z), e.pose("wind"), e.after(Er) && (r.tag = e.newTag(), e.setState("active"));
		return;
	}
	if (e.state === "active") {
		if (e.after(Dr)) {
			e.setState("recover");
			return;
		}
		e.pose("shove");
		let t = e.hitSpec();
		t.shape = "sector", t.r = 1.2, t.halfAngle = 50, t.mv = .6, t.kb = 1.5, t.tag = r.tag, n.hitbox(e, t);
		return;
	}
	e.pose("follow"), e.after(Or) && (e.dropToken(n), r.hugT = 0, r.retreatT = E(45), r.awayT = 0, r.move = "shot", e.setState("engage"));
}
//#endregion
//#region src/game/combat/ai/shaman.js
var Lr = (e) => e / 60, Rr = 8, zr = 2.6, Br = 10, Vr = 24, Hr = .3, Ur = 1.6, Wr = 66, Gr = 12, Kr = 150, qr = 480, Jr = 6, Yr = .6, Xr = 30, Zr = 2.5, Qr = 60, $r = 12, ei = 4, ti = 300, ni = {
	init(e) {
		return {
			cd: Lr(e.rng.int(30, 90)),
			mendT: 0,
			blinkCd: 0,
			nearT: 0,
			cast: null,
			castT: 0,
			ally: null,
			side: e.rng.chance(.5) ? 1 : -1,
			strafeT: Lr(e.rng.int(60, 120)),
			awayT: 0,
			los: !1,
			losT: 0,
			near: []
		};
	},
	engage(e, t, n) {
		let r = e.ai, i = e.tp, a = n.player.position, o = e.position;
		if (r.cd > 0 && (r.cd -= t), r.blinkCd > 0 && (r.blinkCd -= t), r.mendT += t, r.nearT = i.d < Zr ? r.nearT + t : 0, r.losT -= t, r.losT <= 0 && (r.los = n.los(o.x, o.z, a.x, a.z), r.losT = Lr(6)), r.cast === "mend") {
			ii(e, t, n);
			return;
		}
		if (r.cast === "blink") {
			ai(e, t, n);
			return;
		}
		if (r.nearT >= Lr(Qr) - 1e-6 && r.blinkCd <= 0) {
			r.cast = "blink", r.castT = 0, ai(e, t, n);
			return;
		}
		if (r.mendT >= Lr(qr) - 1e-6) {
			let i = ri(e, n);
			if (i) {
				r.cast = "mend", r.castT = 0, r.ally = i, ii(e, t, n);
				return;
			}
			r.mendT = Lr(450);
		}
		let s = r.cd <= 0, c = e.canWindup(n);
		if (s && i.d <= Br && r.los && c && e.takeToken(n)) {
			e.setState("windup");
			return;
		}
		if (i.d < 4.5) {
			r.awayT -= t, r.awayT <= 0 && (e.bestAway(a.x, a.z, 1.5, n, !0) || (e.away.x = -i.dx, e.away.z = -i.dz), r.awayT = Lr(12)), e.walk(e.away.x, e.away.z, zr, t, n, "walk");
			return;
		}
		if (i.d > Rr || s && !c || s && !r.los && i.d > 8) {
			e.chase(zr, t, n, "walk");
			return;
		}
		r.strafeT -= t, r.strafeT <= 0 && (e.rng.chance(.5) && (r.side = -r.side), r.strafeT = Lr(e.rng.int(60, 120)));
		let l = e.walk(-i.dz * r.side, i.dx * r.side, zr * .7, t, n, "walk", !1);
		e.face(a.x, a.z), l < .25 && (r.side = -r.side);
	},
	attack(e, t, n) {
		let r = e.ai, i = n.player, a = e.position;
		if (e.state === "windup") {
			if (e.entered && n.sfx("windup", a.x, a.z), e.face(i.position.x, i.position.z), e.pose("windup"), e.after(Vr)) {
				let t = i.position.x + i.velocity.x * Hr, n = i.position.z + i.velocity.z * Hr, r = e.hazardCircle(t, n, Ur, Lr(Wr));
				r.mv = 1.3, r.kb = 1, r.burst = "emberBurst", r.burstN = 10, r.sfx = "hexBurst", e.setState("active");
			}
			return;
		}
		if (e.state === "active") {
			e.pose("attack"), e.after(Wr) && e.setState("recover");
			return;
		}
		e.anim("idle"), e.after(Gr) && (e.dropToken(n), r.cd = Lr(Kr), e.setState("engage"));
	},
	cancel(e) {
		let t = e.ai;
		t.cast = null, t.ally = null, e.lift = 0;
	},
	glow(e, t) {
		t[0] = .5, t[1] = 1, t[2] = .6, t[3] = 2;
	}
};
function ri(e, t) {
	let n = t.enemiesNear(e.position.x, e.position.z, Jr, e.ai.near), r = null, i = Yr;
	for (let t = 0; t < n.length; t++) {
		let a = n[t];
		if (a === e || !a.alive || a.passive || a.boss) continue;
		let o = a.hp / a.hpMax;
		o < i - 1e-9 && (i = o, r = a);
	}
	return r;
}
function ii(e, t, n) {
	let r = e.ai, i = r.ally;
	i && e.face(i.position.x, i.position.z), e.pose("attack"), r.castT += t, r.castT >= Lr(Xr) - 1e-6 && (i && i.alive && n.heal(i, Math.round(.3 * i.hpMax)), r.cast = null, r.ally = null, r.mendT = 0);
}
function ai(e, t, n) {
	let r = e.ai, i = n.player.position, a = e.position;
	e.pose("blink"), r.castT += t, !(r.castT < Lr($r) - 1e-6) && (n.burst("deathPoof", a.x, a.y + .5, a.z, 8), e.bestAway(i.x, i.z, ei, n) || (e.away.x = -e.tp.dx, e.away.z = -e.tp.dz), e.move(e.away.x * ei, e.away.z * ei, n), n.burst("deathPoof", a.x, n.groundAt(a.x, a.z) + .5, a.z, 8), e.face(i.x, i.z), e.anim("idle"), r.cast = null, r.blinkCd = Lr(ti), r.nearT = 0);
}
//#endregion
//#region src/game/combat/ai/bat.js
var oi = (e) => e / 60, si = 1.3, ci = .15, li = .6, ui = 1.4, di = 18, fi = 9, pi = 36, mi = .6, hi = {
	init(e) {
		return {
			dir: e.rng.chance(.5) ? 1 : -1,
			w: ui + e.rng.range(-.25, .25),
			R: e.rng.range(3, 4),
			ang: e.rng.next() * Math.PI * 2,
			idleAng: e.rng.next() * Math.PI * 2,
			cd: oi(e.rng.int(90, 180)),
			diveX: 0,
			diveZ: 0,
			dx: 0,
			dz: 1,
			diveF: 0,
			tag: 0,
			clock: e.rng.next() * 10
		};
	},
	idle(e, t, n) {
		let r = e.ai;
		gi(e, t), r.idleAng += .8 * t * r.dir;
		let i = Math.min(1.2, e.homeRadius);
		_i(e, e.home.x + Math.cos(r.idleAng) * i, e.home.z + Math.sin(r.idleAng) * i, 1.5, t, n), e.anim("idle");
	},
	engage(e, t, n) {
		let r = e.ai, i = n.player.position;
		if (gi(e, t), r.cd > 0 && (r.cd -= t), r.cd <= 0 && e.canWindup(n) && e.takeToken(n)) {
			r.diveX = i.x, r.diveZ = i.z, e.setState("windup");
			return;
		}
		let a = r.cd <= 0 && !e.canWindup(n);
		r.ang += r.w * r.dir * t;
		let o = a ? Math.max(1.5, r.R - 1.5) : r.R;
		_i(e, i.x + Math.cos(r.ang) * o, i.z + Math.sin(r.ang) * o, e.def.speed, t, n), e.face(i.x, i.z), e.anim("walk");
	},
	attack(e, t, n) {
		let r = e.ai, i = e.position;
		if (e.state === "windup") {
			gi(e, t), e.entered && n.sfx("batScreech", i.x, i.z), e.face(r.diveX, r.diveZ), e.pose("windup");
			let a = e.markerSpec("circle", r.diveX, r.diveZ);
			if (a.r = mi, a.progress = Math.min(1, e.t / oi(di)), e.mark(0, n, a), e.after(di)) {
				let t = r.diveX - i.x, a = r.diveZ - i.z, o = Math.hypot(t, a);
				o > 1e-4 ? (r.dx = t / o, r.dz = a / o) : (r.dx = e.facing.x, r.dz = e.facing.z), r.diveF = Math.ceil((o + 1.5) / fi * 60), r.tag = e.newTag(), e.markProgress(0, n, 1), e.setState("active");
			}
			return;
		}
		if (e.state === "active") {
			if (e.after(r.diveF)) {
				e.unmark(0, n), e.setState("recover");
				return;
			}
			e.pose("attack"), e.hover += (li - e.hover) * Math.min(1, t / oi(6)), e.move(r.dx * fi * t, r.dz * fi * t, n);
			let i = e.hitSpec();
			i.shape = "circle", i.r = .5, i.mv = 1, i.kb = .4, i.tag = r.tag, n.hitbox(e, i);
			return;
		}
		let a = Math.min(1, (e.t + t) / oi(pi));
		e.hover = li + .7000000000000001 * (1 - (1 - a) * (1 - a)), e.anim("walk"), e.after(pi) && (e.dropToken(n), r.cd = oi(e.rng.int(90, 180)), e.setState("engage"));
	},
	cancel(e) {
		e.lift = 0;
	},
	glow(e, t) {
		t[0] = 1, t[1] = .3, t[2] = .1, t[3] = e.alive ? 2.5 : 0;
	}
};
function gi(e, t) {
	let n = e.ai;
	n.clock += t;
	let r = si + ci * Math.sin(4 * n.clock);
	e.hover += (r - e.hover) * Math.min(1, t * 10);
}
function _i(e, t, n, r, i, a) {
	let o = e.position, s = t - o.x, c = n - o.z, l = Math.hypot(s, c);
	if (l < 1e-4) return;
	let u = Math.min(l, r * i);
	e.move(s / l * u, c / l * u, a);
}
//#endregion
//#region src/game/combat/ai/boar.js
var vi = (e) => e / 60, yi = Math.PI / 180, bi = 2.4, xi = 90 * yi, Si = 4, Ci = 10, wi = 60, Ti = 30, Ei = 15, Di = 1.4, Oi = 12, ki = 1, Ai = 10, ji = 120, Mi = 30, Ni = 72, Pi = 90, Fi = 2, Ii = 27, Li = 6, Ri = 45, zi = 60, Bi = {
	init(e) {
		return {
			yaw: 0,
			cd: vi(e.rng.int(20, 60)),
			move: "charge",
			second: !1,
			len: 0,
			end: "max",
			lx: 0,
			lz: 1,
			run: 0,
			done: 0,
			skid: !1,
			dust: 0,
			tag: 0,
			los: !1,
			losT: 0
		};
	},
	engage(e, t, n) {
		let r = e.ai, i = e.tp, a = n.player.position, o = e.position;
		r.cd > 0 && (r.cd -= t), r.losT -= t, r.losT <= 0 && (r.los = n.los(o.x, o.z, a.x, a.z), r.losT = vi(6));
		let s = e.canMelee(n);
		if (r.cd <= 0 && s && i.d <= Fi && e.canWindup(n) && e.takeToken(n)) {
			r.move = "gore", e.setState("windup");
			return;
		}
		if (r.cd <= 0 && s && i.d >= Si && i.d <= Ci && r.los && e.canWindup(n) && e.takeToken(n)) {
			r.move = "charge", r.second = !1, e.setState("windup");
			return;
		}
		let c = e.chasePoint(n), l = Math.atan2(c.x - o.x, c.z - o.z);
		r.yaw = Math.atan2(e.facing.x, e.facing.z);
		let u = l - r.yaw;
		for (; u > Math.PI;) u -= 2 * Math.PI;
		for (; u < -Math.PI;) u += 2 * Math.PI;
		let d = Math.max(-xi * t, Math.min(xi * t, u));
		r.yaw += d;
		let f = Math.sin(r.yaw), p = Math.cos(r.yaw);
		if (i.d < 1.2 && s) {
			e.faceDir(f, p), e.anim("idle");
			return;
		}
		let m = Math.abs(u) > Math.PI / 2 ? .5 : 1;
		e.seek(o.x + f * 2, o.z + p * 2, bi * m, t, n, "walk");
	},
	attack(e, t, n) {
		e.ai.move === "gore" ? Hi(e, t, n) : Vi(e, t, n);
	},
	stun(e, t, n) {
		e.pose("stun"), e.after(ji) && (e.vuln = 1, e.exposed = !1, e.dropToken(n), e.ai.cd = vi(Pi), e.setState("engage"));
	},
	cancel(e) {
		e.ai.second = !1, e.ai.skid = !1, e.armored = !1, e.vuln = 1, e.exposed = !1;
	}
};
function Vi(e, t, n) {
	let r = e.ai, i = n.player.position, a = e.position;
	if (e.state === "windup") {
		let t = r.second ? Ti : wi;
		e.entered && (n.sfx("boarSnort", a.x, a.z), r.dust = 0), e.fr >= r.dust * 12 && (n.burst("footstep", a.x, a.y + .05, a.z, 4), r.dust++), e.pose("windup"), e.t < vi(t - Ei) - 1e-6 && (e.face(i.x, i.z), (e.fr % 2 == 0 || r.len === 0) && (r.len = e.freeRun(e.facing.x, e.facing.z, Oi, n), r.end = e.runEnd));
		let o = e.markerSpec("lane", a.x, a.z);
		o.len = Math.max(.5, r.len), o.width = Di, o.progress = Math.min(1, e.t / vi(t)), o.flash = e.lockFlash(e.t - vi(t - Ei)), e.mark(0, n, o), e.after(t) && (r.lx = e.facing.x, r.lz = e.facing.z, r.run = r.len + (r.end === "obstacle" ? ki : 0), r.done = 0, r.tag = e.newTag(), r.skid = !1, e.armored = !0, e.markProgress(0, n, 1), n.sfx("boarCharge", a.x, a.z), e.setState("active"));
		return;
	}
	if (e.state === "active") {
		e.armored = !0, e.pose(e.fr >> 2 & 1 ? "charge1" : "charge0");
		let i = Math.min(Ai * t, r.run - r.done), o = !1;
		if (i > 1e-5) {
			let t = a.x, s = a.z, c = e.move(r.lx * i, r.lz * i, n);
			r.done += Math.max(0, (a.x - t) * r.lx + (a.z - s) * r.lz), o = c < .4;
		}
		let s = e.hitSpec();
		if (s.shape = "circle", s.x = a.x + r.lx * .6, s.z = a.z + r.lz * .6, s.r = .8, s.mv = 1.4, s.kb = 3, s.knockdown = !0, s.tag = r.tag, s.fromX = a.x, s.fromZ = a.z, n.hitbox(e, s), o && (e.blockedBy === "terrain" || e.blockedBy === "collider")) {
			e.unmark(0, n), e.armored = !1, e.vuln = 1.5, e.exposed = !0, n.shake(.3, .4), n.sfx("stun", a.x, a.z), n.fx("stun", a.x, a.y, a.z, {
				duration: ji / 60,
				follow: e.position
			}), e.pose("stun"), e.setState("stun");
			return;
		}
		(o || r.done >= r.run - .001 || i <= 1e-5) && (e.unmark(0, n), e.armored = !1, r.skid = !0, e.setState("recover"));
		return;
	}
	if (r.skid) {
		let i = Math.min(1, e.t / vi(Mi)), o = 6 * (1 - i) * (1 - i);
		if (e.move(r.lx * o * t, r.lz * o * t, n), e.pose("charge1"), e.entered && n.burst("footstep", a.x, a.y + .05, a.z, 4), e.after(Mi)) {
			if (r.skid = !1, e.elite && !r.second) {
				r.second = !0, r.len = 0, e.setState("windup");
				return;
			}
			e.setState("recover");
		}
		return;
	}
	e.entered && e.anim("idle"), e.after(Ni) && (e.dropToken(n), r.second = !1, r.cd = vi(Pi), e.setState("engage"));
}
function Hi(e, t, n) {
	let r = e.ai, i = n.player.position, a = e.position;
	if (e.state === "windup") {
		e.entered && n.sfx("windup", a.x, a.z), e.t < vi(18) - 1e-6 && e.face(i.x, i.z), e.pose("windup");
		let t = e.markerSpec("sector", a.x, a.z);
		t.r = 1.6, t.halfAngle = 45, t.progress = Math.min(1, e.t / vi(Ii)), e.mark(0, n, t), e.after(Ii) && (r.lx = e.facing.x, r.lz = e.facing.z, r.tag = e.newTag(), e.markProgress(0, n, 1), e.setState("active"));
		return;
	}
	if (e.state === "active") {
		if (e.after(Li)) {
			e.unmark(0, n), e.setState("recover");
			return;
		}
		e.pose("attack");
		let i = .9 / vi(Li);
		e.move(r.lx * i * t, r.lz * i * t, n);
		let a = e.hitSpec();
		a.shape = "sector", a.r = 1.6, a.halfAngle = 45, a.dirX = r.lx, a.dirZ = r.lz, a.mv = 1, a.kb = 1.5, a.tag = r.tag, n.hitbox(e, a);
		return;
	}
	e.entered && e.anim("idle"), e.after(Ri) && (e.dropToken(n), r.cd = vi(zi), e.setState("engage"));
}
//#endregion
//#region src/game/combat/ai/dummy.js
var Ui = 8, Wi = {
	init() {
		return { wob: -1 };
	},
	idle(e, t) {
		let n = e.ai;
		if (n.wob < 0) {
			e.anim("idle");
			return;
		}
		let r = Math.floor(n.wob * 60 + 1e-6);
		if (r < Ui) e.pose("hurt");
		else if (r < 16) e.pose("hurt2");
		else {
			n.wob = -1, e.anim("idle");
			return;
		}
		n.wob += t;
	},
	engage(e) {
		e.setState("idle");
	},
	attack(e) {
		e.setState("idle");
	},
	onHit(e) {
		e.ai.wob = 0, e.pose("hurt");
	}
}, D = (e) => e / 60, Gi = 1e-6, Ki = Math.PI / 180, qi = 108, Ji = 60, Yi = 36, Xi = 120, Zi = 60, Qi = 90, $i = 60, ea = 180, ta = 120, na = 45, ra = [
	[54, 84],
	[54, 84],
	[36, 60]
], ia = [
	150 * Ki,
	170 * Ki,
	190 * Ki
], aa = [
	1,
	.45,
	.15
], oa = {
	windup: 60,
	active: 6,
	recover: 60,
	r: 2.6,
	ahead: 1.6,
	mv: 1.5,
	kb: 2.5,
	range: 4.5,
	near: 3
}, sa = {
	windup: 48,
	active: 6,
	recover: 36,
	r: 2.6,
	mv: 1,
	kb: 3
}, ca = {
	windup: 36,
	recover: 48,
	r: 1.4,
	fill: 72,
	lead: .5,
	lateral: 2.5,
	mv: 1.1,
	kb: 1.5,
	apex: 3.5
}, la = {
	windup: 30,
	channel: 90,
	n: 6,
	n3: 10,
	r: 1.2,
	every: 15,
	fill: 66,
	spread: 4,
	mv: 1.2,
	kb: 1
}, ua = {
	windup: 54,
	lock: 12,
	speed: 12,
	width: 1.8,
	r: 1.4,
	mv: 1.5,
	kb: 3,
	max: 40
}, da = {
	r: 2,
	dur: 240,
	flat: 6,
	tick: 30
}, fa = {
	rings: 3,
	every: 18,
	speed: 6,
	rMax: 10,
	width: .6,
	mv: 1.2,
	kb: 1.5
}, pa = {
	slam: 0,
	sweep: 120,
	toss: 180,
	rain: 420,
	charge: 300
}, ma = [.7, .35], ha = [
	"slam",
	"toss",
	"rain",
	"charge"
], ga = "bat", _a = 90, va = 2.2, ya = 5, ba = {
	init(e) {
		return {
			yaw: Math.atan2(e.facing.x, e.facing.z),
			move: null,
			pending: null,
			approachT: 0,
			last1: null,
			last2: null,
			gap: D(40),
			cd: {
				slam: 0,
				sweep: 0,
				toss: 0,
				rain: 0,
				charge: 0
			},
			offT: 0,
			stall: 0,
			cx: 0,
			cz: 0,
			tag: 0,
			lx: 0,
			lz: 1,
			len: 0,
			end: "max",
			run: 0,
			done: 0,
			skid: !1,
			trans: 0,
			phaseT: 0,
			capFloor: 0,
			ringDone: !1,
			awoke: !1,
			adds: [],
			wave2: !1,
			clock: 0,
			inset: null
		};
	},
	update(e, t, n) {
		let r = e.ai;
		r.clock += t, r.phaseT += t;
		for (let e in r.cd) r.cd[e] > 0 && (r.cd[e] -= t);
		let i = e.def.phases ?? ma, a = i[0], o = i[1];
		if (e.state !== "dormant" && e.state !== "intro") {
			e.state !== "phase" && e.state !== "kneel" && (e.phase === 1 && e.hp <= e.hpMax * a + Gi ? Da(e, 2, n) : e.phase === 2 && e.hp <= e.hpMax * o + Gi && Da(e, 3, n));
			let t = e.state === "phase" || e.state === "kneel" || e.state === "stagger" || e.state === "stun";
			e.phase >= 2 && !r.wave2 && !t && e.hp <= e.hpMax * .52 + Gi && Ha(r) < 2 && (r.wave2 = !0, Ua(e, n));
		}
		for (let r = 0; r < 4; r++) {
			let r = e.serial;
			if (xa(e, t, n), e.serial === r) break;
		}
		e.hpFloor = e.state === "kneel" ? r.capFloor : e.phase === 1 ? e.hpMax * a : e.phase === 2 ? e.hpMax * o : 0;
	},
	onHit(e, t, n) {
		if (t.guarded || e.guarded || e.armored) return;
		let r = e.state;
		(r === "engage" || r === "windup" || r === "active" || r === "recover") && (e.poise -= t.poise || 0, !(e.poise > 0) && (Ma(e, n), e.vuln = 1.3, e.exposed = !0, e.setState("stagger"), e.pose("kneel"), n.sfx("stun", e.position.x, e.position.z)));
	},
	cancel(e, t) {
		Ma(e, t);
	},
	die(e) {
		e.ai.move = null, e.ai.pending = null, e.sprite.tint.setRGB(1, 1, 1);
	},
	force(e, t) {
		let n = e.ai;
		for (let e in n.cd) n.cd[e] = e === t ? 0 : 99;
		n.gap = 0, n.pending = null, n.approachT = 0, n.offT = 0, n.stall = 0;
	},
	info(e) {
		let t = e.ai;
		return {
			move: t.move,
			pending: t.pending,
			skid: t.skid
		};
	},
	jumpPhase(e, t, n) {
		let r = e.ai;
		t = Math.max(1, Math.min(3, t | 0)), Ma(e, n), e.phase = t, e.poise = e.poiseMax, r.phaseT = D(60), r.trans = 0, e.sprite.tint.setRGB(1, t >= 2 ? .9 : 1, t >= 2 ? .85 : 1), e.state !== "dormant" && e.state !== "intro" && (e.guarded = !1, e.setState("engage"), r.gap = D(30)), n.emit("bossPhase", e, t);
	},
	glow(e, t) {
		let n = e.ai, r;
		r = e.alive ? e.state === "dormant" ? .4 : e.state === "intro" ? .4 + .2 * Math.min(1, Math.max(0, (e.t - D(Ji)) / D(48))) : e.phase === 1 ? .6 : e.phase === 2 ? .6 + 1.4 * Math.min(1, n.phaseT / D(60)) : 2.4 + .5 * (1 - Math.cos(2 * Math.PI * 2 * n.clock)) : 0, e.alive && e.state === "windup" && (r += .5 + .5 * (.5 - .5 * Math.cos(2 * Math.PI * 8 * e.t))), t[0] = aa[0], t[1] = aa[1], t[2] = aa[2], t[3] = r;
	}
};
function xa(e, t, n) {
	switch (e.state) {
		case "dormant":
			Sa(e, n);
			break;
		case "intro":
			Ca(e, n);
			break;
		case "engage":
			wa(e, t, n);
			break;
		case "windup":
		case "active":
		case "recover":
			Na(e, t, n);
			break;
		case "phase":
			Ta(e, n);
			break;
		case "kneel":
			Ea(e, n);
			break;
		case "stagger":
			e.pose("kneel"), e.after(ea) && (e.poise = e.poiseMax, e.vuln = 1, e.exposed = !1, ja(e));
			break;
		case "stun":
			e.pose("kneel"), e.after(ta) && (e.vuln = 1, e.exposed = !1, ja(e));
			break;
		default: e.setState("engage");
	}
}
function Sa(e, t) {
	e.guarded = !0, e.aggro = !1, e.pose("kneel");
	let n = t.player;
	if (!n.alive) return;
	let r = e.arena;
	(r ? r.contains(n.position.x, n.position.z) && Math.abs(n.position.y - r.y) < 1 : e.tp.d < 10) && e.setState("intro");
}
function Ca(e, t) {
	let n = e.ai, r = e.position;
	e.guarded = !0, e.aggro = !0, e.entered && (n.awoke = !1, t.emit("bossIntro", e));
	let i = t.player.position;
	e.fr < Yi ? e.pose("kneel") : e.fr < Ji ? (Ba(e, i.x, i.z, 1 / 60, 3), e.pose("idle0")) : (n.awoke || (n.awoke = !0, t.sfx("bossRoar", r.x, r.z), t.shake(.25, .6), t.emit("bossAwake", e)), e.pose("roar")), e.after(qi) && (e.guarded = !1, n.gap = D(40), e.setState("engage"));
}
function wa(e, t, n) {
	let r = e.ai, i = n.player, a = e.tp;
	if (e.guarded = !1, !i.alive) {
		e.anim("idle");
		return;
	}
	Ba(e, i.position.x, i.position.z, t, e.phase - 1), a.d <= 3.2 && e.facing.x * a.dx + e.facing.z * a.dz < Math.cos(70 * Ki) && (r.offT += t), r.gap -= t;
	let o = e.def.phaseSpeeds?.[e.phase - 1] ?? e.def.speed;
	if (r.pending) {
		if (r.approachT += t, a.d <= oa.near + Gi) {
			let t = r.pending;
			r.pending = null, Aa(e, t, n);
			return;
		}
		if (r.approachT > D(120)) r.pending = null;
		else {
			e.walk(e.facing.x, e.facing.z, o, t, n, "walk", !1);
			return;
		}
	}
	let s = !1;
	if (r.gap <= 0) {
		let i = ka(e);
		if (i === "slam" && a.d > oa.near + Gi) r.pending = "slam", r.approachT = 0;
		else if (i) {
			Aa(e, i, n);
			return;
		} else r.stall += t, s = !0;
	}
	a.d > 4 || r.pending || s && a.d > va ? e.walk(e.facing.x, e.facing.z, o, t, n, "walk", !1) : e.anim("idle");
}
function Ta(e, t) {
	let n = e.ai, r = e.position;
	if (e.guarded = !0, e.pose("roar"), n.trans === 2) {
		if (e.entered && (t.sfx("bossRoar", r.x, r.z), t.shake(.45, 1.2), n.ringDone = !1), e.fr >= Zi && !n.ringDone) {
			n.ringDone = !0;
			let i = e.hazardRing(r.x, r.z, .5, 5, 9, .8);
			i.thin = !1, i.mv = 0, i.kb = 3, Ua(e, t);
		}
		e.after(Xi) && (e.guarded = !1, n.trans = 0, ja(e, D(30)));
		return;
	}
	e.entered && (t.sfx("bossRoar", r.x, r.z), t.shake(.3, .6)), e.after($i) && (e.guarded = !1, n.trans = 0, ja(e, D(24)));
}
function Ea(e, t) {
	e.guarded = !1, e.exposed = !0, e.pose("kneel"), e.after(Qi) && (e.exposed = !1, e.ai.trans = 3, e.setState("phase"));
}
function Da(e, t, n) {
	let r = e.ai;
	Ma(e, n), e.phase = t, e.poise = e.poiseMax, r.phaseT = 0, n.emit("bossPhase", e, t), t === 2 ? (r.trans = 2, e.sprite.tint.setRGB(1, .9, .85), e.guarded = !0, e.setState("phase")) : (r.trans = 3, r.capFloor = Math.max(0, e.hp - .08 * e.hpMax), e.guarded = !1, e.exposed = !0, e.setState("kneel"), n.sfx("stun", e.position.x, e.position.z));
}
function Oa(e, t) {
	return e.phase === 3 ? Math.max(18, Math.ceil(t * .75)) : t;
}
function ka(e) {
	let t = e.ai, n = e.tp.d, r = e.phase, i = t.stall >= D(_a) - Gi, a = (e) => t.cd[e] <= 0 && (i || t.last1 !== e || t.last2 !== e);
	if (t.offT >= D(60) - Gi && a("sweep") || n <= 3 && a("sweep") && e.rng.chance(.2)) return "sweep";
	let o = t.weights ??= {
		slam: 0,
		toss: 0,
		rain: 0,
		charge: 0
	};
	o.slam = n <= oa.range && a("slam") ? n <= oa.near ? 4 : 3 : 0, o.toss = n > 7 && a("toss") ? 3 : 0, o.rain = r >= 2 && a("rain") ? 1.5 : 0, o.charge = r >= 2 && n >= 5 && a("charge") ? 2.5 : 0;
	let s = o.slam + o.toss + o.rain + o.charge;
	if (s <= 0) return null;
	let c = e.rng.next() * s;
	for (let e of ha) if (c -= o[e], c < 0 && o[e] > 0) return e;
	return o.charge > 0 ? "charge" : o.rain > 0 ? "rain" : o.toss > 0 ? "toss" : "slam";
}
function Aa(e, t, n) {
	let r = e.ai;
	r.move = t, r.last2 = r.last1, r.last1 = t, r.cd[t] = D(pa[t]), r.stall = 0, t === "sweep" && (r.offT = 0), r.len = 0, r.skid = !1, e.setState("windup"), e.entered && n.sfx("windup", e.position.x, e.position.z);
}
function ja(e, t) {
	let n = e.ai;
	n.move = null, n.skid = !1, e.armored = !1;
	let r = ra[e.phase - 1] ?? ra[0];
	n.gap = t ?? D(e.rng.int(r[0], r[1])), e.setState("engage");
}
function Ma(e, t) {
	let n = e.ai;
	e.unmarkAll(t), n.move = null, n.pending = null, n.skid = !1, e.armored = !1, e.vuln = 1, e.exposed = !1;
}
function Na(e, t, n) {
	switch (e.ai.move) {
		case "slam":
			Pa(e, t, n);
			break;
		case "sweep":
			Fa(e, n);
			break;
		case "toss":
			Ia(e, t, n);
			break;
		case "rain":
			Ra(e, n);
			break;
		case "charge":
			za(e, t, n);
			break;
		default: ja(e);
	}
}
function Pa(e, t, n) {
	let r = e.ai, i = e.position;
	if (e.state === "windup") {
		let t = Oa(e, oa.windup);
		e.entered && (r.cx = i.x + e.facing.x * oa.ahead, r.cz = i.z + e.facing.z * oa.ahead), e.pose("slamWind");
		let a = e.markerSpec("circle", r.cx, r.cz);
		a.r = oa.r, a.progress = Math.min(1, e.t / D(t)), e.mark(0, n, a), e.after(t) && (r.tag = e.newTag(), e.setState("active"));
		return;
	}
	if (e.state === "active") {
		if (e.pose("slam"), e.entered) {
			let t = n.groundAt(r.cx, r.cz);
			e.markProgress(0, n, 1), n.shake(.45, .5), n.sfx("slam", r.cx, r.cz), n.fx("dust", r.cx, t, r.cz);
		}
		if (e.after(oa.active)) {
			if (e.unmark(0, n), e.phase >= 2 && e.hazardMagma(r.cx, r.cz, da.r, D(da.dur), da.flat, D(da.tick)), e.phase === 3) for (let t = 0; t < fa.rings; t++) {
				let n = e.hazardRing(r.cx, r.cz, fa.width, fa.rMax, fa.speed, fa.width, D(t * fa.every));
				n.mv = fa.mv, n.kb = fa.kb;
			}
			e.setState("recover");
			return;
		}
		let t = e.hitSpec();
		t.shape = "circle", t.x = r.cx, t.z = r.cz, t.r = oa.r, t.mv = oa.mv, t.kb = oa.kb, t.knockdown = !0, t.tag = r.tag, n.hitbox(e, t);
		return;
	}
	e.pose("slam"), e.after(oa.recover) && ja(e);
}
function Fa(e, t) {
	let n = e.ai, r = e.position;
	if (e.state === "windup") {
		let i = Oa(e, sa.windup);
		e.pose("sweepWind");
		let a = e.markerSpec("circle", r.x, r.z);
		a.r = sa.r, a.progress = Math.min(1, e.t / D(i)), e.mark(0, t, a), e.after(i) && (n.tag = e.newTag(), e.setState("active"));
		return;
	}
	if (e.state === "active") {
		if (e.pose("sweep"), e.entered && (e.markProgress(0, t, 1), t.sfx("swingHeavy", r.x, r.z)), e.after(sa.active)) {
			e.unmark(0, t), e.setState("recover");
			return;
		}
		let i = e.hitSpec();
		i.shape = "circle", i.r = sa.r, i.mv = sa.mv, i.kb = sa.kb, i.tag = n.tag, t.hitbox(e, i);
		return;
	}
	e.pose("sweep"), e.after(sa.recover) && ja(e);
}
function Ia(e, t, n) {
	e.ai, e.position;
	let r = n.player;
	if (e.state === "windup") {
		let i = Oa(e, ca.windup);
		Ba(e, r.position.x, r.position.z, t, 2), e.pose("throw"), e.after(i) && (La(e, n), e.setState("recover"));
		return;
	}
	e.pose("throw"), e.after(ca.recover) && ja(e);
}
function La(e, t) {
	let n = e.position, r = t.player, i = r.position.x + r.velocity.x * ca.lead, a = r.position.z + r.velocity.z * ca.lead, o = i - n.x, s = a - n.z, c = Math.hypot(o, s) || 1;
	o /= c, s /= c;
	let l = Va(e, ca.r), u = D(ca.fill);
	for (let r = -1; r <= 1; r++) {
		let c = i - s * ca.lateral * r, d = a + o * ca.lateral * r;
		l && (c = Math.min(l.maxX, Math.max(l.minX, c)), d = Math.min(l.maxZ, Math.max(l.minZ, d))), e.hazardVisual(c, d, ca.r, u);
		let f = e.projSpec(), p = Math.hypot(c - n.x, d - n.z);
		f.kind = "boulder", f.y = n.y + 3.2, f.dirX = p > 1e-4 ? (c - n.x) / p : e.facing.x, f.dirZ = p > 1e-4 ? (d - n.z) / p : e.facing.z, f.speed = p / u, f.range = p, f.radius = ca.r, f.mv = ca.mv, f.kb = ca.kb, f.arc = {
			tx: c,
			tz: d,
			time: u,
			apex: ca.apex
		}, t.projectile(e, f);
	}
	t.sfx("rockToss", n.x, n.z);
}
function Ra(e, t) {
	e.ai;
	let n = e.position;
	if (e.state === "windup") {
		let r = Oa(e, la.windup);
		if (e.pose("roar"), e.after(r)) {
			let r = e.phase === 3 ? la.n3 : la.n, i = Va(e, la.r);
			for (let t = 0; t < r; t++) {
				let n = 0, r = 0;
				if (t > 0) {
					let t = e.rng.next() * Math.PI * 2, i = la.spread * Math.sqrt(e.rng.next());
					n = Math.cos(t) * i, r = Math.sin(t) * i;
				}
				let a = e.hazardCircle(n, r, la.r, D(la.fill), D(t * la.every), !0, i);
				a.mv = la.mv, a.kb = la.kb, a.burst = "emberBurst", a.burstN = 10, a.sfx = "hexBurst";
			}
			t.sfx("bossRoar", n.x, n.z), e.setState("active");
		}
		return;
	}
	e.pose("roar"), e.after(la.channel) && ja(e);
}
function za(e, t, n) {
	let r = e.ai, i = e.position, a = n.player.position;
	if (e.state === "windup") {
		let o = Oa(e, ua.windup);
		e.pose("slamWind"), e.t < D(o - ua.lock) - Gi && (Ba(e, a.x, a.z, t, 3), (e.fr % 2 == 0 || r.len === 0) && (r.len = e.freeRun(e.facing.x, e.facing.z, ua.max, n, Va(e, 1)), r.end = e.runEnd));
		let s = e.markerSpec("lane", i.x, i.z);
		s.len = Math.max(.5, r.len), s.width = ua.width, s.progress = Math.min(1, e.t / D(o)), s.flash = e.lockFlash(e.t - D(o - ua.lock)), e.mark(0, n, s), e.after(o) && (r.lx = e.facing.x, r.lz = e.facing.z, r.run = r.len + +(r.end === "obstacle"), r.done = 0, r.tag = e.newTag(), e.armored = !0, e.markProgress(0, n, 1), n.sfx("boarCharge", i.x, i.z), e.setState("active"));
		return;
	}
	if (e.state === "active") {
		e.armored = !0, e.pose("slam");
		let a = Math.min(ua.speed * t, r.run - r.done), o = !1;
		if (a > 1e-5) {
			let t = i.x, s = i.z, c = e.move(r.lx * a, r.lz * a, n);
			r.done += Math.max(0, (i.x - t) * r.lx + (i.z - s) * r.lz), o = c < .4;
		}
		let s = e.hitSpec();
		if (s.shape = "circle", s.x = i.x + r.lx * 1.2, s.z = i.z + r.lz * 1.2, s.r = ua.r, s.mv = ua.mv, s.kb = ua.kb, s.knockdown = !0, s.fromX = i.x, s.fromZ = i.z, s.tag = r.tag, n.hitbox(e, s), o && e.blockedBy === "collider") {
			e.unmark(0, n), e.armored = !1, e.vuln = 1.5, e.exposed = !0, n.shake(.35, .45), n.sfx("stun", i.x, i.z), n.fx("stun", i.x, i.y + 2.6, i.z, {
				duration: ta / 60,
				follow: e.position
			}), r.move = null, e.setState("stun"), e.pose("kneel");
			return;
		}
		(o || r.done >= r.run - .001 || a <= 1e-5) && (e.unmark(0, n), e.armored = !1, r.skid = !0, e.setState("recover"));
		return;
	}
	let o = Math.min(1, e.t / D(na)), s = 8 * (1 - o) * (1 - o);
	s > 0 && e.move(r.lx * s * t, r.lz * s * t, n), e.pose("slamWind"), e.entered && n.fx("dust", i.x, i.y, i.z), e.after(na) && ja(e);
}
function Ba(e, t, n, r, i) {
	let a = e.ai, o = e.position, s = Math.atan2(t - o.x, n - o.z);
	a.yaw = Math.atan2(e.facing.x, e.facing.z);
	let c = s - a.yaw;
	for (; c > Math.PI;) c -= 2 * Math.PI;
	for (; c < -Math.PI;) c += 2 * Math.PI;
	let l = i >= 3 ? Math.PI : ia[i] * r;
	a.yaw += Math.max(-l, Math.min(l, c)), e.faceDir(Math.sin(a.yaw), Math.cos(a.yaw));
}
function Va(e, t) {
	let n = e.arena;
	if (!n) return null;
	let r = e.ai.inset ?? (e.ai.inset = {
		minX: 0,
		maxX: 0,
		minZ: 0,
		maxZ: 0
	});
	return r.minX = n.rect.minX + t, r.maxX = n.rect.maxX - t, r.minZ = n.rect.minZ + t, r.maxZ = n.rect.maxZ - t, r;
}
function Ha(e) {
	let t = 0;
	for (let n of e.adds) n && n.alive && t++;
	return t;
}
function Ua(e, t) {
	let n = e.ai, r = e.arena, i = e.position, a = t.player.position, o = r ? r.rect : {
		minX: i.x - 8,
		maxX: i.x + 8,
		minZ: i.z - 6,
		maxZ: i.z + 6
	}, s = [
		[o.minX + 2, o.minZ + 2],
		[o.maxX - 2, o.minZ + 2],
		[o.minX + 2, o.maxZ - 2],
		[o.maxX - 2, o.maxZ - 2]
	];
	s.sort((e, t) => Math.hypot(t[0] - a.x, t[1] - a.z) - Math.hypot(e[0] - a.x, e[1] - a.z));
	for (let e = 0; e < 3; e++) {
		let r = t.spawnAdd(ga, s[e][0], s[e][1], ya);
		r && n.adds.indexOf(r) < 0 && n.adds.push(r);
	}
}
//#endregion
//#region src/game/combat/ai/drakeborn.js
var O = (e) => e / 60, Wa = 1e-6, Ga = {
	mode: "flat",
	lift: .55,
	color: [
		1.9,
		1.7,
		1.45
	],
	loops: 1,
	scale: 1,
	dirX: 0,
	dirZ: 1,
	flip: !1
}, Ka = 1.35, qa = {
	mode: "flat",
	lift: .04,
	color: [
		2.3,
		.95,
		.32
	],
	loops: 1,
	fps: 6,
	scale: 1.6,
	dirX: 0,
	dirZ: 1
}, Ja = {
	mode: "flat",
	lift: .04,
	color: [
		1.6,
		.8,
		.35
	],
	loops: 1,
	fps: 8,
	scale: .8,
	dirX: 0,
	dirZ: 1
}, Ya = { scale: .9 }, Xa = [
	0,
	1,
	-1,
	2,
	-2,
	3,
	-3,
	4,
	-4,
	5,
	-5,
	6
], Za = (e, t = 0) => Math.max(1.35, e.def.radius * 3, t), Qa = .55, $a = .3, eo = 8, to = .6, no = [];
function ro() {
	return {
		planned: !1,
		there: !1,
		sx: 0,
		sz: 0,
		wx: 0,
		wz: 0,
		wy: 0,
		walk: 0,
		t: 0,
		n: 0,
		hit: !1,
		fireAt: -1,
		clear: 1.35
	};
}
function io(e, t, n, r) {
	let i = e.def.moveRadius;
	return t.walkable(n, r) && t.walkable(n + i, r) && t.walkable(n - i, r) && t.walkable(n, r + i) && t.walkable(n, r - i);
}
function ao(e, t, n, r, i) {
	let a = e.besiege, o = e.home.x - a.x, s = e.home.z - a.z, c = Math.hypot(o, s) > .001 ? Math.atan2(s, o) : e.index * 1.3, l = n.clear / (a.r + i + .6), u = Xa[e.index % 5], d = !1;
	for (let r = 0; r < Xa.length && !d; r++) {
		let o = c + (u + Xa[r]) * l, s = Math.cos(o), f = Math.sin(o);
		for (let r = a.r + i; r <= a.r + i + 2.5 + Wa && !d; r += .5) {
			let i = a.x + s * r, o = a.z + f * r;
			io(e, t, i, o) && so(e, t, i, o) && (n.sx = i, n.sz = o, d = !0);
		}
	}
	d || (n.sx = e.position.x, n.sz = e.position.z), oo(e, t, n, r), n.planned = !0;
}
function oo(e, t, n, r) {
	let i = e.besiege, a = i.x - n.sx, o = i.z - n.sz, s = Math.hypot(a, o);
	s < .001 ? (a = e.facing.x, o = e.facing.z) : (a /= s, o /= s);
	let c = -1;
	for (let e = .25; e <= Math.max(1, s) + Wa; e += .25) if (!t.walkable(n.sx + a * e, n.sz + o * e)) {
		c = e;
		break;
	}
	if (c < 0) c = Math.min(1.2, Math.max(.5, s - .5));
	else if (r >= 0 && c - r > .3) {
		for (let i = c - r; i > .1; i -= .25) if (io(e, t, n.sx + a * i, n.sz + o * i) && so(e, t, n.sx + a * i, n.sz + o * i)) {
			n.sx += a * i, n.sz += o * i, c -= i;
			break;
		}
	}
	n.wx = n.sx + a * c, n.wz = n.sz + o * c, n.wy = t.groundAt(n.sx, n.sz);
}
function so(e, t, n, r) {
	let i = e.ai.siege.clear, a = t.enemiesNear(n, r, 16, no);
	for (let t = 0; t < a.length; t++) {
		let o = a[t], s = o !== e && o.ai ? o.ai.siege : void 0;
		if (s && s.planned && Math.hypot(s.sx - n, s.sz - r) < Math.max(i, s.clear)) return !1;
	}
	return !0;
}
function co(e, t, n, r, i, a = 0, o = 0) {
	let s = e.besiege;
	if (!s) return e.wander(t, n), -1;
	let c = e.ai.siege;
	c.planned || (c.clear = Za(e, o), ao(e, n, c, i, a), c.t = r * (e.index * .37 % 1 - 1));
	let l = e.position;
	if (c.there && Math.hypot(c.sx - l.x, c.sz - l.z) > to && (c.there = !1, c.walk = 0), !c.there) {
		let r = Math.hypot(c.sx - l.x, c.sz - l.z);
		if (c.walk += t, r > $a && !e.stuck && c.walk < eo) return e.seek(c.sx, c.sz, e.def.speed * Qa, t, n, "walk"), -1;
		r > $a && (c.sx = l.x, c.sz = l.z, oo(e, n, c, -1)), c.there = !0, e.resetSeek();
	}
	e.face(s.x, s.z);
	let u = c.t;
	return c.t += t, c.t >= r && (c.t -= r, c.n++, c.hit = !1, c.fireAt = -1), u < 0 ? -1 : c.t;
}
function lo(e) {
	let t = e.ai?.siege;
	t && (t.there = !1, t.walk = 0, t.hit = !1, t.fireAt = -1);
}
var uo = 2.5, fo = 2.6, po = 1.25, mo = .55, ho = 24, k = Object.freeze({
	range: 3,
	windup: 30,
	follow: 20,
	lock: 8,
	r: 2.6,
	half: 70,
	active: 6,
	lunge: .6,
	lunge2: .4,
	mv: 1.3,
	kb: 2,
	mv2: 1.1,
	kb2: 2.4,
	chance2: .35,
	recover: 36,
	cooldown: 54,
	stepIn: 1.8
}), A = Object.freeze({
	range: 3.6,
	chance: .3,
	windup: 42,
	lock: 12,
	ahead: 1.1,
	r: 3,
	active: 4,
	mv: 1.6,
	kb: 2.8,
	ring: Object.freeze({
		r0: 1.2,
		rMax: 5.4,
		speed: 10,
		width: .9,
		mv: .5,
		kb: 1.6
	}),
	recover: 50,
	cooldown: 6
}), j = Object.freeze({
	min: 4,
	max: 9,
	chance: .55,
	windup: 44,
	lock: 12,
	width: 1.6,
	run: 10,
	speed: 9.5,
	r: 1,
	mv: 1.5,
	kb: 3.2,
	reel: 70,
	skid: 20,
	recover: 40,
	cooldown: 7,
	overshoot: .8
}), go = {
	init(e) {
		return {
			siege: ro(),
			move: "cleave",
			force: null,
			cd: O(e.rng.int(20, 50)),
			slamCd: e.rng.range(1.5, 3.5),
			goreCd: e.rng.range(2, 4),
			roar: !1,
			roarT: 0,
			second: !1,
			tag: 0,
			lx: 0,
			lz: 1,
			cx: 0,
			cz: 0,
			len: 0,
			end: "max",
			run: 0,
			done: 0,
			skid: !1,
			reel: !1,
			dust: 0,
			los: !1,
			losT: 0,
			side: e.rng.chance(.5) ? 1 : -1
		};
	},
	idle(e, t, n) {
		let r = e.ai;
		r.roar = !0;
		let i = co(e, t, n, fo, po);
		if (i < 0) {
			r.siege.there && e.anim("idle");
			return;
		}
		let a = r.siege, o = a.n % 3 == 2;
		if (i < mo) e.pose(o ? "slamWind" : "windup");
		else if (i < .77) {
			if (e.pose(o ? "slam" : "attack"), !a.hit) {
				a.hit = !0;
				let e = a.wy + (o ? .7 : 1.2);
				n.burst("bruteSparks", a.wx, e, a.wz, o ? 10 : 7), n.burst("bruteSplinters", a.wx, e, a.wz, o ? 9 : 6), n.fx("impact", a.wx, e - 1, a.wz, Ya), n.burst("bruteDust", a.wx, a.wy + .4, a.wz, o ? 8 : 3), n.sfx(o ? "crash" : "wallHit", a.wx, a.wz, { volume: o ? .7 : .8 });
			}
		} else i < 1.17 ? e.pose(o ? "slam" : "follow") : e.anim("idle");
	},
	engage(e, t, n) {
		let r = e.ai, i = e.tp, a = n.player.position, o = e.position;
		if (lo(e), r.cd > 0 && (r.cd -= t), r.slamCd > 0 && (r.slamCd -= t), r.goreCd > 0 && (r.goreCd -= t), r.losT -= t, r.losT <= 0 && (r.los = n.los(o.x, o.z, a.x, a.z), r.losT = O(6)), r.roar) {
			r.roarT === 0 && n.sfx("growl", o.x, o.z, { pitch: .85 }), r.roarT += t, e.face(a.x, a.z), e.pose("roar"), r.roarT >= O(ho) - Wa && (r.roar = !1, r.roarT = 0);
			return;
		}
		let s = e.canMelee(n), c = e.canWindup(n), l = r.force, u = (e) => !l || l === e;
		if (s && c) {
			if (u("slam") && i.d <= A.range && (l === "slam" || r.cd <= 0 && r.slamCd <= 0 && e.rng.chance(A.chance)) && e.takeToken(n)) {
				yo(e, "slam");
				return;
			}
			if (u("cleave") && i.d <= k.range && (l === "cleave" || r.cd <= 0) && e.takeToken(n)) {
				yo(e, "cleave");
				return;
			}
			if (u("gore") && i.d >= j.min && i.d <= j.max && r.los && (l === "gore" || r.cd <= 0 && r.goreCd <= 0 && e.rng.chance(j.chance)) && e.takeToken(n)) {
				yo(e, "gore");
				return;
			}
			!l && r.goreCd <= 0 && i.d >= j.min && (r.goreCd = 1.2);
		}
		if (s && i.d <= k.range - .2) {
			let o = e.walk(-i.dz * r.side, i.dx * r.side, uo * .35, t, n, "walk", !1);
			e.face(a.x, a.z), o < .25 && (r.side = -r.side);
			return;
		}
		e.chase(uo, t, n, "walk");
	},
	attack(e, t, n) {
		let r = e.ai;
		r.move === "slam" ? To(e, t, n) : r.move === "gore" ? Eo(e, t, n) : xo(e, t, n);
	},
	stun(e, t, n) {
		e.pose("hurt"), e.after(j.reel) && (e.vuln = 1, e.dropToken(n), e.ai.cd = O(30), e.setState("engage"));
	},
	cancel(e) {
		let t = e.ai;
		t.second = !1, t.skid = !1, t.roar = !1, t.roarT = 0, e.armored = !1, e.vuln = 1, lo(e);
	},
	die(e, t) {
		let n = e.position;
		t.sfx("growl", n.x, n.z, {
			pitch: .7,
			volume: .8
		}), t.sfx("crash", n.x, n.z, {
			volume: .6,
			pitch: .75
		}), t.burst("bruteDust", n.x, n.y + .3, n.z, 12), t.burst("bruteRubble", n.x, n.y + .2, n.z, 6), t.fx("dust", n.x, n.y, n.z, vo);
	},
	dead(e, t, n) {
		let r = e.position;
		e.t - t < O(_o.gasp) - Wa && e.t >= O(_o.gasp) - Wa && n.burst("bruteEmbers", r.x, r.y + .6, r.z, 8);
		let i = (e.t - O(_o.still)) / O(_o.fade);
		return i > 0 && (e.sprite.opacity = Math.min(e.sprite.opacity, Math.max(0, 1 - i))), !0;
	},
	glow(e, t) {
		t[0] = 1, t[1] = .45, t[2] = .15, t[3] = e.state === "windup" ? 2.6 : 1.6;
	}
}, _o = Object.freeze({
	gasp: 14,
	still: 30,
	fade: 40
}), vo = { scale: 1.8 };
function yo(e, t) {
	let n = e.ai;
	n.move = t, n.second = !1, n.len = 0, n.force = null, e.setState("windup");
}
function bo(e, t, n) {
	let r = e.ai;
	e.dropToken(t), r.cd = n, e.setState("engage");
}
function xo(e, t, n) {
	let r = e.ai, i = n.player.position, a = e.position, o = e.tp;
	if (e.state === "windup") {
		let s = r.second ? k.follow : k.windup;
		e.entered && n.sfx(r.second ? "windup" : "growl", a.x, a.z, r.second ? void 0 : { volume: .7 }), e.pose(r.second ? "follow" : "windup"), e.t < O(s - k.lock) - Wa && (e.face(i.x, i.z), !r.second && o.d > k.stepIn && e.walk(o.dx, o.dz, uo, t, n, null, !1));
		let c = e.markerSpec("sector", a.x, a.z);
		c.r = k.r, c.halfAngle = k.half, c.progress = Math.min(1, e.t / O(s)), e.mark(0, n, c), e.after(s) && (r.lx = e.facing.x, r.lz = e.facing.z, r.tag = e.newTag(), e.markProgress(0, n, 1), e.setState("active"));
		return;
	}
	if (e.state === "active") {
		if (e.entered && (n.sfx("swingHeavy", a.x, a.z), Ga.dirX = r.lx, Ga.dirZ = r.lz, Ga.flip = r.second, n.fx("bruteCleave", a.x + r.lx * Ka, a.y, a.z + r.lz * Ka, Ga)), e.after(k.active)) {
			e.unmark(0, n), !r.second && e.rng.chance(k.chance2) ? (r.second = !0, e.setState("windup")) : e.setState("recover");
			return;
		}
		e.pose(r.second ? "cleave2" : "attack");
		let i = (r.second ? k.lunge2 : k.lunge) / O(k.active);
		e.move(r.lx * i * t, r.lz * i * t, n);
		let o = e.hitSpec();
		o.shape = "sector", o.r = k.r, o.halfAngle = k.half, o.dirX = r.lx, o.dirZ = r.lz, o.mv = r.second ? k.mv2 : k.mv, o.kb = r.second ? k.kb2 : k.kb, o.tag = r.tag, n.hitbox(e, o);
		return;
	}
	e.fr < 16 ? e.pose(r.second ? "cleave2" : "follow") : (e.face(i.x, i.z), e.anim("idle")), e.after(k.recover) && (r.second = !1, bo(e, n, O(k.cooldown)));
}
var So = { scale: 1.8 }, Co = { scale: 1.4 }, wo = { scale: 1.5 };
function To(e, t, n) {
	let r = e.ai, i = n.player.position, a = e.position;
	if (e.state === "windup") {
		e.entered && n.sfx("growl", a.x, a.z, { pitch: .9 }), e.pose("slamWind"), e.t < O(A.windup - A.lock) - Wa && e.face(i.x, i.z), r.cx = a.x + e.facing.x * A.ahead, r.cz = a.z + e.facing.z * A.ahead;
		let t = e.markerSpec("circle", r.cx, r.cz);
		t.r = A.r, t.progress = Math.min(1, e.t / O(A.windup)), e.mark(0, n, t), e.after(A.windup) && (r.tag = e.newTag(), e.markProgress(0, n, 1), e.setState("active"));
		return;
	}
	if (e.state === "active") {
		if (e.pose("slam"), e.entered) {
			let t = n.groundAt(r.cx, r.cz);
			n.shake(.35, .4), n.sfx("quake", r.cx, r.cz), qa.dirX = e.facing.x, qa.dirZ = e.facing.z, n.fx("bruteQuake", r.cx, t, r.cz, qa), n.fx("dust", r.cx, t, r.cz, So), n.fx("impact", r.cx, t - .5, r.cz, Co), n.burst("bruteDust", r.cx, t + .3, r.cz, 14), n.burst("bruteRubble", r.cx, t + .2, r.cz, 14), n.burst("bruteSparks", r.cx, t + .4, r.cz, 8);
		}
		if (e.after(A.active)) {
			e.unmark(0, n);
			let t = A.ring, i = e.hazardRing(r.cx, r.cz, t.r0, t.rMax, t.speed, t.width);
			i.mv = t.mv, i.kb = t.kb, e.setState("recover");
			return;
		}
		let t = e.hitSpec();
		t.shape = "circle", t.x = r.cx, t.z = r.cz, t.y = n.groundAt(r.cx, r.cz), t.r = A.r, t.mv = A.mv, t.kb = A.kb, t.knockdown = !0, t.tag = r.tag, n.hitbox(e, t);
		return;
	}
	e.fr < 30 ? e.pose("slam") : (e.face(i.x, i.z), e.anim("idle")), e.after(A.recover) && (r.slamCd = A.cooldown, bo(e, n, O(k.cooldown)));
}
function Eo(e, t, n) {
	let r = e.ai, i = n.player.position, a = e.position;
	if (e.state === "windup") {
		e.entered && (n.sfx("growl", a.x, a.z, { pitch: .75 }), r.dust = 0), e.fr >= r.dust * 12 && (n.burst("footstep", a.x, a.y + .05, a.z, 5), r.dust++), e.pose("goreWind"), e.t < O(j.windup - j.lock) - Wa && (e.face(i.x, i.z), (e.fr % 2 == 0 || r.len === 0) && (r.len = e.freeRun(e.facing.x, e.facing.z, j.run, n), r.end = e.runEnd));
		let t = e.markerSpec("lane", a.x, a.z);
		t.len = Math.max(.5, r.len), t.width = j.width, t.progress = Math.min(1, e.t / O(j.windup)), t.flash = e.lockFlash(e.t - O(j.windup - j.lock)), e.mark(0, n, t), e.after(j.windup) && (r.lx = e.facing.x, r.lz = e.facing.z, r.run = r.len + (r.end === "obstacle" ? j.overshoot : 0), r.done = 0, r.tag = e.newTag(), r.skid = !1, r.dust = 0, e.armored = !0, e.markProgress(0, n, 1), n.sfx("boarCharge", a.x, a.z, { pitch: .8 }), e.setState("active"));
		return;
	}
	if (e.state === "active") {
		e.armored = !0, e.pose(e.fr >> 2 & 1 ? "gore1" : "gore0"), e.fr >= r.dust * 6 && (n.burst("footstep", a.x, a.y + .05, a.z, 4), r.dust++);
		let i = Math.min(j.speed * t, r.run - r.done), o = !1;
		if (i > 1e-5) {
			let t = a.x, s = a.z, c = e.move(r.lx * i, r.lz * i, n);
			r.done += Math.max(0, (a.x - t) * r.lx + (a.z - s) * r.lz), o = c < .4;
		}
		let s = e.hitSpec();
		if (s.shape = "circle", s.x = a.x + r.lx * .7, s.z = a.z + r.lz * .7, s.r = j.r, s.mv = j.mv, s.kb = j.kb, s.knockdown = !0, s.tag = r.tag, s.fromX = a.x, s.fromZ = a.z, n.hitbox(e, s), o && (e.blockedBy === "terrain" || e.blockedBy === "collider")) {
			e.unmark(0, n), e.armored = !1, e.vuln = 1.3, n.shake(.25, .35), n.sfx("crash", a.x, a.z), n.fx("dust", a.x + r.lx * .8, a.y, a.z + r.lz * .8, wo), Ja.dirX = r.lx, Ja.dirZ = r.lz, n.fx("bruteQuake", a.x + r.lx * .9, n.groundAt(a.x, a.z), a.z + r.lz * .9, Ja), n.burst("bruteRubble", a.x + r.lx * .8, a.y + .6, a.z + r.lz * .8, 8), n.fx("stun", a.x, a.y + 1.4, a.z, {
				duration: j.reel / 60,
				follow: e.position
			}), e.pose("hurt"), e.setState("stun");
			return;
		}
		(o || r.done >= r.run - .001 || i <= 1e-5) && (e.unmark(0, n), e.armored = !1, r.skid = !0, e.setState("recover"));
		return;
	}
	if (r.skid) {
		let i = Math.min(1, e.t / O(j.skid)), o = 5 * (1 - i) * (1 - i);
		e.move(r.lx * o * t, r.lz * o * t, n), e.pose("gore1"), e.entered && n.burst("bruteDust", a.x, a.y + .2, a.z, 5), e.after(j.skid) && (r.skid = !1, e.setState("recover"));
		return;
	}
	e.entered && e.anim("idle"), e.face(i.x, i.z), e.after(j.recover) && (r.goreCd = j.cooldown, bo(e, n, O(k.cooldown)));
}
//#endregion
//#region src/game/combat/ai/ashhound.js
var M = (e) => e / 60, Do = 1e-6, Oo = Math.PI / 180, ko = 4.4, Ao = Object.freeze({
	min: 2.8,
	mid: 3.6,
	max: 4.6,
	speed: 3.4
}), jo = 12, Mo = 2.2, No = .85, Po = .2, Fo = 6, Io = 1.1, N = Object.freeze({
	range: 2.4,
	windup: 20,
	follow: 18,
	lock: 6,
	r: 1.7,
	half: 45,
	active: 5,
	lunge: 1,
	mv: .85,
	kb: .6,
	third: .45,
	recover: 26,
	cooldown: 40,
	closeIn: 1.4
}), P = Object.freeze({
	min: 3.5,
	max: 7.5,
	chance: .5,
	windup: 30,
	lock: 8,
	air: 22,
	arc: 1.1,
	r: 1.6,
	lead: .25,
	mv: 1.25,
	kb: 2.2,
	recover: 34,
	cooldown: 5
}), F = Object.freeze({
	min: 1.5,
	range: 5.5,
	chance: .4,
	windup: 36,
	lock: 10,
	r: 5,
	half: 28,
	active: 54,
	every: 9,
	mv: .32,
	kb: .25,
	recover: 28,
	cooldown: 8
}), Lo = Object.freeze({
	still: 20,
	fade: 30,
	embers: 8
}), Ro = {
	mode: "billboard",
	lift: .75,
	color: [
		2.1,
		1.45,
		.75
	],
	loops: 1,
	scale: 1
}, zo = {
	mode: "billboard",
	lift: 1.05,
	color: [
		1.9,
		1.25,
		.6
	],
	loops: 1,
	scale: .9
}, Bo = {
	mode: "flat",
	lift: .25,
	color: [
		2.4,
		1.05,
		.32
	],
	loops: 2,
	fps: 14,
	scale: 1.5,
	dirX: 0,
	dirZ: 1
}, Vo = 3.22, Ho = {
	mode: "flat",
	lift: .04,
	color: [
		2.2,
		.95,
		.32
	],
	loops: 1,
	fps: 8,
	scale: .75,
	dirX: 0,
	dirZ: 1
}, Uo = { scale: 1.3 }, Wo = {
	init(e) {
		return {
			siege: ro(),
			move: "bite",
			force: null,
			cd: M(e.rng.int(15, 45)),
			pounceCd: e.rng.range(.5, 2.5),
			breathCd: e.rng.range(2, 5),
			snarl: !1,
			snarlT: 0,
			n: 0,
			tag: 0,
			lx: 0,
			lz: 1,
			sx: 0,
			sz: 0,
			tx: 0,
			tz: 0,
			side: e.index % 2 ? 1 : -1,
			flip: M(e.rng.int(90, 200)),
			blocked: 0,
			los: !1,
			losT: 0,
			howl: !1,
			fx: 0,
			each: 0
		};
	},
	idle(e, t, n) {
		let r = e.ai;
		r.snarl = !0;
		let i = co(e, t, n, Mo, No);
		if (i < 0) {
			r.siege.there && e.anim("idle");
			return;
		}
		let a = r.siege, o = e.position;
		if (a.n % 3 == 2) {
			i < Io ? (e.pose("howl"), a.hit || (a.hit = !0, n.sfx("growl", o.x, o.z, {
				pitch: 1.35,
				volume: .75
			}))) : e.anim("idle");
			return;
		}
		if (i < Po * Fo) {
			let t = Math.floor(i / Po);
			e.pose(t & 1 ? "claw1" : "claw0"), t & 1 && !a.hit ? (a.hit = !0, n.burst("bruteSplinters", a.wx, a.wy + 1.1, a.wz, 4), n.burst("bruteDust", a.wx, a.wy + .5, a.wz, 2), n.fx("bruteClaw", a.wx, a.wy, a.wz, zo), t % 4 == 1 && n.sfx("wallHit", a.wx, a.wz, {
				volume: .45,
				pitch: 1.3
			})) : t & 1 || (a.hit = !1);
		} else e.anim("idle");
	},
	engage(e, t, n) {
		let r = e.ai, i = e.tp, a = n.player.position, o = e.position;
		if (lo(e), r.cd > 0 && (r.cd -= t), r.pounceCd > 0 && (r.pounceCd -= t), r.breathCd > 0 && (r.breathCd -= t), r.losT -= t, r.losT <= 0 && (r.los = n.los(o.x, o.z, a.x, a.z), r.losT = M(6)), r.snarl) {
			r.snarlT === 0 && n.sfx("growl", o.x, o.z, { pitch: 1.2 }), r.snarlT += t, e.face(a.x, a.z), e.pose("windup"), r.snarlT >= M(jo) - Do && (r.snarl = !1, r.snarlT = 0);
			return;
		}
		let s = e.canMelee(n), c = e.canWindup(n), l = r.force, u = (e) => !l || l === e;
		if (s && c) {
			if (u("breath") && i.d >= F.min && i.d <= F.range && r.los && (l === "breath" || r.cd <= 0 && r.breathCd <= 0 && e.rng.chance(F.chance)) && e.takeToken(n)) {
				Ko(e, "breath");
				return;
			}
			if (u("pounce") && i.d >= P.min && i.d <= P.max && r.los && (l === "pounce" || r.cd <= 0 && r.pounceCd <= 0 && e.rng.chance(P.chance)) && e.takeToken(n)) {
				Ko(e, "pounce");
				return;
			}
			if (u("bite") && i.d <= N.range && (l === "bite" || r.cd <= 0) && e.takeToken(n)) {
				Ko(e, "bite");
				return;
			}
			!l && r.breathCd <= 0 && (r.breathCd = 1), !l && r.pounceCd <= 0 && (r.pounceCd = .8);
		}
		if (i.d > Ao.max || !s || r.cd <= 0 && !c) {
			e.chase(ko, t, n, "run");
			return;
		}
		if (r.cd <= 0 && i.d > N.range) {
			e.chase(ko, t, n, "run");
			return;
		}
		r.flip -= t, r.flip <= 0 && (e.rng.chance(.4) && (r.side = -r.side), r.flip = M(e.rng.int(90, 200)));
		let d = -i.dz * r.side, f = i.dx * r.side, p = i.d < Ao.min ? -.8 : Math.max(-.5, Math.min(.8, (i.d - Ao.mid) * 1.4));
		d += i.dx * p, f += i.dz * p;
		let m = Math.hypot(d, f) || 1;
		r.blocked = e.walk(d / m, f / m, Ao.speed, t, n, "run") < .25 ? r.blocked + t : 0, r.blocked > M(10) && (r.side = -r.side, r.blocked = 0);
	},
	attack(e, t, n) {
		let r = e.ai;
		r.move === "pounce" ? Yo(e, t, n) : r.move === "breath" ? Xo(e, t, n) : Jo(e, t, n);
	},
	cancel(e) {
		let t = e.ai;
		t.n = 0, t.snarl = !1, t.snarlT = 0, e.lift = 0, lo(e);
	},
	die(e, t) {
		let n = e.position;
		t.burst("bruteEmbers", n.x, n.y + .8, n.z, 12), t.burst("bruteSmoke", n.x, n.y + .6, n.z, 6);
	},
	dead(e, t, n) {
		let r = e.position, i = M(Lo.embers);
		e.t < M(Lo.still + Lo.fade) && Math.floor(e.t / i) !== Math.floor((e.t - t) / i) && n.burst("bruteEmbers", r.x - e.facing.x * .6, r.y + .4, r.z - e.facing.z * .6, 3);
		let a = (e.t - M(Lo.still)) / M(Lo.fade);
		return a > 0 && (e.sprite.opacity = Math.min(e.sprite.opacity, Math.max(0, 1 - a))), !0;
	},
	glow(e, t) {
		let n = e.ai, r = e.state === "windup" || e.state === "active" && n?.move === "breath";
		t[0] = 1, t[1] = .45, t[2] = .14, t[3] = e.alive ? r ? 1.5 : .9 : .3;
	}
};
function Go(e, t, n) {
	return e.entered && (t.each = 0), e.fr < t.each * n ? !1 : (t.each = Math.floor(e.fr / n) + 1, !0);
}
function Ko(e, t) {
	let n = e.ai;
	n.move = t, n.n = 0, n.force = null, e.setState("windup");
}
function qo(e, t, n) {
	let r = e.ai;
	e.dropToken(t), r.cd = n, r.n = 0, e.setState("engage");
}
function Jo(e, t, n) {
	let r = e.ai, i = n.player.position, a = e.position, o = e.tp;
	if (e.state === "windup") {
		let s = r.n > 0 ? N.follow : N.windup;
		e.entered && n.sfx("growl", a.x, a.z, {
			pitch: 1.25,
			volume: .6
		}), e.pose("windup"), e.t < M(s - N.lock) - Do && (e.face(i.x, i.z), o.d > N.closeIn && e.walk(o.dx, o.dz, ko * .6, t, n, null, !1));
		let c = e.markerSpec("sector", a.x, a.z);
		c.r = N.r, c.halfAngle = N.half, c.progress = Math.min(1, e.t / M(s)), e.mark(0, n, c), e.after(s) && (r.lx = e.facing.x, r.lz = e.facing.z, r.tag = e.newTag(), e.markProgress(0, n, 1), e.setState("active"));
		return;
	}
	if (e.state === "active") {
		if (e.entered && (n.sfx("swing", a.x, a.z, {
			pitch: 1.3,
			volume: .8
		}), n.fx("bruteBite", a.x + r.lx * 1.4, a.y, a.z + r.lz * 1.4, Ro)), e.after(N.active)) {
			e.unmark(0, n), r.n++, r.n === 1 || r.n === 2 && e.rng.chance(N.third) ? e.setState("windup") : e.setState("recover");
			return;
		}
		e.pose("attack");
		let i = N.lunge / M(N.active);
		e.move(r.lx * i * t, r.lz * i * t, n);
		let o = e.hitSpec();
		o.shape = "sector", o.r = N.r, o.halfAngle = N.half, o.dirX = r.lx, o.dirZ = r.lz, o.mv = N.mv, o.kb = N.kb, o.tag = r.tag, n.hitbox(e, o);
		return;
	}
	e.fr < 8 ? e.pose("attack") : (e.face(i.x, i.z), e.anim("idle")), e.after(N.recover) && qo(e, n, M(N.cooldown));
}
function Yo(e, t, n) {
	let r = e.ai, i = n.player, a = e.position, o = M(P.windup + P.air);
	if (e.state === "windup") {
		if (e.entered && n.sfx("growl", a.x, a.z, { pitch: 1.1 }), e.pose("crouch"), e.t < M(P.windup - P.lock) - Do || e.entered) {
			let t = i.position.x + i.velocity.x * P.lead, o = i.position.z + i.velocity.z * P.lead, s = t - a.x, c = o - a.z, l = Math.hypot(s, c);
			l < .001 ? (s = e.facing.x, c = e.facing.z, l = 1) : (s /= l, c /= l), e.faceDir(s, c);
			let u = e.freeRun(s, c, Math.min(P.max + .5, l), n);
			l = Math.max(1.2, Math.min(l, u)), t = a.x + s * l, o = a.z + c * l, r.sx = a.x, r.sz = a.z, r.tx = t, r.tz = o;
		}
		let t = e.markerSpec("circle", r.tx, r.tz);
		t.r = P.r, t.progress = Math.min(1, e.t / o), e.mark(0, n, t), e.after(P.windup) && (r.sx = a.x, r.sz = a.z, r.tag = e.newTag(), n.burst("bruteDust", a.x, a.y + .2, a.z, 4), n.sfx("dodge", a.x, a.z, { pitch: .8 }), e.setState("active"));
		return;
	}
	if (e.state === "active") {
		let i = M(P.air), s = Math.min(1, e.t / i), c = Math.min(1, (e.t + t) / i), l = (r.tx - r.sx) * (c - s), u = (r.tz - r.sz) * (c - s);
		if (Math.abs(l) + Math.abs(u) > 1e-6 && e.move(l, u, n), e.lift = P.arc * 4 * c * (1 - c), e.pose(c < .85 ? "leap" : "land"), e.markProgress(0, n, Math.min(1, (M(P.windup) + e.t + t) / o)), c >= .999999) {
			e.lift = 0;
			let t = n.groundAt(a.x, a.z), i = e.hitSpec();
			i.shape = "circle", i.y = t, i.r = P.r, i.mv = P.mv, i.kb = P.kb, i.knockdown = !0, i.tag = r.tag, n.hitbox(e, i), n.fx("dust", a.x, t, a.z, Uo), Ho.dirX = e.facing.x, Ho.dirZ = e.facing.z, n.fx("bruteQuake", a.x, t, a.z, Ho), n.burst("bruteDust", a.x, t + .3, a.z, 8), n.burst("emberBurst", a.x, t + .4, a.z, 8), n.sfx("slam", a.x, a.z, {
				volume: .55,
				pitch: 1.2
			}), e.unmark(0, n), e.setState("recover");
		}
		return;
	}
	e.pose(e.fr < 18 ? "land" : "idle0"), e.fr >= 18 && e.face(i.position.x, i.position.z), e.after(P.recover) && (r.pounceCd = P.cooldown, qo(e, n, M(N.cooldown)));
}
function Xo(e, t, n) {
	let r = e.ai, i = n.player.position, a = e.position;
	if (e.state === "windup") {
		e.entered && n.sfx("growl", a.x, a.z, { pitch: .9 }), e.pose("breathWind"), e.t < M(F.windup - F.lock) - Do && e.face(i.x, i.z), Go(e, r, 6) && n.burst("bruteEmbers", a.x + e.facing.x * .9, a.y + 1.5, a.z + e.facing.z * .9, 2);
		let t = e.markerSpec("sector", a.x, a.z);
		t.r = F.r, t.halfAngle = F.half, t.progress = Math.min(1, e.t / M(F.windup)), e.mark(0, n, t), e.after(F.windup) && (r.lx = e.facing.x, r.lz = e.facing.z, r.n = 0, r.fx = 0, e.markProgress(0, n, 1), n.sfx("breath", a.x, a.z), e.setState("active"));
		return;
	}
	if (e.state === "active") {
		if (e.pose(e.fr / 6 & 1 ? "breath1" : "breath0"), e.fr >= r.fx * 24 && (r.fx = Math.floor(e.fr / 24) + 1, Bo.dirX = r.lx, Bo.dirZ = r.lz, n.fx("bruteBreath", a.x + r.lx * Vo, n.groundAt(a.x, a.z), a.z + r.lz * Vo, Bo)), Go(e, r, 2)) {
			let t = n.groundAt(a.x, a.z), i = (e.fr >> 1) % 6, o = 1 + i * .75, s = Math.sin(e.fr * .9) * F.half * .6 * Oo * (o / F.r), c = Math.cos(s), l = Math.sin(s), u = r.lx * c - r.lz * l, d = r.lx * l + r.lz * c;
			n.burst("bruteBreath", a.x + u * o, t + 1 - i * .1, a.z + d * o, 4 + (i > 2 ? 2 : 0)), i === 0 && n.burst("bruteFireCore", a.x + r.lx * 1, t + 1, a.z + r.lz * 1, 1);
		}
		e.fr >= r.n * F.every && (r.n++, r.tag = e.newTag(), r.n === 4 && n.sfx("breath", a.x, a.z, { volume: .7 }));
		let t = e.hitSpec();
		t.shape = "sector", t.r = F.r, t.halfAngle = F.half, t.dirX = r.lx, t.dirZ = r.lz, t.mv = F.mv, t.kb = F.kb, t.tag = r.tag, n.hitbox(e, t), e.after(F.active) && (e.unmark(0, n), e.setState("recover"));
		return;
	}
	e.entered && n.burst("bruteSmoke", a.x + r.lx, a.y + 1.1, a.z + r.lz, 3), e.fr < 12 ? e.pose("breath0") : (e.face(i.x, i.z), e.anim("idle")), e.after(F.recover) && (r.breathCd = F.cooldown, qo(e, n, M(N.cooldown)));
}
//#endregion
//#region src/game/combat/ai/wyrmcaller.js
var Zo = (e) => e / 60, Qo = 1e-6, $o = 2.5, es = Object.freeze({
	min: 5.5,
	max: 9
}), ts = 3.6, ns = 1.5, rs = 2.4, is = .7, as = 2.9, os = Object.freeze({
	speed: 9,
	y: 2.3,
	radius: .15
}), I = Object.freeze({
	range: 11,
	windup: 28,
	cast: 12,
	flight: .8,
	lead: .35,
	r: 1.8,
	mv: 1.25,
	kb: 1.8,
	apex: 2.4,
	recover: 16,
	cooldown: 2.6
}), L = Object.freeze({
	range: 10,
	chance: .45,
	windup: 34,
	n: 3,
	every: .45,
	fill: .8,
	r: 1.5,
	mv: 1.1,
	kb: 1.4,
	recover: 20,
	cooldown: 9
}), R = Object.freeze({
	near: 3,
	nearF: 30,
	hits: 2,
	hitWindow: 1.5,
	tuck: 14,
	dist: 5,
	cooldown: 5,
	r: 1.6,
	fill: .5,
	mv: .6,
	kb: 1.4
}), ss = Object.freeze({
	still: 16,
	fade: 34,
	embers: 6
}), cs = Object.freeze({
	frame: "bruteFireball",
	mode: "billboard",
	color: [
		3,
		1.35,
		.42
	],
	scale: 1.35,
	fps: 14,
	trail: "bruteEmbers",
	trailEvery: .04,
	trailCount: 2,
	hitBurst: "bruteFireBlast",
	hitCount: 18,
	hitFx: "impact",
	hitFxScale: 1.8,
	hitSfx: "explosion",
	hitVolume: .9,
	fadeBurst: "bruteEmbers",
	fadeCount: 4
}), ls = Object.freeze({
	frame: "bruteFireball",
	mode: "billboard",
	color: [
		2.8,
		1.25,
		.4
	],
	scale: .95,
	fps: 14,
	trail: "bruteEmbers",
	trailEvery: .05,
	trailCount: 1,
	hitBurst: "bruteFireBlast",
	hitCount: 8,
	hitFx: "impact",
	hitFxScale: .8,
	hitSfx: "fireRoar",
	hitVolume: .35,
	fadeBurst: "bruteEmbers",
	fadeCount: 3
}), us = {
	mode: "billboard",
	lift: .65,
	color: [
		2.3,
		1,
		.3
	],
	loop: !0,
	duration: 1.2,
	scale: 1.3
}, ds = {
	mode: "flat",
	lift: .04,
	color: [
		2.2,
		.9,
		.28
	],
	loops: 2,
	fps: 6,
	scale: 1.15,
	dirX: 0,
	dirZ: 1
}, fs = {
	mode: "flat",
	lift: .05,
	color: [
		2,
		.8,
		.25
	],
	loops: 2,
	fps: 5,
	scale: .95,
	dirX: 0,
	dirZ: 1
}, ps = {
	mode: "billboard",
	lift: 1.95,
	color: [
		2.4,
		1.05,
		.32
	],
	loops: 2,
	fps: 14,
	scale: 1.15
}, ms = {
	init(e) {
		return {
			siege: ro(),
			move: "fireball",
			force: null,
			cd: Zo(e.rng.int(30, 80)),
			pillarCd: e.rng.range(2, 5),
			blinkCd: 0,
			blinking: !1,
			blinkT: 0,
			nearT: 0,
			hitN: 0,
			hitT: 0,
			side: e.rng.chance(.5) ? 1 : -1,
			strafeT: Zo(e.rng.int(60, 140)),
			awayT: 0,
			los: !1,
			losT: 0,
			pillars: [],
			erupted: [
				!1,
				!1,
				!1
			],
			glyph: [
				!1,
				!1,
				!1
			],
			sigilT: 0,
			each: 0
		};
	},
	idle(e, t, n) {
		let r = e.ai, i = co(e, t, n, ts, -1, ns, rs);
		if (i < 0) {
			r.siege.there && e.anim("idle");
			return;
		}
		let a = r.siege, o = e.position;
		if (i < is) {
			if (e.pose("windup"), Math.floor(i / .12) !== Math.floor((i - t) / .12)) {
				let t = vs(e);
				n.burst("bruteGather", t.x, t.y, t.z, 2);
			}
		} else if (i < 1.0499999999999998) {
			if (e.pose("throw"), !a.hit) {
				a.hit = !0;
				let t = e.besiege, r = t.x - a.wx, s = t.z - a.wz, c = Math.hypot(r, s) || 1;
				r /= c, s /= c;
				let l = a.wx + r * .4, u = a.wz + s * .4, d = a.wy + as, f = o.y + os.y, p = Math.hypot(l - o.x, u - o.z), m = e.projSpec();
				m.kind = "emberBolt", m.x = o.x + e.facing.x * .3, m.y = f, m.z = o.z + e.facing.z * .3, m.dirX = p > .001 ? (l - o.x) / p : e.facing.x, m.dirZ = p > .001 ? (u - o.z) / p : e.facing.z, m.speed = os.speed, m.vy = lr(f, d, os.speed, p), m.range = p + 1, m.radius = os.radius, m.mv = 0, m.kb = 0, m.look = ls, n.projectile(e, m), n.sfx("fireballFall", o.x, o.z, { volume: .5 }), a.fireAt = i + p / os.speed;
			}
		} else e.anim("idle");
		if (a.fireAt >= 0 && i >= a.fireAt) {
			a.fireAt = -1;
			let t = e.besiege, r = a.wx + (t.x - a.wx) * .12, i = a.wz + (t.z - a.wz) * .12, o = a.wy + as;
			n.burst("bruteFireCore", r, o, i, 2), n.burst("bruteFireBlast", r, o, i, 12), n.burst("bruteEmbers", r, o + .3, i, 6), n.burst("bruteSmoke", r, o + .6, i, 4), n.fx("bruteFlames", r, o - .2, i, us), n.sfx("fireRoar", r, i, { volume: .5 });
		}
	},
	engage(e, t, n) {
		let r = e.ai, i = e.tp, a = n.player.position, o = e.position;
		if (lo(e), r.cd > 0 && (r.cd -= t), r.pillarCd > 0 && (r.pillarCd -= t), r.blinkCd > 0 && (r.blinkCd -= t), r.hitT += t, r.hitT > R.hitWindow && (r.hitN = 0), r.nearT = i.d < R.near ? r.nearT + t : 0, r.losT -= t, r.losT <= 0 && (r.los = n.los(o.x, o.z, a.x, a.z), r.losT = Zo(6)), r.blinking) {
			Ts(e, t, n);
			return;
		}
		let s = r.force, c = (e) => !s || s === e;
		if (c("blink") && (s === "blink" || r.blinkCd <= 0 && (r.nearT >= Zo(R.nearF) - Qo || r.hitN >= R.hits))) {
			r.force = null, r.blinking = !0, r.blinkT = 0, Ts(e, t, n);
			return;
		}
		let l = e.canWindup(n);
		if (l && r.los) {
			if (c("pillars") && i.d <= L.range && (s === "pillars" || r.cd <= 0 && r.pillarCd <= 0 && e.rng.chance(L.chance)) && e.takeToken(n)) {
				bs(e, "pillars");
				return;
			}
			if (c("fireball") && i.d <= I.range && (s === "fireball" || r.cd <= 0) && e.takeToken(n)) {
				bs(e, "fireball");
				return;
			}
			!s && r.pillarCd <= 0 && (r.pillarCd = 1.2);
		}
		if (i.d < es.min - .5) {
			r.awayT -= t, r.awayT <= 0 && (e.bestAway(a.x, a.z, 1.5, n, !0) || (e.away.x = -i.dx, e.away.z = -i.dz), r.awayT = Zo(12)), e.walk(e.away.x, e.away.z, $o, t, n, "walk");
			return;
		}
		if (i.d > es.max || r.cd <= 0 && (!l || !r.los)) {
			e.chase($o, t, n, "walk");
			return;
		}
		r.strafeT -= t, r.strafeT <= 0 && (e.rng.chance(.5) && (r.side = -r.side), r.strafeT = Zo(e.rng.int(60, 140)));
		let u = e.walk(-i.dz * r.side, i.dx * r.side, $o * .6, t, n, "walk", !1);
		e.face(a.x, a.z), u < .25 && (r.side = -r.side);
	},
	attack(e, t, n) {
		e.ai.move === "pillars" ? Cs(e, t, n) : Ss(e, t, n);
	},
	onHit(e, t) {
		let n = e.ai;
		t.source === "melee" && (n.hitT > R.hitWindow && (n.hitN = 0), n.hitN++, n.hitT = 0);
	},
	cancel(e) {
		let t = e.ai;
		t.blinking = !1, t.blinkT = 0, t.pillars.length = 0, lo(e);
	},
	die(e, t) {
		let n = e.position;
		t.burst("bruteBlink", n.x, n.y + .8, n.z, 12), t.burst("bruteSmoke", n.x, n.y + .5, n.z, 5), t.fx("bruteFlames", n.x, n.y - .3, n.z, hs), t.sfx("fireRoar", n.x, n.z, {
			volume: .5,
			pitch: 1.2
		});
	},
	dead(e, t, n) {
		let r = e.position, i = Zo(ss.embers);
		e.t < Zo(ss.still + ss.fade) && Math.floor(e.t / i) !== Math.floor((e.t - t) / i) && n.burst("bruteEmbers", r.x, r.y + .3, r.z, 3);
		let a = (e.t - Zo(ss.still)) / Zo(ss.fade);
		return a > 0 && (e.sprite.opacity = Math.min(e.sprite.opacity, Math.max(0, 1 - a))), !0;
	},
	glow(e, t) {
		let n = e.state === "windup" || e.state === "active";
		t[0] = 1, t[1] = .55, t[2] = .2, t[3] = e.alive ? n ? 3 : 2 : .5;
	}
}, hs = {
	mode: "billboard",
	lift: .55,
	color: [
		2.2,
		.95,
		.3
	],
	loops: 3,
	fps: 12,
	scale: 1.4
}, gs = {
	mode: "billboard",
	lift: .6,
	color: [
		2.4,
		1.05,
		.32
	],
	loops: 1,
	fps: 16,
	scale: 1.5
}, _s = {
	x: 0,
	y: 0,
	z: 0
};
function vs(e) {
	let t = e.position;
	return _s.x = t.x - e.facing.z * .45 + e.facing.x * .2, _s.y = t.y + 2.4, _s.z = t.z + e.facing.x * .45 + e.facing.z * .2, _s;
}
function ys(e, t, n) {
	return e.entered && (t.each = 0), e.fr < t.each * n ? !1 : (t.each = Math.floor(e.fr / n) + 1, !0);
}
function bs(e, t) {
	let n = e.ai;
	n.move = t, n.force = null, e.setState("windup");
}
function xs(e, t, n) {
	let r = e.ai;
	e.dropToken(t), r.cd = n, e.setState("engage");
}
function Ss(e, t, n) {
	let r = n.player, i = e.position;
	if (e.state === "windup") {
		if (e.entered && n.sfx("windup", i.x, i.z), e.face(r.position.x, r.position.z), e.pose("windup"), ys(e, e.ai, 4)) {
			let t = vs(e);
			n.burst("bruteGather", t.x, t.y, t.z, 2);
		}
		if (e.after(I.windup)) {
			let t = r.position.x + r.velocity.x * I.lead, a = r.position.z + r.velocity.z * I.lead, o = t - i.x, s = a - i.z, c = Math.hypot(o, s);
			c > I.range + 1 && (t = i.x + o / c * (I.range + 1), a = i.z + s / c * (I.range + 1), o = t - i.x, s = a - i.z);
			let l = e.hazardCircle(t, a, I.r, I.flight);
			l.mv = I.mv, l.kb = I.kb, l.burst = "bruteFireCore", l.burstN = 5;
			let u = vs(e), d = Math.hypot(t - u.x, a - u.z), f = e.projSpec();
			f.kind = "emberBolt", f.x = u.x, f.y = u.y, f.z = u.z, f.dirX = d > .001 ? (t - u.x) / d : e.facing.x, f.dirZ = d > .001 ? (a - u.z) / d : e.facing.z, f.speed = d / I.flight, f.range = d, f.radius = .05, f.mv = 0, f.kb = 0, f.arc = {
				tx: t,
				tz: a,
				time: I.flight,
				apex: I.apex
			}, f.look = cs, n.projectile(e, f), n.burst("bruteFireCore", u.x, u.y, u.z, 2), n.sfx("fireballFall", i.x, i.z), e.setState("active");
		}
		return;
	}
	if (e.state === "active") {
		e.pose("attack"), e.after(I.cast) && e.setState("recover");
		return;
	}
	e.anim("idle"), e.after(I.recover) && xs(e, n, I.cooldown);
}
function Cs(e, t, n) {
	let r = e.ai, i = n.player.position, a = e.position;
	if (e.state === "windup") {
		if (e.entered && n.sfx("fireRoar", a.x, a.z, {
			volume: .6,
			pitch: .8
		}), e.face(i.x, i.z), e.pose("channel"), ys(e, r, 4)) {
			let t = vs(e);
			n.burst("bruteGather", t.x, t.y, t.z, 2), (e.fr & 7) < 4 && n.burst("bruteEmbers", a.x, a.y + .3, a.z, 3);
		}
		if (ws(e, n), e.after(L.windup)) {
			r.pillars.length = 0;
			for (let t = 0; t < L.n; t++) {
				let n = e.hazardCircle(0, 0, L.r, L.fill, t * L.every, !0);
				n.mv = L.mv, n.kb = L.kb, n.burst = "brutePillar", n.burstN = 20, n.sfx = "fireRoar", r.pillars.push(n), r.erupted[t] = !1, r.glyph[t] = !1;
			}
			e.setState("active");
		}
		return;
	}
	if (e.state === "active") {
		e.pose("channel"), e.face(i.x, i.z), ws(e, n);
		for (let e = 0; e < r.pillars.length; e++) {
			let t = r.pillars[e];
			if (!t.on || (t.started && !r.glyph[e] && (r.glyph[e] = !0, n.fx("bruteSigil", t.x, n.groundAt(t.x, t.z), t.z, fs)), r.erupted[e] || !t.resolved)) continue;
			r.erupted[e] = !0;
			let i = n.groundAt(t.x, t.z);
			n.fx("brutePillar", t.x, i, t.z, ps), n.burst("bruteFireCore", t.x, i + .6, t.z, 3), n.burst("bruteSmoke", t.x, i + 1.6, t.z, 3);
		}
		e.t >= (L.n - 1) * L.every + L.fill + Zo(2) - Qo && (r.pillars.length = 0, e.setState("recover"));
		return;
	}
	e.anim("idle"), e.after(L.recover) && (r.pillarCd = L.cooldown, xs(e, n, I.cooldown));
}
function ws(e, t) {
	let n = e.ai;
	if (e.entered && (n.sigilT = 0), e.fr < n.sigilT) return;
	n.sigilT = e.fr + 40;
	let r = e.position;
	t.fx("bruteSigil", r.x, t.groundAt(r.x, r.z), r.z, ds);
}
function Ts(e, t, n) {
	let r = e.ai, i = n.player.position, a = e.position;
	if (r.blinkT === 0 && (n.burst("bruteBlink", a.x, a.y + .6, a.z, 10), n.fx("bruteFlames", a.x, a.y, a.z, gs), n.sfx("cackle", a.x, a.z)), e.pose("blink"), r.blinkT += t, r.blinkT < Zo(R.tuck) - Qo) return;
	let o = a.x, s = a.z, c = e.hazardCircle(o, s, R.r, R.fill);
	c.mv = R.mv, c.kb = R.kb, c.burst = "bruteFireBlast", c.burstN = 12, c.sfx = "fireRoar", n.burst("deathPoof", a.x, a.y + .6, a.z, 6), e.bestAway(i.x, i.z, R.dist, n) || (e.away.x = -e.tp.dx, e.away.z = -e.tp.dz), e.move(e.away.x * R.dist, e.away.z * R.dist, n), n.burst("bruteBlink", a.x, n.groundAt(a.x, a.z) + .6, a.z, 10), n.fx("bruteFlames", a.x, n.groundAt(a.x, a.z), a.z, gs), e.face(i.x, i.z), e.anim("idle"), r.blinking = !1, r.blinkT = 0, r.blinkCd = R.cooldown, r.nearT = 0, r.hitN = 0;
}
//#endregion
//#region src/game/combat/ai/kobold.js
var z = (e) => e / 60, Es = 1e-6, Ds = Math.PI * 2, Os = 8;
function ks(e, t, n) {
	let r = Math.max(0, e.index | 0) % 8, i = r === 7 ? 4 : Math.ceil(r / 2) * (r % 2 ? 1 : -1), a = e.rng.chance(.5) ? 1 : -1;
	return {
		off: Math.PI / 4 * i + e.rng.range(-.17, .17),
		ring: t + (r >= 4 ? n : 0) + e.rng.range(-.2, .2),
		base: NaN,
		sway: e.rng.next() * Ds,
		swayDir: a,
		feint: 0,
		feintCd: e.rng.range(1.5, 4),
		way: !0,
		wayAt: 0,
		side: 0,
		holding: !1,
		stepping: !1,
		closing: 0,
		sideSign: i > 0 ? 1 : i < 0 ? -1 : a,
		tx: 0,
		tz: 0
	};
}
function As(e) {
	return e %= Ds, e > Math.PI ? e -= Ds : e <= -Math.PI && (e += Ds), e;
}
function js(e, t, n) {
	if (Number.isNaN(t.base)) {
		let r = n.player.position, i = e.home.x - r.x, a = e.home.z - r.z;
		t.base = Math.hypot(i, a) > .5 ? Math.atan2(a, i) : Math.atan2(e.position.z - r.z, e.position.x - r.x);
	}
	return t.base + t.off;
}
function Ms(e, t, n, r, i, a) {
	let o = n.player.position, s = e.position, c = Math.max(.001, e.tp.d), l = Math.atan2(s.z - o.z, s.x - o.x), u = As(js(e, t, n) - l), d = Math.min(.9, i / c), f = l + Math.max(-d, Math.min(d, u)), p = Math.max(r, c - a);
	return t.tx = o.x + Math.cos(f) * p, t.tz = o.z + Math.sin(f) * p, u;
}
function Ns(e, t, n, r, i, a) {
	t.holding = !1;
	let o = n.nav, s = n.frame, c = e.position;
	if (o && (s >= t.wayAt || s < t.wayAt - Os)) {
		t.wayAt = s + Os;
		let r = Math.abs(e.tp.dy) <= .3;
		if (t.way = r && o.lineClear(c.x, c.z, t.tx, t.tz, .3), t.side = 0, r && !t.way) {
			let r = Fs(e, t, n);
			if (o.lineClear(c.x, c.z, r.x, r.z, .3)) t.side = t.sideSign;
			else {
				t.sideSign = -t.sideSign;
				let r = Fs(e, t, n);
				o.lineClear(c.x, c.z, r.x, r.z, .3) && (t.side = t.sideSign);
			}
		}
	}
	if (!o || t.way) e.seek(t.tx, t.tz, r, i, n, a);
	else if (t.side) {
		let o = Fs(e, t, n);
		e.seek(o.x, o.z, r, i, n, a);
	} else e.chase(r, i, n, a);
}
var Ps = {
	x: 0,
	z: 0
};
function Fs(e, t, n) {
	let r = n.player.position, i = e.position, a = Math.max(1, e.tp.d), o = Math.atan2(i.z - r.z, i.x - r.x) + t.sideSign * Math.min(1.2, 5 / a);
	return Ps.x = r.x + Math.cos(o) * (a - 1), Ps.z = r.z + Math.sin(o) * (a - 1), Ps;
}
function Is(e, t, n, r, i, a) {
	let o = n.player.position;
	t.holding || (t.holding = !0, e.resetSeek()), t.sway += i * .9, t.feintCd -= i;
	let s = t.ring + Math.sin(t.sway) * .35;
	t.feint > 0 ? (t.feint -= i, s -= t.feint > .25 ? .9 : 0) : t.feintCd <= 0 && (t.feint = .5, t.feintCd = e.rng.range(2.5, 5.5)), t.off += t.swayDir * i * .12, Ms(e, t, n, s, 2.5, 3);
	let c = e.position, l = t.tx - c.x, u = t.tz - c.z, d = Math.hypot(l, u);
	(t.stepping ? d < .12 : d > .45) && (t.stepping = !t.stepping);
	let f = 0;
	if (t.stepping) {
		let t = Math.min(r, d / i);
		f = e.walk(l / d, u / d, t, i, n, a, !1);
	} else a && e.anim("idle");
	return e.face(o.x, o.z), f;
}
var Ls = 1.2;
function Rs(e, t, n, r, i, a, o) {
	return t.closing > 0 ? (t.closing -= r, e.tp.d <= i && e.canMelee(n) && e.canWindup(n) ? (t.closing = 0, e.setState("windup"), "busy") : t.closing <= 0 ? (t.closing = 0, e.dropToken(n), "failed") : (e.chase(a, r, n, o), "busy")) : "idle";
}
function zs(e, t) {
	let n = t.player.facing;
	return -(e.tp.dx * n.x + e.tp.dz * n.z) < -.3;
}
var Bs = 3.3, Vs = 1.1, Hs = 4.8, Us = 2.6, Ws = 2.2, Gs = 4.4, Ks = 2.4, qs = 20, Js = 18, Ys = 6, Xs = 5, Zs = 22, Qs = 1.3, $s = 5, ec = 1.75, tc = .55, nc = .35, rc = 3.4, ic = 5, ac = 32, oc = 20, sc = 12, cc = 3.4, lc = .9, uc = .8, dc = 30, fc = .5, pc = .15, mc = 1.1, hc = 10, gc = 100, _c = /^(attack|skill1|a[123])$/, vc = {
	init(e) {
		return {
			...ks(e, Bs, Vs),
			cd: z(e.rng.int(20, 90)),
			cdL: z(e.rng.int(60, 240)),
			move: "jab",
			second: !1,
			tag: 0,
			lx: 0,
			lz: 1,
			len: cc,
			hopT: -1,
			hopX: 0,
			hopZ: 0,
			hopCd: 0,
			prevAction: null,
			prevSwing: 0
		};
	},
	engage(e, t, n) {
		let r = e.ai, i = e.tp, a = n.player;
		if (r.cd > 0 && (r.cd -= t), r.cdL > 0 && (r.cdL -= t), r.hopCd > 0 && (r.hopCd -= t), r.hopT >= 0) {
			let i = z(hc), o = Math.min(i, r.hopT + t), s = mc * (1 - (1 - o / i) ** 2 - (1 - (1 - r.hopT / i) ** 2));
			e.move(r.hopX * s, r.hopZ * s, n), e.face(a.position.x, a.position.z), e.pose("guard"), e.lift = .22 * Math.sin(Math.PI * o / i), r.hopT = o >= i - Es ? -1 : o, r.hopT < 0 && (e.lift = 0);
			return;
		}
		let o = a.action, s = a.swing ?? 0;
		if ((o !== r.prevAction || s !== r.prevSwing) && (r.prevAction = o, r.prevSwing = s, o && _c.test(o) && i.d <= 2 && r.hopCd <= 0 && e.rng.chance(pc))) {
			r.hopT = 0, r.hopX = -i.dx, r.hopZ = -i.dz, r.hopCd = z(gc), e.pose("guard");
			return;
		}
		let c = Rs(e, r, n, t, Ks, Hs, "run");
		if (c !== "busy") {
			if (c === "failed" && (r.cd = z(e.rng.int(30, 60))), i.d <= r.ring + Ws) {
				let a = e.canMelee(n);
				if (r.cdL <= 0 && a && i.d >= rc && i.d <= ic && e.canWindup(n)) {
					if (e.rng.chance(fc) && e.takeToken(n)) {
						r.move = "lunge", e.setState("windup");
						return;
					}
					r.cdL = z(e.rng.int(60, 120));
				}
				if (r.cd <= 0 && a && i.d <= Gs && e.canWindup(n) && e.takeToken(n)) {
					r.move = "jab", r.second = !1, i.d <= Ks ? e.setState("windup") : r.closing = Ls;
					return;
				}
				Is(e, r, n, Us, t, null) > .05 ? e.anim("walk") : bc(e, n);
				return;
			}
			Ms(e, r, n, r.ring, 2.4, 3.5), Ns(e, r, n, i.d > 8 ? Hs : e.def.speed, t, "run");
		}
	},
	attack(e, t, n) {
		e.ai.move === "lunge" ? Sc(e, t, n) : xc(e, t, n);
	},
	cancel(e) {
		let t = e.ai;
		t.second = !1, t.hopT = -1, t.closing = 0, e.lift = 0;
	}
};
function yc(e, t) {
	t.hopT = 0, t.hopX = -e.tp.dx, t.hopZ = -e.tp.dz;
}
function bc(e, t) {
	e.pose(Math.floor(t.time * 2.5 + e.index * .37) % 2 ? "guard2" : "guard");
}
function xc(e, t, n) {
	let r = e.ai, i = n.player.position, a = e.tp, o = e.position;
	if (e.state === "windup") {
		let s = r.second ? Js : qs;
		e.entered && !r.second && n.sfx("yip", o.x, o.z, {
			volume: .7,
			pitch: 1 + e.index % 4 * .05
		}), e.pose("windup"), e.t < z(s - Ys) - Es && (e.face(i.x, i.z), a.d > Qs && e.walk(a.dx, a.dz, $s, t, n, null, !1)), e.after(s) && (r.lx = e.facing.x, r.lz = e.facing.z, r.tag = e.newTag(), n.fx("thrust", o.x + r.lx * 1, o.y - .12, o.z + r.lz * 1, {
			dirX: r.lx,
			dirZ: r.lz,
			scale: .42
		}), n.sfx("swing", o.x, o.z, {
			volume: .6,
			pitch: 1.35
		}), e.setState("active"));
		return;
	}
	if (e.state === "active") {
		if (e.after(Xs)) {
			!r.second && e.rng.chance(nc) ? (r.second = !0, e.setState("windup")) : e.setState("recover");
			return;
		}
		e.pose("attack");
		let t = e.hitSpec();
		t.shape = "lane", t.dirX = r.lx, t.dirZ = r.lz, t.len = ec, t.width = tc, t.mv = .85, t.kb = .4, t.tag = r.tag, n.hitbox(e, t);
		return;
	}
	e.fr < 10 ? e.pose("attack") : (e.face(i.x, i.z), e.pose("guard")), e.after(Zs) && (e.dropToken(n), r.second = !1, r.cd = z(e.rng.int(70, 150)) * (zs(e, n) ? .6 : 1), yc(e, r), e.setState("engage"));
}
function Sc(e, t, n) {
	let r = e.ai, i = n.player.position, a = e.position;
	if (e.state === "windup") {
		e.entered && n.sfx("yip", a.x, a.z, {
			volume: .9,
			pitch: 1.25
		}), e.pose("lungeWind"), e.t < z(oc) - Es && (e.face(i.x, i.z), r.lx = e.facing.x, r.lz = e.facing.z, r.len = Math.max(.5, e.freeRun(r.lx, r.lz, cc, n)));
		let t = e.markerSpec("lane", a.x, a.z);
		t.dirX = r.lx, t.dirZ = r.lz, t.len = r.len + lc, t.width = uc, t.progress = Math.min(1, e.t / z(ac)), t.flash = e.lockFlash(e.t - z(oc)), e.mark(0, n, t), e.after(ac) && (e.markProgress(0, n, 1), r.tag = e.newTag(), n.burst("swarmDust", a.x, a.y + .1, a.z, 5), n.fx("thrust", a.x + r.lx * 1.2, a.y - .05, a.z + r.lz * 1.2, {
			dirX: r.lx,
			dirZ: r.lz,
			scale: .55
		}), n.sfx("swing", a.x, a.z, {
			volume: .8,
			pitch: 1.15
		}), e.setState("active"));
		return;
	}
	if (e.state === "active") {
		if (e.after(sc)) {
			e.markToFade(0, n, z(10)), e.setState("recover");
			return;
		}
		e.pose("lunge");
		let i = Math.min(t, z(sc) - e.t), o = r.len / z(sc);
		i > 0 && e.move(r.lx * o * i, r.lz * o * i, n);
		let s = e.hitSpec();
		s.shape = "circle", s.x = a.x + r.lx * lc * .6, s.z = a.z + r.lz * lc * .6, s.r = .55, s.mv = 1.25, s.kb = 1, s.tag = r.tag, n.hitbox(e, s);
		return;
	}
	e.pose(e.fr < 10 ? "lunge" : "guard"), e.fr >= 10 && e.face(i.x, i.z), e.after(dc) && (e.dropToken(n), r.cdL = z(e.rng.int(300, 480)), r.cd = z(e.rng.int(40, 80)), yc(e, r), e.setState("engage"));
}
//#endregion
//#region src/game/combat/ai/whelp.js
var B = (e) => e / 60, Cc = 1e-6, wc = 3.7, Tc = 1.1, Ec = 2, Dc = 4.4, Oc = 2.4, kc = 4, Ac = 14, jc = 24, Mc = .32, Nc = .3, Pc = 1.55, Fc = 4.8, Ic = 2.6, Lc = 22, Rc = 1.6, zc = 4, Bc = 9, Vc = 1.3, Hc = 26, Uc = .75, Wc = 1.4, Gc = 14, Kc = 4, qc = 8, Jc = 34, Yc = 22, Xc = .3, Zc = 9, Qc = 8.5, $c = .5, el = 20, tl = "swarmSpit", nl = Object.freeze([
	1,
	.45,
	.12
]), rl = {
	init(e) {
		return {
			...ks(e, wc, Tc),
			hop: e.rng.next() * B(jc),
			cd: B(e.rng.int(30, 100)),
			cdS: B(e.rng.int(60, 200)),
			move: "bite",
			tag: 0,
			lx: 0,
			lz: 1,
			px: 0,
			pz: 0,
			len: 4,
			back: -1,
			bx: 0,
			bz: 0,
			los: !1,
			losT: 0,
			glow: 1.6
		};
	},
	idle(e, t, n) {
		let r = e.ai, i = e.position, a = i.x, o = i.z;
		e.wander(t, n, .45), al(e, r, t, Math.hypot(i.x - a, i.z - o) > 1e-4), r.glow += (1.6 - r.glow) * Math.min(1, t * 4);
	},
	engage(e, t, n) {
		let r = e.ai, i = e.tp, a = n.player.position, o = e.position;
		if (r.cd > 0 && (r.cd -= t), r.cdS > 0 && (r.cdS -= t), r.glow += (1.6 - r.glow) * Math.min(1, t * 4), r.back >= 0) {
			let i = B(Gc), o = Math.min(i, r.back + t), s = Wc * (1 - (1 - o / i) ** 2 - (1 - (1 - r.back / i) ** 2));
			e.move(r.bx * s, r.bz * s, n), e.face(a.x, a.z), e.pose(o < i * .4 ? "move1" : "move2"), e.lift = Mc * Math.sin(Math.PI * o / i), r.back = o >= i - Cc ? -1 : o, r.back < 0 && (e.lift = 0, r.hop = 0);
			return;
		}
		let s = Rs(e, r, n, t, Ic, Dc * il(r), null);
		if (s === "busy") {
			e.state === "engage" ? al(e, r, t, !0) : e.lift = 0;
			return;
		}
		s === "failed" && (r.cd = B(e.rng.int(30, 60)));
		let c = i.d <= r.ring + Ec, l = r.hop < B(kc) - Cc || r.hop >= B(18) - Cc;
		if (c && l) {
			let s = e.canMelee(n);
			if (r.cd <= 0 && s && i.d <= Fc && e.canWindup(n) && e.takeToken(n)) {
				r.move = "bite", i.d <= Ic ? (e.lift = 0, e.setState("windup")) : r.closing = Ls;
				return;
			}
			if (r.losT -= t, r.losT <= 0 && (r.los = n.los(o.x, o.z, a.x, a.z), r.losT = B(12)), r.cdS <= 0 && r.los && i.d >= Kc && i.d <= qc && e.canWindup(n) && e.takeToken(n)) {
				r.move = "spit", e.lift = 0, e.setState("windup");
				return;
			}
		}
		if (c) {
			let i = o.x, a = o.z;
			Is(e, r, n, Oc * il(r), t, null), al(e, r, t, Math.hypot(o.x - i, o.z - a) > 1e-4);
			return;
		}
		Ms(e, r, n, r.ring, 2.4, 3.5), Ns(e, r, n, (i.d > 8 ? Dc : e.def.speed) * il(r), t, null), al(e, r, t, !0);
	},
	attack(e, t, n) {
		e.ai.move === "spit" ? sl(e, t, n) : ol(e, t, n);
	},
	cancel(e) {
		let t = e.ai;
		t.back = -1, t.hop = 0, t.closing = 0, e.lift = 0;
	},
	die(e, t) {
		let n = e.position;
		t.burst("swarmSpark", n.x, n.y + .5, n.z, 6);
	},
	glow(e, t) {
		let n = e.ai;
		t[0] = nl[0], t[1] = nl[1], t[2] = nl[2], t[3] = e.alive ? n ? n.glow : 1.6 : 0;
	}
};
function il(e) {
	return e.hop >= B(kc) - Cc && e.hop < B(18) - Cc ? Pc : Nc;
}
function al(e, t, n, r) {
	let i = t.hop >= B(kc) - Cc && t.hop < B(18) - Cc;
	if (!r && !i) {
		t.hop = 0, e.lift = 0, e.anim("idle");
		return;
	}
	t.hop += n, t.hop >= B(jc) - Cc && (t.hop -= B(jc));
	let a = t.hop;
	if (a < B(kc) - Cc) e.lift = 0, e.pose("move0");
	else if (a < B(18) - Cc) {
		let t = Math.min(1, (a - B(kc)) / B(Ac));
		e.lift = Mc * 4 * t * (1 - t), e.pose(t < .3 ? "move1" : t < .75 ? "move2" : "move3");
	} else e.lift = 0, e.pose("move3");
}
function ol(e, t, n) {
	let r = e.ai, i = n.player.position, a = e.tp, o = e.position;
	if (e.state === "windup") {
		e.entered && n.sfx("growl", o.x, o.z, {
			volume: .7,
			pitch: 1.5 + e.index % 3 * .08
		}), e.pose("windup"), r.glow += (2.2 - r.glow) * Math.min(1, t * 6), e.t < B(16) - Cc && (e.face(i.x, i.z), a.d > Rc && e.walk(a.dx, a.dz, zc, t, n, null, !1)), e.after(Lc) && (r.lx = e.facing.x, r.lz = e.facing.z, r.tag = e.newTag(), n.sfx("swing", o.x, o.z, {
			volume: .55,
			pitch: 1.5
		}), e.setState("active"));
		return;
	}
	if (e.state === "active") {
		if (e.after(Bc)) {
			e.lift = 0, n.burst("swarmDust", o.x, o.y + .05, o.z, 3), e.setState("recover");
			return;
		}
		e.pose("attack");
		let i = Math.min(t, B(Bc) - e.t), a = Vc / B(Bc);
		i > 0 && e.move(r.lx * a * i, r.lz * a * i, n);
		let s = Math.min(1, (e.t + t) / B(Bc));
		e.lift = 1 * s * (1 - s);
		let c = e.hitSpec();
		c.shape = "sector", c.r = 1.05, c.halfAngle = 55, c.dirX = r.lx, c.dirZ = r.lz, c.mv = 1, c.kb = .5, c.tag = r.tag, n.hitbox(e, c);
		return;
	}
	e.fr < 6 ? e.pose("move3") : (e.face(i.x, i.z), e.anim("idle")), e.after(Hc) && (e.dropToken(n), r.cd = B(e.rng.int(80, 160)) * (zs(e, n) ? .6 : 1), e.rng.chance(Uc) && (r.back = 0, r.bx = -a.dx, r.bz = -a.dz), e.setState("engage"));
}
function sl(e, t, n) {
	let r = e.ai, i = n.player, a = e.position;
	if (e.state === "windup") {
		e.entered && n.sfx("growl", a.x, a.z, {
			volume: .6,
			pitch: 1.2
		}), e.pose("spitWind");
		let t = Math.min(1, e.t / B(Jc));
		r.glow = 1.6 + 2.4 * t, e.t < B(Yc) - Cc && (r.px = i.position.x + i.velocity.x * Xc, r.pz = i.position.z + i.velocity.z * Xc, e.face(r.px, r.pz), r.lx = e.facing.x, r.lz = e.facing.z, r.len = Math.min(Qc, Math.hypot(r.px - a.x, r.pz - a.z) + 1.5));
		let o = e.markerSpec("lane", a.x, a.z);
		if (o.dirX = r.lx, o.dirZ = r.lz, o.len = r.len, o.width = $c, o.progress = t, o.flash = e.lockFlash(e.t - B(Yc)), e.mark(0, n, o), e.after(Jc)) {
			e.markProgress(0, n, 1);
			let t = Math.max(.5, r.len - 1.5), i = a.y + .6, o = e.projSpec();
			o.kind = tl, o.x = a.x + r.lx * .6, o.z = a.z + r.lz * .6, o.y = i, o.dirX = r.lx, o.dirZ = r.lz, o.vy = lr(i, n.groundAt(r.px, r.pz) + .9, Zc, t), o.speed = Zc, o.range = r.len, o.radius = .25, o.mv = .85, o.kb = .3, n.projectile(e, o), e.markToFade(0, n, r.len / Zc), n.burst("swarmSpark", o.x, i, o.z, 4), n.sfx("bolt", a.x, a.z, {
				volume: .55,
				pitch: 1.45
			}), r.glow = 4.2, e.setState("recover");
		}
		return;
	}
	e.pose(e.fr < 12 ? "spit" : "idle0"), e.after(el) && (e.dropToken(n), r.cdS = B(e.rng.int(300, 450)), r.cd = Math.max(r.cd, B(30)), e.setState("engage"));
}
//#endregion
//#region src/game/combat/ai/emberimp.js
var V = (e) => e / 60, cl = 1e-6, ll = Math.PI / 180, ul = 1.6, dl = .15, fl = 5, pl = .9, ml = 3, hl = 5.6, gl = .35, _l = 2.5, vl = 9, yl = 30, bl = 18, xl = .3, Sl = 8.5, Cl = 10, wl = .45, Tl = 16, El = 9 * ll, Dl = "swarmOrb", Ol = 2.5, kl = 6.5, Al = 30, jl = .2, Ml = 1.5, Nl = 11, Pl = .3, Fl = 2.2, Il = .7, Ll = 14, Rl = 36, zl = Object.freeze([
	1,
	.45,
	.12
]), Bl = 1.3, Vl = 3.2, Hl = {
	init(e) {
		return {
			...ks(e, fl, pl),
			cdO: V(e.rng.int(40, 160)),
			cdD: V(e.rng.int(300, 600)),
			move: "orb",
			casts: 0,
			n: 1,
			px: 0,
			pz: 0,
			lx: 0,
			lz: 1,
			len: 6,
			dx: 0,
			dz: 1,
			diveF: 1,
			h0: ul,
			phase: "windup",
			tag: 0,
			los: !1,
			losT: 0,
			clock: e.rng.next() * 10,
			idleAng: e.rng.next() * Math.PI * 2,
			glow: Bl
		};
	},
	idle(e, t, n) {
		let r = e.ai;
		Ul(e, r, t), r.idleAng += .7 * t * r.swayDir;
		let i = Math.min(1.4, e.homeRadius);
		Wl(e, e.home.x + Math.cos(r.idleAng) * i, e.home.z + Math.sin(r.idleAng) * i, 1.6, t, n), e.anim("idle"), r.glow += (Bl - r.glow) * Math.min(1, t * 4);
	},
	engage(e, t, n) {
		let r = e.ai, i = e.tp, a = n.player.position, o = e.position;
		if (Ul(e, r, t), r.cdO > 0 && (r.cdO -= t), r.cdD > 0 && (r.cdD -= t), r.glow += (Bl - r.glow) * Math.min(1, t * 4), i.d <= r.ring + ml) {
			if (r.cdD <= 0 && i.d >= Ol && i.d <= kl && e.canWindup(n) && e.takeToken(n)) {
				r.move = "dive", r.phase = "windup", r.px = a.x + n.player.velocity.x * jl, r.pz = a.z + n.player.velocity.z * jl, r.h0 = e.hover, e.setState("windup");
				return;
			}
			if (r.losT -= t, r.losT <= 0 && (r.los = n.los(o.x, o.z, a.x, a.z), r.losT = V(10)), r.cdO <= 0 && r.los && i.d >= _l && i.d <= vl && e.canWindup(n) && e.takeToken(n)) {
				r.move = "orb", r.n = r.casts % 3 == 2 ? 2 : 1, e.setState("windup");
				return;
			}
			r.off += r.swayDir * gl * t, Ms(e, r, n, r.ring + Math.sin(r.clock * .7) * .4, 3, 3), Wl(e, r.tx, r.tz, e.def.speed, t, n);
		} else Ms(e, r, n, r.ring, 3, 4), Wl(e, r.tx, r.tz, i.d > 9 ? hl : e.def.speed, t, n);
		e.face(a.x, a.z), e.anim("walk");
	},
	attack(e, t, n) {
		e.ai.move === "dive" ? Kl(e, t, n) : Gl(e, t, n);
	},
	cancel(e) {
		e.lift = 0;
	},
	die(e, t) {
		let n = e.position;
		t.burst("swarmSpark", n.x, n.y + e.hover, n.z, 8);
	},
	glow(e, t) {
		let n = e.ai;
		t[0] = zl[0], t[1] = zl[1], t[2] = zl[2], t[3] = e.alive ? n ? n.glow : Bl : 0;
	}
};
function Ul(e, t, n) {
	t.clock += n;
	let r = ul + dl * Math.sin(4 * t.clock);
	e.hover += (r - e.hover) * Math.min(1, n * 6);
}
function Wl(e, t, n, r, i, a) {
	let o = e.position, s = t - o.x, c = n - o.z, l = Math.hypot(s, c);
	if (l < 1e-4) return;
	let u = Math.min(l, r * i);
	e.move(s / l * u, c / l * u, a);
}
function Gl(e, t, n) {
	let r = e.ai, i = n.player, a = e.position;
	if (e.state === "windup") {
		Ul(e, r, t), e.entered && n.sfx("cackle", a.x, a.z, {
			volume: .6,
			pitch: 1 + e.index % 4 * .06
		}), e.pose("windup");
		let o = Math.min(1, e.t / V(yl));
		r.glow = Bl + 1.7 * o, e.t < V(bl) - cl && (r.px = i.position.x + i.velocity.x * xl, r.pz = i.position.z + i.velocity.z * xl, e.face(r.px, r.pz), r.lx = e.facing.x, r.lz = e.facing.z, r.len = Math.min(Cl, Math.hypot(r.px - a.x, r.pz - a.z) + 2));
		for (let t = 0; t < r.n; t++) {
			let i = r.n === 1 ? 0 : t ? El : -El, s = Math.cos(i), c = Math.sin(i), l = e.markerSpec("lane", a.x, a.z);
			l.dirX = r.lx * s - r.lz * c, l.dirZ = r.lx * c + r.lz * s, l.len = r.len, l.width = wl, l.progress = o, l.flash = e.lockFlash(e.t - V(bl)), e.mark(t, n, l);
		}
		if (e.after(yl)) {
			let t = a.y + e.hover + .1, i = Math.max(.5, r.len - 2), o = lr(t, n.groundAt(r.px, r.pz) + .9, Sl, i);
			for (let i = 0; i < r.n; i++) {
				let a = r.n === 1 ? 0 : i ? El : -El, s = Math.cos(a), c = Math.sin(a);
				e.markProgress(i, n, 1);
				let l = e.projSpec();
				l.kind = Dl, l.y = t, l.dirX = r.lx * s - r.lz * c, l.dirZ = r.lx * c + r.lz * s, l.vy = o, l.speed = Sl, l.range = r.len, l.radius = .25, l.mv = .85, l.kb = .3, n.projectile(e, l), e.markToFade(i, n, r.len / Sl);
			}
			n.sfx("bolt", a.x, a.z, {
				volume: .5,
				pitch: 1.3
			}), r.casts++, r.glow = Vl, e.setState("recover");
		}
		return;
	}
	Ul(e, r, t), e.pose("attack"), e.after(Tl) && (e.dropToken(n), r.cdO = V(e.rng.int(150, 260)) * (zs(e, n) ? .7 : 1), e.setState("engage"));
}
function Kl(e, t, n) {
	let r = e.ai, i = e.position;
	if (e.state === "windup") {
		e.entered && n.sfx("screech", i.x, i.z, {
			volume: .75,
			pitch: 1.2 + e.index % 3 * .05
		}), e.pose("flare");
		let a = Math.min(1, e.t / V(Al));
		r.glow = Bl + 1.9000000000000001 * a, e.hover += (Fl - e.hover) * Math.min(1, t * 5), e.face(r.px, r.pz);
		let o = e.markerSpec("circle", r.px, r.pz);
		if (o.r = Ml, o.progress = Il * a, e.mark(0, n, o), e.after(Al)) {
			let t = r.px - i.x, n = r.pz - i.z, a = Math.hypot(t, n);
			r.dx = a > 1e-4 ? t / a : e.facing.x, r.dz = a > 1e-4 ? n / a : e.facing.z, r.len = a, r.diveF = Math.max(8, Math.min(30, Math.ceil(a / Nl * 60))), r.h0 = e.hover, r.tag = e.newTag(), r.phase = "dive", e.setState("active");
		}
		return;
	}
	if (e.state === "active") {
		let i = V(r.diveF);
		if (r.phase === "dive") {
			e.pose("dive"), r.glow = Vl;
			let a = Math.min(t, i - e.t);
			if (a > 0) {
				let t = r.len / i;
				e.move(r.dx * t * a, r.dz * t * a, n);
			}
			let o = Math.min(1, (e.t + t) / i);
			if (e.hover = r.h0 + (Pl - r.h0) * o * o, e.markProgress(0, n, Il + .30000000000000004 * o), e.after(r.diveF)) {
				let t = n.groundAt(r.px, r.pz), i = e.hitSpec();
				i.shape = "circle", i.x = r.px, i.z = r.pz, i.y = t, i.r = Ml, i.mv = 1.2, i.kb = 1.2, i.fromX = r.px, i.fromZ = r.pz, i.tag = r.tag, n.hitbox(e, i), n.burst("swarmFlare", r.px, t + .3, r.pz, 14), n.burst("swarmAsh", r.px, t + .2, r.pz, 5), n.fx("swarmBurst", r.px, t, r.pz), n.sfx("boltHit", r.px, r.pz, {
					volume: .9,
					pitch: .8
				}), n.shake(.05, .12), e.unmark(0, n), r.phase = "low", e.setState("recover");
			}
		}
		return;
	}
	if (e.t < V(Ll) - cl) {
		e.pose("move2"), e.hover = Pl + .1 * Math.sin(Math.PI * e.t / V(Ll));
		return;
	}
	let a = Math.min(1, (e.t + t - V(Ll)) / V(Rl));
	e.hover = Pl + 1.3 * (1 - (1 - a) * (1 - a)), Ms(e, r, n, r.ring, 3, 4), Wl(e, r.tx, r.tz, e.def.speed * .8, t, n), e.face(n.player.position.x, n.player.position.z), e.anim("walk"), e.after(50) && (e.dropToken(n), r.cdD = V(e.rng.int(360, 540)), r.cdO = Math.max(r.cdO, V(60)), r.phase = "windup", e.setState("engage"));
}
//#endregion
//#region src/game/combat/SkyDragon.js
var ql = Math.PI * 2, H = Object.freeze({
	speed: 9,
	turn: Math.PI / 180 * 50,
	reach: 5,
	comeFade: 2,
	diveSpeed: 22,
	diveTurn: 4.8,
	diveNear: 7,
	diveFade: 2.6,
	diveLate: 1.2
}), Jl = Object.freeze({
	speed: 12,
	ahead: 5,
	turn: 2.6,
	far: 30,
	from: 20,
	sweepMax: 8,
	hold: 2.5,
	fade: 5,
	pace: 26
}), Yl = Object.freeze({
	behind: 4,
	ahead: 18,
	near: 7,
	side: 12,
	clear: 5.5,
	houseShare: .7,
	tries: 8
}), Xl = 1.4, Zl = Object.freeze({
	time: 1.3,
	height: 15,
	stagger: .22,
	head: 5
}), Ql = 12, $l = 48, eu = 112, tu = 96, nu = 8, ru = eu / nu, iu = tu / nu, au = 29, ou = 25, su = "\nvarying vec2 vUv;\n\nvoid main() {\n	vUv = uv;\n	// positions are world positions (the CPU drapes the grid every frame): no model matrix\n	gl_Position = projectionMatrix * viewMatrix * vec4( position, 1.0 );\n}\n", cu = "\nuniform sampler2D uMask;\nuniform float uFrame;\nuniform float uAlpha;\nuniform vec3 uShade;\n\nvarying vec2 vUv;\n\nvoid main() {\n	// the wing-beat: two neighbouring frames cross-faded\n	float f0 = floor( uFrame );\n	float t = uFrame - f0;\n	float f1 = mod( f0 + 1.0, 4.0 );\n	float a0 = texture2D( uMask, vec2( ( vUv.x + f0 ) * 0.25, vUv.y ) ).a;\n	float a1 = texture2D( uMask, vec2( ( vUv.x + f1 ) * 0.25, vUv.y ) ).a;\n	float a = mix( a0, a1, t ) * uAlpha;\n	if ( a < 0.004 ) discard;\n	float k = 1.0 - pow( 1.0 - min( a, 0.99 ), 4.0 );\n	gl_FragColor = vec4( uShade * k, 1.0 );\n}\n", lu = null, uu = 0;
function du() {
	let t = tu, n = new Float32Array(448 * t), i = (e, t, r) => {
		let i = Math.round(e * eu + eu / 2 + t), a = Math.round(tu / 2 - r);
		i < e * eu + 2 || i >= (e + 1) * eu - 2 || a < 2 || a >= 94 || (n[a * 448 + i] = 1);
	}, a = (e, t, n, r, a) => {
		for (let o = -a; o <= a; o += .5) for (let s = -r; s <= r; s += .5) (s / r) ** 2 + (o / a) ** 2 <= 1 && i(e, t + s, n + o);
	}, o = (e, t) => {
		let n = Infinity, r = -Infinity, a = Infinity, o = -Infinity;
		for (let [e, i] of t) n = Math.min(n, e), r = Math.max(r, e), a = Math.min(a, i), o = Math.max(o, i);
		for (let s = a; s <= o; s += .5) for (let a = n; a <= r; a += .5) {
			let n = !1;
			for (let e = 0, r = t.length - 1; e < t.length; r = e++) {
				let [i, o] = t[e], [c, l] = t[r];
				o > s != l > s && a < (c - i) * (s - o) / (l - o) + i && (n = !n);
			}
			n && i(e, a, s);
		}
	}, s = (e, t, n, r, i, o, s) => {
		let c = Math.ceil(Math.hypot(r - t, i - n) * 2);
		for (let l = 0; l <= c; l++) {
			let u = l / c, d = o + (s - o) * u;
			a(e, t + (r - t) * u, n + (i - n) * u, d, d);
		}
	}, l = [
		1,
		.8,
		.56,
		.86
	], u = [
		0,
		.08,
		.14,
		-.14
	], f = [
		0,
		3,
		5,
		2
	];
	for (let e = 0; e < 4; e++) {
		a(e, 0, 2, 7, 17), s(e, 0, 14, 0, 30, 5, 3.4), a(e, 0, 35, 4.2, 6.2), s(e, -2, 33, -6, 27, 1.4, .6), s(e, 2, 33, 6, 27, 1.4, .6);
		let t = f[e];
		s(e, 0, -14, t * .4, -28, 5, 3.4), s(e, t * .4, -28, t, -40, 3.4, 1.6), o(e, [
			[t - 4, -40],
			[t, -46.5],
			[t + 4, -40],
			[t, -42]
		]);
		for (let t of [-1, 1]) {
			let n = l[e], r = Math.cos(u[e]), i = Math.sin(u[e]), a = (e, a) => [e * r * t * n, a + e * i * n], s = [
				a(5, 12),
				a(22, 19),
				a(36, 17),
				a(51, 6),
				a(44, 2),
				a(46, -6),
				a(37, -6),
				a(36, -14),
				a(26, -10),
				a(20, -17),
				a(13, -10),
				a(6, -12)
			];
			o(e, s);
		}
	}
	for (let e = 0; e < 2; e++) {
		let e = new Float32Array(n.length);
		for (let t = 1; t < 95; t++) for (let r = 1; r < 447; r++) {
			let i = 0;
			for (let e = -1; e <= 1; e++) for (let a = -1; a <= 1; a++) i += n[(t + e) * 448 + r + a];
			e[t * 448 + r] = i / 9;
		}
		n.set(e);
	}
	let p = new Uint8Array(448 * t * 4);
	for (let e = 0; e < 448 * t; e++) p[e * 4] = 255, p[e * 4 + 1] = 255, p[e * 4 + 2] = 255, p[e * 4 + 3] = Math.round(_(n[e], 0, 1) * 255);
	let m = new r(p, 448, t, e);
	return m.name = "dragon:shadow", m.magFilter = d, m.minFilter = d, m.generateMipmaps = !1, m.wrapS = c, m.wrapT = c, m.colorSpace = "", m.flipY = !1, m.needsUpdate = !0, m;
}
var fu = class {
	constructor(e) {
		uu++, lu ??= du();
		let t = new u();
		this._pos = /* @__PURE__ */ new Float32Array(2175);
		let n = /* @__PURE__ */ new Float32Array(1450);
		for (let e = 0; e < ou; e++) for (let t = 0; t < au; t++) {
			let r = e * au + t;
			n[r * 2] = t / 28, n[r * 2 + 1] = e / 24;
		}
		let r = [];
		for (let e = 0; e + 1 < ou; e++) for (let t = 0; t + 1 < au; t++) {
			let n = e * au + t;
			r.push(n, n + au, n + 1, n + 1, n + au, n + au + 1);
		}
		let a = new o(this._pos, 3);
		a.setUsage(l), t.setAttribute("position", a), t.setAttribute("uv", new o(n, 2)), t.setIndex(r), this.geometry = t, this.material = new i({
			name: "DragonShadow",
			uniforms: {
				uMask: { value: lu },
				uFrame: { value: 0 },
				uAlpha: { value: 0 },
				uShade: { value: new s(1, 1, .93) }
			},
			vertexShader: su,
			fragmentShader: cu,
			transparent: !0,
			depthWrite: !1,
			blending: 5,
			blendEquation: 100,
			blendSrc: 200,
			blendDst: 203,
			blendSrcAlpha: 200,
			blendDstAlpha: 201,
			polygonOffset: !0,
			polygonOffsetFactor: -1,
			polygonOffsetUnits: -2,
			fog: !1
		}), this.material.customProgramCacheKey = () => "luminati-dragonshadow-v1", this.mesh = new p(t, this.material), this.mesh.name = "DragonShadow", this.mesh.frustumCulled = !1, this.mesh.matrixAutoUpdate = !1, this.mesh.renderOrder = h.DECALS, this.mesh.castShadow = !1, this.mesh.receiveShadow = !1, this.mesh.visible = !1, e.add(this.mesh);
	}
	get texture() {
		return lu;
	}
	set(e, t, n, r, i, a, o) {
		let s = i > .004;
		if (this.mesh.visible = s, !s) return;
		let c = this.material.uniforms;
		c.uFrame.value = (r % 4 + 4) % 4, c.uAlpha.value = i;
		let l = Math.cos(n), u = Math.sin(n), d = this._pos;
		for (let n = 0; n < ou; n++) {
			let r = (.5 - n / 24) * iu * a;
			for (let i = 0; i < au; i++) {
				let s = (i / 28 - .5) * ru * a, c = e + l * r - u * s, f = t + u * r + l * s, p = (n * au + i) * 3;
				d[p] = c, d[p + 1] = o(c, f) + .08, d[p + 2] = f;
			}
		}
		let f = this.geometry.getAttribute("position");
		f.needsUpdate = !0;
	}
	hide() {
		this.mesh.visible = !1;
	}
	dispose() {
		this.mesh.parent?.remove(this.mesh), this.geometry.dispose(), this.material.dispose(), uu = Math.max(0, uu - 1), uu === 0 && lu && (lu.dispose(), lu = null);
	}
}, pu = {
	N: [0, -1],
	S: [0, 1],
	E: [1, 0],
	W: [-1, 0]
}, mu = class {
	constructor({ sys: e, obj: t, seed: n }) {
		this.sys = e, this.obj = t, this.id = typeof t.id == "string" ? t.id : "", this.rng = new y(n >>> 0), this.present = !0, this.volleys = 0;
		let r = e.tileMap, i = r?.width ?? 64, a = r?.depth ?? 64, o = (e, t, n, r) => typeof e == "number" && Number.isFinite(e) ? _(e, n, r) : t, s = o(t.minX, 0, 0, i), c = o(t.maxX, i, 0, i), l = o(t.minZ, 0, 0, a), u = o(t.maxZ, a, 0, a);
		this.rect = {
			minX: Math.min(s, c),
			maxX: Math.max(s, c),
			minZ: Math.min(l, u),
			maxZ: Math.max(l, u)
		};
		let d = Array.isArray(t.interval) ? t.interval : [], f = o(d[0], 5, 1, 60), p = o(d[1], 9, 1, 60);
		this.interval = [Math.min(f, p), Math.max(f, p)], this.volley = Math.round(o(t.volley, 2, 0, 10)), this.radius = o(t.radius, 2.4, .5, 6), this.power = o(t.power, 1.6, 0, 6), this.leave = Object.hasOwn(pu, t.leave) ? t.leave : "N", this.ambient = t.ambient !== !1, this.x = (this.rect.minX + this.rect.maxX) / 2, this.z = (this.rect.minZ + this.rect.maxZ) / 2, this.heading = this.rng.next() * ql, this.speed = H.speed, this.alpha = 1, this.leaving = !1, this.goal = null, this._diveT = 0, this._tx = this.x, this._tz = this.z, this._targetT = 0, this._beat = 0, this._glide = 0, this._lastFrame = 0, this._wingCd = 0, this._roarT = 14 + this.rng.next() * 14, this._volleyT = this._nextInterval() * .6, this._balls = [];
		for (let e = 0; e < Ql; e++) this._balls.push({
			on: !1,
			t: 0,
			sx: 0,
			sy: 0,
			sz: 0,
			tx: 0,
			ty: 0,
			tz: 0,
			harmless: !1,
			armed: !1,
			m: {
				shape: "circle",
				x: 0,
				y: .03,
				z: 0,
				r: this.radius,
				progress: 0,
				style: "enemy",
				alpha: 1,
				flash: 0
			},
			marker: -1,
			quad: -1,
			flash: 0,
			started: !1
		});
		this._fx = [];
		for (let e = 0; e < $l; e++) this._fx.push({
			on: !1,
			h: -1,
			kind: "blast",
			t: 0,
			dur: 1,
			x: 0,
			y: 0,
			z: 0,
			scale: 1,
			dirX: 0,
			dirZ: 1
		});
		this._q = {
			x: 0,
			y: 0,
			z: 0,
			frame: "",
			index: 0,
			scale: 1,
			rot: 0,
			mode: "billboard",
			dirX: 0,
			dirZ: 1,
			r: 1,
			g: 1,
			b: 1,
			a: 1
		}, this._leg = "away", this._legT = 0, this._lookX = NaN, this._lookZ = NaN, this._lookV = 0, this._houses = [];
		for (let t of e.level?.objects ?? []) t.type === "house" && Number.isFinite(t.x) && Number.isFinite(t.z) && this._houses.push({
			x: t.x,
			z: t.z
		});
		this.shadow = new fu(e.scene), this._pickTarget();
	}
	update(e, t) {
		if (!(e > 0)) return;
		e = Math.min(e, .1);
		let n = this.present || this.leaving;
		if (t && !this.ambient) {
			this._updateBalls(e, !0), this._updateFx(e), this._drawShadow(this.present ? this.alpha : 0);
			return;
		}
		n && this._fly(e), this.present && !this.leaving && this.volley > 0 && (this._volleyT -= e, this._volleyT <= 0 && (this._volleyT = this._nextInterval(), this._throwVolley(t))), this._updateBalls(e, t), this._updateFx(e), this._sounds(e), this._drawShadow(this.alpha);
	}
	applyPresence(e, t = !1) {
		let n = !!e;
		if (t) {
			this.present = n, this.leaving = !1, this.goal = null, this.alpha = +!!n, this.speed = H.speed, n || this._clearAll(), this._drawShadow(this.alpha);
			return;
		}
		if (n === this.present && !(n && this.leaving)) return;
		if (this.present = n, !n) {
			if (this.leaving = !0, this.goal = this._landing(), this.goal) {
				this._diveT = 0, this._tx = this.goal.x, this._tz = this.goal.z;
				return;
			}
			this._leg = "sweep", this._legT = 0, this._lookX = NaN, this._lookV = 0, this.alpha = Math.max(this.alpha, .6);
			let e = this._look(), [t, n] = pu[this.leave];
			if (e && (Math.hypot(e.x - this.x, e.z - this.z) > Jl.far || (this.x - e.x) * t + (this.z - e.z) * n > -Jl.ahead)) {
				let r = (this.rng.next() - .5) * 6;
				this.x = e.x - t * Jl.from - n * r, this.z = e.z - n * Jl.from + t * r, this.heading = Math.atan2(n, t), this.alpha = 1;
			}
			this._aim();
			return;
		}
		this.leaving = !1, this.goal = null;
		let [r, i] = pu[this.leave], a = this.rect;
		this.x = _((a.minX + a.maxX) / 2 + r * (a.maxX - a.minX) * .5, a.minX, a.maxX), this.z = _((a.minZ + a.maxZ) / 2 + i * (a.maxZ - a.minZ) * .5, a.minZ, a.maxZ), this.heading = Math.atan2(-i, -r), this.speed = H.speed, this.alpha = 0, this._pickTarget();
	}
	warmup(e) {
		try {
			this.sys.engine.renderer.initTexture(this.shadow.texture);
		} catch {}
	}
	state() {
		let e = 0;
		for (let t of this._balls) t.on && e++;
		return {
			id: this.id,
			present: this.present,
			x: +this.x.toFixed(3),
			z: +this.z.toFixed(3),
			volleys: this.volleys,
			heading: +this.heading.toFixed(3),
			alpha: +this.alpha.toFixed(3),
			leaving: this.leaving,
			diving: this.goal !== null,
			live: e
		};
	}
	fireAt(e, t, n = !1) {
		return this._launch(e, t, n, 0);
	}
	dispose() {
		this._clearAll(), this.shadow.dispose();
	}
	_landing() {
		let e = this.sys, t = null, n = Infinity;
		for (let r of e._bosses) {
			if (!r.alive || e._hidden.has(r) || !e._introPending.includes(r)) continue;
			let i = Math.hypot(r.position.x - this.x, r.position.z - this.z);
			i < n && (n = i, t = r);
		}
		return t ? {
			x: t.position.x,
			z: t.position.z
		} : null;
	}
	_look() {
		let e = this.sys;
		return e.rig?.focusPoint ?? e.player?.position ?? null;
	}
	_aim() {
		let [e, t] = pu[this.leave], n = this._look();
		if (this._leg === "sweep" && n) {
			this._tx = n.x + e * Jl.ahead, this._tz = n.z + t * Jl.ahead;
			return;
		}
		this._tx = this.x + e * 400, this._tz = this.z + t * 400;
	}
	_fly(e) {
		let t = this.leaving && this.goal !== null, n = this.leaving && !t, r = Jl.speed;
		if (n) {
			this._legT += e;
			let t = this._look();
			if (t) {
				let n = Number.isFinite(this._lookX) ? Math.hypot(t.x - this._lookX, t.z - this._lookZ) / e : 0;
				n < 60 && (this._lookV += (n - this._lookV) * Math.min(1, e * 6)), this._lookX = t.x, this._lookZ = t.z;
			}
			if (this._leg === "sweep") {
				let [e, n] = pu[this.leave];
				!t || (this.x - t.x) * e + (this.z - t.z) * n >= Jl.ahead - 1 || this._legT >= Jl.sweepMax ? (this._leg = "away", this._legT = 0) : r = _(this._lookV * 1.15, Jl.speed, Jl.pace);
			}
			this._aim();
		}
		let i = t ? H.diveSpeed : n ? r : H.speed;
		this.speed += (i - this.speed) * Math.min(1, e * 2);
		let a = Math.atan2(this._tz - this.z, this._tx - this.x) - this.heading;
		for (; a > Math.PI;) a -= ql;
		for (; a < -Math.PI;) a += ql;
		let o = H.turn * (t ? H.diveTurn : n ? Jl.turn : 1) * e;
		if (this.heading += _(a, -o, o), this.x += Math.cos(this.heading) * this.speed * e, this.z += Math.sin(this.heading) * this.speed * e, this._glide > 0) this._glide -= e;
		else {
			let t = Math.floor(this._beat);
			this._beat += e * Xl, Math.floor(this._beat) !== t && this.rng.next() < .2 && (this._glide = 1.5 + this.rng.next() * 1.5);
		}
		if (this.leaving) {
			if (t) {
				this._diveT += e;
				let t = Math.min(1, Math.hypot(this._tx - this.x, this._tz - this.z) / H.diveNear);
				this._diveT > H.diveFade && (t = Math.min(t, 1 - (this._diveT - H.diveFade) / H.diveLate)), this.alpha = Math.min(this.alpha, t), this.alpha < .03 && (this.alpha = 0);
			} else this.alpha = this._leg === "sweep" || this._legT < Jl.hold ? Math.min(1, this.alpha + e / H.comeFade) : Math.max(0, this.alpha - e / Jl.fade);
			this.alpha <= 0 && (this.alpha = 0, this.leaving = !1, this.goal = null);
			return;
		}
		this.alpha < 1 && (this.alpha = Math.min(1, this.alpha + e / H.comeFade)), this._targetT -= e, (Math.hypot(this._tx - this.x, this._tz - this.z) < H.reach || this._targetT <= 0) && this._pickTarget();
	}
	_pickTarget() {
		let e = this.rect, t = this.sys.player?.position;
		if (this._targetT = 9, t && this.rng.next() < .34) {
			let n = t.x - this.x, r = t.z - this.z, i = Math.hypot(n, r) || 1;
			this._tx = _(t.x + n / i * 9, e.minX - 6, e.maxX + 6), this._tz = _(t.z + r / i * 9, e.minZ - 6, e.maxZ + 6);
			return;
		}
		let n = Math.min(4, (e.maxX - e.minX) / 4, (e.maxZ - e.minZ) / 4);
		this._tx = e.minX + n + this.rng.next() * Math.max(0, e.maxX - e.minX - n * 2), this._tz = e.minZ + n + this.rng.next() * Math.max(0, e.maxZ - e.minZ - n * 2);
	}
	_nextInterval() {
		let [e, t] = this.interval;
		return e + this.rng.next() * (t - e);
	}
	_frame() {
		return this._glide > 0 ? 0 : this._beat * 4 % 4;
	}
	_drawShadow(e) {
		this.shadow.set(this.x, this.z, this.heading, this._frame(), .45 * e, 1, (e, t) => this.sys.groundAt(e, t));
	}
	_sounds(e) {
		if (!this.present || this.alpha < .3) return;
		let t = this.sys, n = t.player?.position, r = Math.floor(this._frame());
		this._wingCd -= e, n && r === 3 && this._lastFrame !== 3 && this._wingCd <= 0 && Math.hypot(n.x - this.x, n.z - this.z) < 11 && (this._wingCd = .6, t.sfxAt("wingbeat", this.x, this.z, { volume: .9 })), this._lastFrame = r, this._roarT -= e, this._roarT <= 0 && (this._roarT = 14 + this.rng.next() * 14, t.audio?.playSfx("roarFar", { volume: .55 }));
	}
	_throwVolley(e) {
		let t = this.sys, n = t.player?.position;
		if (!n) return;
		let r = this.rect;
		if (n.x < r.minX - 6 || n.x > r.maxX + 6 || n.z < r.minZ - 6 || n.z > r.maxZ + 6) return;
		let i = !e && !!t.engaged;
		for (let e = 0; e < this.volley; e++) {
			let r = -e * Zl.stagger;
			if (!i) {
				let e = this._spectacleTarget();
				e && this._launch(e.x, e.z, !0, r);
				continue;
			}
			let a = n.x, o = n.z, s = this.rng.next(), c = t.allies ?? [], l = s > .85 ? this._houseNear(n.x, n.z, 24) : null;
			if (s < .25 && c.length) {
				let e = c[Math.floor(this.rng.next() * c.length)];
				a = e.position.x, o = e.position.z;
			} else if (l) a = l.x + (this.rng.next() - .5) * 3, o = l.z + (this.rng.next() - .5) * 3;
			else {
				let e = this.rng.next() * ql, t = Math.sqrt(this.rng.next()) * 2.5;
				a = n.x + Math.cos(e) * t, o = n.z + Math.sin(e) * t;
			}
			this._launch(a, o, !1, r);
		}
	}
	_spectacleTarget() {
		let e = this.sys, t = e.rig?.focusPoint ?? e.player?.position;
		if (!t) return null;
		let n = b.uCameraYaw.value, r = -Math.sin(n), i = -Math.cos(n), a = Yl, o = (e, n) => {
			let o = e - t.x, s = n - t.z, c = o * r + s * i, l = Math.abs(o * -i + s * r);
			return c >= -a.behind && c <= a.ahead && l <= a.side && this._clearOfParty(e, n);
		}, s = 0;
		for (let e of this._houses) o(e.x, e.z) && s++;
		if (s && this.rng.next() < a.houseShare) {
			let e = Math.floor(this.rng.next() * s);
			for (let t of this._houses) {
				if (!o(t.x, t.z) || e-- !== 0) continue;
				let n = t.x + (this.rng.next() - .5) * 3, r = t.z + (this.rng.next() - .5) * 3;
				if (this._clearOfParty(n, r)) return {
					x: n,
					z: r
				};
			}
		}
		for (let n = 0; n < a.tries; n++) {
			let n = a.near + this.rng.next() * (a.ahead - a.near), s = (this.rng.next() - .5) * 2 * a.side, c = t.x + r * n - i * s, l = t.z + i * n + r * s;
			if (o(c, l) && e.standable?.(c, l) !== !1) return {
				x: c,
				z: l
			};
		}
		return null;
	}
	_clearOfParty(e, t) {
		let n = this.sys, r = Yl.clear, i = n.player?.position;
		if (i && Math.hypot(i.x - e, i.z - t) < r) return !1;
		for (let i of n.allies ?? []) if (!i.gone && i.present && Math.hypot(i.position.x - e, i.position.z - t) < r) return !1;
		return !0;
	}
	_houseNear(e, t, n) {
		let r = 0;
		for (let i of this._houses) Math.hypot(i.x - e, i.z - t) <= n && r++;
		if (!r) return null;
		let i = Math.floor(this.rng.next() * r);
		for (let r of this._houses) if (!(Math.hypot(r.x - e, r.z - t) > n) && i-- === 0) return r;
		return null;
	}
	_launch(e, t, n, r) {
		let i = this._balls.find((e) => !e.on);
		if (!i) return !1;
		let a = this.sys, o = a.tileMap;
		return i.on = !0, i.t = r, i.tx = _(e, .5, (o?.width ?? 1e4) - .5), i.tz = _(t, .5, (o?.depth ?? 1e4) - .5), i.ty = a.groundAt(i.tx, i.tz), i.sx = this.x + Math.cos(this.heading) * Zl.head, i.sz = this.z + Math.sin(this.heading) * Zl.head, i.sy = i.ty + Zl.height, i.harmless = n, i.armed = !n, i.marker = -1, i.quad = -1, i.flash = 0, i.started = !1, this.volleys++, !0;
	}
	_updateBalls(e, t = !1) {
		for (let n of this._balls) {
			if (!n.on) continue;
			if (n.flash > 0) {
				n.flash -= e, n.flash <= 0 && this._endBall(n);
				continue;
			}
			if (n.t += e, n.t < 0) continue;
			n.started ? t && n.armed && (n.armed = !1, n.marker >= 0 && this.sys.freeMarker(n.marker), n.marker = -1) : this._startBall(n, t);
			let r = Math.min(1, n.t / Zl.time);
			if (r >= 1) {
				this._impact(n);
				continue;
			}
			let i = r ** 1.5, a = n.sx + (n.tx - n.sx) * i, o = n.sy + (n.ty - n.sy) * i, s = n.sz + (n.tz - n.sz) * i;
			if (n.marker >= 0 && (n.m.progress = r, this.sys.setMarker(n.marker, n.m)), n.quad >= 0) {
				let e = this._q;
				e.x = a, e.y = o, e.z = s, e.frame = "dragonFireball", e.index = Math.floor(n.t * 14), e.scale = 1.6, e.mode = "billboard";
				let t = b.uCameraYaw.value, r = n.tx - n.sx, i = n.tz - n.sz, c = r * Math.cos(t) - i * Math.sin(t);
				e.rot = Math.atan2(n.ty - n.sy, c), e.r = 1.8, e.g = .8, e.b = .26, e.a = 1, this.sys.quads.set(n.quad, e);
			}
			let c = this.sys;
			c.burst("dragonTrail", a, o, s, 2), Math.floor(n.t * 20) % 3 == 0 && c.burst("dragonSmoke", a, o, s, 1);
		}
	}
	_startBall(e, t) {
		let n = this.sys;
		if (e.started = !0, e.quad = n.quads.alloc(), t && (e.armed = !1), e.armed && e.marker < 0) {
			let t = e.m;
			t.shape = "circle", t.x = e.tx, t.z = e.tz, t.r = this.radius, t.progress = 0, t.style = "enemy", t.flash = 0, e.marker = n.marker(t);
		}
		n.sfxAt("fireballFall", e.tx, e.tz, { volume: .8 });
	}
	_impact(e) {
		let t = this.sys;
		e.quad >= 0 && t.quads.free(e.quad), e.quad = -1;
		let { tx: n, ty: r, tz: i } = e;
		this._addFx("blast", n, r + 1.1, i, 1.25 * (this.radius / 2.4), .375), this._addFx("ring", n, r + .06, i, this.radius / 1.6, .3), this._addFx("scorch", n, r + .035, i, this.radius / 1.15, 9), this._addFx("embers", n, r + .045, i, this.radius / 1.15, 4), t.burst("dragonFlare", n, r + .9, i, 4), t.burst("dragonFireBurst", n, r + .4, i, 18), t.burst("dragonSmoke", n, r + .6, i, 8), t.burst("dragonDebris", n, r + .2, i, 10), t.burst("dragonEmbers", n, r + .3, i, 8), t.sfxAt("explosion", n, i, { volume: 1 });
		let a = t.player?.position;
		if (a) {
			let e = .55 * Math.max(0, 1 - Math.hypot(a.x - n, a.z - i) / 16);
			e > .03 && t.shake(e, .45);
		}
		if (e.armed) {
			let a = t.tags.next();
			if (t.strike({
				shape: "circle",
				x: n,
				z: i,
				y: r,
				r: this.radius * .6,
				atk: 26,
				mv: this.power,
				kb: 2.5,
				knockdown: !0,
				tag: a
			}), t.strike({
				shape: "circle",
				x: n,
				z: i,
				y: r,
				r: this.radius,
				atk: 26,
				mv: this.power * .7,
				kb: 1.5,
				tag: a
			}), e.marker >= 0) {
				e.m.progress = 1, t.setMarker(e.marker, e.m), e.flash = 5 / 60;
				return;
			}
		}
		this._endBall(e);
	}
	_endBall(e) {
		e.marker >= 0 && this.sys.freeMarker(e.marker), e.quad >= 0 && this.sys.quads.free(e.quad), e.marker = -1, e.quad = -1, e.on = !1, e.flash = 0;
	}
	_addFx(e, t, n, r, i, a) {
		let o = this._fx.find((e) => !e.on);
		if (!o) return;
		let s = this.sys.quads.alloc();
		if (s < 0) return;
		let c = this.rng.next() * ql;
		Object.assign(o, {
			on: !0,
			h: s,
			kind: e,
			t: 0,
			dur: a,
			x: t,
			y: n,
			z: r,
			scale: i,
			dirX: Math.cos(c),
			dirZ: Math.sin(c)
		}), this._writeFx(o);
	}
	_updateFx(e) {
		for (let t of this._fx) if (t.on) {
			if (t.t += e, t.t >= t.dur) {
				this.sys.quads.free(t.h), t.on = !1, t.h = -1;
				continue;
			}
			this._writeFx(t);
		}
	}
	_writeFx(e) {
		let t = this._q, n = e.t / e.dur;
		if (t.x = e.x, t.y = e.y, t.z = e.z, t.scale = e.scale, t.rot = 0, t.dirX = e.dirX, t.dirZ = e.dirZ, t.a = 1, e.kind === "blast") t.frame = "dragonBlast", t.mode = "billboard", t.index = Math.min(5, Math.floor(n * 6)), t.r = 1.5, t.g = .72, t.b = .28;
		else if (e.kind === "ring") t.frame = "dragonRing", t.mode = "flat", t.index = Math.min(3, Math.floor(n * 4)), t.r = 1.9, t.g = 1.1, t.b = .55, t.a = 1.4 - n;
		else if (e.kind === "scorch") t.frame = "dragonScorch", t.mode = "flat", t.index = e.h & 1, t.r = .1, t.g = .08, t.b = .075, t.a = Math.min(1, (e.dur - e.t) / 4);
		else {
			let r = 1 - n;
			t.frame = "dragonEmbers", t.mode = "flat", t.index = Math.floor(e.t * 3) & 1, t.r = 2.4 * r, t.g = .85 * r * r, t.b = .25 * r * r, t.a = Math.min(1, r * 2.2);
		}
		this.sys.quads.set(e.h, t);
	}
	_clearAll() {
		for (let e of this._balls) e.on && this._endBall(e);
		for (let e of this._fx) e.on && (this.sys.quads.free(e.h), e.on = !1, e.h = -1);
	}
}, U = (e) => e / 60, hu = 1e-6, gu = Math.PI / 180, _u = Math.PI * 2, vu = Object.freeze({
	total: 270,
	descend: 140,
	flare: 110,
	touch: 150,
	crouch: 175,
	rise: 195,
	roar: 215,
	high: 16
}), yu = 120, bu = 150, xu = 180, Su = 40, Cu = [
	[45, 75],
	[36, 60],
	[24, 45]
], wu = [
	90,
	110,
	140
], Tu = {
	windup: 32,
	active: 8,
	recover: 34,
	r: 5.6,
	half: 55,
	mv: 1.4,
	kb: 2.6,
	range: 5.8
}, Eu = {
	windup: 26,
	active: 6,
	recover: 40,
	r: 1.9,
	ahead: 4.6,
	mv: 1.9,
	kb: 1.6,
	near: 3,
	far: 7
}, Du = {
	windup: 40,
	active: 10,
	recover: 40,
	r: 6.6,
	half: 115,
	mv: 1.25,
	kb: 3.6,
	behind: 36
}, W = {
	windup: 54,
	active: 96,
	recover: 40,
	r: 9.5,
	cone: 16,
	sweep: 35,
	every: 10,
	mv: .5,
	kb: .8,
	range: 11,
	patchEvery: 22,
	patches: 4,
	patchR: 1.4,
	patchDur: 300,
	patchFlat: 5,
	patchTick: 30
}, Ou = {
	windup: 36,
	active: 18,
	recover: 30,
	r: 10,
	half: 38,
	mv: .3,
	kb: 5.5,
	range: 8
}, G = {
	windup: 42,
	active: 6,
	recover: 44,
	r: 3.4,
	mv: 1.6,
	kb: 2.8,
	range: 4.2,
	every: 16,
	speed: 7.5,
	rMax: 11,
	width: .8,
	ringMv: 1,
	ringKb: 1.8
}, K = {
	takeoff: 50,
	leap: 24,
	climb: 60,
	high: 18,
	circle: [6, 7],
	salvo: [.9, .65],
	balls: [6, 10],
	ballR: 1.7,
	fill: 66,
	ballMv: 1.3,
	ballKb: 1.5,
	lane: 72,
	lock: 18,
	width: 3.2,
	speed: 22,
	hitR: 2.2,
	mv: 1.7,
	kb: 3,
	crashMv: .8,
	cooldown: 32,
	flySpeed: 9
}, ku = Object.freeze({
	range: 24,
	every: 4.5,
	balls: 3,
	spread: 2.5,
	giveUp: 10,
	climb: 90
}), Au = {
	claw: 0,
	bite: 60,
	tail: 360,
	breath: 600,
	gust: 540,
	stomp: 420,
	flight: K.cooldown * 60
}, ju = "whelp", Mu = 5, Nu = {
	n: 6,
	renew: 3,
	every: 15,
	r: [1.6, 2.2],
	dur: 12,
	flat: 6,
	tick: 30
}, Pu = [
	1,
	.42,
	.12
], Fu = [5.6, 5], Iu = [2.2, 4.4], Lu = Object.freeze({
	blast: {
		mode: "billboard",
		lift: 1.1,
		color: [
			1.5,
			.72,
			.28
		],
		loops: 1,
		scale: 1.25
	},
	crash: {
		mode: "billboard",
		lift: 1.6,
		color: [
			1.5,
			.72,
			.28
		],
		loops: 1,
		scale: 2.1
	},
	ring: {
		mode: "flat",
		lift: .06,
		color: [
			1.9,
			1.1,
			.55
		],
		loops: 1,
		scale: 1,
		grow: 1.2
	},
	quake: {
		mode: "flat",
		lift: .06,
		color: [
			1.6,
			.95,
			.5
		],
		loops: 1,
		fps: 24,
		scale: 1.5,
		grow: 2.6
	},
	push: {
		mode: "flat",
		lift: .08,
		color: [
			1,
			.9,
			.78
		],
		loops: 1,
		fps: 20,
		scale: 1.3,
		grow: 3
	},
	embers: {
		mode: "flat",
		lift: .045,
		color: [
			2,
			.75,
			.22
		],
		loops: 3,
		fps: 3,
		scale: 1.1
	}
}), Ru = Object.freeze({
	frame: "dragonFireball",
	mode: "billboard",
	color: [
		1.8,
		.8,
		.26
	],
	scale: 1.6,
	rot: -Math.PI / 2,
	fps: 14,
	trail: "dragonTrail",
	trailEvery: .03,
	trailCount: 2,
	fadeBurst: "dragonSmoke",
	fadeCount: 3
}), zu = /* @__PURE__ */ new WeakMap();
function Bu(e) {
	let t = zu.get(e);
	if (t) return t;
	t = new fu(e.sprite);
	let n = t;
	return e.sprite.addEventListener("removed", () => {
		n.dispose(), zu.delete(e);
	}), zu.set(e, t), t;
}
function Vu(e) {
	return Bu(e), e.sprite.opacity = 0, e.radius = e.def.radius, {
		own: !1,
		col: -1,
		row: -1,
		side: "left",
		clock: 0,
		phaseT: 0,
		walk: 0,
		stepFr: -1,
		move: null,
		last1: null,
		last2: null,
		gap: U(50),
		stall: 0,
		offT: 0,
		cd: {
			claw: 0,
			bite: 0,
			tail: 0,
			breath: 0,
			gust: 0,
			stomp: 0,
			flight: 0,
			rise: 0
		},
		forced: null,
		flyNext: !1,
		tag: 0,
		cx: 0,
		cz: 0,
		ax: 0,
		az: 1,
		sweep: 1,
		ticks: 0,
		patches: 0,
		charge: 0,
		rings: 0,
		trans: 0,
		awoke: !1,
		landed: !1,
		stage: "up",
		st: 0,
		ang: 0,
		salvoT: 0,
		balls: 0,
		falls: [],
		lx0: 0,
		lz0: 0,
		lx1: 0,
		lz1: 1,
		llen: 1,
		done: 0,
		sx: e.position.x,
		sz: e.position.z,
		sh: 0,
		sa: 0,
		sscale: 1,
		lavaT: 0,
		spitT: 0,
		lava: [],
		adds: [],
		wave2: !1,
		lobT: 0,
		awayT: 0,
		ascend: 0,
		dieT: 0,
		dieFx: 0,
		roared: !1,
		leapt: !1,
		beatT: 0,
		inset: null
	};
}
var Hu = {
	init: Vu,
	update(e, t, n) {
		let r = e.ai;
		r.own || (r.own = !0, e.anim("idle"), r.col = -1), r.clock += t, r.phaseT += t;
		for (let e in r.cd) r.cd[e] > 0 && (r.cd[e] -= t);
		let i = e.def.phases ?? [.65, .3], a = e.state !== "dormant" && e.state !== "intro";
		a && e.state !== "phase" && !ld(e) && (e.phase === 1 && e.hp <= e.hpMax * i[0] + hu ? td(e, 2, n) : e.phase === 2 && e.hp <= e.hpMax * i[1] + hu && td(e, 3, n));
		for (let r = 0; r < 4; r++) {
			let r = e.serial;
			if (Yu(e, t, n), e.serial === r) break;
		}
		e.phase === 3 && a && Sd(e, t, n), e.hpFloor = e.phase === 1 ? e.hpMax * i[0] : e.phase === 2 ? e.hpMax * i[1] : 0, Dd(e, n);
	},
	onHit(e, t, n) {
		if (t.guarded || e.guarded || e.armored || ld(e)) return;
		let r = e.state;
		(r === "engage" || r === "windup" || r === "active" || r === "recover") && (e.poise -= t.poise || 0, !(e.poise > 0) && (cd(e, n), e.poise = 0, e.vuln = 1.3, e.exposed = !0, e.setState("stagger"), n.sfx("stun", e.position.x, e.position.z), n.shake(.3, .4)));
	},
	cancel(e, t) {
		cd(e, t);
	},
	die(e, t) {
		let n = e.ai;
		n.move = null, n.dieT = 0, n.dieFx = 0, n.sa = 0, n.ascend = 0, zu.get(e)?.hide(), e.sprite.tint.setRGB(1, 1, 1), e.sprite.opacity = 1, e.radius = e.def.radius, n.col = -1, q(e, "death0"), t && (t.sfx("roar", e.position.x, e.position.z, {
			pitch: .72,
			volume: 1
		}), t.shake(.45, 1.2));
	},
	dead(e, t, n) {
		let r = e.ai;
		r.dieT === 0 && (r.col = -1), r.dieT += t;
		let i = r.dieT;
		e.lift = Math.max(0, e.lift - t * 6);
		let a = i < .7 ? "death0" : i < 1.5 ? "death1" : i < 2.2 ? "death2" : i < 2.8 ? "death3" : "death4", o = r.col;
		q(e, a);
		let s = e.position;
		if (a === "death2" && o !== r.col && (n.shake(.7, .9), n.sfx("quake", s.x, s.z), Td(e, n, 2.5, 4), n.burst("dragonDebris", s.x, s.y + .3, s.z, 14)), a === "death4" && o !== r.col && n.sfx("crash", s.x, s.z, { volume: .8 }), r.dieFx -= t, i > .4 && i < 5 && r.dieFx <= 0) {
			r.dieFx = .15;
			let t = e.rng.next() * _u;
			n.burst("dragonDeath", s.x + Math.cos(t) * 2, s.y + 1 + e.rng.next() * 2.5, s.z + Math.sin(t) * 1.2, 12), e.rng.next() < .4 && n.burst("dragonSmoke", s.x + Math.cos(t) * 2.5, s.y + 1.5, s.z, 3);
		}
		return i > 6 && (e.sprite.opacity = Math.max(0, 1 - (i - 6) / 2)), !0;
	},
	force(e, t) {
		let n = e.ai;
		for (let e in n.cd) n.cd[e] = e === t ? 0 : 99;
		n.forced = t && Object.hasOwn(Au, t) ? t : null, n.gap = 0, n.stall = 0, n.offT = 0;
	},
	info(e) {
		let t = e.ai;
		return {
			move: t.move,
			pending: null,
			skid: !1,
			stage: t.move === "flight" ? t.stage : null,
			lift: +e.lift.toFixed(2),
			lava: t.lava.length,
			adds: t.adds.filter((e) => e.alive).length
		};
	},
	jumpPhase(e, t, n) {
		let r = e.ai;
		t = Math.max(1, Math.min(3, t | 0)), cd(e, n), e.phase = t, e.poise = e.poiseMax, r.phaseT = U(60), r.trans = 0, nd(e), e.state !== "dormant" && e.state !== "intro" && (e.guarded = !1, e.setState("engage"), r.gap = U(30)), n.emit("bossPhase", e, t);
	},
	glow(e, t) {
		let n = e.ai, r;
		r = e.alive ? e.state === "dormant" ? 0 : e.state === "intro" ? .3 + .9 * Math.min(1, e.t / U(vu.roar)) : e.phase === 1 ? .8 : e.phase === 2 ? .8 + .5 * Math.min(1, n.phaseT) : 1.8 + .6 * (.5 - .5 * Math.cos(_u * 2 * n.clock)) : Math.max(0, 2.4 * (1 - n.dieT / 4)), e.alive && n.move === "breath" && (r += 2.6 * n.charge), e.alive && (e.state === "stun" || e.state === "stagger") && (r *= .5), t[0] = Pu[0], t[1] = Pu[1], t[2] = Pu[2], t[3] = r;
	}
};
function q(e, t) {
	let n = e.ai, r = e.sheet;
	if (!r.cell) return;
	let i = b.uCameraYaw.value, a = e.facing.x * Math.cos(i) - e.facing.z * Math.sin(i);
	a > .2 ? n.side = "right" : a < -.2 && (n.side = "left");
	let o = r.cells?.down, s = e.sprite.direction === "down" && !!o && Object.hasOwn(o, t), c = r.cell(t, s ? "down" : n.side);
	(c.col !== n.col || c.row !== n.row) && (n.col = c.col, n.row = c.row, e.sprite.setFrame(c.col, c.row));
}
function Uu(e) {
	let t = e.sheet.cells?.down;
	return e.sprite.direction === "down" && !!t;
}
function Wu(e) {
	let t = e.ai;
	q(e, `idle${Math.floor(t.clock * 3.5) % 4}`);
}
function Gu(e, t = 9) {
	let n = e.ai;
	q(e, `hover${Math.floor(n.clock * t) % 6}`);
}
function Ku(e, t, n, r) {
	let i = e.ai, a = e.position, o = a.x, s = a.z;
	e.walk(e.facing.x, e.facing.z, t, n, r, null, !1), i.walk += Math.hypot(a.x - o, a.z - s) / .55;
	let c = Math.floor(i.walk) % 6;
	q(e, `walk${c}`), c !== i.stepFr && ((c === 0 || c === 3) && (r.burst("dragonDust", a.x + e.facing.x * (c === 0 ? 1.6 : -1.2), a.y + .1, a.z + e.facing.z * (c === 0 ? 1.6 : -1.2), 2), r.sfx("quake", a.x, a.z, {
		volume: .35,
		pitch: 1.4
	}), r.shake(.05, .12)), i.stepFr = c);
}
function qu(e, t) {
	let n = e.ai, r = e.position;
	if (Uu(e)) return t.x = r.x + e.facing.x * Iu[0], t.z = r.z + e.facing.z * Iu[0], t.y = r.y + Iu[1] + e.lift, t;
	let i = b.uCameraYaw.value, a = n.side === "right" ? 1 : -1;
	return t.x = r.x + Math.cos(i) * Fu[0] * a, t.z = r.z - Math.sin(i) * Fu[0] * a, t.y = r.y + Fu[1] + e.lift, t;
}
var Ju = {
	x: 0,
	y: 0,
	z: 0
};
function Yu(e, t, n) {
	switch (e.state) {
		case "dormant":
			Xu(e, n);
			break;
		case "intro":
			Zu(e, t, n);
			break;
		case "engage":
			Qu(e, t, n);
			break;
		case "windup":
		case "active":
		case "recover":
			ud(e, t, n);
			break;
		case "phase":
			ed(e, n);
			break;
		case "stagger":
			q(e, e.t < U(12) ? "hurt" : Math.floor(e.t * 1.5) % 2 ? "stagger1" : "stagger0"), e.after(bu) && (e.poise = e.poiseMax, e.vuln = 1, e.exposed = !1, rd(e));
			break;
		case "stun":
			q(e, Math.floor(e.t * 1.2) % 2 ? "stagger1" : "stagger0"), e.after(xu) && (e.vuln = 1, e.exposed = !1, rd(e));
			break;
		default: e.setState("engage");
	}
}
function Xu(e, t) {
	let n = e.ai;
	e.guarded = !0, e.aggro = !1, e.sprite.opacity = 0, n.sa = 0;
	let r = t.player;
	if (!r.alive) return;
	let i = e.arena;
	(i ? i.contains(r.position.x, r.position.z) && Math.abs(r.position.y - i.y) < 1 : e.tp.d < 12) && e.setState("intro");
}
function Zu(e, t, n) {
	let r = e.ai, i = e.position;
	e.guarded = !0, e.aggro = !0;
	let a = e.fr;
	if (e.entered) {
		r.awoke = !1, r.landed = !1, e.radius = e.def.radius, n.emit("bossIntro", e);
		let t = n.player.position;
		e.face(t.x, t.z), n.sfx("roarFar", i.x, i.z, { volume: 1 });
	}
	if (a < vu.descend) {
		let o = a / vu.descend;
		e.lift = vu.high * (1 - o) ** 1.6, e.sprite.opacity = Math.min(1, a / 24), a < vu.flare ? Gu(e, 7) : q(e, "land0"), r.sx = i.x, r.sz = i.z, r.sh = Math.atan2(e.facing.z, e.facing.x), r.sa = .25 + .75 * o, r.sscale = 1.25 - .25 * o, r.beatT -= t, r.beatT <= 0 && (r.beatT = .5, n.sfx("wingbeat", i.x, i.z, {
			volume: 1.1,
			pitch: .75
		}));
		return;
	}
	if (e.lift = 0, e.sprite.opacity = 1, r.sa = 0, a < vu.touch) q(e, "land1");
	else if (a < vu.crouch) {
		if (q(e, "land2"), !r.landed) {
			r.landed = !0, n.shake(.75, .9), n.sfx("quake", i.x, i.z, { volume: 1 }), n.sfx("slam", i.x, i.z, {
				volume: 1,
				pitch: .7
			}), Td(e, n, 3.2, 6), n.burst("dragonDebris", i.x, i.y + .3, i.z, 16), n.fx("dragonRing", i.x, i.y, i.z, Lu.quake);
			let t = e.hazardRing(i.x, i.z, 1, 9, 12, 1.2);
			t.mv = 0, t.kb = 0;
		}
	} else a < vu.rise ? q(e, "land3") : a < vu.roar ? q(e, "roar0") : (r.awoke || (r.awoke = !0, n.sfx("roar", i.x, i.z, { volume: 1.2 }), n.shake(.5, 1.4), n.burst("dragonEmbers", i.x, i.y + 3, i.z, 20), n.emit("bossAwake", e)), q(e, Math.floor((a - vu.roar) / 10) % 2 ? "roar2" : "roar1"));
	e.after(vu.total) && (e.guarded = !1, r.gap = U(36), e.setState("engage"));
}
function Qu(e, t, n) {
	let r = e.ai, i = n.player, a = e.tp;
	if (e.guarded = !1, !i.alive) {
		Wu(e);
		return;
	}
	if (wd(e, i.position.x, i.position.z, t, wu[e.phase - 1] ?? wu[0]), e.arena && !e.arena.active) {
		$u(e, t, n);
		return;
	}
	r.awayT = 0, a.d <= 7 && e.facing.x * a.dx + e.facing.z * a.dz < Math.cos(110 * gu) ? r.offT += t : r.offT = Math.max(0, r.offT - t * .5), r.gap -= t;
	let o = e.def.phaseSpeeds?.[e.phase - 1] ?? e.def.speed;
	if (r.gap <= 0) {
		let i = ad(e);
		if (i) {
			od(e, i, n);
			return;
		}
		r.stall += t;
	}
	let s = e.facing.x * a.dx + e.facing.z * a.dz;
	a.d > 6 && s > .6 ? Ku(e, o, t, n) : Wu(e);
}
function $u(e, t, n) {
	let r = e.ai, i = e.position, a = n.player;
	if (xd(e, t, n), r.ascend > 0) {
		e.guarded = !0, r.ascend += t;
		let a = Math.min(1, r.ascend / U(ku.climb));
		a < .25 ? q(e, a < .12 ? "takeoff1" : "takeoff2") : Gu(e), e.lift = vu.high * a * a, e.sprite.opacity = 1 - Math.min(1, Math.max(0, (a - .55) / .45)), Ed(r, i.x, i.z, Math.atan2(e.facing.z, e.facing.x), 1 - a, 1 + .25 * a), r.beatT -= t, r.beatT <= 0 && (r.beatT = .5, n.sfx("wingbeat", i.x, i.z, {
			volume: 1.1,
			pitch: .75
		})), a >= 1 && (r.ascend = 0, r.awayT = 0, r.sa = 0, e.lift = 0, e.setState("dormant"));
		return;
	}
	let o = e.arena.rect, s = e.tp, c = a.alive && s.d <= ku.range;
	if (r.awayT = c ? 0 : r.awayT + t, r.awayT >= ku.giveUp) {
		r.ascend = hu, r.beatT = 0, r.falls.length = 0, n.sfx("roar", i.x, i.z, {
			volume: .9,
			pitch: .9
		}), n.sfx("wingbeat", i.x, i.z, {
			volume: 1.4,
			pitch: .65
		}), Td(e, n, 3, 6), n.fx("dragonRing", i.x, i.y, i.z, Lu.push);
		return;
	}
	let l = e.facing.x * s.dx + e.facing.z * s.dz, u = e.def.moveRadius + .6, d = Math.min(o.maxX - u, Math.max(o.minX + u, a.position.x)), f = Math.min(o.maxZ - u, Math.max(o.minZ + u, a.position.z));
	if (s.d > 9 && l > .6 && Math.hypot(d - i.x, f - i.z) > 1.5 ? Ku(e, e.def.speed, t, n) : r.lobT > ku.every - .45 ? q(e, "breath1") : Wu(e), r.lobT -= t, c && r.lobT <= 0) {
		r.lobT = ku.every, r.sx = i.x, r.sz = i.z, r.sh = Math.atan2(e.facing.z, e.facing.x);
		for (let t = 0; t < ku.balls; t++) bd(e, n, t ? ku.spread : 0, !1);
		n.sfx("fireRoar", i.x, i.z, { volume: .9 }), qu(e, Ju), n.burst("dragonFireBurst", Ju.x, Ju.y, Ju.z, 10);
	}
}
function ed(e, t) {
	let n = e.ai, r = e.position;
	e.guarded = !0;
	let i = e.fr;
	if (q(e, i < 10 ? "hurt" : i < 24 ? "roar0" : Math.floor((i - 24) / 10) % 2 ? "roar2" : "roar1"), e.entered && (t.sfx("growl", r.x, r.z, { volume: 1 }), n.roared = !1), i >= 24 && !n.roared && (n.roared = !0, t.sfx("roar", r.x, r.z, { volume: 1.2 }), t.shake(.55, 1.3), t.burst("dragonEmbers", r.x, r.y + 3, r.z, 24)), i >= 50 && !n.awoke) {
		n.awoke = !0;
		let i = e.hazardRing(r.x, r.z, .5, 7, 10, 1);
		i.thin = !1, i.mv = 0, i.kb = 3, Td(e, t, 2.5, 5), t.fx("dragonRing", r.x, r.y, r.z, Lu.push), n.trans === 2 && Md(e, t), n.trans === 3 && (Cd(e, t, Nu.n), jd(n) < 2 && !n.wave2 && (n.wave2 = !0, Md(e, t)));
	}
	e.after(yu) && (e.guarded = !1, n.trans = 0, e.phase === 2 && (n.flyNext = !0), sd(e, U(20)));
}
function td(e, t, n) {
	let r = e.ai;
	cd(e, n), e.phase = t, e.poise = e.poiseMax, r.phaseT = 0, r.trans = t, r.awoke = !1, nd(e), n.emit("bossPhase", e, t), e.guarded = !0, e.setState("phase");
}
function nd(e) {
	e.phase >= 3 ? e.sprite.tint.setRGB(1, .9, .86) : e.sprite.tint.setRGB(1, 1, 1);
}
function rd(e) {
	let t = e.ai;
	t.move = "rise", e.armored = !1, e.setState("recover");
}
function id(e, t) {
	return e.phase === 3 ? Math.max(18, Math.ceil(t * .8)) : t;
}
function ad(e) {
	let t = e.ai, n = e.tp.d, r = e.phase, i = t.stall >= U(90) - hu, a = (e) => t.cd[e] <= 0 && (i || t.last1 !== e || t.last2 !== e);
	if (t.forced) return a(t.forced) ? t.forced : null;
	if (t.flyNext && r >= 2) return "flight";
	if (t.offT >= U(Du.behind) - hu && a("tail")) return "tail";
	let o = e.facing.x * e.tp.dx + e.facing.z * e.tp.dz, s = [
		["claw", n <= Tu.range && o > .5 && a("claw") ? 3 : 0],
		["bite", n >= Eu.near && n <= Eu.far && o > .7 && a("bite") ? 2.4 : 0],
		["stomp", n <= G.range && a("stomp") ? 2.2 : 0],
		["breath", n <= W.range && o > .3 && a("breath") ? 2 : 0],
		["gust", r >= 2 && n <= Ou.range && o > .5 && a("gust") ? 1.4 : 0],
		["flight", r >= 2 && a("flight") ? n > 7 ? 1.5 : .8 : 0],
		["tail", n <= 6 && a("tail") ? .8 : 0]
	], c = 0;
	for (let [, e] of s) c += e;
	if (c <= 0) return null;
	let l = e.rng.next() * c;
	for (let [e, t] of s) if (l -= t, l < 0 && t > 0) return e;
	return null;
}
function od(e, t, n) {
	let r = e.ai;
	r.move = t, r.last2 = r.last1, r.last1 = t, r.cd[t] = U(Au[t] * (e.phase === 3 && t === "breath" ? .7 : 1)), r.stall = 0, r.forced = null, t === "tail" && (r.offT = 0), t === "flight" && (r.flyNext = !1), r.ticks = 0, r.patches = 0, r.charge = 0, r.rings = 0, r.leapt = !1, e.setState("windup"), e.entered && n.sfx(t === "breath" ? "breath" : t === "flight" ? "wingbeat" : "windup", e.position.x, e.position.z);
}
function sd(e, t) {
	let n = e.ai;
	n.move = null, n.charge = 0, e.armored = !1;
	let r = Cu[e.phase - 1] ?? Cu[0];
	n.gap = t ?? U(e.rng.int(r[0], r[1])), e.setState("engage");
}
function cd(e, t) {
	let n = e.ai;
	t && e.unmarkAll(t), n.move = null, n.charge = 0, n.falls.length = 0, n.sa = 0, e.armored = !1, e.vuln = 1, e.exposed = !1, e.lift = 0, e.radius = e.def.radius, e.alive && e.state !== "dormant" && (e.sprite.opacity = 1);
}
function ld(e) {
	let t = e.ai;
	return t.move === "flight" && e.state === "active" && t.stage !== "swoop";
}
function ud(e, t, n) {
	switch (e.ai.move) {
		case "claw":
			dd(e, t, n);
			break;
		case "bite":
			fd(e, t, n);
			break;
		case "tail":
			pd(e, t, n);
			break;
		case "breath":
			md(e, t, n);
			break;
		case "gust":
			hd(e, t, n);
			break;
		case "stomp":
			gd(e, t, n);
			break;
		case "flight":
			_d(e, t, n);
			break;
		case "rise":
			q(e, "land3"), e.after(Su) && sd(e, U(20));
			break;
		default: sd(e);
	}
}
function dd(e, t, n) {
	let r = e.ai, i = e.position;
	if (e.state === "windup") {
		let a = id(e, Tu.windup);
		e.t < U(a * .5) && wd(e, n.player.position.x, n.player.position.z, t, 200), q(e, "claw0");
		let o = e.markerSpec("sector", i.x, i.z);
		o.r = Tu.r, o.halfAngle = Tu.half, o.progress = Math.min(1, e.t / U(a)), e.mark(0, n, o), e.after(a) && (r.tag = e.newTag(), e.setState("active"));
		return;
	}
	if (e.state === "active") {
		if (q(e, "claw1"), e.entered && (e.markProgress(0, n, 1), n.sfx("swingHeavy", i.x, i.z, { pitch: .7 }), n.shake(.2, .25), n.burst("dragonDust", i.x + e.facing.x * 3.5, i.y + .2, i.z + e.facing.z * 3.5, 6)), e.after(Tu.active)) {
			e.unmark(0, n), e.setState("recover");
			return;
		}
		let t = e.hitSpec();
		t.shape = "sector", t.r = Tu.r, t.halfAngle = Tu.half, t.mv = Tu.mv, t.kb = Tu.kb, t.tag = r.tag, n.hitbox(e, t);
		return;
	}
	q(e, "claw2"), e.after(Tu.recover) && sd(e);
}
function fd(e, t, n) {
	let r = e.ai, i = e.position;
	if (e.state === "windup") {
		let a = id(e, Eu.windup);
		e.entered && n.sfx("growl", i.x, i.z, { volume: .9 }), e.t < U(a - 8) && wd(e, n.player.position.x, n.player.position.z, t, 160), r.cx = i.x + e.facing.x * Eu.ahead, r.cz = i.z + e.facing.z * Eu.ahead, q(e, "bite0");
		let o = e.markerSpec("circle", r.cx, r.cz);
		o.r = Eu.r, o.progress = Math.min(1, e.t / U(a)), e.mark(0, n, o), e.after(a) && (r.tag = e.newTag(), e.setState("active"));
		return;
	}
	if (e.state === "active") {
		if (q(e, "bite1"), e.entered && (e.markProgress(0, n, 1), n.sfx("swingHeavy", r.cx, r.cz, { pitch: .55 }), n.shake(.18, .2)), e.after(Eu.active)) {
			e.unmark(0, n), e.setState("recover");
			return;
		}
		let t = e.hitSpec();
		t.shape = "circle", t.x = r.cx, t.z = r.cz, t.r = Eu.r, t.mv = Eu.mv, t.kb = Eu.kb, t.tag = r.tag, n.hitbox(e, t);
		return;
	}
	q(e, "bite2"), e.after(Eu.recover) && sd(e);
}
function pd(e, t, n) {
	let r = e.ai, i = e.position;
	if (e.state === "windup") {
		let t = id(e, Du.windup);
		q(e, "tail0");
		let a = e.markerSpec("sector", i.x, i.z);
		a.dirX = -e.facing.x, a.dirZ = -e.facing.z, a.r = Du.r, a.halfAngle = Du.half, a.progress = Math.min(1, e.t / U(t)), e.mark(0, n, a), e.after(t) && (r.tag = e.newTag(), e.setState("active"));
		return;
	}
	if (e.state === "active") {
		if (q(e, e.t < U(5) ? "tail1" : "tail2"), e.entered) {
			e.markProgress(0, n, 1), n.sfx("swingHeavy", i.x, i.z, {
				pitch: .5,
				volume: 1.2
			}), n.shake(.3, .35);
			for (let t = 0; t < 3; t++) {
				let r = Math.atan2(-e.facing.z, -e.facing.x) + (t - 1) * .9;
				n.burst("dragonDust", i.x + Math.cos(r) * 4.5, i.y + .15, i.z + Math.sin(r) * 4.5, 5);
			}
		}
		if (e.after(Du.active)) {
			e.unmark(0, n), e.setState("recover");
			return;
		}
		let t = e.hitSpec();
		t.shape = "sector", t.dirX = -e.facing.x, t.dirZ = -e.facing.z, t.r = Du.r, t.halfAngle = Du.half, t.mv = Du.mv, t.kb = Du.kb, t.knockdown = !0, t.tag = r.tag, n.hitbox(e, t);
		return;
	}
	q(e, "tail3"), e.after(Du.recover) && sd(e);
}
function md(e, t, n) {
	let r = e.ai, i = e.position;
	if (e.state === "windup") {
		let a = id(e, W.windup), o = Math.min(1, e.t / U(a));
		o < .6 && (wd(e, n.player.position.x, n.player.position.z, t, 140), r.ax = e.facing.x, r.az = e.facing.z), r.charge = o, q(e, o < .75 ? "breath0" : "breath1");
		let s = e.markerSpec("sector", i.x + r.ax * 1.5, i.z + r.az * 1.5);
		s.dirX = r.ax, s.dirZ = r.az, s.r = W.r, s.halfAngle = W.sweep + W.cone, s.progress = o, e.mark(0, n, s), e.fr % 6 == 0 && (qu(e, Ju), n.burst("dragonEmbers", Ju.x, Ju.y - .6, Ju.z, 2)), e.after(a) && (e.unmark(0, n), r.sweep = e.rng.next() < .5 ? -1 : 1, e.setState("active"));
		return;
	}
	if (e.state === "active") {
		let t = Math.min(1, e.t / U(W.active));
		r.charge = 1 - .3 * t;
		let a = Math.atan2(r.az, r.ax) + r.sweep * (t * 2 - 1) * W.sweep * gu, o = Math.cos(a), s = Math.sin(a);
		e.faceDir(o, s), q(e, e.t < U(8) ? "breath1" : Math.floor(e.t * 10) % 2 ? "breath3" : "breath2"), e.entered && (n.sfx("fireRoar", i.x, i.z, { volume: 1.2 }), n.shake(.22, 1.6)), qu(e, Ju), e.fr % 2 == 0 && n.burst(nt("dragonBreath", o, s), Ju.x, Ju.y, Ju.z, 4), e.fr % 9 == 0 && n.burst("dragonSmoke", i.x + o * 7, i.y + 1.2, i.z + s * 7, 2);
		let c = e.markerSpec("sector", i.x + o * 1.5, i.z + s * 1.5);
		if (c.dirX = o, c.dirZ = s, c.r = W.r, c.halfAngle = W.cone, c.progress = 1, e.mark(1, n, c), e.fr >= r.ticks * W.every) {
			r.ticks++;
			let t = e.hitSpec();
			t.shape = "sector", t.x = i.x + o * 1.5, t.z = i.z + s * 1.5, t.dirX = o, t.dirZ = s, t.r = W.r, t.halfAngle = W.cone, t.mv = W.mv, t.kb = W.kb, t.tag = e.newTag(), n.hitbox(e, t);
		}
		if (r.patches < W.patches && e.fr >= 12 + r.patches * W.patchEvery) {
			r.patches++;
			let t = 4.5 + e.rng.next() * 3.5, a = i.x + o * t, c = i.z + s * t;
			e.hazardMagma(a, c, W.patchR, U(W.patchDur), W.patchFlat, U(W.patchTick)), n.burst("dragonEmbers", a, n.groundAt(a, c) + .2, c, 6);
		}
		e.after(W.active) && (e.unmark(1, n), e.setState("recover"));
		return;
	}
	r.charge = Math.max(0, .7 - e.t * 2), q(e, e.t < U(16) ? "breath3" : "idle0"), e.after(W.recover) && sd(e);
}
function hd(e, t, n) {
	let r = e.ai, i = e.position;
	if (e.state === "windup") {
		let a = id(e, Ou.windup);
		e.t < U(a * .5) && wd(e, n.player.position.x, n.player.position.z, t, 160), q(e, "gust0");
		let o = e.markerSpec("sector", i.x, i.z);
		o.r = Ou.r, o.halfAngle = Ou.half, o.progress = Math.min(1, e.t / U(a)), e.mark(0, n, o), e.after(a) && (r.tag = e.newTag(), e.setState("active"));
		return;
	}
	if (e.state === "active") {
		if (q(e, "gust1"), e.entered && (e.markProgress(0, n, 1), n.sfx("wingbeat", i.x, i.z, {
			volume: 1.4,
			pitch: .7
		}), n.shake(.3, .5)), e.fr % 2 == 0) {
			let t = nt("dragonGust", e.facing.x, e.facing.z);
			n.burst(t, i.x + e.facing.x * 2.5, i.y + .5, i.z + e.facing.z * 2.5, 4);
		}
		if (e.after(Ou.active)) {
			e.unmark(0, n), e.setState("recover");
			return;
		}
		let t = e.hitSpec();
		t.shape = "sector", t.r = Ou.r, t.halfAngle = Ou.half, t.mv = Ou.mv, t.kb = Ou.kb, t.tag = r.tag, n.hitbox(e, t);
		return;
	}
	q(e, e.t < U(14) ? "gust1" : "idle0"), e.after(Ou.recover) && sd(e);
}
function gd(e, t, n) {
	let r = e.ai, i = e.position;
	if (e.state === "windup") {
		let t = id(e, G.windup);
		q(e, "stomp0");
		let a = e.markerSpec("circle", i.x, i.z);
		a.r = G.r, a.progress = Math.min(1, e.t / U(t)), e.mark(0, n, a), e.after(t) && (r.tag = e.newTag(), e.setState("active"));
		return;
	}
	if (e.state === "active") {
		if (q(e, "stomp1"), e.entered) {
			e.markProgress(0, n, 1), n.shake(.6, .6), n.sfx("quake", i.x, i.z, { volume: 1.1 }), n.sfx("slam", i.x, i.z, { pitch: .65 }), Td(e, n, 2.6, 6), n.burst("dragonDebris", i.x, i.y + .3, i.z, 14), n.fx("dragonRing", i.x, i.y, i.z, Lu.quake);
			let t = e.phase;
			for (let n = 0; n < t; n++) {
				let t = e.hazardRing(i.x, i.z, G.width, G.rMax, G.speed, G.width, U(n * G.every));
				t.mv = G.ringMv, t.kb = G.ringKb;
			}
		}
		if (e.after(G.active)) {
			e.unmark(0, n), e.setState("recover");
			return;
		}
		let t = e.hitSpec();
		t.shape = "circle", t.r = G.r, t.mv = G.mv, t.kb = G.kb, t.knockdown = !0, t.tag = r.tag, n.hitbox(e, t);
		return;
	}
	q(e, e.t < U(20) ? "stomp1" : "idle0"), e.after(G.recover) && sd(e);
}
function _d(e, t, n) {
	let r = e.ai, i = e.position, a = n.player.position;
	if (e.state === "windup") {
		if (e.fr < K.leap) wd(e, a.x, a.z, t, 120), q(e, "takeoff0"), e.lift = 0;
		else {
			if (!r.leapt) {
				r.leapt = !0, n.sfx("wingbeat", i.x, i.z, {
					volume: 1.4,
					pitch: .65
				}), n.shake(.35, .5), Td(e, n, 3, 6), n.fx("dragonRing", i.x, i.y, i.z, Lu.push);
				let t = e.hazardRing(i.x, i.z, 1, 6, 10, 1);
				t.mv = 0, t.kb = 2.5, t.thin = !1, e.guarded = !0;
			}
			let t = (e.fr - K.leap) / (K.takeoff - K.leap);
			q(e, t < .5 ? "takeoff1" : "takeoff2"), e.lift = 4 * t * t;
		}
		e.after(K.takeoff) && (r.stage = "up", r.st = 0, r.balls = 0, r.falls.length = 0, r.ang = Math.atan2(i.z - Od(e).z, i.x - Od(e).x), e.setState("active"));
		return;
	}
	if (e.state === "active") {
		if (r.st += t, e.guarded = r.stage !== "swoop", r.stage === "up") {
			let a = Math.min(1, r.st / U(K.climb));
			e.lift = 4 + (K.high - 4) * a * a, Gu(e, 10), e.sprite.opacity = Math.max(0, Math.min(1, (14 - e.lift) / 6)), e.sprite.opacity < .5 && (e.radius = .01), Ed(r, i.x, i.z, Math.atan2(e.facing.z, e.facing.x), a * .9, 1.2 - .2 * a), r.st % .5 < t && n.sfx("wingbeat", i.x, i.z, {
				volume: .9,
				pitch: .75
			}), a >= 1 && (r.stage = "circle", r.st = 0, r.salvoT = U(20));
			return;
		}
		if (r.stage === "circle") {
			let a = Od(e), o = kd(e);
			r.ang += K.flySpeed / o * t;
			let s = a.x + Math.cos(r.ang) * o, c = a.z + Math.sin(r.ang) * o;
			i.x = s, i.z = c, Ed(r, s, c, r.ang + Math.PI / 2, 1, 1);
			let l = K.balls[+(e.phase >= 3)];
			r.salvoT -= t, r.salvoT <= 0 && r.balls < l && (r.salvoT = K.salvo[+(e.phase >= 3)], bd(e, n, r.balls === 0 ? 0 : 3.2), r.balls++), xd(e, t, n);
			let u = K.circle[+(e.phase >= 3)];
			r.st >= u && r.balls >= l && (r.stage = "lane", r.st = 0);
			return;
		}
		if (r.stage === "lane") {
			xd(e, t, n), r.st < U(K.lane - K.lock) - hu && yd(e, a.x, a.z);
			let o = Math.min(1, t * 4);
			r.sx += (r.lx0 - r.sx) * o, r.sz += (r.lz0 - r.sz) * o, r.sh = Math.atan2(r.lz1, r.lx1);
			let s = e.markerSpec("lane", r.lx0, r.lz0);
			s.dirX = r.lx1, s.dirZ = r.lz1, s.len = r.llen, s.width = K.width, s.progress = Math.min(1, r.st / U(K.lane)), s.flash = e.lockFlash(r.st - U(K.lane - K.lock)), e.mark(0, n, s), r.st >= U(K.lane) - hu && (e.markProgress(0, n, 1), r.stage = "swoop", r.st = 0, r.done = 0, r.tag = e.newTag(), i.x = r.lx0, i.z = r.lz0, e.faceDir(r.lx1, r.lz1), e.radius = e.def.radius, e.armored = !0, e.guarded = !1, e.sprite.opacity = 1, r.sa = 0, n.sfx("roar", i.x, i.z, {
				volume: 1,
				pitch: 1.1
			}));
			return;
		}
		let o = Math.min(K.speed * t, r.llen - r.done);
		i.x += r.lx1 * o, i.z += r.lz1 * o, r.done += o;
		let s = r.done / r.llen;
		e.lift = s < .35 ? 8 * (1 - s / .35) + 1.2 : 1.2 * (1 - (s - .35) / .65), q(e, s < .45 ? "dive0" : "dive1"), e.fr % 3 == 0 && n.burst("dragonDust", i.x - r.lx1 * 2, i.y + .2, i.z - r.lz1 * 2, 3);
		let c = e.hitSpec();
		c.shape = "circle", c.x = i.x + r.lx1 * 1.5, c.z = i.z + r.lz1 * 1.5, c.r = K.hitR, c.mv = K.mv, c.kb = K.kb, c.knockdown = !0, c.fromX = i.x, c.fromZ = i.z, c.tag = r.tag, n.hitbox(e, c), r.done >= r.llen - .001 && vd(e, n);
		return;
	}
	sd(e);
}
function vd(e, t) {
	let n = e.ai, r = e.position;
	e.unmarkAll(t), e.lift = 0, e.armored = !1, e.guarded = !1, n.move = null, t.shake(.8, .8), t.sfx("crash", r.x, r.z, { volume: 1.2 }), t.sfx("quake", r.x, r.z, { volume: 1 }), Td(e, t, 3, 7), t.burst("dragonDebris", r.x, r.y + .3, r.z, 20), t.fx("dragonBlast", r.x, r.y, r.z, Lu.crash), t.fx("dragonRing", r.x, r.y, r.z, Lu.quake);
	let i = e.hazardRing(r.x, r.z, 1, 6, 10, 1);
	i.mv = K.crashMv, i.kb = 2, i.thin = !1, e.vuln = 1.5, e.exposed = !0, t.fx("stun", r.x, r.y + 1.2, r.z, {
		duration: xu / 60,
		follow: e.position
	}), e.setState("stun");
}
function yd(e, t, n) {
	let r = e.ai, i = Od(e), a = t - i.x, o = n - i.z, s = Math.hypot(a, o);
	s < 1 && (a = Math.cos(r.ang), o = Math.sin(r.ang), s = 1), a /= s, o /= s;
	let c = (t, n, r, i, a) => {
		let o = Ad(e, t);
		if (!o) return 10;
		let s = Infinity;
		return i > 1e-6 && (s = Math.min(s, (o.maxX - n) / i)), i < -1e-6 && (s = Math.min(s, (o.minX - n) / i)), a > 1e-6 && (s = Math.min(s, (o.maxZ - r) / a)), a < -1e-6 && (s = Math.min(s, (o.minZ - r) / a)), s;
	}, l = Math.max(2, c(1.5, t, n, -a, -o)), u = Math.max(-2, Math.min(5, c(e.def.radius + 1, t, n, a, o)));
	r.lx0 = t - a * l, r.lz0 = n - o * l, r.lx1 = a, r.lz1 = o, r.llen = Math.max(4, l + u);
}
function bd(e, t, n, r = !0) {
	let i = e.ai, a = t.player, o = a.position.x + a.velocity.x * .5, s = a.position.z + a.velocity.z * .5;
	if (n > 0) {
		let t = e.rng.next() * _u, r = n * Math.sqrt(e.rng.next());
		o += Math.cos(t) * r, s += Math.sin(t) * r;
	}
	let c = r ? Ad(e, K.ballR) : null;
	c && (o = Math.min(c.maxX, Math.max(c.minX, o)), s = Math.min(c.maxZ, Math.max(c.minZ, s)));
	let l = e.hazardCircle(o, s, K.ballR, U(K.fill));
	l.mv = K.ballMv, l.kb = K.ballKb, l.burst = "dragonFireBurst", l.burstN = 16, l.sfx = "explosion", i.falls.push({
		t: U(K.fill),
		x: o,
		z: s
	});
}
function xd(e, t, n) {
	let r = e.ai, i = .75;
	for (let a = r.falls.length - 1; a >= 0; a--) {
		let o = r.falls[a], s = o.t;
		if (o.t -= t, s > i && o.t <= i) {
			let t = r.sx + Math.cos(r.sh) * 4, a = r.sz + Math.sin(r.sh) * 4, s = e.projSpec(), c = Math.hypot(o.x - t, o.z - a);
			s.kind = "boulder", s.look = Ru, s.x = t, s.z = a, s.y = n.groundAt(o.x, o.z) + 13, s.dirX = c > 1e-4 ? (o.x - t) / c : 0, s.dirZ = c > 1e-4 ? (o.z - a) / c : 1, s.speed = c / i, s.range = c, s.radius = .4, s.mv = 0, s.kb = 0, s.arc = {
				tx: o.x,
				tz: o.z,
				time: i,
				apex: 0
			}, n.projectile(e, s), n.sfx("fireballFall", o.x, o.z, { volume: .7 });
		}
		if (o.t <= 0) {
			let e = n.groundAt(o.x, o.z);
			n.fx("dragonBlast", o.x, e, o.z, Lu.blast), n.fx("dragonRing", o.x, e, o.z, Lu.ring), n.fx("dragonEmbers", o.x, e, o.z, Lu.embers), n.burst("dragonSmoke", o.x, e + .6, o.z, 5), n.burst("dragonDebris", o.x, e + .2, o.z, 6), r.falls.splice(a, 1);
		}
	}
}
function Sd(e, t, n) {
	let r = e.ai;
	for (let e = r.lava.length - 1; e >= 0; e--) r.lava[e].t -= t, r.lava[e].t <= 0 && r.lava.splice(e, 1);
	if (!r.lava.length && e.state !== "phase" && (r.lavaT -= t, r.lavaT <= 0 && Cd(e, n, Nu.renew)), r.spitT -= t, r.spitT <= 0 && r.lava.length) {
		r.spitT = .35 + e.rng.next() * .5;
		let t = r.lava[Math.floor(e.rng.next() * r.lava.length)];
		n.burst("dragonLavaSpit", t.x, n.groundAt(t.x, t.z) + .1, t.z, 5);
	}
}
function Cd(e, t, n) {
	let r = e.ai, i = Ad(e, 2.5), a = t.player.position, o = Od(e);
	for (let s = 0; s < n; s++) {
		let n = 0, s = 0;
		for (let t = 0; t < 8 && (n = i ? i.minX + e.rng.next() * (i.maxX - i.minX) : o.x + (e.rng.next() - .5) * 16, s = i ? i.minZ + e.rng.next() * (i.maxZ - i.minZ) : o.z + (e.rng.next() - .5) * 12, !(Math.hypot(n - a.x, s - a.z) > 2.5)); t++);
		let c = Nu.r[0] + e.rng.next() * (Nu.r[1] - Nu.r[0]);
		e.hazardMagma(n, s, c, Nu.dur, Nu.flat, U(Nu.tick)), r.lava.push({
			x: n,
			z: s,
			t: Nu.dur
		}), t.burst("dragonLavaSpit", n, t.groundAt(n, s) + .1, s, 8);
	}
	r.lavaT = Nu.every - Nu.dur, t.sfx("quake", o.x, o.z, { volume: .8 }), t.shake(.25, .6);
}
function wd(e, t, n, r, i) {
	let a = e.position, o = Math.atan2(t - a.x, n - a.z), s = Math.atan2(e.facing.x, e.facing.z), c = o - s;
	for (; c > Math.PI;) c -= _u;
	for (; c < -Math.PI;) c += _u;
	let l = i * gu * r;
	s += Math.max(-l, Math.min(l, c)), e.faceDir(Math.sin(s), Math.cos(s));
}
function Td(e, t, n, r) {
	let i = e.position;
	for (let a = 0; a < r; a++) {
		let o = a / r * _u + e.rng.next() * .4;
		t.burst("dragonDust", i.x + Math.cos(o) * n, i.y + .15, i.z + Math.sin(o) * n, 5);
	}
}
function Ed(e, t, n, r, i, a) {
	e.sx = t, e.sz = n, e.sh = r, e.sa = i, e.sscale = a;
}
function Dd(e, t) {
	let n = e.ai, r = zu.get(e);
	if (r) {
		if (!(n.sa > .005) || !e.alive) {
			r.hide();
			return;
		}
		r.set(n.sx, n.sz, n.sh, n.clock * 6, .45 * n.sa, n.sscale, t.groundAt);
	}
}
function Od(e) {
	let t = e.arena;
	return t ? {
		x: (t.rect.minX + t.rect.maxX) / 2,
		z: (t.rect.minZ + t.rect.maxZ) / 2
	} : e.home;
}
function kd(e) {
	let t = e.arena;
	return t ? Math.max(4, Math.min(t.rect.maxX - t.rect.minX, t.rect.maxZ - t.rect.minZ) * .36) : 8;
}
function Ad(e, t) {
	let n = e.arena;
	if (!n) return null;
	let r = e.ai, i = r.inset ??= {
		minX: 0,
		maxX: 0,
		minZ: 0,
		maxZ: 0
	};
	return i.minX = n.rect.minX + t, i.maxX = n.rect.maxX - t, i.minZ = n.rect.minZ + t, i.maxZ = n.rect.maxZ - t, i;
}
function jd(e) {
	let t = 0;
	for (let n of e.adds) n && n.alive && t++;
	return t;
}
function Md(e, t) {
	let n = e.ai, r = e.arena, i = e.position, a = t.player.position, o = r ? r.rect : {
		minX: i.x - 9,
		maxX: i.x + 9,
		minZ: i.z - 7,
		maxZ: i.z + 7
	}, s = [
		[o.minX + 2.5, o.minZ + 2.5],
		[o.maxX - 2.5, o.minZ + 2.5],
		[o.minX + 2.5, o.maxZ - 2.5],
		[o.maxX - 2.5, o.maxZ - 2.5]
	];
	s.sort((e, t) => Math.hypot(t[0] - a.x, t[1] - a.z) - Math.hypot(e[0] - a.x, e[1] - a.z));
	for (let e = 0; e < 3; e++) {
		let r = t.spawnAdd(ju, s[e][0], s[e][1], Mu);
		r && !n.adds.includes(r) && n.adds.push(r);
	}
}
//#endregion
//#region src/game/combat/ai/index.js
var Nd = {
	slime: Nt,
	goblin: nn,
	archer: Nr,
	shaman: ni,
	bat: hi,
	boar: Bi,
	dummy: Wi,
	golem: ba,
	drakeborn: go,
	ashhound: Wo,
	wyrmcaller: ms,
	kobold: vc,
	whelp: rl,
	emberimp: Hl,
	dragon: Hu
};
function Pd(e, t) {
	if (Object.hasOwn(Nd, e)) throw Error(`registerBrain: the enemy kind "${e}" has a brain already`);
	if (!t || typeof t != "object") throw Error(`registerBrain: "${e}" needs a brain object`);
	Nd[e] = t;
}
//#endregion
//#region src/game/combat/Hitboxes.js
var Fd = Math.PI / 180, Id = 4096, Ld = 65536, Rd = Id * Ld, zd = Rd * 2 - 1;
function Bd(e, t, n, r, i) {
	let a = e.dy ?? .6;
	if (Math.abs(n - (e.y ?? 0)) > a + 1e-6) return !1;
	let o = e.thin ? 0 : i, s = t - e.x, c = r - e.z, l = Math.hypot(s, c), u = e.r ?? 1;
	switch (e.shape) {
		case "circle": return l < u + o;
		case "ring": return l > (e.rInner ?? 0) - o && l < u + o;
		case "sector": {
			if (l >= u + o) return !1;
			if (l < 1e-4) return !0;
			let t = e.dirX ?? 0, n = e.dirZ ?? 1, r = Math.hypot(t, n) || 1;
			t /= r, n /= r;
			let i = (s * t + c * n) / l;
			return Math.acos(i < -1 ? -1 : i > 1 ? 1 : i) <= (e.halfAngle ?? 60) * Fd + Math.asin(Math.min(1, o / l));
		}
		case "lane": {
			let t = e.dirX ?? 0, n = e.dirZ ?? 1, r = Math.hypot(t, n) || 1;
			t /= r, n /= r;
			let i = s * t + c * n, a = Math.abs(s * n - c * t);
			return i >= 0 && i <= (e.len ?? 1) && a < (e.width ?? 1) / 2 + o;
		}
		default: return !1;
	}
}
var Vd = {
	shape: "circle",
	x: 0,
	y: 0,
	z: 0,
	r: 1,
	rInner: 0,
	dirX: 0,
	dirZ: 1,
	halfAngle: 60,
	len: 1,
	width: 1,
	dy: .6,
	mv: 1,
	kb: 0,
	poise: 0,
	knockdown: !1,
	flat: 0,
	thin: !1,
	tag: 0,
	fromX: NaN,
	fromZ: NaN,
	chill: 0,
	slow: 0,
	freeze: 0,
	stun: 0,
	mark: 0,
	consume: 0,
	feel: null
}, Hd = Object.keys(Vd), Ud = class {
	constructor(e = 32) {
		this.items = [], this.length = 0;
		for (let t = 0; t < e; t++) this.items.push({
			owner: null,
			spec: { ...Vd }
		});
	}
	add(e, t) {
		this.length === this.items.length && this.items.push({
			owner: null,
			spec: { ...Vd }
		});
		let n = this.items[this.length++];
		n.owner = e;
		let r = n.spec;
		for (let e = 0; e < Hd.length; e++) {
			let n = Hd[e], i = t[n];
			r[n] = i === void 0 ? Vd[n] : i;
		}
		return r;
	}
	clear() {
		for (let e = 0; e < this.length; e++) this.items[e].owner = null;
		this.length = 0;
	}
}, Wd = class {
	constructor() {
		this._map = /* @__PURE__ */ new Map(), this._seq = Rd, this._free = [], this._dead = [], this._step = 0, this._collect = (e, t) => {
			e.step < this._step && this._dead.push(t);
		};
	}
	next() {
		return this._seq = this._seq >= zd ? 268435457 : this._seq + 1, this._seq;
	}
	touch(e, t) {
		let n = this._map.get(e);
		n || (n = this._free.pop() ?? {
			targets: [],
			step: 0
		}, n.targets.length = 0, this._map.set(e, n)), n.step = t;
	}
	keep(e, t) {
		let n = this._map.get(e);
		n && (n.step = t);
	}
	has(e, t) {
		let n = this._map.get(e);
		return !!n && n.targets.includes(t);
	}
	add(e, t, n) {
		this.touch(e, n), this._map.get(e).targets.push(t);
	}
	sweep(e) {
		let t = this._dead;
		t.length = 0, this._step = e, this._map.forEach(this._collect);
		for (let e = 0; e < t.length; e++) {
			let n = this._map.get(t[e]);
			n.targets.length = 0, this._free.push(n), this._map.delete(t[e]);
		}
	}
	clear() {
		for (let e of this._map.values()) e.targets.length = 0, this._free.push(e);
		this._map.clear(), this._seq = Rd;
	}
}, J = 1e-6, Y = (e) => e / 60, Gd = 21, Kd = 13, qd = 36, Jd = 60, Yd = 120, Xd = 30, Zd = 90, Qd = 6, $d = Object.freeze([
	1,
	.5,
	.2,
	.55
]), ef = 12, tf = 120, nf = 18, rf = 11, af = 3, of = 6, sf = 30, cf = 90, lf = 24, uf = 4, df = 1.5, ff = 150, pf = 18, mf = .35, hf = 6, gf = 6, _f = 60, vf = 20, yf = 1.5, bf = .4, xf = .05, Sf = 6, Cf = [24, 2.5], wf = [40, 4], Tf = 80, Ef = 1, Df = 2, Of = 3, kf = Y(2), Af = Object.freeze({
	r: 1.6,
	g: .7,
	b: .3,
	lo: .45,
	hi: .9
}), jf = Object.freeze({
	r: 1.6,
	g: 1.3,
	b: .5,
	lo: .12,
	hi: .24
}), Mf = Object.freeze({
	r: .5,
	g: .78,
	b: 1.1,
	a: .07
}), Nf = Object.freeze({
	r: -.45,
	g: -.08,
	b: 1.15,
	lo: .5,
	hi: .62
}), Pf = Object.freeze({
	r: .5,
	g: .78,
	b: 1.15,
	a: .3
}), Ff = Object.freeze({
	r: -.3,
	g: .25,
	b: 1.5,
	a: .6
}), If = Object.freeze({
	r: .5,
	g: .78,
	b: 1.15,
	a: .16
}), Lf = Object.freeze({
	r: -.3,
	g: .2,
	b: 1.4,
	a: .5
}), Rf = .38, zf = .35, Bf = .2, Vf = .2, Hf = 3, Uf = 6, Wf = .5, Gf = .9, Kf = 30, qf = .45, Jf = Object.freeze({
	color: "#cfeeff",
	hdr: 1.9,
	size: [.12, .2]
}), Yf = Object.freeze({
	colors: ["#e6f7ff", "#8fd0ff"],
	hdr: 2.6
}), Xf = Object.freeze({
	color: "#e8f8ff",
	hdr: 1.8,
	size: [.14, .24],
	spawnSize: [
		.7,
		1,
		.7
	],
	burstUp: [0, .2],
	velocity: [
		0,
		.15,
		0
	]
}), Zf = Object.freeze({
	color: "#dff4ff",
	hdr: 1.6,
	size: [.08, .14]
}), Qf = Object.freeze({
	color: "#f2fbff",
	colorEnd: "#7fc4ff",
	hdr: 3.2
}), $f = [
	Math.PI / 4,
	-Math.PI / 4,
	Math.PI / 2,
	-Math.PI / 2,
	Math.PI
], ep = class {
	constructor(e) {
		let { def: t, sprite: n } = e;
		this.uid = e.uid, this.groupId = e.group?.id ?? "", this.index = e.index ?? 0, this.kind = e.kind, this.level = e.level ?? 1, this.elite = !!e.elite, this.name = e.name || t.name, this.def = t, this.sheet = e.sheet, this.sprite = n, this.rng = e.rng, this.boss = !!t.boss, this.flier = !!t.flier, this.passive = !!t.passive, this.isAdd = !!e.isAdd, this.arena = e.arena ?? null, this.blockedBy = null, this.deathCount = 0, this.zone = -1, this.zoneRect = null, this.besiege = e.isAdd ? null : ip(e.group?.besiege), this.swarm = !e.isAdd && e.group?.swarm === !0, this.rushed = !1, this._tagBase = (Number.isInteger(e.tagSlot) && e.tagSlot > 0 ? e.tagSlot : v(this.uid) % (Ld - 1) + 1) % Ld * Id, this.position = n.position, this.home = {
			x: e.home.x,
			z: e.home.z
		}, this.homeRadius = Math.max(.5, Number(e.group?.radius) || 3), this.facing = {
			x: 0,
			z: 1
		}, this.hpMax = t.hp, this.hp = t.hp, this.poiseMax = t.poise, this.poise = t.poise, this.alive = !0, this.state = "idle", this.aggro = !1, this.dormant = !1, this.guarded = !1, this.armored = !1, this.exposed = !1, this.vuln = 1, this.hitFlash = 0, this.token = !1, this.barSlot = -1, this.target = null, this.targetHold = 0, this.targetCheck = 0, this.playerHitAt = -Infinity, this.tauntT = 0, this.ambientRun = !1, this.radius = t.radius, this.mass = t.mass, this.hover = t.hover ?? 0, this.phase = +!!this.boss, this.hpFloor = 0, this.t = 0, this.brain = Nd[this.kind] ?? Nd.dummy, this.ai = null, this.tp = {
			dx: 0,
			dz: 1,
			d: Infinity,
			dy: 0
		}, this.unreachable = !1, this._enterN = 0, this._poseName = null, this._poseCol = -1, this._poseRow = -1, this._grounded = !1, this._poiseT = 0, this._tokenWait = 0, this._senseT = 0, this._farT = 0, this._calmT = 0, this._stuckT = 0, this._detourT = 0, this._detourX = 0, this._detourZ = 1, this._detourSide = 1, this._anchorT = 0, this._anchorX = 0, this._anchorZ = 0, this._anchorTX = 0, this._anchorTZ = 0, this._ghost = 0, this._ghostDir = 0, this._kbDist = 0, this._kbT = 0, this._kbX = 0, this._kbZ = 0, this.lift = 0, this._clock = v(this.uid) % 997 / 997, this._wander = {
			has: !1,
			x: 0,
			z: 0,
			pause: 0
		}, this._path = /* @__PURE__ */ new Float32Array(48), this._pathN = 0, this._pathI = 0, this._pathFor = 0, this._pathAt = -Infinity, this._pathGX = 0, this._pathGZ = 0, this._homeLost = !1, this._pathBad = !1, this._pathCut = -1, this._pathExact = -1, this._meleeWay = !0, this._meleeNext = 0, this._navNext = 0, this._navDirect = !0, this._navPhase = v(this.uid) % gf, this._zoneT = 0, this._slots = [
			-1,
			-1,
			-1,
			-1
		], this._slotSpec = { progress: 0 }, this._fadeSpec = {
			progress: 1,
			alpha: 1
		}, this.away = {
			x: 0,
			z: 1
		}, this.cp = {
			x: 0,
			z: 0
		}, this._ms = {
			shape: "circle",
			x: 0,
			y: .03,
			z: 0,
			r: 1,
			rInner: 0,
			dirX: 0,
			dirZ: 1,
			halfAngle: 60,
			len: 1,
			width: 1,
			w: 1,
			d: 1,
			progress: 0,
			style: "enemy",
			alpha: 1
		}, this._hazards = [], this._hs = [];
		for (let e = 0; e < 16; e++) this._hs.push({});
		this._hsI = 0, this._ps = [
			{},
			{},
			{}
		], this._psI = 0, this._tagN = 0, this._flash = [
			0,
			0,
			0,
			-1
		], this._highlight = [
			0,
			0,
			0,
			-1
		], this._glowOut = [
			0,
			0,
			0,
			0
		], this._glow = [
			0,
			0,
			0,
			-1
		], this._deathFx = !1, this._deathHover = 0, this._chillT = 0, this._chillSlow = 0, this._freezeT = 0, this.iceShell = !1, this._holdT = 0, this._holding = !1, this._holdAsk = "", this._frostT = 0, this._chillSpent = 0, this._chillRest = 0, this.marks = 0, this._markT = 0, this.submerged = !1, this.released = !1, this._goneT = 0, n.name = `Enemy:${this.uid}`, this.position.set(this.home.x, this.position.y, this.home.z), this._enterInitial(), this._applyHover(), this._writeGlow();
	}
	get targetable() {
		return this.alive && !this.dormant && !this.submerged && this.state !== "return" && this.state !== "dormant" && this.sprite.visible && this.sprite.opacity > .001;
	}
	get broken() {
		return this.boss && this.state === "stagger";
	}
	chill(e, t = zf) {
		let n = np(e);
		if (!this.alive || n <= 0) return;
		let r = typeof t == "number" && t > 0 ? Math.min(Gf, t) : zf;
		this.boss && (this._chillRest > 0 || (r = Math.min(r, Vf), n = Math.min(n, Hf - this._chillSpent), n <= 0)) || (this._chillT <= 0 && (this._frostT = 0), this._chillT = Math.max(this._chillT, n), this._chillSlow = Math.max(this._chillSlow, r));
	}
	freeze(e) {
		let t = np(e);
		if (!(!this.alive || t <= 0)) {
			if (this.boss) {
				this.chill(t, Bf);
				return;
			}
			this._freezeT <= 0 && (this._holdAsk = "freeze"), this._freezeT = Math.max(this._freezeT, t), this.passive || (this._holdT = Math.max(this._holdT, t));
		}
	}
	stun(e) {
		let t = np(e);
		!this.alive || t <= 0 || this.boss || this.passive || (this._holdAsk ||= "stun", this._holdT = Math.max(this._holdT, t));
	}
	softenFlash() {
		this.hitFlash > kf && (this.hitFlash = kf, this._writeFlash());
	}
	settle(e) {
		this._calmT = Math.max(this._calmT, Math.max(0, Number(e) || 0)), this.rushed = !0;
	}
	get statusOn() {
		return this._chillT > 0 || this._freezeT > 0 || this._holdT > 0 || this._holdAsk !== "" || this._chillRest > 0;
	}
	get frozen() {
		return this._freezeT > 0;
	}
	get held() {
		return this._holding;
	}
	get timeScale() {
		return this._freezeT > 0 ? 0 : this._chillT > 0 ? 1 - this._chillSlow : 1;
	}
	statusInfo() {
		let e = (e) => +Math.max(0, e).toFixed(3);
		return {
			chill: e(this._chillT),
			slow: e(this._chillT > 0 ? this._chillSlow : 0),
			freeze: e(this._freezeT),
			stun: e(this._holdT),
			held: this._holding,
			timeScale: +this.timeScale.toFixed(3),
			chillRest: e(this._chillRest)
		};
	}
	_clearStatus() {
		this._chillT = 0, this._chillSlow = 0, this._chillSpent = 0, this._chillRest = 0, this._freezeT = 0, this._holdT = 0, this._holding = !1, this._holdAsk = "", this._frostT = 0;
	}
	update(e, t) {
		if (e > 0) {
			if (this._clock += e, !this.alive) {
				this._updateDead(e, t);
				return;
			}
			this.marks > 0 && (this._markT -= e) <= 0 && (this.marks = 0), this.statusOn && (e = this._statusStep(e, t)), this._followGround(e, t), this.hitFlash > 0 && (this.hitFlash = Math.max(0, this.hitFlash - e)), this._tokenWait > 0 && (this._tokenWait -= e), this._calmT > 0 && (this._calmT -= e), this._poiseT += e, !this.boss && this._poiseT >= Y(tf) - J && this.poise < this.poiseMax && this.state !== "stagger" && (this.poise = this.poiseMax), this._sense(t), this._updateHazards(e, t), this.boss ? this.brain.update(this, e, t) : this._step(e, t), this._ghostDir < 0 && this._fadeBackIn(e), this.alive && this._freezeT <= 0 && this._knockback(e, t), this.t += e, this._applyHover(), this._refreshRow(), this._writeFlash(), this._writeGlow();
		}
	}
	receiveHit(e, t) {
		if (this.alive && (this._writeFlash(), !(e.guarded || this.guarded || this.state === "return"))) {
			if (this.brain.onHit && this.brain.onHit(this, e, t), this.boss || this.passive) {
				this._writeFlash();
				return;
			}
			if (this.aggro || this._startNotice(t, !0, !1), (this.state === "notice" || this.state === "idle" || this.state === "dormant") && this.setState("engage"), !this.armored) {
				let n = this.state === "stun";
				if (this.poiseMax === 0 ? n || this._interruptTo("hitstun", t) : Number.isFinite(this.poiseMax) && (this.poise -= e.poise || 0, this._poiseT = 0, (this.poise <= 0 || e.knockdown) && this.state !== "stagger" && !n && this._interruptTo("stagger", t)), e.kb > 0 && Number.isFinite(this.mass) && this.mass > 0 && this._freezeT <= 0) {
					let t = Math.min(af, e.kb / this.mass) * (this.flier ? 1.5 : 1), n = Math.hypot(e.kbDirX || 0, e.kbDirZ || 0);
					t > 0 && n > 1e-6 && (this._kbDist = t, this._kbT = 0, this._kbX = e.kbDirX / n, this._kbZ = e.kbDirZ / n);
				}
			}
			this._writeFlash();
		}
	}
	die(e) {
		this.alive && (this.brain.cancel && this.brain.cancel(this, e), this.dropToken(e), this._freeAll(e), this.alive = !1, this.marks = 0, this._goneT = 0, this.submerged && (this.submerged = !1, this.sprite.visible = !0, this.released || (this.sprite.opacity = 1)), this.aggro = !1, this.target = null, this.tauntT = 0, this._clearStatus(), this.guarded = !1, this.armored = !1, this.exposed = !1, this.vuln = 1, this.hpFloor = 0, this._kbDist = 0, this._deathFx = !1, this._deathHover = this.hover, this._ghost = 0, this._ghostDir = 0, this.state = "dead", this.t = 0, this._enterN++, this.brain.die && this.brain.die(this, e), this.released && this.brain.die || this.pose("dead"), this._writeGlow(), this.kind === "slime" && e?.burst("gooPoof", this.position.x, this.position.y + .3, this.position.z, 12), this._writeFlash());
	}
	vanish() {
		this._forgetAll(), this.alive = !1, this.hp = 0, this.marks = 0, this.submerged = !1, this.aggro = !1, this.target = null, this.tauntT = 0, this._clearStatus(), this.dormant = !1, this.token = !1, this.guarded = !1, this.armored = !1, this.exposed = !1, this.vuln = 1, this.hpFloor = 0, this.hitFlash = 0, this._kbDist = 0, this._ghost = 0, this._ghostDir = 0, this._deathFx = !0, this.state = "dead", this.t = 0, this._enterN++, this.pose("dead"), this.sprite.opacity = 0, this.sprite.visible = !1, this._writeFlash(), this._writeGlow();
	}
	reset(e) {
		e ? this._freeAll(e) : this._forgetAll();
		let t = e ? e.groundAt(this.home.x, this.home.z) : this.position.y;
		this.position.set(this.home.x, t, this.home.z), this._grounded = !!e, this.hp = this.hpMax, this.poise = this.poiseMax, this.alive = !0, this.aggro = !1, this.target = null, this.tauntT = 0, this._clearStatus(), this.targetHold = 0, this.targetCheck = 0, this.playerHitAt = -Infinity, this.rushed = !1, this.dormant = !1, this.guarded = !1, this.armored = !1, this.exposed = !1, this.vuln = 1, this.hitFlash = 0, this.token = !1, this.blockedBy = null, this.marks = 0, this.released = !1, this._goneT = 0, this.submerged = !1, this.phase = +!!this.boss, this.hpFloor = 0, this.hover = this.def.hover ?? 0, this.lift = 0, this._poiseT = 0, this._tokenWait = 0, this._senseT = 0, this._farT = 0, this._calmT = 0, this._kbDist = 0, this._deathFx = !1, this._ghost = 0, this._ghostDir = 0, this._wander.has = !1, this._wander.pause = 0, this._clearStuck(), this._detourSide = 1, this._clearPath(), this._zoneT = 0, this.sprite.visible = !0, this.sprite.opacity = 1, this.sprite.bodyOpacity = 1, this.sprite.tint.setRGB(1, 1, 1), this.sprite.mesh.position.x = 0, this.facing.x = 0, this.facing.z = 1, this._enterInitial(), this._applyHover(), this._writeFlash(), this._writeGlow();
	}
	wake(e) {
		!this.alive || this.passive || this.boss || (this.dormant = !1, !(this.aggro || this.state === "return") && this._startNotice(e, !1, !0));
	}
	sleep() {
		if (!this.alive) {
			this.sprite.opacity = 0;
			return;
		}
		this.dormant = !0, !this.boss && (this.state = "dormant", this.t = 0, this._enterN++, this.lift = 0, this._applyHover(), this.anim("idle"));
	}
	sendHome(e) {
		!this.alive || this.boss || this.isAdd || this.passive || (this.brain.cancel && this.brain.cancel(this, e), this.dropToken(e), this._freeAll(e), this.aggro = !1, this.target = null, this.tauntT = 0, this._clearStatus(), this.armored = !1, this.exposed = !1, this.vuln = 1, this.guarded = !0, this.marks = 0, this._kbDist = 0, this._clearStuck(), this._clearPath(), this._farT = 0, this._zoneT = 0, this.setState("return"));
	}
	addMarks(e) {
		return !this.alive || !(e > 0) ? this.marks : (this.marks = Math.min(3, this.marks + Math.floor(e)), this._markT = 6, this.marks);
	}
	pose(e) {
		let t = this.sheet.poses[e] ?? this.sheet.poses.idle0 ?? 0, n = Math.max(0, g.indexOf(this.sprite.direction));
		this._poseName = e, (t !== this._poseCol || n !== this._poseRow || this.sprite.animation !== null) && (this._poseCol = t, this._poseRow = n, this.sprite.setFrame(t, n));
	}
	anim(e) {
		this._poseName = null, this._poseCol = -1, this.sprite.play(e);
	}
	face(e, t) {
		this.faceDir(e - this.position.x, t - this.position.z);
	}
	faceDir(e, t) {
		let n = Math.hypot(e, t);
		n < 1e-6 || (this.facing.x = e / n, this.facing.z = t / n, this._refreshRow());
	}
	setState(e) {
		this.state = e, this.t = 0, this._enterN++, e === "windup" && this._clearStuck();
	}
	after(e) {
		return this.t >= e / 60 - J;
	}
	get fr() {
		return Math.floor(this.t * 60 + J);
	}
	get entered() {
		return this.t === 0;
	}
	get serial() {
		return this._enterN;
	}
	setPhase(e, t) {
		this.alive && this.brain.jumpPhase && this.brain.jumpPhase(this, e, t);
	}
	midY() {
		let e = this.def.body;
		return this.position.y + (this.flier ? this.hover : 0) + (e[0] + e[1]) / 2;
	}
	canWindup(e) {
		return this.boss || e.onScreen(this.position.x, this.midY(), this.position.z);
	}
	takeToken(e) {
		return this.token || !this.def.token ? !0 : this._tokenWait > 0 ? !1 : e.requestToken(this) ? (this.token = !0, !0) : (this._tokenWait = Y(nf), !1);
	}
	dropToken(e) {
		this.token &&= (e?.releaseToken(this), !1);
	}
	newTag() {
		return this._tagN = (this._tagN + 1) % Id, this._tagBase + this._tagN;
	}
	hitSpec() {
		let e = this._hs[this._hsI];
		return this._hsI = (this._hsI + 1) % this._hs.length, e.shape = "circle", e.x = this.position.x, e.y = this.position.y, e.z = this.position.z, e.r = 1, e.rInner = 0, e.dirX = this.facing.x, e.dirZ = this.facing.z, e.halfAngle = 60, e.len = 1, e.width = 1, e.dy = .6, e.mv = 1, e.kb = 0, e.poise = 0, e.knockdown = !1, e.flat = 0, e.thin = !1, e.tag = 0, e.fromX = void 0, e.fromZ = void 0, e.chill = 0, e.slow = 0, e.freeze = 0, e.stun = 0, e.feel = null, e;
	}
	projSpec() {
		let e = this._ps[this._psI];
		return this._psI = (this._psI + 1) % this._ps.length, e.kind = "arrow", e.x = this.position.x, e.y = this.position.y + .9, e.z = this.position.z, e.dirX = this.facing.x, e.dirZ = this.facing.z, e.vy = 0, e.speed = 10, e.range = 10, e.radius = .2, e.mv = 1, e.kb = 0, e.poise = 0, e.pierce = !1, e.splash = null, e.arc = null, e;
	}
	mark(e, t, n) {
		let r = this._slots[e];
		return r < 0 ? (r = t.marker(n), this._slots[e] = r) : t.setMarker(r, n), r;
	}
	markProgress(e, t, n) {
		let r = this._slots[e];
		r < 0 || (this._slotSpec.progress = n, t.setMarker(r, this._slotSpec));
	}
	unmark(e, t) {
		let n = this._slots[e];
		n >= 0 && t.freeMarker(n), this._slots[e] = -1;
	}
	unmarkAll(e) {
		for (let t = 0; t < this._slots.length; t++) this.unmark(t, e);
	}
	markToFade(e, t, n) {
		let r = this._slots[e];
		if (this._slots[e] = -1, r < 0) return;
		let i = this._newHazard("fade");
		i.h = r, i.dur = Math.max(Y(1), n);
	}
	lockFlash(e) {
		return e < -1e-6 ? 0 : e < Y(5) - J ? 1 : .35;
	}
	markerSpec(e, t, n) {
		let r = this._ms;
		return r.shape = e, r.x = t, r.y = .03, r.z = n, r.r = 1, r.rInner = 0, r.dirX = this.facing.x, r.dirZ = this.facing.z, r.halfAngle = 60, r.len = 1, r.width = 1, r.w = 1, r.d = 1, r.progress = 0, r.style = "enemy", r.alpha = 1, r.flash = 0, r;
	}
	hazardCircle(e, t, n, r, i = 0, a = !1, o = null) {
		let s = this._newHazard("circle");
		return s.x = e, s.z = t, s.r = n, s.dur = r, s.delay = i, s.track = a, s.clamp = o, s.tag = this.newTag(), s;
	}
	hazardVisual(e, t, n, r) {
		let i = this.hazardCircle(e, t, n, r);
		return i.visualOnly = !0, i;
	}
	hazardRing(e, t, n, r, i, a, o = 0) {
		let s = this._newHazard("ring");
		return s.x = e, s.z = t, s.r = n, s.r0 = n, s.rMax = r, s.speed = i, s.width = a, s.delay = o, s.thin = !0, s.tag = this.newTag(), s;
	}
	hazardMagma(e, t, n, r, i, a) {
		let o = this._newHazard("magma");
		return o.x = e, o.z = t, o.r = n, o.dur = r, o.flat = i, o.tick = a, o.n = 0, o.tag = this.newTag(), o;
	}
	get hazardCount() {
		let e = 0;
		for (let t of this._hazards) t.on && e++;
		return e;
	}
	hazardList(e) {
		let t = [];
		for (let n of this._hazards) {
			if (!n.on || e && n.type !== e) continue;
			let r = n.type === "ring", i = r ? n.r0 + n.speed * n.t : n.r;
			t.push({
				type: n.type,
				x: n.x,
				z: n.z,
				r: i,
				rInner: r ? Math.max(0, i - n.width) : 0,
				delay: n.delay,
				t: n.t,
				dur: n.dur,
				mv: n.mv,
				kb: n.kb
			});
		}
		return t;
	}
	move(e, t, n) {
		let r = Math.hypot(e, t);
		if (r < 1e-9) return 1;
		let i = this.position;
		if (this.flier) {
			let a = i.x, o = i.z;
			return n.moveFly(this, e, t), Math.min(1, Math.hypot(i.x - a, i.z - o) / r);
		}
		let a = n.moveGround(this, e, t);
		return this.boss && this.arena && (a = this._keepInArena(r, a)), a;
	}
	walk(e, t, n, r, i, a = "walk", o = !0) {
		let s = n * r;
		if (s <= 0) return 1;
		let c = this.move(e * s, t * s, i);
		return o && this.faceDir(e, t), a && this.anim(a), c;
	}
	seek(e, t, n, r, i, a = "walk") {
		let o = this.position, s = e - o.x, c = t - o.z, l = Math.hypot(s, c);
		if (l < .001) return this._stuckT = 0, 1;
		s /= l, c /= l;
		let u = this.aggro ? i.player?.position : null;
		if (this._anchor(r, l, u ? u.x : e, u ? u.z : t), this._detourT > 0) {
			this._detourT -= r;
			let e = this.walk(this._detourX, this._detourZ, n, r, i, a);
			return e < .25 ? this._stuckT += r : this._detourT <= 0 && (this._stuckT = 0), e;
		}
		if (!this.flier && this._stuckT >= Y(sf) - J) return this._pickDetour(s, c, i), this.seek(e, t, n, r, i, a);
		let d = Math.min(n, l / r), f = this.walk(s, c, d, r, i, a);
		return f < .25 ? this._stuckT += r : this._stuckT = 0, f;
	}
	chase(e, t, n, r = "walk") {
		let i = this.chasePoint(n);
		return this.seek(i.x, i.z, e, t, n, r);
	}
	chasePoint(e) {
		let t = e.player.position, n = this.cp;
		n.x = t.x, n.z = t.z;
		let r = e.nav;
		if (this.flier || !r) return n;
		let i = this.position, a = e.frame, o = this._stuckT >= Y(sf) - J;
		if ((a >= this._navNext || a < this._navNext - gf || o) && (this._navNext = a + gf, this._navDirect = !o && Math.abs(this.tp.dy) <= .3 && r.lineClear(i.x, i.z, t.x, t.z, .3), this._navDirect && (this.unreachable = !1, this._pathFor === Ef && this._clearPath())), this._navDirect) return n;
		let s = a - this._pathAt;
		if (s < 0 && (s = Infinity), (this._pathFor !== Ef || s >= vf && (s >= _f || o || this._pathBad || Math.hypot(t.x - this._pathGX, t.z - this._pathGZ) > yf)) && r.spend()) {
			let e = r.findPath(i.x, i.z, t.x, t.z, this._reach(Cf), this._path);
			this._pathFor = Ef, this._pathAt = a, this._pathGX = t.x, this._pathGZ = t.z, this._pathI = 0, this._pathN = Math.max(0, e), this._pathBad = !1, this._pathCut = -1, this._pathExact = -1, this.unreachable = e < 0;
		}
		if (this._pathFor === Ef && this._pathN > 0) {
			let t = this._followPath(e) * 2;
			n.x = this._path[t], n.z = this._path[t + 1];
		}
		return n;
	}
	get stuck() {
		return this._stuckT >= Y(cf) - J;
	}
	get inReach() {
		return Math.abs(this.tp.dy) <= On;
	}
	canMelee(e) {
		if (!this.inReach) return !1;
		let t = e.nav;
		if (this.flier || !t) return !0;
		let n = e.frame;
		if (n >= this._meleeNext || n < this._meleeNext - gf) {
			this._meleeNext = n + gf;
			let r = e.player.position;
			this._meleeWay = t.lineClear(this.position.x, this.position.z, r.x, r.z, .3);
		}
		return this._meleeWay;
	}
	decayFlash(e) {
		this.hitFlash > 0 && (this.hitFlash = Math.max(0, this.hitFlash - e)), this._writeFlash();
	}
	resetSeek() {
		this._clearStuck();
	}
	endDetour() {
		this._detourT = 0;
	}
	freeRun(e, t, n, r, i = null) {
		let a = this.position, o = this.def.moveRadius, s = -t, c = e, l = r.groundAt(a.x, a.z), u = 0;
		this.runEnd = "max";
		for (let d = .25; d <= n + J; d += .25) {
			let n = a.x + e * d, f = a.z + t * d;
			if (i && (n < i.minX || n > i.maxX || f < i.minZ || f > i.maxZ)) {
				this.runEnd = "rect";
				break;
			}
			let p = r.groundAt(n, f);
			if (Math.abs(p - l) > .55 || !r.walkable(n, f) || !r.walkable(n + e * o, f + t * o) || !r.walkable(n + s * o, f + c * o) || !r.walkable(n - s * o, f - c * o)) {
				this.runEnd = "obstacle";
				break;
			}
			l = p, u = d;
		}
		return u;
	}
	bestAway(e, t, n, r, i = !1) {
		let a = i && !this.flier ? r.nav : null, o = this.position, s = r.groundAt(o.x, o.z), c = -Infinity, l = this.away;
		for (let i = 0; i < 8; i++) {
			let u = i * Math.PI / 4, d = Math.cos(u), f = Math.sin(u), p = o.x + d * n * .5, m = o.z + f * n * .5, h = o.x + d * n, g = o.z + f * n;
			if (!r.walkable(p, m) || !r.walkable(h, g)) continue;
			let _ = r.groundAt(p, m), ee = r.groundAt(h, g);
			if (Math.abs(_ - s) > .55 || Math.abs(ee - _) > .55 || a && !a.lineClear(o.x, o.z, h, g, 0, !0)) continue;
			let v = Math.hypot(h - e, g - t);
			v > c + 1e-6 && (c = v, l.x = d, l.z = f);
		}
		return c > -Infinity;
	}
	_enterInitial() {
		this.ai = this.brain.init ? this.brain.init(this) : {}, this.t = 0, this._enterN++, this.boss ? (this.state = "dormant", this.guarded = !0, this.pose("kneel")) : (this.state = "idle", this.anim("idle"));
	}
	_step(e, t) {
		for (let n = 0; n < 4; n++) {
			let n = this._enterN;
			switch (this.state) {
				case "dormant":
					this.dormant || this.setState("idle");
					break;
				case "idle":
					this._idle(e, t);
					break;
				case "notice":
					this._notice(t);
					break;
				case "engage":
					this._engage(e, t);
					break;
				case "windup":
				case "active":
				case "recover":
					this.brain.attack(this, e, t);
					break;
				case "hitstun":
					this.pose("hurt"), this.after(Kd) && this.setState("engage");
					break;
				case "stagger":
					this.pose("hurt"), this.after(this.kind === "boar" ? Jd : qd) && (this.poise = this.poiseMax, this.setState("engage"));
					break;
				case "stun":
					this._holding ? (this._freezeT <= 0 && this.pose("hurt"), this._holdT <= 0 && (this._holding = !1, this.setState(this.aggro ? "engage" : "idle"))) : this.brain.stun ? this.brain.stun(this, e, t) : this.after(Yd) && this.setState("engage");
					break;
				case "return": this._return(e, t);
			}
			if (this._enterN === n) break;
		}
	}
	_statusStep(e, t) {
		this._holdAsk && this._enterHold(t);
		let n = this.position;
		if (this._chillRest > 0 && (this._chillRest = Math.max(0, this._chillRest - e)), this._chillT > 0 && (this._chillT -= e, this.boss && (this._chillSpent += e), this._chillT <= 0 ? (this._chillT = 0, this._chillSlow = 0, this.boss && (this._chillSpent = 0, this._chillRest = Uf)) : this._freezeT <= 0 && (this._frostT -= e, this._frostT <= 0 && (this._frostT += qf, t.burst("healGlow", n.x, this.midY() - .2, n.z, 2, Jf)))), this._freezeT > 0 && (this._freezeT -= e, this._frostT -= e, this._frostT <= 0 && this._freezeT > 0 && (this._frostT += Rf, t.burst("victorySparkle", n.x, this.midY(), n.z, 1, Xf)), this._freezeT <= 0)) {
			this._freezeT = 0;
			let e = this.midY();
			t.burst("splash", n.x, e, n.z, 12, Zf), t.burst("hitSpark", n.x, e, n.z, 8, Qf), t.sfx("guard", n.x, n.z, {
				volume: .55,
				pitch: 1.35
			});
		}
		return this._holdT > 0 && (this._holdT = Math.max(0, this._holdT - e)), this._chillT > 0 && this._freezeT <= 0 ? e * (1 - this._chillSlow) : e;
	}
	_enterHold(e) {
		let t = this._holdAsk;
		this._holdAsk = "";
		let n = this.position;
		if (t === "freeze") {
			let t = this.midY();
			e.burst("magicBurst", n.x, t, n.z, 10, Yf), e.sfx("guard", n.x, n.z, {
				volume: .5,
				pitch: 1.6
			});
		}
		this.passive || this.boss || this._holdT <= 0 || this.state === "return" || (t === "freeze" && (this._kbDist = 0), !(this._holding && this.state === "stun") && (this.brain.cancel && this.brain.cancel(this, e), this.unmarkAll(e), this.dropToken(e), this.armored = !1, this.lift = 0, this._holding = !0, this.setState("stun"), this._freezeT <= 0 && this.pose("hurt")));
	}
	_idle(e, t) {
		if (this._calmT > 0 && this.tp.d < 3.5 && !this.inReach && (this._calmT = Math.max(this._calmT, Y(of) + e)), !this.passive && !t.ambient && this._senseTick(e) && this._shouldAggro(t)) {
			this._startNotice(t, !0, !0);
			return;
		}
		this.brain.idle ? this.brain.idle(this, e, t) : this.wander(e, t);
	}
	_notice(e) {
		let t = e.player.position;
		this.face(t.x, t.z), this.entered && !this.brain.idle && this.anim("idle"), this.after(Gd) && this.setState("engage");
	}
	_engage(e, t) {
		if (!t.player.alive) {
			this.isAdd ? this.anim("idle") : this.sendHome(t);
			return;
		}
		if (t.player.sealed && !this.isAdd) {
			this._calmT = hf, this.sendHome(t);
			return;
		}
		if (this._leashBroken(e, t)) {
			this.sendHome(t);
			return;
		}
		if (this.brain.engage(this, e, t), this.state === "engage" && (this.stuck || this.unreachable) && !this.isAdd) {
			if (this.swarm) {
				this.stuck && this._clearStuck();
				return;
			}
			this._calmT = hf, this.sendHome(t);
		}
	}
	_return(e, t) {
		this.guarded = !0, this.hp = Math.min(this.hpMax, this.hp + .2 * this.hpMax * e);
		let n = this.position;
		if (Math.hypot(this.home.x - n.x, this.home.z - n.z) < mf) {
			this.hp = this.hpMax, this.poise = this.poiseMax, this.guarded = !1, this._clearStuck(), this._clearPath(), this._wander.has = !1, this._wander.pause = Y(60), this.setState("idle"), this.anim("idle");
			return;
		}
		if (this._ghostDir > 0) {
			this.anim("idle"), this._ghost = Math.min(1, this._ghost + e / Y(pf)), this.sprite.opacity = 1 - this._ghost, this._ghost >= 1 && this._snapHome(t);
			return;
		}
		let r = this.home.x, i = this.home.z, a = t.nav, o = !!a && !this.flier;
		if (o) {
			let e = t.frame, o = e - this._pathAt;
			if (o < 0 && (o = Infinity), (this._pathFor !== Df || o >= _f && this._stuckT >= Y(sf) - J || o >= vf && (this._pathBad || this._pathEnded(this.home.x, this.home.z))) && a.spend()) {
				let t = a.findPath(n.x, n.z, this.home.x, this.home.z, this._reach(wf), this._path);
				this._pathFor = Df, this._pathAt = e, this._pathI = 0, this._pathN = Math.max(0, t), this._pathBad = !1, this._pathCut = -1, this._pathExact = -1, this._homeLost = t < 0;
			}
			if (this._pathFor === Df && this._pathN > 0) {
				let e = this._followPath(t) * 2;
				r = this._path[e], i = this._path[e + 1];
			}
		}
		this.seek(r, i, this.def.speed * 1.5, e, t, "run"), this.flier && (this.hover += ((this.def.hover ?? 0) - this.hover) * te(6, e));
		let s = o && !this._homeLost ? this.stuck : this._stuckT >= Y(sf);
		this.t >= Y(ff) && (s || this.t >= 30) && (t.onScreen(n.x, this.midY(), n.z) || t.onScreen(this.home.x, t.groundAt(this.home.x, this.home.z) + 1, this.home.z) ? this._ghostDir = 1 : this._snapHome(t));
	}
	_snapHome(e) {
		this.position.set(this.home.x, e.groundAt(this.home.x, this.home.z), this.home.z), this._grounded = !0, this._clearStuck(), this._clearPath(), this._ghostDir > 0 && (this._ghostDir = -1);
	}
	_fadeBackIn(e) {
		this._ghost = Math.max(0, this._ghost - e / Y(pf)), this.sprite.opacity = 1 - this._ghost, this._ghost <= 0 && (this._ghostDir = 0);
	}
	wander(e, t, n = .4) {
		let r = this._wander;
		if (this.def.speed <= 0) {
			this.anim("idle");
			return;
		}
		if (r.pause > 0) {
			r.pause -= e, this.anim("idle");
			return;
		}
		if (!r.has) {
			let e = this.rng.next() * Math.PI * 2, t = Math.sqrt(this.rng.next()) * this.homeRadius;
			r.x = this.home.x + Math.cos(e) * t, r.z = this.home.z + Math.sin(e) * t, r.has = !0, this._clearStuck();
		}
		let i = this.position, a = this.seek(r.x, r.z, this.def.speed * n, e, t, "walk");
		(Math.hypot(r.x - i.x, r.z - i.z) < .25 || a < .25 && this._stuckT >= Y(20) || this.stuck) && (r.has = !1, r.pause = Y(this.rng.int(90, 240)), this._clearStuck());
	}
	_startNotice(e, t, n) {
		this.aggro = !0, this.dormant = !1, this._farT = 0, this._zoneT = 0, this._clearStuck(), this._clearPath(), this.lift = 0, n && !this._holding && this.setState("notice"), e.alert(this), e.sfx("enemyAlert", this.position.x, this.position.z), t && e.wakeGroup(this);
	}
	_senseTick(e) {
		return this._senseT += e, this._senseT < Y(of) - J ? !1 : (this._senseT = 0, !0);
	}
	_shouldAggro(e) {
		let t = e.player;
		if (!t.alive || t.sealed && !this.isAdd) return !1;
		if (this.swarm && !this.rushed) return this._calmT <= 0;
		let n = this.tp;
		return Math.abs(n.dy) >= 1.5 ? !1 : n.d < 3 && (this._calmT <= 0 || this.inReach) ? !0 : this._calmT > 0 || n.d >= this.def.aggro || tp(this.zoneRect, t.position.x, t.position.z) ? !1 : e.los(this.position.x, this.position.z, t.position.x, t.position.z);
	}
	_leashBroken(e, t) {
		if (this.isAdd || this.boss || this.passive || this.swarm) return !1;
		let n = this.position, r = this.def.leash + this.homeRadius;
		if (Math.hypot(n.x - this.home.x, n.z - this.home.z) > r) return !0;
		let i = this.zoneRect;
		if (tp(i, n.x, n.z)) return !0;
		let a = t.player.position;
		return Math.hypot(a.x - this.home.x, a.z - this.home.z) > r + 6 ? this._farT += e : this._farT = 0, tp(i, a.x, a.z) ? this._zoneT += e : this._zoneT = 0, this._farT >= 2.999999 || this._zoneT >= .999999;
	}
	_interruptTo(e, t) {
		this.brain.cancel && this.brain.cancel(this, t), this.unmarkAll(t), this.dropToken(t), this.armored = !1, this.lift = 0, this.setState(e), this.pose("hurt");
	}
	_sense(e) {
		let t = e.player.position, n = this.position, r = t.x - n.x, i = t.z - n.z, a = Math.hypot(r, i), o = this.tp;
		o.d = a, a > 1e-6 && (o.dx = r / a, o.dz = i / a), o.dy = t.y - n.y;
	}
	_followGround(e, t) {
		let n = this.position, r = t.groundAt(n.x, n.z);
		this._grounded ? n.y += (r - n.y) * te(18, e) : (n.y = r, this._grounded = !0);
	}
	_knockback(e, t) {
		if (this._kbDist <= 0) return;
		if (this.armored) {
			this._kbDist = 0;
			return;
		}
		let n = Y(rf), r = this._kbT, i = Math.min(n, r + e), a = 1 - (1 - r / n) ** 2, o = 1 - (1 - i / n) ** 2, s = this._kbDist * (o - a);
		s > 0 && this.move(this._kbX * s, this._kbZ * s, t), this._kbT = i, i >= n - J && (this._kbDist = 0);
	}
	_updateDead(e, t) {
		this.t += e, this.hitFlash > 0 && (this.hitFlash = Math.max(0, this.hitFlash - e));
		let n = this.sprite;
		if (this.brain.dead && t && this.brain.dead(this, e, t)) {
			this._writeFlash(), this._writeGlow();
			return;
		}
		if (this.released) {
			this._goneT += e, n.opacity = Math.min(n.opacity, 1 - Math.min(1, this._goneT / Y(Zd))), this._writeFlash();
			return;
		}
		if (this.boss) {
			let e = $d;
			this.t < Y(Qd) ? this._setFlash(e[0], e[1], e[2], e[3]) : this._setFlash(0, 0, 0, 0), n.opacity = Math.min(n.opacity, 1 - Math.min(1, this.t / Y(Zd)));
			return;
		}
		let r = this.t;
		if (this.flier) {
			let e = Math.min(1, this.t / Y(ef));
			this.hover = (this._deathHover ?? 0) * (1 - e * e), this._applyHover(), r = this.t - Y(ef);
		}
		r > 0 && (n.opacity = 1 - Math.min(1, r / Y(Xd))), n.opacity <= .001 && !this._deathFx && (this._deathFx = !0, this.kind !== "slime" && t && t.burst("deathPoof", this.position.x, this.position.y + .4, this.position.z, 8)), this._writeFlash();
	}
	_clearStuck() {
		this._stuckT = 0, this._detourT = 0, this._anchorT = 0;
	}
	_anchor(e, t, n, r) {
		let i = this.position;
		this._anchorT > 0 && Math.hypot(n - this._anchorTX, r - this._anchorTZ) > df && (this._anchorT = 0), this._anchorT === 0 && (this._anchorX = i.x, this._anchorZ = i.z, this._anchorTX = n, this._anchorTZ = r), this._anchorT += e, !(this._anchorT < uf) && (Math.hypot(i.x - this._anchorX, i.z - this._anchorZ) < 1 && t > 1.5 && (this._stuckT = Math.max(this._stuckT, Y(cf))), this._anchorT = 0);
	}
	_pickDetour(e, t, n) {
		let r = this.position, i = n.groundAt(r.x, r.z), a = -Infinity, o = -e, s = -t;
		this._detourSide = -(this._detourSide || 1);
		for (let c = 0; c < $f.length; c++) {
			let l = $f[c] * (c < 4 ? this._detourSide : 1), u = Math.cos(l), d = Math.sin(l), f = e * u - t * d, p = e * d + t * u, m = r.x + f * .7, h = r.z + p * .7, g = r.x + f * 1.4, _ = r.z + p * 1.4;
			if (!n.walkable(m, h) || !n.walkable(g, _)) continue;
			let ee = n.groundAt(m, h);
			if (Math.abs(ee - i) > .55 || Math.abs(n.groundAt(g, _) - ee) > .55) continue;
			let v = f * e + p * t;
			v > a + 1e-6 && (a = v, o = f, s = p);
		}
		this._detourX = o, this._detourZ = s, this._detourT = Y(lf);
	}
	_clearPath() {
		this._pathN = 0, this._pathI = 0, this._pathFor = 0, this._pathAt = -Infinity, this._homeLost = !1, this._pathBad = !1, this._pathCut = -1, this._pathExact = -1, this._navDirect = !0, this._navNext = 0, this.unreachable = !1;
	}
	_followPath(e) {
		let t = this.position, n = this._path, r = this._pathN, i = e.nav, a = this._pathI;
		for (this._pathCut === a && a > 0 && this._stuckT >= Y(Sf) - J && (a--, this._pathExact = a, this._pathCut = -1); a < r - 1;) {
			let e = n[a * 2], r = n[a * 2 + 1], o = e - t.x, s = r - t.z, c = o * o + s * s;
			if (a === this._pathExact) {
				if (c > xf * xf) break;
			} else if (c > bf * bf || i.cellAt(t.x, t.z) !== i.cellAt(e, r) && !i.lineClear(t.x, t.z, n[a * 2 + 2], n[a * 2 + 3], 0, !0)) break;
			this._pathCut = c > xf * xf ? a + 1 : -1, a++;
		}
		return e.frame % gf === this._navPhase && (a < r - 1 && a !== this._pathExact && i.lineClear(t.x, t.z, n[a * 2 + 2], n[a * 2 + 3], 0, !0) ? (this._pathCut = a + 1, a++) : i.lineClear(t.x, t.z, n[a * 2], n[a * 2 + 1], a === r - 1 ? .3 : 0) || (this._pathBad = !0)), this._pathI = a, a;
	}
	_pathEnded(e, t) {
		let n = this._pathN;
		if (n === 0 || this._pathI < n - 1) return !1;
		let r = this._path, i = r[n * 2 - 2], a = r[n * 2 - 1], o = this.position;
		return Math.hypot(i - o.x, a - o.z) < bf && Math.hypot(i - e, a - t) > bf;
	}
	_reach(e) {
		if (this.swarm && e === Cf) return Tf;
		let t = Number.isFinite(this.def.leash) ? this.def.leash : 12;
		return Math.max(e[0], e[1] * (t + this.homeRadius));
	}
	_keepInArena(e, t) {
		let n = this.arena.rect, r = this.def.moveRadius + .1, i = this.position, a = Math.min(n.maxX - r, Math.max(n.minX + r, i.x)), o = Math.min(n.maxZ - r, Math.max(n.minZ + r, i.z));
		return a === i.x && o === i.z ? t : (i.x = a, i.z = o, this.blockedBy = "arena", Math.min(t, .2));
	}
	_newHazard(e) {
		let t = null;
		for (let e of this._hazards) if (!e.on) {
			t = e;
			break;
		}
		return t || (t = {}, this._hazards.push(t)), t.on = !0, t.type = e, t.h = -1, t.t = 0, t.delay = 0, t.dur = 1, t.x = this.position.x, t.z = this.position.z, t.r = 1, t.mv = 1, t.kb = 0, t.knockdown = !1, t.flat = 0, t.thin = !1, t.track = !1, t.clamp = null, t.visualOnly = !1, t.resolved = !1, t.started = !1, t.burst = null, t.burstN = 0, t.sfx = null, t.tag = 0, t;
	}
	_updateHazards(e, t) {
		let n = this._hazards;
		for (let r = 0; r < n.length; r++) {
			let i = n[r];
			if (i.on) {
				if (i.delay > 0) {
					if (i.delay -= e, i.delay > J) continue;
					i.delay = 0;
				}
				switch (i.type) {
					case "circle":
						this._hzCircle(i, e, t);
						break;
					case "ring":
						this._hzRing(i, e, t);
						break;
					case "magma":
						this._hzMagma(i, e, t);
						break;
					case "fade":
						this._hzFade(i, e, t);
						break;
					default: this._killHazard(i, t);
				}
			}
		}
	}
	_hzCircle(e, t, n) {
		if (!e.started) {
			if (e.started = !0, e.track) {
				let t = n.player.position;
				e.x += t.x, e.z += t.z;
			}
			e.clamp && (e.x = Math.min(e.clamp.maxX, Math.max(e.clamp.minX, e.x)), e.z = Math.min(e.clamp.maxZ, Math.max(e.clamp.minZ, e.z)));
			let t = this.markerSpec("circle", e.x, e.z);
			t.r = e.r, e.h = n.marker(t);
		}
		let r = Math.min(1, e.t / e.dur);
		if (e.h >= 0 && (this._slotSpec.progress = r, n.setMarker(e.h, this._slotSpec)), !e.resolved && e.t >= e.dur - J && (e.resolved = !0, !e.visualOnly)) {
			let t = this.hitSpec();
			t.shape = "circle", t.x = e.x, t.z = e.z, t.y = n.groundAt(e.x, e.z), t.r = e.r, t.mv = e.mv, t.kb = e.kb, t.knockdown = e.knockdown, t.tag = e.tag, n.hitbox(this, t);
			let r = t.y;
			e.burst && n.burst(e.burst, e.x, r + .2, e.z, e.burstN || 10), e.sfx && n.sfx(e.sfx, e.x, e.z);
		}
		e.t += t, e.t >= e.dur + Y(5) - J && this._killHazard(e, n);
	}
	_hzRing(e, t, n) {
		if (!e.started) {
			e.started = !0;
			let t = this.markerSpec("ring", e.x, e.z);
			t.r = e.r, t.rInner = Math.max(0, e.r - e.width), t.progress = 1, e.h = n.marker(t);
		}
		let r = e.r0 + e.speed * e.t, i = Math.max(0, r - e.width);
		if (r > e.rMax + J) {
			this._killHazard(e, n);
			return;
		}
		if (e.h >= 0) {
			let t = this.markerSpec("ring", e.x, e.z);
			t.r = r, t.rInner = i, t.progress = 1, n.setMarker(e.h, t);
		}
		let a = this.hitSpec();
		a.shape = "ring", a.x = e.x, a.z = e.z, a.y = n.groundAt(e.x, e.z), a.r = r, a.rInner = i, a.mv = e.mv, a.kb = e.kb, a.thin = e.thin, a.knockdown = e.knockdown, a.tag = e.tag, n.hitbox(this, a), e.t += t;
	}
	_hzMagma(e, t, n) {
		if (!e.started) {
			e.started = !0;
			let t = this.markerSpec("circle", e.x, e.z);
			t.r = e.r, t.progress = 1, t.style = "magma", e.h = n.marker(t);
		}
		e.t += t;
		let r = Math.floor((e.t + J) / e.tick);
		if (r > e.n && e.t < e.dur + J) {
			e.n = r;
			let t = this.hitSpec();
			t.shape = "circle", t.x = e.x, t.z = e.z, t.y = n.groundAt(e.x, e.z), t.r = e.r, t.mv = 0, t.kb = 0, t.flat = e.flat, t.tag = this.newTag(), n.hitbox(this, t);
		}
		e.t >= e.dur - J && this._killHazard(e, n);
	}
	_hzFade(e, t, n) {
		e.t += t;
		let r = 1 - Math.min(1, e.t / e.dur);
		e.h >= 0 && (this._fadeSpec.alpha = r, n.setMarker(e.h, this._fadeSpec)), e.t >= e.dur - J && this._killHazard(e, n);
	}
	_killHazard(e, t) {
		e.h >= 0 && t && t.freeMarker(e.h), e.h = -1, e.on = !1;
	}
	_freeAll(e) {
		this.unmarkAll(e);
		for (let t of this._hazards) t.on && this._killHazard(t, e);
	}
	_forgetAll() {
		this._slots.fill(-1);
		for (let e of this._hazards) e.h = -1, e.on = !1;
	}
	_refreshRow() {
		let e = this.sprite, t = ve.directionFromVector(this.facing.x, this.facing.z, b.uCameraYaw.value, e.direction);
		t !== e.direction && (this._poseName === null ? e.setDirection(t) : (e.direction = t, this.pose(this._poseName)));
	}
	_applyHover() {
		let e = (this.flier ? this.hover : 0) + this.lift;
		this.sprite.mesh.position.y = e, this.sprite.shadowProxy.position.y = e;
	}
	_writeFlash() {
		let e = this.hitFlash;
		if (e > 0) {
			let t = e > kf + J;
			this.boss ? (this._setFlash(0, 0, 0, 0), this._setHighlight(2.2, 2.2, 2.2, t ? .6 : .3)) : (this._setFlash(2.2, 2.2, 2.2, t ? .85 : .4), this._setHighlight(0, 0, 0, 0));
			return;
		}
		if (this._freezeT > 0 && this.alive) {
			let e = this.iceShell ? If : Pf, t = this.iceShell ? Lf : Ff;
			this._setFlash(e.r, e.g, e.b, e.a), this._setHighlight(t.r, t.g, t.b, t.a);
			return;
		}
		let t = this._chillT > 0 && this.alive, n = this.boss ? Wf : 1;
		if (t ? this._setFlash(Mf.r, Mf.g, Mf.b, Mf.a * n) : (this.alive || !this.boss) && this._setFlash(0, 0, 0, 0), this.state === "windup" && this.alive) {
			let e = Af;
			this._setHighlight(e.r, e.g, e.b, e.lo + (e.hi - e.lo) * (.5 - .5 * Math.cos(2 * Math.PI * 8 * this.t)));
		} else if (t) {
			let e = Nf;
			this._setHighlight(e.r, e.g, e.b, (e.lo + (e.hi - e.lo) * (.5 - .5 * Math.cos(2 * Math.PI * 1.5 * this._clock))) * n);
		} else if (this.elite && this.alive) {
			let e = jf;
			this._setHighlight(e.r, e.g, e.b, e.lo + (e.hi - e.lo) * (.5 - .5 * Math.cos(2 * Math.PI * this._clock)));
		} else this._setHighlight(0, 0, 0, 0);
	}
	_setFlash(e, t, n, r) {
		let i = this._flash;
		(i[0] !== e || i[1] !== t || i[2] !== n || i[3] !== r) && (i[0] = e, i[1] = t, i[2] = n, i[3] = r, this.sprite.setFlash(e, t, n, r));
	}
	_setHighlight(e, t, n, r) {
		let i = this._highlight;
		(i[0] !== e || i[1] !== t || i[2] !== n || i[3] !== r) && (i[0] = e, i[1] = t, i[2] = n, i[3] = r, this.sprite.setHighlight(e, t, n, r));
	}
	_writeGlow() {
		let e = this._glowOut;
		e[0] = 0, e[1] = 0, e[2] = 0, e[3] = 0, this.brain.glow && this.brain.glow(this, e);
		let t = this._glow;
		(t[0] !== e[0] || t[1] !== e[1] || t[2] !== e[2] || t[3] !== e[3]) && (t[0] = e[0], t[1] = e[1], t[2] = e[2], t[3] = e[3], this.sprite.setGlow(e[0], e[1], e[2], e[3]));
	}
};
function tp(e, t, n) {
	return !!e && (t < e.minX - Of || t > e.maxX + Of || n < e.minZ - Of || n > e.maxZ + Of);
}
function np(e) {
	return typeof e == "number" && e > 0 ? Math.min(Kf, e) : 0;
}
var rp = 2.6;
function ip(e) {
	if (!Array.isArray(e) || e.length < 2 || e.length > 3) return null;
	let [t, n, r] = e;
	return !Number.isFinite(t) || !Number.isFinite(n) ? null : {
		x: t,
		z: n,
		r: Number.isFinite(r) ? Math.min(12, Math.max(.5, r)) : rp
	};
}
function ap(e) {
	return new ep(e);
}
//#endregion
//#region src/game/combat/defs/brutes.js
var op = {
	drakeborn: {
		name: "Drakeborn Ravager",
		hp: 250,
		atk: 16,
		def: 7,
		poise: 110,
		mass: 3.5,
		speed: 2.5,
		chargeSpeed: 9.5,
		aggro: 9,
		leash: 14,
		radius: .7,
		moveRadius: .5,
		body: [0, 2.9],
		xp: 40,
		gold: [12, 24],
		drops: {
			heart: .22,
			mana: .12,
			draught: .05
		},
		token: {
			type: "melee",
			cost: 1
		},
		flier: !1,
		hover: 0,
		passive: !1,
		boss: !1,
		labelY: 3.8
	},
	ashhound: {
		name: "Ashen Hellhound",
		hp: 290,
		atk: 16,
		def: 4,
		poise: 40,
		mass: 1.8,
		speed: 4.4,
		chargeSpeed: 10,
		aggro: 10,
		leash: 14,
		radius: .55,
		moveRadius: .4,
		body: [0, 1.4],
		xp: 26,
		gold: [6, 14],
		drops: {
			heart: .16,
			mana: .08,
			draught: .03
		},
		token: {
			type: "melee",
			cost: 1
		},
		flier: !1,
		hover: 0,
		passive: !1,
		boss: !1,
		labelY: 2.4
	},
	wyrmcaller: {
		name: "Wyrmcult Pyromancer",
		hp: 125,
		atk: 18,
		def: 2,
		poise: 25,
		mass: 1,
		speed: 2.5,
		aggro: 11,
		leash: 14,
		radius: .4,
		moveRadius: .3,
		body: [0, 2.3],
		xp: 30,
		gold: [8, 16],
		drops: {
			heart: .12,
			mana: .3,
			draught: .04
		},
		token: {
			type: "ranged",
			cost: 1
		},
		flier: !1,
		hover: 0,
		passive: !1,
		boss: !1,
		labelY: 3
	}
}, sp = {
	kobold: {
		name: "Scalekin Skirmisher",
		hp: 150,
		atk: 14,
		def: 2,
		poise: 14,
		mass: .7,
		speed: 3.8,
		strafeSpeed: 2.6,
		aggro: 10,
		leash: 14,
		radius: .32,
		moveRadius: .26,
		body: [0, 1],
		xp: 9,
		gold: [1, 4],
		drops: {
			heart: .06,
			mana: .06,
			draught: 0
		},
		token: {
			type: "melee",
			cost: .75
		},
		flier: !1,
		hover: 0,
		passive: !1,
		boss: !1,
		labelY: 1.45
	},
	whelp: {
		name: "Ashwing Whelp",
		hp: 160,
		atk: 14,
		def: 3,
		poise: 0,
		mass: .9,
		speed: 3.5,
		aggro: 10,
		leash: 14,
		radius: .42,
		moveRadius: .32,
		body: [0, .95],
		xp: 10,
		gold: [1, 5],
		drops: {
			heart: .07,
			mana: .05,
			draught: 0
		},
		token: {
			type: "melee",
			cost: .75
		},
		flier: !1,
		hover: 0,
		passive: !1,
		boss: !1,
		labelY: 1.5
	},
	emberimp: {
		name: "Ember Imp",
		hp: 100,
		atk: 12,
		def: 0,
		poise: 0,
		mass: .5,
		speed: 4.6,
		aggro: 11,
		leash: 14,
		radius: .32,
		moveRadius: .28,
		body: [-.4, .45],
		xp: 9,
		gold: [1, 4],
		drops: {
			heart: .05,
			mana: .09,
			draught: 0
		},
		token: {
			type: "ranged",
			cost: 1
		},
		flier: !0,
		hover: 1.6,
		passive: !1,
		boss: !1,
		labelY: 2.65
	}
}, cp = { dragon: {
	name: "Vorthrax",
	epithet: "The Ashen Tyrant",
	hp: 8e3,
	atk: 34,
	def: 12,
	poise: 1800,
	mass: Infinity,
	speed: 2.2,
	phaseSpeeds: [
		2.2,
		2.6,
		3
	],
	phases: [.65, .3],
	aggro: 0,
	leash: Infinity,
	radius: 2.6,
	moveRadius: 1.6,
	body: [0, 5],
	xp: 1200,
	gold: [500, 500],
	drops: {
		heart: 0,
		mana: 0,
		draught: 0
	},
	token: null,
	flier: !1,
	hover: 0,
	passive: !1,
	boss: !0,
	labelY: 7.5,
	adds: "whelp",
	introOnSpawn: !0
} }, lp = {
	slime: {
		name: "Moss Slime",
		hp: 26,
		atk: 8,
		def: 0,
		poise: 0,
		mass: .8,
		speed: 2.2,
		aggro: 6,
		leash: 8,
		radius: .4,
		moveRadius: .3,
		body: [0, .9],
		xp: 6,
		gold: [1, 3],
		drops: {
			heart: .1,
			mana: .08,
			draught: 0
		},
		token: {
			type: "melee",
			cost: 1
		},
		flier: !1,
		hover: 0,
		passive: !1,
		boss: !1,
		labelY: 1.3
	},
	goblin: {
		name: "Bramble Goblin",
		hp: 48,
		atk: 11,
		def: 2,
		poise: 15,
		mass: 1,
		speed: 3,
		strafeSpeed: 2.5,
		aggro: 8,
		leash: 12,
		radius: .35,
		moveRadius: .3,
		body: [0, 1.7],
		xp: 12,
		gold: [3, 8],
		drops: {
			heart: .12,
			mana: .06,
			draught: .02
		},
		token: {
			type: "melee",
			cost: 1
		},
		flier: !1,
		hover: 0,
		passive: !1,
		boss: !1,
		labelY: 2.3
	},
	archer: {
		name: "Thorn Archer",
		hp: 34,
		atk: 10,
		def: 1,
		poise: 10,
		mass: 1,
		speed: 3,
		aggro: 11,
		leash: 14,
		radius: .35,
		moveRadius: .3,
		body: [0, 1.7],
		xp: 12,
		gold: [3, 8],
		drops: {
			heart: .1,
			mana: .1,
			draught: .02
		},
		token: {
			type: "ranged",
			cost: 1
		},
		flier: !1,
		hover: 0,
		passive: !1,
		boss: !1,
		labelY: 2.3
	},
	shaman: {
		name: "Hex Shaman",
		hp: 40,
		atk: 14,
		def: 2,
		poise: 10,
		mass: 1,
		speed: 2.6,
		aggro: 10,
		leash: 14,
		radius: .35,
		moveRadius: .3,
		body: [0, 1.7],
		xp: 18,
		gold: [5, 12],
		drops: {
			heart: .08,
			mana: .3,
			draught: .03
		},
		token: {
			type: "ranged",
			cost: 1
		},
		flier: !1,
		hover: 0,
		passive: !1,
		boss: !1,
		labelY: 2.3
	},
	bat: {
		name: "Cinder Bat",
		hp: 24,
		atk: 8,
		def: 0,
		poise: 0,
		mass: .6,
		speed: 4.5,
		aggro: 9,
		leash: 12,
		radius: .35,
		moveRadius: .3,
		body: [-.45, .45],
		xp: 8,
		gold: [1, 4],
		drops: {
			heart: .06,
			mana: .08,
			draught: 0
		},
		token: {
			type: "melee",
			cost: 1
		},
		flier: !0,
		hover: 1.3,
		passive: !1,
		boss: !1,
		labelY: 2.5
	},
	boar: {
		name: "Ironhide Boar",
		hp: 120,
		atk: 20,
		def: 6,
		poise: 60,
		mass: 3,
		speed: 2.4,
		chargeSpeed: 10,
		aggro: 9,
		leash: 12,
		radius: .6,
		moveRadius: .45,
		body: [0, 1.3],
		xp: 30,
		gold: [10, 20],
		drops: {
			heart: .3,
			mana: .1,
			draught: .05
		},
		token: {
			type: "melee",
			cost: 2
		},
		flier: !1,
		hover: 0,
		passive: !1,
		boss: !1,
		labelY: 1.9
	},
	dummy: {
		name: "Straw Dummy",
		hp: 9999,
		atk: 0,
		def: 0,
		poise: Infinity,
		mass: Infinity,
		speed: 0,
		aggro: 0,
		leash: 0,
		radius: .4,
		moveRadius: .35,
		body: [0, 1.5],
		xp: 0,
		gold: [0, 0],
		drops: {
			heart: 0,
			mana: 0,
			draught: 0
		},
		token: null,
		flier: !1,
		hover: 0,
		passive: !0,
		boss: !1,
		labelY: 1.9
	},
	golem: {
		name: "Cinderheart",
		epithet: "The Last Fire of the Pass",
		hp: 5200,
		atk: 22,
		def: 8,
		poise: 250,
		mass: Infinity,
		speed: 1.6,
		phaseSpeeds: [
			1.6,
			2,
			2.4
		],
		phases: [.7, .35],
		aggro: 0,
		leash: Infinity,
		radius: 1.2,
		moveRadius: .6,
		body: [0, 3.6],
		xp: 400,
		gold: [150, 150],
		drops: {
			heart: 0,
			mana: 0,
			draught: 0
		},
		token: null,
		flier: !1,
		hover: 0,
		passive: !1,
		boss: !0,
		labelY: 4.4,
		adds: "bat"
	},
	...op,
	...sp,
	...cp
};
function up(e) {
	for (let [t, n] of Object.entries(e)) {
		if (Object.hasOwn(lp, t)) throw Error(`registerEnemyDefs: the enemy kind "${t}" is defined twice`);
		lp[t] = n;
	}
}
function dp(e) {
	if (Array.isArray(e)) return Object.freeze(e.map(dp));
	if (e && typeof e == "object") {
		let t = {};
		for (let [n, r] of Object.entries(e)) t[n] = dp(r);
		return Object.freeze(t);
	}
	return e;
}
function fp(e, t = 1, n = !1) {
	let r = lp[e];
	if (!r) throw Error(`scaledDef: unknown enemy kind "${e}"`);
	let i = Math.max(1, Math.min(10, Math.round(Number(t) || 1))), a = r.boss ? 0 : i - 1, o = !!n, s = (e) => Number.isFinite(e) ? Math.round(e) : e;
	return dp({
		...r,
		kind: e,
		level: i,
		elite: o,
		hp: s(r.hp * (1 + .2 * a) * (o ? 1.8 : 1)),
		atk: s(r.atk * (1 + .12 * a) * (o ? 1.25 : 1)),
		poise: o ? s(r.poise * 1.5) : r.poise,
		xp: s(r.xp * (1 + .25 * a) * (o ? 2.5 : 1)),
		gold: r.gold.map((e) => s(e * (1 + .2 * a) * (o ? 3 : 1))),
		guaranteedHeart: o
	});
}
//#endregion
//#region src/game/combat/bindings.js
var pp = Object.freeze({
	attack: ["KeyJ", "Mouse0"],
	dodge: ["KeyK", "Mouse2"],
	skill1: ["KeyU", "Digit1"],
	skill2: ["KeyI", "Digit2"],
	skill3: ["KeyO", "Digit3"],
	draught: ["KeyC", "Digit4"],
	lock: ["KeyL", "Mouse1"]
}), X = Object.freeze([
	"dodge",
	"skill1",
	"skill2",
	"skill3",
	"attack",
	"draught",
	"lock"
]), mp = Object.freeze([
	{
		keys: "WASD",
		label: "Move",
		id: "move"
	},
	{
		keys: "Shift",
		label: "Run",
		id: "run"
	},
	{
		keys: "J/Mouse0",
		label: "Attack (combo)",
		id: "attack"
	},
	{
		keys: "K/Mouse2",
		label: "Dodge roll",
		id: "dodge"
	},
	{
		keys: "U/I/O",
		label: "Skills (or 1-3)",
		id: "skills"
	},
	{
		keys: "C",
		label: "Healing Draught",
		id: "draught"
	},
	{
		keys: "L/Mouse1",
		label: "Lock on / next",
		id: "lock"
	},
	{
		keys: "Space",
		label: "Talk / Rest / Open",
		id: "interact"
	},
	{
		keys: "F/Enter",
		label: "Choose an answer",
		id: "choose"
	},
	{
		keys: "Q/E",
		label: "Rotate camera",
		id: "rotate"
	},
	{
		keys: "Z/X",
		label: "Zoom (or wheel)",
		id: "zoom"
	},
	{
		keys: "N/Tab",
		label: "World map",
		id: "map"
	},
	{
		keys: "T/R/P/M",
		label: "Time / Weather / Photo / Music",
		id: "toggles"
	}
]), hp = class {
	constructor(e) {
		this.input = e, this.buffer = {};
		for (let e of X) this.buffer[e] = {
			t: 0,
			mouse: !1
		};
		this._virtual = [], this._ignored = /* @__PURE__ */ new Set(), this.respawnGuard = 0, this.lockEvent = null, this._lockPending = !1, this._lockT = 0, this._edges = {};
		for (let e of X) this._edges[e] = 0;
	}
	get resumeGuard() {
		return this._ignored.size > 0;
	}
	press(e, t = 1) {
		return X.includes(e) ? (this._virtual.push({
			action: e,
			frames: Math.max(1, t | 0),
			started: !1
		}), !0) : !1;
	}
	_heldRaw(e) {
		for (let t = 0; t < this._virtual.length; t++) {
			let n = this._virtual[t];
			if (n.action === e && n.frames > 0) return !0;
		}
		return this.input.action(e);
	}
	held(e) {
		return !this._ignored.has(e) && this._heldRaw(e);
	}
	_realEdge(e) {
		let t = this.input, n = t.bindings[e];
		if (n) for (let e = 0; e < n.length; e++) {
			let r = n[e];
			if (t.wasPressed(r)) return r.startsWith("Mouse") ? 2 : 1;
		}
		return 0;
	}
	collect(e, t) {
		let n = this._edges;
		for (let e = 0; e < X.length; e++) {
			let t = X[e];
			n[t] = this._realEdge(t);
		}
		for (let e = 0; e < this._virtual.length; e++) {
			let t = this._virtual[e];
			t.started || (t.started = !0, n[t.action] || (n[t.action] = 1));
		}
		if (t) {
			for (let e = 0; e < X.length; e++) {
				let t = X[e];
				n[t] = 0, this._heldRaw(t) && this._ignored.add(t);
			}
			this._lockPending = !1;
		}
		if (this._ignored.size) for (let e of this._ignored) this._heldRaw(e) ? n[e] = 0 : this._ignored.delete(e);
		if (this.respawnGuard > 0) for (let e = 0; e < X.length; e++) n[X[e]] = 0;
		for (let e = 0; e < X.length; e++) {
			let t = X[e], r = n[t];
			if (!r || t === "lock") continue;
			let i = this.buffer[t];
			i.t = Yn, i.mouse = r === 2;
		}
		this.lockEvent = null;
		let r = this.held("lock");
		n.lock ? (this.lockEvent = "press", this._lockPending = !0, this._lockT = 0) : this._lockPending && (r ? (this._lockT += e, this._lockT >= .349999 && (this._lockPending = !1, this.lockEvent = "hold")) : (this._lockPending = !1, this.lockEvent = "tap"));
		for (let e = this._virtual.length - 1; e >= 0; e--) {
			let t = this._virtual[e];
			t.frames--, t.frames <= 0 && this._virtual.splice(e, 1);
		}
	}
	tick(e) {
		for (let t = 0; t < X.length; t++) {
			let n = this.buffer[X[t]];
			n.t > 0 && (n.t = Math.max(0, n.t - e));
		}
		this.respawnGuard > 0 && (this.respawnGuard = Math.max(0, this.respawnGuard - e));
	}
	has(e) {
		return this.buffer[e].t > 0;
	}
	take(e) {
		let t = this.buffer[e];
		return t.t > 0 ? (t.t = 0, t) : null;
	}
	clearBuffer() {
		for (let e = 0; e < X.length; e++) this.buffer[X[e]].t = 0;
	}
	reset() {
		this.clearBuffer(), this._virtual.length = 0, this._ignored.clear(), this.respawnGuard = 0, this.lockEvent = null, this._lockPending = !1, this._lockT = 0;
	}
}, gp = Object.freeze({
	melee: 4,
	finisher: 7,
	skill: 3,
	crit: 2,
	kill: 4,
	boss: 5,
	cap: 10,
	playerHurt: 6,
	bossPhase: 12,
	bossDeath: 12,
	guard: 2
});
function _p(e, t, n, r) {
	let i = e + (t ? gp.crit : 0) + (n && !r ? gp.kill : 0);
	return w(Math.min(gp.cap, i));
}
var Z = Object.freeze({
	hit: [.05, .12],
	crit: [.12, .2],
	finisher: [.08, .15],
	hurt: [.15, .25],
	knockdown: [.25, .35],
	nova: [.2, .3],
	wallStun: [.3, .4],
	bossSlam: [.45, .5],
	bossRoar: [.45, 1.2],
	bossIntro: [.25, .6],
	bossDeath: [.5, .8],
	kill: [.08, .16]
}), vp = w(4), yp = Object.freeze({
	r: 2,
	g: .35,
	b: .3,
	a: .7,
	time: w(3)
}), Q = {
	engagedEase: .8,
	focusRange: 8.5,
	tiltShift: .3,
	tiltWidth: .4,
	hurtTime: .35,
	hurtVignette: .85,
	hurtLift: .3,
	hurtColor: [
		.62,
		.07,
		.04
	],
	lowVignette: .7,
	lowLift: .15,
	lowSaturation: -.25,
	perfectTime: .6,
	perfectSaturation: -.35,
	ca: .004,
	phaseTime: 1,
	deathTime: 1,
	streaksEngaged: .35
}, bp = [
	[
		"dof",
		"focusRange",
		"focusRange"
	],
	[
		"dof",
		"tiltShift",
		"tiltShift"
	],
	[
		"dof",
		"tiltWidth",
		"tiltWidth"
	],
	[
		"grade",
		"vignette",
		"vignette"
	],
	[
		"grade",
		"chromaticAberration",
		"ca"
	],
	[
		"grade",
		"exposure",
		"exposure"
	],
	[
		"cinematic",
		"streaks",
		"streaks"
	]
], xp = class {
	constructor(e) {
		this.settings = e.settings;
		let t = this.settings;
		this.base = {
			focusRange: t.dof.focusRange,
			tiltShift: t.dof.tiltShift,
			tiltWidth: t.dof.tiltWidth,
			vignette: t.grade.vignette,
			vignetteColor: Array.isArray(t.grade.vignetteColor) ? [...t.grade.vignetteColor] : [
				.05,
				.025,
				.04
			],
			ca: t.grade.chromaticAberration ?? 0,
			exposure: t.grade.exposure,
			streaks: t.cinematic?.streaks ?? 0
		}, this._color = [...this.base.vignetteColor], this._wrote = bp.map(() => NaN), this._wroteColor = [
			NaN,
			NaN,
			NaN
		], this.reset();
	}
	_rebase() {
		let e = this.settings, t = this.base;
		for (let n = 0; n < bp.length; n++) {
			let [r, i, a] = bp[n], o = e[r][i] ?? 0;
			!Number.isNaN(this._wrote[n]) && o !== this._wrote[n] && (t[a] = o);
		}
		let n = e.grade.vignetteColor;
		if (Array.isArray(n)) {
			let e = this._wroteColor;
			if ((n !== this._color || n[0] !== e[0] || n[1] !== e[1] || n[2] !== e[2]) && !Number.isNaN(e[0])) for (let e = 0; e < 3; e++) t.vignetteColor[e] = n[e];
		}
	}
	_remember() {
		let e = this.settings;
		for (let t = 0; t < bp.length; t++) {
			let [n, r] = bp[t];
			this._wrote[t] = e[n][r] ?? 0;
		}
		let t = this._color;
		this._wroteColor[0] = t[0], this._wroteColor[1] = t[1], this._wroteColor[2] = t[2];
	}
	reset() {
		this.engaged = 0, this.hurt = 0, this.perfect = 0, this.phase = 0, this.death = 0, this.dying = !1, this._pulse = 0;
	}
	pulseHurt() {
		this.hurt = Q.hurtTime;
	}
	pulsePerfect() {
		this.perfect = Q.perfectTime;
	}
	pulsePhase() {
		this.phase = Q.phaseTime;
	}
	startDeath() {
		this.dying = !0;
	}
	apply(e, t, n) {
		let r = e / Q.engagedEase;
		this.engaged = _(this.engaged + (t ? r : -r), 0, 1), this.hurt = Math.max(0, this.hurt - e), this.perfect = Math.max(0, this.perfect - e), this.phase = Math.max(0, this.phase - e), this.dying && (this.death = Math.min(1, this.death + e / Q.deathTime)), this._pulse = (this._pulse + e) % 1, this._rebase();
		let i = this.settings, a = this.base, o = this.engaged * this.engaged * (3 - 2 * this.engaged);
		i.dof.focusRange = ne(a.focusRange, Q.focusRange, o), i.dof.tiltShift = ne(a.tiltShift, Q.tiltShift, o), i.dof.tiltWidth = ne(a.tiltWidth, Q.tiltWidth, o), i.cinematic?.enabled && (i.cinematic.streaks = ne(a.streaks, a.streaks * Q.streaksEngaged, o));
		let s = this.hurt / Q.hurtTime, c = .5 + .5 * Math.cos(this._pulse * Math.PI * 2), l = a.vignette, u = Math.max(Q.lowVignette, a.vignette + Q.lowLift), d = Math.max(Q.hurtVignette, a.vignette + Q.hurtLift);
		n && (l = Math.max(l, ne(a.vignette, u, .55 + .45 * c))), l = ne(l, d, s), i.grade.vignette = l;
		let f = Math.max(s, n ? .35 * c : 0), p = this._color;
		for (let e = 0; e < 3; e++) p[e] = ne(a.vignetteColor[e], Q.hurtColor[e], f);
		i.grade.vignetteColor = p;
		let m = this.perfect / Q.perfectTime, h = this.phase / Q.phaseTime;
		i.grade.chromaticAberration = a.ca + Q.ca * Math.max(m, h), i.grade.exposure = a.exposure;
		let g = (n ? Q.lowSaturation : 0) + Q.perfectSaturation * m - this.death;
		i.grade.saturation += Math.max(-1, g), this._remember();
	}
	restore() {
		let e = this.settings, t = this.base;
		e.dof.focusRange = t.focusRange, e.dof.tiltShift = t.tiltShift, e.dof.tiltWidth = t.tiltWidth, e.grade.vignette = t.vignette, e.grade.vignetteColor = [...t.vignetteColor], e.grade.chromaticAberration = t.ca, e.grade.exposure = t.exposure, e.cinematic?.enabled && (e.cinematic.streaks = t.streaks);
	}
}, Sp = {
	A1: Object.freeze({
		source: "melee",
		stop: Mn[0].hitStop,
		finisher: !1,
		combo: 1
	}),
	A2: Object.freeze({
		source: "melee",
		stop: Mn[1].hitStop,
		finisher: !1,
		combo: 2
	}),
	A3: Object.freeze({
		source: "melee",
		stop: Mn[2].hitStop,
		finisher: !0,
		combo: 3
	}),
	whirl: Object.freeze({
		source: "skill",
		stop: In.hitStop,
		finisher: !1,
		combo: 0
	}),
	nova: Object.freeze({
		source: "skill",
		stop: T.hitStop,
		finisher: !1,
		combo: 0
	}),
	bolt: Object.freeze({
		source: "projectile",
		stop: Ln.hitStop,
		finisher: !1,
		combo: 0
	}),
	tempest: Object.freeze({
		source: "skill",
		stop: zn.hitStop,
		finisher: !1,
		combo: 0
	}),
	tempestEnd: Object.freeze({
		source: "skill",
		stop: zn.finalStop,
		finisher: !1,
		combo: 0
	}),
	fang: Object.freeze({
		source: "skill",
		stop: Bn.hitStop,
		finisher: !1,
		combo: 0
	}),
	skyfall: Object.freeze({
		source: "skill",
		stop: Vn.hitStop,
		finisher: !1,
		combo: 0
	})
}, Cp = Object.freeze({
	F: w,
	TEMPEST: zn,
	DRAGONFANG: Bn,
	SKYFALL: Vn
}), wp = Object.freeze({
	F: w,
	frameOf: an,
	EPS: rn,
	SHAKE: Z,
	MELEE_DY: On,
	hitOverlaps: Bd
}), Tp = (e) => 1 - (1 - e) * (1 - e), Ep = Math.PI / 180, Dp = .5, Op = Object.freeze({
	dim: .6,
	lo: .3,
	hi: .65
}), kp = class {
	constructor(e) {
		this.sys = e, this.player = e.player, this.sprite = e.player.sprite, this.sheet = e.player.sheet, this.radius = En, this.body = Dn, this.potionMax = 5, this._spec = {
			shape: "sector",
			x: 0,
			y: 0,
			z: 0,
			r: 1,
			rInner: 0,
			dirX: 0,
			dirZ: 1,
			halfAngle: 60,
			len: 1,
			width: 1,
			dy: On,
			mv: 1,
			kb: 0,
			poise: 0,
			knockdown: !1,
			flat: 0,
			thin: !1,
			tag: 0,
			fromX: 0,
			fromZ: 0,
			mark: 0
		}, this._swings = [{
			tag: 0,
			mp: 0
		}, {
			tag: 0,
			mp: 0
		}], this._swingI = 0, this._tagA = 0, this._tagB = 0, this._proj = {
			kind: "emberBolt",
			x: 0,
			y: 0,
			z: 0,
			dirX: 0,
			dirZ: 1,
			vy: 0,
			speed: Ln.speed,
			range: Ln.range,
			radius: Ln.radius,
			mv: Ln.mv,
			kb: Ln.kb,
			poise: Ln.poise,
			pierce: !1,
			splash: Ln.splash,
			arc: null
		}, this._aim = {
			x: 0,
			z: 1
		}, this._tmp = {
			x: 0,
			z: 0
		};
		let t = e.game?.playerKit, n = t === "swordmaster" || t === "bellwarden" ? t : "traveler";
		this.kit = Hn[n], this.skills = this.kit.skills, this.sword = n === "swordmaster", this.bellMoves = wp, this.bell = n === "bellwarden" && e.kitModule ? e.kitModule.createKit(this, wp) : null, this.comboSteps = this.bell ? this.bell.combo : Mn, this.comboMeta = this.bell ? this.bell.comboMeta : [
			Sp.A1,
			Sp.A2,
			Sp.A3
		], this.hfx = this.sword || this.bell ? new Ip(e.quads, e.atlas?.frames ?? {}, e.fx) : null, this.moves = Cp, this.look = e.sword?.director(this) ?? null, this.bellLook = this.bell ? e.bell?.director(this) ?? null : null, this._tagC = 0, this._lift = 0, this._stepDt = 0, this._wave = {
			alive: !1,
			x: 0,
			y: 0,
			z: 0,
			dirX: 0,
			dirZ: 1,
			d: 0,
			tag: 0,
			dust: 0
		}, this._land = {
			x: 0,
			y: 0,
			z: 0
		}, this._leap = 0, this._leapX = 0, this._leapZ = 1, this._baseX = 0, this._baseZ = 1, this._rings = [0, 1].map(() => ({
			id: -1,
			t: 0,
			x: 0,
			z: 0,
			delay: 0,
			dur: .4,
			r0: .5,
			r1: 6,
			w: .5
		})), this._ringSpec = {
			shape: "ring",
			x: 0,
			z: 0,
			r: 1,
			rInner: 0,
			progress: 1,
			style: "player",
			alpha: 1
		}, this.reset();
	}
	reset() {
		this.level = 1, this.xp = 0, this.gold = 0, this.potions = 3, this.upgrades = {
			maxHp: 0,
			maxMp: 0,
			attack: 0,
			def: 0
		}, this.hp = this.hpMax, this.mp = this.mpMax, this.sp = 100, this.alive = !0, this.winded = !1, this.cooldowns = [
			0,
			0,
			0
		], this.draughtCd = 0, this.spDelay = 0, this.perfectCd = 0, this.iframes = 0, this.blink = !1, this.invulnT = 0, this.flashT = 0, this.deaths = 0, this.perfectDodges = 0, this._endAction(), this.combo = 0, this.swings = 0, this._freeNovaMarker(), this._clearHeroFx(), this._applyVisuals(0);
	}
	get hpMax() {
		return sn(this.level, this.upgrades.maxHp);
	}
	get mpMax() {
		return cn(this.level, this.upgrades.maxMp);
	}
	get spMax() {
		return 100;
	}
	get atk() {
		return ln(this.level, this.upgrades.attack);
	}
	get def() {
		return un(this.level, this.upgrades.def);
	}
	get xpNext() {
		return dn(this.level);
	}
	get invulnerable() {
		if (!this.alive || this.iframes > 0 || this.invulnT > 0) return !0;
		let e = this._iframeWindow();
		return !!e && this.frame >= e[0] && this.frame <= e[1];
	}
	get dodging() {
		return this.action === "roll" || this.action === "backstep";
	}
	_iframeWindow() {
		switch (this.action) {
			case "roll": return Pn.iframes;
			case "backstep": return Fn.iframes;
			case "skill3": return this.bell ? null : this.sword ? Vn.iframes : T.iframes;
			case "knockdown": return [0, 1e9];
			default: return null;
		}
	}
	step(e) {
		this._stepTimers(e), this.action && this._advance(e), this._wave.alive && this._stepWave(e), this.bell && this.bell.step(e), this.alive && this._decide(), this._regen(e);
	}
	_stepTimers(e) {
		this.iframes > 0 && (this.iframes = Math.max(0, this.iframes - e)), this.invulnT > 0 && (this.invulnT = Math.max(0, this.invulnT - e)), this.perfectCd > 0 && (this.perfectCd = Math.max(0, this.perfectCd - e));
		for (let t = 0; t < 3; t++) this.cooldowns[t] > 0 && (this.cooldowns[t] = Math.max(0, this.cooldowns[t] - e));
		this.draughtCd > 0 && this.action !== "draught" && (this.draughtCd = Math.max(0, this.draughtCd - e));
	}
	_regen(e) {
		this.alive && (this.spDelay > 0 ? this.spDelay = Math.max(0, this.spDelay - e) : this.sp < 100 && (this.sp = Math.min(100, this.sp + 45 * e)), this.winded && this.sp >= 30 && (this.winded = !1), this.mp < this.mpMax && (this.mp = Math.min(this.mpMax, this.mp + this.kit.mpRegen * e)));
	}
	_spend(e) {
		this.sp = Math.max(0, this.sp - e), this.sp <= 1e-6 ? (this.sp = 0, this.winded = !0, this.spDelay = _n) : this.spDelay = Math.max(this.spDelay, gn);
	}
	_advance(e) {
		let t = e;
		if (this.action === "attack" && this._windedAction) {
			let n = this.comboSteps[this.combo - 1];
			this.frame > n.active[1] && (t = e / yn);
		}
		this.t += t, this._stepDt = t;
		let n = this.frame;
		this.frame = an(this.t), this._prevFrame = n, this._runFrame();
	}
	_at(e) {
		return this._prevFrame < e && this.frame >= e;
	}
	_runFrame() {
		switch (this.action) {
			case "attack":
				this._frameAttack();
				break;
			case "roll":
			case "backstep":
				this._frameDodge();
				break;
			case "skill1":
				this.bell ? this.bell.frame(0) : this.sword ? this._frameTempest() : this._frameWhirl();
				break;
			case "skill2":
				this.bell ? this.bell.frame(1) : this.sword ? this._frameFang() : this._frameBolt();
				break;
			case "skill3":
				this.bell ? this.bell.frame(2) : this.sword ? this._frameSkyfall() : this._frameNova();
				break;
			case "draught":
				this._frameDraught();
				break;
			case "hitstun":
				this._frameHitstun();
				break;
			case "knockdown":
				this._frameKnockdown();
				break;
			case "dead": this._pose("down");
		}
	}
	_decide() {
		let e = this.sys.cin, t = this.action, n = this.frame, r = (e) => {
			if (!t) return !0;
			if (this.bell && (t === "skill1" || t === "skill2" || t === "skill3")) return this.bell.can(t, e, n);
			switch (t) {
				case "attack": {
					let t = this.comboSteps[this.combo - 1];
					return e === "dodge" ? n >= t.dodge : n >= t.next;
				}
				case "roll": return e === "attack" ? n >= Pn.attackFrom : e === "dodge" ? n >= Pn.dodgeFrom : e !== "draught" && n >= Pn.skillFrom;
				case "backstep": return e === "attack" ? n >= Fn.attackFrom : e === "dodge" ? n >= Fn.dodgeFrom : e !== "draught" && n >= Fn.skillFrom;
				case "skill1": return e === "dodge" && n >= (this.sword ? zn.dodgeFrom : In.dodgeFrom);
				case "skill2": {
					let t = this.sword ? Bn : Ln;
					return e === "dodge" && n >= t.dodgeFrom || (e === "attack" || e.startsWith("skill")) && n >= t.attackFrom;
				}
				case "skill3": return e === "dodge" && n >= (this.sword ? Vn.dodgeFrom : T.dodgeFrom);
				case "knockdown": return e === "dodge" && this.t >= w(Wn.techFrom) - 1e-6;
				default: return !1;
			}
		};
		if (e.has("dodge") && r("dodge") && this.sp >= 12) {
			let t = e.take("dodge");
			this._startDodge(t.mouse);
			return;
		}
		for (let t = 0; t < 3; t++) {
			let n = this.skills[t].id;
			if (e.has(n) && r(n)) {
				let r = e.take(n);
				if (this._trySkill(t, r.mouse)) return;
			}
		}
		if (e.has("attack") && r("attack")) {
			let n = e.take("attack");
			this._startAttack(n.mouse, { rollSlash: t === "roll" });
			return;
		}
		e.has("draught") && r("draught") && (e.take("draught"), this._tryDraught());
	}
	_begin(e) {
		this._clearActionState(), this.action = e, this.player.action = e;
	}
	_clearActionState() {
		this.action === "skill3" && this.sword && this.look?.skyfallEnd(this.frame), this.bell && this.action && this.bell.actionEnd(this.action, this.frame), this.t = 0, this.frame = 0, this._prevFrame = -1, this._motion = null, this._moved = 0, this._windedAction = !1, this._consumed = !1, this._armor = !1, this._swing = null, this._lastCol = -1, this._lastRow = -1, this._freeNovaMarker(), this._lift !== 0 && this._setLift(0);
	}
	_endAction() {
		this._clearActionState(), this.action = null, this.player && (this.player.action = null);
	}
	_finish() {
		this._endAction(), this.combo = 0;
	}
	_startAttack(e, { rollSlash: t = !1 } = {}) {
		let n = this.action === "attack" && this.combo > 0 && this.combo < 3 ? this.combo + 1 : 1;
		this._begin("attack"), this.combo = n, this.swings++;
		let r = this.comboSteps[n - 1];
		this._mouse = e, this._windedAction = this.winded, this._spend(r.sp), this._lungeExtra = t ? Pn.rollSlashLunge : 0, this._swingI = 1 - this._swingI;
		let i = this._swings[this._swingI];
		i.tag = this.sys.tags.next(), i.mp = 0, this._swing = i, this._aimAttack(!0), this._runFrame();
	}
	_aimAttack(e) {
		let t = this.comboSteps[this.combo - 1], n = this.sys, r = n.targeting.aimDir(this._mouse, this._aim), i = r.x, a = r.z, o = t.lunge + this._lungeExtra, s = n.targeting.soft(i, a, !1);
		if (s) {
			let e = this.player.position, t = s.position.x - e.x, n = s.position.z - e.z, r = Math.hypot(t, n);
			if (r <= Nn.range && r > 1e-4) {
				let e = Math.atan2(a, i), c = Math.atan2(n, t) - e;
				for (; c > Math.PI;) c -= Math.PI * 2;
				for (; c < -Math.PI;) c += Math.PI * 2;
				let l = Nn.maxTurnDeg * Ep, u = e + Math.max(-l, Math.min(l, c));
				i = Math.cos(u), a = Math.sin(u), o = Math.max(0, Math.min(r - (s.radius + Nn.reach), o + Nn.extra));
			}
		}
		this._setFacing(i, a), (e || this.frame < t.lungeFrames[0]) && (this._lunge = o);
	}
	_frameAttack() {
		let e = this.comboSteps[this.combo - 1], t = this.frame;
		if (t >= e.total) {
			this._finish();
			return;
		}
		(this._at(1) || this._at(2)) && t <= 2 && this._aimAttack(!1);
		for (let [n, r, i] of e.poses) if (t >= n && t <= r) {
			this._pose(i);
			break;
		}
		let [n, r] = e.lungeFrames;
		this._moveAlong(this._lunge, n, r + 1, this.player.facing.x, this.player.facing.z);
		let i = this.sys, a = this.player.position, o = this.player.facing;
		if (this.sword && this._at(0) ? this.look?.windup(e) : this.bell && this._at(0) && this.bellLook?.windup(e), this._at(e.fxAt) && (i.sfxAt(e.sfx, a.x, a.z, { volume: .8 }), this.sword ? this.look?.swing(e) : this.bell ? this.bellLook?.swing(e) : e.finisher ? (i.fx.play("thrust", a.x + o.x * .9, a.y, a.z + o.z * .9, {
			dirX: o.x,
			dirZ: o.z
		}), i.fx.play("slashBig", a.x + o.x * .5, a.y, a.z + o.z * .5, {
			dirX: o.x,
			dirZ: o.z
		})) : i.fx.play("slash", a.x + o.x * .55, a.y, a.z + o.z * .55, {
			dirX: o.x,
			dirZ: o.z,
			flip: e.flip
		})), t >= e.active[0] && t <= e.active[1]) {
			let n = this.comboMeta[this.combo - 1];
			for (let t of e.hits) {
				let r = this._baseSpec(this._swing.tag, e.mv, e.kb, e.poise);
				this.bell && (r.mark = this.bell.M.BELL_MARKS.perHit), r.shape = t.shape, t.shape === "lane" ? (r.len = t.len, r.width = t.width) : (r.r = t.r, r.halfAngle = t.halfAngle), i.addPlayerHit(r, n, this._swing);
			}
			this.bell && this.bell.swing(e, t, this._swing, n);
		}
	}
	_baseSpec(e, t, n, r) {
		let i = this._spec, a = this.player.position;
		return i.shape = "circle", i.x = a.x, i.y = a.y, i.z = a.z, i.r = 1, i.rInner = 0, i.dirX = this.player.facing.x, i.dirZ = this.player.facing.z, i.halfAngle = 60, i.len = 1, i.width = 1, i.dy = On, i.mv = t, i.kb = n, i.poise = r, i.knockdown = !1, i.flat = 0, i.thin = !1, i.tag = e, i.fromX = a.x, i.fromZ = a.z, i.mark = 0, i;
	}
	onMeleeLanded(e) {
		if (!e || e.mp >= 4) return;
		let t = Math.min(2, 4 - e.mp);
		e.mp += t, this.mp = Math.min(this.mpMax, this.mp + t);
	}
	_startDodge(e) {
		let t = this.sys, n = t.moveWorld(this._tmp), r = 0, i = 0, a = !1;
		if (n > .2) r = this._tmp.x, i = this._tmp.z, a = !0;
		else if ((e || t.aimOverride) && t.aimPoint(this._tmp)) {
			let e = this.player.position, t = this._tmp.x - e.x, n = this._tmp.z - e.z, o = Math.hypot(t, n);
			o > .8 && (r = t / o, i = n / o, a = !0);
		}
		this._begin(a ? "roll" : "backstep"), this.combo = 0;
		let o = a ? Pn : Fn;
		this._spend(a ? vn.roll : vn.backstep), a && this._setFacing(r, i);
		let s = this.player.facing, c = a ? r : -s.x, l = a ? i : -s.z;
		this._motion = {
			dist: o.dist,
			f0: 0,
			f1: o.moveFrames + 1,
			dx: c,
			dz: l,
			done: 0
		};
		let u = this.player.position;
		t.burst("footstep", u.x, u.y + .05, u.z, 6), t.sfxAt("dodge", u.x, u.z, { volume: .7 }), t.tutorial.dodge = !0, this._runFrame();
	}
	_frameDodge() {
		let e = this.action === "roll" ? Pn : Fn, t = this.frame;
		if (t >= e.total) {
			this._finish();
			return;
		}
		for (let [n, r, i] of e.poses) if (t >= n && t <= r) {
			this._pose(i);
			break;
		}
		let n = this._motion;
		n && this._moveAlong(n.dist, n.f0, n.f1, n.dx, n.dz);
	}
	notePerfectDodge() {
		if (!this.dodging || this.perfectCd > 0) return !1;
		let e = (this.action === "roll" ? Pn : Fn).perfect;
		return this.frame < e[0] || this.frame > e[1] ? !1 : (this.perfectCd = Tn.cooldown, this.perfectDodges++, this.iframes = Math.max(this.iframes, Tn.time), this.sp = Math.min(100, this.sp + Tn.sp), this.mp = Math.min(this.mpMax, this.mp + Tn.mp), this.sys.onPerfectDodge(), !0);
	}
	_trySkill(e, t) {
		let n = this.skills[e], r = this.sys;
		if (this.level < n.unlock || this.cooldowns[e] > 0 || this.mp < n.mp - 1e-6) return r.refuseSkill(e), !1;
		this._begin(n.id), this.combo = 0, this.mp -= n.mp, this.cooldowns[e] = n.cooldown, this._mouse = t;
		let i = r.targeting.aimDir(t, this._aim);
		if (this._setFacing(i.x, i.z), this._tagA = r.tags.next(), this._tagB = r.tags.next(), (this.sword || this.bell) && (this._tagC = r.tags.next()), n.id === "skill1" && (this._armor = !0), n.id === "skill2" && (this._boltTarget = r.targeting.soft(i.x, i.z, !0), this._boltTarget)) {
			let e = this.player.position, t = this._boltTarget.position.x - e.x, n = this._boltTarget.position.z - e.z, r = Math.hypot(t, n);
			r > 1e-4 && this._setFacing(t / r, n / r);
		}
		return this.bell && this.bell.begin(e), this._runFrame(), !0;
	}
	_frameWhirl() {
		let e = this.frame;
		if (e >= In.total) {
			this._finish();
			return;
		}
		this._pose(In.pose), this._armor = e <= In.armor;
		let t = this.sys, n = this.player.position;
		this._at(3) && t.sfxAt("whirl", n.x, n.z, { volume: .9 }), this._at(5) && t.fx.play("spin", n.x, n.y, n.z, { follow: n });
		let [r, i] = In.hits[0], [a, o] = In.hits[1], s = e >= r && e <= i ? this._tagA : e >= a && e <= o ? this._tagB : null;
		if (s) {
			let e = this._baseSpec(s, In.mv, In.kb, In.poise);
			e.shape = "circle", e.r = In.r, t.addPlayerHit(e, Sp.whirl, null);
		}
	}
	_frameBolt() {
		if (this.frame >= Ln.total) {
			this._finish();
			return;
		}
		if (this._pose(Ln.pose), this._at(Ln.release)) {
			let e = this.sys, t = this.player.position, n = this.player.facing, r = this._proj;
			r.x = t.x + n.x * .4, r.z = t.z + n.z * .4, r.y = t.y + kn;
			let i = this._boltTarget;
			if (i && i.alive) {
				let t = i.position.x - r.x, n = i.position.z - r.z, a = Math.hypot(t, n);
				a > .001 && (r.dirX = t / a, r.dirZ = n / a, this._setFacing(r.dirX, r.dirZ));
				let o = i.def.body;
				r.vy = lr(r.y, e.bodyBase(i) + (o[0] + o[1]) / 2, Ln.speed, a);
			} else r.dirX = n.x, r.dirZ = n.z, r.vy = 0;
			e.spawnProjectile("player", r), e.sfxAt("bolt", t.x, t.z, { volume: .85 });
		}
	}
	_frameNova() {
		let e = this.frame;
		if (e >= T.total) {
			this._finish();
			return;
		}
		for (let [t, n, r] of T.poses) if (e >= t && e <= n) {
			this._pose(r);
			break;
		}
		let t = this.sys, n = this.player.position;
		if (e <= T.grow) {
			if ((this._novaMarker === void 0 || this._novaMarker < 0) && (this._novaMarker = t.markerAllocCore()), this._novaMarker >= 0) {
				let e = t._markerSpec, r = Math.min(1, this.t / w(T.grow)), i = r >= 1 - 1e-6;
				e.shape = i ? "ring" : "circle", e.x = n.x, e.z = n.z, e.r = Math.max(.05, T.r * r), e.rInner = i ? T.r - .45 : 0, e.progress = r, e.style = "player", e.alpha = 1 - .45 * r * r, t.markerSetCore(this._novaMarker, e);
			}
		} else this._freeNovaMarker();
		if (this._at(2) && t.sfxAt("nova", n.x, n.z, {
			volume: .5,
			pitch: .8
		}), this._at(T.at)) {
			let e = this._baseSpec(this._tagA, T.mv, T.kb, T.poise);
			e.shape = "circle", e.r = T.r, e.knockdown = !0, t.addPlayerHit(e, Sp.nova, null), t.burst("magicBurst", n.x, n.y + .8, n.z, 24), t.shake(Z.nova[0], Z.nova[1]), t.sfxAt("nova", n.x, n.z, { volume: 1 });
		}
	}
	_freeNovaMarker() {
		this._novaMarker !== void 0 && this._novaMarker >= 0 && this.sys.markerFreeCore(this._novaMarker), this._novaMarker = -1;
	}
	_frameTempest() {
		let e = zn, t = this.frame, n = this.sys, r = this.player.position;
		if (this._at(0) && (this._baseX = this.player.facing.x, this._baseZ = this.player.facing.z, this.look?.tempest("start")), t >= e.total) {
			this._setFacing(this._baseX, this._baseZ), this._finish();
			return;
		}
		let i = t >= e.spinFrom && t <= e.spinTo;
		if (i) {
			let n = Math.floor((t - e.spinFrom) / e.spinStep) + 1, r = Math.atan2(this._baseZ, this._baseX) + Math.PI / 2 * n;
			this._setFacing(Math.cos(r), Math.sin(r));
		} else t > e.spinTo && this._setFacing(this._baseX, this._baseZ);
		for (let [n, r, i] of e.poses) if (t >= n && t <= r) {
			this._pose(i);
			break;
		}
		if (this._armor = t <= e.armor, i && this._stepDt > 0) {
			let t = n.moveWorld(this._tmp);
			if (t > .2) {
				let n = e.drift * t * this._stepDt;
				this.player.moveBy(this._tmp.x * n, this._tmp.z * n);
			}
		}
		this._at(1) && (n.sfxAt("bladeStorm", r.x, r.z, { volume: 1 }), this.look?.tempest("wind")), this._at(e.bladesAt) && this.look?.tempest("blades"), i && (t - e.spinFrom) % 4 == 0 && this._prevFrame < t && this.look?.tempest("spin"), this._at(e.release) && (this.look?.tempest("release"), n.sfxAt("dodge", r.x, r.z, {
			volume: .7,
			pitch: 1.25
		}));
		for (let i = 0; i < 3; i++) {
			let [a, o] = e.hits[i];
			if (this._at(a)) {
				let e = i === 2;
				n.sfxAt(e ? "swingHeavy" : "whirl", r.x, r.z, {
					volume: .9,
					pitch: e ? 1 : 1.05 + .1 * i
				}), this.look?.tempest("hit", i);
				let t = e ? Z.finisher : Z.hit;
				n.shake(t[0], t[1]);
			}
			if (t >= a && t <= o) {
				let t = this._baseSpec(i === 0 ? this._tagA : i === 1 ? this._tagB : this._tagC, e.mv[i], e.kb[i], e.poise[i]);
				t.shape = "circle", t.r = e.r, n.addPlayerHit(t, i === 2 ? Sp.tempestEnd : Sp.tempest, null);
			}
		}
	}
	_frameFang() {
		let e = Bn, t = this.frame;
		if (t >= e.total) {
			this._finish();
			return;
		}
		for (let [n, r, i] of e.poses) if (t >= n && t <= r) {
			this._pose(i);
			break;
		}
		let n = this.sys, r = this.player.position, i = this.player.facing;
		this._moveAlong(e.lunge, e.lungeFrames[0], e.lungeFrames[1] + 1, i.x, i.z), this._at(2) && (n.sfxAt("dodge", r.x, r.z, {
			volume: .6,
			pitch: .75
		}), this.look?.fang("windup")), this._at(e.release) && this._releaseWave();
	}
	_releaseWave() {
		let e = this.sys, t = this.player.position, n = this._boltTarget;
		if (n && n.alive) {
			let e = n.position.x - t.x, r = n.position.z - t.z, i = Math.hypot(e, r);
			i > .001 && this._setFacing(e / i, r / i);
		}
		let r = this.player.facing, i = this._wave;
		i.alive = !0, i.x = t.x + r.x * .6, i.z = t.z + r.z * .6, i.y = e.groundAt(i.x, i.z), Math.abs(i.y - t.y) > Bn.wall && (i.y = t.y), i.dirX = r.x, i.dirZ = r.z, i.d = 0, i.dust = .4, i.tag = this._tagA, e.sfxAt("swordWave", t.x, t.z, { volume: 1 }), e.shake(Z.finisher[0], Z.finisher[1]), this.look?.fang("release");
	}
	_stepWave(e) {
		let t = Bn, n = this._wave, r = this.sys, i = Math.min(t.speed * e, t.range - n.d), a = n.x + n.dirX * i, o = n.z + n.dirZ * i, s = r.groundAt(a, o);
		if (!(s <= n.y + t.wall && s >= n.y - t.drop)) {
			this._endWave(!0);
			return;
		}
		let c = this._baseSpec(n.tag, t.mv, t.kb, t.poise);
		c.shape = "lane", c.x = n.x - n.dirX * .4, c.z = n.z - n.dirZ * .4, c.y = n.y, c.dirX = n.dirX, c.dirZ = n.dirZ, c.len = i + .8, c.width = t.width, c.fromX = c.x - n.dirX * 2, c.fromZ = c.z - n.dirZ * 2, r.addPlayerHit(c, Sp.fang, null), n.x = a, n.z = o, n.y = s, n.d += i, n.d >= n.dust && (n.dust += .8, this.look?.waveBeat(n)), n.d >= t.range - 1e-6 && this._endWave(!1);
	}
	_endWave(e) {
		let t = this._wave;
		t.alive = !1, this.look?.waveEnd(t, e), e && this.sys.sfxAt("wallHit", t.x, t.z, { volume: .7 });
	}
	_frameSkyfall() {
		let e = Vn, t = this.sys, n = this.player.position;
		this._at(0) && this._aimLeap();
		let r = this.frame;
		if (r >= e.total) {
			this._finish();
			return;
		}
		for (let [t, n, i] of e.poses) if (r >= t && r <= n) {
			this._pose(i);
			break;
		}
		let i = this._moved, a = n.x, o = n.z;
		this._moveAlong(this._leap, e.rise, e.land, this._leapX, this._leapZ);
		let s = this._moved - i;
		if (s > 1e-4 && Math.hypot(n.x - a, n.z - o) < s * .5 && (this._leap = this._moved), r < e.land) {
			let e = this._land, r = Math.max(0, this._leap - this._moved);
			e.x = n.x + this._leapX * r, e.z = n.z + this._leapZ * r, e.y = t.groundAt(e.x, e.z);
		}
		let c = (this.t - w(e.rise)) / (w(e.land) - w(e.rise)), l = 0;
		c > 0 && c < 1 && (l = c < .55 ? e.height * Math.sin(Math.PI / 2 * (c / .55)) : e.height * (1 - ((c - .55) / .45) ** 2)), this._setLift(l), this._at(1) && (t.sfxAt("dodge", n.x, n.z, {
			volume: .6,
			pitch: .7
		}), this.look?.skyfall("crouch")), this._at(e.rise) && (t.sfxAt("swingHeavy", n.x, n.z, {
			volume: .7,
			pitch: .8
		}), this.look?.skyfall("leap")), this._at(e.swordAt) && this.look?.skyfall("sword"), this._at(e.land) && this._skyfallImpact();
	}
	_aimLeap() {
		let e = Vn, t = this.player.position, n = this.player.facing, r = n.x, i = n.z, a = e.forward, o = this.sys.targeting.soft(n.x, n.z, !0);
		if (o) {
			let n = o.position.x - t.x, s = o.position.z - t.z, c = Math.hypot(n, s);
			c <= e.reach + o.radius && c > .001 && (r = n / c, i = s / c, a = Math.max(0, Math.min(e.leapMax, c - (o.radius + e.gap))), this._setFacing(r, i));
		}
		this._leap = a, this._leapX = r, this._leapZ = i;
		let s = this._land;
		s.x = t.x + r * a, s.z = t.z + i * a, s.y = this.sys.groundAt(s.x, s.z);
	}
	_skyfallImpact() {
		let e = Vn, t = this.sys, n = this.player.position, r = this._baseSpec(this._tagA, e.mv, e.kb, e.poise);
		r.shape = "circle", r.r = e.r, r.knockdown = !0, t.addPlayerHit(r, Sp.skyfall, null), t.shake(e.shake[0], e.shake[1]), t.sfxAt("skyfall", n.x, n.z, { volume: 1 }), t.sfxAt("quake", n.x, n.z, { volume: .6 }), this.look?.skyfall("impact"), this._ringAt(0, n.x, n.z, 0, .42, .6, e.r + 1.2, .55), this._ringAt(1, n.x, n.z, .1, .5, .4, e.r, .35);
	}
	_ringAt(e, t, n, r, i, a, o, s) {
		let c = this._rings[e];
		c.id < 0 && (c.id = this.sys.markerAllocCore()), Object.assign(c, {
			t: 0,
			x: t,
			z: n,
			delay: r,
			dur: i,
			r0: a,
			r1: o,
			w: s
		}), this._updateRings(0);
	}
	_updateRings(e) {
		let t = this.sys, n = this._ringSpec, r = b.uNight.value, i = (b.uSunDirection.value.y - Op.lo) / (Op.hi - Op.lo), a = 1 - (i <= 0 ? 0 : i >= 1 ? 1 : i * i * (3 - 2 * i)), o = (1 - Dp * r) * (1 - Op.dim * a * (1 - r));
		for (let r of this._rings) {
			if (r.id < 0) continue;
			r.t += e;
			let i = (r.t - r.delay) / r.dur;
			if (i >= 1) {
				t.markerFreeCore(r.id), r.id = -1;
				continue;
			}
			let a = Math.max(0, i), s = r.r0 + (r.r1 - r.r0) * Tp(a);
			n.x = r.x, n.z = r.z, n.r = s, n.rInner = Math.max(0, s - r.w), n.alpha = (i < 0 ? 0 : 1 - a * a) * o, t.markerSetCore(r.id, n);
		}
	}
	_setLift(e) {
		this._lift = e;
		let t = this.sprite;
		t && (t.mesh.position.y = e, t.shadowProxy.position.y = e);
	}
	_clearHeroFx() {
		this._wave.alive = !1, this._wave.d = 0, this.look?.clear(), this.bell?.clear(), this.bellLook?.clear(), this.hfx?.clear();
		for (let e of this._rings) e.id >= 0 && this.sys.markerFreeCore(e.id), e.id = -1;
		this._lift !== 0 && this._setLift(0);
	}
	_tryDraught() {
		let e = this.sys;
		return this.draughtCd > 0 || this.potions <= 0 ? (e.refuseSkill(3), !1) : this.hp >= this.hpMax ? (e.ui.hud.toast(S("combat.draught.full"), 1.6), e.audio.playSfx("cancel", { volume: .5 }), !1) : (this._begin("draught"), this.combo = 0, this._consumed = !1, this._runFrame(), !0);
	}
	_frameDraught() {
		if (this.frame >= Rn.total) {
			this.draughtCd = Rn.cooldown, this._finish();
			return;
		}
		if (this._pose(Rn.pose), this._at(Rn.at) && !this._consumed) {
			this._consumed = !0, this.potions = Math.max(0, this.potions - 1);
			let e = Math.round(this.hpMax * Sn);
			this.heal(e);
			let t = this.sys, n = this.player.position;
			t.burst("healGlow", n.x, n.y + .9, n.z, 12), t.sfxAt("drink", n.x, n.z, { volume: .8 }), this.look?.draught(), this.bellLook?.draught();
		}
	}
	heal(e) {
		let t = this.hp;
		this.hp = Math.min(this.hpMax, this.hp + e);
		let n = Math.round(this.hp - t), r = this.player.position;
		return n > 0 && this.sys.number(r.x, r.y + 1.9, r.z, `+${n}`, "heal"), n;
	}
	get hittable() {
		return this.alive && !this.invulnerable;
	}
	hurt(e) {
		if (this.hp = Math.max(0, this.hp - e.damage), this.flashT = yp.time, this.hp <= 0) return this.die(), "dead";
		if (this._armor) return "armor";
		let t = e.knockdown || e.kb >= Wn.kb, n = Math.min(3, e.kb);
		return this._begin(t ? "knockdown" : "hitstun"), this.combo = 0, this._motion = {
			dist: n,
			f0: 0,
			f1: t ? Wn.slide : Un.slide,
			dx: e.kbDirX,
			dz: e.kbDirZ,
			done: 0
		}, Math.hypot(e.kbDirX, e.kbDirZ) > .001 && this._setFacing(-e.kbDirX, -e.kbDirZ), this._runFrame(), t ? "knockdown" : "hurt";
	}
	shove(e, t, n) {
		this.alive && !this._armor && (this._begin("hitstun"), this.combo = 0, this._motion = {
			dist: Math.min(3, e),
			f0: 0,
			f1: Un.slide,
			dx: t,
			dz: n,
			done: 0
		}, Math.hypot(t, n) > .001 && this._setFacing(-t, -n), this._runFrame());
	}
	hurtFlat(e) {
		this.hp = Math.max(0, this.hp - e), this.flashT = yp.time, this.hp <= 0 && this.die();
	}
	_frameHitstun() {
		if (this.frame >= Un.total) {
			this.iframes = w(Un.iframes), this.blink = !0, this._finish();
			return;
		}
		this._pose(Un.pose);
		let e = this._motion;
		e && this._moveAlong(e.dist, e.f0, e.f1, e.dx, e.dz);
	}
	_frameKnockdown() {
		let e = this.frame;
		if (e >= Wn.down + Wn.getUp) {
			this.iframes = w(Wn.iframesAfter), this.blink = !0, this._finish();
			return;
		}
		this._pose(e < Wn.down ? "down" : "tuck");
		let t = this._motion;
		t && this._moveAlong(t.dist, t.f0, t.f1, t.dx, t.dz);
	}
	die() {
		this.alive && (this.alive = !1, this.hp = 0, this._endAction(), this._begin("dead"), this.combo = 0, this.deaths++, this._pose("down"), this.sys.onPlayerDeath());
	}
	revive() {
		this.alive = !0, this._endAction(), this.combo = 0, this.hp = this.hpMax, this.mp = this.mpMax, this.sp = 100, this.winded = !1, this.spDelay = 0, this.potions = Math.max(2, this.potions), this.cooldowns[0] = this.cooldowns[1] = this.cooldowns[2] = 0, this.draughtCd = 0, this.flashT = 0, this._clearHeroFx();
	}
	refill() {
		this.hp = this.hpMax, this.mp = this.mpMax, this.sp = 100, this.winded = !1;
	}
	gainXp(e) {
		if (!(e > 0)) return;
		this.xp += e;
		let t = this.level;
		for (; this.level < 10 && this.xp >= dn(this.level);) this.xp -= dn(this.level), this.level++;
		this.level > t && this._levelUp(t);
	}
	_levelUp(e) {
		let t = this.level - e;
		this.refill(), this.invulnT = Math.max(this.invulnT, Gn);
		let n = [S("combat.gain.maxHp", { n: on.hp * t }), S("combat.gain.atk", { n: on.atk * t })];
		for (let t of this.skills) t.unlock > e && t.unlock <= this.level && n.push(S("combat.gain.learned", { skill: S(`combat.skill.${t.str}`) }));
		this.sys.onLevelUp(this.level, n.join(Oe()));
	}
	upgrade(e, t = null) {
		if (e === "core" || e === "maxHp") {
			let n = t ?? (e === "core" ? fn.core : fn.maxHp);
			this.upgrades.maxHp += n, this.hp += n;
		} else if (e === "maxMp") {
			let e = t ?? fn.maxMp;
			this.upgrades.maxMp += e, this.mp += e;
		} else e === "attack" ? this.upgrades.attack += t ?? fn.attack : e === "def" && (this.upgrades.def += t ?? 0);
	}
	_setFacing(e, t) {
		let n = Math.hypot(e, t);
		n < 1e-6 || this.player.facing.set(e / n, 0, t / n);
	}
	_pose(e) {
		let t = this.sprite, n = this.sheet.poses?.[e] ?? 0, r = this.player.facing, i = ve.directionFromVector(r.x, r.z, b.uCameraYaw.value, t.direction), a = Math.max(0, g.indexOf(i));
		(n !== this._lastCol || a !== this._lastRow || t.animation !== null) && (t.direction = i, t.setFrame(n, a), this._lastCol = n, this._lastRow = a);
	}
	refreshPose() {
		if (!this.action || this._lastCol < 0) return;
		let e = this.sprite, t = this.player.facing, n = ve.directionFromVector(t.x, t.z, b.uCameraYaw.value, e.direction), r = Math.max(0, g.indexOf(n));
		r !== this._lastRow && (e.direction = n, e.setFrame(this._lastCol, r), this._lastRow = r);
	}
	_moveAlong(e, t, n, r, i) {
		if (!(e > 0)) return;
		let a = w(t), o = w(n), s = Tp(Math.max(0, Math.min(1, (this.t - a) / (o - a)))) * e, c = s - this._moved;
		this._moved = s, c > 1e-6 && this.player.moveBy(r * c, i * c);
	}
	_applyVisuals(e, t = 0) {
		this.hfx && (this.look?.visuals(e), this.bellLook?.visuals(e), this.hfx.update(e), this._updateRings(e));
		let n = this.sprite;
		n && (this.flashT > 0 ? (this.flashT = Math.max(0, this.flashT - e), n.setFlash(yp.r, yp.g, yp.b, yp.a)) : n.setFlash(0, 0, 0, 0), this.blink && this.iframes <= 0 && (this.blink = !1), n.mesh.visible = !(this.blink && this.alive && Math.floor(t * 15 * 2) % 2 == 1));
	}
};
function Ap() {
	return {
		h: -1,
		id: 0,
		kind: "basic",
		frame: "",
		tag: "",
		mode: "flat",
		t: 0,
		life: .3,
		n: 1,
		fps: 12,
		loop: !1,
		strip: 0,
		index: 0,
		x: 0,
		y: 0,
		z: 0,
		follow: null,
		ox: 0,
		oy: 0,
		oz: 0,
		vx: 0,
		vy: 0,
		vz: 0,
		dirX: 0,
		dirZ: 1,
		flip: !1,
		s0: 1,
		s1: 1,
		grow: .3,
		rot: 0,
		spin: 0,
		cr0: 1,
		cg0: 1,
		cb0: 1,
		cr1: 1,
		cg1: 1,
		cb1: 1,
		a: 1,
		fadeIn: 0,
		fadeOut: 0,
		back: 0,
		soft: 0,
		halo: 0,
		live: !1,
		settled: !1,
		a0: 0,
		w: 0,
		rad0: 0,
		rad1: 0,
		open: .1,
		release: Infinity,
		out: 0,
		height: 0,
		fall: .3,
		wave: null,
		trail: 0
	};
}
var jp = 96, Mp = .6, Np = .012, Pp = -.03, Fp = Object.freeze([
	1,
	1,
	1
]), Ip = class {
	constructor(e, t, n) {
		this.quads = e, this.frames = t, this.view = n, this._live = [], this._pool = [];
		for (let e = 0; e < jp; e++) this._pool.push(Ap());
		this._p = {
			x: 0,
			y: 0,
			z: 0,
			frame: "",
			index: 0,
			scale: 1,
			rot: 0,
			mode: "flat",
			dirX: 0,
			dirZ: 1,
			r: 1,
			g: 1,
			b: 1,
			a: 1,
			flipX: !1,
			soft: 0,
			halo: 0
		}, this._serial = 0, this._dim = 1, this._veil = 1;
	}
	get count() {
		return this._live.length;
	}
	get capacity() {
		return jp;
	}
	spawn(e) {
		if (!this._pool.length) return null;
		let t = this.quads.alloc();
		if (t < 0) return null;
		let n = this._pool.pop(), r = Object.prototype.hasOwnProperty.call(this.frames, e.frame) ? this.frames[e.frame] : null;
		n.h = t, n.id = ++this._serial, n.kind = e.kind ?? "basic", n.frame = e.frame, n.tag = e.tag ?? "", n.mode = e.mode ?? "flat", n.t = 0, n.life = e.life ?? .3, n.n = Math.max(1, r?.n ?? 1), n.fps = e.fps ?? (r?.fps || 12), n.loop = !!e.loop, n.strip = e.strip ?? 0, n.index = e.index ?? 0, n.x = e.x ?? 0, n.y = e.y ?? 0, n.z = e.z ?? 0, n.follow = e.follow ?? null, n.ox = e.ox ?? 0, n.oy = e.oy ?? 0, n.oz = e.oz ?? 0, n.vx = e.vx ?? 0, n.vy = e.vy ?? 0, n.vz = e.vz ?? 0, n.dirX = e.dirX ?? 0, n.dirZ = e.dirZ ?? 1, n.flip = !!e.flip, n.s0 = e.s0 ?? 1, n.s1 = e.s1 ?? n.s0, n.grow = e.grow ?? n.life, n.rot = e.rot ?? 0, n.spin = e.spin ?? 0;
		let i = e.color ?? Fp, a = e.color1 ?? i;
		return n.cr0 = i[0], n.cg0 = i[1], n.cb0 = i[2], n.cr1 = a[0], n.cg1 = a[1], n.cb1 = a[2], n.a = e.a ?? 1, n.fadeIn = e.fadeIn ?? 0, n.fadeOut = e.fadeOut ?? 0, n.back = e.back ?? 0, n.soft = e.soft ?? 0, n.halo = e.halo ?? 0, n.live = !!e.live, n.settled = !1, n.a0 = e.a0 ?? 0, n.w = e.w ?? 0, n.rad0 = e.r0 ?? 0, n.rad1 = e.r1 ?? n.rad0, n.open = e.open ?? .1, n.release = e.release ?? Infinity, n.out = e.out ?? 0, n.height = e.height ?? 0, n.fall = e.fall ?? .3, n.wave = e.wave ?? null, n.trail = e.trail ?? 0, this._live.push(n), this._write(n), n;
	}
	pair(e, t, n, r = 1) {
		let i = this.spawn(e);
		if (!i) return null;
		let a = (e.mode ?? "flat") === "flat", o = this.spawn({
			...e,
			frame: t,
			color: n,
			color1: void 0,
			halo: r
		});
		return o && (a ? o.oy += Np : o.back += Pp, this._write(o)), i;
	}
	alive(e, t) {
		return !!e && e.h >= 0 && e.id === t;
	}
	update(e) {
		this._dim = 1 - Mp * b.uNight.value, this._veil = 1;
		for (let t = this._live.length - 1; t >= 0; t--) {
			let n = this._live[t];
			n.t += e, n.t >= n.life ? this._kill(t) : (e > 0 || n.live || n.follow || n.wave || n.back) && this._write(n);
		}
	}
	settle(e, t) {
		this._dim = 1 - Mp * b.uNight.value, this._veil = Math.max(0, this._veil - e / t);
		let n = 0;
		for (let r = this._live.length - 1; r >= 0; r--) {
			let i = this._live[r];
			if (i.kind === "wave") {
				this._write(i), this._veil > 0 && n++;
				continue;
			}
			i.settled || (i.settled = !0, i.fadeIn = 0, i.fadeOut = Math.max(.001, Math.min(t, i.life - i.t)), i.life = i.t + i.fadeOut), i.t += e, i.t >= i.life ? this._kill(r) : (this._write(i), n++);
		}
		return n;
	}
	endWave() {
		for (let e of this._live) e.kind === "wave" && (e.life = Math.min(e.life, e.t + Math.max(.001, e.fadeOut)));
	}
	fadeTag(e, t) {
		for (let n of this._live) n.tag === e && (n.fadeOut = Math.max(.001, t), n.life = Math.min(n.life, n.t + n.fadeOut));
	}
	countTag(e) {
		let t = 0;
		for (let n of this._live) n.tag === e && t++;
		return t;
	}
	kill(e) {
		if (!e || e.h < 0) return;
		let t = this._live.indexOf(e);
		t >= 0 && this._kill(t);
	}
	clear() {
		for (let e = this._live.length - 1; e >= 0; e--) this._kill(e);
	}
	_write(e) {
		let t = this._p, n = e.t, r = e.follow, i, a, o, s = e.dirX, c = e.dirZ;
		switch (e.kind) {
			case "orbit": {
				let t;
				t = n < e.open ? e.rad0 + (e.rad1 - e.rad0) * Tp(n / e.open) : n < e.release ? e.rad1 : e.rad1 + e.out * (n - e.release);
				let l = e.a0 + e.w * n, u = Math.cos(l), d = Math.sin(l);
				i = (r ? r.x : e.x) + u * t, o = (r ? r.z : e.z) + d * t, a = (r ? r.y : e.y) + e.oy + .1 * Math.sin(n * 11 + e.a0 * 3), s = u, c = d;
				break;
			}
			case "fall": {
				let t = Math.min(1, n / e.fall);
				i = (r ? r.x : e.x) + e.ox, o = (r ? r.z : e.z) + e.oz, a = (r ? r.y : e.y) + e.oy + e.height * (1 - t * t);
				break;
			}
			case "wave": {
				let t = e.wave;
				i = t.x - t.dirX * e.trail, o = t.z - t.dirZ * e.trail, a = t.y + e.oy, s = t.dirX, c = t.dirZ;
				break;
			}
			default: i = (r ? r.x : e.x) + e.ox + e.vx * n, a = (r ? r.y : e.y) + e.oy + e.vy * n, o = (r ? r.z : e.z) + e.oz + e.vz * n;
		}
		e.back && this.view && (i += this.view.viewX * e.back, o += this.view.viewZ * e.back);
		let l = e.index;
		e.loop ? l += Math.floor(n * e.fps + 1e-6) : e.strip > 0 && (l = Math.min(e.n - 1, Math.floor(n / e.strip * e.n)));
		let u = e.grow > 0 ? Math.min(1, n / e.grow) : 1, d = Math.min(1, n / e.life), f = e.a;
		e.fadeIn > 0 && (f *= Math.min(1, n / e.fadeIn)), e.fadeOut > 0 && (f *= Math.max(0, Math.min(1, (e.life - n) / e.fadeOut))), e.kind === "wave" && (f *= this._veil);
		let p = this._dim;
		t.x = i, t.y = a, t.z = o, t.frame = e.frame, t.index = l, t.scale = e.s0 + (e.s1 - e.s0) * Tp(u), t.rot = e.rot + e.spin * n, t.mode = e.mode, t.dirX = s, t.dirZ = c, t.flipX = e.flip, t.r = (e.cr0 + (e.cr1 - e.cr0) * d) * p, t.g = (e.cg0 + (e.cg1 - e.cg0) * d) * p, t.b = (e.cb0 + (e.cb1 - e.cb0) * d) * p, t.a = f, t.soft = e.soft, t.halo = e.halo, this.quads.set(e.h, t);
	}
	_kill(e) {
		let t = this._live[e];
		this.quads.free(t.h), t.h = -1, t.follow = null, t.wave = null, this._live[e] = this._live[this._live.length - 1], this._live.pop(), this._pool.push(t);
	}
}, Lp = class {
	constructor(e) {
		this.sys = e, this.lock = null, this.lockFocus = new s(), this.bossFocus = new s(), this.boss = null, this.mode = "player", this._saved = null, this._lockedByPress = !1, this._cands = [], this._ndc = {
			x: 0,
			y: 0,
			on: !1
		}, this._face = {
			x: 0,
			z: 1
		}, this._ring = -1;
	}
	project(e) {
		let t = e.def.body, n = this.sys.bodyBase(e) + (t[0] + t[1]) / 2;
		return this.sys.projectNdc(e.position.x, n, e.position.z, this._ndc, 1);
	}
	aimDir(e, t) {
		let n = this.sys, r = n.player.position;
		if (this.lock && this.lock.alive) {
			let e = this.lock.position.x - r.x, n = this.lock.position.z - r.z, i = Math.hypot(e, n);
			if (i > 1e-4) return t.x = e / i, t.z = n / i, t;
		}
		if ((e || n.aimOverride) && n.aimPoint(t)) {
			let e = t.x - r.x, n = t.z - r.z, i = Math.hypot(e, n);
			if (i > .8) return t.x = e / i, t.z = n / i, t;
		}
		return n.moveWorld(t) > .2 ? t : (t.x = n.player.facing.x, t.z = n.player.facing.z, t);
	}
	soft(e, t, n = !1) {
		let r = this.sys, i = r.player.position, a = n ? Xn.boltRange : Xn.range, o = Math.cos((n ? Xn.boltHalfAngle : Xn.halfAngle) * Math.PI / 180), s = null, c = Infinity, l = r.enemies;
		for (let n = 0; n < l.length; n++) {
			let r = l[n];
			if (!r.targetable) continue;
			let u = r.position.x - i.x, d = r.position.z - i.z, f = Math.hypot(u, d);
			if (f > a + r.radius) continue;
			let p = f > 1e-4 ? (u * e + d * t) / f : 1;
			if (p < o) continue;
			let m = f + 2.5 * (1 - p);
			m < c && (c = m, s = r);
		}
		return s;
	}
	_gather(e) {
		let t = this.sys, n = t.player.position, r = this._cands;
		r.length = 0;
		let i = t.enemies;
		for (let t = 0; t < i.length; t++) {
			let a = i[t];
			if (!a.targetable) continue;
			let o = Math.hypot(a.position.x - n.x, a.position.z - n.z);
			o > e || this.project(a) && (a._ndcX = this._ndc.x, a._lockDist = o, r.push(a));
		}
		return r;
	}
	onLockEvent(e) {
		e === "press" ? (this._lockedByPress = !1, this.lock || (this._lockedByPress = !0, this._lockFirst())) : e === "tap" ? (this.lock && !this._lockedByPress && this._lockNext(), this._lockedByPress = !1) : e === "hold" && this.release();
	}
	_lockFirst() {
		let e = this._gather(Zn.range), t = null, n = Infinity;
		for (let r = 0; r < e.length; r++) {
			let i = e[r], a = i._lockDist + 6 * Math.abs(i._ndcX);
			a < n && (n = a, t = i);
		}
		if (!t) {
			let e = this.sys.player.position;
			for (let r of this.sys.enemies) {
				if (!r.targetable) continue;
				let i = Math.hypot(r.position.x - e.x, r.position.z - e.z);
				i <= Zn.range && i < n && (n = i, t = r);
			}
		}
		t && this._set(t);
	}
	_lockNext() {
		let e = this._gather(Zn.range), t = this.lock, n = t && this.project(t) ? this._ndc.x : -Infinity, r = null;
		for (let i = 0; i < e.length; i++) {
			let a = e[i];
			a !== t && a._ndcX > n && (!r || a._ndcX < r._ndcX) && (r = a);
		}
		r ? this._set(r) : this.release();
	}
	_set(e) {
		this.lock !== e && (this.lock = e, this.sys.audio?.playSfx?.("confirm", {
			volume: .35,
			pitch: 1.4
		}));
	}
	release() {
		this.lock = null, this._lockedByPress = !1;
	}
	setBoss(e) {
		this.boss = e;
	}
	update(e, t) {
		let n = this.sys, r = n.player, i = r.position, a = this.lock;
		if (a) {
			let e = Math.hypot(a.position.x - i.x, a.position.z - i.z);
			if (a.targetable) e > Zn.breakAt && this.release();
			else {
				let e = this._gather(Zn.retarget), t = null;
				for (let n = 0; n < e.length; n++) e[n] !== a && (!t || e[n]._lockDist < t._lockDist) && (t = e[n]);
				this.lock = t;
			}
		}
		let o = this.lock, s = n.rig, c = this.boss ? "boss" : o ? "lock" : "player";
		if (c !== this.mode && (this.mode === "boss" && this._saved && (s.minDistance = this._saved.min, s.distanceTarget = this._saved.target, this._saved = null), c === "player" ? s.setTarget(r.sprite) : c === "lock" ? (this.lockFocus.copy(this.mode === "boss" ? this.bossFocus : i), s.setTarget(this.lockFocus)) : (this.bossFocus.copy(this.mode === "lock" ? this.lockFocus : i), this._saved = {
			min: s.minDistance,
			target: s.distanceTarget
		}, s.minDistance = Math.max(s.minDistance, Qn.minDistance), s.distanceTarget = Math.max(s.distanceTarget, Qn.minDistance), s.setTarget(this.bossFocus)), this.mode = c), this.mode === "lock" && o ? this._follow(this.lockFocus, o, Zn.focusShare, Zn.focusClamp, Zn.lambda, e) : this.mode === "boss" && this._follow(this.bossFocus, this.boss, Qn.share, Qn.clamp, Qn.lambda, e), o && t && n.pc.alive) {
			let e = o.position.x - i.x, t = o.position.z - i.z, n = Math.hypot(e, t);
			n > .001 && (this._face.x = e / n, this._face.z = t / n, r.faceOverride = this._face);
		} else r.faceOverride = null;
		let l = n.ui.combat?.labels;
		if (o) {
			if (l?.reticle(o.position, n.labelY(o) * .55), this._ring < 0 && (this._ring = n.markerAllocCore()), this._ring >= 0) {
				let e = n._markerSpec;
				e.shape = "ring", e.x = o.position.x, e.z = o.position.z, e.r = o.radius + .45, e.rInner = o.radius + .28, e.progress = 1, e.style = "lock", e.alpha = 1, n.markerSetCore(this._ring, e);
			}
		} else l?.reticle(null), this._ring >= 0 && (n.markerFreeCore(this._ring), this._ring = -1);
	}
	_follow(e, t, n, r, i, a) {
		let o = this.sys.player.position, s = 0, c = 0;
		if (t) {
			s = t.position.x - o.x, c = t.position.z - o.z;
			let e = Math.hypot(s, c);
			e > r && (s *= r / e, c *= r / e);
		}
		let l = te(i, a);
		e.x += (o.x + n * s - e.x) * l, e.z += (o.z + n * c - e.z) * l, e.y = o.y;
	}
	snap() {
		this.lockFocus.copy(this.sys.player.position), this.bossFocus.copy(this.sys.player.position);
	}
	reset() {
		this.release(), this.boss = null, this.update(0, !1);
	}
}, Rp = 64, zp = .4, Bp = .3, Vp = 2.2, Hp = 3, Up = 8, Wp = 24, Gp = .5, Kp = 40, qp = {
	coin1: {
		frame: "coin",
		color: [
			1.7,
			.95,
			.55
		],
		scale: 1.1,
		lift: .3
	},
	coin5: {
		frame: "coin",
		color: [
			1.9,
			1.9,
			2
		],
		scale: 1.2,
		lift: .3
	},
	coin25: {
		frame: "coin",
		color: [
			2.6,
			2,
			.75
		],
		scale: 1.4,
		lift: .3
	},
	heart: {
		frame: "heart",
		color: [
			2.6,
			.7,
			.65
		],
		scale: 1.4,
		lift: .4
	},
	mana: {
		frame: "mana",
		color: [
			.9,
			1.7,
			3
		],
		scale: 1.4,
		lift: .4
	},
	draught: {
		frame: "draught",
		color: [
			1.3,
			2.4,
			1
		],
		scale: 1.4,
		lift: .4
	},
	upgrade: {
		frame: "upgrade",
		color: [
			2.8,
			2.2,
			.9
		],
		scale: 1.5,
		lift: .5
	},
	core: {
		frame: "core",
		color: [
			3.2,
			1.5,
			.5
		],
		scale: 1.6,
		lift: .6
	}
}, Jp = Object.freeze(Object.keys(qp)), Yp = (e) => e.startsWith("coin"), Xp = class {
	constructor(e) {
		this.sys = e, this.items = [];
		for (let e = 0; e < Rp; e++) this.items.push({
			alive: !1,
			kind: "coin1",
			amount: 0,
			extra: "",
			x: 0,
			y: 0,
			z: 0,
			sx: 0,
			sy: 0,
			sz: 0,
			tx: 0,
			ty: 0,
			tz: 0,
			t: 0,
			apex: .8,
			magnet: !1,
			instant: !1,
			speed: 0,
			h: -1,
			serial: 0
		});
		this._serial = 0, this._count = 0, this._p = {
			x: 0,
			y: 0,
			z: 0,
			frame: "",
			index: 0,
			scale: 1,
			rot: 0,
			mode: "billboard",
			dirX: 0,
			dirZ: 1,
			r: 1,
			g: 1,
			b: 1,
			a: 1
		};
	}
	get count() {
		return this._count;
	}
	drop(e, t, n, r, i, a, o = "") {
		let s = this.sys, c = this._slot();
		if (c < 0) return -1;
		let l = a.next() * Math.PI * 2, u = .6 + .8 * a.next(), d = s.player.position, f = n + Math.cos(l) * u, p = i + Math.sin(l) * u, m = !s.standable(n, i);
		if (!s.standable(f, p)) {
			let e = d.x - n, t = d.z - i, r = Math.hypot(e, t), a = !1;
			for (let o = 0; o <= r; o += .25) {
				let c = n + e / (r || 1) * o, l = i + t / (r || 1) * o;
				if (s.standable(c, l)) {
					f = c, p = l, a = !0;
					break;
				}
			}
			a || (f = d.x, p = d.z);
		}
		let h = this.items[c];
		return h.alive = !0, h.kind = qp[e] ? e : "coin1", h.amount = t, h.extra = o, h.sx = n, h.sy = r + .6, h.sz = i, h.tx = f, h.tz = p, h.ty = s.groundAt(f, p), h.x = h.sx, h.y = h.sy, h.z = h.sz, h.t = 0, h.apex = .7 + .5 * a.next(), h.magnet = !1, h.instant = m, h.speed = 0, h.serial = ++this._serial, h.h = s.quads.alloc(), this._count++, this._write(h), c;
	}
	_slot() {
		let e = -1;
		for (let t = 0; t < Rp; t++) {
			let n = this.items[t];
			if (!n.alive) return t;
			Yp(n.kind) && (e < 0 || n.serial < this.items[e].serial) && (e = t);
		}
		return e >= 0 && this._free(this.items[e]), e;
	}
	update(e) {
		if (!this._count) return;
		let t = this.sys, n = t.player.position, r = t.pc.alive;
		for (let i = 0; i < Rp; i++) {
			let a = this.items[i];
			if (!a.alive) continue;
			if (a.t += e, a.t >= Kp) {
				this._free(a);
				continue;
			}
			let o = qp[a.kind];
			if (!a.magnet) {
				let e = Math.min(1, a.t / zp);
				if (a.x = a.sx + (a.tx - a.sx) * e, a.z = a.sz + (a.tz - a.sz) * e, a.y = a.sy + (a.ty + o.lift - a.sy) * e + a.apex * 4 * e * (1 - e), (a.instant || a.t >= Bp) && r && t.wantsPickup(a.kind)) {
					let e = (Yp(a.kind) ? Hp : Vp) * (a.instant ? 2 : 1), t = n.x - a.x, r = n.z - a.z;
					t * t + r * r < e * e && (a.magnet = !0);
				}
			} else if (r && !t.wantsPickup(a.kind)) this._rest(a);
			else if (r) {
				a.speed = Math.min(Up, a.speed + Wp * e);
				let t = n.x - a.x, r = n.z - a.z, i = n.y + .6 - a.y, o = Math.hypot(t, r, i), s = a.speed * e;
				if (o <= Gp || o <= s) {
					this._collect(a);
					continue;
				}
				a.x += t / o * s, a.y += i / o * s, a.z += r / o * s;
			}
			if (!a.magnet && a.t >= zp) {
				let e = n.x - a.x, i = n.z - a.z;
				if (r && e * e + i * i < Gp * Gp && t.wantsPickup(a.kind)) {
					this._collect(a);
					continue;
				}
			}
			this._write(a);
		}
	}
	_collect(e) {
		this.sys.collectPickup(e.kind, e.amount, e.extra, e.x, e.y, e.z) === !1 ? this._rest(e) : this._free(e);
	}
	_rest(e) {
		let t = this.sys, n = e.x, r = e.z;
		t.standable(n, r) || (n = t.player.position.x, r = t.player.position.z), e.magnet = !1, e.instant = !1, e.speed = 0, e.sx = e.tx = n, e.sz = e.tz = r, e.ty = t.groundAt(n, r), e.sy = e.ty + qp[e.kind].lift, e.t = Math.max(e.t, zp);
	}
	_write(e) {
		if (e.h < 0) return;
		let t = qp[e.kind], n = this._p, r = this.sys.atlasFrames?.[t.frame], i = !e.magnet && e.t >= zp;
		n.x = e.x, n.y = e.y + (i ? .06 * Math.sin((e.t + e.serial) * 3) : 0), n.z = e.z, n.frame = t.frame, n.index = r && r.n > 1 ? Math.floor((e.t + e.serial * .13) * (r.fps || 8)) % r.n : 0, n.scale = t.scale, n.rot = 0, n.mode = "billboard", n.r = t.color[0], n.g = t.color[1], n.b = t.color[2], n.a = e.t > 34 && Math.floor(e.t * 8) % 2 == 1 ? .35 : 1, this.sys.quads.set(e.h, n);
	}
	_free(e) {
		e.alive && (e.alive = !1, e.h >= 0 && this.sys.quads.free(e.h), e.h = -1, this._count--);
	}
	clear() {
		for (let e = 0; e < Rp; e++) this._free(this.items[e]);
	}
}, Zp = [
	[25, "coin25"],
	[5, "coin5"],
	[1, "coin1"]
];
function Qp(e, t, n) {
	return new y((v(e) ^ Math.imul(t + 1, 2654435761) ^ n) >>> 0);
}
function $p(e, t, n, r) {
	let [i, a] = e.gold ?? [0, 0];
	r.gold = a > 0 ? t.int(Math.round(i), Math.round(a)) : 0;
	let o = e.drops ?? {}, s = Math.min(1, (o.heart ?? 0) * (n ? 2 : 1));
	return r.heart = t.next() < s || !!e.guaranteedHeart, r.mana = t.next() < (o.mana ?? 0), r.draught = t.next() < (o.draught ?? 0), r;
}
function em(e, t) {
	let n = 0, r = Math.max(0, Math.floor(e));
	for (let [e, i] of Zp) for (; r >= e && n < 6;) t[n].kind = i, t[n].amount = e, n++, r -= e;
	return r > 0 && n > 0 && (t[n - 1].amount += r), n;
}
//#endregion
//#region src/game/combat/Waystones.js
var tm = .25, nm = 12, rm = (e) => e?.place ? S(`combat.place.${e.place}`) : e?.unnamed ? S("game.default.waystone") : Ne(String(e?.name ?? "")), im = class {
	constructor(e) {
		this.sys = e;
		let t = e.level;
		this.list = t.objects.filter((e) => e.type === "waystone").map((e) => ({
			id: e.id,
			name: String(e.name || "Waystone"),
			unnamed: !e.name,
			x: e.x,
			z: e.z,
			stand: {
				x: e.x,
				z: e.z + er.stand
			},
			it: null,
			prop: null,
			obj: e,
			absent: !1
		}));
		let n = t.spawn ?? {
			x: t.width / 2,
			z: t.depth / 2
		}, r = this.list.some((e) => Math.hypot(e.x - n.x, e.z - n.z) <= nm);
		this.spawnPoint = {
			id: "spawn",
			name: r ? "the camp" : "the start",
			place: r ? "camp" : "start",
			x: n.x,
			z: n.z,
			stand: {
				x: n.x,
				z: n.z
			},
			it: null,
			prop: null,
			obj: null,
			absent: !1
		}, this.checkpoint = this.spawnPoint, this._t = 0;
	}
	bind(e) {
		for (let t of e) {
			if (t.kind !== "waystone") continue;
			let e = this.list.find((e) => e.id === (t.object?.id ?? t.id));
			e && (e.it = t, e.prop = t.prop ?? null, t.label = "Rest", t.onInteract = () => this.rest(e));
		}
	}
	byId(e) {
		return e === "spawn" ? this.spawnPoint : this.list.find((t) => t.id === e) ?? null;
	}
	update(e) {
		if (this._t -= e, this._t > 0) return;
		this._t = tm;
		let t = this.sys;
		if (!t.pc.alive) return;
		let n = t.player.position;
		for (let e of this.list) if (!(e === this.checkpoint || e.absent) && Math.hypot(e.x - n.x, e.z - n.z) <= er.attune && Math.abs(t.groundAt(e.x, e.z) - n.y) < 1.3) {
			this.attune(e);
			break;
		}
	}
	attune(e, { silent: t = !1 } = {}) {
		if (!e || e === this.checkpoint || e.absent) return;
		let n = this.checkpoint;
		if (this.checkpoint = e, n.prop?.setAttuned?.(!1), e.prop?.setAttuned?.(!0), !t && e !== this.spawnPoint) {
			let t = this.sys;
			t.ui.hud.toast(S("combat.waystone.attuned", { place: rm(e) }), 2.2), t.sfxAt("waystone", e.x, e.z, { volume: .9 }), t.events.emit("attuned", e.id);
		}
	}
	async rest(e, { instant: t = !1 } = {}) {
		let n = this.sys, r = n.ui;
		return e.absent ? !1 : n.engaged ? (r.hud.toast(S("combat.waystone.silent"), 2.4), n.audio.playSfx("cancel", { volume: .5 }), !1) : (this.attune(e), t || await r.fader.fadeOut(.6), e.absent ? (t || await r.fader.fadeIn(.4), !1) : (n.restAll(), t || (n.sfxAt("waystone", e.x, e.z, { volume: .8 }), await r.fader.fadeIn(.8)), r.hud.toast(S("combat.waystone.rested", { place: rm(e) }), 2.2), !0));
	}
	setAbsent(e, t) {
		e.absent !== t && (e.absent = t, t && this.checkpoint === e && (e.prop?.setAttuned?.(!1), this.checkpoint = this.spawnPoint));
	}
	reset() {
		for (let e of this.list) e.prop?.setAttuned?.(!1);
		this.checkpoint = this.spawnPoint, this._t = 0;
	}
}, am = class {
	constructor(e) {
		this.sys = e, this.list = e.level.objects.filter((e) => e.type === "chest").map((e) => {
			let t = {
				id: e.id,
				x: e.x,
				z: e.z,
				rotation: Number(e.rotation) || 0,
				gold: Math.max(0, Math.round(Number(e.gold) || 0)),
				potions: Math.max(0, Math.round(Number(e.potions) || 0)),
				upgrade: [
					"maxHp",
					"maxMp",
					"attack"
				].includes(e.upgrade) ? e.upgrade : "none",
				opened: !1,
				discovered: !1,
				it: null,
				prop: null,
				marker: {
					x: e.x,
					z: e.z,
					kind: "chest"
				},
				obj: e,
				absent: !1
			};
			return Object.defineProperty(t.marker, "hidden", {
				get: () => t.absent,
				enumerable: !0
			}), t;
		}), this.markers = null, this._t = 0;
	}
	bind(e) {
		for (let t of e) {
			if (t.kind !== "chest") continue;
			let e = this.list.find((e) => e.id === (t.object?.id ?? t.id));
			e && (e.it = t, e.prop = t.prop ?? null, t.label = "Open", t.onInteract = () => this.open(e), e.opened && (t.disabled = !0));
		}
	}
	update(e) {
		if (this._t -= e, this._t > 0) return;
		this._t = .25;
		let t = this.sys, n = t.player.position;
		for (let e of this.list) {
			if (e.discovered || e.absent) continue;
			let r = Math.hypot(e.x - n.x, e.z - n.z);
			(r <= tr.near || r <= tr.los && t.los(n.x, n.z, e.x, e.z)) && this.discover(e);
		}
	}
	discover(e) {
		e.discovered || (e.discovered = !0, this.markers && !this.markers.includes(e.marker) && this.markers.push(e.marker), this.sys.events.emit("chestFound", e.id));
	}
	open(e) {
		if (!e || e.opened || e.absent) return !1;
		let t = this.sys;
		e.opened = !0, e.it && (e.it.disabled = !0), this.discover(e), e.prop?.open?.(), t.sfxAt("chestOpen", e.x, e.z, { volume: 1 });
		let n = new y((v(`chest:${e.id}`) ^ t.seedValue) >>> 0), r = t.groundAt(e.x, e.z);
		t.dropGold(e.gold, e.x, r + .3, e.z, n);
		for (let i = 0; i < Math.min(5, e.potions); i++) t.pickups.drop("draught", 1, e.x, r + .3, e.z, n);
		return e.upgrade !== "none" && t.pickups.drop("upgrade", 1, e.x, r + .3, e.z, n, e.upgrade), t.burst("sparkle", e.x, r + .7, e.z, 12), !0;
	}
}, om = .6, sm = [
	1.5,
	.75,
	.25
], cm = class {
	constructor(e, t, n = null) {
		this.sys = t;
		let r = n?.wall === void 0 ? {} : n.wall, i = Array.isArray(r?.color) && r.color.length >= 3 && r.color.every(Number.isFinite) ? r.color : sm;
		this.wall = r === null ? null : {
			frame: typeof r.frames == "string" && r.frames ? r.frames : "wallFlame",
			color: i
		}, this.outline = n?.outline ?? "barrier", this.emitter = n?.emitter === void 0 ? "embers" : n.emitter, this.groupId = e.id ?? "";
		let a = Number(e.x) || 0, o = Number(e.z) || 0, s = e.arena && [
			"minX",
			"maxX",
			"minZ",
			"maxZ"
		].every((t) => Number.isFinite(e.arena[t])) ? e.arena : {
			minX: -8,
			maxX: 8,
			minZ: -6,
			maxZ: 6
		};
		this.rect = {
			minX: a + Math.min(s.minX, s.maxX),
			maxX: a + Math.max(s.minX, s.maxX),
			minZ: o + Math.min(s.minZ, s.maxZ),
			maxZ: o + Math.max(s.minZ, s.maxZ)
		};
		let c = Array.isArray(e.gate) && e.gate.length >= 4 && e.gate.every(Number.isFinite) ? e.gate : [
			-2,
			this.rect.maxZ - o,
			2,
			this.rect.maxZ - o
		];
		this.gate = [
			a + c[0],
			o + c[1],
			a + c[2],
			o + c[3]
		], this.center = {
			x: (this.rect.minX + this.rect.maxX) / 2,
			z: (this.rect.minZ + this.rect.maxZ) / 2
		}, this.y = t.groundAt(this.center.x, this.center.z), this.active = !1, this.present = !0, this._flames = [], this._barrier = -1, this._t = 0, this._p = {
			x: 0,
			y: 0,
			z: 0,
			frame: this.wall?.frame ?? "wallFlame",
			index: 0,
			scale: 1,
			rot: 0,
			mode: "billboard",
			dirX: 0,
			dirZ: 1,
			r: i[0],
			g: i[1],
			b: i[2],
			a: 1
		};
	}
	contains(e, t) {
		let n = this.rect;
		return e >= n.minX && e <= n.maxX && t >= n.minZ && t <= n.maxZ;
	}
	containsGrown(e, t, n) {
		let r = this.rect;
		return e > r.minX - n && e < r.maxX + n && t > r.minZ - n && t < r.maxZ + n;
	}
	close() {
		if (this.active) return;
		this.active = !0, this._t = 0;
		let e = this.sys, [t, n, r, i] = this.gate, a = Math.hypot(r - t, i - n), o = this.wall ? Math.max(1, Math.round(a / om) + 1) : 0, s = this.wall?.color ?? sm;
		for (let a = 0; a < o; a++) {
			let c = e.quads.alloc();
			if (c < 0) break;
			let l = o === 1 ? .5 : a / (o - 1), u = a * .618034 % 1, d = (a * .381966 + .5) % 1;
			this._flames.push({
				h: c,
				i: a,
				x: t + (r - t) * l,
				z: n + (i - n) * l,
				phase: a * .37,
				r: s[0] * (.88 + .24 * u),
				g: s[1] * (.8 + .34 * d),
				b: s[2]
			});
		}
		this._barrier = e.markerAllocCore(), this._writeBarrier(), this.update(0), e.sfxAt("gateClose", (t + r) / 2, (n + i) / 2, { volume: 1 });
	}
	open() {
		let e = this.sys;
		for (let t of this._flames) e.quads.free(t.h);
		this._flames.length = 0, this._barrier >= 0 && e.markerFreeCore(this._barrier), this._barrier = -1, this.active = !1;
	}
	deathBursts(e) {
		let t = this.sys, n = e.position, r = t.player?.position ?? n, i = t.fx?.viewX ?? 0, a = t.fx?.viewZ ?? -1, o = n.x - r.x, s = n.z - r.z, c = Math.hypot(o, s);
		c > .001 ? (o /= c, s /= c) : (o = i, s = a);
		let l = n.x + o * 1 + i * .5, u = n.z + s * 1 + a * .5, d = n.y + (e.def?.body?.[1] ?? 3.6), f = -a, p = i;
		for (let e = 0; e < 3; e++) {
			let n = (e - 1) * .9;
			t.burst("victoryEmbers", l + f * n, d - 1.4 + (e === 1 ? .5 : 0), u + p * n, 12);
		}
		t.burst("victorySparkle", l, d + .2, u, 12);
	}
	_writeBarrier() {
		if (this._barrier < 0) return;
		let e = this.sys._markerSpec, t = this.rect;
		e.shape = "rect", e.x = this.center.x, e.z = this.center.z, e.w = t.maxX - t.minX, e.d = t.maxZ - t.minZ, e.dirX = 0, e.dirZ = 1, e.progress = 1, e.style = this.outline, e.alpha = 1, this.sys.markerSetCore(this._barrier, e);
	}
	update(e) {
		if (!this.active) return;
		this._t += e;
		let t = this.sys, n = this._p, r = t.atlasFrames?.[n.frame], i = r?.n ?? 1, a = r?.fps || 10, o = n.frame === "wallFlame", s = !o && r ? r.h / 32 - .03 : .72;
		for (let e of this._flames) n.x = e.x, n.z = e.z, n.y = t.groundAt(e.x, e.z) + s, n.index = o ? Math.floor((this._t + e.phase) * a) % i : e.i % i, n.scale = o ? 1 + .08 * Math.sin((this._t + e.phase) * 7) : 1, n.r = e.r, n.g = e.g, n.b = e.b, t.quads.set(e.h, n);
	}
	clamp(e, t = .35) {
		let n = this.rect, r = Math.min(n.maxX - t, Math.max(n.minX + t, e.x)), i = Math.min(n.maxZ - t, Math.max(n.minZ + t, e.z)), a = r !== e.x || i !== e.z;
		return e.x = r, e.z = i, a;
	}
}, lm = {
	slash: {
		frame: "slash",
		mode: "flat",
		lift: .8,
		color: [
			1.8,
			1.8,
			1.55
		],
		loops: 1,
		scale: 1
	},
	slashBig: {
		frame: "slashBig",
		mode: "flat",
		lift: .8,
		color: [
			1.95,
			1.7,
			1.2
		],
		loops: 1,
		scale: 1
	},
	thrust: {
		frame: "thrust",
		mode: "flat",
		lift: .85,
		color: [
			1.8,
			1.8,
			1.7
		],
		loops: 1,
		scale: 1,
		rot: Math.PI / 2
	},
	spin: {
		frame: "spin",
		mode: "flat",
		lift: .7,
		color: [
			1.7,
			1.6,
			1.2
		],
		loops: 2,
		scale: 1.1
	},
	impact: {
		frame: "impact",
		mode: "billboard",
		lift: 1,
		color: [
			2.2,
			2,
			1.5
		],
		loops: 1,
		scale: 1.2
	},
	crit: {
		frame: "crit",
		mode: "billboard",
		lift: 1,
		color: [
			2.6,
			2.1,
			.8
		],
		loops: 1,
		scale: 1.3
	},
	dust: {
		frame: "dust",
		mode: "billboard",
		lift: .3,
		color: [
			1,
			.95,
			.85
		],
		loops: 1,
		scale: 1.4
	},
	stun: {
		frame: "stun",
		mode: "billboard",
		lift: 1.6,
		color: [
			3,
			2.6,
			.8
		],
		loop: !0,
		duration: 2,
		scale: 1
	},
	pillar: {
		frame: "pillar",
		mode: "billboard",
		lift: 2,
		color: [
			1.05,
			.82,
			.32
		],
		loop: !0,
		duration: 1,
		scale: .85,
		back: .5
	},
	swarmBurst: {
		frame: "swarmBurst",
		mode: "flat",
		lift: .06,
		color: [
			2,
			.85,
			.28
		],
		loops: 1,
		scale: 1.2
	}
}, um = Object.freeze(Object.keys(lm)), dm = 128, fm = [
	1,
	1,
	1
], pm = class {
	constructor(e, t) {
		this.quads = e, this.frames = t?.frames ?? {}, this._live = [], this._pool = [];
		for (let e = 0; e < dm; e++) this._pool.push({
			h: -1,
			def: null,
			name: "",
			t: 0,
			x: 0,
			y: 0,
			z: 0,
			dirX: 0,
			dirZ: 1,
			scale: 1,
			flip: !1,
			follow: null,
			followY: 0,
			duration: 0,
			n: 1,
			fps: 30,
			own: {
				frame: "",
				mode: "billboard",
				lift: 0,
				color: fm,
				loops: 1,
				loop: !1,
				duration: 1,
				scale: 1,
				rot: 0,
				back: 0,
				spin: 0,
				grow: 0
			}
		});
		this._p = {
			x: 0,
			y: 0,
			z: 0,
			frame: "",
			index: 0,
			scale: 1,
			rot: 0,
			mode: "billboard",
			dirX: 0,
			dirZ: 1,
			r: 1,
			g: 1,
			b: 1,
			a: 1,
			flipX: !1
		}, this.viewX = 0, this.viewZ = -1;
	}
	get count() {
		return this._live.length;
	}
	play(e, t, n, r, i) {
		let a = Object.hasOwn(lm, e) ? lm[e] : null;
		if (!a && !Object.hasOwn(this.frames, e) || !this._pool.length) return !1;
		let o = this.quads.alloc();
		if (o < 0) return !1;
		let s = this._pool.pop(), c = a;
		c || (c = s.own, c.frame = e, c.mode = i?.mode === "flat" || i?.mode === "screen" ? i.mode : "billboard", c.lift = mm(i?.lift, 0), c.color = Array.isArray(i?.color) && i.color.length >= 3 ? i.color : fm, c.loop = !!i?.loop, c.loops = Math.max(1, mm(i?.loops, 1)), c.duration = Math.max(.05, mm(i?.duration, 1)), c.scale = 1, c.rot = mm(i?.rot, 0), c.back = mm(i?.back, 0), c.spin = mm(i?.spin, 0), c.grow = mm(i?.grow, 0));
		let l = this.frames[c.frame];
		return s.h = o, s.def = c, s.name = e, s.t = 0, s.x = t, s.y = n, s.z = r, s.dirX = i?.dirX ?? 0, s.dirZ = i?.dirZ ?? 1, s.scale = (i?.scale ?? 1) * c.scale, s.flip = !!i?.flip, s.follow = i?.follow ?? null, s.followY = s.follow ? n - s.follow.y : 0, s.duration = i?.duration ?? c.duration ?? 0, s.n = Math.max(1, l?.n ?? 1), s.fps = !a && i?.fps > 0 ? i.fps : l?.fps > 0 ? l.fps : 12, this._live.push(s), this._write(s), !0;
	}
	stopFollowing(e) {
		for (let t = this._live.length - 1; t >= 0; t--) this._live[t].follow === e && this._kill(t);
	}
	update(e) {
		for (let t = this._live.length - 1; t >= 0; t--) {
			let n = this._live[t];
			n.t += e;
			let r = n.def;
			(r.loop ? n.t >= n.duration : n.t * n.fps >= n.n * (r.loops ?? 1)) ? this._kill(t) : (e > 0 || n.follow) && this._write(n);
		}
	}
	_write(e) {
		let t = e.def, n = this._p, r = Math.floor(e.t * e.fps + 1e-6) % e.n;
		e.follow && (e.x = e.follow.x, e.y = e.follow.y + e.followY, e.z = e.follow.z), n.x = e.x + (t.back ? this.viewX * t.back : 0), n.y = e.y + t.lift, n.z = e.z + (t.back ? this.viewZ * t.back : 0), n.frame = t.frame, n.index = r, n.scale = t.grow ? e.scale * (1 + t.grow * e.t) : e.scale, n.rot = (t.rot ?? 0) + (t.spin ? t.spin * e.t : 0), n.flipX = e.flip, n.mode = t.mode, n.dirX = e.dirX, n.dirZ = e.dirZ, n.r = t.color[0], n.g = t.color[1], n.b = t.color[2], n.a = t.loop ? 1 : Math.min(1, 1.6 - e.t * e.fps / (e.n * (t.loops ?? 1))), this.quads.set(e.h, n);
	}
	_kill(e) {
		let t = this._live[e];
		this.quads.free(t.h), t.h = -1, t.follow = null, this._live[e] = this._live[this._live.length - 1], this._live.pop(), this._pool.push(t);
	}
	clear() {
		for (let e = this._live.length - 1; e >= 0; e--) this._kill(e);
	}
};
function mm(e, t) {
	return typeof e == "number" && Number.isFinite(e) ? e : t;
}
//#endregion
//#region src/game/combat/CombatMusic.js
var hm = .8, gm = 4, _m = {
	battle: 1.2,
	emberfall: 2,
	boss: 1.5
}, vm = 4, ym = Object.freeze({
	hushfight: Object.freeze({ regional: !0 }),
	guardian: Object.freeze({
		battle: "A",
		phases: Object.freeze([
			"A",
			"B",
			"C"
		]),
		release: !0
	}),
	hushedking: Object.freeze({
		battle: "A",
		phases: Object.freeze([
			"A",
			"B",
			"C"
		]),
		release: !0
	})
}), bm = (e) => ye(xe, e) ?? ye(ym, e), xm = class {
	constructor(e, t) {
		this.audio = e, this._env = typeof t == "function" ? t : () => t, this.enabled = this._env()?.music !== !1, this._tracksOf = null, this._tracks = null, this.reset();
	}
	get tracks() {
		let e = this._env();
		return (e !== this._tracksOf || !this._tracks) && (this._tracksOf = e, this._tracks = Object.freeze({
			emberfall: Ae(e, "explore"),
			battle: Ae(e, "battle"),
			boss: Ae(e, "boss")
		})), this._tracks;
	}
	get musicTrack() {
		return this.tracks[this.track];
	}
	reset() {
		this.track = "emberfall", this._engaged = 0, this._calm = gm, this._victory = -1, this._requested = null, this._requestedName = null, this._silenced = !1, this._wasPlaying = !1, this._section = "A";
	}
	update(e, t, n) {
		this._victory >= 0 ? (this._victory -= e, this._victory < 0 && (this.track = "emberfall")) : n ? (this.track = "boss", this._engaged = hm, this._calm = 0) : t ? (this._engaged += e, this._calm = 0, this._engaged >= .799999 && (this.track = "battle")) : (this._calm += e, this._engaged = 0, this._calm >= 3.999999 && (this.track = "emberfall")), this._apply();
	}
	_roleSection(e) {
		let t = bm(this.tracks[e]);
		return e === "boss" ? t || this._section !== "A" ? this._section : null : t ? e === "battle" ? t.regional ? this.tracks.emberfall : t.battle ?? null : t.explore ?? null : null;
	}
	_apply() {
		let e = this.audio;
		if (!this.enabled || this._silenced || !e.musicPlaying) {
			this._requested = null;
			return;
		}
		let t = this.tracks[this.track];
		if (this.track === this._requested && t === this._requestedName) return;
		this._requested = this.track, this._requestedName = t;
		let n = this._roleSection(this.track);
		e.musicTrack === t ? n && e.setMusicSection?.(n) : e.startMusic({
			track: t,
			fade: _m[this.track] ?? 1.5,
			...n ? { section: n } : {}
		});
	}
	setSection(e) {
		this._section = e, this.track === "boss" && this.audio.musicPlaying && this.audio.setMusicSection?.(e);
	}
	setPhase(e) {
		let t = Math.max(1, Math.floor(Number(e)) || 1), n = bm(this.tracks.boss)?.phases;
		this.setSection(n ? n[Math.min(n.length, t) - 1] : t >= 2 ? "B" : "A");
	}
	victory() {
		if (this._section = "A", bm(this.tracks.boss)?.release) {
			this._victory = -1, this.track = "emberfall", this._requested = "emberfall", this._requestedName = this.tracks.emberfall, this.enabled && this.audio.musicPlaying && this.audio.startMusic({
				track: this.tracks.emberfall,
				fade: vm
			});
			return;
		}
		this.enabled && this.audio.musicPlaying && this.audio.playStinger?.("victory", { duck: 0 }), this._victory = 10;
	}
	death() {
		this._wasPlaying = this.audio.musicPlaying, this._silenced = !0, this._wasPlaying && this.audio.stopMusic({ fade: 1.5 });
	}
	respawn() {
		if (this._silenced = !1, this.track = "emberfall", this._engaged = 0, this._calm = gm, this._section = "A", this._requested = null, this._wasPlaying && this.enabled) {
			this.audio.startMusic({
				track: this.tracks.emberfall,
				fade: 2
			}), this._requested = "emberfall", this._requestedName = this.tracks.emberfall;
			let e = this._roleSection("emberfall");
			e && this.audio.setMusicSection?.(e);
		}
		this._wasPlaying = !1;
	}
}, Sm = Object.freeze({
	close: Object.freeze({
		leash: 4,
		standoff: 2.4
	}),
	mid: Object.freeze({
		leash: 8,
		standoff: 4.5
	}),
	far: Object.freeze({
		leash: 13,
		standoff: 7
	})
}), Cm = Object.freeze({
	never: 0,
	low: .3,
	half: .5,
	often: .75
}), wm = Object.freeze({
	never: 0,
	low: .25,
	half: .5
}), Tm = Object.freeze({
	warden: Object.freeze({
		hp: 82,
		mp: 30,
		atk: 6,
		def: 3.5,
		perLevel: Object.freeze({
			hp: 8,
			mp: 3,
			atk: 1.4,
			def: .7
		}),
		walk: 3.2,
		run: 5.8
	}),
	ranger: Object.freeze({
		hp: 62,
		mp: 30,
		atk: 7,
		def: 2,
		perLevel: Object.freeze({
			hp: 6.5,
			mp: 3,
			atk: 1.7,
			def: .5
		}),
		walk: 3.2,
		run: 5.8
	}),
	mystic: Object.freeze({
		hp: 58,
		mp: 60,
		atk: 6.5,
		def: 2,
		perLevel: Object.freeze({
			hp: 6,
			mp: 6,
			atk: 1.6,
			def: .5
		}),
		walk: 3.2,
		run: 5.8
	}),
	cleric: Object.freeze({
		hp: 64,
		mp: 72,
		atk: 6,
		def: 2.6,
		perLevel: Object.freeze({
			hp: 7,
			mp: 7,
			atk: 1.5,
			def: .6
		}),
		walk: 3.2,
		run: 5.8
	}),
	icemage: Object.freeze({
		hp: 56,
		mp: 74,
		atk: 7,
		def: 2,
		perLevel: Object.freeze({
			hp: 6.2,
			mp: 7.5,
			atk: 1.9,
			def: .5
		}),
		walk: 3.2,
		run: 5.8
	}),
	greatshield: Object.freeze({
		hp: 108,
		mp: 32,
		atk: 6,
		def: 6,
		perLevel: Object.freeze({
			hp: 12,
			mp: 3,
			atk: 1.4,
			def: 1.2
		}),
		walk: 3,
		run: 5.6
	})
}), Em = Object.freeze([
	"cleric",
	"icemage",
	"greatshield"
]), $ = Object.freeze({
	partyAtk: Object.freeze([
		1,
		.85,
		.72
	]),
	healerPace: 2,
	radius: .3,
	body: Object.freeze([0, 1.8]),
	mass: 3,
	planEvery: .25,
	calm: 2,
	regen: .1,
	getUp: .3,
	getUpFrames: 24,
	mpRegen: .8,
	hold: 1.8,
	holdReplan: 1,
	holdSlack: 1,
	holdStop: .35,
	leashSlack: .75,
	noReach: 1,
	relocEvery: .8,
	leadMax: 3,
	leadTau: .1,
	retreat: 2.6,
	runFrom: 2.4,
	roll: Object.freeze({
		total: 20,
		iframes: Object.freeze([1, 13]),
		dist: 3,
		moveFrames: 15,
		cooldown: 1.1,
		poses: Object.freeze([
			Object.freeze([
				0,
				2,
				"tuck"
			]),
			Object.freeze([
				3,
				12,
				"roll"
			]),
			Object.freeze([
				13,
				19,
				"tuck"
			])
		])
	}),
	evadeFill: .3,
	hurt: Object.freeze({
		total: 14,
		slide: 10,
		iframes: .5
	}),
	knockdown: Object.freeze({
		down: 36,
		getUp: 18,
		slide: 14,
		iframes: .6,
		kb: 2.5
	}),
	kbCap: 3,
	assistMemory: 4,
	assistNear: 3,
	pathEvery: .3,
	pathMax: 36,
	stuckPath: .5,
	stuckGiveUp: 2,
	skipFor: 3,
	threat: 1.25,
	rangedAggro: 10,
	holdTarget: 2.5,
	checkTarget: .5,
	playerNearer: .6,
	arenaPull: 12
}), Dm = (...e) => Object.freeze(e.map((e) => Object.freeze(e))), Om = (e, t) => Object.freeze([e, t]), km = Object.freeze({
	warden: Object.freeze({
		reach: 1.35,
		combo: Object.freeze([Object.freeze({
			total: 20,
			poses: Object.freeze([
				Object.freeze([
					0,
					6,
					"wind"
				]),
				Object.freeze([
					7,
					11,
					"thrust"
				]),
				Object.freeze([
					12,
					19,
					"follow"
				])
			]),
			active: Object.freeze([7, 9]),
			r: 1.7,
			halfAngle: 35,
			mv: 1,
			kb: .5,
			poise: 10,
			lunge: .3,
			lungeFrames: Object.freeze([4, 8]),
			fxAt: 7,
			fx: "thrust",
			sfx: "swing"
		}), Object.freeze({
			total: 26,
			poses: Object.freeze([
				Object.freeze([
					0,
					8,
					"wind"
				]),
				Object.freeze([
					9,
					13,
					"thrust"
				]),
				Object.freeze([
					14,
					25,
					"follow"
				])
			]),
			active: Object.freeze([9, 11]),
			r: 1.8,
			halfAngle: 35,
			mv: 1.3,
			kb: 1.2,
			poise: 16,
			lunge: .45,
			lungeFrames: Object.freeze([6, 10]),
			fxAt: 9,
			fx: "thrust",
			sfx: "swingHeavy"
		})]),
		comboGap: .75,
		skill: Object.freeze({
			id: "sweep",
			name: "Sweep",
			mp: 10,
			cooldown: 7,
			total: 32,
			pose: "spin",
			active: Object.freeze([10, 13]),
			r: 2.2,
			mv: 1.3,
			kb: 2.2,
			poise: 30,
			armor: 16,
			minFoes: 2
		}),
		mend: Object.freeze({
			mp: 10,
			cooldown: 6,
			total: 34,
			at: 20,
			frac: .25,
			flat: 6,
			range: 8
		})
	}),
	ranger: Object.freeze({
		basic: Object.freeze({
			total: 26,
			poses: Object.freeze([Object.freeze([
				0,
				15,
				"aim"
			]), Object.freeze([
				16,
				25,
				"follow"
			])]),
			release: 14,
			speed: 16,
			range: 12,
			radius: .25,
			mv: 1,
			kb: .4,
			poise: 6,
			cooldown: .5
		}),
		skill: Object.freeze({
			id: "volley",
			name: "Volley",
			mp: 9,
			cooldown: 7,
			total: 32,
			release: 18,
			n: 3,
			spread: 12,
			speed: 16,
			range: 12,
			radius: .25,
			mv: .9,
			kb: .6,
			poise: 8,
			minFoes: 2,
			poses: Object.freeze([Object.freeze([
				0,
				19,
				"aim"
			]), Object.freeze([
				20,
				31,
				"follow"
			])])
		}),
		mend: Object.freeze({
			mp: 10,
			cooldown: 6,
			total: 34,
			at: 20,
			frac: .25,
			flat: 6,
			range: 8
		})
	}),
	mystic: Object.freeze({
		basic: Object.freeze({
			total: 26,
			poses: Object.freeze([Object.freeze([
				0,
				17,
				"cast"
			]), Object.freeze([
				18,
				25,
				"follow"
			])]),
			release: 14,
			speed: 12,
			range: 11,
			radius: .3,
			mv: 1.15,
			kb: .6,
			poise: 10,
			cooldown: .75,
			splash: Object.freeze({
				r: .8,
				mv: .45
			})
		}),
		skill: Object.freeze({
			id: "flare",
			name: "Flare",
			mp: 12,
			cooldown: 8,
			total: 30,
			at: 16,
			pose: "cast",
			delay: .7,
			r: 1.9,
			mv: 2.2,
			kb: 1.5,
			poise: 35,
			range: 10,
			minFoes: 2
		}),
		mend: Object.freeze({
			mp: 12,
			cooldown: 4.5,
			total: 30,
			at: 18,
			frac: .35,
			flat: 10,
			range: 9
		})
	}),
	cleric: Object.freeze({
		mpRegen: 2.5,
		critical: .25,
		basic: Object.freeze({
			id: "holyBolt",
			total: 26,
			poses: Dm([
				0,
				15,
				"cast"
			], [
				16,
				25,
				"follow"
			]),
			release: 14,
			speed: 11,
			range: 11,
			radius: .3,
			mv: 1.15,
			kb: .5,
			poise: 10,
			cooldown: .7,
			turn: 5,
			splash: Object.freeze({
				r: 1,
				mv: .45
			}),
			chill: 0,
			slow: 0
		}),
		skill: Object.freeze({
			id: "judgement",
			name: "Judgement",
			mp: 18,
			cooldown: 12,
			total: 40,
			at: 18,
			keep: .35,
			poses: Dm([
				0,
				24,
				"cast"
			], [
				25,
				39,
				"follow"
			]),
			range: 10,
			minFoes: 2,
			r: 3.5,
			delay: .45,
			ring: 2.3,
			pillars: 6,
			every: .06,
			pillarR: 1.3,
			pillarMv: .95,
			pillarKb: .5,
			pillarPoise: 12,
			final: Object.freeze({
				delay: .16,
				r: 3.5,
				mv: 1.5,
				kb: 1.6,
				poise: 30,
				stop: 4
			})
		}),
		skill2: Object.freeze({
			id: "sanctuary",
			name: "Sanctuary",
			mp: 26,
			cooldown: 24,
			total: 48,
			at: 26,
			poses: Dm([
				0,
				30,
				"cast"
			], [
				31,
				47,
				"follow"
			]),
			range: 9,
			r: 4,
			duration: 4,
			ticks: 8,
			frac: .4,
			flat: 16,
			ward: .3,
			wardFor: 6,
			minHurt: 2,
			lift: .2,
			crowd: 4
		}),
		mend: Object.freeze({
			mp: 14,
			cooldown: 4,
			total: 30,
			at: 18,
			frac: .45,
			flat: 16,
			range: 10
		}),
		revive: Object.freeze({
			id: "revive",
			mp: 24,
			cooldown: 10,
			total: 66,
			at: 50,
			poses: Dm([
				0,
				34,
				"tuck"
			], [
				35,
				56,
				"cast"
			], [
				57,
				65,
				"follow"
			]),
			frac: .4,
			range: 1.6,
			reach: 9,
			safe: 2.5,
			iframes: 1.5,
			brave: 6
		})
	}),
	icemage: Object.freeze({
		basic: Object.freeze({
			id: "frostLance",
			total: 24,
			poses: Dm([
				0,
				13,
				"cast"
			], [
				14,
				23,
				"follow"
			]),
			release: 12,
			speed: 17,
			range: 12,
			radius: .26,
			mv: 1.25,
			kb: .4,
			poise: 8,
			cooldown: .65,
			turn: 0,
			splash: null,
			chill: 2.5,
			slow: .3,
			refresh: .5
		}),
		skill: Object.freeze({
			id: "blizzard",
			name: "Blizzard",
			mp: 20,
			cooldown: 12,
			total: 40,
			at: 20,
			poses: Dm([
				0,
				26,
				"cast"
			], [
				27,
				39,
				"follow"
			]),
			range: 11,
			minFoes: 3,
			r: 4,
			duration: 4,
			every: .8,
			mv: .55,
			kb: .15,
			poise: 6,
			chill: 1.2,
			slow: .5
		}),
		skill2: Object.freeze({
			id: "glacialTomb",
			name: "Glacial Tomb",
			mp: 24,
			cooldown: 16,
			total: 44,
			at: 22,
			poses: Dm([
				0,
				14,
				"cast"
			], [
				15,
				30,
				"thrust"
			], [
				31,
				43,
				"follow"
			]),
			range: 10,
			minFoes: 3,
			r: 3.5,
			delay: .5,
			spikes: 14,
			mv: 2.4,
			kb: .3,
			poise: 40,
			freeze: 2.5,
			stop: 4,
			hold: .9
		}),
		mend: null,
		revive: null
	}),
	greatshield: Object.freeze({
		reach: 1.4,
		combo: Object.freeze([Object.freeze({
			total: 22,
			poses: Dm([
				0,
				6,
				"wind"
			], [
				7,
				11,
				"thrust"
			], [
				12,
				21,
				"follow"
			]),
			active: Om(7, 9),
			r: 1.6,
			halfAngle: 50,
			mv: .9,
			kb: 1.4,
			poise: 24,
			lunge: .4,
			lungeFrames: Om(4, 8),
			fxAt: 7,
			fx: "thrust",
			sfx: "shieldBash",
			stun: .5
		}), Object.freeze({
			total: 28,
			poses: Dm([
				0,
				8,
				"backhand"
			], [
				9,
				13,
				"slash"
			], [
				14,
				27,
				"follow"
			]),
			active: Om(9, 11),
			r: 1.8,
			halfAngle: 65,
			mv: 1.5,
			kb: 1.1,
			poise: 26,
			lunge: .25,
			lungeFrames: Om(6, 10),
			fxAt: 9,
			fx: "slashBig",
			sfx: "swingHeavy"
		})]),
		comboGap: .6,
		skill: Object.freeze({
			id: "bulwark",
			name: "Bulwark",
			mp: 16,
			cooldown: 16,
			total: 40,
			at: 16,
			poses: Dm([
				0,
				12,
				"wind"
			], [
				13,
				39,
				"cast"
			]),
			minFoes: 2,
			r: 6,
			taunt: 5,
			ward: .25,
			wardFor: 6,
			dome: 4.2,
			armor: 40,
			hurtAt: .5
		}),
		skill2: Object.freeze({
			id: "earthshatter",
			name: "Earthshatter",
			mp: 18,
			cooldown: 12,
			total: 46,
			at: 22,
			poses: Dm([
				0,
				19,
				"backhand"
			], [
				20,
				27,
				"slash"
			], [
				28,
				45,
				"follow"
			]),
			minFoes: 2,
			r: 3.5,
			mv: 2,
			kb: 2.6,
			poise: 50,
			knockdown: !0,
			stop: 5,
			armor: 46,
			spikes: Object.freeze({
				delay: .14,
				rInner: 1,
				r: 3.8,
				n: 9,
				mv: .9,
				kb: 1.4,
				poise: 20
			})
		}),
		mend: null,
		revive: null
	})
}), Am = Object.freeze({
	rally: 25,
	bossBerth: 2,
	skillGap: 1.6,
	bulwarkOthers: 2,
	bulwarkCrowd: 4,
	quakeReach: 3.2,
	tombReach: 3.2,
	blizzardReach: 3.6,
	judgementReach: 3.2,
	centroid: 2.5
});
//#endregion
//#region src/game/combat/hooks.js
function jm(e) {
	let t = (t) => e.enemies.find((e) => e.uid === t) ?? null, n = (t) => !e._hidden.has(t), r = (t) => !e._absent.has(t), i = (r, i) => {
		if (r === "all") {
			for (let t of e.enemies) n(t) && i(t);
			return !0;
		}
		let a = t(r);
		return a && i(a), !!a;
	}, a = (t) => {
		let n = String(t ?? "").trim().toLowerCase();
		return e.allies.find((e) => e.id === t) ?? e.allies.find((e) => e.id.toLowerCase() === n || e.member.name.toLowerCase() === n) ?? null;
	}, o = () => e._boss, s = () => e._boss && !e._absent.has(e._boss) ? e._boss : null, c = () => {
		e._respawning && (e._deathGen++, e._respawning = !1, e.game.busy = !1), e.ui.combat?.death.hide();
	}, l = {
		state: () => e.state(),
		seed(t) {
			let n = Number(t) >>> 0;
			e.seedValue = n, e.rng = new y(n);
			for (let t of e.enemies) t.rng = new y((v(t.uid) ^ n) >>> 0);
			for (let t of e.allies) t.reseed(n);
			return n;
		},
		reset() {
			let t = e.ctx, n = e.seedValue;
			e.rng = new y(n);
			for (let r of e.enemies) r.rng = new y((v(r.uid) ^ n) >>> 0), r.deathCount = 0, r.sprite.mesh.position.x = 0, r._barT = -Infinity, r._refillFrom = 0, r.isAdd ? (r.reset(t), e._hideAdd(r)) : r.reset(t);
			for (let t of e._absent) e._hideAdd(t);
			if (e.bossDefeated = !1, e._resetBoss(), e._map) for (let t of e._bossMarkers) e._map.markers.includes(t) || e._map.markers.push(t);
			e._tokens.melee = 0, e._tokens.ranged = 0, e.projectiles.clear(), e._freeMarkersOf(null), e.pickups.clear(), e.fx.clear(), e.tags.clear(), e.playerHits.clear(), e.enemyHits.clear(), e._contactN = 0, e.targeting.reset(), e.stop = 0, e._slow = 0, e.playerScale = 1, e.enemyScale = 1, e._stopVictims.length = 0, e.look.reset(), e.cin.reset(), e.kills = 0, e.tutorial.combo = !1, e.tutorial.dodge = !1, e.tutorial.rewarded = !1, e.purchased.clear(), e.clock = 0, e.frame = 0, e.enemyTime = 0, e.stepNo = 1, e.ctx.time = 0, e.ctx.frame = 0, e.setEngaged(!1), e._timers.length = 0, e._deathT = -1, c(), e.locksPlayer = !1, e._fightTime = 0, e._phaseTimes = [
				0,
				0,
				0
			], e._levelAfterResults = null, e._wards.length = 0, e._releaseAsk.length = 0;
			for (let t of e.systems) t.reset?.();
			e._goldFeed = 0, e._goldFeedT = 0, e._goldFeedAge = 0, e._boss = e._bosses[0] ?? null, e._armSetPieces(), e.music.reset();
			let r = e.music.tracks.emberfall;
			e.audio.musicPlaying && e.audio.musicTrack !== r && e.audio.startMusic({
				track: r,
				fade: 1.5
			}), e.waystones.reset(), e.pc.reset(), e.player.sprite.mesh.position.x = 0, e.player.sprite.mesh.visible = !0, e.ui.combat?.labels.clear(), e.ui.combat?.announcer.clear?.(), e._barOf?.fill(null), e._edgeOf?.fill(null), e.allyHits.clear();
			for (let t of e.allies) t.reset();
			return e.state();
		},
		step(t = 1, n = 1 / 60) {
			let r = e.engine, i = r.running;
			r.stop();
			for (let e = 0; e < Math.max(0, t | 0); e++) r.step(n);
			return i && r.start(), e.state();
		},
		stepUntil(t, n = 600, r = 1 / 60) {
			let i = e.engine, a = i.running;
			i.stop();
			let o = -1, s = Math.max(0, n | 0);
			for (let e = 0; e <= s; e++) {
				if (t(l)) {
					o = e;
					break;
				}
				e < s && i.step(r);
			}
			return a && i.start(), o;
		},
		press: (t, n = 1) => e.cin.press(t, n),
		hold: (t, n = 30) => e.cin.press(t, n),
		move(t, n) {
			return e.player.moveOverride = t == null ? null : {
				x: Number(t),
				z: Number(n)
			}, e.player.moveOverride;
		},
		aim(t, n) {
			return e.aimOverride = t == null ? null : {
				x: Number(t),
				z: Number(n)
			}, e.aimOverride;
		},
		place(t, n, r) {
			return i(t, (t) => {
				t.home.x = Number(n), t.home.z = Number(r), t.position.set(t.home.x, e.groundAt(t.home.x, t.home.z), t.home.z);
			});
		},
		wake: (t) => i(t, (t) => {
			t.alive && r(t) && (t.dormant = !1, t.wake(e.ctx));
		}),
		kill: (t) => i(t, (t) => {
			t.alive && r(t) && (t.hp = 0, e._kill(t));
		}),
		damage(t, n) {
			return i(t, (t) => {
				if (!t.alive || !r(t)) return;
				let i = Math.max(0, Math.round(Number(n) || 0));
				t.hp = Math.max(0, t.hp - i), t.hitFlash = 4 / 60, t._barT = e.clock;
				let a = t.position;
				e.number(a.x, e.bodyBase(t) + t.def.body[1] + .2, a.z, String(i), "dmg"), t.hp <= 0 ? e._kill(t) : t.receiveHit({
					damage: i,
					crit: !1,
					mv: 1,
					kb: 0,
					kbDirX: 0,
					kbDirZ: 1,
					poise: 0,
					knockdown: !1,
					source: "melee",
					tag: 0,
					guarded: !1
				}, e.ctx);
			});
		},
		damagePlayer(t) {
			let n = e.pc;
			if (!n.alive) return !1;
			let r = Math.max(0, Math.round(Number(t) || 0)), i = e.player.position;
			return e.number(i.x, i.y + 1.9, i.z, String(r), "hurt"), n.hp = Math.max(0, n.hp - r), n.hp <= 0 && n.die(), n.hp;
		},
		setPlayer(t = {}) {
			let n = e.pc;
			if (t.upgrades && typeof t.upgrades == "object") {
				for (let e of [
					"maxHp",
					"maxMp",
					"attack",
					"def"
				]) t.upgrades[e] !== void 0 && (n.upgrades[e] = Math.max(0, Math.round(Number(t.upgrades[e]) || 0)));
				n.refill();
			}
			if (t.level !== void 0) {
				n.level = Math.max(1, Math.min(10, Math.round(Number(t.level) || 1))), n.refill();
				for (let t of e.allies) t.syncLevel();
			}
			return t.xp !== void 0 && (n.xp = Math.max(0, Math.round(Number(t.xp) || 0))), t.gold !== void 0 && (n.gold = Math.max(0, Math.round(Number(t.gold) || 0))), t.potions !== void 0 && (n.potions = Math.max(0, Math.min(5, Math.round(Number(t.potions) || 0)))), t.hp !== void 0 && (n.hp = Math.max(1, Math.min(n.hpMax, Number(t.hp)))), t.mp !== void 0 && (n.mp = Math.max(0, Math.min(n.mpMax, Number(t.mp)))), t.sp !== void 0 && (n.sp = Math.max(0, Math.min(100, Number(t.sp)))), e.state().player;
		},
		god(t = !0) {
			return e.god = !!t, e.god;
		},
		freezeAI(t = !0) {
			return e.freezeAI = !!t, e.freezeAI;
		},
		bossPhase(t) {
			let n = s();
			if (!n || !n.alive) return null;
			let r = Math.max(1, Math.min(3, Number(t) || 1)), i = n.def.phases ?? [.7, .35];
			return r >= 2 && (n.hp = Math.min(n.hp, Math.round(n.hpMax * i[r - 2]))), n.brain?.jumpPhase ? n.brain.jumpPhase(n, r, e.ctx) : (n.phase = r, e._onSignal("bossPhase", n, r)), n.phase;
		},
		boss: {
			force(e) {
				let t = s();
				return !t || !t.alive || !t.brain.force ? !1 : (t.brain.force(t, e ?? null), !0);
			},
			info() {
				let e = o();
				if (!e) return null;
				let t = e.brain.info ? e.brain.info(e) : {};
				return {
					uid: e.uid,
					state: e.state,
					t: e.fr,
					phase: e.phase,
					alive: e.alive,
					hazards: e.hazardCount,
					...t
				};
			},
			hazards(e) {
				let t = o();
				return t ? t.hazardList(e) : [];
			}
		},
		path(t, n, r, i, a = 80) {
			let o = /* @__PURE__ */ new Float32Array(128), s = e.nav.findPath(Number(t), Number(n), Number(r), Number(i), Number(a), o);
			if (s < 0) return null;
			let c = [];
			for (let e = 0; e < s; e++) c.push([+o[e * 2].toFixed(2), +o[e * 2 + 1].toFixed(2)]);
			return c;
		},
		setBossHp(e) {
			let t = s();
			return t ? (t.hp = Math.max(1, Math.round(t.hpMax * Math.max(0, Math.min(1, Number(e))))), t.hp) : null;
		},
		checkpoint(t) {
			let n = e.waystones.byId(t);
			return !n || n.absent ? null : (e.waystones.attune(n, { silent: !0 }), n.id);
		},
		rest(t) {
			let n = e.waystones, r = t ? n.byId(t) : n.checkpoint;
			return !r || r.absent ? !1 : (n.attune(r, { silent: !0 }), e.restAll(), !0);
		},
		respawn() {
			return e._deathT = -1, c(), e.resetEncounter(), e._respawnAt(e.waystones.checkpoint), e.state();
		},
		showcase() {
			let t = e.player.position, n = e.player.facing, r = t.x + n.x * 2.5, i = t.z + n.z * 2.5, a = e.groundAt(r, i);
			um.forEach((t, o) => e.fx.play(t, r + o % 3 - 1, a, i + Math.floor(o / 3) - 1, {
				dirX: n.x,
				dirZ: n.z,
				duration: 1
			}));
			let o = [
				["circle", "enemy"],
				["ring", "player"],
				["sector", "lock"],
				["lane", "enemy"],
				["rect", "barrier"],
				["circle", "magma"]
			].map(([t, a], o) => {
				let s = e.markerAllocCore();
				return e.markerSetCore(s, {
					shape: t,
					style: a,
					x: r + o % 3 * 2 - 2,
					z: i + Math.floor(o / 3) * 2 - 1,
					r: 1.2,
					rInner: .8,
					len: 3,
					width: .8,
					w: 2,
					d: 1.5,
					dirX: n.x,
					dirZ: n.z,
					halfAngle: 45,
					progress: .6,
					alpha: 1
				}), s;
			});
			e._later(2, () => o.forEach((t) => e.markerFreeCore(t)));
			for (let r of or) e.spawnProjectile("fx", {
				kind: r,
				x: t.x,
				y: t.y + .9,
				z: t.z,
				dirX: -n.x,
				dirZ: -n.z,
				speed: 6,
				range: 3,
				radius: .2,
				mv: 0,
				kb: 0,
				arc: r === "boulder" ? {
					tx: t.x - n.x * 3,
					tz: t.z - n.z * 3,
					time: .6,
					apex: 2
				} : null
			});
			let s = new y(379422);
			for (let t of Jp) e.pickups.drop(t, t === "coin25" ? 25 : t === "coin5" ? 5 : 1, r, a, i, s, "none");
			for (let t of [
				"hitSpark",
				"emberBurst",
				"deathPoof",
				"gooPoof",
				"healGlow",
				"magicBurst",
				"sparkle",
				"splash",
				"footstep",
				"victoryEmbers",
				"victorySparkle",
				"levelSparkle"
			]) e.burst(t, r, a + .8, i, 8);
			return Se.forEach((t, n) => e.audio.playSfx(t, {
				volume: .2,
				delay: n * .05
			})), {
				fx: um.length,
				markers: o.length,
				projectiles: or.length,
				pickups: Jp.length
			};
		},
		enemies() {
			return e.enemies.filter(n).map((t) => ({
				uid: t.uid,
				kind: t.kind,
				hp: Math.ceil(t.hp),
				hpMax: t.hpMax,
				state: t.state,
				x: +t.position.x.toFixed(3),
				z: +t.position.z.toFixed(3),
				aggro: t.aggro,
				dormant: t.dormant,
				zone: t.zone >= 0 ? e.zones[t.zone].id : null
			}));
		},
		stats: () => e.stats(),
		allies: () => e.allies.map((e) => e.info()),
		allyHurt(t, n) {
			let r = a(t);
			return r ? e.hurtAlly(r, n) : null;
		},
		allyTarget(e, n) {
			let r = t(e);
			if (!r) return null;
			if (n !== void 0) {
				let e = n === null || n === "player" ? null : a(n);
				r.target = e && !e.down && !r.boss && !r.isAdd ? e : null, r.targetHold = r.target ? $.holdTarget : 0, r.targetCheck = r.target ? $.checkTarget : 0;
			}
			return r.target ? r.target.id : "player";
		},
		allySet(t, n = {}) {
			let r = a(t);
			if (!r) return null;
			if (n.mp !== void 0 && (r.mp = Math.max(0, Math.min(r.mpMax, Number(n.mp) || 0))), n.hp !== void 0) {
				let t = Math.max(0, Math.min(r.hpMax, Number(n.hp) || 0));
				t <= 0 ? e.hurtAlly(r, r.hp) : (r.down && r.refill(), r.hp = t);
			}
			return r.info();
		},
		allyGod(t = !0) {
			return e.allyGod = !!t, e.allyGod;
		},
		healAllies: () => e.healAllies(),
		ward(t, n) {
			return t !== void 0 && e.ward(Number(t), Number(n)), {
				frac: +e.wardFrac.toFixed(3),
				wards: e._wards.map((e) => ({
					frac: +e.frac.toFixed(3),
					t: +e.t.toFixed(3)
				}))
			};
		},
		statusOf(e) {
			let n = t(e);
			return n ? {
				uid: n.uid,
				state: n.state,
				...n.statusInfo(),
				taunt: n.tauntT > 0 && n.target ? n.target.id : null,
				tauntT: +Math.max(0, n.tauntT).toFixed(3),
				target: n.target ? n.target.id : "player",
				aggro: n.aggro,
				swarm: n.swarm,
				besiege: n.besiege ? { ...n.besiege } : null,
				marks: n.marks,
				submerged: n.submerged,
				released: n.released
			} : null;
		},
		status: (t, n) => i(t, (t) => {
			t.alive && r(t) && n && typeof n == "object" && e._applyStatus(t, n);
		}),
		taunt(t, n, r, i, o) {
			let s = a(t);
			return s ? e.taunt(s, Number(n), Number(r), Number(i), Number(o)) : null;
		},
		strike: (t) => e.strike(t),
		marks(e, n) {
			let r = t(e);
			return r ? (n !== void 0 && r.alive && (r.marks = 0, r.addMarks(Number(n))), r.marks) : null;
		},
		submerge(n, r, i, a) {
			let o = t(n);
			return o ? (r ? e.submerge(o) : e.surface(o, i, a), o.submerged) : null;
		},
		pulse: (t) => e.pulse(t),
		release(n) {
			let r = t(n);
			return !!r && e.release(r);
		},
		system: e
	};
	return l;
}
//#endregion
//#region src/game/combat/strings.js
var Mm = "​", Nm = (e) => {
	let t = String(e ?? "");
	return /^the /i.test(t) ? t : `the ${t}`;
}, Pm = {
	en: {
		"enemy.slime": "Moss Slime",
		"enemy.goblin": "Bramble Goblin",
		"enemy.archer": "Thorn Archer",
		"enemy.shaman": "Hex Shaman",
		"enemy.bat": "Cinder Bat",
		"enemy.boar": "Ironhide Boar",
		"enemy.dummy": "Straw Dummy",
		"enemy.golem": "Cinderheart",
		"enemy.drakeborn": "Drakeborn Ravager",
		"enemy.ashhound": "Ashen Hellhound",
		"enemy.wyrmcaller": "Wyrmcult Pyromancer",
		"enemy.kobold": "Scalekin Skirmisher",
		"enemy.whelp": "Ashwing Whelp",
		"enemy.emberimp": "Ember Imp",
		"enemy.dragon": "Vorthrax",
		"enemy.hushguard": "Hushguard",
		"enemy.frostwolf": "Frost Wolf",
		"enemy.rimecrow": "Rime Crow",
		"enemy.cantor": "Hush Cantor",
		"enemy.rimehart": "Rimehart",
		"enemy.mawkin": "Harvest Mawkin",
		"enemy.gullet": "Old Gullet",
		"enemy.tentacle": "Tentacle",
		"enemy.hushedking": "The Hushed King",
		"epithet.golem": "The Last Fire of the Pass",
		"epithet.dragon": "The Ashen Tyrant",
		"epithet.rimehart": "The Stag of the Waking Wood",
		"epithet.mawkin": "Keeper of the Frozen Field",
		"epithet.gullet": "The Thing under the Bay",
		"epithet.hushedking": "Lord of the Stopped Year",
		elite: "Elite {name}",
		"skill.skill1": "Whirl Slash",
		"skill.skill2": "Ember Bolt",
		"skill.skill3": "Radiant Nova",
		"skill.tempest": "Tempest Edge",
		"skill.dragonfang": "Dragonfang Wave",
		"skill.skyfall": "Skyfall Judgement",
		"skill.peal": "Peal",
		"skill.toll": "Toll",
		"skill.carillon": "Carillon",
		"skill.draught": "Healing Draught",
		"ware.draught.name": "Healing Draught",
		"ware.draught.gain": "heals {n} %",
		"ware.whetstone.name": "Whetstone",
		"ware.whetstone.gain": "ATK +{n}",
		"ware.tonic.name": "Ironbark Tonic",
		"ware.tonic.gain": "Max HP +{n}",
		"ware.charm.name": "Warding Charm",
		"ware.charm.gain": "DEF +{n}",
		"loot.gold": "+{n} gold",
		"loot.heart": "Heart +{n} HP",
		"loot.mana": "Mana mote +{n} MP",
		"loot.draught": "Healing Draught",
		"upgrade.maxHp": "Max HP +{n}",
		"upgrade.maxMp": "Max MP +{n}",
		"upgrade.attack": "ATK +{n}",
		"upgrade.core": "Cinderheart Core",
		"upgrade.other": "Upgrade",
		obtained: "Obtained: {item}",
		"upgraded.maxHp": "Obtained: Max HP +{n}",
		"upgraded.maxMp": "Obtained: Max MP +{n}",
		"upgraded.attack": "Obtained: ATK +{n}",
		"upgraded.core": "Obtained: {item} · Max HP +{n}",
		"draught.full": "Already at full health",
		"level.title": "Level {n}",
		"gain.maxHp": "Max HP +{n}",
		"gain.atk": "ATK +{n}",
		"gain.learned": "{skill} learned",
		"victory.title": "Victory",
		"victory.sub": "The fires of the pass are quiet",
		"results.title": "{place} — Cleared",
		"results.foes": {
			one: "{n} foe",
			other: "{n} foes"
		},
		"results.falls": {
			one: "{n} fall",
			other: "{n} falls"
		},
		"results.dodges": {
			one: "{n} perfect dodge",
			other: "{n} perfect dodges"
		},
		"results.lv": "Lv {n}",
		"death.title": "You Have Fallen",
		"death.prompt": (e) => `Press any key to rise at ${Nm(e.place)}`,
		"death.risen": (e) => `You rise at ${Nm(e.place)}`,
		"place.camp": "the camp",
		"place.start": "the start",
		"waystone.attuned": "{place} attuned",
		"waystone.silent": "The stone is silent while foes are near",
		"waystone.rested": (e) => `Rested at ${Nm(e.place)}`,
		"controls.move": "Move",
		"controls.run": "Run",
		"controls.attack": "Attack (combo)",
		"controls.dodge": "Dodge roll",
		"controls.skills": "Skills (or 1-3)",
		"controls.draught": "Healing Draught",
		"controls.lock": "Lock on / next",
		"controls.interact": "Talk / Rest / Open",
		"controls.choose": "Choose an answer",
		"controls.rotate": "Rotate camera",
		"controls.zoom": "Zoom (or wheel)",
		"controls.map": "World map",
		"controls.toggles": "Time / Weather / Photo / Music"
	},
	ja: {
		"enemy.slime": "コケスライム",
		"enemy.goblin": "イバラゴブリン",
		"enemy.archer": "棘の弓兵",
		"enemy.shaman": "呪術シャーマン",
		"enemy.bat": "火の粉コウモリ",
		"enemy.boar": "アイアンハイドボア",
		"enemy.dummy": "稽古人形",
		"enemy.golem": "シンダーハート",
		"enemy.drakeborn": "竜裔の蹂躙者",
		"enemy.ashhound": "灰燼の魔犬",
		"enemy.wyrmcaller": "竜教団の火術師",
		"enemy.kobold": "鱗族の小兵",
		"enemy.whelp": "灰翼の幼竜",
		"enemy.emberimp": "燠火の小鬼",
		"enemy.dragon": "ヴォルスラクス",
		"enemy.hushguard": "静寂の鎧兵",
		"enemy.frostwolf": "霜狼",
		"enemy.rimecrow": "霧氷ガラス",
		"enemy.cantor": "静寂の詠唱者",
		"enemy.rimehart": "ライムハート",
		"enemy.mawkin": "収穫のかかし",
		"enemy.gullet": "オールド・ガレット",
		"enemy.tentacle": "触手",
		"enemy.hushedking": "静寂の王",
		"epithet.golem": "峠に残りし最後の火",
		"epithet.dragon": "灰燼の暴君",
		"epithet.rimehart": "目覚めの森の牡鹿",
		"epithet.mawkin": "凍てつく畑の番人",
		"epithet.gullet": "湾の底に潜むもの",
		"epithet.hushedking": "止まった年の主",
		elite: "精鋭の{name}",
		"skill.skill1": `旋風${Mm}斬り`,
		"skill.skill2": "火炎弾",
		"skill.skill3": `光輝${Mm}ノヴァ`,
		"skill.tempest": `嵐刃${Mm}乱舞`,
		"skill.dragonfang": `龍牙${Mm}烈波`,
		"skill.skyfall": `天墜${Mm}の裁き`,
		"skill.peal": `鐘声${Mm}の波`,
		"skill.toll": `時${Mm}の鐘`,
		"skill.carillon": "カリヨン",
		"skill.draught": "回復薬",
		"ware.draught.name": "回復薬",
		"ware.draught.gain": "HPを{n}%回復",
		"ware.whetstone.name": "砥石",
		"ware.whetstone.gain": "攻撃力 +{n}",
		"ware.tonic.name": "鉄木の強壮薬",
		"ware.tonic.gain": "最大HP +{n}",
		"ware.charm.name": "守りの護符",
		"ware.charm.gain": "防御力 +{n}",
		"loot.gold": "+{n}G",
		"loot.heart": "ハート HP +{n}",
		"loot.mana": "マナの欠片 MP +{n}",
		"loot.draught": "回復薬",
		"upgrade.maxHp": "最大HP +{n}",
		"upgrade.maxMp": "最大MP +{n}",
		"upgrade.attack": "攻撃力 +{n}",
		"upgrade.core": "シンダーハートの核",
		"upgrade.other": "強化",
		obtained: "{item}を手に入れた",
		"upgraded.maxHp": "最大HPが{n}上がった",
		"upgraded.maxMp": "最大MPが{n}上がった",
		"upgraded.attack": "攻撃力が{n}上がった",
		"upgraded.core": "{item}を手に入れた・最大HPが{n}上がった",
		"draught.full": "HPは満タンだ",
		"level.title": "レベル {n}",
		"gain.maxHp": "最大HP +{n}",
		"gain.atk": "攻撃力 +{n}",
		"gain.learned": "{skill}を習得",
		"victory.title": "勝利",
		"victory.sub": "峠の火は静まった",
		"results.title": "{place} 踏破",
		"results.foes": "撃破 {n}",
		"results.falls": "戦闘不能 {n}",
		"results.dodges": "ジャスト回避 {n}",
		"results.lv": "Lv {n}",
		"death.title": "力尽きた",
		"death.prompt": "何かキーを押すと{place}で立ち上がる",
		"death.risen": "{place}で目を覚ました",
		"place.camp": "野営地",
		"place.start": "出発地点",
		"waystone.attuned": "{place}と共鳴した",
		"waystone.silent": "敵が近くにいる間、石は沈黙している",
		"waystone.rested": "{place}で休んだ",
		"controls.move": "移動",
		"controls.run": "ダッシュ",
		"controls.attack": "攻撃（連続技）",
		"controls.dodge": "回避ロール",
		"controls.skills": "スキル（1〜3でも可）",
		"controls.draught": "回復薬",
		"controls.lock": "ロックオン／次へ",
		"controls.interact": "話す／休む／開ける",
		"controls.choose": "答えを選ぶ",
		"controls.rotate": "カメラ回転",
		"controls.zoom": "ズーム（ホイールも可）",
		"controls.map": "ワールドマップ",
		"controls.toggles": "時間帯／天気／フォトモード／音楽"
	},
	zh: {
		"enemy.slime": "苔藓史莱姆",
		"enemy.goblin": "荆棘哥布林",
		"enemy.archer": "棘刺弓手",
		"enemy.shaman": "咒术萨满",
		"enemy.bat": "烬火蝙蝠",
		"enemy.boar": "铁皮野猪",
		"enemy.dummy": "稻草假人",
		"enemy.golem": "烬心",
		"enemy.drakeborn": "龙裔掠夺者",
		"enemy.ashhound": "灰烬地狱犬",
		"enemy.wyrmcaller": "龙教火术师",
		"enemy.kobold": "鳞族散兵",
		"enemy.whelp": "灰翼幼龙",
		"enemy.emberimp": "余烬小鬼",
		"enemy.dragon": "沃斯拉克斯",
		"enemy.hushguard": "寂静卫士",
		"enemy.frostwolf": "霜狼",
		"enemy.rimecrow": "雾凇鸦",
		"enemy.cantor": "寂静咏者",
		"enemy.rimehart": "莱姆哈特",
		"enemy.mawkin": "丰收稻草人",
		"enemy.gullet": "老饕",
		"enemy.tentacle": "触手",
		"enemy.hushedking": "寂静之王",
		"epithet.golem": "隘口最后之火",
		"epithet.dragon": "灰烬暴君",
		"epithet.rimehart": "苏醒之森的雄鹿",
		"epithet.mawkin": "冰封田野的守望者",
		"epithet.gullet": "海湾之下的怪物",
		"epithet.hushedking": "停滞之年的主宰",
		elite: "精英{name}",
		"skill.skill1": "旋风斩",
		"skill.skill2": "烬火弹",
		"skill.skill3": `光辉${Mm}新星`,
		"skill.tempest": `风暴${Mm}剑刃`,
		"skill.dragonfang": `龙牙${Mm}斩波`,
		"skill.skyfall": `天坠${Mm}审判`,
		"skill.peal": `钟声${Mm}之波`,
		"skill.toll": "幻钟",
		"skill.carillon": `钟乐${Mm}齐鸣`,
		"skill.draught": `治疗${Mm}药水`,
		"ware.draught.name": "治疗药水",
		"ware.draught.gain": "恢复{n}% HP",
		"ware.whetstone.name": "磨刀石",
		"ware.whetstone.gain": "攻击 +{n}",
		"ware.tonic.name": "铁木补药",
		"ware.tonic.gain": "最大HP +{n}",
		"ware.charm.name": "守护护符",
		"ware.charm.gain": "防御 +{n}",
		"loot.gold": "+{n} G",
		"loot.heart": "红心 HP +{n}",
		"loot.mana": "魔力碎片 MP +{n}",
		"loot.draught": "治疗药水",
		"upgrade.maxHp": "最大HP +{n}",
		"upgrade.maxMp": "最大MP +{n}",
		"upgrade.attack": "攻击 +{n}",
		"upgrade.core": "烬心之核",
		"upgrade.other": "强化",
		obtained: "获得：{item}",
		"upgraded.maxHp": "最大HP提升{n}",
		"upgraded.maxMp": "最大MP提升{n}",
		"upgraded.attack": "攻击提升{n}",
		"upgraded.core": "获得：{item} · 最大HP提升{n}",
		"draught.full": "HP已满",
		"level.title": "升至 {n} 级",
		"gain.maxHp": "最大HP +{n}",
		"gain.atk": "攻击 +{n}",
		"gain.learned": "习得{skill}",
		"victory.title": "胜利",
		"victory.sub": "隘口之火已然平息",
		"results.title": "{place} 已肃清",
		"results.foes": "击败 {n}",
		"results.falls": "倒下 {n} 次",
		"results.dodges": "完美闪避 {n}",
		"results.lv": "Lv {n}",
		"death.title": "你倒下了",
		"death.prompt": "按任意键在{place}复活",
		"death.risen": "你在{place}醒来",
		"place.camp": "营地",
		"place.start": "出发点",
		"waystone.attuned": "已与{place}共鸣",
		"waystone.silent": "敌人在附近时，石碑沉默不语",
		"waystone.rested": "在{place}休息了",
		"controls.move": "移动",
		"controls.run": "奔跑",
		"controls.attack": "攻击（连招）",
		"controls.dodge": "翻滚闪避",
		"controls.skills": "技能（或 1-3）",
		"controls.draught": "治疗药水",
		"controls.lock": "锁定／切换",
		"controls.interact": "交谈／休息／打开",
		"controls.choose": "选择回答",
		"controls.rotate": "旋转镜头",
		"controls.zoom": "缩放（或滚轮）",
		"controls.map": "世界地图",
		"controls.toggles": "时段／天气／拍照模式／音乐"
	}
}, Fm = { evermere: () => Promise.all([import("./core-Ckf3Dj8e.js"), import("./evermere-gtIA7BTC.js")]).then(([e, t]) => ({ register(n) {
	e.register(n), t.register(n);
} })) };
function Im(e) {
	let t = [];
	for (let n of e?.objects ?? []) {
		if (n?.type !== "enemy" || typeof n.kind != "string") continue;
		let e = m("kinds", n.kind);
		e !== null && Object.hasOwn(Fm, e) && !t.includes(e) && t.push(e);
	}
	return t;
}
var Lm = /* @__PURE__ */ new Map(), Rm = /* @__PURE__ */ new Map(), zm = /* @__PURE__ */ new Map();
function Bm(e, t) {
	return Object.freeze({
		...e,
		registerSystem(e, n) {
			let r = Rm.get(t);
			if (r || Rm.set(t, r = /* @__PURE__ */ new Map()), r.has(e)) throw Error(`registerSystem: "${e}" twice`);
			r.set(e, n);
		},
		registerMarkerStyles(e, n) {
			let r = zm.get(t) ?? [];
			r.push({
				ids: e,
				glsl: String(n)
			}), zm.set(t, r);
		}
	});
}
function Vm(e) {
	return e.flatMap((e) => zm.get(e) ?? []);
}
function Hm(e) {
	let t = [];
	for (let n of e) for (let e of Rm.get(n)?.values() ?? []) t.push(e);
	return t;
}
function Um(e, t) {
	return Promise.all(e.map((e) => {
		let n = Lm.get(e);
		if (!n) {
			if (!Object.hasOwn(Fm, e)) return Promise.reject(/* @__PURE__ */ Error(`loadEnemyPacks: no pack for "${e}"`));
			n = Fm[e]().catch((t) => {
				throw Lm.delete(e), t;
			}).then((n) => n.register(Bm(t, e))), Lm.set(e, n);
		}
		return n;
	})).then(() => void 0);
}
//#endregion
//#region src/game/combat/packs/api.js
var Wm = Object.freeze({
	registerEnemyDefs: up,
	registerBrain: Pd,
	registerMonsterKind: ie,
	registerFxModule: _e,
	registerPresets: vt,
	monsterKind: ge,
	monsterKit: x,
	brain: (e) => Object.hasOwn(Nd, e) ? Nd[e] : null
}), Gm = class {
	constructor(e, t) {
		this.sys = e, this.member = t, this.id = t.id, this.isAlly = !0, this.gone = !1, this.cls = Le(t.record.cls) ? t.record.cls : "warden", this.vq = Em.includes(this.cls), this.base = Tm[this.cls], this.kit = km[this.cls], this.role = ze[this.cls]?.role ?? "melee", this.hp = this.hpMax, this.mp = this.mpMax, this._lvl = this.level, this.down = !1, this.kills = 0, this.counts = hh(), this.action = null, this.t = 0, this.frame = 0, this._prevFrame = -1, this._moved = 0, this._motion = null, this.atkCd = 0, this.skillCd = 0, this.healCd = 0, this.rollCd = 0, this.iframes = 0, this.flashT = 0, this.blink = !1, this.swings = 0, this.target = null, this.mode = "idle", this._healWho = null, this._actTarget = null, this._tag = 0, this._targeted = !1, this._calm = 0, this._planT = v(`plan:${this.id}`) % 15 / 60, this._skip = /* @__PURE__ */ new Map(), this._arena = null, this._hold = {
			x: 0,
			z: 0,
			ok: !1,
			px: 0,
			pz: 0,
			kind: ""
		}, this._holdWalk = !1, this._lookAt = null, this._mspot = {
			a: 0,
			ok: !1,
			cover: !1,
			t: null,
			x: 0,
			z: 0
		}, this._reloc = !1, this._relocT = 0, this._noReachT = 0, this._noReachFor = null, this._gp = {
			x: 0,
			z: 0,
			ux: 0,
			uz: 0,
			step: 0,
			sub: -2
		}, this._trk = {
			t: null,
			x: 0,
			z: 0,
			vx: 0,
			vz: 0
		}, this._ndc = {
			x: 0,
			y: 0
		}, this._stuckT = 0, this._path = /* @__PURE__ */ new Float32Array(48), this._pathN = 0, this._pathI = 0, this._pathGX = 0, this._pathGZ = 0, this._pathAt = -Infinity, this._lastCol = -1, this._lastRow = -1, this._anim = "", this._flashOn = !1, this._speedSet = !1, this._prevX = t.position.x, this._prevZ = t.position.z, this._goal = {
			x: 0,
			z: 0
		}, this._spot = {
			x: 0,
			z: 0,
			ok: !1,
			on: !1,
			t: null
		}, this._esc = {
			x: 0,
			z: 0
		}, this._near = [], this._flares = [
			0,
			1,
			2
		].map(() => ({
			on: !1,
			x: 0,
			y: 0,
			z: 0,
			t: 0,
			tag: 0
		})), this.move = null, this.skill2Cd = 0, this.reviveCd = 0, this.gapCd = 0, this._downT = 0, this._next = null, this._reviveWho = null, this._spellAt = {
			x: 0,
			z: 0
		}, this.casts = {}, this._missiles = this.vq ? [
			0,
			1,
			2,
			3
		].map(Km) : [], this._fields = this.vq ? [
			0,
			1,
			2,
			3,
			4
		].map(qm) : [], this._cols = [], this._fx = this.vq ? new Jm(e) : null, this._ice = this.cls === "icemage" && e.ice ? e.ice.director(this) : null, this.cls === "icemage" && !e.ice && this.vq && console.info(`[combat] ice mage "${this.id}" on a level classMayFight did not foresee: her spells have no look here (COMBAT.md §28 A13)`), this._holy = this.cls === "cleric" && e.holy ? e.holy.director(this) : null, this.cls === "cleric" && !e.holy && this.vq && console.info(`[combat] cleric "${this.id}" on a level classMayFight did not foresee: her spells have no look here`), this._earth = this.cls === "greatshield" && e.earth ? e.earth.director(this) : null, this.cls === "greatshield" && !e.earth && this.vq && console.info(`[combat] greatshield "${this.id}" on a level classMayFight did not foresee: his moves have no look here`), this._spec = {
			shape: "sector",
			x: 0,
			y: 0,
			z: 0,
			r: 1,
			rInner: 0,
			dirX: 0,
			dirZ: 1,
			halfAngle: 60,
			len: 1,
			width: 1,
			dy: On,
			mv: 1,
			kb: 0,
			poise: 0,
			knockdown: !1,
			flat: 0,
			thin: !1,
			tag: 0,
			fromX: 0,
			fromZ: 0
		}, this._proj = {
			kind: "arrow",
			x: 0,
			y: 0,
			z: 0,
			dirX: 0,
			dirZ: 1,
			vy: 0,
			speed: 16,
			range: 12,
			radius: .25,
			mv: 1,
			kb: 0,
			poise: 0,
			pierce: !1,
			splash: null,
			arc: null
		}, this.view = {
			position: t.position,
			radius: $.radius,
			body: [$.body[0], $.body[1]],
			facing: {
				x: 0,
				z: 1
			},
			velocity: {
				x: 0,
				z: 0
			},
			alive: !0,
			invulnerable: !1,
			dodging: !1,
			action: null,
			swing: 0,
			sealed: !1
		}, this.reseed(e.seedValue), this._syncView();
	}
	get level() {
		return this.sys.pc?.level ?? 1;
	}
	get hpMax() {
		return this._hpAt(this.level);
	}
	get mpMax() {
		return this._mpAt(this.level);
	}
	_hpAt(e) {
		return Math.round(this.base.hp + this.base.perLevel.hp * (e - 1));
	}
	_mpAt(e) {
		return Math.round(this.base.mp + this.base.perLevel.mp * (e - 1));
	}
	syncLevel() {
		let e = this.level, t = this._lvl;
		if (e === t) return !1;
		this._lvl = e;
		let n = this._hpAt(t), r = this._mpAt(t);
		return this.down || (this.hp = Math.min(this.hpMax, n > 0 ? this.hp / n * this.hpMax : this.hpMax)), this.mp = Math.min(this.mpMax, r > 0 ? this.mp / r * this.mpMax : this.mpMax), !0;
	}
	get atk() {
		let e = Math.max(1, Math.min($.partyAtk.length, this.sys.allies.length));
		return (this.base.atk + this.base.perLevel.atk * (this.level - 1)) * $.partyAtk[e - 1];
	}
	get def() {
		return this.base.def + this.base.perLevel.def * (this.level - 1);
	}
	get rule() {
		return this.member.record.rule;
	}
	get heroKit() {
		return this.kit;
	}
	get position() {
		return this.member.position;
	}
	get radius() {
		return $.radius;
	}
	get active() {
		if (this.gone || !this.member.sprite) return !1;
		let e = this.member;
		if (e.directed || e.talking) return !1;
		let t = this.sys;
		if (this.down || this.action !== null || this._targeted || !t.pc.alive || t.sealedArena()) return !0;
		if (!t.fightOn() && !(t.engaged && this._mendDue())) return !1;
		let n = t.player.position, r = e.position;
		return Math.hypot(r.x - n.x, r.z - n.z) <= ph;
	}
	get invulnerable() {
		if (this.down || this.iframes > 0 || this.sys.allyGod || !this.sys.pc.alive) return !0;
		if (this.action === "roll") {
			let e = $.roll.iframes;
			return this.frame >= e[0] && this.frame <= e[1];
		}
		return this.action === "knock";
	}
	get hittable() {
		return !this.gone && !!this.member.sprite && !this.member.directed && !this.invulnerable;
	}
	get present() {
		return !this.gone && !!this.member.sprite && !this.down;
	}
	refill() {
		this._lvl = this.level, this.hp = this.hpMax, this.mp = this.mpMax, this.down = !1, this._endAction(), this.iframes = 0, this.flashT = 0, this.blink = !1, this.member.sprite && (this.member.sprite.mesh.visible = !0), this._play("idle", !0), this._syncView();
	}
	onTeleport() {
		this.down || this._endAction(), this.target = null, this._healWho = null, this._pathN = 0, this._stuckT = 0, this._planT = 0, this._hold.ok = !1, this._hold.kind = "", this._holdWalk = !1, this._spot.t = null, this._spot.ok = !1, this._mspot.t = null, this._mspot.ok = !1, this._reloc = !1, this._noReachT = 0, this._gp.sub = -2, this._trk.t = null;
		let e = this.member.position;
		this._prevX = e.x, this._prevZ = e.z, this.view.velocity.x = 0, this.view.velocity.z = 0, this.down || this._play("idle", !0), this._syncView();
	}
	onPlayerDeath() {
		this.down || (this._endAction(), this.target = null, this.mode = "stop", this._play("idle", !0));
	}
	reseed(e) {
		this.rng = new y((v(`ally:${this.id}`) ^ Number(e) >>> 0) >>> 0);
	}
	reset() {
		this.refill(), this.kills = 0, this.counts = hh(), this.atkCd = this.skillCd = this.healCd = this.rollCd = 0, this.swings = 0, this.target = null, this.mode = "idle", this._healWho = null, this._actTarget = null, this._targeted = !1, this._calm = 0, this._skip.clear(), this._arena = null, this._pathAt = -Infinity, this._anim = "", this._lookAt = null, this._relocT = 0, this._noReachFor = null;
		for (let e of this._flares) e.on = !1;
		this.vq && this._clearHero(), this._planT = v(`plan:${this.id}`) % 15 / 60, this.member.facing.x = 0, this.member.facing.z = 1, this.onTeleport(), this.reseed(this.sys.seedValue);
	}
	release() {
		this.vq && this._clearHero(), this._ice?.dispose(), this._ice = null, this._holy?.dispose(), this._holy = null, this._earth?.dispose(), this._earth = null, this.gone = !0, this.target = null;
		let e = this.member.sprite;
		e && (e.setFlash(0, 0, 0, 0), e.mesh.visible = !0, this._speedSet && (e.speed = 1), (this.action || this.down || this._lastCol >= 0) && e.play("idle")), this._speedSet = !1, this.action = null, this.member.combat === this && (this.member.combat = null);
	}
	heal(e) {
		if (this.down || this.gone) return 0;
		let t = this.hp;
		this.hp = Math.min(this.hpMax, this.hp + Math.max(0, e));
		let n = Math.round(this.hp - t), r = this.member.position;
		return n > 0 && this.sys.number(r.x, r.y + 1.9, r.z, `+${n}`, "heal"), n;
	}
	step(e) {
		let t = this.member;
		if (this.gone || !t.sprite || t.combat !== this) return;
		let n = this.sys;
		if (this.syncLevel(), this._stepFlares(e), this.vq && this._stepHero(e), t.directed || t.talking) {
			this._targeted = !1;
			return;
		}
		this.atkCd > 0 && (this.atkCd = Math.max(0, this.atkCd - e)), this.skillCd > 0 && (this.skillCd = Math.max(0, this.skillCd - e)), this.healCd > 0 && (this.healCd = Math.max(0, this.healCd - e)), this.rollCd > 0 && (this.rollCd = Math.max(0, this.rollCd - e)), this.iframes > 0 && (this.iframes = Math.max(0, this.iframes - e)), this._relocT > 0 && (this._relocT = Math.max(0, this._relocT - e)), this.vq && (this.skill2Cd > 0 && (this.skill2Cd = Math.max(0, this.skill2Cd - e)), this.reviveCd > 0 && (this.reviveCd = Math.max(0, this.reviveCd - e)), this.gapCd > 0 && (this.gapCd = Math.max(0, this.gapCd - e))), this._targeted = n.isTargeted(this), n.fightOn() || this._targeted || !n.pc.alive ? this._calm = 0 : this._calm += e, this._calm >= $.calm - 1e-6 ? this.down ? this._getUp() : (this.hp = Math.min(this.hpMax, this.hp + this.hpMax * $.regen * e), this.mp = Math.min(this.mpMax, this.mp + this.mpMax * $.regen * e)) : this.down || (this.mp = Math.min(this.mpMax, this.mp + (this.vq ? this.heroKit.mpRegen ?? $.mpRegen : $.mpRegen) * e)), this.vq && (this.down ? (this._downT += e) >= Am.rally - 1e-6 && n.pc.alive && this._getUp() : this._downT = 0), this.hp > this.hpMax && (this.hp = this.hpMax), this.mp > this.mpMax && (this.mp = this.mpMax);
		let r = n.sealedArena();
		if (this._arena = r && r.contains(t.position.x, t.position.z) ? r : null, !n.pc.alive) {
			!this.down && this.action && this.action !== "hurt" && this.action !== "knock" && this._endAction(), this.action ? this._advance(e) : this.down || (this.mode = "stop", this._play("idle")), this._syncView();
			return;
		}
		if (this.down) {
			this.mode = "down", this._pose("down"), this._syncView();
			return;
		}
		if (this.action && (this._advance(e), this.action)) {
			this._syncView();
			return;
		}
		if (!this.active) {
			this.mode = "idle", this.target = null, this._pathN = 0, this._stuckT = 0, this._anim = "", this._gp.sub = -2, this._holdWalk = !1, this._reloc = !1, this._syncView();
			return;
		}
		this._think(e), this._syncView();
	}
	_syncView() {
		let e = this.view, t = this.member;
		e.position = t.position, e.facing.x = t.facing.x, e.facing.z = t.facing.z, e.alive = !this.down && !this.gone, e.invulnerable = this.invulnerable, e.dodging = this.action === "roll", e.action = gh(this.action), e.swing = this.swings, e.sealed = this.sys._pv?.sealed ?? !1;
	}
	_think(e) {
		if (this.vq) {
			this._thinkHero(e);
			return;
		}
		let t = this.sys, n = this.rule, r = this.kit;
		this._planT -= e;
		let i = this._planT <= 0;
		i && (this._planT = Math.max(this._planT + $.planEvery, .05));
		let a = t.sealedArena();
		if (a && !this._arena) {
			this.mode = "wait", this.target = null, this._waitAtGate(a, e);
			return;
		}
		if (n.evade === "on" && this.rollCd <= 0 && this._evade()) return;
		let o = Cm[n.heal] ?? 0;
		if (o > 0 && this.healCd <= 0 && this.mp >= r.mend.mp - 1e-6) {
			(i || !this._healOk(this._healWho, o)) && (this._healWho = this._pickHeal(o));
			let n = this._healWho;
			if (n) {
				let i = n === "player" ? t.player.position : n.position, a = this.member.position;
				if (this.mode = "heal", Math.hypot(i.x - a.x, i.z - a.z) <= r.mend.range) {
					this._startMend();
					return;
				}
				this._goTo(i.x, i.z, e, r.mend.range - 1);
				return;
			}
		} else this._healWho = null;
		if (this.hp < this.hpMax * (wm[n.retreat] ?? 0)) {
			this.mode = "retreat", this.target = null, this._retreat(e, i);
			return;
		}
		if (n.attack !== "never") {
			(i || this.target !== null && !this._candidate(this.target)) && (this.target = this._pickTarget());
			let t = this.target;
			if (t && this._fight(t, e, i)) {
				this.mode = "attack";
				return;
			}
		} else this.target = null;
		this.mode = "hold", this._holdSpot(e, i);
	}
	_candidate(e) {
		if (!e || !e.alive || e.dormant || !e.sprite.visible || e.sprite.opacity <= .001) return !1;
		let t = this.sys;
		if (e.passive || e.kind === "dummy" || e.state === "return" || t._hidden.has(e)) return !1;
		let n = this._skip.get(e);
		if (n !== void 0) {
			if (t.clock < n) return !1;
			this._skip.delete(e);
		}
		let r = this._arena;
		if (r) {
			if (!r.contains(e.position.x, e.position.z)) return !1;
		} else {
			if (e.boss) return !1;
			for (let n of t.arenas) if (n.present && n.containsGrown(e.position.x, e.position.z, .5)) return !1;
		}
		if (e.boss && t.bossFight !== e) return !1;
		let i = t.player.position;
		return Math.hypot(e.position.x - i.x, e.position.z - i.z) <= this._leash() + this._reach();
	}
	_leash() {
		return (Sm[this.rule.distance] ?? Sm.mid).leash;
	}
	_reach() {
		if (this.role === "melee") return this.kit.reach + .5;
		let e = (Sm[this.rule.distance] ?? Sm.mid).standoff;
		return Math.min(e, this._range() - .5);
	}
	_pace() {
		return this.rule.heal === "often" && this.kit.mend ? $.healerPace : 1;
	}
	_range() {
		return this.kit.basic?.range ?? 2;
	}
	_assists(e) {
		let t = this.sys;
		if (e === t.targeting.lock || t.clock - (e.playerHitAt ?? -Infinity) < $.assistMemory) return !0;
		if (!e.aggro) return !1;
		if (e.target?.isAlly) return !0;
		let n = t.player.position;
		return Math.hypot(e.position.x - n.x, e.position.z - n.z) <= $.assistNear;
	}
	_pickTarget() {
		let e = this.sys, t = this.rule, n = e.player.position, r = this.member.position, i = e.targeting.lock, a = t.attack === "assist", o = null, s = Infinity, c = !1;
		for (let l of e.enemies) {
			if (!c && l.alive && l.aggro && !l.passive && Math.hypot(l.position.x - n.x, l.position.z - n.z) <= eh && (c = !0), !this._candidate(l) || a && !this._assists(l)) continue;
			let e = l.aggro || l === i;
			if (!e && (l.elite || l.boss || Math.hypot(l.position.x - n.x, l.position.z - n.z) > fh)) continue;
			let u = Math.hypot(l.position.x - r.x, l.position.z - r.z), d = e ? 0 : dh;
			switch (t.target) {
				case "nearest":
					d += u;
					break;
				case "weakest":
					d += l.hp / l.hpMax * 100 + u * .05;
					break;
				case "strongest":
					d += -(l.boss ? 1e6 : 0) - (l.elite ? 1e5 : 0) - l.hpMax + u * .05;
					break;
				case "ranged":
					d += (l.def.token?.type === "ranged" ? 0 : 1e3) + u;
					break;
				default: d += l === i ? -1e6 : Math.hypot(l.position.x - n.x, l.position.z - n.z);
			}
			l === this.target && (d -= t.target === "weakest" || t.target === "strongest" ? .5 : 1), d < s - 1e-9 && (s = d, o = l);
		}
		return o && (o.aggro || c) ? o : null;
	}
	_fight(e, t, n) {
		let r = this.sys, i = this.member.position, a = e.position, o = a.x - i.x, s = a.z - i.z, c = Math.hypot(o, s), l = this.role !== "melee" && this._shooterAway(e, n);
		if (this.role !== "melee" && !l && c <= this._range() - .4 && this._spaceOut(a.x, a.z, t) || this.role === "melee" && this._relocate(e, c, t)) return !0;
		if (!l && (this.vq ? this._heroSkill(e, c) : this._skillReady() && this._skillSuits(e, c))) return this._startSkill(e), !0;
		if (this.role === "melee") {
			let l = this.kit.reach + e.radius, u = Math.abs(a.y - i.y), d = c <= l && u <= .6 && (c < .8 || this._arena !== null || !r.nav || r.nav.lineClear(i.x, i.z, a.x, a.z, .3));
			if (this._noReachFor !== e && (this._noReachFor = e, this._noReachT = 0), d) return this._noReachT = 0, this.atkCd <= 0 ? this._startMelee(e, 0) : (this._face(a.x, a.z), this._play("idle")), !0;
			let f = this._meleeSpot(e, l, n), p = f ?? this._leashed(a.x - o / (c || 1) * (l * .7), a.z - s / (c || 1) * (l * .7)), m = this._goTo(p.x, p.z, t, .15, !0);
			return m && f !== null || u > .6 && (m || c <= l + .4) ? (this._noReachT += t, this._noReachT >= $.noReach - 1e-6 && this.target === e && (this._skip.set(e, r.clock + $.skipFor), this.target = null, this._noReachT = 0, this._mspot.t = null)) : this._noReachT = Math.max(0, this._noReachT - t), !0;
		}
		let u = (Sm[this.rule.distance] ?? Sm.mid).standoff, d = this._range() - .4, f = !l && c <= d && r.los(i.x, i.z, a.x, a.z), p = this.vq && e.boss ? e.radius + Am.bossBerth : 0;
		if (f && c >= Math.min(u - 1.6, 1.6) + p) return this.atkCd <= 0 ? this._startShot(e) : (this._face(a.x, a.z), this._play("idle")), !0;
		if (f && c < u - 1.6 + p) {
			let n = i.x - o / (c || 1) * 1.2, l = i.z - s / (c || 1) * 1.2, u = r.player.position;
			return r.standable(n, l) && Math.hypot(n - u.x, l - u.z) <= this._leash() ? (this._goTo(n, l, t, .2, !1, e), this._face(a.x, a.z), !0) : (this.atkCd <= 0 && this._startShot(e), !0);
		}
		let m = this._shotSpot(e, u, n);
		if (m) return this._goTo(m.x, m.z, t, .3, !0), !0;
		let h = this._leashed(a.x - o / (c || 1) * Math.min(u, c * .8), a.z - s / (c || 1) * Math.min(u, c * .8));
		return this._goTo(h.x, h.z, t, .3, !0), !0;
	}
	_relocate(e, t, n) {
		let r = this.member.position, i = this.kit.reach + e.radius;
		if (!this._reloc) {
			if (this._relocT > 0 || t > i + .5 || !this._covers(r.x, r.z)) return !1;
			let n = this._meleeSpot(e, i, !0);
			if (!n || n.cover || Math.hypot(n.x - r.x, n.z - r.z) > rh) return !1;
			this._reloc = !0, this._relocT = $.relocEvery;
		}
		let a = this._meleeSpot(e, i, !1);
		return a && !a.cover && !this._goTo(a.x, a.z, n, .15, !0, e) ? !0 : (this._reloc = !1, !1);
	}
	_shooterAway(e, t) {
		let n = this.sys, r = this.member.position, i = n.player.position;
		if (Math.hypot(r.x - i.x, r.z - i.z) > this._leash() + $.leashSlack) return !0;
		if (n.projectNdc(r.x, r.y + .9, r.z, this._ndc, oh)) return !1;
		let a = this._shotSpot(e, (Sm[this.rule.distance] ?? Sm.mid).standoff, t);
		return !!a && a.on && Math.hypot(a.x - r.x, a.z - r.z) > .5;
	}
	_shotSpot(e, t, n) {
		let r = this._spot, i = this.sys, a = i.player.position, o = this._leash();
		if (!n && r.t === e && !(r.ok && Math.hypot(r.x - a.x, r.z - a.z) > o + $.leashSlack)) return r.ok ? r : null;
		let s = this.member.position, c = e.position, l = Math.max(2, Math.min(t, this._range() - 1)), u = Math.atan2(s.z - c.z, s.x - c.x);
		Number.isFinite(u) || (u = 0), r.t = e, r.ok = !1, r.on = !1;
		for (let e = 0; e < 2 && !r.ok; e++) for (let t = 0; t < 8; t++) {
			let n = u + (t % 2 ? 1 : -1) * Math.ceil(t / 2) * (Math.PI / 4), s = c.x + Math.cos(n) * l, d = c.z + Math.sin(n) * l;
			if (!(Math.hypot(s - a.x, d - a.z) > o || !i.standable(s, d) || Math.abs(i.groundAt(s, d) - c.y) > 1) && (e !== 0 || i.projectNdc(s, i.groundAt(s, d) + .9, d, this._ndc, ah)) && this._enterable(s, d) && i.los(s, d, c.x, c.z)) {
				r.x = s, r.z = d, r.ok = !0, r.on = e === 0;
				break;
			}
		}
		return r.ok ? r : null;
	}
	_spaceOut(e, t, n) {
		let r = this.sys, i = r.player.position, a = this.member.position, o = a.x - i.x, s = a.z - i.z, c = b.uCameraYaw.value, l = Math.cos(c), u = Math.sin(c), d = o * l - s * u, f = o * u + s * l;
		if (Math.abs(d) >= th.lateral || Math.abs(f) >= th.depth || this._stuckT >= .3) return !1;
		let p = Math.abs(d) > .001 ? Math.sign(d) : r.allies.indexOf(this) % 2 == 0 ? 1 : -1;
		for (let [a, o] of $m) {
			let s = l * p * a + u * o, c = -u * p * a + l * o, d = Math.hypot(s, c) || 1, f = i.x + s / d * th.step, m = i.z + c / d * th.step;
			if (!(!r.standable(f, m) || Math.abs(r.groundAt(f, m) - i.y) > .6 || !this._enterable(f, m))) return this._goTo(f, m, n, .1), this._face(e, t), !0;
		}
		return !1;
	}
	_meleeSpot(e, t, n) {
		let r = this._mspot, i = e.position, a = t * .7;
		if (n || r.t !== e) {
			let t = this.sys, n = this.member.position, o = t.player.position, s = this._leash() + .5, c = this._arena ? null : t.nav, l = Math.atan2(n.z - i.z, n.x - i.x);
			Number.isFinite(l) || (l = 0), r.t = e, r.ok = !1, r.cover = !1;
			let u = NaN;
			for (let e = 0; e < 8; e++) {
				let n = l + (e % 2 ? 1 : -1) * Math.ceil(e / 2) * (Math.PI / 4), d = i.x + Math.cos(n) * a, f = i.z + Math.sin(n) * a;
				if (!(Math.hypot(d - o.x, f - o.z) > s || !t.standable(d, f) || Math.abs(t.groundAt(d, f) - i.y) > .6) && !(!this._enterable(d, f) || c && !c.lineClear(d, f, i.x, i.z, .3))) {
					if (!this._covers(d, f)) {
						r.a = n, r.ok = !0;
						break;
					}
					Number.isNaN(u) && (u = n);
				}
			}
			!r.ok && !Number.isNaN(u) && (r.a = u, r.ok = !0, r.cover = !0);
		}
		return r.ok ? (r.x = i.x + Math.cos(r.a) * a, r.z = i.z + Math.sin(r.a) * a, r) : null;
	}
	_covers(e, t) {
		let n = this.sys, r = n.player.position, i = n._pv?.velocity, a = b.uCameraYaw.value, o = Math.cos(a), s = Math.sin(a);
		for (let n = 0; n < 2; n++) {
			let a = n && i ? i.x * nh.ahead : 0, c = n && i ? i.z * nh.ahead : 0;
			if (n && Math.abs(a) + Math.abs(c) < .05) break;
			let l = e - (r.x + a), u = t - (r.z + c), d = l * o - u * s, f = l * s + u * o;
			if (Math.abs(d) < nh.lateral && f > nh.near && f < nh.depth) return !0;
		}
		return !1;
	}
	_leashed(e, t) {
		let n = this.sys.player.position, r = this._leash(), i = e - n.x, a = t - n.z, o = Math.hypot(i, a), s = this._goal;
		return o <= r || o < 1e-6 ? (s.x = e, s.z = t) : (s.x = n.x + i / o * r, s.z = n.z + a / o * r), s;
	}
	_skillReady() {
		let e = this.rule;
		if (e.skills === "never" || e.attack === "never" || this.skillCd > 0) return !1;
		let t = this.kit.skill;
		return !(this.mp < t.mp - 1e-6 || e.skills === "save" && (Cm[e.heal] ?? 0) > 0 && this.mp - t.mp < this.kit.mend.mp - 1e-6);
	}
	_skillSuits(e, t) {
		let n = this.sys, r = this.member.position, i = e.boss || e.elite;
		if (this.cls === "warden") {
			let n = km.warden.skill;
			return (this._foesNear(r.x, r.z, n.r + .3) >= n.minFoes || i && t <= n.r + e.radius) && Math.abs(e.position.y - r.y) <= .6;
		}
		if (this.cls === "ranger") {
			let a = km.ranger.skill;
			return t > a.range - 1 || !n.los(r.x, r.z, e.position.x, e.position.z) ? !1 : i || this._foesNear(e.position.x, e.position.z, 3) >= a.minFoes;
		}
		let a = km.mystic.skill;
		return t > a.range || !n.los(r.x, r.z, e.position.x, e.position.z) ? !1 : i || this._foesNear(e.position.x, e.position.z, a.r + .4) >= a.minFoes;
	}
	_foesNear(e, t, n) {
		let r = this.sys._enemiesNear(e, t, n, this._near), i = 0;
		for (let e of r) !e.passive && e.kind !== "dummy" && e.state !== "return" && i++;
		return i;
	}
	_mendDue() {
		let e = Cm[this.rule.heal] ?? 0;
		return e > 0 && !!this.kit.mend && this.healCd <= 0 && this.mp >= this.kit.mend.mp - 1e-6 && this._pickHeal(e) !== null;
	}
	_pickHeal(e, t = Infinity) {
		let n = this.sys, r = n.pc, i = this.member.position, a = null, o = e, s = n.player.position;
		if (r.alive && Math.hypot(s.x - i.x, s.z - i.z) <= t) {
			let e = (r.hp + this._pending("player")) / r.hpMax;
			e < o && (o = e, a = "player");
		}
		for (let e of n.allies) {
			if (!e.present) continue;
			let n = e.position;
			if (Math.hypot(n.x - i.x, n.z - i.z) > t) continue;
			let r = (e.hp + this._pending(e)) / e.hpMax;
			r < o - 1e-9 && (o = r, a = e);
		}
		return a;
	}
	_healOk(e, t) {
		if (!e) return !1;
		let n = this.sys.pc;
		return e === "player" ? n.alive && (n.hp + this._pending("player")) / n.hpMax < t : e.present && (e.hp + this._pending(e)) / e.hpMax < t;
	}
	_pending(e) {
		let t = 0;
		for (let n of this.sys.allies) n === this || n.action !== "mend" || n._healWho !== e || n.frame >= n.kit.mend.at || (t += n._mendAmount(e));
		return t;
	}
	_mendAmount(e) {
		let t = this.kit.mend, n = e === "player" ? this.sys.pc.hpMax : e.hpMax;
		return Math.round(n * t.frac + t.flat);
	}
	_holdSpot(e, t) {
		let n = this.sys, r = n.player.position, i = this.member.position, a = this._hints()?.focus(n.bossFight);
		if (a && this._focusStep(a, e)) return;
		let o = this._lookFoe(), s = this._hold, c = s.kind !== "hold" || t && !s.ok || Math.hypot(r.x - s.px, r.z - s.pz) > $.holdReplan;
		if (!c && o && s.ok) {
			let e = s.x - r.x, t = s.z - r.z, n = o.position.x - r.x, i = o.position.z - r.z;
			e * n + t * i > .5 * Math.hypot(e, t) * Math.hypot(n, i) && (c = !0);
		}
		if (c) {
			s.kind = "hold", s.px = r.x, s.pz = r.z;
			let e, t;
			o ? (e = r.x - o.position.x, t = r.z - o.position.z) : (e = -n.player.facing.x, t = -n.player.facing.z);
			let i = Math.hypot(e, t) || 1;
			e /= i, t /= i;
			let a = n.allies.indexOf(this), c = a % 2 == 0 ? 1 : -1, l = [
				[.55, .85 * c],
				[.55, -.85 * c],
				[1, 0],
				[.3, .95 * c]
			];
			this._hold.ok = !1;
			for (let [i, o] of l) {
				let s = e * i + -t * o, c = t * i + e * o, l = Math.hypot(s, c) || 1;
				s /= l, c /= l;
				let u = r.x + s * $.hold * (1 + .35 * Math.floor(a / 2)), d = r.z + c * $.hold * (1 + .35 * Math.floor(a / 2));
				if (n.standable(u, d) && Math.abs(n.groundAt(u, d) - r.y) <= .6 && this._enterable(u, d)) {
					this._hold.x = u, this._hold.z = d, this._hold.ok = !0;
					break;
				}
			}
			this._hold.ok || (this._hold.x = r.x, this._hold.z = r.z);
		}
		let l = Math.hypot(s.x - i.x, s.z - i.z);
		if (this._holdWalk || l > (s.ok ? $.holdSlack : 1)) {
			let t = this._goTo(s.x, s.z, e, s.ok ? $.holdStop : 1, !1, l < $.runFrom ? o : null);
			if (this._holdWalk = !t, !t) return;
		}
		o && this._faceSteady(o.position.x, o.position.z), this._play("idle");
	}
	_focusStep(e, t) {
		let n = this.sys, r = this.member.position, i = e.r + this._reach() * .7, a = Math.atan2(r.z - e.z, r.x - e.x);
		Number.isFinite(a) || (a = 0);
		for (let r = this.role === "melee" ? 0 : 1; r < 2; r++) for (let o = 0; o < 8; o++) {
			let s = a + (o % 2 ? 1 : -1) * Math.ceil(o / 2) * (Math.PI / 4), c = e.x + Math.cos(s) * i, l = e.z + Math.sin(s) * i;
			if (!(!n.standable(c, l) || !this._enterable(c, l) || r === 0 && this._covers(c, l))) return this.mode = "hold", this._hold.kind = "focus", this._holdWalk = !1, this._goTo(c, l, t, .3) && (this._faceSteady(e.x, e.z), this._play("idle")), !0;
		}
		return !1;
	}
	_faceSteady(e, t) {
		let n = this.member.position, r = this.member.facing, i = e - n.x, a = t - n.z, o = Math.hypot(i, a);
		o < 1e-6 || (i * r.x + a * r.z) / o >= lh || this._face(e, t);
	}
	_lookFoe() {
		let e = this._foeNearPlayer(), t = this._lookAt;
		if (t && e && t !== e && t.alive && !t.dormant && t.aggro && t.sprite.visible && !t.passive) {
			let n = this.sys.player.position;
			if (Math.hypot(t.position.x - n.x, t.position.z - n.z) <= Math.hypot(e.position.x - n.x, e.position.z - n.z) + sh) return t;
		}
		return this._lookAt = e, e;
	}
	_retreat(e, t) {
		let n = this.sys, r = n.player.position, i = this.member.position, a = this._hold, o = this._foeNearPlayer() ?? this._foeNearMe(), s = -n.player.facing.x, c = -n.player.facing.z;
		o && (s = r.x - o.position.x, c = r.z - o.position.z);
		let l = Math.hypot(s, c) || 1;
		s /= l, c /= l;
		let u = a.kind !== "retreat" || t && !a.ok || Math.hypot(r.x - a.px, r.z - a.pz) > $.holdReplan;
		if (!u && o && a.ok) {
			let e = a.x - r.x, t = a.z - r.z;
			e * s + t * c < .5 * Math.hypot(e, t) && (u = !0);
		}
		u && (a.kind = "retreat", a.px = r.x, a.pz = r.z, a.x = r.x + s * $.retreat, a.z = r.z + c * $.retreat, a.ok = n.standable(a.x, a.z) && this._enterable(a.x, a.z), a.ok || (a.x = r.x, a.z = r.z));
		let d = Math.hypot(a.x - i.x, a.z - i.z);
		if (this._holdWalk || d > (a.ok ? $.holdSlack : 1)) {
			let t = this._goTo(a.x, a.z, e, a.ok ? $.holdStop : 1);
			if (this._holdWalk = !t, !t) return;
		}
		let f = this._foeNearMe();
		f && this._faceSteady(f.position.x, f.position.z), this._play("idle");
	}
	_waitAtGate(e, t) {
		let [n, r, i, a] = e.gate, o = (n + i) / 2, s = (r + a) / 2, c = o - e.center.x, l = s - e.center.z, u = Math.hypot(c, l) || 1;
		c /= u, l /= u;
		let d = this.sys.allies.indexOf(this), f = (d % 2 == 0 ? 1 : -1) * (.8 + .6 * Math.floor(d / 2)), p = o + c * 1.6 - l * f, m = s + l * 1.6 + c * f;
		this.sys.standable(p, m) || (p = o + c * 2.2, m = s + l * 2.2), this._goTo(p, m, t, .6) && (this._face(o, s), this._play("idle"));
	}
	_foeNearPlayer() {
		let e = this.sys.player.position;
		return this._nearestFoe(e.x, e.z, 16, !0);
	}
	_foeNearMe() {
		let e = this.member.position;
		return this._nearestFoe(e.x, e.z, 12, !1);
	}
	_nearestFoe(e, t, n, r) {
		let i = null, a = n;
		for (let n of this.sys.enemies) {
			if (!n.alive || n.dormant || !n.sprite.visible || n.passive || r && !n.aggro) continue;
			let o = Math.hypot(n.position.x - e, n.position.z - t);
			o < a && (a = o, i = n);
		}
		return i;
	}
	_enterable(e, t) {
		let n = this._hints();
		if (n && n.unsafe(this.sys.bossFight, e, t, $.radius)) return !1;
		let r = this.sys.sealedArena();
		return r ? this._arena ? r.contains(e, t) : !r.containsGrown(e, t, .4) : !0;
	}
	_hints() {
		let e = this.sys.bossFight;
		return e?.alive ? e.ai?.allyHints ?? null : null;
	}
	_goTo(e, t, n, r, i = !1, a = null) {
		let o = this.sys, s = this.member.position, c = Math.hypot(e - s.x, t - s.z), l = this._gp;
		if (c <= r) return this._stuckT = 0, this._pathN = 0, l.sub = -2, !0;
		let u = e, d = t, f = o.nav;
		if (f && !this._arena && !f.lineClear(s.x, s.z, e, t, .3)) {
			if ((this._pathN === 0 || Math.hypot(e - this._pathGX, t - this._pathGZ) > 1.2 || o.clock - this._pathAt > 1.5 || this._stuckT >= $.stuckPath) && o.clock - this._pathAt >= $.pathEvery && o.allySearches > 0) {
				o.allySearches--;
				let n = f.findPath(s.x, s.z, e, t, $.pathMax, this._path);
				this._pathN = Math.max(0, n), this._pathI = 0, this._pathGX = e, this._pathGZ = t, this._pathAt = o.clock, n < 0 && this._giveUp(i);
			}
			if (this._pathN > 0) {
				let e = this._followPath();
				u = this._path[e * 2], d = this._path[e * 2 + 1];
			}
		} else this._pathN = 0;
		let p = u - s.x, m = d - s.z;
		Math.hypot(p, m) < 1e-6 && (p = e - s.x, m = t - s.z);
		let h = Math.hypot(p, m) || 1;
		p /= h, m /= h;
		let g = o.pc;
		if (g.alive) {
			let e = o.player.position, t = e.x - s.x, n = e.z - s.z, r = t * p + n * m;
			if (r > 0 && r < Math.min(c, ih.ahead) && Math.abs(e.y - s.y) < 1) {
				let e = t * -m + n * p, r = $.radius + g.radius + ih.margin;
				if (Math.abs(e) < r) {
					let t = Math.abs(e) > .001 ? -Math.sign(e) : o.allies.indexOf(this) % 2 == 0 ? 1 : -1, n = ih.turn * (1 - Math.abs(e) / r), i = p - m * t * n, a = m + p * t * n;
					h = Math.hypot(i, a) || 1, p = i / h, m = a / h;
				}
			}
		}
		let _ = c > $.runFrom, ee = _ ? this.base.run : this.base.walk, v = Math.min(c - r * .5, ee * n), te = l.sub === o.stepNo - 1 && l.step > 1e-6 ? ((s.x - l.x) * l.ux + (s.z - l.z) * l.uz) / l.step : NaN;
		l.x = s.x, l.z = s.z, l.ux = p, l.uz = m, l.step = v, l.sub = o.stepNo;
		let y = v > 1e-6 ? this._move(p * v, m * v, !1) : 1;
		return a ? this._face(a.position.x, a.position.z) : this._turnTo(p, m, n), this._play(_ ? "run" : "walk"), (Number.isNaN(te) ? y : te) < .25 ? this._stuckT += n : this._stuckT = Math.max(0, this._stuckT - n), this._stuckT >= $.stuckGiveUp && (this._stuckT = 0, this._giveUp(i)), !1;
	}
	_turnTo(e, t, n) {
		let r = this.member.facing, i = Math.min(1, n / ch), a = r.x + (e - r.x) * i, o = r.z + (t - r.z) * i, s = Math.hypot(a, o);
		s < .2 ? (a = e, o = t) : (a /= s, o /= s), r.x = a, r.z = o;
	}
	_followPath() {
		let e = this.member.position, t = this._path, n = this._pathN, r = this.sys.nav, i = this._pathI;
		for (; i < n - 1;) {
			let n = t[i * 2] - e.x, a = t[i * 2 + 1] - e.z;
			if (n * n + a * a <= .35 * .35 || r.lineClear(e.x, e.z, t[i * 2 + 2], t[i * 2 + 3], 0, !0)) i++;
			else break;
		}
		return this._pathI = i, i;
	}
	_giveUp(e) {
		e && this.target && (this._skip.set(this.target, this.sys.clock + $.skipFor), this.target = null), this._hold.ok = !1, this._pathN = 0, this._planT = 0;
	}
	_evade() {
		let e = this.sys, t = this.member.position, n = this._hints();
		for (let r of e._mk) {
			if (r.h < 0 || !r.owner || r.owner === "core") continue;
			let e = r.spec;
			if (e.style === "enemy" || n && n.evade.includes(e.style)) {
				if (e.progress < $.evadeFill - 1e-6 || e.progress >= 1 - 1e-6) continue;
			} else if (e.style !== "magma") continue;
			if (this._escape(e, t.x, t.z) && this._startRoll(this._esc.x, this._esc.z, e)) return this.mode = "evade", !0;
		}
		return !1;
	}
	_escape(e, t, n) {
		let r = $.radius, i = t - e.x, a = n - e.z, o = Math.hypot(i, a), s = this._esc, c = this.member.facing;
		switch (e.shape) {
			case "circle":
			case "ring": return o >= e.r + r || e.shape === "ring" && o <= (e.rInner ?? 0) - r ? !1 : (o > .001 ? (s.x = i / o, s.z = a / o) : (s.x = -c.z, s.z = c.x), !0);
			case "sector": {
				if (o >= e.r + r) return !1;
				let t = e.dirX, n = e.dirZ, c = Math.hypot(t, n) || 1;
				if (t /= c, n /= c, o > .001) {
					let s = (i * t + a * n) / o;
					if (Math.acos(Math.max(-1, Math.min(1, s))) > e.halfAngle * Math.PI / 180 + Math.asin(Math.min(1, r / o))) return !1;
				}
				let l = i * -n + a * t >= 0 ? 1 : -1;
				return s.x = -n * l, s.z = t * l, !0;
			}
			case "lane": {
				let t = e.dirX, n = e.dirZ, o = Math.hypot(t, n) || 1;
				t /= o, n /= o;
				let c = i * t + a * n, l = i * -n + a * t;
				if (c < -r || c > e.len + r || Math.abs(l) >= e.width / 2 + r) return !1;
				let u = l >= 0 ? 1 : -1;
				return s.x = -n * u, s.z = t * u, !0;
			}
			default: return !1;
		}
	}
	_begin(e) {
		this.action = e, this.t = 0, this.frame = 0, this._prevFrame = -1, this._moved = 0, this._motion = null, this._lastCol = -1, this._lastRow = -1, this._trk.t = null, this.move = null;
	}
	_endAction() {
		this.action = null, this._actTarget = null, this._motion = null, this._lastCol = -1, this._lastRow = -1, this.move = null;
	}
	_advance(e) {
		this.t += e;
		let t = this.frame;
		this.frame = an(this.t), this._prevFrame = t;
		let n = this.action;
		(n === "shot" || n === "volley" || n === "bolt") && this._actTarget?.alive && this._track(this._actTarget, e), this._runFrame();
	}
	_track(e, t) {
		let n = this._trk, r = e.position;
		if (n.t !== e) n.t = e, n.vx = 0, n.vz = 0;
		else if (t > 1e-6) {
			let e = Math.min(1, t / $.leadTau);
			n.vx += ((r.x - n.x) / t - n.vx) * e, n.vz += ((r.z - n.z) / t - n.vz) * e;
		}
		n.x = r.x, n.z = r.z;
	}
	_at(e) {
		return this._prevFrame < e && this.frame >= e;
	}
	_runFrame() {
		if (!(this.move !== null && this._runHeroMove())) switch (this.action) {
			case "a1":
			case "a2":
				this._frameMelee();
				break;
			case "sweep":
				this._frameSweep();
				break;
			case "shot":
			case "volley":
				this._frameShot();
				break;
			case "bolt":
				this._frameBolt();
				break;
			case "flare":
				this._frameFlare();
				break;
			case "mend":
				this._frameMend();
				break;
			case "roll":
				this._frameRoll();
				break;
			case "hurt":
				this._frameHurt();
				break;
			case "knock":
				this._frameKnock();
				break;
			case "getup": this._frameGetUp();
		}
	}
	_poseSpans(e) {
		let t = this.frame;
		for (let n of e) if (t >= n[0] && t <= n[1]) {
			this._pose(String(n[2]));
			return;
		}
	}
	_startMelee(e, t) {
		this._begin(t === 0 ? "a1" : "a2"), this.vq && (this.move = t === 0 ? "bash" : "mace"), this._actTarget = e, this.vq && this._cast(this.move), this._tag = this.sys.tags.next(), this.swings++, this.counts.attacks++, this._face(e.position.x, e.position.z), this._runFrame();
	}
	_frameMelee() {
		let e = this.kit, t = this.action === "a1" ? 0 : 1, n = e.combo[t], r = this.frame, i = this._actTarget;
		if (r >= n.total) {
			if (t === 0 && i && i.alive && this._candidate(i)) {
				let t = this.member.position;
				if (Math.hypot(i.position.x - t.x, i.position.z - t.z) <= e.reach + i.radius + .4 && Math.abs(i.position.y - t.y) <= .6) {
					this._startMelee(i, 1);
					return;
				}
			}
			this.atkCd = e.comboGap * this._pace(), this._endAction(), this._play("idle", !0);
			return;
		}
		i && i.alive && r < n.active[0] && this._face(i.position.x, i.position.z), this._poseSpans(n.poses);
		let a = this.member.facing;
		this._moveAlong(n.lunge, n.lungeFrames[0], n.lungeFrames[1] + 1, a.x, a.z);
		let o = this.sys, s = this.member.position;
		if (this._at(n.fxAt) && (o.sfxAt(n.sfx, s.x, s.z, { volume: .55 }), this.vq ? this._earth?.melee(t, n) : o.fx.play(n.fx, s.x + a.x * .85, s.y, s.z + a.z * .85, {
			dirX: a.x,
			dirZ: a.z,
			scale: .85
		})), r >= n.active[0] && r <= n.active[1]) {
			let e = this._baseSpec(n.mv, n.kb, n.poise);
			e.shape = "sector", e.r = n.r, e.halfAngle = n.halfAngle, n.stun && (e.stun = n.stun), o.addAllyHit(this, e, "melee");
		}
	}
	_startSkill(e) {
		if (this.vq) {
			this._startHeroSkill(e);
			return;
		}
		let t = this.kit.skill;
		this.mp -= t.mp, this.skillCd = t.cooldown * this._pace(), this.counts.skills++, this._actTarget = e, this._face(e.position.x, e.position.z), this._tag = this.sys.tags.next();
		let n = this.cls === "warden" ? "sweep" : this.cls === "ranger" ? "volley" : "flare";
		this._begin(n), this._actTarget = e, n === "sweep" && this.swings++, this._runFrame();
	}
	_frameSweep() {
		let e = km.warden.skill, t = this.frame;
		if (t >= e.total) {
			this.atkCd = Math.max(this.atkCd, .25), this._endAction(), this._play("idle", !0);
			return;
		}
		this._pose(e.pose);
		let n = this.sys, r = this.member.position;
		if (this._at(3) && n.sfxAt("whirl", r.x, r.z, { volume: .6 }), this._at(e.active[0] - 2) && n.fx.play("spin", r.x, r.y, r.z, {
			follow: r,
			scale: .95
		}), t >= e.active[0] && t <= e.active[1]) {
			let t = this._baseSpec(e.mv, e.kb, e.poise);
			t.shape = "circle", t.r = e.r, n.addAllyHit(this, t, "skill");
		}
	}
	_startShot(e) {
		this._begin(this.cls === "mystic" || this.vq ? "bolt" : "shot"), this.vq && (this.move = this.kit.basic.id), this._actTarget = e, this.vq && this._cast(this.move), this.counts.attacks++, this._face(e.position.x, e.position.z), this._runFrame();
	}
	_frameShot() {
		let e = this.action === "volley", t = km.ranger.basic, n = km.ranger.skill, r = e ? n.total : t.total, i = e ? n.release : t.release, a = this.frame;
		if (a >= r) {
			this.atkCd = Math.max(this.atkCd, t.cooldown * this._pace()), this._endAction(), this._play("idle", !0);
			return;
		}
		this._poseSpans(e ? n.poses : t.poses);
		let o = this._actTarget;
		if (o && o.alive && a < i && this._face(o.position.x, o.position.z), this._at(i)) {
			let r = this.sys, i = e ? n.n : 1;
			for (let r = 0; r < i; r++) {
				let a = i === 1 ? 0 : (r - (i - 1) / 2) * n.spread * Math.PI / 180;
				this._shoot("arrow", e ? n : t, o, a, null);
			}
			let a = this.member.position;
			r.sfxAt("arrow", a.x, a.z, { volume: .6 });
		}
	}
	_frameBolt() {
		let e = km.mystic.basic, t = this.frame;
		if (t >= e.total) {
			this.atkCd = Math.max(this.atkCd, e.cooldown * this._pace()), this._endAction(), this._play("idle", !0);
			return;
		}
		this._poseSpans(e.poses);
		let n = this._actTarget;
		if (n && n.alive && t < e.release && this._face(n.position.x, n.position.z), this._at(e.release)) {
			this._shoot("emberBolt", e, n, 0, e.splash);
			let t = this.member.position;
			this.sys.sfxAt("bolt", t.x, t.z, {
				volume: .55,
				pitch: 1.15
			});
		}
	}
	_shoot(e, t, n, r, i) {
		let a = this.sys, o = this.member.position, s = this.member.facing, c = this._proj;
		c.kind = e, c.x = o.x + s.x * .4, c.z = o.z + s.z * .4, c.y = o.y + kn;
		let l = s.x, u = s.z, d = 8, f = c.y;
		if (n && n.alive) {
			let e = n.position.x, r = n.position.z, i = this._trk;
			if (i.t === n) {
				let n = 0, a = 0;
				for (let o = 0; o < 2; o++) {
					let o = Math.hypot(e + n - c.x, r + a - c.z) / t.speed;
					n = i.vx * o, a = i.vz * o;
				}
				let o = Math.hypot(n, a);
				o > $.leadMax && (n *= $.leadMax / o, a *= $.leadMax / o), e += n, r += a;
			}
			l = e - c.x, u = r - c.z, d = Math.hypot(l, u), d > .001 ? (l /= d, u /= d) : (l = s.x, u = s.z);
			let o = n.def.body;
			f = a.bodyBase(n) + (o[0] + o[1]) / 2;
		}
		let p = Math.cos(r), m = Math.sin(r);
		c.dirX = l * p - u * m, c.dirZ = l * m + u * p, c.vy = lr(c.y, f, t.speed, d), c.speed = t.speed, c.range = t.range, c.radius = t.radius, c.mv = t.mv, c.kb = t.kb, c.poise = t.poise, c.pierce = !1, c.splash = i, c.arc = null, a.spawnAllyProjectile(this, c);
	}
	_frameFlare() {
		let e = km.mystic.skill, t = this.frame;
		if (t >= e.total) {
			this.atkCd = Math.max(this.atkCd, .3), this._endAction(), this._play("idle", !0);
			return;
		}
		this._pose(e.pose);
		let n = this._actTarget;
		if (n && n.alive && t < e.at && this._face(n.position.x, n.position.z), this._at(e.at)) {
			let t = this.sys, r = this.member.position, i = n && n.alive ? n.position : null, a = i ? i.x : r.x + this.member.facing.x * 4, o = i ? i.z : r.z + this.member.facing.z * 4, s = this._flares.find((e) => !e.on);
			s && (s.on = !0, s.x = a, s.z = o, s.y = t.groundAt(a, o), s.t = e.delay, s.tag = t.tags.next(), t.burst("sparkle", a, s.y + .4, o, 6)), t.sfxAt("bolt", r.x, r.z, {
				volume: .45,
				pitch: .8
			});
		}
	}
	_stepFlares(e) {
		let t = this.sys;
		for (let n of this._flares) {
			if (!n.on) continue;
			if (n.t -= e, n.t > 1e-6) {
				Math.floor((n.t + e) / .15) !== Math.floor(n.t / .15) && t.burst("emberBurst", n.x, n.y + .2, n.z, 2);
				continue;
			}
			n.on = !1;
			let r = km.mystic.skill, i = this._spec;
			i.shape = "circle", i.x = n.x, i.y = n.y, i.z = n.z, i.r = r.r, i.rInner = 0, i.dirX = 0, i.dirZ = 1, i.dy = On, i.mv = r.mv, i.kb = r.kb, i.poise = r.poise, i.knockdown = !1, i.flat = 0, i.thin = !1, i.tag = n.tag, i.fromX = n.x, i.fromZ = n.z, t.addAllyHit(this, i, "skill"), t.fx.play("impact", n.x, n.y, n.z, { scale: 1.5 }), t.burst("magicBurst", n.x, n.y + .6, n.z, 16), t.burst("emberBurst", n.x, n.y + .3, n.z, 10), t.sfxAt("hexBurst", n.x, n.z, { volume: .7 });
		}
	}
	_startMend() {
		let e = this.kit.mend;
		this.mp -= e.mp, this.healCd = e.cooldown, this._begin("mend"), this.vq && (this.move = "mend", this._cast("mend"));
		let t = this._healWho, n = t === "player" ? this.sys.player.position : t && t !== this ? t.position : null;
		n && this._face(n.x, n.z), this._runFrame();
	}
	_frameMend() {
		let e = this.kit.mend, t = this.frame;
		if (t >= e.total) {
			this._endAction(), this._play("idle", !0);
			return;
		}
		if (this._pose(t < e.at + 4 ? "cast" : "follow"), this._at(e.at)) {
			let t = this.sys, n = this._healWho, r = Cm[this.rule.heal] ?? 0;
			if (!this._needsHeal(n, r)) {
				let t = this._pickHeal(r, e.range + 1);
				if (t) n = t;
				else if (!n || this._missing(n) < this._mendAmount(n) * .5) {
					this._healWho = null, this.mp = Math.min(this.mpMax, this.mp + e.mp), this.healCd = Math.min(this.healCd, uh), this._holy?.fizzled(), this._endAction(), this._play("idle", !0);
					return;
				}
			}
			this._healWho = null;
			let i = 0, a = null;
			if (n === "player") t.pc.alive && (i = t.pc.heal(Math.round(t.pc.hpMax * e.frac + e.flat)), a = t.player.position);
			else if (n) {
				let t = n;
				i = t.heal(Math.round(t.hpMax * e.frac + e.flat)), a = t.position;
			}
			let o = this.member.position;
			this.vq ? (this._holy?.mended(a), t.sfxAt("sanctuary", o.x, o.z, {
				volume: .45,
				pitch: 1.5
			})) : (t.burst("healGlow", o.x, o.y + 1.2, o.z, 6), a && t.burst("healGlow", a.x, a.y + .9, a.z, 12), t.sfxAt("pickup", o.x, o.z, {
				volume: .55,
				pitch: .75
			})), this.counts.heals++, this.counts.healed += i, t.events.emit("allyHeal", this.id, n === "player" ? "player" : n?.id ?? null, i);
		}
	}
	_needsHeal(e, t) {
		if (!e) return !1;
		let n = this.sys.pc;
		return e === "player" ? n.alive && n.hp / n.hpMax < t : e.present && e.hp / e.hpMax < t;
	}
	_missing(e) {
		let t = this.sys.pc;
		return e === "player" ? t.alive ? Math.max(0, t.hpMax - t.hp) : 0 : e.present ? Math.max(0, e.hpMax - e.hp) : 0;
	}
	_startRoll(e, t, n) {
		let r = this.sys, i = this.member.position, a = $.roll.dist, o = r.groundAt(i.x, i.z), s = this._esc;
		for (let s of mh) {
			let c = Math.cos(s), l = Math.sin(s), u = e * c - t * l, d = e * l + t * c, f = i.x + u * a, p = i.z + d * a, m = i.x + u * a * .5, h = i.z + d * a * .5;
			if (r.standable(f, p) && r.standable(m, h) && !(Math.abs(r.groundAt(m, h) - o) > .55 || Math.abs(r.groundAt(f, p) - r.groundAt(m, h)) > .55) && this._enterable(f, p) && !this._escape(n, f, p)) return this._begin("roll"), this.rollCd = $.roll.cooldown, this.counts.rolls++, this.member.facing.x = u, this.member.facing.z = d, this._motion = {
				dist: a,
				f0: 0,
				f1: $.roll.moveFrames + 1,
				dx: u,
				dz: d
			}, r.burst("footstep", i.x, i.y + .05, i.z, 4), r.sfxAt("dodge", i.x, i.z, { volume: .5 }), this._runFrame(), !0;
		}
		return s.x = e, s.z = t, !1;
	}
	_frameRoll() {
		let e = $.roll;
		if (this.frame >= e.total) {
			this._endAction(), this._play("idle", !0);
			return;
		}
		this._poseSpans(e.poses);
		let t = this._motion;
		t && this._moveAlong(t.dist, t.f0, t.f1, t.dx, t.dz);
	}
	takeHit(e, t, n, r, i) {
		if (this.hp = Math.max(0, this.hp - e), this.flashT = yp.time, this.counts.hurts++, this.counts.damageTaken += e, this.hp <= 0) return this._goDown(), "down";
		if (this.vq) {
			if (this._heroArmor(t, i, n, r)) return "armor";
		} else if (this.action === "sweep" && this.frame <= km.warden.skill.armor || !(t > 0) && !i && (this.action === "mend" || this.action === "flare")) return "armor";
		return this.shove(t, n, r, i), this.action === "knock" ? "knockdown" : "hurt";
	}
	hurtFlat(e) {
		this.hp = Math.max(0, this.hp - e), this.flashT = yp.time, this.counts.hurts++, this.counts.damageTaken += e, this.hp <= 0 && this._goDown();
	}
	shove(e, t, n, r = !1) {
		if (this.down || this.gone) return;
		let i = r || e >= $.knockdown.kb;
		(this.cls !== "greatshield" || i || this.action === "roll") && (this._begin(i ? "knock" : "hurt"), this._motion = {
			dist: Math.min($.kbCap, Math.max(0, e)),
			f0: 0,
			f1: i ? $.knockdown.slide : $.hurt.slide,
			dx: t,
			dz: n
		}, Math.hypot(t, n) > .001 && (this.member.facing.x = -t, this.member.facing.z = -n), this._runFrame());
	}
	_frameHurt() {
		let e = $.hurt;
		if (this.frame >= e.total) {
			this.iframes = Math.max(this.iframes, e.iframes), this.blink = !0, this._endAction(), this._play("idle", !0);
			return;
		}
		this._pose("hurt");
		let t = this._motion;
		t && this._moveAlong(t.dist, t.f0, t.f1, t.dx, t.dz, !1);
	}
	_frameKnock() {
		let e = $.knockdown;
		if (this.frame >= e.down + e.getUp) {
			this.iframes = Math.max(this.iframes, e.iframes), this.blink = !0, this._endAction(), this._play("idle", !0);
			return;
		}
		this._pose(this.frame < e.down ? "down" : "tuck");
		let t = this._motion;
		t && this._moveAlong(t.dist, t.f0, t.f1, t.dx, t.dz, !1);
	}
	_goDown() {
		this._endAction(), this.down = !0, this.hp = 0, this.target = null, this._healWho = null, this.counts.downs++, this.iframes = 0, this.blink = !1, this.vq && (this._reviveWho = null), this._pose("down");
		let e = this.sys, t = this.member.position;
		e.sfxAt("playerDown", t.x, t.z, {
			volume: .45,
			pitch: 1.2
		}), e.burst("hitSpark", t.x, t.y + .6, t.z, 6), e.onAllyDown(this);
	}
	_getUp() {
		this.down = !1, this.hp = Math.max(1, Math.round(this.hpMax * $.getUp)), this._begin("getup");
		let e = this.sys, t = this.member.position;
		e.burst("healGlow", t.x, t.y + .8, t.z, 6), e.events.emit("allyUp", this.id), this._runFrame();
	}
	_frameGetUp() {
		if (this.frame >= $.getUpFrames) {
			this._endAction(), this._play("idle", !0);
			return;
		}
		this._pose("tuck");
	}
	_baseSpec(e, t, n) {
		let r = this._spec;
		this.vq && (r.chill = void 0, r.slow = void 0, r.freeze = void 0, r.stun = void 0, r.feel = void 0);
		let i = this.member.position, a = this.member.facing;
		return r.shape = "sector", r.x = i.x, r.y = i.y, r.z = i.z, r.r = 1, r.rInner = 0, r.dirX = a.x, r.dirZ = a.z, r.halfAngle = 60, r.len = 1, r.width = 1, r.dy = On, r.mv = e, r.kb = t, r.poise = n, r.knockdown = !1, r.flat = 0, r.thin = !1, r.tag = this._tag, r.fromX = i.x, r.fromZ = i.z, r;
	}
	_face(e, t) {
		let n = this.member.position, r = e - n.x, i = t - n.z, a = Math.hypot(r, i);
		a < 1e-6 || (this.member.facing.x = r / a, this.member.facing.z = i / a, !this.action && this.member.sprite && this.member.sprite.faceVector(r, i));
	}
	_pose(e) {
		let t = this.member.sprite;
		if (!t) return;
		let n = t.sheet.poses;
		if (!n) {
			this._play("idle");
			return;
		}
		let r = n[e] ?? 0, i = this.member.facing, a = ve.directionFromVector(i.x, i.z, b.uCameraYaw.value, t.direction), o = Math.max(0, g.indexOf(a));
		(r !== this._lastCol || o !== this._lastRow || t.animation !== null) && (t.direction = a, t.setFrame(r, o), this._lastCol = r, this._lastRow = o, this._anim = "");
	}
	_play(e, t = !1) {
		let n = this.member.sprite;
		if (!n) return;
		if (!t && this._anim === e && n.animation !== null && n.animation.startsWith(e)) {
			let e = this.member.facing;
			n.faceVector(e.x, e.z);
			return;
		}
		let r = this.member.facing;
		n.faceVector(r.x, r.z), n.play(e), this._anim = e, this._lastCol = -1, this._lastRow = -1;
	}
	_moveAlong(e, t, n, r, i, a = !1) {
		if (!(e > 0)) return;
		let o = w(t), s = w(n), c = Math.max(0, Math.min(1, (this.t - o) / (s - o))), l = (1 - (1 - c) * (1 - c)) * e, u = l - this._moved;
		this._moved = l, u > 1e-6 && this._move(r * u, i * u, a);
	}
	_move(e, t, n) {
		let r = Math.hypot(e, t);
		if (r < 1e-9) return 1;
		let i = this.member, a = i.position, o = this.sys.sealedArena();
		if (o) {
			if (this._arena) {
				let n = o.rect;
				if (e = Math.min(n.maxX - .35, Math.max(n.minX + .35, a.x + e)) - a.x, t = Math.min(n.maxZ - .35, Math.max(n.minZ + .35, a.z + t)) - a.z, Math.hypot(e, t) < 1e-9) return 0;
			} else if (o.containsGrown(a.x + e, a.z + t, .4) && !o.containsGrown(a.x, a.z, .4)) return 0;
		}
		let s = a.x, c = a.z, l = i.facing.x, u = i.facing.z;
		return i.moveBy(e, t), n || (i.facing.x = l, i.facing.z = u), Math.min(1, Math.hypot(a.x - s, a.z - c) / r);
	}
	push(e, t) {
		this._move(e, t, !1);
	}
	placeAt(e, t) {
		this.member.placeAt(e, t), this.onTeleport();
	}
	afterFrame(e, t, n, r) {
		let i = this.member.sprite;
		if (this.gone || !i) return;
		let a = this.sys, o = this.member.position;
		t && e > 0 && (this.view.velocity.x = (o.x - this._prevX) / e, this.view.velocity.z = (o.z - this._prevZ) / e), this._prevX = o.x, this._prevZ = o.z;
		let s = this.active;
		if ((this.action || this.down) && this._lastCol >= 0) {
			let e = this.member.facing, t = ve.directionFromVector(e.x, e.z, b.uCameraYaw.value, i.direction), n = Math.max(0, g.indexOf(t));
			n !== this._lastRow && (i.direction = t, i.setFrame(this._lastCol, n), this._lastRow = n);
		}
		this.flashT > 0 ? (this.flashT = Math.max(0, this.flashT - r), this._flashOn || i.setFlash(yp.r, yp.g, yp.b, yp.a), this._flashOn = !0) : this._flashOn &&= (i.setFlash(0, 0, 0, 0), !1), this.blink && this.iframes <= 0 && (this.blink = !1);
		let c = this.blink && !this.down && Math.floor(a.clock * 15 * 2) % 2 == 1;
		i.mesh.visible === c && (i.mesh.visible = !c), s ? (i.speed = n ? !t || a.stop > 0 ? 0 : a.playerScale : 1, this._speedSet = !0) : this._speedSet &&= (i.speed = 1, !1), this._fx && this._writeHeroFx(r);
	}
	info() {
		this.gone || this.syncLevel();
		let e = this.member.position, t = (e) => +e.toFixed(3);
		return {
			id: this.id,
			name: this.member.name,
			cls: this.cls,
			preset: Re(this.rule),
			level: this.level,
			hp: Math.ceil(this.hp),
			hpMax: this.hpMax,
			mp: t(this.mp),
			mpMax: this.mpMax,
			atk: t(this.atk),
			def: t(this.def),
			down: this.down,
			active: this.active,
			mode: this.mode,
			action: this.action,
			actionFrame: this.frame,
			target: this.target?.uid ?? null,
			targetedBy: this.sys.targetedBy(this),
			kills: this.kills,
			x: t(e.x),
			z: t(e.z),
			invulnerable: this.invulnerable,
			cooldowns: {
				attack: t(this.atkCd),
				skill: t(this.skillCd),
				heal: t(this.healCd),
				roll: t(this.rollCd)
			},
			counts: { ...this.counts },
			...this.vq ? { hero: this.heroInfo() } : {}
		};
	}
	heroInfo() {
		let e = (e) => +e.toFixed(3);
		return {
			move: this.move,
			skill2: e(this.skill2Cd),
			revive: e(this.reviveCd),
			gap: e(this.gapCd),
			casts: { ...this.casts },
			missiles: this._missiles.filter((e) => e.on).length,
			fields: this._fields.filter((e) => e.on).length,
			quads: (this._fx ? this._fx.count : 0) + (this._ice ? this._ice.count : 0) + (this._holy ? this._holy.count : 0) + (this._earth ? this._earth.count : 0),
			reviving: this._reviveWho?.id ?? null,
			...this._ice ? { ice: this._ice.info() } : {},
			...this._holy ? { holy: this._holy.info() } : {},
			...this._earth ? { earth: this._earth.info() } : {}
		};
	}
	_thinkHero(e) {
		let t = this.sys, n = this.rule, r = this.heroKit;
		this._planT -= e;
		let i = this._planT <= 0;
		i && (this._planT = Math.max(this._planT + $.planEvery, .05));
		let a = t.sealedArena();
		if (a && !this._arena) {
			this.mode = "wait", this.target = null, this._waitAtGate(a, e);
			return;
		}
		if (n.evade === "on" && this.rollCd <= 0 && this._evade()) return;
		let o = Cm[n.heal] ?? 0;
		if (o > 0 && r.revive && this._reviveStep(e, i) || o > 0 && this.cls === "cleric" && this._sanctuaryStep(e, o)) return;
		let s = this._reserve(), c = s > 0 && this._playerCritical();
		if (o > 0 && r.mend && this.healCd <= 0 && (this.mp - r.mend.mp >= s - 1e-6 || c && this.mp >= r.mend.mp - 1e-6)) {
			(i || !this._healOk(this._healWho, o)) && (this._healWho = this._pickHeal(o)), this.mp - r.mend.mp < s - 1e-6 && (this._healWho = "player");
			let n = this._healWho;
			if (n) {
				let i = n === "player" ? t.player.position : n.position, a = this.member.position;
				if (this.mode = "heal", Math.hypot(i.x - a.x, i.z - a.z) <= r.mend.range) {
					this._startMend();
					return;
				}
				this._goTo(i.x, i.z, e, r.mend.range - 1);
				return;
			}
		} else this._healWho = null;
		if (this.hp < this.hpMax * (wm[n.retreat] ?? 0)) {
			this.mode = "retreat", this.target = null, this._retreat(e, i);
			return;
		}
		if (n.attack !== "never") {
			(i || this.target !== null && !this._candidate(this.target)) && (this.target = this._pickTarget());
			let t = this.target;
			if (t && this._fight(t, e, i)) {
				this.mode = "attack";
				return;
			}
		} else this.target = null;
		this.mode = "hold", this._holdSpot(e, i);
	}
	_heroReady(e, t) {
		let n = this.rule;
		if (n.skills === "never" || n.attack === "never" || t > 0 || this.gapCd > 0 || this.mp < e.mp - 1e-6) return !1;
		let r = this.kit.mend;
		if (n.skills === "save" && r && (Cm[n.heal] ?? 0) > 0 && this.mp - e.mp < r.mp - 1e-6) return !1;
		if (e.keep !== void 0) {
			let t = this.heroKit.revive;
			if (this.mp - e.mp < Math.max((t?.mp ?? 0) + (r?.mp ?? 0), e.keep * this.mpMax) - 1e-6) return !1;
		}
		return !0;
	}
	_reserve() {
		let e = this.vq ? this.heroKit.revive : null;
		return e ? e.mp : 0;
	}
	_playerCritical() {
		let e = this.sys.pc, t = this.kit.critical ?? 0;
		return e.alive && e.hp < e.hpMax * t;
	}
	_heroSkill(e, t) {
		this._next = null;
		let n = this.kit, r = n.skill, i = n.skill2, a = this._heroReady(r, this.skillCd), o = this.cls !== "cleric" && this._heroReady(i, this.skill2Cd);
		if (!a && !o) return !1;
		let s = this.sys, c = this.member.position, l = e.position, u = e.boss || e.elite;
		if (this.cls === "greatshield") return a && this._bulwarkSuits(r) ? this._next = "skill" : o && Math.abs(l.y - c.y) <= .6 && (this._fightersNear(c.x, c.z, Am.quakeReach) >= i.minFoes || u && t <= n.reach + e.radius + .4) && (this._next = "skill2"), this._next !== null;
		let d = this._spellSpot(e), f = Math.hypot(d.x - c.x, d.z - c.z);
		if (!s.los(c.x, c.z, l.x, l.z)) return !1;
		if (this.cls === "cleric") return a && f <= r.range && (u || this._fightersNear(d.x, d.z, Am.judgementReach) >= r.minFoes) && (this._next = "skill"), this._next !== null;
		let p = this._fightersNear(d.x, d.z, Am.tombReach), m = this._fightersNear(d.x, d.z, Am.blizzardReach);
		return o && f <= i.range && (p >= i.minFoes + 1 || u) ? this._next = "skill2" : a && !e.boss && f <= r.range && m >= r.minFoes ? this._next = "skill" : o && f <= i.range && p >= i.minFoes && (this._next = "skill2"), this._next !== null;
	}
	_bulwarkSuits(e) {
		let t = this.sys, n = this.member.position, r = t._enemiesNear(n.x, n.z, e.r, this._near), i = 0, a = 0;
		for (let e of r) this._fighter(e) && (i++, e.target !== this && !e.boss && a++);
		if (a >= Am.bulwarkOthers || i >= Am.bulwarkCrowd) return !0;
		let o = t.pc;
		if (o.alive && o.hp < o.hpMax * e.hurtAt) {
			let r = t.player.position;
			return this._fightersNear(r.x, r.z, 3) >= 1 && Math.hypot(r.x - n.x, r.z - n.z) <= e.r;
		}
		return !1;
	}
	_fighter(e) {
		return !e.alive || e.dormant || e.passive || e.kind === "dummy" || e.state === "return" ? !1 : e.aggro || e === this.sys.targeting.lock;
	}
	_fightersNear(e, t, n) {
		let r = this.sys._enemiesNear(e, t, n, this._near), i = 0;
		for (let e of r) this._fighter(e) && i++;
		return i;
	}
	_spellSpot(e) {
		let t = e.position, n = this.sys._enemiesNear(t.x, t.z, Am.centroid, this._near), r = 0, i = 0, a = 0;
		for (let e of n) this._fighter(e) && (r += e.position.x, i += e.position.z, a++);
		let o = this._spellAt;
		return a > 1 ? (o.x = (t.x + r / a) / 2, o.z = (t.z + i / a) / 2) : (o.x = t.x, o.z = t.z), o;
	}
	_reviveStep(e, t) {
		let n = this.heroKit.revive;
		if (this.reviveCd > 0 || this.mp < n.mp - 1e-6) return this._reviveWho = null, !1;
		(t || !this._fallenOk(this._reviveWho)) && (this._reviveWho = this._pickFallen());
		let r = this._reviveWho;
		if (!r) return !1;
		let i = this.member.position, a = r.position;
		return this.mode = "heal", Math.hypot(a.x - i.x, a.z - i.z) <= n.range + .2 ? (this._startRevive(r), !0) : (this._goTo(a.x, a.z, e, n.range), !0);
	}
	_fallenOk(e) {
		if (!e || !e.down || e.gone || !e.member.sprite || e === this) return !1;
		let t = this.heroKit.revive, n = e.position, r = this.sys.player.position;
		return !this._arena && Math.hypot(n.x - r.x, n.z - r.z) > t.reach || !this._enterable(n.x, n.z) ? !1 : this._nearestFoe(n.x, n.z, e._downT >= t.brave ? t.safe * .5 : t.safe, !0) === null;
	}
	_pickFallen() {
		let e = this.member.position, t = null, n = Infinity;
		for (let r of this.sys.allies) {
			if (!this._fallenOk(r)) continue;
			let i = Math.hypot(r.position.x - e.x, r.position.z - e.z);
			i < n && (n = i, t = r);
		}
		return t;
	}
	_sanctuaryStep(e, t) {
		let n = this.kit.skill2;
		if (this.skill2Cd > 0 || this.gapCd > 0 || this.mp < n.mp - 1e-6 || this.mp - n.mp < this._reserve() - 1e-6 && !this._playerCritical()) return !1;
		let r = this.sys, i = this.member.position, a = Math.min(.9, t + n.lift), o = 0, s = 0, c = 0, l = n.range + n.r, u = r.pc, d = r.player.position;
		u.alive && u.hp < u.hpMax * a && Math.hypot(d.x - i.x, d.z - i.z) <= l && (o++, s += d.x, c += d.z);
		for (let e of r.allies) {
			if (!e.present || e.hp >= e.hpMax * a) continue;
			let t = e.position;
			Math.hypot(t.x - i.x, t.z - i.z) > l || (o++, s += t.x, c += t.z);
		}
		if (!(o >= n.minHurt || o >= 1 && u.alive && this._fightersNear(d.x, d.z, 5) >= n.crowd)) return !1;
		let f = s / o, p = c / o, m = this._spellAt;
		return m.x = f, m.z = p, this.mode = "heal", Math.hypot(f - i.x, p - i.z) <= n.range ? (this._startHeroSkill(null, "skill2"), !0) : (this._goTo(f, p, e, n.range - 1), !0);
	}
	_startHeroSkill(e, t = this._next ?? "skill") {
		let n = this.kit, r = t === "skill2" ? n.skill2 : n.skill;
		this.mp -= r.mp;
		let i = r.id === "sanctuary" ? 1 : this._pace();
		t === "skill2" ? this.skill2Cd = r.cooldown * i : this.skillCd = r.cooldown * i, this.gapCd = Am.skillGap, this.counts.skills++;
		let a = r.id, o = this.cls === "greatshield" ? "sweep" : a === "sanctuary" ? "mend" : "flare";
		e ? (this._face(e.position.x, e.position.z), this.role !== "melee" && this._spellSpot(e)) : this._face(this._spellAt.x, this._spellAt.z), this._tag = this.sys.tags.next(), this._begin(o), this.move = a, this._actTarget = e, o === "sweep" && this.swings++, this._cast(a), this._next = null, this._runFrame();
	}
	_startRevive(e) {
		let t = this.heroKit.revive;
		this.mp -= t.mp, this.reviveCd = t.cooldown, this._begin("mend"), this.move = "revive", this._reviveWho = e, this._face(e.position.x, e.position.z), this._cast("revive"), this._runFrame();
	}
	_cast(e) {
		this.casts[e] = (this.casts[e] ?? 0) + 1;
	}
	_runHeroMove() {
		switch (this.move) {
			case "holyBolt":
			case "frostLance": return this._frameMissileCast(), !0;
			case "judgement":
			case "blizzard":
			case "glacialTomb":
			case "sanctuary":
			case "bulwark":
			case "earthshatter": return this._frameHeroSkill(), !0;
			case "revive": return this._frameRevive(), !0;
			default: return !1;
		}
	}
	_frameMissileCast() {
		let e = this.kit.basic, t = this.frame;
		if (t >= e.total) {
			this.atkCd = Math.max(this.atkCd, e.cooldown * this._pace()), this._endAction(), this._play("idle", !0);
			return;
		}
		this._poseSpans(e.poses);
		let n = this._actTarget;
		n && n.alive && t < e.release && this._face(n.position.x, n.position.z);
		let r = this.member.position;
		this._at(4) && (this.member.facing, e.id === "holyBolt" ? this._holy?.gather("holyBolt") : this._ice?.gather()), this._at(e.release) && (this._launch(e, n), this.sys.sfxAt(e.id === "holyBolt" ? "holyBolt" : "iceShard", r.x, r.z, { volume: .55 }), e.id === "frostLance" && this._ice?.released("frostLance"));
	}
	_frameHeroSkill() {
		let e = this.kit, t = e.skill.id === this.move ? e.skill : e.skill2, n = this.frame;
		if (n >= t.total) {
			this.atkCd = Math.max(this.atkCd, .3), this._endAction(), this._play("idle", !0);
			return;
		}
		this._poseSpans(t.poses);
		let r = this._actTarget;
		r && r.alive && n < t.at && this.role !== "melee" ? (this._spellSpot(r), this._face(this._spellAt.x, this._spellAt.z)) : r && r.alive && n < t.at && this._face(r.position.x, r.position.z), this._skillWindup(t, n), this._at(t.at) && this._skillAt(t);
	}
	_skillWindup(e, t) {
		if (!(t % 6 != 0 || t >= e.at || this._prevFrame === t)) switch (e.id) {
			case "judgement":
			case "sanctuary":
				this._holy?.gather(e.id);
				break;
			case "blizzard":
			case "glacialTomb":
				this._ice?.gather();
				break;
			default: this._earth?.windup(e, t);
		}
	}
	_skillAt(e) {
		let t = this.sys, n = this.member.position, r = this._spellAt;
		switch (e.id) {
			case "judgement":
				this._openField("judgement", r.x, r.z), t.sfxAt("holyPillar", r.x, r.z, {
					volume: .5,
					pitch: 1.2
				});
				break;
			case "sanctuary":
				this._openField("sanctuary", r.x, r.z);
				break;
			case "blizzard":
				this._openField("blizzard", r.x, r.z), this._ice?.released("blizzard");
				break;
			case "glacialTomb":
				this._openField("glacialTomb", r.x, r.z), this._ice?.released("glacialTomb");
				break;
			case "bulwark":
				this._bulwark(e);
				break;
			case "earthshatter": {
				let e = this.member.facing;
				this._openField("earthshatter", n.x + e.x * .9, n.z + e.z * .9);
				break;
			}
		}
	}
	_frameRevive() {
		let e = this.heroKit.revive, t = this.frame;
		if (t >= e.total) {
			this._endAction(), this._play("idle", !0);
			return;
		}
		this._poseSpans(e.poses);
		let n = this._reviveWho, r = this.sys;
		if (n && t % 8 == 0 && this._prevFrame !== t && t < e.at && this._holy?.raiseMote(n), t === 2 && this._prevFrame < 2 && n && this._holy?.raiseStart(n), this._at(e.at)) {
			if (this._reviveWho = null, n && n.down && !n.gone) {
				n.revive(e.frac, e.iframes);
				let t = n.position;
				this._holy?.raised(n), r.sfxAt("sanctuary", t.x, t.z, {
					volume: .7,
					pitch: 1.25
				}), this.counts.heals++, r.events.emit("allyRevive", this.id, n.id);
			} else this.mp = Math.min(this.mpMax, this.mp + e.mp * .5), this._holy?.raiseFailed();
		}
	}
	revive(e, t) {
		return !this.down || this.gone ? !1 : (this.down = !1, this.hp = Math.max(1, Math.round(this.hpMax * e)), this._begin("getup"), this.iframes = Math.max(this.iframes, t), this.blink = !0, this.sys.events.emit("allyUp", this.id), this._runFrame(), !0);
	}
	_heroArmor(e, t, n, r) {
		let i = t || e >= $.knockdown.kb;
		if (this.cls === "greatshield") {
			let e = this.kit, t = this.move === "bulwark" ? e.skill : this.move === "earthshatter" ? e.skill2 : null;
			if (i && !(t && this.frame <= t.armor)) return !1;
			let a = this.member.position;
			return this._earth?.block(n, r), this.sys.sfxAt("guard", a.x, a.z, {
				volume: .35,
				pitch: .85
			}), !0;
		}
		return !(e > 0) && !t && (this.action === "mend" || this.action === "flare");
	}
	_launch(e, t) {
		let n = this._missiles.find((e) => !e.on);
		if (!n) return;
		let r = this.sys, i = this.member.position, a = this.member.facing;
		n.on = !0, n.spec = e, n.x = i.x + a.x * .45, n.z = i.z + a.z * .45, n.y = i.y + kn + .35, n.traveled = 0, n.age = 0, n.trail = 0, n.target = t && t.alive ? t : null, n.tag = r.tags.next();
		let o = a.x, s = a.z, c = 8, l = n.y;
		if (n.target) {
			let i = t.position.x, u = t.position.z, d = this._trk;
			if (e.turn <= 0 && d.t === t) {
				let t = 0, r = 0;
				for (let a = 0; a < 2; a++) {
					let a = Math.hypot(i + t - n.x, u + r - n.z) / e.speed;
					t = d.vx * a, r = d.vz * a;
				}
				let a = Math.hypot(t, r);
				a > $.leadMax && (t *= $.leadMax / a, r *= $.leadMax / a), i += t, u += r;
			}
			o = i - n.x, s = u - n.z, c = Math.hypot(o, s), c > .001 ? (o /= c, s /= c) : (o = a.x, s = a.z);
			let f = t.def.body;
			l = r.bodyBase(t) + (f[0] + f[1]) / 2;
		}
		n.dx = o, n.dz = s, n.vy = lr(n.y, l, e.speed, c), e.id === "holyBolt" ? this._holy?.launch(n) : (this._ice?.launch(n), r.burst("partyFrostShards", n.x, n.y, n.z, 4));
	}
	_stepMissiles(e) {
		for (let t of this._missiles) t.on && this._stepMissile(t, e);
	}
	_stepMissile(e, t) {
		let n = this.sys, r = n.tileMap, i = e.spec;
		e.age += t;
		let a = e.target;
		if (i.turn > 0 && a && a.alive && !a.dormant && a.sprite.visible) {
			let r = a.position.x - e.x, o = a.position.z - e.z, s = Math.hypot(r, o);
			if (s > .05) {
				let c = Math.atan2(e.dz, e.dx), l = Math.atan2(o, r) - c;
				for (; l > Math.PI;) l -= Math.PI * 2;
				for (; l < -Math.PI;) l += Math.PI * 2;
				let u = i.turn * t, d = c + Math.max(-u, Math.min(u, l));
				e.dx = Math.cos(d), e.dz = Math.sin(d);
				let f = a.def.body;
				e.vy = lr(e.y, n.bodyBase(a) + (f[0] + f[1]) / 2, i.speed, s);
			}
		}
		let o = i.speed * t;
		for (; o > 1e-6;) {
			let t = Math.min(.25, o);
			if (o -= t, e.x += e.dx * t, e.z += e.dz * t, e.y += e.vy * (t / i.speed), e.traveled += t, e.x < 0 || e.z < 0 || e.x > r.width || e.z > r.depth) {
				this._endMissile(e, !1);
				return;
			}
			let n = this._missileContact(e, i.radius);
			if (n) {
				this._missileHit(e, n);
				return;
			}
			if (r.getHeight(e.x, e.z) > e.y - .1 || this._inCollider(e.x, e.z)) {
				this._endMissile(e, !0);
				return;
			}
			if (e.traveled >= i.range) {
				this._endMissile(e, !1);
				return;
			}
		}
		e.trail += t, e.trail >= .05 && (e.trail = 0, i.id === "holyBolt" ? this._holy?.trail(e) : n.burst("partyFrostTrail", e.x, e.y, e.z, 1));
	}
	_missileContact(e, t) {
		let n = this.sys, r = n.enemies;
		for (let i = 0; i < r.length; i++) {
			let a = r[i];
			if (!a.alive || a.dormant || !a.sprite.visible) continue;
			let o = a.position.x - e.x, s = a.position.z - e.z, c = t + a.radius;
			if (o * o + s * s >= c * c) continue;
			let l = n.bodyBase(a), u = a.def.body;
			if (!(e.y + t < l + u[0] || e.y - t > l + u[1])) return a;
		}
		return null;
	}
	_inCollider(e, t) {
		let n = this.sys.tileMap.queryColliders(e - .01, t - .01, e + .01, t + .01, this._cols);
		for (let r = 0; r < n.length; r++) {
			let i = n[r];
			if (!i.dynamic) {
				if (i.type === "circle") {
					let n = e - i.x, r = t - i.z;
					if (n * n + r * r < i.r * i.r) return !0;
				} else if (e > i.minX && e < i.maxX && t > i.minZ && t < i.maxZ) return !0;
			}
		}
		return !1;
	}
	_missileHit(e, t) {
		let n = e.spec, r = this.sys, i = this._baseSpec(n.mv, n.kb, n.poise);
		i.shape = "circle", i.x = e.x, i.z = e.z, i.y = t.position.y, i.r = n.radius + .02, i.tag = e.tag, i.fromX = e.x - e.dx, i.fromZ = e.z - e.dz, n.chill > 0 && !t.boss && t.statusInfo().chill <= (n.refresh ?? 0) && (i.chill = n.chill, i.slow = n.slow), r.addAllyHit(this, i, "projectile"), n.splash && (i.r = n.splash.r, i.mv = n.splash.mv, i.kb = .4, i.poise = 0, r.addAllyHit(this, i, "projectile")), this._endMissile(e, !0);
	}
	_endMissile(e, t) {
		let n = this.sys, r = e.spec.id === "holyBolt";
		if (e.fx && this._fx.kill(e.fx), e.fx = null, e.on = !1, e.target = null, e.y, !r) {
			this._ice?.lanceEnd(e, t), t && n.sfxAt("iceSpike", e.x, e.z, {
				volume: .45,
				pitch: 1.4
			});
			return;
		}
		this._holy?.boltEnd(e, t), t && n.sfxAt("boltHit", e.x, e.z, {
			volume: .55,
			pitch: 1.35
		});
	}
	_openField(e, t, n) {
		let r = this._fields.find((e) => !e.on);
		if (!r) {
			r = this._fields[0];
			for (let e of this._fields) e.t > r.t && (r = e);
			this._closeField(r);
		}
		let i = this.sys;
		r.on = !0, r.kind = e, r.x = t, r.z = n, r.y = i.groundAt(t, n), r.t = 0, r.n = 0, r.next = 0, r.a = this.rng.next() * Math.PI * 2, r.tag = i.tags.next(), r.fx.length = 0, this._openFx(r);
	}
	_closeField(e) {
		this._holy?.closed(e), this._earth?.closed(e);
		for (let t of e.fx) this._fx.kill(t);
		e.fx.length = 0, e.on = !1;
	}
	_stepFields(e) {
		for (let t of this._fields) if (t.on) switch (t.t += e, t.kind) {
			case "judgement":
				this._stepJudgement(t);
				break;
			case "sanctuary":
				this._stepSanctuary(t);
				break;
			case "blizzard":
				this._stepBlizzard(t);
				break;
			case "glacialTomb":
				this._stepTomb(t);
				break;
			case "earthshatter":
				this._stepQuake(t);
				break;
			default: this._closeField(t);
		}
	}
	_openFx(e) {
		let t = this.kit;
		switch (e.kind) {
			case "judgement":
				this._holy?.open(e);
				break;
			case "sanctuary": {
				let n = t.skill2;
				this._holy?.open(e), this.sys.sfxAt("sanctuary", e.x, e.z, { volume: .8 }), this.sys.ward(n.ward, n.wardFor);
				break;
			}
			case "blizzard":
				this._ice?.open(e), this.sys.sfxAt("blizzard", e.x, e.z, { volume: .85 });
				break;
			case "glacialTomb":
				this._ice?.open(e), this.sys.sfxAt("freeze", e.x, e.z, {
					volume: .55,
					pitch: .8
				});
				break;
			case "earthshatter": {
				let n = t.skill2;
				e.next = n.spikes.delay, this._quakeSlam(e, n);
				break;
			}
		}
	}
	_stepJudgement(e) {
		let t = this.kit.skill, n = this.sys;
		for (; e.n < t.pillars && e.t >= t.delay + e.n * t.every - 1e-6;) {
			let r = e.a + e.n * Math.PI * 2 / t.pillars, i = e.x + Math.cos(r) * t.ring, a = e.z + Math.sin(r) * t.ring, o = n.groundAt(i, a);
			this._areaHit(i, o, a, t.pillarR, t.pillarMv, t.pillarKb, t.pillarPoise, n.tags.next(), e.x, e.z), this._holy?.pillar(e, e.n, i, o, a), e.n % 2 == 0 && n.sfxAt("holyPillar", i, a, {
				volume: .45,
				pitch: 1.1 + e.n * .04
			}), e.n++;
		}
		let r = t.delay + t.pillars * t.every + t.final.delay;
		if (e.n === t.pillars && e.t >= r - 1e-6) {
			e.n++;
			let r = t.final;
			this._areaHit(e.x, e.y, e.z, r.r, r.mv, r.kb, r.poise, n.tags.next(), e.x, e.z, { stop: r.stop }), this._holy?.payoff(e), n.sfxAt("holyPillar", e.x, e.z, {
				volume: .9,
				pitch: .85
			}), n.shake(.16, .25);
		}
		e.t >= r + .6 && this._closeField(e);
	}
	_stepSanctuary(e) {
		let t = this.kit.skill2, n = this.sys, r = t.duration / t.ticks;
		for (; e.n < t.ticks && e.t >= (e.n + .5) * r - 1e-6;) {
			e.n++;
			let r = 0, i = n.pc, a = n.player.position;
			if (i.alive && Math.hypot(a.x - e.x, a.z - e.z) <= t.r + i.radius) {
				let o = i.heal(Math.round((i.hpMax * t.frac + t.flat) / t.ticks));
				o > 0 && n.events.emit("allyHeal", this.id, "player", o), r += o, this._holy?.healed(e, a, o);
			}
			for (let i of n.allies) {
				if (!i.present) continue;
				let a = i.position;
				if (Math.hypot(a.x - e.x, a.z - e.z) > t.r + $.radius) continue;
				let o = i.heal(Math.round((i.hpMax * t.frac + t.flat) / t.ticks));
				o > 0 && n.events.emit("allyHeal", this.id, i.id, o), r += o, this._holy?.healed(e, a, o);
			}
			this._holy?.tick(e), this.counts.healed += r;
		}
		e.t >= t.duration + .4 && this._closeField(e);
	}
	_stepBlizzard(e) {
		let t = this.kit.skill, n = this.sys;
		for (; e.t >= e.next - 1e-6 && e.next < t.duration;) this._areaHit(e.x, e.y, e.z, t.r, t.mv, t.kb, t.poise, n.tags.next(), e.x, e.z, {
			chill: t.chill,
			slow: t.slow
		}), e.next += t.every, e.n++;
		e.t >= t.duration + .4 && this._closeField(e);
	}
	_stepTomb(e) {
		let t = this.kit.skill2, n = this.sys;
		e.n === 0 && e.t >= t.delay - 1e-6 && (e.n = 1, this._areaHit(e.x, e.y, e.z, t.r, t.mv, t.kb, t.poise, e.tag, e.x, e.z, {
			freeze: t.freeze,
			stop: t.stop
		}), n.sfxAt("iceSpike", e.x, e.z, { volume: .95 }), n.sfxAt("freeze", e.x, e.z, { volume: .7 }), n.shake(.18, .25)), e.n === 1 && e.t >= t.delay + t.hold - 1e-6 && (e.n = 2, n.sfxAt("iceShard", e.x, e.z, {
			volume: .7,
			pitch: .7
		})), e.t >= t.delay + t.hold + .4 && this._closeField(e);
	}
	_quakeSlam(e, t) {
		let n = this.sys, r = this.member.position;
		this._areaHit(e.x, e.y, e.z, t.r, t.mv, t.kb, t.poise, e.tag, r.x, r.z, {
			knockdown: t.knockdown,
			stop: t.stop
		}), this._earth?.slam(e, t), n.sfxAt("earthshatter", e.x, e.z, { volume: 1 }), n.shake(.32, .35);
	}
	_stepQuake(e) {
		let t = this.kit.skill2.spikes, n = this.sys;
		e.n === 0 && e.t >= e.next - 1e-6 && (e.n = 1, this._areaHit(e.x, e.y, e.z, t.r, t.mv, t.kb, t.poise, n.tags.next(), e.x, e.z, { rInner: t.rInner }), this._earth?.erupt(e, t), n.sfxAt("crash", e.x, e.z, {
			volume: .7,
			pitch: .8
		})), e.t >= 2.2 && this._closeField(e);
	}
	_bulwark(e) {
		let t = this.sys, n = this.member.position;
		t.taunt(this, n.x, n.z, e.r, e.taunt), t.ward(e.ward, e.wardFor);
		let r = t.player.position, i = (n.x + r.x) / 2, a = (n.z + r.z) / 2;
		this._earth?.bulwark(e, i, a), t.sfxAt("taunt", n.x, n.z, { volume: 1 }), t.sfxAt("ward", i, a, { volume: .7 }), t.shake(.14, .3);
	}
	_areaHit(e, t, n, r, i, a, o, s, c, l, u) {
		let d = this._baseSpec(i, a, o);
		d.shape = u?.rInner ? "ring" : "circle", d.x = e, d.y = t, d.z = n, d.r = r, d.rInner = u?.rInner ?? 0, d.dy = Xm, d.tag = s, d.fromX = c, d.fromZ = l, u && (u.chill && (d.chill = u.chill, d.slow = u.slow ?? 0), u.freeze && (d.freeze = u.freeze), u.knockdown && (d.knockdown = !0), u.stop && (d.feel = { stop: u.stop })), this.sys.addAllyHit(this, d, "skill");
	}
	_stepHero(e) {
		this._stepMissiles(e), this._stepFields(e), this._fx.step(e), this._ice?.step(e), this._holy?.step(e), this._earth?.step(e);
	}
	_clearHero() {
		for (let e of this._missiles) e.on = !1, e.target = null, e.fx = null;
		for (let e of this._fields) e.fx.length = 0, e.on = !1;
		this._fx.clear(), this._ice?.clear(), this._holy?.clear(), this._earth?.clear(), this.skill2Cd = 0, this.reviveCd = 0, this.gapCd = 0, this._downT = 0, this._next = null, this._reviveWho = null, this.casts = {};
	}
	_writeHeroFx(e) {
		this._ice?.visuals(e), this._holy?.visuals(e), this._earth?.visuals(e);
		for (let e of this._missiles) {
			let t = e.fx;
			e.on && t && (t.x = e.x, t.y = e.y, t.z = e.z, t.dirX = e.dx, t.dirZ = e.dz);
		}
		let t = this.sys.fx;
		this._fx.write(t ? t.viewX : 0, t ? t.viewZ : -1);
	}
};
function Km() {
	return {
		on: !1,
		spec: null,
		x: 0,
		y: 0,
		z: 0,
		dx: 0,
		dz: 1,
		vy: 0,
		traveled: 0,
		age: 0,
		trail: 0,
		target: null,
		tag: 0,
		fx: null
	};
}
function qm() {
	return {
		on: !1,
		kind: "",
		x: 0,
		y: 0,
		z: 0,
		t: 0,
		n: 0,
		next: 0,
		m: -1,
		a: 0,
		tag: 0,
		fx: []
	};
}
var Jm = class {
	constructor(e, { halo: t = 0 } = {}) {
		this.sys = e, this.halo = t, this.live = [], this.pool = [], this._p = {
			x: 0,
			y: 0,
			z: 0,
			frame: "",
			index: 0,
			scale: 1,
			rot: 0,
			mode: "billboard",
			dirX: 0,
			dirZ: 1,
			r: 1,
			g: 1,
			b: 1,
			a: 1,
			flipX: !1,
			soft: 0,
			halo: 0
		};
	}
	get count() {
		return this.live.length;
	}
	add(e) {
		let t = this.sys.quads, n = t ? t.alloc() : -1;
		if (n < 0) return null;
		let r = this.sys.atlasFrames?.[e.frame], i = this.pool.pop() ?? {};
		i.h = n, i.frame = e.frame, i.mode = e.mode, i.x = e.x, i.y = e.y, i.z = e.z, i.dirX = e.dirX ?? 0, i.dirZ = e.dirZ ?? 1;
		let a = (r?.w ?? 16) / 16;
		return i.s0 = e.size == null ? e.scale ?? 1 : e.size / a, i.s1 = e.sizeTo == null ? e.scaleTo ?? i.s0 : e.sizeTo / a, i.grow = e.grow ?? 0, i.rot = e.rot ?? 0, i.spin = e.spin ?? 0, i.color = e.color, i.life = e.life, i.fadeIn = e.fadeIn ?? 0, i.fadeOut = e.fadeOut ?? 0, i.n = Math.max(1, r?.n ?? 1), i.fps = e.fps ?? r?.fps ?? 0, i.loop = !!e.loop, i.frames = e.frames ?? null, i.follow = e.follow ?? null, i.followY = i.follow ? e.y - i.follow.y : 0, i.back = e.back ?? 0, i.lift = e.foot != null && r ? (r.h / 2 - e.foot) / 16 : 0, i.alpha = e.alpha ?? 1, i.soft = e.soft ?? 0, i.halo = e.halo ?? this.halo, i.t = 0, this.live.push(i), i;
	}
	kill(e) {
		if (!e) return;
		let t = this.live.indexOf(e);
		t >= 0 && this._killAt(t);
	}
	_killAt(e) {
		let t = this.live[e];
		this.sys.quads?.free(t.h), t.h = -1, t.follow = null, this.live[e] = this.live[this.live.length - 1], this.live.pop(), this.pool.push(t);
	}
	step(e) {
		for (let t = this.live.length - 1; t >= 0; t--) {
			let n = this.live[t];
			n.t += e, n.t >= n.life && this._killAt(t);
		}
	}
	write(e, t, n = 1) {
		let r = this.sys.quads;
		if (!r) return;
		let i = this._p;
		for (let a = 0; a < this.live.length; a++) {
			let o = this.live[a], s = o.t;
			o.follow && (o.x = o.follow.x, o.y = o.follow.y + o.followY, o.z = o.follow.z), i.x = o.x + e * o.back, i.y = o.y, i.z = o.z + t * o.back, i.frame = o.frame;
			let c;
			o.frames ? c = o.frames[Math.min(o.frames.length - 1, Math.floor(s / o.life * o.frames.length))] : o.fps > 0 ? (c = Math.floor(s * o.fps + 1e-6), c = o.loop ? c % o.n : Math.min(o.n - 1, c)) : c = o.n > 1 ? Math.min(o.n - 1, Math.floor(s / o.life * o.n)) : 0, i.index = c;
			let l = o.grow > 0 ? Math.min(1, s / o.grow) : 1;
			i.scale = o.s0 + (o.s1 - o.s0) * (1 - (1 - l) * (1 - l)), i.y += o.lift * i.scale, i.rot = o.rot + o.spin * s, i.mode = o.mode, i.dirX = o.dirX, i.dirZ = o.dirZ, i.r = o.color[0] * n, i.g = o.color[1] * n, i.b = o.color[2] * n;
			let u = 1;
			o.fadeIn > 0 && (u = Math.min(u, s / o.fadeIn)), o.fadeOut > 0 && (u = Math.min(u, (o.life - s) / o.fadeOut)), i.a = Math.max(0, Math.min(1, u)) * o.alpha, i.soft = o.soft, i.halo = o.halo, r.set(o.h, i);
		}
	}
	clear() {
		for (let e = this.live.length - 1; e >= 0; e--) this._killAt(e);
	}
}, Ym = .3, Xm = 1.1, Zm = .5, Qm = .6, $m = [
	[1, 0],
	[-1, 0],
	[1, .6],
	[-1, .6]
], eh = 16, th = Object.freeze({
	lateral: .9,
	depth: 2.4,
	step: 1.8
}), nh = Object.freeze({
	lateral: .8,
	near: -.1,
	depth: 2.2,
	ahead: .5
}), rh = 2.2, ih = Object.freeze({
	ahead: 1.6,
	margin: .15,
	turn: 1.5
}), ah = .85, oh = .95, sh = 2, ch = .12, lh = Math.cos(35 * Math.PI / 180), uh = 1, dh = 1e9, fh = 6, ph = 18, mh = [
	0,
	Math.PI / 6,
	-Math.PI / 6,
	Math.PI / 3,
	-Math.PI / 3
];
function hh() {
	return {
		attacks: 0,
		hits: 0,
		crits: 0,
		skills: 0,
		heals: 0,
		healed: 0,
		rolls: 0,
		hurts: 0,
		damageDealt: 0,
		damageTaken: 0,
		downs: 0
	};
}
function gh(e) {
	switch (e) {
		case "a1":
		case "a2": return "attack";
		case "sweep": return "skill1";
		case "shot":
		case "volley":
		case "bolt":
		case "flare": return "skill2";
		case "roll": return "roll";
		case "hurt": return "hitstun";
		case "knock": return "knockdown";
		case "mend": return "draught";
		default: return null;
	}
}
//#endregion
//#region src/game/party/mayFight.js
function _h(e, t, n, r) {
	if (Array.isArray(r) && r.some((t) => t?.cls === e)) return !0;
	let i = yh(e), a = (e) => Array.isArray(e) && e.some((e) => typeof e == "string" && i.test(e));
	for (let n of Array.isArray(t?.objects) ? t.objects : []) if (n?.type === "npc") {
		let t = n.spec && typeof n.spec == "object" ? n.spec : null, r = typeof n.preset == "string" && be(Ce, n.preset) ? Ce[n.preset] : null;
		if (Ie(t?.weapon ?? r?.weapon ?? null) === e || a(n.talk)) return !0;
	} else if (n?.type === "event" && a(n.run)) return !0;
	for (let e of Object.values(n?.scripts ?? {})) if (a(e?.lines)) return !0;
	return !1;
}
var vh = /* @__PURE__ */ new Map();
function yh(e) {
	let t = vh.get(e);
	return t || (t = new RegExp(String.raw`^\s*(?:\*\s+)?party\s+join\s+.*\bas\s+${e.replace(/[^A-Za-z0-9_-]/g, "")}\b`, "i"), vh.set(e, t)), t;
}
//#endregion
//#region src/game/combat/CombatSystem.js
var bh = 1 / 60, xh = Object.freeze({
	melee: 3,
	ranged: 2
}), Sh = 32, Ch = .25, wh = 32, Th = 8, Eh = 20, Dh = 16, Oh = 20, kh = 4, Ah = w(120), jh = .25, Mh = .3, Nh = 5, Ph = .9, Fh = w(108), Ih = .08, Lh = w(90), Rh = 6, zh = 5, Bh = 12, Vh = 48, Hh = 240, Uh = 1, Wh = .45, Gh = .4, Kh = Object.freeze({ scale: .8 }), qh = Object.freeze({ scale: .55 }), Jh = 2, Yh = Object.freeze({
	CombatHUD: pe,
	BossBar: ae,
	WorldLabels: le,
	Announcer: me,
	DeathScreen: fe
}), Xh = "ally", Zh = .55, Qh = Object.freeze({
	melee: Object.freeze({
		source: "melee",
		stop: 0,
		finisher: !1,
		combo: 0
	}),
	skill: Object.freeze({
		source: "skill",
		stop: 0,
		finisher: !1,
		combo: 0
	}),
	projectile: Object.freeze({
		source: "projectile",
		stop: 0,
		finisher: !1,
		combo: 0
	})
}), $h = 512, eg = Object.freeze({
	quiet: .45,
	most: 1.6
}), tg = 6, ng = 2, rg = 8, ig = Object.freeze({
	colors: ["#ffe9a8", "#fff6d8"],
	hdr: 2.2
}), ag = 3, og = [.6, 1.5], sg = Sh, cg = .6, lg = {
	shape: "circle",
	x: 0,
	y: .03,
	z: 0,
	r: 1,
	rInner: 0,
	dirX: 0,
	dirZ: 1,
	halfAngle: 60,
	len: 1,
	width: 1,
	w: 1,
	d: 1,
	progress: 0,
	style: "enemy",
	alpha: 1,
	flash: 0
}, ug = Object.keys(lg), dg = /* @__PURE__ */ new Map(), fg = new s(), pg = new a(), mg = new t(), hg = new f(), gg = new n();
function _g(e) {
	let t = e.adds;
	if (!e.boss || !t) return [];
	if (!Array.isArray(t)) return [{
		kind: t,
		count: Rh,
		level: zh
	}];
	let n = [], r = 0;
	for (let e of t) {
		let t = e?.kind, i = _(Math.round(e?.count ?? Rh) || 0, 0, Bh - r);
		be(lp, t) && !lp[t].boss && i > 0 && (n.push({
			kind: t,
			count: i,
			level: _(Math.round(e.level ?? zh) || zh, 1, 10)
		}), r += i);
	}
	return n;
}
function vg(e) {
	let t = [], n = 0;
	for (let r of e) r.type === "skyDragon" && (t.length < ng ? t.push(r) : n++);
	return {
		kept: t,
		left: n
	};
}
var yg = class {
	constructor({ game: e }) {
		this.game = e, this.engine = e.engine, this.scene = e.engine.scene, this.tileMap = e.tileMap, this.level = e.level, this.world = e.world, this.player = e.player, this.rig = e.rig, this.ui = e.ui, this.audio = e.audio, this.particles = e.particles, this.lighting = e.lighting, this.spriteManager = e.spriteManager, this.postfx = e.postfx, this.input = e.engine.input, this.env = e.env ?? e.level.environment ?? {}, this.events = new ue(), this.enemies = [], this.actorSprites = [], this.engaged = !1, this.locksPlayer = !1, this.bossDefeated = !1, this.minimapEnemies = [], this._mmPool = [], this.tutorial = {
			combo: !1,
			dodge: !1,
			rewarded: !1
		}, this.purchased = /* @__PURE__ */ new Set(), this.seedValue = v(this.level.name) >>> 0, this.rng = new y(this.seedValue), this.stop = 0, this.playerScale = 1, this.enemyScale = 1, this._slow = 0, this.clock = 0, this.enemyTime = 0, this.frame = 0, this.stepNo = 1, this._advanced = 0, this._wasActive = !1, this.kills = 0, this.god = !1, this.freezeAI = !1, this.aimOverride = null, this._tokens = {
			melee: 0,
			ranged: 0
		}, this._engageLinger = 0, this._calm = 0, this._heartbeat = 0, this._checkT = 0, this._deathT = -1, this._introT = 0, this._respawning = !1, this._timers = [], this._stopVictims = [], this.legendExtra = [], this.legendSkip = [], this._groupOf = /* @__PURE__ */ new Map(), this._addsOf = /* @__PURE__ */ new Map(), this._hidden = /* @__PURE__ */ new Set(), this._members = /* @__PURE__ */ new Map(), this._absent = /* @__PURE__ */ new Set(), this._absentGroups = /* @__PURE__ */ new Set(), this._ownPools = [], this._boss = null, this._bossFight = null, this._bossAwake = !1, this._kneel = null, this._fightStart = 0, this._phaseStart = [
			0,
			0,
			0
		], this._phaseTimes = [
			0,
			0,
			0
		], this._bossMarkers = [], this.programsAtLoad = 0, this._programWarned = !1, this._ticks = new Float32Array(Hh), this._tickN = 0, this._tickT = 0, this._deathGen = 0, this._levelAfterResults = null, this._bossKillXp = !1, this.allies = [], this.ice = null, this.holy = null, this.earth = null, this.sword = null, this.bell = null, this.kitModule = null, this.looks = [], this.allyGod = !1, this.allySearches = 0, this.skyDragons = [], this.respawn = this.env.respawn !== !1, this.setpiece = !1, this._ambient = !1, this.ambientFrame = !1, this._bosses = [], this._introPending = [], this._swarmPending = [], this._awakePending = null, this._closePending = null, this._pullPending = null, this._wards = [], this.marksLook = {
			frame: "partyWardRing",
			color: [
				1.25,
				.85,
				.3
			],
			scale: .3,
			lift: .45,
			spacing: .42
		}, this.ev = null, this._releaseAsk = [], this._warmth = [], this.systems = [], this._ambientCheckT = 0, this._crowd = [], this._goldFeed = 0, this._goldFeedT = 0, this._goldFeedAge = 0, this._focus = {
			x: 0,
			z: 0
		}, this._ready = !1;
	}
	get loaded() {
		return this._ready;
	}
	addAlly(e) {
		if (!e || !this._ready) return null;
		let t = this.allies.find((t) => t.member === e);
		if (t) return e.combat = t, t;
		let n = new Gm(this, e);
		this.allies.push(n), e.combat = n;
		try {
			let t = e.sprite?.sheet?.texture;
			t && this.engine.renderer.initTexture(t);
		} catch {}
		return n;
	}
	removeAlly(e) {
		if (!e) return;
		let t = this.allies.findIndex((t) => t.member === e);
		if (t < 0) {
			e.combat && !this.allies.includes(e.combat) && (e.combat = null);
			return;
		}
		let n = this.allies[t];
		this.allies.splice(t, 1);
		for (let e of this.enemies) e.target === n && (e.target = null, e.tauntT = 0);
		this.projectiles?.removeOwner(n), n.release(), e.combat = null;
	}
	healAllies() {
		for (let e of this.allies) e.refill();
		return this.allies.length;
	}
	get bossFight() {
		return this._bossFight;
	}
	sealedArena() {
		for (let e = 0; e < this.arenas.length; e++) if (this.arenas[e].active) return this.arenas[e];
		return null;
	}
	fightOn() {
		if (!this.engaged) return !1;
		if (this._bossFight || this.stop > 0 || this._slow > 0) return !0;
		let e = this.enemies;
		for (let t = 0; t < e.length; t++) {
			let n = e[t];
			if (n.alive && n.aggro && !n.passive && !n.dormant && n.sprite.visible) return !0;
		}
		return !1;
	}
	isTargeted(e) {
		let t = this.enemies;
		for (let n = 0; n < t.length; n++) if (t[n].target === e && t[n].alive) return !0;
		return !1;
	}
	targetedBy(e) {
		let t = 0;
		for (let n of this.enemies) n.target === e && n.alive && t++;
		return t;
	}
	async load() {
		let e = performance.now(), { scene: t, tileMap: n, level: r } = this, i = Im(r);
		i.length && await Um(i, Wm), _t();
		let a = r.objects.filter((e) => e.type === "enemy"), o = new Set(a.map((e) => e.kind));
		this.setpiece = r.objects.some((e) => e.type === "skyDragon") || a.some((e) => be(Ee, e.kind) && !!Ee[e.kind].setpiece || e.swarm === !0 || Array.isArray(e.besiege));
		for (let e of [...o]) {
			let t = be(lp, e) ? _g(lp[e]) : [];
			for (let e of t) o.add(e.kind);
		}
		this.sheets = /* @__PURE__ */ new Map();
		for (let e of o) try {
			this.sheets.set(e, re(e));
		} catch (t) {
			console.warn(`[combat] no sheet for "${e}":`, t);
		}
		this.game?.playerKit === "bellwarden" && (await import("./BellwardenFx-DW7uWxe-.js")).registerBellFrames(Wm), this.atlas = oe(), this.atlasFrames = this.atlas.frames, this.quads = new se({
			atlas: this.atlas,
			capacity: $h
		}), t.add(this.quads.object);
		for (let e of Vm(i)) ce(e.ids, e.glsl);
		this.markers = new de({
			capacity: Vh,
			heightField: {
				sample: (e, t) => n.getHeight(e, t),
				minX: 0,
				minZ: 0,
				maxX: n.width,
				maxZ: n.depth
			}
		}), t.add(this.markers.object), this._mk = [];
		for (let e = 0; e < Vh; e++) this._mk.push({
			h: -1,
			owner: null,
			gen: 0,
			spec: { ...lg }
		});
		this._markerSpec = { ...lg }, this.fx = new pm(this.quads, this.atlas), this.tags = new Wd(), this.playerHits = new Ud(16), this.enemyHits = new Ud(32), this.allyHits = new Ud(8), this._contacts = [], this._contactN = 0, this.projectiles = new sr(this), this.pickups = new Xp(this), this.cin = new hp(this.input), this.look = new xp(this.postfx), this.music = new xm(this.audio, () => this.game.envNow ?? this.env), this._pv = {
			position: this.player.position,
			radius: .3,
			body: [0, 1.8],
			facing: {
				x: 0,
				z: 1
			},
			velocity: {
				x: 0,
				z: 0
			},
			alive: !0,
			invulnerable: !1,
			dodging: !1,
			action: null,
			swing: 0,
			sealed: !1
		}, this._prevPos = new s().copy(this.player.position), this.ctx = this._makeContext();
		let c = this.game, l = c?.campaign?.story, u = c?.party?.records ?? c?.story?.state?.party, d = c?.playerKit === "bellwarden", [f, p, m, h, g, _] = await Promise.all([
			_h("icemage", r, l, u) ? import("./IceSpellFx-BINq7pZ8.js") : null,
			_h("cleric", r, l, u) ? import("./HolySpellFx-DnWRCe08.js") : null,
			_h("greatshield", r, l, u) ? import("./EarthSpellFx-DauMIKdl.js") : null,
			c?.playerKit === "swordmaster" ? import("./SwordmasterFx-CH_KgvvC.js") : null,
			d ? import("./BellwardenFx-DW7uWxe-.js") : null,
			d ? import("./bellwarden-DAbz8hPe.js") : null
		]);
		f && (this.ice = new f.IceStage(this)), p && (this.holy = new p.HolyStage(this)), m && (this.earth = new m.EarthStage(this)), h && (this.sword = new h.SwordStage(this)), g && (this.bell = new g.BellStage(this)), this.kitModule = _, this.looks = [
			this.ice,
			this.holy,
			this.earth,
			this.sword,
			this.bell
		].filter((e) => e !== null), this._ndc = {
			x: 0,
			y: 0,
			on: !1
		}, this._vpe = /* @__PURE__ */ new Float32Array(16), this._cacheViewProjection(), De("combat", Pm), this._shownNames = /* @__PURE__ */ new WeakMap(), he.useCombatUI(Yh), this.ui.enableCombat(), this._savedBindings = this.input.saveBindings(), this.input.addBindings(pp), this.input.enableMouseButtons?.(this.engine.renderer.domElement), this.zones = r.objects.filter((e) => e.type === "region" && [
			"minX",
			"maxX",
			"minZ",
			"maxZ"
		].every((t) => Number.isFinite(e[t]))).map((e) => ({
			id: e.id,
			minX: e.minX,
			maxX: e.maxX,
			minZ: e.minZ,
			maxZ: e.maxZ,
			minY: Number.isFinite(e.minY) ? e.minY : null
		})), this.arenas = [];
		for (let e of a) this._spawnGroup(e);
		this._bosses = this.enemies.filter((e) => e.boss);
		for (let e of this._bosses) this._createAdds(e);
		this._armSetPieces();
		let ee = performance.now();
		this.nav = new Fe(n, { blocked: (e, t) => this._inArena(e, t) }), this.nav.buildMs = Math.round((performance.now() - ee) * 10) / 10, this.nav.warm(), this.ctx.nav = this.nav, this.pc = new kp(this), this.targeting = new Lp(this), this.waystones = new im(this), this.chests = new am(this), this.waystones.bind(this.world.interactables), this.chests.bind(this.world.interactables), this._storyGroups = [...this._members.keys()].filter((e) => je(e)), this._storyChests = this.chests.list.filter((e) => je(e.obj)), this._storyStones = this.waystones.list.filter((e) => e.obj && je(e.obj));
		let te = vg(r.objects);
		te.left && console.warn(`[combat] ${te.left} sky dragon(s) beyond the first ${ng} are left out`);
		for (let e of te.kept) this.skyDragons.push(new mu({
			sys: this,
			obj: e,
			seed: v(typeof e.id == "string" ? e.id : "") >>> 0
		}));
		this._emitters = this.arenas.map((e) => {
			let t = e.rect, n = e.emitter;
			if (!n) return null;
			let r = {
				center: new s(e.center.x, e.y + 1.6, e.center.z),
				size: new s(t.maxX - t.minX, 3.2, t.maxZ - t.minZ)
			};
			return typeof n == "string" ? this.particles.createEmitter({
				preset: n,
				bounds: r,
				count: 90,
				enabled: !1
			}) : this.particles.createEmitter({
				count: 90,
				...n,
				preset: n.preset,
				bounds: r,
				enabled: !1
			});
		});
		for (let e of Hm(i)) {
			let t = e(this);
			t && this.systems.push(t);
		}
		this.hooks = jm(this), this.loadMs = Math.round(performance.now() - e), this._ready = !0;
	}
	_armSetPieces() {
		this._introPending.length = 0, this._swarmPending.length = 0;
		for (let e of this._bosses) e.def.introOnSpawn && this._introPending.push(e);
		for (let e of this._members.keys()) e.swarm === !0 && this._swarmPending.push(e);
	}
	_spawnGroup(e) {
		let t = e.kind, n = this.sheets.get(t);
		if (!n) return;
		let r = fp(t, e.level ?? 1, !!e.elite), i = this.tileMap, a = r.flier ? (e, t) => i.isWalkable(e, t) || i.getWaterSurface(e, t) !== null : (e, t) => this.standable(e, t), o = Te(e, a), s = r.boss ? new cm(e, this, r.arena ?? null) : null;
		s && this.arenas.push(s), o.forEach(([i, a], o) => {
			let c = this._createEnemy({
				uid: `${e.id}#${o}`,
				group: e,
				index: o,
				kind: t,
				level: r.level,
				elite: !!e.elite,
				name: e.name || (e.elite ? `Elite ${r.name}` : r.name),
				home: {
					x: i,
					z: a
				},
				def: r,
				sheet: n,
				arena: s,
				isAdd: !1
			});
			c.boss && (this._boss ??= c);
		});
	}
	_createEnemy(e) {
		let t = new ve(e.sheet, {
			...Me,
			...e.sheet.spriteOptions,
			combatFx: !0
		});
		t.position.set(e.home.x, this.groundAt(e.home.x, e.home.z), e.home.z);
		let n = ap({
			...e,
			sprite: t,
			rng: new y((v(e.uid) ^ this.seedValue) >>> 0),
			tagSlot: this.enemies.length + 1
		});
		if (!e.isAdd && !n.boss && e.group && !n.swarm) {
			let t = Number(e.group.x), r = Number(e.group.z);
			if (n.zone = this.zoneAt(t, r, this.groundAt(t, r)), n.zone >= 0) {
				let e = this.zones[n.zone], i = n.homeRadius;
				n.zoneRect = {
					minX: Math.min(e.minX, t - i),
					maxX: Math.max(e.maxX, t + i),
					minZ: Math.min(e.minZ, r - i),
					maxZ: Math.max(e.maxZ, r + i)
				};
			}
		}
		if (this.scene.add(t), this.spriteManager.add(t), this.actorSprites.push(t), this.enemies.push(n), this._groupOf.set(n, e.group), !e.isAdd && e.group) {
			let t = e.group, r = this._members.get(t);
			r ? r.push(n) : this._members.set(t, [n]);
		}
		return n._barT = -Infinity, n;
	}
	_createAdds(e) {
		let t = _g(e.def);
		if (!t.length) return;
		let n = e.arena, r = [], i = 0;
		for (let a of t) {
			let t = this.sheets.get(a.kind);
			if (!t) continue;
			let o = fp(a.kind, a.level, !1);
			for (let s = 0; s < a.count; s++, i++) {
				let s = n ? {
					x: n.center.x,
					z: n.center.z
				} : {
					x: e.home.x,
					z: e.home.z
				}, c = this._createEnemy({
					uid: `${e.uid}:add#${i}`,
					group: this._groupOf.get(e),
					index: i,
					kind: a.kind,
					level: a.level,
					elite: !1,
					name: o.name,
					home: s,
					def: o,
					sheet: t,
					arena: null,
					isAdd: !0
				});
				c._boss = e, this._hideAdd(c), r.push(c);
			}
		}
		r.length && this._addsOf.set(e, r);
	}
	_hideAdd(e) {
		e.sleep(), e.aggro = !1, e.sprite.opacity = 0, e.sprite.visible = !1, this._hidden.add(e);
	}
	rebuildNav(e = null) {
		this.nav && (e ? this.nav.buildRect(e.minX, e.maxX, e.minZ, e.maxZ) : this.nav.build((e, t) => this._inArena(e, t)));
	}
	_inArena(e, t) {
		for (let n of this.arenas) if (n.present && n.containsGrown(e, t, .5)) return !0;
		return !1;
	}
	setupUI() {
		let e = this.ui.combat?.hud;
		this._showLegend();
		let t = this.pc.skills;
		e?.configureSkills([...t.map((e) => ({
			id: e.id,
			label: S(`combat.skill.${e.str}`),
			keys: e.keys,
			icon: e.icon,
			unlock: e.unlock
		})), {
			id: "draught",
			label: S("combat.skill.draught"),
			keys: "C/4",
			icon: "draught"
		}]), this._skillArgs = [
			0,
			1,
			2,
			3
		].map(() => ({
			cooldown: 0,
			seconds: 0,
			left: 0,
			locked: !1,
			affordable: !0
		})), e && (e.onSlotPress = (e) => this.cin.press(e < t.length ? t[e].id : "draught")), this._vitals = {
			hp: 0,
			hpMax: 0,
			mp: 0,
			mpMax: 0,
			sp: 0,
			spMax: 0,
			level: 1,
			xp: 0,
			xpNext: 1,
			winded: !1
		}, this._updateHud(0);
	}
	attachMaps(e) {
		this._map = e, e.enemies = this.minimapEnemies;
		for (let t = e.markers.length - 1; t >= 0; t--) e.markers[t].kind === "chest" && e.markers.splice(t, 1);
		this.chests.markers = e.markers;
		for (let t of this.chests.list) t.discovered && e.markers.push(t.marker);
		for (let t of this.arenas) {
			let n = {
				x: t.center.x,
				z: t.center.z,
				kind: "boss",
				arena: t
			};
			Object.defineProperty(n, "hidden", {
				get: () => !t.present,
				enumerable: !0
			}), this._bossMarkers.push(n), e.markers.push(n);
		}
	}
	warmup(e) {
		let t = this.engine.renderer, n = (e) => {
			try {
				e && t.initTexture(e);
			} catch {}
		};
		for (let e of this.sheets.values()) n(e.texture);
		n(this.player.sheet?.texture);
		for (let e of this.allies) n(e.member.sprite?.sheet?.texture);
		n(this.atlas.texture), n(this.markers.heightTexture), this._warmQuad = this.quads.alloc(), this._warmQuad >= 0 && this.quads.set(this._warmQuad, {
			x: e.x,
			y: e.y,
			z: e.z,
			frame: "impact",
			index: 0,
			scale: 1,
			rot: 0,
			mode: "billboard",
			dirX: 0,
			dirZ: 1,
			r: 1,
			g: 1,
			b: 1,
			a: 1
		}), this._warmMarker = this.markers.alloc(), this._warmMarker >= 0 && this.markers.set(this._warmMarker, {
			...lg,
			x: e.x,
			y: e.y,
			z: e.z,
			progress: .5
		}), this.quads.object.frustumCulled = !1, this.markers.object.frustumCulled = !1, this.quads.update(), this.markers.update();
		let r = new Set(this.particles.burstPools());
		for (let t of [
			"hitSpark",
			"emberBurst",
			"deathPoof",
			"gooPoof",
			"healGlow",
			"magicBurst",
			"sparkle",
			"splash",
			"footstep",
			"victoryEmbers",
			"victorySparkle",
			"levelSparkle"
		]) this.particles.burst(t, e, 1);
		for (let t of this.skyDragons) t.warmup(e);
		for (let t of this.looks) t.warmup(e);
		for (let t of this.systems) t.warmup?.(e);
		this._ownPools = this.particles.burstPools().filter((e) => !r.has(e));
	}
	endWarmup() {
		this._warmQuad >= 0 && this.quads.free(this._warmQuad), this._warmMarker >= 0 && this.markers.free(this._warmMarker), this._warmQuad = -1, this._warmMarker = -1;
		for (let e of this.looks) e.endWarmup();
		for (let e of this.systems) e.endWarmup?.();
		this.quads.update(), this.markers.update(), this.programsAtLoad = this.engine.renderer.info.programs?.length ?? 0;
	}
	_makeContext() {
		let e = this;
		return {
			time: 0,
			frame: 0,
			player: this._pv,
			tileMap: this.tileMap,
			moveGround: (t, n, r) => e._moveGround(t, n, r),
			moveFly: (t, n, r) => e._moveFly(t, n, r),
			groundAt: (t, n) => e.tileMap.getHeight(t, n),
			walkable: (t, n) => e.standable(t, n),
			los: (t, n, r, i) => e.los(t, n, r, i),
			onScreen: (t, n, r) => e.projectNdc(t, n, r, e._ndc, .92),
			requestToken: (t) => e._requestToken(t),
			releaseToken: (t) => e._releaseToken(t),
			hitbox: (t, n) => {
				e.enemyHits.add(t, n);
			},
			projectile: (t, n) => e.spawnProjectile(t, n),
			marker: (t) => e._markerAlloc(e._cur, t),
			setMarker: (t, n) => e._markerSet(t, n),
			freeMarker: (t) => e._markerFree(t),
			fx: (t, n, r, i, a) => e.fx.play(t, n, r, i, a),
			burst: (t, n, r, i, a, o) => e.burst(t, n, r, i, a, o),
			sfx: (t, n, r, i) => e.sfxAt(t, n, r, i),
			shake: (t, n) => e.shake(t, n),
			heal: (t, n) => e._healEnemy(t, n),
			alert: (t) => e.ui.combat?.labels.alert(t.position, e.labelY(t)),
			wakeGroup: (t) => e._wakeGroup(t),
			nav: null,
			enemiesNear: (t, n, r, i) => e._enemiesNear(t, n, r, i),
			spawnAdd: (t, n, r, i) => e._spawnAdd(e._cur, t, n, r, i),
			emit: (t, n, r, i) => e._onSignal(t, n, r, i),
			ambient: !1,
			release: (t) => e._askRelease(t),
			consumeMarks: (t) => e.consumeMarks(t),
			submerge: (t) => e.submerge(t),
			surface: (t, n, r) => e.surface(t, n, r),
			pulse: (t) => e.pulse(t),
			get bells() {
				return e.world?.bells ?? dg;
			},
			warmthZones: () => e.warmthZones(),
			setFlag: (t, n) => e.setFlag(t, n)
		};
	}
	groundAt(e, t) {
		return this.tileMap.getHeight(e, t);
	}
	zoneAt(e, t, n = null) {
		let r = this.zones;
		if (!r) return -1;
		for (let i = 0; i < r.length; i++) {
			let a = r[i];
			if (e >= a.minX && e < a.maxX && t >= a.minZ && t < a.maxZ && (a.minY == null || n == null || n > a.minY)) return i;
		}
		return -1;
	}
	standable(e, t) {
		let n = this.tileMap;
		if (!n.isWalkable(e, t)) return !1;
		let r = n.tileAt(Math.floor(e), Math.floor(t));
		return !(r && r.water) || n.getHeight(e, t) > (r.waterSurface ?? -Infinity);
	}
	bodyBase(e) {
		return e.position.y + (e.flier ? e.hover ?? 0 : 0);
	}
	labelY(e) {
		return e.def.labelY ?? 2;
	}
	numberY(e) {
		return e.boss ? this.bodyBase(e) + e.def.body[1] + .2 : e.position.y + this.labelY(e) + Gh + (e.elite ? .3 : 0);
	}
	_impactStar(e, t, n, r) {
		let i = e.position.x, a = e.position.z, o = this.bodyBase(e), s = e.def.body[1], c = i - n * .2, l = o + (s - 1) * .5, u = a - r * .2, d = this.engine.camera.matrixWorld.elements, f = d[0], p = d[2], m = -d[8], h = -d[10], g = Math.hypot(m, h) || 1;
		m /= g, h /= g;
		let _ = this.player.position, ee = i - _.x, v = a - _.z, te = ee * m + v * h, y = ee * f + v * p, ne = te > .3 && Math.abs(y) < 1.2;
		if (ne) {
			let e = y >= 0 ? 1 : -1;
			c = i + f * .6 * e, u = a + p * .6 * e, l = o + s + .4 - 1;
		}
		this.fx.play(t ? "crit" : "impact", c, l, u, ne ? Kh : void 0);
	}
	los(e, t, n, r) {
		let i = this.tileMap, a = i.getHeight(e, t) + kn, o = i.getHeight(n, r) + kn, s = n - e, c = r - t, l = Math.hypot(s, c);
		if (l < .3) return !0;
		let u = i.queryColliders(Math.min(e, n), Math.min(t, r), Math.max(e, n), Math.max(t, r), this._losCs ??= []);
		for (let n = .25; n < l - .2; n += .25) {
			let r = n / l, d = e + s * r, f = t + c * r, p = a + (o - a) * r;
			if (i.getHeight(d, f) > p - .1) return !1;
			for (let e = 0; e < u.length; e++) {
				let t = u[e];
				if (!t.dynamic) {
					if (t.type === "circle") {
						let e = d - t.x, n = f - t.z;
						if (e * e + n * n < t.r * t.r) return !1;
					} else if (d > t.minX && d < t.maxX && f > t.minZ && f < t.maxZ) return !1;
				}
			}
		}
		return !0;
	}
	_cacheViewProjection() {
		let e = this.engine.camera;
		pg.multiplyMatrices(e.projectionMatrix, e.matrixWorldInverse), this._vpe.set(pg.elements);
	}
	projectNdc(e, t, n, r, i = 1) {
		let a = this._vpe, o = a[3] * e + a[7] * t + a[11] * n + a[15];
		return o <= 1e-6 ? (r.x = r.y = 99, !1) : (r.x = (a[0] * e + a[4] * t + a[8] * n + a[12]) / o, r.y = (a[1] * e + a[5] * t + a[9] * n + a[13]) / o, Math.abs(r.x) <= i && Math.abs(r.y) <= i);
	}
	moveWorld(e) {
		let t = this.player.moveOverride, n, r;
		if (t) n = t.x, r = t.z;
		else {
			let t = this.input.getMoveVector(), { forward: i, right: a } = this.rig.getMoveBasis();
			n = a.x * t.x + i.x * t.y, r = a.z * t.x + i.z * t.y;
			let o = Math.min(1, Math.hypot(t.x, t.y)), s = Math.hypot(n, r);
			return s < 1e-6 || o < .001 ? (e.x = 0, e.z = 0, 0) : (e.x = n / s, e.z = r / s, o);
		}
		let i = Math.hypot(n, r);
		return i < 1e-6 ? (e.x = 0, e.z = 0, 0) : (e.x = n / i, e.z = r / i, Math.min(1, i));
	}
	aimPoint(e) {
		if (this.aimOverride) return e.x = this.aimOverride.x, e.z = this.aimOverride.z, !0;
		let t = this.engine.renderer.domElement.getBoundingClientRect(), n = this.input.pointer;
		if (!t.width || !t.height) return !1;
		hg.set((n.x - t.left) / t.width * 2 - 1, -((n.y - t.top) / t.height) * 2 + 1), mg.setFromCamera(hg, this.engine.camera), gg.set(fg.set(0, 1, 0), -(this.player.position.y + .8));
		let r = mg.ray.intersectPlane(gg, fg);
		return r ? (e.x = r.x, e.z = r.z, !0) : !1;
	}
	_moveGround(e, t, n) {
		let r = Math.hypot(t, n);
		if (e.blockedBy = null, r < 1e-9) return 1;
		let i = e.position, a = this.tileMap.move(i, t, n, e.def.moveRadius ?? .3, .55, this._moveOut ??= {
			x: 0,
			z: 0
		}), o = a.x, s = a.z;
		if (!e.boss && !e.isAdd && this.arenas.length) {
			for (let t of this.arenas) if (t.present && t.containsGrown(o, s, .5) && !t.containsGrown(i.x, i.z, .5)) {
				let n = 0, r = 1;
				for (let e = 0; e < 10; e++) {
					let e = (n + r) / 2;
					t.containsGrown(i.x + (o - i.x) * e, i.z + (s - i.z) * e, .5) ? r = e : n = e;
				}
				o = i.x + (o - i.x) * n, s = i.z + (s - i.z) * n, e.blockedBy = "arena";
			}
		}
		let c = Math.hypot(o - i.x, s - i.z), l = Math.min(1, c / r);
		return !e.blockedBy && l < .999 && (e.blockedBy = this._blockKind(i.x, i.z, t / r, n / r, e.def.moveRadius ?? .3)), i.x = o, i.z = s, l;
	}
	_blockKind(e, t, n, r, i) {
		let a = this.tileMap, o = e + n * (i + .2), s = t + r * (i + .2), c = a.queryColliders(o - .3, s - .3, o + .3, s + .3, this._blkCs ??= []);
		for (let e = 0; e < c.length; e++) {
			let t = c[e];
			if (t.type === "circle") {
				let e = o - t.x, n = s - t.z, r = t.r + .15;
				if (e * e + n * n < r * r) return "collider";
			} else if (o > t.minX - .15 && o < t.maxX + .15 && s > t.minZ - .15 && s < t.maxZ + .15) return "collider";
		}
		return "terrain";
	}
	_moveFly(e, t, n) {
		let r = e.position, i = this.tileMap;
		e.blockedBy = null;
		let a = r.x + t, o = r.z + n;
		if (e.isAdd && e._boss?.arena) {
			let t = e._boss.arena.rect;
			a = _(a, t.minX + .5, t.maxX - .5), o = _(o, t.minZ + .5, t.maxZ - .5);
		} else if (!e.swarm) {
			let t = (Number(this._groupOf.get(e)?.radius) || 3) + 8;
			a = _(a, e.home.x - t, e.home.x + t), o = _(o, e.home.z - t, e.home.z + t);
		}
		if (a = _(a, .3, i.width - .3), o = _(o, .3, i.depth - .3), !e.boss && !e.isAdd) for (let t of this.arenas) t.present && t.containsGrown(a, o, .5) && !t.containsGrown(r.x, r.z, .5) && (a = r.x, o = r.z, e.blockedBy = "arena");
		!e.blockedBy && (Math.abs(a - (r.x + t)) > 1e-6 || Math.abs(o - (r.z + n)) > 1e-6) && (e.blockedBy = "terrain"), r.x = a, r.z = o;
	}
	_requestToken(e) {
		let t = e.def.token;
		if (!t) return !1;
		if (e.token) return !0;
		if (this._pv.sealed && !e.boss && !e.isAdd) return !1;
		let n = xh[t.type] ?? 0;
		return this._tokens[t.type] + t.cost > n ? !1 : (this._tokens[t.type] += t.cost, e.token = !0, !0);
	}
	_releaseToken(e) {
		let t = e.def.token;
		t && e.token && (this._tokens[t.type] = Math.max(0, this._tokens[t.type] - t.cost), e.token = !1);
	}
	_markerAlloc(e, t) {
		let n = -1;
		for (let e = 0; e < Vh; e++) if (this._mk[e].h < 0) {
			n = e;
			break;
		}
		if (n < 0) return -1;
		let r = this.markers.alloc();
		if (r < 0) return -1;
		let i = this._mk[n];
		i.h = r, i.owner = e ?? null, i.gen = i.gen + 1 & 262143;
		let a = i.spec;
		for (let e = 0; e < ug.length; e++) a[ug[e]] = lg[ug[e]];
		return this._markerCopy(a, t), this.markers.set(r, a), i.gen * 64 + n;
	}
	_markerSlot(e) {
		if (!(e >= 0)) return null;
		let t = this._mk[e % 64];
		return !t || t.h < 0 || t.gen !== Math.floor(e / 64) ? null : t;
	}
	_markerCopy(e, t) {
		if (t) for (let n = 0; n < ug.length; n++) {
			let r = ug[n], i = t[r];
			i !== void 0 && (e[r] = i);
		}
	}
	_markerSet(e, t) {
		let n = this._markerSlot(e);
		n && (this._markerCopy(n.spec, t), this.markers.set(n.h, n.spec));
	}
	_markerFree(e) {
		let t = this._markerSlot(e);
		t && (this.markers.free(t.h), t.h = -1, t.owner = null);
	}
	_freeMarkersOf(e) {
		for (let t of this._mk) t.h < 0 || t.owner === "core" || (e === null ? t.owner !== "core" : t.owner === e) && (this.markers.free(t.h), t.h = -1, t.owner = null);
	}
	markerAllocCore() {
		return this._markerAlloc("core", null);
	}
	markerSetCore(e, t) {
		this._markerSet(e, t);
	}
	markerFreeCore(e) {
		this._markerFree(e);
	}
	marker(e) {
		return this._markerAlloc("core", e);
	}
	setMarker(e, t) {
		this._markerSet(e, t);
	}
	freeMarker(e) {
		this._markerFree(e);
	}
	strike(e) {
		let t = {
			player: !1,
			allies: 0
		};
		if (!this._ready || !e || this._ambient) return t;
		let n = Number(e.x), r = Number(e.z);
		if (!Number.isFinite(n) || !Number.isFinite(r)) return t;
		let i = {
			shape: e.shape ?? "circle",
			x: n,
			z: r,
			y: Number.isFinite(e.y) ? e.y : this.groundAt(n, r),
			r: e.r,
			rInner: e.rInner,
			dirX: e.dirX,
			dirZ: e.dirZ,
			halfAngle: e.halfAngle,
			len: e.len,
			width: e.width,
			dy: e.dy,
			mv: e.mv ?? 0,
			kb: e.kb ?? 0,
			poise: e.poise ?? 0,
			knockdown: !!e.knockdown,
			flat: e.flat ?? 0,
			tag: e.tag ?? 0
		}, a = Number.isFinite(e.fromX) ? e.fromX : n, o = Number.isFinite(e.fromZ) ? e.fromZ : r, s = { def: { atk: Number.isFinite(e.atk) ? e.atk : 0 } }, c = this.stepNo;
		i.tag && this.tags.touch(i.tag, c);
		let l = this.player.position;
		this.pc.alive && !this.god && !(i.tag && this.tags.has(i.tag, "player")) && Bd(i, l.x, l.y, l.z, this.pc.radius) && (this.pc.hittable ? (i.tag && this.tags.add(i.tag, "player", c), this._hitPlayer(s, i.mv, i.kb, !!i.knockdown, i.flat, a, o, "projectile"), t.player = !0) : i.flat > 0 || this.pc.notePerfectDodge());
		for (let e = 0; e < this.allies.length; e++) {
			let n = this.allies[e];
			if (!n.present || i.tag && this.tags.has(i.tag, n)) continue;
			let r = n.position;
			Bd(i, r.x, r.y, r.z, $.radius) && n.hittable && (i.tag && this.tags.add(i.tag, n, c), this._hitAlly(n, s, i.mv, i.kb, !!i.knockdown, i.flat, a, o), t.allies++);
		}
		return t;
	}
	taunt(e, t, n, r, i) {
		if (!this._ready || !e || e.gone || e.down || !this.allies.includes(e)) return 0;
		let a = _(Number(r) || 0, 0, 20), o = _(Number(i) || 0, 0, 30);
		if (!(a > 0) || !(o > 0) || !Number.isFinite(t) || !Number.isFinite(n)) return 0;
		let s = 0;
		for (let r of this.enemies) !r.alive || r.boss || r.isAdd || r.passive || r.state === "return" || this._hidden.has(r) || Math.hypot(r.position.x - t, r.position.z - n) > a + r.radius || (r.aggro || (r.dormant = !1, r.wake(this.ctx)), r.target = e, r.tauntT = o, r.targetHold = Math.max(r.targetHold, o), r.targetCheck = $.checkTarget, this.events.emit("allyTargeted", r, e.id), s++);
		return s;
	}
	ward(e, t) {
		if (!this._ready) return;
		let n = _(Number(e) || 0, 0, .9), r = _(Number(t) || 0, 0, 60);
		if (!(n > 0) || !(r > 0)) return;
		let i = this._wards;
		if (i.length < rg) {
			i.push({
				frac: n,
				t: r
			});
			return;
		}
		let a = 0;
		for (let e = 1; e < i.length; e++) i[e].t < i[a].t && (a = e);
		i[a].frac = n, i[a].t = r;
	}
	get wardFrac() {
		let e = 0;
		for (let t = 0; t < this._wards.length; t++) this._wards[t].frac > e && (e = this._wards[t].frac);
		return e;
	}
	_wardStep(e) {
		let t = this._wards;
		for (let n = t.length - 1; n >= 0; n--) t[n].t -= e, t[n].t <= 0 && t.splice(n, 1);
	}
	consumeMarks(e) {
		let t = e?.marks ?? 0;
		return t > 0 ? (e.marks = 0, this.events.emit("marksConsumed", e, t), t) : 0;
	}
	submerge(e) {
		this.ev && e?.alive && !e.submerged && (this.targeting.lock === e && this.targeting.release(), this.ev.submerge(e));
	}
	surface(e, t, n) {
		this.ev?.surface(e, t, n);
	}
	_askRelease(e) {
		return !e?.alive || this._releaseAsk.includes(e) ? !1 : (this._releaseAsk.push(e), !0);
	}
	_runReleases() {
		let e = this._releaseAsk;
		for (let t = 0; t < e.length; t++) this.release(e[t]);
		e.length = 0;
	}
	release(e) {
		return !this._ready || !e?.alive ? !1 : (e.hp = 0, e._barT = this.clock, this._kill(e, { release: !0 }), !0);
	}
	addWarmth(e) {
		return !e || this._warmth.includes(e) ? () => {} : (this._warmth.push(e), () => {
			let t = this._warmth.indexOf(e);
			t >= 0 && this._warmth.splice(t, 1);
		});
	}
	warmthZones() {
		let e = [];
		for (let t of this.world?.warmth ?? []) {
			let n = t?.at;
			Array.isArray(n) && Number.isFinite(n[0]) && Number.isFinite(n[1]) && t.r > 0 && e.push({
				x: n[0],
				z: n[1],
				r: t.r
			});
		}
		for (let t of this._warmth) Number.isFinite(t.x) && Number.isFinite(t.z) && t.r > 0 && e.push({
			x: t.x,
			z: t.z,
			r: t.r
		});
		return e;
	}
	setFlag(e, t = 1) {
		let n = this.game?.story?.state;
		if (!n || typeof e != "string") return !1;
		let r = t === !0 ? 1 : t === !1 ? 0 : Number(t);
		return Number.isFinite(r) ? r === 1 || r === 0 ? n.setFlag(e, r === 1) : n.setVar(e, r) : !1;
	}
	pulse(e) {
		return this._ready && this.ev ? this.ev.pulse(e) : {
			harmful: !1,
			player: !1,
			allies: 0,
			spared: 0
		};
	}
	get markerCount() {
		let e = 0;
		for (let t of this._mk) t.h >= 0 && e++;
		return e;
	}
	burst(e, t, n, r, i, a) {
		let o = Math.max(0, Math.min(24, i | 0));
		a ? this.particles.burst(e, fg.set(t, n, r), o, a) : this.particles.burst(e, fg.set(t, n, r), o);
	}
	sfxAt(e, t, n, r) {
		let i = this.player.position, a = Math.hypot(t - i.x, n - i.z), o = a <= 6 ? 1 : Math.max(0, 1 - (a - 6) / 24);
		if (o <= .01) return;
		this.projectNdc(t, i.y + 1, n, this._ndc, 1);
		let s = _(Number.isFinite(this._ndc.x) ? this._ndc.x : 0, -.8, .8), c = (ee(Math.floor(t * 16), Math.floor(n * 16), this.frame) - .5) * .08;
		this.audio.playSfx(e, {
			volume: o * (r?.volume ?? 1),
			pitch: (r?.pitch ?? 1) * (1 + c),
			pan: s
		});
	}
	shake(e, t) {
		this.rig.shake(e, t);
	}
	hurtShake(e) {
		let t = e ? Z.knockdown : Z.hurt;
		this.rig.shake(t[0], t[1]);
	}
	number(e, t, n, r, i) {
		this.ui.combat?.labels.number(e, t, n, r, i);
	}
	allyNumber(e, t, n, r) {
		this.ui.combat?.labels.number(e, t, n, r, Xh);
	}
	_hitStop(e, t) {
		e > this.stop && (this.stop = e), t && !this._stopVictims.includes(t) && this._stopVictims.push(t);
	}
	_slowMotion(e, t, n) {
		this._slow > 0 && t > this.enemyScale && e >= this.playerScale || (this.playerScale = e, this.enemyScale = t, this._slow = n);
	}
	update(e, t, n = !1) {
		if (!this._ready) return;
		let r = performance.now();
		if (this._tickT = 0, this._ambient = !1, !t) {
			this._wasActive = !1, n && this.setpiece && this._ambientStep(e), this._tickT += performance.now() - r;
			return;
		}
		let i = !this._wasActive;
		if (this._wasActive = !0, this._cacheViewProjection(), this.cin.collect(e, i), this.cin.lockEvent && this.pc.alive && this.targeting.onLockEvent(this.cin.lockEvent), this._introPending.length && this._startIntros(), this._swarmPending.length && this._wakeSwarms(), this._awakePending) {
			let e = this._awakePending;
			this._awakePending = null, e.alive && this._bossFight === e && this._showBoss(e, !1);
		}
		if (this._pullPending) {
			let e = this._pullPending;
			this._pullPending = null, e.active && this.allies.length && this._alliesIntoArena(e, !0);
		}
		this._advanced = 0, this._realAdvanced = 0;
		let a = Math.max(1, Math.ceil(e / bh - rn)), o = e / a;
		for (let e = 0; e < a; e++) this._substep(o);
		for (let t = 0; t < this.skyDragons.length; t++) this.skyDragons[t].update(e, !1);
		this._tickT += performance.now() - r;
	}
	_ambientStep(e) {
		this._ambient = !0;
		let t = this.ctx;
		this._cacheViewProjection(), this._introPending.length && this._startIntros(), this._ambientWake(e);
		let n = Math.max(1, Math.ceil(e / bh - rn)), r = e / n;
		t.ambient = !0;
		try {
			for (let e = 0; e < n; e++) this._ambientSubstep(r);
		} finally {
			t.ambient = !1;
		}
		for (let t = 0; t < this.skyDragons.length; t++) this.skyDragons[t].update(e, !0);
	}
	_ambientSubstep(e) {
		this.frame++;
		let t = this.ctx;
		t.frame = this.frame, this._syncPlayerView(), this.nav.beginStep(Jh);
		let n = this.enemies;
		for (let r = 0; r < n.length; r++) {
			let i = n[r], a = this._ambientRuns(i);
			i.ambientRun = a, a && (this._cur = i, i.update(e, t));
		}
		this._cur = null;
		for (let n = 0; n < this.systems.length; n++) this.systems[n].update?.(e, t);
		this.projectiles.step(e, e), this._introT > 0 && (this._introT = Math.max(0, this._introT - e)), this.tags.sweep(this.stepNo), this.playerHits.clear(), this.enemyHits.clear(), this.allyHits.clear(), this._contactN = 0, this.stepNo++;
	}
	_ambientRuns(e) {
		return this._hidden.has(e) ? !1 : e.alive ? e.boss ? e.state === "intro" : e.dormant || e.aggro || e.isAdd ? !1 : e.state === "idle" || e.state === "dormant" : e.sprite.visible && e.sprite.opacity > .001;
	}
	_ambientWake(e) {
		if (this._ambientCheckT -= e, this._ambientCheckT > 0) return;
		this._ambientCheckT = Ch;
		let t = this._cameraFocus(this._focus), n = this.player.position;
		for (let e of this.enemies) {
			if (!e.dormant || !e.alive || e.aggro || e.boss || this._hidden.has(e)) continue;
			let r = Math.hypot(e.position.x - n.x, e.position.z - n.z), i = Math.hypot(e.position.x - t.x, e.position.z - t.z);
			Math.min(r, i) <= sg && (e.dormant = !1);
		}
	}
	_cameraFocus(e) {
		let t = this.engine.camera.matrixWorld.elements, n = -t[9], r = t[13] - this.player.position.y, i = n < -.05 ? Math.min(400, Math.max(0, r / -n)) : 0;
		return e.x = t[12] - t[8] * i, e.z = t[14] - t[10] * i, e;
	}
	_startIntros() {
		let e = this._introPending;
		for (let t = 0; t < e.length; t++) {
			let n = e[t];
			!n.alive || this._hidden.has(n) || n.state !== "dormant" || this._bossFight && this._bossFight !== n || (n.dormant = !1, n.setState("intro"));
		}
		e.length = 0;
	}
	_wakeSwarms() {
		for (let e of this._swarmPending) if (!this._absentGroups.has(e)) for (let t of this._members.get(e) ?? []) this._swarmWake(t);
		this._swarmPending.length = 0;
	}
	_swarmWake(e) {
		if (!e.alive || e.aggro || this._hidden.has(e) || (e.dormant = !1, e.wake(this.ctx), !e.aggro)) return;
		let t = this.player.position, n = null, r = Math.hypot(e.position.x - t.x, e.position.z - t.z);
		for (let t of this.allies) {
			if (t.gone || t.down || !t.present) continue;
			let i = Math.hypot(e.position.x - t.position.x, e.position.z - t.position.z);
			i < r && (r = i, n = t);
		}
		n && (e.target = n, e.targetHold = $.holdTarget, e.targetCheck = $.checkTarget, this.events.emit("allyTargeted", e, n.id));
	}
	_substep(e) {
		if (this.frame++, this.ctx.frame = this.frame, this.clock += e, this._wards.length && this._wardStep(e), this.stop > 0) {
			this.stop = Math.max(0, this.stop - e);
			return;
		}
		this._realAdvanced += e, this._slow > 0 && (this._slow -= e, this._slow <= 1e-6 && (this._slow = 0, this.playerScale = 1, this.enemyScale = 1));
		let t = e * this.playerScale, n = e * this.enemyScale;
		this._advanced += t, this.enemyTime += n, this.ctx.time = this.enemyTime, this._syncPlayerView(), this.pc.step(t), this.cin.tick(e), this._syncPlayerView();
		let r = this.allies;
		if (r.length) {
			this.allySearches = 1;
			for (let e = 0; e < r.length; e++) r[e].step(t);
		}
		this.nav.beginStep(Jh);
		let i = this.enemies;
		for (let e = 0; e < i.length; e++) {
			let t = i[e];
			if (t.dormant || !t.alive && t.sprite.opacity <= .001) continue;
			if (this.freezeAI && t.alive) {
				t.decayFlash(n);
				continue;
			}
			this._cur = t, t.target && this._retarget(t, n);
			let r = t.target;
			if (r) {
				this.ctx.player = r.view;
				try {
					t.update(n, this.ctx);
				} finally {
					this.ctx.player = this._pv;
				}
			} else t.update(n, this.ctx);
		}
		this._cur = null, this._releaseAsk.length && this._runReleases();
		for (let e = 0; e < this.systems.length; e++) this.systems[e].update?.(n, this.ctx);
		this.projectiles.step(t, n), this._resolve(), this._timersStep(n), this.tags.sweep(this.stepNo), this.playerHits.clear(), this.enemyHits.clear(), this.allyHits.clear(), this._contactN = 0, this.stepNo++;
	}
	_syncPlayerView() {
		let e = this._pv, t = this.pc;
		e.facing.x = this.player.facing.x, e.facing.z = this.player.facing.z, e.alive = t.alive, e.invulnerable = t.invulnerable || this.god, e.dodging = t.dodging, e.action = t.action, e.swing = t.swings;
		let n = !1;
		for (let e = 0; e < this.arenas.length; e++) if (this.arenas[e].active) {
			n = !0;
			break;
		}
		e.sealed = n;
	}
	_retarget(e, t) {
		let n = e.target;
		if (!n) return;
		if (n.gone || n.down || !e.alive || !this.pc.alive || e.state === "return" || e.boss || e.isAdd) {
			e.target = null, e.tauntT = 0;
			return;
		}
		if (e.targetHold -= t, e.tauntT > 0) {
			if (e.tauntT -= t, e.tauntT > 0) return;
			e.tauntT = 0;
		}
		if (e.targetCheck -= t, e.targetCheck > 0) return;
		e.targetCheck += $.checkTarget, e.targetCheck <= 0 && (e.targetCheck = $.checkTarget);
		let r = n.mode === "retreat";
		if (e.targetHold > 0 && !r) return;
		let i = this.player.position, a = n.position, o = Math.hypot(e.position.x - a.x, e.position.z - a.z);
		Math.hypot(e.position.x - i.x, e.position.z - i.z) < (r ? 1 : $.playerNearer) * o && (e.target = null);
	}
	_allyAggro(e, t, n = "melee") {
		if (e.boss || e.isAdd || e.passive || !e.alive || t.down || t.gone) return;
		if (e.target === t) {
			e.targetHold = Math.max(e.targetHold, $.holdTarget);
			return;
		}
		if (e.target && e.targetHold > 0) return;
		let r = this.player.position, i = t.position, a = Math.hypot(e.position.x - i.x, e.position.z - i.z), o = Math.hypot(e.position.x - r.x, e.position.z - r.z), s = n === "projectile" && e.def.token?.type === "ranged" && a <= $.rangedAggro;
		(a < o * $.threat || s) && (e.target = t, e.targetHold = $.holdTarget, e.targetCheck = $.checkTarget, this.events.emit("allyTargeted", e, t.id));
	}
	onAllyDown(e) {
		for (let t of this.enemies) t.target === e && (t.target = null, t.tauntT = 0);
		this.events.emit("allyDown", e.id);
	}
	_timersStep(e) {
		this._introT > 0 && (this._introT -= e, this._introT <= 0 && (this._introT = 0));
		for (let e = 0; e < this.enemies.length; e++) {
			let t = this.enemies[e];
			t.kind === "dummy" && t.alive && t.hp < t.hpMax && this.enemyTime - (t._refillFrom ?? 0) >= Ah - 1e-6 && (t.hp = t.hpMax);
		}
	}
	addPlayerHit(e, t, n) {
		let r = this.playerHits.add("player", e), i = this.playerHits.items[this.playerHits.length - 1];
		return i.meta = t, i.swing = n, r;
	}
	addAllyHit(e, t, n) {
		this.allyHits.add(e, t);
		let r = this.allyHits.items[this.allyHits.length - 1];
		r.meta = Qh[n] ?? Qh.melee, r.swing = null;
	}
	spawnAllyProjectile(e, t) {
		return this.projectiles.spawn("player", t, e);
	}
	spawnProjectile(e, t) {
		return this.projectiles.spawn(e, t);
	}
	_contact() {
		return this._contactN === this._contacts.length && this._contacts.push({
			p: null,
			target: null,
			x: 0,
			y: 0,
			z: 0,
			dirX: 0,
			dirZ: 1,
			mv: 1,
			kb: 0,
			poise: 0,
			tag: 0,
			owner: null,
			splash: null,
			splashTag: 0,
			kind: "",
			player: !1,
			ally: null,
			chill: 0,
			slow: 0,
			freeze: 0,
			stun: 0,
			mark: 0,
			consume: 0,
			feel: null,
			look: null
		}), this._contacts[this._contactN++];
	}
	queueProjectileHit(e, t) {
		let n = this._contact();
		n.target = t, n.x = e.x, n.y = e.y, n.z = e.z, n.dirX = e.dirX, n.dirZ = e.dirZ, n.mv = e.mv, n.kb = e.kb, n.poise = e.poise, n.tag = e.tag, n.owner = e.owner, n.splash = e.splash, n.splashTag = e.splashTag, n.kind = e.kind, n.player = e.player, n.ally = e.ally, n.chill = e.chill, n.slow = e.slow, n.freeze = e.freeze, n.stun = e.stun, n.mark = e.mark, n.consume = e.consume, n.feel = e.feel, n.look = e.look, this.tags.add(e.tag, t, this.stepNo);
	}
	queueSplash(e) {
		this._ambient || (e.ally ? this._allySplash(e.ally, e.x, e.y, e.z, e.splash, null, e.tag, e.splashTag) : this._splash(e.x, e.y, e.z, e.splash, null, e.tag, e.splashTag));
	}
	queueLanding(e) {
		let t = this._landSpec ??= {};
		t.shape = "circle", t.x = e.arc.tx, t.y = e.ty, t.z = e.arc.tz, t.r = e.radius, t.dy = On, t.mv = e.mv, t.kb = e.kb, t.poise = e.poise, t.knockdown = !1, t.flat = 0, t.thin = !1, t.tag = e.tag, t.fromX = e.arc.tx, t.fromZ = e.arc.tz, e.owner !== "fx" && this.enemyHits.add(e.owner, t), !this.projectiles.impact(e) && (this.fx.play("dust", t.x, t.y, t.z, { scale: 1.6 }), this.burst("emberBurst", t.x, t.y + .2, t.z, 8), this.sfxAt("slam", t.x, t.z, { volume: .7 }));
	}
	_resolve() {
		let e = this.stepNo, t = this.enemies, n = this.playerHits;
		for (let r = 0; r < n.length; r++) {
			let i = n.items[r], a = i.spec;
			this.tags.touch(a.tag, e);
			let o = null, s = this._crowd;
			s.length = 0;
			for (let n = 0; n < t.length; n++) {
				let r = t[n];
				r.alive && !r.dormant && r.sprite.visible && !r.submerged && (this.tags.has(a.tag, r) || Bd(a, r.position.x, r.position.y, r.position.z, r.radius) && (this.tags.add(a.tag, r, e), o ??= r, s.push(r), this._hitEnemy(r, a.mv, a.kb, a.poise, a.knockdown && !r.boss, Number.isFinite(a.fromX) ? a.fromX : a.x, Number.isFinite(a.fromZ) ? a.fromZ : a.z, i.meta, i.swing, a.tag, a)));
			}
			if (o && a.feel && this._applyFeel(a.feel, o), s.length >= ag) for (let e = 0; e < s.length; e++) s[e].softenFlash();
		}
		let r = this.allyHits;
		for (let n = 0; n < r.length; n++) {
			let i = r.items[n], a = i.spec, o = i.owner;
			this.tags.touch(a.tag, e);
			let s = null, c = this._crowd;
			c.length = 0;
			for (let n = 0; n < t.length; n++) {
				let r = t[n];
				r.alive && !r.dormant && r.sprite.visible && !r.submerged && (this.tags.has(a.tag, r) || Bd(a, r.position.x, r.position.y, r.position.z, r.radius) && (this.tags.add(a.tag, r, e), s ??= r, c.push(r), this._allyHitEnemy(o, r, a.mv, a.kb, a.poise, a.knockdown && !r.boss, Number.isFinite(a.fromX) ? a.fromX : a.x, Number.isFinite(a.fromZ) ? a.fromZ : a.z, i.meta.source, a.tag, a)));
			}
			if (s && a.feel && this._applyFeel(a.feel, s), c.length >= ag) for (let e = 0; e < c.length; e++) c[e].softenFlash();
		}
		for (let e = 0; e < this._contactN; e++) {
			let t = this._contacts[e];
			if (!t.player || t.target === "player") continue;
			let n = t.target;
			if (n.alive) {
				if (t.ally) {
					this._allyShotHit(t, n);
					continue;
				}
				this._hitEnemy(n, t.mv, t.kb, t.poise, !1, t.x - t.dirX, t.z - t.dirZ, Sp.bolt, null, t.tag, t), t.feel && this._applyFeel(t.feel, n), t.splash && this._splash(t.x, t.y, t.z, t.splash, n, t.tag, t.splashTag), !this.projectiles.impact(t) && (this.fx.play("impact", t.x, t.y - 1, t.z), this.burst("emberBurst", t.x, t.y, t.z, 8), this.sfxAt("boltHit", t.x, t.z));
			}
		}
		let i = this.enemyHits, a = this.player.position;
		for (let t = 0; t < i.length; t++) {
			let n = i.items[t], r = n.spec;
			if (this.tags.touch(r.tag, e), this.pc.alive && !this.tags.has(r.tag, "player") && Bd(r, a.x, a.y, a.z, this.pc.radius) && !this.god) {
				if (!this.pc.hittable) {
					r.flat > 0 || this.pc.notePerfectDodge();
					continue;
				}
				this.tags.add(r.tag, "player", e), this._hitPlayer(n.owner, r.mv, r.kb, r.knockdown, r.flat, Number.isFinite(r.fromX) ? r.fromX : r.x, Number.isFinite(r.fromZ) ? r.fromZ : r.z);
			}
		}
		for (let e = 0; e < this._contactN; e++) {
			let t = this._contacts[e];
			if (!(t.player || t.target !== "player") && this.pc.alive && !this.god) {
				if (!this.pc.hittable) {
					this.pc.notePerfectDodge();
					continue;
				}
				this._hitPlayer(t.owner, t.mv, t.kb, !1, 0, t.x - t.dirX, t.z - t.dirZ, "projectile"), this.projectiles.impact(t) || this.sfxAt("arrowHit", t.x, t.z);
			}
		}
		this.allies.length && this._resolveAllies(e);
	}
	_resolveAllies(e) {
		let t = this.allies, n = this.enemyHits;
		for (let r = 0; r < n.length; r++) {
			let i = n.items[r], a = i.spec;
			for (let n = 0; n < t.length; n++) {
				let r = t[n];
				if (!r.present || this.tags.has(a.tag, r)) continue;
				let o = r.position;
				Bd(a, o.x, o.y, o.z, $.radius) && r.hittable && (this.tags.add(a.tag, r, e), this._hitAlly(r, i.owner, a.mv, a.kb, a.knockdown, a.flat, Number.isFinite(a.fromX) ? a.fromX : a.x, Number.isFinite(a.fromZ) ? a.fromZ : a.z));
			}
		}
		for (let e = 0; e < this._contactN; e++) {
			let t = this._contacts[e];
			if (t.player || !t.target || t.target === "player" || !t.target.isAlly) continue;
			let n = t.target;
			n.hittable && (this._hitAlly(n, t.owner, t.mv, t.kb, !1, 0, t.x - t.dirX, t.z - t.dirZ), this.projectiles.impact(t) || this.sfxAt("arrowHit", t.x, t.z, { volume: .7 }));
		}
	}
	_hitAlly(e, t, n, r, i, a, o, s) {
		if (this._ambient) return;
		let c = e.position, l = c.x - o, u = c.z - s, d = Math.hypot(l, u);
		d > 1e-6 ? (l /= d, u /= d) : (l = -e.member.facing.x, u = -e.member.facing.z);
		let f = this._wards.length ? this.wardFrac : 0;
		if (a > 0) {
			let t = f > 0 ? Math.max(1, Math.round(a * (1 - f))) : a;
			e.hurtFlat(t), this.number(c.x, c.y + 1.9, c.z, String(t), "hurt"), f > 0 && this._wardGlint(c), this.events.emit("allyHurt", e.id, t);
			return;
		}
		if (!(n > 0)) {
			r > 0 && e.shove(r, l, u);
			return;
		}
		let p = t?.def?.atk ?? 10, m = .92 + .16 * e.rng.next(), h = Math.max(1, Math.round(p * n * m * jn(e.def) * (1 - f)));
		f > 0 && this._wardGlint(c), e.takeHit(h, r, l, u, i), this.number(c.x, c.y + 1.9, c.z, String(h), "hurt"), this.sfxAt("hurt", c.x, c.z, {
			volume: .55,
			pitch: 1.15
		}), this.burst("hitSpark", c.x, c.y + 1, c.z, 5), this.events.emit("allyHurt", e.id, h);
	}
	_allyHitEnemy(e, t, n, r, i, a, o, s, c, l, u = null) {
		if (e.gone || this._ambient) return;
		let d = t.position.x - o, f = t.position.z - s, p = Math.hypot(d, f);
		p > 1e-6 ? (d /= p, f /= p) : (d = e.member.facing.x, f = e.member.facing.z);
		let m = this._allyInfo ??= {
			damage: 0,
			crit: !1,
			mv: 0,
			kb: 0,
			kbDirX: 0,
			kbDirZ: 0,
			poise: 0,
			knockdown: !1,
			source: "melee",
			tag: 0,
			guarded: !1
		};
		m.mv = n, m.kb = r, m.kbDirX = d, m.kbDirZ = f, m.poise = i, m.knockdown = a, m.source = c, m.tag = l;
		let h = t.position.x, g = t.position.z, _ = this.numberY(t);
		if (t.guarded) {
			m.damage = 0, m.crit = !1, m.guarded = !0, t.receiveHit(m, this.ctx), this.number(h, _, g, "Guard", "guard"), this.sfxAt("guard", h, g, { volume: .5 }), this.burst("hitSpark", h, this.bodyBase(t) + .9, g, 3);
			return;
		}
		m.guarded = !1, u?.consume > 0 && t.marks > 0 && (m.mv = n *= 1 + u.consume * this.consumeMarks(t));
		let ee = .92 + .16 * e.rng.next(), v = e.rng.next(), te = d * t.facing.x + f * t.facing.z > .3, y = !!t.exposed || t.state === "stagger" || t.state === "stun", ne = t.boss && (typeof t.hpFloor == "number" ? t.state === "kneel" : !!this._kneel && this._kneel.boss === t && this.enemyTime < this._kneel.until), b = An.base + (te ? An.rear : 0) + (y ? An.exposed : 0), re = ne || v < b, x = Math.max(1, Math.round(e.atk * n * ee * jn(t.def.def ?? 0) * (re ? An.mult : 1) * (t.vuln || 1)));
		t.boss && (x = this._bossClamp(t, x, ne)), t.hp = Math.max(0, t.hp - x), m.damage = x, m.crit = re, t.hitFlash = vp, t._barT = this.clock, t.kind === "dummy" && (t._refillFrom = this.enemyTime), e.counts.hits++, e.counts.damageDealt += x, re && e.counts.crits++, t.hp <= 0 ? (this._kill(t), e.kills++, this.events.emit("allyKill", e.id, t)) : (t.receiveHit(m, this.ctx), this._allyAggro(t, e, c), u && this._applyStatus(t, u));
		let ie = this.bodyBase(t);
		this.allyNumber(h, _, g, x > 0 ? String(x) : "Guard"), this.fx.play(re ? "crit" : "impact", h - d * .2, ie + (t.def.body[1] - 1) * .5, g - f * .2, qh), this.burst("hitSpark", h - d * .25, ie + Math.min(1.1, t.def.body[1] * .55), g - f * .25, re ? 7 : 4), this.sfxAt(re ? "crit" : "hit", h, g, { volume: Zh }), this.events.emit("allyHit", e.id, t, x, re);
	}
	_allyShotHit(e, t) {
		let n = e.ally;
		this._allyHitEnemy(n, t, e.mv, e.kb, e.poise, !1, e.x - e.dirX, e.z - e.dirZ, "projectile", e.tag, e), e.feel && this._applyFeel(e.feel, t), e.splash && this._allySplash(n, e.x, e.y, e.z, e.splash, t, e.tag, e.splashTag), !this.projectiles.impact(e) && (e.kind === "emberBolt" ? (this.fx.play("impact", e.x, e.y - 1, e.z, { scale: .8 }), this.burst("emberBurst", e.x, e.y, e.z, 6), this.sfxAt("boltHit", e.x, e.z, { volume: .7 })) : this.sfxAt("arrowHit", e.x, e.z, { volume: .6 }));
	}
	_allySplash(e, t, n, r, i, a, o, s) {
		if (this._ambient) return;
		let c = this.enemies;
		for (let l = 0; l < c.length; l++) {
			let u = c[l];
			if (u === a || !u.alive || u.dormant || !u.sprite.visible || u.submerged || Math.hypot(u.position.x - t, u.position.z - r) >= i.r + u.radius) continue;
			let d = u.def.body, f = this.bodyBase(u);
			n < f + d[0] - i.r || n > f + d[1] + i.r || this.tags.has(s, u) || (this.tags.add(s, u, this.stepNo), this._allyHitEnemy(e, u, i.mv, .4, 0, !1, t, r, "projectile", o));
		}
	}
	hurtAlly(e, t) {
		if (!e || e.gone || e.down) return e ? Math.ceil(e.hp) : 0;
		let n = Math.max(0, Math.round(Number(t) || 0)), r = e.position;
		return this.number(r.x, r.y + 1.9, r.z, String(n), "hurt"), e.hp = Math.max(0, e.hp - n), e.counts.damageTaken += n, e.hp <= 0 && e._goDown(), Math.ceil(e.hp);
	}
	_splash(e, t, n, r, i, a, o) {
		if (this._ambient) return;
		let s = this.enemies;
		for (let c = 0; c < s.length; c++) {
			let l = s[c];
			if (l === i || !l.alive || l.dormant || !l.sprite.visible || l.submerged || Math.hypot(l.position.x - e, l.position.z - n) >= r.r + l.radius) continue;
			let u = l.def.body, d = this.bodyBase(l);
			t < d + u[0] - r.r || t > d + u[1] + r.r || this.tags.has(o, l) || (this.tags.add(o, l, this.stepNo), this._hitEnemy(l, r.mv, .4, 0, !1, e, n, Sp.bolt, null, a));
		}
	}
	_hitEnemy(e, t, n, r, i, a, o, s, c, l, u = null) {
		if (this._ambient) return;
		let d = this.pc;
		e.playerHitAt = this.clock;
		let f = e.position.x - a, p = e.position.z - o, m = Math.hypot(f, p);
		m > 1e-6 ? (f /= m, p /= m) : (f = this.player.facing.x, p = this.player.facing.z);
		let h = this._info ??= {
			damage: 0,
			crit: !1,
			mv: 0,
			kb: 0,
			kbDirX: 0,
			kbDirZ: 0,
			poise: 0,
			knockdown: !1,
			source: "melee",
			tag: 0,
			guarded: !1
		};
		h.mv = t, h.kb = n, h.kbDirX = f, h.kbDirZ = p, h.poise = r, h.knockdown = i, h.source = s.source, h.tag = l;
		let g = e.position.x, _ = e.position.z, ee = this.numberY(e);
		if (e.guarded) {
			h.damage = 0, h.crit = !1, h.guarded = !0, e.receiveHit(h, this.ctx), this.number(g, ee, _, "Guard", "guard"), this.sfxAt("guard", g, _, { volume: .8 }), this.burst("hitSpark", g, this.bodyBase(e) + .9, _, 4), this._hitStop(w(gp.guard), e);
			return;
		}
		h.guarded = !1, u?.consume > 0 && e.marks > 0 && (h.mv = t *= 1 + u.consume * this.consumeMarks(e));
		let v = .92 + .16 * this.rng.next(), te = this.rng.next(), y = f * e.facing.x + p * e.facing.z > .3, ne = !!e.exposed || e.state === "stagger" || e.state === "stun", b = e.boss && (typeof e.hpFloor == "number" ? e.state === "kneel" : !!this._kneel && this._kneel.boss === e && this.enemyTime < this._kneel.until), re = An.base + (y ? An.rear : 0) + (ne ? An.exposed : 0) + (s.finisher ? An.finisher : 0), x = b || te < re, ie = Math.max(1, Math.round(d.atk * t * v * jn(e.def.def ?? 0) * (x ? An.mult : 1) * (e.vuln || 1)));
		e.boss && (ie = this._bossClamp(e, ie, b));
		let ae = ie >= e.hp;
		e.hp = Math.max(0, e.hp - ie), h.damage = ie, h.crit = x, e.hitFlash = vp, e._barT = this.clock, e.kind === "dummy" && (e._refillFrom = this.enemyTime), e.hp <= 0 ? this._kill(e) : (e.receiveHit(h, this.ctx), u && this._applyStatus(e, u));
		let oe = this.bodyBase(e);
		ie > 0 ? this.number(g, ee, _, String(ie), x ? "crit" : "dmg") : this.number(g, ee, _, "Guard", "guard"), this._impactStar(e, x, f, p), this.burst("hitSpark", g - f * .25, oe + Math.min(1.1, e.def.body[1] * .55), _ - p * .25, x ? 10 : 6), this.sfxAt(x ? "crit" : "hit", g, _, { volume: .9 });
		let se = e.boss ? gp.boss : s.stop;
		this._hitStop(_p(se, x, ae && e.hp <= 0, e.boss), e);
		let ce = x ? Z.crit : s.finisher ? Z.finisher : ae ? Z.kill : Z.hit;
		this.shake(ce[0], ce[1]), s.source === "melee" && d.onMeleeLanded(c), s.combo === 3 && e.kind === "dummy" && (this.tutorial.combo = !0), this.events.emit("hit", e, ie, x, s.source);
	}
	_applyStatus(e, t) {
		let n = t.freeze ?? 0, r = t.stun ?? 0, i = t.chill ?? 0, a = t.mark ?? 0;
		if (e.alive && (n > 0 || r > 0 || i > 0 || a > 0)) {
			if (a > 0 && e.addMarks(a), n > 0 && e.freeze(n), r > 0 && !e.boss && !e.passive) {
				e.stun(r);
				let t = e.position;
				this.fx.stopFollowing(t), this.fx.play("stun", t.x, this.bodyBase(e) + e.def.body[1] - 1.25, t.z, {
					follow: t,
					duration: Math.min(30, r)
				});
			}
			i > 0 && e.chill(i, t.slow ?? 0);
		}
	}
	_applyFeel(e, t) {
		let n = Number(e.stop) || 0;
		n > 0 && this._hitStop(w(Math.min(gp.cap, n)), t);
		let r = e.shake;
		if (Array.isArray(r) && r.length >= 2) {
			let e = _(Number(r[0]) || 0, 0, og[0]), t = _(Number(r[1]) || 0, 0, og[1]);
			e > 0 && t > 0 && this.shake(e, t);
		}
	}
	_wardGlint(e) {
		this.burst("magicBurst", e.x, e.y + 1.1, e.z, 4, ig);
	}
	_bossClamp(e, t, n) {
		let r = 0;
		if (typeof e.hpFloor == "number") r = e.hpFloor;
		else {
			let t = e.def.phases ?? [.7, .35], i = Math.max(e.phase || 1, this._bossPhaseSeen ?? 1);
			i <= t.length && (r = Math.ceil(e.hpMax * t[i - 1])), n && (r = Math.max(r, e.hp - Math.max(0, this._kneel.cap - this._kneel.taken)));
		}
		if (n && typeof e.hpFloor != "number") {
			let e = Math.max(0, this._kneel.cap - this._kneel.taken);
			t = Math.min(t, e);
		}
		return t = Math.max(0, Math.min(t, e.hp - r)), n && this._kneel && (this._kneel.taken += t), t;
	}
	_kill(e, { loot: t = !0, release: n = !!e.def.release } = {}) {
		let r = e.position.x, i = e.position.y, a = e.position.z;
		n && (e.released = !0), e.die(this.ctx), this._releaseToken(e), this.fx.stopFollowing(e.position), this.kills += +!e.passive, n || this.sfxAt("enemyDie", r, a, { volume: .9 }), t && !e.passive && !e.isAdd && (this._bossKillXp = e.boss, this.pc.gainXp(e.def.xp ?? 0), this._bossKillXp = !1, e.boss ? this._bossLoot(e) : this._dropLoot(e, r, i, a)), e.deathCount++, this.events.emit("kill", e), e.boss && this._bossDefeated(e);
	}
	_dropLoot(e, t, n, r) {
		let i = Qp(e.uid, e.deathCount, this.seedValue), a = $p(e.def, i, this.pc.hp < this.pc.hpMax * Mh, this._loot ??= {
			gold: 0,
			heart: !1,
			mana: !1,
			draught: !1
		});
		this.dropGold(a.gold, t, n, r, i), a.heart && this.pickups.drop("heart", 1, t, n, r, i), a.mana && this.pickups.drop("mana", 1, t, n, r, i), a.draught && this.pickups.drop("draught", 1, t, n, r, i);
	}
	dropGold(e, t, n, r, i) {
		if (!(e > 0)) return;
		let a = this._coins ??= Array.from({ length: 6 }, () => ({
			kind: "coin1",
			amount: 0
		})), o = em(e, a);
		for (let e = 0; e < o; e++) this.pickups.drop(a[e].kind, a[e].amount, t, n, r, i);
	}
	wantsPickup(e) {
		let t = this.pc;
		return e === "heart" ? t.hp < t.hpMax : e === "mana" ? t.mp < t.mpMax - rn : e !== "draught" || t.potions < 5;
	}
	upgradeText(e) {
		return e === "maxHp" ? S("combat.upgrade.maxHp", { n: fn.maxHp }) : e === "maxMp" ? S("combat.upgrade.maxMp", { n: fn.maxMp }) : e === "attack" ? S("combat.upgrade.attack", { n: fn.attack }) : e === "core" ? `${S("combat.upgrade.core")}${Oe()}${S("combat.upgrade.maxHp", { n: fn.core })}` : S("combat.upgrade.other");
	}
	_upgradeToast(e) {
		return e === "maxHp" || e === "maxMp" || e === "attack" ? S(`combat.upgraded.${e}`, { n: fn[e] }) : e === "core" ? S("combat.upgraded.core", {
			item: S("combat.upgrade.core"),
			n: fn.core
		}) : S("combat.obtained", { item: S("combat.upgrade.other") });
	}
	displayName(e) {
		let t = this._shownNames.get(e);
		if (t !== void 0) return t;
		let n = `combat.enemy.${e.kind}`, r = S(n), i = r === n ? e.def.name : r, a = e.isAdd ? null : this._groupOf.get(e), o = a?.name ? String(a.name) : "", s = o ? Pe(() => Ne(o)) : "", c = !!o && s === o && o === e.def.name;
		return o && !c && Ne(o), t = o ? c ? i : s : e.elite ? S("combat.elite", { name: i }) : i, this._shownNames.set(e, t), t;
	}
	collectPickup(e, t, n, r, i, a) {
		let o = this.pc, s = this.ui.combat?.hud, c = this.player.position;
		if (!this.wantsPickup(e)) return !1;
		if (e.startsWith("coin")) o.gold += t, this._goldFeed === 0 && (this._goldFeedAge = 0), this._goldFeed += t, this._goldFeedT = eg.quiet, this.audio.playSfx("coin", {
			volume: .55,
			pitch: e === "coin25" ? .85 : e === "coin5" ? 1 : 1.12
		});
		else if (e === "heart") {
			let e = o.heal(Math.round(o.hpMax * xn));
			s?.loot(S("combat.loot.heart", { n: e }), "heart"), this.audio.playSfx("pickup", { volume: .6 });
		} else if (e === "mana") {
			let e = o.mp;
			o.mp = Math.min(o.mpMax, o.mp + 8);
			let t = Math.max(1, Math.round(o.mp - e));
			t > 0 && this.number(c.x, c.y + 1.9, c.z, `+${t}`, "mp"), s?.loot(S("combat.loot.mana", { n: t }), "mana"), this.audio.playSfx("pickup", {
				volume: .6,
				pitch: 1.15
			});
		} else if (e === "draught") o.potions = Math.min(5, o.potions + 1), s?.loot(S("combat.loot.draught"), "draught"), this.audio.playSfx("pickup", { volume: .7 });
		else if (e === "upgrade" || e === "core") {
			let t = e === "core" ? "core" : n;
			o.upgrade(t);
			let r = this.upgradeText(t);
			s?.loot(r, e === "core" ? "core" : "upgrade"), this.ui.hud.toast(this._upgradeToast(t), 2.4), this.audio.playSfx("levelup", { volume: .5 }), this.burst("levelSparkle", c.x, c.y + 1.9, c.z, 12);
		}
		return this.events.emit("pickup", e, t), !0;
	}
	_hitPlayer(e, t, n, r, i, a, o, s = "melee") {
		if (this._ambient) return;
		let c = this.pc, l = this.player.position, u = this._wards.length ? this.wardFrac : 0;
		if (i > 0) {
			let e = u > 0 ? Math.max(1, Math.round(i * (1 - u))) : i;
			if (c.hurtFlat(e), this.number(l.x, l.y + 1.9, l.z, String(e), "hurt"), this.look.pulseHurt(), u > 0 && this._wardGlint(l), this.events.emit("hit", "player", e, !1, "hazard"), !c.alive) return;
			this.events.emit("playerHurt", e);
			return;
		}
		let d = l.x - a, f = l.z - o, p = Math.hypot(d, f);
		if (p > 1e-6 ? (d /= p, f /= p) : (d = -this.player.facing.x, f = -this.player.facing.z), !(t > 0)) {
			n > 0 && c.shove(n, d, f), this.shake(Z.hurt[0] * .6, Z.hurt[1]);
			return;
		}
		let m = e && e !== "player" ? e.def?.atk ?? 10 : 10, h = .92 + .16 * this.rng.next(), g = Math.max(1, Math.round(m * t * h * jn(c.def) * (1 - u)));
		u > 0 && this._wardGlint(l);
		let _ = c.hurt({
			damage: g,
			kb: n,
			kbDirX: d,
			kbDirZ: f,
			knockdown: r
		});
		this.number(l.x, l.y + 1.9, l.z, String(g), "hurt"), this.look.pulseHurt(), this.sfxAt("hurt", l.x, l.z, { volume: 1 }), this.burst("hitSpark", l.x, l.y + 1, l.z, 6), this._hitStop(w(gp.playerHurt), "player");
		let ee = _ === "knockdown" ? Z.knockdown : Z.hurt;
		this.shake(ee[0], ee[1]), this.events.emit("hit", "player", g, !1, s), this.events.emit("playerHurt", g);
	}
	_healEnemy(e, t) {
		if (!e || !e.alive) return;
		let n = e.hp;
		e.hp = Math.min(e.hpMax, e.hp + Math.max(0, t));
		let r = Math.round(e.hp - n), i = e.position;
		r > 0 && this.number(i.x, this.bodyBase(e) + e.def.body[1] + .2, i.z, `+${r}`, "heal"), this.burst("healGlow", i.x, this.bodyBase(e) + .8, i.z, 8), e._barT = this.clock;
	}
	_wakeGroup(e) {
		let t = e.groupId, n = this.enemies;
		for (let r = 0; r < n.length; r++) {
			let i = n[r];
			i === e || !i.alive || i.isAdd || i.boss || this._hidden.has(i) || (i.groupId === t && t || !i.aggro && i.zone === e.zone && Math.hypot(i.position.x - e.position.x, i.position.z - e.position.z) <= 6 && this.los(e.position.x, e.position.z, i.position.x, i.position.z)) && i.wake(this.ctx);
		}
	}
	_enemiesNear(e, t, n, r = []) {
		r.length = 0;
		let i = this.enemies;
		for (let a = 0; a < i.length; a++) {
			let o = i[a];
			o.alive && !o.dormant && o.sprite.visible && !o.submerged && Math.hypot(o.position.x - e, o.position.z - t) <= n && r.push(o);
		}
		return r;
	}
	_spawnAdd(e, t, n, r) {
		let i = e ? this._addsOf.get(e) : null;
		if (!i) return null;
		let a = i.find((e) => e.kind === t && (this._hidden.has(e) || !e.alive && e.sprite.opacity <= .001));
		return a ? (this._hidden.delete(a), a.home.x = n, a.home.z = r, a.reset(this.ctx), a.dormant = !1, a.wake(this.ctx), this.burst("deathPoof", n, this.groundAt(n, r) + 1.2, r, 8), a) : null;
	}
	_onSignal(e, t, n) {
		if (!t) return;
		let r = t.arena;
		if (e === "bossIntro") {
			let e = !!r && this._playerInArena(r, 0);
			e ? r.close() : this._closePending = r, this._introT = Fh, this._bossFight = t, this._boss = t, this._bossAwake = !1, this._fightStart = this.clock, this._phaseStart = this._phaseSlots(t), this._phaseStart[0] = this.clock, this._phaseTimes = this._phaseSlots(t), this._bossPhaseSeen = 1, this.targeting.release();
			for (let e of this.enemies) {
				if (e === t || !e.alive || e._boss === t || this._hidden.has(e)) continue;
				let n = r?.contains ? r.contains(e.position.x, e.position.z) : !1;
				(e.aggro || n) && this._sendHome(e, n);
			}
			this.projectiles.clearEnemy(), e && this.allies.length && (this._ambient ? this._pullPending = r : this._alliesIntoArena(r));
		} else if (e === "bossAwake") this._ambient ? this._awakePending = t : this._showBoss(t, !0);
		else if (e === "bossPhase") {
			let e = Number(n) || 2;
			if (this._hitStop(w(gp.bossPhase), t), this.look.pulsePhase(), this._bossPhaseSeen = e, e >= 2 && e <= this._phaseTimes.length && (this._phaseTimes[e - 2] = this.clock - this._phaseStart[e - 2], this._phaseStart[e - 1] = this.clock), this.ui.combat?.boss.set(t.hp / t.hpMax, e), e >= 2) {
				let t = this.arenas.indexOf(r);
				t >= 0 && this._emitters[t] && (this._emitters[t].enabled = !0), this.music.setPhase(e);
			}
			e === 3 && (this._kneel = {
				boss: t,
				until: this.enemyTime + Lh,
				cap: Math.round(t.hpMax * Ih),
				taken: 0
			}), this.events.emit("bossPhase", e);
		}
	}
	_showBoss(e, t) {
		this._bossAwake = !0;
		let n = this.displayName(e), r = `combat.epithet.${e.kind}`, i = e.def.epithet ? S(r) === r ? e.def.epithet : S(r) : "", a = `combat.enemy.${e.kind}`;
		t && this.ui.banner.show(n || (S(a) === a ? e.def.name : S(a)), i, { duration: 3 }), this.ui.combat?.boss.show({
			name: n,
			epithet: i,
			phases: (e.def.phases?.length ?? 0) + 1
		}), this.ui.combat?.boss.set(e.hp / e.hpMax, Math.max(1, this._bossPhaseSeen ?? 1)), this.targeting.setBoss(e);
	}
	_phaseSlots(e) {
		let t = Math.max(1, Math.min(8, (Array.isArray(e.def.phases) ? e.def.phases.length : 2) + 1));
		return Array(t).fill(0);
	}
	_playerInArena(e, t) {
		let n = this.player.position, r = e.rect;
		return n.x >= r.minX + t && n.x <= r.maxX - t && n.z >= r.minZ + t && n.z <= r.maxZ - t && Math.abs(n.y - e.y) < 1;
	}
	_closeCheck() {
		let e = this._closePending;
		if (e) {
			if (!this._bossFight || this._bossFight.arena !== e || !this._bossFight.alive || e.active) {
				this._closePending = null;
				return;
			}
			if (this._bossFight.state === "dormant") {
				this._resetBoss();
				return;
			}
			this.pc.alive && this._playerInArena(e, cg) && (this._closePending = null, e.close(), this.allies.length && this._alliesIntoArena(e, !0));
		}
	}
	_alliesIntoArena(e, t = !1) {
		let n = this.player.position, r = this.player.facing, i = e.rect, a = 0;
		for (let e of this.allies) {
			if (e.gone || !e.member.sprite) continue;
			let o = e.position;
			if (Math.hypot(o.x - n.x, o.z - n.z) > $.arenaPull || t && o.x > i.minX + .8 && o.x < i.maxX - .8 && o.z > i.minZ + .8 && o.z < i.maxZ - .8) continue;
			let s = (a % 2 == 0 ? 1 : -1) * (.75 + .6 * Math.floor(a / 2));
			a++;
			let c = !1;
			for (let t of [
				1.4,
				.8,
				.3
			]) {
				let a = Math.min(i.maxX - .8, Math.max(i.minX + .8, n.x - r.x * t - r.z * s)), o = Math.min(i.maxZ - .8, Math.max(i.minZ + .8, n.z - r.z * t + r.x * s));
				if (this.standable(a, o)) {
					e.placeAt(a, o), c = !0;
					break;
				}
			}
			c || e.placeAt(Math.min(i.maxX - .8, Math.max(i.minX + .8, n.x)), Math.min(i.maxZ - .8, Math.max(i.minZ + .8, n.z)));
		}
	}
	_sendHome(e, t) {
		if (this._releaseToken(e), this._freeMarkersOf(e), this.projectiles.removeOwner(e), t) {
			e.reset(this.ctx);
			return;
		}
		typeof e.sendHome == "function" ? e.sendHome(this.ctx) : e.reset(this.ctx);
	}
	_bossLoot(e) {
		let t = e.position.x, n = e.position.z, r = this.player.position, i = t - r.x, a = n - r.z, o = Math.hypot(i, a);
		o > .001 && this.standable(t + i / o * 1.2, n + a / o * 1.2) && (t += i / o * 1.2, n += a / o * 1.2);
		let s = this.groundAt(t, n), c = Qp(e.uid, e.deathCount, this.seedValue), l = e.def.gold ?? [150, 150];
		this.dropGold(Math.round(l[1]), t, s, n, c);
		let u = e.def.victory, d = u?.drop === void 0 ? "core" : u.drop;
		d === "core" ? this.pickups.drop("core", 1, t, s, n, c) : (d === "maxHp" || d === "maxMp" || d === "attack") && this.pickups.drop("upgrade", 1, t, s, n, c, d);
	}
	_bossDefeated(e) {
		let t = e.position.x, n = e.position.y, r = e.position.z;
		if (this._hitStop(w(gp.bossDeath), e), this._slowMotion(.4, .4, 1.5), !e.released) {
			if (e.arena?.deathBursts) e.arena.deathBursts(e);
			else {
				for (let e = 0; e < 3; e++) this.burst("emberBurst", t + (e - 1) * .8, n + 1.2 + e * .6, r, 24);
				this.burst("sparkle", t, n + 2, r, 24);
			}
		}
		if (this.shake(Z.bossDeath[0], Z.bossDeath[1]), this.music.victory(), e.arena?.open?.(), e.released) {
			let t = this.arenas.indexOf(e.arena);
			t >= 0 && this._emitters[t] && (this._emitters[t].enabled = !1);
		}
		this.bossDefeated = !0;
		{
			let e = Math.max(0, Math.min(this._phaseTimes.length - 1, (this._bossPhaseSeen ?? 1) - 1));
			this._phaseTimes[e] = this.clock - this._phaseStart[e];
		}
		this._fightTime = this.clock - this._fightStart, this._bossFight = null, this._bossAwake = !1, this._kneel = null, this.targeting.setBoss(null);
		for (let t of this._addsOf.get(e) ?? []) t.alive && !this._hidden.has(t) && this._kill(t, e.released ? {
			loot: !1,
			release: !0
		} : { loot: !1 });
		this._dropBossMarker(e), this.events.emit("bossDefeated", e);
		let i = e.def.victory, a = i?.title ?? "combat.victory.title", o = i?.line === void 0 ? "combat.victory.sub" : i.line;
		o !== null && this._later(.4, () => this.ui.banner.show(S(a), S(o), { duration: 3.4 })), i?.results === !1 ? this._later(1.5, () => {
			let e = this._levelAfterResults;
			this._levelAfterResults = null, e && (this.ui.combat?.announcer.announce(S("combat.level.title", { n: e.level }), e.gains, {
				duration: 2.6,
				kind: "level",
				y: this._announceAt("level")
			}), this._levelUpFlare());
		}) : this._later(1.5, () => this._resultsCard()), i?.results === !1 ? this.ui.combat?.boss.hide() : this._later(2, () => this.ui.combat?.boss.hide());
	}
	_dropBossMarker(e) {
		for (let t = this._bossMarkers.length - 1; t >= 0; t--) {
			let n = this._bossMarkers[t];
			if (n.arena !== e.arena) continue;
			let r = this._map?.markers.indexOf(n) ?? -1;
			r >= 0 && this._map.markers.splice(r, 1);
		}
	}
	_resultsCard() {
		let e = Math.round(this.clock), t = `${Math.floor(e / 60)}:${String(e % 60).padStart(2, "0")}`, n = this.pc, r = [
			t,
			ke("combat.results.foes", this.kills),
			ke("combat.results.falls", n.deaths),
			ke("combat.results.dodges", n.perfectDodges),
			S("combat.results.lv", { n: n.level })
		].join(Oe());
		this.ui.combat?.announcer.announce(S("combat.results.title", { place: Ne(this.level.name) }), r, {
			duration: 7,
			kind: "results",
			y: this._announceAt("results")
		});
		let i = this._levelAfterResults;
		this._levelAfterResults = null, i && (this.ui.combat?.announcer.announce(S("combat.level.title", { n: i.level }), i.gains, {
			duration: 2.6,
			kind: "level",
			y: this._announceAt("level")
		}), this._levelUpFlare());
	}
	_announceAt(e) {
		return () => this.ui.banner?.visible ? e === "results" ? 104 : 108 : null;
	}
	_later(e, t) {
		this._timers.push({
			t: e,
			fn: t
		});
	}
	onPerfectDodge() {
		let e = this.player.position;
		this._slowMotion(1, Tn.enemyScale, Tn.time), this.number(e.x, e.y + 2.1, e.z, "Perfect!", "perfect"), this.sfxAt("perfect", e.x, e.z, { volume: 1 }), this.look.pulsePerfect(), this.burst("sparkle", e.x, e.y + 1, e.z, 10);
	}
	onLevelUp(e, t) {
		this._bossKillXp ? this._levelAfterResults = {
			level: e,
			gains: t
		} : (this.ui.combat?.announcer.announce(S("combat.level.title", { n: e }), t, {
			duration: 2.6,
			kind: "level",
			compact: this.engaged,
			y: this._announceAt("level")
		}), this._levelUpFlare());
		for (let e of this.allies) e.syncLevel(), !e.down && (e.hp = e.hpMax, e.mp = e.mpMax);
		this.events.emit("levelup", e);
	}
	_levelUpFlare() {
		let e = this.player.position;
		this.fx.play("pillar", e.x, e.y, e.z, {
			follow: e,
			duration: w(60)
		}), this.burst("levelSparkle", e.x, e.y + 1.9, e.z, 14), this.sfxAt("levelup", e.x, e.z, { volume: 1 });
	}
	refuseSkill(e) {
		this.audio.playSfx("cancel", { volume: .5 }), this.ui.combat?.hud.refuse?.(e);
	}
	onPlayerDeath() {
		let e = this.player.position;
		this._slowMotion(.3, .3, 1), this.look.startDeath(), this.sfxAt("playerDown", e.x, e.z, { volume: 1 }), this.music.death(), this.targeting.release(), this.cin.clearBuffer(), this.locksPlayer = !0, this._deathT = qn;
		for (let e of this.enemies) !e.alive || e.boss || e.isAdd || e.passive || this._hidden.has(e) || (e.aggro || e.token) && this._sendHome(e, !1);
		for (let e of this.enemies) e.target = null, e.tauntT = 0;
		for (let e of this.allies) e.onPlayerDeath();
		this.events.emit("playerDeath");
	}
	async _deathScreen() {
		let e = this.game, t = this.ui, n = this.waystones.checkpoint, r = rm(n), i = ++this._deathGen;
		e.busy = !0, this._respawning = !0;
		try {
			if (e.toggleMap(!1), await t.combat.death.show({
				title: S("combat.death.title"),
				subtitle: "",
				prompt: S("combat.death.prompt", { place: r }),
				armDelay: 1
			}), e._disposed || i !== this._deathGen) return;
			if (await t.fader.fadeOut(.8), e._disposed || i !== this._deathGen) {
				t.fader.fadeIn?.(.3);
				return;
			}
			t.combat.death.hide();
			let n = this.waystones.checkpoint;
			this.resetEncounter(), this._respawnAt(n), await t.fader.fadeIn(1), t.hud.toast(S("combat.death.risen", { place: rm(n) }), 2.4);
		} finally {
			i === this._deathGen && (this._respawning = !1, e.busy = !1);
		}
	}
	_respawnAt(e) {
		let t = e.stand ?? e;
		this.game.teleport(t.x, t.z), this.pc.iframes = 2, this.pc.blink = !0, this.cin.respawnGuard = Kn, this.cin.clearBuffer(), this.locksPlayer = !1, this._deathT = -1, this.look.reset(), this.music.respawn(), this.events.emit("respawn", e.id);
	}
	afterPlayer(e, t, n = !1) {
		if (!this._ready) return;
		let r = performance.now(), i = this.game.mode === "play", a = !t && n && this._ambient;
		if (t) {
			this._playerVelocity(e), this._separation(), this.allies.length && this._allySeparation(), this._arenaClamp();
			let t = this._advanced;
			this.pickups.update(t), this._viewAxis(), this.fx.update(this._realAdvanced);
			for (let t of this.arenas) t.update(e);
			this._closePending && this._closeCheck(), this.waystones.update(e), this.chests.update(e), this._dormancy(e), this._engagement(e), this.music.update(e, this.engaged, !!this._bossFight && this._bossAwake), this.pc._applyVisuals(this._realAdvanced, this.clock), this._runTimers(e), this._deathT > 0 && !this._respawning && (this._deathT -= e, this._deathT <= 0 && this._deathScreen().catch((e) => console.error("[combat] death screen failed:", e))), this._heartbeatStep(e), this._goldFeed > 0 && this._goldFeedStep(e);
		} else if (a) {
			this._viewAxis(), this.fx.update(e);
			for (let t of this.arenas) t.update(e);
			this._engagement(e);
		}
		for (let n = 0; n < this.systems.length; n++) this.systems[n].frame?.(e, t, a);
		this.pc.refreshPose();
		for (let n = 0; n < this.allies.length; n++) this.allies[n].afterFrame(e, t, i, t ? this._realAdvanced : 0);
		for (let n of this.looks) n.update(t ? this._realAdvanced : 0, t, e, a);
		this.locksPlayer = !this.pc.alive || this._respawning || this._introT > 0, this.targeting.update(e, t), this._seeThrough(e), this._spriteSpeeds(i, t, a), this._jitterStep(), this._updateHud(t ? e : 0), this._updateLabels(), this._updateMinimap(), this.quads.update(), this.markers.update();
		let o = this.game.audioDirector;
		if (o) {
			let t = +!!this.engaged, n = o.combatIntensity ?? 0;
			o.combatIntensity = t > n ? t : Math.max(0, n - e / 3);
		}
		this._programCheck(), this._tickT += performance.now() - r, (t || a) && (this._ticks[this._tickN++ % Hh] = this._tickT), this.ambientFrame = a, this._ambient = !1;
	}
	_goldFeedStep(e) {
		this._goldFeedT -= e, this._goldFeedAge += e, !(this._goldFeedT > 0 && this._goldFeedAge < eg.most) && this._flushGoldFeed();
	}
	_flushGoldFeed() {
		let e = this._goldFeed;
		this._goldFeed = 0, this._goldFeedT = 0, this._goldFeedAge = 0, e > 0 && this.ui.combat?.hud?.loot(S("combat.loot.gold", { n: e }), "gold");
	}
	_viewAxis() {
		let e = this.engine.camera.matrixWorld.elements, t = Math.hypot(e[8], e[10]) || 1;
		this.fx.viewX = -e[8] / t, this.fx.viewZ = -e[10] / t;
	}
	_seeThrough(e) {
		for (let t = 0; t < this._bosses.length; t++) this._seeThroughBoss(this._bosses[t], e);
	}
	_seeThroughBoss(e, t) {
		if (!e || !e.alive || this._hidden.has(e)) return;
		let n = this.player.position, r = this.engine.camera.matrixWorld.elements, i = !1, a = n.x - e.position.x, o = n.z - e.position.z, s = -r[8], c = -r[10], l = Math.hypot(s, c) || 1;
		if ((a * s + o * c) / l > .05 && Math.abs(a * r[0] + o * r[2]) < e.def.radius + .4 + .3) {
			let t = this._ndc;
			this.projectNdc(e.position.x, e.position.y + e.def.body[1] + .3, e.position.z, t, 99);
			let r = t.y;
			this.projectNdc(e.position.x, e.position.y, e.position.z, t, 99);
			let a = t.y;
			this.projectNdc(n.x, n.y + .4, n.z, t, 99);
			let o = t.y;
			this.projectNdc(n.x, n.y + 1.4, n.z, t, 99);
			let s = t.y;
			i = Math.max(o, s) > a && Math.min(o, s) < r;
		}
		let u = i && this.pc.alive ? Wh : 1, d = e.sprite.bodyOpacity, f = d + (u - d) * Math.min(1, t * 12);
		Math.abs(f - u) < .01 && (f = u), f !== d && (e.sprite.bodyOpacity = f);
	}
	_playerVelocity(e) {
		let t = this.player.position, n = this._pv.velocity;
		e > 0 && (n.x = (t.x - this._prevPos.x) / e, n.z = (t.z - this._prevPos.z) / e), this._prevPos.copy(t);
	}
	_separation() {
		let e = this._act ??= [];
		e.length = 0;
		for (let t of this.enemies) t.alive && !t.dormant && t.sprite.visible && e.push(t);
		for (let t = 0; t < Uh; t++) for (let t = 0; t < e.length; t++) {
			let n = e[t];
			for (let r = t + 1; r < e.length; r++) {
				let i = e[r];
				n.flier === i.flier && this._separatePair(n, i, t, r);
			}
		}
		let t = this.pc;
		if (!t.alive || t.dodging) return;
		let n = this.player.position;
		for (let r = 0; r < e.length; r++) {
			let i = e[r];
			if (i.flier) continue;
			let a = t.radius + (i.boss ? i.radius : i.def.moveRadius ?? .3), o = n.x - i.position.x, s = n.z - i.position.z, c = Math.hypot(o, s);
			if (c >= a || Math.abs(n.y - i.position.y) > 1) continue;
			c < 1e-5 ? (o = 0, s = 1) : (o /= c, s /= c);
			let l = a - c, u = 1 / 4, d = !i.armored && !i.frozen && Number.isFinite(i.mass) && i.mass > 0 ? 1 / i.mass : 0, f = u / (u + d);
			this.player.moveBy(o * l * f, s * l * f), d > 0 && this._separateMove(i, -o * l * (1 - f), -s * l * (1 - f));
		}
	}
	_separatePair(e, t, n, r) {
		let i = (e.def.moveRadius ?? .3) + (t.def.moveRadius ?? .3), a = t.position.x - e.position.x, o = t.position.z - e.position.z, s = Math.hypot(a, o);
		if (s >= i || !e.flier && Math.abs(e.position.y - t.position.y) > 1) return;
		if (s < 1e-5) {
			let e = (n * 7 + r * 13) % 16 * (Math.PI / 8);
			a = Math.cos(e), o = Math.sin(e);
		} else a /= s, o /= s;
		let c = i - s, l = !e.frozen && Number.isFinite(e.mass) && e.mass > 0 ? 1 / e.mass : 0, u = !t.frozen && Number.isFinite(t.mass) && t.mass > 0 ? 1 / t.mass : 0;
		if (l + u <= 0) return;
		let d = l / (l + u);
		l > 0 && this._separateMove(e, -a * c * d, -o * c * d), u > 0 && this._separateMove(t, a * c * (1 - d), o * c * (1 - d));
	}
	_separateMove(e, t, n) {
		if (e.flier) this._moveFly(e, t, n);
		else {
			let r = e.blockedBy;
			this._moveGround(e, t, n), e.blockedBy = r;
		}
	}
	_arenaClamp() {
		let e = this.player.position;
		for (let t of this.arenas) t.active && this.pc.alive && t.clamp(e, .35);
		for (let e of this.allies) {
			let t = e.gone ? null : e._arena;
			t && t.active && t.clamp(e.position, .35);
		}
	}
	_allySeparation() {
		let e = this._act ?? [], t = this.allies, n = this._allySep ??= [];
		n.length = 0;
		for (let e of t) e.present && e.active && e.action !== "roll" && n.push(e);
		if (!n.length) return;
		let r = 1 / $.mass;
		for (let t = 0; t < n.length; t++) {
			let i = n[t], a = i.position;
			for (let t = 0; t < e.length; t++) {
				let n = e[t];
				if (n.flier) continue;
				let o = $.radius + (n.boss ? n.radius : n.def.moveRadius ?? .3), s = a.x - n.position.x, c = a.z - n.position.z, l = Math.hypot(s, c);
				if (l >= o || Math.abs(a.y - n.position.y) > 1) continue;
				l < 1e-5 ? (s = 0, c = 1) : (s /= l, c /= l);
				let u = o - l, d = !n.armored && !n.frozen && Number.isFinite(n.mass) && n.mass > 0 ? 1 / n.mass : 0, f = r / (r + d);
				i.push(s * u * f, c * u * f), d > 0 && this._separateMove(n, -s * u * (1 - f), -c * u * (1 - f));
			}
		}
		for (let e = 0; e < n.length; e++) for (let t = e + 1; t < n.length; t++) {
			let r = n[e].position, i = n[t].position, a = $.radius * 2, o = i.x - r.x, s = i.z - r.z, c = Math.hypot(o, s);
			if (c >= a || Math.abs(r.y - i.y) > 1) continue;
			if (c < 1e-5) {
				let n = (e * 7 + t * 13) % 16 * (Math.PI / 8);
				o = Math.cos(n), s = Math.sin(n);
			} else o /= c, s /= c;
			let l = (a - c) / 2;
			n[e].push(-o * l, -s * l), n[t].push(o * l, s * l);
		}
		let i = this.pc;
		if (!i.alive) return;
		let a = this.player.position;
		for (let e of n) {
			let t = e.position, n = $.radius + i.radius, r = t.x - a.x, o = t.z - a.z, s = Math.hypot(r, o);
			s >= n || Math.abs(t.y - a.y) > 1 || (s < 1e-5 ? (r = -this.player.facing.x, o = -this.player.facing.z) : (r /= s, o /= s), e.push(r * (n - s), o * (n - s)));
		}
	}
	_dormancy(e) {
		if (this._checkT -= e, this._checkT > 0) return;
		this._checkT = Ch;
		let t = this.player.position;
		for (let e of this.enemies) {
			if (!e.alive || this._hidden.has(e)) continue;
			let n = Math.hypot(e.position.x - t.x, e.position.z - t.z);
			!e.aggro && e.state !== "return" && n > Sh ? e.dormant || (this._releaseToken(e), e.sleep()) : e.dormant && n <= Sh && (e.dormant = !1);
		}
		for (let e of this.enemies) !e.alive && e.sprite.visible && e.sprite.opacity <= .001 && (e.sprite.visible = !1);
	}
	setEngaged(e) {
		this._engageLinger = 0, this.engaged !== !!e && (this.engaged = !!e, this.events.emit("engaged", this.engaged));
	}
	_engagement(e) {
		let t = this.player.position, n = this._bossFight, r = !!n;
		if (r && this._closePending && this._closePending === n.arena && (r = n.alive && Math.hypot(n.position.x - t.x, n.position.z - t.z) <= $n.range), !r) {
			for (let e of this.enemies) if (e.alive && e.aggro && !e.passive && !e.dormant && e.sprite.visible && Math.hypot(e.position.x - t.x, e.position.z - t.z) <= $n.range) {
				r = !0;
				break;
			}
		}
		r ? (this._engageLinger = $n.linger, this.engaged || (this.engaged = !0, this.events.emit("engaged", !0))) : this.engaged && (this._engageLinger -= e, this._engageLinger <= 0 && (this.engaged = !1, this.events.emit("engaged", !1)));
	}
	_runTimers(e) {
		let t = this._timers;
		for (let n = t.length - 1; n >= 0; n--) if (t[n].t -= e, t[n].t <= 0) {
			let e = t[n].fn;
			t.splice(n, 1), e();
		}
	}
	_heartbeatStep(e) {
		let t = this.pc;
		if (!(t.alive && t.hp < t.hpMax * jh)) {
			this._heartbeat = 0;
			return;
		}
		this._heartbeat -= e, this._heartbeat <= 0 && (this._heartbeat = Ph, this.audio.playSfx("heartbeat", { volume: .7 }));
	}
	_spriteSpeeds(e, t, n = !1) {
		let r = e ? !t || this.stop > 0 ? 0 : this.enemyScale : 1, i = this.enemies;
		for (let e = 0; e < i.length; e++) {
			let t = i[e], a = n && t.ambientRun ? 1 : r;
			a > 0 && t.statusOn && (a *= t.timeScale), t.sprite.speed = a;
		}
	}
	_jitterStep() {
		let e = this._stopVictims;
		if (!e.length) return;
		let t = this.stop > 0, n = (this.frame & 1 ? 1 : -1) / 16;
		for (let r = e.length - 1; r >= 0; r--) {
			let i = e[r], a = i === "player" ? this.player.sprite.mesh : i.sprite.mesh;
			a.position.x = t ? n : 0, t || e.splice(r, 1);
		}
	}
	refreshLegend() {
		this._ready && this._showLegend();
	}
	_showLegend() {
		let e = mp.filter((e) => !this.legendSkip.includes(e.id)).map((e) => ({
			...e,
			label: S(`combat.controls.${e.id}`)
		}));
		this.ui.hud.setControls([...e, ...this.legendExtra]);
	}
	_updateHud(e) {
		let t = this.ui.combat?.hud;
		if (!t || !this._vitals) return;
		let n = this.pc, r = this._vitals;
		r.hp = Math.ceil(n.hp), r.hpMax = n.hpMax, r.mp = Math.floor(n.mp), r.mpMax = n.mpMax, r.sp = Math.floor(n.sp), r.spMax = n.spMax, r.level = n.level, r.xp = n.xp, r.xpNext = n.xpNext, r.winded = n.winded, t.setVitals(r);
		for (let e = 0; e < 3; e++) {
			let r = n.skills[e], i = this._skillArgs[e];
			i.cooldown = n.cooldowns[e] > 0 ? n.cooldowns[e] / r.cooldown : 0, i.seconds = Math.ceil(n.cooldowns[e] - rn), i.left = Math.max(0, n.cooldowns[e]), i.locked = n.level < r.unlock, i.affordable = n.mp >= r.mp - rn, t.setSkill(e, i);
		}
		let i = this._skillArgs[3];
		i.cooldown = n.draughtCd > 0 ? n.draughtCd / Rn.cooldown : 0, i.seconds = Math.ceil(n.draughtCd - rn), i.left = Math.max(0, n.draughtCd), i.locked = !1, i.affordable = n.potions > 0, t.setSkill(3, i), t.setPotions(n.potions, 5), t.setGold(n.gold);
		let a = n.hp >= n.hpMax && n.mp >= n.mpMax - .5;
		this._calm = !this.engaged && a ? this._calm + e : 0;
		let o = this._calm >= Nh;
		o !== this._calmShown && (this._calmShown = o, t.setCalm(o));
	}
	_updateLabels() {
		let e = this.ui.combat?.labels;
		if (!e) return;
		let t = this.player.position, n = this._barCands ??= [], r = this._edgeCands ??= [];
		n.length = 0, r.length = 0;
		let i = this.targeting.lock;
		for (let e of this.enemies) {
			if (!e.alive || e.boss || !e.sprite.visible || e.dormant) continue;
			let a = Math.hypot(e.position.x - t.x, e.position.z - t.z);
			e._barD = a;
			let o = this.clock - (e._barT ?? -Infinity) < kh || e === i || e.elite && a <= Oh, s = !o && e.aggro && a <= Dh;
			if (e._barMode = o ? 1 : s ? 2 : 0, e._barMode && n.push(e), e.aggro && a <= Eh) {
				let t = e.def.body;
				this.projectNdc(e.position.x, this.bodyBase(e) + (t[0] + t[1]) / 2, e.position.z, this._ndc, .92) || r.push(e);
			}
		}
		bg(n), bg(r);
		let a = this._barOf ??= Array(wh).fill(null), o = this._barOpts ??= {
			elite: !1,
			level: 1,
			name: "",
			pip: !1
		}, s = this._barStamp = (this._barStamp ?? 0) + 1, c = Math.min(wh, n.length);
		for (let e = 0; e < c; e++) n[e]._barPick = s;
		for (let t = 0; t < wh; t++) {
			let n = a[t];
			n && n._barPick !== s && (n.barSlot = -1, a[t] = null, e.bar(t).hide());
		}
		let l = 0;
		for (let t = 0; t < c; t++) {
			let r = n[t];
			if (!(r.barSlot >= 0 && a[r.barSlot] === r)) {
				for (; a[l];) l++;
				a[l] = r, r.barSlot = l, e.bar(l).anchor(r.position, this.labelY(r)).show();
			}
		}
		for (let t = 0; t < wh; t++) {
			let n = a[t];
			n && (o.elite = n.elite, o.level = n.level, o.name = n.elite ? this.displayName(n) : "", o.pip = n._barMode === 2, e.bar(t).set(n.hp / n.hpMax, o));
		}
		let u = this._edgeOf ??= Array(Th).fill(null), d = this._edgeOpts ??= { windup: !1 };
		this._edgeCount = Math.min(Th, r.length);
		for (let t = 0; t < Th; t++) {
			let n = t < r.length ? r[t] : null, i = e.edge(t);
			if (!n) {
				u[t] && (i.hide(), u[t] = null);
				continue;
			}
			u[t] !== n && (i.anchor(n.position, this.labelY(n) * .5), i.show(), u[t] = n), d.windup = n.state === "windup", i.set(d);
		}
		this._bossFight && this._bossAwake && this.ui.combat.boss.set(this._bossFight.hp / this._bossFight.hpMax, Math.max(1, this._bossPhaseSeen ?? this._bossFight.phase ?? 1));
	}
	_updateMinimap() {
		let e = this.minimapEnemies, t = this._mmPool, n = 0;
		for (let r of this.enemies) {
			if (!r.alive || !r.aggro || r.passive || !r.sprite.visible) continue;
			n === t.length && t.push({
				x: 0,
				z: 0
			});
			let i = t[n];
			i.x = r.position.x, i.z = r.position.z, e[n++] = i;
		}
		e.length = n;
	}
	_programCheck() {
		if (!this.programsAtLoad || this._programWarned || 1) return;
		let e = this.engine.renderer.info.programs?.length ?? 0;
		e > this.programsAtLoad && (this._programWarned = !0, console.warn(`[combat] program compiled mid-game: ${this.programsAtLoad} → ${e}`));
	}
	applyLook(e) {
		if (!this._ready) return;
		let t = this.pc, n = t.alive && t.hp < t.hpMax * jh;
		this.look.apply(this._wasActive || this.ambientFrame ? e : 0, this.engaged, n);
	}
	resetEncounter({ full: e = !1 } = {}) {
		let t = this.ctx;
		for (let n of this.enemies) {
			if (n.isAdd) {
				this._hidden.has(n) || (n.reset(t), this._hideAdd(n));
				continue;
			}
			if (n.boss) {
				(n.alive || !this.bossDefeated) && n.reset(t);
				continue;
			}
			(e && this.respawn || n.alive) && n.reset(t);
		}
		for (let e of this._absent) this._hideAdd(e);
		this._resetBoss(), this._tokens.melee = 0, this._tokens.ranged = 0;
		for (let e of this.enemies) e.token = !1;
		this.projectiles.clear(), this._freeMarkersOf(null), this.fx.clear(), e || this.pickups.clear(), this.targeting.release(), this.stop = 0, this._slow = 0, this.playerScale = 1, this.enemyScale = 1, this.setEngaged(!1), this._wards.length = 0, this._releaseAsk.length = 0;
		for (let e of this.systems) e.reset?.();
		for (let e of this.looks) e.dropLights();
		let n = this.pc;
		e || (n.gold = Math.floor(n.gold * (1 - Jn)), n.revive());
		for (let e of this.enemies) e.target = null, e.tauntT = 0;
		if (this.healAllies(), !e) for (let e of this.enemies) e.swarm && e.alive && e.settle(tg);
		this._flushGoldFeed();
	}
	fallenFoes() {
		if (this.respawn) return [];
		let e = [];
		for (let t of this._members.values()) if (!t.every((e) => !e.alive)) for (let n of t) !n.alive && !n.boss && e.push(n.uid);
		return e;
	}
	markFoesFallen(e) {
		let t = new Set((Array.isArray(e) ? e : []).filter((e) => typeof e == "string"));
		if (t.size) for (let e of this._members.values()) for (let n of e) n.alive && !n.boss && t.has(n.uid) && (this.targeting.lock === n && this.targeting.release(), this._releaseToken(n), this._freeMarkersOf(n), this.projectiles.removeOwner(n), n.vanish());
	}
	releaseLock() {
		this._ready && this.targeting.release();
	}
	_resetBoss() {
		for (let e of this.arenas) e.open();
		for (let e of this._emitters ?? []) e && (e.enabled = !1);
		this._bossFight = null, this._bossAwake = !1, this._awakePending = null, this._closePending = null, this._pullPending = null, this._kneel = null, this._bossPhaseSeen = 1, this._introT = 0, this.targeting.setBoss(null), this.ui.combat?.boss.hide(), this.music.setSection("A");
	}
	restAll() {
		this.resetEncounter({ full: !0 });
		let e = this.pc;
		e.refill(), e.potions = Math.max(e.potions, er.restDraughts);
	}
	buy(e) {
		let t = wn(e);
		if (!t) return {
			ok: !1,
			reason: "item"
		};
		let n = this.pc;
		return t.once && this.purchased.has(t.id) ? {
			ok: !1,
			reason: "sold"
		} : !t.upgrade && n.potions >= 5 ? {
			ok: !1,
			reason: "full"
		} : n.gold < t.price ? {
			ok: !1,
			reason: "gold"
		} : (n.gold -= t.price, t.upgrade ? n.upgrade(t.upgrade, t.amount) : n.potions++, t.once && this.purchased.add(t.id), this.events.emit("purchase", t.name, t.price), { ok: !0 });
	}
	exportProgress() {
		let e = this.pc;
		return {
			level: e.level,
			xp: e.xp,
			gold: e.gold,
			potions: e.potions,
			upgrades: { ...e.upgrades },
			wares: [...this.purchased]
		};
	}
	importProgress(e) {
		let t = this.pc, n = (e, t, n) => Math.max(t, Math.min(n, Math.round(Number(e) || 0)));
		t.level = n(e.level, 1, 10), t.xp = n(e.xp, 0, 1e7), t.gold = n(e.gold, 0, 1e7), t.potions = n(e.potions, 0, 5);
		for (let r of [
			"maxHp",
			"maxMp",
			"attack",
			"def"
		]) t.upgrades[r] = n(e.upgrades?.[r], 0, 999);
		this.purchased = new Set((Array.isArray(e.wares) ? e.wares : []).filter((e) => typeof e == "string" && Cn.some((t) => t.id === e))), t.refill();
		for (let e of this.allies) e.syncLevel();
	}
	openedChests() {
		return this.chests.list.filter((e) => e.opened).map((e) => e.id);
	}
	markChestsOpened(e) {
		for (let t of this.chests.list) e.includes(t.id) && !t.opened && (t.opened = !0, t.it && (t.it.disabled = !0), t.prop?.open?.(!0), this.chests.discover(t));
	}
	priceOf(e) {
		return wn(e)?.price ?? null;
	}
	shopOffers() {
		let e = this.pc;
		return Cn.map((t) => {
			let n = t.once && this.purchased.has(t.id), r = n ? "sold" : !t.upgrade && e.potions >= 5 ? "full" : e.gold < t.price ? "gold" : null;
			return {
				id: t.id,
				name: t.name,
				price: t.price,
				gain: t.gain,
				once: t.once,
				upgrade: t.upgrade,
				sold: n,
				available: !r,
				reason: r,
				label: S(`combat.ware.${t.id}.name`),
				gainLabel: S(`combat.ware.${t.id}.gain`, { n: t.upgrade ? t.amount : Math.round(Sn * 100) })
			};
		});
	}
	wareLabel(e) {
		let t = wn(e);
		return t ? S(`combat.ware.${t.id}.name`) : Ne(String(e ?? ""));
	}
	rewardTutorial() {
		let e = this.tutorial;
		if (e.rewarded || !e.combo || !e.dodge) return 0;
		e.rewarded = !0;
		let t = this.pc, n = Math.max(0, Math.min(2, 5 - t.potions));
		return t.potions += n, n;
	}
	applyPresence(e, { instant: t = !1 } = {}) {
		if (this._ready) {
			for (let t of this._storyGroups) {
				let n = !!e(t);
				n === this._absentGroups.has(t) && this._setGroupPresent(t, n);
			}
			for (let t of this._storyChests) t.absent = !e(t.obj), t.it && (t.it.disabled = t.absent || t.opened);
			for (let t of this._storyStones) this.waystones.setAbsent(t, !e(t.obj));
			for (let n of this.skyDragons) n.applyPresence(!!e(n.obj), t);
		}
	}
	_setGroupPresent(e, t) {
		let n = this._members.get(e) ?? [], r = this.ctx;
		t ? this._absentGroups.delete(e) : this._absentGroups.add(e), t && e.swarm === !0 && !this._swarmPending.includes(e) && this._swarmPending.push(e);
		for (let e of n) {
			if (t) {
				this._absent.delete(e), this._hidden.delete(e), e.alive && e.reset(r), e.alive && e.boss && e.def.introOnSpawn && !this._introPending.includes(e) && this._introPending.push(e);
				continue;
			}
			this.targeting.lock === e && this.targeting.release(), e.boss && this._bossFight === e && this._resetBoss();
			for (let t of e.boss ? this._addsOf.get(e) ?? [] : []) this._hidden.has(t) || (this._sendHome(t, !0), this._hideAdd(t));
			e.alive ? this._sendHome(e, !0) : (this._freeMarkersOf(e), this.projectiles.removeOwner(e)), this.fx.stopFollowing(e.position), this._absent.add(e), this._hideAdd(e);
		}
		for (let e of n) {
			let n = e.boss ? e.arena : null;
			if (!n || n.present === t) continue;
			n.present = t;
			let r = n.rect;
			this.nav?.buildRect(r.minX - .5, r.maxX + .5, r.minZ - .5, r.maxZ + .5);
		}
	}
	defeatedGroups() {
		let e = [];
		for (let [t, n] of this._members) {
			let r = typeof t.id == "string" ? t.id : "";
			r && n.length && n.every((e) => !e.alive) && e.push(r);
		}
		return e;
	}
	markGroupsCleared(e, { released: t = null } = {}) {
		let n = new Set((Array.isArray(e) ? e : []).filter((e) => typeof e == "string"));
		if (n.size) {
			for (let [e, r] of this._members) if (n.has(e.id)) for (let n of r) n.alive && (this.targeting.lock === n && this.targeting.release(), this._releaseToken(n), this._freeMarkersOf(n), this.projectiles.removeOwner(n), n.boss && n.def.release && t?.has(e.id) ? (n.released = !0, n.hp = 0, n.die(this.ctx)) : n.vanish(), n.boss && (this.bossDefeated = !0, this._bossFight === n && this._resetBoss(), this._dropBossMarker(n)));
		}
	}
	get musicTrack() {
		return this.music?.musicTrack ?? "emberfall";
	}
	onTeleport() {
		this._ready && (this.targeting.release(), this.targeting.snap(), this._prevPos.copy(this.player.position));
	}
	onMapOpen() {
		this._ready && this.targeting.release();
	}
	state() {
		let e = this.pc, t = 0, n = 0, r = 0, i = 0, a = 0;
		for (let e of this.enemies) this._absent.has(e) && a++, !this._hidden.has(e) && (i++, e.alive && t++, e.alive && !e.dormant && n++, e.alive && e.aggro && r++);
		let o = this._boss, s = (e) => +e.toFixed(3), c = this._bossFight ? this.clock - this._fightStart : this._fightTime ?? 0, l = [...this._phaseTimes];
		if (this._bossFight) {
			let e = Math.max(0, Math.min(l.length - 1, (this._bossPhaseSeen ?? 1) - 1));
			l[e] = this.clock - this._phaseStart[e];
		}
		return {
			player: {
				hp: Math.ceil(e.hp),
				hpMax: e.hpMax,
				mp: s(e.mp),
				mpMax: e.mpMax,
				sp: s(e.sp),
				spMax: e.spMax,
				level: e.level,
				xp: e.xp,
				xpNext: e.xpNext,
				gold: e.gold,
				potions: e.potions,
				atk: e.atk,
				def: e.def,
				action: e.action,
				actionFrame: e.frame,
				invulnerable: e.invulnerable,
				combo: e.combo,
				winded: e.winded,
				lock: this.targeting.lock?.uid ?? null,
				checkpoint: this.waystones.checkpoint.id,
				kit: e.kit.id,
				cooldowns: e.cooldowns.map(s),
				deaths: e.deaths,
				perfectDodges: e.perfectDodges
			},
			engaged: this.engaged,
			time: s(this.clock),
			frame: this.frame,
			seed: this.seedValue,
			kills: this.kills,
			bossDefeated: this.bossDefeated,
			device: this.input.lastDevice,
			enemies: {
				total: i,
				alive: t,
				active: n,
				aggro: r,
				absent: a
			},
			boss: o ? {
				uid: o.uid,
				hp: Math.ceil(o.hp),
				hpMax: o.hpMax,
				phase: Math.max(o.phase || 1, this._bossFight ? this._bossPhaseSeen ?? 1 : 1),
				state: o.state,
				broken: !!o.broken,
				defeated: this.bossDefeated && !o.alive,
				fightTime: s(c),
				phaseTimes: l.map(s)
			} : null,
			projectiles: this.projectiles.count,
			markers: this.markerCount,
			pickups: this.pickups.count,
			fx: this.fx.count,
			edgeArrows: this._edgeCount ?? 0,
			tokens: {
				melee: this._tokens.melee,
				ranged: this._tokens.ranged
			},
			guards: {
				resume: this.cin.resumeGuard,
				respawn: this.cin.respawnGuard > 0
			},
			tutorial: { ...this.tutorial },
			shop: { purchased: [...this.purchased] },
			...this.allies.length ? { allies: this.allies.map((e) => e.info()) } : {},
			...this.skyDragons.length ? { sky: this.skyDragons.map((e) => e.state()) } : {},
			wardFrac: s(this.wardFrac),
			setpiece: this.setpiece,
			ambient: this.ambientFrame
		};
	}
	stats() {
		let e = Math.min(this._tickN, Hh), t = Array.from(this._ticks.subarray(0, e)).sort((e, t) => e - t), n = (n) => e ? +t[Math.min(e - 1, Math.floor(e * n))].toFixed(3) : 0;
		return {
			programs: this.engine.renderer.info.programs?.length ?? 0,
			programsAtLoad: this.programsAtLoad,
			drawCalls: this.postfx.sceneInfo.calls,
			tickMsP50: n(.5),
			tickMsP95: n(.95),
			pools: {
				fx: this.quads.count,
				markers: this.markerCount,
				projectiles: this.projectiles.count,
				pickups: this.pickups.count
			},
			nav: {
				...this.nav.stats,
				cells: this.nav.cols * this.nav.rows,
				buildMs: this.nav.buildMs
			}
		};
	}
	dispose() {
		if (this._ready) {
			this._ready = !1;
			for (let e of this.allies) e.release();
			this.allies.length = 0;
			for (let e of this.looks) e.dispose();
			this.looks.length = 0, this.ice = null, this.holy = null, this.earth = null, this.sword = null, this.bell = null, this.kitModule = null;
			for (let e of this.skyDragons) e.dispose();
			this.skyDragons.length = 0;
			try {
				this.look.restore();
			} catch {}
			this.projectiles.clear(), this.pickups.clear(), this.fx.clear();
			for (let e of this.actorSprites) this.spriteManager.remove(e), e.dispose();
			this.actorSprites.length = 0, this.enemies.length = 0;
			for (let e of this._emitters ?? []) e?.dispose?.();
			for (let e of this.systems) e.dispose?.();
			this.systems.length = 0, this._warmth.length = 0, this.particles.releaseBurstPools(this._ownPools), this._ownPools = [], this.quads.dispose(), this.markers.dispose(), this.atlas.texture.dispose();
			for (let e of this.sheets.values()) e.dispose?.();
			this.sheets.clear(), this.events.clear(), this._timers.length = 0, this._savedBindings && this.input.restoreBindings(this._savedBindings), this.input.disableMouseButtons?.(), this.ui.disableCombat?.();
		}
	}
};
function bg(e) {
	for (let t = 1; t < e.length; t++) {
		let n = e[t], r = t - 1;
		for (; r >= 0 && e[r]._barD > n._barD;) e[r + 1] = e[r], r--;
		e[r + 1] = n;
	}
}
//#endregion
export { yg as CombatSystem, w as a, Ke as c, Jm as i, Ge as l, Zm as n, Je as o, Qm as r, qe as s, Ym as t };
