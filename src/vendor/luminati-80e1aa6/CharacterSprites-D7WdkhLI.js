import { l as e, rt as t, u as n } from "./three.core-CLamN2hY.js";
import { n as r, t as i } from "./Palette-D7TB3xJk.js";
import { l as a, r as o } from "./math-Du_SWpiD.js";
import { i as s } from "./own-rp3p7qEo.js";
import { c, i as l, n as u, o as d, r as f, s as p, t as m } from "./PixelCanvas-4nLw4bNM.js";
//#region src/engine/pixel/CharacterSprites.js
var h = d(i.outline), g = "#8a7a6a", _ = /^#?([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i;
function v(e, t = g) {
	if (e == null || e === !1) return t;
	if (typeof e == "number" && Number.isFinite(e)) return `#${(e >>> 0 & 16777215).toString(16).padStart(6, "0")}`;
	if (e && e.isColor) return `#${e.getHexString()}`;
	if (Array.isArray(e) && e.length >= 3 && typeof e[0] == "number") return e;
	if (typeof e == "string") {
		let t = s(i, e);
		if (typeof t == "string") return t;
		if (Array.isArray(t)) return t[Math.floor(t.length / 2)];
		if (_.test(e.trim())) return e.trim();
		let r = s(n.NAMES, e.trim().toLowerCase());
		if (r !== void 0) return `#${r.toString(16).padStart(6, "0")}`;
	}
	return t;
}
function y(e, { base: t } = {}) {
	let n = null;
	if (Array.isArray(e) && e.length && typeof e[0] != "number" ? n = e : typeof e == "string" && Array.isArray(i[e]) && (n = i[e]), !n) {
		let t = v(e);
		return [
			-.62,
			-.3,
			0,
			.24,
			.46
		].map((e) => e === 0 ? [...d(t)] : c(t, e));
	}
	let r = n.length, a = t ?? (r >= 6 ? 3 : 2);
	a < 0 && (a = r + a);
	let o = [];
	for (let e = -2; e <= 2; e++) {
		let t = a + e;
		t < 0 ? o.push(c(n[0], -.22 * -t)) : t >= r ? o.push(c(n[r - 1], .16 * (t - r + 1))) : o.push([...d(n[t])]);
	}
	return o;
}
var b = 204;
function x(e) {
	return [
		e[0],
		e[1],
		e[2],
		b
	];
}
function S(e, t) {
	if (typeof e == "string" && Array.isArray(i[e])) {
		let n = i[e].length;
		if (t === "skin") return y(e, { base: n - 2 });
		if (t === "hair" && e === "hairBlack" || t === "hair" && e === "hairWhite" || e === "white" || e === "cream" || e === "black") return y(e, { base: 3 });
	}
	return y(e);
}
var C = {
	SKIN: 1,
	HAIR: 2,
	TOP: 3,
	BOTTOM: 4,
	ACCENT: 5,
	CAPE: 6,
	CAPEIN: 7,
	HAT: 8,
	BOOT: 9,
	METAL: 10,
	WOOD: 11,
	GOLD: 12,
	LEATHER: 13,
	EYE: 14,
	WHITE: 15,
	SHIRT: 16,
	SCARF: 17,
	BLUSH: 18,
	LINE: 19,
	BEARD: 20,
	PACK: 21,
	GEM: 22,
	STRING: 23,
	FEATHER: 24,
	BOOK: 25,
	HATBAND: 26,
	BELT: 27,
	SASH: 28,
	FUR: 29,
	FUR2: 30,
	FUR3: 31,
	BEAK: 32,
	COMB: 33,
	NOSE: 34,
	GEL: 35,
	BONE: 36,
	GLOW: 37,
	STONE: 38,
	WING: 39,
	GILT: 40,
	HOLY: 41,
	ICE: 42,
	SHIELD: 43,
	BLADE: 44,
	CREST: 45,
	HCOLLAR: 46,
	TRIM: 47,
	SLIT: 48
}, w = 49, T = null, E = null;
function D(e) {
	if (!e || typeof e != "object") return !1;
	let t = e, n = t.gear && typeof t.gear == "object" ? t.gear : null;
	return t.hat === "crown" || t.hat === "greathelm" || t.weapon === "hammer" || !!t.hoodTrim || !!n && (n.crest === "anchor" || n.crest === "plain");
}
function ee(e) {
	return (e && Array.isArray(e.objects) ? e.objects : []).some((e) => !!e && e.type === "npc" && D(e.spec));
}
function O() {
	return T ? Promise.resolve(T) : (E ??= import("./CharacterKit-Cud7DWhp.js").then((e) => {
		let t = e.createCharacterKit($t);
		return Object.assign(F, t.HATS), T = t, t;
	}, (e) => {
		throw E = null, e;
	}), E);
}
var k = class {
	constructor(e, t) {
		this.w = e, this.h = t, this.mat = new Uint8Array(e * t), this.shade = new Int8Array(e * t), this.part = new Uint16Array(e * t), this.pid = 0, this.line = null, this.lineShade = 0, this.ox = 0, this.oy = 0, this.minX = 0, this.minY = 0, this.maxX = -1, this.maxY = -1;
	}
	clear() {
		return this.mat.fill(0), this.shade.fill(0), this.part.fill(0), this.pid = 0, this;
	}
	begin(e = null, t = 0) {
		this.pid++, this.line = e, this.lineShade = t, this.minX = this.w, this.minY = this.h, this.maxX = -1, this.maxY = -1;
	}
	end() {
		let e = ne[this.line];
		if (!e || this.maxX < 0) return;
		let { w: t, h: n, mat: r, part: i, shade: a, pid: o } = this, s = [];
		for (let a = this.minY; a <= this.maxY; a++) for (let c = this.minX; c <= this.maxX; c++) {
			let l = a * t + c;
			if (i[l] === o && r[l]) for (let [l, u] of e) {
				let e = c + l, d = a + u;
				if (e < 0 || d < 0 || e >= t || d >= n) continue;
				let f = d * t + e;
				r[f] && i[f] !== o && r[f] !== C.EYE && r[f] !== C.LINE && s.push(f);
			}
		}
		for (let e of s) a[e] > this.lineShade && (a[e] = this.lineShade);
	}
	set(e, t, n, r = 2) {
		if (e = (e | 0) + this.ox, t = (t | 0) + this.oy, e < 0 || t < 0 || e >= this.w || t >= this.h) return;
		let i = t * this.w + e;
		this.mat[i] = n, this.shade[i] = r, this.part[i] = this.pid, e < this.minX && (this.minX = e), t < this.minY && (this.minY = t), e > this.maxX && (this.maxX = e), t > this.maxY && (this.maxY = t);
	}
	get(e, t) {
		return e = (e | 0) + this.ox, t = (t | 0) + this.oy, e < 0 || t < 0 || e >= this.w || t >= this.h ? 0 : this.mat[t * this.w + e];
	}
	getShade(e, t) {
		return e = (e | 0) + this.ox, t = (t | 0) + this.oy, e < 0 || t < 0 || e >= this.w || t >= this.h ? 0 : this.shade[t * this.w + e];
	}
	tone(e, t, n) {
		if (e = (e | 0) + this.ox, t = (t | 0) + this.oy, e < 0 || t < 0 || e >= this.w || t >= this.h) return;
		let r = t * this.w + e;
		this.mat[r] && (this.shade[r] = Math.max(0, Math.min(4, this.shade[r] + n)));
	}
	over(e, t, n, r) {
		this.get(e, t) && this.set(e, t, n, r);
	}
	rect(e, t, n, r, i, a = 2) {
		for (let o = t; o < t + r; o++) for (let t = e; t < e + n; t++) this.set(t, o, i, a);
	}
	hline(e, t, n, r, i = 2) {
		t < e && ([e, t] = [t, e]);
		for (let a = e; a <= t; a++) this.set(a, n, r, i);
	}
	vline(e, t, n, r, i = 2) {
		n < t && ([t, n] = [n, t]);
		for (let a = t; a <= n; a++) this.set(e, a, r, i);
	}
	line2(e, t, n, r, i, a = 2) {
		e = Math.round(e), t = Math.round(t), n = Math.round(n), r = Math.round(r);
		let o = Math.abs(n - e), s = -Math.abs(r - t), c = e < n ? 1 : -1, l = t < r ? 1 : -1, u = o + s, d = Math.max(o, -s) || 1, f = 0;
		for (; this.set(e, t, i, typeof a == "function" ? a(f / d, e, t) : a), e !== n || t !== r;) {
			let n = 2 * u;
			n >= s && (u += s, e += c), n <= o && (u += o, t += l), f++;
		}
	}
	tpl(e, t, n, r = null) {
		let i = r || e.legend, a = e.rows;
		for (let r = 0; r < a.length; r++) {
			let o = a[r];
			for (let a = 0; a < o.length; a++) {
				let s = o[a];
				if (s === "." || s === " ") continue;
				let c = i[s];
				if (c) {
					if (c === te) {
						this.erase(t + (e.ox || 0) + a, n + (e.oy || 0) + r);
						continue;
					}
					this.set(t + (e.ox || 0) + a, n + (e.oy || 0) + r, c[0], c[1]);
				}
			}
		}
	}
	erase(e, t) {
		if (e = (e | 0) + this.ox, t = (t | 0) + this.oy, e < 0 || t < 0 || e >= this.w || t >= this.h) return;
		let n = t * this.w + e;
		this.mat[n] = 0, this.part[n] = 0;
	}
}, te = Object.freeze(["erase"]), ne = {
	all: [
		[1, 0],
		[-1, 0],
		[0, 1],
		[0, -1]
	],
	below: [[0, 1]],
	above: [[0, -1]],
	sides: [[1, 0], [-1, 0]],
	belowSides: [
		[1, 0],
		[-1, 0],
		[0, 1]
	]
};
function re(e, t, n, r, i, a = !1, { outline: o = !0 } = {}) {
	let { w: s, h: c, mat: l, shade: u } = e;
	for (let e = 0; e < c; e++) for (let d = 0; d < s; d++) {
		let f = e * s + d, p = r + (a ? s - 1 - d : d), m = i + e, g = l[f];
		if (g) {
			let e = t[g] || t[C.TOP];
			n.set(p, m, e[Math.max(0, Math.min(4, u[f]))]);
		} else if (o) {
			let t = d > 0 && l[f - 1], r = d < s - 1 && l[f + 1], i = e > 0 && l[f - s], a = e < c - 1 && l[f + s];
			(t || r || i || a) && n.set(p, m, h);
		}
	}
}
var ie = {
	d: [C.SKIN, 0],
	s: [C.SKIN, 1],
	m: [C.SKIN, 2],
	l: [C.SKIN, 3],
	L: [C.SKIN, 4]
}, A = {
	1: [C.HAIR, 0],
	2: [C.HAIR, 1],
	3: [C.HAIR, 2],
	4: [C.HAIR, 3],
	5: [C.HAIR, 4],
	x: te
}, j = {
	1: [C.BEARD, 0],
	2: [C.BEARD, 1],
	3: [C.BEARD, 2],
	4: [C.BEARD, 3],
	5: [C.BEARD, 4],
	s: [C.SKIN, 1]
}, M = {
	1: [C.HAT, 0],
	2: [C.HAT, 1],
	3: [C.HAT, 2],
	4: [C.HAT, 3],
	5: [C.HAT, 4],
	a: [C.HATBAND, 0],
	b: [C.HATBAND, 1],
	c: [C.HATBAND, 2],
	d: [C.HATBAND, 3],
	g: [C.GOLD, 1],
	G: [C.GOLD, 3],
	h: [C.GOLD, 4],
	j: [C.GEM, 2],
	J: [C.GEM, 4],
	f: [C.FEATHER, 1],
	F: [C.FEATHER, 3],
	e: [C.FEATHER, 4],
	k: [C.HAT, 0],
	x: te,
	m: [C.SKIN, 2],
	s: [C.SKIN, 1],
	S: [C.SKIN, 0],
	9: [C.HAIR, 2],
	8: [C.HAIR, 1]
}, N = (e, t, n = 0, r = 0) => ({
	rows: e,
	legend: t,
	ox: n,
	oy: r
}), ae = {
	down: N([
		"............",
		"...mmmmmm...",
		"..mmmmmmmm..",
		".mmmmmmmmmm.",
		".mmmmmmmmms.",
		"smmmmmmmmmss",
		"smmmmmmmmmss",
		".mmmmmmmmms.",
		".lmmmmmmmss.",
		"..mmmmmmss..",
		"...mmssss..."
	], ie),
	side: N([
		"............",
		"....mmmmmm..",
		"..mmmmmmmmm.",
		".mmmmmmmmmmm",
		".mmmmmmmmmms",
		".mmmmmmmmmss",
		".mmmmmmmmmss",
		"mmmmmmmmmss.",
		".mmmmmmmss..",
		"..mmmmsss...",
		"...mss......"
	], ie),
	up: N([
		"............",
		"...mmmmmm...",
		"..mmmmmmmm..",
		".mmmmmmmmmm.",
		".mmmmmmmmms.",
		"smmmmmmmmmss",
		"smmmmmmmmmss",
		".mmmmmmmmms.",
		"..mmmmmmss..",
		"...smmmss...",
		"....ssss...."
	], ie)
}, P = {
	short: {
		down: { front: N([
			".....3443.....",
			"...33444433...",
			"..3345544333..",
			".334554433322.",
			".344433333222.",
			".333233233322.",
			".33.33.23..22.",
			".32........22.",
			".2..........1."
		], A, -1, -1) },
		side: { front: N([
			".....33443....",
			"...334444433..",
			"..33455443332.",
			".3445543333322",
			".3443333333222",
			".33.3.33333222",
			".3......333222",
			"........332221",
			"........33221.",
			".........221.."
		], A, -1, -1) },
		up: { front: N([
			".....3443.....",
			"...33444433...",
			"..3345544333..",
			".334554433322.",
			".344443333322.",
			".343343333222.",
			".333332333222.",
			".233333323221.",
			".223333332221.",
			"..2223332221..",
			"...22222211..."
		], A, -1, -1) }
	},
	spiky: {
		down: { front: N([
			"...3.....4....",
			"...43..3.43...",
			"..3443344433..",
			".3344554443322",
			"3334554433322.",
			".334433333322.",
			".3343332333222",
			".33.33.23.322.",
			".32...3....2..",
			".2..........1."
		], A, -1, -2) },
		side: { front: N([
			".....3.4......",
			"....343433.3..",
			"...334444333..",
			"..33455443332.",
			".3345543333322",
			".3343333332222",
			".33.3.33332222",
			".3......333222",
			"........332221",
			"........33221.",
			".........221.."
		], A, -1, -2) },
		up: { front: N([
			"...3.....3....",
			"...33..3.33...",
			"..3343334333..",
			".3334443333322",
			"3333443333322.",
			".334433333222.",
			".343343333222.",
			".333332333222.",
			".233333323221.",
			".223333332221.",
			"..2223332221..",
			"...22222211..."
		], A, -1, -2) }
	},
	long: {
		down: {
			swayFrom: 12,
			front: N([
				".....3443.....",
				"...33444433...",
				"..3345544333..",
				".334554433322.",
				".3444433.3222.",
				".34433.3..322.",
				"3343.......322",
				"343.........22",
				"343.........21",
				"33..........21",
				"343........321",
				"343........221",
				".33........22.",
				".32........21.",
				"..2........1.."
			], A, -1, -1),
			back: N([
				".333333333322.",
				".333333333322.",
				".233333333221.",
				"..2222222221.."
			], A, -1, 9)
		},
		side: {
			swayFrom: 11,
			front: N([
				".....33443....",
				"...334444433..",
				"..33455443332.",
				".3445543333322",
				".3443333333222",
				".33.3.33433222",
				".3.....3433222",
				".......3433221",
				".......3333221",
				".......3332221",
				".......3332221",
				".......3332221",
				".......233221.",
				"........2321..",
				"........221..."
			], A, -1, -1)
		},
		up: {
			swayFrom: 12,
			front: N([
				".....3443.....",
				"...33444433...",
				"..3345544333..",
				".334554433322.",
				".344443333322.",
				".344343333222.",
				"33433323332221",
				"34433323332221",
				"34333323332221",
				"33433323322221",
				"33433233322221",
				"33333233322221",
				".2333233322211",
				".233223232221.",
				"..22.22.221..."
			], A, -1, -1)
		}
	},
	ponytail: {
		down: { front: N([
			".....3443.....",
			"...33444433...",
			"..3345544333..",
			".334554433322.",
			".344433333222.",
			".33.3.32..222.",
			".3..........2.",
			".2..........1."
		], A, -1, -1) },
		side: { front: N([
			".....33443....",
			"...334444433..",
			"..33455443332.",
			".3445543333322",
			".3443333333222",
			".3..3.3333222.",
			".3......3322..",
			"........322..."
		], A, -1, -1) },
		up: { front: N([
			".....3443.....",
			"...33444433...",
			"..3345544333..",
			".334554433322.",
			".344443333322.",
			".343343333222.",
			".233332333221.",
			"..2333323221..",
			"...22333221..."
		], A, -1, -1) }
	},
	bun: {
		down: { front: N([
			".....3443.....",
			"....345542....",
			"...33244233...",
			"..3345544333..",
			".334554433322.",
			".344433333222.",
			".3332333.3322.",
			".3..3.....2...",
			".2..........1."
		], A, -1, -2) },
		side: { front: N([
			"............343.",
			".....33443324543",
			"...3344444334332",
			"..3345544333222.",
			".3445543333322..",
			".3443333333222..",
			".33.3.3333222...",
			".3......3322....",
			"........322....."
		], A, -1, -2) },
		up: { front: N([
			"....345543....",
			"....344432....",
			"....233322....",
			"..3344433332..",
			".334454333322.",
			".344433333222.",
			".333333323222.",
			".233332333221.",
			"..2333323221..",
			"...22333221..."
		], A, -1, -2) }
	},
	bald: {
		down: { front: N([
			".4..........3.",
			".43........32.",
			".33........22.",
			".32........21.",
			".2..........1."
		], A, -1, 3) },
		side: { front: N([
			".........332.",
			"........33221",
			"........3222.",
			".........21.."
		], A, -1, 5) },
		up: { front: N([
			".4..........3.",
			".43........32.",
			".343333333322.",
			".233332333221.",
			"..2223332221..",
			"...22222211..."
		], A, -1, 3) }
	}
}, oe = {
	full: {
		down: N([
			".3........2.",
			".34.4433.32.",
			".3445ss5432.",
			"..44433332..",
			"..34433322..",
			"...343322...",
			"....3322....",
			".....21....."
		], {
			...j,
			s: [C.BEARD, 0]
		}, 0, 6),
		side: N([
			".....2......",
			".44..32.....",
			".4433332....",
			".344332.....",
			".34433......",
			"..3432......",
			"..332.......",
			"...2........"
		], j, 0, 7)
	},
	mustache: {
		down: N(["...443342...", "...3.22.2..."], j, 0, 8),
		side: N(["443.........", ".3.........."], j, 0, 8)
	},
	goatee: {
		down: N(["....4432....", ".....32....."], j, 0, 9),
		side: N([".44.........", ".32........."], j, 0, 9)
	}
}, F = {
	hood: {
		down: N([
			"......44......",
			"....344332....",
			"...34444332...",
			"..3445433322..",
			".344333333322.",
			".3431111111222",
			".341........22",
			"342.........22",
			"342.........21",
			"332.........21",
			"332.........21",
			"3321.......221",
			"33321.....2221",
			".333222222222."
		], M, -1, -2),
		side: N([
			".......444....",
			".....3443332..",
			"...344443332..",
			"..34544333322.",
			"..34433333322.",
			".3431113333222",
			".3..1..3333222",
			".3.....3333222",
			".......3332222",
			".......3332221",
			".......3332221",
			"......23332221",
			".....233332221",
			"....2333332221"
		], M, -1, -2),
		up: N([
			"......44......",
			"....344332....",
			"...34444332...",
			"..3445433322..",
			".344333333322.",
			".3443333333222",
			".3433333333222",
			"33433333323222",
			"33333333323222",
			"33333333323221",
			"33333333323221",
			"33233333232221",
			"32233333232221",
			".222222222221."
		], M, -1, -2)
	},
	wide: {
		down: N([
			"......34433.......",
			".....3444433......",
			"....aabbbbcca.....",
			"..3344444443332...",
			"3344444433333322..",
			".22222222222221..."
		], M, -3, -2),
		side: N([
			".....34433........",
			"....3444433.......",
			"...aabbbbcca......",
			".334444444333322..",
			"334444443333332221",
			".2222222222222211."
		], M, -3, -2),
		up: N([
			"......33332.......",
			".....3443332......",
			"....aabbbbcca.....",
			"..3344443333322...",
			"3344443333333222..",
			".22222222222221..."
		], M, -3, -2)
	},
	cap: {
		down: N([
			".....33333...eF...",
			"...3344443332fF...",
			"..33445443333322..",
			"..3444433333332...",
			"..aabbbbbbbbca...."
		], M, -3, -2),
		side: N([
			".....33333..eF....",
			"...33444433fF.....",
			"..3445443333332...",
			"..34443333333322..",
			"..abbbbbbbbba2...."
		], M, -3, -2),
		up: N([
			".....33333....eF..",
			"...3344433332fF...",
			"..33443333333322..",
			"..3443333333332...",
			"..aabbbbbbbbca...."
		], M, -3, -2)
	},
	helmet: {
		down: N([
			"....GhGGgg....",
			"...33445332...",
			"..3445543322..",
			".334544333222.",
			".344443333222.",
			"dccccccccccbba",
			".2.....g....2.",
			".2..........2.",
			".1..........1."
		], {
			...M,
			1: [C.METAL, 0],
			2: [C.METAL, 1],
			3: [C.METAL, 2],
			4: [C.METAL, 3],
			5: [C.METAL, 4],
			a: [C.METAL, 0],
			b: [C.METAL, 1],
			c: [C.METAL, 2],
			d: [C.METAL, 3]
		}, -1, -2),
		side: N([
			".....GhGgg....",
			"....3344533...",
			"...34455333...",
			"..3445433332..",
			"..34443333322.",
			".dccccccccbbba",
			".........22222",
			".........2322.",
			".........122.."
		], {
			...M,
			1: [C.METAL, 0],
			2: [C.METAL, 1],
			3: [C.METAL, 2],
			4: [C.METAL, 3],
			5: [C.METAL, 4],
			a: [C.METAL, 0],
			b: [C.METAL, 1],
			c: [C.METAL, 2],
			d: [C.METAL, 3]
		}, -1, -2),
		up: N([
			"....GhGGgg....",
			"...33445332...",
			"..3445433322..",
			".334433333222.",
			".343333333222.",
			"dccccccccccbba",
			".2222222222222",
			".2333333333322",
			".1222222222211"
		], {
			...M,
			1: [C.METAL, 0],
			2: [C.METAL, 1],
			3: [C.METAL, 2],
			4: [C.METAL, 3],
			5: [C.METAL, 4],
			a: [C.METAL, 0],
			b: [C.METAL, 1],
			c: [C.METAL, 2],
			d: [C.METAL, 3]
		}, -1, -2)
	},
	circlet: {
		down: N([".GGGGhjgggg."], M, 0, 3),
		side: N([".GGhGggggg.."], M, 0, 3),
		up: N([".ggggggggGg."], M, 0, 3)
	}
}, I = {
	traveler: {
		skin: "skinLight",
		hair: "hairBrown",
		hairStyle: "short",
		outfit: {
			top: "#2f9a92",
			bottom: "#4a4a5e",
			accent: "wood",
			style: "tunic",
			shirt: "cream"
		},
		cape: {
			color: "#a0703f",
			style: "cloak",
			lining: "#5a3a2a"
		},
		hat: "none",
		weapon: "none",
		beard: !1,
		gear: {
			satchel: !0,
			boots: "#4a3428",
			leather: "#6a4428"
		},
		eyes: "green"
	},
	swordsman: {
		skin: "skinTan",
		hair: "hairBlack",
		hairStyle: "spiky",
		outfit: {
			top: "#39445e",
			bottom: "brown",
			accent: "metal",
			style: "tunic",
			shirt: "cream"
		},
		cape: !1,
		hat: "none",
		weapon: "sword",
		beard: !1,
		gear: {
			scarf: "red",
			pauldrons: !0,
			bracers: !0,
			boots: "black"
		},
		eyes: "brown"
	},
	merchant: {
		skin: "skinLight",
		hair: "hairRed",
		hairStyle: "short",
		outfit: {
			top: "green",
			bottom: "#6b4a34",
			accent: "gold",
			style: "vest",
			shirt: "cream"
		},
		cape: !1,
		hat: "wide",
		hatColor: "#7a5a3c",
		hatBand: "red",
		weapon: "none",
		beard: "mustache",
		gear: {
			pack: !0,
			boots: "brown"
		},
		build: "stout",
		eyes: "brown"
	},
	cleric: {
		skin: "skinLight",
		hair: "hairBlonde",
		hairStyle: "long",
		outfit: {
			top: "white",
			bottom: "white",
			accent: "blue",
			style: "robe",
			shirt: "white"
		},
		cape: !1,
		hat: "circlet",
		weapon: "staff",
		beard: !1,
		gear: {
			boots: "cream",
			sash: "gold",
			staffGem: "blue"
		},
		eyes: "blue",
		blush: !0
	},
	scholar: {
		skin: "skinLight",
		hair: "hairWhite",
		hairStyle: "short",
		outfit: {
			top: "purple",
			bottom: "purple",
			accent: "gold",
			style: "robe",
			shirt: "cream"
		},
		cape: !1,
		hat: "none",
		weapon: "none",
		beard: "goatee",
		gear: {
			glasses: !0,
			book: !0,
			boots: "brown"
		},
		eyes: "blue"
	},
	dancer: {
		skin: "skinTan",
		hair: "hairBlack",
		hairStyle: "ponytail",
		outfit: {
			top: "red",
			bottom: "red",
			accent: "gold",
			style: "dancer",
			shirt: "gold"
		},
		cape: !1,
		hat: "circlet",
		weapon: "none",
		beard: !1,
		gear: {
			sashes: !0,
			boots: "gold"
		},
		eyes: "brown",
		blush: !0,
		female: !0
	},
	hunter: {
		skin: "skinTan",
		hair: "hairBlonde",
		hairStyle: "short",
		outfit: {
			top: "#7a5a38",
			bottom: "#3f4a36",
			accent: "brown",
			style: "tunic",
			shirt: "cream"
		},
		cape: {
			color: "#3f7a3c",
			style: "short",
			lining: "#2b4a2c"
		},
		hat: "hood",
		hatColor: "#3f7a3c",
		weapon: "bow",
		beard: !1,
		gear: {
			quiver: !0,
			boots: "brown",
			gloves: "brown"
		},
		eyes: "green"
	},
	villager: {
		skin: "skinLight",
		hair: "hairBrown",
		hairStyle: "short",
		outfit: {
			top: "cream",
			bottom: "#5a6b82",
			accent: "brown",
			style: "tunic",
			shirt: "cream"
		},
		cape: !1,
		hat: "none",
		weapon: "none",
		beard: !1,
		gear: { boots: "brown" },
		eyes: "brown"
	},
	farmer: {
		skin: "skinTan",
		hair: "hairBrown",
		hairStyle: "short",
		outfit: {
			top: "#c9b48a",
			bottom: "#3f5f88",
			accent: "gold",
			style: "overalls",
			shirt: "#c9b48a"
		},
		cape: !1,
		hat: "wide",
		hatColor: "thatch",
		hatBand: "red",
		weapon: "none",
		beard: !1,
		gear: { boots: "brown" },
		eyes: "brown"
	},
	elder: {
		skin: "skinLight",
		hair: "hairWhite",
		hairStyle: "bald",
		outfit: {
			top: "#7a6a5a",
			bottom: "#5c4d3f",
			accent: "brown",
			style: "robe",
			shirt: "cream"
		},
		cape: !1,
		hat: "none",
		weapon: "cane",
		beard: "full",
		gear: {
			boots: "brown",
			sash: "red"
		},
		build: "elder",
		eyes: "brown"
	},
	child: {
		skin: "skinLight",
		hair: "hairBlonde",
		hairStyle: "ponytail",
		outfit: {
			top: "#d9776a",
			bottom: "#5a6b82",
			accent: "cream",
			style: "tunic",
			shirt: "cream"
		},
		cape: !1,
		hat: "none",
		weapon: "none",
		beard: !1,
		gear: { boots: "brown" },
		build: "child",
		eyes: "blue",
		blush: !0
	},
	guard: {
		skin: "skinLight",
		hair: "hairBrown",
		hairStyle: "short",
		outfit: {
			top: "blue",
			bottom: "#4a4450",
			accent: "gold",
			style: "tabard",
			shirt: "metal"
		},
		cape: !1,
		hat: "helmet",
		weapon: "spear",
		beard: !1,
		gear: {
			pauldrons: !0,
			boots: "black",
			gloves: "brown"
		},
		eyes: "brown"
	},
	innkeeper: {
		skin: "skinLight",
		hair: "hairBrown",
		hairStyle: "bun",
		outfit: {
			top: "#a8563f",
			bottom: "#6e3a3a",
			accent: "white",
			style: "dress",
			shirt: "cream"
		},
		cape: !1,
		hat: "none",
		weapon: "none",
		beard: !1,
		gear: {
			apron: "cream",
			boots: "brown"
		},
		eyes: "brown",
		blush: !0,
		female: !0
	},
	bard: {
		skin: "skinLight",
		hair: "hairBlonde",
		hairStyle: "short",
		outfit: {
			top: "#3d5fb4",
			bottom: "#5a3a24",
			accent: "gold",
			style: "tunic",
			shirt: "cream"
		},
		cape: {
			color: "#8c2330",
			style: "short",
			lining: "#5a1420"
		},
		hat: "cap",
		hatColor: "red",
		hatBand: "gold",
		feather: "white",
		weapon: "lute",
		beard: !1,
		gear: { boots: "brown" },
		eyes: "blue"
	}
}, L = {
	brown: "#5a3a2a",
	blue: "#3a5ab0",
	green: "#3a7a4a",
	grey: "#5a6070",
	violet: "#6a3a8a",
	gold: "#a8781d"
}, se = [
	"cream",
	"brown",
	"green",
	"blue",
	"red",
	"purple",
	"#5a6b82",
	"#8a6a4a",
	"#6e3a3a",
	"#3f5f5a",
	"#a8563f",
	"#c9b48a",
	"#4a4450"
], ce = [
	"hairBrown",
	"hairBrown",
	"hairBlonde",
	"hairBlack",
	"hairRed",
	"hairWhite"
];
function le(e, t) {
	let n = new o(t), r = {
		preset: "villager",
		...e
	}, i = e.female ?? n.chance(.5);
	r.female = i, r.skin ??= n.pick([
		"skinLight",
		"skinLight",
		"skinTan",
		"skinDark"
	]), r.hair ??= n.pick(ce), r.hairStyle ??= i ? n.pick([
		"long",
		"ponytail",
		"bun",
		"short"
	]) : n.pick([
		"short",
		"short",
		"spiky",
		"bald"
	]);
	let a = n.pick(se), s = n.pick(se);
	return s === a && (s = "brown"), r.outfit = {
		top: a,
		bottom: s,
		accent: n.pick([
			"brown",
			"gold",
			"cream",
			"red"
		]),
		style: i ? n.pick([
			"dress",
			"dress",
			"tunic"
		]) : n.pick([
			"tunic",
			"tunic",
			"vest",
			"overalls"
		]),
		shirt: "cream",
		...e.outfit || {}
	}, r.hat ??= n.pick([
		"none",
		"none",
		"none",
		"cap",
		"wide"
	]), r.hat === "cap" && (r.hatColor ??= n.pick(se)), r.hat === "wide" && (r.hatColor ??= n.pick(["thatch", "#7a5a3c"])), r.beard ??= !i && r.hairStyle !== "long" && n.chance(.3) ? n.pick([
		"full",
		"mustache",
		"goatee"
	]) : !1, r.blush ??= i && n.chance(.6), r.eyes ??= n.pick(Object.keys(L)), r.gear = {
		boots: n.pick([
			"brown",
			"black",
			"#5a3a24"
		]),
		apron: r.outfit.style === "dress" && n.chance(.5) ? "cream" : void 0,
		...e.gear || {}
	}, r.gear.apron || delete r.gear.apron, r.cape ??= !1, r.weapon ??= "none", r;
}
function ue(e) {
	if (!e || typeof e != "object") return {};
	let t = {};
	for (let [n, r] of Object.entries(e)) r !== void 0 && (t[n] = (n === "outfit" || n === "gear") && r && typeof r == "object" ? ue(r) : r);
	return t;
}
function de(e) {
	if (typeof e == "string") return a(e);
	let t = Number(e);
	return Number.isFinite(t) ? t >>> 0 : 1;
}
function fe(e = {}) {
	if (typeof e == "string" && (e = { preset: e }), e = ue(e), e.seed !== void 0 && (e.seed = de(e.seed)), e.randomize || e.preset === "random") {
		let t = e.seed ?? 1, { randomize: n, ...r } = e;
		e = le({
			...r,
			preset: e.preset === "random" ? "villager" : e.preset ?? "villager"
		}, t), e.seed = t, e._random = !0;
	}
	let t = typeof e.preset == "string" && Object.hasOwn(I, e.preset), n = t ? e.preset : String(e.preset ?? "villager"), r = e._random ? {
		...I.villager,
		gear: {}
	} : t ? I[n] : I.villager, i = {
		...r,
		...e,
		outfit: {
			...r.outfit,
			...e.outfit || {}
		},
		gear: {
			...r.gear,
			...e.gear || {}
		}
	};
	i.preset = n, i.seed = e.seed ?? a(String(n)), e.seed !== void 0 && !e._random && (i.jitter = {
		top: !(e.outfit && e.outfit.top),
		bottom: !(e.outfit && e.outfit.bottom),
		hair: e.hair === void 0,
		eyes: e.eyes === void 0
	});
	let o = e.cape === void 0 ? r.cape : e.cape;
	if (o = o === !0 ? {
		color: r.cape?.color ?? "brown",
		style: r.cape?.style ?? "cape"
	} : typeof o == "string" && o !== "none" || typeof o == "number" || o && o.isColor ? {
		color: o,
		style: r.cape && r.cape.style || "cape"
	} : !o || o === "none" ? null : {
		...r.cape || {},
		...o
	}, i.cape = o, !T && D(i)) throw Error(`createCharacterSheet: "${i.preset}" needs CharacterKit.js (loadCharacterKit)`);
	i.hat = typeof i.hat == "string" && Object.hasOwn(F, i.hat) ? i.hat : "none", i.weapon = i.weapon || "none";
	let s = i.beard;
	return s === !0 && (s = "full"), s === "none" && (s = null), (typeof s == "string" && !Object.hasOwn(oe, s) || typeof s == "number" || s && s.isColor) && (i.beardColor = i.beardColor ?? s, s = "full"), i.beard = s || null, i.hairStyle = typeof i.hairStyle == "string" && Object.hasOwn(P, i.hairStyle) ? i.hairStyle : "short", i.build = i.build || "normal", i.rig = pe(i.build), i;
}
function pe(e) {
	if (e === "child") return {
		cx: 16,
		ground: 30,
		headY: 11,
		torsoTop: 22,
		waist: 25,
		hem: 27,
		hip: 26,
		robeHem: 29,
		armTop: 23,
		armLen: 2,
		half: 3,
		legW: 2,
		legGap: 1,
		bootH: 1,
		child: !0
	};
	let t = {
		cx: 16,
		ground: 30,
		headY: 4,
		torsoTop: 15,
		waist: 21,
		hem: 24,
		hip: 24,
		robeHem: 28,
		armTop: 16,
		armLen: 5,
		half: 4,
		legW: 3,
		legGap: 2,
		bootH: 2,
		child: !1
	};
	return e === "stout" && (t.half = 5), e === "elder" && (t.headY = 5, t.torsoTop = 16, t.armTop = 17, t.armLen = 4), t;
}
function me(e) {
	let t = Array(w).fill(null), n = new o(e.seed), r = (e, n, r) => {
		t[e] = S(n, r);
	}, i = (e, t) => e === !0 || e === !1 || e == null || e === "" ? t : e;
	if (r(C.SKIN, e.skin || "skinLight", "skin"), r(C.HAIR, e.hair || "hairBrown", "hair"), r(C.BEARD, e.beardColor || e.hair || "hairBrown", "hair"), r(C.TOP, e.outfit.top || "cream"), r(C.BOTTOM, e.outfit.bottom || "brown"), r(C.ACCENT, e.outfit.accent || "gold"), r(C.SHIRT, e.outfit.shirt || "cream"), r(C.CAPE, i(e.cape?.color, "brown")), t[C.CAPEIN] = e.cape?.lining ? S(e.cape.lining) : t[C.CAPE].map((e) => c(e, -.25)), r(C.HAT, e.hatColor || (e.hat === "hood" ? e.cape?.color || "green" : T && T.HAT_COLORS[e.hat] || "brown")), r(C.HATBAND, e.hatBand || e.outfit.accent || "red"), r(C.BOOT, i(e.gear.boots, "brown")), r(C.METAL, "metal"), r(C.WOOD, "wood"), r(C.GOLD, "gold"), r(C.LEATHER, i(e.gear.leather, "brown")), r(C.WHITE, i(e.gear.apron, e.gear.apron === !0 ? "cream" : "white")), r(C.SCARF, i(e.gear.scarf, "red")), r(C.PACK, i(e.gear.packColor, "#b09a70")), r(C.GEM, i(e.gear.staffGem, "blue")), r(C.STRING, "cream"), r(C.FEATHER, i(e.feather, "white")), r(C.BOOK, i(e.gear.bookColor, "red")), r(C.BELT, i(e.gear.belt, "brown")), r(C.SASH, i(e.gear.sash, i(e.outfit.accent, "gold"))), r(C.BONE, i(e.gear.beads, "#d8ccae")), r(C.GEL, "#4fbf5f"), e.gear.gemGlow && (t[C.GEM] = t[C.GEM].map(x)), t[C.BLADE] = e.gear.bladeGlow ? t[C.METAL].map(x) : t[C.METAL], t[C.CREST] = e.gear.crestGlow ? t[C.GOLD].map(x) : t[C.GOLD], t[C.GILT] = y([
		"#3e2a14",
		"#6e4c20",
		"#a87a34",
		"#d6aa56",
		"#f6d98a"
	]), t[C.HOLY] = y([
		"#b07a1c",
		"#e8b23a",
		"#ffd968",
		"#fff0b0",
		"#fffbe8"
	]).map(x), t[C.ICE] = y([
		"#2c5c96",
		"#4f94d2",
		"#86c8f2",
		"#c4ecff",
		"#f4fdff"
	]).map(x), r(C.SHIELD, i(e.gear.shield, "#2c4f86")), t[C.LINE] = [
		h,
		h,
		h,
		h,
		h
	], e.jitter) {
		let n = new o(e.seed ^ 1540483477), r = (e, t, n, r = 1) => e.map((e) => {
			let [i, a, o] = p(e);
			return [...u([
				i + t,
				Math.min(1, a * r),
				Math.max(0, Math.min(1, o + n))
			]), e[3] ?? 255];
		});
		e.jitter.top && (t[C.TOP] = r(t[C.TOP], n.range(-14, 14), n.range(-.05, .05), n.range(.85, 1.1))), e.jitter.bottom && (t[C.BOTTOM] = r(t[C.BOTTOM], n.range(-12, 12), n.range(-.05, .04))), e.jitter.hair && (t[C.HAIR] = r(t[C.HAIR], n.range(-6, 6), n.range(-.04, .04))), e.jitter.eyes && (e.eyes = n.pick(Object.keys(L)));
	}
	let a = t[C.SKIN];
	t[C.BLUSH] = [
		0,
		1,
		2,
		3,
		4
	].map(() => l(a[2], "#e0607a", .35));
	let f = v(s(L, e.eyes) || e.eyes || n.pick(Object.values(L)), L.brown), m = l(h, f, .25);
	t[C.EYE] = [
		h,
		m,
		[...d(f)],
		c(f, .3),
		[
			255,
			255,
			255,
			255
		]
	], T && T.ramps(e, t, m, f);
	for (let e = 0; e < w; e++) t[e] || (t[e] = t[C.TOP]);
	return t;
}
var R = [
	{
		key: "idle0",
		bob: 0,
		br: 0,
		walk: -1
	},
	{
		key: "idle1",
		bob: 0,
		br: 1,
		walk: -1
	},
	{
		key: "walk0",
		bob: 0,
		br: 0,
		walk: 0
	},
	{
		key: "walk1",
		bob: -1,
		br: 0,
		walk: 1
	},
	{
		key: "walk2",
		bob: 0,
		br: 0,
		walk: 2
	},
	{
		key: "walk3",
		bob: -1,
		br: 0,
		walk: 3
	}
];
function z(e) {
	if (e.lag) return e.lag;
	if (e.walk < 0) return {
		dy: e.br ? -1 : 0,
		sway: 0,
		trail: 0
	};
	let t = (e.walk + 3) % 4;
	return {
		dy: (t === 1 || t === 3 ? -1 : 0) - e.bob,
		sway: [
			1,
			0,
			-1,
			0
		][t],
		trail: e.walk === 1 || e.walk === 3 ? 2 : 1
	};
}
function B(e, t) {
	return t <= 1 ? 2 : e === 0 ? 3 : e === t - 1 ? 1 : 2;
}
function he(e, t, n, r) {
	let i = t.rig, a = n.act ? bt(n, r) : null, o = a ? a.lifts : [
		[0, 0],
		[0, 0],
		[0, 1],
		[0, 2],
		[1, 0],
		[2, 0]
	][n.walk + 2] || [0, 0], s = i.hip + n.bob, c = i.child ? [i.cx - 3, i.cx + 1] : [i.cx - 4, i.cx + 1];
	a && (c[0] -= a.spread, c[1] += a.spread);
	let l = t.outfit.style === "robe" || t.outfit.style === "dress";
	for (let t = 0; t < 2; t++) {
		let n = o[t], a = c[t], u = i.ground - n;
		e.begin(t === 1 ? "sides" : null, 1);
		for (let t = s; t <= u; t++) {
			let n = t > u - i.bootH;
			for (let o = 0; o < i.legW; o++) {
				let c = B(o, i.legW);
				t <= s + 1 && (c = Math.min(c, 1)), n ? (c = t === u ? 1 : B(o, i.legW), r && t === u && (c = 0), e.set(a + o, t, C.BOOT, c)) : e.set(a + o, t, C.BOTTOM, l ? Math.max(0, c - 1) : c);
			}
		}
		!r && n === 0 && !i.child && e.set(t === 0 ? a - 1 : a + i.legW, u, C.BOOT, t === 0 ? 2 : 1), e.end();
	}
}
function ge(e) {
	switch (e.walk) {
		case 0: return [-1, 1];
		case 2: return [1, -1];
		default: return [0, 0];
	}
}
function _e(e, t, n, r) {
	let i = t.rig, a = n.bob + n.br, o = i.torsoTop + a, s = i.waist + a, c = i.hem + n.bob, l = i.cx, u = i.half, d = t.outfit.style, f = z(n), p = l - u, m = l + u - 1;
	e.begin(null);
	for (let t = o; t < s; t++) {
		let n = +(t === o);
		for (let r = p + n; r <= m - n; r++) {
			let n = B(r - p, m - p + 1);
			t === o && (n = Math.min(n, 1)), e.set(r, t, C.TOP, n);
		}
	}
	if (d === "robe" || d === "dress" || d === "dancer") {
		let t = d === "dancer" ? i.ground - 1 : i.robeHem + 0, r = d === "robe" ? C.TOP : C.BOTTOM;
		for (let a = s; a <= t + n.bob; a++) {
			let o = (a - s) / Math.max(1, t + n.bob - s), c = Math.round(o * (i.child ? 1 : 2)), u = a >= t + n.bob - 1 ? f.sway : 0, h = p - c + (a === t + n.bob ? Math.max(0, u) : 0), g = m + c + (a === t + n.bob ? Math.min(0, u) : 0);
			for (let i = h; i <= g; i++) {
				let o = B(i - h, g - h + 1), c = i - l;
				a > s + 1 && (c === -2 || c === 2) && (o = Math.max(1, o - 1)), a > s + 2 && c === 0 && d !== "dancer" && (o = Math.min(3, o + 0)), a === t + n.bob && (o = Math.max(0, o - 1)), e.set(i, a, r, o);
			}
		}
	} else for (let t = s; t <= c; t++) {
		let n = +(t > s), r = p - (t === c ? n : 0) - 0, i = m + (t === c ? n : 0), a = d === "overalls" ? C.BOTTOM : C.TOP;
		for (let n = r; n <= i; n++) {
			let o = B(n - r, i - r + 1);
			t === c && (o = Math.max(1, o - 1)), t > s && (n === l - 2 || n === l + 1) && d === "tunic" && (o = Math.max(1, o - 1)), e.set(n, t, a, o);
		}
	}
	if (e.end(), !r && (d === "tunic" || d === "dress" || d === "tabard" || d === "overalls") && (e.over(p + 1, o + 1, C.TOP, 3), e.over(p + 1, o + 2, C.TOP, 3), e.over(p + 2, o + 1, C.TOP, 3)), r) {
		if ((d === "tunic" || d === "vest") && (e.set(p + 1, o + 1, C.TOP, 3), e.set(p + 2, o + 1, C.TOP, 3), e.set(m - 1, o + 2, C.TOP, 1)), d === "overalls") {
			e.set(l - 2, o, C.BOTTOM, 2), e.set(l + 1, o, C.BOTTOM, 1);
			for (let t = o + 1; t < s; t++) e.set(l - 1 - Math.floor((s - t) / 3), t, C.BOTTOM, 2), e.set(l + Math.floor((s - t) / 3), t, C.BOTTOM, 1);
		}
		if (d === "tabard") {
			for (let t = o; t <= c + 1; t++) for (let n = l - 2; n <= l + 1; n++) e.set(n, t, C.TOP, n === l - 2 ? 3 : n === l + 1 ? 1 : 2);
			for (let t = o + 1; t < s; t++) e.set(p, t, C.METAL, t & 1 ? 3 : 2), e.set(m, t, C.METAL, t & 1 ? 1 : 2);
		}
		if (d === "dancer") {
			for (let t = p; t <= m; t++) e.set(t, s - 1, C.SKIN, t === p ? 3 : t === m ? 1 : 2);
			for (let t = p; t <= m; t++) e.set(t, s - 2, C.GOLD, t === m ? 2 : 3);
		}
	} else if (d === "robe") {
		e.set(l - 1, o, C.SHIRT, 2), e.set(l, o, C.SHIRT, 1);
		for (let t = o + 1; t <= i.robeHem + n.bob; t++) e.set(l - 0, t, C.ACCENT, t < s ? 3 : 2);
		for (let t = o + 1; t <= i.robeHem + n.bob; t++) e.set(l - 1, t, C.ACCENT, 3);
		e.set(l - 1, o + 1, C.ACCENT, 4);
	} else if (d === "tunic") e.set(l - 1, o, C.TOP, 0), e.set(l, o, C.TOP, 0), e.set(l - 1, o + 1, C.TOP, 1), e.set(l - 2, o, C.TOP, 2), e.set(l + 1, o, C.TOP, 1);
	else if (d === "vest") {
		for (let t = o; t < s; t++) e.set(l - 1, t, C.SHIRT, t === o ? 1 : 3), e.set(l, t, C.SHIRT, t === o ? 1 : 2);
		e.set(l - 2, o + 1, C.GOLD, 3), e.set(l + 1, o + 1, C.GOLD, 2), e.set(l - 2, o + 3, C.GOLD, 3), e.set(l + 1, o + 3, C.GOLD, 2);
	} else if (d === "overalls") {
		for (let t = o + 2; t < s; t++) for (let n = l - 2; n <= l + 1; n++) e.set(n, t, C.BOTTOM, n === l - 2 ? 3 : n === l + 1 ? 1 : 2);
		e.set(l - 3, o, C.BOTTOM, 2), e.set(l - 3, o + 1, C.BOTTOM, 2), e.set(l + 2, o, C.BOTTOM, 1), e.set(l + 2, o + 1, C.BOTTOM, 1), e.set(l - 2, o + 2, C.GOLD, 3), e.set(l + 1, o + 2, C.GOLD, 2), e.set(l - 1, o + 3, C.BOTTOM, 1), e.set(l, o + 3, C.BOTTOM, 1);
	} else if (d === "tabard") {
		for (let t = o; t <= c + 1; t++) for (let n = l - 2; n <= l + 1; n++) {
			let r = n === l - 2 ? 3 : n === l + 1 ? 1 : 2;
			e.set(n, t, C.TOP, t === c + 1 ? Math.max(0, r - 1) : r);
		}
		e.set(l - 1, o + 2, C.GOLD, 4), e.set(l, o + 2, C.GOLD, 3), e.set(l - 1, o + 3, C.GOLD, 3), e.set(l, o + 3, C.GOLD, 2);
		for (let t = o + 1; t < s; t++) e.set(p, t, C.METAL, t & 1 ? 3 : 2), e.set(m, t, C.METAL, t & 1 ? 1 : 2);
	} else if (d === "dress") e.set(l - 1, o, C.TOP, 0), e.set(l, o, C.TOP, 0), e.set(l - 2, o, C.SHIRT, 3), e.set(l + 1, o, C.SHIRT, 2);
	else if (d === "dancer") {
		e.set(l - 1, o, C.SKIN, 2), e.set(l, o, C.SKIN, 1);
		for (let t = p; t <= m; t++) e.set(t, s - 1, C.SKIN, t === p ? 3 : t === m ? 1 : 2);
		for (let t = p; t <= m; t++) e.set(t, s - 2, C.GOLD, t === m ? 2 : 3);
		e.set(l - 1, s - 1, C.SKIN, 1);
	}
	if (d === "tunic" || d === "vest" || d === "tabard") {
		for (let t = p; t <= m; t++) e.set(t, s, C.BELT, t === p ? 3 : t === m ? 1 : 2);
		r || (e.set(l - 1, s, C.GOLD, 4), e.set(l, s, C.GOLD, 2));
	} else if (d === "robe") {
		for (let t = p; t <= m; t++) e.set(t, s, C.SASH, t === p ? 3 : t === m ? 1 : 2);
		r ? (e.set(l - 2, s + 1, C.SASH, 2), e.set(l - 2, s + 2, C.SASH, 1)) : (e.set(l + 1, s + 1, C.SASH, 1), e.set(l + 1, s + 2, C.SASH, 2), e.set(l + 2, s + 3, C.SASH, 1));
	} else if (d === "dress") {
		for (let t = p; t <= m; t++) e.set(t, s, C.ACCENT, t === p ? 3 : t === m ? 1 : 2);
		r && (e.set(l - 1, s + 1, C.ACCENT, 3), e.set(l, s + 1, C.ACCENT, 2), e.set(l - 2, s + 2, C.ACCENT, 2), e.set(l + 1, s + 2, C.ACCENT, 1));
	} else if (d === "dancer") for (let t = p - 1; t <= m + 1; t++) e.set(t, s, C.GOLD, t <= p ? 4 : t >= m ? 2 : 3);
	if (t.gear.apron && !r) {
		for (let t = s + 1; t <= (d === "dress" ? i.robeHem - 1 : c) + n.bob; t++) {
			let n = 2 + +(t > s + 2);
			for (let r = l - n; r <= l + n - 1; r++) e.set(r, t, C.WHITE, r === l - n ? 3 : r === l + n - 1 ? 1 : 2);
		}
		for (let t = l - 2; t <= l + 1; t++) e.set(t, o + 1, C.WHITE, 3);
		for (let t = o + 2; t < s; t++) for (let n = l - 2; n <= l + 1; n++) e.set(n, t, C.WHITE, n === l + 1 ? 1 : 2);
		e.set(l - 1, s + 3, C.WHITE, 1);
	}
}
function ve(e, t, n, r) {
	let i = t.rig, a = n.bob + n.br, o = ge(n), s = i.half, c = t.outfit.style, l = c === "vest" || c === "overalls" ? C.SHIRT : c === "tabard" ? C.METAL : c === "dancer" ? C.SKIN : C.TOP, u = c === "robe";
	for (let n = 0; n < 2; n++) {
		let d = r ? -o[n] : o[n], f = n === 0 ? i.cx - s - 2 : i.cx + s, p = i.armTop + a, m = i.armLen + (d > 0 ? 0 : d);
		e.begin("sides", 1);
		for (let t = p; t < p + m; t++) {
			for (let r = 0; r < 2; r++) {
				let i = r === 0 ? 2 : 1;
				t === p && (i = n === 0 ? 3 : 2), l === C.SKIN && (i = n === 0 ? r === 0 ? 3 : 2 : r === 0 ? 2 : 1), e.set(f + r, t, l, i);
			}
			u && t >= p + m - 2 && e.set(n === 0 ? f - 1 : f + 2, t, C.TOP, n === 0 ? 2 : 1);
		}
		u && (e.set(f, p + m - 1, C.ACCENT, 3), e.set(f + 1, p + m - 1, C.ACCENT, 2), e.set(n === 0 ? f - 1 : f + 2, p + m - 1, C.ACCENT, 2)), t.gear.bracers && !i.child && (e.set(f, p + m - 1, C.METAL, 3), e.set(f + 1, p + m - 1, C.METAL, 2)), c === "dancer" && (e.set(f, p + m - 1, C.GOLD, 3), e.set(f + 1, p + m - 1, C.GOLD, 2));
		let h = p + m, g = t.gear.gloves ? C.LEATHER : C.SKIN;
		if (e.set(f, h, g, n === 0 ? 3 : 2), e.set(f + 1, h, g, n === 0 ? 2 : 1), i.child || (e.set(f, h + 1, g, 1), e.set(f + 1, h + 1, g, 1)), e.end(), t.gear.pauldrons && !i.child) {
			e.begin("below", 1);
			let t = {
				1: [C.METAL, 0],
				2: [C.METAL, 1],
				3: [C.METAL, 2],
				4: [C.METAL, 3],
				5: [C.METAL, 4]
			}, r = n === 0 ? [
				".45.",
				"4543",
				"2332"
			] : [
				".43.",
				"3432",
				"1221"
			];
			e.tpl(N(r, t), f - 1, p - 1), e.end();
		}
	}
}
function ye(e, t, n, r, i) {
	let a = r + 6, o = n + 3, s = n + 8;
	if (i && mt.has(i.act)) {
		Lt(e, t, n, r);
		return;
	}
	if (t.face === "fierce") {
		ft(e, t, n, r);
		return;
	}
	if (e.set(o, a, C.EYE, 0), e.set(o, a + 1, C.EYE, 2), e.set(s, a, C.EYE, 0), e.set(s, a + 1, C.EYE, 2), t.female && (e.set(o - 1, a, C.EYE, 1), e.set(s + 1, a, C.EYE, 1)), (!t.beard || t.beard === "goatee") && e.set(n + 6, r + 9, C.SKIN, 1), t.blush && (e.set(n + 2, r + 8, C.BLUSH, 2), e.set(n + 9, r + 8, C.BLUSH, 2)), t.gear.glasses) {
		for (let t of [o, s]) e.set(t - 1, a, C.GOLD, 3), e.set(t + 1, a, C.GOLD, 2), e.set(t - 1, a + 1, C.GOLD, 2), e.set(t + 1, a + 1, C.GOLD, 1), e.set(t, a - 1, C.GOLD, 4), e.set(t, a + 2, C.GOLD, 1), e.set(t, a, C.WHITE, 3);
		for (let t = o + 2; t <= s - 2; t++) e.set(t, a, C.GOLD, 2);
	}
}
function be(e, t, n, r, i) {
	let a = r + 6;
	if (i && mt.has(i.act)) {
		Rt(e, t, n, r);
		return;
	}
	if (t.face === "fierce") {
		pt(e, t, n, r);
		return;
	}
	if (e.set(n + 2, a, C.EYE, 0), e.set(n + 2, a + 1, C.EYE, 2), t.female && e.set(n + 3, a, C.EYE, 1), t.beard || e.set(n + 1, r + 9, C.SKIN, 1), e.set(n + 6, a, C.SKIN, 1), e.set(n + 6, a + 1, C.SKIN, 1), e.set(n + 7, a, C.SKIN, 2), e.set(n + 7, a + 1, C.SKIN, 0), t.blush && e.set(n + 3, r + 8, C.BLUSH, 2), t.gear.glasses) {
		e.set(n + 1, a, C.GOLD, 4), e.set(n + 3, a, C.GOLD, 3), e.set(n + 2, a - 1, C.GOLD, 4), e.set(n + 2, a + 2, C.GOLD, 2), e.set(n + 1, a + 1, C.GOLD, 3), e.set(n + 3, a + 1, C.GOLD, 2);
		for (let t = n + 4; t <= n + 6; t++) e.set(t, a - 1, C.GOLD, 2);
	}
}
function xe(e, t, n, r, i, a, o = 0) {
	if (!i || !a && !o) {
		e.tpl(t, n, r);
		return;
	}
	let s = t.oy || 0;
	e.tpl({
		...t,
		rows: t.rows.slice(0, i)
	}, n, r);
	for (let a = 0; a < o; a++) e.tpl({
		...t,
		rows: [t.rows[i]],
		oy: s + i + a
	}, n, r);
	e.tpl({
		...t,
		rows: t.rows.slice(i),
		oy: s + i + o
	}, n + a, r);
}
var V = {
	1: [C.CAPE, 0],
	2: [C.CAPE, 1],
	3: [C.CAPE, 2],
	4: [C.CAPE, 3],
	5: [C.CAPE, 4],
	i: [C.CAPEIN, 1],
	I: [C.CAPEIN, 2],
	j: [C.CAPEIN, 3],
	g: [C.GOLD, 2],
	G: [C.GOLD, 4]
}, Se = N([
	"..3444433322..",
	".344443333322.",
	".34444Gg33322.",
	"344444Ii333221",
	"34444I..i33221",
	"34443I..i32221",
	"34443I..i32221",
	".3333i..i2221."
], V, -7, -2), Ce = N([
	".34444Gg33322.",
	"343........221",
	".3..........1."
], V, -7, 0), we = N([
	".....34443....",
	"...G44443332..",
	"..34444433322.",
	".344444333222.",
	".34443333222..",
	"..33332222I...",
	"...2...2......"
], V, -5, -1), Te = N([
	".2IjjjjI2.",
	"3444444332",
	"3444433322",
	".34443322.",
	"..343322..",
	"...3322...",
	"....32...."
], V, -5, -1);
function Ee(e, t, n) {
	let r = t.rig, i = t.cape.style === "short", a = n.bob + n.br, o = z(n), s = r.torsoTop + a + 2, c = (i ? r.waist + a + 1 : r.robeHem) + o.dy;
	e.begin(null);
	for (let t = s; t <= c; t++) {
		let n = (t - s) / Math.max(1, c - s), a = r.half + 2 + +(n > .7 && !i), l = t >= c - 1 ? o.sway : 0, u = r.cx - a + l, d = r.cx + a - 1 + l;
		for (let n = u; n <= d; n++) n === u ? e.set(n, t, C.CAPE, t === c ? 1 : 2) : n === d ? e.set(n, t, C.CAPE, t === c ? 0 : 1) : e.set(n, t, C.CAPEIN, t === c ? 1 : 2);
	}
	e.end();
}
function De(e, t, n) {
	let r = t.rig, i = n.bob + n.br, a = r.torsoTop + i;
	e.begin("below", 1), e.tpl(t.cape.style === "cloak" ? Se : Ce, r.cx, a), e.end();
}
function Oe(e, t, n) {
	let r = t.rig, i = n.bob + n.br, a = z(n), o = r.torsoTop + i, s = t.cape.style === "cloak", c = (t.cape.style === "short" ? o + 7 : r.robeHem) + a.dy;
	e.begin(null);
	for (let t = o; t <= c; t++) {
		let n = (t - o) / Math.max(1, c - o), i = (t === o ? r.half + 1 : r.half + 2) + +(n > .6), s = t >= c - 2 ? a.sway : 0, l = r.cx - i + s, u = r.cx + i - 1 + s;
		for (let n = l; n <= u; n++) {
			let i = B(n - l, u - l + 1), a = n - r.cx - s;
			t > o + 3 && (a === -3 || a === 2 ? i = 1 : (a === -2 || a === 3) && (i = Math.min(3, i + 1))), t === c && (i = Math.max(0, i - 1)), (t !== c || a !== -3 && a !== 2) && e.set(n, t, C.CAPE, i);
		}
	}
	if (e.end(), s) e.begin("all", 1), e.tpl(Te, r.cx, o), e.end();
	else {
		e.begin(null);
		for (let t = r.cx - r.half - 1; t <= r.cx + r.half; t++) e.set(t, o, C.CAPE, t < r.cx - 2 ? 4 : t > r.cx + 2 ? 2 : 3);
		e.end();
	}
}
var ke = Object.freeze([
	"staff",
	"spear",
	"cane",
	"holystaff",
	"icestaff"
]), H = (e) => e === "staff" || e === "holystaff" || e === "icestaff", Ae = (e) => e === "holystaff" ? C.GILT : e === "icestaff" ? C.METAL : C.WOOD;
function je(e, t, n, r = !0) {
	for (let [r, i, a] of [
		[
			-1,
			-4,
			4
		],
		[
			0,
			-4,
			4
		],
		[
			1,
			-4,
			3
		],
		[
			-2,
			-3,
			4
		],
		[
			2,
			-3,
			2
		],
		[
			-2,
			-2,
			3
		],
		[
			2,
			-2,
			1
		],
		[
			-2,
			-1,
			3
		],
		[
			2,
			-1,
			1
		],
		[
			-1,
			0,
			2
		],
		[
			0,
			0,
			2
		],
		[
			1,
			0,
			1
		]
	]) e.set(t + r, n + i, C.GOLD, a);
	e.set(t - 1, n - 3, C.HOLY, 4), e.set(t, n - 3, C.HOLY, 4), e.set(t + 1, n - 3, C.HOLY, 3), e.set(t - 1, n - 2, C.HOLY, 3), e.set(t, n - 2, C.HOLY, 4), e.set(t + 1, n - 2, C.HOLY, 2), e.set(t - 1, n - 1, C.HOLY, 2), e.set(t, n - 1, C.HOLY, 3), e.set(t + 1, n - 1, C.HOLY, 2), r && (e.set(t - 3, n - 2, C.GOLD, 3), e.set(t + 3, n - 2, C.GOLD, 1)), e.set(t, n + 1, C.GOLD, 2);
}
function Me(e, t, n) {
	e.set(t, n - 4, C.ICE, 4), e.set(t - 1, n - 3, C.ICE, 4), e.set(t, n - 3, C.ICE, 4), e.set(t + 1, n - 3, C.ICE, 2), e.set(t - 1, n - 2, C.ICE, 3), e.set(t, n - 2, C.ICE, 4), e.set(t + 1, n - 2, C.ICE, 1), e.set(t - 1, n - 1, C.ICE, 3), e.set(t, n - 1, C.ICE, 3), e.set(t + 1, n - 1, C.ICE, 1), e.set(t, n, C.ICE, 2), e.set(t - 1, n, C.METAL, 3), e.set(t + 1, n, C.METAL, 1), e.set(t - 1, n + 1, C.METAL, 2), e.set(t, n + 1, C.METAL, 3), e.set(t + 1, n + 1, C.METAL, 1), e.set(t + 2, n - 3, C.ICE, 3);
}
function U(e, t, n, r, i) {
	if (i === "holystaff") {
		je(e, n, r);
		return;
	}
	if (i === "icestaff") {
		Me(e, n, r);
		return;
	}
	i === "spear" ? (e.set(n, r - 3, C.METAL, 4), e.set(n - 1, r - 2, C.METAL, 3), e.set(n, r - 2, C.METAL, 4), e.set(n + 1, r - 2, C.METAL, 2), e.set(n - 1, r - 1, C.METAL, 2), e.set(n, r - 1, C.METAL, 3), e.set(n + 1, r - 1, C.METAL, 1), e.set(n, r, C.METAL, 2), e.set(n - 1, r + 1, C.SCARF, 3), e.set(n, r + 1, C.GOLD, 3), e.set(n + 1, r + 1, C.SCARF, 1)) : i === "staff" ? (e.set(n - 1, r - 1, C.GOLD, 3), e.set(n, r - 2, C.GOLD, 4), e.set(n + 1, r - 1, C.GOLD, 2), e.set(n - 1, r, C.GOLD, 3), e.set(n + 1, r, C.GOLD, 1), e.set(n, r - 1, C.GEM, 4), e.set(n, r, C.GEM, 2), e.set(n, r + 1, C.GOLD, 2)) : i === "cane" && (e.set(n, r, C.WOOD, 3), e.set(n + 1, r - 1, C.WOOD, 3), e.set(n + 2, r - 1, C.WOOD, 2), e.set(n + 3, r, C.WOOD, 1));
}
function Ne(e, t) {
	return e === "spear" || H(e) ? t - 16 : t - 3;
}
var Pe = .125;
function Fe(e, t, n, r, i) {
	let a = t.rig, o = Ne(i, r), s = a.ground, c = Ae(i);
	e.begin(null);
	for (let t = o; t <= s; t++) e.set(n, t, c, t < r ? 3 : 2);
	U(e, t, n, o, i), e.end();
}
var W = (e) => e?.gear?.crest === "anchor" || e?.gear?.crest === "plain" ? e.gear.crest : null;
function Ie(e, t, n, r = null) {
	let i = r ? T.CRESTS[r] : [
		".rRRRr.",
		"rLFFFFr",
		"rLgFgFr",
		"rFGGGFr",
		"rLFGFFr",
		"rLGgGFr",
		"rFFbFFr",
		"rLFGFFr",
		"rFFFFFd",
		".rFFFd.",
		"..rdd.."
	], a = {
		R: [C.METAL, 4],
		r: [C.METAL, 3],
		d: [C.METAL, 1],
		L: [C.SHIELD, 3],
		F: [C.SHIELD, 2],
		G: [C.CREST, 3],
		g: [C.CREST, 4],
		b: [C.GOLD, 2]
	};
	e.tpl(N(i, a), t, n);
	for (let r = 1; r <= 8; r++) e.get(t + 5, n + r) === C.SHIELD && e.set(t + 5, n + r, C.SHIELD, 1);
}
function Le(e, t, n) {
	let r = [
		".rRRRr.",
		"rWWwWWr",
		"rWsSsWr",
		"rWWwWWr",
		"rWWwWWr",
		"rWsSsWr",
		"rWWwWWr",
		"rWWwWWr",
		"rWWwWWd",
		".rWwWd.",
		"..rdd.."
	], i = {
		R: [C.METAL, 3],
		r: [C.METAL, 2],
		d: [C.METAL, 1],
		W: [C.WOOD, 2],
		w: [C.WOOD, 1],
		S: [C.LEATHER, 2],
		s: [C.LEATHER, 1]
	};
	e.tpl(N(r, i), t, n);
}
function Re(e, t, n, r = null) {
	let i = r === "plain" ? T.CREST_EDGE_PLAIN : [
		"rR.",
		"LrR",
		"GrR",
		"GrR",
		"LrR",
		"FrR",
		"brR",
		"FrR",
		"FrR",
		"Frd",
		".d."
	], a = {
		R: [C.METAL, 3],
		r: [C.METAL, 2],
		d: [C.METAL, 1],
		L: [C.SHIELD, 3],
		F: [C.SHIELD, 2],
		G: [C.CREST, 3],
		b: [C.GOLD, 2]
	};
	e.tpl(N(i, a), t, n);
}
function ze(e, t, n, r = !0) {
	let i = +!!r;
	e.set(t, n + 1, C.LEATHER, 1 + i), e.set(t, n + 2, C.WOOD, 1 + i), e.set(t, n + 3, C.WOOD, 1 + i), e.set(t, n + 4, C.METAL, 3 + i), e.set(t - 1, n + 5, C.METAL, 3 + i), e.set(t, n + 5, C.METAL, 2 + i), e.set(t + 1, n + 5, C.METAL, 1 + i), e.set(t, n + 6, C.METAL, 1 + i), e.set(t, n, C.METAL, 3);
}
function Be(e, t, n, r, i) {
	let a = t.rig, o = r ? a.cx + a.half : a.cx - a.half - 2, s = r ? a.cx - a.half - 2 : a.cx + a.half;
	e.begin("all", 0), ze(e, o, i(+!!r)), e.end(), e.begin("all", 0);
	let c = a.armTop + n.bob + n.br - 1;
	r ? Le(e, s - 4, c) : Ie(e, s - 1, c, W(t)), e.end();
}
function Ve(e, t, n, r, i, a) {
	let o = t.rig, s = o.armTop + n.bob + n.br - 1;
	a === "shield" && !r ? (e.begin("all", 0), Re(e, o.cx - 6, s, W(t)), e.end()) : a === "shield" && r ? (e.begin(null), Re(e, o.cx + 1, s, W(t)), e.end()) : a === "mace" && i && (e.begin("all", 0), ze(e, i[0], i[1], r), e.end());
}
function He(e, t, n, r, i) {
	e.begin("sides", 0), n.act ? e.set(r, i - 1, C.GOLD, 2) : (e.set(r, i - 2, C.GOLD, 4), e.set(r - 1, i - 1, C.GOLD, 3), e.set(r, i - 1, C.LEATHER, 2), e.set(r + 1, i - 1, C.GOLD, 2));
	for (let t = 0; t < 6; t++) e.set(r + +(t > 3), i + t, C.LEATHER, t === 5 ? 1 : 2);
	e.set(r + 1, i + 5, C.METAL, 3), e.end();
}
function Ue(e, t, n, r) {
	let i = t.rig, a = n.bob + n.br, o = i.torsoTop + a, s = r === "down";
	if (t.gear.pack && s) {
		e.begin(null);
		let t = i.half + 4, n = o - 5;
		for (let r = n + 2; r <= o + 8; r++) e.set(i.cx - t, r, C.PACK, 3), e.set(i.cx - t + 1, r, C.PACK, 2), e.set(i.cx + t - 2, r, C.PACK, 1), e.set(i.cx + t - 1, r, C.PACK, 1);
		for (let n = i.cx - t; n <= i.cx + t - 1; n++) e.set(n, o + 8, C.PACK, 0);
		for (let r = i.cx - t - 1; r <= i.cx + t; r++) {
			let a = r === i.cx - t - 1 || r === i.cx + t;
			e.set(r, n, C.CAPE, a ? 2 : 3), e.set(r, n + 1, C.CAPE, a ? 1 : r < i.cx ? 3 : 2), e.set(r, n + 2, C.CAPE, +!a);
		}
		e.set(i.cx - t - 1, n + 1, C.CAPEIN, 2), e.set(i.cx + t, n + 1, C.CAPEIN, 1), e.set(i.cx - t + 2, n, C.LEATHER, 2), e.set(i.cx - t + 2, n + 1, C.LEATHER, 1), e.set(i.cx - t + 2, n + 2, C.LEATHER, 0), e.set(i.cx + t - 3, n, C.LEATHER, 2), e.set(i.cx + t - 3, n + 1, C.LEATHER, 1), e.set(i.cx + t - 3, n + 2, C.LEATHER, 0), e.end();
	}
	if (t.gear.pack && !s) {
		e.begin(s ? null : "all", 0);
		let t = i.half + 3, n = o - 4;
		for (let r = n; r <= o + 9; r++) for (let n = i.cx - t; n <= i.cx + t - 1; n++) {
			let a = B(n - (i.cx - t), 2 * t);
			r === o + 9 && (a = 1), e.set(n, r, C.PACK, a);
		}
		for (let r = i.cx - t - 1; r <= i.cx + t; r++) e.set(r, n - 1, C.CAPE, 3), e.set(r, n - 2, C.CAPE, r < i.cx ? 3 : 2), e.set(r, n, C.CAPE, 1);
		if (e.set(i.cx - t - 1, n - 2, C.CAPE, 1), e.set(i.cx + t, n - 1, C.CAPE, 0), !s) {
			for (let r = i.cx - t + 1; r <= i.cx + t - 2; r++) e.set(r, n + 4, C.LEATHER, 2);
			for (let r = n + 1; r <= n + 4; r++) e.set(i.cx - t + 1, r, C.PACK, 1), e.set(i.cx + t - 2, r, C.PACK, 1);
			e.set(i.cx - 1, n + 4, C.GOLD, 4), e.set(i.cx, n + 4, C.GOLD, 2);
			for (let t = n + 6; t <= o + 7; t++) e.set(i.cx - 3, t, C.LEATHER, 2), e.set(i.cx + 2, t, C.LEATHER, 1);
			e.set(i.cx + t, o + 3, C.METAL, 2), e.set(i.cx + t, o + 4, C.METAL, 1), e.set(i.cx + t + 1, o + 3, C.METAL, 1), e.set(i.cx + t + 1, o + 4, C.METAL, 0);
		}
		e.end();
	}
	if (t.gear.quiver) {
		e.begin(s ? null : "all", 1);
		let t = s ? i.cx + i.half : i.cx + 2;
		for (let n = 0; n < 9; n++) {
			let r = t - Math.floor(n / 3) + 0, i = o - 3 + n;
			e.set(r, i, C.LEATHER, 2), e.set(r + 1, i, C.LEATHER, 1);
		}
		e.set(t, o - 4, C.WHITE, 3), e.set(t + 1, o - 5, C.WHITE, 4), e.set(t + 2, o - 4, C.SCARF, 3), e.set(t + 1, o - 4, C.SCARF, 2), e.end();
	}
	if (t.weapon === "bow" && !n.act) {
		e.begin(s ? null : "all", 1);
		let t = s ? i.cx - i.half - 2 : i.cx - i.half, n = [];
		for (let e = 0; e <= 14; e++) {
			let r = e / 14, a = t + Math.round(r * (i.half * 2 + 2) + Math.sin(r * Math.PI) * -2), s = o - 3 + Math.round(r * 12);
			n.push([a, s]);
		}
		for (let [t, r] of n) e.set(t, r, C.WOOD, 3);
		if (!s) for (let n = 0; n <= 12; n++) e.set(t + 1 + Math.round(n / 12 * (i.half * 2)), o - 2 + n, C.STRING, 3);
		e.end();
	}
	if (t.weapon === "lute") {
		if (e.begin(s ? null : "all", 1), s) {
			let t = i.cx + i.half + 1;
			for (let n = 0; n < 5; n++) e.set(t - Math.floor(n / 3), o - 4 + n, C.WOOD, 2);
			e.set(t, o - 5, C.WOOD, 1), e.set(t + 1, o - 5, C.WOOD, 1);
		} else {
			let t = i.cx - 2, n = o + 3;
			e.tpl(N([
				".3332.",
				"344332",
				"343332",
				"343322",
				".3322.",
				"..22.."
			], {
				2: [C.WOOD, 1],
				3: [C.WOOD, 2],
				4: [C.WOOD, 3]
			}), t - 1, n);
			for (let r = 1; r <= 6; r++) e.set(t + 3 + Math.floor(r / 2), n - r, C.WOOD, 2);
			e.set(t + 6, n - 7, C.WOOD, 1), e.set(t + 7, n - 7, C.WOOD, 1);
			for (let t = 0; t < 7; t++) e.set(i.cx - i.half + t, o + t, C.LEATHER, 2);
		}
		e.end();
	}
}
function We(e, t, n, r) {
	let i = t.rig, a = n.bob + n.br, o = i.torsoTop + a;
	e.begin(null);
	let s = i.waist - i.torsoTop, c = !r && t.cape && t.cape.style === "cloak";
	for (let t = 0; t <= s && !c; t++) {
		let n = r ? i.cx + i.half - 1 - Math.round(t * (i.half * 2 - 1) / s) : i.cx - i.half + Math.round(t * (i.half * 2 - 1) / s);
		e.set(n, o + t, C.LEATHER, 1);
	}
	e.end(), e.begin("all", 0);
	let l = r ? i.cx - i.half - 1 : i.cx + i.half - 1, u = i.waist + a + 1, d = r ? [
		".4443",
		"43332",
		"33322",
		".222."
	] : [
		"4443.",
		"34g32",
		"33322",
		".222."
	];
	e.tpl(N(d, {
		2: [C.LEATHER, 1],
		3: [C.LEATHER, 2],
		4: [C.LEATHER, 3],
		g: [C.GOLD, 4]
	}), l - 1, u), e.end();
}
function Ge(e, t, n, r) {
	let i = t.rig, a = n.bob + n.br, o = i.torsoTop + a, s = z(n);
	e.begin("below", 0);
	for (let t = i.cx - i.half; t <= i.cx + i.half - 1; t++) {
		let n = t - (i.cx - i.half);
		e.set(t, o, C.SCARF, n < 2 ? 3 : n > 2 * i.half - 3 ? 1 : 2), e.set(t, o - 1, C.SCARF, n < 2 ? 4 : n > 2 * i.half - 3 ? 2 : 3);
	}
	if (r) {
		e.set(i.cx - 2, o + 1, C.SCARF, 3), e.set(i.cx - 1, o + 1, C.SCARF, 3), e.set(i.cx, o + 1, C.SCARF, 2);
		let t = 6 + s.dy;
		for (let n = 2; n <= t; n++) {
			let r = n >= t - 1 ? s.sway : 0, a = i.cx - 2 + r;
			e.set(a, o + n, C.SCARF, 3), e.set(a + 1, o + n, C.SCARF, n === t ? 1 : 2), n <= t - 2 && e.set(a + 2, o + n, C.SCARF, 1);
		}
	} else {
		let t = i.cx + 1;
		e.set(t, o + 1, C.SCARF, 2), e.set(t + 1, o + 1, C.SCARF, 1);
		for (let n = 2; n <= 5; n++) e.set(t + 1 + (n > 3 ? +(s.sway > 0) : 0), o + n, C.SCARF, n === 5 ? 1 : 2);
	}
	e.end();
}
function Ke(e, t, n, r) {
	let i = t.rig, a = n.bob, o = z(n), s = i.waist + a;
	e.begin(null);
	for (let t = 0; t < 2; t++) {
		let n = t === 0 ? -1 : 1, r = n < 0 ? i.cx - i.half - 1 : i.cx + i.half;
		for (let i = 0; i < 7 + o.dy; i++) {
			let a = Math.floor(i / 3) * n + (i > 3 ? o.sway : 0);
			e.set(r + a, s + i, C.GOLD, t === 0 ? 3 : 2);
		}
	}
	e.end();
}
function qe(e, t, n, r) {
	let i = t.rig, a = n.bob + n.br, o = i.cx - 6, s = i.headY + a, c = r ? "up" : "down", l = z(n);
	e.begin(null), e.tpl(ae[c], o, s), e.end(), r || (e.begin(null), ye(e, t, o, s, n), e.end());
	let u = t.hat, d = P[t.hairStyle][c];
	u === "hood" ? r || (e.begin("below", 1), e.tpl(N([".33432332.", "..3.3..2.."], A), o + 1, s + 3), e.end()) : (e.begin(r ? null : "below", 1), xe(e, d.front, o, s, d.swayFrom, l.sway, Math.max(0, l.dy)), e.end(), t.hairStyle === "ponytail" && Ye(e, t, o, s, l, r)), t.beard && !r && (e.begin(null), e.tpl(oe[t.beard].down, o, s), e.end()), t.ears === "pointed" && u !== "hood" && u !== "helmet" && u !== "greathelm" && st(e, o, s, r), u !== "none" && F[u] && (e.begin(u === "wide" || u === "cap" ? "below" : u === "circlet" ? null : "below", 1), e.tpl(F[u][c], o, s, Je(t, F[u][c])), e.end()), u === "hood" && t.hoodTrim && T.hoodTrim(e, o, s, c), u === "hood" && t.feather && lt(e, o, s, c);
}
function Je(e, t) {
	return e.feather ? null : {
		...t.legend,
		f: null,
		F: null,
		e: null
	};
}
function Ye(e, t, n, r, i, a) {
	if (a) {
		e.begin("all", 0);
		let t = n + 5, a = 12 + i.dy;
		for (let n = 3; n <= a; n++) {
			let o = t + (n > 8 ? i.sway : 0), s = n > a - 2 ? 1 : 2, c = n % 3 != 0;
			e.set(o, r + n, C.HAIR, c ? 3 : 2), s > 1 && e.set(o + 1, r + n, C.HAIR, c ? 2 : 1), n > 4 && n < a - 2 && e.set(o - 1, r + n, C.HAIR, 2);
		}
		e.end(), e.begin(null), e.set(t - 1, r + 3, C.ACCENT, 3), e.set(t, r + 3, C.ACCENT, 4), e.set(t + 1, r + 3, C.ACCENT, 2), e.end();
		return;
	}
	e.begin(null);
	{
		let t = n + 11;
		for (let n = 0; n < 7 + i.dy; n++) {
			let a = t + +(n > 2) + (n > 4 ? i.sway : 0);
			e.set(a, r + 1 + n, C.HAIR, n < 3 ? 2 : 1), n > 1 && n < 6 && e.set(a + 1, r + 1 + n, C.HAIR, 1);
		}
	}
	e.end();
}
function Xe(e, t, n, r) {
	let i = t.rig, a = n.bob + n.br, o = n.act ? St(t, n, r ? "up" : "down") : null;
	o && K(e, o), r || (t.cape && Ee(e, t, n), Ue(e, t, n, "down"), P[t.hairStyle].down.back && t.hat !== "hood" && (e.begin(null), e.tpl(P[t.hairStyle].down.back, i.cx - 6, i.headY + a), e.end()));
	let s = ke.includes(t.weapon) ? t.weapon : null, c = ge(n), l = (e) => i.armTop + a + i.armLen + (r ? -c[e] : c[e]);
	if (s && r && !o && Fe(e, t, i.cx + i.half + 2, l(1), s), o && q(e, t, o, "behind"), o && xt(e), he(e, t, n, r), o && K(e, o), _e(e, t, n, r), t.gear.beads && ut(e, t, n, r), t.gear.sashes && Ke(e, t, n, r), t.gear.satchel && !t.cape && We(e, t, n, r), t.gear.satchel && t.cape && !r && We(e, t, n, r), t.weapon === "sword" && !r && He(e, t, n, i.cx + i.half + 1, i.waist + a + 1), t.weapon === "sword" && r && He(e, t, n, i.cx - i.half - 2, i.waist + a + 1), o ? q(e, t, o, "under") : ve(e, t, n, r), t.weapon === "greatshield" && !o && Be(e, t, n, r, l), t.weapon === "hammer" && !o && T.hammerFront(e, t, r, l), t.gear.book && !r && !o) {
		e.begin("all", 1);
		let t = i.cx - i.half - 3, n = l(0) - 2;
		e.tpl(N([
			"2332",
			"3443",
			"3443",
			"2332",
			"1221"
		], {
			1: [C.BOOK, 0],
			2: [C.BOOK, 1],
			3: [C.BOOK, 2],
			4: [C.WHITE, 3]
		}), t, n), e.set(t + 2, n + 2, C.SKIN, 2), e.set(t + 3, n + 2, C.SKIN, 1), e.end();
	}
	if (s && !r && !o && Fe(e, t, i.cx - i.half - 3, l(0), s), s && !r && !o && (e.begin(null), e.set(i.cx - i.half - 4, l(0), C.SKIN, 3), e.set(i.cx - i.half - 2, l(0), C.SKIN, 2), e.set(i.cx - i.half - 3, l(0) + 1, C.SKIN, 1), e.end()), t.gear.scarf && !r && Ge(e, t, n, !1), t.cape && !r && De(e, t, n), qe(e, t, n, r), H(s) && !o) {
		let n = +!!r, a = r ? i.cx + i.half + 2 : i.cx - i.half - 3;
		e.begin(null), U(e, t, a, Ne(s, l(n)), s), e.end();
	}
	r && (t.cape && Oe(e, t, n), Ue(e, t, n, "up"), t.gear.scarf && Ge(e, t, n, !0)), o && q(e, t, o, "over");
}
function Ze(e, t) {
	let n = t ? .67 : 1, r = (e, t, r = 0, i = !1) => ({
		knee: Math.round(e * n),
		ankle: Math.round(t * n),
		lift: Math.round(r * n),
		tip: i
	});
	if (e.act) return yt(e, r);
	switch (e.walk) {
		case 0: return [r(-2, -3), r(1, 3, 0, !0)];
		case 1: return [r(0, 0), r(-2, -1, 2)];
		case 2: return [r(1, 3, 0, !0), r(-2, -3)];
		case 3: return [r(-2, -1, 2), r(0, 0)];
		default: return [r(-1, -1), r(1, 1)];
	}
}
function Qe(e, t, n, r, i) {
	let a = t.rig, o = a.hip + n.bob, s = a.ground - r.lift - (a.bootH - 1), c = a.ground - r.lift, l = Math.round((o + s) / 2), u = a.cx - (a.child ? 1 : 2) + +!!i, d = a.child ? 2 : 3, f = i ? -1 : 0;
	e.begin(i ? null : "sides", 0);
	for (let t = o; t < s; t++) {
		let n;
		n = Math.round(t <= l ? r.knee * ((t - o) / Math.max(1, l - o)) : r.knee + (r.ankle - r.knee) * ((t - l) / Math.max(1, s - l)));
		let i = t <= l ? d : Math.max(2, d - 1);
		for (let r = 0; r < i; r++) {
			let a = B(r, i) + f;
			t === o && (a = Math.min(a, 1 + f)), e.set(u + n + r, t, C.BOTTOM, Math.max(0, a));
		}
	}
	let p = u + r.ankle;
	for (let t = s; t <= c; t++) {
		let n = t === c, i = a.child ? 2 : 3;
		for (let a = 0; a < i; a++) {
			let o = n ? a === 0 ? 2 : 1 : B(a, i);
			e.set(p + a - (n && !r.tip ? 1 : 0), t, C.BOOT, Math.max(0, o + f));
		}
		!n && !a.child && e.set(p, t, C.BOOT, Math.max(0, 3 + f));
	}
	r.tip && e.set(p + (a.child ? 2 : 3), c - 1, C.BOOT, Math.max(0, 1 + f)), e.end();
}
function $e(e, t, n, r, i) {
	let a = t.rig, o = n.bob + n.br, s = a.cx - 1, c = a.armTop + o, l = a.armLen, u = t.outfit.style, d = u === "vest" || u === "overalls" ? C.SHIRT : u === "tabard" ? C.METAL : u === "dancer" ? C.SKIN : C.TOP;
	e.begin(r ? "all" : null, 1);
	for (let t = 0; t < l; t++) {
		let n = t / Math.max(1, l - 1), a = s + Math.round(i * n), o = r ? 3 : 1, f = r ? 2 : 0;
		d === C.SKIN && (o = r ? 3 : 1, f = r ? 2 : 1), e.set(a, c + t, d, o), e.set(a + 1, c + t, d, f), u === "robe" && t >= l - 2 && e.set(a + (i > 0 ? 2 : -1), c + t, C.TOP, r ? 2 : 0);
	}
	let f = s + i, p = c + l;
	u === "robe" && (e.set(f, p - 1, C.ACCENT, r ? 3 : 1), e.set(f + 1, p - 1, C.ACCENT, r ? 2 : 1)), t.gear.bracers && !a.child && (e.set(f, p - 1, C.METAL, r ? 3 : 1), e.set(f + 1, p - 1, C.METAL, r ? 2 : 1)), u === "dancer" && (e.set(f, p - 1, C.GOLD, r ? 3 : 1), e.set(f + 1, p - 1, C.GOLD, r ? 2 : 1));
	let m = t.gear.gloves ? C.LEATHER : C.SKIN;
	return e.set(f, p, m, r ? 3 : 1), e.set(f + 1, p, m, r ? 2 : 1), a.child || e.set(f + (i < 0 ? 0 : 1), p + 1, m, +!!r), e.end(), [f, p];
}
function et(e, t, n) {
	let r = t.rig, i = n.bob + n.br, a = r.torsoTop + i, o = r.waist + i, s = r.hem + n.bob, c = t.outfit.style, l = z(n), u = r.cx - (r.child ? 3 : 4) + 1, d = r.cx + (r.child ? 2 : 3) - (r.half >= 5 ? -1 : 0);
	e.begin(null);
	for (let t = a; t < o; t++) {
		let n = +(t === a);
		for (let r = u + n; r <= d - n; r++) {
			let n = B(r - u, d - u + 1);
			t === a && (n = Math.min(n, 1)), e.set(r, t, C.TOP, n);
		}
	}
	if (c === "robe" || c === "dress" || c === "dancer") {
		let t = (c === "dancer" ? r.ground - 1 : r.robeHem) + n.bob, i = c === "robe" ? C.TOP : C.BOTTOM;
		for (let a = o; a <= t; a++) {
			let s = (a - o) / Math.max(1, t - o), c = Math.round(s * 1.5), f = a >= t - 2 && n.walk >= 0 ? l.trail - 1 : 0, p = u - c + +(a >= t - 1 && n.walk >= 0), m = d + c + f;
			for (let n = p; n <= m; n++) {
				let s = B(n - p, m - p + 1);
				a > o + 1 && n === r.cx && (s = Math.max(1, s - 1)), a === t && (s = Math.max(0, s - 1)), e.set(n, a, i, s);
			}
		}
	} else for (let t = o; t <= s; t++) {
		let r = u - +(t === s), i = d + +(t >= s - 1) + (t === s && n.walk, 0), a = c === "overalls" ? C.BOTTOM : C.TOP;
		for (let n = r; n <= i; n++) {
			let o = B(n - r, i - r + 1);
			t === s && (o = Math.max(1, o - 1)), e.set(n, t, a, o);
		}
	}
	if (e.end(), c === "tunic" || c === "vest" || c === "tabard") {
		for (let t = u; t <= d; t++) e.set(t, o, C.BELT, t === u ? 3 : t === d ? 1 : 2);
		e.set(u, o, C.GOLD, 3);
	} else if (c === "robe") {
		for (let t = u; t <= d; t++) e.set(t, o, C.SASH, t === u ? 3 : t === d ? 1 : 2);
		e.set(d + 1, o + 1, C.SASH, 1), e.set(d + 1, o + 2, C.SASH, 1);
		for (let t = a + 1; t <= r.robeHem + n.bob; t++) t !== o && e.set(u - +(t > o + 2), t, C.ACCENT, 3);
	} else if (c === "dress") {
		for (let t = u; t <= d; t++) e.set(t, o, C.ACCENT, 2);
		e.set(d + 1, o, C.ACCENT, 1), e.set(d + 2, o + 1, C.ACCENT, 1);
	} else if (c === "dancer") {
		for (let t = u; t <= d; t++) e.set(t, o - 1, C.SKIN, t === u ? 3 : 2);
		for (let t = u; t <= d; t++) e.set(t, o - 2, C.GOLD, 3);
		for (let t = u - 1; t <= d + 1; t++) e.set(t, o, C.GOLD, 3);
	} else if (c === "overalls") {
		for (let t = a + 2; t < o; t++) e.set(u, t, C.BOTTOM, 3), e.set(u + 1, t, C.BOTTOM, 2);
		e.set(u + 2, a, C.BOTTOM, 2), e.set(u + 2, a + 1, C.BOTTOM, 2), e.set(u + 1, a + 2, C.GOLD, 3);
	}
	if (c === "tabard") {
		for (let t = a; t <= s + 1; t++) e.set(u, t, C.TOP, 3), e.set(u + 1, t, C.TOP, 2);
		for (let t = a + 1; t < o; t++) for (let n = u + 2; n <= d; n++) e.set(n, t, C.METAL, n + t & 1 ? 1 : 2);
	}
	if (t.gear.apron) for (let t = a + 1; t <= (c === "dress" ? r.robeHem - 1 : s) + n.bob; t++) e.set(u - +(t > o + 1), t, C.WHITE, 3), t > o && e.set(u - (t > o + 1 ? 0 : -1), t, C.WHITE, 2);
	return {
		L: u,
		R: d,
		top: a,
		waist: o
	};
}
function tt(e, t, n, r) {
	let i = t.rig, a = n.bob + n.br, o = z(n), s = Ze(n, i.child), c = 0, l = i.child ? 2 : 3;
	n.walk === 0 && (c = l), n.walk === 2 && (c = -l), (n.walk === 1 || n.walk === 3) && (c = 0);
	let u = i.cx - 6, d = i.headY + a, f = ke.includes(t.weapon) ? t.weapon : null, p = n.act ? St(t, n, r ? "right" : "left") : null;
	p && K(e, p), t.cape && ot(e, t, n, "back"), t.hairStyle === "long" && t.hat;
	let m = (e) => -2 - Math.sign(e), h = null;
	if (p) q(e, t, p, "behind");
	else {
		let i = $e(e, t, n, !1, f && !r ? m(-c) : -c);
		f && !r && (h = nt(e, t, i[0] - 1, i[1], f)), t.weapon === "greatshield" && Ve(e, t, n, r, r ? null : i, r ? "shield" : "mace"), t.weapon === "hammer" && !r && T.hammerHanging(e, i[0], i[1], !0, !1);
	}
	p && xt(e), Qe(e, t, n, s[1], !0), p && K(e, p), it(e, t, n), p && xt(e), Qe(e, t, n, s[0], !1), p && K(e, p);
	let g = et(e, t, n);
	if (t.gear.beads && dt(e, t, n, g), t.gear.sashes) {
		e.begin(null);
		for (let t = 0; t < 7 + o.dy; t++) e.set(g.R + 1 + Math.floor(t / 2) + (n.walk >= 0 ? Math.floor(t / 3) : 0), i.waist + n.bob + t, C.GOLD, 2);
		e.end();
	}
	if (t.weapon === "sword" && rt(e, t, n, r), t.gear.satchel) {
		e.begin("all", 0);
		let t = r ? g.R - 1 : g.L, n = r ? [
			".443",
			"3332",
			".22."
		] : [
			"4443",
			"3g32",
			"3322",
			".22."
		];
		if (e.tpl(N(n, {
			2: [C.LEATHER, 1],
			3: [C.LEATHER, 2],
			4: [C.LEATHER, 3],
			g: [C.GOLD, 4]
		}), t, i.waist + a + 1), e.end(), !r) {
			e.begin(null);
			for (let t = g.top; t < i.waist + a + 1; t++) e.set(g.L + 2 + Math.floor((t - g.top) / 4), t, C.LEATHER, 1);
			e.end();
		}
	}
	if (t.gear.scarf && at(e, t, n, g), t.gear.pauldrons && !i.child) {
		e.begin("below", 1);
		let t = i.cx - 2, n = i.armTop + a - 1;
		e.tpl(N([
			".344.",
			"34432",
			"33221"
		], {
			1: [C.METAL, 0],
			2: [C.METAL, 1],
			3: [C.METAL, 2],
			4: [C.METAL, 3]
		}), t, n), e.end();
	}
	let _ = p ? q(e, t, p, "under") : $e(e, t, n, !0, f && r ? m(c) : c);
	if (t.gear.pauldrons && !i.child) {
		e.begin(null);
		let t = i.cx - 2, n = i.armTop + a - 1;
		e.tpl(N([
			".344.",
			"34432",
			"33221"
		], {
			1: [C.METAL, 0],
			2: [C.METAL, 1],
			3: [C.METAL, 2],
			4: [C.METAL, 3]
		}), t, n), e.end();
	}
	if (f && r && !p && (h = nt(e, t, _[0] - 1, _[1], f, !0)), t.weapon === "greatshield" && !p && Ve(e, t, n, r, r ? _ : null, r ? "mace" : "shield"), t.weapon === "hammer" && r && !p && T.hammerHanging(e, _[0], _[1], !0, !0), t.gear.book && !p && (e.begin("all", 1), e.tpl(N([
		"233",
		"343",
		"343",
		"221"
	], {
		1: [C.BOOK, 0],
		2: [C.BOOK, 1],
		3: [C.BOOK, 2],
		4: [C.WHITE, 3]
	}), _[0] - 2, _[1] - 3), e.set(_[0], _[1], C.SKIN, 3), e.end()), t.cape && ot(e, t, n, "front"), e.begin(null), e.tpl(ae.side, u, d), be(e, t, u, d, n), e.end(), t.hat !== "hood") {
		e.begin("below", 1);
		let r = P[t.hairStyle].side;
		if (xe(e, r.front, u, d, r.swayFrom, n.walk >= 0 ? o.trail - 1 : 0, Math.max(0, o.dy)), e.end(), t.hairStyle === "ponytail") {
			e.begin(null);
			let t = u + 11, r = d + 1;
			e.set(t, r, C.SCARF, 3);
			for (let i = 1; i < 9 + o.dy; i++) {
				let a = t + 1 + Math.floor(i / 3) + (n.walk >= 0 && i > 3 ? o.trail - 1 : 0);
				e.set(a, r + i, C.HAIR, i % 3 == 1 ? 3 : 2), i < 7 && e.set(a - 1, r + i, C.HAIR, 3), i > 2 && i < 6 && e.set(a + 1, r + i, C.HAIR, 1);
			}
			e.end();
		}
	} else e.begin("below", 1), e.tpl(N(["3432", "3.3."], A), u + 1, d + 3), e.end();
	if (t.beard && (e.begin(null), e.tpl(oe[t.beard].side, u, d), e.end()), t.ears === "pointed" && t.hat !== "hood" && t.hat !== "helmet" && t.hat !== "greathelm" && ct(e, u, d), t.hat !== "none" && F[t.hat] && (e.begin(t.hat === "circlet" ? null : "below", 1), e.tpl(F[t.hat].side, u, d, Je(t, F[t.hat].side)), e.end()), t.hat === "hood" && t.hoodTrim && T.hoodTrim(e, u, d, "side"), t.hat === "hood" && t.feather && lt(e, u, d, "side"), h && H(f) && (e.begin(null), U(e, t, h.x, h.y, f), e.end()), t.weapon === "lute") {
		e.begin("all", 1);
		let t = i.cx + 3, n = i.torsoTop + a + 2;
		e.tpl(N([
			".33.",
			"3432",
			"3432",
			"3322",
			".22."
		], {
			2: [C.WOOD, 1],
			3: [C.WOOD, 2],
			4: [C.WOOD, 3]
		}), t, n);
		for (let r = 1; r <= 5; r++) e.set(t + 1 - Math.floor(r / 3), n - r, C.WOOD, 2);
		e.end();
	}
	p && q(e, t, p, "over");
}
function nt(e, t, n, r, i, a = !1) {
	let o = t.rig, s = Ne(i, r), c = H(i) ? Pe : 0, l = (e) => n - Math.round((r - e) * c), u = Ae(i);
	e.begin(null);
	for (let t = s; t <= o.ground; t++) e.set(l(t), t, u, a ? 3 : 2);
	return i === "cane" ? (e.set(n, s, C.WOOD, 3), e.set(n - 1, s - 1, C.WOOD, 3), e.set(n - 2, s - 1, C.WOOD, 2), e.set(n - 3, s, C.WOOD, 1)) : U(e, t, l(s), s, i), e.end(), {
		x: l(s),
		y: s
	};
}
function rt(e, t, n, r) {
	let i = t.rig, a = n.bob + n.br, o = i.waist + a;
	e.begin(r ? null : "all", 0);
	let s = i.cx - 4;
	n.act || (e.set(s - 1, o - 2, C.GOLD, 4), e.set(s, o - 1, C.LEATHER, 2)), e.set(s + 1, o - 1, C.GOLD, 3), e.set(s + 1, o, C.GOLD, 2), n.act || e.set(s + 1, o - 2, C.GOLD, 3);
	for (let t = 0; t < 9; t++) {
		let n = s + 2 + t, i = o + Math.floor(t / 2.5);
		e.set(n, i, C.LEATHER, r ? 1 : 2), e.set(n, i + 1, C.LEATHER, +!r);
	}
	e.set(s + 11, o + 4, C.METAL, 3), e.end();
}
function it(e, t, n) {
	let r = t.rig, i = n.bob + n.br, a = r.torsoTop + i;
	if (t.gear.pack) {
		e.begin(null);
		let t = r.cx + 2, n = a - 4;
		for (let r = n; r <= a + 9; r++) for (let n = t; n <= t + 6; n++) e.set(n, r, C.PACK, n === t ? 3 : n >= t + 5 ? 1 : 2);
		for (let r = t - 1; r <= t + 7; r++) e.set(r, n - 1, C.CAPE, 3), e.set(r, n - 2, C.CAPE, 2), e.set(r, n, C.CAPE, 1);
		e.set(t - 1, n - 1, C.CAPE, 4), e.set(t - 1, n - 2, C.CAPE, 3);
		for (let r = n + 1; r <= a + 8; r++) e.set(t + 3, r, C.LEATHER, 1);
		e.set(t + 3, n + 4, C.GOLD, 4), e.set(t + 7, a + 3, C.METAL, 2), e.set(t + 7, a + 4, C.METAL, 1), e.end();
	}
	if (t.gear.quiver) {
		e.begin(null);
		let t = r.cx + 3;
		for (let n = 0; n < 9; n++) e.set(t + Math.floor(n / 4), a - 2 + n, C.LEATHER, 2), e.set(t + 1 + Math.floor(n / 4), a - 2 + n, C.LEATHER, 1);
		e.set(t, a - 3, C.WHITE, 4), e.set(t - 1, a - 4, C.WHITE, 3), e.set(t + 1, a - 3, C.SCARF, 3), e.set(t + 1, a - 4, C.SCARF, 2), e.end();
	}
	if (t.weapon === "bow" && !n.act) {
		e.begin(null);
		let t = r.cx + 1;
		for (let n = 0; n <= 14; n++) {
			let r = n / 14, i = t + Math.round(Math.sin(r * Math.PI) * 3);
			e.set(i, a - 3 + n, C.WOOD, 3);
		}
		for (let n = 1; n < 14; n++) e.set(t, a - 3 + n, C.STRING, 3);
		e.end();
	}
}
function at(e, t, n, r) {
	t.rig;
	let i = z(n), a = r.top;
	e.begin("below", 0);
	for (let t = r.L; t <= r.R + 1; t++) e.set(t, a - 1, C.SCARF, t === r.L ? 4 : 3), e.set(t, a, C.SCARF, t === r.L ? 3 : 2);
	let o = n.walk >= 0;
	for (let t = 0; t < 6; t++) {
		let n = r.R + 1 + t, s = a + (o ? Math.floor(t / 3) + ((t + i.sway) % 2 == 0 ? 0 : 1) - 1 + +(i.dy > 0) : t), c = o ? n : r.R + 1 + Math.floor(t / 3);
		e.set(c, s + 1, C.SCARF, t % 2 ? 1 : 2), o && t < 4 && e.set(c, s + 2, C.SCARF, 1);
	}
	e.end();
}
function ot(e, t, n, r) {
	let i = t.rig, a = n.bob + n.br, o = z(n), s = i.torsoTop + a, c = n.walk >= 0, l = (t.cape.style === "short" ? s + 6 : i.robeHem - +!!c) + (c ? o.dy : 0);
	if (r === "back") {
		e.begin(null);
		for (let t = s; t <= l; t++) {
			let n = (t - s) / Math.max(1, l - s), r = Math.round(c ? n * n * (1.5 + o.trail) : n * 1.2), a = i.cx - 1 + (c ? Math.round(n * 1) : 0), u = i.cx + 4 + r;
			for (let n = a; n <= u; n++) {
				let r = n === a ? 3 : n >= u - 1 ? 1 : 2;
				if (t > s + 4 && n === u - 3 && (r = 1), t > s + 4 && n === u - 4 && (r = 3), t === l && (r = Math.max(0, r - 1)), c && n === u && t > s + 3) {
					e.set(n, t, C.CAPEIN, 2);
					continue;
				}
				e.set(n, t, C.CAPE, r);
			}
		}
		e.end();
	} else if (t.cape.style === "cloak") e.begin("below", 1), e.tpl(we, i.cx, s), e.end();
	else {
		e.begin("below", 1);
		let t = s;
		for (let n = i.cx - 3; n <= i.cx + 4; n++) e.set(n, t, C.CAPE, n < i.cx ? 3 : 2), e.set(n, t + 1, C.CAPE, n < i.cx - 1 ? 3 : 1);
		e.set(i.cx - 3, t, C.GOLD, 4), e.end();
	}
}
function st(e, t, n, r) {
	e.begin(null);
	for (let [r, i, a] of [
		[
			-1,
			7,
			3
		],
		[
			-1,
			6,
			2
		],
		[
			-2,
			6,
			3
		],
		[
			-2,
			5,
			4
		],
		[
			-3,
			5,
			3
		],
		[
			-3,
			4,
			4
		],
		[
			-4,
			3,
			3
		],
		[
			0,
			6,
			2
		],
		[
			0,
			7,
			1
		]
	]) e.set(t + r, n + i, C.SKIN, a);
	for (let [r, i, a] of [
		[
			12,
			7,
			1
		],
		[
			12,
			6,
			1
		],
		[
			13,
			6,
			2
		],
		[
			13,
			5,
			2
		],
		[
			14,
			5,
			1
		],
		[
			14,
			4,
			2
		],
		[
			15,
			3,
			1
		],
		[
			11,
			6,
			1
		],
		[
			11,
			7,
			0
		]
	]) e.set(t + r, n + i, C.SKIN, a);
	r || (e.set(t - 1, n + 6, C.SKIN, 1), e.set(t + 12, n + 6, C.SKIN, 0)), e.end();
}
function ct(e, t, n) {
	e.begin("all", 1);
	for (let [r, i, a] of [
		[
			13,
			4,
			3
		],
		[
			14,
			4,
			4
		],
		[
			11,
			5,
			3
		],
		[
			12,
			5,
			3
		],
		[
			13,
			5,
			2
		],
		[
			8,
			6,
			3
		],
		[
			9,
			6,
			3
		],
		[
			10,
			6,
			3
		],
		[
			11,
			6,
			2
		],
		[
			12,
			6,
			1
		],
		[
			7,
			7,
			2
		],
		[
			8,
			7,
			1
		],
		[
			9,
			7,
			1
		],
		[
			10,
			7,
			1
		],
		[
			7,
			8,
			1
		]
	]) e.set(t + r, n + i, C.SKIN, a);
	e.set(t + 9, n + 7, C.BLUSH, 1), e.set(t + 10, n + 7, C.SKIN, 0), e.end();
}
function lt(e, t, n, r) {
	e.begin("all", 1);
	let i = r === "side" ? [
		[
			9,
			-1,
			3
		],
		[
			10,
			-2,
			4
		],
		[
			11,
			-3,
			3
		],
		[
			12,
			-4,
			1
		],
		[
			10,
			-1,
			2
		],
		[
			11,
			-1,
			3
		],
		[
			12,
			-2,
			3
		],
		[
			13,
			-2,
			1
		],
		[
			9,
			-2,
			2
		],
		[
			9,
			-3,
			3
		],
		[
			9,
			-4,
			1
		]
	] : r === "up" ? [
		[
			4,
			-1,
			3
		],
		[
			3,
			-2,
			3
		],
		[
			2,
			-3,
			1
		],
		[
			6,
			-1,
			3
		],
		[
			6,
			-2,
			4
		],
		[
			6,
			-3,
			3
		],
		[
			6,
			-4,
			1
		],
		[
			8,
			-1,
			2
		],
		[
			9,
			-2,
			3
		],
		[
			10,
			-3,
			1
		]
	] : [
		[
			8,
			-1,
			3
		],
		[
			9,
			-2,
			4
		],
		[
			10,
			-3,
			3
		],
		[
			11,
			-4,
			1
		],
		[
			7,
			-2,
			3
		],
		[
			7,
			-3,
			4
		],
		[
			7,
			-4,
			1
		],
		[
			9,
			-1,
			2
		],
		[
			10,
			-1,
			3
		],
		[
			11,
			-2,
			3
		],
		[
			12,
			-2,
			1
		]
	];
	for (let [r, a, o] of i) e.set(t + r, n + a, o === 1 ? C.SCARF : C.FEATHER, o === 1 ? 2 : o);
	e.end();
}
function ut(e, t, n, r) {
	let i = t.rig, a = i.torsoTop + n.bob + n.br;
	e.begin(null);
	let o = i.half * 2;
	for (let t = 0; t < o; t++) {
		let n = i.cx - i.half + t, s = r ? 0 : +(Math.min(t, o - 1 - t) >= 2);
		e.set(n, a + s, C.BONE, t % 2 ? 2 : 4);
	}
	r || (e.set(i.cx - 1, a + 2, C.BONE, 4), e.set(i.cx, a + 2, C.BONE, 3), e.set(i.cx - 1, a + 3, C.BONE, 2)), e.end();
}
function dt(e, t, n, r) {
	e.begin(null);
	for (let t = r.L; t <= r.R; t++) e.set(t, r.top + +(t <= r.L + 1), C.BONE, t % 2 ? 2 : 4);
	e.set(r.L, r.top + 2, C.BONE, 3), e.end();
}
function ft(e, t, n, r) {
	let i = r + 6, a = n + 3, o = n + 8;
	e.set(a, i, C.EYE, 3), e.set(a, i + 1, C.EYE, 2), e.set(a + 1, i + 1, C.EYE, 0), e.set(o, i, C.EYE, 3), e.set(o, i + 1, C.EYE, 2), e.set(o - 1, i + 1, C.EYE, 0), e.set(a - 1, i - 2, C.SKIN, 0), e.set(a, i - 1, C.SKIN, 0), e.set(a + 1, i - 1, C.SKIN, 0), e.set(o + 1, i - 2, C.SKIN, 0), e.set(o, i - 1, C.SKIN, 0), e.set(o - 1, i - 1, C.SKIN, 0), e.set(n + 6, r + 8, C.SKIN, 1);
	for (let t = n + 4; t <= n + 7; t++) e.set(t, r + 9, C.EYE, 0);
	e.set(n + 5, r + 9, C.EYE, 4);
}
function pt(e, t, n, r) {
	let i = r + 6;
	e.set(n + 2, i, C.EYE, 3), e.set(n + 2, i + 1, C.EYE, 2), e.set(n + 3, i + 1, C.EYE, 0), e.set(n + 1, i - 1, C.SKIN, 0), e.set(n + 2, i - 1, C.SKIN, 0), e.set(n + 3, i - 2, C.SKIN, 0), e.set(n, r + 8, C.SKIN, 1), e.set(n + 1, r + 9, C.EYE, 0), e.set(n + 2, r + 9, C.EYE, 0), e.set(n + 1, r + 10, C.EYE, 4);
}
var mt = /* @__PURE__ */ new Set(["hurt", "down"]), ht = [
	{
		key: "wind",
		bob: 0,
		br: 0,
		walk: -1,
		act: "wind",
		phase: 0,
		lag: {
			dy: 0,
			sway: -1,
			trail: 1
		}
	},
	{
		key: "slash",
		bob: 0,
		br: 0,
		walk: -1,
		act: "slash",
		phase: 1,
		lag: {
			dy: 0,
			sway: 1,
			trail: 3
		}
	},
	{
		key: "follow",
		bob: 0,
		br: 0,
		walk: -1,
		act: "follow",
		phase: 2,
		lag: {
			dy: 1,
			sway: 1,
			trail: 2
		}
	},
	{
		key: "backhand",
		bob: 0,
		br: 0,
		walk: -1,
		act: "backhand",
		phase: 1,
		lag: {
			dy: 0,
			sway: -1,
			trail: 3
		}
	},
	{
		key: "thrust",
		bob: 1,
		br: 0,
		walk: -1,
		act: "thrust",
		phase: 1,
		lag: {
			dy: 0,
			sway: 1,
			trail: 3
		}
	},
	{
		key: "spin",
		bob: 0,
		br: 0,
		walk: -1,
		act: "spin",
		phase: 1,
		lag: {
			dy: -1,
			sway: 1,
			trail: 4
		}
	},
	{
		key: "cast",
		bob: 0,
		br: -1,
		walk: -1,
		act: "cast",
		phase: -1,
		lag: {
			dy: 0,
			sway: 0,
			trail: 1
		}
	},
	{
		key: "aim",
		bob: 0,
		br: 0,
		walk: -1,
		act: "aim",
		phase: -1,
		lag: {
			dy: 0,
			sway: 0,
			trail: 1
		}
	},
	{
		key: "hurt",
		bob: 0,
		br: 0,
		walk: -1,
		act: "hurt",
		phase: -1,
		lag: {
			dy: -1,
			sway: -1,
			trail: 0
		}
	},
	{
		key: "tuck",
		bob: 4,
		br: 0,
		walk: -1,
		act: "tuck",
		phase: -1,
		lag: {
			dy: 0,
			sway: 0,
			trail: 2
		}
	},
	{
		key: "roll",
		bob: 4,
		br: 0,
		walk: -1,
		act: "roll",
		phase: -1,
		lag: {
			dy: 0,
			sway: 0,
			trail: 2
		}
	},
	{
		key: "down",
		bob: 0,
		br: 0,
		walk: -1,
		act: "down",
		phase: -1,
		lag: {
			dy: 0,
			sway: 0,
			trail: 1
		}
	}
], G = {
	wind: {
		side: {
			lean: [1, 0],
			w: {
				h: [4, 2],
				l: "behind",
				d: [1, -.45]
			},
			o: {
				h: [-3, 3],
				l: "under"
			},
			legs: "stance"
		},
		down: {
			w: {
				h: [-2, -2],
				d: [-.55, -1]
			},
			o: { h: [1, 4] },
			legs: { spread: 1 }
		},
		up: {
			w: {
				h: [2, 4],
				d: [.7, .8]
			},
			o: { h: [-1, 4] },
			legs: { spread: 1 }
		}
	},
	slash: {
		side: {
			lean: [-1, 0],
			w: {
				h: [-5, 3],
				l: "under",
				d: [-1, .3]
			},
			o: {
				h: [3, 3],
				l: "behind"
			},
			legs: "lunge"
		},
		down: {
			w: {
				h: [7, 4],
				d: [.9, .8]
			},
			o: { h: [-1, 4] },
			legs: { spread: 1 }
		},
		up: {
			w: {
				h: [-8, -1],
				l: "behind",
				d: [-.7, -1]
			},
			o: { h: [1, 4] },
			legs: { spread: 1 }
		}
	},
	follow: {
		side: {
			lean: [-1, 0],
			w: {
				h: [-4, 5],
				l: "under",
				d: [-.45, 1]
			},
			o: {
				h: [3, 2],
				l: "behind"
			},
			legs: "stance"
		},
		down: {
			w: {
				h: [9, 4],
				d: [1, .35]
			},
			o: { h: [1, 3] },
			legs: { spread: 1 }
		},
		up: {
			w: {
				h: [-9, 3],
				l: "behind",
				d: [-1, .35]
			},
			o: { h: [-1, 3] },
			legs: { spread: 1 }
		}
	},
	backhand: {
		side: {
			lean: [0, 0],
			w: {
				h: [-5, 1],
				l: "under",
				d: [-1, -.7]
			},
			o: {
				h: [3, 4],
				l: "behind"
			},
			legs: "stance"
		},
		down: {
			w: {
				h: [-2, 4],
				d: [-1, .55]
			},
			o: { h: [-1, 4] },
			legs: { spread: 1 }
		},
		up: {
			w: {
				h: [0, -2],
				d: [.55, -1]
			},
			o: { h: [-1, 4] },
			legs: { spread: 1 }
		}
	},
	thrust: {
		side: {
			lean: [-2, 0],
			w: {
				h: [-5, 2],
				l: "under",
				d: [-1, 0]
			},
			o: {
				h: [4, 1],
				l: "behind"
			},
			legs: "lunge"
		},
		down: {
			w: {
				h: [4, 3],
				d: [0, 1]
			},
			o: { h: [-4, 3] },
			legs: {
				spread: 1,
				lifts: [0, 1]
			}
		},
		up: {
			w: {
				h: [2, -2],
				d: [0, -1]
			},
			o: { h: [-2, 3] },
			legs: {
				spread: 1,
				lifts: [1, 0]
			}
		}
	},
	spin: {
		side: {
			lean: [0, 0],
			w: {
				h: [5, 1],
				l: "behind",
				d: [1, .1]
			},
			o: {
				h: [-5, 1],
				l: "under"
			},
			legs: "wide"
		},
		down: {
			w: {
				h: [-3, 0],
				d: [-1, .2]
			},
			o: { h: [3, 0] },
			legs: { spread: 2 }
		},
		up: {
			w: {
				h: [3, 0],
				d: [1, .2]
			},
			o: { h: [-3, 0] },
			legs: { spread: 2 }
		}
	},
	cast: {
		side: {
			lean: [0, 0],
			w: {
				h: [-7, -2],
				l: "under",
				d: [-.2, -1]
			},
			o: {
				h: [-6, -1],
				l: "under"
			},
			legs: "idle"
		},
		down: {
			w: {
				h: [-3, -4],
				d: [0, -1]
			},
			o: { h: [3, -4] },
			legs: { spread: 0 }
		},
		up: {
			w: {
				h: [3, -4],
				d: [0, -1]
			},
			o: { h: [-3, -4] },
			legs: { spread: 0 }
		}
	},
	aim: {
		side: {
			lean: [0, 0],
			w: {
				h: [1, 5],
				l: "behind",
				d: [.35, 1]
			},
			o: {
				h: [-3, -2],
				l: "over",
				item: "flask"
			},
			legs: "idle"
		},
		down: {
			w: {
				h: [0, 5],
				d: [-.25, 1]
			},
			o: {
				h: [-4, -3],
				l: "over",
				item: "flask"
			},
			legs: { spread: 0 }
		},
		up: {
			w: {
				h: [0, 5],
				d: [.25, 1]
			},
			o: {
				h: [3, -3],
				l: "behind",
				item: "flask"
			},
			legs: { spread: 0 }
		}
	},
	hurt: {
		side: {
			lean: [1, 0],
			w: {
				h: [4, 3],
				l: "behind",
				d: [.8, .7]
			},
			o: {
				h: [-3, 1],
				l: "under"
			},
			legs: "stagger"
		},
		down: {
			lean: [0, -1],
			w: {
				h: [-3, 1],
				d: [-1, .8]
			},
			o: { h: [3, 1] },
			legs: {
				spread: 1,
				lifts: [1, 0]
			}
		},
		up: {
			lean: [0, 1],
			w: {
				h: [3, 1],
				d: [1, .8]
			},
			o: { h: [-3, 1] },
			legs: {
				spread: 1,
				lifts: [0, 1]
			}
		}
	},
	tuck: {
		side: {
			lean: [0, 0],
			w: {
				h: [-2, 3],
				l: "under",
				d: [-.6, 1]
			},
			o: {
				h: [-3, 3],
				l: "under"
			},
			legs: "crouch"
		},
		down: {
			w: {
				h: [3, 3],
				d: [-.7, -1]
			},
			o: { h: [-3, 3] },
			legs: { spread: 0 }
		},
		up: {
			w: {
				h: [-3, 3],
				d: [.7, -1]
			},
			o: { h: [3, 3] },
			legs: { spread: 0 }
		}
	},
	down: {
		side: {
			lean: [0, 0],
			w: {
				h: [1, 5],
				l: "under",
				d: [.2, 1]
			},
			o: {
				h: [-1, 5],
				l: "under"
			},
			legs: "idle"
		},
		down: {
			w: {
				h: [-1, 5],
				d: [-.2, 1]
			},
			o: { h: [1, 5] },
			legs: { spread: 0 }
		},
		up: {
			w: {
				h: [1, 5],
				d: [.2, 1]
			},
			o: { h: [-1, 5] },
			legs: { spread: 0 }
		}
	}
}, gt = {
	aim: {
		side: {
			w: {
				h: [-1, 0],
				hc: [0, 1],
				l: "over"
			},
			o: {
				h: [-6, 1],
				hc: [-7, 1],
				l: "over"
			},
			b: [-1, .35],
			drawn: !0,
			legs: "stance"
		},
		down: {
			w: {
				h: [-3, 1],
				hc: [5, 1],
				l: "over"
			},
			o: {
				h: [-3, 3],
				hc: [4, 1],
				l: "over"
			},
			b: [1, .25],
			drawn: !0,
			legs: { spread: 1 }
		},
		up: {
			w: {
				h: [-1, 0],
				hc: [-3, -3],
				l: "over"
			},
			o: {
				h: [2, 1],
				hc: [-3, -2],
				l: "under"
			},
			b: [-1, -.3],
			drawn: !0,
			legs: { spread: 1 }
		}
	},
	follow: {
		side: {
			w: {
				h: [3, 0],
				hc: [3, -3],
				l: "behind"
			},
			o: {
				h: [-6, 1],
				hc: [-6, -4],
				l: "over"
			},
			b: [-1, 0],
			drawn: !1,
			legs: "stance"
		},
		down: {
			w: {
				h: [-1, 4],
				hc: [2, 0]
			},
			o: {
				h: [-3, 3],
				hc: [3, -2],
				l: "over"
			},
			b: [1, .3],
			drawn: !1,
			legs: { spread: 1 }
		},
		up: {
			w: {
				h: [2, 2],
				hc: [-1, 0]
			},
			o: {
				h: [2, 1],
				hc: [-3, -2],
				l: "under"
			},
			b: [-1, -.3],
			drawn: !1,
			legs: { spread: 1 }
		}
	},
	cast: {
		side: {
			w: {
				h: [-2, -2],
				l: "over"
			},
			o: {
				h: [-5, -3],
				l: "over"
			},
			b: [-.6, -1],
			drawn: !0,
			legs: "idle"
		},
		down: {
			w: { h: [1, -1] },
			o: { h: [4, -4] },
			b: [.35, -1],
			drawn: !0,
			legs: { spread: 0 }
		},
		up: {
			w: { h: [-1, -1] },
			o: { h: [-4, -4] },
			b: [-.35, -1],
			drawn: !0,
			legs: { spread: 0 }
		}
	},
	thrust: {
		side: {
			lean: [-2, 0],
			w: {
				h: [-4, 3],
				l: "under"
			},
			o: {
				h: [-6, 1],
				l: "under"
			},
			b: [-1, 0],
			drawn: !1,
			legs: "lunge"
		},
		down: {
			w: { h: [4, 3] },
			o: { h: [-4, 3] },
			b: [-.5, 1],
			drawn: !1,
			legs: {
				spread: 1,
				lifts: [0, 1]
			}
		},
		up: {
			w: { h: [-3, 2] },
			o: { h: [3, 2] },
			b: [.5, -1],
			drawn: !1,
			legs: { spread: 1 }
		}
	}
}, _t = {
	cast: {
		side: {
			w: {
				h: [-4, -3],
				hc: [-6, -5],
				l: "over",
				d: [-.12, -1]
			},
			o: {
				h: [-4, -1],
				hc: [-5, -3],
				l: "over"
			},
			legs: "idle"
		},
		down: {
			w: {
				h: [-4, -3],
				hc: [-3, -6],
				d: [0, -1]
			},
			o: {
				h: [4, -3],
				hc: [3, -4]
			},
			legs: { spread: 0 }
		},
		up: {
			w: {
				h: [4, -3],
				hc: [3, -6],
				d: [0, -1]
			},
			o: {
				h: [-4, -3],
				hc: [-3, -4]
			},
			legs: { spread: 0 }
		}
	},
	aim: {
		side: {
			lean: [-1, 0],
			w: {
				h: [-5, 1],
				l: "under",
				d: [-1, -.4]
			},
			o: {
				h: [3, 3],
				l: "behind"
			},
			legs: "stance"
		},
		down: {
			w: {
				h: [4, 3],
				d: [.35, 1]
			},
			o: { h: [1, 3] },
			legs: { spread: 1 }
		},
		up: {
			w: {
				h: [0, -2],
				d: [.3, -1]
			},
			o: { h: [-1, 3] },
			legs: { spread: 1 }
		}
	},
	tuck: {
		side: {
			w: {
				h: [-3, 2],
				l: "under",
				d: [-.2, -1]
			},
			o: {
				h: [-2, 3],
				l: "under"
			},
			legs: "crouch"
		},
		down: {
			w: {
				h: [0, 2],
				d: [0, -1]
			},
			o: { h: [-3, 3] },
			legs: { spread: 0 }
		},
		up: {
			w: {
				h: [0, 2],
				d: [0, -1]
			},
			o: { h: [3, 3] },
			legs: { spread: 0 }
		}
	}
}, vt = {
	wind: {
		side: { o: {
			h: [-4, 2],
			l: "under"
		} },
		down: { o: { h: [0, 3] } },
		up: { o: { h: [0, 3] } }
	},
	thrust: {
		side: {
			lean: [-2, 0],
			w: {
				h: [4, 2],
				l: "behind",
				d: [.9, -.6]
			},
			o: {
				h: [-7, 2],
				l: "under"
			}
		},
		down: {
			w: {
				h: [-2, 0],
				d: [-.6, -1]
			},
			o: { h: [-4, 3] }
		},
		up: {
			w: {
				h: [2, 0],
				d: [.6, -1]
			},
			o: { h: [4, 3] }
		}
	},
	slash: {
		side: { o: {
			h: [-2, 3],
			l: "under"
		} },
		down: { o: { h: [1, 4] } },
		up: { o: { h: [-1, 4] } }
	},
	follow: {
		side: { o: {
			h: [-2, 3],
			l: "under"
		} },
		down: { o: { h: [1, 3] } },
		up: { o: { h: [-1, 3] } }
	},
	backhand: {
		side: {
			w: {
				h: [3, -5],
				l: "behind",
				d: [.5, -1]
			},
			o: {
				h: [-4, 2],
				l: "under"
			}
		},
		down: {
			w: {
				h: [-2, -5],
				d: [-.4, -1]
			},
			o: { h: [0, 3] }
		},
		up: {
			w: {
				h: [2, -5],
				d: [.4, -1]
			},
			o: { h: [0, 3] }
		}
	},
	cast: {
		side: {
			w: {
				h: [3, -4],
				l: "behind",
				d: [.3, -1]
			},
			o: {
				h: [-5, -2],
				l: "under"
			}
		},
		down: {
			w: {
				h: [-3, -4],
				d: [-.3, -1]
			},
			o: { h: [3, -3] }
		},
		up: {
			w: {
				h: [3, -4],
				d: [.3, -1]
			},
			o: { h: [-3, -3] }
		}
	},
	spin: {
		side: { o: {
			h: [-5, 1],
			l: "under"
		} },
		down: { o: { h: [3, 1] } },
		up: { o: { h: [-3, 1] } }
	},
	aim: {
		side: { o: {
			h: [-4, 2],
			l: "under"
		} },
		down: { o: { h: [1, 3] } },
		up: { o: { h: [-1, 3] } }
	}
};
function yt(e, t) {
	switch (e.act === "roll" ? "crouch" : G[e.act]?.side.legs ?? "idle") {
		case "stance": return [t(-2, -3), t(2, 3, 0, !0)];
		case "lunge": return [t(-3, -4), t(3, 5, 0, !0)];
		case "wide": return [t(-2, -4), t(2, 4)];
		case "stagger": return [t(-1, -2), t(2, 3, 0, !0)];
		case "crouch": return [t(-2, -2), t(1, 1)];
		default: return [t(-1, -1), t(1, 1)];
	}
}
function bt(e, t) {
	let n = G[e.act]?.[t ? "up" : "down"]?.legs ?? {};
	return {
		spread: n.spread ?? 0,
		lifts: n.lifts ?? [0, 0]
	};
}
function K(e, t) {
	e.ox = t.lean[0], e.oy = t.lean[1];
}
function xt(e) {
	e.ox = 0, e.oy = 0;
}
function St(e, t, n) {
	let r = e.rig, i = n === "left" || n === "right", a = i ? "side" : n, o = G[t.act] ?? G.down, s = e.weapon === "bow" ? gt[t.act]?.[a] : null, c = H(e.weapon) ? _t[t.act]?.[a] : null, l = e.weapon === "greatshield", u = l ? vt[t.act]?.[a] : null, d = e.weapon === "hammer" ? T.HAMMER_ACTS[t.act]?.[a] : null, f = {
		...o[a],
		...c || {},
		...u || {},
		...d || {},
		...s || {}
	}, p = r.child ? .75 : 1, m = r.child ? .6 : 1, h = t.bob + t.br, g = r.armTop + h, _ = (e) => {
		if (i) return [r.cx - 1, g];
		let t = [r.cx - r.half - 2, g], a = [r.cx + r.half, g];
		return e === "w" == (n === "down") ? t : a;
	}, v = n === "right", y = [];
	for (let e of ["w", "o"]) {
		let t = f[e];
		if (!t) continue;
		let [a, o] = _(e), s = a + (r.child && t.hc ? t.hc[0] : Math.round(t.h[0] * p)), c = o + (r.child && t.hc ? t.hc[1] : Math.round(t.h[1] * m)), u = i ? e === "w" !== v : !1, d = t.l ?? "under";
		i && !u && d === "behind" && (d = "under"), l && i && e === "o" && u && (d = "behind"), y.push({
			which: e,
			sx: a,
			sy: o,
			hx: s,
			hy: c,
			near: !i || !u,
			layer: d,
			d: t.d ?? null,
			item: l && e === "o" ? null : t.item ?? null,
			view: n
		});
	}
	let b = e.weapon === "bow" ? {
		b: f.b ?? (i ? [-1, 0] : n === "down" ? [-.5, 1] : [.5, -1]),
		drawn: !!f.drawn
	} : null;
	return {
		lean: f.lean ?? [0, 0],
		arms: y,
		bow: b,
		key: a,
		view: n,
		child: r.child
	};
}
function Ct(e) {
	let t = e.outfit.style;
	return t === "vest" || t === "overalls" ? C.SHIRT : t === "tabard" ? C.METAL : t === "dancer" ? C.SKIN : C.TOP;
}
function q(e, t, n, r) {
	let i;
	for (let a of n.arms) if (a.layer === r) {
		if (wt(e, t, a), i = [a.hx, a.hy], a.which === "w" && t.weapon !== "bow" && Dt(e, t, n, a), a.which === "o" && t.weapon === "bow") {
			Mt(e, t, n, a);
			let r = n.arms.find((e) => e.which === "w");
			n.bow.drawn && r && Nt(e, t, n, r);
		}
		a.which === "o" && t.weapon === "greatshield" && kt(e, n, a, W(t)), a.item === "flask" && t.weapon !== "bow" && !H(t.weapon) && Pt(e, a.hx, a.hy, n.view);
	}
	return i;
}
function wt(e, t, n) {
	let r = t.rig, i = Ct(t), a = t.gear.gloves ? C.LEATHER : C.SKIN, o = n.near && (n.view !== "up" || n.which === "o") ? 3 : n.near ? 2 : 1;
	e.begin(n.near ? "all" : null, 1);
	let s = n.hx - n.sx, c = n.hy - n.sy, l = Math.max(Math.abs(s), Math.abs(c), 1), u = Math.abs(c) >= Math.abs(s);
	for (let t = 0; t < l; t++) {
		let r = Math.round(n.sx + s * t / l), a = Math.round(n.sy + c * t / l), d = t === 0;
		e.set(r, a, i, d ? Math.min(4, o + 1) : o), u ? e.set(r + 1, a, i, o - 1) : e.set(r, a + 1, i, o - 1);
	}
	let d = Math.round(n.sx + s * (l - 1) / l), f = Math.round(n.sy + c * (l - 1) / l);
	t.gear.bracers && !r.child && (e.set(d, f, C.METAL, o), e.set(u ? d + 1 : d, u ? f : f + 1, C.METAL, o - 1)), t.outfit.style === "robe" && (e.set(d, f, C.ACCENT, o), e.set(u ? d + 1 : d, u ? f : f + 1, C.ACCENT, o - 1)), e.set(n.hx, n.hy, a, o), e.set(n.hx + 1, n.hy, a, o - 1), r.child || (e.set(n.hx, n.hy + 1, a, o - 1), e.set(n.hx + 1, n.hy + 1, a, Math.max(0, o - 2))), e.end();
}
function Tt(e) {
	let t = Math.hypot(e[0], e[1]) || 1;
	return [e[0] / t, e[1] / t];
}
var Et = null, J = (e, t) => {
	let n = e + Et.ox, r = t + Et.oy;
	return n >= 2 && n <= 29 && r >= 2 && r <= 30;
};
function Dt(e, t, n, r) {
	if (!r.d) return;
	let i = Tt(r.d), a = r.hx + .5, o = r.hy + (n.child ? 0 : .5);
	t.weapon === "sword" ? At(e, a, o, i, n.child ? 4 : 5, r.near) : t.weapon === "hammer" ? T.hammerDrawn(e, a, o, i, r.near) : ke.includes(t.weapon) ? jt(e, t, a, o, i, 6, 2, t.weapon, r.near) : t.weapon === "greatshield" && Ot(e, a, o, i, r.near);
}
function Ot(e, t, n, r, i) {
	let [a, o] = r, s = -o, c = a;
	e.begin("all", 0);
	let l = (e, r = 0) => [Math.round(t + a * e + s * r - .5), Math.round(n + o * e + c * r - .5)], u = (t, n, r) => {
		J(t[0], t[1]) && e.set(t[0], t[1], n, r);
	};
	u(l(-1.2), C.METAL, 2), u(l(.6), C.LEATHER, 2), u(l(1.8), C.WOOD, i ? 3 : 2), u(l(2.9), C.WOOD, i ? 2 : 1), u(l(4.2), C.METAL, i ? 4 : 3), u(l(5.2), C.METAL, i ? 3 : 2), u(l(4.4, -1.1), C.METAL, 3), u(l(4.4, 1.1), C.METAL, 1), u(l(5.6, -.9), C.METAL, 2), u(l(5.6, .9), C.METAL, 1), u(l(6.3), C.METAL, i ? 4 : 3), e.end();
}
function kt(e, t, n, r = null) {
	e.begin("all", 0), t.key === "side" ? Re(e, n.hx - 2, n.hy - 6, r) : t.key === "up" ? Le(e, n.hx - 4, n.hy - 6) : Ie(e, n.hx - (n.hx - n.sx < -1 ? 3 : 1), n.hy - 6, r), e.end();
}
function At(e, t, n, r, i, a) {
	let [o, s] = r, c = -s, l = o;
	e.begin("all", 0);
	let u = (e, r = 0) => [Math.round(t + o * e + c * r - .5), Math.round(n + s * e + l * r - .5)], d = (t, n, r) => {
		J(t[0], t[1]) && e.set(t[0], t[1], n, r);
	};
	d(u(-1.4), C.GOLD, 3), d(u(1.3, -1), C.GOLD, 4), d(u(1.3), C.GOLD, 3), d(u(1.3, 1), C.GOLD, 2);
	for (let e = 0; e < i; e++) {
		let t = 2.2 + e, n = e === i - 1;
		d(u(t), C.BLADE, n ? 3 : 4), !n && e < i - 2 && Math.abs(o) > .35 && Math.abs(s) > .35 && d(u(t + .5, s > 0 == o > 0 ? .6 : -.6), C.BLADE, a ? 2 : 1);
	}
	e.end();
}
function jt(e, t, n, r, i, a, o, s, c) {
	let [l, u] = i, d = Ae(s);
	e.begin(null);
	let f = null;
	for (let t = -o; t <= a; t += .5) {
		let i = Math.round(n + l * t - .5), a = Math.round(r + u * t - .5);
		J(i, a) && (e.set(i, a, d, c ? 3 : 2), f = [i, a]);
	}
	if (e.end(), f && s !== "cane") {
		e.begin("all", 1);
		let [n, r] = f, i = (t, n, r, i) => {
			J(t, n) && e.set(t, n, r, i);
		};
		if (s === "spear") U(e, t, n, r + 0, "spear");
		else if (s === "holystaff") {
			let e = Math.round(n + l * 1.4), t = Math.round(r + u * 1.4);
			for (let [n, r, a] of [
				[
					-1,
					-2,
					4
				],
				[
					0,
					-2,
					4
				],
				[
					1,
					-2,
					3
				],
				[
					-2,
					-1,
					4
				],
				[
					2,
					-1,
					2
				],
				[
					-2,
					0,
					3
				],
				[
					2,
					0,
					1
				],
				[
					-2,
					1,
					3
				],
				[
					2,
					1,
					1
				],
				[
					-1,
					2,
					2
				],
				[
					0,
					2,
					2
				],
				[
					1,
					2,
					1
				]
			]) i(e + n, t + r, C.GOLD, a);
			for (let [n, r, a] of [
				[
					-1,
					-1,
					4
				],
				[
					0,
					-1,
					4
				],
				[
					1,
					-1,
					3
				],
				[
					-1,
					0,
					3
				],
				[
					0,
					0,
					4
				],
				[
					1,
					0,
					2
				],
				[
					-1,
					1,
					2
				],
				[
					0,
					1,
					3
				],
				[
					1,
					1,
					2
				]
			]) i(e + n, t + r, C.HOLY, a);
			i(Math.round(e + l * 3), Math.round(t + u * 3), C.HOLY, 4);
			for (let [n, r, a] of [
				[
					-3,
					-3,
					4
				],
				[
					3,
					-3,
					3
				],
				[
					-3,
					3,
					3
				],
				[
					3,
					3,
					2
				]
			]) i(e + n, t + r, C.GOLD, a);
		} else if (s === "icestaff") {
			i(n - (l > .5 ? 0 : 1), r, C.METAL, 3), i(n + (l < -.5 ? 0 : 1), r, C.METAL, 1);
			let e = -u, t = l;
			for (let e = 1; e <= 4; e++) i(Math.round(n + l * e), Math.round(r + u * e), C.ICE, e === 2 || e === 3 ? 4 : 3);
			for (let a of [1.6, 2.6]) i(Math.round(n + l * a + e), Math.round(r + u * a + t), C.ICE, 3), i(Math.round(n + l * a - e), Math.round(r + u * a - t), C.ICE, 1);
			i(Math.round(n + l * 5.2), Math.round(r + u * 5.2), C.ICE, 4);
		} else {
			e.set(n, r, C.GEM, 4), e.set(n + (l > .5 ? -1 : 1), r, C.GEM, 2), e.set(n, r + (u > .5 ? -1 : 1), C.GEM, 3);
			for (let [t, i, a] of [
				[
					-1,
					-1,
					3
				],
				[
					1,
					-1,
					2
				],
				[
					-1,
					1,
					2
				],
				[
					1,
					1,
					1
				]
			]) J(n + t, r + i) && e.set(n + t, r + i, C.GOLD, a);
		}
		e.end();
	}
}
function Mt(e, t, n, r) {
	let [i, a] = Tt(n.bow.b), o = -a, s = i, c = n.child ? 5.5 : 6.5, l = n.child ? 2.4 : 2.8, u = r.hx + .5, d = r.hy + .5;
	e.begin("all", 0);
	let f = [], p = (e) => l * (1 - e / c * (e / c)) - (Math.abs(e) > c - 1.2 ? .8 : 0);
	for (let t = -c; t <= c; t += .5) {
		let n = Math.round(u + o * t + i * p(t) - .5), r = Math.round(d + s * t + a * p(t) - .5);
		if (!J(n, r)) continue;
		let l = Math.abs(t) < 1;
		e.set(n, r, l ? C.LEATHER : C.WOOD, l ? 2 : Math.abs(t) > c - 1.5 ? 4 : t < 0 ? 3 : 2);
	}
	for (let e of [-c + .5, c - .5]) f.push([Math.round(u + o * e + i * p(e) - .5), Math.round(d + s * e + a * p(e) - .5)]);
	if (!n.bow.drawn) {
		let [t, n] = f;
		e.line2(t[0], t[1], n[0], n[1], C.STRING, 3);
	}
	e.end(), n.bow.tips = f, n.bow.grip = [u, d];
}
function Nt(e, t, n, r) {
	let i = n.bow.tips;
	if (!i) return;
	let a = r.hx, o = r.hy;
	e.begin(null);
	for (let [t, n] of i) e.line2(t, n, a, o, C.STRING, 3);
	let [s, c] = Tt(n.bow.b), [l, u] = n.bow.grip, d = Math.hypot(l - a, u - o) + 2.5;
	for (let t = 0; t <= d; t += .5) {
		let n = Math.round(a + .5 + s * t - .5), r = Math.round(o + .5 + c * t - .5);
		J(n, r) && e.set(n, r, t > d - 1.5 ? C.METAL : C.WOOD, t > d - 1.5 ? 4 : 3);
	}
	e.set(a, o, C.FEATHER, 3), e.end();
}
function Pt(e, t, n, r) {
	e.begin("all", 0);
	let i = t, a = n - 3;
	e.set(i, a, C.WOOD, 3), e.set(i, a + 1, C.WHITE, 3), e.set(i - 1, a + 2, C.GEL, 3), e.set(i, a + 2, C.GEL, 4), e.set(i + 1, a + 2, C.GEL, 2), e.set(i - 1, a + 3, C.GEL, 2), e.set(i, a + 3, C.GEL, 2), e.set(i + 1, a + 3, C.GEL, 1), r === "up" && e.set(i, a + 2, C.GEL, 2), e.end();
}
function Ft(e, t, n) {
	let r = t.rig, i = r.child ? .84 : 1, a = r.ground, o = r.cx, s = !!t.cape && t.cape.style !== "short", c = s ? C.CAPE : C.TOP, l = s ? C.TOP : C.BOTTOM, u = t.hat === "hood" || t.hat === "greathelm" ? C.HAT : C.HAIR, d = t.gear.gloves ? C.LEATHER : C.SKIN, f = Ct(t), p = (t, n, r, i) => {
		let a = Math.round(t - .5), o = Math.round(n - .5);
		J(a, o) && e.set(a, o, r, i);
	}, m = (t, n, r) => {
		let i = Infinity, a = -Infinity, o = Infinity, s = -Infinity;
		for (let [e, n] of t) i = Math.min(i, e), a = Math.max(a, e), o = Math.min(o, n), s = Math.max(s, n);
		for (let c = Math.floor(o); c <= Math.ceil(s); c++) for (let o = Math.floor(i); o <= Math.ceil(a); o++) {
			let i = !1;
			for (let e = 0, n = t.length - 1; e < t.length; n = e++) {
				let [r, a] = t[e], [s, l] = t[n];
				a > c + .5 != l > c + .5 && o + .5 < (s - r) * (c + .5 - a) / (l - a) + r && (i = !i);
			}
			let a = i && J(o, c) ? typeof r == "function" ? r(o + .5, c + .5) : r : null;
			a != null && e.set(o, c, n, a);
		}
	}, h = (t, n, r, i, a, o, s = 3) => {
		let c = Math.max(1, Math.ceil(Math.hypot(r - t, i - n) * 2)), l = a / 2;
		for (let a = 0; a <= c; a++) {
			let u = a / c, d = t + (r - t) * u, f = n + (i - n) * u;
			for (let t = Math.floor(f - l); t <= Math.ceil(f + l); t++) for (let n = Math.floor(d - l); n <= Math.ceil(d + l); n++) {
				let r = n + .5 - d, i = t + .5 - f;
				r * r + i * i > l * l + .05 || !J(n, t) || e.set(n, t, o, Math.max(0, i < -l * .3 ? s : i > l * .35 ? s - 2 : s - 1));
			}
		}
	}, g = (t, n) => {
		s && (e.begin("all", 0), m(t, C.CAPEIN, (e, t) => n(e, t) ? null : 1), m(t, C.CAPE, (e, t) => n(e, t) ? 3 : null), e.end());
	}, _ = (n, r, i, a) => {
		let o = t.weapon === "holystaff", s = t.weapon === "icestaff", c = t.weapon === "greatshield", l = t.weapon === "hammer";
		if (!(t.weapon === "sword" || t.weapon === "staff" || t.weapon === "spear" || o || s || c || l)) return;
		e.begin("all", 0);
		let u = Math.max(1, Math.round(Math.hypot(i - n, a - r)));
		for (let e = 0; e <= u; e++) {
			let d = n + (i - n) * e / u, f = r + (a - r) * e / u;
			t.weapon === "sword" ? p(d, f, e < 2 ? C.GOLD : C.METAL, e < 2 ? 3 : 4) : o ? p(d, f, e === u ? C.HOLY : C.GILT, e === u ? 4 : 3) : s ? p(d, f, e === u ? C.ICE : C.METAL, e === u ? 4 : 3) : c ? p(d, f, e >= u - 1 ? C.METAL : C.WOOD, e >= u - 1 ? 4 : 3) : l ? p(d, f, e >= u - 1 ? C.METAL : C.WOOD, e >= u - 1 ? 3 : 2) : p(d, f, C.WOOD, 3);
		}
		e.end();
	}, v = (t, n, r, i, a, o, s = null) => {
		for (let c = Math.floor(n - i); c <= Math.ceil(n + i); c++) for (let l = Math.floor(t - r); l <= Math.ceil(t + r); l++) {
			let u = (l + .5 - t) / r, d = (c + .5 - n) / i;
			u * u + d * d > 1 || !o(u, d) || e.over(l, c, a, s ?? Math.max(1, Math.min(3, e.getShade(l, c))));
		}
	};
	if (n === "left" || n === "right") {
		let t = o - 3.8 * i, n = a - 5.2 * i, r = 5.4 * i, s = 5 * i, m = o + 3 * i, y = a - 8 * i, b = 5.3 * i, x = 5.2 * i, S = [m - .5 * i, y - x * .85], w = [m + b + 3.4 * i, y - x - 1.6 * i];
		g([
			S,
			w,
			[m + b + 2.6 * i, y - x * .05],
			[m + b * .6, y + x * .3]
		], (e, t) => t < S[1] + (e - S[0]) * (w[1] - S[1]) / (w[0] - S[0]) + 1.4), _(m + b * .75, y - x * .45, m - b * .7, y - x * 1.15), e.begin(null), X(e, m, y, b, x, c, {
			hi: .35,
			lo: -.25
		}), v(m, y, b, x, l, (e, t) => t > .35 - e * .35 && e < .35), v(m, y, b, x, C.BELT, (e, t) => t > .2 - e * .35 && t <= .35 - e * .35 && e < .3, 1), e.end(), e.begin("all", 0);
		let T = o - .5 * i, E = a - 1.4 * i, D = o + 7 * i, ee = a - 1.4 * i;
		h(T, E, D, ee, 2.8 * i, C.BOTTOM, 3);
		for (let [e, t, n] of [
			[
				.5,
				-1.5,
				3
			],
			[
				1.5,
				-1.5,
				2
			],
			[
				.5,
				-.5,
				2
			],
			[
				1.5,
				-.5,
				1
			],
			[
				.5,
				.5,
				0
			],
			[
				1.5,
				.5,
				0
			],
			[
				2.5,
				-2.5,
				2
			],
			[
				1.5,
				-2.5,
				3
			]
		]) p(D + e * i, ee + t * i, C.BOOT, n);
		e.end(), e.begin("all", 1);
		let O = o + 2.5 * i, k = a - 2.8 * i;
		p(O - 1, k - 1, f, 3), p(O, k - 1, f, 2), p(O, k, d, 3), p(O + 1, k, d, 2), e.end(), e.begin("all", 0), X(e, t, n, r, s, u, {
			hi: .3,
			lo: -.3,
			maxShade: 4
		}), v(t, n, r, s, C.SKIN, (e, t) => t > .38 - e * .25 && e > -.55, null);
		for (let i = Math.floor(n - s); i <= Math.ceil(n + s); i++) for (let n = Math.floor(t - r); n <= Math.ceil(t + r); n++) {
			if (e.get(n, i) !== C.SKIN) continue;
			let a = (n + .5 - t) / r;
			e.set(n, i, C.SKIN, a < 0 ? 3 : 2);
		}
		p(t - .5 * i, n + 2 * i, C.EYE, 0), p(t + .5 * i, n + 2.2 * i, C.EYE, 0), p(t + 2.5 * i, n + .5 * i, C.SKIN, 2), p(t + 2.5 * i, n + 1.5 * i, C.SKIN, 1), e.end();
		return;
	}
	if (n !== "up") {
		let t = o + .5, n = a - 5 * i, r = 5.4 * i, s = 4.8 * i, m = o + .5, h = a - 8.6 * i, y = 7 * i, b = 4.6 * i;
		g([
			[m + y * .2, h - b * .6],
			[m + y * .55, h - b - 3.4 * i],
			[m + y + 1.6 * i, h - b - 1.6 * i],
			[m + y * .85, h - b * .15]
		], (e, t) => e < m + y * .55 + (t - h + b) * .1), e.begin("all", 0);
		for (let e of [-1, 1]) {
			let t = m + e * 2.4 * i, n = h - b - .4 * i;
			p(t - .5, n - .5, C.BOOT, 1), p(t + .5, n - .5, C.BOOT, 1), p(t - .5, n + .5, C.BOOT, e < 0 ? 3 : 2), p(t + .5, n + .5, C.BOOT, 2);
		}
		e.end(), _(m - y * .95, h + b * .2, m - y * .45, h - b * 1.1), e.begin(null), X(e, m, h, y, b, c, {
			hi: .35,
			lo: -.25
		}), v(m, h, y, b, l, (e, t) => Math.abs(e) > .62 && t > .1), e.end(), e.begin("all", 1);
		for (let e of [-1, 1]) {
			let a = e < 0 ? 3 : 2;
			p(t + e * (r + .6), n - 1.2 * i, f, a), p(t + e * (r + .4), n - .2 * i, f, a - 1), p(t + e * (r - .2), n + 1.6 * i, d, a), p(t + e * (r - 1.2), n + 2.8 * i, d, a - 1);
		}
		e.end(), e.begin("all", 0), X(e, t, n, r, s, u, {
			hi: .3,
			lo: -.3,
			maxShade: 4
		}), v(t, n, r, s, C.SKIN, (e, t) => t > .5 - Math.abs(e) * .2, null);
		for (let i = Math.floor(n); i <= Math.ceil(n + s); i++) for (let n = Math.floor(t - r); n <= Math.ceil(t + r); n++) e.get(n, i) === C.SKIN && e.set(n, i, C.SKIN, n + .5 < t ? 3 : 2);
		for (let e of [-1, 1]) p(t + e * 2 * i - .5, n + s * .72, C.EYE, 0), p(t + e * 2 * i + .5, n + s * .72, C.EYE, 0);
		p(t - 1.2, n - 1.6, u, 4), p(t - .2, n - 2.1, u, 4), p(t - r - .2, n + .8, C.SKIN, 3), p(t + r + .2, n + .8, C.SKIN, 1), e.end();
		return;
	}
	let y = o + .5, b = a - 5.8 * i, x = 6.8 * i, S = 5.2 * i;
	_(y + x * .95, b + S * .1, y + x * .4, b - S * 1.15), e.begin(null), X(e, y, b, x, S, c, {
		hi: .35,
		lo: -.25
	}), v(y, b, x, S, C.BOTTOM, (e, t) => t > .45 && Math.abs(e) < .62), e.end();
	{
		let t = y - .3, n = b - S * .95, r = 5.2 * i, a = 3.4 * i;
		e.begin("all", 0);
		for (let i = Math.floor(n - a); i <= Math.floor(n); i++) for (let o = Math.floor(t - r); o <= Math.ceil(t + r); o++) {
			let s = (o + .5 - t) / r, c = (i + .5 - n) / a;
			if (s * s + c * c > 1 || !J(o, i)) continue;
			let l = -.55 * s - .8 * c;
			e.set(o, i, u, l > .6 ? 3 : l > .05 ? 2 : 1);
		}
		u === C.HAIR && (p(t - r + .6, n - .2 * i, C.SKIN, 2), p(t + r - .4, n - .2 * i, C.SKIN, 1)), e.end();
	}
	g([
		[y + x * .45, b + S * .05],
		[y + x + 3.2 * i, b - S * .45],
		[y + x + 2.6 * i, b + S * .4],
		[y + x * .6, b + S * .6]
	], (e, t) => t < b + S * .05 - (e - y - x) * .25), e.begin("all", 1);
	for (let e of [-1, 1]) {
		let t = e < 0 ? 3 : 2;
		p(y + e * (x - .4), b + S * .1, f, t), p(y + e * (x - .9), b + S * .4, d, t);
	}
	e.end(), e.begin("all", 0);
	for (let e of [-1, 1]) {
		let t = y + e * 2.2 * i, n = a - 1.2 * i;
		p(t - .5, n - .5, C.BOOT, e < 0 ? 3 : 2), p(t + .5, n - .5, C.BOOT, 2), p(t - .5, n + .5, C.BOOT, 0), p(t + .5, n + .5, C.BOOT, 0);
	}
	e.end();
}
function It(e, t) {
	let { w: n, h: r, mat: i, shade: a } = e, o = new Uint8Array(n * r), s = new Int8Array(n * r), c = n, l = -1, u = r, d = -1;
	for (let e = 0; e < r; e++) for (let t = 0; t < n; t++) {
		let f = e * n + t;
		if (!i[f]) continue;
		let p = r - 1 - e, m = t;
		p < 0 || p >= n || m >= r || (o[m * n + p] = i[f], s[m * n + p] = a[f], p < c && (c = p), p > l && (l = p), m < u && (u = m), m > d && (d = m));
	}
	if (i.fill(0), a.fill(0), e.part.fill(0), l < 0) return;
	let f = Math.round(t.rig.cx - (c + l + 1) / 2), p = t.rig.ground - d;
	for (let e = u; e <= d; e++) for (let t = c; t <= l; t++) {
		let c = e * n + t;
		if (!o[c]) continue;
		let l = t + f, u = e + p;
		l < 1 || l > n - 2 || u < 1 || u >= r - 1 || (i[u * n + l] = o[c], a[u * n + l] = s[c]);
	}
}
function Lt(e, t, n, r) {
	let i = r + 6;
	for (let t of [n + 3, n + 8]) e.set(t - 1, i + 1, C.EYE, 0), e.set(t, i + 1, C.EYE, 0);
	e.set(n + 2, i, C.EYE, 0), e.set(n + 9, i, C.EYE, 0), e.set(n + 5, r + 9, C.EYE, 0), e.set(n + 6, r + 9, C.EYE, 0), t.blush && (e.set(n + 2, r + 8, C.BLUSH, 2), e.set(n + 9, r + 8, C.BLUSH, 2));
}
function Rt(e, t, n, r) {
	let i = r + 6;
	e.set(n + 1, i + 1, C.EYE, 0), e.set(n + 2, i + 1, C.EYE, 0), e.set(n + 3, i, C.EYE, 0), e.set(n + 1, r + 9, C.EYE, 0), e.set(n + 6, i, C.SKIN, 1), e.set(n + 6, i + 1, C.SKIN, 1), e.set(n + 7, i, C.SKIN, 2), e.set(n + 7, i + 1, C.SKIN, 0);
}
function zt(e, t, n, r) {
	e.clear(), Et = e, r.act === "roll" ? Ft(e, t, n) : n === "down" ? Xe(e, t, r, !1) : n === "up" ? Xe(e, t, r, !0) : tt(e, t, r, n === "right"), r.act === "down" && It(e, t), e.ox = 0, e.oy = 0;
}
function Y(n, r) {
	let i = f(n, {
		wrap: "clamp",
		mipmaps: !1,
		srgb: !0,
		name: r
	});
	return i.wrapS = i.wrapT = e, i.generateMipmaps = !1, i.minFilter = t, i.magFilter = t, i;
}
function Bt(e, { idleFps: t = 2.5, walkFps: n = 8, runFps: i = 13, extra: a = null } = {}) {
	let o = {};
	return r.forEach((e, r) => {
		o[`idle_${e}`] = {
			frames: [{
				col: 0,
				row: r
			}, {
				col: 1,
				row: r
			}],
			fps: t,
			loop: !0
		};
		let s = [
			2,
			3,
			4,
			5
		].map((e) => ({
			col: e,
			row: r
		}));
		o[`walk_${e}`] = {
			frames: s,
			fps: n,
			loop: !0
		}, o[`run_${e}`] = {
			frames: s.map((e) => ({ ...e })),
			fps: i,
			loop: !0
		}, a && a(o, e, r);
	}), o;
}
function Vt(e = {}, t = {}) {
	let n = fe(e), i = me(n), a = R.length, o = r.length, s = new m(32 * a, 32 * o), c = new k(32, 32);
	if (r.forEach((e, t) => {
		R.forEach((r, a) => {
			zt(c, n, e, r), re(c, i, s, a * 32, t * 32, e === "right");
		});
	}), t && t.combat) return Wt(n, i, s, c);
	let l = s.toCanvas(), u = Y(l, `character:${n.preset}`);
	return {
		texture: u,
		canvas: l,
		frameWidth: 32,
		frameHeight: 32,
		columns: a,
		rows: o,
		pixelsPerUnit: 16,
		anchor: [.5, 0],
		animations: Bt(o),
		name: n.preset,
		spec: n,
		dispose() {
			u.dispose();
		}
	};
}
var Ht = Object.freeze([
	"wind",
	"slash",
	"follow",
	"backhand",
	"thrust",
	"spin",
	"cast",
	"aim",
	"hurt",
	"tuck",
	"roll",
	"down"
]), Ut = {
	attack1: [
		"wind",
		"slash",
		"follow"
	],
	attack2: ["backhand", "follow"],
	attack3: ["wind", "thrust"],
	spin: ["spin"],
	cast: ["cast"],
	aim: ["aim"],
	hurt: ["hurt"],
	dodge: [
		"tuck",
		"roll",
		"tuck"
	],
	down: ["down"]
};
function Wt(e, t, n, i) {
	let a = r.length, o = R.length + ht.length, s = new m(32 * o, 32 * a), c = n.width * 4;
	for (let e = 0; e < n.height; e++) s.data.set(n.data.subarray(e * c, (e + 1) * c), e * s.width * 4);
	r.forEach((n, r) => {
		ht.forEach((a, o) => {
			zt(i, e, n, a), re(i, t, s, (R.length + o) * 32, r * 32, n === "right");
		});
	});
	let l = s.toCanvas(), u = Y(l, `character:${e.preset}:combat`), d = {};
	return R.forEach((e, t) => {
		d[e.key] = t;
	}), ht.forEach((e, t) => {
		d[e.key] = R.length + t;
	}), {
		texture: u,
		canvas: l,
		frameWidth: 32,
		frameHeight: 32,
		columns: o,
		rows: a,
		pixelsPerUnit: 16,
		anchor: [.5, 0],
		animations: Bt(a, { extra: (e, t, n) => {
			for (let [r, i] of Object.entries(Ut)) e[`${r}_${t}`] = {
				frames: i.map((e) => ({
					col: d[e],
					row: n
				})),
				fps: 12,
				loop: !1
			};
		} }),
		name: e.preset,
		spec: e,
		poses: d,
		dispose() {
			u.dispose();
		}
	};
}
function X(e, t, n, r, i, a, { lx: o = -.55, ly: s = -.8, hi: c = .5, lo: l = -.2, deep: u = -.75, maxShade: d = 3, minShade: f = 0 } = {}) {
	for (let p = Math.floor(n - i - 1); p <= Math.ceil(n + i + 1); p++) for (let m = Math.floor(t - r - 1); m <= Math.ceil(t + r + 1); m++) {
		let h = (m + .5 - t) / r, g = (p + .5 - n) / i;
		if (h * h + g * g > 1) continue;
		let _ = h * o + g * s, v = _ > c ? 3 : _ > l ? 2 : +(_ > u);
		v = Math.max(f, Math.min(d, v)), e.set(m, p, a, v);
	}
}
var Z = {
	D: [C.FUR, 0],
	d: [C.FUR, 1],
	o: [C.FUR, 2],
	O: [C.FUR, 3],
	L: [C.FUR, 4],
	s: [C.FUR2, 1],
	S: [C.FUR2, 2],
	c: [C.FUR3, 1],
	C: [C.FUR3, 2],
	w: [C.FUR3, 3],
	W: [C.FUR3, 4],
	e: [C.EYE, 2],
	E: [C.EYE, 0],
	g: [C.EYE, 4],
	n: [C.NOSE, 1],
	N: [C.NOSE, 2],
	p: [C.NOSE, 3],
	b: [C.BEAK, 1],
	B: [C.BEAK, 3],
	r: [C.COMB, 1],
	R: [C.COMB, 2],
	k: [C.LINE, 0]
};
function Gt(e) {
	switch (e.walk) {
		case 0: return [
			{
				dx: -1,
				lift: 0
			},
			{
				dx: 1,
				lift: 0
			},
			{
				dx: 1,
				lift: 0
			},
			{
				dx: -1,
				lift: 0
			}
		];
		case 1: return [
			{
				dx: 0,
				lift: 0
			},
			{
				dx: 0,
				lift: 1
			},
			{
				dx: 0,
				lift: 1
			},
			{
				dx: 0,
				lift: 0
			}
		];
		case 2: return [
			{
				dx: 1,
				lift: 0
			},
			{
				dx: -1,
				lift: 0
			},
			{
				dx: -1,
				lift: 0
			},
			{
				dx: 1,
				lift: 0
			}
		];
		case 3: return [
			{
				dx: 0,
				lift: 1
			},
			{
				dx: 0,
				lift: 0
			},
			{
				dx: 0,
				lift: 0
			},
			{
				dx: 0,
				lift: 1
			}
		];
		default: return [
			{
				dx: 0,
				lift: 0
			},
			{
				dx: 0,
				lift: 0
			},
			{
				dx: 0,
				lift: 0
			},
			{
				dx: 0,
				lift: 0
			}
		];
	}
}
function Q(e, t, n, r, i, a, o, s, c = C.FUR, l = 2) {
	let u = r - i;
	for (let r = n; r <= u; r++) {
		let i = (r - n) / Math.max(1, u - n), d = Math.round(a * i);
		for (let n = 0; n < l; n++) {
			let i = r === u, a = i ? s : c, l = n === 0 ? 2 : 1;
			o && --l, i && (l = o ? 1 : 2), e.set(t + d + n, r, a, Math.max(0, l));
		}
	}
}
function $(e, t, { mat: n = C.FUR, stripe: r = !1, tipMat: i = null, widthBase: a = 2 } = {}) {
	for (let o = 0; o < t.length; o++) {
		let [s, c] = t[o], l = o / (t.length - 1), u = r && o % 3 == 1, d = i && o >= t.length - 2 ? i : u ? C.FUR2 : n;
		e.set(s, c, d, u ? 1 : 2), l < .55 && a > 1 && e.set(s + 1, c, d, 1);
	}
}
var Kt = (e) => e.walk === 0 || e.walk === 1 ? [0, 1] : e.walk === 2 || e.walk === 3 ? [1, 0] : [0, 0];
function qt(e, t, n, r) {
	let i = z(r), a = r.bob, o = r.key === "idle1", s = r.walk >= 0 ? i.sway : +(r.key === "idle1");
	if (n === "side") {
		let t = Gt(r), n = 9 + a, i = [
			[18, n],
			[19, n - 1],
			[20, n - 2],
			[20 + +(s > 0), n - 3],
			[21 + +(s > 0), n - 4],
			[21 + s, n - 5],
			[20 + s, n - 6],
			[20 + s * 2, n - 7]
		];
		e.begin(null), $(e, i, { stripe: !0 }), e.end(), e.begin(null), Q(e, 9, 11 + a, 14, t[1].lift, t[1].dx, !0, C.FUR3), Q(e, 17, 11 + a, 14, t[3].lift, t[3].dx, !0, C.FUR3), e.end(), e.begin(null), X(e, 13, 9.5 + a, 5.6, 2.6, C.FUR);
		for (let t = 9; t <= 17; t += 2) e.over(t, 7 + a, C.FUR2, 1), e.over(t, 8 + a, C.FUR2, 1), t % 4 == 1 && e.over(t + 1, 9 + a, C.FUR2, 1);
		for (let t = 9; t <= 16; t++) e.over(t, 11 + a, C.FUR3, 1);
		e.end(), e.begin("sides", 1), Q(e, 8, 11 + a, 14, t[0].lift, t[0].dx, !1, C.FUR3), Q(e, 16, 11 + a, 14, t[2].lift, t[2].dx, !1, C.FUR3), e.end();
		let c = 3 + a;
		e.begin(null), e.tpl(N([
			"..O..o....",
			".OpooDo...",
			".OOooood..",
			"OOOEeoood.",
			"nwwOoooodd",
			".wwwCood..",
			"..wwcd...."
		], Z), 1, c), o && (e.set(4, c + 3, C.FUR, 1), e.set(5, c + 3, C.FUR, 1)), e.end();
	} else if (n === "down") {
		let t = Kt(r), n = 12 + a;
		e.begin(null), $(e, [
			[15, n],
			[16, n - 1],
			[17, n - 2],
			[17 + +(s > 0), n - 3],
			[17 + s, n - 4],
			[16 + s, n - 5],
			[16 + s, n - 6]
		], { stripe: !0 }), e.end(), e.begin(null), X(e, 12, 10.5 + a, 3.6, 2.8, C.FUR);
		for (let t = 9; t <= 12; t++) e.over(11, t + a, C.FUR3, 3), e.over(12, t + a, C.FUR3, 2);
		e.end(), e.begin("sides", 1), Q(e, 9, 12 + a, 14, t[0], 0, !1, C.FUR3), Q(e, 13, 12 + a, 14, t[1], 0, !1, C.FUR3), e.end();
		let i = 2 + a;
		e.begin(null), e.tpl(N([
			".O......o.",
			".Op....po.",
			".OOooooood",
			"OOOooooood",
			"OOeEooEedd",
			"OOoowwoood",
			".OwwnNwod.",
			"..wwwwcd.."
		], Z), 7, i), e.set(11, i + 2, C.FUR2, 1), e.set(12, i + 2, C.FUR2, 1), e.set(10, i + 3, C.FUR2, 2), e.set(13, i + 3, C.FUR2, 1), o && (e.set(9, i + 4, C.FUR, 1), e.set(10, i + 4, C.FUR, 1), e.set(13, i + 4, C.FUR, 1), e.set(14, i + 4, C.FUR, 1)), e.end();
	} else {
		let t = Kt(r);
		e.begin(null), Q(e, 9, 12 + a, 14, t[0], 0, !0, C.FUR3), Q(e, 13, 12 + a, 14, t[1], 0, !0, C.FUR3), e.end(), e.begin(null), X(e, 12, 10 + a, 4.1, 3.3, C.FUR);
		for (let t of [
			8,
			10,
			12
		]) for (let n = 9; n <= 14; n++) (n !== 9 || t !== 12) && e.over(n, t + a, C.FUR2, n > 12 ? 1 : 2);
		e.end();
		let n = 2 + a;
		e.begin("below", 1), X(e, 12, n + 4.2, 3.7, 2.9, C.FUR), e.set(8, n, C.FUR, 3), e.set(8, n + 1, C.FUR, 3), e.set(9, n + 1, C.FUR, 2), e.set(9, n + 2, C.FUR, 2), e.set(15, n, C.FUR, 2), e.set(15, n + 1, C.FUR, 1), e.set(14, n + 1, C.FUR, 1), e.set(14, n + 2, C.FUR, 1), e.set(11, n + 3, C.FUR2, 2), e.set(12, n + 3, C.FUR2, 1), e.set(11, n + 5, C.FUR2, 2), e.set(12, n + 5, C.FUR2, 1), e.end(), e.begin("sides", 1), $(e, [
			[11, 13 + a],
			[11, 12 + a],
			[11 + (s < 0 ? -1 : 0), 11 + a],
			[11 + s, 10 + a],
			[11 + s, 9 + a],
			[11 + s * 2, 8 + a],
			[11 + s * 2, 7 + a]
		], {
			stripe: !0,
			widthBase: 2
		}), e.end();
	}
}
function Jt(e, t, n, r) {
	let i = z(r), a = r.bob, o = r.walk >= 0 ? i.sway : r.key === "idle1" ? 1 : -1;
	if (n === "side") {
		let t = Gt(r);
		e.begin(null), $(e, [
			[20, 11 + a],
			[21, 10 + a],
			[22, 9 + a],
			[22 + +(o > 0), 8 + a],
			[22 + o, 7 + a]
		], { tipMat: C.FUR3 }), e.end(), e.begin(null), Q(e, 8, 13 + a, 18, t[1].lift, t[1].dx, !0, C.FUR3, C.FUR, 2), Q(e, 18, 13 + a, 18, t[3].lift, t[3].dx, !0, C.FUR3, C.FUR, 2), e.end(), e.begin(null), X(e, 14, 11.5 + a, 7, 3.3, C.FUR);
		for (let t = 8; t <= 19; t++) e.over(t, 14 + a, C.FUR3, 1);
		for (let t = 7; t <= 10; t++) for (let n = 11; n <= 13; n++) e.over(t, n + a, C.FUR3, t === 7 ? 3 : 2);
		e.end(), e.begin("sides", 1), Q(e, 7, 13 + a, 18, t[0].lift, t[0].dx, !1, C.FUR3, C.FUR, 2), Q(e, 17, 13 + a, 18, t[2].lift, t[2].dx, !1, C.FUR3, C.FUR, 2), e.end();
		let n = 3 + a;
		e.begin(null), e.tpl(N([
			"...OOoo...",
			"..OOoooo..",
			".OOEeoSSd.",
			"OOOooSSSd.",
			"wwwoooSSd.",
			"nwwwooSd..",
			".wwwwod...",
			"..ccc....."
		], Z), 0, n), e.end();
	} else if (n === "down") {
		let t = Kt(r);
		e.begin(null), $(e, [
			[15, 12 + a],
			[16, 11 + a],
			[17, 10 + a],
			[17 + o, 9 + a]
		], { tipMat: C.FUR3 }), e.end(), e.begin(null), X(e, 12, 13 + a, 4, 3.4, C.FUR);
		for (let t = 11; t <= 15; t++) e.over(11, t + a, C.FUR3, 3), e.over(12, t + a, C.FUR3, 2), e.over(13, t + a, C.FUR3, 1);
		e.end(), e.begin("sides", 1), Q(e, 9, 15 + a, 18, t[0], 0, !1, C.FUR3, C.FUR, 2), Q(e, 13, 15 + a, 18, t[1], 0, !1, C.FUR3, C.FUR, 2), e.end();
		let n = 3 + a;
		e.begin(null), e.tpl(N([
			"..OOoooo..",
			".OOOoooodd",
			"SOOoooooSS",
			"SSOEooEdSS",
			"SSowwwwdSS",
			"SSwwnNwdS.",
			"..wwwwwd..",
			"...ccc...."
		], Z), 7, n), r.key === "idle1" && (e.set(11, n + 7, C.NOSE, 3), e.set(12, n + 7, C.NOSE, 2)), e.end();
	} else {
		let t = Kt(r);
		e.begin(null), Q(e, 9, 15 + a, 18, t[0], 0, !0, C.FUR3, C.FUR, 2), Q(e, 13, 15 + a, 18, t[1], 0, !0, C.FUR3, C.FUR, 2), e.end(), e.begin(null), X(e, 12, 12 + a, 4.8, 4, C.FUR);
		for (let t = 10; t <= 14; t++) for (let n = 10; n <= 13; n++) (t !== 14 || n !== 10 && n !== 13) && e.over(n, t + a, C.FUR2, n < 12 ? 2 : 1);
		e.end();
		let n = 2 + a;
		e.begin("below", 1), e.tpl(N([
			"..OOoooo..",
			".OOOoooodd",
			"SOOoooooSS",
			"SSOoooodSS",
			"SSoooooddS",
			".S.oood.S."
		], Z), 7, n), e.end(), e.begin("sides", 1), $(e, [
			[11, 14 + a],
			[11, 13 + a],
			[11 + o, 12 + a],
			[11 + o, 11 + a],
			[11 + o * 2, 10 + a]
		], { tipMat: C.FUR3 }), e.end();
	}
}
function Yt(e, t, n, r) {
	let i = r.bob, a = r.key === "idle1", o = r.walk === 0 || r.walk === 3 ? [0, 1] : r.walk === 1 || r.walk === 2 ? [1, 0] : [0, 0];
	if (n === "side") {
		e.begin(null), e.tpl(N([
			".S",
			"SS",
			"sS",
			"s."
		], Z), 12, 4 + i), e.end(), e.begin(null);
		let t = [7, 9];
		for (let n = 0; n < 2; n++) {
			let a = o[n], s = r.walk === 0 ? n === 0 ? -1 : 1 : r.walk === 2 ? n === 0 ? 1 : -1 : 0;
			e.vline(t[n], 12 + i, 14 - a, C.BEAK, n === 0 ? 2 : 1), e.set(t[n] - 1 + s, 14 - a, C.BEAK, n === 0 ? 2 : 1), e.set(t[n] + s, 14 - a, C.BEAK, n === 0 ? 3 : 1);
		}
		e.end(), e.begin(null), X(e, 8.5, 9.5 + i + (a ? .5 : 0), 4.3, 3.2, C.FUR, {
			hi: .35,
			lo: -.35
		}), e.tpl(N([
			".SSS.",
			"sSSSs",
			".sss."
		], Z), 6, 8 + i + +!!a), e.end();
		let n = a ? 1 : 3, s = a ? 8 + i : 2 + i;
		e.begin(null), e.tpl(N([
			".rR..",
			"rRRR.",
			".OOo.",
			"OEoo.",
			"bOoo.",
			".rOo.",
			".rOd."
		], Z), n, s), e.set(n - 1, s + 4, C.BEAK, 3), e.end(), a && (e.begin(null), e.set(5, 9 + i, C.FUR, 2), e.set(5, 10 + i, C.FUR, 2), e.set(4, 10 + i, C.FUR, 2), e.end());
	} else {
		let t = n === "up";
		e.begin(null);
		for (let t = 0; t < 2; t++) {
			let n = t === 0 ? 6 : 9;
			e.vline(n, 12 + i, 14 - o[t], C.BEAK, 2), e.set(n - 1, 14 - o[t], C.BEAK, 2), e.set(n + 1, 14 - o[t], C.BEAK, 1);
		}
		e.end(), t && (e.begin(null), e.tpl(N([
			".SS.",
			"SSSs",
			"sSss"
		], Z), 6, 3 + i), e.end()), e.begin(null), X(e, 8, 9.5 + i, 3.7, 3.3, C.FUR, {
			hi: .35,
			lo: -.35
		}), e.set(4, 9 + i, C.FUR2, 2), e.set(4, 10 + i, C.FUR2, 1), e.set(11, 9 + i, C.FUR2, 1), e.set(11, 10 + i, C.FUR2, 1), e.end();
		let r = (a && !t ? 6 : 2) + i;
		e.begin(null), t ? e.tpl(N([
			"..rR..",
			".rRRr.",
			".OOoo.",
			"OOoood",
			".Oood."
		], Z), 5, r) : e.tpl(N([
			"..rR..",
			".rRRr.",
			".OOoo.",
			"OEOoEd",
			".ObBo.",
			"..rr.."
		], Z), 5, r), e.end();
	}
}
function Xt(e, t, n, r) {
	let i = r.walk >= 0 ? [
		0,
		-3,
		0,
		-1
	][r.walk] : 0, a = i + +(r.walk === 0 || r.walk === 2), o = r.key === "idle1";
	if (n === "side") {
		e.begin(null), e.set(11, 10 + a - +!!o, C.FUR2, 2), e.set(12, 10 + a - (o ? 2 : 0), C.FUR2, 1), e.set(12, 11 + a - +!!o, C.FUR2, 1), e.end(), e.begin(null), i < -1 ? (e.set(8, 13 + a, C.BEAK, 1), e.set(7, 13 + a, C.BEAK, 1)) : (e.vline(8, 12 + a, 14, C.BEAK, 1), e.set(7, 14, C.BEAK, 2)), e.end(), e.begin(null), X(e, 8.5, 10.5 + a, 3, 2.2, C.FUR, {
			hi: .3,
			lo: -.3
		});
		for (let t = 6; t <= 9; t++) e.over(t, 12 + a, C.FUR3, 2);
		e.set(9, 9 + a, C.FUR2, 2), e.set(10, 10 + a, C.FUR2, 1), e.set(9, 10 + a, C.FUR2, 1), e.end(), e.begin(null), X(e, 6, 8 + a, 1.9, 1.8, C.FUR, {
			hi: .2,
			lo: -.4
		}), e.set(5, 8 + a, C.EYE, 0), e.set(6, 9 + a, C.FUR3, 3), e.set(3, 8 + a, C.BEAK, 3), e.set(4, 8 + a, C.BEAK, 2), e.end();
	} else {
		let t = n === "up";
		if (e.begin(null), i < -1 ? (e.set(6, 13 + a, C.BEAK, 1), e.set(9, 13 + a, C.BEAK, 1)) : (e.vline(6, 13 + a, 14, C.BEAK, 1), e.vline(9, 13 + a, 14, C.BEAK, 1), e.set(5, 14, C.BEAK, 2), e.set(10, 14, C.BEAK, 1)), e.end(), t && (e.begin(null), e.tpl(N([
			".SS.",
			".Ss.",
			"..s."
		], Z), 6, 12 + a), e.end()), e.begin(null), X(e, 8, 10.8 + a, 3.1, 2.4, C.FUR, {
			hi: .3,
			lo: -.3
		}), t) e.over(5, 10 + a, C.FUR2, 2), e.over(10, 10 + a, C.FUR2, 1), e.over(6, 11 + a, C.FUR2, 2), e.over(9, 11 + a, C.FUR2, 1);
		else for (let t = 10; t <= 12; t++) for (let n = 6; n <= 9; n++) e.over(n, t + a, C.FUR3, n < 8 ? 3 : 2);
		e.end(), e.begin(null), X(e, 8, 7.6 + a, 2.3, 2, C.FUR, {
			hi: .2,
			lo: -.4
		}), t ? (e.set(7, 6 + a, C.FUR2, 2), e.set(8, 6 + a, C.FUR2, 1)) : (e.set(6, 7 + a, C.EYE, 0), e.set(9, 7 + a, C.EYE, 0), e.set(7, 8 + a, C.BEAK, 3), e.set(8, 8 + a, C.BEAK, 2)), e.end();
	}
}
var Zt = {
	cat: {
		fw: 24,
		fh: 16,
		draw: qt,
		idleFps: 2,
		walkFps: 9,
		runFps: 14,
		colors: {
			fur: "#d9822b",
			fur2: "#8c4a1c",
			fur3: "#f2e3c4",
			eyes: "#7ab04a",
			nose: "#e08a8a"
		}
	},
	dog: {
		fw: 28,
		fh: 20,
		ox: 2,
		draw: Jt,
		idleFps: 3,
		walkFps: 9,
		runFps: 14,
		colors: {
			fur: "#a8703e",
			fur2: "#5a3a24",
			fur3: "#f2e3c4",
			eyes: "#3a2418",
			nose: "#2a1c1c"
		}
	},
	chicken: {
		fw: 18,
		fh: 16,
		ox: 1,
		draw: Yt,
		idleFps: 3,
		walkFps: 8,
		runFps: 12,
		colors: {
			fur: "#f4efe6",
			fur2: "#b8844e",
			fur3: "#fff8ee",
			eyes: "#1e1418",
			beak: "#e8b030",
			comb: "#d23a2e"
		}
	},
	bird: {
		fw: 16,
		fh: 16,
		draw: Xt,
		idleFps: 2.5,
		walkFps: 8,
		runFps: 12,
		colors: {
			fur: "#8a6040",
			fur2: "#5a3a24",
			fur3: "#e8dcc0",
			eyes: "#141018",
			beak: "#e0a040"
		}
	}
};
function Qt(e, t = {}) {
	t = ue(t);
	let n = s(Zt, e) || Zt.cat, i = {
		...n.colors,
		...t
	}, o = {
		...i,
		kind: e,
		seed: de(t.seed ?? a(String(e)))
	}, u = Array(w).fill(null);
	u[C.FUR] = S(i.fur), u[C.FUR2] = S(i.fur2), u[C.FUR3] = S(i.fur3), u[C.NOSE] = S(i.nose || "#d08080"), u[C.BEAK] = S(i.beak || "#e0a040"), u[C.COMB] = S(i.comb || "#c83a30");
	let f = d(v(i.eyes, "#202020"));
	u[C.EYE] = [
		h,
		l(h, f, .5),
		[...f],
		c(f, .3),
		[
			255,
			255,
			255,
			255
		]
	], u[C.LINE] = [
		h,
		h,
		h,
		h,
		h
	];
	for (let e = 0; e < w; e++) u[e] || (u[e] = u[C.FUR]);
	let p = n.fw, g = n.fh, _ = R.length, y = r.length, b = new m(p * _, g * y), x = new k(p, g);
	x.ox = n.ox || 0, r.forEach((e, t) => {
		R.forEach((r, i) => {
			x.clear(), n.draw(x, o, e === "down" ? "down" : e === "up" ? "up" : "side", r), re(x, u, b, i * p, t * g, e === "right");
		});
	});
	let T = b.toCanvas(), E = Y(T, `creature:${e}`);
	return {
		texture: E,
		canvas: T,
		frameWidth: p,
		frameHeight: g,
		columns: _,
		rows: y,
		pixelsPerUnit: 16,
		anchor: [.5, 0],
		name: e,
		animations: Bt(y, {
			idleFps: n.idleFps,
			walkFps: n.walkFps,
			runFps: n.runFps
		}),
		dispose() {
			E.dispose();
		}
	};
}
var $t = {
	Painter: k,
	resolvePainter: re,
	T: N,
	M: C,
	CRE_L: Z,
	blob: X,
	quadGait: Gt,
	quadLeg: Q,
	tailChain: $,
	rampForKind: S,
	finishTexture: Y,
	buildAnimations: Bt,
	POSES: R,
	lagOf: z,
	glowTexel: x,
	GLOW_ALPHA: b,
	OUTLINE: h,
	ERASE: te,
	HAT_L: M,
	HATS: F,
	inFrame: J
};
//#endregion
export { Qt as a, D as c, Vt as i, Ht as n, ee as o, $t as r, O as s, I as t };
