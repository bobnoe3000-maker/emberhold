import { i as e, n as t } from "./I18n-BeKB4FMa.js";
import { c as n, d as r, i, m as a, n as o, o as s, r as c, s as l, t as u, u as d } from "./gilt-DNFH9voM.js";
var f = (e) => Math.max(1, Math.ceil(Math.max(1, Math.round(e)) / 2));
function p({ w: e, h: t, dpr: n = 1 }) {
	let r = Number.isFinite(n) && n > 0 ? n : 1, i = Math.max(1, Math.round((Number.isFinite(e) ? e : 0) * r)), a = Math.max(1, Math.round((Number.isFinite(t) ? t : 0) * r)), o = Math.floor(Math.min(i / 640, a / 360) + 1e-6), s = Math.max(2, o), c = f(s), l = Math.floor(i / s), u = Math.floor(a / s), d = l >= 512 && u >= 300 ? 1 : Math.min(1, l / 512, u / 300);
	return {
		px: s,
		fpx: c,
		shrink: d,
		cornerShrink: d,
		artW: l,
		artH: u,
		dpr: r,
		W: i,
		H: a,
		cssPx: s / r,
		cssFpx: c / r
	};
}
var m = /* @__PURE__ */ new WeakMap(), h = [];
function g(e) {
	m.set(e.root, e), h.push(e);
}
function _(e) {
	m.delete(e.root);
	let t = h.indexOf(e);
	t >= 0 && h.splice(t, 1);
}
function v(e = null) {
	let t = e?.closest?.(".lu-root");
	return (t && m.get(t)) ?? h[h.length - 1] ?? null;
}
var y = (e = null) => v(e)?.scale ?? null;
function b(e, t) {
	let n = v(e);
	return n ? n.on("scale", t) : () => {};
}
function x(e, t, n, r, i, a, o) {
	if (e === "stage" || !/^[tmb][lcr]$/.test(e) || /^[tb][lr]$/.test(e)) return 1;
	let [s, c] = e, l = (e) => Math.max(0, Math.min(16, e)), u = (e, t, n, r, i, a, o) => {
		let s = Infinity;
		return t > n && (s = Math.min(s, (i - o - r) / (t - n))), e < n && (s = Math.min(s, (r - a) / (n - e))), s;
	}, d = 1;
	return c === "c" && (d = Math.min(d, u(t, t + r, 320, a / 2, a, l(t), l(640 - t - r)))), s === "m" ? d = Math.min(d, u(n, n + i, 180, o / 2, o, l(n), l(360 - n - i))) : s === "t" ? d = Math.min(d, u(n, n + i, 0, 0, o, 0, l(360 - n - i))) : s === "b" && (d = Math.min(d, u(n, n + i, 360, o, o, l(n), 0))), d > 0 || (d = .25), d >= .97 ? 1 : d;
}
//#endregion
//#region src/engine/ui/GlyphFont.js
var S = "←↑→↓↔↕↖↗↘↙♪", C = "U+2190-2199, U+266A", ee = Object.freeze({
	15: Object.freeze({
		upm: 1350,
		unit: 50,
		asc: 1050,
		desc: 300,
		lsb: 1,
		stroke: 3,
		cap: 15
	}),
	10: Object.freeze({
		upm: 1400,
		unit: 75,
		asc: 1125,
		desc: 375,
		lsb: 0,
		stroke: 2,
		cap: 10
	}),
	5: Object.freeze({
		upm: 1024,
		unit: 128,
		asc: 896,
		desc: 256,
		lsb: 0,
		stroke: 1,
		cap: 5
	})
}), te = Object.freeze({
	15: "Lu Glyph 15",
	10: "Lu Glyph 10",
	5: "Lu Glyph 5"
}), ne = {
	15: [
		"....###....",
		"...#####...",
		"..#######..",
		".#########.",
		"###########",
		...Array(10).fill("....###....")
	],
	10: [
		"...##...",
		"..####..",
		".######.",
		"########",
		...[
			,
			,
			,
			,
			,
			,
		].fill("...##...")
	],
	5: [
		"..#..",
		".###.",
		"#####",
		"..#..",
		"..#.."
	]
}, w = {
	15: [
		"....####...",
		"....######.",
		"....###.###",
		"....###..##",
		"....###...#",
		"....###....",
		"....###....",
		"....###....",
		"....###....",
		"..#####....",
		".######....",
		"#######....",
		"#######....",
		"######.....",
		".####......"
	],
	10: [
		"...###..",
		"...#####",
		"...##.##",
		"...##..#",
		"...##...",
		"...##...",
		".####...",
		"#####...",
		"#####...",
		".###...."
	],
	5: [
		"..##.",
		"..#.#",
		"..#..",
		"###..",
		"##..."
	]
}, T = (e) => [...e].reverse(), E = (e) => e.map((e) => [...e].reverse().join("")), D = (e) => Array.from({ length: e[0].length }, (t, n) => e.map((e) => e[n]).reverse().join("")), re = (e) => {
	let t = e.map((e) => e.replace(/\./g, "").length);
	return e.slice(0, t.indexOf(Math.max(...t)) + 1);
};
function ie(e, t, n) {
	let r = e.stroke, i = Array.from({ length: t }, () => Array(t).fill(".")), a = (e, n) => {
		e >= 0 && n >= 0 && e < t && n < t && (i[n][e] = "#");
	};
	for (let e = 0; e < n; e++) for (let r = t - n + e; r < t; r++) a(r, e);
	for (let e = 0; e < t; e++) {
		let n = t - 1 - e - Math.floor((r - 1) / 2);
		for (let t = 0; t < r; t++) a(n + t, e);
	}
	return i.map((e) => e.join(""));
}
function ae(e) {
	let t = ee[e], n = ne[e], r = D(n), i = Math.floor((t.cap - r.length) / 2 + .5), a = re(n), o = n[n.length - 1], s = Math.max(t.stroke, t.cap - 2 * a.length), c = [
		...a,
		...Array(s).fill(o),
		...T(a)
	], l = Math.floor((t.cap - c.length) / 2), u = D(c), d = e === 15 ? ie(t, 13, 8) : e === 10 ? ie(t, 9, 5) : ie(t, 5, 3), f = Math.floor((t.cap - d.length) / 2 + .5);
	return {
		"↑": {
			rows: n,
			base: 0
		},
		"↓": {
			rows: T(n),
			base: 0
		},
		"→": {
			rows: r,
			base: i
		},
		"←": {
			rows: E(r),
			base: i
		},
		"↕": {
			rows: c,
			base: l
		},
		"↔": {
			rows: u,
			base: Math.floor((t.cap - u.length) / 2 + .5)
		},
		"↗": {
			rows: d,
			base: f
		},
		"↖": {
			rows: E(d),
			base: f
		},
		"↘": {
			rows: T(d),
			base: f
		},
		"↙": {
			rows: E(T(d)),
			base: f
		},
		"♪": {
			rows: w[e],
			base: 0
		}
	};
}
function oe(e) {
	let t = e.rows.length, n = e.rows.map((e) => Array(e.length).fill(!1)), r = [];
	for (let i = 0; i < t; i++) {
		let a = e.rows[i], o = 0;
		for (; o < a.length;) {
			if (a[o] !== "#" || n[i][o]) {
				o++;
				continue;
			}
			let s = o;
			for (; s < a.length && a[s] === "#" && !n[i][s];) s++;
			let c = i + 1, l = (t) => {
				let r = e.rows[t];
				if (!r) return !1;
				for (let e = o; e < s; e++) if (r[e] !== "#" || n[t][e]) return !1;
				return (o === 0 || r[o - 1] !== "#" || n[t][o - 1]) && (s >= r.length || r[s] !== "#" || n[t][s]);
			};
			for (; c < t && l(c);) c++;
			for (let e = i; e < c; e++) for (let t = o; t < s; t++) n[e][t] = !0;
			r.push([
				o,
				e.base + (t - c),
				s,
				e.base + (t - i)
			]), o = s;
		}
	}
	return r;
}
var O = class {
	constructor() {
		this.b = [];
	}
	u8(e) {
		return this.b.push(e & 255), this;
	}
	u16(e) {
		return this.b.push(e >> 8 & 255, e & 255), this;
	}
	i16(e) {
		return this.u16(e < 0 ? e + 65536 : e);
	}
	u32(e) {
		return this.b.push(e >>> 24 & 255, e >>> 16 & 255, e >>> 8 & 255, e & 255), this;
	}
	tag(e) {
		for (let t = 0; t < 4; t++) this.b.push(e.charCodeAt(t));
		return this;
	}
	pad() {
		for (; this.b.length % 4;) this.b.push(0);
		return this;
	}
	get length() {
		return this.b.length;
	}
}, se = (e) => {
	let t = 0;
	for (let n = 0; n < e.length; n += 4) t = t + ((e[n] << 24 | (e[n + 1] ?? 0) << 16 | (e[n + 2] ?? 0) << 8 | (e[n + 3] ?? 0)) >>> 0) >>> 0;
	return t;
};
function ce(e, t = te[e]) {
	let n = ee[e], r = ae(e), i = [...S], a = n.unit, o = [{
		cp: -1,
		adv: Math.round(n.upm / 4 / a) * a,
		rects: [],
		w: 0
	}];
	for (let e of i) {
		let t = r[e], i = Math.max(...t.rows.map((e) => e.length));
		o.push({
			cp: e.codePointAt(0),
			adv: (n.lsb + i + 1) * a,
			rects: oe(t).map(([e, t, r, i]) => [
				(e + n.lsb) * a,
				t * a,
				(r + n.lsb) * a,
				i * a
			]),
			w: i
		});
	}
	let s = new O(), c = [], l = 0, u = 0, d = 0, f = 0, p = 0, m = 0, h = 0, g = 32767, _ = 32767, v = 0;
	for (let e of o) {
		if (c.push(s.length), h = Math.max(h, e.adv), !e.rects.length) continue;
		let t = Math.min(...e.rects.map((e) => e[0])), n = Math.min(...e.rects.map((e) => e[1])), r = Math.max(...e.rects.map((e) => e[2])), i = Math.max(...e.rects.map((e) => e[3]));
		l = Math.min(l, t), u = Math.min(u, n), d = Math.max(d, r), f = Math.max(f, i), g = Math.min(g, t), _ = Math.min(_, e.adv - r), v = Math.max(v, r), s.i16(e.rects.length).i16(t).i16(n).i16(r).i16(i), e.rects.forEach((e, t) => s.u16(t * 4 + 3)), s.u16(0);
		let a = [];
		for (let [t, n, r, i] of e.rects) a.push([t, n], [t, i], [r, i], [r, n]);
		p = Math.max(p, a.length), m = Math.max(m, e.rects.length);
		for (let e = 0; e < a.length; e++) s.u8(1);
		let o = 0, y = 0;
		for (let [e] of a) s.i16(e - o), o = e;
		for (let [, e] of a) s.i16(e - y), y = e;
		s.pad();
	}
	c.push(s.length), g === 32767 && (g = 0), _ === 32767 && (_ = 0);
	let y = o.length, b = {};
	b.head = new O().u32(65536).u32(65536).u32(0).u32(1594834165).u16(11).u16(n.upm).u32(0).u32(0).u32(0).u32(0).i16(l).i16(u).i16(d).i16(f).u16(0).u16(6).i16(2).i16(1).i16(0), b.hhea = new O().u32(65536).i16(n.asc).i16(-n.desc).i16(0).u16(h).i16(g).i16(_).i16(v).i16(1).i16(0).i16(0).i16(0).i16(0).i16(0).i16(0).i16(0).u16(y), b.maxp = new O().u32(65536).u16(y).u16(p).u16(m).u16(0).u16(0).u16(2).u16(0).u16(0).u16(0).u16(0).u16(0).u16(0).u16(0).u16(0);
	let x = o.slice(1).map((e) => e.cp), C = new O().u16(4).i16(Math.round(h * .75)).u16(400).u16(5).u16(0).i16(Math.round(n.upm * .65)).i16(Math.round(n.upm * .6)).i16(0).i16(Math.round(n.upm * .075)).i16(Math.round(n.upm * .65)).i16(Math.round(n.upm * .6)).i16(0).i16(Math.round(n.upm * .35)).i16(n.unit).i16(Math.round(n.cap * n.unit * .5)).i16(0);
	for (let e = 0; e < 10; e++) C.u8(0);
	C.u32(0).u32(16416).u32(0).u32(0).tag("NONE").u16(192).u16(Math.min(...x)).u16(Math.max(...x)).i16(n.asc).i16(-n.desc).i16(0).u16(n.asc).u16(n.desc).u32(1).u32(0).i16(Math.round(n.cap * .7) * n.unit).i16(n.cap * n.unit).u16(0).u16(32).u16(1), b["OS/2"] = C;
	let ne = new O();
	for (let e of o) ne.u16(e.adv).i16(e.rects.length ? Math.min(...e.rects.map((e) => e[0])) : 0);
	b.hmtx = ne;
	let w = [...o.map((e, t) => ({
		cp: e.cp,
		gid: t
	})).filter((e) => e.cp >= 0).sort((e, t) => e.cp - t.cp).map((e) => ({
		start: e.cp,
		end: e.cp,
		delta: (e.gid - e.cp + 65536) % 65536
	})), {
		start: 65535,
		end: 65535,
		delta: 1
	}], T = w.length * 2, E = 2 ** Math.floor(Math.log2(w.length)), D = new O().u16(4).u16(16 + w.length * 8).u16(0).u16(T).u16(E * 2).u16(Math.log2(E)).u16(T - E * 2);
	for (let e of w) D.u16(e.end);
	D.u16(0);
	for (let e of w) D.u16(e.start);
	for (let e of w) D.u16(e.delta);
	for (let e = 0; e < w.length; e++) D.u16(0);
	let re = new O().u16(0).u16(2).u16(0).u16(3).u32(20).u16(3).u16(1).u32(20);
	re.b.push(...D.b), b.cmap = re, b.glyf = s;
	let ie = new O();
	for (let e of c) ie.u32(e);
	b.loca = ie;
	let ce = t.replace(/[^A-Za-z0-9]/g, ""), k = [
		[1, t],
		[2, "Regular"],
		[3, `${ce}-gen`],
		[4, t],
		[6, ce]
	], A = new O().u16(0).u16(k.length).u16(6 + k.length * 12), j = new O();
	for (let [e, t] of k) {
		A.u16(3).u16(1).u16(1033).u16(e).u16(String(t).length * 2).u16(j.length);
		for (let e of String(t)) j.u16(e.charCodeAt(0));
	}
	A.b.push(...j.b), b.name = A, b.post = new O().u32(196608).u32(0).i16(-n.unit).i16(n.unit).u32(0).u32(0).u32(0).u32(0).u32(0);
	let M = Object.keys(b).sort(), N = M.length, P = 2 ** Math.floor(Math.log2(N)) * 16, F = new O().u32(65536).u16(N).u16(P).u16(Math.log2(P / 16)).u16(N * 16 - P), I = 12 + N * 16, le = [];
	for (let e of M) {
		let t = b[e].b;
		le.push({
			t: e,
			sum: se(t),
			off: I,
			len: t.length
		}), I += Math.ceil(t.length / 4) * 4;
	}
	for (let e of le) F.tag(e.t).u32(e.sum).u32(e.off).u32(e.len);
	let L = 0;
	for (let e of M) e === "head" && (L = F.length), F.b.push(...b[e].b), F.pad();
	let R = 2981146554 - se(F.b) >>> 0;
	return F.b[L + 8] = R >>> 24 & 255, F.b[L + 9] = R >>> 16 & 255, F.b[L + 10] = R >>> 8 & 255, F.b[L + 11] = R & 255, new Uint8Array(F.b).buffer;
}
Object.freeze({
	"Jersey 15": "Lu Glyph 15",
	"Jersey 10": "Lu Glyph 10",
	Tiny5: "Lu Glyph 5"
});
var k = "\"Jersey 10\", \"Lu Glyph 10\", monospace", A = "\"Jersey 15\", \"Lu Glyph 15\", monospace", j = "Tiny5, \"Lu Glyph 5\", monospace", M = {
	fx: "crisp",
	w: 400
}, N = {
	num: {
		...M,
		family: k,
		u: "fpx",
		ou: "fpx",
		em: 56 / 3,
		L: 18,
		mid: 9,
		ink: 10
	},
	big: {
		...M,
		family: A,
		u: "fpx",
		ou: "fpx",
		em: 27,
		L: 23,
		mid: 11.5,
		ink: 15
	},
	numL: {
		...M,
		family: k,
		u: "px",
		ou: "px",
		em: 56 / 3,
		L: 14,
		mid: 7,
		ink: 10
	},
	tiny: {
		...M,
		family: j,
		u: "px",
		ou: "px",
		em: 8,
		L: 9,
		mid: 4.5,
		ink: 5
	}
}, P = {
	head: {
		...M,
		family: A,
		u: "px",
		ou: "px",
		em: 27,
		L: 21,
		mid: 10.5,
		ink: 15
	},
	name: {
		...M,
		family: A,
		u: "fpx",
		ou: "fpx",
		em: 27,
		L: 23,
		mid: 11.5,
		ink: 15
	},
	body: {
		...M,
		family: A,
		u: "fpx",
		ou: "fpx",
		em: 27,
		L: 26,
		mid: 12.5,
		ink: 15
	},
	line: {
		...M,
		family: k,
		u: "fpx",
		ou: "fpx",
		em: 56 / 3,
		L: 18,
		mid: 9,
		ink: 10
	},
	small: {
		...M,
		family: j,
		u: "px",
		ou: "px",
		em: 8,
		L: 9,
		mid: 4.5,
		ink: 5
	},
	val: null
};
P.val = P.body;
var F = Object.freeze({
	head: "Lu J Head",
	name: "Lu J Name",
	body: "Lu J Body",
	line: "Lu J Line",
	small: "Lu J Small",
	val: "Lu J Val"
}), I = Object.freeze({
	head: "Lu G Head",
	name: "Lu G Name",
	body: "Lu G Body",
	line: "Lu G Line",
	small: "Lu G Small",
	val: "Lu G Val"
}), le = "U+0020-007E, U+00B7, U+00D7, U+00C0-00D6, U+00D8-00F6, U+00F8-00FF, U+0152-0153", L = Object.freeze({
	head: [
		"Jersey 15",
		27,
		"px"
	],
	name: [
		"Jersey 15",
		27,
		"fpx"
	],
	body: [
		"Jersey 15",
		27,
		"fpx"
	],
	line: [
		"Jersey 10",
		56 / 3,
		"fpx"
	],
	small: [
		"Jersey 10",
		56 / 3,
		"fpx"
	],
	val: [
		"Jersey 10",
		56 / 3,
		"fpx"
	]
}), R = Object.freeze({
	"Jersey 15": {
		em: 27,
		cap: 15
	},
	"Jersey 10": {
		em: 56 / 3,
		cap: 10
	}
}), ue = (e) => `"${F[e]}", "${I[e]}", DotGothic16, sans-serif`, de = (e) => `"${F[e]}", "${I[e]}", "Noto Sans JP", sans-serif`, fe = {
	head: {
		family: ue("head"),
		w: 400,
		u: "px",
		ou: "px",
		em: 16,
		L: 20,
		mid: 11.75,
		ink: 14.5,
		fx: "soft",
		bold: "var(--fpx)",
		cjk: !0
	},
	name: {
		family: ue("name"),
		w: 400,
		u: "px",
		ou: "px",
		em: 12,
		L: 14,
		mid: 6.5,
		ink: 11,
		fx: "soft",
		cjk: !0
	},
	body: {
		family: ue("body"),
		w: 400,
		u: "px",
		ou: "px",
		em: 12,
		L: 14,
		mid: 6.5,
		ink: 11,
		fx: "soft",
		cjk: !0
	},
	line: {
		family: de("line"),
		w: 500,
		u: "px",
		ou: "fpx",
		em: 7,
		L: 10,
		mid: 5,
		ink: 7,
		fx: "aa",
		cjk: !0
	},
	small: {
		family: de("small"),
		w: 700,
		u: "px",
		ou: "fpx",
		em: 7,
		L: 9,
		mid: 4.5,
		ink: 7,
		fx: "aa",
		cjk: !0
	},
	val: {
		family: de("val"),
		w: 700,
		u: "px",
		ou: "fpx",
		em: 8,
		L: 10,
		mid: 4.75,
		ink: 7.5,
		fx: "aa",
		cjk: !0
	}
}, z = (e) => `"${F[e]}", "${I[e]}", "Noto Sans SC", sans-serif`, pe = {
	head: {
		family: z("head"),
		w: 900,
		u: "px",
		ou: "px",
		em: 18,
		L: 20,
		mid: 11,
		ink: 17,
		fx: "soft",
		cjk: !0
	},
	name: {
		family: z("name"),
		w: 700,
		u: "px",
		ou: "px",
		em: 13,
		L: 14,
		mid: 5.75,
		ink: 12.5,
		fx: "soft",
		cjk: !0
	},
	body: {
		family: z("body"),
		w: 500,
		u: "px",
		ou: "px",
		em: 11,
		L: 16,
		mid: 7.5,
		ink: 10,
		fx: "soft",
		cjk: !0
	},
	line: {
		family: z("line"),
		w: 500,
		u: "px",
		ou: "fpx",
		em: 7,
		L: 10,
		mid: 5,
		ink: 7,
		fx: "aa",
		cjk: !0
	},
	small: {
		family: z("small"),
		w: 700,
		u: "px",
		ou: "fpx",
		em: 7,
		L: 9,
		mid: 4.5,
		ink: 7,
		fx: "aa",
		cjk: !0
	},
	val: {
		family: z("val"),
		w: 700,
		u: "px",
		ou: "fpx",
		em: 8,
		L: 10,
		mid: 4.75,
		ink: 7.5,
		fx: "aa",
		cjk: !0
	}
}, me = {
	name: {
		family: de("name"),
		w: 700,
		u: "px",
		ou: "px",
		em: 12,
		L: 14,
		mid: 6.25,
		ink: 11.5,
		fx: "soft",
		cjk: !0
	},
	body: {
		family: de("body"),
		w: 500,
		u: "px",
		ou: "px",
		em: 12,
		L: 14,
		mid: 6,
		ink: 11,
		fx: "soft",
		cjk: !0
	}
}, B = Object.freeze({
	en: Object.freeze({
		...P,
		...N
	}),
	ja: Object.freeze({
		...fe,
		...N
	}),
	zh: Object.freeze({
		...pe,
		...N
	})
}), he = B.en, ge = 16, _e = .125;
function ve(e, t) {
	let n = Object.prototype.hasOwnProperty.call(B, e) ? e : "en", r = B[n];
	if (n !== "ja") return r;
	let i = Math.max(1, Math.round(t)), a = { ...r };
	for (let e of ["name", "body"]) {
		let t = r[e], n = t.em * i, o = Math.max(1, Math.round(n / ge));
		for (let e of [o - 1, o + 1]) e >= 1 && Math.abs(Math.log(e * ge / n)) < Math.abs(Math.log(o * ge / n)) && (o = e);
		let s = o * ge / n;
		a[e] = Math.abs(Math.log(s)) <= _e ? s === 1 ? t : {
			...t,
			em: t.em * s,
			mid: t.L / 2 + (t.mid - t.L / 2) * s,
			ink: t.ink * s
		} : me[e];
	}
	return Object.freeze(a);
}
var V = B.en, H = "en", ye = 2, be = {}, xe = .5;
function Se() {
	for (let [e, t] of Object.entries(V)) {
		let n = t.u === "fpx" ? xe : 1;
		be[e] = {
			...t,
			unit: n,
			size: t.em * n,
			L: t.L * n,
			cjk: !!t.cjk
		};
	}
}
function U() {
	let e = t();
	(e !== H || !be.body) && (H = Object.prototype.hasOwnProperty.call(B, e) ? e : "en", V = ve(H, ye), Se());
}
function Ce(e = 2) {
	ye = Math.max(1, Math.round(e)), xe = f(ye) / ye, H = "", U();
}
var we = () => ye, Te = () => (U(), V), Ee = () => (U(), H), De = () => e(t()), Oe = (e) => De() ? String(e) : String(e).toUpperCase(), ke = Object.freeze({
	font: "name",
	track: 1
}), Ae = (e) => e.mid * (e.u === "fpx" ? .5 : 1), je = (e) => Ae(he[e]), Me = (e) => (U(), V[e].ink * (V[e].u === "fpx" ? .5 : 1)), Ne = (e) => Math.max(0, Me(e) - he[e].ink * (he[e].u === "fpx" ? .5 : 1)), W = null, Pe = (e, t = 8) => `${e.w} ${e.em * t}px ${e.family}`, Fe = (e, t) => {
	U();
	let n = V[e];
	return n.cjk || !t ? 0 : n.u === "fpx" ? t * 2 * xe : t;
}, Ie = (e, t) => {
	U();
	let n = V[e];
	return n.cjk || !t ? "0" : n.u === "fpx" ? `calc(var(--fpx) * ${t * 2})` : We(t);
};
function G(e, t = "body", n = 0) {
	U();
	let r = V[t];
	W ||= document.createElement("canvas").getContext("2d"), W.font = Pe(r), "fontKerning" in W && (W.fontKerning = "none");
	let i = String(e).replace(/[{}]/g, ""), a = Fe(t, n) * Math.max(0, [...i].length - 1), o = r.cjk && (Je.test(i) || H === "zh" && et.test(i)) ? Qe(r, i) : W.measureText(i).width;
	return Math.ceil(Math.ceil(o / 8) * be[t].unit + a - 1e-9);
}
function Le(e, t, n, r = 0) {
	if (G(e, t, r) <= n) return String(e);
	let i = [...String(e)];
	for (; i.length > 1 && G(`${i.join("").trimEnd()}…`, t, r) > n;) i = i.slice(0, -1);
	return `${i.join("").trimEnd()}…`;
}
var Re = () => (U(), [...new Set(Object.values(V).map((e) => Pe(e, 16 / e.em)))]);
function ze(e, t) {
	if (e !== "ja" && e !== "zh") return [];
	let n = Math.max(1, Math.round(t)), r = B[e], i = ve(e, n);
	return Object.entries(F).map(([e, t]) => {
		let [a, , o] = L[e], s = R[a].cap * (o === "px" ? 2 : 1), c = r[e].ink * 2, l = i[e], u = s / c * l.ink * n, d = {
			source: a,
			k: Math.max(1, Math.round(u / R[a].cap)),
			d: Infinity
		};
		for (let e of [a, ...Object.keys(R).filter((e) => e !== a)]) for (let t = 1; t <= 16; t++) {
			let n = Math.abs(Math.log(R[e].cap * t / u));
			n < d.d - 1e-9 && (d = {
				source: e,
				k: t,
				d: n
			});
		}
		let f = R[d.source].em * d.k, p = l.em * n;
		return {
			family: t,
			glyphs: I[e],
			source: d.source,
			k: d.k,
			size: f,
			sizeAdjust: f / p,
			role: e
		};
	});
}
function Be() {
	U();
	let e = {
		"--lu-font-j15": A,
		"--lu-font-j10": k,
		"--lu-font-t5": j
	};
	for (let [t, n] of [
		["body", ""],
		["name", "-name"],
		["line", "-line"],
		["num", "-num"],
		["tiny", "-tiny"]
	]) e[`--lu-font${n}`] = V[t].family, e[`--lu-font${n}-w`] = String(V[t].w);
	return e;
}
var Ve = /* @__PURE__ */ new WeakMap(), He = (e) => Ve.get(e) ?? [0, 0], Ue = (e, t) => {
	Ve.set(e, t);
}, We = (e) => `calc(var(--px) * ${e})`, Ge = (e) => `round(nearest, calc(var(--px) * ${e}), var(--lu-dpx, 1px))`, Ke = (e) => String(e).replace(/[&<>"]/g, (e) => ({
	"&": "&amp;",
	"<": "&lt;",
	">": "&gt;",
	"\"": "&quot;"
})[e]), qe = /([、。，．：；！？」』）】〕〉》”’])(?=[、。，．：；！？」』）】〕〉》”’「『（【〔〈《“‘])/g, Je = new RegExp(qe.source), Ye = .5, K = /* @__PURE__ */ new Map(), Xe = 512, Ze = !1;
function Qe(e, t) {
	let n = Pe(e), r = `${n}|${t}`, i = K.get(r);
	if (i !== void 0) return i;
	if (!q?.isConnected) {
		let r = 0, i = t;
		return H === "zh" && (W.font = `${e.w} ${e.em * 8}px ${nt}`, r += (t.match(tt)?.length ?? 0) * W.measureText("·").width, i = t.replace(tt, ""), W.font = n), r + W.measureText(i).width - (i.match(qe)?.length ?? 0) * e.em * 8 * Ye;
	}
	!Ze && typeof document.fonts?.addEventListener == "function" && (Ze = !0, document.fonts.addEventListener("loadingdone", () => K.clear()));
	let a = document.createElement("div");
	a.className = "tx cjk", a.style.cssText = "position:absolute;left:0;top:0;white-space:pre;font-kerning:none;letter-spacing:0;", a.style.fontFamily = e.family, a.style.fontWeight = String(e.w), a.style.fontSize = `${e.em * 8}px`;
	let o = Ke(t).replace(qe, "<span class=\"halt\">$1</span>");
	H === "zh" && (o = o.replace(tt, "<span class=\"cjkdot\">·</span>")), a.innerHTML = o, q.append(a);
	let s = a.getBoundingClientRect().width;
	return a.remove(), K.set(r, s), K.size > Xe && K.delete(K.keys().next().value), s;
}
var $e = "[\\p{sc=Han}\\p{sc=Hiragana}\\p{sc=Katakana}]", et = RegExp(`(?<=${$e})·(?=${$e})`, "u"), tt = new RegExp(et.source, "gu");
new RegExp(et.source, "uy"), new RegExp(qe.source, "y");
var nt = "\"Noto Sans SC\", sans-serif", rt = (e, t, n = null) => n ? e === 0 ? n : `calc(var(--${t}) * ${e} + ${n})` : e === 0 ? "0" : `calc(var(--${t}) * ${e})`;
function it(e, t) {
	let n = t.ou, r = "var(--g-ink0)", i = [], a = [
		[1, 0],
		[-1, 0],
		[0, 1],
		[0, -1]
	], o = [
		...a,
		[1, 1],
		[-1, 1],
		[1, -1],
		[-1, -1]
	];
	e.ol8 ? (n = "px", r = "var(--g-nol)", i = [
		...o,
		[0, 2],
		[1, 2],
		[-1, 2]
	]) : e.olx ? (n = "px", r = "var(--g-nol)", i = o) : e.ol ? (i = [...a], e.drop && (i.push([0, 2]), n === "fpx" && i.push([1, 1], [-1, 1]))) : e.drop && (i = [[0, 1]]);
	let s = [], c = t.bold;
	c && s.push(`${c} 0 0 currentColor`);
	let l = /* @__PURE__ */ new Set();
	for (let [e, t] of i) for (let i of c ? [null, c] : [null]) {
		let a = `${e},${t},${i}`;
		l.has(a) || i && e === 0 && t === 0 || (l.add(a), s.push(`${rt(e, n, i)} ${rt(t, n)} 0 ${r}`));
	}
	return s.join(", ");
}
function at(e, t = "body") {
	U();
	let n = Ke(e);
	return V[t].cjk && (n = n.replace(qe, "<span class=\"halt\">$1</span>"), H === "zh" && (n = n.replace(tt, "<span class=\"cjkdot\">·</span>"))), n.replace(/\{([^}]*)\}/g, "<span class=\"kw\">$1</span>");
}
var ot = [
	"fx-crisp",
	"fx-soft",
	"fx-aa",
	"cjk",
	"wrap"
];
function st(e, t = "body", n = {}, r = void 0) {
	U();
	let i = V[t], a = e.classList;
	a.add("g", "tx"), a.remove(...ot), a.add(`fx-${i.fx}`), i.cjk && a.add("cjk"), n.maxW && a.add("wrap"), n.cls && a.add(...n.cls.split(" ").filter(Boolean));
	let o = e.style;
	o.fontFamily = i.family, o.fontWeight = String(i.w), o.fontSize = `calc(var(--${i.u}) * ${i.em})`, o.lineHeight = `calc(var(--${i.u}) * ${i.L})`, n.lineH && (o.lineHeight = i.u === "fpx" ? `calc(var(--fpx) * ${n.lineH * 2})` : We(n.lineH));
	let s = it(n, i);
	s ? o.textShadow = s : o.removeProperty("text-shadow"), n.color ? o.color = n.color : o.removeProperty("color"), n.kw ? o.setProperty("--g-kw", n.kw) : o.removeProperty("--g-kw");
	let c = i.cjk ? 0 : n.track ?? 0;
	return c ? o.letterSpacing = Ie(t, c) : o.removeProperty("letter-spacing"), n.maxW ? o.width = c ? `calc(${We(n.maxW)} + ${Ie(t, c)})` : We(n.maxW) : o.removeProperty("width"), n.maxW ?? (r === void 0 ? 0 : G(r, t, c));
}
function ct(e) {
	let t = e, n = null;
	if (!e.isConnected || e.getClientRects().length === 0) {
		if (!q?.isConnected) return 1;
		n = e.cloneNode(!0), q.append(n), t = n;
	}
	let r = Math.max(1, Math.round(t.offsetHeight / parseFloat(getComputedStyle(t).lineHeight)));
	return n?.remove(), r;
}
function lt(e, t, n, r, i = {}) {
	U();
	let a = i.font ?? "body", o = V[a], s = be[a], c = document.createElement("div");
	c.innerHTML = at(t, a);
	let l = st(c, a, i, t), u = c.style, d = n;
	i.align === "right" ? d = n - l : i.align === "center" && (d = n - Math.floor(l / 2));
	let [f, p] = He(e), m = Ae(he[a] ?? o) - Ae(o);
	o.u === "fpx" && (m += o.mid * (.5 - xe)), u.left = Ge(Math.round((d - f) * 2) / 2), u.top = Ge(m ? r + m - p : Math.round((r - p) * 2) / 2), e.append(c), c.tw = l;
	let h = i.lineH ? o.u === "fpx" ? i.lineH * 2 * s.unit : i.lineH : s.L;
	return c.lines = i.maxW ? ct(c) : 1, c.lh = h, c;
}
var ut = (e, t, n, r, i = {}) => lt(e, t, n, r - je(i.font ?? "body"), i), q = null, dt = (e) => {
	q = e;
}, ft = () => q;
function pt(e, t, n, r, i = {}) {
	let a = lt((q?.isConnected ? q : null) ?? e ?? document.body, t, 0, 0, {
		...i,
		font: n,
		maxW: r
	}), o = a.lines;
	return a.remove(), o;
}
var mt = (e) => String(e).split(/[ ​]/).filter(Boolean);
function ht(e, t, n) {
	let r = De() ? "" : " ", i = [];
	for (let a of mt(e)) {
		let e = i[i.length - 1];
		e != null && G(`${e}${r}${a}`, t) <= n ? i[i.length - 1] = `${e}${r}${a}` : i.push(a);
	}
	return i;
}
//#endregion
//#region src/engine/ui/FontLoader.js
var gt = "luminati.fonts", _t = "luminati.fonts.fail", vt = Object.freeze([
	"auto",
	"google",
	"local",
	"google-fail",
	"gstatic-fail"
]), yt = "https://fonts.googleapis.com/css2", bt = "https://127.0.0.1:9/css2", xt = "https://127.0.0.1:9/", St = 2500, Ct = 2500, wt = 8e3, Tt = Object.freeze({
	latin: {
		id: "latin",
		query: "family=Jersey+10&family=Jersey+15&family=Tiny5&display=block",
		local: () => Promise.all([
			Promise.resolve({              }),
			Promise.resolve({              }),
			Promise.resolve({              })
		]),
		faces: [
			"400 16px \"Jersey 10\"",
			"400 16px \"Jersey 15\"",
			"400 16px \"Tiny5\""
		],
		sample: "Aa09"
	},
	ja: {
		id: "ja",
		query: "family=DotGothic16&family=Noto+Sans+JP:wght@500;700&display=block",
		local: () => Promise.all([
			import("./_ember-no-cjk-DwwCJ0E8.js"),
			import("./_ember-no-cjk-DwwCJ0E8.js"),
			import("./_ember-no-cjk-DwwCJ0E8.js")
		]),
		faces: [
			"400 16px \"DotGothic16\"",
			"500 16px \"Noto Sans JP\"",
			"700 16px \"Noto Sans JP\""
		],
		sample: "回あ"
	},
	zh: {
		id: "zh",
		query: "family=Noto+Sans+SC:wght@500;700;900&display=block",
		local: () => Promise.all([
			import("./_ember-no-cjk-DwwCJ0E8.js"),
			import("./_ember-no-cjk-DwwCJ0E8.js"),
			import("./_ember-no-cjk-DwwCJ0E8.js")
		]),
		faces: [
			"500 16px \"Noto Sans SC\"",
			"700 16px \"Noto Sans SC\"",
			"900 16px \"Noto Sans SC\""
		],
		sample: "回烬"
	}
}), Et = /* @__PURE__ */ new Map(), Dt = (e) => {
	let t = Et.get(e);
	return t || (t = ce(e), Et.set(e, t)), t.slice(0);
}, Ot = (e) => e === "Jersey 10" ? 10 : 15;
function kt({ search: e, storage: t } = {}) {
	let n = (e) => typeof e == "string" && vt.includes(e.trim().toLowerCase()) ? e.trim().toLowerCase() : null, r = e ?? (typeof location < "u" ? location.search : "");
	try {
		let e = n(new URLSearchParams(r).get("fonts"));
		if (e) return e;
	} catch {}
	let i = t;
	if (i === void 0) try {
		i = typeof localStorage < "u" ? localStorage : null;
	} catch {
		i = null;
	}
	try {
		let e = n(i?.getItem(gt));
		if (e) return e;
	} catch {}
	return "auto";
}
var At = () => {
	try {
		return typeof localStorage < "u" ? localStorage : null;
	} catch {
		return null;
	}
};
function jt(e = Date.now()) {
	try {
		let t = At()?.getItem(_t);
		if (!t) return null;
		let n = JSON.parse(t), r = Number(n?.t);
		return !Number.isFinite(r) || e - r >= 864e5 || r > e + 6e4 ? null : {
			t: r,
			why: String(n?.why ?? "error").slice(0, 160)
		};
	} catch {
		return null;
	}
}
function Mt(e) {
	try {
		let t = At();
		if (!t) return;
		e === null ? t.removeItem(_t) : t.setItem(_t, JSON.stringify({
			t: Date.now(),
			why: e
		}));
	} catch {}
}
var Nt = (e) => {
	let t = e;
	return t?.name === "AbortError" ? "timeout" : String(t?.message ?? t ?? "error").slice(0, 160);
}, Pt = (e, t) => new Promise((n, r) => setTimeout(() => r(Error(t)), e));
async function Ft(e, t) {
	let n = e.faces.map(async (t) => {
		if (!(await document.fonts.load(t, e.sample)).length) throw Error(`no face for ${t}`);
	});
	await Promise.race([Promise.all(n), Pt(t, "probe timeout")]);
}
function It(e) {
	let t = (e) => {
		if (!e) return !0;
		for (let t of e.split(",")) {
			let e = t.trim().match(/^u\+([0-9a-f?]+)(?:-([0-9a-f]+))?$/i);
			if (!e) continue;
			let n = parseInt(e[1].replace(/\?/g, "0"), 16), r = e[2] ? parseInt(e[2], 16) : parseInt(e[1].replace(/\?/g, "f"), 16);
			if (n <= 65 && 65 <= r) return !0;
		}
		return !1;
	};
	for (let n of Array.from(document.styleSheets)) {
		let r;
		try {
			r = n.cssRules;
		} catch {
			continue;
		}
		for (let i of Array.from(r ?? [])) {
			if (!(i instanceof CSSFontFaceRule) || i.style.getPropertyValue("font-family").trim().replace(/^["']|["']$/g, "") !== e || !t(i.style.getPropertyValue("unicode-range"))) continue;
			let r = i.style.getPropertyValue("src").match(/url\(\s*(["']?)([^"')]+)\1\s*\)/);
			if (r) try {
				return new URL(r[2], n.href ?? location.href).href;
			} catch {
				return r[2];
			}
		}
	}
	return null;
}
var Lt = /* @__PURE__ */ new WeakMap();
function Rt(e) {
	let t = Lt.get(e);
	if (t) return t;
	t = [];
	for (let n of String(e.unicodeRange || "U+0-10FFFF").split(",")) {
		let e = n.trim().match(/^u\+([0-9a-f?]+)(?:-([0-9a-f]+))?$/i);
		if (!e) continue;
		let r = parseInt(e[1].replace(/\?/g, "0"), 16), i = e[2] ? parseInt(e[2], 16) : parseInt(e[1].replace(/\?/g, "f"), 16);
		t.push([r, i]);
	}
	return Lt.set(e, t), t;
}
var zt = (e, t) => Rt(e).some(([e, n]) => e <= t && t <= n);
function Bt(e) {
	let t = String(e.weight || "400").trim().split(/\s+/).map((e) => e === "bold" ? 700 : e === "normal" ? 400 : Number(e)), n = Number.isFinite(t[0]) ? t[0] : 400;
	return [n, Number.isFinite(t[1]) ? t[1] : n];
}
var Vt = (e) => e.trim().replace(/^(["'])(.*)\1$/, "$2"), Ht = 0, Ut = {
	size: -1,
	version: -1,
	byFamily: /* @__PURE__ */ new Map()
};
function Wt() {
	let e = document.fonts;
	if (Ut.size === e.size && Ut.version === Ht) return Ut.byFamily;
	let t = /* @__PURE__ */ new Map();
	return e.forEach((e) => {
		let n = Vt(e.family), r = t.get(n);
		r || t.set(n, r = []), r.push(e);
	}), Ut = {
		size: e.size,
		version: Ht,
		byFamily: t
	}, t;
}
function Gt(e, t) {
	if (typeof document > "u" || !document.fonts || typeof document.fonts.forEach != "function") return !0;
	let n = typeof e == "string" ? e : JSON.stringify(e ?? ""), r = String(t).match(/^\s*(?:(?:italic|oblique|normal)\s+)?(?:(\d{1,4}|bold|normal)\s+)?[\d.]+[a-z%]+(?:\s*\/\s*\S+)?\s+(.+)$/i);
	if (!r || !n) return !0;
	let i = r[1] === "bold" ? 700 : r[1] && r[1] !== "normal" ? Number(r[1]) : 400, a = Wt(), o = [];
	for (let e of r[2].split(",").map(Vt)) {
		let t = a.get(e);
		if (!t?.length) continue;
		let n = t.filter((e) => {
			let [t, n] = Bt(e);
			return t <= i && i <= n;
		});
		if (!n.length) {
			let e = (e) => {
				let [t, n] = Bt(e);
				return i < t ? t - i : i - n;
			}, r = Math.min(...t.map(e));
			n = t.filter((t) => e(t) === r);
		}
		o.push(n);
	}
	if (!o.length) return !0;
	let s = /* @__PURE__ */ new Set();
	for (let e of n) {
		let t = e.codePointAt(0);
		if (!s.has(t)) {
			s.add(t);
			for (let e of o) {
				let n = e.filter((e) => zt(e, t));
				if (n.length) {
					if (!n.some((e) => e.status === "loaded")) return !1;
					break;
				}
			}
		}
	}
	return !0;
}
var Kt = class {
	constructor({ lang: e = "en", mode: t = kt(), px: n = 2 } = {}) {
		if (this.lang = e === "ja" || e === "zh" ? e : "en", this.mode = vt.includes(t) ? t : "auto", this._px = Math.max(1, Math.round(n)), this.sets = [Tt.latin, ...this.lang === "en" ? [] : [Tt[this.lang]]], this.report = {
			lang: this.lang,
			mode: this.mode,
			px: this._px,
			sources: Object.fromEntries(this.sets.map((e) => [e.id, "pending"])),
			ms: null,
			googleError: null,
			remembered: null,
			localError: null,
			aliases: {},
			glyphs: []
		}, this._skipGoogle = !1, this.mode === "auto") {
			let e = jt();
			if (e) {
				this._skipGoogle = !0;
				let t = Math.max(0, Math.round((Date.now() - e.t) / 6e4));
				this.report.remembered = `${e.why}, ${t < 120 ? `${t} min` : `${Math.round(t / 60)} h`} ago`;
			}
		}
		this._aliases = [], this._glyphs = [], this._aliasJob = Promise.resolve(), this._ready = null, this._setsIn = !1, this._ensured = /* @__PURE__ */ new Map();
	}
	start() {
		if (this._ready) return this._ready;
		let e = performance.now();
		return this._ready = Promise.all([...this.sets.map((e) => this._loadSet(e)), this._addGlyphs()]).then(() => (this.mode === "auto" && !this._skipGoogle && Mt(this.report.googleError), this._setsIn = !0, this._queueAliases())).catch((e) => {
			console.warn("[Luminati] fonts:", e);
		}).then(() => (this.report.ms = Math.round(performance.now() - e), this.report)), this._ready;
	}
	get ready() {
		return this.start();
	}
	get px() {
		return this._px;
	}
	setScale(e) {
		let t = Math.max(1, Math.round(e));
		return this._setsIn ? t === this._px ? this._aliasJob : (this._px = t, this.report.px = t, this._queueAliases()) : (this._px = t, this.report.px = t, this.start().then(() => this._aliasJob));
	}
	async ensure(e) {
		await this.ready;
		let t = typeof e == "string" ? e : JSON.stringify(e ?? "");
		if (!t || typeof document > "u" || !document.fonts) return;
		let n = /* @__PURE__ */ new Set();
		for (let e of t) e.codePointAt(0) > 126 && n.add(e);
		if (!n.size) return;
		let r = /* @__PURE__ */ new Set([...this.sets.flatMap((e) => e.faces), ...Re()]), i = /* @__PURE__ */ new Set();
		for (let e of r) {
			let t = this._ensured.get(e);
			t || this._ensured.set(e, t = /* @__PURE__ */ new Map());
			let r = "";
			for (let e of n) {
				let n = t.get(e);
				n ? i.add(n) : r += e;
			}
			if (!r) continue;
			let a;
			try {
				a = document.fonts.load(e, r).catch(() => []);
			} catch {
				a = Promise.resolve([]);
			}
			for (let e of r) t.set(e, a);
			i.add(a);
		}
		i.size && await Promise.all(i);
	}
	async _loadSet(e) {
		let t = this.report;
		if (this.mode !== "local" && !this._skipGoogle) try {
			await this._viaGoogle(e), t.sources[e.id] = "google";
			return;
		} catch (n) {
			if (t.googleError ||= `${e.id}: ${Nt(n)}`, this.mode === "google") {
				t.sources[e.id] = "none";
				return;
			}
		}
		try {
			await e.local(), await Ft(e, wt), t.sources[e.id] = "local";
		} catch (n) {
			t.localError ||= `${e.id}: ${Nt(n)}`, t.sources[e.id] = "none";
		}
	}
	async _viaGoogle(e) {
		let t = `${this.mode === "google-fail" ? bt : yt}?${e.query}`, n = new AbortController(), r = setTimeout(() => n.abort(), St), i;
		try {
			let e = await fetch(t, {
				signal: n.signal,
				credentials: "omit"
			});
			if (!e.ok) throw Error(`HTTP ${e.status}`);
			i = await e.text();
		} finally {
			clearTimeout(r);
		}
		if (!/@font-face/.test(i)) throw Error("no @font-face in the stylesheet");
		this.mode === "gstatic-fail" && (i = i.replace(/https:\/\/fonts\.gstatic\.com\//g, xt));
		let a = document.createElement("style");
		a.dataset.fonts = `google:${e.id}`, a.textContent = i, document.head.append(a);
		try {
			await Ft(e, Ct);
		} catch (e) {
			throw a.remove(), e;
		}
	}
	async _addGlyphs() {
		if (typeof document > "u" || !document.fonts || typeof FontFace > "u") return;
		let e = Object.entries(te).map(([e, t]) => [Number(e), t]), t = await Promise.all(e.map(async ([e, t]) => {
			try {
				let n = new FontFace(t, Dt(e), {
					unicodeRange: C,
					display: "block",
					weight: "100 900"
				});
				return await n.load(), document.fonts.add(n), n;
			} catch (e) {
				return console.warn(`[Luminati] pixel glyphs ${t}:`, e), null;
			}
		}));
		this._glyphs = t.filter(Boolean), Ht++, this.report.glyphs = this._glyphs.map((e) => e.family);
	}
	_queueAliases() {
		return this._aliasJob = this._aliasJob.then(() => this._buildAliases()).catch((e) => {
			console.warn("[Luminati] font aliases:", e);
		}), this._aliasJob;
	}
	async _buildAliases() {
		let e = ze(this.lang, this._px);
		if (!e.length) return;
		let t = {};
		for (let n of e) n.source in t || (t[n.source] = It(n.source));
		let n = [], r = {};
		for (let i of e) {
			let e = t[i.source], a = `${+(i.sizeAdjust * 100).toFixed(6)}%`;
			try {
				n.push(new FontFace(i.glyphs, Dt(Ot(i.source)), {
					unicodeRange: C,
					sizeAdjust: a,
					display: "block",
					weight: "100 900"
				})), r[i.glyphs] = a;
			} catch {}
			e && (n.push(new FontFace(i.family, `url("${e}") format("woff2")`, {
				unicodeRange: le,
				sizeAdjust: a,
				display: "block",
				weight: "100 900"
			})), r[i.family] = `${i.source} ×${i.k}, ${a}`);
		}
		await Promise.all(n.map((e) => e.load().catch(() => null)));
		for (let e of this._aliases) document.fonts.delete(e);
		for (let e of n) e.status === "loaded" && document.fonts.add(e);
		this._aliases = n.filter((e) => e.status === "loaded"), Ht++, this.report.aliases = r;
	}
}, qt = null;
function Jt(e = {}) {
	return qt || (qt = new Kt(e), qt.start()), qt;
}
var Yt = () => qt;
//#endregion
//#region src/engine/ui/art/pieces.js
function Xt(e, t) {
	let [n, r, i, a] = e.length === 3 ? [
		e[0],
		e[0],
		e[1],
		e[2]
	] : e;
	if (t <= 1) return [i];
	if (t === 2) return [a, r];
	if (t === 3) return [
		a,
		i,
		r
	];
	if (t === 4) return [
		a,
		i,
		r,
		n
	];
	let o = [];
	for (let e = 0; e < t; e++) o.push(e === 0 ? a : e < t / 2 ? i : e < t - 1 ? r : n);
	return o;
}
function Zt(e, t, n, r, i, o = {}) {
	let s = a(), c = 0, l = 0;
	o.ring && (e.rect(1, 0, t - 2, n, o.ring), e.rect(0, 1, t, n - 2, o.ring), c = 1, l = 1, t -= 2, n -= 2), e.rect(c, l, t, n, o.outline ?? s.ink0);
	let u = t - 2, d = n - 2, f = Math.round(u * Math.max(0, Math.min(1, r))), p = o.chip == null ? f : Math.round(u * o.chip), m = Xt(i, d), h = Xt([
		s.g3,
		s.g4,
		s.g5,
		s.g5
	], d);
	for (let t = 0; t < d; t++) {
		let n = l + 1 + t;
		e.hline(c + 1, n, u, t === 0 ? o.trough?.[0] ?? s.tr0 : o.trough?.[1] ?? s.tr1), p > f && e.hline(c + 1 + f, n, p - f, h[t]), f > 0 && e.hline(c + 1, n, f, m[t]);
	}
	if (f > 1 && f < u && d > 2 && e.vline(c + f, l + 2, d - 1, m[0]), o.notch) for (let t = 1; t < o.notch; t++) {
		let n = c + 1 + Math.round(u * t / o.notch);
		e.vline(n, l + 1 + d - Math.ceil(d / 2), Math.ceil(d / 2), s.ink0);
	}
}
var Qt = Object.freeze({
	cursor: [
		"oo......",
		"oLoo....",
		"oLLGoo..",
		"oLWGGDoo",
		"oLGGDDoo",
		"oLGDoo..",
		"oGoo....",
		"oo......"
	],
	cursorGem: [
		"..oo........",
		"..oLoo......",
		"ooLLGGoo....",
		"oLLWGGDDoo..",
		"oLGcbbaDDDo.",
		"oLGGbaDDoo..",
		"ooGGDDoo....",
		"..oGoo......",
		"..oo........"
	],
	advance: [
		"ooooooooo",
		"oLLLLLLGo",
		".oLWGGDo.",
		".oGGGDDo.",
		"..oGDDo..",
		"..oGDo...",
		"...oDo...",
		"....o...."
	],
	left: [
		"...oo",
		"..oLo",
		".oLGo",
		"oLGDo",
		".oGDo",
		"..oDo",
		"...oo"
	],
	right: [
		"oo...",
		"oLo..",
		"oGLo.",
		"oGGLo",
		"oGDo.",
		"oDo..",
		"oo..."
	],
	kUp: [
		"...o...",
		"..ooo..",
		".ooooo.",
		"ooooooo",
		"..ooo..",
		"..ooo..",
		"..ooo.."
	],
	kDown: [
		"..ooo..",
		"..ooo..",
		"..ooo..",
		"ooooooo",
		".ooooo.",
		"..ooo..",
		"...o..."
	],
	kLeft: [
		"...o...",
		"..oo...",
		".oooooo",
		"ooooooo",
		".oooooo",
		"..oo...",
		"...o..."
	],
	kRight: [
		"...o...",
		"...oo..",
		"oooooo.",
		"ooooooo",
		"oooooo.",
		"...oo..",
		"...o..."
	],
	check: [
		".......oo",
		"......oLo",
		"oo...oLo.",
		"oLo.oLo..",
		".oLoLo...",
		"..oLo....",
		"...o....."
	],
	lock: [
		"..ooo..",
		".oLLLo.",
		"oLoooLo",
		"oGo.oGo",
		"ooooooo",
		"oLLWLLo",
		"oGGoGGo",
		"oGGoGDo",
		"oDDDDDo",
		"ooooooo"
	]
});
function $t(e, t = {}) {
	let n = a(), r = Qt[e];
	if (!r) throw Error(`glyph: no glyph "${e}" (${Object.keys(Qt).join(", ")})`);
	let i = {
		o: n.ink0,
		L: n.g4,
		G: n.g3,
		D: n.g2,
		B: n.g1,
		W: n.g5,
		a: n.sa1,
		b: n.sa2,
		c: n.sa3,
		...t
	}, o = Math.max(...r.map((e) => e.length));
	return l(o, r.length, (e) => e.rows(0, 0, r, i));
}
var en = (e) => {
	let t = a();
	return $t(e, {
		L: t.dm1,
		G: t.dm2,
		D: t.dm3,
		W: t.dm1,
		B: t.dm3
	});
};
function tn(e = 2, t = r.gold(), n = {}) {
	let i = 2 * e + 3;
	return l(i, i, (r) => u(r, e + 1, e + 1, e, t, n));
}
function nn(e, t = 11, n = null, r = !1) {
	let i = a(), o = r ? i.dm2 : i.kf1, s = r ? i.dm1 : i.kf0, c = r ? i.dm3 : i.kf2, u = r ? i.ink2 : i.kf3;
	return l(e, t, (r) => {
		r.rect(1, 0, e - 2, t, i.ink0), r.rect(0, 1, e, t - 2, i.ink0), r.rect(1, 1, e - 2, t - 3, o), r.hline(2, t - 2, e - 4, u), r.px(1, t - 2, i.ink0), r.px(e - 2, t - 2, i.ink0), r.hline(2, t - 3, e - 4, c), r.hline(2, 1, e - 4, s), n && r.rows(Math.floor((e - Qt[n][0].length) / 2), 1, Qt[n], { o: i.kink });
	});
}
var rn = [
	0,
	8,
	2,
	10,
	12,
	4,
	14,
	6,
	3,
	11,
	1,
	9,
	15,
	7,
	13,
	5
].map((e) => (e + .5) / 16);
function an(e, t, n, r, i = 6, a = 3) {
	let [o, s, c] = n.split(",").map((e) => parseInt(e, 10)), u = (typeof i == "number" ? Array.from({ length: i }, (e, t) => (t + 1) / i) : [...i]).sort((e, t) => e - t);
	u[0] > 0 && u.unshift(0);
	let d = e + 2, f = new Float32Array(d * (t + 2));
	for (let n = -1; n <= t; n++) for (let i = -1; i <= e; i++) f[(n + 1) * d + i + 1] = Math.max(0, Math.min(1, r((i + .5) / e, (n + .5) / t)));
	let p = (e, t) => f[(t + 1) * d + e + 1];
	return l(e, t, (n) => {
		if (!e || !t) return;
		let r = n.ctx.createImageData(e, t), i = r.data;
		for (let n = 0; n < t; n++) for (let t = 0; t < e; t++) {
			let r = p(t, n), l = u[u.length - 1];
			if (r < l) {
				let e = 0;
				for (; r >= u[e + 1];) e++;
				let i = u[e], o = u[e + 1], s = (r - i) / (o - i), c = Math.max(Math.abs(p(t + 1, n) - p(t - 1, n)), Math.abs(p(t, n + 1) - p(t, n - 1))) / 2 / (o - i), d = a / 2 * c;
				l = d < 1e-6 ? s >= .5 ? o : i : s <= .5 - d ? i : s >= .5 + d || (s - .5 + d) / (2 * d) > rn[n % 4 * 4 + t % 4] ? o : i;
			}
			if (l < .001) continue;
			let d = (n * e + t) * 4;
			i[d] = o, i[d + 1] = s, i[d + 2] = c, i[d + 3] = Math.round(l * 255);
		}
		n.ctx.putImageData(r, 0, 0);
	});
}
var on = (e) => {
	let t = e.replace("#", ""), n = parseInt(t.length === 3 ? t.replace(/./g, (e) => e + e) : t, 16);
	return `${n >> 16 & 255}, ${n >> 8 & 255}, ${n & 255}`;
}, sn = (e) => (t) => {
	if (t <= e[0][0]) return e[0][1];
	for (let n = 1; n < e.length; n++) {
		let [r, i] = e[n], [a, o] = e[n - 1];
		if (t <= r) return o + (i - o) * (t - a) / (r - a);
	}
	return e[e.length - 1][1];
}, cn = Object.freeze([
	.27,
	.55,
	.82
]), ln = (e, t, n = .86, r = .72, i = .55) => an(e, t, on(a().band), sn([
	[0, n],
	[i, r],
	[1, 0]
]), [...cn]);
function un(e, t = "r", n = null) {
	let r = a();
	return l(e, 1, (i) => {
		for (let a = 0; a < e; a++) {
			let o = t === "both" ? Math.abs((a + .5) / e - .5) * 2 : (a + .5) / e;
			o > .72 && a % 2 || o > .88 && a % 4 || i.px(a, 0, n ?? r.g3);
		}
	});
}
function dn(e, t) {
	let n = a(), r = an(e, t, on(n.band), (e, n) => n * t < 1 || n * t > t - 1 ? 0 : sn([
		[0, 0],
		[.22, .82],
		[.78, .82],
		[1, 0]
	])(e), [...cn]), i = r.getContext("2d");
	return i.drawImage(un(e, "both"), 0, 0), i.drawImage(un(e, "both", n.g2), 0, t - 1), r;
}
function fn(e, t, { lines: n = "gilt", wash: r = null } = {}) {
	let i = a(), [o, s, c, u] = n === "dim" ? [
		i.dm1,
		i.dm2,
		i.dm2,
		i.dm3
	] : [
		i.g3,
		i.g2,
		i.g2,
		i.g1
	];
	return l(e, t, (n) => {
		for (let a = 0; a < e - 6; a++) for (let o = 1; o < t - 1; o++) a > e - 14 && (a + o) % 2 || n.px(a, o, r ?? i.wash);
		for (let r = 3; r < e - 10; r++) {
			let i = r > e - 36;
			(!i || r % 2) && (n.px(r, 0, i ? c : o), n.px(r, t - 1, i ? u : s));
		}
	});
}
function pn() {
	let e = a(), t = [
		"..oooooooooooooooooooo..",
		".oWWWWWWWWWWWWWWWWWWWWo.",
		"oWWFFFFFFFFFFFFFFFFFFFFo",
		"oWFFFFFFFFFFFFFFFFFFFFFo",
		"oWFFFFFFFFFFFFFFFFFFFFFo",
		"oWFFFFFFFFFFFFFFFFFFFFFo",
		"oWFFFFooFFFFooFFFFooFFFo",
		"oWFFFFooFFFFooFFFFooFFFo",
		"oWFFFFFFFFFFFFFFFFFFFFFo",
		"oWFFFFFFFFFFFFFFFFFFFFFo",
		"oFFFFFFFFFFFFFFFFFFFFFLo",
		"oLFFFFFFFFFFFFFFFFFFFLLo",
		".oLLLLLLLLLLLLLLLLLLLLo.",
		"..ooooooooFFFFoooooooo..",
		".........oFFLo..........",
		"..........oFLo..........",
		"...........oLo..........",
		"............o..........."
	];
	return l(24, 18, (n) => n.rows(0, 0, t, {
		o: e.ink0,
		W: e.kf0,
		F: e.kf1,
		L: e.kf2
	}));
}
function mn(e = 11, t = r.sapphire()) {
	let n = a(), i = (e - 1) / 2, c = i, d = Math.max(1.2, e / 9), f = c * .62, p = Math.max(.9, e / 13), m = new Uint8Array(e * e);
	for (let t = 0; t < e; t++) for (let n = 0; n < e; n++) {
		let r = Math.abs(n - i), a = Math.abs(t - i), o = Math.abs(n - i + (t - i)) / Math.SQRT2, s = Math.abs(n - i - (t - i)) / Math.SQRT2, l = r / d + a / c <= 1.0001 || a / d + r / c <= 1.0001, u = o / p + s / f <= 1.0001 || s / p + o / f <= 1.0001;
		(l || u) && (m[t * e + n] = 1);
	}
	return l(e + 2, e + 2, (r) => {
		s(r, o(m, e, e, 1, 1)), e >= 15 ? u(r, i + 1, i + 1, 2, t) : r.px(i + 1, i + 1, n.sa2);
	});
}
function hn(e) {
	let t = a(), n = (e - 1) / 2;
	return l(e, e, (r) => {
		for (let i = 0; i < e; i++) for (let a = 0; a < e; a++) {
			let e = Math.hypot(a - n, i - n);
			e > n - .5 && e <= n + .5 ? (a + i) % 2 == 0 && r.px(a, i, t.g1) : e > n - 1.5 && e <= n - .5 && r.px(a, i, t.g2);
		}
	});
}
function gn(e, t) {
	let n = a(), r = [
		n.day0,
		n.day1,
		n.day2,
		n.day3,
		n.day4,
		n.day5,
		n.day6,
		n.day7
	];
	return l(e + 4, 7, (i) => {
		i.rect(1, 2, e + 2, 4, n.ink0);
		for (let t = 0; t < e; t++) {
			let n = r[Math.min(r.length - 1, Math.floor(t / e * r.length))];
			i.px(2 + t, 3, n), i.px(2 + t, 4, n);
		}
		let a = 2 + Math.round(t * (e - 1));
		s(i, [
			[
				a,
				2,
				n.tx1
			],
			[
				a - 1,
				3,
				n.tx1
			],
			[
				a,
				3,
				n.g5
			],
			[
				a + 1,
				3,
				n.tx1
			],
			[
				a - 1,
				4,
				n.kf2
			],
			[
				a,
				4,
				n.tx1
			],
			[
				a + 1,
				4,
				n.kf2
			],
			[
				a,
				5,
				n.kf2
			],
			[
				a,
				1,
				n.tx1
			]
		]);
	});
}
function _n() {
	let e = a(), t = [
		"..ooooo..",
		".oWWLLGo.",
		"oWLDDDLGo",
		"oWDLLLDGo",
		"oLDLDLDBo",
		"oLDLLLDBo",
		"oGLDDDGBo",
		".oGGBBBo.",
		"..ooooo.."
	];
	return l(9, 9, (n) => n.rows(0, 0, t, {
		o: e.ink0,
		W: e.g5,
		L: e.g4,
		G: e.g3,
		D: e.g2,
		B: e.g1
	}));
}
function vn(e, t = r.sapphire()) {
	let n = a(), i = Math.floor(e / 2);
	return l(e, 13, (r) => {
		for (let t = 1; t < e - 1; t++) {
			let a = Math.abs(t - i) / (e / 2);
			Math.abs(t - i) < 8 || a > .7 && (t - i) % 2 || a > .86 && (t - i) % 4 || (r.px(t, 5, n.ink0), r.px(t, 8, n.ink0), r.px(t, 6, a < .5 ? n.g4 : n.g3), r.px(t, 7, a < .5 ? n.g2 : n.g1));
		}
		let a = [
			".LGG.",
			"L...D",
			"G.G.D",
			"G..D.",
			".DD.."
		];
		for (let o of [1, -1]) {
			let c = [];
			a.forEach((e, t) => {
				for (let r = 0; r < e.length; r++) e[r] !== "." && c.push([
					i + o * (8 + r),
					4 + t,
					{
						L: n.g4,
						G: n.g3,
						D: n.g2
					}[e[r]]
				]);
			}), s(r, c);
			for (let e of [18, 22]) s(r, [[
				i + o * e,
				6,
				n.tx1
			], [
				i + o * e,
				7,
				n.tx3
			]]);
			u(r, i + o * Math.round(e * .32), 6, 1, t, { setting: [
				n.g5,
				n.g4,
				n.g3
			] });
		}
		u(r, i, 6, 4, t);
	});
}
//#endregion
//#region src/engine/ui/art/frames.js
var yn = Object.freeze([
	"...........",
	"...........",
	"...........",
	"...WLGGGGD.",
	"...LL.....D",
	"...G.L.G..D",
	"...G..G.DD.",
	"...G.G.....",
	"...G..D....",
	"...D..D....",
	"....DD....."
]), bn = null;
function xn() {
	if (bn) return bn;
	let { b: e, w: t, h: n } = c([...yn]);
	return bn = {
		b: i(e, t, n),
		w: t * 2,
		h: n * 2
	}, bn;
}
function Sn(e, t, n, i = r.sapphire()) {
	let c = a(), l = t - 13, d = n - 15, f = [
		[0, 7],
		[4, 4],
		[8, 9],
		[13, 1],
		[18, 9],
		[22, 4],
		[26, 7]
	], p = (e) => {
		for (let t = 0; t < f.length - 1; t++) {
			let [n, r] = f[t], [i, a] = f[t + 1];
			if (e >= n && e <= i) return Math.round(r + (a - r) * (e - n) / (i - n));
		}
		return 15;
	}, m = /* @__PURE__ */ new Uint8Array(405);
	for (let e = 0; e < 27; e++) for (let t = p(e); t < 15; t++) m[t * 27 + e] = 1;
	let h = o(m, 27, 15, l, d);
	for (let e of h) {
		let t = e[1] - d;
		t === 10 ? e[2] = c.g5 : t === 11 ? e[2] = c.ink0 : t === 14 && (e[2] = c.g2);
	}
	s(e, h);
	for (let [t, n] of [
		[4, 2],
		[13, -1],
		[22, 2]
	]) s(e, [
		[
			l + t,
			d + n,
			c.tx1
		],
		[
			l + t - 1,
			d + n,
			c.tx2
		],
		[
			l + t + 1,
			d + n,
			c.tx2
		],
		[
			l + t,
			d + n - 1,
			c.g5
		],
		[
			l + t,
			d + n + 1,
			c.tx3
		]
	]);
	u(e, t, d + 12, 2, i);
	for (let t of [6, 20]) e.px(l + t, d + 12, c.tx1), e.px(l + t + (t < 13 ? -1 : 1), d + 12, c.tx3);
}
var Cn = () => [
	a().glass0,
	a().glass1,
	a().glass2,
	a().glass3
], wn = Object.freeze([
	0,
	.22,
	.46,
	.74
]);
function Tn(e, t, n, r, i, o = {}) {
	let s = a(), c = o.size ?? "M", l = o.tone === "dim", u = o.notch ?? (c === "S" ? 4 : 0), d = u * u, f = [
		[0, 0],
		[r - 1, 0],
		[0, i - 1],
		[r - 1, i - 1]
	], p = (e, t) => {
		if (e < 0 || t < 0 || e >= r || t >= i) return !1;
		if (u) {
			for (let [n, r] of f) if ((e - n) ** 2 + (t - r) ** 2 < d) return !1;
		}
		return !0;
	}, m = new Uint8Array(r * i), h = new Int32Array(r * i), g = 0, _ = 0;
	for (let e = 0; e < i; e++) for (let t = 0; t < r; t++) p(t, e) && (!p(t - 1, e) || !p(t + 1, e) || !p(t, e - 1) || !p(t, e + 1)) && (m[e * r + t] = 1, h[_++] = e * r + t);
	for (; g < _;) {
		let e = h[g++], t = m[e];
		if (t >= 9) continue;
		let n = e % r, i = (e - n) / r;
		for (let [e, a] of [
			[n - 1, i],
			[n + 1, i],
			[n, i - 1],
			[n, i + 1]
		]) {
			if (!p(e, a)) continue;
			let n = a * r + e;
			m[n] === 0 && (m[n] = t + 1, h[_++] = n);
		}
	}
	let v = o.fill === null ? null : o.fill ? [o.fill] : o.bands ?? Cn(), y = o.stops ?? wn, b = (e, t) => {
		if (!v) return null;
		if (v.length === 1) return v[0];
		let n = e / Math.max(1, i - 1), r = 0;
		for (let e = 1; e < v.length; e++) n >= y[e] && (r = e);
		let a = r + 1;
		return a < v.length && e === Math.round(y[a] * (i - 1)) - 1 && (t + e) % 2 == 0 ? v[a] : v[r];
	}, x = l ? [
		s.dm1,
		s.dm2,
		s.dm3,
		s.dm2
	] : o.sel ? [
		s.g5,
		s.g4,
		s.g3,
		s.g4
	] : [
		s.g4,
		s.g3,
		s.g2,
		s.g3
	], S = c === "L" ? 26 : 0, C = (e, t) => S && (e < S || e >= r - S) && (t < S || t >= i - S), ee = o.sheen !== !1 && i > 10 && !o.socket;
	if (v) for (let a = 0; a < i; a++) {
		let i = 0, o = null;
		for (let s = 0; s <= r; s++) {
			let c = s < r && p(s, a) ? b(a, s) : null;
			if (c === o && c) {
				i++;
				continue;
			}
			o && i && e.rect(t + s - i, n + a, i, 1, o), o = c, i = +!!c;
		}
	}
	for (let a = -1; a <= i; a++) for (let i = -1; i <= r; i++) {
		let c = t + i, u = n + a;
		if (!p(i, a)) {
			(p(i - 1, a) || p(i + 1, a) || p(i, a - 1) || p(i, a + 1)) && e.px(c, u, s.ink0);
			continue;
		}
		let d = m[a * r + i];
		if (d === 0) {
			if (o.lattice && !C(i, a)) {
				let t = (i + a) % 16, n = (i - a + 1600) % 16;
				t === 0 && n === 0 ? e.px(c, u, s["glass-x"]) : (t === 0 || n === 0) && (i + a) % 2 == 0 && e.px(c, u, s["glass-lat"]);
			}
			continue;
		}
		let f = !p(i, a - d), h = !p(i - d, a), g = f || h, _ = null;
		d === 1 ? _ = g ? x[0] : x[2] : d === 2 ? _ = g ? x[1] : x[3] : d === 3 ? _ = s.ink0 : o.socket ? d === 4 && (_ = g ? s.ink0 : s.ink3) : (d === 4 && f && ee || d === 5 && f && ee && (i + a) % 2 == 0) && (_ = s["glass-hi"]), o.beads && d === (o.beads === !0 ? 6 : o.beads) && !C(i, a) && (_ = (i + a) % 2 == 0 ? l ? s.dm3 : s.g2 : null), _ && e.px(c, u, _);
	}
	!l && !u && (e.px(t, n, s.g5), e.px(t + 1, n, s.g5), e.px(t, n + 1, s.g5));
}
function En(e, t, n, i, c, l = {}) {
	let d = a(), f = l.size ?? "M", p = l.tone === "dim" ? [
		d.dm1,
		d.dm2,
		d.dm3
	] : null, m = l.corners === void 0 ? f === "L" ? r.sapphire() : r.gold() : l.corners, h = t + i - 1, g = n + c - 1, _ = [
		[
			1,
			1,
			t,
			n
		],
		[
			-1,
			1,
			h,
			n
		],
		[
			1,
			-1,
			t,
			g
		],
		[
			-1,
			-1,
			h,
			g
		]
	];
	if (f === "L") {
		let t = xn();
		for (let [n, r, i, a] of _) s(e, o(t.b, t.w, t.h, i, a, n, r));
	} else if (f === "M" && l.scrolls) {
		let t = {
			L: d.g4,
			G: d.g3,
			D: d.g2,
			B: d.g1,
			W: d.g5
		};
		for (let [n, r, i, a] of _) yn.forEach((o, s) => {
			for (let c = 0; c < o.length; c++) o[c] !== "." && e.px(i + n * (c + 1), a + r * (s + 1), t[o[c]]);
		});
	}
	let v = l.cornerR ?? (f === "L" ? 5 : f === "M" ? 3 : 2);
	if (m && v > 0) for (let [t, n, r, i] of _) u(e, f === "L" ? r + t : r, f === "L" ? i + n : i, v, m, { setting: p });
	let y = t + Math.floor((i - 1) / 2), b = (t) => {
		u(e, y - 7, t, 1, r.gold(), { setting: p }), u(e, y + 7, t, 1, r.gold(), { setting: p }), u(e, y, t, l.trioR ?? 3, l.trioGem ?? r.gold(), { setting: p });
	};
	if (l.crown ? Sn(e, y, n + 2, l.crownGem ?? r.sapphire()) : l.trio && l.trioTop !== !1 && b(n), l.trio ? b(g) : l.pendant && u(e, y, g, 3, r.gold(), { setting: p }), l.sides) {
		let i = n + Math.floor((c - 1) / 2);
		u(e, t, i, l.sideR ?? 2, r.gold(), { setting: p }), u(e, h, i, l.sideR ?? 2, r.gold(), { setting: p });
	}
	if (l.ends) {
		let i = n + Math.floor((c - 1) / 2);
		u(e, t, i, l.endR ?? 2, l.endGem ?? r.gold(), { setting: p }), u(e, h, i, l.endR ?? 2, l.endGem ?? r.gold(), { setting: p });
	}
}
var J = /* @__PURE__ */ new Map(), Dn = 256, On = 6e6, kn = 0;
function An(e, t, r) {
	let i = `${Math.round(t)}x${Math.round(r)}|${JSON.stringify(e)}`, a = J.get(i);
	if (a) J.delete(i), J.set(i, a);
	else {
		let n = Math.round(t), o = Math.round(r), s = l(n + 36, o + 36, (t) => Tn(t, 18, 18, n, o, e)), c = e.orn === !1 ? null : l(n + 36, o + 36, (t) => En(t, 18, 18, n, o, e));
		for (a = {
			base: s,
			orn: c,
			px: s.width * s.height * (c ? 2 : 1)
		}, J.set(i, a), kn += a.px; J.size > 1 && (J.size > Dn || kn > On);) {
			let e = J.keys().next().value;
			kn -= J.get(e).px, J.delete(e);
		}
	}
	return {
		base: n(a.base),
		orn: a.orn ? n(a.orn) : null
	};
}
//#endregion
//#region src/engine/ui/layout/layout.js
var Y = (e) => `calc(var(--px) * ${e})`, jn = (e) => `round(down, calc(${e}), var(--lu-dpx, 1px))`;
function Mn(e, t, n, r = null, i = null) {
	e.style.left = Y(t), e.style.top = Y(n), r != null && (e.style.width = Y(r)), i != null && (e.style.height = Y(i));
}
function Nn(e, t, n, r, i, a, o = "") {
	let s = document.createElement("div");
	return s.className = `g grp${o ? ` ${o}` : ""}`, Pn(s, t, n, r, i, a, e), e.append(s), s;
}
function Pn(e, t, n, r, i, a, o = null) {
	i += i % 2, a += a % 2, e.classList.add("g", "grp"), Ue(e, [n, r]), e.dataset.anchor = t;
	let s = e.style;
	s.left = "", s.right = "", s.top = "", s.bottom = "", s.width = Y(i), s.height = Y(a);
	let [c, l] = t === "stage" ? ["t", "l"] : t.split(""), u, d;
	return l === "l" ? (s.left = Y(n), u = Y(-n)) : l === "r" ? (s.right = Y(640 - n - i), u = `calc(100% + ${Y(640 - n - i)})`) : (s.left = jn(`50% - ${Y(i / 2)} + ${Y(n + i / 2 - 320)}`), u = `calc(50% - ${Y(n + i / 2 - 320)})`), c === "t" ? (s.top = Y(r), d = Y(-r)) : c === "b" ? (s.bottom = Y(360 - r - a), d = `calc(100% + ${Y(360 - r - a)})`) : (s.top = jn(`50% - ${Y(a / 2)} + ${Y(r + a / 2 - 180)}`), d = `calc(50% - ${Y(r + a / 2 - 180)})`), t === "stage" ? s.removeProperty("transform-origin") : s.transformOrigin = `${u} ${d}`, Fn(e, t, n, r, i, a, o), e;
}
function Fn(e, t, n, r, i, a, o = null) {
	let s = y(o ?? e), c = s ? x(t, n, r, i, a, s.artW, s.artH) : 1;
	return c < 1 ? (e.dataset.fit = "shrunk", e.style.setProperty("--lu-fit", `${+c.toFixed(6)}`)) : e.dataset.fit && (delete e.dataset.fit, e.style.removeProperty("--lu-fit")), c;
}
function In(e, t, n, r, i = 1, a = "") {
	let [o, s] = He(e);
	return t.classList.add("px", "g"), a && t.classList.add(...a.split(" ").filter(Boolean)), Mn(t, Math.round(n - o), Math.round(r - s), t.width * i, t.height * i), e.append(t), t;
}
function Ln(e, t, n, r, i, a) {
	let { base: o, orn: s } = An(t, i, a);
	return In(e, o, n - 18, r - 18, 1, "frame"), s && In(e, s, n - 18, r - 18, 1, "orn"), {
		base: o,
		orn: s
	};
}
var Rn = Object.freeze({
	"↑": "kUp",
	"↓": "kDown",
	"←": "kLeft",
	"→": "kRight"
}), zn = (e) => /^[0-9]$/.test(e), Bn = (e) => Rn[e] ? 11 : Math.max(11, G(e, zn(e) ? "num" : "tiny") + 6);
function Vn(e, t, n, r, i = {}) {
	let o = Bn(t), s = nn(o, 11, Rn[t] ?? null, i.dim);
	if (s.setAttribute("role", "img"), s.setAttribute("aria-label", t), In(e, s, n, r, 1, `key${i.cls ? ` ${i.cls}` : ""}`), !Rn[t]) {
		let s = a(), c = zn(t) ? "num" : "tiny";
		lt(e, t, n + Math.floor(o / 2) - Math.floor(G(t, c) / 2), r + 4.5 - je(c), {
			font: c,
			color: i.dim ? s.ink1 : s.kink,
			cls: `keylab${i.cls ? ` ${i.cls}` : ""}`
		});
	}
	return o;
}
function Hn(e, t, n, r, i = {}) {
	let a = i.font ?? "line", o = i.gap ?? 10, s = t.map((e) => ({
		keys: e.keys,
		label: e.label,
		lw: G(e.label, a)
	})), c = s.reduce((e, t) => e + t.keys.reduce((e, t) => e + Bn(t) + 2, 0) + 2 + t.lw + o, -o), l = i.align === "right" ? n - c : i.align === "center" ? n - Math.floor(c / 2) : n, u = r + 5.5 - je(a);
	for (let t of s) {
		for (let n of t.keys) l += Vn(e, n, l, r) + 2;
		lt(e, t.label, l + 2, u, {
			font: a,
			color: i.color,
			ol: i.ol,
			drop: i.drop,
			cls: i.cls
		}), l += 2 + t.lw + o;
	}
	return c;
}
function Un(e, t, n, r, i, o = null, s = "line") {
	let c = a();
	ut(e, t, n, i, {
		font: "small",
		track: 1,
		color: c.g4,
		drop: !0
	});
	let l = G(t, "small", 1), u = o ? G(o, s) + 6 : 0;
	In(e, un(r - n - l - 6 - u, "r"), n + l + 5, Math.round(i)), o && ut(e, o, r, i, {
		font: s,
		color: c.g4,
		align: "right",
		drop: !0
	});
}
//#endregion
//#region src/engine/ui/art/icons/core.js
var Wn = "#1a1222", Gn = "#ffffff", X = {
	BLUE: {
		d: "#18266c",
		m: "#2a58c0",
		l: "#4c98ee",
		h: "#b2e0ff"
	},
	BONE: {
		d: "#6a6252",
		m: "#aca48c",
		l: "#dcd4ba",
		h: "#fbf8ea"
	},
	FIRE: {
		d: "#861a10",
		m: "#d6421a",
		l: "#f59a2a",
		h: "#ffe27a"
	},
	FLASK: {
		d: "#4a2a14",
		m: "#8a5a2c",
		l: "#9fb8d2",
		h: "#e6f4ff"
	},
	GEM: {
		d: "#0e4a52",
		m: "#1e8c8e",
		l: "#46c8c0",
		h: "#b8fff0"
	},
	GLOVE: {
		d: "#6a6c8c",
		m: "#acb0c6",
		l: "#e0e2ee",
		h: "#ffffff"
	},
	GOLD: {
		d: "#7c4610",
		m: "#c27e1a",
		l: "#eeb63c",
		h: "#fde88e"
	},
	GREEN: {
		d: "#18502a",
		m: "#2e8a36",
		l: "#68c648",
		h: "#ccf28a"
	},
	LEATHER: {
		d: "#3e2410",
		m: "#6e4222",
		l: "#9c6436",
		h: "#c88e56"
	},
	MOON: {
		d: "#545c8c",
		m: "#97a2d0",
		l: "#cfd8f2",
		h: "#f8fbff"
	},
	PARCH: {
		d: "#8e6a3e",
		m: "#c9a26c",
		l: "#e8cf9a",
		h: "#fff2cf"
	},
	RED: {
		d: "#64101e",
		m: "#b2202e",
		l: "#e64a46",
		h: "#ff9c8c"
	},
	STEEL: {
		d: "#3e4660",
		m: "#7a84a0",
		l: "#b8c0d4",
		h: "#eef1f8"
	},
	WOOD: {
		d: "#44240e",
		m: "#764420",
		l: "#a86e38",
		h: "#d8a462"
	}
}, Z = {
	BLUE: {
		a: "#1e3288",
		b: "#3a6ad8",
		c: "#7cb2f8"
	},
	FIRE: {
		a: "#a8300e",
		b: "#f07a1e",
		c: "#ffd050"
	},
	GOLD: {
		a: "#8a5014",
		b: "#d2962a",
		c: "#f8d668"
	},
	GREEN: {
		a: "#1e6a2e",
		b: "#3aa83e",
		c: "#8ee05a"
	},
	RED: {
		a: "#7a1424",
		b: "#c8303a",
		c: "#f47070"
	},
	STEEL: {
		a: "#4e5670",
		b: "#9aa2ba",
		c: "#dde2ee"
	},
	VIOLET: {
		a: "#4a2286",
		b: "#8a4ad8",
		c: "#c89cff"
	},
	WIND: {
		a: "#3c7ab2",
		b: "#7ec8ee",
		c: "#d6f6ff"
	},
	WOOD: {
		a: "#5a3416",
		b: "#8e5a2c",
		c: "#c08a4e"
	}
}, Q = (e, t) => ({
	o: Wn,
	...e,
	...t,
	w: Gn
}), Kn = {
	a: "#8a2a4a",
	b: "#e06a7e",
	c: "#ffb0b4"
}, qn = Object.freeze({
	OUTLINE: Wn,
	GLINT: Gn,
	MAIN: X,
	ACCENT: Z,
	ACCENT_ROSE: Kn,
	pal: Q
}), $ = {
	sun: {
		palette: Q(X.GOLD, Z.FIRE),
		rows: [
			".......oo.......",
			"......ocbo......",
			"...o..obao..o...",
			"..obo.oooo.obo..",
			"...obohhllobo...",
			"....ohwhllmo....",
			".ooohhllllmmooo.",
			"ocbohllllmmdocbo",
			"obaolllmmmmdobao",
			".ooollmmmmddooo.",
			"....ommmdddo....",
			"...obomdddobo...",
			"..obo.oooo.obo..",
			"...o..ocbo..o...",
			"......obao......",
			".......oo......."
		]
	},
	moon: {
		palette: Q(X.MOON, Z.BLUE),
		rows: [
			"................",
			".....ooo........",
			"....ohldo.......",
			"...ohmdo........",
			"..ohmmdo........",
			"..olmdo.........",
			".ohmmdo.........",
			".olmmmmo........",
			".olmmmdo........",
			".ommmmmmo.......",
			"..olmmmmmooooo..",
			"..ommmmmmlllldo.",
			"...ommmmmmmmdo..",
			"....omddddddo...",
			".....ooooooo....",
			"................"
		]
	},
	heart: {
		palette: Q(X.RED, Z.RED),
		rows: [
			"................",
			"...ooo...ooo....",
			"..olllo.olmmo...",
			".olhhllolmmmdo..",
			"olhwhlllmmmmmdo.",
			"olhhllmmmmmmmdo.",
			"ollllmmmmmmmddo.",
			".olmmmmmmmmddo..",
			"..ommmmmmmddo...",
			"...ommmmmddo....",
			"....ommmddo.....",
			".....omddo......",
			"......odo.......",
			".......o........",
			"................",
			"................"
		]
	},
	cross: {
		palette: Q(X.GREEN, Z.GREEN),
		rows: [
			"................",
			"......oooo......",
			".....ohllmo.....",
			".....olwmdo.....",
			".....olmmdo.....",
			"..oooolmmdoooo..",
			".ohlllmmmmlllmo.",
			".olmmmmmmmmmmdo.",
			".olmmmmmmmmmmdo.",
			".omdddmmmmddddo.",
			"..oooolmmdoooo..",
			".....olmmdo.....",
			".....olmmdo.....",
			".....omdddo.....",
			"......oooo......",
			"................"
		]
	},
	star: {
		palette: Q(X.GOLD, Z.GOLD),
		rows: [
			".......o........",
			"......oho.......",
			".....ohlmo......",
			".....owlmo......",
			".oooohllmmoooo..",
			"ohhhhhllllmmmmo.",
			".olhlllllllmdo..",
			"..olllllllmdo...",
			"...olllllmmo....",
			"...ollllmmmo....",
			"..olllmdmmmdo...",
			"..ollmooommdo...",
			".olmdo...omddo..",
			".omdo.....oddo..",
			"..oo.......oo...",
			"................"
		]
	},
	coin: {
		palette: Q(X.GOLD, Z.GOLD),
		rows: [
			"................",
			".....oooooo.....",
			"....ohhhhlloo...",
			"...ohwllllllmo..",
			"..ohllddddllmmo.",
			".ohlldmmmmdlmdo.",
			".olldmmlmmmhldo.",
			".olldmlhlmmhldo.",
			".olldmmlmmmhldo.",
			".olldmmmmmmhldo.",
			".ollmdmmmmhlmdo.",
			"..olmmhhhhlmdo..",
			"...ommlllmmdo...",
			"....oddddddo....",
			".....oooooo.....",
			"................"
		]
	},
	key: {
		palette: Q(X.GOLD, Z.GOLD),
		rows: [
			"..oooo..........",
			".ohhllo.........",
			"ohllllmo........",
			"ohloolmo........",
			"olmoomdo........",
			"olmmmddo........",
			".ommddmlo.......",
			"..ooooodlo......",
			".......odlo.....",
			"........odlo....",
			".........odlo...",
			"........ommdlo..",
			".......omdoodlo.",
			"........ooommo..",
			".........omdo...",
			"..........oo...."
		]
	},
	scroll: {
		palette: Q(X.PARCH, Z.RED),
		rows: [
			"..oooooooooooo..",
			".ohllllllllllmo.",
			"olmmmmmmmmmmmmdo",
			".oddddddddddddo.",
			"..olmmmmmmmmdo..",
			"..oldddldddldo..",
			"..olmmmmmmmmdo..",
			"..olddddlddldo..",
			"..olmmmmmddddo..",
			"..oldddllbcbmo..",
			"..olmmmmdabamo..",
			".ohmmmmmmlllmmo.",
			"olmmmmmmmmmmmmdo",
			".oddddddddddddo.",
			"..oooooooooooo..",
			"................"
		]
	},
	chest: {
		palette: Q(X.WOOD, Z.GOLD),
		rows: [
			"................",
			"...oooooooooo...",
			"..ohllllllllmo..",
			".ohmmmmmmmmmmmo.",
			"ohmmmmmmmmmmmmmo",
			"omdddddddddddddo",
			"occbbbccccbbbcao",
			"olbhlmcaaahlmblo",
			"omblmdbooblmdbmo",
			"omblmdbboalmdbmo",
			"omblmmmbahmmdbmo",
			"odbmdddmmddddbdo",
			"ocabbbbbbbbbbaao",
			".oooooooooooooo.",
			"................",
			"................"
		]
	},
	gem: {
		palette: Q(X.GEM, Z.WIND),
		rows: [
			"................",
			"................",
			"....oooooooo....",
			"...ohhhhhhhho...",
			"..ohwhhhhhhlmo..",
			".olhhllllllmmdo.",
			"olmmmmmmmmmmdddo",
			".olhhlllmmmmddo.",
			"..olhhllmmmddo..",
			"...olhllmmddo...",
			"....olhlmddo....",
			".....olhddo.....",
			"......oldo......",
			".......oo.......",
			"................",
			"................"
		]
	},
	compass: {
		palette: Q(X.GOLD, Z.RED),
		rows: [
			".......o........",
			".....oocoo......",
			"....oldcldo.....",
			"...omoccaomo....",
			"..omooccaoomo...",
			".oloocccaaoolo..",
			".olhhcccaalldo..",
			"ohhhhhhwllllllo.",
			".olmmllldddddo..",
			".odoolllddoodo..",
			"..omoolldoomo...",
			"...omolldomo....",
			"....oldlddo.....",
			".....ooloo......",
			".......o........",
			"................"
		]
	},
	crown: {
		palette: Q(X.GOLD, Z.RED),
		rows: [
			"................",
			"................",
			".o.....o.....o..",
			"obo...obo...obo.",
			"olo..ohlmo..olo.",
			"olmo.olmdo.ohdo.",
			"olmmohmmmmohmdo.",
			"olmmlmmmmmlmmdo.",
			"oldmmmdddmmmddo.",
			"omblmdcbalmdbmo.",
			"omlmmmlllmmmldo.",
			".omddddddddddo..",
			"..ooooooooooo...",
			"................",
			"................",
			"................"
		]
	},
	flag: {
		palette: Q(X.STEEL, Z.RED),
		rows: [
			"..o.............",
			".olooooo........",
			".omccccbooo.....",
			".omcbbbbccbooo..",
			".omcbbbbbbbccao.",
			".omcbbbbbbaaao..",
			".omcbbbaaaooo...",
			".ombaaaooo......",
			".omoooo.........",
			".omo............",
			".omo............",
			".omo............",
			".omo............",
			".omo............",
			".odo............",
			"..o............."
		]
	},
	cursor: {
		palette: Q(X.GLOVE, Z.GOLD),
		rows: [
			"................",
			"................",
			"....oooo........",
			"...ohllmoooooo..",
			".oohmmmmlllllmo.",
			"ocblmmmmdddddddo",
			"ocalmmmdooooooo.",
			"ocalmmmmmmmdo...",
			"ocalmmmdoooo....",
			"ocalmmmmmmmdo...",
			"ocalmmmdoooo....",
			"obalmmmmlmdo....",
			".oomdddddoo.....",
			"...oooooo.......",
			"................",
			"................"
		]
	},
	arrow: {
		palette: Q(X.GLOVE, Z.GOLD),
		rows: [
			"................",
			"................",
			"................",
			"......o.........",
			".....oho........",
			".....ohlo.......",
			".....ohllo......",
			".....ohllmo.....",
			".....olmmo......",
			".....omdo.......",
			".....odo........",
			"......o.........",
			"................",
			"................",
			"................",
			"................"
		]
	},
	check: {
		palette: Q(X.GREEN, Z.GREEN),
		rows: [
			"................",
			"................",
			"............oo..",
			"...........ohmo.",
			"..........ohmdo.",
			".........ohmdo..",
			".oo.....ohmdo...",
			"ohmo...ohmdo....",
			"ommmo.ohmdo.....",
			".ommmohmdo......",
			"..ommlmdo.......",
			"...ommdo........",
			"....odo.........",
			".....o..........",
			"................",
			"................"
		]
	},
	lock: {
		palette: Q(X.GOLD, Z.STEEL),
		rows: [
			".....oooooo.....",
			"....occcccbo....",
			"...ocbaaaabbo...",
			"...ocaoooocao...",
			"...ocao..ocao...",
			"...ocao..ocao...",
			"..oobaoooobaoo..",
			".ohllllllllllmo.",
			".olwmmmddmmmmdo.",
			".olmmmdoolmmmdo.",
			".olmmmdoolmmmdo.",
			".olmmmmmolmmmdo.",
			".olmmmmdolmmmdo.",
			".omdddddmdddddo.",
			"..oooooooooooo..",
			"................"
		]
	},
	dawn: {
		palette: Q(X.GOLD, Kn),
		rows: [
			".......oo.......",
			"......ocbo......",
			"...o..obao..o...",
			"..obo.oooo.obo..",
			"...obohhllobo...",
			"....ohwhllmo....",
			".ooohhllllmmooo.",
			"ocbohllllmmdocbo",
			"obaolllmmmmdobao",
			".oooooooooooooo.",
			"oaabbccccccbbaao",
			".oooooooooooooo.",
			"....obbccbbo....",
			".....oooooo.....",
			"......obbo......",
			".......oo......."
		]
	},
	dusk: {
		palette: Q(X.FIRE, Z.VIOLET),
		rows: [
			"................",
			"................",
			"................",
			"..o..........o..",
			".obo........obo.",
			"..obo......obo..",
			"...o..oooo..o...",
			".....ohhllo.....",
			"....ohwhllmo....",
			"...ohhllllmmo...",
			"..ohllllmmmmdo..",
			".oooooooooooooo.",
			"oaabbccccccbbaao",
			".oooooooooooooo.",
			"...oabbccbbao...",
			"....oooooooo...."
		]
	}
};
$.golden = {
	rows: $.sun.rows,
	palette: Q(X.FIRE, Z.FIRE)
};
var Jn = Object.freeze({
	night: "moon",
	dawn: "dawn",
	morning: "sun",
	midday: "sun",
	afternoon: "sun",
	golden: "golden",
	dusk: "dusk"
});
function Yn(e, { palette: t = {}, scale: n = 1, mono: r, outline: i } = {}) {
	let a = {
		...e.palette,
		...t
	};
	if (r) {
		a = {};
		for (let t of new Set(e.rows.join(""))) t !== "." && (a[t] = r);
		i && (a.o = i);
	}
	return d([...e.rows], a, n);
}
function Xn(e, t) {
	let n = Object.prototype.hasOwnProperty.call($, e) ? $[e] : null;
	if (!n) throw Error(`icon: no core icon "${e}" (${Object.keys($).join(", ")})`);
	return Yn(n, t);
}
var Zn = () => {
	let e = a();
	return { palette: {
		o: e.ink0,
		d: e.g1,
		m: e.g2,
		l: e.g3,
		h: e.g4,
		a: e.g1,
		b: e.g2,
		c: e.g3,
		w: e.g4
	} };
}, Qn = () => {
	let e = a();
	return { palette: {
		o: e.ink0,
		d: e.ink2,
		m: e.ink3,
		l: e.ink4,
		h: e.ink5,
		a: e.ink3,
		b: e.ink4,
		c: e.ink5,
		w: e.tx3
	} };
};
//#endregion
export { Ee as $, tn as A, Yt as B, Zt as C, v as Ct, en as D, gn as E, sn as F, ke as G, Jt as H, Xt as I, De as J, Oe as K, on as L, un as M, hn as N, vn as O, dn as P, Me as Q, fn as R, ln as S, b as St, _n as T, be as U, Gt as V, xe as W, Be as X, Le as Y, Ne as Z, Ln as _, p as _t, Jn as a, He as at, cn as b, x as bt, Y as c, dt as ct, Vn as d, it as dt, pt as et, Hn as f, st as ft, Fn as g, we as gt, Un as h, lt as ht, qn as i, mt as it, $t as j, an as k, Bn as l, Ue as lt, In as m, ut as mt, Qn as n, G as nt, Xn as o, Re as ot, Mn as p, at as pt, je as q, Zn as r, ft as rt, Yn as s, Te as st, $ as t, ht as tt, Nn as u, Ce as ut, Tn as v, g as vt, pn as w, _ as wt, Qt as x, f as xt, An as y, y as yt, mn as z };
