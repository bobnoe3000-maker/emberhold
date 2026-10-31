import { On as e, W as t, l as n, tt as r, u as i } from "./three.core-CLamN2hY.js";
import { t as a } from "./Palette-D7TB3xJk.js";
import { a as o, c as s, f as c, i as l, l as u, p as d, r as f, u as p } from "./math-Du_SWpiD.js";
import { a as m, n as h } from "./own-rp3p7qEo.js";
import { a as g, c as _, i as v, o as y, r as b, t as x } from "./PixelCanvas-4nLw4bNM.js";
//#region src/engine/pixel/Textures.js
var S = (e, t) => (e % t + t) % t, C = (e, t) => e[t < 0 ? 0 : t >= e.length ? e.length - 1 : t | 0], w = v, T = a.outline;
function E(e, t = .22, n = .16) {
	return [
		_(e[0], -t),
		...e.map(y),
		_(e[e.length - 1], n)
	];
}
var D = (e, t, n) => e.map((e, r) => w(e, C(t, r), n));
function O(e, t, n, r, i) {
	let a = Math.floor(e), o = Math.floor(t), c = e - a, l = t - o, u = S(a, n), d = S(a + 1, n), f = S(o, r), p = S(o + 1, r), m = s(u, f, i), h = s(d, f, i), g = s(u, p, i), _ = s(d, p, i), v = c * c * (3 - 2 * c), y = l * l * (3 - 2 * l);
	return m + (h - m) * v + (g - m) * y + (m - h - g + _) * v * y;
}
function k(e, t, n, r, i, a = 4, o = .5) {
	let s = 1, c = 0, l = 0, u = 1;
	for (let d = 0; d < a; d++) c += s * O(e * u, t * u, n * u, r * u, i + d * 131), l += s, s *= o, u *= 2;
	return c / l;
}
function ee(e) {
	let t = e.length, n = Array(t);
	for (let e = 0; e < t; e++) n[e] = e;
	n.sort((t, n) => e[t] - e[n]);
	let r = new Float32Array(t);
	for (let e = 0; e < t; e++) r[n[e]] = e / (t - 1);
	return e.set(r), e;
}
function A(e, t, n, r, i, { oct: a = 4, gain: o = .5, eq: s = !0 } = {}) {
	let c = new Float32Array(e * t);
	n = Math.max(1, Math.round(n)), r = Math.max(1, Math.round(r));
	for (let s = 0; s < t; s++) for (let l = 0; l < e; l++) c[s * e + l] = k((l + .5) / e * n, (s + .5) / t * r, n, r, i, a, o);
	return s ? ee(c) : c;
}
function j(e, t, n, r, i, { jitter: a = .8, sy: o = 1, round: c = 0, wrap: l = !0 } = {}) {
	let u = e / n, d = t / r, f = n * r, p = new Float32Array(f), m = new Float32Array(f);
	for (let e = 0; e < r; e++) for (let t = 0; t < n; t++) {
		let r = e * n + t;
		p[r] = (t + .5 + (s(t, e, i) - .5) * a) * u, m[r] = (e + .5 + (s(t, e, i + 7) - .5) * a) * d;
	}
	let h = e * t, g = new Int32Array(h), _ = new Float32Array(h), v = new Float32Array(h), y = new Float32Array(h), b = new Float32Array(h), x = /* @__PURE__ */ new Float32Array(25), C = /* @__PURE__ */ new Float32Array(25), w = /* @__PURE__ */ new Int32Array(25);
	for (let i = 0; i < t; i++) for (let a = 0; a < e; a++) {
		let s = a + .5, f = i + .5, h = Math.floor(s / u), T = Math.floor(f / d), E = 0;
		for (let i = -2; i <= 2; i++) for (let a = -2; a <= 2; a++) {
			let s = h + a, c = T + i;
			if (!l && (s < 0 || c < 0 || s >= n || c >= r)) continue;
			let u = S(s, n), d = S(c, r), f = d * n + u;
			x[E] = p[f] + (s - u) / n * e, C[E] = (m[f] + (c - d) / r * t) * o, w[E] = f, E++;
		}
		let D = f * o, O = 0, k = Infinity;
		for (let e = 0; e < E; e++) {
			let t = s - x[e], n = D - C[e], r = t * t + n * n;
			r < k && (k = r, O = e);
		}
		let ee = x[O], A = C[O], j = Infinity, M = Infinity;
		for (let e = 0; e < E; e++) {
			if (e === O) continue;
			let t = x[e] - ee, n = C[e] - A, r = Math.hypot(t, n) || 1e-6, i = -((s - (ee + x[e]) / 2) * t + (D - (A + C[e]) / 2) * n) / r;
			i < j ? (M = j, j = i) : i < M && (M = i);
		}
		let N = i * e + a;
		if (g[N] = w[O], c > 0) {
			let e = c * 2, t = Math.max(e - Math.abs(j - M), 0) / e;
			j = Math.min(j, M) - t * t * e * .25;
		}
		_[N] = j, v[N] = Math.sqrt(k), y[N] = s - ee, b[N] = (D - A) / o;
	}
	return {
		id: g,
		edge: _,
		dist: v,
		ox: y,
		oy: b,
		count: f,
		px: p,
		py: m,
		cols: n,
		rows: r
	};
}
function M(e, t, n, r) {
	let i = [], a = e;
	for (; a > 0;) {
		if (a <= n) {
			a < t && i.length ? i[i.length - 1] += a : i.push(a);
			break;
		}
		let e = r.int(t, Math.min(n, a - t));
		i.push(e), a -= e;
	}
	return i;
}
var N = (e, t, n) => {
	let r = [], i = t;
	for (let t of e) r.push(S(i, n)), i += t;
	return r;
};
function te(e, t, n) {
	let r = Infinity;
	for (let i of e) for (let e of t) {
		let t = Math.abs(i - e);
		r = Math.min(r, t, n - t);
	}
	return r;
}
function P(e, t, n, r, i, { widths: a = null } = {}) {
	let o = [], s = 0, c = null;
	for (let l of t) {
		let t = a ? a.slice() : M(e, n, r, i), u = 0, d = -1;
		for (let r = 0; r < 16; r++) {
			let r = i.int(0, e - 1), a = c ? te(N(t, r, e), c, e) : 99;
			if (a > d && (d = a, u = r), a >= Math.min(n, 6) * .5) break;
		}
		o.push({
			y: s,
			h: l,
			widths: t,
			offset: u
		}), c = N(t, u, e), s += l;
	}
	return o;
}
function F(e, t, n, { gap: r = 1, corner: i = null } = {}) {
	let a = e * t, o = new Int32Array(a).fill(-1), s = new Float32Array(a), c = [];
	for (let a of n) {
		let n = a.offset;
		for (let l of a.widths) {
			let u = {
				x: n,
				y: a.y,
				w: l,
				h: a.h,
				index: c.length
			};
			c.push(u);
			let d = l - r, f = a.h - r, p = i ? i(u) : [
				0,
				0,
				0,
				0
			];
			for (let r = 0; r < f; r++) for (let i = 0; i < d; i++) {
				let c = i + .5, l = r + .5, m = Math.min(c, l, d - c, f - l), h = c < d / 2, g = l < f / 2, _ = p[(g ? 0 : 2) + +!h];
				if (_ > 0) {
					let e = h ? _ : d - _, t = g ? _ : f - _;
					if ((h ? c < e : c > e) && (g ? l < t : l > t)) {
						let n = Math.hypot(c - e, l - t);
						if (n > _) continue;
						m = Math.min(m, _ - n + .5);
					}
				}
				let v = S(a.y + r, t) * e + S(n + i, e);
				o[v] = u.index, s[v] = m;
			}
			n += l;
		}
	}
	return {
		id: o,
		dist: s,
		blocks: c
	};
}
var I = (e, t = .3, n = 1) => e > n ? 2 : e > t ? 1 : e < -n ? -2 : e < -t ? -1 : 0, ne = class {
	constructor(e, t, n = !0) {
		this.w = e, this.h = t, this.wrap = n, this.pc = new x(e, t), this.pc.wrap = n, this.hf = new Float32Array(e * t), this.em = null;
	}
	ix(e, t) {
		if (e = Math.floor(e), t = Math.floor(t), this.wrap) e = S(e, this.w), t = S(t, this.h);
		else if (e < 0 || t < 0 || e >= this.w || t >= this.h) return -1;
		return t * this.w + e;
	}
	H(e, t) {
		let n = this.ix(e, t);
		return n < 0 ? 0 : this.hf[n];
	}
	setH(e, t, n) {
		let r = this.ix(e, t);
		r >= 0 && (this.hf[r] = n);
	}
	set(e, t, n) {
		return this.pc.set(e, t, n), this;
	}
	get(e, t) {
		return this.pc.get(e, t);
	}
	A(e, t) {
		return this.pc.getAlpha(e, t);
	}
	slope(e, t) {
		return (this.H(e + 1, t) - this.H(e - 1, t)) * .9 + (this.H(e, t + 1) - this.H(e, t - 1));
	}
	each(e) {
		for (let t = 0; t < this.h; t++) for (let n = 0; n < this.w; n++) e(n, t, t * this.w + n);
	}
	tint(e, t, n, r) {
		this.pc.set(e, t, w(this.pc.get(e, t), n, r));
	}
	emissive() {
		return this.em || (this.em = new x(this.w, this.h, "#000000"), this.em.wrap = this.wrap), this.em;
	}
};
function L(e, t, n, r, i, { dark: a, light: o = null, idMap: s = null, idv: c = -1, depth: l = .3 }) {
	let u = [
		[1, 0],
		[1, 1],
		[0, 1],
		[-1, 1],
		[-1, 0],
		[-1, -1],
		[0, -1],
		[1, -1]
	], d = i.int(0, 7), f = [];
	for (let a = 0; a < r; a++) {
		let r = e.ix(t, n);
		if (r < 0 || s && s[r] !== c) break;
		f.push([t, n]);
		let a = i.next(), [o, l] = u[S(d + (a < .55 ? 0 : a < .78 ? 1 : -1), 8)];
		t += o, n += l;
	}
	if (o) for (let [t, n] of f) {
		let r = e.ix(t + 1, n + 1);
		r >= 0 && (!s || s[r] === c) && e.set(t + 1, n + 1, o);
	}
	for (let [t, n] of f) e.set(t, n, a), e.setH(t, n, e.H(t, n) - l);
	return f;
}
var re = [
	["X"],
	["XX"],
	["XX", "XX"],
	["XXX", "XX."],
	[
		".XX",
		"XXX",
		".X."
	],
	[
		".XX.",
		"XXXX",
		".XX."
	],
	["XXX", "XXX"]
];
function R(e, t, n, r, i, a, o, { h: s = .8, spec: c = null } = {}) {
	let l = re[r], u = (e, t) => t >= 0 && t < l.length && e >= 0 && e < l[t].length && l[t][e] === "X";
	if (o) for (let r = 0; r <= l.length; r++) for (let i = 0; i <= l[0].length; i++) (!u(i, r) && u(i - 1, r - 1) || !u(i, r) && u(i - 1, r) && r === l.length - 1) && e.set(t + i, n + r, o);
	let d = !0;
	for (let r = 0; r < l.length; r++) for (let o = 0; o < l[r].length; o++) {
		if (!u(o, r)) continue;
		let c = !u(o - 1, r) || !u(o, r - 1), f = !u(o + 1, r) || !u(o, r + 1), p = a;
		c && !f ? p += 1 : f && !c && --p, d && l.length > 1 && (p = a + 1), d = !1, e.set(t + o, n + r, C(i, p)), e.setH(t + o, n + r, s * (c && f ? .8 : 1));
	}
	if (c) {
		let r = l[0].indexOf("X");
		e.set(t + r, n, c);
	}
}
var ie = {
	white: {
		petal: "#f4f1e4",
		shade: "#b9bccb",
		center: "#f2cf52"
	},
	yellow: {
		petal: "#f7dc5a",
		shade: "#c98f24",
		center: "#fff4b0"
	},
	pink: {
		petal: "#f5a9c2",
		shade: "#c9607f",
		center: "#fff0c8"
	},
	blue: {
		petal: "#9bb8f2",
		shade: "#5570bf",
		center: "#eef0ff"
	},
	red: {
		petal: "#e8504a",
		shade: "#8c2330",
		center: "#f7d06a"
	},
	purple: {
		petal: "#b98ad6",
		shade: "#6b3f8c",
		center: "#f5e2a0"
	}
};
function ae(e, t, n, r, i, a) {
	a && e.set(t + 1, n + 1, a), i === 0 ? e.set(t, n, r.petal) : i === 1 ? (a && e.set(t + 2, n + 1, a), e.set(t, n, r.petal), e.set(t + 1, n, r.shade)) : (a && (e.set(t + 1, n + 2, a), e.set(t + 2, n + 1, a)), e.set(t, n - 1, r.petal), e.set(t - 1, n, r.petal), e.set(t + 1, n, r.shade), e.set(t, n + 1, r.shade), e.set(t, n, r.center)), e.setH(t, n, .9);
}
var oe = [
	"#12231d",
	"#1a3327",
	"#264b2f",
	"#386636",
	"#52833d",
	"#7da64c"
];
function se(e) {
	let t = [];
	for (let n = 0; n < e.length; n++) t.push(y(e[n])), n < e.length - 1 && t.push(w(e[n], e[n + 1], .5));
	return t;
}
function z(e, t, n = 0) {
	let r = new Int8Array(e.length);
	for (let i = 0; i < e.length; i++) {
		let a = n;
		for (let n of t) e[i] >= n && a++;
		r[i] = a;
	}
	return r;
}
function B(e, t, n, r, i) {
	let a = e[i * t + r], o = e[S(i - 1, n) * t + r], s = e[i * t + S(r - 1, t)];
	return o > a || s > a ? -1 : +(o < a || s < a);
}
function V(e, t, n = {}) {
	let { w: r, h: i } = e, { rng: o, seed: l } = t, u = se((n.ramp ?? a.grass).map(y)), d = se(D((n.ramp ?? a.grass).map(y), a.grassDry, n.warm ?? .24)), f = A(r, i, r / 16, i / 16, l + 1, {
		oct: 3,
		gain: .45
	}), p = A(r, i, r / 32, i / 32, l + 2, { oct: 2 });
	for (let e = 0; e < f.length; e++) f[e] += (s(e % r, e / r | 0, l + 9) - .5) * .07;
	let m = z(f, n.levels ?? [
		.12,
		.45,
		.8
	], 3), h = new Uint8Array(r * i);
	e.each((t, n, a) => {
		let o = B(m, r, i, t, n), f = s(t, n, l), g = m[a] + (o > 0 ? +(f < .5) : o < 0 && f < .45 ? -1 : 0), _ = c(.7, .78, p[a]);
		h[a] = +(_ > .5);
		let v = C(u, g);
		_ > 0 && (v = w(v, C(d, g), _ > .99 ? 1 : .5)), e.set(t, n, v), e.hf[a] = .1 + m[a] * .05 + o * .03;
	});
	let g = n.cell ?? 6, _ = Math.max(1, Math.round(r / g)), v = Math.max(1, Math.round(i / g)), b = [];
	for (let e = 0; e < v; e++) for (let t = 0; t < _; t++) {
		if (!o.chance(n.density ?? .8)) continue;
		let a = o.next();
		b.push({
			x: Math.floor((t + o.next()) * r / _),
			y: Math.floor((e + o.next()) * i / v),
			n: a < .12 ? 1 : a < .4 ? 2 : a < .82 ? 3 : 4,
			tall: o.chance(.3)
		});
	}
	b.sort((e, t) => e.y - t.y);
	for (let t of b) {
		let n = e.ix(t.x, t.y), r = m[n], i = h[n] ? d : u, a = -Math.floor((t.n - 1) / 2);
		for (let n = a - 1; n <= a + t.n - 1; n++) e.set(t.x + n + 1, t.y + 1, C(i, r - 2));
		e.set(t.x + a + t.n, t.y, C(i, r - 2));
		for (let n = 0; n < t.n; n++) {
			let s = a + n, c = s < 0 ? -1 : s > 0 ? 1 : t.n === 1 || o.chance(.25) ? o.chance(.5) ? 1 : -1 : 0, l = Math.max(2, (s === 0 ? 3 : 2) + +!!t.tall - !!o.chance(.25)), u = r >= 6 ? o.chance(.35) ? r + 3 : r + 2 : r + (o.chance(.5) ? 4 : 3);
			for (let n = 0; n < l; n++) {
				let a = t.x + s + c * Math.floor((n + 1) / 2), o = t.y - n;
				e.set(a, o, C(i, Math.min(10, n === l - 1 ? u : r + 2))), e.setH(a, o, .5 + n * .12);
			}
		}
	}
	for (let t = 0; t < r * i / 40; t++) {
		let t = o.int(0, r - 1), n = o.int(0, i - 1), a = e.ix(t, n);
		if (e.hf[a] > .45) continue;
		let s = h[a] ? d : u;
		e.set(t, n, C(s, m[a] + 2)), e.set(t + 1, n + 1, C(s, m[a] - 2));
	}
	if (n.flowers) {
		let t = [
			"white",
			"yellow",
			"pink",
			"white",
			"yellow",
			"blue"
		];
		for (let a = 0; a < n.flowers; a++) {
			let n = o.int(0, r - 1), s = o.int(0, i - 1), c = ie[t[a % t.length]], l = o.int(3, 6);
			for (let t = 0; t < l; t++) {
				let t = Math.round(n + o.gaussian() * 2.6), r = Math.round(s + o.gaussian() * 2), i = e.ix(t, r);
				ae(e, t, r, c, o.chance(.25) ? 2 : +!!o.chance(.4), C(u, m[i] - 2));
			}
		}
	}
	return { normal: n.normal ?? 1.4 };
}
function ce(e, t, n = {}) {
	let { w: r, h: i } = e, { rng: o, seed: c } = t, l = E(n.ramp ?? a.dirt, .15, .08), u = (n.base ?? 3) + 1, d = z(A(r, i, r / 16, i / 16, c + 1, {
		oct: 3,
		gain: .5
	}), [.3, .86], u - 1), f = D(l, a.dirt.map((e) => _(e, .05)), .5);
	e.each((t, n, a) => {
		let o = B(d, r, i, t, n), l = d[a] + (o < 0 ? -1 : +(o > 0 && s(t, n, c) < .6));
		e.set(t, n, C(f, l)), e.hf[a] = .3 + d[a] * .06 + o * .05;
	});
	let p = j(r, i, Math.round(r / 5), Math.round(i / 5), c + 12, { jitter: .9 });
	e.each((t, n, r) => {
		if (p.dist[r] > 1.6 || s(p.id[r], 1, c) < .35) return;
		let i = d[r], a = p.ox[r] + p.oy[r] < 0;
		e.set(t, n, C(f, i + +!!a)), e.hf[r] = .5, a || e.set(t + 1, n + 1, C(f, i - 1));
	});
	for (let t = 0; t < (n.ruts ?? 0); t++) {
		let t = o.chance(.6), n = o.int(6, 12), a = o.int(0, r - 1), s = o.int(0, i - 1);
		for (let r = 0; r < n; r++) {
			let n = t ? a + r : a, i = t ? s : s + r, c = d[e.ix(n, i)];
			e.set(n, i, C(l, c - 1)), e.setH(n, i, .15), t ? e.set(n, i + 1, C(l, c + 1)) : e.set(n + 1, i, C(l, c + 1)), o.chance(.2) && (t ? s += o.chance(.5) ? 1 : -1 : a += o.chance(.5) ? 1 : -1);
		}
	}
	for (let t = 0; t < (n.cracks ?? 2); t++) L(e, o.int(0, r - 1), o.int(0, i - 1), o.int(3, 6), o, {
		dark: l[u - 2],
		light: l[u + 1],
		depth: .2
	});
	let m = n.pebbles ?? Math.round(r * i / 200);
	for (let t = 0; t < m; t++) {
		let t = o.chance(.4) ? o.int(0, 1) : o.int(2, 6), n = o.chance(.25) ? H : U, a = o.int(0, r - 1), s = o.int(0, i - 1);
		R(e, a, s, t, n, o.int(4, 5), C(l, d[e.ix(a, s)] - 2));
	}
	for (let t = 0; t < (n.sprigs ?? 0); t++) {
		let t = o.int(0, r - 1), n = o.int(0, i - 1);
		e.set(t, n + 1, l[u - 2]), e.set(t + 1, n + 1, l[u - 1]), e.set(t, n, a.grass[3]), e.set(t + 1, n - 1, a.grass[4]), o.chance(.6) && e.set(t - 1, n - 1, a.grass[3]);
	}
	return { normal: 1.6 };
}
function le(e, t) {
	let { w: n, h: r } = e, { rng: i, seed: o } = t, c = E(a.sand, .2, .08), l = A(n, r, 4, 4, o + 1, {
		oct: 3,
		gain: .45
	}), u = A(n, r, 2, 2, o + 5, { oct: 3 }), d = z(l, [.35, .9], 3), f = new Float32Array(n);
	for (let e = 0; e < n; e++) f[e] = k(e / n * 4, .5, 4, 1, o + 9, 3) * 9;
	e.each((t, i, a) => {
		let l = B(d, n, r, t, i), p = d[a] + (l > 0 && s(t, i, o) < .5 ? 1 : l < 0 && s(t, i, o) < .4 ? -1 : 0), m = .35 + d[a] * .05;
		if (u[a] > .3) {
			let e = Math.floor(S(i + Math.round(f[t]), 8));
			e === 0 ? (p += 1, m += .1) : e === 1 && s(t, i, o + 3) < .55 && --p;
		}
		s(t, i, o + 4) < .012 ? p += 2 : s(t, i, o + 5) < .008 && (p -= 2), e.set(t, i, C(c, p)), e.hf[a] = m;
	});
	for (let t = 0; t < 6; t++) R(e, i.int(0, n - 1), i.int(0, r - 1), i.int(0, 4), U, 5, c[2]);
	for (let t = 0; t < 3; t++) {
		let t = i.int(0, n - 1), a = i.int(0, r - 1);
		e.set(t, a, "#f4ece0"), e.set(t + 1, a, "#e8c9b8"), e.set(t + 1, a + 1, c[2]), e.set(t + 2, a + 1, c[2]);
	}
	return { normal: 1.3 };
}
function ue(e, t) {
	let { w: n, h: r } = e, { rng: i, seed: o } = t, c = [
		"#1d130f",
		"#2e1f17",
		"#45301f",
		"#5d4029",
		"#785335",
		"#936843",
		"#ae8255"
	].map(y), l = A(n, r, 4, 4, o + 1, { oct: 2 }), u = new Float32Array(n);
	for (let e = 0; e < n; e++) u[e] = (k(e / n * 3, .5, 3, 1, o + 3, 2) - .5) * 2.4;
	e.each((t, n, r) => {
		let i = S(n + u[t], 8);
		e.hf[r] = .5 + .5 * Math.cos((i - 2) / 8 * Math.PI * 2);
	}), e.each((t, n, r) => {
		let i = S(n + u[t], 8), a;
		a = i < 1 ? 4 : i < 2 ? 5 : i < 3.5 ? 4 : i < 4.5 ? 3 : i < 6 ? 2 : i < 7 ? 1 : 2, l[r] > .85 && a >= 3 && (a += 1);
		let d = s(t, n, o + 6);
		a >= 3 && d < .06 ? a += 1 : d > .95 && --a, e.set(t, n, C(c, a));
	});
	for (let t = 0; t < 26; t++) {
		let t = i.int(0, n - 1), a = i.int(0, r / 8 - 1);
		R(e, t, Math.round(a * 8 + 1 - u[t]), i.int(0, 2), c, 5, c[2], { h: .9 });
	}
	let d = A(n, r, 2, 2, o + 8, { oct: 2 });
	for (let t = 0; t < r / 8; t++) for (let r = i.int(0, 2); r < n; r += i.int(3, 4)) {
		let n = Math.round(t * 8 + 2 - u[r]);
		d[e.ix(r, n)] < .45 || (e.set(r + 1, n + 1, c[1]), e.set(r, n + 1, c[2]), e.set(r, n, a.grass[3]), e.set(r - 1, n - 1, a.grass[4]), e.set(r + 1, n - 1, a.grass[3]), i.chance(.5) && e.set(r, n - 2, a.grass[5]), e.setH(r, n, .9));
	}
	return { normal: 1.8 };
}
var H = E(a.stone, .15, .08), U = E(a.stoneWarm, .15, .08), de = D(U, H, .2), fe = D(H, U, .4);
function pe(e, t, n, { gap: r = .9, bevel: i = 2.6, dome: a = .25, rough: s = .1, fine: l = null, gapColor: u, t1: d = .28, t2: f = 1, maxUp: p = 2, maxDown: m = -2, seed: h = 0 }) {
	let { w: g, h: _ } = e, v = A(g, _, g / 4, _ / 4, h + 77, { oct: 2 }), y = new Int32Array(g * _);
	return e.each((l, u, d) => {
		let f = t.edge[d];
		if (f < r) {
			y[d] = -1, e.hf[d] = 0;
			return;
		}
		y[d] = t.id[d];
		let p = n(t.id[d]), m = Math.max(2, p.r ?? 3);
		e.hf[d] = .25 + .75 * c(r - .3, r + i, f) * (p.bump ?? 1) + a * o(1 - t.dist[d] / (m * 2)) + (v[d] - .5) * s;
	}), e.each((t, r, i) => {
		let a = y[i];
		if (a < 0) {
			let n = +(y[e.ix(t - 1, r)] >= 0 || y[e.ix(t, r - 1)] >= 0);
			e.set(t, r, u(t, r, n));
			return;
		}
		let s = n(a), c = o(I(e.slope(t, r), d, f), m, p);
		l && (c += l(t, r, i, s, v[i])), e.set(t, r, C(s.R, s.base + c));
	}), y;
}
function me(e, t, n = {}) {
	let { w: r, h: i } = e, { rng: o, seed: c } = t, l = j(r, i, n.cols ?? 10, n.rows ?? 10, c + 11, {
		jitter: .72,
		round: 1.2
	}), u = [];
	for (let e = 0; e < l.count; e++) {
		let e = o.chance(.5);
		u.push({
			R: e ? de : fe,
			base: o.pick([
				3,
				4,
				4,
				4,
				5
			]),
			bump: o.range(.85, 1.05),
			r: 3
		});
	}
	let d = A(r, i, 2, 2, c + 21, { oct: 3 }), f = a.dirt, p = pe(e, l, (e) => u[e], {
		seed: c,
		gap: .55,
		bevel: 2.2,
		maxDown: -1,
		fine: (e, t, n, r, i) => i > .93 ? 1 : i < .06 ? -1 : 0,
		gapColor: (t, n, r) => d[e.ix(t, n)] > .72 && !r ? t + n & 1 ? a.moss[2] : a.moss[1] : r ? f[1] : s(t, n, c) < .3 ? f[3] : f[2]
	});
	for (let t = 0; t < l.count; t++) o.chance(.14) && L(e, Math.floor(l.px[t]), Math.floor(l.py[t]), o.int(2, 4), o, {
		dark: C(u[t].R, u[t].base - 2),
		light: C(u[t].R, u[t].base + 1),
		idMap: p,
		idv: t
	});
	return e.each((t, n, r) => {
		p[r] < 0 || d[r] < .8 || (p[e.ix(t + 1, n)] < 0 || p[e.ix(t, n + 1)] < 0 || p[e.ix(t - 1, n)] < 0) && s(t, n, c + 3) < .7 && e.set(t, n, s(t, n, c + 4) < .3 ? a.moss[3] : a.moss[2]);
	}), { normal: 2.4 };
}
function he(e, t) {
	let { w: n, h: r } = e, { rng: i, seed: l } = t, u = F(n, r, P(n, [
		14,
		18,
		15,
		17
	], 13, 24, i), {
		gap: 1,
		corner: () => [
			0,
			1,
			2,
			3
		].map(() => i.chance(.25) ? i.range(1.5, 3) : i.range(.6, 1.2))
	}), d = A(n, r, 8, 8, l + 3, { oct: 2 }), f = u.blocks.map(() => ({
		R: i.chance(.6) ? de : fe,
		base: i.pick([
			4,
			4,
			4,
			5,
			3
		]),
		tilt: i.range(-.08, .08)
	}));
	e.each((t, n, r) => {
		if (u.id[r] < 0) {
			e.hf[r] = 0;
			return;
		}
		let i = u.dist[r];
		e.hf[r] = .3 + .7 * c(0, 1.8, i) + (d[r] - .5) * .1;
	});
	let p = A(n, r, 2, 2, l + 9, { oct: 3 });
	e.each((t, n, i) => {
		let c = u.id[i];
		if (c < 0) {
			let r = u.id[e.ix(t - 1, n)] >= 0 || u.id[e.ix(t, n - 1)] >= 0, o = p[i] > .78;
			e.set(t, n, o ? r ? a.moss[1] : a.moss[2] : r ? H[1] : H[2]);
			return;
		}
		let m = f[c], h = o(I(e.slope(t, n), .3, 1.1), -1, 2);
		d[i] > .94 ? h += 1 : d[i] < .05 && --h;
		let g = u.blocks[c];
		S(n - g.y, r) / g.h > .75 && s(t, n, l) < .25 && --h, e.set(t, n, C(m.R, m.base + h));
	});
	for (let t of u.blocks) {
		if (i.chance(.3)) {
			let n = t.x + i.int(2, t.w - 4), r = t.y + i.int(2, t.h - 4), a = f[t.index];
			L(e, n, r, i.int(4, 8), i, {
				dark: C(a.R, a.base - 2),
				light: C(a.R, a.base + 1),
				idMap: u.id,
				idv: t.index
			});
		}
		if (i.chance(.35)) {
			let n = f[t.index];
			for (let r = 0; r < 3; r++) {
				let r = t.x + i.int(2, t.w - 3), a = t.y + i.int(2, t.h - 3);
				u.id[e.ix(r, a)] === t.index && (e.set(r, a, C(n.R, n.base - 1)), e.set(r + 1, a + 1, C(n.R, n.base + 1)));
			}
		}
	}
	return { normal: 2.2 };
}
function ge(e, t) {
	let { w: n, h: r } = e, { rng: i, seed: o } = t, c = j(n, r, 7, 7, o + 13, {
		jitter: .8,
		round: 1.6
	}), l = [];
	for (let e = 0; e < c.count; e++) l.push({
		R: i.chance(.6) ? H : U,
		base: i.pick([
			2,
			3,
			3,
			4
		]),
		bump: i.range(.9, 1.1),
		r: 4.5
	});
	let u = A(n, r, 3, 3, o + 5), d = j(n, r, 22, 22, o + 6, { jitter: .9 }), f = E(a.moss, .15, .1).concat([y(a.grass[4])]), p = pe(e, c, (e) => l[e], {
		seed: o,
		gap: .6,
		bevel: 3,
		dome: .35,
		gapColor: (e, t, n) => n ? "#15201b" : s(e, t, o) < .5 ? f[1] : f[2]
	});
	e.each((t, n, r) => {
		let i = u[r] + (p[r] < 0 ? .12 : 0) + (e.hf[r] - .6) * .1;
		if (i < .52) return;
		let a = d.edge[r], c = d.ox[r] + d.oy[r] < -.8, l = d.ox[r] + d.oy[r] > 1.2 || a < .5, m = i > .8 ? 3 : 2;
		c && (m += 1), l && --m, !(i < .56 && s(t, n, o + 2) < .5) && (e.set(t, n, C(f, m)), e.hf[r] = Math.max(e.hf[r], .7 + (c ? .15 : 0) - (l ? .15 : 0)));
	});
	for (let t = 0; t < 30; t++) {
		let t = i.int(0, n - 1), a = i.int(0, r - 1);
		u[e.ix(t, a)] < .6 || (e.set(t, a, f[5]), e.set(t + 1, a + 1, f[1]));
	}
	return { normal: 2.2 };
}
function _e(e, t) {
	let { w: n, h: r } = e, { rng: i, seed: a } = t, o = j(n, r, 12, 12, a + 17, {
		jitter: .9,
		round: 1
	}), c = [
		E([
			"#1b1f26",
			"#2a313a",
			"#3d4650",
			"#56626a",
			"#7b8b8c"
		]),
		E([
			"#231c1a",
			"#3a2d27",
			"#554236",
			"#735c48",
			"#91795c"
		]),
		E([
			"#172321",
			"#223532",
			"#314d44",
			"#46685a",
			"#628a72"
		])
	], l = [];
	for (let e = 0; e < o.count; e++) l.push({
		R: c[i.chance(.5) ? 0 : i.chance(.6) ? 1 : 2],
		base: i.pick([
			2,
			3,
			3,
			4
		]),
		bump: i.range(.7, 1.05),
		r: 2.5
	});
	let u = [
		"#0f1419",
		"#172027",
		"#1f2a31"
	], d = pe(e, o, (e) => l[e], {
		seed: a,
		gap: .5,
		bevel: 1.8,
		dome: .3,
		maxDown: -1,
		gapColor: (e, t, n) => u[n ? 0 : s(e, t, a) < .4 ? 2 : 1]
	});
	for (let t = 0; t < o.count; t++) {
		if (!i.chance(.75)) continue;
		let n = Math.floor(o.px[t] - 1.2), r = Math.floor(o.py[t] - 1.2);
		d[e.ix(n, r)] === t && (e.set(n, r, "#cfe9e4"), i.chance(.4) && d[e.ix(n + 1, r)] === t && e.set(n + 1, r, "#8fb8b4"));
	}
	return { normal: 2 };
}
function ve(e, t) {
	let { w: n, h: r } = e, { rng: i, seed: s } = t, l = D(E(a.wood, .15, .1), E(a.woodGray, .15, .1), .22), u = F(n, r, P(n, Array(r / 8).fill(8), 18, 40, i), {
		gap: 1,
		corner: () => [
			.6,
			.6,
			.6,
			.6
		]
	}), d = u.blocks.map(() => ({
		base: i.pick([
			3,
			4,
			4,
			4,
			5
		]),
		gray: i.chance(.25)
	})), f = A(n, r, 2, 16, s + 3, { oct: 3 });
	e.each((t, n, r) => {
		let i = u.id[r];
		e.hf[r] = i < 0 ? 0 : .35 + .65 * c(0, 1.4, u.dist[r]);
	}), e.each((t, n, r) => {
		let i = u.id[r];
		if (i < 0) {
			e.set(t, n, u.id[e.ix(t, n - 1)] >= 0 ? l[0] : l[1]);
			return;
		}
		let s = d[i], c = o(I(e.slope(t, n), .3, 1.1), -1, 1), p = f[r];
		p < .12 ? --c : p > .92 && (c += 1);
		let m = s.gray ? D(l, a.woodGray, .45) : l;
		e.set(t, n, C(m, s.base + c));
	});
	let p = a.metal;
	for (let t of u.blocks) {
		for (let n of [t.x + 1, t.x + t.w - 3]) for (let r of [t.y + 1, t.y + t.h - 3]) e.set(n, r, p[1]), e.set(n + 1, r + 1, l[2]), e.setH(n, r, .9);
		if (i.chance(.3) && t.w > 14) {
			let n = t.x + i.int(5, t.w - 7), r = t.y + i.int(2, 4);
			e.set(n, r, l[1]), e.set(n + 1, r, l[1]), e.set(n - 1, r, l[2]), e.set(n + 2, r, l[2]), e.set(n, r - 1, l[4]), e.set(n + 1, r + 1, l[3]);
		}
	}
	return { normal: 1.4 };
}
var ye = [
	"#141119",
	"#29222c",
	"#433638",
	"#5f4e47",
	"#7d6858",
	"#9d8469",
	"#bea37e",
	"#d9c39c"
].map(y), be = [
	"#121320",
	"#232536",
	"#3a3d4e",
	"#565a66",
	"#747a80",
	"#959b9c",
	"#b6bbb5",
	"#d4d6cc"
].map(y), xe = [
	"#1a1216",
	"#35231f",
	"#573a2a",
	"#7b5437",
	"#9c7045",
	"#bb8e57",
	"#d6ad72",
	"#ecca96"
].map(y);
function Se(e, t) {
	let { w: n, h: r } = e, i = t.seedOf("cliff"), o = new f(i), c = ye, l = [
		c,
		c,
		D(c, be, .32),
		D(c, xe, .45)
	], u = j(n, r, 3, 2, i + 5, {
		jitter: .85,
		sy: 2.8
	}), d = [];
	for (let e = 0; e < u.count; e++) d.push({
		R: o.pick(l),
		base: o.pick([
			4,
			4,
			4,
			3,
			5
		]),
		facet: o.range(.8, 1.2)
	});
	let p = A(n, r, 4, 4, i + 3, { oct: 2 }), m = u.id, h = (t, n) => m[e.ix(t, n)], g = new Uint8Array(n * r);
	e.each((e, t, n) => {
		h(e, t + 1) !== m[n] && (g[n] = 1);
	}), e.each((t, n, r) => {
		g[e.ix(t, n + 1)] === 1 && g[r] === 0 && s(m[r], 3, i) < .3 && h(t, n + 2) !== m[r] && (g[r] = 2);
	}), e.each((t, n, r) => {
		let a = d[m[r]];
		if (g[r]) {
			e.set(t, n, C(a.R, g[r] === 1 ? 1 : 2)), e.hf[r] = .12;
			return;
		}
		let o = a.base, c = .72, l = g[e.ix(t, n - 1)] > 0 && h(t, n - 1) !== m[r], f = !l && g[e.ix(t, n - 2)] > 0 && h(t, n - 2) !== m[r], _ = g[e.ix(t, n + 1)] > 0, v = u.ox[r] * .12 + u.oy[r] * .35 * a.facet;
		v < -.9 ? (o += 1, c = .8) : v > .75 && (--o, c = .64), l ? (o = a.base + 2, c = .95) : f && s(t, n, i + 4) < .6 ? (o = a.base + 1, c = .88) : _ ? (--o, c = .52) : p[r] > .9 ? o += 1 : p[r] < .1 && --o, !l && h(t + 1, n) !== m[r] ? --o : !l && h(t - 1, n) !== m[r] && !_ && (o += 1), e.set(t, n, C(a.R, o)), e.hf[r] = c + (p[r] - .5) * .06;
	});
	let _ = a.moss, v = 0;
	for (let t = 0; t < 40 && v < 2; t++) {
		let t = o.int(0, n - 1), i = o.int(0, r - 1);
		g[e.ix(t, i - 1)] && !g[e.ix(t, i)] && (e.set(t, i, _[3]), e.set(t + 1, i, _[2]), e.set(t - 1, i, _[2]), e.set(t, i + 1, _[1]), v++);
	}
	return { normal: 2.4 };
}
function Ce(e, t) {
	let { w: n, h: r } = e;
	Se(e, t);
	let { rng: i, seed: c } = t, l = a.grass.map(y), u = new Int32Array(n);
	for (let e = 0; e < n; e++) {
		let t = O(e / n * 4, .5, 4, 1, c + 1);
		u[e] = 4 + Math.round((t - .5) * 3.2) + +(s(e, 0, c) < .25), u[e] = o(u[e], 3, 6);
	}
	for (let t = 0; t < n; t++) for (let n = 1; n <= 3; n++) {
		let r = u[t] + n;
		e.tint(t, r, T, n === 1 ? .55 : n === 2 ? .35 : .15), e.setH(t, r, e.H(t, r) * .6);
	}
	for (let t = 0; t < n; t++) for (let n = 0; n <= u[t]; n++) {
		let r;
		r = n === 0 ? s(t, 1, c) < .3 ? 4 : 3 : n === 1 ? s(t, 2, c) < .55 ? 4 : 3 : n === u[t] ? 1 : n === u[t] - 1 ? s(t, n, c) < .5 ? 1 : 2 : s(t, n, c + 5) < .3 ? 3 : 2, e.set(t, n, l[r]), e.setH(t, n, 1 - n * .07);
	}
	for (let t = 0; t < n; t++) if (s(t, 3, c) < .45) {
		let n = 2 + Math.floor(s(t, 4, c) * 2);
		n < u[t] - 1 && (e.set(t, n, l[3]), e.set(t, n + 1, l[2]));
	}
	let d = i.int(4, 6);
	for (let t = 0; t < d; t++) {
		let t = i.int(0, n - 1), r = i.int(1, 3);
		for (let n = 1; n <= r; n++) e.set(t, u[t] + n, n === r ? l[1] : l[2]), e.setH(t, u[t] + n, .8);
		e.tint(t + 1, u[t] + r + 1, T, .3);
	}
	return { normal: 2.2 };
}
function we(e, t) {
	let { w: n, h: r } = e, { rng: i, seed: o } = t, c = E(a.dirt, .12, .08), u = A(n, r, 2, 4, o + 1, { oct: 3 }), d = A(n, r, 5, 5, o + 2, { oct: 2 }), f = new Float32Array(n);
	for (let e = 0; e < n; e++) f[e] = (O(e / n * 2, .5, 2, 1, o + 7) - .5) * 3;
	e.each((t, n, r) => {
		let i = S(n + Math.round(f[t]), 8), a = (l(t, n) - .5) * .14, p = (u[r] - .5) * .6 + .5 + a + (i <= 2 ? .16 : i >= 6 ? -.14 : 0), m = p < .3 ? 2 : p > .72 ? 4 : 3;
		d[r] > .93 ? m += 1 : d[r] < .06 && --m, i === 7 && s(t >> 1, n, o + 3) < .6 ? m = 1 : i === 0 && s(t, n, o + 4) < .5 && (m += 1), e.set(t, n, c[m]), e.hf[r] = .4 + (u[r] - .5) * .25 + (i <= 1 ? .12 : i === 7 ? -.2 : 0);
	});
	let p = i.int(0, n - 1), m = i.int(2, r - 3), h = i.int(3, 4);
	for (let t = 0; t < h; t++) e.set(p, m, a.bark[1]), e.setH(p, m, .55), p += 1, i.chance(.45) && (m += i.chance(.5) ? 1 : -1);
	return R(e, i.int(0, n - 1), i.int(0, r - 1), i.int(0, 1), U, 3, c[2]), { normal: 1.8 };
}
function Te(e, t) {
	let { w: n, h: r } = e, { rng: i, seed: o } = t, c = E(a.stone, .2, .1), l = E(a.stoneWarm, .2, .1), u = D(c, l, .3), d = [
		u,
		u,
		u,
		D(c, l, .62),
		D(c, l, .08)
	], f = j(n, r, 4, 3, o + 5, {
		jitter: .9,
		sy: .6
	}), p = [];
	for (let e = 0; e < f.count; e++) {
		let e = i.range(-.8, .8), t = Math.cos(e), n = Math.sin(e);
		p.push({
			R: i.pick(d),
			base: i.pick([
				4,
				4,
				3,
				4,
				3
			]),
			ax: t,
			ay: n,
			off: i.range(-1.5, 1.5),
			litNeg: -.6 * t - .8 * n < 0
		});
	}
	let m = A(n, r, 8, 8, o + 3, { oct: 2 }), h = f.id, g = (t, n) => h[e.ix(t, n)], _ = (e, t, n) => s(Math.min(e, t), Math.max(e, t), o + n), v = new Uint8Array(n * r);
	e.each((e, t, n) => {
		let r = g(e + 1, t), i = g(e, t + 1);
		r === h[n] ? i !== h[n] && (v[n] = _(h[n], i, 12) < .1 ? 1 : 2) : v[n] = _(h[n], r, 11) < .5 ? 1 : 3;
	}), e.each((t, n, r) => {
		let i = p[h[r]];
		if (v[r] === 1) {
			e.set(t, n, C(i.R, s(t, n, o + 9) < .35 ? 0 : 1)), e.hf[r] = .08;
			return;
		}
		let a = f.ox[r] * i.ax + f.oy[r] * i.ay + i.off, c = a < 0 === i.litNeg, l = i.base + (c ? 1 : -1), u = .66 + (c ? .04 : -.04) - Math.abs(a) * .012, d = v[e.ix(t, n - 1)] === 2 || v[e.ix(t, n - 1)] === 1;
		v[r] === 2 ? (--l, u -= .12) : v[r] === 3 ? u -= .04 : d ? (l += 1, u += .06) : v[e.ix(t - 1, n)] === 1 && (l += 1, u += .04), m[r] > .93 ? l += 1 : m[r] < .07 && --l, e.set(t, n, C(i.R, l)), e.hf[r] = u + (m[r] - .5) * .05;
	});
	for (let t = 0; t < 5; t++) {
		let t = i.int(0, n - 1), a = i.int(0, r - 1);
		v[e.ix(t, a)] || L(e, t, a, i.int(3, 6), i, {
			dark: C(u, 2),
			idMap: h,
			idv: g(t, a),
			depth: .2
		});
	}
	let y = a.moss, b = 0;
	for (let t = 0; t < 80 && b < 5; t++) {
		let t = i.int(0, n - 1), a = i.int(0, r - 1);
		v[e.ix(t, a)] || v[e.ix(t, a - 1)] !== 2 || (e.set(t, a, y[3]), e.set(t + 1, a, y[2]), e.set(t - 1, a, y[2]), b++);
	}
	return { normal: 2.4 };
}
function Ee(e, t) {
	let { w: n, h: r } = e, { rng: i, seed: s } = t, l = F(n, r, P(n, [
		8,
		8,
		8,
		8
	], 8, 15, i), {
		gap: 1,
		corner: () => [
			0,
			1,
			2,
			3
		].map(() => i.range(.8, 2.2))
	}), u = l.blocks.map(() => ({
		R: i.chance(.7) ? H : U,
		base: i.pick([
			2,
			3,
			3,
			3,
			4
		])
	})), d = A(n, r, 8, 8, s + 3, { oct: 2 }), f = A(n, r, 2, 2, s + 4, { oct: 3 });
	e.each((t, n, r) => {
		let i = l.id[r];
		e.hf[r] = i < 0 ? 0 : .3 + .7 * c(0, 2.2, l.dist[r]) + (d[r] - .5) * .2;
	}), e.each((t, n, r) => {
		let i = l.id[r];
		if (i < 0) {
			let i = l.id[e.ix(t, n - 1)] >= 0 || l.id[e.ix(t - 1, n)] >= 0;
			e.set(t, n, f[r] > .8 ? a.moss[+!i] : i ? H[0] : H[1]);
			return;
		}
		let s = u[i], c = o(I(e.slope(t, n), .3, 1.1), -2, 2);
		d[r] > .92 ? c += 1 : d[r] < .07 && --c;
		let p = C(s.R, s.base + c);
		f[r] > .86 && l.dist[r] < 2.5 && (p = w(p, a.moss[2], .6)), e.set(t, n, p);
	});
	for (let t of l.blocks) {
		if (!i.chance(.3)) continue;
		let n = u[t.index];
		L(e, t.x + i.int(1, t.w - 3), t.y + 1, i.int(3, 5), i, {
			dark: C(n.R, n.base - 2),
			light: C(n.R, n.base + 1),
			idMap: l.id,
			idv: t.index
		});
	}
	return { normal: 2.4 };
}
function De(e, t, { base: n = 4, cracks: r = 3, chips: i = 1, stains: o = !0 } = {}) {
	let { w: c, h: l } = e, { rng: u, seed: d } = t, f = E(a.plaster, .1, .04), p = A(c, l, c / 16, l / 16, d + 1, {
		oct: 3,
		gain: .5
	}), m = A(c, l, c / 32, l / 16, d + 3, { oct: 3 }), h = z(p, [.4], n);
	e.each((t, n, r) => {
		let i = B(h, c, l, t, n), a = h[r];
		i > 0 && s(t, n, d) < .5 ? a += 1 : (i < 0 && s(t, n, d + 1) < .7 || s(t, n, d + 2) < .025) && --a;
		let u = C(f, a);
		o && m[r] < .12 && (u = w(u, f[3], .4)), e.set(t, n, u), e.hf[r] = .35 + h[r] * .03 + i * .03;
	});
	for (let t = 0; t < r; t++) L(e, u.int(0, c - 1), u.int(0, l - 1), u.int(3, 6), u, {
		dark: f[3],
		light: null,
		depth: .08
	});
	let g = E(a.brick, .1, .05);
	for (let t = 0; t < i; t++) {
		let n = u.int(0, c - 1), r = u.int(0, l - 1), i = u.int(7, 10), a = u.int(5, 7), o = (e, n) => (e + .5 - i / 2) ** 2 / (i / 2) ** 2 + (n + .5 - a / 2) ** 2 / (a / 2) ** 2 <= 1 + (s(e, n, d + t) - .5) * .45;
		for (let t = -1; t <= a; t++) for (let a = -1; a <= i; a++) {
			let i = n + a, s = r + t;
			if (o(a, t)) {
				let n = Math.floor(t / 3), r = S(t, 3) === 2 || S(a + (n & 1) * 3, 6) === 5, o = S(t, 3) === 0;
				e.set(i, s, r ? f[2] : w(g[o ? 4 : 3], f[3], .35)), e.setH(i, s, r ? .1 : .2);
			} else o(a - 1, t) || o(a, t - 1) ? (e.set(i, s, f[6]), e.setH(i, s, .45)) : (o(a + 1, t) || o(a, t + 1)) && e.set(i, s, f[2]);
		}
	}
}
function Oe(e, t) {
	return De(e, t, {
		base: 4,
		cracks: 5,
		chips: 1
	}), { normal: 1.2 };
}
var ke = [
	"#150f0c",
	"#231915",
	"#35261e",
	"#4a3427",
	"#604433",
	"#7a5840"
].map(y), Ae = E([
	"#1c120d",
	"#2e1d14",
	"#46291a",
	"#5f3a22",
	"#7c5030"
], .1, .1);
function je(e, t, n, { R: r = ke, base: i = 2, height: a = 1 } = {}) {
	let { w: o, h: c } = e, { seed: l } = n, u = (n, r) => {
		let i = e.ix(n, r);
		return i >= 0 && t[i] > 0;
	};
	e.each((n, r, i) => {
		t[i] || (u(n - 1, r - 1) || u(n, r - 1) || u(n - 1, r) ? e.tint(n, r, "#5e4a44", .42) : (u(n - 2, r - 2) || u(n, r - 2)) && e.tint(n, r, "#6e5a50", .18));
	}), e.each((n, r, i) => {
		t[i] && (e.hf[i] = a);
	}), e.each((n, o, c) => {
		if (!t[c]) return;
		let d = i, f = !u(n - 1, o) || !u(n, o - 1), p = !u(n + 1, o) || !u(n, o + 1);
		f && !p && (d += 1), p && !f && --d;
		let m = t[c], h = m === 1 ? o : m === 2 ? n : n + o, g = m === 1 ? n : m === 2 ? o : n - o, _ = s(h, Math.floor(g / 5), l + 9);
		_ < .18 ? --d : _ > .93 && !p && (d += 1), e.set(n, o, C(r, d)), e.hf[c] = a - (p ? .2 : 0) - (_ < .18 ? .1 : 0);
	});
}
function Me(e, t) {
	let { w: n, h: r } = e;
	De(e, t, {
		base: 4,
		cracks: 2,
		chips: 0,
		stains: !0
	});
	let i = new Uint8Array(n * r), a = (t, n, r) => {
		let a = e.ix(t, n);
		a >= 0 && !i[a] && (i[a] = r);
	};
	for (let e = 0; e < r; e++) a(n - 2, e, 2), a(n - 1, e, 2), a(0, e, 2), a(1, e, 2);
	for (let e = 0; e < n; e++) a(e, r - 2, 1), a(e, r - 1, 1), a(e, 0, 1), a(e, 1, 1);
	for (let e = 0; e < n; e++) a(e, 15, 1), a(e, 16, 1), a(e, 17, 1);
	let o = (e, t, n, r) => {
		let i = Math.max(Math.abs(n - e), Math.abs(r - t));
		for (let o = 0; o <= i; o++) {
			let s = Math.round(e + (n - e) * o / i), c = Math.round(t + (r - t) * o / i);
			a(s, c, 3), a(s + 1, c, 3), a(s + 2, c, 3);
		}
	};
	o(2, 11, 9, 2), o(27, 11, 20, 2), o(2, 18, 27, 29), o(27, 18, 2, 29), je(e, i, t);
	for (let [t, n] of [
		[0, 16],
		[31, 16],
		[0, 0],
		[31, 0],
		[15, 0],
		[15, 16]
	]) e.set(t, n, ke[4]);
	return { normal: 2 };
}
function Ne(e, t, { R: n, heights: r, minW: i, maxW: s, nails: l = !0, knots: u = .35, gray: d = 0 }) {
	let { w: f, h: p } = e, { rng: m, seed: h } = t, g = F(f, p, P(f, r, i, s, m), {
		gap: 1,
		corner: () => [
			.5,
			.7,
			.5,
			.7
		]
	}), _ = A(f, p, 2, 12, h + 3, { oct: 3 }), v = g.blocks.map(() => ({
		base: m.pick([
			2,
			3,
			3,
			3,
			4
		]),
		gray: m.chance(d)
	}));
	e.each((t, n, r) => {
		let i = g.id[r];
		e.hf[r] = i < 0 ? 0 : .35 + .65 * c(0, 1.3, g.dist[r]) + (_[r] - .5) * .12;
	});
	let y = D(n, a.woodGray, .5);
	e.each((t, r, i) => {
		let a = g.id[i];
		if (a < 0) {
			e.set(t, r, g.id[e.ix(t, r - 1)] >= 0 ? n[1] : n[2]);
			return;
		}
		let s = v[a], c = o(I(e.slope(t, r), .3, 1.1), -1, 1);
		_[i] < .12 ? --c : _[i] > .93 && (c += 1), e.set(t, r, C(s.gray ? y : n, s.base + 1 + c));
	});
	let b = a.metal;
	for (let t of g.blocks) {
		if (l) for (let r of [t.x + 1, t.x + t.w - 3]) {
			let i = t.y + Math.floor((t.h - 1) / 2) - 1;
			e.set(r, i, b[1]), e.set(r + 1, i + 1, n[1]), e.set(r, i - 1, n[4]);
		}
		if (m.chance(u) && t.w > 12) {
			let r = t.x + m.int(4, t.w - 6), i = t.y + Math.floor((t.h - 1) / 2);
			e.set(r, i, n[1]), e.set(r + 1, i, n[0]), e.set(r - 1, i, n[2]), e.set(r + 2, i, n[2]), e.set(r, i - 1, n[4]), e.set(r + 1, i + 1, n[4]), e.setH(r, i, .2), e.setH(r + 1, i, .2);
		}
	}
}
function Pe(e, t) {
	return Ne(e, t, {
		R: E(a.wood, .12, .08),
		heights: [
			6,
			5,
			5,
			6,
			5,
			5
		],
		minW: 20,
		maxW: 32,
		gray: .15
	}), { normal: 1.3 };
}
function Fe(e, t) {
	return Ne(e, t, {
		R: E([
			"#17110e",
			"#231915",
			"#33241c",
			"#453126",
			"#5b4230",
			"#74563d"
		], .08, .06),
		heights: [
			6,
			5,
			5,
			6,
			5,
			5
		],
		minW: 20,
		maxW: 32,
		gray: .3,
		knots: .45
	}), { normal: 1.3 };
}
function Ie(e, t) {
	let { w: n, h: r } = e, { rng: i, seed: a } = t, o = E([
		"#24160f",
		"#3a2517",
		"#553722",
		"#734c2e",
		"#93663d",
		"#b3844f"
	], .1, .08), c = A(n, r, 2, 8, a + 3, { oct: 3 });
	e.each((t, n, r) => {
		let i = n % 8, a = (i - .5) / 7, o = i === 0 ? 0 : Math.sqrt(Math.max(0, 1 - (2 * a - 1) ** 2));
		e.hf[r] = o * .9 + (c[r] - .5) * .1;
	}), e.each((t, n, r) => {
		let i = n % 8;
		if (i === 0) {
			e.set(t, n, s(t, n, a) < .3 ? "#6b5a48" : o[0]);
			return;
		}
		let l = [
			0,
			4,
			5,
			4,
			3,
			3,
			2,
			1
		][i];
		c[r] < .14 ? --l : c[r] > .92 && i < 5 && (l += 1), e.set(t, n, C(o, l));
	});
	for (let t = 0; t < 5; t++) {
		let t = i.int(0, n - 1), a = i.int(0, r / 8 - 1) * 8 + i.int(3, 5);
		e.set(t, a, o[1]), e.set(t + 1, a, o[1]), e.set(t - 1, a, o[3]), e.set(t + 2, a, o[2]), e.set(t, a - 1, o[5]), e.set(t + 1, a - 1, o[4]), e.set(t, a + 1, o[2]), e.set(t + 1, a + 1, o[2]);
	}
	for (let t = 0; t < 4; t++) {
		let t = i.int(0, n - 1), a = i.int(0, r / 8 - 1) * 8 + i.int(3, 5);
		for (let n = 0; n < i.int(4, 8); n++) e.set(t + n, a, o[1]), e.set(t + n, a + 1, o[3]), e.setH(t + n, a, .3);
	}
	return { normal: 1.5 };
}
function Le(e, t) {
	let { w: n, h: r } = e, { rng: i, seed: l } = t, u = D(E(a.brick, .12, .12), U, .22), d = [];
	for (let e = 0; e < r / 4; e++) d.push({
		y: e * 4,
		h: 4,
		widths: [
			8,
			8,
			8,
			8
		],
		offset: e % 2 * 4 + +(e % 4 == 3)
	});
	let f = F(n, r, d, { gap: 1 }), p = f.blocks.map(() => ({
		base: i.pick([
			3,
			3,
			3,
			4,
			4,
			5
		]),
		burnt: i.chance(.1)
	})), m = A(n, r, 8, 8, l + 3, { oct: 2 });
	e.each((t, n, r) => {
		let i = f.id[r];
		e.hf[r] = i < 0 ? 0 : .4 + .6 * c(0, 1.2, f.dist[r]) + (m[r] - .5) * .15;
	});
	let h = E([
		"#4b3e3a",
		"#6b5c54",
		"#86766a",
		"#a09080"
	]);
	e.each((t, n, r) => {
		let i = f.id[r];
		if (i < 0) {
			let r = f.id[e.ix(t, n - 1)] >= 0 || f.id[e.ix(t - 1, n)] >= 0;
			e.set(t, n, r ? h[1] : h[2 + +(s(t, n, l) < .3)]);
			return;
		}
		let a = p[i], c = o(I(e.slope(t, n), .35, 1.2), -1, 1);
		m[r] > .93 ? c += 1 : m[r] < .06 && --c;
		let d = C(u, a.base + c);
		a.burnt && (d = w(d, "#2a1a22", .35)), e.set(t, n, d);
	});
	for (let t of f.blocks) {
		if (!i.chance(.15)) continue;
		let n = i.chance(.5) ? t.x : t.x + t.w - 2, r = i.chance(.5) ? t.y : t.y + t.h - 2;
		e.set(n, r, h[1]), e.setH(n, r, .1);
	}
	return { normal: 1.6 };
}
function Re(e, t) {
	let { w: n, h: r } = e, { rng: i, seed: a } = t, l = F(n, r, P(n, [
		8,
		8,
		8,
		8
	], 11, 17, i), {
		gap: 1,
		corner: () => [
			.7,
			.9,
			.9,
			1.2
		]
	}), u = E([
		"#3a3230",
		"#5a4e48",
		"#7d7066",
		"#a09282",
		"#c2b5a0",
		"#ded4bf"
	], .12, .06), d = l.blocks.map(() => ({
		base: i.pick([
			2,
			3,
			3,
			3,
			4
		]),
		cool: i.chance(.25)
	})), f = A(n, r, 8, 8, a + 3, { oct: 2 });
	e.each((t, n, r) => {
		let i = l.id[r];
		e.hf[r] = i < 0 ? 0 : .3 + .7 * c(0, 1.8, l.dist[r]) + (f[r] - .5) * .12;
	});
	let p = D(u, H, .45);
	e.each((t, n, r) => {
		let i = l.id[r];
		if (i < 0) {
			e.set(t, n, l.id[e.ix(t, n - 1)] >= 0 || l.id[e.ix(t - 1, n)] >= 0 ? u[1] : u[2]);
			return;
		}
		let a = d[i], s = o(I(e.slope(t, n), .3, 1.1), -1, 2);
		f[r] > .94 ? s += 1 : f[r] < .06 && --s, e.set(t, n, C(a.cool ? p : u, a.base + s + 1));
	});
	for (let t of l.blocks) {
		let n = d[t.index];
		if (i.chance(.2) && L(e, t.x + i.int(2, t.w - 4), t.y + 1, i.int(3, 5), i, {
			dark: C(u, n.base - 1),
			light: C(u, n.base + 3),
			idMap: l.id,
			idv: t.index
		}), i.chance(.5)) {
			let r = t.y + i.int(2, 4);
			for (let i = t.x + 2; i < t.x + t.w - 3; i += 3) l.id[e.ix(i, r)] === t.index && s(i, r, a) < .6 && e.set(i, r, C(u, n.base + 1));
		}
	}
	return { normal: 2.2 };
}
function ze(e, t, n) {
	let { w: r, h: i } = e, { rng: a, seed: o } = t, c = E(n, .15, .06), l = i / 8, u = new Int32Array(r * i).fill(-1), d = [], f = new Float32Array(r * i);
	for (let t = 0; t < l; t++) {
		let n = M(r, 5, 6, a), i = a.int(0, r - 1);
		for (let r of n) {
			let n = {
				base: a.pick([
					3,
					3,
					4,
					4,
					4,
					5
				]),
				lichen: a.chance(.12),
				dark: a.chance(.1),
				w: r
			};
			d.push(n);
			for (let n = 0; n < r; n++) for (let a = 0; a < 8; a++) {
				let o = e.ix(i + n, t * 8 + a);
				u[o] = d.length - 1, f[o] = (n + .5) / r;
			}
			i += r;
		}
	}
	e.each((t, n, r) => {
		let i = n % 8, a = f[r], o = d[u[r]].w, s = Math.sqrt(Math.max(0, 1 - (2 * a - 1) ** 2)), c = i === 7 && (a * o < 1 || a * o > o - 1);
		e.hf[r] = c ? .05 : .15 + .55 * s + i * .04;
	}), e.each((t, n, r) => {
		let i = n % 8, a = d[u[r]], l = f[r], p = a.w, m = Math.floor(l * p), h = m === 0, g = m === p - 1, _ = a.base;
		g ? _ -= 2 : h ? _ += 1 : m === p - 2 && --_, i === 0 ? _ = Math.min(_, a.base - 2) - 1 : i === 1 ? --_ : i === 6 && !g && !h && (_ += 1), i === 7 && (h || g) && (_ = 0), a.dark && --_;
		let v = C(c, _);
		a.lichen && i >= 3 && i <= 5 && m >= 1 && m <= 2 && s(t, n, o) < .6 && (v = w(v, "#4f5a3a", .35)), e.set(t, n, v);
	});
	for (let t = 0; t < 3; t++) {
		let t = a.int(0, r - 1), n = a.int(0, l - 1) * 8 + 8 - 2;
		e.set(t, n, c[1]), e.set(t, n + 1, c[0]);
	}
	return { normal: 2.4 };
}
function Be(e, t) {
	let { w: n, h: r } = e, { seed: i } = t, o = E(a.thatch, .14, .04), c = r / 8, l = A(n, r, 4, 4, i + 1, { oct: 3 }), u = (e, t) => {
		let n = s(e >> 1, t, i + 2) * .6 + s(e, t, i + 12) * .4;
		return n < .25 ? 3 : n < .75 ? 4 : 5;
	};
	e.each((t, n, r) => {
		let a = Math.floor(n / 8), c = n % 8, d = u(t, a);
		s(t, Math.floor((n + s(t, a, i + 3) * 4) / 4), i + 4) < .12 && --d, c === 0 ? d -= 3 : c === 1 ? d -= 2 : c === 2 && --d, l[r] < .18 && --d, e.set(t, n, C(o, d)), e.hf[r] = .2 + c * .08 + (d - 3) * .03;
	});
	for (let t = 0; t < c; t++) {
		let r = t * 8 + 8 - 1;
		for (let a = 0; a < n; a++) {
			let n = s(a, t, i + 5), c = n < .35 ? 2 : +(n < .8), l = u(a, t);
			for (let t = 1; t <= c; t++) e.set(a, r + t, C(o, t === c ? l : l + 1)), e.setH(a, r + t, .85);
			c === 0 && e.set(a, r, C(o, l - 1));
		}
	}
	return { normal: 1.8 };
}
function Ve(e, t) {
	let { w: n, h: r } = e, { rng: i, seed: o } = t, c = E(a.slate, .12, .1), l = F(n, r, P(n, [
		8,
		8,
		8,
		8
	], 6, 9, i), {
		gap: 1,
		corner: () => [
			0,
			0,
			i.range(.5, 2),
			i.range(.5, 2)
		]
	}), u = l.blocks.map(() => ({
		base: i.pick([
			3,
			4,
			4,
			5
		]),
		tint: i.chance(.2)
	}));
	return e.each((t, n, r) => {
		let i = n % 8;
		e.hf[r] = l.id[r] < 0 ? 0 : .2 + i * .1;
	}), e.each((t, n, r) => {
		let i = l.id[r], a = n % 8;
		if (i < 0) {
			e.set(t, n, c[0]);
			return;
		}
		let d = u[i], f = d.base;
		a === 0 ? f -= 2 : a === 1 && --f, a === 6 && (f += 1), l.id[e.ix(t - 1, n)] !== i && (f += 1), l.id[e.ix(t + 1, n)] !== i && --f, s(t, n, o) < .05 && (f += 1);
		let p = C(c, f);
		d.tint && (p = w(p, "#5a6a5a", .25)), e.set(t, n, p);
	}), { normal: 2.2 };
}
function He(e, t) {
	let { w: n, h: r } = e, { seed: i } = t, o = E(a.wood, .12, .08), s = Ae, c = a.metal, l = A(n, r, 2, 8, i + 3, { oct: 3 }), u = (e) => e <= 5 ? 0 : e <= 9 ? 1 : 2;
	e.each((t, n, i) => {
		let a, c = .55;
		if (t <= 1 || t >= 14 || n <= 1) {
			let e = 3;
			(t === 0 || n === 0) && (e = 4), t === 1 && n > 1 && (e = 2), (t === 15 || t === 14 && n > 0) && (e = t === 15 ? 2 : 1), n === 1 && t > 1 && t < 14 && (e = 1), a = C(s, e), c = 1;
		} else if (t === 6 || t === 10) a = o[1], c = .3;
		else {
			let e = u(t), s = t === 2 || t === 7 || t === 11, c = t === 5 || t === 9 || t === 13, d = 3 + +(e === 1);
			s && (d += 1), c && --d, l[i] < .14 ? --d : l[i] > .93 && (d += 1), n === 2 && --d, n === r - 1 && (d -= 2), a = C(o, d);
		}
		e.set(t, n, a), e.hf[i] = c;
	});
	for (let [t, n] of [
		[2, 2],
		[3, 2],
		[2, 3],
		[13, 2],
		[12, 2],
		[13, 3]
	]) e.set(t, n, s[2]), e.setH(t, n, 1);
	for (let t of [7, 24]) {
		for (let n = 1; n <= 10; n++) {
			let r = n === 10;
			e.set(n, t, r ? c[2] : c[3]), e.set(n, t + 1, c[1]), r || e.set(n, t + 2, o[1]), e.setH(n, t, .95), e.setH(n, t + 1, .85);
		}
		e.set(11, t, c[1]), e.set(11, t + 1, c[0]), e.set(9, t - 1, c[2]), e.set(9, t + 2, c[1]);
		for (let n of [3, 8]) e.set(n, t, c[5]);
	}
	e.set(11, 15, c[2]), e.set(12, 15, c[1]), e.set(10, 16, c[4]), e.set(13, 16, c[1]), e.set(10, 17, c[3]), e.set(13, 17, c[0]), e.set(11, 18, c[2]), e.set(12, 18, c[0]), e.set(11, 16, o[1]), e.set(12, 16, o[1]), e.set(11, 17, o[2]), e.set(12, 17, o[1]), e.set(11, 14, c[3]), e.set(12, 14, c[2]);
	for (let [t, n] of [
		[11, 14],
		[12, 14],
		[10, 16],
		[13, 16],
		[10, 17],
		[13, 17],
		[11, 18],
		[12, 18]
	]) e.setH(t, n, 1);
	e.set(12, 21, c[0]), e.set(12, 22, c[0]), e.set(13, 22, o[4]);
	for (let t = 2; t < 14; t++) e.tint(t, r - 2, T, .25);
	return { normal: 2 };
}
function Ue(e, t) {
	let { w: n, h: r } = e, i = E([
		"#1f140e",
		"#34221a",
		"#4f3322",
		"#6b4a30",
		"#8a6440"
	], .1, .1), c = a.water, l = e.emissive(), u = (e, t) => e >= 2 && e <= 13 && t >= 2 && t <= 12, d = (e, t) => e === 7 || e === 8 || t === 7;
	e.each((t, n, r) => {
		if (u(t, n) && !d(t, n)) {
			let i = t <= 6 ? t - 2 : t - 9, a = n <= 6 ? n - 2 : n - 8, u = n <= 6 ? c[2] : c[1];
			a === 0 || i === 0 ? u = c[0] : a === 1 && s(t, n, 3) < .5 && (u = n <= 6 ? c[3] : c[2]);
			let d = i + a;
			(d === 5 || d === 6) && (u = d === 5 ? c[5] : c[4]), d === 5 && i === 3 && (u = c[6]), e.set(t, n, u), e.hf[r] = .2;
			let f = 1 - Math.abs(t + .5 - (t <= 6 ? 5 : 11)) * .06 - Math.abs(n - 9) * .03;
			(t === 2 || t === 13) && a > 0 && (f *= .55), (i === 0 || a === 0) && (f *= .8);
			let p = Math.round(o(f, 0, 1) * 255);
			l.set(t, n, [
				p,
				p,
				p,
				255
			]);
			return;
		}
		let a = 3, f = t <= 1 || t >= 14 || n <= 1 || n >= 13;
		f ? ((t === 0 || n === 0) && (a = 4), (t === 15 || n >= 13 && n === 15) && (a = 1), t === 1 && n >= 1 && n <= 12 && (a = 2), n === 1 && t >= 1 && t <= 14 && (a = 2), t === 14 && n >= 1 && n <= 12 && (a = 3), n === 13 && (a = 5), n === 14 && (a = 3), n === 15 && (a = 1)) : (a = t === 7 || n === 7 && t !== 8 ? 4 : 2, n === 7 && (t === 7 || t === 8) && (a = 3)), e.set(t, n, C(i, a)), e.hf[r] = f ? n >= 13 ? 1 : .9 : .7;
	});
	for (let t = 2; t <= 13; t++) e.tint(t, 12, T, .35);
	return {
		normal: 1.8,
		wrap: !1
	};
}
function We(e, t) {
	let { w: n, h: r } = e, { rng: i, seed: a } = t, o = j(n, r, 4, 6, a + 19, {
		jitter: .7,
		sy: 1.5,
		round: 1.2
	}), c = E([
		"#231f22",
		"#3b3436",
		"#5a5050",
		"#7c6f68",
		"#9d8f82",
		"#bdb09e"
	], .1, .06), l = [];
	for (let e = 0; e < o.count; e++) l.push({
		R: c,
		base: i.pick([
			2,
			3,
			3,
			4
		]),
		bump: i.range(.85, 1.05),
		r: 3
	});
	let u = A(n, r, 2, 2, a + 7, { oct: 3 });
	return pe(e, o, (e) => l[e], {
		seed: a,
		gap: .55,
		bevel: 2.2,
		gapColor: (e, t, n) => n ? "#1a1618" : s(e, t, a) < .4 ? "#4a4240" : "#3a3334"
	}), e.each((t, n, r) => {
		u[r] < .25 && e.tint(t, n, "#1c1a20", .35 * (1 - u[r] / .25));
	}), { normal: 2.3 };
}
function Ge(e, t) {
	let { w: n, h: r } = e, { rng: i, seed: o } = t, l = E(a.bark, .1, .1), u = [];
	for (let e = 0; e < 4; e++) u.push((e + .3 + i.next() * .4) * (n / 4));
	let d = (e, t) => (k(e * 1.7 + .5, t / r * 4, 8, 4, o + 3, 2) - .5) * 3.2, f = [];
	for (let e = 0; e < 2; e++) f.push({
		x: i.int(2, n - 3),
		y: i.int(3, r - 4)
	});
	e.each((t, r, i) => {
		let a = Infinity;
		for (let e = 0; e < 4; e++) {
			let i = t + .5 - (u[e] + d(e, r));
			i = S(i + n / 2, n) - n / 2, Math.abs(i) < Math.abs(a) && (a = i);
		}
		e.hf[i] = c(0, 2.2, Math.abs(a)) * .8 + .1;
	});
	for (let t of f) for (let n = -3; n <= 3; n++) for (let r = -2; r <= 2; r++) {
		let i = r * r / 5 + n * n / 10;
		i <= 1.2 && e.setH(t.x + r, t.y + n, .9 - i * .4);
	}
	e.each((t, n, r) => {
		let i = 2 + I(e.slope(t, n), .25, .8);
		e.hf[r] < .25 ? i = 0 : e.hf[r] < .4 && (i = Math.min(i, 1)), s(t >> 2, n, o + 5) < .06 && e.hf[r] > .5 && --i, e.set(t, n, C(l, i + 1));
	});
	for (let t of f) e.set(t.x, t.y, l[0]), e.set(t.x, t.y + 1, l[0]), e.set(t.x - 1, t.y - 1, l[4]), e.set(t.x, t.y - 2, l[5]), e.set(t.x + 1, t.y + 1, l[2]), e.set(t.x + 1, t.y + 2, l[1]), e.set(t.x - 1, t.y, l[3]);
	let p = a.moss;
	for (let t = 0; t < 6; t++) {
		let a = i.int(0, n - 1), o = i.int(0, r - 1);
		e.set(a, o, t < 3 ? p[2] : "#8c9a7a"), t < 3 && e.set(a, o + 1, p[1]);
	}
	return { normal: 2.4 };
}
function Ke(e, t, n) {
	let { w: r, h: i } = e, { rng: a, seed: c } = t, l = E(n, .12, .05), u = r / 32, d = [
		-.55,
		-.68,
		.48
	], f = Math.hypot(...d), p = d[0] / f, m = d[1] / f, h = d[2] / f, g = [
		[
			.47,
			.3,
			7.2
		],
		[
			.19,
			.5,
			5.2
		],
		[
			.8,
			.47,
			5.6
		],
		[
			.36,
			.77,
			6.2
		],
		[
			.72,
			.8,
			5.3
		]
	].map(([e, t, n]) => {
		let s = n * u * a.range(.9, 1.06), c = s * 1.08 + 1;
		return {
			cx: o(e * r + a.range(-1.5, 1.5), c, r - c - 1),
			cy: o(t * i + a.range(-1.5, 1.5), c, i - c - 1),
			r: s
		};
	}), _ = [];
	g.forEach((e, t) => {
		let n = Math.max(6, Math.round(e.r * 1.15)), r = a.next() * Math.PI * 2;
		for (let i = 0; i < n; i++) {
			let o = r + i / n * Math.PI * 2 + a.range(-.25, .25), s = e.r * a.range(.55, .68);
			_.push({
				ci: t,
				x: e.cx + Math.cos(o) * s,
				y: e.cy + Math.sin(o) * s * .92,
				r: e.r * a.range(.33, .44),
				core: !1
			});
		}
		_.push({
			ci: t,
			x: e.cx - e.r * .08,
			y: e.cy - e.r * .1,
			r: e.r * .66,
			core: !0
		});
	}), _.forEach((e, t) => {
		e.order = g[e.ci].cy * 10 + (e.core ? -2 : e.y - g[e.ci].cy) * .5 + t * .001;
	}), _.sort((e, t) => e.order - t.order);
	let v = new Int16Array(r * i).fill(-1);
	_.forEach((e, t) => {
		for (let n = Math.floor(e.y - e.r - 1); n <= e.y + e.r + 1; n++) for (let a = Math.floor(e.x - e.r - 1); a <= e.x + e.r + 1; a++) a < 0 || n < 0 || a >= r || n >= i || Math.hypot(a + .5 - e.x, n + .5 - e.y) <= e.r + .35 && (v[n * r + a] = t);
	});
	let y = new Float32Array(r * i);
	e.each((t, n, a) => {
		let o = v[a];
		if (o < 0) {
			e.set(t, n, null);
			return;
		}
		let l = _[o], u = g[l.ci], d = (t + .5 - u.cx) / (u.r * 1.05), f = (n + .5 - u.cy) / (u.r * 1.05), b = Math.sqrt(Math.max(.05, 1 - d * d - f * f)), x = d * p + f * m + b * h, S = -((t + .5 - l.x) / l.r + (n + .5 - l.y) / l.r) * .7, C = 2.5 + x * 2.3 + (S > .35 ? 1 : S < -.5 ? -1 : 0);
		l.core && (C -= .6);
		for (let [e, a] of [
			[1, 0],
			[0, 1],
			[-1, 0],
			[0, -1]
		]) {
			let s = t + e, c = n + a;
			if (!(s < 0 || c < 0 || s >= r || c >= i) && v[c * r + s] > o) {
				C -= 1.1;
				break;
			}
		}
		let w = s(t, n, c + 3);
		w < .1 ? C += 1 : w > .93 && --C, y[a] = C, e.hf[a] = .35 + b * .45 + (S > 0 ? .1 : 0);
	});
	let b = (e, t) => e >= 0 && t >= 0 && e < r && t < i && v[t * r + e] >= 0;
	e.each((t, n, r) => {
		if (v[r] < 0) return;
		let i = !b(t - 1, n) || !b(t, n - 1), a = !b(t + 1, n) || !b(t, n + 1), s = y[r];
		i && !a ? s += 1.2 : a && !i && --s, e.set(t, n, l[o(Math.round(s), 1, 7)]);
	});
	for (let t = 0; t < 6; t++) {
		let t = g[a.int(0, g.length - 1)], n = a.range(Math.PI * .9, Math.PI * 2.1), o = Math.round(t.cx + Math.cos(n) * (t.r + 2)), s = Math.round(t.cy + Math.sin(n) * (t.r + 2));
		o < 1 || s < 1 || o >= r - 2 || s >= i - 2 || b(o, s) || b(o + 1, s) || b(o, s + 1) || (e.set(o, s, l[5]), e.set(o + 1, s, l[3]), e.setH(o, s, .7));
	}
	return {
		normal: 1.6,
		alpha: !0
	};
}
function qe(e, t) {
	let { w: n, h: r } = e, { rng: i } = t, a = [
		"#071216",
		"#0e2024",
		"#163338",
		"#1f4c3d",
		"#2f6846",
		"#4b8752",
		"#78a95f",
		"#a9cf80"
	].map(y), s = r / 8, c = new Int8Array(n * r).fill(-1), l = new Float32Array(n * r), u = (t, n, r, i) => {
		let a = e.ix(t, n);
		c[a] = r, l[a] = i;
	};
	for (let e = 0; e < s; e++) for (let t = 0; t < 4; t++) for (let r = 0; r < n; r++) u(r, e * 8 + t, t < 3 ? 1 : 2, .2 + t * .05);
	for (let e = s - 1; e >= 0; e--) {
		let t = e * 8, r = M(n, 8, 11, i), a = i.int(0, n - 1);
		for (let e of r) {
			let n = i.int(10, 11), r = (e - 1) / 2;
			for (let i = 0; i < e; i++) {
				let e = Math.abs(i - r) / (r + .5), s = Math.round(t + 5 + (n - 5) * (1 - e * e * e));
				for (let n = t + 1; n <= s; n++) {
					let c = a + i, l = (n - t) / Math.max(1, s - t), d = i < r, f = l < .2 ? 2 : 3 + Math.round((l - .2) * 2);
					d ? f += 1 : i > r + .5 && --f, S(i * (d ? 1 : -1) + n, 3) === 0 && n < s && --f, n === s && (f = d || e < .2 ? 6 : 4), e < .15 && n > t + 2 && n < s && (f += 1), u(c, n, o(f, 1, 7), .35 + l * .55);
				}
			}
			a += e;
		}
	}
	e.each((t, n, r) => {
		if (c[r] < 0) {
			e.set(t, n, null);
			return;
		}
		e.set(t, n, a[c[r]]), e.hf[r] = l[r];
	});
	for (let t = 0; t < 12; t++) {
		let t = i.int(0, n - 1), o = i.int(0, r - 1);
		c[e.ix(t, o)] >= 5 && e.set(t, o, a[7]);
	}
	return {
		normal: 1.6,
		alpha: !0
	};
}
function Je(e, t) {
	let { w: n, h: r } = e, { rng: i, seed: c } = t, l = E(a.thatch, .12, .05), u = j(n, r, 4, 3, c + 3, {
		jitter: .85,
		sy: .6
	}), d = [];
	for (let e = 0; e < u.count; e++) {
		let e = i.range(-.45, .45);
		d.push({
			c: Math.cos(e),
			s: Math.sin(e),
			off: i.next() * 2,
			base: i.pick([
				3,
				4,
				4,
				4,
				5
			])
		});
	}
	let f = A(n, r, 4, 4, c + 1, { oct: 2 });
	e.each((t, n, r) => {
		let i = d[u.id[r]], a = u.edge[r];
		if (a < .5) {
			e.set(t, n, l[s(t, n, c) < .5 ? 2 : 1]), e.hf[r] = .1;
			return;
		}
		let p = u.ox[r] * i.c - u.oy[r] * i.s + i.off, m = u.ox[r] * i.s + u.oy[r] * i.c, h = Math.floor(p), g = s(u.id[r] * 31 + h, Math.floor((m + 20) / 4), c + 5), _ = i.base + (g < .25 ? -1 : g < .85 ? 0 : 1);
		S(h, 2) === 1 && --_;
		let v = -(u.ox[r] * .4 + u.oy[r]) / 6;
		v > .35 ? _ += 1 : v < -.45 && --_, a < 1.2 && u.ox[r] + u.oy[r] > 0 && --_, f[r] < .1 && --_, e.set(t, n, C(l, _)), e.hf[r] = .3 + o(a / 4, 0, 1) * .5 + (S(h, 2) ? 0 : .08);
	});
	for (let t = 0; t < 14; t++) {
		let t = i.int(0, n - 1), a = i.int(0, r - 1), o = i.range(-.9, .9) + (i.chance(.5) ? Math.PI / 2 : 0), s = i.int(4, 7), c = Math.cos(o), u = Math.sin(o);
		for (let n = 0; n < s; n++) {
			let r = Math.round(t + c * n), i = Math.round(a + u * n);
			e.set(r + 1, i + 1, l[1]);
		}
		for (let n = 0; n < s; n++) {
			let r = Math.round(t + c * n), i = Math.round(a + u * n);
			e.set(r, i, l[n === 0 ? 6 : 5]), e.setH(r, i, .9);
		}
	}
	return { normal: 1.6 };
}
function Ye(e, t, n) {
	let { w: r, h: i } = e, { seed: a } = t, o = new Float32Array(r);
	for (let e = 0; e < r; e++) o[e] = k(e / r * 2, .5, 2, 1, a + 1, 2);
	e.each((t, n, r) => {
		e.hf[r] = o[t] * .9 + (n & 1 ? .02 : 0);
	}), e.each((t, i, c) => {
		let l = (o[S(t + 1, r)] - o[S(t - 1, r)]) * 4, u = l > .3 ? 1 : l < -.3 ? -1 : 0;
		o[t] < .3 && --u;
		let d = +(s(t, i, a + 5) < .06);
		e.set(t, i, n(t, i, u, d));
	});
}
function Xe(e, t) {
	let n = E(a.red, .1, .05);
	return Ye(e, t, (e, t, r, i) => {
		let a = C(n, 4 + r);
		return i ? w(a, C(n, 3 + r), .3) : a;
	}), { normal: 6 };
}
function Ze(e, t) {
	let n = E(a.red, .1, .05), r = E(a.cream, .1, .03);
	return Ye(e, t, (e, t, i, a) => {
		let o = Math.floor(e / 4) % 2 == 0 ? n : r, s = 4 + i;
		e % 4 == 3 && --s;
		let c = C(o, s);
		return a ? w(c, C(o, s - 1), .25) : c;
	}), { normal: 6 };
}
function Qe(e, t) {
	let { w: n, h: r } = e, { seed: i } = t, s = E(a.metal, .1, 0), c = j(n, r, 4, 4, i + 3, { jitter: .9 });
	e.each((t, n, r) => {
		let i = c.dist[r] / 3;
		e.hf[r] = .6 - i * .12, (t === 15 || n === 15) && (e.hf[r] = .2);
	}), e.each((t, n, r) => {
		let i = 2 + o(I(e.slope(t, n), .08, .3), -1, 1);
		(t === 0 || n === 0) && (i = 4), (t === 15 || n === 15) && (i = 1), e.set(t, n, s[i]);
	});
	for (let [t, n] of [
		[2, 2],
		[12, 2],
		[2, 12],
		[12, 12]
	]) {
		e.set(t, n, s[5]), e.set(t + 1, n, s[4]), e.set(t, n + 1, s[3]), e.set(t + 1, n + 1, s[2]), e.set(t + 2, n + 1, s[0]), e.set(t + 1, n + 2, s[0]), e.set(t + 2, n + 2, s[0]);
		for (let [r, i] of [
			[0, 0],
			[1, 0],
			[0, 1],
			[1, 1]
		]) e.setH(t + r, n + i, 1);
		e.tint(t + 1, n + 3, "#7a3f22", .5);
	}
	return { normal: 2 };
}
function $e(e, t) {
	let { w: n, h: r } = e, { seed: i } = t, o = E(a.wood, .12, .08), c = a.metal;
	e.each((t, n, r) => {
		let a = t % 4, c = [
			5,
			4,
			4,
			2
		][a], l = s(t, n >> 2, i);
		l < .12 ? --c : l > .94 && (c += 1), a === 3 && s(t, 0, i + 1) < .5 && (c = 1), e.set(t, n, C(o, c)), e.hf[r] = [
			.7,
			.8,
			.75,
			.4
		][a];
	});
	for (let t of [2, 12]) for (let r = 0; r < n; r++) e.set(r, t, c[3]), e.set(r, t + 1, c[1]), e.tint(r, t + 2, T, .45), e.setH(r, t, 1), e.setH(r, t + 1, .9), r % 4 == 1 && e.set(r, t + 1, c[4]);
	return { normal: 1.8 };
}
function et(e, t) {
	let { w: n, h: r } = e, { seed: i } = t, o = E([
		"#2a1a10",
		"#4a2f1c",
		"#6e4a2c",
		"#91683f",
		"#b58a55",
		"#d4ac72"
	], .1, .05);
	e.each((t, n, r) => {
		let a = t <= 1 || t >= 14 || n <= 1 || n >= 14, c, l;
		if (a) c = 4, (t === 0 || n === 0) && (c = 5), (t === 15 || n === 15) && (c = 2), (t === 1 && n >= 1 && n <= 14 || n === 1 && t >= 1 && t <= 14) && (c = 3), (t === 14 && n >= 1 || n === 14 && t >= 1) && (c = 3), l = 1;
		else {
			let e = (n - 2) % 4;
			c = e === 0 ? 1 : e === 1 ? 4 : 3, s(t >> 1, n, i) < .1 && --c, l = e === 0 ? .2 : .55, (t === 2 || n === 2) && (c = Math.min(c, 2));
		}
		e.set(t, n, C(o, c)), e.hf[r] = l;
	});
	for (let t = 2; t <= 13; t++) {
		let n = t, r = 15 - t;
		e.set(n, r, o[5]), e.set(n + 1, r, o[4]), e.set(n + 1, r + 1, o[1]), e.setH(n, r, .9), e.setH(n + 1, r, .9);
	}
	let c = a.metal;
	for (let [t, n] of [
		[1, 1],
		[14, 1],
		[1, 14],
		[14, 14]
	]) e.set(t, n, c[3]);
	return { normal: 2 };
}
function tt(e, t) {
	let { w: n, h: r } = e, { seed: i } = t, o = E([
		"#2a1a10",
		"#46301f",
		"#664630",
		"#87603f",
		"#a87c52",
		"#c89c6c"
	], .1, .05), c = a.metal;
	e.pc.clear();
	let l = [2, 10];
	for (let t of l) for (let n = 2; n < r; n++) for (let r = 0; r < 3; r++) {
		if (n === 2 && r !== 1) continue;
		let a = [
			5,
			4,
			2
		][r];
		n === 2 && (a = 5), n === 3 && r === 0 && (a = 5), s(t + r, n >> 1, i + 5) < .12 && --a, e.set(t + r, n, o[a]), e.setH(t + r, n, [
			.7,
			.8,
			.6
		][r]);
	}
	for (let t of [5, 10]) {
		for (let r = 0; r < n; r++) e.set(r, t, o[5]), e.set(r, t + 1, o[3]), e.setH(r, t, 1), e.setH(r, t + 1, .9), s(r, t, i + 9) < .15 && e.set(r, t + 1, o[2]), e.A(r, t + 2) && e.set(r, t + 2, o[1]);
		for (let n of l) e.set(n + 1, t, c[2]), e.set(n + 1, t + 1, c[1]);
	}
	return {
		normal: 1.6,
		alpha: !0
	};
}
function nt(e, t) {
	let { seed: n } = t, r = E([
		"#3a2a15",
		"#6b5530",
		"#9a8050",
		"#c4a870",
		"#e6d29a"
	], .1, .05);
	return e.each((t, i, a) => {
		let o = S(t + i, 4), c = [
			4,
			3,
			3,
			1
		][o];
		s(t, i, n) < .12 && (c += o === 3 ? 0 : -1), e.set(t, i, r[c + 1]), e.hf[a] = [
			.9,
			.75,
			.55,
			.15
		][o];
	}), { normal: 2 };
}
function rt(e, t) {
	let { w: n, h: r } = e, { rng: i, seed: s } = t, l = F(n, r, P(n, [
		8,
		8,
		8,
		8
	], 7, 11, i), {
		gap: 1,
		corner: () => [
			0,
			1,
			2,
			3
		].map(() => i.range(2.2, 3.2))
	}), u = l.blocks.map(() => ({
		R: i.chance(.65) ? H : U,
		base: i.pick([
			2,
			3,
			3,
			4
		])
	})), d = A(n, r, 2, 2, s + 4, { oct: 3 }), f = A(n, r, 8, 8, s + 3, { oct: 2 });
	return e.each((t, n, r) => {
		let i = l.id[r];
		e.hf[r] = i < 0 ? 0 : .25 + .75 * c(0, 3, l.dist[r]) + (f[r] - .5) * .12;
	}), e.each((t, n, r) => {
		let i = l.id[r];
		if (i < 0) {
			e.set(t, n, l.id[e.ix(t, n - 1)] >= 0 ? "#16171e" : "#2a2c36");
			return;
		}
		let s = u[i], c = o(I(e.slope(t, n), .25, .9), -2, 2);
		f[r] > .93 && (c += 1);
		let p = C(s.R, s.base + c);
		d[r] > .74 && c >= 0 && l.dist[r] < 3 && S(n, 8) < 4 ? p = w(p, c > 0 ? a.moss[3] : a.moss[2], .55) : d[r] < .12 && (p = w(p, "#1c2230", .3)), e.set(t, n, p);
	}), { normal: 2.4 };
}
function it(e, t) {
	let { w: n, h: r } = e, i = E([
		"#0c0b10",
		"#1b1a22",
		"#2e2d38",
		"#4b4a58",
		"#6e6d7c"
	], .05, .1), a = [
		y("#7a3f12"),
		y("#b3621c"),
		y("#e08a2a"),
		y("#f5b041"),
		y("#ffd86e"),
		y("#fff2c2")
	], s = e.emissive();
	e.each((t, n, r) => {
		if (t <= 1 || t >= 14 || n <= 1 || n >= 14 || t === 7 || t === 8) {
			let a = 2;
			(t === 0 || n === 0) && (a = 3), (t === 15 || n === 15) && (a = 1), t === 7 && (a = 3), t === 8 && (a = 1), (t === 1 && n > 0 && n < 15 || n === 1 && t > 0 && t < 15) && (a = 1), e.set(t, n, i[a]), e.hf[r] = 1;
			return;
		}
		let c = Math.hypot((t + .5 - 8) / 5.5, (n + .5 - 9.5) / 6.5), l = c < .35 ? 5 : c < .6 ? 4 : c < .85 ? 3 : c < 1.05 ? 2 : 1;
		n <= 3 && (l = Math.min(l, 2)), (t === 2 || t === 9) && n > 2 && (l = Math.min(5, l + 1)), e.set(t, n, a[l]), e.hf[r] = .3;
		let u = Math.round(o(1.05 - c * .45, .45, 1) * 255);
		s.set(t, n, [
			u,
			u,
			u,
			255
		]);
	});
	for (let [t, n] of [
		[2, 2],
		[13, 2],
		[2, 13],
		[13, 13]
	]) e.set(t, n, i[2]), s.set(t, n, "#000000");
	return { normal: 1.5 };
}
function at(e, t) {
	let { w: n, h: r } = e, { seed: i } = t, o = E([
		"#2a1a10",
		"#4a2f1c",
		"#6e4a2c",
		"#91683f",
		"#b58a55",
		"#d4ac72"
	], .1, .05), c = A(n, r, 2, 4, i + 2, { oct: 3 });
	e.each((t, i, a) => {
		let s = t === 0 || t === n - 1 || i === 0 || i === r - 1, l;
		if (s) l = t === 0 || i === 0 ? 3 : 1, e.hf[a] = .7;
		else {
			let t = i <= 7 ? i - 1 : i - 8;
			l = t === 0 ? 4 : t === 6 ? 2 : 3, i === 7 && (l = 1), c[a] < .12 ? --l : c[a] > .93 && (l += 1), e.hf[a] = i === 7 ? .2 : .6;
		}
		e.set(t, i, C(o, l + 1));
	});
	let l = [
		"101111101",
		"111100111",
		"110101110",
		"111010010",
		"101101111",
		"010101101",
		"111101101",
		"100111101"
	], u = 5;
	for (let t = 0; t < 7; t++) {
		if (t === 3) {
			u += 3;
			continue;
		}
		let n = l[Math.floor(s(t, 1, i) * l.length)];
		for (let t = 0; t < 3; t++) for (let r = 0; r < 3; r++) if (n[t * 3 + r] === "1") for (let n = 0; n < 2; n++) {
			let i = u + r, a = 5 + t * 2 + n;
			a > 12 || (e.set(i, a, o[1]), e.setH(i, a, .2), e.H(i + 1, a + 1) > .3 && a + 1 !== 7 && e.set(i + 1, a + 1, o[5]));
		}
		u += 4;
	}
	let d = a.metal;
	for (let [t, i] of [
		[2, 2],
		[n - 3, 2],
		[2, r - 3],
		[n - 3, r - 3]
	]) e.set(t, i, d[3]), e.set(t + 1, i + 1, o[1]);
	return { normal: 1.8 };
}
function ot(e, t) {
	let { w: n, h: r } = e, { rng: i, seed: c } = t, l = E([
		"#2a1a10",
		"#46301f",
		"#664630",
		"#87603f",
		"#a87c52",
		"#c89c6c"
	], .1, .05), u = E(a.leaves, .1, .05);
	e.pc.clear();
	let d = new Int32Array(n);
	for (let e = 0; e < n; e++) d[e] = 5 + Math.round(O(e / n * 4, .3, 4, 1, c) * 3) - +(s(e, 0, c) < .3);
	for (let t = 0; t < n; t++) for (let n = d[t]; n <= 9; n++) {
		let r = (s(t >> 1, n >> 1, c + 1) - .5) * 2, i = 3 + (n - d[t] <= 1 ? 2 : 0) + Math.round(r) - (n >= 8 ? 2 : 0);
		t % 3 == 0 && n > d[t] && --i, e.set(t, n, u[o(i, 1, 6)]), e.setH(t, n, .6);
	}
	let f = [
		"red",
		"yellow",
		"white",
		"pink",
		"purple",
		"red",
		"yellow"
	], p = i.int(0, 2), m = 0;
	for (; p < n;) {
		let t = ie[f[m % f.length]], r = d[S(p, n)] - i.int(0, 1);
		e.set(p, r + 2, u[2]), e.set(p, r - 1, t.petal), e.set(p - 1, r, t.petal), e.set(p + 1, r, t.shade), e.set(p, r + 1, t.shade), e.set(p, r, t.center), e.setH(p, r, .9), p += i.int(3, 4), m++;
	}
	for (let t = 9; t < r; t++) for (let r = 0; r < n; r++) {
		let n;
		n = t === 9 ? 5 : t === 10 ? 3 : t === 13 || t === 15 ? 1 : s(r >> 2, t, c) < .2 ? 2 : 3, t > 9 && (r === 0 || r === 7 || r === 8 || r === 15) && t !== 13 && (n = r === 0 || r === 8 ? 4 : 2), e.set(r, t, l[n]), e.setH(r, t, t === 9 ? 1 : .7);
	}
	let h = a.metal;
	for (let t of [
		1,
		6,
		9,
		14
	]) e.set(t, 11, h[2]);
	return {
		normal: 1.6,
		alpha: !0
	};
}
var st = E([
	"#3a2316",
	"#5a3822",
	"#7a4f2e",
	"#9a6a3c",
	"#b8854c",
	"#d2a265"
], .1, .05), ct = [
	"#0e0a09",
	"#18110e",
	"#221812"
].map(y);
function lt(e, t) {
	let { w: n, h: r } = e, { rng: i, seed: a } = t, o = A(n, r, 2, 16, a + 3, { oct: 3 }), s = Array.from({ length: r / 8 }, () => ({
		base: i.pick([
			3,
			3,
			4,
			4,
			5
		]),
		joint: i.chance(.7) ? i.int(0, n - 1) : -1
	}));
	return e.each((t, n, r) => {
		let i = n % 8, a = s[n / 8 | 0], c = i === 7, l = t === a.joint && !c;
		e.hf[r] = c || l ? .15 : .55 + (i === 0 ? .15 : 0) + (o[r] - .5) * .1;
		let u = a.base;
		o[r] < .14 ? --u : o[r] > .9 && (u += 1), i === 0 && (u += 1), i === 6 && --u, c && (u = 1), l && (u = 2), e.set(t, n, C(st, u));
	}), { normal: 1.1 };
}
var ut = [
	a.red,
	a.blue,
	a.green,
	a.brown,
	a.purple,
	a.cream,
	[
		"#3a2410",
		"#6b4515",
		"#a5701f",
		"#c98a2e",
		"#e0a94a"
	]
].map((e) => E(e, .1, .05));
function dt(e, t) {
	let { w: n, h: r } = e, { rng: i } = t, o = E(a.gold, .1, .05);
	e.each((t, n, r) => {
		e.set(t, n, ct[n <= 1 ? 0 : 1]), e.hf[r] = .05;
	});
	let s = (t, n, i, a, s) => {
		for (let c = 0; c < n; c++) for (let l = i; l < r; l++) {
			let u = c === 0 ? 4 : c === n - 1 && n > 1 ? 2 : 3;
			l === i && (u += 1);
			let d = C(a, u);
			s && (l === i + 1 || l === r - 2) && r - i >= 5 && (d = C(o, c === 0 ? 5 : 3)), e.set(t + c, l, d), e.setH(t + c, l, c === 0 ? .9 : c === n - 1 ? .55 : .8);
		}
	}, c = 0;
	for (; c < n;) {
		if (c > 0 && c < n - 2 && i.chance(.08)) {
			c += 1;
			continue;
		}
		if (c <= n - 6 && i.chance(.1)) {
			let t = i.int(5, 6), n = i.int(1, 3);
			for (let a = 0; a < n; a++) {
				let n = i.pick(ut), o = r - 2 * (a + 1), s = a === 0 ? 0 : i.int(0, 1);
				for (let r = s; r < t - (a ? i.int(0, 1) : 0); r++) e.set(c + r, o, C(n, 5)), e.set(c + r, o + 1, C(n, r === s ? 3 : 2)), e.setH(c + r, o, .8), e.setH(c + r, o + 1, .7);
			}
			c += t;
			continue;
		}
		let t = Math.min(i.pick([
			2,
			2,
			3,
			3,
			3,
			4
		]), n - c);
		s(c, t, r - i.int(4, 7), i.pick(ut), i.chance(.5)), c += t;
	}
	return { normal: 1.6 };
}
function ft(e, t) {
	let { w: n, h: r } = e, { rng: i } = t;
	e.each((t, n, r) => {
		e.set(t, n, ct[n <= 1 ? 0 : 1]), e.hf[r] = .05;
	});
	let o = (e) => y(e), s = [
		[
			"#1d3a1c",
			"#2f5a28",
			"#4f7f34",
			"#7aa64a"
		],
		[
			"#3a0c14",
			"#6e1522",
			"#a8283a",
			"#d65a5a"
		],
		[
			"#5a3008",
			"#9a5a10",
			"#d6921e",
			"#f2c45a"
		],
		[
			"#3a2a3a",
			"#5a3a5e",
			"#80507e",
			"#a878a6"
		]
	].map((e) => e.map(o)), c = a.metal, l = E(a.red, .1, .05), u = E(a.cream, .1, .03), d = (t, n, r, i = .8) => {
		e.set(t, n, r), e.setH(t, n, i);
	}, f = (e, t, n) => {
		let a = i.pick(s), f = r - n;
		for (let n = 0; n < t; n++) for (let i = f + 1; i < r; i++) d(e + n, i, a[n === 0 ? 3 : n === t - 1 ? 0 : i === f + 1 ? 1 : 2], n === 0 ? .9 : .7);
		d(e, f + 1, o("#e8f4f0"));
		let p = i.chance(.5);
		for (let n = -1; n <= t; n++) !p && (n < 0 || n >= t) || d(e + n, f, p ? n & 1 ? C(l, 4) : C(u, 5) : c[n === 0 ? 4 : 3], 1);
	}, p = (e, t) => {
		let n = i.pick([[
			"#0c1e14",
			"#16361f",
			"#2a5a30"
		], [
			"#1e1006",
			"#3a2210",
			"#5e3a18"
		]].map((e) => e.map(o))), a = r - t;
		for (let t = a; t < r; t++) {
			let r = t < a + 2;
			d(e, t, r && t === a ? o("#c9a46a") : n[2]), r || d(e + 1, t, n[+(t === a + 2)], .6);
		}
		d(e, a + 3, o("#9fd6b0"));
	}, m = (e) => {
		let t = r - 5, n = [
			"#3a2a20",
			"#5e4636",
			"#86684e",
			"#ab8c6a"
		].map(o);
		for (let i = 0; i < 4; i++) for (let a = t; a < r; a++) {
			let r = n[i === 0 ? 3 : i === 3 ? 0 : 2];
			a === t + 2 && (r = o(i === 0 ? "#5a7aa6" : "#3d5a86")), (a !== t || i !== 0 && i !== 3) && d(e + i, a, r);
		}
	}, h = (e) => {
		let t = [
			"#4a3a26",
			"#6e5838",
			"#94784e",
			"#b89c6a",
			"#d6bf8e"
		].map(o), n = r - 6;
		for (let i = 0; i < 5; i++) for (let a = n; a < r; a++) {
			if (a <= n + 1 && (i === 0 || i === 4) || a === n && i !== 2) continue;
			let r = i === 0 ? 4 : i === 4 ? 1 : 3;
			a === n + 2 && (r = 1), i + a & 1 && r > 1 && --r, d(e + i, a, t[r]);
		}
	}, g = (e) => {
		let t = E(a.yellow, .1, .05);
		for (let n = 0; n < 5; n++) for (let i = r - 3; i < r; i++) d(e + n, i, i === r - 3 ? C(t, 6) : n === 0 ? C(t, 5) : n === 4 ? C(t, 3) : C(t, 4));
		d(e + 1, r - 2, C(t, 2));
	}, _ = 0;
	for (; _ < n;) {
		let e = i.pick([
			"jar",
			"jar",
			"jar",
			"bottle",
			"bottle",
			"crock",
			"sack",
			"cheese"
		]), t = {
			jar: 5,
			bottle: 3,
			crock: 5,
			sack: 6,
			cheese: 6
		}[e];
		if (_ + t > n) {
			_ + 3 <= n && p(_);
			break;
		}
		if (e === "jar") {
			let e = i.int(3, 4);
			f(_ + 1, e, i.int(5, 6)), _ += e + 2;
		} else e === "bottle" ? (p(_, i.int(6, 7)), _ += 3) : e === "crock" ? (m(_), _ += 5) : e === "sack" ? (h(_), _ += 6) : (g(_), _ += 6);
	}
	return { normal: 1.5 };
}
function pt(e, t) {
	let { w: n, h: r } = e, { seed: i } = t, a = [
		"#776d62",
		"#a39888",
		"#c7bcab",
		"#e0d8c8",
		"#efe9dc",
		"#faf6ee"
	].map(y), c = A(n, r, 2, 2, i + 1, { oct: 2 });
	return e.each((t, n, r) => {
		e.hf[r] = c[r] * .5 + (t + n & 1 ? .025 : 0);
	}), e.each((t, n) => {
		let r = 4 + o(I(e.slope(t, n), .1, .35), -1, 1);
		s(t, n, i) < .05 && --r, e.set(t, n, C(a, r));
	}), { normal: 1.2 };
}
function W(e, t, n) {
	let { w: r, h: i } = e, { rng: c, seed: l } = t, u = E(n, .1, .05), d = E(a.cream, .1, .03), f = r / 8, p = Array.from({ length: f * f }, () => c.pick([
		"main",
		"main",
		"light",
		"check",
		"accent",
		"diamond"
	]));
	return e.each((t, n, r) => {
		let i = Math.max(Math.abs(t % 8 - 3.5), Math.abs(n % 8 - 3.5)) / 4;
		e.hf[r] = .75 - i * i * .5 + (s(t, n, l) - .5) * .04;
	}), e.each((t, n) => {
		let r = t % 8, i = n % 8, a = p[(n >> 3) * f + (t >> 3)], s = o(I(e.slope(t, n), .12, .4), -1, 1), c = u, l = 4;
		a === "light" ? l = 5 : (a === "accent" || a === "check" && (r >> 1) + (i >> 1) & 1 || a === "diamond" && Math.abs(r - 3.5) + Math.abs(i - 3.5) < 3) && (c = d), (r === 7 || i === 7) && (c = u, l = 2, s = 0, (t + n) % 3 == 0 && (c = d, l = 3)), e.set(t, n, C(c, l + s));
	}), { normal: 1.6 };
}
function mt(e, t, n) {
	let { w: r, h: i } = e, { seed: o } = t, c = E(n, .1, .04), l = E(a.cream, .1, .03), u = E(a.gold, .1, .05);
	return e.each((t, n, r) => {
		let i = t % 16, a = n % 16, d = Math.abs(i - 7.5) + Math.abs(a - 7.5), f = t + n & 1;
		e.hf[r] = .5 + f * .05 + (d < 7.5 ? .08 : 0);
		let p;
		p = d >= 6 && d < 7.5 ? C(u, f ? 4 : 3) : d < 1.5 ? C(l, 5) : d < 3.5 ? C(c, 2 + f) : d < 6 ? C(c, 5 - f) : d > 13.5 ? C(l, 4) : C(c, 3 + (s(t >> 1, n, o) < .15 ? -1 : f)), e.set(t, n, p);
	}), { normal: 1 };
}
function ht(e, t) {
	let n = E(a.gold, .1, .05), r = E(a.cream, .1, .03), i = ["#2a160f", "#3b2216"].map(y);
	return e.each((t, a, o) => {
		let s = t + a & 1, c;
		c = a === 0 || a >= 5 ? i[s] : a === 1 || a === 4 ? C(n, 3 + s) : a === 2 && t % 4 == 1 || a === 3 && t % 4 == 3 ? y("#8c2330") : C(r, 4 + s), e.set(t, a, c), e.hf[o] = a === 0 || a >= 5 ? .35 : .55 + s * .05;
	}), { normal: 1 };
}
function gt(e, t) {
	let { w: n, h: r } = e, { rng: i, seed: s } = t, c = j(n, r, 4, 4, s + 7, {
		jitter: .85,
		round: .8
	}), l = [
		"#0d0a0b",
		"#1a1314",
		"#29201f",
		"#3c302c",
		"#574740"
	].map(y), u = a.fire.map(y), d = Array.from({ length: c.count }, () => i.chance(.3)), f = e.emissive();
	return e.each((t, n, r) => {
		e.hf[r] = o(c.edge[r] / 3, 0, 1) * .8;
	}), e.each((t, n, r) => {
		let i = c.edge[r];
		if (i < .9) {
			e.set(t, n, u[i < .45 ? 4 : 3]);
			let r = i < .45 ? 255 : 200;
			f.set(t, n, [
				r,
				r,
				r,
				255
			]);
		} else if (d[c.id[r]]) {
			let r = i < 1.8 ? 2 : 1;
			e.set(t, n, u[r]);
			let a = r === 2 ? 150 : 90;
			f.set(t, n, [
				a,
				a,
				a,
				255
			]);
		} else {
			let r = o(2 + I(e.slope(t, n), .1, .3), 0, 4);
			e.set(t, n, l[r]);
		}
	}), { normal: 1.4 };
}
function _t(e, t) {
	let { w: n, h: r } = e, { seed: i } = t, a = E([
		"#1f140e",
		"#34221a",
		"#4f3322",
		"#6b4a30",
		"#8a6440"
	], .1, .1), s = [
		"#1d2f48",
		"#27405e",
		"#335274",
		"#43668a",
		"#587d9e",
		"#7397b3"
	].map(y), c = e.emissive(), l = (e) => e === 0 || e === 7 || e === 15 || e === r - 1, u = (e) => e === 0 || e === 7 || e === 8 || e === n - 1, d = A(n, r, 2, 3, i + 5, { oct: 2 });
	return e.each((t, i, f) => {
		if (u(t) || l(i)) {
			let o = 3;
			(t === 0 || i === 0 || t === 7) && (o = 4), (t === n - 1 || i === r - 1 || t === 8) && (o = 2), e.set(t, i, C(a, o)), e.hf[f] = .9;
			return;
		}
		let p = i / r, m = o(Math.round(4.6 - p * 3 + (d[f] - .5) * 1.6), 1, 5);
		(l(i - 1) || u(t - 1)) && (m = Math.max(1, m - 2));
		let h = t <= 6 ? t - 1 : t - 9, g = i < 7 ? i - 1 : i < 15 ? i - 8 : i - 16;
		(h + g === 4 || h + g === 5) && (m = Math.min(5, m + 1)), e.set(t, i, s[m]), e.hf[f] = .2;
		let _ = Math.round(o(.78 + (1 - p) * .22 - (l(i - 1) ? .15 : 0), 0, 1) * 255);
		c.set(t, i, [
			_,
			_,
			_,
			255
		]);
	}), { normal: 1.6 };
}
function vt(e, t) {
	let { w: n } = e, { seed: r } = t, i = e.emissive(), a = Array.from({ length: n }, (e, t) => .86 + .14 * s(t >> 1, 0, r));
	return e.each((t, r, s) => {
		e.set(t, r, "#ffffff"), e.hf[s] = .5;
		let c = Math.min(1, (Math.min(t, n - 1 - t) + .5) / 3), l;
		l = r < 24 ? (1 - r / 23 * .78) * a[t] * c : .32 * c * Math.min(1, (Math.min(r - 24, 31 - r) + .5) / 2.5);
		let u = Math.round(o(Math.round(l * 8) / 8, 0, 1) * 255);
		i.set(t, r, [
			u,
			u,
			u,
			255
		]);
	}), { normal: 0 };
}
function yt(e, t) {
	let { w: n, h: r } = e, { seed: i } = t, a = [
		"#5e4c36",
		"#857055",
		"#a99270",
		"#c4ad86",
		"#d8c49c",
		"#e8dbb8"
	].map(y), c = A(n, r, 2, 2, i + 2, { oct: 2 });
	return e.each((t, n, r) => {
		e.hf[r] = c[r] * .7 + (t + n & 1 ? .03 : 0);
	}), e.each((t, n) => {
		let r = 3 + o(I(e.slope(t, n), .07, .25), -2, 1);
		s(t, n, i) < .05 && --r, !(t & 3) && !(n & 1) && r > 1 && --r, e.set(t, n, C(a, r));
	}), { normal: 1.2 };
}
function bt(e, t) {
	let n = t.map(y);
	return (t, r) => {
		let i = e(t, r), a = new Float32Array(t.w * t.h).fill(-1), s = [];
		if (t.each((e, n, r) => {
			let i = t.get(e, n);
			i[3] && (a[r] = .299 * i[0] + .587 * i[1] + .114 * i[2], s.push(a[r]));
		}), !s.length) return i;
		s.sort((e, t) => e - t);
		let c = s[Math.floor((s.length - 1) * .02)], l = s[Math.ceil((s.length - 1) * .98)], u = Math.max(1, l - c);
		return t.each((e, r, i) => {
			if (a[i] < 0) return;
			let s = o(Math.round((a[i] - c) / u * (n.length - 1)), 0, n.length - 1), l = n[s];
			t.set(e, r, [
				l[0],
				l[1],
				l[2],
				t.A(e, r)
			]);
		}), i;
	};
}
var xt = Object.freeze({
	PALETTE: a,
	parseColor: y,
	mixColor: v,
	shadeColor: _,
	extRamp: E,
	blendRamp: D,
	clamp: o,
	smoothstep: c,
	RNG: f,
	hash2: s,
	bayer4: l,
	field: A,
	stepOf: I,
	gradientMap: bt,
	genGrass: V,
	genDirt: ce,
	genSand: le,
	genCobblestone: me,
	genStoneTiles: he,
	genMossStone: ge,
	genCliff: Se,
	genGrassSide: Ce,
	genDirtSide: we,
	genCrag: Te,
	genPlaster: Oe,
	genBrick: Le,
	genStoneBrick: Re,
	genClayRoof: ze,
	genRoofSlate: Ve,
	genFoliage: Ke,
	genBark: Ge
}), G = {
	grass: {
		px: [64, 64],
		gen: (e, t) => V(e, t),
		normalScale: .45
	},
	grass_dark: {
		px: [64, 64],
		gen: (e, t) => V(e, t, {
			ramp: oe,
			warm: .2,
			density: .85
		}),
		normalScale: .45
	},
	grass_flowers: {
		px: [64, 64],
		gen: (e, t) => V(e, t, {
			flowers: 14,
			density: .72
		}),
		normalScale: .45
	},
	dirt: {
		px: [64, 64],
		gen: (e, t) => ce(e, t, {
			base: 3,
			cracks: 3,
			sprigs: 4
		}),
		normalScale: .6
	},
	dirt_path: {
		px: [64, 64],
		gen: (e, t) => ce(e, t, {
			base: 4,
			ruts: 6,
			cracks: 2,
			pebbles: 30,
			cool: !0
		}),
		normalScale: .6
	},
	cobblestone: {
		px: [64, 64],
		gen: (e, t) => me(e, t),
		normalScale: .7
	},
	stone_tiles: {
		px: [64, 64],
		gen: he,
		normalScale: .6
	},
	sand: {
		px: [64, 64],
		gen: le,
		normalScale: .5
	},
	farmland: {
		px: [64, 64],
		gen: ue,
		normalScale: .6
	},
	moss_stone: {
		px: [64, 64],
		gen: ge,
		normalScale: .7
	},
	riverbed: {
		px: [64, 64],
		gen: _e,
		normalScale: .7
	},
	wood_deck: {
		px: [64, 64],
		gen: ve,
		normalScale: .55
	},
	cliff: {
		px: [16, 16],
		gen: Se,
		normalScale: .7
	},
	grass_side: {
		px: [16, 16],
		gen: Ce,
		normalScale: .7
	},
	dirt_side: {
		px: [16, 16],
		gen: we,
		normalScale: .7
	},
	stone_wall: {
		px: [32, 32],
		gen: Ee,
		normalScale: .65
	},
	crag: {
		px: [32, 32],
		gen: Te,
		normalScale: .7
	},
	plaster: {
		px: [64, 64],
		gen: Oe,
		normalScale: .5
	},
	timber_frame: {
		px: [32, 32],
		gen: Me,
		normalScale: .6
	},
	wood_planks: {
		px: [32, 32],
		gen: Pe,
		normalScale: .5
	},
	wood_planks_dark: {
		px: [32, 32],
		gen: Fe,
		normalScale: .5
	},
	log_wall: {
		px: [32, 32],
		gen: Ie,
		normalScale: .6
	},
	brick: {
		px: [32, 32],
		gen: Le,
		normalScale: .6
	},
	stone_brick: {
		px: [32, 32],
		gen: Re,
		normalScale: .6
	},
	roof_red: {
		px: [32, 32],
		gen: (e, t) => ze(e, t, a.roofRed),
		normalScale: .7
	},
	roof_blue: {
		px: [32, 32],
		gen: (e, t) => ze(e, t, a.roofBlue),
		normalScale: .7
	},
	roof_thatch: {
		px: [32, 32],
		gen: Be,
		normalScale: .6
	},
	roof_slate: {
		px: [32, 32],
		gen: Ve,
		normalScale: .65
	},
	door: {
		px: [16, 32],
		gen: He,
		normalScale: .6
	},
	window: {
		px: [16, 16],
		gen: Ue,
		normalScale: .7,
		emissive: !0
	},
	chimney_stone: {
		px: [32, 32],
		gen: We,
		normalScale: .65
	},
	bark: {
		px: [16, 32],
		gen: Ge,
		normalScale: .7
	},
	leaves: {
		px: [32, 32],
		gen: (e, t) => Ke(e, t, a.leaves),
		normalScale: .6,
		alpha: !0
	},
	leaves_autumn: {
		px: [32, 32],
		gen: (e, t) => Ke(e, t, a.leavesAutumn),
		normalScale: .6,
		alpha: !0
	},
	pine: {
		px: [32, 32],
		gen: qe,
		normalScale: .6,
		alpha: !0,
		wrap: !0
	},
	hay: {
		px: [32, 32],
		gen: Je,
		normalScale: .7
	},
	cloth_red: {
		px: [32, 32],
		gen: Xe,
		normalScale: .5
	},
	cloth_stripe: {
		px: [32, 32],
		gen: Ze,
		normalScale: .5
	},
	metal: {
		px: [16, 16],
		gen: Qe,
		normalScale: .6
	},
	barrel: {
		px: [16, 16],
		gen: $e,
		normalScale: .6
	},
	crate: {
		px: [16, 16],
		gen: et,
		normalScale: .6
	},
	fence_wood: {
		px: [16, 16],
		gen: tt,
		normalScale: .7,
		alpha: !0,
		wrap: !0
	},
	rope: {
		px: [16, 16],
		gen: nt,
		normalScale: .8
	},
	well_stone: {
		px: [32, 32],
		gen: rt,
		normalScale: .65
	},
	lantern_glass: {
		px: [16, 16],
		gen: it,
		normalScale: .5,
		emissive: !0
	},
	sign_board: {
		px: [32, 16],
		gen: at,
		normalScale: .8
	},
	flowerbox: {
		px: [16, 16],
		gen: ot,
		normalScale: .7,
		alpha: !0,
		wrap: !0
	},
	furniture_wood: {
		px: [32, 32],
		gen: lt,
		normalScale: .5
	},
	books: {
		px: [32, 8],
		gen: dt,
		normalScale: .6
	},
	pantry: {
		px: [32, 8],
		gen: ft,
		normalScale: .6
	},
	linen: {
		px: [16, 16],
		gen: pt,
		normalScale: .5
	},
	quilt_red: {
		px: [32, 32],
		gen: (e, t) => W(e, t, a.red),
		normalScale: .6
	},
	quilt_blue: {
		px: [32, 32],
		gen: (e, t) => W(e, t, a.blue),
		normalScale: .6
	},
	quilt_green: {
		px: [32, 32],
		gen: (e, t) => W(e, t, a.green),
		normalScale: .6
	},
	quilt_ochre: {
		px: [32, 32],
		gen: (e, t) => W(e, t, a.yellow),
		normalScale: .6
	},
	quilt_plum: {
		px: [32, 32],
		gen: (e, t) => W(e, t, a.purple),
		normalScale: .6
	},
	rug_red: {
		px: [32, 32],
		gen: (e, t) => mt(e, t, a.red),
		normalScale: .4
	},
	rug_blue: {
		px: [32, 32],
		gen: (e, t) => mt(e, t, a.blue),
		normalScale: .4
	},
	rug_green: {
		px: [32, 32],
		gen: (e, t) => mt(e, t, a.green),
		normalScale: .4
	},
	rug_border: {
		px: [16, 8],
		gen: ht,
		normalScale: .4
	},
	embers: {
		px: [16, 16],
		gen: gt,
		normalScale: .6,
		emissive: !0
	},
	window_inside: {
		px: [16, 24],
		gen: _t,
		normalScale: .6,
		emissive: !0
	},
	light_beam: {
		px: [16, 32],
		gen: vt,
		normalScale: 0,
		emissive: !0
	},
	burlap: {
		px: [16, 16],
		gen: yt,
		normalScale: .6
	}
}, St = /* @__PURE__ */ new Set();
function Ct(e, t) {
	if (St.has(e)) return;
	let n = e(xt), r = Object.keys(n);
	if (t && (r.length !== t.length || r.some((e) => !t.includes(e)))) throw Error(`Textures: the texture set defines [${r.join(", ")}], its name list [${t.join(", ")}]`);
	for (let e of r) if (Object.hasOwn(G, e)) throw Error(`Textures: the texture "${e}" is defined twice`);
	for (let e of r) G[e] = n[e];
	St.add(e);
}
var wt = /* @__PURE__ */ "grass.grass_dark.grass_flowers.dirt.dirt_path.cobblestone.stone_tiles.sand.farmland.moss_stone.riverbed.wood_deck.cliff.grass_side.dirt_side.stone_wall.plaster.timber_frame.wood_planks.wood_planks_dark.log_wall.brick.stone_brick.roof_red.roof_blue.roof_thatch.roof_slate.door.window.chimney_stone.bark.leaves.leaves_autumn.pine.hay.cloth_red.cloth_stripe.metal.barrel.crate.fence_wood.rope.well_stone.lantern_glass.sign_board.flowerbox".split("."), Tt = 16758896;
function Et(e) {
	if (!e) return "{}";
	let t = {};
	for (let n of Object.keys(e)) {
		let r = e[n];
		t[n] = typeof r == "function" ? `fn:${String(r)}` : r && typeof r == "object" && typeof r.uuid == "string" ? `uuid:${r.uuid}` : r;
	}
	return JSON.stringify(t);
}
var Dt = class {
	constructor({ seed: e = 1337, anisotropy: t = 4 } = {}) {
		this.seed = e >>> 0, this.anisotropy = t, this._painted = /* @__PURE__ */ new Map(), this._tex = /* @__PURE__ */ new Map(), this._materials = /* @__PURE__ */ new Map(), this._fallback = null, this._warned = /* @__PURE__ */ new Set();
	}
	seedOf(e) {
		return (Math.imul(u(e), 2654435761) ^ Math.imul(this.seed, 2246822507)) >>> 0;
	}
	has(e) {
		return h(G, e);
	}
	list() {
		return wt.slice();
	}
	meta(e) {
		let t = this.has(e) ? G[e] : null;
		return t ? {
			px: [t.px[0], t.px[1]],
			units: [t.px[0] / 16, t.px[1] / 16],
			alpha: !!t.alpha,
			emissive: !!t.emissive,
			normal: !0
		} : (this._warn(e), {
			px: [16, 16],
			units: [1, 1],
			alpha: !1,
			emissive: !1,
			normal: !1
		});
	}
	pixels(e) {
		let t = this._painted.get(e);
		if (t) return t;
		let n = this.has(e) ? G[e] : null;
		if (!n) return null;
		let [r, i] = n.px, a = n.wrap ?? !n.alpha, o = new ne(r, i, a), s = this.seedOf(e), c = {
			rng: new f(s),
			seed: s % 1e5,
			seedOf: (e) => this.seedOf(e) % 1e5,
			name: e
		}, l = n.gen(o, c) || {};
		n.alpha && (o.pc.wrap = !1);
		let u = l.normal ?? 2, d = a && l.wrap !== !1, p = g(r, i, (e, t) => o.hf[t * r + e], {
			strength: u,
			wrap: d
		});
		return t = {
			color: o.pc,
			normal: p,
			emissive: o.em,
			height: o.hf,
			normalScale: n.normalScale ?? .8
		}, this._painted.set(e, t), t;
	}
	canvas(e) {
		let t = this.pixels(e);
		return t ? t.color.toCanvas() : null;
	}
	_textures(e) {
		let t = this._tex.get(e);
		if (t) return t;
		let n = this.pixels(e);
		if (!n) return null;
		let r = {
			wrap: "repeat",
			mipmaps: !0,
			anisotropy: this.anisotropy
		};
		return t = {
			map: b(n.color.toCanvas(), {
				...r,
				srgb: !0,
				name: `luminati:${e}`
			}),
			normal: n.normal ? b(n.normal.toCanvas(), {
				...r,
				srgb: !1,
				name: `luminati:${e}:normal`
			}) : null,
			emissive: n.emissive ? b(n.emissive.toCanvas(), {
				...r,
				srgb: !0,
				name: `luminati:${e}:emissive`
			}) : null
		}, this._tex.set(e, t), t;
	}
	get(e) {
		let t = this._textures(e);
		return t ? t.map : (this._warn(e), this._fallbackTexture());
	}
	normal(e) {
		let t = this._textures(e);
		return t ? t.normal : null;
	}
	emissive(e) {
		let t = this._textures(e);
		return t ? t.emissive : null;
	}
	material(t, n = {}) {
		n ??= {};
		let a = `${t}|${Et(n)}`, o = this._materials.get(a);
		if (o) return o;
		let s = this.meta(t), c = { map: this.get(t) }, l = this.normal(t), u = this._painted.get(t);
		if (l) {
			let t = u ? u.normalScale : .8;
			c.normalMap = l, c.normalScale = new e(t, t);
		}
		let d = this.emissive(t);
		d && (c.emissiveMap = d, c.emissive = new i(Tt), c.emissiveIntensity = n.emissiveIntensity ?? 1), s.alpha && (c.alphaTest = .5, c.side = 2);
		let f = { ...n };
		return typeof f.normalScale == "number" && (f.normalScale = new e(f.normalScale, f.normalScale)), o = new r({
			...c,
			...f
		}), o.name = `luminati:${t}`, f.userData && (o.userData = { ...f.userData }), s.alpha && (o.userData.alpha = !0), o.userData.texture = t, this._materials.set(a, o), o;
	}
	preload(e = wt) {
		for (let t of e) this._textures(t);
	}
	_warn(e) {
		this._warned.has(e) || (this._warned.add(e), console.warn(`[TextureLibrary] unknown texture "${m(e)}"`));
	}
	_fallbackTexture() {
		if (!this._fallback) {
			let e = new x(16, 16);
			e.map((e, t) => (e >> 2) + (t >> 2) & 1 ? "#ff00ff" : "#200020"), this._fallback = e.toTexture({ mipmaps: !0 });
		}
		return this._fallback;
	}
	dispose() {
		for (let e of this._tex.values()) e.map.dispose(), e.normal?.dispose(), e.emissive?.dispose();
		for (let e of this._materials.values()) e.dispose();
		this._fallback?.dispose(), this._tex.clear(), this._materials.clear(), this._painted.clear(), this._fallback = null;
	}
}, K = a.outline, q = a.grass, Ot = a.leaves, J = a.fire, kt = Object.freeze([
	"dry_tuft",
	"dry_grass_tall",
	"scrub",
	"agave",
	"thornbush",
	"prickly_pear",
	"pebbles",
	"cinders",
	"bones"
]);
function Y(e, r, { frames: i = 0, fps: a = 0, smooth: o = !1 } = {}) {
	let s = e.toCanvas(), c = b(s, {
		wrap: "clamp",
		mipmaps: !1,
		srgb: !0,
		name: `prop:${r}`
	});
	c.wrapS = c.wrapT = n, c.generateMipmaps = !1, o && (c.magFilter = t, c.minFilter = t);
	let l = i || 1, u = e.width / l, d = {};
	i && (d.idle = {
		frames: Array.from({ length: l }, (e, t) => ({
			col: t,
			row: 0
		})),
		fps: a,
		loop: !0
	});
	let f = {
		texture: c,
		canvas: s,
		width: u,
		height: e.height,
		pixelsPerUnit: 16,
		anchor: [.5, 0],
		frameWidth: u,
		frameHeight: e.height,
		sheetWidth: e.width,
		columns: l,
		rows: 1,
		animations: d,
		kind: r,
		dispose() {
			c.dispose();
		}
	};
	return i && (f.frames = i, f.fps = a), f;
}
function X(e, t, n, r, i) {
	let a = y(r);
	e.set(t, n, [
		a[0],
		a[1],
		a[2],
		Math.round(o(i) * 255)
	]);
}
function Z(e, t, { top: n = !0, bottom: r = !0, left: i = !0, right: a = !0, diag: o = !1 } = {}) {
	let s = e.clone(), c = [];
	i && c.push([1, 0]), a && c.push([-1, 0]), n && c.push([0, 1]), r && c.push([0, -1]), o && c.push([1, 1], [-1, 1]);
	for (let n = 0; n < e.height; n++) for (let r = 0; r < e.width; r++) if (!(s.getAlpha(r, n) > 0)) {
		for (let [i, a] of c) if (s.getAlpha(r + i, n + a) >= 128) {
			e.set(r, n, t);
			break;
		}
	}
}
function At(e, t, n, r, i, a, { depth: s = 0, baseW: c = 2, tipLight: l = !0 } = {}) {
	let u = Math.max(2, Math.round(r));
	for (let r = 0; r <= u; r++) {
		let d = r / u, f = Math.round(t + i * d * d), p = n - r, m;
		m = d < .22 ? 1 : d < .5 ? 2 : d < .82 ? 3 : l ? 4 : 3, i < -.5 && d > .3 && (m = Math.min(m + 1, a.length - 1)), m = o(m - s, 0, a.length - 1), e.set(f, p, a[m]), d < .3 && c > 1 && e.set(f + (i >= 0 ? 1 : -1), p, a[o(m - 1, 0, a.length - 1)]);
	}
}
function jt(e) {
	let t = new x(16, 12), n = new f(e), r = q, i = [];
	for (let e = 0; e < 15; e++) {
		let t = e / 14 * 2 - 1, r = Math.round(7.5 + t * 4 + n.range(-.6, .6));
		i.push({
			bx: r,
			h: (10.5 - Math.abs(t) * 5) * n.range(.75, 1.05),
			lean: t * n.range(2.5, 4.5) + n.range(-.8, .8),
			depth: +(e * 7 % 3 == 0)
		});
	}
	i.sort((e, t) => t.depth - e.depth || e.h - t.h);
	for (let e of i) {
		let n = Math.max(3, Math.round(e.h));
		for (let i = 0; i <= n; i++) {
			let a = i / n, s = Math.round(e.bx + e.lean * a * a), c = 11 - i, l = a < .2 ? 1 : a < .45 ? 2 : a < .78 ? 3 : 4;
			e.lean < -.8 && a > .35 && (l = Math.min(5, l + 1)), e.lean > 1.5 && a > .5 && (l = Math.max(2, l - 1)), l = o(l - e.depth, 0, 5), t.set(s, c, r[l]), a < .45 && t.set(s + (e.lean >= 0 ? 1 : -1), c, r[o(l - 1, 0, 5)]);
		}
	}
	for (let e = 4; e <= 11; e++) t.set(e, 11, r[e < 6 ? 2 : 1]), e > 4 && e < 11 && t.set(e, 10, r[e < 7 ? 2 : 1]);
	return Y(t, "grass_tuft");
}
function Mt(e) {
	let t = new x(16, 24), n = new f(e), r = q, i = a.grassDry, o = [];
	for (let e = 0; e < 15; e++) {
		let t = e / 14 * 2 - 1, r = Math.round(8 + t * 4.5 + n.range(-.6, .6));
		o.push({
			bx: r,
			h: (21 - Math.abs(t) * 9) * n.range(.7, 1.05),
			lean: t * n.range(2.5, 5) + n.range(-1.2, 1.2),
			depth: +(e % 3 == 1)
		});
	}
	o.sort((e, t) => t.depth - e.depth);
	for (let e of o) At(t, e.bx, 23, e.h, e.lean, r, { depth: e.depth });
	let s = [...o].sort((e, t) => t.h - e.h).slice(0, 3);
	for (let e of s) {
		let n = Math.round(e.bx + e.lean), r = Math.round(23 - e.h);
		t.set(n, r - 1, i[4]), t.set(n, r - 2, i[3]), t.set(n + (e.lean > 0 ? 1 : -1), r - 1, i[3]), t.set(n, r, i[2]);
	}
	for (let e = 4; e <= 12; e++) t.set(e, 23, r[1]), e > 4 && e < 12 && t.set(e, 22, r[e < 8 ? 2 : 1]);
	return Y(t, "grass_tall");
}
function Nt(e, t, n, r, i = 4) {
	for (let a = 0; a < 7; a++) {
		let o = a % 2 ? 1 : -1;
		At(e, t + o * r.int(0, 2), n, r.range(2.5, 5.5), o * r.range(1.5, i), q, {
			depth: +(a < 2),
			baseW: 2,
			tipLight: a > 3
		});
	}
}
function Q(e, t, n, r, i) {
	let a = Math.max(1, n - i);
	for (let i = 0; i <= a; i++) {
		let o = i / a, s = Math.round(p(t, r, o * o));
		e.set(s, n - i, i < a * .4 ? q[1] : q[2]);
	}
}
function $(e, t, n, r, i, a = {}) {
	for (let o = 0; o < t.length; o++) for (let s = 0; s < t[o].length; s++) {
		let c = t[o][s];
		if (c === ".") continue;
		let l = a[c] ?? (c === "k" ? K : i[Number(c)]);
		l !== void 0 && e.set(n + s, r + o, l);
	}
}
function Pt(e) {
	let t = new x(13, 15), n = new f(e), r = a.red;
	Nt(t, 6, 14, n);
	let i = [
		[3, 3],
		[9, 2],
		[6, 6]
	];
	for (let [e, n] of i) Q(t, 6 + Math.sign(e - 6), 13, e, n + 3);
	for (let [e, n] of i) $(t, [
		".454.",
		"45543",
		"44k32",
		".332."
	], e - 2, n, r);
	return Z(t, v(r[0], K, .4), {
		top: !1,
		left: !1,
		bottom: !0,
		right: !0
	}), Y(t, "flower_red");
}
function Ft(e) {
	let t = new x(12, 12), n = new f(e), r = a.yellow;
	Nt(t, 6, 11, n, 3.5);
	let i = [
		[3, 4],
		[6, 2],
		[9, 4],
		[5, 6],
		[8, 7]
	];
	for (let [e, n] of i) Q(t, 6, 11, e, n + 1);
	for (let [e, n] of i) $(t, [
		"454",
		"343",
		".2."
	], e - 1, n - 1, r);
	return Z(t, v(r[1], K, .35), {
		top: !1,
		left: !1,
		bottom: !0,
		right: !0
	}), Y(t, "flower_yellow");
}
function It(e) {
	let t = new x(14, 14), n = new f(e), r = a.white, i = a.yellow;
	Nt(t, 7, 13, n);
	let o = [
		[3, 3],
		[10, 2],
		[7, 6]
	];
	for (let [e, n] of o) Q(t, 7 + Math.sign(e - 7), 13, e + 1, n + 4);
	for (let [e, n] of o) $(t, [
		".44.",
		"4ab3",
		"3bc2",
		".22."
	], e - 1, n, r, {
		a: i[5],
		b: i[4],
		c: i[3]
	});
	return Z(t, v(r[0], K, .45), {
		top: !0,
		left: !0,
		bottom: !0,
		right: !0
	}), Y(t, "flower_white");
}
function Lt(e) {
	let t = new x(12, 14), n = new f(e), r = a.blue;
	Nt(t, 6, 13, n), Q(t, 5, 13, 3, 3), Q(t, 7, 13, 9, 5);
	for (let [e, n] of [
		[3, 4],
		[2, 7],
		[4, 8],
		[9, 6],
		[10, 9]
	]) $(t, [
		".43",
		"342",
		"2.1"
	], e - 1, n, r);
	return $(t, [
		".4.",
		"453",
		".2."
	], 7, 1, r), Z(t, v(r[0], K, .3), {
		top: !1,
		left: !1,
		bottom: !0,
		right: !0
	}), Y(t, "flower_blue");
}
function Rt(e) {
	let t = new x(24, 18), n = new f(e), r = Ot, i = (/* @__PURE__ */ new Int8Array(432)).fill(-1);
	for (let [t, r, a, o] of [
		[
			6,
			11,
			5,
			4.5
		],
		[
			17,
			11,
			5.5,
			4.5
		],
		[
			11.5,
			12,
			6.5,
			5
		],
		[
			8,
			7,
			4.5,
			4
		],
		[
			15,
			6.5,
			5,
			4.2
		],
		[
			11.5,
			5,
			4.5,
			4
		]
	]) {
		let s = n.range(-.4, .4), c = n.range(-.3, .3);
		for (let n = Math.floor(r - o - 1); n <= Math.ceil(r + o + 1); n++) for (let l = Math.floor(t - a - 1); l <= Math.ceil(t + a + 1); l++) {
			if (l < 0 || n < 0 || l >= 24 || n >= 18) continue;
			let u = (l + .5 - t - s) / a, f = (n + .5 - r - c) / o, p = 1 - .18 * d(l * .9, n * .9, e), m = u * u + f * f;
			if (m > p) continue;
			let h = -u * .5 - f * .9 - n / 18 * .6 + .35, g = h > .65 ? 4 : h > .2 ? 3 : h > -.3 ? 2 : 1;
			m > p * .72 && h < .3 && (g = Math.max(1, g - 1)), i[n * 24 + l] = g;
		}
	}
	let o = i.slice();
	for (let t = 1; t < 17; t++) for (let n = 1; n < 23; n++) {
		let r = o[t * 24 + n];
		if (r < 0) continue;
		let a = s(n, t, e);
		a < .11 && r >= 2 ? (i[t * 24 + n] = Math.min(5, r + 1), o[(t - 1) * 24 + n + 1] >= 2 && (i[(t - 1) * 24 + n + 1] = Math.min(5, r + 1))) : a > .9 && r >= 2 && r <= 3 && (i[t * 24 + n] = r - 1);
	}
	for (let e = 0; e < 24; e++) for (let t = 15; t < 18; t++) i[t * 24 + e] >= 0 && (i[t * 24 + e] = t === 17 ? 0 : 1);
	for (let e = 0; e < 432; e++) i[e] >= 0 && t.set(e % 24, e / 24 | 0, r[i[e]]);
	let c = n.chance(.5) ? a.white : [
		"#8c3a5a",
		"#c85a82",
		"#ec8fb0",
		"#f8bdd0",
		"#fff0f4"
	];
	for (let e = 0; e < 4; e++) {
		let e = n.int(5, 18), r = n.int(3, 11);
		t.getAlpha(e, r) && t.getAlpha(e + 1, r + 1) && (t.set(e, r, c[4]), t.set(e + 1, r, c[2]), t.set(e, r + 1, c[2]));
	}
	return Z(t, v(r[0], K, .5), {
		top: !1,
		left: !1,
		bottom: !0,
		right: !0
	}), Z(t, r[1], {
		top: !0,
		left: !0,
		bottom: !1,
		right: !1
	}), Y(t, "bush");
}
function zt(e) {
	let t = new x(20, 16), n = new f(e), r = a.green, i = a.grass[4];
	for (let e of [
		{
			ang: -2.75,
			len: 8,
			depth: 1
		},
		{
			ang: -.4,
			len: 8,
			depth: 1
		},
		{
			ang: -1.9,
			len: 11,
			depth: 1
		},
		{
			ang: -2.3,
			len: 11,
			depth: 0
		},
		{
			ang: -.85,
			len: 11,
			depth: 0
		},
		{
			ang: -1.45,
			len: 12.5,
			depth: 0
		}
	]) {
		let a = Math.cos(e.ang) >= 0 ? 1 : -1, s = 9.5, c = 15, l = e.ang + n.range(-.06, .06), u = Math.round(e.len / .75), d = [];
		for (let e = 0; e < u; e++) l += a * .05 * (.2 + e / u), s += Math.cos(l) * .75, c += Math.sin(l) * .75, d.push([
			s,
			c,
			l,
			e / u
		]);
		for (let n = 1; n < d.length - 1; n += 2) {
			let [i, a, s, c] = d[n], l = c < .55 ? 2 : 1;
			for (let n of [-1, 1]) {
				let c = s + n * 1.05, u = Math.sin(c) < -.2;
				for (let n = 1; n <= l; n++) {
					let s = Math.round(i + Math.cos(c) * n), d = Math.round(a + Math.sin(c) * n), f = o((u ? 3 : 2) - e.depth + (n === l && u ? 1 : 0), 1, 4);
					t.set(s, d, r[f]);
				}
			}
		}
		for (let [n, i, , a] of d) t.set(Math.round(n), Math.round(i), r[o((a < .3 ? 2 : 3) - e.depth, 1, 4)]);
		let f = d[d.length - 1];
		t.set(Math.round(f[0]), Math.round(f[1]), e.depth ? r[3] : i);
	}
	for (let e = 7; e <= 12; e++) t.set(e, 15, r[e < 9 ? 2 : 1]);
	return Z(t, v(r[0], K, .4), {
		top: !1,
		left: !1,
		bottom: !0,
		right: !0
	}), Y(t, "fern");
}
function Bt(e) {
	let t = new x(14, 26), n = new f(e), r = q, i = a.grassDry, o = a.brown;
	for (let e = 0; e < 7; e++) {
		let i = 3 + Math.round(e * 1.3 + n.range(-.5, .5));
		At(t, i, 25, n.range(9, 17), (i - 7) * n.range(.6, 1.3) + n.range(-1.5, 1.5), r, {
			depth: e % 2,
			baseW: 1
		});
	}
	for (let [e, n, r] of [
		[
			5,
			23,
			-1
		],
		[
			8,
			25,
			1
		],
		[
			10,
			19,
			1
		]
	]) {
		for (let a = 0; a < n; a++) {
			let o = a / n, s = Math.round(e + r * o * o * 1.5);
			t.set(s, 25 - a, o < .4 ? i[1] : i[2]);
		}
		let a = Math.round(e + r * 1.5), s = 25 - n;
		for (let e = 0; e < 5; e++) t.set(a, s + 2 + e, e === 0 ? o[4] : o[3]), t.set(a + 1, s + 2 + e, e === 4 ? o[1] : o[2]);
		t.set(a, s + 1, i[3]), t.set(a, s, i[2]);
	}
	for (let e = 3; e <= 11; e++) t.set(e, 25, r[1]);
	return Z(t, v(r[0], K, .4), {
		top: !1,
		left: !1,
		bottom: !0,
		right: !0
	}), Y(t, "reeds");
}
function Vt(e) {
	let t = new x(13, 11), n = a.red, r = a.cream, i = a.white, o = [
		"..3455..",
		".345W43.",
		"34W44432",
		"34443W32",
		".222211."
	], s = (e, n, r, a) => {
		for (let o = 0; o < e.length; o++) for (let s = 0; s < e[o].length; s++) {
			let c = e[o][s];
			c !== "." && t.set(n + s, r + o, c === "W" ? i[4] : c === "w" ? i[2] : a[Number(c)]);
		}
	};
	for (let e = 5; e <= 10; e++) t.set(4, e, r[4]), t.set(5, e, r[3]), t.set(6, e, r[2]);
	t.set(3, 10, r[3]), t.set(7, 10, r[1]);
	for (let e = 7; e <= 10; e++) t.set(10, e, r[4]), t.set(11, e, r[2]);
	return s(o, 1, 1, n), s([
		".34.",
		"3W42",
		"2211"
	], 9, 5, n), t.set(2, 10, q[3]), t.set(8, 10, q[3]), t.set(8, 9, q[4]), t.set(12, 10, q[2]), t.outline(v(n[0], K, .6)), Y(t, "mushroom");
}
function Ht(e) {
	let t = new x(14, 9), n = a.stone, r = a.moss, i = [
		"....4455......",
		"..344554432...",
		".3444443333...",
		"3443343332232.",
		"33333322222221",
		".2222221111111",
		"..11111111...."
	];
	for (let e = 0; e < i.length; e++) for (let r = 0; r < i[e].length; r++) {
		let a = i[e][r];
		a !== "." && t.set(r, e + 1, n[Number(a)]);
	}
	return t.set(6, 4, n[1]), t.set(7, 5, n[1]), t.set(3, 2, r[3]), t.set(4, 2, r[3]), t.set(5, 1, r[3]), t.set(2, 3, r[2]), t.set(3, 3, r[2]), t.set(8, 2, r[2]), t.outline(v(n[0], K, .5)), Y(t, "rock_small");
}
function Ut(e, t, n, { cx: r, baseY: i, height: a, halfW: o, seed: s = 0, tongues: c = 3 }) {
	let l = (i - t) / a;
	if (l < -.15 || l > 1.35) return 0;
	let u = Math.PI * 2, f = Math.sin(n * u + l * 3.1 + s) * .9 * l + Math.sin(n * u * 2 + l * 5.3 + s * 1.7) * .5 * l * l, p = (e + .5 - r - f) / o, m = Math.max(.05, 1 - Math.max(0, l) ** 1.25), h = 1 - Math.abs(p) / m, g = 0;
	for (let t = 0; t < c; t++) {
		let i = n * u * (t % 2 ? 1 : 2) + t * 2.1 + s, a = Math.sin(i) * .55 + (t - (c - 1) / 2) * .35, d = .75 + .35 * (.5 + .5 * Math.sin(i * 1 + t)), p = (e + .5 - r - f) / o - a, m = .28 * (1 - l / d);
		l < d && m > 0 && (g = Math.max(g, 1 - Math.abs(p) / m));
	}
	h = Math.max(h, g * .85);
	let _ = d(e * .55, (t + n * 12) * .55, s, 0) * .5 + d(e * 1.3, (t + n * 24) * 1.1, s + 3, 0) * .25;
	return h = h * (1.05 - l * .55) + (_ - .38) * .55, l < 0 && (h *= 1 + l * 5), h;
}
function Wt(e) {
	return e > .86 ? J[5] : e > .68 ? J[4] : e > .5 ? J[3] : e > .33 ? J[2] : e > .2 ? J[1] : null;
}
function Gt(e, t, n, r) {
	let { fw: i, fh: a } = r;
	for (let o = 0; o < a; o++) for (let a = 0; a < i; a++) {
		let i = Wt(Ut(a, o, n, r));
		i && e.set(t + a, o, i);
	}
}
function Kt(e) {
	let t = new x(192, 26), n = a.wood, r = a.stone, i = (i, a) => {
		let o = (e, r, a, o, s) => {
			let c = Math.max(Math.abs(a - e), Math.abs(o - r));
			for (let l = 0; l <= c; l++) {
				let u = l / c, d = Math.round(p(e, a, u)), f = Math.round(p(r, o, u));
				for (let e = 0; e < s; e++) t.set(i + d, f + e, n[e === 0 ? 4 : e === s - 1 ? 1 : 2]);
				l % 4 == 2 && t.set(i + d, f + 1, n[1]);
			}
			t.set(i + e, r, J[3]), t.set(i + e, r + 1, J[2]);
		};
		o(4, 18, 17, 22, 3), o(19, 18, 6, 22, 3), o(7, 21, 17, 21, 3);
		for (let [e, n] of [
			[2, 22],
			[5, 23],
			[9, 24],
			[14, 24],
			[18, 23],
			[21, 22]
		]) t.set(i + e, n, r[4]), t.set(i + e + 1, n, r[3]), t.set(i + e, n + 1, r[3]), t.set(i + e + 1, n + 1, r[2]), t.set(i + e - 1, n + 1, r[2]);
		for (let n = 0; n < 7; n++) {
			let r = 7 + (n * 5 + e) % 11, o = 20 + n % 3, s = (n + a) % 3 != 0;
			t.set(i + r, o, s ? J[4] : J[2]);
		}
	};
	for (let n = 0; n < 8; n++) {
		let r = n * 24;
		i(r, n), Gt(t, r, n / 8, {
			fw: 24,
			fh: 26,
			cx: 12,
			baseY: 21,
			height: 17,
			halfW: 5.2,
			seed: e % 97,
			tongues: 3
		});
		let a = 4 - n % 4 * 1, o = 11 + n * 3 % 4 - 1;
		n % 2 == 0 && t.set(r + o, a, J[4]), n % 4 == 1 && t.set(r + o + 2, a + 2, J[3]);
	}
	return Y(t, "campfire", {
		frames: 8,
		fps: 10
	});
}
function qt(e) {
	let t = new x(60, 16);
	for (let n = 0; n < 6; n++) Gt(t, n * 10, n / 6, {
		fw: 10,
		fh: 16,
		cx: 5,
		baseY: 14,
		height: 12,
		halfW: 3.4,
		seed: 11 + e % 13,
		tongues: 2
	});
	return Y(t, "torch_flame", {
		frames: 6,
		fps: 12
	});
}
function Jt(e) {
	let t = new x(20, 8), n = [
		[
			"..5..",
			".454.",
			".454.",
			".353.",
			"..3..",
			"....."
		],
		[
			"..4..",
			"..5..",
			".454.",
			".353.",
			"..3..",
			"....."
		],
		[
			".....",
			"..5..",
			".455.",
			".354.",
			"..3..",
			"....."
		],
		[
			"..4..",
			".45..",
			".454.",
			".353.",
			"..3..",
			"....."
		]
	];
	for (let e = 0; e < 4; e++) {
		let r = n[e];
		for (let n = 0; n < r.length; n++) for (let i = 0; i < 5; i++) {
			let a = r[n][i];
			a !== "." && t.set(e * 5 + i, n + 1, J[Number(a)]);
		}
		t.set(e * 5 + 2, 6, "#8fb0ff");
	}
	return Y(t, "candle_flame", {
		frames: 4,
		fps: 9
	});
}
function Yt() {
	let e = new x(17, 15), t = a.white, n = a.cream;
	for (let r = 1; r < 11; r++) for (let i = 1; i < 16; i++) {
		if ((i === 1 || i === 15) && (r === 1 || r === 10)) continue;
		let a = r >= 9 ? n[4] : t[4];
		e.set(i, r, a);
	}
	for (let t = 2; t < 15; t++) e.set(t, 10, n[3]);
	for (let n = 2; n < 10; n++) e.set(15, n, t[2]);
	e.set(6, 11, t[4]), e.set(7, 11, n[4]), e.set(8, 11, n[3]), e.set(6, 12, n[4]), e.set(7, 12, n[3]), e.set(6, 13, n[3]);
	let r = (t) => {
		e.set(t, 5, K), e.set(t + 1, 5, K), e.set(t, 6, K), e.set(t + 1, 6, "#3a3346");
	};
	return r(4), r(8), r(12), e.outline(K), Y(e, "speech_bubble");
}
function Xt() {
	let e = new x(6, 15), t = a.gold;
	return $(e, [
		"4553",
		"4553",
		"4543",
		".443",
		".443",
		".433",
		".43.",
		".32.",
		"....",
		".44.",
		"4553",
		".32."
	], 1, 1, t), e.outline(K), Y(e, "exclamation");
}
function Zt() {
	let e = new x(11, 11), t = "#ffffff", n = J[5], r = J[4];
	for (let i = 1; i <= 5; i++) {
		let a = 1 - (i - 1) / 5, o = i <= 1 ? t : i <= 3 ? n : r;
		for (let [t, n] of [
			[i, 0],
			[-i, 0],
			[0, i],
			[0, -i]
		]) X(e, 5 + t, 5 + n, o, Math.min(1, a * 1.15));
	}
	for (let [t, r] of [
		[1, 1],
		[-1, 1],
		[1, -1],
		[-1, -1]
	]) X(e, 5 + t, 5 + r, n, .55);
	return X(e, 5, 5, t, 1), Y(e, "sparkle");
}
function Qt() {
	let e = new x(7, 6), t = Ot, n = [
		"....45.",
		"..3444.",
		".33343.",
		"32233..",
		"222....",
		"1......"
	];
	for (let r = 0; r < n.length; r++) for (let i = 0; i < 7; i++) {
		let a = n[r][i];
		a !== "." && e.set(i, r, t[Number(a)]);
	}
	return e.set(3, 3, t[2]), Y(e, "leaf");
}
function $t() {
	let e = new x(5, 4), t = [
		"#8c3a5a",
		"#c85a82",
		"#ec8fb0",
		"#f8bdd0",
		"#fff0f4"
	], n = [
		".34.",
		"3443",
		"2332",
		".21."
	];
	for (let r = 0; r < n.length; r++) for (let i = 0; i < 4; i++) {
		let a = n[r][i];
		a !== "." && e.set(i, r, t[Number(a)]);
	}
	return Y(e, "petal");
}
function en() {
	let e = new x(5, 5);
	X(e, 2, 2, J[5], 1);
	for (let [t, n] of [
		[1, 0],
		[-1, 0],
		[0, 1],
		[0, -1]
	]) X(e, 2 + t, 2 + n, J[4], .95);
	for (let [t, n] of [
		[1, 1],
		[-1, 1],
		[1, -1],
		[-1, -1]
	]) X(e, 2 + t, 2 + n, J[3], .55);
	for (let [t, n] of [
		[2, 0],
		[-2, 0],
		[0, 2],
		[0, -2]
	]) X(e, 2 + t, 2 + n, J[2], .3);
	return Y(e, "ember");
}
function tn(e) {
	let t = new x(24, 24), n = new f(e), r = [
		[
			12,
			13,
			7
		],
		[
			8.5,
			11,
			5
		],
		[
			15.5,
			10.5,
			5.5
		],
		[
			12,
			8,
			5
		],
		[
			9,
			15,
			4.5
		],
		[
			16,
			15,
			4.5
		]
	];
	for (let e of r) e[0] += n.range(-.5, .5), e[1] += n.range(-.5, .5);
	for (let n = 0; n < 24; n++) for (let i = 0; i < 24; i++) {
		let a = 0, s = 0;
		for (let [e, t, o] of r) {
			let r = Math.hypot(i + .5 - e, n + .5 - t) / o;
			if (r < 1) {
				let c = 1 - r * r;
				a = Math.max(a, c), s = Math.max(s, c * (1 - ((i - e) * .4 + (n - t) * .7) / o * .5));
			}
		}
		if (a <= .02) continue;
		let l = d(i * .35, n * .35, e) * .35;
		a = c(0, .75, a) * (.75 + l);
		let u = o(.45 + s * .45 + l * .2), f = v("#6f7480", "#e8e6e2", u);
		X(t, i, n, f, a * .9);
	}
	return Y(t, "smoke_puff", { smooth: !0 });
}
function nn() {
	let e = new x(4, 4);
	return X(e, 1, 1, "#fff8e6", 1), X(e, 2, 1, "#fff2d0", .8), X(e, 1, 2, "#fff2d0", .8), X(e, 2, 2, "#ffe6b0", .6), X(e, 0, 1, "#ffe6b0", .25), X(e, 3, 2, "#ffe6b0", .2), X(e, 1, 0, "#ffe6b0", .25), X(e, 2, 3, "#ffe6b0", .2), Y(e, "dust");
}
function rn() {
	let e = new x(32, 32);
	for (let t = 0; t < 32; t++) for (let n = 0; n < 32; n++) {
		let r = Math.hypot(n + .5 - 16, t + .5 - 16) / 16;
		if (r >= 1) continue;
		let i = (1 - c(0, 1, r)) ** 1.6 * .95 + c(.55, .8, r) * (1 - c(.8, 1, r)) * .08;
		X(e, n, t, "#ffffff", i);
	}
	return Y(e, "bokeh_soft", { smooth: !0 });
}
var an = {
	grass_tuft: jt,
	grass_tall: Mt,
	flower_red: Pt,
	flower_yellow: Ft,
	flower_white: It,
	flower_blue: Lt,
	bush: Rt,
	fern: zt,
	reeds: Bt,
	mushroom: Vt,
	rock_small: Ht,
	campfire: Kt,
	torch_flame: qt,
	candle_flame: Jt,
	speech_bubble: Yt,
	exclamation: Xt,
	sparkle: Zt,
	leaf: Qt,
	petal: $t,
	ember: en,
	smoke_puff: tn,
	dust: nn,
	bokeh_soft: rn
};
function on(e) {
	let t = an;
	for (let [n, r] of Object.entries(e)) {
		if (Object.hasOwn(t, n)) {
			if (t[n] === r) continue;
			throw Error(`createPropSprite: the kind "${n}" is defined twice`);
		}
		t[n] = r;
	}
}
var sn = Object.freeze({
	finish: Y,
	outlineSides: Z,
	drawBlade: At,
	OUT: K
});
function cn(e, t) {
	let n = Object.hasOwn(an, e) ? an[e] : null;
	if (!n) throw Error(`createPropSprite: unknown kind "${e}"`);
	let r = t ? t.seed : void 0;
	return n((r == null ? u(e) : typeof r == "string" ? u(r) : Number(r) || 0) >>> 0);
}
//#endregion
export { Dt as a, on as i, sn as n, Ct as o, cn as r, kt as t };
