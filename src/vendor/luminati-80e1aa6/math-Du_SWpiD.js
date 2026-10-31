//#region src/engine/utils/math.js
var e = (e, t = 0, n = 1) => e < t ? t : e > n ? n : e, t = (e, t, n) => e + (t - e) * n, n = (t, n, r) => {
	let i = e((r - t) / (n - t));
	return i * i * (3 - 2 * i);
}, r = Math.PI / 180, i = 180 / Math.PI, a = (e, t) => 1 - Math.exp(-e * t);
function o(e) {
	let t = e >>> 0;
	return function() {
		t = t + 1831565813 >>> 0;
		let e = t;
		return e = Math.imul(e ^ e >>> 15, e | 1), e ^= e + Math.imul(e ^ e >>> 7, e | 61), ((e ^ e >>> 14) >>> 0) / 4294967296;
	};
}
function s(e) {
	let t = 2166136261;
	for (let n = 0; n < e.length; n++) t ^= e.charCodeAt(n), t = Math.imul(t, 16777619);
	return t >>> 0;
}
var c = class {
	constructor(e = 1) {
		this.seed = typeof e == "string" ? s(e) : e >>> 0, this._next = o(this.seed);
	}
	next() {
		return this._next();
	}
	range(e, t) {
		return e + (t - e) * this._next();
	}
	int(e, t) {
		return e + Math.floor(this._next() * (t - e + 1));
	}
	chance(e) {
		return this._next() < e;
	}
	pick(e) {
		return e[Math.floor(this._next() * e.length)];
	}
	gaussian() {
		let e = 1 - this._next(), t = this._next();
		return Math.sqrt(-2 * Math.log(e)) * Math.cos(2 * Math.PI * t);
	}
	shuffle(e) {
		for (let t = e.length - 1; t > 0; t--) {
			let n = Math.floor(this._next() * (t + 1));
			[e[t], e[n]] = [e[n], e[t]];
		}
		return e;
	}
};
function l(e, t, n = 0) {
	let r = Math.imul((e | 0) ^ 668265261, 374761393) ^ Math.imul((t | 0) ^ 2654435769, 2246822507) ^ Math.imul(n | 0, 3266489909);
	return r = Math.imul(r ^ r >>> 15, 739982445), r = Math.imul(r ^ r >>> 12, 695872825), r ^= r >>> 15, (r >>> 0) / 4294967296;
}
function u(e, n, r = 0, i = 0) {
	let a = Math.floor(e), o = Math.floor(n), s = e - a, c = n - o, u = (e) => i > 0 ? (e % i + i) % i : e, d = u(a), f = u(a + 1), p = u(o), m = u(o + 1), h = l(d, p, r), g = l(f, p, r), _ = l(d, m, r), v = l(f, m, r), y = s * s * (3 - 2 * s), b = c * c * (3 - 2 * c);
	return t(t(h, g, y), t(_, v, y), b);
}
function d(e, t, { octaves: n = 4, lacunarity: r = 2, gain: i = .5, seed: a = 0, period: o = 0 } = {}) {
	let s = 1, c = 1, l = 0, d = 0;
	for (let f = 0; f < n; f++) l += s * u(e * c, t * c, a + f * 101, o ? o * c : 0), d += s, s *= i, c *= r;
	return l / d;
}
var f = [
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
], p = (e, t) => (f[(t & 3) << 2 | e & 3] + .5) / 16;
//#endregion
export { e as a, l as c, o as d, n as f, p as i, s as l, i as n, a as o, u as p, c as r, d as s, r as t, t as u };
