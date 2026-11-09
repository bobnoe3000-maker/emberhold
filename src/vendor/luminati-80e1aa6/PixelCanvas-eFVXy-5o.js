import { Et as e, Rn as t, Tt as n, ct as r, f as i, g as a, h as o, jn as s } from "./three.core-D9_Fol79.js";
import { a as c, i as l, s as u } from "./math-Du_SWpiD.js";
import { a as d, i as f } from "./own-rp3p7qEo.js";
//#region src/engine/pixel/PixelCanvas.js
var p = /* @__PURE__ */ new Map(), m = Object.freeze([
	0,
	0,
	0,
	0
]), h = Object.freeze([
	0,
	0,
	0,
	255
]), g = /^#|^[0-9a-f]+$/i, _ = /* @__PURE__ */ new Set();
function v(e) {
	if (e == null || e === "transparent") return m;
	if (Array.isArray(e)) return e.length === 4 ? e : [
		e[0],
		e[1],
		e[2],
		255
	];
	if (typeof e == "object") return [
		e.r,
		e.g,
		e.b,
		e.a ?? 255
	];
	let t = p.get(e);
	if (t) return t;
	if (typeof e == "number") {
		let n = Number.isFinite(e) ? e >>> 0 & 16777215 : 0;
		Number.isFinite(e) || y(e), t = Object.freeze([
			n >> 16 & 255,
			n >> 8 & 255,
			n & 255,
			255
		]);
	} else if (typeof e != "string") return y(e), h;
	else {
		let n = e.trim();
		if (g.test(n)) {
			n = n.replace("#", ""), (n.length === 3 || n.length === 4) && (n = [...n].map((e) => e + e).join(""));
			let e = parseInt(n.slice(0, 6), 16);
			t = Object.freeze([
				e >> 16 & 255,
				e >> 8 & 255,
				e & 255,
				n.length === 8 ? parseInt(n.slice(6, 8), 16) : 255
			]);
		} else {
			let r = f(a.NAMES, n.toLowerCase());
			r === void 0 ? (y(e), t = h) : t = Object.freeze([
				r >> 16 & 255,
				r >> 8 & 255,
				r & 255,
				255
			]);
		}
	}
	return p.set(e, t), t;
}
function y(e) {
	_.has(e) || (_.add(e), console.warn(`[PixelCanvas] unknown colour ${typeof e == "string" ? `"${e}"` : d(e)}; using black`));
}
function b(e) {
	let [n, r, i] = v(e);
	return new a().setRGB(n / 255, r / 255, i / 255, t);
}
function x(e, t, n) {
	let r = v(e), i = v(t);
	return [
		0,
		1,
		2,
		3
	].map((e) => Math.round(r[e] + (i[e] - r[e]) * n));
}
function S([e, t, n]) {
	e /= 255, t /= 255, n /= 255;
	let r = Math.max(e, t, n), i = Math.min(e, t, n), a = (r + i) / 2, o = 0, s = 0;
	if (r !== i) {
		let c = r - i;
		s = a > .5 ? c / (2 - r - i) : c / (r + i), o = r === e ? (t - n) / c + (t < n ? 6 : 0) : r === t ? (n - e) / c + 2 : (e - t) / c + 4, o *= 60;
	}
	return [
		o,
		s,
		a
	];
}
function C([e, t, n]) {
	e = (e % 360 + 360) % 360;
	let r = (1 - Math.abs(2 * n - 1)) * t, i = r * (1 - Math.abs(e / 60 % 2 - 1)), a = n - r / 2, o = 0, s = 0, c = 0;
	return e < 60 ? [o, s, c] = [
		r,
		i,
		0
	] : e < 120 ? [o, s, c] = [
		i,
		r,
		0
	] : e < 180 ? [o, s, c] = [
		0,
		r,
		i
	] : e < 240 ? [o, s, c] = [
		0,
		i,
		r
	] : e < 300 ? [o, s, c] = [
		i,
		0,
		r
	] : [o, s, c] = [
		r,
		0,
		i
	], [
		Math.round((o + a) * 255),
		Math.round((s + a) * 255),
		Math.round((c + a) * 255)
	];
}
function w(e, t) {
	let [n, r, i, a] = v(e), [o, s, l] = S([
		n,
		r,
		i
	]), u = (t < 0 ? 245 : 55) - o;
	u > 180 && (u -= 360), u < -180 && (u += 360), o += u * Math.min(1, Math.abs(t)) * .18, l = c(l + t * .42, 0, 1), s = c(s * (t < 0 ? 1 + -t * .15 : 1 - t * .25), 0, 1);
	let [d, f, p] = C([
		o,
		s,
		l
	]);
	return [
		d,
		f,
		p,
		a
	];
}
var T = class e {
	constructor(e, t, n = null) {
		this.width = e | 0, this.height = t | 0, this.data = new Uint8ClampedArray(this.width * this.height * 4), this.wrap = !1, this._canvas = null, n != null && this.fill(n);
	}
	static fromCanvas(t) {
		let n = new e(t.width, t.height), r = t.getContext("2d");
		return n.data.set(r.getImageData(0, 0, t.width, t.height).data), n;
	}
	clone() {
		let t = new e(this.width, this.height);
		return t.data.set(this.data), t.wrap = this.wrap, t;
	}
	_index(e, t) {
		if (e = Math.floor(e), t = Math.floor(t), this.wrap) e = (e % this.width + this.width) % this.width, t = (t % this.height + this.height) % this.height;
		else if (e < 0 || t < 0 || e >= this.width || t >= this.height) return -1;
		return (t * this.width + e) * 4;
	}
	inBounds(e, t) {
		return e >= 0 && t >= 0 && e < this.width && t < this.height;
	}
	get(e, t) {
		let n = this._index(e, t);
		if (n < 0) return [
			0,
			0,
			0,
			0
		];
		let r = this.data;
		return [
			r[n],
			r[n + 1],
			r[n + 2],
			r[n + 3]
		];
	}
	getAlpha(e, t) {
		let n = this._index(e, t);
		return n < 0 ? 0 : this.data[n + 3];
	}
	set(e, t, n) {
		let r = this._index(e, t);
		if (r < 0) return this;
		let i = v(n), a = this.data;
		return a[r] = i[0], a[r + 1] = i[1], a[r + 2] = i[2], a[r + 3] = i[3], this;
	}
	blend(e, t, n, r = 1) {
		let i = this._index(e, t);
		if (i < 0) return this;
		let a = v(n), o = a[3] / 255 * r;
		if (o <= 0) return this;
		let s = this.data, c = s[i + 3] / 255, l = o + c * (1 - o);
		if (l <= 0) return this;
		for (let e = 0; e < 3; e++) s[i + e] = (a[e] * o + s[i + e] * c * (1 - o)) / l;
		return s[i + 3] = l * 255, this;
	}
	scale(e, t, n) {
		let r = this._index(e, t);
		if (r < 0) return this;
		let i = this.data;
		return i[r] *= n, i[r + 1] *= n, i[r + 2] *= n, this;
	}
	fill(e) {
		let t = v(e);
		for (let e = 0; e < this.data.length; e += 4) this.data[e] = t[0], this.data[e + 1] = t[1], this.data[e + 2] = t[2], this.data[e + 3] = t[3];
		return this;
	}
	clear() {
		return this.data.fill(0), this;
	}
	rect(e, t, n, r, i) {
		for (let a = t; a < t + r; a++) for (let t = e; t < e + n; t++) this.set(t, a, i);
		return this;
	}
	strokeRect(e, t, n, r, i) {
		return this.hline(e, e + n - 1, t, i), this.hline(e, e + n - 1, t + r - 1, i), this.vline(e, t, t + r - 1, i), this.vline(e + n - 1, t, t + r - 1, i), this;
	}
	hline(e, t, n, r) {
		t < e && ([e, t] = [t, e]);
		for (let i = e; i <= t; i++) this.set(i, n, r);
		return this;
	}
	vline(e, t, n, r) {
		n < t && ([t, n] = [n, t]);
		for (let i = t; i <= n; i++) this.set(e, i, r);
		return this;
	}
	line(e, t, n, r, i) {
		e |= 0, t |= 0, n |= 0, r |= 0;
		let a = Math.abs(n - e), o = -Math.abs(r - t), s = e < n ? 1 : -1, c = t < r ? 1 : -1, l = a + o;
		for (; this.set(e, t, i), e !== n || t !== r;) {
			let n = 2 * l;
			n >= o && (l += o, e += s), n <= a && (l += a, t += c);
		}
		return this;
	}
	circle(e, t, n, r) {
		return this.ellipse(e, t, n, n, r);
	}
	ring(e, t, n, r) {
		let i = (n - .5) * (n - .5), a = (n + .5) * (n + .5);
		for (let o = Math.floor(t - n - 1); o <= Math.ceil(t + n + 1); o++) for (let s = Math.floor(e - n - 1); s <= Math.ceil(e + n + 1); s++) {
			let n = (s - e) * (s - e) + (o - t) * (o - t);
			n >= i && n <= a && this.set(s, o, r);
		}
		return this;
	}
	ellipse(e, t, n, r, i) {
		let a = (n + .5) * (n + .5), o = (r + .5) * (r + .5);
		for (let s = Math.floor(t - r - 1); s <= Math.ceil(t + r + 1); s++) for (let r = Math.floor(e - n - 1); r <= Math.ceil(e + n + 1); r++) {
			let n = r - e, c = s - t;
			n * n / a + c * c / o <= 1 && this.set(r, s, i);
		}
		return this;
	}
	polygon(e, t) {
		let n = Infinity, r = -Infinity;
		for (let [, t] of e) n = Math.min(n, t), r = Math.max(r, t);
		for (let i = Math.floor(n); i <= Math.ceil(r); i++) {
			let n = i + .5, r = [];
			for (let t = 0; t < e.length; t++) {
				let [i, a] = e[t], [o, s] = e[(t + 1) % e.length];
				(a <= n && s > n || s <= n && a > n) && r.push(i + (n - a) / (s - a) * (o - i));
			}
			r.sort((e, t) => e - t);
			for (let e = 0; e + 1 < r.length; e += 2) for (let n = Math.ceil(r[e] - .5); n <= Math.floor(r[e + 1] - .5); n++) this.set(n, i, t);
		}
		return this;
	}
	map(e) {
		for (let t = 0; t < this.height; t++) for (let n = 0; n < this.width; n++) {
			let r = e(n, t, this.get(n, t));
			r !== void 0 && this.set(n, t, r);
		}
		return this;
	}
	fillNoise(e, { scale: t = 4, seed: n = 0, octaves: r = 3, period: i = 0, dither: a = .5, bias: o = 0, mask: s = null } = {}) {
		let d = e.length;
		for (let f = 0; f < this.height; f++) for (let p = 0; p < this.width; p++) {
			if (s && !s(p, f)) continue;
			let m = u(p / this.width * t, f / this.height * t, {
				octaves: r,
				seed: n,
				period: i || 0
			}), h = c((m - .5) * 1.6 + .5 + o, 0, .9999) * d, g = (l(p, f) - .5) * a, _ = c(Math.floor(h + g), 0, d - 1);
			this.set(p, f, e[_]);
		}
		return this;
	}
	speckle(e, t, n, r = null) {
		for (let i = 0; i < this.height; i++) for (let a = 0; a < this.width; a++) (!r || r(a, i)) && n.next() < t && this.set(a, i, e);
		return this;
	}
	outline(e, { diagonals: t = !1, threshold: n = 128 } = {}) {
		let r = this.clone();
		r.wrap = !1;
		let i = t ? [
			[1, 0],
			[-1, 0],
			[0, 1],
			[0, -1],
			[1, 1],
			[1, -1],
			[-1, 1],
			[-1, -1]
		] : [
			[1, 0],
			[-1, 0],
			[0, 1],
			[0, -1]
		];
		for (let t = 0; t < this.height; t++) for (let a = 0; a < this.width; a++) r.getAlpha(a, t) >= n || i.some(([e, i]) => r.getAlpha(a + e, t + i) >= n) && this.set(a, t, e);
		return this;
	}
	blit(e, t, n, { flipX: r = !1, flipY: i = !1, alpha: a = 1 } = {}) {
		for (let o = 0; o < e.height; o++) for (let s = 0; s < e.width; s++) {
			let c = r ? e.width - 1 - s : s, l = i ? e.height - 1 - o : o, u = e.get(c, l);
			u[3] !== 0 && (u[3] === 255 && a === 1 ? this.set(t + s, n + o, u) : this.blend(t + s, n + o, u, a));
		}
		return this;
	}
	crop(t, n, r, i) {
		let a = new e(r, i);
		for (let e = 0; e < i; e++) for (let i = 0; i < r; i++) a.set(i, e, this.get(t + i, n + e));
		return a;
	}
	flippedX() {
		let t = new e(this.width, this.height);
		for (let e = 0; e < this.height; e++) for (let n = 0; n < this.width; n++) t.set(this.width - 1 - n, e, this.get(n, e));
		return t;
	}
	replaceColor(e, t) {
		let n = v(e);
		return this.map((e, r, i) => i[0] === n[0] && i[1] === n[1] && i[2] === n[2] && i[3] === n[3] ? t : void 0);
	}
	luminance(e, t) {
		let [n, r, i] = this.get(e, t);
		return (.2126 * n + .7152 * r + .0722 * i) / 255;
	}
	toCanvas() {
		return this._canvas || (this._canvas = document.createElement("canvas"), this._canvas.width = this.width, this._canvas.height = this.height), this._canvas.getContext("2d").putImageData(new ImageData(new Uint8ClampedArray(this.data), this.width, this.height), 0, 0), this._canvas;
	}
	toDataURL() {
		return this.toCanvas().toDataURL("image/png");
	}
	toTexture(e = {}) {
		return D(this.toCanvas(), e);
	}
}, E = {
	repeat: s,
	clamp: o,
	mirror: n
};
function D(n, { wrap: a = "repeat", mipmaps: o = !1, srgb: s = !0, anisotropy: c = 1, name: l = "" } = {}) {
	let u = new i(n);
	return u.name = l, u.wrapS = u.wrapT = E[a] ?? 1e3, u.magFilter = e, u.minFilter = o ? r : e, u.generateMipmaps = o, u.anisotropy = c, u.colorSpace = s ? t : "", u.needsUpdate = !0, u;
}
function O(e, t, n, { strength: r = 2, wrap: i = !0 } = {}) {
	let a = new T(e, t), o = (r, a) => (i ? (r = (r + e) % e, a = (a + t) % t) : (r = c(r, 0, e - 1), a = c(a, 0, t - 1)), n(r, a));
	for (let n = 0; n < t; n++) for (let t = 0; t < e; t++) {
		let e = (o(t + 1, n) - o(t - 1, n)) * r, i = (o(t, n + 1) - o(t, n - 1)) * r, s = -e, c = i, l = 1, u = Math.hypot(s, c, l);
		s /= u, c /= u, l /= u, a.set(t, n, [
			(s * .5 + .5) * 255,
			(c * .5 + .5) * 255,
			(l * .5 + .5) * 255,
			255
		]);
	}
	return a;
}
//#endregion
export { O as a, w as c, x as i, b as l, C as n, v as o, D as r, S as s, T as t };
