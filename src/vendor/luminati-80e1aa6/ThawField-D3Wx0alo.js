import { dr as e, g as t, ur as n } from "./three.core-D9_Fol79.js";
//#region src/engine/render/GlobalUniforms.js
var r = {
	uTime: { value: 0 },
	uNight: { value: 0 },
	uWind: { value: new n(1, .35) },
	uWindStrength: { value: 1 },
	uCameraYaw: { value: 0 },
	uCameraPosition: { value: new e() },
	uSunDirection: { value: new e(.4, .8, .45).normalize() },
	uSunColor: { value: new t(1, .9, .75) },
	uFogColor: { value: new t(.6, .65, .75) },
	uFogStart: { value: /* @__PURE__ */ new Float32Array(2) }
}, i = 8.75, a = .375, o = (e) => e - Math.floor(e);
function s(e, t) {
	let n = o(e * .1031), r = o(t * .1031), i = n, a = n * (r + 33.33) + r * (i + 33.33) + i * (n + 33.33);
	return n += a, r += a, i += a, o((n + r) * i);
}
function c(e, t) {
	let n = Math.floor(e), r = Math.floor(t), i = e - n, a = t - r;
	i = i * i * (3 - 2 * i), a = a * a * (3 - 2 * a);
	let o = s(n, r), c = s(n + 1, r);
	return o + (c - o) * i + (s(n, r + 1) - o + (o - c + s(n + 1, r + 1) - s(n, r + 1)) * i) * a;
}
function l(e, t) {
	return (c(e * .21, t * .21) * .65 + c(e * .53 + 7.1, t * .53 + 7.1) * .35 - .5) * 2.4;
}
var u = new class {
	constructor() {
		this.frozen = !1, this.active = !1, this.version = 0, this.rings = new Float32Array([
			0,
			0,
			-1,
			0,
			0,
			0,
			-1,
			0,
			0,
			0,
			-1,
			0,
			0,
			0,
			-1,
			0
		]), this.melt = 1, this.ice = 0, this.front = null, this._pass = /* @__PURE__ */ new Set(), this.points = [], this._ids = 0;
	}
	inside(e, t, n = 0) {
		if (!this.active) return i;
		let r = this.melt * i, a = this.rings, o = NaN;
		for (let s = 0; s < 16; s += 4) {
			let c = a[s + 2];
			c < 0 || (o !== o && (o = l(e, t)), r = Math.max(r, (c + n + o - Math.hypot(e - a[s], t - a[s + 1])) * Math.min(6, Math.max(1, i / .75 / Math.max(c, .01)))));
		}
		return r;
	}
	at(e, t) {
		let n = this.inside(e, t);
		return n <= 0 ? 0 : n >= 4.75 ? 1 : n / 4.75;
	}
	nearest(e, t, n = {
		x: 0,
		z: 0
	}) {
		let r = this.front;
		if (!r) return null;
		let i = Math.hypot(e - r.x, t - r.z) || 1;
		return n.x = r.x + (e - r.x) / i * r.r, n.z = r.z + (t - r.z) / i * r.r, n;
	}
	reached(e, t, n = 0) {
		return this.inside(e, t, n) >= a;
	}
	onPass(e) {
		return this._pass.add(e), () => this._pass.delete(e);
	}
	register(e, t, n = "") {
		let r = ++this._ids;
		return this.points.push({
			id: r,
			x: e,
			z: t,
			kind: n,
			passed: this.inside(e, t) >= a
		}), r;
	}
	pass(e) {
		e.passed = !0;
		for (let t of this._pass) t(e.x, e.z, e.kind);
	}
	reset(e, t) {
		this.active = e, this.frozen = e && t, this.rings.fill(0);
		for (let e = 2; e < 16; e += 4) this.rings[e] = -1;
		this.melt = +!this.frozen, this.front = null, this.points.length = 0, this.version++;
	}
}();
//#endregion
export { u as n, r, i as t };
