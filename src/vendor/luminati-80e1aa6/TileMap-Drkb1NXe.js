import { R as e, U as t, bt as n, c as r, l as i, mr as a, nr as o, pr as s, rr as c, wt as l } from "./three.core-CDiAvzro.js";
import { r as u } from "./Palette-D7TB3xJk.js";
import { a as d, c as f, f as p, l as m, p as h, s as g, u as _ } from "./math-Du_SWpiD.js";
import { r as v } from "./ThawField-BqwvXI8W.js";
import { n as y } from "./own-rp3p7qEo.js";
import { t as b } from "./PixelCanvas-BggARGih.js";
//#region node_modules/three/examples/jsm/utils/BufferGeometryUtils.js
function x(e, t = !1) {
	let n = e[0].index !== null, r = new Set(Object.keys(e[0].attributes)), a = new Set(Object.keys(e[0].morphAttributes)), o = {}, s = {}, c = e[0].morphTargetsRelative, l = new i(), u = 0;
	for (let i = 0; i < e.length; ++i) {
		let d = e[i], f = 0;
		if (n !== (d.index !== null)) return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index " + i + ". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."), null;
		for (let e in d.attributes) {
			if (!r.has(e)) return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index " + i + ". All geometries must have compatible attributes; make sure \"" + e + "\" attribute exists among all geometries, or in none of them."), null;
			o[e] === void 0 && (o[e] = []), o[e].push(d.attributes[e]), f++;
		}
		if (f !== r.size) return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index " + i + ". Make sure all geometries have the same number of attributes."), null;
		if (c !== d.morphTargetsRelative) return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index " + i + ". .morphTargetsRelative must be consistent throughout all geometries."), null;
		for (let e in d.morphAttributes) {
			if (!a.has(e)) return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index " + i + ".  .morphAttributes must be consistent throughout all geometries."), null;
			s[e] === void 0 && (s[e] = []), s[e].push(d.morphAttributes[e]);
		}
		if (t) {
			let e;
			if (n) e = d.index.count;
			else if (d.attributes.position !== void 0) e = d.attributes.position.count;
			else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index " + i + ". The geometry must have either an index or a position attribute"), null;
			l.addGroup(u, e, i), u += e;
		}
	}
	if (n) {
		let t = 0, n = [];
		for (let r = 0; r < e.length; ++r) {
			let i = e[r].index;
			for (let e = 0; e < i.count; ++e) n.push(i.getX(e) + t);
			t += e[r].attributes.position.count;
		}
		l.setIndex(n);
	}
	for (let e in o) {
		let t = S(o[e]);
		if (!t) return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the " + e + " attribute."), null;
		l.setAttribute(e, t);
	}
	for (let e in s) {
		let t = s[e][0].length;
		if (t !== 0) {
			l.morphAttributes = l.morphAttributes || {}, l.morphAttributes[e] = [];
			for (let n = 0; n < t; ++n) {
				let t = [];
				for (let r = 0; r < s[e].length; ++r) t.push(s[e][r][n]);
				let r = S(t);
				if (!r) return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the " + e + " morphAttribute."), null;
				l.morphAttributes[e].push(r);
			}
		}
	}
	return l;
}
function S(e) {
	let t, n, i, a = -1, o = 0;
	for (let r = 0; r < e.length; ++r) {
		let s = e[r];
		if (t === void 0 && (t = s.array.constructor), t !== s.array.constructor) return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."), null;
		if (n === void 0 && (n = s.itemSize), n !== s.itemSize) return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."), null;
		if (i === void 0 && (i = s.normalized), i !== s.normalized) return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."), null;
		if (a === -1 && (a = s.gpuType), a !== s.gpuType) return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."), null;
		o += s.count * n;
	}
	let s = new t(o), c = new r(s, n, i), l = 0;
	for (let t = 0; t < e.length; ++t) {
		let r = e[t];
		if (r.isInterleavedBufferAttribute) {
			let e = l / n;
			for (let t = 0, i = r.count; t < i; t++) for (let i = 0; i < n; i++) {
				let n = r.getComponent(t, i);
				c.setComponent(t + e, i, n);
			}
		} else s.set(r.array, l);
		l += r.count * n;
	}
	return a !== void 0 && (c.gpuType = a), c;
}
function C(e, t) {
	if (t === 0) return console.warn("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Geometry already defined as triangles."), e;
	if (t === 2 || t === 1) {
		let n = e.getIndex();
		if (n === null) {
			let t = [], r = e.getAttribute("position");
			if (r !== void 0) {
				for (let e = 0; e < r.count; e++) t.push(e);
				e.setIndex(t), n = e.getIndex();
			} else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Undefined position attribute. Processing not possible."), e;
		}
		let r = n.count - 2, i = [];
		if (t === 2) for (let e = 1; e <= r; e++) i.push(n.getX(0)), i.push(n.getX(e)), i.push(n.getX(e + 1));
		else for (let e = 0; e < r; e++) e % 2 == 0 ? (i.push(n.getX(e)), i.push(n.getX(e + 1)), i.push(n.getX(e + 2))) : (i.push(n.getX(e + 2)), i.push(n.getX(e + 1)), i.push(n.getX(e)));
		return i.length / 3 !== r && console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unable to generate correct amount of triangles."), e.setIndex(i), e.clearGroups(), e;
	}
	return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unknown draw mode:", t), e;
}
function w(e, t = Math.PI / 3) {
	let n = e.index ? e.toNonIndexed() : e, i = n.attributes.position, a = i.count, o;
	if (i.isBufferAttribute === !0 && i.itemSize === 3 && i.normalized === !1) o = i.array;
	else {
		o = new Float64Array(a * 3);
		for (let e = 0; e < a; e++) o[3 * e + 0] = i.getX(e), o[3 * e + 1] = i.getY(e), o[3 * e + 2] = i.getZ(e);
	}
	let s = Math.cos(t), c = (1 + 1e-10) * 100, l = a / 3, u = new Float64Array(l * 3);
	for (let e = 0; e < l; e++) {
		let t = 9 * e, n = o[t + 0], r = o[t + 1], i = o[t + 2], a = o[t + 3], s = o[t + 4], c = o[t + 5], l = o[t + 6], d = o[t + 7], f = o[t + 8], p = l - a, m = d - s, h = f - c, g = n - a, _ = r - s, v = i - c, y = m * v - h * _, b = h * g - p * v, x = p * _ - m * g, S = 1 / (Math.sqrt(y * y + b * b + x * x) || 1);
		u[3 * e + 0] = y * S, u[3 * e + 1] = b * S, u[3 * e + 2] = x * S;
	}
	let d = new Int32Array(a), f = new Float64Array(a * 3), p = 1;
	for (; p < a * 2;) p <<= 1;
	let m = p - 1, h = new Int32Array(p), g = 0;
	for (let e = 0; e < a; e++) {
		let t = 3 * e, n = Math.trunc(o[t + 0] * c), r = Math.trunc(o[t + 1] * c), i = Math.trunc(o[t + 2] * c), a = (Math.imul(n, 73856093) ^ Math.imul(r, 19349663) ^ Math.imul(i, 83492791)) & m;
		for (;;) {
			let t = h[a];
			if (t === 0) {
				let t = 3 * g;
				f[t + 0] = n, f[t + 1] = r, f[t + 2] = i, h[a] = g + 1, d[e] = g++;
				break;
			}
			let o = 3 * (t - 1);
			if (f[o + 0] === n && f[o + 1] === r && f[o + 2] === i) {
				d[e] = t - 1;
				break;
			}
			a = a + 1 & m;
		}
	}
	let _ = new Int32Array(g + 1);
	for (let e = 0; e < a; e++) _[d[e] + 1]++;
	for (let e = 0; e < g; e++) _[e + 1] += _[e];
	let v = new Int32Array(a), y = _.slice(0, g);
	for (let e = 0; e < l; e++) {
		let t = 3 * e;
		v[y[d[t + 0]]++] = e, v[y[d[t + 1]]++] = e, v[y[d[t + 2]]++] = e;
	}
	let b = new Float32Array(a * 3);
	for (let e = 0; e < l; e++) {
		let t = 3 * e, n = u[t + 0], r = u[t + 1], i = u[t + 2];
		for (let e = 0; e < 3; e++) {
			let a = t + e, o = d[a], c = 0, l = 0, f = 0;
			for (let e = _[o], t = _[o + 1]; e < t; e++) {
				let t = 3 * v[e], a = u[t + 0], o = u[t + 1], d = u[t + 2];
				n * a + r * o + i * d > s && (c += a, l += o, f += d);
			}
			let p = 1 / (Math.sqrt(c * c + l * l + f * f) || 1);
			b[3 * a + 0] = c * p, b[3 * a + 1] = l * p, b[3 * a + 2] = f * p;
		}
	}
	return n.setAttribute("normal", new r(b, 3, !1)), n;
}
//#endregion
//#region src/engine/utils/steps.js
function T(e) {
	let t = e.next();
	for (; !t.done;) t = e.next();
	return t.value;
}
//#endregion
//#region src/engine/world/SpatialSplit.js
function E(e, t) {
	return T(D(e, t));
}
function* D(e, { x: t, z: n, weight: r = () => 1, maxWeight: i = Infinity, maxExtent: a = Infinity, minWeight: o = 0 }) {
	if (!e.length) return [];
	let s = e.length, c = new Float64Array(s), l = new Float64Array(s), u = new Float64Array(s);
	for (let i = 0; i < s; i++) c[i] = t(e[i]), l[i] = n(e[i]), u[i] = Math.max(0, r(e[i]) || 0);
	let d = Array(s);
	for (let e = 0; e < s; e++) d[e] = e;
	yield;
	let f = [], p = [d];
	for (; p.length;) {
		let e = p.pop(), t = 0;
		for (let n of e) t += u[n];
		let n = Infinity, r = -Infinity, s = Infinity, d = -Infinity;
		for (let t of e) c[t] < n && (n = c[t]), c[t] > r && (r = c[t]), l[t] < s && (s = l[t]), l[t] > d && (d = l[t]);
		let m = Math.max(r - n, d - s) > a && t > o;
		if (e.length < 2 || !(t > i || m)) {
			f.push(e);
			continue;
		}
		let h = O(e, r - n >= d - s ? c : l), g = 0, _ = 1;
		for (let e = 0; e < h.length - 1 && (g += u[h[e]], _ = e + 1, !(g >= t / 2)); e++);
		p.push(h.slice(_), h.slice(0, _)), yield;
	}
	let m = [];
	for (let t of f) m.push(Array.from(Int32Array.from(t).sort(), (t) => e[t])), yield;
	return m;
}
function O(e, t) {
	let n = e.length, r = Int32Array.from(e), i = new Float64Array(n);
	for (let a = 0; a < n; a++) {
		let n = t[r[a]];
		if (n !== n) return e.slice().sort((e, n) => t[e] - t[n] || e - n);
		i[a] = n;
	}
	let a = [0, n - 1];
	for (; a.length;) {
		let e = a.pop(), t = a.pop();
		for (; e - t > 12;) {
			let n = t + e >>> 1, o, s;
			(i[n] < i[t] || i[n] === i[t] && r[n] < r[t]) && (o = i[n], i[n] = i[t], i[t] = o, s = r[n], r[n] = r[t], r[t] = s), (i[e] < i[t] || i[e] === i[t] && r[e] < r[t]) && (o = i[e], i[e] = i[t], i[t] = o, s = r[e], r[e] = r[t], r[t] = s), (i[e] < i[n] || i[e] === i[n] && r[e] < r[n]) && (o = i[e], i[e] = i[n], i[n] = o, s = r[e], r[e] = r[n], r[n] = s);
			let c = i[n], l = r[n], u = t, d = e;
			for (; u <= d;) {
				for (; i[u] < c || i[u] === c && r[u] < l;) u++;
				for (; i[d] > c || i[d] === c && r[d] > l;) d--;
				u <= d && (o = i[u], i[u] = i[d], i[d] = o, s = r[u], r[u] = r[d], r[d] = s, u++, d--);
			}
			d - t < e - u ? (a.push(u, e), e = d) : (a.push(t, d), t = u);
		}
		for (let n = t + 1; n <= e; n++) {
			let e = i[n], a = r[n], o = n - 1;
			for (; o >= t && (i[o] > e || i[o] === e && r[o] > a);) i[o + 1] = i[o], r[o + 1] = r[o], o--;
			i[o + 1] = e, r[o + 1] = a;
		}
	}
	return Array.from(r);
}
function k(e, t) {
	let n = /* @__PURE__ */ new Map(), r = [];
	for (let i of e) {
		let e = t(i);
		if (e == null) {
			r.push(i);
			continue;
		}
		let a = n.get(e);
		a || n.set(e, a = []), a.push(i);
	}
	for (let e of n.values()) r.push(...e);
	return r;
}
function A(e, t, n, r) {
	let i = r.filter((t) => e.getAttribute(t)), a = [], o = 0, s = null;
	for (let r = 0; r < t.length; r++) {
		let c = n[r] ?? null;
		c !== null && (s && s.tag === c && s.start + s.count === o ? s.count += t[r] : a.push(s = {
			tag: c,
			geometry: e,
			start: o,
			count: t[r],
			attributes: i
		})), o += t[r];
	}
	return a;
}
var ee = class {
	constructor() {
		this._byTag = /* @__PURE__ */ new Map(), this._hidden = /* @__PURE__ */ new Set();
	}
	add(e) {
		for (let t of e ?? []) {
			if (!(t.count > 1)) continue;
			let e = [];
			for (let n of t.attributes) {
				let i = t.geometry.getAttribute(n);
				if (!(i instanceof r)) continue;
				let a = i.itemSize;
				e.push({
					attr: i,
					saved: i.array.slice(t.start * a, (t.start + t.count) * a)
				});
			}
			if (!e.length) continue;
			let n = this._byTag.get(t.tag);
			n || this._byTag.set(t.tag, n = []);
			let i = {
				start: t.start,
				count: t.count,
				attrs: e
			};
			n.push(i), this._hidden.has(t.tag) && this._write(i, !0, !0);
		}
	}
	isHidden(e) {
		return this._hidden.has(e);
	}
	info(e) {
		let t = this._byTag.get(e) ?? [];
		return {
			ranges: t.length,
			vertices: t.reduce((e, t) => e + t.count, 0)
		};
	}
	setHidden(e, t, { upload: n = !0 } = {}) {
		if (this._hidden.has(e) === t) return 0;
		t ? this._hidden.add(e) : this._hidden.delete(e);
		let r = 0;
		for (let i of this._byTag.get(e) ?? []) this._write(i, t, n), r += i.count;
		return r;
	}
	_write(e, t, n) {
		for (let { attr: r, saved: i } of e.attrs) {
			let a = r.array, o = r.itemSize, s = e.start * o, c = s + e.count * o;
			if (t) for (let e = o; e < c - s;) {
				let t = Math.min(e, c - s - e);
				a.copyWithin(s + e, s, s + t), e += t;
			}
			else a.set(i, s);
			n && r.addUpdateRange(s, c - s), r.needsUpdate = !0;
		}
	}
	clear() {
		this._byTag.clear(), this._hidden.clear();
	}
};
function j(e) {
	return e ? (e.index ? e.index.count : e.attributes.position?.count ?? 0) / 3 : 0;
}
function M(e, { pad: t = 0, only: n = null } = {}) {
	e.updateWorldMatrix(!0, !1);
	let r;
	e.isInstancedMesh ? (e.boundingBox || e.computeBoundingBox(), r = e.boundingBox) : (e.geometry.boundingBox || e.geometry.computeBoundingBox(), r = e.geometry.boundingBox);
	let i = r.clone().applyMatrix4(e.matrixWorld);
	return t && i.expandByScalar(t), e.userData.cullBox = i, e.frustumCulled = !0, e.intersectsFrustum = function(e) {
		return n && !n(e) ? !1 : e.intersectsBox(this.userData.cullBox);
	}, e;
}
//#endregion
//#region src/engine/world/TileMap.js
var N = 4, P = u / N, F = 1, I = 4, L = .35, R = .4, z = 1e-4, te = 311573446, B = 2, ne = 16, V = 256, H = {
	N: {
		key: "N",
		dx: 0,
		dz: -1,
		nx: 0,
		nz: -1,
		rx: -1,
		rz: 0,
		idx: 0
	},
	E: {
		key: "E",
		dx: 1,
		dz: 0,
		nx: 1,
		nz: 0,
		rx: 0,
		rz: -1,
		idx: 1
	},
	S: {
		key: "S",
		dx: 0,
		dz: 1,
		nx: 0,
		nz: 1,
		rx: 1,
		rz: 0,
		idx: 2
	},
	W: {
		key: "W",
		dx: -1,
		dz: 0,
		nx: -1,
		nz: 0,
		rx: 0,
		rz: 1,
		idx: 3
	}
}, U = [
	"N",
	"E",
	"S",
	"W"
], W = {
	N: "S",
	S: "N",
	E: "W",
	W: "E"
}, re = /* @__PURE__ */ new Set([
	"grass",
	"grass_dark",
	"grass_flowers",
	"dirt",
	"sand",
	"riverbed",
	"moss_stone",
	"dry_grass",
	"arid_dirt",
	"cracked_earth",
	"scree",
	"scorched",
	"ash",
	"basalt"
]), G = /* @__PURE__ */ new Set([
	"grass",
	"grass_dark",
	"grass_flowers",
	"dry_grass"
]), K = /* @__PURE__ */ new Set([
	"dirt",
	"dirt_path",
	"cobblestone",
	"stone_tiles",
	"sand",
	"farmland",
	"moss_stone",
	"arid_dirt",
	"cracked_earth",
	"red_sand",
	"scree",
	"flagstone",
	"scorched"
]), q = {
	grass_dark: 3,
	grass: 2,
	dry_grass: 2,
	grass_flowers: 1
};
function ie({ organic: e = [], grass: t = [], receivers: n = [], priority: r = {} }) {
	for (let t of e) re.add(t);
	for (let e of t) G.add(e);
	for (let e of n) K.add(e);
	Object.assign(q, r);
}
var ae = [], oe = [];
for (let e = 0; e < 8; e++) ae.push(Math.cos(e * Math.PI / 4)), oe.push(Math.sin(e * Math.PI / 4));
var se = [
	.22,
	.45,
	.8,
	1.25
], ce = 1.75, J = 8, le = [], ue = [];
for (let e = 0; e < J; e++) le.push(Math.cos(e * Math.PI * 2 / J)), ue.push(Math.sin(e * Math.PI * 2 / J));
var Y = 64, X = 48, Z = {
	stripA: 1,
	stripB: 9,
	brim: 17,
	skirt: 22,
	corner: 33
}, de = 10, fe = 6, Q = 6 / 16, $ = 3 / 16, pe = 7 / 16, me = 1 / 16, he = "\nuniform vec2 lmUnits;\nuniform float lmVarSeed;\nfloat lmVHash(vec2 p) {\n  vec3 p3 = fract(vec3(p.xyx) * 0.1031);\n  p3 += dot(p3, p3.yzx + 33.33);\n  return fract((p3.x + p3.y) * p3.z);\n}\nfloat lmVNoise(vec2 p) {\n  vec2 i = floor(p);\n  vec2 f = fract(p);\n  vec2 u = f * f * (3.0 - 2.0 * f);\n  return mix(mix(lmVHash(i), lmVHash(i + vec2(1.0, 0.0)), u.x), mix(lmVHash(i + vec2(0.0, 1.0)), lmVHash(i + vec2(1.0, 1.0)), u.x), u.y);\n}\nvec2 lmVApply(vec2 d, float r, float fl) {\n  d.x = fl > 0.5 ? -d.x : d.x;\n  return r < 0.5 ? d : r < 1.5 ? vec2(-d.y, d.x) : r < 2.5 ? -d : vec2(d.y, -d.x);\n}\nvec2 lmVariedUv(vec2 uv, out mat2 A) {\n  vec2 w = vec2(uv.x * lmUnits.x, -uv.y * lmUnits.y);\n  vec2 pw = (floor(w * 16.0) + 0.5) / 16.0;\n  vec2 o = vec2(lmVNoise(pw * 1.35 + lmVarSeed), lmVNoise(pw * 1.35 - lmVarSeed + 41.3)) - 0.5;\n  o += (vec2(lmVNoise(pw * 4.1 + 7.7), lmVNoise(pw * 4.1 - 3.1)) - 0.5) * 0.35;\n  vec2 cell = floor(pw + o * 0.95);\n  float h = lmVHash(cell + vec2(lmVarSeed * 0.37, 11.7));\n  float r = floor(h * 4.0);\n  float fl = step(0.5, fract(h * 7.31));\n  vec2 c = cell + 0.5;\n  vec2 w2 = c + lmVApply(w - c, r, fl);\n  vec2 eu = lmVApply(vec2(1.0, 0.0), r, fl);\n  vec2 ev = lmVApply(vec2(0.0, -1.0), r, fl);\n  A = mat2(vec2(eu.x, -eu.y), vec2(ev.x, -ev.y));\n  return vec2(w2.x / lmUnits.x, -w2.y / lmUnits.y);\n}\n", ge = "\n#ifdef USE_MAP\n  mat2 lmA;\n  vec2 lmUv = lmVariedUv( vMapUv, lmA );\n  vec2 lmGx = lmA * dFdx( vMapUv );\n  vec2 lmGy = lmA * dFdy( vMapUv );\n  vec4 sampledDiffuseColor = textureGrad( map, lmUv, lmGx, lmGy );\n  diffuseColor *= sampledDiffuseColor;\n#endif\n", _e = "\n#if defined( USE_NORMALMAP_TANGENTSPACE ) && defined( USE_MAP )\n  vec3 mapN = textureGrad( normalMap, lmUv, lmGx, lmGy ).xyz * 2.0 - 1.0;\n  mapN.xy = transpose( lmA ) * mapN.xy;\n  mapN.xy *= normalScale;\n  normal = normalize( tbn * mapN );\n#elif defined( USE_NORMALMAP_TANGENTSPACE )\n  vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;\n  mapN.xy *= normalScale;\n  normal = normalize( tbn * mapN );\n#endif\n", ve = "\n#ifdef USE_ALPHAMAP\n  vec4 lmDecalMask = texture2D( alphaMap, vAlphaMapUv );\n  diffuseColor.a *= lmDecalMask.g;\n  diffuseColor.rgb *= lmDecalMask.r * ( 255.0 / 170.0 );\n#endif\n", ye = "\nuniform float uLmBounce;\nuniform vec3 uSunColor;\nuniform vec3 uSunDirection;\n", be = "\n#include <lights_fragment_maps>\n{\n  vec3 lmWN = inverseTransformDirection( normalize( vNormal ), viewMatrix );\n  float lmSide = clamp( 1.0 - abs( lmWN.y ), 0.0, 1.0 );\n  irradiance += uSunColor * ( max( uSunDirection.y, 0.0 ) * 0.44 * uLmBounce * lmSide );\n}\n";
function xe(e, t) {
	return .0015 + .0025 * (q[e] ?? 0) + 5e-4 * t;
}
function Se(e) {
	if (!e) return 0;
	let t = e.charCodeAt(0);
	return t >= 48 && t <= 57 ? t - 48 : t >= 97 && t <= 122 ? t - 87 : t >= 65 && t <= 90 ? t - 55 : 0;
}
function Ce(e, t, n, r, i) {
	let a = Se(n), o = !!t.water;
	return {
		char: e,
		type: t,
		level: a,
		h: a * u,
		walkable: t.walkable ?? !o,
		i: r,
		j: i,
		water: o,
		stairs: y(H, t.stairs) ? t.stairs : null,
		blocked: !1,
		waterSurface: null,
		waterSource: null
	};
}
function we(e, t, n) {
	return e === "N" ? 1 - n : e === "S" ? n : e === "E" ? t : 1 - t;
}
var Te = class {
	constructor(e = !1) {
		this.pos = [], this.nrm = [], this.uv = [], this.uv1 = e ? [] : null, this.col = [], this.idx = [], this.count = 0;
	}
	v(e, t, n, r, i, a, o, s, c, l, u, d = 0, f = 0) {
		return this.pos.push(e, t, n), this.nrm.push(r, i, a), this.uv.push(o, s), this.col.push(c, l, u), this.uv1 && this.uv1.push(d, f), this.count++;
	}
	quad(e, t, n, r) {
		this.idx.push(e, t, n, e, n, r);
	}
	quadN(e, t, n, r, i, a, o) {
		let s = this.pos, c = s[e * 3], l = s[e * 3 + 1], u = s[e * 3 + 2], d = s[t * 3] - c, f = s[t * 3 + 1] - l, p = s[t * 3 + 2] - u, m = s[n * 3] - c, h = s[n * 3 + 1] - l, g = s[n * 3 + 2] - u, _ = f * g - p * h, v = p * m - d * g, y = d * h - f * m;
		_ * i + v * a + y * o >= 0 ? this.idx.push(e, t, n, e, n, r) : this.idx.push(e, n, t, e, r, n);
	}
	toGeometry() {
		let t = new i();
		return t.setAttribute("position", new e(this.pos, 3)), t.setAttribute("normal", new e(this.nrm, 3)), t.setAttribute("uv", new e(this.uv, 2)), this.uv1 && t.setAttribute("uv1", new e(this.uv1, 2)), t.setAttribute("color", new e(this.col, 3)), t.setIndex(this.count > 65535 ? new c(this.idx, 1) : new o(this.idx, 1)), t.computeBoundingBox(), t.computeBoundingSphere(), t;
	}
};
function Ee(e = 1) {
	let t = new b(Y, X, [
		0,
		0,
		0,
		255
	]), n = (e, n, r) => t.set(e, n, [
		d(Math.round(r), 0, 255),
		255,
		0,
		255
	]), r = (t, n, r = 0) => f(t, n, e + r), i = (t, n, r) => h(t / 8, n, e + r, 8);
	for (let e = 0; e < 2; e++) {
		let t = e ? Z.stripB : Z.stripA, a = new Int8Array(Y), o = new Uint8Array(Y);
		for (let t = 0; t < Y; t++) {
			let n = 2 + Math.round(i(t, e * 7.3, 11) * 2.4);
			r(t, e, 3) < .3 && (o[t] = 1, n += 1 + +(r(t, e, 5) < .45)), a[t] = d(n, 1, 6);
		}
		for (let i = 0; i < Y; i++) {
			let s = a[i], c = Math.max(a[(i + Y - 1) % Y], a[(i + 1) % Y]);
			for (let a = 0; a < s; a++) {
				let l = 170;
				a === s - 1 ? l = o[i] && s > c ? 212 : 136 : a === s - 2 ? l = o[i] && s > c ? 192 : 158 : a === 0 && r(i, e, 9) < .2 && (l = 185), n(i, t + a, l);
			}
		}
	}
	for (let e = 0; e < Y; e++) {
		n(e, Z.brim, r(e, 1, 21) < .25 ? 196 : 180);
		let t = r(e, 2, 21) < .8;
		t && n(e, Z.brim + 1, 164), t && r(e, 3, 21) < .42 && n(e, Z.brim + 2, 140);
	}
	for (let e = 0; e < Y; e++) {
		let t = 2 + Math.round(i(e, 3.7, 31) * 2.6), a = r(e, 4, 31) < .34;
		a && (t += 1 + +(r(e, 5, 31) < .5) + +(r(e, 6, 31) < .25)), t = d(t, 2, 7);
		for (let i = 0; i < t; i++) {
			let o = _(178, 118, i / 6);
			i === t - 1 ? o = a ? 150 : 88 : i === 0 ? o = 190 : r(e, i, 37) < .12 && (o += 22), n(e, Z.skirt + i, o);
		}
	}
	let a = Z.corner;
	for (let i = 0; i < fe; i++) {
		let o = i * de + 1, s = 3.4 + r(i, 7, 41) * 2;
		for (let t = 0; t < 8; t++) for (let r = 0; r < 8; r++) {
			let c = Math.atan2(t + .5, r + .5), l = (f(Math.floor(c * 6), i, e + 43) - .5) * 2.2, u = Math.hypot(r + .5, t + .5), d = s + l;
			u < d && n(o + r, a + t, u > d - 1 ? 136 : 170);
		}
		for (let e = 0; e < 8; e++) t.set(o + e, a - 1, t.get(o + e, a));
		for (let e = -1; e < 8; e++) t.set(o - 1, a + e, t.get(o, a + Math.max(0, e)));
	}
	for (let e of [
		Z.stripA,
		Z.stripB,
		Z.brim,
		Z.skirt
	]) for (let n = 0; n < Y; n++) t.set(n, e - 1, t.get(n, e));
	return t;
}
var De = class {
	constructor(e, n = {}) {
		let { textures: r, seed: i = e?.name == null ? te : m(String(e.name)), baseDepth: a = 2, chunkSize: o = 32, uvVariation: s = !0, fringes: c = !0, overhangs: l = !0, aoStrength: d = 1.1, tintStrength: f = 1, sideVariation: p = !1, wallBounce: h = 1, deferBuild: g = !1 } = n;
		if (!r) throw Error("TileMap: opts.textures (TextureLibrary) is required");
		this.textures = r, this.map = e, this.name = e.name ?? "", this.seed = i >>> 0, this.options = {
			baseDepth: a,
			chunkSize: o,
			uvVariation: s,
			fringes: c,
			overhangs: l,
			aoStrength: d,
			tintStrength: f,
			sideVariation: p
		}, this._bounceUniform = { value: h };
		let _ = e.tiles ?? [], v = e.heights ?? [];
		this.depth = _.length, this.width = _.reduce((e, t) => Math.max(e, t.length), 0), this.bounds = {
			minX: 0,
			maxX: this.width,
			minZ: 0,
			maxZ: this.depth
		}, this._tiles = Array(this.width * this.depth).fill(null);
		let y = e.legend ?? {}, b = /* @__PURE__ */ new Set(), x = Infinity, S = -Infinity;
		for (let e = 0; e < this.depth; e++) {
			let t = _[e], n = v[e] ?? "";
			for (let r = 0; r < this.width; r++) {
				let i = t[r] ?? " ", a = y[i];
				if (!a) {
					i !== " " && !b.has(i) && (b.add(i), console.warn(`[TileMap] legend has no entry for "${i}" (treated as void)`));
					continue;
				}
				if (a.void) continue;
				let o = Ce(i, a, n[r], r, e), s = o.h;
				this._tiles[e * this.width + r] = o, x = Math.min(x, s), S = Math.max(S, s + (o.stairs ? u : 0));
			}
		}
		Number.isFinite(x) || (x = 0, S = 0), this.minHeight = x, this.maxHeight = S, this.baseY = x - a, this.waterLevel = e.waterLevel ?? R;
		for (let e of this._tiles) {
			if (!e || !e.water) continue;
			let t = this._computeWaterSurface(e, this.waterLevel);
			e.waterSurface = t.level, e.waterSource = t.source;
		}
		this.colliders = [], this._cgrid = null, this._cgridDirty = !0, this.walkSurfaces = [], this.object = new t(), this.object.name = `TileMap${this.name ? `:${this.name}` : ""}`, this._materials = /* @__PURE__ */ new Map(), this._builders = /* @__PURE__ */ new Map(), this._maskTexture = null, this._tmpPush = {
			x: 0,
			z: 0
		}, this._loose = 0, this._tmpUV = {
			u: 0,
			v: 0
		}, this._tmpTint = [
			1,
			1,
			1
		], g || this._build();
	}
	tileAt(e, t) {
		return e = Math.floor(e), t = Math.floor(t), e >= 0 && t >= 0 && e < this.width && t < this.depth ? this._tiles[t * this.width + e] : null;
	}
	worldToTile(e, t, n = {
		i: 0,
		j: 0
	}) {
		return n.i = Math.floor(e), n.j = Math.floor(t), n;
	}
	tileCenter(e, t, n = new a()) {
		let r = e + .5, i = t + .5;
		return n.set(r, this.getHeight(r, i), i);
	}
	forEachTile(e) {
		for (let t = 0; t < this.depth; t++) for (let n = 0; n < this.width; n++) {
			let r = this._tiles[t * this.width + n];
			r && e(n, t, r);
		}
	}
	getHeight(e, t) {
		let n = this._walkHeight(e, t);
		if (n !== null) return n;
		let r = Math.floor(e), i = Math.floor(t), a = this.tileAt(r, i);
		return a ? a.stairs ? this._stairRamp(a, e - r, t - i) : a.h : this.baseY;
	}
	getWaterSurface(e, t) {
		let n = this.tileAt(Math.floor(e), Math.floor(t));
		return n && n.water ? n.waterSurface : null;
	}
	waterSurfaceOf(e, t = this.waterLevel) {
		return this._computeWaterSurface(e, t).level;
	}
	_computeWaterSurface(e, t) {
		let n = e.type;
		return typeof n.waterLevel == "number" ? {
			level: n.waterLevel,
			source: "legend"
		} : typeof n.waterDepth == "number" ? {
			level: e.h + n.waterDepth,
			source: "legend"
		} : t > e.h + .02 ? {
			level: t,
			source: "global"
		} : {
			level: e.h + L,
			source: "auto"
		};
	}
	_stairRamp(e, t, n) {
		let r = we(e.stairs, t, n);
		return d(e.h + P * .5 + r * u, e.h, e.h + u);
	}
	_topAt(e, t, n) {
		if (!e.stairs) return e.h;
		let r = Math.min(3, Math.floor(we(e.stairs, t, n) * N));
		return e.h + (r + 1) * P;
	}
	_surface(e, t) {
		let n = Math.floor(e), r = Math.floor(t), i = this.tileAt(n, r);
		return i ? this._topAt(i, e - n, t - r) : this.baseY;
	}
	_walkHeight(e, t) {
		let n = this.walkSurfaces, r = null;
		for (let i = 0; i < n.length; i++) {
			let a = n[i];
			e >= a.minX && e <= a.maxX && t >= a.minZ && t <= a.maxZ && (r === null || a.y > r) && (r = a.y);
		}
		return r;
	}
	isWalkable(e, t) {
		if (e < 0 || t < 0 || e > this.width || t > this.depth) return !1;
		if (this._walkHeight(e, t) === null) {
			let n = this.tileAt(Math.floor(e), Math.floor(t));
			if (!n || !n.walkable) return !1;
		}
		return !this._pointInCollider(e, t);
	}
	addCollider(e) {
		return e && !this.colliders.includes(e) && (this.colliders.push(e), this._cgridDirty = !0), e;
	}
	removeCollider(e) {
		let t = this.colliders.indexOf(e);
		t >= 0 && (this.colliders.splice(t, 1), this._cgridDirty = !0);
	}
	collidersChanged() {
		this._cgridDirty = !0;
	}
	queryColliders(e, t, n, r, i = []) {
		i.length = 0;
		let a = this.colliders, o = this._colliderGrid();
		if (!o) {
			for (let e = 0; e < a.length; e++) i.push(a[e]);
			return i;
		}
		let s = ++o.stamp, c = o.scratch;
		c.length = 0;
		let l = Math.max(0, Math.floor((e - o.ox) / B)), u = Math.min(o.nx - 1, Math.floor((n - o.ox) / B)), d = Math.max(0, Math.floor((t - o.oz) / B)), f = Math.min(o.nz - 1, Math.floor((r - o.oz) / B));
		for (let e = d; e <= f; e++) for (let t = l; t <= u; t++) {
			let n = o.cells[e * o.nx + t];
			n && this._collectIndices(o, n, s, c);
		}
		this._collectIndices(o, o.always, s, c), c.length > 1 && c.sort((e, t) => e - t);
		for (let e = 0; e < c.length; e++) i.push(a[c[e]]);
		return i;
	}
	_collectIndices(e, t, n, r) {
		for (let i = 0; i < t.length; i++) {
			let a = t[i];
			e.mark[a] !== n && (e.mark[a] = n, r.push(a));
		}
	}
	_colliderGrid() {
		let e = this.colliders;
		if (e.length < ne) return null;
		let t = this._cgrid;
		if (t && !this._cgridDirty && t.count === e.length) return t;
		let n = Math.max(1, Math.ceil((this.width + 32) / B)), r = Math.max(1, Math.ceil((this.depth + 32) / B));
		t = {
			ox: -16,
			oz: -16,
			nx: n,
			nz: r,
			cells: Array(n * r).fill(null),
			always: [],
			count: e.length,
			mark: new Uint32Array(e.length),
			stamp: 0,
			scratch: []
		};
		for (let i = 0; i < e.length; i++) {
			let a = e[i];
			if (!a) continue;
			let o, s, c, l;
			a.type === "circle" ? (o = a.x - a.r, s = a.x + a.r, c = a.z - a.r, l = a.z + a.r) : (o = a.minX, s = a.maxX, c = a.minZ, l = a.maxZ);
			let u = Math.floor((o - -16) / B), d = Math.floor((s - -16) / B), f = Math.floor((c - -16) / B), p = Math.floor((l - -16) / B);
			if (a.dynamic || !(Number.isFinite(u) && Number.isFinite(d) && Number.isFinite(f) && Number.isFinite(p)) || u < 0 || f < 0 || d >= n || p >= r || (d - u + 1) * (p - f + 1) > V) {
				t.always.push(i);
				continue;
			}
			for (let e = f; e <= p; e++) for (let r = u; r <= d; r++) {
				let a = e * n + r;
				(t.cells[a] ??= []).push(i);
			}
		}
		return this._cgrid = t, this._cgridDirty = !1, t;
	}
	_nextPush(e, t, n, r, i) {
		let a = Infinity, o = Math.max(0, Math.floor((t - r - e.ox) / B)), s = Math.min(e.nx - 1, Math.floor((t + r - e.ox) / B)), c = Math.max(0, Math.floor((n - r - e.oz) / B)), l = Math.min(e.nz - 1, Math.floor((n + r - e.oz) / B));
		for (let u = c; u <= l; u++) for (let c = o; c <= s; c++) {
			let o = e.cells[u * e.nx + c];
			o && (a = this._firstPush(o, t, n, r, i, a));
		}
		return a = this._firstPush(e.always, t, n, r, i, a), a === Infinity ? -1 : a;
	}
	_firstPush(e, t, n, r, i, a) {
		let o = this.colliders;
		for (let s = 0; s < e.length; s++) {
			let c = e[s];
			if (c <= i || c >= a) continue;
			let l = o[c];
			if (l.type === "circle") {
				let e = t - l.x, i = n - l.z, o = l.r + r;
				e * e + i * i < o * o && (a = c);
			} else {
				let e = t - d(t, l.minX, l.maxX), i = n - d(n, l.minZ, l.maxZ), o = e * e + i * i;
				(o === 0 || o < r * r) && (a = c);
			}
		}
		return a;
	}
	blockTile(e, t) {
		let n = this.tileAt(e, t);
		n && (n.blocked = !0, n.walkable = !1);
	}
	unblockTile(e, t) {
		let n = this.tileAt(e, t);
		n && (n.blocked = !1, n.walkable = n.type.walkable ?? !n.water);
	}
	addWalkSurface(e) {
		return e && !this.walkSurfaces.includes(e) && this.walkSurfaces.push(e), e;
	}
	removeWalkSurface(e) {
		let t = this.walkSurfaces.indexOf(e);
		t >= 0 && this.walkSurfaces.splice(t, 1);
	}
	_pointInCollider(e, t) {
		let n = this.colliders, r = this._colliderGrid();
		if (r) {
			let n = Math.floor((e - r.ox) / B), i = Math.floor((t - r.oz) / B), a = n >= 0 && i >= 0 && n < r.nx && i < r.nz ? r.cells[i * r.nx + n] : null;
			return !!a && this._pointInList(e, t, a) || this._pointInList(e, t, r.always);
		}
		for (let r = 0; r < n.length; r++) {
			let i = n[r];
			if (i.type === "circle") {
				let n = e - i.x, r = t - i.z;
				if (n * n + r * r < i.r * i.r) return !0;
			} else if (e > i.minX && e < i.maxX && t > i.minZ && t < i.maxZ) return !0;
		}
		return !1;
	}
	_pointInList(e, t, n) {
		let r = this.colliders;
		for (let i = 0; i < n.length; i++) {
			let a = r[n[i]];
			if (a.type === "circle") {
				let n = e - a.x, r = t - a.z;
				if (n * n + r * r < a.r * a.r) return !0;
			} else if (e > a.minX && e < a.maxX && t > a.minZ && t < a.maxZ) return !0;
		}
		return !1;
	}
	_standHeight(e, t, n, r) {
		let i = this._walkHeight(e, t);
		if (i === null) {
			let n = Math.floor(e), r = Math.floor(t), a = this.tileAt(n, r);
			if (!a || !a.walkable) return NaN;
			i = a.stairs ? this._stairRamp(a, e - n, t - r) : a.h;
		}
		return Math.abs(i - n) > r ? NaN : i;
	}
	_canOccupy(e, t, n, r, i) {
		if (e - n < 0 || t - n < 0 || e + n > this.width || t + n > this.depth) return !1;
		let a = this._standHeight(e, t, r, i);
		if (a !== a) return !1;
		for (let r = 0; r < J; r++) {
			let o = this._standHeight(e + le[r] * n, t + ue[r] * n, a, i);
			if (o !== o) return !1;
		}
		return !0;
	}
	_occupy(e, t, n, r, i) {
		if (!this._loose) return this._canOccupy(e, t, n, r, i);
		if (e - n < 0 || t - n < 0 || e + n > this.width || t + n > this.depth) return !1;
		let a = this._walkHeight(e, t), o = !0;
		if (a === null) {
			let n = Math.floor(e), r = Math.floor(t), i = this.tileAt(n, r);
			if (!i) return !1;
			a = i.stairs ? this._stairRamp(i, e - n, t - r) : i.h, o = i.walkable;
		}
		return this._loose === 1 ? o && Math.abs(a - r) <= i : a - r <= i;
	}
	_pushOut(e, t, n, r) {
		let i = this.colliders, a = this._colliderGrid();
		for (let r = 0; r < 3; r++) {
			let r = !1;
			for (let o = a ? this._nextPush(a, e, t, n, -1) : 0; a ? o >= 0 : o < i.length; o = a ? this._nextPush(a, e, t, n, o) : o + 1) {
				let a = i[o];
				if (a.type === "circle") {
					let i = e - a.x, o = t - a.z, s = a.r + n, c = i * i + o * o;
					if (c >= s * s) continue;
					let l = Math.sqrt(c);
					l < 1e-6 && (i = 0, o = 1, l = 1), e = a.x + i / l * s, t = a.z + o / l * s, r = !0;
				} else {
					let i = d(e, a.minX, a.maxX), o = d(t, a.minZ, a.maxZ), s = e - i, c = t - o, l = s * s + c * c;
					if (l === 0) {
						let i = e - a.minX, o = a.maxX - e, s = t - a.minZ, c = a.maxZ - t, l = Math.min(i, o, s, c);
						l === i ? e = a.minX - n : l === o ? e = a.maxX + n : t = l === s ? a.minZ - n : a.maxZ + n, r = !0;
					} else if (l < n * n) {
						let a = Math.sqrt(l);
						e = i + s / a * n, t = o + c / a * n, r = !0;
					}
				}
			}
			if (!r) break;
		}
		return r.x = e, r.z = t, r;
	}
	move(e, t, n, r = .3, i = .55, a = {
		x: 0,
		z: 0
	}) {
		let o = e.x, s = e.z, c = Math.hypot(t, n);
		if (c > 1e-9) {
			let e = Math.max(1, Math.ceil(c / Math.max(.04, r * .5))), a = t / e, l = n / e, u = this.getHeight(o, s), d = this._tmpPush;
			this._loose = 0, this._canOccupy(o, s, r, u, i) || (this._loose = Number.isNaN(this._standHeight(o, s, u, i)) ? 2 : 1);
			for (let t = 0; t < e; t++) {
				let e, t;
				if (this._loose && this._canOccupy(o, s, r, u, i) && (this._loose = 0), this._occupy(o + a, s + l, r, u, i)) e = o + a, t = s + l;
				else if (a !== 0 && this._occupy(o + a, s, r, u, i)) e = o + a, t = s;
				else if (l !== 0 && this._occupy(o, s + l, r, u, i)) e = o, t = s + l;
				else break;
				if (this.colliders.length && (this._pushOut(e, t, r, d), (d.x !== e || d.z !== t) && (this._occupy(d.x, d.z, r, u, i) ? (e = d.x, t = d.z) : (e = o, t = s))), e === o && t === s) break;
				o = e, s = t, u = this.getHeight(o, s);
			}
		}
		return a.x = o, a.z = s, a;
	}
	_topUV(e, t, n, r, i) {
		return i.u = t / r[0], i.v = -n / r[1], i;
	}
	_varies(e) {
		if (!this.options.uvVariation || !re.has(e)) return !1;
		let t = this.textures.meta(e).units;
		return Math.abs(t[0] - t[1]) < 1e-6;
	}
	_patchMaterial(e, t, n, r) {
		let i = n ? this.textures.meta(t).units : null, a = this.seed % 997 * .731 + 3.17, o = this._bounceUniform;
		e.onBeforeCompile = (e) => {
			e.uniforms.uLmBounce = o, e.uniforms.uSunColor = v.uSunColor, e.uniforms.uSunDirection = v.uSunDirection;
			let t = e.fragmentShader.replace("#include <common>", `#include <common>\n${ye}${n ? he : ""}`).replace("#include <lights_fragment_maps>", be);
			n && (e.uniforms.lmUnits = { value: new s(i[0], i[1]) }, e.uniforms.lmVarSeed = { value: a }, t = t.replace("#include <map_fragment>", ge).replace("#include <normal_fragment_maps>", _e)), r && (t = t.replace("#include <alphamap_fragment>", ve)), e.fragmentShader = t;
		}, e.customProgramCacheKey = () => `luminati-tilemap${n ? "-var" : ""}${r ? "-decal" : ""}`;
	}
	get wallBounce() {
		return this._bounceUniform.value;
	}
	set wallBounce(e) {
		this._bounceUniform.value = e;
	}
	_tint(e, t, n = 1) {
		let r = this.options.tintStrength * n, i = (g(e * .11, t * .11, this._tintOptsA ??= {
			octaves: 3,
			seed: this.seed + 7
		}) - .5) * 2.6, a = (g(e * .23 + 17.3, t * .23, this._tintOptsB ??= {
			octaves: 2,
			seed: this.seed + 13
		}) - .5) * 2.2, o = d(i, -1, 1) * r, s = 1 + d(a, -1, 1) * .045 * r, c = this._tmpTint;
		return c[0] = (1 + .045 * o) * s, c[1] = (1 + .012 * o) * s, c[2] = (1 - .06 * o) * s, c;
	}
	_sideTint(e, t, n, r, i) {
		let a = this.options.tintStrength, o = e * .9 + n * .9, s = (g(o * .38 + 3.1, t * .55, {
			octaves: 3,
			seed: this.seed + 17
		}) - .5) * 2.4, c = (g(o * .13, t * .2 + 9.7, {
			octaves: 2,
			seed: this.seed + 19
		}) - .5) * 2.2, l = 1 + d(s, -1, 1) * .11 * a, u = d(c, -1, 1) * a, f = this._tmpTint;
		if (f[0] = (1 + .05 * u) * l, f[1] = (1 + .015 * u) * l, f[2] = (1 - .06 * u) * l, i) {
			let e = (1 - p(.1, .75, r - t)) * .5 * a;
			f[0] *= 1 - .14 * e, f[1] *= 1 + .05 * e, f[2] *= 1 - .2 * e;
		}
		return f;
	}
	_wetness(e, t, n) {
		let r = Math.floor(e), i = Math.floor(t), a = 1e9;
		for (let o = -1; o <= 1; o++) for (let s = -1; s <= 1; s++) {
			let c = this.tileAt(r + s, i + o);
			if (!c || !c.water || c.waterSurface === null || n - c.waterSurface > .4 || n < c.waterSurface - .01) continue;
			let l = Math.max(c.i - e, 0, e - (c.i + 1)), u = Math.max(c.j - t, 0, t - (c.j + 1));
			a = Math.min(a, Math.hypot(l, u));
		}
		return a > .35 ? 0 : 1 - p(0, .35, a);
	}
	_aoTop(e, t, n) {
		let r = 0;
		for (let i = 0; i < 8; i++) {
			let a = 0;
			for (let r = 0; r < se.length; r++) {
				let o = se[r], s = this._surface(e + ae[i] * o, t + oe[i] * o) - n;
				if (s > .02) {
					let e = s / Math.sqrt(o * o + s * s) * (1 - o / ce);
					e > a && (a = e);
				}
			}
			r += a;
		}
		return d(1 - this.options.aoStrength * r / 8, .28, 1);
	}
	_aoWall(e, t, n, r, i, a, o) {
		let s = 1;
		s *= a ? _(.24, 1, p(0, 2.8, t - this.baseY)) : _(.58, 1, p(0, 1.15, t - i));
		let c = e + r.nx * .14, l = n + r.nz * .14, u = 0;
		for (let e = -1; e <= 1; e += 2) for (let n = 0; n < 2; n++) {
			let i = n === 0 ? .18 : .42;
			if (this._surface(c + r.rx * e * i, l + r.rz * e * i) > t + .02) {
				u += n === 0 ? .26 : .14;
				break;
			}
		}
		return s *= 1 - Math.min(.45, u), o !== null && (s *= _(.66, 1, p(.02, .4, o - t))), d(s, .2, 1);
	}
	_builder(e, t, n = !1) {
		let r = this.options.chunkSize, i = `${Math.floor(t.i / r)},${Math.floor(t.j / r)}`, a = `${e}@${i}`, o = this._builders.get(a);
		return o || (o = new Te(n), o.key = e, o.chunk = i, this._builders.set(a, o)), o;
	}
	_terrainMaterial(e, t = !1) {
		let n = `terrain:${e}${t ? ":var" : ""}`, r = this._materials.get(n);
		if (r) return r;
		let i = this.textures, a = i.normal(e), o = typeof i.pixels == "function" && i.pixels(e)?.normalScale || .6;
		return r = new l({
			map: i.get(e),
			vertexColors: !0
		}), a && (r.normalMap = a, r.normalScale = new s(o, o)), r.name = `TileMap:${e}${t ? ":var" : ""}`, this._patchMaterial(r, e, t, !1), this._materials.set(n, r), r;
	}
	_maskTex() {
		if (!this._maskTexture) {
			this._maskPixels = Ee(this.seed + 9001);
			let e = this._maskPixels.toTexture({
				wrap: "repeat",
				mipmaps: !1,
				srgb: !1,
				name: "TileMap:decalMask"
			});
			e.channel = 1, this._maskTexture = e;
		}
		return this._maskTexture;
	}
	_decalMaterial(e, t = !1) {
		let n = `decal:${e}${t ? ":var" : ""}`, r = this._materials.get(n);
		if (r) return r;
		let i = this.textures, a = i.normal(e), o = typeof i.pixels == "function" && i.pixels(e)?.normalScale || .6;
		return r = new l({
			map: i.get(e),
			alphaMap: this._maskTex(),
			alphaTest: .5,
			vertexColors: !0,
			side: 2,
			polygonOffset: !0,
			polygonOffsetFactor: -1,
			polygonOffsetUnits: -2
		}), a && (r.normalMap = a, r.normalScale = new s(o, o)), r.name = `TileMap:decal:${e}${t ? ":var" : ""}`, this._patchMaterial(r, e, t, !0), this._materials.set(n, r), r;
	}
	_build() {
		T(this.buildSteps());
	}
	*buildSteps() {
		let e = this.width;
		for (let t = 0; t < this.depth; t++) for (let n = 0; n < e; n++) {
			let r = this._tiles[t * e + n];
			r && (this._emitTile(r), yield);
		}
		if (this.options.fringes) for (let t = 0; t < this.depth; t++) for (let n = 0; n < e; n++) {
			let r = this._tiles[t * e + n];
			r && (this._emitFringesAt(n, t, r), yield);
		}
		yield* this._flushBuilderSteps();
	}
	_emitTile(e) {
		e.stairs ? this._emitStairs(e) : this._emitTop(e);
		for (let t of U) this._emitSides(e, H[t]);
	}
	_flushBuilders() {
		return T(this._flushBuilderSteps());
	}
	*_flushBuilderSteps() {
		let e = [];
		for (let t of this._builders.values()) {
			if (!t.count) continue;
			let [r, i] = t.key.split(":"), a = r.endsWith("X"), o = a ? r.slice(0, -1) : r, s = o === "fringe" || o === "brim" || o === "skirt", c = !a && (o === "top" || o === "fringe" || o === "brim") && this._varies(i), l = s ? this._decalMaterial(i, c) : this._terrainMaterial(i, c), u = new n(t.toGeometry(), l);
			u.name = t.key, u.castShadow = o !== "fringe" && o !== "top", u.receiveShadow = !0, u.matrixAutoUpdate = !1, u.userData.kind = o, u.userData.chunk = t.chunk, s && (u.renderOrder = 1), e.push(u), yield;
		}
		e.sort((e, t) => e.renderOrder - t.renderOrder || (e.name < t.name ? -1 : 1));
		for (let t of e) this.object.add(t);
		return this.object.updateMatrixWorld(!0), this._builders.clear(), e;
	}
	consolidateChunks(e = {}) {
		return T(this.consolidateChunkSteps(e));
	}
	*consolidateChunkSteps({ maxTriangles: e = 48e3, maxExtent: t = Infinity, minTriangles: r = 0 } = {}) {
		let i = this.options.chunkSize, a = /* @__PURE__ */ new Map();
		for (let e of this.object.children) {
			if (!e.isMesh || e.userData.chunks) continue;
			let t = `${e.name}|${e.material.uuid}|${+e.castShadow}|${e.renderOrder}`, n = a.get(t);
			n || a.set(t, n = []), n.push(e);
		}
		let o = this.object.children.length, s = (e) => e.userData.chunk.split(",").map((e) => (Number(e) + .5) * i);
		for (let i of a.values()) {
			if (i.length < 2) continue;
			let a = E(i, {
				x: (e) => s(e)[0],
				z: (e) => s(e)[1],
				weight: (e) => j(e.geometry),
				maxWeight: e,
				maxExtent: t,
				minWeight: r
			});
			for (let e of a) {
				if (e.length < 2) continue;
				let t = x(e.map((e) => e.geometry), !1);
				if (!t) continue;
				let r = e[0], i = new n(t, r.material);
				i.name = r.name, i.castShadow = r.castShadow, i.receiveShadow = r.receiveShadow, i.matrixAutoUpdate = !1, i.renderOrder = r.renderOrder, i.userData.kind = r.userData.kind, i.userData.chunks = e.map((e) => e.userData.chunk);
				for (let t of e) t.removeFromParent(), t.geometry.dispose();
				this.object.add(i), yield;
			}
		}
		let c = [...this.object.children].sort((e, t) => e.renderOrder - t.renderOrder || (e.name < t.name ? -1 : +(e.name > t.name)));
		this.object.clear();
		for (let e of c) this.object.add(e);
		return this.object.updateMatrixWorld(!0), o - this.object.children.length;
	}
	rebuildRect(e, t) {
		let n = this.updateTiles(e, t, { rebase: !1 });
		return n ? (this.rebuildChunks(n), n) : null;
	}
	updateTiles(e, t, { rebase: n = !0 } = {}) {
		let r = this.width, i = this.depth, a = e?.tiles ?? [];
		if (a.length !== i || a.reduce((e, t) => Math.max(e, t.length), 0) !== r || (e.waterLevel ?? R) !== this.waterLevel) return null;
		let o = Math.max(0, Math.floor(t.minI)), s = Math.min(r - 1, Math.floor(t.maxI)), c = Math.max(0, Math.floor(t.minJ)), l = Math.min(i - 1, Math.floor(t.maxJ));
		if (s < o || l < c) return [];
		let d = e.legend ?? {}, f = e.heights ?? [], p = /* @__PURE__ */ new Map();
		for (let e = c; e <= l; e++) for (let t = o; t <= s; t++) {
			let n = a[e][t] ?? " ", i = d[n];
			p.set(e * r + t, i && !i.void ? Ce(n, i, (f[e] ?? "")[t], t, e) : null);
		}
		let m = Infinity, h = -Infinity;
		for (let e = 0; e < this._tiles.length; e++) {
			let t = p.has(e) ? p.get(e) : this._tiles[e];
			t && (m = Math.min(m, t.h), h = Math.max(h, t.h + (t.stairs ? u : 0)));
		}
		if (!Number.isFinite(m) || !n && m < this.baseY + this.options.baseDepth - z) return null;
		this.map = e;
		for (let [e, t] of p) if (this._tiles[e] = t, t && t.water) {
			let e = this._computeWaterSurface(t, this.waterLevel);
			t.waterSurface = e.level, t.waterSource = e.source;
		}
		this.minHeight = m, this.maxHeight = h;
		let g = this.options.chunkSize, _ = m - this.options.baseDepth;
		if (n && Math.abs(_ - this.baseY) > z) {
			this.baseY = _;
			let e = [];
			for (let t = 0; t * g < i; t++) for (let n = 0; n * g < r; n++) e.push(`${n},${t}`);
			return e;
		}
		let v = Math.max(0, Math.floor((o - 2) / g)), y = Math.min(Math.floor((r - 1) / g), Math.floor((s + 2) / g)), b = Math.max(0, Math.floor((c - 2) / g)), x = Math.min(Math.floor((i - 1) / g), Math.floor((l + 2) / g)), S = [];
		for (let e = b; e <= x; e++) for (let t = v; t <= y; t++) S.push(`${t},${e}`);
		return S;
	}
	rebuildChunks(e) {
		let t = this.width, n = this.depth, r = this.options.chunkSize, i = new Set(e);
		if (!i.size) return [];
		let a = !0;
		for (; a;) {
			a = !1;
			for (let e of this.object.children) {
				let t = e.userData.chunks;
				if (t && t.some((e) => i.has(e))) for (let e of t) i.has(e) || (i.add(e), a = !0);
			}
		}
		for (let e of [...this.object.children]) e.isMesh && (i.has(e.userData.chunk) || e.userData.chunks?.some((e) => i.has(e))) && (e.removeFromParent(), e.geometry.dispose());
		let o = [...i].map((e) => e.split(",").map(Number)).filter(([e, i]) => e >= 0 && i >= 0 && e * r < t && i * r < n);
		o.sort((e, t) => e[1] - t[1] || e[0] - t[0]);
		for (let [e, i] of o) {
			let a = i * r, o = Math.min(n, a + r), s = e * r, c = Math.min(t, s + r);
			for (let e = a; e < o; e++) for (let n = s; n < c; n++) {
				let r = this._tiles[e * t + n];
				r && (this._emitTile(r), this.options.fringes && this._emitFringesAt(n, e, r));
			}
		}
		return this._flushBuilders();
	}
	*rebuildChunkSteps(e) {
		let t = this.width, n = this.depth, r = this.options.chunkSize, [i, a] = e.split(",").map(Number);
		if (!(i >= 0 && a >= 0 && i * r < t && a * r < n)) return [];
		let o = /* @__PURE__ */ new Map(), s = this._builders, c = a * r, l = Math.min(n, c + r), u = i * r, d = Math.min(t, u + r);
		for (let e = c; e < l; e++) {
			this._builders = o;
			try {
				for (let n = u; n < d; n++) {
					let r = this._tiles[e * t + n];
					r && (this._emitTile(r), this.options.fringes && this._emitFringesAt(n, e, r));
				}
			} finally {
				this._builders = s;
			}
			e < l - 1 && (yield);
		}
		for (let t of [...this.object.children]) t.isMesh && t.userData.chunk === e && (t.removeFromParent(), t.geometry.dispose());
		this._builders = o;
		try {
			return this._flushBuilders();
		} finally {
			this._builders = s;
		}
	}
	_emitTop(e) {
		let t = e.type.top;
		if (!t) return;
		let n = this.textures.meta(t).units, r = this._builder(`${e.type.uvVariation === !1 ? "topX" : "top"}:${t}`, e), i = this._tmpUV, a = r.count, o = e.water ? .4 : 1;
		for (let t = 0; t <= I; t++) for (let a = 0; a <= I; a++) {
			let s = e.i + a / I, c = e.j + t / I;
			this._topUV(e, s, c, n, i);
			let l = this._aoTop(s, c, e.h), u = this._tint(s, c, o), d = e.water ? 0 : this._wetness(s, c, e.h) * .2;
			r.v(s, e.h, c, 0, 1, 0, i.u, i.v, u[0] * l ** 1.08 * (1 - d * 1.1), u[1] * l * (1 - d), u[2] * l ** .9 * (1 - d * .6));
		}
		for (let e = 0; e < I; e++) for (let t = 0; t < I; t++) {
			let n = a + e * 5 + t;
			r.quad(n, n + 5, n + 5 + 1, n + 1);
		}
	}
	_emitStairs(e) {
		let t = e.type.top;
		if (!t) return;
		let n = e.stairs;
		H[n];
		let r = this.textures.meta(t).units, i = e.type.riser || t, a = this.textures.meta(i).units, o = this._builder(`top:${t}`, e), s = this._builder(`side:${i}`, e), c = this._tmpUV;
		for (let t = 0; t < N; t++) {
			let i = e.h + (t + 1) * P, l = t / N, u = (t + 1) / N, d = 0, f = 1, p = 0, m = 1;
			n === "N" ? (p = 1 - u, m = 1 - l) : n === "S" ? (p = l, m = u) : n === "E" ? (d = l, f = u) : (d = 1 - u, f = 1 - l);
			let h = n === "N" || n === "S" ? I : 1, g = n === "N" || n === "S" ? 1 : I, v = o.count;
			for (let a = 0; a <= g; a++) for (let s = 0; s <= h; s++) {
				let u = e.i + _(d, f, s / h), v = e.j + _(p, m, a / g);
				this._topUV(e, u, v, r, c);
				let y = we(n, u - e.i, v - e.j), b = Math.abs(y - l) < 1e-4, x = this._aoTop(u, v, i);
				!b && t < 3 && (x *= .68);
				let S = b ? 1.22 : 1;
				Oe(o, u, i, v, 0, 1, 0, c.u, c.v, x * S);
			}
			let y = h + 1;
			for (let e = 0; e < g; e++) for (let t = 0; t < h; t++) {
				let n = v + e * y + t;
				o.quadN(n, n + y, n + y + 1, n + 1, 0, 1, 0);
			}
			let b = H[W[n]], x = e.h + t * P, S = e.i + .5, C = e.j + .5;
			n === "N" ? C = e.j + 1 - l : n === "S" ? C = e.j + l : S = n === "E" ? e.i + l : e.i + 1 - l;
			let w = S - b.rx * .5, T = C - b.rz * .5, E = s.count;
			for (let e = 0; e <= I; e++) {
				let t = e / I, n = w + b.rx * t, r = T + b.rz * t, o = (n * b.rx + r * b.rz) / a[0];
				Oe(s, n, x, r, b.nx, 0, b.nz, o, x / a[1], .5), Oe(s, n, i, r, b.nx, 0, b.nz, o, i / a[1], .9);
			}
			for (let e = 0; e < I; e++) {
				let t = E + e * 2;
				s.quadN(t, t + 2, t + 3, t + 1, b.nx, 0, b.nz);
			}
		}
	}
	_edgeProfile(e, t, n) {
		if (!e) return n[0] = n[1] = n[2] = n[3] = this.baseY, n;
		if (!e.stairs || W[e.stairs] === t) return n[0] = n[1] = n[2] = n[3] = e.h, n;
		for (let r = 0; r < 4; r++) {
			let i = (r + .5) / 4, a, o;
			t === "N" ? (a = i, o = .001) : t === "S" ? (a = i, o = .999) : t === "E" ? (a = .999, o = i) : (a = .001, o = i), n[r] = this._topAt(e, a, o);
		}
		return n;
	}
	_emitSides(e, t) {
		let n = this.tileAt(e.i + t.dx, e.j + t.dz), r = this._edgeProfile(e, t.key, this._ep0 ||= [
			0,
			0,
			0,
			0
		]), i = this._edgeProfile(n, W[t.key], this._ep1 ||= [
			0,
			0,
			0,
			0
		]), a = !n, o = 0;
		for (; o < 4;) {
			let s = o + 1;
			for (; s < 4 && Math.abs(r[s] - r[o]) < z && Math.abs(i[s] - i[o]) < z;) s++;
			let c = r[o], l = i[o];
			c > l + z && this._emitFace(e, t, o / 4, s / 4, l, c, a, n && n.water ? n.waterSurface : null), o = s;
		}
	}
	_edgePoint(e, t, n) {
		let r = this._ptmp ||= {
			x: 0,
			z: 0
		};
		switch (t.key) {
			case "N":
				r.x = e.i + n, r.z = e.j;
				break;
			case "S":
				r.x = e.i + n, r.z = e.j + 1;
				break;
			case "E":
				r.x = e.i + 1, r.z = e.j + n;
				break;
			default: r.x = e.i, r.z = e.j + n;
		}
		return r;
	}
	_emitFace(e, t, n, r, i, a, o, s = null) {
		let c = e.type, l = c.lip || null, u = c.side || l || c.top;
		if (!u) return;
		let d = l ? Math.max(i, a - F) : a, f = G.has(c.top) && !e.stairs && c.overhang !== !1, p = this.options.overhangs && f && l && a - i >= .24 && Math.abs(a - e.h) < z, m = p ? a : null;
		s !== null && (s < i || s > a + .2) && (s = null), l && this._faceBand(e, t, n, r, d, a, l, !0, a, i, o, m, s), d > i + z && this._faceBand(e, t, n, r, i, d, u, !1, a, i, o, m, s), p && this._emitOverhang(e, t, n, r, a, a - i);
	}
	_faceBand(e, t, n, r, i, a, o, s, c, l, u, d, m = null) {
		let h = this.textures.meta(o), g = h.units, v = this._builder(`side:${o}`, e), y = [i];
		for (let e = Math.floor(i / .5 + 1 - z) * .5; e < a - z; e += .5) e > i + z && y.push(e);
		if (d !== null && d - .25 > i + z && d - .25 < a - z && !y.some((e) => Math.abs(e - (d - .25)) < z) && y.push(d - .25), m !== null) for (let e of [m, m + .14]) e > i + z && e < a - z && !y.some((t) => Math.abs(t - e) < z) && y.push(e);
		y.push(a), y.sort((e, t) => e - t);
		let b = 0;
		this.options.sideVariation && (b = Math.floor(f(e.i * 4 + t.idx, e.j, this.seed + 303) * h.px[0]) / h.px[0]);
		let x = this._edgePoint(e, t, n), S = x.x, C = x.z, w = this._edgePoint(e, t, r), T = w.x, E = w.z, D = S * t.rx + C * t.rz, O = T * t.rx + E * t.rz, k = D <= O ? S : T, A = D <= O ? C : E, ee = D <= O ? T : S, j = D <= O ? E : C, M = Math.max(1, Math.round((r - n) * I)), N = v.count;
		for (let e = 0; e <= M; e++) {
			let n = e / M, r = _(k, ee, n), i = _(A, j, n), a = (r * t.rx + i * t.rz) / g[0] + b;
			for (let e = 0; e < y.length; e++) {
				let n = y[e], o = s ? (n - c) / g[1] + 1 : n / g[1], f = this._aoWall(r, n, i, t, l, u, d), h = this._sideTint(r, n, i, c, d !== null), _ = m === null ? 0 : n <= m + z ? .3 : .3 * (1 - p(m, m + .14, n));
				v.v(r, n, i, t.nx, 0, t.nz, a, o, h[0] * f ** 1.06 * (1 - _), h[1] * f * (1 - _ * .9), h[2] * f ** .92 * (1 - _ * .6));
			}
		}
		let P = y.length;
		for (let e = 0; e < M; e++) for (let t = 0; t < P - 1; t++) {
			let n = N + e * P + t, r = N + (e + 1) * P + t;
			v.quad(n, r, r + 1, n + 1);
		}
	}
	_convexEnd(e, t, n, r) {
		let i = +(t.dx === 0), a = t.dx === 0 ? 0 : 1, o = this._edgePoint(e, t, n < 0 ? 0 : 1), s = o.x + i * n * .06 - t.nx * .06, c = o.z + a * n * .06 - t.nz * .06;
		return this._surface(s, c) < r - .2;
	}
	_emitOverhang(e, t, n, r, i, a) {
		let o = e.type.top, s = this.textures.meta(o).units, c = e.type.uvVariation === !1 ? "X" : "", l = this._builder(`brim${c}:${o}`, e, !0), u = this._tmpUV, d = +(t.dx === 0), f = t.dx === 0 ? 0 : 1, p = n === 0 && this._convexEnd(e, t, -1, i), m = r === 1 && this._convexEnd(e, t, 1, i), h = $, g = this._edgePoint(e, t, n), v = g.x, y = g.z;
		g = this._edgePoint(e, t, r);
		let b = g.x, x = g.z, S = v - (p ? d * h : 0), C = y - (p ? f * h : 0), w = b + (m ? d * h : 0), T = x + (m ? f * h : 0), E = t.dx === 0 ? S : v, D = t.dx === 0 ? C : y, O = t.dx === 0 ? w : b, k = t.dx === 0 ? T : x, A = Math.max(1, Math.round(Math.hypot(O - E, k - D) * I)), ee = 1 - (Z.brim - me * 16) / X, j = 1 - (Z.brim + $ * 16) / X, M = l.count;
		for (let n = 0; n <= A; n++) {
			let r = n / A, a = _(E, O, r), o = _(D, k, r), c = a * d + o * f, p = this._tint(a, o);
			for (let n = 0; n < 2; n++) {
				let r = n ? $ : -me, d = a + t.nx * r, f = o + t.nz * r;
				this._topUV(e, d, f, s, u), l.v(d, i + 6e-4 * (t.idx + 1), f, 0, 1, 0, u.u, u.v, p[0], p[1], p[2], c / 4, n ? j : ee);
			}
		}
		for (let e = 0; e < A; e++) {
			let t = M + e * 2;
			l.quadN(t, t + 1, t + 3, t + 2, 0, 1, 0);
		}
		let N = Math.min(pe, a * .72), P = t.nx * $, F = t.nz * $, L = S * t.rx + C * t.rz, R = w * t.rx + T * t.rz, z = (L <= R ? S : w) + P, te = (L <= R ? C : T) + F, B = (L <= R ? w : S) + P, ne = (L <= R ? T : C) + F, V = Math.max(1, Math.round(Math.hypot(B - z, ne - te) * I));
		l = this._builder(`skirt:${o}`, e, !0), M = l.count;
		for (let e = 0; e <= V; e++) {
			let n = e / V, r = _(z, B, n), a = _(te, ne, n), o = (r * t.rx + a * t.rz) / s[0], c = (r - P) * d + (a - F) * f, u = this._tint(r, a);
			for (let e = 0; e < 2; e++) {
				let n = e ? i : i - N, d = 1 - (Z.skirt + (e ? 0 : N * 16)) / X, f = e ? 1 : .82;
				l.v(r, n, a, t.nx, 0, t.nz, o, -n / s[1], u[0] * f, u[1] * f, u[2] * f, c / 4, d);
			}
		}
		for (let e = 0; e < V; e++) {
			let n = M + e * 2;
			l.quadN(n, n + 2, n + 3, n + 1, t.nx, 0, t.nz);
		}
	}
	_isGrassSource(e, t) {
		if (!e || e.stairs || e.water || e.type.fringe === !1 || Math.abs(e.h - t.h) > z) return !1;
		let n = e.type.top;
		if (!G.has(n)) return !1;
		let r = t.type.top;
		return K.has(r) ? !0 : G.has(r) && (q[n] ?? 0) > (q[r] ?? 0);
	}
	_emitFringes() {
		this.forEachTile((e, t, n) => this._emitFringesAt(e, t, n));
	}
	_emitFringesAt(e, t, n) {
		let r = this._tmpUV;
		{
			if (n.stairs || n.water || n.type.fringe === !1 || !K.has(n.type.top) && !G.has(n.type.top)) return;
			let i = [];
			for (let r of U) {
				let a = H[r], o = this.tileAt(e + a.dx, t + a.dz);
				i.push(this._isGrassSource(o, n) ? o : null);
			}
			for (let a = 0; a < 4; a++) {
				let o = i[a];
				if (!o) continue;
				let s = H[U[a]], c = o.type.top, l = this.textures.meta(c).units, u = this._builder(`fringe${o.type.uvVariation === !1 ? "X" : ""}:${c}`, n, !0), d = +(s.dx === 0), p = s.dx === 0 ? 0 : 1, m = f(e + s.idx * 7, t, this.seed + 404) < .5 ? Z.stripA : Z.stripB, h = n.h + xe(c, s.idx), g = this._edgePoint(n, s, 0), _ = g.x, v = g.z, y = u.count;
				for (let e = 0; e <= I; e++) {
					let t = e / I;
					for (let e = 0; e < 2; e++) {
						let i = e ? Q : -me, a = _ + d * t - s.nx * i, c = v + p * t - s.nz * i;
						this._topUV(o, a, c, l, r);
						let f = a * d + c * p, g = this._aoTop(a, c, n.h), y = this._tint(a, c), b = 1 - (m + i * 16) / X;
						u.v(a, h, c, 0, 1, 0, r.u, r.v, y[0] * g ** 1.08, y[1] * g, y[2] * g ** .9, f / 4, b);
					}
				}
				for (let e = 0; e < I; e++) {
					let t = y + e * 2;
					u.quadN(t, t + 1, t + 3, t + 2, 0, 1, 0);
				}
			}
			let a = [
				[
					-1,
					-1,
					0,
					3
				],
				[
					1,
					-1,
					0,
					1
				],
				[
					1,
					1,
					2,
					1
				],
				[
					-1,
					1,
					2,
					3
				]
			];
			for (let o = 0; o < 4; o++) {
				let [s, c, l, u] = a[o];
				if (i[l] || i[u]) continue;
				let d = this.tileAt(e + s, t + c);
				if (!this._isGrassSource(d, n)) continue;
				let p = d.type.top, m = this.textures.meta(p).units, h = this._builder(`fringe${d.type.uvVariation === !1 ? "X" : ""}:${p}`, n, !0), g = e + +(s > 0), _ = t + +(c > 0), v = Math.floor(f(e, t, this.seed + 505 + o) * fe) * de + 1, y = n.h + xe(p, 4), b = h.count;
				for (let e = 0; e < 2; e++) for (let t = 0; t < 2; t++) {
					let i = t * Q, a = e * Q, o = g - s * i, l = _ - c * a;
					this._topUV(d, o, l, m, r);
					let u = this._tint(o, l), f = this._aoTop(o, l, n.h), p = (v + (t ? Q * 16 : 0)) / Y, b = 1 - (Z.corner + (e ? Q * 16 : 0)) / X;
					h.v(o, y, l, 0, 1, 0, r.u, r.v, u[0] * f ** 1.08, u[1] * f, u[2] * f ** .9, p, b);
				}
				h.quadN(b, b + 2, b + 3, b + 1, 0, 1, 0);
			}
		}
	}
	get stats() {
		let e = 0, t = 0, n = 0;
		return this.object.traverse((r) => {
			r.isMesh && (e++, t += r.geometry.index.count / 3, n += r.geometry.attributes.position.count);
		}), {
			meshes: e,
			triangles: t,
			vertices: n,
			materials: this._materials.size
		};
	}
	dispose() {
		this.object.traverse((e) => {
			e.isMesh && e.geometry.dispose();
		});
		for (let e of this._materials.values()) e.dispose();
		this._materials.clear(), this._maskTexture?.dispose(), this._maskTexture = null, this.object.removeFromParent(), this.object.clear();
	}
};
function Oe(e, t, n, r, i, a, o, s, c, l) {
	return e.v(t, n, r, i, a, o, s, c, l ** 1.06, l, l ** .92);
}
//#endregion
export { k as a, A as c, x as d, w as f, M as i, j as l, ie as n, E as o, C as p, ee as r, D as s, De as t, T as u };
